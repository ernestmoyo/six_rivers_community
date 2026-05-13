"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Award, Loader2, Send } from "lucide-react";
import { useOfficer } from "@/lib/officer";
import { submitWithOfflineFallback } from "@/lib/offline-queue";
import { SRATA_TRACE_WINDOWS, seedStudents } from "@/lib/srata";

export default function SrataTracerPage() {
  return (
    <Suspense fallback={<div className="text-xs text-muted-foreground">Loading…</div>}>
      <SrataTracerInner />
    </Suspense>
  );
}

function SrataTracerInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { officer } = useOfficer();

  const [studentId, setStudentId] = useState("");
  const [window, setWindow] = useState("3m");
  const [employed, setEmployed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = params.get("student");
    const w = params.get("window");
    if (s) setStudentId(s);
    if (w) setWindow(w);
  }, [params]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      const student = seedStudents.find((s) => s.id === Number(studentId));
      const clientSubmissionId = crypto.randomUUID();
      const result = await submitWithOfflineFallback("/api/srata/tracers", {
        clientSubmissionId,
        officerId: officer?.id,
        studentId: student?.id,
        cohortId: student?.cohortId,
        traceWindow: window,
        traceDate: fd.get("traceDate") as string,
        contactedVia: (fd.get("contactedVia") as string) || null,
        employed,
        employer: employed ? ((fd.get("employer") as string) || null) : null,
        jobTitle: employed ? ((fd.get("jobTitle") as string) || null) : null,
        sector: employed ? ((fd.get("sector") as string) || null) : null,
        hospitalityRelated: employed ? fd.get("hospitalityRelated") === "yes" : null,
        monthlyIncomeTSh: employed && fd.get("income") ? Number(fd.get("income")) : null,
        jobRetention: employed ? fd.get("retention") === "yes" : null,
        promoted: employed ? fd.get("promoted") === "yes" : null,
        selfEmployed: fd.get("selfEmployed") === "yes",
        businessType: (fd.get("businessType") as string) || null,
        furtherEducation: fd.get("furtherEducation") === "yes",
        notes: (fd.get("notes") as string) || null,
        recordedBy: officer?.name ?? "M&E Specialist",
      });
      if (result.queued) toast.info("Saved offline — will sync when online");
      else if (!result.response.ok) {
        const data = await result.response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      } else toast.success("Tracer captured");
      router.push("/submit/done?kind=srata-tracer");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      toast.error("Could not submit", { description: msg });
      setError(msg);
      setSubmitting(false);
    }
  }

  const graduates = seedStudents.filter((s) => s.status === "graduated");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">Graduate Tracer</h1>
          <p className="text-xs text-muted-foreground">
            3 / 6 / 12 / 24-month follow-up on a graduate.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Tracer details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="student">Graduate *</Label>
              <select
                id="student"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select graduate...</option>
                {graduates.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} — {s.cohortName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="window">Tracer window *</Label>
              <select
                id="window"
                value={window}
                onChange={(e) => setWindow(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {SRATA_TRACE_WINDOWS.filter((w) => w.value !== "exit").map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="traceDate">Trace date *</Label>
              <Input
                id="traceDate"
                name="traceDate"
                type="date"
                required
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contactedVia">Contacted via</Label>
              <select
                id="contactedVia"
                name="contactedVia"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                <option value="phone">Phone call</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="in_person">In person</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label className="text-sm">Is the graduate currently employed?</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={employed ? "default" : "outline"}
                  onClick={() => setEmployed(true)}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={!employed ? "default" : "outline"}
                  onClick={() => setEmployed(false)}
                >
                  No
                </Button>
              </div>
            </div>

            {employed && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="employer">Employer</Label>
                  <Input id="employer" name="employer" placeholder="e.g. Hondo Hondo Lodge" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="jobTitle">Job title</Label>
                  <Input id="jobTitle" name="jobTitle" placeholder="e.g. Housekeeper" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Input id="sector" name="sector" placeholder="e.g. Hospitality" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="hospitalityRelated">Hospitality-related?</Label>
                  <select
                    id="hospitalityRelated"
                    name="hospitalityRelated"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="income">Monthly income (TSh)</Label>
                  <Input id="income" name="income" type="number" min={0} placeholder="e.g. 280000" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="retention">Still in same job since last tracer?</Label>
                  <select
                    id="retention"
                    name="retention"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="promoted">Promoted / raise since last tracer?</Label>
                  <select
                    id="promoted"
                    name="promoted"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="selfEmployed">Self-employed / running own business?</Label>
              <select
                id="selfEmployed"
                name="selfEmployed"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="businessType">Business type (if any)</Label>
              <Input id="businessType" name="businessType" placeholder="e.g. food vendor" />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="furtherEducation">Pursuing further education?</Label>
              <select
                id="furtherEducation"
                name="furtherEducation"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} placeholder="Context, follow-ups needed..." />
            </div>

            {error && (
              <div className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end pt-2">
              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Saving..." : "Save tracer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
