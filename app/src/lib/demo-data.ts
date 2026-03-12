import { KPISummary, Village, Farmer, SeedlingDistribution, SurvivalCheck, CropCycle, Nursery, NurseryBatch, CattleIncident, ChilliFence, ShambachunguGroup, WildlifeIncident, FieldVisit, WeatherData } from "@/types";

export const demoKPIs: KPISummary = {
  totalFarmers: 145,
  totalSeedlingsDistributed: 2400,
  averageSurvivalRate: 58,
  totalAgroforestryHectares: 12.5,
  operationalVillages: 21,
  activeCropCycles: 38,
  cattleIncidentsThisMonth: 5,
  fieldVisitsThisMonth: 15,
  activeChilliFences: 18,
  shambachunguGroups: 4,
  wildlifeIncidentsThisMonth: 6,
  elephantDeterrenceSuccessRate: 72,
};

// ── Ifakara Town Council (bordering Nyerere NP) — 9 wards, 13 villages ──
// ── Mbarali District Council (bordering Ruaha NP) — 7 wards, 8 villages ──
export const demoVillages: Village[] = [
  // Ifakara Town Council — Morogoro Region
  { id: 1, name: "Nyamwezi", wardId: 1, wardName: "Kiberege", districtName: "Ifakara TC", regionName: "Morogoro", population: 3200, isOperational: true, sector: "ifakara", distanceToNpKm: 1.5, farmerCount: 14, seedlingCount: 210, geometry: undefined },
  { id: 2, name: "Mkasu", wardId: 1, wardName: "Kiberege", districtName: "Ifakara TC", regionName: "Morogoro", population: 2100, isOperational: true, sector: "ifakara", distanceToNpKm: 2.1, farmerCount: 9, seedlingCount: 140, geometry: undefined },
  { id: 3, name: "Bwawani", wardId: 1, wardName: "Kiberege", districtName: "Ifakara TC", regionName: "Morogoro", population: 1850, isOperational: true, sector: "ifakara", distanceToNpKm: 2.8, farmerCount: 7, seedlingCount: 95, geometry: undefined },
  { id: 4, name: "Katindiuka", wardId: 2, wardName: "Katindiuka", districtName: "Ifakara TC", regionName: "Morogoro", population: 2650, isOperational: true, sector: "ifakara", distanceToNpKm: 3.4, farmerCount: 11, seedlingCount: 165, geometry: undefined },
  { id: 5, name: "Lugongole", wardId: 3, wardName: "Kibaoni", districtName: "Ifakara TC", regionName: "Morogoro", population: 1920, isOperational: true, sector: "ifakara", distanceToNpKm: 1.9, farmerCount: 8, seedlingCount: 110, geometry: undefined },
  { id: 6, name: "Mbasa", wardId: 4, wardName: "Mbasa", districtName: "Ifakara TC", regionName: "Morogoro", population: 2400, isOperational: true, sector: "ifakara", distanceToNpKm: 4.2, farmerCount: 10, seedlingCount: 130, geometry: undefined },
  { id: 7, name: "Mhelule", wardId: 5, wardName: "Mwaya", districtName: "Ifakara TC", regionName: "Morogoro", population: 1780, isOperational: true, sector: "ifakara", distanceToNpKm: 2.5, farmerCount: 7, seedlingCount: 90, geometry: undefined },
  { id: 8, name: "Mikoleko", wardId: 5, wardName: "Mwaya", districtName: "Ifakara TC", regionName: "Morogoro", population: 1550, isOperational: true, sector: "ifakara", distanceToNpKm: 3.0, farmerCount: 5, seedlingCount: 70, geometry: undefined },
  { id: 9, name: "Miwangani", wardId: 6, wardName: "Sanje", districtName: "Ifakara TC", regionName: "Morogoro", population: 2080, isOperational: true, sector: "ifakara", distanceToNpKm: 1.2, farmerCount: 9, seedlingCount: 120, geometry: undefined },
  { id: 10, name: "Mpanga", wardId: 7, wardName: "Kisawasawa", districtName: "Ifakara TC", regionName: "Morogoro", population: 1650, isOperational: true, sector: "ifakara", distanceToNpKm: 3.8, farmerCount: 6, seedlingCount: 80, geometry: undefined },
  { id: 11, name: "Msalise", wardId: 8, wardName: "Mang'ula A", districtName: "Ifakara TC", regionName: "Morogoro", population: 1420, isOperational: true, sector: "ifakara", distanceToNpKm: 2.0, farmerCount: 5, seedlingCount: 65, geometry: undefined },
  { id: 12, name: "Sagamaganga", wardId: 9, wardName: "Signal", districtName: "Ifakara TC", regionName: "Morogoro", population: 3100, isOperational: true, sector: "ifakara", distanceToNpKm: 5.1, farmerCount: 12, seedlingCount: 180, geometry: undefined },
  { id: 13, name: "Signal", wardId: 9, wardName: "Signal", districtName: "Ifakara TC", regionName: "Morogoro", population: 2850, isOperational: true, sector: "ifakara", distanceToNpKm: 4.5, farmerCount: 10, seedlingCount: 150, geometry: undefined },

  // Mbarali District Council — Mbeya Region
  { id: 14, name: "Magigiwe", wardId: 10, wardName: "Miyombweni", districtName: "Mbarali", regionName: "Mbeya", population: 1980, isOperational: true, sector: "mbarali", distanceToNpKm: 3.2, farmerCount: 5, seedlingCount: 85, geometry: undefined },
  { id: 15, name: "Mapogoro", wardId: 11, wardName: "Kiberege", districtName: "Mbarali", regionName: "Mbeya", population: 2350, isOperational: true, sector: "mbarali", distanceToNpKm: 2.5, farmerCount: 8, seedlingCount: 130, geometry: undefined },
  { id: 16, name: "Mlungu", wardId: 11, wardName: "Kiberege", districtName: "Mbarali", regionName: "Mbeya", population: 1670, isOperational: true, sector: "mbarali", distanceToNpKm: 3.8, farmerCount: 4, seedlingCount: 65, geometry: undefined },
  { id: 17, name: "Iheha", wardId: 12, wardName: "Madibira", districtName: "Mbarali", regionName: "Mbeya", population: 2700, isOperational: true, sector: "mbarali", distanceToNpKm: 4.5, farmerCount: 6, seedlingCount: 100, geometry: undefined },
  { id: 18, name: "Chalisuka", wardId: 13, wardName: "Mahango", districtName: "Mbarali", regionName: "Mbeya", population: 1540, isOperational: true, sector: "mbarali", distanceToNpKm: 2.0, farmerCount: 4, seedlingCount: 70, geometry: undefined },
  { id: 19, name: "Mwaya", wardId: 14, wardName: "Mkunywa", districtName: "Mbarali", regionName: "Mbeya", population: 1890, isOperational: true, sector: "mbarali", distanceToNpKm: 1.8, farmerCount: 5, seedlingCount: 80, geometry: undefined },
  { id: 20, name: "Ikoga Mpya", wardId: 15, wardName: "Ikoga Mpya", districtName: "Mbarali", regionName: "Mbeya", population: 2100, isOperational: true, sector: "mbarali", distanceToNpKm: 3.5, farmerCount: 6, seedlingCount: 95, geometry: undefined },
  { id: 21, name: "Nyakadete", wardId: 16, wardName: "Nyamakuyu", districtName: "Mbarali", regionName: "Mbeya", population: 1430, isOperational: true, sector: "mbarali", distanceToNpKm: 5.0, farmerCount: 4, seedlingCount: 55, geometry: undefined },
];

export const demoFarmers: Farmer[] = [
  // Ifakara TC farmers
  { id: 1, name: "Halima Mwenda", villageId: 1, villageName: "Nyamwezi", phone: "+255 712 345 678", farmLocationLat: -7.92, farmLocationLng: 36.69, farmAreaHectares: 0.4, farmingApproach: ["chilli_fencing", "agroforestry"], registeredAt: "2024-03-15", registeredBy: "Justina Kizanye" },
  { id: 2, name: "Juma Abdallah", villageId: 1, villageName: "Nyamwezi", phone: "+255 765 432 100", farmLocationLat: -7.93, farmLocationLng: 36.68, farmAreaHectares: 0.3, farmingApproach: ["chilli_fencing"], registeredAt: "2024-04-20", registeredBy: "Justina Kizanye" },
  { id: 3, name: "Grace Mushi", villageId: 4, villageName: "Katindiuka", phone: "+255 744 556 789", farmLocationLat: -7.88, farmLocationLng: 36.72, farmAreaHectares: 0.35, farmingApproach: ["agroforestry", "shambachungu"], registeredAt: "2024-06-01", registeredBy: "Irene Masonda" },
  { id: 4, name: "Mwanaisha Komba", villageId: 9, villageName: "Miwangani", phone: "+255 678 223 445", farmLocationLat: -7.78, farmLocationLng: 36.53, farmAreaHectares: 0.4, farmingApproach: ["horticulture"], registeredAt: "2025-10-05", registeredBy: "Justina Kizanye" },
  { id: 5, name: "Peter Massawe", villageId: 12, villageName: "Sagamaganga", phone: null, farmLocationLat: -7.70, farmLocationLng: 36.49, farmAreaHectares: 0.25, farmingApproach: ["shambachungu", "horticulture"], registeredAt: "2025-10-12", registeredBy: "Irene Masonda" },
  { id: 6, name: "Amina Lweno", villageId: 6, villageName: "Mbasa", phone: "+255 712 887 112", farmLocationLat: -7.85, farmLocationLng: 36.65, farmAreaHectares: 0.3, farmingApproach: ["horticulture"], registeredAt: "2025-11-20", registeredBy: "Justina Kizanye" },
  { id: 7, name: "Saidi Mchome", villageId: 5, villageName: "Lugongole", phone: "+255 755 334 221", farmLocationLat: -7.87, farmLocationLng: 36.66, farmAreaHectares: 0.2, farmingApproach: ["agroforestry"], registeredAt: "2024-05-10", registeredBy: "Irene Masonda" },
  { id: 8, name: "Rehema Ngalapa", villageId: 13, villageName: "Signal", phone: "+255 768 990 112", farmLocationLat: -7.72, farmLocationLng: 36.50, farmAreaHectares: 0.35, farmingApproach: ["horticulture", "nursery"], registeredAt: "2025-12-01", registeredBy: "Irene Masonda" },
  // Mbarali DC farmers
  { id: 9, name: "Ramadhani Kibona", villageId: 15, villageName: "Mapogoro", phone: "+255 678 901 234", farmLocationLat: -8.18, farmLocationLng: 34.60, farmAreaHectares: 0.4, farmingApproach: ["chilli_fencing", "agroforestry"], registeredAt: "2024-07-10", registeredBy: "Lilian Mihambo" },
  { id: 10, name: "Fatma Ngowi", villageId: 17, villageName: "Iheha", phone: "+255 712 999 888", farmLocationLat: -8.22, farmLocationLng: 34.51, farmAreaHectares: 0.3, farmingApproach: ["chilli_fencing"], registeredAt: "2025-11-01", registeredBy: "Lilian Mihambo" },
  { id: 11, name: "Said Mwakyusa", villageId: 14, villageName: "Magigiwe", phone: "+255 755 112 334", farmLocationLat: -8.20, farmLocationLng: 34.56, farmAreaHectares: 0.35, farmingApproach: ["agroforestry", "nursery"], registeredAt: "2024-08-10", registeredBy: "Lilian Mihambo" },
  { id: 12, name: "Anna Mhagama", villageId: 19, villageName: "Mwaya", phone: "+255 768 445 667", farmLocationLat: -8.28, farmLocationLng: 34.46, farmAreaHectares: 0.2, farmingApproach: ["shambachungu", "chilli_fencing"], registeredAt: "2025-11-15", registeredBy: "Irene Masonda" },
  { id: 13, name: "Elias Nyambo", villageId: 18, villageName: "Chalisuka", phone: "+255 712 778 990", farmLocationLat: -8.25, farmLocationLng: 34.49, farmAreaHectares: 0.4, farmingApproach: ["agroforestry", "chilli_fencing"], registeredAt: "2025-12-01", registeredBy: "Lilian Mihambo" },
  { id: 14, name: "Mariam Kapinga", villageId: 20, villageName: "Ikoga Mpya", phone: "+255 744 223 556", farmLocationLat: -8.24, farmLocationLng: 34.53, farmAreaHectares: 0.3, farmingApproach: ["horticulture"], registeredAt: "2026-01-10", registeredBy: "Lilian Mihambo" },
  { id: 15, name: "John Mwasambili", villageId: 21, villageName: "Nyakadete", phone: "+255 678 112 445", farmLocationLat: -8.30, farmLocationLng: 34.44, farmAreaHectares: 0.25, farmingApproach: ["horticulture", "agroforestry"], registeredAt: "2026-02-01", registeredBy: "Lilian Mihambo" },
];

export const demoDistributions: SeedlingDistribution[] = [
  { id: 1, farmerId: 1, farmerName: "Halima Mwenda", species: "Cocoa", quantity: 25, distributionDate: "2024-06-15", nurseryId: 1, nurseryName: "Nyamwezi Community Nursery", distributedBy: "Justina Kizanye", locationLat: -7.92, locationLng: 36.69, survivalRate: 55 },
  { id: 2, farmerId: 1, farmerName: "Halima Mwenda", species: "Chilli", quantity: 40, distributionDate: "2024-06-15", nurseryId: 1, nurseryName: "Nyamwezi Community Nursery", distributedBy: "Justina Kizanye", locationLat: -7.92, locationLng: 36.69, survivalRate: 68 },
  { id: 3, farmerId: 2, farmerName: "Juma Abdallah", species: "Chilli", quantity: 30, distributionDate: "2025-10-15", nurseryId: 1, nurseryName: "Nyamwezi Community Nursery", distributedBy: "Justina Kizanye", locationLat: -7.93, locationLng: 36.68, survivalRate: 62 },
  { id: 4, farmerId: 3, farmerName: "Grace Mushi", species: "Cocoa", quantity: 20, distributionDate: "2025-11-01", nurseryId: 2, nurseryName: "Sagamaganga Nursery", distributedBy: "Irene Masonda", locationLat: -7.88, locationLng: 36.72, survivalRate: 50 },
  { id: 5, farmerId: 9, farmerName: "Ramadhani Kibona", species: "Cocoa", quantity: 25, distributionDate: "2024-07-20", nurseryId: 3, nurseryName: "Mapogoro Nursery", distributedBy: "Lilian Mihambo", locationLat: -8.18, locationLng: 34.60, survivalRate: 42 },
  { id: 6, farmerId: 10, farmerName: "Fatma Ngowi", species: "Chilli", quantity: 35, distributionDate: "2025-12-01", nurseryId: 3, nurseryName: "Mapogoro Nursery", distributedBy: "Lilian Mihambo", locationLat: -8.22, locationLng: 34.51, survivalRate: 60 },
  { id: 7, farmerId: 11, farmerName: "Said Mwakyusa", species: "Mango", quantity: 15, distributionDate: "2024-08-20", nurseryId: 3, nurseryName: "Mapogoro Nursery", distributedBy: "Lilian Mihambo", locationLat: -8.20, locationLng: 34.56, survivalRate: 72 },
  { id: 8, farmerId: 13, farmerName: "Elias Nyambo", species: "Grevillea", quantity: 20, distributionDate: "2026-01-05", nurseryId: 3, nurseryName: "Mapogoro Nursery", distributedBy: "Lilian Mihambo", locationLat: -8.25, locationLng: 34.49, survivalRate: 48 },
];

export const demoSurvivalChecks: SurvivalCheck[] = [
  { id: 1, distributionId: 1, checkDate: "2025-12-01", survivingCount: 14, originalCount: 25, survivalRate: 55, photoUrl: null, checkedBy: "Justina Kizanye", notes: "Cocoa seedlings suffered during dry season. Many lost to drought stress." },
  { id: 2, distributionId: 2, checkDate: "2025-12-01", survivingCount: 27, originalCount: 40, survivalRate: 68, photoUrl: null, checkedBy: "Justina Kizanye", notes: "Chilli plants more drought-tolerant, some surviving for fence line" },
  { id: 3, distributionId: 5, checkDate: "2025-12-15", survivingCount: 11, originalCount: 25, survivalRate: 42, photoUrl: null, checkedBy: "Lilian Mihambo", notes: "Dry season planting in Mbarali — most cocoa seedlings did not survive. Replanting planned for April rains." },
  { id: 4, distributionId: 7, checkDate: "2026-01-10", survivingCount: 11, originalCount: 15, survivalRate: 72, photoUrl: null, checkedBy: "Lilian Mihambo", notes: "Mango seedlings showing better drought tolerance than cocoa" },
];

export const demoCropCycles: CropCycle[] = [
  { id: 1, farmerId: 1, farmerName: "Halima Mwenda", cropType: "Chilli", plantingDate: "2025-12-01", expectedHarvestDate: "2026-03-01", actualHarvestDate: null, areaHectares: 0.15, yieldKg: null },
  { id: 2, farmerId: 4, farmerName: "Mwanaisha Komba", cropType: "Onion", plantingDate: "2025-11-15", expectedHarvestDate: "2026-02-15", actualHarvestDate: "2026-02-20", areaHectares: 0.2, yieldKg: 180 },
  { id: 3, farmerId: 6, farmerName: "Amina Lweno", cropType: "Tomato", plantingDate: "2025-12-10", expectedHarvestDate: "2026-03-10", actualHarvestDate: null, areaHectares: 0.15, yieldKg: null },
  { id: 4, farmerId: 9, farmerName: "Ramadhani Kibona", cropType: "Maize", plantingDate: "2025-11-01", expectedHarvestDate: "2026-02-01", actualHarvestDate: "2026-02-05", areaHectares: 0.3, yieldKg: 320 },
  { id: 5, farmerId: 14, farmerName: "Mariam Kapinga", cropType: "Cabbage", plantingDate: "2026-01-01", expectedHarvestDate: "2026-04-01", actualHarvestDate: null, areaHectares: 0.1, yieldKg: null },
  { id: 6, farmerId: 5, farmerName: "Peter Massawe", cropType: "Tomato", plantingDate: "2026-01-10", expectedHarvestDate: "2026-04-10", actualHarvestDate: null, areaHectares: 0.15, yieldKg: null },
];

export const demoNurseries: Nursery[] = [
  { id: 1, name: "Nyamwezi Community Nursery", villageId: 1, villageName: "Nyamwezi", locationLat: -7.92, locationLng: 36.685, capacitySeedlings: 5000, waterSource: "River", managedBy: "Justina Kizanye", totalProduced: 1800, totalDistributed: 620 },
  { id: 2, name: "Sagamaganga Nursery", villageId: 12, villageName: "Sagamaganga", locationLat: -7.70, locationLng: 36.485, capacitySeedlings: 3500, waterSource: "Borehole", managedBy: "Irene Masonda", totalProduced: 1200, totalDistributed: 380 },
  { id: 3, name: "Mapogoro Nursery", villageId: 15, villageName: "Mapogoro", locationLat: -8.18, locationLng: 34.605, capacitySeedlings: 4000, waterSource: "Stream", managedBy: "Lilian Mihambo", totalProduced: 1500, totalDistributed: 450 },
];

export const demoNurseryBatches: NurseryBatch[] = [
  { id: 1, nurseryId: 1, species: "Cocoa", quantityPlanted: 300, plantingDate: "2025-08-01", germinationCount: 260, readyDate: "2025-10-01", status: "distributed" },
  { id: 2, nurseryId: 1, species: "Chilli", quantityPlanted: 400, plantingDate: "2025-08-15", germinationCount: 360, readyDate: "2025-10-15", status: "distributed" },
  { id: 3, nurseryId: 1, species: "Moringa", quantityPlanted: 250, plantingDate: "2025-09-01", germinationCount: 210, readyDate: null, status: "growing" },
  { id: 4, nurseryId: 1, species: "Cocoa", quantityPlanted: 350, plantingDate: "2026-01-15", germinationCount: 290, readyDate: null, status: "growing" },
  { id: 5, nurseryId: 2, species: "Cocoa", quantityPlanted: 300, plantingDate: "2025-07-01", germinationCount: 180, readyDate: "2025-09-15", status: "failed" },
  { id: 6, nurseryId: 2, species: "Cocoa", quantityPlanted: 400, plantingDate: "2025-12-15", germinationCount: 350, readyDate: null, status: "ready" },
  { id: 7, nurseryId: 2, species: "Moringa", quantityPlanted: 200, plantingDate: "2026-01-01", germinationCount: 170, readyDate: null, status: "growing" },
  { id: 8, nurseryId: 3, species: "Chilli", quantityPlanted: 350, plantingDate: "2025-09-01", germinationCount: 310, readyDate: "2025-11-01", status: "distributed" },
  { id: 9, nurseryId: 3, species: "Grevillea", quantityPlanted: 200, plantingDate: "2025-10-01", germinationCount: 160, readyDate: null, status: "growing" },
  { id: 10, nurseryId: 3, species: "Mango", quantityPlanted: 150, plantingDate: "2025-10-15", germinationCount: null, readyDate: null, status: "germinating" },
  { id: 11, nurseryId: 3, species: "Cocoa", quantityPlanted: 250, plantingDate: "2025-06-01", germinationCount: 140, readyDate: "2025-08-15", status: "failed" },
];

export const demoChilliFences: ChilliFence[] = [
  { id: 1, farmerId: 1, farmerName: "Halima Mwenda", villageName: "Nyamwezi", perimeterMetres: 320, chilliVariety: "Bird's Eye", installedDate: "2024-06-20", status: "active", elephantDeterrenceEvents: 5, lastCheckedDate: "2026-03-01", checkedBy: "Justina Kizanye" },
  { id: 2, farmerId: 2, farmerName: "Juma Abdallah", villageName: "Nyamwezi", perimeterMetres: 240, chilliVariety: "Bird's Eye", installedDate: "2025-10-20", status: "active", elephantDeterrenceEvents: 2, lastCheckedDate: "2026-03-01", checkedBy: "Justina Kizanye" },
  { id: 3, farmerId: 9, farmerName: "Ramadhani Kibona", villageName: "Mapogoro", perimeterMetres: 380, chilliVariety: "Habanero", installedDate: "2024-08-05", status: "active", elephantDeterrenceEvents: 7, lastCheckedDate: "2026-02-28", checkedBy: "Lilian Mihambo" },
  { id: 4, farmerId: 10, farmerName: "Fatma Ngowi", villageName: "Iheha", perimeterMetres: 200, chilliVariety: "Bird's Eye", installedDate: "2025-12-10", status: "needs_replanting", elephantDeterrenceEvents: 1, lastCheckedDate: "2026-03-05", checkedBy: "Lilian Mihambo" },
];

export const demoShambachunguGroups: ShambachunguGroup[] = [
  { id: 1, name: "Nyamwezi Pamoja", villageId: 1, villageName: "Nyamwezi", memberCount: 18, areaHectares: 2.5, crops: ["Chilli", "Onion", "Tomato"], treeSpecies: ["Cocoa", "Moringa"], formedDate: "2025-08-01", status: "active" },
  { id: 2, name: "Katindiuka Green Growers", villageId: 4, villageName: "Katindiuka", memberCount: 12, areaHectares: 1.8, crops: ["Maize", "Beans", "Chilli"], treeSpecies: ["Mango", "Grevillea"], formedDate: "2025-09-15", status: "active" },
  { id: 3, name: "Mapogoro Wildlife Farmers", villageId: 15, villageName: "Mapogoro", memberCount: 15, areaHectares: 2.0, crops: ["Chilli", "Cassava", "Groundnut"], treeSpecies: ["Cocoa", "Neem"], formedDate: "2025-10-01", status: "active" },
  { id: 4, name: "Mwaya Coexistence Group", villageId: 19, villageName: "Mwaya", memberCount: 8, areaHectares: 1.2, crops: ["Tomato", "Cabbage", "Chilli"], treeSpecies: ["Moringa", "Acacia"], formedDate: "2026-01-10", status: "forming" },
];

export const demoWildlifeIncidents: WildlifeIncident[] = [
  { id: 1, locationLat: -7.93, locationLng: 36.70, villageId: 1, villageName: "Nyamwezi", animalType: "elephant", incidentType: "crop_raid", severity: "moderate", date: "2026-02-10", description: "3 elephants entered maize field at night. Chilli fence on south border deterred further entry.", chilliFencePresent: true, deterrenceWorked: true, photoUrl: null, reportedBy: "Justina Kizanye" },
  { id: 2, locationLat: -7.89, locationLng: 36.73, villageId: 4, villageName: "Katindiuka", animalType: "elephant", incidentType: "crop_raid", severity: "high", date: "2026-02-18", description: "Herd of 5 elephants destroyed 0.2 ha of cassava. No chilli fence installed on this farm.", chilliFencePresent: false, deterrenceWorked: null, photoUrl: null, reportedBy: "Irene Masonda" },
  { id: 3, locationLat: -8.19, locationLng: 34.61, villageId: 15, villageName: "Mapogoro", animalType: "elephant", incidentType: "crop_raid", severity: "low", date: "2026-02-25", description: "Single elephant approached farm boundary. Chilli fence deterred entry, no crop damage.", chilliFencePresent: true, deterrenceWorked: true, photoUrl: null, reportedBy: "Lilian Mihambo" },
  { id: 4, locationLat: -8.23, locationLng: 34.50, villageId: 17, villageName: "Iheha", animalType: "elephant", incidentType: "property_damage", severity: "high", date: "2026-03-02", description: "Elephants damaged grain storage structure. Fence needs replanting on western side.", chilliFencePresent: true, deterrenceWorked: false, photoUrl: null, reportedBy: "Lilian Mihambo" },
  { id: 5, locationLat: -7.79, locationLng: 36.53, villageId: 9, villageName: "Miwangani", animalType: "hippo", incidentType: "crop_raid", severity: "moderate", date: "2026-03-05", description: "Hippos from river damaged rice paddy near riverbank.", chilliFencePresent: false, deterrenceWorked: null, photoUrl: null, reportedBy: "Justina Kizanye" },
  { id: 6, locationLat: -8.26, locationLng: 34.48, villageId: 18, villageName: "Chalisuka", animalType: "elephant", incidentType: "crop_raid", severity: "low", date: "2026-03-08", description: "Elephant approached chilli-fenced boundary and turned away. Zero damage.", chilliFencePresent: true, deterrenceWorked: true, photoUrl: null, reportedBy: "Lilian Mihambo" },
];

export const demoCattleIncidents: CattleIncident[] = [
  { id: 1, locationLat: -8.21, locationLng: 34.57, villageId: 14, villageName: "Magigiwe", incidentType: "restricted_grazing", severity: "high", date: "2026-02-15", estimatedHerdSize: 150, description: "Large herd grazing near Ruaha NP buffer zone", photoUrl: null, reportedBy: "Lilian Mihambo" },
  { id: 2, locationLat: -8.23, locationLng: 34.52, villageId: 17, villageName: "Iheha", incidentType: "crop_damage", severity: "moderate", date: "2026-02-18", estimatedHerdSize: 80, description: "Cattle trampled cassava fields on eastern border", photoUrl: null, reportedBy: "Lilian Mihambo" },
  { id: 3, locationLat: -8.19, locationLng: 34.59, villageId: 15, villageName: "Mapogoro", incidentType: "water_conflict", severity: "high", date: "2026-02-22", estimatedHerdSize: 200, description: "Herders blocking community water access point", photoUrl: null, reportedBy: "Lilian Mihambo" },
  { id: 4, locationLat: -8.29, locationLng: 34.45, villageId: 19, villageName: "Mwaya", incidentType: "restricted_grazing", severity: "moderate", date: "2026-03-01", estimatedHerdSize: 120, description: "Herd moving through restoration area near Ruaha boundary", photoUrl: null, reportedBy: "Lilian Mihambo" },
  { id: 5, locationLat: -8.25, locationLng: 34.48, villageId: 18, villageName: "Chalisuka", incidentType: "corridor_blockage", severity: "low", date: "2026-03-05", estimatedHerdSize: 50, description: "Small herd resting on wildlife corridor", photoUrl: null, reportedBy: "Lilian Mihambo" },
];

export const demoFieldVisits: FieldVisit[] = [
  { id: 1, userId: 1, userName: "Justina Kizanye", villageId: 1, villageName: "Nyamwezi", visitDate: "2026-03-01", visitType: "chilli_fence_check", locationLat: -7.92, locationLng: 36.69, notes: "Checked Halima's chilli fence. Active and healthy. 5th deterrence event recorded last week.", photos: [], syncedAt: "2026-03-01T14:30:00Z" },
  { id: 2, userId: 2, userName: "Irene Masonda", villageId: 12, villageName: "Sagamaganga", visitDate: "2026-03-02", visitType: "nursery_check", locationLat: -7.70, locationLng: 36.485, notes: "Cocoa batch ready for distribution. 350 seedlings available. Waiting for April rains before distributing.", photos: [], syncedAt: "2026-03-02T11:00:00Z" },
  { id: 3, userId: 3, userName: "Lilian Mihambo", villageId: 15, villageName: "Mapogoro", visitDate: "2026-03-03", visitType: "wildlife_report", locationLat: -8.19, locationLng: 34.61, notes: "Elephant approached Ramadhani's farm. Chilli fence deterred entry — no damage.", photos: [], syncedAt: "2026-03-03T09:15:00Z" },
  { id: 4, userId: 1, userName: "Justina Kizanye", villageId: 4, villageName: "Katindiuka", visitDate: "2026-03-05", visitType: "community_meeting", locationLat: -7.88, locationLng: 36.72, notes: "Shambachungu group meeting. 12 members discussed chilli planting schedule for next season.", photos: [], syncedAt: "2026-03-05T16:00:00Z" },
  { id: 5, userId: 3, userName: "Lilian Mihambo", villageId: 17, villageName: "Iheha", visitDate: "2026-03-07", visitType: "seedling_distribution", locationLat: -8.22, locationLng: 34.51, notes: "Distributed 35 chilli seedlings to Fatma Ngowi for fence replanting.", photos: [], syncedAt: "2026-03-07T10:30:00Z" },
];

export const demoWeatherData: WeatherData[] = [
  { wardId: 1, wardName: "Kiberege", date: "2026-03-10", rainfallMm: 12.5, tempMaxC: 31.2, tempMinC: 22.1, droughtIndex: 0.35 },
  { wardId: 2, wardName: "Katindiuka", date: "2026-03-10", rainfallMm: 8.3, tempMaxC: 30.8, tempMinC: 21.5, droughtIndex: 0.42 },
  { wardId: 5, wardName: "Mwaya", date: "2026-03-10", rainfallMm: 15.1, tempMaxC: 29.5, tempMinC: 20.8, droughtIndex: 0.28 },
  { wardId: 6, wardName: "Sanje", date: "2026-03-10", rainfallMm: 10.8, tempMaxC: 30.2, tempMinC: 21.8, droughtIndex: 0.38 },
  { wardId: 10, wardName: "Miyombweni", date: "2026-03-10", rainfallMm: 2.1, tempMaxC: 34.5, tempMinC: 23.8, droughtIndex: 0.72 },
  { wardId: 11, wardName: "Kiberege (Mbarali)", date: "2026-03-10", rainfallMm: 3.8, tempMaxC: 33.2, tempMinC: 22.9, droughtIndex: 0.65 },
  { wardId: 12, wardName: "Madibira", date: "2026-03-10", rainfallMm: 4.2, tempMaxC: 33.8, tempMinC: 23.2, droughtIndex: 0.61 },
  { wardId: 13, wardName: "Mahango", date: "2026-03-10", rainfallMm: 3.5, tempMaxC: 34.0, tempMinC: 23.5, droughtIndex: 0.68 },
];

export const recentActivity = [
  { type: "chilli_fence" as const, message: "Halima's chilli fence deterred elephant approach in Nyamwezi", time: "2 hours ago", icon: "Shield" },
  { type: "distribution" as const, message: "35 chilli seedlings distributed to Fatma Ngowi for fence replanting", time: "3 hours ago", icon: "Package" },
  { type: "wildlife" as const, message: "Elephant crop raid reported in Katindiuka (HIGH — no chilli fence)", time: "5 hours ago", icon: "AlertTriangle" },
  { type: "horticulture" as const, message: "Mwanaisha Komba harvested onion crop — 180 kg from 0.2 ha", time: "1 day ago", icon: "Sprout" },
  { type: "nursery" as const, message: "Cocoa batch at Sagamaganga Nursery ready — holding for April rains", time: "2 days ago", icon: "TreePine" },
  { type: "survival" as const, message: "Dry season survival check: 42% cocoa survival in Mapogoro — replanting planned", time: "3 days ago", icon: "AlertTriangle" },
];

export const survivalBySpecies = [
  { species: "Mango", rate: 72 },
  { species: "Chilli", rate: 68 },
  { species: "Moringa", rate: 62 },
  { species: "Cocoa", rate: 55 },
  { species: "Grevillea", rate: 48 },
];

export const monthlyDistributions = [
  { month: "Sep 2025", count: 0 },
  { month: "Oct 2025", count: 280 },
  { month: "Nov 2025", count: 420 },
  { month: "Dec 2025", count: 550 },
  { month: "Jan 2026", count: 480 },
  { month: "Feb 2026", count: 380 },
  { month: "Mar 2026", count: 150 },
];
