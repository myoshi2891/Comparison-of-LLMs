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
      { name: "Fable 5 Best Practices", href: "/claude/fable-5-best-practices" },
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
      { name: "NotebookLM Guide", href: "/google/notebook-lm" },
      { name: "ADK Best Practices", href: "/google/adk-best-practices" },
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
      { name: "Loop Engineering Guide", href: "/agent/loop-engineering" },
      { name: "Agent Skills Guide", href: "/agent/skills" },
      { name: "skills.sh Guide", href: "/claude/skills-sh" },
      { name: "Context Engineering", href: "/agent/context-engineering-best-practices" },
    ],
  },
  {
    name: "MCP",
    children: [
      { name: "MCP Best Practices", href: "/mcp/mcp-best-practices" },
      {
        name: "MCP Best Practices (中級)",
        href: "/mcp/mcp-best-practices-intermediate",
      },
    ],
  },
  {
    name: "Local LLM",
    children: [
      { name: "Self-hosting Guide", href: "/local-llm/self-hosting" },
      { name: "Self-hosting Best Practices", href: "/local-llm/best-practices" },
    ],
  },
  {
    name: "Sandbox",
    children: [{ name: "Vercel Sandbox", href: "/vercel/sandbox" }],
  },
  {
    name: "IDE",
    children: [
      { name: "Cursor Guide", href: "/cursor/complete-guide" },
      { name: "Cursor Guide (中級)", href: "/cursor/complete-guide-intermediate" },
    ],
  },
  {
    name: "Security",
    children: [
      { name: "AI Security Best Practices", href: "/security/ai-security-best-practices" },
      {
        name: "AI Security Best Practices (中級)",
        href: "/security/ai-security-best-practices-intermediate",
      },
    ],
  },
  {
    name: "CI/CD",
    children: [{ name: "AI CI/CD Automation", href: "/ci-cd/ai-cicd-automation-best-practices" }],
  },
  {
    name: "RAG",
    children: [{ name: "RAG & Embeddings", href: "/rag/embeddings-best-practices" }],
  },
  {
    name: "Multimodal",
    children: [
      {
        name: "Generation Best Practices",
        href: "/multimodal/generation-best-practices",
      },
    ],
  },
  { name: "Git Worktree", href: "/git-worktree" },
];
