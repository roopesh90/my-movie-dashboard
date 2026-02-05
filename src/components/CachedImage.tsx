'use client';

import { useEffect, useState } from 'react';
import { getCachedImage } from '@/lib/imageCache';

interface CachedImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}

/**
 * Image component that uses browser cache for TMDB images
 */
export default function CachedImage({ src, alt, className, onError }: CachedImageProps) {
  const [cachedSrc, setCachedSrc] = useState<string>(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isActive = true;
    let objectUrl: string | null = null;

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const cached = await getCachedImage(src);
        if (isActive) {
          // If it's a blob URL, store it for cleanup
          if (cached.startsWith('blob:')) {
            objectUrl = cached;
          }
          setCachedSrc(cached);
        } else if (cached.startsWith('blob:')) {
          // Component unmounted before state update - clean up immediately
          URL.revokeObjectURL(cached);
        }
      } catch (err) {
        console.error('Error loading cached image:', err);
        if (isActive) {
          setError(true);
          if (onError) onError();
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadImage();

    // Cleanup blob URLs to prevent memory leaks
    return () => {
      isActive = false;
      if (objectUrl && objectUrl.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src, onError]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}>
        <span className="text-3xl">🎬</span>
      </div>
    );
  }

  return (
    <img
      src={cachedSrc}
      alt={alt}
      className={className}
      onError={() => {
        setError(true);
        if (onError) onError();
      }}
      style={{ 
        opacity: loading ? 0.5 : 1, 
        transition: 'opacity 0.3s',
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );
}
