"use client";

import { useEffect, useState } from "react";
import { useOfflineQueue, drainQueue, getPendingCount } from "@/lib/offline-queue";
import { CloudOff, CloudUpload, RefreshCw } from "lucide-react";
import { toast } from "sonner";

/**
 * Floating pill that shows offline state + pending-sync count.
 * Renders nothing until mounted to avoid SSR/CSR hydration mismatches —
 * `navigator.onLine` and IndexedDB state are client-only.
 */
export function SyncWatcher() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <SyncWatcherClient />;
}

function SyncWatcherClient() {
  const { pending, isOnline } = useOfflineQueue();
  const [draining, setDraining] = useState(false);
  const [localPending, setLocalPending] = useState(pending);

  useEffect(() => {
    setLocalPending(pending);
  }, [pending]);

  async function forceSync() {
    if (draining) return;
    setDraining(true);
    try {
      const result = await drainQueue();
      const next = await getPendingCount();
      setLocalPending(next);
      if (result.succeeded > 0) {
        toast.success(`Synced ${result.succeeded} item${result.succeeded === 1 ? "" : "s"}`);
      } else if (next === 0) {
        toast.info("Nothing to sync");
      } else {
        toast.warning(`${next} still pending — try again later`);
      }
    } finally {
      setDraining(false);
    }
  }

  if (isOnline && localPending === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-xs shadow-md">
      {isOnline ? (
        <CloudUpload className="h-3.5 w-3.5 text-amber-600" />
      ) : (
        <CloudOff className="h-3.5 w-3.5 text-red-500" />
      )}
      <span className="font-medium">
        {isOnline ? "Pending" : "Offline"}
        {localPending > 0 ? ` · ${localPending}` : ""}
      </span>
      {isOnline && localPending > 0 && (
        <button
          type="button"
          onClick={forceSync}
          disabled={draining}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-primary hover:bg-muted"
        >
          <RefreshCw className={`h-3 w-3 ${draining ? "animate-spin" : ""}`} />
          Sync now
        </button>
      )}
    </div>
  );
}
