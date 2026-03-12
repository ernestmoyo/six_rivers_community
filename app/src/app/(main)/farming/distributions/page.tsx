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
import { Plus, Package, MapPin } from "lucide-react";
import { demoDistributions, demoFarmers, demoNurseries } from "@/lib/demo-data";
import { SEEDLING_SPECIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { SeedlingDistribution } from "@/types";

export default function DistributionsPage() {
  const [distributions, setDistributions] = useState<SeedlingDistribution[]>(demoDistributions);
  const [open, setOpen] = useState(false);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const farmer = demoFarmers.find((f) => f.id === Number(fd.get("farmerId")));
    const nursery = demoNurseries.find((n) => n.id === Number(fd.get("nurseryId")));
    const newDist: SeedlingDistribution = {
      id: Date.now(),
      farmerId: farmer?.id ?? 0,
      farmerName: farmer?.name ?? "",
      species: fd.get("species") as string,
      quantity: Number(fd.get("quantity")),
      distributionDate: fd.get("date") as string,
      nurseryId: nursery?.id ?? null,
      nurseryName: nursery?.name ?? null,
      distributedBy: "Field Officer",
      locationLat: gps?.lat ?? null,
      locationLng: gps?.lng ?? null,
      survivalRate: null,
    };
    setDistributions((prev) => [newDist, ...prev]);
    setGps(null);
    setOpen(false);
  }

  function captureGPS() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Unable to get GPS location")
    );
  }

  return (
    <div className="flex flex-col">
      <Header title="Seedling Distributions" subtitle="Track all seedling distributions to farmers" />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{distributions.length}</p>
              <p className="text-xs text-muted-foreground">Total Distributions</p>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
              <Plus className="h-4 w-4" />
              New Distribution
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>New Seedling Distribution</DialogTitle>
                <DialogDescription>Record a seedling distribution to a farmer.</DialogDescription>
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
                      <option key={f.id} value={f.id}>{f.name} ({f.villageName})</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="species">Species *</Label>
                  <select
                    id="species"
                    name="species"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select species...</option>
                    {SEEDLING_SPECIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input id="quantity" name="quantity" type="number" min="1" required placeholder="e.g. 50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Distribution Date *</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nurseryId">Nursery</Label>
                  <select
                    id="nurseryId"
                    name="nurseryId"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select nursery...</option>
                    {demoNurseries.map((n) => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>GPS Location</Label>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={captureGPS}>
                      <MapPin className="mr-1 h-3.5 w-3.5" />
                      Capture GPS
                    </Button>
                    {gps && (
                      <span className="text-xs text-muted-foreground">
                        {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)}
                      </span>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                  <Button type="submit">Save Distribution</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Species</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Nursery</TableHead>
                  <TableHead>Distributed By</TableHead>
                  <TableHead className="text-right">Survival</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributions.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.farmerName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{d.species}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{d.quantity}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(d.distributionDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {d.nurseryName || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {d.distributedBy}
                    </TableCell>
                    <TableCell className="text-right">
                      {d.survivalRate !== null ? (
                        <Badge
                          variant="secondary"
                          className={
                            d.survivalRate >= 75
                              ? "bg-green-100 text-green-800"
                              : d.survivalRate >= 60
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {d.survivalRate}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
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
