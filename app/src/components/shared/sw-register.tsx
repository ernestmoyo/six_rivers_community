"use client";

import { useEffect } from "react";

/**
 * Explicitly registers `/sw.js` on the client. @serwist/next builds the
 * service worker but does not always inject a registration script into the
 * initial HTML on Next 16, which means external auditors like PWABuilder
 * report "No Service Worker found." Registering it ourselves makes the SW
 * discoverable both at runtime and to audit tools.
 */
export function SwRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (window.location.hostname === "localhost") return;
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // Best-effort — registration failures don't block the app.
      });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}
