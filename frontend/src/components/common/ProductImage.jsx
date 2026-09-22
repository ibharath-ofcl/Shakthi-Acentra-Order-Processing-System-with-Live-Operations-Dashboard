import React, { useState } from 'react';
import { Package } from 'lucide-react';

export default function ProductImage({
  src,
  alt = 'Medical Product',
  className = '',
  style = {},
  aspectRatio = '1 / 1',
  fallbackText = 'Medical Supply'
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        ...(aspectRatio ? { aspectRatio } : {}),
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...style
      }}
      className={className}
    >
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '0.75rem',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.25s ease-in-out, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="product-img-element"
        />
      ) : null}

      {/* Graceful Fallback / Skeleton */}
      {(!isLoaded || hasError || !src) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8FAFC',
            color: '#94A3B8',
            gap: '0.4rem',
            padding: '1rem',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#EEF2F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B'
            }}
          >
            <Package size={22} strokeWidth={2} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
            {fallbackText}
          </span>
        </div>
      )}
    </div>
  );
}
