import { KPISummary, Village, Farmer, SeedlingDistribution, SurvivalCheck, CropCycle, Nursery, NurseryBatch, CattleIncident, ChilliFence, ShambachunguGroup, WildlifeIncident, FieldVisit, WeatherData, IncomeGeneratingGroup, EcoClub, RadioSession, RadioWinner } from "@/types";
import { IGA_STARTUP_CAPITAL_TSH } from "@/lib/constants";

// KPIs are computed after all data arrays are defined — see bottom of file

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
  // Ifakara TC (Msolwa sector) farmers
  { id: 1, name: "Halima Mwenda", villageId: 1, villageName: "Nyamwezi", phone: "+255 712 345 678", farmLocationLat: -7.92, farmLocationLng: 36.69, farmAreaHectares: 0.4, farmingApproach: ["chilli_fencing", "agroforestry"], registeredAt: "2024-03-15", registeredBy: "Justina Kizanye", isActive: true, droppedOutAt: null, dropoutReason: null, totalTreesPlanted: 65, treesSurviving: 36, trainingReceived: ["Chilli Fencing Techniques", "Agroforestry Basics", "Pest Management"], extensionOfficer: "Justina Kizanye", lastPOVisit: "2026-03-01" },
  { id: 2, name: "Juma Abdallah", villageId: 1, villageName: "Nyamwezi", phone: "+255 765 432 100", farmLocationLat: -7.93, farmLocationLng: 36.68, farmAreaHectares: 0.3, farmingApproach: ["chilli_fencing"], registeredAt: "2024-04-20", registeredBy: "Justina Kizanye", isActive: true, droppedOutAt: null, dropoutReason: null, totalTreesPlanted: 30, treesSurviving: 19, trainingReceived: ["Chilli Fencing Techniques", "Human-Wildlife Coexistence"], extensionOfficer: "Justina Kizanye", lastPOVisit: "2026-02-25" },
  { id: 3, name: "Grace Mushi", villageId: 4, villageName: "Katindiuka", phone: "+255 744 556 789", farmLocationLat: -7.88, farmLocationLng: 36.72, farmAreaHectares: 0.35, farmingApproach: ["agroforestry", "shambachungu"], registeredAt: "2024-06-01", registeredBy: "Irene Masonda", isActive: true, droppedOutAt: null, dropoutReason: null, totalTreesPlanted: 45, treesSurviving: 23, trainingReceived: ["Agroforestry Basics", "Group Farming / Shamba Chungu", "Cocoa Cultivation"], extensionOfficer: "Irene Masonda", lastPOVisit: "2026-03-05" },
  { id: 4, name: "Mwanaisha Komba", villageId: 9, villageName: "Miwangani", phone: "+255 678 223 445", farmLocationLat: -7.78, farmLocationLng: 36.53, farmAreaHectares: 0.4, farmingApproach: ["horticulture"], registeredAt: "2025-10-05", registeredBy: "Justina Kizanye", isActive: true, droppedOutAt: null, dropoutReason: null, totalTreesPlanted: 0, treesSurviving: 0, trainingReceived: ["Horticulture & Vegetable Farming", "Post-Harvest Handling"], extensionOfficer: "Justina Kizanye", lastPOVisit: "2026-03-08" },
  { id: 5, name: "Peter Massawe", villageId: 12, villageName: "Sagamaganga", phone: null, farmLocationLat: -7.70, farmLocationLng: 36.49, farmAreaHectares: 0.25, farmingApproach: ["shambachungu", "horticulture"], registeredAt: "2025-10-12", registeredBy: "Irene Masonda", isActive: false, droppedOutAt: "2026-02-10", dropoutReason: "Moved to a neighbouring district for family reasons", totalTreesPlanted: 15, treesSurviving: 8, trainingReceived: ["Group Farming / Shamba Chungu", "Horticulture & Vegetable Farming"], extensionOfficer: "Irene Masonda", lastPOVisit: "2026-01-15" },
  { id: 6, name: "Amina Lweno", villageId: 6, villageName: "Mbasa", phone: "+255 712 887 112", farmLocationLat: -7.85, farmLocationLng: 36.65, farmAreaHectares: 0.3, farmingApproach: ["horticulture"], registeredAt: "2025-11-20", registeredBy: "Justina Kizanye", isActive: true, droppedOutAt: null, dropoutReason: null, totalTreesPlanted: 0, treesSurviving: 0, trainingReceived: ["Horticulture & Vegetable Farming"], extensionOfficer: "Justina Kizanye", lastPOVisit: "2026-02-28" },
  { id: 7, name: "Saidi Mchome", villageId: 5, villageName: "Lugongole", phone: "+255 755 334 221", farmLocationLat: -7.87, farmLocationLng: 36.66, farmAreaHectares: 0.2, farmingApproach: ["agroforestry"], registeredAt: "2024-05-10", registeredBy: "Irene Masonda", isActive: true, droppedOutAt: null, dropoutReason: null, totalTreesPlanted: 55, treesSurviving: 40, trainingReceived: ["Agroforestry Basics", "Seedling Care & Survival", "Soil Health & Conservation"], extensionOfficer: "Irene Masonda", lastPOVisit: "2026-02-20" },
  { id: 8, name: "Rehema Ngalapa", villageId: 13, villageName: "Signal", phone: "+255 768 990 112", farmLocationLat: -7.72, farmLocationLng: 36.50, farmAreaHectares: 0.35, farmingApproach: ["horticulture", "nursery"], registeredAt: "2025-12-01", registeredBy: "Irene Masonda", isActive: true, droppedOutAt: null, dropoutReason: null, totalTreesPlanted: 20, treesSurviving: 15, trainingReceived: ["Horticulture & Vegetable Farming", "Tree Nursery Management"], extensionOfficer: "Irene Masonda", lastPOVisit: "2026-03-03" },
  // Mbarali DC (Usangu sector) farmers
  { id: 9, name: "Ramadhani Kibona", villageId: 15, villageName: "Mapogoro", phone: "+255 678 901 234", farmLocationLat: -8.18, farmLocationLng: 34.60, farmAreaHectares: 0.4, farmingApproach: ["chilli_fencing", "agroforestry"], registeredAt: "2024-07-10", registeredBy: "Lilian Mihambo", isActive: true, droppedOutAt: null, dropoutReason: null, totalTreesPlanted: 85, treesSurviving: 36, trainingReceived: ["Chilli Fencing Techniques", "Agroforestry Basics", "Cocoa Cultivation", "Human-Wildlife Coexistence"], extensionOfficer: "Lilian Mihambo", lastPOVisit: "2026-02-28" },
  { id: 10, name: "Fatma Ngowi", villageId: 17, villageName: "Iheha", phone: "+255 712 999 888", farmLocationLat: -8.22, farmLocationLng: 34.51, farmAreaHectares: 0.3, farmingApproach: ["chilli_fencing"], registeredAt: "2025-11-01", registeredBy: "Lilian Mihambo", isActive: true, droppedOutAt: null, dropoutReason: null, totalTreesPlanted: 35, treesSurviving: 21, trainingReceived: ["Chilli Fencing Techniques"], extensionOfficer: "Lilian Mihambo", lastPOVisit: "2026-03-05" },
  { id: 11, name: "Said Mwakyusa", villageId: 14, villageName: "Magigiwe", phone: "+255 755 112 334", farmLocationLat: -8.20, farmLocationLng: 34.56, farmAreaHectares: 0.35, farmingApproach: ["agroforestry", "nursery"], registeredAt: "2024-08-10", registeredBy: "Lilian Mihambo", isActive: true, droppedOutAt: null, dropoutReason: null, totalTreesPlanted: 70, treesSurviving: 50, trainingReceived: ["Agroforestry Basics", "Tree Nursery Management", "Seedling Care & Survival"], extensionOfficer: "Lilian Mihambo", lastPOVisit: "2026-02-22" },
  { id: 12, name: "Anna Mhagama", villageId: 19, villageName: "Mwaya", phone: "+255 768 445 667", farmLocationLat: -8.28, farmLocationLng: 34.46, farmAreaHectares: 0.2, farmingApproach: ["shambachungu", "chilli_fencing"], registeredAt: "2025-11-15", registeredBy: "Irene Masonda", isActive: true, droppedOutAt: null, dropoutReason: null, totalTreesPlanted: 25, treesSurviving: 13, trainingReceived: ["Group Farming / Shamba Chungu", "Chilli Fencing Techniques"], extensionOfficer: "Lilian Mihambo", lastPOVisit: "2026-03-01" },
  { id: 13, name: "Elias Nyambo", villageId: 18, villageName: "Chalisuka", phone: "+255 712 778 990", farmLocationLat: -8.25, farmLocationLng: 34.49, farmAreaHectares: 0.4, farmingApproach: ["agroforestry", "chilli_fencing"], registeredAt: "2025-12-01", registeredBy: "Lilian Mihambo", isActive: false, droppedOutAt: "2026-03-01", dropoutReason: "Elephants destroyed the entire seedling stock — farmer lost confidence", totalTreesPlanted: 40, treesSurviving: 0, trainingReceived: ["Agroforestry Basics", "Chilli Fencing Techniques"], extensionOfficer: "Lilian Mihambo", lastPOVisit: "2026-02-10" },
  { id: 14, name: "Mariam Kapinga", villageId: 20, villageName: "Ikoga Mpya", phone: "+255 744 223 556", farmLocationLat: -8.24, farmLocationLng: 34.53, farmAreaHectares: 0.3, farmingApproach: ["horticulture"], registeredAt: "2026-01-10", registeredBy: "Lilian Mihambo", isActive: true, droppedOutAt: null, dropoutReason: null, totalTreesPlanted: 0, treesSurviving: 0, trainingReceived: ["Horticulture & Vegetable Farming"], extensionOfficer: "Lilian Mihambo", lastPOVisit: "2026-02-18" },
  { id: 15, name: "John Mwasambili", villageId: 21, villageName: "Nyakadete", phone: "+255 678 112 445", farmLocationLat: -8.30, farmLocationLng: 34.44, farmAreaHectares: 0.25, farmingApproach: ["horticulture", "agroforestry"], registeredAt: "2026-02-01", registeredBy: "Lilian Mihambo", isActive: true, droppedOutAt: null, dropoutReason: null, totalTreesPlanted: 18, treesSurviving: 14, trainingReceived: ["Horticulture & Vegetable Farming", "Agroforestry Basics"], extensionOfficer: "Lilian Mihambo", lastPOVisit: "2026-02-15" },
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

// ────────────────────────────────────────────────────────────────
// IGA (Income Generating Activities) groups — brief Table 3
// Each group started with 3,500,000 TSh startup capital on average
// ────────────────────────────────────────────────────────────────

const C = IGA_STARTUP_CAPITAL_TSH;
export const demoIGAGroups: IncomeGeneratingGroup[] = [
  // Usangu (Mbarali)
  { id: 1, name: "Lion", villageId: 15, villageName: "Mapogoro", ward: "Miyombweni", sector: "mbarali", igaType: "sunflower_oil", memberCount: 14, maleCount: 2, femaleCount: 12, startupCapitalTSh: C, currentCapitalTSh: C + 650_000, revenueTSh: 4_200_000, expenseTSh: 2_800_000, status: "active", formedDate: "2024-06-10", lastFinancialUpdate: "2026-03-15", notes: "Producing sunflower oil for local market — steady demand" },
  { id: 2, name: "Tuinuane", villageId: 15, villageName: "Mapogoro", ward: "Miyombweni", sector: "mbarali", igaType: "value_addition", memberCount: 11, maleCount: 5, femaleCount: 6, startupCapitalTSh: C, currentCapitalTSh: C + 220_000, revenueTSh: 1_950_000, expenseTSh: 1_400_000, status: "active", formedDate: "2024-07-20", lastFinancialUpdate: "2026-03-10", notes: "Value addition on sunflower and groundnuts" },
  { id: 3, name: "Pamoja Tunaweza", villageId: 14, villageName: "Magigiwe", ward: "Miyombweni", sector: "mbarali", igaType: "soft_drinks", memberCount: 16, maleCount: 3, femaleCount: 13, startupCapitalTSh: C, currentCapitalTSh: C - 400_000, revenueTSh: 1_200_000, expenseTSh: 1_550_000, status: "struggling", formedDate: "2024-09-01", lastFinancialUpdate: "2026-03-12", notes: "Competition from packaged drinks — margins thin" },
  { id: 4, name: "Mafanikio", villageId: 21, villageName: "Nyakadete", ward: "Madibira", sector: "mbarali", igaType: "pig_keeping", memberCount: 22, maleCount: 4, femaleCount: 18, startupCapitalTSh: C, currentCapitalTSh: C + 1_150_000, revenueTSh: 3_800_000, expenseTSh: 2_300_000, status: "active", formedDate: "2024-05-15", lastFinancialUpdate: "2026-03-14", notes: "Strong group — expanding to 40 pigs" },
  { id: 5, name: "Tujengane", villageId: null, villageName: "Nyamakuyu", ward: "Madibira", sector: "mbarali", igaType: "pig_keeping", memberCount: 18, maleCount: 2, femaleCount: 16, startupCapitalTSh: C, currentCapitalTSh: C + 480_000, revenueTSh: 2_900_000, expenseTSh: 2_100_000, status: "active", formedDate: "2024-06-01", lastFinancialUpdate: "2026-03-08", notes: null },
  { id: 6, name: "Twiyandage", villageId: 20, villageName: "Ikoga Mpya", ward: "Madibira", sector: "mbarali", igaType: "pig_keeping", memberCount: 21, maleCount: 7, femaleCount: 14, startupCapitalTSh: C, currentCapitalTSh: C + 720_000, revenueTSh: 3_100_000, expenseTSh: 2_000_000, status: "active", formedDate: "2024-07-05", lastFinancialUpdate: "2026-03-11", notes: null },
  { id: 7, name: "Tujaliane", villageId: 17, villageName: "Iheha", ward: "Madibira", sector: "mbarali", igaType: "sunflower_oil", memberCount: 16, maleCount: 2, femaleCount: 14, startupCapitalTSh: C, currentCapitalTSh: C + 340_000, revenueTSh: 2_400_000, expenseTSh: 1_800_000, status: "active", formedDate: "2024-08-10", lastFinancialUpdate: "2026-03-09", notes: null },
  { id: 8, name: "Together", villageId: null, villageName: "Mahango", ward: "Madibira", sector: "mbarali", igaType: "pig_keeping", memberCount: 11, maleCount: 3, femaleCount: 8, startupCapitalTSh: C, currentCapitalTSh: C - 250_000, revenueTSh: 1_400_000, expenseTSh: 1_600_000, status: "struggling", formedDate: "2024-11-12", lastFinancialUpdate: "2026-03-05", notes: "Disease outbreak reduced herd — rebuilding" },
  { id: 9, name: "Mshikamano", villageId: 18, villageName: "Chalisuka", ward: "Madibira", sector: "mbarali", igaType: "pig_keeping", memberCount: 20, maleCount: 7, femaleCount: 13, startupCapitalTSh: C, currentCapitalTSh: C + 880_000, revenueTSh: 3_600_000, expenseTSh: 2_400_000, status: "active", formedDate: "2024-06-20", lastFinancialUpdate: "2026-03-13", notes: null },
  { id: 10, name: "Tuninuane", villageId: null, villageName: "Mkunywa", ward: "Madibira", sector: "mbarali", igaType: "pig_keeping", memberCount: 13, maleCount: 4, femaleCount: 9, startupCapitalTSh: C, currentCapitalTSh: C + 180_000, revenueTSh: 2_100_000, expenseTSh: 1_700_000, status: "active", formedDate: "2024-09-15", lastFinancialUpdate: "2026-03-07", notes: null },

  // Msolwa (Ifakara TC / Kilombero)
  { id: 11, name: "Upendo Katindiuka", villageId: 4, villageName: "Katindiuka", ward: "Katindiuka", sector: "ifakara", igaType: "poultry_keeping", memberCount: 26, maleCount: 12, femaleCount: 14, startupCapitalTSh: C, currentCapitalTSh: C + 1_200_000, revenueTSh: 4_500_000, expenseTSh: 2_600_000, status: "active", formedDate: "2024-05-10", lastFinancialUpdate: "2026-03-14", notes: "Largest poultry group — 320 laying hens" },
  { id: 12, name: "Mshikamano", villageId: 4, villageName: "Katindiuka", ward: "Katindiuka", sector: "ifakara", igaType: "pig_keeping", memberCount: 22, maleCount: 10, femaleCount: 12, startupCapitalTSh: C, currentCapitalTSh: C + 560_000, revenueTSh: 2_800_000, expenseTSh: 1_900_000, status: "active", formedDate: "2024-06-05", lastFinancialUpdate: "2026-03-10", notes: null },
  { id: 13, name: "Elimika", villageId: 13, villageName: "Signal", ward: "Signal", sector: "ifakara", igaType: "poultry_keeping", memberCount: 19, maleCount: 4, femaleCount: 15, startupCapitalTSh: C, currentCapitalTSh: C + 420_000, revenueTSh: 2_600_000, expenseTSh: 1_800_000, status: "active", formedDate: "2024-07-12", lastFinancialUpdate: "2026-03-08", notes: null },
  { id: 14, name: "Ukombozi", villageId: 13, villageName: "Signal", ward: "Signal", sector: "ifakara", igaType: "poultry_keeping", memberCount: 16, maleCount: 5, femaleCount: 11, startupCapitalTSh: C, currentCapitalTSh: C + 290_000, revenueTSh: 2_100_000, expenseTSh: 1_600_000, status: "active", formedDate: "2024-08-20", lastFinancialUpdate: "2026-03-11", notes: null },
  { id: 15, name: "Tujitegemee", villageId: 12, villageName: "Sagamaganga", ward: "Signal", sector: "ifakara", igaType: "poultry_keeping", memberCount: 10, maleCount: 2, femaleCount: 8, startupCapitalTSh: C, currentCapitalTSh: C + 110_000, revenueTSh: 1_500_000, expenseTSh: 1_250_000, status: "active", formedDate: "2024-10-01", lastFinancialUpdate: "2026-02-28", notes: null },
  { id: 16, name: "Faraja", villageId: 12, villageName: "Sagamaganga", ward: "Signal", sector: "ifakara", igaType: "soap_making", memberCount: 18, maleCount: 6, femaleCount: 12, startupCapitalTSh: C, currentCapitalTSh: C + 380_000, revenueTSh: 2_200_000, expenseTSh: 1_500_000, status: "active", formedDate: "2024-09-10", lastFinancialUpdate: "2026-03-06", notes: "Bar soap — selling in local markets" },
  { id: 17, name: "Tupendane", villageId: 11, villageName: "Msalise", ward: "Mang'ula", sector: "ifakara", igaType: "value_addition", memberCount: 8, maleCount: 1, femaleCount: 7, startupCapitalTSh: C, currentCapitalTSh: C - 180_000, revenueTSh: 950_000, expenseTSh: 1_100_000, status: "struggling", formedDate: "2024-11-05", lastFinancialUpdate: "2026-02-25", notes: "Small membership, weak market access" },
  { id: 18, name: "Tulindane", villageId: 11, villageName: "Msalise", ward: "Mang'ula", sector: "ifakara", igaType: "poultry_keeping", memberCount: 5, maleCount: 3, femaleCount: 2, startupCapitalTSh: C, currentCapitalTSh: C - 700_000, revenueTSh: 650_000, expenseTSh: 1_300_000, status: "struggling", formedDate: "2024-12-01", lastFinancialUpdate: "2026-02-20", notes: "Small group — considering merger with Tupendane" },
  { id: 19, name: "Mhelule", villageId: 7, villageName: "Mhelule", ward: "Mwaya", sector: "ifakara", igaType: "value_addition", memberCount: 18, maleCount: 9, femaleCount: 9, startupCapitalTSh: C, currentCapitalTSh: C + 510_000, revenueTSh: 2_700_000, expenseTSh: 1_900_000, status: "active", formedDate: "2024-08-01", lastFinancialUpdate: "2026-03-04", notes: null },
  { id: 20, name: "Tutunze Mazingira", villageId: 8, villageName: "Mikoleko", ward: "Mwaya", sector: "ifakara", igaType: "bicycle", memberCount: 17, maleCount: 7, femaleCount: 10, startupCapitalTSh: C, currentCapitalTSh: C + 230_000, revenueTSh: 2_100_000, expenseTSh: 1_750_000, status: "active", formedDate: "2024-09-20", lastFinancialUpdate: "2026-03-02", notes: "Bicycle transport services for villagers" },
  { id: 21, name: "Mazingira Foundation", villageId: 8, villageName: "Mikoleko", ward: "Mwaya", sector: "ifakara", igaType: "value_addition", memberCount: 17, maleCount: 5, femaleCount: 12, startupCapitalTSh: C, currentCapitalTSh: C + 690_000, revenueTSh: 2_900_000, expenseTSh: 1_900_000, status: "active", formedDate: "2024-07-15", lastFinancialUpdate: "2026-03-12", notes: null },
  { id: 22, name: "Jihendeleze", villageId: 9, villageName: "Miwangani", ward: "Sanje", sector: "ifakara", igaType: "value_addition", memberCount: 0, maleCount: 0, femaleCount: 0, startupCapitalTSh: C, currentCapitalTSh: 0, revenueTSh: 0, expenseTSh: 0, status: "inactive", formedDate: "2024-10-10", lastFinancialUpdate: null, notes: "Group disbanded — members moved to Mwanzo bora" },
  { id: 23, name: "Mwanzo bora", villageId: 9, villageName: "Miwangani", ward: "Sanje", sector: "ifakara", igaType: "value_addition", memberCount: 0, maleCount: 0, femaleCount: 0, startupCapitalTSh: C, currentCapitalTSh: 0, revenueTSh: 0, expenseTSh: 0, status: "inactive", formedDate: "2024-11-01", lastFinancialUpdate: null, notes: "Not yet operational — forming committee" },
  { id: 24, name: "Nguvumoja", villageId: 5, villageName: "Lungongole", ward: "Kibaoni", sector: "ifakara", igaType: "value_addition", memberCount: 12, maleCount: 12, femaleCount: 0, startupCapitalTSh: C, currentCapitalTSh: C + 320_000, revenueTSh: 2_000_000, expenseTSh: 1_500_000, status: "active", formedDate: "2024-09-05", lastFinancialUpdate: "2026-03-09", notes: null },
  { id: 25, name: "Mshikamano", villageId: 5, villageName: "Lungongole", ward: "Kibaoni", sector: "ifakara", igaType: "poultry_keeping", memberCount: 12, maleCount: 0, femaleCount: 12, startupCapitalTSh: C, currentCapitalTSh: C + 400_000, revenueTSh: 2_200_000, expenseTSh: 1_600_000, status: "active", formedDate: "2024-10-15", lastFinancialUpdate: "2026-03-07", notes: "Women-only poultry group" },
  { id: 26, name: "Umoja ni Nguvu", villageId: 6, villageName: "Mbasa", ward: "Mbasa", sector: "ifakara", igaType: "poultry_keeping", memberCount: 6, maleCount: 0, femaleCount: 6, startupCapitalTSh: C, currentCapitalTSh: C - 50_000, revenueTSh: 1_100_000, expenseTSh: 1_100_000, status: "struggling", formedDate: "2024-12-10", lastFinancialUpdate: "2026-02-24", notes: "Small group — slow start" },
  { id: 27, name: "Mshikamano - Mbasa", villageId: 6, villageName: "Mbasa", ward: "Mbasa", sector: "ifakara", igaType: "poultry_keeping", memberCount: 5, maleCount: 2, femaleCount: 3, startupCapitalTSh: C, currentCapitalTSh: C - 120_000, revenueTSh: 900_000, expenseTSh: 1_000_000, status: "struggling", formedDate: "2025-01-08", lastFinancialUpdate: "2026-02-28", notes: null },
  { id: 28, name: "Tujikwamue", villageId: 1, villageName: "Nyamwezi", ward: "Kiberege", sector: "ifakara", igaType: "value_addition", memberCount: 15, maleCount: 7, femaleCount: 8, startupCapitalTSh: C, currentCapitalTSh: C + 600_000, revenueTSh: 2_800_000, expenseTSh: 1_900_000, status: "active", formedDate: "2024-08-15", lastFinancialUpdate: "2026-03-11", notes: null },
  { id: 29, name: "Tumaini Africa", villageId: 1, villageName: "Nyamwezi", ward: "Kiberege", sector: "ifakara", igaType: "value_addition", memberCount: 12, maleCount: 3, femaleCount: 9, startupCapitalTSh: C, currentCapitalTSh: C + 410_000, revenueTSh: 2_300_000, expenseTSh: 1_700_000, status: "active", formedDate: "2024-09-25", lastFinancialUpdate: "2026-03-06", notes: null },
  { id: 30, name: "Upendo Bwawani", villageId: 3, villageName: "Bwawani", ward: "Kiberege", sector: "ifakara", igaType: "soap_making", memberCount: 11, maleCount: 0, femaleCount: 11, startupCapitalTSh: C, currentCapitalTSh: C + 170_000, revenueTSh: 1_700_000, expenseTSh: 1_400_000, status: "active", formedDate: "2024-10-05", lastFinancialUpdate: "2026-03-03", notes: "Women-only soap making group" },
  { id: 31, name: "Mshikamano - Bwawani", villageId: 3, villageName: "Bwawani", ward: "Kiberege", sector: "ifakara", igaType: "value_addition", memberCount: 11, maleCount: 0, femaleCount: 11, startupCapitalTSh: C, currentCapitalTSh: C + 260_000, revenueTSh: 1_850_000, expenseTSh: 1_450_000, status: "active", formedDate: "2024-11-12", lastFinancialUpdate: "2026-03-08", notes: null },
  { id: 32, name: "Mishemishe", villageId: 2, villageName: "Mkasu", ward: "Mkasu", sector: "ifakara", igaType: "poultry_keeping", memberCount: 14, maleCount: 7, femaleCount: 7, startupCapitalTSh: C, currentCapitalTSh: C + 490_000, revenueTSh: 2_400_000, expenseTSh: 1_700_000, status: "active", formedDate: "2024-07-10", lastFinancialUpdate: "2026-03-13", notes: null },
  { id: 33, name: "Utulivu", villageId: 2, villageName: "Mkasu", ward: "Mkasu", sector: "ifakara", igaType: "value_addition", memberCount: 11, maleCount: 0, femaleCount: 11, startupCapitalTSh: C, currentCapitalTSh: C + 340_000, revenueTSh: 2_000_000, expenseTSh: 1_550_000, status: "active", formedDate: "2024-10-20", lastFinancialUpdate: "2026-03-05", notes: null },
  { id: 34, name: "Umoja ni nguvu - Mpanga", villageId: 10, villageName: "Mpanga", ward: "Kisawasawa", sector: "ifakara", igaType: "poultry_keeping", memberCount: 11, maleCount: 9, femaleCount: 2, startupCapitalTSh: C, currentCapitalTSh: C + 280_000, revenueTSh: 1_900_000, expenseTSh: 1_500_000, status: "active", formedDate: "2024-09-18", lastFinancialUpdate: "2026-03-09", notes: null },
  { id: 35, name: "Mshikamano - Mpanga", villageId: 10, villageName: "Mpanga", ward: "Kisawasawa", sector: "ifakara", igaType: "poultry_keeping", memberCount: 13, maleCount: 6, femaleCount: 7, startupCapitalTSh: C, currentCapitalTSh: C + 360_000, revenueTSh: 2_100_000, expenseTSh: 1_600_000, status: "active", formedDate: "2024-10-25", lastFinancialUpdate: "2026-03-10", notes: null },
];

// ────────────────────────────────────────────────────────────────
// Eco Clubs — brief Table 1 (30 schools, 2 teachers per school, 15M+15F per club)
// ────────────────────────────────────────────────────────────────

export const demoEcoClubs: EcoClub[] = [
  // Usangu (Mbarali)
  { id: 1, schoolName: "Mlungu", villageName: "Mlungu", ward: "Miyombweni", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mwakinyele", "Ms. Mbilinyi"], sessionsCompleted: 14, ecoSafariParticipants: 3, active: true },
  { id: 2, schoolName: "Msangaji", villageName: "Mlungu", ward: "Miyombweni", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Sanga", "Ms. Mhagama"], sessionsCompleted: 12, ecoSafariParticipants: 4, active: true },
  { id: 3, schoolName: "Mapogoro", villageName: "Mapogoro", ward: "Miyombweni", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Kibona", "Ms. Sanga"], sessionsCompleted: 16, ecoSafariParticipants: 5, active: true },
  { id: 4, schoolName: "Mapogoro B", villageName: "Mapogoro", ward: "Miyombweni", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mhagama", "Ms. Nkosi"], sessionsCompleted: 13, ecoSafariParticipants: 2, active: true },
  { id: 5, schoolName: "Magigiwe", villageName: "Magigiwe", ward: "Miyombweni", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mwanisha", "Ms. Komba"], sessionsCompleted: 15, ecoSafariParticipants: 3, active: true },
  { id: 6, schoolName: "Nyakadete", villageName: "Nyakadete", ward: "Madibira", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mkwivila", "Ms. Ngeleja"], sessionsCompleted: 11, ecoSafariParticipants: 4, active: true },
  { id: 7, schoolName: "Nyamakuyu", villageName: "Nyamakuyu", ward: "Madibira", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Ngeleja", "Ms. Mshangama"], sessionsCompleted: 10, ecoSafariParticipants: 3, active: true },
  { id: 8, schoolName: "Ikoga Mpya", villageName: "Ikoga Mpya", ward: "Madibira", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Kapinga", "Ms. Kibona"], sessionsCompleted: 12, ecoSafariParticipants: 4, active: true },
  { id: 9, schoolName: "Iheha", villageName: "Iheha", ward: "Madibira", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Ngowi", "Ms. Msaba"], sessionsCompleted: 13, ecoSafariParticipants: 5, active: true },
  { id: 10, schoolName: "Mahango", villageName: "Mahango", ward: "Madibira", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mchome", "Ms. Ndunguru"], sessionsCompleted: 14, ecoSafariParticipants: 3, active: true },
  { id: 11, schoolName: "Chalisuka", villageName: "Chalisuka", ward: "Madibira", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mdeme", "Ms. Mwalongo"], sessionsCompleted: 11, ecoSafariParticipants: 2, active: true },
  { id: 12, schoolName: "Mkunywa", villageName: "Mkunywa", ward: "Madibira", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Juma", "Ms. Haule"], sessionsCompleted: 9, ecoSafariParticipants: 3, active: true },
  { id: 13, schoolName: "Kanamalenga", villageName: "Mkunywa", ward: "Madibira", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mwasiti", "Ms. Kiponda"], sessionsCompleted: 10, ecoSafariParticipants: 2, active: true },
  { id: 14, schoolName: "Madibira", villageName: "Mkunywa", ward: "Madibira", district: "Mbarali", region: "Mbeya", sector: "mbarali", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mfungi", "Ms. Dawa"], sessionsCompleted: 12, ecoSafariParticipants: 3, active: true },

  // Msolwa (Ifakara / Kilombero)
  { id: 15, schoolName: "Katindiuka B", villageName: "Katindiuka B", ward: "Katindiuka", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mushi", "Ms. Mdeki"], sessionsCompleted: 15, ecoSafariParticipants: 4, active: true },
  { id: 16, schoolName: "Signal", villageName: "Signal", ward: "Signal", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Ngalapa", "Ms. Haji"], sessionsCompleted: 16, ecoSafariParticipants: 5, active: true },
  { id: 17, schoolName: "Mbalaji", villageName: "Mbalaji", ward: "Signal", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Sam", "Ms. Mpondaki"], sessionsCompleted: 13, ecoSafariParticipants: 3, active: true },
  { id: 18, schoolName: "Sagamaganga", villageName: "Sagamaganga", ward: "Signal", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Massawe", "Ms. Mchome"], sessionsCompleted: 14, ecoSafariParticipants: 4, active: true },
  { id: 19, schoolName: "Msalise", villageName: "Msalise", ward: "Mang'ula", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Ngeleji", "Ms. Mshanga"], sessionsCompleted: 11, ecoSafariParticipants: 3, active: true },
  { id: 20, schoolName: "Mhelule", villageName: "Mhelule", ward: "Mwaya", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Haji", "Ms. Mdeme"], sessionsCompleted: 12, ecoSafariParticipants: 3, active: true },
  { id: 21, schoolName: "Mikoleko", villageName: "Mikoleko", ward: "Mwaya", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Haule", "Ms. Mwalongi"], sessionsCompleted: 13, ecoSafariParticipants: 4, active: true },
  { id: 22, schoolName: "Miwangani", villageName: "Miwangani", ward: "Sanje", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Komba", "Ms. Mwasiti Chuma"], sessionsCompleted: 14, ecoSafariParticipants: 4, active: true },
  { id: 23, schoolName: "Lungongole", villageName: "Lungongole", ward: "Kibaoni", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mchome", "Ms. Mkwawa"], sessionsCompleted: 15, ecoSafariParticipants: 5, active: true },
  { id: 24, schoolName: "Mbasa", villageName: "Mbasa", ward: "Mbasa", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Lweno", "Ms. Msaba"], sessionsCompleted: 12, ecoSafariParticipants: 3, active: true },
  { id: 25, schoolName: "Maendeleo", villageName: "Mbasa", ward: "Mbasa", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mfungi", "Ms. Ngowi"], sessionsCompleted: 11, ecoSafariParticipants: 2, active: true },
  { id: 26, schoolName: "Sabasaba", villageName: "Nyamwezi", ward: "Kiberege", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mwenda", "Ms. Abdallah"], sessionsCompleted: 16, ecoSafariParticipants: 5, active: true },
  { id: 27, schoolName: "Nanenane", villageName: "Nyamwezi", ward: "Kiberege", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Abdallah", "Ms. Mwenda"], sessionsCompleted: 14, ecoSafariParticipants: 4, active: true },
  { id: 28, schoolName: "Bwawani", villageName: "Bwawani", ward: "Kiberege", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Sam", "Ms. Mwalongi"], sessionsCompleted: 13, ecoSafariParticipants: 3, active: true },
  { id: 29, schoolName: "Mkasu", villageName: "Mkasu", ward: "Mkasu", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mpondaki", "Ms. Haul"], sessionsCompleted: 12, ecoSafariParticipants: 3, active: true },
  { id: 30, schoolName: "Kadenge", villageName: "Mpanga", ward: "Kisawasawa", district: "Kilombero", region: "Morogoro", sector: "ifakara", maleCount: 15, femaleCount: 15, teachers: ["Mr. Mdeki", "Ms. Sarafina"], sessionsCompleted: 11, ecoSafariParticipants: 2, active: true },
];

// ────────────────────────────────────────────────────────────────
// Uhifadhi na Jamii Radio Program — 45 sessions in 2025 on Pambazuko Radio
// Fridays 6:30-7:00 PM (30 min). Sample recent sessions shown.
// ────────────────────────────────────────────────────────────────

export const demoRadioSessions: RadioSession[] = [
  { id: 1, airDate: "2026-03-07", topic: "Chilli Fencing: A Nature-Based Solution to Elephant Crop Raids", guestSpeaker: "Lilian Mihambo", guestOrganization: "Six Rivers Africa", sector: "both", notes: "Live call-in from 3 farmers in Mapogoro" },
  { id: 2, airDate: "2026-02-28", topic: "Shamba Chungu Group Farming — Benefits & Lessons Learned", guestSpeaker: "Irene Masonda", guestOrganization: "Six Rivers Africa", sector: "ifakara", notes: null },
  { id: 3, airDate: "2026-02-21", topic: "Managing Cattle Pressure Near Ruaha NP", guestSpeaker: "Mr. Nzunda", guestOrganization: "TAWA Ruaha", sector: "mbarali", notes: "Strong listener engagement from herders" },
  { id: 4, airDate: "2026-02-14", topic: "Seedling Survival in the Dry Season", guestSpeaker: "Justina Kizanye", guestOrganization: "Six Rivers Africa", sector: "ifakara", notes: null },
  { id: 5, airDate: "2026-02-07", topic: "Human-Wildlife Coexistence: Why It Matters for Food Security", guestSpeaker: "Mary Marandu", guestOrganization: "Six Rivers Africa", sector: "both", notes: null },
  { id: 6, airDate: "2026-01-31", topic: "Tree Nurseries as Community Assets", guestSpeaker: "Thomas Barnes", guestOrganization: "Six Rivers Africa", sector: "both", notes: null },
  { id: 7, airDate: "2026-01-24", topic: "Pig Keeping — IGA Success Stories from Madibira", guestSpeaker: "Chairperson, Mafanikio Group", guestOrganization: "Mafanikio IGA", sector: "mbarali", notes: null },
  { id: 8, airDate: "2026-01-17", topic: "Cocoa Agroforestry — 3 Years On", guestSpeaker: "Ramadhani Kibona", guestOrganization: "Farmer, Mapogoro", sector: "mbarali", notes: null },
  { id: 9, airDate: "2026-01-10", topic: "Eco Clubs in Our Schools", guestSpeaker: "Mr. Mwakinyele", guestOrganization: "Mlungu Primary School", sector: "mbarali", notes: null },
  { id: 10, airDate: "2026-01-03", topic: "Horticulture and Short-Cycle Crops", guestSpeaker: "Mwanaisha Komba", guestOrganization: "Farmer, Miwangani", sector: "ifakara", notes: null },
];

// 26 radio winners from brief Table 4 (real names)
export const demoRadioWinners: RadioWinner[] = [
  { id: 1, name: "Asha Mkwivila", village: "Nyakadete", sector: "mbarali", gender: "female", sessionDate: "2025-09-12", prize: "Solar lamp" },
  { id: 2, name: "Peter Ngeleja", village: "Nyamakuyu", sector: "mbarali", gender: "male", sessionDate: "2025-09-19", prize: "Solar lamp" },
  { id: 3, name: "Neema Mshangama", village: "Mkunywa", sector: "mbarali", gender: "female", sessionDate: "2025-09-26", prize: "Kitchen set" },
  { id: 4, name: "Jose Mdeme", village: "Chalisuka", sector: "mbarali", gender: "male", sessionDate: "2025-10-03", prize: "Solar lamp" },
  { id: 5, name: "Grori Mchome", village: "Chalisuka", sector: "mbarali", gender: "female", sessionDate: "2025-10-10", prize: "Kitchen set" },
  { id: 6, name: "Hamisi Mwasiti", village: "Mkunywa", sector: "mbarali", gender: "male", sessionDate: "2025-10-17", prize: "Solar lamp" },
  { id: 7, name: "Sarafina Mwalongo", village: "Mapogoro", sector: "mbarali", gender: "female", sessionDate: "2025-10-24", prize: "Solar lamp" },
  { id: 8, name: "Daniel Kiponda", village: "Mapogoro", sector: "mbarali", gender: "male", sessionDate: "2025-10-31", prize: "Kitchen set" },
  { id: 9, name: "Na Haule", village: "Mkunywa", sector: "mbarali", gender: "female", sessionDate: "2025-11-07", prize: "Solar lamp" },
  { id: 10, name: "Mvungi Juma", village: "Mkunywa", sector: "mbarali", gender: "male", sessionDate: "2025-11-14", prize: "Kitchen set" },
  { id: 11, name: "Asha Mkwawa", village: "Kisawasawa", sector: "ifakara", gender: "female", sessionDate: "2025-11-21", prize: "Solar lamp" },
  { id: 12, name: "Peter Haji", village: "Mhelule", sector: "ifakara", gender: "male", sessionDate: "2025-11-28", prize: "Solar lamp" },
  { id: 13, name: "Neema Msaba", village: "Mbasa", sector: "ifakara", gender: "female", sessionDate: "2025-12-05", prize: "Kitchen set" },
  { id: 14, name: "John Mdeki", village: "Katindiuka", sector: "ifakara", gender: "male", sessionDate: "2025-12-12", prize: "Solar lamp" },
  { id: 15, name: "Grace Mchomoe", village: "Lugongole", sector: "ifakara", gender: "female", sessionDate: "2025-12-19", prize: "Kitchen set" },
  { id: 16, name: "Hamis Sam", village: "Bwawani", sector: "ifakara", gender: "male", sessionDate: "2026-01-03", prize: "Solar lamp" },
  { id: 17, name: "Sara Mwalongi", village: "Bwawani", sector: "ifakara", gender: "female", sessionDate: "2026-01-10", prize: "Kitchen set" },
  { id: 18, name: "Daniel Mpondaki", village: "Kisawasawa", sector: "ifakara", gender: "male", sessionDate: "2026-01-17", prize: "Solar lamp" },
  { id: 19, name: "Mary Haul", village: "Katindiuka", sector: "ifakara", gender: "female", sessionDate: "2026-01-24", prize: "Kitchen set" },
  { id: 20, name: "Juma Mfungi", village: "Mbasa", sector: "ifakara", gender: "male", sessionDate: "2026-01-31", prize: "Solar lamp" },
  { id: 21, name: "Peter Ngeleji", village: "Msalise", sector: "ifakara", gender: "male", sessionDate: "2026-02-07", prize: "Kitchen set" },
  { id: 22, name: "Neema Mshanga", village: "Msalise", sector: "ifakara", gender: "female", sessionDate: "2026-02-14", prize: "Solar lamp" },
  { id: 23, name: "Johi Mdeme", village: "Mhelule", sector: "ifakara", gender: "male", sessionDate: "2026-02-21", prize: "Kitchen set" },
  { id: 24, name: "Graci Mchome", village: "Signal", sector: "ifakara", gender: "female", sessionDate: "2026-02-28", prize: "Solar lamp" },
  { id: 25, name: "Hamis Mwasiti Chuma", village: "Bwawani", sector: "ifakara", gender: "male", sessionDate: "2026-03-07", prize: "Kitchen set" },
  { id: 26, name: "Sara Dawa", village: "Mwaya", sector: "ifakara", gender: "female", sessionDate: "2026-03-14", prize: "Solar lamp" },
];

export const RADIO_PROGRAMME_META = {
  name: "Uhifadhi na Jamii",
  station: "Pambazuko Radio",
  slot: "Fridays 6:30 – 7:00 PM",
  durationMin: 30,
  sessionsAired2025: 45,
} as const;

// ── Computed KPIs (derived from the arrays above so numbers always match) ──

const _activeFences = demoChilliFences.filter((f) => f.status === "active");
const _fencedIncidents = demoWildlifeIncidents.filter((i) => i.chilliFencePresent);
const _deterredIncidents = _fencedIncidents.filter((i) => i.deterrenceWorked);
const _agroPlotArea = 1.1; // from demoPlots in farming page (0.3+0.25+0.35+0.2)
const _shambArea = demoShambachunguGroups.reduce((s, g) => s + g.areaHectares, 0);
const _activeFarmers = demoFarmers.filter((f) => f.isActive);
const _droppedOutFarmers = demoFarmers.filter((f) => !f.isActive);
const _activeIGA = demoIGAGroups.filter((g) => g.status === "active");
const _ecoStudents = demoEcoClubs.reduce((s, c) => s + c.maleCount + c.femaleCount, 0);

export const demoKPIs: KPISummary = {
  totalFarmers: demoVillages.reduce((s, v) => s + v.farmerCount, 0),
  activeFarmers: Math.max(
    _activeFarmers.length,
    Math.round(demoVillages.reduce((s, v) => s + v.farmerCount, 0) * (_activeFarmers.length / demoFarmers.length))
  ),
  droppedOutFarmers: Math.round(demoVillages.reduce((s, v) => s + v.farmerCount, 0) * (_droppedOutFarmers.length / demoFarmers.length)),
  totalTreesPlanted: demoFarmers.reduce((s, f) => s + f.totalTreesPlanted, 0),
  totalTreesSurviving: demoFarmers.reduce((s, f) => s + f.treesSurviving, 0),
  totalSeedlingsDistributed: demoVillages.reduce((s, v) => s + v.seedlingCount, 0),
  averageSurvivalRate: Math.round(
    demoSurvivalChecks.reduce((s, c) => s + c.survivalRate, 0) / demoSurvivalChecks.length
  ),
  totalAgroforestryHectares: Math.round((_agroPlotArea + _shambArea) * 10) / 10,
  operationalVillages: demoVillages.length,
  activeCropCycles: demoCropCycles.filter((c) => !c.actualHarvestDate).length,
  cattleIncidentsThisMonth: demoCattleIncidents.length,
  fieldVisitsThisMonth: demoFieldVisits.length,
  activeChilliFences: _activeFences.length,
  shambachunguGroups: demoShambachunguGroups.length,
  wildlifeIncidentsThisMonth: demoWildlifeIncidents.length,
  elephantDeterrenceSuccessRate: _fencedIncidents.length > 0
    ? Math.round((_deterredIncidents.length / _fencedIncidents.length) * 100)
    : 0,
  activeIGAGroups: _activeIGA.length,
  totalIGAGroups: demoIGAGroups.length,
  totalIGACapitalTSh: demoIGAGroups.reduce((s, g) => s + g.currentCapitalTSh, 0),
  totalIGARevenueTSh: demoIGAGroups.reduce((s, g) => s + g.revenueTSh, 0),
  ecoClubSchools: demoEcoClubs.length,
  ecoClubStudents: _ecoStudents,
  radioSessionsAired: RADIO_PROGRAMME_META.sessionsAired2025,
};
