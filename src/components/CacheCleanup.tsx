'use client';

import { useEffect } from 'react';
import { cleanupAllExpiredCache } from '@/lib/cache';

/**
 * Component that runs automatic cache cleanup on mount
 * Should be included in root layout for app-wide cleanup
 */
export default function CacheCleanup() {
  useEffect(() => {
    // Run cleanup once on app load
    const runCleanup = async () => {
      try {
        await cleanupAllExpiredCache();
      } catch (error) {
        console.error('Failed to cleanup expired cache on load:', error);
      }
    };

    runCleanup();
  }, []);

  return null; // This component doesn't render anything
}
