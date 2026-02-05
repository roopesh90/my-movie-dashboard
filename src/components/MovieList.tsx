'use client';

import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  title: string;
}

export default function MovieList({ movies, title }: MovieListProps) {
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
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.name}-${index}`} movie={movie} index={index} />
        ))}
      </div>
    </div>
  );
}
