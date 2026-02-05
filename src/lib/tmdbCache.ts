import { TMDBMovieDetails } from '@/types/movie';

interface CachedTMDBData {
  imageUrl?: string;
  details?: TMDBMovieDetails;
  timestamp: number;
}

// Configuration from environment
const CACHE_DURATION_HOURS = parseInt(
  process.env.NEXT_PUBLIC_TMDB_CACHE_DURATION_HOURS || '24',
  10
);
const CACHE_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_TMDB_CACHE !== 'false';

const CACHE_DURATION_MS = CACHE_DURATION_HOURS * 60 * 60 * 1000;

// In-memory cache store
const tmdbCache = new Map<string, CachedTMDBData>();

/**
 * Get cached TMDB data if available and not expired
 */
export function getTMDBCache(
  cacheKey: string
): { imageUrl?: string; details?: TMDBMovieDetails } | null {
  if (!CACHE_ENABLED) {
    return null;
  }

  const cached = tmdbCache.get(cacheKey);
  if (!cached) {
    return null;
  }

  const now = Date.now();
  const age = now - cached.timestamp;

  // Check if cache is expired
  if (age > CACHE_DURATION_MS) {
    tmdbCache.delete(cacheKey);
    return null;
  }

  console.log(`✓ TMDB cache hit for: ${cacheKey} (age: ${Math.round(age / 1000 / 60)} minutes)`);

  return {
    imageUrl: cached.imageUrl,
    details: cached.details,
  };
}

/**
 * Set TMDB data in cache
 */
export function setTMDBCache(
  cacheKey: string,
  data: { imageUrl?: string; details?: TMDBMovieDetails }
): void {
  if (!CACHE_ENABLED) {
    return;
  }

  tmdbCache.set(cacheKey, {
    ...data,
    timestamp: Date.now(),
  });
}

/**
 * Clear all TMDB cache entries
 */
export function clearTMDBCache(): void {
  tmdbCache.clear();
  console.log('TMDB cache cleared');
}

/**
 * Get cache statistics
 */
export function getTMDBCacheStats() {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;

  tmdbCache.forEach((entry) => {
    const age = now - entry.timestamp;
    if (age > CACHE_DURATION_MS) {
      expiredEntries++;
    } else {
      validEntries++;
    }
  });

  return {
    totalEntries: tmdbCache.size,
    validEntries,
    expiredEntries,
    cacheDurationHours: CACHE_DURATION_HOURS,
    cacheEnabled: CACHE_ENABLED,
  };
}

/**
 * Remove expired entries from cache
 */
export function cleanupExpiredCache(): void {
  const now = Date.now();
  const toDelete: string[] = [];

  tmdbCache.forEach((entry, key) => {
    const age = now - entry.timestamp;
    if (age > CACHE_DURATION_MS) {
      toDelete.push(key);
    }
  });

  toDelete.forEach((key) => tmdbCache.delete(key));

  if (toDelete.length > 0) {
    console.log(`Cleaned up ${toDelete.length} expired TMDB cache entries`);
  }
}
