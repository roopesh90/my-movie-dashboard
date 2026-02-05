import { Movie, MovieSheet } from '@/types/movie';

// Configuration for your Google Sheet
// Read from environment variables
const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

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

/**
 * Searches for a movie on TMDB and returns the poster image URL
 */
async function fetchImageFromTMDB(movieName: string): Promise<string | undefined> {
  if (!TMDB_API_KEY) {
    return undefined;
  }

  try {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieName)}`;
    const response = await fetch(searchUrl, { cache: 'no-store' });

    if (!response.ok) {
      return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await response.json() as any;
    const movie = data.results?.[0];

    if (movie?.poster_path) {
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }

    return undefined;
  } catch (error) {
    console.error(`Error fetching TMDB image for ${movieName}:`, error);
    return undefined;
  }
}

/**
 * Fetches movie data from Google Sheets using the Google Visualization API
 * This method doesn't require authentication
 */
export async function fetchMoviesFromSheet(
  category: keyof typeof SHEET_RANGES
): Promise<Movie[]> {
  const range = SHEET_RANGES[category];
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&range=${range}`;

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

        // Use image from sheet if available, otherwise try TMDB
        let imageUrl = sheetImageUrl;
        if (!imageUrl && movieName) {
          imageUrl = await fetchImageFromTMDB(movieName);
        }

        return {
          name: movieName,
          language: row.c[1]?.v || '',
          year: row.c[2]?.v?.toString() || '',
          theme: row.c[3]?.v || '',
          comment: row.c[4]?.v || '',
          image: imageUrl || undefined,
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
