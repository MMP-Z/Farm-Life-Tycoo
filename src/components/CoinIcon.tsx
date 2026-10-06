import React from 'react';
import { COIN_SPRITE } from '../utils/sprites';

interface Props {
  /** px size; defaults to 1.1em so the coin scales with surrounding text */
  size?: number;
  className?: string;
}

/** Pixel-art gold coin — the game's currency icon. */
export const CoinIcon: React.FC<Props> = ({ size, className = '' }) => (
  <img
    src={COIN_SPRITE}
    alt="vàng"
    draggable={false}
    className={`inline-block align-[-0.15em] select-none ${className}`}
    style={
      size
        ? { width: size, height: size, objectFit: 'contain', imageRendering: 'pixelated' }
        : { width: '1.1em', height: '1.1em', objectFit: 'contain', imageRendering: 'pixelated' }
    }
  />
);
