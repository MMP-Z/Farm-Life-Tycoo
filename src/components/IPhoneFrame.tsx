import React from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export const IPhoneFrame: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative mx-auto my-2 sm:my-6 transition-all duration-300">
      {/* Outer Phone Bezel */}
      <div className="w-[390px] xs:w-[412px] sm:w-[430px] h-[860px] xs:h-[890px] sm:h-[915px] bg-[#1E1E22] p-[10px] sm:p-[12px] rounded-[52px] shadow-[0_25px_70px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-black/40 flex flex-col relative select-none">
        
        {/* Dynamic Island */}
        <div className="absolute top-[18px] sm:top-[20px] left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="w-[116px] h-[30px] bg-black rounded-full flex items-center justify-between px-3 shadow-md">
            {/* Camera sensor dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#151515] ring-1 ring-white/10" />
            {/* Audio speaker / mic sensor */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#0a1829] ring-1 ring-sky-950" />
          </div>
        </div>

        {/* Screen Container */}
        <div className="w-full h-full bg-[#F6F4EE] text-[#1C1C1E] rounded-[42px] overflow-hidden flex flex-col relative font-sans">
          
          {/* iOS Top Status Bar */}
          <div className="w-full pt-3 px-7 pb-1 flex items-center justify-between z-40 text-xs font-semibold text-slate-800 tracking-tight shrink-0 select-none">
            <span className="font-bold text-[13px] pl-1 font-mono">5:15</span>
            <div className="flex items-center gap-1.5 pr-1 text-slate-800">
              <Signal size={13} className="stroke-[2.5]" />
              <Wifi size={13} className="stroke-[2.5]" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-bold">100%</span>
                <div className="w-5 h-2.5 border-[1.5px] border-slate-800 rounded-[4px] p-0.5 flex items-center">
                  <div className="w-full h-full bg-emerald-600 rounded-[2px]" />
                </div>
              </div>
            </div>
          </div>

          {/* App Screen Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="w-full py-1.5 flex justify-center shrink-0 z-40 bg-transparent pointer-events-none">
            <div className="w-36 h-1 bg-slate-900/50 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
