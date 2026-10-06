import React, { useState } from 'react';
import { StartingProfileId } from '../types/farmSystem';
import { STARTING_PROFILES_CONFIG, generateRandomSeed } from '../config/variabilityData';
import { Dices, Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { sound } from '../utils/sound';
import { formatMoney } from '../utils/format';

interface Props {
  currentSeed: string;
  onConfirmNewGame: (profileId: StartingProfileId, seed: string) => void;
  onClose: () => void;
}

export const NewGameModal: React.FC<Props> = ({ currentSeed, onConfirmNewGame, onClose }) => {
  const [selectedProfile, setSelectedProfile] = useState<StartingProfileId>('hardworking_farmer');
  const [seedInput, setSeedInput] = useState<string>(() => generateRandomSeed());

  const handleRandomizeSeed = () => {
    sound.playPop();
    setSeedInput(generateRandomSeed());
  };

  const handleStart = () => {
    sound.playLevelUp();
    onConfirmNewGame(selectedProfile, seedInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-[#FAF8F2] border-2 border-[#DFD9C3] rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl relative max-h-[90vh] flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D2]">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🎲</span>
            <div>
              <h3 className="font-black text-lg sm:text-xl text-slate-900 font-display leading-tight">
                Khởi Tạo Nông Trại Khả Biến Mới
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Mỗi lượt chơi là một thế giới độc bản với đặc tính đất, thị trường và phong cách riêng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-3 space-y-4 pr-1">
          
          {/* Seed Input & Randomizer */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DFD9C3] shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-600" />
                <span>Mã Thế Giới (World Seed):</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">Dùng để lưu hoặc chia sẻ với bạn bè</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value.toUpperCase())}
                placeholder="VD: FARM-8291"
                maxLength={12}
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#FAF8F2] border border-[#DFD9C3] font-mono font-black text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4A35]"
              />
              <button
                onClick={handleRandomizeSeed}
                className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                title="Sinh ngẫu nhiên mã hạt giống mới"
              >
                <Dices size={16} />
                <span className="hidden sm:inline">Đổi Seed</span>
              </button>
            </div>
          </div>

          {/* Starting Profiles Pool */}
          <div>
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-2">
              Chọn Hồ Sơ Khởi Đầu Của Bạn:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(STARTING_PROFILES_CONFIG).map((profile) => {
                const isSelected = selectedProfile === profile.id;

                return (
                  <div
                    key={profile.id}
                    onClick={() => {
                      setSelectedProfile(profile.id);
                      sound.playClick();
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                      isSelected
                        ? 'bg-[#2E4A35] text-white border-[#2E4A35] shadow-md ring-2 ring-[#2E4A35]/20 scale-101'
                        : 'bg-white border-[#E8E2D2] text-slate-800 hover:bg-[#FAF8F2]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{profile.icon}</span>
                          <div>
                            <h4 className="font-extrabold text-sm leading-tight font-display">{profile.name}</h4>
                            <span className={`text-[11px] font-bold ${isSelected ? 'text-amber-300' : 'text-emerald-800'}`}>
                              {profile.style}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                            <Check size={13} className="stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <p className={`text-xs mt-1.5 leading-relaxed ${isSelected ? 'text-emerald-100' : 'text-slate-600'}`}>
                        {profile.description}
                      </p>
                    </div>

                    <div className={`mt-2.5 pt-2 border-t text-[11px] font-medium ${
                      isSelected ? 'border-white/20 text-amber-200' : 'border-slate-100 text-amber-900'
                    }`}>
                      <strong className="block font-bold">✨ {profile.perkName}:</strong>
                      <span>{profile.perkDescription}</span>
                      <div className="mt-1 flex items-center gap-2 font-mono text-[11px] opacity-80">
                        <span>💰 💰 {formatMoney(profile.initialMoney)}</span>
                        <span>·</span>
                        <span>🌾 {profile.plotCount} ô đất</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="pt-3 border-t border-[#E8E2D2] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#DFD9C3] text-slate-700 text-xs font-bold hover:bg-[#F3EFE0] cursor-pointer"
          >
            Hủy Bỏ
          </button>

          <button
            onClick={handleStart}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
          >
            <span>Khởi Tạo Trang Trại Mới</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
