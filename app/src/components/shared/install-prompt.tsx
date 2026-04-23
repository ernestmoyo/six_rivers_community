"use client";

import { useEffect, useState } from "react";

/**
 * Android / Chrome BeforeInstallPromptEvent — not yet in lib.dom.d.ts.
 * See https://developer.mozilla.org/docs/Web/API/BeforeInstallPromptEvent
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

const DISMISS_STORAGE_KEY = "sr-install-prompt-dismissed-until";
const DISMISS_WINDOW_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

function isDismissed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(DISMISS_STORAGE_KEY);
    if (!raw) return false;
    const until = Number.parseInt(raw, 10);
    if (Number.isNaN(until)) return false;
    return Date.now() < until;
  } catch {
    return false;
  }
}

function rememberDismissal(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now() + DISMISS_WINDOW_MS));
  } catch {
    // localStorage can be disabled — nothing actionable.
  }
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const mql = window.matchMedia?.("(display-mode: standalone)");
  if (mql?.matches) return true;
  // iOS Safari
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

    function onBeforeInstall(event: Event) {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    function onInstalled() {
      setVisible(false);
      setDeferred(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "dismissed") {
        rememberDismissal();
      }
    } catch {
      // Prompt may only be used once — nothing actionable.
    } finally {
      setDeferred(null);
      setVisible(false);
    }
  }

  function handleDismiss() {
    rememberDismissal();
    setVisible(false);
  }

  if (!visible || !deferred) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Install Six Rivers"
      className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:max-w-sm"
    >
      <div className="rounded-2xl border border-[#071637]/10 bg-[#FAF9F5] p-4 shadow-xl ring-1 ring-[#071637]/5">
        <div className="flex items-start gap-3">
          <div
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EC5C2B] text-lg"
          >
            <span role="img" aria-label="">
              {"📱"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#071637]">
              Install Six Rivers on your phone
            </p>
            <p className="mt-0.5 text-xs text-[#071637]/70">
              Adds a home-screen icon and enables offline access for field visits.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstall}
                className="rounded-md bg-[#EC5C2B] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#d04f22] focus:outline-none focus:ring-2 focus:ring-[#EC5C2B]/40"
              >
                Install
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-md border border-[#071637]/20 bg-transparent px-3 py-1.5 text-xs font-medium text-[#071637] transition-colors hover:bg-[#071637]/5 focus:outline-none focus:ring-2 focus:ring-[#071637]/20"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
