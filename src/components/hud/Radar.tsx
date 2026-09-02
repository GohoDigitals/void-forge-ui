import { cn } from "@/lib/utils";
import type { RadarKind, RadarObject } from "@/lib/hud-data";
import { HudPanel } from "./HudPrimitives";

const kindColor: Record<RadarKind, string> = {
  player: "bg-foreground",
  friendly: "bg-success",
  enemy: "bg-destructive",
  neutral: "bg-muted-foreground",
  objective: "bg-accent",
};

export function Radar({
  objects,
  rangeKm,
  heading,
  onZoom,
}: {
  objects: RadarObject[];
  rangeKm: number;
  heading: number;
  onZoom: (delta: number) => void;
}) {
  const size = 150;
  return (
    <HudPanel className="w-[186px]">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="label-caps text-[9px] text-muted-foreground">Radar</span>
        <span className="font-mono text-[10px] text-primary">{rangeKm} KM</span>
      </div>

      <div
        className="relative mx-auto rounded-full border border-border/80 bg-background/70"
        style={{ width: size, height: size }}
      >
        <span className="absolute inset-[18%] rounded-full border border-border/50" />
        <span className="absolute inset-[38%] rounded-full border border-border/40" />
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border/40" />
        <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-border/40" />

        {/* heading wedge */}
        <span
          className="absolute left-1/2 top-1/2 h-1/2 w-px origin-bottom bg-primary/60"
          style={{ transform: `translate(-50%, -100%) rotate(${heading}deg)`, transformOrigin: "bottom center" }}
        />

        {objects.map((o) => (
          <span
            key={o.id}
            title={o.label ?? o.kind}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2",
              o.kind === "player" ? "h-1.5 w-1.5" : "h-1.5 w-1.5",
              o.kind === "objective" ? "rotate-45" : "rounded-[1px]",
              kindColor[o.kind],
            )}
            style={{
              left: `${50 + o.x * 46}%`,
              top: `${50 + o.y * 46}%`,
            }}
          />
        ))}
        <span className="label-caps absolute left-1/2 top-0.5 -translate-x-1/2 text-[8px] text-muted-foreground">
          N
        </span>
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onZoom(-2)}
            className="h-5 w-5 border border-border/70 font-mono text-[11px] leading-none text-muted-foreground hover:border-primary/70 hover:text-primary"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => onZoom(2)}
            className="h-5 w-5 border border-border/70 font-mono text-[11px] leading-none text-muted-foreground hover:border-primary/70 hover:text-primary"
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-success" />ALLY
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-destructive" />HOSTILE
          </span>
        </div>
      </div>
    </HudPanel>
  );
}
