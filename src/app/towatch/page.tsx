import { fetchMoviesFromSheet } from '@/lib/sheets';
import MovieList from '@/components/MovieList';
import { categoryConfigMap } from '@/lib/categoryConfig';

export const revalidate = 300; // ISR: Revalidate every 5 minutes

export default async function ToWatchPage() {
  const movies = await fetchMoviesFromSheet('towatch');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className={`inline-block px-3 py-1 mb-4 text-sm font-semibold rounded-full ${categoryConfigMap.towatch.tagClass}`}>
          {categoryConfigMap.towatch.emoji} {categoryConfigMap.towatch.label}
        </div>
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {categoryConfigMap.towatch.title}
          </h1>
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${categoryConfigMap.towatch.tagClass}`}>
            {movies.length}
          </span>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          On my radar. Movies I want to watch or revisit.
        </p>
      </div>
      
      <MovieList movies={movies} title="" category={categoryConfigMap.towatch} />
    </div>
  );
}
