// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { normalizeMermaidSource } from "@/tests/helpers/mermaid";
import GithubCopilotPage, { metadata } from "./page";

// 実 Mermaid は jsdom で描画できないため、chart をそのまま吐くダミーへ差し替え、
// ページが渡す図解ソースを原本と突き合わせられるようにする。
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

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

/** 原本 <pre class="mermaid"> のソース（出現順）。 */
const EXPECTED_MERMAID_SOURCES = [
  `flowchart TB
    A["GitHub Copilot<br/>共通ハーネス"] --> B["インライン補完 / NES<br/>(Next Edit Suggestions)"]
    A --> C["Copilot Chat<br/>Ask / Edit / Agent"]
    A --> D["Copilot CLI<br/>ターミナル常駐エージェント"]
    A --> E["Copilot Coding Agent<br/>(クラウド/バックグラウンド)"]
    A --> F["Copilot Code Review<br/>PRレビュー自動化"]
    A --> G["Copilot Spaces<br/>チームのナレッジベース"]
    A --> H["Copilot App<br/>キャンバス型の新インターフェース"]

    C --> C1["VS Code / Visual Studio / JetBrains<br/>/ Eclipse / Xcode"]
    D --> D1["/plan・Autopilot・Allow All"]
    E --> E1["@copilot へIssueを割り当て"]
    F --> F1["Agent Skills + MCP(GA)"]`,
  `flowchart TD
    Start["タスクを分類する"] --> Q1{"コードを変更する必要があるか?"}
    Q1 -- "いいえ(説明・学習・調査のみ)" --> Ask["Ask モード<br/>質問応答のみ、ファイル変更なし"]
    Q1 -- "はい" --> Q2{"変更範囲は単一ファイルか?"}
    Q2 -- "はい(対象が明確)" --> Edit["Edit モード<br/>選択ファイル内で編集"]
    Q2 -- "いいえ(複数ファイル・調査・<br/>ツール実行が必要)" --> Agent["Agent モード<br/>自律的に計画・編集・実行・修正"]
    Agent --> Q3{"MCPサーバーや外部ツール<br/>連携が必要か?"}
    Q3 -- "はい" --> AgentMCP["Agent モード + MCP接続"]
    Q3 -- "いいえ" --> AgentPlain["Agent モードのみで実行"]`,
  `flowchart TD
    P["個人インストラクション<br/>(ユーザー単位・全プロジェクト共通)"] --> Merge["Copilotが全てのソースを<br/>統合してコンテキストに含める"]
    R["リポジトリインストラクション<br/>.github/copilot-instructions.md"] --> Merge
    Path["パス限定インストラクション<br/>.github/instructions/**.instructions.md<br/>(applyTo で対象パスを指定)"] --> Merge
    Agents["AGENTS.md<br/>(エージェント/CLI/コーディングエージェント向け)"] --> Merge
    Merge --> Priority["優先順位: 個人 > リポジトリ > 組織<br/>(ただし全て同時にコンテキストへ供給される)"]
    Priority --> Output["矛盾する指示は避けること<br/>(競合時は個人インストラクションが優先)"]`,
  `flowchart LR
    Repo["ナレッジベースリポジトリ<br/>(コーディング規約・ADR・セキュリティルール<br/>・テスト規約・テンプレート)"] --> Space["Copilot Space<br/>「エンジニアリング標準コーチ」"]
    App["アプリケーションリポジトリ"] --> Space
    Instr["指示(Rules of Engagement)"] --> Space
    Space --> Dev["開発者からの質問"]
    Dev --> Answer["標準に沿った回答<br/>+ 準拠している規約の明示<br/>+ レビュー用チェックリスト"]`,
  `flowchart TD
    S1["① ツールを1つ選ぶ<br/>(CLI / VS Code / Visual Studio / JetBrains)"] --> S2["② YOLOモード(Allow All)を有効化<br/>※必ずサンドボックス内で"]
    S2 --> S3["③ プロトタイプから始める<br/>複数バリエーションを一括生成"]
    S3 --> S4["④ Planモードで方法論的に計画<br/>/plan でエッジケースを洗い出す"]
    S4 --> S5["⑤ Autopilotで実装<br/>計画の各項目を自律的に完了"]
    S5 --> S6["⑥ 人間によるレビューと反復<br/>妥協せず品質を追求する"]
    S6 --> S7["⑦ Rubber Duckレビュー<br/>別系統のモデルに二重チェックさせる"]
    S7 --> S8["⑧ コミット<br/>新しいトピックは新セッションで"]`,
  `sequenceDiagram
    participant Dev as 開発者
    participant CLI as Copilot CLI
    participant Repo as リポジトリ/ファイルシステム

    Dev->>CLI: プロンプトを入力
    CLI->>Repo: AGENTS.md / copilot-instructions.md<br/>を自動検出・読み込み
    Dev->>CLI: Shift+Tab で Plan モードへ切替
    CLI->>Dev: 質問を重ねながら実装計画を提示
    Dev->>CLI: 計画を承認
    CLI->>Repo: Autopilotでファイル読み書き・<br/>コマンド実行(許可された範囲で)
    CLI-->>Dev: 進捗と結果を報告
    Dev->>CLI: /allow-all でYOLOモードに切替(任意)
    Note over CLI,Repo: サンドボックス環境(/sandbox enable, --cloud)を<br/>推奨(いずれもPublic Preview, 2026年7月時点)`,
  `sequenceDiagram
    participant Dev as 開発者
    participant Issue as GitHub Issue
    participant Agent as Copilot Coding Agent
    participant PR as Pull Request

    Dev->>Issue: Issueを作成し、要件・受け入れ条件を明記
    Dev->>Agent: Issueを @copilot にアサイン
    Agent->>Agent: AGENTS.md / copilot-instructions.md /<br/>.instructions.md を読み込み
    Agent->>Agent: MCPサーバー(GitHub MCP等)を用いて<br/>リポジトリ情報・Issue履歴を収集
    Agent->>PR: ドラフトPRを作成しコミットをpush
    Agent->>Dev: レビュアーとして開発者を追加、通知
    Dev->>PR: 人間と同じレビュープロセスでマージ判断`,
  `flowchart TD
    PR["Pull Requestが作成される"] --> Review["Copilot Code Reviewが起動<br/>(GitHub Actionsで実行)"]
    Review --> Skill{".github/skills 配下に<br/>SKILL.md はあるか?"}
    Skill -- "あり" --> SkillUse["リポジトリ/組織固有の規約・<br/>内部ツールをレビューに反映"]
    Skill -- "なし" --> Default["Copilotの標準分析のみ"]
    Review --> MCP{"MCPサーバー設定は<br/>あるか?"}
    MCP -- "あり(読み取り専用)" --> MCPUse["Issueトラッカー・ドキュメント・<br/>サービスカタログ等から文脈を取得"]
    MCP -- "なし" --> DefaultMCP["GitHub MCP / Playwright MCPが<br/>既定で有効"]
    SkillUse --> Comment["レビューコメントを生成"]
    MCPUse --> Comment
    Default --> Comment
    DefaultMCP --> Comment
    Comment --> Attribution["コメントにSkill/MCPの<br/>出典を明示(Attribution)"]`,
  `flowchart TD
    Task["タスクの性質を評価"] --> Simple{"構文・定型文・<br/>ボイラープレート程度か?"}
    Simple -- "はい" --> Fast["高速・低コストモデル<br/>(Haiku系 / Grok Code Fast 等)"]
    Simple -- "いいえ" --> Mid{"標準的な機能実装・<br/>アルゴリズムか?"}
    Mid -- "はい" --> Balanced["バランス型モデル<br/>(Sonnet系 / GPT-5.4系等)を<br/>中程度の推論レベルで"]
    Mid -- "いいえ" --> Hard{"アーキテクチャ設計・<br/>ミッションクリティカルな判断か?"}
    Hard -- "はい" --> Premium["フラッグシップモデル<br/>(Opus系 / GPT-5.5系等)"]
    Hard -- "いいえ" --> Context{"非常に大きな<br/>コンテキストが必要か?"}
    Context -- "はい" --> LargeCtx["大規模コンテキスト対応モデル<br/>(Gemini Pro系等)"]
    Context -- "いいえ" --> Balanced`,
  `flowchart TD
    Threat["脅威: プロンプトインジェクション<br/>(コード/コメント/Issue/PRコメント/<br/>ツール出力に隠された指示)"] --> L1["対策① 最小権限の原則<br/>エージェントに与えるデータ・権限を必要最小限に"]
    Threat --> L2["対策② サンドボックス実行<br/>Codespaces / Dev Container / /sandbox enable"]
    Threat --> L3["対策③ 人間によるレビュー<br/>PRマージ前の必須チェック"]
    Threat --> L4["対策④ MCP読み取り専用化<br/>書き込み権限は慎重に評価"]
    Threat --> L5["対策⑤ シークレット衛生<br/>プロンプト・環境変数にシークレットを含めない"]
    Threat --> L6["対策⑥ 監査可能性<br/>コミットの共著者表示・アクション属性の明確化"]
    L1 --> Result["攻撃が成功しても<br/>被害範囲(blast radius)を限定"]
    L2 --> Result
    L3 --> Result
    L4 --> Result
    L5 --> Result
    L6 --> Result`,
  `flowchart TD
    AP["よくあるアンチパターン"] --> AP1["何でもAgentモードで済ませる<br/>(高コストな割に精度が下がる)"]
    AP1 --> Fix1["→ タスクの性質に応じてAsk/Edit/Agentを使い分ける"]
    AP --> AP2["巨大で曖昧な1発プロンプト"]
    AP2 --> Fix2["→ プロトタイプ→計画(/plan)→実装の順に分解する"]
    AP --> AP3["生成コードを無検証でマージ"]
    AP3 --> Fix3["→ 必ず読み、テストし、レビューしてから採用する"]
    AP --> AP4["インストラクションファイルを肥大化させる"]
    AP4 --> Fix4["→ 1指示1文・600語以内を目安に簡潔化する"]
    AP --> AP5["ローカルマシンでYOLOモードを実行"]
    AP5 --> Fix5["→ Codespaces / Dev Containerなどサンドボックスで実行"]
    AP --> AP6["関係のない話題を1つのChatセッションに詰め込む"]
    AP6 --> Fix6["→ 話題ごとに新しいセッションを開始する"]`,
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
    // [id] で絞り込むと id 欠落の見出しが集合から消えてしまい、テストが素通りする。
    // 全 h2/h3 を集めてから「全件が空でない一意な id を持つ」ことを検証する。
    const headings = Array.from(container.querySelectorAll("main h2, main h3"));
    expect(headings.length).toBeGreaterThan(0);
    const ids = headings
      .map((h) => h.getAttribute("id"))
      .filter((id): id is string => id !== null && id.trim() !== "");
    expect(ids.length).toBe(headings.length);
    expect(new Set(ids).size).toBe(ids.length);

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

  // C-2: クイックナビ（TOC リンク）の href が h2 の id と順序込みで一致する
  it("C-2: クイックナビ（TOC リンク）の href が h2 の id と順序込みで一致する", () => {
    const { container } = render(<GithubCopilotPage />);
    // 件数だけでは「同じリンクを重複させて 1 本落とす」移行漏れを検知できないため、
    // 文書順の h2 id と href を配列ごと比較する。
    const headingHrefs = Array.from(container.querySelectorAll("h2[id]")).map((h2) => `#${h2.id}`);
    expect(headingHrefs).toHaveLength(EXPECTED_H2.length);

    const tocHrefs = Array.from(container.querySelectorAll('nav a[href^="#"]')).map((a) =>
      a.getAttribute("href")
    );
    expect(tocHrefs).toEqual(headingHrefs);
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

  // C-6: Mermaid ダイアグラムが原本と順序込みで完全一致する
  it("C-6: Mermaid ダイアグラムが原本と同数・同ソース・同順序で存在する", () => {
    const { container } = render(<GithubCopilotPage />);
    const actual = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map((el) =>
      normalizeMermaidSource(el.textContent ?? "")
    );
    // 件数だけでは図解を差し替えても通る。原本のソースと順序込みで比較する。
    expect(actual).toEqual(EXPECTED_MERMAID_SOURCES.map(normalizeMermaidSource));
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
