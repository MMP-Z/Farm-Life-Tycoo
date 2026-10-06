import React from 'react';
import { FactoryBuilding } from '../types/farmSystem';
import { RECIPES_CONFIG } from '../config/farmData';
import { Play, Sparkles, Lock, ArrowUpCircle, Clock } from 'lucide-react';
import { sound } from '../utils/sound';
import { formatMoney } from '../utils/format';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';

interface Props {
  factories: Record<string, FactoryBuilding>;
  inventory: { itemId: string; quantity: number }[];
  money: number;
  playerLevel: number;
  onStartCraft: (factoryId: string, recipeId: string) => void;
  onCollectFinishedTask: (factoryId: string, taskId: string, e: React.MouseEvent) => void;
  onUnlockFactory: (factoryId: string) => void;
  onUpgradeQueue: (factoryId: string) => void;
}

export const WorkshopTab: React.FC<Props> = ({
  factories,
  inventory,
  money,
  playerLevel,
  onStartCraft,
  onCollectFinishedTask,
  onUnlockFactory,
  onUpgradeQueue,
}) => {
  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E2D2] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-inner">
            <GameIcon e="🥖" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
              Xưởng Chế Biến Tăng Giá Trị Nông Sản
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Xay bột mì, nướng bánh mì nóng giòn, lên men phô mai và ép mứt dâu để thu về lợi nhuận cao gấp 2-3 lần
            </p>
          </div>
        </div>
      </div>

      {/* Factories Grid */}
      <div className="flex flex-col gap-4">
        {Object.values(factories).map((factory) => {
          const isUnlocked = factory.unlocked;
          const factoryRecipes = RECIPES_CONFIG.filter((r) => r.factoryType === factory.id);
          const queueCapacity = factory.queueSlots;
          const currentTasks = factory.activeTasks;
          const upgradeSlotCost = 120 + factory.queueSlots * 60;

          if (!isUnlocked) {
            const canUnlock = money >= factory.cost;

            return (
              <div
                key={factory.id}
                className="bg-white rounded-3xl border border-[#E8E2D2] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs opacity-80"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl opacity-50 shrink-0">
                    <GameIcon e={factory.icon} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 font-display flex items-center gap-2">
                      <span>{factory.name}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      Sản xuất: {factoryRecipes.map(r => r.name).join(', ')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Chi phí đầu tư xây dựng: <CoinIcon /> {formatMoney(factory.cost)}</p>
                  </div>
                </div>

                <button
                  onClick={() => onUnlockFactory(factory.id)}
                  disabled={!canUnlock}
                  className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
                    canUnlock
                      ? 'bg-[#2E4A35] text-white hover:bg-[#233a29] cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Xây Dựng (<CoinIcon /> {formatMoney(factory.cost)})</span>
                </button>
              </div>
            );
          }

          return (
            <div
              key={factory.id}
              className="bg-white rounded-3xl border border-[#E8E2D2] p-5 sm:p-6 shadow-xs flex flex-col gap-4"
            >
              {/* Factory Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EFE9]">
                <div className="flex items-center gap-3">
                  <span className="text-3xl filter drop-shadow-xs"><GameIcon e={factory.icon} /></span>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 font-display leading-tight">{factory.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Hàng đợi máy: {currentTasks.length}/{queueCapacity} sản phẩm
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onUpgradeQueue(factory.id)}
                  disabled={money < upgradeSlotCost}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title={`Thêm 1 slot hàng đợi (${formatMoney(upgradeSlotCost)})`}
                >
                  <ArrowUpCircle size={13} />
                  <span>+1 Slot (<CoinIcon /> {formatMoney(upgradeSlotCost)})</span>
                </button>
              </div>

              {/* Active Tasks Queue */}
              {currentTasks.length > 0 && (
                <div className="flex flex-col gap-2 p-3 bg-[#FAF8F2] rounded-2xl border border-[#E8E2D2]">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Đang Chế Biến Trong Hàng Đợi:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentTasks.map((task) => {
                      const recipe = RECIPES_CONFIG.find((r) => r.id === task.recipeId);
                      if (!recipe) return null;

                      return (
                        <div
                          key={task.id}
                          className="p-3 bg-white rounded-xl border border-[#E8E2D2] shadow-xs flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl"><GameIcon e={recipe.icon} /></span>
                            <div>
                              <h4 className="font-bold text-xs text-slate-900">{recipe.name}</h4>
                              <p className="text-[11px] text-slate-500 font-mono">
                                {task.completed ? 'Đã xong!' : `Tiến độ: ${task.progressPercent}%`}
                              </p>
                            </div>
                          </div>

                          {task.completed ? (
                            <button
                              onClick={(e) => onCollectFinishedTask(factory.id, task.id, e)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs flex items-center gap-1 shadow-xs cursor-pointer animate-bounce-slight"
                            >
                              <Sparkles size={13} />
                              <span>Lấy thành phẩm</span>
                            </button>
                          ) : (
                            <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                              <div
                                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                                style={{ width: `${task.progressPercent}%` }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recipe Book for this Factory */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Công Thức Sản Xuất Sẵn Có:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {factoryRecipes.map((recipe) => {
                    const isRecipeLocked = false; // Luôn mở
                    const canCraft =
                      currentTasks.length < queueCapacity &&
                      recipe.ingredients.every((ing) => {
                        const inStock = inventory.find((i) => i.itemId === ing.itemId)?.quantity || 0;
                        return inStock >= ing.amount;
                      });

                    return (
                      <div
                        key={recipe.id}
                        className={`p-3.5 rounded-2xl border flex flex-col justify-between text-xs transition-all ${
                          isRecipeLocked
                            ? 'bg-slate-50 border-slate-200 opacity-50'
                            : 'bg-[#FAF8F2] border-[#E8E2D2] hover:border-[#2E4A35]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm font-display">
                              <span><GameIcon e={recipe.icon} /></span>
                              <span>{recipe.name}</span>
                            </span>
                            <span className="text-[11px] text-amber-800 font-mono font-bold">
                              <GameIcon e="⏱️" /> {recipe.craftDays} ngày
                            </span>
                          </div>

                          {/* Nguyên liệu cần */}
                          <div className="flex flex-wrap gap-1.5 my-2">
                            {recipe.ingredients.map((ing) => {
                              const inStock = inventory.find((i) => i.itemId === ing.itemId)?.quantity || 0;
                              const hasEnough = inStock >= ing.amount;
                              return (
                                <span
                                  key={ing.itemId}
                                  className={`px-2 py-0.5 rounded-md border text-[11px] font-mono font-bold ${
                                    hasEnough
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : 'bg-rose-50 text-rose-800 border-rose-300'
                                  }`}
                                >
                                  {ing.amount}x {ing.name} ({inStock}/{ing.amount})
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-[11px] text-emerald-800 font-mono font-bold">
                            Bán: ~<CoinIcon /> {formatMoney(recipe.basePrice)}
                          </span>

                          <button
                            onClick={() => onStartCraft(factory.id, recipe.id)}
                            disabled={!canCraft}
                            className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-xs ${
                                canCraft
                                  ? 'bg-[#2E4A35] hover:bg-[#233a29] text-white cursor-pointer'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <Play size={11} className="fill-current" />
                              <span>Đưa vào lò</span>
                            </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
