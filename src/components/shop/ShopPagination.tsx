import { GameButton } from "@/components/game/ui";
import { cn } from "@/lib/utils";

export function ShopPagination({
  page,
  totalPages,
  total,
  perPage,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  onChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(total, page * perPage);

  return (
    <div className="flex items-center gap-3">
      <GameButton size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </GameButton>

      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              "h-7 min-w-7 border px-2 font-mono text-[11px] transition-colors",
              p === page
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <GameButton size="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </GameButton>

      <span className="label-caps ml-2 text-[10px] text-muted-foreground">
        Page {page} / {totalPages}
      </span>
      <span className="ml-auto font-mono text-[10px] text-muted-foreground">
        {from}–{to} of {total}
      </span>
    </div>
  );
}
