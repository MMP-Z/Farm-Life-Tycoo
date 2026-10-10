import React, { useState } from 'react';
import { AnimalPen } from '../types/farmSystem';
import { ANIMALS_CONFIG, ALL_ITEMS_CATALOG } from '../config/farmData';
import { Heart, Plus, Droplets, Sparkles, AlertTriangle, Pill, ShieldCheck, DollarSign } from 'lucide-react';
import { sound } from '../utils/sound';
import { formatMoney } from '../utils/format';
import { SpriteIcon } from './SpriteIcon';
import { ANIMAL_SPRITES, MOOD_SPRITES } from '../utils/sprites';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';

const PastureCanvas3D = React.lazy(() => import('./PastureCanvas3D'));

interface Props {
  pens: Record<string, AnimalPen>;
  inventory: { itemId: string; quantity: number }[];
  money: number;
  playerLevel: number;
  onFeedPen: () => void;
  onFillWaterTrough: () => void;
  onCureAnimal: (animalId: string) => void;
  onCollectProduce: (e: React.MouseEvent) => void;
  onBuyAnimal: (animalType: string) => void;
  onUpgradeCapacity: () => void;
  onCleanPen: () => void;
  onSellAnimal: (animalId: string) => void;
}

export const PastureTab: React.FC<Props> = ({
  pens,
  inventory,
  money,
  playerLevel,
  onFeedPen,
  onFillWaterTrough,
  onCureAnimal,
  onCollectProduce,
  onBuyAnimal,
  onUpgradeCapacity,
  onCleanPen,
  onSellAnimal,
}) => {
  const mainPen = pens['main'] || { capacity: 10, animals: [], waterTrough: 100, cleanliness: 100 };
  const [view3D, setView3D] = useState(false);
  const vetMedCount = inventory.find((i) => i.itemId === 'vet_medicine')?.quantity || 0;
  const upgradeCost = 150 + mainPen.capacity * 40;

  // Calculate ready to harvest
  const readyAnimals = mainPen.animals.filter(a => a.daysUntilProduce <= 0 && !a.isSick && a.hunger > 20);

  // Calculate required feed
  const feedNeeded: Record<string, number> = {};
  mainPen.animals.forEach(a => {
    const def = ANIMALS_CONFIG[a.type];
    if (def && def.feedItemId) {
      feedNeeded[def.feedItemId] = (feedNeeded[def.feedItemId] || 0) + def.feedPerDay;
    }
  });

  // Check if we have enough feed
  let canFeedAll = true;
  Object.entries(feedNeeded).forEach(([itemId, amount]) => {
    const inStock = inventory.find(i => i.itemId === itemId)?.quantity || 0;
    if (inStock < amount) canFeedAll = false;
  });

  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      {/* Header Info */}
      <div className="px-panel p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-emerald-50 border flex items-center justify-center text-3xl border-[3px] border-[#3a2b3f]">
            <GameIcon e="🏡" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
              Chuồng Trại
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Đang nuôi: {mainPen.animals.length}/{mainPen.capacity} con
            </p>
          </div>
        </div>
        <button
          onClick={onUpgradeCapacity}
          disabled={money < upgradeCost}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer ${
            money >= upgradeCost
              ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Plus size={12} />
          <span>Mở rộng (<CoinIcon /> {formatMoney(upgradeCost)})</span>
        </button>
      </div>

      {/* Shared Meters */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2] flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium text-xs">
              <Droplets size={14} className="text-sky-600" />
              Máng nước: <strong className="font-mono">{mainPen.waterTrough}%</strong>
            </span>
            {mainPen.waterTrough < 50 && (
              <button onClick={onFillWaterTrough} className="px-2 py-0.5 rounded-lg bg-sky-600 text-white font-bold text-[11px] cursor-pointer">Bơm</button>
            )}
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
            <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${mainPen.waterTrough}%` }}></div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2] flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium text-xs">
              <ShieldCheck size={14} className="text-emerald-700" />
              Vệ sinh: <strong className="font-mono">{mainPen.cleanliness ?? 100}%</strong>
            </span>
            {mainPen.cleanliness < 70 && (
              <button onClick={onCleanPen} className="px-2 py-0.5 rounded-lg bg-emerald-700 text-white font-bold text-[11px] cursor-pointer">Dọn</button>
            )}
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${mainPen.cleanliness}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onFeedPen()}
          disabled={!canFeedAll || mainPen.animals.length === 0}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs ${
            canFeedAll && mainPen.animals.length > 0
              ? 'bg-[#2E4A35] hover:bg-[#233a29] text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-1"><span><GameIcon e="🌾" /></span> Cho ăn toàn bộ</div>
          <div className="text-[11px] font-normal opacity-80 flex flex-wrap gap-1 justify-center">
            {Object.keys(feedNeeded).length === 0 ? '(Chưa cần)' : Object.entries(feedNeeded).map(([id, amt]) => {
              const inStock = inventory.find(i => i.itemId === id)?.quantity || 0;
              return <span key={id} className={inStock < amt ? 'text-rose-300 font-bold' : ''}>{ALL_ITEMS_CATALOG[id]?.name}: {amt}</span>;
            })}
          </div>
        </button>

        <button
          onClick={(e) => onCollectProduce(e)}
          disabled={readyAnimals.length === 0}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-md ${
            readyAnimals.length > 0
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 cursor-pointer animate-pulse-gentle'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-1"><Sparkles size={14} /> Thu hoạch</div>
          <span className="text-[11px] font-normal">{readyAnimals.length} con đã sẵn sàng</span>
        </button>
      </div>


      {/* Toggle 2D / 3D — Phase 3 */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600">Chế độ xem chuồng trại</span>
        <div className="flex rounded-md border-2 border-[#3a2b3f] overflow-hidden text-xs font-bold">
          <button
            onClick={() => setView3D(false)}
            className={`px-3 py-1.5 ${!view3D ? 'bg-[#2E4A35] text-white' : 'bg-white text-slate-600'}`}
          >
            2D
          </button>
          <button
            onClick={() => setView3D(true)}
            className={`px-3 py-1.5 ${view3D ? 'bg-[#2E4A35] text-white' : 'bg-white text-slate-600'}`}
          >
            3D thử nghiệm
          </button>
        </div>
      </div>

      {view3D && (
        <React.Suspense
          fallback={
            <div className="rounded-md border-[3px] border-[#3a2b3f] bg-slate-100 p-8 text-center text-sm font-bold text-slate-500">
              Đang tải 3D…
            </div>
          }
        >
          <PastureCanvas3D
            pen={mainPen}
            onFeedPen={onFeedPen}
            onFillWaterTrough={onFillWaterTrough}
            onCureAnimal={onCureAnimal}
            onSellAnimal={onSellAnimal}
          />
        </React.Suspense>
      )}

      {/* Animal List */}
      <div className="bg-[#FBF9F5] rounded-3xl p-4 border border-[#EFECE1]">
        <h3 className="font-bold text-sm text-slate-800 mb-3">Đàn vật nuôi ({mainPen.animals.length})</h3>
        {mainPen.animals.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-4">Chuồng trại đang trống. Hãy mua con giống ở cửa hàng nông nghiệp!</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {mainPen.animals.map((animal) => {
              const def = ANIMALS_CONFIG[animal.type];
              const sellPrice = Math.floor((def?.buyPrice || 0) / 2);
              const isReady = animal.daysUntilProduce <= 0 && !animal.isSick && animal.hunger > 20;

              return (
                <div key={animal.id} className={`flex flex-col items-center p-3 rounded-2xl bg-white border shadow-xs relative ${isReady ? 'border-amber-300 bg-amber-50/30' : 'border-[#E8E2D2]'}`}>
                  {def && ANIMAL_SPRITES[animal.type]
                    ? <SpriteIcon src={ANIMAL_SPRITES[animal.type]} alt={def.name} size={40} className="filter drop-shadow-xs" />
                    : <span className="text-3xl filter drop-shadow-xs">{def?.icon ? <GameIcon e={def.icon} /> : <GameIcon e="❓" />}</span>}
                  <span className="text-[11px] font-bold text-slate-800 mt-1 text-center leading-tight">{animal.name}</span>
                  
                  {/* Status */}
                  <span className="text-[11px] mt-0.5 flex items-center gap-1">
                    {animal.isSick ? (
                      <><SpriteIcon src={MOOD_SPRITES.sick} alt="Ốm" size={14} /> Ốm</>
                    ) : animal.hunger < 20 ? (
                      <><SpriteIcon src={MOOD_SPRITES.sad} alt="Đói" size={14} /> Đói</>
                    ) : animal.happiness > 70 ? (
                      <><SpriteIcon src={MOOD_SPRITES.happy} alt="Vui vẻ" size={14} /> Vui vẻ</>
                    ) : (
                      <><SpriteIcon src={MOOD_SPRITES.neutral} alt="Bình thường" size={14} /> Bình thường</>
                    )}
                  </span>

                  {/* Ready Indicator */}
                  {isReady && <span className="absolute -top-1 -right-1 bg-amber-400 w-3 h-3 rounded-full border border-white animate-pulse"></span>}

                  <div className="flex w-full gap-1 mt-2">
                    {animal.isSick && (
                      <button
                        onClick={() => onCureAnimal(animal.id)}
                        className="flex-1 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center gap-0.5 cursor-pointer animate-pulse"
                      >
                        <Pill size={10} /> Chữa
                      </button>
                    )}
                    <button
                      onClick={() => onSellAnimal(animal.id)}
                      className="flex-1 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[11px] font-bold flex items-center justify-center gap-0.5 cursor-pointer transition-colors"
                      title="Bán nhận nửa giá vàng"
                    >
                      Bán (<CoinIcon /> {formatMoney(sellPrice)})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
