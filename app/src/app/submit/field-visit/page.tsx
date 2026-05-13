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
import { ClipboardList, MapPin, Loader2, Send } from "lucide-react";
import { demoVillages } from "@/lib/demo-data";
import { VISIT_TYPES } from "@/lib/constants";
import { useOfficer } from "@/lib/officer";
import { submitWithOfflineFallback } from "@/lib/offline-queue";
import { uploadOrQueuePhotos } from "@/lib/photos";
import { VillagePicker } from "@/components/shared/village-picker";
import { PhotoInput } from "@/components/shared/photo-input";

export default function SubmitFieldVisitPage() {
  const router = useRouter();
  const { officer } = useOfficer();

  const [locked, setLocked] = useState(false);
  const [visitType, setVisitType] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("type")) setVisitType(sp.get("type") ?? "");
    if (sp.get("village")) setSelectedVillageId(sp.get("village") ?? "");
    if (sp.get("locked") === "1") setLocked(true);
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
    const village = demoVillages.find((v) => v.id === Number(selectedVillageId));

    setSubmitting(true);
    setError(null);
    try {
      const photos = await uploadOrQueuePhotos(photoFiles, "field-visit");
      const clientSubmissionId = crypto.randomUUID();
      const result = await submitWithOfflineFallback("/api/field-visits", {
        clientSubmissionId,
        officerId: officer?.id,
        userName: officer?.name ?? "Field Officer",
        villageId: village?.id ?? 0,
        villageName: village?.name ?? "Unknown",
        visitDate: fd.get("date") as string,
        visitType,
        locationLat: gps?.lat ?? null,
        locationLng: gps?.lng ?? null,
        notes: (fd.get("notes") as string) || "",
        photos,
      });

      if (result.queued) {
        toast.info("Saved offline — will sync when online");
      } else if (!result.response.ok) {
        const data = await result.response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      } else {
        toast.success("Field visit submitted!", {
          description: `Saved to the central database · ${village?.name ?? ""}`,
        });
      }

      router.push(
        `/submit/done?kind=field-visit&village=${encodeURIComponent(village?.name ?? "")}`,
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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">Submit a Field Visit</h1>
          <p className="text-xs text-muted-foreground">
            Record a farm check, seedling distribution, community meeting, or other field activity.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Visit details</CardTitle>
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
              <Label htmlFor="visitType">Visit type *</Label>
              <select
                id="visitType"
                required
                disabled={locked}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-60"
                value={visitType}
                onChange={(e) => setVisitType(e.target.value)}
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
              <Label htmlFor="village">Village *</Label>
              <VillagePicker
                value={selectedVillageId}
                onChange={setSelectedVillageId}
                disabled={locked}
                required
              />
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
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Describe what you observed, what was done, any recommendations..."
                rows={4}
              />
            </div>

            <div className="sm:col-span-2">
              <PhotoInput value={photoFiles} onChange={setPhotoFiles} label="Photos (optional)" />
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
                {submitting ? "Submitting..." : "Submit visit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
