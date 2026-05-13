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
import { Building2, Loader2, Send } from "lucide-react";
import { useOfficer } from "@/lib/officer";
import { submitWithOfflineFallback } from "@/lib/offline-queue";

export default function SrataEmployerPage() {
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
      const result = await submitWithOfflineFallback("/api/srata/employers", {
        clientSubmissionId: crypto.randomUUID(),
        officerId: officer?.id,
        name: fd.get("name") as string,
        sector: (fd.get("sector") as string) || null,
        contactPerson: (fd.get("contactPerson") as string) || null,
        phone: (fd.get("phone") as string) || null,
        email: (fd.get("email") as string) || null,
        district: (fd.get("district") as string) || null,
        partnerType: (fd.get("partnerType") as string) || "internship",
        repeatRecruitment: fd.get("repeat") === "yes",
        notes: (fd.get("notes") as string) || null,
        recordedBy: officer?.name ?? "M&E Specialist",
      });
      if (result.queued) toast.info("Saved offline — will sync when online");
      else if (!result.response.ok) {
        const data = await result.response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      } else toast.success("Employer added");
      router.push("/submit/done?kind=srata-employer");
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
          <h1 className="text-xl font-semibold tracking-tight text-primary">Add Employer / Partner</h1>
          <p className="text-xs text-muted-foreground">
            Internship host, recruiter, or repeat partner.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Employer details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required placeholder="e.g. Hondo Hondo Lodge" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="sector">Sector</Label>
              <Input id="sector" name="sector" placeholder="e.g. Hospitality" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="district">District</Label>
              <Input id="district" name="district" placeholder="e.g. Ifakara TC" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contactPerson">Contact person</Label>
              <Input id="contactPerson" name="contactPerson" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="partnerType">Partner type</Label>
              <select
                id="partnerType"
                name="partnerType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="internship">Internship host</option>
                <option value="recruiter">Recruiter</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="repeat">Repeat recruitment likely?</Label>
              <select
                id="repeat"
                name="repeat"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} />
            </div>

            {error && (
              <div className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end pt-2">
              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Saving..." : "Add employer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
