/**
 * Exports the rows from every existing Supabase table to a JSON file —
 * belt-and-braces revert anchor before the additive migration on
 * 2026-05-16.
 *
 * Reads via pg directly (raw SQL), not via Prisma models, because Prisma
 * only knows about the new spine tables — the existing ones live in
 * Supabase only.
 *
 * Output: backups/db-data-pre-major-shift-2026-05-16.json
 */
import "dotenv/config";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import pg from "pg";

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

interface TableDump {
  table: string;
  rowCount: number;
  rows: unknown[];
}

interface Backup {
  capturedAt: string;
  source: string;
  tables: TableDump[];
}

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL not set");
  }

  const client = new pg.Client({ connectionString });
  await client.connect();

  /* eslint-disable no-console */
  const tables: TableDump[] = [];
  try {
    for (const table of EXISTING_TABLES) {
      try {
        const { rows } = await client.query(`SELECT * FROM ${table}`);
        tables.push({ table, rowCount: rows.length, rows });
        console.log(`  ${table.padEnd(35)} ${rows.length} rows`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`  ${table.padEnd(35)} SKIP — ${msg}`);
        tables.push({ table, rowCount: -1, rows: [{ error: msg }] });
      }
    }
  } finally {
    await client.end();
  }

  const backup: Backup = {
    capturedAt: new Date().toISOString(),
    source: "supabase project twajlgkdvunrmbbjmmqo (pre-additive-migration)",
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
  console.log(`\n[backup] Wrote ${totalRows} rows across ${tables.length} tables → ${outPath}`);
  /* eslint-enable no-console */
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[backup] Failed:", err);
  process.exit(1);
});
