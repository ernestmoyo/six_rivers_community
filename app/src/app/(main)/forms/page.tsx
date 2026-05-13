"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  Beef,
  Briefcase,
  Wheat,
  TreePine,
  Heart,
  Radio,
  GraduationCap,
  Users,
  Building2,
  FileSignature,
  UserPlus,
  Award,
  BarChart3,
} from "lucide-react";

interface FormCard {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconClass: string;
  group: "field" | "srata";
}

const forms: FormCard[] = [
  // Field forms
  {
    href: "/submit/field-visit",
    title: "Field Visit",
    description: "Farm check, community meeting, or general field activity.",
    icon: ClipboardList,
    iconClass: "bg-primary/10 text-primary",
    group: "field",
  },
  {
    href: "/submit/cattle-incident",
    title: "Cattle Incident",
    description: "Grazing, crop damage, water conflict in Mbarali DC.",
    icon: Beef,
    iconClass: "bg-red-100 text-red-600",
    group: "field",
  },
  {
    href: "/submit/iga-update",
    title: "IGA Financial Update",
    description: "Group capital, revenue, and expenses round.",
    icon: Briefcase,
    iconClass: "bg-indigo-100 text-indigo-600",
    group: "field",
  },
  {
    href: "/submit/crop-cycle",
    title: "Crop Cycle",
    description: "Plant a new short-cycle crop (3-month rotation).",
    icon: Wheat,
    iconClass: "bg-amber-100 text-amber-700",
    group: "field",
  },
  {
    href: "/submit/agroforestry-plot",
    title: "Agroforestry Plot",
    description: "Register a new tree-crop integration plot.",
    icon: TreePine,
    iconClass: "bg-green-100 text-green-700",
    group: "field",
  },
  {
    href: "/submit/survival-check",
    title: "Survival Check",
    description: "Count surviving seedlings on an existing distribution.",
    icon: Heart,
    iconClass: "bg-rose-100 text-rose-600",
    group: "field",
  },
  {
    href: "/submit/radio-session",
    title: "Radio Session",
    description: "Log a Uhifadhi na Jamii broadcast.",
    icon: Radio,
    iconClass: "bg-violet-100 text-violet-600",
    group: "field",
  },
  // SRATA forms
  {
    href: "/submit/srata-enrollment",
    title: "SRATA Enrollment",
    description: "Baseline data for a new student at intake.",
    icon: UserPlus,
    iconClass: "bg-sky-100 text-sky-700",
    group: "srata",
  },
  {
    href: "/submit/srata-attendance",
    title: "SRATA Attendance",
    description: "Batch-mark attendance for a cohort session.",
    icon: Users,
    iconClass: "bg-sky-100 text-sky-700",
    group: "srata",
  },
  {
    href: "/submit/srata-assessment",
    title: "SRATA Assessment",
    description: "Record an English / computer / practical score.",
    icon: BarChart3,
    iconClass: "bg-sky-100 text-sky-700",
    group: "srata",
  },
  {
    href: "/submit/srata-internship",
    title: "SRATA Internship",
    description: "Register a 3-month industry placement.",
    icon: Building2,
    iconClass: "bg-sky-100 text-sky-700",
    group: "srata",
  },
  {
    href: "/submit/srata-internship-eval",
    title: "Internship Evaluation",
    description: "Capture supervisor feedback at placement end.",
    icon: FileSignature,
    iconClass: "bg-sky-100 text-sky-700",
    group: "srata",
  },
  {
    href: "/submit/srata-exit-survey",
    title: "Exit Survey",
    description: "Graduation-day exit survey.",
    icon: GraduationCap,
    iconClass: "bg-sky-100 text-sky-700",
    group: "srata",
  },
  {
    href: "/submit/srata-tracer",
    title: "Graduate Tracer",
    description: "3 / 6 / 12 / 24-month follow-up on a graduate.",
    icon: Award,
    iconClass: "bg-sky-100 text-sky-700",
    group: "srata",
  },
  {
    href: "/submit/srata-employer",
    title: "Add Employer / Partner",
    description: "Register an internship host or recruiter.",
    icon: Building2,
    iconClass: "bg-sky-100 text-sky-700",
    group: "srata",
  },
];

function Section({ title, group }: { title: string; group: FormCard["group"] }) {
  const items = forms.filter((f) => f.group === group);
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => {
          const Icon = f.icon;
          return (
            <Link key={f.href} href={f.href} className="block">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="flex items-start gap-3 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${f.iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{f.title}</span>
                    <span className="text-xs text-muted-foreground">{f.description}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function FormsPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="All Forms"
        subtitle="One stop for every data-entry surface in the platform."
      />
      <div className="flex flex-col gap-8 p-6">
        <Section title="Field & Community" group="field" />
        <Section title="SRATA Academy" group="srata" />
      </div>
    </div>
  );
}
