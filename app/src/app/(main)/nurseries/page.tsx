"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TreePine, Plus, Droplets, MapPin } from "lucide-react";
import { demoNurseries, demoNurseryBatches } from "@/lib/demo-data";
import Link from "next/link";

export default function NurseriesPage() {
  const totalProduced = demoNurseries.reduce((sum, n) => sum + n.totalProduced, 0);
  const totalDistributed = demoNurseries.reduce((sum, n) => sum + n.totalDistributed, 0);

  return (
    <div className="flex flex-col">
      <Header title="Tree Nurseries" subtitle="Nursery management and seedling production tracking" />

      <div className="flex flex-col gap-6 p-6">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <TreePine className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{demoNurseries.length}</p>
                <p className="text-xs text-muted-foreground">Active Nurseries</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <TreePine className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalProduced.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Seedlings Produced</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <TreePine className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDistributed.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Seedlings Distributed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nursery Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {demoNurseries.map((nursery) => {
            const batches = demoNurseryBatches.filter((b) => b.nurseryId === nursery.id);
            const utilizationPct = nursery.capacitySeedlings
              ? Math.round((nursery.totalProduced / nursery.capacitySeedlings) * 100)
              : 0;
            const distributionPct = nursery.totalProduced
              ? Math.round((nursery.totalDistributed / nursery.totalProduced) * 100)
              : 0;

            return (
              <Card key={nursery.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">
                        <Link href={`/nurseries/${nursery.id}`} className="hover:text-primary">
                          {nursery.name}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{nursery.villageName}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      <Droplets className="h-3 w-3 mr-1" />
                      {nursery.waterSource}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-lg bg-muted p-2">
                      <p className="text-lg font-bold">{nursery.totalProduced.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Produced</p>
                    </div>
                    <div className="rounded-lg bg-muted p-2">
                      <p className="text-lg font-bold">{nursery.totalDistributed.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Distributed</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Distribution Rate</span>
                      <span className="font-medium">{distributionPct}%</span>
                    </div>
                    <Progress value={distributionPct} className="h-2" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium">Active Batches</span>
                    <div className="flex flex-wrap gap-1">
                      {batches.map((batch) => (
                        <Badge
                          key={batch.id}
                          variant="secondary"
                          className={`text-[10px] ${
                            batch.status === "ready"
                              ? "bg-green-100 text-green-800"
                              : batch.status === "growing"
                              ? "bg-blue-100 text-blue-800"
                              : batch.status === "germinating"
                              ? "bg-amber-100 text-amber-800"
                              : batch.status === "distributed"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {batch.species} ({batch.status})
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Managed by {nursery.managedBy}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
