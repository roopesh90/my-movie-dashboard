import { fetchMoviesFromSheet } from '@/lib/sheets';
import MovieList from '@/components/MovieList';
import { categoryConfigMap } from '@/lib/categoryConfig';

export const revalidate = 300; // ISR: Revalidate every 5 minutes

export default async function ShitPage() {
  const movies = await fetchMoviesFromSheet('shit');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className={`inline-block px-3 py-1 mb-4 text-sm font-semibold rounded-full ${categoryConfigMap.shit.tagClass}`}>
          {categoryConfigMap.shit.emoji} {categoryConfigMap.shit.label}
        </div>
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {categoryConfigMap.shit.title}
          </h1>
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            {movies.length}
          </span>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Save yourself the time. These didn&apos;t work for me.
        </p>
      </div>
      
      <MovieList movies={movies} title="" category={categoryConfigMap.shit} />
    </div>
  );
}
