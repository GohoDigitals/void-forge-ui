import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import {
  GameButton,
  ItemSlot,
  Panel,
  ScreenTitle,
  StatRow,
  TabBar,
  rarityText,
} from "@/components/game/ui";
import characterImg from "@/assets/character-preview.jpg";
import {
  equipSlots,
  inventory,
  inventoryCapacity,
  rarityLabel,
  type EquipSlotId,
  type Item,
} from "@/lib/game-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory & Equipment — Nova Command" },
      {
        name: "description",
        content:
          "Manage the item grid, rarity, quantities, equipment slots and character loadout preview.",
      },
      { property: "og:title", content: "Inventory & Equipment — Nova Command" },
      {
        property: "og:description",
        content: "Item grid, equipment slots, tooltips and capacity tracking for your loadout.",
      },
    ],
  }),
  component: InventoryScreen,
});

type Filter = "all" | "gear" | "materials" | "consumables";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "gear", label: "Gear" },
  { id: "materials", label: "Materials" },
  { id: "consumables", label: "Consumables" },
];

const defaultEquipped: Partial<Record<EquipSlotId, string>> = {
  helmet: "i1",
  chest: "i2",
  weapon: "i3",
  sidearm: "i4",
  shield: "i5",
  core: "i6",
};

function InventoryScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string>(inventory[0].id);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [equipped, setEquipped] = useState(defaultEquipped);

  const items = useMemo(() => {
    if (filter === "all") return inventory;
    if (filter === "materials")
      return inventory.filter((i) => i.type === "Material" || i.type === "Component");
    if (filter === "consumables") return inventory.filter((i) => i.type === "Consumable");
    return inventory.filter((i) => Boolean(i.slot));
  }, [filter]);

  const detail: Item | undefined =
    inventory.find((i) => i.id === (hoverId ?? selectedId)) ?? undefined;

  const equippedItem = (slot: EquipSlotId) => inventory.find((i) => i.id === equipped[slot]);

  const used = inventory.length;
  const gridCells = 48;

  const toggleEquip = () => {
    if (!detail?.slot) return;
    setEquipped((prev) => ({
      ...prev,
      [detail.slot!]: prev[detail.slot!] === detail.id ? undefined : detail.id,
    }));
  };

  return (
    <GameShell
      footer={
        <>
          <GameButton onClick={() => navigate({ to: "/class" })}>Back</GameButton>
          <GameButton variant="primary" onClick={() => navigate({ to: "/upgrade" })}>
            Upgrade Bench
          </GameButton>
        </>
      }
    >
      <div className="flex h-full min-h-0 flex-col gap-4">
        <ScreenTitle title="Inventory & Equipment" subtitle="Cargo hold — NCS Ardent" />

        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_360px_320px] gap-4">
          {/* Item grid */}
          <Panel
            title="Cargo Hold"
            bodyClassName="flex min-h-0 flex-col gap-3"
            action={
              <span className="font-mono text-[11px] text-muted-foreground">
                {used} / {inventoryCapacity} slots
              </span>
            }
          >
            <TabBar tabs={filters} value={filter} onChange={setFilter} />
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-8 gap-2">
                {Array.from({ length: gridCells }).map((_, idx) => {
                  const item = items[idx];
                  if (!item) return <ItemSlot key={`empty-${idx}`} empty label="" />;
                  return (
                    <ItemSlot
                      key={item.id}
                      label={item.name}
                      rarity={item.rarity}
                      quantity={item.quantity}
                      selected={item.id === selectedId}
                      onClick={() => setSelectedId(item.id)}
                      onMouseEnter={() => setHoverId(item.id)}
                      onMouseLeave={() => setHoverId(null)}
                    />
                  );
                })}
              </div>
            </div>
            <div className="shrink-0">
              <div className="mb-1 flex items-center justify-between">
                <span className="label-caps text-muted-foreground">Capacity</span>
                <span className="font-mono text-[11px] text-foreground/80">
                  {Math.round((used / inventoryCapacity) * 100)}%
                </span>
              </div>
              <div className="h-2 border border-border bg-background">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(used / inventoryCapacity) * 100}%` }}
                />
              </div>
            </div>
          </Panel>

          {/* Equipment + preview */}
          <Panel title="Equipment" bodyClassName="flex min-h-0 gap-3">
            <div className="flex flex-col justify-between gap-2">
              {(["helmet", "chest", "gloves", "boots"] as EquipSlotId[]).map((id) => {
                const it = equippedItem(id);
                return (
                  <ItemSlot
                    key={id}
                    label={it ? it.name : equipSlots.find((s) => s.id === id)!.label}
                    rarity={it?.rarity}
                    empty={!it}
                    selected={it?.id === selectedId}
                    onClick={() => it && setSelectedId(it.id)}
                    onMouseEnter={() => it && setHoverId(it.id)}
                    onMouseLeave={() => setHoverId(null)}
                  />
                );
              })}
            </div>

            <div className="relative min-h-0 flex-1 border border-border bg-background">
              <img
                src={characterImg}
                alt="Character equipment preview"
                loading="lazy"
                width={768}
                height={1152}
                className="h-full w-full object-contain"
              />
              <span className="label-caps absolute bottom-2 left-0 right-0 text-center text-muted-foreground">
                Loadout Preview
              </span>
            </div>

            <div className="flex flex-col justify-between gap-2">
              {(["weapon", "sidearm", "shield", "core", "implant"] as EquipSlotId[]).map((id) => {
                const it = equippedItem(id);
                return (
                  <ItemSlot
                    key={id}
                    label={it ? it.name : equipSlots.find((s) => s.id === id)!.label}
                    rarity={it?.rarity}
                    empty={!it}
                    selected={it?.id === selectedId}
                    onClick={() => it && setSelectedId(it.id)}
                    onMouseEnter={() => it && setHoverId(it.id)}
                    onMouseLeave={() => setHoverId(null)}
                  />
                );
              })}
            </div>
          </Panel>

          {/* Detail */}
          <Panel title="Item Details" bodyClassName="flex min-h-0 flex-col gap-3">
            {detail ? (
              <>
                <div className="flex gap-3">
                  <ItemSlot label={detail.name} rarity={detail.rarity} size="lg" />
                  <div className="min-w-0">
                    <h3 className="truncate text-base">{detail.name}</h3>
                    <p className={cn("label-caps", rarityText[detail.rarity])}>
                      {rarityLabel[detail.rarity]} · {detail.type}
                    </p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      Item level {detail.level} · Qty {detail.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{detail.description}</p>
                <div>
                  {detail.stats.map((s) => (
                    <StatRow key={s.label} label={s.label} value={s.value} accent />
                  ))}
                </div>
                <div className="mt-auto flex flex-col gap-2">
                  <GameButton variant="primary" disabled={!detail.slot} onClick={toggleEquip}>
                    {detail.slot && equipped[detail.slot] === detail.id ? "Unequip" : "Equip"}
                  </GameButton>
                  <div className="grid grid-cols-2 gap-2">
                    <GameButton onClick={() => navigate({ to: "/upgrade" })}>Upgrade</GameButton>
                    <GameButton variant="danger">Discard</GameButton>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Select an item to inspect it.</p>
            )}
          </Panel>
        </div>
      </div>
    </GameShell>
  );
}
