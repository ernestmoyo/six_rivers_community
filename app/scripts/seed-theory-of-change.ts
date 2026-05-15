/**
 * Seed the Theory of Change rows from src/lib/theory-of-change.ts.
 *
 * Idempotent — keyed on (scope, pillarId, programmeId, version). If the
 * ToC content in theory-of-change.ts changes, bump the `version` field and
 * re-run; previous versions remain in the DB for audit.
 *
 * Usage:  npm run seed:toc
 */
import { ALL_TOCS, type TheoryOfChange } from "../src/lib/theory-of-change";
import { createSeedClient } from "./_prisma";

const prisma = createSeedClient();

async function seedToc(toc: TheoryOfChange): Promise<{ tocId: number; nodes: number }> {
  const pillar = toc.pillarCode
    ? await prisma.pillar.findUnique({ where: { code: toc.pillarCode } })
    : null;
  const programme = toc.programmeCode
    ? await prisma.programme.findUnique({ where: { code: toc.programmeCode } })
    : null;

  if (toc.scope === "pillar" && !pillar) {
    throw new Error(
      `[seed-toc] Pillar '${toc.pillarCode}' not found. Run seed:taxonomy first.`,
    );
  }
  if (toc.scope === "programme" && !programme) {
    throw new Error(
      `[seed-toc] Programme '${toc.programmeCode}' not found. Run seed:taxonomy first.`,
    );
  }

  // Prisma's compound-unique input rejects null components, so we do a
  // find-first followed by either update or create. This is equivalent to
  // an upsert and is the canonical pattern for unique constraints that
  // include nullable FKs.
  const existing = await prisma.theoryOfChange.findFirst({
    where: {
      scope: toc.scope,
      pillarId: pillar?.id ?? null,
      programmeId: programme?.id ?? null,
      version: toc.version,
    },
  });

  const row = existing
    ? await prisma.theoryOfChange.update({
        where: { id: existing.id },
        data: {
          title: toc.title,
          narrative: toc.narrative,
        },
      })
    : await prisma.theoryOfChange.create({
        data: {
          scope: toc.scope,
          pillarId: pillar?.id ?? null,
          programmeId: programme?.id ?? null,
          version: toc.version,
          title: toc.title,
          narrative: toc.narrative,
          publishedAt: new Date(),
        },
      });

  // Wipe + reinsert nodes for this version. Nodes are write-once per version;
  // editing within a version means re-running this seed, which is fine since
  // node codes are stable identifiers and downstream indicators reference by
  // (tocId, code), not by node id.
  await prisma.tocNode.deleteMany({ where: { tocId: row.id } });

  for (let i = 0; i < toc.nodes.length; i += 1) {
    const node = toc.nodes[i];
    await prisma.tocNode.create({
      data: {
        tocId: row.id,
        code: node.code,
        level: node.level,
        statement: node.statement,
        note: node.note ?? null,
        orderIndex: i,
      },
    });
  }

  return { tocId: row.id, nodes: toc.nodes.length };
}

export async function seedTheoryOfChange(): Promise<{ tocs: number; nodes: number }> {
  let tocs = 0;
  let nodes = 0;
  for (const toc of ALL_TOCS) {
    const r = await seedToc(toc);
    tocs += 1;
    nodes += r.nodes;
  }
  return { tocs, nodes };
}

async function main(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("[seed-toc] Seeding Theory of Change …");
  const stats = await seedTheoryOfChange();
  // eslint-disable-next-line no-console
  console.log(`[seed-toc] Done. ${stats.tocs} ToCs, ${stats.nodes} nodes.`);
}

if (
  process.argv[1]?.endsWith("seed-theory-of-change.ts") ||
  process.argv[1]?.endsWith("seed-theory-of-change.js")
) {
  main()
    .then(() => prisma.$disconnect())
    .catch(async (err) => {
      // eslint-disable-next-line no-console
      console.error("[seed-toc] Failed:", err);
      await prisma.$disconnect();
      process.exit(1);
    });
}
