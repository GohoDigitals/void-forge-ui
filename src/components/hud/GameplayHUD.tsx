import { useCallback, useEffect, useRef, useState } from "react";
import spaceBattle from "@/assets/space-battle.jpg";
import { AbilityBar } from "./AbilityBar";
import { CombatNotification } from "./CombatNotification";
import { DamageIndicator, type DamageEvent } from "./DamageIndicator";
import { MissionTracker } from "./MissionTracker";
import { NavigationIndicator } from "./NavigationIndicator";
import { PauseMenu } from "./PauseMenu";
import { PlayerStatus } from "./PlayerStatus";
import { QuickAccessBar } from "./QuickAccessBar";
import { Radar } from "./Radar";
import { ResourceDisplay } from "./ResourceDisplay";
import { SpeedIndicator } from "./SpeedIndicator";
import { CenterReticle, TargetFrame } from "./TargetReticle";
import { TargetStatus } from "./TargetStatus";
import { WarningIndicator } from "./WarningIndicator";
import {
  enemyTargets,
  initialGameState,
  type CombatNotice,
  type CombatWarning,
  type GameState,
} from "@/lib/hud-data";

let seq = 0;
const uid = (p: string) => `${p}-${++seq}`;

export function GameplayHUD() {
  const [state, setState] = useState<GameState>(initialGameState);
  const [notices, setNotices] = useState<CombatNotice[]>([]);
  const [hits, setHits] = useState<DamageEvent[]>([]);
  const [paused, setPaused] = useState(false);
  const [missionCollapsed, setMissionCollapsed] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const pushNotice = useCallback((level: CombatNotice["level"], text: string) => {
    const notice: CombatNotice = { id: uid("n"), level, text, at: Date.now() };
    setNotices((prev) => [...prev.slice(-4), notice]);
    setTimeout(() => setNotices((prev) => prev.filter((n) => n.id !== notice.id)), 3200);
  }, []);

  const pushHit = useCallback((layer: DamageEvent["layer"], intensity: number) => {
    const hit: DamageEvent = {
      id: uid("h"),
      angle: Math.round(Math.random() * 360),
      intensity,
      layer,
    };
    setHits((prev) => [...prev.slice(-3), hit]);
    setTimeout(() => setHits((prev) => prev.filter((h) => h.id !== hit.id)), 700);
  }, []);

  /* --- simulation tick: cooldowns, regen, incoming fire --- */
  useEffect(() => {
    const id = window.setInterval(() => {
      if (pausedRef.current) return;

      setState((prev) => {
        const ship = { ...prev.playerShip };
        const incoming = Math.random() < 0.22;
        if (incoming) {
          const dmg = 60 + Math.round(Math.random() * 220);
          if (ship.shield > 0) {
            ship.shield = Math.max(0, ship.shield - dmg);
          } else {
            ship.hp = Math.max(0, ship.hp - dmg);
          }
        } else {
          ship.shield = Math.min(ship.shieldMax, ship.shield + 40);
        }
        ship.energy = Math.min(ship.energyMax, ship.energy + 18);

        const warnings: CombatWarning[] = [];
        if (ship.hp / ship.hpMax <= 0.3)
          warnings.push({ id: "w-hull", level: "critical", label: "Hull Integrity Critical" });
        if (ship.shield / ship.shieldMax <= 0.25)
          warnings.push({ id: "w-shield", level: "warning", label: "Shields Failing" });
        if (ship.energy / ship.energyMax <= 0.2)
          warnings.push({ id: "w-energy", level: "warning", label: "Reactor Output Low" });

        return {
          ...prev,
          playerShip: ship,
          warnings,
          abilities: prev.abilities.map((a) =>
            a.cooldown > 0 ? { ...a, cooldown: Math.max(0, +(a.cooldown - 0.5).toFixed(1)) } : a,
          ),
        };
      });
    }, 500);

    return () => window.clearInterval(id);
  }, []);

  /* --- incoming-fire feedback --- */
  const lastHp = useRef(initialGameState.playerShip.hp);
  const lastShield = useRef(initialGameState.playerShip.shield);
  useEffect(() => {
    const { hp, shield } = state.playerShip;
    if (hp < lastHp.current) {
      pushHit("hull", Math.min(1, (lastHp.current - hp) / 250));
      pushNotice("critical", `Hull damage · -${lastHp.current - hp}`);
    } else if (shield < lastShield.current) {
      pushHit("shield", Math.min(1, (lastShield.current - shield) / 250));
    }
    lastHp.current = hp;
    lastShield.current = shield;
  }, [state.playerShip, pushHit, pushNotice]);

  /* --- keyboard bindings --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setPaused((p) => !p);
        return;
      }
      if (pausedRef.current) return;
      const slot = state.abilities.find((a) => a.key === e.key);
      if (slot) activate(slot.id);
      if (e.key.toLowerCase() === "m") setMissionCollapsed((c) => !c);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.abilities]);

  const activate = (id: string) => {
    setState((prev) => {
      const slot = prev.abilities.find((a) => a.id === id);
      if (!slot || slot.disabled || slot.cooldown > 0) return prev;
      if (prev.playerShip.energy < slot.energyCost) {
        pushNotice("warning", `${slot.name} · insufficient energy`);
        return prev;
      }
      pushNotice("info", `${slot.name} engaged`);
      return {
        ...prev,
        activeAbilityId: id,
        playerShip: {
          ...prev.playerShip,
          energy: prev.playerShip.energy - slot.energyCost,
        },
        abilities: prev.abilities.map((a) =>
          a.id === id
            ? {
                ...a,
                cooldown: a.cooldownMax,
                ...(a.ammo !== undefined ? { ammo: Math.max(0, a.ammo - 1) } : {}),
              }
            : a,
        ),
      };
    });
  };

  const selectTarget = (id: string) => {
    const target = enemyTargets.find((t) => t.id === id) ?? null;
    setState((prev) => ({ ...prev, currentTarget: target }));
    if (target) pushNotice("info", `Target locked · ${target.name}`);
  };

  const hullPct = (state.playerShip.hp / state.playerShip.hpMax) * 100;

  return (
    <div className="relative h-screen min-h-screen w-full overflow-hidden bg-background select-none">
      <img
        src={spaceBattle}
        alt="Spaceship battle in deep space seen from the cockpit"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-background/35" />
      <div className="hud-grid pointer-events-none absolute inset-0 opacity-20" />

      {/* enemy target frames */}
      {enemyTargets.map((t) => (
        <TargetFrame
          key={t.id}
          target={t}
          selected={state.currentTarget?.id === t.id}
          onSelect={() => selectTarget(t.id)}
        />
      ))}

      <CenterReticle locked={Boolean(state.currentTarget)} />

      <DamageIndicator hits={hits} hullPct={hullPct} />

      {/* top row */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className="pointer-events-auto">
          <TargetStatus target={state.currentTarget} />
        </div>
        <div className="pointer-events-auto flex flex-col items-center gap-2">
          <NavigationIndicator navigation={state.navigation} />
          <CombatNotification notices={notices} />
        </div>
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <ResourceDisplay resources={state.resources} />
          <MissionTracker
            mission={state.mission}
            collapsed={missionCollapsed}
            onToggle={() => setMissionCollapsed((c) => !c)}
          />
        </div>
      </div>

      {/* left warnings */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <WarningIndicator warnings={state.warnings} />
      </div>

      {/* bottom row */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
        <div className="flex items-end gap-3">
          <PlayerStatus ship={state.playerShip} />
          <SpeedIndicator
            movement={state.shipMovement}
            onThrottle={(value) =>
              setState((prev) => ({
                ...prev,
                shipMovement: {
                  ...prev.shipMovement,
                  throttle: value,
                  speed: Math.round((value / 100) * prev.shipMovement.maxSpeed),
                },
              }))
            }
          />
        </div>

        <AbilityBar
          abilities={state.abilities}
          activeId={state.activeAbilityId}
          onActivate={activate}
        />

        <div className="flex flex-col items-end gap-2">
          <Radar
            objects={state.radarObjects}
            rangeKm={state.radarRangeKm}
            heading={state.navigation.heading}
            onZoom={(delta) =>
              setState((prev) => ({
                ...prev,
                radarRangeKm: Math.max(4, Math.min(48, prev.radarRangeKm + delta)),
              }))
            }
          />
          <QuickAccessBar onPause={() => setPaused(true)} />
        </div>
      </div>

      <PauseMenu open={paused} mission={state.mission} onResume={() => setPaused(false)} />
    </div>
  );
}
