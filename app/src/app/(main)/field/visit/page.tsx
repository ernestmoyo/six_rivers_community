"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClipboardList,
  MapPin,
  Camera,
  Wifi,
  WifiOff,
  Send,
  Sprout,
  TreePine,
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { demoFieldVisits, demoDistributions } from "@/lib/demo-data";
import { VISIT_TYPES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

const visitTypeIcons: Record<string, React.ElementType> = {
  farm_check: Sprout,
  nursery_check: TreePine,
  community_meeting: Users,
  seedling_distribution: Package,
  incident_report: AlertTriangle,
  survival_check: CheckCircle,
};

export default function FieldVisitPage() {
  const [visitType, setVisitType] = useState("");
  const [selectedDistributionId, setSelectedDistributionId] = useState("");
  const [survivingCount, setSurvivingCount] = useState<number | "">("");
  const [conditionNotes, setConditionNotes] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const handleQuickAction = (key: string) => {
    setVisitType(key);
    // Reset survival check fields when switching types
    if (key !== "survival_check") {
      setSelectedDistributionId("");
      setSurvivingCount("");
      setConditionNotes("");
    }
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const selectedDistribution = demoDistributions.find(
    (d) => d.id === Number(selectedDistributionId)
  );

  const survivalRate =
    selectedDistribution && typeof survivingCount === "number" && survivingCount >= 0
      ? Math.round((survivingCount / selectedDistribution.quantity) * 100)
      : null;

  const survivalBadgeClass =
    survivalRate !== null
      ? survivalRate >= 75
        ? "bg-green-100 text-green-800"
        : survivalRate >= 60
          ? "bg-amber-100 text-amber-800"
          : "bg-red-100 text-red-800"
      : "";

  return (
    <div className="flex flex-col">
      <Header title="Field Data Collection" subtitle="Record field visits, distribute seedlings, report incidents" />

      <div className="flex flex-col gap-6 p-6">
        {/* Quick Action Cards - Mobile Friendly */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Object.entries(VISIT_TYPES).map(([key, config]) => {
            const Icon = visitTypeIcons[key] || ClipboardList;
            return (
              <Card
                key={key}
                className={`cursor-pointer hover:shadow-md hover:border-primary/30 transition-all ${
                  visitType === key ? "border-primary shadow-md ring-2 ring-primary/20" : ""
                }`}
                onClick={() => handleQuickAction(key)}
              >
                <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium">{config.label}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* New Visit Form */}
        <Card ref={formRef}>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              New Field Visit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="visitType">Visit Type</Label>
                <select
                  id="visitType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={visitType}
                  onChange={(e) => {
                    setVisitType(e.target.value);
                    if (e.target.value !== "survival_check") {
                      setSelectedDistributionId("");
                      setSurvivingCount("");
                      setConditionNotes("");
                    }
                  }}
                >
                  <option value="">Select type...</option>
                  {Object.entries(VISIT_TYPES).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="village">Village</Label>
                <select
                  id="village"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select village...</option>
                  <option value="1">Msolwa Ujamaa</option>
                  <option value="2">Katurukila</option>
                  <option value="3">Kidatu</option>
                  <option value="4">Ichonde</option>
                  <option value="5">Utengule</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>

              <div className="flex flex-col gap-2">
                <Label>GPS Location</Label>
                <Button type="button" variant="secondary" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Capture GPS
                </Button>
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe the visit, observations, recommendations..."
                  rows={3}
                />
              </div>

              {/* Survival Check Fields */}
              {visitType === "survival_check" && (
                <div className="sm:col-span-2 flex flex-col gap-4 rounded-lg border border-green-200 bg-green-50/50 p-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Survival Check Details
                  </h4>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="distribution">Distribution</Label>
                      <select
                        id="distribution"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={selectedDistributionId}
                        onChange={(e) => {
                          setSelectedDistributionId(e.target.value);
                          setSurvivingCount("");
                        }}
                      >
                        <option value="">Select distribution...</option>
                        {demoDistributions.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.farmerName} - {d.species} ({d.quantity} seedlings)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="survivingCount">Surviving Seedlings</Label>
                      <Input
                        id="survivingCount"
                        type="number"
                        min={0}
                        max={selectedDistribution?.quantity ?? undefined}
                        placeholder={
                          selectedDistribution
                            ? `Max: ${selectedDistribution.quantity}`
                            : "Select a distribution first"
                        }
                        value={survivingCount}
                        onChange={(e) =>
                          setSurvivingCount(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        disabled={!selectedDistribution}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Survival Rate</Label>
                      {survivalRate !== null ? (
                        <Badge className={`text-sm w-fit px-3 py-1.5 ${survivalBadgeClass}`}>
                          {survivalRate}%
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground pt-2">
                          Enter surviving count to calculate
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <Label htmlFor="conditionNotes">Condition Notes</Label>
                      <Textarea
                        id="conditionNotes"
                        placeholder="Soil quality, drought observations, pest damage..."
                        rows={2}
                        value={conditionNotes}
                        onChange={(e) => setConditionNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Photos</Label>
                <Button type="button" variant="secondary" className="gap-2">
                  <Camera className="h-4 w-4" />
                  Take Photo
                </Button>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-3">
                <div className="flex gap-3">
                  <Button type="submit" className="gap-2 flex-1">
                    <Send className="h-4 w-4" />
                    Submit Visit
                  </Button>
                  <Button type="button" variant="outline" className="gap-2">
                    <WifiOff className="h-4 w-4" />
                    Save Offline
                  </Button>
                </div>
                <Link
                  href="/field/queue"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors text-center"
                >
                  View offline queue
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Recent Visits */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recent Field Visits</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoFieldVisits.map((visit) => {
                  const Icon = visitTypeIcons[visit.visitType] || ClipboardList;
                  return (
                    <TableRow key={visit.id}>
                      <TableCell className="text-muted-foreground">
                        {formatDate(visit.visitDate)}
                      </TableCell>
                      <TableCell className="font-medium">{visit.userName}</TableCell>
                      <TableCell>{visit.villageName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                          <Icon className="h-3 w-3" />
                          {VISIT_TYPES[visit.visitType].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {visit.notes}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            visit.syncedAt
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }
                        >
                          {visit.syncedAt ? (
                            <><Wifi className="h-3 w-3 mr-1" />Synced</>
                          ) : (
                            <><WifiOff className="h-3 w-3 mr-1" />Pending</>
                          )}
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
