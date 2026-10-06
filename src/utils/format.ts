// Chuẩn hiển thị tiền tệ trong toàn game.
// Mọi chỗ hiển thị số tiền (giá, phí, thưởng) đều dùng formatMoney + icon 💰
// đặt TRƯỚC số: `💰 {formatMoney(n)}`.
// Trong câu văn xuôi thì dùng chữ "vàng" (vd: "Không đủ vàng").
export function formatMoney(n: number): string {
  if (!Number.isFinite(n)) return '0';
  return Math.floor(n).toLocaleString('vi-VN');
}
