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
import { BarChart3, Loader2, Send } from "lucide-react";
import { useOfficer } from "@/lib/officer";
import { submitWithOfflineFallback } from "@/lib/offline-queue";
import { SRATA_ASSESSMENT_KINDS, seedStudents } from "@/lib/srata";

export default function SrataAssessmentPage() {
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
      const result = await submitWithOfflineFallback("/api/srata/assessments", {
        clientSubmissionId,
        officerId: officer?.id,
        studentId: student?.id,
        cohortId: student?.cohortId,
        kind: fd.get("kind") as string,
        score: Number(fd.get("score")),
        maxScore: Number(fd.get("maxScore") ?? 100),
        assessmentDate: fd.get("date") as string,
        notes: (fd.get("notes") as string) || null,
        recordedBy: officer?.name ?? "Trainer",
      });
      if (result.queued) toast.info("Saved offline — will sync when online");
      else if (!result.response.ok) {
        const data = await result.response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      } else toast.success("Assessment recorded");
      router.push("/submit/done?kind=srata-assessment");
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
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">Record Assessment</h1>
          <p className="text-xs text-muted-foreground">
            Score on an English, computer, practical, or internal assessment.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Assessment details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
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
              <Label htmlFor="kind">Kind *</Label>
              <select
                id="kind"
                name="kind"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select kind...</option>
                {SRATA_ASSESSMENT_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="score">Score *</Label>
              <Input id="score" name="score" type="number" min={0} required placeholder="e.g. 72" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="maxScore">Max score</Label>
              <Input id="maxScore" name="maxScore" type="number" min={1} defaultValue={100} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={2} placeholder="Strengths, gaps, recommendations..." />
            </div>

            {error && (
              <div className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end pt-2">
              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Saving..." : "Save assessment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
