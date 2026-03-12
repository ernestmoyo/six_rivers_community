import { KPISummary, Village, Farmer, SeedlingDistribution, SurvivalCheck, CropCycle, Nursery, NurseryBatch, CattleIncident, FieldVisit, WeatherData } from "@/types";

export const demoKPIs: KPISummary = {
  totalFarmers: 342,
  totalSeedlingsDistributed: 18750,
  averageSurvivalRate: 68.4,
  totalAgroforestryHectares: 127.5,
  operationalVillages: 24,
  activeCropCycles: 186,
  cattleIncidentsThisMonth: 12,
  fieldVisitsThisMonth: 47,
};

export const demoVillages: Village[] = [
  { id: 1, name: "Msolwa Ujamaa", wardId: 1, wardName: "Msolwa", districtName: "Kilombero", regionName: "Morogoro", population: 4250, isOperational: true, sector: "psolo", distanceToNpKm: 2.3, farmerCount: 38, seedlingCount: 2100, geometry: undefined },
  { id: 2, name: "Katurukila", wardId: 2, wardName: "Katurukila", districtName: "Kilombero", regionName: "Morogoro", population: 3180, isOperational: true, sector: "psolo", distanceToNpKm: 4.1, farmerCount: 25, seedlingCount: 1450, geometry: undefined },
  { id: 3, name: "Kidatu", wardId: 3, wardName: "Kidatu", districtName: "Kilombero", regionName: "Morogoro", population: 8920, isOperational: true, sector: "psolo", distanceToNpKm: 8.7, farmerCount: 52, seedlingCount: 3200, geometry: undefined },
  { id: 4, name: "Ichonde", wardId: 4, wardName: "Ichonde", districtName: "Mbarali", regionName: "Mbeya", population: 2840, isOperational: true, sector: "usangu_basin", distanceToNpKm: null, farmerCount: 31, seedlingCount: 1680, geometry: undefined },
  { id: 5, name: "Utengule", wardId: 5, wardName: "Utengule", districtName: "Mbarali", regionName: "Mbeya", population: 5430, isOperational: true, sector: "usangu_basin", distanceToNpKm: null, farmerCount: 44, seedlingCount: 2540, geometry: undefined },
  { id: 6, name: "Igomelo", wardId: 6, wardName: "Igomelo", districtName: "Mbarali", regionName: "Mbeya", population: 3760, isOperational: true, sector: "usangu_basin", distanceToNpKm: null, farmerCount: 28, seedlingCount: 1520, geometry: undefined },
  { id: 7, name: "Mahango", wardId: 7, wardName: "Mahango", districtName: "Kilombero", regionName: "Morogoro", population: 2100, isOperational: true, sector: "psolo", distanceToNpKm: 1.8, farmerCount: 18, seedlingCount: 980, geometry: undefined },
  { id: 8, name: "Mkangawalo", wardId: 8, wardName: "Mkangawalo", districtName: "Kilombero", regionName: "Morogoro", population: 1950, isOperational: true, sector: "psolo", distanceToNpKm: 3.5, farmerCount: 15, seedlingCount: 870, geometry: undefined },
];

export const demoFarmers: Farmer[] = [
  { id: 1, name: "Halima Mwenda", villageId: 1, villageName: "Msolwa Ujamaa", phone: "+255 712 345 678", farmLocationLat: -7.82, farmLocationLng: 36.98, farmAreaHectares: 2.5, registeredAt: "2025-09-15", registeredBy: "Justina Kizanye" },
  { id: 2, name: "Juma Abdallah", villageId: 1, villageName: "Msolwa Ujamaa", phone: "+255 765 432 100", farmLocationLat: -7.83, farmLocationLng: 36.97, farmAreaHectares: 1.8, registeredAt: "2025-09-20", registeredBy: "Justina Kizanye" },
  { id: 3, name: "Grace Mushi", villageId: 2, villageName: "Katurukila", phone: "+255 744 556 789", farmLocationLat: -7.85, farmLocationLng: 37.01, farmAreaHectares: 3.2, registeredAt: "2025-10-01", registeredBy: "Irene Masonda" },
  { id: 4, name: "Ramadhani Kibona", villageId: 4, villageName: "Ichonde", phone: "+255 678 901 234", farmLocationLat: -8.65, farmLocationLng: 34.15, farmAreaHectares: 4.0, registeredAt: "2025-10-10", registeredBy: "Lilian Mihambo" },
  { id: 5, name: "Fatma Ngowi", villageId: 5, villageName: "Utengule", phone: "+255 712 999 888", farmLocationLat: -8.72, farmLocationLng: 34.08, farmAreaHectares: 1.5, registeredAt: "2025-11-01", registeredBy: "Lilian Mihambo" },
  { id: 6, name: "Peter Massawe", villageId: 3, villageName: "Kidatu", phone: null, farmLocationLat: -7.71, farmLocationLng: 36.99, farmAreaHectares: 2.0, registeredAt: "2025-11-15", registeredBy: "Irene Masonda" },
];

export const demoDistributions: SeedlingDistribution[] = [
  { id: 1, farmerId: 1, farmerName: "Halima Mwenda", species: "Moringa", quantity: 50, distributionDate: "2025-10-01", nurseryId: 1, nurseryName: "Msolwa Nursery", distributedBy: "Justina Kizanye", locationLat: -7.82, locationLng: 36.98, survivalRate: 72 },
  { id: 2, farmerId: 1, farmerName: "Halima Mwenda", species: "Mango", quantity: 20, distributionDate: "2025-10-01", nurseryId: 1, nurseryName: "Msolwa Nursery", distributedBy: "Justina Kizanye", locationLat: -7.82, locationLng: 36.98, survivalRate: 85 },
  { id: 3, farmerId: 2, farmerName: "Juma Abdallah", species: "Neem", quantity: 30, distributionDate: "2025-10-15", nurseryId: 1, nurseryName: "Msolwa Nursery", distributedBy: "Justina Kizanye", locationLat: -7.83, locationLng: 36.97, survivalRate: 63 },
  { id: 4, farmerId: 3, farmerName: "Grace Mushi", species: "Avocado", quantity: 15, distributionDate: "2025-11-01", nurseryId: 2, nurseryName: "Katurukila Nursery", distributedBy: "Irene Masonda", locationLat: -7.85, locationLng: 37.01, survivalRate: 80 },
  { id: 5, farmerId: 4, farmerName: "Ramadhani Kibona", species: "Grevillea", quantity: 40, distributionDate: "2025-11-10", nurseryId: 3, nurseryName: "Ichonde Nursery", distributedBy: "Lilian Mihambo", locationLat: -8.65, locationLng: 34.15, survivalRate: 55 },
  { id: 6, farmerId: 5, farmerName: "Fatma Ngowi", species: "Moringa", quantity: 60, distributionDate: "2025-12-01", nurseryId: 3, nurseryName: "Ichonde Nursery", distributedBy: "Lilian Mihambo", locationLat: -8.72, locationLng: 34.08, survivalRate: 70 },
];

export const demoSurvivalChecks: SurvivalCheck[] = [
  { id: 1, distributionId: 1, checkDate: "2025-12-01", survivingCount: 36, originalCount: 50, survivalRate: 72, photoUrl: null, checkedBy: "Justina Kizanye", notes: "Drought stress visible on some seedlings" },
  { id: 2, distributionId: 2, checkDate: "2025-12-01", survivingCount: 17, originalCount: 20, survivalRate: 85, photoUrl: null, checkedBy: "Justina Kizanye", notes: "Healthy growth" },
  { id: 3, distributionId: 3, checkDate: "2025-12-15", survivingCount: 19, originalCount: 30, survivalRate: 63, photoUrl: null, checkedBy: "Justina Kizanye", notes: "Sandy soil causing issues" },
  { id: 4, distributionId: 5, checkDate: "2026-01-10", survivingCount: 22, originalCount: 40, survivalRate: 55, photoUrl: null, checkedBy: "Lilian Mihambo", notes: "High sand content, drought conditions in Usangu" },
];

export const demoCropCycles: CropCycle[] = [
  { id: 1, farmerId: 1, farmerName: "Halima Mwenda", cropType: "Onion", plantingDate: "2025-12-01", expectedHarvestDate: "2026-03-01", actualHarvestDate: null, areaHectares: 0.5, yieldKg: null },
  { id: 2, farmerId: 2, farmerName: "Juma Abdallah", cropType: "Cassava", plantingDate: "2025-11-15", expectedHarvestDate: "2026-02-15", actualHarvestDate: "2026-02-20", areaHectares: 1.0, yieldKg: 1200 },
  { id: 3, farmerId: 3, farmerName: "Grace Mushi", cropType: "Maize", plantingDate: "2025-12-10", expectedHarvestDate: "2026-03-10", actualHarvestDate: null, areaHectares: 1.5, yieldKg: null },
  { id: 4, farmerId: 4, farmerName: "Ramadhani Kibona", cropType: "Rice", plantingDate: "2025-11-01", expectedHarvestDate: "2026-02-01", actualHarvestDate: "2026-02-05", areaHectares: 2.0, yieldKg: 2800 },
  { id: 5, farmerId: 5, farmerName: "Fatma Ngowi", cropType: "Sunflower", plantingDate: "2026-01-01", expectedHarvestDate: "2026-04-01", actualHarvestDate: null, areaHectares: 0.8, yieldKg: null },
];

export const demoNurseries: Nursery[] = [
  { id: 1, name: "Msolwa Community Nursery", villageId: 1, villageName: "Msolwa Ujamaa", locationLat: -7.82, locationLng: 36.975, capacitySeedlings: 5000, waterSource: "River", managedBy: "Justina Kizanye", totalProduced: 4200, totalDistributed: 3100 },
  { id: 2, name: "Katurukila Nursery", villageId: 2, villageName: "Katurukila", locationLat: -7.845, locationLng: 37.005, capacitySeedlings: 3000, waterSource: "Borehole", managedBy: "Irene Masonda", totalProduced: 2800, totalDistributed: 2100 },
  { id: 3, name: "Ichonde Restoration Nursery", villageId: 4, villageName: "Ichonde", locationLat: -8.645, locationLng: 34.155, capacitySeedlings: 4000, waterSource: "Stream", managedBy: "Lilian Mihambo", totalProduced: 3500, totalDistributed: 2650 },
];

export const demoNurseryBatches: NurseryBatch[] = [
  { id: 1, nurseryId: 1, species: "Moringa", quantityPlanted: 500, plantingDate: "2025-08-01", germinationCount: 420, readyDate: "2025-10-01", status: "distributed" },
  { id: 2, nurseryId: 1, species: "Mango", quantityPlanted: 300, plantingDate: "2025-08-15", germinationCount: 260, readyDate: "2025-11-15", status: "distributed" },
  { id: 3, nurseryId: 1, species: "Neem", quantityPlanted: 400, plantingDate: "2025-09-01", germinationCount: 350, readyDate: null, status: "growing" },
  { id: 4, nurseryId: 2, species: "Avocado", quantityPlanted: 200, plantingDate: "2025-08-01", germinationCount: 175, readyDate: "2025-11-01", status: "distributed" },
  { id: 5, nurseryId: 3, species: "Grevillea", quantityPlanted: 600, plantingDate: "2025-09-15", germinationCount: 480, readyDate: "2025-12-15", status: "ready" },
  { id: 6, nurseryId: 3, species: "Moringa", quantityPlanted: 400, plantingDate: "2025-10-01", germinationCount: null, readyDate: null, status: "germinating" },
];

export const demoCattleIncidents: CattleIncident[] = [
  { id: 1, locationLat: -8.68, locationLng: 34.12, villageId: 4, villageName: "Ichonde", incidentType: "restricted_grazing", severity: "high", date: "2026-02-15", estimatedHerdSize: 150, description: "Large herd grazing near Ihefu wetland boundary", photoUrl: null, reportedBy: "Lilian Mihambo" },
  { id: 2, locationLat: -8.71, locationLng: 34.09, villageId: 5, villageName: "Utengule", incidentType: "crop_damage", severity: "moderate", date: "2026-02-18", estimatedHerdSize: 80, description: "Cattle trampled cassava fields on eastern border", photoUrl: null, reportedBy: "Lilian Mihambo" },
  { id: 3, locationLat: -8.66, locationLng: 34.14, villageId: 4, villageName: "Ichonde", incidentType: "water_conflict", severity: "high", date: "2026-02-22", estimatedHerdSize: 200, description: "Herders blocking community water access point", photoUrl: null, reportedBy: "Lilian Mihambo" },
  { id: 4, locationLat: -8.73, locationLng: 34.07, villageId: 6, villageName: "Igomelo", incidentType: "restricted_grazing", severity: "moderate", date: "2026-03-01", estimatedHerdSize: 120, description: "Herd moving through restoration area", photoUrl: null, reportedBy: "Lilian Mihambo" },
  { id: 5, locationLat: -8.69, locationLng: 34.11, villageId: 4, villageName: "Ichonde", incidentType: "corridor_blockage", severity: "low", date: "2026-03-05", estimatedHerdSize: 50, description: "Small herd resting on wildlife corridor", photoUrl: null, reportedBy: "Lilian Mihambo" },
];

export const demoFieldVisits: FieldVisit[] = [
  { id: 1, userId: 1, userName: "Justina Kizanye", villageId: 1, villageName: "Msolwa Ujamaa", visitDate: "2026-03-01", visitType: "farm_check", locationLat: -7.82, locationLng: 36.98, notes: "Checked Halima's moringa seedlings. Good growth despite dry spell.", photos: [], syncedAt: "2026-03-01T14:30:00Z" },
  { id: 2, userId: 2, userName: "Irene Masonda", villageId: 2, villageName: "Katurukila", visitDate: "2026-03-02", visitType: "nursery_check", locationLat: -7.845, locationLng: 37.005, notes: "Nursery batch #4 ready for distribution. 175 avocado seedlings.", photos: [], syncedAt: "2026-03-02T11:00:00Z" },
  { id: 3, userId: 3, userName: "Lilian Mihambo", villageId: 4, villageName: "Ichonde", visitDate: "2026-03-03", visitType: "incident_report", locationLat: -8.68, locationLng: 34.12, notes: "Reported cattle grazing near restoration area. Herd size ~150.", photos: [], syncedAt: "2026-03-03T09:15:00Z" },
  { id: 4, userId: 1, userName: "Justina Kizanye", villageId: 3, villageName: "Kidatu", visitDate: "2026-03-05", visitType: "community_meeting", locationLat: -7.71, locationLng: 36.99, notes: "Community meeting with 35 farmers. Discussed dry season planting strategies.", photos: [], syncedAt: "2026-03-05T16:00:00Z" },
  { id: 5, userId: 3, userName: "Lilian Mihambo", villageId: 5, villageName: "Utengule", visitDate: "2026-03-07", visitType: "seedling_distribution", locationLat: -8.72, locationLng: 34.08, notes: "Distributed 60 moringa seedlings to Fatma Ngowi.", photos: [], syncedAt: "2026-03-07T10:30:00Z" },
];

export const demoWeatherData: WeatherData[] = [
  { wardId: 1, wardName: "Msolwa", date: "2026-03-10", rainfallMm: 12.5, tempMaxC: 31.2, tempMinC: 22.1, droughtIndex: 0.35 },
  { wardId: 2, wardName: "Katurukila", date: "2026-03-10", rainfallMm: 8.3, tempMaxC: 30.8, tempMinC: 21.5, droughtIndex: 0.42 },
  { wardId: 3, wardName: "Kidatu", date: "2026-03-10", rainfallMm: 15.1, tempMaxC: 29.5, tempMinC: 20.8, droughtIndex: 0.28 },
  { wardId: 4, wardName: "Ichonde", date: "2026-03-10", rainfallMm: 2.1, tempMaxC: 34.5, tempMinC: 23.8, droughtIndex: 0.72 },
  { wardId: 5, wardName: "Utengule", date: "2026-03-10", rainfallMm: 3.8, tempMaxC: 33.2, tempMinC: 22.9, droughtIndex: 0.65 },
  { wardId: 6, wardName: "Igomelo", date: "2026-03-10", rainfallMm: 4.2, tempMaxC: 33.8, tempMinC: 23.2, droughtIndex: 0.61 },
];

export const recentActivity = [
  { type: "field_visit" as const, message: "Justina completed farm check in Msolwa Ujamaa", time: "2 hours ago", icon: "Sprout" },
  { type: "distribution" as const, message: "60 moringa seedlings distributed in Utengule", time: "3 hours ago", icon: "Package" },
  { type: "incident" as const, message: "Cattle incident reported near Ichonde (HIGH severity)", time: "5 hours ago", icon: "AlertTriangle" },
  { type: "survival" as const, message: "Survival check: 72% survival rate for Halima's moringa", time: "1 day ago", icon: "CheckCircle" },
  { type: "nursery" as const, message: "Batch #5 at Ichonde Nursery marked as ready (480 Grevillea)", time: "2 days ago", icon: "TreePine" },
  { type: "field_visit" as const, message: "Community meeting in Kidatu with 35 farmers", time: "3 days ago", icon: "Users" },
];

export const survivalBySpecies = [
  { species: "Mango", rate: 85 },
  { species: "Avocado", rate: 80 },
  { species: "Moringa", rate: 71 },
  { species: "Neem", rate: 63 },
  { species: "Grevillea", rate: 55 },
];

export const monthlyDistributions = [
  { month: "Sep 2025", count: 1200 },
  { month: "Oct 2025", count: 2800 },
  { month: "Nov 2025", count: 3500 },
  { month: "Dec 2025", count: 4100 },
  { month: "Jan 2026", count: 3800 },
  { month: "Feb 2026", count: 2200 },
  { month: "Mar 2026", count: 1150 },
];
