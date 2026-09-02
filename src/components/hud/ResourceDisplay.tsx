import type { ResourceState } from "@/lib/hud-data";

const format = (n: number) => n.toLocaleString();

export function ResourceDisplay({ resources }: { resources: ResourceState }) {
  const items = [
    { icon: "¤", label: "Credits", value: format(resources.credits), tone: "text-accent" },
    { icon: "⌁", label: "Cells", value: format(resources.energyCells), tone: "text-primary" },
    { icon: "▤", label: "Metal", value: format(resources.metal), tone: "text-foreground/85" },
    { icon: "◈", label: "Rare", value: format(resources.rareMaterials), tone: "text-rarity-epic" },
  ];

  return (
    <div className="flex items-center gap-3 border border-border/70 bg-background/70 px-2.5 py-1 backdrop-blur-[2px]">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-1.5" title={i.label}>
          <span className={`font-mono text-[11px] ${i.tone}`}>{i.icon}</span>
          <span className="font-mono text-[11px] tabular-nums text-foreground/85">{i.value}</span>
        </div>
      ))}
    </div>
  );
}
