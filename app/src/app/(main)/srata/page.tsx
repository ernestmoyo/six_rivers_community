"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { KPICard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Users,
  Briefcase,
  Award,
  TrendingUp,
  Building2,
  FileText,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { seedCohorts, seedStudents, seedTraces, nextTraceWindow, type SrataTraceWindow } from "@/lib/srata";

export default function SrataDashboardPage() {
  const totalEnrolled = seedStudents.length;
  const graduates = seedStudents.filter((s) => s.status === "graduated");
  const inTraining = seedStudents.filter((s) => s.status === "in_training").length;
  const femaleCount = seedStudents.filter((s) => s.sex === "female").length;
  const femalePct = totalEnrolled > 0 ? Math.round((femaleCount / totalEnrolled) * 100) : 0;

  const completionRate = seedCohorts
    .filter((c) => c.status === "graduated")
    .reduce((s, c) => s + c.intakeSize, 0);
  const graduatesActual = graduates.length;
  const completionPct =
    completionRate > 0 ? Math.round((graduatesActual / completionRate) * 100) : 0;

  // Employment by window
  const tracesByStudent = new Map<number, typeof seedTraces>();
  for (const t of seedTraces) {
    const arr = tracesByStudent.get(t.studentId) ?? [];
    arr.push(t);
    tracesByStudent.set(t.studentId, arr);
  }

  function employmentRate(window: "3m" | "6m" | "12m") {
    const eligible = graduates.length;
    if (eligible === 0) return 0;
    const employed = graduates.filter((g) => {
      const traces = tracesByStudent.get(g.id) ?? [];
      return traces.some((t) => t.traceWindow === window && t.employed);
    }).length;
    return Math.round((employed / eligible) * 100);
  }

  const employed3m = employmentRate("3m");
  const employed6m = employmentRate("6m");
  const employed12m = employmentRate("12m");

  const incomeBefore = seedStudents
    .filter((s) => typeof s.monthlyIncomeBeforeTSh === "number")
    .reduce((s, x) => s + (x.monthlyIncomeBeforeTSh ?? 0), 0) /
    (seedStudents.filter((s) => typeof s.monthlyIncomeBeforeTSh === "number").length || 1);

  const incomeAfter = seedTraces.filter((t) => t.employed && t.monthlyIncomeTSh).reduce(
    (s, t) => s + (t.monthlyIncomeTSh ?? 0),
    0,
  ) / (seedTraces.filter((t) => t.employed && t.monthlyIncomeTSh).length || 1);

  // Cohort chart
  const cohortChart = seedCohorts.map((c) => {
    const cohortStudents = seedStudents.filter((s) => s.cohortId === c.id);
    return {
      cohort: c.name.split(" (")[0],
      enrolled: c.intakeSize,
      attended: cohortStudents.length,
      graduated: cohortStudents.filter((s) => s.status === "graduated").length,
    };
  });

  // Overdue tracers
  const overdueTraces = graduates
    .map((g) => {
      if (!g.graduatedAt) return null;
      const next = nextTraceWindow(g.graduatedAt);
      if (!next) return null;
      const done = (tracesByStudent.get(g.id) ?? []).some((t) => t.traceWindow === next.window);
      if (done) return null;
      return { student: g, next };
    })
    .filter((x): x is { student: typeof graduates[number]; next: { window: SrataTraceWindow; dueDate: string } } => x !== null);

  return (
    <div className="flex flex-col">
      <Header
        title="SRATA Academy"
        subtitle="Hospitality & tourism vocational training — MEAL dashboard"
      />

      <div className="flex flex-col gap-6 p-6">
        {/* Hero */}
        <Card className="border-sky-200 bg-gradient-to-br from-sky-50 to-indigo-50">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-600 text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-semibold">{seedCohorts.length} cohorts tracked</h2>
                <p className="text-xs text-muted-foreground">
                  {graduates.length} graduates · {inTraining} currently in training · {seedCohorts[0]?.name}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/submit/srata-enrollment">
                <Button size="sm" className="gap-1.5">
                  <Users className="h-4 w-4" />
                  Enroll student
                </Button>
              </Link>
              <Link href="/submit/srata-tracer">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Award className="h-4 w-4" />
                  Record tracer
                </Button>
              </Link>
              <Link href="/srata/reports">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <FileText className="h-4 w-4" />
                  Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* KPIs row 1 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total enrolled"
            value={totalEnrolled}
            icon={Users}
            subtitle={`${seedCohorts.length} cohorts`}
            iconClassName="bg-sky-100 text-sky-600"
          />
          <KPICard
            title="Completion rate"
            value={`${completionPct}%`}
            icon={Award}
            subtitle={`${graduatesActual} of ${completionRate} graduated`}
            iconClassName="bg-emerald-100 text-emerald-600"
          />
          <KPICard
            title="Female participation"
            value={`${femalePct}%`}
            icon={Users}
            subtitle={`${femaleCount} of ${totalEnrolled} students`}
            iconClassName="bg-pink-100 text-pink-600"
          />
          <KPICard
            title="In training"
            value={inTraining}
            icon={GraduationCap}
            subtitle="Current cohort"
            iconClassName="bg-amber-100 text-amber-600"
          />
        </div>

        {/* KPIs row 2 — Employment */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Employed @ 3m"
            value={`${employed3m}%`}
            icon={Briefcase}
            iconClassName="bg-emerald-100 text-emerald-600"
            trend="up"
            trendValue="of Cohort 1"
          />
          <KPICard
            title="Employed @ 6m"
            value={`${employed6m}%`}
            icon={Briefcase}
            iconClassName="bg-emerald-100 text-emerald-600"
            subtitle="Retention check"
          />
          <KPICard
            title="Employed @ 12m"
            value={`${employed12m}%`}
            icon={Briefcase}
            iconClassName="bg-emerald-100 text-emerald-600"
            subtitle="Long-term tracer"
          />
          <KPICard
            title="Avg income change"
            value={
              incomeBefore && incomeAfter
                ? `+${Math.round(((incomeAfter - incomeBefore) / Math.max(incomeBefore, 1)) * 100)}%`
                : "—"
            }
            icon={TrendingUp}
            subtitle={`${(incomeBefore / 1000).toFixed(0)}K → ${(incomeAfter / 1000).toFixed(0)}K TSh`}
            iconClassName="bg-teal-100 text-teal-600"
          />
        </div>

        {/* Charts + tracer alerts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Cohort progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cohortChart}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="cohort" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="enrolled" name="Enrolled" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="attended" name="Attended" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="graduated" name="Graduated" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Tracer follow-ups due
              </CardTitle>
            </CardHeader>
            <CardContent>
              {overdueTraces.length === 0 ? (
                <p className="text-xs text-muted-foreground">All tracer windows captured.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {overdueTraces.slice(0, 5).map(({ student, next }) => (
                    <Link
                      key={student.id}
                      href={`/submit/srata-tracer?student=${student.id}&window=${next.window}`}
                      className="flex items-center justify-between rounded-md border p-2 text-sm hover:bg-muted"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{student.fullName}</span>
                        <span className="text-xs text-muted-foreground">
                          {student.cohortName} · due {next.dueDate}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {next.window}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/srata/cohorts", title: "Cohorts", desc: `${seedCohorts.length} active`, icon: GraduationCap },
            { href: "/srata/students", title: "Students", desc: `${seedStudents.length} on roster`, icon: Users },
            { href: "/srata/internships", title: "Internships", desc: "3-month placements", icon: Building2 },
            { href: "/srata/graduates", title: "Graduates", desc: `${graduates.length} tracked`, icon: Award },
            { href: "/srata/employers", title: "Employers", desc: "Partner directory", icon: Building2 },
            { href: "/srata/reports", title: "Reports", desc: "Institutional PDF", icon: FileText },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.href} href={c.href}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold">{c.title}</span>
                      <span className="text-xs text-muted-foreground">{c.desc}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
