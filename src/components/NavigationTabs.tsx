import React from 'react';
import { Map } from 'lucide-react';

export type GameTab =
  | 'hub'
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

export const NavigationTabs: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  if (activeTab === 'hub') return null;

  return (
    <div className="fixed bottom-safe left-1/2 -translate-x-1/2 mb-6 z-50">
      <button
        onClick={() => onSelectTab('hub')}
        className="flex items-center gap-2 bg-[#2E4A35] text-white px-5 py-3 rounded-full shadow-lg border-2 border-[#E9E4D4]/30 font-bold font-display hover:scale-105 active:scale-95 transition-transform animate-in slide-in-from-bottom"
      >
        <Map size={20} />
        <span>Bản Đồ</span>
      </button>
    </div>
  );
};
