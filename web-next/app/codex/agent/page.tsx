import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "OpenAI Codex エージェント開発ガイド | LLM コスト計算機",
  description:
    "OpenAI Codex CLI (Rust製) および Agents SDK を使ったサブエージェント / マルチエージェント開発で必要な AGENTS.md・AGENTS.override.md・SKILL.md・config.toml の役割と書き方を体系化したガイド。初学者向け 7 ステップ入門から PM 駆動 SDD パターンまで網羅。",
};

type Source = {
  icon: string;
  title: string;
  href: string;
  url: string;
  desc: string;
};

const SOURCES_EXISTING: Source[] = [
  {
    icon: "⚙️",
    title: "OpenAI 公式: Custom instructions with AGENTS.md",
    href: "https://developers.openai.com/codex/guides/agents-md/",
    url: "developers.openai.com/codex/guides/agents-md/",
    desc: "AGENTS.md 読み込みチェーン・override.md・32KiB上限・project_doc_fallback_filenames の公式仕様",
  },
  {
    icon: "🤖",
    title: "OpenAI 公式: Multi-agents",
    href: "https://developers.openai.com/codex/multi-agent/",
    url: "developers.openai.com/codex/multi-agent/",
    desc: "config.toml [agents] セクション・ロール定義・max_depth・approval 継承の仕様",
  },
  {
    icon: "✨",
    title: "OpenAI 公式: Agent Skills",
    href: "https://developers.openai.com/codex/skills",
    url: "developers.openai.com/codex/skills",
    desc: "SKILL.md 仕様・プログレッシブディスクロージャー・agents/openai.yaml・スキャン優先度の公式ドキュメント",
  },
  {
    icon: "📋",
    title: "OpenAI Cookbook: Building Consistent Workflows with Codex CLI & Agents SDK",
    href: "https://cookbook.openai.com/examples/codex/codex_mcp_agents_sdk/building_consistent_workflows_codex_cli_agents_sdk",
    url: "cookbook.openai.com/…/building_consistent_workflows_codex_cli_agents_sdk",
    desc: "PM → REQUIREMENTS.md → AGENT_TASKS.md 駆動パターンの実装例",
  },
  {
    icon: "⚙️",
    title: "OpenAI 公式: Advanced Configuration",
    href: "https://developers.openai.com/codex/config-advanced/",
    url: "developers.openai.com/codex/config-advanced/",
    desc: "project_doc_max_bytes・project_root_markers・プロファイル・プロバイダー設定の詳細",
  },
  {
    icon: "📖",
    title: "OpenAI 公式: Configuration Reference",
    href: "https://developers.openai.com/codex/config-reference/",
    url: "developers.openai.com/codex/config-reference/",
    desc: "config.toml 全フィールド一覧・デフォルト値・型情報の公式リファレンス",
  },
  {
    icon: "🚀",
    title: "OpenAI 公式: Introducing Codex（codex-1 system message 公開）",
    href: "https://openai.com/index/introducing-codex/",
    url: "openai.com/index/introducing-codex/",
    desc: "codex-1 の system prompt における AGENTS.md 活用方法・PR形式・テスト実行の公式説明",
  },
  {
    icon: "⌨️",
    title: "OpenAI 公式: Slash commands",
    href: "https://developers.openai.com/codex/cli/slash-commands/",
    url: "developers.openai.com/codex/cli/slash-commands/",
    desc: "/init で AGENTS.md 自動生成・/review・/experimental（マルチエージェント有効化）の操作方法",
  },
  {
    icon: "📝",
    title: "Mervin Praison: OpenAI Codex CLI Memory Deep Dive",
    href: "https://mer.vin/2025/12/openai-codex-cli-memory-deep-dive/",
    url: "mer.vin/2025/12/openai-codex-cli-memory-deep-dive/",
    desc: "AGENTS.md 階層の実験的検証・override の挙動・fallback 設定のハンズオン解説",
  },
  {
    icon: "📌",
    title: "GitHub Gist: Notes on AI Agent Rule/Instruction Files",
    href: "https://gist.github.com/0xdevalias/f40bc5a6f84c4c5ad862e314894b2fa6",
    url: "gist.github.com/0xdevalias/f40bc5a6f84c4c5ad862e314894b2fa6",
    desc: "Codex / Claude / Gemini / Cursor クロスツール比較・project_doc_fallback_filenames 設定例",
  },
  {
    icon: "🔧",
    title: "OpenAI 公式: Use Codex with the Agents SDK",
    href: "https://developers.openai.com/codex/guides/agents-sdk/",
    url: "developers.openai.com/codex/guides/agents-sdk/",
    desc: "Codex を MCP サーバーとして使う方法・RECOMMENDED_PROMPT_PREFIX・handoff パターン",
  },
  {
    icon: "📊",
    title: "OpenAI Cookbook: Shell + Skills + Compaction",
    href: "https://cookbook.openai.com/examples/codex/long_running_agents",
    url: "cookbook.openai.com/examples/codex/long_running_agents",
    desc: "長時間実行エージェントのための SKILL.md 活用・コンパクション戦略・shell スキルのベストプラクティス",
  },
];

const SOURCES_NEW: Source[] = [
  {
    icon: "🤝",
    title: "OpenAI 公式: Agents SDK — Handoffs",
    href: "https://openai.github.io/openai-agents-python/handoffs/",
    url: "openai.github.io/openai-agents-python/handoffs/",
    desc: "transfer 関数によるサブエージェントへのハンドオフ実装・入力フィルタリング・引き継ぎコンテキスト設計の公式仕様",
  },
  {
    icon: "🛡",
    title: "OpenAI 公式: Agents SDK — Guardrails",
    href: "https://openai.github.io/openai-agents-python/guardrails/",
    url: "openai.github.io/openai-agents-python/guardrails/",
    desc: "入力・出力ガードレール・tripwire による安全なサブエージェント実行の公式ドキュメント",
  },
  {
    icon: "🔭",
    title: "OpenAI 公式: Agents SDK — Tracing",
    href: "https://openai.github.io/openai-agents-python/tracing/",
    url: "openai.github.io/openai-agents-python/tracing/",
    desc: "built-in tracing・generation step / tool call / handoff の可視化・カスタムイベントトレーシング・trace grading の公式仕様",
  },
  {
    icon: "📦",
    title: "OpenAI 公式: Agents SDK — Context Management",
    href: "https://openai.github.io/openai-agents-python/context/",
    url: "openai.github.io/openai-agents-python/context/",
    desc: "RunContextWrapper・コンテキスト注入・サブエージェント間のデータ共有パターンの公式仕様",
  },
  {
    icon: "🔀",
    title: "OpenAI Cookbook: SDD (Spec-Driven Development) with Codex + Agents SDK",
    href: "https://cookbook.openai.com/examples/codex/codex_mcp_agents_sdk/sdd_with_codex_agents_sdk",
    url: "cookbook.openai.com/…/sdd_with_codex_agents_sdk",
    desc: "PM エージェントによる REQUIREMENTS.md / AGENT_TASKS.md 自動生成・ゲート条件付きハンドオフ・SDD パイプラインの実装例",
  },
  {
    icon: "🌐",
    title: "AGENTS.md Open Standard — Linux Foundation (AAIF)",
    href: "https://agents.md/",
    url: "agents.md/",
    desc: "AGENTS.md のオープン標準仕様・Codex / Cursor / Claude Code / Google Jules / Amp での採用状況・40,000+ OSS プロジェクトでの利用実績",
  },
  {
    icon: "⚙️",
    title: "OpenAI 公式: Codex CLI — Sandbox & Security",
    href: "https://developers.openai.com/codex/security/",
    url: "developers.openai.com/codex/security/",
    desc: "sandbox_mode（read-only / workspace-write / network-sandbox）・network_access 設定・サブエージェントのセキュリティモデルの公式仕様",
  },
];

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const TOC_ITEMS = [
  { id: "s01", label: "1. 初学者向け：7ステップ入門ガイド" },
  { id: "s02", label: "2. 全体アーキテクチャと各ファイルの位置づけ" },
  {
    id: "s03",
    label: "3. AGENTS.md / AGENTS.override.md — コンテキスト設計",
  },
  {
    id: "s04",
    label: "4. サブエージェント向け AGENTS.md 設計パターン詳解",
  },
  { id: "s05", label: "5. SKILL.md — 遅延ロード型スキルの設計" },
  { id: "s06", label: "6. config.toml — マルチエージェントロール定義" },
  {
    id: "s07",
    label: "7. Agents SDK マルチエージェント — PM駆動ファイル生成パターン",
  },
  {
    id: "s08",
    label: "8. サブエージェント スポーン戦略の意思決定ツリー",
  },
  { id: "s09", label: "9. コスト最適なモデル選択戦略" },
  { id: "s10", label: "10. 絶対に避けるべき Anti-Patterns" },
  { id: "s11", label: "11. まとめ：各ファイルの役割と設計原則" },
  { id: "sources", label: "📚 参考ソース" },
] as const;

export default function CodexAgentPage() {
  return (
    <div className={styles.root}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles["nav-logo"]}>⚙</div>
        <span className={styles["nav-title"]}>OpenAI Codex Agent Dev Guide</span>
        <span className={styles["nav-sep"]}>—</span>
        <span className={styles["nav-sub"]}>codex-1 / Codex CLI / Agents SDK · 2026</span>
        <div className={styles["nav-right"]}>
          <span className={styles["nav-chip"]}>Codex CLI</span>
          <span className={styles["nav-chip"]}>Multi-Agent</span>
          <span className={styles["nav-chip"]}>Skills</span>
        </div>
      </nav>

      <div className={styles.wrap}>
        {/* HERO */}
        <div className={styles.hero}>
          <div className={styles["hero-badge"]}>⚙ OpenAI Codex 完全ガイド — 2026年3月最新版</div>
          <h1>
            OpenAI <em>Codex</em> サブエージェント開発における
            <br />
            <em>AGENTS.md</em>
            <br />
            完全ベストプラクティス
          </h1>
          <p>
            初学者向け7ステップ入門 ／
            AGENTS.md・AGENTS.override.md・SKILL.md・config.toml・REQUIREMENTS.md ── Codex
            エコシステム固有のファイル体系と、マルチエージェントワークフロー設計のベストプラクティスを初学者向けにステップバイステップで体系的に解説します。
          </p>
          <div className={styles["hero-meta"]}>
            <span className={styles["hero-tag"]}>初学者向け 7ステップ入門</span>
            <span className={styles["hero-tag"]}>Codex CLI (Rust製)</span>
            <span className={styles["hero-tag"]}>GPT-5.3-Codex (SWE-Bench Pro: 56.8%)</span>
            <span className={styles["hero-tag"]}>Multi-Agent (Experimental)</span>
            <span className={styles["hero-tag"]}>Skills / SKILL.md</span>
            <span className={styles["hero-tag"]}>Agents SDK + MCP</span>
            <span className={styles["hero-tag"]}>PM駆動 SDD パターン</span>
          </div>
        </div>

        {/* TOC */}
        <nav className={styles.toc}>
          {TOC_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </nav>

        {/* s01 */}
        <section id="s01" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span
              className={styles["sec-num"]}
              style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}
            >
              0
            </span>
            <h2>初学者向け：7ステップ入門ガイド</h2>
            <small>ここから始めれば迷わない</small>
          </div>
          <div className={`${styles.alert} ${styles.ag}`}>
            <span className={styles["alert-icon"]}>🎯</span>
            <div className={styles["alert-body"]}>
              <strong>このセクションを最初に読んでください</strong>
              Codex のファイル体系は複雑に見えますが、正しい順序で設定すれば迷いません。Step 1 → 7
              を順番に実施するだけでサブエージェント開発が動き始めます。
            </div>
          </div>

          {/* Step 1 */}
          <div
            className={styles.card}
            style={{ borderLeft: "3px solid var(--oai)", marginBottom: "12px" }}
          >
            <div className={styles["card-title"]}>
              <span
                style={{
                  background: "var(--oai)",
                  color: "#000",
                  borderRadius: "50%",
                  width: "26px",
                  height: "26px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                1
              </span>{" "}
              グローバル設定を作る{" "}
              <span className={`${styles.badge} ${styles["b-green"]}`}>所要時間: 5分</span>
            </div>
            <p>
              まず <code className={styles.mono}>~/.codex/AGENTS.md</code>{" "}
              を作成し、自分のすべてのプロジェクトに共通するルールを書きます。これが「あなたの作業スタイルの設定ファイル」です。
            </p>
            <div className={styles["code-wrap"]}>
              <div className={styles["code-bar"]}>
                <span>~/.codex/AGENTS.md（グローバル設定）</span>
                <span className={styles["code-lang"]}>Markdown</span>
              </div>
              <div className={styles["code-body"]}>
                <span className={styles.ch}># Global Working Agreements</span>
                {"\n\n"}
                <span className={styles.cm}>## Language</span>
                {"\nコメントとコミットメッセージは日本語で書くこと。\n\n"}
                <span className={styles.cm}>## Code Style</span>
                {
                  "\n- インデント: 2スペース（TypeScript / JavaScript）\n- 関数名はキャメルケース、定数はスネークケース大文字\n\n"
                }
                <span className={styles.cm}>## General Rules</span>
                {
                  "\n- テストなしでコードをコミットしない\n- TODO コメントは残さない（実装するか Issue を立てる）"
                }
              </div>
            </div>
            <div
              className={`${styles.alert} ${styles.ag}`}
              style={{ marginTop: "12px", marginBottom: 0 }}
            >
              <span className={styles["alert-icon"]}>💡</span>
              <div className={styles["alert-body"]}>
                <strong>ポイント</strong>
                ：ここにはプロジェクトに関係ない「個人の作業習慣」のみ書く。プロジェクト固有の内容は次ステップへ。
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={styles.card}
            style={{ borderLeft: "3px solid #3b82f6", marginBottom: "12px" }}
          >
            <div className={styles["card-title"]}>
              <span
                style={{
                  background: "#3b82f6",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "26px",
                  height: "26px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                2
              </span>{" "}
              プロジェクトルートに AGENTS.md を作る{" "}
              <span className={`${styles.badge} ${styles["b-blue"]}`}>最重要ファイル</span>
            </div>
            <p>
              プロジェクトの <code className={styles.mono}>/init</code>{" "}
              コマンドで自動生成するか、手動で作成します。
              <strong>テストコマンドの記述が最重要</strong>
              です。Codex はこれを見てテストを自動実行します。
            </p>
            <div className={styles["code-wrap"]}>
              <div className={styles["code-bar"]}>
                <span>./AGENTS.md（プロジェクトルート）</span>
                <span className={styles["code-lang"]}>Markdown</span>
              </div>
              <div className={styles["code-body"]}>
                <span className={styles.ch}># PROJECT: my-app</span>
                {"\n\n"}
                <span className={styles.cm}>## Overview</span>
                {"\nNext.js 15 + Supabase の SaaS アプリ。\n\n"}
                <span className={styles.cw}>{"## ⚠ Build & Test（必ず実行すること）"}</span>
                {"\n- テスト: "}
                <span className={styles.cs}>{"`pnpm test`"}</span>
                {" ← 変更後は必ずこれを実行\n- ビルド: "}
                <span className={styles.cs}>{"`pnpm build`"}</span>
                {"\n- Lint: "}
                <span className={styles.cs}>{"`pnpm lint`"}</span>
                {" ← PR 前に必ず実行\n\n"}
                <span className={styles.cm}>## Architecture</span>
                {
                  "\n- frontend/ → Next.js ページ・コンポーネント\n- backend/ → API ルート・サーバーサイド処理\n- db/ → Supabase マイグレーション\n\n"
                }
                <span className={styles.cm}>## Forbidden</span>
                {"\n- `.env.production` の読み書き禁止\n- `db reset` は絶対に実行しない"}
              </div>
            </div>
            <div
              className={`${styles.alert} ${styles.aw}`}
              style={{ marginTop: "12px", marginBottom: 0 }}
            >
              <span className={styles["alert-icon"]}>⚠️</span>
              <div className={styles["alert-body"]}>
                <strong>32 KiB 上限に注意</strong>
                ：このファイルが肥大化したら、詳細手順を SKILL.md（Step
                5）に分離してください。テストコマンドと禁止事項を優先的に上に書くこと。
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={styles.card}
            style={{ borderLeft: "3px solid #8b5cf6", marginBottom: "12px" }}
          >
            <div className={styles["card-title"]}>
              <span
                style={{
                  background: "#8b5cf6",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "26px",
                  height: "26px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                3
              </span>{" "}
              サービス別サブディレクトリに AGENTS.md を追加する{" "}
              <span className={`${styles.badge} ${styles["b-purple"]}`}>サブエージェント対応</span>
            </div>
            <p>
              マイクロサービス・モノレポ構成の場合、サービスごとにルールが異なります。各サブディレクトリの{" "}
              <code className={styles.mono}>AGENTS.md</code> には
              <strong>そのサービス固有のルールだけを書き、ルートと重複させない</strong>
              のが原則です。
            </p>
            <div className={styles["code-wrap"]}>
              <div className={styles["code-bar"]}>
                <span>./services/payments/AGENTS.md（サービス固有）</span>
                <span className={styles["code-lang"]}>Markdown</span>
              </div>
              <div className={styles["code-body"]}>
                <span className={styles.ch}># Payments Service</span>
                {"\n"}
                <span className={styles.cc}>
                  # ルートの AGENTS.md に加えて、このファイルのルールが適用される
                </span>
                {"\n\n"}
                <span className={styles.cm}>## Service-Specific Commands</span>
                {"\n- テスト: "}
                <span className={styles.cs}>{"`make test-payments`"}</span>
                {" ← このサービスは make を使う\n- 型生成: "}
                <span className={styles.cs}>{"`pnpm stripe:types`"}</span>
                {"\n\n"}
                <span className={styles.cm}>## Domain Constraints</span>
                {
                  "\n- このディレクトリ内のファイルのみ変更すること\n- Stripe API は v2 のみ使用（v1 API は廃止済み）\n- PCI-DSS: カード番号をログに出力しない\n\n"
                }
                <span className={styles.cm}>## Sub-agent Handoff</span>
                {
                  "\nこのサービスのタスク完了後は AGENT_TASKS.md を更新し、\nPM エージェントに transfer_to_project_manager で引き渡すこと。"
                }
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div
            className={styles.card}
            style={{ borderLeft: "3px solid #f59e0b", marginBottom: "12px" }}
          >
            <div className={styles["card-title"]}>
              <span
                style={{
                  background: "#f59e0b",
                  color: "#000",
                  borderRadius: "50%",
                  width: "26px",
                  height: "26px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                4
              </span>{" "}
              config.toml でサブエージェントロールを定義する{" "}
              <span className={`${styles.badge} ${styles["b-amber"]}`}>マルチエージェント</span>
            </div>
            <p>
              サブエージェントを使う場合は <code className={styles.mono}>.codex/config.toml</code>{" "}
              で各ロールのモデル・サンドボックス・承認ポリシーを定義します。
              <strong>ロール定義なしにサブエージェントをスポーンしてはいけません</strong>
              （Anti-Pattern）。
            </p>
            <div className={styles["code-wrap"]}>
              <div className={styles["code-bar"]}>
                <span>.codex/config.toml（最小構成）</span>
                <span className={styles["code-lang"]}>TOML</span>
              </div>
              <div className={styles["code-body"]}>
                <span className={styles.cc}># 最小限のマルチエージェント設定</span>
                {"\n["}
                <span className={styles.cm}>features</span>
                {"]\n"}
                <span className={styles.cm}>multi_agents</span>
                {" = "}
                <span className={styles.ck}>true</span>
                {"\n\n["}
                <span className={styles.cm}>agents</span>
                {"]\n"}
                <span className={styles.cm}>max_threads</span>
                {" = "}
                <span className={styles.cv}>4</span>
                {"  "}
                <span className={styles.cc}># 同時実行上限（デフォルト: 6）</span>
                {"\n"}
                <span className={styles.cm}>max_depth</span>
                {" = "}
                <span className={styles.cv}>1</span>
                {"  "}
                <span className={styles.cc}># 孫エージェントは禁止（推奨）</span>
                {"\n\n"}
                <span className={styles.cc}># 軽量探索ロール（コード読み専用）</span>
                {"\n["}
                <span className={styles.cm}>agents.roles.explorer</span>
                {"]\n"}
                <span className={styles.cm}>description</span>
                {" = "}
                <span className={styles.cs}>
                  {'"コードベース探索・ファイル検索専門。実装しない。"'}
                </span>
                {"\n"}
                <span className={styles.cm}>config_file</span>
                {" = "}
                <span className={styles.cs}>{'"".codex/roles/explorer.toml"'}</span>
                {"\n\n"}
                <span className={styles.cc}># レビューロール（書き込み禁止）</span>
                {"\n["}
                <span className={styles.cm}>agents.roles.reviewer</span>
                {"]\n"}
                <span className={styles.cm}>description</span>
                {" = "}
                <span className={styles.cs}>
                  {'"PR前のコードレビュー専門。コードは変更しない。"'}
                </span>
                {"\n"}
                <span className={styles.cm}>config_file</span>
                {" = "}
                <span className={styles.cs}>{'"".codex/roles/reviewer.toml"'}</span>
              </div>
            </div>
            <div
              className={`${styles.alert} ${styles.ae}`}
              style={{ marginTop: "12px", marginBottom: 0 }}
            >
              <span className={styles["alert-icon"]}>🚨</span>
              <div className={styles["alert-body"]}>
                <strong>サブエージェントは承認を継承しない</strong>
                ：各ロールの config.toml で必ず{" "}
                <code className={styles.mono}>approval_policy = &quot;never&quot;</code>{" "}
                を指定すること。未設定のまま実行すると承認待ちで処理がブロックされます。
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div
            className={styles.card}
            style={{ borderLeft: "3px solid #14b8a6", marginBottom: "12px" }}
          >
            <div className={styles["card-title"]}>
              <span
                style={{
                  background: "#14b8a6",
                  color: "#000",
                  borderRadius: "50%",
                  width: "26px",
                  height: "26px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                5
              </span>{" "}
              専門タスクを SKILL.md にスキル化する{" "}
              <span className={`${styles.badge} ${styles["b-teal"]}`}>コンテキスト節約</span>
            </div>
            <p>
              AGENTS.md
              が肥大化してきたら、繰り返し実施する専門タスク（DBマイグレーション・コードレビュー・テスト生成など）を{" "}
              <code className={styles.mono}>.agents/skills/</code> 配下の SKILL.md
              に分離します。スキルは
              <strong>該当タスクのときだけロードされる</strong>
              ため、コンテキストウィンドウを節約できます。
            </p>
            <div className={styles["code-wrap"]}>
              <div className={styles["code-bar"]}>
                <span>.agents/skills/db-migration/SKILL.md（例）</span>
                <span className={styles["code-lang"]}>Markdown + YAML frontmatter</span>
              </div>
              <div className={styles["code-body"]}>
                <span className={styles.cs}>---</span>
                {"\n"}
                <span className={styles.cm}>name</span>
                {": "}
                <span className={styles.cv}>db-migration</span>
                {"\n"}
                <span className={styles.cm}>description</span>
                {
                  ": |\n  DB スキーマ変更・マイグレーションファイル作成のスキル。\n  以下の場合にトリガーする:\n  - テーブルの追加・変更・削除を依頼された\n  - マイグレーションファイルの作成を求められた\n  以下の場合はトリガーしない:\n  - シードデータの挿入\n  - アプリケーションレベルのデータ変換\n"
                }
                <span className={styles.cs}>---</span>
                {"\n\n"}
                <span className={styles.ch}>## Instructions</span>
                {"\n1. "}
                <span className={styles.cs}>{"`migrations/`"}</span>
                {" に "}
                <span className={styles.cs}>{"`YYYYMMDD_description.up.sql`"}</span>
                {" を作成\n2. ロールバック用 "}
                <span className={styles.cs}>{"`.down.sql`"}</span>
                {" を必ず同時作成\n3. チェック: "}
                <span className={styles.cs}>
                  {"`python scripts/check_migration.py --env staging`"}
                </span>
                {"\n4. 本番適用は人間レビュー後のみ"}
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div
            className={styles.card}
            style={{ borderLeft: "3px solid #ef4444", marginBottom: "12px" }}
          >
            <div className={styles["card-title"]}>
              <span
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "26px",
                  height: "26px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                6
              </span>{" "}
              PM 駆動ワークフローを組む{" "}
              <span className={`${styles.badge} ${styles["b-red"]}`}>Agents SDK</span>
            </div>
            <p>
              複数エージェントを使う場合、
              <strong>
                Project Manager エージェントに REQUIREMENTS.md と AGENT_TASKS.md を生成させる
              </strong>
              のが Codex
              公式推奨パターンです。各サブエージェントはこの2ファイルを「唯一の真実の情報源」として実装します。
            </p>
            <div className={styles["pat-grid"]}>
              <div className={`${styles.pat} ${styles["pat-ok"]}`}>
                <div className={styles["pat-label"]}>✅ PM 駆動パターン（推奨）</div>
                <ul>
                  <li>PM が REQUIREMENTS.md を生成</li>
                  <li>PM が AGENT_TASKS.md を生成（役割分担を明記）</li>
                  <li>各エージェントは AGENT_TASKS.md のみを参照して実装</li>
                  <li>完了後に PM が成果物を確認・統合</li>
                </ul>
              </div>
              <div className={`${styles.pat} ${styles["pat-ng"]}`}>
                <div className={styles["pat-label"]}>✗ 直接指示パターン（非推奨）</div>
                <ul>
                  <li>PM なしで各エージェントが直接タスクを受け取る</li>
                  <li>エージェント間の依存関係が暗黙的になる</li>
                  <li>どのエージェントが何を実装したか追跡できない</li>
                  <li>成果物の整合性確認が困難</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 7 */}
          <div className={styles.card} style={{ borderLeft: "3px solid #6b7280", marginBottom: 0 }}>
            <div className={styles["card-title"]}>
              <span
                style={{
                  background: "#6b7280",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "26px",
                  height: "26px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                7
              </span>{" "}
              /init + /review で品質を維持する{" "}
              <span className={`${styles.badge} ${styles["b-purple"]}`}>継続的改善</span>
            </div>
            <p>設定が完了したら、定期的に以下のスラッシュコマンドで品質を維持します。</p>
            <div className={styles["tbl-wrap"]} style={{ marginTop: "12px" }}>
              <table>
                <thead>
                  <tr>
                    <th>コマンド</th>
                    <th>タイミング</th>
                    <th>効果</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code className={styles.mono}>/init</code>
                    </td>
                    <td>プロジェクト開始時・大きなリファクタ後</td>
                    <td>コードベースを再探索して AGENTS.md の雛形を再生成</td>
                  </tr>
                  <tr>
                    <td>
                      <code className={styles.mono}>/review</code>
                    </td>
                    <td>PR 作成前</td>
                    <td>変更差分をコードレビュースキルでチェック</td>
                  </tr>
                  <tr>
                    <td>
                      <code className={styles.mono}>/experimental</code>
                    </td>
                    <td>マルチエージェント初回有効化時</td>
                    <td>TUI から multi_agents フラグを ON にする</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* s02 */}
        <section id="s02" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span className={styles["sec-num"]}>1</span>
            <h2>全体アーキテクチャと各ファイルの位置づけ</h2>
          </div>
          <p>（faithful 移植 s02 — 後続コミットで充填）</p>
        </section>

        {/* s03 */}
        <section id="s03" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span className={styles["sec-num"]}>2</span>
            <h2>
              <span className={styles.mono}>AGENTS.md</span> /{" "}
              <span className={styles.mono}>AGENTS.override.md</span> — コンテキスト設計
            </h2>
          </div>
          <p>（faithful 移植 s03 — 後続コミットで充填）</p>
        </section>

        {/* s04 */}
        <section id="s04" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span className={styles["sec-num"]}>3</span>
            <h2>サブエージェント向け AGENTS.md 設計パターン詳解</h2>
          </div>
          <p>（faithful 移植 s04 — 後続コミットで充填）</p>
        </section>

        {/* s05 */}
        <section id="s05" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span className={styles["sec-num"]}>4</span>
            <h2>
              <span className={styles.mono}>SKILL.md</span> — 遅延ロード型スキルの設計
            </h2>
          </div>
          <p>（faithful 移植 s05 — 後続コミットで充填）</p>
        </section>

        {/* s06 */}
        <section id="s06" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span className={styles["sec-num"]}>5</span>
            <h2>
              <span className={styles.mono}>config.toml</span> — マルチエージェントロール定義
            </h2>
          </div>
          <p>（faithful 移植 s06 — 後続コミットで充填）</p>
        </section>

        {/* s07 */}
        <section id="s07" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span className={styles["sec-num"]}>6</span>
            <h2>Agents SDK マルチエージェント — PM駆動ファイル生成パターン</h2>
          </div>
          <p>（faithful 移植 s07 — 後続コミットで充填）</p>
        </section>

        {/* s08 */}
        <section id="s08" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span className={styles["sec-num"]}>7</span>
            <h2>サブエージェント スポーン戦略の意思決定ツリー</h2>
          </div>
          <p>（faithful 移植 s08 — 後続コミットで充填）</p>
        </section>

        {/* s09 */}
        <section id="s09" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span className={styles["sec-num"]}>8</span>
            <h2>コスト最適なモデル選択戦略</h2>
          </div>
          <p>（faithful 移植 s09 — 後続コミットで充填）</p>
        </section>

        <hr />

        {/* s10 */}
        <section id="s10" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span className={styles["sec-num"]}>9</span>
            <h2>絶対に避けるべき Anti-Patterns</h2>
          </div>
          <p>（faithful 移植 s10 — 後続コミットで充填）</p>
        </section>

        {/* s11 */}
        <section id="s11" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span className={styles["sec-num"]}>10</span>
            <h2>まとめ：各ファイルの役割と設計原則</h2>
          </div>
          <p>（faithful 移植 s11 — 後続コミットで充填）</p>
        </section>

        <hr />

        {/* sources */}
        <section id="sources" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span className={styles["sec-num"]}>📚</span>
            <h2>参考ソース（公式・一次情報優先）</h2>
          </div>
          <div className={styles["src-grid"]}>
            {SOURCES_EXISTING.map((s) => (
              <div key={s.href} className={styles["src-card"]}>
                <div className={styles["src-icon"]}>{s.icon}</div>
                <div className={styles["src-title"]}>{s.title}</div>
                <div className={styles["src-url"]}>
                  <Ext href={s.href}>{s.url}</Ext>
                </div>
                <div className={styles["src-desc"]}>{s.desc}</div>
              </div>
            ))}
            <div className={styles.srcSeparator}>── Agents SDK 関連</div>
            {SOURCES_NEW.map((s) => (
              <div key={s.href} className={styles["src-card-new"]}>
                <div className={styles["src-icon"]}>{s.icon}</div>
                <div className={styles["src-title"]}>{s.title}</div>
                <div className={styles["src-url"]}>
                  <Ext href={s.href}>{s.url}</Ext>
                </div>
                <div className={styles["src-desc"]}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
