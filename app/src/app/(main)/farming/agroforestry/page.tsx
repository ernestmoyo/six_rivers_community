"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KPICard } from "@/components/shared/kpi-card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { TreePine, MapPin, Users, Ruler, Plus, Shield, Percent, Sprout, Wheat } from "lucide-react";
import { demoFarmers, demoChilliFences, demoShambachunguGroups, demoCropCycles } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

const AGROFORESTRY_SPECIES = [
  "Cocoa",
  "Moringa",
  "Mango",
  "Avocado",
  "Grevillea",
  "Neem",
  "Cashew",
  "Acacia",
] as const;

type Tab = "chilli" | "agroforestry" | "shambachungu" | "horticulture";

interface AgroforestryPlot {
  id: number;
  farmer: string;
  village: string;
  area: number;
  species: string[];
  planted: string;
}

const demoPlots: AgroforestryPlot[] = [
  { id: 1, farmer: "Halima Mwenda", village: "Nyamwezi", area: 0.3, species: ["Cocoa", "Moringa"], planted: "2025-10-01" },
  { id: 2, farmer: "Grace Mushi", village: "Katindiuka", area: 0.25, species: ["Mango", "Grevillea"], planted: "2025-11-01" },
  { id: 3, farmer: "Ramadhani Kibona", village: "Mapogoro", area: 0.35, species: ["Cocoa", "Neem", "Grevillea"], planted: "2025-11-10" },
  { id: 4, farmer: "Said Mwakyusa", village: "Magigiwe", area: 0.2, species: ["Cocoa", "Cashew"], planted: "2025-12-01" },
];

export default function FarmingApproachesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("chilli");
  const [plots, setPlots] = useState<AgroforestryPlot[]>(demoPlots);
  const [open, setOpen] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>("");

  const totalArea = plots.reduce((sum, p) => sum + p.area, 0);
  const selectedFarmer = demoFarmers.find((f) => f.id === Number(selectedFarmerId));
  const autoVillage = selectedFarmer?.villageName ?? "";

  const activeFences = demoChilliFences.filter((f) => f.status === "active").length;
  const totalDeterrenceEvents = demoChilliFences.reduce((sum, f) => sum + f.elephantDeterrenceEvents, 0);
  const totalPerimeter = demoChilliFences.reduce((sum, f) => sum + f.perimeterMetres, 0);

  function toggleSpecies(s: string) {
    setSelectedSpecies((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const farmer = demoFarmers.find((f) => f.id === Number(fd.get("farmerId")));
    const newPlot: AgroforestryPlot = {
      id: Date.now(),
      farmer: farmer?.name ?? "",
      village: farmer?.villageName ?? "",
      area: Number(fd.get("area")),
      species: [...selectedSpecies],
      planted: fd.get("planted") as string,
    };
    setPlots((prev) => [newPlot, ...prev]);
    setSelectedSpecies([]);
    setSelectedFarmerId("");
    setOpen(false);
  }

  const tabs: { id: Tab; label: string; description: string }[] = [
    { id: "chilli", label: "Chilli Fencing", description: "Elephant deterrence" },
    { id: "agroforestry", label: "Agroforestry", description: "Tree-crop integration" },
    { id: "shambachungu", label: "Shambachungu", description: "Group farming" },
    { id: "horticulture", label: "Horticulture", description: "Short-cycle crops" },
  ];

  return (
    <div className="flex flex-col">
      <Header
        title="Farming Approaches"
        subtitle="Chilli fencing, agroforestry, horticulture & shambachungu for human-wildlife coexistence"
      />

      <div className="flex flex-col gap-6 p-6">
        {/* Tab Switcher */}
        <div className="flex gap-2 border-b pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-start px-4 py-2 rounded-t-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] ${activeTab === tab.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {tab.description}
              </span>
            </button>
          ))}
        </div>

        {/* ── CHILLI FENCING TAB ── */}
        {activeTab === "chilli" && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <KPICard title="Active Fences" value={activeFences} icon={Shield} iconClassName="bg-red-100 text-red-600" />
              <KPICard title="Total Perimeter" value={`${(totalPerimeter / 1000).toFixed(1)} km`} icon={Ruler} />
              <KPICard title="Deterrence Events" value={totalDeterrenceEvents} icon={Shield} iconClassName="bg-green-100 text-green-600" />
              <KPICard title="Total Fences" value={demoChilliFences.length} icon={Users} />
            </div>

            <p className="text-sm text-muted-foreground">
              Chilli fencing is a nature-based method to reduce elephant crop raids. Chilli is planted around farm boundaries — its strong smell deters elephants. Implemented at individual farmer level.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {demoChilliFences.map((fence) => (
                <Card key={fence.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{fence.farmerName}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {fence.villageName}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          fence.status === "active"
                            ? "bg-green-100 text-green-800"
                            : fence.status === "needs_replanting"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {fence.status === "needs_replanting" ? "Needs Replanting" : fence.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Perimeter:</span>{" "}
                        <span className="font-medium">{fence.perimeterMetres}m</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Variety:</span>{" "}
                        <span className="font-medium">{fence.chilliVariety}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Deterrence events:</span>{" "}
                        <span className="font-medium text-green-700">{fence.elephantDeterrenceEvents}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Installed:</span>{" "}
                        <span className="font-medium">{formatDate(fence.installedDate)}</span>
                      </div>
                    </div>
                    {fence.lastCheckedDate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last checked: {formatDate(fence.lastCheckedDate)} by {fence.checkedBy}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ── AGROFORESTRY TAB ── */}
        {activeTab === "agroforestry" && (
          <>
            <div className="flex items-center justify-between">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 flex-1">
                <KPICard title="Total Plots" value={plots.length} icon={TreePine} />
                <KPICard title="Total Area" value={`${totalArea.toFixed(1)} ha`} icon={Ruler} />
                <KPICard title="Farmers" value={plots.length} icon={Users} />
              </div>
              <div className="ml-4">
                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setSelectedSpecies([]); setSelectedFarmerId(""); } }}>
                  <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
                    <Plus className="h-4 w-4" />
                    New Plot
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>New Agroforestry Plot</DialogTitle>
                      <DialogDescription>Register a new agroforestry plot with tree-crop integration (e.g. cocoa planting).</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="farmerId">Farmer *</Label>
                        <select
                          id="farmerId"
                          name="farmerId"
                          required
                          value={selectedFarmerId}
                          onChange={(e) => setSelectedFarmerId(e.target.value)}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="">Select farmer...</option>
                          {demoFarmers.map((f) => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                      {autoVillage && (
                        <div className="grid gap-2">
                          <Label>Village</Label>
                          <p className="text-sm text-muted-foreground">{autoVillage}</p>
                        </div>
                      )}
                      <div className="grid gap-2">
                        <Label htmlFor="area">Area (hectares) *</Label>
                        <Input id="area" name="area" type="number" step="0.05" min="0.05" required placeholder="e.g. 0.3" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Species *</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {AGROFORESTRY_SPECIES.map((s) => (
                            <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedSpecies.includes(s)}
                                onChange={() => toggleSpecies(s)}
                                className="rounded border-input"
                              />
                              {s}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="planted">Planting Date *</Label>
                        <Input id="planted" name="planted" type="date" required />
                      </div>
                      <DialogFooter>
                        <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                        <Button type="submit" disabled={selectedSpecies.length === 0}>Save Plot</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Wildlife-friendly farming that integrates trees within farms (e.g. cocoa planting). Implemented at individual farmer level. Some farmers are in their 3rd year of cocoa agroforestry.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {plots.map((plot) => (
                <Card key={plot.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{plot.farmer}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {plot.village}
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {plot.area} ha
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {plot.species.map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Planted: {formatDate(plot.planted)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ── HORTICULTURE TAB ── */}
        {activeTab === "horticulture" && (() => {
          const hortFarmers = demoFarmers.filter((f) => f.farmingApproach.includes("horticulture"));
          const hortCycles = demoCropCycles.filter((c) =>
            hortFarmers.some((f) => f.id === c.farmerId)
          );
          const activeCycles = hortCycles.filter((c) => !c.actualHarvestDate);
          return (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KPICard title="Horticulture Farmers" value={hortFarmers.length} icon={Sprout} iconClassName="bg-green-100 text-green-600" />
                <KPICard title="Active Crop Cycles" value={activeCycles.length} icon={Wheat} />
                <KPICard title="Common Crops" value="Onion, Tomato, Cabbage" icon={Sprout} />
              </div>

              <p className="text-sm text-muted-foreground">
                Short-cycle vegetable and crop farming (onions, tomatoes, cabbage) — typically 3-month crop cycles. Farmers recently received training and are beginning their first planting seasons.
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {hortFarmers.map((farmer) => {
                  const cycles = hortCycles.filter((c) => c.farmerId === farmer.id);
                  return (
                    <Card key={farmer.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{farmer.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {farmer.villageName}
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {farmer.farmAreaHectares} ha
                          </Badge>
                        </div>
                        {cycles.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {cycles.map((cycle) => (
                              <div key={cycle.id} className="rounded-md border p-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{cycle.cropType}</span>
                                  <Badge
                                    variant="secondary"
                                    className={cycle.actualHarvestDate ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                                  >
                                    {cycle.actualHarvestDate ? "Harvested" : "Growing"}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Planted: {formatDate(cycle.plantingDate)}
                                  {cycle.expectedHarvestDate && ` — Expected harvest: ${formatDate(cycle.expectedHarvestDate)}`}
                                </p>
                                {cycle.yieldKg && (
                                  <p className="text-xs font-medium text-green-700 mt-1">Yield: {cycle.yieldKg} kg</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">Recently trained — no crop cycles recorded yet</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          );
        })()}

        {/* ── SHAMBACHUNGU TAB ── */}
        {activeTab === "shambachungu" && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <KPICard title="Active Groups" value={demoShambachunguGroups.filter((g) => g.status === "active").length} icon={Users} iconClassName="bg-blue-100 text-blue-600" />
              <KPICard title="Total Members" value={demoShambachunguGroups.reduce((sum, g) => sum + g.memberCount, 0)} icon={Users} />
              <KPICard title="Total Area" value={`${demoShambachunguGroups.reduce((sum, g) => sum + g.areaHectares, 0).toFixed(1)} ha`} icon={Ruler} />
            </div>

            <p className="text-sm text-muted-foreground">
              Shambachungu is group-wise wildlife-friendly farming. Community members work together on shared plots, combining crop cultivation with tree species for ecosystem restoration.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {demoShambachunguGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{group.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {group.villageName}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          group.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {group.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-muted-foreground">Members:</span>{" "}
                        <span className="font-medium">{group.memberCount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Area:</span>{" "}
                        <span className="font-medium">{group.areaHectares} ha</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground mb-1">Crops:</p>
                      <div className="flex flex-wrap gap-1">
                        {group.crops.map((c) => (
                          <Badge key={c} variant="secondary" className="text-[10px]">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground mb-1">Tree species:</p>
                      <div className="flex flex-wrap gap-1">
                        {group.treeSpecies.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px] bg-green-50">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Formed: {formatDate(group.formedDate)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
