"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, UserPlus } from "lucide-react";
import {
  OFFICER_ROLES,
  type OfficerRole,
  createOfficer,
  emitOfficerChanged,
  getActiveOfficer,
} from "@/lib/officer";

export default function OnboardPage() {
  return (
    <Suspense fallback={<div className="text-xs text-muted-foreground">Loading…</div>}>
      <OnboardInner />
    </Suspense>
  );
}

function OnboardInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";

  const [name, setName] = useState("");
  const [role, setRole] = useState<OfficerRole>("field_officer");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void getActiveOfficer().then((existing) => {
      if (existing) router.replace(`/unlock?next=${encodeURIComponent(next)}`);
    });
  }, [router, next]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    if (pin.length < 4) return toast.error("PIN must be at least 4 digits");
    if (pin !== pin2) return toast.error("PINs don't match");

    setSubmitting(true);
    try {
      await createOfficer({ name, role, phone: phone || undefined, pin });
      emitOfficerChanged();
      toast.success(`Welcome, ${name.split(" ")[0]}!`);
      router.replace(next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create profile");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">
            Set up your officer profile
          </h1>
          <p className="text-xs text-muted-foreground">
            Stored on this device only. Field submissions will be attributed to you.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Your details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full name *</Label>
              <Input
                id="name"
                required
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Role *</Label>
              <select
                id="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value as OfficerRole)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(OFFICER_ROLES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+255 ..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pin">PIN (4-6 digits) *</Label>
                <Input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]{4,6}"
                  required
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pin2">Repeat PIN *</Label>
                <Input
                  id="pin2"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]{4,6}"
                  required
                  maxLength={6}
                  value={pin2}
                  onChange={(e) => setPin2(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>

            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Your PIN is hashed and stored locally. If you forget it, you'll need to clear
                the app from your device and set up again.
              </span>
            </div>

            <Button type="submit" className="gap-2" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {submitting ? "Creating..." : "Create profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
