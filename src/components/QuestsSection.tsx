import React, { useState } from 'react';
import { Achievement, DailyQuest } from '../types/game';
import { Award, CheckCircle, Gift, Sparkles } from 'lucide-react';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';

interface Props {
  quests: DailyQuest[];
  achievements: Achievement[];
  onClaimQuest: (questId: string, e: React.MouseEvent) => void;
  onClaimAchievement: (achId: string, e: React.MouseEvent) => void;
}

export const QuestsSection: React.FC<Props> = ({
  quests,
  achievements,
  onClaimQuest,
  onClaimAchievement,
}) => {
  const [activeTab, setActiveTab] = useState<'quests' | 'achievements'>('quests');

  const unclaimedQuestsCount = quests.filter((q) => q.isCompleted && !q.isClaimed).length;
  const unclaimedAchCount = achievements.filter((a) => a.isUnlocked && !a.isClaimed).length;

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#1a3323] rounded-2xl border border-emerald-800/60">
        <button
          onClick={() => setActiveTab('quests')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'quests'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-emerald-300/70 hover:text-white'
          }`}
        >
          <span><GameIcon e="🎯" /> Nhiệm Vụ Hàng Ngày</span>
          {unclaimedQuestsCount > 0 && (
            <span className="bg-rose-500 text-white text-[11px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold animate-bounce-slight">
              {unclaimedQuestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'achievements'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-emerald-300/70 hover:text-white'
          }`}
        >
          <span><GameIcon e="🏆" /> Thành Tựu Nông Gia</span>
          {unclaimedAchCount > 0 && (
            <span className="bg-amber-400 text-slate-950 text-[11px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold animate-bounce-slight">
              {unclaimedAchCount}
            </span>
          )}
        </button>
      </div>

      {/* Quests View */}
      {activeTab === 'quests' && (
        <div className="flex flex-col gap-3">
          {quests.map((quest) => {
            const percent = Math.min(100, Math.floor((quest.currentCount / quest.targetCount) * 100));

            return (
              <div
                key={quest.id}
                className={`p-3.5 rounded-2xl border shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  quest.isClaimed
                    ? 'bg-[#16291c]/70 border-emerald-900/40 opacity-60'
                    : quest.isCompleted
                    ? 'bg-gradient-to-r from-[#294f34] to-[#1c3c26] border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-[#1e3c27]/90 border-emerald-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-md bg-emerald-950/80 border flex items-center justify-center text-2xl shrink-0 border-[3px] border-[#3a2b3f]">
                    <GameIcon e={quest.icon} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm leading-tight flex items-center gap-1.5">
                      <span>{quest.titleVi}</span>
                      {quest.isClaimed && (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <CheckCircle size={11} /> Đã nhận
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-emerald-300/90 mt-0.5">{quest.descriptionVi}</p>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-32 sm:w-44 h-2 bg-emerald-950 rounded-full overflow-hidden p-0.5 border border-emerald-900">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-emerald-300 font-bold tabular-nums">
                        {quest.currentCount}/{quest.targetCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rewards & Claim Button */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-800/60">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold">
                    <span className="text-amber-300"><CoinIcon /> +{quest.rewardCoins}</span>
                    <span className="text-sky-300"><GameIcon e="✨" /> +{quest.rewardExp}</span>
                    {quest.rewardGems && <span className="text-fuchsia-300"><GameIcon e="💎" /> +{quest.rewardGems}</span>}
                  </div>

                  {!quest.isClaimed && (
                    <button
                      onClick={(e) => onClaimQuest(quest.id, e)}
                      disabled={!quest.isCompleted}
                      className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-md ${
                        quest.isCompleted
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 cursor-pointer animate-pulse-gentle'
                          : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                      }`}
                    >
                      <Gift size={13} />
                      <span>{quest.isCompleted ? 'Nhận Thưởng' : 'Đang thực hiện'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Achievements View */}
      {activeTab === 'achievements' && (
        <div className="flex flex-col gap-3">
          {achievements.map((ach) => {
            const percent = Math.min(100, Math.floor((ach.currentCount / ach.targetCount) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  ach.isClaimed
                    ? 'bg-[#16291c]/70 border-emerald-900/40 opacity-60'
                    : ach.isUnlocked
                    ? 'bg-gradient-to-r from-[#294f34] to-[#1c3c26] border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-[#1e3c27]/90 border-emerald-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-md bg-amber-500/20 border flex items-center justify-center text-2xl shrink-0 border-[3px] border-[#3a2b3f]">
                    <GameIcon e={ach.icon} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm leading-tight flex items-center gap-1.5">
                      <span>{ach.titleVi}</span>
                      {ach.isClaimed && (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <CheckCircle size={11} /> Đã nhận
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-emerald-300/90 mt-0.5">{ach.descriptionVi}</p>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-32 sm:w-44 h-2 bg-emerald-950 rounded-full overflow-hidden p-0.5 border border-emerald-900">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-fuchsia-400 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-amber-300 font-bold tabular-nums">
                        {ach.currentCount}/{ach.targetCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reward Gem & Claim */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-800/60">
                  <span className="text-fuchsia-300 font-mono font-bold text-xs"><GameIcon e="💎" /> +{ach.rewardGems} Kim Cương</span>

                  {!ach.isClaimed && (
                    <button
                      onClick={(e) => onClaimAchievement(ach.id, e)}
                      disabled={!ach.isUnlocked}
                      className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-md ${
                        ach.isUnlocked
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 cursor-pointer animate-pulse-gentle'
                          : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                      }`}
                    >
                      <Award size={13} />
                      <span>{ach.isUnlocked ? 'Nhận Kim Cương' : 'Chưa đạt'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
