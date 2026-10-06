import React, { useState } from 'react';
import { CROPS } from '../constants/gameData';
import { CropId, FarmPlot } from '../types/game';
import { Sparkles, Droplets, Zap, PlusCircle } from 'lucide-react';
import { formatMoney } from '../utils/format';

interface Props {
  plots: FarmPlot[];
  selectedCropId: CropId;
  onSelectCropId: (id: CropId) => void;
  playerLevel: number;
  playerCoins: number;
  playerGems: number;
  onPlantSeed: (plotId: number, cropId: CropId) => void;
  onPlantAll: (cropId: CropId) => void;
  onHarvestPlot: (plotId: number, e: React.MouseEvent) => void;
  onHarvestAll: () => void;
  onWaterPlot: (plotId: number) => void;
  onFertilizePlot: (plotId: number) => void;
  onInstantGrowPlot: (plotId: number) => void;
  onUnlockNewPlot: () => void;
  unlockCost: number;
  maxPlotsAllowed: number;
  isRainy: boolean;
}

export const CropsSection: React.FC<Props> = ({
  plots,
  selectedCropId,
  onSelectCropId,
  playerLevel,
  playerCoins,
  playerGems,
  onPlantSeed,
  onPlantAll,
  onHarvestPlot,
  onHarvestAll,
  onWaterPlot,
  onFertilizePlot,
  onInstantGrowPlot,
  onUnlockNewPlot,
  unlockCost,
  maxPlotsAllowed,
  isRainy,
}) => {
  const [activePlotMenu, setActivePlotMenu] = useState<number | null>(null);

  const readyPlotsCount = plots.filter((p) => {
    if (!p.cropId || !p.plantedAt) return false;
    const effectiveDuration = p.watered || isRainy ? p.duration * 0.7 : p.duration;
    const elapsed = (Date.now() - p.plantedAt) / 1000;
    return elapsed >= effectiveDuration;
  }).length;

  const emptyPlotsCount = plots.filter((p) => !p.cropId).length;

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header & Quick Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#21432c]/90 p-3 rounded-2xl border border-emerald-700/50 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <div>
            <h2 className="font-bold text-white text-sm sm:text-base leading-tight">Cánh Đồng Hoa Màu</h2>
            <p className="text-emerald-300/80 text-[11px]">
              {plots.length} ô đất · {readyPlotsCount} ô chín · {emptyPlotsCount} ô trống
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {readyPlotsCount > 0 && (
            <button
              onClick={onHarvestAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <span>🧺</span>
              <span>Thu hoạch tất cả ({readyPlotsCount})</span>
            </button>
          )}

          {emptyPlotsCount > 0 && (
            <button
              onClick={() => onPlantAll(selectedCropId)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <span>{CROPS[selectedCropId].icon}</span>
              <span>Gieo hết ({emptyPlotsCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Seed Selection Drawer */}
      <div className="bg-[#1e3a27]/90 p-3 rounded-2xl border border-emerald-800/60 shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-emerald-200 tracking-wide uppercase">Chọn Hạt Giống Gieo Trồng</span>
          <span className="text-[11px] text-emerald-400">Chạm để chọn loại hạt</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Object.values(CROPS).map((crop) => {
            const isSelected = selectedCropId === crop.id;
            const isLocked = playerLevel < crop.minLevel;
            const canAfford = playerCoins >= crop.buyCost;

            return (
              <button
                key={crop.id}
                onClick={() => !isLocked && onSelectCropId(crop.id)}
                disabled={isLocked}
                className={`relative flex flex-col items-center p-2 rounded-xl border transition-all text-left cursor-pointer ${
                  isLocked
                    ? 'opacity-40 bg-black/20 border-emerald-950 cursor-not-allowed'
                    : isSelected
                    ? 'bg-amber-400/20 border-amber-400 shadow-md ring-2 ring-amber-400/40 -translate-y-0.5'
                    : 'bg-[#264b32]/80 border-emerald-700/60 hover:border-emerald-500'
                }`}
              >
                {/* Crop Icon */}
                <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow">{crop.icon}</span>

                {/* Name */}
                <span className="text-xs font-bold text-white text-center leading-tight truncate w-full">
                  {crop.nameVi}
                </span>

                {/* Details */}
                <div className="mt-1 flex flex-col items-center text-[11px] w-full text-center">
                  {isLocked ? (
                    <span className="text-amber-300 font-semibold">🔒 Lv.{crop.minLevel}</span>
                  ) : (
                    <>
                      <span className={`font-mono font-medium ${canAfford ? 'text-amber-300' : 'text-rose-400'}`}>
                        💰 {formatMoney(crop.buyCost)}
                      </span>
                      <span className="text-emerald-300/80 font-mono text-[11px]">⏱️ {crop.growTime}s</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Farm Plots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {plots.map((plot) => {
          const crop = plot.cropId ? CROPS[plot.cropId] : null;
          const isWatered = plot.watered || isRainy;
          const effectiveDuration = isWatered ? plot.duration * 0.7 : plot.duration;

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
              className={`relative rounded-2xl border p-3 flex flex-col items-center justify-between min-h-[155px] sm:min-h-[170px] shadow-lg transition-all ${
                !plot.cropId
                  ? 'bg-gradient-to-b from-[#4A3525] to-[#3B281B] border-[#654A34] hover:border-amber-500/80 cursor-pointer'
                  : isReady
                  ? 'bg-gradient-to-b from-[#2e593a] to-[#1c3c25] border-amber-400 ring-2 ring-amber-400/40 animate-pulse-gentle cursor-pointer'
                  : 'bg-gradient-to-b from-[#382b20] to-[#2b1f15] border-[#533d2c]'
              }`}
              onClick={(e) => {
                if (!plot.cropId) {
                  onPlantSeed(plot.id, selectedCropId);
                } else if (isReady) {
                  onHarvestPlot(plot.id, e);
                } else {
                  setActivePlotMenu(activePlotMenu === plot.id ? null : plot.id);
                }
              }}
            >
              {/* Soil Header & Badge */}
              <div className="w-full flex items-center justify-between text-[11px] text-amber-200/80">
                <span className="font-mono font-semibold">Ô #{plot.id}</span>
                <div className="flex items-center gap-1">
                  {isWatered && (
                    <span className="bg-sky-500/30 text-sky-200 border border-sky-400/40 px-1 py-0.2 rounded-md text-[11px] flex items-center gap-0.5">
                      <Droplets size={10} /> Ướt
                    </span>
                  )}
                  {plot.fertilized && (
                    <span className="bg-purple-500/30 text-purple-200 border border-purple-400/40 px-1 py-0.2 rounded-md text-[11px] flex items-center gap-0.5">
                      <Sparkles size={10} /> +1
                    </span>
                  )}
                </div>
              </div>

              {/* Center Content */}
              <div className="flex-1 flex flex-col items-center justify-center my-1">
                {!plot.cropId ? (
                  <div className="flex flex-col items-center text-center group">
                    <span className="text-3xl sm:text-4xl opacity-50 group-hover:opacity-90 group-hover:scale-110 transition-transform">
                      🌱
                    </span>
                    <span className="text-xs font-bold text-amber-200/80 mt-1">Đất trống</span>
                    <span className="text-[11px] text-emerald-400/90">Chạm gieo hạt</span>
                  </div>
                ) : isReady ? (
                  <div className="flex flex-col items-center text-center animate-bounce-slight">
                    <span className="text-4xl sm:text-5xl filter drop-shadow-lg">{crop?.icon}</span>
                    <span className="text-xs font-extrabold text-amber-300 mt-1">{crop?.nameVi} chín!</span>
                    <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full mt-0.5 border border-emerald-500/40">
                      Chạm để thu hoạch
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    {/* Growth stage icon */}
                    <span className="text-3xl sm:text-4xl filter drop-shadow">
                      {progress < 35 ? '🌱' : progress < 75 ? '🌿' : crop?.icon}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 mt-1">{crop?.nameVi}</span>

                    {/* Progress Bar & Countdown */}
                    <div className="w-24 sm:w-28 h-2 bg-slate-900/90 rounded-full overflow-hidden mt-1.5 border border-amber-900/50 p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-amber-300/90 mt-1 tabular-nums">
                      Còn {remaining}s ({progress}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons at Bottom of Plot */}
              {plot.cropId && !isReady && (
                <div
                  className="w-full flex items-center justify-between gap-1 pt-1.5 border-t border-amber-900/40 text-[11px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!isWatered && (
                    <button
                      onClick={() => onWaterPlot(plot.id)}
                      className="flex-1 py-1 px-1 rounded-lg bg-sky-600/80 hover:bg-sky-600 text-white font-medium flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
                      title="Tưới nước giúp giảm 30% thời gian"
                    >
                      <Droplets size={11} /> Tưới
                    </button>
                  )}
                  {!plot.fertilized && (
                    <button
                      onClick={() => onFertilizePlot(plot.id)}
                      className="flex-1 py-1 px-1 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white font-medium flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
                      title="Bón phân nhận thêm +1 sản phẩm khi thu hoạch (20 vàng)"
                    >
                      <Sparkles size={11} /> Phân (20💰)
                    </button>
                  )}
                  <button
                    onClick={() => onInstantGrowPlot(plot.id)}
                    className="flex-1 py-1 px-1 rounded-lg bg-amber-500/90 hover:bg-amber-500 text-slate-950 font-bold flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
                    title="Chín ngay lập tức bằng 1 Kim Cương"
                  >
                    <Zap size={11} /> 1💎
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Unlock New Plot Card */}
        {plots.length < maxPlotsAllowed && (
          <div
            onClick={onUnlockNewPlot}
            className="rounded-2xl border-2 border-dashed border-emerald-600/50 hover:border-amber-400 bg-emerald-950/20 hover:bg-emerald-900/30 p-3 flex flex-col items-center justify-center min-h-[155px] sm:min-h-[170px] cursor-pointer transition-all text-center group"
          >
            <PlusCircle className="text-emerald-400 group-hover:text-amber-400 group-hover:scale-110 transition-transform mb-1" size={32} />
            <span className="font-bold text-white text-xs sm:text-sm">Khai Hoang Ô Đất Mới</span>
            <span className="text-[11px] text-amber-300 font-mono mt-1 font-semibold">💰 💰 {formatMoney(unlockCost)}</span>
            <span className="text-[11px] text-emerald-400/80 mt-0.5">Mở rộng diện tích nông trại</span>
          </div>
        )}
      </div>
    </div>
  );
};
