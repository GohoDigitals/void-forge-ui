import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import {
  GameButton,
  MeterBar,
  Panel,
  ScreenTitle,
  StatRow,
  TabBar,
} from "@/components/game/ui";
import characterImg from "@/assets/character-preview.jpg";
import { character } from "@/lib/game-data";

export const Route = createFileRoute("/character")({
  head: () => ({
    meta: [
      { title: "Character Info — Nova Command" },
      {
        name: "description",
        content:
          "Character sheet with portrait, level, race, class, health, energy and combat statistics.",
      },
      { property: "og:title", content: "Character Info — Nova Command" },
      {
        property: "og:description",
        content: "Review your commander's stats, skills and service record.",
      },
    ],
  }),
  component: CharacterScreen,
});

type Tab = "info" | "stats" | "skills";

function CharacterScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("info");

  return (
    <GameShell
      footer={
        <>
          <GameButton onClick={() => navigate({ to: "/inventory" })}>Inventory</GameButton>
          <GameButton variant="primary" onClick={() => navigate({ to: "/upgrade" })}>
            Upgrade Bench
          </GameButton>
        </>
      }
    >
      <div className="flex h-full min-h-0 flex-col gap-4">
        <ScreenTitle title="Character" subtitle="Service record and combat profile" />

        <div className="grid min-h-0 flex-1 grid-cols-[360px_minmax(0,1fr)_320px] gap-4">
          <Panel title="Portrait" bodyClassName="flex min-h-0 flex-col gap-3">
            <div className="relative min-h-0 flex-1 border border-border bg-background">
              <img
                src={characterImg}
                alt={`${character.name} in full combat exosuit`}
                loading="lazy"
                width={768}
                height={1152}
                className="h-full w-full object-contain"
              />
              <span className="label-caps absolute left-2 top-2 border border-border bg-background/80 px-2 py-0.5 text-primary">
                LVL {character.level}
              </span>
            </div>
            <div>
              <h2 className="text-base">{character.name}</h2>
              <p className="label-caps text-muted-foreground">
                {character.race} · {character.className}
              </p>
            </div>
            <MeterBar label="Health" value={character.health} max={character.healthMax} tone="hp" />
            <MeterBar
              label="Energy"
              value={character.energy}
              max={character.energyMax}
              tone="energy"
            />
            <MeterBar label="Experience" value={character.xp} max={character.xpNext} />
          </Panel>

          <Panel bodyClassName="flex min-h-0 flex-col gap-3 p-0">
            <TabBar
              className="px-3 pt-3"
              tabs={[
                { id: "info", label: "Info" },
                { id: "stats", label: "Stats" },
                { id: "skills", label: "Skills" },
              ]}
              value={tab}
              onChange={setTab}
            />
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {tab === "info" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{character.bio}</p>
                  <div className="grid grid-cols-2 gap-x-8">
                    <div>
                      <StatRow label="Name" value={character.name} />
                      <StatRow label="Level" value={character.level} />
                      <StatRow label="Race" value={character.race} />
                      <StatRow label="Class" value={character.className} />
                    </div>
                    <div>
                      <StatRow label="Ship" value={character.ship} />
                      <StatRow label="Health" value={`${character.health} / ${character.healthMax}`} />
                      <StatRow label="Energy" value={`${character.energy} / ${character.energyMax}`} />
                      <StatRow label="Credits" value={character.credits.toLocaleString()} />
                    </div>
                  </div>
                </div>
              )}

              {tab === "stats" && (
                <div className="grid grid-cols-2 gap-x-8">
                  <div>
                    <StatRow label="Health" value={`${character.health} / ${character.healthMax}`} />
                    <StatRow label="Energy" value={`${character.energy} / ${character.energyMax}`} />
                    {character.stats.map((s) => (
                      <StatRow key={s.label} label={s.label} value={s.value} accent />
                    ))}
                  </div>
                  <div>
                    <StatRow label="Shield" value="210" />
                    <StatRow label="Evasion" value="18%" />
                    <StatRow label="Crit Damage" value="+165%" />
                    <StatRow label="Energy Regen" value="12 / s" />
                    <StatRow label="Armour Pen" value="24%" />
                    <StatRow label="Cooldown Rate" value="+9%" />
                    <StatRow label="Weight" value="62 / 100" />
                  </div>
                </div>
              )}

              {tab === "skills" && (
                <div className="grid grid-cols-2 gap-3">
                  {character.skills.map((s) => (
                    <div key={s.name} className="border border-border bg-surface/60 p-3">
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-sm">{s.name}</h3>
                        <span className="font-mono text-xs text-primary">
                          {s.level} / {s.max}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                      <div className="mt-2 flex gap-1">
                        {Array.from({ length: s.max }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < s.level ? "h-1 flex-1 bg-primary" : "h-1 flex-1 bg-border"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Panel>

          <Panel title="Combat Summary" bodyClassName="flex flex-col gap-3">
            {character.stats.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="label-caps text-muted-foreground">{s.label}</span>
                  <span className="font-mono text-sm text-foreground">{s.value}</span>
                </div>
                <div className="h-1.5 border border-border bg-background">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.min(100, parseInt(s.value, 10) / 5 + 20)}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="mt-auto">
              <StatRow label="Missions" value="184" />
              <StatRow label="Kills" value="3,912" />
              <StatRow label="Win Rate" value="68%" accent />
            </div>
          </Panel>
        </div>
      </div>
    </GameShell>
  );
}
