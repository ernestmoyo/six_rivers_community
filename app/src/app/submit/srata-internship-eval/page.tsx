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
import { FileSignature, Loader2, Send } from "lucide-react";
import { useOfficer } from "@/lib/officer";

export default function SrataInternshipEvalPage() {
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
      const res = await fetch("/api/srata/internship-evals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSubmissionId: crypto.randomUUID(),
          officerId: officer?.id,
          internshipId: Number(fd.get("internshipId")),
          competencyScore: fd.get("competency") ? Number(fd.get("competency")) : null,
          punctualityScore: fd.get("punctuality") ? Number(fd.get("punctuality")) : null,
          communicationScore: fd.get("communication") ? Number(fd.get("communication")) : null,
          teamworkScore: fd.get("teamwork") ? Number(fd.get("teamwork")) : null,
          professionalBehaviour: fd.get("behaviour") ? Number(fd.get("behaviour")) : null,
          completionStatus: fd.get("status") as string,
          transitionedToEmployment: fd.get("transitioned") === "yes",
          supervisorFeedback: (fd.get("feedback") as string) || null,
          endDate: (fd.get("endDate") as string) || null,
          recordedBy: officer?.name ?? "Internship Coordinator",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      }
      toast.success("Evaluation saved");
      router.push("/submit/done?kind=srata-internship-eval");
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
          <FileSignature className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">Internship Evaluation</h1>
          <p className="text-xs text-muted-foreground">
            Supervisor feedback at the end of a placement.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Feedback (1–5 scale)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="internshipId">Internship ID *</Label>
              <Input
                id="internshipId"
                name="internshipId"
                type="number"
                required
                placeholder="Numeric ID of the internship row"
              />
              <span className="text-xs text-muted-foreground">
                Look up the ID on the Internships page once we have live data.
              </span>
            </div>

            {[
              { key: "competency", label: "Practical competency" },
              { key: "punctuality", label: "Punctuality" },
              { key: "communication", label: "Communication" },
              { key: "teamwork", label: "Teamwork" },
              { key: "behaviour", label: "Professional behaviour" },
            ].map((f) => (
              <div key={f.key} className="flex flex-col gap-2">
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input id={f.key} name={f.key} type="number" min={1} max={5} step={0.5} />
              </div>
            ))}

            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Completion status *</Label>
              <select
                id="status"
                name="status"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                <option value="completed">Completed successfully</option>
                <option value="partial">Partially completed</option>
                <option value="withdrew">Student withdrew</option>
                <option value="terminated">Terminated by host</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="endDate">End date</Label>
              <Input id="endDate" name="endDate" type="date" />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="transitioned">Transitioned to employment with this host?</Label>
              <select
                id="transitioned"
                name="transitioned"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="feedback">Supervisor feedback</Label>
              <Textarea
                id="feedback"
                name="feedback"
                rows={4}
                placeholder="Strengths, areas to develop, recommendations..."
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
                {submitting ? "Saving..." : "Save evaluation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
