import { useSyncExternalStore } from "react";
import type { EquipSlotId } from "@/lib/game-data";
import { currencies, itemById, type ShopCurrency } from "@/lib/shop-data";

/* Single shared mock player state used by Shop / Inventory / Equipment /
 * Upgrade. No backend — a module-level store with subscriptions. */

export type PlayerState = {
  currencies: Record<string, number>;
  /** owned quantity keyed by global item id */
  owned: Record<string, number>;
  equipped: Partial<Record<EquipSlotId, string>>;
  favorites: string[];
  recentlyViewed: string[];
  inventoryCapacity: number;
};

const initialOwned: Record<string, number> = {
  w7: 1,
  w12: 1,
  a3: 1,
  a5: 1,
  a7: 1,
  a9: 1,
  a11: 1,
  e1: 1,
  e2: 1,
  c1: 12,
  c2: 6,
  c3: 9,
  c5: 4,
  m1: 148,
  m5: 62,
  m7: 7,
  m10: 23,
};

let state: PlayerState = {
  currencies: Object.fromEntries(currencies.map((c) => [c.id, c.amount])),
  owned: { ...initialOwned },
  equipped: { weapon: "w7", chest: "a5", helmet: "a3", gloves: "a7", boots: "a9", shield: "a11", core: "e1", implant: "e2" },
  favorites: ["w12", "m7"],
  recentlyViewed: [],
  inventoryCapacity: 64,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;

export function usePlayer(): PlayerState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const playerActions = {
  buy(itemId: string, qty: number, currencyId: string, totalCost: number) {
    state = {
      ...state,
      currencies: { ...state.currencies, [currencyId]: (state.currencies[currencyId] ?? 0) - totalCost },
      owned: { ...state.owned, [itemId]: (state.owned[itemId] ?? 0) + qty },
    };
    emit();
  },
  sell(itemId: string, qty: number, currencyId: string, totalValue: number) {
    const next = Math.max(0, (state.owned[itemId] ?? 0) - qty);
    const owned = { ...state.owned };
    if (next === 0) delete owned[itemId];
    else owned[itemId] = next;
    state = {
      ...state,
      currencies: { ...state.currencies, [currencyId]: (state.currencies[currencyId] ?? 0) + totalValue },
      owned,
    };
    emit();
  },
  toggleFavorite(itemId: string) {
    const favorites = state.favorites.includes(itemId)
      ? state.favorites.filter((f) => f !== itemId)
      : [...state.favorites, itemId];
    state = { ...state, favorites };
    emit();
  },
  view(itemId: string) {
    if (state.recentlyViewed[0] === itemId) return;
    state = {
      ...state,
      recentlyViewed: [itemId, ...state.recentlyViewed.filter((i) => i !== itemId)].slice(0, 8),
    };
    emit();
  },
};

export const currencyMeta = (id: string): ShopCurrency =>
  currencies.find((c) => c.id === id) ?? currencies[0]!;

export const equippedForSlot = (p: PlayerState, slot?: string) =>
  slot ? itemById(p.equipped[slot as EquipSlotId] ?? "") : undefined;

export const usedInventorySlots = (p: PlayerState) => Object.keys(p.owned).length;
