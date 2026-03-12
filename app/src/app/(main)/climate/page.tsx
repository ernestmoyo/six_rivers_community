"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/shared/kpi-card";
import {
  Cloud,
  Droplets,
  Thermometer,
  AlertTriangle,
  Sun,
  CloudRain,
} from "lucide-react";
import { demoWeatherData } from "@/lib/demo-data";
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
} from "recharts";

const monthlyRainfall = [
  { month: "Oct", ifakara: 45, mbarali: 32 },
  { month: "Nov", ifakara: 120, mbarali: 85 },
  { month: "Dec", ifakara: 180, mbarali: 140 },
  { month: "Jan", ifakara: 210, mbarali: 95 },
  { month: "Feb", ifakara: 165, mbarali: 60 },
  { month: "Mar", ifakara: 95, mbarali: 28 },
];

const temperatureTrend = [
  { month: "Oct", max: 30.5, min: 19.8 },
  { month: "Nov", max: 31.2, min: 20.5 },
  { month: "Dec", max: 30.8, min: 21.2 },
  { month: "Jan", max: 31.5, min: 22.0 },
  { month: "Feb", max: 32.8, min: 22.5 },
  { month: "Mar", max: 33.2, min: 22.8 },
];

export default function ClimatePage() {
  const droughtWards = demoWeatherData.filter((w) => w.droughtIndex! > 0.6);
  const avgRainfall =
    demoWeatherData.reduce((sum, w) => sum + (w.rainfallMm || 0), 0) / demoWeatherData.length;

  return (
    <div className="flex flex-col">
      <Header
        title="Micro-Climate Monitor"
        subtitle="Weather conditions and drought risk across operational wards"
      />

      <div className="flex flex-col gap-6 p-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Avg Rainfall Today"
            value={`${avgRainfall.toFixed(1)} mm`}
            icon={Droplets}
            iconClassName="bg-blue-100 text-blue-600"
          />
          <KPICard
            title="Drought Risk Wards"
            value={droughtWards.length}
            icon={AlertTriangle}
            subtitle={droughtWards.map((w) => w.wardName).join(", ")}
            iconClassName="bg-red-100 text-red-600"
          />
          <KPICard
            title="Max Temperature"
            value={`${Math.max(...demoWeatherData.map((w) => w.tempMaxC || 0))}°C`}
            icon={Thermometer}
            iconClassName="bg-orange-100 text-orange-600"
          />
          <KPICard
            title="Wards Monitored"
            value={demoWeatherData.length}
            icon={Cloud}
          />
        </div>

        {/* Ward-level weather cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {demoWeatherData.map((w) => {
            const isHighRisk = w.droughtIndex! > 0.6;
            const isModerate = w.droughtIndex! > 0.4;
            return (
              <Card key={w.wardId} className={isHighRisk ? "border-red-200 bg-red-50/30" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">{w.wardName} Ward</CardTitle>
                    <Badge
                      variant="secondary"
                      className={
                        isHighRisk
                          ? "bg-red-100 text-red-800"
                          : isModerate
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {isHighRisk ? "Drought Risk" : isModerate ? "Moderate" : "Normal"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <CloudRain className="h-4 w-4" />
                      </div>
                      <p className="text-lg font-bold">{w.rainfallMm}</p>
                      <p className="text-[10px] text-muted-foreground">mm rain</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                        <Sun className="h-4 w-4" />
                      </div>
                      <p className="text-lg font-bold">{w.tempMaxC}°</p>
                      <p className="text-[10px] text-muted-foreground">max temp</p>
                    </div>
                    <div>
                      <div className={`flex items-center justify-center gap-1 mb-1 ${w.droughtIndex! > 0.6 ? "text-red-500" : w.droughtIndex! > 0.4 ? "text-amber-500" : "text-green-500"}`}>
                        <Droplets className="h-4 w-4" />
                      </div>
                      <p className="text-lg font-bold">{w.droughtIndex!.toFixed(2)}</p>
                      <p className="text-[10px] text-muted-foreground">drought idx</p>
                    </div>
                  </div>
                  {isHighRisk && (
                    <div className="mt-3 rounded-md bg-red-100 p-2 text-xs text-red-800">
                      <AlertTriangle className="inline h-3 w-3 mr-1" />
                      Recommend delaying seedling distribution in this ward
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Monthly Rainfall: Ifakara TC vs Mbarali DC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRainfall}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="ifakara" name="Ifakara TC" fill="hsl(142, 71%, 55%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="mbarali" name="Mbarali DC" fill="hsl(36, 100%, 55%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Temperature Trend (°C)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperatureTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis domain={[15, 40]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="max"
                      name="Max Temp"
                      stroke="hsl(15, 90%, 55%)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="min"
                      name="Min Temp"
                      stroke="hsl(217, 91%, 60%)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seasonal Planting Guidance */}
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-600" />
              Seasonal Planting Guidance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-start gap-2">
                <Droplets className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <p><span className="font-medium">Recommended planting windows:</span> April–May (long rains) and November–December (short rains)</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p><span className="font-medium">Avoid dry season planting (June–September)</span> — seedlings planted during 2025 dry season experienced significant mortality, especially cocoa in Mbarali District</p>
              </div>
              <div className="flex items-start gap-2">
                <Cloud className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <p><span className="font-medium">Current status:</span> Nursery seedlings being held for April rains before distribution. Replanting of failed dry-season batches planned.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
