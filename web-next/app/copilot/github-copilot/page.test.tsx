// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GithubCopilotPage, { metadata } from "./page";

const EXPECTED_H1 = ["GitHub Copilot 実践ベストプラクティスガイド"] as const;

const EXPECTED_H2 = [
  "1. GitHub Copilotの全体像(2026年時点のプロダクトファミリー)",
  "2. 3つのChatモードを使い分ける(Ask / Edit / Agent)",
  "3. カスタムインストラクションの3層構造",
  "4. プロンプトファイルとカスタムチャットモード",
  "5. カスタムエージェントとサブエージェント",
  "6. Copilot Spacesでチームのナレッジベースを構築する",
  "7. エージェントモード実践ワークフロー(8ステップ)",
  "8. GitHub Copilot CLIを使いこなす",
  "9. Coding Agent(クラウドエージェント)にIssueを任せる",
  "10. Copilot Code Review — Agent SkillsとMCPの活用",
  "11. MCPサーバー統合のベストプラクティス",
  "12. モデル選定戦略",
  "13. セキュリティと責任あるAI活用",
  "14. コストとAI Creditsの管理",
  "15. よくあるアンチパターン",
  "16. ベストプラクティスチェックリスト",
  "17. 参考文献",
] as const;

const EXPECTED_H3 = [
  "公式ドキュメント・GitHub Changelog",
  "著名な開発者・企業テクノロジストによる発信",
  "Copilot Spacesとカスタムインストラクション関連",
  "CLI・モデル選定・コスト関連の解説記事",
  "セキュリティ関連",
] as const;

const EXPECTED_EXTERNAL_URLS = [
  "https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot",
  "https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/best-practices-for-using-copilot-to-work-on-tasks",
  "https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices",
  "https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions",
  "https://docs.github.com/copilot/using-github-copilot/asking-github-copilot-questions-in-your-ide",
  "https://docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review",
  "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/mcp-and-cloud-agent",
  "https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/ai-models/supported-models",
  "https://docs.github.com/en/copilot/reference/ai-models/model-hosting",
  "https://docs.github.com/copilot/using-github-copilot/ai-models/using-claude-in-github-copilot",
  "https://github.blog/changelog/2025-08-28-copilot-coding-agent-now-supports-agents-md-custom-instructions/",
  "https://github.blog/changelog/2025-07-23-github-copilot-coding-agent-now-supports-instructions-md-custom-instructions/",
  "https://github.blog/changelog/2026-06-02-shape-copilot-code-review-around-your-team/",
  "https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/",
  "https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/",
  "https://github.blog/changelog/2025-10-17-copilot-knowledge-bases-can-now-be-converted-to-copilot-spaces/",
  "https://github.blog/changelog/2025-08-20-sunset-notice-copilot-knowledge-bases/",
  "https://github.blog/changelog/2026-05-20-updates-to-available-models-in-copilot-on-web/",
  "https://code.visualstudio.com/docs/agents/best-practices",
  "https://code.visualstudio.com/docs/agent-customization/custom-instructions",
  "https://code.visualstudio.com/blogs/2025/02/24/introducing-copilot-agent-mode",
  "https://github.blog/ai-and-ml/github-copilot/the-harness-is-all-you-need-mostly/",
  "https://github.blog/ai-and-ml/github-copilot/copilot-ask-edit-and-agent-modes-what-they-do-and-when-to-use-them/",
  "https://burkeholland.github.io/posts/opus-4-5-change-everything/",
  "https://simonwillison.net/tags/github-copilot/",
  "https://simonwillison.net/2026/Jan/28/the-five-levels/",
  "https://addyosmani.com/blog/ai-coding-workflow/",
  "https://addyo.substack.com/p/code-review-in-the-age-of-ai",
  "https://techcommunity.microsoft.com/blog/azuredevcommunityblog/turning-github-copilot-into-a-%E2%80%9Cbest-practices-coach%E2%80%9D-with-copilot-spaces--a-mark/4511567",
  "https://learn.microsoft.com/en-us/training/modules/introduction-copilot-spaces/",
  "https://github.blog/ai-and-ml/github-copilot/how-to-use-github-copilot-spaces-to-debug-issues-faster/",
  "https://zenn.dev/chot/articles/b8b830571ba088",
  "https://dev.to/pwd9000/github-copilot-instructions-vs-prompts-vs-custom-agents-vs-skills-vs-x-vs-why-339l",
  "https://dev.to/proflead/github-copilot-cli-the-complete-developer-guide-2026-3cjj",
  "https://www.devleader.ca/2026/07/21/the-github-copilot-cli-permission-model-what-it-can-and-cant-touch",
  "https://www.fundesk.io/github-copilot-agent-mode-guide-2026",
  "https://movarnell.github.io/Copilot-Links/models.html",
  "https://www.talesontech.com/blog/github-copilot-best-practices-guide-2026/",
  "https://www.metacto.com/blogs/github-copilot-best-practices-from-high-performing-teams",
  "https://github.blog/ai-and-ml/github-copilot/copilot-vs-raw-api-access-what-are-you-actually-paying-for/",
  "https://checkmarx.com/learn/ai-security/top-5-github-copilot-security-risks-9-ways-to-mitigate-them/",
  "https://www.cybedefend.com/en/blog/github-copilot-security-risks-best-practices",
  "https://www.techstoriess.com/ai-agent-security-practices-2026-prompt-injection-mcp-risks-data-leaks/",
];

function headingText(el: Element): string {
  return el.textContent?.trim().replace(/\s+/g, " ") ?? "";
}

describe("/copilot/github-copilot Contract Tests", () => {
  // S-1: h2 の見出しが原本と完全一致（順序込み）
  it("S-1: h2 の見出しが原本と完全一致（順序込み）", () => {
    const { container } = render(<GithubCopilotPage />);
    const actualH2 = Array.from(container.querySelectorAll("main h2")).map(headingText);
    expect(actualH2).toEqual([...EXPECTED_H2]);
  });

  // S-2: h3 の見出しが原本と完全一致（順序込み）
  it("S-2: h3 の見出しが原本と完全一致（順序込み）", () => {
    const { container } = render(<GithubCopilotPage />);
    const actualH3 = Array.from(container.querySelectorAll("main h3")).map(headingText);
    expect(actualH3).toEqual([...EXPECTED_H3]);
  });

  // S-3: 原本の外部リンク URL が全件存在
  it("S-3: 原本の外部リンク URL が全件存在", () => {
    const { container } = render(<GithubCopilotPage />);
    const links = Array.from(container.querySelectorAll('a[href^="http"]')).map((a) =>
      a.getAttribute("href")
    );
    for (const expectedUrl of EXPECTED_EXTERNAL_URLS) {
      expect(links).toContain(expectedUrl);
    }
  });

  // S-4: 全 h2/h3 が一意な id を持ち、TOC のアンカーが全て実在する見出しを指す
  it("S-4: 全 h2/h3 が一意な id を持ち、TOC のアンカーが全て実在する見出しを指す", () => {
    const { container } = render(<GithubCopilotPage />);
    const headings = container.querySelectorAll("main h2[id], main h3[id]");
    const ids = Array.from(headings).map((h) => h.getAttribute("id"));
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);

    const tocLinks = container.querySelectorAll('nav a[href^="#"]');
    for (const link of tocLinks) {
      const targetId = link.getAttribute("href")?.slice(1);
      expect(targetId).toBeTruthy();
      if (targetId) {
        expect(container.querySelector(`#${CSS.escape(targetId)}`)).toBeTruthy();
      }
    }
  });

  // C-1: h1 のテキストが完全一致する
  it("C-1: h1 のテキストが完全一致する", () => {
    const { container } = render(<GithubCopilotPage />);
    const actualH1 = Array.from(container.querySelectorAll("h1")).map(headingText);
    expect(actualH1).toEqual([...EXPECTED_H1]);
  });

  // C-2: クイックナビ（TOC リンク）の件数と href="#..." 形式
  it("C-2: クイックナビ（TOC リンク）の件数と href 形式", () => {
    const { container } = render(<GithubCopilotPage />);
    const tocLinks = container.querySelectorAll('nav a[href^="#"]');
    expect(tocLinks.length).toBe(EXPECTED_H2.length);
  });

  // C-3: サイドバー TOC リンクが存在し、有効な href を持つ
  it("C-3: サイドバー TOC リンクが存在し、有効な href を持つ", () => {
    const { container } = render(<GithubCopilotPage />);
    const tocLinks = container.querySelectorAll("nav ul li a");
    expect(tocLinks.length).toBe(EXPECTED_H2.length);
    for (const link of tocLinks) {
      expect(link.getAttribute("href")).toMatch(/^#[^ ]+/);
    }
  });

  // C-4: 外部リンク全件に target="_blank" かつ rel="noopener noreferrer"
  it("C-4: 外部リンク全件に target=_blank かつ rel=noopener noreferrer", () => {
    const { container } = render(<GithubCopilotPage />);
    const extLinks = container.querySelectorAll('a[href^="http"]');
    expect(extLinks.length).toBeGreaterThanOrEqual(EXPECTED_EXTERNAL_URLS.length);
    for (const link of extLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });

  // C-5: 内部リンクに .html 拡張子が含まれない
  it("C-5: 内部リンクに .html 拡張子が含まれない", () => {
    const { container } = render(<GithubCopilotPage />);
    const internalLinks = Array.from(container.querySelectorAll("a[href]")).filter((a) => {
      const href = a.getAttribute("href") ?? "";
      return !href.startsWith("http") && !href.startsWith("//");
    });
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toMatch(/\.html/);
    }
  });

  // C-6: Mermaid ダイアグラムが 11 個存在する
  it("C-6: Mermaid ダイアグラムが 11 個存在する", () => {
    const { container } = render(<GithubCopilotPage />);
    const diagrams = container.querySelectorAll(".mermaid-scroll");
    expect(diagrams.length).toBe(11);
  });

  // Q-2: metadata の title と description が空でなく title が h1 と整合する
  it("Q-2: metadata.title と metadata.description が定義されている", () => {
    expect(metadata.title).toBeTruthy();
    expect(typeof metadata.title).toBe("string");
    expect(metadata.title).toContain("GitHub Copilot");
    expect(metadata.description).toBeTruthy();
    expect(typeof metadata.description).toBe("string");
  });

  // Q-3: 見出し階層が飛ばない（h1 -> h2 -> h3）
  it("Q-3: 見出し階層が飛ばない", () => {
    const { container } = render(<GithubCopilotPage />);
    const allHeadings = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((h) =>
      Number.parseInt(h.tagName.substring(1), 10)
    );
    let prevLevel = 0;
    for (const level of allHeadings) {
      if (prevLevel > 0) {
        expect(level - prevLevel).toBeLessThanOrEqual(1);
      }
      prevLevel = level;
    }
  });
});
