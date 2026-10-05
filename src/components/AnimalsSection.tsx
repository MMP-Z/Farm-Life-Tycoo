import React from 'react';
import { ANIMALS, CROPS } from '../constants/gameData';
import { AnimalId, AnimalPen } from '../types/game';
import { Heart, Plus, ShoppingBag, Sparkles } from 'lucide-react';

interface Props {
  pens: Record<AnimalId, AnimalPen>;
  inventory: Record<string, number>;
  playerLevel: number;
  playerCoins: number;
  onFeedAnimals: (animalId: AnimalId) => void;
  onCollectProduce: (animalId: AnimalId, e: React.MouseEvent) => void;
  onBuyAnimal: (animalId: AnimalId) => void;
  onUnlockPen: (animalId: AnimalId) => void;
  isBreeze: boolean;
}

export const AnimalsSection: React.FC<Props> = ({
  pens,
  inventory,
  playerLevel,
  playerCoins,
  onFeedAnimals,
  onCollectProduce,
  onBuyAnimal,
  onUnlockPen,
  isBreeze,
}) => {
  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header Banner */}
      <div className="bg-[#21432c]/90 p-3 rounded-2xl border border-emerald-700/50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐮</span>
          <div>
            <h2 className="font-bold text-white text-sm sm:text-base leading-tight">Chuồng Trại Chăn Nuôi</h2>
            <p className="text-emerald-300/80 text-[11px]">
              Cho ăn nông sản để thu hoạch trứng, sữa tươi, lông cừu & nấm quý
            </p>
          </div>
        </div>

        {isBreeze && (
          <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 font-medium">
            <span>🍃</span>
            <span>Gió mát: Nhanh hơn 25%</span>
          </div>
        )}
      </div>

      {/* Animal Pens List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {Object.values(ANIMALS).map((cfg) => {
          const pen = pens[cfg.id];
          const isUnlocked = pen?.unlocked;
          const levelReq = cfg.minLevel;
          const canUnlockLevel = playerLevel >= levelReq;
          const feedCrop = CROPS[cfg.feedCropId];
          const feedCropCount = inventory[cfg.feedCropId] || 0;
          const feedNeeded = pen ? pen.animalCount : 1;
          const hasEnoughFeed = feedCropCount >= feedNeeded;

          // Time calculations
          const baseDuration = isBreeze ? cfg.produceTime * 0.75 : cfg.produceTime;
          let progress = 0;
          let remaining = 0;
          let isReady = (pen?.readyToCollect || 0) > 0;

          if (pen?.isFed && pen.fedAt) {
            const elapsed = (Date.now() - pen.fedAt) / 1000;
            progress = Math.min(100, Math.floor((elapsed / baseDuration) * 100));
            remaining = Math.max(0, Math.ceil(baseDuration - elapsed));
            if (elapsed >= baseDuration) {
              isReady = true;
            }
          }

          if (!isUnlocked) {
            return (
              <div
                key={cfg.id}
                className="bg-[#1b2f21]/90 rounded-2xl border border-emerald-900/60 p-4 flex flex-col justify-between min-h-[200px] shadow-md relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl opacity-50">{cfg.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-300 text-sm">{cfg.nameVi}</h3>
                    <p className="text-xs text-slate-400">Yêu cầu Cấp độ {levelReq}</p>
                  </div>
                </div>

                <div className="my-3 p-3 bg-black/20 rounded-xl text-xs text-slate-300">
                  <p className="flex items-center gap-1.5 mb-1">
                    <span>🌾</span> Thức ăn yêu thích: <strong className="text-amber-300">{feedCrop.nameVi}</strong>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span>✨</span> Cho ra: <strong className="text-emerald-300">{cfg.produceNameVi}</strong> ({cfg.produceIcon})
                  </p>
                </div>

                <button
                  onClick={() => onUnlockPen(cfg.id)}
                  disabled={!canUnlockLevel || playerCoins < cfg.buyCost}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                    canUnlockLevel && playerCoins >= cfg.buyCost
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag size={14} />
                  <span>Mở chuồng ({cfg.buyCost} 🪙)</span>
                </button>
              </div>
            );
          }

          return (
            <div
              key={cfg.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between min-h-[220px] shadow-lg transition-all ${
                isReady
                  ? 'bg-gradient-to-b from-[#2a4e36] to-[#1c3924] border-amber-400 ring-2 ring-amber-400/40'
                  : 'bg-gradient-to-b from-[#1e3b26] to-[#162b1c] border-emerald-700/60'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center text-2xl shadow-inner">
                    {cfg.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm leading-tight">{cfg.nameVi}</h3>
                    <p className="text-[11px] text-emerald-300/80">
                      Đang nuôi: {pen.animalCount}/{pen.maxAnimals} con
                    </p>
                  </div>
                </div>

                {/* Add more animals button */}
                {pen.animalCount < pen.maxAnimals && (
                  <button
                    onClick={() => onBuyAnimal(cfg.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-[11px] font-semibold border border-emerald-600/50 cursor-pointer shadow-sm"
                    title={`Mua thêm 1 con (${Math.floor(cfg.buyCost * 0.6)} vàng)`}
                  >
                    <Plus size={12} />
                    <span>Mua thêm ({Math.floor(cfg.buyCost * 0.6)}🪙)</span>
                  </button>
                )}
              </div>

              {/* Visual animal pasture enclosure */}
              <div className="my-2.5 bg-[#14261a]/90 rounded-xl p-3 border border-emerald-900/60 flex items-center justify-around relative">
                {Array.from({ length: pen.animalCount }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center transition-transform ${
                      pen.isFed ? 'animate-bounce-slight' : ''
                    }`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <span className="text-3xl filter drop-shadow">{cfg.icon}</span>
                    <span className="text-[9px] text-emerald-400/70 font-mono">#{i + 1}</span>
                  </div>
                ))}

                {pen.isFed && !isReady && (
                  <div className="absolute top-1 right-2 flex items-center gap-1 text-[10px] text-pink-300 animate-pulse">
                    <Heart size={12} className="fill-pink-400" />
                    <span>Đang lớn...</span>
                  </div>
                )}
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col gap-2">
                {isReady ? (
                  <button
                    onClick={(e) => onCollectProduce(cfg.id, e)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer animate-pulse-gentle"
                  >
                    <span className="text-lg">{cfg.produceIcon}</span>
                    <span>Thu hoạch {cfg.produceNameVi} (+{pen.animalCount * cfg.expReward} EXP)</span>
                    <Sparkles size={14} className="text-amber-900" />
                  </button>
                ) : pen.isFed ? (
                  <div className="flex flex-col gap-1 bg-black/20 p-2 rounded-xl border border-emerald-900/40">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-emerald-300">Đang sản xuất {cfg.produceNameVi}</span>
                      <span className="font-mono text-amber-300 tabular-nums">Còn {remaining}s ({progress}%)</span>
                    </div>
                    <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-300 flex items-center gap-1">
                      <span>Cần:</span>
                      <span className="font-semibold text-amber-300">
                        {feedNeeded} {feedCrop.nameVi} {feedCrop.icon}
                      </span>
                      <span className={`text-[10px] ${hasEnoughFeed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        (Có: {feedCropCount})
                      </span>
                    </div>

                    <button
                      onClick={() => onFeedAnimals(cfg.id)}
                      disabled={!hasEnoughFeed}
                      className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-md ${
                        hasEnoughFeed
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                          : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                      }`}
                    >
                      <span>🌾</span>
                      <span>Cho ăn</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
