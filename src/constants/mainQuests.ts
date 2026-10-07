import { GameTab } from '../components/NavigationTabs';
import { FarmGameState } from '../types/farmSystem';

export interface MainQuestDef {
  id: string;
  title: string;
  description: string;
  /** Tab điều hướng khi bấm "Đi ngay" */
  targetTab: GameTab;
  /** Vàng thưởng khi hoàn thành */
  rewardCoins: number;
  /** Kiểm tra tiến độ: trả về {current, target, done} */
  checkProgress: (state: FarmGameState) => { current: number; target: number; done: boolean };
}

const hasRegion = (state: FarmGameState, id: string) =>
  (state.unlockedRegions || []).includes(id);

export const MAIN_QUESTS: MainQuestDef[] = [
  {
    id: 'unlock_market',
    title: 'Mở Cửa Chợ Làng',
    description: 'Mở khóa Chợ Làng để bán nông sản kiếm lời',
    targetTab: 'hub',
    rewardCoins: 30,
    checkProgress: (s) => ({ current: hasRegion(s, 'market') ? 1 : 0, target: 1, done: hasRegion(s, 'market') }),
  },
  {
    id: 'earn_200',
    title: 'Tích Lũy Đầu Tiên',
    description: 'Kiếm được tổng 200 vàng trong tay',
    targetTab: 'market',
    rewardCoins: 40,
    checkProgress: (s) => ({ current: Math.min(s.money, 200), target: 200, done: s.money >= 200 }),
  },
  {
    id: 'unlock_pasture',
    title: 'Mở Rộng Chăn Nuôi',
    description: 'Mở khóa Khu Chăn Nuôi để nuôi gia súc',
    targetTab: 'hub',
    rewardCoins: 50,
    checkProgress: (s) => ({ current: hasRegion(s, 'pasture') ? 1 : 0, target: 1, done: hasRegion(s, 'pasture') }),
  },
  {
    id: 'own_chicken',
    title: 'Người Bạn Đầu Tiên',
    description: 'Mua 1 con gà về nuôi',
    targetTab: 'pasture',
    rewardCoins: 40,
    checkProgress: (s) => {
      const pen = s.pens?.['chicken'];
      const count = pen?.animals?.length || 0;
      return { current: Math.min(count, 1), target: 1, done: count >= 1 };
    },
  },
  {
    id: 'earn_500',
    title: 'Nông Dân Khá Giả',
    description: 'Tích lũy 500 vàng',
    targetTab: 'market',
    rewardCoins: 80,
    checkProgress: (s) => ({ current: Math.min(s.money, 500), target: 500, done: s.money >= 500 }),
  },
  {
    id: 'unlock_supermarket',
    title: 'Vươn Ra Siêu Thị',
    description: 'Mở khóa Siêu Thị để nhận đơn hàng lớn',
    targetTab: 'hub',
    rewardCoins: 80,
    checkProgress: (s) => ({ current: hasRegion(s, 'supermarket') ? 1 : 0, target: 1, done: hasRegion(s, 'supermarket') }),
  },
  {
    id: 'earn_1000',
    title: 'Triệu Phú Tương Lai',
    description: 'Tích lũy 1.000 vàng',
    targetTab: 'supermarket',
    rewardCoins: 120,
    checkProgress: (s) => ({ current: Math.min(s.money, 1000), target: 1000, done: s.money >= 1000 }),
  },
  {
    id: 'unlock_workshop',
    title: 'Xưởng Chế Biến',
    description: 'Mở khóa Xưởng để làm bánh, mứt, bơ',
    targetTab: 'hub',
    rewardCoins: 100,
    checkProgress: (s) => ({ current: hasRegion(s, 'workshop') ? 1 : 0, target: 1, done: hasRegion(s, 'workshop') }),
  },
  {
    id: 'earn_2000',
    title: 'Ông Chủ Nông Trại',
    description: 'Tích lũy 2.000 vàng',
    targetTab: 'workshop',
    rewardCoins: 150,
    checkProgress: (s) => ({ current: Math.min(s.money, 2000), target: 2000, done: s.money >= 2000 }),
  },
  {
    id: 'unlock_transport',
    title: 'Đội Vận Tải',
    description: 'Mở khóa Đội Vận Tải để giao hàng xa',
    targetTab: 'hub',
    rewardCoins: 150,
    checkProgress: (s) => ({ current: hasRegion(s, 'transport') ? 1 : 0, target: 1, done: hasRegion(s, 'transport') }),
  },
];

/** Lấy quest hiện tại từ state, null nếu đã xong hết */
export function getCurrentQuest(state: FarmGameState): { def: MainQuestDef; index: number } | null {
  const idx = state.mainQuestIndex ?? 0;
  if (idx >= MAIN_QUESTS.length) return null;
  return { def: MAIN_QUESTS[idx], index: idx };
}
