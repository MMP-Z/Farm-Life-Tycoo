import React from 'react';

export type TabId = 'crops' | 'animals' | 'factories' | 'orders' | 'barn' | 'quests';

interface Props {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  badges: {
    readyCrops: number;
    readyAnimals: number;
    readyFactories: number;
    truckReady: boolean;
    unclaimedQuests: number;
  };
}

export const Navigation: React.FC<Props> = ({ activeTab, onSelectTab, badges }) => {
  const tabs: { id: TabId; label: string; icon: string; badge?: number | boolean }[] = [
    { id: 'crops', label: 'Ruộng đồng', icon: '🌾', badge: badges.readyCrops },
    { id: 'animals', label: 'Chuồng trại', icon: '🐮', badge: badges.readyAnimals },
    { id: 'factories', label: 'Xưởng chế biến', icon: '🥖', badge: badges.readyFactories },
    { id: 'orders', label: 'Đơn hàng xe', icon: '🚚', badge: badges.truckReady },
    { id: 'barn', label: 'Kho nông sản', icon: '🏡' },
    { id: 'quests', label: 'Nhiệm vụ', icon: '🏆', badge: badges.unclaimedQuests },
  ];

  return (
    <nav className="w-full bg-[#182d1f]/95 backdrop-blur-lg border-t border-emerald-800/60 sticky bottom-0 z-30 select-none pb-safe">
      <div className="max-w-2xl mx-auto px-1 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const hasNumericBadge = typeof tab.badge === 'number' && tab.badge > 0;
          const hasBooleanBadge = tab.badge === true;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[52px] sm:min-w-[64px] min-h-[48px] py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600/30 text-amber-300 font-bold scale-105'
                  : 'text-emerald-300/70 hover:text-emerald-100 hover:bg-emerald-800/20'
              }`}
            >
              {/* Badge indicator */}
              {hasNumericBadge && (
                <span className="absolute -top-1 right-2 sm:right-3 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce-slight">
                  {tab.badge}
                </span>
              )}
              {hasBooleanBadge && (
                <span className="absolute -top-1 right-2 sm:right-3 bg-amber-400 w-3 h-3 rounded-full border-2 border-[#182d1f] shadow-md animate-ping" />
              )}

              <span className={`text-xl sm:text-2xl transition-transform ${isActive ? 'scale-110 drop-shadow' : 'opacity-85'}`}>
                {tab.icon}
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>

              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
