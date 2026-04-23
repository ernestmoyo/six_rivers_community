"use client";

/**
 * Offline submission queue for Six Rivers Community.
 *
 * Field officers frequently lose connectivity in the Psolo and Usangu areas.
 * When offline, form submissions are persisted to IndexedDB (via idb-keyval)
 * and replayed the next time the browser reports itself online.
 *
 * -----------------------------------------------------------------------------
 * WIRING GUIDE (intentionally not applied here — keep submit pages untouched
 * for a separate integration pass):
 *
 *   import { enqueue, submitWithOfflineFallback } from "@/lib/offline-queue";
 *   import { useOfflineQueue } from "@/lib/offline-queue";
 *
 *   // Inside a client submit handler:
 *   await submitWithOfflineFallback("/api/field-visits", payload);
 *
 *   // Or manual:
 *   if (!navigator.onLine) {
 *     await enqueue("/api/field-visits", payload);
 *   } else {
 *     try {
 *       await fetch(...);
 *     } catch {
 *       await enqueue("/api/field-visits", payload);
 *     }
 *   }
 *
 *   // Mount the hook somewhere persistent (already done in layout via
 *   // <InstallPrompt />'s sibling if needed — currently the hook is opt-in):
 *   function SyncWatcher() {
 *     const { pending, isOnline } = useOfflineQueue();
 *     return null;
 *   }
 * -----------------------------------------------------------------------------
 */

import { del, get, keys, set } from "idb-keyval";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const QUEUE_PREFIX = "sr-offline:";
const MAX_RETRIES = 5;

export interface QueuedSubmission {
  id: string;
  endpoint: string;
  payload: unknown;
  createdAt: number;
  retries: number;
}

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function keyFor(id: string): string {
  return `${QUEUE_PREFIX}${id}`;
}

function isQueueKey(key: IDBValidKey): key is string {
  return typeof key === "string" && key.startsWith(QUEUE_PREFIX);
}

/** Push a submission onto the offline queue. */
export async function enqueue(endpoint: string, payload: unknown): Promise<QueuedSubmission> {
  const item: QueuedSubmission = {
    id: makeId(),
    endpoint,
    payload,
    createdAt: Date.now(),
    retries: 0,
  };
  await set(keyFor(item.id), item);
  return item;
}

/** Count of items currently queued. */
export async function getPendingCount(): Promise<number> {
  const allKeys = await keys();
  return allKeys.filter(isQueueKey).length;
}

/** List queued submissions (oldest first). */
export async function listQueue(): Promise<QueuedSubmission[]> {
  const allKeys = await keys();
  const queueKeys = allKeys.filter(isQueueKey);
  const items: QueuedSubmission[] = [];
  for (const k of queueKeys) {
    const value = await get<QueuedSubmission>(k);
    if (value) {
      items.push(value);
    }
  }
  return items.sort((a, b) => a.createdAt - b.createdAt);
}

interface DrainResult {
  succeeded: number;
  failed: number;
  dropped: number;
}

/** Replay every queued submission. Successful items are removed. */
export async function drainQueue(): Promise<DrainResult> {
  const items = await listQueue();
  let succeeded = 0;
  let failed = 0;
  let dropped = 0;

  for (const item of items) {
    try {
      const response = await fetch(item.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.payload),
      });

      if (response.ok) {
        await del(keyFor(item.id));
        succeeded += 1;
        continue;
      }

      // Server responded with a non-OK status — treat as a retryable failure
      // unless we've exceeded MAX_RETRIES.
      const nextRetries = item.retries + 1;
      if (nextRetries >= MAX_RETRIES) {
        await del(keyFor(item.id));
        dropped += 1;
      } else {
        await set(keyFor(item.id), { ...item, retries: nextRetries });
        failed += 1;
      }
    } catch {
      const nextRetries = item.retries + 1;
      if (nextRetries >= MAX_RETRIES) {
        await del(keyFor(item.id));
        dropped += 1;
      } else {
        await set(keyFor(item.id), { ...item, retries: nextRetries });
        failed += 1;
      }
    }
  }

  return { succeeded, failed, dropped };
}

/**
 * Helper: attempt an immediate POST, fall back to queueing if offline
 * or if the fetch throws. Returns `{ queued: true }` if the request was
 * deferred, `{ queued: false, response }` if it was sent successfully.
 */
export async function submitWithOfflineFallback(
  endpoint: string,
  payload: unknown,
): Promise<{ queued: true } | { queued: false; response: Response }> {
  const online = typeof navigator === "undefined" ? true : navigator.onLine;

  if (!online) {
    await enqueue(endpoint, payload);
    toast.info("Saved offline. Will sync when online.");
    return { queued: true };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      // Preserve the server error for the caller to surface, but do NOT queue —
      // a 4xx means the payload is bad, not that the network failed.
      return { queued: false, response };
    }
    return { queued: false, response };
  } catch {
    await enqueue(endpoint, payload);
    toast.info("Saved offline. Will sync when online.");
    return { queued: true };
  }
}

export interface OfflineQueueState {
  pending: number;
  isOnline: boolean;
}

/**
 * React hook: tracks online/offline state and drains the queue on reconnect.
 * Fires a toast summarising sync results.
 */
export function useOfflineQueue(): OfflineQueueState {
  const [pending, setPending] = useState(0);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator === "undefined") return true;
    return navigator.onLine;
  });

  useEffect(() => {
    let cancelled = false;

    async function refreshPending() {
      try {
        const count = await getPendingCount();
        if (!cancelled) setPending(count);
      } catch {
        // IndexedDB can be unavailable (private browsing, SSR, etc.)
      }
    }

    async function handleOnline() {
      if (cancelled) return;
      setIsOnline(true);
      try {
        const before = await getPendingCount();
        if (before === 0) return;

        const result = await drainQueue();
        const after = await getPendingCount();
        if (!cancelled) setPending(after);

        if (result.succeeded > 0) {
          const label = result.succeeded === 1 ? "submission" : "submissions";
          toast.success(`${result.succeeded} queued ${label} synced`);
        }
        if (result.dropped > 0) {
          toast.error(
            `${result.dropped} queued submission${result.dropped === 1 ? "" : "s"} failed after ${MAX_RETRIES} retries`,
          );
        }
      } catch {
        // Swallow — we'll retry on the next online event.
      }
    }

    function handleOffline() {
      if (cancelled) return;
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial sync attempt (the app may have booted already online with
    // pending items from a previous session).
    void refreshPending();
    if (typeof navigator !== "undefined" && navigator.onLine) {
      void handleOnline();
    }

    return () => {
      cancelled = true;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { pending, isOnline };
}
