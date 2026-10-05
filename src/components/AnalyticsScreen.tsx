import React from 'react';
import { ArrowUpRight, TrendingUp, Droplets, Sun, Award } from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#F7F5EE] overflow-y-auto pb-6 select-none font-sans animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="px-5 sm:px-8 pt-4 pb-3 border-b border-[#EAE6DA] bg-white/70 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-xl sm:text-2xl text-[#1C1C1E] leading-tight">Phân Tích & Báo Cáo Năng Suất</h1>
          <p className="text-xs text-[#76767A] font-medium">Hiệu suất vận hành Nông Trại Thung Lũng Xanh</p>
        </div>
        <div className="bg-[#D1F2D9] text-[#1B6634] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-xs">
          <TrendingUp size={14} />
          <span>Tăng trưởng +14.2%</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-4">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="bg-white p-5 rounded-3xl border border-[#EAE7DD] shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng Sản Lượng Thu Hoạch</span>
            <div className="flex items-baseline gap-1.5 my-1.5">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">14,820</span>
              <span className="text-sm text-slate-500 font-medium">kg nông sản</span>
            </div>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <ArrowUpRight size={14} /> +8.5% so với tháng trước
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#EAE7DD] shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doanh Thu Ước Tính</span>
            <div className="flex items-baseline gap-1.5 my-1.5">
              <span className="text-3xl font-extrabold text-[#1B6634] font-mono">$24,850</span>
              <span className="text-sm text-slate-500 font-medium">USD</span>
            </div>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <ArrowUpRight size={14} /> +12.4% biên lợi nhuận ròng
            </span>
          </div>
        </div>

        {/* Harvest Yield Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-[#EAE7DD] shadow-sm">
          <h3 className="font-bold text-base text-slate-900 mb-4">Sản Lượng Từng Loại Nông Sản</h3>
          <div className="flex flex-col gap-3.5">
            {[
              { name: 'Cà Chua Roma Quả Mọng', yield: '5,420 kg', percent: 85, color: 'bg-rose-500', icon: '🍅' },
              { name: 'Rau Xà Lách Xoăn & Cà Rốt', yield: '4,100 kg', percent: 70, color: 'bg-emerald-500', icon: '🥬' },
              { name: 'Bắp Ngô Vàng Ngọt', yield: '3,800 kg', percent: 62, color: 'bg-amber-500', icon: '🌽' },
              { name: 'Sữa Bò Tươi Nguyên Chất', yield: '1,500 L', percent: 92, color: 'bg-sky-500', icon: '🥛' },
            ].map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span className="flex items-center gap-2 text-slate-800">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">{item.yield}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Efficiency */}
        <div className="bg-white p-6 rounded-3xl border border-[#EAE7DD] shadow-sm">
          <h3 className="font-bold text-base text-slate-900 mb-4">Chỉ Số Tài Nguyên & Sinh Thái</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#F2EFE9] flex flex-col items-center">
              <Droplets className="text-sky-500 mb-1.5" size={20} />
              <span className="text-xs text-slate-500 font-medium">Tiết kiệm nước</span>
              <span className="font-extrabold font-mono text-base text-slate-900 mt-0.5">32%</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#F2EFE9] flex flex-col items-center">
              <Sun className="text-amber-500 mb-1.5" size={20} />
              <span className="text-xs text-slate-500 font-medium">Điện mặt trời</span>
              <span className="font-extrabold font-mono text-base text-slate-900 mt-0.5">84%</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#F2EFE9] flex flex-col items-center">
              <Award className="text-emerald-500 mb-1.5" size={20} />
              <span className="text-xs text-slate-500 font-medium">Độ màu mỡ đất</span>
              <span className="font-extrabold font-mono text-base text-emerald-700 mt-0.5">9.4/10</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
