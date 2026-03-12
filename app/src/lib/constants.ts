export const APP_NAME = "Six Rivers Community Intelligence";
export const APP_DESCRIPTION = "Community-centered intelligence platform for Six Rivers Africa";
export const APP_VERSION = "0.1.0";

export const OPERATIONAL_ZONES = {
  ifakara: {
    name: "Ifakara Town Council",
    description: "Villages bordering Nyerere National Park",
    center: { lat: -7.9, lng: 36.68 },
    zoom: 10,
  },
  mbarali: {
    name: "Mbarali District Council",
    description: "Villages bordering Ruaha National Park",
    center: { lat: -8.2, lng: 34.55 },
    zoom: 10,
  },
} as const;

export const MAP_CONFIG = {
  defaultCenter: { lat: -8.5, lng: 36.0 },
  defaultZoom: 7,
  minZoom: 5,
  maxZoom: 18,
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

export const SEEDLING_SPECIES = [
  "Cocoa",
  "Chilli",
  "Moringa",
  "Mango",
  "Avocado",
  "Cashew",
  "Teak",
  "Eucalyptus",
  "Neem",
  "Grevillea",
  "Acacia",
  "Leucaena",
  "Gliricidia",
  "Casuarina",
  "Bamboo",
  "Other",
] as const;

export const CROP_TYPES = [
  "Chilli",
  "Cocoa",
  "Onion",
  "Cassava",
  "Maize",
  "Rice",
  "Sunflower",
  "Sesame",
  "Beans",
  "Groundnut",
  "Sweet Potato",
  "Tomato",
  "Cabbage",
  "Other",
] as const;

export const FARMING_APPROACHES = {
  chilli_fencing: {
    label: "Chilli Fencing",
    description: "Nature-based elephant deterrence — chilli planted around farm boundaries",
    level: "Individual",
  },
  agroforestry: {
    label: "Agroforestry",
    description: "Wildlife-friendly tree-crop integration (e.g. cocoa planting)",
    level: "Individual",
  },
  shambachungu: {
    label: "Shambachungu",
    description: "Group-wise wildlife-friendly farming",
    level: "Group",
  },
  horticulture: {
    label: "Horticulture",
    description: "Short-cycle vegetable and crop farming (onions, tomatoes, cabbage)",
    level: "Individual",
  },
  nursery: {
    label: "Tree Nursery",
    description: "Community nurseries for ecosystem restoration",
    level: "Community",
  },
} as const;

export const INCIDENT_TYPES = {
  restricted_grazing: { label: "Restricted Area Grazing", color: "#ef4444" },
  crop_damage: { label: "Crop Damage", color: "#f97316" },
  water_conflict: { label: "Water Point Conflict", color: "#3b82f6" },
  corridor_blockage: { label: "Corridor Blockage", color: "#8b5cf6" },
  other: { label: "Other", color: "#6b7280" },
} as const;

export const WILDLIFE_INCIDENT_TYPES = {
  crop_raid: { label: "Crop Raid", color: "#ef4444" },
  property_damage: { label: "Property Damage", color: "#f97316" },
  human_injury: { label: "Human Injury", color: "#dc2626" },
  livestock_attack: { label: "Livestock Attack", color: "#8b5cf6" },
  other: { label: "Other", color: "#6b7280" },
} as const;

export const SEVERITY_LEVELS = {
  low: { label: "Low", color: "#22c55e", bgColor: "#dcfce7" },
  moderate: { label: "Moderate", color: "#f59e0b", bgColor: "#fef3c7" },
  high: { label: "High", color: "#ef4444", bgColor: "#fee2e2" },
} as const;

export const VISIT_TYPES = {
  farm_check: { label: "Farm Check", icon: "Sprout" },
  nursery_check: { label: "Nursery Check", icon: "TreePine" },
  community_meeting: { label: "Community Meeting", icon: "Users" },
  seedling_distribution: { label: "Seedling Distribution", icon: "Package" },
  incident_report: { label: "Incident Report", icon: "AlertTriangle" },
  survival_check: { label: "Survival Check", icon: "CheckCircle" },
  chilli_fence_check: { label: "Chilli Fence Check", icon: "Shield" },
  wildlife_report: { label: "Wildlife Report", icon: "AlertTriangle" },
} as const;
