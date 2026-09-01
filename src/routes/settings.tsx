import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { GameButton, Panel, ScreenTitle } from "@/components/game/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Nova Command" },
      {
        name: "description",
        content:
          "Configure general, graphics, audio, controls and gameplay options for the game client.",
      },
      { property: "og:title", content: "Settings — Nova Command" },
      {
        property: "og:description",
        content: "Client options: resolution, quality presets, volume mixers and key bindings.",
      },
    ],
  }),
  component: SettingsScreen,
});

type Category = "general" | "graphics" | "audio" | "controls" | "gameplay";

const categories: { id: Category; label: string }[] = [
  { id: "general", label: "General" },
  { id: "graphics", label: "Graphics" },
  { id: "audio", label: "Audio" },
  { id: "controls", label: "Controls" },
  { id: "gameplay", label: "Gameplay" },
];

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border/60 py-3 last:border-b-0">
      <div>
        <div className="text-sm text-foreground">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <div className="w-[280px] shrink-0">{children}</div>
    </div>
  );
}

function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="label-caps h-9 w-full border border-border bg-background px-3 text-foreground outline-none transition-colors hover:border-border-strong focus:border-primary"
    >
      {options.map((o) => (
        <option key={o} value={o} className="font-sans">
          {o}
        </option>
      ))}
    </select>
  );
}

function SliderRow({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full appearance-none bg-border accent-primary outline-none"
      />
      <span className="w-10 text-right font-mono text-xs text-foreground/80">{value}</span>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={cn(
        "label-caps flex h-9 w-full items-center justify-between border px-3 transition-colors",
        on ? "border-primary/70 bg-primary/10 text-primary" : "border-border text-muted-foreground",
      )}
    >
      <span>{on ? "Enabled" : "Disabled"}</span>
      <span className={cn("h-3 w-3 border", on ? "border-primary bg-primary" : "border-border")} />
    </button>
  );
}

const bindings = [
  ["Thrust Forward", "W"],
  ["Thrust Back", "S"],
  ["Strafe Left", "A"],
  ["Strafe Right", "D"],
  ["Primary Fire", "Mouse 1"],
  ["Secondary Fire", "Mouse 2"],
  ["Boost", "Shift"],
  ["Inventory", "I"],
  ["Character Sheet", "C"],
  ["Target Nearest", "Tab"],
];

function SettingsScreen() {
  const navigate = useNavigate();
  const [cat, setCat] = useState<Category>("general");

  const [language, setLanguage] = useState("English (US)");
  const [region, setRegion] = useState("EU West");
  const [resolution, setResolution] = useState("1920 x 1080");
  const [preset, setPreset] = useState("High");
  const [windowMode, setWindowMode] = useState("Fullscreen");
  const [vsync, setVsync] = useState(true);
  const [motionBlur, setMotionBlur] = useState(false);
  const [fpsCap, setFpsCap] = useState(144);
  const [master, setMaster] = useState(80);
  const [music, setMusic] = useState(55);
  const [sfx, setSfx] = useState(72);
  const [voice, setVoice] = useState(64);
  const [subtitles, setSubtitles] = useState(true);
  const [sensitivity, setSensitivity] = useState(48);
  const [invertY, setInvertY] = useState(false);
  const [difficulty, setDifficulty] = useState("Veteran");
  const [autosave, setAutosave] = useState(true);
  const [tutorials, setTutorials] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState(true);

  return (
    <GameShell
      footer={
        <>
          <GameButton onClick={() => navigate({ to: "/" })}>Discard</GameButton>
          <GameButton variant="primary">Apply Changes</GameButton>
        </>
      }
    >
      <div className="flex h-full min-h-0 flex-col gap-4">
        <ScreenTitle title="Settings" subtitle="Client configuration" />

        <div className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)] gap-4">
          <Panel title="Categories" bodyClassName="flex flex-col gap-1 p-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={cn(
                  "label-caps relative px-3 py-2.5 text-left transition-colors",
                  cat === c.id
                    ? "bg-surface-2 text-primary"
                    : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
                )}
              >
                {cat === c.id && <span className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}
                {c.label}
              </button>
            ))}
            <div className="mt-auto p-1">
              <GameButton className="w-full" size="sm">
                Restore Defaults
              </GameButton>
            </div>
          </Panel>

          <Panel
            title={categories.find((c) => c.id === cat)!.label}
            bodyClassName="min-h-0 overflow-y-auto px-4"
          >
            {cat === "general" && (
              <>
                <Row label="Language" hint="Interface and subtitle language">
                  <Dropdown
                    value={language}
                    onChange={setLanguage}
                    options={["English (US)", "Deutsch", "Türkçe", "日本語"]}
                  />
                </Row>
                <Row label="Server Region" hint="Preferred matchmaking region">
                  <Dropdown
                    value={region}
                    onChange={setRegion}
                    options={["EU West", "EU East", "NA East", "Asia Pacific"]}
                  />
                </Row>
                <Row label="Telemetry" hint="Send anonymous crash reports">
                  <Toggle on={autosave} onChange={setAutosave} />
                </Row>
                <Row label="Cloud Saves" hint="Not available in prototype build">
                  <GameButton className="w-full" disabled>
                    Unavailable
                  </GameButton>
                </Row>
              </>
            )}

            {cat === "graphics" && (
              <>
                <Row label="Resolution">
                  <Dropdown
                    value={resolution}
                    onChange={setResolution}
                    options={["1280 x 720", "1600 x 900", "1920 x 1080", "2560 x 1440", "3840 x 2160"]}
                  />
                </Row>
                <Row label="Display Mode">
                  <Dropdown
                    value={windowMode}
                    onChange={setWindowMode}
                    options={["Fullscreen", "Borderless", "Windowed"]}
                  />
                </Row>
                <Row label="Quality Preset">
                  <Dropdown
                    value={preset}
                    onChange={setPreset}
                    options={["Low", "Medium", "High", "Ultra", "Custom"]}
                  />
                </Row>
                <Row label="Frame Rate Cap" hint="Frames per second">
                  <SliderRow value={fpsCap} onChange={setFpsCap} />
                </Row>
                <Row label="V-Sync">
                  <Toggle on={vsync} onChange={setVsync} />
                </Row>
                <Row label="Motion Blur">
                  <Toggle on={motionBlur} onChange={setMotionBlur} />
                </Row>
              </>
            )}

            {cat === "audio" && (
              <>
                <Row label="Master Volume">
                  <SliderRow value={master} onChange={setMaster} />
                </Row>
                <Row label="Music">
                  <SliderRow value={music} onChange={setMusic} />
                </Row>
                <Row label="Effects">
                  <SliderRow value={sfx} onChange={setSfx} />
                </Row>
                <Row label="Voice Comms">
                  <SliderRow value={voice} onChange={setVoice} />
                </Row>
                <Row label="Subtitles">
                  <Toggle on={subtitles} onChange={setSubtitles} />
                </Row>
                <Row label="Output Device">
                  <Dropdown
                    value="Default Device"
                    onChange={() => {}}
                    options={["Default Device", "Headset", "Monitor Speakers"]}
                  />
                </Row>
              </>
            )}

            {cat === "controls" && (
              <>
                <Row label="Mouse Sensitivity">
                  <SliderRow value={sensitivity} onChange={setSensitivity} />
                </Row>
                <Row label="Invert Y Axis">
                  <Toggle on={invertY} onChange={setInvertY} />
                </Row>
                <div className="mt-4">
                  <div className="label-caps mb-2 text-muted-foreground">Key Bindings</div>
                  <div className="grid grid-cols-2 gap-x-6">
                    {bindings.map(([action, key]) => (
                      <div
                        key={action}
                        className="flex items-center justify-between border-b border-border/60 py-2"
                      >
                        <span className="text-sm text-muted-foreground">{action}</span>
                        <button className="label-caps min-w-[92px] border border-border bg-background px-3 py-1 text-foreground transition-colors hover:border-primary hover:text-primary">
                          {key}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {cat === "gameplay" && (
              <>
                <Row label="Difficulty">
                  <Dropdown
                    value={difficulty}
                    onChange={setDifficulty}
                    options={["Recruit", "Regular", "Veteran", "Void Legend"]}
                  />
                </Row>
                <Row label="Autosave" hint="Save at every sector jump">
                  <Toggle on={autosave} onChange={setAutosave} />
                </Row>
                <Row label="Tutorial Hints">
                  <Toggle on={tutorials} onChange={setTutorials} />
                </Row>
                <Row label="Floating Damage Numbers">
                  <Toggle on={damageNumbers} onChange={setDamageNumbers} />
                </Row>
                <Row label="Permadeath" hint="Locked after campaign start">
                  <GameButton className="w-full" disabled>
                    Locked
                  </GameButton>
                </Row>
              </>
            )}
          </Panel>
        </div>
      </div>
    </GameShell>
  );
}
