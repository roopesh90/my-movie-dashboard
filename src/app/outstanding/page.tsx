import { fetchMoviesFromSheet } from '@/lib/sheets';
import MovieList from '@/components/MovieList';

export const revalidate = 0; // Disable caching for fresh data

export default async function OutstandingPage() {
  const movies = await fetchMoviesFromSheet('outstanding');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900 rounded-full">
          ⭐ Top Tier
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Outstanding Movies
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          These are the movies that left a lasting impression. The ones I&apos;d recommend without hesitation.
        </p>
      </div>
      
      <MovieList movies={movies} title="" />
    </div>
  );
}
