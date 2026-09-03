import { Link } from "@tanstack/react-router";
import { GameButton } from "@/components/game/ui";
import type { MissionState } from "@/lib/hud-data";

const links = [
  { to: "/inventory", label: "Inventory & Equipment" },
  { to: "/character", label: "Character Info" },
  { to: "/upgrade", label: "Upgrade Bench" },
  { to: "/settings", label: "Settings" },
] as const;

/** Full-screen pause overlay for the gameplay HUD. */
export function PauseMenu({
  open,
  mission,
  onResume,
}: {
  open: boolean;
  mission: MissionState;
  onResume: () => void;
}) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-[3px]">
      <div className="hud-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="panel-frame relative w-[420px] rounded-sm p-6">
        <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-border-strong" />
        <span className="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r border-b border-border-strong" />

        <div className="mb-1 flex items-center gap-2">
          <span className="h-4 w-px bg-primary" />
          <span className="label-caps text-primary">Simulation Paused</span>
        </div>
        <h1 className="mb-1 font-display text-2xl tracking-[0.14em] text-foreground">PAUSED</h1>
        <p className="mb-5 font-mono text-[11px] text-muted-foreground">
          {mission.title} · {mission.summary}
        </p>

        <div className="flex flex-col gap-2">
          <GameButton variant="primary" size="lg" className="w-full" onClick={onResume}>
            Resume
          </GameButton>

          {links.map((l) => (
            <Link key={l.to} to={l.to} className="block">
              <GameButton className="w-full">{l.label}</GameButton>
            </Link>
          ))}

          <Link to="/" className="mt-2 block">
            <GameButton variant="danger" className="w-full">
              Abandon Mission
            </GameButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
