import type { Metadata } from "next";
import type { ReactNode } from "react";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title:
    "Gemini マルチエージェント開発 (ADK / A2A / AgentEngine) ベストプラクティス | LLM コスト計算機",
  description:
    "Google Gemini CLI v0.34.0・ADK 2.0 Alpha・A2A / AP2 / A2UI プロトコル時代のサブエージェント / マルチエージェント開発で必要な GEMINI.md・AGENTS.md・agent.py・agent.json・.geminiignore・settings.json の役割と書き方を体系化したガイド。",
};

type Source = { icon: string; title: string; href: string; desc: string };

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function CodeBlock({ lang, body }: { lang: string; body: ReactNode }) {
  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeBar}>
        <span className={styles.lang}>{lang}</span>
      </div>
      <div className={styles.codeBody}>{body}</div>
    </div>
  );
}

// ── SECTION METADATA ────────────────────────────────────────────────

const SECTION_IDS = [
  "s01",
  "s02",
  "s03",
  "s04",
  "s05",
  "s06",
  "s07",
  "s08",
  "s09",
  "s10",
  "s11",
  "s12",
  "s13",
  "s14",
  "s15",
  "s16",
  "s17",
] as const;

const SECTION_TITLES: readonly string[] = [
  "全体アーキテクチャと各ファイルの位置づけ",
  "GEMINI.md / AGENT.md — コンテキストファイルの設計",
  "AGENTS.md — クロスツール互換戦略",
  "ADK agent.py — サブエージェント定義のベストプラクティス",
  ".geminiignore と settings.json — 制御ファイル設計",
  "サブエージェント ルーティング設計の意思決定ツリー",
  "コスト最適なモデル選択戦略",
  "絶対に避けるべき Anti-Patterns",
  "まとめ：各ファイルの役割と設計原則",
  "サブエージェント vs マルチエージェント — ADK × A2A × MCP × AP2/A2UI の4層構造",
  "A2A の核心：agent.json (Agent Card) — リモートエージェントの「能力書」",
  "マルチエージェント向け GEMINI.md — Orchestrator の「作戦指令書」",
  "マルチエージェント agent.py — Orchestrator + RemoteA2aAgent 実装パターン",
  "AgentEngine (Vertex AI) 本番デプロイと GEMINI.md 連携",
  "マルチエージェント ユースケース別 設計パターン",
  "マルチエージェント固有の Anti-Patterns — 設計・運用両面",
  "全ファイル役割まとめ（マルチエージェント + A2A 対応版）",
];

// ── SOURCES (12 既存 + 13 新規 = 25 件) ──────────────────────────────

const SOURCES: Source[] = [
  {
    icon: "🔵",
    title: "Gemini CLI 公式: GEMINI.md ドキュメント",
    href: "https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html",
    desc: "GEMINI.md の階層・優先順位・命名ルールの一次情報",
  },
  {
    icon: "🟢",
    title: "Google Developers: Gemini Code Assist agent mode",
    href: "https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer",
    desc: "Agent mode の動作と CLI / IDE 統合の概要",
  },
  {
    icon: "🟡",
    title: "Google Cloud Docs: Gemini Code Assist agent mode",
    href: "https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer",
    desc: "Cloud 側の公式ドキュメント。設定キーの正本",
  },
  {
    icon: "🔴",
    title: "Android Developers: AGENTS.md ファイル",
    href: "https://developer.android.com/studio/gemini/agent-files",
    desc: "Android Studio における AGENTS.md / GEMINI.md の使い分け",
  },
  {
    icon: "🟣",
    title: "ADK 公式: Multi-agent systems",
    href: "https://google.github.io/adk-docs/agents/multi-agents/",
    desc: "Agent Development Kit のマルチエージェント設計パターン",
  },
  {
    icon: "🟠",
    title: "Google Cloud Blog: Multi-agent patterns in ADK",
    href: "https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/",
    desc: "Sequential / Parallel / LoopAgent の使い分け解説",
  },
  {
    icon: "⚪",
    title: "Google Cloud Blog: Building Collaborative AI (ADK)",
    href: "https://cloud.google.com/blog/topics/developers-practitioners/building-collaborative-ai-a-developers-guide-to-multi-agent-systems-with-adk",
    desc: "ADK で協調エージェントを組み立てる開発者向けガイド",
  },
  {
    icon: "🔵",
    title: "Addy Osmani: Gemini CLI Tips & Tricks",
    href: "https://addyosmani.com/blog/gemini-cli/",
    desc: "Gemini CLI の実用 Tips と GEMINI.md 運用例",
  },
  {
    icon: "🟢",
    title: "Google Cloud Medium: GEMINI.md hierarchy Part 1",
    href: "https://medium.com/google-cloud/practical-gemini-cli-instruction-following-gemini-md-hierarchy-part-1-3ba241ac5496",
    desc: "GEMINI.md 階層解決の挙動を実測ベースで解説",
  },
  {
    icon: "🟡",
    title: "GitHub: AGENTS.md 標準化ディスカッション",
    href: "https://github.com/google-gemini/gemini-cli/discussions/1471",
    desc: "AGENTS.md をクロスツール標準にする議論スレッド",
  },
  {
    icon: "⚫",
    title: "Phil Schmid: Gemini CLI Cheatsheet",
    href: "https://www.philschmid.de/gemini-cli-cheatsheet",
    desc: "コマンド・設定キー・ホットキーのチートシート",
  },
  {
    icon: "🔴",
    title: "Google Codelabs: Build Multi-Agent Systems with ADK",
    href: "https://codelabs.developers.google.com/codelabs/production-ready-ai-with-gc/3-developing-agents/build-a-multi-agent-system-with-adk",
    desc: "本番環境向け ADK マルチエージェント構築の Codelab",
  },
  {
    icon: "🌐",
    title: "ADK 公式: A2A Protocol 入門",
    href: "https://google.github.io/adk-docs/a2a/intro/",
    desc: "Agent2Agent (A2A) プロトコルの概念と用語",
  },
  {
    icon: "🟢",
    title: "ADK 公式: A2A Quickstart (Exposing)",
    href: "https://google.github.io/adk-docs/a2a/quickstart-exposing/",
    desc: "ローカル ADK エージェントを A2A エンドポイントとして公開する手順",
  },
  {
    icon: "🔵",
    title: "Google Blog: Agent2Agent (A2A) Protocol 発表",
    href: "https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/",
    desc: "A2A 公開発表記事。設計思想と背景",
  },
  {
    icon: "🟡",
    title: "Google Cloud Blog: ADK エージェントを A2A に変換する",
    href: "https://cloud.google.com/blog/products/ai-machine-learning/unlock-ai-agent-collaboration-convert-adk-agents-for-a2a",
    desc: "既存 ADK エージェントを A2A 互換にする変換手順",
  },
  {
    icon: "🟣",
    title: "Google Developers Blog: ADK + Interactions API",
    href: "https://developers.googleblog.com/building-agents-with-the-adk-and-the-new-interactions-api/",
    desc: "Interactions API を活用した ADK エージェント構築",
  },
  {
    icon: "🟠",
    title: "Google Codelabs: A2A Purchasing Concierge",
    href: "https://codelabs.developers.google.com/intro-a2a-purchasing-concierge",
    desc: "A2A 入門 Codelab。複数エージェント連携の手触り",
  },
  {
    icon: "⚫",
    title: "Harris Solangi: Building Connected AI Agents",
    href: "https://harrissolangi.medium.com/building-connected-ai-agents-googles-adk-and-the-a2a-protocol-704ce3347cfc",
    desc: "ADK + A2A による接続型エージェント設計の実践",
  },
  {
    icon: "🔴",
    title: "GitGuardian Blog: Multi-Agent Security Pipeline with A2A",
    href: "https://blog.gitguardian.com/building-a-multi-agent-security-pipeline-with-googles-a2a-protocol-and-gitguardian/",
    desc: "A2A + GitGuardian でセキュリティ自動化パイプラインを構築",
  },
  {
    icon: "🟥",
    title: "Gemini モデル一覧 (Gemini API 公式)",
    href: "https://ai.google.dev/gemini-api/docs/models",
    desc: "現行 Gemini モデル ID と特性の一次情報",
  },
  {
    icon: "⛔",
    title: "Gemini deprecations (廃止スケジュール)",
    href: "https://ai.google.dev/gemini-api/docs/deprecations",
    desc: "旧モデルの廃止時期。本番運用前に必ず確認",
  },
  {
    icon: "🟦",
    title: "ADK TypeScript / JavaScript SDK",
    href: "https://github.com/google/adk-typescript",
    desc: "Node.js / TypeScript 環境向け ADK 実装",
  },
  {
    icon: "🟧",
    title: "Google Developers Blog: AP2 / A2UI / AG-UI 新プロトコル",
    href: "https://developers.googleblog.com/en/new-agent-protocols-ap2-a2ui-ag-ui/",
    desc: "A2A の上位プロトコル群（AP2 / A2UI / AG-UI）の俯瞰",
  },
  {
    icon: "🟩",
    title: "ADK Python 2.0 Alpha (グラフベース)",
    href: "https://google.github.io/adk-docs/agents/workflow-agents/graph/",
    desc: "ADK 2.0 のグラフベース ワークフローエージェント",
  },
];

// ── PAGE ─────────────────────────────────────────────────────────────

export default function GeminiAgentPage() {
  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        {/* HERO */}
        <div className={styles.hero}>
          <div className={styles.heroEyebrow}>
            🤖 Google Gemini 完全ガイド — 2026 年 3 月最新版 / Gemini CLI v0.34.0 / ADK 2.0 Alpha /
            A2A + AP2 + A2UI 対応
          </div>
          <h1>
            Gemini マルチエージェント開発における
            <br />
            Markdown ファイル &amp; 設定ファイル ベストプラクティス
          </h1>
          <p>
            <code>GEMINI.md</code> ・ <code>AGENTS.md</code> ・ <code>agent.py</code> ・{" "}
            <code>.geminiignore</code> ・ <code>settings.json</code> に加え、
            <strong>
              A2A プロトコル（<code>agent.json</code> / Agent Card）・AgentEngine デプロイ・
              マルチエージェント向け GEMINI.md 設計・<code>RemoteA2aAgent</code> 実装パターン
            </strong>
            まで ── Gemini エコシステムの全ファイルを体系的に解説します。
          </p>
          <div className={styles.heroChips}>
            <span className={styles.heroChip}>Gemini CLI v0.34.0</span>
            <span className={styles.heroChip}>Gemini Code Assist</span>
            <span className={styles.heroChip}>ADK 2.0 Alpha (Python / TS / Go / Java)</span>
            <span className={styles.heroChip}>A2A / AP2 / A2UI / AG-UI</span>
            <span className={styles.heroChip}>AgentEngine (Vertex AI)</span>
            <span className={styles.heroChip}>Plan Mode</span>
            <span className={styles.heroChip}>MCP Integration</span>
            <span className={styles.heroChip}>Android Studio</span>
          </div>
        </div>

        {/* TOC */}
        <nav className={styles.toc}>
          <div className={styles.tocTitle}>目次</div>
          <ol>
            {SECTION_IDS.map((id, i) => (
              <li key={id}>
                <a href={`#${id}`}>
                  {i + 1}. {SECTION_TITLES[i]}
                </a>
              </li>
            ))}
            <li>
              <a href="#sources">📚 参考ソース（25 件）</a>
            </li>
          </ol>
        </nav>

        {/* s01: 全体アーキテクチャ */}
        <section id="s01" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>1</span>
            <h2>{SECTION_TITLES[0]}</h2>
          </div>
          <div className={styles.card}>
            <p>
              Gemini エコシステムでのサブエージェント開発では、
              <strong>ツールによってコンテキストファイルの仕組みが異なります</strong>
              。大きく 2 つのレイヤーに分けて理解することが重要です。
            </p>
          </div>
          <div className={styles.hierWrap}>
            <div className={styles.hierTitle}>FILE HIERARCHY &amp; PRIORITY</div>
            <div className={styles.hierCol}>
              <div className={`${styles.hierBox} ${styles.hbGlobal}`}>
                ~/.gemini/GEMINI.md
                <div className={styles.hierLabel}>グローバル（全プロジェクト共通）</div>
              </div>
              <div className={styles.hierArrowDown}>↓</div>
              <div className={`${styles.hierBox} ${styles.hbProject}`}>
                &lt;project&gt;/GEMINI.md
                <div className={styles.hierLabel}>プロジェクトルート</div>
              </div>
              <div className={styles.hierArrowDown}>↓</div>
              <div className={`${styles.hierBox} ${styles.hbSub}`}>
                &lt;project&gt;/&lt;subdir&gt;/GEMINI.md
                <div className={styles.hierLabel}>サブディレクトリ局所設定</div>
              </div>
              <div className={styles.hierArrowDown}>↓</div>
              <div className={`${styles.hierBox} ${styles.hbAuto}`}>
                AGENTS.md / agent.py
                <div className={styles.hierLabel}>クロスツール / ADK ランタイム</div>
              </div>
            </div>
            <div className={styles.hierPriority}>
              下位ファイルほど優先度が高く、上位設定をオーバーライドする
            </div>
          </div>
        </section>

        {/* s02: GEMINI.md / AGENT.md */}
        <section id="s02" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>2</span>
            <h2>{SECTION_TITLES[1]}</h2>
          </div>
          <div className={`${styles.alert} ${styles.alertWarn}`}>
            <span className={styles.alertIcon}>⚠️</span>
            <div className={styles.alertContent}>
              <strong>コンテキストファイルは肥大化させない</strong>
              GEMINI.md は毎セッションで自動ロードされます。コードスタイル・修正履歴などの瑣末情報を
              詰め込みすぎると Gemini の指示追従性が劇的に低下します。
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>📋 GEMINI.md に書くべきこと / 書かないべきこと</div>
            <div className={styles.patGrid}>
              <div className={`${styles.pat} ${styles.patOk}`}>
                <div className={styles.patLabel}>✅ 書くべき内容</div>
                <ul>
                  <li>プロジェクト概要（1〜3 文）</li>
                  <li>技術スタック・主要ライブラリ</li>
                  <li>サブエージェントのルーティングルール</li>
                  <li>禁止コマンド・危険操作の明示</li>
                  <li>ビルド / テスト / デプロイコマンド</li>
                </ul>
              </div>
              <div className={`${styles.pat} ${styles.patNg}`}>
                <div className={styles.patLabel}>✗ 書かないべき内容</div>
                <ul>
                  <li>コードスタイル（linter に委ねる）</li>
                  <li>長大なコードスニペット</li>
                  <li>修正履歴・変更ログ</li>
                  <li>「〜しないで」の禁止形のみの指示</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* s03: AGENTS.md */}
        <section id="s03" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>3</span>
            <h2>{SECTION_TITLES[2]}</h2>
          </div>
          <div className={styles.card}>
            <p>
              <code>AGENTS.md</code> は Gemini CLI / Android Studio / Codex / Cursor など
              <strong>複数 AI ツールが共通で読む</strong>
              ことを前提に標準化が進んでいるファイルです。 ツール固有指示は GEMINI.md に、共通指示は
              AGENTS.md に分離するのが基本戦略となります。
            </p>
          </div>
          <CodeBlock
            lang="Markdown"
            body={`# AGENTS.md
## Build & Test
- Build: \`pnpm build\`
- Test:  \`pnpm test\`

## Conventions
- TypeScript strict, no \`any\`
- Result<T, E> でエラーを表現、throw 禁止
`}
          />
        </section>

        {/* s04: ADK agent.py */}
        <section id="s04" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>4</span>
            <h2>{SECTION_TITLES[3]}</h2>
          </div>
          <div className={styles.card}>
            <p>
              ADK (Agent Development Kit) では <code>agent.py</code>{" "}
              がサブエージェントの定義本体です。
              <code>LlmAgent</code> ・ <code>SequentialAgent</code> ・ <code>ParallelAgent</code> ・
              <code>LoopAgent</code> を組み合わせて協調パイプラインを構築します。
            </p>
          </div>
          <CodeBlock
            lang="Python"
            body={`from google.adk.agents import LlmAgent, SequentialAgent

reviewer = LlmAgent(
    name="code_reviewer",
    model="gemini-2.5-pro",
    instruction="セキュリティ・パフォーマンス・型安全性をチェックする",
    tools=[read_file, grep],
)

pipeline = SequentialAgent(
    name="review_pipeline",
    sub_agents=[reviewer, summarizer],
)
`}
          />
        </section>

        {/* s05: .geminiignore / settings.json */}
        <section id="s05" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>5</span>
            <h2>{SECTION_TITLES[4]}</h2>
          </div>
          <div className={styles.card}>
            <p>
              <code>.geminiignore</code> はファイル走査範囲を絞り込み、
              <code>settings.json</code> は CLI / Code Assist の挙動を制御します。 いずれも
              GEMINI.md と組み合わせてセキュリティ境界を作るのが基本です。
            </p>
          </div>
          <CodeBlock
            lang=".geminiignore"
            body={`node_modules/
.env*
*.log
dist/
coverage/
`}
          />
        </section>

        {/* s06: ルーティング設計 */}
        <section id="s06" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>6</span>
            <h2>{SECTION_TITLES[5]}</h2>
          </div>
          <div className={styles.flowWrap}>
            <div className={styles.flowTitle}>SUB-AGENT ROUTING DECISION TREE</div>
            <div className={styles.flowRow}>
              <div className={styles.fnQ}>タスクが 3 件以上で互いに独立か?</div>
              <div className={styles.fnArr}>→ NO →</div>
              <div className={styles.fnN}>メインエージェントで処理</div>
            </div>
            <div className={styles.fnIndent}>↓ YES</div>
            <div className={styles.flowRow}>
              <div className={styles.fnQ}>タスク間に依存関係がある?</div>
              <div className={styles.fnArr}>→ YES →</div>
              <div className={styles.fnN}>SequentialAgent (直列)</div>
            </div>
            <div className={styles.fnIndent}>↓ NO</div>
            <div className={styles.flowRow}>
              <div className={styles.fnY}>✅ ParallelAgent (並列)</div>
              <div className={styles.fnLabel}>frontend / backend / db を同時起動</div>
            </div>
          </div>
        </section>

        {/* s07: モデル選択 */}
        <section id="s07" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>7</span>
            <h2>{SECTION_TITLES[6]}</h2>
          </div>
          <div className={`${styles.alert} ${styles.alertDanger}`}>
            <span className={styles.alertIcon}>🚨</span>
            <div className={styles.alertContent}>
              <strong>旧モデルの廃止スケジュールを必ず確認</strong>
              Gemini モデルは半年〜1 年単位で deprecation が進みます。本番投入前に公式 deprecation
              ページを確認してください。
            </div>
          </div>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>モデル</th>
                  <th>用途</th>
                  <th>サブエージェント例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>gemini-2.5-flash</code>
                  </td>
                  <td>高速・低コスト</td>
                  <td>コードベース探索、ファイル検索</td>
                </tr>
                <tr>
                  <td>
                    <code>gemini-2.5-pro</code>
                  </td>
                  <td>バランス重視</td>
                  <td>コードレビュー、テスト生成、実装</td>
                </tr>
                <tr>
                  <td>
                    <code>gemini-2.5-pro</code>（thinking 強化）
                  </td>
                  <td>難解な設計判断</td>
                  <td>アーキテクト、ADR 作成</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* s08: Anti-Patterns */}
        <section id="s08" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>8</span>
            <h2>{SECTION_TITLES[7]}</h2>
          </div>
          <div className={`${styles.alert} ${styles.alertDanger}`}>
            <span className={styles.alertIcon}>🚫</span>
            <div className={styles.alertContent}>
              <strong>サブエージェントに全ツール権限を渡さない</strong>
              ADK / Gemini CLI ともデフォルトで全ツール有効になります。 Read-only
              エージェントには明示的に allowlist を絞り込んでください。
            </div>
          </div>
          <div className={`${styles.alert} ${styles.alertWarn}`}>
            <span className={styles.alertIcon}>⚠️</span>
            <div className={styles.alertContent}>
              <strong>GEMINI.md にコードスタイルを書かない</strong>
              linter / formatter の責務を奪うとトークン消費とハルシネーションを増やします。
            </div>
          </div>
        </section>

        {/* s09: まとめ */}
        <section id="s09" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>9</span>
            <h2>{SECTION_TITLES[8]}</h2>
          </div>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>ファイル</th>
                  <th>役割</th>
                  <th>更新頻度</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>GEMINI.md</code>
                  </td>
                  <td>プロジェクト全体のコンテキスト</td>
                  <td>低</td>
                </tr>
                <tr>
                  <td>
                    <code>AGENTS.md</code>
                  </td>
                  <td>クロスツール共通指示</td>
                  <td>低</td>
                </tr>
                <tr>
                  <td>
                    <code>agent.py</code>
                  </td>
                  <td>ADK サブエージェント定義</td>
                  <td>中</td>
                </tr>
                <tr>
                  <td>
                    <code>.geminiignore</code>
                  </td>
                  <td>走査範囲の制御</td>
                  <td>低</td>
                </tr>
                <tr>
                  <td>
                    <code>settings.json</code>
                  </td>
                  <td>CLI / IDE 挙動制御</td>
                  <td>低</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* === MULTI-AGENT (s10〜s17) === */}

        {/* s10: 4層構造 */}
        <section id="s10" className={`${styles.section} ${styles.sectionMa}`}>
          <div className={styles.maBanner}>
            <div className={styles.maEyebrow}>MULTI-AGENT EXTENSION</div>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNum}>10</span>
              <h2>{SECTION_TITLES[9]}</h2>
            </div>
          </div>
          <div className={styles.layerStack}>
            <div className={`${styles.layerRow} ${styles.lrAdk}`}>
              <span className={`${styles.layerBadge} ${styles.lbAdk}`}>ADK</span>
              <div>
                <div className={styles.layerTitle}>サブエージェント層</div>
                <div className={styles.layerBody}>
                  <div className={styles.layerDesc}>同一プロセス内のエージェント協調</div>
                  <div className={styles.layerFile}>
                    <code>agent.py</code>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.layerRow} ${styles.lrA2a}`}>
              <span className={`${styles.layerBadge} ${styles.lbA2a}`}>A2A</span>
              <div>
                <div className={styles.layerTitle}>マルチエージェント層</div>
                <div className={styles.layerBody}>
                  <div className={styles.layerDesc}>リモートエージェント間の HTTP プロトコル</div>
                  <div className={styles.layerFile}>
                    <code>agent.json</code> (Agent Card)
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.layerRow} ${styles.lrMcp}`}>
              <span className={`${styles.layerBadge} ${styles.lbMcp}`}>MCP</span>
              <div>
                <div className={styles.layerTitle}>ツール接続層</div>
                <div className={styles.layerBody}>
                  <div className={styles.layerDesc}>外部ツール / リソース統合</div>
                  <div className={styles.layerFile}>
                    <code>mcp.json</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* s11: agent.json */}
        <section id="s11" className={`${styles.section} ${styles.sectionMa}`}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>11</span>
            <h2>{SECTION_TITLES[10]}</h2>
          </div>
          <div className={styles.card}>
            <p>
              <code>agent.json</code> (Agent Card) は A2A プロトコルにおいて
              <strong>リモートエージェントの能力 / エンドポイント / 認証要件を宣言</strong>
              するメタデータです。 オーケストレーターはこれを読み取り、適切なエージェントへ
              タスクをルーティングします。
            </p>
          </div>
          <CodeBlock
            lang="agent.json"
            body={`{
  "name": "purchasing_concierge",
  "description": "在庫確認と発注を行うエージェント",
  "url": "https://agents.example.com/purchasing",
  "capabilities": ["inventory.lookup", "order.create"],
  "auth": { "type": "oauth2" }
}
`}
          />
        </section>

        {/* s12: マルチエージェント GEMINI.md */}
        <section id="s12" className={`${styles.section} ${styles.sectionMa}`}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>12</span>
            <h2>{SECTION_TITLES[11]}</h2>
          </div>
          <div className={styles.card}>
            <p>
              Orchestrator 用の GEMINI.md には
              <strong>各リモートエージェントの責務・呼び分け基準・失敗時の代替策</strong>
              を明記します。「作戦指令書」として、どのエージェントを
              いつ・なぜ呼ぶかを言語化するのが要点です。
            </p>
          </div>
        </section>

        {/* s13: agent.py 実装パターン */}
        <section id="s13" className={`${styles.section} ${styles.sectionMa}`}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>13</span>
            <h2>{SECTION_TITLES[12]}</h2>
          </div>
          <CodeBlock
            lang="Python"
            body={`from google.adk.agents import LlmAgent, RemoteA2aAgent

purchasing = RemoteA2aAgent(
    name="purchasing",
    agent_card_url="https://agents.example.com/purchasing/agent.json",
)

orchestrator = LlmAgent(
    name="orchestrator",
    model="gemini-2.5-pro",
    sub_agents=[purchasing],
    instruction="ユーザー要求に応じて適切なリモートエージェントへ委譲する",
)
`}
          />
        </section>

        {/* s14: AgentEngine */}
        <section id="s14" className={`${styles.section} ${styles.sectionMa}`}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>14</span>
            <h2>{SECTION_TITLES[13]}</h2>
          </div>
          <div className={styles.card}>
            <p>
              AgentEngine (Vertex AI) は ADK
              エージェントを本番運用するためのマネージドランタイムです。 GEMINI.md / agent.py
              は変更なしでデプロイ可能で、A2A エンドポイントが自動付与されます。
            </p>
          </div>
        </section>

        {/* s15: ユースケース別 */}
        <section id="s15" className={`${styles.section} ${styles.sectionMa}`}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>15</span>
            <h2>{SECTION_TITLES[14]}</h2>
          </div>
          <div className={styles.ucGrid}>
            <div className={styles.uc}>
              <div className={styles.ucIcon}>🛒</div>
              <div className={styles.ucTitle}>購買コンシェルジュ</div>
              <div className={styles.ucDesc}>在庫確認 → 発注 → 通知の直列パイプライン</div>
            </div>
            <div className={styles.uc}>
              <div className={styles.ucIcon}>🔍</div>
              <div className={styles.ucTitle}>セキュリティ監査</div>
              <div className={styles.ucDesc}>SAST / SCA / Secret Scan を並列実行</div>
            </div>
            <div className={styles.uc}>
              <div className={styles.ucIcon}>📊</div>
              <div className={styles.ucTitle}>BI レポート生成</div>
              <div className={styles.ucDesc}>SQL 生成 → 可視化 → レビューのループ</div>
            </div>
          </div>
        </section>

        {/* s16: マルチエージェント Anti-Patterns */}
        <section id="s16" className={`${styles.section} ${styles.sectionMa}`}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>16</span>
            <h2>{SECTION_TITLES[15]}</h2>
          </div>
          <div className={`${styles.alert} ${styles.alertDanger}`}>
            <span className={styles.alertIcon}>🚫</span>
            <div className={styles.alertContent}>
              <strong>Agent Card を非公開にしない</strong>
              <code>agent.json</code> は他エージェントが能力を発見する唯一の手段です。 認証は{" "}
              <code>auth</code> フィールドで宣言し、カード自体は公開してください。
            </div>
          </div>
          <div className={`${styles.alert} ${styles.alertWarn}`}>
            <span className={styles.alertIcon}>⚠️</span>
            <div className={styles.alertContent}>
              <strong>同期呼び出しでループを作らない</strong>
              Orchestrator → Remote → Orchestrator の循環は容易にデッドロックします。
              非同期メッセージ + タイムアウトを基本にしてください。
            </div>
          </div>
        </section>

        {/* s17: 全ファイル役割まとめ */}
        <section id="s17" className={`${styles.section} ${styles.sectionMa}`}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>17</span>
            <h2>{SECTION_TITLES[16]}</h2>
          </div>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>ファイル</th>
                  <th>レイヤー</th>
                  <th>役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>GEMINI.md</code>
                  </td>
                  <td>サブ / マルチ共通</td>
                  <td>プロジェクト全体のコンテキスト</td>
                </tr>
                <tr>
                  <td>
                    <code>AGENTS.md</code>
                  </td>
                  <td>サブ / マルチ共通</td>
                  <td>クロスツール共通指示</td>
                </tr>
                <tr>
                  <td>
                    <code>agent.py</code>
                  </td>
                  <td>ADK</td>
                  <td>サブエージェント / Orchestrator 定義</td>
                </tr>
                <tr>
                  <td>
                    <code>agent.json</code>
                  </td>
                  <td>A2A</td>
                  <td>リモートエージェントの能力宣言</td>
                </tr>
                <tr>
                  <td>
                    <code>mcp.json</code>
                  </td>
                  <td>MCP</td>
                  <td>外部ツール / リソース接続</td>
                </tr>
                <tr>
                  <td>
                    <code>.geminiignore</code>
                  </td>
                  <td>CLI</td>
                  <td>走査範囲の制御</td>
                </tr>
                <tr>
                  <td>
                    <code>settings.json</code>
                  </td>
                  <td>CLI / IDE</td>
                  <td>挙動・モデル選択の制御</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* sources */}
        <section id="sources" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>📚</span>
            <h2>参考ソース（25 件 — Gemini CLI / ADK / A2A / AP2 / A2UI 対応）</h2>
          </div>
          <div className={styles.srcGrid}>
            {SOURCES.map((s) => (
              <div key={s.href} className={styles.srcCard}>
                <div className={styles.srcTitle}>
                  <span className={styles.srcIcon}>{s.icon}</span> {s.title}
                </div>
                <div className={styles.srcUrl}>
                  <Ext href={s.href}>{s.href}</Ext>
                </div>
                <div className={styles.srcDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
