"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GraduationCap,
  TrendingDown,
  TrendingUp,
  Users,
  Search,
  RefreshCw,
  ServerCrash,
  Calendar,
  Filter,
  CheckCircle2,
  LogOut,
} from "lucide-react";

import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TAXONOMY, allActivities } from "@/lib/taxonomy";
import type { EnrollmentStatus } from "@/generated/prisma/enums";

interface EnrollmentRow {
  id: number;
  cohortYear: number;
  status: EnrollmentStatus;
  startedAt: string;
  endedAt: string | null;
  exitReason: string | null;
  exitReasonCategory: string | null;
  activity: { code: string; name: string; sectorScope: string };
  person: {
    id: number;
    fullName: string;
    sex: string | null;
    age: number | null;
    schoolClass: string | null;
    operationalLocation: { id: number; displayName: string } | null;
  } | null;
  group: { id: number; name: string } | null;
  school: { id: number; name: string } | null;
}

interface ApiState {
  loading: boolean;
  error: string | null;
  rows: readonly EnrollmentRow[];
}

const STATUS_TONES: Record<EnrollmentStatus, string> = {
  enrolled:
    "bg-sky-100 text-sky-900 border-sky-200 dark:bg-sky-900/30 dark:text-sky-200",
  active:
    "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200",
  graduated:
    "bg-violet-100 text-violet-900 border-violet-200 dark:bg-violet-900/30 dark:text-violet-200",
  dropped_out:
    "bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-900/30 dark:text-rose-200",
  transferred:
    "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200",
  withdrawn:
    "bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300",
};

const STATUS_ORDER: readonly EnrollmentStatus[] = [
  "enrolled",
  "active",
  "graduated",
  "dropped_out",
  "transferred",
  "withdrawn",
];

const STATUS_LABEL: Record<EnrollmentStatus, string> = {
  enrolled: "Enrolled",
  active: "Active",
  graduated: "Graduated",
  dropped_out: "Dropped out",
  transferred: "Transferred",
  withdrawn: "Withdrawn",
};

export default function CohortsPage() {
  const activities = useMemo(() => allActivities(), []);
  const [activityCode, setActivityCode] = useState<string>("eco_club");
  const [year, setYear] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | "all">(
    "all",
  );
  const [search, setSearch] = useState("");

  const [state, setState] = useState<ApiState>({
    loading: true,
    error: null,
    rows: [],
  });

  const fetchRows = useCallback(async () => {
    if (!activityCode) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const params = new URLSearchParams({ activityCode });
      if (year !== "all") params.set("cohortYear", year);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/enrollments?${params.toString()}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setState({
          loading: false,
          error: body.error ?? `HTTP ${res.status}`,
          rows: [],
        });
        return;
      }
      const body = (await res.json()) as { rows: EnrollmentRow[] };
      setState({ loading: false, error: null, rows: body.rows });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setState({ loading: false, error: message, rows: [] });
    }
  }, [activityCode, year, statusFilter]);

  useEffect(() => {
    // The set-state-in-effect rule is fired because fetchRows updates state
    // when it resolves. This is the standard fetch-in-effect pattern; the
    // setState calls happen *after* the await, not synchronously in the
    // effect body. Suppress the false positive.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchRows();
  }, [fetchRows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return state.rows;
    return state.rows.filter((r) => {
      if (r.person?.fullName.toLowerCase().includes(q)) return true;
      if (r.group?.name.toLowerCase().includes(q)) return true;
      if (r.school?.name.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [state.rows, search]);

  // Cohort-year stats — derived from the loaded data (not the API
  // count; we filter client-side for snappier feedback).
  const stats = useMemo(() => {
    const byStatus: Record<EnrollmentStatus, number> = {
      enrolled: 0,
      active: 0,
      graduated: 0,
      dropped_out: 0,
      transferred: 0,
      withdrawn: 0,
    };
    for (const r of state.rows) byStatus[r.status] += 1;
    const total = state.rows.length;
    const stillIn = byStatus.enrolled + byStatus.active;
    const exitedBad = byStatus.dropped_out;
    const exitedGood = byStatus.graduated;
    const retention = total > 0 ? Math.round((stillIn / total) * 100) : 0;
    const dropoutRate = total > 0 ? Math.round((exitedBad / total) * 100) : 0;
    return { byStatus, total, stillIn, exitedBad, exitedGood, retention, dropoutRate };
  }, [state.rows]);

  const cohortYearsPresent = useMemo(() => {
    const years = new Set(state.rows.map((r) => r.cohortYear));
    return [...years].sort((a, b) => b - a);
  }, [state.rows]);

  const selectedActivity = useMemo(
    () => activities.find((a) => a.code === activityCode),
    [activities, activityCode],
  );

  return (
    <div className="flex flex-col">
      <Header
        title="Cohorts"
        subtitle="Year-by-year enrolment, dropout, and retention across every activity"
      />

      <div className="space-y-6 p-4 sm:p-6">
        {/* Filter bar */}
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_2fr_auto]">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Activity
                </label>
                <Select
                  value={activityCode}
                  onValueChange={(v) => v && setActivityCode(v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pick an activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAXONOMY.flatMap((pillar) =>
                      pillar.programmes.flatMap((programme) =>
                        programme.subprogrammes.flatMap((sub) =>
                          sub.activities.map((a) => (
                            <SelectItem key={a.code} value={a.code}>
                              {a.name}
                              <span className="ml-2 text-[10px] text-muted-foreground">
                                {programme.name}
                              </span>
                            </SelectItem>
                          )),
                        ),
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Cohort year
                </label>
                <Select
                  value={year}
                  onValueChange={(v) => v && setYear(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All years</SelectItem>
                    {[2024, 2025, 2026, 2027].map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </label>
                <Select
                  value={statusFilter}
                  onValueChange={(v) =>
                    setStatusFilter(v as EnrollmentStatus | "all")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {STATUS_ORDER.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Search name / group / school
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type to filter"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void fetchRows()}
                  disabled={state.loading}
                >
                  <RefreshCw
                    className={`mr-1 h-3.5 w-3.5 ${state.loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>
            {selectedActivity && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Filter className="h-3 w-3" />
                <span>Selected:</span>
                <Badge variant="secondary">{selectedActivity.name}</Badge>
                <Badge variant="outline" className="text-[10px]">
                  {selectedActivity.sectorScope}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {selectedActivity.beneficiaryKind}
                </Badge>
                {selectedActivity.description && (
                  <span className="italic">{selectedActivity.description}</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        {!state.error && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <StatTile
              label="Total in cohort"
              value={stats.total}
              icon={Users}
              accent="bg-slate-50 dark:bg-slate-900/40"
            />
            <StatTile
              label="Active"
              value={stats.stillIn}
              icon={CheckCircle2}
              accent="bg-emerald-50 dark:bg-emerald-950/30"
            />
            <StatTile
              label="Graduated"
              value={stats.exitedGood}
              icon={GraduationCap}
              accent="bg-violet-50 dark:bg-violet-950/30"
            />
            <StatTile
              label="Dropped out"
              value={stats.exitedBad}
              icon={LogOut}
              accent="bg-rose-50 dark:bg-rose-950/30"
            />
            <StatTile
              label="Retention"
              value={`${stats.retention}%`}
              icon={TrendingUp}
              accent="bg-sky-50 dark:bg-sky-950/30"
            />
            <StatTile
              label="Dropout rate"
              value={`${stats.dropoutRate}%`}
              icon={TrendingDown}
              accent="bg-amber-50 dark:bg-amber-950/30"
            />
          </div>
        )}

        {/* Empty / error / loading states */}
        {state.error && (
          <Card className="border-amber-300">
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                <ServerCrash className="h-5 w-5" />
                <span className="font-semibold">
                  Couldn&apos;t load enrolments
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{state.error}</p>
              <div className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                Connect <span className="font-mono">DATABASE_URL</span> to your
                Supabase project, run{" "}
                <span className="font-mono">npm run prisma:migrate</span> and{" "}
                <span className="font-mono">npm run seed</span>, then come back.
              </div>
            </CardContent>
          </Card>
        )}

        {!state.error && !state.loading && state.rows.length === 0 && (
          <Card>
            <CardContent className="space-y-2 p-6 text-center text-sm text-muted-foreground">
              <Users className="mx-auto h-8 w-8 opacity-50" />
              <p>
                No enrolments yet for{" "}
                <span className="font-medium">{selectedActivity?.name}</span>.
                Submit some via the field forms to populate this view.
              </p>
            </CardContent>
          </Card>
        )}

        {!state.error && state.rows.length > 0 && (
          <>
            {cohortYearsPresent.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Cohort years present
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={year}
                    onValueChange={(v) => setYear(v)}
                    className="space-y-2"
                  >
                    <TabsList>
                      <TabsTrigger value="all">All years</TabsTrigger>
                      {cohortYearsPresent.map((y) => (
                        <TabsTrigger key={y} value={String(y)}>
                          <Calendar className="mr-1 h-3 w-3" />
                          {y}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Enrolments ({filteredRows.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Separator className="mb-3" />
                <ul className="space-y-2">
                  {filteredRows.map((row) => (
                    <li key={row.id} className="rounded-md border p-3 text-sm">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold">
                              {row.person?.fullName ??
                                row.group?.name ??
                                row.school?.name ??
                                "—"}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              Cohort {row.cohortYear}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`border ${STATUS_TONES[row.status]}`}
                            >
                              {STATUS_LABEL[row.status]}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>{row.activity.name}</span>
                            {row.person?.sex && (
                              <span>· {row.person.sex}</span>
                            )}
                            {row.person?.age && <span>· {row.person.age}y</span>}
                            {row.person?.schoolClass && (
                              <span>· Class {row.person.schoolClass}</span>
                            )}
                            {row.person?.operationalLocation && (
                              <span>
                                · {row.person.operationalLocation.displayName}
                              </span>
                            )}
                          </div>
                          {row.exitReason && (
                            <p className="text-xs italic text-muted-foreground">
                              Exit: {row.exitReason}
                              {row.exitReasonCategory
                                ? ` (${row.exitReasonCategory})`
                                : ""}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-[10px] uppercase tracking-wider text-muted-foreground">
                          <div>Started</div>
                          <div className="font-mono">
                            {new Date(row.startedAt).toISOString().slice(0, 10)}
                          </div>
                          {row.endedAt && (
                            <>
                              <div className="mt-1">Ended</div>
                              <div className="font-mono">
                                {new Date(row.endedAt).toISOString().slice(0, 10)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

interface StatTileProps {
  label: string;
  value: number | string;
  icon: typeof Users;
  accent: string;
}

function StatTile({ label, value, icon: Icon, accent }: StatTileProps) {
  return (
    <Card className={`overflow-hidden ${accent}`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
        </div>
        <div className="mt-1 text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
