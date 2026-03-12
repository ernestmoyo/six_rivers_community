"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { KPICard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Beef, AlertTriangle, MapPin, Plus } from "lucide-react";
import { demoCattleIncidents, demoVillages } from "@/lib/demo-data";
import { INCIDENT_TYPES, SEVERITY_LEVELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { CattleIncident } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function CattlePage() {
  const [incidents, setIncidents] = useState<CattleIncident[]>(demoCattleIncidents);
  const [open, setOpen] = useState(false);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);

  const highSeverity = incidents.filter((i) => i.severity === "high").length;
  const totalHerdSize = incidents.reduce((sum, i) => sum + (i.estimatedHerdSize || 0), 0);

  const byType = Object.entries(INCIDENT_TYPES).map(([key, config]) => ({
    name: config.label,
    value: incidents.filter((i) => i.incidentType === key).length,
    color: config.color,
  }));

  const bySeverity = Object.entries(SEVERITY_LEVELS).map(([key, config]) => ({
    name: config.label,
    value: incidents.filter((i) => i.severity === key).length,
    color: config.color,
  }));

  const usanguVillages = demoVillages.filter((v) => v.sector === "mbarali");

  function captureGPS() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Unable to get GPS location")
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const village = usanguVillages.find((v) => v.id === Number(fd.get("villageId")));
    const newIncident: CattleIncident = {
      id: Date.now(),
      locationLat: gps?.lat ?? 0,
      locationLng: gps?.lng ?? 0,
      villageId: village?.id ?? null,
      villageName: village?.name ?? null,
      incidentType: fd.get("incidentType") as CattleIncident["incidentType"],
      severity: fd.get("severity") as CattleIncident["severity"],
      date: fd.get("date") as string,
      estimatedHerdSize: fd.get("herdSize") ? Number(fd.get("herdSize")) : null,
      description: (fd.get("description") as string) || null,
      photoUrl: null,
      reportedBy: "Field Officer",
    };
    setIncidents((prev) => [newIncident, ...prev]);
    setGps(null);
    setOpen(false);
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Cattle Pressure Module"
        subtitle="Mbarali District — Monitoring cattle-related incidents near Ruaha NP"
      />

      <div className="flex flex-col gap-6 p-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Incidents"
            value={incidents.length}
            icon={Beef}
            trend="up"
            trendValue="+3 this month"
            iconClassName="bg-red-100 text-red-600"
          />
          <KPICard
            title="High Severity"
            value={highSeverity}
            icon={AlertTriangle}
            iconClassName="bg-orange-100 text-orange-600"
          />
          <KPICard
            title="Est. Total Herd"
            value={totalHerdSize.toLocaleString()}
            icon={Beef}
            subtitle="across all incidents"
          />
          <KPICard
            title="Villages Affected"
            value={new Set(incidents.map((i) => i.villageId)).size}
            icon={MapPin}
            iconClassName="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Incidents by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byType.filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name}: ${value}`}
                      isAnimationActive={false}
                    >
                      {byType.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Incidents by Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bySeverity} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="value" name="Incidents" radius={[0, 4, 4, 0]}>
                      {bySeverity.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incident Table */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent Incidents</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
              <Plus className="h-4 w-4" />
              Report Incident
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Report Cattle Incident</DialogTitle>
                <DialogDescription>Record a new cattle-related incident in Mbarali District.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input id="date" name="date" type="date" required />
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
                  <Label htmlFor="villageId">Village *</Label>
                  <select
                    id="villageId"
                    name="villageId"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select village...</option>
                    {usanguVillages.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="incidentType">Incident Type *</Label>
                  <select
                    id="incidentType"
                    name="incidentType"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select type...</option>
                    <option value="restricted_grazing">Restricted Area Grazing</option>
                    <option value="crop_damage">Crop Damage</option>
                    <option value="water_conflict">Water Point Conflict</option>
                    <option value="corridor_blockage">Corridor Blockage</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="severity">Severity *</Label>
                  <select
                    id="severity"
                    name="severity"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select severity...</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="herdSize">Estimated Herd Size</Label>
                  <Input id="herdSize" name="herdSize" type="number" min="1" placeholder="e.g. 150" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Describe the incident..." rows={3} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="photo">Photo</Label>
                  <Input id="photo" name="photo" type="file" accept="image/*" />
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                  <Button type="submit">Save Incident</Button>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="text-right">Herd Size</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reported By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(incident.date)}
                    </TableCell>
                    <TableCell className="font-medium">{incident.villageName}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: `${INCIDENT_TYPES[incident.incidentType].color}20`,
                          color: INCIDENT_TYPES[incident.incidentType].color,
                        }}
                      >
                        {INCIDENT_TYPES[incident.incidentType].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${
                          incident.severity === "high"
                            ? "bg-red-100 text-red-800"
                            : incident.severity === "moderate"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {SEVERITY_LEVELS[incident.severity].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ~{incident.estimatedHerdSize}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {incident.description}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {incident.reportedBy}
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
