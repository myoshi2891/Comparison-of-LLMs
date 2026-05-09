const DEFAULT_SITE_URL = "https://comparison-of-llms.netlify.app";

/**
 * Resolve the site URL from environment variables or use a default fallback.
 *
 * Prefers `NEXT_PUBLIC_SITE_URL` and validates it using the URL constructor.
 * If parsing fails or the variable is unset, falls back to `DEFAULT_SITE_URL`.
 * Invalid `NEXT_PUBLIC_SITE_URL` values will be ignored (no exception thrown).
 * Emits a warning for non-`NETLIFY` deployments when the environment variable is missing.
 *
 * @param caller - The name of the calling module (allowed values: "robots.ts" | "sitemap.ts"). Used only for contextual warning messages.
 * @returns The resolved site origin string (scheme + host + port).
 */
export function resolveSiteUrl(caller: "robots.ts" | "sitemap.ts"): string {
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
