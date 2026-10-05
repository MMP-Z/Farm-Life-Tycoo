import React from 'react';
import { Sun, Droplets, Wind, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { FarmZoneId } from '../types/flutterFarm';

interface Props {
  onGoToFarm: () => void;
  onSelectZone: (zone: FarmZoneId) => void;
}

export const HomeScreen: React.FC<Props> = ({ onGoToFarm, onSelectZone }) => {
  return (
    <div className="flex-1 flex flex-col bg-[#F6F4EE] overflow-y-auto pb-6 select-none animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="px-5 pt-3 pb-3 border-b border-[#EAE7DD] bg-[#F6F4EE]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-xl text-[#1C1C1E] leading-tight">Green Valley</h1>
          <p className="text-xs text-[#76767A] font-medium">Daily Farm Briefing · Sunny 24°C</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 text-sm font-bold shadow-sm">
          ☀️
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        
        {/* Hero Welcome Banner */}
        <div className="bg-gradient-to-r from-[#234230] to-[#162B1F] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Morning Update</span>
            <h2 className="text-lg font-bold mt-1 leading-snug">All 7 farm zones operating at peak health!</h2>
            <p className="text-xs text-emerald-200/90 mt-1">Expected harvest in 4 days for crisp vegetables.</p>
            
            <button
              onClick={onGoToFarm}
              className="mt-4 px-4 py-2 rounded-xl bg-white text-[#234230] font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <span>Explore Farm Map</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="absolute right-2 -bottom-2 text-6xl opacity-20 pointer-events-none">
            🌾
          </div>
        </div>

        {/* Quick Weather & Radar */}
        <div className="bg-white rounded-3xl p-5 border border-[#EAE7DD] shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-3">Farm Micro-Climate</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-2xl bg-[#FBF9F5] border border-[#F2EFE9] flex flex-col items-center">
              <Sun className="text-amber-500 mb-1" size={18} />
              <span className="text-[10px] text-slate-500">Day Temp</span>
              <span className="font-mono font-bold text-sm text-slate-900 mt-0.5">24°C</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-0.5">Sunny</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FBF9F5] border border-[#F2EFE9] flex flex-col items-center">
              <Droplets className="text-sky-500 mb-1" size={18} />
              <span className="text-[10px] text-slate-500">Humidity</span>
              <span className="font-mono font-bold text-sm text-slate-900 mt-0.5">62%</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-0.5">Moderate</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FBF9F5] border border-[#F2EFE9] flex flex-col items-center">
              <Wind className="text-emerald-500 mb-1" size={18} />
              <span className="text-[10px] text-slate-500">Wind</span>
              <span className="font-mono font-bold text-sm text-slate-900 mt-0.5">8 km/h</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-0.5">Gentle</span>
            </div>
          </div>
        </div>

        {/* Priority Parcels */}
        <div className="bg-white rounded-3xl p-5 border border-[#EAE7DD] shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-3">Active Farm Zones</h3>
          <div className="flex flex-col gap-2">
            {[
              { id: 'tomato_field' as FarmZoneId, name: 'Tomato Field', detail: 'Growth 78% · 12 days to harvest', icon: '🍅', status: 'Optimal' },
              { id: 'animal_area' as FarmZoneId, name: 'Animal Area', detail: '48 Animals · Next feed at 6 PM', icon: '🐮', status: 'Healthy' },
              { id: 'vegetable_field' as FarmZoneId, name: 'Vegetable Field', detail: 'Lettuce & Carrots · 80% Growth', icon: '🥬', status: 'Ready soon' },
            ].map((zone) => (
              <div
                key={zone.id}
                onClick={() => {
                  onSelectZone(zone.id);
                  onGoToFarm();
                }}
                className="p-3 rounded-2xl border border-[#EAE7DD] hover:border-[#234230] transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{zone.icon}</span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{zone.name}</h4>
                    <p className="text-[11px] text-slate-500">{zone.detail}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#1B6634] bg-[#D1F2D9] px-2 py-0.5 rounded-full">
                  {zone.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
