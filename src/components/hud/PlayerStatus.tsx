import type { PlayerShip } from "@/lib/hud-data";
import { HudBar, HudPanel } from "./HudPrimitives";

export function PlayerStatus({ ship }: { ship: PlayerShip }) {
  return (
    <HudPanel className="w-[280px]">
      <div className="mb-2 flex items-end justify-between gap-2 border-b border-border/60 pb-1.5">
        <div className="min-w-0">
          <div className="truncate font-display text-[13px] tracking-[0.16em] text-foreground">
            {ship.name}
          </div>
          <div className="label-caps text-[9px] text-muted-foreground">{ship.shipClass}</div>
        </div>
        <div className="shrink-0 border border-border/70 px-1.5 font-mono text-[11px] text-primary">
          LV {ship.level}
        </div>
      </div>

      <div className="space-y-1.5">
        <HudBar label="HP" value={ship.hp} max={ship.hpMax} tone="hp" />
        <HudBar label="Shield" value={ship.shield} max={ship.shieldMax} tone="shield" />
        <HudBar label="Energy" value={ship.energy} max={ship.energyMax} tone="energy" />
        <HudBar label="Armor" value={ship.armor} max={ship.armorMax} tone="armor" />
      </div>
    </HudPanel>
  );
}
