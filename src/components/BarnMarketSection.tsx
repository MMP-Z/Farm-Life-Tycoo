import React, { useState } from 'react';
import { ITEM_CATALOG } from '../constants/gameData';
import { ArrowUpCircle } from 'lucide-react';
import { formatMoney } from '../utils/format';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';
import { RichText } from './RichText';

interface Props {
  inventory: Record<string, number>;
  barnCapacity: number;
  coins: number;
  onSellItem: (itemId: string, count: number, e: React.MouseEvent) => void;
  onUpgradeBarn: () => void;
  upgradeCost: number;
}

export const BarnMarketSection: React.FC<Props> = ({
  inventory,
  barnCapacity,
  coins,
  onSellItem,
  onUpgradeBarn,
  upgradeCost,
}) => {
  const [filter, setFilter] = useState<'all' | 'crop' | 'animal' | 'product'>('all');

  const totalCount = Object.values(inventory).reduce((acc, count) => acc + count, 0);
  const percentUsed = Math.min(100, Math.floor((totalCount / barnCapacity) * 100));

  const items = Object.entries(inventory)
    .filter(([_, count]) => count > 0)
    .map(([itemId, count]) => {
      const meta = ITEM_CATALOG[itemId] || {
        nameVi: itemId,
        icon: '📦',
        category: 'product',
        sellPrice: 10,
      };
      return { itemId, count, ...meta };
    })
    .filter((item) => filter === 'all' || item.category === filter);

  return (
    <div className="flex flex-col gap-4">
      {/* Sức chứa kho & Nâng cấp */}
      <div className="px-panel p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md bg-amber-50 border flex items-center justify-center text-3xl border-[3px] border-[#3a2b3f]">
              <GameIcon e="🏡" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                Kho Thóc & Chợ Nông Sản
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Sức chứa kho hiện tại: <strong className="text-slate-900 font-mono">{totalCount} / {barnCapacity} kg</strong>
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

        <button
          onClick={onUpgradeBarn}
          disabled={coins < upgradeCost}
          className={`py-3 px-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
            coins >= upgradeCost
              ? 'bg-[#234230] hover:bg-[#1a3325] text-white cursor-pointer active:scale-95 shadow-md'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <ArrowUpCircle size={16} />
          <span>Mở rộng kho +20 ô (<CoinIcon /> {formatMoney(upgradeCost)})</span>
        </button>
      </div>

      {/* Bộ lọc loại mặt hàng */}
      <div className="flex items-center gap-2 p-1.5 bg-[#FAF9F5] rounded-2xl border border-[#EAE6DA]">
        {[
          { id: 'all', label: 'Tất cả nông sản' },
          { id: 'crop', label: '🌾 Hoa màu tươi' },
          { id: 'animal', label: '🥚 Sản phẩm vật nuôi' },
          { id: 'product', label: '🥖 Hàng chế biến' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RichText text={tab.label} />
          </button>
        ))}
      </div>

      {/* Danh sách vật phẩm */}
      {items.length === 0 ? (
        <div className="px-panel border-dashed p-12 flex flex-col items-center justify-center text-center">
          <span className="text-5xl mb-2 opacity-50"><GameIcon e="🌾" /></span>
          <p className="font-extrabold text-slate-900 text-base">Kho nông sản trống</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Hãy thu hoạch rau củ trên đồng ruộng hoặc lấy trứng, sữa từ chuồng gia súc để tích trữ và buôn bán!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.itemId}
              className="px-panel p-4 flex items-center justify-between gap-3 hover:border-[#234230] transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-md bg-amber-50 border flex items-center justify-center text-2xl border-[3px] border-[#3a2b3f]">
                  <GameIcon e={item.icon} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{item.nameVi}</h4>
                  <p className="text-xs text-slate-600 font-mono font-semibold mt-0.5">
                    Có: <strong className="text-slate-900 text-sm">{item.count}</strong> cái
                  </p>
                  <p className="text-[11px] text-emerald-800 font-mono font-bold">
                    Giá bán: <CoinIcon /> {formatMoney(item.sellPrice)} / cái
                  </p>
                </div>
              </div>

              {/* Quick Sell Buttons */}
              <div className="flex flex-col gap-1.5 items-end shrink-0">
                <button
                  onClick={(e) => onSellItem(item.itemId, 1, e)}
                  className="px-3 py-1.5 min-h-[40px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-colors cursor-pointer"
                  title={`Bán 1 cái lấy ${formatMoney(item.sellPrice)}`}
                >
                  Bán 1 (+<CoinIcon /> {formatMoney(item.sellPrice)})
                </button>

                {item.count > 1 && (
                  <button
                    onClick={(e) => onSellItem(item.itemId, item.count, e)}
                    className="px-2.5 py-1 min-h-[40px] rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-[11px] border border-amber-300 transition-colors cursor-pointer"
                    title={`Bán tất cả ${item.count} cái lấy ${formatMoney(item.count * item.sellPrice)}`}
                  >
                    Bán hết (<CoinIcon /> {formatMoney(item.count * item.sellPrice)})
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
