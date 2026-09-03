import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const entries = [
  { to: "/inventory", label: "Inventory", key: "I" },
  { to: "/inventory", label: "Equipment", key: "E" },
  { to: "/character", label: "Character", key: "C" },
  { to: "/upgrade", label: "Upgrade", key: "U" },
  { to: "/settings", label: "Settings", key: "O" },
] as const;

/** Bottom-right shortcut strip into the out-of-combat screens. */
export function QuickAccessBar({ onPause }: { onPause: () => void }) {
  return (
    <div className="flex items-center gap-1">
      {entries.map((e) => (
        <Link
          key={e.label}
          to={e.to}
          className={cn(
            "label-caps group relative flex h-9 items-center gap-1.5 border border-border/70 bg-background/70 px-2.5 text-[9px]",
            "text-muted-foreground backdrop-blur-[2px] transition-colors",
            "hover:border-primary/60 hover:text-primary",
          )}
        >
          <span className="font-mono text-[10px] text-foreground/60 group-hover:text-primary">
            {e.key}
          </span>
          {e.label}
        </Link>
      ))}

      <button
        type="button"
        onClick={onPause}
        className="label-caps flex h-9 items-center gap-1.5 border border-border-strong bg-surface/70 px-2.5 text-[9px] text-foreground/85 backdrop-blur-[2px] transition-colors hover:border-primary/60 hover:text-primary"
      >
        <span className="font-mono text-[10px] text-foreground/60">ESC</span>
        Pause
      </button>
    </div>
  );
}
