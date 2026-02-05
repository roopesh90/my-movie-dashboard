/**
 * Browser Cache Utilities
 * Helps manage application cache including movie images
 */

/**
 * Clear all application cache from browser
 * This includes service worker cache and browser cache
 */
export async function clearApplicationCache(): Promise<void> {
  try {
    // Clear all caches from service workers
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
      console.log('✓ Service worker caches cleared');
    }

    // Clear localStorage if you're using it
    if ('localStorage' in window) {
      localStorage.clear();
      console.log('✓ LocalStorage cleared');
    }

    // Clear sessionStorage
    if ('sessionStorage' in window) {
      sessionStorage.clear();
      console.log('✓ SessionStorage cleared');
    }

    console.log('✓ All caches cleared successfully');
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
    if ('caches' in window) {
      // Clear image-specific cache
      const imageCache = await caches.open('images');
      const requests = await imageCache.keys();
      await Promise.all(
        requests.map((request) => imageCache.delete(request))
      );
      console.log(`✓ Cleared ${requests.length} cached images`);
    }
  } catch (error) {
    console.error('Error clearing image cache:', error);
    throw error;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalCaches: number;
  imageCount: number;
}> {
  try {
    let imageCount = 0;
    let totalCaches = 0;

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      totalCaches = cacheNames.length;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        imageCount += requests.filter((req) => {
          const url = req.url.toLowerCase();
          return url.includes('image') || url.includes('.jpg') || url.includes('.png');
        }).length;
      }
    }

    return { totalCaches, imageCount };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { totalCaches: 0, imageCount: 0 };
  }
}
