import { useEffect, useMemo, useState } from "react";
import { Panel } from "@/components/game/ui";
import { ShopCategoryTabs } from "@/components/shop/ShopCategoryTabs";
import {
  ShopConfirmationModal,
  type PendingTransaction,
} from "@/components/shop/ShopConfirmationModal";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopItemDetails, type TradeMode } from "@/components/shop/ShopItemDetails";
import { ShopItemGrid } from "@/components/shop/ShopItemGrid";
import { ShopNotifications, type ShopNotice } from "@/components/shop/ShopNotifications";
import { ShopPagination } from "@/components/shop/ShopPagination";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { currencyMeta, equippedForSlot, playerActions, usePlayer, usedInventorySlots } from "@/lib/player-store";
import { buildRows, useShopEngine, type ShopRow } from "@/lib/shop-engine";
import { shopById, shops, type ShopConfig } from "@/lib/shop-data";

/**
 * Reusable Shop Engine UI. The same component renders every merchant —
 * behaviour and visible controls come entirely from the ShopConfig.
 */
export function ShopScreen({
  shopId,
  onShopChange,
}: {
  shopId: string;
  onShopChange: (id: string) => void;
}) {
  const shop: ShopConfig = shopById(shopId);
  const player = usePlayer();
  const currency = currencyMeta(shop.currencyId);
  const balance = player.currencies[shop.currencyId] ?? 0;

  const { filters, setFilters, resetFilters, pagination, filtered, page, setPage } = useShopEngine(
    shop,
    player.favorites,
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<TradeMode>(shop.showBuy ? "buy" : "sell");
  const [pending, setPending] = useState<PendingTransaction | null>(null);
  const [notices, setNotices] = useState<ShopNotice[]>([]);

  const allRows = useMemo(() => buildRows(shop), [shop]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: allRows.length };
    for (const r of allRows) c[r.listing.categoryId] = (c[r.listing.categoryId] ?? 0) + 1;
    return c;
  }, [allRows]);

  // Reset selection when the shop changes.
  useEffect(() => {
    setSelectedId(null);
    setMode(shop.showBuy ? "buy" : "sell");
    resetFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shop.id]);

  const selected: ShopRow | undefined =
    allRows.find((r) => r.item.id === selectedId) ?? pagination.pageRows[0];

  const notify = (n: Omit<ShopNotice, "id">) => {
    const id = Date.now() + Math.random();
    setNotices((prev) => [{ ...n, id }, ...prev].slice(0, 4));
    setTimeout(() => setNotices((prev) => prev.filter((x) => x.id !== id)), 2600);
  };

  const commit = (tx: PendingTransaction, row: ShopRow) => {
    if (tx.mode === "buy") {
      if (tx.total > balance) return notify({ title: "Insufficient Funds", tone: "error" });
      if (!row.listing.unlimitedStock && row.listing.stock < tx.quantity)
        return notify({ title: "Out of Stock", tone: "error" });
      if (
        usedInventorySlots(player) >= player.inventoryCapacity &&
        !player.owned[row.item.id]
      )
        return notify({ title: "Inventory Full", tone: "error" });
      if (!row.listing.unlimitedStock) row.listing.stock -= tx.quantity;
      playerActions.buy(row.item.id, tx.quantity, shop.currencyId, tx.total);
      notify({
        title: "Purchase Complete",
        detail: `+${tx.quantity} ${row.item.name}`,
        tone: "success",
      });
    } else {
      playerActions.sell(row.item.id, tx.quantity, shop.currencyId, tx.total);
      if (!row.listing.unlimitedStock) row.listing.stock += tx.quantity;
      notify({
        title: "Sale Complete",
        detail: `+${tx.total.toLocaleString()} ${currency.short}`,
        tone: "success",
      });
    }
  };

  const request = (row: ShopRow, qty: number, total: number, m: TradeMode) => {
    const tx: PendingTransaction = {
      mode: m,
      itemName: row.item.name,
      quantity: qty,
      unit: m === "buy" ? row.price : row.sellPrice,
      total,
      currencyShort: currency.short,
    };
    // Small transactions skip confirmation.
    if (total < 1000) commit(tx, row);
    else setPending(tx);
  };

  const owned = player.owned[selected?.item.id ?? ""] ?? 0;

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-3">
      <ShopNotifications notices={notices} />

      <ShopHeader
        shop={shop}
        shops={shops}
        balances={player.currencies}
        onSelectShop={onShopChange}
      />

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_360px] gap-3">
        <Panel title={`${shop.name} Stock`} bodyClassName="flex min-h-0 flex-col gap-3">
          <p className="label-caps text-[9px] text-muted-foreground">{shop.description}</p>

          <ShopCategoryTabs
            categories={shop.categories}
            counts={counts}
            value={filters.category}
            onChange={(id) => setFilters({ category: id })}
          />

          <ShopToolbar
            filters={filters}
            showSearch={shop.showSearch}
            showSorting={shop.showSorting}
            showFilters={shop.showFilters}
            showFavorites={shop.showFavorites}
            onChange={setFilters}
            onReset={resetFilters}
            resultCount={filtered.length}
          />

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <ShopItemGrid
              rows={pagination.pageRows}
              shop={shop}
              currency={currency}
              selectedId={selected?.item.id ?? null}
              owned={player.owned}
              favorites={player.favorites}
              onSelect={(id) => {
                setSelectedId(id);
                playerActions.view(id);
              }}
              onToggleFavorite={playerActions.toggleFavorite}
            />
          </div>

          {shop.showPagination && (
            <div className="shrink-0 border-t border-border pt-2">
              <ShopPagination
                page={pagination.current}
                totalPages={pagination.totalPages}
                total={pagination.total}
                perPage={shop.itemsPerPage}
                onChange={setPage}
              />
            </div>
          )}
        </Panel>

        <Panel title="Transaction Terminal" bodyClassName="flex min-h-0 flex-col">
          <ShopItemDetails
            row={selected}
            shop={shop}
            currency={currency}
            balance={balance}
            owned={owned}
            equipped={equippedForSlot(player, selected?.item.slot)}
            mode={mode}
            onModeChange={setMode}
            onBuy={(row, qty, total) => request(row, qty, total, "buy")}
            onSell={(row, qty, total) => request(row, qty, total, "sell")}
          />
        </Panel>
      </div>

      <div className="flex shrink-0 items-center gap-4 border-t border-border pt-2">
        <span className="label-caps text-[9px] text-muted-foreground">
          Cargo {usedInventorySlots(player)} / {player.inventoryCapacity}
        </span>
        <span className="label-caps text-[9px] text-muted-foreground">
          Balance {balance.toLocaleString()} {currency.short}
        </span>
        {player.recentlyViewed.length > 0 && (
          <span className="label-caps ml-auto truncate text-[9px] text-muted-foreground">
            Recently viewed: {player.recentlyViewed.slice(0, 4).join(" · ")}
          </span>
        )}
        <span className="label-caps text-[9px] text-muted-foreground">Page {page}</span>
      </div>

      <ShopConfirmationModal
        tx={pending}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending && selected) commit(pending, selected);
          setPending(null);
        }}
      />
    </div>
  );
}
