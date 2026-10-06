import React from 'react';
import {
  FarmGameState,
  RiskDifficulty,
} from '../types/farmSystem';
import { DEFENSE_ITEMS_CONFIG, INSURANCE_CONFIG } from '../config/riskData';
import {
  ShieldCheck,
  AlertTriangle,
  History,
  CheckCircle2,
  DollarSign,
  Dog,
  Lock,
  Warehouse,
  Syringe,
} from 'lucide-react';
import { sound } from '../utils/sound';

interface Props {
  state: FarmGameState;
  onBuyDefense: (type: 'dog' | 'reinforced_lock' | 'crop_netting' | 'vaccine', cost: number) => void;
  onBuyInsurance: () => void;
  onPayTax: (taxId: string) => void;
  section?: 'police' | 'coop' | 'tax';
}

export const VillageTab: React.FC<Props> = ({
  state,
  onBuyDefense,
  onBuyInsurance,
  onPayTax,
  section,
}) => {
  const { insurance, defenses, pendingTaxes, riskAlerts, recentIncidents } = state;
  const isInsured = insurance.active && state.currentDay < insurance.expiresDay;

  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      {/* Cảnh Báo An Ninh & Dự Báo Thời Tiết Sớm */}
      {(!section || section === 'police') && riskAlerts && riskAlerts.length > 0 && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-300 ring-2 ring-amber-300/20 shadow-xs">
          <div className="flex items-center gap-2 mb-2.5">
            <AlertTriangle className="text-amber-600 animate-bounce-slight" size={18} />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-display">
              Bảng Tin Dự Báo Sớm Từ Hội Đồng Làng
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {riskAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5"
              >
                <span className="text-2xl mt-0.5">{alert.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{alert.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{alert.desc}</p>
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full inline-block mt-1.5">
                    ⏱️ Còn {alert.daysRemaining} ngày để chuẩn bị
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row: Bảo Hiểm Hợp Tác Xã & Chi Cục Thuế */}
      <div className={`grid grid-cols-1 gap-4 ${!section ? 'lg:grid-cols-2' : ''}`}>
        
        {/* Card 1: Bảo Hiểm HTX */}
        {(!section || section === 'coop') && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D2] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-display">
                  {INSURANCE_CONFIG.name}
                </h3>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${
                  isInsured
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                {isInsured ? 'Đang được bảo hiểm' : 'Chưa tham gia'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {INSURANCE_CONFIG.description}
            </p>

            <div className="my-3 p-3 bg-[#FAF8F2] rounded-2xl border border-[#DFD9C3] flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[11px]">Mức bồi thường:</span>
                <strong className="text-emerald-800 font-bold text-sm">70% giá trị thiệt hại</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[11px]">Đã đền bù tích lũy:</span>
                <strong className="text-amber-900 font-bold text-sm">+{insurance.totalCompensated} 💰</strong>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {isInsured ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck size={16} /> Hiệu lực đến hết ngày {insurance.expiresDay}
              </span>
            ) : (
              <button
                onClick={onBuyInsurance}
                disabled={state.money < INSURANCE_CONFIG.costPerSeason}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck size={16} />
                <span>Tham Gia Bảo Hiểm Mùa Vụ ({INSURANCE_CONFIG.costPerSeason} vàng)</span>
              </button>
            )}
          </div>
        </div>
        )}

        {/* Card 2: Chi Cục Thuế & Quỹ Làng */}
        {(!section || section === 'tax') && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D2] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📜</span>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-display">
                  Sổ Thuế Nông Nghiệp & Quỹ Làng
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap shrink-0">Nộp cuối mỗi mùa vụ</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Mỗi ô đất canh tác chịu mức thuế nhỏ (10 vàng / ô).
            </p>

            <div className="my-3 p-3 bg-[#FAF8F2] rounded-2xl border border-[#DFD9C3] flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[11px]">Quy mô đất:</span>
                <strong className="text-slate-900 font-bold">{state.plots.length} ô đất</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[11px]">Định mức thuế mùa này:</span>
                <strong className="text-amber-950 font-bold">{state.plots.length * 10} vàng</strong>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {pendingTaxes && pendingTaxes.length > 0 && !pendingTaxes[0].paid ? (
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700">
                  Cần nộp: {pendingTaxes[0].amount} vàng
                </span>
                <button
                  onClick={() => onPayTax(pendingTaxes[0].id)}
                  disabled={state.money < pendingTaxes[0].amount}
                  className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xs active:scale-95 cursor-pointer disabled:opacity-40"
                >
                  Nộp Thuế Ngay
                </button>
              </div>
            ) : (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Đã hoàn thành mọi nghĩa vụ thuế cho vụ mùa hiện tại
              </span>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Công Trình & Trang Bị Phòng Vệ Nông Trại */}
      {(!section || section === 'police') && (
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D2] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-display">
                Trang Bị & Công Trình Phòng Vệ
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Xây dựng hệ thống bảo vệ giúp ngăn chặn trộm cắp và giảm nhẹ thiệt hại từ thiên tai
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Dog */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-3xl">🐕</span>
                {defenses.hasDog ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    Đang tuần tra
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-amber-900">180 💰</span>
                )}
              </div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">{DEFENSE_ITEMS_CONFIG.dog.name}</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{DEFENSE_ITEMS_CONFIG.dog.benefit}</p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200">
              {defenses.hasDog ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Đã có chó giữ nhà
                </span>
              ) : (
                <button
                  onClick={() => onBuyDefense('dog', 180)}
                  disabled={state.money < 180}
                  className="w-full py-1.5 rounded-xl bg-[#2E4A35] hover:bg-[#233a29] text-white font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                >
                  <Dog size={13} />
                  <span>Nuôi Chó (180 vàng)</span>
                </button>
              )}
            </div>
          </div>

          {/* Reinforced Lock */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-3xl">🔒</span>
                {defenses.hasReinforcedLock ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    Đã gia cố
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-amber-900">150 💰</span>
                )}
              </div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">{DEFENSE_ITEMS_CONFIG.reinforced_lock.name}</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{DEFENSE_ITEMS_CONFIG.reinforced_lock.benefit}</p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200">
              {defenses.hasReinforcedLock ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Kho thóc đã khóa then
                </span>
              ) : (
                <button
                  onClick={() => onBuyDefense('reinforced_lock', 150)}
                  disabled={state.money < 150}
                  className="w-full py-1.5 rounded-xl bg-[#2E4A35] hover:bg-[#233a29] text-white font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                >
                  <Lock size={13} />
                  <span>Gia Cố Khóa (150 vàng)</span>
                </button>
              )}
            </div>
          </div>

          {/* Crop Netting */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-3xl">🏗️</span>
                {defenses.hasCropNetting ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    Đã giăng lưới
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-amber-900">220 💰</span>
                )}
              </div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">{DEFENSE_ITEMS_CONFIG.crop_netting.name}</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{DEFENSE_ITEMS_CONFIG.crop_netting.benefit}</p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200">
              {defenses.hasCropNetting ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Ruộng được che chắn
                </span>
              ) : (
                <button
                  onClick={() => onBuyDefense('crop_netting', 220)}
                  disabled={state.money < 220}
                  className="w-full py-1.5 rounded-xl bg-[#2E4A35] hover:bg-[#233a29] text-white font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                >
                  <Warehouse size={13} />
                  <span>Dựng Nhà Lưới (220 vàng)</span>
                </button>
              )}
            </div>
          </div>

          {/* Vaccine */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-3xl">💉</span>
                <span className="text-xs font-mono font-bold text-amber-900">80 💰</span>
              </div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">{DEFENSE_ITEMS_CONFIG.vaccine.name}</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{DEFENSE_ITEMS_CONFIG.vaccine.benefit}</p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200">
              <button
                onClick={() => onBuyDefense('vaccine', 80)}
                disabled={state.money < 80}
                className="w-full py-1.5 rounded-xl bg-[#2E4A35] hover:bg-[#233a29] text-white font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer disabled:opacity-40"
              >
                <Syringe size={13} />
                <span>Tiêm Toàn Đàn (80 vàng)</span>
              </button>
            </div>
          </div>

        </div>
      </div>
      )}

      {/* Nhật Ký Sự Cố Gần Nhất */}
      {(!section || section === 'police') && recentIncidents && recentIncidents.length > 0 && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D2] shadow-xs">
          <div className="flex items-center gap-2 mb-2.5">
            <History size={18} className="text-slate-500" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-display">
              Nhật Ký An Ninh & Sự Cố Thiên Tai
            </h3>
          </div>

          <div className="space-y-2">
            {recentIncidents.map((inc) => (
              <div
                key={inc.id}
                className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#E8E2D2] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{inc.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{inc.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">· Ngày {inc.day}</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{inc.description}</p>
                  </div>
                </div>

                {inc.preventedByDefense ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full shrink-0">
                    Đã phòng vệ
                  </span>
                ) : inc.insuranceCompensated > 0 ? (
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full shrink-0">
                    +{inc.insuranceCompensated} 💰 bảo hiểm
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-rose-600 shrink-0">
                    -{inc.lossAmount} 💰
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
