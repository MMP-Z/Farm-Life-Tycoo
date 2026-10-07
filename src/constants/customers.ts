/** Pool khách hàng đa dạng cho Siêu Thị — tránh trùng lặp */
export interface CustomerDef {
  name: string;
  avatar: string; // emoji key trong CUSTOMER_SPRITES
}

export const CUSTOMER_POOL: CustomerDef[] = [
  { name: 'Bác Ba Quán Phở', avatar: '👨‍🍳' },
  { name: 'Cô Lan Bách Hóa', avatar: '👩‍💼' },
  { name: 'Anh Tư Nông Sản', avatar: '👨‍🌾' },
  { name: 'Bé Na Kẹo Mút', avatar: '👧' },
  { name: 'Chú Sáu Chợ Đầu Mối', avatar: '👨‍🌾' },
  { name: 'Dì Bảy Bánh Mì', avatar: '👩‍💼' },
  { name: 'Cậu Tám Trà Sữa', avatar: '👨‍🍳' },
  { name: 'Mợ Chín Gánh Hàng', avatar: '👧' },
];

/**
 * Chọn ngẫu nhiên 1 khách chưa có trong đơn đang hoạt động.
 * Đảm bảo không trùng tên khách.
 */
export function pickUniqueCustomer(existingNames: string[]): CustomerDef {
  const available = CUSTOMER_POOL.filter((c) => !existingNames.includes(c.name));
  const pool = available.length > 0 ? available : CUSTOMER_POOL;
  return pool[Math.floor(Math.random() * pool.length)];
}
