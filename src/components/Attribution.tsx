'use client';

import Image from 'next/image';

export default function Attribution() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-8">
          {/* TMDB Attribution */}
          <div className="flex flex-col items-center justify-center gap-6 pb-8 border-b border-gray-200 dark:border-gray-700">
            {/* TMDB Logo */}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              title="The Movie Database (TMDB)"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/tmdb-logo.svg"
                alt="The Movie Database (TMDB) Logo"
                width={60}
                height={60}
                priority
              />
            </a>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Data & Images Powered By
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                This application uses the TMDB API to fetch movie poster images and data. 
                TMDB (The Movie Database) is a community-built movie and TV database.
              </p>
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
              >
                Visit The Movie Database (TMDB) →
              </a>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <a
              href="https://www.themoviedb.org/about/logos-attribution"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline"
            >
              TMDB Attribution Guidelines & Logos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
