import React, { useState } from 'react';
import { InventoryItem } from '../types/farmSystem';
import { ALL_ITEMS_CATALOG } from '../config/farmData';
import { ArrowUpCircle, Snowflake, AlertCircle, Sparkles, Clock, Check } from 'lucide-react';
import { sound } from '../utils/sound';
import { formatMoney } from '../utils/format';

interface Props {
  inventory: InventoryItem[];
  barnCapacity: number;
  hasColdStorage: boolean;
  money: number;
  onUpgradeCapacity: () => void;
  onBuildColdStorage: () => void;
  upgradeCost: number;
  coldStorageCost: number;
}

export const BarnTab: React.FC<Props> = ({
  inventory,
  barnCapacity,
  hasColdStorage,
  money,
  onUpgradeCapacity,
  onBuildColdStorage,
  upgradeCost,
  coldStorageCost,
}) => {
  const [filter, setFilter] = useState<'all' | 'crop' | 'animal_product' | 'processed' | 'supply' | 'seed'>('all');

  const totalItemsCount = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const percentUsed = Math.min(100, Math.floor((totalItemsCount / barnCapacity) * 100));

  const filteredItems = inventory.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      
      {/* Header & Capacity Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E2D2] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-inner">
              🏡
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
                Nhà Kho
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Sức chứa hiện tại: <strong className="text-slate-900 font-mono font-bold">{totalItemsCount} / {barnCapacity} kg</strong>
                {hasColdStorage ? (
                  <span className="ml-2 text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md font-bold inline-flex items-center gap-0.5">
                    <Snowflake size={11} /> Kho lạnh đang bật
                  </span>
                ) : (
                  <span className="ml-2 text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md font-bold">
                    Kho thường (Hàng tươi có hạn dùng)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-80 h-3 bg-slate-100 rounded-full overflow-hidden mt-3 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                percentUsed > 85 ? 'bg-rose-500' : percentUsed > 60 ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>

        {/* Upgrade Buttons */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <button
            onClick={onUpgradeCapacity}
            disabled={money < upgradeCost}
            className={`flex-1 sm:flex-none py-2.5 px-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 ${
              money >= upgradeCost
                ? 'bg-[#2E4A35] text-white hover:bg-[#233a29] cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ArrowUpCircle size={15} />
            <span>Mở rộng kho +25 ô (💰 {formatMoney(upgradeCost)})</span>
          </button>

          {!hasColdStorage && (
            <button
              onClick={onBuildColdStorage}
              disabled={money < coldStorageCost}
              className={`flex-1 sm:flex-none py-2.5 px-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                money >= coldStorageCost
                  ? 'bg-sky-700 text-white hover:bg-sky-600 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Snowflake size={15} />
              <span>Xây Kho Lạnh (💰 {formatMoney(coldStorageCost)})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs — lưới 3 cột trên mobile (không phải vuốt ngang), hàng ngang trên sm+ */}
      <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 p-1 bg-[#FAF8F2] rounded-2xl border border-[#E8E2D2]">
        {[
          { id: 'all', label: 'Tất cả đồ' },
          { id: 'seed', label: '🌱 Hạt giống' },
          { id: 'crop', label: '🌾 Hoa màu tươi' },
          { id: 'animal_product', label: '🥚 Sản phẩm vật nuôi' },
          { id: 'processed', label: '🥖 Thành phẩm chế biến' },
          { id: 'supply', label: '🧪 Phân thuốc & Vật tư' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setFilter(tab.id as typeof filter);
              sound.playClick();
            }}
            className={`min-h-[40px] py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all sm:whitespace-nowrap cursor-pointer flex items-center justify-center text-center leading-tight ${
              filter === tab.id
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inventory Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-[#E8E2D2] p-12 flex flex-col items-center justify-center text-center">
          <span className="text-5xl mb-2 opacity-50">🌾</span>
          <p className="font-extrabold text-slate-900 text-base font-display">Không có mặt hàng trong mục này</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Thu hoạch nông sản trên đồng ruộng hoặc thu gom sản vật từ chuồng trại để cất trữ trong kho!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((item) => {
            const meta = ALL_ITEMS_CATALOG[item.itemId];
            const isFresh = item.isPerishable && !hasColdStorage;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-[#E8E2D2] p-4 flex items-center justify-between gap-3 shadow-xs hover:border-[#2E4A35] transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2] flex items-center justify-center text-3xl shadow-inner shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight font-display">{item.name}</h4>
                    <p className="text-xs text-slate-600 font-mono font-semibold mt-0.5">
                      Số lượng: <strong className="text-slate-900 font-bold">{item.quantity}</strong> cái
                    </p>

                    {/* Expiration shelf life */}
                    {isFresh ? (
                      <span className={`text-[11px] font-mono font-bold flex items-center gap-1 mt-0.5 ${
                        item.daysRemaining <= 2 ? 'text-rose-600 animate-pulse' : 'text-amber-800'
                      }`}>
                        <Clock size={11} /> Hạn dùng: còn {item.daysRemaining} ngày
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1 mt-0.5">
                        <Check size={11} /> Bảo quản lâu dài
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-xs font-extrabold text-emerald-800 font-mono">
                    ~💰 {formatMoney(meta?.basePrice || 10)}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Giá gốc/cái</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
