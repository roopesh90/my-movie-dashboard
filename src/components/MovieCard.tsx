'use client';

import { Movie } from '@/types/movie';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export default function MovieCard({ movie, index }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<{ key: string; site: string; name: string } | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const mediaScrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollUpdateScheduled = useRef(false);

  const details = movie.tmdb;
  const modalId = useMemo(
    () => movie.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    [movie.name]
  );
  const releaseYear = details?.releaseDate?.substring(0, 4) || movie.year || '—';
  const runtimeText = useMemo(() => {
    if (!details?.runtime) return null;
    const hours = Math.floor(details.runtime / 60);
    const minutes = details.runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }, [details?.runtime]);

  // Memoize poster image to prevent re-renders when scroll states change
  const posterImage = useMemo(() => (
    <div className="relative w-full h-64 md:h-full min-h-[16rem] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
      {movie.image && !imageError ? (
        <Image
          src={movie.image}
          alt={details?.title || movie.name}
          fill
          className="object-contain"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>
      )}
    </div>
  ), [movie.image, imageError, details?.title, movie.name]);

  useEffect(() => {
    if (!isModalOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (viewingImage) {
          setViewingImage(null);
        } else if (playingVideo) {
          setPlayingVideo(null);
        } else {
          setIsModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, playingVideo, viewingImage]);

  useEffect(() => {
    if (isModalOpen || playingVideo || viewingImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen, playingVideo, viewingImage]);

  const updateScrollButtons = useCallback(() => {
    if (scrollUpdateScheduled.current) return;
    
    scrollUpdateScheduled.current = true;
    requestAnimationFrame(() => {
      scrollUpdateScheduled.current = false;
      const container = mediaScrollRef.current;
      if (container) {
        const newCanScrollLeft = container.scrollLeft > 0;
        const newCanScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 1;
        
        // Only update state if values actually changed to prevent unnecessary re-renders
        setCanScrollLeft(prev => prev !== newCanScrollLeft ? newCanScrollLeft : prev);
        setCanScrollRight(prev => prev !== newCanScrollRight ? newCanScrollRight : prev);
      }
    });
  }, []);

  const scrollMedia = useCallback((direction: 'left' | 'right') => {
    const container = mediaScrollRef.current;
    if (container) {
      const scrollAmount = 320; // Width of ~2 items
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 flex flex-col h-full cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.name}`}
      onClick={() => setIsModalOpen(true)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setIsModalOpen(true);
        }
      }}
    >
      {movie.image && !imageError ? (
        <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700 group">
          <Image
            src={movie.image}
            alt={movie.name}
            fill
            className="object-contain"
            onError={() => setImageError(true)}
            title="Movie poster image from TMDB"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 flex items-end p-2">
            <span className="text-xs text-white/80">Image from TMDB</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
          <span className="text-3xl">🎬</span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{movie.name}</h3>

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
              <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-2">
                {movie.commentLabel || 'Comments'}
              </p>
              <blockquote className="rounded-lg border-l-4 border-blue-500/70 bg-blue-50/60 dark:bg-blue-900/20 p-3 text-sm italic text-gray-700 dark:text-gray-200">
                &ldquo;{movie.comment}&rdquo;
              </blockquote>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`movie-title-${modalId}`}
          aria-describedby={`movie-overview-${modalId}`}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-[90vw] sm:w-[80vw] lg:w-[60vw] max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2
                  id={`movie-title-${modalId}`}
                  className="text-2xl font-semibold text-gray-900 dark:text-white"
                >
                  {details?.title || movie.name}
                </h2>
                {details?.tagline && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{details.tagline}</p>
                )}
              </div>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close movie details"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-[280px_1fr] p-6 overflow-y-auto items-start md:items-stretch min-h-0 flex-1">
              {posterImage}

              <div className="space-y-4 min-w-0">
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {releaseYear}
                  </span>
                  {runtimeText && (
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {runtimeText}
                    </span>
                  )}
                  {details?.rating !== undefined && (
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      ⭐ {details.rating.toFixed(1)}
                    </span>
                  )}
                </div>

                {details?.genres?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((genre) => (
                      <span
                        key={genre}
                        className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                ) : null}

                <p
                  id={`movie-overview-${modalId}`}
                  className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                  {details?.overview || 'No overview available from TMDB.'}
                </p>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {details?.originalTitle && details.originalTitle !== details?.title && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 dark:text-gray-400 w-32">Original Title:</span>
                      <span>{details.originalTitle}</span>
                    </div>
                  )}

                  {details?.releaseDate && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 dark:text-gray-400 w-32">Release Date:</span>
                      <span>{new Date(details.releaseDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {details?.originalLanguage && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 dark:text-gray-400 w-32">Original Language:</span>
                      <span>{details.originalLanguage}</span>
                    </div>
                  )}

                  {details?.popularity !== undefined && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 dark:text-gray-400 w-32">Popularity:</span>
                      <span>{(details.popularity || 0).toFixed(1)}</span>
                    </div>
                  )}

                  {details?.voteCount !== undefined && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 dark:text-gray-400 w-32">Votes:</span>
                      <span>{details.voteCount?.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex gap-2 mb-3">
                      <span className="text-gray-500 dark:text-gray-400 w-32">Language:</span>
                      <span>{movie.language || details?.originalLanguage || '—'}</span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="text-gray-500 dark:text-gray-400 w-32">Theme:</span>
                      <span>{movie.theme || '—'}</span>
                    </div>

                    {details?.id && (
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                        <a
                          href={`https://www.themoviedb.org/movie/${details.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium"
                        >
                          TMDB
                          <span>↗</span>
                        </a>
                        {details.imdbId && (
                          <a
                            href={`https://www.imdb.com/title/${details.imdbId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-400 hover:underline text-xs font-medium"
                          >
                            IMDb
                            <span>↗</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {(details?.videos?.length || details?.images?.length) && (
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                          Media
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => scrollMedia('left')}
                            disabled={!canScrollLeft}
                            className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Scroll left"
                          >
                            <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => scrollMedia('right')}
                            disabled={!canScrollRight}
                            className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Scroll right"
                          >
                            <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div
                        ref={(el) => {
                          mediaScrollRef.current = el;
                          if (el) updateScrollButtons();
                        }}
                        onScroll={updateScrollButtons}
                        className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                        style={{ scrollbarWidth: 'thin' }}
                      >
                        {details.videos?.map((video) => (
                          <button
                            key={video.id}
                            type="button"
                            onClick={() => setPlayingVideo({ key: video.key, site: video.site, name: video.name })}
                            className="relative flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden group cursor-pointer"
                          >
                            <img
                              src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                              alt={video.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-red-600 group-hover:bg-red-700 flex items-center justify-center transition-colors">
                                <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-0.5 text-xs font-medium rounded bg-black/70 text-white">
                                {video.type}
                              </span>
                            </div>
                          </button>
                        ))}
                        {details.images?.map((image, idx) => (
                          <button
                            key={`${image.type}-${idx}`}
                            type="button"
                            onClick={() => setViewingImage(image.filePath)}
                            className="relative flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden group cursor-pointer"
                          >
                            <img
                              src={image.filePath}
                              alt={`${image.type} ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-0.5 text-xs font-medium rounded bg-black/70 text-white capitalize">
                                {image.type}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {movie.comment && (
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-2">
                        {movie.commentLabel || 'Comments'}
                      </p>
                      <blockquote className="rounded-lg border-l-4 border-blue-500/70 bg-blue-50/60 dark:bg-blue-900/20 p-3 text-sm italic text-gray-700 dark:text-gray-200">
                        &ldquo;{movie.comment}&rdquo;
                      </blockquote>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {playingVideo && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPlayingVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
              onClick={() => setPlayingVideo(null)}
              aria-label="Close video"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {playingVideo.site === 'YouTube' && (
              <iframe
                src={`https://www.youtube.com/embed/${playingVideo.key}?autoplay=1&rel=0`}
                title={playingVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
            {playingVideo.site === 'Vimeo' && (
              <iframe
                src={`https://player.vimeo.com/video/${playingVideo.key}?autoplay=1`}
                title={playingVideo.name}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>
        </div>
      )}

      {viewingImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
              onClick={() => setViewingImage(null)}
              aria-label="Close image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={viewingImage}
              alt="Movie media"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}