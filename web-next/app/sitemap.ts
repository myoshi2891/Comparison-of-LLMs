import type { MetadataRoute } from "next";

import { pageRegistry } from "@/lib/page-registry";
import { resolveSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

const SITE_URL = resolveSiteUrl("sitemap.ts");

/**
 * Generates sitemap entries for all pages in the page registry.
 *
 * Uses each page's last review date and assigns higher priority and weekly updates
 * to the site root.
 *
 * @returns Sitemap entries containing each page's URL, review date, update frequency, and priority.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return pageRegistry.map((page) => {
    const isRoot = page.slug === "/";
    return {
      url: isRoot ? `${SITE_URL}/` : `${SITE_URL}${page.slug}`,
      lastModified: page.lastReviewed,
      changeFrequency: isRoot ? ("weekly" as const) : ("monthly" as const),
      priority: isRoot ? 1.0 : 0.8,
    };
  });
}
