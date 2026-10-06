import React from 'react';
import { InventoryItem, OrderItem, Season } from '../types/farmSystem';
import { ALL_ITEMS_CATALOG } from '../config/farmData';
import { TrendingDown, TrendingUp, Check, Clock, Sparkles } from 'lucide-react';
import { formatMoney } from '../utils/format';

interface Props {
  inventory: InventoryItem[];
  demandMultipliers: Record<string, number>;
  onDirectSell: (itemId: string, quantity: number, unitPrice: number, e: React.MouseEvent) => void;
}

export const MarketTab: React.FC<Props> = ({
  inventory,
  demandMultipliers,
  onDirectSell,
}) => {
  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D2] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-inner">
            🏪
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
              Chợ Làng
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Mỗi khu chợ có tính cách và sở thích riêng theo Seed thế giới. Theo dõi thị trường để chốt lời cao nhất!
            </p>
          </div>
        </div>
      </div>



      {/* Bảng Giá Cung - Cầu Thị Trường & Bán Trực Tiếp */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D2] shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-display">
              Bảng Giá Thị Trường & Bán Nhanh Tại Chợ Làng
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Giá bán phụ thuộc vào quy luật cung cầu. Bán quá nhiều cùng một mặt hàng sẽ làm giảm giá!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(ALL_ITEMS_CATALOG).map(([itemId, meta]) => {
            const demand = demandMultipliers[itemId] ?? 1.0;
            const currentPrice = Math.max(1, Math.round(meta.basePrice * demand));
            const inStock = inventory.find((i) => i.itemId === itemId)?.quantity || 0;
            const isHighDemand = demand >= 0.95;
            const isLowDemand = demand < 0.75;

            return (
              <div
                key={itemId}
                className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2] flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl filter drop-shadow-xs">{meta.icon}</span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 font-display">{meta.name}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono mt-0.5">
                      <span className="font-extrabold text-emerald-800">💰 {formatMoney(currentPrice)}</span>
                      {isHighDemand ? (
                        <span className="text-emerald-700 font-bold flex items-center text-[11px]">
                          <TrendingUp size={11} /> Cầu cao
                        </span>
                      ) : isLowDemand ? (
                        <span className="text-rose-600 font-bold flex items-center text-[11px]">
                          <TrendingDown size={11} /> Bão hòa
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Ổn định</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sell buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => onDirectSell(itemId, 1, currentPrice, e)}
                    disabled={inStock < 1}
                    className="px-2.5 py-1.5 min-h-[40px] rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:active:scale-100"
                    title={`Bán 1 cái lấy 💰 ${formatMoney(currentPrice)} (Có: ${inStock})`}
                  >
                    Bán 1 ({inStock})
                  </button>

                  {inStock > 1 && (
                    <button
                      onClick={(e) => onDirectSell(itemId, inStock, currentPrice, e)}
                      className="px-2 py-1.5 min-h-[40px] rounded-xl bg-[#2E4A35] hover:bg-[#233a29] text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
                      title={`Bán tất cả ${inStock} cái lấy 💰 ${formatMoney(inStock * currentPrice)}`}
                    >
                      Bán hết
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
