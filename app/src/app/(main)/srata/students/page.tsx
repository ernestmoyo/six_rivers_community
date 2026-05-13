"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { seedStudents, seedCohorts } from "@/lib/srata";

export default function SrataStudentsPage() {
  const [query, setQuery] = useState("");
  const [cohortFilter, setCohortFilter] = useState("");

  const filtered = seedStudents.filter((s) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q ||
      s.fullName.toLowerCase().includes(q) ||
      s.district.toLowerCase().includes(q) ||
      s.preferredPathway.toLowerCase().includes(q);
    const matchesC = !cohortFilter || String(s.cohortId) === cohortFilter;
    return matchesQ && matchesC;
  });

  return (
    <div className="flex flex-col">
      <Header
        title="SRATA Students"
        subtitle="Master roster across cohorts"
      />

      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search name, district, pathway..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-64 pl-9 h-9 text-sm"
              />
            </div>
            <select
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All cohorts</option>
              {seedCohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <Link href="/submit/srata-enrollment">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              New enrollment
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Cohort</TableHead>
                  <TableHead>Sex</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Pathway</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{s.cohortName}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          s.sex === "female"
                            ? "bg-pink-100 text-pink-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {s.sex === "female" ? "F" : "M"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.district}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{s.preferredPathway}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          s.status === "graduated"
                            ? "bg-emerald-100 text-emerald-800"
                            : s.status === "in_training"
                              ? "bg-sky-100 text-sky-800"
                              : "bg-amber-100 text-amber-800"
                        }
                      >
                        {s.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No students match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
