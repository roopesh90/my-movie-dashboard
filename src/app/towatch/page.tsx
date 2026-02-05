import { fetchMoviesFromSheet } from '@/lib/sheets';
import MovieList from '@/components/MovieList';

export const revalidate = 0; // Disable caching for fresh data

export default async function ToWatchPage() {
  const movies = await fetchMoviesFromSheet('towatch');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900 rounded-full">
          📺 Queue
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          To Watch / Rewatch
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          On my radar. Movies I want to watch or revisit.
        </p>
      </div>
      
      <MovieList movies={movies} title="" />
    </div>
  );
}
