'use client';

export default function Attribution() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
          
          <a
            href="https://www.themoviedb.org/about/logos-attribution"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            TMDB Attribution Guidelines
          </a>
        </div>
      </div>
    </footer>
  );
}
