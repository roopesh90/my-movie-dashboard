'use client';

import { Movie } from '@/types/movie';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export default function MovieCard({ movie, index }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 flex flex-col h-full"
    >
      {/* Movie Poster */}
      {movie.image && !imageError ? (
        <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 group">
          <Image
            src={movie.image}
            alt={movie.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            title="Movie poster image from TMDB"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 flex items-end p-2">
            <span className="text-xs text-white/80">Image from TMDB</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
          <span className="text-3xl">🎬</span>
        </div>
      )}

      {/* Movie Details */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {movie.name}
        </h3>

        <div className="space-y-1.5 text-sm flex-grow">
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
      </div>
    </motion.div>
  );
}
