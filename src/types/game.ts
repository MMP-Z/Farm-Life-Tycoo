export type CropId = 'wheat' | 'carrot' | 'corn' | 'tomato' | 'strawberry' | 'pumpkin';

export interface CropConfig {
  id: CropId;
  name: string;
  nameVi: string;
  growTime: number; // in seconds
  buyCost: number;
  sellPrice: number;
  expReward: number;
  minLevel: number;
  icon: string;
  color: string;
  bgLight: string;
}

export type PlotStatus = 'empty' | 'growing' | 'ready';

export interface FarmPlot {
  id: number;
  cropId: CropId | null;
  plantedAt: number | null; // timestamp in ms
  duration: number; // in seconds
  watered: boolean; // speeds up remaining time by 30%
  fertilized: boolean; // gives +1 bonus harvest
}

export type AnimalId = 'chicken' | 'cow' | 'sheep' | 'pig';

export interface AnimalConfig {
  id: AnimalId;
  name: string;
  nameVi: string;
  produceNameVi: string;
  feedCropId: CropId;
  produceItemId: string;
  produceTime: number; // in seconds
  minLevel: number;
  expReward: number;
  buyCost: number;
  icon: string;
  produceIcon: string;
  color: string;
}

export interface AnimalPen {
  id: AnimalId;
  unlocked: boolean;
  animalCount: number;
  maxAnimals: number;
  isFed: boolean;
  fedAt: number | null;
  duration: number;
  readyToCollect: number; // count of items ready
}

export type FactoryId = 'windmill' | 'bakery' | 'dairy' | 'juicePress';

export interface RecipeConfig {
  id: string;
  nameVi: string;
  factoryId: FactoryId;
  craftTime: number; // seconds
  ingredients: { itemId: string; count: number }[];
  outputCount: number;
  expReward: number;
  sellPrice: number;
  icon: string;
  minLevel: number;
}

export interface FactoryConfig {
  id: FactoryId;
  nameVi: string;
  icon: string;
  color: string;
  minLevel: number;
  cost: number;
  descriptionVi: string;
}

export interface FactoryState {
  id: FactoryId;
  unlocked: boolean;
  activeRecipeId: string | null;
  startedAt: number | null;
  duration: number;
  readyItemsCount: number;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  customerRoleVi: string;
  avatarSeed: string;
  avatarEmoji: string;
  requirements: { itemId: string; nameVi: string; icon: string; count: number }[];
  rewardCoins: number;
  rewardExp: number;
  rewardGems?: number;
}

export interface DeliveryTruckState {
  status: 'idle' | 'delivering' | 'returning';
  departureTime: number | null;
  duration: number; // seconds for round trip
  currentOrderId: string | null;
  pendingReward: { coins: number; exp: number; gems?: number } | null;
}

export type WeatherType = 'sunny' | 'rainy' | 'rainbow' | 'breeze';

export interface WeatherInfo {
  type: WeatherType;
  nameVi: string;
  descriptionVi: string;
  buffVi: string;
  icon: string;
}

export interface DailyQuest {
  id: string;
  titleVi: string;
  descriptionVi: string;
  targetCount: number;
  currentCount: number;
  rewardCoins: number;
  rewardExp: number;
  rewardGems?: number;
  isCompleted: boolean;
  isClaimed: boolean;
  icon: string;
}

export interface Achievement {
  id: string;
  titleVi: string;
  descriptionVi: string;
  icon: string;
  targetCount: number;
  currentCount: number;
  rewardGems: number;
  isUnlocked: boolean;
  isClaimed: boolean;
}

export interface FloatingReward {
  id: string;
  x: number;
  y: number;
  text: string;
  spriteSrc?: string;
  type: 'coin' | 'exp' | 'item' | 'gem';
}

export interface GameState {
  farmerName: string;
  level: number;
  exp: number;
  coins: number;
  gems: number;
  barnCapacity: number;
  inventory: Record<string, number>;
  plots: FarmPlot[];
  animalPens: Record<AnimalId, AnimalPen>;
  factories: Record<FactoryId, FactoryState>;
  orders: CustomerOrder[];
  deliveryTruck: DeliveryTruckState;
  weather: WeatherType;
  weatherChangedAt: number;
  quests: DailyQuest[];
  achievements: Achievement[];
  soundEnabled: boolean;
  gameSpeed: number; // 1, 2, or 5
  stats: {
    cropsHarvested: number;
    animalGoodsCollected: number;
    factoryGoodsProduced: number;
    truckDeliveriesCompleted: number;
    totalCoinsEarned: number;
  };
}
