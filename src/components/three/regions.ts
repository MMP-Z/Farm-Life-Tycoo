import { RegionInfo } from './zones/VillageZone';

/** Danh sách khu vực + màu nhà 3D — dùng chung cho HubTab 2D/3D và FarmWorld3D. */

export const REGION_COLORS: Record<string, { wall: string; roof: string }> = {
  field: { wall: '#F2E3C2', roof: '#3E8E41' },
  shop: { wall: '#F5E6C8', roof: '#2E9BD6' },
  barn: { wall: '#D9C9A8', roof: '#8A5A33' },
  market: { wall: '#FBE8B0', roof: '#E2725B' },
  pasture: { wall: '#F2E3C2', roof: '#E8A33D' },
  supermarket: { wall: '#E8F0FE', roof: '#E15A5A' },
  workshop: { wall: '#E8E0D0', roof: '#7A6A5A' },
  transport: { wall: '#DCE8F5', roof: '#4A6FA5' },
  admin: { wall: '#F0EDE8', roof: '#5A6A7A' },
};

export interface RegionMeta {
  id: RegionInfo['id'];
  label: string;
  desc: string;
  cost: number;
}

/** Metadata gốc của 9 khu vực (label/desc/cost) — HubTab 2D và world 3D dùng chung. */
export const REGION_METAS: RegionMeta[] = [
  { id: 'field', label: 'Khu Trồng Trọt', desc: 'Gieo hạt và thu hoạch', cost: 0 },
  { id: 'shop', label: 'Cửa Hàng', desc: 'Mua giống, vật tư', cost: 0 },
  { id: 'barn', label: 'Nhà Kho', desc: 'Quản lý vật phẩm', cost: 0 },
  { id: 'market', label: 'Chợ Làng', desc: 'Bán nông sản kiếm lời', cost: 50 },
  { id: 'pasture', label: 'Khu Chăn Nuôi', desc: 'Chăm sóc vật nuôi', cost: 150 },
  { id: 'supermarket', label: 'Siêu Thị', desc: 'Đơn hàng số lượng lớn', cost: 200 },
  { id: 'workshop', label: 'Xưởng Chế Biến', desc: 'Làm bánh, mứt, bơ', cost: 300 },
  { id: 'transport', label: 'Đội Vận Tải', desc: 'Giao hàng đi muôn nơi', cost: 500 },
  { id: 'admin', label: 'Trung Tâm Hành Chính', desc: 'Thuế, bảo hiểm', cost: 1000 },
];

export function buildRegions3D(metas: RegionMeta[]): RegionInfo[] {
  return metas.map((r) => ({
    id: r.id,
    label: r.label,
    desc: r.desc,
    cost: r.cost,
    wall: REGION_COLORS[r.id]?.wall ?? '#F2E3C2',
    roof: REGION_COLORS[r.id]?.roof ?? '#8A5A33',
  }));
}
