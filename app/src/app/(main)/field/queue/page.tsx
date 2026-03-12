"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
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
  Wifi,
  WifiOff,
  RefreshCw,
  ArrowLeft,
  Sprout,
  TreePine,
  Users,
  Package,
  AlertTriangle,
  ClipboardList,
  CheckCircle,
} from "lucide-react";
import { demoFieldVisits } from "@/lib/demo-data";
import { VISIT_TYPES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { FieldVisit } from "@/types";
import Link from "next/link";

const visitTypeIcons: Record<string, React.ElementType> = {
  farm_check: Sprout,
  nursery_check: TreePine,
  community_meeting: Users,
  seedling_distribution: Package,
  incident_report: AlertTriangle,
  survival_check: CheckCircle,
};

const pendingVisits: FieldVisit[] = [
  {
    id: 100,
    userId: 1,
    userName: "Justina Kizanye",
    villageId: 7,
    villageName: "Mahango",
    visitDate: "2026-03-11",
    visitType: "farm_check",
    locationLat: -7.81,
    locationLng: 36.97,
    notes: "Checked moringa growth at 3 farms near river. Watering needed.",
    photos: [],
    syncedAt: null,
  },
  {
    id: 101,
    userId: 3,
    userName: "Lilian Mihambo",
    villageId: 6,
    villageName: "Igomelo",
    visitDate: "2026-03-12",
    visitType: "incident_report",
    locationLat: -8.73,
    locationLng: 34.07,
    notes: "Cattle observed near restoration plot. Moderate herd ~60 head.",
    photos: [],
    syncedAt: null,
  },
];

export default function FieldQueuePage() {
  const [visits, setVisits] = useState<FieldVisit[]>([
    ...pendingVisits,
    ...demoFieldVisits,
  ]);

  const handleSync = (visitId: number) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId
          ? { ...v, syncedAt: new Date().toISOString() }
          : v
      )
    );
  };

  const handleSyncAll = () => {
    setVisits((prev) =>
      prev.map((v) =>
        v.syncedAt === null
          ? { ...v, syncedAt: new Date().toISOString() }
          : v
      )
    );
  };

  const pendingCount = visits.filter((v) => v.syncedAt === null).length;
  const syncedCount = visits.filter((v) => v.syncedAt !== null).length;

  return (
    <div className="flex flex-col">
      <Header
        title="Offline Queue"
        subtitle="Manage pending field visit submissions"
      />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <Link href="/field/visit">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back to Field Collection
            </Button>
          </Link>
          {pendingCount > 0 && (
            <Button size="sm" className="gap-1.5" onClick={handleSyncAll}>
              <RefreshCw className="h-4 w-4" />
              Sync All ({pendingCount})
            </Button>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <WifiOff className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending Sync</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Wifi className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{syncedCount}</p>
                <p className="text-xs text-muted-foreground">Synced</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Queue Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit) => {
                  const Icon = visitTypeIcons[visit.visitType] || ClipboardList;
                  const isPending = visit.syncedAt === null;
                  return (
                    <TableRow key={visit.id}>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                          <Icon className="h-3 w-3" />
                          {VISIT_TYPES[visit.visitType].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{visit.villageName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(visit.visitDate)}
                      </TableCell>
                      <TableCell>{visit.userName}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {visit.notes}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            isPending
                              ? "bg-amber-100 text-amber-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {isPending ? (
                            <>
                              <WifiOff className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          ) : (
                            <>
                              <Wifi className="h-3 w-3 mr-1" />
                              Synced
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {isPending ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-xs"
                            onClick={() => handleSync(visit.id)}
                          >
                            <RefreshCw className="h-3 w-3" />
                            Sync
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">--</span>
                        )}
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
