"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Beef, MapPin, Loader2, Send, AlertTriangle } from "lucide-react";
import { demoVillages } from "@/lib/demo-data";
import { useOfficer } from "@/lib/officer";
import { submitWithOfflineFallback } from "@/lib/offline-queue";
import { uploadOrQueuePhotos } from "@/lib/photos";
import { VillagePicker } from "@/components/shared/village-picker";
import { PhotoInput } from "@/components/shared/photo-input";

export default function SubmitCattleIncidentPage() {
  const router = useRouter();
  const { officer } = useOfficer();

  const [villageId, setVillageId] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("village")) setVillageId(sp.get("village") ?? "");
  }, []);

  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function captureGPS() {
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported by this device");
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
            ? "Location access denied — enable in phone settings"
            : "Unable to get location — try again",
        );
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const village = demoVillages.find((v) => v.id === Number(villageId));

    setSubmitting(true);
    setError(null);
    try {
      const photoUrls = await uploadOrQueuePhotos(photoFiles, "cattle-incident");
      const clientSubmissionId = crypto.randomUUID();
      const result = await submitWithOfflineFallback("/api/cattle-incidents", {
        clientSubmissionId,
        officerId: officer?.id,
        villageId: village?.id ?? null,
        villageName: village?.name ?? null,
        incidentType: fd.get("incidentType"),
        severity: fd.get("severity"),
        date: fd.get("date"),
        estimatedHerdSize: fd.get("herdSize") ? Number(fd.get("herdSize")) : null,
        description: (fd.get("description") as string) || null,
        locationLat: gps?.lat ?? null,
        locationLng: gps?.lng ?? null,
        photoUrls,
        reportedBy: officer?.name ?? "Field Officer",
        notifyEmail: true,
      });

      if (result.queued) {
        toast.info("Saved offline — will sync when online");
      } else if (!result.response.ok) {
        const data = await result.response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      } else {
        const data = await result.response.json();
        const emailNote = data?.email?.sent ? " · email alert sent" : "";
        toast.success("Cattle incident reported!", {
          description: `Saved to database${emailNote}`,
        });
      }

      router.push(
        `/submit/done?kind=cattle-incident&village=${encodeURIComponent(village?.name ?? "")}`,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      toast.error("Could not submit", { description: msg });
      setError(msg);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
          <Beef className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">Report a Cattle Incident</h1>
          <p className="text-xs text-muted-foreground">
            Mbarali District · Use this when you witness grazing, crop damage, water conflict, or corridor blockage.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          High-severity reports automatically trigger an email alert to the field management team.
        </span>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Incident details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Officer</Label>
              <div className="flex h-10 items-center rounded-md border border-input bg-muted/40 px-3 text-sm">
                {officer?.name ?? "(set up profile)"}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="village">Village *</Label>
              <VillagePicker
                value={villageId}
                onChange={setVillageId}
                required
                sector="mbarali"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="incidentType">Incident type *</Label>
              <select
                id="incidentType"
                name="incidentType"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select type...</option>
                <option value="restricted_grazing">Restricted area grazing</option>
                <option value="crop_damage">Crop damage</option>
                <option value="water_conflict">Water point conflict</option>
                <option value="corridor_blockage">Corridor blockage</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="severity">Severity *</Label>
              <select
                id="severity"
                name="severity"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select severity...</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="herdSize">Estimated herd size</Label>
              <Input id="herdSize" name="herdSize" type="number" min={1} placeholder="e.g. 150" />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>GPS location (optional)</Label>
              <Button
                type="button"
                variant="secondary"
                className="gap-2 w-fit"
                onClick={captureGPS}
                disabled={gpsLoading}
              >
                {gpsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {gpsLoading ? "Getting location..." : gps ? "Location captured" : "Capture GPS"}
              </Button>
              {gps && (
                <span className="text-xs text-green-700">
                  {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)}
                </span>
              )}
              {gpsError && <span className="text-xs text-red-500">{gpsError}</span>}
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the incident: what happened, how many cattle, any damage..."
                rows={4}
              />
            </div>

            <div className="sm:col-span-2">
              <PhotoInput value={photoFiles} onChange={setPhotoFiles} label="Photo evidence (optional)" />
            </div>

            {error && (
              <div className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? "Submitting..." : "Submit report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
