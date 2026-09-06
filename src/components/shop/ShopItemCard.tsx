import { ItemSlot, rarityText } from "@/components/game/ui";
import { ShopDiscountBadge, ShopStockIndicator, ShopTag } from "@/components/shop/ShopPrimitives";
import { rarityLabel } from "@/lib/game-data";
import type { ShopRow } from "@/lib/shop-engine";
import type { ShopCurrency } from "@/lib/shop-data";
import { cn } from "@/lib/utils";

export function ShopItemCard({
  row,
  selected,
  currency,
  owned,
  favorite,
  showStock,
  showFavorites,
  onSelect,
  onToggleFavorite,
}: {
  row: ShopRow;
  selected: boolean;
  currency: ShopCurrency;
  owned: number;
  favorite: boolean;
  showStock: boolean;
  showFavorites: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}) {
  const { item, listing } = row;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 border bg-surface/60 p-2 transition-colors",
        selected ? "border-primary" : "border-border hover:border-border-strong",
        (row.soldOut || row.locked) && "opacity-60",
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
        className="flex cursor-pointer items-start gap-2 text-left"
      >
        <ItemSlot label={item.name} rarity={item.rarity} size="sm" onClick={onSelect} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[11px] tracking-wider text-foreground/90">
            {item.name}
          </div>
          <div className={cn("label-caps text-[9px]", rarityText[item.rarity])}>
            {rarityLabel[item.rarity]}
          </div>
          <div className="label-caps text-[9px] text-muted-foreground">{item.subtype}</div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div>
          {row.discounted && (
            <div className="font-mono text-[10px] text-muted-foreground line-through">
              {row.originalPrice.toLocaleString()}
            </div>
          )}
          <div className="font-mono text-xs tabular-nums text-accent">
            {row.price.toLocaleString()}
            <span className="ml-1 text-[9px] text-muted-foreground">{currency.short}</span>
          </div>
        </div>
        {showStock && (
          <ShopStockIndicator
            stock={listing.stock}
            maxStock={listing.maxStock}
            {...(listing.unlimitedStock !== undefined ? { unlimited: listing.unlimitedStock } : {})}
            {...(listing.restockSeconds !== undefined
              ? { restockSeconds: listing.restockSeconds }
              : {})}
            compact
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {listing.isNew && <ShopTag tone="primary">New</ShopTag>}
        {listing.availability === "featured" && <ShopTag tone="accent">Featured</ShopTag>}
        {listing.availability === "limited" && <ShopTag>Limited</ShopTag>}
        {row.locked && <ShopTag tone="danger">Locked</ShopTag>}
        {row.soldOut && <ShopTag tone="danger">Sold Out</ShopTag>}
        {row.discounted && <ShopDiscountBadge percent={listing.discountPercentage ?? 0} />}
        {owned > 0 && <ShopTag>Owned {owned}</ShopTag>}
      </div>

      {showFavorites && (
        <button
          type="button"
          aria-label={favorite ? "Remove favorite" : "Add favorite"}
          onClick={onToggleFavorite}
          className={cn(
            "absolute right-1 top-1 h-5 w-5 border text-[10px] leading-none transition-colors",
            favorite
              ? "border-accent/70 bg-accent/15 text-accent"
              : "border-border/70 text-muted-foreground hover:text-foreground",
          )}
        >
          ★
        </button>
      )}
    </div>
  );
}
