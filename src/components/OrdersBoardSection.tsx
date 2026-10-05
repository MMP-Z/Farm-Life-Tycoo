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
}

export const OrdersBoardSection: React.FC<Props> = ({
  orders,
  truck,
  inventory,
  onSendDelivery,
  onClaimTruckReward,
  onRefreshOrder,
}) => {
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
    <div className="flex flex-col gap-4">
      {/* Truck Stage Banner */}
      <div className="bg-gradient-to-r from-[#234230] via-[#1a3426] to-[#14281d] text-white rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">🚚</span>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg leading-tight">
                Chuyến Xe Tải Giao Hàng Tốc Hành
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                {truck.status === 'idle'
                  ? 'Xe tải đang đỗ tại sân, sẵn sàng nhận nông sản chở đến thị trấn!'
                  : isTruckFinished
                  ? 'Xe tải đã quay về chở theo rương tiền vàng và kinh nghiệm!'
                  : 'Xe tải đang bon bon trên đường giao hàng cho thị trấn...'}
              </p>
            </div>
          </div>
        </div>

        {/* Animated Road Visual */}
        <div className="bg-black/30 rounded-2xl p-4 border border-white/10 relative overflow-hidden">
          {/* Road line */}
          <div className="w-full h-1.5 bg-amber-400/30 rounded-full my-3 flex justify-between items-center px-3">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="w-3 h-1 bg-amber-300/80 rounded-full" />
            ))}
          </div>

          <div className="flex justify-between text-xs text-slate-300 font-bold px-1">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span>🏡</span> Nông Trại Của Bạn
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <span>🏙️</span> Thị Trấn Thung Lũng Xanh
            </span>
          </div>

          {/* Truck Position Animation */}
          {truck.status !== 'idle' && (
            <div
              className="absolute top-2 transition-all duration-300"
              style={{
                left: isTruckFinished ? '8%' : `${Math.min(85, Math.max(8, truckProgress))}%`,
                transform: truckProgress > 50 && !isTruckFinished ? 'scaleX(-1)' : 'scaleX(1)',
              }}
            >
              <div className="flex flex-col items-center animate-bounce-slight">
                <span className="text-3xl filter drop-shadow">🚚</span>
                {!isTruckFinished && (
                  <span className="bg-slate-900/90 text-amber-300 text-[10px] px-2 py-0.5 rounded-md font-mono border border-slate-700 shadow-md">
                    {truckRemaining}s
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Truck Actions */}
        {truck.status !== 'idle' && (
          <div className="mt-3.5">
            {isTruckFinished ? (
              <button
                onClick={onClaimTruckReward}
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-98 cursor-pointer animate-pulse-gentle"
              >
                <Gift size={18} />
                <span>
                  Mở Rương Phần Thưởng (+{truck.pendingReward?.coins} 🪙 · +{truck.pendingReward?.exp} EXP
                  {truck.pendingReward?.gems ? ` · +${truck.pendingReward.gems}💎` : ''})
                </span>
                <Sparkles size={16} />
              </button>
            ) : (
              <div className="flex items-center justify-between text-xs text-emerald-200">
                <span>Xe đang lăn bánh giao hàng...</span>
                <span className="font-mono font-bold text-amber-300 tabular-nums">
                  Còn lại: {truckRemaining} giây ({truckProgress}%)
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Orders Board */}
      <div className="bg-white rounded-3xl p-5 border border-[#EAE6DA] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-inner">
            📋
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
              Bảng Đơn Hàng Của Cư Dân Thị Trấn
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Cung cấp đủ nông sản tươi ngon để nhận nhiều vàng và kinh nghiệm thăng cấp
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {orders.map((order) => {
          const allRequirementsMet = order.requirements.every(
            (req) => (inventory[req.itemId] || 0) >= req.count
          );
          const isTruckAvailable = truck.status === 'idle';

          return (
            <div
              key={order.id}
              className={`rounded-3xl border p-5 flex flex-col justify-between min-h-[220px] transition-all shadow-sm ${
                allRequirementsMet && isTruckAvailable
                  ? 'bg-white border-amber-400 ring-4 ring-amber-400/20 shadow-md'
                  : 'bg-white border-[#EAE6DA]'
              }`}
            >
              {/* Customer Info */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EFE9]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shadow-inner">
                    {order.avatarEmoji}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 leading-tight">{order.customerName}</h4>
                    <p className="text-xs text-slate-500 font-medium">{order.customerRoleVi}</p>
                  </div>
                </div>

                <button
                  onClick={() => onRefreshOrder(order.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Đổi đơn hàng khác"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* Requirements */}
              <div className="my-3.5 flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cần cung cấp:</span>
                <div className="flex flex-wrap gap-2">
                  {order.requirements.map((req) => {
                    const have = inventory[req.itemId] || 0;
                    const hasEnough = have >= req.count;

                    return (
                      <div
                        key={req.itemId}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                          hasEnough
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <span className="text-base">{req.icon}</span>
                        <span>{req.nameVi}</span>
                        <span className="font-mono font-bold">
                          {have}/{req.count}
                        </span>
                        {hasEnough && <Check size={13} className="text-emerald-700 stroke-[3]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rewards and Delivery button */}
              <div className="pt-3 border-t border-[#F2EFE9] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs font-mono font-extrabold">
                  <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
                    🪙 +{order.rewardCoins}
                  </span>
                  <span className="text-sky-700 bg-sky-50 border border-sky-200 px-2 py-1 rounded-lg">
                    ✨ +{order.rewardExp}
                  </span>
                  {order.rewardGems && (
                    <span className="text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 px-2 py-1 rounded-lg">
                      💎 +{order.rewardGems}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onSendDelivery(order.id)}
                  disabled={!allRequirementsMet || !isTruckAvailable}
                  className={`py-2.5 px-5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-xs ${
                    allRequirementsMet && isTruckAvailable
                      ? 'bg-[#234230] hover:bg-[#1a3325] text-white cursor-pointer shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Truck size={15} />
                  <span>{isTruckAvailable ? 'Giao Hàng Ngay' : 'Xe Đang Đi Giao'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
