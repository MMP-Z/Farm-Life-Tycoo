import { DEFAULT_INITIAL_STATE } from '../constants/gameData';
import { GameState } from '../types/game';

const STORAGE_KEY = 'farmlife_game_state_v1';

export function loadSavedGameState(): GameState {
  if (typeof window === 'undefined') return DEFAULT_INITIAL_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INITIAL_STATE;
    const parsed = JSON.parse(raw);
    // Merge with default initial state to guarantee any missing fields in schema updates are present
    return {
      ...DEFAULT_INITIAL_STATE,
      ...parsed,
      inventory: { ...DEFAULT_INITIAL_STATE.inventory, ...(parsed.inventory || {}) },
      animalPens: { ...DEFAULT_INITIAL_STATE.animalPens, ...(parsed.animalPens || {}) },
      factories: { ...DEFAULT_INITIAL_STATE.factories, ...(parsed.factories || {}) },
      stats: { ...DEFAULT_INITIAL_STATE.stats, ...(parsed.stats || {}) },
    };
  } catch (e) {
    console.warn('Failed to load game state from localStorage:', e);
    return DEFAULT_INITIAL_STATE;
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save game state to localStorage:', e);
  }
}

export function resetGameState(): GameState {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return {
    ...DEFAULT_INITIAL_STATE,
    plots: DEFAULT_INITIAL_STATE.plots.map((p) => ({ ...p })),
  };
}
