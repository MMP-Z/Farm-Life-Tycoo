import React, { useState } from 'react';
import { GameTab } from './NavigationTabs';
import { Trees, Beef, CookingPot, Store, ShoppingBag, ShoppingCart, Truck, Package, ShieldCheck, Lock, Coins } from 'lucide-react';
import { formatMoney } from '../utils/format';

interface Props {
  onSelectTab: (tab: GameTab) => void;
  unlockedRegions: string[];
  money: number;
  onUnlockRegion: (regionId: string, cost: number) => void;
  onNotify?: (msg: string) => void;
}

export const HubTab: React.FC<Props> = ({ onSelectTab, unlockedRegions, money, onUnlockRegion, onNotify }) => {
  // FIX (bug mở khóa Chợ Làng): thay window.confirm (native dialog) bằng modal
  // trong game — native dialog bị automation/test chặn (auto-dismiss) và khi bị
  // chặn trình duyệt thì nút bấm trông như "không phản hồi".
  const [pendingUnlock, setPendingUnlock] = useState<{ id: string; label: string; cost: number } | null>(null);
  // Hiệu ứng rung + toast khi bấm mở khóa mà không đủ tiền (trước đây im lặng tuyệt đối)
  const [shakeId, setShakeId] = useState<string | null>(null);
  const regions = [
    { id: 'field', label: 'Khu Trồng Trọt', icon: <Trees size={32} className="text-emerald-600" />, desc: 'Gieo hạt và thu hoạch', color: 'bg-emerald-100 border-emerald-300', cost: 0 },
    { id: 'shop', label: 'Cửa Hàng', icon: <Store size={32} className="text-teal-600" />, desc: 'Mua giống, vật tư', color: 'bg-teal-100 border-teal-300', cost: 0 },
    { id: 'barn', label: 'Nhà Kho', icon: <Package size={32} className="text-stone-600" />, desc: 'Quản lý vật phẩm', color: 'bg-stone-200 border-stone-400', cost: 0 },
    { id: 'market', label: 'Chợ Làng', icon: <ShoppingBag size={32} className="text-blue-600" />, desc: 'Bán nông sản kiếm lời', color: 'bg-blue-100 border-blue-300', cost: 50 },
    { id: 'pasture', label: 'Khu Chăn Nuôi', icon: <Beef size={32} className="text-amber-600" />, desc: 'Chăm sóc vật nuôi', color: 'bg-amber-100 border-amber-300', cost: 150 },
    // FIX (P1-1): Siêu Thị & Đơn Hàng Thương Lái từng là tính năng "ma" — code xong
    // (SupermarketTab, badge, handleFulfillOrder) nhưng không có đường vào UI.
    { id: 'supermarket', label: 'Siêu Thị', icon: <ShoppingCart size={32} className="text-rose-600" />, desc: 'Đơn hàng số lượng lớn', color: 'bg-rose-100 border-rose-300', cost: 200 },
    { id: 'workshop', label: 'Xưởng Chế Biến', icon: <CookingPot size={32} className="text-orange-600" />, desc: 'Làm bánh, mứt, bơ', color: 'bg-orange-100 border-orange-300', cost: 300 },
    { id: 'transport', label: 'Đội Vận Tải', icon: <Truck size={32} className="text-indigo-600" />, desc: 'Giao hàng đi muôn nơi', color: 'bg-indigo-100 border-indigo-300', cost: 500 },
    { id: 'admin', label: 'Trung Tâm Hành Chính', icon: <ShieldCheck size={32} className="text-slate-600" />, desc: 'Thuế, bảo hiểm', color: 'bg-slate-200 border-slate-400', cost: 1000 },
  ] as const;

  const handleRegionClick = (regionId: string, cost: number, isLocked: boolean) => {
    if (!isLocked) {
      onSelectTab(regionId as GameTab);
      return;
    }
    const label = regions.find((r) => r.id === regionId)?.label ?? regionId;
    if (money >= cost) {
      // Mở modal xác nhận trong game thay vì window.confirm
      setPendingUnlock({ id: regionId, label, cost });
    } else {
      // Phản hồi rõ ràng khi không đủ tiền
      onNotify?.(`Không đủ vàng! Cần ${formatMoney(cost)} 💰 để mở khóa ${label} (đang có ${formatMoney(money)} 💰).`);
      setShakeId(regionId);
      window.setTimeout(() => setShakeId((cur) => (cur === regionId ? null : cur)), 500);
    }
  };

  const confirmUnlock = () => {
    if (!pendingUnlock) return;
    onUnlockRegion(pendingUnlock.id, pendingUnlock.cost);
    setPendingUnlock(null);
  };

  return (
    <div className="p-4 sm:p-6 pb-24 max-w-4xl mx-auto animation-fade-in">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-display font-bold text-slate-800">Bản Đồ Nông Trại</h2>
        <p className="text-sm text-slate-600">Chọn khu vực bạn muốn quản lý</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {regions.map((region) => {
          const isLocked = !unlockedRegions.includes(region.id);
          const canAfford = money >= region.cost;

          return (
            <button
              key={region.id}
              data-tutorial={region.id === 'market' ? 'market-region' : undefined}
              onClick={() => handleRegionClick(region.id, region.cost, isLocked)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-3xl border-b-4 transition-transform ${
                shakeId === region.id ? 'animate-shake-x' : ''
              } ${
                isLocked
                  ? 'bg-slate-100 border-slate-300 opacity-90'
                  : `active:scale-95 ${region.color} shadow-sm cursor-pointer`
              }`}
            >
              {isLocked && (
                <div className="absolute top-3 right-3 text-slate-400">
                  <Lock size={16} />
                </div>
              )}
              
              <div className={`bg-white p-3 rounded-full mb-3 shadow-inner ${isLocked ? 'grayscale opacity-50' : ''}`}>
                {region.icon}
              </div>
              <span className={`font-bold font-display text-center leading-tight ${isLocked ? 'text-slate-500' : 'text-slate-800'}`}>
                {region.label}
              </span>
              <div className={`text-[11px] mt-1 text-center font-medium flex items-center justify-center gap-1 ${isLocked ? (canAfford ? 'text-green-600 font-bold' : 'text-rose-500') : 'text-slate-600'}`}>
                {isLocked ? (
                  <>
                    <Coins size={12} /> Mở khóa: {region.cost}
                  </>
                ) : (
                  region.desc
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal xác nhận mở khóa trong game (thay window.confirm) */}
      {pendingUnlock && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setPendingUnlock(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
              Mở khóa khu vực?
            </h3>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Bạn có muốn mở khóa <strong className="text-slate-900">{pendingUnlock.label}</strong> với
              giá <strong className="text-amber-700">💰 {formatMoney(pendingUnlock.cost)}</strong> không?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingUnlock(null)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all active:scale-95"
              >
                Để sau
              </button>
              <button
                onClick={confirmUnlock}
                disabled={money < pendingUnlock.cost}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-40"
              >
                Xác nhận (💰 {formatMoney(pendingUnlock.cost)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
