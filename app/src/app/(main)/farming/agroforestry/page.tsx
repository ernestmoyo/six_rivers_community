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
import { TreePine, MapPin, Users, Ruler, Plus } from "lucide-react";
import { demoFarmers, demoVillages } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

const AGROFORESTRY_SPECIES = [
  "Moringa",
  "Mango",
  "Avocado",
  "Grevillea",
  "Neem",
  "Teak",
  "Eucalyptus",
  "Cashew",
] as const;

interface AgroforestryPlot {
  id: number;
  farmer: string;
  village: string;
  area: number;
  species: string[];
  planted: string;
}

const demoPlots: AgroforestryPlot[] = [
  { id: 1, farmer: "Halima Mwenda", village: "Msolwa Ujamaa", area: 1.2, species: ["Moringa", "Mango", "Neem"], planted: "2025-10-01" },
  { id: 2, farmer: "Grace Mushi", village: "Katurukila", area: 2.0, species: ["Avocado", "Grevillea"], planted: "2025-11-01" },
  { id: 3, farmer: "Ramadhani Kibona", village: "Ichonde", area: 3.5, species: ["Grevillea", "Teak", "Eucalyptus"], planted: "2025-11-10" },
  { id: 4, farmer: "Fatma Ngowi", village: "Utengule", area: 0.8, species: ["Moringa", "Cashew"], planted: "2025-12-01" },
];

export default function AgroforestryPage() {
  const [plots, setPlots] = useState<AgroforestryPlot[]>(demoPlots);
  const [open, setOpen] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>("");

  const totalArea = plots.reduce((sum, p) => sum + p.area, 0);

  const selectedFarmer = demoFarmers.find((f) => f.id === Number(selectedFarmerId));
  const autoVillage = selectedFarmer?.villageName ?? "";

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

  return (
    <div className="flex flex-col">
      <Header title="Agroforestry Plots" subtitle="Mapped agroforestry areas with tree-crop integration" />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 flex-1">
            <KPICard title="Total Plots" value={plots.length} icon={TreePine} />
            <KPICard title="Total Area" value={`${totalArea} ha`} icon={Ruler} />
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
                  <DialogDescription>Register a new agroforestry plot.</DialogDescription>
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
                    <Input id="area" name="area" type="number" step="0.1" min="0.1" required placeholder="e.g. 2.0" />
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
      </div>
    </div>
  );
}
