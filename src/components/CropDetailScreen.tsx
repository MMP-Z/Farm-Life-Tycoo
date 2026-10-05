import React, { useState } from 'react';
import { ArrowLeft, Droplets, Sparkles, Check, Thermometer, Calendar } from 'lucide-react';
import { sound } from '../utils/sound';

interface Props {
  onBack: () => void;
  cropName?: string;
}

export const CropDetailScreen: React.FC<Props> = ({ onBack, cropName = 'Vườn Cà Chua' }) => {
  const [moisture, setMoisture] = useState(72);
  const [isWatered, setIsWatered] = useState(false);
  const [isFertilized, setIsFertilized] = useState(false);

  const handleWater = () => {
    setIsWatered(true);
    setMoisture((prev) => Math.min(95, prev + 15));
    sound.playWater();
  };

  const handleFertilize = () => {
    setIsFertilized(true);
    sound.playPop();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7F5EE] overflow-y-auto pb-6 select-none font-sans animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="px-5 sm:px-8 pt-4 pb-3 flex items-center justify-between border-b border-[#EAE6DA] bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200/90 flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Quay lại nông trại"
          >
            <ArrowLeft size={18} className="stroke-[2.5]" />
          </button>
          <div>
            <h1 className="font-extrabold text-xl sm:text-2xl text-[#1C1C1E] leading-tight">{cropName}</h1>
            <p className="text-xs text-[#76767A] font-medium">Nông Trại Thung Lũng Xanh · Thửa đất B-2</p>
          </div>
        </div>

        <div className="bg-[#D1F2D9] text-[#1B6634] text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
          <Check size={13} className="stroke-[3]" />
          <span>Tuyệt hảo</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-4">
        
        {/* Thẻ minh họa cây trồng */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE7DD] shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-5xl shadow-inner mb-3">
            🍅
          </div>
          <h2 className="font-extrabold text-xl text-slate-900">Cà Chua Quả Mọng Roma Hữu Cơ</h2>
          <p className="text-xs text-slate-500 mt-1">Gieo trồng ngày 14 tháng 3 · Đạt chuẩn Organic không biến đổi gen</p>

          {/* 10 vạch sinh trưởng */}
          <div className="w-full max-w-lg mt-5">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-800">Tiến độ sinh trưởng</span>
              <span className="text-[#1B6634] font-mono text-sm font-extrabold">78%</span>
            </div>
            <div className="grid grid-cols-10 gap-2 h-3.5">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    i < 8 ? 'bg-[#234230]' : 'bg-[#E3DFD5]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Các chỉ số cảm biến vi khí hậu */}
        <div className="bg-white rounded-3xl p-6 border border-[#EAE7DD] shadow-sm">
          <h3 className="font-bold text-base text-slate-900 mb-3.5">Thông Số Thổ Nhưỡng & Vi Khí Hậu</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#F2EFE9] flex flex-col items-center">
              <Droplets className="text-sky-500 mb-1.5" size={22} />
              <span className="text-xs text-slate-500 font-medium">Độ ẩm của đất</span>
              <span className="font-mono font-extrabold text-base text-slate-900 mt-0.5">{moisture}%</span>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded-full">Tối ưu</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#F2EFE9] flex flex-col items-center">
              <Thermometer className="text-amber-500 mb-1.5" size={22} />
              <span className="text-xs text-slate-500 font-medium">Nhiệt độ môi trường</span>
              <span className="font-mono font-extrabold text-base text-slate-900 mt-0.5">24.5°C</span>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded-full">Ôn hòa</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#F2EFE9] flex flex-col items-center">
              <Calendar className="text-emerald-500 mb-1.5" size={22} />
              <span className="text-xs text-slate-500 font-medium">Thời gian thu hoạch</span>
              <span className="font-mono font-extrabold text-base text-slate-900 mt-0.5">12 ngày</span>
              <span className="text-[10px] text-sky-700 font-bold mt-1 bg-sky-50 px-2 py-0.5 rounded-full">Đúng lịch</span>
            </div>

          </div>
        </div>

        {/* Nút thao tác chăm sóc */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleWater}
            className={`py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer ${
              isWatered
                ? 'bg-sky-100 text-sky-800 border border-sky-300'
                : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300'
            }`}
          >
            <Droplets size={18} className="text-sky-500 fill-sky-500" />
            <span>{isWatered ? 'Đã Tưới Đẫm Nước (+15%)' : 'Tưới Nước Cho Đất'}</span>
          </button>

          <button
            onClick={handleFertilize}
            className={`py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
              isFertilized
                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                : 'bg-[#234230] hover:bg-[#1a3325] text-white shadow-emerald-950/20'
            }`}
          >
            <Sparkles size={18} className="text-amber-300" />
            <span>{isFertilized ? 'Đã Bón Phân Dinh Dưỡng' : 'Bón Phân Hữu Cơ'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
