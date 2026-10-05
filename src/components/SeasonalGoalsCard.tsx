import React from 'react';
import { SeasonGoal } from '../types/farmSystem';
import { Trophy, CheckCircle, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface Props {
  goals: SeasonGoal[];
  onClaimReward: (goalId: string, e: React.MouseEvent) => void;
}

export const SeasonalGoalsCard: React.FC<Props> = ({ goals, onClaimReward }) => {
  if (!goals || goals.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D2] shadow-xs select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Trophy size={18} />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-slate-900 font-display leading-tight">
              Mục Tiêu Mùa Vụ Của Làng
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Hoàn thành các đơn đặt hàng đặc biệt từ hội đồng làng để nhận thưởng vàng và uy tín lớn
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {goals.map((goal) => {
          const progressPercent = Math.min(100, Math.floor((goal.currentAmount / goal.targetAmount) * 100));
          const isDone = goal.currentAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                goal.claimed
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : isDone
                  ? 'bg-gradient-to-r from-amber-50 to-emerald-50 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                  : 'bg-[#FAF8F2] border-[#E8E2D2]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{goal.icon}</span>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 font-display leading-tight">
                      {goal.title}
                    </h4>
                  </div>

                  <span className="font-mono font-black text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                    +{goal.rewardMoney} 💰
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {goal.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-current/10">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                  <span className="text-slate-500">Tiến độ:</span>
                  <span className={isDone ? 'text-emerald-700' : 'text-slate-800'}>
                    {goal.currentAmount} / {goal.targetAmount} ({progressPercent}%)
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="mt-2.5 flex items-center justify-end">
                  {goal.claimed ? (
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <CheckCircle size={14} /> Đã nhận thưởng
                    </span>
                  ) : isDone ? (
                    <button
                      onClick={(e) => {
                        sound.playCoin();
                        onClaimReward(goal.id, e);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer animate-pulse-gentle"
                    >
                      <Sparkles size={14} />
                      <span>Nhận Thưởng (+{goal.rewardMoney} vàng, +{goal.rewardXP} XP)</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Đang diễn ra trong mùa vụ</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
