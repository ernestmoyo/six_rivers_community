"use client";

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
import { Users, Plus } from "lucide-react";
import { seedCohorts, seedStudents } from "@/lib/srata";

export default function SrataCohortsPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="SRATA Cohorts"
        subtitle="Intakes, training periods, and graduation status"
      />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex justify-end">
          <Link href="/submit/srata-enrollment">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Enroll student
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cohort</TableHead>
                  <TableHead>Intake</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Ended</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seedCohorts.map((c) => {
                  const count = seedStudents.filter((s) => s.cohortId === c.id).length;
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.intakeSize}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          {count}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{c.startDate}</TableCell>
                      <TableCell className="text-muted-foreground">{c.endDate ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            c.status === "graduated"
                              ? "bg-emerald-100 text-emerald-800"
                              : c.status === "in_training"
                                ? "bg-sky-100 text-sky-800"
                                : "bg-amber-100 text-amber-800"
                          }
                        >
                          {c.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
