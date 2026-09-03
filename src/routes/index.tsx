import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import menuBg from "@/assets/menu-bg.jpg";
import { GameButton, Panel } from "@/components/game/ui";
import { character } from "@/lib/game-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova Command — Main Menu" },
      {
        name: "description",
        content:
          "Main menu for Nova Command, a sci-fi spaceship combat game UI prototype: play, load game, online play and settings.",
      },
      { property: "og:title", content: "Nova Command — Main Menu" },
      {
        property: "og:description",
        content: "Sci-fi spaceship combat game interface prototype built for 1080p desktop play.",
      },
    ],
  }),
  component: MainMenu,
});

function MainMenu() {
  const navigate = useNavigate();
  const [exiting, setExiting] = useState(false);

  const entries = [
    { label: "Play", desc: "Launch into combat", to: "/play" as const, disabled: false },
    { label: "Load Game", desc: "3 saved runs", to: "/character" as const, disabled: false },
    { label: "Online Play", desc: "Servers offline", to: "/race" as const, disabled: true },
    { label: "Settings", desc: "Configure the client", to: "/settings" as const, disabled: false },
  ];

  return (
    <div className="relative flex h-screen min-h-screen flex-col overflow-hidden bg-background">
      <img
        src={menuBg}
        alt="Fleet of capital ships silhouetted against a distant star"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
      <div className="hud-grid absolute inset-0 opacity-40" />

      <div className="relative flex min-h-0 flex-1 items-center px-16">
        <div className="w-[420px]">
          <div className="mb-10">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-5 w-px bg-primary" />
              <span className="label-caps text-primary">Terran Coalition Fleet Client</span>
            </div>
            <h1 className="font-display text-5xl leading-none tracking-[0.16em] text-foreground">
              NOVA
              <br />
              COMMAND
            </h1>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Deep-void interdiction simulator. Build a crew, refit your hull and hold the Kepler
              Gap.
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {entries.map((e) =>
              e.disabled ? (
                <button
                  key={e.label}
                  disabled
                  className="panel-frame corner-cut flex items-center justify-between px-4 py-3 text-left opacity-40"
                >
                  <span className="font-display text-sm tracking-[0.2em]">{e.label}</span>
                  <span className="label-caps text-muted-foreground">{e.desc}</span>
                </button>
              ) : (
                <Link
                  key={e.label}
                  to={e.to}
                  className="panel-frame corner-cut group flex items-center justify-between px-4 py-3 transition-colors hover:border-primary/70 hover:bg-surface-2"
                >
                  <span className="font-display text-sm tracking-[0.2em] text-foreground group-hover:text-primary">
                    {e.label}
                  </span>
                  <span className="label-caps text-muted-foreground">{e.desc}</span>
                </Link>
              ),
            )}
            <button
              onClick={() => setExiting(true)}
              className="panel-frame corner-cut group mt-4 flex items-center justify-between px-4 py-3 transition-colors hover:border-destructive/60"
            >
              <span className="font-display text-sm tracking-[0.2em] text-foreground group-hover:text-destructive">
                Exit
              </span>
              <span className="label-caps text-muted-foreground">Quit to desktop</span>
            </button>
          </nav>
        </div>

        <div className="ml-auto w-[320px]">
          <Panel title="Last Deployment">
            <div className="space-y-3 text-sm">
              <div>
                <div className="label-caps text-muted-foreground">Commander</div>
                <div className="font-display text-sm tracking-widest">{character.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div>
                  <div className="label-caps text-muted-foreground">Level</div>
                  <div>{character.level}</div>
                </div>
                <div>
                  <div className="label-caps text-muted-foreground">Ship</div>
                  <div>{character.ship}</div>
                </div>
                <div>
                  <div className="label-caps text-muted-foreground">Race</div>
                  <div>{character.race}</div>
                </div>
                <div>
                  <div className="label-caps text-muted-foreground">Class</div>
                  <div>{character.className}</div>
                </div>
              </div>
              <GameButton
                variant="primary"
                className="w-full"
                onClick={() => navigate({ to: "/character" })}
              >
                Continue
              </GameButton>
            </div>
          </Panel>
          <p className="mt-3 text-right font-mono text-[11px] text-muted-foreground">
            build 0.9.4 · prototype
          </p>
        </div>
      </div>

      {exiting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
          <Panel title="Exit Client" className="w-[380px]">
            <p className="text-sm text-muted-foreground">
              Unsaved progress in the current deployment will be lost. Quit to desktop?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <GameButton onClick={() => setExiting(false)}>Cancel</GameButton>
              <GameButton variant="danger" onClick={() => setExiting(false)}>
                Quit
              </GameButton>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
