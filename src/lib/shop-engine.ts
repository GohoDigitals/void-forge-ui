import { useMemo, useState } from "react";
import type { Rarity } from "@/lib/game-data";
import {
  itemById,
  listingPrice,
  type GameItem,
  type ShopConfig,
  type ShopListing,
} from "@/lib/shop-data";

export type SortId =
  | "default"
  | "price-asc"
  | "price-desc"
  | "rarity"
  | "name-asc"
  | "name-desc"
  | "newest";

export const sortOptions: { id: SortId; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "price-asc", label: "Price: Low → High" },
  { id: "price-desc", label: "Price: High → Low" },
  { id: "rarity", label: "Rarity" },
  { id: "name-asc", label: "Name: A → Z" },
  { id: "name-desc", label: "Name: Z → A" },
  { id: "newest", label: "Newest" },
];

export type ShopRow = {
  item: GameItem;
  listing: ShopListing;
  price: number;
  originalPrice: number;
  discounted: boolean;
  sellPrice: number;
  soldOut: boolean;
  locked: boolean;
};

export type ShopFilters = {
  category: string;
  search: string;
  sort: SortId;
  rarity: Rarity | "any";
  maxPrice: number | null;
  availableOnly: boolean;
  favoritesOnly: boolean;
};

export const defaultFilters: ShopFilters = {
  category: "all",
  search: "",
  sort: "default",
  rarity: "any",
  maxPrice: null,
  availableOnly: false,
  favoritesOnly: false,
};

const rarityRank: Record<Rarity, number> = {
  legendary: 5,
  epic: 4,
  rare: 3,
  uncommon: 2,
  common: 1,
};

export function buildRows(shop: ShopConfig): ShopRow[] {
  return shop.listings.flatMap((l) => {
    const item = itemById(l.itemId);
    if (!item) return [];
    const { price, original, discounted } = listingPrice(item, l);
    return [
      {
        item,
        listing: l,
        price,
        originalPrice: original,
        discounted,
        sellPrice: item.baseSellPrice,
        soldOut: !l.unlimitedStock && l.stock <= 0,
        locked: l.availability === "locked",
      },
    ];
  });
}

export function applyFilters(
  rows: ShopRow[],
  f: ShopFilters,
  favorites: string[],
): ShopRow[] {
  const q = f.search.trim().toLowerCase();
  let out = rows.filter((r) => {
    if (f.category !== "all" && r.listing.categoryId !== f.category) return false;
    if (f.rarity !== "any" && r.item.rarity !== f.rarity) return false;
    if (f.maxPrice !== null && r.price > f.maxPrice) return false;
    if (f.availableOnly && (r.soldOut || r.locked)) return false;
    if (f.favoritesOnly && !favorites.includes(r.item.id)) return false;
    if (q) {
      const hay = `${r.item.name} ${r.item.type} ${r.item.subtype} ${r.listing.categoryId}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const by: Record<SortId, (a: ShopRow, b: ShopRow) => number> = {
    default: () => 0,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rarity: (a, b) => rarityRank[b.item.rarity] - rarityRank[a.item.rarity],
    "name-asc": (a, b) => a.item.name.localeCompare(b.item.name),
    "name-desc": (a, b) => b.item.name.localeCompare(a.item.name),
    newest: (a, b) => Number(Boolean(b.listing.isNew)) - Number(Boolean(a.listing.isNew)),
  };
  out = [...out].sort(by[f.sort]);
  return out;
}

/** Pagination is always derived — never hard-coded page screens. */
export function paginate<T>(rows: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return { pageRows: rows.slice(start, start + perPage), totalPages, current, total: rows.length };
}

export function useShopEngine(shop: ShopConfig, favorites: string[]) {
  const [filters, setFiltersState] = useState<ShopFilters>(defaultFilters);
  const [page, setPage] = useState(1);

  const setFilters = (patch: Partial<ShopFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
    setPage(1); // any filter change recalculates pagination from page 1
  };
  const resetFilters = () => {
    setFiltersState(defaultFilters);
    setPage(1);
  };

  const rows = useMemo(() => buildRows(shop), [shop]);
  const filtered = useMemo(
    () => applyFilters(rows, filters, favorites),
    [rows, filters, favorites],
  );
  const pagination = useMemo(
    () => paginate(filtered, page, shop.itemsPerPage),
    [filtered, page, shop.itemsPerPage],
  );

  return { filters, setFilters, resetFilters, rows, filtered, pagination, page, setPage };
}

export function maxAffordable(
  price: number,
  balance: number,
  stock: number | null,
  purchaseLimit?: number,
) {
  const byMoney = price > 0 ? Math.floor(balance / price) : 999;
  const caps = [byMoney, purchaseLimit ?? Infinity, stock ?? Infinity];
  return Math.max(0, Math.min(...caps));
}

export function formatRestock(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}
