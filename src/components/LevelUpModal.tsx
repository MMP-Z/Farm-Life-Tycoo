import React from 'react';
import { ANIMALS, CROPS, FACTORIES, RECIPES } from '../constants/gameData';
import { Sparkles, Trophy, Award } from 'lucide-react';

interface Props {
  level: number;
  rewardCoins: number;
  rewardGems: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<Props> = ({ level, rewardCoins, rewardGems, onClose }) => {
  // Find unlocked items at this specific level
  const unlockedCrops = Object.values(CROPS).filter((c) => c.minLevel === level);
  const unlockedAnimals = Object.values(ANIMALS).filter((a) => a.minLevel === level);
  const unlockedFactories = Object.values(FACTORIES).filter((f) => f.minLevel === level);
  const unlockedRecipes = RECIPES.filter((r) => r.minLevel === level);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#21432c] via-[#1a3523] to-[#122418] border-2 border-amber-400/80 rounded-3xl p-6 max-w-sm sm:max-w-md w-full shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Badge & Trophy */}
        <div className="relative inline-flex items-center justify-center mb-3">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-amber-300 shadow-xl flex items-center justify-center text-4xl animate-bounce-slight">
            ⭐
          </div>
          <Sparkles className="absolute -top-1 -right-2 text-amber-300 animate-spin-slow" size={24} />
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">CHÚC MỪNG LÊN CẤP!</h2>
        <p className="text-amber-300 font-bold text-lg mt-0.5">Nông Trại Đạt Cấp {level}</p>

        {/* Level Up Rewards */}
        <div className="my-4 p-3 bg-black/30 rounded-2xl border border-emerald-700/60 flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-2xl">💰</span>
            <span className="text-xs text-emerald-300">Thưởng Vàng</span>
            <span className="font-bold text-amber-300 text-sm font-mono">+{rewardCoins}</span>
          </div>

          <div className="h-8 w-px bg-emerald-800" />

          <div className="flex flex-col items-center">
            <span className="text-2xl">💎</span>
            <span className="text-xs text-emerald-300">Thưởng Kim Cương</span>
            <span className="font-bold text-fuchsia-300 text-sm font-mono">+{rewardGems}</span>
          </div>
        </div>

        {/* Unlocked Features List */}
        {(unlockedCrops.length > 0 ||
          unlockedAnimals.length > 0 ||
          unlockedFactories.length > 0 ||
          unlockedRecipes.length > 0) && (
          <div className="mb-5 text-left bg-emerald-950/60 p-3 rounded-2xl border border-emerald-800/80">
            <p className="text-xs font-bold text-amber-200 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Award size={13} /> Mở Khóa Tính Năng Mới:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {unlockedCrops.map((c) => (
                <span
                  key={c.id}
                  className="px-2 py-1 bg-amber-500/20 border border-amber-400/40 rounded-xl text-xs text-amber-100 font-medium flex items-center gap-1"
                >
                  <span>{c.icon}</span> Hạt {c.nameVi}
                </span>
              ))}

              {unlockedAnimals.map((a) => (
                <span
                  key={a.id}
                  className="px-2 py-1 bg-sky-500/20 border border-sky-400/40 rounded-xl text-xs text-sky-100 font-medium flex items-center gap-1"
                >
                  <span>{a.icon}</span> {a.nameVi}
                </span>
              ))}

              {unlockedFactories.map((f) => (
                <span
                  key={f.id}
                  className="px-2 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-emerald-100 font-medium flex items-center gap-1"
                >
                  <span>{f.icon}</span> {f.nameVi}
                </span>
              ))}

              {unlockedRecipes.map((r) => (
                <span
                  key={r.id}
                  className="px-2 py-1 bg-purple-500/20 border border-purple-400/40 rounded-xl text-xs text-purple-100 font-medium flex items-center gap-1"
                >
                  <span>{r.icon}</span> {r.nameVi}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-950/40 transition-transform active:scale-95 cursor-pointer uppercase tracking-wider"
        >
          Tuyệt Vời, Tiếp Tục Quản Lý!
        </button>
      </div>
    </div>
  );
};
