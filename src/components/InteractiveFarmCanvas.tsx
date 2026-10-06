import React, { useState } from 'react';
import { CROPS } from '../constants/gameData';
import { CropId, FarmPlot } from '../types/game';
import { Droplets, Sparkles, Zap, Plus, Check, RefreshCw } from 'lucide-react';
import { sound } from '../utils/sound';
import { formatMoney } from '../utils/format';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';

interface Props {
  plots: FarmPlot[];
  selectedCropId: CropId;
  onSelectCropId: (cropId: CropId) => void;
  coins: number;
  gems: number;
  playerLevel: number;
  onPlantSeed: (plotId: number, cropId: CropId) => void;
  onPlantAll: (cropId: CropId) => void;
  onHarvestPlot: (plotId: number, e: React.MouseEvent) => void;
  onHarvestAll: () => void;
  onWaterPlot: (plotId: number) => void;
  onFertilizePlot: (plotId: number) => void;
  onInstantGrowPlot: (plotId: number) => void;
  onUnlockPlot: () => void;
  unlockCost: number;
  maxPlots: number;
}

export const InteractiveFarmCanvas: React.FC<Props> = ({
  plots,
  selectedCropId,
  onSelectCropId,
  coins,
  gems,
  playerLevel,
  onPlantSeed,
  onPlantAll,
  onHarvestPlot,
  onHarvestAll,
  onWaterPlot,
  onFertilizePlot,
  onInstantGrowPlot,
  onUnlockPlot,
  unlockCost,
  maxPlots,
}) => {
  const readyPlots = plots.filter((p) => {
    if (!p.cropId || !p.plantedAt) return false;
    const dur = p.watered ? p.duration * 0.5 : p.duration;
    return (Date.now() - p.plantedAt) / 1000 >= dur;
  });

  const emptyPlots = plots.filter((p) => !p.cropId);

  return (
    <div className="flex flex-col gap-4">
      
      {/* Seed Selection Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EAE6DA] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl"><GameIcon e="🌱" /></span>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Chọn Hạt Giống Gieo Trồng
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Chạm để chọn loại hạt muốn gieo</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {Object.values(CROPS).map((crop) => {
            const isSelected = selectedCropId === crop.id;
            const isLocked = playerLevel < crop.minLevel;
            const canAfford = coins >= crop.buyCost;

            return (
              <button
                key={crop.id}
                onClick={() => {
                  if (!isLocked) {
                    onSelectCropId(crop.id);
                    sound.playClick();
                  }
                }}
                disabled={isLocked}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-between text-left transition-all cursor-pointer ${
                  isLocked
                    ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                    : isSelected
                    ? 'bg-[#234230] text-white border-[#234230] shadow-md scale-102 ring-2 ring-[#234230]/30'
                    : 'bg-[#FAF9F5] border-[#EAE6DA] text-slate-800 hover:bg-white'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-1 filter drop-shadow-sm"><GameIcon e={crop.icon} /></span>
                  <span className="font-extrabold text-xs sm:text-sm text-center leading-tight truncate w-full">
                    {crop.nameVi}
                  </span>
                </div>

                <div className="mt-2 pt-1.5 border-t border-current/15 w-full flex items-center justify-between text-[11px] font-mono">
                  {isLocked ? (
                    <span className="text-amber-500 font-bold mx-auto">Khóa (Lv.{crop.minLevel})</span>
                  ) : (
                    <>
                      <span className={`font-bold ${isSelected ? 'text-amber-300' : canAfford ? 'text-amber-700' : 'text-rose-500'}`}>
                        <CoinIcon /> {formatMoney(crop.buyCost)}
                      </span>
                      <span className={`opacity-80 ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                        ⏱️ {crop.growTime}s
                      </span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#FAF9F5] p-3.5 rounded-3xl border border-[#EAE6DA]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Trạng thái cánh đồng:</span>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            {plots.length} ô đất ({readyPlots.length} chín rộ · {emptyPlots.length} ô trống)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {emptyPlots.length > 0 && (
            <button
              onClick={() => onPlantAll(selectedCropId)}
              className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span>{CROPS[selectedCropId].icon}</span>
              <span>Gieo hết ({emptyPlots.length} ô)</span>
            </button>
          )}

          {readyPlots.length > 0 && (
            <button
              onClick={onHarvestAll}
              className="px-4 py-2 rounded-2xl bg-[#234230] hover:bg-[#1a3325] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer animate-pulse-gentle"
            >
              <span><GameIcon e="🧺" /></span>
              <span>Thu hoạch tất cả ({readyPlots.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Soil Plots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {plots.map((plot) => {
          const crop = plot.cropId ? CROPS[plot.cropId] : null;
          const effectiveDuration = plot.watered ? plot.duration * 0.5 : plot.duration;

          let progress = 0;
          let remaining = 0;
          let isReady = false;

          if (plot.plantedAt && plot.cropId) {
            const elapsed = (Date.now() - plot.plantedAt) / 1000;
            progress = Math.min(100, Math.floor((elapsed / effectiveDuration) * 100));
            remaining = Math.max(0, Math.ceil(effectiveDuration - elapsed));
            isReady = elapsed >= effectiveDuration;
          }

          return (
            <div
              key={plot.id}
              onClick={(e) => {
                if (!plot.cropId) {
                  onPlantSeed(plot.id, selectedCropId);
                } else if (isReady) {
                  onHarvestPlot(plot.id, e);
                }
              }}
              className={`rounded-3xl p-4 flex flex-col justify-between min-h-[170px] border-2 transition-all relative select-none shadow-sm cursor-pointer ${
                !plot.cropId
                  ? 'bg-gradient-to-b from-[#694C35] to-[#543A26] border-[#7F5E43] hover:border-amber-400 hover:scale-[1.02]'
                  : isReady
                  ? 'bg-gradient-to-b from-[#2E583A] to-[#1E3F27] border-amber-400 ring-4 ring-amber-400/30 scale-[1.02] shadow-xl'
                  : 'bg-gradient-to-b from-[#4A3423] to-[#3B281A] border-[#5F442F]'
              }`}
            >
              {/* Plot Header */}
              <div className="w-full flex items-center justify-between text-xs text-amber-200">
                <span className="font-mono font-bold text-[11px] opacity-80">Ô đất #{plot.id}</span>
                <div className="flex items-center gap-1">
                  {plot.watered && (
                    <span className="bg-sky-500/30 text-sky-200 border border-sky-400/40 px-1.5 py-0.2 rounded-md text-[11px] flex items-center gap-0.5">
                      <Droplets size={11} /> Ẩm ướt (2x)
                    </span>
                  )}
                  {plot.fertilized && (
                    <span className="bg-purple-500/30 text-purple-200 border border-purple-400/40 px-1.5 py-0.2 rounded-md text-[11px] flex items-center gap-0.5">
                      <Sparkles size={11} /> +1 Quả
                    </span>
                  )}
                </div>
              </div>

              {/* Main Visual Display */}
              <div className="my-auto flex flex-col items-center justify-center text-center py-2">
                {!plot.cropId ? (
                  <div className="flex flex-col items-center group">
                    <span className="text-4xl opacity-50 group-hover:opacity-90 group-hover:scale-110 transition-transform">
                      <GameIcon e="🌱" />
                    </span>
                    <span className="text-xs font-bold text-amber-100 mt-1">Đất trống sẵn sàng</span>
                    <span className="text-[11px] text-amber-300/80">Chạm để gieo {CROPS[selectedCropId].nameVi}</span>
                  </div>
                ) : isReady ? (
                  <div className="flex flex-col items-center animate-bounce-slight">
                    <span className="text-5xl filter drop-shadow-lg"><GameIcon e={crop?.icon} /></span>
                    <span className="text-xs font-black text-amber-300 mt-1.5">{crop?.nameVi} đã chín rộ!</span>
                    <span className="text-[11px] font-bold text-emerald-950 bg-amber-400 px-3 py-0.5 rounded-full mt-1 shadow-md">
                      Chạm để thu hoạch
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full">
                    <span className="text-4xl filter drop-shadow">
                      {progress < 40 ? <GameIcon e="🌱" /> : progress < 75 ? <GameIcon e="🌿" /> : <GameIcon e={crop?.icon} />}
                    </span>
                    <span className="text-xs font-bold text-slate-100 mt-1">{crop?.nameVi}</span>

                    {/* Progress Bar */}
                    <div className="w-full max-w-[120px] h-2 bg-black/40 rounded-full overflow-hidden mt-1.5 p-0.5 border border-amber-900">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-amber-200/90 mt-1 tabular-nums font-semibold">
                      Còn {remaining}s ({progress}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons for Growing Plot */}
              {plot.cropId && !isReady && (
                <div
                  className="w-full flex items-center justify-between gap-1 pt-2 border-t border-white/10 text-[11px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!plot.watered && (
                    <button
                      onClick={() => onWaterPlot(plot.id)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
                      title="Tưới nước giúp tăng tốc độ sinh trưởng gấp đôi"
                    >
                      <Droplets size={12} /> Tưới
                    </button>
                  )}

                  {!plot.fertilized && (
                    <button
                      onClick={() => onFertilizePlot(plot.id)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
                      title="Bón phân nhận thêm +1 sản lượng khi thu hoạch (20 vàng)"
                    >
                      <Sparkles size={12} /> Phân (20<CoinIcon />)
                    </button>
                  )}

                  <button
                    onClick={() => onInstantGrowPlot(plot.id)}
                    className="py-1.5 px-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center justify-center gap-0.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                    title="Chín tức thì bằng 1 Kim Cương"
                  >
                    <Zap size={12} /> 1<GameIcon e="💎" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Khai Hoang Ô Đất Mới */}
        {plots.length < maxPlots && (
          <div
            onClick={onUnlockPlot}
            className="rounded-3xl border-2 border-dashed border-emerald-600/60 hover:border-amber-500 bg-emerald-950/10 hover:bg-emerald-950/20 p-5 flex flex-col items-center justify-center min-h-[170px] cursor-pointer transition-all text-center group shadow-xs"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 group-hover:bg-amber-100 text-emerald-800 group-hover:text-amber-800 flex items-center justify-center mb-2 transition-colors">
              <Plus size={24} className="stroke-[3]" />
            </div>
            <span className="font-extrabold text-slate-900 text-sm">Khai Hoang Ô Đất Mới</span>
            <span className="text-xs text-amber-700 font-mono font-bold mt-1"><CoinIcon /> {formatMoney(unlockCost)}</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Mở rộng thêm diện tích</span>
          </div>
        )}
      </div>

    </div>
  );
};
