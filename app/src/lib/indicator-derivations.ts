/**
 * Computed-indicator derivations. Each `derivedQuery` value in
 * `src/lib/indicators.ts` maps to one function here. Each derivation
 * returns a `DerivationResult` so the seeded `Indicator.derivedQuery`
 * value remains stable even if the underlying SQL changes.
 *
 * The /api/indicators/recompute endpoint walks every active derived
 * indicator, runs its derivation, and upserts an IndicatorPeriod row
 * for the supplied periodKey.
 *
 * Server-only.
 */
import { prisma } from "./prisma";
import { TransactionKind, EnrollmentStatus } from "@/generated/prisma/enums";

export interface DerivationResult {
  actual: number;
  disaggregation?: Record<string, Record<string, number>>;
}

export type DerivationFn = (
  periodKey: string,
  periodKind: "year" | "quarter" | "month",
) => Promise<DerivationResult>;

/* ─── helpers ──────────────────────────────────────────────────────── */

function parseYear(periodKey: string): number {
  const m = /^(\d{4})/.exec(periodKey);
  if (!m) throw new Error(`Cannot parse year from periodKey '${periodKey}'`);
  return Number(m[1]);
}

/* ─── derivations ──────────────────────────────────────────────────── */

const total_beneficiaries: DerivationFn = async () => {
  const count = await prisma.person.count();
  return { actual: count };
};

const active_beneficiaries: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  const count = await prisma.enrollment.count({
    where: {
      cohortYear: year,
      status: { in: [EnrollmentStatus.enrolled, EnrollmentStatus.active] },
    },
  });
  return { actual: count };
};

const retention_pct: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  const total = await prisma.enrollment.count({
    where: { cohortYear: year },
  });
  const retained = await prisma.enrollment.count({
    where: {
      cohortYear: year,
      status: {
        in: [
          EnrollmentStatus.enrolled,
          EnrollmentStatus.active,
          EnrollmentStatus.graduated,
        ],
      },
    },
  });
  return { actual: total === 0 ? 0 : (retained / total) * 100 };
};

const eco_club_enrolled: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  const count = await prisma.enrollment.count({
    where: {
      cohortYear: year,
      activity: { code: "eco_club" },
    },
  });
  return { actual: count };
};

const eco_club_retention: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  const total = await prisma.enrollment.count({
    where: { cohortYear: year, activity: { code: "eco_club" } },
  });
  const droppedOut = await prisma.enrollment.count({
    where: {
      cohortYear: year,
      activity: { code: "eco_club" },
      status: EnrollmentStatus.dropped_out,
    },
  });
  return { actual: total === 0 ? 0 : ((total - droppedOut) / total) * 100 };
};

const eco_kids_safari_count: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  const count = await prisma.enrollment.count({
    where: {
      cohortYear: year,
      activity: { code: "eco_kids_safari" },
    },
  });
  return { actual: count };
};

const hectares_compatible: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  const result = await prisma.agroforestryPlot.aggregate({
    _sum: { areaHectares: true },
    where: {
      plantingDate: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
  });
  return { actual: result._sum.areaHectares ?? 0 };
};

const seedlings_distributed: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  const result = await prisma.seedlingDistribution.aggregate({
    _sum: { quantity: true },
    where: {
      distributionDate: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
  });
  return { actual: result._sum.quantity ?? 0 };
};

const seedling_survival_pct: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  // Distributions in the year — count quantity.
  const distAgg = await prisma.seedlingDistribution.aggregate({
    _sum: { quantity: true },
    where: {
      distributionDate: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
  });
  const distributed = distAgg._sum.quantity ?? 0;

  if (distributed === 0) return { actual: 0 };

  // Latest survival check per distribution; sum survivingCount.
  // Cheap approximation: take the latest checkDate per distribution.
  const latest = await prisma.$queryRaw<
    Array<{ surviving: number }>
  >`SELECT SUM(sc."surviving_count")::int AS surviving
    FROM (
      SELECT DISTINCT ON (distribution_id) distribution_id, surviving_count, check_date
      FROM survival_checks
      ORDER BY distribution_id, check_date DESC
    ) sc
    JOIN seedling_distributions sd ON sd.id = sc.distribution_id
    WHERE sd.distribution_date >= ${new Date(`${year}-01-01`)}
      AND sd.distribution_date < ${new Date(`${year + 1}-01-01`)}`;

  const surviving = Number(latest[0]?.surviving ?? 0);
  return { actual: (surviving / distributed) * 100 };
};

const iga_groups_active: DerivationFn = async () => {
  const count = await prisma.group.count({
    where: {
      status: "active",
      activity: { subprogramme: { code: "iga" } },
    },
  });
  return { actual: count };
};

const iga_revenue_total: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  const result = await prisma.groupTransaction.aggregate({
    _sum: { amountTSh: true },
    where: {
      kind: TransactionKind.revenue,
      periodYearMonth: { startsWith: String(year) },
      group: { activity: { subprogramme: { code: "iga" } } },
    },
  });
  return { actual: Number(result._sum.amountTSh ?? 0) };
};

const iga_profit_total: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  const yearPrefix = String(year);

  const [revAgg, expAgg, distAgg] = await Promise.all([
    prisma.groupTransaction.aggregate({
      _sum: { amountTSh: true },
      where: {
        kind: TransactionKind.revenue,
        periodYearMonth: { startsWith: yearPrefix },
        group: { activity: { subprogramme: { code: "iga" } } },
      },
    }),
    prisma.groupTransaction.aggregate({
      _sum: { amountTSh: true },
      where: {
        kind: TransactionKind.expense,
        periodYearMonth: { startsWith: yearPrefix },
        group: { activity: { subprogramme: { code: "iga" } } },
      },
    }),
    prisma.groupTransaction.aggregate({
      _sum: { amountTSh: true },
      where: {
        kind: TransactionKind.distribution,
        periodYearMonth: { startsWith: yearPrefix },
        group: { activity: { subprogramme: { code: "iga" } } },
      },
    }),
  ]);

  const revenue = Number(revAgg._sum.amountTSh ?? 0);
  const expense = Number(expAgg._sum.amountTSh ?? 0);
  const distribution = Number(distAgg._sum.amountTSh ?? 0);
  return { actual: revenue - expense - distribution };
};

const srata_graduates: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  const count = await prisma.enrollment.count({
    where: {
      cohortYear: year,
      activity: { code: "srata_scholarship" },
      status: EnrollmentStatus.graduated,
    },
  });
  return { actual: count };
};

const srata_placed: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  const count = await prisma.enrollment.count({
    where: {
      cohortYear: year,
      activity: { code: "srata_internship" },
      status: { in: [EnrollmentStatus.active, EnrollmentStatus.graduated] },
    },
  });
  return { actual: count };
};

const outreach_beekeeping_groups: DerivationFn = async () => {
  const count = await prisma.group.count({
    where: {
      activity: { code: "outreach_beekeeping_group" },
      status: "active",
    },
  });
  return { actual: count };
};

const chilli_farms_fenced: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  const count = await prisma.enrollment.count({
    where: {
      cohortYear: year,
      activity: { code: "chilli_fencing_individual" },
      status: { in: [EnrollmentStatus.active, EnrollmentStatus.enrolled] },
    },
  });
  return { actual: count };
};

const cattle_incidents: DerivationFn = async (periodKey) => {
  const year = parseYear(periodKey);
  const count = await prisma.cattleIncident.count({
    where: {
      date: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
  });
  return { actual: count };
};

/* ─── registry ─────────────────────────────────────────────────────── */

export const DERIVATIONS: Record<string, DerivationFn> = {
  total_beneficiaries,
  active_beneficiaries,
  retention_pct,
  eco_club_enrolled,
  eco_club_retention,
  eco_kids_safari_count,
  hectares_compatible,
  seedlings_distributed,
  seedling_survival_pct,
  iga_groups_active,
  iga_revenue_total,
  iga_profit_total,
  srata_graduates,
  srata_placed,
  outreach_beekeeping_groups,
  chilli_farms_fenced,
  cattle_incidents,
};

export function getDerivation(name: string): DerivationFn | undefined {
  return DERIVATIONS[name];
}

export function listDerivationNames(): readonly string[] {
  return Object.keys(DERIVATIONS);
}
