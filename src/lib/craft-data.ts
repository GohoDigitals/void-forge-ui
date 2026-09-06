import { itemById, type GameItem } from "@/lib/shop-data";

/* ============================================================
 * CRAFTING DATA
 * Item / Recipe / Blueprint / Station / Quality are separate
 * data objects so new content is added through data only.
 * ==========================================================*/

/* ---------- Stations ---------- */

export type CraftStation = {
  id: string;
  name: string;
  description: string;
  type: "general" | "weapon" | "armor" | "engineering" | "advanced" | "alien";
  level: number;
  available: boolean;
};

export const stations: CraftStation[] = [
  { id: "workbench", name: "Basic Workbench", description: "Standard issue fabrication bench.", type: "general", level: 1, available: true },
  { id: "weapon-station", name: "Weapon Station", description: "Calibrated armament assembly rig.", type: "weapon", level: 2, available: true },
  { id: "armor-station", name: "Armor Station", description: "Composite plating press and weave loom.", type: "armor", level: 2, available: true },
  { id: "engineering", name: "Engineering Station", description: "Module and ship component assembly.", type: "engineering", level: 3, available: true },
  { id: "advanced", name: "Advanced Fabricator", description: "High tolerance molecular fabricator.", type: "advanced", level: 4, available: false },
  { id: "alien", name: "Alien Fabricator", description: "Recovered Sorran fabrication core.", type: "alien", level: 5, available: false },
];

export const stationById = (id: string) => stations.find((s) => s.id === id);

/* ---------- Quality ---------- */

export type QualityLevel = {
  id: string;
  name: string;
  tier: number;
  statMultiplier: number;
  /** relative weight used when rolling craft quality */
  weight: number;
  /** only reachable through a critical craft */
  criticalOnly?: boolean;
  tone: "muted" | "common" | "uncommon" | "rare" | "epic" | "legendary";
};

export const qualityLevels: QualityLevel[] = [
  { id: "poor", name: "Poor", tier: 0, statMultiplier: 0.85, weight: 10, tone: "muted" },
  { id: "common", name: "Common", tier: 1, statMultiplier: 1, weight: 42, tone: "common" },
  { id: "fine", name: "Fine", tier: 2, statMultiplier: 1.08, weight: 28, tone: "uncommon" },
  { id: "superior", name: "Superior", tier: 3, statMultiplier: 1.18, weight: 14, tone: "rare" },
  { id: "exceptional", name: "Exceptional", tier: 4, statMultiplier: 1.3, weight: 6, tone: "epic" },
  { id: "masterwork", name: "Masterwork", tier: 5, statMultiplier: 1.5, weight: 2, criticalOnly: true, tone: "legendary" },
];

export const qualityById = (id: string) => qualityLevels.find((q) => q.id === id);

/* ---------- Blueprints ---------- */

export type BlueprintSource =
  | "Quest"
  | "NPC"
  | "Shop"
  | "Exploration"
  | "Boss"
  | "Faction"
  | "Loot"
  | "Research"
  | "Special Event"
  | "Achievement";

export type BlueprintStatus = "owned" | "locked" | "undiscovered";

export type Blueprint = {
  id: string;
  recipeId: string;
  name: string;
  description: string;
  source: BlueprintSource;
  status: BlueprintStatus;
  unlockRequirement?: string;
};

/* ---------- Recipes ---------- */

export type MaterialRequirement = { itemId: string; quantity: number };

export type CraftRecipe = {
  id: string;
  outputItemId: string;
  outputQuantity: number;
  categoryId: string;
  subcategoryId: string;
  materials: MaterialRequirement[];
  requiredLevel: number;
  requiredStationId: string;
  requiredSkill?: string;
  blueprintId?: string;
  quality: { enabled: boolean; bonusChance: number };
  critical: { enabled: boolean; chance: number };
};

/* ---------- Categories (data-driven, expandable) ---------- */

export type CraftCategory = {
  id: string;
  label: string;
  subcategories: { id: string; label: string }[];
};

export const craftCategories: CraftCategory[] = [
  { id: "all", label: "All", subcategories: [] },
  {
    id: "weapons",
    label: "Weapons",
    subcategories: [
      { id: "melee", label: "Melee" },
      { id: "ranged", label: "Ranger" },
      { id: "plasma", label: "Plasma" },
      { id: "special", label: "Special" },
    ],
  },
  {
    id: "armor",
    label: "Armor",
    subcategories: [
      { id: "helmet", label: "Helmet" },
      { id: "body", label: "Body" },
      { id: "gloves", label: "Gloves" },
      { id: "boots", label: "Boots" },
      { id: "shields", label: "Shield" },
    ],
  },
  {
    id: "equipment",
    label: "Equipment",
    subcategories: [
      { id: "module", label: "Modules" },
      { id: "accessory", label: "Accessories" },
      { id: "component", label: "Ship Components" },
    ],
  },
  {
    id: "consumables",
    label: "Consumables",
    subcategories: [
      { id: "health", label: "Health" },
      { id: "shield", label: "Shield" },
      { id: "energy", label: "Energy" },
      { id: "ammo", label: "Ammo" },
      { id: "boost", label: "Temporary Boosts" },
    ],
  },
  {
    id: "materials",
    label: "Materials",
    subcategories: [
      { id: "refine", label: "Refining" },
      { id: "processing", label: "Processing" },
    ],
  },
  {
    id: "ship",
    label: "Ship",
    subcategories: [
      { id: "engine", label: "Engine" },
      { id: "shieldgen", label: "Shield Generator" },
      { id: "weaponsys", label: "Weapon System" },
      { id: "reactor", label: "Reactor" },
      { id: "hull", label: "Hull" },
      { id: "sensors", label: "Sensors" },
      { id: "cargo", label: "Cargo" },
      { id: "utility", label: "Utility" },
    ],
  },
];

const mat = (itemId: string, quantity: number): MaterialRequirement => ({ itemId, quantity });

export const recipes: CraftRecipe[] = [
  /* --- Weapons --- */
  {
    id: "r-melee-1", outputItemId: "w1", outputQuantity: 1, categoryId: "weapons", subcategoryId: "melee",
    materials: [mat("m1", 24), mat("m10", 6)],
    requiredLevel: 6, requiredStationId: "weapon-station",
    quality: { enabled: true, bonusChance: 8 }, critical: { enabled: true, chance: 5 },
  },
  {
    id: "r-melee-2", outputItemId: "w3", outputQuantity: 1, categoryId: "weapons", subcategoryId: "melee",
    materials: [mat("m1", 48), mat("m2", 18), mat("m3", 4)],
    requiredLevel: 17, requiredStationId: "weapon-station",
    quality: { enabled: true, bonusChance: 12 }, critical: { enabled: true, chance: 8 },
  },
  {
    id: "r-melee-3", outputItemId: "w5", outputQuantity: 1, categoryId: "weapons", subcategoryId: "melee",
    materials: [mat("m8", 1), mat("m9", 6), mat("m7", 3)],
    requiredLevel: 30, requiredStationId: "alien", blueprintId: "bp-warglaive",
    quality: { enabled: true, bonusChance: 25 }, critical: { enabled: true, chance: 16 },
  },
  {
    id: "r-ranged-1", outputItemId: "w6", outputQuantity: 1, categoryId: "weapons", subcategoryId: "ranged",
    materials: [mat("m1", 20), mat("m10", 4)],
    requiredLevel: 5, requiredStationId: "weapon-station",
    quality: { enabled: true, bonusChance: 6 }, critical: { enabled: true, chance: 4 },
  },
  {
    id: "r-ranged-2", outputItemId: "w8", outputQuantity: 1, categoryId: "weapons", subcategoryId: "ranged",
    materials: [mat("m1", 60), mat("m2", 24), mat("m5", 10)],
    requiredLevel: 18, requiredStationId: "weapon-station",
    quality: { enabled: true, bonusChance: 14 }, critical: { enabled: true, chance: 9 },
  },
  {
    id: "r-plasma-1", outputItemId: "w11", outputQuantity: 1, categoryId: "weapons", subcategoryId: "plasma",
    materials: [mat("m1", 30), mat("m5", 12), mat("m3", 2)],
    requiredLevel: 13, requiredStationId: "weapon-station",
    quality: { enabled: true, bonusChance: 10 }, critical: { enabled: true, chance: 7 },
  },
  {
    id: "r-plasma-2", outputItemId: "w12", outputQuantity: 1, categoryId: "weapons", subcategoryId: "plasma",
    materials: [mat("m2", 26), mat("m5", 18), mat("m3", 6)],
    requiredLevel: 19, requiredStationId: "advanced", blueprintId: "bp-plasma-mk2",
    quality: { enabled: true, bonusChance: 18 }, critical: { enabled: true, chance: 11 },
  },
  {
    id: "r-special-1", outputItemId: "w16", outputQuantity: 1, categoryId: "weapons", subcategoryId: "special",
    materials: [mat("m4", 4), mat("m6", 2), mat("m7", 1)],
    requiredLevel: 22, requiredStationId: "advanced", blueprintId: "bp-tactical",
    quality: { enabled: true, bonusChance: 20 }, critical: { enabled: true, chance: 12 },
  },

  /* --- Armor --- */
  {
    id: "r-helm-1", outputItemId: "a1", outputQuantity: 1, categoryId: "armor", subcategoryId: "helmet",
    materials: [mat("m1", 18), mat("m10", 4)],
    requiredLevel: 6, requiredStationId: "armor-station",
    quality: { enabled: true, bonusChance: 7 }, critical: { enabled: true, chance: 4 },
  },
  {
    id: "r-body-1", outputItemId: "a5", outputQuantity: 1, categoryId: "armor", subcategoryId: "body",
    materials: [mat("m1", 55), mat("m2", 20), mat("m5", 6)],
    requiredLevel: 14, requiredStationId: "armor-station",
    quality: { enabled: true, bonusChance: 12 }, critical: { enabled: true, chance: 7 },
  },
  {
    id: "r-gloves-1", outputItemId: "a7", outputQuantity: 1, categoryId: "armor", subcategoryId: "gloves",
    materials: [mat("m1", 22), mat("m10", 8)],
    requiredLevel: 18, requiredStationId: "armor-station",
    quality: { enabled: true, bonusChance: 9 }, critical: { enabled: true, chance: 6 },
  },
  {
    id: "r-boots-1", outputItemId: "a9", outputQuantity: 1, categoryId: "armor", subcategoryId: "boots",
    materials: [mat("m1", 26), mat("m2", 10)],
    requiredLevel: 22, requiredStationId: "armor-station",
    quality: { enabled: true, bonusChance: 9 }, critical: { enabled: true, chance: 6 },
  },
  {
    id: "r-shield-1", outputItemId: "a11", outputQuantity: 1, categoryId: "armor", subcategoryId: "shields",
    materials: [mat("m3", 8), mat("m5", 14), mat("m4", 2)],
    requiredLevel: 26, requiredStationId: "engineering", blueprintId: "bp-barrier",
    quality: { enabled: true, bonusChance: 16 }, critical: { enabled: true, chance: 10 },
  },

  /* --- Equipment --- */
  {
    id: "r-mod-1", outputItemId: "e3", outputQuantity: 1, categoryId: "equipment", subcategoryId: "module",
    materials: [mat("m1", 34), mat("m5", 16)],
    requiredLevel: 14, requiredStationId: "engineering",
    quality: { enabled: true, bonusChance: 11 }, critical: { enabled: true, chance: 6 },
  },
  {
    id: "r-mod-2", outputItemId: "e4", outputQuantity: 1, categoryId: "equipment", subcategoryId: "module",
    materials: [mat("m3", 6), mat("m10", 12), mat("m2", 14)],
    requiredLevel: 16, requiredStationId: "engineering",
    quality: { enabled: true, bonusChance: 13 }, critical: { enabled: true, chance: 8 },
  },
  {
    id: "r-acc-1", outputItemId: "e2", outputQuantity: 1, categoryId: "equipment", subcategoryId: "accessory",
    materials: [mat("m3", 4), mat("m9", 2)],
    requiredLevel: 12, requiredStationId: "engineering", blueprintId: "bp-implant",
    quality: { enabled: true, bonusChance: 10 }, critical: { enabled: true, chance: 6 },
  },

  /* --- Consumables --- */
  {
    id: "r-con-1", outputItemId: "c1", outputQuantity: 3, categoryId: "consumables", subcategoryId: "health",
    materials: [mat("m1", 6), mat("m10", 2)],
    requiredLevel: 1, requiredStationId: "workbench",
    quality: { enabled: false, bonusChance: 0 }, critical: { enabled: true, chance: 5 },
  },
  {
    id: "r-con-2", outputItemId: "c2", outputQuantity: 3, categoryId: "consumables", subcategoryId: "shield",
    materials: [mat("m5", 4), mat("m1", 4)],
    requiredLevel: 1, requiredStationId: "workbench",
    quality: { enabled: false, bonusChance: 0 }, critical: { enabled: true, chance: 5 },
  },
  {
    id: "r-con-3", outputItemId: "c3", outputQuantity: 5, categoryId: "consumables", subcategoryId: "energy",
    materials: [mat("m5", 3)],
    requiredLevel: 1, requiredStationId: "workbench",
    quality: { enabled: false, bonusChance: 0 }, critical: { enabled: true, chance: 4 },
  },
  {
    id: "r-con-4", outputItemId: "c4", outputQuantity: 10, categoryId: "consumables", subcategoryId: "ammo",
    materials: [mat("m1", 8), mat("m2", 2)],
    requiredLevel: 1, requiredStationId: "workbench",
    quality: { enabled: false, bonusChance: 0 }, critical: { enabled: true, chance: 3 },
  },
  {
    id: "r-con-5", outputItemId: "c5", outputQuantity: 2, categoryId: "consumables", subcategoryId: "boost",
    materials: [mat("m3", 2), mat("m5", 6)],
    requiredLevel: 10, requiredStationId: "workbench",
    quality: { enabled: true, bonusChance: 8 }, critical: { enabled: true, chance: 6 },
  },

  /* --- Materials (refining / processing) --- */
  {
    id: "r-mat-1", outputItemId: "m2", outputQuantity: 1, categoryId: "materials", subcategoryId: "refine",
    materials: [mat("m1", 6)],
    requiredLevel: 1, requiredStationId: "workbench",
    quality: { enabled: false, bonusChance: 0 }, critical: { enabled: true, chance: 6 },
  },
  {
    id: "r-mat-2", outputItemId: "m4", outputQuantity: 1, categoryId: "materials", subcategoryId: "refine",
    materials: [mat("m3", 4), mat("m5", 4)],
    requiredLevel: 12, requiredStationId: "engineering",
    quality: { enabled: false, bonusChance: 0 }, critical: { enabled: true, chance: 8 },
  },
  {
    id: "r-mat-3", outputItemId: "m6", outputQuantity: 1, categoryId: "materials", subcategoryId: "processing",
    materials: [mat("m5", 12), mat("m7", 1)],
    requiredLevel: 20, requiredStationId: "advanced",
    quality: { enabled: false, bonusChance: 0 }, critical: { enabled: true, chance: 10 },
  },

  /* --- Ship --- */
  {
    id: "r-ship-1", outputItemId: "e7", outputQuantity: 1, categoryId: "ship", subcategoryId: "hull",
    materials: [mat("m1", 90), mat("m2", 40)],
    requiredLevel: 22, requiredStationId: "engineering",
    quality: { enabled: true, bonusChance: 14 }, critical: { enabled: true, chance: 8 },
  },
  {
    id: "r-ship-2", outputItemId: "e8", outputQuantity: 1, categoryId: "ship", subcategoryId: "utility",
    materials: [mat("m9", 4), mat("m4", 3), mat("m6", 1)],
    requiredLevel: 24, requiredStationId: "advanced", blueprintId: "bp-cloak",
    quality: { enabled: true, bonusChance: 22 }, critical: { enabled: true, chance: 14 },
  },
  {
    id: "r-ship-3", outputItemId: "e5", outputQuantity: 1, categoryId: "ship", subcategoryId: "reactor",
    materials: [mat("m5", 20), mat("m2", 18)],
    requiredLevel: 18, requiredStationId: "engineering",
    quality: { enabled: true, bonusChance: 12 }, critical: { enabled: true, chance: 7 },
  },
  {
    id: "r-ship-4", outputItemId: "e6", outputQuantity: 1, categoryId: "ship", subcategoryId: "sensors",
    materials: [mat("m3", 10), mat("m10", 14)],
    requiredLevel: 20, requiredStationId: "engineering",
    quality: { enabled: true, bonusChance: 12 }, critical: { enabled: true, chance: 7 },
  },
];

export const recipeById = (id: string) => recipes.find((r) => r.id === id);

/* ---------- Blueprint registry ---------- */

export const blueprints: Blueprint[] = [
  { id: "bp-plasma-mk2", recipeId: "r-plasma-2", name: "Plasma Rifle Schematic", description: "Coalition pattern plasma weapon schematic.", source: "Quest", status: "locked", unlockRequirement: "Military Research Quest" },
  { id: "bp-warglaive", recipeId: "r-melee-3", name: "Sorran Warglaive Codex", description: "Alien blade pattern recovered from a derelict.", source: "Boss", status: "undiscovered", unlockRequirement: "Defeat the Sorran Warlord" },
  { id: "bp-tactical", recipeId: "r-special-1", name: "Tactical Ordnance Plans", description: "Restricted tactical weapon plans.", source: "Faction", status: "owned" },
  { id: "bp-barrier", recipeId: "r-shield-1", name: "Barrier Node Schematic", description: "Personal deflector emitter schematic.", source: "Shop", status: "owned" },
  { id: "bp-implant", recipeId: "r-acc-1", name: "Neural Implant Design", description: "Certified neural interface design.", source: "Research", status: "owned" },
  { id: "bp-cloak", recipeId: "r-ship-2", name: "Cloak Emitter Blueprint", description: "Experimental refraction field emitter.", source: "Exploration", status: "locked", unlockRequirement: "Survey the Kestrel Nebula" },
];

export const blueprintById = (id?: string) =>
  id ? blueprints.find((b) => b.id === id) : undefined;

/* ---------- Salvage ---------- */

export type SalvageYield = { itemId: string; quantity: number; recoveryRate: number };

export type SalvageProfile = {
  itemId: string;
  yields: SalvageYield[];
};

/** Salvage results are derived from recipes when possible, with a
 *  data-driven recovery rate per material tier. */
const recoveryFor = (m: GameItem | undefined): number => {
  if (!m) return 50;
  switch (m.subtype) {
    case "metal":
      return 100;
    case "energy":
      return 50;
    case "crystal":
      return 35;
    case "rare":
      return 25;
    case "alien":
      return 15;
    default:
      return 40;
  }
};

export function salvageProfileFor(itemId: string): SalvageProfile {
  const recipe = recipes.find((r) => r.outputItemId === itemId);
  if (recipe) {
    return {
      itemId,
      yields: recipe.materials.map((m) => {
        const rate = recoveryFor(itemById(m.itemId));
        return {
          itemId: m.itemId,
          quantity: Math.max(1, Math.floor((m.quantity * rate) / 100 / 2)),
          recoveryRate: rate,
        };
      }),
    };
  }
  // Fallback profile for items without a recipe.
  const item = itemById(itemId);
  const scale = Math.max(1, Math.round((item?.level ?? 1) / 3));
  return {
    itemId,
    yields: [
      { itemId: "m1", quantity: 4 * scale, recoveryRate: 100 },
      { itemId: "m10", quantity: scale, recoveryRate: 50 },
    ],
  };
}
