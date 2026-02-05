'use client';

import { useState } from 'react';
import { clearApplicationCache, clearImageCache, clearTMDBAPICache } from '@/lib/cache';

export default function ClearCacheButton() {
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleClearCache = async (cacheType: 'all' | 'images' | 'tmdb') => {
    setIsClearing(true);
    setMessage(null);

    try {
      if (cacheType === 'all') {
        await clearApplicationCache();
        clearTMDBAPICache(); // Also clear TMDB cache
        setMessage({ type: 'success', text: '✓ All caches cleared!' });
      } else if (cacheType === 'images') {
        await clearImageCache();
        setMessage({ type: 'success', text: '✓ Image cache cleared!' });
      } else if (cacheType === 'tmdb') {
        clearTMDBAPICache();
        setMessage({ type: 'success', text: '✓ TMDB cache cleared!' });
        // Refresh after clearing TMDB cache to fetch fresh data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }

      // Refresh the page after a short delay for 'all' and 'images'
      if (cacheType !== 'tmdb') {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `✗ Error clearing cache: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handleClearCache('images')}
          disabled={isClearing}
          className="px-3 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
        >
          {isClearing ? 'Clearing...' : 'Clear Image Cache'}
        </button>

        <button
          onClick={() => handleClearCache('tmdb')}
          disabled={isClearing}
          className="px-3 py-2 text-sm font-medium text-white bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          title="Clear TMDB API response cache"
        >
          {isClearing ? 'Clearing...' : 'Clear TMDB Cache'}
        </button>

        <button
          onClick={() => handleClearCache('all')}
          disabled={isClearing}
          className="px-3 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
        >
          {isClearing ? 'Clearing...' : 'Clear All Cache'}
        </button>
      </div>

      {message && (
        <div
          className={`text-sm p-2 rounded ${
            message.type === 'success'
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
