import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.match(/^https?:\/\/.+/)
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  : "https://comparison-of-llms.netlify.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
