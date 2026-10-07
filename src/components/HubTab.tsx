import React, { useState } from 'react';
import { GameTab } from './NavigationTabs';
import { FarmGameState } from '../types/farmSystem';
import { Trees, Beef, CookingPot, Store, ShoppingBag, ShoppingCart, Truck, Package, ShieldCheck, Lock } from 'lucide-react';
import { formatMoney } from '../utils/format';
import { CoinIcon } from './CoinIcon';
import { MainQuestCard } from './MainQuestCard';

interface Props {
  state: FarmGameState;
  onSelectTab: (tab: GameTab) => void;
  unlockedRegions: string[];
  money: number;
  onUnlockRegion: (regionId: string, cost: number) => void;
  onClaimQuest: () => void;
  onNotify?: (msg: string) => void;
}

export const HubTab: React.FC<Props> = ({ state, onSelectTab, unlockedRegions, money, onUnlockRegion, onClaimQuest, onNotify }) => {
  // FIX (bug mở khóa Chợ Làng): thay window.confirm (native dialog) bằng modal
  // trong game — native dialog bị automation/test chặn (auto-dismiss) và khi bị
  // chặn trình duyệt thì nút bấm trông như "không phản hồi".
  const [pendingUnlock, setPendingUnlock] = useState<{ id: string; label: string; cost: number } | null>(null);
  // Hiệu ứng rung + toast khi bấm mở khóa mà không đủ tiền (trước đây im lặng tuyệt đối)
  const [shakeId, setShakeId] = useState<string | null>(null);
  // Giảm sốc hình ảnh: khu vực nâng cao thu gọn mặc định, chỉ mở khi player đã
  // mở khóa Chợ Làng (cột mốc tiến triển đầu tiên) hoặc tự bấm xem.
  const marketUnlocked = unlockedRegions.includes('market');
  const [advancedOpen, setAdvancedOpen] = useState<boolean | null>(null);
  const showAdvanced = advancedOpen ?? marketUnlocked;

  const mainRegions = [
    { id: 'field', label: 'Khu Trồng Trọt', icon: <Trees size={32} className="text-emerald-600" />, desc: 'Gieo hạt và thu hoạch', color: 'bg-emerald-100 border-emerald-300', cost: 0 },
    { id: 'shop', label: 'Cửa Hàng', icon: <Store size={32} className="text-teal-600" />, desc: 'Mua giống, vật tư', color: 'bg-teal-100 border-teal-300', cost: 0 },
    { id: 'barn', label: 'Nhà Kho', icon: <Package size={32} className="text-stone-600" />, desc: 'Quản lý vật phẩm', color: 'bg-stone-200 border-stone-400', cost: 0 },
    { id: 'market', label: 'Chợ Làng', icon: <ShoppingBag size={32} className="text-blue-600" />, desc: 'Bán nông sản kiếm lời', color: 'bg-blue-100 border-blue-300', cost: 50 },
  ] as const;

  const advancedRegions = [
    { id: 'pasture', label: 'Khu Chăn Nuôi', icon: <Beef size={32} className="text-amber-600" />, desc: 'Chăm sóc vật nuôi', color: 'bg-amber-100 border-amber-300', cost: 150 },
    // FIX (P1-1): Siêu Thị & Đơn Hàng Thương Lái từng là tính năng "ma" — code xong
    // (SupermarketTab, badge, handleFulfillOrder) nhưng không có đường vào UI.
    { id: 'supermarket', label: 'Siêu Thị', icon: <ShoppingCart size={32} className="text-rose-600" />, desc: 'Đơn hàng số lượng lớn', color: 'bg-rose-100 border-rose-300', cost: 200 },
    { id: 'workshop', label: 'Xưởng Chế Biến', icon: <CookingPot size={32} className="text-orange-600" />, desc: 'Làm bánh, mứt, bơ', color: 'bg-orange-100 border-orange-300', cost: 300 },
    { id: 'transport', label: 'Đội Vận Tải', icon: <Truck size={32} className="text-indigo-600" />, desc: 'Giao hàng đi muôn nơi', color: 'bg-indigo-100 border-indigo-300', cost: 500 },
    { id: 'admin', label: 'Trung Tâm Hành Chính', icon: <ShieldCheck size={32} className="text-slate-600" />, desc: 'Thuế, bảo hiểm', color: 'bg-slate-200 border-slate-400', cost: 1000 },
  ] as const;

  const allRegions = [...mainRegions, ...advancedRegions];

  const handleRegionClick = (regionId: string, cost: number, isLocked: boolean) => {
    if (!isLocked) {
      onSelectTab(regionId as GameTab);
      return;
    }
    const label = allRegions.find((r) => r.id === regionId)?.label ?? regionId;
    if (money >= cost) {
      // Mở modal xác nhận trong game thay vì window.confirm
      setPendingUnlock({ id: regionId, label, cost });
    } else {
      // Phản hồi rõ ràng khi không đủ tiền
      onNotify?.(`Không đủ vàng! Cần <CoinIcon /> ${formatMoney(cost)} để mở khóa ${label} (đang có <CoinIcon /> ${formatMoney(money)}).`);
      setShakeId(regionId);
      window.setTimeout(() => setShakeId((cur) => (cur === regionId ? null : cur)), 500);
    }
  };

  const confirmUnlock = () => {
    if (!pendingUnlock) return;
    onUnlockRegion(pendingUnlock.id, pendingUnlock.cost);
    setPendingUnlock(null);
  };

  const renderRegionCard = (region: typeof allRegions[number]) => {    const isLocked = !unlockedRegions.includes(region.id);
    const canAfford = money >= region.cost;

    return (
      <button
        key={region.id}
        data-tutorial={region.id === 'market' ? 'market-region' : undefined}
        onClick={() => handleRegionClick(region.id, region.cost, isLocked)}
        className={`px-panel relative flex flex-col items-center justify-center p-4 transition-transform ${
          shakeId === region.id ? 'animate-shake-x' : ''
        } ${
          isLocked
            ? 'opacity-90 cursor-pointer'
            : 'active:scale-95 cursor-pointer hover:-translate-y-0.5'
        }`}
      >
        {isLocked && (
          <div className="absolute top-2 right-2 text-slate-400 bg-white/80 rounded-md p-1 border-2 border-[#3a2b3f]">
            <Lock size={14} />
          </div>
        )}

        <div className={`px-panel-inset p-2.5 mb-3 flex items-center justify-center ${isLocked ? 'grayscale opacity-50' : ''}`}>
          {region.icon}
        </div>
        <span className="font-bold font-display text-center leading-tight text-slate-800 text-sm">
          {region.label}
        </span>
        <div className={`text-[11px] mt-1.5 text-center font-medium flex items-center justify-center gap-1 ${isLocked ? (canAfford ? 'text-green-700 font-bold' : 'text-rose-600 font-bold') : 'text-slate-600'}`}>
          {isLocked ? (
            <>
              Mở khóa: <CoinIcon /> {formatMoney(region.cost)}
            </>
          ) : (
            region.desc
          )}
        </div>
      </button>
    );
  };

  // Đếm ô đã chín để widget "nên làm gì" ưu tiên thu hoạch
  const readyPlotsCount = state.plots.filter((p) => p.state === 'ready').length;

  return (
    <div className="p-4 sm:p-6 pb-24 max-w-4xl mx-auto animation-fade-in">
      <div className="px-titlebar px-4 py-3 mb-4 text-center">
        <h2 className="text-xl font-display font-bold">Bản Đồ Nông Trại</h2>
        <p className="text-xs opacity-90 mt-0.5">Chọn khu vực bạn muốn quản lý</p>
      </div>

      {/* Widget nhiệm vụ chính + gợi ý hành động tiếp theo */}
      <MainQuestCard
        state={state}
        readyPlotsCount={readyPlotsCount}
        onSelectTab={onSelectTab}
        onClaimQuest={onClaimQuest}
      />

      {/* Khu vực chính — luôn hiện */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {mainRegions.map(renderRegionCard)}
      </div>

      {/* Khu vực nâng cao — thu gọn mặc định để giảm sốc hình ảnh */}
      <div className="mt-6">
        <button
          onClick={() => setAdvancedOpen(!showAdvanced)}
          className="w-full px-panel p-4 flex items-center gap-3 cursor-pointer hover:-translate-y-0.5 transition-transform text-left"
        >
          <div className="px-panel-inset p-2 flex items-center justify-center">
            <Lock size={20} className="text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold font-display text-slate-800 text-sm">
              Khu Vực Nâng Cao
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {marketUnlocked
                ? 'Chăn nuôi, Siêu thị, Xưởng chế biến, Vận tải, Hành chính'
                : 'Mở khóa Chợ Làng để khám phá thêm 5 khu vực'}
            </div>
          </div>
          <span className={`text-slate-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 animation-fade-in">
            {advancedRegions.map(renderRegionCard)}
          </div>
        )}
      </div>

      {/* Modal xác nhận mở khóa trong game (thay window.confirm) */}
      {pendingUnlock && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setPendingUnlock(null)}
        >
          <div
            className="px-panel p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
              Mở khóa khu vực?
            </h3>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Bạn có muốn mở khóa <strong className="text-slate-900">{pendingUnlock.label}</strong> với
              giá <strong className="text-amber-700"><CoinIcon /> {formatMoney(pendingUnlock.cost)}</strong> không?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingUnlock(null)}
                className="flex-1 py-2.5 px-btn px-btn-slate font-bold text-sm"
              >
                Để sau
              </button>
              <button
                onClick={confirmUnlock}
                disabled={money < pendingUnlock.cost}
                className="flex-1 py-2.5 px-btn px-btn-green font-bold text-sm disabled:opacity-40"
              >
                Xác nhận (<CoinIcon /> {formatMoney(pendingUnlock.cost)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
