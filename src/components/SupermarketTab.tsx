import React from 'react';
import { InventoryItem, OrderItem } from '../types/farmSystem';
import { Check, Clock, Sparkles } from 'lucide-react';
import { formatMoney } from '../utils/format';
import { SpriteIcon } from './SpriteIcon';
import { CUSTOMER_SPRITES } from '../utils/sprites';
import { ITEM_SPRITES } from '../utils/sprites';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';

interface Props {
  inventory: InventoryItem[];
  orders: OrderItem[];
  currentDay: number;
  onFulfillOrder: (orderId: string, e: React.MouseEvent) => void;
}

export const SupermarketTab: React.FC<Props> = ({
  inventory,
  orders,
  currentDay,
  onFulfillOrder,
}) => {
  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      
      {/* Header */}
      <div className="px-panel p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-amber-50 border flex items-center justify-center text-3xl border-[3px] border-[#3a2b3f]">
            <GameIcon e="🛒" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
              Siêu Thị & Đơn Hàng Thương Lái
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Cung cấp nông sản số lượng lớn cho siêu thị với giá ổn định và nhiều ưu đãi.
            </p>
          </div>
        </div>
      </div>

      {/* Bảng Đơn Hàng (Order Board) */}
      <div className="px-panel p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xl"><GameIcon e="📋" /></span>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-display">
              Gian Hàng Siêu Thị (Thưởng Thêm +30% Tiền)
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">{orders.length} gian hàng đang mở</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm font-medium">Hiện tại không có đơn hàng nào từ siêu thị.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {orders.map((order) => {
              const daysLeft = Math.max(0, order.deadlineDay - currentDay);
              const isExpired = daysLeft === 0;
              // Tính tồn kho 1 lần duy nhất để đảm bảo nhất quán giữa hiển thị và logic
              const reqStatus = order.requirements.map((req) => {
                const inStock = inventory.find((i) => i.itemId === req.itemId)?.quantity || 0;
                return { req, inStock, hasEnough: inStock >= req.amount };
              });
              const canFulfill = !isExpired && reqStatus.every((s) => s.hasEnough);

              return (
                <div
                  key={order.id}
                  className={`px-panel p-4 flex flex-col justify-between transition-all ${
                    canFulfill
                      ? 'border-amber-400'
                      : 'opacity-95'
                  }`}
                >
                  {/* Mái gian hàng */}
                  <div className="flex items-center gap-2.5 pb-3 border-b-2 border-dashed border-[#E8E2D2] mb-3">
                    <div className="px-panel-inset p-1.5 shrink-0">
                      {CUSTOMER_SPRITES[order.customerAvatar] ? <SpriteIcon src={CUSTOMER_SPRITES[order.customerAvatar]} alt="" size={36} /> : <span className="text-2xl">{order.customerAvatar}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{order.customerName}</h4>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock size={10} /> Còn {daysLeft} ngày
                      </span>
                    </div>
                    <span className="text-xs font-mono font-black text-amber-800 bg-amber-100 px-2 py-1 rounded-md border-2 border-[#3a2b3f] shrink-0">
                      +<CoinIcon /> {formatMoney(order.rewardMoney)}
                    </span>
                  </div>

                    {/* Requirements List */}
                    <div className="flex flex-wrap gap-1.5 my-2">
                      {reqStatus.map(({ req, inStock, hasEnough }) => {
                        return (
                          <div
                            key={req.itemId}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono border-2 ${
                              hasEnough
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-600 font-bold'
                                : 'bg-rose-50 text-rose-700 border-rose-400'
                            }`}
                          >
                            {ITEM_SPRITES[req.itemId]
                              ? <SpriteIcon src={ITEM_SPRITES[req.itemId]} alt={req.name} size={18} />
                              : <span><GameIcon e={req.icon} /></span>}
                            <span>{req.name}:</span>
                            <span>
                              {inStock}/{req.amount}
                            </span>
                            {hasEnough && <Check size={12} className="stroke-[3] text-emerald-600" />}
                          </div>
                        );
                      })}
                    </div>

                  <div className="pt-3 border-t-2 border-dashed border-[#E8E2D2] mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 flex-1">
                      {canFulfill ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Sparkles size={13} /> Đủ hàng!
                        </span>
                      ) : isExpired ? (
                        'Đã hết hạn'
                      ) : (
                        `Thiếu: ${reqStatus.filter(s => !s.hasEnough).map(s => `${s.req.name} (${s.inStock}/${s.req.amount})`).join(', ') || '?'}` 
                      )}
                    </span>

                    <button
                      onClick={(e) => onFulfillOrder(order.id, e)}
                      disabled={!canFulfill}
                      className={`py-2 px-4 font-bold text-xs flex items-center gap-1.5 transition-all ${
                        canFulfill
                          ? 'px-btn px-btn-amber animate-pulse-gentle'
                          : 'px-btn px-btn-slate opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <Check size={14} />
                      <span>Giao Đơn</span>
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
