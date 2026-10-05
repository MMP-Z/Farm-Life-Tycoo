import {
  FieldPlot,
  SoilType,
  SpecialPlotFeature,
  MarketProfile,
  MarketTraitId,
  SeasonGoal,
  DynamicFarmEvent,
  Season,
} from '../types/farmSystem';
import {
  SOIL_CONFIG,
  SOIL_CROP_MULTIPLIERS,
  MARKET_TRAITS_CONFIG,
  SEASONAL_GOALS_POOL,
  DYNAMIC_EVENTS_POOL,
  makeRng,
  hashString,
  generateRandomSeed,
} from '../config/variabilityData';

export { generateRandomSeed };
import { ROUTES_CONFIG } from '../config/farmData';

// ==========================================
// 1. SINH ĐẤT & BẢN ĐỒ THEO SEED (LỚP 1)
// ==========================================
export function generateSeededPlots(
  worldSeed: string,
  count: number,
  preferredSoil: SoilType = 'alluvial'
): FieldPlot[] {
  const rng = makeRng(hashString(`${worldSeed}:plots`));
  const soilPool: SoilType[] = ['alluvial', 'sandy', 'clay', 'hill'];

  return Array.from({ length: count }, (_, idx) => {
    // Tỷ lệ sinh đất theo cụm quanh preferredSoil của hồ sơ khởi đầu
    const rand = rng();
    let soilType: SoilType = preferredSoil;
    if (rand < 0.45) {
      soilType = preferredSoil;
    } else if (rand < 0.65) {
      soilType = soilPool[(soilPool.indexOf(preferredSoil) + 1) % soilPool.length];
    } else if (rand < 0.85) {
      soilType = soilPool[(soilPool.indexOf(preferredSoil) + 2) % soilPool.length];
    } else {
      soilType = soilPool[(soilPool.indexOf(preferredSoil) + 3) % soilPool.length];
    }

    // Tỷ lệ ô đất đặc biệt (10% cơ hội: suối nước ngầm hoặc mỏ khoáng chất)
    const specialRand = rng();
    let specialFeature: SpecialPlotFeature = null;
    if (specialRand < 0.08) {
      specialFeature = 'spring';
    } else if (specialRand < 0.15) {
      specialFeature = 'mineral';
    }

    const baseFertility = 75 + Math.floor(rng() * 20) + SOIL_CONFIG[soilType].baseFertilityBonus;

    return {
      id: idx + 1,
      state: 'empty',
      cropId: null,
      plantedDay: null,
      plantedSeason: null,
      fertility: Math.min(100, baseFertility),
      moisture: specialFeature === 'spring' ? 80 : 50,
      hasPest: false,
      fertilized: false,
      lastCropId: null,
      soilType,
      specialFeature,
    };
  });
}

// Tính hệ số sản lượng theo loại đất
export function getSoilYieldFactor(
  cropId: string,
  soilType: SoilType,
  specialFeature?: SpecialPlotFeature
): { factor: number; bonusPercent: number; note: string } {
  const table = SOIL_CROP_MULTIPLIERS[cropId];
  let baseFactor = table ? table[soilType] || 1.0 : 1.0;

  if (specialFeature === 'mineral') {
    baseFactor += 0.2;
  }

  const bonusPercent = Math.round((baseFactor - 1.0) * 100);
  let note = '';
  if (bonusPercent > 0) {
    note = `+${bonusPercent}% (${SOIL_CONFIG[soilType]?.name || soilType})`;
  } else if (bonusPercent < 0) {
    note = `${bonusPercent}% (${SOIL_CONFIG[soilType]?.name || soilType})`;
  } else {
    note = `Bình thường (1.0x)`;
  }

  if (specialFeature === 'mineral') {
    note += ' · Đất giàu khoáng';
  } else if (specialFeature === 'spring') {
    note += ' · Suối ngầm giữ ẩm';
  }

  return { factor: baseFactor, bonusPercent, note };
}

// ==========================================
// 2. SINH TÍNH CÁCH CHỢ THEO SEED & NĂM (LỚP 2)
// ==========================================
export function generateSeededMarketProfiles(
  worldSeed: string,
  year: number
): Record<string, MarketProfile> {
  const rng = makeRng(hashString(`${worldSeed}:market:year_${year}`));
  const traitKeys: MarketTraitId[] = ['picky', 'fresh_lover', 'stable', 'wholesale', 'volatile'];
  const allItemKeys = ['wheat', 'carrot', 'tomato', 'corn', 'pumpkin', 'strawberry', 'egg', 'milk', 'bread'];

  const profiles: Record<string, MarketProfile> = {};

  Object.entries(ROUTES_CONFIG).forEach(([routeId, routeDef], idx) => {
    // Chọn tính cách
    const traitIdx = Math.floor(rng() * traitKeys.length);
    const trait = traitKeys[traitIdx];
    const traitMeta = MARKET_TRAITS_CONFIG[trait];

    // Chọn 2 mặt hàng ưa chuộng
    const item1Idx = Math.floor(rng() * allItemKeys.length);
    let item2Idx = Math.floor(rng() * allItemKeys.length);
    while (item2Idx === item1Idx) {
      item2Idx = (item2Idx + 1) % allItemKeys.length;
    }
    const preferredItems = [allItemKeys[item1Idx], allItemKeys[item2Idx]];

    // Chọn 1 mặt hàng bị dìm giá
    let item3Idx = Math.floor(rng() * allItemKeys.length);
    while (item3Idx === item1Idx || item3Idx === item2Idx) {
      item3Idx = (item3Idx + 1) % allItemKeys.length;
    }
    const discountedItems = [allItemKeys[item3Idx]];

    profiles[routeId] = {
      routeId,
      routeName: routeDef.name,
      trait,
      traitName: traitMeta.name,
      traitDesc: traitMeta.description,
      preferredItems,
      discountedItems,
    };
  });

  return profiles;
}

// ==========================================
// 3. SINH MỤC TIÊU MÙA VỤ THEO SEED (LỚP 4)
// ==========================================
export function generateSeededSeasonalGoals(
  worldSeed: string,
  season: Season,
  year: number
): SeasonGoal[] {
  const rng = makeRng(hashString(`${worldSeed}:goals:${season}:y${year}`));
  const pool = SEASONAL_GOALS_POOL[season] || SEASONAL_GOALS_POOL.spring;

  // Chọn 2 mục tiêu khác nhau từ pool
  const chosenIndices: number[] = [];
  while (chosenIndices.length < Math.min(2, pool.length)) {
    const nextIdx = Math.floor(rng() * pool.length);
    if (!chosenIndices.includes(nextIdx)) {
      chosenIndices.push(nextIdx);
    }
  }

  return chosenIndices.map((idx, gIdx) => {
    const goalDef = pool[idx];
    return {
      id: `goal_${season}_y${year}_${gIdx}`,
      season,
      year,
      title: goalDef.title,
      description: goalDef.description,
      icon: goalDef.icon,
      goalType: goalDef.goalType,
      targetItemId: goalDef.targetItemId,
      targetAmount: goalDef.targetAmount,
      currentAmount: 0,
      rewardMoney: goalDef.rewardMoney,
      rewardXP: goalDef.rewardXP,
      completed: false,
      claimed: false,
    };
  });
}

// ==========================================
// 4. KÍCH HOẠT SỰ KIỆN ĐỘNG THEO SEED & NGÀY (LỚP 5)
// ==========================================
export function checkDailyDynamicEvent(
  worldSeed: string,
  day: number,
  completedDays: number[]
): DynamicFarmEvent | null {
  // Sự kiện chỉ xuất hiện mỗi 4-6 ngày một lần
  if (completedDays.includes(day)) return null;

  // Lịch cố định kiểm tra sự kiện: ngày 3, 7, 12, 17, 22, 28, ...
  const eventDays = [3, 7, 12, 17, 22, 27, 33, 38, 44, 50, 56, 62, 68, 74, 80];
  if (!eventDays.includes(day)) return null;

  const rng = makeRng(hashString(`${worldSeed}:event:day_${day}`));
  const eventIdx = Math.floor(rng() * DYNAMIC_EVENTS_POOL.length);
  const selectedEvent = DYNAMIC_EVENTS_POOL[eventIdx];

  return {
    id: `ev_${day}_${eventIdx}`,
    day,
    title: selectedEvent.title,
    description: selectedEvent.description,
    icon: selectedEvent.icon,
    characterName: selectedEvent.characterName,
    choices: selectedEvent.choices,
  };
}
