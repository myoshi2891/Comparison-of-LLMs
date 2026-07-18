export const DEFAULT_SITE_URL = "https://comparison-of-llms.netlify.app";

/**
 * Resolves the site origin from the configured environment variable or a default fallback.
 *
 * Invalid or missing `NEXT_PUBLIC_SITE_URL` values are ignored. On non-Netlify deployments,
 * a warning is emitted when the variable is unavailable or invalid.
 *
 * @param caller - The calling module name used in the warning message.
 * @returns The resolved site origin, including its scheme, host, and optional port.
 */
export function resolveSiteUrl(caller: "robots.ts" | "sitemap.ts" | "rss.xml/route.ts"): string {
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
      `[${caller}] NEXT_PUBLIC_SITE_URL is not set or invalid. ` +
        "Set NEXT_PUBLIC_SITE_URL for non-Netlify deployments."
    );
  }
  return DEFAULT_SITE_URL;
}
