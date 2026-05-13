"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Loader2, Send } from "lucide-react";
import { useOfficer } from "@/lib/officer";
import { submitWithOfflineFallback } from "@/lib/offline-queue";
import { seedStudents } from "@/lib/srata";

export default function SrataInternshipPage() {
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
      const result = await submitWithOfflineFallback("/api/srata/internships", {
        clientSubmissionId,
        officerId: officer?.id,
        studentId: student?.id,
        cohortId: student?.cohortId,
        hostInstitution: fd.get("host") as string,
        department: (fd.get("department") as string) || null,
        startDate: fd.get("startDate") as string,
        endDate: (fd.get("endDate") as string) || null,
        supervisorName: (fd.get("supName") as string) || null,
        supervisorPhone: (fd.get("supPhone") as string) || null,
        supervisorEmail: (fd.get("supEmail") as string) || null,
        completionStatus: "in_progress",
        recordedBy: officer?.name ?? "Internship Coordinator",
      });
      if (result.queued) toast.info("Saved offline — will sync when online");
      else if (!result.response.ok) {
        const data = await result.response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      } else toast.success("Internship placement registered");
      router.push("/submit/done?kind=srata-internship");
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
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">New Internship Placement</h1>
          <p className="text-xs text-muted-foreground">
            Register a 3-month industry placement.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Placement details</CardTitle>
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
              <Label htmlFor="host">Host institution *</Label>
              <Input id="host" name="host" required placeholder="e.g. Hondo Hondo Lodge" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="department">Department / area</Label>
              <Input id="department" name="department" placeholder="e.g. Housekeeping" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="startDate">Start date *</Label>
              <Input id="startDate" name="startDate" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="endDate">Planned end date</Label>
              <Input id="endDate" name="endDate" type="date" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="supName">Supervisor name</Label>
              <Input id="supName" name="supName" placeholder="e.g. Anna Materu" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="supPhone">Supervisor phone</Label>
              <Input id="supPhone" name="supPhone" type="tel" placeholder="+255 ..." />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="supEmail">Supervisor email</Label>
              <Input id="supEmail" name="supEmail" type="email" />
            </div>

            {error && (
              <div className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end pt-2">
              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Saving..." : "Register placement"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
