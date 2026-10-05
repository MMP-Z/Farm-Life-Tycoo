import React, { useState } from 'react';
import { getMaxExpForLevel } from '../constants/gameData';
import { GameState } from '../types/game';
import { WeatherWidget } from './WeatherWidget';
import { Volume2, VolumeX, RotateCcw, Smartphone, Monitor, Zap } from 'lucide-react';

interface Props {
  state: GameState;
  onToggleSound: () => void;
  onChangeSpeed: (speed: number) => void;
  onResetGame: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  weatherRemainingSecs: number;
  totalInventoryCount: number;
}

export const Header: React.FC<Props> = ({
  state,
  onToggleSound,
  onChangeSpeed,
  onResetGame,
  isMobileFrame,
  onToggleMobileFrame,
  weatherRemainingSecs,
  totalInventoryCount,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const maxExp = getMaxExpForLevel(state.level);
  const expPercent = Math.min(100, Math.floor((state.exp / maxExp) * 100));

  return (
    <header className="w-full bg-[#1A3323]/95 backdrop-blur-md border-b border-emerald-800/60 text-white select-none sticky top-0 z-30 shadow-md">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Farmer Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-300 shadow-md flex items-center justify-center text-xl sm:text-2xl cursor-pointer hover:scale-105 transition-transform">
              👨‍🌾
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-300 shadow">
              Lv.{state.level}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base tracking-tight text-amber-200">
                {state.farmerName}
              </span>
              <span className="text-emerald-400/80 text-xs hidden md:inline">· Nông Trại Vui Vẻ</span>
            </div>

            {/* EXP Bar */}
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-20 sm:w-28 h-2 bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-700/50 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full transition-all duration-300"
                  style={{ width: `${expPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-emerald-300/90 tabular-nums">
                {state.exp}/{maxExp}
              </span>
            </div>
          </div>
        </div>

        {/* Currency & Inventory Badges */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Gold Coins */}
          <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-500/40 rounded-xl px-2 sm:px-3 py-1 shadow-inner">
            <span className="text-base sm:text-lg">🪙</span>
            <span className="font-bold text-xs sm:text-sm text-amber-300 tabular-nums">
              {state.coins.toLocaleString()}
            </span>
          </div>

          {/* Diamonds */}
          <div className="flex items-center gap-1 bg-fuchsia-950/60 border border-fuchsia-500/40 rounded-xl px-2 sm:px-2.5 py-1 shadow-inner">
            <span className="text-base sm:text-lg">💎</span>
            <span className="font-bold text-xs sm:text-sm text-fuchsia-300 tabular-nums">
              {state.gems.toLocaleString()}
            </span>
          </div>

          {/* Barn Capacity */}
          <div
            className={`hidden xs:flex items-center gap-1 rounded-xl px-2 sm:px-2.5 py-1 text-xs border ${
              totalInventoryCount >= state.barnCapacity
                ? 'bg-rose-950/70 border-rose-500/60 text-rose-300 animate-pulse'
                : 'bg-emerald-950/60 border-emerald-600/40 text-emerald-300'
            }`}
            title="Sức chứa kho thóc"
          >
            <span>🎒</span>
            <span className="font-mono tabular-nums font-medium">
              {totalInventoryCount}/{state.barnCapacity}
            </span>
          </div>

          {/* Weather Widget */}
          <WeatherWidget weather={state.weather} remainingSeconds={weatherRemainingSecs} />

          {/* Settings & Utility Dropdown / Buttons */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-xs transition-colors cursor-pointer"
              title="Cài đặt & Tùy chọn"
            >
              ⚙️
            </button>

            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-56 p-3 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl z-50 text-xs">
                <p className="font-bold text-slate-300 pb-2 border-b border-slate-800 mb-2">Tùy Chọn Trò Chơi</p>

                {/* Sound Toggle */}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    {state.soundEnabled ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} className="text-slate-400" />}
                    Âm thanh
                  </span>
                  <button
                    onClick={onToggleSound}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      state.soundEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {state.soundEnabled ? 'BẬT' : 'TẮT'}
                  </button>
                </div>

                {/* Speed Multiplier */}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-400" />
                    Tốc độ game
                  </span>
                  <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg">
                    {[1, 2, 5].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => onChangeSpeed(spd)}
                        className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-colors ${
                          state.gameSpeed === spd ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Frame Toggle */}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    {isMobileFrame ? <Smartphone size={14} className="text-sky-400" /> : <Monitor size={14} className="text-sky-400" />}
                    Khung xem
                  </span>
                  <button
                    onClick={onToggleMobileFrame}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-sky-600/80 hover:bg-sky-600 text-white transition-colors"
                  >
                    {isMobileFrame ? 'Di động' : 'Toàn màn hình'}
                  </button>
                </div>

                {/* Reset Game */}
                <div className="pt-2 border-t border-slate-800 mt-2">
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ nông trại về ban đầu?')) {
                        onResetGame();
                        setShowSettings(false);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-[11px] font-medium transition-colors"
                  >
                    <RotateCcw size={12} />
                    Chơi lại từ đầu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
