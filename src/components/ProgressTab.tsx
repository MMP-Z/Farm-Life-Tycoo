import React from 'react';
import { GameStats, Quest, SeasonGoal } from '../types/farmSystem';
import { LEVEL_UNLOCKS } from '../config/farmData';
import { Trophy, Check, Gift, Award, TrendingUp, Download, Upload } from 'lucide-react';
import { sound } from '../utils/sound';
import { SeasonalGoalsCard } from './SeasonalGoalsCard';

interface Props {
  level: number;
  xp: number;
  nextXP: number;
  stats: GameStats;
  quests: Quest[];
  seasonalGoals?: SeasonGoal[];
  onClaimQuest: (questId: string, e: React.MouseEvent) => void;
  onClaimSeasonGoal?: (goalId: string, e: React.MouseEvent) => void;
}

export const ProgressTab: React.FC<Props> = ({
  level,
  xp,
  nextXP,
  stats,
  quests,
  seasonalGoals = [],
  onClaimQuest,
  onClaimSeasonGoal,
}) => {
  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E2D2] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-inner">
            🏆
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
              Tiến Trình & Cây Mở Khóa Nông Trại
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Hoàn thành các mốc nhiệm vụ, tích lũy kinh nghiệm để mở khóa cây trồng hiếm, chuồng trại và xe vận tải mới
            </p>
          </div>
        </div>

      </div>

      {/* Lớp 4: Mục tiêu mùa vụ từ hội đồng làng */}
      {seasonalGoals.length > 0 && onClaimSeasonGoal && (
        <SeasonalGoalsCard goals={seasonalGoals} onClaimReward={onClaimSeasonGoal} />
      )}

      {/* Nhiệm Vụ Mục Tiêu */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E2D2] shadow-xs">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-display mb-3">
          🎯 Nhiệm Vụ Nông Dân Chăm Chỉ
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quests.map((quest) => {
            const percent = Math.min(100, Math.floor((quest.current / quest.target) * 100));

            return (
              <div
                key={quest.id}
                className={`p-4 rounded-3xl border flex flex-col justify-between transition-all ${
                  quest.claimed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : quest.completed
                    ? 'bg-white border-amber-400 ring-4 ring-amber-400/20 shadow-xs'
                    : 'bg-[#FAF8F2] border-[#E8E2D2]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{quest.icon}</span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">{quest.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{quest.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 my-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-700">
                      {quest.current}/{quest.target}
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-800">
                    +{quest.rewardMoney} 💰 · +{quest.rewardXP} XP
                  </span>

                  {!quest.claimed && (
                    <button
                      onClick={(e) => onClaimQuest(quest.id, e)}
                      disabled={!quest.completed}
                      className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-xs ${
                        quest.completed
                          ? 'bg-[#2E4A35] hover:bg-[#233a29] text-white cursor-pointer animate-pulse-gentle'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Gift size={13} />
                      <span>{quest.completed ? 'Nhận thưởng' : 'Chưa xong'}</span>
                    </button>
                  )}

                  {quest.claimed && (
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <Check size={13} className="stroke-[3]" /> Đã nhận
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cây Mở Khóa Theo Level (Section 5) */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E2D2] shadow-xs">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-display mb-3">
          ⭐ Lộ Trình Cấp Độ & Mở Khóa Tính Năng (Level Roadmap)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(LEVEL_UNLOCKS).map(([lvlStr, items]) => {
            const reqLvl = parseInt(lvlStr, 10);
            const isReached = level >= reqLvl;

            return (
              <div
                key={lvlStr}
                className={`p-4 rounded-3xl border flex flex-col justify-between ${
                  isReached ? 'bg-[#F2F7F2] border-[#C8DFCA]' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-mono font-extrabold text-xs px-2.5 py-0.5 rounded-full ${
                      isReached ? 'bg-emerald-800 text-white' : 'bg-slate-300 text-slate-700'
                    }`}>
                      Cấp Độ {reqLvl}
                    </span>
                    {isReached && <Check size={14} className="text-emerald-700 stroke-[3]" />}
                  </div>

                  <ul className="text-xs text-slate-700 space-y-1 my-1">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thống kê trang trại */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E2D2] shadow-xs">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-display mb-3">
          📊 Báo Cáo Thống Kê Nông Trại
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2]">
            <span className="text-xs text-slate-500 font-medium">Số ngày đã chơi</span>
            <span className="font-mono font-black text-xl text-slate-900 block mt-1">{stats.daysPlayed} ngày</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2]">
            <span className="text-xs text-slate-500 font-medium">Tổng vụ thu hoạch</span>
            <span className="font-mono font-black text-xl text-emerald-800 block mt-1">{stats.totalHarvests} vụ</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2]">
            <span className="text-xs text-slate-500 font-medium">Chuyến xe hoàn thành</span>
            <span className="font-mono font-black text-xl text-amber-800 block mt-1">{stats.totalDeliveries} chuyến</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2]">
            <span className="text-xs text-slate-500 font-medium">Tổng tiền tích lũy</span>
            <span className="font-mono font-black text-xl text-amber-950 block mt-1">+{stats.totalEarnings.toLocaleString()} 💰</span>
          </div>
        </div>
      </div>

    </div>
  );
};
