"use client";

import { Header } from "@/components/layout/header";
import { KPICard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Sprout,
  Heart,
  MapPin,
  TreePine,
  Wheat,
  Download,
  FileText,
  Calendar,
  BarChart3,
  Mail,
  Send,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  demoKPIs,
  demoVillages,
  demoFarmers,
  demoDistributions,
  demoChilliFences,
  demoShambachunguGroups,
  demoWildlifeIncidents,
  demoCropCycles,
  demoFieldVisits,
  demoNurseries,
  demoIGAGroups,
  demoEcoClubs,
  survivalBySpecies,
  monthlyDistributions,
} from "@/lib/demo-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { jsPDF } from "jspdf";
import { six_rivers_logo } from "@/lib/six-rivers-logo";
import { seven_square_logo } from "@/lib/seven-square-logo";

const quarterlyData = [
  { quarter: "Q3 2025", farmers: 35, seedlings: 400, survival: 65, visits: 18 },
  { quarter: "Q4 2025", farmers: 85, seedlings: 1400, survival: 62, visits: 42 },
  { quarter: "Q1 2026", farmers: demoKPIs.totalFarmers, seedlings: demoKPIs.totalSeedlingsDistributed, survival: demoKPIs.averageSurvivalRate, visits: demoKPIs.fieldVisitsThisMonth },
];

function exportCSV() {
  const headers = ["Metric", "Value"];
  const rows = [
    ["Farmers Engaged", String(demoKPIs.totalFarmers)],
    ["Seedlings Distributed", String(demoKPIs.totalSeedlingsDistributed)],
    ["Average Survival Rate", `${demoKPIs.averageSurvivalRate}%`],
    ["Agroforestry Area (ha)", String(demoKPIs.totalAgroforestryHectares)],
    ["Operational Villages", String(demoKPIs.operationalVillages)],
    ["Active Crop Cycles", String(demoKPIs.activeCropCycles)],
    ["Active Chilli Fences", String(demoKPIs.activeChilliFences)],
    ["Elephant Deterrence Rate", `${demoKPIs.elephantDeterrenceSuccessRate}%`],
    ["Shambachungu Groups", String(demoKPIs.shambachunguGroups)],
    ["Wildlife Incidents (month)", String(demoKPIs.wildlifeIncidentsThisMonth)],
    ["Cattle Incidents (month)", String(demoKPIs.cattleIncidentsThisMonth)],
    ["Field Visits (month)", String(demoKPIs.fieldVisitsThisMonth)],
    [],
    ["Village", "District", "Farmers", "Seedlings"],
    ...demoVillages.map((v) => [v.name, v.districtName, String(v.farmerCount), String(v.seedlingCount)]),
    [],
    ["Species", "Survival Rate"],
    ...survivalBySpecies.map((s) => [s.species, `${s.rate}%`]),
  ];
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "six_rivers_impact_data.csv";
  a.click();
  URL.revokeObjectURL(url);
}

interface ReportOptions {
  period?: string;
  aiHighlights?: string[]; // if provided, replaces the templated ones
  saveFile?: boolean; // default true — if false, returns base64 for emailing
}

function buildReport(opts: ReportOptions = {}): string | void {
  const period = opts.period ?? "January – March 2026";
  const activeFences = demoChilliFences.filter((f) => f.status === "active").length;
  const activeGroups = demoShambachunguGroups.filter((g) => g.status === "active").length;
  const totalMembers = demoShambachunguGroups.reduce((s, g) => s + g.memberCount, 0);
  const hortFarmers = demoFarmers.filter((f) => f.farmingApproach.includes("horticulture")).length;

  // Gender + IGA + farmer lifecycle computations (used in new sections)
  const ecoMale = demoEcoClubs.reduce((s, c) => s + c.maleCount, 0);
  const ecoFemale = demoEcoClubs.reduce((s, c) => s + c.femaleCount, 0);
  const igaMale = demoIGAGroups.reduce((s, g) => s + g.maleCount, 0);
  const igaFemale = demoIGAGroups.reduce((s, g) => s + g.femaleCount, 0);
  const igaActive = demoIGAGroups.filter((g) => g.status === "active").length;
  const igaStruggling = demoIGAGroups.filter((g) => g.status === "struggling").length;
  const igaInactive = demoIGAGroups.filter((g) => g.status === "inactive").length;
  const igaTotalCapital = demoIGAGroups.reduce((s, g) => s + g.currentCapitalTSh, 0);
  const igaTotalRevenue = demoIGAGroups.reduce((s, g) => s + g.revenueTSh, 0);
  const igaTotalExpense = demoIGAGroups.reduce((s, g) => s + g.expenseTSh, 0);
  const igaTopRevenue = [...demoIGAGroups].sort((a, b) => b.revenueTSh - a.revenueTSh).slice(0, 3);
  const igaBottomNet = [...demoIGAGroups]
    .map((g) => ({ ...g, net: g.revenueTSh - g.expenseTSh }))
    .sort((a, b) => a.net - b.net)
    .slice(0, 3);
  const droppedFarmers = demoFarmers.filter((f) => !f.isActive);
  const activeFarmers = demoFarmers.length - droppedFarmers.length;
  const totalTreesPlanted = demoFarmers.reduce((s, f) => s + f.totalTreesPlanted, 0);
  const totalTreesSurviving = demoFarmers.reduce((s, f) => s + f.treesSurviving, 0);
  // Field visit officers
  const officerMap = demoFieldVisits.reduce<Record<string, { count: number; villages: string[]; types: string[] }>>((acc, v) => {
    const key = v.userName;
    if (!acc[key]) acc[key] = { count: 0, villages: [], types: [] };
    acc[key].count++;
    acc[key].villages.push(v.villageName);
    acc[key].types.push(v.visitType);
    return acc;
  }, {});
  const officerRows = Object.entries(officerMap).map(([name, data]) => {
    const topVillage = mode(data.villages);
    const topType = mode(data.types).replace(/_/g, " ");
    return { name, visits: data.count, topVillage, topType };
  });

  function mode<T>(arr: T[]): T {
    const counts = new Map<T, number>();
    arr.forEach((a) => counts.set(a, (counts.get(a) ?? 0) + 1));
    let best: T = arr[0];
    let max = 0;
    counts.forEach((v, k) => {
      if (v > max) {
        max = v;
        best = k;
      }
    });
    return best;
  }
  function fmtTSh(n: number): string {
    if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M TSh`;
    if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)}K TSh`;
    return `${n} TSh`;
  }

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  let y = 0;

  // --- Colours ---
  const navy: [number, number, number] = [30, 58, 95];
  const green: [number, number, number] = [46, 125, 50];
  const gold: [number, number, number] = [240, 209, 113];
  const gray: [number, number, number] = [100, 100, 100];
  const black: [number, number, number] = [33, 33, 33];
  const white: [number, number, number] = [255, 255, 255];

  // --- Helper ---
  function sectionTitle(title: string) {
    doc.setFillColor(...navy);
    doc.rect(0, y, w, 10, "F");
    // Gold left accent bar
    doc.setFillColor(...gold);
    doc.rect(0, y, 3, 10, "F");
    doc.setTextColor(...white);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, y + 7);
    y += 14;
    doc.setTextColor(...black);
  }

  function kv(label: string, value: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.text(label, 14, y);
    doc.setTextColor(...black);
    doc.setFont("helvetica", "bold");
    doc.text(value, 80, y);
    doc.setFont("helvetica", "normal");
    y += 6;
  }

  function checkPage(needed: number = 20) {
    if (y + needed > 280) {
      doc.addPage();
      y = 15;
    }
  }

  // === HEADER ===
  doc.setFillColor(...navy);
  doc.rect(0, 0, w, 44, "F");
  // Gold accent line under header
  doc.setFillColor(...gold);
  doc.rect(0, 44, w, 1.5, "F");

  // Six Rivers logo (left)
  try { doc.addImage(six_rivers_logo, "PNG", 12, 5, 55, 12); } catch {}
  // 7Square logo (right)
  try { doc.addImage(seven_square_logo, "PNG", w - 40, 5, 28, 8.4); } catch {}

  doc.setTextColor(...white);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Community Programme Report", 14, 28);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Reporting Period: ${period}`, 14, 35);
  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, w - 14, 35, { align: "right" });
  // "Powered by 7Square" text
  doc.setFontSize(7);
  doc.setTextColor(187, 222, 251);
  doc.text("Powered by 7Square Inc.", w - 14, 41, { align: "right" });
  y = 52;

  // === PROGRAMME OVERVIEW ===
  sectionTitle("Programme Overview");
  kv("Operational Villages", String(demoKPIs.operationalVillages));
  kv("Districts", "Ifakara Town Council + Mbarali District Council");
  kv("Farmers Engaged", String(demoKPIs.totalFarmers));
  kv("Seedlings Distributed", demoKPIs.totalSeedlingsDistributed.toLocaleString());
  kv("Average Survival Rate", `${demoKPIs.averageSurvivalRate}%`);
  y += 4;

  // === HUMAN-WILDLIFE COEXISTENCE ===
  sectionTitle("Human-Wildlife Coexistence");
  kv("Active Chilli Fences", `${activeFences} (${demoChilliFences.length} total, ${demoChilliFences.length - activeFences} needs replanting)`);
  kv("Elephant Deterrence Rate", `${demoKPIs.elephantDeterrenceSuccessRate}%`);
  kv("Wildlife Incidents", `${demoKPIs.wildlifeIncidentsThisMonth} this month`);
  kv("Cattle Incidents", `${demoKPIs.cattleIncidentsThisMonth} this month (Mbarali DC)`);
  y += 4;

  // === FARMING APPROACHES ===
  sectionTitle("Farming Approaches");
  kv("Agroforestry Area", `${demoKPIs.totalAgroforestryHectares} ha (plots + shambachungu)`);
  kv("Shambachungu Groups", `${activeGroups} active (${totalMembers} members)`);
  kv("Horticulture Farmers", String(hortFarmers));
  kv("Active Crop Cycles", String(demoKPIs.activeCropCycles));
  kv("Nurseries Operational", String(demoNurseries.length));
  y += 4;

  // === SURVIVAL BY SPECIES ===
  sectionTitle("Seedling Survival by Species");
  survivalBySpecies.forEach((s) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...black);
    doc.text(s.species, 14, y);

    // Bar
    const barW = 60;
    const barH = 4;
    doc.setFillColor(230, 230, 230);
    doc.rect(50, y - 3, barW, barH, "F");
    const color: [number, number, number] = s.rate >= 65 ? green : [198, 40, 40];
    doc.setFillColor(...color);
    doc.rect(50, y - 3, barW * (s.rate / 100), barH, "F");

    doc.setFont("helvetica", "bold");
    doc.text(`${s.rate}%`, 114, y);
    y += 7;
  });
  y += 4;

  // === GENDER BREAKDOWN ===
  checkPage(45);
  sectionTitle("Gender Breakdown");
  doc.setFillColor(240, 240, 240);
  doc.rect(14, y - 4, w - 28, 7, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...navy);
  doc.text("Programme", 16, y);
  doc.text("Male", 90, y);
  doc.text("Female", 120, y);
  doc.text("Total", 150, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...black);
  const genderRows: Array<[string, number, number]> = [
    ["Eco Club students", ecoMale, ecoFemale],
    ["IGA group members", igaMale, igaFemale],
  ];
  genderRows.forEach(([name, m, f], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(14, y - 4, w - 28, 6, "F");
    }
    doc.setFontSize(9);
    doc.text(name, 16, y);
    doc.text(String(m), 90, y);
    doc.text(String(f), 120, y);
    doc.text(String(m + f), 150, y);
    y += 6;
  });
  doc.setFont("helvetica", "bold");
  doc.setFillColor(232, 238, 246);
  doc.rect(14, y - 4, w - 28, 6, "F");
  doc.text("All participants", 16, y);
  doc.text(String(ecoMale + igaMale), 90, y);
  doc.text(String(ecoFemale + igaFemale), 120, y);
  doc.text(String(ecoMale + igaMale + ecoFemale + igaFemale), 150, y);
  y += 10;
  doc.setFont("helvetica", "normal");

  // === IGA PORTFOLIO ===
  checkPage(95);
  sectionTitle("IGA Portfolio");
  kv("Active / Struggling / Inactive", `${igaActive} / ${igaStruggling} / ${igaInactive}`);
  kv("Total current capital", fmtTSh(igaTotalCapital));
  kv("Total revenue this round", fmtTSh(igaTotalRevenue));
  kv("Total expenses", fmtTSh(igaTotalExpense));
  kv("Net position", fmtTSh(igaTotalRevenue - igaTotalExpense));
  y += 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...navy);
  doc.text("Top 3 groups by revenue", 14, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...black);
  igaTopRevenue.forEach((g) => {
    checkPage(6);
    doc.setFontSize(9);
    doc.text(`• ${g.name} (${g.villageName})`, 16, y);
    doc.text(fmtTSh(g.revenueTSh), 140, y);
    y += 5;
  });
  y += 2;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...navy);
  doc.text("Bottom 3 by net position", 14, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...black);
  igaBottomNet.forEach((g) => {
    checkPage(6);
    doc.setFontSize(9);
    const clr: [number, number, number] = g.net >= 0 ? [33, 33, 33] : [198, 40, 40];
    doc.text(`• ${g.name} (${g.villageName})`, 16, y);
    doc.setTextColor(...clr);
    doc.text(fmtTSh(g.net), 140, y);
    doc.setTextColor(...black);
    y += 5;
  });
  y += 4;

  // === FARMER LIFECYCLE ===
  checkPage(70);
  sectionTitle("Farmer Lifecycle");
  kv("Active farmers", `${activeFarmers} of ${demoFarmers.length} (${Math.round((activeFarmers / demoFarmers.length) * 100)}%)`);
  kv("Dropped out", `${droppedFarmers.length} (${Math.round((droppedFarmers.length / demoFarmers.length) * 100)}%)`);
  kv("Trees planted", totalTreesPlanted.toLocaleString());
  kv("Trees surviving", `${totalTreesSurviving.toLocaleString()} (${totalTreesPlanted > 0 ? Math.round((totalTreesSurviving / totalTreesPlanted) * 100) : 0}% survival)`);
  y += 2;
  if (droppedFarmers.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...navy);
    doc.text("Recent dropouts", 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...black);
    droppedFarmers.slice(0, 3).forEach((f) => {
      checkPage(12);
      doc.setFontSize(9);
      doc.text(`• ${f.name} — ${f.villageName} (${f.droppedOutAt ?? "-"})`, 16, y);
      y += 4;
      if (f.dropoutReason) {
        doc.setTextColor(...gray);
        const lines = doc.splitTextToSize(`  ${f.dropoutReason}`, w - 40);
        lines.forEach((line: string) => {
          doc.text(line, 16, y);
          y += 4;
        });
        doc.setTextColor(...black);
      }
      y += 1;
    });
  }
  y += 2;

  // === FIELD VISIT ACTIVITY ===
  checkPage(40);
  sectionTitle("Field Visit Activity");
  doc.setFillColor(240, 240, 240);
  doc.rect(14, y - 4, w - 28, 7, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...navy);
  doc.text("Officer", 16, y);
  doc.text("Visits", 70, y);
  doc.text("Top village", 95, y);
  doc.text("Top activity", 140, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...black);
  officerRows.forEach((r, i) => {
    checkPage(6);
    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(14, y - 4, w - 28, 6, "F");
    }
    doc.setFontSize(9);
    doc.text(r.name, 16, y);
    doc.text(String(r.visits), 70, y);
    doc.text(r.topVillage, 95, y);
    doc.text(r.topType, 140, y);
    y += 6;
  });
  y += 4;

  // === KEY HIGHLIGHTS ===
  checkPage(50);
  sectionTitle("Key Highlights");
  const defaultHighlights = [
    `${activeFences} active chilli fences with ${demoKPIs.elephantDeterrenceSuccessRate}% elephant deterrence success rate`,
    `Cocoa agroforestry in year 3 for pilot farmers (${survivalBySpecies.find((s) => s.species === "Cocoa")?.rate}% survival)`,
    `${activeGroups} shambachungu groups active with ${totalMembers} total members`,
    `${hortFarmers} horticulture farmers on short-cycle crops (onions, tomatoes, cabbage)`,
    `Dry season planting losses identified \u2014 replanting for April rains in progress`,
    `${demoKPIs.fieldVisitsThisMonth} field visits conducted, 100% synced to platform`,
  ];
  const highlights =
    opts.aiHighlights && opts.aiHighlights.length > 0
      ? opts.aiHighlights
      : defaultHighlights;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  highlights.forEach((h) => {
    checkPage(8);
    doc.setTextColor(...green);
    doc.text("\u2022", 14, y);
    doc.setTextColor(...black);
    doc.text(h, 20, y);
    y += 6;
  });
  y += 4;

  // === VILLAGE BREAKDOWN TABLE ===
  checkPage(40);
  sectionTitle("Village Breakdown");
  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(14, y - 4, w - 28, 7, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...navy);
  doc.text("Village", 16, y);
  doc.text("District", 60, y);
  doc.text("Farmers", 110, y);
  doc.text("Seedlings", 140, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...black);
  demoVillages.forEach((v, i) => {
    checkPage(7);
    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(14, y - 4, w - 28, 6, "F");
    }
    doc.setFontSize(9);
    doc.text(v.name, 16, y);
    doc.text(v.districtName, 60, y);
    doc.text(String(v.farmerCount), 116, y);
    doc.text(String(v.seedlingCount), 146, y);
    y += 6;
  });

  // === FOOTER ===
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    // Gold accent line above footer
    doc.setFillColor(...gold);
    doc.rect(0, 286, w, 1, "F");
    doc.setFillColor(...navy);
    doc.rect(0, 287, w, 10, "F");
    doc.setTextColor(...white);
    doc.setFontSize(8);
    doc.text("Six Rivers Africa  |  Community Intelligence Platform", 14, 293);
    doc.setTextColor(...gold);
    doc.text(`Powered by 7Square Inc.  |  Page ${i} of ${pages}`, w - 14, 293, { align: "right" });
  }

  const filename = `Six_Rivers_Report_${period.replace(/[^\w]+/g, "_")}.pdf`;
  if (opts.saveFile !== false) {
    doc.save(filename);
    return;
  }
  // Return a base64 data string (useful for emailing the PDF)
  const dataUri = doc.output("datauristring");
  // Strip `data:application/pdf;filename=...;base64,` prefix
  const comma = dataUri.indexOf(",");
  return comma >= 0 ? dataUri.slice(comma + 1) : dataUri;
}

// Convenience wrapper that matches the old signature so existing callers keep working
function downloadReport(): void {
  buildReport();
}

export default function ImpactPage() {
  const activeFences = demoChilliFences.filter((f) => f.status === "active").length;
  const activeGroups = demoShambachunguGroups.filter((g) => g.status === "active").length;
  const totalMembers = demoShambachunguGroups.reduce((s, g) => s + g.memberCount, 0);
  const hortFarmers = demoFarmers.filter((f) => f.farmingApproach.includes("horticulture")).length;
  const [sending, setSending] = useState<"edna" | "team" | null>(null);
  const [period, setPeriod] = useState<string>("January – March 2026 (Q1)");

  // PARKED — AI-enhanced PDF. Re-enable by restoring this block, the
  // aiLoading state, and the button in the toolbar. See docs/ai-parked.md
  // const [aiLoading, setAiLoading] = useState(false);
  // async function downloadAIEnhancedPDF() {
  //   setAiLoading(true);
  //   const toastId = toast.loading("Asking the AI to write key highlights...");
  //   try {
  //     const res = await fetch("/api/ai", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ question: "", mode: "highlights" }),
  //     });
  //     const data = await res.json();
  //     toast.dismiss(toastId);
  //     if (!res.ok) {
  //       toast.error("AI highlights failed — using templated highlights", {
  //         description: data.error ?? "",
  //       });
  //       buildReport({ period });
  //       return;
  //     }
  //     const ai = typeof data.answer === "string" ? data.answer : "";
  //     const bullets = ai
  //       .split("\n")
  //       .map((l: string) => l.replace(/^[•\-*\s]+/, "").trim())
  //       .filter((l: string) => l.length > 0);
  //     if (bullets.length === 0) {
  //       toast.error("AI returned no highlights — using templated ones");
  //       buildReport({ period });
  //       return;
  //     }
  //     toast.success(`Generating PDF with ${bullets.length} AI-written highlights`);
  //     buildReport({ period, aiHighlights: bullets });
  //   } catch (err) {
  //     toast.dismiss(toastId);
  //     toast.error("Could not generate AI highlights", {
  //       description: err instanceof Error ? err.message : "Network error",
  //     });
  //     buildReport({ period });
  //   } finally {
  //     setAiLoading(false);
  //   }
  // }

  async function sendReportTo(recipient: "edna" | "team") {
    setSending(recipient);
    const loadingId = toast.loading(
      recipient === "edna"
        ? "Sending M&E report to Edna..."
        : "Sending report to management team..."
    );
    try {
      const summary =
        recipient === "edna"
          ? "Hi Edna, here is the latest M&E snapshot for the Six Rivers community programme. All KPIs are computed from live data. Full PDF to follow in a later cycle."
          : "Hi team, sharing this quarter's impact snapshot for your review. KPIs are live-computed from the dashboard.";
      const res = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient,
          reportTitle: "Six Rivers Community Programme — Impact Snapshot",
          reportPeriod: period,
          summary,
          kpis: {
            "Farmers engaged": demoKPIs.totalFarmers,
            "Active farmers": demoKPIs.activeFarmers,
            "Farmer dropouts": demoKPIs.droppedOutFarmers,
            "Seedlings distributed": demoKPIs.totalSeedlingsDistributed.toLocaleString(),
            "Avg survival rate": `${demoKPIs.averageSurvivalRate}%`,
            "Active chilli fences": activeFences,
            "Elephant deterrence rate": `${demoKPIs.elephantDeterrenceSuccessRate}%`,
            "Active IGA groups": `${demoKPIs.activeIGAGroups} / ${demoKPIs.totalIGAGroups}`,
            "IGA revenue (TSh)": `${(demoKPIs.totalIGARevenueTSh / 1_000_000).toFixed(1)}M`,
            "Eco Club schools": demoKPIs.ecoClubSchools,
            "Radio sessions 2025": demoKPIs.radioSessionsAired,
            "Operational villages": demoKPIs.operationalVillages,
          },
          highlights: [
            `${activeFences} chilli fences active with ${demoKPIs.elephantDeterrenceSuccessRate}% elephant deterrence success`,
            `${activeGroups} Shamba Chungu groups active with ${totalMembers} members`,
            `${hortFarmers} horticulture farmers on short-cycle crops (onions, tomatoes, cabbage)`,
            `Dry-season planting losses flagged — replanting strategy for April rains in progress`,
            `${demoKPIs.fieldVisitsThisMonth} field visits this month, 100% synced to platform`,
          ],
        }),
      });
      const data = await res.json();
      toast.dismiss(loadingId);
      if (res.ok) {
        toast.success(
          recipient === "edna" ? "Report sent to Edna" : "Report sent to the team",
          {
            description: `Delivered to ${(data.recipients ?? []).join(", ")}`,
          }
        );
      } else {
        toast.error("Could not send report", { description: data.error ?? "" });
      }
    } catch (err) {
      toast.dismiss(loadingId);
      toast.error("Could not send report", {
        description: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setSending(null);
    }
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Impact Dashboard"
        subtitle="Track programme outcomes and generate donor reports"
      />

      <div className="flex flex-col gap-6 p-6">
        {/* Export Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Programme Impact Summary</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
              aria-label="Reporting period"
            >
              <option>January – March 2026 (Q1)</option>
              <option>October – December 2025 (Q4)</option>
              <option>July – September 2025 (Q3)</option>
              <option>Full Year 2025–2026</option>
            </select>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={exportCSV}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => buildReport({ period })}>
              <FileText className="h-4 w-4" />
              Generate PDF
            </Button>
            {/* PARKED — AI-enhanced PDF button. See docs/ai-parked.md
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-accent text-accent hover:bg-accent/5"
              onClick={downloadAIEnhancedPDF}
              disabled={aiLoading}
            >
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Generate AI-enhanced PDF
            </Button>
            */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => sendReportTo("edna")}
              disabled={sending !== null}
            >
              {sending === "edna" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              Send to Edna (M&E)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => sendReportTo("team")}
              disabled={sending !== null}
            >
              {sending === "team" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send to Management Team
            </Button>
          </div>
        </div>

        {/* Impact KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Farmers Engaged"
            value={demoKPIs.totalFarmers}
            icon={Users}
            trend="up"
            trendValue="Across 21 villages"
            iconClassName="bg-blue-100 text-blue-600"
          />
          <KPICard
            title="Seedlings Distributed"
            value={demoKPIs.totalSeedlingsDistributed.toLocaleString()}
            icon={Sprout}
            trend="up"
            trendValue="Including cocoa, chilli & horticulture"
            iconClassName="bg-green-100 text-green-600"
          />
          <KPICard
            title="Average Survival"
            value={`${demoKPIs.averageSurvivalRate}%`}
            icon={Heart}
            trend="down"
            trendValue="Dry season losses impacting rate"
            iconClassName="bg-rose-100 text-rose-600"
          />
          <KPICard
            title="Agroforestry Area"
            value={`${demoKPIs.totalAgroforestryHectares} ha`}
            icon={TreePine}
            trend="up"
            trendValue="Individual plots + shambachungu"
          />
        </div>

        {/* Quarterly Trends */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Farmer Engagement & Seedling Distribution Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar yAxisId="right" dataKey="seedlings" name="Seedlings" fill="#EC5C2B" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="farmers" name="Farmers" fill="#071637" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Survival Rate Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                    <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="survival"
                      name="Survival %"
                      stroke="hsl(350, 80%, 50%)"
                      fill="hsl(350, 80%, 90%)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donor Report Preview */}
        <Card className="border-2 border-dashed border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Quarterly Donor Report Preview - Q1 2026
              </CardTitle>
              <Badge variant="secondary">Draft</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-semibold mb-2">Six Rivers Africa - Community Programme Report</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Reporting Period: January - March 2026
              </p>
              <Separator className="my-3" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Farmers Engaged</p>
                  <p className="text-2xl font-bold text-primary">{demoKPIs.totalFarmers}</p>
                  <p className="text-xs text-muted-foreground">Across {demoKPIs.operationalVillages} villages in 2 districts</p>
                </div>
                <div>
                  <p className="font-medium">Seedlings Distributed</p>
                  <p className="text-2xl font-bold text-primary">{demoKPIs.totalSeedlingsDistributed.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Including cocoa, chilli & horticulture crops</p>
                </div>
                <div>
                  <p className="font-medium">Survival Rate</p>
                  <p className="text-2xl font-bold text-amber-600">{demoKPIs.averageSurvivalRate}%</p>
                  <p className="text-xs text-muted-foreground">Dry season planting losses identified</p>
                </div>
                <div>
                  <p className="font-medium">Operational Villages</p>
                  <p className="text-2xl font-bold text-primary">{demoKPIs.operationalVillages}</p>
                  <p className="text-xs text-muted-foreground">Ifakara TC + Mbarali DC</p>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="text-sm">
                <p className="font-medium mb-1">Key Highlights</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>{activeFences} active chilli fences — {demoKPIs.elephantDeterrenceSuccessRate}% elephant deterrence success rate</li>
                  <li>Cocoa agroforestry in year 3 for pilot farmers ({survivalBySpecies.find((s) => s.species === "Cocoa")?.rate}% survival — dry season losses)</li>
                  <li>{activeGroups} shambachungu groups active with {totalMembers} total members ({demoShambachunguGroups.length - activeGroups} forming)</li>
                  <li>{hortFarmers} horticulture farmers on short-cycle crops (onions, tomatoes, cabbage)</li>
                  <li>Dry season planting losses identified — replanting strategy for April rains in progress</li>
                  <li>{demoKPIs.fieldVisitsThisMonth} field visits conducted, 100% synced to platform</li>
                </ul>
              </div>
            </div>
            <Button className="self-end gap-1.5" onClick={() => buildReport({ period })}>
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
