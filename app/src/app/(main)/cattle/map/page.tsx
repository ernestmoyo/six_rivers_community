"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Beef, X } from "lucide-react";
import { demoCattleIncidents } from "@/lib/demo-data";
import { INCIDENT_TYPES, SEVERITY_LEVELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { CattleIncident } from "@/types";

const severityDotColor: Record<CattleIncident["severity"], string> = {
  high: "bg-red-500 ring-red-200",
  moderate: "bg-amber-500 ring-amber-200",
  low: "bg-green-500 ring-green-200",
};

export default function CattlePressureMapPage() {
  const [selectedIncident, setSelectedIncident] = useState<CattleIncident | null>(null);

  const incidentsByVillage = demoCattleIncidents.reduce<Record<string, number>>((acc, i) => {
    const name = i.villageName || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="Cattle Pressure Map"
        subtitle="Spatial distribution of cattle incidents in Usangu Basin"
      />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-2xl aspect-[4/3] rounded-xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-green-50 to-emerald-50 p-8">
              {/* Grid lines */}
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="cattle-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(34 197 94 / 0.1)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cattle-grid)" />
                </svg>

                {/* Cattle incident markers */}
                {demoCattleIncidents.map((incident, i) => (
                  <button
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className="absolute group"
                    style={{
                      left: `${20 + (i % 3) * 25 + i * 5}%`,
                      top: `${25 + Math.floor(i / 3) * 30 + (i % 2) * 15}%`,
                    }}
                  >
                    <div className="relative">
                      <div
                        className={`h-5 w-5 rounded-full ${severityDotColor[incident.severity]} animate-pulse ring-2 shadow-md transition-transform group-hover:scale-150 ${
                          selectedIncident?.id === incident.id ? "scale-150 ring-4" : ""
                        }`}
                      />
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-foreground/70 hidden group-hover:block bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
                        {incident.villageName}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Zone label */}
              <div className="absolute bottom-3 right-3">
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-[10px]">
                  Usangu Basin
                </Badge>
              </div>

              {/* Legend */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 bg-white/80 rounded-lg p-2">
                <span className="text-[10px] font-medium text-muted-foreground mb-0.5">Severity</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-[10px]">High</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-[10px]">Moderate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-[10px]">Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 border-l bg-background overflow-y-auto">
          <div className="p-4">
            {selectedIncident ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Incident Details</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => setSelectedIncident(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${INCIDENT_TYPES[selectedIncident.incidentType].color}20`,
                        color: INCIDENT_TYPES[selectedIncident.incidentType].color,
                      }}
                    >
                      {INCIDENT_TYPES[selectedIncident.incidentType].label}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        selectedIncident.severity === "high"
                          ? "bg-red-100 text-red-800"
                          : selectedIncident.severity === "moderate"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {SEVERITY_LEVELS[selectedIncident.severity].label}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Date: </span>
                      <span className="font-medium">{formatDate(selectedIncident.date)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Village: </span>
                      <span className="font-medium">{selectedIncident.villageName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Herd Size: </span>
                      <span className="font-medium">~{selectedIncident.estimatedHerdSize ?? "Unknown"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reported By: </span>
                      <span className="font-medium">{selectedIncident.reportedBy}</span>
                    </div>
                  </div>

                  {selectedIncident.description && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Description</p>
                        <p className="text-sm">{selectedIncident.description}</p>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-sm mb-4">Incident Summary</h3>

                <div className="flex flex-col gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 mx-auto mb-2">
                        <Beef className="h-5 w-5 text-red-600" />
                      </div>
                      <p className="text-2xl font-bold">{demoCattleIncidents.length}</p>
                      <p className="text-xs text-muted-foreground">Total Incidents</p>
                    </CardContent>
                  </Card>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Incidents by Village
                    </p>
                    <div className="flex flex-col gap-2">
                      {Object.entries(incidentsByVillage)
                        .sort(([, a], [, b]) => b - a)
                        .map(([village, count]) => (
                          <div
                            key={village}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <span className="text-sm font-medium">{village}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      By Severity
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {(["high", "moderate", "low"] as const).map((sev) => {
                        const count = demoCattleIncidents.filter((i) => i.severity === sev).length;
                        return (
                          <div key={sev} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${severityDotColor[sev].split(" ")[0]}`} />
                              <span>{SEVERITY_LEVELS[sev].label}</span>
                            </div>
                            <span className="font-medium">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
