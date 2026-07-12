// Phase A [Red] contract test. Expected to FAIL until Green phase
// implements components/site/nav-links.ts with the NavLinkSchema Zod schema
// and navLinks data (6 top-level entries: Home + 4 dropdowns + Git Worktree).

/**
 * Phase A 契約テスト (ナビデータ / nav-links.ts)。
 *
 * 固定する契約:
 * - `components/site/nav-links.ts` から `navLinks` と `NavLinkSchema` が
 *   型付き export されている。
 * - `navLinks` は Zod スキーマで parse 成功する。
 * - トップレベル 6 エントリ: Home + Claude/Gemini/Codex/Copilot (dropdown) + Git Worktree。
 * - Claude dropdown は 5 子エントリ (Skill / Agent / Skill Guide /
 *   Skill Guide 中級 / Cowork Guide)。
 * - すべての href は `/` 始まりで `.html` 拡張子を含まない (clean URL)。
 * - 外部 GitHub URL は `navLinks` に含まれない (layout 側が責務を持つ)。
 * - Zod スキーマが `javascript:` や `//` プロトコル相対 URL を弾く
 *   (legacy/shared/common-header.js:94-104 の isSafeHref 相当)。
 */

import { describe, expect, it } from "vitest";
import { NavLinkSchema as RawSchema, navLinks as rawNavLinks } from "@/components/site/nav-links";

// Phase A Green が確定する契約のローカル型 (tsc の implicit-any を抑制するため)。
type NavLeaf = { name: string; href: string };
type NavDropdown = { name: string; children: NavLeaf[] };
type NavEntry = NavLeaf | NavDropdown;
type SchemaLike = { parse: (input: unknown) => NavEntry };
const navLinks = rawNavLinks as unknown as readonly NavEntry[];
const NavLinkSchema = RawSchema as unknown as SchemaLike;

describe("Phase A - nav-links export shape", () => {
  it("exports navLinks as a readonly array", () => {
    expect(Array.isArray(navLinks)).toBe(true);
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it("exports NavLinkSchema as a Zod schema (has .parse method)", () => {
    expect(typeof NavLinkSchema.parse).toBe("function");
  });
});

describe("Phase A - nav-links top-level entries", () => {
  it("has exactly 14 top-level entries", () => {
    expect(navLinks.length).toBe(14);
  });

  it("starts with Home as a flat link", () => {
    const home = navLinks[0];
    expect(home.name).toBe("Home");
    expect("href" in home && home.href === "/").toBe(true);
    expect("children" in home).toBe(false);
  });

  it("ends with Git Worktree as a flat link", () => {
    const last = navLinks[navLinks.length - 1];
    expect(last.name).toBe("Git Worktree");
    expect("href" in last && last.href === "/git-worktree").toBe(true);
  });

  it("has Claude/Google/Codex/Copilot/Code Review/Agent/MCP/Sandbox/IDE/Security/Local LLM/CI/CD as dropdowns with children", () => {
    const providers = [
      "Claude",
      "Google",
      "Codex",
      "Copilot",
      "Code Review",
      "Agent",
      "MCP",
      "Sandbox",
      "IDE",
      "Security",
      "Local LLM",
      "CI/CD",
    ] as const;
    for (const name of providers) {
      const entry = navLinks.find((link) => link.name === name);
      expect(entry, `${name} must exist`).toBeDefined();
      expect(entry && "children" in entry && Array.isArray(entry.children)).toBe(true);
    }
  });
});

describe("Phase A - Agent dropdown shape", () => {
  const agent = navLinks.find((link) => link.name === "Agent");

  it("has 6 child entries (advanced guide / openclaw security guide / loop engineering / skills-guide / skills-sh / context-engineering-best-practices)", () => {
    expect(agent && "children" in agent).toBe(true);
    const children = agent && "children" in agent ? agent.children : [];
    expect(children.length).toBe(6);
  });

  it("uses clean URL paths for all Agent children (no .html extension)", () => {
    expect(agent && "children" in agent).toBe(true);
    const children = agent && "children" in agent ? agent.children : [];
    const expectedHrefs = [
      "/agent/hermes-agent-advanced-guide",
      "/agent/openclaw-advanced-agent-security-guide",
      "/agent/loop-engineering",
      "/agent/skills",
      "/claude/skills-sh",
      "/agent/context-engineering-best-practices",
    ];
    expect(children.map((c) => c.href)).toEqual(expectedHrefs);
  });
});

describe("Phase A - Claude dropdown shape", () => {
  const claude = navLinks.find((link) => link.name === "Claude");

  it("has 10 child entries (skill / agent / skill-guide / skill-guide-intermediate / cowork-guide / harness-engineering / managed-agents / self-hosted-sandboxes / code-slash-commands / fable-5-best-practices)", () => {
    expect(claude && "children" in claude).toBe(true);
    const children = claude && "children" in claude ? claude.children : [];
    expect(children.length).toBe(10);
  });

  it("uses clean URL paths for all Claude children (no .html extension)", () => {
    const children = claude && "children" in claude ? claude.children : [];
    const expectedHrefs = [
      "/claude/skill",
      "/claude/agent",
      "/claude/skill-guide",
      "/claude/skill-guide-intermediate",
      "/claude/cowork-guide",
      "/claude/harness-engineering",
      "/claude/managed-agents",
      "/claude/self-hosted-sandboxes",
      "/claude/code-slash-commands",
      "/claude/fable-5-best-practices",
    ];
    expect(children.map((c) => c.href)).toEqual(expectedHrefs);
  });
});

describe("Phase A - MCP dropdown shape", () => {
  const mcp = navLinks.find((link) => link.name === "MCP");

  it("has 2 child entries (mcp-best-practices / mcp-best-practices-intermediate)", () => {
    expect(mcp && "children" in mcp).toBe(true);
    const children = mcp && "children" in mcp ? mcp.children : [];
    expect(children.length).toBe(2);
  });

  it("uses clean URL paths for all MCP children (no .html extension)", () => {
    const children = mcp && "children" in mcp ? mcp.children : [];
    const expectedHrefs = [
      "/mcp/mcp-best-practices",
      "/mcp/mcp-best-practices-intermediate",
    ];
    expect(children.map((c) => c.href)).toEqual(expectedHrefs);
  });
});

describe("Phase A - IDE dropdown shape", () => {
  const ide = navLinks.find((link) => link.name === "IDE");

  it("has 2 child entries (cursor guide / cursor guide intermediate)", () => {
    expect(ide && "children" in ide).toBe(true);
    const children = ide && "children" in ide ? ide.children : [];
    expect(children.length).toBe(2);
  });

  it("uses clean URL paths for all IDE children (no .html extension)", () => {
    const children = ide && "children" in ide ? ide.children : [];
    const expectedHrefs = ["/cursor/complete-guide", "/cursor/complete-guide-intermediate"];
    expect(children.map((c) => c.href)).toEqual(expectedHrefs);
  });
});

describe("Phase A - Local LLM dropdown shape", () => {
  const localLlm = navLinks.find((link) => link.name === "Local LLM");

  it("has 2 child entries (self-hosting guide / best practices)", () => {
    expect(localLlm && "children" in localLlm).toBe(true);
    const children = localLlm && "children" in localLlm ? localLlm.children : [];
    expect(children.length).toBe(2);
  });

  it("uses clean URL paths for all Local LLM children (no .html extension)", () => {
    const children = localLlm && "children" in localLlm ? localLlm.children : [];
    const expectedHrefs = ["/local-llm/self-hosting", "/local-llm/best-practices"];
    expect(children.map((c) => c.href)).toEqual(expectedHrefs);
  });
});

describe("Phase A - Zod schema validation", () => {
  it("accepts every navLinks entry", () => {
    for (const link of navLinks) {
      expect(() => NavLinkSchema.parse(link)).not.toThrow();
    }
  });

  it("rejects entries with javascript: protocol href (XSS guard)", () => {
    expect(() => NavLinkSchema.parse({ name: "Evil", href: "javascript:alert(1)" })).toThrow();
  });

  it("rejects entries with protocol-relative // href", () => {
    expect(() => NavLinkSchema.parse({ name: "PR", href: "//evil.example" })).toThrow();
  });

  it("rejects entries missing both href and children", () => {
    expect(() => NavLinkSchema.parse({ name: "Orphan" })).toThrow();
  });

  it("does not include an external GitHub URL as a top-level navLinks entry", () => {
    const flat = navLinks.flatMap((link) =>
      "children" in link ? link.children.map((c) => c.href) : [link.href]
    );
    for (const href of flat) {
      expect(href.startsWith("http")).toBe(false);
    }
  });
});
