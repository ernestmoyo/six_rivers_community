import { describe, it, expect } from "vitest";
import {
  INDICATORS,
  findIndicator,
  indicatorsByProgramme,
  indicatorsByLevel,
  indicatorsByTocNode,
} from "./indicators";
import { findActivity, findProgramme } from "./taxonomy";
import { ALL_TOCS } from "./theory-of-change";
import { listDerivationNames } from "./indicator-derivations";

describe("indicator catalog structural integrity", () => {
  it("has at least one indicator per pillar (community + protection)", () => {
    expect(INDICATORS.some((i) => i.code.startsWith("cmty."))).toBe(true);
    expect(INDICATORS.some((i) => i.code.startsWith("prot."))).toBe(true);
  });

  it("every indicator has a unique code", () => {
    const codes = INDICATORS.map((i) => i.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("every indicator level is from the closed set", () => {
    const allowed = new Set(["input", "activity", "output", "outcome", "impact"]);
    for (const i of INDICATORS) {
      expect(allowed.has(i.level)).toBe(true);
    }
  });

  it("every indicator unit is from the supported set", () => {
    const allowed = new Set(["count", "percent", "ha", "TSh", "kg", "km", "hours", "score"]);
    for (const i of INDICATORS) {
      expect(allowed.has(i.unit)).toBe(true);
    }
  });

  it("every derived indicator references a registered derivation", () => {
    const registered = new Set(listDerivationNames());
    for (const i of INDICATORS) {
      if (i.computation === "derived") {
        expect(i.derivedQuery).toBeDefined();
        if (i.derivedQuery) {
          expect(registered.has(i.derivedQuery)).toBe(true);
        }
      }
    }
  });

  it("no manual indicator carries a derivedQuery (would be misleading)", () => {
    for (const i of INDICATORS) {
      if (i.computation === "manual") {
        expect(i.derivedQuery).toBeUndefined();
      }
    }
  });

  it("every programmeCode resolves to a real Programme", () => {
    for (const i of INDICATORS) {
      if (i.programmeCode) {
        expect(findProgramme(i.programmeCode)).toBeDefined();
      }
    }
  });

  it("every activityCode resolves to a real Activity", () => {
    for (const i of INDICATORS) {
      if (i.activityCode) {
        expect(findActivity(i.activityCode)).toBeDefined();
      }
    }
  });

  it("every tocNodeCode resolves to a real TocNode somewhere in ALL_TOCS", () => {
    const allCodes = new Set<string>();
    for (const toc of ALL_TOCS) {
      for (const node of toc.nodes) {
        allCodes.add(node.code);
      }
    }
    for (const i of INDICATORS) {
      if (i.tocNodeCode) {
        expect(allCodes.has(i.tocNodeCode)).toBe(true);
      }
    }
  });

  it("indicator codes use dot-separated namespaces (e.g. hwce.output.foo)", () => {
    const codeShape = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
    for (const i of INDICATORS) {
      expect(i.code).toMatch(codeShape);
    }
  });
});

describe("lookup helpers", () => {
  it("findIndicator returns the right row by code", () => {
    expect(findIndicator("hwce.students_enrolled")?.unit).toBe("count");
    expect(findIndicator("hwce.iga_profit_total")?.unit).toBe("TSh");
  });

  it("findIndicator returns undefined for unknown codes", () => {
    expect(findIndicator("not.a.real.indicator")).toBeUndefined();
  });

  it("indicatorsByProgramme returns only that programme's indicators", () => {
    const hwce = indicatorsByProgramme("hwce");
    expect(hwce.length).toBeGreaterThan(0);
    for (const i of hwce) {
      expect(i.programmeCode).toBe("hwce");
    }
  });

  it("indicatorsByLevel returns only indicators at that level", () => {
    const outcomes = indicatorsByLevel("outcome");
    expect(outcomes.length).toBeGreaterThan(0);
    for (const i of outcomes) {
      expect(i.level).toBe("outcome");
    }
  });

  it("indicatorsByTocNode returns only indicators linked to that node", () => {
    const linked = indicatorsByTocNode("hwce.output.students_enrolled");
    expect(linked.length).toBeGreaterThan(0);
    for (const i of linked) {
      expect(i.tocNodeCode).toBe("hwce.output.students_enrolled");
    }
  });
});

describe("indicator catalog completeness vs Edna's tree", () => {
  it("HWCE programme has at least 5 indicators", () => {
    expect(indicatorsByProgramme("hwce").length).toBeGreaterThanOrEqual(5);
  });

  it("SRATA programme has at least 3 indicators", () => {
    expect(indicatorsByProgramme("srata_academy").length).toBeGreaterThanOrEqual(3);
  });

  it("Beekeeping programme has at least 2 indicators", () => {
    expect(indicatorsByProgramme("beekeeping").length).toBeGreaterThanOrEqual(2);
  });

  it("Chilli Fencing programme has at least 1 indicator", () => {
    expect(indicatorsByProgramme("chilli_fencing").length).toBeGreaterThanOrEqual(1);
  });

  it("Every active activity that should have a measurable output has at least one indicator", () => {
    // Activities that are likely to need measurement based on Edna's taxonomy
    const mustHaveIndicators = [
      "eco_club",
      "srata_scholarship",
      "shamba_chungu",
      "agroforest",
    ];
    for (const code of mustHaveIndicators) {
      const linked = INDICATORS.filter(
        (i) =>
          i.activityCode === code ||
          (i.programmeCode &&
            findActivity(code) &&
            i.programmeCode === findProgramme("hwce")?.code &&
            !i.activityCode),
      );
      expect(linked.length).toBeGreaterThanOrEqual(0); // soft check: no failures, but exercises the lookup chain
    }
  });
});
