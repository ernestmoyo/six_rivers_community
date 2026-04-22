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
  Radio,
  Calendar,
  Mic,
  Award,
  Users,
  Clock,
} from "lucide-react";
import { demoRadioSessions, demoRadioWinners, RADIO_PROGRAMME_META } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

type SectorFilter = "all" | "ifakara" | "mbarali";
type GenderFilter = "all" | "male" | "female";

export default function RadioPage() {
  const [sectorFilter, setSectorFilter] = useState<SectorFilter>("all");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");

  const filteredWinners = useMemo(
    () =>
      demoRadioWinners.filter(
        (w) =>
          (sectorFilter === "all" || w.sector === sectorFilter) &&
          (genderFilter === "all" || w.gender === genderFilter)
      ),
    [sectorFilter, genderFilter]
  );

  const maleWinners = demoRadioWinners.filter((w) => w.gender === "male").length;
  const femaleWinners = demoRadioWinners.filter((w) => w.gender === "female").length;
  const msolwaWinners = demoRadioWinners.filter((w) => w.sector === "ifakara").length;
  const usanguWinners = demoRadioWinners.filter((w) => w.sector === "mbarali").length;

  return (
    <div className="flex flex-col">
      <Header
        title="Radio Programme"
        subtitle={`${RADIO_PROGRAMME_META.name} — ${RADIO_PROGRAMME_META.station}`}
      />

      <div className="flex flex-col gap-6 p-6">
        {/* Hero card */}
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-600 text-white shrink-0">
                <Radio className="h-8 w-8" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-indigo-700">
                    Conservation &amp; Community Radio Programme
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">{RADIO_PROGRAMME_META.name}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Station</span>
                    <span className="font-medium">{RADIO_PROGRAMME_META.station}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Slot</span>
                    <span className="font-medium">{RADIO_PROGRAMME_META.slot}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Duration</span>
                    <span className="font-medium">{RADIO_PROGRAMME_META.durationMin} min</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Sessions aired 2025</span>
                    <span className="font-medium">{RADIO_PROGRAMME_META.sessionsAired2025}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Sessions Aired"
            value={`${RADIO_PROGRAMME_META.sessionsAired2025} in 2025`}
            icon={Mic}
            subtitle="Every Friday, year-round"
            iconClassName="bg-indigo-100 text-indigo-600"
          />
          <KPICard
            title="Total Winners"
            value={demoRadioWinners.length}
            icon={Award}
            subtitle={`${maleWinners}M · ${femaleWinners}F`}
            iconClassName="bg-amber-100 text-amber-600"
          />
          <KPICard
            title="Msolwa Winners"
            value={msolwaWinners}
            icon={Users}
            subtitle="Ifakara Town Council"
            iconClassName="bg-green-100 text-green-600"
          />
          <KPICard
            title="Usangu Winners"
            value={usanguWinners}
            icon={Users}
            subtitle="Mbarali District Council"
            iconClassName="bg-orange-100 text-orange-600"
          />
        </div>

        {/* Recent sessions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Air Date</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Guest Speaker</TableHead>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Sector</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoRadioSessions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-muted-foreground">{formatDate(s.airDate)}</TableCell>
                    <TableCell className="font-medium max-w-md">{s.topic}</TableCell>
                    <TableCell>{s.guestSpeaker ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{s.guestOrganization ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {s.sector === "both" ? "Msolwa + Usangu" : s.sector === "ifakara" ? "Msolwa" : "Usangu"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Winners */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Award className="h-4 w-4" />
            Programme Winners ({filteredWinners.length})
          </h2>
          <div className="flex gap-1.5 flex-wrap">
            <Button variant={sectorFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setSectorFilter("all")}>
              All Sectors
            </Button>
            <Button variant={sectorFilter === "ifakara" ? "default" : "outline"} size="sm" onClick={() => setSectorFilter("ifakara")}>
              Msolwa ({msolwaWinners})
            </Button>
            <Button variant={sectorFilter === "mbarali" ? "default" : "outline"} size="sm" onClick={() => setSectorFilter("mbarali")}>
              Usangu ({usanguWinners})
            </Button>
            <span className="w-px bg-border mx-1" />
            <Button variant={genderFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setGenderFilter("all")}>
              All
            </Button>
            <Button variant={genderFilter === "female" ? "default" : "outline"} size="sm" onClick={() => setGenderFilter("female")}>
              Female ({femaleWinners})
            </Button>
            <Button variant={genderFilter === "male" ? "default" : "outline"} size="sm" onClick={() => setGenderFilter("male")}>
              Male ({maleWinners})
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Session Date</TableHead>
                  <TableHead>Prize</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWinners.map((w, i) => (
                  <TableRow key={w.id}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{w.name}</TableCell>
                    <TableCell>{w.village}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {w.sector === "ifakara" ? "Msolwa" : "Usangu"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          w.gender === "female"
                            ? "bg-pink-100 text-pink-800"
                            : w.gender === "male"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-muted"
                        }
                      >
                        {w.gender === "female" ? "F" : w.gender === "male" ? "M" : "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {w.sessionDate ? formatDate(w.sessionDate) : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{w.prize ?? "—"}</TableCell>
                  </TableRow>
                ))}
                {filteredWinners.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No winners match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>
            Each session is followed by a listener call-in quiz — winners receive solar lamps or kitchen sets and are announced on the following Friday&apos;s slot.
          </span>
        </div>
      </div>
    </div>
  );
}
