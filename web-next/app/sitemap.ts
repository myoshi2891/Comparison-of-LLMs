import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.match(/^https?:\/\/.+/)
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  : "https://comparison-of-llms.netlify.app";

const ROUTES = [
  "/",
  // Phase B: skill.html × 4
  "/claude/skill",
  "/gemini/skill",
  "/codex/skill",
  "/copilot/skill",
  // Phase C: agent.html × 4
  "/claude/agent",
  "/gemini/agent",
  "/codex/agent",
  "/copilot/agent",
  // Phase D: long-form guides × 9
  "/claude/skill-guide",
  "/claude/skill-guide-intermediate",
  "/claude/cowork-guide",
  "/gemini/skill-guide",
  "/gemini/skill-guide-intermediate",
  "/gemini/antigravity-guide",
  "/codex/openai-codex-guide",
  "/copilot/markdown-file-guide",
  "/copilot/github-copilot",
  // Phase E: git_worktree.html
  "/git-worktree",
] as const;

/**
 * Generate sitemap entries from the predefined route list.
 *
 * Each sitemap item uses `SITE_URL` combined with the route path, sets `lastModified` to the current date (same value for all entries), and applies different `changeFrequency` and `priority` for the root route versus other routes.
 *
 * @returns An array of sitemap items where each item has:
 * - `url`: `SITE_URL` concatenated with the route path
 * - `lastModified`: the current date (same for all items)
 * - `changeFrequency`: `"weekly"` for `/`, `"monthly"` for all other routes
 * - `priority`: `1.0` for `/`, `0.8` for all other routes
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "/" ? 1.0 : 0.8,
  }));
}
