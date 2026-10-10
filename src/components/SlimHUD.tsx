import React from 'react';
import { Coins, CalendarDays, CloudSun, CloudRain, Sun, CloudLightning, Settings, FastForward } from 'lucide-react';
import { WeatherType, Season } from '../types/farmSystem';
import { formatMoney } from '../utils/format';
import { SpriteIcon } from './SpriteIcon';
import { FARMER_SPRITE } from '../utils/sprites';
import { STARTING_PROFILES_CONFIG } from '../config/variabilityData';

/** HUD tối giản trong suốt cho chế độ 3D-only — chỉ hiện thông tin cốt lõi. */

interface Props {
  money: number;
  currentDay: number;
  currentSeason: Season;
  weather: WeatherType;
  startingProfileId: string;
  onOpenSettings: () => void;
  onFastForward: () => void;
}

const SEASON_LABEL: Record<Season, string> = {
  spring: 'Xuân',
  summer: 'Hạ',
  autumn: 'Thu',
  winter: 'Đông',
};

function WeatherIcon({ weather }: { weather: WeatherType }) {
  switch (weather) {
    case 'rainy': return <CloudRain size={14} className="text-sky-200" />;
    case 'drought': return <Sun size={14} className="text-amber-200" />;
    case 'storm': return <CloudLightning size={14} className="text-slate-200" />;
    default: return <CloudSun size={14} className="text-amber-100" />;
  }
}

export const SlimHUD: React.FC<Props> = ({
  money, currentDay, currentSeason, weather, startingProfileId, onOpenSettings, onFastForward,
}) => {
  const profileInfo = STARTING_PROFILES_CONFIG[startingProfileId] || STARTING_PROFILES_CONFIG.hardworking_farmer;
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex justify-center pt-2 px-2">
      <div className="pointer-events-auto flex max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-white/20 bg-black/45 py-1.5 pl-2 pr-1.5 shadow-lg backdrop-blur-md no-scrollbar">
        <span className="flex shrink-0 items-center gap-1" title={profileInfo.name}>
          <SpriteIcon src={FARMER_SPRITE} alt={profileInfo.name} size={22} />
        </span>
        <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-amber-200">
          <Coins size={14} />
          {formatMoney(money)}
        </span>
        <span className="h-4 w-px shrink-0 bg-white/20" />
        <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-white">
          <CalendarDays size={14} className="text-emerald-200" />
          Ngày {currentDay} · {SEASON_LABEL[currentSeason]}
        </span>
        <span className="h-4 w-px shrink-0 bg-white/20" />
        <WeatherIcon weather={weather} />
        <button
          onClick={onFastForward}
          className="ml-1 flex shrink-0 items-center gap-1 rounded-full bg-[#2E4A35] px-2.5 py-1.5 text-[11px] font-bold text-white transition-transform active:scale-95"
          title="Tua nhanh tới sáng hôm sau"
        >
          <FastForward size={13} />
          Tua nhanh
        </button>
        <button
          onClick={onOpenSettings}
          className="shrink-0 rounded-full bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
          aria-label="Cài đặt"
        >
          <Settings size={14} />
        </button>
      </div>
    </div>
  );
};

export default SlimHUD;
