"use client";

export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Loader2, Send } from "lucide-react";
import { useOfficer } from "@/lib/officer";
import { submitWithOfflineFallback } from "@/lib/offline-queue";
import { seedCohorts, seedStudents } from "@/lib/srata";

export default function SrataAttendancePage() {
  const router = useRouter();
  const { officer } = useOfficer();
  const activeCohort = seedCohorts.find((c) => c.status === "in_training") ?? seedCohorts[0];

  const [cohortId, setCohortId] = useState(String(activeCohort?.id ?? ""));
  const [present, setPresent] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const students = useMemo(
    () => seedStudents.filter((s) => String(s.cohortId) === cohortId),
    [cohortId],
  );

  function toggle(id: number) {
    setPresent((p) => ({ ...p, [id]: !p[id] }));
  }

  function markAll(value: boolean) {
    const next: Record<number, boolean> = {};
    students.forEach((s) => (next[s.id] = value));
    setPresent(next);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      const clientSubmissionId = crypto.randomUUID();
      const entries = students.map((s) => ({
        studentId: s.id,
        present: !!present[s.id],
      }));
      const result = await submitWithOfflineFallback("/api/srata/attendance", {
        clientSubmissionId,
        officerId: officer?.id,
        cohortId: Number(cohortId),
        sessionDate: fd.get("sessionDate") as string,
        entries,
        recordedBy: officer?.name ?? "Trainer",
      });
      if (result.queued) toast.info("Saved offline — will sync when online");
      else if (!result.response.ok) {
        const data = await result.response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      } else {
        const presentCount = entries.filter((e) => e.present).length;
        toast.success(`Attendance saved: ${presentCount}/${entries.length} present`);
      }
      router.push("/submit/done?kind=srata-attendance");
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
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">SRATA Attendance</h1>
          <p className="text-xs text-muted-foreground">
            Batch-mark attendance for a cohort session.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Session details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="cohort">Cohort *</Label>
                <select
                  id="cohort"
                  value={cohortId}
                  onChange={(e) => setCohortId(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {seedCohorts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="sessionDate">Session date *</Label>
                <Input
                  id="sessionDate"
                  name="sessionDate"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div className="flex flex-col justify-end gap-2">
                <Label>Quick actions</Label>
                <div className="flex gap-1.5">
                  <Button type="button" size="sm" variant="outline" onClick={() => markAll(true)}>
                    All present
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => markAll(false)}>
                    All absent
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 rounded-md border">
              {students.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center justify-between border-b last:border-b-0 px-3 py-2 text-sm hover:bg-muted/40"
                >
                  <span>{s.fullName}</span>
                  <input
                    type="checkbox"
                    checked={!!present[s.id]}
                    onChange={() => toggle(s.id)}
                    className="rounded border-input"
                  />
                </label>
              ))}
              {students.length === 0 && (
                <p className="p-3 text-xs text-muted-foreground">
                  No students in this cohort yet.
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            <div className="flex justify-end">
              <Button type="submit" className="gap-2" disabled={submitting || students.length === 0}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Saving..." : "Save attendance"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
