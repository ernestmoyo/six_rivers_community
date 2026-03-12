"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { demoCattleIncidents } from "@/lib/demo-data";
import { INCIDENT_TYPES, SEVERITY_LEVELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { CattleIncident } from "@/types";

type SortField = "date" | "villageName" | "incidentType" | "severity" | "estimatedHerdSize" | "reportedBy";
type SortDir = "asc" | "desc";

export default function CattleIncidentsPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [villageFilter, setVillageFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const uniqueVillages = useMemo(
    () => Array.from(new Set(demoCattleIncidents.map((i) => i.villageName).filter(Boolean))) as string[],
    []
  );

  const filtered = useMemo(() => {
    let items = [...demoCattleIncidents];

    if (dateFrom) {
      items = items.filter((i) => i.date >= dateFrom);
    }
    if (dateTo) {
      items = items.filter((i) => i.date <= dateTo);
    }
    if (typeFilter) {
      items = items.filter((i) => i.incidentType === typeFilter);
    }
    if (severityFilter) {
      items = items.filter((i) => i.severity === severityFilter);
    }
    if (villageFilter) {
      items = items.filter((i) => i.villageName === villageFilter);
    }

    items.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "date":
          cmp = a.date.localeCompare(b.date);
          break;
        case "villageName":
          cmp = (a.villageName || "").localeCompare(b.villageName || "");
          break;
        case "incidentType":
          cmp = a.incidentType.localeCompare(b.incidentType);
          break;
        case "severity": {
          const order = { low: 0, moderate: 1, high: 2 };
          cmp = order[a.severity] - order[b.severity];
          break;
        }
        case "estimatedHerdSize":
          cmp = (a.estimatedHerdSize || 0) - (b.estimatedHerdSize || 0);
          break;
        case "reportedBy":
          cmp = a.reportedBy.localeCompare(b.reportedBy);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return items;
  }, [dateFrom, dateTo, typeFilter, severityFilter, villageFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortDir === "asc" ? " \u2191" : " \u2193") : "";

  return (
    <div className="flex flex-col">
      <Header
        title="Cattle Incidents"
        subtitle="Detailed incident records and filtering"
      />

      <div className="flex flex-col gap-6 p-6">
        {/* Filter Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="dateFrom">Date From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="dateTo">Date To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="typeFilter">Incident Type</Label>
                <select
                  id="typeFilter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Types</option>
                  {Object.entries(INCIDENT_TYPES).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="severityFilter">Severity</Label>
                <select
                  id="severityFilter"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Severities</option>
                  {Object.entries(SEVERITY_LEVELS).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="villageFilter">Village</Label>
                <select
                  id="villageFilter"
                  value={villageFilter}
                  onChange={(e) => setVillageFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Villages</option>
                  {uniqueVillages.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {demoCattleIncidents.length} incidents
        </p>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort("date")}
                  >
                    Date{sortIndicator("date")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort("villageName")}
                  >
                    Village{sortIndicator("villageName")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort("incidentType")}
                  >
                    Type{sortIndicator("incidentType")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort("severity")}
                  >
                    Severity{sortIndicator("severity")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none text-right"
                    onClick={() => toggleSort("estimatedHerdSize")}
                  >
                    Herd Size{sortIndicator("estimatedHerdSize")}
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort("reportedBy")}
                  >
                    Reported By{sortIndicator("reportedBy")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(incident.date)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {incident.villageName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: `${INCIDENT_TYPES[incident.incidentType].color}20`,
                          color: INCIDENT_TYPES[incident.incidentType].color,
                        }}
                      >
                        {INCIDENT_TYPES[incident.incidentType].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          incident.severity === "high"
                            ? "bg-red-100 text-red-800"
                            : incident.severity === "moderate"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {SEVERITY_LEVELS[incident.severity].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ~{incident.estimatedHerdSize ?? "-"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {incident.description}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {incident.reportedBy}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No incidents match the current filters.
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
