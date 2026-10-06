import React, { useState } from 'react';
import { ITEM_CATALOG } from '../constants/gameData';
import { ArrowUpCircle, ShoppingCart } from 'lucide-react';
import { formatMoney } from '../utils/format';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';
import { RichText } from './RichText';

interface Props {
  inventory: Record<string, number>;
  barnCapacity: number;
  playerCoins: number;
  onSellItem: (itemId: string, count: number, e: React.MouseEvent) => void;
  onUpgradeBarn: () => void;
  upgradeCost: number;
}

export const BarnSection: React.FC<Props> = ({
  inventory,
  barnCapacity,
  playerCoins,
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
    <div className="flex flex-col gap-4 pb-6">
      {/* Barn Capacity & Upgrade Card */}
      <div className="bg-[#21432c]/90 p-4 rounded-2xl border border-emerald-700/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl"><GameIcon e="🏡" /></span>
            <div>
              <h2 className="font-bold text-white text-base leading-tight">Kho Thóc & Chợ Nông Sản</h2>
              <p className="text-emerald-300 text-xs">
                Sức chứa hiện tại: <strong className="text-amber-300 font-mono">{totalCount} / {barnCapacity}</strong> ô
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full sm:w-64 h-2.5 bg-emerald-950 rounded-full overflow-hidden mt-2 p-0.5 border border-emerald-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                percentUsed > 85 ? 'bg-rose-500' : percentUsed > 60 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>

        {/* Upgrade Barn Button */}
        <button
          onClick={onUpgradeBarn}
          disabled={playerCoins < upgradeCost}
          className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md ${
            playerCoins >= upgradeCost
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
          }`}
        >
          <ArrowUpCircle size={15} />
          <span>Nâng cấp kho +20 ô (<CoinIcon /> {formatMoney(upgradeCost)})</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#182f20] rounded-xl border border-emerald-800/60">
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'crop', label: '🌾 Hoa màu' },
          { id: 'animal', label: '🥚 Vật nuôi' },
          { id: 'product', label: '🥖 Thành phẩm' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <RichText text={tab.label} />
          </button>
        ))}
      </div>

      {/* Inventory Item Grid */}
      {items.length === 0 ? (
        <div className="bg-[#1a3323]/80 rounded-2xl border border-dashed border-emerald-800/80 p-8 flex flex-col items-center justify-center text-center">
          <span className="text-4xl mb-2 opacity-60"><GameIcon e="🌾" /></span>
          <p className="font-bold text-slate-300 text-sm">Kho nông sản trống</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Hãy thu hoạch rau củ trên đồng hoặc lấy sản phẩm từ chuồng trại!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {items.map((item) => (
            <div
              key={item.itemId}
              className="bg-[#1f3f29]/90 rounded-2xl border border-emerald-800/70 p-3 flex items-center justify-between gap-3 shadow-md hover:border-emerald-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-2xl shadow-inner">
                  <GameIcon e={item.icon} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm leading-tight">{item.nameVi}</h4>
                  <p className="text-[11px] text-emerald-300/90 font-mono">
                    Số lượng: <strong className="text-white text-xs">{item.count}</strong> cái
                  </p>
                  <p className="text-[11px] text-amber-300 font-mono mt-0.5">Giá bán: <CoinIcon /> {formatMoney(item.sellPrice)} / cái</p>
                </div>
              </div>

              {/* Instant Sell Actions */}
              <div className="flex flex-col gap-1 items-end shrink-0">
                <button
                  onClick={(e) => onSellItem(item.itemId, 1, e)}
                  className="px-2.5 py-1 min-h-[40px] rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-semibold text-xs border border-emerald-600/40 cursor-pointer shadow-sm"
                  title={`Bán 1 cái lấy ${formatMoney(item.sellPrice)}`}
                >
                  Bán 1 (+<CoinIcon /> {formatMoney(item.sellPrice)})
                </button>

                {item.count > 1 && (
                  <button
                    onClick={(e) => onSellItem(item.itemId, item.count, e)}
                    className="px-2 py-0.5 min-h-[40px] rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] border border-amber-400/30 cursor-pointer"
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
