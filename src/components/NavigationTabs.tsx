import React, { useState } from 'react';
import {
  Trees,
  Beef,
  Package,
  CookingPot,
  ShoppingBag,
  Truck,
  Store,
  Trophy,
  MoreHorizontal,
  X,
  ShieldCheck,
} from 'lucide-react';

export type GameTab =
  | 'field'
  | 'pasture'
  | 'workshop'
  | 'market'
  | 'supermarket'
  | 'shop'
  | 'barn'
  | 'admin'
  | 'transport';

interface Props {
  activeTab: GameTab;
  onSelectTab: (tab: GameTab) => void;
  badges?: Partial<Record<GameTab, number>>;
}

export const NavigationTabs: React.FC<Props> = ({ activeTab, onSelectTab, badges = {} }) => {
  const [showMoreModal, setShowMoreModal] = useState(false);

  const tabs: { id: GameTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'field', label: 'Ruộng', icon: Trees },
    { id: 'pasture', label: 'Chuồng', icon: Beef },
    { id: 'workshop', label: 'Xưởng', icon: CookingPot },
    { id: 'market', label: 'Chợ Làng', icon: Store },
    { id: 'supermarket', label: 'Siêu Thị', icon: Store },
    { id: 'shop', label: 'Cửa Hàng', icon: ShoppingBag },
    { id: 'barn', label: 'Kho', icon: Package },
    { id: 'admin', label: 'Hành Chính', icon: ShieldCheck },
    { id: 'transport', label: 'Vận Tải', icon: Truck },
  ];

  // Mobile bottom bar tabs: 4 main + 1 more button
  const mobilePrimaryTabs: { id: GameTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'field', label: 'Ruộng', icon: Trees },
    { id: 'pasture', label: 'Chuồng', icon: Beef },
    { id: 'workshop', label: 'Xưởng', icon: CookingPot },
    { id: 'market', label: 'Chợ', icon: Store },
  ];

  // More drawer tabs
  const secondaryTabs: { id: GameTab; label: string; desc: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'supermarket', label: 'Siêu Thị', desc: 'Đơn hàng số lượng lớn, giá ổn định', icon: Store },
    { id: 'shop', label: 'Cửa Hàng Nông Nghiệp', desc: 'Mua hạt giống, phân bón, thuốc BVTV sinh học', icon: ShoppingBag },
    { id: 'barn', label: 'Kho Lưu Trữ', desc: 'Kiểm tra hàng tồn, quản lý hạn dùng và kho lạnh', icon: Package },
    { id: 'admin', label: 'Trung Tâm Hành Chính', desc: 'Quản lý an ninh, bảo hiểm, thuế và khoản vay', icon: ShieldCheck },
    { id: 'transport', label: 'Đội Vận Tải', desc: 'Điều phối xe đi giao thương liên huyện, thành phố', icon: Truck },
  ];

  const isMoreActive = ['supermarket', 'shop', 'barn', 'admin', 'transport'].includes(activeTab);
  const moreBadgeCount =
    (badges.supermarket || 0) +
    (badges.shop || 0) +
    (badges.barn || 0) +
    (badges.admin || 0) +
    (badges.transport || 0);

  return (
    <>
      {/* Top Navigation Bar: Hidden on mobile (sm:hidden), only shown on desktop/tablet (hidden sm:block) */}
      <nav className="hidden sm:block w-full bg-[#FAF8F2] border-b border-[#E8E2D2] px-2 sm:px-6 select-none sticky top-[57px] sm:top-[61px] z-30 font-sans shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComp = tab.icon;
            const badgeCount = badges[tab.id] || 0;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`h-9 sm:h-10 relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-[#2E4A35] text-white shadow-sm ring-2 ring-[#2E4A35]/20 scale-102'
                    : 'text-slate-700 bg-white/70 hover:bg-white hover:text-slate-900 border border-[#E9E4D4]'
                }`}
              >
                <IconComp size={15} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />
                <span>{tab.label}</span>

                {badgeCount > 0 && (
                  <span className="bg-amber-400 text-slate-950 font-mono font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce-slight shadow-xs">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Sticky Bottom Navigation Bar (sm:hidden) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D2] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.08)] select-none">
        <div className="flex items-center justify-around px-1 py-1.5">
          {mobilePrimaryTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComp = tab.icon;
            const badgeCount = badges[tab.id] || 0;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  onSelectTab(tab.id);
                  setShowMoreModal(false);
                }}
                className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all cursor-pointer active:scale-90 ${
                  isActive ? 'text-[#2E4A35]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all relative ${
                    isActive ? 'bg-[#2E4A35]/10 scale-110' : ''
                  }`}
                >
                  <IconComp size={20} className={isActive ? 'stroke-[2.6]' : 'stroke-[2]'} />
                  {badgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-mono font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                      {badgeCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-0.5 leading-none ${
                    isActive ? 'font-black text-[#2E4A35]' : 'font-semibold'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setShowMoreModal((prev) => !prev)}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all cursor-pointer active:scale-90 ${
              isMoreActive ? 'text-[#2E4A35]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all relative ${
                isMoreActive ? 'bg-[#2E4A35]/10 scale-110' : ''
              }`}
            >
              <MoreHorizontal size={20} className={isMoreActive ? 'stroke-[2.6]' : 'stroke-[2]'} />
              {moreBadgeCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-mono font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                  {moreBadgeCount}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] tracking-tight mt-0.5 leading-none ${
                isMoreActive ? 'font-black text-[#2E4A35]' : 'font-semibold'
              }`}
            >
              {isMoreActive
                ? tabs.find((t) => t.id === activeTab)?.label.split(' ')[0] || 'Khác'
                : 'Thêm'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile More Sheet / Drawer Modal */}
      {showMoreModal && (
        <div
          className="sm:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-150"
          onClick={() => setShowMoreModal(false)}
        >
          <div
            className="w-full bg-[#FAF8F2] border-t-2 border-[#DFD9C3] rounded-t-3xl p-5 shadow-2xl animate-in slide-in-from-bottom-6 duration-200 pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D2]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚜</span>
                <h3 className="font-extrabold text-base text-slate-900 font-display">Khu Vực Khác Của Nông Trại</h3>
              </div>
              <button
                onClick={() => setShowMoreModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 py-4">
              {secondaryTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const IconComp = tab.icon;
                const badgeCount = badges[tab.id] || 0;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setShowMoreModal(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer active:scale-98 ${
                      isActive
                        ? 'bg-[#2E4A35] text-white border-[#2E4A35] shadow-sm'
                        : 'bg-white border-[#E8E2D2] text-slate-800 hover:bg-[#F3EFE0]'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl ${
                        isActive ? 'bg-white/20' : 'bg-emerald-50 text-[#2E4A35]'
                      }`}
                    >
                      <IconComp size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm font-display">{tab.label}</span>
                        {badgeCount > 0 && (
                          <span className="bg-amber-400 text-slate-950 font-mono font-black text-[10px] px-1.5 py-0.5 rounded-full">
                            {badgeCount} mới
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {tab.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowMoreModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#EFE9D7] border border-[#DFD9C3] text-slate-700 font-bold text-xs cursor-pointer active:scale-98"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};
