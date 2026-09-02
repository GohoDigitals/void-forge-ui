import { cn } from "@/lib/utils";
import type { MissionState } from "@/lib/hud-data";
import { HudPanel } from "./HudPrimitives";

export function MissionTracker({
  mission,
  collapsed,
  onToggle,
}: {
  mission: MissionState;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const done = mission.objectives.filter((o) => o.current >= o.required).length;

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 border border-border/70 bg-background/70 px-2 py-1 backdrop-blur-[2px] hover:border-primary/60"
      >
        <span className="h-2.5 w-px bg-accent" />
        <span className="label-caps text-[9px] text-muted-foreground">Mission</span>
        <span className="font-mono text-[11px] text-accent">
          {done}/{mission.objectives.length}
        </span>
      </button>
    );
  }

  return (
    <HudPanel className="w-[268px]" padded={false}>
      <div className="flex items-center justify-between border-b border-border/60 px-2.5 py-1">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-px bg-accent" />
          <span className="label-caps text-[9px] text-muted-foreground">
            {mission.kind === "main" ? "Main Mission" : mission.kind === "side" ? "Side Mission" : "Dynamic"}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="font-mono text-[11px] leading-none text-muted-foreground hover:text-primary"
          aria-label="Collapse mission tracker"
        >
          −
        </button>
      </div>

      <div className="px-2.5 py-2">
        <div className="font-display text-[12px] tracking-[0.12em] text-foreground">
          {mission.title}
        </div>
        <div className="font-mono text-[10px] text-muted-foreground">{mission.summary}</div>

        <ul className="mt-2 space-y-1">
          {mission.objectives.map((o) => {
            const complete = o.current >= o.required;
            return (
              <li key={o.id} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-3 w-3 shrink-0 items-center justify-center border text-[8px] leading-none",
                    complete ? "border-success text-success" : "border-border text-transparent",
                  )}
                >
                  ×
                </span>
                <span
                  className={cn(
                    "flex-1 truncate text-[12px]",
                    complete ? "text-muted-foreground line-through" : "text-foreground/85",
                  )}
                >
                  {o.label}
                </span>
                <span className="font-mono text-[10px] tabular-nums text-primary">
                  {o.current}/{o.required}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </HudPanel>
  );
}
