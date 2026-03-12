"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const notifications = [
  { message: "Survival rate below 65% in Ichonde", time: "2 hours ago" },
  { message: "3 offline submissions pending sync", time: "5 hours ago" },
  { message: "Batch #5 ready for distribution at Ichonde Nursery", time: "1 day ago" },
];

export function Header({ title, subtitle }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search villages, farmers..."
            className="w-64 pl-9 h-9 text-sm"
          />
        </div>

        <div className="relative">
          <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => setNotifOpen(!notifOpen)}>
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center">
              3
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

        <Button variant="ghost" size="icon" className="h-9 w-9">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
