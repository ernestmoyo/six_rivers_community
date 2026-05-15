/**
 * Seed the Programme taxonomy into Postgres from src/lib/taxonomy.ts.
 *
 * Idempotent — uses upsert keyed on `code` for every level. Re-runnable as
 * many times as needed. If a row is removed from `taxonomy.ts` it is NOT
 * automatically deleted from the DB — that's intentional. Deletions are
 * destructive and Edna should sign off on each one through the admin UI
 * rather than letting a seed script wipe historical references.
 *
 * Usage:  npm run seed:taxonomy
 */
import {
  TAXONOMY,
  type Activity,
  type Pillar,
  type Programme,
  type Subprogramme,
} from "../src/lib/taxonomy";
import { createSeedClient } from "./_prisma";

const prisma = createSeedClient();

interface SeedStats {
  pillars: number;
  programmes: number;
  subprogrammes: number;
  activities: number;
  variants: number;
}

async function seedActivity(activity: Activity, subprogrammeId: number, orderIndex: number): Promise<number> {
  const row = await prisma.activity.upsert({
    where: { code: activity.code },
    create: {
      code: activity.code,
      name: activity.name,
      description: activity.description ?? null,
      subprogrammeId,
      beneficiaryKind: activity.beneficiaryKind,
      sectorScope: activity.sectorScope,
      startYear: activity.startYear ?? null,
      endYear: activity.endYear ?? null,
      isActive: activity.isActive,
      orderIndex,
    },
    update: {
      name: activity.name,
      description: activity.description ?? null,
      subprogrammeId,
      beneficiaryKind: activity.beneficiaryKind,
      sectorScope: activity.sectorScope,
      startYear: activity.startYear ?? null,
      endYear: activity.endYear ?? null,
      isActive: activity.isActive,
      orderIndex,
    },
  });

  const variants = activity.variants ?? [];
  for (let i = 0; i < variants.length; i += 1) {
    const v = variants[i];
    await prisma.activityVariant.upsert({
      where: {
        activityId_code: {
          activityId: row.id,
          code: v.code,
        },
      },
      create: {
        activityId: row.id,
        code: v.code,
        label: v.label,
        note: v.note ?? null,
        orderIndex: i,
      },
      update: {
        label: v.label,
        note: v.note ?? null,
        orderIndex: i,
      },
    });
  }

  return variants.length;
}

async function seedSubprogramme(
  subprogramme: Subprogramme,
  programmeId: number,
  orderIndex: number,
): Promise<{ activities: number; variants: number }> {
  const row = await prisma.subprogramme.upsert({
    where: { code: subprogramme.code },
    create: {
      code: subprogramme.code,
      name: subprogramme.name,
      description: subprogramme.description ?? null,
      programmeId,
      orderIndex,
    },
    update: {
      name: subprogramme.name,
      description: subprogramme.description ?? null,
      programmeId,
      orderIndex,
    },
  });

  let activities = 0;
  let variants = 0;
  for (let i = 0; i < subprogramme.activities.length; i += 1) {
    const v = await seedActivity(subprogramme.activities[i], row.id, i);
    activities += 1;
    variants += v;
  }
  return { activities, variants };
}

async function seedProgramme(
  programme: Programme,
  pillarId: number,
  orderIndex: number,
): Promise<{ subprogrammes: number; activities: number; variants: number }> {
  const row = await prisma.programme.upsert({
    where: { code: programme.code },
    create: {
      code: programme.code,
      name: programme.name,
      description: programme.description ?? null,
      pillarId,
      orderIndex,
    },
    update: {
      name: programme.name,
      description: programme.description ?? null,
      pillarId,
      orderIndex,
    },
  });

  let subprogrammes = 0;
  let activities = 0;
  let variants = 0;
  for (let i = 0; i < programme.subprogrammes.length; i += 1) {
    const r = await seedSubprogramme(programme.subprogrammes[i], row.id, i);
    subprogrammes += 1;
    activities += r.activities;
    variants += r.variants;
  }
  return { subprogrammes, activities, variants };
}

async function seedPillar(pillar: Pillar, orderIndex: number): Promise<SeedStats> {
  const row = await prisma.pillar.upsert({
    where: { code: pillar.code },
    create: {
      code: pillar.code,
      name: pillar.name,
      description: pillar.description ?? null,
      isActive: pillar.isActive,
      placeholder: pillar.placeholder ?? false,
      orderIndex,
    },
    update: {
      name: pillar.name,
      description: pillar.description ?? null,
      isActive: pillar.isActive,
      placeholder: pillar.placeholder ?? false,
      orderIndex,
    },
  });

  let programmes = 0;
  let subprogrammes = 0;
  let activities = 0;
  let variants = 0;
  for (let i = 0; i < pillar.programmes.length; i += 1) {
    const r = await seedProgramme(pillar.programmes[i], row.id, i);
    programmes += 1;
    subprogrammes += r.subprogrammes;
    activities += r.activities;
    variants += r.variants;
  }
  return { pillars: 1, programmes, subprogrammes, activities, variants };
}

export async function seedTaxonomy(): Promise<SeedStats> {
  const totals: SeedStats = {
    pillars: 0,
    programmes: 0,
    subprogrammes: 0,
    activities: 0,
    variants: 0,
  };
  for (let i = 0; i < TAXONOMY.length; i += 1) {
    const s = await seedPillar(TAXONOMY[i], i);
    totals.pillars += s.pillars;
    totals.programmes += s.programmes;
    totals.subprogrammes += s.subprogrammes;
    totals.activities += s.activities;
    totals.variants += s.variants;
  }
  return totals;
}

async function main(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("[seed-taxonomy] Seeding programme taxonomy …");
  const stats = await seedTaxonomy();
  // eslint-disable-next-line no-console
  console.log(`[seed-taxonomy] Done. ${stats.pillars} pillars, ${stats.programmes} programmes, ${stats.subprogrammes} subprogrammes, ${stats.activities} activities, ${stats.variants} variants.`);
}

// Execute when run directly (not when imported by tests).
if (process.argv[1]?.endsWith("seed-taxonomy.ts") || process.argv[1]?.endsWith("seed-taxonomy.js")) {
  main()
    .then(() => prisma.$disconnect())
    .catch(async (err) => {
      // eslint-disable-next-line no-console
      console.error("[seed-taxonomy] Failed:", err);
      await prisma.$disconnect();
      process.exit(1);
    });
}
