/**
 * Seed Indicator rows from src/lib/indicators.ts. Idempotent on `code`.
 *
 * Run AFTER seed-taxonomy and seed-theory-of-change because indicators
 * link to Programme/Activity/TocNode rows.
 *
 * Usage:  npm run seed:indicators
 */
import { INDICATORS, type IndicatorDefinition } from "../src/lib/indicators";
import { createSeedClient } from "./_prisma";

const prisma = createSeedClient();

async function resolveTocNodeId(code: string | undefined): Promise<number | null> {
  if (!code) return null;
  const node = await prisma.tocNode.findFirst({
    where: { code },
    select: { id: true },
  });
  return node?.id ?? null;
}

async function resolveProgrammeId(code: string | undefined): Promise<number | null> {
  if (!code) return null;
  const programme = await prisma.programme.findUnique({
    where: { code },
    select: { id: true },
  });
  return programme?.id ?? null;
}

async function resolveActivityId(code: string | undefined): Promise<number | null> {
  if (!code) return null;
  const activity = await prisma.activity.findUnique({
    where: { code },
    select: { id: true },
  });
  return activity?.id ?? null;
}

async function seedOne(def: IndicatorDefinition): Promise<void> {
  const [tocNodeId, programmeId, activityId] = await Promise.all([
    resolveTocNodeId(def.tocNodeCode),
    resolveProgrammeId(def.programmeCode),
    resolveActivityId(def.activityCode),
  ]);

  await prisma.indicator.upsert({
    where: { code: def.code },
    create: {
      code: def.code,
      name: def.name,
      description: def.description ?? null,
      level: def.level,
      unit: def.unit,
      disaggregateBy: [...def.disaggregateBy],
      computation: def.computation,
      derivedQuery: def.derivedQuery ?? null,
      tocNodeId,
      tocNodeCode: def.tocNodeCode ?? null,
      programmeId,
      activityId,
      isActive: def.isActive,
    },
    update: {
      name: def.name,
      description: def.description ?? null,
      level: def.level,
      unit: def.unit,
      disaggregateBy: [...def.disaggregateBy],
      computation: def.computation,
      derivedQuery: def.derivedQuery ?? null,
      tocNodeId,
      tocNodeCode: def.tocNodeCode ?? null,
      programmeId,
      activityId,
      isActive: def.isActive,
    },
  });
}

export async function seedIndicators(): Promise<{ rows: number }> {
  for (const def of INDICATORS) {
    await seedOne(def);
  }
  return { rows: INDICATORS.length };
}

async function main(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("[seed-indicators] Seeding indicator catalog …");
  const stats = await seedIndicators();
  // eslint-disable-next-line no-console
  console.log(`[seed-indicators] Done. ${stats.rows} indicators.`);
}

if (
  process.argv[1]?.endsWith("seed-indicators.ts") ||
  process.argv[1]?.endsWith("seed-indicators.js")
) {
  main()
    .then(() => prisma.$disconnect())
    .catch(async (err) => {
      // eslint-disable-next-line no-console
      console.error("[seed-indicators] Failed:", err);
      await prisma.$disconnect();
      process.exit(1);
    });
}
