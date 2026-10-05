import React from 'react';
import { MainNavTab } from '../types/flutterFarm';
import { Trees, Beef, BarChart3, Package, User } from 'lucide-react';

interface Props {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
}

export const FlutterBottomNav: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: MainNavTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'farm', label: 'Nông Trại', icon: Trees },
    { id: 'livestock', label: 'Khu Gia Súc', icon: Beef },
    { id: 'analytics', label: 'Phân Tích', icon: BarChart3 },
    { id: 'harvest', label: 'Thu Hoạch & Kho', icon: Package },
    { id: 'profile', label: 'Hồ Sơ', icon: User },
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-t border-[#EAE6DA] px-4 py-2 flex items-center justify-around shrink-0 z-30 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="max-w-2xl mx-auto w-full flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] sm:min-w-[80px] py-1 px-1 transition-all cursor-pointer ${
                isActive ? 'text-[#234230]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'scale-110 bg-[#234230]/10' : ''}`}>
                <IconComponent
                  size={22}
                  className={isActive ? 'stroke-[2.6] text-[#234230]' : 'stroke-[2]'}
                />
              </div>
              <span
                className={`text-[11px] tracking-tight mt-1 leading-none ${
                  isActive ? 'font-extrabold text-[#234230]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
