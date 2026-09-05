import { ShopItemCard } from "@/components/shop/ShopItemCard";
import type { ShopRow } from "@/lib/shop-engine";
import type { ShopConfig, ShopCurrency } from "@/lib/shop-data";

export function ShopItemGrid({
  rows,
  shop,
  currency,
  selectedId,
  owned,
  favorites,
  onSelect,
  onToggleFavorite,
}: {
  rows: ShopRow[];
  shop: ShopConfig;
  currency: ShopCurrency;
  selectedId: string | null;
  owned: Record<string, number>;
  favorites: string[];
  onSelect: (itemId: string) => void;
  onToggleFavorite: (itemId: string) => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="label-caps text-[10px] text-muted-foreground">No items match this filter</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-2">
      {rows.map((row) => (
        <ShopItemCard
          key={`${row.item.id}-${row.listing.categoryId}`}
          row={row}
          currency={currency}
          selected={row.item.id === selectedId}
          owned={owned[row.item.id] ?? 0}
          favorite={favorites.includes(row.item.id)}
          showStock={shop.showStock}
          showFavorites={shop.showFavorites}
          onSelect={() => onSelect(row.item.id)}
          onToggleFavorite={() => onToggleFavorite(row.item.id)}
        />
      ))}
    </div>
  );
}
