"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2 } from "lucide-react";
import { seedStudents } from "@/lib/srata";

// Demo internship rows backed by seed students (until live data lands).
const demoInternships = [
  {
    id: 1,
    studentId: 101,
    hostInstitution: "Hondo Hondo Lodge",
    department: "Housekeeping",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    supervisor: "Anna Materu",
    status: "completed",
  },
  {
    id: 2,
    studentId: 102,
    hostInstitution: "Mama Mwendapole Restaurant",
    department: "Kitchen",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    supervisor: "Chef Joseph",
    status: "completed",
  },
  {
    id: 3,
    studentId: 103,
    hostInstitution: "Hippo Pool Camp",
    department: "Front of house",
    startDate: "2025-04-15",
    endDate: "2025-07-15",
    supervisor: "Pendo Mbogo",
    status: "completed",
  },
];

export default function SrataInternshipsPage() {
  return (
    <div className="flex flex-col">
      <Header title="SRATA Internships" subtitle="3-month industry placements" />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex justify-end gap-2">
          <Link href="/submit/srata-internship">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              New placement
            </Button>
          </Link>
          <Link href="/submit/srata-internship-eval">
            <Button size="sm" variant="outline" className="gap-1.5">
              Record evaluation
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {demoInternships.map((i) => {
            const student = seedStudents.find((s) => s.id === i.studentId);
            return (
              <Card key={i.id}>
                <CardContent className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{i.hostInstitution}</p>
                        <p className="text-xs text-muted-foreground">{i.department}</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        i.status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }
                    >
                      {i.status}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Student:</span>{" "}
                    <span className="font-medium">{student?.fullName ?? "Unknown"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {i.startDate} → {i.endDate} · Supervisor: {i.supervisor}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
