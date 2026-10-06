import React, { useState } from 'react';
import { ArrowLeft, Check, Heart, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';
import { GameIcon } from './GameIcon';

interface Props {
  onBack: () => void;
}

export const LivestockScreen: React.FC<Props> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<'cows' | 'chickens' | 'sheep' | 'goats'>('cows');
  const [eveningFeedDone, setEveningFeedDone] = useState(false);
  const [cowsFed, setCowsFed] = useState<Record<string, boolean>>({});

  const cowList = [
    { id: '#CW-01', name: 'Daisy (Hoa Cúc)', breed: 'Bò sữa Holstein Friesian', output: '28.4 L/ngày', health: '100%', status: 'Đang vắt sữa' },
    { id: '#CW-02', name: 'Bella (Bé Đẹp)', breed: 'Bò sữa Jersey thuần chủng', output: '24.1 L/ngày', health: '98%', status: 'Đang nghỉ ngơi' },
    { id: '#CW-03', name: 'Rosie (Bông Hồng)', breed: 'Bò vàng Guernsey Gold', output: '26.8 L/ngày', health: '96%', status: 'Đang vắt sữa' },
    { id: '#CW-04', name: 'Molly (Bé Nâu)', breed: 'Bò sữa Ayrshire Brown', output: '25.0 L/ngày', health: '97%', status: 'Đang gặm cỏ' },
  ];

  const handleFeedEvening = () => {
    setEveningFeedDone(true);
    sound.playAnimal('cow');
  };

  const handlePetCow = (id: string) => {
    setCowsFed((prev) => ({ ...prev, [id]: true }));
    sound.playAnimal('cow');
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
            <h1 className="font-extrabold text-xl sm:text-2xl text-[#1C1C1E] leading-tight">Quản Lý Đàn Gia Súc</h1>
            <p className="text-xs text-[#76767A] font-medium">Nông Trại Thung Lũng Xanh · Khu chuồng trại 4 phân khu</p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 text-xl shadow-xs">
          <GameIcon e="🐮" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-4">
        
        {/* 1. Thẻ tổng quan đàn gia súc */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE7DD] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#1C1C1E] tracking-tight">48</span>
              <span className="text-sm font-bold text-[#76767A]">Cá thể vật nuôi</span>
            </div>
            <div className="bg-[#D1F2D9] text-[#1B6634] text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
              <Check size={14} className="stroke-[3]" />
              <span>Tất cả khỏe mạnh</span>
            </div>
          </div>

          {/* 3 Đồng hồ tròn */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#F2EFE9]">
            {/* Sức khỏe */}
            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FAF9F5]">
              <div className="relative w-14 h-14 flex items-center justify-center mb-1.5">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-600" strokeDasharray="96, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-xs font-extrabold text-slate-900 font-mono">96%</span>
              </div>
              <span className="text-xs font-bold text-slate-800">Sức khỏe đàn</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Tuyệt hảo</span>
            </div>

            {/* Thức ăn dự trữ */}
            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FAF9F5]">
              <div className="relative w-14 h-14 flex items-center justify-center mb-1.5">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-amber-500" strokeDasharray="82, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-xs font-extrabold text-slate-900 font-mono">82%</span>
              </div>
              <span className="text-xs font-bold text-slate-800">Thức ăn dự trữ</span>
              <span className="text-[11px] text-amber-800 font-semibold">Đủ cho 12 ngày</span>
            </div>

            {/* Năng suất sữa */}
            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FAF9F5]">
              <div className="relative w-14 h-14 flex items-center justify-center mb-1.5">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-sky-600" strokeDasharray="91, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-xs font-extrabold text-slate-900 font-mono">91%</span>
              </div>
              <span className="text-xs font-bold text-slate-800">Sản lượng sữa</span>
              <span className="text-[11px] text-sky-800 font-semibold">Vượt mục tiêu</span>
            </div>
          </div>
        </div>

        {/* 2. Lịch cho ăn hôm nay */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE7DD] shadow-sm">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="font-bold text-base text-[#1C1C1E]">Lịch cho ăn trong ngày</h2>
            <span className="text-xs font-bold text-[#1B6634] bg-[#D1F2D9] px-3 py-1 rounded-full">
              {eveningFeedDone ? 'Hoàn thành 3 / 3 bữa' : 'Đã hoàn thành 2 / 3 bữa'}
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
              <span className="font-mono text-xs font-extrabold text-slate-700 w-14">06:00</span>
              <div className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
              <div className="flex-1 flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-slate-800">Cỏ khô tươi & cỏ ủ men</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check size={14} /> Đã cho ăn
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
              <span className="font-mono text-xs font-extrabold text-slate-700 w-14">12:00</span>
              <div className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
              <div className="flex-1 flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-slate-800">Ngũ cốc hỗn hợp & khoáng chất</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check size={14} /> Đã cho ăn
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
              <span className="font-mono text-xs font-extrabold text-slate-700 w-14">18:00</span>
              <div className={`w-3 h-3 rounded-full ring-4 ${eveningFeedDone ? 'bg-emerald-600 ring-emerald-100' : 'bg-amber-500 ring-amber-100'}`} />
              <div className="flex-1 flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-slate-800">Bữa ăn dinh dưỡng chiều tối</span>
                {eveningFeedDone ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check size={14} /> Đã cho ăn
                  </span>
                ) : (
                  <button
                    onClick={handleFeedEvening}
                    className="px-3.5 py-1.5 rounded-xl bg-[#234230] hover:bg-[#1a3325] text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    Cho ăn ngay
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Phân loại vật nuôi */}
        <div>
          <div className="mb-2.5">
            <h2 className="font-bold text-base text-[#1C1C1E]">Phân loại đàn vật nuôi</h2>
            <p className="text-xs text-[#76767A]">Chạm vào một nhóm để kiểm tra danh sách con nuôi.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'cows', label: 'Bò sữa', count: '18 con', icon: '🐮' },
              { id: 'chickens', label: 'Đàn gà', count: '20 con', icon: '🐔' },
              { id: 'sheep', label: 'Đàn cừu', count: '6 con', icon: '🐑' },
              { id: 'goats', label: 'Đàn dê', count: '4 con', icon: '🐐' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
                className={`p-4 rounded-3xl border flex flex-col items-center transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white border-[#234230] shadow-md ring-2 ring-[#234230]/20 scale-102'
                    : 'bg-[#FAF9F5] border-[#EAE7DD] hover:bg-white'
                }`}
              >
                <span className="text-3xl mb-1.5"><GameIcon e={cat.icon} /></span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{cat.label}</span>
                <span className="text-xs text-slate-500 font-mono font-semibold mt-0.5">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Danh sách đàn bò sữa */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-[#1C1C1E]">Đàn bò sữa của bạn</h2>
              <p className="text-xs text-[#76767A]">18 con trong đàn. Chạm để vuốt ve & xem nhật ký sản lượng.</p>
            </div>
            <span className="text-xs font-bold text-[#1B6634] bg-[#D1F2D9] px-3 py-1 rounded-full">
              4 con đang vắt sữa
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cowList.map((cow) => {
              const isPetted = cowsFed[cow.id];

              return (
                <div
                  key={cow.id}
                  onClick={() => handlePetCow(cow.id)}
                  className="bg-white rounded-3xl p-4 border border-[#EAE7DD] shadow-sm flex items-center justify-between gap-3 hover:border-emerald-600 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl relative shadow-xs">
                      <GameIcon e="🐮" />
                      {isPetted && (
                        <Heart size={14} className="text-pink-500 fill-pink-500 absolute -top-1 -right-1 animate-ping" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{cow.name}</span>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-md">{cow.id}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{cow.breed}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs font-extrabold text-[#1B6634] font-mono">{cow.output}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Sparkles size={10} className="text-amber-500" />
                      {cow.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
