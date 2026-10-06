import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight } from 'lucide-react';

interface Props {
  currentDay: number;
  currentSeason: string;
  weather: string;
  hasPest: boolean;
  hasDryPlots: boolean;
  readyHarvestCount: number;
  readyAnimalProduce: boolean;
}

export const NPCGuide: React.FC<Props> = ({
  currentDay,
  currentSeason,
  weather,
  hasPest,
  hasDryPlots,
  readyHarvestCount,
  readyAnimalProduce,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Dynamic advice from Uncle Ba
  let advice = 'Chào cháu! Chúc cháu một ngày canh tác vui vẻ và bội thu mùa màng!';

  if (hasPest) {
    advice = '⚠️ Có ô đất xuất hiện sâu cắn lá rồi cháu ơi! Vào Khu Trồng Trọt xịt thuốc ngay nhé!';
  } else if (readyHarvestCount > 0) {
    advice = `🌾 Có ${readyHarvestCount} ô hoa màu đã chín vàng trĩu hạt rồi! Mau vào thu hoạch kẻo phí nhé!`;
  } else if (hasDryPlots && weather !== 'rainy') {
    advice = '💧 Đất đang bị khô hạn thiếu nước, nhớ tưới nước thường xuyên để cây lớn nhanh nhé!';
  } else if (readyAnimalProduce) {
    advice = '🥚 Đàn vật nuôi đã cho trứng và sữa rồi đấy, vào chuồng trại thu gom nào!';
  } else if (weather === 'rainy') {
    advice = '🌧️ Trời đang mưa rào mát mẻ, toàn bộ đất đai được tưới tự động không tốn giọt nước nào!';
  } else if (currentSeason === 'spring') {
    advice = '🌸 Mùa Xuân ấm áp là thời điểm vàng để gieo trồng Dâu Tây và Lúa Mì!';
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#FFF9E6] border-2 border-amber-300 text-amber-950 p-2.5 sm:p-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer select-none"
        title="Bác Ba Nông Dân khuyên nhủ"
      >
        <span className="text-xl sm:text-2xl animate-bounce-slight">👨‍🌾</span>
        <span className="text-xs font-bold font-display hidden sm:inline">Lời khuyên Bác Ba</span>
      </button>
    );
  }

  return (
    <div className="w-[calc(100vw-1.5rem)] max-w-sm sm:w-80 bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-3.5 border-2 border-amber-300 shadow-xl select-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shrink-0 shadow-inner">
          👨‍🌾
        </div>
        <div className="flex-1 pr-2">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-slate-900 font-display">Bác Ba Nông Dân</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{advice}</p>
        </div>
      </div>
    </div>
  );
};
