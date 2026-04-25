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
              <strong>ツールによって Markdown ファイルの仕組みが異なります</strong>
              。大きく 2 つのレイヤーに分けて理解することが重要です。
            </p>
          </div>

          {/* Context Hierarchy Diagram */}
          <div className={styles.hierWrap}>
            <div className={styles.hierTitle}>
              GEMINI.md コンテキスト階層 — 読み込み優先度（低 → 高）
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <div className={styles.hierCol}>
                <div className={`${styles.hierBox} ${styles.hbGlobal}`}>
                  🌐 Global
                  <br />
                  <small>~/.gemini/GEMINI.md</small>
                </div>
                <div className={styles.hierArrowDown}>↓</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255, 255, 255, 0.35)",
                    textAlign: "center",
                  }}
                >
                  全プロジェクト共通
                  <br />
                  デフォルト設定
                </div>
              </div>
              <div className={styles.hierConnector}>
                <div className={styles.hierConnectorArrow}>→</div>
              </div>
              <div className={styles.hierCol}>
                <div className={`${styles.hierBox} ${styles.hbProject}`}>
                  📁 Project Root
                  <br />
                  <small>./GEMINI.md</small>
                </div>
                <div className={styles.hierArrowDown}>↓</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255, 255, 255, 0.35)",
                    textAlign: "center",
                  }}
                >
                  プロジェクト固有
                  <br />
                  （git root 検出）
                </div>
              </div>
              <div className={styles.hierConnector}>
                <div className={styles.hierConnectorArrow}>→</div>
              </div>
              <div className={styles.hierCol}>
                <div className={`${styles.hierBox} ${styles.hbSub}`}>
                  📂 Sub-directory
                  <br />
                  <small>src/GEMINI.md 等</small>
                </div>
                <div className={styles.hierArrowDown}>↓</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255, 255, 255, 0.35)",
                    textAlign: "center",
                  }}
                >
                  モジュール固有
                  <br />
                  補足コンテキスト
                </div>
              </div>
              <div className={styles.hierConnector}>
                <div className={styles.hierConnectorArrow}>→</div>
              </div>
              <div className={styles.hierCol}>
                <div className={`${styles.hierBox} ${styles.hbAuto}`}>
                  🔍 Auto-scan
                  <br />
                  <small>ツールアクセス時に自動検出</small>
                </div>
                <div className={styles.hierArrowDown}>↓</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255, 255, 255, 0.35)",
                    textAlign: "center",
                  }}
                >
                  ファイルアクセス時
                  <br />
                  動的ロード
                </div>
              </div>
            </div>
            <div className={styles.hierLabel}>
              すべてのファイルが結合されてモデルに送信される（.gitignore / .geminiignore は除外）
            </div>
            <div className={styles.hierPriority}>
              優先度：Auto-scan ＞ Sub-directory ＞ Project Root ＞
              Global（より具体的なファイルが優先）
            </div>
          </div>

          {/* File tree SVG */}
          <div className={styles.filetreeWrap}>
            <div className={styles.filetreeHeader}>
              <span className={styles.ftDot} style={{ background: "#f87171" }} />
              <span className={styles.ftDot} style={{ background: "#fbbf24" }} />
              <span className={styles.ftDot} style={{ background: "#34d399" }} />
              <span
                style={{
                  marginLeft: 10,
                  color: "#6b7280",
                  fontSize: 12,
                  fontFamily: "monospace",
                }}
              >
                project-root/ — Gemini エコシステム ファイル構造
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 960 760"
              width="100%"
              style={{ display: "block" }}
              fontFamily="'Google Sans Mono','Fira Code','SF Mono',monospace"
              role="img"
              aria-label="project-root のディレクトリ構造とファイル分類凡例"
            >
              <title>project-root のディレクトリ構造とファイル分類凡例</title>
              <defs>
                <linearGradient id="gb1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#1a73e8" }} />
                  <stop offset="100%" style={{ stopColor: "#4285f4" }} />
                </linearGradient>
                <linearGradient id="gb2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#1e8e3e" }} />
                  <stop offset="100%" style={{ stopColor: "#34a853" }} />
                </linearGradient>
                <linearGradient id="gb3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#7c3aed" }} />
                  <stop offset="100%" style={{ stopColor: "#8b5cf6" }} />
                </linearGradient>
                <linearGradient id="gb4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#d93025" }} />
                  <stop offset="100%" style={{ stopColor: "#ea4335" }} />
                </linearGradient>
                <linearGradient id="gb5" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#00897b" }} />
                  <stop offset="100%" style={{ stopColor: "#26a69a" }} />
                </linearGradient>
              </defs>
              <rect width="960" height="760" fill="#0a0e1a" />

              {/* LEGEND */}
              <rect
                x="660"
                y="18"
                width="282"
                height="230"
                rx="10"
                fill="#111827"
                stroke="#1e2d52"
                strokeWidth="1"
              />
              <text
                x="801"
                y="40"
                textAnchor="middle"
                fill="#6b7280"
                fontSize="11"
                letterSpacing="1"
              >
                LEGEND
              </text>
              <rect x="676" y="50" width="22" height="22" rx="5" fill="url(#gb1)" />
              <text x="687" y="65" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ①
              </text>
              <text x="706" y="65" fontSize="12" fill="#e2e8f0">
                GEMINI.md / AGENT.md
              </text>
              <rect x="676" y="82" width="22" height="22" rx="5" fill="url(#gb2)" />
              <text x="687" y="97" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ②
              </text>
              <text x="706" y="97" fontSize="12" fill="#e2e8f0">
                ADK agent.py（エージェント定義）
              </text>
              <rect x="676" y="114" width="22" height="22" rx="5" fill="url(#gb3)" />
              <text x="687" y="129" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ③
              </text>
              <text x="706" y="129" fontSize="12" fill="#e2e8f0">
                設定・制御ファイル
              </text>
              <rect x="676" y="146" width="22" height="22" rx="5" fill="url(#gb4)" />
              <text x="687" y="161" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ④
              </text>
              <text x="706" y="161" fontSize="12" fill="#e2e8f0">
                .geminiignore（除外ルール）
              </text>
              <rect x="676" y="178" width="22" height="22" rx="5" fill="url(#gb5)" />
              <text x="687" y="193" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑤
              </text>
              <text x="706" y="193" fontSize="12" fill="#e2e8f0">
                README.md（人間向け）
              </text>
              <rect x="676" y="210" width="58" height="22" rx="5" fill="#374151" />
              <text
                x="705"
                y="225"
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="11"
                fontWeight="700"
              >
                📁 DIR
              </text>
              <text x="742" y="225" fontSize="12" fill="#6b7280">
                ディレクトリ
              </text>

              {/* TREE LINES */}
              <line x1="44" y1="48" x2="44" y2="696" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="44" y1="50" x2="70" y2="50" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="44" y1="95" x2="70" y2="95" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="44" y1="140" x2="70" y2="140" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="44" y1="185" x2="70" y2="185" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="44" y1="230" x2="70" y2="230" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="86" y1="230" x2="86" y2="260" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="86" y1="258" x2="112" y2="258" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="44" y1="300" x2="70" y2="300" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="86" y1="300" x2="86" y2="390" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="86" y1="328" x2="112" y2="328" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="86" y1="368" x2="112" y2="368" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="128" y1="368" x2="128" y2="398" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="128" y1="396" x2="154" y2="396" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="44" y1="440" x2="70" y2="440" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="86" y1="440" x2="86" y2="560" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="86" y1="470" x2="112" y2="470" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="86" y1="510" x2="112" y2="510" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="86" y1="550" x2="112" y2="550" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="44" y1="600" x2="70" y2="600" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="86" y1="600" x2="86" y2="638" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="86" y1="636" x2="112" y2="636" stroke="#1e2d52" strokeWidth="1.5" />
              <line x1="44" y1="696" x2="70" y2="696" stroke="#1e2d52" strokeWidth="1.5" />

              {/* ROOT */}
              <text x="20" y="30" fontSize="16" fill="#4285f4">
                📁
              </text>
              <text x="42" y="30" fontSize="14" fontWeight="700" fill="#60a5fa">
                project-root/
              </text>

              {/* ROW 1: GEMINI.md root */}
              <text x="78" y="56" fontSize="14" fill="#93c5fd">
                📄
              </text>
              <text x="98" y="56" fontSize="13.5" fontWeight="700" fill="#93c5fd">
                GEMINI.md
              </text>
              <rect x="194" y="41" width="22" height="22" rx="5" fill="url(#gb1)" />
              <text x="205" y="56" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ①
              </text>
              <text x="224" y="56" fontSize="12" fill="#6b7280">
                プロジェクト固有コンテキスト（常時ロード）
              </text>
              <text x="224" y="74" fontSize="11.5" fill="#4b5563">
                ※ AGENT.md でも可（Code Assist / Android Studio）
              </text>

              {/* ROW 2: AGENTS.md */}
              <text x="78" y="101" fontSize="14" fill="#86efac">
                📄
              </text>
              <text x="98" y="101" fontSize="13.5" fontWeight="700" fill="#86efac">
                AGENTS.md
              </text>
              <rect x="194" y="86" width="22" height="22" rx="5" fill="url(#gb1)" opacity="0.75" />
              <text x="205" y="101" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ①
              </text>
              <text x="224" y="101" fontSize="12" fill="#6b7280">
                クロスツール互換（Claude / Codex / Cursor と共有可）
              </text>

              {/* ROW 3: .geminiignore */}
              <text x="78" y="146" fontSize="14" fill="#fca5a5">
                🚫
              </text>
              <text x="98" y="146" fontSize="13.5" fontWeight="700" fill="#fca5a5">
                .geminiignore
              </text>
              <rect x="218" y="131" width="22" height="22" rx="5" fill="url(#gb4)" />
              <text x="229" y="146" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ④
              </text>
              <text x="248" y="146" fontSize="12" fill="#6b7280">
                コンテキストから除外するファイル・フォルダ
              </text>

              {/* ROW 4: settings.json */}
              <text x="78" y="191" fontSize="14" fill="#d1d5db">
                ⚙️
              </text>
              <text x="98" y="191" fontSize="13.5" fontWeight="700" fill="#d1d5db">
                settings.json
              </text>
              <rect x="216" y="176" width="22" height="22" rx="5" fill="url(#gb3)" />
              <text x="227" y="191" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ③
              </text>
              <text x="246" y="191" fontSize="12" fill="#6b7280">
                MCP設定・context.fileName・除外ツール設定
              </text>

              {/* ROW 5: .gemini/ dir */}
              <text x="78" y="236" fontSize="14" fill="#60a5fa">
                📁
              </text>
              <text x="98" y="236" fontSize="14" fontWeight="700" fill="#60a5fa">
                .gemini/
              </text>
              <text x="184" y="236" fontSize="12" fill="#4b5563">
                ← IDE統合時の設定ディレクトリ
              </text>
              <text x="120" y="264" fontSize="14" fill="#d1d5db">
                ⚙️
              </text>
              <text x="140" y="264" fontSize="13" fill="#d1d5db">
                settings.json
              </text>
              <rect x="238" y="249" width="22" height="22" rx="5" fill="url(#gb3)" opacity="0.75" />
              <text x="249" y="264" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ③
              </text>
              <text x="268" y="264" fontSize="12" fill="#4b5563">
                VS Code / IntelliJ 統合設定
              </text>

              {/* ROW 6: src/ dir */}
              <text x="78" y="306" fontSize="14" fill="#60a5fa">
                📁
              </text>
              <text x="98" y="306" fontSize="14" fontWeight="700" fill="#60a5fa">
                src/
              </text>
              <text x="120" y="334" fontSize="14" fill="#93c5fd">
                📄
              </text>
              <text x="140" y="334" fontSize="13" fontWeight="700" fill="#93c5fd">
                GEMINI.md
              </text>
              <rect x="228" y="319" width="22" height="22" rx="5" fill="url(#gb1)" opacity="0.7" />
              <text x="239" y="334" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ①
              </text>
              <text x="258" y="334" fontSize="12" fill="#6b7280">
                src/ 固有のコーディング規約・依存関係
              </text>
              <text x="120" y="374" fontSize="13" fill="#60a5fa">
                📂
              </text>
              <text x="140" y="374" fontSize="13" fontWeight="700" fill="#60a5fa">
                frontend/
              </text>
              <text x="162" y="402" fontSize="13" fill="#93c5fd">
                📄
              </text>
              <text x="182" y="402" fontSize="13" fill="#93c5fd">
                GEMINI.md
              </text>
              <rect x="268" y="387" width="22" height="22" rx="5" fill="url(#gb1)" opacity="0.6" />
              <text x="279" y="402" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ①
              </text>
              <text x="298" y="402" fontSize="12" fill="#6b7280">
                React/Next.js固有ルール（自動スキャン）
              </text>

              {/* ROW 7: agents/ dir (ADK) */}
              <text x="78" y="446" fontSize="14" fill="#4ade80">
                📁
              </text>
              <text x="98" y="446" fontSize="14" fontWeight="700" fill="#4ade80">
                agents/
              </text>
              <text x="184" y="446" fontSize="12" fill="#4b5563">
                ← ADK サブエージェント定義
              </text>
              <text x="120" y="476" fontSize="14" fill="#86efac">
                🐍
              </text>
              <text x="140" y="476" fontSize="13" fill="#86efac">
                orchestrator/agent.py
              </text>
              <rect x="326" y="461" width="22" height="22" rx="5" fill="url(#gb2)" />
              <text x="337" y="476" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ②
              </text>
              <text x="356" y="476" fontSize="12" fill="#6b7280">
                ルートエージェント定義 (instruction フィールド)
              </text>
              <text x="120" y="516" fontSize="14" fill="#86efac">
                🐍
              </text>
              <text x="140" y="516" fontSize="13" fill="#86efac">
                researcher/agent.py
              </text>
              <rect x="310" y="501" width="22" height="22" rx="5" fill="url(#gb2)" opacity="0.75" />
              <text x="321" y="516" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ②
              </text>
              <text x="340" y="516" fontSize="12" fill="#6b7280">
                サブエージェント (LlmAgent)
              </text>
              <text x="120" y="556" fontSize="14" fill="#86efac">
                🐍
              </text>
              <text x="140" y="556" fontSize="13" fill="#86efac">
                reviewer/agent.py
              </text>
              <rect x="306" y="541" width="22" height="22" rx="5" fill="url(#gb2)" opacity="0.75" />
              <text x="317" y="556" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ②
              </text>
              <text x="336" y="556" fontSize="12" fill="#6b7280">
                サブエージェント (LlmAgent)
              </text>

              {/* evaluations */}
              <text x="78" y="606" fontSize="14" fill="#60a5fa">
                📁
              </text>
              <text x="98" y="606" fontSize="14" fontWeight="700" fill="#60a5fa">
                evals/
              </text>
              <text x="120" y="642" fontSize="13" fill="#d1d5db">
                📝
              </text>
              <text x="140" y="642" fontSize="13" fill="#d1d5db">
                eval_set.json
              </text>
              <rect x="270" y="627" width="22" height="22" rx="5" fill="url(#gb3)" opacity="0.75" />
              <text x="281" y="642" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ③
              </text>
              <text x="300" y="642" fontSize="12" fill="#6b7280">
                ADK 評価データセット（adk eval で使用）
              </text>

              {/* README.md */}
              <text x="78" y="702" fontSize="14" fill="#60a5fa">
                📘
              </text>
              <text x="98" y="702" fontSize="14" fontWeight="700" fill="#93c5fd">
                README.md
              </text>
              <rect x="204" y="687" width="22" height="22" rx="5" fill="url(#gb5)" />
              <text x="215" y="702" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑤
              </text>
              <text x="234" y="702" fontSize="12" fill="#6b7280">
                人間向け：エージェント構成・セットアップ手順
              </text>
            </svg>
          </div>
        </section>

        {/* s02: GEMINI.md / AGENT.md */}
        <section id="s02" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>2</span>
            <h2>
              <span className={styles.mono}>GEMINI.md</span> /{" "}
              <span className={styles.mono}>AGENT.md</span> — コンテキストファイルの設計
            </h2>
          </div>

          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span className={styles.alertIcon}>ℹ️</span>
            <div className={styles.alertContent}>
              <strong>GEMINI.md vs AGENT.md — ツール別対応表</strong>
              Gemini CLI は <code>GEMINI.md</code> がデフォルト。Gemini Code Assist (VS Code /
              Cloud) は <code>GEMINI.md</code> か <code>AGENT.md</code> を使用。Android Studio は{" "}
              <code>AGENTS.md</code> を採用。すべて <code>settings.json</code> の{" "}
              <code>context.fileName</code> でカスタマイズ可能です。
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>📋 GEMINI.md に書くべきこと / 書かないべきこと</div>
            <div className={styles.patGrid}>
              <div className={`${styles.pat} ${styles.patOk}`}>
                <div className={styles.patLabel}>✅ 書くべき内容</div>
                <ul>
                  <li>プロジェクト概要・目的（2〜4文）</li>
                  <li>技術スタック・主要ライブラリのバージョン</li>
                  <li>サブエージェント委譲ルール</li>
                  <li>ビルド・テスト・デプロイコマンド</li>
                  <li>禁止操作の明示（DB reset 等）</li>
                  <li>
                    <code>@./subdir/guide.md</code> でのモジュール分割参照
                  </li>
                  <li>コーディング規約（コンパクトに）</li>
                  <li>重要ドキュメントへのパス参照</li>
                </ul>
              </div>
              <div className={`${styles.pat} ${styles.patNg}`}>
                <div className={styles.patLabel}>✗ 書かないべき内容</div>
                <ul>
                  <li>長大なコードスニペット（トークン浪費）</li>
                  <li>過去の変更履歴・修正ログ</li>
                  <li>ツール固有の設定（settings.json に分離）</li>
                  <li>機密情報・API キー（.geminiignore で除外）</li>
                  <li>すべての規約を1ファイルに詰め込む（@import で分割）</li>
                  <li>否定形のみの指示（代替案をセットで示す）</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              📄 実践的な GEMINI.md テンプレート（サブエージェント対応版）
            </div>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>GEMINI.md (project root)</span>
                <span className={styles.lang}>Markdown</span>
              </div>
              <div className={styles.codeBody}>
                <span className={styles.ch}># PROJECT: my-saas-app</span>
                {"\n\n"}
                <span className={styles.cm}>## Overview</span>
                {"\n"}
                {
                  "Next.js 15 + Supabase + Stripe のマルチテナント SaaS。\n本番: Vercel Edge Runtime / DB: Supabase (PostgreSQL + pgvector)。\n\n"
                }
                <span className={styles.cm}>## Tech Stack</span>
                {"\n"}
                {"- Frontend: Next.js 15 App Router, TypeScript 5.x, Tailwind CSS\n"}
                {"- Backend: Supabase Edge Functions (Deno 2.x)\n"}
                {"- Auth: Supabase Auth + Row Level Security\n"}
                {"- Payment: Stripe Checkout / Billing Portal / Webhooks\n"}
                {"- AI: Gemini 2.5 Flash (via ADK), pgvector for embeddings\n\n"}
                <span className={styles.cm}>## Build &amp; Test</span>
                {"\n"}
                {"- Build: "}
                <span className={styles.cs}>`pnpm build`</span>
                {"\n"}
                {"- Test:  "}
                <span className={styles.cs}>`pnpm test`</span>
                {" (Vitest + Testing Library)\n"}
                {"- ADK dev: "}
                <span className={styles.cs}>`adk web`</span>
                {" (Agent Dev UI on :8000)\n"}
                {"- Lint:  "}
                <span className={styles.cs}>`pnpm lint`</span>
                {" — "}
                <span className={styles.cw}>ESLint/Prettier に全面委任すること</span>
                {"\n"}
                {"- DB types: "}
                <span className={styles.cs}>`pnpm supabase gen types`</span>
                {"\n\n"}
                <span className={styles.cm}>## Sub-Agent Routing</span>
                {"\n"}
                <span className={styles.cw}>Parallel dispatch 条件（すべて満たす場合のみ）:</span>
                {"\n"}
                {"- タスクが 3件以上かつ互いに独立\n"}
                {"- 共有ファイル・共有状態なし\n"}
                {"- ドメイン境界が明確 (frontend / backend / db / ai)\n"}
                {"- ParallelAgent で書く場合: 各エージェントが"}
                <span className={styles.cw}>異なるキーに書き込むこと</span>
                {"\n\n"}
                <span className={styles.cw}>Sequential dispatch（いずれかの条件で）:</span>
                {"\n"}
                {"- タスクに依存関係がある（B に A の出力が必要）\n"}
                {"- 共有ファイルに触る処理がある\n\n"}
                <span className={styles.cm}>## Domain Agents (ADK)</span>
                {"\n"}
                {"- "}
                <span className={styles.ce}>orchestrator</span>
                {" → ルーティングのみ、実装しない\n"}
                {"- "}
                <span className={styles.ce}>frontend-agent</span>
                {" → app/, components/, styles/ のみ\n"}
                {"- "}
                <span className={styles.ce}>backend-agent</span>
                {" → supabase/functions/, lib/server/ のみ\n"}
                {"- "}
                <span className={styles.ce}>ai-agent</span>
                {" → lib/ai/, embeddings/, vector queries のみ\n"}
                {"- "}
                <span className={styles.ce}>db-agent</span>
                {" → supabase/migrations/, schema のみ\n\n"}
                <span className={styles.cm}>## Forbidden Operations</span>
                {"\n"}
                {"- "}
                <span className={styles.cw}>`supabase db reset`</span>
                {" は絶対に実行しない（本番データ消去）\n"}
                {"- "}
                <span className={styles.cw}>`.env.production`</span>
                {" の読み書き禁止\n"}
                {"- "}
                <span className={styles.cw}>`--force`</span>
                {" フラグは使わない、代わりに "}
                <span className={styles.cs}>`--dry-run`</span>
                {" で確認\n\n"}
                <span className={styles.cm}>## @-imports (modular context)</span>
                {"\n"}
                {"@./docs/architecture.md\n"}
                {"@./src/frontend/GEMINI.md\n"}
                {"@./src/backend/GEMINI.md"}
              </div>
            </div>
          </div>

          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span className={styles.alertIcon}>💡</span>
            <div className={styles.alertContent}>
              <strong>@-import 構文でファイルを分割する</strong>
              <code>@./path/to/file.md</code> 構文で他のMarkdownファイルをインポートできます（
              <code>.md</code>{" "}
              ファイルのみ対応）。大きなプロジェクトでは「ルートは薄く、ドメイン別に分割」が鉄則です。CLIが正規表現でインライン展開するため、追加トークンコストなしで利用できます。
            </div>
          </div>
        </section>

        {/* s03: AGENTS.md */}
        <section id="s03" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>3</span>
            <h2>
              <span className={styles.mono}>AGENTS.md</span> — クロスツール互換戦略
            </h2>
          </div>

          <div className={styles.card}>
            <p>
              チームで <strong>Claude Code・Gemini CLI・Cursor・Codex</strong> を混在して使う場合、
              <code>AGENTS.md</code>{" "}
              を共通エントリポイントとして採用する戦略が推奨されています。各ツール固有の設定は別ファイルに分離し、
              <code>AGENTS.md</code> から参照します。
            </p>
          </div>

          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>デフォルトファイル</th>
                  <th>代替ファイル</th>
                  <th>カスタマイズ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gemini CLI</td>
                  <td>
                    <code>GEMINI.md</code>
                  </td>
                  <td>
                    <code>AGENTS.md</code>
                  </td>
                  <td>
                    <code>settings.json context.fileName</code>
                  </td>
                </tr>
                <tr>
                  <td>Gemini Code Assist</td>
                  <td>
                    <code>GEMINI.md</code>
                  </td>
                  <td>
                    <code>AGENT.md</code>
                  </td>
                  <td>IDE設定</td>
                </tr>
                <tr>
                  <td>Android Studio (Gemini)</td>
                  <td>
                    <code>AGENTS.md</code>
                  </td>
                  <td>-</td>
                  <td>複数ファイル自動スキャン</td>
                </tr>
                <tr>
                  <td>Claude Code</td>
                  <td>
                    <code>CLAUDE.md</code>
                  </td>
                  <td>
                    <code>AGENTS.md</code> (読む)
                  </td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Codex</td>
                  <td>
                    <code>AGENTS.md</code>
                  </td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Cursor</td>
                  <td>
                    <code>.cursorrules</code>
                  </td>
                  <td>
                    <code>AGENTS.md</code>
                  </td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>AGENTS.md (共通エントリポイント)</span>
              <span className={styles.lang}>Markdown</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.ch}># Agent Rules (Cross-tool shared)</span>
              {"\n"}
              <span className={styles.cc}>
                # このファイルは GEMINI.md / CLAUDE.md / Cursor などすべてのツールで共通利用
              </span>
              {"\n\n"}
              <span className={styles.cm}>## Universal Rules</span>
              {"\n"}
              {"- コードは TypeScript strict モード\n"}
              {"- テストなしのコードを本番にマージしない\n"}
              {"- DB マイグレーションは必ず dry-run で確認後に実行\n"}
              {"- セキュリティ: SQL直結は禁止、Prepared Statement 必須\n\n"}
              <span className={styles.cm}>## Tool-Specific Context</span>
              {"\n"}
              <span className={styles.cc}># Gemini 固有の追加設定は GEMINI.md を参照</span>
              {"\n"}
              {"@./GEMINI.md "}
              <span className={styles.cc}># Gemini CLI/Code Assist のみ有効</span>
              {"\n\n"}
              <span className={styles.cm}>## Agent Domains</span>
              {"\n"}
              {"- frontend: app/, components/, styles/, public/\n"}
              {"- backend: supabase/, lib/server/, api/\n"}
              {"- database: supabase/migrations/, schema files"}
            </div>
          </div>
        </section>

        {/* s04: ADK agent.py */}
        <section id="s04" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>4</span>
            <h2>
              ADK <span className={styles.mono}>agent.py</span> —
              サブエージェント定義のベストプラクティス
            </h2>
          </div>

          <div className={styles.card}>
            <p>
              Google ADK (Agent Development Kit) では、サブエージェントの「system prompt」は{" "}
              <strong>
                <code>instruction</code> フィールド
              </strong>{" "}
              に記述します。このフィールドが Claude の <code>.claude/agents/*.md</code>{" "}
              に相当します。<code>description</code> フィールドが AutoFlow
              ルーティングの判断基準になるため、特に重要です。
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>2026年3月現在のADK最新状況：</strong> <strong>ADK TypeScript 1.0</strong> が
              GA になり、TS/JS プロジェクトでも <code>@google/adk</code>{" "}
              パッケージで同等の機能が利用可能です。また <strong>ADK Python 2.0 Alpha</strong>
              （グラフベースのワークフロー定義）が公開中で、より複雑なエージェント DAG
              の記述が可能になりました。
            </p>
          </div>

          <div className={`${styles.alert} ${styles.alertWarn}`}>
            <span className={styles.alertIcon}>⚠️</span>
            <div className={styles.alertContent}>
              <strong>description フィールドが「APIドキュメント」</strong>
              LLM ルーティング（AutoFlow）では、<code>description</code>{" "}
              の内容だけを見て「どのサブエージェントに委譲するか」を判断します。曖昧な description
              は誤ルーティングの原因になります。「いつ・何のために呼ぶか」を具体的に記述してください。
            </div>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>agents/orchestrator/agent.py</span>
              <span className={styles.lang}>Python / ADK</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cc}>
                # agents/orchestrator/agent.py — ルートエージェント（コーディネーター）
              </span>
              {"\n"}
              <span className={styles.ck}>from</span>
              {" google.adk.agents "}
              <span className={styles.ck}>import</span>
              {" LlmAgent\n\n"}
              <span className={styles.cc}># サブエージェントをインポート（先に定義が必要）</span>
              {"\n"}
              <span className={styles.ck}>from</span>
              {" agents.researcher.agent "}
              <span className={styles.ck}>import</span>
              {" researcher_agent\n"}
              <span className={styles.ck}>from</span>
              {" agents.implementer.agent "}
              <span className={styles.ck}>import</span>
              {" implementer_agent\n"}
              <span className={styles.ck}>from</span>
              {" agents.reviewer.agent "}
              <span className={styles.ck}>import</span>
              {" reviewer_agent\n\n"}
              {"root_agent = LlmAgent(\n"}
              {"    "}
              <span className={styles.cm}>name</span>
              {"="}
              <span className={styles.cs}>"orchestrator"</span>
              {",\n"}
              {"    "}
              <span className={styles.cm}>model</span>
              {"="}
              <span className={styles.cs}>"gemini-3-flash-preview"</span>
              {",  "}
              <span className={styles.cc}># v0.29.0〜 CLI デフォルト</span>
              {"\n"}
              {"    "}
              <span className={styles.cm}>description</span>
              {"="}
              <span className={styles.cs}>
                "ユーザーの要求を分析し、適切なサブエージェントに委譲するコーディネーター。"
              </span>
              {",\n"}
              {"    "}
              <span className={styles.cm}>instruction</span>
              {"="}
              <span className={styles.cs}>
                {
                  '"""\nあなたは開発チームのオーケストレーターです。\nユーザーの要求を分析し、以下のルールで適切なエージェントに委譲してください。\n\n## 委譲ルール\n- 調査・情報収集 → researcher_agent\n- コード実装 → implementer_agent\n- コードレビュー → reviewer_agent\n- 複合タスク → SequentialAgent で順番に処理\n\n## 禁止事項\n- 自身でコードを書かない（必ずサブエージェントに委譲）\n- 曖昧なタスクはそのまま渡さず、明確化してから委譲\n"""'
                }
              </span>
              {",\n"}
              {"    "}
              <span className={styles.cm}>sub_agents</span>
              {"=[\n"}
              {"        researcher_agent,    "}
              <span className={styles.cc}># 調査・情報収集</span>
              {"\n"}
              {"        implementer_agent,   "}
              <span className={styles.cc}># コード実装</span>
              {"\n"}
              {"        reviewer_agent,      "}
              <span className={styles.cc}># コードレビュー (Read-only)</span>
              {"\n"}
              {"    ],\n"}
              {")"}
            </div>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>agents/reviewer/agent.py</span>
              <span className={styles.lang}>Python / ADK</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cc}>
                # agents/reviewer/agent.py — 特化型サブエージェント（コードレビュー専用）
              </span>
              {"\n"}
              <span className={styles.ck}>from</span>
              {" google.adk.agents "}
              <span className={styles.ck}>import</span>
              {" LlmAgent\n"}
              <span className={styles.ck}>from</span>
              {" google.adk.tools "}
              <span className={styles.ck}>import</span>
              {" google_search\n\n"}
              {"reviewer_agent = LlmAgent(\n"}
              {"    "}
              <span className={styles.cm}>name</span>
              {"="}
              <span className={styles.cs}>"reviewer"</span>
              {",\n"}
              {"    "}
              <span className={styles.cm}>model</span>
              {"="}
              <span className={styles.cs}>"gemini-3-flash-preview"</span>
              {",  "}
              <span className={styles.cc}># コスト最適化</span>
              {"\n"}
              {"    "}
              <span className={styles.cm}>description</span>
              {"="}
              <span className={styles.cs}>
                {
                  '"""\nコードレビューを実施するエージェント。\n以下の場合に呼び出す:\n- Pull Request 作成後\n- コード変更が完了した後\n- セキュリティ・パフォーマンス確認が必要な場合\nRead-only: コードの変更は行わず、レポートのみ出力する。\n"""'
                }
              </span>
              {",\n"}
              {"    "}
              <span className={styles.cm}>instruction</span>
              {"="}
              <span className={styles.cs}>
                {
                  '"""\nあなたはシニアエンジニアのコードレビュアーです。\n提供されたコードを以下の観点でレビューしてください。\n\n## Review Checklist\n### 🔴 Security\n- SQLインジェクション / XSS リスク\n- 認証・認可の適切な実装\n- 秘密情報のハードコードがないか\n\n### 🟡 Performance\n- N+1 クエリの有無\n- 不要な再レンダリング (React)\n- 重い処理の非同期化\n\n### 🟢 Code Quality\n- TypeScript 型安全性\n- エラーハンドリングの網羅\n- テストカバレッジ\n\n## 出力フォーマット\n```\n## Code Review Report\n### 🔴 Critical (要対応)\n### 🟡 Warning (推奨対応)\n### 🟢 Good (良い点)\n```\n"""'
                }
              </span>
              {",\n"}
              {"    "}
              <span className={styles.cm}>tools</span>
              {"=[],  "}
              <span className={styles.cc}># ツールなし: Read-only のレビューのみ</span>
              {"\n"}
              {"    "}
              <span className={styles.cm}>output_key</span>
              {"="}
              <span className={styles.cs}>"review_result"</span>
              {",  "}
              <span className={styles.cc}># 共有状態への書き込みキー</span>
              {"\n"}
              {")"}
            </div>
          </div>

          {/* ADK agent types */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>🔀 ADK ワークフローエージェントの選択基準</div>
            <div className={styles.agentGrid}>
              <div className={styles.agentCard}>
                <div className={styles.agentCardIcon}>⛓️</div>
                <div className={styles.agentCardTitle}>SequentialAgent</div>
                <div className={styles.agentCardDesc}>
                  サブエージェントを順番に実行。前のエージェントの出力を次が受け取る。依存関係がある場合に使用。
                </div>
                <div className={styles.agentCardEx}>例: spec → design → implement → review</div>
              </div>
              <div className={styles.agentCard}>
                <div className={styles.agentCardIcon}>⚡</div>
                <div className={styles.agentCardTitle}>ParallelAgent</div>
                <div className={styles.agentCardDesc}>
                  すべてのサブエージェントを並列実行。共有状態に書くため
                  <strong>必ず異なるキーを使う</strong>こと（レースコンディション防止）。
                </div>
                <div className={styles.agentCardEx}>
                  例: frontend || backend || db（独立タスク）
                </div>
              </div>
              <div className={styles.agentCard}>
                <div className={styles.agentCardIcon}>🔁</div>
                <div className={styles.agentCardTitle}>LoopAgent</div>
                <div className={styles.agentCardDesc}>
                  条件を満たすまでサブエージェントを繰り返し実行。反復精緻化・ポーリング・リトライに最適。
                </div>
                <div className={styles.agentCardEx}>
                  例: draft → critique → refine（品質基準達成まで）
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.alert} ${styles.alertDanger}`}>
            <span className={styles.alertIcon}>🚨</span>
            <div className={styles.alertContent}>
              <strong>ParallelAgent の罠：共有状態のレースコンディション</strong>
              ParallelAgent の子エージェントは
              <strong>同じ session state を共有します</strong>
              。複数のエージェントが同じキーに書き込むと値が上書きされます。各エージェントには必ず{" "}
              <code>output_key="unique_key_name"</code> のように一意なキーを設定してください。
            </div>
          </div>
        </section>

        {/* s05: .geminiignore / settings.json */}
        <section id="s05" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>5</span>
            <h2>
              <span className={styles.mono}>.geminiignore</span> と{" "}
              <span className={styles.mono}>settings.json</span> — 制御ファイル設計
            </h2>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>.geminiignore</span>
              <span className={styles.lang}>Ignore rules</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cc}># .geminiignore — .gitignore と同じ書式</span>
              {"\n"}
              <span className={styles.cc}># コンテキストから除外すべきファイル・フォルダ</span>
              {"\n\n"}
              <span className={styles.cw}># 機密情報</span>
              {"\n"}
              {".env .env.*\n"}
              <span className={styles.ck}>!.env.example</span>
              {"  "}
              <span className={styles.cc}># example は例外で含める</span>
              {"\n"}
              {"secrets/ *.key *.pem\n\n"}
              <span className={styles.cw}># ビルド成果物（大量のトークン浪費を防ぐ）</span>
              {"\n"}
              {".next/ dist/ build/ node_modules/ .pnpm-store/\n\n"}
              <span className={styles.cw}># 自動生成ファイル（LLMが読む必要がない）</span>
              {"\n"}
              {"*.min.js *.min.css *.map supabase/.branches/ supabase/.temp/\n\n"}
              <span className={styles.cw}># バイナリ・メディア</span>
              {"\n"}
              {"*.png *.jpg *.webp *.woff2 *.pdf\n\n"}
              <span className={styles.cw}># ログ・一時ファイル</span>
              {"\n"}
              {"*.log .DS_Store coverage/"}
            </div>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>settings.json (Gemini CLI / .gemini/)</span>
              <span className={styles.lang}>JSON</span>
            </div>
            <div className={styles.codeBody}>
              {"{\n"}
              {"  "}
              <span className={styles.cm}>"contextFileName"</span>
              {": ["}
              <span className={styles.cs}>"GEMINI.md"</span>
              {", "}
              <span className={styles.cs}>"AGENTS.md"</span>
              {"],  "}
              <span className={styles.cc}>{"// 複数ファイル対応"}</span>
              {"\n"}
              {"  "}
              <span className={styles.cm}>"planMode"</span>
              {": "}
              <span className={styles.ck}>true</span>
              {",\n"}
              {"  "}
              <span className={styles.cc}>
                {"// Plan Mode デフォルト有効（v0.29.0〜）：read-only で安全に計画立案"}
              </span>
              {"\n"}
              {"  "}
              <span className={styles.cm}>"mcpServers"</span>
              {": {\n"}
              {"    "}
              <span className={styles.cm}>"filesystem"</span>
              {": {\n"}
              {"      "}
              <span className={styles.cm}>"command"</span>
              {": "}
              <span className={styles.cs}>"npx"</span>
              {",\n"}
              {"      "}
              <span className={styles.cm}>"args"</span>
              {": ["}
              <span className={styles.cs}>"-y"</span>
              {", "}
              <span className={styles.cs}>"@modelcontextprotocol/server-filesystem"</span>
              {", "}
              <span className={styles.cs}>"./src"</span>
              {"]\n"}
              {"    },\n"}
              {"    "}
              <span className={styles.cm}>"github"</span>
              {": {\n"}
              {"      "}
              <span className={styles.cm}>"command"</span>
              {": "}
              <span className={styles.cs}>"npx"</span>
              {",\n"}
              {"      "}
              <span className={styles.cm}>"args"</span>
              {": ["}
              <span className={styles.cs}>"-y"</span>
              {", "}
              <span className={styles.cs}>"@modelcontextprotocol/server-github"</span>
              {"],\n"}
              {"      "}
              <span className={styles.cm}>"env"</span>
              {": {\n"}
              {"        "}
              <span className={styles.cm}>"GITHUB_TOKEN"</span>
              {": "}
              <span className={styles.cs}>
                "${"{"}GITHUB_TOKEN{"}"}"
              </span>
              {"\n"}
              {"      }\n"}
              {"    }\n"}
              {"  },\n"}
              {"  "}
              <span className={styles.cm}>"excludeTools"</span>
              {": ["}
              <span className={styles.cs}>"run_shell_command"</span>
              {"],\n"}
              {"  "}
              <span className={styles.cc}>{"// セキュリティ: シェル実行を無効化"}</span>
              {"\n"}
              {"  "}
              <span className={styles.cm}>"checkpointing"</span>
              {": "}
              <span className={styles.ck}>true</span>
              {"\n"}
              {"  "}
              <span className={styles.cc}>{"// 変更前に自動チェックポイント保存"}</span>
              {"\n}"}
            </div>
          </div>

          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span className={styles.alertIcon}>✅</span>
            <div className={styles.alertContent}>
              <strong>
                /memory・/plan・/rewind — コンテキスト＆セッション管理コマンド（2026年3月現在）
              </strong>
              Gemini CLI の <code>/memory show</code>{" "}
              で現在ロードされている全コンテキストを確認できます。
              <code>/memory refresh</code> で再スキャン、
              <code>/memory add &lt;text&gt;</code> でグローバル GEMINI.md に即時追記が可能です。
              <br />
              <code>/plan</code>（v0.29.0〜）を使うと <strong>Plan Mode</strong>（read-only
              環境）に入り、実装前に安全にコードベース分析・変更計画の立案ができます（v0.33.0〜はリサーチサブエージェントも内蔵）。
              <br />
              <code>/rewind</code>
              （v0.27.0〜）でセッション履歴を遡ることができ、誤った操作のロールバックに使えます。
            </div>
          </div>
        </section>

        {/* s06: ルーティング設計 */}
        <section id="s06" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>6</span>
            <h2>サブエージェント ルーティング設計の意思決定ツリー</h2>
          </div>

          <div className={styles.flowWrap}>
            <div className={styles.flowTitle}>
              ADK / Gemini サブエージェント ルーティング決定フロー
            </div>

            <div className={styles.flowRow}>
              <div className={styles.fnQ}>タスクが 3件以上ある？</div>
              <div className={styles.fnArr}>→ NO →</div>
              <div className={styles.fnN}>単一エージェントで処理</div>
            </div>

            <div className={styles.fnIndent}>
              <div className={styles.flowRow} style={{ marginTop: 12 }}>
                <div className={styles.fnLabel}>↓ YES</div>
              </div>
              <div className={styles.flowRow}>
                <div className={styles.fnQ}>
                  タスク間に依存関係がある？
                  <br />
                  <small style={{ fontWeight: 400, fontSize: 11 }}>
                    (B の処理に A の出力が必要)
                  </small>
                </div>
                <div className={styles.fnArr}>→ YES →</div>
                <div className={styles.fnN}>
                  SequentialAgent
                  <br />
                  <small>A → B → C</small>
                </div>
              </div>

              <div className={styles.fnIndent}>
                <div className={styles.flowRow} style={{ marginTop: 12 }}>
                  <div className={styles.fnLabel}>↓ NO</div>
                </div>
                <div className={styles.flowRow}>
                  <div className={styles.fnQ}>
                    繰り返し精緻化が必要？
                    <br />
                    <small style={{ fontWeight: 400, fontSize: 11 }}>
                      (品質基準達成まで繰り返す)
                    </small>
                  </div>
                  <div className={styles.fnArr}>→ YES →</div>
                  <div className={styles.fnN}>
                    LoopAgent
                    <br />
                    <small>draft → critique → refine</small>
                  </div>
                </div>

                <div className={styles.fnIndent}>
                  <div className={styles.flowRow} style={{ marginTop: 12 }}>
                    <div className={styles.fnLabel}>↓ NO</div>
                  </div>
                  <div className={styles.flowRow}>
                    <div className={styles.fnQ}>
                      各エージェントが異なる
                      <br />
                      output_key に書き込む？
                    </div>
                    <div className={styles.fnArr}>→ NO →</div>
                    <div className={styles.fnN}>
                      output_key を設計し直す
                      <br />
                      <small>レースコンディション防止</small>
                    </div>
                  </div>

                  <div className={styles.fnIndent}>
                    <div className={styles.flowRow} style={{ marginTop: 12 }}>
                      <div className={styles.fnLabel}>↓ YES</div>
                    </div>
                    <div className={styles.flowRow}>
                      <div className={styles.fnY}>
                        ✅ ParallelAgent
                        <br />
                        <small>A ‖ B ‖ C（並列実行）</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* s07: モデル選択 */}
        <section id="s07" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>7</span>
            <h2>コスト最適なモデル選択戦略</h2>
          </div>

          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>用途</th>
                  <th>ADK agent.py サブエージェント例</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ opacity: 0.6 }}>
                  <td>
                    <code>gemini-2.0-flash</code>
                    <br />
                    <small style={{ color: "#e53935" }}>⚠️ 2026-06-01廃止</small>
                  </td>
                  <td>高速・低コスト</td>
                  <td>コードベース探索、ファイル検索、単純変換</td>
                  <td>
                    <span className={`${styles.chip} ${styles.chipGreen}`}>最速</span>
                    廃止前は探索用途のみ。<code>gemini-2.5-flash</code>へ移行推奨
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>gemini-2.5-flash</code>
                  </td>
                  <td>バランス重視</td>
                  <td>コードレビュー、テスト生成、実装、コーディネーター</td>
                  <td>
                    <span className={`${styles.chip} ${styles.chipBlue}`}>安定デフォルト</span>{" "}
                    コスパ最良
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>gemini-3-flash-preview</code>
                    <br />
                    <small style={{ color: "#1e8e3e" }}>✅ CLI デフォルト（v0.29.0〜）</small>
                  </td>
                  <td>次世代バランス</td>
                  <td>コードレビュー、テスト生成、実装、コーディネーター</td>
                  <td>
                    <span className={`${styles.chip} ${styles.chipBlue}`}>推奨デフォルト</span>{" "}
                    SWE-bench 76%（2.5 Pro相当）・低レイテンシ
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>gemini-2.5-pro</code>
                  </td>
                  <td>高精度・複雑推論</td>
                  <td>アーキテクチャ設計、セキュリティ監査、ADR作成</td>
                  <td>
                    <span className={`${styles.chip} ${styles.chipPurple}`}>
                      最高精度（旧世代）
                    </span>{" "}
                    高コスト
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>gemini-3.1-pro-preview</code>
                    <br />
                    <small style={{ color: "#1e8e3e" }}>✅ CLI v0.31.0〜対応</small>
                  </td>
                  <td>最新高精度推論</td>
                  <td>アーキテクチャ設計、セキュリティ監査（ARC-AGI-2: 77.1%）</td>
                  <td>
                    <span className={`${styles.chip} ${styles.chipPurple}`}>新世代最高精度</span>{" "}
                    Gemini 3 Proの2倍超推論力。AI Ultra / 有料APIキー限定
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* s08: Anti-Patterns */}
        <section id="s08" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>8</span>
            <h2>絶対に避けるべき Anti-Patterns</h2>
          </div>

          <div className={styles.patGrid}>
            <div className={`${styles.pat} ${styles.patNg}`}>
              <div className={styles.patLabel}>✗ GEMINI.md の Anti-Patterns</div>
              <ul>
                <li>コードスタイル規約をすべて1ファイルに詰める（@import で分割）</li>
                <li>長大なコードスニペットを埋め込む（トークン浪費）</li>
                <li>機密情報・APIキーを記述（.geminiignore で除外）</li>
                <li>否定形のみの指示（代替案をセットで示す）</li>
                <li>修正履歴・変更ログを蓄積</li>
                <li>ツール固有の設定を混在させる</li>
              </ul>
            </div>
            <div className={`${styles.pat} ${styles.patNg}`}>
              <div className={styles.patLabel}>✗ ADK agent.py / agent.ts の Anti-Patterns</div>
              <ul>
                <li>description が曖昧（「なんでもやる」エージェント）</li>
                <li>ParallelAgent で同じ output_key を使う（上書き発生）</li>
                <li>LoopAgent の終了条件を設定しない（無限ループ）</li>
                <li>
                  全エージェントに gemini-2.5-pro / gemini-3.1-pro-preview を使う（コスト爆発）
                </li>
                <li>ルートエージェントが直接コードを書く（委譲しない）</li>
                <li>10件以上のサブエージェントを ParallelAgent で同時起動</li>
                <li>ADK 2.0 Alpha のグラフAPIを本番に使う（まだ安定版ではない）</li>
                <li>Plan Mode を無効化したまま本番コードベースを変更させる</li>
              </ul>
            </div>
          </div>
        </section>

        {/* s09: まとめ */}
        <section id="s09" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>9</span>
            <h2>まとめ：各ファイルの役割と設計原則</h2>
          </div>

          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>ファイル</th>
                  <th>ツール</th>
                  <th>読者</th>
                  <th>設計原則</th>
                  <th>アンチパターン</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>~/.gemini/GEMINI.md</code>
                  </td>
                  <td>CLI</td>
                  <td>全プロジェクト共通</td>
                  <td>個人のグローバルデフォルト。IDE・言語の好みのみ</td>
                  <td>プロジェクト固有の内容を書く</td>
                </tr>
                <tr>
                  <td>
                    <code>GEMINI.md</code> (root)
                  </td>
                  <td>CLI/Code Assist</td>
                  <td>メインエージェント（常時ロード）</td>
                  <td>プロジェクト概要・スタック・ルーティングルール・禁止操作</td>
                  <td>コードスニペット・機密情報・肥大化</td>
                </tr>
                <tr>
                  <td>
                    <code>src/*/GEMINI.md</code>
                  </td>
                  <td>CLI/Code Assist</td>
                  <td>そのモジュール作業時のみ（Auto-scan）</td>
                  <td>ドメイン固有ルールのみ。root と重複させない</td>
                  <td>rootと同じ内容の重複記述</td>
                </tr>
                <tr>
                  <td>
                    <code>AGENTS.md</code>
                  </td>
                  <td>全ツール共通</td>
                  <td>すべてのAIエージェント</td>
                  <td>ツール横断の共通ルール。固有設定は@importで分離</td>
                  <td>ツール固有の構文を混在</td>
                </tr>
                <tr>
                  <td>
                    <code>agents/*/agent.py</code>
                    <br />
                    <small>
                      （または <code>agent.ts</code>）
                    </small>
                  </td>
                  <td>ADK Python / ADK TypeScript</td>
                  <td>各サブエージェント（独立コンテキスト）</td>
                  <td>
                    description 明確化・output_key 一意設定・ツール最小化。TSは{" "}
                    <code>@google/adk</code>
                  </td>
                  <td>曖昧なdescription・output_key重複</td>
                </tr>
                <tr>
                  <td>
                    <code>.geminiignore</code>
                  </td>
                  <td>CLI/Code Assist</td>
                  <td>コンテキストシステム</td>
                  <td>機密・ビルド成果物・バイナリを除外してトークン節約</td>
                  <td>作成しない（node_modules が全部ロードされる）</td>
                </tr>
                <tr>
                  <td>
                    <code>settings.json</code>
                  </td>
                  <td>CLI/IDE</td>
                  <td>Geminiランタイム</td>
                  <td>MCP設定・除外ツール・checkpointing・planMode の制御</td>
                  <td>直接APIキーを記述する</td>
                </tr>
                <tr>
                  <td>
                    <code>README.md</code>
                  </td>
                  <td>全ツール</td>
                  <td>人間（チームメンバー）</td>
                  <td>エージェント構成・ADKセットアップ・pipeline図</td>
                  <td>エージェント数が多いのに作成しない</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* === MULTI-AGENT (s10〜s17) === */}

        {/* s10: 4層構造 */}
        <section id="s10" className={`${styles.section} ${styles.sectionMa}`}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>10</span>
            <h2>サブエージェント vs マルチエージェント — ADK × A2A × MCP × AP2/A2UI の4層構造</h2>
          </div>

          <div className={styles.maBanner}>
            <div className={styles.maEyebrow}>
              🌐 ADK Python 1.x GA (2025年5月 Google I/O) · ADK Python 2.0
              Alpha（グラフワークフロー）公開中 · ADK TypeScript GA · A2A Protocol (Linux Foundation
              移管済み) · AP2 / A2UI 新プロトコル追加（2026年3月）
            </div>
            <h3>Google が推奨する 4層アーキテクチャ（2026年3月更新）</h3>
            <p>
              Google のマルチエージェント設計は
              <strong>ADK（エージェント内部ロジック）</strong>・
              <strong>A2A プロトコル（エージェント間通信）</strong>・
              <strong>MCP（外部ツール・データ接続）</strong>・
              <strong>AP2 / A2UI（決済・UI）</strong>
              の4層で構成されます。 A2A は Atlassian・SAP・Salesforce・ServiceNow など
              <strong>50 以上のパートナー</strong>が対応するオープンスタンダードです。 ADK の{" "}
              <code>RemoteA2aAgent</code>
              を使えば、リモートエージェントへの接続がローカルのツール呼び出しと同じ感覚で実装できます。2026年3月18日のブログでは新たに
              <strong>
                AP2（決済認証プロトコル）・A2UI（エージェント→UI
                コンポーネント生成）・AG-UI（ストリーミングUI）
              </strong>
              も公開されました。
            </p>
          </div>

          {/* 3-layer stack */}
          <div className={styles.layerStack}>
            <div className={`${styles.layerRow} ${styles.lrAdk}`}>
              <div className={`${styles.layerBadge} ${styles.lbAdk}`}>ADK</div>
              <div className={styles.layerTitle}>🧠 エージェント内部ロジック</div>
              <div className={styles.layerBody}>
                <div className={styles.layerDesc}>
                  agent.py の <code>instruction</code> / <code>tools</code> /{" "}
                  <code>sub_agents</code> / <code>output_key</code> を定義。
                  SequentialAgent・ParallelAgent・LoopAgent でワークフローを制御。
                </div>
                <span className={styles.layerFile}>agents/*/agent.py</span>
                <span className={styles.layerFile}>agents/*/GEMINI.md</span>
              </div>
            </div>
            <div className={`${styles.layerRow} ${styles.lrA2a}`}>
              <div className={`${styles.layerBadge} ${styles.lbA2a}`}>A2A</div>
              <div className={styles.layerTitle}>🔗 エージェント間通信プロトコル</div>
              <div className={styles.layerBody}>
                <div className={styles.layerDesc}>
                  Agent Card（agent.json）で能力を公開。<code>RemoteA2aAgent</code>
                  でリモートエージェントをローカルツールとして利用。HTTPS + JSON-RPC 2.0
                  で通信。フレームワーク・ベンダーを問わず相互接続可能。
                </div>
                <span className={styles.layerFile}>{"agents/{name}/agent.json"}</span>
                <span className={styles.layerFile}>{"/.well-known/agent.json（自動生成）"}</span>
              </div>
            </div>
            <div className={`${styles.layerRow} ${styles.lrMcp}`}>
              <div className={`${styles.layerBadge} ${styles.lbMcp}`}>MCP</div>
              <div className={styles.layerTitle}>🔧 外部ツール・データ接続</div>
              <div className={styles.layerBody}>
                <div className={styles.layerDesc}>
                  エージェントが外部 API・DB・ファイルシステムに接続するための標準プロトコル。ADK は{" "}
                  <code>MCPToolset</code> で透過的に統合。A2A と補完関係にある（MCP =
                  ツール接続、A2A = エージェント接続）。
                </div>
                <span className={styles.layerFile}>{"settings.json → mcpServers"}</span>
              </div>
            </div>
            <div
              className={styles.layerRow}
              style={{
                background: "rgba(232,113,10,0.07)",
                border: "1.5px solid rgba(232,113,10,0.35)",
                borderRadius: 10,
                padding: "14px 16px",
                marginBottom: 10,
              }}
            >
              <div
                className={styles.layerBadge}
                style={{
                  background: "#e8710a",
                  fontSize: 10,
                  padding: "3px 7px",
                  borderRadius: 6,
                  color: "#fff",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                AP2/A2UI
              </div>
              <div className={styles.layerTitle} style={{ color: "#fb923c" }}>
                💳 決済認証 &amp; UI 生成プロトコル（2026年3月18日 新公開）
              </div>
              <div className={styles.layerBody}>
                <div className={styles.layerDesc} style={{ color: "#94a3b8" }}>
                  <strong>AP2</strong>:
                  エージェントが決済・認証フローを標準化されたプロトコルで実行。
                  <strong>A2UI</strong>（AG-UI）: エージェントがフロントエンド UI
                  コンポーネントをストリーミング生成・更新。 ADK の <code>AgentUITransport</code> で
                  React 等フロントエンドと統合可能。
                </div>
                <span
                  className={styles.layerFile}
                  style={{
                    background: "rgba(232,113,10,0.15)",
                    borderColor: "rgba(232,113,10,0.4)",
                    color: "#fb923c",
                  }}
                >
                  AP2: payment_auth フロー定義
                </span>
                <span
                  className={styles.layerFile}
                  style={{
                    background: "rgba(232,113,10,0.15)",
                    borderColor: "rgba(232,113,10,0.4)",
                    color: "#fb923c",
                  }}
                >
                  A2UI: AgentUITransport + UI イベントストリーム
                </span>
              </div>
            </div>
          </div>

          {/* Sub vs Multi comparison */}
          <div className={styles.cmp2Grid}>
            <div className={`${styles.cmp2} ${styles.cmp2Sub}`}>
              <div className={styles.cmp2Label}>🔵 ローカル サブエージェント（ADK 内部）</div>
              <ul>
                <li>
                  <strong>同一プロセス内</strong>で動作（低レイテンシ）
                </li>
                <li>
                  親エージェントの<strong>セッション状態を共有</strong>
                </li>
                <li>
                  <code>sub_agents</code> パラメータで<strong>静的に定義</strong>
                </li>
                <li>SequentialAgent / ParallelAgent / LoopAgent で制御</li>
                <li>
                  <code>output_key</code> で結果を共有 state に書き込む
                </li>
                <li>チームが同じコードベースを管理する場合に適合</li>
                <li>
                  <strong>適用:</strong> 同一サービス内の処理分業・低レイテンシ重視
                </li>
              </ul>
            </div>
            <div className={`${styles.cmp2} ${styles.cmp2Mult}`}>
              <div className={styles.cmp2Label}>🟢 リモート マルチエージェント（A2A 経由）</div>
              <ul>
                <li>
                  <strong>異なるサービス・マシン</strong>上で動作（高スケーラビリティ）
                </li>
                <li>独立したセッション・コンテキストを保持</li>
                <li>
                  <code>RemoteA2aAgent</code> で<strong>動的ディスカバリー</strong>も可能
                </li>
                <li>Agent Card で能力を公開・JSON-RPC で通信</li>
                <li>
                  フレームワーク（ADK / LangGraph / CrewAI）を
                  <strong>問わず相互接続</strong>
                </li>
                <li>
                  <code>to_a2a()</code> で既存 ADK エージェントを即座に A2A 公開
                </li>
                <li>
                  <strong>適用:</strong> クロスチーム・エンタープライズ・ベンダー横断ワークフロー
                </li>
              </ul>
            </div>
          </div>

          {/* Architecture diagram */}
          <div className={styles.a2aArch}>
            <div className={styles.a2aArchTitle}>
              A2A MULTI-AGENT ARCHITECTURE — ADK + RemoteA2aAgent + AgentEngine (Vertex AI)
            </div>
            <div className={styles.a2aRow}>
              <div className={`${styles.a2aBox} ${styles.abOrch}`}>
                🎯 Orchestrator
                <br />
                <small style={{ fontWeight: 400, fontSize: 10.5, color: "rgba(255,255,255,0.55)" }}>
                  LlmAgent (ADK)
                  <br />
                  ルートGEMINI.md 読込
                </small>
              </div>
              <div className={styles.a2aArrow}>→</div>
              <div className={`${styles.a2aBox} ${styles.abLocal}`}>
                ⚙️ Local Sub-Agent
                <br />
                <small style={{ fontWeight: 400, fontSize: 10.5, color: "rgba(255,255,255,0.55)" }}>
                  同一プロセス
                  <br />
                  sub_agents で定義
                </small>
              </div>
              <div className={styles.a2aArrow} style={{ fontSize: 14, opacity: 0.5 }}>
                +
              </div>
              <div className={`${styles.a2aBox} ${styles.abRemote}`}>
                🌐 RemoteA2aAgent
                <br />
                <small style={{ fontWeight: 400, fontSize: 10.5, color: "rgba(255,255,255,0.55)" }}>
                  A2A クライアントプロキシ
                  <br />
                  別サービス・別チーム
                </small>
              </div>
            </div>
            <div className={styles.a2aLabel}>
              ↓ RemoteA2aAgent は開発者から見ると「ローカルのツール」と同じように扱える（network
              通信を隠蔽）
            </div>
            <div className={styles.a2aRow}>
              <div className={`${styles.a2aBox} ${styles.abCard}`}>
                📋 Agent Card
                <br />
                <small style={{ fontWeight: 400, fontSize: 10.5, color: "rgba(255,255,255,0.55)" }}>
                  agent.json
                  <br />
                  {"/.well-known/agent.json"}
                  <br />
                  能力・認証・URL
                </small>
              </div>
              <div className={styles.a2aArrow}>→</div>
              <div className={`${styles.a2aBox} ${styles.abRemote}`} style={{ minWidth: 140 }}>
                🔒 A2A Server
                <br />
                <small style={{ fontWeight: 400, fontSize: 10.5, color: "rgba(255,255,255,0.55)" }}>
                  to_a2a() または
                  <br />
                  adk api_server --a2a
                  <br />
                  で自動生成
                </small>
              </div>
              <div className={styles.a2aArrow}>→</div>
              <div className={`${styles.a2aBox} ${styles.abEngine}`}>
                ☁️ AgentEngine
                <br />
                <small style={{ fontWeight: 400, fontSize: 10.5, color: "rgba(255,255,255,0.55)" }}>
                  Vertex AI 管理型
                  <br />
                  本番スケール
                  <br />
                  デプロイ
                </small>
              </div>
            </div>
            <div className={styles.a2aLabel} style={{ marginTop: 8 }}>
              GEMINI.md はすべてのエージェントが参照するコンテキスト。agent.json（Agent
              Card）はリモートエージェントの公開「能力書」。
            </div>
          </div>

          {/* Decision flow: local sub vs remote */}
          <div className={styles.dflow}>
            <div className={styles.dflowTitle}>
              🔍 ローカル サブエージェント vs リモート A2A — 選択フロー
            </div>
            <div className={styles.dflowRow}>
              <div className={styles.dnQ}>同じコードベースで管理できるか？</div>
              <div className={styles.dnArr}>→ Yes</div>
              <div className={styles.dnY}>ローカル sub_agents（ADK）</div>
            </div>
            <div className={styles.dnInd}>
              <div className={styles.dflowRow}>
                <div className={styles.dnQ}>異なるチーム / フレームワーク / マシン？</div>
                <div className={styles.dnArr}>→ Yes</div>
                <div className={styles.dnY}>RemoteA2aAgent（A2A Protocol）</div>
              </div>
              <div className={styles.dnInd}>
                <div className={styles.dflowRow}>
                  <div className={styles.dnQ}>Agent Card を自動生成したい？</div>
                  <div className={styles.dnArr}>→ Yes</div>
                  <div className={styles.dnY}>to_a2a(agent) 関数</div>
                </div>
                <div className={styles.dflowRow}>
                  <div className={styles.dnQ}>複数エージェントを 1サーバーで管理？</div>
                  <div className={styles.dnArr}>→ Yes</div>
                  <div className={styles.dnY}>adk api_server --a2a + 各 agent.json</div>
                </div>
                <div className={styles.dflowRow}>
                  <div className={styles.dnQ}>本番 / スケーラブルな運用？</div>
                  <div className={styles.dnArr}>→ Yes</div>
                  <div className={styles.dnY}>AgentEngine (Vertex AI) にデプロイ</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* s11: agent.json */}
        <section id="s11" className={`${styles.section} ${styles.sectionMa}`}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>11</span>
            <h2>
              A2A の核心：<span className={styles.mono}>agent.json</span>（Agent Card）—
              リモートエージェントの「能力書」
            </h2>
          </div>

          <div className={styles.card}>
            <p>
              <strong>Agent Card は A2A マルチエージェント設計で最も重要なファイルです。</strong>
              他のエージェントがこのエージェントを
              <em>発見（Discovery）→ 理解（Capability）→ 接続（Auth）</em>
              するための唯一の情報源です。 ADK の <code>to_a2a(agent)</code> を使えば agent.py
              の内容から<strong>自動生成</strong>されますが、
              <code>adk api_server --a2a</code>
              で複数エージェントを管理する場合は<strong>手動で作成</strong>して品質を担保します。
            </p>
            <p style={{ marginTop: 10 }}>
              Agent Card の <code>description</code> と <code>skills</code> フィールドが
              Orchestrator のルーティング判断基準となるため、 ADK の <code>agent.py</code> における{" "}
              <code>description</code>
              と同様に<strong>「いつ使う・いつ使わない」を明記</strong>することが最重要です。
            </p>
          </div>

          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <div className={styles.alertIcon}>ℹ️</div>
            <div className={styles.alertContent}>
              <strong>自動公開エンドポイント</strong>
              ADK の <code>A2AServer</code> または
              <code>adk api_server --a2a</code> を起動すると、
              <code>{"/.well-known/agent.json"}</code>
              エンドポイントで Agent Card が自動公開されます（Swagger の AI
              版）。クライアントエージェントはこの URL にアクセスして能力をディスカバリーします。
            </div>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>agents/code-review/agent.json — Agent Card ベストプラクティス</span>
              <span className={styles.lang}>JSON</span>
            </div>
            <div className={styles.codeBody}>
              {"{\n"}
              {"  "}
              <span className={styles.cm}>"name"</span>
              {": "}
              <span className={styles.cs}>"code-review-agent"</span>
              {",\n"}
              {"  "}
              <span className={styles.cm}>"version"</span>
              {": "}
              <span className={styles.cs}>"2.1.0"</span>
              {",\n\n"}
              {"  "}
              <span className={styles.cc}>
                {"// ── 【最重要】Orchestrator がルーティング判断に使うフィールド ──────────"}
              </span>
              {"\n"}
              {"  "}
              <span className={styles.cm}>"description"</span>
              {": "}
              <span className={styles.cs}>
                {
                  '"コードレビューを実施する専門エージェント。\n  【呼び出す場合】:\n  - PR 作成前のセキュリティ・品質・パフォーマンスチェック\n  - TypeScript/Python/Go コードの静的解析レポートが必要な場合\n  - コード品質スコア（0-100）と改善提案が必要な場合\n  【呼び出さない場合】:\n  - コードの実装・修正 → code-implementer-agent を使う\n  - テスト生成 → test-generator-agent を使う\n  - ドキュメント作成 → doc-writer-agent を使う"'
                }
              </span>
              {",\n\n"}
              {"  "}
              <span className={styles.cm}>"url"</span>
              {": "}
              <span className={styles.cs}>"https://code-review.internal.example.com"</span>
              {",\n\n"}
              {"  "}
              <span className={styles.cc}>
                {"// ── スキル定義（Orchestrator が能力を詳細に理解するために使用）────────"}
              </span>
              {"\n"}
              {"  "}
              <span className={styles.cm}>"skills"</span>
              {": [\n"}
              {"    { "}
              <span className={styles.cm}>"id"</span>
              {": "}
              <span className={styles.cs}>"security-review"</span>
              {", "}
              <span className={styles.cm}>"name"</span>
              {": "}
              <span className={styles.cs}>"Security Review"</span>
              {",\n"}
              {"      "}
              <span className={styles.cm}>"description"</span>
              {": "}
              <span className={styles.cs}>
                "SQLインジェクション・XSS・SSRF・認証バイパスを自動検出する"
              </span>
              {",\n"}
              {"      "}
              <span className={styles.cm}>"tags"</span>
              {": ["}
              <span className={styles.cs}>"security"</span>
              {", "}
              <span className={styles.cs}>"vulnerability"</span>
              {", "}
              <span className={styles.cs}>"owasp"</span>
              {"],\n"}
              {"      "}
              <span className={styles.cm}>"examples"</span>
              {": ["}
              <span className={styles.cs}>"このPRにSQLインジェクションのリスクはありますか？"</span>
              {"] },\n"}
              {"    { "}
              <span className={styles.cm}>"id"</span>
              {": "}
              <span className={styles.cs}>"performance-review"</span>
              {",\n"}
              {"      "}
              <span className={styles.cm}>"name"</span>
              {": "}
              <span className={styles.cs}>"Performance Review"</span>
              {",\n"}
              {"      "}
              <span className={styles.cm}>"description"</span>
              {": "}
              <span className={styles.cs}>
                "N+1クエリ・不要な再レンダリング・O(n²)アルゴリズムを検出する"
              </span>
              {",\n"}
              {"      "}
              <span className={styles.cm}>"tags"</span>
              {": ["}
              <span className={styles.cs}>"performance"</span>
              {", "}
              <span className={styles.cs}>"optimization"</span>
              {", "}
              <span className={styles.cs}>"complexity"</span>
              {"] } ],\n\n"}
              {"  "}
              <span className={styles.cc}>
                {"// ── 認証（A2A は OpenAPI 互換の securitySchemes を採用）───────────────"}
              </span>
              {"\n"}
              {"  "}
              <span className={styles.cm}>"securitySchemes"</span>
              {": { "}
              <span className={styles.cm}>"bearerAuth"</span>
              {": {\n"}
              {"    "}
              <span className={styles.cm}>"type"</span>
              {": "}
              <span className={styles.cs}>"http"</span>
              {",\n"}
              {"    "}
              <span className={styles.cm}>"scheme"</span>
              {": "}
              <span className={styles.cs}>"bearer"</span>
              {",\n"}
              {"    "}
              <span className={styles.cm}>"bearerFormat"</span>
              {": "}
              <span className={styles.cs}>"JWT"</span>
              {"\n"}
              {"  } },\n"}
              {"  "}
              <span className={styles.cm}>"security"</span>
              {": [{ "}
              <span className={styles.cm}>"bearerAuth"</span>
              {": [] }],\n\n"}
              {"  "}
              <span className={styles.cc}>
                {"// ── 入出力形式 ─────────────────────────────────────────────────────────"}
              </span>
              {"\n"}
              {"  "}
              <span className={styles.cm}>"defaultInputModes"</span>
              {": ["}
              <span className={styles.cs}>"text/plain"</span>
              {", "}
              <span className={styles.cs}>"application/json"</span>
              {"],\n"}
              {"  "}
              <span className={styles.cm}>"defaultOutputModes"</span>
              {": ["}
              <span className={styles.cs}>"text/plain"</span>
              {", "}
              <span className={styles.cs}>"application/json"</span>
              {"],\n\n"}
              {"  "}
              <span className={styles.cm}>"provider"</span>
              {": { "}
              <span className={styles.cm}>"organization"</span>
              {": "}
              <span className={styles.cs}>"Platform Engineering Team"</span>
              {", "}
              <span className={styles.cm}>"url"</span>
              {": "}
              <span className={styles.cs}>"https://internal.example.com/agents"</span>
              {" } }"}
            </div>
          </div>

          <div className={styles.patGrid}>
            <div className={`${styles.pat} ${styles.patOk}`}>
              <div className={styles.patLabel}>✅ agent.json ベストプラクティス</div>
              <ul>
                <li>description に「いつ使う・いつ使わない」を両方記述</li>
                <li>skills は機能単位で細かく分割（タグ・examples 付き）</li>
                <li>securitySchemes を必ず設定（認証なし公開は危険）</li>
                <li>
                  version を semantic versioning で管理（破壊的変更 = メジャーバージョンアップ）
                </li>
                <li>examples フィールドで Orchestrator の理解を補助</li>
                <li>provider に連絡先・組織情報を明記（オーナー不明問題を防止）</li>
              </ul>
            </div>
            <div className={`${styles.pat} ${styles.patNg}`}>
              <div className={styles.patLabel}>✗ agent.json Anti-Patterns</div>
              <ul>
                <li>description が「なんでもやります」（誤ルーティングの最大要因）</li>
                <li>securitySchemes なしで公開（セキュリティリスク）</li>
                <li>skills を定義しない（能力発見できず Orchestrator から使われない）</li>
                <li>url が内部 IP / localhost のまま本番公開</li>
                <li>version を更新せず API 変更（クライアントが無警告で壊れる）</li>
                <li>description が agent.py の instruction と乖離している</li>
              </ul>
            </div>
          </div>
        </section>

        {/* s12: マルチエージェント GEMINI.md */}
        <section id="s12" className={`${styles.section} ${styles.sectionMa}`}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>12</span>
            <h2>
              マルチエージェント向け <span className={styles.mono}>GEMINI.md</span> — Orchestrator
              の「作戦指令書」
            </h2>
          </div>

          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <div className={styles.alertIcon}>✅</div>
            <div className={styles.alertContent}>
              <strong>GEMINI.md はマルチエージェント全体の品質ゲートウェイ</strong>
              Orchestrator は GEMINI.md を読み込んで「どのエージェントをいつ呼ぶか」を判断します。
              サブエージェントには独立した <code>agent.py instruction</code> がありますが、
              <strong>Orchestrator のルーティング精度は GEMINI.md の記述品質で決まります。</strong>
              A2A リモートエージェントのエンドポイント
              URL・ファイル所有権・フォールバック戦略を必ず記載します。
            </div>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>GEMINI.md — マルチエージェント向け追記テンプレート（rootに追加）</span>
              <span className={styles.lang}>Markdown</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.ch}># PROJECT: enterprise-dev-platform</span>
              {"\n"}
              <span className={styles.cc}>
                ## Stack / Overview ... （既存セクションはそのまま）
              </span>
              {"\n\n"}
              <span className={styles.ch}>
                {"## ────────────────────────────────────────────────────────────\n"}
                {"## Multi-Agent Configuration（マルチエージェント設定）\n"}
                {"## ────────────────────────────────────────────────────────────"}
              </span>
              {"\n\n"}
              <span className={styles.ch}>
                ### ローカル サブエージェント（同一プロセス・ADK sub_agents）
              </span>
              {"\n"}
              {"同一サービス内・低レイテンシが必要な場合に使用:\n"}
              {"| Agent name | 役割 | 書き込み可能パス |\n"}
              {"|---|---|---|\n"}
              {"| "}
              <span className={styles.cs}>spec-writer</span>
              {" | 新機能の仕様書作成 | "}
              <span className={styles.cs}>docs/specs/</span>
              {" |\n"}
              {"| "}
              <span className={styles.cs}>code-implementer</span>
              {" | コード実装 | "}
              <span className={styles.cs}>src/, tests/</span>
              {" |\n"}
              {"| "}
              <span className={styles.cs}>test-generator</span>
              {" | テスト生成 | "}
              <span className={styles.cs}>tests/</span>
              {" |\n\n"}
              <span className={styles.cw}>
                ファイル所有権ルール: 担当外のパスへの書き込みは禁止。
                同一ファイルへの複数エージェント同時書き込みは禁止。
              </span>
              {"\n\n"}
              <span className={styles.ch}>### リモート エージェント（A2A Protocol 経由）</span>
              {"\n"}
              {"別チーム・別フレームワーク・専門性が必要な場合に使用:\n"}
              {"| Agent name | Agent Card URL | 備考 |\n"}
              {"|---|---|---|\n"}
              {"| "}
              <span className={styles.cs}>code-review-agent</span>
              {" | "}
              <span className={styles.cv}>
                https://review.internal.example.com/.well-known/agent.json
              </span>
              {" | セキュリティ・品質レビュー |\n"}
              {"| "}
              <span className={styles.cs}>security-scanner</span>
              {" | "}
              <span className={styles.cv}>
                https://security.internal.example.com/.well-known/agent.json
              </span>
              {" | 本番デプロイ前必須 |\n"}
              {"| "}
              <span className={styles.cs}>doc-generator</span>
              {" | "}
              <span className={styles.cv}>
                https://docs.internal.example.com/.well-known/agent.json
              </span>
              {" | API ドキュメント生成 |\n\n"}
              <span className={styles.ch}>### A2A 通信ルール</span>
              {"\n"}
              {"- リモートエージェント呼び出し前に Agent Card の "}
              <span className={styles.cs}>skills</span>
              {" を確認して適切なエージェントを選択\n"}
              {"- タイムアウト（> 30秒）→ ローカルフォールバックを試みる\n"}
              {"- 認証エラー → リトライせず即座にユーザーへ報告\n"}
              {"- リモートエージェントが「Read-only」の場合、ファイル変更は要求しない\n\n"}
              <span className={styles.ch}>### Quality Gates（全エージェント共通）</span>
              {"\n"}
              {"- コード変更後: "}
              <span className={styles.cs}>`pytest tests/`</span>
              {" と "}
              <span className={styles.cs}>`ruff check .`</span>
              {" を必ず実行\n"}
              {"- 本番デプロイ前: "}
              <span className={styles.cs}>security-scanner</span>
              {" エージェントを**必ず**呼ぶ\n"}
              {"- DB マイグレーション: "}
              <span className={styles.cs}>db-agent</span>
              {" 経由でのみ実行（直接 SQL は禁止）\n\n"}
              <span className={styles.ch}>
                ### @import で分割管理（GEMINI.md が肥大化した場合）
              </span>
              {"\n"}
              <span className={styles.cc}>
                # 各エージェントのルールが多い場合は以下のように分割
              </span>
              {"\n"}
              <span className={styles.cm}>@import ./agents/orchestrator/GEMINI.md</span>
              {"  "}
              <span className={styles.cc}># Orchestratorルーティングルール</span>
              {"\n"}
              <span className={styles.cm}>@import ./agents/implementer/GEMINI.md</span>
              {"  "}
              <span className={styles.cc}># 実装エージェント固有ルール</span>
              {"\n"}
              <span className={styles.cm}>@import ./docs/agent-endpoints.md</span>
              {"  "}
              <span className={styles.cc}># リモートエンドポイント一覧</span>
            </div>
          </div>

          <div className={`${styles.alert} ${styles.alertWarn}`}>
            <div className={styles.alertIcon}>⚠️</div>
            <div className={styles.alertContent}>
              <strong>サービス固有 GEMINI.md の配置戦略（Auto-scan 活用）</strong>
              マルチエージェントシステムではサービス数が増えるため GEMINI.md が肥大化しやすい。
              <code>agents/code-review/GEMINI.md</code>（レビュー固有ルール）のように
              <strong>エージェントディレクトリ内に配置</strong>し、
              そのエージェントが作業するときのみ Auto-scan でロードされる構成を推奨。 ルート
              GEMINI.md からは <code>@import</code> で共通部分のみを参照させる。
            </div>
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
