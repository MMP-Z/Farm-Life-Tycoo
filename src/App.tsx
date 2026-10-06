import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Map } from 'lucide-react';
import {
  FarmGameState,
  SoilType,
  TransportTrip,
  DynamicFarmEventChoice,
  StartingProfileId,
  RiskDifficulty,
} from './types/farmSystem';
import {
  CROPS_CONFIG,
  ANIMALS_CONFIG,
  RECIPES_CONFIG,
  VEHICLES_CONFIG,
  ROUTES_CONFIG,
  ALL_ITEMS_CATALOG,
  getXPForNextLevel,
} from './config/farmData';
import {
  loadSavedFarmState,
  saveFarmState,
  exportSaveFile,
  createNewFarmWithProfile,
  loadCloudFarmState,
  saveCloudFarmState,
} from './utils/storageEngine';
import { auth, signInWithGoogle, logout } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { LoginScreen } from './components/LoginScreen';
import { advanceGameTime, DAY_REAL_SECONDS } from './utils/timeEngine';
import { getSoilYieldFactor } from './utils/seedEngine';
import { sound } from './utils/sound';

import { TopHeaderHUD } from './components/TopHeaderHUD';
import { NavigationTabs, GameTab } from './components/NavigationTabs';
import { FieldTab } from './components/FieldTab';
import { PastureTab } from './components/PastureTab';
import { BarnTab } from './components/BarnTab';
import { WorkshopTab } from './components/WorkshopTab';
import { ShopTab } from './components/ShopTab';
import { TransportTab } from './components/TransportTab';
import { MarketTab } from './components/MarketTab';
import { SupermarketTab } from './components/SupermarketTab';
import { HubTab } from './components/HubTab';
import { AdminCenterTab } from './components/AdminCenterTab';
import { NPCGuide } from './components/NPCGuide';
import { FarmLevelUpModal } from './components/FarmLevelUpModal';
import { FloatingParticles } from './components/FloatingParticles';
import { EventModal } from './components/EventModal';
import { NewGameModal } from './components/NewGameModal';
import { FloatingReward } from './types/game';

export default function App() {
  const [state, setState] = useState<FarmGameState>(() => loadSavedFarmState());
  const [activeTab, setActiveTab] = useState<GameTab>('hub');
  const [floatingParticles, setFloatingParticles] = useState<FloatingReward[]>([]);
  const [levelUpData, setLevelUpData] = useState<{ level: number; rewardMoney: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showNewGameModal, setShowNewGameModal] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);

  const stateRef = useRef(state);
  stateRef.current = state;

  // Sound sync
  useEffect(() => {
    sound.setEnabled(state.settings.soundEnabled);
  }, [state.settings.soundEnabled]);

  // Firebase Auth sync & Cloud Load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const cloudState = await loadCloudFarmState(currentUser.uid);
        if (cloudState) {
          setState(cloudState);
        }
      }
      setLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  // Periodic Auto-save
  useEffect(() => {
    const timer = setInterval(() => {
      saveFarmState(stateRef.current);
      if (user) {
        saveCloudFarmState(user.uid, stateRef.current);
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [user]);

  // Save on state change
  useEffect(() => {
    saveFarmState(state);
    // Note: To avoid too many writes, we only save to local storage immediately,
    // and rely on the 15-second interval for cloud saves.
  }, [state]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3200);
  }, []);

  const addParticle = useCallback(
    (x: number, y: number, text: string, type: 'coin' | 'exp' | 'item' | 'gem', icon?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setFloatingParticles((prev) => [...prev, { id, x, y, text, type, icon }]);
      setTimeout(() => {
        setFloatingParticles((prev) => prev.filter((p) => p.id !== id));
      }, 1200);
    },
    []
  );

  // Money Award Engine
  const awardXPAndMoney = useCallback(
    (xpGain: number, moneyGain: number, x?: number, y?: number) => {
      setState((prev) => {
        let newMoney = prev.money + moneyGain;

        if (x && y) {
          if (moneyGain > 0) addParticle(x, y - 24, `+${moneyGain} 🪙`, 'coin');
        }

        const newTransaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          day: prev.currentDay,
          type: moneyGain > 0 ? 'income' : 'expense',
          amount: Math.abs(moneyGain),
          category: 'other',
          description: moneyGain > 0 ? 'Thu nhập khác' : 'Chi phí khác',
          timestamp: Date.now(),
        } as const;

        // Cập nhật mục tiêu mùa nếu là loại kiếm tiền (Lớp 4)
        const updatedGoals = (prev.seasonalGoals || []).map((g) => {
          if (g.goalType === 'earn_money' && moneyGain > 0 && !g.completed) {
            const next = g.currentAmount + moneyGain;
            return { ...g, currentAmount: next, completed: next >= g.targetAmount };
          }
          return g;
        });

        return {
          ...prev,
          money: newMoney,
          transactions: moneyGain !== 0 ? [...prev.transactions, newTransaction] : prev.transactions,
          seasonalGoals: updatedGoals,
          stats: {
            ...prev.stats,
            totalEarnings: prev.stats.totalEarnings + Math.max(0, moneyGain),
          },
        };
      });
    },
    [addParticle]
  );

  // Inventory Helper: Add item with perishability
  const addItemToInventory = useCallback(
    (itemId: string, quantity: number): boolean => {
      const current = stateRef.current;
      const totalCount = current.inventory.reduce((sum, item) => sum + item.quantity, 0);
      if (totalCount + quantity > current.barnCapacity) {
        showToast('⚠️ Kho thóc đã đầy sức chứa! Hãy nâng cấp kho hoặc đem bán bớt hàng hóa.');
        return false;
      }

      setState((prev) => {
        const itemMeta = ALL_ITEMS_CATALOG[itemId];
        const existingIdx = prev.inventory.findIndex((i) => i.itemId === itemId);

        if (existingIdx >= 0) {
          const updated = [...prev.inventory];
          const curr = updated[existingIdx];
          updated[existingIdx] = {
            ...curr,
            name: itemMeta?.name || curr.name,
            icon: itemMeta?.icon || curr.icon,
            quantity: curr.quantity + quantity,
            daysRemaining: Math.max(curr.daysRemaining, itemMeta?.shelfLifeDays || 15),
          };
          return { ...prev, inventory: updated };
        } else {
          const newItem = {
            id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            itemId,
            name: itemMeta?.name || itemId,
            icon: itemMeta?.icon || '📦',
            quantity,
            isPerishable: itemMeta?.isPerishable ?? false,
            daysRemaining: itemMeta?.shelfLifeDays || 15,
            maxShelfLife: itemMeta?.shelfLifeDays || 15,
            category: (itemMeta?.category as any) || 'crop',
            quality: 3,
          };
          return { ...prev, inventory: [...prev.inventory, newItem] };
        }
      });
      return true;
    },
    [showToast]
  );

  // Inventory Helper: Consume item
  const consumeItemFromInventory = useCallback((itemId: string, quantity: number): boolean => {
    const current = stateRef.current;
    const existing = current.inventory.find((i) => i.itemId === itemId);
    if (!existing || existing.quantity < quantity) {
      return false;
    }

    setState((prev) => {
      const updated = prev.inventory
        .map((i) => {
          if (i.itemId === itemId) {
            return { ...i, quantity: i.quantity - quantity };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);

      return { ...prev, inventory: updated };
    });
    return true;
  }, []);

  const consumeLabor = useCallback((cost = 1): boolean => {
    // Đã gỡ bỏ giới hạn Giờ công, người chơi có thể thao tác thoải mái
    return true;
  }, []);

  // Main Game Clock Engine Loop (runs every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setState((prev) => {
        const result = advanceGameTime(prev, now, false);
        if (result.notifications.length > 0) {
          result.notifications.forEach((msg) => showToast(msg));
        }

        // Xử lý các chuyến xe đã hoàn thành (timeEngine đã cộng tiền và thêm thông báo)
        let completedCount = 0;
        const remainingTrips: TransportTrip[] = [];

        result.nextState.activeTrips.forEach((trip) => {
          if (trip.status === 'arrived') {
            completedCount++;
            sound.playTruck();
          } else {
            remainingTrips.push(trip);
          }
        });

        if (completedCount > 0) {
          return {
            ...result.nextState,
            activeTrips: remainingTrips,
            stats: {
              ...result.nextState.stats,
              totalDeliveries: result.nextState.stats.totalDeliveries + completedCount,
            },
          };
        }

        return result.nextState;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [showToast]);

  const addTransaction = useCallback((type: 'income' | 'expense', amount: number, category: any, description: string) => {
    setState((prev) => ({
      ...prev,
      transactions: [...prev.transactions, {
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        day: prev.currentDay,
        type,
        amount,
        category,
        description,
        timestamp: Date.now(),
      }],
    }));
  }, []);

  const handleTakeLoan = useCallback((amount: number, interestRate: number) => {
    setState((prev) => {
      const newLoan = {
        id: `loan_${Date.now()}`,
        principal: amount,
        interestRate,
        remainingAmount: amount,
        dueDate: prev.currentDay + 14,
      };
      
      const newTransaction = {
        id: `tx_${Date.now()}`,
        day: prev.currentDay,
        type: 'income',
        amount,
        category: 'loan',
        description: 'Vay vốn Hợp Tác Xã',
        timestamp: Date.now(),
      } as const;

      return {
        ...prev,
        money: prev.money + amount,
        loans: [...prev.loans, newLoan],
        transactions: [...prev.transactions, newTransaction]
      };
    });
    sound.playPop();
    showToast(`Đã nhận khoản vay ${amount} 💰 từ Hợp Tác Xã!`);
  }, [showToast]);

  const handlePayLoan = useCallback((loanId: string, amount: number) => {
    setState((prev) => {
      if (prev.money < amount) {
        showToast('Không đủ tiền để thanh toán!');
        return prev;
      }
      
      const loanIndex = prev.loans.findIndex((l) => l.id === loanId);
      if (loanIndex === -1) return prev;
      
      const loan = prev.loans[loanIndex];
      const newRemaining = Math.max(0, loan.remainingAmount - amount);
      const paidAmount = loan.remainingAmount - newRemaining;
      
      const newTransaction = {
        id: `tx_${Date.now()}`,
        day: prev.currentDay,
        type: 'expense',
        amount: paidAmount,
        category: 'loan',
        description: 'Trả nợ vay Hợp Tác Xã',
        timestamp: Date.now(),
      } as const;
      
      const newLoans = [...prev.loans];
      let creditBonus = 0;
      if (newRemaining <= 0) {
        newLoans.splice(loanIndex, 1);
        creditBonus = prev.currentDay <= loan.dueDate ? 20 : -10;
        showToast(`Tất toán khoản vay thành công! Uy tín ${creditBonus > 0 ? '+' : ''}${creditBonus}`);
        sound.playLevelUp();
      } else {
        newLoans[loanIndex] = { ...loan, remainingAmount: newRemaining };
        creditBonus = 2;
        showToast(`Đã thanh toán ${paidAmount} 💰 dư nợ. Uy tín +${creditBonus}`);
        sound.playPop();
      }

      return {
        ...prev,
        money: prev.money - paidAmount,
        loans: newLoans,
        transactions: [...prev.transactions, newTransaction],
        creditScore: Math.max(0, Math.min(1000, (prev.creditScore || 500) + creditBonus))
      };
    });
  }, [showToast]);

  const handlePayTax = useCallback((taxId: string) => {
    setState((prev) => {
      const taxIndex = prev.pendingTaxes.findIndex((t) => t.id === taxId);
      if (taxIndex === -1) return prev;
      
      const tax = prev.pendingTaxes[taxIndex];
      if (prev.money < tax.amount) {
        showToast('Không đủ tiền đóng thuế!');
        return prev;
      }
      
      const newTransaction = {
        id: `tx_${Date.now()}`,
        day: prev.currentDay,
        type: 'expense',
        amount: tax.amount,
        category: 'tax',
        description: `Đóng thuế mùa ${tax.season} (Năm ${tax.year})`,
        timestamp: Date.now(),
      } as const;
      
      const newTaxes = [...prev.pendingTaxes];
      newTaxes.splice(taxIndex, 1);
      
      return {
        ...prev,
        money: prev.money - tax.amount,
        pendingTaxes: newTaxes,
        transactions: [...prev.transactions, newTransaction]
      };
    });
    sound.playPop();
    showToast('Đã nộp thuế thành công! Làng xã ghi nhận sự đóng góp của bạn.');
  }, [showToast]);

  const handleFastForward = useCallback(() => {
    sound.playLevelUp();
    setState((prev) => {
      const remainingFraction = 1.0 - prev.timeOfDay;
      const extraMs = remainingFraction * DAY_REAL_SECONDS * 1000 + 100; // Add 100ms buffer to safely cross the day boundary
      const fakeNow = prev.lastTimestamp + extraMs;
      
      const result = advanceGameTime(prev, fakeNow, true);
      
      if (result.notifications.length > 0) {
        result.notifications.forEach((msg) => showToast(msg));
      }
      
      return {
        ...result.nextState,
        lastTimestamp: Date.now()
      };
    });
    showToast('Đã qua ngày mới! Giờ công đã được hồi phục toàn bộ.');
  }, [showToast]);

  // ==========================================
  // FIELD (TRỒNG TRỌT) HANDLERS VỚI HỆ SỐ ĐẤT
  // ==========================================
  const handlePlowPlot = useCallback(
    (plotId: number) => {
      if (!consumeLabor(1)) return;
      setState((prev) => {
        const updated = prev.plots.map((p) => {
          if (p.id === plotId && (p.state === 'empty' || p.state === 'withered')) {
            sound.playWater();
            return {
              ...p,
              state: 'plowed' as const,
              cropId: null,
              plantedDay: null,
              hasPest: false,
              moisture: Math.max(p.moisture, 50),
            };
          }
          return p;
        });
        return { ...prev, plots: updated };
      });
      showToast('Cuốc đất tơi xốp thành công! Đất đã sẵn sàng để gieo hạt.');
    },
    [showToast]
  );

  const handlePlantCrop = useCallback(
    (plotId: number, cropId: string) => {
      const cropDef = CROPS_CONFIG[cropId];
      if (!cropDef) return;

      if (!consumeLabor(1)) return;

      const hasSeed = consumeItemFromInventory(`${cropId}_seed`, 1);
      if (!hasSeed) {
        showToast(`Không đủ hạt giống ${cropDef.name}! Vui lòng vào Cửa Hàng để mua thêm.`);
        return;
      }

      setState((prev) => {
        const updated = prev.plots.map((p) => {
          if (p.id === plotId && p.state === 'plowed') {
            sound.playPop();
            return {
              ...p,
              state: 'growing' as const,
              cropId,
              plantedDay: prev.currentDay + prev.timeOfDay,
              plantedSeason: prev.currentSeason,
              fertilized: false,
              hasPest: false,
            };
          }
          return p;
        });
        return { ...prev, plots: updated };
      });

      showToast(`Đã gieo 1 luống ${cropDef.name} ${cropDef.icon}`);
    },
    [consumeItemFromInventory, showToast]
  );

  const handleWaterPlot = useCallback(
    (plotId: number) => {
      if (!consumeLabor(1)) return;
      setState((prev) => {
        const updated = prev.plots.map((p) => {
          if (p.id === plotId) {
            sound.playWater();
            return { ...p, moisture: 100 };
          }
          return p;
        });
        return { ...prev, plots: updated };
      });
    },
    [consumeLabor]
  );

  const handleFertilizePlot = useCallback(
    (plotId: number) => {
      if (!consumeLabor(1)) return;
      const hasFertilizer = consumeItemFromInventory('fertilizer', 1);
      if (!hasFertilizer) {
        showToast('Bạn không có phân bón hữu cơ! Mua tại Cửa Hàng Vật Tư.');
        return;
      }

      setState((prev) => {
        const updated = prev.plots.map((p) => {
          if (p.id === plotId && !p.fertilized) {
            sound.playPop();
            return { ...p, fertilized: true, fertility: Math.min(100, p.fertility + 15) };
          }
          return p;
        });
        return { ...prev, plots: updated };
      });
      showToast('Đã bón phân hữu cơ! Cải tạo đất và tăng sản lượng +25%.');
    },
    [consumeLabor, consumeItemFromInventory, showToast]
  );

  const handleCurePestPlot = useCallback(
    (plotId: number) => {
      if (!consumeLabor(1)) return;
      const hasPesticide = consumeItemFromInventory('pesticide', 1);
      if (!hasPesticide) {
        showToast('Bạn không có thuốc trừ sâu sinh học! Mua tại Cửa Hàng Vật Tư.');
        return;
      }

      setState((prev) => {
        const updated = prev.plots.map((p) => {
          if (p.id === plotId && p.hasPest) {
            sound.playWater();
            return { ...p, hasPest: false };
          }
          return p;
        });
        return { ...prev, plots: updated };
      });
      showToast('Đã phun xịt tiêu diệt sâu hại sinh học an toàn!');
    },
    [consumeLabor, consumeItemFromInventory, showToast]
  );

  const handleHarvestPlot = useCallback(
    (plotId: number, e: React.MouseEvent) => {
      if (!consumeLabor(1)) return;
      const plot = state.plots.find((p) => p.id === plotId);
      if (!plot || plot.state !== 'ready' || !plot.cropId) return;

      const cropDef = CROPS_CONFIG[plot.cropId];
      if (!cropDef) return;

      // Áp dụng Lớp 1: Hệ số loại đất & tính chất đất đặc biệt
      const soilYield = getSoilYieldFactor(plot.cropId, plot.soilType, plot.specialFeature);
      const yieldAmount = Math.max(
        1,
        Math.round(cropDef.yield * (plot.fertilized ? 1.3 : 1.0) * soilYield.factor)
      );

      const added = addItemToInventory(plot.cropId, yieldAmount);
      if (!added) return;

      sound.playHarvest();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      addParticle(
        rect.left + rect.width / 2,
        rect.top,
        `+${yieldAmount} ${cropDef.name} (${soilYield.note})`,
        'item',
        cropDef.icon
      );
      awardXPAndMoney(Math.round(cropDef.basePrice * 1.5), 0, rect.left + rect.width / 2, rect.top - 20);

      // Cập nhật mục tiêu mùa (Lớp 4)
      const currentCropId = plot.cropId;
      setState((prev) => {
        const updatedGoals = (prev.seasonalGoals || []).map((g) => {
          if (g.goalType === 'harvest_item' && g.targetItemId === currentCropId && !g.completed) {
            const next = g.currentAmount + yieldAmount;
            return { ...g, currentAmount: next, completed: next >= g.targetAmount };
          }
          return g;
        });

        const updatedPlots = prev.plots.map((p) => {
          if (p.id === plotId) {
            return {
              ...p,
              state: 'empty' as const,
              cropId: null,
              plantedDay: null,
              fertilized: false,
              hasPest: false,
              fertility: Math.max(40, p.fertility - 5),
            };
          }
          return p;
        });

        return {
          ...prev,
          plots: updatedPlots,
          seasonalGoals: updatedGoals,
          stats: {
            ...prev.stats,
            totalHarvests: prev.stats.totalHarvests + 1,
          },
        };
      });
    },
    [consumeLabor, state.plots, addItemToInventory, addParticle, awardXPAndMoney]
  );

  const handleHarvestAll = useCallback(() => {
    let harvestedCount = 0;
    const harvestedItemsMap: Record<string, number> = {};

    state.plots.forEach((p) => {
      if (p.state === 'ready' && p.cropId) {
        const cropDef = CROPS_CONFIG[p.cropId];
        if (cropDef) {
          const soilYield = getSoilYieldFactor(p.cropId, p.soilType, p.specialFeature);
          const yieldAmount = Math.max(
            1,
            Math.round(cropDef.yield * (p.fertilized ? 1.3 : 1.0) * soilYield.factor)
          );

          if (addItemToInventory(p.cropId, yieldAmount)) {
            harvestedCount++;
            harvestedItemsMap[p.cropId] = (harvestedItemsMap[p.cropId] || 0) + yieldAmount;
            awardXPAndMoney(Math.round(cropDef.basePrice * 1.5), 0);
          }
        }
      }
    });

    if (harvestedCount > 0) {
      sound.playHarvest();
      setState((prev) => {
        // Cập nhật mục tiêu mùa vụ
        const updatedGoals = (prev.seasonalGoals || []).map((g) => {
          if (g.goalType === 'harvest_item' && g.targetItemId && harvestedItemsMap[g.targetItemId] && !g.completed) {
            const next = g.currentAmount + harvestedItemsMap[g.targetItemId];
            return { ...g, currentAmount: next, completed: next >= g.targetAmount };
          }
          return g;
        });

        return {
          ...prev,
          plots: prev.plots.map((p) =>
            p.state === 'ready'
              ? { ...p, state: 'empty' as const, cropId: null, plantedDay: null, fertilized: false, hasPest: false }
              : p
          ),
          seasonalGoals: updatedGoals,
          stats: {
            ...prev.stats,
            totalHarvests: prev.stats.totalHarvests + harvestedCount,
          },
        };
      });
      showToast(`Đã thu hoạch thần tốc ${harvestedCount} luống hoa màu chín theo thổ nhưỡng!`);
    } else {
      showToast('Chưa có luống hoa màu nào chín để thu hoạch cả.');
    }
  }, [state.plots, addItemToInventory, awardXPAndMoney, showToast]);

  const handleWaterAll = useCallback(() => {
    sound.playWater();
    setState((prev) => ({
      ...prev,
      plots: prev.plots.map((p) => ({ ...p, moisture: 100 })),
    }));
    showToast('Đã tưới nước mát lành cho toàn bộ cánh đồng!');
  }, [showToast]);

  const handleBuyNewPlot = useCallback(() => {
    const currentCount = state.plots.length;
    const cost = 100 + currentCount * 50;

    if (state.money < cost) {
      showToast(`Không đủ tiền vàng! Cần ${cost} vàng để khai khẩn ô đất mới.`);
      return;
    }

    const defaultSoils: SoilType[] = ['alluvial', 'sandy', 'clay', 'hill'];
    const newSoil = defaultSoils[currentCount % defaultSoils.length];

    sound.playPop();
    setState((prev) => ({
      ...prev,
      money: prev.money - cost,
      plots: [
        ...prev.plots,
        {
          id: prev.plots.length + 1,
          state: 'empty',
          cropId: null,
          plantedDay: null,
          plantedSeason: null,
          fertility: 90,
          moisture: 50,
          hasPest: false,
          fertilized: false,
          lastCropId: null,
          soilType: newSoil,
          specialFeature: currentCount % 5 === 0 ? 'spring' : null,
        },
      ],
    }));
    showToast(`Chúc mừng! Đã khai hoang thêm ô đất số #${currentCount + 1}!`);
  }, [state.plots.length, state.money, showToast]);

  // ==========================================
  // PASTURE (CHUỒNG TRẠI) HANDLERS
  // ==========================================
  const handleFeedPen = useCallback(
    () => {
      if (!consumeLabor(1)) return;
      const pen = state.pens['main'];
      if (!pen || pen.animals.length === 0) return;

      const feedNeeded: Record<string, number> = {};
      pen.animals.forEach(a => {
        const def = ANIMALS_CONFIG[a.type];
        if (def && def.feedItemId) {
          feedNeeded[def.feedItemId] = (feedNeeded[def.feedItemId] || 0) + def.feedPerDay;
        }
      });

      // Atomic check: Verify all required feed exists before consuming
      for (const [itemId, amount] of Object.entries(feedNeeded)) {
        const existing = state.inventory.find(i => i.itemId === itemId);
        if (!existing || existing.quantity < amount) {
          showToast(`Không đủ thức ăn! Cần ${amount}x ${ALL_ITEMS_CATALOG[itemId]?.name || itemId}.`);
          return;
        }
      }

      // Consume
      for (const [itemId, amount] of Object.entries(feedNeeded)) {
        consumeItemFromInventory(itemId, amount);
      }

      sound.playAnimal('chicken'); // Just a generic sound
      setState((prev) => {
        const curPen = prev.pens['main'];
        if (!curPen) return prev;
        const updatedAnimals = curPen.animals.map((a) => ({
          ...a,
          hunger: 100,
          happiness: Math.min(100, a.happiness + 20),
          daysWithoutFood: 0,
        }));
        return { ...prev, pens: { ...prev.pens, main: { ...curPen, animals: updatedAnimals } } };
      });
      showToast('Đã rải thức ăn cho toàn bộ vật nuôi trong kho!');
    },
    [state.pens, consumeItemFromInventory, consumeLabor, showToast]
  );

  const handleFillWaterTrough = useCallback(
    () => {
      if (!consumeLabor(1)) return;
      sound.playWater();
      setState((prev) => {
        const pen = prev.pens['main'];
        if (!pen) return prev;
        return {
          ...prev,
          pens: {
            ...prev.pens,
            main: { ...pen, waterTrough: 100, animals: pen.animals.map((a) => ({ ...a, thirst: 100 })) },
          },
        };
      });
      showToast('Đã bơm đầy máng nước mát lành cho đàn vật nuôi!');
    },
    [consumeLabor, showToast]
  );

  const handleCureAnimal = useCallback(
    (animalId: string) => {
      if (!consumeLabor(1)) return;
      const hasMed = consumeItemFromInventory('vet_medicine', 1);
      if (!hasMed) {
        showToast('Bạn không có thuốc thú y! Hãy ghé Cửa Hàng Vật Tư mua thêm.');
        return;
      }

      sound.playPop();
      setState((prev) => {
        const pen = prev.pens['main'];
        if (!pen) return prev;
        const updatedAnimals = pen.animals.map((a) => (a.id === animalId ? { ...a, isSick: false, health: 100 } : a));
        return { ...prev, pens: { ...prev.pens, main: { ...pen, animals: updatedAnimals } } };
      });
      showToast('Đã cho vật nuôi uống thuốc thú y! Sức khỏe đã phục hồi hoàn toàn.');
    },
    [consumeLabor, consumeItemFromInventory, showToast]
  );

  const handleCollectProduce = useCallback(
    (e: React.MouseEvent) => {
      const pen = state.pens['main'];
      if (!pen) return;

      const readyAnimals = pen.animals.filter((a) => a.daysUntilProduce <= 0 && !a.isSick && a.hunger > 20);
      if (readyAnimals.length === 0) {
        showToast('Chưa có vật nuôi nào sẵn sàng thu hoạch!');
        return;
      }

      if (!consumeLabor(1)) return;

      let totalXP = 0;
      let textLines: string[] = [];

      readyAnimals.forEach((a) => {
        const def = ANIMALS_CONFIG[a.type];
        if (def) {
          addItemToInventory(def.produceItemId, def.produceAmount);
          totalXP += def.produceAmount * 5;
          textLines.push(`+${def.produceAmount} ${ALL_ITEMS_CATALOG[def.produceItemId]?.name}`);
        }
      });

      sound.playAnimal('chicken');
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      addParticle(rect.left + rect.width / 2, rect.top, 'Thu hoạch thành công!', 'item', '✨');
      awardXPAndMoney(totalXP, 0);

      setState((prev) => {
        const curPen = prev.pens['main'];
        const updatedAnimals = curPen.animals.map((a) => {
          const def = ANIMALS_CONFIG[a.type];
          return a.daysUntilProduce <= 0 && !a.isSick && a.hunger > 20 && def
            ? { ...a, daysUntilProduce: def.produceDays }
            : a;
        });
        return { ...prev, pens: { ...prev.pens, main: { ...curPen, animals: updatedAnimals } } };
      });

      showToast(`Đã thu hoạch sản phẩm từ ${readyAnimals.length} vật nuôi!`);
    },
    [state.pens, consumeLabor, addItemToInventory, addParticle, awardXPAndMoney, showToast]
  );

  const handleBuyAnimal = useCallback(
    (animalType: string) => {
      const def = ANIMALS_CONFIG[animalType];
      if (!def) return;
      const pen = state.pens['main'] || { id: 'main', capacity: 10, waterTrough: 100, cleanliness: 100, animals: [] };

      if (pen.animals.length >= pen.capacity) {
        showToast(`Nhà kho đã đầy (${pen.animals.length}/${pen.capacity})! Cần mở rộng thêm.`);
        return;
      }

      if (state.money < def.buyPrice) {
        showToast(`Không đủ tiền vàng! Cần ${def.buyPrice} vàng để mua ${def.name}.`);
        return;
      }

      sound.playAnimal(animalType);
      const newAnimal = {
        id: `an_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type: animalType,
        name: `${def.name} #${pen.animals.length + 1}`,
        hunger: 100,
        thirst: 100,
        health: 100,
        happiness: 100,
        daysWithoutFood: 0,
        isSick: false,
        lastFedDay: state.currentDay,
        daysUntilProduce: def.produceDays,
      };

      setState((prev) => {
        return {
          ...prev,
          money: prev.money - def.buyPrice,
          pens: { ...prev.pens, main: { ...pen, animals: [...pen.animals, newAnimal] } },
        };
      });

      showToast(`Chào đón thành viên mới: 1 chú ${def.name} ${def.icon}!`);
    },
    [state.pens, state.money, state.currentDay, showToast]
  );

  const handleUpgradeCapacity = useCallback(
    () => {
      const pen = state.pens['main'] || { id: 'main', capacity: 10, waterTrough: 100, cleanliness: 100, animals: [] };
      const cost = 150 + pen.capacity * 40;

      if (state.money < cost) {
        showToast(`Không đủ tiền vàng! Cần ${cost} vàng để mở rộng.`);
        return;
      }

      sound.playPop();
      setState((prev) => {
        return {
          ...prev,
          money: prev.money - cost,
          pens: { ...prev.pens, main: { ...pen, capacity: pen.capacity + 2 } },
        };
      });
      showToast(`Đã mở rộng nhà kho thêm +2 sức chứa!`);
    },
    [state.pens, state.money, showToast]
  );

  const handleCleanPen = useCallback(
    () => {
      sound.playWater();
      setState((prev) => {
        const pen = prev.pens['main'];
        if (!pen) return prev;
        return { ...prev, pens: { ...prev.pens, main: { ...pen, cleanliness: 100 } } };
      });
      showToast('Đã quét dọn chuồng trại sạch sẽ tinh tươm!');
    },
    [showToast]
  );

  const handleSellAnimal = useCallback(
    (animalId: string) => {
      setState((prev) => {
        const pen = prev.pens['main'];
        if (!pen) return prev;
        const animal = pen.animals.find(a => a.id === animalId);
        if (!animal) return prev;
        const def = ANIMALS_CONFIG[animal.type];
        const sellPrice = Math.floor((def?.buyPrice || 0) / 2);
        
        sound.playPop();
        showToast(`Đã bán ${animal.name} lấy ${sellPrice} vàng!`);
        return {
          ...prev,
          money: prev.money + sellPrice,
          pens: { ...prev.pens, main: { ...pen, animals: pen.animals.filter(a => a.id !== animalId) } },
        };
      });
    },
    [showToast]
  );

  // ==========================================
  // WORKSHOP (XƯỞNG CHẾ BIẾN) HANDLERS
  // ==========================================
  const handleStartCraft = useCallback(
    (factoryId: string, recipeId: string) => {
      const recipe = RECIPES_CONFIG.find((r) => r.id === recipeId);
      const factory = state.factories[factoryId];
      if (!recipe || !factory) return;

      if (factory.activeTasks.length >= factory.queueSlots) {
        showToast('Hàng đợi của xưởng đã kín chỗ! Hãy thu hoạch thành phẩm hoặc nâng cấp ô chế biến.');
        return;
      }

      // Check all ingredients
      for (const ing of recipe.ingredients) {
        const inStock = state.inventory.find((i) => i.itemId === ing.itemId)?.quantity || 0;
        if (inStock < ing.amount) {
          showToast(`Thiếu nguyên liệu: Cần ${ing.amount}x ${ing.name} (hiện có ${inStock})!`);
          return;
        }
      }

      // Consume ingredients
      for (const ing of recipe.ingredients) {
        consumeItemFromInventory(ing.itemId, ing.amount);
      }

      sound.playCraft();
      const newTask = {
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        recipeId,
        startDay: state.currentDay,
        durationDays: recipe.craftDays,
        progressPercent: 0,
        completed: false,
      };

      setState((prev) => {
        const curFactory = prev.factories[factoryId];
        return {
          ...prev,
          factories: {
            ...prev.factories,
            [factoryId]: {
              ...curFactory,
              activeTasks: [...curFactory.activeTasks, newTask],
            },
          },
        };
      });

      showToast(`Bắt đầu chế biến ${recipe.name} ${recipe.icon}!`);
    },
    [state.factories, state.inventory, state.currentDay, consumeItemFromInventory, showToast]
  );

  const handleCollectFinishedTask = useCallback(
    (factoryId: string, taskId: string, e: React.MouseEvent) => {
      const factory = state.factories[factoryId];
      if (!factory) return;

      const task = factory.activeTasks.find((t) => t.id === taskId);
      if (!task || !task.completed) return;

      const recipe = RECIPES_CONFIG.find((r) => r.id === task.recipeId);
      if (!recipe) return;

      const added = addItemToInventory(recipe.outputItemId, recipe.outputAmount);
      if (!added) return;

      sound.playPop();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      addParticle(
        rect.left + rect.width / 2,
        rect.top,
        `+${recipe.outputAmount} ${recipe.name}`,
        'item',
        recipe.icon
      );
      awardXPAndMoney(recipe.basePrice, 0);

      // Cập nhật mục tiêu mùa nếu có nhiệm vụ chế biến bánh
      setState((prev) => {
        const curFactory = prev.factories[factoryId];
        const updatedGoals = (prev.seasonalGoals || []).map((g) => {
          if (g.goalType === 'craft_item' && g.targetItemId === recipe.outputItemId && !g.completed) {
            const next = g.currentAmount + recipe.outputAmount;
            return { ...g, currentAmount: next, completed: next >= g.targetAmount };
          }
          return g;
        });

        return {
          ...prev,
          factories: {
            ...prev.factories,
            [factoryId]: {
              ...curFactory,
              activeTasks: curFactory.activeTasks.filter((t) => t.id !== taskId),
            },
          },
          seasonalGoals: updatedGoals,
        };
      });

      showToast(`Đã thu nhận thành phẩm ${recipe.name} thơm ngon vào kho!`);
    },
    [state.factories, addItemToInventory, addParticle, awardXPAndMoney, showToast]
  );

  const handleUnlockFactory = useCallback(
    (factoryId: string) => {
      const factory = state.factories[factoryId];
      if (!factory) return;

      if (state.money < factory.cost) {
        showToast(`Không đủ tiền vàng! Cần ${factory.cost} vàng để xây xưởng.`);
        return;
      }

      sound.playPop();
      setState((prev) => ({
        ...prev,
        money: prev.money - factory.cost,
        factories: {
          ...prev.factories,
          [factoryId]: { ...factory, unlocked: true },
        },
      }));
      showToast(`Chúc mừng! Đã khánh thành ${factory.name} ${factory.icon}!`);
    },
    [state.factories, state.money, showToast]
  );

  const handleUpgradeQueue = useCallback(
    (factoryId: string) => {
      const factory = state.factories[factoryId];
      if (!factory) return;

      const cost = 120 + factory.queueSlots * 60;
      if (state.money < cost) {
        showToast(`Không đủ tiền vàng! Cần ${cost} vàng để thêm ô hàng đợi.`);
        return;
      }

      sound.playPop();
      setState((prev) => ({
        ...prev,
        money: prev.money - cost,
        factories: {
          ...prev.factories,
          [factoryId]: { ...factory, queueSlots: factory.queueSlots + 1 },
        },
      }));
      showToast(`Đã mở thêm 1 ô hàng đợi cho ${factory.name}!`);
    },
    [state.factories, state.money, showToast]
  );

  // ==========================================
  // TRANSPORT (VẬN TẢI) HANDLERS
  // ==========================================
  const handleDispatchTrip = useCallback(
    (
      vehicleId: string,
      routeId: string,
      cargo: { itemId: string; name: string; icon: string; quantity: number; unitPrice: number }[],
      fee: number,
      estimatedEarnings: number
    ) => {
      if (state.money < fee) {
        showToast(`Không đủ tiền trả phí lộ trình (${fee} vàng)!`);
        return;
      }

      // Deduct items from inventory
      for (const c of cargo) {
        consumeItemFromInventory(c.itemId, c.quantity);
      }

      const routeDef = ROUTES_CONFIG[routeId] || ROUTES_CONFIG.village;
      const newTrip: TransportTrip = {
        id: `trip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        vehicleId,
        routeId,
        cargo,
        startDay: state.currentDay,
        durationDays: routeDef.travelDays,
        status: 'in_transit',
        totalEarnings: estimatedEarnings,
        fee,
      };

      sound.playTruck();
      setState((prev) => {
        // Cập nhật mục tiêu mùa nếu là chuyến giao hàng
        const updatedGoals = (prev.seasonalGoals || []).map((g) => {
          if (g.goalType === 'deliveries' && !g.completed) {
            const next = g.currentAmount + 1;
            return { ...g, currentAmount: next, completed: next >= g.targetAmount };
          }
          return g;
        });

        return {
          ...prev,
          money: prev.money - fee,
          activeTrips: [...prev.activeTrips, newTrip],
          seasonalGoals: updatedGoals,
        };
      });

      showToast(`Đội xe đã xuất phát đi ${routeDef.name}! Chuyến đi dự kiến mất ${routeDef.travelDays} ngày.`);
    },
    [state.money, state.currentDay, consumeItemFromInventory, showToast]
  );

  const handleBuyVehicle = useCallback(
    (vehicleId: string) => {
      const def = VEHICLES_CONFIG[vehicleId];
      if (!def) return;

      if (state.money < def.buyPrice) {
        showToast(`Không đủ tiền vàng! Cần ${def.buyPrice} vàng để mua xe.`);
        return;
      }

      sound.playPop();
      setState((prev) => ({
        ...prev,
        money: prev.money - def.buyPrice,
        ownedVehicles: [...prev.ownedVehicles, vehicleId],
      }));
      showToast(`Đã mua thành công phương tiện vận chuyển mới: ${def.name} ${def.icon}!`);
    },
    [state.money, showToast]
  );

  // ==========================================
  // MARKET & ORDERS HANDLERS
  // ==========================================
  const handleDirectSell = useCallback(
    (itemId: string, quantity: number, unitPrice: number, e: React.MouseEvent) => {
      const consumed = consumeItemFromInventory(itemId, quantity);
      if (!consumed) {
        showToast('Số lượng trong kho không đủ để bán!');
        return;
      }

      const totalEarn = quantity * unitPrice;
      sound.playCoin();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      addParticle(rect.left + rect.width / 2, rect.top, `+${totalEarn} 🪙`, 'coin');
      awardXPAndMoney(Math.round(totalEarn * 0.3), totalEarn);
      
      // Giảm giá bán (Cung cầu): bán 1 sản phẩm giảm 0.5% giá trị, tối đa giảm xuống còn 40% giá trị gốc.
      setState((prev) => {
        const currentDemand = prev.demandMultipliers[itemId] ?? 1.0;
        const dropRate = quantity * 0.005;
        const newDemand = Math.max(0.4, currentDemand - dropRate);
        return {
          ...prev,
          demandMultipliers: {
            ...prev.demandMultipliers,
            [itemId]: newDemand
          }
        };
      });

      showToast(`Đã bán ${quantity} sản phẩm với giá ${totalEarn.toLocaleString()} vàng!`);
    },
    [consumeItemFromInventory, addParticle, awardXPAndMoney, showToast]
  );

  const handleFulfillOrder = useCallback(
    (orderId: string, e: React.MouseEvent) => {
      const order = state.orders.find((o) => o.id === orderId);
      if (!order) return;

      for (const req of order.requirements) {
        const inStock = state.inventory.find((i) => i.itemId === req.itemId)?.quantity || 0;
        if (inStock < req.amount) {
          showToast(`Thiếu ${req.name}: Cần ${req.amount}, hiện có ${inStock}!`);
          return;
        }
      }

      for (const req of order.requirements) {
        consumeItemFromInventory(req.itemId, req.amount);
      }

      sound.playCoin();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      addParticle(rect.left + rect.width / 2, rect.top, `+${order.rewardMoney} 🪙`, 'coin');
      awardXPAndMoney(order.rewardXP, order.rewardMoney);

      const newOrders = state.orders
        .filter((o) => o.id !== orderId)
        .concat([
          {
            id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            customerName: 'Bác Ba Quán Phở',
            customerAvatar: '👨‍🍳',
            requirements: [{ itemId: 'wheat', name: 'Lúa mì', icon: '🌾', amount: Math.floor(Math.random() * 4) + 2 }],
            rewardMoney: 45 + Math.floor(Math.random() * 30),
            rewardXP: 30 + Math.floor(Math.random() * 20),
            deadlineDay: state.currentDay + 5,
            isCompleted: false,
          },
        ]);

      setState((prev) => {
        const updatedGoals = (prev.seasonalGoals || []).map((g) => {
          if (g.goalType === 'deliveries' && !g.completed) {
            const next = g.currentAmount + 1;
            return { ...g, currentAmount: next, completed: next >= g.targetAmount };
          }
          return g;
        });

        return {
          ...prev,
          orders: newOrders,
          seasonalGoals: updatedGoals,
          stats: {
            ...prev.stats,
            totalDeliveries: prev.stats.totalDeliveries + 1,
          },
        };
      });

      showToast(`Giao hàng thành công cho ${order.customerName}! Nhận +${order.rewardMoney} vàng và +${order.rewardXP} XP!`);
    },
    [state.orders, state.inventory, state.currentDay, consumeItemFromInventory, addParticle, awardXPAndMoney, showToast]
  );

  // ==========================================
  // BARN & STORAGE HANDLERS
  // ==========================================
  const handleUpgradeBarnCapacity = useCallback(() => {
    const cost = 100 + Math.floor(state.barnCapacity * 1.5);
    if (state.money < cost) {
      showToast(`Không đủ tiền vàng! Cần ${cost} vàng để nâng sức chứa kho.`);
      return;
    }

    sound.playPop();
    setState((prev) => ({
      ...prev,
      money: prev.money - cost,
      barnCapacity: prev.barnCapacity + 25,
    }));
    showToast(`Đã mở rộng kho thóc thêm +25 kg sức chứa! (Hiện tại: ${state.barnCapacity + 25} kg)`);
  }, [state.barnCapacity, state.money, showToast]);

  const handleBuildColdStorage = useCallback(() => {
    const cost = 400;
    if (state.money < cost) {
      showToast(`Không đủ tiền vàng! Cần ${cost} vàng để lắp đặt kho lạnh.`);
      return;
    }

    sound.playPop();
    setState((prev) => ({
      ...prev,
      money: prev.money - cost,
      hasColdStorage: true,
    }));
    showToast('Đã lắp đặt hệ thống làm lạnh công nghiệp! Hàng tươi sống sẽ không bao giờ bị hỏng!');
  }, [state.money, showToast]);

  // ==========================================
  // SHOP HANDLERS
  // ==========================================
  const handleBuyItem = useCallback(
    (itemId: string, quantity: number, unitCost: number) => {
      const totalCost = quantity * unitCost;
      if (state.money < totalCost) {
        showToast(`Không đủ tiền vàng! Cần ${totalCost.toLocaleString()} vàng.`);
        return;
      }

      const added = addItemToInventory(itemId, quantity);
      if (!added) return;

      sound.playCoin();
      setState((prev) => ({ ...prev, money: prev.money - totalCost }));
      showToast(`Mua thành công ${quantity}x ${ALL_ITEMS_CATALOG[itemId]?.name || itemId}!`);
    },
    [state.money, addItemToInventory, showToast]
  );

  const handleBuySeedsForEmptyPlots = useCallback(
    (cropId: string, count: number, unitCost: number) => {
      const totalCost = count * unitCost;
      if (state.money < totalCost) {
        showToast(`Không đủ tiền vàng! Cần ${totalCost.toLocaleString()} vàng.`);
        return;
      }

      sound.playPop();
      setState((prev) => {
        let plantedRemaining = count;
        const updatedPlots = prev.plots.map((p) => {
          if (p.state === 'plowed' && plantedRemaining > 0) {
            plantedRemaining--;
            return {
              ...p,
              state: 'growing' as const,
              cropId,
              plantedDay: prev.currentDay,
              plantedSeason: prev.currentSeason,
              fertilized: false,
              hasPest: false,
            };
          }
          return p;
        });

        return {
          ...prev,
          money: prev.money - totalCost,
          plots: updatedPlots,
        };
      });

      showToast(`Đã mua giống và gieo trồng ngay vào ${count} luống đất đã cày!`);
    },
    [state.money, showToast]
  );

  const handleBuyAutoIrrigation = useCallback(() => {
    const cost = 500;
    if (state.money < cost) {
      showToast(`Không đủ tiền vàng! Cần ${cost} vàng để lắp hệ thống tưới.`);
      return;
    }

    sound.playPop();
    setState((prev) => ({
      ...prev,
      money: prev.money - cost,
      hasAutoIrrigation: true,
      plots: prev.plots.map((p) => ({ ...p, moisture: 100 })),
    }));
    showToast('Đã lắp đặt hệ thống vòi phun nước tự động! Đất sẽ luôn đủ độ ẩm!');
  }, [state.money, showToast]);

  const handleHireAutoWorker = useCallback(() => {
    const cost = 300;
    if (state.money < cost) {
      showToast(`Không đủ tiền vàng! Cần ${cost} vàng để thuê nhân công.`);
      return;
    }

    sound.playPop();
    setState((prev) => ({
      ...prev,
      money: prev.money - cost,
      autoWorkersCount: prev.autoWorkersCount + 1,
    }));
    showToast('Đã thuê thêm 1 nhân công nông vụ siêng năng trợ giúp bạn!');
  }, [state.money, showToast]);

  // ==========================================
  // PROGRESSION & QUESTS HANDLERS
  // ==========================================

  const handleUnlockRegion = useCallback((regionId: string, cost: number) => {
    setState((prev) => {
      if (prev.money < cost || (prev.unlockedRegions && prev.unlockedRegions.includes(regionId))) return prev;
      sound.playCoin();
      showToast(`Đã mở khóa thành công khu vực mới!`);
      return {
        ...prev,
        money: prev.money - cost,
        unlockedRegions: [...(prev.unlockedRegions || []), regionId],
      };
    });
  }, [showToast]);

  const handleClaimSeasonGoal = useCallback(
    (goalId: string, e: React.MouseEvent) => {
      const goal = state.seasonalGoals?.find((g) => g.id === goalId);
      if (!goal || !goal.completed || goal.claimed) return;

      sound.playCoin();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      addParticle(rect.left + rect.width / 2, rect.top, `+${goal.rewardMoney} 🪙`, 'coin');
      awardXPAndMoney(0, goal.rewardMoney);

      setState((prev) => ({
        ...prev,
        seasonalGoals: (prev.seasonalGoals || []).map((g) =>
          g.id === goalId ? { ...g, claimed: true } : g
        ),
      }));

      showToast(`Chúc mừng hoàn thành Mục tiêu mùa "${goal.title}": +${goal.rewardMoney} vàng, +${goal.rewardXP} XP!`);
    },
    [state.seasonalGoals, addParticle, awardXPAndMoney, showToast]
  );

  const handleExportSave = useCallback(() => {
    exportSaveFile(state);
    showToast('Đã xuất file lưu trữ (.json) về máy của bạn!');
  }, [state, showToast]);

  // ==========================================
  // VILLAGE & RISK SYSTEM HANDLERS
  // ==========================================
  const handleBuyDefense = useCallback(
    (type: 'dog' | 'reinforced_lock' | 'crop_netting' | 'vaccine', cost: number) => {
      if (state.money < cost) {
        showToast(`Không đủ tiền vàng! Cần ${cost} vàng.`);
        return;
      }

      sound.playPop();
      setState((prev) => {
        const defenses = { ...prev.defenses };
        if (type === 'dog') defenses.hasDog = true;
        if (type === 'reinforced_lock') defenses.hasReinforcedLock = true;
        if (type === 'crop_netting') defenses.hasCropNetting = true;
        if (type === 'vaccine') {
          Object.keys(prev.pens).forEach((k) => {
            defenses.vaccinatedPens[k] = true;
          });
        }

        return {
          ...prev,
          money: prev.money - cost,
          defenses,
        };
      });

      const names = {
        dog: 'Chú Chó Ki-Ki',
        reinforced_lock: 'Khóa Kho An Toàn',
        crop_netting: 'Nhà Lưới Che Chắn',
        vaccine: 'Vắc-xin Phòng Dịch',
      };
      showToast(`Đã trang bị thành công ${names[type]} bảo vệ trang trại!`);
    },
    [state.money, showToast]
  );

  const handleBuyInsurance = useCallback(() => {
    const cost = 60;
    if (state.money < cost) {
      showToast(`Không đủ tiền vàng! Cần ${cost} vàng để tham gia bảo hiểm.`);
      return;
    }

    sound.playCoin();
    setState((prev) => ({
      ...prev,
      money: prev.money - cost,
      insurance: {
        ...prev.insurance,
        active: true,
        expiresDay: prev.currentDay + 28,
      },
    }));
    showToast('Đã tham gia Gói Bảo Hiểm Nông Nghiệp HTX! Bạn được bảo vệ 70% tổn thất.');
  }, [state.money, showToast]);


  const handleSetDifficulty = useCallback((diff: RiskDifficulty) => {
    sound.playClick();
    setState((prev) => ({ ...prev, difficulty: diff }));
    showToast(`Đã chuyển chế độ rủi ro sang: ${diff === 'relaxed' ? 'Thư Giãn' : diff === 'standard' ? 'Tiêu Chuẩn' : 'Thử Thách'}`);
  }, [showToast]);

  // ==========================================
  // SỰ KIỆN ĐỘNG & HỒ SƠ KHỞI ĐẦU MỚI (LỚP 3 & 5)
  // ==========================================
  const handleEventChoice = useCallback(
    (choice: DynamicFarmEventChoice) => {
      sound.playPop();
      setState((prev) => {
        let money = prev.money;
        let inventory = [...prev.inventory];
        let plots = [...prev.plots];

        if (choice.effectType === 'grant_money' && choice.moneyAmount) {
          money += choice.moneyAmount;
        } else if (choice.effectType === 'pay_money' && choice.moneyAmount) {
          money = Math.max(0, money - choice.moneyAmount);
        } else if (choice.effectType === 'water_all') {
          plots = plots.map((p) => ({ ...p, moisture: 100 }));
        }

        if (choice.items) {
          choice.items.forEach((it) => {
            const existing = inventory.find((i) => i.itemId === it.itemId);
            if (existing) {
              existing.quantity += it.quantity;
            } else {
              const meta = ALL_ITEMS_CATALOG[it.itemId];
              inventory.push({
                id: `inv_ev_${Date.now()}_${it.itemId}`,
                itemId: it.itemId,
                name: meta?.name || it.itemId,
                icon: meta?.icon || '📦',
                quantity: it.quantity,
                isPerishable: meta?.isPerishable ?? false,
                daysRemaining: meta?.shelfLifeDays || 15,
                maxShelfLife: meta?.shelfLifeDays || 15,
                category: (meta?.category as any) || 'crop',
                quality: 3,
              });
            }
          });
        }

        const completedDays = [...(prev.completedEventDays || []), prev.currentDay];
        return {
          ...prev,
          money,
          inventory,
          plots,
          activeEvent: null,
          completedEventDays: completedDays,
        };
      });

      showToast(choice.toastResult);
    },
    [showToast]
  );

  const handleConfirmNewGame = useCallback(
    (profileId: StartingProfileId, seed: string) => {
      const freshFarm = createNewFarmWithProfile(profileId, seed);
      setState(freshFarm);
      saveFarmState(freshFarm);
      if (user) {
        saveCloudFarmState(user.uid, freshFarm);
      }
      setShowNewGameModal(false);
      showToast(`Đã khởi tạo trang trại mới với Seed: ${freshFarm.worldSeed}!`);
    },
    [showToast, user]
  );

  // ==========================================
  // BADGES CALCULATION
  // ==========================================
  const readyCropsCount = state.plots.filter((p) => p.state === 'ready').length;
  const readyAnimalsCount = Object.values(state.pens).reduce((sum, pen) => {
    return sum + pen.animals.filter((a) => a.daysUntilProduce <= 0).length;
  }, 0);
  const readyWorkshopCount = Object.values(state.factories).reduce((sum, f) => {
    return sum + f.activeTasks.filter((t) => t.completed).length;
  }, 0);
  const arrivingTripsCount = state.activeTrips.filter((t) => t.status === 'completed').length;
  const fulfillableOrdersCount = state.orders.filter((order) => {
    return order.requirements.every((req) => {
      const inStock = state.inventory.find((i) => i.itemId === req.itemId)?.quantity || 0;
      return inStock >= req.amount;
    });
  }).length;
  const claimableQuestsCount =
    (state.seasonalGoals || []).filter((g) => g.completed && !g.claimed).length;

  const adminAlertsCount =
    (state.riskAlerts?.length || 0) +
    (state.pendingTaxes?.filter((t) => !t.paid).length || 0);

  const badges = {
    field: readyCropsCount,
    pasture: readyAnimalsCount,
    workshop: readyWorkshopCount,
    transport: arrivingTripsCount,
    supermarket: fulfillableOrdersCount,
    admin: adminAlertsCount,
  };

  const emptyPlotsCount = state.plots.filter((p) => p.state === 'plowed').length;
  const hasPestOnField = state.plots.some((p) => p.hasPest);
  const hasDryPlotsOnField = state.plots.some((p) => p.moisture < 30);

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#F3EFE0] flex items-center justify-center">
        <div className="animate-spin text-4xl">🚜</div>
      </div>
    );
  }

  if (!user && !isGuestMode) {
    return <LoginScreen onLogin={signInWithGoogle} onPlayGuest={() => setIsGuestMode(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      
      {/* Top Header HUD with Seed & Controls */}
      <TopHeaderHUD
        state={state}
        onSetGameSpeed={(speed) => {
          setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, gameSpeed: speed },
          }));
          showToast(`Tốc độ game: ${speed === 0 ? 'Tạm dừng' : speed + 'x'}`);
        }}
        onToggleSound={() => {
          setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled },
          }));
        }}
        onLoadImportedState={(loaded) => {
          setState(loaded);
          saveFarmState(loaded);
          if (user) {
            saveCloudFarmState(user.uid, loaded);
          }
          showToast('Nạp dữ liệu game thành công!');
        }}
        onShowToast={showToast}
        onOpenNewGameModal={() => setShowNewGameModal(true)}
        onFastForward={handleFastForward}
      />

      {/* Main Tab Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 pt-3 sm:pt-4 pb-28 sm:pb-12">
        {activeTab === 'hub' && (
          <HubTab
            onSelectTab={setActiveTab}
            unlockedRegions={state.unlockedRegions || ['field', 'shop', 'barn']}
            money={state.money}
            onUnlockRegion={handleUnlockRegion}
          />
        )}
        
        {activeTab === 'field' && (
          <FieldTab
            plots={state.plots}
            currentSeason={state.currentSeason}
            currentDay={state.currentDay}
            money={state.money}
            inventory={state.inventory}
            onPlowPlot={handlePlowPlot}
            onPlantCrop={handlePlantCrop}
            onWaterPlot={handleWaterPlot}
            onFertilizePlot={handleFertilizePlot}
            onCurePestPlot={handleCurePestPlot}
            onHarvestPlot={handleHarvestPlot}
            onHarvestAll={handleHarvestAll}
            onWaterAll={handleWaterAll}
            onBuyNewPlot={handleBuyNewPlot}
            plotCost={100 + state.plots.length * 50}
            maxPlots={24}
          />
        )}

        {activeTab === 'pasture' && (
          <PastureTab
            pens={state.pens}
            inventory={state.inventory}
            money={state.money}
            playerLevel={1}
            onFeedPen={handleFeedPen}
            onFillWaterTrough={handleFillWaterTrough}
            onCureAnimal={handleCureAnimal}
            onCollectProduce={handleCollectProduce}
            onBuyAnimal={handleBuyAnimal}
            onUpgradeCapacity={handleUpgradeCapacity}
            onCleanPen={handleCleanPen}
            onSellAnimal={handleSellAnimal}
          />
        )}

        {activeTab === 'barn' && (
          <BarnTab
            inventory={state.inventory}
            barnCapacity={state.barnCapacity}
            hasColdStorage={state.hasColdStorage}
            money={state.money}
            onUpgradeCapacity={handleUpgradeBarnCapacity}
            onBuildColdStorage={handleBuildColdStorage}
            upgradeCost={100 + Math.floor(state.barnCapacity * 1.5)}
            coldStorageCost={400}
          />
        )}

        {activeTab === 'workshop' && (
          <WorkshopTab
            factories={state.factories}
            inventory={state.inventory}
            money={state.money}
            playerLevel={1}
            onStartCraft={handleStartCraft}
            onCollectFinishedTask={handleCollectFinishedTask}
            onUnlockFactory={handleUnlockFactory}
            onUpgradeQueue={handleUpgradeQueue}
          />
        )}

        {activeTab === 'shop' && (
          <ShopTab
            money={state.money}
            playerLevel={1}
            emptyPlotsCount={emptyPlotsCount}
            hasAutoIrrigation={state.hasAutoIrrigation}
            autoWorkersCount={state.autoWorkersCount}
            onBuyItem={handleBuyItem}
            onBuySeedsForEmptyPlots={handleBuySeedsForEmptyPlots}
            onBuyAutoIrrigation={handleBuyAutoIrrigation}
            onHireAutoWorker={handleHireAutoWorker}
            onBuyAnimal={handleBuyAnimal}
            autoIrrigationCost={500}
            autoWorkerCost={300}
          />
        )}

        {activeTab === 'transport' && (
          <TransportTab
            ownedVehicles={state.ownedVehicles}
            activeTrips={state.activeTrips}
            inventory={state.inventory}
            currentDay={state.currentDay}
            money={state.money}
            playerLevel={1}
            marketProfiles={state.marketProfiles}
            onDispatchTrip={handleDispatchTrip}
            onBuyVehicle={handleBuyVehicle}
          />
        )}

        {activeTab === 'market' && (
          <MarketTab
            inventory={state.inventory}
            demandMultipliers={state.demandMultipliers}
            onDirectSell={handleDirectSell}
          />
        )}


        {activeTab === 'admin' && (
          <AdminCenterTab
            state={state}
            onBuyDefense={handleBuyDefense}
            onBuyInsurance={handleBuyInsurance}
            onPayTax={handlePayTax}
            onTakeLoan={handleTakeLoan}
            onPayLoan={handlePayLoan}
          />
        )}
      </main>

      {/* Floating Particles Animation */}
      <FloatingParticles particles={floatingParticles} />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm bg-slate-900/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs sm:text-sm font-semibold animate-in slide-in-from-top-4 duration-200 flex items-center gap-2 pointer-events-none">
          <span className="text-base">📢</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Level Up Celebration Popup */}
      {levelUpData && (
        <FarmLevelUpModal
          level={levelUpData.level}
          rewardMoney={levelUpData.rewardMoney}
          onClose={() => setLevelUpData(null)}
        />
      )}

      {/* Lớp 5: Modal Sự Kiện Động Tương Tác */}
      {state.activeEvent && (
        <EventModal event={state.activeEvent} onChoose={handleEventChoice} />
      )}

      {/* Lớp 3: Modal Khởi Tạo Nông Trại Mới với Seed & Hồ Sơ */}
      {showNewGameModal && (
        <NewGameModal
          currentSeed={state.worldSeed}
          onConfirmNewGame={handleConfirmNewGame}
          onClose={() => setShowNewGameModal(false)}
        />
      )}

      {/* Các nút nổi ở góc dưới phải (Map & NPC Guide) */}
      <div className="fixed bottom-18 sm:bottom-4 right-3 sm:right-4 z-30 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Nút Quay Về Bản Đồ (Map) */}
        {activeTab !== 'hub' && (
          <button
            onClick={() => {
              setActiveTab('hub');
              sound.playClick();
            }}
            className="pointer-events-auto bg-[#2E4A35] border border-[#1e3022] text-white p-2.5 sm:p-3 rounded-2xl shadow-lg flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Về Bản Đồ"
          >
            <Map size={24} />
            <span className="text-xs font-bold font-display hidden sm:inline">Về Bản Đồ</span>
          </button>
        )}

        {/* NPC Guide Bác Ba */}
        <div className="pointer-events-auto relative">
          <NPCGuide
            currentDay={state.currentDay}
            currentSeason={state.currentSeason}
            weather={state.weather}
            hasPest={hasPestOnField}
            hasDryPlots={hasDryPlotsOnField}
            readyHarvestCount={readyCropsCount}
            readyAnimalProduce={readyAnimalsCount > 0}
          />
        </div>
      </div>
    </div>
  );
}
