import { factionLabel, type TargetState } from "@/lib/hud-data";
import { HudBar, HudPanel } from "./HudPrimitives";

/** Compact target readout for the upper-center area. */
export function TargetStatus({ target }: { target: TargetState | null }) {
  if (!target) {
    return (
      <div className="label-caps border border-dashed border-border/60 bg-background/50 px-3 py-1 text-[9px] text-muted-foreground/70">
        No target
      </div>
    );
  }

  return (
    <HudPanel className="w-[340px]" padded={false}>
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-2.5 py-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="label-caps text-[9px] text-destructive">Target</span>
          <span className="truncate font-display text-[12px] tracking-[0.14em] text-foreground">
            {target.name}
          </span>
        </div>
        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
          LV {target.level}
        </span>
      </div>
      <div className="space-y-1 px-2.5 py-1.5">
        <HudBar label="HP" value={target.hp} max={target.hpMax} tone="hp" size="sm" />
        <HudBar
          label="Shield"
          value={target.shield}
          max={target.shieldMax}
          tone="shield"
          size="sm"
        />
        <div className="flex items-center justify-between pt-0.5">
          <span className="label-caps text-[9px] text-muted-foreground">
            {factionLabel[target.faction]}
          </span>
          <span className="font-mono text-[11px] text-primary">
            {target.distanceKm.toFixed(1)} KM
          </span>
        </div>
      </div>
    </HudPanel>
  );
}
