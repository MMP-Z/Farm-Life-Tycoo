import React from 'react';

interface Props {
  src: string;
  alt: string;
  /** rendered size in px (sprites are square-ish, contain-fit) */
  size?: number;
  className?: string;
}

/**
 * Pixel-art sprite image. Uses `image-rendering: pixelated` so 16px
 * Sprout Lands sprites stay crisp when scaled up.
 */
export const SpriteIcon: React.FC<Props> = ({ src, alt, size = 32, className = '' }) => (
  <img
    src={src}
    alt={alt}
    draggable={false}
    className={`inline-block select-none ${className}`}
    style={{ width: size, height: size, objectFit: 'contain', imageRendering: 'pixelated' }}
  />
);
