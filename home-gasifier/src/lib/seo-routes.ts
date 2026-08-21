/**
 * Auto-synced registry of publicly-crawlable routes. Consumed by the
 * /sitemap.xml handler in src/server/entry.ts.
 *
 * DO NOT add or remove paths by hand. Static paths are mirrored here from
 * src/routes.tsx automatically whenever that file is edited (any manual
 * path edit would be overwritten on the next routes.tsx change). For sync
 * to pick up a route, its `path` must be a literal string starting with "/";
 * template literals and identifier refs are skipped, and dynamic-param routes
 * like "/products/:id" are excluded.
 *
 * The only fields safe to hand-edit are the per-entry metadata below, after a
 * sync:
 * - `priority` (0.0–1.0): Home = 1.0, main sections = 0.8, deep pages = 0.5.
 * - `changefreq` and `lastmod`.
 */

export interface SeoRoute {
  path: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  lastmod?: string;
}

export const seoRoutes: SeoRoute[] = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/how-it-works", changefreq: "monthly", priority: 0.8 },
  { path: "/build-guides", changefreq: "monthly", priority: 0.8 },
  { path: "/fuel-types", changefreq: "monthly", priority: 0.8 },
  { path: "/safety", changefreq: "monthly", priority: 0.8 },
  { path: "/resources", changefreq: "monthly", priority: 0.8 },
  { path: "/troubleshooting", changefreq: "monthly", priority: 0.8 },
  { path: "/glossary", changefreq: "monthly", priority: 0.8 },
  { path: "/about", changefreq: "monthly", priority: 0.8 },
  { path: "/legal-regulatory", changefreq: "monthly", priority: 0.8 },
  { path: "/maintenance", changefreq: "monthly", priority: 0.8 },
  { path: "/real-builds", changefreq: "monthly", priority: 0.8 },
  { path: "/simulator", changefreq: "monthly", priority: 0.8 },
  { path: "/safety-faqs", changefreq: "monthly", priority: 0.8 },
  { path: "/faqs", changefreq: "monthly", priority: 0.8 },
  { path: "/legal", changefreq: "monthly", priority: 0.8 },
];
