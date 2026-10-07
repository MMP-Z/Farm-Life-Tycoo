import React from 'react';
import { FACTORIES, RECIPES } from '../constants/gameData';
import { FactoryId, FactoryState, RecipeConfig } from '../types/game';
import { Sparkles, Play, CheckCircle2, Lock } from 'lucide-react';
import { formatMoney } from '../utils/format';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';

interface Props {
  factories: Record<FactoryId, FactoryState>;
  inventory: Record<string, number>;
  playerLevel: number;
  playerCoins: number;
  onStartCrafting: (factoryId: FactoryId, recipeId: string) => void;
  onCollectProduct: (factoryId: FactoryId, e: React.MouseEvent) => void;
  onUnlockFactory: (factoryId: FactoryId) => void;
}

export const FactoriesSection: React.FC<Props> = ({
  factories,
  inventory,
  playerLevel,
  playerCoins,
  onStartCrafting,
  onCollectProduct,
  onUnlockFactory,
}) => {
  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <div className="bg-[#21432c]/90 p-3 rounded-2xl border border-emerald-700/50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl"><GameIcon e="🥖" /></span>
          <div>
            <h2 className="font-bold text-white text-sm sm:text-base leading-tight">Xưởng Chế Biến & Lò Nướng</h2>
            <p className="text-emerald-300/80 text-[11px]">
              Chế biến nông sản thành bột mì, bánh mì thơm nức, phô mai béo ngậy
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
                className="bg-[#1a2f20]/90 rounded-2xl border border-emerald-900/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-black/30 border flex items-center justify-center text-3xl opacity-60 border-[3px] border-[#3a2b3f]">
                    <GameIcon e={factory.icon} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                      <span>{factory.nameVi}</span>
                      <span className="text-[11px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Lock size={10} /> Yêu cầu Cấp {levelReq}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{factory.descriptionVi}</p>
                  </div>
                </div>

                <button
                  onClick={() => onUnlockFactory(factory.id)}
                  disabled={!canUnlockLevel || playerCoins < factory.cost}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                    canUnlockLevel && playerCoins >= factory.cost
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                  }`}
                >
                  <span>Xây dựng xưởng (<CoinIcon /> {formatMoney(factory.cost)})</span>
                </button>
              </div>
            );
          }

          return (
            <div
              key={factory.id}
              className={`rounded-2xl border p-4 shadow-lg transition-all ${
                isReady
                  ? 'bg-gradient-to-b from-[#284a32] to-[#1c3823] border-amber-400 ring-2 ring-amber-400/40'
                  : 'bg-gradient-to-b from-[#1e3c27] to-[#162e1d] border-emerald-700/60'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
                <div className="flex items-center gap-2.5">
                  <div className={`w-11 h-11 rounded-2xl bg-emerald-950/80 border border-emerald-600/50 flex items-center justify-center text-2xl shadow-inner ${state.startedAt && !isReady ? 'animate-spin-slow' : ''}`}>
                    <GameIcon e={factory.icon} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{factory.nameVi}</h3>
                    <p className="text-[11px] text-emerald-300/80">{factory.descriptionVi}</p>
                  </div>
                </div>

                {/* Ready indicator */}
                {isReady && (
                  <button
                    onClick={(e) => onCollectProduct(factory.id, e)}
                    className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer animate-bounce-slight"
                  >
                    <span>{activeRecipe?.icon ? <GameIcon e={activeRecipe.icon} /> : <GameIcon e="✨" />}</span>
                    <span>Lấy thành phẩm</span>
                    <Sparkles size={12} className="text-amber-900" />
                  </button>
                )}
              </div>

              {/* In Progress Bar */}
              {state.startedAt && !isReady && (
                <div className="my-3 bg-black/30 p-2.5 rounded-xl border border-emerald-800/60 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-300 font-medium flex items-center gap-1">
                      <span><GameIcon e="⚙" />️</span> Đang chế biến: <strong className="text-white">{activeRecipe?.nameVi}</strong>
                    </span>
                    <span className="font-mono text-amber-300 tabular-nums">Còn {remaining}s ({progress}%)</span>
                  </div>
                  <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Recipe Cards List */}
              <div className="mt-3">
                <p className="text-[11px] font-bold text-emerald-200/90 mb-2 uppercase tracking-wide">
                  Công Thức Chế Biến:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                        className={`p-2.5 rounded-xl border flex flex-col justify-between text-xs transition-colors ${
                          isRecipeLocked
                            ? 'bg-black/20 border-emerald-950/60 opacity-50'
                            : 'bg-[#183220]/90 border-emerald-800/70 hover:border-emerald-600'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-white flex items-center gap-1">
                              <span className="text-base"><GameIcon e={recipe.icon} /></span>
                              <span>{recipe.nameVi}</span>
                            </span>
                            <span className="text-[11px] text-amber-300 font-mono">
                              +{recipe.expReward} EXP · <GameIcon e="⏱️" /> {recipe.craftTime}s
                            </span>
                          </div>

                          {/* Ingredients */}
                          <div className="flex flex-wrap items-center gap-1.5 my-1 text-[11px]">
                            {recipe.ingredients.map((ing) => {
                              const have = inventory[ing.itemId] || 0;
                              const hasEnough = have >= ing.count;
                              return (
                                <span
                                  key={ing.itemId}
                                  className={`px-1.5 py-0.5 rounded-md border text-[11px] font-mono ${
                                    hasEnough
                                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
                                      : 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                                  }`}
                                >
                                  {ing.count}x {ing.itemId} ({have}/{ing.count})
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Craft Button */}
                        <div className="mt-2 pt-1.5 border-t border-emerald-900/60 flex items-center justify-between">
                          <span className="text-[11px] text-amber-300/80 font-mono">Bán: <CoinIcon /> {formatMoney(recipe.sellPrice)}</span>

                          {isRecipeLocked ? (
                            <span className="text-[11px] text-slate-400 font-semibold">Khóa (Lv.{recipe.minLevel})</span>
                          ) : (
                            <button
                              onClick={() => onStartCrafting(factory.id, recipe.id)}
                              disabled={!canCraft}
                              className={`py-1 px-2.5 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-transform active:scale-95 shadow-sm ${
                                canCraft
                                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                              }`}
                            >
                              <Play size={10} />
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
