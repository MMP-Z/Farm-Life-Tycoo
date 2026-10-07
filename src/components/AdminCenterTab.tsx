import React, { useState } from 'react';
import { FarmGameState } from '../types/farmSystem';
import { VillageTab } from './VillageTab';
import { FinancialsTab } from './FinancialsTab';
import { ShieldCheck, Landmark } from 'lucide-react';
import { GameIcon } from './GameIcon';

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
  const [activeTab, setActiveTab] = useState<'police' | 'finance' | 'tax' | 'coop'>('police');

  const unlockedFactoriesCount = Object.values(state.factories || {}).filter(f => f.unlocked).length;
  const totalDebt = (state.loans || []).reduce((sum, l) => sum + l.remainingAmount, 0);
  const inventoryValue = (state.inventory || []).reduce((sum, item) => sum + (item.quantity * 2), 0);
  const totalAssets = state.money + (state.plots.length * 50) + inventoryValue + (unlockedFactoriesCount * 500) - totalDebt;

  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      {/* Header */}
      <div className="px-panel p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-indigo-50 border flex items-center justify-center text-3xl border-[3px] border-[#3a2b3f]">
            <GameIcon e="🏛" />️
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
      <div className="bg-white p-1.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-1.5 shadow-xs border border-[#E8E2D2]">
        <button
          onClick={() => setActiveTab('police')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'police' ? 'bg-[#2E4A35] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck size={16} />
          Bảo Vệ
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'finance' ? 'bg-[#2E4A35] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Landmark size={16} />
          Tài Chính
        </button>
        <button
          onClick={() => setActiveTab('tax')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'tax' ? 'bg-[#2E4A35] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <span className="text-base"><GameIcon e="📜" /></span>
          Thuế
        </button>
        <button
          onClick={() => setActiveTab('coop')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'coop' ? 'bg-[#2E4A35] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <span className="text-base"><GameIcon e="🤝" /></span>
          Hợp Tác Xã
        </button>
      </div>

      <div className="mt-2">
        {activeTab === 'police' && (
          <VillageTab
            state={state}
            onBuyDefense={onBuyDefense}
            onBuyInsurance={onBuyInsurance}
            onPayTax={onPayTax}
            section="police"
          />
        )}

        {activeTab === 'coop' && (
          <VillageTab
            state={state}
            onBuyDefense={onBuyDefense}
            onBuyInsurance={onBuyInsurance}
            onPayTax={onPayTax}
            section="coop"
          />
        )}

        {activeTab === 'finance' && (
          <FinancialsTab
            money={state.money}
            currentDay={state.currentDay}
            transactions={state.transactions || []}
            loans={state.loans || []}
            pendingTaxes={state.pendingTaxes || []}
            creditScore={state.creditScore || 500}
            totalAssets={totalAssets}
            onTakeLoan={onTakeLoan}
            onPayLoan={onPayLoan}
            onPayTax={onPayTax}
            section="finance"
          />
        )}

        {activeTab === 'tax' && (
          <div className="space-y-4">
            <VillageTab
              state={state}
              onBuyDefense={onBuyDefense}
              onBuyInsurance={onBuyInsurance}
              onPayTax={onPayTax}
              section="tax"
            />
            <FinancialsTab
              money={state.money}
              currentDay={state.currentDay}
              transactions={state.transactions || []}
              loans={state.loans || []}
              pendingTaxes={state.pendingTaxes || []}
              creditScore={state.creditScore || 500}
              totalAssets={totalAssets}
              onTakeLoan={onTakeLoan}
              onPayLoan={onPayLoan}
              onPayTax={onPayTax}
              section="tax"
            />
          </div>
        )}
      </div>
    </div>
  );
};
