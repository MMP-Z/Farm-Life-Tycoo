import React from 'react';
import { AnimalPen } from '../types/farmSystem';
import { ANIMALS_CONFIG } from '../config/farmData';
import { Heart, Plus, Droplets, Sparkles, AlertTriangle, Pill, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/sound';

interface Props {
  pens: Record<string, AnimalPen>;
  inventory: { itemId: string; quantity: number }[];
  money: number;
  playerLevel: number;
  onFeedPen: (penType: string) => void;
  onFillWaterTrough: (penType: string) => void;
  onCureAnimal: (penType: string, animalId: string) => void;
  onCollectProduce: (penType: string, e: React.MouseEvent) => void;
  onBuyAnimal: (penType: string) => void;
  onUpgradeCapacity: (penType: string) => void;
  onCleanPen: (penType: string) => void;
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
}) => {
  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E2D2] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl shadow-inner">
            🐮
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
              Khu Chuồng Trại Chăn Nuôi Cozy
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Cho ăn, bơm nước máng, dọn vệ sinh chuồng và vuốt ve để đàn vật nuôi vui vẻ cho sản lượng cao nhất
            </p>
          </div>
        </div>
      </div>

      {/* Pens List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.values(ANIMALS_CONFIG).map((def) => {
          const pen = pens[def.id] || { capacity: 2, animals: [], waterTrough: 100, cleanliness: 100 };
          const isUnlocked = playerLevel >= def.unlockLevel;
          const feedInStock = inventory.find((i) => i.itemId === def.feedItemId)?.quantity || 0;
          const vetMedCount = inventory.find((i) => i.itemId === 'vet_medicine')?.quantity || 0;
          const requiredFeed = pen.animals.length * def.feedPerDay;
          const readyCount = pen.animals.filter((a) => a.daysUntilProduce <= 0).length;
          const upgradeCost = 150 + pen.capacity * 80;

          if (!isUnlocked) {
            return (
              <div
                key={def.id}
                className="bg-white rounded-3xl border border-[#E8E2D2] p-6 flex flex-col justify-between min-h-[240px] shadow-xs opacity-75"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl opacity-50 shrink-0">
                    {def.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 font-display">{def.name}</h3>
                    <p className="text-xs text-amber-800 font-bold mt-1">Mở khóa khi đạt Cấp Độ {def.unlockLevel}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Giá con giống: {def.buyPrice} 💰</p>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F2] rounded-2xl border border-[#E8E2D2] text-xs text-slate-600 mt-4">
                  <span className="font-bold">Sản phẩm:</span> {def.produceItemId === 'egg' ? 'Trứng gà' : def.produceItemId === 'milk' ? 'Sữa tươi' : def.produceItemId === 'wool' ? 'Lông cừu' : 'Mật ong'} (chu kỳ {def.produceDays} ngày)
                </div>
              </div>
            );
          }

          return (
            <div
              key={def.id}
              className={`bg-white rounded-3xl border p-5 sm:p-6 flex flex-col justify-between min-h-[280px] shadow-xs transition-all ${
                readyCount > 0 ? 'border-amber-400 ring-4 ring-amber-400/20' : 'border-[#E8E2D2]'
              }`}
            >
              {/* Pen Title & Capacity */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EFE9]">
                <div className="flex items-center gap-3">
                  <span className="text-3xl filter drop-shadow-xs">{def.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 font-display leading-tight">{def.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Đang nuôi: {pen.animals.length}/{pen.capacity} con · Sức chứa tối đa
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {pen.animals.length < pen.capacity && (
                    <button
                      onClick={() => onBuyAnimal(def.id)}
                      disabled={money < def.buyPrice}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer ${
                        money >= def.buyPrice
                          ? 'bg-[#2E4A35] text-white hover:bg-[#233a29]'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Plus size={12} />
                      <span>Mua ({def.buyPrice}💰)</span>
                    </button>
                  )}

                  <button
                    onClick={() => onUpgradeCapacity(def.id)}
                    disabled={money < upgradeCost}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    title={`Nâng cấp chuồng +2 chỗ (${upgradeCost}💰)`}
                  >
                    +2 Chỗ
                  </button>
                </div>
              </div>

              {/* Water trough & Cleanliness meters */}
              <div className="grid grid-cols-2 gap-2 my-2.5 text-xs">
                {def.requiresWater && (
                  <div className="p-2.5 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2] flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1 font-medium">
                      <Droplets size={13} className="text-sky-600" />
                      Máng nước: <strong className="font-mono">{pen.waterTrough}%</strong>
                    </span>
                    {pen.waterTrough < 50 && (
                      <button
                        onClick={() => onFillWaterTrough(def.id)}
                        className="px-2 py-0.5 rounded-lg bg-sky-600 text-white font-bold text-[10px] cursor-pointer"
                      >
                        Bơm
                      </button>
                    )}
                  </div>
                )}

                <div className="p-2.5 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2] flex items-center justify-between col-span-1">
                  <span className="text-slate-600 flex items-center gap-1 font-medium">
                    <ShieldCheck size={13} className="text-emerald-700" />
                    Vệ sinh: <strong className="font-mono">{pen.cleanliness}%</strong>
                  </span>
                  {pen.cleanliness < 70 && (
                    <button
                      onClick={() => onCleanPen(def.id)}
                      className="px-2 py-0.5 rounded-lg bg-emerald-700 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Dọn
                    </button>
                  )}
                </div>
              </div>

              {/* Animals Grid with Cute Expressions */}
              <div className="my-2 bg-[#FBF9F5] rounded-2xl p-3 border border-[#EFECE1] min-h-[90px] flex items-center justify-around flex-wrap gap-2">
                {pen.animals.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Chuồng trống. Hãy mua con giống để bắt đầu nuôi!</span>
                ) : (
                  pen.animals.map((animal) => (
                    <div
                      key={animal.id}
                      className="flex flex-col items-center p-2 rounded-xl bg-white border border-[#E8E2D2] shadow-xs relative"
                    >
                      <span className="text-3xl filter drop-shadow-xs animate-bounce-slight">{def.icon}</span>
                      <span className="text-[10px] font-bold text-slate-800 mt-1">{animal.name}</span>

                      {/* Mood / Expression */}
                      <span className="text-xs mt-0.5">
                        {animal.isSick ? '🤒 Ốm' : animal.hunger < 20 ? '🥺 Đói' : animal.happiness > 70 ? '😊 Vui' : '😐 Bình thường'}
                      </span>

                      {/* Sick medicine cure action */}
                      {animal.isSick && (
                        <button
                          onClick={() => onCureAnimal(def.id, animal.id)}
                          className="mt-1 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold flex items-center gap-0.5 cursor-pointer animate-pulse"
                          title="Chữa bệnh bằng thuốc thú y"
                        >
                          <Pill size={9} /> Chữa ({vetMedCount})
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Actions: Feed and Harvest Produce */}
              <div className="pt-2 border-t border-[#F2EFE9] flex items-center justify-between gap-2">
                {readyCount > 0 ? (
                  <button
                    onClick={(e) => onCollectProduce(def.id, e)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer animate-pulse-gentle"
                  >
                    <span>{def.produceItemId === 'egg' ? '🥚' : def.produceItemId === 'milk' ? '🥛' : def.produceItemId === 'wool' ? '🧶' : '🍯'}</span>
                    <span>Thu hoạch sản vật ({readyCount} con đã xong)</span>
                    <Sparkles size={16} />
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-between text-xs">
                    {def.feedItemId ? (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span>Cần:</span>
                        <strong className="text-slate-900 font-bold">{requiredFeed} thức ăn</strong>
                        <span className={`text-[11px] font-mono font-bold ${feedInStock >= requiredFeed ? 'text-emerald-700' : 'text-rose-600'}`}>
                          (Có: {feedInStock})
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Tự hút mật hoa quanh tổ</span>
                    )}

                    {def.feedItemId && (
                      <button
                        onClick={() => onFeedPen(def.id)}
                        disabled={feedInStock < requiredFeed || pen.animals.length === 0}
                        className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                          feedInStock >= requiredFeed && pen.animals.length > 0
                            ? 'bg-[#2E4A35] hover:bg-[#233a29] text-white cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span>🌾</span>
                        <span>Cho ăn cả đàn</span>
                      </button>
                    )}
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
