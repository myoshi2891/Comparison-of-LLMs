import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const _DEFAULT_SITE_URL = "https://comparison-of-llms.netlify.app";

/**
 * Resolve the site's origin used for metadata (e.g., sitemap).
 *
 * Attempts to parse `process.env.NEXT_PUBLIC_SITE_URL` and return its origin; if that value is missing or not a valid URL, returns the compiled default site origin. May emit a console warning when `NEXT_PUBLIC_SITE_URL` is missing or invalid and the `NETLIFY` environment variable is not set.
 *
 * @returns The resolved site origin (for example, `https://example.com`).
 */
function resolveSiteUrl(): string {
  const envVal = process.env.NEXT_PUBLIC_SITE_URL;
  if (envVal) {
    try {
      return new URL(envVal).origin;
    } catch {
      // fall through to default
    }
  }
  if (!process.env.NETLIFY) {
    console.warn(
      "[robots.ts] NEXT_PUBLIC_SITE_URL is not set or invalid. " +
        "Set NEXT_PUBLIC_SITE_URL for non-Netlify deployments."
    );
  }
  return _DEFAULT_SITE_URL;
}

const SITE_URL = resolveSiteUrl();

/**
 * Generate robots metadata allowing all crawlers and referencing the site's sitemap.
 *
 * @returns A `MetadataRoute.Robots` object that permits all user agents to crawl `/` and points to the sitemap at `${SITE_URL}/sitemap.xml`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
