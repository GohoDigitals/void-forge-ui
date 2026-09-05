import type { GameItem } from "@/lib/shop-data";
import { cn } from "@/lib/utils";

const num = (v: string) => Number(v.replace(/[^0-9.-]/g, "")) || 0;

export function ShopComparePanel({
  current,
  next,
}: {
  current: GameItem | undefined;
  next: GameItem;
}) {
  if (!current) {
    return (
      <p className="label-caps text-[10px] text-muted-foreground">
        No comparable item equipped
      </p>
    );
  }

  const labels = Array.from(
    new Set([...current.stats.map((s) => s.label), ...next.stats.map((s) => s.label)]),
  );

  return (
    <div>
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 border-b border-border pb-1">
        {["Stat", "Current", "New", "Δ"].map((h) => (
          <span key={h} className="label-caps text-[9px] text-muted-foreground">
            {h}
          </span>
        ))}
      </div>
      {labels.map((label) => {
        const a = current.stats.find((s) => s.label === label)?.value ?? "—";
        const b = next.stats.find((s) => s.label === label)?.value ?? "—";
        const d = num(b) - num(a);
        return (
          <div
            key={label}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 border-b border-border/50 py-1 last:border-b-0"
          >
            <span className="label-caps text-[9px] text-foreground/80">{label}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{a}</span>
            <span className="font-mono text-[11px] text-foreground">{b}</span>
            <span
              className={cn(
                "font-mono text-[11px]",
                d > 0 ? "text-success" : d < 0 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {d > 0 ? `+${d}` : d < 0 ? d : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
