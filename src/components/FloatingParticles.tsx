import React from 'react';
import { FloatingReward } from '../types/game';

interface Props {
  particles: FloatingReward[];
}

export const FloatingParticles: React.FC<Props> = ({ particles }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{ left: `${p.x}px`, top: `${p.y}px` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 animate-float-fade flex items-center gap-1.5 font-bold text-sm select-none drop-shadow-md"
        >
          {p.type === 'coin' && (
            <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-1">
              <span>💰</span>
              <span>{p.text}</span>
            </span>
          )}
          {p.type === 'exp' && (
            <span className="bg-sky-500 text-white px-2 py-0.5 rounded-full shadow-lg border border-sky-300 flex items-center gap-1">
              <span>✨</span>
              <span>{p.text}</span>
            </span>
          )}
          {p.type === 'gem' && (
            <span className="bg-fuchsia-600 text-white px-2 py-0.5 rounded-full shadow-lg border border-fuchsia-300 flex items-center gap-1">
              <span>💎</span>
              <span>{p.text}</span>
            </span>
          )}
          {p.type === 'item' && (
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-lg border border-emerald-400 flex items-center gap-1">
              <span>{p.icon || '🌾'}</span>
              <span>{p.text}</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
