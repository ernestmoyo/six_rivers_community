"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  RefreshCw,
  Calculator,
  Calendar,
  Target,
  CheckCircle2,
  AlertTriangle,
  ServerCrash,
  Database,
  Sigma,
} from "lucide-react";
import { toast } from "sonner";

import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TAXONOMY } from "@/lib/taxonomy";
import type { TocLevel } from "@/lib/theory-of-change";

interface IndicatorRow {
  id: number;
  code: string;
  name: string;
  description: string | null;
  level: TocLevel;
  unit: string;
  computation: "manual" | "derived";
  derivedQuery: string | null;
  tocNodeCode: string | null;
  programme: { code: string; name: string } | null;
  activity: { code: string; name: string } | null;
  tocNode: { code: string; level: TocLevel; statement: string } | null;
  periods: Array<{
    id: number;
    periodKind: "year" | "quarter" | "month";
    periodKey: string;
    target: string | null;
    actual: string | null;
    source: "auto" | "manual";
    computedAt: string | null;
  }>;
}

interface State {
  loading: boolean;
  error: string | null;
  indicators: readonly IndicatorRow[];
  recomputing: boolean;
}

const LEVEL_TONES: Record<TocLevel, string> = {
  input:
    "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200",
  activity:
    "bg-sky-100 text-sky-900 border-sky-200 dark:bg-sky-900/30 dark:text-sky-200",
  output:
    "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200",
  outcome:
    "bg-violet-100 text-violet-900 border-violet-200 dark:bg-violet-900/30 dark:text-violet-200",
  impact:
    "bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-900/30 dark:text-rose-200",
};

function formatValue(value: string | null, unit: string): string {
  if (value === null) return "—";
  const num = Number(value);
  if (!Number.isFinite(num)) return value;
  if (unit === "percent") return `${num.toFixed(1)}%`;
  if (unit === "TSh") return `TSh ${num.toLocaleString("en-US")}`;
  if (unit === "ha") return `${num.toFixed(2)} ha`;
  if (unit === "kg") return `${num.toFixed(1)} kg`;
  if (unit === "km") return `${num.toFixed(2)} km`;
  if (unit === "score") return num.toFixed(2);
  return num.toLocaleString("en-US");
}

function progressPercent(target: string | null, actual: string | null): number | null {
  if (target === null || actual === null) return null;
  const t = Number(target);
  const a = Number(actual);
  if (!Number.isFinite(t) || !Number.isFinite(a) || t === 0) return null;
  return Math.min(100, Math.max(0, (a / t) * 100));
}

export default function IndicatorsPage() {
  const [periodKey, setPeriodKey] = useState<string>(String(new Date().getFullYear()));
  const [programmeFilter, setProgrammeFilter] = useState<string>("all");

  const [state, setState] = useState<State>({
    loading: true,
    error: null,
    indicators: [],
    recomputing: false,
  });

  const fetchIndicators = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const params = new URLSearchParams({ periodKey });
      if (programmeFilter !== "all") params.set("programmeCode", programmeFilter);
      const res = await fetch(`/api/indicators?${params.toString()}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setState((s) => ({
          ...s,
          loading: false,
          error: body.error ?? `HTTP ${res.status}`,
          indicators: [],
        }));
        return;
      }
      const body = (await res.json()) as { indicators: IndicatorRow[] };
      setState((s) => ({
        ...s,
        loading: false,
        error: null,
        indicators: body.indicators,
      }));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setState((s) => ({ ...s, loading: false, error: message, indicators: [] }));
    }
  }, [periodKey, programmeFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchIndicators();
  }, [fetchIndicators]);

  const recompute = useCallback(async () => {
    setState((s) => ({ ...s, recomputing: true }));
    try {
      const res = await fetch("/api/indicators/recompute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodKey, periodKind: "year" }),
      });
      const body = (await res.json()) as {
        ok?: number;
        failed?: number;
        error?: string;
      };
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      toast.success(
        `Recomputed ${body.ok ?? 0} indicators${body.failed ? `, ${body.failed} failed` : ""}`,
      );
      await fetchIndicators();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      toast.error(`Recompute failed: ${message}`);
    } finally {
      setState((s) => ({ ...s, recomputing: false }));
    }
  }, [periodKey, fetchIndicators]);

  const grouped = useMemo(() => {
    const map = new Map<string, IndicatorRow[]>();
    for (const ind of state.indicators) {
      const key = ind.programme?.name ?? "Cross-programme";
      const list = map.get(key) ?? [];
      list.push(ind);
      map.set(key, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [state.indicators]);

  const summary = useMemo(() => {
    const total = state.indicators.length;
    const withActual = state.indicators.filter(
      (i) => i.periods[0]?.actual != null,
    ).length;
    const withTarget = state.indicators.filter(
      (i) => i.periods[0]?.target != null,
    ).length;
    const derivedCount = state.indicators.filter((i) => i.computation === "derived").length;
    return { total, withActual, withTarget, derivedCount };
  }, [state.indicators]);

  return (
    <div className="flex flex-col">
      <Header
        title="Indicators"
        subtitle="The numbers Mary reports to donors. Each one points at a Theory of Change node."
      />

      <div className="space-y-6 p-4 sm:p-6">
        {/* Filter + actions */}
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto]">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Period (year)
                </label>
                <Select
                  value={periodKey}
                  onValueChange={(v) => v && setPeriodKey(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                  Programme
                </label>
                <Select
                  value={programmeFilter}
                  onValueChange={(v) => v && setProgrammeFilter(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All programmes</SelectItem>
                    {TAXONOMY.flatMap((p) => p.programmes).map((p) => (
                      <SelectItem key={p.code} value={p.code}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void fetchIndicators()}
                  disabled={state.loading}
                >
                  <RefreshCw className={`mr-1 h-3.5 w-3.5 ${state.loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
              <div className="flex items-end">
                <Button
                  size="sm"
                  onClick={() => void recompute()}
                  disabled={state.recomputing}
                >
                  <Calculator className={`mr-1 h-3.5 w-3.5 ${state.recomputing ? "animate-spin" : ""}`} />
                  {state.recomputing ? "Recomputing…" : "Recompute now"}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <SmallStat label="Total indicators" value={summary.total} icon={Sigma} />
              <SmallStat label="With actual" value={summary.withActual} icon={CheckCircle2} />
              <SmallStat label="With target" value={summary.withTarget} icon={Target} />
              <SmallStat label="Derived (auto)" value={summary.derivedCount} icon={Calculator} />
            </div>
          </CardContent>
        </Card>

        {state.error && (
          <Card className="border-amber-300">
            <CardContent className="space-y-2 p-6">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                <ServerCrash className="h-5 w-5" />
                <span className="font-semibold">Couldn&apos;t load indicators</span>
              </div>
              <p className="text-sm text-muted-foreground">{state.error}</p>
              <div className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                Run <span className="font-mono">npm run prisma:migrate</span> +{" "}
                <span className="font-mono">npm run seed</span> against Supabase
                to populate the indicator catalog.
              </div>
            </CardContent>
          </Card>
        )}

        {!state.error && !state.loading && state.indicators.length === 0 && (
          <Card>
            <CardContent className="space-y-2 p-6 text-center text-sm text-muted-foreground">
              <Database className="mx-auto h-8 w-8 opacity-50" />
              <p>
                No indicators seeded yet. Run{" "}
                <span className="font-mono">npm run seed:indicators</span>{" "}
                (after migrate + taxonomy + ToC seeds) to populate.
              </p>
            </CardContent>
          </Card>
        )}

        {grouped.map(([programmeName, rows]) => (
          <Card key={programmeName}>
            <CardHeader>
              <CardTitle className="text-base">{programmeName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rows.map((ind) => {
                const period = ind.periods[0];
                const progress = progressPercent(
                  period?.target ?? null,
                  period?.actual ?? null,
                );
                return (
                  <div
                    key={ind.id}
                    className="grid gap-3 rounded-lg border p-3 lg:grid-cols-[2fr_1fr_2fr]"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{ind.name}</span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] border ${LEVEL_TONES[ind.level]}`}
                        >
                          {ind.level}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {ind.unit}
                        </Badge>
                        {ind.computation === "derived" && (
                          <Badge variant="outline" className="text-[10px]">
                            auto
                          </Badge>
                        )}
                      </div>
                      {ind.description && (
                        <p className="text-xs leading-snug text-muted-foreground">
                          {ind.description}
                        </p>
                      )}
                      {ind.tocNode && (
                        <p className="text-[11px] italic text-muted-foreground">
                          measures: {ind.tocNode.statement}
                        </p>
                      )}
                      <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground/70">
                        {ind.code}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {periodKey} ({period?.periodKind ?? "—"})
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                            Target
                          </div>
                          <div className="font-mono text-sm">
                            {formatValue(period?.target ?? null, ind.unit)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                            Actual
                          </div>
                          <div className="font-mono text-sm font-bold">
                            {formatValue(period?.actual ?? null, ind.unit)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {progress !== null ? (
                        <>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="uppercase tracking-wider text-muted-foreground">
                              Toward target
                            </span>
                            <span className="font-mono">{progress.toFixed(0)}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <AlertTriangle className="h-3 w-3" />
                          {period?.actual == null && period?.target == null
                            ? "No data yet — run recompute or enter manual values"
                            : "Set a target to see progress"}
                        </div>
                      )}
                      {period?.computedAt && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                          <Calendar className="h-3 w-3" />
                          Computed{" "}
                          {new Date(period.computedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface SmallStatProps {
  label: string;
  value: number;
  icon: typeof TrendingUp;
}

function SmallStat({ label, value, icon: Icon }: SmallStatProps) {
  return (
    <div className="rounded-md border p-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
