import { TabBar } from "@/components/game/ui";
import type { ShopCategory } from "@/lib/shop-data";

export function ShopCategoryTabs({
  categories,
  value,
  counts,
  onChange,
}: {
  categories: ShopCategory[];
  value: string;
  counts: Record<string, number>;
  onChange: (id: string) => void;
}) {
  return (
    <TabBar
      tabs={categories.map((c) => ({
        id: c.id,
        label: `${c.label}${counts[c.id] !== undefined ? ` ${counts[c.id]}` : ""}`,
      }))}
      value={value}
      onChange={onChange}
    />
  );
}
