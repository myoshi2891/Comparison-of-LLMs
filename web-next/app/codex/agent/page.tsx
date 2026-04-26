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
          <div className={styles.card}>
            <p>
              Codex のファイル体系は <strong>他のツールと最も大きく異なります</strong>。Claude の{" "}
              <code className={styles.mono}>CLAUDE.md</code>・Gemini の{" "}
              <code className={styles.mono}>GEMINI.md</code> に相当するのが{" "}
              <code className={styles.mono}>AGENTS.md</code> ですが、Codex にはそれに加えて{" "}
              <strong>SKILL.md（遅延ロード型スキル）</strong>・
              <strong>AGENTS.override.md（ホットスワップ型上書き）</strong>・
              <strong>config.toml（エージェントロール定義）</strong> という独自の概念があります。
            </p>
          </div>

          {/* Context load chain */}
          <div className={styles["load-chain"]}>
            <div className={styles["load-chain-title"]}>
              AGENTS.md 読み込みチェーン — 低優先度 → 高優先度（後のファイルが前を上書き）
            </div>
            <div className={styles["load-steps"]}>
              <div className={styles["load-step"]}>
                <div className={`${styles["load-box"]} ${styles["lb-global"]}`}>
                  🌐 Global
                  <br />
                  <small>~/.codex/AGENTS.md</small>
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text3)",
                    textAlign: "center",
                    marginTop: "8px",
                  }}
                >
                  全プロジェクト共通
                  <br />
                  Working agreements
                </div>
              </div>
              <div className={styles["load-arrow"]}>→</div>
              <div className={styles["load-step"]}>
                <div className={`${styles["load-box"]} ${styles["lb-project"]}`}>
                  📁 Git Root
                  <br />
                  <small>./AGENTS.md</small>
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text3)",
                    textAlign: "center",
                    marginTop: "8px",
                  }}
                >
                  プロジェクト固有
                  <br />
                  (.git を起点)
                </div>
              </div>
              <div className={styles["load-arrow"]}>→</div>
              <div className={styles["load-step"]}>
                <div className={`${styles["load-box"]} ${styles["lb-sub"]}`}>
                  📂 Subdir
                  <br />
                  <small>services/*/AGENTS.md</small>
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text3)",
                    textAlign: "center",
                    marginTop: "8px",
                  }}
                >
                  ディレクトリ固有
                  <br />
                  （CWDまで走査）
                </div>
              </div>
              <div className={styles["load-arrow"]}>→</div>
              <div className={styles["load-step"]}>
                <div className={`${styles["load-box"]} ${styles["lb-override"]}`}>
                  ⚡ Override
                  <br />
                  <small>AGENTS.override.md</small>
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text3)",
                    textAlign: "center",
                    marginTop: "8px",
                  }}
                >
                  緊急上書き
                  <br />
                  （同一ディレクトリ優先）
                </div>
              </div>
            </div>
            <div className={styles["load-note"]}>
              各ディレクトリで <strong>AGENTS.override.md → AGENTS.md → fallback</strong>{" "}
              の順にチェック。1ディレクトリ1ファイルのみ採用。
              <br />
              全ファイルを結合してモデルの最初のターンに渡す（空ファイルはスキップ）
            </div>
            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <div className={styles["load-limit"]}>
                ⚠ デフォルト上限: 32 KiB（project_doc_max_bytes） —
                超えたら分割するか上限を引き上げる
              </div>
            </div>
          </div>

          {/* File tree SVG */}
          <div className={styles["filetree-outer"]}>
            <div className={styles["filetree-bar"]}>
              <span className={styles["fb-dot"]} style={{ background: "#ef4444" }} />
              <span className={styles["fb-dot"]} style={{ background: "#f59e0b" }} />
              <span className={styles["fb-dot"]} style={{ background: "#10a37f" }} />
              <span
                style={{
                  marginLeft: "10px",
                  color: "var(--text3)",
                  fontSize: "12px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                project-root/ — Codex エコシステム ファイル構造
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 980 820"
              width="100%"
              style={{ display: "block" }}
              fontFamily="'JetBrains Mono','Fira Code',monospace"
              role="img"
              aria-label="Codex エコシステム ファイル構造のファイルツリー図"
            >
              <title>Codex エコシステム ファイル構造</title>
              <defs>
                <linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#10a37f" }} />
                  <stop offset="100%" style={{ stopColor: "#0d8a6b" }} />
                </linearGradient>
                <linearGradient id="cg2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#3b82f6" }} />
                  <stop offset="100%" style={{ stopColor: "#60a5fa" }} />
                </linearGradient>
                <linearGradient id="cg3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#f59e0b" }} />
                  <stop offset="100%" style={{ stopColor: "#fbbf24" }} />
                </linearGradient>
                <linearGradient id="cg4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#8b5cf6" }} />
                  <stop offset="100%" style={{ stopColor: "#a78bfa" }} />
                </linearGradient>
                <linearGradient id="cg5" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#ef4444" }} />
                  <stop offset="100%" style={{ stopColor: "#f87171" }} />
                </linearGradient>
                <linearGradient id="cg6" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#14b8a6" }} />
                  <stop offset="100%" style={{ stopColor: "#2dd4bf" }} />
                </linearGradient>
              </defs>
              <rect width="980" height="820" fill="#060606" />

              {/* LEGEND */}
              <rect
                x="670"
                y="16"
                width="296"
                height="262"
                rx="10"
                fill="#111318"
                stroke="#1e2228"
                strokeWidth="1"
              />
              <text
                x="818"
                y="38"
                textAnchor="middle"
                fill="#484f58"
                fontSize="11"
                letterSpacing="1.5"
              >
                LEGEND
              </text>
              <rect x="686" y="50" width="22" height="22" rx="5" fill="url(#cg1)" />
              <text x="697" y="65" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ①
              </text>
              <text x="716" y="65" fontSize="12" fill="#d0d0d0">
                AGENTS.md（常時ロード）
              </text>
              <rect x="686" y="82" width="22" height="22" rx="5" fill="url(#cg3)" />
              <text x="697" y="97" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ②
              </text>
              <text x="716" y="97" fontSize="12" fill="#d0d0d0">
                AGENTS.override.md（緊急上書き）
              </text>
              <rect x="686" y="114" width="22" height="22" rx="5" fill="url(#cg2)" />
              <text x="697" y="129" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ③
              </text>
              <text x="716" y="129" fontSize="12" fill="#d0d0d0">
                SKILL.md（遅延ロード型スキル）
              </text>
              <rect x="686" y="146" width="22" height="22" rx="5" fill="url(#cg4)" />
              <text x="697" y="161" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ④
              </text>
              <text x="716" y="161" fontSize="12" fill="#d0d0d0">
                config.toml（エージェントロール）
              </text>
              <rect x="686" y="178" width="22" height="22" rx="5" fill="url(#cg5)" />
              <text x="697" y="193" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑤
              </text>
              <text x="716" y="193" fontSize="12" fill="#d0d0d0">
                PM生成ファイル（Agents SDK）
              </text>
              <rect x="686" y="210" width="22" height="22" rx="5" fill="url(#cg6)" />
              <text x="697" y="225" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑥
              </text>
              <text x="716" y="225" fontSize="12" fill="#d0d0d0">
                README.md（人間向け）
              </text>
              <rect x="686" y="242" width="52" height="22" rx="5" fill="#1e2228" />
              <text
                x="712"
                y="257"
                textAnchor="middle"
                fill="#6b7280"
                fontSize="11"
                fontWeight="700"
              >
                📁 DIR
              </text>
              <text x="746" y="257" fontSize="12" fill="#484f58">
                ディレクトリ
              </text>

              {/* TREE LINES */}
              <line x1="44" y1="50" x2="44" y2="770" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="44" y1="52" x2="70" y2="52" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="44" y1="100" x2="70" y2="100" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="44" y1="150" x2="70" y2="150" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="44" y1="198" x2="70" y2="198" stroke="#1e2228" strokeWidth="1.5" />
              {/* .codex/ spine */}
              <line x1="86" y1="198" x2="86" y2="290" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="86" y1="228" x2="112" y2="228" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="86" y1="264" x2="112" y2="264" stroke="#1e2228" strokeWidth="1.5" />
              {/* services/ */}
              <line x1="44" y1="320" x2="70" y2="320" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="86" y1="320" x2="86" y2="400" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="86" y1="350" x2="112" y2="350" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="86" y1="388" x2="112" y2="388" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="128" y1="388" x2="128" y2="420" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="128" y1="418" x2="154" y2="418" stroke="#1e2228" strokeWidth="1.5" />
              {/* .agents/ */}
              <line x1="44" y1="460" x2="70" y2="460" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="86" y1="460" x2="86" y2="570" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="86" y1="490" x2="112" y2="490" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="86" y1="530" x2="112" y2="530" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="128" y1="530" x2="128" y2="570" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="128" y1="558" x2="154" y2="558" stroke="#1e2228" strokeWidth="1.5" />
              {/* docs/ */}
              <line x1="44" y1="620" x2="70" y2="620" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="86" y1="620" x2="86" y2="720" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="86" y1="648" x2="112" y2="648" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="86" y1="686" x2="112" y2="686" stroke="#1e2228" strokeWidth="1.5" />
              <line x1="86" y1="724" x2="112" y2="724" stroke="#1e2228" strokeWidth="1.5" />
              {/* README */}
              <line x1="44" y1="770" x2="70" y2="770" stroke="#1e2228" strokeWidth="1.5" />

              {/* ROOT */}
              <text x="20" y="32" fontSize="16" fill="#10a37f">
                📁
              </text>
              <text x="42" y="32" fontSize="14" fontWeight="700" fill="#34d399">
                project-root/
              </text>

              {/* ROW 1: AGENTS.md (root) */}
              <text x="78" y="58" fontSize="14" fill="#34d399">
                📄
              </text>
              <text x="98" y="58" fontSize="13.5" fontWeight="700" fill="#34d399">
                AGENTS.md
              </text>
              <rect x="196" y="43" width="22" height="22" rx="5" fill="url(#cg1)" />
              <text x="207" y="58" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ①
              </text>
              <text x="226" y="58" fontSize="12" fill="#6b7280">
                プロジェクト固有の常設指示（毎セッションロード）
              </text>
              <text x="226" y="74" fontSize="11" fill="#3a3a3a">
                ※ /init コマンドで自動生成可
              </text>

              {/* ROW 2: AGENTS.override.md (root) */}
              <text x="78" y="106" fontSize="14" fill="#fbbf24">
                ⚡
              </text>
              <text x="98" y="106" fontSize="13.5" fontWeight="700" fill="#fbbf24">
                AGENTS.override.md
              </text>
              <rect x="278" y="91" width="22" height="22" rx="5" fill="url(#cg3)" />
              <text x="289" y="106" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ②
              </text>
              <text x="308" y="106" fontSize="12" fill="#6b7280">
                緊急上書き用（AGENTS.md より先に読まれる）
              </text>

              {/* ROW 3: config.toml (root) */}
              <text x="78" y="156" fontSize="14" fill="#a78bfa">
                ⚙️
              </text>
              <text x="98" y="156" fontSize="13.5" fontWeight="700" fill="#a78bfa">
                config.toml
              </text>
              <rect x="196" y="141" width="22" height="22" rx="5" fill="url(#cg4)" />
              <text x="207" y="156" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ④
              </text>
              <text x="226" y="156" fontSize="12" fill="#6b7280">
                モデル設定・エージェントロール・MCP・sandbox
              </text>

              {/* ROW 4: .codex/ dir */}
              <text x="78" y="204" fontSize="14" fill="#60a5fa">
                📁
              </text>
              <text x="98" y="204" fontSize="14" fontWeight="700" fill="#60a5fa">
                .codex/
              </text>
              <text x="178" y="204" fontSize="12" fill="#3a3a3a">
                ← プロジェクト固有設定レイヤー
              </text>
              {/* .codex/config.toml */}
              <text x="120" y="234" fontSize="14" fill="#a78bfa">
                ⚙️
              </text>
              <text x="140" y="234" fontSize="13" fill="#a78bfa">
                config.toml
              </text>
              <rect x="232" y="219" width="22" height="22" rx="5" fill="url(#cg4)" opacity="0.75" />
              <text x="243" y="234" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ④
              </text>
              <text x="262" y="234" fontSize="12" fill="#4a4a4a">
                プロジェクト固有設定（trusted時のみ読込）
              </text>
              {/* .codex/AGENTS.md */}
              <text x="120" y="270" fontSize="14" fill="#34d399">
                📄
              </text>
              <text x="140" y="270" fontSize="13" fontWeight="700" fill="#34d399">
                AGENTS.md
              </text>
              <rect x="228" y="255" width="22" height="22" rx="5" fill="url(#cg1)" opacity="0.7" />
              <text x="239" y="270" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ①
              </text>
              <text x="258" y="270" fontSize="12" fill="#4a4a4a">
                .codex層の補足指示
              </text>

              {/* ROW 5: services/ dir */}
              <text x="78" y="326" fontSize="14" fill="#60a5fa">
                📁
              </text>
              <text x="98" y="326" fontSize="14" fontWeight="700" fill="#60a5fa">
                services/
              </text>
              {/* services/payments/ */}
              <text x="120" y="356" fontSize="13" fill="#60a5fa">
                📂
              </text>
              <text x="140" y="356" fontSize="13" fontWeight="700" fill="#60a5fa">
                payments/
              </text>
              {/* services/auth/ */}
              <text x="120" y="394" fontSize="13" fill="#60a5fa">
                📂
              </text>
              <text x="140" y="394" fontSize="13" fontWeight="700" fill="#60a5fa">
                auth/
              </text>
              <text x="162" y="424" fontSize="13" fill="#fbbf24">
                ⚡
              </text>
              <text x="182" y="424" fontSize="13" fontWeight="700" fill="#fbbf24">
                AGENTS.override.md
              </text>
              <rect x="350" y="409" width="22" height="22" rx="5" fill="url(#cg3)" opacity="0.8" />
              <text x="361" y="424" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ②
              </text>
              <text x="380" y="424" fontSize="12" fill="#6b7280">
                auth/ 固有ルールを緊急上書き
              </text>

              {/* ROW 6: .agents/ dir (Skills) */}
              <text x="78" y="466" fontSize="14" fill="#60a5fa">
                📁
              </text>
              <text x="98" y="466" fontSize="14" fontWeight="700" fill="#60a5fa">
                .agents/
              </text>
              {/* .agents/skills/ dir */}
              <text x="120" y="496" fontSize="13" fill="#60a5fa">
                📂
              </text>
              <text x="140" y="496" fontSize="13" fontWeight="700" fill="#60a5fa">
                skills/
              </text>
              <text x="220" y="496" fontSize="12" fill="#3a3a3a">
                ← リポジトリ固有スキル置き場
              </text>
              {/* skill folder */}
              <text x="120" y="536" fontSize="13" fill="#60a5fa">
                📂
              </text>
              <text x="140" y="536" fontSize="13" fontWeight="700" fill="#60a5fa">
                code-review/
              </text>
              <text x="162" y="564" fontSize="13" fill="#60a5fa">
                📝
              </text>
              <text x="182" y="564" fontSize="13" fill="#60a5fa">
                SKILL.md
              </text>
              <rect x="264" y="549" width="22" height="22" rx="5" fill="url(#cg2)" />
              <text x="275" y="564" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ③
              </text>
              <text x="294" y="564" fontSize="12" fill="#6b7280">
                スキル定義（必要時のみフル読込：遅延ロード）
              </text>

              {/* ROW 7: docs/ dir (Agents SDK) */}
              <text x="78" y="626" fontSize="14" fill="#60a5fa">
                📁
              </text>
              <text x="98" y="626" fontSize="14" fontWeight="700" fill="#60a5fa">
                docs/
              </text>
              <text x="178" y="626" fontSize="12" fill="#3a3a3a">
                ← Agents SDK マルチエージェント生成ファイル
              </text>
              <text x="120" y="654" fontSize="13" fill="#fb7185">
                📋
              </text>
              <text x="140" y="654" fontSize="13" fill="#fb7185">
                REQUIREMENTS.md
              </text>
              <rect x="302" y="639" width="22" height="22" rx="5" fill="url(#cg5)" />
              <text x="313" y="654" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑤
              </text>
              <text x="332" y="654" fontSize="12" fill="#6b7280">
                PM エージェントが自動生成する仕様書
              </text>
              <text x="120" y="692" fontSize="13" fill="#fb7185">
                📋
              </text>
              <text x="140" y="692" fontSize="13" fill="#fb7185">
                AGENT_TASKS.md
              </text>
              <rect x="298" y="677" width="22" height="22" rx="5" fill="url(#cg5)" opacity="0.85" />
              <text x="309" y="692" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑤
              </text>
              <text x="328" y="692" fontSize="12" fill="#6b7280">
                PM が各サブエージェントへの指示を記述
              </text>
              <text x="120" y="730" fontSize="13" fill="#fb7185">
                📋
              </text>
              <text x="140" y="730" fontSize="13" fill="#fb7185">
                TEST.md
              </text>
              <rect x="226" y="715" width="22" height="22" rx="5" fill="url(#cg5)" opacity="0.7" />
              <text x="237" y="730" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑤
              </text>
              <text x="256" y="730" fontSize="12" fill="#6b7280">
                Tester エージェントが生成するテスト計画
              </text>

              {/* ROW 8: README.md */}
              <text x="78" y="776" fontSize="14" fill="#60a5fa">
                📘
              </text>
              <text x="98" y="776" fontSize="14" fontWeight="700" fill="#2dd4bf">
                README.md
              </text>
              <rect x="208" y="761" width="22" height="22" rx="5" fill="url(#cg6)" />
              <text x="219" y="776" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑥
              </text>
              <text x="238" y="776" fontSize="12" fill="#6b7280">
                人間向け：エージェント構成・セットアップ手順
              </text>
            </svg>
          </div>
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
          <div className={`${styles.alert} ${styles.ai}`}>
            <span className={styles["alert-icon"]}>ℹ️</span>
            <div className={styles["alert-body"]}>
              <strong>Codex 固有：1ディレクトリ1ファイルのみ採用 + 32 KiB 上限</strong>
              <code className={styles.mono}>AGENTS.override.md</code> →{" "}
              <code className={styles.mono}>AGENTS.md</code> → fallback
              の順でチェックし、最初にヒットしたファイルのみ読む（同一ディレクトリでのマージはしない）。全体の合計が
              32 KiB を超えるとそれ以降を切り捨てる。
              <code className={styles.mono}>config.toml</code> の{" "}
              <code className={styles.mono}>project_doc_max_bytes = 65536</code> で引き上げ可能。
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles["card-title"]}>
              📋 AGENTS.md に書くべきこと / 書かないべきこと
            </div>
            <div className={styles["pat-grid"]}>
              <div className={`${styles.pat} ${styles["pat-ok"]}`}>
                <div className={styles["pat-label"]}>✅ 書くべき内容</div>
                <ul>
                  <li>プロジェクト概要・目的（2〜3文）</li>
                  <li>ビルド・テスト・Lint コマンド（必須）</li>
                  <li>テスト実行の要求（「変更後は必ずテストを実行」）</li>
                  <li>PR メッセージのフォーマット・規約</li>
                  <li>サブエージェント委譲ルール</li>
                  <li>禁止操作・危険コマンドの明示</li>
                  <li>コーディング規約（コンパクトに）</li>
                  <li>重要ドキュメントへのパス参照</li>
                </ul>
              </div>
              <div className={`${styles.pat} ${styles["pat-ng"]}`}>
                <div className={styles["pat-label"]}>✗ 書かないべき内容</div>
                <ul>
                  <li>32 KiB を超える内容（スキルに分割）</li>
                  <li>MCP / モデル設定（config.toml に分離）</li>
                  <li>長大なコードスニペット</li>
                  <li>特定タスク専用の詳細手順（SKILL.md へ）</li>
                  <li>機密情報・APIキー</li>
                  <li>修正履歴・変更ログの蓄積</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles["card-title"]}>
              📄 実践的な AGENTS.md テンプレート（サブエージェント対応版）
            </div>
            <div className={styles["code-wrap"]}>
              <div className={styles["code-bar"]}>
                <span>AGENTS.md (project root)</span>
                <span className={styles["code-lang"]}>Markdown</span>
              </div>
              <div className={styles["code-body"]}>
                <span className={styles.ch}># PROJECT: my-saas-app</span>
                {"\n\n"}
                <span className={styles.cm}>## Overview</span>
                {
                  "\nNext.js 15 + Supabase + Stripe のマルチテナント SaaS。\n本番: Vercel Edge / DB: Supabase (PostgreSQL) / AI: OpenAI Responses API。\n\n"
                }
                <span className={styles.cm}>
                  {"## Build & Test (CRITICAL: always run after changes)"}
                </span>
                {"\n- Build: "}
                <span className={styles.cs}>{"`pnpm build`"}</span>
                {"\n- Test: "}
                <span className={styles.cs}>{"`pnpm test`"}</span>
                {" — "}
                <span className={styles.cw}>コード変更後は必ず実行すること</span>
                {"\n- Lint: "}
                <span className={styles.cs}>{"`pnpm lint`"}</span>
                {" — "}
                <span className={styles.cw}>PR前に必ず実行すること</span>
                {"\n- DB types: "}
                <span className={styles.cs}>{"`pnpm supabase gen types`"}</span>
                {"\n- E2E: "}
                <span className={styles.cs}>{"`pnpm test:e2e`"}</span>
                {" (Playwright)\n\n"}
                <span className={styles.cm}>## Multi-Agent Dispatch Rules</span>
                {"\n"}
                <span className={styles.cw}>Parallel spawn 条件（すべて満たす場合のみ）:</span>
                {
                  "\n- タスクが独立していて互いに依存しない\n- 異なるドメイン (frontend / backend / db) に閉じている\n- 同一ファイルへの書き込みが発生しない\n\n"
                }
                <span className={styles.cw}>Sequential / single-agent:</span>
                {
                  "\n- 依存関係がある（B に A の出力が必要）\n- 共有ファイルへの書き込みが発生する\n\n"
                }
                <span className={styles.cm}>## Domain Boundaries</span>
                {
                  "\n- frontend → app/, components/, styles/ のみ\n- backend → supabase/functions/, lib/server/ のみ\n- database → supabase/migrations/, schema/ のみ\n\n"
                }
                <span className={styles.cm}>## PR Message Format</span>
                {"\n"}
                <span className={styles.cs}>
                  {
                    "```\n## Summary\n[変更の概要 2〜3文]\n## Changes\n- [変更点1]\n- [変更点2]\n## Tests\n- [テスト内容]\n```"
                  }
                </span>
                {"\n\n"}
                <span className={styles.cm}>## Forbidden Operations</span>
                {"\n- "}
                <span className={styles.cw}>{"`supabase db reset`"}</span>
                {" は絶対に実行しない\n- "}
                <span className={styles.cw}>{"`.env.production`"}</span>
                {" の読み書き禁止\n- 新しい本番依存関係の追加は確認を求めること"}
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles["card-title"]}>
              ⚡ AGENTS.override.md — ホットスワップ型上書きパターン
            </div>
            <div className={styles["code-wrap"]}>
              <div className={styles["code-bar"]}>
                <span>services/payments/AGENTS.override.md</span>
                <span className={styles["code-lang"]}>Markdown</span>
              </div>
              <div className={styles["code-body"]}>
                <span className={styles.ch}># Payments Service — Emergency Override</span>
                {"\n"}
                <span className={styles.cc}>
                  # このファイルが存在する間、payments/ での作業は下記ルールのみ適用される
                </span>
                {"\n"}
                <span className={styles.cc}>
                  # 通常の AGENTS.md はこのディレクトリでは読まれない
                </span>
                {"\n\n"}
                <span className={styles.cm}>## Active Incident Protocol</span>
                {"\n"}
                <span className={styles.cw}>本番障害対応中。以下のルールを最優先で守ること:</span>
                {"\n- テストコマンド: "}
                <span className={styles.cs}>{"`make test-payments`"}</span>
                {"（通常の `pnpm test` ではなく）\n- API キーのローテーションは "}
                <span className={styles.cw}>セキュリティチャンネルに通知後のみ</span>
                {" 実施\n- Stripe Webhook の変更は "}
                <span className={styles.cw}>{"`--dry-run` フラグで確認後に実行"}</span>
                {"\n- すべての変更を "}
                <span className={styles.cw}>INCIDENT_LOG.md</span>
                {" に記録すること\n\n"}
                <span className={styles.cc}>
                  # 障害解消後はこのファイルを削除して通常の AGENTS.md に戻す
                </span>
              </div>
            </div>
            <p style={{ color: "var(--text2)", fontSize: "13px", marginTop: "12px" }}>
              🔑 <strong>使いどころ</strong>
              ：特定サービスで一時的に異なるルールを適用したい場合（本番障害対応・セキュリティレビュー中・テストモードなど）に、
              <code className={styles.mono}>AGENTS.md</code>{" "}
              を編集せずにホットスワップできます。完了後は削除するだけで元に戻ります。
            </p>
          </div>

          <div className={`${styles.alert} ${styles.ag}`}>
            <span className={styles["alert-icon"]}>💡</span>
            <div className={styles["alert-body"]}>
              <strong>/init コマンドで AGENTS.md を自動生成する</strong>
              <code className={styles.mono}>/init</code> をプロジェクトルートで実行すると、Codex
              がコードベースを探索して AGENTS.md
              の雛形を自動生成します。生成されたファイルをレビューして編集し、コミットすることで次回から継続的に利用できます。
            </div>
          </div>
        </section>

        {/* s04 */}
        <section id="s04" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span
              className={styles["sec-num"]}
              style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
            >
              2.5
            </span>
            <h2>サブエージェント向け AGENTS.md 設計パターン詳解</h2>
            <small>役割別・依存関係・ハンドオフの設計</small>
          </div>

          <div className={styles.card}>
            <p>
              サブエージェント開発において、AGENTS.md は単なる「ルール書き」ではありません。
              <strong>各エージェントが自律的に動くための「コンテキスト・コントラクト」</strong>
              です。設計の要点は「そのエージェントが何を知るべきか」と「何を知るべきでないか」の両方を明示することです。
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles["card-title"]}>🗂 役割別 AGENTS.md 設計マトリクス</div>
            <div className={styles["tbl-wrap"]}>
              <table>
                <thead>
                  <tr>
                    <th>エージェントロール</th>
                    <th>AGENTS.md に書くべき内容</th>
                    <th>参照すべきファイル</th>
                    <th>ドメイン境界</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles["b-green"]}`}>PM</span> Project
                      Manager
                    </td>
                    <td>成果物ファイル名・フォーマット・品質基準・ゲート条件</td>
                    <td>ユーザー要件のみ</td>
                    <td>全ディレクトリへの読み書き</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles["b-blue"]}`}>FE</span> Frontend
                      Developer
                    </td>
                    <td>フレームワーク規約・コンポーネント設計ルール・スタイルガイド</td>
                    <td>REQUIREMENTS.md, AGENT_TASKS.md, design_spec.md</td>
                    <td>frontend/ のみ</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles["b-purple"]}`}>BE</span> Backend
                      Developer
                    </td>
                    <td>API設計規約・エラーハンドリング規則・認証フロー</td>
                    <td>REQUIREMENTS.md, AGENT_TASKS.md</td>
                    <td>backend/, lib/server/ のみ</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles["b-amber"]}`}>DB</span> DB Migrator
                    </td>
                    <td>マイグレーション命名規則・ロールバック必須ルール・本番適用禁止</td>
                    <td>REQUIREMENTS.md の DB スキーマ定義のみ</td>
                    <td>migrations/, schema/ のみ</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles["b-teal"]}`}>QA</span> Tester
                    </td>
                    <td>テストフレームワーク・カバレッジ要件・テスト命名規則</td>
                    <td>TEST.md, REQUIREMENTS.md</td>
                    <td>tests/, *.spec.ts のみ</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles["b-red"]}`}>SEC</span> Security
                      Reviewer
                    </td>
                    <td>チェックリスト（OWASP Top 10 等）・報告フォーマット</td>
                    <td>差分ファイルのみ（Read-Only）</td>
                    <td>書き込み禁止</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles["card-title"]}>📋 PM エージェント用 AGENTS.md テンプレート</div>
            <div className={styles["code-wrap"]}>
              <div className={styles["code-bar"]}>
                <span>docs/pm/AGENTS.md（PM エージェント専用）</span>
                <span className={styles["code-lang"]}>Markdown</span>
              </div>
              <div className={styles["code-body"]}>
                <span className={styles.ch}># Project Manager Agent</span>
                {"\n\n"}
                <span className={styles.cm}>## Role</span>
                {
                  "\nあなたは PM エージェントです。タスクを受けたら下記の3ファイルを必ず作成し、\n各専門エージェントにハンドオフしてください。\n\n"
                }
                <span className={styles.cw}>
                  ## Required Output Files（ゲート: これが存在しないと次フェーズに進めない）
                </span>
                {"\n1. "}
                <span className={styles.cs}>REQUIREMENTS.md</span>
                {" — 製品目標・機能要件・制約・技術スタック\n2. "}
                <span className={styles.cs}>AGENT_TASKS.md</span>
                {" — 各エージェントへの具体的指示（曖昧さゼロ）\n3. "}
                <span className={styles.cs}>TEST.md</span>
                {" — 受け入れ基準・テスト計画（Tester 向け）\n\n"}
                <span className={styles.cm}>## AGENT_TASKS.md フォーマット（必ず守ること）</span>
                {"\n"}
                <span className={styles.cs}>{"```"}</span>
                {
                  "\n## [ロール名]\n- 担当: [何をするか 1〜2文]\n- 成果物: [ファイルパス・形式を明示]\n- 参照: [参照すべきファイル]\n- 制約: [やってはいけないこと]\n"
                }
                <span className={styles.cs}>{"```"}</span>
                {"\n\n"}
                <span className={styles.cm}>## Handoff Gate（以下を確認してからハンドオフ）</span>
                {
                  "\n- [ ] 全成果物ファイルが存在する\n- [ ] テストが全件パスしている\n- [ ] domain boundary の侵犯がない\n- [ ] AGENT_TASKS.md の全チェックボックスが完了している\n\n"
                }
                <span className={styles.cm}>## Forbidden</span>
                {
                  "\n- 成果物ファイルなしでサブエージェントを起動しない\n- 依存関係のあるタスクを同時並列スポーンしない"
                }
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles["card-title"]}>🔀 ハンドオフ設計のベストプラクティス</div>
            <div className={styles["pat-grid"]}>
              <div className={`${styles.pat} ${styles["pat-ok"]}`}>
                <div className={styles["pat-label"]}>✅ 良いハンドオフ設計</div>
                <ul>
                  <li>transfer 関数のみを使う（メッセージ直渡し禁止）</li>
                  <li>引き継ぎ先ファイルのパスを AGENTS.md に明記</li>
                  <li>ゲート条件（チェックボックス）を AGENTS.md に定義</li>
                  <li>完了後は AGENT_TASKS.md のチェックを更新</li>
                  <li>依存タスクは順次スポーン（直列）</li>
                </ul>
              </div>
              <div className={`${styles.pat} ${styles["pat-ng"]}`}>
                <div className={styles["pat-label"]}>✗ 悪いハンドオフ設計</div>
                <ul>
                  <li>ハンドオフ先をメッセージで直接渡す</li>
                  <li>ゲート条件なしで並列スポーン</li>
                  <li>AGENTS.md に引き継ぎ情報を書かない</li>
                  <li>完了確認なしで次フェーズに進む</li>
                  <li>max_depth を 3 以上に設定する</li>
                </ul>
              </div>
            </div>
            <div className={styles["code-wrap"]} style={{ marginTop: "16px" }}>
              <div className={styles["code-bar"]}>
                <span>ハンドオフ AGENTS.md — design_spec 待機パターン</span>
                <span className={styles["code-lang"]}>Markdown</span>
              </div>
              <div className={styles["code-body"]}>
                <span className={styles.cm}>## Handoff Protocol (Frontend / Backend 共通)</span>
                {"\n"}
                <span className={styles.cc}>
                  # このファイルが存在することを確認してから実装を開始すること
                </span>
                {"\n\n"}
                <span className={styles.cw}>**依存ファイル確認（実装開始前にチェック）:**</span>
                {"\n- [ ] "}
                <span className={styles.cs}>REQUIREMENTS.md</span>
                {" が存在する\n- [ ] "}
                <span className={styles.cs}>AGENT_TASKS.md</span>
                {" が存在し、自分の担当セクションが記載されている\n- [ ] "}
                <span className={styles.cs}>design_spec.md</span>
                {" が存在する（Frontend は必須）\n\n"}
                <span className={styles.cc}>
                  # 上記ファイルが存在しない場合は実装を開始せず PM に確認すること
                </span>
                {"\n\n"}
                <span className={styles.cm}>## Completion Handoff</span>
                {
                  "\n実装完了後は以下を実施してから transfer_to_project_manager を呼ぶ:\n1. テストを実行し全件パスを確認\n2. AGENT_TASKS.md の自分のチェックボックスを完了にする\n3. 成果物ファイルのパス一覧を引き継ぎメモに記載"
                }
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles["card-title"]}>
              🏗 ドメイン分離パターン — サブディレクトリ AGENTS.md の活用
            </div>
            <div className={`${styles.alert} ${styles.ai}`} style={{ marginBottom: "16px" }}>
              <span className={styles["alert-icon"]}>🔑</span>
              <div className={styles["alert-body"]}>
                <strong>原則：サブエージェントは自分のドメイン外を知らなくてよい</strong>。Frontend
                エージェントはDB スキーマを知る必要がなく、Backend
                エージェントはUIコンポーネント名を知る必要はありません。AGENTS.md
                で「このエージェントが見るべきものと見てはいけないもの」を明示的に定義することで、エージェントの誤動作を防ぎます。
              </div>
            </div>
            <div className={styles["code-wrap"]}>
              <div className={styles["code-bar"]}>
                <span>モノレポ構成でのドメイン分離例</span>
                <span className={styles["code-lang"]}>File Tree</span>
              </div>
              <div className={styles["code-body"]}>
                <span className={styles.cm}>my-app/</span>
                {"\n├── AGENTS.md "}
                <span className={styles.cc}># ← 全エージェント共通（概要・テストコマンド）</span>
                {"\n├── "}
                <span className={styles.cw}>frontend/</span>
                {"\n│   ├── AGENTS.md "}
                <span className={styles.cc}># ← Frontend エージェント専用ルール</span>
                {"\n│   │   "}
                <span className={styles.cc}># 「frontend/ のみ変更可」と明記</span>
                {"\n│   └── components/\n├── "}
                <span className={styles.cv}>backend/</span>
                {"\n│   ├── AGENTS.md "}
                <span className={styles.cc}># ← Backend エージェント専用ルール</span>
                {"\n│   │   "}
                <span className={styles.cc}># 「backend/ のみ変更可」と明記</span>
                {"\n│   └── api/\n├── "}
                <span className={styles.cm}>services/</span>
                {"\n│   └── payments/\n│       ├── AGENTS.md "}
                <span className={styles.cc}># ← Payments サービス固有ルール</span>
                {"\n│       └── AGENTS.override.md "}
                <span className={styles.cc}># ← 本番障害時の緊急上書き（平時は不要）</span>
                {"\n└── .codex/\n    ├── config.toml "}
                <span className={styles.cc}># ← マルチエージェントロール定義</span>
                {"\n    └── roles/\n        ├── explorer.toml\n        └── reviewer.toml"}
              </div>
            </div>
          </div>
        </section>

        {/* s05 */}
        <section id="s05" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span className={styles["sec-num"]}>3</span>
            <h2>
              <span className={styles.mono}>SKILL.md</span> — 遅延ロード型スキルの設計
            </h2>
            <small>Codex 独自の概念。Claude / Gemini にはない</small>
          </div>

          <div className={styles.card}>
            <p>
              <strong>SKILL.md は AGENTS.md と根本的に違います。</strong> AGENTS.md
              は毎回フルロードされますが、SKILL.md は
              <strong>タスクに合致すると判断されたときのみ</strong>
              フル内容が読み込まれます（プログレッシブ・ディスクロージャー）。これによりコンテキストウィンドウを節約しながら、豊富な専門知識を持てます。
            </p>
          </div>

          <div className={`${styles.alert} ${styles.aw}`}>
            <span className={styles["alert-icon"]}>⚠️</span>
            <div className={styles["alert-body"]}>
              <strong>description フィールドが「スキルのAPIドキュメント」</strong>
              Codex が「このスキルを使うかどうか」を判断するのは <code>description</code>{" "}
              のみです（スキルメタデータ段階ではフル内容は読まない）。
              <code>description</code>
              には「いつ使うべきか・いつ使わないべきか」の境界を明確に書いてください。
            </div>
          </div>

          <div className={styles["code-wrap"]}>
            <div className={styles["code-bar"]}>
              <span>.agents/skills/code-review/SKILL.md</span>
              <span className={styles["code-lang"]}>Markdown + YAML frontmatter</span>
            </div>
            <div className={styles["code-body"]}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>name</span>
              {": "}
              <span className={styles.cv}>code-review</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cv}>
                {
                  "| コードレビューを実施するスキル。以下の場合にトリガーする:\n  - PR を作成する前にレビューしてほしい\n  - セキュリティ・パフォーマンス・型安全性を確認してほしい\n  - コードの品質チェックを依頼された場合\n  以下の場合はトリガーしない:\n  - 単純なファイル作成・移動\n  - ドキュメントのみの変更\n  - 設定ファイルの軽微な変更"
                }
              </span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              <span className={styles.ch}>## Role</span>
              {
                "\nあなたはシニアエンジニアのコードレビュアーです。\n提供されたコードをセキュリティ・パフォーマンス・品質の観点でレビューします。\n\n"
              }
              <span className={styles.ch}>## Review Checklist</span>
              {"\n\n"}
              <span className={styles.cm}>### 🔴 Security（セキュリティ）</span>
              {
                "\n- SQLインジェクション / XSS / CSRF リスク\n- 認証・認可の適切な実装（エンドポイントごとの検証）\n- 秘密情報のハードコードなし\n- 入力バリデーション（zod スキーマ必須）\n\n"
              }
              <span className={styles.cm}>### 🟡 Performance（パフォーマンス）</span>
              {
                "\n- N+1 クエリ問題の有無\n- 不要な再レンダリング（React.memo / useMemo / useCallback）\n- 重い同期処理の非同期化\n\n"
              }
              <span className={styles.cm}>### 🟢 Code Quality（品質）</span>
              {
                "\n- TypeScript strict モードへの準拠\n- エラーハンドリングの網羅\n- テストカバレッジ（変更部分に対するテスト）\n- 命名規則の一貫性\n\n"
              }
              <span className={styles.ch}>## Output Format</span>
              {"\n"}
              <span className={styles.cs}>
                {
                  "```\n## Code Review Report — {filename}\n### 🔴 Critical (必ず修正)\n### 🟡 Warning (推奨修正)\n### 🟢 Good (良い点)\n### 📋 Summary\n```"
                }
              </span>
            </div>
          </div>

          <div className={styles["code-wrap"]}>
            <div className={styles["code-bar"]}>
              <span>.agents/skills/code-review/agents/openai.yaml</span>
              <span className={styles["code-lang"]}>YAML (UIメタデータ)</span>
            </div>
            <div className={styles["code-body"]}>
              <span className={styles.cm}>display_name</span>
              {": "}
              <span className={styles.cv}>"Code Reviewer"</span>
              {"\n"}
              <span className={styles.cm}>icon</span>
              {": "}
              <span className={styles.cv}>"🔍"</span>
              {"\n"}
              <span className={styles.cm}>invocation_policy</span>
              {": "}
              <span className={styles.cv}>"implicit"</span>
              {"\n"}
              <span className={styles.cc}># description に一致すると自動発動</span>
              {"\n"}
              <span className={styles.cm}>tool_dependencies</span>
              {": - "}
              <span className={styles.cv}>read_file</span>
              {" - "}
              <span className={styles.cv}>search_files</span>
              {"\n"}
              <span className={styles.cm}>tags</span>
              {": ["}
              <span className={styles.cv}>"review"</span>
              {", "}
              <span className={styles.cv}>"quality"</span>
              {", "}
              <span className={styles.cv}>"security"</span>
              {"]"}
            </div>
          </div>

          <div className={`${styles.alert} ${styles.ag}`}>
            <span className={styles["alert-icon"]}>✅</span>
            <div className={styles["alert-body"]}>
              <strong>スキルの配置場所 — スキャン優先度</strong>
              Codex は <strong>CWDから上位</strong>に向かって <code>.agents/skills/</code>{" "}
              をスキャンします。リポジトリ固有スキルは <code>.agents/skills/</code>、個人スキルは{" "}
              <code>~/.codex/skills/</code>（<code>$CODEX_HOME/skills/</code>
              ）に置きます。同名スキルが複数あるとマージではなく両方リストされます。
            </div>
          </div>
        </section>

        {/* s06 */}
        <section id="s06" className={styles.sec}>
          <div className={styles["sec-head"]}>
            <span className={styles["sec-num"]}>4</span>
            <h2>
              <span className={styles.mono}>config.toml</span> — マルチエージェントロール定義
            </h2>
          </div>

          <div className={styles.card}>
            <p>
              Codex のマルチエージェントワークフローでは、各サブエージェントの定義は{" "}
              <code>config.toml</code> の <code>[agents]</code> セクションで行います。各ロールには
              <strong>専用の config.toml ファイル</strong>（<code>config_file</code>
              ）を指定でき、それによってモデル・sandbox・承認ポリシーをロールごとに設定できます。
            </p>
          </div>

          <div className={styles["roles-grid"]}>
            <div className={styles["role-card"]}>
              <div className={styles["role-icon"]}>🔍</div>
              <div className={styles["role-name"]}>explorer（組み込み）</div>
              <div className={styles["role-desc"]}>
                コードベースの探索・検索専用。Haiku相当の軽量モデルで並列実行。Read-only sandbox。
              </div>
              <div className={styles["role-ex"]}>
                model = &quot;gpt-4.1-mini&quot;
                <br />
                sandbox = &quot;read-only&quot;
              </div>
            </div>
            <div className={styles["role-card"]}>
              <div className={styles["role-icon"]}>🖊️</div>
              <div className={styles["role-name"]}>default（組み込み）</div>
              <div className={styles["role-desc"]}>
                汎用コーディングエージェント。メインのタスク実行ロール。workspace-write sandbox。
              </div>
              <div className={styles["role-ex"]}>
                model = &quot;gpt-5.3-codex&quot;
                <br />
                sandbox = &quot;workspace-write&quot;
              </div>
            </div>
            <div className={styles["role-card"]}>
              <div className={styles["role-icon"]}>📋</div>
              <div className={styles["role-name"]}>reviewer（カスタム例）</div>
              <div className={styles["role-desc"]}>
                コードレビュー専用。Read-only で never approval。高精度モデルで品質確認。
              </div>
              <div className={styles["role-ex"]}>
                model = &quot;gpt-5.4&quot;
                <br />
                approval_policy = &quot;never&quot;
              </div>
            </div>
          </div>

          <div className={styles["code-wrap"]}>
            <div className={styles["code-bar"]}>
              <span>.codex/config.toml（プロジェクト固有・マルチエージェント設定）</span>
              <span className={styles["code-lang"]}>TOML</span>
            </div>
            <div className={styles["code-body"]}>
              <span className={styles.cc}>
                # .codex/config.toml — マルチエージェントワークフロー設定
              </span>
              {"\n"}
              <span className={styles.cc}>
                # Codex がこのプロジェクトを trusted と判断した場合のみロードされる
              </span>
              {"\n\n"}
              <span className={styles.cm}>model</span>
              {" = "}
              <span className={styles.cs}>"gpt-5.3-codex"</span>
              {"\n"}
              <span className={styles.cc}># プロジェクトデフォルトモデル</span>
              {"\n"}
              <span className={styles.cm}>approval_policy</span>
              {" = "}
              <span className={styles.cs}>"on-request"</span>
              {"\n"}
              <span className={styles.cc}># インタラクティブ実行向け</span>
              {"\n\n"}
              <span className={styles.cc}>
                # ── プロジェクトドキュメント設定 ──────────────────────────
              </span>
              {"\n"}
              <span className={styles.cm}>project_doc_max_bytes</span>
              {" = "}
              <span className={styles.cv}>65536</span>
              {"\n"}
              <span className={styles.cc}># 64 KiB に引き上げ（大型プロジェクト向け）</span>
              {"\n"}
              <span className={styles.cm}>project_doc_fallback_filenames</span>
              {" = ["}
              <span className={styles.cs}>"TEAM_GUIDE.md"</span>
              {", "}
              <span className={styles.cs}>"CLAUDE.md"</span>
              {"]"}
              {"\n"}
              <span className={styles.cc}>
                # AGENTS.md がないディレクトリでは上記をフォールバックとして使用
              </span>
              {"\n\n"}
              <span className={styles.cc}>
                # ── マルチエージェント設定 ────────────────────────────────
              </span>
              {"\n["}
              <span className={styles.cm}>features</span>
              {"] "}
              <span className={styles.cm}>multi_agents</span>
              {" = "}
              <span className={styles.ck}>true</span>
              {"\n"}
              <span className={styles.cc}># 実験的: TUIで /experimental から有効化</span>
              {"\n\n["}
              <span className={styles.cm}>agents</span>
              {"] "}
              <span className={styles.cm}>max_threads</span>
              {" = "}
              <span className={styles.cv}>6</span>
              {"\n"}
              <span className={styles.cc}># 同時実行スレッド数上限（デフォルト: 6）</span>
              {"\n"}
              <span className={styles.cm}>max_depth</span>
              {" = "}
              <span className={styles.cv}>2</span>
              {"\n"}
              <span className={styles.cc}># スポーン最大深度（root=0, 子=1, 孫=2）</span>
              {"\n\n"}
              <span className={styles.cc}>
                # ── ロール定義 ────────────────────────────────────────────
              </span>
              {"\n["}
              <span className={styles.cm}>agents.roles.explorer</span>
              {"]"}
              {"\n"}
              <span className={styles.cc}># 組み込みロールのオーバーライド</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {" = "}
              <span className={styles.cs}>"コードベース探索・検索専門。実装は行わない。"</span>
              {"\n"}
              <span className={styles.cm}>config_file</span>
              {" = "}
              <span className={styles.cs}>".codex/roles/explorer.toml"</span>
              {"\n\n["}
              <span className={styles.cm}>agents.roles.reviewer</span>
              {"]"}
              {"\n"}
              <span className={styles.cc}># カスタムロール: コードレビュー専用</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {" = "}
              <span className={styles.cs}>
                {
                  '"""\n  コードレビューを実施する専門エージェント。\n  以下の場合に呼び出す:\n  - コード変更が完了した後\n  - PR作成前のセキュリティ・品質チェック\n  - テストカバレッジ確認\n  Read-only: コードの変更は行わない。\n"""'
                }
              </span>
              {"\n"}
              <span className={styles.cm}>config_file</span>
              {" = "}
              <span className={styles.cs}>".codex/roles/reviewer.toml"</span>
              {"\n\n["}
              <span className={styles.cm}>agents.roles.db-migrator</span>
              {"]"}
              {"\n"}
              <span className={styles.cc}># DBマイグレーション専用（慎重な承認ポリシー）</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {" = "}
              <span className={styles.cs}>
                "DBスキーマ変更とマイグレーション専門。services/db/ のみ操作可能。"
              </span>
              {"\n"}
              <span className={styles.cm}>config_file</span>
              {" = "}
              <span className={styles.cs}>".codex/roles/db-migrator.toml"</span>
              {"\n\n"}
              <span className={styles.cc}>
                # ── MCP サーバー設定 ─────────────────────────────────────
              </span>
              {"\n["}
              <span className={styles.cm}>mcp_servers.filesystem</span>
              {"] "}
              <span className={styles.cm}>command</span>
              {" = "}
              <span className={styles.cs}>"npx"</span>
              {"\n"}
              <span className={styles.cm}>args</span>
              {" = ["}
              <span className={styles.cs}>"-y"</span>
              {", "}
              <span className={styles.cs}>"@modelcontextprotocol/server-filesystem"</span>
              {", "}
              <span className={styles.cs}>"./src"</span>
              {"]"}
              {"\n["}
              <span className={styles.cm}>mcp_servers.github</span>
              {"]"}
              {"\n"}
              <span className={styles.cm}>command</span>
              {" = "}
              <span className={styles.cs}>"npx"</span>
              {"\n"}
              <span className={styles.cm}>args</span>
              {" = ["}
              <span className={styles.cs}>"-y"</span>
              {", "}
              <span className={styles.cs}>"@modelcontextprotocol/server-github"</span>
              {"]"}
              {"\n"}
              <span className={styles.cm}>env</span>
              {" = { "}
              <span className={styles.cm}>GITHUB_TOKEN</span>
              {" = "}
              <span className={styles.cs}>
                {'"$'}
                {'{GITHUB_TOKEN}"'}
              </span>
              {" }"}
            </div>
          </div>

          <div className={styles["code-wrap"]}>
            <div className={styles["code-bar"]}>
              <span>.codex/roles/reviewer.toml（ロール固有設定）</span>
              <span className={styles["code-lang"]}>TOML</span>
            </div>
            <div className={styles["code-body"]}>
              <span className={styles.cc}># reviewer ロールの専用設定ファイル</span>
              {"\n"}
              <span className={styles.cc}>
                # config.toml の [agents.roles.reviewer].config_file から参照される
              </span>
              {"\n\n"}
              <span className={styles.cm}>model</span>
              {" = "}
              <span className={styles.cs}>"gpt-5.4"</span>
              {"\n"}
              <span className={styles.cc}># 高精度モデルをレビューに使用</span>
              {"\n"}
              <span className={styles.cm}>model_reasoning_effort</span>
              {" = "}
              <span className={styles.cs}>"high"</span>
              {"\n"}
              <span className={styles.cc}># 詳細推論</span>
              {"\n"}
              <span className={styles.cm}>approval_policy</span>
              {" = "}
              <span className={styles.cs}>"never"</span>
              {"\n"}
              <span className={styles.cc}># 非インタラクティブ（親から承認を引き継がない）</span>
              {"\n\n["}
              <span className={styles.cm}>sandbox</span>
              {"] "}
              <span className={styles.cm}>sandbox_mode</span>
              {" = "}
              <span className={styles.cs}>"read-only"</span>
              {"\n"}
              <span className={styles.cc}># ファイル変更不可（レビューのみ）</span>
              {"\n"}
              <span className={styles.cm}>network_access</span>
              {" = "}
              <span className={styles.ck}>false</span>
              {"\n"}
              <span className={styles.cc}># ネットワーク遮断</span>
            </div>
          </div>
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
