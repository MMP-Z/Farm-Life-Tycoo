import React, { useRef } from 'react';
import { FarmGameState } from '../types/farmSystem';
import { STARTING_PROFILES_CONFIG } from '../config/variabilityData';
import {
  Volume2, VolumeX, Play, Pause, FastForward, Download, Upload,
  Settings, X, Dices, Copy, Zap,
} from 'lucide-react';
import { exportSaveFile, importSaveFile } from '../utils/storageEngine';
import { sound } from '../utils/sound';
import { SpriteIcon } from './SpriteIcon';
import { FARMER_SPRITE } from '../utils/sprites';

/** Modal Cài đặt tách từ TopHeaderHUD — dùng cho HUD 3D-only. */

interface Props {
  state: FarmGameState;
  onClose: () => void;
  onSetGameSpeed: (speed: number) => void;
  onToggleSound: () => void;
  onLoadImportedState: (loaded: FarmGameState) => void;
  onShowToast: (msg: string) => void;
  onOpenNewGameModal: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  state,
  onClose,
  onSetGameSpeed,
  onToggleSound,
  onLoadImportedState,
  onShowToast,
  onOpenNewGameModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const profileInfo = STARTING_PROFILES_CONFIG[state.startingProfileId] || STARTING_PROFILES_CONFIG.hardworking_farmer;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importSaveFile(file);
      onLoadImportedState(imported);
      onShowToast('Nạp file save thành công! Chào mừng trở lại nông trại.');
      sound.playPop();
      onClose();
    } catch (err) {
      onShowToast('Lỗi nạp file save! Vui lòng kiểm tra lại file JSON.');
    }
  };

  const handleCopySeed = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(state.worldSeed);
      onShowToast(`Đã sao chép mã Seed: ${state.worldSeed}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <div className="px-panel p-5 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D2]">
          <h3 className="font-extrabold text-base text-slate-900 font-display flex items-center gap-1.5">
            <Settings size={18} className="text-amber-800" />
            <span>Cài Đặt Nông Trại</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer border-2 border-transparent hover:border-[#3a2b3f]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3 py-3">
          <div className="p-3 px-panel-inset rounded-md space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Hồ sơ khởi đầu:</span>
              <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                <SpriteIcon src={FARMER_SPRITE} alt={profileInfo.name} size={18} /> {profileInfo.name}
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

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Tốc độ thời gian game:</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { speed: 0, label: 'Dừng', icon: 'pause' },
                { speed: 1, label: '1x', icon: 'play' },
                { speed: 2, label: '2x', icon: 'ff' },
                { speed: 4, label: '4x', icon: 'zap' },
              ].map((s) => (
                <button
                  key={s.speed}
                  onClick={() => onSetGameSpeed(s.speed)}
                  className={`py-2 px-1 rounded-md text-xs font-bold transition-all cursor-pointer border-2 min-w-0 flex items-center justify-center gap-1 ${
                    state.settings.gameSpeed === s.speed
                      ? 'bg-[#2E4A35] text-white border-[#3a2b3f]'
                      : 'bg-white border-[#3a2b3f] text-slate-700'
                  }`}
                >
                  {s.icon === 'pause' && <Pause size={12} />}
                  {s.icon === 'play' && <Play size={12} />}
                  {s.icon === 'ff' && <FastForward size={12} />}
                  {s.icon === 'zap' && <Zap size={12} />}
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#E8E2D2]">
            <span className="text-xs font-bold text-slate-700">Âm thanh & Hiệu ứng:</span>
            <button
              onClick={onToggleSound}
              className={`px-3 py-1.5 px-btn text-xs font-bold flex items-center gap-1.5 ${
                state.settings.soundEnabled ? 'px-btn-green' : 'px-btn-slate'
              }`}
            >
              {state.settings.soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{state.settings.soundEnabled ? 'Bật' : 'Tắt'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#E8E2D2]">
            <button
              onClick={() => {
                onClose();
                onOpenNewGameModal();
              }}
              className="w-full py-2.5 px-btn px-btn-amber text-xs font-black flex items-center justify-center gap-2"
            >
              <Dices size={15} />
              <span>Khởi Tạo Trang Trại Mới (Seed & Profile)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                exportSaveFile(state);
                onClose();
              }}
              className="py-2 px-btn px-btn-slate text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Download size={13} />
              <span>Xuất file save</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-btn px-btn-slate text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Upload size={13} />
              <span>Nạp file save</span>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 px-btn px-btn-green font-bold text-xs mt-1"
        >
          Đóng Cài Đặt
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
