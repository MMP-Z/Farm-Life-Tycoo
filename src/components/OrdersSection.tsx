import React from 'react';
import { CustomerOrder, DeliveryTruckState } from '../types/game';
import { Truck, Check, RefreshCw, Sparkles, Gift } from 'lucide-react';

interface Props {
  orders: CustomerOrder[];
  truck: DeliveryTruckState;
  inventory: Record<string, number>;
  onSendDelivery: (orderId: string) => void;
  onClaimTruckReward: () => void;
  onRefreshOrder: (orderId: string) => void;
  isRainbow: boolean;
}

export const OrdersSection: React.FC<Props> = ({
  orders,
  truck,
  inventory,
  onSendDelivery,
  onClaimTruckReward,
  onRefreshOrder,
  isRainbow,
}) => {
  // Truck progress calculation
  let truckProgress = 0;
  let truckRemaining = 0;
  let isTruckFinished = false;

  if (truck.departureTime && truck.duration) {
    const elapsed = (Date.now() - truck.departureTime) / 1000;
    truckProgress = Math.min(100, Math.floor((elapsed / truck.duration) * 100));
    truckRemaining = Math.max(0, Math.ceil(truck.duration - elapsed));
    if (elapsed >= truck.duration) {
      isTruckFinished = true;
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Delivery Truck Stage Banner */}
      <div className="bg-gradient-to-r from-[#2a4d35] via-[#1f3f2a] to-[#183121] rounded-2xl border-2 border-emerald-600/70 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🚚</span>
            <div>
              <h2 className="font-bold text-white text-sm sm:text-base leading-tight">Xe Tải Nông Sản Tốc Hành</h2>
              <p className="text-emerald-300 text-xs">
                {truck.status === 'idle'
                  ? 'Xe đang đỗ tại sân, sẵn sàng nhận hàng đi giao!'
                  : isTruckFinished
                  ? 'Xe đã quay về mang theo phần thưởng vàng!'
                  : 'Xe đang trên đường giao hàng đến thị trấn...'}
              </p>
            </div>
          </div>

          {isRainbow && (
            <div className="bg-amber-400/20 border border-amber-300/40 text-amber-200 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
              <span>🌈</span>
              <span>+50% Vàng</span>
            </div>
          )}
        </div>

        {/* Animated Road Visual */}
        <div className="bg-[#122216] rounded-xl p-3 border border-emerald-800/80 relative overflow-hidden">
          {/* Road Dashed Line */}
          <div className="w-full h-1 bg-amber-400/30 rounded-full my-3 flex justify-between items-center px-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="w-2.5 h-1 bg-amber-300/70 rounded-full" />
            ))}
          </div>

          {/* Landmarks: Farm -> Town */}
          <div className="flex justify-between text-xs text-slate-300 font-semibold px-1">
            <span className="flex items-center gap-1 text-emerald-300">
              <span>🏡</span> Nông Trại
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <span>🏙️</span> Thị Trấn Nắng Vàng
            </span>
          </div>

          {/* Truck Position Animation */}
          {truck.status !== 'idle' && (
            <div
              className="absolute top-2 transition-all duration-300"
              style={{
                left: isTruckFinished ? '10%' : `${Math.min(85, Math.max(8, truckProgress))}%`,
                transform: truckProgress > 50 && !isTruckFinished ? 'scaleX(-1)' : 'scaleX(1)',
              }}
            >
              <div className="flex flex-col items-center animate-bounce-slight">
                <span className="text-3xl filter drop-shadow">🚚</span>
                {!isTruckFinished && (
                  <span className="bg-slate-900/90 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-md font-mono border border-slate-700">
                    {truckRemaining}s
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Truck Actions */}
        {truck.status !== 'idle' && (
          <div className="mt-3 flex items-center justify-between">
            {isTruckFinished ? (
              <button
                onClick={onClaimTruckReward}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer animate-pulse-gentle"
              >
                <Gift size={18} />
                <span>
                  Mở Rương Phần Thưởng (+{truck.pendingReward?.coins} 🪙 · +{truck.pendingReward?.exp} EXP
                  {truck.pendingReward?.gems ? ` · +${truck.pendingReward.gems}💎` : ''})
                </span>
                <Sparkles size={16} />
              </button>
            ) : (
              <div className="w-full flex items-center justify-between text-xs text-emerald-300">
                <span>Xe đang lăn bánh giao hàng...</span>
                <span className="font-mono font-bold text-amber-300 tabular-nums">
                  Còn lại: {truckRemaining} giây ({truckProgress}%)
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Orders Board */}
      <div className="bg-[#21432c]/90 p-3 rounded-2xl border border-emerald-700/50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base leading-tight">Bảng Đơn Đặt Hàng Của Dân Làng</h3>
            <p className="text-emerald-300/80 text-[11px]">
              Giao đủ nông sản tươi ngon để nhận nhiều vàng và kinh nghiệm
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {orders.map((order) => {
          const allRequirementsMet = order.requirements.every(
            (req) => (inventory[req.itemId] || 0) >= req.count
          );
          const isTruckAvailable = truck.status === 'idle';

          return (
            <div
              key={order.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between min-h-[220px] shadow-lg transition-all ${
                allRequirementsMet && isTruckAvailable
                  ? 'bg-gradient-to-b from-[#2a5137] to-[#1d3d27] border-amber-400 ring-2 ring-amber-400/40'
                  : 'bg-gradient-to-b from-[#1e3b26] to-[#152a1b] border-emerald-800/70'
              }`}
            >
              {/* Customer Info Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-emerald-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner">
                    {order.avatarEmoji}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm leading-tight">{order.customerName}</h4>
                    <p className="text-[11px] text-amber-200/90">{order.customerRoleVi}</p>
                  </div>
                </div>

                {/* Refresh Order Button */}
                <button
                  onClick={() => onRefreshOrder(order.id)}
                  className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-800/40 transition-colors cursor-pointer"
                  title="Đổi đơn hàng khác"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* Requirements List */}
              <div className="my-3 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wide">Cần cung cấp:</span>
                <div className="flex flex-wrap gap-1.5">
                  {order.requirements.map((req) => {
                    const have = inventory[req.itemId] || 0;
                    const hasEnough = have >= req.count;

                    return (
                      <div
                        key={req.itemId}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-medium ${
                          hasEnough
                            ? 'bg-emerald-950/80 text-emerald-200 border-emerald-600/50'
                            : 'bg-rose-950/70 text-rose-200 border-rose-800/60'
                        }`}
                      >
                        <span className="text-base">{req.icon}</span>
                        <span>{req.nameVi}</span>
                        <span className="font-mono font-bold">
                          {have}/{req.count}
                        </span>
                        {hasEnough && <Check size={12} className="text-emerald-400 stroke-[3]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rewards & Send Button */}
              <div className="pt-2.5 border-t border-emerald-800/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                  <span className="text-amber-300 flex items-center gap-0.5">
                    🪙 {isRainbow ? Math.floor(order.rewardCoins * 1.5) : order.rewardCoins}
                  </span>
                  <span className="text-sky-300 flex items-center gap-0.5">✨ +{order.rewardExp}</span>
                  {order.rewardGems && (
                    <span className="text-fuchsia-300 flex items-center gap-0.5">💎 +{order.rewardGems}</span>
                  )}
                </div>

                <button
                  onClick={() => onSendDelivery(order.id)}
                  disabled={!allRequirementsMet || !isTruckAvailable}
                  className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-md ${
                    allRequirementsMet && isTruckAvailable
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 cursor-pointer shadow-amber-900/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                  }`}
                >
                  <Truck size={14} />
                  <span>{isTruckAvailable ? 'Giao hàng ngay' : 'Xe đang bận'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
