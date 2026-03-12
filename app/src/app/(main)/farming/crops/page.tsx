"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, Wheat, Pencil } from "lucide-react";
import { demoCropCycles, demoFarmers } from "@/lib/demo-data";
import { CROP_TYPES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { CropCycle } from "@/types";

export default function CropsPage() {
  const [cycles, setCycles] = useState<CropCycle[]>(demoCropCycles);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const activeCycles = cycles.filter((c) => !c.actualHarvestDate);
  const completedCycles = cycles.filter((c) => c.actualHarvestDate);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const farmer = demoFarmers.find((f) => f.id === Number(fd.get("farmerId")));
    const newCycle: CropCycle = {
      id: Date.now(),
      farmerId: farmer?.id ?? 0,
      farmerName: farmer?.name ?? "",
      cropType: fd.get("cropType") as string,
      plantingDate: fd.get("plantingDate") as string,
      expectedHarvestDate: (fd.get("expectedHarvestDate") as string) || null,
      actualHarvestDate: null,
      areaHectares: fd.get("area") ? Number(fd.get("area")) : null,
      yieldKg: null,
    };
    setCycles((prev) => [newCycle, ...prev]);
    setOpen(false);
  }

  function handleHarvestSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setCycles((prev) =>
      prev.map((c) =>
        c.id === editingId
          ? {
              ...c,
              actualHarvestDate: fd.get("actualHarvestDate") as string,
              yieldKg: fd.get("yieldKg") ? Number(fd.get("yieldKg")) : null,
            }
          : c
      )
    );
    setEditingId(null);
  }

  function handlePlantingDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const plantDate = e.target.value;
    if (plantDate) {
      const d = new Date(plantDate + "T00:00:00");
      d.setMonth(d.getMonth() + 3);
      const harvestInput = e.target.form?.querySelector<HTMLInputElement>('[name="expectedHarvestDate"]');
      if (harvestInput) {
        harvestInput.value = d.toISOString().split("T")[0];
      }
    }
  }

  return (
    <div className="flex flex-col">
      <Header title="Crop Cycles" subtitle="Track short-term farming cycles (3-month rotations)" />

      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Wheat className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCycles.length}</p>
                <p className="text-xs text-muted-foreground">Active Cycles</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Wheat className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCycles.length}</p>
                <p className="text-xs text-muted-foreground">Harvested</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Wheat className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {completedCycles.reduce((sum, c) => sum + (c.yieldKg || 0), 0).toLocaleString()} kg
                </p>
                <p className="text-xs text-muted-foreground">Total Yield</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
              <Plus className="h-4 w-4" />
              New Crop Cycle
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>New Crop Cycle</DialogTitle>
                <DialogDescription>Record a new planting cycle.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="farmerId">Farmer *</Label>
                  <select
                    id="farmerId"
                    name="farmerId"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select farmer...</option>
                    {demoFarmers.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cropType">Crop Type *</Label>
                  <select
                    id="cropType"
                    name="cropType"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select crop...</option>
                    {CROP_TYPES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="plantingDate">Planting Date *</Label>
                  <Input
                    id="plantingDate"
                    name="plantingDate"
                    type="date"
                    required
                    onChange={handlePlantingDateChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expectedHarvestDate">Expected Harvest Date</Label>
                  <Input id="expectedHarvestDate" name="expectedHarvestDate" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="area">Area (hectares)</Label>
                  <Input id="area" name="area" type="number" step="0.1" min="0" placeholder="e.g. 1.5" />
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                  <Button type="submit">Save Cycle</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Harvest edit dialog */}
        <Dialog open={editingId !== null} onOpenChange={(v) => { if (!v) setEditingId(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record Harvest</DialogTitle>
              <DialogDescription>Enter the actual harvest date and yield.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleHarvestSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="actualHarvestDate">Actual Harvest Date *</Label>
                <Input id="actualHarvestDate" name="actualHarvestDate" type="date" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="yieldKg">Yield (kg)</Label>
                <Input id="yieldKg" name="yieldKg" type="number" min="0" placeholder="e.g. 1200" />
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                <Button type="submit">Save Harvest</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Crop</TableHead>
                  <TableHead>Planted</TableHead>
                  <TableHead>Expected Harvest</TableHead>
                  <TableHead className="text-right">Area (ha)</TableHead>
                  <TableHead className="text-right">Yield (kg)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cycles.map((cycle) => (
                  <TableRow key={cycle.id}>
                    <TableCell className="font-medium">{cycle.farmerName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{cycle.cropType}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(cycle.plantingDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {cycle.expectedHarvestDate
                        ? formatDate(cycle.expectedHarvestDate)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">{cycle.areaHectares || "—"}</TableCell>
                    <TableCell className="text-right">
                      {cycle.yieldKg ? cycle.yieldKg.toLocaleString() : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          cycle.actualHarvestDate
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {cycle.actualHarvestDate ? "Harvested" : "Growing"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {!cycle.actualHarvestDate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          onClick={() => setEditingId(cycle.id)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
