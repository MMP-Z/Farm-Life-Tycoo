import React from 'react';
import { Target, Gift, ChevronRight, Wheat } from 'lucide-react';
import { GameTab } from './NavigationTabs';
import { FarmGameState } from '../types/farmSystem';
import { getCurrentQuest } from '../constants/mainQuests';
import { CoinIcon } from './CoinIcon';
import { formatMoney } from '../utils/format';

interface Props {
  state: FarmGameState;
  readyPlotsCount: number;
  onSelectTab: (tab: GameTab) => void;
  onClaimQuest: () => void;
}

/**
 * Widget "Nên làm gì tiếp" — ưu tiên hành động khẩn cấp (thu hoạch),
 * sau đó là nhiệm vụ chính hiện tại.
 */
export const MainQuestCard: React.FC<Props> = ({ state, readyPlotsCount, onSelectTab, onClaimQuest }) => {
  // Ưu tiên 1: có ô đã chín → thu hoạch ngay
  if (readyPlotsCount > 0) {
    return (
      <div className="px-panel p-4 mb-4 flex items-center gap-3 animation-fade-in border-amber-400">
        <div className="px-panel-inset p-2 flex items-center justify-center shrink-0">
          <Wheat size={24} className="text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold font-display text-slate-800 text-sm">
            Có {readyPlotsCount} ô đã chín rộ!
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Thu hoạch ngay kẻo héo
          </div>
        </div>
        <button
          onClick={() => onSelectTab('field')}
          className="px-btn px-btn-amber font-bold text-xs px-4 py-2.5 flex items-center gap-1 shrink-0"
        >
          Thu hoạch <ChevronRight size={14} />
        </button>
      </div>
    );
  }

  // Ưu tiên 2: nhiệm vụ chính
  const current = getCurrentQuest(state);
  if (!current) {
    return (
      <div className="px-panel p-4 mb-4 flex items-center gap-3 animation-fade-in">
        <div className="px-panel-inset p-2 flex items-center justify-center shrink-0">
          <Target size={24} className="text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold font-display text-slate-800 text-sm">
            Bạn đã hoàn thành mọi nhiệm vụ!
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Tự do phát triển nông trại theo cách của bạn
          </div>
        </div>
      </div>
    );
  }

  const { def } = current;
  const progress = def.checkProgress(state);
  const pct = Math.min(100, Math.round((progress.current / progress.target) * 100));

  return (
    <div className="px-panel p-4 mb-4 animation-fade-in">
      <div className="flex items-center gap-3">
        <div className="px-panel-inset p-2 flex items-center justify-center shrink-0">
          <Target size={24} className="text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
            Nhiệm vụ {current.index + 1}/{10}
          </div>
          <div className="font-bold font-display text-slate-800 text-sm mt-0.5">
            {def.title}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {def.description}
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-700 font-bold text-xs shrink-0 bg-amber-100 px-2 py-1 rounded-md border-2 border-[#3a2b3f]">
          <Gift size={14} />
          <CoinIcon /> {formatMoney(def.rewardCoins)}
        </div>
      </div>

      {/* Thanh tiến độ */}
      <div className="mt-3 h-3 bg-[#E8E0C8] rounded-md border-2 border-[#3a2b3f] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-[11px] text-slate-500 mt-1 font-mono">
        {progress.current}/{progress.target}
      </div>

      <div className="flex gap-2 mt-3">
        {progress.done ? (
          <button
            onClick={onClaimQuest}
            className="flex-1 px-btn px-btn-amber font-bold text-sm py-2.5 flex items-center justify-center gap-1.5 animate-pulse-gentle"
          >
            <Gift size={16} /> Nhận thưởng <CoinIcon /> {formatMoney(def.rewardCoins)}
          </button>
        ) : (
          <button
            onClick={() => onSelectTab(def.targetTab)}
            className="flex-1 px-btn px-btn-green font-bold text-sm py-2.5 flex items-center justify-center gap-1"
          >
            Đi làm ngay <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
