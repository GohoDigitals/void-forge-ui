import { cn } from "@/lib/utils";
import type { ShopCurrency } from "@/lib/shop-data";
import { formatRestock } from "@/lib/shop-engine";

export function ShopCurrencyDisplay({
  currencies,
  balances,
  highlightId,
}: {
  currencies: ShopCurrency[];
  balances: Record<string, number>;
  highlightId?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      {currencies.map((c) => (
        <div key={c.id} className="text-right">
          <div className="label-caps text-[9px] text-muted-foreground">{c.label}</div>
          <div
            className={cn(
              "font-mono text-sm tabular-nums",
              c.id === highlightId ? "text-accent" : "text-foreground/80",
            )}
          >
            {(balances[c.id] ?? 0).toLocaleString()}
            <span className="ml-1 text-[10px] text-muted-foreground">{c.short}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ShopStockIndicator({
  stock,
  maxStock,
  unlimited,
  restockSeconds,
  compact,
}: {
  stock: number;
  maxStock: number;
  unlimited?: boolean;
  restockSeconds?: number;
  compact?: boolean;
}) {
  if (unlimited)
    return <span className="label-caps text-[9px] text-muted-foreground">Unlimited</span>;
  if (stock <= 0)
    return (
      <span className="label-caps text-[9px] text-destructive">
        {restockSeconds ? `Restock ${formatRestock(restockSeconds)}` : "Sold Out"}
      </span>
    );
  return (
    <span className={cn("font-mono text-[10px] text-muted-foreground", compact && "text-[9px]")}>
      {stock} / {maxStock}
    </span>
  );
}

export function ShopDiscountBadge({ percent }: { percent: number }) {
  return (
    <span className="label-caps border border-accent/60 bg-accent/15 px-1 text-[9px] text-accent">
      -{percent}%
    </span>
  );
}

export function ShopTag({
  tone = "muted",
  children,
}: {
  tone?: "muted" | "primary" | "accent" | "danger";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "label-caps border px-1 text-[9px]",
        tone === "primary" && "border-primary/60 bg-primary/10 text-primary",
        tone === "accent" && "border-accent/60 bg-accent/10 text-accent",
        tone === "danger" && "border-destructive/60 bg-destructive/10 text-destructive",
        tone === "muted" && "border-border bg-surface-2 text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

export function ShopReputation({
  label,
  level,
  percent,
}: {
  label: string;
  level: number;
  percent: number;
}) {
  return (
    <div className="min-w-[150px]">
      <div className="flex items-baseline justify-between">
        <span className="label-caps text-[9px] text-muted-foreground">{label}</span>
        <span className="font-mono text-[11px] text-primary">LV {level}</span>
      </div>
      <div className="mt-1 h-1.5 border border-border bg-background">
        <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
