"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Map,
  Building2,
  Sprout,
  TreePine,
  Beef,
  ClipboardList,
  BarChart3,
  Cloud,
  Settings,
  ChevronDown,
  Menu,
  X,
  Briefcase,
  GraduationCap,
  Radio,
  Waves,
  BookOpen,
  FileText,
  Layers,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Programmes", href: "/programmes", icon: Layers },
  { title: "Map", href: "/map", icon: Map },
  {
    title: "Villages",
    href: "/villages",
    icon: Building2,
    children: [
      { title: "Overview", href: "/villages" },
      { title: "Reconcile (admin)", href: "/villages/reconcile" },
    ],
  },
  {
    title: "Farming",
    href: "/farming",
    icon: Sprout,
    children: [
      { title: "Farmers", href: "/farming/farmers" },
      { title: "Distributions", href: "/farming/distributions" },
      { title: "Crop Cycles", href: "/farming/crops" },
      { title: "Farming Approaches", href: "/farming/agroforestry" },
    ],
  },
  { title: "Nurseries", href: "/nurseries", icon: TreePine },
  {
    title: "Cattle",
    href: "/cattle",
    icon: Beef,
    children: [
      { title: "Overview", href: "/cattle" },
      { title: "Incidents", href: "/cattle/incidents" },
      { title: "Pressure Map", href: "/cattle/map" },
    ],
  },
  { title: "Cohorts", href: "/cohorts", icon: Users },
  { title: "IGA Groups", href: "/iga", icon: Briefcase },
  { title: "Eco Clubs", href: "/eco-clubs", icon: GraduationCap },
  { title: "Radio Programme", href: "/radio", icon: Radio },
  {
    title: "SRATA Academy",
    href: "/srata",
    icon: BookOpen,
    children: [
      { title: "Dashboard", href: "/srata" },
      { title: "Cohorts", href: "/srata/cohorts" },
      { title: "Students", href: "/srata/students" },
      { title: "Internships", href: "/srata/internships" },
      { title: "Graduates", href: "/srata/graduates" },
      { title: "Employers", href: "/srata/employers" },
      { title: "Reports", href: "/srata/reports" },
    ],
  },
  { title: "Field Collection", href: "/field/visit", icon: ClipboardList },
  { title: "All Forms", href: "/forms", icon: FileText },
  {
    title: "Impact",
    href: "/impact",
    icon: BarChart3,
    children: [
      { title: "Overview", href: "/impact" },
      { title: "Theory of Change", href: "/impact/theory-of-change" },
      { title: "Indicators", href: "/impact/indicators" },
      { title: "Quarterly Report", href: "/impact/quarterly" },
      { title: "Export", href: "/impact/export" },
    ],
  },
  { title: "Climate", href: "/climate", icon: Cloud },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleExpand = (title: string) => {
    setExpanded((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const navContent = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {navigation.map((item) => (
        <div key={item.title}>
          {item.children ? (
            <>
              <button
                onClick={() => toggleExpand(item.title)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                <span className="flex-1 text-left">{item.title}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expanded.includes(item.title) && "rotate-180"
                  )}
                />
              </button>
              {expanded.includes(item.title) && (
                <div className="ml-7 mt-1 flex flex-col gap-0.5 border-l border-sidebar-border pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm transition-colors",
                        pathname === child.href
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Link
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              <span>{item.title}</span>
            </Link>
          )}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-sidebar p-2 text-sidebar-foreground shadow-lg md:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-200 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EC5C2B]">
            <Waves className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight uppercase">Six Rivers</span>
            <span className="text-[10px] font-medium text-sidebar-foreground/60 uppercase tracking-wider">
              Community Intelligence
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          {navContent}
        </div>
      </aside>
    </>
  );
}
