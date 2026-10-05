import { RiskDifficulty } from '../types/farmSystem';

export interface DefenseItemDef {
  id: 'dog' | 'reinforced_lock' | 'crop_netting' | 'vaccine';
  name: string;
  icon: string;
  cost: number;
  description: string;
  benefit: string;
  maintenanceNote?: string;
}

export const DEFENSE_ITEMS_CONFIG: Record<string, DefenseItemDef> = {
  dog: {
    id: 'dog',
    name: 'Chú Chó Giữ Nhà Ki-Ki',
    icon: '🐕',
    cost: 180,
    description: 'Chú chó Shiba thông minh trung thành, tuần tra nông trại suốt ngày đêm.',
    benefit: 'Giảm 75% nguy cơ bị Cáo và Kẻ trộm vặt ghé thăm chuồng/kho.',
    maintenanceNote: 'Tự động cho ăn bằng thức ăn trong nông trại',
  },
  reinforced_lock: {
    id: 'reinforced_lock',
    name: 'Khóa Chống Trộm & Đèn Pha',
    icon: '🔒',
    cost: 150,
    description: 'Gia cố cửa kho thóc bằng then đồng đúc và hệ thống đèn cảm biến chuyển động.',
    benefit: 'Nếu có trộm đột nhập, thiệt hại mất mát nông sản giảm 60%.',
  },
  crop_netting: {
    id: 'crop_netting',
    name: 'Nhà Lưới Che Chắn & Cống Tiêu',
    icon: '🏗️',
    cost: 220,
    description: 'Dựng khung vòm phủ lưới cản gió bão và rãnh thoát nước chống ngập úng.',
    benefit: 'Bảo vệ hoa màu giảm 70% tỷ lệ dập nát khi có Bão giông lớn.',
  },
  vaccine: {
    id: 'vaccine',
    name: 'Gói Vắc-xin Phòng Dịch Thú Y',
    icon: '💉',
    cost: 80,
    description: 'Tiêm phòng dịch cúm và sốt cho toàn bộ gia súc, gia cầm trong chuồng.',
    benefit: 'Vật nuôi chuồng được tiêm sẽ miễn nhiễm hoàn toàn với các đợt dịch bệnh lây lan.',
  },
};

export const INSURANCE_CONFIG = {
  name: 'Bảo Hiểm Nông Nghiệp Hợp Tác Xã',
  icon: '🛡️',
  costPerSeason: 60,
  coveragePercent: 70, // Đền bù 70% tổn thất
  description: 'Quỹ tương trợ nông nghiệp địa phương bảo vệ bạn trước thiên tai, lũ bão, dịch bệnh và cướp đường.',
};

export const DIFFICULTY_PRESETS: Record<
  RiskDifficulty,
  { name: string; icon: string; description: string; riskMultiplier: number }
> = {
  relaxed: {
    name: 'Thư Giãn (Cozy)',
    icon: '🌸',
    description: 'Thiên tai nhẹ, không bị cướp bóc hay sâu bệnh quấy phá. Dành cho trải nghiệm trồng trọt yên bình.',
    riskMultiplier: 0.3,
  },
  standard: {
    name: 'Tiêu Chuẩn (Standard)',
    icon: '⚖️',
    description: 'Cân bằng giữa thử thách và niềm vui. Rủi ro báo trước từ 1-2 ngày để kịp thời chuẩn bị.',
    riskMultiplier: 1.0,
  },
  challenging: {
    name: 'Thử Thách (Challenging)',
    icon: '⚡',
    description: 'Thời tiết khắc nghiệt hơn, Băng Mèo Chợ Đen hoạt động mạnh, yêu cầu chiến lược phòng thủ vững vàng.',
    riskMultiplier: 1.6,
  },
};
