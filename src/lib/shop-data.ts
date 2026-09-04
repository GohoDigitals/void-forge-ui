import type { EquipSlotId, Rarity } from "@/lib/game-data";

/* ============================================================
 * SHARED ITEM DATABASE
 * One global definition per item. Shops only reference item ids
 * through listings, so the same item can exist in many shops
 * with different price / stock / availability.
 * ==========================================================*/

export type ItemType =
  | "weapon"
  | "armor"
  | "equipment"
  | "consumable"
  | "material"
  | "shipPart"
  | "cosmetic"
  | "special";

export type GameItem = {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  subtype: string;
  rarity: Rarity;
  level: number;
  baseBuyPrice: number;
  baseSellPrice: number;
  stats: { label: string; value: string }[];
  requirements?: string[];
  slot?: EquipSlotId;
  effect?: string;
  duration?: string;
  usage?: string;
};

type ItemSeed = Omit<GameItem, "baseSellPrice"> & { baseSellPrice?: number };

const def = (s: ItemSeed): GameItem => ({
  ...s,
  baseSellPrice: s.baseSellPrice ?? Math.round(s.baseBuyPrice * 0.35),
});

const rarityCycle: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];

/* --- Weapons --- */
const weaponSeeds = [
      { n: "Vibro Cleaver", sub: "melee", r: "common", lv: 6, p: 950, atk: 58 },
      { n: "Arc Sabre", sub: "melee", r: "uncommon", lv: 11, p: 2100, atk: 84 },
      { n: "Breacher Maul", sub: "melee", r: "rare", lv: 17, p: 5400, atk: 128 },
      { n: "Void Rend Blade", sub: "melee", r: "epic", lv: 24, p: 14200, atk: 186 },
      { n: "Sorran Warglaive", sub: "melee", r: "legendary", lv: 30, p: 38000, atk: 244 },
      { n: "Scout Carbine", sub: "ranged", r: "common", lv: 5, p: 880, atk: 52 },
      { n: "Kestrel Sidearm II", sub: "ranged", r: "uncommon", lv: 12, p: 1950, atk: 76 },
      { n: "Marksman Railgun", sub: "ranged", r: "rare", lv: 18, p: 6100, atk: 140 },
      { n: "Longshot MK-IV", sub: "ranged", r: "epic", lv: 25, p: 15800, atk: 192 },
      { n: "Nova Lance", sub: "ranged", r: "legendary", lv: 31, p: 42000, atk: 258 },
      { n: "Plasma Repeater", sub: "plasma", r: "uncommon", lv: 13, p: 2400, atk: 88 },
      { n: "Plasma Rifle", sub: "plasma", r: "rare", lv: 19, p: 5000, atk: 146 },
      { n: "Solar Flux Cannon", sub: "plasma", r: "epic", lv: 26, p: 17400, atk: 204 },
      { n: "Starfire Emitter", sub: "plasma", r: "legendary", lv: 32, p: 46500, atk: 268 },
      { n: "Disruptor Pod", sub: "special", r: "rare", lv: 16, p: 4700, atk: 96 },
      { n: "EMP Lattice Gun", sub: "special", r: "epic", lv: 23, p: 13600, atk: 158 },
      { n: "Singularity Caster", sub: "special", r: "legendary", lv: 33, p: 52000, atk: 276 },
    ].map((w, i) =>
      def({
        id: `w${i + 1}`,
        name: w.n,
        description: `${w.sub === "melee" ? "Close-quarters" : w.sub === "plasma" ? "Superheated energy" : w.sub === "ranged" ? "Long range kinetic" : "Tactical support"} weapon rated for void combat.`,
        type: "weapon",
        subtype: w.sub,
        rarity: w.r as Rarity,
        level: w.lv,
        baseBuyPrice: w.p,
        slot: w.sub === "special" ? "sidearm" : "weapon",
        requirements: [`Level ${w.lv}`],
        stats: [
          { label: "Damage", value: `+${w.atk}` },
          { label: "Fire Rate", value: `${(1.2 + (i % 5) * 0.35).toFixed(2)}/s` },
          { label: "Range", value: `${180 + i * 24} m` },
          { label: "Accuracy", value: `${62 + (i % 7) * 4}%` },
          { label: "Crit Chance", value: `${4 + (i % 6) * 2}%` },
          { label: "Energy Cost", value: `${8 + (i % 5) * 6}` },
        ],
      }),
    )
  : [];

/* --- Armor --- */
const armorSeeds = [
  { n: "Recruit Helm", sub: "helmet", slot: "helmet" },
  { n: "Patrol Visor", sub: "helmet", slot: "helmet" },
  { n: "Void Helm MK-VII", sub: "helmet", slot: "helmet" },
  { n: "Recruit Plating", sub: "body", slot: "chest" },
  { n: "Aegis Plate", sub: "body", slot: "chest" },
  { n: "Bulwark Carapace", sub: "body", slot: "chest" },
  { n: "Servo Gloves", sub: "gloves", slot: "gloves" },
  { n: "Gauss Gauntlets", sub: "gloves", slot: "gloves" },
  { n: "Strider Boots", sub: "boots", slot: "boots" },
  { n: "Mag-Lock Treads", sub: "boots", slot: "boots" },
  { n: "Barrier Node", sub: "shields", slot: "shield" },
  { n: "Halo Deflector", sub: "shields", slot: "shield" },
] as const;

const armor: GameItem[] = armorSeeds.map((a, i) =>
  def({
    id: `a${i + 1}`,
    name: a.n,
    description: "Layered composite protection tuned for sustained plasma exposure.",
    type: "armor",
    subtype: a.sub,
    rarity: rarityCycle[i % 5]!,
    level: 6 + i * 2,
    baseBuyPrice: 780 + i * 1450,
    slot: a.slot as EquipSlotId,
    requirements: [`Level ${6 + i * 2}`],
    stats: [
      { label: "Armor", value: `+${28 + i * 14}` },
      { label: "Shield", value: `+${40 + i * 22}` },
      { label: "Resistance", value: `${6 + i * 3}%` },
      { label: "Energy", value: `+${10 + i * 5}` },
      { label: "Weight", value: `${4 + i}` },
    ],
  }),
);

/* --- Equipment / ship modules --- */
const equipmentSeeds = [
  "Fusion Core",
  "Neural Implant",
  "Thruster Module",
  "Targeting Array",
  "Coolant Manifold",
  "Sensor Uplink",
  "Hull Reinforcer",
  "Cloak Emitter",
];

const equipment: GameItem[] = equipmentSeeds.map((n, i) =>
  def({
    id: `e${i + 1}`,
    name: n,
    description: "Ship module installed into the auxiliary bus. Improves onboard systems.",
    type: i > 5 ? "shipPart" : "equipment",
    subtype: i > 5 ? "component" : "module",
    rarity: rarityCycle[(i + 1) % 5]!,
    level: 10 + i * 2,
    baseBuyPrice: 2400 + i * 2600,
    slot: i === 0 ? "core" : i === 1 ? "implant" : undefined,
    stats: [
      { label: "Power", value: `+${30 + i * 12}` },
      { label: "Stability", value: `${55 + i * 4}%` },
      { label: "Mass", value: `${2 + i} t` },
    ],
  }),
);

/* --- Consumables --- */
const consumableSeeds = [
  { n: "Repair Kit", e: "Restores 35% hull integrity", d: "Instant", p: 240 },
  { n: "Shield Charge", e: "Restores 50% shields", d: "Instant", p: 320 },
  { n: "Energy Cell Pack", e: "Refills 200 energy", d: "Instant", p: 180 },
  { n: "Railgun Slugs", e: "Restocks 60 kinetic rounds", d: "Instant", p: 140 },
  { n: "Overdrive Stim", e: "+20% attack speed", d: "15 s", p: 900 },
  { n: "Nano Regenerator", e: "Heals 8% hull per second", d: "10 s", p: 1350 },
  { n: "Phase Screen", e: "Absorbs the next 3 hits", d: "20 s", p: 2100 },
];

const consumables: GameItem[] = consumableSeeds.map((c, i) =>
  def({
    id: `c${i + 1}`,
    name: c.n,
    description: `${c.e}. Consumed on use during combat.`,
    type: "consumable",
    subtype: "consumable",
    rarity: rarityCycle[i % 4]!,
    level: 1,
    baseBuyPrice: c.p,
    effect: c.e,
    duration: c.d,
    stats: [
      { label: "Effect", value: c.e },
      { label: "Duration", value: c.d },
    ],
  }),
);

/* --- Materials --- */
const materialSeeds = [
  { n: "Titanium Alloy", sub: "metal", p: 60 },
  { n: "Tungsten Ingot", sub: "metal", p: 120 },
  { n: "Focus Crystal", sub: "crystal", p: 340 },
  { n: "Resonant Prism", sub: "crystal", p: 780 },
  { n: "Plasma Cell", sub: "energy", p: 260 },
  { n: "Antimatter Vial", sub: "energy", p: 1900 },
  { n: "Void Shard", sub: "rare", p: 4200 },
  { n: "Sorran Relic", sub: "alien", p: 16000 },
  { n: "Xeno Filament", sub: "alien", p: 2600 },
  { n: "Salvaged Optic", sub: "metal", p: 95 },
];

const materials: GameItem[] = materialSeeds.map((m, i) =>
  def({
    id: `m${i + 1}`,
    name: m.n,
    description: "Refined trade material used by upgrade benches and crafting terminals.",
    type: "material",
    subtype: m.sub,
    rarity: rarityCycle[Math.min(4, Math.floor(i / 2))]!,
    level: 1,
    baseBuyPrice: m.p,
    usage: "Upgrade / crafting material",
    stats: [
      { label: "Material Grade", value: m.sub.toUpperCase() },
      { label: "Usage", value: "Upgrade & crafting" },
    ],
  }),
);

/* --- Special / cosmetic --- */
const specialSeeds = [
  { n: "Ardent Hull Skin", t: "cosmetic" },
  { n: "Crimson Thruster Trail", t: "cosmetic" },
  { n: "Coalition Callsign Decal", t: "cosmetic" },
  { n: "Interceptor Frame", t: "shipPart" },
  { n: "Blackwatch Bundle", t: "special" },
  { n: "Founders Pilot Suit", t: "cosmetic" },
];

const specials: GameItem[] = specialSeeds.map((s, i) =>
  def({
    id: `s${i + 1}`,
    name: s.n,
    description: "Premium requisition item. Purely cosmetic unless stated otherwise.",
    type: s.t as ItemType,
    subtype: "premium",
    rarity: i > 3 ? "legendary" : "epic",
    level: 1,
    baseBuyPrice: 400 + i * 250,
    stats: [{ label: "Category", value: s.t === "cosmetic" ? "Cosmetic" : "Requisition" }],
  }),
);

export const itemDatabase: GameItem[] = [
  ...weapons,
  ...armor,
  ...equipment,
  ...consumables,
  ...materials,
  ...specials,
];

export const itemById = (id: string): GameItem | undefined =>
  itemDatabase.find((i) => i.id === id);

/* ============================================================
 * SHOP CONFIGURATION
 * ==========================================================*/

export type ShopAvailability = "available" | "locked" | "limited" | "soldOut" | "featured";

export type ShopListing = {
  itemId: string;
  categoryId: string;
  price?: number;
  discountPercentage?: number;
  stock: number;
  maxStock: number;
  unlimitedStock?: boolean;
  purchaseLimit?: number;
  restockSeconds?: number;
  availability: ShopAvailability;
  requirement?: string;
  isNew?: boolean;
};

export type ShopCurrency = {
  id: string;
  label: string;
  short: string;
  amount: number;
};

export type ShopCategory = { id: string; label: string };

export type ShopConfig = {
  id: string;
  name: string;
  shopType:
    | "general"
    | "weapon"
    | "armor"
    | "equipment"
    | "consumable"
    | "material"
    | "special"
    | "cash";
  location: string;
  description: string;
  currencyId: string;
  itemsPerPage: number;
  categories: ShopCategory[];
  listings: ShopListing[];
  showStock: boolean;
  showReputation: boolean;
  showDiscounts: boolean;
  showCompare: boolean;
  showSell: boolean;
  showBuy: boolean;
  showFavorites: boolean;
  showSearch: boolean;
  showFilters: boolean;
  showSorting: boolean;
  showPagination: boolean;
  reputation?: { label: string; level: number; percent: number };
};

/* Currencies are data-driven; adding one needs no UI change. */
export const currencies: ShopCurrency[] = [
  { id: "credits", label: "Credits", short: "CR", amount: 84210 },
  { id: "energy", label: "Energy Cells", short: "EC", amount: 340 },
  { id: "rare", label: "Rare Materials", short: "RM", amount: 18 },
  { id: "premium", label: "Nova Tokens", short: "NT", amount: 1250 },
];

/* Listing helper — keeps shop definitions compact and data-only. */
const listing = (
  itemId: string,
  categoryId: string,
  o: Partial<ShopListing> = {},
): ShopListing => ({
  itemId,
  categoryId,
  stock: 6,
  maxStock: 10,
  availability: "available",
  ...o,
});

const weaponsBySub = (sub: string) => weapons.filter((w) => w.subtype === sub).map((w) => w.id);
const armorBySub = (sub: string) => armor.filter((a) => a.subtype === sub).map((a) => a.id);
const materialsBySub = (sub: string) =>
  materials.filter((m) => m.subtype === sub).map((m) => m.id);

const spread = (ids: string[], cat: string, o: (i: number) => Partial<ShopListing> = () => ({})) =>
  ids.map((id, i) => listing(id, cat, o(i)));

export const shops: ShopConfig[] = [
  {
    id: "weapon-dealer",
    name: "Weapon Dealer",
    shopType: "weapon",
    location: "Orbital Trading Hub · Sector 07",
    description: "Licensed armaments broker. Kinetic, plasma and tactical ordnance.",
    currencyId: "credits",
    itemsPerPage: 12,
    categories: [
      { id: "all", label: "All" },
      { id: "melee", label: "Melee" },
      { id: "ranged", label: "Ranged" },
      { id: "plasma", label: "Plasma" },
      { id: "special", label: "Special" },
    ],
    listings: [
      ...spread(weaponsBySub("melee"), "melee", (i) => ({
        stock: 8 - i,
        maxStock: 8,
        ...(i === 3 ? { discountPercentage: 20 } : {}),
        ...(i === 4 ? { availability: "locked" as const, requirement: "Requires Trader Rep Lv 5" } : {}),
      })),
      ...spread(weaponsBySub("ranged"), "ranged", (i) => ({
        stock: i === 2 ? 0 : 4 + i,
        maxStock: 10,
        ...(i === 2 ? { availability: "soldOut" as const, restockSeconds: 9918 } : {}),
        ...(i === 0 ? { isNew: true } : {}),
      })),
      ...spread(weaponsBySub("plasma"), "plasma", (i) => ({
        stock: 4,
        maxStock: 10,
        ...(i === 1 ? { availability: "featured" as const, discountPercentage: 15 } : {}),
        ...(i === 3 ? { availability: "locked" as const, requirement: "Requires Level 30" } : {}),
      })),
      ...spread(weaponsBySub("special"), "special", (i) => ({
        stock: 3,
        maxStock: 5,
        purchaseLimit: 2,
        ...(i === 2 ? { availability: "limited" as const } : {}),
      })),
    ],
    showStock: true,
    showReputation: true,
    showDiscounts: true,
    showCompare: true,
    showSell: true,
    showBuy: true,
    showFavorites: true,
    showSearch: true,
    showFilters: true,
    showSorting: true,
    showPagination: true,
    reputation: { label: "Trader Rep", level: 4, percent: 82 },
  },
  {
    id: "armor-dealer",
    name: "Armor Dealer",
    shopType: "armor",
    location: "Orbital Trading Hub · Sector 07",
    description: "Defensive plating, deflector nodes and pilot survivability gear.",
    currencyId: "credits",
    itemsPerPage: 12,
    categories: [
      { id: "all", label: "All" },
      { id: "helmet", label: "Helmet" },
      { id: "body", label: "Body" },
      { id: "gloves", label: "Gloves" },
      { id: "boots", label: "Boots" },
      { id: "shields", label: "Shields" },
    ],
    listings: [
      ...spread(armorBySub("helmet"), "helmet"),
      ...spread(armorBySub("body"), "body", (i) => (i === 2 ? { discountPercentage: 10 } : {})),
      ...spread(armorBySub("gloves"), "gloves", () => ({ unlimitedStock: true })),
      ...spread(armorBySub("boots"), "boots"),
      ...spread(armorBySub("shields"), "shields", (i) =>
        i === 1 ? { availability: "featured" as const, isNew: true } : {},
      ),
    ],
    showStock: true,
    showReputation: true,
    showDiscounts: true,
    showCompare: true,
    showSell: true,
    showBuy: true,
    showFavorites: true,
    showSearch: true,
    showFilters: true,
    showSorting: true,
    showPagination: true,
    reputation: { label: "Trader Rep", level: 3, percent: 46 },
  },
  {
    id: "material-trader",
    name: "Material Trader",
    shopType: "material",
    location: "Orbital Trading Hub · Sector 07",
    description: "Bulk refinery output, crystals and salvaged alien compounds.",
    currencyId: "credits",
    itemsPerPage: 12,
    categories: [
      { id: "all", label: "All" },
      { id: "metal", label: "Metal" },
      { id: "crystal", label: "Crystal" },
      { id: "energy", label: "Energy" },
      { id: "rare", label: "Rare" },
      { id: "alien", label: "Alien" },
    ],
    listings: [
      ...spread(materialsBySub("metal"), "metal", () => ({ unlimitedStock: true })),
      ...spread(materialsBySub("crystal"), "crystal", () => ({ stock: 40, maxStock: 60 })),
      ...spread(materialsBySub("energy"), "energy", () => ({ stock: 25, maxStock: 40 })),
      ...spread(materialsBySub("rare"), "rare", () => ({
        stock: 3,
        maxStock: 5,
        purchaseLimit: 3,
        availability: "limited" as const,
      })),
      ...spread(materialsBySub("alien"), "alien", (i) =>
        i === 0
          ? { stock: 1, maxStock: 1, availability: "locked" as const, requirement: "Requires Trader Rep Lv 6" }
          : { stock: 4, maxStock: 6 },
      ),
    ],
    showStock: true,
    showReputation: false,
    showDiscounts: true,
    showCompare: false,
    showSell: true,
    showBuy: true,
    showFavorites: true,
    showSearch: true,
    showFilters: true,
    showSorting: true,
    showPagination: true,
  },
  {
    id: "general-trader",
    name: "General Trader",
    shopType: "general",
    location: "Orbital Trading Hub · Sector 07",
    description: "Mixed stock outfitter. Everything a pilot needs before undocking.",
    currencyId: "credits",
    itemsPerPage: 16,
    categories: [
      { id: "all", label: "All" },
      { id: "weapons", label: "Weapons" },
      { id: "armor", label: "Armor" },
      { id: "equipment", label: "Equipment" },
      { id: "consumables", label: "Consumables" },
      { id: "materials", label: "Materials" },
      { id: "special", label: "Special" },
    ],
    listings: [
      ...spread(weapons.slice(0, 8).map((w) => w.id), "weapons"),
      ...spread(armor.slice(0, 6).map((a) => a.id), "armor"),
      ...spread(equipment.map((e) => e.id), "equipment", (i) =>
        i === 1 ? { discountPercentage: 25 } : {},
      ),
      ...spread(consumables.map((c) => c.id), "consumables", () => ({
        unlimitedStock: true,
        purchaseLimit: 99,
      })),
      ...spread(materials.map((m) => m.id), "materials", () => ({ stock: 30, maxStock: 50 })),
      ...spread(specials.slice(0, 3).map((s) => s.id), "special", () => ({
        stock: 2,
        maxStock: 2,
        availability: "limited" as const,
      })),
    ],
    showStock: true,
    showReputation: true,
    showDiscounts: true,
    showCompare: true,
    showSell: true,
    showBuy: true,
    showFavorites: true,
    showSearch: true,
    showFilters: true,
    showSorting: true,
    showPagination: true,
    reputation: { label: "Station Rep", level: 5, percent: 61 },
  },
  {
    id: "military-depot",
    name: "Military Depot",
    shopType: "weapon",
    location: "Coalition Garrison · Kepler Gap",
    description: "Restricted military requisition. Discounted rates for enlisted pilots.",
    currencyId: "credits",
    itemsPerPage: 12,
    categories: [
      { id: "all", label: "All" },
      { id: "weapons", label: "Weapons" },
      { id: "armor", label: "Armor" },
      { id: "equipment", label: "Equipment" },
    ],
    listings: [
      // Same items as the Weapon Dealer, different prices and stock.
      ...spread(weapons.slice(4, 14).map((w) => w.id), "weapons", (i) => ({
        price: Math.round((itemById(weapons.slice(4, 14)[i]!.id)!.baseBuyPrice * 0.9) / 10) * 10,
        stock: 2 + i,
        maxStock: 12,
      })),
      ...spread(armor.slice(4).map((a) => a.id), "armor", () => ({ stock: 5, maxStock: 8 })),
      ...spread(equipment.slice(2).map((e) => e.id), "equipment", () => ({ stock: 3, maxStock: 6 })),
    ],
    showStock: true,
    showReputation: true,
    showDiscounts: true,
    showCompare: true,
    showSell: false,
    showBuy: true,
    showFavorites: true,
    showSearch: true,
    showFilters: true,
    showSorting: true,
    showPagination: true,
    reputation: { label: "Service Rank", level: 6, percent: 28 },
  },
  {
    id: "cash-shop",
    name: "Requisition Store",
    shopType: "cash",
    location: "Nova Command Network",
    description: "Premium requisitions purchased with Nova Tokens.",
    currencyId: "premium",
    itemsPerPage: 12,
    categories: [
      { id: "all", label: "All" },
      { id: "cosmetic", label: "Cosmetics" },
      { id: "bundles", label: "Bundles" },
    ],
    listings: [
      ...spread(specials.filter((s) => s.type === "cosmetic").map((s) => s.id), "cosmetic", (i) => ({
        unlimitedStock: true,
        ...(i === 0 ? { availability: "featured" as const, discountPercentage: 30, isNew: true } : {}),
      })),
      ...spread(specials.filter((s) => s.type !== "cosmetic").map((s) => s.id), "bundles", () => ({
        unlimitedStock: true,
        availability: "limited" as const,
      })),
    ],
    showStock: false,
    showReputation: false,
    showDiscounts: true,
    showCompare: false,
    showSell: false,
    showBuy: true,
    showFavorites: true,
    showSearch: true,
    showFilters: false,
    showSorting: true,
    showPagination: true,
  },
];

export const shopById = (id: string): ShopConfig =>
  shops.find((s) => s.id === id) ?? shops[0]!;

/* Price helpers — shop listing overrides the global item price. */
export function listingPrice(item: GameItem, l: ShopListing) {
  const base = l.price ?? item.baseBuyPrice;
  const discounted = l.discountPercentage
    ? Math.round((base * (100 - l.discountPercentage)) / 100)
    : base;
  return { original: base, price: discounted, discounted: discounted !== base };
}
