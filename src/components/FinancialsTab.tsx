import React, { useState } from 'react';
import { FinancialTransaction, BankLoan, PendingTax } from '../types/farmSystem';
import { TrendingUp, TrendingDown, Landmark, Receipt, CreditCard } from 'lucide-react';
import { sound } from '../utils/sound';
import { formatMoney } from '../utils/format';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';

interface Props {
  money: number;
  currentDay: number;
  transactions: FinancialTransaction[];
  loans: BankLoan[];
  pendingTaxes: PendingTax[];
  creditScore: number;
  totalAssets: number;
  onTakeLoan: (amount: number, interestRate: number) => void;
  onPayLoan: (loanId: string, amount: number) => void;
  onPayTax: (taxId: string) => void;
  section?: 'finance' | 'tax';
}

export const FinancialsTab: React.FC<Props> = ({
  money,
  currentDay,
  transactions,
  loans,
  pendingTaxes,
  creditScore,
  totalAssets,
  onTakeLoan,
  onPayLoan,
  onPayTax,
  section,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'loan' | 'tax'>(section === 'tax' ? 'tax' : 'ledger');

  // Thống kê cơ bản (Tính trong 7 ngày gần nhất)
  const recentTransactions = transactions.filter(t => t.day >= currentDay - 7);
  const income = Math.round(recentTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0));
  const expense = Math.round(recentTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
  const profit = income - expense;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-amber-100 rounded-md flex items-center justify-center text-2xl border border-[3px] border-[#3a2b3f]">
          <GameIcon e="💼" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 font-display">Tài Chính & Kế Toán</h2>
          <p className="text-sm font-medium text-slate-500">Quản lý thu chi, sổ sách và nợ nần</p>
        </div>
      </div>

      {!section && (
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => { setActiveSubTab('ledger'); sound.playClick(); }}
          className={`py-3 rounded-2xl font-bold flex flex-col items-center gap-1 transition-all ${
            activeSubTab === 'ledger' ? 'bg-amber-600 text-white shadow-md' : 'bg-white border-2 border-[#E9E4D4] text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Receipt size={20} />
          <span className="text-xs">Sổ Sách</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('loan'); sound.playClick(); }}
          className={`py-3 rounded-2xl font-bold flex flex-col items-center gap-1 transition-all ${
            activeSubTab === 'loan' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border-2 border-[#E9E4D4] text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Landmark size={20} />
          <span className="text-xs">Ngân Hàng</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('tax'); sound.playClick(); }}
          className={`py-3 rounded-2xl font-bold flex flex-col items-center gap-1 transition-all ${
            activeSubTab === 'tax' ? 'bg-rose-600 text-white shadow-md' : 'bg-white border-2 border-[#E9E4D4] text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CreditCard size={20} />
          <span className="text-xs">Thuế & Phí</span>
          {pendingTaxes.length > 0 && (
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>
      )}

      {section === 'finance' && (
      <div className="bg-white p-1.5 rounded-2xl flex gap-1.5 shadow-xs border border-[#E8E2D2]">
        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'ledger' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Receipt size={18} />
          Sổ Sách
        </button>
        <button
          onClick={() => setActiveSubTab('loan')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'loan' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Landmark size={18} />
          Ngân Hàng
        </button>
      </div>
      )}

      {activeSubTab === 'ledger' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs mb-1">
                <TrendingUp size={14} /> Thu (7 ngày)
              </div>
              <div className="font-black text-emerald-900 text-lg">+{income}</div>
            </div>
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs mb-1">
                <TrendingDown size={14} /> Chi (7 ngày)
              </div>
              <div className="font-black text-rose-900 text-lg">-{expense}</div>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs mb-1">
                <Landmark size={14} /> Lợi Nhuận
              </div>
              <div className={`font-black text-lg ${profit >= 0 ? 'text-blue-900' : 'text-rose-900'}`}>
                {profit > 0 ? '+' : ''}{profit}
              </div>
            </div>
          </div>

          <div className="px-panel p-4 sm:p-6">
            <h3 className="font-extrabold text-slate-800 mb-4 text-base">Lịch Sử Giao Dịch</h3>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm font-medium">Chưa có giao dịch nào được ghi nhận.</div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {[...transactions].reverse().map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <div className="font-bold text-sm text-slate-800">{t.description}</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">Ngày {t.day} • {t.category}</div>
                    </div>
                    <div className={`font-black tabular-nums ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'income' ? '+' : '-'}<CoinIcon /> {formatMoney(Math.round(t.amount))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'loan' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-100 rounded-3xl p-4 sm:p-6 shadow-xs">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-indigo-950 text-lg flex items-center gap-2">
                  <Landmark size={20} className="text-indigo-600" />
                  Hợp Tác Xã / Ngân Hàng
                </h3>
                <p className="text-indigo-700/80 text-sm font-medium mt-1">Cung cấp vốn vay cho nông nghiệp</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-indigo-700 font-bold mb-0.5">Điểm Uy Tín</div>
                <div className="font-black text-xl text-indigo-900">{creditScore}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => onTakeLoan(500, 0.02)}
                disabled={creditScore < 400}
                className="w-full py-3 bg-white hover:bg-indigo-50 border-2 border-indigo-200 text-indigo-800 rounded-2xl font-bold flex items-center justify-between px-4 transition-all disabled:opacity-50"
              >
                <div className="flex flex-col items-start text-left">
                  <span>Gói Vay Khởi Nghiệp</span>
                  <span className="text-xs font-medium opacity-70">
                    Lãi 2%/ngày • Yêu cầu: Uy tín ≥400
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black">+500 <CoinIcon /></span>
                </div>
              </button>
              <button
                onClick={() => onTakeLoan(2000, 0.05)}
                disabled={creditScore < 600 || totalAssets < 3000}
                className="w-full py-3 bg-white hover:bg-indigo-50 border-2 border-indigo-200 text-indigo-800 rounded-2xl font-bold flex items-center justify-between px-4 transition-all disabled:opacity-50"
              >
                <div className="flex flex-col items-start text-left">
                  <span>Gói Vay Mở Rộng</span>
                  <span className="text-xs font-medium opacity-70">
                    Lãi 5%/ngày • Y/C: Uy tín ≥600, Tài sản ≥3000
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black">+2,000 <CoinIcon /></span>
                </div>
              </button>
            </div>
          </div>

          {loans.length > 0 && (
            <div className="px-panel p-4 sm:p-6">
              <h3 className="font-extrabold text-slate-800 mb-4 text-base">Khoản Vay Đang Chờ</h3>
              <div className="space-y-3">
                {loans.map(loan => (
                  <div key={loan.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                      <div className="font-bold text-rose-900 text-sm">Vay <CoinIcon /> {formatMoney(loan.principal)} (Lãi {loan.interestRate * 100}%/ngày)</div>
                      <div className="text-xs text-rose-700/80 font-medium mt-1">Dư nợ hiện tại: <CoinIcon /> {formatMoney(loan.remainingAmount)}</div>
                    </div>
                    <button
                      onClick={() => onPayLoan(loan.id, loan.remainingAmount)}
                      disabled={money < loan.remainingAmount}
                      className="shrink-0 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:hover:bg-rose-600 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
                    >
                      Thanh Toán
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'tax' && (
        <div className="px-panel p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-extrabold text-slate-800 text-lg">Thuế & Phí Làng Cấp</h3>
          </div>
          {pendingTaxes.length === 0 ? (
            <div className="text-center py-8 text-slate-500 font-medium text-sm flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl"><GameIcon e="🎉" /></div>
              Không có khoản thuế nào đang nợ!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTaxes.map(tax => (
                <div key={tax.id} className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <div className="font-bold text-orange-900 text-sm">Thuế mùa {tax.season} (Năm {tax.year})</div>
                    <div className="text-xs text-orange-700/80 font-medium mt-1">Hạn nộp: Cuối ngày {tax.dueDay}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-black text-orange-700 text-lg"><CoinIcon /> {formatMoney(tax.amount)}</div>
                    <button
                      onClick={() => onPayTax(tax.id)}
                      disabled={money < tax.amount}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
                    >
                      Nộp Ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
