import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Rarity } from "@/lib/game-data";

/* ---------- Panel ---------- */

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel-frame relative flex min-h-0 flex-col rounded-sm", className)}>
      <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-border-strong" />
      <span className="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r border-b border-border-strong" />
      {title && (
        <header className="flex h-9 shrink-0 items-center justify-between gap-3 border-b border-border px-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-px bg-primary" />
            <h2 className="label-caps text-foreground/90">{title}</h2>
          </div>
          {action}
        </header>
      )}
      <div className={cn("min-h-0 flex-1 p-3", bodyClassName)}>{children}</div>
    </section>
  );
}

/* ---------- Button ---------- */

export function GameButton({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      {...props}
      className={cn(
        "label-caps corner-cut relative inline-flex items-center justify-center gap-2 border transition-colors duration-150 select-none",
        "disabled:pointer-events-none disabled:opacity-40",
        size === "sm" && "h-7 px-3 text-[10px]",
        size === "md" && "h-9 px-4",
        size === "lg" && "h-11 px-6 text-xs",
        variant === "default" &&
          "border-border bg-surface text-foreground/85 hover:border-border-strong hover:bg-surface-2 hover:text-foreground",
        variant === "primary" &&
          "border-primary/70 bg-primary/15 text-primary hover:bg-primary/25",
        variant === "danger" &&
          "border-destructive/60 bg-destructive/10 text-destructive hover:bg-destructive/20",
        variant === "ghost" && "border-transparent text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ---------- Tabs ---------- */

export function TabBar<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { id: T; label: string; disabled?: boolean }[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-stretch gap-1 border-b border-border", className)}>
      {tabs.map((t) => (
        <button
          key={t.id}
          disabled={t.disabled}
          onClick={() => onChange(t.id)}
          className={cn(
            "label-caps relative -mb-px border border-b-0 px-4 py-2 transition-colors",
            "disabled:pointer-events-none disabled:opacity-35",
            value === t.id
              ? "border-border bg-surface-2 text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
          {value === t.id && <span className="absolute inset-x-0 top-0 h-px bg-primary" />}
        </button>
      ))}
    </div>
  );
}

/* ---------- Stat row / bars ---------- */

export function StatRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-1.5 last:border-b-0">
      <span className="label-caps text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-mono text-sm tabular-nums",
          accent ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function MeterBar({
  label,
  value,
  max,
  tone = "primary",
}: {
  label: string;
  value: number;
  max: number;
  tone?: "primary" | "hp" | "energy" | "accent";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const toneClass =
    tone === "hp"
      ? "bg-hp"
      : tone === "energy"
        ? "bg-energy"
        : tone === "accent"
          ? "bg-accent"
          : "bg-primary";
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="label-caps text-muted-foreground">{label}</span>
        <span className="font-mono text-xs tabular-nums text-foreground/80">
          {value} / {max}
        </span>
      </div>
      <div className="h-2 w-full border border-border bg-background">
        <div className={cn("h-full transition-[width] duration-300", toneClass)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ---------- Rarity ---------- */

export const rarityBorder: Record<Rarity, string> = {
  common: "border-rarity-common/45",
  uncommon: "border-rarity-uncommon/60",
  rare: "border-rarity-rare/70",
  epic: "border-rarity-epic/70",
  legendary: "border-rarity-legendary/80",
};

export const rarityText: Record<Rarity, string> = {
  common: "text-rarity-common",
  uncommon: "text-rarity-uncommon",
  rare: "text-rarity-rare",
  epic: "text-rarity-epic",
  legendary: "text-rarity-legendary",
};

export const rarityGlow: Record<Rarity, string> = {
  common: "bg-rarity-common/5",
  uncommon: "bg-rarity-uncommon/10",
  rare: "bg-rarity-rare/10",
  epic: "bg-rarity-epic/12",
  legendary: "bg-rarity-legendary/15",
};

/* ---------- Item slot ---------- */

export function ItemSlot({
  label,
  rarity,
  quantity,
  selected,
  empty,
  size = "md",
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  children,
}: {
  label?: string;
  rarity?: Rarity;
  quantity?: number;
  selected?: boolean;
  empty?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  children?: ReactNode;
}) {
  const dims = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20",
    xl: "h-32 w-32",
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group relative flex shrink-0 items-center justify-center border bg-background/60 transition-all duration-150",
        dims,
        empty ? "border-dashed border-border/70" : rarity ? rarityBorder[rarity] : "border-border",
        !empty && rarity && rarityGlow[rarity],
        selected && "outline outline-1 outline-primary",
        onClick && "hover:border-primary/80 hover:bg-surface-2",
        className,
      )}
    >
      {children ??
        (empty ? (
          <span className="label-caps text-[9px] text-muted-foreground/60">{label ?? "Empty"}</span>
        ) : (
          <span className="px-1 text-center font-display text-[9px] leading-tight tracking-wider text-foreground/80">
            {label}
          </span>
        ))}
      {quantity !== undefined && quantity > 1 && (
        <span className="absolute right-0.5 bottom-0.5 bg-background/85 px-1 font-mono text-[10px] leading-tight text-foreground/85">
          {quantity}
        </span>
      )}
    </button>
  );
}

/* ---------- Screen header ---------- */

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="text-xl text-foreground">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
