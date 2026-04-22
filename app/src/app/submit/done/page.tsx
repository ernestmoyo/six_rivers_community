"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

type Kind = "field-visit" | "cattle-incident" | "iga-update";

const KIND_LABEL: Record<Kind, string> = {
  "field-visit": "Field visit",
  "cattle-incident": "Cattle incident report",
  "iga-update": "IGA financial update",
};

const KIND_FOLLOWUP: Record<Kind, string> = {
  "field-visit": "Thanks — the management team can now see this visit on the dashboard.",
  "cattle-incident":
    "Thanks — high-severity reports trigger an email alert to the management team automatically.",
  "iga-update":
    "Thanks — the latest capital, revenue, and expenses are now reflected in the IGA portfolio.",
};

export default function SubmitDonePage() {
  const [kind, setKind] = useState<Kind>("field-visit");
  const [village, setVillage] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const k = sp.get("kind");
    if (k === "field-visit" || k === "cattle-incident" || k === "iga-update") setKind(k);
    setVillage(sp.get("village"));
    setGroup(sp.get("group"));
  }, []);
  const sameLinkHref =
    kind === "field-visit"
      ? "/submit/field-visit"
      : kind === "cattle-incident"
        ? "/submit/cattle-incident"
        : "/submit/iga-update";

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-primary">Submission received</h1>
            <p className="text-sm text-muted-foreground">
              {KIND_LABEL[kind]}
              {village && (
                <>
                  {" "}for <span className="font-medium text-foreground">{village}</span>
                </>
              )}
              {group && (
                <>
                  {" "}for <span className="font-medium text-foreground">{group}</span>
                </>
              )}{" "}saved to the central database.
            </p>
            <p className="text-sm text-muted-foreground">{KIND_FOLLOWUP[kind]}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={sameLinkHref}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Submit another
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted"
            >
              Open dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
