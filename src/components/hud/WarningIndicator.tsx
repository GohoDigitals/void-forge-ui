import { cn } from "@/lib/utils";
import type { CombatWarning } from "@/lib/hud-data";

const levelClass = {
  info: "border-border/70 text-foreground/80",
  warning: "border-warning/60 text-warning",
  critical: "border-destructive/70 text-destructive",
} as const;

/** Contextual warnings — rendered only while the condition holds. */
export function WarningIndicator({ warnings }: { warnings: CombatWarning[] }) {
  if (warnings.length === 0) return null;
  return (
    <div className="flex flex-col items-start gap-1">
      {warnings.map((w) => (
        <div
          key={w.id}
          className={cn(
            "label-caps border bg-background/70 px-2 py-0.5 text-[9px] backdrop-blur-[2px]",
            levelClass[w.level],
            w.level === "critical" && "animate-pulse",
          )}
        >
          {w.label}
        </div>
      ))}
    </div>
  );
}
