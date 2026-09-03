import { cn } from "@/lib/utils";

export interface DamageEvent {
  id: string;
  /** direction the damage came from, in degrees (0 = front, clockwise) */
  angle: number;
  /** 0..1 severity of the hit */
  intensity: number;
  /** what absorbed the hit */
  layer: "shield" | "hull";
}

/**
 * Directional damage arcs around the screen edge plus a low-integrity vignette.
 * Purely presentational — driven by transient events from the HUD state.
 */
export function DamageIndicator({
  hits,
  hullPct,
}: {
  hits: DamageEvent[];
  hullPct: number;
}) {
  const critical = hullPct <= 25;
  const wounded = hullPct <= 55;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {(wounded || critical) && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            critical ? "animate-pulse opacity-100" : "opacity-60",
          )}
          style={{
            boxShadow: critical
              ? "inset 0 0 190px -40px var(--hp)"
              : "inset 0 0 150px -60px var(--hp)",
          }}
        />
      )}

      {hits.map((h) => (
        <div
          key={h.id}
          className="absolute left-1/2 top-1/2 h-[76vh] w-[76vh] -translate-x-1/2 -translate-y-1/2"
          style={{ transform: `translate(-50%, -50%) rotate(${h.angle}deg)` }}
        >
          <span
            className={cn(
              "absolute left-1/2 top-0 h-[70px] w-[210px] -translate-x-1/2",
              h.layer === "shield" ? "bg-energy" : "bg-hp",
            )}
            style={{
              opacity: 0.14 + h.intensity * 0.4,
              clipPath: "polygon(50% 100%, 0 0, 100% 0)",
              maskImage: "linear-gradient(to bottom, transparent, black)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
