"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { KPICard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GraduationCap,
  BookOpen,
  Trophy,
  Users,
  MapPin,
  Calendar,
  Compass,
} from "lucide-react";
import { demoEcoClubs } from "@/lib/demo-data";

type SectorFilter = "all" | "ifakara" | "mbarali";

export default function EcoClubsPage() {
  const [sectorFilter, setSectorFilter] = useState<SectorFilter>("all");
  const clubs = demoEcoClubs;

  const filtered = useMemo(
    () => clubs.filter((c) => sectorFilter === "all" || c.sector === sectorFilter),
    [clubs, sectorFilter]
  );

  const totalStudents = clubs.reduce((s, c) => s + c.maleCount + c.femaleCount, 0);
  const maleTotal = clubs.reduce((s, c) => s + c.maleCount, 0);
  const femaleTotal = clubs.reduce((s, c) => s + c.femaleCount, 0);
  const msolwaSchools = clubs.filter((c) => c.sector === "ifakara").length;
  const usanguSchools = clubs.filter((c) => c.sector === "mbarali").length;
  const totalSafariParticipants = clubs.reduce((s, c) => s + c.ecoSafariParticipants, 0);
  const avgSessions = Math.round(
    clubs.reduce((s, c) => s + c.sessionsCompleted, 0) / clubs.length
  );

  return (
    <div className="flex flex-col">
      <Header
        title="Eco Clubs"
        subtitle="School-based environmental education — 30 schools across Msolwa & Usangu sectors"
      />

      <div className="flex flex-col gap-6 p-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Schools"
            value={clubs.length}
            icon={GraduationCap}
            subtitle={`${msolwaSchools} Msolwa · ${usanguSchools} Usangu`}
            iconClassName="bg-blue-100 text-blue-600"
          />
          <KPICard
            title="Students"
            value={totalStudents}
            icon={Users}
            subtitle={`${maleTotal}M · ${femaleTotal}F (30 per school)`}
            iconClassName="bg-emerald-100 text-emerald-600"
          />
          <KPICard
            title="Avg Sessions Completed"
            value={`${avgSessions} / 20`}
            icon={BookOpen}
            subtitle="Full curriculum is 20 sessions per year"
            iconClassName="bg-amber-100 text-amber-600"
          />
          <KPICard
            title="Eco Kids Safari 2025"
            value={totalSafariParticipants}
            icon={Compass}
            subtitle="Top performers visited Ruaha NP & Nyerere NP"
            iconClassName="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Programme narrative cards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Eco Club Curriculum
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Students are taught environmental issues &amp; conservation through a structured guide of <strong>20 sessions</strong>, delivered over a full academic year.
              </p>
              <p>
                Each school has <strong>two trained Eco Club teachers</strong> who facilitate weekly sessions — the schedule flexes with school timetables.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Compass className="h-4 w-4 text-emerald-600" />
                Eco Kids Safari
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Top-performing Eco Club students compete for a spot on the Eco Kids Safari — a hands-on trip to the national parks where they see wildlife &amp; ecosystems they have learned about.
              </p>
              <p>
                In 2025, <strong>80 children</strong> took part — 40 from Msolwa visited Nyerere NP and 40 from Usangu visited Ruaha NP.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-600" />
                Conservation Cup
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Inter-school competitions that raise conservation awareness across the wider student body (not just Eco Club members).
              </p>
              <p>
                <strong>Football tournaments for boys</strong> and <strong>quiz competitions for girls</strong> run in both the Msolwa and Usangu sectors at every project-supported school.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sector filter */}
        <div className="flex gap-1.5">
          <Button variant={sectorFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setSectorFilter("all")}>
            All Schools ({clubs.length})
          </Button>
          <Button variant={sectorFilter === "ifakara" ? "default" : "outline"} size="sm" onClick={() => setSectorFilter("ifakara")}>
            Msolwa / Ifakara TC ({msolwaSchools})
          </Button>
          <Button variant={sectorFilter === "mbarali" ? "default" : "outline"} size="sm" onClick={() => setSectorFilter("mbarali")}>
            Usangu / Mbarali DC ({usanguSchools})
          </Button>
        </div>

        {/* Schools table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Schools ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Teachers</TableHead>
                  <TableHead className="text-right">Students</TableHead>
                  <TableHead className="text-right">Sessions</TableHead>
                  <TableHead className="text-right">Safari 2025</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.schoolName}</TableCell>
                    <TableCell>{c.villageName}</TableCell>
                    <TableCell className="text-muted-foreground">{c.ward}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {c.sector === "ifakara" ? "Msolwa" : "Usangu"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        {c.teachers.map((t) => (
                          <span key={t} className="text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-medium">{c.maleCount + c.femaleCount}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {c.maleCount}M · {c.femaleCount}F
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-medium">{c.sessionsCompleted} / 20</span>
                        <span
                          className={
                            c.sessionsCompleted >= 15
                              ? "text-[10px] text-green-600"
                              : c.sessionsCompleted >= 10
                                ? "text-[10px] text-amber-600"
                                : "text-[10px] text-red-500"
                          }
                        >
                          {Math.round((c.sessionsCompleted / 20) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Compass className="h-3 w-3 text-purple-600" />
                        <span className="font-medium">{c.ecoSafariParticipants}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>Data reflects the 2025 academic year — Eco Club sessions continue into 2026.</span>
        </div>
      </div>
    </div>
  );
}
