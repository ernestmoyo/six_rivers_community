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
} from "lucide-react";
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

function downloadReport() {
  const activeFences = demoChilliFences.filter((f) => f.status === "active").length;
  const activeGroups = demoShambachunguGroups.filter((g) => g.status === "active").length;
  const totalMembers = demoShambachunguGroups.reduce((s, g) => s + g.memberCount, 0);
  const hortFarmers = demoFarmers.filter((f) => f.farmingApproach.includes("horticulture")).length;

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
  doc.text("Reporting Period: January \u2013 March 2026", 14, 35);
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

  // === KEY HIGHLIGHTS ===
  checkPage(50);
  sectionTitle("Key Highlights");
  const highlights = [
    `${activeFences} active chilli fences with ${demoKPIs.elephantDeterrenceSuccessRate}% elephant deterrence success rate`,
    `Cocoa agroforestry in year 3 for pilot farmers (${survivalBySpecies.find((s) => s.species === "Cocoa")?.rate}% survival)`,
    `${activeGroups} shambachungu groups active with ${totalMembers} total members`,
    `${hortFarmers} horticulture farmers on short-cycle crops (onions, tomatoes, cabbage)`,
    `Dry season planting losses identified \u2014 replanting for April rains in progress`,
    `${demoKPIs.fieldVisitsThisMonth} field visits conducted, 100% synced to platform`,
  ];
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

  doc.save("Six_Rivers_Q1_2026_Report.pdf");
}

export default function ImpactPage() {
  const activeFences = demoChilliFences.filter((f) => f.status === "active").length;
  const activeGroups = demoShambachunguGroups.filter((g) => g.status === "active").length;
  const totalMembers = demoShambachunguGroups.reduce((s, g) => s + g.memberCount, 0);
  const hortFarmers = demoFarmers.filter((f) => f.farmingApproach.includes("horticulture")).length;

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
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={exportCSV}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button size="sm" className="gap-1.5" onClick={downloadReport}>
              <FileText className="h-4 w-4" />
              Generate Quarterly Report
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
                    <Bar yAxisId="right" dataKey="seedlings" name="Seedlings" fill="hsl(142, 71%, 55%)" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="farmers" name="Farmers" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
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
            <Button className="self-end gap-1.5" onClick={downloadReport}>
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
