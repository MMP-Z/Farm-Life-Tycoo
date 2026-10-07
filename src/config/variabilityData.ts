import {
  SoilType,
  SoilDefinition,
  StartingProfile,
  MarketTraitId,
  DynamicFarmEvent,
  Season,
} from '../types/farmSystem';

// ==========================================
// 1. LỚP 1: CẤU HÌNH LOẠI ĐẤT & BẢN ĐỒ
// ==========================================
export const SOIL_CONFIG: Record<SoilType, SoilDefinition> = {
  alluvial: {
    id: 'alluvial',
    name: 'Đất Phù Sa',
    icon: '🌊',
    color: 'from-[#4D3626] to-[#3B281B]',
    textColor: 'text-amber-200',
    description: 'Bồi đắp ven sông phì nhiêu, giữ ẩm xuất sắc, rất thích hợp cho lúa mì và các loại rau màu.',
    pros: 'Năng suất lúa mì +25%, giữ ẩm lâu hơn +30%',
    cons: 'Kém thích hợp cho các loại củ ăn sâu',
    baseFertilityBonus: 15,
    moistureRetentionRate: 1.3,
    pestResistance: 0,
  },
  sandy: {
    id: 'sandy',
    name: 'Đất Cát Pha',
    icon: '🏖️',
    color: 'from-[#8C6D46] to-[#735532]',
    textColor: 'text-amber-100',
    description: 'Thoát nước nhanh, xốp mịn, củ quả phát triển tròn đều ngọt lịm. Thích hợp cho Bí Ngô và Cà Rốt.',
    pros: 'Năng suất Bí ngô & Cà rốt +25%',
    cons: 'Nhanh khô hạn, cần tưới nước thường xuyên',
    baseFertilityBonus: 5,
    moistureRetentionRate: 0.7,
    pestResistance: 0.1,
  },
  clay: {
    id: 'clay',
    name: 'Đất Sét Nặng',
    icon: '🧱',
    color: 'from-[#5C3A21] to-[#452914]',
    textColor: 'text-orange-200',
    description: 'Độ kết dính cao, giữ nước và chất dinh dưỡng lâu bền. Rất hợp cây rễ khỏe như Bắp Ngô.',
    pros: 'Năng suất Bắp ngô +25%, độ ẩm giữ rất lâu',
    cons: 'Rau mềm phát triển chậm hơn',
    baseFertilityBonus: 10,
    moistureRetentionRate: 1.4,
    pestResistance: 0,
  },
  hill: {
    id: 'hill',
    name: 'Đất Đồi Đỏ',
    icon: '⛰️',
    color: 'from-[#6E3524] to-[#542517]',
    textColor: 'text-rose-200',
    description: 'Thoát nước tốt, ánh nắng dồi dào, rất ít sâu bệnh. Thích hợp nhất cho Dâu Tây và Cà Chua.',
    pros: 'Năng suất Dâu tây & Cà chua +30%, giảm sâu bệnh -50%',
    cons: 'Độ phì tự nhiên ban đầu thấp hơn',
    baseFertilityBonus: 0,
    moistureRetentionRate: 0.9,
    pestResistance: 0.5,
  },
};

// Hệ số sản lượng cây trồng theo loại đất (0.75x đến 1.3x)
export const SOIL_CROP_MULTIPLIERS: Record<string, Record<SoilType, number>> = {
  wheat: {
    alluvial: 1.25,
    clay: 1.15,
    sandy: 0.8,
    hill: 0.85,
  },
  carrot: {
    sandy: 1.25,
    alluvial: 1.15,
    hill: 0.95,
    clay: 0.75,
  },
  tomato: {
    hill: 1.25,
    alluvial: 1.1,
    sandy: 1.0,
    clay: 0.8,
  },
  corn: {
    clay: 1.25,
    alluvial: 1.15,
    sandy: 0.85,
    hill: 0.8,
  },
  pumpkin: {
    sandy: 1.3,
    alluvial: 1.1,
    hill: 0.9,
    clay: 0.8,
  },
  strawberry: {
    hill: 1.3,
    sandy: 1.15,
    alluvial: 1.0,
    clay: 0.7,
  },
};

// ==========================================
// 2. LỚP 2: TÍNH CÁCH CHỢ & NHÓM HÀNG ƯA CHUỘNG
// ==========================================
export const MARKET_TRAITS_CONFIG: Record<
  MarketTraitId,
  { name: string; icon: string; description: string; priceMultiplier: number }
> = {
  picky: {
    name: 'Kén Chất Lượng',
    icon: '⭐',
    description: 'Chỉ chuộng mặt hàng tươi ngon hoàn hảo. Giá mua cao hơn +30% nhưng không chấp nhận hàng ứ đọng.',
    priceMultiplier: 1.3,
  },
  fresh_lover: {
    name: 'Chuộng Hàng Tươi Sống',
    icon: '🥗',
    description: 'Hoa màu thu hoạch tươi được trả giá thêm +25%, thành phẩm khô hoặc chế biến bị dìm -10%.',
    priceMultiplier: 1.25,
  },
  stable: {
    name: 'Thị Trường Ổn Định',
    icon: '⚖️',
    description: 'Sức mua bền bỉ, nhu cầu hồi phục cực nhanh sau khi bán số lượng lớn. Giá cả chuẩn mực, ít rủi ro.',
    priceMultiplier: 1.05,
  },
  wholesale: {
    name: 'Chợ Đầu Mối Lớn',
    icon: '📦',
    description: 'Thu mua số lượng không giới hạn, rất ít khi bị bão hòa rớt giá. Thích hợp cho các chuyến xe tải lớn.',
    priceMultiplier: 1.1,
  },
  volatile: {
    name: 'Chợ Biến Động',
    icon: '📈',
    description: 'Giá cả dao động mạnh theo từng đợt (±30%). Cơ hội trúng lớn cho thương gia nhạy bén với tin tức!',
    priceMultiplier: 1.35,
  },
};

// ==========================================
// 3. LỚP 3: HỒ SƠ KHỞI ĐẦU (STARTING PROFILES)
// ==========================================
export const STARTING_PROFILES_CONFIG: Record<string, StartingProfile> = {
  hardworking_farmer: {
    id: 'hardworking_farmer',
    name: 'Nông Dân Chăm Chỉ',
    icon: '🧑‍🌾',
    style: 'Trồng trọt truyền thống',
    description: 'Gia đình có truyền thống trồng trọt lâu đời, hiểu rõ đặc tính từng giống cây và đất đai.',
    perkName: 'Bàn Tay Xanh (+15% Tốc Độ)',
    perkDescription: 'Tất cả cây trồng trên ruộng lớn nhanh hơn +15% so với bình thường.',
    initialMoney: 300,
    plotCount: 6,
    defaultSoil: 'alluvial',
    bonusItems: [
      { itemId: 'wheat_seed', quantity: 8 },
      { itemId: 'carrot_seed', quantity: 6 },
      { itemId: 'fertilizer', quantity: 4 },
    ],
  },
  rancher: {
    id: 'rancher',
    name: 'Chủ Trại Chăn Nuôi',
    icon: '🤠',
    style: 'Chăn nuôi gia súc & gia cầm',
    description: 'Yêu thương động vật, mở đầu với chuồng gà sẵn có và đàn gà con ríu rít tìm mồi.',
    perkName: 'Vật Nuôi Thân Thiện (+20% Vui Vẻ)',
    perkDescription: 'Vật nuôi mau đạt trạng thái vui vẻ, giảm chu kỳ cho trứng/sữa nhanh hơn 1 ngày.',
    initialMoney: 380,
    plotCount: 4,
    defaultSoil: 'alluvial',
    bonusPens: [{ penType: 'chicken', animalCount: 2 }],
    bonusItems: [
      { itemId: 'wheat_seed', quantity: 5 },
      { itemId: 'vet_medicine', quantity: 2 },
    ],
  },
  merchant: {
    id: 'merchant',
    name: 'Thương Gia Giao Thương',
    icon: '🎩',
    style: 'Logistics & Vận tải liên vùng',
    description: 'Khởi nghiệp với xe bò kéo sẵn sàng, am hiểu các tuyến đường chợ xa và mạng lưới buôn bán.',
    perkName: 'Mối Buôn Uy Tín (+12% Giá Chợ Xa)',
    perkDescription: 'Các chuyến xe vận tải tới Chợ Huyện và Thành Phố nhận thêm +12% tổng tiền hàng.',
    initialMoney: 550,
    plotCount: 3,
    defaultSoil: 'sandy',
    // FIX (P0): 'wheelbarrow' không tồn tại trong VEHICLES_CONFIG (chỉ có
    // handcart/ox_cart/small_truck/refrigerated_truck) khiến perk xe khởi đầu
    // của profile Thương Gia bị mất trắng.
    bonusVehicles: ['handcart', 'ox_cart'],
    bonusItems: [
      { itemId: 'wheat_seed', quantity: 4 },
      { itemId: 'corn_seed', quantity: 4 },
    ],
  },
  chef: {
    id: 'chef',
    name: 'Thợ Bánh & Chế Biến',
    icon: '👨‍🍳',
    style: 'Chế biến & Nâng cao giá trị',
    description: 'Sở hữu ngay Lò Nướng Bánh Mì gia truyền, biến hoa màu thu hoạch thành món ăn đắt khách.',
    perkName: 'Bếp Trưởng Tài Ba (+20% Giá Bánh)',
    perkDescription: 'Tất cả thành phẩm chế biến (Bánh mì, Bơ, Phô mai, Mứt) bán được giá cao hơn +20%.',
    initialMoney: 350,
    plotCount: 4,
    defaultSoil: 'clay',
    bonusFactories: ['bakery'],
    bonusItems: [
      { itemId: 'wheat_seed', quantity: 8 },
      { itemId: 'bread', quantity: 3 },
    ],
  },
  heir: {
    id: 'heir',
    name: 'Người Thừa Kế Đất Rộng',
    icon: '📜',
    style: 'Khai hoang & Hạt giống quý',
    description: 'Thừa kế khu đất cổ 8 ô đất pha cát và đồi rộng lớn, cùng túi hạt giống Dâu Tây Hoàng Gia.',
    perkName: 'Cơ Đồ Thừa Kế (8 Ô Đất + Giống Quý)',
    perkDescription: 'Bắt đầu với diện tích 8 ô đất và 5 hạt giống Dâu Tây ngọt lịm từ đầu.',
    initialMoney: 180,
    plotCount: 8,
    defaultSoil: 'hill',
    bonusItems: [
      { itemId: 'strawberry_seed', quantity: 5 },
      { itemId: 'fertilizer', quantity: 5 },
    ],
  },
};

// ==========================================
// 5. LỚP 5: CHUỖI SỰ KIỆN TƯƠNG TÁC CÓ LỰA CHỌN
// ==========================================
export const DYNAMIC_EVENTS_POOL: {
  title: string;
  description: string;
  icon: string;
  characterName: string;
  choices: {
    text: string;
    actionDesc: string;
    effectType: 'grant_money' | 'pay_money' | 'grant_items' | 'water_all' | 'boost_market' | 'none';
    moneyAmount?: number;
    items?: { itemId: string; quantity: number }[];
    toastResult: string;
  }[];
}[] = [
  {
    title: 'Thương Nhân Du Mục Ghé Thăm',
    description: 'Một vị thương khách cưỡi lạc đà ghé qua nông trại, mang theo túi hạt giống bí truyền và muốn trao đổi vật phẩm.',
    icon: '👳‍♂️',
    characterName: 'Thương khách Ali',
    choices: [
      {
        text: 'Mua túi hạt giống bí truyền (80 vàng)',
        actionDesc: 'Tốn 80 vàng để nhận 4 hạt Dâu tây & 4 hạt Bí ngô',
        effectType: 'pay_money',
        moneyAmount: 80,
        items: [
          { itemId: 'strawberry_seed', quantity: 4 },
          { itemId: 'pumpkin_seed', quantity: 4 },
        ],
        toastResult: 'Bạn đã mua được túi hạt giống quý giá từ vị thương nhân du mục!',
      },
      {
        text: 'Lịch sự từ chối và tặng ông chén nước',
        actionDesc: 'Không tốn chi phí, nhận lời chúc may mắn',
        effectType: 'none',
        toastResult: 'Thương nhân mỉm cười cảm ơn sự hiếu khách và chúc vụ mùa bội thu.',
      },
    ],
  },
  {
    title: 'Chuyên Gia Khuyến Nông Tỉnh Ghé Thăm',
    description: 'Kỹ sư nông nghiệp ghé kiểm tra thổ nhưỡng cánh đồng và đề xuất trao tặng phân bón vi sinh cải tạo đất.',
    icon: '👨‍🔬',
    characterName: 'Kỹ sư Hoàng Nam',
    choices: [
      {
        text: 'Nhận gói tài trợ phân bón vi sinh miễn phí',
        actionDesc: 'Nhận ngay 4 bao phân bón hữu cơ cao cấp vào kho',
        effectType: 'grant_items',
        items: [{ itemId: 'fertilizer', quantity: 4 }],
        toastResult: 'Nhận được 4 bao phân bón vi sinh cải tạo độ phì nhiêu của đất!',
      },
      {
        text: 'Nhờ kỹ sư tư vấn kỹ thuật tưới tự nhiên',
        actionDesc: 'Kỹ sư mở cống dẫn nước tưới đẫm toàn bộ các luống đất',
        effectType: 'water_all',
        toastResult: 'Kỹ sư hướng dẫn xả nước tưới mát lành cho toàn bộ luống đất!',
      },
    ],
  },
  {
    title: 'Hội Chợ Ẩm Thực Làng Xã',
    description: 'Làng tổ chức hội chợ xúc tiến tiêu thụ nông sản. Người dân khắp nơi đổ về mua sắm rất đông đúc!',
    icon: '🎪',
    characterName: 'Trưởng ban Hội chợ',
    choices: [
      {
        text: 'Mở sạp hàng trưng bày nông sản (Đóng quỹ 50 vàng)',
        actionDesc: 'Đóng 50 vàng phí thuê sạp, nhận tiền thưởng doanh thu 150 vàng',
        effectType: 'grant_money',
        moneyAmount: 100, // net +100
        toastResult: 'Sạp hàng của bạn bán rất chạy! Thu về 150 vàng (lãi ròng +100 vàng)!',
      },
      {
        text: 'Chỉ dạo chơi tham quan hội chợ',
        actionDesc: 'Không tốn chi phí',
        effectType: 'none',
        toastResult: 'Bạn có một buổi dạo chơi hội chợ thật vui vẻ và thư giãn.',
      },
    ],
  },
  {
    title: 'Cơn Mưa Rào Mát Lành Đầu Mùa',
    description: 'Bầu trời dịu lại và một cơn mưa rào mùa hạ trút xuống, xua tan cái nóng oi bức của đất trời.',
    icon: '🌧️',
    characterName: 'Mẹ Thiên Nhiên',
    choices: [
      {
        text: 'Hứng nước mưa và để ruộng ngấm đều',
        actionDesc: 'Độ ẩm toàn bộ ô đất được phục hồi tối đa 100%',
        effectType: 'water_all',
        toastResult: 'Cơn mưa tưới tắm đẫm nước cho tất cả các luống cây trên cánh đồng!',
      },
    ],
  },
  {
    title: 'Quỹ Hỗ Trợ Nông Thôn Mới',
    description: 'Hợp tác xã nông nghiệp trao tặng học bổng và quỹ khen thưởng cho nông dân tích cực canh tác.',
    icon: '🏆',
    characterName: 'Chủ tịch Hợp tác xã',
    choices: [
      {
        text: 'Nhận phần thưởng khuyến nông (120 vàng)',
        actionDesc: 'Cộng trực tiếp 120 vàng vào ngân quỹ nông trại',
        effectType: 'grant_money',
        moneyAmount: 120,
        toastResult: 'Chúc mừng bạn đã nhận 120 vàng từ Quỹ khuyến nông xã!',
      },
    ],
  },
];

// ==========================================
// 6. THUẬT TOÁN PRNG SEED CHUẨN (mulberry32)
// ==========================================
export function hashString(str: string): number {
  let hash = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  return hash >>> 0;
}

export function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateRandomSeed(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let res = 'FARM-';
  for (let i = 0; i < 4; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}
