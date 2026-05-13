"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { seedCohorts, seedStudents, seedTraces } from "@/lib/srata";
import { six_rivers_logo } from "@/lib/six-rivers-logo";

function buildReport() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  let y = 0;
  const navy: [number, number, number] = [30, 58, 95];
  const sky: [number, number, number] = [14, 165, 233];
  const gold: [number, number, number] = [240, 209, 113];
  const white: [number, number, number] = [255, 255, 255];
  const black: [number, number, number] = [33, 33, 33];

  function sectionTitle(t: string) {
    doc.setFillColor(...navy);
    doc.rect(0, y, w, 10, "F");
    doc.setFillColor(...gold);
    doc.rect(0, y, 3, 10, "F");
    doc.setTextColor(...white);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(t, 14, y + 7);
    y += 14;
    doc.setTextColor(...black);
  }
  function kv(label: string, value: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(label, 14, y);
    doc.setFont("helvetica", "bold");
    doc.text(value, 90, y);
    y += 6;
  }
  function checkPage() {
    if (y > 280) {
      doc.addPage();
      y = 15;
    }
  }

  // Header
  doc.setFillColor(...sky);
  doc.rect(0, 0, w, 44, "F");
  doc.setFillColor(...gold);
  doc.rect(0, 44, w, 1.5, "F");
  try {
    doc.addImage(six_rivers_logo, "PNG", 12, 5, 55, 12);
  } catch {}
  doc.setTextColor(...white);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("SRATA Academy — Institutional Report", 14, 28);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 35);
  y = 52;

  // Programme overview
  const graduates = seedStudents.filter((s) => s.status === "graduated");
  const inTraining = seedStudents.filter((s) => s.status === "in_training").length;
  const femaleCount = seedStudents.filter((s) => s.sex === "female").length;
  const femalePct =
    seedStudents.length > 0 ? Math.round((femaleCount / seedStudents.length) * 100) : 0;
  const employed = seedTraces.filter((t) => t.employed).length;
  const employedPct = graduates.length > 0 ? Math.round((employed / graduates.length) * 100) : 0;

  sectionTitle("Programme Overview");
  kv("Cohorts tracked", String(seedCohorts.length));
  kv("Total enrolled", String(seedStudents.length));
  kv("Graduates", String(graduates.length));
  kv("In training", String(inTraining));
  kv("Female participation", `${femalePct}%`);
  kv("Employed (any window)", `${employedPct}% of graduates`);
  y += 4;

  sectionTitle("Cohorts");
  seedCohorts.forEach((c) => {
    checkPage();
    const count = seedStudents.filter((s) => s.cohortId === c.id).length;
    kv(c.name, `${count} students · ${c.status}`);
  });
  y += 4;

  sectionTitle("Graduate Outcomes (Latest Tracer)");
  const tracesByStudent = new Map<number, typeof seedTraces>();
  for (const t of seedTraces) {
    const arr = tracesByStudent.get(t.studentId) ?? [];
    arr.push(t);
    tracesByStudent.set(t.studentId, arr);
  }
  graduates.forEach((g) => {
    checkPage();
    const arr = (tracesByStudent.get(g.id) ?? []).sort((a, b) => a.traceDate.localeCompare(b.traceDate));
    const latest = arr[arr.length - 1];
    const status = latest
      ? latest.employed
        ? `${latest.employer ?? "Employed"} · ${latest.monthlyIncomeTSh ? `${(latest.monthlyIncomeTSh / 1000).toFixed(0)}K TSh` : "income not recorded"}`
        : "Unemployed at latest tracer"
      : "No tracer yet";
    kv(g.fullName, status);
  });

  doc.save(`SRATA_Academy_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default function SrataReportsPage() {
  const graduates = seedStudents.filter((s) => s.status === "graduated");
  const employed = seedTraces.filter((t) => t.employed).length;
  const employedPct = graduates.length > 0 ? Math.round((employed / graduates.length) * 100) : 0;

  return (
    <div className="flex flex-col">
      <Header
        title="SRATA Reports"
        subtitle="Institutional performance report for board and donors"
      />

      <div className="flex flex-col gap-6 p-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Annual Institutional Report
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Generates a branded PDF with cohort enrollment, completion, employment rate, and
              graduate outcomes per the SRATA Academy MEAL framework.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border p-3">
                <span className="text-xs text-muted-foreground">Cohorts</span>
                <p className="text-lg font-bold">{seedCohorts.length}</p>
              </div>
              <div className="rounded-md border p-3">
                <span className="text-xs text-muted-foreground">Enrollments</span>
                <p className="text-lg font-bold">{seedStudents.length}</p>
              </div>
              <div className="rounded-md border p-3">
                <span className="text-xs text-muted-foreground">Graduates</span>
                <p className="text-lg font-bold">{graduates.length}</p>
              </div>
              <div className="rounded-md border p-3">
                <span className="text-xs text-muted-foreground">Employment rate</span>
                <p className="text-lg font-bold">{employedPct}%</p>
              </div>
            </div>
            <Button className="gap-2 w-fit" onClick={() => buildReport()}>
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
