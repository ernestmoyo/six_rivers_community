export const APP_NAME = "Six Rivers Community Intelligence";
export const APP_DESCRIPTION = "Community-centered intelligence platform for Six Rivers Africa";
export const APP_VERSION = "0.1.0";

export const OPERATIONAL_ZONES = {
  psolo: {
    name: "Psolo Sector",
    description: "Villages adjacent to Nyerere National Park",
    center: { lat: -8.5, lng: 37.5 },
    zoom: 10,
  },
  usangu_basin: {
    name: "Usangu Basin",
    description: "Mbarali District - Usangu Game Reserve area",
    center: { lat: -8.7, lng: 34.1 },
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
  "Pine",
  "Bamboo",
  "Other",
] as const;

export const CROP_TYPES = [
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

export const INCIDENT_TYPES = {
  restricted_grazing: { label: "Restricted Area Grazing", color: "#ef4444" },
  crop_damage: { label: "Crop Damage", color: "#f97316" },
  water_conflict: { label: "Water Point Conflict", color: "#3b82f6" },
  corridor_blockage: { label: "Corridor Blockage", color: "#8b5cf6" },
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
} as const;
