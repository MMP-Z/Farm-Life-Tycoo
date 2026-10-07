export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type WeatherType = 'sunny' | 'rainy' | 'drought' | 'storm';

// Lớp 1: Đất & Bản đồ
export type SoilType = 'alluvial' | 'sandy' | 'clay' | 'hill';
export type SpecialPlotFeature = 'spring' | 'mineral' | null;

export interface SoilDefinition {
  id: SoilType;
  name: string;
  icon: string;
  color: string;
  textColor: string;
  description: string;
  pros: string;
  cons: string;
  baseFertilityBonus: number;
  moistureRetentionRate: number; // 1.0 normal, >1.0 holds water, <1.0 dries fast
  pestResistance: number; // 0 normal, >0 less pests
}

export interface CropDefinition {
  id: string;
  name: string;
  icon: string;
  seedPrice: number;
  growDays: number;
  yield: number;
  basePrice: number;
  seasons: Season[];
  unlockLevel: number;
  shelfLifeDays: number;
  waterNeed: number;
  description: string;
  soilMultipliers?: Record<SoilType, number>;
}

export type PlotState = 'empty' | 'plowed' | 'seeded' | 'growing' | 'ready' | 'withered';

export interface FieldPlot {
  id: number;
  state: PlotState;
  cropId: string | null;
  plantedDay: number | null;
  plantedSeason: Season | null;
  fertility: number; // 0 - 100
  moisture: number; // 0 - 100
  hasPest: boolean;
  fertilized: boolean; // yield bonus
  lastCropId: string | null;
  
  // Tính khả biến lớp 1
  soilType: SoilType;
  specialFeature?: SpecialPlotFeature;
}

export interface AnimalDefinition {
  id: string;
  name: string;
  icon: string;
  buyPrice: number;
  feedPerDay: number;
  feedItemId: string;
  requiresWater: boolean;
  produceItemId: string;
  produceDays: number;
  produceAmount: number;
  baseSellPrice: number;
  unlockLevel: number;
}

export interface AnimalItem {
  id: string;
  type: string;
  name: string;
  hunger: number;
  thirst: number;
  health: number;
  happiness: number;
  daysWithoutFood: number;
  isSick: boolean;
  lastFedDay: number;
  daysUntilProduce: number;
}

export interface AnimalPen {
  id: string;
  capacity: number;
  animals: AnimalItem[];
  cleanliness: number;
  waterTrough: number;
}

export interface RecipeIngredient {
  itemId: string;
  name: string;
  amount: number;
}

export interface RecipeDefinition {
  id: string;
  name: string;
  icon: string;
  factoryType: string;
  ingredients: RecipeIngredient[];
  outputItemId: string;
  outputAmount: number;
  craftDays: number;
  basePrice: number;
  unlockLevel: number;
}

export interface FactoryTask {
  id: string;
  recipeId: string;
  startDay: number;
  durationDays: number;
  progressPercent: number;
  completed: boolean;
}

export interface FactoryBuilding {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  cost: number;
  unlockLevel: number;
  queueSlots: number;
  activeTasks: FactoryTask[];
}

export interface VehicleDefinition {
  id: string;
  name: string;
  icon: string;
  capacity: number;
  cost: number;
  speedMultiplier?: number;
  unlockLevel: number;
  buyPrice: number;
  description?: string;
  isColdStorage?: boolean;
  tripDays?: number;
  routes?: string[];
}

export type MarketRoute = RouteDefinition;

export interface RouteDefinition {
  id: string;
  name: string;
  distance: string;
  travelDays: number;
  priceBonusPercent: number;
  unlockLevel: number;
  requiredVehicleId?: string[];
  riskFactor?: number;
}

export interface TransportTrip {
  id: string;
  vehicleId: string;
  routeId: string;
  cargo: { itemId: string; name: string; icon: string; quantity: number; unitPrice: number }[];
  startDay: number;
  durationDays: number;
  status: 'in_transit' | 'arrived' | 'completed';
  totalEarnings: number;
  fee: number;
  robbedLoss?: number;
}

export interface InventoryItem {
  id: string;
  itemId: string;
  name: string;
  icon: string;
  quantity: number;
  isPerishable: boolean;
  daysRemaining: number;
  maxShelfLife: number;
  category: 'crop' | 'animal_product' | 'processed' | 'supply' | 'seed';
  quality: number;
}

export interface OrderItem {
  id: string;
  customerName: string;
  customerAvatar: string;
  requirements: { itemId: string; name: string; icon: string; amount: number }[];
  rewardMoney: number;
  rewardXP: number;
  deadlineDay: number;
  isCompleted: boolean;
}

// Lớp 2: Tính cách chợ
export type MarketTraitId = 'picky' | 'fresh_lover' | 'stable' | 'wholesale' | 'volatile';

export interface MarketProfile {
  routeId: string;
  routeName: string;
  trait: MarketTraitId;
  traitName: string;
  traitDesc: string;
  preferredItems: string[];
  discountedItems: string[];
}

// Lớp 3: Hồ sơ khởi đầu
export type StartingProfileId = 'hardworking_farmer' | 'rancher' | 'merchant' | 'chef' | 'heir';

export interface StartingProfile {
  id: StartingProfileId;
  name: string;
  icon: string;
  style: string;
  description: string;
  perkName: string;
  perkDescription: string;
  initialMoney: number;
  plotCount: number;
  defaultSoil: SoilType;
  bonusItems?: { itemId: string; quantity: number }[];
  bonusVehicles?: string[];
  bonusPens?: { penType: string; animalCount: number }[];
  bonusFactories?: string[];
}

// Lớp 5: Sự kiện ngẫu nhiên có lựa chọn
export interface DynamicFarmEventChoice {
  text: string;
  actionDesc: string;
  effectType: 'grant_money' | 'pay_money' | 'grant_items' | 'water_all' | 'boost_market' | 'none';
  moneyAmount?: number;
  items?: { itemId: string; quantity: number }[];
  toastResult: string;
}

export interface DynamicFarmEvent {
  id: string;
  day: number;
  title: string;
  description: string;
  icon: string;
  characterName: string;
  choices: DynamicFarmEventChoice[];
}

// ==========================================
// HỆ THỐNG CHƯỚNG NGẠI & RỦI RO
// ==========================================
export type RiskDifficulty = 'relaxed' | 'standard' | 'challenging';

export interface RiskAlert {
  id: string;
  type: 'weather' | 'pest' | 'thief' | 'market' | 'mafia' | 'tax';
  title: string;
  desc: string;
  daysRemaining: number;
  icon: string;
  severity: 'low' | 'medium' | 'high';
}

export interface VillageInsurance {
  active: boolean;
  costPerSeason: number;
  coveragePercent: number; // e.g. 70%
  expiresDay: number;
  claimsCount: number;
  totalCompensated: number;
}

export interface DefenseSystem {
  hasDog: boolean; // Chó giữ nhà
  dogFed: boolean; // Đã cho ăn hôm nay
  hasReinforcedLock: boolean; // Khóa kho kiên cố
  hasCropNetting: boolean; // Nhà lưới che chắn
  vaccinatedPens: Record<string, boolean>; // Chuồng tiêm vắc xin
}



export interface PendingTax {
  id: string;
  season: Season;
  year: number;
  amount: number;
  dueDay: number;
  paid: boolean;
  discountPercent: number;
}

export interface RiskIncidentRecord {
  id: string;
  day: number;
  title: string;
  description: string;
  lossAmount: number;
  insuranceCompensated: number;
  preventedByDefense: boolean;
  icon: string;
}

export interface FinancialTransaction {
  id: string;
  day: number;
  type: 'income' | 'expense';
  amount: number;
  category: 'farming' | 'livestock' | 'shop' | 'loan' | 'tax' | 'other';
  description: string;
  timestamp: number;
}

export interface BankLoan {
  id: string;
  principal: number;
  interestRate: number; // Daily interest rate (e.g. 0.05 for 5%)
  remainingAmount: number;
  dueDate: number;
}

export interface GameStats {
  totalHarvests: number;
  totalEarnings: number;
  totalDeliveries: number;
  cropsLostToWither: number;
  daysPlayed: number;
  totalLossesAvoided?: number;
  totalTaxesPaid?: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  gameSpeed: number;
  autoSaveIntervalSec: number;
}

export interface FarmGameState {
  version: number;
  money: number;
  laborHours: number; // Tối đa 10/ngày
  
  // Real-time clock & Calendar
  currentDay: number;
  currentSeason: Season;
  currentYear: number;
  dayPart: 'morning' | 'noon' | 'afternoon' | 'evening';
  timeOfDay: number;
  lastTimestamp: number;
  
  weather: WeatherType;
  weatherDaysRemaining: number;
  
  // Lớp 1: Tính khả biến Seed & Đất
  worldSeed: string;
  startingProfileId: StartingProfileId;
  
  // Plots & Field
  plots: FieldPlot[];
  hasAutoIrrigation: boolean;
  autoWorkersCount: number;
  
  // Livestock
  pens: Record<string, AnimalPen>;
  
  // Storage
  barnCapacity: number;
  hasColdStorage: boolean;
  inventory: InventoryItem[];
  
  // Factories
  factories: Record<string, FactoryBuilding>;
  
  // Logistics & Vehicles
  ownedVehicles: string[];
  activeTrips: TransportTrip[];
  
  // Lớp 2: Tính cách & Hồ sơ chợ
  marketProfiles: Record<string, MarketProfile>;
  demandMultipliers: Record<string, number>;
  orders: OrderItem[];
  
  // Lớp 5: Chuỗi sự kiện có hệ quả
  activeEvent: DynamicFarmEvent | null;
  completedEventDays: number[];
  
  // HỆ THỐNG CHƯỚNG NGẠI & RỦI RO
  difficulty: RiskDifficulty;
  insurance: VillageInsurance;
  defenses: DefenseSystem;
  pendingTaxes: PendingTax[];
  riskAlerts: RiskAlert[];
  recentIncidents: RiskIncidentRecord[];
  disasterCooldown: number; // Ngày đệm an toàn sau thảm họa
  
  // Progression
  stats: GameStats;
  settings: GameSettings;
  
  // Tài chính & Sổ sách (Phase 3)
  transactions: FinancialTransaction[];
  loans: BankLoan[];
  creditScore: number;
  unlockedRegions: string[];

  // Nhiệm vụ chính dẫn dắt (retention)
  mainQuestIndex: number;
  // Thời điểm tạo game — dùng cho boost người mới (15 phút đầu cây lớn nhanh)
  createdAt: number;
}
