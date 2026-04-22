"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { demoVillages, demoFarmers } from "@/lib/demo-data";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const notifications = [
  { message: "Dry season survival check: 42% cocoa survival in Mapogoro — replanting planned", time: "2 hours ago" },
  { message: "Elephant crop raid reported in Katindiuka (HIGH severity — no chilli fence)", time: "5 hours ago" },
  { message: "Cocoa batch at Sagamaganga Nursery ready — holding for April rains", time: "1 day ago" },
];

export function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim().length >= 2
    ? [
        ...demoVillages
          .filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 4)
          .map((v) => ({ type: "village" as const, label: v.name, sub: v.districtName, href: `/villages/${v.id}` })),
        ...demoFarmers
          .filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 4)
          .map((f) => ({ type: "farmer" as const, label: f.name, sub: f.villageName, href: "/farming/farmers" })),
      ]
    : [];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold leading-tight tracking-tight text-primary">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search villages, farmers..."
            className="w-64 pl-9 h-9 text-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
          />
          {searchOpen && searchQuery.trim().length >= 2 && (
            <div className="absolute right-0 top-full mt-1 w-80 rounded-lg border bg-white shadow-lg z-50">
              {searchResults.length > 0 ? (
                <div className="flex flex-col py-1">
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      className="flex items-center justify-between px-3 py-2 text-left hover:bg-muted transition-colors"
                      onClick={() => {
                        router.push(r.href);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <div>
                        <p className="text-sm font-medium">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.sub}</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {r.type}
                      </Badge>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No results for &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}>
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center">
              {notifications.length}
            </Badge>
          </Button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border bg-white shadow-lg z-50">
                <div className="p-3 border-b">
                  <p className="text-sm font-semibold">Notifications</p>
                </div>
                <div className="flex flex-col">
                  {notifications.map((n, i) => (
                    <div key={i} className="px-3 py-2.5 border-b last:border-b-0">
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-muted-foreground">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}>
            <User className="h-4 w-4" />
          </Button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border bg-white shadow-lg z-50">
                <div className="p-3 border-b">
                  <p className="text-sm font-semibold">Ernest Moyo</p>
                  <p className="text-xs text-muted-foreground">ernest@7squareinc.com</p>
                </div>
                <div className="flex flex-col py-1">
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                    onClick={() => { router.push("/settings"); setProfileOpen(false); }}
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Settings
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left text-muted-foreground">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
