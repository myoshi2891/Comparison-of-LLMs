import { z } from "zod";

/**
 * href バリデーション: clean URL のみ許可、javascript: やプロトコル相対 URL を拒否。
 * legacy/shared/common-header.js:94-104 の isSafeHref 相当を Zod スキーマに内包した形。
 */
const hrefSchema = z
  .string()
  .min(1)
  .refine((href) => {
    if (href.startsWith("//")) return false;
    if (!href.startsWith("/")) return false;
    if (href.includes("javascript:")) return false;
    return true;
  }, "href must be an absolute path starting with /");

const LeafSchema = z.object({
  name: z.string().min(1),
  href: hrefSchema,
});

const DropdownSchema = z.object({
  name: z.string().min(1),
  children: z.array(LeafSchema).min(1),
});

export const NavLinkSchema = z.union([LeafSchema, DropdownSchema]);

export type NavLeaf = z.infer<typeof LeafSchema>;
export type NavDropdown = z.infer<typeof DropdownSchema>;
export type NavLink = z.infer<typeof NavLinkSchema>;

export const navLinks: readonly NavLink[] = [
  { name: "Home", href: "/" },
  {
    name: "Claude",
    children: [
      { name: "Skill", href: "/claude/skill" },
      { name: "Agent", href: "/claude/agent" },
      { name: "Skill Guide", href: "/claude/skill-guide" },
      { name: "Skill Guide (中級)", href: "/claude/skill-guide-intermediate" },
      { name: "Cowork Guide", href: "/claude/cowork-guide" },
    ],
  },
  {
    name: "Gemini",
    children: [
      { name: "Skill", href: "/gemini/skill" },
      { name: "Agent", href: "/gemini/agent" },
      { name: "Skill Guide", href: "/gemini/skill-guide" },
      { name: "Skill Guide (中級)", href: "/gemini/skill-guide-intermediate" },
      { name: "Antigravity", href: "/gemini/antigravity-guide" },
    ],
  },
  {
    name: "Codex",
    children: [
      { name: "Skill", href: "/codex/skill" },
      { name: "Agent", href: "/codex/agent" },
      { name: "Codex Guide", href: "/codex/openai-codex-guide" },
    ],
  },
  {
    name: "Copilot",
    children: [
      { name: "Skill", href: "/copilot/skill" },
      { name: "Agent", href: "/copilot/agent" },
      { name: "Markdown Guide", href: "/copilot/markdown-file-guide" },
      { name: "GitHub Copilot", href: "/copilot/github-copilot" },
    ],
  },
  { name: "Git Worktree", href: "/git-worktree" },
];
