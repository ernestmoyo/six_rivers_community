"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Search,
  Edit3,
  Save,
  X,
  RefreshCw,
  ServerCrash,
  Database,
  MapPin,
  Tag,
  PenSquare,
  Globe2,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  OperationalLocationKind,
  ReconciliationStatus,
} from "@/generated/prisma/enums";

interface CanonicalVillage {
  id: number;
  name: string;
  ward?: { id: number; name: string } | null;
}

interface CanonicalWard {
  id: number;
  name: string;
  district?: { id: number; name: string } | null;
}

interface OperationalLocationRow {
  id: number;
  kind: OperationalLocationKind;
  displayName: string;
  aliases: string[];
  reconciliationStatus: ReconciliationStatus;
  notes: string | null;
  lat: number | null;
  lng: number | null;
  isOperational: boolean;
  sector: string | null;
  canonicalVillageId: number | null;
  canonicalWardId: number | null;
  canonicalVillage: CanonicalVillage | null;
  canonicalWard: CanonicalWard | null;
  reviewedAt: string | null;
}

const STATUS_LABELS: Record<ReconciliationStatus, string> = {
  matched: "Matched",
  alias_override: "Alias override",
  missing_in_shapefile: "Missing in shapefile",
  decommissioned: "Decommissioned",
  split_disputed: "Split / disputed",
  pending: "Pending review",
};

const STATUS_TONES: Record<ReconciliationStatus, string> = {
  matched:
    "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200",
  alias_override:
    "bg-sky-100 text-sky-900 border-sky-200 dark:bg-sky-900/30 dark:text-sky-200",
  missing_in_shapefile:
    "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200",
  decommissioned:
    "bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300",
  split_disputed:
    "bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-900/30 dark:text-rose-200",
  pending:
    "bg-violet-100 text-violet-900 border-violet-200 dark:bg-violet-900/30 dark:text-violet-200",
};

const STATUS_ORDER: readonly ReconciliationStatus[] = [
  "pending",
  "missing_in_shapefile",
  "split_disputed",
  "alias_override",
  "decommissioned",
  "matched",
];

const KIND_LABELS: Record<OperationalLocationKind, string> = {
  village: "Village",
  ward: "Ward",
  hamlet: "Hamlet",
};

interface ApiState {
  loading: boolean;
  error: string | null;
  rows: readonly OperationalLocationRow[];
}

export default function ReconcilePage() {
  const [state, setState] = useState<ApiState>({
    loading: true,
    error: null,
    rows: [],
  });
  const [filterStatus, setFilterStatus] = useState<ReconciliationStatus | "all">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchRows = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch("/api/operational-locations");
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setState({
          loading: false,
          error: body.error ?? `HTTP ${res.status}`,
          rows: [],
        });
        return;
      }
      const body = (await res.json()) as {
        rows: OperationalLocationRow[];
      };
      setState({ loading: false, error: null, rows: body.rows });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setState({ loading: false, error: message, rows: [] });
    }
  }, []);

  useEffect(() => {
    // Standard fetch-in-effect — setState fires after the await, not in the
    // synchronous body. Suppress the rule's false positive.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchRows();
  }, [fetchRows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return state.rows.filter((r) => {
      if (filterStatus !== "all" && r.reconciliationStatus !== filterStatus)
        return false;
      if (!q) return true;
      if (r.displayName.toLowerCase().includes(q)) return true;
      if (r.aliases.some((a) => a.toLowerCase().includes(q))) return true;
      if (r.canonicalVillage?.name.toLowerCase().includes(q)) return true;
      if (r.canonicalWard?.name.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [state.rows, filterStatus, search]);

  const grouped = useMemo(() => {
    const map = new Map<ReconciliationStatus, OperationalLocationRow[]>();
    for (const row of filteredRows) {
      const list = map.get(row.reconciliationStatus) ?? [];
      list.push(row);
      map.set(row.reconciliationStatus, list);
    }
    return map;
  }, [filteredRows]);

  const statusCounts = useMemo(() => {
    const counts: Record<ReconciliationStatus, number> = {
      matched: 0,
      alias_override: 0,
      missing_in_shapefile: 0,
      decommissioned: 0,
      split_disputed: 0,
      pending: 0,
    };
    for (const row of state.rows) {
      counts[row.reconciliationStatus] += 1;
    }
    return counts;
  }, [state.rows]);

  const total = state.rows.length;
  const matched = statusCounts.matched;
  const reviewedPercent = total > 0 ? Math.round((matched / total) * 100) : 0;

  return (
    <div className="flex flex-col">
      <Header
        title="Location reconciliation"
        subtitle="Align operational ward / village names with the canonical Tanzania shapefile"
      />

      <div className="space-y-6 p-4 sm:p-6">
        {/* Hero + filters */}
        <Card>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="grid gap-3 lg:grid-cols-[2fr_3fr] lg:items-center">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">
                  Edna &amp; Lilian: walk every row before the Brandon meeting
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Operational names from the team (e.g. <em>Iheha</em>) on the
                  left; canonical shapefile rows on the right. Flag splits,
                  decommissioned villages (old Ikoga), and missing rows
                  (Chalizuka) so the platform can show the right names to
                  Brandon without surprises.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                <SmallStat
                  label="Matched"
                  value={matched}
                  tone={STATUS_TONES.matched}
                />
                <SmallStat
                  label="Pending"
                  value={statusCounts.pending}
                  tone={STATUS_TONES.pending}
                />
                <SmallStat
                  label="Alias"
                  value={statusCounts.alias_override}
                  tone={STATUS_TONES.alias_override}
                />
                <SmallStat
                  label="Missing"
                  value={statusCounts.missing_in_shapefile}
                  tone={STATUS_TONES.missing_in_shapefile}
                />
                <SmallStat
                  label="Disputed"
                  value={statusCounts.split_disputed}
                  tone={STATUS_TONES.split_disputed}
                />
                <SmallStat
                  label="Decommissioned"
                  value={statusCounts.decommissioned}
                  tone={STATUS_TONES.decommissioned}
                />
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by display name, alias, or canonical name"
                  className="pl-9"
                />
              </div>
              <Select
                value={filterStatus}
                onValueChange={(v) =>
                  setFilterStatus(v as ReconciliationStatus | "all")
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => void fetchRows()}>
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
                Refresh
              </Button>
              <div className="ml-auto text-xs text-muted-foreground">
                {reviewedPercent}% matched · {total} rows total
              </div>
            </div>
          </CardContent>
        </Card>

        {state.loading && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Loading operational locations…
            </CardContent>
          </Card>
        )}

        {state.error && (
          <Card className="border-amber-300">
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                <ServerCrash className="h-5 w-5" />
                <span className="font-semibold">Couldn&apos;t load locations</span>
              </div>
              <p className="text-sm text-muted-foreground">{state.error}</p>
              <div className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                <div className="mb-1 font-semibold uppercase tracking-wider">
                  Setup required
                </div>
                <ol className="ml-4 list-decimal space-y-1">
                  <li>
                    Update <span className="font-mono">app/.env</span> so
                    <span className="font-mono"> DATABASE_URL</span> points at
                    your Supabase Postgres project.
                  </li>
                  <li>
                    Run{" "}
                    <span className="font-mono">npm run prisma:migrate</span>{" "}
                    to apply the schema.
                  </li>
                  <li>
                    Run <span className="font-mono">npm run seed</span> to
                    populate the operational-location list, the programme tree,
                    and the Theory of Change.
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        {!state.loading && !state.error && state.rows.length === 0 && (
          <Card>
            <CardContent className="space-y-3 p-6 text-center text-sm text-muted-foreground">
              <Database className="mx-auto h-8 w-8 opacity-50" />
              <p>
                No operational locations have been seeded yet. Run{" "}
                <span className="font-mono">npm run seed:locations</span> to
                load the Lilian + Edna corrections.
              </p>
            </CardContent>
          </Card>
        )}

        {!state.loading && !state.error && state.rows.length > 0 && (
          <div className="space-y-6">
            {STATUS_ORDER.map((status) => {
              const rows = grouped.get(status) ?? [];
              if (rows.length === 0) return null;
              return (
                <Card key={status}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Badge
                          variant="outline"
                          className={`border ${STATUS_TONES[status]}`}
                        >
                          {STATUS_LABELS[status]}
                        </Badge>
                        <span className="text-muted-foreground">
                          {rows.length} {rows.length === 1 ? "row" : "rows"}
                        </span>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {rows.map((row) =>
                      editingId === row.id ? (
                        <EditRow
                          key={row.id}
                          row={row}
                          onSaved={() => {
                            setEditingId(null);
                            void fetchRows();
                          }}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <DisplayRow
                          key={row.id}
                          row={row}
                          onEdit={() => setEditingId(row.id)}
                        />
                      ),
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface SmallStatProps {
  label: string;
  value: number;
  tone: string;
}

function SmallStat({ label, value, tone }: SmallStatProps) {
  return (
    <div className={`rounded-md border px-3 py-2 ${tone}`}>
      <div className="text-[10px] uppercase tracking-wider opacity-80">
        {label}
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

interface DisplayRowProps {
  row: OperationalLocationRow;
  onEdit: () => void;
}

function DisplayRow({ row, onEdit }: DisplayRowProps) {
  return (
    <div className="grid gap-3 rounded-lg border p-3 lg:grid-cols-[2fr_2fr_auto] lg:items-start">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {KIND_LABELS[row.kind]}
          </Badge>
          <span className="font-semibold">{row.displayName}</span>
          {row.sector && (
            <Badge variant="secondary" className="text-xs">
              {row.sector}
            </Badge>
          )}
          {!row.isOperational && (
            <Badge variant="outline" className="text-[10px]">
              non-operational
            </Badge>
          )}
        </div>
        {row.aliases.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Tag className="h-3 w-3" />
            <span>Aliases:</span>
            {row.aliases.map((a) => (
              <Badge key={a} variant="outline" className="text-[10px]">
                {a}
              </Badge>
            ))}
          </div>
        )}
        {row.notes && (
          <p className="text-xs italic leading-snug text-muted-foreground">
            {row.notes}
          </p>
        )}
        {(row.lat != null || row.lng != null) && (
          <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {row.lat?.toFixed(5)}, {row.lng?.toFixed(5)}
          </div>
        )}
      </div>
      <div className="space-y-1.5 text-sm">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Canonical link
        </div>
        {row.canonicalVillage ? (
          <div className="flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" />
            <span>{row.canonicalVillage.name}</span>
            {row.canonicalVillage.ward && (
              <span className="text-muted-foreground">
                — {row.canonicalVillage.ward.name} ward
              </span>
            )}
          </div>
        ) : row.canonicalWard ? (
          <div className="flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" />
            <span>{row.canonicalWard.name} ward</span>
            {row.canonicalWard.district && (
              <span className="text-muted-foreground">
                — {row.canonicalWard.district.name} district
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>No canonical match</span>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit3 className="mr-1 h-3.5 w-3.5" />
          Edit
        </Button>
      </div>
    </div>
  );
}

interface EditRowProps {
  row: OperationalLocationRow;
  onSaved: () => void;
  onCancel: () => void;
}

function EditRow({ row, onSaved, onCancel }: EditRowProps) {
  const [status, setStatus] = useState<ReconciliationStatus>(
    row.reconciliationStatus,
  );
  const [displayName, setDisplayName] = useState(row.displayName);
  const [aliasesText, setAliasesText] = useState(row.aliases.join(", "));
  const [notes, setNotes] = useState(row.notes ?? "");
  const [isOperational, setIsOperational] = useState(row.isOperational);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const aliases = aliasesText
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);
      const res = await fetch(`/api/operational-locations/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          aliases,
          notes: notes.trim() || null,
          reconciliationStatus: status,
          isOperational,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }, [row.id, displayName, aliasesText, notes, status, isOperational, onSaved]);

  return (
    <div className="space-y-3 rounded-lg border-2 border-sky-300 bg-sky-50/40 p-3 dark:border-sky-900/60 dark:bg-sky-950/20">
      <div className="flex items-center gap-2 text-sm font-semibold text-sky-900 dark:text-sky-200">
        <PenSquare className="h-4 w-4" />
        Editing
        <Badge variant="outline" className="text-[10px]">
          {KIND_LABELS[row.kind]}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`name-${row.id}`}>Display name</Label>
          <Input
            id={`name-${row.id}`}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={`status-${row.id}`}>Reconciliation status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as ReconciliationStatus)}
          >
            <SelectTrigger id={`status-${row.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ORDER.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`aliases-${row.id}`}>Aliases (comma-separated)</Label>
          <Input
            id={`aliases-${row.id}`}
            value={aliasesText}
            onChange={(e) => setAliasesText(e.target.value)}
            placeholder="e.g. Lheha, Iheha-Mpia"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`notes-${row.id}`}>Notes</Label>
          <Textarea
            id={`notes-${row.id}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id={`op-${row.id}`}
            type="checkbox"
            checked={isOperational}
            onChange={(e) => setIsOperational(e.target.checked)}
          />
          <Label htmlFor={`op-${row.id}`} className="cursor-pointer">
            Is operational (currently active for Six Rivers work)
          </Label>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-rose-50 p-2 text-xs text-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={saving}>
          <X className="mr-1 h-3.5 w-3.5" />
          Cancel
        </Button>
        <Button size="sm" onClick={() => void onSave()} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="mr-1 h-3.5 w-3.5" />
              Save
            </>
          )}
          {saving ? null : <CheckCircle2 className="ml-1 h-3.5 w-3.5 opacity-0" />}
        </Button>
      </div>
    </div>
  );
}
