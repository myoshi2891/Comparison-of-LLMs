const DEFAULT_SITE_URL = "https://comparison-of-llms.netlify.app";

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
