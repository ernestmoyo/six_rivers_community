export interface Village {
  id: number;
  name: string;
  wardId: number;
  wardName: string;
  districtName: string;
  regionName: string;
  population: number;
  isOperational: boolean;
  sector: "psolo" | "usangu_basin" | null;
  distanceToNpKm: number | null;
  farmerCount: number;
  seedlingCount: number;
  geometry?: GeoJSON.Geometry;
}

export interface Farmer {
  id: number;
  name: string;
  villageId: number;
  villageName: string;
  phone: string | null;
  farmLocationLat: number | null;
  farmLocationLng: number | null;
  farmAreaHectares: number | null;
  registeredAt: string;
  registeredBy: string;
}

export interface SeedlingDistribution {
  id: number;
  farmerId: number;
  farmerName: string;
  species: string;
  quantity: number;
  distributionDate: string;
  nurseryId: number | null;
  nurseryName: string | null;
  distributedBy: string;
  locationLat: number | null;
  locationLng: number | null;
  survivalRate: number | null;
}

export interface SurvivalCheck {
  id: number;
  distributionId: number;
  checkDate: string;
  survivingCount: number;
  originalCount: number;
  survivalRate: number;
  photoUrl: string | null;
  checkedBy: string;
  notes: string | null;
}

export interface CropCycle {
  id: number;
  farmerId: number;
  farmerName: string;
  cropType: string;
  plantingDate: string;
  expectedHarvestDate: string | null;
  actualHarvestDate: string | null;
  areaHectares: number | null;
  yieldKg: number | null;
}

export interface Nursery {
  id: number;
  name: string;
  villageId: number;
  villageName: string;
  locationLat: number | null;
  locationLng: number | null;
  capacitySeedlings: number | null;
  waterSource: string | null;
  managedBy: string | null;
  totalProduced: number;
  totalDistributed: number;
}

export interface NurseryBatch {
  id: number;
  nurseryId: number;
  species: string;
  quantityPlanted: number;
  plantingDate: string;
  germinationCount: number | null;
  readyDate: string | null;
  status: "germinating" | "growing" | "ready" | "distributed" | "failed";
}

export interface CattleIncident {
  id: number;
  locationLat: number;
  locationLng: number;
  villageId: number | null;
  villageName: string | null;
  incidentType: "restricted_grazing" | "crop_damage" | "water_conflict" | "corridor_blockage" | "other";
  severity: "low" | "moderate" | "high";
  date: string;
  estimatedHerdSize: number | null;
  description: string | null;
  photoUrl: string | null;
  reportedBy: string;
}

export interface FieldVisit {
  id: number;
  userId: number;
  userName: string;
  villageId: number;
  villageName: string;
  visitDate: string;
  visitType: "farm_check" | "nursery_check" | "community_meeting" | "seedling_distribution" | "incident_report" | "survival_check";
  locationLat: number | null;
  locationLng: number | null;
  notes: string | null;
  photos: string[];
  syncedAt: string | null;
}

export interface WeatherData {
  wardId: number;
  wardName: string;
  date: string;
  rainfallMm: number | null;
  tempMaxC: number | null;
  tempMinC: number | null;
  droughtIndex: number | null;
}

export interface KPISummary {
  totalFarmers: number;
  totalSeedlingsDistributed: number;
  averageSurvivalRate: number;
  totalAgroforestryHectares: number;
  operationalVillages: number;
  activeCropCycles: number;
  cattleIncidentsThisMonth: number;
  fieldVisitsThisMonth: number;
}

export interface UserRole {
  role: "admin" | "manager" | "field_officer" | "donor_viewer";
}

export type NavItem = {
  title: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
};
