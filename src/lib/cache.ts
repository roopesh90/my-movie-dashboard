/**
 * Browser Cache Utilities
 * Helps manage application cache including movie images
 */

import { clearTMDBCache, getTMDBCacheStats, cleanupExpiredCache as cleanupExpiredTMDBCache } from './tmdbCache';
import {
  clearImageCache as clearFrontendImageCache,
  getImageCacheStats,
  cleanupExpiredImages,
} from './imageCache';

/**
 * Clear all application cache from browser
 * Only clears app-specific caches, not all browser caches
 * Note: ISR cache (server-side) will expire after 5 minutes or when data is stale
 */
export async function clearApplicationCache(): Promise<void> {
  try {
    // Clear only our specific caches
    await clearFrontendImageCache();
    clearTMDBCache();

    // Clear localStorage and sessionStorage
    if ('localStorage' in window) {
      localStorage.clear();
      console.log('✓ LocalStorage cleared');
    }

    if ('sessionStorage' in window) {
      sessionStorage.clear();
      console.log('✓ SessionStorage cleared');
    }

    console.log('✓ All application caches cleared successfully');
    console.log('ℹ Note: Server-side ISR cache will auto-revalidate in 5 minutes');
  } catch (error) {
    console.error('Error clearing cache:', error);
    throw error;
  }
}

/**
 * Clear only image cache
 * Useful if you want to refresh movie posters
 */
export async function clearImageCache(): Promise<void> {
  try {
    await clearFrontendImageCache();
  } catch (error) {
    console.error('Error clearing image cache:', error);
    throw error;
  }
}

/**
 * Cleanup expired entries from all caches
 */
export async function cleanupAllExpiredCache(): Promise<void> {
  try {
    await cleanupExpiredImages();
    cleanupExpiredTMDBCache();
    
    const tmdbStats = getTMDBCacheStats();
    console.log(`✓ Cleaned up expired cache entries. TMDB: ${tmdbStats.validEntries} valid entries remaining`);
  } catch (error) {
    console.error('Error cleaning up expired cache:', error);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalCaches: number;
  imageCount: number;
  imageCacheSize?: number;
  tmdbCache?: {
    totalEntries: number;
    validEntries: number;
    expiredEntries: number;
    cacheDurationHours: number;
    cacheEnabled: boolean;
  };
}> {
  try {
    let totalCaches = 0;

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      totalCaches = cacheNames.length;
    }

    const imageStats = await getImageCacheStats();
    const tmdbCache = getTMDBCacheStats();

    return {
      totalCaches,
      imageCount: imageStats.totalImages,
      imageCacheSize: imageStats.cacheSize,
      tmdbCache,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { totalCaches: 0, imageCount: 0 };
  }
}

/**
 * Clear TMDB API response cache
 */
export function clearTMDBAPICache(): void {
  clearTMDBCache();
}
