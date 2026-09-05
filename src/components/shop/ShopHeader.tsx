import { GameButton } from "@/components/game/ui";
import { ShopCurrencyDisplay, ShopReputation } from "@/components/shop/ShopPrimitives";
import { cn } from "@/lib/utils";
import { currencies, type ShopConfig } from "@/lib/shop-data";

export function ShopHeader({
  shop,
  shops,
  balances,
  onSelectShop,
}: {
  shop: ShopConfig;
  shops: ShopConfig[];
  balances: Record<string, number>;
  onSelectShop: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="min-w-0">
        <h1 className="truncate text-xl text-foreground">{shop.name}</h1>
        <p className="label-caps text-[10px] text-muted-foreground">{shop.location}</p>
      </div>

      <div className="ml-2 flex items-center gap-1 overflow-x-auto">
        {shops.map((s) => (
          <GameButton
            key={s.id}
            size="sm"
            variant={s.id === shop.id ? "primary" : "default"}
            onClick={() => onSelectShop(s.id)}
            className={cn("shrink-0")}
          >
            {s.name}
          </GameButton>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-5">
        {shop.showReputation && shop.reputation && <ShopReputation {...shop.reputation} />}
        <ShopCurrencyDisplay
          currencies={currencies}
          balances={balances}
          highlightId={shop.currencyId}
        />
      </div>
    </div>
  );
}
