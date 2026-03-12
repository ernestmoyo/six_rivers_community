"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Download, FileSpreadsheet, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

interface DataCategory {
  key: string;
  label: string;
  estimatedRows: number;
}

const DATA_CATEGORIES: DataCategory[] = [
  { key: "farmers", label: "Farmers", estimatedRows: 342 },
  { key: "distributions", label: "Distributions", estimatedRows: 1240 },
  { key: "survival_checks", label: "Survival Checks", estimatedRows: 486 },
  { key: "crop_cycles", label: "Crop Cycles", estimatedRows: 186 },
  { key: "agroforestry", label: "Agroforestry", estimatedRows: 95 },
  { key: "nurseries", label: "Nurseries", estimatedRows: 38 },
  { key: "cattle_incidents", label: "Cattle Incidents", estimatedRows: 52 },
  { key: "field_visits", label: "Field Visits", estimatedRows: 198 },
  { key: "climate", label: "Climate", estimatedRows: 720 },
];

const QUARTERS = ["Q1 2026", "Q4 2025", "Q3 2025"];
const YEARS = ["2026", "2025"];

export default function ImpactExportPage() {
  const [selectedQuarter, setSelectedQuarter] = useState("Q1 2026");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [checkedCategories, setCheckedCategories] = useState<Set<string>>(
    new Set(DATA_CATEGORIES.map((c) => c.key))
  );

  const toggleCategory = (key: string) => {
    setCheckedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (checkedCategories.size === DATA_CATEGORIES.length) {
      setCheckedCategories(new Set());
    } else {
      setCheckedCategories(new Set(DATA_CATEGORIES.map((c) => c.key)));
    }
  };

  const selectedCategories = DATA_CATEGORIES.filter((c) => checkedCategories.has(c.key));
  const totalRows = selectedCategories.reduce((sum, c) => sum + c.estimatedRows, 0);

  const handleExport = (format: string) => {
    alert("Export started \u2014 file will download shortly.");
  };

  return (
    <div className="flex flex-col">
      <Header
        title="Data Export"
        subtitle="Export programme data for reporting and analysis"
      />

      <div className="flex flex-col gap-6 p-6">
        <Link href="/impact">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to Impact Dashboard
          </Button>
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Configuration */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Period Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Reporting Period</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="quarter">Quarter</Label>
                    <select
                      id="quarter"
                      value={selectedQuarter}
                      onChange={(e) => setSelectedQuarter(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {QUARTERS.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="year">Year</Label>
                    <select
                      id="year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Categories */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Data Categories</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={toggleAll}
                  >
                    {checkedCategories.size === DATA_CATEGORIES.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {DATA_CATEGORIES.map((category) => (
                    <label
                      key={category.key}
                      className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checkedCategories.has(category.key)}
                        onChange={() => toggleCategory(category.key)}
                        className="h-4 w-4 rounded border-input"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium">{category.label}</span>
                        <p className="text-[10px] text-muted-foreground">
                          ~{category.estimatedRows} rows
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Export Buttons */}
            <div className="flex gap-3">
              <Button
                className="gap-1.5 flex-1"
                onClick={() => handleExport("csv")}
                disabled={checkedCategories.size === 0}
              >
                <Download className="h-4 w-4" />
                Export as CSV
              </Button>
              <Button
                variant="outline"
                className="gap-1.5 flex-1"
                onClick={() => handleExport("xlsx")}
                disabled={checkedCategories.size === 0}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export as Excel (.xlsx)
              </Button>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Export Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-3xl font-bold">{totalRows.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Estimated Total Rows</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Period</p>
                  <p className="text-sm font-medium">
                    {selectedQuarter}, {selectedYear}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Selected Categories ({selectedCategories.length})
                  </p>
                  <div className="flex flex-col gap-2">
                    {selectedCategories.map((category) => (
                      <div
                        key={category.key}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{category.label}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          ~{category.estimatedRows}
                        </Badge>
                      </div>
                    ))}
                    {selectedCategories.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No categories selected.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Export Notes</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>CSV exports create one file per category</li>
                      <li>Excel exports contain all categories as separate sheets</li>
                      <li>All dates formatted as YYYY-MM-DD</li>
                      <li>GPS coordinates included where available</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
