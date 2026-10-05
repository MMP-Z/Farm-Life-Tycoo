import React from 'react';
import { DynamicFarmEvent, DynamicFarmEventChoice } from '../types/farmSystem';
import { Sparkles } from 'lucide-react';

interface Props {
  event: DynamicFarmEvent;
  onChoose: (choice: DynamicFarmEventChoice) => void;
}

export const EventModal: React.FC<Props> = ({ event, onChoose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#FAF8F2] to-[#F2EFE9] border-2 border-amber-300 rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 text-center">
        
        {/* Glow ambient background */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Character Icon Avatar */}
        <div className="relative inline-flex items-center justify-center mb-3">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 border-2 border-amber-300 shadow-md flex items-center justify-center text-4xl animate-bounce-slight">
            {event.icon}
          </div>
          <Sparkles className="absolute -top-1 -right-2 text-amber-500 animate-spin-slow" size={20} />
        </div>

        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full inline-block mb-1">
          Sự Kiện Làng Quê · Ngày {event.day}
        </span>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-1">
          {event.title}
        </h3>

        <p className="text-xs font-bold text-slate-500 mt-0.5">
          Gặp gỡ: <strong className="text-slate-800">{event.characterName}</strong>
        </p>

        <p className="text-xs sm:text-sm text-slate-700 bg-white/80 p-4 rounded-2xl border border-[#DFD9C3] mt-3.5 leading-relaxed text-left">
          {event.description}
        </p>

        {/* Choices */}
        <div className="flex flex-col gap-2.5 mt-5">
          {event.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => onChoose(choice)}
              className="p-3.5 rounded-2xl border-2 border-[#2E4A35] bg-[#2E4A35] hover:bg-[#233a29] text-white text-left transition-all active:scale-98 cursor-pointer shadow-md group flex flex-col justify-between"
            >
              <span className="font-extrabold text-xs sm:text-sm flex items-center justify-between">
                <span>{choice.text}</span>
                <span className="text-amber-300 group-hover:translate-x-1 transition-transform">➔</span>
              </span>
              <span className="text-[11px] text-emerald-200 font-medium mt-1">
                {choice.actionDesc}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
