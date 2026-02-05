import { fetchMoviesFromSheet } from '@/lib/sheets';
import MovieList from '@/components/MovieList';

export const revalidate = 0; // Disable caching for fresh data

export default async function MediocrePage() {
  const movies = await fetchMoviesFromSheet('mediocre');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900 rounded-full">
          😐 Middle Ground
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Mediocre Movies
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Not bad, not great. Watchable but forgettable.
        </p>
      </div>
      
      <MovieList movies={movies} title="" />
    </div>
  );
}
