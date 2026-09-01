import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { GameButton, Panel, ScreenTitle } from "@/components/game/ui";
import { races } from "@/lib/game-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/race")({
  head: () => ({
    meta: [
      { title: "Race Selection — Nova Command" },
      {
        name: "description",
        content: "Choose between Humans, Robots and Sorras before deploying your combat crew.",
      },
      { property: "og:title", content: "Race Selection — Nova Command" },
      {
        property: "og:description",
        content: "Compare Humans, Robots and Sorras and pick a faction for your campaign.",
      },
    ],
  }),
  component: RaceScreen,
});

function RaceScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(races[0].id);
  const active = races.find((r) => r.id === selected)!;

  return (
    <GameShell
      footer={
        <>
          <GameButton onClick={() => navigate({ to: "/" })}>Back</GameButton>
          <GameButton variant="primary" onClick={() => navigate({ to: "/class" })}>
            Confirm Race
          </GameButton>
        </>
      }
    >
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex items-end justify-between">
          <ScreenTitle title="Select Race" subtitle="Step 1 of 2 — faction determines hull line and base traits" />
          <div className="label-caps text-muted-foreground">
            Selected: <span className="text-primary">{active.name}</span>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-3 gap-4">
          {races.map((race) => {
            const isSelected = race.id === selected;
            return (
              <button
                key={race.id}
                onClick={() => setSelected(race.id)}
                className={cn(
                  "panel-frame group relative flex min-h-0 flex-col overflow-hidden text-left transition-colors",
                  isSelected ? "border-primary" : "hover:border-border-strong",
                )}
              >
                {isSelected && <span className="absolute inset-x-0 top-0 z-10 h-0.5 bg-primary" />}
                <div className="relative min-h-0 flex-1 overflow-hidden bg-background">
                  <img
                    src={race.image}
                    alt={`${race.name} faction representative`}
                    loading="lazy"
                    width={768}
                    height={960}
                    className={cn(
                      "h-full w-full object-cover object-top transition-opacity duration-200",
                      isSelected ? "opacity-100" : "opacity-70 group-hover:opacity-90",
                    )}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent" />
                </div>
                <div className="shrink-0 border-t border-border p-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-base text-foreground">{race.name}</h3>
                    <span className="label-caps text-muted-foreground">{race.tagline}</span>
                  </div>
                  <p className="mt-2 h-10 text-sm leading-snug text-muted-foreground">
                    {race.description}
                  </p>
                  <div className="mt-3 space-y-1.5">
                    {race.traits.map((t) => (
                      <div key={t.label} className="flex items-center gap-2">
                        <span className="label-caps w-14 text-muted-foreground">{t.label}</span>
                        <div className="h-1.5 flex-1 border border-border bg-background">
                          <div
                            className={cn("h-full", isSelected ? "bg-primary" : "bg-border-strong")}
                            style={{ width: `${t.value}%` }}
                          />
                        </div>
                        <span className="w-7 text-right font-mono text-[11px] text-foreground/80">
                          {t.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    className={cn(
                      "label-caps mt-3 border py-1.5 text-center",
                      isSelected
                        ? "border-primary/70 bg-primary/15 text-primary"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <Panel title="Faction Briefing" className="shrink-0">
          <p className="text-sm text-muted-foreground">
            <span className="font-display text-xs tracking-widest text-foreground">
              {active.name.toUpperCase()}
            </span>{" "}
            — {active.description} Additional factions unlock through campaign progression.
          </p>
        </Panel>
      </div>
    </GameShell>
  );
}
