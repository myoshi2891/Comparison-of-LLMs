import type { Metadata } from "next";
import styles from "./page.module.css";
import CodeCopyButton from "@/components/docs/CodeCopyButton";
import MermaidDiagram from "@/components/docs/MermaidDiagram";

export const metadata: Metadata = {
  title: "GitHub Copilot Code Review — 完全活用ガイド",
  description:
    "AI駆動のコードレビューをチーム開発に深く組み込む——概念・設定・運用まで中〜上級者向けにステップバイステップで解説",
};

// 外部リンク用ヘルパー
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

// Mermaid ダイアグラムの定義
const DIAG_ARCH = `flowchart LR
PR[Pull Request / Local Changes]
subgraph Copilot["GitHub Copilot Code Review Engine"]
direction TB
CTX["Full Project Context Gathering"]
MODEL["Purpose-Built Model Mix"]
CI["Custom Instructions Parser"]
CTX --> MODEL
CI --> MODEL
end
PR --> Copilot
Copilot --> COM["Review Comments + Suggested Fixes"]
COM --> DEV[Developer]
COM --> AGT["Copilot Cloud Agent - Public Preview"]
AGT --> FIXPR["Fix PR Auto-generated"]
DEV -->|Thumbs up/down| FB[Feedback Loop]`;

const DIAG_SETUP = `flowchart TD
A["Org Admin として GitHub.com にログイン"] --> B["Organization Settings へ移動"]
B --> C["Copilot - Policies タブ"]
C --> D{"コードレビューを有効化"}
D -->|有効化| E["Copilot code review トグル ON"]
E --> F{"ライセンスなしメンバーにも提供?"}
F -->|Yes| G["Premium request paid usage を先に有効化"]
G --> H["Allow members without a Copilot license ポリシー有効化"]
H --> I["対象リポジトリを明示指定"]
F -->|No| J["設定完了"]
I --> J`;

const DIAG_CONTEXT = `flowchart LR
subgraph GA["Full Project Context Gathering - GA"]
DIFF["PR diff"] --> ANALYZER["Repository Analyzer via GitHub Actions"]
REPO["Entire Repository Codebase"] --> ANALYZER
ANALYZER --> CONTEXT["Rich Context Object"]
end
subgraph PREVIEW["Cloud Agent Integration - Preview"]
REVIEW_COM["Review Comment + Suggestion"] --> IMPL["Implement Suggestion ボタン"]
IMPL --> DRAFT["Draft Comment on PR"]
DRAFT --> AGENT["Copilot Cloud Agent"]
AGENT --> FIXPR["New Fix PR against your branch"]
end
CONTEXT --> REVIEW_COM`;

const DIAG_AUTO = `flowchart TD
A["自動レビュー設定を開始"] --> B{"対象スコープ"}
B -->|個人 Pro/Pro+| C["GitHub Settings - Copilot - Code review - Enable for your PRs"]
B -->|リポジトリ| D["Repo Settings - Copilot - Automatic code review"]
B -->|組織| E["Org Settings - Copilot Policies - Automatic code review"]
C --> F["トリガー条件選択: Basic / New pushes / Draft PRs"]
D --> F
E --> G["対象リポジトリを選択: 全て / 特定リポジトリ"]
G --> F
F --> H["保存 - 有効化完了"]`;

const DIAG_QUOTA = `flowchart LR
A["月次クォータ超過"] --> B{"対応選択"}
B -->|短期| C["クォータリセットを待つ"]
B -->|継続利用| D["プランのアップグレード"]
B -->|追加購入| E["Additional Premium Requests を有効化"]
D --> F["レビュー継続"]
E --> F
C --> G["リセット後に再開"]`;

const DIAG_ROLE = `flowchart TD
PR["Pull Request 作成"] --> COPILOT["Copilot Code Review (自動 or 手動トリガー)"]
COPILOT --> FIX1["明確な修正提案 - Apply"]
COPILOT --> SKIP["判断困難 - スキップ"]
FIX1 --> HUMAN["Human Review"]
SKIP --> HUMAN
HUMAN --> ARCH["アーキテクチャ判断 / ビジネスロジック検証 / パフォーマンス要件確認"]
ARCH --> APPROVE["Approve / Request Changes"]
APPROVE --> MERGE["Merge"]`;

export default function Page() {
  return (
    <div className={styles.pageContainer}>
      {/* NAVBAR */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <a href="#" className={styles.navBrand}>
            Copilot CR Guide
          </a>
          <a href="#ch1">01 概要</a>
          <a href="#ch2">02 可用性</a>
          <a href="#ch3">03 セットアップ</a>
          <a href="#ch4">04 基本操作</a>
          <a href="#ch5">05 Custom Instructions</a>
          <a href="#ch6">06 Agentic機能</a>
          <a href="#ch7">07 自動レビュー</a>
          <a href="#ch8">08 クォータ/課金</a>
          <a href="#ch9">09 Enterprise</a>
          <a href="#ch10">10 ベストプラクティス</a>
          <a href="#refs">参考文献</a>
        </div>
      </nav>

      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroBadge}>K-Level: Intermediate → Advanced</div>
        <h1 className={styles.heroTitle}>
          GitHub Copilot
          <br />
          Code Review 完全活用ガイド
        </h1>
        <p className={styles.heroSub}>
          AI駆動のコードレビューをチーム開発に深く組み込む——概念・設定・運用まで中〜上級者向けにステップバイステップで解説
        </p>
        <div className={styles.heroMeta}>
          <span className={styles.metaChip}>
            更新: <span>2025年6月</span>
          </span>
          <span className={styles.metaChip}>
            一次情報源: <span>docs.github.com</span>
          </span>
          <span className={styles.metaChip}>
            対象: <span>Pro / Business / Enterprise</span>
          </span>
          <span className={styles.metaChip}>
            K-Level: <span>300–400</span>
          </span>
        </div>
      </div>

      <div className={styles.container}>
        {/* TOC */}
        <section className={styles.chapter} id="toc">
          <h3
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              fontFamily: "var(--font-mono)",
              marginBottom: "0.9rem",
            }}
          >
            — 目次 —
          </h3>
          <div className={styles.tocGrid}>
            <a href="#ch1" className={styles.tocCard}>
              <span className={styles.tocIcon}>🔍</span>01 概要・アーキテクチャ
            </a>
            <a href="#ch2" className={styles.tocCard}>
              <span className={styles.tocIcon}>🗺</span>02 可用性・プラン比較
            </a>
            <a href="#ch3" className={styles.tocCard}>
              <span className={styles.tocIcon}>⚙️</span>03 初期セットアップ
            </a>
            <a href="#ch4" className={styles.tocCard}>
              <span className={styles.tocIcon}>▶️</span>04 基本操作（全環境）
            </a>
            <a href="#ch5" className={styles.tocCard}>
              <span className={styles.tocIcon}>📝</span>05 Custom Instructions
            </a>
            <a href="#ch6" className={styles.tocCard}>
              <span className={styles.tocIcon}>🤖</span>06 Agentic 機能
            </a>
            <a href="#ch7" className={styles.tocCard}>
              <span className={styles.tocIcon}>⚡</span>07 自動レビュー設定
            </a>
            <a href="#ch8" className={styles.tocCard}>
              <span className={styles.tocIcon}>💰</span>08 クォータ・課金管理
            </a>
            <a href="#ch9" className={styles.tocCard}>
              <span className={styles.tocIcon}>🏢</span>09 Enterprise 管理
            </a>
            <a href="#ch10" className={styles.tocCard}>
              <span className={styles.tocIcon}>🏆</span>10 ベストプラクティス
            </a>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* CH1 */}
        <section className={styles.chapter} id="ch1">
          <div className={styles.chapterHeader}>
            <span className={styles.chapterNum}>CH-01</span>
            <h2>概要・アーキテクチャ</h2>
          </div>

          <h3 className={styles.sectionTitle}>1.1 定義</h3>
          <p className={styles.paragraph}>
            <strong>GitHub Copilot Code Review</strong> は、Pull
            Request（PR）内のコード変更を自動的に解析し、マルチアングルで問題を検出して修正案を提示する
            AI エージェントです。すべての主要プログラミング言語に対応し、「Comment」レビューとして PR
            に投稿します。
          </p>

          <h3 className={styles.sectionTitle}>1.2 なぜ重要か</h3>
          <p className={styles.paragraph}>
            コードレビューはソフトウェア品質の要ですが、人間のレビュアーはボトルネックになりがちです。Copilot
            Code Review
            は最初の品質フィルタとして機能し、レビュアーが本質的な設計判断に集中できる環境を作ります。
          </p>

          <div className={styles.metricGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>&lt;30s</span>
              <div className={styles.metricLabel}>標準レビュー完了時間</div>
            </div>
            <div className={`${styles.metricCard}`}>
              <span className={`${styles.metricVal} ${styles.cyan}`}>All</span>
              <div className={styles.metricLabel}>対応言語（言語問わず）</div>
            </div>
            <div className={styles.metricCard}>
              <span className={`${styles.metricVal} ${styles.purple}`}>7+</span>
              <div className={styles.metricLabel}>対応開発環境</div>
            </div>
            <div className={styles.metricCard}>
              <span className={`${styles.metricVal} ${styles.amber}`}>4KB</span>
              <div className={styles.metricLabel}>Custom Instructions 最大読み取り</div>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>1.3 アーキテクチャ概観</h3>

          <div className={styles.mermaidWrap}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <MermaidDiagram chart={DIAG_ARCH} />
            </div>
          </div>

          <div className={styles.archLayers}>
            <div className={styles.archLayer}>
              <span className={styles.archLabel}>Input Layer</span>
              <span className={styles.archDesc}>
                PR diff、ファイル差分、コメント、ベースブランチの Custom Instructions
              </span>
            </div>
            <div className={`${styles.archLayer} ${styles.cyan}`}>
              <span className={styles.archLabel}>Context Layer</span>
              <span className={styles.archDesc}>
                Full Project Context Gathering — リポジトリ全体を解析してコード変更の意図を把握
              </span>
            </div>
            <div className={`${styles.archLayer} ${styles.purple}`}>
              <span className={styles.archLabel}>Reasoning Layer</span>
              <span className={styles.archDesc}>
                専用チューニングされたモデル群 — モデル切替不可（品質・一貫性保証のため）
              </span>
            </div>
            <div className={`${styles.archLayer} ${styles.amber}`}>
              <span className={styles.archLabel}>Output Layer</span>
              <span className={styles.archDesc}>
                「Comment」レビュー（Approve/Request Changes ではない）、Suggested Changes
              </span>
            </div>
            <div className={`${styles.archLayer} ${styles.blue}`}>
              <span className={styles.archLabel}>Agentic Layer</span>
              <span className={styles.archDesc}>
                ★ Preview: Cloud Agent 連携による Fix PR 自動生成、Actions runners 使用
              </span>
            </div>
          </div>

          <div className={`${styles.callout} ${styles.info}`}>
            <strong>📌 重要な設計上の制約</strong>
            Copilot Code Review は
            <em>必ず</em>「Comment」レビューを投稿します。「Approve」や「Request
            Changes」は行いません。そのため、必須承認者数のカウントには含まれず、マージをブロックしません。
          </div>
        </section>

        <hr className={styles.divider} />

        {/* CH2 */}
        <section className={styles.chapter} id="ch2">
          <div className={styles.chapterHeader}>
            <span className={`${styles.chapterNum} ${styles.cyan}`}>CH-02</span>
            <h2>可用性・プラン比較</h2>
          </div>

          <h3 className={styles.sectionTitle}>2.1 対応プラットフォーム</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>環境</th>
                  <th className={styles.th}>対応状況</th>
                  <th className={styles.th}>備考</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.td}>GitHub.com (Web)</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓ GA</span>
                  </td>
                  <td className={styles.td}>PR の Reviewers メニューから選択</td>
                </tr>
                <tr>
                  <td className={styles.td}>GitHub Mobile</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓ GA</span>
                  </td>
                  <td className={styles.td}>Reviews セクション → Request Reviews</td>
                </tr>
                <tr>
                  <td className={styles.td}>VS Code</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓ GA</span>
                  </td>
                  <td className={styles.td}>未コミット変更のローカルレビューも可能</td>
                </tr>
                <tr>
                  <td className={styles.td}>Visual Studio</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓ GA</span>
                  </td>
                  <td className={styles.td}>v17.14 以降必須。Git Changes ウィンドウから起動</td>
                </tr>
                <tr>
                  <td className={styles.td}>JetBrains IDEs</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓ GA</span>
                  </td>
                  <td className={styles.td}>Commit ウィンドウ上部の Copilot ボタン</td>
                </tr>
                <tr>
                  <td className={styles.td}>Xcode</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓ GA</span>
                  </td>
                  <td className={styles.td}>CopilotForXcode v0.41.0+、Staged/Unstaged 選択可</td>
                </tr>
                <tr>
                  <td className={styles.td}>GitHub CLI</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓ GA</span>
                  </td>
                  <td className={styles.td}>
                    <code>gh pr create --reviewer @copilot</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={styles.sectionTitle}>2.2 プラン別機能比較</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>機能</th>
                  <th className={styles.th}>Copilot Free</th>
                  <th className={styles.th}>Copilot Pro</th>
                  <th className={styles.th}>Copilot Pro+</th>
                  <th className={styles.th}>Copilot Business</th>
                  <th className={styles.th}>Copilot Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.td}>Code Review（基本）</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.td}>Full Project Context</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.td}>Cloud Agent 連携（Fix PR）</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeAmber}`}>Preview</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeAmber}`}>Preview</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeAmber}`}>Preview</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeAmber}`}>Preview</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.td}>自動レビュー（個人設定）</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.td}>Org/Repo 自動レビュー設定</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>✓</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.td}>ライセンスなしユーザー向け提供</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>要有効化</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>要有効化</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.td}>Copilot Memory</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeAmber}`}>Preview</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeAmber}`}>Preview</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>✗</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={styles.sectionTitle}>2.3 レビュー対象外ファイル</h3>
          <div className={styles.archLayers}>
            <div className={`${styles.archLayer} ${styles.red}`}>
              <span className={styles.archLabel}>除外: 依存管理</span>
              <span className={styles.archDesc}>
                package.json、Gemfile.lock、yarn.lock、package-lock.json など
              </span>
            </div>
            <div className={`${styles.archLayer} ${styles.red}`}>
              <span className={styles.archLabel}>除外: ログファイル</span>
              <span className={styles.archDesc}>*.log、*.log.* 形式のファイル</span>
            </div>
            <div className={`${styles.archLayer} ${styles.red}`}>
              <span className={styles.archLabel}>除外: SVG ファイル</span>
              <span className={styles.archDesc}>*.svg — バイナリ的なベクターデータはスキップ</span>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* CH3 */}
        <section className={styles.chapter} id="ch3">
          <div className={styles.chapterHeader}>
            <span className={`${styles.chapterNum} ${styles.purple}`}>CH-03</span>
            <h2>初期セットアップ</h2>
          </div>

          <h3 className={styles.sectionTitle}>3.1 Organization レベルの有効化フロー</h3>

          <div className={styles.mermaidWrap}>
            <div style={{ maxWidth: "450px", margin: "0 auto" }}>
              <MermaidDiagram chart={DIAG_SETUP} />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>3.2 ステップバイステップ手順</h3>
          <ul className={styles.stepList}>
            <li>
              <span className={styles.stepNum}>1</span>
              <div className={styles.stepContent}>
                <strong>プラン確認</strong>
                <br />
                Copilot Pro / Pro+ / Business / Enterprise のいずれかを保有していることを確認。Free
                プランでは Code Review は利用不可。
              </div>
            </li>
            <li>
              <span className={styles.stepNum}>2</span>
              <div className={styles.stepContent}>
                <strong>Org ポリシー有効化</strong>
                <br />
                Organization → Settings → Copilot → Policies → <em>Copilot code review</em> を Enabled
                に設定。
              </div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.cyan}`}>3</span>
              <div className={styles.stepContent}>
                <strong>Runners の設定（Agentic 機能用）</strong>
                <br />
                Full Project Context Gathering は GitHub Actions runners
                を使用。デフォルトは GitHub-hosted runners。大規模リポジトリでは Larger runners
                への移行を検討。
              </div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.cyan}`}>4</span>
              <div className={styles.stepContent}>
                <strong>コンテンツ除外の設定</strong>
                <br />
                <code>.github/copilot-instructions.md</code>
                にスキャン対象外パスを記述、または Org 設定の Content exclusion を使用。
              </div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.purple}`}>5</span>
              <div className={styles.stepContent}>
                <strong>Custom Instructions の準備</strong>
                <br />
                <code>.github/copilot-instructions.md</code>（リポジトリ全体）または{" "}
                <code>.github/instructions/**/*.instructions.md</code>（パス別）を作成。
              </div>
            </li>
          </ul>

          <div className={`${styles.callout} ${styles.warning}`}>
            <strong>⚠️ 注意: 自動レビューのトリガー条件</strong>
            自動レビューが有効な場合、GitHub Actions が無効化されている環境や Actions
            ワークフローが失敗した場合でも <em>基本レビュー</em> は生成されますが、Full Project
            Context Gathering などの Agentic 機能は動作しません。
          </div>
        </section>

        <hr className={styles.divider} />

        {/* CH4 */}
        <section className={styles.chapter} id="ch4">
          <div className={styles.chapterHeader}>
            <span className={`${styles.chapterNum} ${styles.amber}`}>CH-04</span>
            <h2>基本操作（全環境別）</h2>
          </div>

          <h3 className={styles.sectionTitle}>4.1 GitHub.com（Web）— 最も標準的な使い方</h3>
          <ul className={styles.stepList}>
            <li>
              <span className={styles.stepNum}>1</span>
              <div className={styles.stepContent}>PR を作成または既存 PR に移動する</div>
            </li>
            <li>
              <span className={styles.stepNum}>2</span>
              <div className={styles.stepContent}>
                右側の <strong>Reviewers</strong> メニューを開き <strong>Copilot</strong> を選択
              </div>
            </li>
            <li>
              <span className={styles.stepNum}>3</span>
              <div className={styles.stepContent}>通常 30 秒以内にコメントが投稿される</div>
            </li>
            <li>
              <span className={styles.stepNum}>4</span>
              <div className={styles.stepContent}>
                コメントを確認し、必要に応じて Suggested Changes を <em>Apply suggestion</em>{" "}
                ボタンで適用
              </div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.cyan}`}>5</span>
              <div className={styles.stepContent}>
                フィードバック（👍/👎）で提案品質を評価 — 製品改善に活用される
              </div>
            </li>
          </ul>

          <h3 className={styles.sectionTitle}>4.2 VS Code — ローカルレビューの活用</h3>
          <p className={styles.paragraph}>
            VS Code では PR のほかに、<em>未コミット変更のローカルレビュー</em>
            が可能です。早期フィードバックを得ることでコミット前の品質向上が図れます。
          </p>

          <div className={styles.compareGrid}>
            <div className={`${styles.compareCard} ${styles.good}`}>
              <div className={styles.compareTitle}>✅ 良い例：コミット前にローカルレビューを使う</div>
              <p
                className={styles.paragraph}
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
              >
                Source Control ビュー → CHANGES 上の 🔍 ボタン → 問題をローカルで修正してからコミット
              </p>
            </div>
            <div className={`${styles.compareCard} ${styles.bad}`}>
              <div className={styles.compareTitle}>❌ 悪い例：全変更を一括コミットしてからレビュー依頼</div>
              <p
                className={styles.paragraph}
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
              >
                差分が大きいと Copilot のコンテキストが分散し、指摘が表面的になりやすい
              </p>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>4.3 GitHub CLI — CI パイプラインへの組み込み</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>terminal</span>
              <span className={styles.codeLang}>shell</span>
              <CodeCopyButton
                className={styles.codeCopy}
                text={`# PR 作成と同時に Copilot をレビュアーに追加\ngh pr create --reviewer @copilot\n\n# 既存 PR にレビュー依頼\ngh pr edit PR-NUMBER --add-reviewer @copilot\n\n# 対話的選択（スペースキーで選択）\ngh pr create\n# → Reviewers プロンプトで "Copilot (AI)" を選択`}
              />
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.cc}># PR 作成と同時に Copilot をレビュアーに追加</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cg}>gh</span> pr create --reviewer @copilot
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.cc}># 既存 PR にレビュー依頼</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cg}>gh</span> pr edit{" "}
                <span className={styles.cv}>PR-NUMBER</span> --add-reviewer @copilot
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.cc}># 対話的選択（スペースキーで選択）</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cg}>gh</span> pr create
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cc}># → Reviewers プロンプトで "Copilot (AI)" を選択</span>
              </div>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>4.4 JetBrains IDEs</h3>
          <ul className={styles.stepList}>
            <li>
              <span className={styles.stepNum}>1</span>
              <div className={styles.stepContent}>左側パネルの <strong>Commit</strong> ツールウィンドウを開く</div>
            </li>
            <li>
              <span className={styles.stepNum}>2</span>
              <div className={styles.stepContent}>
                コミットメッセージ入力欄の上にある <strong>Copilot: Review Code Changes</strong>
                （虫眼鏡+スパークルアイコン）をクリック
              </div>
            </li>
            <li>
              <span className={styles.stepNum}>3</span>
              <div className={styles.stepContent}>コメントを確認、上下矢印で複数コメントを移動</div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.cyan}`}>4</span>
              <div className={styles.stepContent}>
                <strong>Discard</strong> ボタンで不要な提案を却下
              </div>
            </li>
          </ul>

          <h3 className={styles.sectionTitle}>4.5 Xcode</h3>
          <ul className={styles.stepList}>
            <li>
              <span className={styles.stepNum}>1</span>
              <div className={styles.stepContent}>CopilotForXcode v0.41.0+ をインストール</div>
            </li>
            <li>
              <span className={styles.stepNum}>2</span>
              <div className={styles.stepContent}>Editor → GitHub Copilot → Open Chat でチャットウィンドウを開く</div>
            </li>
            <li>
              <span className={styles.stepNum}>3</span>
              <div className={styles.stepContent}>右下の Code Review ボタン（吹き出しアイコン）をクリック</div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.cyan}`}>4</span>
              <div className={styles.stepContent}>
                <strong>Review Staged Changes</strong> または <strong>Review Unstaged Changes</strong>{" "}
                を選択
              </div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.cyan}`}>5</span>
              <div className={styles.stepContent}>レビュー対象ファイルをチェックボックスで選択 → Continue</div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.purple}`}>6</span>
              <div className={styles.stepContent}>Accept / Dismiss でインライン提案を処理</div>
            </li>
          </ul>

          <h3 className={styles.sectionTitle}>4.6 再レビューの依頼</h3>
          <div className={`${styles.callout} ${styles.info}`}>
            <strong>📌 重要: Copilot は自動で再レビューしない</strong>
            PR に変更をプッシュしても（「Review new pushes」を有効化していない限り）Copilot
            は自動で再レビューしません。Reviewers メニューの Copilot
            横の更新ボタンをクリックして手動で再依頼します。なお、再レビュー時には以前に Resolve
            済みや 👎 をつけたコメントが再び投稿されることがあります。
          </div>
        </section>

        <hr className={styles.divider} />

        {/* CH5 */}
        <section className={styles.chapter} id="ch5">
          <div className={styles.chapterHeader}>
            <span className={`${styles.chapterNum} ${styles.red}`}>CH-05</span>
            <h2>Custom Instructions による高度カスタマイズ</h2>
          </div>

          <h3 className={styles.sectionTitle}>5.1 定義と仕組み</h3>
          <p className={styles.paragraph}>
            <strong>Custom Instructions</strong>{" "}
            は、自然言語で記述したレビュー指示をリポジトリに格納することで、Copilot
            のレビュー観点・スタイル・優先事項を制御する機能です。Copilot は PR
            のベースブランチにある設定ファイルを参照します。
          </p>

          <div className={`${styles.callout} ${styles.warning}`}>
            <strong>⚠️ 制限: 最初の 4,000 文字のみ読み取り</strong>
            Custom Instructions ファイルの最初の 4,000 文字を超えた部分は Code Review
            に反映されません（Copilot Chat / Cloud Agent にはこの制限なし）。重要な指示を冒頭に配置してください。
          </div>

          <h3 className={styles.sectionTitle}>5.2 ファイル構成</h3>

          <div className={styles.archLayers}>
            <div className={styles.archLayer}>
              <span className={styles.archLabel}>リポジトリ全体</span>
              <span className={styles.archDesc}>
                <code>.github/copilot-instructions.md</code> — 全ファイルに適用
              </span>
            </div>
            <div className={`${styles.archLayer} ${styles.cyan}`}>
              <span className={styles.archLabel}>パス別指示</span>
              <span className={styles.archDesc}>
                <code>.github/instructions/**/*.instructions.md</code> — 特定パスのファイルにのみ適用
              </span>
            </div>
            <div className={`${styles.archLayer} ${styles.purple}`}>
              <span className={styles.archLabel}>Organization 指示</span>
              <span className={styles.archDesc}>
                Org Settings → Copilot で設定（Enterprise / Business のみ）
              </span>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>5.3 実践例：プロダクションレベルの Instructions</h3>

          <div className={styles.compareGrid}>
            <div className={`${styles.compareCard} ${styles.good}`}>
              <div className={styles.compareTitle}>✅ 良い例: 具体的・測定可能な指示</div>
              <div className={styles.codeWrap} style={{ marginTop: "0.6rem" }}>
                <div className={styles.codeBar}>
                  <span>.github/copilot-instructions.md</span>
                  <CodeCopyButton
                    className={styles.codeCopy}
                    text={`## Code Review Guidelines\n\n# 言語・スタイル\nReview in Japanese. Focus on security and performance. Flag O(n²) loops in data-processing code.\n\n# セキュリティ\nApply checks in /docs/security.md. Flag any SQL string concatenation.\n\n# 禁止パターン\nReject nested ternary operators. Reject console.log in production.`}
                  />
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ch}>## Code Review Guidelines</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># 言語・スタイル</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>
                      Review in Japanese. Focus on security and performance. Flag O(n²) loops in
                      data-processing code.
                    </span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># セキュリティ</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>
                      Apply checks in /docs/security.md. Flag any SQL string concatenation.
                    </span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># 禁止パターン</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>
                      Reject nested ternary operators. Reject console.log in production.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.compareCard} ${styles.bad}`}>
              <div className={styles.compareTitle}>❌ 悪い例: 曖昧・過剰な指示</div>
              <div className={styles.codeWrap} style={{ marginTop: "0.6rem" }}>
                <div className={styles.codeBar}>
                  <span>copilot-instructions-bad.md</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># 悪い例</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>
                      コードをちゃんとレビューしてください。
                      <br />
                      いい感じに書かれているか確認して。
                      <br />
                      バグがあれば教えてください。
                      <br />
                      パフォーマンスも見てください。
                      <br />
                      読みやすさも大事です。
                      <br />
                      セキュリティも注意してください。
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># → 4000 文字以内に具体的指示を入れていない</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>5.4 パス別 Instructions の応用</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>.github/instructions/api/api.instructions.md</span>
              <span className={styles.codeLang}>markdown</span>
              <CodeCopyButton
                className={styles.codeCopy}
                text={`---\napplyTo: "src/api/**"\n---\nWhen reviewing API endpoints:\n- Check for missing authentication middleware\n- Validate all inputs use zod schemas\n- Ensure error responses follow RFC 7807\n- Flag any endpoint exposing stack traces`}
              />
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.cs}>---</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>applyTo</span>: <span className={styles.cs}>&quot;src/api/**&quot;</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cs}>---</span>
              </div>
              <div className={styles.codeLine}>When reviewing API endpoints:</div>
              <div className={styles.codeLine}>- Check for missing authentication middleware</div>
              <div className={styles.codeLine}>- Validate all inputs use zod schemas</div>
              <div className={styles.codeLine}>- Ensure error responses follow RFC 7807</div>
              <div className={styles.codeLine}>- Flag any endpoint exposing stack traces</div>
            </div>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>.github/instructions/migrations/db.instructions.md</span>
              <span className={styles.codeLang}>markdown</span>
              <CodeCopyButton
                className={styles.codeCopy}
                text={`---\napplyTo: "db/migrations/**"\n---\nFor database migrations:\n- Verify DOWN migration exists and is reversible\n- Check for missing index on foreign keys\n- Flag column renames without data migration`}
              />
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.cs}>---</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>applyTo</span>: <span className={styles.cs}>&quot;db/migrations/**&quot;</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cs}>---</span>
              </div>
              <div className={styles.codeLine}>For database migrations:</div>
              <div className={styles.codeLine}>- Verify DOWN migration exists and is reversible</div>
              <div className={styles.codeLine}>- Check for missing index on foreign keys</div>
              <div className={styles.codeLine}>- Flag column renames without data migration</div>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>5.5 Copilot Memory（Public Preview）</h3>
          <p className={styles.paragraph}>
            Copilot Pro / Pro+ ユーザーは <strong>Copilot Memory</strong> を有効化することで、Copilot
            がリポジトリについて学習した知識を蓄積し、レビュー精度を継続的に向上させることができます。
          </p>

          <div className={styles.trendGrid}>
            <div className={styles.trendCard}>
              <div className={styles.trendLabel}>Copilot Memory</div>
              <div className={styles.trendTitle}>学習型コンテキスト蓄積</div>
              <div className={styles.trendDesc}>
                リポジトリ固有のコーディングパターン、頻出バグ傾向、チームの命名規則を学習・記憶
              </div>
            </div>
            <div className={styles.trendCard}>
              <div className={styles.trendLabel}>Integration</div>
              <div className={styles.trendTitle}>PR レビューへの自動適用</div>
              <div className={styles.trendDesc}>
                蓄積した知識は PR レビュー時に自動的に参照され、より文脈に即した指摘が可能になる
              </div>
            </div>
            <div className={styles.trendCard}>
              <div className={styles.trendLabel}>Availability</div>
              <div className={styles.trendTitle}>Pro / Pro+ 限定</div>
              <div className={styles.trendDesc}>
                2025年6月時点で Public Preview。Business / Enterprise プランでは提供されていない
              </div>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* CH6 */}
        <section className={styles.chapter} id="ch6">
          <div className={styles.chapterHeader}>
            <span className={`${styles.chapterNum} ${styles.blue}`}>CH-06</span>
            <h2>Agentic 機能の活用</h2>
          </div>

          <h3 className={styles.sectionTitle}>6.1 Full Project Context Gathering（GA）</h3>
          <p className={styles.paragraph}>
            従来のコードレビューが PR の diff のみを見るのに対し、Full Project Context Gathering
            はリポジトリ全体を解析して変更の意図・影響範囲・既存コードとの整合性を把握します。これにより「このメソッドは別モジュールで既に実装されている」「この変更が下流のクラスに影響する」といったコンテキスト依存の指摘が可能です。
          </p>

          <div className={styles.mermaidWrap}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <MermaidDiagram chart={DIAG_CONTEXT} />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>6.2 Cloud Agent 連携（Fix PR 自動生成）— Public Preview</h3>

          <ul className={styles.stepList}>
            <li>
              <span className={styles.stepNum}>1</span>
              <div className={styles.stepContent}>
                Code Review のコメントに <strong>Implement suggestion</strong>{" "}
                ボタンが表示されていることを確認（Cloud Agent が有効な場合のみ）
              </div>
            </li>
            <li>
              <span className={styles.stepNum}>2</span>
              <div className={styles.stepContent}>
                <strong>Implement suggestion</strong> をクリックすると PR 上にドラフトコメントが作成される
              </div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.cyan}`}>3</span>
              <div className={styles.stepContent}>ドラフトコメントで Copilot に追加の指示を書いてサブミット</div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.cyan}`}>4</span>
              <div className={styles.stepContent}>
                Copilot Cloud Agent が提案された修正を適用した<em>新しい PR</em>を自動生成
              </div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.purple}`}>5</span>
              <div className={styles.stepContent}>生成された Fix PR を人間がレビューしてマージ判断</div>
            </li>
          </ul>

          <div className={`${styles.callout} ${styles.warning}`}>
            <strong>⚠️ Preview 機能の注意事項</strong>
            Cloud Agent 連携は Public Preview であり、仕様が変更される可能性があります。GitHub
            Pre-release License Terms
            が適用されます。エンタープライズ環境での本番運用前に十分なテストを推奨します。
          </div>

          <h3 className={styles.sectionTitle}>6.3 GitHub Actions runners の設定</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Runner 種別</th>
                  <th className={styles.th}>コスト</th>
                  <th className={styles.th}>推奨ユースケース</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.td}>GitHub-hosted (Standard)</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>無料枠内</span>
                  </td>
                  <td className={styles.td}>通常規模のリポジトリ、Agentic 機能のデフォルト</td>
                </tr>
                <tr>
                  <td className={styles.td}>GitHub-hosted (Larger)</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeAmber}`}>分単位課金</span>
                  </td>
                  <td className={styles.td}>大規模リポジトリ、高速なコンテキスト収集が必要な場合</td>
                </tr>
                <tr>
                  <td className={styles.td}>Self-hosted runners</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeCyan}`}>要設定</span>
                  </td>
                  <td className={styles.td}>GitHub-hosted runners が組織で無効化されている場合</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.alert} ${styles.alertAmber}`}>
            組織で GitHub-hosted runners が <strong>無効化</strong>{" "}
            されている場合、Agentic 機能（Full Project Context Gathering 含む）は利用できません。Self-hosted
            runners を設定することで回避可能です。
          </div>
        </section>

        <hr className={styles.divider} />

        {/* CH7 */}
        <section className={styles.chapter} id="ch7">
          <div className={styles.chapterHeader}>
            <span className={styles.chapterNum}>CH-07</span>
            <h2>自動レビュー（Automatic Reviews）の設定</h2>
          </div>

          <h3 className={styles.sectionTitle}>7.1 自動レビューの階層構造</h3>
          <div className={styles.pyramid}>
            <div className={`${styles.pyrTier} ${styles.pyrT4}`}>Enterprise Org: 全リポジトリ適用</div>
            <div className={`${styles.pyrTier} ${styles.pyrT3}`}>Org Owner: 指定リポジトリ適用</div>
            <div className={`${styles.pyrTier} ${styles.pyrT2}`}>Repository Owner: リポジトリ内 PR に適用</div>
            <div className={`${styles.pyrTier} ${styles.pyrT1}`}>個人 (Pro/Pro+): 自分の PR に適用</div>
          </div>

          <h3 className={styles.sectionTitle}>7.2 トリガー設定と挙動</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>設定オプション</th>
                  <th className={styles.th}>トリガータイミング</th>
                  <th className={styles.th}>推奨シナリオ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.td}>Basic（デフォルト）</td>
                  <td className={styles.td}>PR を "Open" で作成時 / Draft → Open 切替時（初回のみ）</td>
                  <td className={styles.td}>標準的な開発フロー</td>
                </tr>
                <tr>
                  <td className={styles.td}>Review new pushes</td>
                  <td className={styles.td}>PR へのコミットプッシュ毎</td>
                  <td className={styles.td}>継続的に品質チェックしたい場合（クォータ消費注意）</td>
                </tr>
                <tr>
                  <td className={styles.td}>Review draft PRs</td>
                  <td className={styles.td}>Draft PR の作成時から</td>
                  <td className={styles.td}>WIP 段階から早期フィードバックを得たい場合</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={styles.sectionTitle}>7.3 自動レビューの設定フロー</h3>
          <div className={styles.mermaidWrap}>
            <div style={{ maxWidth: "550px", margin: "0 auto" }}>
              <MermaidDiagram chart={DIAG_AUTO} />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>7.4 Bot・GitHub Actions が PR を作成する場合の課金帰属</h3>

          <div className={styles.archLayers}>
            <div className={styles.archLayer}>
              <span className={styles.archLabel}>ワークフロー起動者が特定可能</span>
              <span className={styles.archDesc}>そのユーザーのクォータに加算される</span>
            </div>
            <div className={`${styles.archLayer} ${styles.amber}`}>
              <span className={styles.archLabel}>特定不可能</span>
              <span className={styles.archDesc}>指定された Billing Owner のクォータに加算される</span>
            </div>
          </div>

          <div className={styles.compareGrid}>
            <div className={`${styles.compareCard} ${styles.good}`}>
              <div className={styles.compareTitle}>✅ 良い例: 自動レビューの適切な設定</div>
              <p
                className={styles.paragraph}
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
              >
                大きい PR には必ず Human Review も必須にする（Org の branch protection rules で設定）。Copilot
                のコメントは参考として扱い、最終判断は人間が行う運用フローを確立する。
              </p>
            </div>
            <div className={`${styles.compareCard} ${styles.bad}`}>
              <div className={styles.compareTitle}>❌ 悪い例: Copilot のみでレビュー完結</div>
              <p
                className={styles.paragraph}
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
              >
                Copilot の「Comment」レビューは Required Reviewers に含まれないが、レビュープロセス全体を
                Copilot に委任するのは危険。Copilot は全問題を検出できる保証なし。
              </p>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* CH8 */}
        <section className={styles.chapter} id="ch8">
          <div className={styles.chapterHeader}>
            <span className={`${styles.chapterNum} ${styles.cyan}`}>CH-08</span>
            <h2>クォータ・課金管理</h2>
          </div>

          <h3 className={styles.sectionTitle}>8.1 クォータ消費の仕組み</h3>
          <p className={styles.paragraph}>
            Copilot Code Review は <strong>Premium Request</strong> を消費します。PR レビュー 1 回 =
            Premium Request 1 消費。IDE でのローカルレビューも同様です。
          </p>

          <div className={styles.metricGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>1</span>
              <div className={styles.metricLabel}>PR レビュー1回あたりの消費</div>
            </div>
            <div className={styles.metricCard}>
              <span className={`${styles.metricVal} ${styles.cyan}`}>1</span>
              <div className={styles.metricLabel}>IDE ローカルレビュー1回あたり</div>
            </div>
            <div className={styles.metricCard}>
              <span className={`${styles.metricVal} ${styles.purple}`}>0</span>
              <div className={styles.metricLabel}>Copilot Free プランの月次クォータ</div>
            </div>
            <div className={styles.metricCard}>
              <span className={`${styles.metricVal} ${styles.amber}`}>Paid</span>
              <div className={styles.metricLabel}>クォータ超過時（有償オーバーエイジ）</div>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>8.2 クォータ帰属ルール</h3>
          <div className={styles.archLayers}>
            <div className={styles.archLayer}>
              <span className={styles.archLabel}>自動レビュー（設定済み）</span>
              <span className={styles.archDesc}>PR 作成者のクォータに帰属</span>
            </div>
            <div className={`${styles.archLayer} ${styles.cyan}`}>
              <span className={styles.archLabel}>手動レビュー依頼</span>
              <span className={styles.archDesc}>依頼を実行したユーザーのクォータに帰属</span>
            </div>
            <div className={`${styles.archLayer} ${styles.amber}`}>
              <span className={styles.archLabel}>ライセンスなしユーザー</span>
              <span className={styles.archDesc}>
                個人クォータなし。生成コストは Org/Enterprise の Paid Overage Usage に計上
              </span>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>8.3 クォータ超過時の対応フロー</h3>
          <div className={styles.mermaidWrap}>
            <div style={{ maxWidth: "650px", margin: "0 auto" }}>
              <MermaidDiagram chart={DIAG_QUOTA} />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>8.4 クォータ節約のベストプラクティス</h3>
          <div className={styles.progressItem}>
            <div className={styles.progressHeader}>
              <span>PR を小さく分割（200行以下を目標）</span>
              <span>効果 高</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "90%" }} />
            </div>
          </div>
          <div className={styles.progressItem}>
            <div className={styles.progressHeader}>
              <span>「Review new pushes」は必要な場合のみ有効化</span>
              <span>効果 高</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "85%" }} />
            </div>
          </div>
          <div className={styles.progressItem}>
            <div className={styles.progressHeader}>
              <span>Lint / 型チェックを CI で先行実行してから PR 作成</span>
              <span>効果 中</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "65%" }} />
            </div>
          </div>
          <div className={styles.progressItem}>
            <div className={styles.progressHeader}>
              <span>Bot 生成 PR の Billing Owner を適切に設定</span>
              <span>効果 中</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "55%" }} />
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* CH9 */}
        <section className={styles.chapter} id="ch9">
          <div className={styles.chapterHeader}>
            <span className={`${styles.chapterNum} ${styles.purple}`}>CH-09</span>
            <h2>Enterprise 管理・ガバナンス</h2>
          </div>

          <h3 className={styles.sectionTitle}>9.1 Enterprise 管理者向けポリシー設定</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>ポリシー</th>
                  <th className={styles.th}>設定箇所</th>
                  <th className={styles.th}>デフォルト</th>
                  <th className={styles.th}>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.td}>Copilot code review</td>
                  <td className={styles.td}>Org / Enterprise Policy</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>無効</span>
                  </td>
                  <td className={styles.td}>Code Review 機能の有効化</td>
                </tr>
                <tr>
                  <td className={styles.td}>Premium request paid usage</td>
                  <td className={styles.td}>Enterprise Admin</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>無効</span>
                  </td>
                  <td className={styles.td}>ライセンスなしユーザー向け提供の前提条件</td>
                </tr>
                <tr>
                  <td className={styles.td}>Allow members without license</td>
                  <td className={styles.td}>Enterprise → Org</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>無効</span>
                  </td>
                  <td className={styles.td}>ライセンスなしユーザーへの提供。Ent 設定後は Org で変更不可</td>
                </tr>
                <tr>
                  <td className={styles.td}>Automatic code review</td>
                  <td className={styles.td}>Org / Repo Settings</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>無効</span>
                  </td>
                  <td className={styles.td}>自動レビューの対象リポジトリ設定</td>
                </tr>
                <tr>
                  <td className={styles.td}>Content exclusion</td>
                  <td className={styles.td}>Org Settings / .github</td>
                  <td className={styles.td}>—</td>
                  <td className={styles.td}>スキャン対象外ファイル・ディレクトリの指定</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={styles.sectionTitle}>9.2 ライセンスなしユーザー向け提供の注意点</h3>
          <div className={`${styles.callout} ${styles.danger}`}>
            <strong>🔴 Enterprise Admin 必読</strong>
            「Allow members without a Copilot license」を Enterprise
            レベルで設定した場合、そのポリシーは Organization レベルで
            <em>表示はされますが変更できません（Most Restrictive）</em>
            。また、当該ユーザーが生成するレビューコストはすべて組織への Paid Overage
            として計上されます。予算管理に注意してください。
          </div>

          <h3 className={styles.sectionTitle}>9.3 Audit Log・モニタリング</h3>
          <ul className={styles.stepList}>
            <li>
              <span className={styles.stepNum}>1</span>
              <div className={styles.stepContent}>Enterprise Settings → Audit Log で Copilot Code Review 関連イベントを確認</div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.cyan}`}>2</span>
              <div className={styles.stepContent}>Premium Request の使用状況は Settings → Billing → Copilot usage で確認</div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.cyan}`}>3</span>
              <div className={styles.stepContent}>Agentic 機能の使用状況は Agentic Audit Log Events を参照</div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.purple}`}>4</span>
              <div className={styles.stepContent}>Org レベルの Activity Report をダウンロードして定期的に分析</div>
            </li>
          </ul>

          <h3 className={styles.sectionTitle}>9.4 GitHub Code Quality との連携</h3>
          <div className={styles.trendGrid}>
            <div className={styles.trendCard}>
              <div className={styles.trendLabel}>Copilot Code Review</div>
              <div className={styles.trendTitle}>PR 単位のフィードバック</div>
              <div className={styles.trendDesc}>
                PR の変更差分を対象。即時フィードバックで開発サイクルを加速
              </div>
            </div>
            <div className={styles.trendCard}>
              <div className={styles.trendLabel}>GitHub Code Quality</div>
              <div className={styles.trendTitle}>リポジトリ全体の品質分析</div>
              <div className={styles.trendDesc}>
                信頼性・保守性の継続的評価。戦略的な技術的負債管理に活用
              </div>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* CH10 */}
        <section className={styles.chapter} id="ch10">
          <div className={styles.chapterHeader}>
            <span className={`${styles.chapterNum} ${styles.amber}`}>CH-10</span>
            <h2>ベストプラクティス・運用設計</h2>
          </div>

          <h3 className={styles.sectionTitle}>10.1 Human Review との役割分担</h3>
          <div className={styles.mermaidWrap}>
            <div style={{ maxWidth: "650px", margin: "0 auto" }}>
              <MermaidDiagram chart={DIAG_ROLE} />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>10.2 PR サイズとレビュー品質</h3>
          <p className={styles.paragraph}>
            Copilot のコンテキストウィンドウには制限があります。PR が大きすぎると指摘が表面的になります。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>PR サイズ（変更行数）</th>
                  <th className={styles.th}>Copilot レビュー品質</th>
                  <th className={styles.th}>推奨アクション</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.td}>〜 200 行</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>★★★ 最高</span>
                  </td>
                  <td className={styles.td}>そのままレビュー依頼</td>
                </tr>
                <tr>
                  <td className={styles.td}>200〜500 行</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeCyan}`}>★★☆ 良好</span>
                  </td>
                  <td className={styles.td}>可能なら分割を検討</td>
                </tr>
                <tr>
                  <td className={styles.td}>500〜1000 行</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeAmber}`}>★☆☆ 低下</span>
                  </td>
                  <td className={styles.td}>機能単位で PR を分割</td>
                </tr>
                <tr>
                  <td className={styles.td}>1000 行以上</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>☆☆☆ 要注意</span>
                  </td>
                  <td className={styles.td}>必ず分割。Human Review を主体に</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={styles.sectionTitle}>10.3 Custom Instructions 設計のベストプラクティス</h3>

          <div className={styles.compareGrid}>
            <div className={`${styles.compareCard} ${styles.good}`}>
              <div className={styles.compareTitle}>✅ 効果的な Instructions の構造</div>
              <p
                className={styles.paragraph}
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}
              >
                <strong style={{ color: "var(--neon-green)" }}>
                  1. 優先度高い指示を冒頭 4000 文字以内に
                </strong>
                <br />
                セキュリティ、重大バグ検出ルールを先頭に配置。
                <br />
                <br />
                <strong style={{ color: "var(--neon-green)" }}>2. 具体的なパターンを指定</strong>
                <br />
                「可読性を高めて」ではなく「ネストが 3 層以上は関数分割を提案」。
                <br />
                <br />
                <strong style={{ color: "var(--neon-green)" }}>3. パス別 Instructions で責務を分離</strong>
                <br />
                API / DB / Frontend ごとに異なる観点を設定。
              </p>
            </div>
            <div className={`${styles.compareCard} ${styles.bad}`}>
              <div className={styles.compareTitle}>❌ 避けるべき Anti-patterns</div>
              <p
                className={styles.paragraph}
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}
              >
                <strong style={{ color: "var(--neon-red)" }}>×「全てのベストプラクティスを適用して」</strong>
                <br />
                包括的すぎる指示は Copilot の焦点が分散する。
                <br />
                <br />
                <strong style={{ color: "var(--neon-red)" }}>× 4000 文字を超える設定ファイル</strong>
                <br />
                後半の指示は完全に無視される。
                <br />
                <br />
                <strong style={{ color: "var(--neon-red)" }}>
                  × feature ブランチで Instructions を編集
                </strong>
                <br />
                Copilot はベースブランチの Instructions を参照するため、feature
                ブランチの変更は反映されない。
              </p>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>10.4 CI/CD パイプラインへの統合</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>.github/workflows/auto-review.yml</span>
              <span className={styles.codeLang}>yaml</span>
              <CodeCopyButton
                className={styles.codeCopy}
                text={`name: Auto Copilot Review\non:\n  pull_request:\n    types: [opened, ready_for_review]\n    branches: [main, develop]\n\njobs:\n  pre-checks:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm run lint && npm test\n\n  request-copilot-review:\n    needs: pre-checks\n    if: github.event.pull_request.draft == false\n    runs-on: ubuntu-latest\n    steps:\n      - run: |\n          gh pr edit \${{ github.event.pull_request.number }} \\\n            --add-reviewer @copilot\n        env:\n          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}`}
              />
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.ck}>name</span>:{" "}
                <span className={styles.cs}>Auto Copilot Review</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>on</span>:
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.ck}>pull_request</span>:
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.ck}>types</span>: [
                <span className={styles.cs}>opened</span>,{" "}
                <span className={styles.cs}>ready_for_review</span>]
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.ck}>branches</span>: [<span className={styles.cs}>main</span>,{" "}
                <span className={styles.cs}>develop</span>]
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.ck}>jobs</span>:
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.ck}>pre-checks</span>:
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.ck}>runs-on</span>:{" "}
                <span className={styles.cs}>ubuntu-latest</span>
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.ck}>steps</span>:
              </div>
              <div className={styles.codeLine}>
                {"      "}- <span className={styles.ck}>uses</span>:{" "}
                <span className={styles.cs}>actions/checkout@v4</span>
              </div>
              <div className={styles.codeLine}>
                {"      "}- <span className={styles.ck}>run</span>:{" "}
                <span className={styles.cs}>npm ci && npm run lint && npm test</span>
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.ck}>request-copilot-review</span>:
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.ck}>needs</span>: <span className={styles.cs}>pre-checks</span>
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.ck}>if</span>:{" "}
                <span className={styles.cs}>github.event.pull_request.draft == false</span>
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.ck}>runs-on</span>:{" "}
                <span className={styles.cs}>ubuntu-latest</span>
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.ck}>steps</span>:
              </div>
              <div className={styles.codeLine}>
                {"      "}- <span className={styles.ck}>run</span>:{" "}
                <span className={styles.cs}>|</span>
              </div>
              <div className={styles.codeLine}>
                {"          gh pr edit \${{ github.event.pull_request.number }} \\"}
              </div>
              <div className={styles.codeLine}>{"            --add-reviewer @copilot"}</div>
              <div className={styles.codeLine}>
                {"        "}(<span className={styles.ck}>env</span>):
              </div>
              <div className={styles.codeLine}>
                {"          "}(<span className={styles.ck}>GH_TOKEN</span>):{" "}
                <span className={styles.cs}>{"${{ secrets.GITHUB_TOKEN }}"}</span>
              </div>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>10.5 レビュー結果の評価とフィードバック</h3>
          <div className={`${styles.alert} ${styles.alertGreen}`}>
            <strong>👍 有効なフィードバック活用法</strong>
            Copilot のコメントに👍/👎を積極的に付けることで、チームの Copilot
            レビュー品質が向上します。特に👎の場合は理由を選択することで、GitHub のモデル改善に貢献できます。
          </div>
          <div className={`${styles.alert} ${styles.alertRed}`}>
            <strong>⚠️ Copilot レビューの限界を理解する</strong>
            Copilot
            はすべての問題を検出できる保証はありません。特に「ビジネスロジックの正確性」「非機能要件への適合」「セキュリティ脅威モデルに基づいた判断」は
            Human Review で補完必須です。
          </div>

          <h3 className={styles.sectionTitle}>10.6 組織展開のロードマップ</h3>

          <ul className={styles.stepList}>
            <li>
              <span className={styles.stepNum}>1</span>
              <div className={styles.stepContent}>
                <strong>Phase 1: パイロット（Week 1-2）</strong>
                <br />
                少数チームで手動レビュー依頼から開始。Custom Instructions を最小限で作成。フィードバックを収集。
              </div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.cyan}`}>2</span>
              <div className={styles.stepContent}>
                <strong>Phase 2: カスタマイズ（Week 3-4）</strong>
                <br />
                チームの技術スタック・コーディング規約を反映した Custom Instructions を整備。パス別設定を追加。
              </div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.cyan}`}>3</span>
              <div className={styles.stepContent}>
                <strong>Phase 3: 自動化（Month 2）</strong>
                <br />
                主要リポジトリで自動レビューを有効化。ライセンスなしユーザー向け提供ポリシーの検討。
              </div>
            </li>
            <li>
              <span className={`${styles.stepNum} ${styles.purple}`}>4</span>
              <div className={styles.stepContent}>
                <strong>Phase 4: 全社展開（Month 3+）</strong>
                <br />
                Enterprise レベルでのポリシー管理。Audit Log によるコスト分析。Cloud Agent 連携（Preview）の評価。
              </div>
            </li>
          </ul>
        </section>

        <hr className={styles.divider} />

        {/* REFERENCES */}
        <section className={styles.chapter} id="refs">
          <div className={styles.chapterHeader}>
            <span
              className={styles.chapterNum}
              style={{ background: "var(--text-muted)", color: "#000" }}
            >
              REF
            </span>
            <h2>参考文献・公式ドキュメント</h2>
          </div>

          <div className={styles.refGrid}>
            <Ext href="https://docs.github.com/en/copilot/concepts/agents/code-review">
              <span className={styles.refCard}>
                <span className={styles.refCat}>一次情報源 / Concepts</span>
                <span className={styles.refTitle}>About GitHub Copilot code review</span>
                <span className={styles.refUrl}>
                  docs.github.com/en/copilot/concepts/agents/code-review
                </span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review">
              <span className={styles.refCard}>
                <span className={styles.refCat}>How-to / 操作手順</span>
                <span className={styles.refTitle}>Using GitHub Copilot code review</span>
                <span className={styles.refUrl}>docs.github.com/.../use-code-review</span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-automatic-review">
              <span className={styles.refCard}>
                <span className={styles.refCat}>How-to / 自動レビュー設定</span>
                <span className={styles.refTitle}>Configure automatic code review</span>
                <span className={styles.refUrl}>
                  docs.github.com/.../configure-automatic-review
                </span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-runners">
              <span className={styles.refCard}>
                <span className={styles.refCat}>How-to / インフラ設定</span>
                <span className={styles.refTitle}>Configuring runners for Copilot code review</span>
                <span className={styles.refUrl}>docs.github.com/.../configure-runners</span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/copilot/reference/review-excluded-files">
              <span className={styles.refCard}>
                <span className={styles.refCat}>Reference / 除外ファイル</span>
                <span className={styles.refTitle}>Files excluded from Copilot code review</span>
                <span className={styles.refUrl}>
                  docs.github.com/en/copilot/reference/review-excluded-files
                </span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/copilot/responsible-use/code-review">
              <span className={styles.refCard}>
                <span className={styles.refCat}>Responsible Use / ガイドライン</span>
                <span className={styles.refTitle}>
                  Responsible use of GitHub Copilot code review
                </span>
                <span className={styles.refUrl}>
                  docs.github.com/en/copilot/responsible-use/code-review
                </span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/copilot/concepts/prompting/response-customization">
              <span className={styles.refCard}>
                <span className={styles.refCat}>Concepts / カスタマイズ</span>
                <span className={styles.refTitle}>About customizing GitHub Copilot responses</span>
                <span className={styles.refUrl}>docs.github.com/.../response-customization</span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/copilot/concepts/agents/copilot-memory">
              <span className={styles.refCard}>
                <span className={styles.refCat}>Concepts / Agentic</span>
                <span className={styles.refTitle}>About agentic memory for GitHub Copilot</span>
                <span className={styles.refUrl}>docs.github.com/.../copilot-memory</span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies">
              <span className={styles.refCard}>
                <span className={styles.refCat}>Admin / Organization</span>
                <span className={styles.refTitle}>
                  Managing policies for Copilot in your organization
                </span>
                <span className={styles.refUrl}>docs.github.com/.../manage-policies</span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-code-review">
              <span className={styles.refCard}>
                <span className={styles.refCat}>Admin / Enterprise</span>
                <span className={styles.refTitle}>Enable Copilot code review (Enterprise)</span>
                <span className={styles.refUrl}>
                  docs.github.com/.../enable-copilot-code-review
                </span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/copilot/tutorials/customize-code-review">
              <span className={styles.refCard}>
                <span className={styles.refCat}>Tutorial / カスタマイズ</span>
                <span className={styles.refTitle}>Customize code review</span>
                <span className={styles.refUrl}>
                  docs.github.com/en/copilot/tutorials/customize-code-review
                </span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/copilot/tutorials/optimize-code-reviews">
              <span className={styles.refCard}>
                <span className={styles.refCat}>Tutorial / 最適化</span>
                <span className={styles.refTitle}>Optimize code reviews</span>
                <span className={styles.refUrl}>
                  docs.github.com/en/copilot/tutorials/optimize-code-reviews
                </span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/copilot/concepts/billing/premium-request-management">
              <span className={styles.refCard}>
                <span className={styles.refCat}>Billing / クォータ管理</span>
                <span className={styles.refTitle}>Premium request management</span>
                <span className={styles.refUrl}>docs.github.com/.../premium-request-management</span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/code-security/code-quality/concepts/about-code-quality">
              <span className={styles.refCard}>
                <span className={styles.refCat}>関連機能 / Code Quality</span>
                <span className={styles.refTitle}>About GitHub Code Quality</span>
                <span className={styles.refUrl}>docs.github.com/.../about-code-quality</span>
              </span>
            </Ext>
            <Ext href="https://docs.github.com/en/site-policy/github-terms/github-pre-release-license-terms">
              <span className={styles.refCard}>
                <span className={styles.refCat}>Legal / Preview Terms</span>
                <span className={styles.refTitle}>GitHub Pre-release License Terms</span>
                <span className={styles.refUrl}>
                  docs.github.com/.../github-pre-release-license-terms
                </span>
              </span>
            </Ext>
            <Ext href="https://github.com/features/copilot/plans">
              <span className={styles.refCard}>
                <span className={styles.refCat}>プラン比較</span>
                <span className={styles.refTitle}>GitHub Copilot Plans &amp; Pricing</span>
                <span className={styles.refUrl}>github.com/features/copilot/plans</span>
              </span>
            </Ext>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "3rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
            }}
          >
            最終更新: June 2026 &nbsp;|&nbsp; 一次情報源: GitHub Docs (docs.github.com) &nbsp;|&nbsp;
            本ガイドは公式ドキュメントに基づいて作成
          </div>
        </section>
      </div>
    </div>
  );
}
