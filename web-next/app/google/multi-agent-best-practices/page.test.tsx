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

const EXPECTED_H1 = ["Gemini マルチエージェント開発ベストプラクティス完全ガイド"] as const;

const EXPECTED_H2 = [
  "0. はじめに — このガイドを読む前に知っておくべきこと",
  "1. エコシステム全体像を1枚の図でつかむ",
  "2. GEMINI.md — プロジェクトの「文脈」を教える指示書",
  "3. GEMINI.md と AGENTS.md — どちらを使うべきか",
  "4. マルチエージェント向け GEMINI.md / AGENTS.md 設計",
  "5. .geminiignore — 見せたくないファイルを隠す",
  "6. settings.json — CLI 挙動の中枢設定",
  "7. サブエージェント（Subagents）の設計",
  "8. リモートサブエージェントと A2A プロトコル入門",
  "9. agent.py — ADK でのエージェント実装パターン",
  "10. RemoteA2aAgent 実装パターンの詳細",
  "11. Vertex AI Agent Engine へのデプロイ",
  "12. ADK 2.0: Agent と Workflow の使い分け",
  "13. セキュリティ・ガバナンスのベストプラクティス",
  "14. 総合ステップバイステップ: ゼロからのマルチエージェント構築フロー",
  "15. 参考文献・出典",
] as const;

const EXPECTED_H3 = [
  "2026年7月時点の重要な前提（必ず先に読んでください）",
  "2.1 何をするファイルか",
  "2.2 3段階の階層システム（超重要）",
  "2.3 書き方のベストプラクティス（ステップバイステップ）",
  "2.4 実践チェックリスト",
  "3.1 AGENTS.md とは何か",
  "3.2 なぜ2つ存在するのか、どう使い分けるか",
  "3.3 実は共存できる — settings.json での統合設定",
  "3.4 ステップバイステップ: 移行手順",
  "4.1 モノレポ型階層設計",
  "4.2 マルチエージェント特有の記述内容",
  "4.3 サブエージェント定義ファイルとの役割分担",
  "5.1 仕組み",
  "5.2 構文ルール",
  "5.3 実践例",
  "6.1 設定ファイルの場所と優先順位",
  "6.2 マルチエージェント開発で特に重要なカテゴリ",
  "6.3 サブエージェント向け設定例",
  "6.4 MCPサーバー連携の設定例",
  "6.5 サブエージェントを無効化したい場合",
  "7.1 サブエージェントとは",
  "7.2 組み込みサブエージェント",
  "7.3 カスタムサブエージェントの作り方（ステップバイステップ）",
  "7.4 フロントマター スキーマ一覧",
  "7.5 ツール分離と再帰防止",
  "7.6 サブエージェント単位のポリシー制御",
  "7.7 説明文（description）の最適化がすべてを左右する",
  "8.1 A2A（Agent-to-Agent）プロトコルとは何か",
  "8.2 Agent Card（agent.json）の主要フィールド",
  "8.3 Gemini CLI からリモートサブエージェントを定義する",
  "8.4 認証方式の比較",
  "9.1 基本のエージェント定義",
  "9.2 マルチエージェント分割のパターン（SequentialAgent）",
  "9.3 サブエージェント間のデータ受け渡し（共有状態）",
  "9.4 マルチエージェントパイプラインの全体像",
  "10.1 3つの指定方法",
  "10.2 サブエージェントとして組み込む",
  "10.3 逆方向: 自分のエージェントをA2A対応で公開する（to_a2a()）",
  "10.4 もう一つの公開方法: adk api_server --a2a",
  "10.5 開発時のディレクトリ構成例",
  "11.1 Agent Engine とは",
  "11.2 デプロイ手順（ステップバイステップ）",
  "11.3 コードから直接デプロイする方法（in-memory object deployment）",
  "11.4 デプロイしたエージェントをA2A経由で呼び出す",
  "11.5 デプロイ先の比較",
  "12.1 なぜ「決定論的ワークフロー」が必要になったのか",
  "12.2 使い分けの判断基準",
  "12.3 効果の実例（公開されているベンチマーク）",
  "12.4 Workflow の考え方（概念図）",
  "13.1 チェックリスト",
  "13.2 認証情報の取り扱いに関する注意",
  "Gemini CLI 公式ドキュメント",
  "Google 公式ブログ・アナウンス",
  "ADK 公式ドキュメント / GitHub",
  "AGENTS.md オープン標準",
  "実装者・Google Developer Expertによる技術記事",
] as const;

const EXPECTED_EXTERNAL_LINKS = [
  "https://geminicli.com/docs/cli/gemini-md/",
  "https://geminicli.com/docs/cli/gemini-ignore/",
  "https://geminicli.com/docs/cli/settings/",
  "https://geminicli.com/docs/core/subagents/",
  "https://geminicli.com/docs/core/remote-agents/",
  "https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli",
  "https://developers.googleblog.com/why-we-built-adk-20/",
  "https://developers.googleblog.com/build-cross-language-multi-agent-team-with-google-agent-development-kit-and-a2a/",
  "https://adk.dev/a2a/quickstart-exposing/",
  "https://github.com/google/adk-python/blob/main/src/google/adk/agents/remote_a2a_agent.py",
  "https://codelabs.developers.google.com/codelabs/create-multi-agents-adk-a2a",
  "https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/use/adk",
  "https://www.skills.google/focuses/132170?parent=catalog",
  "https://agents.md/",
  "https://github.com/agentsmd/agents.md",
  "https://medium.com/google-cloud/multi-agent-a2a-with-the-agent-development-kitadk-cloud-run-and-gemini-cli-52f8be838ad6",
  "https://michael-scherding.medium.com/deploying-ai-agents-with-google-adk-and-vertex-ai-agent-engine-62a5c19396ff",
  "https://michael-scherding.medium.com/a2a-explained-with-google-adk-140b35ad04ad",
] as const;

const EXPECTED_MERMAID_SOURCES = [
  `flowchart TB
    subgraph LOCAL["ローカル開発環境"]
        GM["GEMINI.md / AGENTS.md<br/>（プロジェクト文脈）"]
        GI[".geminiignore<br/>（除外ファイル）"]
        ST["settings.json<br/>（CLI挙動設定）"]
        AG["agent.py<br/>（ADKでのエージェント定義）"]
    end

    subgraph CLI["Gemini CLI / Antigravity CLI"]
        CORE["Core: モデル呼び出し・ツール実行・ReActループ"]
        SUB["ローカル サブエージェント<br/>（.gemini/agents/*.md）"]
    end

    subgraph REMOTE["リモート/他言語エージェント"]
        CARD["agent.json（Agent Card）<br/>= .well-known/agent.json"]
        RAGENT["RemoteA2aAgent<br/>（A2Aクライアント）"]
        SERVER["A2Aサーバー<br/>（Python/Go/Java等）"]
    end

    subgraph CLOUD["本番環境"]
        AE["Vertex AI Agent Engine<br/>（Reasoning Engine）"]
    end

    GM --> CORE
    GI --> CORE
    ST --> CORE
    CORE --> SUB
    AG --> RAGENT
    RAGENT -- "Agent Card取得" --> CARD
    RAGENT -- "JSON-RPC通信" --> SERVER
    CARD --- SERVER
    AG -- "adk deploy agent_engine" --> AE
    AE -- "A2Aエンドポイント公開" --> RAGENT`,

  `flowchart TB
    A["① グローバル文脈ファイル<br/>~/.gemini/GEMINI.md<br/>（全プロジェクト共通のデフォルト指示）"]
    B["② ワークスペース文脈ファイル<br/>作業ディレクトリとその親ディレクトリを探索<br/>（現在取り組んでいるプロジェクト向け）"]
    C["③ Just-In-Time (JIT) 文脈ファイル<br/>ツールがファイル/ディレクトリにアクセスした瞬間に<br/>そのディレクトリとその祖先を自動スキャン"]
    D["すべて連結してモデルへ送信<br/>（CLIフッターに読み込み済みファイル数を表示）"]
    A --> D
    B --> D
    C --> D`,

  `flowchart TB
    ROOT["/AGENTS.md（ルート）<br/>全体アーキテクチャ・共通規約・禁止事項"]
    ROOT --> PY["/agents/python-extractor/AGENTS.md<br/>Python固有: Gemini呼び出し規約・型ヒント方針"]
    ROOT --> GO["/agents/go-compliance/AGENTS.md<br/>Go固有: エラーハンドリング規約・ビルドコマンド"]
    ROOT --> ORCH["/orchestrator/GEMINI.md<br/>オーケストレーター固有: サブエージェント呼び出し順序"]`,

  `flowchart LR
    U["ユーザーのプロンプト"] --> MAIN["メインエージェント<br/>（Gemini CLI Core）"]
    MAIN -- "自動委譲 or @エージェント名で明示指定" --> SUB1["ローカルサブエージェント<br/>（独立したコンテキストウィンドウ）"]
    MAIN -- "A2Aプロトコル経由" --> SUB2["リモートサブエージェント<br/>（別プロセス/別言語/別クラウド）"]
    SUB1 -- "結果のみ報告" --> MAIN
    SUB2 -- "結果のみ報告" --> MAIN
    MAIN --> ANS["ユーザーへの応答"]`,

  `sequenceDiagram
    participant L as ローカルエージェント<br/>(RemoteA2aAgent)
    participant R as リモートエージェント<br/>(A2Aサーバー)

    L->>R: GET /.well-known/agent.json
    R-->>L: Agent Card（名前・スキル・対応プロトコル・認証方式）
    Note over L,R: カードを解析し、呼び出し可能なスキルを把握
    L->>R: POST JSON-RPC message/send（タスク送信）
    R-->>L: Task状態: working
    R-->>L: Task状態: completed（結果データを含む）
    alt リモートが応答不能な場合
        R--xL: タイムアウト / エラー
        L->>L: フェイルセーフ状態へ遷移（例: MANUAL_REVIEW）
    end`,

  `flowchart LR
    IN["契約書入力"] --> EX["extractor_agent<br/>（Python / Gemini）"]
    EX -- "共有state経由でデータ受け渡し" --> CO["compliance_agent<br/>（RemoteA2aAgent → Go製サーバー）"]
    CO -- "正常応答" --> RE["report_agent<br/>（Python / Gemini）"]
    CO -- "タイムアウト/エラー" --> MR["MANUAL_REVIEW<br/>（人間のレビューへ）"]
    RE --> OUT["最終監査レポート出力"]`,

  `flowchart LR
    A["ローカルのagent.py<br/>（root_agent定義）"] --> B["adk deploy agent_engine<br/>（CLIコマンド）"]
    B --> C["コンテナビルド"]
    C --> D["Vertex AI Agent Engine<br/>（Reasoning Engine リソース）"]
    D --> E["REST / A2A エンドポイント公開"]
    E --> F["クライアント<br/>（Vertex AI SDK / REST / RemoteA2aAgent）"]`,

  `flowchart TD
    START(["開始"]) --> A["Node A（ツール）<br/>購入履歴をDB/API経由で取得"]
    A --> B["Node B（LLMエージェント）<br/>非構造化のメール内容をポリシー例外と照合"]
    B -->|"true"| C["Node C（ツール）<br/>Stripe APIで返金を実行"]
    B -->|"false"| E["Node E（ツール）<br/>CRMのチケットを更新して終了"]
    C --> D["Node D（LLMエージェント）<br/>確認メールの文面をドラフト"]
    D --> E`,
] as const;

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

function cleanHeadingText(text: string | null): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

describe("Gemini Multi-Agent Best Practices Page Contract Tests", () => {
  // S. 原本照合契約 (4件・必須)
  describe("S. 原本照合契約", () => {
    it("S-1: h2 の見出しが原本と完全一致（順序込み）", () => {
      const { container } = render(<Page />);
      const actual = Array.from(container.querySelectorAll("h2")).map((el) =>
        cleanHeadingText(el.textContent)
      );
      expect(actual).toEqual([...EXPECTED_H2]);
    });

    it("S-2: h3 の見出しが原本と完全一致（順序込み）", () => {
      const { container } = render(<Page />);
      const actual = Array.from(container.querySelectorAll("h3")).map((el) =>
        cleanHeadingText(el.textContent)
      );
      expect(actual).toEqual([...EXPECTED_H3]);
    });

    it("S-3: 原本の外部リンク URL が全件存在", () => {
      const { container } = render(<Page />);
      const hrefs = Array.from(container.querySelectorAll("a"))
        .map((a) => a.getAttribute("href") ?? "")
        .filter((href) => href.startsWith("http://") || href.startsWith("https://"));
      for (const expectedUrl of EXPECTED_EXTERNAL_LINKS) {
        expect(hrefs).toContain(expectedUrl);
      }
    });

    it("S-4: 全 h2/h3 が一意な id を持ち、TOC のアンカーが全て実在する見出しを指す", () => {
      const { container } = render(<Page />);
      const headings = Array.from(container.querySelectorAll("h2, h3"));
      const ids = headings.map((h) => h.getAttribute("id")).filter(Boolean);

      expect(ids.length).toBe(headings.length);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);

      const tocLinks = Array.from(
        container.querySelectorAll(`nav a[href^="#"], .${styles.sideNav} a[href^="#"]`)
      );
      expect(tocLinks.length).toBeGreaterThan(0);
      for (const link of tocLinks) {
        const targetId = link.getAttribute("href")?.slice(1);
        expect(ids).toContain(targetId);
      }
    });
  });

  // C. コンテンツ契約 (6件)
  describe("C. コンテンツ契約", () => {
    it("C-1: h1 のテキストが完全一致する", () => {
      const { container } = render(<Page />);
      const h1 = container.querySelector("h1");
      expect(cleanHeadingText(h1?.textContent ?? null)).toBe(EXPECTED_H1[0]);
    });

    it("C-2: クイックナビ（TOC リンク）の件数と href 形式", () => {
      const { container } = render(<Page />);
      const tocLinks = Array.from(container.querySelectorAll(`.${styles.sideNav} a[href^="#"]`));
      expect(tocLinks.length).toBe(EXPECTED_H2.length);
      for (const link of tocLinks) {
        const href = link.getAttribute("href");
        expect(href).toMatch(/^#[a-zA-Z0-9_\-\u3000-\u30FE\u4E00-\u9FFF]+/);
      }
    });

    it("C-3: サイドバー TOC の初期アクティブ状態（styles.active）が存在する", () => {
      const { container } = render(<Page />);
      const activeLink = container.querySelector(`.${styles.sideNav} a.${styles.active}`);
      expect(activeLink).not.toBeNull();
    });

    it("C-4: 外部リンク全件に target='_blank' かつ rel='noopener noreferrer'", () => {
      const { container } = render(<Page />);
      const externals = Array.from(container.querySelectorAll("a")).filter((a) => {
        const href = a.getAttribute("href") ?? "";
        return href.startsWith("http://") || href.startsWith("https://");
      });
      expect(externals.length).toBeGreaterThan(0);
      for (const link of externals) {
        expect(link.getAttribute("target")).toBe("_blank");
        expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      }
    });

    it("C-5: 内部リンクに .html 拡張子が含まれない", () => {
      const { container } = render(<Page />);
      const internals = Array.from(container.querySelectorAll("a")).filter((a) => {
        const href = a.getAttribute("href") ?? "";
        return !href.startsWith("http") && !href.startsWith("#");
      });
      for (const link of internals) {
        const href = link.getAttribute("href") ?? "";
        expect(href.endsWith(".html")).toBe(false);
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
        container.querySelectorAll(`.${styles.mermaidWrap} [data-testid="mermaid"]`)
      );
      expect(wrapped).toEqual(diagrams);
    });

    it("C-6c: 各図解が空でなく、有効な図種別で始まる", () => {
      const { container } = render(<Page />);
      const charts = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map((el) =>
        (el.textContent ?? "").trim()
      );
      for (const chart of charts) {
        expect(chart.length).toBeGreaterThan(0);
        expect(chart).toMatch(
          /^(flowchart|sequenceDiagram|graph|mindmap|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|journey|timeline)\b/
        );
      }
    });

    it("C-6d: 禁止構文 block-beta を使っていない", () => {
      const { container } = render(<Page />);
      const charts = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map(
        (el) => el.textContent ?? ""
      );
      for (const chart of charts) {
        expect(chart).not.toContain("block-beta");
      }
    });

    it("C-6e: 図解のソースが左端揃え（先頭行にインデントが無い）", () => {
      const { container } = render(<Page />);
      const charts = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map(
        (el) => el.textContent ?? ""
      );
      for (const chart of charts) {
        const firstLine = chart.split("\n").find((l) => l.trim().length > 0) ?? "";
        expect(firstLine).toBe(firstLine.trimStart());
      }
    });
  });

  // D. デザイン契約
  describe("D. デザイン契約", () => {
    it("D-5: サイドバーナビが存在し data-testid='sidebar-nav' を持つ", () => {
      const { container } = render(<Page />);
      const sidebar = container.querySelector('[data-testid="sidebar-nav"]');
      expect(sidebar).not.toBeNull();
    });

    it("D-6: コードブロックが data-testid='code-block' で識別される", () => {
      const { container } = render(<Page />);
      const codeBlocks = container.querySelectorAll('[data-testid="code-block"]');
      expect(codeBlocks.length).toBe(28);
    });

    it("D-7: 外部 CSS リンク（atom-one-dark）が存在する", () => {
      const { container } = render(<Page />);
      const link = container.querySelector(
        'link[href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css"]'
      );
      expect(link).not.toBeNull();
    });

    it("D-8: .layout に data-testid='layout-root' がある", () => {
      const { container } = render(<Page />);
      const layout = container.querySelector('[data-testid="layout-root"]');
      expect(layout).not.toBeNull();
    });
  });

  // Q. 品質契約 (3件・必須)
  describe("Q. 品質契約", () => {
    it("Q-2: export const metadata の title / description が適切に定義されている", () => {
      expect(metadata).toBeDefined();
      const title =
        typeof metadata.title === "string"
          ? metadata.title
          : (metadata.title as { default?: string } | undefined)?.default;
      expect(title).toContain("Gemini マルチエージェント開発 ベストプラクティス完全ガイド");
      expect(typeof metadata.description).toBe("string");
      expect((metadata.description as string).length).toBeGreaterThan(0);
    });

    it("Q-3: 見出し階層が飛ばない（h1 → h3 等のスキップが無い）", () => {
      const { container } = render(<Page />);
      const headings = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6"));
      let lastLevel = 1;
      for (const h of headings) {
        const level = parseInt(h.tagName.substring(1), 10);
        expect(level).toBeLessThanOrEqual(lastLevel + 1);
        lastLevel = level;
      }
    });
  });
});
