import React from 'react';
import { ANIMALS, CROPS } from '../constants/gameData';
import { AnimalId, AnimalPen } from '../types/game';
import { Heart, Plus, Sparkles, Check } from 'lucide-react';
import { sound } from '../utils/sound';
import { formatMoney } from '../utils/format';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';

interface Props {
  pens: Record<AnimalId, AnimalPen>;
  inventory: Record<string, number>;
  coins: number;
  playerLevel: number;
  onFeedAnimals: (animalId: AnimalId) => void;
  onCollectProduce: (animalId: AnimalId, e: React.MouseEvent) => void;
  onBuyAnimal: (animalId: AnimalId) => void;
  onUnlockPen: (animalId: AnimalId) => void;
}

export const LivestockSection: React.FC<Props> = ({
  pens,
  inventory,
  coins,
  playerLevel,
  onFeedAnimals,
  onCollectProduce,
  onBuyAnimal,
  onUnlockPen,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 border border-[#EAE6DA] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl shadow-inner">
            <GameIcon e="🐮" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
              Khu Chăn Nuôi Gia Súc & Thú Nuôi
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Cho ăn nông sản để thu hoạch trứng gà, sữa tươi, lông cừu ấm & nấm quý
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Pens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.values(ANIMALS).map((cfg) => {
          const pen = pens[cfg.id];
          const isUnlocked = pen?.unlocked;
          const levelReq = cfg.minLevel;
          const canUnlockLevel = playerLevel >= levelReq;
          const feedCrop = CROPS[cfg.feedCropId];
          const feedCropCount = inventory[cfg.feedCropId] || 0;
          const feedNeeded = pen ? pen.animalCount : 1;
          const hasEnoughFeed = feedCropCount >= feedNeeded;

          let progress = 0;
          let remaining = 0;
          let isReady = (pen?.readyToCollect || 0) > 0;

          if (pen?.isFed && pen.fedAt) {
            const elapsed = (Date.now() - pen.fedAt) / 1000;
            progress = Math.min(100, Math.floor((elapsed / cfg.produceTime) * 100));
            remaining = Math.max(0, Math.ceil(cfg.produceTime - elapsed));
            if (elapsed >= cfg.produceTime) {
              isReady = true;
            }
          }

          if (!isUnlocked) {
            return (
              <div
                key={cfg.id}
                className="bg-white rounded-3xl border border-[#EAE6DA] p-5 flex flex-col justify-between min-h-[220px] shadow-sm relative opacity-85"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl opacity-50">
                    <GameIcon e={cfg.icon} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{cfg.nameVi}</h3>
                    <p className="text-xs text-amber-700 font-bold mt-0.5">Yêu cầu Cấp Độ {levelReq}</p>
                  </div>
                </div>

                <div className="my-3 p-3 rounded-2xl bg-[#FAF9F5] border border-[#F2EFE9] text-xs text-slate-600">
                  <p className="flex items-center gap-1.5 mb-1">
                    <span><GameIcon e="🌾" /></span> Thức ăn cần: <strong className="text-slate-900">{feedCrop.nameVi}</strong>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span><GameIcon e="✨" /></span> Thu được: <strong className="text-emerald-700">{cfg.produceNameVi}</strong> (<GameIcon e={cfg.produceIcon} />)
                  </p>
                </div>

                <button
                  onClick={() => onUnlockPen(cfg.id)}
                  disabled={!canUnlockLevel || coins < cfg.buyCost}
                  className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                    canUnlockLevel && coins >= cfg.buyCost
                      ? 'bg-[#234230] hover:bg-[#1a3325] text-white cursor-pointer active:scale-95'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Mở Khóa Chuồng (<CoinIcon /> {formatMoney(cfg.buyCost)})</span>
                </button>
              </div>
            );
          }

          return (
            <div
              key={cfg.id}
              className={`rounded-3xl border p-5 flex flex-col justify-between min-h-[230px] transition-all shadow-sm ${
                isReady
                  ? 'bg-white border-amber-400 ring-4 ring-amber-400/20 shadow-md'
                  : 'bg-white border-[#EAE6DA]'
              }`}
            >
              {/* Pen Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl shadow-inner">
                    <GameIcon e={cfg.icon} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-tight">{cfg.nameVi}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Đang nuôi: {pen.animalCount}/{pen.maxAnimals} con
                    </p>
                  </div>
                </div>

                {pen.animalCount < pen.maxAnimals && (
                  <button
                    onClick={() => onBuyAnimal(cfg.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                    title={`Mua thêm 1 con (${formatMoney(Math.floor(cfg.buyCost * 0.6))})`}
                  >
                    <Plus size={13} />
                    <span>Mua thêm (<CoinIcon /> {formatMoney(Math.floor(cfg.buyCost * 0.6))})</span>
                  </button>
                )}
              </div>

              {/* Animated Animal Yard */}
              <div className="my-3 bg-[#F7F5EE] rounded-2xl p-3 border border-[#EAE6DA] flex items-center justify-around relative">
                {Array.from({ length: pen.animalCount }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center transition-transform ${
                      pen.isFed ? 'animate-bounce-slight' : ''
                    }`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <span className="text-3xl sm:text-4xl filter drop-shadow-sm"><GameIcon e={cfg.icon} /></span>
                    <span className="text-[11px] text-slate-400 font-mono">#{i + 1}</span>
                  </div>
                ))}

                {pen.isFed && !isReady && (
                  <div className="absolute top-2 right-3 flex items-center gap-1 text-xs text-pink-600 font-bold animate-pulse">
                    <Heart size={14} className="fill-pink-500" />
                    <span>Đang lớn & sản xuất...</span>
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col gap-2">
                {isReady ? (
                  <button
                    onClick={(e) => onCollectProduce(cfg.id, e)}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer animate-pulse-gentle"
                  >
                    <span className="text-xl"><GameIcon e={cfg.produceIcon} /></span>
                    <span>Thu hoạch {cfg.produceNameVi} (+{pen.animalCount * cfg.expReward} EXP)</span>
                    <Sparkles size={16} />
                  </button>
                ) : pen.isFed ? (
                  <div className="flex flex-col gap-1.5 bg-[#FAF9F5] p-3 rounded-2xl border border-[#F2EFE9]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">Đang sản xuất {cfg.produceNameVi}</span>
                      <span className="font-mono text-amber-700 font-bold tabular-nums">
                        Còn {remaining}s ({progress}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3 bg-[#FAF9F5] p-2.5 rounded-2xl border border-[#F2EFE9]">
                    <div className="text-xs text-slate-600 flex items-center gap-1.5">
                      <span>Cần:</span>
                      <strong className="text-slate-900 font-bold">
                        {feedNeeded} {feedCrop.nameVi} <GameIcon e={feedCrop.icon} />
                      </strong>
                      <span className={`text-[11px] font-mono ${hasEnoughFeed ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}`}>
                        (Có: {feedCropCount})
                      </span>
                    </div>

                    <button
                      onClick={() => onFeedAnimals(cfg.id)}
                      disabled={!hasEnoughFeed}
                      className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                        hasEnoughFeed
                          ? 'bg-[#234230] hover:bg-[#1a3325] text-white cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span><GameIcon e="🌾" /></span>
                      <span>Cho ăn ngay</span>
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
