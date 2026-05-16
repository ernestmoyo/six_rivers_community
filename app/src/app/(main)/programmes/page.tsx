"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Users,
  User,
  Building2,
  Boxes,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
} from "lucide-react";

import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  TAXONOMY,
  taxonomyCounts,
  type Activity,
  type BeneficiaryKind,
  type Pillar,
  type Programme,
  type Sector,
  type Subprogramme,
} from "@/lib/taxonomy";

const SECTOR_LABEL: Record<Sector, string> = {
  msolwa: "Msolwa",
  usangu: "Usangu",
  both: "Msolwa + Usangu",
  outreach: "Outreach (non-operational)",
};

const SECTOR_TONE: Record<Sector, string> = {
  msolwa: "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200",
  usangu:
    "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  both:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
  outreach:
    "bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-200",
};

const BENEFICIARY_ICON: Record<BeneficiaryKind, typeof User> = {
  individual: User,
  group: Users,
  school: Building2,
  mixed: Boxes,
};

interface ActivityCardProps {
  activity: Activity;
}

function ActivityCard({ activity }: ActivityCardProps) {
  const BIcon = BENEFICIARY_ICON[activity.beneficiaryKind];
  const startYear = activity.startYear;
  const endYear = activity.endYear;
  const isInactive = !activity.isActive;
  const yearLabel = (() => {
    if (startYear && endYear) return `${startYear}–${endYear}`;
    if (startYear) return `from ${startYear}`;
    if (endYear) return `until ${endYear}`;
    return undefined;
  })();

  return (
    <div
      className={`rounded-lg border p-3 transition-colors ${
        isInactive
          ? "border-dashed bg-muted/30 opacity-75"
          : "border-border bg-card hover:bg-muted/20"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-medium">{activity.name}</span>
            {isInactive && (
              <Badge variant="outline" className="text-[10px]">
                inactive
              </Badge>
            )}
          </div>
          {activity.description && (
            <p className="text-xs leading-snug text-muted-foreground">
              {activity.description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="secondary"
            className={`text-[10px] ${SECTOR_TONE[activity.sectorScope]}`}
          >
            <MapPin className="mr-1 h-3 w-3" />
            {SECTOR_LABEL[activity.sectorScope]}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {activity.beneficiaryKind}
          </Badge>
          {yearLabel && (
            <Badge variant="outline" className="text-[10px]">
              {yearLabel}
            </Badge>
          )}
        </div>
      </div>

      {activity.variants && activity.variants.length > 0 && (
        <div className="mt-2 space-y-1 border-l-2 border-muted pl-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Variants
          </div>
          <ul className="space-y-0.5">
            {activity.variants.map((v) => (
              <li key={v.code} className="flex items-baseline gap-2 text-xs">
                <CircleDot className="h-2.5 w-2.5 flex-shrink-0 text-muted-foreground" />
                <span>{v.label}</span>
                {v.note && (
                  <span className="text-muted-foreground italic">— {v.note}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground/60">
        {activity.code}
      </p>
    </div>
  );
}

interface SubprogrammeBlockProps {
  subprogramme: Subprogramme;
}

function SubprogrammeBlock({ subprogramme }: SubprogrammeBlockProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-lg border bg-card">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-3 text-left transition-colors hover:bg-muted/40"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-medium">{subprogramme.name}</span>
          <Badge variant="secondary" className="text-xs">
            {subprogramme.activities.length} {subprogramme.activities.length === 1 ? "activity" : "activities"}
          </Badge>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground/60">
          {subprogramme.code}
        </span>
      </button>

      {isOpen && (
        <div className="space-y-2 border-t bg-muted/10 p-3">
          {subprogramme.description && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {subprogramme.description}
            </p>
          )}
          {subprogramme.activities.length === 0 ? (
            <div className="rounded border border-dashed p-3 text-xs italic text-muted-foreground">
              No activities authored yet.
            </div>
          ) : (
            <div className="space-y-2">
              {subprogramme.activities.map((a) => (
                <ActivityCard key={a.code} activity={a} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ProgrammeBlockProps {
  programme: Programme;
}

function ProgrammeBlock({ programme }: ProgrammeBlockProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100/40 dark:from-slate-900/40 dark:to-slate-900/20">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-lg">{programme.name}</CardTitle>
            <Badge variant="outline" className="font-mono text-[10px]">
              {programme.code}
            </Badge>
          </div>
          {programme.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {programme.description}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {programme.subprogrammes.length === 0 ? (
          <div className="rounded border border-dashed p-3 text-xs italic text-muted-foreground">
            No subprogrammes authored yet (placeholder).
          </div>
        ) : (
          <div className="space-y-3">
            {programme.subprogrammes.map((s) => (
              <SubprogrammeBlock key={s.code} subprogramme={s} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PillarTabProps {
  pillar: Pillar;
}

function PillarTab({ pillar }: PillarTabProps) {
  return (
    <div className="space-y-4">
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-slate-950">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{pillar.name}</h2>
              {pillar.description && (
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {pillar.placeholder && (
                <Badge
                  variant="outline"
                  className="gap-1 border-amber-300 text-amber-900 dark:border-amber-800 dark:text-amber-200"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Placeholder
                </Badge>
              )}
              {!pillar.placeholder && (
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-300 text-emerald-900 dark:border-emerald-800 dark:text-emerald-200"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {pillar.programmes.map((p) => (
          <ProgrammeBlock key={p.code} programme={p} />
        ))}
      </div>
    </div>
  );
}

export default function ProgrammesPage() {
  const [activeTab, setActiveTab] = useState<string>(TAXONOMY[0]?.code ?? "community");
  const counts = taxonomyCounts();

  return (
    <div className="flex flex-col">
      <Header
        title="Programmes"
        subtitle="Pillar → Programme → Subprogramme → Activity (in line with the data tree)"
      />

      <div className="space-y-6 p-4 sm:p-6">
        {/* Stats hero */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Pillars" value={counts.pillars} accent="emerald" />
          <StatCard label="Programmes" value={counts.programmes} accent="sky" />
          <StatCard label="Subprogrammes" value={counts.subprogrammes} accent="amber" />
          <StatCard label="Activities" value={counts.activities} accent="violet" />
          <StatCard label="Variants" value={counts.variants} accent="rose" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            {TAXONOMY.map((pillar) => (
              <TabsTrigger key={pillar.code} value={pillar.code}>
                {pillar.name}
                {pillar.placeholder && (
                  <Badge variant="outline" className="ml-2 text-[10px]">
                    placeholder
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {TAXONOMY.map((pillar) => (
            <TabsContent key={pillar.code} value={pillar.code}>
              <PillarTab pillar={pillar} />
            </TabsContent>
          ))}
        </Tabs>

        <div className="rounded-lg border bg-muted/30 p-4 text-xs text-muted-foreground">
          <p className="mb-1 font-semibold uppercase tracking-wider">
            Source of truth
          </p>
          <p className="leading-relaxed">
            This tree is authored in <span className="font-mono">src/lib/taxonomy.ts</span>. When the taxonomy needs to change (M&amp;E to request), edit that file and re-run the seed script — the UI and the database update together. Codes in <span className="font-mono">monospace</span> are stable identifiers used by future <code>Indicator</code> rows.
          </p>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  accent: "emerald" | "sky" | "amber" | "violet" | "rose";
}

const ACCENT_RING: Record<StatCardProps["accent"], string> = {
  emerald: "ring-emerald-200 dark:ring-emerald-900/40",
  sky: "ring-sky-200 dark:ring-sky-900/40",
  amber: "ring-amber-200 dark:ring-amber-900/40",
  violet: "ring-violet-200 dark:ring-violet-900/40",
  rose: "ring-rose-200 dark:ring-rose-900/40",
};

function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <Card className={`ring-1 ${ACCENT_RING[accent]}`}>
      <CardContent className="p-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
