import { Movie, MovieSheet } from '@/types/movie';

// Configuration for your Google Sheet
// Read from environment variables
const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;

// Validate that SHEET_ID is configured
if (!SHEET_ID) {
  throw new Error(
    'NEXT_PUBLIC_SHEET_ID environment variable is not set. Please check your .env file.'
  );
}

// Sheet names/ranges for each category
const SHEET_RANGES = {
  outstanding: 'Outstanding!A2:E',
  mediocre: 'Mediocre!A2:E',
  shit: 'Shit!A2:E',
  towatch: 'To Watch!A2:E',
};

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
    const movies: Movie[] = data.table.rows.map((row: any) => ({
      name: row.c[0]?.v || '',
      language: row.c[1]?.v || '',
      year: row.c[2]?.v?.toString() || '',
      theme: row.c[3]?.v || '',
      comment: row.c[4]?.v || '',
    }));

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
