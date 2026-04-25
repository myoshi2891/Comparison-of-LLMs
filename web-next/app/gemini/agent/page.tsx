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
