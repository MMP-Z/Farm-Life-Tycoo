import React, { useState } from 'react';
import { WEATHERS } from '../constants/gameData';
import { WeatherType } from '../types/game';

interface Props {
  weather: WeatherType;
  remainingSeconds: number;
}

export const WeatherWidget: React.FC<Props> = ({ weather, remainingSeconds }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const info = WEATHERS[weather] || WEATHERS.sunny;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/25 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
        title="Xem hiệu ứng thời tiết"
      >
        <span className="text-base animate-bounce-slight">{info.icon}</span>
        <span className="hidden sm:inline font-semibold">{info.nameVi}</span>
        <span className="text-[11px] opacity-80 tabular-nums">({formatTime(remainingSeconds)})</span>
      </button>

      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-slate-900/95 text-white rounded-2xl shadow-2xl border border-slate-700/60 backdrop-blur-lg z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">{info.icon}</span>
            <div>
              <p className="font-bold text-amber-300 text-sm">{info.nameVi}</p>
              <p className="text-[10px] text-slate-400">Đổi sau: {formatTime(remainingSeconds)}</p>
            </div>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed mb-2">{info.descriptionVi}</p>
          <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-lg p-2 text-emerald-300 font-semibold text-[11px] flex items-center gap-1.5">
            <span>✨</span>
            <span>Hiệu ứng: {info.buffVi}</span>
          </div>
        </div>
      )}
    </div>
  );
};
