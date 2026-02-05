import { fetchMoviesFromSheet } from '@/lib/sheets';
import MovieList from '@/components/MovieList';
import { categoryConfigMap } from '@/lib/categoryConfig';

export const revalidate = 300; // ISR: Revalidate every 5 minutes

export default async function MediocrePage() {
  const movies = await fetchMoviesFromSheet('mediocre');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className={`inline-block px-3 py-1 mb-4 text-sm font-semibold rounded-full ${categoryConfigMap.mediocre.tagClass}`}>
          {categoryConfigMap.mediocre.emoji} {categoryConfigMap.mediocre.label}
        </div>
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {categoryConfigMap.mediocre.title}
          </h1>
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            {movies.length}
          </span>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Not bad, not great. Watchable but forgettable.
        </p>
      </div>
      
      <MovieList movies={movies} title="" category={categoryConfigMap.mediocre} />
    </div>
  );
}
