"use client";

export const dynamic = "force-dynamic";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Loader2, Send, Coins } from "lucide-react";
import { demoIGAGroups } from "@/lib/demo-data";
import { IGA_STARTUP_CAPITAL_TSH } from "@/lib/constants";
import type { IGAGroupStatus } from "@/types";

export default function SubmitIGAUpdatePage() {
  const router = useRouter();
  const [groupId, setGroupId] = useState("");
  const [officerName, setOfficerName] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("group")) setGroupId(sp.get("group") ?? "");
    if (sp.get("officer")) setOfficerName(sp.get("officer") ?? "");
  }, []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedGroup = useMemo(
    () => demoIGAGroups.find((g) => g.id === Number(groupId)),
    [groupId]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedGroup) {
      setError("Please select your group");
      return;
    }
    const fd = new FormData(e.currentTarget);

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/iga-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: selectedGroup.id,
          groupName: selectedGroup.name,
          currentCapitalTSh: Number(fd.get("currentCapital")),
          revenueTSh: Number(fd.get("revenue")),
          expenseTSh: Number(fd.get("expense")),
          status: fd.get("status") as IGAGroupStatus,
          notes: (fd.get("notes") as string) || null,
          reportedBy: officerName || "Group Leader",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Could not save");
      }
      toast.success(`Update saved for ${selectedGroup.name}`, {
        description: "Group portfolio refreshed in the dashboard",
      });

      router.push(
        `/submit/done?kind=iga-update&group=${encodeURIComponent(selectedGroup.name)}`
      );
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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">
            Submit IGA Financial Update
          </h1>
          <p className="text-xs text-muted-foreground">
            Income Generating Activity groups · Report current capital, revenue, and expenses.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800 flex items-start gap-2">
        <Coins className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          Each group started with {IGA_STARTUP_CAPITAL_TSH.toLocaleString()} TSh seed capital.
          Report your latest round here.
        </span>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Financial snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="officer">Your name *</Label>
              <Input
                id="officer"
                required
                placeholder="e.g. group leader name"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="group">Group *</Label>
              <select
                id="group"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              >
                <option value="">Select your group...</option>
                <optgroup label="Msolwa (Ifakara TC)">
                  {demoIGAGroups
                    .filter((g) => g.sector === "ifakara")
                    .map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} — {g.villageName}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Usangu (Mbarali DC)">
                  {demoIGAGroups
                    .filter((g) => g.sector === "mbarali")
                    .map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} — {g.villageName}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="currentCapital">Current capital (TSh) *</Label>
              <Input
                id="currentCapital"
                name="currentCapital"
                type="number"
                min={0}
                required
                defaultValue={selectedGroup?.currentCapitalTSh ?? ""}
                placeholder="e.g. 3500000"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="revenue">Revenue this round (TSh) *</Label>
              <Input
                id="revenue"
                name="revenue"
                type="number"
                min={0}
                required
                placeholder="e.g. 2800000"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="expense">Expenses (TSh) *</Label>
              <Input
                id="expense"
                name="expense"
                type="number"
                min={0}
                required
                placeholder="e.g. 1900000"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                name="status"
                required
                defaultValue={selectedGroup?.status ?? ""}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select status...</option>
                <option value="active">Active</option>
                <option value="struggling">Struggling</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Risks, asks, context on this round..."
                rows={3}
              />
            </div>

            {error && (
              <div className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? "Submitting..." : "Submit update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
