/**
 * Seed `OperationalLocation` rows from the curated list captured in the
 * project memory (`project_operational_locations.md`), reconciled against
 * Lilian Mihambo and Edna Sonda's corrections from May 2026.
 *
 * For each row we either link to the canonical Village shapefile row (if it
 * exists) and mark `matched`/`alias_override`, or mark `missing_in_shapefile`
 * /`decommissioned`. Edna then walks the /villages/reconcile page line by
 * line and confirms each row before the Brandon meeting.
 *
 * Idempotent — upserts by displayName + sector tuple.
 *
 * Usage:  npm run seed:locations
 */
import { PrismaClient, ReconciliationStatus, OperationalLocationKind } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

interface OperationalLocationSeed {
  kind: OperationalLocationKind;
  displayName: string;
  aliases?: string[];
  reconciliationStatus: ReconciliationStatus;
  sector?: "msolwa" | "usangu" | "outreach";
  isOperational: boolean;
  notes?: string;
  /** Hint to look up the canonical village by name (case-insensitive) */
  canonicalVillageName?: string;
  /** Hint to look up the canonical ward by name (case-insensitive) */
  canonicalWardName?: string;
}

const SEEDS: readonly OperationalLocationSeed[] = [
  // ─── Mbarali / Madibira ward ────────────────────────────
  {
    kind: OperationalLocationKind.village,
    displayName: "Iheha",
    aliases: ["Lheha"],
    reconciliationStatus: ReconciliationStatus.alias_override,
    sector: "usangu",
    isOperational: true,
    notes: "Edna confirmed spelling — starts with I, not L.",
    canonicalVillageName: "Iheha",
    canonicalWardName: "Madibira",
  },
  {
    kind: OperationalLocationKind.village,
    displayName: "Ikoga Mpia",
    aliases: ["Ikoga Mpya", "New Ikoga"],
    reconciliationStatus: ReconciliationStatus.alias_override,
    sector: "usangu",
    isOperational: true,
    notes:
      "New Ikoga — village ~20km from old Ikoga, established after Nyerere NP " +
      "expansion forced relocation. Old Ikoga is now inside the park; see " +
      "the decommissioned row.",
    canonicalVillageName: "Ikoga Mpia",
    canonicalWardName: "Madibira",
  },
  {
    kind: OperationalLocationKind.village,
    displayName: "Ikoga (old)",
    reconciliationStatus: ReconciliationStatus.decommissioned,
    sector: "usangu",
    isOperational: false,
    notes:
      "Old Ikoga village — inside Nyerere NP boundary after park expansion. " +
      "Not a community location anymore. Kept for historical records.",
    canonicalVillageName: "Ikoga",
  },
  {
    kind: OperationalLocationKind.village,
    displayName: "Chalizuka",
    reconciliationStatus: ReconciliationStatus.missing_in_shapefile,
    sector: "usangu",
    isOperational: true,
    notes:
      "Operational village; not in the Tanzania_Admin_Shapefiles seed. " +
      "Needs Edna to confirm ward (assumed Madibira).",
    canonicalWardName: "Madibira",
  },
  // ─── Mbarali / Nyombweni ward (only three operational villages) ──
  {
    kind: OperationalLocationKind.village,
    displayName: "Mapogoro",
    reconciliationStatus: ReconciliationStatus.pending,
    sector: "usangu",
    isOperational: true,
    canonicalVillageName: "Mapogoro",
    canonicalWardName: "Nyombweni",
  },
  {
    kind: OperationalLocationKind.village,
    displayName: "Magigiwe",
    reconciliationStatus: ReconciliationStatus.pending,
    sector: "usangu",
    isOperational: true,
    canonicalVillageName: "Magigiwe",
    canonicalWardName: "Nyombweni",
  },
  {
    kind: OperationalLocationKind.village,
    displayName: "Mulongo",
    reconciliationStatus: ReconciliationStatus.pending,
    sector: "usangu",
    isOperational: true,
    canonicalVillageName: "Mulongo",
    canonicalWardName: "Nyombweni",
  },

  // ─── Kilombero / Msolwa sector ──────────────────────────
  {
    kind: OperationalLocationKind.ward,
    displayName: "Kibaoni",
    reconciliationStatus: ReconciliationStatus.pending,
    sector: "msolwa",
    isOperational: true,
    canonicalWardName: "Kibaoni",
  },
  {
    kind: OperationalLocationKind.village,
    displayName: "Mbasa (village)",
    aliases: ["Mbasa"],
    reconciliationStatus: ReconciliationStatus.alias_override,
    sector: "msolwa",
    isOperational: true,
    notes:
      "Mbasa is both a ward and a village within Kibaoni ward. The team " +
      "works in the village; the ward is a separate row.",
    canonicalVillageName: "Mbasa",
    canonicalWardName: "Kibaoni",
  },
  {
    kind: OperationalLocationKind.ward,
    displayName: "Mbasa (ward)",
    aliases: ["Mbasa"],
    reconciliationStatus: ReconciliationStatus.pending,
    sector: "msolwa",
    isOperational: true,
    canonicalWardName: "Mbasa",
  },
  {
    kind: OperationalLocationKind.village,
    displayName: "Mgheleu",
    reconciliationStatus: ReconciliationStatus.pending,
    sector: "msolwa",
    isOperational: true,
    canonicalVillageName: "Mgheleu",
    canonicalWardName: "Kibaoni",
  },
  {
    kind: OperationalLocationKind.ward,
    displayName: "Iberege",
    aliases: ["Iberian"],
    reconciliationStatus: ReconciliationStatus.alias_override,
    sector: "msolwa",
    isOperational: true,
    canonicalWardName: "Iberege",
  },
  {
    kind: OperationalLocationKind.ward,
    displayName: "Isasawa",
    reconciliationStatus: ReconciliationStatus.pending,
    sector: "msolwa",
    isOperational: true,
    canonicalWardName: "Isasawa",
  },
  {
    kind: OperationalLocationKind.ward,
    displayName: "Mwaya",
    aliases: ["Manguna"],
    reconciliationStatus: ReconciliationStatus.alias_override,
    sector: "msolwa",
    isOperational: true,
    canonicalWardName: "Mwaya",
  },
  {
    kind: OperationalLocationKind.ward,
    displayName: "Sanje",
    aliases: ["Sanchez"],
    reconciliationStatus: ReconciliationStatus.alias_override,
    sector: "msolwa",
    isOperational: true,
    canonicalWardName: "Sanje",
  },
  {
    kind: OperationalLocationKind.ward,
    displayName: "Katindiuka",
    reconciliationStatus: ReconciliationStatus.split_disputed,
    sector: "msolwa",
    isOperational: true,
    notes:
      "Edna says Katindiuka is a ward; old shapefile had it as a village " +
      "under Ifakara ward. Needs reconciliation with the canonical layer.",
    canonicalWardName: "Katindiuka",
  },
  {
    kind: OperationalLocationKind.ward,
    displayName: "Ndogoza",
    reconciliationStatus: ReconciliationStatus.pending,
    sector: "msolwa",
    isOperational: true,
    canonicalWardName: "Ndogoza",
  },

  // ─── Kilombero quirks ──────────────────────────────────
  {
    kind: OperationalLocationKind.ward,
    displayName: "Mlimba",
    reconciliationStatus: ReconciliationStatus.split_disputed,
    sector: "msolwa",
    isOperational: false,
    notes:
      "Mlimba was historically in Kilombero; now its own district. Do not " +
      "seed under Kilombero — kept as a marker so the admin tool surfaces " +
      "the split.",
    canonicalWardName: "Mlimba",
  },
];

async function findCanonicalVillage(name?: string) {
  if (!name) return null;
  return prisma.village.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
}

async function findCanonicalWard(name?: string) {
  if (!name) return null;
  return prisma.ward.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
}

async function seedOne(seed: OperationalLocationSeed): Promise<void> {
  const canonicalVillage = await findCanonicalVillage(seed.canonicalVillageName);
  const canonicalWard = await findCanonicalWard(seed.canonicalWardName);

  // Adjust reconciliation status: if we asked for an alias override or
  // matched but the canonical row was not found, flip to missing.
  let status = seed.reconciliationStatus;
  if (
    (status === ReconciliationStatus.matched ||
      status === ReconciliationStatus.alias_override ||
      status === ReconciliationStatus.pending) &&
    seed.kind === OperationalLocationKind.village &&
    !canonicalVillage
  ) {
    status = ReconciliationStatus.missing_in_shapefile;
  }
  if (
    (status === ReconciliationStatus.matched ||
      status === ReconciliationStatus.pending) &&
    seed.kind === OperationalLocationKind.ward &&
    !canonicalWard
  ) {
    status = ReconciliationStatus.missing_in_shapefile;
  }

  // No natural unique key, so dedupe by (displayName, sector, kind).
  const existing = await prisma.operationalLocation.findFirst({
    where: {
      displayName: seed.displayName,
      sector: seed.sector ?? null,
      kind: seed.kind,
    },
  });

  if (existing) {
    await prisma.operationalLocation.update({
      where: { id: existing.id },
      data: {
        aliases: seed.aliases ?? [],
        reconciliationStatus: status,
        notes: seed.notes ?? null,
        isOperational: seed.isOperational,
        canonicalVillageId: canonicalVillage?.id ?? null,
        canonicalWardId: canonicalWard?.id ?? null,
      },
    });
  } else {
    await prisma.operationalLocation.create({
      data: {
        kind: seed.kind,
        displayName: seed.displayName,
        aliases: seed.aliases ?? [],
        reconciliationStatus: status,
        notes: seed.notes ?? null,
        isOperational: seed.isOperational,
        sector: seed.sector ?? null,
        canonicalVillageId: canonicalVillage?.id ?? null,
        canonicalWardId: canonicalWard?.id ?? null,
      },
    });
  }
}

export async function seedOperationalLocations(): Promise<{ rows: number }> {
  for (const seed of SEEDS) {
    await seedOne(seed);
  }
  return { rows: SEEDS.length };
}

async function main(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("[seed-locations] Seeding operational locations …");
  const stats = await seedOperationalLocations();
  // eslint-disable-next-line no-console
  console.log(`[seed-locations] Done. ${stats.rows} rows.`);
}

if (
  process.argv[1]?.endsWith("seed-operational-locations.ts") ||
  process.argv[1]?.endsWith("seed-operational-locations.js")
) {
  main()
    .then(() => prisma.$disconnect())
    .catch(async (err) => {
      // eslint-disable-next-line no-console
      console.error("[seed-locations] Failed:", err);
      await prisma.$disconnect();
      process.exit(1);
    });
}
