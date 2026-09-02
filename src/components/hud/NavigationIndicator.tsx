import { cn } from "@/lib/utils";
import type { NavigationState } from "@/lib/hud-data";

const CARDINALS = [
  { deg: 0, label: "N" },
  { deg: 45, label: "NE" },
  { deg: 90, label: "E" },
  { deg: 135, label: "SE" },
  { deg: 180, label: "S" },
  { deg: 225, label: "SW" },
  { deg: 270, label: "W" },
  { deg: 315, label: "NW" },
];

/** Relative angle of `deg` from heading, normalised to -180..180. */
function rel(deg: number, heading: number) {
  let d = ((deg - heading + 540) % 360) - 180;
  return d;
}

/** Extremely thin compass strip pinned to the top edge. */
export function NavigationIndicator({ navigation }: { navigation: NavigationState }) {
  const span = 90; // degrees visible across the strip
  const pos = (deg: number) => 50 + (rel(deg, navigation.heading) / span) * 100;

  const markers: { deg: number; label: string; tone: string }[] = [];
  if (navigation.targetBearing !== undefined)
    markers.push({ deg: navigation.targetBearing, label: "TGT", tone: "text-destructive" });
  if (navigation.missionBearing !== undefined)
    markers.push({ deg: navigation.missionBearing, label: "OBJ", tone: "text-accent" });

  return (
    <div className="relative h-6 w-[620px] overflow-hidden border-b border-border/60 bg-background/45 backdrop-blur-[2px]">
      {CARDINALS.map((c) => {
        const left = pos(c.deg);
        if (left < -5 || left > 105) return null;
        return (
          <span
            key={c.label}
            className="absolute top-1 -translate-x-1/2 font-mono text-[10px] text-muted-foreground"
            style={{ left: `${left}%` }}
          >
            {c.label}
          </span>
        );
      })}

      {markers.map((m) => {
        const left = pos(m.deg);
        if (left < -5 || left > 105) return null;
        return (
          <span
            key={m.label}
            className={cn("absolute bottom-0.5 -translate-x-1/2 font-mono text-[9px]", m.tone)}
            style={{ left: `${left}%` }}
          >
            ▲{m.label}
          </span>
        );
      })}

      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary/70" />
      <span className="absolute right-2 top-1 font-mono text-[10px] text-primary">
        {String(Math.round(navigation.heading)).padStart(3, "0")}°
      </span>
    </div>
  );
}
