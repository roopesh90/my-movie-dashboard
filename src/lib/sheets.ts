import { Movie, MovieSheet, TMDBMovieDetails } from '@/types/movie';
import languages from '@/data/languages.json';
import { getTMDBCache, setTMDBCache } from './tmdbCache';

// Configuration for your Google Sheet
// Read from environment variables
const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const SITE_OWNER = process.env.NEXT_PUBLIC_SITE_OWNER || 'Site Owner';

// Validate that SHEET_ID is configured
if (!SHEET_ID) {
  throw new Error(
    'NEXT_PUBLIC_SHEET_ID environment variable is not set. Please check your .env file.'
  );
}

// Sheet names/ranges for each category (includes column F for image URL)
const SHEET_RANGES = {
  outstanding: 'Outstanding!A2:F',
  mediocre: 'Mediocre!A2:F',
  shit: 'Shit!A2:F',
  towatch: 'To Watch!A2:F',
};

const languageLookup = new Map<string, string>(
  languages.flatMap((lang) => [
    [lang.name.toLowerCase(), lang.code.toLowerCase()],
    [lang.code.toLowerCase(), lang.code.toLowerCase()],
  ])
);

const languageNameLookup = new Map<string, string>(
  languages.flatMap((lang) => [
    [lang.code.toLowerCase(), lang.name],
    [lang.name.toLowerCase(), lang.name],
  ])
);

const languageAliases: Record<string, string> = {
  eng: 'en',
  english: 'en',
  hindi: 'hi',
  mandarin: 'zh',
  cantonese: 'zh',
  korean: 'ko',
  japanese: 'ja',
  russian: 'ru',
  spanish: 'es',
  portuguese: 'pt',
  german: 'de',
  french: 'fr',
  italian: 'it',
};

/**
 * Searches for a movie on TMDB and returns the poster image URL
 * Uses movie name, language, and year for more accurate results
 */
async function fetchTMDBMovieData(
  movieName: string,
  language?: string,
  year?: string
): Promise<{ imageUrl?: string; details?: TMDBMovieDetails }> {
  if (!TMDB_API_KEY) {
    console.debug(`TMDB API key not configured. Skipping image fetch for "${movieName}"`);
    return {};
  }

  try {
    const languageCode = language ? getLanguageCode(language) : null;
    const cacheKey = `${movieName.toLowerCase()}|${languageCode || 'any'}|${year || 'any'}`;
    
    // Check cache first
    const cached = getTMDBCache(cacheKey);
    if (cached) {
      return cached;
    }

    console.debug(`Attempting TMDB fetch for "${movieName}" (${language || 'any'}, ${year || 'any year'})`);
    
    // Build URL with query parameters for more accurate search
    const params = new URLSearchParams({
      query: movieName,
      include_adult: 'false',
      language: 'en-US',
    });
    
    // Add language if provided (convert to TMDB language code format)
    if (languageCode) {
      params.append('original_language', languageCode);
    }
    
    // Add year if provided (TMDB uses primary_release_year parameter)
    if (year && /^\d{4}$/.test(year)) {
      params.append('primary_release_year', year);
    }
    
    const searchUrl = `https://api.themoviedb.org/3/search/movie?${params.toString()}`;
    
    console.debug(`[TMDB] Search URL: ${searchUrl}`);
    
    const response = await fetchWithRetry(searchUrl, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    });

    if (!response) {
      console.warn(`Failed to fetch TMDB data for "${movieName}" - network error`);
      return {};
    }

    if (!response.ok) {
      const errorData = await response.json() as { status_message?: string };
      console.warn(`TMDB API error (${response.status}) for "${movieName}": ${errorData.status_message || response.statusText}`);
      return {};
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await response.json() as any;
    
    // Try to find the best match based on original_language and release year if provided
    const results: any[] = Array.isArray(data.results) ? data.results : [];
    const normalizedYear = year && /^\d{4}$/.test(year) ? year : null;
    const normalizedLanguage = languageCode || null;

    const scored = results
      .map((result) => {
        const releaseYear = result.release_date?.substring(0, 4) || null;
        const originalLanguage = result.original_language || null;
        const yearMatch = normalizedYear && releaseYear === normalizedYear ? 1 : 0;
        const languageMatch = normalizedLanguage && originalLanguage === normalizedLanguage ? 1 : 0;
        return {
          result,
          score: yearMatch + languageMatch,
        };
      })
      .sort((a, b) => b.score - a.score);

    let movie = scored[0]?.result;

    // If we have both filters, prefer exact matches for both
    if (normalizedYear && normalizedLanguage) {
      movie =
        results.find((result) => {
          const releaseYear = result.release_date?.substring(0, 4);
          return (
            releaseYear === normalizedYear &&
            result.original_language === normalizedLanguage
          );
        }) || movie;
    }

    if (!movie?.id) {
      console.debug(`No TMDB match found for "${movieName}"`);
      return {};
    }

    const imageUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : undefined;

    // Fetch videos from the videos endpoint
    let videos: any[] = [];
    try {
      const videosUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`;
      const videosResponse = await fetchWithRetry(videosUrl, {
        headers: {
          'Authorization': `Bearer ${TMDB_API_KEY}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      });
      
      if (videosResponse.ok) {
        const videosData = await videosResponse.json() as any;
        videos = Array.isArray(videosData.results)
          ? videosData.results
              .filter((v: any) => (v.site === 'YouTube' || v.site === 'Vimeo') && v.key)
              .map((v: any) => ({
                id: v.id,
                key: v.key,
                name: v.name || '',
                site: v.site,
                type: v.type || 'Video',
                official: v.official === true,
                publishedAt: v.published_at || undefined,
              }))
              .sort((a: any, b: any) => {
                // Prioritize: official trailers > trailers > teasers > others
                const typeOrder: Record<string, number> = {
                  Trailer: a.official ? 1 : 2,
                  Teaser: 3,
                  Clip: 4,
                  Featurette: 5,
                };
                return (typeOrder[a.type] || 10) - (typeOrder[b.type] || 10);
              })
          : [];
      }
    } catch (error) {
      console.debug(`Failed to fetch videos for "${movieName}":`, error);
    }

    // Fetch images from the images endpoint
    let images: any[] = [];
    try {
      const imagesUrl = `https://api.themoviedb.org/3/movie/${movie.id}/images`;
      const imagesResponse = await fetchWithRetry(imagesUrl, {
        headers: {
          'Authorization': `Bearer ${TMDB_API_KEY}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      });
      
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json() as any;
        const backdrops = Array.isArray(imagesData.backdrops)
          ? imagesData.backdrops.slice(0, 5).map((img: any) => ({
              filePath: `https://image.tmdb.org/t/p/w780${img.file_path}`,
              aspectRatio: img.aspect_ratio || 1.78,
              height: img.height || 0,
              width: img.width || 0,
              type: 'backdrop' as const,
            }))
          : [];
        const posters = Array.isArray(imagesData.posters)
          ? imagesData.posters.slice(0, 3).map((img: any) => ({
              filePath: `https://image.tmdb.org/t/p/w500${img.file_path}`,
              aspectRatio: img.aspect_ratio || 0.67,
              height: img.height || 0,
              width: img.width || 0,
              type: 'poster' as const,
            }))
          : [];
        images = [...backdrops, ...posters];
      }
    } catch (error) {
      console.debug(`Failed to fetch images for "${movieName}":`, error);
    }

    const details: TMDBMovieDetails = {
      id: movie.id,
      title: movie.title || movie.original_title || movieName,
      originalTitle: movie.original_title || undefined,
      overview: movie.overview || '',
      releaseDate: movie.release_date || undefined,
      genres: [],
      rating: typeof movie.vote_average === 'number' ? movie.vote_average : undefined,
      voteCount: typeof movie.vote_count === 'number' ? movie.vote_count : undefined,
      originalLanguage: movie.original_language || undefined,
      posterPath: imageUrl,
      backdropPath: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
        : undefined,
      imdbId: movie.external_ids?.imdb_id || undefined,
      popularity: typeof movie.popularity === 'number' ? movie.popularity : undefined,
      videos: videos.length > 0 ? videos : undefined,
      images: images.length > 0 ? images : undefined,
    };

    if (imageUrl) {
      console.debug(`✓ Fetched TMDB image for "${movieName}" (${movie.title}, ${movie.release_date?.substring(0, 4)})`);
    } else {
      console.debug(`No poster found on TMDB for "${movieName}"`);
    }

    const result = { imageUrl, details };
    setTMDBCache(cacheKey, result);
    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn(`⚠️ Could not fetch TMDB data for "${movieName}": ${errorMsg}`);
    // Return empty object to gracefully handle missing TMDB data
    return {};
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2,
  timeoutMs = 8000
): Promise<Response | null> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      const message = error instanceof Error ? error.message : String(error);
      const shouldRetry =
        attempt < retries &&
        (message.includes('ECONNRESET') ||
          message.includes('ETIMEDOUT') ||
          message.includes('network') ||
          message.includes('fetch failed') ||
          message.includes('aborted'));

      if (!shouldRetry) {
        // Log warning instead of throwing
        console.warn(`Fetch failed after ${attempt + 1} attempts:`, message);
        return null;
      }

      const backoffMs = 250 * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  // Return null instead of throwing
  const errorMsg = lastError instanceof Error ? lastError.message : 'Unknown fetch error';
  console.warn(`Fetch failed after ${retries + 1} attempts:`, errorMsg);
  return null;
}

/**
 * Convert language names to TMDB language codes
 * Supports common languages from the movie database
 */
function getLanguageCode(language: string): string | null {
  const normalized = language.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const lookup = languageLookup.get(normalized);
  if (lookup) {
    return lookup;
  }

  return languageAliases[normalized] || null;
}

/**
 * Convert language codes to display names for UI
 */
function getLanguageName(language: string): string {
  const normalized = language.trim().toLowerCase();
  if (!normalized) {
    return language;
  }

  const direct = languageNameLookup.get(normalized);
  if (direct) {
    return direct;
  }

  const aliasCode = languageAliases[normalized];
  if (aliasCode) {
    return languageNameLookup.get(aliasCode) || language;
  }

  return language;
}

/**
 * Fetches movie data from Google Sheets using the Google Visualization API
 * This method doesn't require authentication
 */
export async function fetchMoviesFromSheet(
  category: keyof typeof SHEET_RANGES
): Promise<Movie[]> {
  const range = SHEET_RANGES[category];
  const sheetName = range.split('!')[0];
  const queryParams = new URLSearchParams({
    sheet: sheetName,
    headers: '1',
    tq: 'select A,B,C,D,E,F',
    tqx: 'out:json',
  });
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      // Disable caching to ensure fresh data on each load
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }

    const text = await response.text();
    
    // Google Visualization API returns JSONP, need to extract JSON
    const jsonString = text.substring(47).slice(0, -2);
    const data = JSON.parse(jsonString);

    // Parse rows into Movie objects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const movies: Movie[] = await Promise.all(
      data.table.rows.map(async (row: any) => {
        const sheetImageUrl = row.c[5]?.v || ''; // Column F for image URL
        const movieName = row.c[0]?.v || '';
        const language = row.c[1]?.v || '';
        const year = row.c[2]?.v?.toString() || '';

        const tmdbData = movieName
          ? await fetchTMDBMovieData(movieName, language, year)
          : undefined;

        // Use image from sheet if available, otherwise try TMDB
        const imageUrl = sheetImageUrl || tmdbData?.imageUrl || '';

        return {
          name: movieName,
          language: getLanguageName(language),
          year,
          theme: row.c[3]?.v || '',
          comment: row.c[4]?.v || '',
          commentLabel: `${SITE_OWNER}'s Comments`,
          image: imageUrl || undefined,
          tmdb: tmdbData?.details
            ? {
                ...tmdbData.details,
                originalLanguage: tmdbData.details.originalLanguage
                  ? getLanguageName(tmdbData.details.originalLanguage)
                  : undefined,
              }
            : undefined,
        };
      })
    );

    return movies;
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error);
    return [];
  }
}

/**
 * Fetches all movie categories
 */
export async function fetchAllMovies(): Promise<MovieSheet[]> {
  const categories = Object.keys(SHEET_RANGES) as Array<
    keyof typeof SHEET_RANGES
  >;

  const results = await Promise.all(
    categories.map(async (category) => {
      const movies = await fetchMoviesFromSheet(category);
      return {
        category,
        title: getCategoryTitle(category),
        movies,
      };
    })
  );

  return results;
}

function getCategoryTitle(category: keyof typeof SHEET_RANGES): string {
  const titles = {
    outstanding: 'Outstanding',
    mediocre: 'Mediocre',
    shit: 'Shit',
    towatch: 'To Watch / Rewatch',
  };
  return titles[category];
}
