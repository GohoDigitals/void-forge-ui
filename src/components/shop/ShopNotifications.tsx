import { cn } from "@/lib/utils";

export type ShopNotice = {
  id: number;
  title: string;
  detail?: string;
  tone: "success" | "error" | "info";
};

export function ShopNotifications({ notices }: { notices: ShopNotice[] }) {
  return (
    <div className="pointer-events-none absolute right-4 top-4 z-40 flex w-56 flex-col gap-2">
      {notices.map((n) => (
        <div
          key={n.id}
          className={cn(
            "border bg-surface/95 px-3 py-2 shadow-lg",
            n.tone === "success" && "border-primary/60",
            n.tone === "error" && "border-destructive/60",
            n.tone === "info" && "border-border",
          )}
        >
          <div
            className={cn(
              "label-caps text-[10px]",
              n.tone === "success" && "text-primary",
              n.tone === "error" && "text-destructive",
              n.tone === "info" && "text-foreground/80",
            )}
          >
            {n.title}
          </div>
          {n.detail && (
            <div className="font-mono text-[11px] text-muted-foreground">{n.detail}</div>
          )}
        </div>
      ))}
    </div>
  );
}
