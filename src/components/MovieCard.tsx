'use client';

import { Movie } from '@/types/movie';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export default function MovieCard({ movie, index }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {movie.name}
      </h3>
      
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400 w-20">Language:</span>
          <span className="text-gray-700 dark:text-gray-300">{movie.language}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400 w-20">Year:</span>
          <span className="text-gray-700 dark:text-gray-300">{movie.year}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400 w-20">Theme:</span>
          <span className="text-gray-700 dark:text-gray-300">{movie.theme}</span>
        </div>
        
        {movie.comment && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm italic">
              &ldquo;{movie.comment}&rdquo;
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
