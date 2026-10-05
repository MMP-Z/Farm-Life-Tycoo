import {
  FarmGameState,
  RiskAlert,
  RiskIncidentRecord,
  PendingTax,
} from '../types/farmSystem';
import { makeRng, hashString } from '../config/variabilityData';
import { ALL_ITEMS_CATALOG } from '../config/farmData';
import { DIFFICULTY_PRESETS, INSURANCE_CONFIG } from '../config/riskData';

export interface DailyRiskProcessResult {
  nextState: FarmGameState;
  notifications: string[];
}

export function processDailyRisks(
  state: FarmGameState,
  daysAdvanced: number
): DailyRiskProcessResult {
  if (daysAdvanced <= 0) {
    return { nextState: state, notifications: [] };
  }

  const notifications: string[] = [];
  let money = state.money;
  let inventory = [...state.inventory];
  let plots = [...state.plots];
  let insurance = { ...state.insurance };
  let recentIncidents = [...(state.recentIncidents || [])];
  let riskAlerts: RiskAlert[] = [...(state.riskAlerts || [])];
  let pendingTaxes: PendingTax[] = [...(state.pendingTaxes || [])];
  let disasterCooldown = Math.max(0, (state.disasterCooldown || 0) - daysAdvanced);

  const diffMultiplier = DIFFICULTY_PRESETS[state.difficulty || 'standard'].riskMultiplier;
  const rng = makeRng(hashString(`${state.worldSeed}:risk:day_${state.currentDay}`));

  // 1. PITY SYSTEM: Nếu nông dân cạn kiệt vốn (< 20 vàng) và kho trống rỗng
  const totalItemCount = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const readyCrops = plots.filter((p) => p.state === 'ready').length;

  if (money < 20 && totalItemCount < 3 && readyCrops === 0) {
    const reliefGrant = 60;
    money += reliefGrant;
    notifications.push(
      `💌 Hội Đồng Làng gửi tặng gói Cứu Trợ Khẩn Cấp +${reliefGrant} vàng để bạn mua thêm hạt giống phục hồi sản xuất!`
    );
  }

  // 2. CẬP NHẬT CẢNH BÁO THỜI TIẾT SỚM CHO NGÀY MAI
  riskAlerts = riskAlerts
    .map((alert) => ({
      ...alert,
      daysRemaining: alert.daysRemaining - daysAdvanced,
    }))
    .filter((alert) => alert.daysRemaining > 0);

  if (state.weatherDaysRemaining === 1) {
    if (state.weather === 'storm') {
      riskAlerts.push({
        id: `alert_storm_${state.currentDay}`,
        type: 'weather',
        title: 'Cảnh Báo Giông Bão Sắp Đổ Bộ',
        desc: 'Một đợt giông lốc dự kiến quét qua cánh đồng vào ngày mai. Hãy che chắn lưới hoặc thu hoạch sớm!',
        daysRemaining: 1,
        icon: '🌩️',
        severity: 'high',
      });
    } else if (state.weather === 'drought') {
      riskAlerts.push({
        id: `alert_drought_${state.currentDay}`,
        type: 'weather',
        title: 'Nắng Gắt & Hạn Hán Cục Bộ',
        desc: 'Độ ẩm đất sẽ bốc hơi nhanh chóng. Hãy chuẩn bị nước tưới đầy máng!',
        daysRemaining: 1,
        icon: '☀️',
        severity: 'medium',
      });
    }
  }

  // 3. NGUY CƠ THIÊN TAI (CHỈ TỪ NGÀY 4 TRỞ ĐI, COOLDOWN = 0)
  if (state.currentDay >= 4 && disasterCooldown === 0 && diffMultiplier > 0.4) {
    // A. Bão to gây hại cây trồng
    if (state.weather === 'storm' && rng() < 0.45 * diffMultiplier) {
      disasterCooldown = 3; // Nghỉ 3 ngày an toàn

      const unharvestedPlots = plots.filter((p) => p.state === 'growing' || p.state === 'ready');
      if (unharvestedPlots.length > 0) {
        if (state.defenses.hasCropNetting) {
          notifications.push('🛡️ Giông bão quét qua nhưng Nhà Lưới Che Chắn đã bảo vệ toàn bộ hoa màu an toàn!');
          recentIncidents.unshift({
            id: `inc_${state.currentDay}_storm`,
            day: state.currentDay,
            title: 'Giông bão quét qua',
            description: 'Nhà lưới che chắn cản gió thành công, không có ô đất nào bị hư hại!',
            lossAmount: 0,
            insuranceCompensated: 0,
            preventedByDefense: true,
            icon: '🏗️',
          });
        } else {
          // Bị ảnh hưởng tối đa 2 ô (không quá 30% tài sản)
          const damagedCount = Math.min(2, Math.ceil(unharvestedPlots.length * 0.3));
          let lostPlots = 0;

          plots = plots.map((p) => {
            if ((p.state === 'growing' || p.state === 'ready') && lostPlots < damagedCount) {
              lostPlots++;
              return { ...p, state: 'empty' as const, cropId: null, plantedDay: null };
            }
            return p;
          });

          const estimatedLoss = lostPlots * 35;
          let compensation = 0;
          if (insurance.active) {
            compensation = Math.round(estimatedLoss * (insurance.coveragePercent / 100));
            money += compensation;
            insurance.claimsCount += 1;
            insurance.totalCompensated += compensation;
            notifications.push(
              `⛈️ Giông lốc làm dập nát ${lostPlots} luống hoa màu. Bảo hiểm HTX đã bồi thường ngay +${compensation} vàng!`
            );
          } else {
            notifications.push(
              `⛈️ Giông bão đã làm dập nát ${lostPlots} luống hoa màu ngoài trời do chưa có nhà lưới che chắn!`
            );
          }

          recentIncidents.unshift({
            id: `inc_${state.currentDay}_storm`,
            day: state.currentDay,
            title: 'Giông bão làm dập hoa màu',
            description: `Mất ${lostPlots} luống cây ngoài trời. ${compensation > 0 ? `Được bảo hiểm đền +${compensation} vàng.` : 'Không có bảo hiểm.'}`,
            lossAmount: estimatedLoss,
            insuranceCompensated: compensation,
            preventedByDefense: false,
            icon: '⛈️',
          });
        }
      }
    }

    // B. Cáo hoặc Trộm Vặt Ban Đêm
    else if (rng() < 0.28 * diffMultiplier && inventory.length > 0) {
      disasterCooldown = 4;

      if (state.defenses.hasDog) {
        notifications.push('🐕 Gâu gâu! Chú chó Ki-Ki đã phát hiện và dũng cảm xua đuổi kẻ trộm vặt ban đêm!');
        recentIncidents.unshift({
          id: `inc_${state.currentDay}_thief`,
          day: state.currentDay,
          title: 'Kẻ trộm vặt mò vào trang trại',
          description: 'Chú chó Ki-Ki sủa vang và đuổi trộm tháo chạy, kho thóc an toàn tuyệt đối!',
          lossAmount: 0,
          insuranceCompensated: 0,
          preventedByDefense: true,
          icon: '🐕',
        });
      } else {
        // Trộm lấy 5-10% hàng của 1 món trong kho
        const targetItemIdx = Math.floor(rng() * inventory.length);
        const targetItem = inventory[targetItemIdx];
        if (targetItem && targetItem.quantity > 0) {
          const stolenFraction = state.defenses.hasReinforcedLock ? 0.05 : 0.12;
          const stolenQty = Math.max(1, Math.min(targetItem.quantity, Math.round(targetItem.quantity * stolenFraction)));

          inventory = inventory
            .map((item, idx) =>
              idx === targetItemIdx ? { ...item, quantity: item.quantity - stolenQty } : item
            )
            .filter((item) => item.quantity > 0);

          const itemMeta = ALL_ITEMS_CATALOG[targetItem.itemId];
          const estimatedLoss = stolenQty * (itemMeta?.basePrice || 10);
          let compensation = 0;

          if (insurance.active) {
            compensation = Math.round(estimatedLoss * (insurance.coveragePercent / 100));
            money += compensation;
            insurance.claimsCount += 1;
            insurance.totalCompensated += compensation;
            notifications.push(
              `🦊 Cáo mò vào kho lấy trộm ${stolenQty}x ${targetItem.name}. Bảo hiểm HTX bồi thường +${compensation} vàng!`
            );
          } else {
            notifications.push(
              `🦊 Cáo tinh nghịch đột nhập lấy trộm ${stolenQty}x ${targetItem.name}! Hãy nuôi Chó giữ nhà để phòng vệ.`
            );
          }

          recentIncidents.unshift({
            id: `inc_${state.currentDay}_thief`,
            day: state.currentDay,
            title: 'Trộm lẻn vào kho thóc',
            description: `Bị mất ${stolenQty}x ${targetItem.name}. ${compensation > 0 ? `Bảo hiểm bồi thường +${compensation} vàng.` : 'Chưa có khóa kho hoặc chó giữ nhà.'}`,
            lossAmount: estimatedLoss,
            insuranceCompensated: compensation,
            preventedByDefense: false,
            icon: '🦊',
          });
        }
      }
    }
  }

  // 4. KIỂM TRA HẾT HẠN BẢO HIỂM HỢP TÁC XÃ (KỲ HẠN MỖI MÙA)
  if (insurance.active && state.currentDay >= insurance.expiresDay) {
    insurance.active = false;
    notifications.push('🛡️ Gói Bảo Hiểm Nông Nghiệp mùa này đã hết hạn. Hãy vào tab Làng để gia hạn kỳ tiếp theo!');
  }

  // Giữ lại 6 nhật ký sự cố gần nhất
  recentIncidents = recentIncidents.slice(0, 6);

  return {
    nextState: {
      ...state,
      money,
      inventory,
      plots,
      insurance,
      recentIncidents,
      riskAlerts,
      pendingTaxes,
      disasterCooldown,
    },
    notifications,
  };
}
