import { cn } from "@/lib/utils";

export function ShopQuantitySelector({
  value,
  max,
  onChange,
  disabled,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const clamp = (v: number) => Math.max(1, Math.min(Math.max(1, max), Math.round(v) || 1));
  const btn =
    "h-8 w-8 border border-border bg-surface font-mono text-sm text-foreground/85 transition-colors hover:border-primary/70 hover:text-primary disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className={cn("flex items-center gap-2", disabled && "opacity-50")}>
      <button className={btn} disabled={disabled || value <= 1} onClick={() => onChange(clamp(value - 1))}>
        −
      </button>
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(clamp(Number(e.target.value.replace(/\D/g, ""))))}
        className="h-8 w-16 border border-border bg-background text-center font-mono text-sm tabular-nums text-foreground outline-none focus:border-primary"
      />
      <button className={btn} disabled={disabled || value >= max} onClick={() => onChange(clamp(value + 1))}>
        +
      </button>
      <button
        className="label-caps h-8 border border-border bg-surface px-2 text-[10px] text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        disabled={disabled || max < 1}
        onClick={() => onChange(Math.max(1, max))}
      >
        Max
      </button>
    </div>
  );
}
