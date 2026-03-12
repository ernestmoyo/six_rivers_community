"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MapPin, Users, Sprout, ArrowUpDown } from "lucide-react";
import { demoVillages } from "@/lib/demo-data";
import { useState } from "react";
import Link from "next/link";

export default function VillagesPage() {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);

  const filtered = demoVillages.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.wardName.toLowerCase().includes(search.toLowerCase()) ||
      v.districtName.toLowerCase().includes(search.toLowerCase());
    const matchesSector = !sectorFilter || v.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const totalPop = filtered.reduce((sum, v) => sum + v.population, 0);
  const totalFarmers = filtered.reduce((sum, v) => sum + v.farmerCount, 0);
  const totalSeedlings = filtered.reduce((sum, v) => sum + v.seedlingCount, 0);

  return (
    <div className="flex flex-col">
      <Header title="Villages" subtitle="Operational villages across Ifakara Town Council & Mbarali District Council" />

      <div className="flex flex-col gap-6 p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filtered.length}</p>
                <p className="text-xs text-muted-foreground">Operational Villages</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPop.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Population</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Sprout className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSeedlings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Seedlings Distributed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search villages, wards, districts..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={sectorFilter === null ? "default" : "secondary"}
              onClick={() => setSectorFilter(null)}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={sectorFilter === "ifakara" ? "default" : "secondary"}
              onClick={() => setSectorFilter("ifakara")}
            >
              Ifakara TC
            </Button>
            <Button
              size="sm"
              variant={sectorFilter === "mbarali" ? "default" : "secondary"}
              onClick={() => setSectorFilter("mbarali")}
            >
              Mbarali DC
            </Button>
          </div>
        </div>

        {/* Village Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Village</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead className="text-right">Population</TableHead>
                  <TableHead className="text-right">Farmers</TableHead>
                  <TableHead className="text-right">Seedlings</TableHead>
                  <TableHead className="text-right">To NP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((village) => (
                  <TableRow key={village.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link
                        href={`/villages/${village.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {village.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{village.wardName}</TableCell>
                    <TableCell className="text-muted-foreground">{village.districtName}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          village.sector === "ifakara"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {village.sector === "ifakara" ? "Ifakara TC" : "Mbarali DC"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{village.population.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{village.farmerCount}</TableCell>
                    <TableCell className="text-right">{village.seedlingCount.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {village.distanceToNpKm ? `${village.distanceToNpKm} km` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
