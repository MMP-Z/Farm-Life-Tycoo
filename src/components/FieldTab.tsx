import React, { useState } from 'react';
import { FieldPlot, Season } from '../types/farmSystem';
import { CROPS_CONFIG } from '../config/farmData';
import { SOIL_CONFIG } from '../config/variabilityData';
import { getSoilYieldFactor } from '../utils/seedEngine';
import { Droplets, Sparkles, Scissors, Shovel, Bug, Plus } from 'lucide-react';
import { sound } from '../utils/sound';
import { formatMoney } from '../utils/format';
import { SpriteIcon } from './SpriteIcon';
import { CROP_SPRITES, getCropStageSprite } from '../utils/sprites';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';

interface Props {
  plots: FieldPlot[];
  currentSeason: Season;
  currentDay: number;
  timeOfDay: number;
  isHardworking: boolean;
  money: number;
  inventory: { itemId: string; quantity: number }[];
  onPlowPlot: (plotId: number) => void;
  onPlantCrop: (plotId: number, cropId: string) => void;
  onWaterPlot: (plotId: number) => void;
  onFertilizePlot: (plotId: number) => void;
  onCurePestPlot: (plotId: number) => void;
  onHarvestPlot: (plotId: number, e: React.MouseEvent) => void;
  onHarvestAll: () => void;
  onWaterAll: () => void;
  onBuyNewPlot: () => void;
  plotCost: number;
  maxPlots: number;
}

export const FieldTab: React.FC<Props> = ({
  plots,
  currentSeason,
  currentDay,
  timeOfDay,
  isHardworking,
  money,
  inventory,
  onPlowPlot,
  onPlantCrop,
  onWaterPlot,
  onFertilizePlot,
  onCurePestPlot,
  onHarvestPlot,
  onHarvestAll,
  onWaterAll,
  onBuyNewPlot,
  plotCost,
  maxPlots,
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('wheat');
  const [, setToolMode] = useState<'plant' | 'water' | 'fertilize' | 'cure'>('plant');

  const readyCount = plots.filter((p) => p.state === 'ready').length;
  const dryCount = plots.filter((p) => p.moisture < 30).length;

  const seedInventoryCount = inventory.find((i) => i.itemId === `${selectedCropId}_seed`)?.quantity || 0;
  const fertilizerCount = inventory.find((i) => i.itemId === 'fertilizer')?.quantity || 0;
  const pesticideCount = inventory.find((i) => i.itemId === 'pesticide')?.quantity || 0;

  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      
      {/* Banner & Quick Status */}
      <div className="px-panel p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <SpriteIcon src={CROP_SPRITES.wheat.mature} alt="Cánh đồng" size={34} />
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">Cánh Đồng & Luống Đất Canh Tác</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Chăm sóc thổ nhưỡng theo tính chất đất (Phù sa, Cát, Sét, Đồi), tưới ẩm và luân canh để đạt năng suất cao
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {dryCount > 0 && (
            <button
              data-tutorial="water-all"
              onClick={onWaterAll}
              className="flex-1 sm:flex-none px-3.5 py-2.5 px-btn px-btn-blue font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Droplets size={14} />
              <span>Tưới ({dryCount} ô khô)</span>
            </button>
          )}

          {readyCount > 0 && (
            <button
              onClick={onHarvestAll}
              className="flex-1 sm:flex-none px-4 py-2.5 px-btn px-btn-green font-bold text-xs flex items-center justify-center gap-1.5 animate-pulse-gentle"
            >
              <Scissors size={14} />
              <span>Thu hoạch ({readyCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Seed Selection Bar */}
      <div className="px-panel p-3 sm:p-5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Chọn Hạt Giống Gieo Trồng:
          </span>
          <span className="text-xs text-slate-500">
            Kho: <strong className="text-slate-900 font-mono font-bold">{seedInventoryCount} túi</strong>
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Object.values(CROPS_CONFIG).map((crop) => {
            const isSelected = selectedCropId === crop.id;
            const isSeason = crop.seasons.includes(currentSeason);
            const inStock = inventory.find((i) => i.itemId === `${crop.id}_seed`)?.quantity || 0;

            return (
              <button
                key={crop.id}
                onClick={() => {
                  setSelectedCropId(crop.id);
                  setToolMode('plant');
                  sound.playClick();
                }}
                className={`p-2 sm:p-3 rounded-md border-[3px] flex flex-col items-center justify-between text-left transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-[#2E4A35] text-white border-[#3a2b3f] shadow-[0_3px_0_rgba(0,0,0,0.35)] scale-[1.02]'
                    : 'bg-[#FAF8F2] border-[#3a2b3f] text-slate-800 hover:bg-white shadow-[0_2px_0_rgba(58,43,63,0.2)]'
                }`}
              >
                <div className="flex flex-col items-center text-center w-full">
                  <div className="mb-0.5 filter drop-shadow-xs">
                    {CROP_SPRITES[crop.id]
                      ? <SpriteIcon src={CROP_SPRITES[crop.id].item} alt={crop.name} size={34} />
                      : <span className="text-2xl sm:text-3xl"><GameIcon e={crop.icon} /></span>}
                  </div>
                  <span className="font-extrabold text-[11px] sm:text-sm truncate w-full leading-tight font-display" title={`Hạt giống ${crop.name}`}>
                    Giống {crop.name}
                  </span>
                  <span className={`text-[11px] sm:text-[11px] font-bold mt-0.5 px-1 py-0.2 rounded-md ${
                    isSeason
                      ? isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                      : isSelected ? 'bg-amber-800 text-amber-200' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {isSeason ? 'Đúng vụ' : 'Trái vụ'}
                  </span>
                </div>

                <div className="mt-2 pt-1 border-t border-current/15 w-full flex items-center justify-between text-[11px] sm:text-[11px] font-mono">
                  <span className="opacity-80">x{inStock}</span>
                  <span className="font-bold"><GameIcon e="⏱️" />{crop.growDays}d</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Plots with Soil System */}
      <div data-tutorial="plots-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {plots.map((plot) => {
          const crop = plot.cropId ? CROPS_CONFIG[plot.cropId] : null;
          const soilDef = SOIL_CONFIG[plot.soilType] || SOIL_CONFIG.alluvial;
          const targetCropId = plot.cropId || selectedCropId;
          const soilFactor = getSoilYieldFactor(targetCropId, plot.soilType, plot.specialFeature);

          let progressPercent = 0;
          let daysLeft = 0;

          if (plot.cropId && plot.plantedDay !== null && crop) {
            const isCorrectSeason = crop.seasons.includes(currentSeason);
            const seasonFactor = isCorrectSeason ? 1.0 : 0.67;
            const moistureFactor = plot.moisture > 30 ? 1.0 : 0.5;
            // FIX: tính theo thời gian thực (kể cả phần lẻ trong ngày) và perk nông dân,
            // khớp 100% công thức trong timeEngine — trước đây thanh chỉ nhảy theo ngày chẵn
            // nên trông như "đứng yên" và chậm hơn thực tế
            const perkFactor = isHardworking ? 1.15 : 1.0;
            const currentAbsoluteTime = currentDay + (timeOfDay || 0);
            const effectiveDays =
              (currentAbsoluteTime - plot.plantedDay) * seasonFactor * moistureFactor * perkFactor;
            progressPercent = Math.min(100, Math.floor((effectiveDays / crop.growDays) * 100));
            daysLeft = Math.max(0, Math.ceil(crop.growDays - effectiveDays));
          }

          return (
            <div
              key={plot.id}
              onClick={(e) => {
                if (plot.state === 'empty') {
                  onPlowPlot(plot.id);
                } else if (plot.state === 'plowed') {
                  onPlantCrop(plot.id, selectedCropId);
                } else if (plot.state === 'ready') {
                  onHarvestPlot(plot.id, e);
                } else if (plot.hasPest) {
                  onCurePestPlot(plot.id);
                }
              }}
              className={`rounded-md p-3 sm:p-4 flex flex-col justify-between min-h-[180px] sm:min-h-[210px] border-[3px] transition-all relative select-none cursor-pointer ${
                plot.state === 'empty'
                  ? 'bg-[#EFE9D7] border-[#3a2b3f] hover:border-amber-400 shadow-[0_3px_0_rgba(58,43,63,0.25)]'
                  : plot.state === 'plowed'
                  ? 'bg-gradient-to-b from-[#6A4D38] to-[#553C2A] border-[#3a2b3f] text-amber-100 hover:border-amber-400 shadow-[0_3px_0_rgba(0,0,0,0.3)]'
                  : plot.state === 'ready'
                  ? 'bg-gradient-to-b from-[#2E583A] to-[#1C3E25] border-amber-400 text-white shadow-[0_3px_0_rgba(0,0,0,0.3),0_0_0_3px_rgba(251,191,36,0.35)]'
                  : 'bg-gradient-to-b from-[#4C3725] to-[#3A2719] border-[#3a2b3f] text-amber-100 shadow-[0_3px_0_rgba(0,0,0,0.3)]'
              }`}
            >
              {/* Plot Header: ID & Soil Type & Special Feature — gọn trên mobile, không xuống dòng lộn xộn */}
              <div className="flex items-center justify-between gap-1 text-[11px] font-mono font-bold">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="opacity-80 shrink-0">#{plot.id}</span>
                  <span
                    className="px-1.5 py-0.5 rounded-md text-[11px] bg-black/25 text-amber-200 border border-white/10 whitespace-nowrap truncate"
                    title={soilDef.description}
                  >
                    <GameIcon e={soilDef.icon} /> {soilDef.name.replace('Đất ', '')}
                  </span>
                  {plot.specialFeature === 'spring' && (
                    <span className="px-1 py-0.2 rounded text-[11px] bg-sky-500/30 text-sky-200 shrink-0" title="Suối nước ngầm tự dưỡng ẩm">
                      <GameIcon e="💧" />
                    </span>
                  )}
                  {plot.specialFeature === 'mineral' && (
                    <span className="px-1 py-0.2 rounded text-[11px] bg-amber-500/30 text-amber-200 shrink-0" title="Đất giàu khoáng (+20% sản lượng)">
                      <GameIcon e="✨" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className={`px-1.5 py-0.5 rounded-md text-[11px] ${
                    plot.moisture > 60
                      ? 'bg-sky-500/25 text-sky-200 border border-sky-400/30'
                      : plot.moisture > 20
                      ? 'bg-amber-500/25 text-amber-200 border border-amber-400/30'
                      : 'bg-rose-500/30 text-rose-200 border border-rose-400/40 animate-pulse'
                  }`}>
                    <GameIcon e="💧" />{plot.moisture}%
                  </span>
                </div>
              </div>

              {/* Main Visual Content */}
              <div className="my-auto flex flex-col items-center justify-center text-center py-1.5">
                {plot.state === 'empty' && (
                  <div className="flex flex-col items-center group">
                    <Shovel size={26} className="text-slate-400 group-hover:text-amber-700 transition-colors" />
                    <span className="text-xs font-bold text-slate-700 mt-1">Đất hoang ({soilDef.name})</span>
                    <span className="text-[11px] text-slate-500">Chạm để cày đất</span>
                  </div>
                )}

                {plot.state === 'plowed' && (
                  <div className="flex flex-col items-center group">
                    <span className="mb-0.5 group-hover:scale-110 transition-transform">
                      {CROP_SPRITES[selectedCropId]
                        ? <SpriteIcon src={CROP_SPRITES[selectedCropId].seed} alt="Hạt giống" size={32} />
                        : <span className="text-3xl"><GameIcon e="🌱" /></span>}
                    </span>
                    <span className="text-xs font-bold text-amber-200">Đất đã cày xới</span>
                    <span className="text-[11px] text-amber-300/90 font-medium">
                      Gieo {CROPS_CONFIG[selectedCropId]?.name} · {soilFactor.note}
                    </span>
                  </div>
                )}

                {plot.state === 'growing' && (
                  <div className="flex flex-col items-center w-full">
                    <span className="filter drop-shadow-sm mb-0.5 animate-bounce-slight">
                      {plot.cropId && CROP_SPRITES[plot.cropId]
                        ? <SpriteIcon src={getCropStageSprite(plot.cropId, progressPercent)} alt={crop?.name || ''} size={44} />
                        : <span className="text-4xl">{progressPercent < 35 ? <GameIcon e="🌱" /> : progressPercent < 75 ? <GameIcon e="🌿" /> : <GameIcon e={crop?.icon} />}</span>}
                    </span>
                    <span className="font-extrabold text-xs text-white leading-tight font-display">{crop?.name}</span>

                    {/* Progress Bar */}
                    <div className="w-full max-w-[120px] h-2 bg-black/40 rounded-full overflow-hidden mt-1 p-0.5 border border-amber-900">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-amber-200/90 mt-0.5">
                      Còn ~{daysLeft}d ({soilFactor.bonusPercent > 0 ? `+${soilFactor.bonusPercent}% SL` : '1.0x'})
                    </span>

                    {/* Pest alert */}
                    {plot.hasPest && (
                      <div className="mt-1 flex items-center gap-1 bg-rose-950/80 text-rose-300 border border-rose-500/50 px-2 py-0.5 rounded-full text-[11px] font-bold animate-pulse">
                        <Bug size={11} /> Sâu cắn lá (-40% SL)!
                      </div>
                    )}
                  </div>
                )}

                {plot.state === 'ready' && (
                  <div className="flex flex-col items-center animate-bounce-slight">
                    <span className="filter drop-shadow-md mb-0.5">
                      {plot.cropId && CROP_SPRITES[plot.cropId]
                        ? <SpriteIcon src={CROP_SPRITES[plot.cropId].mature} alt={crop?.name || ''} size={52} />
                        : <span className="text-4xl sm:text-5xl"><GameIcon e={crop?.icon} /></span>}
                    </span>
                    <span className="font-black text-xs text-amber-300 font-display">{crop?.name} chín rộ!</span>
                    <span className="text-[11px] font-extrabold text-emerald-950 bg-amber-400 px-3 py-0.5 rounded-full mt-1 shadow-md">
                      Thu hoạch ({soilFactor.note})
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Action Mini Bar */}
              <div
                className="w-full flex items-center justify-between gap-1 pt-1.5 border-t border-white/10 text-[11px]"
                onClick={(e) => e.stopPropagation()}
              >
                {plot.state === 'growing' && (
                  <>
                    <button
                      onClick={() => onWaterPlot(plot.id)}
                      className="flex-1 py-1 px-1.5 px-btn px-btn-blue font-bold flex items-center justify-center gap-0.5 text-[11px]"
                      title="Tưới nước giúp đất giữ ẩm"
                    >
                      <Droplets size={11} /> Tưới
                    </button>

                    {!plot.fertilized && (
                      <button
                        onClick={() => onFertilizePlot(plot.id)}
                        className="flex-1 py-1 px-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-0.5 transition-all active:scale-95 cursor-pointer border-[3px] border-[#3a2b3f] shadow-[0_2px_0_rgba(0,0,0,0.3)] text-[11px]"
                        title="Bón phân tăng sản lượng (+25%)"
                      >
                        <Sparkles size={11} /> Bón ({fertilizerCount})
                      </button>
                    )}

                    {plot.hasPest && (
                      <button
                        onClick={() => onCurePestPlot(plot.id)}
                        className="flex-1 py-1 px-1.5 px-btn px-btn-red font-bold flex items-center justify-center gap-0.5 text-[11px]"
                        title="Xịt thuốc trừ sâu bảo vệ sản lượng"
                      >
                        <Bug size={11} /> Xịt ({pesticideCount})
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Khai hoang ô đất mới */}
        {plots.length < maxPlots && (
          <div
            onClick={onBuyNewPlot}
            className="rounded-md border-[3px] border-dashed border-emerald-700 hover:border-amber-500 bg-emerald-900/5 hover:bg-emerald-900/10 p-4 flex flex-col items-center justify-center min-h-[210px] cursor-pointer transition-all text-center group active:scale-95 shadow-[0_3px_0_rgba(0,0,0,0.15)]"
          >
            <div className="w-12 h-12 rounded-md bg-emerald-100 group-hover:bg-amber-100 text-emerald-800 group-hover:text-amber-800 flex items-center justify-center mb-2 transition-colors border-[3px] border-[#3a2b3f]">
              <Plus size={24} className="stroke-[3]" />
            </div>
            <span className="font-extrabold text-slate-900 text-sm font-display">Khai Hoang Ô Đất Mới</span>
            <span className="text-xs text-amber-800 font-mono font-bold mt-1"><CoinIcon /> {formatMoney(plotCost)}</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Sinh loại đất ngẫu nhiên theo Seed</span>
          </div>
        )}
      </div>

    </div>
  );
};
