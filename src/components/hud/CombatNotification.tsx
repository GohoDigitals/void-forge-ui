import { cn } from "@/lib/utils";
import type { CombatNotice } from "@/lib/hud-data";

const levelClass = {
  info: "border-border/70 text-foreground/85",
  warning: "border-warning/60 text-warning",
  critical: "border-destructive/70 text-destructive",
} as const;

/** Transient combat / system messages for the top-center strip. */
export function CombatNotification({ notices }: { notices: CombatNotice[] }) {
  if (notices.length === 0) return null;
  return (
    <div className="flex flex-col items-center gap-1">
      {notices.slice(-3).map((n) => (
        <div
          key={n.id}
          className={cn(
            "label-caps border-y bg-background/60 px-3 py-1 text-[10px] backdrop-blur-[2px]",
            levelClass[n.level],
          )}
        >
          {n.text}
        </div>
      ))}
    </div>
  );
}
