"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { KPICard } from "@/components/shared/kpi-card";
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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Briefcase,
  TrendingUp,
  Wallet,
  Users,
  AlertTriangle,
  CheckCircle2,
  Pencil,
  Coins,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { demoIGAGroups } from "@/lib/demo-data";
import { IGA_TYPES, IGA_GROUP_STATUS, IGA_STARTUP_CAPITAL_TSH } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { IncomeGeneratingGroup, IGAGroupStatus } from "@/types";

type SectorFilter = "all" | "ifakara" | "mbarali";
type StatusFilter = "all" | IGAGroupStatus;

function formatTSh(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return amount.toString();
}

export default function IGAPage() {
  const [groups, setGroups] = useState<IncomeGeneratingGroup[]>(demoIGAGroups);
  const [sectorFilter, setSectorFilter] = useState<SectorFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editing, setEditing] = useState<IncomeGeneratingGroup | null>(null);
  const [open, setOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ saving: boolean; message: string | null }>({
    saving: false,
    message: null,
  });

  const filtered = useMemo(
    () =>
      groups.filter(
        (g) =>
          (sectorFilter === "all" || g.sector === sectorFilter) &&
          (statusFilter === "all" || g.status === statusFilter)
      ),
    [groups, sectorFilter, statusFilter]
  );

  const activeCount = groups.filter((g) => g.status === "active").length;
  const strugglingCount = groups.filter((g) => g.status === "struggling").length;
  const totalRevenue = groups.reduce((s, g) => s + g.revenueTSh, 0);
  const totalExpense = groups.reduce((s, g) => s + g.expenseTSh, 0);
  const totalCapital = groups.reduce((s, g) => s + g.currentCapitalTSh, 0);
  const totalMembers = groups.reduce((s, g) => s + g.memberCount, 0);
  const netPosition = totalRevenue - totalExpense;

  function openFinancialUpdate(group: IncomeGeneratingGroup) {
    setEditing(group);
    setOpen(true);
  }

  async function handleFinancialSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.currentTarget);
    const currentCapital = Number(fd.get("currentCapital"));
    const revenue = Number(fd.get("revenue"));
    const expense = Number(fd.get("expense"));
    const status = fd.get("status") as IGAGroupStatus;
    const notes = (fd.get("notes") as string) || null;

    const updated: IncomeGeneratingGroup = {
      ...editing,
      currentCapitalTSh: currentCapital,
      revenueTSh: revenue,
      expenseTSh: expense,
      status,
      notes,
      lastFinancialUpdate: new Date().toISOString().split("T")[0],
    };

    // Optimistic update
    setGroups((prev) => prev.map((g) => (g.id === editing.id ? updated : g)));
    setEditing(null);
    setOpen(false);

    // Persist to Supabase
    setSaveStatus({ saving: true, message: null });
    try {
      const res = await fetch("/api/iga-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: updated.id,
          groupName: updated.name,
          currentCapitalTSh: updated.currentCapitalTSh,
          revenueTSh: updated.revenueTSh,
          expenseTSh: updated.expenseTSh,
          status: updated.status,
          notes: updated.notes,
          reportedBy: "Group Leader",
        }),
      });
      if (res.ok) {
        setSaveStatus({ saving: false, message: `Saved update for ${updated.name}` });
      } else {
        const data = await res.json();
        setSaveStatus({ saving: false, message: `Save failed: ${data.error ?? "unknown"}` });
      }
    } catch {
      setSaveStatus({ saving: false, message: "Save failed — offline or misconfigured" });
    } finally {
      setTimeout(() => setSaveStatus({ saving: false, message: null }), 5000);
    }
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Income Generating Activities"
        subtitle="Group-level businesses started with 3.5M TSh seed capital — Mbarali (Usangu) & Ifakara TC (Msolwa)"
      />

      <div className="flex flex-col gap-6 p-6">
        {/* Save status */}
        {(saveStatus.saving || saveStatus.message) && (
          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
              saveStatus.saving
                ? "bg-blue-50 text-blue-700"
                : saveStatus.message?.startsWith("Saved")
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
            }`}
          >
            {saveStatus.saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saveStatus.message?.startsWith("Saved") ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {saveStatus.saving ? "Saving update to database..." : saveStatus.message}
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Active Groups"
            value={`${activeCount} / ${groups.length}`}
            icon={CheckCircle2}
            subtitle={`${strugglingCount} struggling, ${groups.length - activeCount - strugglingCount} inactive`}
            iconClassName="bg-green-100 text-green-600"
          />
          <KPICard
            title="Total Capital"
            value={`${formatTSh(totalCapital)} TSh`}
            icon={Wallet}
            subtitle={`Seeded with ${formatTSh(IGA_STARTUP_CAPITAL_TSH * groups.length)} TSh total`}
            iconClassName="bg-blue-100 text-blue-600"
          />
          <KPICard
            title="Total Revenue"
            value={`${formatTSh(totalRevenue)} TSh`}
            icon={TrendingUp}
            trend={netPosition > 0 ? "up" : "down"}
            trendValue={`Net: ${netPosition > 0 ? "+" : ""}${formatTSh(netPosition)} TSh`}
            iconClassName="bg-emerald-100 text-emerald-600"
          />
          <KPICard
            title="Group Members"
            value={totalMembers}
            icon={Users}
            subtitle={`Across ${groups.length} groups`}
            iconClassName="bg-amber-100 text-amber-600"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1.5">
            <Button
              variant={sectorFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSectorFilter("all")}
            >
              All Sectors
            </Button>
            <Button
              variant={sectorFilter === "ifakara" ? "default" : "outline"}
              size="sm"
              onClick={() => setSectorFilter("ifakara")}
            >
              Msolwa (Ifakara TC)
            </Button>
            <Button
              variant={sectorFilter === "mbarali" ? "default" : "outline"}
              size="sm"
              onClick={() => setSectorFilter("mbarali")}
            >
              Usangu (Mbarali DC)
            </Button>
          </div>
          <div className="ml-auto flex gap-1.5">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All Status
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              size="sm"
              className={statusFilter === "active" ? "" : "text-green-700 border-green-300"}
              onClick={() => setStatusFilter("active")}
            >
              Active ({activeCount})
            </Button>
            <Button
              variant={statusFilter === "struggling" ? "default" : "outline"}
              size="sm"
              className={statusFilter === "struggling" ? "" : "text-amber-700 border-amber-300"}
              onClick={() => setStatusFilter("struggling")}
            >
              <AlertTriangle className="mr-1 h-3.5 w-3.5" />
              Struggling ({strugglingCount})
            </Button>
            <Button
              variant={statusFilter === "inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("inactive")}
            >
              Inactive ({groups.length - activeCount - strugglingCount})
            </Button>
          </div>
        </div>

        {/* Groups table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              IGA Groups ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead className="text-right">Capital</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Expense</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((g) => {
                  const net = g.revenueTSh - g.expenseTSh;
                  const statusConfig = IGA_GROUP_STATUS[g.status];
                  const typeConfig = IGA_TYPES[g.igaType];
                  return (
                    <TableRow key={g.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{g.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Formed {formatDate(g.formedDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{g.villageName}</span>
                          <span className="text-xs text-muted-foreground">{g.ward} ward</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: `${typeConfig.color}20`,
                            color: typeConfig.color,
                          }}
                        >
                          {typeConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{g.memberCount}</span>
                          <span className="text-xs text-muted-foreground">
                            {g.maleCount}M / {g.femaleCount}F
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatTSh(g.currentCapitalTSh)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-emerald-700">
                        {formatTSh(g.revenueTSh)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">
                        {formatTSh(g.expenseTSh)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">
                        <span className={net >= 0 ? "text-emerald-700" : "text-red-600"}>
                          {net >= 0 ? "+" : ""}
                          {formatTSh(net)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: statusConfig.bgColor,
                            color: statusConfig.color,
                          }}
                        >
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1"
                          onClick={() => openFinancialUpdate(g)}
                        >
                          <Pencil className="h-3 w-3" />
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                      No IGA groups match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Narrative card */}
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <Coins className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="text-foreground font-medium">About IGA (Income Generating Activities)</p>
                <p>
                  Each group received an average startup capital of <strong>3,500,000 TSh</strong>. Mbarali (Usangu) groups focus on pig keeping, sunflower oil, and value addition. Ifakara (Msolwa) has a wider mix: poultry, pig farming, soap making, soft drinks, bicycle services, and milk processing. Click <em>Update</em> on any group to record the latest capital, revenue, and expenses — use this page to spot struggling groups and prioritise field support.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial update dialog */}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Financial Status</DialogTitle>
            <DialogDescription>
              {editing ? `${editing.name} — ${editing.villageName}` : ""}
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <form onSubmit={handleFinancialSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="currentCapital">Current Capital (TSh)</Label>
                <Input
                  id="currentCapital"
                  name="currentCapital"
                  type="number"
                  min={0}
                  defaultValue={editing.currentCapitalTSh}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Started with {IGA_STARTUP_CAPITAL_TSH.toLocaleString()} TSh
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="revenue">Total Revenue This Round (TSh)</Label>
                <Input
                  id="revenue"
                  name="revenue"
                  type="number"
                  min={0}
                  defaultValue={editing.revenueTSh}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expense">Total Expenses (TSh)</Label>
                <Input
                  id="expense"
                  name="expense"
                  type="number"
                  min={0}
                  defaultValue={editing.expenseTSh}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={editing.status}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  required
                >
                  <option value="active">Active</option>
                  <option value="struggling">Struggling</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  defaultValue={editing.notes ?? ""}
                  placeholder="Context on current round, risks, asks..."
                />
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                <Button type="submit">Save Update</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
