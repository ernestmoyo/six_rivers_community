/**
 * Data snapshot builder — turns the app's demo + live data into a compact
 * JSON structure the LLM can reason about. Used by the "Ask the data" chat.
 */

import {
  demoVillages,
  demoFarmers,
  demoIGAGroups,
  demoEcoClubs,
  demoShambachunguGroups,
  demoChilliFences,
  demoWildlifeIncidents,
  demoCattleIncidents,
  demoFieldVisits,
  demoDistributions,
  demoNurseries,
  survivalBySpecies,
  demoKPIs,
  RADIO_PROGRAMME_META,
} from "@/lib/demo-data";

export interface DataSnapshot {
  meta: {
    programme: string;
    sectors: string[];
    reportingPeriod: string;
    generatedAt: string;
  };
  kpis: typeof demoKPIs;
  villages: Array<{
    name: string;
    sector: string;
    ward: string;
    farmerCount: number;
    seedlingCount: number;
    distanceToNpKm: number | null;
  }>;
  farmers: {
    total: number;
    active: number;
    droppedOut: number;
    dropoutReasons: string[];
    totalTreesPlanted: number;
    totalTreesSurviving: number;
    survivalPct: number;
  };
  iga: {
    totalGroups: number;
    activeGroups: number;
    strugglingGroups: string[]; // group names
    inactiveGroups: string[];
    totalCapitalTSh: number;
    totalRevenueTSh: number;
    totalExpenseTSh: number;
    topByRevenue: Array<{ name: string; village: string; revenue: number }>;
    bottomByNet: Array<{ name: string; village: string; net: number }>;
  };
  ecoClubs: {
    schoolCount: number;
    totalStudents: number;
    maleStudents: number;
    femaleStudents: number;
    avgSessions: number;
    safariParticipants: number;
  };
  radio: {
    programme: string;
    sessionsAired2025: number;
  };
  wildlife: {
    incidentsThisMonth: number;
    byAnimal: Record<string, number>;
    chilliFencesActive: number;
    deterrenceSuccessPct: number;
  };
  cattle: {
    incidentsThisMonth: number;
    highSeverity: number;
    byType: Record<string, number>;
  };
  fieldVisits: {
    thisMonth: number;
    byOfficer: Record<string, number>;
    byType: Record<string, number>;
  };
  species: Array<{ species: string; survivalRatePct: number }>;
  nurseries: Array<{ name: string; village: string; produced: number; distributed: number }>;
}

export function buildDataSnapshot(): DataSnapshot {
  const activeFarmers = demoFarmers.filter((f) => f.isActive).length;
  const droppedOutFarmers = demoFarmers.filter((f) => !f.isActive);
  const totalTreesPlanted = demoFarmers.reduce((s, f) => s + f.totalTreesPlanted, 0);
  const totalTreesSurviving = demoFarmers.reduce((s, f) => s + f.treesSurviving, 0);

  const active = demoIGAGroups.filter((g) => g.status === "active");
  const struggling = demoIGAGroups.filter((g) => g.status === "struggling");
  const inactive = demoIGAGroups.filter((g) => g.status === "inactive");
  const topByRevenue = [...demoIGAGroups]
    .sort((a, b) => b.revenueTSh - a.revenueTSh)
    .slice(0, 3)
    .map((g) => ({ name: g.name, village: g.villageName, revenue: g.revenueTSh }));
  const bottomByNet = [...demoIGAGroups]
    .map((g) => ({
      name: g.name,
      village: g.villageName,
      net: g.revenueTSh - g.expenseTSh,
    }))
    .sort((a, b) => a.net - b.net)
    .slice(0, 3);

  const wildlifeByAnimal = demoWildlifeIncidents.reduce<Record<string, number>>((acc, w) => {
    acc[w.animalType] = (acc[w.animalType] || 0) + 1;
    return acc;
  }, {});

  const cattleByType = demoCattleIncidents.reduce<Record<string, number>>((acc, c) => {
    acc[c.incidentType] = (acc[c.incidentType] || 0) + 1;
    return acc;
  }, {});

  const fvByOfficer = demoFieldVisits.reduce<Record<string, number>>((acc, v) => {
    acc[v.userName] = (acc[v.userName] || 0) + 1;
    return acc;
  }, {});
  const fvByType = demoFieldVisits.reduce<Record<string, number>>((acc, v) => {
    acc[v.visitType] = (acc[v.visitType] || 0) + 1;
    return acc;
  }, {});

  const ecoMale = demoEcoClubs.reduce((s, c) => s + c.maleCount, 0);
  const ecoFemale = demoEcoClubs.reduce((s, c) => s + c.femaleCount, 0);
  const ecoSessions = Math.round(
    demoEcoClubs.reduce((s, c) => s + c.sessionsCompleted, 0) / demoEcoClubs.length
  );
  const ecoSafari = demoEcoClubs.reduce((s, c) => s + c.ecoSafariParticipants, 0);

  return {
    meta: {
      programme: "Six Rivers Africa Community Programme",
      sectors: ["Msolwa (Ifakara TC)", "Usangu (Mbarali DC)"],
      reportingPeriod: "Q1 2026 (January – March)",
      generatedAt: new Date().toISOString(),
    },
    kpis: demoKPIs,
    villages: demoVillages.map((v) => ({
      name: v.name,
      sector: v.sector === "ifakara" ? "Msolwa" : "Usangu",
      ward: v.wardName,
      farmerCount: v.farmerCount,
      seedlingCount: v.seedlingCount,
      distanceToNpKm: v.distanceToNpKm,
    })),
    farmers: {
      total: demoFarmers.length,
      active: activeFarmers,
      droppedOut: droppedOutFarmers.length,
      dropoutReasons: droppedOutFarmers
        .map((f) => f.dropoutReason)
        .filter((r): r is string => !!r),
      totalTreesPlanted,
      totalTreesSurviving,
      survivalPct:
        totalTreesPlanted > 0
          ? Math.round((totalTreesSurviving / totalTreesPlanted) * 100)
          : 0,
    },
    iga: {
      totalGroups: demoIGAGroups.length,
      activeGroups: active.length,
      strugglingGroups: struggling.map((g) => `${g.name} (${g.villageName})`),
      inactiveGroups: inactive.map((g) => `${g.name} (${g.villageName})`),
      totalCapitalTSh: demoIGAGroups.reduce((s, g) => s + g.currentCapitalTSh, 0),
      totalRevenueTSh: demoIGAGroups.reduce((s, g) => s + g.revenueTSh, 0),
      totalExpenseTSh: demoIGAGroups.reduce((s, g) => s + g.expenseTSh, 0),
      topByRevenue,
      bottomByNet,
    },
    ecoClubs: {
      schoolCount: demoEcoClubs.length,
      totalStudents: ecoMale + ecoFemale,
      maleStudents: ecoMale,
      femaleStudents: ecoFemale,
      avgSessions: ecoSessions,
      safariParticipants: ecoSafari,
    },
    radio: {
      programme: RADIO_PROGRAMME_META.name,
      sessionsAired2025: RADIO_PROGRAMME_META.sessionsAired2025,
    },
    wildlife: {
      incidentsThisMonth: demoWildlifeIncidents.length,
      byAnimal: wildlifeByAnimal,
      chilliFencesActive: demoChilliFences.filter((f) => f.status === "active").length,
      deterrenceSuccessPct: demoKPIs.elephantDeterrenceSuccessRate,
    },
    cattle: {
      incidentsThisMonth: demoCattleIncidents.length,
      highSeverity: demoCattleIncidents.filter((c) => c.severity === "high").length,
      byType: cattleByType,
    },
    fieldVisits: {
      thisMonth: demoFieldVisits.length,
      byOfficer: fvByOfficer,
      byType: fvByType,
    },
    species: survivalBySpecies.map((s) => ({ species: s.species, survivalRatePct: s.rate })),
    nurseries: demoNurseries.map((n) => ({
      name: n.name,
      village: n.villageName,
      produced: n.totalProduced,
      distributed: n.totalDistributed,
    })),
  };
}

// Unused placeholders to force import resolution stability
void demoShambachunguGroups;
void demoDistributions;
