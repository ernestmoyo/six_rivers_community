/// <reference lib="webworker" />
/// <reference types="@serwist/next/typings" />

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  BackgroundSyncPlugin,
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  NetworkOnly,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";

// Typed self for the service-worker scope.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // 1a. POST/PATCH/PUT/DELETE on /api/* — never cache, but background-sync
    //     replay them when the device next has connectivity. This lets the
    //     PWA queue submissions even when the tab is closed.
    {
      matcher: ({ url, request }) =>
        url.pathname.startsWith("/api/") && request.method !== "GET",
      handler: new NetworkOnly({
        plugins: [
          new BackgroundSyncPlugin("sr-form-sync", {
            maxRetentionTime: 60 * 24 * 7, // 7 days of retry attempts
          }),
        ],
      }),
    },
    // 1b. GET on /api/* — also never cache (we want live indicator + cohort
    //     reads), but no background sync needed for reads.
    {
      matcher: ({ url, request }) =>
        url.pathname.startsWith("/api/") && request.method === "GET",
      handler: new NetworkOnly(),
    },
    // 2. Static Next build assets.
    {
      matcher: ({ url }) => url.pathname.startsWith("/_next/static/"),
      handler: new CacheFirst({
        cacheName: "next-static",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          }),
        ],
      }),
    },
    // 3. Brand assets that ship with the app.
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/icons/") ||
        url.pathname.startsWith("/logos/") ||
        url.pathname.startsWith("/geo/"),
      handler: new CacheFirst({
        cacheName: "sr-static-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          }),
        ],
      }),
    },
    // 4. Raster images.
    {
      matcher: ({ request }) => request.destination === "image",
      handler: new CacheFirst({
        cacheName: "images",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          }),
        ],
      }),
    },
    // 5. Google Fonts.
    {
      matcher: ({ url }) =>
        url.origin === "https://fonts.googleapis.com" ||
        url.origin === "https://fonts.gstatic.com",
      handler: new StaleWhileRevalidate({
        cacheName: "google-fonts",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 365,
          }),
        ],
      }),
    },
    // 6. HTML navigations — network-first with a 1-day fallback.
    {
      matcher: ({ request }) => request.mode === "navigate",
      handler: new NetworkFirst({
        cacheName: "pages",
        networkTimeoutSeconds: 5,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 60,
            maxAgeSeconds: 60 * 60 * 24, // 1 day
          }),
        ],
      }),
    },
    // 7. Fallback to Serwist's sensible defaults.
    ...defaultCache,
  ],
});

serwist.addEventListeners();
