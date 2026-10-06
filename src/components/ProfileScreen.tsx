import React from 'react';
import { Award, ShieldCheck, MapPin, Settings, Volume2, VolumeX, Smartphone, Check, Palette } from 'lucide-react';

interface Props {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ soundEnabled, onToggleSound }) => {
  return (
    <div className="flex-1 flex flex-col bg-[#F7F5EE] overflow-y-auto pb-6 select-none font-sans animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="px-5 sm:px-8 pt-4 pb-3 border-b border-[#EAE6DA] bg-white/70 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-xl sm:text-2xl text-[#1C1C1E] leading-tight">Hồ Sơ Nông Trại</h1>
          <p className="text-xs text-[#76767A] font-medium">Thông tin sở hữu trang trại & thiết lập hệ thống</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800 text-xl shadow-xs">
          👨‍🌾
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-4">
        
        {/* Thẻ chủ trang trại */}
        <div className="bg-white rounded-3xl p-6 border border-[#EAE7DD] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-md shrink-0">
            👨‍🌾
          </div>
          <div className="flex-1">
            <h2 className="font-extrabold text-xl text-slate-900 leading-tight">Edward Miller</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin size={13} className="text-emerald-700" />
              Nông Trại Thung Lũng Xanh · Thung Lũng Nông Nghiệp Hữu Cơ
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs font-bold bg-[#D1F2D9] text-[#1B6634] px-3 py-1 rounded-full flex items-center gap-1">
                <Check size={12} className="stroke-[3]" />
                Nông Dân Bậc Thầy
              </span>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-mono">
                Cấp Độ 12
              </span>
              <span className="text-xs font-bold bg-sky-100 text-sky-900 px-3 py-1 rounded-full font-mono">
                12.5 Hécta Canh Tác
              </span>
            </div>
          </div>
        </div>

        {/* Các chứng chỉ nông nghiệp xanh */}
        <div className="bg-white rounded-3xl p-6 border border-[#EAE7DD] shadow-sm">
          <h3 className="font-bold text-base text-slate-900 mb-3.5">Chứng Nhận Nông Nghiệp Xanh</h3>
          <div className="flex flex-col gap-2.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#F2EFE9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-700" size={22} />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Chứng nhận Hữu Cơ Quốc Tế (USDA Organic)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">100% không thuốc trừ sâu hóa học và không biến đổi gen</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Đã kiểm định
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#F2EFE9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="text-sky-700" size={22} />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Tiêu chuẩn Thủy Lợi Sinh Thái Eco-Irrigation</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Tiết kiệm 32% nguồn nước ngầm & sử dụng bơm năng lượng mặt trời</p>
                </div>
              </div>
              <span className="text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full">
                Hiệu lực cao
              </span>
            </div>
          </div>
        </div>

        {/* Cài đặt âm thanh & giao diện */}
        <div className="bg-white rounded-3xl p-6 border border-[#EAE7DD] shadow-sm">
          <h3 className="font-bold text-base text-slate-900 mb-3.5">Tùy Chọn Trải Nghiệm</h3>
          
          <div className="flex items-center justify-between py-3 border-b border-slate-100 text-xs sm:text-sm">
            <span className="flex items-center gap-2 text-slate-800 font-medium">
              {soundEnabled ? <Volume2 size={18} className="text-emerald-700" /> : <VolumeX size={18} className="text-slate-400" />}
              Hiệu ứng âm thanh chân thực (Web Audio)
            </span>
            <button
              onClick={onToggleSound}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                soundEnabled ? 'bg-[#234230] text-white shadow-xs' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {soundEnabled ? 'Đang Bật' : 'Đang Tắt'}
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-100 text-xs sm:text-sm">
            <span className="flex items-center gap-2 text-slate-800 font-medium">
              <Smartphone size={18} className="text-emerald-700" />
              Phiên bản ứng dụng web
            </span>
            <span className="font-mono text-slate-500 font-semibold">Bản chuẩn Web 2026</span>
          </div>

          <div className="flex items-center justify-between py-3 text-xs sm:text-sm">
            <span className="flex items-center gap-2 text-slate-800 font-medium">
              <Palette size={18} className="text-emerald-700" />
              Họa tiết pixel-art
            </span>
            <span className="text-slate-500 font-semibold text-right">
              Sprout Lands — <a href="https://cupnooble.itch.io/sprout-lands-asset-pack" target="_blank" rel="noreferrer" className="text-emerald-700 underline">Cup Nooble</a>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
