import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small translucent HUD container — lighter than the full-screen Panel. */
export function HudPanel({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative border border-border/70 bg-background/70 backdrop-blur-[2px]",
        padded && "p-2.5",
        className,
      )}
    >
      <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-border-strong" />
      <span className="pointer-events-none absolute right-0 bottom-0 h-2 w-2 border-r border-b border-border-strong" />
      {children}
    </div>
  );
}

export function HudHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="h-2.5 w-px bg-primary" />
      <span className="label-caps text-[9px] text-muted-foreground">{children}</span>
    </div>
  );
}

export type BarTone = "hp" | "shield" | "energy" | "armor" | "primary" | "danger";

const toneBg: Record<BarTone, string> = {
  hp: "bg-hp",
  shield: "bg-energy",
  armor: "bg-muted-foreground",
  energy: "bg-primary",
  primary: "bg-primary",
  danger: "bg-destructive",
};

/** Compact horizontal HUD bar with label + numeric readout. */
export function HudBar({
  label,
  value,
  max,
  tone = "primary",
  showPercent = true,
  size = "md",
  className,
}: {
  label: string;
  value: number;
  max: number;
  tone?: BarTone;
  showPercent?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="label-caps w-[46px] shrink-0 text-[9px] text-muted-foreground">{label}</span>
      <div
        className={cn(
          "relative flex-1 border border-border/80 bg-background/80",
          size === "sm" ? "h-1.5" : "h-2",
        )}
      >
        <div
          className={cn("h-full transition-[width] duration-300", toneBg[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showPercent && (
        <span className="w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-foreground/80">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
