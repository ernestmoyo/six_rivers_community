"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, UserCog } from "lucide-react";
import {
  type Officer,
  OFFICER_ROLES,
  emitOfficerChanged,
  getActiveOfficer,
  markUnlocked,
  setActiveOfficer,
  listOfficers,
  verifyPin,
} from "@/lib/officer";

export default function UnlockPage() {
  return (
    <Suspense fallback={<div className="text-xs text-muted-foreground">Loading…</div>}>
      <UnlockInner />
    </Suspense>
  );
}

function UnlockInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";

  const [active, setActive] = useState<Officer | null>(null);
  const [all, setAll] = useState<Officer[]>([]);
  const [pin, setPin] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void (async () => {
      const [a, list] = await Promise.all([getActiveOfficer(), listOfficers()]);
      if (!a && list.length === 0) {
        router.replace(`/onboard?next=${encodeURIComponent(next)}`);
        return;
      }
      setActive(a ?? list[0]);
      setAll(list);
    })();
  }, [router, next]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!active) return;
    setSubmitting(true);
    try {
      const ok = await verifyPin(active, pin);
      if (!ok) {
        toast.error("Incorrect PIN");
        setSubmitting(false);
        return;
      }
      await markUnlocked();
      emitOfficerChanged();
      router.replace(next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not unlock");
      setSubmitting(false);
    }
  }

  async function switchTo(officer: Officer) {
    await setActiveOfficer(officer);
    setActive(officer);
    setPin("");
    emitOfficerChanged();
  }

  if (!active) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">Unlock the app</h1>
          <p className="text-xs text-muted-foreground">Enter your PIN to continue.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            {active.name}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {OFFICER_ROLES[active.role]}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]{4,6}"
                required
                autoFocus
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <Button type="submit" className="gap-2" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {submitting ? "Unlocking..." : "Unlock"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {all.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Switch officer
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {all
              .filter((o) => o.id !== active.id)
              .map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => switchTo(o)}
                  className="flex items-center gap-3 rounded-md border border-input px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <UserCog className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{o.name}</div>
                    <div className="text-xs text-muted-foreground">{OFFICER_ROLES[o.role]}</div>
                  </div>
                </button>
              ))}
          </CardContent>
        </Card>
      )}

      <div className="text-center text-xs text-muted-foreground">
        <Link href={`/onboard?next=${encodeURIComponent(next)}`} className="underline">
          Add a new officer to this device
        </Link>
      </div>
    </div>
  );
}
