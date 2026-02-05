'use client';

import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  title: string;
  category?: { emoji: string; label: string; tagClass: string };
}

export default function MovieList({ movies, title, category }: MovieListProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No movies yet in this category</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {title && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${category?.tagClass || 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
              {movies.length}
            </span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.name}-${index}`} movie={movie} index={index} category={category} />
        ))}
      </div>
    </div>
  );
}
