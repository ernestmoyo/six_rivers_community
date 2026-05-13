"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  MapPin,
  Database,
  Link2,
  UserCog,
  Loader2,
  RefreshCw,
  LogOut,
  Trash2,
} from "lucide-react";
import {
  OFFICER_ROLES,
  type Officer,
  emitOfficerChanged,
  getActiveOfficer,
  lock,
  removeOfficer,
  listOfficers,
} from "@/lib/officer";
import { drainQueue, getPendingCount } from "@/lib/offline-queue";
import { drainPhotoQueue } from "@/lib/photos";
import { APP_VERSION } from "@/lib/constants";

const teamMembers = [
  { name: "Mary Marandu", role: "manager", email: "Mary.Marandu@sixriversafrica.com", area: "All Areas" },
  { name: "Edna Sonda", role: "m_and_e", email: "edna.sonda@sixriversafrica.com", area: "M&E" },
  { name: "Lilian Mihambo", role: "field_officer", email: "Lilian.Mihambo@sixriversafrica.com", area: "Mbarali DC" },
  { name: "Justina Kizanye", role: "field_officer", email: "justina.kizanye@sixriversafrica.com", area: "Ifakara TC" },
  { name: "Irene Masonda", role: "field_officer", email: "irene.masonda@sixriversafrica.com", area: "Ifakara TC" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [allOfficers, setAllOfficers] = useState<Officer[]>([]);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    void refresh();
  }, []);

  async function refresh() {
    const [a, list, p] = await Promise.all([getActiveOfficer(), listOfficers(), getPendingCount()]);
    setOfficer(a);
    setAllOfficers(list);
    setPending(p);
  }

  async function forceSync() {
    setSyncing(true);
    try {
      const r = await drainQueue();
      const p = await drainPhotoQueue();
      await refresh();
      const total = r.succeeded + p.uploaded;
      if (total > 0) {
        toast.success(`Synced ${total} item${total === 1 ? "" : "s"}`, {
          description: `${r.succeeded} submission${r.succeeded === 1 ? "" : "s"}, ${p.uploaded} photo${p.uploaded === 1 ? "" : "s"}`,
        });
      } else {
        toast.info("Nothing to sync");
      }
    } finally {
      setSyncing(false);
    }
  }

  async function handleLock() {
    await lock();
    emitOfficerChanged();
    router.push("/unlock");
  }

  async function handleRemoveDevice() {
    if (!officer) return;
    if (!confirm(`Remove ${officer.name} from this device? Pending submissions will be lost.`)) return;
    await removeOfficer(officer.id);
    emitOfficerChanged();
    router.push("/onboard");
  }

  return (
    <div className="flex flex-col">
      <Header title="Settings" subtitle="Device, sync, and platform configuration" />

      <div className="flex flex-col gap-6 p-6 max-w-4xl">
        {/* ── This device ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              This device
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {officer ? (
              <>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{officer.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {OFFICER_ROLES[officer.role]}
                      {officer.phone ? ` · ${officer.phone}` : ""}
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    Active
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => router.push("/onboard")}>
                    Add officer
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={handleLock}>
                    <LogOut className="h-4 w-4" />
                    Lock
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-red-600 hover:text-red-700"
                    onClick={handleRemoveDevice}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove from device
                  </Button>
                </div>
                {allOfficers.length > 1 && (
                  <p className="text-xs text-muted-foreground">
                    {allOfficers.length} profile{allOfficers.length === 1 ? "" : "s"} on this device — switch from
                    the unlock screen.
                  </p>
                )}
              </>
            ) : (
              <Button onClick={() => router.push("/onboard")}>Set up profile</Button>
            )}
          </CardContent>
        </Card>

        {/* ── Sync ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending submissions</span>
              <Badge variant={pending > 0 ? "secondary" : "secondary"} className={pending > 0 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}>
                {pending}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Network</span>
              <Badge variant="secondary">
                {typeof navigator !== "undefined" && navigator.onLine ? "Online" : "Offline"}
              </Badge>
            </div>
            <Button variant="outline" size="sm" className="gap-2 w-fit" onClick={forceSync} disabled={syncing}>
              {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {syncing ? "Syncing..." : "Force sync now"}
            </Button>
          </CardContent>
        </Card>

        {/* ── Team Members (read-only directory) ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Programme team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {teamMembers.map((member) => (
                <div
                  key={member.email}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{member.name}</span>
                    <span className="text-xs text-muted-foreground">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {member.area}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        member.role === "manager"
                          ? "bg-blue-100 text-blue-800"
                          : member.role === "m_and_e"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                      }
                    >
                      {member.role === "manager"
                        ? "Manager"
                        : member.role === "m_and_e"
                          ? "M&E Specialist"
                          : "Field Officer"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Operational Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Operational areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <span className="text-sm font-medium">Ifakara Town Council</span>
                  <p className="text-xs text-muted-foreground">
                    Villages bordering Nyerere National Park
                  </p>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <span className="text-sm font-medium">Mbarali District Council</span>
                  <p className="text-xs text-muted-foreground">
                    Villages bordering Ruaha National Park
                  </p>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Landscape dashboard integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connected dashboard</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Linked
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">six-rivers-africa-dashboard.vercel.app</p>
              <Separator />
              <p className="text-xs text-muted-foreground">
                Buffer-zone vegetation health data is synced from the Landscape Health Intelligence
                Dashboard to correlate community activity with conservation outcomes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Database className="h-4 w-4" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">App version</span>
                <Badge variant="secondary">{APP_VERSION}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shapefiles</span>
                <Badge variant="secondary">Tanzania Admin Boundaries Loaded</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Weather API</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Open-Meteo Connected
                </Badge>
              </div>
              <Separator />
              <p className="text-[11px] text-muted-foreground">
                Six Rivers Africa · Powered by 7Square Inc.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
