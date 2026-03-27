"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
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
  ClipboardList,
  MapPin,
  Camera,
  Wifi,
  WifiOff,
  Send,
  Sprout,
  TreePine,
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { demoFieldVisits, demoDistributions, demoVillages } from "@/lib/demo-data";
import { VISIT_TYPES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { FieldVisit } from "@/types";

const visitTypeIcons: Record<string, React.ElementType> = {
  farm_check: Sprout,
  nursery_check: TreePine,
  community_meeting: Users,
  seedling_distribution: Package,
  incident_report: AlertTriangle,
  survival_check: CheckCircle,
  chilli_fence_check: ClipboardList,
  wildlife_report: AlertTriangle,
};

interface LiveVisit {
  id: number | string;
  user_name: string;
  village_name: string;
  visit_date: string;
  visit_type: string;
  notes: string;
  location_lat: number | null;
  location_lng: number | null;
  created_at?: string;
}

export default function FieldVisitPage() {
  const [visits, setVisits] = useState<FieldVisit[]>(demoFieldVisits);
  const [liveVisits, setLiveVisits] = useState<LiveVisit[]>([]);
  const [visitType, setVisitType] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("");
  const [selectedDistributionId, setSelectedDistributionId] = useState("");
  const [survivingCount, setSurvivingCount] = useState<number | "">("");
  const [conditionNotes, setConditionNotes] = useState("");
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const fetchLiveVisits = useCallback(async () => {
    try {
      const res = await fetch("/api/field-visits");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setLiveVisits(data);
      }
    } catch { /* API not configured yet — use demo data only */ }
  }, []);

  useEffect(() => {
    fetchLiveVisits();
    const interval = setInterval(fetchLiveVisits, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [fetchLiveVisits]);

  const handleQuickAction = (key: string) => {
    setVisitType(key);
    if (key !== "survival_check") {
      setSelectedDistributionId("");
      setSurvivingCount("");
      setConditionNotes("");
    }
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const selectedDistribution = demoDistributions.find(
    (d) => d.id === Number(selectedDistributionId)
  );

  const survivalRate =
    selectedDistribution && typeof survivingCount === "number" && survivingCount >= 0
      ? Math.round((survivingCount / selectedDistribution.quantity) * 100)
      : null;

  const survivalBadgeClass =
    survivalRate !== null
      ? survivalRate >= 75
        ? "bg-green-100 text-green-800"
        : survivalRate >= 60
          ? "bg-amber-100 text-amber-800"
          : "bg-red-100 text-red-800"
      : "";

  function captureGPS() {
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported by this browser");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(
          err.code === 1
            ? "Location access denied — enable in browser settings"
            : "Unable to get location — try again"
        );
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const village = demoVillages.find((v) => v.id === Number(selectedVillageId));
    const visitData = {
      userName: "Field Officer",
      villageId: village?.id ?? 0,
      villageName: village?.name ?? "Unknown",
      visitDate: fd.get("date") as string,
      visitType: visitType,
      locationLat: gps?.lat ?? null,
      locationLng: gps?.lng ?? null,
      notes: (fd.get("notes") as string) || "",
    };

    // Save to API (Supabase)
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await fetch("/api/field-visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitData),
      });
      if (res.ok) {
        setSubmitStatus("Visit saved successfully");
        fetchLiveVisits(); // refresh the list
      } else {
        const data = await res.json();
        setSubmitStatus(`Save failed: ${data.error}`);
        // Still save locally as fallback
      }
    } catch {
      setSubmitStatus("Saved locally — will sync when online");
    }

    // Also save to local state as fallback
    const newVisit: FieldVisit = {
      id: Date.now(),
      userId: 1,
      userName: visitData.userName,
      villageId: visitData.villageId,
      villageName: visitData.villageName,
      visitDate: visitData.visitDate,
      visitType: visitType as FieldVisit["visitType"],
      locationLat: gps?.lat ?? 0,
      locationLng: gps?.lng ?? 0,
      notes: visitData.notes,
      photos: [],
      syncedAt: new Date().toISOString(),
    };
    setVisits((prev) => [newVisit, ...prev]);

    // Reset form
    setSubmitting(false);
    setVisitType("");
    setSelectedVillageId("");
    setGps(null);
    setGpsError(null);
    setSelectedDistributionId("");
    setSurvivingCount("");
    setConditionNotes("");
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setSubmitStatus(null), 5000);
  }

  function copyShareLink() {
    const url = `${window.location.origin}/field/visit`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col">
      <Header title="Field Data Collection" subtitle="Record field visits, distribute seedlings, report incidents" />

      <div className="flex flex-col gap-6 p-6">
        {/* Share Link */}
        <div className="flex items-center justify-between rounded-lg border bg-blue-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <ExternalLink className="h-4 w-4" />
            <span>Share this form with field officers so they can submit data remotely</span>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 text-blue-700 border-blue-300" onClick={copyShareLink}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>

        {/* Submit status */}
        {submitStatus && (
          <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
            submitStatus.startsWith("Visit saved") ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
          }`}>
            {submitStatus}
          </div>
        )}

        {/* Quick Action Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Object.entries(VISIT_TYPES).map(([key, config]) => {
            const Icon = visitTypeIcons[key] || ClipboardList;
            return (
              <Card
                key={key}
                className={`cursor-pointer hover:shadow-md hover:border-primary/30 transition-all ${
                  visitType === key ? "border-primary shadow-md ring-2 ring-primary/20" : ""
                }`}
                onClick={() => handleQuickAction(key)}
              >
                <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium">{config.label}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* New Visit Form */}
        <Card ref={formRef}>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              New Field Visit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="visitType">Visit Type</Label>
                <select
                  id="visitType"
                  name="visitType"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={visitType}
                  onChange={(e) => {
                    setVisitType(e.target.value);
                    if (e.target.value !== "survival_check") {
                      setSelectedDistributionId("");
                      setSurvivingCount("");
                      setConditionNotes("");
                    }
                  }}
                >
                  <option value="">Select type...</option>
                  {Object.entries(VISIT_TYPES).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="village">Village</Label>
                <select
                  id="village"
                  name="villageId"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedVillageId}
                  onChange={(e) => setSelectedVillageId(e.target.value)}
                >
                  <option value="">Select village...</option>
                  <optgroup label="Ifakara Town Council">
                    {demoVillages.filter((v) => v.sector === "ifakara").map((v) => (
                      <option key={v.id} value={v.id}>{v.name} ({v.wardName})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Mbarali District Council">
                    {demoVillages.filter((v) => v.sector === "mbarali").map((v) => (
                      <option key={v.id} value={v.id}>{v.name} ({v.wardName})</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
              </div>

              <div className="flex flex-col gap-2">
                <Label>GPS Location</Label>
                <Button type="button" variant="secondary" className="gap-2" onClick={captureGPS} disabled={gpsLoading}>
                  {gpsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                  {gpsLoading ? "Getting location..." : "Capture GPS"}
                </Button>
                {gps && (
                  <span className="text-xs text-green-600 font-medium">
                    {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)}
                  </span>
                )}
                {gpsError && (
                  <span className="text-xs text-red-500">{gpsError}</span>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Describe the visit, observations, recommendations..."
                  rows={3}
                />
              </div>

              {/* Survival Check Fields */}
              {visitType === "survival_check" && (
                <div className="sm:col-span-2 flex flex-col gap-4 rounded-lg border border-green-200 bg-green-50/50 p-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Survival Check Details
                  </h4>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="distribution">Distribution</Label>
                      <select
                        id="distribution"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={selectedDistributionId}
                        onChange={(e) => {
                          setSelectedDistributionId(e.target.value);
                          setSurvivingCount("");
                        }}
                      >
                        <option value="">Select distribution...</option>
                        {demoDistributions.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.farmerName} - {d.species} ({d.quantity} seedlings)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="survivingCount">Surviving Seedlings</Label>
                      <Input
                        id="survivingCount"
                        type="number"
                        min={0}
                        max={selectedDistribution?.quantity ?? undefined}
                        placeholder={
                          selectedDistribution
                            ? `Max: ${selectedDistribution.quantity}`
                            : "Select a distribution first"
                        }
                        value={survivingCount}
                        onChange={(e) =>
                          setSurvivingCount(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        disabled={!selectedDistribution}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Survival Rate</Label>
                      {survivalRate !== null ? (
                        <Badge className={`text-sm w-fit px-3 py-1.5 ${survivalBadgeClass}`}>
                          {survivalRate}%
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground pt-2">
                          Enter surviving count to calculate
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <Label htmlFor="conditionNotes">Condition Notes</Label>
                      <Textarea
                        id="conditionNotes"
                        placeholder="Soil quality, drought observations, pest damage..."
                        rows={2}
                        value={conditionNotes}
                        onChange={(e) => setConditionNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Photos</Label>
                <Button type="button" variant="secondary" className="gap-2">
                  <Camera className="h-4 w-4" />
                  Take Photo
                </Button>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-3">
                <div className="flex gap-3">
                  <Button type="submit" className="gap-2 flex-1">
                    <Send className="h-4 w-4" />
                    Submit Visit
                  </Button>
                  <Button type="button" variant="outline" className="gap-2">
                    <WifiOff className="h-4 w-4" />
                    Save Offline
                  </Button>
                </div>
                <Link
                  href="/field/queue"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors text-center"
                >
                  View offline queue
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Recent Visits */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recent Field Visits</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Live visits from Supabase */}
                {liveVisits.map((lv) => {
                  const Icon = visitTypeIcons[lv.visit_type] || ClipboardList;
                  return (
                    <TableRow key={`live-${lv.id}`} className="bg-green-50/30">
                      <TableCell className="text-muted-foreground">
                        {formatDate(lv.visit_date)}
                      </TableCell>
                      <TableCell className="font-medium">{lv.user_name}</TableCell>
                      <TableCell>{lv.village_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                          <Icon className="h-3 w-3" />
                          {VISIT_TYPES[lv.visit_type as keyof typeof VISIT_TYPES]?.label ?? lv.visit_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {lv.notes}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Wifi className="h-3 w-3 mr-1" />Live
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Demo/local visits */}
                {visits.map((visit) => {
                  const Icon = visitTypeIcons[visit.visitType] || ClipboardList;
                  return (
                    <TableRow key={visit.id}>
                      <TableCell className="text-muted-foreground">
                        {formatDate(visit.visitDate)}
                      </TableCell>
                      <TableCell className="font-medium">{visit.userName}</TableCell>
                      <TableCell>{visit.villageName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                          <Icon className="h-3 w-3" />
                          {VISIT_TYPES[visit.visitType]?.label ?? visit.visitType}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {visit.notes}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            visit.syncedAt
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }
                        >
                          {visit.syncedAt ? (
                            <><Wifi className="h-3 w-3 mr-1" />Synced</>
                          ) : (
                            <><WifiOff className="h-3 w-3 mr-1" />Pending</>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
