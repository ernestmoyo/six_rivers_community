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
import { GraduationCap, Loader2, Send } from "lucide-react";
import { useOfficer } from "@/lib/officer";
import { submitWithOfflineFallback } from "@/lib/offline-queue";
import { SRATA_LEVELS, seedStudents } from "@/lib/srata";

export default function SrataExitSurveyPage() {
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
      const student = seedStudents.find((s) => s.id === Number(fd.get("studentId")));
      const clientSubmissionId = crypto.randomUUID();
      const result = await submitWithOfflineFallback("/api/srata/exit-surveys", {
        clientSubmissionId,
        officerId: officer?.id,
        studentId: student?.id,
        cohortId: student?.cohortId,
        surveyDate: fd.get("surveyDate") as string,
        selfRatedEnglish: (fd.get("english") as string) || null,
        selfRatedComputer: (fd.get("computer") as string) || null,
        confidenceLevel: (fd.get("confidence") as string) || null,
        jobReadiness: (fd.get("readiness") as string) || null,
        preferredEmployerType: (fd.get("preferred") as string) || null,
        immediatePlan: (fd.get("plan") as string) || null,
        notes: (fd.get("notes") as string) || null,
        recordedBy: officer?.name ?? "M&E Specialist",
      });
      if (result.queued) toast.info("Saved offline — will sync when online");
      else if (!result.response.ok) {
        const data = await result.response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      } else toast.success("Exit survey captured");
      router.push("/submit/done?kind=srata-exit-survey");
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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">Exit Survey</h1>
          <p className="text-xs text-muted-foreground">
            Graduation-day exit survey. Sets baseline for tracer studies.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Self-assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="studentId">Student *</Label>
              <select
                id="studentId"
                name="studentId"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select student...</option>
                {seedStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} — {s.cohortName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="surveyDate">Survey date *</Label>
              <Input
                id="surveyDate"
                name="surveyDate"
                type="date"
                required
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="readiness">Job readiness self-rating</Label>
              <select
                id="readiness"
                name="readiness"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                <option value="Very ready">Very ready</option>
                <option value="Ready">Ready</option>
                <option value="Somewhat ready">Somewhat ready</option>
                <option value="Not ready">Not ready</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="english">English (post)</Label>
              <select
                id="english"
                name="english"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {SRATA_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="computer">Computer (post)</Label>
              <select
                id="computer"
                name="computer"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {SRATA_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confidence">Overall confidence</Label>
              <select
                id="confidence"
                name="confidence"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                <option value="Very high">Very high</option>
                <option value="High">High</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="preferred">Preferred employer type</Label>
              <Input id="preferred" name="preferred" placeholder="e.g. Lodge, restaurant, cruise" />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="plan">Immediate plan after graduation</Label>
              <Textarea id="plan" name="plan" rows={3} placeholder="e.g. Apply at 3 lodges in Ifakara TC" />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="notes">Other notes</Label>
              <Textarea id="notes" name="notes" rows={2} />
            </div>

            {error && (
              <div className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end pt-2">
              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Saving..." : "Save exit survey"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
