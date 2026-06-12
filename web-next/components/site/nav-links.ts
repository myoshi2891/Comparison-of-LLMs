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
      { name: "Harness Engineering", href: "/claude/harness-engineering" },
      { name: "Managed Agents", href: "/claude/managed-agents" },
      { name: "Self-hosted Sandboxes", href: "/claude/self-hosted-sandboxes" },
      { name: "Code Slash Commands", href: "/claude/code-slash-commands" },
    ],
  },
  {
    name: "Google",
    children: [
      { name: "Google Sandbox", href: "/google/sandbox-best-practices" },
      { name: "Skill", href: "/google/skill" },
      { name: "Agent", href: "/google/agent" },
      { name: "Skill Guide", href: "/google/skill-guide" },
      { name: "Skill Guide (中級)", href: "/google/skill-guide-intermediate" },
      { name: "Antigravity", href: "/google/antigravity-guide" },
      { name: "Antigravity Slash Commands", href: "/google/antigravity-slash-commands-guide" },
      { name: "Harness Engineering", href: "/google/harness-engineering" },
      { name: "Agent Harness Engineering", href: "/google/agent-harness-engineering" },
    ],
  },
  {
    name: "Codex",
    children: [
      { name: "Skill", href: "/codex/skill" },
      { name: "Agent", href: "/codex/agent" },
      { name: "Codex Guide", href: "/codex/openai-codex-guide" },
      { name: "Harness Engineering", href: "/codex/harness-engineering" },
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
  {
    name: "Code Review",
    children: [
      { name: "Tool Pricing", href: "/code-review/tool-pricing" },
      { name: "CodeRabbit Guide", href: "/code-review/coderabbit-guide" },
      { name: "Copilot Code Review", href: "/code-review/copilot-code-review" },
      { name: "SonarQube Guide", href: "/code-review/sonar-qube" },
    ],
  },
  {
    name: "Agent",
    children: [
      { name: "Advanced Guide", href: "/agent/hermes-agent-advanced-guide" },
      { name: "OpenClaw Security Guide", href: "/agent/openclaw-advanced-agent-security-guide" },
    ],
  },
  { name: "Git Worktree", href: "/git-worktree" },
];
