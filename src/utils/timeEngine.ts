import { FarmGameState, Season, WeatherType } from '../types/farmSystem';
import { ANIMALS_CONFIG, VEHICLES_CONFIG, ROUTES_CONFIG, SEASON_NAMES, ALL_ITEMS_CATALOG } from '../config/farmData';
import { SOIL_CONFIG } from '../config/variabilityData';
import {
  generateSeededMarketProfiles,
  checkDailyDynamicEvent,
} from './seedEngine';
import { processDailyRisks } from './riskEngine';
import { calculateCropGrowth, isPlotStuck } from './cropGrowth';

export const DAY_REAL_SECONDS = 60; // 1 minute real time = 1 in-game day
export const DAYS_PER_SEASON = 7;
export const SEASONS_ORDER: Season[] = ['spring', 'summer', 'autumn', 'winter'];

export interface TickResult {
  nextState: FarmGameState;
  notifications: string[];
  daysAdvanced: number;
}

export function advanceGameTime(  state: FarmGameState,
  currentTimestamp: number,
  isCatchUp = false
): TickResult {
  const notifications: string[] = [];
  const elapsedSec = (currentTimestamp - state.lastTimestamp) / 1000;

  // If paused and not catchup, just update timestamp
  if (state.settings.gameSpeed === 0 && !isCatchUp) {
    return {
      nextState: { ...state, lastTimestamp: currentTimestamp },
      notifications,
      daysAdvanced: 0,
    };
  }

  // Cap maximum offline catchup to 8 hours
  const effectiveSec = Math.min(28800, elapsedSec * (isCatchUp ? 1 : state.settings.gameSpeed));
  if (effectiveSec <= 0) {
    return { nextState: state, notifications, daysAdvanced: 0 };
  }

  const fractionOfDay = effectiveSec / DAY_REAL_SECONDS;
  let newTimeOfDay = state.timeOfDay + fractionOfDay;
  const daysAdvanced = Math.floor(newTimeOfDay);
  newTimeOfDay = newTimeOfDay % 1;

  let newDayPart: 'morning' | 'noon' | 'afternoon' | 'evening' = 'morning';
  if (newTimeOfDay < 0.25) newDayPart = 'morning';
  else if (newTimeOfDay < 0.5) newDayPart = 'noon';
  else if (newTimeOfDay < 0.75) newDayPart = 'afternoon';
  else newDayPart = 'evening';

  let currentDay = state.currentDay + daysAdvanced;
  let currentSeason = state.currentSeason;
  let currentYear = state.currentYear;
  let marketProfiles = state.marketProfiles;
  let pendingTaxes = [...(state.pendingTaxes || [])];

  // Handle season and year progression
  if (daysAdvanced > 0) {
    const totalSeasonIndex = Math.floor((currentDay - 1) / DAYS_PER_SEASON);
    const seasonIdx = totalSeasonIndex % 4;
    const newSeason = SEASONS_ORDER[seasonIdx];
    const newYear = 1 + Math.floor(totalSeasonIndex / 4);

    if (newSeason !== currentSeason || newYear !== currentYear) {
      const oldSeason = currentSeason;
      currentSeason = newSeason;
      currentYear = newYear;
      notifications.push(
        `🌸 Chuyển mùa! Chào đón ${
          newSeason === 'spring'
            ? 'Mùa Xuân'
            : newSeason === 'summer'
            ? 'Mùa Hạ'
            : newSeason === 'autumn'
            ? 'Mùa Thu'
            : 'Mùa Đông'
        } năm thứ ${currentYear}!`
      );


      // Mỗi năm mới, thị trường các chợ dịch chuyển thị hiếu (Lớp 2)
      if (newYear !== state.currentYear) {
        marketProfiles = generateSeededMarketProfiles(state.worldSeed, currentYear);
        notifications.push('📈 Xu hướng tiêu dùng tại các chợ đã thay đổi theo năm mới!');
      }

      // Đánh thuế mùa trước (Phase 3) — tính theo % tài sản để không quá sốc với người mới
      if (currentDay > 1) { // Không đánh thuế ở ngày 1
        // Miễn thuế 10 ngày đầu cho người mới
        const daysPlayed = currentDay - 1;
        if (daysPlayed <= 10) {
          notifications.push(`📜 Làng miễn thuế cho nông trại mới trong 10 ngày đầu!`);
        } else {
          // Thuế = 10% tiền mặt + 5% giá trị kho, tối thiểu 50, tối đa 2000
          const inventoryValue = state.inventory.reduce((sum, item) => {
            const meta = ALL_ITEMS_CATALOG[item.itemId];
            return sum + (meta?.basePrice || 10) * item.quantity;
          }, 0);
          const taxAmount = Math.min(2000, Math.max(50, Math.round(state.money * 0.1 + inventoryValue * 0.05)));
          pendingTaxes.push({
            id: `tax_${Date.now()}`,
            season: oldSeason,
            year: state.currentYear,
            amount: taxAmount,
            dueDay: currentDay + 5,
            paid: false,
            discountPercent: 0
          });
          notifications.push(`📜 Làng thông báo thu thuế! Cần nộp ${taxAmount} 💰 thuế ${SEASON_NAMES[oldSeason]?.name || oldSeason} trong 5 ngày tới.`);
        }
      }
    }
  }

  // Dynamic Weather Update
  let weather = state.weather;
  let weatherDays = state.weatherDaysRemaining - daysAdvanced;
  if (weatherDays <= 0) {
    const weathers: WeatherType[] = ['sunny', 'sunny', 'rainy', 'rainy', 'sunny'];
    if (currentSeason === 'summer') weathers.push('drought');
    if (currentSeason === 'autumn' || currentSeason === 'winter') weathers.push('storm');
    weather = weathers[Math.floor(Math.random() * weathers.length)];
    weatherDays = Math.floor(Math.random() * 2) + 1;
    if (daysAdvanced > 0) {
      notifications.push(
        `☁️ Thời tiết hôm nay: ${
          weather === 'sunny'
            ? 'Trời Nắng Ráo'
            : weather === 'rainy'
            ? 'Mưa Rào Mát Lành'
            : weather === 'drought'
            ? 'Hạn Hán Nắng Gắt'
            : 'Bão Gió Giật'
        }!`
      );
    }
  }

  // 1. Process Plots (Crops & Soil Types)
  const isHardworking = state.startingProfileId === 'hardworking_farmer';
  const updatedPlots = state.plots.map((plot) => {
    let p = { ...plot };
    const soilMeta = SOIL_CONFIG[p.soilType] || SOIL_CONFIG.alluvial;

    // Rain auto-waters plots
    if (weather === 'rainy') {
      p.moisture = 100;
    } else if (state.hasAutoIrrigation) {
      p.moisture = Math.max(p.moisture, 75);
    } else if (daysAdvanced > 0) {
      const baseConsumption = weather === 'drought' ? 35 : 20;
      // Đất cát thoát nhanh (1.4x), đất sét/phù sa giữ nước (0.7x)
      const adjustedRate = 1.0 / (soilMeta.moistureRetentionRate || 1.0);
      const consumption = Math.round(baseConsumption * adjustedRate * daysAdvanced);
      p.moisture = Math.max(0, p.moisture - consumption);
    }

    // Suối nước ngầm đặc biệt luôn giữ độ ẩm >= 50%
    if (p.specialFeature === 'spring') {
      p.moisture = Math.max(50, p.moisture);
    }

    // Growing crops logic — dùng hàm tính chung với FieldTab
    if (p.cropId && p.state === 'growing') {
      // Tự sửa plot bị kẹt (đang growing nhưng plantedDay null/invalid):
      // gán lại plantedDay = hiện tại để cây bắt đầu lớn thay vì đứng yên vĩnh viễn
      if (isPlotStuck(p)) {
        p.plantedDay = currentDay + newTimeOfDay;
        notifications.push(`🔧 Ô đất #${p.id} bị lỗi dữ liệu đã được tự động sửa. Cây sẽ lớn bình thường từ bây giờ.`);
      }
      const isNewPlayer = Date.now() - (state.createdAt || Date.now()) < 15 * 60 * 1000;
      const growth = calculateCropGrowth(
        p,
        p.cropId,
        currentDay,
        newTimeOfDay,
        currentSeason,
        isHardworking,
        isNewPlayer
      );
      if (growth.isValid && growth.isReady) {
        p.state = 'ready';
      }
    }

    // Spontaneous pest event with soil pest resistance
    if (!isCatchUp && daysAdvanced > 0 && p.state === 'growing' && !p.hasPest) {
      const pestChance = 0.08 * (1.0 - (soilMeta.pestResistance || 0));
      if (Math.random() < pestChance) {
        p.hasPest = true;
        notifications.push(`🐛 Ô đất #${p.id} (${soilMeta.name}) xuất hiện sâu bệnh hại lá! Cần xịt thuốc.`);
      }
    }

    return p;
  });

  // 2. Process Animals with Rancher Perk
  const isRancher = state.startingProfileId === 'rancher';
  const updatedPens = { ...state.pens };
    Object.keys(updatedPens).forEach((penKey) => {
    const pen = { ...updatedPens[penKey] };

    let deadCount = 0;
    let sickDeadCount = 0;
    let sickDeadNames: string[] = [];
    pen.animals = pen.animals.map((animal) => {
      let a = { ...animal };
      const def = ANIMALS_CONFIG[a.type];
      if (!def) return a;

      if (daysAdvanced > 0) {
        if (def.requiresWater) {
          if (pen.waterTrough >= 20) {
            pen.waterTrough = Math.max(0, pen.waterTrough - 10 * daysAdvanced);
            a.thirst = Math.min(100, a.thirst + 10);
          } else {
            a.thirst = Math.max(0, a.thirst - 25 * daysAdvanced);
          }
        }

        // Vật nuôi sẽ bị giảm độ no mỗi ngày
        a.hunger = Math.max(0, a.hunger - 25 * daysAdvanced);

        if (a.hunger > 20 && (!def.requiresWater || a.thirst > 20)) {
          const produceAdvance = isRancher ? Math.max(1, daysAdvanced * 1.25) : daysAdvanced;
          a.daysUntilProduce = Math.max(0, a.daysUntilProduce - produceAdvance);
          a.happiness = Math.min(100, a.happiness + (isRancher ? 8 : 5) * daysAdvanced);
          a.daysWithoutFood = 0;
        } else {
          a.daysWithoutFood += daysAdvanced;
          a.happiness = Math.max(0, a.happiness - 15 * daysAdvanced);
          if (a.daysWithoutFood >= 4) {
            if (!a.isSick) {
              a.isSick = true;
              a.sickDays = 0;
              notifications.push(`🤒 ${a.name} đã bị ốm! Hãy mua thuốc thú y chữa trị ngay.`);
            }
          }
          // Vật nuôi ốm quá 3 ngày không chữa sẽ chết
          if (a.isSick) {
            a.sickDays = (a.sickDays || 0) + daysAdvanced;
            if (a.sickDays >= 3) {
              sickDeadCount++;
              sickDeadNames.push(a.name);
              return { ...a, _dead: true };
            }
          }
        }
      }
      return a;
    }).filter((a) => {
      if ((a as any)._dead) {
        return false;
      }
      if (a.daysWithoutFood >= 7) {
        deadCount++;
        return false;
      }
      return true;
    });

    if (deadCount > 0) {
      notifications.push(`💀 Tin buồn: ${deadCount} vật nuôi đã chết vì bị bỏ đói quá 7 ngày!`);
    }
    if (sickDeadCount > 0) {
      notifications.push(`💀 ${sickDeadNames.join(', ')} đã chết vì bệnh không được chữa trị kịp thời!`);
    }

    updatedPens[penKey] = pen;
  });

  // 3. Process Factory Crafting Queue
  const updatedFactories = { ...state.factories };
  Object.keys(updatedFactories).forEach((fKey) => {
    const factory = { ...updatedFactories[fKey] };
    factory.activeTasks = factory.activeTasks.map((task) => {
      const elapsed = currentDay - task.startDay;
      const progress = Math.min(100, Math.floor((elapsed / task.durationDays) * 100));
      return {
        ...task,
        progressPercent: progress,
        completed: elapsed >= task.durationDays,
      };
    });
    updatedFactories[fKey] = factory;
  });

  // 4. Process Transport Trips with Merchant Perk
  const isMerchant = state.startingProfileId === 'merchant';
  let moneyGain = 0;
  const updatedTrips = state.activeTrips.map((trip) => {
    let t = { ...trip };
    const elapsed = currentDay - t.startDay;
    if (elapsed >= t.durationDays && t.status === 'in_transit') {
      t.status = 'arrived';
      const merchantBonus = isMerchant && (t.routeId === 'county' || t.routeId === 'city' || t.routeId === 'port') ? 1.12 : 1.0;
      const finalEarning = Math.round(t.totalEarnings * merchantBonus);
      moneyGain += finalEarning;
      notifications.push(
        `🚚 Chuyến xe đã bán xong tại ${ROUTES_CONFIG[t.routeId]?.name}! Thu về +${finalEarning.toLocaleString()} 💰.`
      );
    }
    return t;
  });

  // 5. Perishable Inventory Shelf Life Expiration
  let inventory = state.inventory
    .map((item) => {
      if (!item.isPerishable || state.hasColdStorage) {
        return item;
      }
      const daysLeft = Math.max(0, item.daysRemaining - daysAdvanced);
      return {
        ...item,
        daysRemaining: daysLeft,
        quality: daysLeft <= 1 ? 1 : daysLeft <= 3 ? 2 : 3,
      };
    })
    .filter((item) => item.quantity > 0 && item.daysRemaining > 0);

  // 6. Market Demand Recoveries
  const demandMultipliers = { ...state.demandMultipliers };
  if (daysAdvanced > 0) {
    Object.keys(demandMultipliers).forEach((itemKey) => {
      const current = demandMultipliers[itemKey];
      if (current < 1.0) {
        demandMultipliers[itemKey] = Math.min(1.0, current + 0.1 * daysAdvanced);
      }
    });
  }

  // 7. Check Daily Dynamic Event (Lớp 5)
  let activeEvent = state.activeEvent;
  if (!activeEvent && daysAdvanced > 0) {
    const triggered = checkDailyDynamicEvent(state.worldSeed, currentDay, state.completedEventDays || []);
    if (triggered) {
      activeEvent = triggered;
    }
  }

  // 8. Process Financials (Loans)
  const updatedLoans = (state.loans || []).map(loan => {
    if (daysAdvanced > 0) {
      return {
        ...loan,
        remainingAmount: loan.remainingAmount * Math.pow((1 + loan.interestRate), daysAdvanced)
      };
    }
    return loan;
  });

  const preRiskState: FarmGameState = {
    ...state,
    money: state.money + moneyGain,
    currentDay,
    currentSeason,
    currentYear,
    timeOfDay: newTimeOfDay,
    dayPart: newDayPart,
    lastTimestamp: currentTimestamp,
    weather,
    weatherDaysRemaining: Math.max(1, weatherDays),
    plots: updatedPlots,
    pens: updatedPens,
    factories: updatedFactories,
    activeTrips: updatedTrips,
    inventory,
    demandMultipliers,
    marketProfiles: marketProfiles || state.marketProfiles,
    pendingTaxes,
    loans: updatedLoans,
    activeEvent,
    stats: {
      ...state.stats,
      daysPlayed: state.stats.daysPlayed + daysAdvanced,
      totalEarnings: state.stats.totalEarnings + moneyGain,
    },
  };

  const riskResult = processDailyRisks(preRiskState, daysAdvanced);
  if (riskResult.notifications.length > 0) {
    notifications.push(...riskResult.notifications);
  }

  return {
    nextState: riskResult.nextState,
    notifications,
    daysAdvanced,
  };
}

/** Kiểm tra boost người mới còn hiệu lực (15 phút đầu) */
export function isNewPlayerBoostActive(state: FarmGameState): boolean {
  return Date.now() - (state.createdAt || Date.now()) < 15 * 60 * 1000;
}
