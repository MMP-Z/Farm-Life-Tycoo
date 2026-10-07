import { CROPS_CONFIG } from '../config/farmData';
import type { FieldPlot, Season } from '../types/farmSystem';

export interface GrowthFactors {
  seasonFactor: number;
  moistureFactor: number;
  perkFactor: number;
  newbieFactor: number;
}

export interface GrowthResult {
  /** Số ngày hiệu dụng đã lớn (bao gồm mọi hệ số) */
  effectiveDays: number;
  /** % tiến triển (0-100) */
  progressPercent: number;
  /** Số ngày còn lại (làm tròn lên) */
  daysLeft: number;
  /** true nếu đã đủ ngày để thu hoạch */
  isReady: boolean;
  /** true nếu dữ liệu plot hợp lệ để tính toán */
  isValid: boolean;
  factors: GrowthFactors;
}

/**
 * Tính toán tăng trưởng cây trồng — HÀM DUY NHẤT dùng cho cả hiển thị (FieldTab)
 * và logic game (timeEngine). Mọi thay đổi hệ số phải sửa ở đây để không bao giờ
 * lệch nhau nữa (bài học từ bug PR #8 và bug cây không lớn).
 *
 * @param plot Ô đất cần tính
 * @param cropId ID cây trồng
 * @param currentDay Ngày hiện tại (số nguyên)
 * @param timeOfDay Phần lẻ trong ngày (0-1)
 * @param currentSeason Mùa hiện tại
 * @param isHardworking Perk nông dân chăm chỉ (1.15x)
 * @param isNewPlayer Boost 15 phút đầu (1.5x)
 */
export function calculateCropGrowth(
  plot: FieldPlot,
  cropId: string,
  currentDay: number,
  timeOfDay: number,
  currentSeason: Season,
  isHardworking: boolean,
  isNewPlayer: boolean = false
): GrowthResult {
  const crop = CROPS_CONFIG[cropId];
  const invalid: GrowthResult = {
    effectiveDays: 0,
    progressPercent: 0,
    daysLeft: 0,
    isReady: false,
    isValid: false,
    factors: { seasonFactor: 1, moistureFactor: 1, perkFactor: 1, newbieFactor: 1 },
  };

  // Dữ liệu không hợp lệ → không tính (tránh NaN lan ra UI)
  if (!crop || plot.plantedDay === null || plot.plantedDay === undefined) {
    return invalid;
  }
  if (typeof plot.plantedDay !== 'number' || isNaN(plot.plantedDay)) {
    return invalid;
  }
  if (!crop.growDays || crop.growDays <= 0) {
    return invalid;
  }

  const isCorrectSeason = crop.seasons.includes(currentSeason);
  const seasonFactor = isCorrectSeason ? 1.0 : 0.67;
  const moistureFactor = plot.moisture > 30 ? 1.0 : 0.5;
  const perkFactor = isHardworking ? 1.15 : 1.0;
  // Boost người mới: 15 phút đầu cây lớn nhanh 50%
  const newbieFactor = isNewPlayer ? 1.5 : 1.0;

  const currentAbsoluteTime = currentDay + (timeOfDay || 0);
  const effectiveDays =
    Math.max(0, currentAbsoluteTime - plot.plantedDay) *
    seasonFactor *
    moistureFactor *
    perkFactor *
    newbieFactor;

  const progressPercent = Math.min(100, Math.floor((effectiveDays / crop.growDays) * 100));
  const daysLeft = Math.max(0, Math.ceil(crop.growDays - effectiveDays));
  const isReady = effectiveDays >= crop.growDays;

  return {
    effectiveDays,
    progressPercent,
    daysLeft,
    isReady,
    isValid: true,
    factors: { seasonFactor, moistureFactor, perkFactor, newbieFactor },
  };
}

/**
 * Kiểm tra plot có bị kẹt (đang growing nhưng dữ liệu không hợp lệ để lớn)
 * hay không. Dùng để tự sửa thay vì để cây đứng yên vĩnh viễn.
 */
export function isPlotStuck(plot: FieldPlot): boolean {
  if (plot.state !== 'growing' || !plot.cropId) return false;
  const crop = CROPS_CONFIG[plot.cropId];
  if (!crop) return true; // cropId không tồn tại trong config
  if (plot.plantedDay === null || plot.plantedDay === undefined) return true;
  if (typeof plot.plantedDay !== 'number' || isNaN(plot.plantedDay)) return true;
  return false;
}
