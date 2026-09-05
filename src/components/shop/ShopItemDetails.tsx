import { useState } from "react";
import { GameButton, ItemSlot, StatRow, TabBar, rarityText } from "@/components/game/ui";
import { ShopComparePanel } from "@/components/shop/ShopComparePanel";
import { ShopQuantitySelector } from "@/components/shop/ShopQuantitySelector";
import { ShopDiscountBadge, ShopStockIndicator, ShopTag } from "@/components/shop/ShopPrimitives";
import { rarityLabel } from "@/lib/game-data";
import type { GameItem, ShopConfig, ShopCurrency } from "@/lib/shop-data";
import { maxAffordable, type ShopRow } from "@/lib/shop-engine";
import { cn } from "@/lib/utils";

export type TradeMode = "buy" | "sell";

export function ShopItemDetails({
  row,
  shop,
  currency,
  balance,
  owned,
  equipped,
  mode,
  onModeChange,
  onBuy,
  onSell,
}: {
  row: ShopRow | undefined;
  shop: ShopConfig;
  currency: ShopCurrency;
  balance: number;
  owned: number;
  equipped: GameItem | undefined;
  mode: TradeMode;
  onModeChange: (m: TradeMode) => void;
  onBuy: (row: ShopRow, qty: number, total: number) => void;
  onSell: (row: ShopRow, qty: number, total: number) => void;
}) {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"details" | "compare">("details");

  if (!row) {
    return <p className="text-sm text-muted-foreground">Select an item to inspect it.</p>;
  }

  const { item, listing } = row;
  const stock = listing.unlimitedStock ? null : listing.stock;
  const buyMax = maxAffordable(row.price, balance, stock, listing.purchaseLimit);
  const max = mode === "buy" ? buyMax : owned;
  const q = Math.max(1, Math.min(qty, Math.max(1, max)));
  const unit = mode === "buy" ? row.price : row.sellPrice;
  const total = unit * q;
  const comparable = shop.showCompare && (item.type === "weapon" || item.type === "armor" || item.type === "equipment");

  const disabledReason =
    mode === "buy"
      ? row.locked
        ? listing.requirement ?? "Locked"
        : row.soldOut
          ? "Out of stock"
          : buyMax < 1
            ? "Insufficient funds"
            : null
      : owned < 1
        ? "None owned"
        : null;

  return (
    <div className="flex min-h-0 flex-col gap-3">
      {(shop.showBuy && shop.showSell) && (
        <TabBar
          tabs={[
            { id: "buy", label: "Buy" },
            { id: "sell", label: "Sell" },
          ]}
          value={mode}
          onChange={(m) => {
            onModeChange(m as TradeMode);
            setQty(1);
          }}
        />
      )}

      <div className="flex gap-3">
        <ItemSlot label={item.name} rarity={item.rarity} size="lg" />
        <div className="min-w-0">
          <h3 className="truncate text-base">{item.name}</h3>
          <p className={cn("label-caps", rarityText[item.rarity])}>
            {rarityLabel[item.rarity]} · {item.type}
          </p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {item.subtype} · Item level {item.level}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {row.discounted && <ShopDiscountBadge percent={listing.discountPercentage ?? 0} />}
            {row.locked && <ShopTag tone="danger">{listing.requirement ?? "Locked"}</ShopTag>}
            {listing.purchaseLimit && <ShopTag>Limit {listing.purchaseLimit}</ShopTag>}
          </div>
        </div>
      </div>

      {comparable && (
        <TabBar
          tabs={[
            { id: "details", label: "Details" },
            { id: "compare", label: "Compare" },
          ]}
          value={tab}
          onChange={(t) => setTab(t as "details" | "compare")}
        />
      )}

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {tab === "compare" && comparable ? (
          <ShopComparePanel current={equipped} next={item} />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <div className="mt-2">
              {item.stats.map((s) => (
                <StatRow key={s.label} label={s.label} value={s.value} accent />
              ))}
            </div>
            {item.requirements && (
              <p className="mt-2 label-caps text-[9px] text-muted-foreground">
                Requires: {item.requirements.join(" · ")}
              </p>
            )}
            <div className="mt-2 grid grid-cols-2 gap-x-3">
              <StatRow label="Buy Price" value={`${row.price.toLocaleString()} ${currency.short}`} />
              <StatRow label="Sell Price" value={`${row.sellPrice.toLocaleString()} ${currency.short}`} />
              <StatRow label="Owned" value={owned} />
              <StatRow
                label="Stock"
                value={
                  <ShopStockIndicator
                    stock={listing.stock}
                    maxStock={listing.maxStock}
                    {...(listing.unlimitedStock !== undefined
                      ? { unlimited: listing.unlimitedStock }
                      : {})}
                    {...(listing.restockSeconds !== undefined
                      ? { restockSeconds: listing.restockSeconds }
                      : {})}
                  />
                }
              />
            </div>
          </>
        )}
      </div>

      {/* Transaction panel */}
      <div className="shrink-0 border-t border-border pt-3">
        <ShopQuantitySelector
          value={q}
          max={Math.max(1, max)}
          onChange={setQty}
          disabled={Boolean(disabledReason)}
        />
        <div className="mt-2">
          <StatRow label="Unit Price" value={`${unit.toLocaleString()} ${currency.short}`} />
          <StatRow label="Quantity" value={q} />
          <StatRow label={mode === "buy" ? "Total" : "Total Value"} value={`${total.toLocaleString()} ${currency.short}`} accent />
        </div>

        {disabledReason && (
          <p className="mt-2 label-caps text-[9px] text-destructive">{disabledReason}</p>
        )}

        <div className="mt-2 grid grid-cols-2 gap-2">
          {mode === "buy" ? (
            <>
              <GameButton
                variant="primary"
                disabled={Boolean(disabledReason)}
                onClick={() => onBuy(row, q, total)}
              >
                Buy
              </GameButton>
              <GameButton
                disabled={Boolean(disabledReason)}
                onClick={() => {
                  setQty(Math.max(1, buyMax));
                  onBuy(row, Math.max(1, buyMax), unit * Math.max(1, buyMax));
                }}
              >
                Buy Max
              </GameButton>
            </>
          ) : (
            <>
              <GameButton
                variant="primary"
                disabled={Boolean(disabledReason)}
                onClick={() => onSell(row, q, total)}
              >
                Sell
              </GameButton>
              <GameButton
                disabled={Boolean(disabledReason)}
                onClick={() => {
                  setQty(Math.max(1, owned));
                  onSell(row, Math.max(1, owned), unit * Math.max(1, owned));
                }}
              >
                Sell Max
              </GameButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
