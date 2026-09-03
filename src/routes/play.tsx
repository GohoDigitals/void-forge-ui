import { createFileRoute } from "@tanstack/react-router";
import { GameplayHUD } from "@/components/hud/GameplayHUD";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Nova Command — Gameplay HUD" },
      {
        name: "description",
        content:
          "Live spaceship combat HUD for Nova Command: ship status, target lock, abilities, radar, mission tracker and damage feedback.",
      },
      { property: "og:title", content: "Nova Command — Gameplay HUD" },
      {
        property: "og:description",
        content:
          "The in-flight combat interface: shields, weapons, radar, objectives and directional damage indicators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlayRoute,
});

function PlayRoute() {
  return <GameplayHUD />;
}
