"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";

// ─── Row shapes (snake_case — match Supabase column names) ───

interface LiveFieldVisit {
  id: number | string;
  user_name: string;
  village_id: number | null;
  village_name: string | null;
  visit_date: string;
  visit_type: string;
  location_lat: number | null;
  location_lng: number | null;
  notes: string;
  created_at: string;
}

interface LiveCattleIncident {
  id: number | string;
  village_id: number | null;
  village_name: string | null;
  incident_type: string;
  severity: string;
  incident_date: string;
  estimated_herd: number | null;
  description: string | null;
  location_lat: number | null;
  location_lng: number | null;
  reported_by: string;
  email_sent: boolean;
  created_at: string;
}

interface LiveIGAUpdate {
  id: number | string;
  group_id: number;
  group_name: string;
  current_capital_tsh: number;
  revenue_tsh: number;
  expense_tsh: number;
  status: "active" | "struggling" | "inactive";
  notes: string | null;
  reported_by: string;
  created_at: string;
}

export interface LiveKPIs {
  fieldVisits: LiveFieldVisit[];
  fieldVisitsThisMonth: number;

  cattleIncidents: LiveCattleIncident[];
  cattleIncidentsThisMonth: number;

  igaUpdates: LiveIGAUpdate[];
  // For each group_id, the most recent update — deduped
  latestUpdateByGroup: Map<number, LiveIGAUpdate>;
  igaCapitalDeltaTSh: number; // sum of (current - previous) across groups with live updates
  igaRevenueDeltaTSh: number;

  isLoading: boolean;
  hasAnyLiveData: boolean;
  lastUpdated: Date | null;
  error: string | null;
}

const REFRESH_MS = 30_000;

async function fetchJson<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      // 503 = Supabase not configured — treat as empty array, not an error
      if (res.status === 503) return [] as T[];
      return [] as T[];
    }
    const data = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [] as T[];
  }
}

function isThisMonth(isoDate: string): boolean {
  try {
    const d = new Date(isoDate);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  } catch {
    return false;
  }
}

export function useLiveKPIs(): LiveKPIs {
  const [fieldVisits, setFieldVisits] = useState<LiveFieldVisit[]>([]);
  const [cattleIncidents, setCattleIncidents] = useState<LiveCattleIncident[]>([]);
  const [igaUpdates, setIgaUpdates] = useState<LiveIGAUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Track known IDs across polls so we can fire toasts only for new rows
  const knownIds = useRef<{ fv: Set<string>; ci: Set<string>; iga: Set<string> }>({
    fv: new Set(),
    ci: new Set(),
    iga: new Set(),
  });
  const isFirstLoad = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const [fv, ci, iga] = await Promise.all([
        fetchJson<LiveFieldVisit>("/api/field-visits"),
        fetchJson<LiveCattleIncident>("/api/cattle-incidents"),
        fetchJson<LiveIGAUpdate>("/api/iga-updates"),
      ]);

      // Detect NEW rows since last poll (skip toasts on first load)
      if (!isFirstLoad.current) {
        fv.forEach((v) => {
          const id = String(v.id);
          if (!knownIds.current.fv.has(id)) {
            toast.success("New field visit submitted", {
              description: `${v.user_name} · ${v.village_name ?? "(no village)"}`,
              duration: 6000,
            });
          }
        });
        ci.forEach((c) => {
          const id = String(c.id);
          if (!knownIds.current.ci.has(id)) {
            const severityIcon = c.severity === "high" ? "🚨 " : "";
            toast.warning(`${severityIcon}Cattle incident reported`, {
              description: `${c.village_name ?? "(no village)"} · ${c.incident_type.replace(/_/g, " ")} · ${c.severity}`,
              duration: 8000,
            });
          }
        });
        iga.forEach((u) => {
          const id = String(u.id);
          if (!knownIds.current.iga.has(id)) {
            const statusEmoji =
              u.status === "struggling" ? "⚠️ " : u.status === "inactive" ? "⛔ " : "✅ ";
            toast.info(`${statusEmoji}IGA update · ${u.group_name}`, {
              description: `Capital ${(u.current_capital_tsh / 1_000_000).toFixed(1)}M TSh · Revenue ${(u.revenue_tsh / 1_000_000).toFixed(1)}M · Status: ${u.status}`,
              duration: 7000,
            });
          }
        });
      }

      // Update the known-ID sets
      knownIds.current.fv = new Set(fv.map((v) => String(v.id)));
      knownIds.current.ci = new Set(ci.map((c) => String(c.id)));
      knownIds.current.iga = new Set(iga.map((u) => String(u.id)));
      isFirstLoad.current = false;

      setFieldVisits(fv);
      setCattleIncidents(ci);
      setIgaUpdates(iga);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch live data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const intervalId = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(intervalId);
  }, [refresh]);

  // Derived: latest update per group_id (IGA updates are an audit log, newest first)
  const latestUpdateByGroup = new Map<number, LiveIGAUpdate>();
  for (const update of igaUpdates) {
    const existing = latestUpdateByGroup.get(update.group_id);
    if (!existing || new Date(update.created_at) > new Date(existing.created_at)) {
      latestUpdateByGroup.set(update.group_id, update);
    }
  }

  const igaCapitalDeltaTSh = Array.from(latestUpdateByGroup.values()).reduce(
    (sum, u) => sum + u.current_capital_tsh,
    0
  );
  const igaRevenueDeltaTSh = Array.from(latestUpdateByGroup.values()).reduce(
    (sum, u) => sum + u.revenue_tsh,
    0
  );

  const fieldVisitsThisMonth = fieldVisits.filter((v) =>
    isThisMonth(v.visit_date ?? v.created_at)
  ).length;

  const cattleIncidentsThisMonth = cattleIncidents.filter((c) =>
    isThisMonth(c.incident_date ?? c.created_at)
  ).length;

  const hasAnyLiveData = fieldVisits.length > 0 || cattleIncidents.length > 0 || igaUpdates.length > 0;

  return {
    fieldVisits,
    fieldVisitsThisMonth,
    cattleIncidents,
    cattleIncidentsThisMonth,
    igaUpdates,
    latestUpdateByGroup,
    igaCapitalDeltaTSh,
    igaRevenueDeltaTSh,
    isLoading,
    hasAnyLiveData,
    lastUpdated,
    error,
  };
}
