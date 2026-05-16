/**
 * Six Rivers Africa — Theory of Change
 *
 * Per-pillar and per-programme ToCs authored from Edna Sonda's narrative and
 * Six Rivers' published programme descriptions. This file is the single source
 * of truth for both the Brandon-meeting demo page (/impact/theory-of-change)
 * and the future seed script (Phase 1.6).
 *
 * Node levels follow the standard logframe: input → activity → output →
 * outcome → impact. Codes are stable identifiers — future Indicator rows will
 * reference them so the M&E numbers can be derived back to a specific ToC node.
 */

export type TocLevel = 'input' | 'activity' | 'output' | 'outcome' | 'impact';

export type TocScope = 'pillar' | 'programme';

export interface TocNode {
  readonly code: string;
  readonly level: TocLevel;
  readonly statement: string;
  readonly note?: string;
}

export interface TheoryOfChange {
  readonly scope: TocScope;
  /** Pillar code, or undefined for programme-scoped ToCs */
  readonly pillarCode?: string;
  /** Programme code, or undefined for pillar-scoped ToCs */
  readonly programmeCode?: string;
  readonly version: string;
  readonly title: string;
  readonly narrative: string;
  readonly nodes: readonly TocNode[];
}

/**
 * Community pillar — overarching ToC.
 * The "story" Brandon will hear in the first 60 seconds.
 */
const COMMUNITY_PILLAR_TOC: TheoryOfChange = {
  scope: 'pillar',
  pillarCode: 'community',
  version: '2026-05-15',
  title: 'Community pillar — Theory of Change',
  narrative:
    'Six Rivers Africa works with the communities bordering Nyerere National ' +
    'Park and the Usangu / Ihefu wetland — not against them. Lasting conservation ' +
    'in these landscapes depends on whether the next generation grows up valuing ' +
    'wildlife, whether households can earn a living without raiding the forest, ' +
    'and whether human-wildlife conflict can be defused before it turns into ' +
    'retaliation. The Community pillar invests in all three.',
  nodes: [
    {
      code: 'cmty.input.officers',
      level: 'input',
      statement: 'Trained field officers based in Msolwa and Usangu sectors',
    },
    {
      code: 'cmty.input.partners',
      level: 'input',
      statement: 'Donor funding and partner technical support',
    },
    {
      code: 'cmty.input.trust',
      level: 'input',
      statement: 'Long-standing community relationships and trust',
      note:
        'Built through the field project officers over years of presence on ' +
        'the ground — not reproducible by a parachuting NGO.',
    },
    {
      code: 'cmty.input.platform',
      level: 'input',
      statement: 'Six Rivers Community Intelligence Platform (this system)',
      note:
        'Central M&E platform replacing the previous Excel + Kobo workflow.',
    },
    {
      code: 'cmty.activity.enrol',
      level: 'activity',
      statement:
        'Enrol beneficiaries each cohort year — students, farmers, groups',
    },
    {
      code: 'cmty.activity.train',
      level: 'activity',
      statement:
        'Train beneficiaries in conservation, compatible farming, livelihoods',
    },
    {
      code: 'cmty.activity.equip',
      level: 'activity',
      statement:
        'Equip with seedlings, hives, capital, training materials, fencing inputs',
    },
    {
      code: 'cmty.activity.monitor',
      level: 'activity',
      statement: 'Monitor cohorts, groups, plots, and incidents on a recurring basis',
    },
    {
      code: 'cmty.output.cohorts',
      level: 'output',
      statement:
        'Cohorts of students, farmers, and groups enrolled, retained, and graduated each year',
    },
    {
      code: 'cmty.output.land',
      level: 'output',
      statement:
        'Hectares under compatible farming, nurseries supplying seedlings, hives in production',
    },
    {
      code: 'cmty.output.income',
      level: 'output',
      statement:
        'Group ledger evidence of revenue, expenditure, and profit for IGA enterprises',
    },
    {
      code: 'cmty.output.awareness',
      level: 'output',
      statement: 'Awareness reach via radio and other outreach',
    },
    {
      code: 'cmty.outcome.literacy',
      level: 'outcome',
      statement:
        'A generation of young people who can explain why this landscape matters',
    },
    {
      code: 'cmty.outcome.livelihoods',
      level: 'outcome',
      statement:
        'Household income from livelihoods that coexist with — not extract from — the landscape',
    },
    {
      code: 'cmty.outcome.conflict',
      level: 'outcome',
      statement:
        'Crop raids, livestock loss, and retaliatory wildlife killings reduced',
    },
    {
      code: 'cmty.outcome.youth',
      level: 'outcome',
      statement:
        'Youth in hospitality and other formal-sector roles — alternative to subsistence in HEC corridors',
    },
    {
      code: 'cmty.impact.coexistence',
      level: 'impact',
      statement:
        'Durable coexistence of communities with Nyerere NP and the Usangu wetland',
    },
  ],
};

/**
 * HWCE programme — the deepest of the community ToCs.
 */
const HWCE_PROGRAMME_TOC: TheoryOfChange = {
  scope: 'programme',
  pillarCode: 'community',
  programmeCode: 'hwce',
  version: '2026-05-15',
  title: 'HWCE — Human–Wildlife Coexistence',
  narrative:
    'HWCE is the flagship community programme. It threads four sub-programmes ' +
    'together: Eco Clubs (the next generation), Conservation-Compatible Farming ' +
    '(food and income from the land without forest loss), IGA groups ' +
    '(non-farm enterprise), and Community Awareness (reach beyond direct ' +
    'beneficiaries). Each strand reinforces the others — a farmer who learns ' +
    "compatible practices is more receptive to her child's Eco Club lessons; an " +
    'IGA group succeeds because the radio programme has built trust.',
  nodes: [
    {
      code: 'hwce.input.schools',
      level: 'input',
      statement: 'Partnership with ~30 primary schools across Msolwa and Usangu',
    },
    {
      code: 'hwce.input.agronomy',
      level: 'input',
      statement: 'Agronomy expertise for compatible-farming species and rotations',
    },
    {
      code: 'hwce.input.capital',
      level: 'input',
      statement: 'Start-up capital and revolving funds for IGA groups',
    },
    {
      code: 'hwce.input.radio',
      level: 'input',
      statement: 'Msolwa community radio airtime + outreach budget',
    },
    {
      code: 'hwce.activity.eco_club',
      level: 'activity',
      statement: 'Weekly Eco Club sessions for Class 3–7 students',
    },
    {
      code: 'hwce.activity.eco_kids_safari',
      level: 'activity',
      statement: 'Annual Eco Kids Safari — ~80 selected students into Nyerere NP for 3 days',
    },
    {
      code: 'hwce.activity.distribution',
      level: 'activity',
      statement: 'Seedling and input distribution from nurseries to farmers',
    },
    {
      code: 'hwce.activity.iga_form',
      level: 'activity',
      statement: 'Form, train, and capitalise IGA groups (pig keeping, poultry, value addition)',
    },
    {
      code: 'hwce.activity.broadcast',
      level: 'activity',
      statement: 'Produce and broadcast radio programmes on conservation themes',
    },
    {
      code: 'hwce.output.students_enrolled',
      level: 'output',
      statement: 'Students enrolled per cohort year, disaggregated by school, class, sex',
    },
    {
      code: 'hwce.output.students_retained',
      level: 'output',
      statement: 'Year-on-year retention and dropout rates per cohort',
    },
    {
      code: 'hwce.output.hectares',
      level: 'output',
      statement: 'Hectares under Shamba Chungu, Agroforest, and tree nurseries',
    },
    {
      code: 'hwce.output.seedlings',
      level: 'output',
      statement: 'Seedlings distributed and surviving (Survival Check %)',
    },
    {
      code: 'hwce.output.iga_revenue',
      level: 'output',
      statement: 'IGA group revenue, expenditure, and profit per period',
    },
    {
      code: 'hwce.output.reach',
      level: 'output',
      statement: 'Radio listener reach + outreach event attendance',
    },
    {
      code: 'hwce.outcome.literacy',
      level: 'outcome',
      statement:
        'Eco Club graduates demonstrate conservation literacy in CAHPS assessment',
    },
    {
      code: 'hwce.outcome.security',
      level: 'outcome',
      statement:
        'Household food security improves where compatible-farming activities are adopted',
    },
    {
      code: 'hwce.outcome.income',
      level: 'outcome',
      statement: 'IGA member households earn supplementary income',
    },
    {
      code: 'hwce.outcome.behaviour',
      level: 'outcome',
      statement: 'Community attitudes toward the park shift from extractive to stewardship',
    },
    {
      code: 'hwce.impact.hec_reduced',
      level: 'impact',
      statement:
        'Human-wildlife conflict reduced — crop raids, retaliation, livestock loss all trend down',
    },
  ],
};

/**
 * SRATA Academy programme ToC.
 */
const SRATA_PROGRAMME_TOC: TheoryOfChange = {
  scope: 'programme',
  pillarCode: 'community',
  programmeCode: 'srata_academy',
  version: '2026-05-15',
  title: 'SRATA Academy (Kamilifu) — Theory of Change',
  narrative:
    'SRATA Academy is the human-capital lever. Each year a cohort of youth from ' +
    'communities adjacent to the park receives a full one-year scholarship in ' +
    'hospitality and related skills, then transitions into industry roles through ' +
    'a structured internship and tracer programme. The unspoken hypothesis: a ' +
    "young person earning a hospitality wage doesn't poach.",
  nodes: [
    {
      code: 'srata.input.campus',
      level: 'input',
      statement: 'Kamilifu campus capacity + curriculum',
    },
    {
      code: 'srata.input.scholarships',
      level: 'input',
      statement: 'Donor-funded full scholarships for each annual cohort',
    },
    {
      code: 'srata.input.employers',
      level: 'input',
      statement: 'Hospitality-sector employer network for internships and placement',
    },
    {
      code: 'srata.activity.intake',
      level: 'activity',
      statement: 'Annual intake of new students prioritising HEC-corridor communities',
    },
    {
      code: 'srata.activity.train',
      level: 'activity',
      statement: 'One-year residential hospitality / housekeeping / culinary training',
    },
    {
      code: 'srata.activity.internship',
      level: 'activity',
      statement: 'Industry internship placement during/after the programme',
    },
    {
      code: 'srata.activity.tracer',
      level: 'activity',
      statement: 'Graduate tracer survey at 6 and 12 months post-graduation',
    },
    {
      code: 'srata.output.graduates',
      level: 'output',
      statement: 'Graduates per cohort (by sex, district, sector of origin)',
    },
    {
      code: 'srata.output.placed',
      level: 'output',
      statement: 'Graduates placed in industry internships',
    },
    {
      code: 'srata.output.employed_12mo',
      level: 'output',
      statement: 'Graduates in formal employment at 12 months post-graduation',
    },
    {
      code: 'srata.outcome.income',
      level: 'outcome',
      statement: 'Graduates earning a hospitality-sector wage and remitting to families',
    },
    {
      code: 'srata.outcome.dependency',
      level: 'outcome',
      statement: 'Reduced household economic dependence on subsistence farming in HEC corridors',
    },
    {
      code: 'srata.impact.coexistence',
      level: 'impact',
      statement: 'Human-capital lift in communities adjacent to the park — durable coexistence',
    },
  ],
};

/**
 * Beekeeping programme ToC.
 */
const BEEKEEPING_PROGRAMME_TOC: TheoryOfChange = {
  scope: 'programme',
  pillarCode: 'community',
  programmeCode: 'beekeeping',
  version: '2026-05-15',
  title: 'Beekeeping — Theory of Change',
  narrative:
    'Beekeeping is the smallest of the community programmes but the cleanest ' +
    'story: a hive earns a household money in a way that depends on the forest ' +
    'standing. The Iluma WMA project is the data-rich flagship; the outreach arm ' +
    'extends the model on request, sometimes beyond the operational area.',
  nodes: [
    {
      code: 'bee.input.hives',
      level: 'input',
      statement: 'Hives, queens, and harvesting equipment',
    },
    {
      code: 'bee.input.training',
      level: 'input',
      statement: 'Modern beekeeping training curriculum and trainers',
    },
    {
      code: 'bee.activity.iluma_monitor',
      level: 'activity',
      statement: 'Hive monitoring visits with GPS in Iluma WMA',
    },
    {
      code: 'bee.activity.outreach',
      level: 'activity',
      statement: 'Outreach training and 10-hive distributions to requesting groups',
    },
    {
      code: 'bee.output.active_hives',
      level: 'output',
      statement: 'Hives active (Iluma + outreach), with location data',
    },
    {
      code: 'bee.output.honey',
      level: 'output',
      statement: 'Honey yield per group per season',
    },
    {
      code: 'bee.output.groups_outreach',
      level: 'output',
      statement: 'Outreach groups trained and equipped',
    },
    {
      code: 'bee.outcome.income',
      level: 'outcome',
      statement: 'Group income from honey sales',
    },
    {
      code: 'bee.outcome.pollination',
      level: 'outcome',
      statement: 'Forest and farm pollination services',
    },
    {
      code: 'bee.outcome.forest_value',
      level: 'outcome',
      statement: 'Forest valued by community as an income asset, not just a resource pool',
    },
    {
      code: 'bee.impact.forest',
      level: 'impact',
      statement: 'Forest cover protected alongside community livelihood gain',
    },
  ],
};

/**
 * Chilli Fencing programme ToC.
 */
const CHILLI_FENCING_PROGRAMME_TOC: TheoryOfChange = {
  scope: 'programme',
  pillarCode: 'community',
  programmeCode: 'chilli_fencing',
  version: '2026-05-15',
  title: 'Chilli Fencing — Theory of Change',
  narrative:
    'Chilli fencing is HEC mitigation at the individual-farm level. Farmers in ' +
    'elephant corridors plant chilli on plot perimeters; the volatile capsaicin ' +
    'oil deters elephants from crop raids. It is intentionally NOT classified ' +
    'under farming — it is conflict mitigation that happens on farmland.',
  nodes: [
    {
      code: 'chilli.input.seeds',
      level: 'input',
      statement: 'Chilli seed varieties suited to local conditions',
    },
    {
      code: 'chilli.input.training',
      level: 'input',
      statement: 'Agronomy training on chilli establishment and deterrent use',
    },
    {
      code: 'chilli.activity.identify',
      level: 'activity',
      statement: 'Identify farmers in elephant corridors',
    },
    {
      code: 'chilli.activity.establish',
      level: 'activity',
      statement: 'Support chilli fence establishment around vulnerable plots',
    },
    {
      code: 'chilli.activity.followup',
      level: 'activity',
      statement: 'Follow-up visits to record incidents and chilli condition',
    },
    {
      code: 'chilli.output.fenced',
      level: 'output',
      statement: 'Farms protected by chilli fencing',
    },
    {
      code: 'chilli.output.corridors',
      level: 'output',
      statement: 'Elephant-corridor kilometres with chilli presence',
    },
    {
      code: 'chilli.outcome.raids',
      level: 'outcome',
      statement: 'Crop raid incidents per fenced farm per season — reducing',
    },
    {
      code: 'chilli.outcome.tolerance',
      level: 'outcome',
      statement: 'Farmer tolerance of elephant presence increased',
    },
    {
      code: 'chilli.impact.retaliation',
      level: 'impact',
      statement: 'Retaliatory elephant killings reduced',
    },
  ],
};

/**
 * Protection pillar — placeholder ToC.
 * Real content awaits a Thomas Barnes working session.
 */
const PROTECTION_PILLAR_TOC: TheoryOfChange = {
  scope: 'pillar',
  pillarCode: 'protection',
  version: '2026-05-15',
  title: 'Protection pillar — Theory of Change (placeholder)',
  narrative:
    'Protection covers anti-poaching, cattle-incursion response, and law ' +
    'enforcement. Details await Thomas Barnes. This pillar is included as a ' +
    'placeholder so the platform does not assume "everything is community" — ' +
    'real nodes will populate once we have a Thomas working session on the books.',
  nodes: [
    {
      code: 'prot.placeholder',
      level: 'input',
      statement: 'Pending Thomas Barnes input — see plan §"Open questions"',
    },
  ],
};

/** Public registry — index by code for fast lookup. */
export const ALL_TOCS: readonly TheoryOfChange[] = [
  COMMUNITY_PILLAR_TOC,
  HWCE_PROGRAMME_TOC,
  SRATA_PROGRAMME_TOC,
  BEEKEEPING_PROGRAMME_TOC,
  CHILLI_FENCING_PROGRAMME_TOC,
  PROTECTION_PILLAR_TOC,
];

export function tocByPillar(pillarCode: string): TheoryOfChange | undefined {
  return ALL_TOCS.find(
    (t) => t.scope === 'pillar' && t.pillarCode === pillarCode,
  );
}

export function tocByProgramme(programmeCode: string): TheoryOfChange | undefined {
  return ALL_TOCS.find(
    (t) => t.scope === 'programme' && t.programmeCode === programmeCode,
  );
}

/**
 * Ordering helper — nodes within a ToC should display in logframe order:
 * inputs first, then activities, then outputs, then outcomes, then impact.
 */
const LEVEL_ORDER: Record<TocLevel, number> = {
  input: 0,
  activity: 1,
  output: 2,
  outcome: 3,
  impact: 4,
};

export function nodesByLevel(
  toc: TheoryOfChange,
): Record<TocLevel, readonly TocNode[]> {
  const grouped: Record<TocLevel, TocNode[]> = {
    input: [],
    activity: [],
    output: [],
    outcome: [],
    impact: [],
  };
  for (const node of toc.nodes) {
    grouped[node.level].push(node);
  }
  return grouped;
}

export function orderedLevels(): readonly TocLevel[] {
  return (Object.entries(LEVEL_ORDER) as [TocLevel, number][])
    .sort((a, b) => a[1] - b[1])
    .map(([level]) => level);
}
