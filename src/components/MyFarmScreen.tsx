import React, { useState } from 'react';
import { FarmZoneId } from '../types/flutterFarm';
import { FlutterFarmMap } from './FlutterFarmMap';
import { MapPin, Sun, Droplets, Heart, Check, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface Props {
  selectedZone: FarmZoneId;
  onSelectZone: (zone: FarmZoneId) => void;
  onOpenLivestock: () => void;
  onOpenCropDetail: (cropName: string) => void;
}

export const MyFarmScreen: React.FC<Props> = ({
  selectedZone,
  onSelectZone,
  onOpenLivestock,
  onOpenCropDetail,
}) => {
  const [isWatering, setIsWatering] = useState(false);
  const [soilMoisture, setSoilMoisture] = useState(72);
  const [toastText, setToastText] = useState<string | null>(null);

  const filterTabs: { id: FarmZoneId; label: string }[] = [
    { id: 'overview', label: 'Toàn Cảnh' },
    { id: 'farm_house', label: 'Nhà Trang Trại' },
    { id: 'tomato_field', label: 'Vườn Cà Chua' },
    { id: 'vegetable_field', label: 'Vườn Rau Xanh' },
    { id: 'corn_field', label: 'Cánh Đồng Bắp' },
    { id: 'animal_area', label: 'Khu Gia Súc' },
    { id: 'storage_pond', label: 'Kho & Hồ Nước' },
  ];

  const handleWater = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWatering(true);
    setSoilMoisture((prev) => Math.min(95, prev + 12));
    sound.playWater();
    setToastText('Đã tưới nước! Độ ẩm đất tăng lên 84%.');
    setTimeout(() => {
      setIsWatering(false);
      setToastText(null);
    }, 2500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7F5EE] overflow-y-auto pb-6 select-none font-sans">
      
      {/* Toast Notification */}
      {toastText && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#1C1C1E] text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in duration-200">
          <Droplets size={15} className="text-sky-400" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Screen Header Bar */}
      <div className="px-5 sm:px-8 pt-4 pb-3 flex items-center justify-between border-b border-[#EAE6DA] bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-[#1C1C1E] tracking-tight">Nông Trại Của Tôi</h1>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#76767A] font-medium mt-0.5">
            <MapPin size={13} className="text-emerald-700 stroke-[2.5]" />
            <span>Nông Trại Thung Lũng Xanh · Quy mô 12.5 ha</span>
          </div>
        </div>

        {/* Weather Indicator Badge */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-[#E5E0D2] shadow-sm">
          <Sun size={20} className="text-amber-500 animate-spin-slow stroke-[2.2]" />
          <div className="text-left hidden xs:block">
            <span className="text-xs font-bold text-slate-800 block leading-tight">24°C Nắng Đẹp</span>
            <span className="text-[10px] text-emerald-700 font-semibold">Thời tiết lý tưởng</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 flex flex-col gap-4">
        
        {/* Horizontal Scrolling Filter Pill Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map((tab) => {
            const isActive = selectedZone === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onSelectZone(tab.id);
                  sound.playClick();
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-[#234230] text-white shadow-md ring-2 ring-[#234230]/20 scale-102'
                    : 'bg-white text-[#3A3A3C] border border-[#E5E2D9] hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Central 2D Illustrated Farm Map Card */}
        <FlutterFarmMap
          selectedZone={selectedZone}
          onSelectZone={(z) => {
            onSelectZone(z);
            sound.playPop();
          }}
          isWateringActive={isWatering}
        />

        {/* Dynamic Sliding Bottom Cards */}
        <div className="mt-1">
          
          {/* State A: Overview / Toàn cảnh */}
          {selectedZone === 'overview' && (
            <div className="bg-[#EAF2EC] rounded-3xl p-5 border border-[#D5E7D8] shadow-sm flex items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-800 text-2xl shadow-sm">
                  👆
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#1C1C1E] leading-tight">Chạm vào một khu vực để khám phá</h3>
                  <p className="text-xs text-[#4A7553] font-medium mt-0.5">7 phân khu canh tác · 4 loại nông sản chính · 48 vật nuôi</p>
                </div>
              </div>

              <span className="hidden sm:inline-block text-xs font-bold text-[#234230] bg-white px-3 py-1.5 rounded-full border border-emerald-200">
                Trang trại đang hoạt động 100%
              </span>
            </div>
          )}

          {/* State B: Vườn Cà Chua */}
          {selectedZone === 'tomato_field' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE7DD] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-3xl shadow-inner">
                    🍅
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#1C1C1E] leading-tight">Vườn Cà Chua Roma</h3>
                    <p className="text-xs text-[#76767A] font-medium">Cây trồng: Cà chua quả mọng hữu cơ</p>
                  </div>
                </div>

                <div className="bg-[#D1F2D9] text-[#1B6634] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                  <Heart size={12} className="fill-[#1B6634]" />
                  <span>Tuyệt hảo</span>
                </div>
              </div>

              {/* Tiến độ sinh trưởng: 10 vạch phân đoạn */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-800">Tiến độ sinh trưởng</span>
                  <span className="text-[#1B6634] font-mono font-extrabold text-sm">78%</span>
                </div>
                <div className="grid grid-cols-10 gap-1.5 sm:gap-2 h-3">
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

              {/* Số liệu 3 cột */}
              <div className="grid grid-cols-3 gap-2 py-3.5 border-t border-b border-[#F2EFE9] text-center mb-4">
                <div className="p-2 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Sức khỏe cây</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1C1C1E] mt-0.5 block">Tuyệt hảo</span>
                </div>
                <div className="p-2 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Độ ẩm đất</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1C1C1E] mt-0.5 block font-mono">{soilMoisture}%</span>
                </div>
                <div className="p-2 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Dự kiến thu hoạch</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1B6634] mt-0.5 block font-mono">12 ngày</span>
                </div>
              </div>

              {/* Nút thao tác */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleWater}
                  className="py-3 px-5 rounded-full bg-white hover:bg-slate-50 border border-[#D5D2C8] text-[#1C1C1E] font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Droplets size={16} className="text-sky-500 fill-sky-500" />
                  <span>Tưới Nước</span>
                </button>

                <button
                  onClick={() => onOpenCropDetail('Vườn Cà Chua')}
                  className="flex-1 py-3 px-6 rounded-full bg-[#234230] hover:bg-[#1a3325] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Xem Chi Tiết Cây Trồng</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* State C: Khu Gia Súc */}
          {selectedZone === 'animal_area' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE7DD] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl shadow-inner">
                    🐮
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#1C1C1E] leading-tight">Khu Chăn Nuôi Gia Súc</h3>
                    <p className="text-xs text-[#76767A] font-medium">Đàn bò sữa thuần chủng & đồng cỏ chăn thả</p>
                  </div>
                </div>

                <div className="bg-[#D1F2D9] text-[#1B6634] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                  <Check size={13} className="stroke-[3]" />
                  <span>Khỏe mạnh</span>
                </div>
              </div>

              {/* 3 khối thông số */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#F2EFE9] text-center">
                  <span className="text-[11px] text-[#76767A] block font-medium">Tổng vật nuôi</span>
                  <span className="text-lg sm:text-xl font-extrabold text-[#1C1C1E] mt-0.5 block font-mono">48 con</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#F2EFE9] text-center">
                  <span className="text-[11px] text-[#76767A] block font-medium">Chỉ số sức khỏe</span>
                  <span className="text-lg sm:text-xl font-extrabold text-[#1B6634] mt-0.5 block font-mono">96%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#F2EFE9] text-center">
                  <span className="text-[11px] text-[#76767A] block font-medium">Bữa ăn tiếp theo</span>
                  <span className="text-lg sm:text-xl font-extrabold text-[#1C1C1E] mt-0.5 block font-mono">18:00</span>
                </div>
              </div>

              {/* Nút xem chi tiết đàn gia súc */}
              <button
                onClick={onOpenLivestock}
                className="w-full py-3.5 px-6 rounded-full bg-[#234230] hover:bg-[#1a3325] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all active:scale-98 cursor-pointer"
              >
                <span>Xem Quản Lý Đàn Gia Súc</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* State D: Vườn Rau Xanh */}
          {selectedZone === 'vegetable_field' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE7DD] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl shadow-inner">
                    🥬
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#1C1C1E] leading-tight">Vườn Rau Xanh Hỗn Hợp</h3>
                    <p className="text-xs text-[#76767A] font-medium">Cây trồng: Xà lách xoăn + Cà rốt ngọt</p>
                  </div>
                </div>

                <div className="bg-[#D1F2D9] text-[#1B6634] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                  <Heart size={12} className="fill-[#1B6634]" />
                  <span>Tuyệt hảo</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-800">Tiến độ sinh trưởng</span>
                  <span className="text-[#1B6634] font-mono font-extrabold text-sm">80%</span>
                </div>
                <div className="grid grid-cols-10 gap-1.5 sm:gap-2 h-3">
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

              <div className="grid grid-cols-3 gap-2 py-3.5 border-t border-b border-[#F2EFE9] text-center mb-4">
                <div className="p-2 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Sức khỏe cây</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1C1C1E] mt-0.5 block">Tuyệt hảo</span>
                </div>
                <div className="p-2 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Độ ẩm đất</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1C1C1E] mt-0.5 block font-mono">68%</span>
                </div>
                <div className="p-2 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Dự kiến thu hoạch</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1B6634] mt-0.5 block font-mono">4 ngày</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleWater}
                  className="py-3 px-5 rounded-full bg-white hover:bg-slate-50 border border-[#D5D2C8] text-[#1C1C1E] font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Droplets size={16} className="text-sky-500 fill-sky-500" />
                  <span>Tưới Nước</span>
                </button>

                <button
                  onClick={() => onOpenCropDetail('Vườn Rau Xanh')}
                  className="flex-1 py-3 px-6 rounded-full bg-[#234230] hover:bg-[#1a3325] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Xem Chi Tiết Cây Trồng</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* State E: Cánh Đồng Bắp */}
          {selectedZone === 'corn_field' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE7DD] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-inner">
                    🌽
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#1C1C1E] leading-tight">Cánh Đồng Bắp Ngô Vàng</h3>
                    <p className="text-xs text-[#76767A] font-medium">Cây trồng: Bắp ngọt xuất khẩu</p>
                  </div>
                </div>

                <div className="bg-[#D1F2D9] text-[#1B6634] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                  <Heart size={12} className="fill-[#1B6634]" />
                  <span>Khỏe mạnh</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-800">Tiến độ sinh trưởng</span>
                  <span className="text-amber-700 font-mono font-extrabold text-sm">65%</span>
                </div>
                <div className="grid grid-cols-10 gap-1.5 sm:gap-2 h-3">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-full transition-all ${
                        i < 6 ? 'bg-amber-600' : 'bg-[#E3DFD5]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3.5 border-t border-b border-[#F2EFE9] text-center mb-4">
                <div className="p-2 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Sức khỏe cây</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1C1C1E] mt-0.5 block">Tốt</span>
                </div>
                <div className="p-2 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Độ ẩm đất</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1C1C1E] mt-0.5 block font-mono">75%</span>
                </div>
                <div className="p-2 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Dự kiến thu hoạch</span>
                  <span className="text-xs sm:text-sm font-extrabold text-amber-700 mt-0.5 block font-mono">18 ngày</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleWater}
                  className="py-3 px-5 rounded-full bg-white hover:bg-slate-50 border border-[#D5D2C8] text-[#1C1C1E] font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Droplets size={16} className="text-sky-500 fill-sky-500" />
                  <span>Tưới Nước</span>
                </button>

                <button
                  onClick={() => onOpenCropDetail('Cánh Đồng Bắp')}
                  className="flex-1 py-3 px-6 rounded-full bg-[#234230] hover:bg-[#1a3325] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Xem Chi Tiết Cây Trồng</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* State F: Nhà Trang Trại */}
          {selectedZone === 'farm_house' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE7DD] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-inner">
                    🏡
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#1C1C1E] leading-tight">Nhà Trang Trại & Trung Tâm Điều Hành</h3>
                    <p className="text-xs text-[#76767A] font-medium">Nơi ở của chủ trang trại · Quản lý toàn bộ 12.5 ha</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  Đang hoạt động
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 py-3.5 border-t border-b border-[#F2EFE9] text-center mb-4">
                <div className="p-2.5 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Chủ trang trại</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1C1C1E] mt-0.5 block">Edward Miller</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Doanh thu tháng</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1B6634] mt-0.5 block font-mono">$24,850</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Nhiệm vụ nông trại</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1C1C1E] mt-0.5 block font-mono">5/5 Hoàn thành</span>
                </div>
              </div>

              <button
                onClick={() => onSelectZone('overview')}
                className="w-full py-3 px-6 rounded-full bg-[#234230] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Quay Lại Toàn Cảnh</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* State G: Kho Thóc & Hồ Nước */}
          {selectedZone === 'storage_pond' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE7DD] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-3xl shadow-inner">
                    💧
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#1C1C1E] leading-tight">Hồ Nước Thủy Lợi & Tháp Silo</h3>
                    <p className="text-xs text-[#76767A] font-medium">Hệ thống tưới tự động & lưu trữ ngũ cốc</p>
                  </div>
                </div>
                <span className="bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full font-mono">
                  92% Nước Đầy
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 py-3.5 border-t border-b border-[#F2EFE9] text-center mb-4">
                <div className="p-2.5 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Dung tích hồ chứa</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1C1C1E] mt-0.5 block font-mono">92%</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Kho trữ Silo</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1B6634] mt-0.5 block font-mono">480/600 kg</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#FAF9F5]">
                  <span className="text-[11px] text-[#76767A] block font-medium">Cối xay gió</span>
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-700 mt-0.5 block">Đang hoạt động</span>
                </div>
              </div>

              <button
                onClick={() => onSelectZone('overview')}
                className="w-full py-3 px-6 rounded-full bg-[#234230] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Quay Lại Toàn Cảnh</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
