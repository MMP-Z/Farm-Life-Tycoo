import React, { useState } from 'react';
import { FarmGameState } from '../types/farmSystem';
import { VillageTab } from './VillageTab';
import { FinancialsTab } from './FinancialsTab';
import { ShieldCheck, Landmark } from 'lucide-react';

interface Props {
  state: FarmGameState;
  onBuyDefense: (type: 'dog' | 'reinforced_lock' | 'crop_netting' | 'vaccine', cost: number) => void;
  onBuyInsurance: () => void;
  onPayTax: (taxId: string) => void;
  onTakeLoan: (amount: number, interestRate: number) => void;
  onPayLoan: (loanId: string, amount: number) => void;
}

export const AdminCenterTab: React.FC<Props> = ({
  state,
  onBuyDefense,
  onBuyInsurance,
  onPayTax,
  onTakeLoan,
  onPayLoan,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'village' | 'financials'>('village');

  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D2] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-3xl shadow-inner">
            🏛️
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
              Trung Tâm Hành Chính
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Quản lý an ninh, bảo hiểm, đóng thuế và vay vốn tín dụng Hợp Tác Xã.
            </p>
          </div>
        </div>
      </div>

      {/* Tab switchers */}
      <div className="bg-white p-1.5 rounded-2xl flex gap-1.5 shadow-xs border border-[#E8E2D2]">
        <button
          onClick={() => setActiveSubTab('village')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'village' ? 'bg-[#2E4A35] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck size={18} />
          Xóm Làng & An Ninh
        </button>
        <button
          onClick={() => setActiveSubTab('financials')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'financials' ? 'bg-[#2E4A35] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Landmark size={18} />
          Tài Chính & Thuế
        </button>
      </div>

      <div className="mt-2">
        {activeSubTab === 'village' && (
          <VillageTab
            state={state}
            onBuyDefense={onBuyDefense}
            onBuyInsurance={onBuyInsurance}
            onPayTax={onPayTax}
          />
        )}

        {activeSubTab === 'financials' && (
          <FinancialsTab
            money={state.money}
            currentDay={state.currentDay}
            transactions={state.transactions || []}
            loans={state.loans || []}
            pendingTaxes={state.pendingTaxes || []}
            onTakeLoan={onTakeLoan}
            onPayLoan={onPayLoan}
            onPayTax={onPayTax}
          />
        )}
      </div>
    </div>
  );
};
