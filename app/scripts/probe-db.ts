/**
 * Quick connection sanity-check — pings the DB via the pooler and reports
 * which existing tables are visible. Used before running the additive
 * migration so we know the credentials + network path actually work.
 */
import "dotenv/config";
import pg from "pg";

async function main(): Promise<void> {
  const url = process.env.SESSION_POOLER_URI ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error("SESSION_POOLER_URI / DATABASE_URL not set");
  }
  const client = new pg.Client({ connectionString: url });
  await client.connect();

  /* eslint-disable no-console */
  try {
    const { rows: version } = await client.query("SELECT version() AS v");
    console.log("Connected. PostgreSQL:", String(version[0]?.v).split(" ").slice(0, 2).join(" "));

    const { rows: tables } = await client.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' ORDER BY table_name`,
    );
    console.log(`\n${tables.length} tables in 'public' schema:`);
    for (const t of tables) {
      console.log("  -", t.table_name);
    }

    const { rows: ext } = await client.query(
      "SELECT extname FROM pg_extension ORDER BY extname",
    );
    console.log(`\n${ext.length} extensions enabled:`);
    for (const e of ext) {
      console.log("  -", e.extname);
    }
  } finally {
    await client.end();
  }
  /* eslint-enable no-console */
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Probe failed:", err.message);
  process.exit(1);
});
