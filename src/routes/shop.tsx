import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { GameButton } from "@/components/game/ui";
import { ShopScreen } from "@/components/shop/ShopScreen";
import { shops } from "@/lib/shop-data";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Trading Terminal — Nova Command" },
      {
        name: "description",
        content:
          "Buy and sell weapons, armor, modules, consumables and materials across station merchants.",
      },
      { property: "og:title", content: "Trading Terminal — Nova Command" },
      {
        property: "og:description",
        content: "Station trading terminal with multi-shop stock, pricing, stock limits and item comparison.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopRoute,
});

function ShopRoute() {
  const navigate = useNavigate();
  const [shopId, setShopId] = useState(shops[0]!.id);

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
      <ShopScreen shopId={shopId} onShopChange={setShopId} />
    </GameShell>
  );
}
