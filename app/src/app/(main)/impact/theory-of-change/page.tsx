"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Target,
  Wrench,
  Activity as ActivityIcon,
  TrendingUp,
  Heart,
  Sprout,
} from "lucide-react";

import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ALL_TOCS,
  nodesByLevel,
  orderedLevels,
  type TheoryOfChange,
  type TocLevel,
  type TocNode,
} from "@/lib/theory-of-change";
import { findPillar, findProgramme } from "@/lib/taxonomy";

interface LevelStyle {
  readonly label: string;
  readonly icon: typeof Wrench;
  readonly accent: string;
  readonly bg: string;
  readonly ring: string;
  readonly badge: string;
}

const LEVEL_STYLES: Record<TocLevel, LevelStyle> = {
  input: {
    label: "Inputs",
    icon: Wrench,
    accent: "text-amber-900 dark:text-amber-200",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    ring: "ring-amber-200 dark:ring-amber-900/50",
    badge: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  },
  activity: {
    label: "Activities",
    icon: ActivityIcon,
    accent: "text-sky-900 dark:text-sky-200",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    ring: "ring-sky-200 dark:ring-sky-900/50",
    badge: "bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200",
  },
  output: {
    label: "Outputs",
    icon: Sprout,
    accent: "text-emerald-900 dark:text-emerald-200",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    ring: "ring-emerald-200 dark:ring-emerald-900/50",
    badge:
      "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  outcome: {
    label: "Outcomes",
    icon: TrendingUp,
    accent: "text-violet-900 dark:text-violet-200",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    ring: "ring-violet-200 dark:ring-violet-900/50",
    badge:
      "bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-200",
  },
  impact: {
    label: "Impact",
    icon: Heart,
    accent: "text-rose-900 dark:text-rose-200",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    ring: "ring-rose-200 dark:ring-rose-900/50",
    badge: "bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200",
  },
};

interface TocFlowProps {
  toc: TheoryOfChange;
}

function TocFlow({ toc }: TocFlowProps) {
  const grouped = useMemo(() => nodesByLevel(toc), [toc]);
  const levels = orderedLevels();

  return (
    <div className="space-y-6">
      {/* Mobile / vertical layout */}
      <div className="space-y-4 lg:hidden">
        {levels.map((level) => (
          <LevelColumn
            key={level}
            level={level}
            nodes={grouped[level]}
            compact={false}
          />
        ))}
      </div>

      {/* Desktop / 5-column flow */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-start lg:gap-3">
        {levels.map((level, index) => (
          <FlowSegment
            key={level}
            level={level}
            nodes={grouped[level]}
            isLast={index === levels.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

interface FlowSegmentProps {
  level: TocLevel;
  nodes: readonly TocNode[];
  isLast: boolean;
}

function FlowSegment({ level, nodes, isLast }: FlowSegmentProps) {
  return (
    <>
      <LevelColumn level={level} nodes={nodes} compact />
      {!isLast && (
        <div className="flex h-full items-center justify-center pt-12">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </>
  );
}

interface LevelColumnProps {
  level: TocLevel;
  nodes: readonly TocNode[];
  compact: boolean;
}

function LevelColumn({ level, nodes, compact }: LevelColumnProps) {
  const style = LEVEL_STYLES[level];
  const Icon = style.icon;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${style.accent}`} />
        <h3 className={`text-sm font-semibold uppercase tracking-wider ${style.accent}`}>
          {style.label}
        </h3>
        <Badge variant="secondary" className="text-xs">
          {nodes.length}
        </Badge>
      </div>
      <div className="space-y-2">
        {nodes.length === 0 ? (
          <div className={`rounded-lg border border-dashed p-3 text-xs italic text-muted-foreground ${style.bg}`}>
            No {style.label.toLowerCase()} authored yet.
          </div>
        ) : (
          nodes.map((node) => (
            <NodeCard key={node.code} node={node} style={style} compact={compact} />
          ))
        )}
      </div>
    </div>
  );
}

interface NodeCardProps {
  node: TocNode;
  style: LevelStyle;
  compact: boolean;
}

function NodeCard({ node, style, compact }: NodeCardProps) {
  return (
    <div
      className={`rounded-lg p-3 ring-1 ${style.bg} ${style.ring} transition-all hover:shadow-sm`}
    >
      <p className={`text-sm ${compact ? "leading-snug" : "leading-relaxed"} text-foreground`}>
        {node.statement}
      </p>
      {node.note && (
        <p className="mt-2 text-xs italic text-muted-foreground">{node.note}</p>
      )}
      <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground/70">
        {node.code}
      </p>
    </div>
  );
}

interface TocBlockProps {
  toc: TheoryOfChange;
}

function TocBlock({ toc }: TocBlockProps) {
  const scopeLabel = toc.scope === "pillar" ? "Pillar" : "Programme";
  const pillar = toc.pillarCode ? findPillar(toc.pillarCode) : undefined;
  const programme = toc.programmeCode ? findProgramme(toc.programmeCode) : undefined;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-slate-50 to-emerald-50/60 dark:from-slate-900 dark:to-emerald-950/40">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {scopeLabel}
              </Badge>
              {pillar && (
                <Badge variant="secondary" className="text-xs">
                  {pillar.name}
                </Badge>
              )}
              {programme && (
                <Badge variant="secondary" className="text-xs">
                  {programme.name}
                </Badge>
              )}
              <Badge variant="outline" className="font-mono text-[10px]">
                v{toc.version}
              </Badge>
            </div>
            <CardTitle className="text-2xl">{toc.title}</CardTitle>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {toc.narrative}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Indicators coming in Phase 2
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <TocFlow toc={toc} />
      </CardContent>
    </Card>
  );
}

export default function TheoryOfChangePage() {
  const [activeTab, setActiveTab] = useState<string>("community");

  const tocsByPillar = useMemo(() => {
    const groups = new Map<string, TheoryOfChange[]>();
    for (const toc of ALL_TOCS) {
      const key = toc.pillarCode ?? "_orphan";
      const list = groups.get(key) ?? [];
      list.push(toc);
      groups.set(key, list);
    }
    return groups;
  }, []);

  const communityTocs = tocsByPillar.get("community") ?? [];
  const protectionTocs = tocsByPillar.get("protection") ?? [];

  return (
    <div className="flex flex-col">
      <Header
        title="Theory of Change"
        subtitle="How Six Rivers Africa moves from inputs to landscape-scale impact"
      />

      <div className="space-y-6 p-4 sm:p-6">
        {/* Hero */}
        <Card className="overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 dark:border-emerald-900/40 dark:from-emerald-950/40 dark:via-slate-950 dark:to-amber-950/20">
          <CardContent className="p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-center">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    M&amp;E Foundation
                  </span>
                </div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  From inputs to landscape-scale impact
                </h1>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Every programme below traces a path from what we put in
                  (officers, capital, partnerships) to the impact we are
                  accountable for (durable coexistence, reduced conflict,
                  protected forest). In Phase 2 of the platform rollout, each
                  node will be linked to a measurable indicator and a quarterly
                  target — so the donor report writes itself.
                </p>
              </div>
              <div className="space-y-3 rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-slate-900/40">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  At a glance
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <StatTile label="Pillars" value={tocsByPillar.size} />
                  <StatTile
                    label="Programmes mapped"
                    value={
                      communityTocs.filter((t) => t.scope === "programme").length +
                      protectionTocs.filter((t) => t.scope === "programme").length
                    }
                  />
                  <StatTile
                    label="ToC nodes total"
                    value={ALL_TOCS.reduce((sum, t) => sum + t.nodes.length, 0)}
                  />
                  <StatTile label="Version" value="2026-05-15" mono />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="community">Community pillar</TabsTrigger>
            <TabsTrigger value="protection">
              Protection pillar
              <Badge variant="outline" className="ml-2 text-[10px]">
                placeholder
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="community" className="space-y-6">
            {communityTocs.map((toc) => (
              <TocBlock key={`${toc.scope}:${toc.programmeCode ?? toc.pillarCode}`} toc={toc} />
            ))}
          </TabsContent>

          <TabsContent value="protection" className="space-y-6">
            {protectionTocs.map((toc) => (
              <TocBlock key={`${toc.scope}:${toc.programmeCode ?? toc.pillarCode}`} toc={toc} />
            ))}
            <Card className="border-dashed">
              <CardContent className="p-6 text-sm text-muted-foreground">
                The Protection pillar is intentionally a placeholder. Real
                inputs, activities, and outcomes will populate after a working
                session with Thomas Barnes covering cattle pressure on the
                Ihefu wetland and the law-enforcement workflow.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="rounded-lg border bg-muted/30 p-4 text-xs text-muted-foreground">
          <p className="mb-2 font-semibold uppercase tracking-wider">
            Phase 2 — Indicator engine
          </p>
          <p className="leading-relaxed">
            Each ToC node above gets a unique code (e.g. <span className="font-mono">hwce.output.students_enrolled</span>). In Phase 2 we attach <code>Indicator</code> rows to these codes and compute <code>IndicatorPeriod</code> actuals nightly from the enrollment, ledger, and field-visit tables. Mary&apos;s donor dashboard and the quarterly PDF then read from the same indicator store.
          </p>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" size="sm" disabled>
            Edit ToC (admin) — coming in Phase 2
          </Button>
        </div>
      </div>
    </div>
  );
}

interface StatTileProps {
  label: string;
  value: number | string;
  mono?: boolean;
}

function StatTile({ label, value, mono }: StatTileProps) {
  return (
    <div className="space-y-0.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`text-xl font-bold ${mono ? "font-mono text-base" : ""}`}>
        {value}
      </div>
    </div>
  );
}
