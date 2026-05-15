/**
 * Six Rivers Africa — Indicator Catalog
 *
 * The numbers Mary reports to donors each quarter. Each Indicator points
 * (optionally) at a TocNode code so the donor narrative can say
 * "Output X measured by indicator Y reached 87% of target".
 *
 * Computation is either:
 *   - `manual`  — entered by the team (e.g. CAHPS test averages from a
 *                 partner-run survey)
 *   - `derived` — computed by `src/lib/indicator-derivations.ts` over the
 *                 Enrollment / GroupTransaction / SurvivalCheck /
 *                 CattleIncident / FieldVisit tables.
 *
 * The seed script `scripts/seed-indicators.ts` upserts these into the
 * `Indicator` table by `code` (unique).
 */
import type { TocLevel } from "./theory-of-change";

export type IndicatorUnit =
  | "count"
  | "percent"
  | "ha"
  | "TSh"
  | "kg"
  | "km"
  | "hours"
  | "score";

export type IndicatorComputation = "manual" | "derived";

export type Disaggregation =
  | "sex"
  | "district"
  | "village"
  | "sector"
  | "cohortYear"
  | "schoolClass"
  | "activity";

export interface IndicatorDefinition {
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly level: TocLevel;
  readonly unit: IndicatorUnit;
  readonly disaggregateBy: readonly Disaggregation[];
  readonly computation: IndicatorComputation;
  /** Identifier of the derivation in indicator-derivations.ts */
  readonly derivedQuery?: string;
  /** Optional TocNode code this indicator measures */
  readonly tocNodeCode?: string;
  /** Optional programme/activity scope */
  readonly programmeCode?: string;
  readonly activityCode?: string;
  readonly isActive: boolean;
}

export const INDICATORS: readonly IndicatorDefinition[] = [
  // ─── Community pillar overarching ────────────────────────────
  {
    code: "cmty.total_beneficiaries",
    name: "Total beneficiaries (all programmes)",
    description:
      "Count of distinct Persons across all Activities and all cohorts.",
    level: "output",
    unit: "count",
    disaggregateBy: ["sex", "sector", "district"],
    computation: "derived",
    derivedQuery: "total_beneficiaries",
    tocNodeCode: "cmty.output.cohorts",
    isActive: true,
  },
  {
    code: "cmty.active_beneficiaries",
    name: "Active beneficiaries (current year)",
    description:
      "Enrollments in status 'enrolled' or 'active' in the current cohort year.",
    level: "output",
    unit: "count",
    disaggregateBy: ["sex", "sector", "activity"],
    computation: "derived",
    derivedQuery: "active_beneficiaries",
    tocNodeCode: "cmty.output.cohorts",
    isActive: true,
  },
  {
    code: "cmty.retention_pct",
    name: "Year-over-year retention (community pillar)",
    description:
      "Of beneficiaries in cohort N, percent still active or graduated in cohort N+1.",
    level: "outcome",
    unit: "percent",
    disaggregateBy: ["activity", "sex"],
    computation: "derived",
    derivedQuery: "retention_pct",
    tocNodeCode: "cmty.outcome.literacy",
    isActive: true,
  },

  // ─── HWCE — Eco Clubs ────────────────────────────────────────
  {
    code: "hwce.students_enrolled",
    name: "Eco Club students enrolled",
    level: "output",
    unit: "count",
    disaggregateBy: ["cohortYear", "sex", "schoolClass", "sector"],
    computation: "derived",
    derivedQuery: "eco_club_enrolled",
    tocNodeCode: "hwce.output.students_enrolled",
    programmeCode: "hwce",
    activityCode: "eco_club",
    isActive: true,
  },
  {
    code: "hwce.students_retained_pct",
    name: "Eco Club retention rate (per cohort)",
    description:
      "Percent of Eco Club enrollments NOT in status 'dropped_out' in the cohort year.",
    level: "outcome",
    unit: "percent",
    disaggregateBy: ["cohortYear", "schoolClass", "sector"],
    computation: "derived",
    derivedQuery: "eco_club_retention",
    tocNodeCode: "hwce.output.students_retained",
    programmeCode: "hwce",
    activityCode: "eco_club",
    isActive: true,
  },
  {
    code: "hwce.eco_kids_safari_count",
    name: "Eco Kids Safari participants",
    level: "output",
    unit: "count",
    disaggregateBy: ["cohortYear", "sector"],
    computation: "derived",
    derivedQuery: "eco_kids_safari_count",
    tocNodeCode: "hwce.activity.eco_kids_safari",
    programmeCode: "hwce",
    activityCode: "eco_kids_safari",
    isActive: true,
  },
  {
    code: "hwce.cahps_score_avg",
    name: "CAHPS academic-performance score (Eco Club)",
    description:
      "Mean score from the partner-run CAHPS academic-performance survey, per cohort.",
    level: "outcome",
    unit: "score",
    disaggregateBy: ["cohortYear", "schoolClass", "sex"],
    computation: "manual",
    tocNodeCode: "hwce.outcome.literacy",
    programmeCode: "hwce",
    activityCode: "eco_club",
    isActive: true,
  },

  // ─── HWCE — Conservation-Compatible Farming ──────────────────
  {
    code: "hwce.hectares_compatible",
    name: "Hectares under conservation-compatible farming",
    level: "output",
    unit: "ha",
    disaggregateBy: ["activity", "sector"],
    computation: "derived",
    derivedQuery: "hectares_compatible",
    tocNodeCode: "hwce.output.hectares",
    programmeCode: "hwce",
    isActive: true,
  },
  {
    code: "hwce.seedlings_distributed",
    name: "Seedlings distributed",
    level: "output",
    unit: "count",
    disaggregateBy: ["cohortYear", "sector"],
    computation: "derived",
    derivedQuery: "seedlings_distributed",
    tocNodeCode: "hwce.output.seedlings",
    programmeCode: "hwce",
    isActive: true,
  },
  {
    code: "hwce.seedling_survival_pct",
    name: "Seedling survival rate",
    description:
      "Sum of latest survivingCount across SurvivalChecks divided by Sum of seedlings distributed.",
    level: "outcome",
    unit: "percent",
    disaggregateBy: ["activity", "sector"],
    computation: "derived",
    derivedQuery: "seedling_survival_pct",
    tocNodeCode: "hwce.output.seedlings",
    programmeCode: "hwce",
    isActive: true,
  },

  // ─── HWCE — IGA ─────────────────────────────────────────────
  {
    code: "hwce.iga_groups_active",
    name: "Active IGA groups",
    level: "output",
    unit: "count",
    disaggregateBy: ["activity", "sector"],
    computation: "derived",
    derivedQuery: "iga_groups_active",
    tocNodeCode: "hwce.output.iga_revenue",
    programmeCode: "hwce",
    isActive: true,
  },
  {
    code: "hwce.iga_revenue_total",
    name: "IGA group revenue (TSh)",
    description: "Sum of GroupTransaction.amountTSh where kind='revenue'.",
    level: "output",
    unit: "TSh",
    disaggregateBy: ["activity", "sector"],
    computation: "derived",
    derivedQuery: "iga_revenue_total",
    tocNodeCode: "hwce.output.iga_revenue",
    programmeCode: "hwce",
    isActive: true,
  },
  {
    code: "hwce.iga_profit_total",
    name: "IGA group profit (TSh)",
    description:
      "Sum of (revenue) − Sum of (expense + distribution). Capital is not netted in.",
    level: "outcome",
    unit: "TSh",
    disaggregateBy: ["activity", "sector"],
    computation: "derived",
    derivedQuery: "iga_profit_total",
    tocNodeCode: "hwce.outcome.income",
    programmeCode: "hwce",
    isActive: true,
  },

  // ─── HWCE — Community Awareness ─────────────────────────────
  {
    code: "hwce.radio_sessions",
    name: "Radio programme sessions broadcast",
    level: "output",
    unit: "count",
    disaggregateBy: [],
    computation: "manual",
    tocNodeCode: "hwce.output.reach",
    programmeCode: "hwce",
    activityCode: "msolwa_radio",
    isActive: true,
  },

  // ─── SRATA Academy ──────────────────────────────────────────
  {
    code: "srata.graduates",
    name: "SRATA Academy graduates",
    level: "output",
    unit: "count",
    disaggregateBy: ["cohortYear", "sex", "sector"],
    computation: "derived",
    derivedQuery: "srata_graduates",
    tocNodeCode: "srata.output.graduates",
    programmeCode: "srata_academy",
    activityCode: "srata_scholarship",
    isActive: true,
  },
  {
    code: "srata.placed",
    name: "SRATA graduates placed in internships",
    level: "output",
    unit: "count",
    disaggregateBy: ["cohortYear"],
    computation: "derived",
    derivedQuery: "srata_placed",
    tocNodeCode: "srata.output.placed",
    programmeCode: "srata_academy",
    activityCode: "srata_internship",
    isActive: true,
  },
  {
    code: "srata.employed_12mo_pct",
    name: "SRATA graduates employed 12 months later",
    description:
      "Percent of graduates with tracer-survey 'employed' status at +12 months.",
    level: "outcome",
    unit: "percent",
    disaggregateBy: ["cohortYear", "sex"],
    computation: "manual",
    tocNodeCode: "srata.output.employed_12mo",
    programmeCode: "srata_academy",
    activityCode: "srata_tracer",
    isActive: true,
  },

  // ─── Beekeeping ─────────────────────────────────────────────
  {
    code: "bee.hives_active",
    name: "Active beekeeping hives (Iluma + outreach)",
    level: "output",
    unit: "count",
    disaggregateBy: ["sector"],
    computation: "manual",
    tocNodeCode: "bee.output.active_hives",
    programmeCode: "beekeeping",
    isActive: true,
  },
  {
    code: "bee.outreach_groups",
    name: "Outreach beekeeping groups",
    level: "output",
    unit: "count",
    disaggregateBy: ["district"],
    computation: "derived",
    derivedQuery: "outreach_beekeeping_groups",
    tocNodeCode: "bee.output.groups_outreach",
    programmeCode: "beekeeping",
    activityCode: "outreach_beekeeping_group",
    isActive: true,
  },

  // ─── Chilli Fencing ─────────────────────────────────────────
  {
    code: "chilli.farms_fenced",
    name: "Farms with chilli fencing",
    level: "output",
    unit: "count",
    disaggregateBy: ["cohortYear", "sector"],
    computation: "derived",
    derivedQuery: "chilli_farms_fenced",
    tocNodeCode: "chilli.output.fenced",
    programmeCode: "chilli_fencing",
    activityCode: "chilli_fencing_individual",
    isActive: true,
  },

  // ─── Protection placeholder ─────────────────────────────────
  {
    code: "prot.cattle_incidents",
    name: "Cattle incursion incidents",
    level: "output",
    unit: "count",
    disaggregateBy: ["sector", "village"],
    computation: "derived",
    derivedQuery: "cattle_incidents",
    isActive: true,
  },
];

export function findIndicator(code: string): IndicatorDefinition | undefined {
  return INDICATORS.find((i) => i.code === code);
}

export function indicatorsByProgramme(
  programmeCode: string,
): readonly IndicatorDefinition[] {
  return INDICATORS.filter((i) => i.programmeCode === programmeCode);
}

export function indicatorsByLevel(
  level: TocLevel,
): readonly IndicatorDefinition[] {
  return INDICATORS.filter((i) => i.level === level);
}

export function indicatorsByTocNode(
  tocNodeCode: string,
): readonly IndicatorDefinition[] {
  return INDICATORS.filter((i) => i.tocNodeCode === tocNodeCode);
}
