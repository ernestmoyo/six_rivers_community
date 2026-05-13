"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

const demoEmployers = [
  {
    id: 1,
    name: "Hondo Hondo Lodge",
    sector: "Hospitality",
    contactPerson: "Anna Materu",
    phone: "+255 712 345 121",
    district: "Ifakara TC",
    partnerType: "both",
    repeat: true,
  },
  {
    id: 2,
    name: "Mama Mwendapole Restaurant",
    sector: "Hospitality",
    contactPerson: "Chef Joseph",
    phone: "+255 765 555 111",
    district: "Mbarali",
    partnerType: "internship",
    repeat: false,
  },
  {
    id: 3,
    name: "Hippo Pool Camp",
    sector: "Tourism",
    contactPerson: "Pendo Mbogo",
    phone: "+255 744 888 222",
    district: "Ifakara TC",
    partnerType: "both",
    repeat: true,
  },
];

export default function SrataEmployersPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Employer / Partner Directory"
        subtitle="Internship hosts and recruiters"
      />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex justify-end">
          <Link href="/submit/srata-employer">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add employer
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Repeat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoEmployers.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell className="text-muted-foreground">{e.sector}</TableCell>
                    <TableCell>{e.contactPerson}</TableCell>
                    <TableCell className="text-muted-foreground">{e.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{e.district}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{e.partnerType}</Badge>
                    </TableCell>
                    <TableCell>
                      {e.repeat ? (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                          Yes
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
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
