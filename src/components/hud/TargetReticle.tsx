import { cn } from "@/lib/utils";
import type { TargetState } from "@/lib/hud-data";

/** Center crosshair — stays minimal and never blocks the view. */
export function CenterReticle({ locked }: { locked: boolean }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className={cn("relative h-10 w-10", locked ? "text-primary" : "text-foreground/45")}>
        <span className="absolute left-1/2 top-0 h-2.5 w-px -translate-x-1/2 bg-current" />
        <span className="absolute left-1/2 bottom-0 h-2.5 w-px -translate-x-1/2 bg-current" />
        <span className="absolute top-1/2 left-0 h-px w-2.5 -translate-y-1/2 bg-current" />
        <span className="absolute top-1/2 right-0 h-px w-2.5 -translate-y-1/2 bg-current" />
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-current" />
      </div>
    </div>
  );
}

/** Frame drawn around the selected enemy, scaled to the enemy's size. */
export function TargetFrame({
  target,
  selected,
  onSelect,
}: {
  target: TargetState;
  selected: boolean;
  onSelect: () => void;
}) {
  const s = target.screen;
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size * 0.62 }}
      className="group absolute -translate-x-1/2 -translate-y-1/2"
      aria-label={`Target ${target.name}`}
    >
      <span
        className={cn(
          "absolute inset-0 border transition-colors",
          selected
            ? "border-destructive/70"
            : "border-transparent group-hover:border-foreground/30",
        )}
      />
      {/* corner brackets */}
      {(["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"] as const).map(
        (pos) => (
          <span
            key={pos}
            className={cn(
              "absolute h-3 w-3 transition-colors",
              pos,
              selected ? "border-destructive" : "border-foreground/40",
            )}
          />
        ),
      )}

      <span
        className={cn(
          "absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-wider transition-opacity",
          "top-full mt-1.5",
          selected ? "text-destructive" : "text-foreground/55 opacity-0 group-hover:opacity-100",
        )}
      >
        {target.name.toUpperCase()} · LV {target.level} · {target.distanceKm.toFixed(1)} KM
      </span>
    </button>
  );
}
