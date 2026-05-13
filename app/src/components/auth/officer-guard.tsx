"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useOfficer } from "@/lib/officer";

interface OfficerGuardProps {
  children: React.ReactNode;
}

/**
 * Wraps the (main) layout. Forces:
 *   - /onboard if no officer profile exists on this device
 *   - /unlock if a profile exists but the session is locked
 *
 * Routes under /(auth)/* and /submit/* skip this guard via their own layouts.
 */
export function OfficerGuard({ children }: OfficerGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { officer, loading, unlocked } = useOfficer();

  useEffect(() => {
    if (loading) return;
    if (!officer) {
      router.replace(`/onboard?next=${encodeURIComponent(pathname || "/dashboard")}`);
      return;
    }
    if (!unlocked) {
      router.replace(`/unlock?next=${encodeURIComponent(pathname || "/dashboard")}`);
    }
  }, [loading, officer, unlocked, pathname, router]);

  if (loading || !officer || !unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="text-xs text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return <>{children}</>;
}
