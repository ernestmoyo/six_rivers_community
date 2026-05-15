import { describe, it, expect } from "vitest";
import {
  ALL_TOCS,
  tocByPillar,
  tocByProgramme,
  nodesByLevel,
  orderedLevels,
  type TocLevel,
} from "./theory-of-change";
import { findPillar, findProgramme } from "./taxonomy";

describe("theory of change structural integrity", () => {
  it("has at least one ToC for each pillar in the taxonomy", () => {
    expect(tocByPillar("community")).toBeDefined();
    expect(tocByPillar("protection")).toBeDefined();
  });

  it("references only real pillar codes", () => {
    for (const toc of ALL_TOCS) {
      if (toc.pillarCode) {
        expect(findPillar(toc.pillarCode)).toBeDefined();
      }
    }
  });

  it("references only real programme codes", () => {
    for (const toc of ALL_TOCS) {
      if (toc.programmeCode) {
        expect(findProgramme(toc.programmeCode)).toBeDefined();
      }
    }
  });

  it("node codes are unique within a ToC", () => {
    for (const toc of ALL_TOCS) {
      const codes = toc.nodes.map((n) => n.code);
      expect(new Set(codes).size).toBe(codes.length);
    }
  });

  it("every node has a level from the closed set", () => {
    const levels: TocLevel[] = ["input", "activity", "output", "outcome", "impact"];
    const allowed = new Set(levels);
    for (const toc of ALL_TOCS) {
      for (const node of toc.nodes) {
        expect(allowed.has(node.level)).toBe(true);
      }
    }
  });

  it("scope is either 'pillar' or 'programme'", () => {
    for (const toc of ALL_TOCS) {
      expect(["pillar", "programme"]).toContain(toc.scope);
    }
  });

  it("pillar-scoped ToCs have pillarCode set, no programmeCode", () => {
    for (const toc of ALL_TOCS) {
      if (toc.scope === "pillar") {
        expect(toc.pillarCode).toBeDefined();
        expect(toc.programmeCode).toBeUndefined();
      }
    }
  });

  it("programme-scoped ToCs have programmeCode set", () => {
    for (const toc of ALL_TOCS) {
      if (toc.scope === "programme") {
        expect(toc.programmeCode).toBeDefined();
      }
    }
  });
});

describe("lookup", () => {
  it("tocByPillar returns the right pillar ToC", () => {
    const toc = tocByPillar("community");
    expect(toc?.scope).toBe("pillar");
    expect(toc?.pillarCode).toBe("community");
  });

  it("tocByProgramme returns the right programme ToC", () => {
    const toc = tocByProgramme("hwce");
    expect(toc?.scope).toBe("programme");
    expect(toc?.programmeCode).toBe("hwce");
  });

  it("returns undefined for unknown codes", () => {
    expect(tocByPillar("does-not-exist")).toBeUndefined();
    expect(tocByProgramme("does-not-exist")).toBeUndefined();
  });
});

describe("level helpers", () => {
  it("nodesByLevel returns all five levels (possibly empty arrays)", () => {
    const toc = tocByPillar("community");
    expect(toc).toBeDefined();
    if (!toc) return;
    const grouped = nodesByLevel(toc);
    expect(grouped.input).toBeDefined();
    expect(grouped.activity).toBeDefined();
    expect(grouped.output).toBeDefined();
    expect(grouped.outcome).toBeDefined();
    expect(grouped.impact).toBeDefined();
  });

  it("orderedLevels returns the five levels in logframe order", () => {
    expect(orderedLevels()).toEqual([
      "input",
      "activity",
      "output",
      "outcome",
      "impact",
    ]);
  });

  it("Community pillar ToC has at least one impact-level node", () => {
    const toc = tocByPillar("community");
    expect(toc).toBeDefined();
    if (!toc) return;
    const grouped = nodesByLevel(toc);
    expect(grouped.impact.length).toBeGreaterThan(0);
  });

  it("HWCE programme ToC has nodes across all five levels", () => {
    const toc = tocByProgramme("hwce");
    expect(toc).toBeDefined();
    if (!toc) return;
    const grouped = nodesByLevel(toc);
    expect(grouped.input.length).toBeGreaterThan(0);
    expect(grouped.activity.length).toBeGreaterThan(0);
    expect(grouped.output.length).toBeGreaterThan(0);
    expect(grouped.outcome.length).toBeGreaterThan(0);
    expect(grouped.impact.length).toBeGreaterThan(0);
  });
});

describe("node codes are namespaced consistently", () => {
  it("each node code starts with a short alpha prefix followed by dot levels", () => {
    const codeShape = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
    for (const toc of ALL_TOCS) {
      for (const node of toc.nodes) {
        expect(node.code).toMatch(codeShape);
      }
    }
  });
});

describe("ToC versions", () => {
  it("every ToC has a non-empty version string", () => {
    for (const toc of ALL_TOCS) {
      expect(toc.version.length).toBeGreaterThan(0);
    }
  });

  it("every ToC has a non-empty title and narrative", () => {
    for (const toc of ALL_TOCS) {
      expect(toc.title.length).toBeGreaterThan(0);
      expect(toc.narrative.length).toBeGreaterThan(0);
    }
  });
});
