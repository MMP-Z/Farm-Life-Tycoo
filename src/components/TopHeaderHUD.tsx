import React, { useRef, useState } from 'react';
import { FarmGameState } from '../types/farmSystem';
import { SEASON_NAMES, WEATHER_NAMES } from '../config/farmData';
import { STARTING_PROFILES_CONFIG } from '../config/variabilityData';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  FastForward,
  Download,
  Upload,
  Clock,
  Settings,
  X,
  Dices,
  RotateCcw,
  Copy,
} from 'lucide-react';
import { exportSaveFile, importSaveFile } from '../utils/storageEngine';
import { sound } from '../utils/sound';

interface Props {
  state: FarmGameState;
  onSetGameSpeed: (speed: number) => void;
  onToggleSound: () => void;
  onLoadImportedState: (loaded: FarmGameState) => void;
  onShowToast: (msg: string) => void;
  onOpenNewGameModal: () => void;
  onFastForward: () => void;
}

export const TopHeaderHUD: React.FC<Props> = ({
  state,
  onSetGameSpeed,
  onToggleSound,
  onLoadImportedState,
  onShowToast,
  onOpenNewGameModal,
  onFastForward,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  // FIX (nút Tua Nhanh thỉnh thoảng rớt click): header re-render mỗi giây khiến
  // nút có thể bị thay thế/di chuyển ngay giữa lúc bấm. Dùng pointerdown (tín hiệu
  // sớm nhất) làm trigger chính, kèm timestamp để nuốt click tổng hợp đi sau,
  // tránh double-fire. Click từ bàn phím (Enter/Space) không có pointerdown trước
  // đó nên vẫn hoạt động bình thường.
  const ffLastPointerRef = useRef(0);
  const fireFastForward = (kind: 'pointer' | 'click') => {
    if (kind === 'click' && Date.now() - ffLastPointerRef.current < 800) return;
    if (kind === 'pointer') ffLastPointerRef.current = Date.now();
    onFastForward();
  };

  const unlockedFactoriesCount = Object.values(state.factories || {}).filter(f => f.unlocked).length;
  const totalDebt = (state.loans || []).reduce((sum, l) => sum + l.remainingAmount, 0);
  const inventoryValue = (state.inventory || []).reduce((sum, item) => sum + (item.quantity * 2), 0);
  const totalAssets = state.money + (state.plots.length * 50) + inventoryValue + (unlockedFactoriesCount * 500) - totalDebt;

  const seasonInfo = SEASON_NAMES[state.currentSeason];
  const weatherInfo = WEATHER_NAMES[state.weather];
  const profileInfo = STARTING_PROFILES_CONFIG[state.startingProfileId] || STARTING_PROFILES_CONFIG.hardworking_farmer;
  const dayPartName = {
    morning: 'Sáng',
    noon: 'Trưa',
    afternoon: 'Chiều',
    evening: 'Tối',
  }[state.dayPart] || 'Sáng';

  // In-game clock from timeOfDay (0.0 = 06:00 sáng, 0.5 = 18:00 chiều)
  const hour = Math.floor(6 + state.timeOfDay * 18);
  const minute = Math.floor((state.timeOfDay * 18 * 60) % 60);
  const timeFormatted = `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}`;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importSaveFile(file);
      onLoadImportedState(imported);
      onShowToast('Nạp file save thành công! Chào mừng trở lại nông trại.');
      sound.playPop();
      setShowSettingsModal(false);
    } catch (err) {
      onShowToast('Lỗi nạp file save! Vui lòng kiểm tra lại file JSON.');
    }
  };

  const handleCycleSpeed = () => {
    const speeds = [1, 2, 4, 0];
    const curIdx = speeds.indexOf(state.settings.gameSpeed);
    const nextSpeed = speeds[(curIdx + 1) % speeds.length];
    onSetGameSpeed(nextSpeed);
  };

  const handleCopySeed = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(state.worldSeed);
      onShowToast(`Đã sao chép mã Seed: ${state.worldSeed}`);
    }
  };

  return (
    <header className="w-full bg-[#FCFBF7] border-b-2 border-[#E9E4D4] shadow-xs select-none sticky top-0 z-40 font-sans pt-safe">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Main HUD Row: All items have STRICT EQUAL HEIGHT (h-10 on mobile, h-11 on desktop) */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 flex items-center justify-between gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar">
        
        {/* Group 1: Level, Lịch Ngày & Tiền */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Box 1: Avatar & Level */}
          <div 
            onClick={() => setShowProfileModal(true)}
            className="h-10 sm:h-11 flex items-center gap-1.5 sm:gap-2 bg-[#F3EFE0] px-2.5 sm:px-3 rounded-2xl border border-[#DFD9C3] shadow-inner shrink-0 whitespace-nowrap cursor-pointer hover:bg-white transition-all active:scale-95"
            title="Xem hồ sơ cá nhân"
          >
            <span className="text-xl sm:text-2xl animate-bounce-slight shrink-0">{profileInfo.icon}</span>
            <div className="flex flex-col justify-center leading-none">
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 font-display whitespace-nowrap">
                {profileInfo.name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono whitespace-nowrap mt-1">
                Nông dân
              </span>
            </div>
          </div>

          {/* Box 2: Ngày & Mùa — min-w cố định để nút Tua Nhanh không bị nhảy vị trí khi số ngày tăng chữ số */}
          <div className="h-10 sm:h-11 flex items-center gap-1.5 sm:gap-2 bg-[#F3EFE0] border border-[#DFD9C3] px-2.5 sm:px-3 rounded-2xl shrink-0 whitespace-nowrap min-w-[104px]">
            <span className="text-lg sm:text-xl shrink-0">{seasonInfo.icon}</span>
            <div className="flex flex-col justify-center leading-none">
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-none whitespace-nowrap">
                <span className="hidden md:inline">{seasonInfo.name} · </span>Ngày {state.currentDay}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 flex items-center gap-0.5 font-mono mt-1 leading-none whitespace-nowrap">
                <Clock size={9} className="shrink-0" /> {dayPartName} ({timeFormatted})
              </span>
            </div>
          </div>

          {/* Box 3: Tiền vàng — min-w cố định vì toLocaleString đổi độ rộng khi tiền tăng */}
          <div className="h-10 sm:h-11 flex items-center gap-1.5 bg-[#FFF9E6] border border-[#F5E6B3] px-2.5 sm:px-3 rounded-2xl shadow-inner shrink-0 whitespace-nowrap min-w-[112px]">
            <span className="text-base sm:text-xl shrink-0">💰</span>
            <span className="font-mono font-black text-xs sm:text-sm text-amber-950 tabular-nums whitespace-nowrap">
              {state.money.toLocaleString()}
            </span>
          </div>

          {/* Box 4: Thời tiết */}
          <div
            className="h-10 sm:h-11 px-2.5 sm:px-3 flex items-center justify-center gap-1 bg-[#F3EFE0] border border-[#DFD9C3] rounded-2xl shrink-0 cursor-pointer hover:bg-white active:scale-95 transition-all whitespace-nowrap"
            title={weatherInfo.desc}
          >
            <span className="text-lg sm:text-xl shrink-0">{weatherInfo.icon}</span>
            <span className="font-bold text-xs text-slate-800 hidden lg:inline whitespace-nowrap">{weatherInfo.name}</span>
          </div>
          
          {/* Box 5: Nút Tua Nhanh — bắn ở pointerdown (không rớt khi re-render),
              touch-manipulation chống double-tap-zoom nuốt tap trên iOS */}
          <button
            type="button"
            onPointerDown={() => fireFastForward('pointer')}
            onClick={() => fireFastForward('click')}
            className="h-10 sm:h-11 px-3 sm:px-4 flex items-center justify-center gap-1.5 bg-[#2E4A35] hover:bg-[#233a29] text-white border border-[#1e3022] rounded-2xl shrink-0 cursor-pointer active:scale-95 transition-all whitespace-nowrap shadow-md touch-manipulation select-none"
            title="Tua nhanh tới sáng hôm sau để hồi phục Giờ công"
          >
            <FastForward size={16} className="shrink-0" />
            <span className="font-bold text-xs hidden md:inline">Tua Nhanh</span>
          </button>
        </div>

        {/* Group 2: Cài đặt */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="h-10 sm:h-11 w-10 sm:w-11 rounded-2xl bg-[#F3EFE0] hover:bg-white border border-[#DFD9C3] text-slate-700 flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
            title="Cài đặt & Sao lưu"
          >
            <Settings size={16} />
          </button>
        </div>

      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border-2 border-[#DFD9C3] rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D2]">
              <h3 className="font-extrabold text-base text-slate-900 font-display flex items-center gap-1.5">
                <Settings size={18} className="text-amber-800" />
                <span>Cài Đặt Nông Trại</span>
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3 py-3">
              {/* Profile & Seed info */}
              <div className="p-3 bg-white rounded-2xl border border-[#DFD9C3] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Hồ sơ khởi đầu:</span>
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                    {profileInfo.icon} {profileInfo.name}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Mã Thế Giới (Seed):</span>
                  <button
                    onClick={handleCopySeed}
                    className="text-xs font-mono font-bold text-amber-900 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>{state.worldSeed}</span>
                    <Copy size={12} />
                  </button>
                </div>
              </div>

              {/* Tốc độ thời gian */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Tốc độ thời gian game:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { speed: 0, label: '⏸ Dừng' },
                    { speed: 1, label: '▶ 1x' },
                    { speed: 2, label: '⏩ 2x' },
                    { speed: 4, label: '⚡ 4x' },
                  ].map((s) => (
                    <button
                      key={s.speed}
                      onClick={() => onSetGameSpeed(s.speed)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        state.settings.gameSpeed === s.speed
                          ? 'bg-[#2E4A35] text-white shadow-xs'
                          : 'bg-white border border-[#DFD9C3] text-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Âm thanh */}
              <div className="flex items-center justify-between pt-1 border-t border-[#E8E2D2]">
                <span className="text-xs font-bold text-slate-700">Âm thanh & Hiệu ứng:</span>
                <button
                  onClick={onToggleSound}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    state.settings.soundEnabled ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {state.settings.soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  <span>{state.settings.soundEnabled ? 'Bật' : 'Tắt'}</span>
                </button>
              </div>

              {/* Khởi tạo Farm Mới */}
              <div className="pt-2 border-t border-[#E8E2D2]">
                <button
                  onClick={() => {
                    setShowSettingsModal(false);
                    onOpenNewGameModal();
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-xs active:scale-98 cursor-pointer"
                >
                  <Dices size={15} />
                  <span>Khởi Tạo Trang Trại Mới (Seed & Profile)</span>
                </button>
              </div>

              {/* Xuất / Nạp Save */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    exportSaveFile(state);
                    setShowSettingsModal(false);
                  }}
                  className="py-2 rounded-xl bg-white border border-[#DFD9C3] text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#F3EFE0] active:scale-98 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Xuất file save</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2 rounded-xl bg-white border border-[#DFD9C3] text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#F3EFE0] active:scale-98 cursor-pointer"
                >
                  <Upload size={13} />
                  <span>Nạp file save</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2 rounded-2xl bg-[#2E4A35] text-white font-bold text-xs shadow-md mt-1 cursor-pointer active:scale-98"
            >
              Đóng Cài Đặt
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border-2 border-[#DFD9C3] rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D2]">
              <h3 className="font-extrabold text-base text-slate-900 font-display flex items-center gap-2">
                <span className="text-2xl">{profileInfo.icon}</span>
                <span>Hồ Sơ Cá Nhân</span>
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4 py-4">
              <div className="text-center space-y-1">
                <div className="font-black text-xl text-slate-900">{profileInfo.name}</div>
                <div className="text-sm font-medium text-slate-600">{profileInfo.description}</div>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-[#DFD9C3] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">Điểm Uy Tín:</span>
                  <span className="text-lg font-black text-indigo-700">{state.creditScore || 500}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-600">Tài Sản Ròng Ước Tính:</span>
                  <span className="text-lg font-black text-amber-700">{totalAssets.toLocaleString()} 💰</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-[#DFD9C3]">
                <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Thống kê hoạt động</h4>
                <div className="space-y-1.5 text-sm font-medium text-slate-700">
                  <div className="flex justify-between">
                    <span>Số ngày đã chơi:</span>
                    <span className="font-bold">{state.stats.daysPlayed} ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng doanh thu:</span>
                    <span className="font-bold text-emerald-600">+{state.stats.totalEarnings.toLocaleString()} 💰</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lần thu hoạch:</span>
                    <span className="font-bold text-amber-600">{state.stats.totalHarvests} lần</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Đơn hàng / Chuyến xe:</span>
                    <span className="font-bold text-blue-600">{state.stats.totalDeliveries} chuyến</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow-md transition-all cursor-pointer active:scale-98"
            >
              Đóng Hồ Sơ
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
