"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Download, FileSpreadsheet, ArrowLeft, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  demoKPIs,
  demoVillages,
  demoFarmers,
  demoDistributions,
  demoSurvivalChecks,
  demoCropCycles,
  demoShambachunguGroups,
  demoNurseries,
  demoNurseryBatches,
  demoCattleIncidents,
  demoWildlifeIncidents,
  demoFieldVisits,
  demoChilliFences,
  demoIGAGroups,
  demoEcoClubs,
  demoRadioSessions,
  demoRadioWinners,
  demoWeatherData,
  survivalBySpecies,
} from "@/lib/demo-data";

interface DataCategory {
  key: string;
  label: string;
  estimatedRows: number;
}

const DATA_CATEGORIES: DataCategory[] = [
  { key: "summary", label: "Programme Summary (KPIs)", estimatedRows: 16 },
  { key: "villages", label: "Villages", estimatedRows: demoVillages.length },
  { key: "farmers", label: "Farmers (full lifecycle)", estimatedRows: demoFarmers.length },
  { key: "iga", label: "IGA Groups", estimatedRows: demoIGAGroups.length },
  { key: "eco_clubs", label: "Eco Clubs", estimatedRows: demoEcoClubs.length },
  { key: "shambachungu", label: "Shambachungu groups", estimatedRows: demoShambachunguGroups.length },
  { key: "chilli_fences", label: "Chilli Fences", estimatedRows: demoChilliFences.length },
  { key: "distributions", label: "Seedling Distributions", estimatedRows: demoDistributions.length },
  { key: "survival_checks", label: "Survival Checks", estimatedRows: demoSurvivalChecks.length },
  { key: "crop_cycles", label: "Crop Cycles", estimatedRows: demoCropCycles.length },
  { key: "nurseries", label: "Nurseries + Batches", estimatedRows: demoNurseries.length + demoNurseryBatches.length },
  { key: "wildlife_incidents", label: "Wildlife Incidents", estimatedRows: demoWildlifeIncidents.length },
  { key: "cattle_incidents", label: "Cattle Incidents", estimatedRows: demoCattleIncidents.length },
  { key: "field_visits", label: "Field Visits", estimatedRows: demoFieldVisits.length },
  { key: "radio", label: "Radio Sessions + Winners", estimatedRows: demoRadioSessions.length + demoRadioWinners.length },
  { key: "climate", label: "Climate / Weather", estimatedRows: demoWeatherData.length },
];

const QUARTERS = ["Q1 2026", "Q4 2025", "Q3 2025"];
const YEARS = ["2026", "2025"];

export default function ImpactExportPage() {
  const [selectedQuarter, setSelectedQuarter] = useState("Q1 2026");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [checkedCategories, setCheckedCategories] = useState<Set<string>>(
    new Set(DATA_CATEGORIES.map((c) => c.key))
  );

  const toggleCategory = (key: string) => {
    setCheckedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (checkedCategories.size === DATA_CATEGORIES.length) {
      setCheckedCategories(new Set());
    } else {
      setCheckedCategories(new Set(DATA_CATEGORIES.map((c) => c.key)));
    }
  };

  const selectedCategories = DATA_CATEGORIES.filter((c) => checkedCategories.has(c.key));
  const totalRows = selectedCategories.reduce((sum, c) => sum + c.estimatedRows, 0);

  const [exporting, setExporting] = useState(false);

  const buildWorkbook = () => {
    const wb = XLSX.utils.book_new();
    let sheetsAdded = 0;
    let rowsTotal = 0;
    const addSheet = <T extends Record<string, unknown>>(name: string, rows: T[]): void => {
      if (rows.length === 0) return;
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
      sheetsAdded++;
      rowsTotal += rows.length;
    };

    if (checkedCategories.has("summary")) {
      const kpiRows = Object.entries(demoKPIs).map(([metric, value]) => ({
        Metric: metric,
        Value: typeof value === "number" ? value : String(value),
      }));
      addSheet("Summary KPIs", kpiRows);
      addSheet(
        "Species survival",
        survivalBySpecies.map((s) => ({ Species: s.species, SurvivalPct: s.rate }))
      );
    }
    if (checkedCategories.has("villages")) {
      addSheet(
        "Villages",
        demoVillages.map((v) => ({
          Name: v.name,
          Sector: v.sector === "ifakara" ? "Msolwa" : "Usangu",
          District: v.districtName,
          Ward: v.wardName,
          Region: v.regionName,
          Population: v.population,
          FarmerCount: v.farmerCount,
          SeedlingCount: v.seedlingCount,
          DistanceToNPKm: v.distanceToNpKm,
        }))
      );
    }
    if (checkedCategories.has("farmers")) {
      addSheet(
        "Farmers",
        demoFarmers.map((f) => ({
          Name: f.name,
          Village: f.villageName,
          Phone: f.phone ?? "",
          FarmAreaHa: f.farmAreaHectares,
          Approach: f.farmingApproach.join("; "),
          IsActive: f.isActive,
          DroppedOutAt: f.droppedOutAt ?? "",
          DropoutReason: f.dropoutReason ?? "",
          TreesPlanted: f.totalTreesPlanted,
          TreesSurviving: f.treesSurviving,
          Training: f.trainingReceived.join("; "),
          Officer: f.extensionOfficer ?? "",
          LastPOVisit: f.lastPOVisit ?? "",
          Registered: f.registeredAt,
        }))
      );
    }
    if (checkedCategories.has("iga")) {
      addSheet(
        "IGA groups",
        demoIGAGroups.map((g) => ({
          Name: g.name,
          Village: g.villageName,
          Ward: g.ward,
          Sector: g.sector === "ifakara" ? "Msolwa" : "Usangu",
          Type: g.igaType,
          Members: g.memberCount,
          Male: g.maleCount,
          Female: g.femaleCount,
          CurrentCapitalTSh: g.currentCapitalTSh,
          RevenueTSh: g.revenueTSh,
          ExpenseTSh: g.expenseTSh,
          NetTSh: g.revenueTSh - g.expenseTSh,
          Status: g.status,
          FormedDate: g.formedDate,
          Notes: g.notes ?? "",
        }))
      );
    }
    if (checkedCategories.has("eco_clubs")) {
      addSheet(
        "Eco Clubs",
        demoEcoClubs.map((c) => ({
          School: c.schoolName,
          Village: c.villageName,
          Ward: c.ward,
          District: c.district,
          Sector: c.sector === "ifakara" ? "Msolwa" : "Usangu",
          Male: c.maleCount,
          Female: c.femaleCount,
          Teachers: c.teachers.join("; "),
          SessionsCompleted: c.sessionsCompleted,
          SafariParticipants: c.ecoSafariParticipants,
        }))
      );
    }
    if (checkedCategories.has("shambachungu")) {
      addSheet(
        "Shambachungu",
        demoShambachunguGroups.map((g) => ({
          Name: g.name,
          Village: g.villageName,
          Members: g.memberCount,
          AreaHa: g.areaHectares,
          Crops: g.crops.join("; "),
          Trees: g.treeSpecies.join("; "),
          Status: g.status,
        }))
      );
    }
    if (checkedCategories.has("chilli_fences")) {
      addSheet(
        "Chilli Fences",
        demoChilliFences.map((f) => ({
          Farmer: f.farmerName,
          Village: f.villageName,
          PerimeterM: f.perimeterMetres,
          Variety: f.chilliVariety,
          Installed: f.installedDate,
          Status: f.status,
          DeterrenceEvents: f.elephantDeterrenceEvents,
          LastChecked: f.lastCheckedDate ?? "",
        }))
      );
    }
    if (checkedCategories.has("distributions")) {
      addSheet(
        "Distributions",
        demoDistributions.map((d) => ({
          Farmer: d.farmerName,
          Species: d.species,
          Quantity: d.quantity,
          Date: d.distributionDate,
          Nursery: d.nurseryName ?? "",
          SurvivalPct: d.survivalRate ?? "",
        }))
      );
    }
    if (checkedCategories.has("survival_checks")) {
      addSheet(
        "Survival Checks",
        demoSurvivalChecks.map((s) => ({
          DistributionId: s.distributionId,
          CheckDate: s.checkDate,
          Surviving: s.survivingCount,
          Original: s.originalCount,
          SurvivalPct: s.survivalRate,
          Notes: s.notes ?? "",
        }))
      );
    }
    if (checkedCategories.has("crop_cycles")) {
      addSheet(
        "Crop Cycles",
        demoCropCycles.map((c) => ({
          Farmer: c.farmerName,
          Crop: c.cropType,
          Planted: c.plantingDate,
          ExpectedHarvest: c.expectedHarvestDate ?? "",
          ActualHarvest: c.actualHarvestDate ?? "",
          AreaHa: c.areaHectares ?? "",
          YieldKg: c.yieldKg ?? "",
        }))
      );
    }
    if (checkedCategories.has("nurseries")) {
      addSheet(
        "Nurseries",
        demoNurseries.map((n) => ({
          Name: n.name,
          Village: n.villageName,
          Capacity: n.capacitySeedlings ?? "",
          WaterSource: n.waterSource ?? "",
          TotalProduced: n.totalProduced,
          TotalDistributed: n.totalDistributed,
        }))
      );
      addSheet(
        "Nursery Batches",
        demoNurseryBatches.map((b) => ({
          NurseryId: b.nurseryId,
          Species: b.species,
          Planted: b.plantingDate,
          QuantityPlanted: b.quantityPlanted,
          Germinated: b.germinationCount ?? "",
          Status: b.status,
        }))
      );
    }
    if (checkedCategories.has("wildlife_incidents")) {
      addSheet(
        "Wildlife Incidents",
        demoWildlifeIncidents.map((w) => ({
          Date: w.date,
          Village: w.villageName ?? "",
          Animal: w.animalType,
          IncidentType: w.incidentType,
          Severity: w.severity,
          Description: w.description ?? "",
          ChilliFencePresent: w.chilliFencePresent,
          DeterrenceWorked: w.deterrenceWorked === null ? "" : w.deterrenceWorked,
          Lat: w.locationLat,
          Lng: w.locationLng,
        }))
      );
    }
    if (checkedCategories.has("cattle_incidents")) {
      addSheet(
        "Cattle Incidents",
        demoCattleIncidents.map((c) => ({
          Date: c.date,
          Village: c.villageName ?? "",
          IncidentType: c.incidentType,
          Severity: c.severity,
          EstimatedHerd: c.estimatedHerdSize ?? "",
          Description: c.description ?? "",
          Lat: c.locationLat,
          Lng: c.locationLng,
        }))
      );
    }
    if (checkedCategories.has("field_visits")) {
      addSheet(
        "Field Visits",
        demoFieldVisits.map((v) => ({
          Date: v.visitDate,
          Officer: v.userName,
          Village: v.villageName,
          Type: v.visitType,
          Notes: v.notes ?? "",
          Lat: v.locationLat ?? "",
          Lng: v.locationLng ?? "",
        }))
      );
    }
    if (checkedCategories.has("radio")) {
      addSheet(
        "Radio Sessions",
        demoRadioSessions.map((s) => ({
          AirDate: s.airDate,
          Topic: s.topic,
          Speaker: s.guestSpeaker ?? "",
          Org: s.guestOrganization ?? "",
          Sector: s.sector,
        }))
      );
      addSheet(
        "Radio Winners",
        demoRadioWinners.map((w) => ({
          Name: w.name,
          Village: w.village,
          Sector: w.sector === "ifakara" ? "Msolwa" : "Usangu",
          Gender: w.gender,
          SessionDate: w.sessionDate ?? "",
          Prize: w.prize ?? "",
        }))
      );
    }
    if (checkedCategories.has("climate")) {
      addSheet(
        "Weather",
        demoWeatherData.map((w) => ({
          Ward: w.wardName,
          Date: w.date,
          RainfallMm: w.rainfallMm ?? "",
          TempMaxC: w.tempMaxC ?? "",
          TempMinC: w.tempMinC ?? "",
          DroughtIndex: w.droughtIndex ?? "",
        }))
      );
    }
    return { wb, sheetsAdded, rowsTotal };
  };

  const handleExport = async (format: string) => {
    if (checkedCategories.size === 0) {
      toast.error("Pick at least one data category to export");
      return;
    }
    setExporting(true);
    try {
      const { wb, sheetsAdded, rowsTotal } = buildWorkbook();
      if (sheetsAdded === 0) {
        toast.error("Nothing to export — the selected categories have no data");
        return;
      }
      const today = new Date().toISOString().split("T")[0];
      const ext = format === "csv" ? "csv" : "xlsx";
      const bookType: "xlsx" | "csv" = ext === "csv" ? "csv" : "xlsx";
      const safeQuarter = selectedQuarter.replace(/\s+/g, "_");
      const filename = `Six_Rivers_Export_${safeQuarter}_${today}.${ext}`;
      XLSX.writeFile(wb, filename, { bookType });
      toast.success("Export complete", {
        description: `${sheetsAdded} sheet${sheetsAdded === 1 ? "" : "s"} · ${rowsTotal} rows · ${filename}`,
      });
    } catch (err) {
      toast.error("Export failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <Header
        title="Data Export"
        subtitle="Export programme data for reporting and analysis"
      />

      <div className="flex flex-col gap-6 p-6">
        <Link href="/impact">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to Impact Dashboard
          </Button>
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Configuration */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Period Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Reporting Period</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="quarter">Quarter</Label>
                    <select
                      id="quarter"
                      value={selectedQuarter}
                      onChange={(e) => setSelectedQuarter(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {QUARTERS.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="year">Year</Label>
                    <select
                      id="year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Categories */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Data Categories</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={toggleAll}
                  >
                    {checkedCategories.size === DATA_CATEGORIES.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {DATA_CATEGORIES.map((category) => (
                    <label
                      key={category.key}
                      className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checkedCategories.has(category.key)}
                        onChange={() => toggleCategory(category.key)}
                        className="h-4 w-4 rounded border-input"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium">{category.label}</span>
                        <p className="text-[10px] text-muted-foreground">
                          ~{category.estimatedRows} rows
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Export Buttons */}
            <div className="flex gap-3">
              <Button
                className="gap-1.5 flex-1"
                onClick={() => handleExport("csv")}
                disabled={checkedCategories.size === 0}
              >
                <Download className="h-4 w-4" />
                Export as CSV
              </Button>
              <Button
                variant="outline"
                className="gap-1.5 flex-1"
                onClick={() => handleExport("xlsx")}
                disabled={checkedCategories.size === 0}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export as Excel (.xlsx)
              </Button>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Export Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-3xl font-bold">{totalRows.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Estimated Total Rows</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Period</p>
                  <p className="text-sm font-medium">
                    {selectedQuarter}, {selectedYear}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Selected Categories ({selectedCategories.length})
                  </p>
                  <div className="flex flex-col gap-2">
                    {selectedCategories.map((category) => (
                      <div
                        key={category.key}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{category.label}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          ~{category.estimatedRows}
                        </Badge>
                      </div>
                    ))}
                    {selectedCategories.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No categories selected.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Export Notes</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>CSV exports create one file per category</li>
                      <li>Excel exports contain all categories as separate sheets</li>
                      <li>All dates formatted as YYYY-MM-DD</li>
                      <li>GPS coordinates included where available</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
