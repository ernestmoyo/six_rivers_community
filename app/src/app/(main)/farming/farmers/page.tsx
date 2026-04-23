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
import { Plus, Users, MapPin, TrendingUp, TrendingDown, CircleCheck, CircleX, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { demoFarmers, demoVillages } from "@/lib/demo-data";
import { FARMING_APPROACHES, FARMER_STATUS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Farmer, FarmingApproach } from "@/types";

type StatusFilter = "all" | "active" | "dropped_out";

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>(demoFarmers);
  const [open, setOpen] = useState(false);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedApproaches, setSelectedApproaches] = useState<FarmingApproach[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredFarmers = farmers.filter((f) =>
    statusFilter === "all" ? true : statusFilter === "active" ? f.isActive : !f.isActive
  );

  const activeCount = farmers.filter((f) => f.isActive).length;
  const droppedCount = farmers.length - activeCount;
  const totalTreesPlanted = farmers.reduce((s, f) => s + f.totalTreesPlanted, 0);
  const totalTreesSurviving = farmers.reduce((s, f) => s + f.treesSurviving, 0);

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
      farmingApproach: [...selectedApproaches],
      registeredAt: new Date().toISOString().split("T")[0],
      registeredBy: "Field Officer",
      isActive: true,
      droppedOutAt: null,
      dropoutReason: null,
      totalTreesPlanted: 0,
      treesSurviving: 0,
      trainingReceived: [],
      extensionOfficer: null,
      lastPOVisit: null,
    };
    setFarmers((prev) => [newFarmer, ...prev]);
    setGps(null);
    setSelectedApproaches([]);
    setOpen(false);
  }

  function captureGPS() {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by this device");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success("Location captured", {
          description: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        });
      },
      (err) =>
        toast.error("Unable to get location", {
          description:
            err.code === 1
              ? "Location access denied — enable in browser settings"
              : "Could not get GPS fix — try again",
        })
    );
  }

  return (
    <div className="flex flex-col">
      <Header title="Registered Farmers" subtitle="All farmers enrolled in the program" />

      <div className="flex flex-col gap-6 p-6">
        {/* Summary + Register button */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CircleCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-xs text-muted-foreground">Active Farmers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <CircleX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{droppedCount}</p>
                <p className="text-xs text-muted-foreground">Dropped Out</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalTreesSurviving.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  Trees surviving ({totalTreesPlanted > 0 ? Math.round((totalTreesSurviving / totalTreesPlanted) * 100) : 0}% of {totalTreesPlanted.toLocaleString()})
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <TrendingDown className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalTreesPlanted - totalTreesSurviving}</p>
                <p className="text-xs text-muted-foreground">Trees lost</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter + register */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{filteredFarmers.length}</p>
              <p className="text-xs text-muted-foreground">
                {statusFilter === "all" ? "Total Farmers" : statusFilter === "active" ? "Active Farmers" : "Dropped Out Farmers"}
              </p>
            </div>
            <div className="flex gap-1.5 ml-4">
              <Button size="sm" variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>
                All
              </Button>
              <Button size="sm" variant={statusFilter === "active" ? "default" : "outline"} onClick={() => setStatusFilter("active")}>
                Active
              </Button>
              <Button size="sm" variant={statusFilter === "dropped_out" ? "default" : "outline"} onClick={() => setStatusFilter("dropped_out")}>
                Dropped Out
              </Button>
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
                  <Input id="area" name="area" type="number" step="0.05" min="0" placeholder="e.g. 0.4" />
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
                <div className="grid gap-2">
                  <Label>Farming Approach</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(FARMING_APPROACHES) as [FarmingApproach, { label: string }][]).map(([key, val]) => (
                      <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedApproaches.includes(key)}
                          onChange={() =>
                            setSelectedApproaches((prev) =>
                              prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
                            )
                          }
                          className="rounded border-input"
                        />
                        {val.label}
                      </label>
                    ))}
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
                  <TableHead>Status</TableHead>
                  <TableHead>Approach</TableHead>
                  <TableHead className="text-right">Trees</TableHead>
                  <TableHead>Training</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Officer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarmers.map((f) => {
                  const statusKey = f.isActive ? "active" : "dropped_out";
                  const statusConfig = FARMER_STATUS[statusKey];
                  const survivalPct = f.totalTreesPlanted > 0
                    ? Math.round((f.treesSurviving / f.totalTreesPlanted) * 100)
                    : null;
                  return (
                    <TableRow key={f.id} className={!f.isActive ? "bg-red-50/30" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{f.name}</span>
                          {f.phone && (
                            <span className="text-xs text-muted-foreground">{f.phone}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{f.villageName}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: statusConfig.bgColor,
                            color: statusConfig.color,
                          }}
                        >
                          {statusConfig.label}
                        </Badge>
                        {!f.isActive && f.droppedOutAt && (
                          <div className="text-[10px] text-muted-foreground mt-1 max-w-40">
                            {formatDate(f.droppedOutAt)}
                            {f.dropoutReason && <div className="italic truncate">{f.dropoutReason}</div>}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {f.farmingApproach.map((a) => (
                            <Badge key={a} variant="secondary" className="text-[10px]">
                              {FARMING_APPROACHES[a].label}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {f.totalTreesPlanted > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-medium">
                              {f.treesSurviving}
                              <span className="text-muted-foreground">/{f.totalTreesPlanted}</span>
                            </span>
                            <span
                              className={
                                survivalPct !== null && survivalPct >= 65
                                  ? "text-xs text-green-600"
                                  : survivalPct !== null && survivalPct >= 40
                                    ? "text-xs text-amber-600"
                                    : "text-xs text-red-500"
                              }
                            >
                              {survivalPct}% survival
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {f.trainingReceived.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                            <span className="text-xs font-medium">{f.trainingReceived.length}</span>
                            <span className="text-[10px] text-muted-foreground max-w-35 truncate">
                              {f.trainingReceived[0]}
                              {f.trainingReceived.length > 1 ? ` +${f.trainingReceived.length - 1}` : ""}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {f.lastPOVisit ? formatDate(f.lastPOVisit) : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {f.extensionOfficer || "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredFarmers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No farmers match the current filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
