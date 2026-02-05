/**
 * Frontend Image Cache using Browser Cache API
 * Caches images with TTL matching TMDB cache duration
 */

const CACHE_NAME = 'tmdb-images-cache';
const CACHE_DURATION_HOURS = parseInt(
  process.env.NEXT_PUBLIC_TMDB_CACHE_DURATION_HOURS || '24',
  10
);
const CACHE_DURATION_MS = CACHE_DURATION_HOURS * 60 * 60 * 1000;

/**
 * Get cached image or fetch and cache it
 */
export async function getCachedImage(url: string): Promise<string> {
  if (!url || typeof window === 'undefined') {
    return url;
  }

  try {
    // Check if Cache API is available
    if (!('caches' in window)) {
      console.debug('Cache API not available');
      return url;
    }

    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(url);

    // Check if cached response exists and is not expired
    if (cachedResponse) {
      const cachedTime = cachedResponse.headers.get('X-Cached-Time');
      if (cachedTime) {
        const age = Date.now() - parseInt(cachedTime, 10);
        if (age < CACHE_DURATION_MS) {
          // Return cached blob URL
          const blob = await cachedResponse.blob();
          console.log(`✓ Image cache hit: ${url.substring(url.lastIndexOf('/') + 1)} (age: ${Math.round(age / 1000 / 60)} minutes)`);
          return URL.createObjectURL(blob);
        }
        // Cache expired, delete it
        await cache.delete(url);
      }
    }

    // Fetch fresh image
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache',
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch image: ${url} (status: ${response.status})`);
      return url;
    }

    // Clone response and add cache timestamp
    const clonedResponse = response.clone();
    const blob = await response.blob();

    // Create new response with cache headers
    const headers = new Headers(clonedResponse.headers);
    headers.set('X-Cached-Time', Date.now().toString());
    
    const cachedResponseToStore = new Response(blob, {
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
      headers,
    });

    // Store in cache
    await cache.put(url, cachedResponseToStore);

    // Return blob URL for immediate use
    return URL.createObjectURL(blob);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check if it's a CORS error
    if (errorMessage.includes('CORS') || errorMessage.includes('Failed to fetch')) {
      console.warn(`CORS/Network error fetching image, using direct URL: ${url.substring(url.lastIndexOf('/') + 1)}`);
    } else {
      console.error('Error caching image:', error);
    }
    
    return url; // Fallback to original URL
  }
}

/**
 * Clear all cached images
 */
export async function clearImageCache(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return;
  }

  try {
    await caches.delete(CACHE_NAME);
    console.log('✓ Image cache cleared');
  } catch (error) {
    console.error('Error clearing image cache:', error);
  }
}

/**
 * Get image cache statistics
 */
export async function getImageCacheStats(): Promise<{
  totalImages: number;
  cacheSize: number;
}> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { totalImages: 0, cacheSize: 0 };
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    
    let totalSize = 0;
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }

    return {
      totalImages: keys.length,
      cacheSize: Math.round(totalSize / 1024 / 1024 * 100) / 100, // MB
    };
  } catch (error) {
    console.error('Error getting image cache stats:', error);
    return { totalImages: 0, cacheSize: 0 };
  }
}

/**
 * Cleanup expired images from cache
 */
export async function cleanupExpiredImages(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return;
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    const now = Date.now();
    let deletedCount = 0;

    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const cachedTime = response.headers.get('X-Cached-Time');
        if (cachedTime) {
          const age = now - parseInt(cachedTime, 10);
          if (age > CACHE_DURATION_MS) {
            await cache.delete(request);
            deletedCount++;
          }
        }
      }
    }

    if (deletedCount > 0) {
      console.log(`✓ Cleaned up ${deletedCount} expired images from cache`);
    }
  } catch (error) {
    console.error('Error cleaning up expired images:', error);
  }
}
