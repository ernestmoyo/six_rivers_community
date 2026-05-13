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
import { Radio, Loader2, Send } from "lucide-react";
import { useOfficer } from "@/lib/officer";
import { submitWithOfflineFallback } from "@/lib/offline-queue";

export default function SubmitRadioSessionPage() {
  const router = useRouter();
  const { officer } = useOfficer();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      const clientSubmissionId = crypto.randomUUID();
      const result = await submitWithOfflineFallback("/api/radio-sessions", {
        clientSubmissionId,
        officerId: officer?.id,
        sessionDate: fd.get("sessionDate") as string,
        hostName: (fd.get("hostName") as string) || null,
        topic: (fd.get("topic") as string) || null,
        durationMinutes: fd.get("duration") ? Number(fd.get("duration")) : null,
        estimatedListeners: fd.get("listeners") ? Number(fd.get("listeners")) : null,
        notes: (fd.get("notes") as string) || null,
        recordedBy: officer?.name ?? "Field Officer",
      });
      if (result.queued) toast.info("Saved offline — will sync when online");
      else if (!result.response.ok) {
        const data = await result.response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      } else toast.success("Radio session logged");
      router.push("/submit/done?kind=radio-session");
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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
          <Radio className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">Log Radio Session</h1>
          <p className="text-xs text-muted-foreground">Uhifadhi na Jamii broadcast log.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Broadcast details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sessionDate">Air date *</Label>
              <Input
                id="sessionDate"
                name="sessionDate"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="hostName">Host / presenter</Label>
              <Input id="hostName" name="hostName" placeholder="e.g. Issaya Mwakipenya" />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="topic">Topic *</Label>
              <Input id="topic" name="topic" required placeholder="e.g. Chilli fencing techniques" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" name="duration" type="number" min={1} placeholder="e.g. 60" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="listeners">Estimated listeners</Label>
              <Input id="listeners" name="listeners" type="number" min={0} placeholder="e.g. 8000" />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Guest speakers, listener call-ins, quiz winner..."
              />
            </div>

            {error && (
              <div className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end pt-2">
              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Submitting..." : "Save session"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
