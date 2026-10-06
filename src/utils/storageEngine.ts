import { FarmGameState, StartingProfileId } from '../types/farmSystem';
import {
  generateRandomSeed,
  generateSeededPlots,
  generateSeededMarketProfiles,
  generateSeededSeasonalGoals,
} from './seedEngine';
import { STARTING_PROFILES_CONFIG } from '../config/variabilityData';
import { ALL_ITEMS_CATALOG } from '../config/farmData';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const STORAGE_KEY = 'cute_farm_game_save_v2';

export function createNewFarmWithProfile(
  profileId: StartingProfileId = 'hardworking_farmer',
  customSeed?: string
): FarmGameState {
  const seed = (customSeed?.trim() || generateRandomSeed()).toUpperCase();
  const profile = STARTING_PROFILES_CONFIG[profileId] || STARTING_PROFILES_CONFIG.hardworking_farmer;
  const now = Date.now();

  // Sinh đất theo seed và loại đất ưa chuộng của hồ sơ
  const plots = generateSeededPlots(seed, profile.plotCount, profile.defaultSoil);
  // Cày sẵn 2 ô đầu tiên
  if (plots[0]) plots[0].state = 'plowed';
  if (plots[1]) plots[1].state = 'plowed';

  // Sinh tính cách chợ
  const marketProfiles = generateSeededMarketProfiles(seed, 1);

  // Sinh mục tiêu mùa xuân năm 1
  const seasonalGoals = generateSeededSeasonalGoals(seed, 'spring', 1);

  // Khởi tạo đồ trong kho theo hồ sơ
  const inventory = (profile.bonusItems || []).map((item, idx) => {
    const meta = ALL_ITEMS_CATALOG[item.itemId];
    return {
      id: `inv_start_${idx}`,
      itemId: item.itemId,
      name: meta?.name || item.itemId,
      icon: meta?.icon || '📦',
      quantity: item.quantity,
      isPerishable: meta?.isPerishable ?? false,
      daysRemaining: meta?.shelfLifeDays || 15,
      maxShelfLife: meta?.shelfLifeDays || 15,
      category: (meta?.category as any) || 'crop',
      quality: 3,
    };
  });

  // Xe khởi đầu
  const ownedVehicles = profile.bonusVehicles || ['handcart'];

  // Chuồng trại
  const initialPens: Record<string, any> = {
    main: { id: 'main', capacity: 10, waterTrough: 100, cleanliness: 100, animals: [] },
  };

  // Nếu hồ sơ có sẵn vật nuôi
  if (profile.bonusPens) {
    profile.bonusPens.forEach((bp) => {
      for (let i = 0; i < bp.animalCount; i++) {
        initialPens['main'].animals.push({
          id: `an_init_${bp.penType}_${i}`,
          type: bp.penType,
          name: `Vật nuôi #${initialPens['main'].animals.length + 1}`,
          hunger: 100,
          thirst: 100,
          health: 100,
          happiness: 100,
          daysWithoutFood: 0,
          isSick: false,
          lastFedDay: 1,
          daysUntilProduce: 1,
        });
      }
    });
  }

  // Xưởng chế biến
  const initialFactories: Record<string, any> = {
    windmill: { id: 'windmill', name: 'Cối Xay Gió', icon: '💨', unlocked: false, unlockLevel: 5, cost: 200, queueSlots: 2, activeTasks: [] },
    bakery: {
      id: 'bakery',
      name: 'Lò Bánh Mì',
      icon: '🥖',
      unlocked: profile.bonusFactories?.includes('bakery') || false,
      unlockLevel: 5,
      cost: 350,
      queueSlots: 2,
      activeTasks: [],
    },
    dairy: { id: 'dairy', name: 'Xưởng Chế Biến Sữa', icon: '🧀', unlocked: false, unlockLevel: 8, cost: 600, queueSlots: 2, activeTasks: [] },
    jam_press: { id: 'jam_press', name: 'Máy Ép Mứt & Sốt', icon: '🍓', unlocked: false, unlockLevel: 6, cost: 450, queueSlots: 2, activeTasks: [] },
  };

  return {
    version: 3,
    money: profile.initialMoney,
    laborHours: 10,
    currentDay: 1,
    currentSeason: 'spring',
    currentYear: 1,
    dayPart: 'morning',
    timeOfDay: 0.1,
    lastTimestamp: now,
    weather: 'sunny',
    weatherDaysRemaining: 2,

    // Tính khả biến
    worldSeed: seed,
    startingProfileId: profile.id,

    plots,
    hasAutoIrrigation: false,
    autoWorkersCount: 0,

    pens: initialPens,

    barnCapacity: 60,
    hasColdStorage: false,
    inventory,

    factories: initialFactories,

    ownedVehicles,
    activeTrips: [],

    marketProfiles,
    demandMultipliers: {
      wheat: 1.0,
      carrot: 1.0,
      tomato: 1.0,
      corn: 1.0,
      pumpkin: 1.0,
      strawberry: 1.0,
      egg: 1.0,
      milk: 1.0,
      wool: 1.0,
    },
    orders: [
      {
        id: 'ord_1',
        customerName: 'Bác Ba Quán Phở',
        customerAvatar: '👨‍🍳',
        requirements: [{ itemId: 'wheat', name: 'Lúa mì', icon: '🌾', amount: 4 }],
        rewardMoney: 35,
        rewardXP: 25,
        deadlineDay: 5,
        isCompleted: false,
      },
      {
        id: 'ord_2',
        customerName: 'Cô Lan Bách Hóa',
        customerAvatar: '👩‍💼',
        requirements: [{ itemId: 'carrot', name: 'Cà rốt', icon: '🥕', amount: 3 }],
        rewardMoney: 32,
        rewardXP: 20,
        deadlineDay: 6,
        isCompleted: false,
      },
    ],

    seasonalGoals,

    activeEvent: null,
    completedEventDays: [],

    // Hệ thống chướng ngại & rủi ro
    difficulty: 'standard',
    insurance: {
      active: false,
      costPerSeason: 60,
      coveragePercent: 70,
      expiresDay: 0,
      claimsCount: 0,
      totalCompensated: 0,
    },
    defenses: {
      hasDog: false,
      dogFed: true,
      hasReinforcedLock: false,
      hasCropNetting: false,
      vaccinatedPens: {},
    },
    pendingTaxes: [],
    riskAlerts: [],
    recentIncidents: [],
    disasterCooldown: 3,

    stats: {
      totalHarvests: 0,
      totalEarnings: profile.initialMoney,
      totalDeliveries: 0,
      cropsLostToWither: 0,
      daysPlayed: 1,
    },

    transactions: [],
    loans: [],
    creditScore: 500,

    settings: {
      soundEnabled: true,
      gameSpeed: 1,
      autoSaveIntervalSec: 30,
    },
    
    unlockedRegions: ['field', 'shop', 'barn'],
  };
}

export function createInitialFarmState(): FarmGameState {
  return createNewFarmWithProfile('hardworking_farmer', 'FARM-8291');
}

export function loadSavedFarmState(): FarmGameState {
  if (typeof window === 'undefined') return createInitialFarmState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialFarmState();
    const parsed = JSON.parse(raw);
    return parseFarmState(parsed);
  } catch (e) {
    console.warn('Lỗi đọc dữ liệu save từ localStorage:', e);
    return createInitialFarmState();
  }
}

export function parseFarmState(parsed: any): FarmGameState {
    if (!parsed) return createInitialFarmState();

    const seed = parsed.worldSeed || 'FARM-8291';
    const profileId = parsed.startingProfileId || 'hardworking_farmer';

    // Đảm bảo các ô đất cũ có soilType
    const plots = (parsed.plots || []).map((p: any, idx: number) => {
      const defaultSoils: any[] = ['alluvial', 'sandy', 'clay', 'hill'];
      return {
        ...p,
        soilType: p.soilType || defaultSoils[idx % defaultSoils.length],
        specialFeature: p.specialFeature ?? null,
      };
    });

    const marketProfiles = parsed.marketProfiles || generateSeededMarketProfiles(seed, parsed.currentYear || 1);
    const seasonalGoals = parsed.seasonalGoals || generateSeededSeasonalGoals(seed, parsed.currentSeason || 'spring', parsed.currentYear || 1);

    // MIGRATION: Gộp tất cả các chuồng (pens) thành 1 chuồng duy nhất (main)
    let migratedPens = parsed.pens || {};
    if (!migratedPens['main']) {
      let totalCapacity = 0;
      const allAnimals: any[] = [];
      let totalWater = 0;
      let totalClean = 0;
      let penCount = 0;

      Object.keys(migratedPens).forEach((key) => {
        totalCapacity += migratedPens[key].capacity || 0;
        allAnimals.push(...(migratedPens[key].animals || []));
        totalWater += migratedPens[key].waterTrough || 100;
        totalClean += migratedPens[key].cleanliness || 100;
        penCount++;
      });

      if (totalCapacity === 0) totalCapacity = 10;
      if (penCount === 0) penCount = 1;

      migratedPens = {
        main: {
          id: 'main',
          capacity: totalCapacity,
          waterTrough: Math.round(totalWater / penCount),
          cleanliness: Math.round(totalClean / penCount),
          animals: allAnimals,
        }
      };
    }

    return {
      ...createInitialFarmState(),
      ...parsed,
      worldSeed: seed,
      startingProfileId: profileId,
      plots: plots.length > 0 ? plots : createInitialFarmState().plots,
      marketProfiles,
      seasonalGoals,
      difficulty: parsed.difficulty || 'standard',
      insurance: { ...createInitialFarmState().insurance, ...(parsed.insurance || {}) },
      defenses: { ...createInitialFarmState().defenses, ...(parsed.defenses || {}) },
      pendingTaxes: parsed.pendingTaxes || [],
      riskAlerts: parsed.riskAlerts || [],
      recentIncidents: parsed.recentIncidents || [],
      disasterCooldown: parsed.disasterCooldown ?? 2,
      activeEvent: parsed.activeEvent || null,
      completedEventDays: parsed.completedEventDays || [],
      inventory: (parsed.inventory || []).map((item: any) => {
        const meta = ALL_ITEMS_CATALOG[item.itemId];
        if (meta) {
          return { ...item, name: meta.name, icon: meta.icon };
        }
        return item;
      }),
      pens: migratedPens,
      factories: Object.keys(createInitialFarmState().factories).reduce((acc, key) => {
        acc[key] = {
          ...createInitialFarmState().factories[key],
          ...(parsed.factories ? parsed.factories[key] : {})
        };
        return acc;
      }, {} as any),
      transactions: parsed.transactions || [],
      loans: parsed.loans || [],
      creditScore: parsed.creditScore ?? 500,
      settings: { ...createInitialFarmState().settings, ...(parsed.settings || {}) },
      stats: { ...createInitialFarmState().stats, ...(parsed.stats || {}) },
      unlockedRegions: parsed.unlockedRegions || ['field', 'shop', 'barn'],
      lastTimestamp: Date.now(), // Override saved timestamp so offline time doesn't jump the clock
    };
}

export async function loadCloudFarmState(uid: string): Promise<FarmGameState | null> {
  try {
    const docRef = doc(db, 'saves', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return parseFarmState(docSnap.data());
    }
    return null;
  } catch (e) {
    console.error("Lỗi đọc dữ liệu save từ cloud:", e);
    return null;
  }
}

function sanitizeForFirestore(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (val !== undefined) {
        result[key] = sanitizeForFirestore(val);
      }
    }
  }
  return result;
}

export async function saveCloudFarmState(uid: string, state: FarmGameState): Promise<void> {
  try {
    const docRef = doc(db, 'saves', uid);
    const sanitizedState = sanitizeForFirestore(state);
    await setDoc(docRef, sanitizedState);
  } catch (e) {
    console.error("Lỗi ghi dữ liệu save lên cloud:", e);
  }
}

export function saveFarmState(state: FarmGameState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Lỗi ghi dữ liệu save:', e);
  }
}

export function exportSaveFile(state: FarmGameState): void {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nong-trai-${state.worldSeed}-ngay-${state.currentDay}-${state.currentSeason}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importSaveFile(file: File): Promise<FarmGameState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed.version) {
          throw new Error('Định dạng file save không hợp lệ');
        }
        resolve(parsed as FarmGameState);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Không thể đọc file'));
    reader.readAsText(file);
  });
}
