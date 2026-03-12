"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TreePine, Droplets, MapPin, User, ArrowLeft, Plus } from "lucide-react";
import { demoNurseries, demoNurseryBatches } from "@/lib/demo-data";
import { SEEDLING_SPECIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { NurseryBatch } from "@/types";
import Link from "next/link";

const statusColors: Record<NurseryBatch["status"], string> = {
  germinating: "bg-amber-100 text-amber-800",
  growing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  distributed: "bg-gray-100 text-gray-600",
  failed: "bg-red-100 text-red-800",
};

export default function NurseryDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const nursery = demoNurseries.find((n) => n.id === id);

  const [batches, setBatches] = useState<NurseryBatch[]>(
    demoNurseryBatches.filter((b) => b.nurseryId === id)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSpecies, setNewSpecies] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newPlantingDate, setNewPlantingDate] = useState("");

  if (!nursery) {
    return (
      <div className="flex flex-col">
        <Header title="Nursery Not Found" subtitle="The requested nursery does not exist" />
        <div className="flex flex-col items-center gap-4 p-12">
          <TreePine className="h-16 w-16 text-muted-foreground/30" />
          <p className="text-muted-foreground">No nursery found with ID {id}.</p>
          <Link href="/nurseries">
            <Button variant="outline" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back to Nurseries
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const distributionPct = nursery.totalProduced
    ? Math.round((nursery.totalDistributed / nursery.totalProduced) * 100)
    : 0;

  const handleAddBatch = () => {
    if (!newSpecies || !newQuantity || !newPlantingDate) return;
    const newBatch: NurseryBatch = {
      id: Math.max(0, ...batches.map((b) => b.id)) + 1,
      nurseryId: nursery.id,
      species: newSpecies,
      quantityPlanted: Number(newQuantity),
      plantingDate: newPlantingDate,
      germinationCount: null,
      readyDate: null,
      status: "germinating",
    };
    setBatches((prev) => [...prev, newBatch]);
    setNewSpecies("");
    setNewQuantity("");
    setNewPlantingDate("");
    setDialogOpen(false);
  };

  const handleStatusChange = (batchId: number, newStatus: NurseryBatch["status"]) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: newStatus } : b))
    );
  };

  const handleGerminationChange = (batchId: number, count: number) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, germinationCount: count } : b))
    );
  };

  return (
    <div className="flex flex-col">
      <Header title={nursery.name} subtitle={`Nursery management and batch tracking`} />

      <div className="flex flex-col gap-6 p-6">
        <Link href="/nurseries">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to Nurseries
          </Button>
        </Link>

        {/* Nursery Info */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Village</p>
                  <p className="text-sm font-medium">{nursery.villageName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Droplets className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Water Source</p>
                  <p className="text-sm font-medium">{nursery.waterSource || "Unknown"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Managed By</p>
                  <p className="text-sm font-medium">{nursery.managedBy || "Unassigned"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <TreePine className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Capacity</p>
                  <p className="text-sm font-medium">
                    {nursery.capacitySeedlings?.toLocaleString() || "N/A"} seedlings
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production vs Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Production vs Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-2xl font-bold">{nursery.totalProduced.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Produced</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-2xl font-bold">{nursery.totalDistributed.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Distributed</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Distribution Rate</span>
                <span className="font-medium">{distributionPct}%</span>
              </div>
              <Progress value={distributionPct} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Batches */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            Batches ({batches.length})
          </h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New Batch</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Batch</DialogTitle>
                <DialogDescription>
                  Create a new seedling batch for {nursery.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="species">Species</Label>
                  <select
                    id="species"
                    value={newSpecies}
                    onChange={(e) => setNewSpecies(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select species...</option>
                    {SEEDLING_SPECIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="quantity">Quantity Planted</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="e.g. 500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="plantingDate">Planting Date</Label>
                  <Input
                    id="plantingDate"
                    type="date"
                    value={newPlantingDate}
                    onChange={(e) => setNewPlantingDate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
                <Button onClick={handleAddBatch}>Add Batch</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Species</TableHead>
                  <TableHead className="text-right">Qty Planted</TableHead>
                  <TableHead>Planting Date</TableHead>
                  <TableHead className="text-right">Germination</TableHead>
                  <TableHead>Ready Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Update Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.species}</TableCell>
                    <TableCell className="text-right">{batch.quantityPlanted}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(batch.plantingDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      {batch.status === "germinating" ? (
                        <Input
                          type="number"
                          min={0}
                          max={batch.quantityPlanted}
                          value={batch.germinationCount ?? ""}
                          onChange={(e) =>
                            handleGerminationChange(batch.id, Number(e.target.value))
                          }
                          className="h-8 w-20 ml-auto"
                          placeholder="Count"
                        />
                      ) : (
                        batch.germinationCount ?? "-"
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {batch.readyDate ? formatDate(batch.readyDate) : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[batch.status]}>
                        {batch.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <select
                        value={batch.status}
                        onChange={(e) =>
                          handleStatusChange(
                            batch.id,
                            e.target.value as NurseryBatch["status"]
                          )
                        }
                        className="flex h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                      >
                        <option value="germinating">Germinating</option>
                        <option value="growing">Growing</option>
                        <option value="ready">Ready</option>
                        <option value="distributed">Distributed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
                {batches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No batches recorded for this nursery yet.
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
