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
import { UserPlus, Loader2, Send } from "lucide-react";
import { useOfficer } from "@/lib/officer";
import { submitWithOfflineFallback } from "@/lib/offline-queue";
import {
  SRATA_EDUCATION_LEVELS,
  SRATA_EMPLOYMENT_STATUSES,
  SRATA_LEVELS,
  SRATA_PATHWAYS,
  seedCohorts,
} from "@/lib/srata";

export default function SrataEnrollmentPage() {
  const router = useRouter();
  const { officer } = useOfficer();
  const activeCohort = seedCohorts.find((c) => c.status === "in_training") ?? seedCohorts[0];

  const [cohortId, setCohortId] = useState(String(activeCohort?.id ?? ""));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      const cohort = seedCohorts.find((c) => c.id === Number(cohortId));
      const clientSubmissionId = crypto.randomUUID();
      const result = await submitWithOfflineFallback("/api/srata/students", {
        clientSubmissionId,
        officerId: officer?.id,
        cohortId: cohort?.id,
        cohortName: cohort?.name,
        fullName: fd.get("fullName") as string,
        sex: fd.get("sex") as string,
        dateOfBirth: (fd.get("dob") as string) || null,
        district: (fd.get("district") as string) || null,
        region: (fd.get("region") as string) || null,
        educationLevel: (fd.get("educationLevel") as string) || null,
        householdSize: fd.get("householdSize") ? Number(fd.get("householdSize")) : null,
        maritalStatus: (fd.get("maritalStatus") as string) || null,
        phone: (fd.get("phone") as string) || null,
        hasSmartphone: fd.get("hasSmartphone") === "on",
        hasEmail: !!fd.get("email"),
        email: (fd.get("email") as string) || null,
        employmentStatusBefore: (fd.get("employmentBefore") as string) || null,
        monthlyIncomeBeforeTSh: fd.get("incomeBefore") ? Number(fd.get("incomeBefore")) : null,
        englishLevelBefore: (fd.get("englishLevel") as string) || null,
        computerLevelBefore: (fd.get("computerLevel") as string) || null,
        hospitalityExperience: fd.get("hospExperience") === "on",
        careerGoal: (fd.get("careerGoal") as string) || null,
        preferredPathway: (fd.get("pathway") as string) || null,
        enrolledAt: (fd.get("enrolledAt") as string) || new Date().toISOString().slice(0, 10),
        recordedBy: officer?.name ?? "Trainer",
      });
      if (result.queued) toast.info("Saved offline — will sync when online");
      else if (!result.response.ok) {
        const data = await result.response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      } else toast.success("Student enrolled");
      router.push("/submit/done?kind=srata-enrollment");
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
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">SRATA Enrollment</h1>
          <p className="text-xs text-muted-foreground">
            Baseline data for a new SRATA Academy student.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Student baseline</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Recorded by</Label>
              <div className="flex h-10 items-center rounded-md border border-input bg-muted/40 px-3 text-sm">
                {officer?.name ?? "(set up profile)"}
              </div>
            </div>

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

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="fullName">Full name *</Label>
              <Input id="fullName" name="fullName" required placeholder="e.g. Asha Mwakanjuki" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="sex">Sex *</Label>
              <select
                id="sex"
                name="sex"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="dob">Date of birth</Label>
              <Input id="dob" name="dob" type="date" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="district">District</Label>
              <Input id="district" name="district" placeholder="e.g. Ifakara TC" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="region">Region</Label>
              <Input id="region" name="region" placeholder="e.g. Morogoro" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+255 ..." />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="(if any)" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="educationLevel">Education level</Label>
              <select
                id="educationLevel"
                name="educationLevel"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {SRATA_EDUCATION_LEVELS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="maritalStatus">Marital status</Label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="separated">Separated / divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="householdSize">Household size</Label>
              <Input id="householdSize" name="householdSize" type="number" min={1} placeholder="e.g. 5" />
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <input id="hasSmartphone" name="hasSmartphone" type="checkbox" className="rounded border-input" />
              <Label htmlFor="hasSmartphone" className="text-sm">Owns a smartphone</Label>
              <span className="mx-3 text-muted-foreground">·</span>
              <input id="hospExperience" name="hospExperience" type="checkbox" className="rounded border-input" />
              <Label htmlFor="hospExperience" className="text-sm">Prior hospitality experience</Label>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="employmentBefore">Employment before</Label>
              <select
                id="employmentBefore"
                name="employmentBefore"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {SRATA_EMPLOYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="incomeBefore">Monthly income before (TSh)</Label>
              <Input
                id="incomeBefore"
                name="incomeBefore"
                type="number"
                min={0}
                placeholder="0 if unemployed"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="englishLevel">English level</Label>
              <select
                id="englishLevel"
                name="englishLevel"
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
              <Label htmlFor="computerLevel">Computer level</Label>
              <select
                id="computerLevel"
                name="computerLevel"
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
              <Label htmlFor="pathway">Preferred pathway *</Label>
              <select
                id="pathway"
                name="pathway"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {SRATA_PATHWAYS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="enrolledAt">Enrollment date</Label>
              <Input
                id="enrolledAt"
                name="enrolledAt"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="careerGoal">Career goal</Label>
              <Textarea
                id="careerGoal"
                name="careerGoal"
                rows={2}
                placeholder="What does the student want to be doing in 2 years?"
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
                {submitting ? "Saving..." : "Enroll student"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
