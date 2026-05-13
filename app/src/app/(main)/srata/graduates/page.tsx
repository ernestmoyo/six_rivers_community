"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { seedStudents, seedTraces, nextTraceWindow } from "@/lib/srata";

type EmployedFilter = "all" | "employed" | "unemployed";

export default function SrataGraduatesPage() {
  const [filter, setFilter] = useState<EmployedFilter>("all");

  const graduates = seedStudents.filter((s) => s.status === "graduated");

  const tracesByStudent = useMemo(() => {
    const map = new Map<number, typeof seedTraces>();
    for (const t of seedTraces) {
      const arr = map.get(t.studentId) ?? [];
      arr.push(t);
      map.set(t.studentId, arr);
    }
    return map;
  }, []);

  const rows = graduates.map((g) => {
    const traces = (tracesByStudent.get(g.id) ?? []).sort((a, b) =>
      a.traceDate.localeCompare(b.traceDate),
    );
    const latest = traces[traces.length - 1] ?? null;
    const next = g.graduatedAt ? nextTraceWindow(g.graduatedAt) : null;
    return { student: g, traces, latest, next };
  });

  const filtered = rows.filter(({ latest }) => {
    if (filter === "all") return true;
    if (filter === "employed") return latest?.employed === true;
    if (filter === "unemployed") return latest && !latest.employed;
    return true;
  });

  return (
    <div className="flex flex-col">
      <Header
        title="SRATA Graduates"
        subtitle="Tracer-window outcomes and employment status"
      />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All ({rows.length})
            </Button>
            <Button
              size="sm"
              variant={filter === "employed" ? "default" : "outline"}
              onClick={() => setFilter("employed")}
            >
              Employed
            </Button>
            <Button
              size="sm"
              variant={filter === "unemployed" ? "default" : "outline"}
              onClick={() => setFilter("unemployed")}
            >
              Unemployed
            </Button>
          </div>
          <Link href="/submit/srata-tracer">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Record tracer
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Graduate</TableHead>
                  <TableHead>Cohort</TableHead>
                  <TableHead>Latest tracer</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Income</TableHead>
                  <TableHead>Next due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(({ student, latest, next }) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{student.cohortName}</TableCell>
                    <TableCell>
                      {latest ? (
                        <Badge
                          variant="secondary"
                          className={
                            latest.employed
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }
                        >
                          {latest.traceWindow} · {latest.employed ? "Employed" : "Unemployed"}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No tracer yet</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {latest?.employer ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {latest?.monthlyIncomeTSh
                        ? `${(latest.monthlyIncomeTSh / 1000).toFixed(0)}K TSh`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {next ? (
                        <Link
                          href={`/submit/srata-tracer?student=${student.id}&window=${next.window}`}
                          className="inline-flex"
                        >
                          <Badge variant="secondary" className="bg-sky-100 text-sky-800 hover:bg-sky-200">
                            {next.window} · {next.dueDate}
                          </Badge>
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">all done</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
