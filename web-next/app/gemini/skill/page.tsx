import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Google Antigravity × Gemini 3.1 Pro — マークダウンファイル完全ガイド",
  description:
    "GEMINI.md / Rules / SKILL.md / Workflows / Knowledge Base / Artifacts / SDD仕様書群 — Google Antigravity の AI 仕様駆動開発を支えるマークダウンファイル群の役割・構造・ベストプラクティスを公式根拠付きで解説。",
};

// 外部ソース (sources セクション) の定義。Phase F で redirect 一覧を作る際にも参照する。
type Source = { num: string; href: string; title: string; desc: string };

const SOURCES: Source[] = [
  {
    num: "[1]",
    href: "https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/",
    title: "Build with Google Antigravity — Google Developers Blog (Nov 2025)",
    desc: "Antigravity公式発表。エージェントファーストパラダイム・Artifacts・Knowledge Baseの設計思想",
  },
  {
    num: "[2]",
    href: "https://medium.com/google-cloud/benefits-and-challenges-of-spec-driven-development-and-how-antigravity-is-changing-the-game-3343a6942330",
    title:
      "How Google Antigravity is changing spec-driven development — Google Cloud Medium (Jan 2026)",
    desc: "Artifacts（Task List / Implementation Plan / Walkthrough）のSDD活用、Knowledge Baseによる自動学習",
  },
  {
    num: "[3]",
    href: "https://codelabs.developers.google.com/getting-started-google-antigravity",
    title: "Getting Started with Google Antigravity — Google Codelabs",
    desc: "公式チュートリアル。Skills・Rules・Workflows・Artifactsの設定方法。GEMINI.md・.agent/ディレクトリ構造",
  },
  {
    num: "[4]",
    href: "https://codelabs.developers.google.com/getting-started-with-antigravity-skills",
    title: "Authoring Google Antigravity Skills — Google Codelabs",
    desc: "SKILL.mdの完全仕様。スキルディレクトリ構造（SKILL.md / scripts / references / assets）・5パターン詳解",
  },
  {
    num: "[5]",
    href: "https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d",
    title: "How to Build Custom Skills in Google Antigravity — Google Cloud Medium (Jan 2026)",
    desc: "Progressive Disclosure設計思想。scripts/サブディレクトリのTool Use Pattern詳細。グローバル/ワークスペーススコープ",
  },
  {
    num: "[6]",
    href: "https://iamulya.one/posts/advanced-tips-for-mastering-google-antigravity/",
    title: "Advanced Tips for Mastering Google Antigravity — Amulya Bhatia (Jan 2026)",
    desc: "Rules vs Workflows の使い分け。fileMatch activation。マルチエージェント並列処理。Workflowsチェーン化",
  },
  {
    num: "[7]",
    href: "https://www.shipai.dev/blog/google-antigravity-agentic-ide-guide",
    title: "What Is Google Antigravity? Google's Agent-First IDE Explained — ShipAI",
    desc: "エージェントファーストパラダイムの概念説明。人間がアーキテクトになる役割変化",
  },
  {
    num: "[8]",
    href: "https://github.com/study8677/antigravity-workspace-template",
    title: "antigravity-workspace-template — GitHub (study8677)",
    desc: ".antigravity/rules.md + .cursorrules の統合テンプレート。ゼロコンフィグワークスペース設計",
  },
  {
    num: "[9]",
    href: "https://en.wikipedia.org/wiki/Google_Antigravity",
    title: "Google Antigravity — Wikipedia",
    desc: "発表経緯・技術仕様。対応モデル：Claude Sonnet 4.6 / Claude Opus 4.6 / GPT-OSS-120B（2026年3月時点）",
  },
  {
    num: "[10]",
    href: "https://antigravity.google/",
    title: "Google Antigravity 公式サイト — antigravity.google",
    desc: "ダウンロード・公式ドキュメント・機能一覧",
  },
  {
    num: "[11]",
    href: "https://vertu.com/lifestyle/mastering-google-antigravity-skills-a-comprehensive-guide-to-agentic-extensions-in-2026/",
    title: "Master Google Antigravity Skills — VERTU (2026)",
    desc: "SKILL.mdのdescriptionフィールドの意味的トリガー機能。Few-Shot examplesの効果",
  },
  {
    num: "[12]",
    href: "https://github.com/sickn33/antigravity-awesome-skills",
    title: "antigravity-awesome-skills — GitHub (800+ Skills Collection)",
    desc: "SKILL.mdのユニバーサル規格（Claude Code / Antigravity / Cursor共通）。コミュニティスキルライブラリ",
  },
  {
    num: "[13]",
    href: "https://github.com/guanyang/antigravity-skills",
    title: "antigravity-skills — GitHub (guanyang)",
    desc: "subagent-driven-development・doc-coauthoring等の専門スキル集。Skills×ワークフロー統合設計",
  },
  {
    num: "[14]",
    href: "https://leaveit2ai.com/ai-tools/code-development/antigravity",
    title: "Google Antigravity Review 2026 — leaveit2ai.com",
    desc: "Agent Manager（Mission Control）の詳細レビュー。Trust-Building Artifactsの実際の動作",
  },
  {
    num: "[15]",
    href: "https://www.linkedin.com/posts/iromin_tutorial-getting-started-with-antigravity-activity-7417162852693721088-vkcD",
    title: "Google Antigravity Agent Skills Tutorial — Romin Irani (LinkedIn, Jan 2026)",
    desc: "Skills vs MCP Server Tools の使い分け。Basic Router / Reference / Few-shot / Tool Use / All-in-Oneの5パターン解説",
  },
  {
    num: "[16]",
    href: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/",
    title: "Gemini 3.1 Pro: A smarter model for your most complex tasks — Google Blog (Feb 2026)",
    desc: "Gemini 3.1 ProリリースアナウンスとAntigravity/Gemini CLI/Vertex AIへの展開。ARC-AGI-2スコア77.1%（Gemini 3 Proの2倍以上の推論性能）。Antigravity・Android Studio・Google AI Studioで利用可能",
  },
  {
    num: "[17]",
    href: "https://ai.google.dev/gemini-api/docs/deprecations",
    title: "Gemini deprecations | Gemini API | Google AI for Developers",
    desc: "Gemini 3 Pro Preview廃止スケジュール（2026-03-09）。Gemini 3.1 Pro Previewへの移行案内",
  },
  {
    num: "[18]",
    href: "https://geminicli.com/docs/cli/skills/",
    title: "Agent Skills | Gemini CLI 公式ドキュメント",
    desc: "Gemini CLI（ターミナルCLI）のスキル仕様。~/.gemini/skills/パス・activate_skillツール・v0.25.0でデフォルト有効化",
  },
  {
    num: "[19]",
    href: "https://aitoolanalysis.com/google-antigravity-review/",
    title: "Google Antigravity Review 2026 (v1.20.3 Updated) — AI Tool Analysis (Mar 2026)",
    desc: "v1.20.3（2026-03-05）の変更点詳細。AGENTS.mdサポート追加・トークン計算バグ修正・Auto-continueのデフォルト有効化。現在サポートされるモデル一覧（Gemini 3.1 Pro High/Low・Gemini 3 Flash・Claude Sonnet 4.6・Claude Opus 4.6・GPT-OSS 120B）",
  },
  {
    num: "[20]",
    href: "https://en.wikipedia.org/wiki/Google_Antigravity",
    title: "Google Antigravity — Wikipedia（2026年3月更新）",
    desc: "Claude Sonnet 4.6・Claude Opus 4.6・GPT-OSS-120Bのサポート追加。SWE-bench Verified 76.2%スコア。Windsurf fork説など発表経緯の最新情報",
  },
];

// コードブロック 3 ドット (macOS ウィンドウ風の Google red・yellow・green)。
function CodeDots() {
  return (
    <span className={styles.cbDots}>
      <span className={styles.cbd} style={{ background: "#ea4335" }} />
      <span className={styles.cbd} style={{ background: "#fbbc04" }} />
      <span className={styles.cbd} style={{ background: "#34a853" }} />
    </span>
  );
}

export default function GeminiSkillPage() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.googleGlow} />
        <div className={styles.headerTag}>Google Antigravity × Gemini 3.1 Pro</div>
        <h1 className={styles.headerTitle}>
          AI仕様駆動開発における
          <br />
          <span className={styles.rainbowText}>マークダウンファイル</span>
          <br />
          完全ガイド
        </h1>
        <p className={styles.headerSub}>
          Rules / Skills / Workflows / Artifacts —
          Antigravityの全マークダウンファイルの役割・構造・ベストプラクティスを根拠ソース付きで徹底解説
        </p>
        <div className={styles.platformBadges}>
          <span className={`${styles.pb} ${styles.pbBlue}`}>Google Antigravity</span>
          <span className={`${styles.pb} ${styles.pbGreen}`}>Gemini 3.1 Pro</span>
          <span className={`${styles.pb} ${styles.pbYellow}`}>Agent-First IDE</span>
          <span className={`${styles.pb} ${styles.pbRed}`}>Spec-Driven Dev</span>
          <span className={`${styles.pb} ${styles.pbPurple}`}>Nov 2025 GA</span>
        </div>
      </header>

      <main className={styles.main}>
        {/* TOC */}
        <nav className={styles.toc} aria-label="目次">
          <div className={styles.tocLabel}>目次</div>
          <ol>
            <li>
              <a href="#overview">Google Antigravityとは — Claude Codeとの比較</a>
            </li>
            <li>
              <a href="#directory">全体ファイル構成とディレクトリ</a>
            </li>
            <li>
              <a href="#gemini-md">GEMINI.md — グローバル永続メモリ</a>
            </li>
            <li>
              <a href="#rules">Rules (.agent/rules/) — 受動的制約・システムプロンプト</a>
            </li>
            <li>
              <a href="#skills">SKILL.md (.agent/skills/) — 進歩的開示ナレッジ</a>
            </li>
            <li>
              <a href="#workflows">Workflows (.agent/workflows/) — 能動的手順書</a>
            </li>
            <li>
              <a href="#context">Knowledge Base (.context/) — 自動注入コンテキスト</a>
            </li>
            <li>
              <a href="#artifacts">Artifacts — エージェント自動生成マークダウン</a>
            </li>
            <li>
              <a href="#sdd">SDD仕様書群 (spec / requirements / design / tasks)</a>
            </li>
            <li>
              <a href="#best-practices">横断ベストプラクティス10則</a>
            </li>
            <li>
              <a href="#sources">参考ソース一覧</a>
            </li>
          </ol>
        </nav>

        {/* SECTION 1: OVERVIEW */}
        <section id="overview" className={styles.section}>
          <div className={styles.secLabel}>Section 01</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>01.</span>Google Antigravityとは — Claude Codeとの比較
          </h2>

          <p>
            Google Antigravityは
            <strong className={styles.strongBright}>2025年11月18日にGemini 3と同時発表</strong>
            されたエージェント・ファースト型IDEです。VS Codeのフォークをベースに、Claude
            CodeのようなCLIツールではなく
            <strong className={styles.strongBright}>
              フルIDEとして「エージェントが主役」のパラダイム
            </strong>
            を実装しています。
          </p>

          <table className={styles.table}>
            <tbody>
              <tr>
                <th>特性</th>
                <th>Google Antigravity</th>
                <th>Claude Code</th>
              </tr>
              <tr>
                <td>種別</td>
                <td>Agent-First IDE（VSCode fork）</td>
                <td>CLI / ターミナルエージェント</td>
              </tr>
              <tr>
                <td>主要AI</td>
                <td>
                  Gemini 3.1 Pro (High/Low) / Gemini 3 Flash
                  <br />+ Claude Sonnet 4.6 / Claude Opus 4.6 / GPT-OSS 120B
                  <br />
                  <small className={styles.smallDim}>※Gemini 3 Pro廃止済（2026-03-09）</small>
                </td>
                <td>Claude Opus / Sonnet / Haiku</td>
              </tr>
              <tr>
                <td>永続記憶</td>
                <td>GEMINI.md + Knowledge Base + Rules</td>
                <td>CLAUDE.md + MEMORY.md</td>
              </tr>
              <tr>
                <td>ナレッジ拡張</td>
                <td>SKILL.md（進歩的開示）</td>
                <td>SKILL.md（同一規格）</td>
              </tr>
              <tr>
                <td>手順自動化</td>
                <td>Workflows (.md)</td>
                <td>Custom Commands (.md)</td>
              </tr>
              <tr>
                <td>ブラウザ自動化</td>
                <td>Browser Subagent（ネイティブ）</td>
                <td>なし（MCP経由）</td>
              </tr>
              <tr>
                <td>マルチエージェント</td>
                <td>Agent Manager（並列・非同期）</td>
                <td>サブエージェント（限定的）</td>
              </tr>
              <tr>
                <td>エビデンス生成</td>
                <td>Artifacts（自動）</td>
                <td>なし（手動）</td>
              </tr>
              <tr>
                <td>価格</td>
                <td>
                  無料（Public Preview中）
                  <br />
                  <small className={styles.smallDim}>
                    Google AI Pro ($19.99/月) / Ultra ($250/月) 加入者は優先枠
                    <br />
                    ※2026年3月現在、Pro加入者でも最大7日間のレートリミットロックが報告されている
                  </small>
                </td>
                <td>Anthropicプランに依存</td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.infoBox} ${styles.iNote}`}>
            <span className={styles.ii}>ℹ️</span>
            <div>
              <strong>SKILL.mdは共通規格</strong>
              です。AntigravityとClaude
              Codeは同一のSKILL.md形式を採用しており、ファイルを両プラットフォーム間でほぼそのまま移植できます（
              <a
                href="https://github.com/sickn33/antigravity-awesome-skills"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.inlineLink}
              >
                antigravity-awesome-skills
              </a>
              参照）。また、
              <strong>v1.20.3（2026-03-05）以降はAGENTS.mdにも対応</strong>
              し、Claude
              Code（CLAUDE.md）など他のエージェントツールとのルール共有が可能になりました。
            </div>
          </div>
        </section>

        {/* SECTION 2: DIRECTORY */}
        <section id="directory" className={styles.section}>
          <div className={styles.secLabel}>Section 02</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>02.</span>全体ファイル構成とディレクトリ
          </h2>

          <div className={styles.flowWrap}>
            <div className={styles.flowLabel}>▸ SDD × Antigravity 4フェーズフロー</div>
            <div className={styles.flow}>
              <div className={styles.fstep}>
                <div className={`${styles.fbox} ${styles.fbB}`}>
                  Phase 1<br />
                  仕様策定
                </div>
                <div className={styles.ffile}>
                  spec.md
                  <br />
                  requirements.md
                </div>
              </div>
              <div className={styles.farrow}>→</div>
              <div className={styles.fstep}>
                <div className={`${styles.fbox} ${styles.fbG}`}>
                  Phase 2<br />
                  設計
                </div>
                <div className={styles.ffile}>
                  design.md
                  <br />
                  .antigravity/rules.md
                </div>
              </div>
              <div className={styles.farrow}>→</div>
              <div className={styles.fstep}>
                <div className={`${styles.fbox} ${styles.fbY}`}>
                  Phase 3<br />
                  エージェント実行
                </div>
                <div className={styles.ffile}>
                  tasks.md
                  <br />
                  workflows/
                </div>
              </div>
              <div className={styles.farrow}>→</div>
              <div className={styles.fstep}>
                <div className={`${styles.fbox} ${styles.fbR}`}>
                  Phase 4<br />
                  検証
                </div>
                <div className={styles.ffile}>
                  Artifacts
                  <br />
                  Browser Agent
                </div>
              </div>
              <div className={styles.farrow}>→</div>
              <div className={styles.fstep}>
                <div className={`${styles.fbox} ${styles.fbP}`}>
                  フィードバック
                  <br />
                  ループ
                </div>
                <div className={styles.ffile}>
                  Knowledge
                  <br />
                  更新
                </div>
              </div>
            </div>
          </div>

          <h3>推奨ディレクトリ構成（全体）</h3>
          <div className={styles.hierarchy}>
            <div className={styles.hi}>
              <span className={styles.hFold}>📁</span> <span>your-project/</span>
            </div>

            <div className={`${styles.hi} ${styles.hi1}`}>
              <span className={styles.hFold}>📁</span> <span>.agent/</span>
              <span className={styles.hD}>— Antigravity ワークスペース設定（最重要）</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hFold}>📁</span> <span>rules/</span>
            </div>
            <div className={`${styles.hi} ${styles.hi3}`}>
              <span className={styles.hB}>📄</span> <span className={styles.hB}>always-on.md</span>
              <span className={styles.hD}>— 常時適用ルール</span>
            </div>
            <div className={`${styles.hi} ${styles.hi3}`}>
              <span className={styles.hB}>📄</span> <span className={styles.hB}>go-style.md</span>
              <span className={styles.hD}>— 言語別スタイルルール</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hFold}>📁</span> <span>skills/</span>
            </div>
            <div className={`${styles.hi} ${styles.hi3}`}>
              <span className={styles.hFold}>📁</span> <span>db-migration/</span>
            </div>
            <div className={`${styles.hi} ${styles.hi4}`}>
              <span className={styles.hG}>📄</span> <span className={styles.hG}>SKILL.md</span>
              <span className={styles.hD}>— スキル定義（必須）</span>
            </div>
            <div className={`${styles.hi} ${styles.hi4}`}>
              <span className={styles.hFold}>📁</span> <span>scripts/</span>
              <span className={styles.hD}>— 実行スクリプト（任意）</span>
            </div>
            <div className={`${styles.hi} ${styles.hi4}`}>
              <span className={styles.hFold}>📁</span> <span>references/</span>
              <span className={styles.hD}>— 参考ドキュメント（任意）</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hFold}>📁</span> <span>workflows/</span>
            </div>
            <div className={`${styles.hi} ${styles.hi3}`}>
              <span className={styles.hR}>📄</span> <span className={styles.hR}>deploy.md</span>
              <span className={styles.hD}>— /deploy コマンド</span>
            </div>
            <div className={`${styles.hi} ${styles.hi3}`}>
              <span className={styles.hR}>📄</span> <span className={styles.hR}>review.md</span>
              <span className={styles.hD}>— /review コマンド</span>
            </div>

            <div className={`${styles.hi} ${styles.hi1}`}>
              <span className={styles.hFold}>📁</span> <span>.context/</span>
              <span className={styles.hD}>— Knowledge Base（自動注入）</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hC}>📄</span>{" "}
              <span className={styles.hC}>architecture.md</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hC}>📄</span>{" "}
              <span className={styles.hC}>api-conventions.md</span>
            </div>

            <div className={`${styles.hi} ${styles.hi1}`}>
              <span className={styles.hFold}>📁</span> <span>.antigravity/</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hP}>📄</span> <span className={styles.hP}>rules.md</span>
              <span className={styles.hD}>— IDE統合ルール（.cursorrules互換）</span>
            </div>

            <div className={`${styles.hi} ${styles.hi1}`}>
              <span className={styles.hFold}>📁</span> <span>docs/</span>{" "}
              <span className={styles.hD}>— SDD仕様書群</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hB}>📄</span> <span className={styles.hB}>spec.md</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hB}>📄</span>{" "}
              <span className={styles.hB}>requirements.md</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hB}>📄</span> <span className={styles.hB}>design.md</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hG}>📄</span> <span className={styles.hG}>tasks.md</span>
            </div>

            <div className={`${styles.hi} ${styles.hi1} ${styles.hiTopGap}`}>
              <span>~/.gemini/</span> <span className={styles.hD}>— グローバルスコープ</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hB}>📄</span> <span className={styles.hB}>GEMINI.md</span>
              <span className={styles.hD}>— 全プロジェクト共通ルール</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hFold}>📁</span> <span>antigravity/skills/</span>
              <span className={styles.hD}>— グローバルスキル（Antigravity IDE）</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hFold}>📁</span> <span>antigravity/global_workflows/</span>
              <span className={styles.hD}>— グローバルワークフロー</span>
            </div>
            <div className={`${styles.hi} ${styles.hi2}`}>
              <span className={styles.hFold}>📁</span> <span>skills/</span>
              <span className={styles.hD}>
                — グローバルスキル（Gemini CLI用、antigravity/ サブパスなし）
              </span>
            </div>

            <div className={`${styles.hi} ${styles.hi1} ${styles.hiTopGap}`}>
              <span className={styles.hG}>📄</span> <span className={styles.hG}>AGENTS.md</span>
              <span className={styles.hD}>
                — クロスツール共有ルール（v1.20.3～対応、プロジェクトルートに配置）
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3: GEMINI.MD */}
        <section id="gemini-md" className={styles.section}>
          <div className={styles.secLabel}>Section 03</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>03.</span>GEMINI.md — グローバル永続メモリ
          </h2>

          <p>
            Claude Codeの<code>CLAUDE.md</code>に相当する
            <strong className={styles.strongBright}>グローバル永続メモリファイル</strong>。
            <code>~/.gemini/GEMINI.md</code>
            に配置し、全プロジェクト・全エージェントセッションに横断的に注入されます。プロジェクト固有のルールは後述の
            <code>.agent/rules/</code>に分離します。
          </p>

          <div className={styles.fileCard}>
            <div className={styles.fcHeader}>
              <div className={`${styles.fcIcon} ${styles.fcIconBlue}`}>🌐</div>
              <div>
                <div className={styles.fcName}>GEMINI.md</div>
                <div className={styles.fcPath}>~/.gemini/GEMINI.md</div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <h3>スコープと読み込み優先度</h3>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <th>ファイル</th>
                    <th>スコープ</th>
                    <th>目的</th>
                  </tr>
                  <tr>
                    <td>~/.gemini/GEMINI.md</td>
                    <td>グローバル</td>
                    <td>全プロジェクト共通のワーキングスタイル・禁止事項</td>
                  </tr>
                  <tr>
                    <td>AGENTS.md（プロジェクトルート）</td>
                    <td>クロスツール</td>
                    <td>Claude Code等と共有できるルール（v1.20.3～対応）</td>
                  </tr>
                  <tr>
                    <td>.agent/rules/always-on.md</td>
                    <td>ワークスペース</td>
                    <td>プロジェクト固有の常時ルール（優先）</td>
                  </tr>
                  <tr>
                    <td>.antigravity/rules.md</td>
                    <td>IDE統合</td>
                    <td>Antigravity IDE固有の動作設定</td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.codeBlock}>
                <div className={styles.cbHeader}>
                  <CodeDots />
                  <span>~/.gemini/GEMINI.md — ベストプラクティステンプレート</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}># Global Developer Profile</span>
                  {"\n\n"}
                  <span className={styles.hd}>## 🎯 My Working Style</span>
                  {"\n"}
                  <span className={styles.cmt}>{`# エージェントへの"個人プロファイル"を記述`}</span>
                  {"\n"}- コードレビューはQuality {">"} Speed{"\n"}- TDD優先（テストを先に書く）
                  {"\n"}- コメントは英語、コミットはConventional Commits形式{"\n\n"}
                  <span className={styles.hd}>## 🛠 Global Toolchain</span>
                  {"\n"}
                  <span className={styles.cmt}># 全プロジェクト共通で使うツール</span>
                  {"\n"}- フォーマッター: Prettier / gofmt / Black{"\n"}- Lint: ESLint /
                  golangci-lint / ruff{"\n"}- テスト: Vitest / Go test / pytest{"\n\n"}
                  <span className={styles.hd}>## ⚠️ Global Constraints</span>
                  {"\n"}
                  <span className={styles.cmt}># 絶対禁止ルール（プロジェクト横断）</span>
                  {"\n"}- 本番DBへのDELETE/DROPは必ず人間確認{"\n"}- .envファイルをコミットしない
                  {"\n"}- console.log()はコードレビュー前に削除{"\n\n"}
                  <span className={styles.hd}>## 🤖 Agent Behavior Preferences</span>
                  {"\n"}- タスク開始前にImplementation Planを必ず生成すること{"\n"}-
                  不確実な場合は実装前に確認（&quot;Always Proceed&quot;禁止）{"\n"}- git
                  commitはタスク単位で細かく行う
                </pre>
              </div>

              <div className={`${styles.infoBox} ${styles.iWarn}`}>
                <span className={styles.ii}>⚠️</span>
                <div>
                  <strong>アンチパターン:</strong>{" "}
                  GEMINI.mdにプロジェクト固有のDB設定やAPIエンドポイントを書かない。グローバルファイルはプロジェクト固有情報を持つべきではありません。プロジェクト情報は
                  <code>.agent/rules/</code>または<code>.context/</code>へ。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: RULES */}
        <section id="rules" className={styles.section}>
          <div className={styles.secLabel}>Section 04</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>04.</span>Rules (.agent/rules/) —
            受動的制約・バックグラウンドシステムプロンプト
          </h2>

          <p>
            Antigravityの
            <strong className={styles.strongBright}>
              Rulesは「常にバックグラウンドで動作するシステムプロンプト」
            </strong>
            です。Claude CodeのCLAUDE.mdとは異なり、
            <strong>ファイル単位でルールを分割・個別に有効化</strong>できる点が特徴です。
          </p>

          <div className={styles.fileCard}>
            <div className={styles.fcHeader}>
              <div className={`${styles.fcIcon} ${styles.fcIconRed}`}>📜</div>
              <div>
                <div className={styles.fcName}>Rules Files</div>
                <div className={styles.fcPath}>.agent/rules/*.md</div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <h3>Rules vs SKILL.md — 使い分け早見表</h3>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <th>観点</th>
                    <th>Rules (.agent/rules/)</th>
                    <th>SKILL.md (.agent/skills/)</th>
                  </tr>
                  <tr>
                    <td>起動タイミング</td>
                    <td>常時（または設定条件で）</td>
                    <td>意図が合致したときのみ</td>
                  </tr>
                  <tr>
                    <td>コンテキスト消費</td>
                    <td>高（毎回注入）</td>
                    <td>低（オンデマンド）</td>
                  </tr>
                  <tr>
                    <td>用途</td>
                    <td>コーディング規約・禁止事項</td>
                    <td>専門ワークフロー・知識</td>
                  </tr>
                  <tr>
                    <td>推奨内容</td>
                    <td>「〜してはいけない」ルール</td>
                    <td>「〜する方法」の手順</td>
                  </tr>
                </tbody>
              </table>

              <h3>ベストプラクティス: ルールファイルを機能別に分割</h3>

              <div className={styles.codeBlock}>
                <div className={styles.cbHeader}>
                  <CodeDots />
                  <span>.agent/rules/always-on.md — 常時適用ルール</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}>---</span>
                  {"\n"}
                  <span className={styles.str}>activation: always</span>
                  {"\n"}
                  <span className={styles.hd}>---</span>
                  {"\n\n"}
                  <span className={styles.hd}># Project Core Rules</span>
                  {"\n\n"}
                  <span className={styles.hd}>## Architecture</span>
                  {"\n"}- このプロジェクトはマイクロサービス構成（Go + gRPC）{"\n"}-
                  サービス間通信はgRPCのみ（REST禁止）{"\n"}-
                  各サービスは独自のPostgreSQLスキーマを持つ{"\n\n"}
                  <span className={styles.hd}>## Security Constraints</span>
                  {"\n"}- 認証なしのエンドポイントを新規作成しない{"\n"}- パスワードは必ずbcrypt
                  (cost=12)でハッシュ化{"\n"}- JWTの有効期限は1時間以内{"\n\n"}
                  <span className={styles.hd}>## Forbidden Actions</span>
                  {"\n"}- ORM使用禁止（raw SQLのみ）{"\n"}- グローバル変数の新規追加禁止{"\n"}-
                  panic()の使用禁止（エラーを返せ）
                </pre>
              </div>

              <div className={styles.codeBlock}>
                <div className={styles.cbHeader}>
                  <CodeDots />
                  <span>.agent/rules/go-style.md — 言語別ルール（Go専用）</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}>---</span>
                  {"\n"}
                  <span className={styles.str}>activation: fileMatch</span>
                  {"\n"}
                  <span className={styles.str}>{`pattern: "**/*.go"`}</span>
                  {"\n"}
                  <span className={styles.hd}>---</span>
                  {"\n\n"}
                  <span className={styles.hd}># Go Coding Standards</span>
                  {"\n\n"}- エラーハンドリング: errors.Wrap()を必ず使用{"\n"}- テスト: table-driven
                  tests が標準{"\n"}- インターフェース: 受け取る側（呼び出し元）で定義{"\n"}-
                  コンテキスト: 全関数の第1引数はctx context.Context{"\n"}- ゴルーチンリーク: defer
                  cancel()を必ず書く
                </pre>
              </div>

              <div className={`${styles.infoBox} ${styles.iTip}`}>
                <span className={styles.ii}>💡</span>
                <div>
                  <code>activation: fileMatch</code>で
                  <strong>特定ファイルを編集するときだけルールを適用</strong>
                  できます。Goファイル編集時のみGoルールを、TypeScriptファイル時のみTSルールを注入することでコンテキストを節約できます。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: SKILLS */}
        <section id="skills" className={styles.section}>
          <div className={styles.secLabel}>Section 05</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>05.</span>SKILL.md — 進歩的開示ナレッジ（最重要）
          </h2>

          <p>
            AntigravityのSkillsは
            <strong className={styles.strongBright}>
              「Progressive Disclosure（進歩的開示）」
            </strong>
            という設計思想に基づきます。全てのナレッジをコンテキストに常時注入するのではなく、
            <strong>エージェントがユーザーの意図を検知したときのみ対応するスキルをロード</strong>
            する仕組みです。これによりコンテキスト消費を最小化し、応答速度と精度を向上させます。
          </p>

          <div className={styles.fileCard}>
            <div className={styles.fcHeader}>
              <div className={`${styles.fcIcon} ${styles.fcIconGreen}`}>🎓</div>
              <div>
                <div className={styles.fcName}>SKILL.md</div>
                <div className={styles.fcPath}>.agent/skills/&lt;skill-name&gt;/SKILL.md</div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <h3>スキルディレクトリ構造</h3>
              <div className={styles.codeBlock}>
                <div className={styles.cbHeader}>
                  <span>スキルの標準ディレクトリ構造</span>
                </div>
                <pre className={styles.pre}>
                  {`.agent/skills/\n└── db-migration/\n    ├── SKILL.md        `}
                  <span className={styles.cmt}># 必須: メタデータ + 指示（スキルの「脳」）</span>
                  {`\n    ├── scripts/        `}
                  <span className={styles.cmt}># 任意: Python/Bash/Goスクリプト</span>
                  {`\n    │   └── run_migration.py\n    ├── references/     `}
                  <span className={styles.cmt}># 任意: ドキュメント・テンプレート</span>
                  {`\n    │   └── migration-spec.md\n    └── assets/         `}
                  <span className={styles.cmt}># 任意: 静的ファイル</span>
                </pre>
              </div>

              <h3>SKILL.mdの完全テンプレート</h3>
              <div className={styles.codeBlock}>
                <div className={styles.cbHeader}>
                  <CodeDots />
                  <span>.agent/skills/db-migration/SKILL.md</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}>---</span>
                  {"\n"}
                  <span className={styles.str}>name: db-migration</span>
                  {"\n"}
                  <span className={styles.cmt}># ↑ スキルの一意識別子（ハイフン区切り）</span>
                  {"\n"}
                  <span className={styles.str}>
                    {`description: >\n  Executes database schema migrations for PostgreSQL using the\n  project's standard migration protocol. Use when the user asks\n  to add tables, columns, indexes, or modify the DB schema.`}
                  </span>
                  {"\n"}
                  <span className={styles.cmt}>
                    {`# ↑ 【最重要】意味的トリガーフレーズ。\n#   「いつ使うか」を具体的に書くほど精度が上がる`}
                  </span>
                  {"\n"}
                  <span className={styles.hd}>---</span>
                  {"\n\n"}
                  <span className={styles.hd}># Database Migration Skill</span>
                  {"\n\n"}
                  <span className={styles.hd}>## Goal</span>
                  {"\n"}
                  PostgreSQLスキーマ変更を、プロジェクト標準のマイグレーション{"\n"}
                  プロトコルに従って安全に実行する。{"\n\n"}
                  <span className={styles.hd}>## Instructions</span>
                  {"\n"}
                  1. `migrations/`配下に `YYYYMMDD_HHMMSS_description.up.sql` を作成{"\n"}
                  2. ロールバック用 `.down.sql` を必ず同時に作成{"\n"}
                  3. スクリプトで整合性チェックを実行:{"\n"}
                  {"   "}`python scripts/run_migration.py --check --env staging`{"\n"}
                  4. レビュー後に適用: `python scripts/run_migration.py --apply`{"\n"}
                  5. 完了後にtasks.mdの該当タスクをチェック済みにする{"\n\n"}
                  <span className={styles.hd}>## Examples</span>
                  {"\n"}
                  <span className={styles.cmt}>
                    # Few-shot examples でエージェントの精度を向上させる
                  </span>
                  {"\n\n"}
                  **Input**: &quot;usersテーブルにlast_login_atカラムを追加して&quot;{"\n"}
                  **Output**:{"\n"}
                  ```sql{"\n"}
                  -- 20250118_143022_add_last_login_at_to_users.up.sql{"\n"}
                  ALTER TABLE users ADD COLUMN last_login_at TIMESTAMPTZ;{"\n"}
                  CREATE INDEX idx_users_last_login ON users(last_login_at);{"\n"}
                  ```{"\n\n"}
                  <span className={styles.hd}>## Constraints</span>
                  {"\n"}- 既存マイグレーションファイルを絶対に編集しない{"\n"}-
                  NULL制約の後付けはデータ移行計画なしに行わない{"\n"}-
                  本番環境への直接適用は人間の承認が必要{"\n"}- `DROP TABLE`
                  は人間確認なしに実行禁止
                </pre>
              </div>

              <h3>5つのスキルパターン</h3>
              <div className={styles.patternGrid}>
                <div className={`${styles.patternCard} ${styles.pcB}`}>
                  <div className={styles.patternNum}>01</div>
                  <h4>Basic Router</h4>
                  <p>SKILL.mdのみ。指示と制約をテキストで記述。最もシンプル。</p>
                  <div className={styles.pcStruct}>SKILL.md only</div>
                </div>
                <div className={`${styles.patternCard} ${styles.pcG}`}>
                  <div className={styles.patternNum}>02</div>
                  <h4>Reference Pattern</h4>
                  <p>references/にドキュメントを置き、SKILL.mdから参照。静的知識の拡張。</p>
                  <div className={styles.pcStruct}>SKILL.md + references/</div>
                </div>
                <div className={`${styles.patternCard} ${styles.pcY}`}>
                  <div className={styles.patternNum}>03</div>
                  <h4>Few-shot Pattern</h4>
                  <p>examples/にInput/Outputのペアを複数用意。精度の向上。</p>
                  <div className={styles.pcStruct}>SKILL.md + examples/</div>
                </div>
                <div className={`${styles.patternCard} ${styles.pcR}`}>
                  <div className={styles.patternNum}>04</div>
                  <h4>Tool Use Pattern</h4>
                  <p>scripts/に実行可能なスクリプトを置く。LLMが苦手な計算・DB操作を外出し。</p>
                  <div className={styles.pcStruct}>SKILL.md + scripts/</div>
                </div>
                <div className={`${styles.patternCard} ${styles.pcP}`}>
                  <div className={styles.patternNum}>05</div>
                  <h4>All-in-One Pattern</h4>
                  <p>全ディレクトリを組み合わせた最強パターン。複雑な業務ロジックに対応。</p>
                  <div className={styles.pcStruct}>SKILL.md + all dirs</div>
                </div>
              </div>

              <h3>グローバルvs.ワークスペーススキル</h3>
              <div className={styles.grid2}>
                <div className={styles.miniCard}>
                  <div className={styles.mcTag}>🌐 グローバルスキル</div>
                  <p>
                    ~/.gemini/antigravity/skills/（Antigravity IDE）
                    <br />
                    ~/.gemini/skills/（Gemini CLI）
                    <br />
                    「JSON整形」「UUID生成」「コードレビュー」など、全プロジェクトで使う汎用スキル。GitHubからスキルセットをクローンして配置可能。
                  </p>
                </div>
                <div className={styles.miniCard}>
                  <div className={styles.mcTag}>📁 ワークスペーススキル</div>
                  <p>
                    &lt;project&gt;/.agent/skills/
                    <br />
                    「このプロジェクトのデプロイ手順」「社内フレームワークのボイラープレート生成」など、プロジェクト固有のスキル。チームでgit管理。
                  </p>
                </div>
              </div>

              <div className={`${styles.infoBox} ${styles.iCrit}`}>
                <span className={styles.ii}>🔑</span>
                <div>
                  <strong>descriptionが命</strong>:{" "}
                  SKILL.mdのdescriptionフィールドはエージェントが「いつこのスキルを使うか」を判断するための
                  <strong>意味的トリガー</strong>です。「Executes read-only SQL queries to retrieve
                  user data for
                  debugging」のように「何を・いつ・なぜ」を具体的に書くほど精度が向上します。曖昧なdescriptionはスキルが全く呼ばれないか、誤った状況で呼ばれる原因になります（[11]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: WORKFLOWS */}
        <section id="workflows" className={styles.section}>
          <div className={styles.secLabel}>Section 06</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>06.</span>Workflows (.agent/workflows/) — 能動的手順書
          </h2>

          <p>
            <strong className={styles.strongBright}>
              WorkflowsはRulesの「受動的制約」とは対照的な「能動的手順書」
            </strong>
            です。<code>/workflow-name</code>{" "}
            のようにスラッシュコマンドでトリガーし、エージェントが定義された手順を順番に実行します。繰り返し実施するタスク（デプロイ・レビュー・リリースノート作成等）を自動化するのに最適です。
          </p>

          <div className={styles.fileCard}>
            <div className={styles.fcHeader}>
              <div className={`${styles.fcIcon} ${styles.fcIconRed}`}>⚡</div>
              <div>
                <div className={styles.fcName}>Workflow Files</div>
                <div className={styles.fcPath}>.agent/workflows/*.md</div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <div className={styles.codeBlock}>
                <div className={styles.cbHeader}>
                  <CodeDots />
                  <span>.agent/workflows/deploy.md — /deployコマンド</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}># Deploy Workflow</span>
                  {"\n"}
                  <span className={styles.cmt}>
                    # トリガー: `/deploy` と入力するとエージェントがこの手順を実行
                  </span>
                  {"\n\n"}
                  <span className={styles.hd}>## 引数</span>
                  {"\n"}- `$ENV`: ターゲット環境 (staging | production){"\n\n"}
                  <span className={styles.hd}>## 手順</span>
                  {"\n"}
                  1. `git status` でコミット漏れがないことを確認する{"\n"}
                  2. テストを全件実行: `go test ./... -race`{"\n"}
                  3. テストが失敗した場合は即座に停止してユーザーに報告する{"\n"}
                  4. Dockerイメージをビルド: `docker build -t app:$(git rev-parse --short HEAD) .`
                  {"\n"}
                  5. イメージをプッシュ: `docker push gcr.io/myproject/app:$(git rev-parse --short
                  HEAD)`{"\n"}
                  6. $ENV環境にデプロイ:{"\n"}
                  {"   "}- staging: `kubectl apply -f k8s/staging.yaml`{"\n"}
                  {"   "}- production: ユーザーに確認を求めてから実行{"\n"}
                  7. ヘルスチェックエンドポイントを確認: `curl https://$ENV.myapp.com/health`{"\n"}
                  8. Artifacts（デプロイサマリー）を生成してユーザーに提示する
                </pre>
              </div>

              <div className={styles.codeBlock}>
                <div className={styles.cbHeader}>
                  <CodeDots />
                  <span>.agent/workflows/review.md — /reviewコマンド</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}># Code Review Workflow</span>
                  {"\n\n"}
                  <span className={styles.hd}>## 手順</span>
                  {"\n"}
                  1. `git diff main` で変更差分を取得する{"\n"}
                  2. 以下の観点でコードレビューを実施:{"\n"}
                  {"   "}- セキュリティ: SQLインジェクション・XSS・認証漏れ{"\n"}
                  {"   "}- パフォーマンス: N+1クエリ・不要なアロケーション{"\n"}
                  {"   "}- 設計: SRPの遵守・依存方向・インターフェース設計{"\n"}
                  {"   "}- テスト: エッジケースのカバレッジ{"\n"}
                  3. 問題があれば重大度(P0/P1/P2)付きでリストアップ{"\n"}
                  4. `docs/tasks.md` に未対応課題として追記する{"\n"}
                  5. Implementation Artifactとしてレビュー結果を出力
                </pre>
              </div>

              <h3>ワークフローのチェーン化</h3>
              <div className={`${styles.infoBox} ${styles.iTip}`}>
                <span className={styles.ii}>💡</span>
                <div>
                  ワークフロー内から別のワークフローを呼び出すことができます（
                  <strong>チェーン化</strong>）。例: &quot;Ship Feature&quot;ワークフローの中で
                  <code>/review</code>を呼び出し、通過したら<code>/deploy staging</code>
                  を実行する構成が可能です（[15]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: CONTEXT / KNOWLEDGE BASE */}
        <section id="context" className={styles.section}>
          <div className={styles.secLabel}>Section 07</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>07.</span>Knowledge Base (.context/) — 自動注入コンテキスト
          </h2>

          <p>
            Antigravityのもう一つの強力な機能が
            <strong className={styles.strongBright}>Knowledge Base（ナレッジベース）</strong>
            です。エージェントが作業を通じて学習したパターン・プロジェクト固有の慣習・重要な洞察を
            <code>.context/</code>
            配下のMarkdownファイルに保存し、次セッションで自動的に参照します。
          </p>

          <div className={styles.fileCard}>
            <div className={styles.fcHeader}>
              <div className={`${styles.fcIcon} ${styles.fcIconCyan}`}>🧠</div>
              <div>
                <div className={styles.fcName}>Knowledge Base</div>
                <div className={styles.fcPath}>.context/*.md</div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <div className={styles.grid3}>
                <div className={styles.miniCard}>
                  <div className={styles.mcTag}>🤖 自動更新</div>
                  <p>
                    エージェントが作業中に「有用なパターン」を発見すると自動的にナレッジベースに追記。Claude
                    CodeのMEMORY.mdに相当。
                  </p>
                </div>
                <div className={styles.miniCard}>
                  <div className={styles.mcTag}>✍️ 手動追加も可</div>
                  <p>
                    人間が直接<code>.context/</code>
                    配下にMarkdownファイルを作成・編集できる。特定の知識を確実に記録したい場合に使用。
                  </p>
                </div>
                <div className={styles.miniCard}>
                  <div className={styles.mcTag}>📊 セマンティック検索</div>
                  <p>
                    ナレッジベースはベクター埋め込みで検索されるため、「DB」に関するタスクで自動的にapi-conventions.mdが参照される。
                  </p>
                </div>
              </div>

              <div className={styles.codeBlock}>
                <div className={styles.cbHeader}>
                  <CodeDots />
                  <span>.context/architecture.md — アーキテクチャコンテキスト</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}># System Architecture Context</span>
                  {"\n"}
                  <span className={styles.cmt}>
                    # このファイルはエージェントと人間が共同で保守する
                  </span>
                  {"\n\n"}
                  <span className={styles.hd}>## Current Stack</span>
                  {"\n"}- Backend: Go 1.23 + gRPC{"\n"}- Frontend: Next.js 15 (App Router){"\n"}-
                  DB: PostgreSQL 16 + Redis 8 (Valkey互換){"\n"}- Infra: GKE + Cloud Run + Cloud SQL
                  {"\n\n"}
                  <span className={styles.hd}>## Key Architectural Decisions</span>
                  {"\n"}- サービス間通信はgRPCのみ（REST APIはクライアント向けのみ）{"\n"}-
                  DBコネクションプールはpgx v5を使用（database/sqlではない）{"\n"}-
                  キャッシュキーの命名規則: `{`{service}:{entity}:{id}`}`{"\n\n"}
                  <span className={styles.hd}>## Known Gotchas</span>
                  {"\n"}
                  <span className={styles.cmt}># エージェントが発見した落とし穴を自動記録</span>
                  {"\n"}- Cloud SQLのUnix socket接続は/cloudsql/{`{conn-name}`}を使う{"\n"}-
                  gRPCのDeadlineはcontext経由で伝播させること（直接設定禁止）{"\n"}- Cloud RunのCOLD
                  START: 初回リクエストで500ms遅延が発生する
                </pre>
              </div>

              <div className={`${styles.infoBox} ${styles.iNote}`}>
                <span className={styles.ii}>ℹ️</span>
                <div>
                  ナレッジベースは<code>product-guidelines.md</code>
                  のような重厚なファイルを人間が手動で維持する必要を
                  <strong>大幅に削減</strong>
                  します。エージェントが自律的に学習・記録するため「コードとドキュメントの乖離」問題が軽減されます（[13]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: ARTIFACTS */}
        <section id="artifacts" className={styles.section}>
          <div className={styles.secLabel}>Section 08</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>08.</span>Artifacts — エージェント自動生成マークダウン
          </h2>

          <p>
            AntigravityのArtifactsは、
            <strong className={styles.strongBright}>
              エージェントが自律的に作業を進める際の「信頼の証拠」
            </strong>
            として機能します。「エージェントが何をしたか・なぜそう判断したか」をMarkdownや画像・動画で可視化することで「Trust
            Gap」を埋めます。SDDの文脈では
            <strong>人間がレビューすべきゲートポイント</strong>として重要です。
          </p>

          <div className={styles.artifactRow}>
            <div className={styles.artCard}>
              <span className={styles.artIcon}>📋</span>
              <div className={styles.artName}>Task List</div>
              <div className={styles.artDesc}>
                エージェントがコードを書く前に生成する構造化計画。Research → Implementation →
                Verification のフェーズを明示。
              </div>
              <div className={styles.artAuto}>✦ 自動生成</div>
            </div>
            <div className={styles.artCard}>
              <span className={styles.artIcon}>🏛</span>
              <div className={styles.artName}>Implementation Plan</div>
              <div className={styles.artDesc}>
                コードベースへの変更を事前に詳述する技術設計書。どのファイルをなぜ変更するかを人間がレビュー可能な形式で提示。
              </div>
              <div className={styles.artAuto}>✦ 自動生成</div>
            </div>
            <div className={styles.artCard}>
              <span className={styles.artIcon}>📊</span>
              <div className={styles.artName}>Walkthrough</div>
              <div className={styles.artDesc}>
                完了した変更のサマリー。変更ファイル一覧・主要な設計判断の理由・テスト結果を含む。
              </div>
              <div className={styles.artAuto}>✦ 自動生成</div>
            </div>
            <div className={styles.artCard}>
              <span className={styles.artIcon}>📸</span>
              <div className={styles.artName}>Screenshots</div>
              <div className={styles.artDesc}>
                Browser Subagentが撮影したUIの視覚的エビデンス。フロントエンド変更の検証に使用。
              </div>
              <div className={styles.artAuto}>✦ Browser Agent自動撮影</div>
            </div>
            <div className={styles.artCard}>
              <span className={styles.artIcon}>🎬</span>
              <div className={styles.artName}>Browser Recordings</div>
              <div className={styles.artDesc}>
                UI操作のビデオ録画。E2Eフローの証明として機能。人間がレビュー後にフィードバックをインラインコメントで残せる。
              </div>
              <div className={styles.artAuto}>✦ Browser Agent自動録画</div>
            </div>
          </div>

          <div className={`${styles.infoBox} ${styles.iWarn}`}>
            <span className={styles.ii}>⚠️</span>
            <div>
              <strong>SDD最重要原則: Artifactを読め</strong>
              <br />
              多くのユーザーがTask ListやImplementation
              Planを「なんとなく承認」してコーディング速度を上げようとします。しかしSDDではここが
              <strong>最重要レビューポイント</strong>
              です。「コードは後で直せる。設計の誤りは高くつく」—
              Artifactを厳密に検査することがバグを未然に防ぐ最善策です（[15]）。
            </div>
          </div>
        </section>

        {/* SECTION 9: SDD SPEC FILES */}
        <section id="sdd" className={styles.section}>
          <div className={styles.secLabel}>Section 09</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>09.</span>SDD仕様書群 (docs/) — Antigravity特有の活用法
          </h2>

          <p>
            AntigravityのSDD（仕様駆動開発）では、
            <strong className={styles.strongBright}>
              spec.md / requirements.md / design.md / tasks.md
              を「エージェントがArtifactを生成する基礎資料」として活用
            </strong>
            します。エージェントが自律的にImplementation
            Planを作成するためにこれらのファイルを自動参照します。
          </p>

          <div className={styles.fileCard}>
            <div className={styles.fcHeader}>
              <div className={`${styles.fcIcon} ${styles.fcIconYellow}`}>📚</div>
              <div>
                <div className={styles.fcName}>SDD仕様書群</div>
                <div className={styles.fcPath}>docs/ — Antigravity Agent が自動参照</div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <h3>Antigravity流SDDの特徴: 「Rulesで仕様書を自動参照させる」</h3>
              <div className={styles.codeBlock}>
                <div className={styles.cbHeader}>
                  <CodeDots />
                  <span>.agent/rules/always-on.md（仕様書参照ルール追加）</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}>## Spec-Driven Development Rules</span>
                  {"\n"}
                  <span className={styles.cmt}># Rulesに仕様書の存在と読み込み順序を明示</span>
                  {"\n\n"}
                  新機能を実装する前に必ず以下を確認すること:{"\n"}
                  1. `docs/spec.md` でプロダクトのスコープを確認{"\n"}
                  2. `docs/requirements.md` で対象機能の要件を確認{"\n"}
                  3. `docs/design.md` でアーキテクチャ制約を確認{"\n"}
                  4. `docs/tasks.md` で依存タスクが完了済みか確認{"\n\n"}
                  実装後は `docs/tasks.md` の対象タスクをチェック済みにすること。{"\n"}
                  仕様書と実装が乖離した場合は、人間に確認を求めること。
                </pre>
              </div>

              <div className={styles.codeBlock}>
                <div className={styles.cbHeader}>
                  <CodeDots />
                  <span>docs/tasks.md — マルチエージェント対応版</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}># タスクリスト（Agent Manager対応）</span>
                  {"\n\n"}
                  <span className={styles.hd}>## 🟢 Phase 1: 認証基盤（Agent A担当）</span>
                  {"\n"}- [x] Task 1.1: JWTミドルウェア実装{"\n"}- [x] Task 1.2: /users/register
                  エンドポイント + テスト{"\n"}- [ ] Task 1.3: OAuth2 Google連携{"\n\n"}
                  <span className={styles.hd}>
                    ## 🔵 Phase 2: 商品管理API（Agent B担当・並列可）
                  </span>
                  {"\n"}- [ ] Task 2.1: 商品CRUD エンドポイント{"\n"}- [ ] Task 2.2:
                  画像アップロード（Cloud Storage）{"\n"}- [ ] Task 2.3: 在庫管理ロジック{"\n\n"}
                  <span className={styles.hd}>## 🔴 Phase 3: 決済（Phase 1完了後）</span>
                  {"\n"}- [ ] Task 3.1: Stripe SDK統合（依存: Task 1.2）{"\n"}- [ ] Task 3.2:
                  Webhook受信処理{"\n\n"}
                  <span className={styles.hd}>## 📋 Artifacts Log</span>
                  {"\n"}
                  <span className={styles.cmt}>
                    # エージェントが生成したArtifactへのリンクを記録
                  </span>
                  {"\n"}- Task 1.1: Implementation Plan → artifacts/task-1-1-plan.md{"\n"}- Task
                  1.2: Walkthrough → artifacts/task-1-2-walkthrough.md
                </pre>
              </div>

              <div className={`${styles.infoBox} ${styles.iTip}`}>
                <span className={styles.ii}>💡</span>
                <div>
                  <strong>Antigravity固有の強み: マルチエージェント並列タスク</strong>
                  <br />
                  tasks.mdでPhase 1とPhase 2の依存関係を明示することで、Agent Managerが
                  <strong>Phase 1をAgent Aに、Phase 2をAgent Bに並列割り当て</strong>
                  できます。Claude Codeにはないアンチグラビティ固有の強力な機能です（[2]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: BEST PRACTICES */}
        <section id="best-practices" className={styles.section}>
          <div className={styles.secLabel}>Section 10</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>10.</span>横断ベストプラクティス 10則
          </h2>

          <div className={styles.principles}>
            <div className={`${styles.principle} ${styles.pB}`}>
              <div className={styles.pnum}>01</div>
              <h4>descriptionがSKILL.mdの命</h4>
              <p>
                意味的トリガーとして機能するdescriptionを徹底的に具体化。「何を・いつ・なぜ」を英語で記述すると精度が向上する。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pG}`}>
              <div className={styles.pnum}>02</div>
              <h4>Rules ≠ SKILL.md: 用途を厳守</h4>
              <p>
                「常に守るルール」はRules、「特定タスクの知識」はSKILL.md。混在するとコンテキスト汚染が発生する。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pY}`}>
              <div className={styles.pnum}>03</div>
              <h4>Artifactレビューを省略しない</h4>
              <p>
                Task ListとImplementation
                Planは必ずレビュー。ここで設計ミスを検出することがバグコスト最小化の鍵。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pR}`}>
              <div className={styles.pnum}>04</div>
              <h4>fileMatchで言語別ルールを分離</h4>
              <p>
                activation:
                fileMatchを使い、Go/TS/Pythonなど言語別にルールを切り替え。全言語に共通ルールを書かない。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pP}`}>
              <div className={styles.pnum}>05</div>
              <h4>Global vs Workspace の使い分け</h4>
              <p>
                汎用スキル（JSON整形・git
                commit等）はグローバル。プロジェクト固有（内製フレームワーク等）はワークスペース。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pC}`}>
              <div className={styles.pnum}>06</div>
              <h4>tasks.mdに並列情報を明示</h4>
              <p>
                「Agent A担当」「Agent B担当（並列可）」を記述することでAgent
                Managerが最適にタスクを分配できる。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pB}`}>
              <div className={styles.pnum}>07</div>
              <h4>.context/でspec乖離を防ぐ</h4>
              <p>
                Known GotchasをKnowledge
                Baseに記録。エージェントが同じ過ちを繰り返すことを防ぎ、ドキュメントの自動進化を促す。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pG}`}>
              <div className={styles.pnum}>08</div>
              <h4>Workflowsで繰り返しを撲滅</h4>
              <p>
                毎回同じ手順を口頭で指示するものはWorkflowに書く。/deploy、/review、/release-notes
                を整備する。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pY}`}>
              <div className={styles.pnum}>09</div>
              <h4>少数精鋭のスキルから始める</h4>
              <p>
                スキルは5〜10個から始め、実際に使われたものを磨く。使われないスキルはdescriptionを改善するか削除する。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pR}`}>
              <div className={styles.pnum}>10</div>
              <h4>Rulesは「Why」を書く</h4>
              <p>
                「ORM使用禁止」だけでなく「なぜ禁止か（パフォーマンス測定で20x遅延を確認したため）」を書くとエージェントの判断精度が上がる。
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 11: SOURCES */}
        <section id="sources" className={styles.section}>
          <div className={styles.sources}>
            <h3>📚 参考ソース一覧（公式・二次情報を含む）</h3>
            {SOURCES.map((s) => (
              <div key={s.num} className={styles.src}>
                <span className={styles.snum}>{s.num}</span>
                <div>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.title}
                  </a>
                  <span className={styles.sdesc}>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
