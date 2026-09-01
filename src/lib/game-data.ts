import raceHuman from "@/assets/race-human.jpg";
import raceRobot from "@/assets/race-robot.jpg";
import raceSorra from "@/assets/race-sorra.jpg";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export const rarityLabel: Record<Rarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export type Race = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  traits: { label: string; value: number }[];
};

export const races: Race[] = [
  {
    id: "humans",
    name: "Humans",
    tagline: "Terran Coalition",
    description:
      "Adaptable pilots with balanced hull systems and the fastest ship refit cycles in the sector.",
    image: raceHuman,
    traits: [
      { label: "Hull", value: 68 },
      { label: "Tech", value: 72 },
      { label: "Agility", value: 74 },
    ],
  },
  {
    id: "robots",
    name: "Robots",
    tagline: "Synthetic Directive",
    description:
      "Machine intelligences with heavy armour plating, self-repair routines and unmatched accuracy.",
    image: raceRobot,
    traits: [
      { label: "Hull", value: 88 },
      { label: "Tech", value: 80 },
      { label: "Agility", value: 46 },
    ],
  },
  {
    id: "sorras",
    name: "Sorras",
    tagline: "Deep Void Clans",
    description:
      "Bio-engineered voidborn who channel plasma through living hulls at extreme energy efficiency.",
    image: raceSorra,
    traits: [
      { label: "Hull", value: 54 },
      { label: "Tech", value: 92 },
      { label: "Agility", value: 82 },
    ],
  },
];

export type CombatClass = {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: "melee" | "ranger" | "plasma" | "special";
  stats: { label: string; value: number }[];
};

export const classes: CombatClass[] = [
  {
    id: "melee",
    name: "Melee",
    role: "Boarding Vanguard",
    description: "Close-quarter breacher. Highest raw damage inside boarding range.",
    icon: "melee",
    stats: [
      { label: "ATK", value: 92 },
      { label: "DEF", value: 74 },
      { label: "SPD", value: 58 },
    ],
  },
  {
    id: "ranger",
    name: "Ranger",
    role: "Long Range Marksman",
    description: "Precision railgun specialist. Consistent damage at maximum engagement distance.",
    icon: "ranger",
    stats: [
      { label: "ATK", value: 78 },
      { label: "DEF", value: 52 },
      { label: "SPD", value: 80 },
    ],
  },
  {
    id: "plasma",
    name: "Plasma",
    role: "Energy Caster",
    description: "Superheated area denial. Burns shields and hull over sustained fire.",
    icon: "plasma",
    stats: [
      { label: "ATK", value: 84 },
      { label: "DEF", value: 48 },
      { label: "SPD", value: 66 },
    ],
  },
  {
    id: "special",
    name: "Special",
    role: "Covert Operative",
    description: "Sabotage and support kit. Disables enemy systems and buffs the squad.",
    icon: "special",
    stats: [
      { label: "ATK", value: 62 },
      { label: "DEF", value: 60 },
      { label: "SPD", value: 94 },
    ],
  },
];

export type Item = {
  id: string;
  name: string;
  type: string;
  rarity: Rarity;
  quantity: number;
  level: number;
  description: string;
  stats: { label: string; value: string }[];
  slot?: EquipSlotId;
};

export type EquipSlotId =
  | "helmet"
  | "chest"
  | "gloves"
  | "boots"
  | "weapon"
  | "sidearm"
  | "shield"
  | "core"
  | "implant";

export const equipSlots: { id: EquipSlotId; label: string }[] = [
  { id: "helmet", label: "Helmet" },
  { id: "chest", label: "Chest" },
  { id: "gloves", label: "Gloves" },
  { id: "boots", label: "Boots" },
  { id: "weapon", label: "Primary" },
  { id: "sidearm", label: "Sidearm" },
  { id: "shield", label: "Shield" },
  { id: "core", label: "Core" },
  { id: "implant", label: "Implant" },
];

export const inventory: Item[] = [
  {
    id: "i1",
    name: "MK-VII Void Helm",
    type: "Helmet",
    rarity: "epic",
    quantity: 1,
    level: 24,
    slot: "helmet",
    description: "Sealed command helm with tactical overlay and micro-thruster stabilisation.",
    stats: [
      { label: "Defense", value: "+42" },
      { label: "Accuracy", value: "+6%" },
    ],
  },
  {
    id: "i2",
    name: "Aegis Plate",
    type: "Chest",
    rarity: "rare",
    quantity: 1,
    level: 22,
    slot: "chest",
    description: "Layered ceramic-composite torso plating rated for plasma splash.",
    stats: [
      { label: "Defense", value: "+88" },
      { label: "Health", value: "+120" },
    ],
  },
  {
    id: "i3",
    name: "Railspike R-9",
    type: "Primary Weapon",
    rarity: "legendary",
    quantity: 1,
    level: 26,
    slot: "weapon",
    description: "Magnetic accelerator rifle. Penetrates shielding on critical hits.",
    stats: [
      { label: "Attack", value: "+164" },
      { label: "Crit Chance", value: "+9%" },
    ],
  },
  {
    id: "i4",
    name: "Kestrel Sidearm",
    type: "Sidearm",
    rarity: "uncommon",
    quantity: 1,
    level: 18,
    slot: "sidearm",
    description: "Reliable service pistol with fast cycling and low energy draw.",
    stats: [{ label: "Attack", value: "+46" }],
  },
  {
    id: "i5",
    name: "Barrier Node",
    type: "Shield",
    rarity: "rare",
    quantity: 1,
    level: 21,
    slot: "shield",
    description: "Projects a forward energy barrier that regenerates out of combat.",
    stats: [
      { label: "Shield", value: "+210" },
      { label: "Energy", value: "+30" },
    ],
  },
  {
    id: "i6",
    name: "Fusion Core",
    type: "Core",
    rarity: "epic",
    quantity: 1,
    level: 25,
    slot: "core",
    description: "Compact reactor core feeding suit systems and plasma weaponry.",
    stats: [
      { label: "Energy", value: "+180" },
      { label: "Speed", value: "+4" },
    ],
  },
  {
    id: "i7",
    name: "Grip Servos",
    type: "Gloves",
    rarity: "common",
    quantity: 1,
    level: 12,
    slot: "gloves",
    description: "Standard issue servo gloves. Improves weapon handling.",
    stats: [{ label: "Accuracy", value: "+3%" }],
  },
  {
    id: "i8",
    name: "Strider Boots",
    type: "Boots",
    rarity: "uncommon",
    quantity: 1,
    level: 16,
    slot: "boots",
    description: "Mag-lock boots with short burst assist for zero-g movement.",
    stats: [{ label: "Speed", value: "+11" }],
  },
  {
    id: "i9",
    name: "Neural Implant",
    type: "Implant",
    rarity: "rare",
    quantity: 1,
    level: 20,
    slot: "implant",
    description: "Cortical link that shortens targeting latency.",
    stats: [{ label: "Crit Chance", value: "+5%" }],
  },
  {
    id: "i10",
    name: "Titanium Alloy",
    type: "Material",
    rarity: "common",
    quantity: 148,
    level: 1,
    description: "Refined structural alloy used in most equipment upgrades.",
    stats: [{ label: "Use", value: "Upgrade material" }],
  },
  {
    id: "i11",
    name: "Plasma Cell",
    type: "Material",
    rarity: "uncommon",
    quantity: 62,
    level: 1,
    description: "Stabilised plasma canister. Required for energy-tier upgrades.",
    stats: [{ label: "Use", value: "Upgrade material" }],
  },
  {
    id: "i12",
    name: "Void Shard",
    type: "Material",
    rarity: "epic",
    quantity: 7,
    level: 1,
    description: "Crystalline void residue. Raises upgrade success chance considerably.",
    stats: [{ label: "Use", value: "Rare material" }],
  },
  {
    id: "i13",
    name: "Repair Kit",
    type: "Consumable",
    rarity: "common",
    quantity: 12,
    level: 1,
    description: "Restores 35% hull integrity during combat.",
    stats: [{ label: "Heal", value: "35%" }],
  },
  {
    id: "i14",
    name: "Overdrive Stim",
    type: "Consumable",
    rarity: "rare",
    quantity: 4,
    level: 1,
    description: "Temporarily raises attack speed by 20% for 15 seconds.",
    stats: [{ label: "Buff", value: "+20% ATK SPD" }],
  },
  {
    id: "i15",
    name: "Salvaged Optic",
    type: "Component",
    rarity: "common",
    quantity: 23,
    level: 1,
    description: "Scavenged targeting lens. Sells well at outpost markets.",
    stats: [{ label: "Value", value: "120 cr" }],
  },
  {
    id: "i16",
    name: "Sorran Relic",
    type: "Component",
    rarity: "legendary",
    quantity: 1,
    level: 1,
    description: "Ancient voidborn artefact of unknown function. Highly sought after.",
    stats: [{ label: "Value", value: "48,000 cr" }],
  },
];

export const inventoryCapacity = 48;

export const character = {
  name: "CPT. Vera Solano",
  level: 27,
  race: "Humans",
  className: "Ranger",
  ship: "NCS Ardent",
  xp: 6420,
  xpNext: 9000,
  credits: 84210,
  health: 1840,
  healthMax: 2100,
  energy: 620,
  energyMax: 900,
  stats: [
    { label: "Attack", value: "412" },
    { label: "Defense", value: "296" },
    { label: "Accuracy", value: "84%" },
    { label: "Critical Chance", value: "23%" },
    { label: "Speed", value: "137" },
  ],
  skills: [
    { name: "Piercing Volley", level: 4, max: 5, desc: "Fires a railgun burst that ignores 30% shield." },
    { name: "Mark Target", level: 3, max: 5, desc: "Marked enemies take +12% damage for 8s." },
    { name: "Evasive Burn", level: 2, max: 5, desc: "Short thruster dash, +40% evasion during the dash." },
    { name: "Orbital Strike", level: 1, max: 3, desc: "Calls a delayed orbital bombardment on an area." },
  ],
  bio: "Former Coalition escort pilot, reassigned to deep-void interdiction after the Kepler Gap engagement. Specialises in long-range interception and convoy defence.",
};
