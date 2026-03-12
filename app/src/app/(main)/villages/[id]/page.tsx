"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/shared/kpi-card";
import { Users, Sprout, Heart, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoVillages, demoFarmers, demoDistributions } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function VillageDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const village = demoVillages.find((v) => v.id === id) || demoVillages[0];
  const farmers = demoFarmers.filter((f) => f.villageId === id);
  const distributions = demoDistributions.filter((d) =>
    farmers.some((f) => f.id === d.farmerId)
  );

  return (
    <div className="flex flex-col">
      <Header
        title={village.name}
        subtitle={`${village.wardName} Ward, ${village.districtName} District, ${village.regionName}`}
      />

      <div className="flex flex-col gap-6 p-6">
        <Link href="/villages">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to Villages
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={
              village.sector === "psolo"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }
          >
            {village.sector === "psolo" ? "Psolo Sector" : "Usangu Basin"}
          </Badge>
          {village.distanceToNpKm && (
            <Badge variant="secondary">
              {village.distanceToNpKm} km to NP boundary
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Population"
            value={village.population.toLocaleString()}
            icon={Users}
            iconClassName="bg-blue-100 text-blue-600"
          />
          <KPICard
            title="Farmers"
            value={village.farmerCount}
            icon={Users}
            iconClassName="bg-green-100 text-green-600"
          />
          <KPICard
            title="Seedlings"
            value={village.seedlingCount.toLocaleString()}
            icon={Sprout}
          />
          <KPICard
            title="Location"
            value={village.distanceToNpKm ? `${village.distanceToNpKm} km` : "N/A"}
            subtitle="Distance to NP"
            icon={MapPin}
            iconClassName="bg-amber-100 text-amber-600"
          />
        </div>

        {/* Registered Farmers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Registered Farmers ({farmers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {farmers.length > 0 ? (
              <div className="flex flex-col gap-2">
                {farmers.map((farmer) => (
                  <div key={farmer.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <Link href={`/farming/farmers/${farmer.id}`} className="text-sm font-medium text-primary hover:underline">
                        {farmer.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {farmer.farmAreaHectares} ha | Registered {formatDate(farmer.registeredAt)}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{farmer.phone || "No phone"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No farmers registered yet in this village.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Distributions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Recent Distributions ({distributions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {distributions.length > 0 ? (
              <div className="flex flex-col gap-2">
                {distributions.map((dist) => (
                  <div key={dist.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <span className="text-sm font-medium">{dist.farmerName}</span>
                      <p className="text-xs text-muted-foreground">
                        {dist.quantity} {dist.species} seedlings | {formatDate(dist.distributionDate)}
                      </p>
                    </div>
                    {dist.survivalRate !== null && (
                      <Badge
                        variant="secondary"
                        className={
                          dist.survivalRate >= 75
                            ? "bg-green-100 text-green-800"
                            : dist.survivalRate >= 60
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {dist.survivalRate}% survival
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No distributions recorded for this village.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
