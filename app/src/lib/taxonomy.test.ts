import { describe, it, expect } from "vitest";
import {
  TAXONOMY,
  findActivity,
  findPillar,
  findProgramme,
  findSubprogramme,
  allActivities,
  activitiesBySector,
  activitiesActiveInYear,
  taxonomyCounts,
  type Activity,
} from "./taxonomy";

describe("taxonomy structural integrity", () => {
  it("has at least Community and Protection pillars", () => {
    const codes = TAXONOMY.map((p) => p.code);
    expect(codes).toContain("community");
    expect(codes).toContain("protection");
  });

  it("every pillar has a unique code", () => {
    const codes = TAXONOMY.map((p) => p.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("every programme has a unique code across pillars", () => {
    const codes: string[] = [];
    for (const pillar of TAXONOMY) {
      for (const programme of pillar.programmes) {
        codes.push(programme.code);
      }
    }
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("every subprogramme has a unique code across the tree", () => {
    const codes: string[] = [];
    for (const pillar of TAXONOMY) {
      for (const programme of pillar.programmes) {
        for (const subprogramme of programme.subprogrammes) {
          codes.push(subprogramme.code);
        }
      }
    }
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("every activity has a unique code across the tree", () => {
    const codes = allActivities().map((a) => a.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("every activity variant has a unique code within its activity", () => {
    for (const activity of allActivities()) {
      const variantCodes = (activity.variants ?? []).map((v) => v.code);
      expect(new Set(variantCodes).size).toBe(variantCodes.length);
    }
  });

  it("every activity has a sectorScope from the closed set", () => {
    const allowed = new Set(["msolwa", "usangu", "both", "outreach"]);
    for (const activity of allActivities()) {
      expect(allowed.has(activity.sectorScope)).toBe(true);
    }
  });

  it("every activity has a beneficiaryKind from the closed set", () => {
    const allowed = new Set(["individual", "group", "school", "mixed"]);
    for (const activity of allActivities()) {
      expect(allowed.has(activity.beneficiaryKind)).toBe(true);
    }
  });

  it("Protection pillar is flagged as placeholder", () => {
    const protection = findPillar("protection");
    expect(protection).toBeDefined();
    expect(protection?.placeholder).toBe(true);
  });
});

describe("Edna's tree — canonical leaves", () => {
  it("includes SRATA Academy programme", () => {
    expect(findProgramme("srata_academy")).toBeDefined();
  });

  it("includes HWCE programme", () => {
    expect(findProgramme("hwce")).toBeDefined();
  });

  it("includes Beekeeping programme as separate top-level", () => {
    const bee = findProgramme("beekeeping");
    expect(bee).toBeDefined();
    // Beekeeping must NOT be inside HWCE
    const hwce = findProgramme("hwce");
    const beeUnderHwce = hwce?.subprogrammes.some((s) => s.code.includes("beekeeping"));
    expect(beeUnderHwce).toBeFalsy();
  });

  it("includes Chilli Fencing as separate top-level (not under farming)", () => {
    const chilli = findProgramme("chilli_fencing");
    expect(chilli).toBeDefined();
  });

  it("Shamba Chungu is Usangu-only", () => {
    const a = findActivity("shamba_chungu");
    expect(a?.sectorScope).toBe("usangu");
  });

  it("Agro-Forest is Msolwa-only", () => {
    const a = findActivity("agroforest");
    expect(a?.sectorScope).toBe("msolwa");
  });

  it("Shamba Chungu has the four expected variants", () => {
    const a = findActivity("shamba_chungu");
    const codes = (a?.variants ?? []).map((v) => v.code);
    expect(codes).toContain("onion");
    expect(codes).toContain("bambara_groundnuts");
    expect(codes).toContain("groundnuts");
    expect(codes).toContain("sunflower");
  });

  it("Agro-Forest has the three expected species variants", () => {
    const a = findActivity("agroforest");
    const codes = (a?.variants ?? []).map((v) => v.code);
    expect(codes).toContain("chikichi_palm");
    expect(codes).toContain("cocoa");
    expect(codes).toContain("korosho_cashew");
  });

  it("Iluma WMA is a subprogramme of Beekeeping (not HWCE)", () => {
    const sub = findSubprogramme("iluma_wma");
    expect(sub).toBeDefined();
    // Verify parent: the only programme that contains this subprogramme code
    const bee = findProgramme("beekeeping");
    const found = bee?.subprogrammes.some((s) => s.code === "iluma_wma");
    expect(found).toBe(true);
  });

  it("Outreach Beekeeping is sectorScope=outreach", () => {
    const a = findActivity("outreach_beekeeping_group");
    expect(a?.sectorScope).toBe("outreach");
  });

  it("Horticulture is marked inactive (not running 2026)", () => {
    const a = findActivity("horticulture");
    expect(a?.isActive).toBe(false);
  });

  it("Conservation Club starts from 2025", () => {
    const a = findActivity("conservation_club");
    expect(a?.startYear).toBe(2025);
  });
});

describe("lookup helpers", () => {
  it("findPillar returns undefined for unknown code", () => {
    expect(findPillar("not-a-pillar")).toBeUndefined();
  });

  it("findProgramme returns undefined for unknown code", () => {
    expect(findProgramme("not-a-programme")).toBeUndefined();
  });

  it("findSubprogramme returns undefined for unknown code", () => {
    expect(findSubprogramme("not-a-subprogramme")).toBeUndefined();
  });

  it("findActivity returns undefined for unknown code", () => {
    expect(findActivity("not-an-activity")).toBeUndefined();
  });
});

describe("filtered queries", () => {
  it("activitiesBySector('msolwa') includes Msolwa-only and both-sector activities", () => {
    const msolwa = activitiesBySector("msolwa");
    const codes = msolwa.map((a) => a.code);
    expect(codes).toContain("agroforest"); // msolwa-only
    expect(codes).toContain("eco_club"); // both
    expect(codes).not.toContain("shamba_chungu"); // usangu-only
  });

  it("activitiesBySector('usangu') excludes Msolwa-only activities", () => {
    const usangu = activitiesBySector("usangu");
    const codes = usangu.map((a) => a.code);
    expect(codes).not.toContain("agroforest");
    expect(codes).toContain("shamba_chungu");
  });

  it("activitiesActiveInYear(2026) excludes inactive activities", () => {
    const active = activitiesActiveInYear(2026);
    const codes = active.map((a) => a.code);
    expect(codes).not.toContain("horticulture");
  });

  it("activitiesActiveInYear(2024) excludes Conservation Club (started 2025)", () => {
    const active = activitiesActiveInYear(2024);
    const codes = active.map((a) => a.code);
    expect(codes).not.toContain("conservation_club");
  });

  it("activitiesActiveInYear(2025) includes Conservation Club", () => {
    const active = activitiesActiveInYear(2025);
    const codes = active.map((a) => a.code);
    expect(codes).toContain("conservation_club");
  });
});

describe("counts", () => {
  it("taxonomyCounts returns positive numbers for every level", () => {
    const c = taxonomyCounts();
    expect(c.pillars).toBeGreaterThan(0);
    expect(c.programmes).toBeGreaterThan(0);
    expect(c.subprogrammes).toBeGreaterThan(0);
    expect(c.activities).toBeGreaterThan(0);
    expect(c.variants).toBeGreaterThan(0);
  });

  it("counts add up to what the tree contains", () => {
    const c = taxonomyCounts();
    let actualPrograms = 0;
    let actualSubs = 0;
    let actualActs = 0;
    let actualVars = 0;
    for (const pillar of TAXONOMY) {
      actualPrograms += pillar.programmes.length;
      for (const programme of pillar.programmes) {
        actualSubs += programme.subprogrammes.length;
        for (const subprogramme of programme.subprogrammes) {
          actualActs += subprogramme.activities.length;
          for (const activity of subprogramme.activities) {
            actualVars += activity.variants?.length ?? 0;
          }
        }
      }
    }
    expect(c.pillars).toBe(TAXONOMY.length);
    expect(c.programmes).toBe(actualPrograms);
    expect(c.subprogrammes).toBe(actualSubs);
    expect(c.activities).toBe(actualActs);
    expect(c.variants).toBe(actualVars);
  });
});

describe("type-level invariants (using runtime data)", () => {
  it("inactive activities can still have an isActive flag of false (not boolean trick)", () => {
    const a: Activity | undefined = findActivity("horticulture");
    expect(a).toBeDefined();
    expect(typeof a?.isActive).toBe("boolean");
    expect(a?.isActive).toBe(false);
  });

  it("activity codes use snake_case lowercase", () => {
    const snakeCase = /^[a-z][a-z0-9_]*$/;
    for (const activity of allActivities()) {
      expect(activity.code).toMatch(snakeCase);
    }
  });

  it("variant codes use snake_case lowercase", () => {
    const snakeCase = /^[a-z][a-z0-9_]*$/;
    for (const activity of allActivities()) {
      for (const v of activity.variants ?? []) {
        expect(v.code).toMatch(snakeCase);
      }
    }
  });
});
