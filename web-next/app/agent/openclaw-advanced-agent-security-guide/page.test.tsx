// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

vi.mock("@/components/docs/CodeCopyButton", () => ({
  default: function DummyCodeCopyButton({ text }: { text: string }) {
    return (
      <button type="button" data-testid="code-copy-button" data-code={text}>
        Copy
      </button>
    );
  },
}));

const EXPECTED_H1 = ["OpenClaw Agent実践ベストプラクティスガイド"] as const;

const EXPECTED_H2 = [
  "OpenClawとは何か",
  "アーキテクチャの全体像",
  "ワークスペースとブートストラップファイル設計",
  "メモリとコンテキストエンジニアリング",
  "スキルシステムとClawHub",
  "マルチエージェント設計とスケジューリング",
  "モデルルーティングとコスト最適化",
  "セキュリティベストプラクティス",
  "サプライチェーン攻撃への備え",
  "本番運用・チーム利用のガバナンス",
  "ステップバイステップ導入チェックリスト",
  "参考文献",
] as const;

const EXPECTED_H3 = [
  "沿革",
  "2026年8月時点の規模感（参考値）",
  "2.1 Gateway中心の3層構造",
  "2.2 セッションの直列処理（Command Queue）",
  "2.3 7段階のエージェントループ",
  "3.1 各ファイルの役割",
  "3.2 実務上のTips",
  "4.1 「日次ログは安い、MEMORY.mdは貴重」",
  "4.2 長期コンテキストへの対処: Compaction",
  "4.3 埋め込みベースの記憶検索",
  "5.1 SKILL.mdの構造とオンデマンドロード",
  "5.2 ClawHubというマーケットプレイスとそのリスク",
  "5.3 スキル導入時の安全フロー",
  "5.4 実務上の推奨事項",
  "6.1 サブエージェントによる分業",
  "6.2 Heartbeat と Cron の使い分け",
  "6.3 セッション分離の重要性",
  "7.1 なぜコストが膨らむのか",
  "7.2 階層型モデルルーティング",
  "7.3 コスト最適化の実務チェックリスト",
  "8.1 間接プロンプトインジェクションの実例",
  "8.2 有効だった防御策の実例",
  "8.3 Gatewayのネットワーク・認証ハードニング",
  "概要・アーキテクチャ",
  "ワークスペース・メモリ・スキル",
  "マルチエージェント・スケジューリング・コスト最適化",
  "セキュリティ・サプライチェーン",
  "創設者・プロジェクトの現状",
] as const;

const EXPECTED_EXTERNAL_LINKS = [
  "https://www.lennysnewsletter.com/p/openclaw-the-complete-guide-to-building",
  "https://bibek-poudel.medium.com/how-openclaw-works-understanding-ai-agents-through-a-real-architecture-5d59cc7a4764",
  "https://www.freecodecamp.org/news/how-to-build-and-secure-a-personal-ai-agent-with-openclaw/",
  "https://docs.openclaw.ai/agent-runtime-architecture",
  "https://docs.openclaw.ai/reference/AGENTS.default",
  "https://docs.openclaw.ai/gateway/config-agents",
  "https://github.com/openclaw/openclaw/blob/main/AGENTS.md",
  "https://gist.github.com/royosherove/971c7b4a350a30ac8a8dad41604a95a0",
  "https://github.com/centminmod/explain-openclaw",
  "https://www.kdnuggets.com/10-github-repositories-to-master-openclaw",
  "https://www.stanza.dev/concepts/openclaw-soul-persona",
  "https://openclaws.io/blog/openclaw-soul-md-guide",
  "https://capodieci.medium.com/ai-agents-003-openclaw-workspace-files-explained-soul-md-agents-md-heartbeat-md-and-more-5bdfbee4827a",
  "https://dev.to/aws-builders/mastering-openclaw-on-aws-fine-tuning-personality-memory-and-soul-37ig",
  "https://www.codebridge.tech/articles/how-to-build-domain-specific-ai-agents-with-openclaw-skills-soul-md-and-memory",
  "https://www.mindstudio.ai/blog/openclaw-best-practices-power-users-200-hours",
  "https://velvetshark.com/openclaw-multi-model-routing",
  "https://sfailabs.com/guides/openclaw-heartbeat-scheduling",
  "https://www.stack-junkie.com/blog/openclaw-cost-control-manage-api-spending-without-killing-your-agent",
  "https://lumadock.com/tutorials/openclaw-cost-optimization-budgeting",
  "https://designcopy.net/en/openclaw-token-optimization-guide/",
  "https://github.com/shenhao-stu/openclaw-agents",
  "https://github.com/mergisi/awesome-openclaw-agents",
  "https://simonwillison.net/tags/prompt-injection/",
  "https://www.techtarget.com/searchsecurity/tip/The-OpenClaw-security-risks-every-CISO-needs-to-know",
  "https://conscia.com/blog/the-openclaw-security-crisis/",
  "https://www.paloaltonetworks.com/blog/ai-security/why-moltbot-may-signal-ai-crisis/",
  "https://github.com/openclaw/openclaw/issues/39160",
  "https://thehackernews.com/2026/06/new-attacks-trick-openclaw-ai-agent.html",
  "https://www.hiddenlayer.com/research/exploring-the-security-risks-of-ai-assistants-like-openclaw",
  "https://www.giskard.ai/knowledge/openclaw-security-vulnerabilities-include-data-leakage-and-prompt-injection-risks",
  "https://arxiv.org/pdf/2605.23330",
  "https://unit42.paloaltonetworks.com/openclaw-ai-supply-chain-risk/",
  "https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html",
  "https://www.esecurityplanet.com/threats/hundreds-of-malicious-skills-found-in-openclaws-clawhub/",
  "https://www.darkreading.com/cyber-risk/malicious-openclaw-skills-clawhub-threaten-ai-supply-chain",
  "https://cybersecuritynews.com/openclaw-skill-marketplace-exposes-ai-agents/",
  "https://www.termdock.com/en/blog/clawhub-malicious-skills-incident",
  "https://www.pointguardai.com/ai-security-incidents/openclaw-clawhub-malicious-skills-supply-chain-attack",
  "https://steipete.me/posts/2026/openclaw",
  "https://lexfridman.com/peter-steinberger/",
  "https://en.wikipedia.org/wiki/Peter_Steinberger_(programmer)",
  "https://releasebot.io/updates/openclaw",
  "https://www.gradually.ai/en/changelogs/openclaw/",
  "https://oneclickclaw.io/news/openclaw-2026-7-1-update-what-to-know",
] as const;

const EXPECTED_MERMAID_SOURCES = [
  `flowchart TB
    subgraph CH["チャネル層 (Channel)"]
        A1["WhatsApp"]
        A2["Telegram"]
        A3["Slack / Discord"]
        A4["iMessage / Matrix など"]
    end
    A1 ~~~ A2 ~~~ A3 ~~~ A4
    CH --> GW["Gateway
    唯一の信頼境界・セッション管理"]
    GW --> BR["エージェントランタイム (Brain)
    推論・モデルルーティング"]
    BR --> BO["ツール実行層 (Body)
    シェル / ブラウザ / 外部API"]
    BR <--> WS[("ワークスペース
    SOUL.md / MEMORY.md 等")]
    BO --> EXT[("外部システム / ローカルファイル")]`,

  `flowchart TB
    S1["1. Normalize
    チャネル入力の正規化"] --> S2["2. Route
    セッション・エージェントの選定"]
    S2 --> S3["3. Assemble Context
    ブートストラップファイル+履歴+スキル一覧の読込"]
    S3 --> S4["4. Infer
    LLM推論"]
    S4 --> S5["5. ReAct
    ツール呼出しと観測の反復"]
    S5 --> S6["6. Load Skills
    必要なSKILL.mdをオンデマンド読込"]
    S6 --> S4
    S5 --> S7["7. Persist Memory
    MEMORY.md / 日次ログへ反映"]`,

  `flowchart TB
    SOUL["SOUL.md
    人格・価値観・境界線"] --> IDENT["IDENTITY.md
    エージェント自己情報"]
    IDENT --> USERMD["USER.md
    ユーザーコンテキスト"]
    USERMD --> AGENTSMD["AGENTS.md
    手続き的ルール・ツール利用方針"]
    AGENTSMD --> TOOLSMD["TOOLS.md
    環境固有ツールメモ"]
    TOOLSMD --> MEM["MEMORY.md
    永続知識"]
    MEM --> SYS[("システムプロンプトとして合成")]`,

  `flowchart TB
    F["ClawHubでスキルを発見"] --> C1{"公式 / 検証済み
    パブリッシャーか"}
    C1 -->|"No"| STOP1["導入を見送る、
    またはソースを精査する"]
    C1 -->|"Yes"| C2{"SKILL.md本文と
    コメント欄を目視確認したか"}
    C2 -->|"No"| REVIEW["README・コメント欄の
    不審なコマンド/リンクを確認"]
    REVIEW --> C2
    C2 -->|"Yes"| C3{"要求される権限
    (ファイル/認証情報/実行)は最小限か"}
    C3 -->|"No"| STOP2["権限スコープを縮小、
    または導入を却下"]
    C3 -->|"Yes"| INSTALL["隔離環境でテスト導入"]
    INSTALL --> MONITOR["openclaw security audit
    で継続的に監視"]`,

  `flowchart TB
    Q{"定期タスクの性質は?"}
    Q -->|"状態を見て判断・監視したい"| HB["Heartbeat"]
    Q -->|"決まった時刻に確実に実行したい"| CR["Cron"]
    HB --> HB1["isolatedSession: true
    軽量モデルを割り当てる"]
    HB1 --> HB2["HEARTBEAT.mdに
    静穏時間・エスカレーション条件を明記"]
    CR --> CR1["detachedセッションで実行"]
    CR1 --> CR2["ジョブごとにモデル階層を指定"]`,

  `flowchart TB
    T["タスク受信"] --> D1{"Heartbeatや
    単純な定型チェックか"}
    D1 -->|"Yes"| M1["Tier1: 最安モデル
    (Haiku / Flash / DeepSeek等)"]
    D1 -->|"No"| D2{"サブエージェントの
    並列作業か"}
    D2 -->|"Yes"| M2["Tier2: 中コストモデル"]
    D2 -->|"No"| D3{"高度な推論・
    本会話・重要判断か"}
    D3 -->|"Yes"| M3["Tier3: 最上位モデル
    (Opus / Sonnet 等)"]
    D3 -->|"No"| M2`,

  `flowchart TB
    P1["① 秘匿データへのアクセス"] --> RISK{"3条件が揃うと
    プロンプトインジェクションによる
    実被害リスクが急増する"}
    P2["② 未信頼コンテンツへの露出
    (メール・Webページ・共有連絡先など)"] --> RISK
    P3["③ 外部への通信能力
    (送信・投稿・API呼出)"] --> RISK
    RISK --> OUT["機密データの持出し・
    意図しない外部操作"]`,
] as const;

function cleanText(text: string | null | undefined): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function normalizeMermaidSource(raw: string): string {
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  while (lines.length > 0 && lines[0].trim() === "") lines.shift();
  while (lines.length > 0 && lines.at(-1)?.trim() === "") lines.pop();
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const commonIndent = indents.length > 0 ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(commonIndent).trimEnd()).join("\n");
}

describe("OpenClaw Agent 実践ベストプラクティスガイド 契約テスト", () => {
  // S. 原本照合契約
  it("S-1: h2 の見出しが原本と完全一致（順序込み）", () => {
    const { container } = render(<Page />);
    const actualH2 = Array.from(container.querySelectorAll("h2")).map((el) =>
      cleanText(el.textContent)
    );
    expect(actualH2).toEqual([...EXPECTED_H2]);
  });

  it("S-2: h3 の見出しが原本と完全一致（順序込み）", () => {
    const { container } = render(<Page />);
    const actualH3 = Array.from(container.querySelectorAll("h3")).map((el) =>
      cleanText(el.textContent)
    );
    expect(actualH3).toEqual([...EXPECTED_H3]);
  });

  it("S-3: 原本の外部リンク URL が全件存在", () => {
    const { container } = render(<Page />);
    const hrefs = new Set(
      Array.from(container.querySelectorAll("a[href]"))
        .map((a) => a.getAttribute("href"))
        .filter((h): h is string => Boolean(h?.startsWith("http")))
    );
    for (const url of EXPECTED_EXTERNAL_LINKS) {
      expect(hrefs.has(url)).toBe(true);
    }
  });

  it("S-4: 全 h2/h3 が一意な id または section id を持ち、TOC アンカーが実在する見出し/セクションを指す", () => {
    const { container } = render(<Page />);
    const tocLinks = Array.from(container.querySelectorAll(`nav[aria-label="目次"] a`));
    expect(tocLinks.length).toBe(12);

    for (const link of tocLinks) {
      const href = link.getAttribute("href");
      expect(href).toMatch(/^#[a-zA-Z0-9_-]+$/);
      const targetId = href?.slice(1);
      const targetEl = container.querySelector(`#${targetId}`);
      expect(targetEl).not.toBeNull();
    }
  });

  // C. コンテンツ契約
  it("C-1: h1 のテキストが完全一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(cleanText(h1?.textContent)).toBe(EXPECTED_H1[0]);
  });

  it("C-2: クイックナビ（TOC リンク）の件数と href 形式", () => {
    const { container } = render(<Page />);
    const tocLinks = Array.from(container.querySelectorAll(`nav[aria-label="目次"] a`));
    expect(tocLinks.length).toBe(12);
    for (const link of tocLinks) {
      expect(link.getAttribute("href")).toMatch(/^#[a-z0-9-]+$/);
    }
  });

  it("C-3: サイドバー TOC の初期アクティブ状態が存在する", () => {
    const { container } = render(<Page />);
    const activeLink = container.querySelector(`nav[aria-label="目次"] a.${styles.active}`);
    expect(activeLink).not.toBeNull();
  });

  it('C-4: 外部リンク全件に target="_blank" かつ rel="noopener noreferrer"', () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll('a[href^="http"]'));
    expect(externalLinks.length).toBeGreaterThanOrEqual(EXPECTED_EXTERNAL_LINKS.length);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("C-5: 内部リンクに .html 拡張子が含まれない", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll("a[href]"))
      .map((a) => a.getAttribute("href") ?? "")
      .filter((href) => href && !href.startsWith("http") && !href.startsWith("#"));
    for (const href of internalLinks) {
      expect(href).not.toContain(".html");
    }
  });

  it("C-6a: Mermaid ソースが原本と順序・内容・出現回数込みで完全一致する", () => {
    const { container } = render(<Page />);
    const actual = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map((el) =>
      normalizeMermaidSource(el.textContent ?? "")
    );
    expect(actual).toEqual([...EXPECTED_MERMAID_SOURCES]);
  });

  it("C-6b: 全 Mermaid 図解がページ専用ラッパーに包まれている", () => {
    const { container } = render(<Page />);
    const diagrams = Array.from(container.querySelectorAll('[data-testid="mermaid"]'));
    const wrapped = Array.from(
      container.querySelectorAll(`.${styles.diagramFrame} [data-testid="mermaid"]`)
    );
    expect(wrapped).toEqual(diagrams);
  });

  // D. デザイン契約
  it("D-1: callout が variant (warn / danger / default) で区別されている", () => {
    const { container } = render(<Page />);
    const warnCallouts = container.querySelectorAll(`.${styles.calloutWarn}`);
    const dangerCallouts = container.querySelectorAll(`.${styles.calloutDanger}`);
    const defaultCallouts = container.querySelectorAll(
      `.${styles.callout}:not(.${styles.calloutWarn}):not(.${styles.calloutDanger})`
    );
    expect(warnCallouts.length).toBeGreaterThan(0);
    expect(dangerCallouts.length).toBeGreaterThan(0);
    expect(defaultCallouts.length).toBeGreaterThan(0);
  });

  it("D-2: step-list が存在し、ステップ項目が含まれる", () => {
    const { container } = render(<Page />);
    const stepList = container.querySelector(`.${styles.stepList}`);
    expect(stepList).not.toBeNull();
    const items = stepList?.querySelectorAll("li");
    expect(items?.length).toBe(11);
  });

  it("D-3: code-block が存在し、コピーボタンが配置されている", () => {
    const { container } = render(<Page />);
    const codeBlocks = container.querySelectorAll(`.${styles.codeBlock}`);
    expect(codeBlocks.length).toBe(3);
    const copyButtons = container.querySelectorAll('[data-testid="code-copy-button"]');
    expect(copyButtons.length).toBe(3);
  });

  it("D-4: レイアウト構造に layout と main が存在する", () => {
    const { container } = render(<Page />);
    expect(container.querySelector(`.${styles.layout}`)).not.toBeNull();
    expect(container.querySelector("main")).not.toBeNull();
    expect(container.querySelector("aside")).not.toBeNull();
  });

  // Q. 品質契約
  it("Q-1: export const metadata の title / description が適切に設定されている", () => {
    expect(metadata.title).toContain("OpenClaw");
    expect(metadata.title).toContain("実践ベストプラクティスガイド");
    expect(metadata.description).toBeDefined();
    expect((metadata.description as string).length).toBeGreaterThan(20);
  });

  it("Q-2: 見出し階層がスキップされていない（h1 -> h2 -> h3）", () => {
    const { container } = render(<Page />);
    const headings = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    let lastLevel = 0;
    for (const h of headings) {
      const level = Number.parseInt(h.tagName.substring(1), 10);
      if (lastLevel > 0) {
        expect(level - lastLevel).toBeLessThanOrEqual(1);
      }
      lastLevel = level;
    }
  });
});
