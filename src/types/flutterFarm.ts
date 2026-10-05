export type FarmZoneId =
  | 'overview'
  | 'farm_house'
  | 'tomato_field'
  | 'vegetable_field'
  | 'corn_field'
  | 'animal_area'
  | 'storage_pond';

export interface FarmZoneData {
  id: FarmZoneId;
  name: string;
  cropOrType: string;
  healthStatus: 'Tuyệt hảo' | 'Tốt' | 'Khỏe mạnh' | 'Cần chú ý';
  growthPercent?: number;
  soilMoisture?: number;
  expectedHarvest?: string;
  animalsCount?: number;
  healthPercent?: number;
  nextFeedTime?: string;
  icon: string;
  badge: string;
  description: string;
  area: string;
}

export interface CowDetail {
  id: string;
  name: string;
  breed: string;
  age: string;
  milkOutput: string;
  health: number;
  status: 'Đang vắt sữa' | 'Nghỉ ngơi' | 'Gặm cỏ';
  avatar: string;
}

export interface FeedingCheckpoint {
  time: string;
  label: string;
  feedType: string;
  status: 'done' | 'upcoming' | 'missed';
}

export type MainNavTab = 'farm' | 'livestock' | 'analytics' | 'harvest' | 'profile';
