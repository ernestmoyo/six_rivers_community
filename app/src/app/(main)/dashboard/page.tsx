"use client";

import { Header } from "@/components/layout/header";
import { KPICard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Sprout,
  TreePine,
  MapPin,
  Beef,
  ClipboardList,
  Heart,
  Wheat,
  AlertTriangle,
  CheckCircle,
  Package,
} from "lucide-react";
import {
  demoKPIs,
  recentActivity,
  survivalBySpecies,
  monthlyDistributions,
  demoWeatherData,
  demoVillages,
} from "@/lib/demo-data";
import { SEVERITY_LEVELS } from "@/lib/constants";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const iconMap: Record<string, React.ElementType> = {
  Sprout,
  Package,
  AlertTriangle,
  CheckCircle,
  TreePine,
  Users,
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Dashboard"
        subtitle="Six Rivers Community Intelligence Overview"
      />

      <div className="flex flex-col gap-6 p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Farmers Engaged"
            value={demoKPIs.totalFarmers.toLocaleString()}
            icon={Users}
            trend="up"
            trendValue="+24 this month"
            iconClassName="bg-blue-100 text-blue-600"
          />
          <KPICard
            title="Seedlings Distributed"
            value={demoKPIs.totalSeedlingsDistributed.toLocaleString()}
            icon={Sprout}
            trend="up"
            trendValue="+1,150 this month"
            iconClassName="bg-green-100 text-green-600"
          />
          <KPICard
            title="Avg Survival Rate"
            value={`${demoKPIs.averageSurvivalRate}%`}
            icon={Heart}
            trend="down"
            trendValue="-2.1% vs last month"
            iconClassName="bg-rose-100 text-rose-600"
          />
          <KPICard
            title="Operational Villages"
            value={demoVillages.length}
            icon={MapPin}
            trend="flat"
            trendValue="No change"
            iconClassName="bg-amber-100 text-amber-600"
          />
        </div>

        {/* Second row KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Agroforestry Area"
            value={`${demoKPIs.totalAgroforestryHectares} ha`}
            icon={TreePine}
            trend="up"
            trendValue="+8.5 ha this quarter"
          />
          <KPICard
            title="Active Crop Cycles"
            value={demoKPIs.activeCropCycles}
            icon={Wheat}
            subtitle="3 expected harvests this week"
          />
          <KPICard
            title="Cattle Incidents"
            value={demoKPIs.cattleIncidentsThisMonth}
            icon={Beef}
            trend="up"
            trendValue="+3 vs last month"
            iconClassName="bg-red-100 text-red-600"
          />
          <KPICard
            title="Field Visits"
            value={demoKPIs.fieldVisitsThisMonth}
            icon={ClipboardList}
            trend="up"
            trendValue="+12 vs last month"
            iconClassName="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Seedling Distribution Trend */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Monthly Seedling Distributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyDistributions}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" name="Seedlings" radius={[4, 4, 0, 0]}>
                      {monthlyDistributions.map((_, index) => (
                        <Cell
                          key={index}
                          fill={
                            index === monthlyDistributions.length - 1
                              ? "hsl(142, 71%, 35%)"
                              : "hsl(142, 71%, 65%)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Survival by Species */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Survival Rate by Species
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {survivalBySpecies.map((item) => (
                  <div key={item.species} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.species}</span>
                      <span
                        className={
                          item.rate >= 75
                            ? "text-green-600 font-semibold"
                            : item.rate >= 60
                            ? "text-amber-600 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        {item.rate}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.rate >= 75
                            ? "bg-green-500"
                            : item.rate >= 60
                            ? "bg-amber-500"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Weather */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {recentActivity.map((item, i) => {
                  const Icon = iconMap[item.icon] || Sprout;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg border p-3"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm">{item.message}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Weather Overview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Climate Conditions by Ward
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {demoWeatherData.map((w) => (
                  <div
                    key={w.wardId}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{w.wardName}</span>
                      <span className="text-xs text-muted-foreground">
                        {w.rainfallMm} mm rain | {w.tempMaxC}&deg;C
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        w.droughtIndex! > 0.6
                          ? "bg-red-100 text-red-700"
                          : w.droughtIndex! > 0.4
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {w.droughtIndex! > 0.6
                        ? "Drought Risk"
                        : w.droughtIndex! > 0.4
                        ? "Moderate"
                        : "Normal"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
