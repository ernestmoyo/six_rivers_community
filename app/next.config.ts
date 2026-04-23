import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Source TS entry compiled by serwist.
  swSrc: "src/sw.ts",
  // Output to /public so the browser reaches it at /sw.js.
  swDest: "public/sw.js",
  // Disable the SW in dev to avoid caching surprises while iterating.
  disable: process.env.NODE_ENV === "development",
  cacheOnNavigation: true,
  reloadOnOnline: true,
});

const nextConfig: NextConfig = {
  // Empty turbopack block silences the Next 16 warning that @serwist/next is
  // injecting a webpack config into the default Turbopack pipeline.
  turbopack: {},
};

export default withSerwist(nextConfig);
