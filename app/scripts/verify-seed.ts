/**
 * Verify the seed actually landed in Supabase. Quick counts + a sample row
 * each from the most important tables, so we can be confident before
 * pointing the UI at the live data.
 */
import "dotenv/config";
import pg from "pg";

async function main(): Promise<void> {
  const url = process.env.SESSION_POOLER_URI ?? process.env.DATABASE_URL;
  if (!url) throw new Error("No DB URL");
  const client = new pg.Client({ connectionString: url });
  await client.connect();

  /* eslint-disable no-console */
  try {
    const tables = [
      "pillars",
      "programmes",
      "subprogrammes",
      "activities",
      "activity_variants",
      "operational_locations",
      "theories_of_change",
      "toc_nodes",
      "indicators",
      "indicator_periods",
      "persons",
      "groups",
      "enrollments",
    ];

    console.log("Row counts in new spine:");
    for (const t of tables) {
      const { rows } = await client.query(`SELECT COUNT(*)::int AS n FROM ${t}`);
      console.log(`  ${t.padEnd(28)} ${rows[0].n}`);
    }

    console.log("\nSeeded pillars:");
    const { rows: pillars } = await client.query(
      `SELECT code, name, placeholder FROM pillars ORDER BY order_index`,
    );
    for (const p of pillars) {
      console.log(`  - ${p.code}: ${p.name}${p.placeholder ? " (placeholder)" : ""}`);
    }

    console.log("\nSeeded programmes:");
    const { rows: progs } = await client.query(
      `SELECT p.code AS code, p.name AS name, pi.name AS pillar
       FROM programmes p JOIN pillars pi ON pi.id = p.pillar_id
       ORDER BY pi.order_index, p.order_index`,
    );
    for (const p of progs) {
      console.log(`  - [${p.pillar}] ${p.name}`);
    }

    console.log("\nOperational locations by reconciliation status:");
    const { rows: locs } = await client.query(
      `SELECT reconciliation_status, COUNT(*)::int AS n
       FROM operational_locations
       GROUP BY reconciliation_status
       ORDER BY n DESC`,
    );
    for (const l of locs) {
      console.log(`  - ${l.reconciliation_status.padEnd(24)} ${l.n}`);
    }

    console.log("\nIndicators by computation kind:");
    const { rows: inds } = await client.query(
      `SELECT computation, COUNT(*)::int AS n
       FROM indicators
       GROUP BY computation
       ORDER BY computation`,
    );
    for (const i of inds) {
      console.log(`  - ${i.computation.padEnd(8)} ${i.n}`);
    }

    console.log("\nSample: 3 indicators with their TocNode statements:");
    const { rows: samples } = await client.query(
      `SELECT i.code, i.name, t.statement
       FROM indicators i LEFT JOIN toc_nodes t ON t.id = i.toc_node_id
       WHERE i.toc_node_id IS NOT NULL
       LIMIT 3`,
    );
    for (const s of samples) {
      console.log(`  - ${s.code}`);
      console.log(`    "${s.name}"`);
      console.log(`    measures: "${s.statement}"`);
    }
  } finally {
    await client.end();
  }
  /* eslint-enable no-console */
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Verify failed:", err.message);
  process.exit(1);
});
