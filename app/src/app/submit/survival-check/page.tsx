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
import { Heart, Loader2, Send } from "lucide-react";
import { demoDistributions, demoFarmers } from "@/lib/demo-data";
import { useOfficer } from "@/lib/officer";
import { submitWithOfflineFallback } from "@/lib/offline-queue";
import { uploadOrQueuePhotos } from "@/lib/photos";
import { PhotoInput } from "@/components/shared/photo-input";

export default function SubmitSurvivalCheckPage() {
  const router = useRouter();
  const { officer } = useOfficer();

  const [distributionId, setDistributionId] = useState("");
  const distribution = demoDistributions.find((d) => d.id === Number(distributionId));
  const farmer = distribution
    ? demoFarmers.find((f) => f.id === distribution.farmerId)
    : null;
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      const photoUrls = await uploadOrQueuePhotos(photoFiles, "survival-check");
      const clientSubmissionId = crypto.randomUUID();
      const result = await submitWithOfflineFallback("/api/survival-checks", {
        clientSubmissionId,
        officerId: officer?.id,
        distributionId: distribution?.id ?? null,
        farmerName: farmer?.name ?? distribution?.farmerName ?? null,
        villageName: farmer?.villageName ?? null,
        checkDate: fd.get("checkDate") as string,
        survivingCount: Number(fd.get("survivingCount")),
        totalCount: distribution?.quantity ?? (fd.get("totalCount") ? Number(fd.get("totalCount")) : null),
        notes: (fd.get("notes") as string) || null,
        photoUrls,
        recordedBy: officer?.name ?? "Field Officer",
      });
      if (result.queued) toast.info("Saved offline — will sync when online");
      else if (!result.response.ok) {
        const data = await result.response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      } else toast.success("Survival check recorded");
      router.push("/submit/done?kind=survival-check");
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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
          <Heart className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">Survival Check</h1>
          <p className="text-xs text-muted-foreground">
            Count surviving seedlings on a previously distributed batch.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Check details</CardTitle>
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
              <Label htmlFor="distribution">Distribution *</Label>
              <select
                id="distribution"
                required
                value={distributionId}
                onChange={(e) => setDistributionId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select distribution...</option>
                {demoDistributions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.farmerName} · {d.species} ({d.quantity}) · {d.distributionDate}
                  </option>
                ))}
              </select>
              {distribution && (
                <span className="text-xs text-muted-foreground">
                  Distributed {distribution.quantity} {distribution.species} on{" "}
                  {distribution.distributionDate}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="checkDate">Check date *</Label>
              <Input
                id="checkDate"
                name="checkDate"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="survivingCount">Surviving count *</Label>
              <Input
                id="survivingCount"
                name="survivingCount"
                type="number"
                required
                min={0}
                placeholder="e.g. 18"
              />
            </div>

            {!distribution && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="totalCount">Total originally planted</Label>
                <Input id="totalCount" name="totalCount" type="number" min={0} placeholder="e.g. 25" />
              </div>
            )}

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Cause of losses, drought, pests, recommended replanting..."
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

            <div className="sm:col-span-2 flex justify-end pt-2">
              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Submitting..." : "Save check"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
