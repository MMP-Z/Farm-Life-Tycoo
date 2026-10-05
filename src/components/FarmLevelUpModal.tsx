import React from 'react';
import { LEVEL_UNLOCKS } from '../config/farmData';
import { Sparkles, Trophy, Award, CheckCircle } from 'lucide-react';

interface Props {
  level: number;
  rewardMoney: number;
  onClose: () => void;
}

export const FarmLevelUpModal: React.FC<Props> = ({ level, rewardMoney, onClose }) => {
  const unlockedItems = LEVEL_UNLOCKS[level] || ['Kỹ năng canh tác thành thạo hơn', 'Tăng hạn mức sản lượng'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#25432B] via-[#1D3522] to-[#142618] border-2 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Sparkle */}
        <div className="relative inline-flex items-center justify-center mb-3">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-amber-300 shadow-xl flex items-center justify-center text-4xl animate-bounce-slight">
            ⭐
          </div>
          <Sparkles className="absolute -top-1 -right-2 text-amber-300 animate-spin-slow" size={24} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
          CHÚC MỪNG LÊN CẤP!
        </h2>
        <p className="text-amber-300 font-extrabold text-lg mt-1 font-display">
          Nông Trại Đã Đạt Cấp {level}
        </p>

        {/* Bonus Money */}
        <div className="my-5 p-3.5 bg-black/30 rounded-2xl border border-emerald-700/60 flex items-center justify-center gap-3">
          <span className="text-3xl">💰</span>
          <div className="flex flex-col text-left">
            <span className="text-xs text-emerald-300 font-semibold">Phần Thưởng Thăng Cấp:</span>
            <span className="font-mono font-black text-amber-300 text-lg sm:text-xl">
              +{rewardMoney.toLocaleString()} Tiền Vàng
            </span>
          </div>
        </div>

        {/* Unlocked Features */}
        <div className="mb-6 text-left bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/80">
          <p className="text-xs font-bold text-amber-200 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
            <Award size={14} /> Mở Khóa Tính Năng & Vật Phẩm Mới:
          </p>
          <div className="flex flex-col gap-1.5">
            {unlockedItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-emerald-100 font-semibold">
                <CheckCircle size={14} className="text-amber-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-base shadow-lg transition-all transform active:scale-98 cursor-pointer"
        >
          TIẾP TỤC CANH TÁC 🚜
        </button>
      </div>
    </div>
  );
};
