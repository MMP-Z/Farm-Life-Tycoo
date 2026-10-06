import React from 'react';
import { GameTab } from './NavigationTabs';
import { Trees, Beef, CookingPot, Store, ShoppingBag, Truck, Package, ShieldCheck } from 'lucide-react';

interface Props {
  onSelectTab: (tab: GameTab) => void;
}

export const HubTab: React.FC<Props> = ({ onSelectTab }) => {
  const regions = [
    { id: 'field', label: 'Khu Trồng Trọt', icon: <Trees size={32} className="text-emerald-600" />, desc: 'Gieo hạt và thu hoạch', color: 'bg-emerald-100 border-emerald-300' },
    { id: 'pasture', label: 'Khu Chăn Nuôi', icon: <Beef size={32} className="text-amber-600" />, desc: 'Chăm sóc vật nuôi', color: 'bg-amber-100 border-amber-300' },
    { id: 'workshop', label: 'Xưởng Chế Biến', icon: <CookingPot size={32} className="text-orange-600" />, desc: 'Làm bánh, mứt, bơ', color: 'bg-orange-100 border-orange-300' },
    { id: 'shop', label: 'Cửa Hàng Nông Nghiệp', icon: <Store size={32} className="text-teal-600" />, desc: 'Mua giống, vật tư', color: 'bg-teal-100 border-teal-300' },
    { id: 'market', label: 'Chợ Làng', icon: <ShoppingBag size={32} className="text-blue-600" />, desc: 'Bán nông sản địa phương', color: 'bg-blue-100 border-blue-300' },
    { id: 'transport', label: 'Đội Vận Tải', icon: <Truck size={32} className="text-indigo-600" />, desc: 'Giao hàng đi muôn nơi', color: 'bg-indigo-100 border-indigo-300' },
    { id: 'barn', label: 'Nhà Kho', icon: <Package size={32} className="text-stone-600" />, desc: 'Quản lý vật phẩm', color: 'bg-stone-200 border-stone-400' },
    { id: 'admin', label: 'Trung Tâm Hành Chính', icon: <ShieldCheck size={32} className="text-slate-600" />, desc: 'Thuế, bảo hiểm', color: 'bg-slate-200 border-slate-400' },
  ] as const;

  return (
    <div className="p-4 sm:p-6 pb-24 max-w-4xl mx-auto animation-fade-in">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-display font-bold text-slate-800">Bản Đồ Nông Trại</h2>
        <p className="text-sm text-slate-600">Chọn khu vực bạn muốn quản lý</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => onSelectTab(region.id as GameTab)}
            className={`flex flex-col items-center justify-center p-4 rounded-3xl border-b-4 transition-transform active:scale-95 ${region.color} shadow-sm`}
          >
            <div className="bg-white p-3 rounded-full mb-3 shadow-inner">
              {region.icon}
            </div>
            <span className="font-bold text-slate-800 font-display text-center leading-tight">
              {region.label}
            </span>
            <span className="text-[10px] text-slate-600 mt-1 text-center font-medium">
              {region.desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
