import React from 'react';
import { FACTORIES, RECIPES } from '../constants/gameData';
import { FactoryId, FactoryState } from '../types/game';
import { Play, Sparkles, Lock } from 'lucide-react';
import { formatMoney } from '../utils/format';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';

interface Props {
  factories: Record<FactoryId, FactoryState>;
  inventory: Record<string, number>;
  coins: number;
  playerLevel: number;
  onStartCrafting: (factoryId: FactoryId, recipeId: string) => void;
  onCollectProduct: (factoryId: FactoryId, e: React.MouseEvent) => void;
  onUnlockFactory: (factoryId: FactoryId) => void;
}

export const WorkshopSection: React.FC<Props> = ({
  factories,
  inventory,
  coins,
  playerLevel,
  onStartCrafting,
  onCollectProduct,
  onUnlockFactory,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#EAE6DA] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-inner">
            <GameIcon e="🥖" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
              Xưởng Chế Biến & Lò Nướng Bánh
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Chế biến nông sản thành bột mì, bánh nướng thơm lừng, phô mai béo ngậy để bán giá cao
            </p>
          </div>
        </div>
      </div>

      {/* Factories List */}
      <div className="flex flex-col gap-4">
        {Object.values(FACTORIES).map((factory) => {
          const state = factories[factory.id];
          const isUnlocked = state?.unlocked;
          const levelReq = factory.minLevel;
          const canUnlockLevel = playerLevel >= levelReq;
          const factoryRecipes = RECIPES.filter((r) => r.factoryId === factory.id);
          const activeRecipe = factoryRecipes.find((r) => r.id === state?.activeRecipeId);

          let progress = 0;
          let remaining = 0;
          let isReady = (state?.readyItemsCount || 0) > 0;

          if (state?.startedAt && state.duration) {
            const elapsed = (Date.now() - state.startedAt) / 1000;
            progress = Math.min(100, Math.floor((elapsed / state.duration) * 100));
            remaining = Math.max(0, Math.ceil(state.duration - elapsed));
            if (elapsed >= state.duration) {
              isReady = true;
            }
          }

          if (!isUnlocked) {
            return (
              <div
                key={factory.id}
                className="bg-white rounded-3xl border border-[#EAE6DA] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm opacity-85"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl opacity-50 shrink-0">
                    <GameIcon e={factory.icon} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <span>{factory.nameVi}</span>
                      <span className="text-[11px] bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock size={10} /> Cấp {levelReq}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{factory.descriptionVi}</p>
                  </div>
                </div>

                <button
                  onClick={() => onUnlockFactory(factory.id)}
                  disabled={!canUnlockLevel || coins < factory.cost}
                  className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                    canUnlockLevel && coins >= factory.cost
                      ? 'bg-[#234230] hover:bg-[#1a3325] text-white cursor-pointer active:scale-95'
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
              className={`rounded-3xl border p-5 sm:p-6 shadow-sm transition-all ${
                isReady
                  ? 'bg-white border-amber-400 ring-4 ring-amber-400/20 shadow-md'
                  : 'bg-white border-[#EAE6DA]'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#F2EFE9]">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-inner ${state.startedAt && !isReady ? 'animate-spin-slow' : ''}`}>
                    <GameIcon e={factory.icon} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{factory.nameVi}</h3>
                    <p className="text-xs text-slate-500">{factory.descriptionVi}</p>
                  </div>
                </div>

                {isReady && (
                  <button
                    onClick={(e) => onCollectProduct(factory.id, e)}
                    className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer animate-bounce-slight"
                  >
                    <span>{activeRecipe?.icon ? <GameIcon e={activeRecipe.icon} /> : <GameIcon e="✨" />}</span>
                    <span>Lấy Thành Phẩm</span>
                    <Sparkles size={14} />
                  </button>
                )}
              </div>

              {/* In Progress Bar */}
              {state.startedAt && !isReady && (
                <div className="my-3.5 bg-[#FAF9F5] p-3 rounded-2xl border border-[#F2EFE9] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium flex items-center gap-1.5">
                      <span><GameIcon e="⚙" />️</span> Đang chế biến: <strong className="text-slate-900 font-bold">{activeRecipe?.nameVi}</strong>
                    </span>
                    <span className="font-mono text-amber-700 font-bold tabular-nums">
                      Còn {remaining}s ({progress}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Recipe Cards */}
              <div className="mt-3.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Công Thức Sản Xuất:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {factoryRecipes.map((recipe) => {
                    const isRecipeLocked = playerLevel < recipe.minLevel;
                    const canCraft =
                      !state.startedAt &&
                      !isReady &&
                      !isRecipeLocked &&
                      recipe.ingredients.every((ing) => (inventory[ing.itemId] || 0) >= ing.count);

                    return (
                      <div
                        key={recipe.id}
                        className={`p-3.5 rounded-2xl border flex flex-col justify-between text-xs transition-all ${
                          isRecipeLocked
                            ? 'bg-slate-50 border-slate-200 opacity-50'
                            : 'bg-[#FAF9F5] border-[#EAE6DA] hover:border-[#234230]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                              <span><GameIcon e={recipe.icon} /></span>
                              <span>{recipe.nameVi}</span>
                            </span>
                            <span className="text-[11px] text-amber-700 font-mono font-bold">
                              <GameIcon e="⏱️" /> {recipe.craftTime}s
                            </span>
                          </div>

                          {/* Nguyên liệu cần */}
                          <div className="flex flex-wrap gap-1.5 my-2">
                            {recipe.ingredients.map((ing) => {
                              const have = inventory[ing.itemId] || 0;
                              const hasEnough = have >= ing.count;
                              return (
                                <span
                                  key={ing.itemId}
                                  className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-semibold ${
                                    hasEnough
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : 'bg-rose-50 text-rose-800 border-rose-300'
                                  }`}
                                >
                                  {ing.count}x {ing.itemId} ({have}/{ing.count})
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Bottom action */}
                        <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                          <span className="text-[11px] text-emerald-800 font-mono font-bold">
                            Giá bán: <CoinIcon /> {formatMoney(recipe.sellPrice)}
                          </span>

                          {isRecipeLocked ? (
                            <span className="text-[11px] text-slate-400 font-bold">Mở ở Cấp {recipe.minLevel}</span>
                          ) : (
                            <button
                              onClick={() => onStartCrafting(factory.id, recipe.id)}
                              disabled={!canCraft}
                              className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-xs ${
                                canCraft
                                  ? 'bg-[#234230] hover:bg-[#1a3325] text-white cursor-pointer'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <Play size={11} className="fill-current" />
                              <span>Sản xuất</span>
                            </button>
                          )}
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
