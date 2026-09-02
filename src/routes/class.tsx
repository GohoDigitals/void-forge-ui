import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Swords, Crosshair, Flame, Sparkles } from "lucide-react";
import { GameShell } from "@/components/game/GameShell";
import { GameButton, Panel, ScreenTitle, StatRow } from "@/components/game/ui";
import { classes } from "@/lib/game-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/class")({
  head: () => ({
    meta: [
      { title: "Class Selection — Nova Command" },
      {
        name: "description",
        content: "Pick a combat class: Melee, Ranger, Plasma or Special, each with its own role.",
      },
      { property: "og:title", content: "Class Selection — Nova Command" },
      {
        property: "og:description",
        content: "Compare the Melee, Ranger, Plasma and Special combat classes before deployment.",
      },
    ],
  }),
  component: ClassScreen,
});

const icons = {
  melee: Swords,
  ranger: Crosshair,
  plasma: Flame,
  special: Sparkles,
} as const;

function ClassScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(classes[1]!.id);
  const active = classes.find((c) => c.id === selected)!;

  return (
    <GameShell
      footer={
        <>
          <GameButton onClick={() => navigate({ to: "/race" })}>Back</GameButton>
          <GameButton variant="primary" onClick={() => navigate({ to: "/inventory" })}>
            Confirm Class
          </GameButton>
        </>
      }
    >
      <div className="flex h-full min-h-0 flex-col gap-4">
        <ScreenTitle
          title="Select Class"
          subtitle="Step 2 of 2 — class defines your loadout archetype and skill tree"
        />

        <div className="grid min-h-0 flex-1 grid-cols-[1fr_320px] gap-4">
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {classes.map((c) => {
              const Icon = icons[c.icon];
              const isSelected = c.id === selected;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={cn(
                    "panel-frame relative flex items-start gap-4 p-4 text-left transition-colors",
                    isSelected ? "border-primary" : "hover:border-border-strong",
                  )}
                >
                  {isSelected && <span className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}
                  <div
                    className={cn(
                      "flex h-20 w-20 shrink-0 items-center justify-center border bg-background",
                      isSelected ? "border-primary/70" : "border-border",
                    )}
                  >
                    <Icon
                      className={cn("h-8 w-8", isSelected ? "text-primary" : "text-muted-foreground")}
                      strokeWidth={1.4}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-base">{c.name}</h3>
                      <span className="label-caps text-muted-foreground">{c.role}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
                      {c.description}
                    </p>
                    <div className="mt-3 flex gap-4">
                      {c.stats.map((s) => (
                        <div key={s.label} className="flex items-center gap-2">
                          <span className="label-caps text-muted-foreground">{s.label}</span>
                          <span className="font-mono text-sm text-foreground">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <Panel title="Class Detail" bodyClassName="flex flex-col gap-4">
            <div className="flex h-40 items-center justify-center border border-border bg-background">
              {(() => {
                const Icon = icons[active.icon];
                return <Icon className="h-16 w-16 text-primary" strokeWidth={1.1} />;
              })()}
            </div>
            <div>
              <h3 className="text-lg">{active.name}</h3>
              <p className="label-caps text-muted-foreground">{active.role}</p>
            </div>
            <p className="text-sm text-muted-foreground">{active.description}</p>
            <div>
              {active.stats.map((s) => (
                <StatRow key={s.label} label={s.label} value={s.value} accent />
              ))}
              <StatRow label="Slots" value="9 equipment" />
              <StatRow label="Skill Tree" value="12 nodes" />
            </div>
          </Panel>
        </div>
      </div>
    </GameShell>
  );
}
