/**
 * REST-API backup of all existing Supabase tables — bypasses the
 * direct-connection IPv6 issue. Uses the anon key (so RLS is in effect;
 * any table the field officers can read from production, we can back up).
 *
 * Output: backups/db-data-pre-major-shift-2026-05-16.json
 */
import "dotenv/config";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const EXISTING_TABLES = [
  "agroforestry_plots",
  "cattle_incidents",
  "crop_cycles",
  "field_visits",
  "iga_financial_updates",
  "radio_sessions",
  "srata_assessments",
  "srata_attendance",
  "srata_cohorts",
  "srata_employers",
  "srata_graduate_traces",
  "srata_internships",
  "srata_students",
  "survival_check_submissions",
];

async function main(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY missing");
  }

  const supabase = createClient(url, anonKey);

  /* eslint-disable no-console */
  const tables: Array<{
    table: string;
    rowCount: number;
    rows: unknown[];
    error?: string;
  }> = [];

  for (const table of EXISTING_TABLES) {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      tables.push({
        table,
        rowCount: -1,
        rows: [],
        error: error.message,
      });
      console.log(`  ${table.padEnd(35)} ERR — ${error.message}`);
    } else {
      tables.push({
        table,
        rowCount: data?.length ?? 0,
        rows: data ?? [],
      });
      console.log(`  ${table.padEnd(35)} ${data?.length ?? 0} rows`);
    }
  }

  const backup = {
    capturedAt: new Date().toISOString(),
    source: "supabase REST API (twajlgkdvunrmbbjmmqo) pre-additive-migration",
    method: "anon-key REST (RLS applies)",
    tables,
  };

  const outDir = join(process.cwd(), "..", "backups");
  await mkdir(outDir, { recursive: true });
  const outPath = join(outDir, "db-data-pre-major-shift-2026-05-16.json");
  await writeFile(outPath, JSON.stringify(backup, null, 2), "utf-8");

  const totalRows = tables.reduce(
    (acc, t) => acc + (t.rowCount > 0 ? t.rowCount : 0),
    0,
  );
  console.log(`\n[rest-backup] Wrote ${totalRows} rows across ${tables.length} tables → ${outPath}`);
  /* eslint-enable no-console */
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[rest-backup] Failed:", err);
  process.exit(1);
});
