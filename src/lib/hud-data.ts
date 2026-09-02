/**
 * NOVA COMMAND — mock gameplay state for the main gameplay HUD.
 * The HUD renders purely from this shape, so it can later be swapped
 * for live engine (Godot) telemetry without touching components.
 */

export type Faction = "coalition" | "zyren" | "neutral" | "syndicate";

export interface PlayerShip {
  name: string;
  shipClass: string;
  level: number;
  hp: number;
  hpMax: number;
  shield: number;
  shieldMax: number;
  energy: number;
  energyMax: number;
  armor: number;
  armorMax: number;
}

export interface TargetState {
  id: string;
  name: string;
  type: string;
  level: number;
  faction: Faction;
  distanceKm: number;
  hp: number;
  hpMax: number;
  shield: number;
  shieldMax: number;
  /** relative screen position of the target frame, in % of viewport */
  screen: { x: number; y: number; size: number };
}

export type AbilityKind = "primary" | "secondary" | "special" | "defensive" | "utility";

export interface AbilitySlotState {
  id: string;
  name: string;
  kind: AbilityKind;
  key: string;
  icon: string;
  cooldown: number;
  cooldownMax: number;
  ammo?: number;
  ammoMax?: number;
  charges?: number;
  disabled?: boolean;
  active?: boolean;
  energyCost: number;
}

export interface MissionObjective {
  id: string;
  label: string;
  current: number;
  required: number;
}

export interface MissionState {
  id: string;
  kind: "main" | "side" | "dynamic";
  title: string;
  summary: string;
  objectives: MissionObjective[];
}

export type RadarKind = "player" | "friendly" | "enemy" | "neutral" | "objective";

export interface RadarObject {
  id: string;
  kind: RadarKind;
  /** -1..1 normalised radar coordinates */
  x: number;
  y: number;
  label?: string;
}

export interface ResourceState {
  credits: number;
  energyCells: number;
  metal: number;
  rareMaterials: number;
}

export type WarningLevel = "info" | "warning" | "critical";

export interface CombatWarning {
  id: string;
  level: WarningLevel;
  label: string;
}

export interface CombatNotice {
  id: string;
  level: WarningLevel;
  text: string;
  at: number;
}

export interface NavigationState {
  /** degrees 0-359 */
  heading: number;
  targetBearing?: number;
  missionBearing?: number;
}

export interface ShipMovement {
  speed: number;
  maxSpeed: number;
  throttle: number;
  boost: number;
  braking: boolean;
}

export interface GameState {
  playerShip: PlayerShip;
  currentTarget: TargetState | null;
  abilities: AbilitySlotState[];
  activeAbilityId: string;
  mission: MissionState;
  radarObjects: RadarObject[];
  radarRangeKm: number;
  resources: ResourceState;
  warnings: CombatWarning[];
  navigation: NavigationState;
  shipMovement: ShipMovement;
}

export const enemyTargets: TargetState[] = [
  {
    id: "zyr-destroyer",
    name: "Zyren Destroyer",
    type: "Capital · Destroyer",
    level: 18,
    faction: "zyren",
    distanceKm: 2.4,
    hp: 6400,
    hpMax: 9000,
    shield: 2100,
    shieldMax: 4000,
    screen: { x: 62, y: 40, size: 240 },
  },
  {
    id: "zyr-frigate-a",
    name: "Zyren Frigate",
    type: "Escort · Frigate",
    level: 14,
    faction: "zyren",
    distanceKm: 1.1,
    hp: 1450,
    hpMax: 2600,
    shield: 300,
    shieldMax: 1200,
    screen: { x: 34, y: 56, size: 130 },
  },
  {
    id: "syn-interceptor",
    name: "Syndicate Interceptor",
    type: "Light · Interceptor",
    level: 11,
    faction: "syndicate",
    distanceKm: 3.8,
    hp: 720,
    hpMax: 900,
    shield: 410,
    shieldMax: 600,
    screen: { x: 74, y: 62, size: 92 },
  },
];

export const initialGameState: GameState = {
  playerShip: {
    name: "TCS Valkyrie",
    shipClass: "Assault Cruiser",
    level: 24,
    hp: 8280,
    hpMax: 9000,
    shield: 3120,
    shieldMax: 4000,
    energy: 640,
    energyMax: 1000,
    armor: 1450,
    armorMax: 2000,
  },
  currentTarget: enemyTargets[0]!,
  activeAbilityId: "w-primary",
  abilities: [
    {
      id: "w-primary",
      name: "Pulse Cannon",
      kind: "primary",
      key: "1",
      icon: "///",
      cooldown: 0,
      cooldownMax: 0.6,
      ammo: 248,
      ammoMax: 400,
      energyCost: 4,
      active: true,
    },
    {
      id: "w-secondary",
      name: "Hexa Missiles",
      kind: "secondary",
      key: "2",
      icon: "^^",
      cooldown: 0,
      cooldownMax: 6,
      ammo: 12,
      ammoMax: 24,
      energyCost: 20,
    },
    {
      id: "a-special",
      name: "Plasma Lance",
      kind: "special",
      key: "3",
      icon: "==>",
      cooldown: 0,
      cooldownMax: 18,
      charges: 2,
      energyCost: 140,
    },
    {
      id: "a-defensive",
      name: "Aegis Field",
      kind: "defensive",
      key: "4",
      icon: "( )",
      cooldown: 0,
      cooldownMax: 24,
      energyCost: 180,
    },
    {
      id: "a-utility",
      name: "Overdrive",
      kind: "utility",
      key: "5",
      icon: ">>",
      cooldown: 0,
      cooldownMax: 30,
      energyCost: 90,
    },
    {
      id: "a-repair",
      name: "Nano Repair",
      kind: "utility",
      key: "6",
      icon: "+",
      cooldown: 0,
      cooldownMax: 45,
      charges: 1,
      energyCost: 120,
    },
  ],
  mission: {
    id: "m-01",
    kind: "main",
    title: "Destroy the hostile fleet",
    summary: "Kepler Gap · Sector 7-B",
    objectives: [
      { id: "o1", label: "Destroy enemy frigates", current: 2, required: 5 },
      { id: "o2", label: "Protect the transport", current: 0, required: 1 },
      { id: "o3", label: "Scan derelict beacon", current: 1, required: 1 },
    ],
  },
  radarObjects: [
    { id: "p", kind: "player", x: 0, y: 0 },
    { id: "f1", kind: "friendly", x: -0.35, y: 0.22 },
    { id: "f2", kind: "friendly", x: -0.12, y: 0.55 },
    { id: "e1", kind: "enemy", x: 0.42, y: -0.3 },
    { id: "e2", kind: "enemy", x: 0.62, y: 0.1 },
    { id: "e3", kind: "enemy", x: 0.18, y: -0.62 },
    { id: "n1", kind: "neutral", x: -0.6, y: -0.4 },
    { id: "q1", kind: "objective", x: 0.05, y: -0.82 },
  ],
  radarRangeKm: 12,
  resources: { credits: 84250, energyCells: 320, metal: 1180, rareMaterials: 42 },
  warnings: [],
  navigation: { heading: 42, targetBearing: 74, missionBearing: 355 },
  shipMovement: { speed: 420, maxSpeed: 620, throttle: 68, boost: 85, braking: false },
};

export const factionLabel: Record<Faction, string> = {
  coalition: "Terran Coalition",
  zyren: "Zyren Hegemony",
  neutral: "Unaligned",
  syndicate: "Kepler Syndicate",
};
