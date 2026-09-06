import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { character } from "@/lib/game-data";

const nav = [
  { to: "/play", label: "Gameplay" },
  { to: "/race", label: "Race" },
  { to: "/class", label: "Class" },
  { to: "/inventory", label: "Inventory" },
  { to: "/shop", label: "Shop" },
  { to: "/upgrade", label: "Upgrade" },
  { to: "/character", label: "Character" },
  { to: "/settings", label: "Settings" },
] as const;

export function GameShell({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="hud-grid flex h-screen min-h-screen flex-col overflow-hidden bg-background">
      <header className="flex h-14 shrink-0 items-center gap-6 border-b border-border bg-surface/80 px-5 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-4 w-px bg-primary" />
          <span className="font-display text-sm tracking-[0.3em] text-foreground">NOVA COMMAND</span>
        </Link>

        <nav className="flex items-stretch self-stretch">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "label-caps relative flex items-center px-4 transition-colors",
                  active
                    ? "bg-surface-2 text-primary"
                    : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
                )}
              >
                {n.label}
                {active && <span className="absolute inset-x-0 bottom-0 h-px bg-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <div className="text-right">
            <div className="label-caps text-muted-foreground">Credits</div>
            <div className="font-mono text-sm text-accent">{character.credits.toLocaleString()}</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-right">
            <div className="font-display text-xs tracking-widest text-foreground">
              {character.name}
            </div>
            <div className="font-mono text-[11px] text-muted-foreground">
              LVL {character.level} · {character.race} · {character.className}
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-hidden p-5">{children}</main>

      <footer className="flex h-12 shrink-0 items-center justify-between border-t border-border bg-surface/80 px-5">
        <div className="flex items-center gap-4">
          <Link
            to="/play"
            className="label-caps text-primary transition-colors hover:text-foreground"
          >
            &lt; Return to Gameplay
          </Link>
          <span className="h-4 w-px bg-border" />
          <Link
            to="/"
            className="label-caps text-muted-foreground transition-colors hover:text-foreground"
          >
            Main Menu
          </Link>
        </div>
        <div className="flex items-center gap-3">{footer}</div>
      </footer>
    </div>
  );
}
