import { cn } from "@/lib/utils";
import type { ShipMovement } from "@/lib/hud-data";
import { HudBar, HudPanel } from "./HudPrimitives";

export function SpeedIndicator({
  movement,
  onThrottle,
}: {
  movement: ShipMovement;
  onThrottle: (value: number) => void;
}) {
  return (
    <HudPanel className="w-[212px]">
      <div className="flex items-end justify-between border-b border-border/60 pb-1.5">
        <div>
          <div className="label-caps text-[9px] text-muted-foreground">Speed</div>
          <div className="font-mono text-lg leading-none text-foreground">
            {Math.round(movement.speed)}
            <span className="ml-1 text-[11px] text-muted-foreground">m/s</span>
          </div>
        </div>
        <div className="text-right">
          <div className="label-caps text-[9px] text-muted-foreground">Max</div>
          <div className="font-mono text-[11px] text-muted-foreground">{movement.maxSpeed}</div>
        </div>
      </div>

      <div className="mt-2 space-y-1.5">
        <HudBar label="Boost" value={movement.boost} max={100} tone="energy" size="sm" />
        <div className="flex items-center gap-2">
          <span className="label-caps w-[46px] shrink-0 text-[9px] text-muted-foreground">
            Throttle
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={movement.throttle}
            onChange={(e) => onThrottle(Number(e.target.value))}
            aria-label="Throttle"
            className="h-1.5 flex-1 accent-[var(--primary)]"
          />
          <span className="w-10 shrink-0 text-right font-mono text-[11px] text-foreground/80">
            {movement.throttle}%
          </span>
        </div>
      </div>

      <div
        className={cn(
          "label-caps mt-2 border px-1.5 py-0.5 text-center text-[9px]",
          movement.braking
            ? "border-warning/60 text-warning"
            : "border-border/60 text-muted-foreground/70",
        )}
      >
        {movement.braking ? "Braking" : "Drive Nominal"}
      </div>
    </HudPanel>
  );
}
