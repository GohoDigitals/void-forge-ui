import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { GameButton, ItemSlot, Panel, ScreenTitle, StatRow, rarityText } from "@/components/game/ui";
import { inventory, rarityLabel, type Item } from "@/lib/game-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/upgrade")({
  head: () => ({
    meta: [
      { title: "Upgrade Bench — Nova Command" },
      {
        name: "description",
        content:
          "Nine-slot upgrade bench: one core item, six support slots and two material slots with success chance.",
      },
      { property: "og:title", content: "Upgrade Bench — Nova Command" },
      {
        property: "og:description",
        content: "Combine support modules and materials to raise an item's upgrade tier.",
      },
    ],
  }),
  component: UpgradeScreen,
});

const supportPool = inventory.filter((i) => i.slot);
const materialPool = inventory.filter((i) => i.type === "Material" || i.type === "Component");

const ringPositions = [
  { top: "0%", left: "50%" },
  { top: "25%", left: "93%" },
  { top: "75%", left: "93%" },
  { top: "100%", left: "50%" },
  { top: "75%", left: "7%" },
  { top: "25%", left: "7%" },
];

function UpgradeScreen() {
  const navigate = useNavigate();
  const core = inventory.find((i) => i.id === "i3")!;
  const [supports, setSupports] = useState<(Item | undefined)[]>([
    supportPool[0],
    undefined,
    supportPool[4],
    undefined,
    undefined,
    undefined,
  ]);
  const [materials, setMaterials] = useState<(Item | undefined)[]>([
    materialPool[0],
    materialPool[2],
  ]);
  const [tier, setTier] = useState(6);
  const [log, setLog] = useState<string[]>(["Bench ready. Core item loaded: Railspike R-9."]);

  const filled = supports.filter(Boolean).length;
  const matFilled = materials.filter(Boolean).length;
  const chance = useMemo(
    () => Math.min(95, 34 + filled * 7 + matFilled * 9),
    [filled, matFilled],
  );
  const canUpgrade = matFilled === 2;

  const cycle = (arr: (Item | undefined)[], pool: Item[], idx: number) => {
    const cur = arr[idx];
    const curIdx = cur ? pool.findIndex((p) => p.id === cur.id) : -1;
    const next = pool[(curIdx + 1) % (pool.length + 1)];
    const copy = [...arr];
    copy[idx] = curIdx + 1 >= pool.length ? undefined : next;
    return copy;
  };

  const runUpgrade = () => {
    const success = Math.random() * 100 < chance;
    if (success) {
      setTier((t) => t + 1);
      setLog((l) => [`Upgrade succeeded — core item now +${tier + 1}.`, ...l].slice(0, 6));
    } else {
      setLog((l) => [`Upgrade failed — materials consumed, tier unchanged.`, ...l].slice(0, 6));
    }
    setMaterials([undefined, undefined]);
  };

  return (
    <GameShell
      footer={
        <>
          <GameButton onClick={() => navigate({ to: "/inventory" })}>Back to Inventory</GameButton>
          <GameButton variant="primary" onClick={() => navigate({ to: "/character" })}>
            Character Sheet
          </GameButton>
        </>
      }
    >
      <div className="flex h-full min-h-0 flex-col gap-4">
        <ScreenTitle title="Upgrade Bench" subtitle="Engineering deck — module fusion array" />

        <div className="grid min-h-0 flex-1 grid-cols-[300px_minmax(0,1fr)_320px] gap-4">
          {/* Core item */}
          <Panel title="Core Item" bodyClassName="flex flex-col gap-3">
            <ItemSlot label={core.name} rarity={core.rarity} size="xl" className="mx-auto" />
            <div className="text-center">
              <h3 className="text-base">{core.name}</h3>
              <p className={cn("label-caps", rarityText[core.rarity])}>
                {rarityLabel[core.rarity]} · +{tier}
              </p>
            </div>
            <div>
              <StatRow label="Current Tier" value={`+${tier}`} />
              <StatRow label="Next Tier" value={`+${tier + 1}`} accent />
              <StatRow label="Attack" value={`+164 → +${164 + (tier + 1) * 12}`} accent />
              <StatRow label="Crit Chance" value={`+9% → +${9 + tier + 1}%`} accent />
            </div>
            <p className="text-sm text-muted-foreground">{core.description}</p>
          </Panel>

          {/* Array */}
          <Panel title="Fusion Array" bodyClassName="flex min-h-0 flex-col">
            <div className="relative mx-auto flex min-h-0 w-full max-w-[520px] flex-1 items-center justify-center">
              <div className="relative h-[360px] w-[360px]">
                {/* connectors */}
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 360" aria-hidden>
                  {ringPositions.map((p, i) => {
                    const x = (parseFloat(p.left) / 100) * 360;
                    const y = (parseFloat(p.top) / 100) * 360;
                    return (
                      <line
                        key={i}
                        x1={180}
                        y1={180}
                        x2={x}
                        y2={y}
                        stroke={
                          supports[i]
                            ? "color-mix(in oklab, var(--primary) 70%, transparent)"
                            : "var(--border)"
                        }
                        strokeWidth={1}
                        strokeDasharray={supports[i] ? "0" : "4 4"}
                      />
                    );
                  })}
                  <circle
                    cx={180}
                    cy={180}
                    r={140}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth={1}
                    strokeDasharray="2 6"
                  />
                </svg>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <ItemSlot label={core.name} rarity={core.rarity} size="xl" selected />
                </div>

                {ringPositions.map((p, i) => (
                  <div
                    key={i}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ top: p.top, left: p.left }}
                  >
                    <ItemSlot
                      label={supports[i]?.name ?? `Slot ${i + 1}`}
                      rarity={supports[i]?.rarity}
                      empty={!supports[i]}
                      onClick={() => setSupports((s) => cycle(s, supportPool, i))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-center gap-6 border-t border-border pt-3">
              {materials.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <ItemSlot
                    label={m?.name ?? `Material ${i + 1}`}
                    rarity={m?.rarity}
                    quantity={m?.quantity}
                    empty={!m}
                    onClick={() => setMaterials((s) => cycle(s, materialPool, i))}
                  />
                  <div>
                    <div className="label-caps text-muted-foreground">Material Slot {i + 1}</div>
                    <div className="font-mono text-xs text-foreground/80">
                      {m ? m.name : "Required"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Result */}
          <Panel title="Upgrade" bodyClassName="flex flex-col gap-3">
            <div>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="label-caps text-muted-foreground">Success Chance</span>
                <span className="font-mono text-lg text-primary">{chance}%</span>
              </div>
              <div className="h-2 border border-border bg-background">
                <div className="h-full bg-primary" style={{ width: `${chance}%` }} />
              </div>
            </div>

            <div>
              <StatRow label="Support Modules" value={`${filled} / 6`} />
              <StatRow label="Materials" value={`${matFilled} / 2`} accent={canUpgrade} />
              <StatRow label="Titanium Alloy" value="40 / 148" />
              <StatRow label="Plasma Cell" value="12 / 62" />
              <StatRow label="Credit Cost" value="4,800 cr" />
              <StatRow label="On Failure" value="Materials lost" />
            </div>

            <GameButton variant="primary" size="lg" disabled={!canUpgrade} onClick={runUpgrade}>
              {canUpgrade ? "Begin Upgrade" : "Materials Required"}
            </GameButton>

            <div className="min-h-0 flex-1 overflow-y-auto border-t border-border pt-2">
              <div className="label-caps mb-1 text-muted-foreground">Bench Log</div>
              <ul className="space-y-1 font-mono text-[11px] text-muted-foreground">
                {log.map((entry, i) => (
                  <li key={i} className={i === 0 ? "text-foreground/85" : undefined}>
                    &gt; {entry}
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>
      </div>
    </GameShell>
  );
}
