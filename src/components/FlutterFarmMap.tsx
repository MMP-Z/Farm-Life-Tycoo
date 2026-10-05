import React from 'react';
import { FarmZoneId } from '../types/flutterFarm';
import { Maximize2, Droplets, CheckCircle2 } from 'lucide-react';

interface Props {
  selectedZone: FarmZoneId;
  onSelectZone: (zone: FarmZoneId) => void;
  isWateringActive?: boolean;
}

export const FlutterFarmMap: React.FC<Props> = ({
  selectedZone,
  onSelectZone,
  isWateringActive = false,
}) => {
  return (
    <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[500px] bg-[#EFECE1] rounded-3xl p-3.5 border-2 border-white/90 shadow-md overflow-hidden select-none">
      
      {/* Zoom / Full Overview Button */}
      <button
        onClick={() => onSelectZone('overview')}
        className="absolute top-5 right-5 z-30 px-3 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/90 text-xs font-bold text-slate-800 hover:text-emerald-800 hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer"
        title="Xem toàn cảnh nông trại"
      >
        <Maximize2 size={13} className="stroke-[2.5]" />
        <span>Toàn cảnh</span>
      </button>

      {/* SVG Grass & Dirt Pathway Canvas */}
      <div className="w-full h-full relative rounded-2xl overflow-hidden bg-[#7EB867] border border-black/5 shadow-inner">
        
        {/* Dirt Paths Network */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
          {/* Main Horizontal Central Dirt Road */}
          <rect x="0" y="47%" width="100%" height="7%" fill="#DECA9F" />
          {/* Vertical Cross Dirt Road */}
          <rect x="47%" y="0" width="6.5%" height="100%" fill="#DECA9F" />
          {/* Path border textures */}
          <line x1="0" y1="47%" x2="100%" y2="47%" stroke="#C7B080" strokeWidth="2" strokeDasharray="6 3" />
          <line x1="0" y1="54%" x2="100%" y2="54%" stroke="#C7B080" strokeWidth="2" strokeDasharray="6 3" />
          <line x1="47%" y1="0" x2="47%" y2="100%" stroke="#C7B080" strokeWidth="2" strokeDasharray="6 3" />
          <line x1="53.5%" y1="0" x2="53.5%" y2="100%" stroke="#C7B080" strokeWidth="2" strokeDasharray="6 3" />
        </svg>

        {/* 6 Interactive Parcels / Zones */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 p-2 gap-2.5 z-10">
          
          {/* 1. TOP-LEFT: Nhà Trang Trại */}
          <div
            onClick={() => onSelectZone('farm_house')}
            className={`relative rounded-2xl p-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
              selectedZone === 'farm_house'
                ? 'ring-4 ring-white shadow-2xl scale-[1.02] z-20 bg-[#93C978]'
                : 'hover:bg-white/20'
            }`}
          >
            <div className="w-full h-full bg-[#75AC5D] rounded-xl p-2 border border-[#5A8F43] relative flex items-center justify-center overflow-hidden shadow-sm">
              {/* House Model */}
              <div className="relative flex flex-col items-center">
                <div className="w-20 h-10 bg-gradient-to-b from-[#C84B31] to-[#A3341D] rounded-t-lg shadow-md border-t border-[#E0644B] flex items-center justify-center">
                  <div className="w-5 h-2.5 bg-[#E2B714] rounded-xs shadow-xs" />
                </div>
                <div className="w-18 h-9 bg-[#F9F7EE] border border-[#D5CEBC] flex items-center justify-around px-1.5 shadow-sm">
                  <div className="w-4 h-5 bg-[#7A9E9F] rounded-t-xs border border-slate-600" />
                  <div className="w-4 h-7 bg-[#634832] rounded-t-xs" />
                  <div className="w-4 h-5 bg-[#7A9E9F] rounded-t-xs border border-slate-600" />
                </div>
              </div>

              {/* Blue Pickup Truck */}
              <div className="absolute bottom-2 right-2 flex items-center bg-[#2B5B84] px-2 py-0.5 rounded-md shadow-md border border-[#4176A3]">
                <span className="text-xs">🚙</span>
              </div>

              <div className="absolute top-2 left-2 bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                <span>🏡 Nhà Trang Trại</span>
              </div>
            </div>
          </div>

          {/* 2. TOP-RIGHT: Vườn Cà Chua */}
          <div
            onClick={() => onSelectZone('tomato_field')}
            className={`relative rounded-2xl p-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
              selectedZone === 'tomato_field'
                ? 'ring-4 ring-white shadow-2xl scale-[1.02] z-20 bg-[#93C978]'
                : 'hover:bg-white/20'
            }`}
          >
            <div className="w-full h-full bg-[#523A28] rounded-xl p-2 border border-[#3C2718] relative flex flex-col justify-around overflow-hidden shadow-inner">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex justify-around items-center px-2">
                  {[0, 1, 2, 3, 4].map((col) => (
                    <div
                      key={col}
                      className="flex items-center gap-0.5 animate-bounce-slight"
                      style={{ animationDelay: `${(row + col) * 0.15}s` }}
                    >
                      <span className="text-sm sm:text-base filter drop-shadow">🍅</span>
                    </div>
                  ))}
                </div>
              ))}

              {isWateringActive && selectedZone === 'tomato_field' && (
                <div className="absolute inset-0 bg-sky-500/30 flex items-center justify-center gap-2 animate-pulse">
                  <Droplets className="text-sky-200 animate-bounce" size={28} />
                  <span className="text-xs font-bold text-sky-100 bg-sky-950/80 px-2 py-1 rounded-lg">Đang tưới nước...</span>
                </div>
              )}

              <div className="absolute top-2 left-2 bg-rose-950/80 backdrop-blur-md text-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/40 flex items-center gap-1">
                <span>🍅 Vườn Cà Chua</span>
                <span className="text-amber-300 font-mono">· 78%</span>
              </div>
            </div>
          </div>

          {/* 3. MIDDLE-LEFT: Vườn Rau Xanh & Củ */}
          <div
            onClick={() => onSelectZone('vegetable_field')}
            className={`relative rounded-2xl p-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
              selectedZone === 'vegetable_field'
                ? 'ring-4 ring-white shadow-2xl scale-[1.02] z-20 bg-[#93C978]'
                : 'hover:bg-white/20'
            }`}
          >
            <div className="w-full h-full bg-[#463323] rounded-xl p-1.5 border border-[#342416] relative grid grid-cols-2 gap-1.5 overflow-hidden shadow-inner">
              {/* Xà lách */}
              <div className="bg-[#4D3927] rounded-lg p-1 flex flex-col justify-around items-center">
                <span className="text-sm sm:text-base">🥬</span>
                <span className="text-sm sm:text-base">🥬</span>
                <span className="text-sm sm:text-base">🥬</span>
              </div>
              {/* Cà rốt */}
              <div className="bg-[#3D2C1E] rounded-lg p-1 flex flex-col justify-around items-center">
                <span className="text-sm sm:text-base">🥕</span>
                <span className="text-sm sm:text-base">🥕</span>
                <span className="text-sm sm:text-base">🥕</span>
              </div>

              <div className="absolute top-2 left-2 bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                <span>🥬 Vườn Rau Xanh</span>
                <span className="text-amber-300 font-mono">· 80%</span>
              </div>
            </div>
          </div>

          {/* 4. MIDDLE-RIGHT: Cánh Đồng Bắp Ngô */}
          <div
            onClick={() => onSelectZone('corn_field')}
            className={`relative rounded-2xl p-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
              selectedZone === 'corn_field'
                ? 'ring-4 ring-white shadow-2xl scale-[1.02] z-20 bg-[#93C978]'
                : 'hover:bg-white/20'
            }`}
          >
            <div className="w-full h-full bg-[#4E3924] rounded-xl p-2 border border-[#372615] relative flex flex-col justify-around overflow-hidden shadow-inner">
              {[0, 1, 2].map((r) => (
                <div key={r} className="flex justify-around items-center px-2">
                  {[0, 1, 2, 3, 4].map((c) => (
                    <span key={c} className="text-base sm:text-lg filter drop-shadow">
                      🌽
                    </span>
                  ))}
                </div>
              ))}

              <div className="absolute top-2 left-2 bg-amber-950/80 backdrop-blur-md text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                <span>🌽 Cánh Đồng Bắp</span>
                <span className="text-amber-300 font-mono">· 65%</span>
              </div>
            </div>
          </div>

          {/* 5. BOTTOM-LEFT: Khu Chăn Nuôi Bò Sữa */}
          <div
            onClick={() => onSelectZone('animal_area')}
            className={`relative rounded-2xl p-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
              selectedZone === 'animal_area'
                ? 'ring-4 ring-white shadow-2xl scale-[1.02] z-20 bg-[#93C978]'
                : 'hover:bg-white/20'
            }`}
          >
            <div className="w-full h-full bg-[#71A55C] rounded-xl p-2 border-2 border-dashed border-[#D2BA8F] relative flex flex-col justify-between overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-1">
                <div className="bg-[#8C3A27] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  Chuồng Bò
                </div>
                <div className="flex gap-1.5 text-xs">
                  <span>🌾 Cỏ khô</span>
                  <span>💧 Máng nước</span>
                </div>
              </div>

              {/* Bò sữa gặm cỏ vui vẻ */}
              <div className="flex justify-around items-center my-1">
                <span className="text-xl sm:text-2xl animate-bounce-slight" style={{ animationDelay: '0.1s' }}>
                  🐮
                </span>
                <span className="text-xl sm:text-2xl animate-bounce-slight" style={{ animationDelay: '0.35s' }}>
                  🐮
                </span>
                <span className="text-xl sm:text-2xl animate-bounce-slight" style={{ animationDelay: '0.6s' }}>
                  🐮
                </span>
              </div>

              <div className="absolute top-2 left-2 bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                <span>🐮 Khu Gia Súc</span>
                <span className="text-amber-300 font-mono">· 48 con</span>
              </div>
            </div>
          </div>

          {/* 6. BOTTOM-RIGHT: Kho Thóc & Hồ Nước */}
          <div
            onClick={() => onSelectZone('storage_pond')}
            className={`relative rounded-2xl p-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
              selectedZone === 'storage_pond'
                ? 'ring-4 ring-white shadow-2xl scale-[1.02] z-20 bg-[#93C978]'
                : 'hover:bg-white/20'
            }`}
          >
            <div className="w-full h-full bg-[#6FA45B] rounded-xl p-2 border border-[#4F823B] relative flex items-center justify-between px-3 overflow-hidden shadow-inner">
              {/* Hồ nước tròn & cối xay gió */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#2C6F9E] via-[#4596D3] to-[#74BAEF] border-2 border-white/80 flex items-center justify-center relative shadow-md">
                <span className="text-xs animate-pulse">🪷</span>
                <div className="absolute -top-1 -right-1 text-sm animate-spin-slow">
                  💨
                </div>
              </div>

              {/* Tháp Silo & Bồn trữ */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-10 bg-gradient-to-r from-slate-400 to-slate-200 rounded-t-full border border-slate-500 shadow-sm flex items-center justify-center text-[9px] font-bold text-slate-800">
                  Silo
                </div>
                <div className="flex gap-1 mt-1">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-500" />
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-500" />
                </div>
              </div>

              <div className="absolute top-2 left-2 bg-sky-950/80 backdrop-blur-md text-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-500/40 flex items-center gap-1">
                <span>💧 Hồ Nước & Silo</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
