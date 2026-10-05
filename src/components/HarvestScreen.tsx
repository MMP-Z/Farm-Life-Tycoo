import React from 'react';
import { Package, Calendar, Clock, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

export const HarvestScreen: React.FC = () => {
  const handleInstantHarvest = (cropName: string) => {
    sound.playHarvest();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7F5EE] overflow-y-auto pb-6 select-none font-sans animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="px-5 sm:px-8 pt-4 pb-3 border-b border-[#EAE6DA] bg-white/70 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-xl sm:text-2xl text-[#1C1C1E] leading-tight">Kho Nông Sản & Lịch Vụ Mùa</h1>
          <p className="text-xs text-[#76767A] font-medium">Quản lý kho Silo & theo dõi ngày thu hoạch dự kiến</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 text-xl shadow-xs">
          🧺
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-4">
        
        {/* Thẻ lưu trữ Silo */}
        <div className="bg-white rounded-3xl p-6 border border-[#EAE7DD] shadow-sm">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="font-bold text-base text-slate-900">Sức Chứa Tháp Trữ Silo Hiện Tại</h2>
            <span className="text-xs font-mono font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              480 / 600 kg (Đạt 80%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-5">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: '80%' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: 'Cà Chua Roma', amount: '180 kg', price: '$2.80 / kg', icon: '🍅' },
              { name: 'Rau Xanh & Củ', amount: '120 kg', price: '$3.20 / kg', icon: '🥬' },
              { name: 'Bắp Ngô Vàng', amount: '110 kg', price: '$1.95 / kg', icon: '🌽' },
              { name: 'Sữa Bò Tươi', amount: '70 L', price: '$4.10 / L', icon: '🥛' },
            ].map((item) => (
              <div key={item.name} className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#F2EFE9] flex items-center gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                  <p className="text-xs font-mono text-[#1B6634] font-extrabold mt-0.5">{item.amount}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lịch thu hoạch sắp tới */}
        <div className="bg-white rounded-3xl p-6 border border-[#EAE7DD] shadow-sm">
          <h2 className="font-bold text-base text-slate-900 mb-4">Lịch Thu Hoạch Các Vụ Mùa Sắp Tới</h2>
          
          <div className="flex flex-col gap-3">
            {[
              { crop: 'Vườn Rau Xanh Hỗn Hợp', parcel: 'Thửa A-1', daysLeft: 'Còn 4 ngày', icon: '🥬', progress: 80 },
              { crop: 'Vườn Cà Chua Roma Quả Mọng', parcel: 'Thửa B-2', daysLeft: 'Còn 12 ngày', icon: '🍅', progress: 78 },
              { crop: 'Cánh Đồng Bắp Ngô Vàng', parcel: 'Thửa C-3', daysLeft: 'Còn 18 ngày', icon: '🌽', progress: 65 },
            ].map((c) => (
              <div key={c.crop} className="p-4 rounded-2xl border border-[#EAE7DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{c.crop}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{c.parcel} · Đã sinh trưởng {c.progress}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-mono">
                    {c.daysLeft}
                  </span>
                  <button
                    onClick={() => handleInstantHarvest(c.crop)}
                    className="py-1.5 px-3 rounded-xl bg-[#234230] hover:bg-[#1a3325] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    Thu hoạch nhanh →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
