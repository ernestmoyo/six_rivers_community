/**
 * Six Rivers Africa — Programme Taxonomy
 *
 * Source of truth for the Pillar → Programme → Subprogramme → Activity tree
 * captured from Edna Sonda's walkthrough on 2026-05-14. Both the UI tree
 * viewer and the Prisma seed script read from this module — never duplicate
 * the tree elsewhere.
 *
 * If Edna's tree changes: edit this file, run the seed script, ship.
 *
 * Cross-references:
 *   - Memory: project_taxonomy_per_edna.md
 *   - Plan: ~/.claude/plans/keen-launching-stroustrup.md
 *   - Source transcripts: docs/7 square- Ernest/.../Standard recording 15.txt
 */

export type Sector = 'msolwa' | 'usangu' | 'both' | 'outreach';
export type BeneficiaryKind = 'individual' | 'group' | 'school' | 'mixed';

export interface ActivityVariant {
  readonly code: string;
  readonly label: string;
  readonly note?: string;
}

export interface Activity {
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly beneficiaryKind: BeneficiaryKind;
  readonly sectorScope: Sector;
  readonly startYear?: number;
  readonly endYear?: number;
  readonly isActive: boolean;
  readonly variants?: readonly ActivityVariant[];
}

export interface Subprogramme {
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly activities: readonly Activity[];
}

export interface Programme {
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly subprogrammes: readonly Subprogramme[];
}

export interface Pillar {
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly programmes: readonly Programme[];
  readonly isActive: boolean;
  readonly placeholder?: boolean;
}

export const TAXONOMY: readonly Pillar[] = [
  {
    code: 'community',
    name: 'Community',
    description:
      'Programmes that work OUTSIDE the national parks — with farmers, schools, ' +
      'youth, and beekeeping groups in the villages bordering Nyerere National Park ' +
      'and the Usangu / Ihefu wetland.',
    isActive: true,
    programmes: [
      {
        code: 'srata_academy',
        name: 'SRATA Academy (Kamilifu)',
        description:
          'Standalone one-year scholarship hospitality programme for youth from ' +
          'communities adjacent to the national park. Cohort = enrolment year.',
        subprogrammes: [
          {
            code: 'srata_intake',
            name: 'SRATA Intake',
            activities: [
              {
                code: 'srata_scholarship',
                name: 'Scholarship Programme',
                description: 'Full-scholarship one-year intake at Kamilifu.',
                beneficiaryKind: 'individual',
                sectorScope: 'both',
                isActive: true,
              },
              {
                code: 'srata_internship',
                name: 'Internship Placement',
                description:
                  'Industry internship placement during/after the programme.',
                beneficiaryKind: 'individual',
                sectorScope: 'both',
                isActive: true,
              },
              {
                code: 'srata_tracer',
                name: 'Graduate Tracer',
                description:
                  'Follow-up survey of career and contact information for alumni.',
                beneficiaryKind: 'individual',
                sectorScope: 'both',
                isActive: true,
              },
            ],
          },
        ],
      },
      {
        code: 'hwce',
        name: 'HWCE — Human–Wildlife Coexistence',
        description:
          'The flagship community programme — Eco Clubs in primary schools, ' +
          'conservation-compatible farming, income-generating activities, and ' +
          'community awareness work.',
        subprogrammes: [
          {
            code: 'eco_clubs',
            name: 'Eco Clubs',
            description:
              'Primary-school students (Class 3–7) in Msolwa and Usangu schools. ' +
              'Each cohort year is a new enrolment: Class 7 graduates leave, new ' +
              'Class 3 students join. ~900 students across ~30 schools (2025).',
            activities: [
              {
                code: 'eco_club',
                name: 'Eco Club',
                description: 'Year-cohorted in-school conservation club.',
                beneficiaryKind: 'individual',
                sectorScope: 'both',
                isActive: true,
              },
              {
                code: 'eco_kids_safari',
                name: 'Eco Kids Safari',
                description:
                  '~80 students per year selected via competition + exam; 3-day ' +
                  'exposure trip into Nyerere National Park.',
                beneficiaryKind: 'individual',
                sectorScope: 'both',
                isActive: true,
              },
              {
                code: 'conservation_club',
                name: 'Conservation Club',
                description:
                  'New from 2025 — conservation tournament with selected players.',
                beneficiaryKind: 'individual',
                sectorScope: 'both',
                startYear: 2025,
                isActive: true,
              },
            ],
          },
          {
            code: 'conservation_compatible_farming',
            name: 'Conservation-Compatible Farming',
            description:
              'Farming practices that coexist with wildlife corridors, water ' +
              'cycles, and forest restoration.',
            activities: [
              {
                code: 'shamba_chungu',
                name: 'Shamba Chungu',
                description:
                  'Mixed cropping practice in Usangu sector — onion, bambara ' +
                  'groundnuts, groundnuts, sunflower.',
                beneficiaryKind: 'individual',
                sectorScope: 'usangu',
                isActive: true,
                variants: [
                  { code: 'onion', label: 'Onion production' },
                  {
                    code: 'bambara_groundnuts',
                    label: 'Bambara groundnuts',
                    note: 'njugumawe — distinct from regular groundnuts',
                  },
                  { code: 'groundnuts', label: 'Groundnuts (karanga)' },
                  { code: 'sunflower', label: 'Sunflower' },
                ],
              },
              {
                code: 'agroforest',
                name: 'Agro-Forest',
                description:
                  'Tree-crop intercropping in Msolwa sector — palm, cocoa, cashew.',
                beneficiaryKind: 'individual',
                sectorScope: 'msolwa',
                isActive: true,
                variants: [
                  { code: 'chikichi_palm', label: 'Chikichi / Palm' },
                  { code: 'cocoa', label: 'Cocoa' },
                  { code: 'korosho_cashew', label: 'Korosho / Cashew nuts' },
                ],
              },
              {
                code: 'horticulture',
                name: 'Horticulture',
                description:
                  'Vegetable production — not active in 2026; farmers being ' +
                  'reallocated to other components.',
                beneficiaryKind: 'individual',
                sectorScope: 'both',
                endYear: 2025,
                isActive: false,
              },
              {
                code: 'tree_nurseries',
                name: 'Tree Nurseries',
                description:
                  'Group-managed nurseries that supply seedlings for the ' +
                  'agroforest and farming activities.',
                beneficiaryKind: 'group',
                sectorScope: 'both',
                isActive: true,
                variants: [
                  { code: 'nursery_usangu', label: 'Usangu nursery' },
                  { code: 'nursery_msolwa', label: 'Msolwa nursery' },
                ],
              },
            ],
          },
          {
            code: 'iga',
            name: 'IGA — Income-Generating Activities',
            description:
              'Group-level enterprises that generate revenue for member ' +
              'households. Tracked through a group ledger: initial capital, ' +
              'revenue, expenditure, profit.',
            activities: [
              {
                code: 'iga_pig_keeping_usangu',
                name: 'Pig Keeping (Usangu)',
                beneficiaryKind: 'group',
                sectorScope: 'usangu',
                isActive: true,
              },
              {
                code: 'iga_value_addition_usangu',
                name: 'Value Addition (Usangu)',
                description: 'Soap making, milk processing, peanut butter.',
                beneficiaryKind: 'group',
                sectorScope: 'usangu',
                isActive: true,
                variants: [
                  { code: 'soap_making', label: 'Soap making' },
                  { code: 'milk_processing', label: 'Milk processing' },
                  { code: 'peanut_butter', label: 'Peanut butter' },
                ],
              },
              {
                code: 'iga_pig_keeping_msolwa',
                name: 'Pig Keeping (Msolwa)',
                beneficiaryKind: 'group',
                sectorScope: 'msolwa',
                isActive: true,
              },
              {
                code: 'iga_poultry_msolwa',
                name: 'Poultry Keeping (Msolwa)',
                beneficiaryKind: 'group',
                sectorScope: 'msolwa',
                isActive: true,
              },
              {
                code: 'iga_value_addition_msolwa',
                name: 'Value Addition (Msolwa)',
                beneficiaryKind: 'group',
                sectorScope: 'msolwa',
                isActive: true,
              },
            ],
          },
          {
            code: 'community_awareness',
            name: 'Community Awareness',
            description:
              'Reach beyond direct beneficiaries — radio programmes and other ' +
              'outreach.',
            activities: [
              {
                code: 'msolwa_radio',
                name: 'Msolwa Radio Programmes',
                beneficiaryKind: 'mixed',
                sectorScope: 'msolwa',
                isActive: true,
              },
              {
                code: 'community_outreach_other',
                name: 'Other Outreach Programmes',
                beneficiaryKind: 'mixed',
                sectorScope: 'both',
                isActive: true,
              },
            ],
          },
        ],
      },
      {
        code: 'chilli_fencing',
        name: 'Chilli Fencing',
        description:
          'Separate programme (not under farming): human-elephant conflict ' +
          'mitigation. Individual farmers in elephant corridors use chilli ' +
          'fencing to deter crop raids.',
        subprogrammes: [
          {
            code: 'chilli_fencing_default',
            name: 'Chilli Fencing',
            activities: [
              {
                code: 'chilli_fencing_individual',
                name: 'Individual Farmer Chilli Fencing',
                beneficiaryKind: 'individual',
                sectorScope: 'both',
                isActive: true,
              },
            ],
          },
        ],
      },
      {
        code: 'beekeeping',
        name: 'Beekeeping',
        description:
          'Separate from HWCE. Iluma WMA is the flagship project (with Kobo + ' +
          'GPS); the outreach arm trains and equips groups by request, often ' +
          'outside the operational area (e.g. Kilosa).',
        subprogrammes: [
          {
            code: 'iluma_wma',
            name: 'Iluma WMA',
            description:
              'The six rivers beekeeping project inside Iluma WMA — bordering ' +
              'Nyerere NP. Day-to-day hive monitoring with GPS coordinates.',
            activities: [
              {
                code: 'iluma_hive_monitoring',
                name: 'Hive Monitoring (Iluma)',
                beneficiaryKind: 'group',
                sectorScope: 'both',
                isActive: true,
              },
            ],
          },
          {
            code: 'beekeeping_outreach',
            name: 'Beekeeping Outreach',
            description:
              'Community-requested training; ~5 groups currently. May be ' +
              'outside operational districts (e.g. Kilosa). Each group receives ' +
              '~10 hives + modern beekeeping training.',
            activities: [
              {
                code: 'outreach_beekeeping_group',
                name: 'Outreach Beekeeping Group',
                beneficiaryKind: 'group',
                sectorScope: 'outreach',
                isActive: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: 'protection',
    name: 'Protection',
    description:
      'Anti-poaching and law-enforcement work — details TBD with Thomas Barnes. ' +
      'Pillar is seeded as a placeholder so that downstream code does not assume ' +
      '"everything is community"; programme/subprogramme/activity rows must ' +
      'come from a Thomas working session before they are populated.',
    isActive: true,
    placeholder: true,
    programmes: [
      {
        code: 'protection_cattle',
        name: 'Cattle Pressure Response',
        description:
          'Placeholder. Usangu Basin cattle incursion pressure on the Ihefu ' +
          'wetland. Needs Thomas Barnes input before populating.',
        subprogrammes: [],
      },
      {
        code: 'protection_law_enforcement',
        name: 'Law Enforcement',
        description: 'Placeholder. Needs Thomas Barnes input.',
        subprogrammes: [],
      },
    ],
  },
];

/* ─── Lookup helpers ─── */

export function findPillar(code: string): Pillar | undefined {
  return TAXONOMY.find((p) => p.code === code);
}

export function findProgramme(code: string): Programme | undefined {
  for (const pillar of TAXONOMY) {
    const programme = pillar.programmes.find((p) => p.code === code);
    if (programme) return programme;
  }
  return undefined;
}

export function findSubprogramme(code: string): Subprogramme | undefined {
  for (const pillar of TAXONOMY) {
    for (const programme of pillar.programmes) {
      const subprogramme = programme.subprogrammes.find((s) => s.code === code);
      if (subprogramme) return subprogramme;
    }
  }
  return undefined;
}

export function findActivity(code: string): Activity | undefined {
  for (const pillar of TAXONOMY) {
    for (const programme of pillar.programmes) {
      for (const subprogramme of programme.subprogrammes) {
        const activity = subprogramme.activities.find((a) => a.code === code);
        if (activity) return activity;
      }
    }
  }
  return undefined;
}

export function allActivities(): readonly Activity[] {
  const out: Activity[] = [];
  for (const pillar of TAXONOMY) {
    for (const programme of pillar.programmes) {
      for (const subprogramme of programme.subprogrammes) {
        for (const activity of subprogramme.activities) {
          out.push(activity);
        }
      }
    }
  }
  return out;
}

export function activitiesBySector(sector: Sector): readonly Activity[] {
  return allActivities().filter(
    (a) => a.sectorScope === sector || a.sectorScope === 'both',
  );
}

export function activitiesActiveInYear(year: number): readonly Activity[] {
  return allActivities().filter((a) => {
    if (!a.isActive) return false;
    if (a.startYear !== undefined && year < a.startYear) return false;
    if (a.endYear !== undefined && year > a.endYear) return false;
    return true;
  });
}

/**
 * Total activity count, for sanity checks in tests and dashboard headers.
 */
export function taxonomyCounts(): {
  pillars: number;
  programmes: number;
  subprogrammes: number;
  activities: number;
  variants: number;
} {
  let programmes = 0;
  let subprogrammes = 0;
  let activities = 0;
  let variants = 0;
  for (const pillar of TAXONOMY) {
    programmes += pillar.programmes.length;
    for (const programme of pillar.programmes) {
      subprogrammes += programme.subprogrammes.length;
      for (const subprogramme of programme.subprogrammes) {
        activities += subprogramme.activities.length;
        for (const activity of subprogramme.activities) {
          variants += activity.variants?.length ?? 0;
        }
      }
    }
  }
  return {
    pillars: TAXONOMY.length,
    programmes,
    subprogrammes,
    activities,
    variants,
  };
}
