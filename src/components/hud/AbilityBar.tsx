import { cn } from "@/lib/utils";
import type { AbilitySlotState } from "@/lib/hud-data";

/** One weapon / ability slot. Used for both weapons and abilities. */
export function AbilitySlot({
  slot,
  selected,
  onActivate,
}: {
  slot: AbilitySlotState;
  selected: boolean;
  onActivate: () => void;
}) {
  const cooling = slot.cooldown > 0;
  const cdPct = cooling && slot.cooldownMax > 0 ? (slot.cooldown / slot.cooldownMax) * 100 : 0;
  const disabled = Boolean(slot.disabled);

  return (
    <button
      type="button"
      onClick={onActivate}
      disabled={disabled}
      title={`${slot.name} · ${slot.energyCost} EN`}
      className={cn(
        "relative h-16 w-16 overflow-hidden border bg-background/75 transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-35",
        selected
          ? "border-primary bg-primary/10"
          : "border-border/80 hover:border-border-strong hover:bg-surface/70",
        cooling && "border-border/60",
      )}
    >
      {/* cooldown sweep */}
      {cooling && (
        <span
          className="absolute inset-x-0 bottom-0 bg-background/80"
          style={{ height: `${cdPct}%` }}
        />
      )}

      <span
        className={cn(
          "relative block pt-3 text-center font-display text-[15px] tracking-widest",
          selected ? "text-primary" : "text-foreground/80",
        )}
      >
        {slot.icon}
      </span>
      <span className="relative mt-0.5 block truncate px-1 text-center font-mono text-[9px] text-muted-foreground">
        {slot.name}
      </span>

      <span className="absolute left-1 top-1 font-mono text-[10px] leading-none text-foreground/70">
        {slot.key}
      </span>

      {cooling && (
        <span className="absolute inset-0 flex items-center justify-center font-mono text-base text-foreground">
          {slot.cooldown.toFixed(slot.cooldown < 10 ? 1 : 0)}
        </span>
      )}

      {slot.ammo !== undefined && (
        <span className="absolute right-1 bottom-0.5 font-mono text-[10px] leading-none text-accent">
          {slot.ammo}
        </span>
      )}
      {slot.ammo === undefined && slot.charges !== undefined && (
        <span className="absolute right-1 bottom-0.5 font-mono text-[10px] leading-none text-primary">
          x{slot.charges}
        </span>
      )}

      {selected && <span className="absolute inset-x-0 top-0 h-px bg-primary" />}
    </button>
  );
}

export function AbilityBar({
  abilities,
  activeId,
  onActivate,
}: {
  abilities: AbilitySlotState[];
  activeId: string;
  onActivate: (id: string) => void;
}) {
  return (
    <div className="flex items-end gap-1.5">
      {abilities.map((a) => (
        <AbilitySlot
          key={a.id}
          slot={a}
          selected={a.id === activeId}
          onActivate={() => onActivate(a.id)}
        />
      ))}
    </div>
  );
}
