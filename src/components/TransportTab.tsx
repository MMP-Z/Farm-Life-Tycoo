import React, { useState } from 'react';
import { InventoryItem, TransportTrip, VehicleDefinition, MarketProfile } from '../types/farmSystem';
import { VEHICLES_CONFIG, ROUTES_CONFIG, ALL_ITEMS_CATALOG } from '../config/farmData';
import { MARKET_TRAITS_CONFIG } from '../config/variabilityData';
import { Truck, MapPin, Package, ArrowRight, Clock, AlertTriangle, Plus, Check } from 'lucide-react';
import { sound } from '../utils/sound';
import { formatMoney } from '../utils/format';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';

interface Props {
  ownedVehicles: string[];
  activeTrips: TransportTrip[];
  inventory: InventoryItem[];
  currentDay: number;
  money: number;
  playerLevel: number;
  marketProfiles?: Record<string, MarketProfile>;
  onDispatchTrip: (
    vehicleId: string,
    routeId: string,
    cargo: { itemId: string; name: string; icon: string; quantity: number; unitPrice: number }[],
    fee: number,
    estimatedEarnings: number
  ) => void;
  onBuyVehicle: (vehicleId: string) => void;
}

export const TransportTab: React.FC<Props> = ({
  ownedVehicles,
  activeTrips,
  inventory,
  currentDay,
  money,
  playerLevel,
  marketProfiles = {},
  onDispatchTrip,
  onBuyVehicle,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('handcart');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('village');
  const [cargoManifest, setCargoManifest] = useState<Record<string, number>>({});
  const [showMarketProfiles, setShowMarketProfiles] = useState(false);

  const vehicleDef = VEHICLES_CONFIG[selectedVehicleId] || VEHICLES_CONFIG.handcart;
  const routeDef = ROUTES_CONFIG[selectedRouteId] || ROUTES_CONFIG.village;

  // Calculate current loaded weight
  const currentLoadedWeight = Object.values(cargoManifest).reduce((sum, q) => sum + q, 0);

  // Calculate total earnings
  let totalEstimatedEarnings = 0;
  const cargoItems = Object.entries(cargoManifest)
    .filter(([_, q]) => q > 0)
    .map(([itemId, quantity]) => {
      const meta = ALL_ITEMS_CATALOG[itemId];
      const base = meta?.basePrice || 10;
      const unitPrice = Math.round(base * (1 + routeDef.priceBonusPercent / 100));
      totalEstimatedEarnings += unitPrice * quantity;
      return {
        itemId,
        name: meta?.name || itemId,
        icon: meta?.icon || '📦',
        quantity,
        unitPrice,
      };
    });

  const handleCargoChange = (itemId: string, delta: number, maxAvailable: number) => {
    const current = cargoManifest[itemId] || 0;
    const next = Math.max(0, current + delta);
    if (next > maxAvailable) return;
    if (currentLoadedWeight + (next - current) > vehicleDef.capacity) return;

    setCargoManifest((prev) => ({
      ...prev,
      [itemId]: next,
    }));
    sound.playClick();
  };

  const handleDispatch = () => {
    if (cargoItems.length === 0) return;
    if (money < vehicleDef.cost) return;

    onDispatchTrip(
      selectedVehicleId,
      selectedRouteId,
      cargoItems,
      vehicleDef.cost,
      totalEstimatedEarnings
    );
    setCargoManifest({});
    sound.playTruck();
  };

  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      
      {/* Header */}
      <div className="px-panel p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-amber-50 border flex items-center justify-center text-3xl border-[3px] border-[#3a2b3f]">
            <GameIcon e="🚚" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
              Đội Xe Vận Tải & Tuyến Đường Bán Hàng
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Chọn phương tiện phù hợp, xếp hàng hóa và vận chuyển đến các chợ trung tâm để bán được giá cao hơn
            </p>
          </div>
        </div>
      </div>

      {/* Bảng Tin Tính Cách & Thị Hiếu Chợ (Market Traits) */}
      {Object.keys(marketProfiles).length > 0 && (
        <div className="px-panel p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-xl"><GameIcon e="🗺" />️</span>
                <h3 className="font-black text-sm sm:text-base text-slate-900 font-display">
                  Thị Hiếu & Tính Cách Các Khu Chợ
                </h3>
              </div>
              <button
                onClick={() => setShowMarketProfiles(!showMarketProfiles)}
                className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-full transition-all cursor-pointer"
              >
                {showMarketProfiles ? 'Thu gọn' : 'Xem chi tiết'}
              </button>
            </div>
          </div>

          {showMarketProfiles && (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide mt-3">
              {Object.values(marketProfiles).map((prof) => {
                const traitMeta = MARKET_TRAITS_CONFIG[prof.trait] || MARKET_TRAITS_CONFIG.stable;

                return (
                  <div
                    key={prof.routeId}
                    className="min-w-[260px] max-w-[280px] snap-start p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2] flex flex-col justify-between text-xs flex-shrink-0"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5 gap-2">
                        <h4 className="font-black text-sm text-slate-900 font-display truncate">{prof.routeName}</h4>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex-shrink-0">
                          <GameIcon e={traitMeta.icon} /> {traitMeta.name}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {traitMeta.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-700 whitespace-nowrap">Ưa chuộng (+25%):</span>
                        <span className="flex items-center gap-1 justify-end">
                          {prof.preferredItems.map((id) => (
                            <span key={id} title={ALL_ITEMS_CATALOG[id]?.name}>
                              {ALL_ITEMS_CATALOG[id]?.icon || id}
                            </span>
                          ))}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-rose-600 whitespace-nowrap">Dìm giá (-15%):</span>
                        <span className="flex items-center gap-1 justify-end">
                          {prof.discountedItems.map((id) => (
                            <span key={id} title={ALL_ITEMS_CATALOG[id]?.name}>
                              {ALL_ITEMS_CATALOG[id]?.icon || id}
                            </span>
                          ))}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {/* Active Trips on the road */}
      {activeTrips.length > 0 && (
        <div className="px-panel p-5">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Truck size={16} className="text-amber-700" />
            <span>Chuyến Hàng Đang Lăn Bánh Trên Đường:</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeTrips.map((trip) => {
              const v = VEHICLES_CONFIG[trip.vehicleId];
              const r = ROUTES_CONFIG[trip.routeId];
              const elapsed = currentDay - trip.startDay;
              const isArrived = trip.status === 'arrived';

              return (
                <div
                  key={trip.id}
                  className="bg-white p-4 rounded-2xl border border-[#E8E2D2] shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl filter drop-shadow-xs">{v?.icon ? <GameIcon e={v.icon} /> : <GameIcon e="🚚" />}</span>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">{v?.name} → {r?.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        Chở: {trip.cargo.map((c) => `${c.quantity}x ${c.name}`).join(', ')}
                      </p>
                      <span className="text-[11px] text-emerald-800 font-mono font-bold">
                        Dự kiến thu: +<CoinIcon /> {trip.totalEarnings.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                    {isArrived ? 'Đã giao xong' : `Đang đi (${elapsed}/${trip.durationDays}d)`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 1: Chọn Xe & Mua Xe Mới */}
      <div className="px-panel p-5">
        <h3 className="font-extrabold text-sm text-slate-800 mb-3 flex items-center gap-1.5 font-display">
          <span>1. Chọn Phương Tiện Vận Tải:</span>
        </h3>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">
          {Object.values(VEHICLES_CONFIG).map((v) => {
            const isOwned = ownedVehicles.includes(v.id);
            const isSelected = selectedVehicleId === v.id;
            const canUnlock = true;

            return (
              <div
                key={v.id}
                onClick={() => {
                  if (isOwned) {
                    setSelectedVehicleId(v.id);
                    sound.playClick();
                  }
                }}
                className={`min-w-[200px] snap-start p-4 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer flex-shrink-0 ${
                  !isOwned
                    ? 'bg-slate-50 border-slate-200'
                    : isSelected
                    ? 'bg-[#2E4A35] text-white border-[#2E4A35] shadow-md ring-2 ring-[#2E4A35]/20 scale-102'
                    : 'bg-[#FAF8F2] border-[#E8E2D2] hover:bg-white text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl"><GameIcon e={v.icon} /></span>
                    {v.isColdStorage && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-sky-800 text-sky-100' : 'bg-sky-100 text-sky-800'
                      }`}>
                        Thùng lạnh
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm leading-tight font-display">{v.name}</h4>
                  <p className="text-xs opacity-80 mt-1">Tải trọng: <strong className="font-mono">{v.capacity} kg</strong></p>
                  <p className="text-[11px] opacity-75">Chi phí chuyến: <CoinIcon /> {formatMoney(v.cost)}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-current/15">
                  {isOwned ? (
                    <span className="text-xs font-bold flex items-center gap-1">
                      <Check size={13} className="stroke-[3]" /> Sẵn sàng chạy
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuyVehicle(v.id);
                      }}
                      disabled={money < v.buyPrice}
                      className={`w-full py-1.5 px-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        money >= v.buyPrice ? 'bg-[#2E4A35] text-white hover:bg-[#233a29]' : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      Mua xe (<CoinIcon /> {formatMoney(v.buyPrice)})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Chọn Tuyến Đường / Thị Trường */}
      <div className="px-panel p-5">
        <h3 className="font-extrabold text-sm text-slate-800 mb-3 flex items-center gap-1.5 font-display">
          <span>2. Chọn Tuyến Đường Đi Chợ:</span>
        </h3>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">
          {Object.values(ROUTES_CONFIG).map((r) => {
            const isSupported = vehicleDef.routes ? vehicleDef.routes.includes(r.id) : true;
            const isSelected = selectedRouteId === r.id;
            const isUnlocked = true;

            return (
              <button
                key={r.id}
                onClick={() => {
                  if (isSupported && isUnlocked) {
                    setSelectedRouteId(r.id);
                    sound.playClick();
                  }
                }}
                disabled={!isSupported || !isUnlocked}
                className={`min-w-[200px] snap-start p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer flex-shrink-0 ${
                  !isSupported || !isUnlocked
                    ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                    : isSelected
                    ? 'bg-[#2E4A35] text-white border-[#2E4A35] shadow-md ring-2 ring-[#2E4A35]/20 scale-102'
                    : 'bg-[#FAF8F2] border-[#E8E2D2] text-slate-900 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl"><GameIcon e="📍" /></span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {r.priceBonusPercent > 0 ? `+${r.priceBonusPercent}% Giá Bán` : 'Giá Chuẩn'}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm leading-tight font-display">{r.name}</h4>
                  <p className="text-xs opacity-80 mt-1">Cự ly: {r.distance}</p>
                  <p className="text-[11px] opacity-75">Thời gian đi: {r.travelDays === 0 ? 'Tức thì' : `${r.travelDays} ngày`}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Xếp Hàng Hóa Lên Xe & Khởi Hành */}
      <div className="px-panel p-5">
        <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
          <h3 className="font-extrabold text-sm text-slate-800 font-display">
            3. Xếp Hàng Từ Kho Lên {vehicleDef.name}:
          </h3>
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${
            currentLoadedWeight >= vehicleDef.capacity ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
          }`}>
            Đã tải: {currentLoadedWeight} / {vehicleDef.capacity} kg
          </span>
        </div>

        {inventory.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4">Kho trống! Không có nông sản để xếp hàng.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[240px] overflow-y-auto p-1">
            {inventory.map((item) => {
              const loaded = cargoManifest[item.itemId] || 0;
              const meta = ALL_ITEMS_CATALOG[item.itemId];
              const unitPrice = Math.round((meta?.basePrice || 10) * (1 + routeDef.priceBonusPercent / 100));

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2] flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl"><GameIcon e={item.icon} /></span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{item.name}</h4>
                      <p className="text-[11px] text-slate-500">Kho: {item.quantity} · Bán: <CoinIcon /> {formatMoney(unitPrice)}/cái</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCargoChange(item.itemId, -1, item.quantity)}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-800 font-extrabold text-sm hover:bg-slate-100 flex items-center justify-center cursor-pointer active:scale-90"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-xs w-6 text-center">{loaded}</span>
                    <button
                      onClick={() => handleCargoChange(item.itemId, 1, item.quantity)}
                      disabled={currentLoadedWeight >= vehicleDef.capacity || loaded >= item.quantity}
                      className="w-8 h-8 rounded-xl bg-[#2E4A35] text-white font-extrabold text-sm hover:bg-[#233a29] flex items-center justify-center cursor-pointer disabled:opacity-40 active:scale-90 disabled:active:scale-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dispatch Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-700">
            <span>Chi phí xe: <strong><CoinIcon /> {formatMoney(vehicleDef.cost)}</strong></span>
            <span className="mx-2">·</span>
            <span>Doanh thu ước tính: <strong className="text-emerald-700 font-mono font-bold text-sm">+<CoinIcon /> {formatMoney(totalEstimatedEarnings)}</strong></span>
          </div>

          <button
            onClick={handleDispatch}
            disabled={cargoItems.length === 0 || money < vehicleDef.cost}
            className={`w-full sm:w-auto py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer ${
              cargoItems.length > 0 && money >= vehicleDef.cost
                ? 'bg-[#2E4A35] hover:bg-[#233a29] text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Truck size={16} />
            <span>Khởi Hành Chuyến Xe Đi {routeDef.name}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
};
