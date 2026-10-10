import React, { useState } from 'react';
import { CROPS_CONFIG, ANIMALS_CONFIG, ALL_ITEMS_CATALOG } from '../config/farmData';
import { ShoppingCart, Sparkles, Tag, Plus, Check } from 'lucide-react';
import { sound } from '../utils/sound';
import { formatMoney } from '../utils/format';
import { SpriteIcon } from './SpriteIcon';
import { CROP_SPRITES, ANIMAL_SPRITES } from '../utils/sprites';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';
import { RichText } from './RichText';

interface Props {
  money: number;
  playerLevel: number;
  emptyPlotsCount: number;
  hasAutoIrrigation: boolean;
  autoWorkersCount: number;
  onBuyItem: (itemId: string, quantity: number, unitCost: number) => void;
  onBuySeedsForEmptyPlots: (cropId: string, count: number, unitCost: number) => void;
  onBuyAutoIrrigation: () => void;
  onHireAutoWorker: () => void;
  onBuyAnimal: (animalType: string) => void;
  autoIrrigationCost: number;
  autoWorkerCost: number;
}

export const ShopTab: React.FC<Props> = ({
  money,
  playerLevel,
  emptyPlotsCount,
  hasAutoIrrigation,
  autoWorkersCount,
  onBuyItem,
  onBuySeedsForEmptyPlots,
  onBuyAutoIrrigation,
  onHireAutoWorker,
  onBuyAnimal,
  autoIrrigationCost,
  autoWorkerCost,
}) => {
  const [shopCategory, setShopCategory] = useState<'seeds' | 'supplies' | 'automation' | 'animals'>('seeds');

  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      
      {/* Header Banner — xếp dọc trên mobile để chip tiền không bị ép */}
      <div className="px-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-amber-50 border flex items-center justify-center text-3xl shrink-0 border-[3px] border-[#3a2b3f]">
            <GameIcon e="🏪" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
              Cửa Hàng Vật Tư & Giống Nông Nghiệp
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Cung cấp đầy đủ hạt giống tuyển chọn, phân bón hữu cơ, thuốc BVTV sinh học và công nghệ tưới tiêu
            </p>
          </div>
        </div>

        {/* Ví tiền */}
        <div className="bg-[#FFF9E6] border border-[#F5E6B3] px-3.5 py-1.5 rounded-2xl flex items-center gap-2 self-start sm:self-auto">
          <span className="text-lg"><CoinIcon /></span>
          <span className="font-mono font-extrabold text-amber-950">{formatMoney(money)}</span>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 px-panel rounded-md overflow-x-auto no-scrollbar min-w-0">
        {[
          { id: 'seeds', label: '🌱 Hạt Giống' },
          { id: 'animals', label: '🐄 Con Giống' },
          { id: 'supplies', label: '🧪 Phân & Thuốc' },
          { id: 'automation', label: '⚙ Tự Động Hóa' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setShopCategory(tab.id as typeof shopCategory);
              sound.playClick();
            }}
            className={`shrink-0 sm:flex-1 py-2.5 px-3 sm:px-3 rounded-md text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 border-2 ${
              shopCategory === tab.id
                ? 'bg-[#2E4A35] text-white border-[#3a2b3f] shadow-[0_2px_0_rgba(0,0,0,0.3)]'
                : 'bg-transparent text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <RichText text={tab.label} />
          </button>
        ))}
      </div>

      {/* 1. SEEDS CATEGORY */}
      {shopCategory === 'seeds' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(CROPS_CONFIG).map((crop) => {
            const isLocked = false;
            const canAffordSingle = money >= crop.seedPrice;
            const bulkCount = Math.max(1, emptyPlotsCount);
            const bulkCost = crop.seedPrice * bulkCount;
            const canAffordBulk = money >= bulkCost;

            return (
              <div
                key={crop.id}
                className={`px-panel p-4 sm:p-5 flex flex-col justify-between transition-all ${
                  isLocked ? 'opacity-60' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1 filter drop-shadow-xs">
                        {CROP_SPRITES[crop.id]
                          ? <SpriteIcon src={CROP_SPRITES[crop.id].seed} alt={`Giống ${crop.name}`} size={34} />
                          : <><span className="text-2xl"><GameIcon e="🌱" /></span><span className="text-2xl"><GameIcon e={crop.icon} /></span></>}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 font-display">Giống {crop.name}</h4>
                        <span className="text-[11px] font-mono text-emerald-800 font-bold">
                          <CoinIcon /> {formatMoney(crop.seedPrice)} / túi
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono"><GameIcon e="⏱️" /> {crop.growDays} ngày</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed my-2">{crop.description}</p>
                </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onBuyItem(`${crop.id}_seed`, 1, crop.seedPrice)}
                      disabled={!canAffordSingle}
                      className={`flex-1 min-h-[40px] py-2 px-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-xs cursor-pointer ${
                        canAffordSingle
                          ? 'bg-[#2E4A35] text-white hover:bg-[#233a29]'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Mua 1 túi
                    </button>

                    {emptyPlotsCount > 1 && (
                      <button
                        onClick={() => onBuySeedsForEmptyPlots(`${crop.id}_seed`, bulkCount, crop.seedPrice)}
                        disabled={!canAffordBulk}
                        className={`flex-1 min-h-[40px] py-2 px-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-xs cursor-pointer ${
                          canAffordBulk
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                        title={`Mua đủ hạt cho ${emptyPlotsCount} ô đất trống (${formatMoney(bulkCost)})`}
                      >
                        Đủ {bulkCount} ô (<CoinIcon /> {formatMoney(bulkCost)})
                      </button>
                    )}
                  </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. SUPPLIES CATEGORY */}
      {shopCategory === 'supplies' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              id: 'fertilizer',
              name: 'Phân Bón Hữu Cơ Sinh Học',
              icon: '🧪',
              price: 8,
              desc: 'Tăng 25% độ phì cho đất, giúp hoa màu tăng thêm +1 sản lượng thu hoạch.',
            },
            {
              id: 'pesticide',
              name: 'Thuốc Trừ Sâu Thảo Mộc',
              icon: '🧴',
              price: 12,
              desc: 'Diệt sạch sâu bệnh hại lá ngay lập tức, bảo toàn 100% sản lượng.',
            },
            {
              id: 'vet_medicine',
              name: 'Thuốc Thú Y Cozy Care',
              icon: '💊',
              price: 25,
              desc: 'Chữa lành bệnh ốm cho vật nuôi, phục hồi sức khỏe và tâm trạng vui vẻ.',
            },
          ].map((sup) => {
            const canAfford = money >= sup.price;

            return (
              <div
                key={sup.id}
                className="px-panel p-5 flex flex-col justify-between hover:border-[#2E4A35] transition-all"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl"><GameIcon e={sup.icon} /></span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 font-display">{sup.name}</h4>
                      <span className="text-xs font-mono text-emerald-800 font-bold"><CoinIcon /> {formatMoney(sup.price)} / lọ</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed my-2">{sup.desc}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onBuyItem(sup.id, 1, sup.price)}
                    disabled={!canAfford}
                    className={`flex-1 min-h-[40px] py-2 px-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-xs cursor-pointer ${
                      canAfford
                        ? 'bg-[#2E4A35] text-white hover:bg-[#233a29]'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Mua 1 lọ
                  </button>

                  <button
                    onClick={() => onBuyItem(sup.id, 5, sup.price * 5)}
                    disabled={money < sup.price * 5}
                    className={`flex-1 min-h-[40px] py-2 px-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-xs cursor-pointer ${
                      money >= sup.price * 5
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Mua 5 lọ (<CoinIcon /> {formatMoney(sup.price * 5)})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. AUTOMATION & UPGRADES */}
      {shopCategory === 'automation' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hệ thống tưới tự động */}
          <div className="px-panel p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-3xl shadow-inner">
                  <GameIcon e="💧" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 font-display">Hệ Thống Tưới Tự Động Toàn Cánh Đồng</h3>
                  <span className="text-xs text-sky-800 font-bold font-mono">Chi phí: <CoinIcon /> {formatMoney(autoIrrigationCost)}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed my-2">
                Lắp đặt vòi phun sương tự động ngầm. Đất luôn duy trì tối thiểu 75% độ ẩm, không bao giờ lo cây bị khô héo kể cả trong đợt nắng hạn!
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              {hasAutoIrrigation ? (
                <div className="py-2.5 px-4 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5">
                  <Check size={16} className="stroke-[3]" />
                  <span>Đã lắp đặt & đang vận hành</span>
                </div>
              ) : (
                <button
                  onClick={onBuyAutoIrrigation}
                  disabled={money < autoIrrigationCost}
                  className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer ${
                    money >= autoIrrigationCost
                      ? 'bg-sky-700 hover:bg-sky-600 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Đầu Tư Lắp Đặt (<CoinIcon /> {formatMoney(autoIrrigationCost)})</span>
                </button>
              )}
            </div>
          </div>

          {/* Thuê nhân công tự động */}
          <div className="px-panel p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl shadow-inner">
                  <GameIcon e="👷" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 font-display">Thuê Nhân Công Chăm Sóc Nông Trại</h3>
                  <span className="text-xs text-emerald-800 font-bold font-mono">Chi phí: <CoinIcon /> {formatMoney(autoWorkerCost)}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed my-2">
                Thuê thêm bác thợ phụ chăm chỉ. Tự động thu hoạch hoa màu khi chín và bơm nước máng gia súc đều đặn mỗi ngày!
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={onHireAutoWorker}
                disabled={money < autoWorkerCost}
                className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer ${
                  money >= autoWorkerCost
                    ? 'bg-[#2E4A35] hover:bg-[#233a29] text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Thuê Thêm Nhân Công (Đang có: {autoWorkersCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ANIMALS CATEGORY */}
      {shopCategory === 'animals' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(ANIMALS_CONFIG).map((def) => {
            const isLocked = false;
            const canAfford = money >= def.buyPrice;

            return (
              <div
                key={def.id}
                className={`bg-white rounded-3xl border p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all ${
                  isLocked ? 'border-slate-200 opacity-60' : 'border-[#E8E2D2] hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      {ANIMAL_SPRITES[def.id]
                        ? <SpriteIcon src={ANIMAL_SPRITES[def.id]} alt={def.name} size={44} className="filter drop-shadow-xs" />
                        : <span className="text-3xl filter drop-shadow-xs"><GameIcon e={def.icon} /></span>}
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 font-display">{def.name}</h4>
                        <span className="text-[11px] font-mono text-amber-800 font-bold">
                          <CoinIcon /> {formatMoney(def.buyPrice)} / con
                        </span>
                      </div>
                    </div>

                      <span className="text-[11px] text-slate-500 font-mono"><GameIcon e="⏱️" /> {def.produceDays} ngày thu</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onBuyAnimal(def.id)}
                    disabled={!canAfford}
                    className={`flex-1 min-h-[40px] py-2 px-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-xs cursor-pointer ${
                      canAfford
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Mua con giống
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
