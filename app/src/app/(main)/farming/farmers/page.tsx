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
import { Plus, Users, MapPin } from "lucide-react";
import { demoFarmers, demoVillages } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import type { Farmer } from "@/types";

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>(demoFarmers);
  const [open, setOpen] = useState(false);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const village = demoVillages.find((v) => v.id === Number(fd.get("villageId")));
    const newFarmer: Farmer = {
      id: Date.now(),
      name: fd.get("name") as string,
      villageId: village?.id ?? 0,
      villageName: village?.name ?? "",
      phone: (fd.get("phone") as string) || null,
      farmLocationLat: gps?.lat ?? null,
      farmLocationLng: gps?.lng ?? null,
      farmAreaHectares: fd.get("area") ? Number(fd.get("area")) : null,
      registeredAt: new Date().toISOString().split("T")[0],
      registeredBy: "Field Officer",
    };
    setFarmers((prev) => [newFarmer, ...prev]);
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
      <Header title="Registered Farmers" subtitle="All farmers enrolled in the program" />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{farmers.length}</p>
              <p className="text-xs text-muted-foreground">Total Farmers</p>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
              <Plus className="h-4 w-4" />
              Register Farmer
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Register New Farmer</DialogTitle>
                <DialogDescription>Add a new farmer to the program.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" required placeholder="e.g. Halima Mwenda" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="villageId">Village *</Label>
                  <select
                    id="villageId"
                    name="villageId"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select village...</option>
                    {demoVillages.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" placeholder="+255 7XX XXX XXX" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="area">Farm Area (hectares)</Label>
                  <Input id="area" name="area" type="number" step="0.1" min="0" placeholder="e.g. 2.5" />
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
                  <Button type="submit">Save Farmer</Button>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Farm Area (ha)</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Registered By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {farmers.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{f.villageName}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{f.phone || "—"}</TableCell>
                    <TableCell className="text-right">{f.farmAreaHectares ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(f.registeredAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{f.registeredBy}</TableCell>
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
