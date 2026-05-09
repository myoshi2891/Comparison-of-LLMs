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

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "/" ? 1.0 : 0.8,
  }));
}
