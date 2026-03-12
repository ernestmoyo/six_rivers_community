"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Users, MapPin, Database, Link2 } from "lucide-react";

const teamMembers = [
  { name: "Mary Marandu", role: "manager", email: "Mary.Marandu@sixriversafrica.com", area: "Mbarali" },
  { name: "Edna Sonda", role: "m_and_e", email: "edna.sonda@sixriversafrica.com", area: "M&E" },
  { name: "Lilian Mihambo", role: "field_officer", email: "Lilian.Mihambo@sixriversafrica.com", area: "Mbarali DC" },
  { name: "Justina Kizanye", role: "field_officer", email: "justina.kizanye@sixriversafrica.com", area: "Ifakara TC" },
  { name: "Irene Masonda", role: "field_officer", email: "irene.masonda@sixriversafrica.com", area: "Ifakara TC" },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <Header title="Settings" subtitle="Platform configuration and team management" />

      <div className="flex flex-col gap-6 p-6 max-w-4xl">
        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members
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
                    <Badge variant="secondary" className="text-[10px]">{member.area}</Badge>
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
                      {member.role === "manager" ? "Manager" : member.role === "m_and_e" ? "M&E Specialist" : "Field Officer"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              Add Team Member
            </Button>
          </CardContent>
        </Card>

        {/* Operational Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Operational Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <span className="text-sm font-medium">Ifakara Town Council</span>
                  <p className="text-xs text-muted-foreground">Villages bordering Nyerere National Park</p>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <span className="text-sm font-medium">Mbarali District Council</span>
                  <p className="text-xs text-muted-foreground">Villages bordering Ruaha National Park</p>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Landscape Dashboard Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connected Dashboard</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Linked</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                six-rivers-africa-dashboard.vercel.app
              </p>
              <Separator />
              <p className="text-xs text-muted-foreground">
                Buffer zone vegetation health data is synced from the Landscape Health Intelligence Dashboard
                to correlate community activity with conservation outcomes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Database */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shapefile Status</span>
                <Badge variant="secondary">Tanzania Admin Boundaries Loaded</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Population Data</span>
                <Badge variant="secondary">Census 1988-2022</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Weather API</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Open-Meteo Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
