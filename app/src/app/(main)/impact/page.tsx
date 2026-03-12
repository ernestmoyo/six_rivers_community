"use client";

import { Header } from "@/components/layout/header";
import { KPICard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Sprout,
  Heart,
  MapPin,
  TreePine,
  Wheat,
  Download,
  FileText,
  Calendar,
  BarChart3,
} from "lucide-react";
import { demoKPIs, survivalBySpecies, monthlyDistributions } from "@/lib/demo-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

const quarterlyData = [
  { quarter: "Q3 2025", farmers: 35, seedlings: 400, survival: 65, visits: 18 },
  { quarter: "Q4 2025", farmers: 85, seedlings: 1400, survival: 62, visits: 42 },
  { quarter: "Q1 2026", farmers: 145, seedlings: 2400, survival: 58, visits: 65 },
];

export default function ImpactPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Impact Dashboard"
        subtitle="Track programme outcomes and generate donor reports"
      />

      <div className="flex flex-col gap-6 p-6">
        {/* Export Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Programme Impact Summary</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button size="sm" className="gap-1.5">
              <FileText className="h-4 w-4" />
              Generate Quarterly Report
            </Button>
          </div>
        </div>

        {/* Impact KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Farmers Engaged"
            value={demoKPIs.totalFarmers}
            icon={Users}
            trend="up"
            trendValue="+60 this quarter"
            iconClassName="bg-blue-100 text-blue-600"
          />
          <KPICard
            title="Seedlings Distributed"
            value={demoKPIs.totalSeedlingsDistributed.toLocaleString()}
            icon={Sprout}
            trend="up"
            trendValue="+1,000 this quarter"
            iconClassName="bg-green-100 text-green-600"
          />
          <KPICard
            title="Average Survival"
            value={`${demoKPIs.averageSurvivalRate}%`}
            icon={Heart}
            trend="down"
            trendValue="-4% vs Q4 (dry season losses)"
            iconClassName="bg-rose-100 text-rose-600"
          />
          <KPICard
            title="Agroforestry Area"
            value={`${demoKPIs.totalAgroforestryHectares} ha`}
            icon={TreePine}
            trend="up"
            trendValue="+4.5 ha this quarter"
          />
        </div>

        {/* Quarterly Trends */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Farmer Engagement & Seedling Distribution Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar yAxisId="right" dataKey="seedlings" name="Seedlings" fill="hsl(142, 71%, 55%)" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="farmers" name="Farmers" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Survival Rate Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                    <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="survival"
                      name="Survival %"
                      stroke="hsl(350, 80%, 50%)"
                      fill="hsl(350, 80%, 90%)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donor Report Preview */}
        <Card className="border-2 border-dashed border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Quarterly Donor Report Preview - Q1 2026
              </CardTitle>
              <Badge variant="secondary">Draft</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-semibold mb-2">Six Rivers Africa - Community Programme Report</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Reporting Period: January - March 2026
              </p>
              <Separator className="my-3" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Farmers Engaged</p>
                  <p className="text-2xl font-bold text-primary">145</p>
                  <p className="text-xs text-muted-foreground">+71% vs Q4 2025</p>
                </div>
                <div>
                  <p className="font-medium">Seedlings Distributed</p>
                  <p className="text-2xl font-bold text-primary">2,400</p>
                  <p className="text-xs text-muted-foreground">Including cocoa, chilli & horticulture crops</p>
                </div>
                <div>
                  <p className="font-medium">Survival Rate</p>
                  <p className="text-2xl font-bold text-amber-600">58%</p>
                  <p className="text-xs text-muted-foreground">-4% vs Q4 (dry season planting losses)</p>
                </div>
                <div>
                  <p className="font-medium">Operational Villages</p>
                  <p className="text-2xl font-bold text-primary">21</p>
                  <p className="text-xs text-muted-foreground">Ifakara TC + Mbarali DC</p>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="text-sm">
                <p className="font-medium mb-1">Key Highlights</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>18 active chilli fences — 72% elephant deterrence success rate</li>
                  <li>Cocoa agroforestry in year 3 for pilot farmers (55% survival — dry season losses)</li>
                  <li>4 shambachungu groups active with 53 total members</li>
                  <li>~100 horticulture farmers trained on short-cycle crops (onions, tomatoes, cabbage)</li>
                  <li>Dry season planting losses identified — replanting strategy for April rains in progress</li>
                  <li>Many seedlings still in nurseries — distribution timed to rainy season</li>
                  <li>15 field visits conducted, 100% synced to platform</li>
                </ul>
              </div>
            </div>
            <Button className="self-end gap-1.5">
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
