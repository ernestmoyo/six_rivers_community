"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wheat, Loader2, Send } from "lucide-react";
import { demoFarmers } from "@/lib/demo-data";
import { CROP_TYPES } from "@/lib/constants";
import { useOfficer } from "@/lib/officer";
import { submitWithOfflineFallback } from "@/lib/offline-queue";
import { uploadOrQueuePhotos } from "@/lib/photos";
import { PhotoInput } from "@/components/shared/photo-input";

export default function SubmitCropCyclePage() {
  const router = useRouter();
  const { officer } = useOfficer();
  const [farmerId, setFarmerId] = useState("");
  const [cropType, setCropType] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setExpectedHarvest(e: React.ChangeEvent<HTMLInputElement>) {
    const plant = e.target.value;
    if (!plant) return;
    const d = new Date(plant + "T00:00:00");
    d.setMonth(d.getMonth() + 3);
    const exp = e.target.form?.querySelector<HTMLInputElement>('[name="expectedHarvestDate"]');
    if (exp) exp.value = d.toISOString().split("T")[0];
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const farmer = demoFarmers.find((f) => f.id === Number(farmerId));
    setSubmitting(true);
    setError(null);
    try {
      const photoUrls = await uploadOrQueuePhotos(photoFiles, "crop-cycle");
      const clientSubmissionId = crypto.randomUUID();
      const result = await submitWithOfflineFallback("/api/crop-cycles", {
        clientSubmissionId,
        officerId: officer?.id,
        farmerId: farmer?.id ?? null,
        farmerName: farmer?.name ?? null,
        villageId: farmer?.villageId ?? null,
        villageName: farmer?.villageName ?? null,
        cropType,
        plantingDate: fd.get("plantingDate") as string,
        expectedHarvestDate: (fd.get("expectedHarvestDate") as string) || null,
        areaHectares: fd.get("area") ? Number(fd.get("area")) : null,
        expectedYieldKg: fd.get("expectedYield") ? Number(fd.get("expectedYield")) : null,
        notes: (fd.get("notes") as string) || null,
        photoUrls,
        recordedBy: officer?.name ?? "Field Officer",
      });
      if (result.queued) toast.info("Saved offline — will sync when online");
      else if (!result.response.ok) {
        const data = await result.response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      } else toast.success(`Crop cycle planted: ${cropType}`);
      router.push("/submit/done?kind=crop-cycle");
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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
          <Wheat className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">New Crop Cycle</h1>
          <p className="text-xs text-muted-foreground">
            Record a short-cycle planting (onions, cassava, maize, etc.).
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Cycle details</CardTitle>
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
              <Label htmlFor="farmer">Farmer *</Label>
              <select
                id="farmer"
                required
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select farmer...</option>
                {demoFarmers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — {f.villageName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="cropType">Crop type *</Label>
              <select
                id="cropType"
                required
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select crop...</option>
                {CROP_TYPES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="plantingDate">Planting date *</Label>
              <Input
                id="plantingDate"
                name="plantingDate"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                onChange={setExpectedHarvest}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="expectedHarvestDate">Expected harvest</Label>
              <Input id="expectedHarvestDate" name="expectedHarvestDate" type="date" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="area">Area (hectares)</Label>
              <Input id="area" name="area" type="number" step="0.05" min={0} placeholder="e.g. 0.3" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="expectedYield">Expected yield (kg)</Label>
              <Input id="expectedYield" name="expectedYield" type="number" min={0} placeholder="e.g. 200" />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} placeholder="Soil prep, inputs used, water plan..." />
            </div>

            <div className="sm:col-span-2">
              <PhotoInput value={photoFiles} onChange={setPhotoFiles} label="Photos (optional)" />
            </div>

            {error && (
              <div className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end pt-2">
              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Submitting..." : "Save cycle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
