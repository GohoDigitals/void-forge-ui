import { GameButton } from "@/components/game/ui";
import { rarityLabel, type Rarity } from "@/lib/game-data";
import { sortOptions, type ShopFilters, type SortId } from "@/lib/shop-engine";
import { cn } from "@/lib/utils";

const selectClass =
  "label-caps h-7 border border-border bg-surface px-2 text-[10px] text-foreground/85 outline-none focus:border-primary";

export function ShopSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="SEARCH ITEMS"
      className="label-caps h-7 w-48 border border-border bg-background px-2 text-[10px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary"
    />
  );
}

export function ShopSort({ value, onChange }: { value: SortId; onChange: (v: SortId) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortId)}
      className={selectClass}
    >
      {sortOptions.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function ShopToolbar({
  filters,
  showSearch,
  showSorting,
  showFilters,
  showFavorites,
  onChange,
  onReset,
  resultCount,
}: {
  filters: ShopFilters;
  showSearch: boolean;
  showSorting: boolean;
  showFilters: boolean;
  showFavorites: boolean;
  onChange: (patch: Partial<ShopFilters>) => void;
  onReset: () => void;
  resultCount: number;
}) {
  const rarities: (Rarity | "any")[] = [
    "any",
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary",
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showSearch && <ShopSearch value={filters.search} onChange={(v) => onChange({ search: v })} />}
      {showSorting && <ShopSort value={filters.sort} onChange={(v) => onChange({ sort: v })} />}

      {showFilters && (
        <>
          <select
            value={filters.rarity}
            onChange={(e) => onChange({ rarity: e.target.value as Rarity | "any" })}
            className={selectClass}
          >
            {rarities.map((r) => (
              <option key={r} value={r}>
                {r === "any" ? "Any Rarity" : rarityLabel[r]}
              </option>
            ))}
          </select>

          <select
            value={filters.maxPrice ?? ""}
            onChange={(e) => onChange({ maxPrice: e.target.value ? Number(e.target.value) : null })}
            className={selectClass}
          >
            <option value="">Any Price</option>
            <option value="1000">Under 1,000</option>
            <option value="5000">Under 5,000</option>
            <option value="20000">Under 20,000</option>
          </select>

          <ToggleChip
            active={filters.availableOnly}
            onClick={() => onChange({ availableOnly: !filters.availableOnly })}
          >
            Available
          </ToggleChip>
        </>
      )}

      {showFavorites && (
        <ToggleChip
          active={filters.favoritesOnly}
          onClick={() => onChange({ favoritesOnly: !filters.favoritesOnly })}
        >
          Favorites
        </ToggleChip>
      )}

      <GameButton size="sm" variant="ghost" onClick={onReset}>
        Clear
      </GameButton>

      <span className="ml-auto font-mono text-[10px] text-muted-foreground">
        {resultCount} results
      </span>
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "label-caps h-7 border px-2 text-[10px] transition-colors",
        active
          ? "border-primary/70 bg-primary/15 text-primary"
          : "border-border bg-surface text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
