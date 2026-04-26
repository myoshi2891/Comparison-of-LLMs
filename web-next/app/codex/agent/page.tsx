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
          <p>（faithful 移植 s01 — 後続コミットで充填）</p>
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
