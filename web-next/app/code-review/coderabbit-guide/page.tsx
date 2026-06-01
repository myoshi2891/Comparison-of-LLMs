"use client";

import { useEffect, useRef } from "react";
import CodeCopyButton from "@/components/docs/CodeCopyButton";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

// ── MERMAID DIAGRAMS ──
const DIAG_PR_FLOW = `flowchart TD
A([PR Open / Push]) --> B[Webhook 受信]
B --> C{自動レビュー設定?}
C -- No --> D([待機: 手動コマンド待ち])
C -- Yes --> E["Cloud Sandbox 起動\\nリポジトリフルクローン"]
E --> F[Knowledge Base 読込]
F --> G[Learnings DB 照合]
G --> H{並列解析}
H --> I[40+ 静的解析ツール]
H --> J[LLM コード理解エージェント]
H --> K[イシュートラッカー連携]
I --> L[結果集約]
J --> L
K --> L
L --> M["Verification エージェント\\n誤検知フィルタリング"]
M --> N[Walkthrough コメント生成]
N --> O[インライン Review コメント]
O --> P([PR コメント投稿])
P --> Q{Finishing Touches}
Q --> R[Autofix / Unit Test / Docstring 等]

style A fill:#0d1117,stroke:#00f5ff,color:#e2e8f0
style P fill:#0d1117,stroke:#39ff14,color:#e2e8f0
style H fill:#111827,stroke:#b347ea,color:#e2e8f0
style M fill:#111827,stroke:#ffb800,color:#e2e8f0`;

const DIAG_FINISHING_TOUCHES = `flowchart LR
A([PR レビュー完了]) --> B["Walkthrough コメント\\n✨ Finishing Touches セクション"]
B --> C{トリガー方法}
C --> D["チェックボックスをクリック\\nGitHub PR のみ"]
C --> E["コマンドをコメント\\n全プラットフォーム"]
D --> F[Sandbox 実行環境]
E --> F
F --> G{アクション種別}
G --> H["Autofix\\n未解決指摘を修正"]
G --> I["Unit Test\\nテストファイル生成"]
G --> J["Docstring\\n18+ 言語対応"]
G --> K["Custom Recipe\\n定義済みタスク実行"]
H --> L([コミット or\\nスタック PR として出力])
I --> L
J --> M([別 PR として出力])
K --> L

style A fill:#0d1117,stroke:#00f5ff,color:#e2e8f0
style L fill:#0d1117,stroke:#39ff14,color:#e2e8f0
style M fill:#0d1117,stroke:#b347ea,color:#e2e8f0`;

const DIAG_PIPELINE = `sequenceDiagram
participant Dev as 開発者
participant PR as GitHub PR
participant CI as CI/CD (CircleCI 等)
participant CR as CodeRabbit

Dev->>PR: プッシュ & PR 作成
PR->>CI: Webhook トリガー
CI-->>PR: ✗ ビルド失敗 (GitHub Checks)
PR->>CR: Checks 失敗通知
CR->>CI: ビルドログ取得
CR->>CR: 失敗原因とコードを照合
CR->>PR: 失敗行にインライン修正提案
Dev->>PR: 提案を確認・適用
PR->>CI: 再実行
CI-->>PR: ✓ 成功`;

const DIAG_LEARNINGS = `flowchart TD
A([PR レビュー]) --> B[CodeRabbit がコメント]
B --> C{チームが反応}
C --> D[同意: コメントを解決]
C --> E[異議: 理由付きで反論]
E --> F[Learning DB に追加]
F --> G[次回レビューに反映]
H([四半期定期メンテ]) --> I[Learnings ダッシュボード確認]
I --> J{使用状況確認}
J --> K[Never Used: 削除候補]
J --> L[矛盾する Learning: 解消]
J --> M[古い規約: 更新]
K --> N([クリーンな Knowledge Base])
L --> N
M --> N
N --> A

style A fill:#0d1117,stroke:#00f5ff,color:#e2e8f0
style N fill:#0d1117,stroke:#39ff14,color:#e2e8f0
style H fill:#111827,stroke:#ffb800,color:#e2e8f0`;

interface ExtProps {
  href: string;
  children: React.ReactNode;
}

function Ext({ href, children }: ExtProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progressBars = containerRef.current?.querySelectorAll(`.${styles.progressBar}`);
    if (!progressBars) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const bar = entry.target as HTMLElement;
            bar.style.animationPlayState = "running";
          }
        }
      },
      { threshold: 0.3 }
    );

    for (const bar of Array.from(progressBars)) {
      const b = bar as HTMLElement;
      b.style.animationPlayState = "paused";
      observer.observe(b);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.layout}>
      {/* NAV */}
      <nav className={styles.innerNav}>
        <div className={styles.navInner}>
          <a href="#top" className={styles.navLogo}>
            🐰 CR Guide
          </a>
          <a href="#ch1" className={styles.navLink}>
            1. Architecture
          </a>
          <a href="#ch2" className={styles.navLink}>
            2. Configuration
          </a>
          <a href="#ch3" className={styles.navLink}>
            3. Knowledge Base
          </a>
          <a href="#ch4" className={styles.navLink}>
            4. Commands
          </a>
          <a href="#ch5" className={styles.navLink}>
            5. Finishing Touches
          </a>
          <a href="#ch6" className={styles.navLink}>
            6. MCP
          </a>
          <a href="#ch7" className={styles.navLink}>
            7. Tools / CI
          </a>
          <a href="#ch8" className={styles.navLink}>
            8. Advanced
          </a>
          <a href="#refs" className={styles.navLink}>
            References
          </a>
        </div>
      </nav>

      <main className={styles.main} id="top">
        {/* ══════════════ HERO ══════════════ */}
        <section className={styles.hero}>
          <div className={styles.heroTag}>🚀 CodeRabbit 完全活用ガイド — 2025</div>
          <h1>
            Ship Better Code, <br />
            <span>AI がレビューする時代</span>の
            <br />
            実践マスターガイド
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: "540px",
              margin: "0.8rem auto 0",
              fontSize: "1rem",
            }}
          >
            中上級者向け。アーキテクチャの深部から高度なカスタマイズ・MCP連携・AI
            エージェント活用まで完全網羅。
          </p>
          <div className={styles.heroMeta}>
            <span className={`${styles.heroBadge} ${styles.badgeGreen}`}>中〜上級者対象</span>
            <span className={`${styles.heroBadge} ${styles.badgeCyan}`}>Chapter 8 構成</span>
            <span className={`${styles.heroBadge} ${styles.badgePink}`}>最新: 2025-06</span>
            <span className={`${styles.heroBadge} ${styles.badgeAmber}`}>公式 docs 一次情報源</span>
          </div>
        </section>

        {/* ══════════════ KEY METRICS ══════════════ */}
        <div className={styles.metricGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>
              40<span style={{ fontSize: "1.2rem" }}>+</span>
            </div>
            <div className={styles.metricLabel}>静的解析ツール対応</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>5</div>
            <div className={styles.metricLabel}>対応 Git プラットフォーム</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>20</div>
            <div className={styles.metricLabel}>MCP サーバー接続数（Enterprise）</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>
              18<span style={{ fontSize: "1.2rem" }}>+</span>
            </div>
            <div className={styles.metricLabel}>Docstring 対応言語</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>6</div>
            <div className={styles.metricLabel}>Finishing Touches 種類</div>
          </div>
        </div>

        {/* ══════════════ TOC ══════════════ */}
        <div className={styles.tocGrid}>
          <a href="#ch1" className={styles.tocCard}>
            <div className={styles.tocNum}>Chapter 01</div>
            <div className={styles.tocTitle}>アーキテクチャ詳解</div>
          </a>
          <a href="#ch2" className={styles.tocCard}>
            <div className={styles.tocNum}>Chapter 02</div>
            <div className={styles.tocTitle}>設定の完全制御</div>
          </a>
          <a href="#ch3" className={styles.tocCard}>
            <div className={styles.tocNum}>Chapter 03</div>
            <div className={styles.tocTitle}>Knowledge Base & Learnings</div>
          </a>
          <a href="#ch4" className={styles.tocCard}>
            <div className={styles.tocNum}>Chapter 04</div>
            <div className={styles.tocTitle}>コマンド & チャット</div>
          </a>
          <a href="#ch5" className={styles.tocCard}>
            <div className={styles.tocNum}>Chapter 05</div>
            <div className={styles.tocTitle}>Finishing Touches</div>
          </a>
          <a href="#ch6" className={styles.tocCard}>
            <div className={styles.tocNum}>Chapter 06</div>
            <div className={styles.tocTitle}>MCP 統合</div>
          </a>
          <a href="#ch7" className={styles.tocCard}>
            <div className={styles.tocNum}>Chapter 07</div>
            <div className={styles.tocTitle}>ツール & CI/CD 連携</div>
          </a>
          <a href="#ch8" className={styles.tocCard}>
            <div className={styles.tocNum}>Chapter 08</div>
            <div className={styles.tocTitle}>上級テクニック</div>
          </a>
        </div>

        <hr className={styles.divider} />

        {/* ══════════════ CH1: ARCHITECTURE ══════════════ */}
        <section className={styles.chapter} id="ch1">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNum}>1</div>
            <h2 className={styles.chapterTitle}>
              <span>アーキテクチャ</span>詳解{" "}
              <span className={`${styles.klevel} ${styles.kl1}`}>K-Level: 理解</span>
            </h2>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>1.1 CodeRabbit の本質とは？</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong>CodeRabbit は単なる &quot;LLM に diff を渡すツール&quot;
              ではなく、複数の AI エージェントを並列オーケストレーションする{" "}
              <em>本番グレードの AI インフラ</em> です。
            </p>
            <p className={styles.paragraph}>
              <strong>理由：</strong>
              コードは差分だけでは意味が確定しない。認証ミドルウェアの変更が正しいかどうかは、リポジトリ全体・過去の
              PR・リンクしたイシューを統合しないと判定できないからです。
            </p>

            <div className={styles.archLayers}>
              <div className={`${styles.archRow} ${styles.green}`}>
                <div className={styles.archLabel}>Cloud Sandbox</div>
                <div className={styles.archDesc}>
                  リポジトリをフルクローンした隔離実行環境。全静的解析・SAST はここで動作
                </div>
              </div>
              <div className={`${styles.archRow} ${styles.cyan}`}>
                <div className={styles.archLabel}>Multi-Model Analysis</div>
                <div className={styles.archDesc}>
                  40+ 静的解析ツール + 複数 LLM
                  を並列実行。言語・フレームワーク別に最適なモデルを選択
                </div>
              </div>
              <div className={`${styles.archRow} ${styles.pink}`}>
                <div className={styles.archLabel}>Agentic Exploration</div>
                <div className={styles.archDesc}>
                  コードベース全体を自律的に調査。依存関係・型定義・テストを参照しながらコンテキスト構築
                </div>
              </div>
              <div className={`${styles.archRow} ${styles.amber}`}>
                <div className={styles.archLabel}>Specialized Agents</div>
                <div className={styles.archDesc}>
                  Review / Verification / Chat / Pre-Merge Checks / Finishing Touches の 5
                  エージェントが協調動作
                </div>
              </div>
              <div className={`${styles.archRow} ${styles.purple}`}>
                <div className={styles.archLabel}>Living Memory</div>
                <div className={styles.archDesc}>
                  Learnings DB + Knowledge
                  Base。フィードバックを記憶し、次回以降の精度を継続的に向上
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>1.2 PR レビューの処理フロー</h3>

            <div className={styles.mermaidWrap}>
              <div id="mermaid-pr-flow">
                <MermaidDiagram chart={DIAG_PR_FLOW} />
              </div>
            </div>

            <div className={`${styles.callout} ${styles.info}`}>
              <span className={styles.calloutIcon}>💡</span>
              <div className={styles.calloutBody}>
                <strong>Verification Agent の重要性：</strong>LLM
                単体の出力をそのまま投稿するとハルシネーションが混入します。Verification Agent
                が他の解析結果とクロスチェックすることで、誤検知を大幅に削減しています。
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>1.3 対応プラットフォーム</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>プラットフォーム</th>
                    <th className={styles.th}>タイプ</th>
                    <th className={styles.th}>主な認証方式</th>
                    <th className={styles.th}>Finishing Touches</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.td}>GitHub.com</td>
                    <td className={styles.td}>SaaS</td>
                    <td className={styles.td}>GitHub App</td>
                    <td className={styles.td}>フルサポート</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>GitHub Enterprise Server</td>
                    <td className={styles.td}>Self-hosted</td>
                    <td className={styles.td}>OAuth App + Webhook</td>
                    <td className={styles.td}>フルサポート</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>GitLab.com</td>
                    <td className={styles.td}>SaaS</td>
                    <td className={styles.td}>Personal/Group Access Token</td>
                    <td className={styles.td}>Autofix, Docstring, Merge Conflict</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>Azure DevOps</td>
                    <td className={styles.td}>SaaS</td>
                    <td className={styles.td}>Personal Access Token</td>
                    <td className={styles.td}>Docstring のみ</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>Bitbucket Cloud</td>
                    <td className={styles.td}>SaaS</td>
                    <td className={styles.td}>App Password</td>
                    <td className={styles.td}>Docstring のみ</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>Bitbucket Data Center</td>
                    <td className={styles.td}>Self-hosted</td>
                    <td className={styles.td}>HTTP Access Token</td>
                    <td className={styles.td}>Docstring のみ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Chapter 1 refs */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📚 Chapter 1 参考 URL</h3>
            <div className={styles.refGrid}>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】アーキテクチャ</div>
                <Ext href="https://docs.coderabbit.ai/overview/architecture.md">
                  https://docs.coderabbit.ai/overview/architecture.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】PR レビュー概要</div>
                <Ext href="https://docs.coderabbit.ai/overview/pull-request-review.md">
                  https://docs.coderabbit.ai/overview/pull-request-review.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】プラットフォーム一覧</div>
                <Ext href="https://docs.coderabbit.ai/platforms/overview.md">
                  https://docs.coderabbit.ai/platforms/overview.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】GitHub 連携</div>
                <Ext href="https://docs.coderabbit.ai/platforms/github-com.md">
                  https://docs.coderabbit.ai/platforms/github-com.md
                </Ext>
              </div>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* ══════════════ CH2: CONFIGURATION ══════════════ */}
        <section className={styles.chapter} id="ch2">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNum}>2</div>
            <h2 className={styles.chapterTitle}>
              <span>設定の</span>完全制御{" "}
              <span className={`${styles.klevel} ${styles.kl2}`}>K-Level: 適用</span>
            </h2>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>2.1 設定の優先度ヒエラルキー</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong>CodeRabbit の設定は 6
              層の優先度ピラミッドで管理されます。上位レイヤーが下位を上書きします（設定継承を有効化しない限り）。
            </p>

            <div className={styles.pyramid}>
              <div
                className={styles.pyramidLevel}
                style={{
                  width: "220px",
                  background: "rgba(255, 45, 120, 0.2)",
                  border: "1px solid var(--neon-pink)",
                  color: "var(--neon-pink)",
                }}
              >
                Priority 0 — Global Overrides
              </div>
              <div
                className={styles.pyramidLevel}
                style={{
                  width: "280px",
                  background: "rgba(0, 245, 255, 0.15)",
                  border: "1px solid var(--neon-cyan)",
                  color: "var(--neon-cyan)",
                }}
              >
                Priority 1 — .coderabbit.yaml (リポジトリ)
              </div>
              <div
                className={styles.pyramidLevel}
                style={{
                  width: "340px",
                  background: "rgba(57, 255, 20, 0.1)",
                  border: "1px solid var(--neon-green)",
                  color: "var(--neon-green)",
                }}
              >
                Priority 2 — Central Repository
              </div>
              <div
                className={styles.pyramidLevel}
                style={{
                  width: "400px",
                  background: "rgba(179, 71, 234, 0.1)",
                  border: "1px solid var(--neon-purple)",
                  color: "var(--neon-purple)",
                }}
              >
                Priority 3 — Repository Settings (UI)
              </div>
              <div
                className={styles.pyramidLevel}
                style={{
                  width: "460px",
                  background: "rgba(255, 184, 0, 0.08)",
                  border: "1px solid var(--neon-amber)",
                  color: "var(--neon-amber)",
                }}
              >
                Priority 4 — Organization Settings (UI)
              </div>
              <div
                className={styles.pyramidLevel}
                style={{
                  width: "520px",
                  background: "rgba(100, 116, 139, 0.1)",
                  border: "1px solid #64748b",
                  color: "#64748b",
                }}
              >
                Priority 5 — Default Settings
              </div>
            </div>

            <div className={`${styles.callout} ${styles.warning}`}>
              <span className={styles.calloutIcon}>⚠️</span>
              <div className={styles.calloutBody}>
                <strong>重要：</strong>
                設定はデフォルトで「マージ」されません。上位レイヤーが全体を置き換えます。
                <code>configuration_inheritance: true</code>
                を明示的に有効化した場合のみ、親レイヤーの設定がマージされます。
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>2.2 .coderabbit.yaml — 推奨構成の完全形</h3>
            <p className={styles.paragraph}>
              <strong>理由：</strong>YAML
              ファイルをリポジトリに含めることで、設定変更をコードレビューのワークフローに乗せられます（GitOps）。
            </p>

            <div className={styles.compareGrid}>
              <div className={`${styles.compareCard} ${styles.good}`}>
                <div className={styles.compareHead}>✅ 本番推奨構成（上級）</div>
                <div className={styles.compareBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>
                      # yaml-language-server:
                      $schema=https://coderabbit.ai/integrations/schema.v2.json
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeKeyword}>language</span>:{" "}
                    <span className={styles.codeString}>&quot;ja-JP&quot;</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.codeKeyword}>reviews</span>:
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.codeKeyword}>profile</span>:{" "}
                    <span className={styles.codeString}>&quot;assertive&quot;</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.codeKeyword}>request_changes_workflow</span>:{" "}
                    <span className={styles.codeGreen}>true</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.codeKeyword}>high_level_summary</span>:{" "}
                    <span className={styles.codeGreen}>true</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.codeKeyword}>auto_review</span>:
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.codeKeyword}>enabled</span>:{" "}
                    <span className={styles.codeGreen}>true</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.codeKeyword}>drafts</span>:{" "}
                    <span className={styles.codePink}>false</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.codeKeyword}>base_branches</span>:
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}- <span className={styles.codeString}>&quot;main&quot;</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}- <span className={styles.codeString}>&quot;develop&quot;</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.codeKeyword}>path_instructions</span>:
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}- <span className={styles.codeKeyword}>path</span>:{" "}
                    <span className={styles.codeString}>&quot;src/api/**&quot;</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.codeKeyword}>instructions</span>:{" "}
                    <span className={styles.codeString}>|</span>
                  </div>
                  <div className={styles.codeLine}>
                    {
                      "        認証・認可・入力バリデーションに集中。 ORM をバイパスする直接 DB クエリに警告。"
                    }
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}- <span className={styles.codeKeyword}>path</span>:{" "}
                    <span className={styles.codeString}>&quot;tests/**&quot;</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.codeKeyword}>instructions</span>:{" "}
                    <span className={styles.codeString}>|</span>
                  </div>
                  <div className={styles.codeLine}>
                    {
                      "        エッジケース・エラーパスのカバレッジを確認。 テスト名が意図を明確に表しているか評価。"
                    }
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.codeKeyword}>path_filters</span>:
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}-{" "}
                    <span className={styles.codeString}>&quot;!**/generated/**&quot;</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}- <span className={styles.codeString}>&quot;!**/*.pb.go&quot;</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.codeKeyword}>knowledge_base</span>:
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.codeKeyword}>learnings</span>:
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.codeKeyword}>scope</span>:{" "}
                    <span className={styles.codeString}>&quot;local&quot;</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.codeKeyword}>issues</span>:
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.codeKeyword}>scope</span>:{" "}
                    <span className={styles.codeString}>&quot;auto&quot;</span>
                  </div>
                </div>
              </div>
              <div className={`${styles.compareCard} ${styles.bad}`}>
                <div className={styles.compareHead}>❌ アンチパターン（最小設定のみ）</div>
                <div className={styles.compareBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># 設定なし＝デフォルト頼り</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># 問題:</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>
                      # - 生成コード・lock ファイルもレビュー対象になる
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>
                      # - ドラフト PR にも自動レビューが走りクレジットを消費
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>
                      # - path_instructions なしで全ファイルに汎用レビュー
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>
                      # - learnings がクロスリポジトリ汚染を起こす可能性
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>2.3 Path Instructions — 精密レビューの設計</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong>glob
              パターンでファイルパスを指定し、そのパスのファイルに対してのみ適用されるレビュー指示を設定する機能です。
            </p>

            <h4 className={styles.subsectionTitle}>よく使うパターン別 Path Instructions 例</h4>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>.coderabbit.yaml</span>
                <span className={styles.codeLang}>YAML</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`reviews:\n  path_instructions:\n    # API エンドポイント: セキュリティ重視\n    - path: "src/controllers/**"\n      instructions: |\n        - 認証・認可の欠落を必ず指摘。\n        - SQL インジェクション・XSS の可能性を確認。\n        - レート制限の実装を確認。\n\n    # インフラコード: 破壊的変更に敏感\n    - path: "**/*.tf"\n      instructions: |\n        - terraform destroy に相当する変更は必ず警告。\n        - 最小権限の原則に違反する IAM 設定を指摘。\n\n    # マイグレーション: 不可逆操作の検出\n    - path: "db/migrations/**"\n      instructions: |\n        - DROP TABLE / TRUNCATE を検出したら危険として警告。\n        - ダウンタイムを伴うロックが発生するか評価。\n\n    # フロントエンド: アクセシビリティ\n    - path: "src/components/**"\n      instructions: |\n        - WCAG 2.1 準拠（aria-label, alt テキスト等）を確認。\n        - console.log の残存を指摘。`}
                />
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.codeKeyword}>reviews</span>:
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.codeKeyword}>path_instructions</span>:
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.codeComment}># API エンドポイント: セキュリティ重視</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}- <span className={styles.codeKeyword}>path</span>:{" "}
                  <span className={styles.codeString}>&quot;src/controllers/**&quot;</span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>instructions</span>:{" "}
                  <span className={styles.codeString}>|</span>
                </div>
                <div className={styles.codeLine}>{"        - 認証・認可の欠落を必ず指摘。"}</div>
                <div className={styles.codeLine}>
                  {"        - SQL インジェクション・XSS の可能性を確認。"}
                </div>
                <div className={styles.codeLine}>{"        - レート制限の実装を確認。"}</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.codeComment}># インフラコード: 破壊的変更に敏感</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}- <span className={styles.codeKeyword}>path</span>:{" "}
                  <span className={styles.codeString}>&quot;**/*.tf&quot;</span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>instructions</span>:{" "}
                  <span className={styles.codeString}>|</span>
                </div>
                <div className={styles.codeLine}>
                  {"        - terraform destroy に相当する変更は必ず警告。"}
                </div>
                <div className={styles.codeLine}>
                  {"        - 最小権限の原則に違反する IAM 設定を指摘。"}
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.codeComment}># マイグレーション: 不可逆操作の検出</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}- <span className={styles.codeKeyword}>path</span>:{" "}
                  <span className={styles.codeString}>&quot;db/migrations/**&quot;</span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>instructions</span>:{" "}
                  <span className={styles.codeString}>|</span>
                </div>
                <div className={styles.codeLine}>
                  {"        - DROP TABLE / TRUNCATE を検出したら危険として警告。"}
                </div>
                <div className={styles.codeLine}>
                  {"        - ダウンタイムを伴うロックが発生するか評価。"}
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.codeComment}># フロントエンド: アクセシビリティ</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}- <span className={styles.codeKeyword}>path</span>:{" "}
                  <span className={styles.codeString}>&quot;src/components/**&quot;</span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>instructions</span>:{" "}
                  <span className={styles.codeString}>|</span>
                </div>
                <div className={styles.codeLine}>
                  {"        - WCAG 2.1 準拠（aria-label, alt テキスト等）を確認。"}
                </div>
                <div className={styles.codeLine}>{"        - console.log の残存を指摘。"}</div>
              </div>
            </div>

            <div className={`${styles.callout} ${styles.info}`}>
              <span className={styles.calloutIcon}>💡</span>
              <div className={styles.calloutBody}>
                glob パターンは
                <Ext href="https://github.com/isaacs/minimatch">minimatch</Ext>
                形式。<code>**</code>{" "}
                は任意のディレクトリ深度にマッチします。パスフィルター（除外）は
                <code>!</code> プレフィックスで指定。
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>2.4 Central Configuration — 組織全体の一元管理</h3>
            <p className={styles.paragraph}>
              <strong>理由：</strong>50 リポジトリに個別 YAML
              を配置するのは運用上のオーバーヘッドになります。Central Configuration を使うと
              <code>coderabbit</code> という専用リポジトリ 1 か所だけ管理すれば済みます。
            </p>

            <ul className={styles.stepList}>
              <li>
                <span className={styles.stepNum}>1</span>
                <div className={styles.stepContent}>
                  組織内に <code>coderabbit</code> という名前のリポジトリを作成する
                </div>
              </li>
              <li>
                <span className={styles.stepNum}>2</span>
                <div className={styles.stepContent}>
                  そのリポジトリのルートに <code>.coderabbit.yaml</code> を配置する
                </div>
              </li>
              <li>
                <span className={styles.stepNum}>3</span>
                <div className={styles.stepContent}>
                  個別
                  <code>.coderabbit.yaml</code> を持たないリポジトリには自動的にこの設定が適用される
                </div>
              </li>
              <li>
                <span className={styles.stepNum}>4</span>
                <div className={styles.stepContent}>
                  個別リポジトリに
                  <code>.coderabbit.yaml</code> を置くと、中央設定より優先される（Priority 1 &gt;
                  2）
                </div>
              </li>
            </ul>
          </div>

          {/* Ch2 refs */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📚 Chapter 2 参考 URL</h3>
            <div className={styles.refGrid}>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】設定概要</div>
                <Ext href="https://docs.coderabbit.ai/guides/configuration-overview.md">
                  https://docs.coderabbit.ai/guides/configuration-overview.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】YAML 設定</div>
                <Ext href="https://docs.coderabbit.ai/getting-started/yaml-configuration.md">
                  https://docs.coderabbit.ai/getting-started/yaml-configuration.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Path Instructions</div>
                <Ext href="https://docs.coderabbit.ai/configuration/path-instructions.md">
                  https://docs.coderabbit.ai/configuration/path-instructions.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Central Configuration</div>
                <Ext href="https://docs.coderabbit.ai/configuration/central-configuration.md">
                  https://docs.coderabbit.ai/configuration/central-configuration.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】設定継承</div>
                <Ext href="https://docs.coderabbit.ai/configuration/configuration-inheritance.md">
                  https://docs.coderabbit.ai/configuration/configuration-inheritance.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Configuration Reference</div>
                <Ext href="https://docs.coderabbit.ai/reference/configuration.md">
                  https://docs.coderabbit.ai/reference/configuration.md
                </Ext>
              </div>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* ══════════════ CH3: KNOWLEDGE BASE ══════════════ */}
        <section className={styles.chapter} id="ch3">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNum}>3</div>
            <h2 className={styles.chapterTitle}>
              <span>Knowledge Base</span> &amp; Learnings
              <span className={`${styles.klevel} ${styles.kl2}`}>K-Level: 適用</span>
            </h2>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>3.1 Knowledge Base の全体像</h3>
            <p className={styles.paragraph}>
              CodeRabbit のレビュー精度は
              <strong>Knowledge Base</strong> の充実度に比例します。Knowledge Base は 5
              つのソースで構成されます。
            </p>

            <div className={styles.archLayers}>
              <div className={`${styles.archRow} ${styles.cyan}`}>
                <div className={styles.archLabel}>Learnings</div>
                <div className={styles.archDesc}>
                  チャットから自然言語で追加される動的なレビュー優先事項。フィードバックループにより自動進化
                </div>
              </div>
              <div className={`${styles.archRow} ${styles.green}`}>
                <div className={styles.archLabel}>Code Guidelines</div>
                <div className={styles.archDesc}>
                  .cursorrules / CLAUDE.md / AGENTS.md を自動検出。AI
                  コーディングエージェントと共有可能
                </div>
              </div>
              <div className={`${styles.archRow} ${styles.amber}`}>
                <div className={styles.archLabel}>Multi-Repo Analysis</div>
                <div className={styles.archDesc}>
                  関連リポジトリをリンクして API 破壊的変更・依存不整合をクロスリポジトリで検出
                </div>
              </div>
              <div className={`${styles.archRow} ${styles.pink}`}>
                <div className={styles.archLabel}>MCP Servers</div>
                <div className={styles.archDesc}>
                  Notion / Jira / SonarQube 等の外部ツールからレビューコンテキストを動的取得
                </div>
              </div>
              <div className={`${styles.archRow} ${styles.purple}`}>
                <div className={styles.archLabel}>Web Search</div>
                <div className={styles.archDesc}>
                  セキュリティ脆弱性・最新 API 情報をリアルタイムに検索してレビューに反映
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>3.2 Learnings — AI を育てる</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong>PR コメントを通じて自然言語でレビュー優先事項を CodeRabbit
              に記憶させる仕組みです。組織の Git
              プラットフォームに紐づいた内部データベースに保存されます。
            </p>

            <h4 className={styles.subsectionTitle}>Learning を追加する 3 パターン</h4>

            <ul className={styles.stepList}>
              <li>
                <span className={styles.stepNum}>1</span>
                <div className={styles.stepContent}>
                  <strong>コメント返信で追加（最も推奨）</strong>
                  <br />
                  CodeRabbit のインラインコメントに直接返信する。文脈が最も豊富に保存される。
                  <div className={styles.codeWrap} style={{ marginTop: "0.5rem" }}>
                    <div className={styles.codeBar}>
                      <span>PR Reply</span>
                      <CodeCopyButton
                        className={styles.codeCopy}
                        text={`@coderabbitai 認証ミドルウェアではネストした try-catch より アーリーリターン + 固有エラーコードを使います。モニタリングツールがエラーコードで追跡できるため。`}
                      />
                    </div>
                    <div className={styles.codeBody}>
                      <div className={styles.codeLine}>
                        <span className={styles.codeGreen}>@coderabbitai</span>{" "}
                        <span className={styles.codeString}>
                          認証ミドルウェアではネストした try-catch より アーリーリターン +
                          固有エラーコードを使います。モニタリングツールがエラーコードで追跡できるため。
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <span className={styles.stepNum}>2</span>
                <div className={styles.stepContent}>
                  <strong>ファイルインポートで一括追加</strong>
                  <br />
                  既存ドキュメント（コーディング規約等）を一気にインポート。
                  <div className={styles.codeWrap} style={{ marginTop: "0.5rem" }}>
                    <div className={styles.codeBar}>
                      <span>PR Comment</span>
                      <CodeCopyButton
                        className={styles.codeCopy}
                        text={`@coderabbitai add a learning using docs/coding-standards.md`}
                      />
                    </div>
                    <div className={styles.codeBody}>
                      <div className={styles.codeLine}>
                        <span className={styles.codeGreen}>@coderabbitai</span>{" "}
                        <span className={styles.codeString}>
                          add a learning using docs/coding-standards.md
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <span className={styles.stepNum}>3</span>
                <div className={styles.stepContent}>
                  <strong>CSV インポートで組織移行時に転送</strong>
                  <br />
                  旧アカウントからエクスポートした CSV を新 PR にアップして移行。
                  <div className={styles.codeWrap} style={{ marginTop: "0.5rem" }}>
                    <div className={styles.codeBar}>
                      <span>PR Comment</span>
                      <CodeCopyButton
                        className={styles.codeCopy}
                        text={`@coderabbitai import file my_learnings.csv as Learnings data for future use`}
                      />
                    </div>
                    <div className={styles.codeBody}>
                      <div className={styles.codeLine}>
                        <span className={styles.codeGreen}>@coderabbitai</span>{" "}
                        <span className={styles.codeString}>
                          import file my_learnings.csv as Learnings data for future use
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <h4 className={styles.subsectionTitle}>効果的な Learning の書き方</h4>
            <div className={styles.compareGrid}>
              <div className={`${styles.compareCard} ${styles.good}`}>
                <div className={styles.compareHead}>✅ 効果的（理由を含む）</div>
                <div className={styles.compareBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.codeGreen}>@coderabbitai</span> ユーザー ID
                    をエラーメッセージに含めないでください。
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeCyan}>理由:</span>{" "}
                    エラーログは外部モニタリングサービスに送信されるため。ユーザーコンテキストは
                    トレーシングシステムで別途追跡しています。
                  </div>
                </div>
              </div>
              <div className={`${styles.compareCard} ${styles.bad}`}>
                <div className={styles.compareHead}>❌ 非効果的（理由なし）</div>
                <div className={styles.compareBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.codeGreen}>@coderabbitai</span>{" "}
                    エラーメッセージにユーザー IDを入れるな。
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>
                      {"// 理由がないと類似状況で正しく適用されない"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h4 className={styles.subsectionTitle}>Learnings スコープ設定</h4>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>スコープ</th>
                    <th className={styles.th}>挙動</th>
                    <th className={styles.th}>推奨ユースケース</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.td}>
                      <code>auto</code>（デフォルト）
                    </td>
                    <td className={styles.td}>public: リポジトリのみ / private: 組織全体</td>
                    <td className={styles.td}>混在環境のデフォルト</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>local</code>
                    </td>
                    <td className={styles.td}>そのリポジトリのみ</td>
                    <td className={styles.td}>Python / React 等 異なる技術スタックが混在</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>global</code>
                    </td>
                    <td className={styles.td}>組織全リポジトリに適用</td>
                    <td className={styles.td}>セキュリティ要件・命名規則が全社統一</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              3.3 Code Guidelines — 既存ドキュメントを即座に活用
            </h3>
            <p className={styles.paragraph}>
              CodeRabbit は以下のファイルをリポジトリ内で<strong>自動検出</strong>
              し、レビュー基準として適用します。設定不要です。
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>ファイル名</th>
                    <th className={styles.th}>説明</th>
                    <th className={styles.th}>AI コーディングエージェントとの共有</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.td}>
                      <code>CLAUDE.md</code>
                    </td>
                    <td className={styles.td}>Anthropic Claude 向けエージェント指示</td>
                    <td className={styles.td}>Claude Code / Cursor で共有可</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>.cursorrules</code>
                    </td>
                    <td className={styles.td}>Cursor IDE のルール定義</td>
                    <td className={styles.td}>Cursor で共有可</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>AGENTS.md</code>
                    </td>
                    <td className={styles.td}>汎用エージェント指示ファイル</td>
                    <td className={styles.td}>多くのエージェントで共有可</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>.github/copilot-instructions.md</code>
                    </td>
                    <td className={styles.td}>GitHub Copilot 向け指示</td>
                    <td className={styles.td}>Copilot で共有可</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.alert} ${styles.green}`}>
              💡 <strong>CLAUDE.md が既に存在するなら</strong>、CodeRabbit
              は追加設定なしにその内容をレビュー基準として使用します。プロジェクトの規約を一元管理できます。
            </div>
          </div>

          {/* Ch3 refs */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📚 Chapter 3 参考 URL</h3>
            <div className={styles.refGrid}>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Knowledge Base 概要</div>
                <Ext href="https://docs.coderabbit.ai/knowledge-base/index.md">
                  https://docs.coderabbit.ai/knowledge-base/index.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Learnings</div>
                <Ext href="https://docs.coderabbit.ai/knowledge-base/learnings.md">
                  https://docs.coderabbit.ai/knowledge-base/learnings.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Code Guidelines</div>
                <Ext href="https://docs.coderabbit.ai/knowledge-base/code-guidelines.md">
                  https://docs.coderabbit.ai/knowledge-base/code-guidelines.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Multi-Repo Analysis</div>
                <Ext href="https://docs.coderabbit.ai/knowledge-base/multi-repo-analysis.md">
                  https://docs.coderabbit.ai/knowledge-base/multi-repo-analysis.md
                </Ext>
              </div>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* ══════════════ CH4: COMMANDS ══════════════ */}
        <section className={styles.chapter} id="ch4">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNum}>4</div>
            <h2 className={styles.chapterTitle}>
              <span>コマンド</span> &amp; チャット活用{" "}
              <span className={`${styles.klevel} ${styles.kl1}`}>K-Level: 記憶</span>
            </h2>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>4.1 コアコマンド完全リファレンス</h3>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>コマンド</th>
                    <th className={styles.th}>効果</th>
                    <th className={styles.th}>用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.td}>
                      <code>@coderabbitai review</code>
                    </td>
                    <td className={styles.td}>前回以降の差分を増分レビュー</td>
                    <td className={styles.td}>新しいコミット後に素早く確認</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>@coderabbitai full review</code>
                    </td>
                    <td className={styles.td}>PR 全体をゼロからレビュー</td>
                    <td className={styles.td}>大規模リファクタリング後</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>@coderabbitai pause</code>
                    </td>
                    <td className={styles.td}>自動レビューを一時停止</td>
                    <td className={styles.td}>WIP コミット中のノイズ削減</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>@coderabbitai resume</code>
                    </td>
                    <td className={styles.td}>自動レビューを再開</td>
                    <td className={styles.td}>pause 解除</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>@coderabbitai resolve</code>
                    </td>
                    <td className={styles.td}>全コメントを解決済みにする</td>
                    <td className={styles.td}>一括クリーンアップ</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>@coderabbitai summary</code>
                    </td>
                    <td className={styles.td}>PR 説明の要約を更新</td>
                    <td className={styles.td}>変更内容が大きく変わった後</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>@coderabbitai generate sequence diagram</code>
                    </td>
                    <td className={styles.td}>シーケンス図を生成して投稿</td>
                    <td className={styles.td}>設計レビュー前の可視化</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>@coderabbitai configuration</code>
                    </td>
                    <td className={styles.td}>現在の設定を表示</td>
                    <td className={styles.td}>設定確認・デバッグ</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>@coderabbitai help</code>
                    </td>
                    <td className={styles.td}>クイックリファレンスを表示</td>
                    <td className={styles.td}>コマンド一覧を確認</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.callout} ${styles.info}`}>
              <span className={styles.calloutIcon}>💡</span>
              <div className={styles.calloutBody}>
                <code>@coderabbitai review</code> と <code>full review</code> の違いに注意。
                <code>review</code> は増分（前回以降の変更のみ）、<code>full review</code> は PR
                全体を再評価します。大幅なリベース後は <code>full review</code> を使用してください。
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>4.2 インタラクティブチャットの活用パターン</h3>
            <p className={styles.paragraph}>
              コマンド以外にも、CodeRabbit とのチャットによって様々な高度な活用が可能です。
            </p>

            <div className={styles.examGrid}>
              <div className={styles.examCard}>
                <div className={styles.examTitle}>🔍 コードの深堀り質問</div>
                <div className={styles.examStars}>★★★★☆</div>
                <div className={styles.examDesc}>
                  「この関数の時間計算量を教えて」「このパターンのメモリリークリスクは？」など、特定コードへの質問
                </div>
              </div>
              <div className={styles.examCard}>
                <div className={styles.examTitle}>📝 Learning の即座追加</div>
                <div className={styles.examStars}>★★★★★</div>
                <div className={styles.examDesc}>
                  コメント返信で理由付きの優先事項を伝えると、次回から自動適用される
                </div>
              </div>
              <div className={styles.examCard}>
                <div className={styles.examTitle}>🔧 改善案の依頼</div>
                <div className={styles.examStars}>★★★★☆</div>
                <div className={styles.examDesc}>
                  「このコードをより関数型スタイルに書き直して」「エラーハンドリングを強化するには？」
                </div>
              </div>
              <div className={styles.examCard}>
                <div className={styles.examTitle}>📊 設計レビュー</div>
                <div className={styles.examStars}>★★★☆☆</div>
                <div className={styles.examDesc}>
                  シーケンス図生成を活用して、PR の変更が設計意図と一致しているか確認
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>4.3 PR Description で自動レビューを制御</h3>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>PR Description</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`## Summary\nこのPRはユーザー認証フローのリファクタリングです。\n\n## レビュー対象外（意図的な変更）\n@coderabbitai ignore # ← PR全体の自動レビューを無効化\n\n## または特定コミットのみ除外したい場合\n# コミットメッセージに [skip ci] を含める`}
                />
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}>## Summary</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}>
                    このPRはユーザー認証フローのリファクタリングです。
                  </span>
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}>## レビュー対象外（意図的な変更）</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeGreen}>@coderabbitai ignore</span>{" "}
                  <span className={styles.codeAmber}># ← PR全体の自動レビューを無効化</span>
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}>
                    ## または特定コミットのみ除外したい場合
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}>
                    # コミットメッセージに [skip ci] を含める
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ch4 refs */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📚 Chapter 4 参考 URL</h3>
            <div className={styles.refGrid}>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】コマンド管理</div>
                <Ext href="https://docs.coderabbit.ai/guides/commands.md">
                  https://docs.coderabbit.ai/guides/commands.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】レビューコマンドリファレンス</div>
                <Ext href="https://docs.coderabbit.ai/reference/review-commands.md">
                  https://docs.coderabbit.ai/reference/review-commands.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】インタラクティブチャット</div>
                <Ext href="https://docs.coderabbit.ai/guide/chat.md">
                  https://docs.coderabbit.ai/guide/chat.md
                </Ext>
              </div>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* ══════════════ CH5: FINISHING TOUCHES ══════════════ */}
        <section className={styles.chapter} id="ch5">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNum}>5</div>
            <h2 className={styles.chapterTitle}>
              <span>Finishing Touches</span> — AI が仕上げる
              <span className={`${styles.klevel} ${styles.kl3}`}>K-Level: 応用</span>
            </h2>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>5.1 Finishing Touches 全機能マップ</h3>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>機能</th>
                    <th className={styles.th}>コマンド</th>
                    <th className={styles.th}>出力</th>
                    <th className={styles.th}>プラン</th>
                    <th className={styles.th}>対応 PF</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.td}>
                      🔧 <strong>Autofix</strong>
                    </td>
                    <td className={styles.td}>
                      <code>@coderabbitai autofix</code>
                    </td>
                    <td className={styles.td}>コミット or スタック PR</td>
                    <td className={styles.td}>Pro+</td>
                    <td className={styles.td}>GitHub / GitLab</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      📝 <strong>Docstring 生成</strong>
                    </td>
                    <td className={styles.td}>
                      <code>@coderabbitai generate docstrings</code>
                    </td>
                    <td className={styles.td}>別 PR として作成</td>
                    <td className={styles.td}>Pro+</td>
                    <td className={styles.td}>全プラットフォーム</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      🔀 <strong>マージコンフリクト解消</strong>
                    </td>
                    <td className={styles.td}>
                      <code>@coderabbitai fix merge conflict</code>
                    </td>
                    <td className={styles.td}>マージコミット</td>
                    <td className={styles.td}>Pro+</td>
                    <td className={styles.td}>GitHub / GitLab</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      🧪 <strong>ユニットテスト生成</strong>
                    </td>
                    <td className={styles.td}>
                      <code>@coderabbitai generate unit tests</code>
                    </td>
                    <td className={styles.td}>PR or コミット</td>
                    <td className={styles.td}>Pro+</td>
                    <td className={styles.td}>GitHub のみ</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      ✨ <strong>コード簡略化</strong>
                    </td>
                    <td className={styles.td}>
                      <code>@coderabbitai simplify</code>
                    </td>
                    <td className={styles.td}>PR or コミット</td>
                    <td className={styles.td}>Pro+</td>
                    <td className={styles.td}>GitHub のみ</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      📜 <strong>Custom Recipe</strong>
                    </td>
                    <td className={styles.td}>
                      <code>@coderabbitai run &lt;recipe&gt;</code>
                    </td>
                    <td className={styles.td}>コミット or スタック PR</td>
                    <td className={styles.td}>Pro+</td>
                    <td className={styles.td}>GitHub のみ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              5.2 Custom Recipes — チームの繰り返しタスクを自動化
            </h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong>
              チームが頻繁に行う定型作業をレシピとして定義し、ワンコマンドで実行させる機能。
            </p>
            <p className={styles.paragraph}>
              <strong>具体例：</strong>CHANGELOG 更新・import
              整理・型チェック強化・国際化対応確認など。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>.coderabbit.yaml</span>
                <span className={styles.codeLang}>YAML</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`finishing_touches:\n  custom_recipes:\n    - name: "add-changelog-entry"\n      description: "CHANGELOG.md にこの PR のエントリを追加"\n      instructions: |\n        PR の内容を分析し、CHANGELOG.md の [Unreleased] セクションに適切なエントリを追加してください。\n        形式: \`- [Fix/Feature/Chore] 変更内容の簡潔な説明 (#PR番号)\`\n\n    - name: "enforce-strict-types"\n      description: "any 型を排除して厳密型に変換"\n      instructions: |\n        変更されたTypeScriptファイル内の any 型を 適切な型に置き換えてください。\n        unknown を中間型として使う場合はコメントで説明を追加。`}
                />
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.codeKeyword}>finishing_touches</span>:
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.codeKeyword}>custom_recipes</span>:
                </div>
                <div className={styles.codeLine}>
                  {"    "}- <span className={styles.codeKeyword}>name</span>:{" "}
                  <span className={styles.codeString}>&quot;add-changelog-entry&quot;</span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>description</span>:{" "}
                  <span className={styles.codeString}>
                    &quot;CHANGELOG.md にこの PR のエントリを追加&quot;
                  </span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>instructions</span>:{" "}
                  <span className={styles.codeString}>|</span>
                </div>
                <div className={styles.codeLine}>
                  {
                    "        PR の内容を分析し、CHANGELOG.md の [Unreleased] セクションに適切なエントリを追加してください。"
                  }
                </div>
                <div className={styles.codeLine}>
                  {"        形式: `- [Fix/Feature/Chore] 変更内容 of 簡潔な説明 (#PR番号)`"}
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  {"    "}- <span className={styles.codeKeyword}>name</span>:{" "}
                  <span className={styles.codeString}>&quot;enforce-strict-types&quot;</span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>description</span>:{" "}
                  <span className={styles.codeString}>
                    &quot;any 型を排除して厳密型に変換&quot;
                  </span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>instructions</span>:{" "}
                  <span className={styles.codeString}>|</span>
                </div>
                <div className={styles.codeLine}>
                  {
                    "        変更されたTypeScriptファイル内の any 型を 適切な型に置き換えてください。"
                  }
                </div>
                <div className={styles.codeLine}>
                  {"        unknown を中間型として使う場合はコメントで説明を追加。"}
                </div>
              </div>
            </div>

            <h4 className={styles.subsectionTitle}>使い方</h4>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>PR Comment</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`@coderabbitai run add-changelog-entry\n@coderabbitai run enforce-strict-types`}
                />
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}># PR コメントでレシピを実行</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeGreen}>@coderabbitai</span>{" "}
                  <span className={styles.codeString}>run add-changelog-entry</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeGreen}>@coderabbitai</span>{" "}
                  <span className={styles.codeString}>run enforce-strict-types</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>5.3 Finishing Touches のトリガーフロー</h3>

            <div className={styles.mermaidWrap}>
              <div id="mermaid-finishing-touches">
                <MermaidDiagram chart={DIAG_FINISHING_TOUCHES} />
              </div>
            </div>
          </div>

          {/* Ch5 refs */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📚 Chapter 5 参考 URL</h3>
            <div className={styles.refGrid}>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Finishing Touches 概要</div>
                <Ext href="https://docs.coderabbit.ai/finishing-touches/index.md">
                  https://docs.coderabbit.ai/finishing-touches/index.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Autofix</div>
                <Ext href="https://docs.coderabbit.ai/finishing-touches/autofix.md">
                  https://docs.coderabbit.ai/finishing-touches/autofix.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Docstring 生成</div>
                <Ext href="https://docs.coderabbit.ai/finishing-touches/docstrings.md">
                  https://docs.coderabbit.ai/finishing-touches/docstrings.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Unit Test 生成</div>
                <Ext href="https://docs.coderabbit.ai/finishing-touches/unit-test-generation.md">
                  https://docs.coderabbit.ai/finishing-touches/unit-test-generation.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Custom Recipes</div>
                <Ext href="https://docs.coderabbit.ai/finishing-touches/custom-finishing-touches.md">
                  https://docs.coderabbit.ai/finishing-touches/custom-finishing-touches.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】マージコンフリクト解消</div>
                <Ext href="https://docs.coderabbit.ai/finishing-touches/resolve-merge-conflict.md">
                  https://docs.coderabbit.ai/finishing-touches/resolve-merge-conflict.md
                </Ext>
              </div>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* ══════════════ CH6: MCP ══════════════ */}
        <section className={styles.chapter} id="ch6">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNum}>6</div>
            <h2 className={styles.chapterTitle}>
              <span>MCP</span> 統合 — コンテキストを無限に拡張{" "}
              <span className={`${styles.klevel} ${styles.kl3}`}>K-Level: 応用</span>
            </h2>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>6.1 MCP とは何か、なぜ重要か</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong>Model Context Protocol (MCP) は Anthropic
              が提唱した標準インターフェース。CodeRabbit は MCP クライアントとして動作し、あらゆる
              MCP サーバーに接続して外部データをレビューコンテキストに組み込みます。
            </p>
            <p className={styles.paragraph}>
              <strong>理由：</strong>
              コードレビューの精度は「コンテキストの豊富さ」に依存します。設計書・テスト結果・イシュー要件・パフォーマンスデータを参照することで、コードの「正しさ」をより深く評価できます。
            </p>

            <div className={styles.metricGrid}>
              <div className={styles.metricCard}>
                <div className={styles.metricVal}>5</div>
                <div className={styles.metricLabel}>MCP 接続数 (Pro)</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricVal}>15</div>
                <div className={styles.metricLabel}>MCP 接続数 (Pro+)</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricVal}>20</div>
                <div className={styles.metricLabel}>MCP 接続数 (Enterprise)</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>6.2 MCP 設定手順</h3>

            <ul className={styles.stepList}>
              <li>
                <span className={styles.stepNum}>1</span>
                <div className={styles.stepContent}>
                  <Ext href="https://app.coderabbit.ai/integrations">
                    app.coderabbit.ai/integrations
                  </Ext>{" "}
                  → MCP タブへ移動
                </div>
              </li>
              <li>
                <span className={styles.stepNum}>2</span>
                <div className={styles.stepContent}>
                  <strong>New MCP Server</strong> をクリック。サーバー URL と名前を入力
                </div>
              </li>
              <li>
                <span className={styles.stepNum}>3</span>
                <div className={styles.stepContent}>認証フロー（OAuth / API キー等）を完了</div>
              </li>
              <li>
                <span className={styles.stepNum}>4</span>
                <div className={styles.stepContent}>個別ツールの有効/無効を切り替え</div>
              </li>
              <li>
                <span className={styles.stepNum}>5</span>
                <div className={styles.stepContent}>
                  <strong>User guidance</strong> フィールドに CodeRabbit
                  への使い方説明を記述（次節参照）
                </div>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>6.3 User Guidance — AI に使い方を教える</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong>MCP サーバーを利用する際に AI
              エージェントが最初に読むフリーテキスト指示。
            </p>

            <div className={styles.compareGrid}>
              <div className={`${styles.compareCard} ${styles.good}`}>
                <div className={styles.compareHead}>✅ Notion MCP 向け優れた User Guidance</div>
                <div className={styles.compareBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.codeCyan}>
                      このNotionワークスペースはエンジニアリング文書を含みます。
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    コードレビューでは &quot;Engineering&quot; スペースを参照してください:
                  </div>
                  <div className={styles.codeLine}>
                    - &quot;Architecture Decisions&quot;: 設計の根拠
                  </div>
                  <div className={styles.codeLine}>
                    - &quot;API Contracts&quot;: インターフェース仕様
                  </div>
                  <div className={styles.codeLine}>
                    - &quot;Service Runbooks&quot;: 運用コンテキスト
                  </div>
                  <div className={styles.codeLine}>
                    HR / Finance スペースの内容は取得しないでください。
                  </div>
                </div>
              </div>
              <div className={`${styles.compareCard} ${styles.bad}`}>
                <div className={styles.compareHead}>❌ 不十分な User Guidance</div>
                <div className={styles.compareBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.codePink}>Notion のドキュメントを使ってください。</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>{"// 問題:"}</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>{"// - どのスペースを見るか不明"}</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>{"// - レビューとの関連性不明"}</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>{"// - 不要なページも取得される"}</span>
                  </div>
                </div>
              </div>
            </div>

            <h4 className={styles.subsectionTitle}>URL テンプレートプレースホルダー</h4>
            <p className={styles.paragraph}>
              MCP の User Guidance 内で PR 固有の値を動的に展開できます。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>Placeholder config</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`# Jenkins Organization Folder の例\nJenkins ビルド URL パターン: https://jenkins.company.com/job/{workspace}/job/{repo}/job/PR-{pr}/\n\n# SonarQube プロジェクトキー規約\nSonarQube プロジェクトキー形式: {org}_{repo}\nダッシュボード URL: https://sonar.company.com/dashboard?id={org}_{repo}`}
                />
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}># Jenkins Organization Folder の例</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeGreen}>Jenkins ビルド URL パターン:</span>{" "}
                  <span className={styles.codeString}>
                    https://jenkins.company.com/job/&#123;workspace&#125;/job/&#123;repo&#125;/job/PR-&#123;pr&#125;/
                  </span>
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}># SonarQube プロジェクトキー規約</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeGreen}>SonarQube プロジェクトキー形式:</span>{" "}
                  <span className={styles.codeAmber}>&#123;org&#125;_&#123;repo&#125;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeGreen}>ダッシュボード URL:</span>{" "}
                  <span className={styles.codeString}>
                    https://sonar.company.com/dashboard?id=&#123;org&#125;_&#123;repo&#125;
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>プレースホルダー</th>
                    <th className={styles.th}>展開される値</th>
                    <th className={styles.th}>例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.td}>
                      <code>&#123;repo&#125;</code> / <code>&#123;repository&#125;</code>
                    </td>
                    <td className={styles.td}>リポジトリ名</td>
                    <td className={styles.td}>
                      <code>my-backend</code>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>&#123;pr&#125;</code> / <code>&#123;pr number&#125;</code>
                    </td>
                    <td className={styles.td}>PR 番号</td>
                    <td className={styles.td}>
                      <code>42</code>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>&#123;workspace&#125;</code> / <code>&#123;org&#125;</code>
                    </td>
                    <td className={styles.td}>組織名</td>
                    <td className={styles.td}>
                      <code>acme-corp</code>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.td}>
                      <code>&#123;project&#125;</code>
                    </td>
                    <td className={styles.td}>Azure DevOps プロジェクト名</td>
                    <td className={styles.td}>
                      <code>MyProject</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Ch6 refs */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📚 Chapter 6 参考 URL</h3>
            <div className={styles.refGrid}>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】MCP サーバー統合</div>
                <Ext href="https://docs.coderabbit.ai/integrations/mcp-servers.md">
                  https://docs.coderabbit.ai/integrations/mcp-servers.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Knowledge Base - MCP コンテキスト</div>
                <Ext href="https://docs.coderabbit.ai/knowledge-base/mcp-context.md">
                  https://docs.coderabbit.ai/knowledge-base/mcp-context.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Slack Agent 接続</div>
                <Ext href="https://docs.coderabbit.ai/slack-agent/connections.md">
                  https://docs.coderabbit.ai/slack-agent/connections.md
                </Ext>
              </div>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* ══════════════ CH7: TOOLS / CI ══════════════ */}
        <section className={styles.chapter} id="ch7">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNum}>7</div>
            <h2 className={styles.chapterTitle}>
              <span>ツール</span> &amp; CI/CD 連携{" "}
              <span className={`${styles.klevel} ${styles.kl2}`}>K-Level: 適用</span>
            </h2>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>7.1 40+ 静的解析ツールの自動統合</h3>
            <p className={styles.paragraph}>
              CodeRabbit
              は各言語の代表的な静的解析ツールを自動実行し、結果をインラインコメントに統合します。設定ファイルが存在すればそれを優先使用します。
            </p>

            <div className={styles.progressList}>
              <div className={styles.progressItem}>
                <div className={styles.progressLabel}>
                  <span>JavaScript / TypeScript</span>
                  <span style={{ color: "var(--neon-cyan)" }}>ESLint + Biome + Oxlint</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div
                    className={styles.progressBar}
                    style={{
                      width: "95%",
                      background: "linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))",
                      // @ts-expect-error custom property trigger
                      "--target-width": "95%",
                    }}
                  />
                </div>
              </div>
              <div className={styles.progressItem}>
                <div className={styles.progressLabel}>
                  <span>Python</span>
                  <span style={{ color: "var(--neon-green)" }}>Ruff + Flake8 + Pylint</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div
                    className={styles.progressBar}
                    style={{
                      width: "90%",
                      background: "linear-gradient(90deg, var(--neon-green), var(--neon-cyan))",
                      // @ts-expect-error custom property trigger
                      "--target-width": "90%",
                    }}
                  />
                </div>
              </div>
              <div className={styles.progressItem}>
                <div className={styles.progressLabel}>
                  <span>Go</span>
                  <span style={{ color: "var(--neon-amber)" }}>golangci-lint</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div
                    className={styles.progressBar}
                    style={{
                      width: "88%",
                      background: "linear-gradient(90deg, var(--neon-amber), var(--neon-green))",
                      // @ts-expect-error custom property trigger
                      "--target-width": "88%",
                    }}
                  />
                </div>
              </div>
              <div className={styles.progressItem}>
                <div className={styles.progressLabel}>
                  <span>Rust</span>
                  <span style={{ color: "var(--neon-pink)" }}>Clippy</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div
                    className={styles.progressBar}
                    style={{
                      width: "85%",
                      background: "linear-gradient(90deg, var(--neon-pink), var(--neon-amber))",
                      // @ts-expect-error custom property trigger
                      "--target-width": "85%",
                    }}
                  />
                </div>
              </div>
              <div className={styles.progressItem}>
                <div className={styles.progressLabel}>
                  <span>セキュリティ全般</span>
                  <span style={{ color: "var(--neon-purple)" }}>
                    Semgrep + OpenGrep + Betterleaks + Trivy
                  </span>
                </div>
                <div className={styles.progressBarBg}>
                  <div
                    className={styles.progressBar}
                    style={{
                      width: "92%",
                      background: "linear-gradient(90deg, var(--neon-purple), var(--neon-pink))",
                      // @ts-expect-error custom property trigger
                      "--target-width": "92%",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>カテゴリ</th>
                    <th className={styles.th}>対応ツール（抜粋）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.td}>JavaScript/TS</td>
                    <td className={styles.td}>ESLint, Biome, Oxlint, ember-template-lint</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>Python</td>
                    <td className={styles.td}>Ruff, Flake8, Pylint, Bandit</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>Java/Kotlin</td>
                    <td className={styles.td}>PMD, Detekt</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>Ruby</td>
                    <td className={styles.td}>RuboCop</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>PHP</td>
                    <td className={styles.td}>PHPCS, PHPMD, PHPStan</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>Go</td>
                    <td className={styles.td}>golangci-lint</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>Rust</td>
                    <td className={styles.td}>Clippy</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>Swift</td>
                    <td className={styles.td}>SwiftLint</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>CSS</td>
                    <td className={styles.td}>Stylelint</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>Infra/Config</td>
                    <td className={styles.td}>Checkov, TFLint, Hadolint, actionlint, YAMLlint</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>セキュリティ</td>
                    <td className={styles.td}>
                      Semgrep, OpenGrep, Trivy, TruffleHog, OSV-Scanner, Betterleaks
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.td}>SQL</td>
                    <td className={styles.td}>SQLFluff</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>Shell</td>
                    <td className={styles.td}>ShellCheck</td>
                  </tr>
                  <tr>
                    <td className={styles.td}>Markdown</td>
                    <td className={styles.td}>markdownlint, LanguageTool</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>7.2 CI/CD パイプライン解析</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong>CodeRabbit は CI/CD
              の失敗ログを読み取り、失敗した箇所のコードラインに直接修正提案を投稿します。
            </p>

            <div className={styles.mermaidWrap}>
              <div id="mermaid-pipeline">
                <MermaidDiagram chart={DIAG_PIPELINE} />
              </div>
            </div>

            <h4 className={styles.subsectionTitle}>CircleCI 連携設定例</h4>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>.coderabbit.yaml</span>
                <span className={styles.codeLang}>YAML</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`integrations:\n  circleci:\n    enabled: true`}
                />
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.codeKeyword}>integrations</span>:
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.codeKeyword}>circleci</span>:
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.codeKeyword}>enabled</span>:{" "}
                  <span className={styles.codeGreen}>true</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>7.3 IDE・CLI 連携</h3>
            <p className={styles.paragraph}>PR を開く前の段階でもコードレビューが可能です。</p>

            <div className={styles.examGrid}>
              <div className={styles.examCard}>
                <div className={styles.examTitle}>🖥️ VS Code / Cursor / Windsurf</div>
                <div className={styles.examStars}>★★★★★</div>
                <div className={styles.examDesc}>
                  IDE 拡張をインストールするだけでコミット前にリアルタイムレビューを取得
                </div>
              </div>
              <div className={styles.examCard}>
                <div className={styles.examTitle}>💻 CLI ツール</div>
                <div className={styles.examStars}>★★★★☆</div>
                <div className={styles.examDesc}>
                  Claude Code / Cursor / Codex / Gemini に CodeRabbit
                  プラグインを組み込んで自律レビュー
                </div>
              </div>
            </div>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>CLI commands</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`claude install coderabbit-skill\n\ncoderabbit review --diff HEAD~1`}
                />
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}>
                    # Claude Code での CodeRabbit CLI スキル追加
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeGreen}>claude</span>{" "}
                  <span className={styles.codeString}>install coderabbit-skill</span>
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}># 手動 CLI レビュー実行</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeGreen}>coderabbit</span>{" "}
                  <span className={styles.codeString}>review --diff HEAD~1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ch7 refs */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📚 Chapter 7 参考 URL</h3>
            <div className={styles.refGrid}>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】ツール一覧</div>
                <Ext href="https://docs.coderabbit.ai/tools/index.md">
                  https://docs.coderabbit.ai/tools/index.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】CI/CD パイプライン解析</div>
                <Ext href="https://docs.coderabbit.ai/pr-reviews/cicd-pipeline-analysis.md">
                  https://docs.coderabbit.ai/pr-reviews/cicd-pipeline-analysis.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】CircleCI 連携</div>
                <Ext href="https://docs.coderabbit.ai/integrations/circleci.md">
                  https://docs.coderabbit.ai/integrations/circleci.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】IDE 拡張</div>
                <Ext href="https://docs.coderabbit.ai/ide/index.md">
                  https://docs.coderabbit.ai/ide/index.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】CLI ツール</div>
                <Ext href="https://docs.coderabbit.ai/cli/index.md">
                  https://docs.coderabbit.ai/cli/index.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Claude Code 連携</div>
                <Ext href="https://docs.coderabbit.ai/cli/claude-code-integration.md">
                  https://docs.coderabbit.ai/cli/claude-code-integration.md
                </Ext>
              </div>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* ══════════════ CH8: ADVANCED ══════════════ */}
        <section className={styles.chapter} id="ch8">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNum}>8</div>
            <h2 className={styles.chapterTitle}>
              <span>上級テクニック</span> — 真のエキスパートへ{" "}
              <span className={`${styles.klevel} ${styles.kl3}`}>K-Level: 創造</span>
            </h2>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>8.1 ast-grep による構文精密レビュー</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong>
              AST（抽象構文木）ベースのパターンマッチングで、テキスト検索では発見できない構造的なコードパターンを検出します。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>ast-grep config</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`reviews:\n  path_instructions:\n    - path: "src/**/*.ts"\n      instructions: |\n        Use ast-grep to detect any usage of \`document.write()\`. This is banned in our codebase due to XSS risks.\n\n# ast-grep ルールファイル (.ast-grep/rules/no-console.yaml)\nid: no-console-log\nlanguage: TypeScript\nrule:\n  pattern: console.log($$$)\nmessage: 本番コードに console.log を残さないでください\nseverity: warning`}
                />
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.codeKeyword}>reviews</span>:
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.codeKeyword}>path_instructions</span>:
                </div>
                <div className={styles.codeLine}>
                  {"    "}- <span className={styles.codeKeyword}>path</span>:{" "}
                  <span className={styles.codeString}>&quot;src{`/**/`}*.ts&quot;</span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>instructions</span>:{" "}
                  <span className={styles.codeString}>|</span>
                </div>
                <div className={styles.codeLine}>
                  {
                    "        Use ast-grep to detect any usage of `document.write()`. This is banned in our codebase due to XSS risks."
                  }
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}>
                    # ast-grep ルールファイル (.ast-grep/rules/no-console.yaml)
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeKeyword}>id</span>:{" "}
                  <span className={styles.codeString}>no-console-log</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeKeyword}>language</span>:{" "}
                  <span className={styles.codeString}>TypeScript</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeKeyword}>rule</span>:
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.codeKeyword}>pattern</span>:{" "}
                  <span className={styles.codeString}>console.log($$$)</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeKeyword}>message</span>:{" "}
                  <span className={styles.codeString}>
                    本番コードに console.log を残さないでください
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeKeyword}>severity</span>:{" "}
                  <span className={styles.codeString}>warning</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>8.2 Pre-Merge Checks — マージ前の品質ゲート</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong>PR
              マージ前に自動実行されるカスタム検証ロジック。自然言語で条件を定義できます。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>.coderabbit.yaml</span>
                <span className={styles.codeLang}>YAML</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`reviews:\n  custom_checks:\n    - name: "migration-has-rollback"\n      description: "DBマイグレーションには必ずロールバックが必要"\n      instructions: |\n        db/migrations/ 配下のファイルが変更されている場合: up() / down() の両メソッドが存在することを確認。 down() が存在しない場合は FAIL。\n\n    - name: "no-secrets-in-code"\n      description: "ハードコードされた認証情報の検出"\n      instructions: |\n        API キー・パスワード・トークンのハードコーディングを検出。 環境変数 (process.env.*) 経由でない認証情報は FAIL。`}
                />
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.codeKeyword}>reviews</span>:
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.codeKeyword}>custom_checks</span>:
                </div>
                <div className={styles.codeLine}>
                  {"    "}- <span className={styles.codeKeyword}>name</span>:{" "}
                  <span className={styles.codeString}>&quot;migration-has-rollback&quot;</span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>description</span>:{" "}
                  <span className={styles.codeString}>
                    &quot;DBマイグレーションには必ずロールバックが必要&quot;
                  </span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>instructions</span>:{" "}
                  <span className={styles.codeString}>|</span>
                </div>
                <div className={styles.codeLine}>
                  {
                    "        db/migrations/ 配下のファイルが変更されている場合: up() / down() の両メソッドが存在することを確認。 down() が存在しない場合は FAIL。"
                  }
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  {"    "}- <span className={styles.codeKeyword}>name</span>:{" "}
                  <span className={styles.codeString}>&quot;no-secrets-in-code&quot;</span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>description</span>:{" "}
                  <span className={styles.codeString}>
                    &quot;ハードコードされた認証情報の検出&quot;
                  </span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>instructions</span>:{" "}
                  <span className={styles.codeString}>|</span>
                </div>
                <div className={styles.codeLine}>
                  {
                    "        API キー・パスワード・トークンのハードコーディングを検出。 環境変数 (process.env.*) 経由でない認証情報は FAIL。"
                  }
                </div>
              </div>
            </div>

            <div className={`${styles.callout} ${styles.warning}`}>
              <span className={styles.calloutIcon}>⚠️</span>
              <div className={styles.calloutBody}>
                <strong>Pre-Merge Checks は GitHub Status Check として統合されます。</strong>PR
                のマージブロック条件として設定できます（Branch Protection Rules
                との組み合わせ推奨）。
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>8.3 Global Overrides — コンプライアンス強制</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong>組織管理者のみが設定でき、全リポジトリの個別 YAML
              を含めたあらゆる設定より優先される最強レイヤー。
            </p>

            <div className={`${styles.callout} ${styles.danger}`}>
              <span className={styles.calloutIcon}>🚨</span>
              <div className={styles.calloutBody}>
                <strong>Global Overrides は全リポジトリに強制適用されます。</strong>
                誤った設定は組織全体のレビューワークフローに影響するため、必ずステージング環境でテストしてから適用してください。
              </div>
            </div>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>Global Overrides</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`reviews:\n  profile: "assertive"\n  path_instructions:\n    - path: "**/*.sql"\n      instructions: |\n        DROP TABLE / TRUNCATE を含む文を発見した場合、 必ず DANGER レベルで警告。承認なしのマージを禁止。`}
                />
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}>
                    # Organization Settings → Global Overrides
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}>
                    # yaml-language-server:
                    $schema=https://coderabbit.ai/integrations/schema.v2.json
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeKeyword}>reviews</span>:
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.codeKeyword}>profile</span>:{" "}
                  <span className={styles.codeString}>&quot;assertive&quot;</span>
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.codeKeyword}>path_instructions</span>:
                </div>
                <div className={styles.codeLine}>
                  {"    "}- <span className={styles.codeKeyword}>path</span>:{" "}
                  <span className={styles.codeString}>&quot;**/*.sql&quot;</span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.codeKeyword}>instructions</span>:{" "}
                  <span className={styles.codeString}>|</span>
                </div>
                <div className={styles.codeLine}>
                  {
                    "        DROP TABLE / TRUNCATE を含む文を発見した場合、 必ず DANGER レベルで警告。承認なしのマージを禁止。"
                  }
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}>
                    # スカラー: 上書き / オブジェクト: 再帰的マージ
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}>
                    # 配列: キーで照合後マージ (path_instructions は path がキー)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>8.4 Learnings の健全性維持サイクル</h3>

            <div className={styles.mermaidWrap}>
              <div id="mermaid-learnings">
                <MermaidDiagram chart={DIAG_LEARNINGS} />
              </div>
            </div>

            <h4 className={styles.subsectionTitle}>運用ベストプラクティス</h4>
            <ul className={styles.stepList}>
              <li>
                <span className={styles.stepNum}>Q</span>
                <div className={styles.stepContent}>
                  <strong>四半期レビュー：</strong>古い・矛盾する Learning
                  を特定して削除。技術スタックが変わった後は特に重要
                </div>
              </li>
              <li>
                <span className={styles.stepNum}>🔍</span>
                <div className={styles.stepContent}>
                  <strong>類似検索を活用：</strong>「error
                  handling」「authentication」等のキーワードで意味的に類似した Learning を一括確認
                </div>
              </li>
              <li>
                <span className={styles.stepNum}>⚡</span>
                <div className={styles.stepContent}>
                  <strong>Learning が無視される場合：</strong>「Before responding, review all
                  Learnings to ensure none are ignored.」という補強ルールを追加
                </div>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              8.5 Slack Agent — AI エージェントをワークスペースに
            </h3>
            <p className={styles.paragraph}>
              CodeRabbit Agent for Slack は Slack 上で直接 AI コーディング支援を実現します。
            </p>

            <div className={styles.trendCard}>
              <div className={styles.trendTag}>🔮 最新機能</div>
              <div className={styles.trendTitle}>スコープ管理による権限制御</div>
              <div className={styles.trendBody}>
                Slack
                チャンネルごとに「スコープ」を設定し、アクセス可能なリポジトリ・外部ツール・消費上限を個別管理。本番リポジトリへのアクセスを制限しつつ、開発リポジトリでは広い権限を付与するような細粒度制御が可能。
              </div>
            </div>

            <div className={styles.trendCard}>
              <div className={styles.trendTag}>🔮 最新機能</div>
              <div className={styles.trendTitle}>Automations — 定期実行タスク</div>
              <div className={styles.trendBody}>
                Slack Agent のオートメーション機能により、「毎週月曜に未解決 PR の要約を投稿」「CI
                失敗時に自動分析を実行」といったスケジュールトリガーを設定可能。
              </div>
            </div>
          </div>

          {/* Ch8 refs */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📚 Chapter 8 参考 URL</h3>
            <div className={styles.refGrid}>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】ast-grep 指示</div>
                <Ext href="https://docs.coderabbit.ai/configuration/ast-grep-instructions.md">
                  https://docs.coderabbit.ai/configuration/ast-grep-instructions.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Custom Checks</div>
                <Ext href="https://docs.coderabbit.ai/pr-reviews/custom-checks.md">
                  https://docs.coderabbit.ai/pr-reviews/custom-checks.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Pre-Merge Checks</div>
                <Ext href="https://docs.coderabbit.ai/pr-reviews/pre-merge-checks.md">
                  https://docs.coderabbit.ai/pr-reviews/pre-merge-checks.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Slack Agent</div>
                <Ext href="https://docs.coderabbit.ai/slack-agent/index.md">
                  https://docs.coderabbit.ai/slack-agent/index.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Scopes</div>
                <Ext href="https://docs.coderabbit.ai/slack-agent/scopes.md">
                  https://docs.coderabbit.ai/slack-agent/scopes.md
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refCat}>【公式 Docs】Automations</div>
                <Ext href="https://docs.coderabbit.ai/slack-agent/automations.md">
                  https://docs.coderabbit.ai/slack-agent/automations.md
                </Ext>
              </div>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* ══════════════ REFERENCES ══════════════ */}
        <section className={styles.chapter} id="refs">
          <div className={styles.chapterHeader}>
            <div
              className={styles.chapterNum}
              style={{ borderColor: "var(--neon-amber)", color: "var(--neon-amber)" }}
            >
              📚
            </div>
            <h2 className={styles.chapterTitle}>
              全参考 <span>URL 一覧</span>
            </h2>
          </div>

          <h3 className={styles.sectionTitle}>🏠 公式ドキュメント（一次情報源）</h3>
          <div className={styles.refGrid}>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】ホーム</div>
              <Ext href="https://docs.coderabbit.ai/">https://docs.coderabbit.ai/</Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】完全インデックス</div>
              <Ext href="https://docs.coderabbit.ai/llms.txt">
                https://docs.coderabbit.ai/llms.txt
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 App】Web アプリ</div>
              <Ext href="https://app.coderabbit.ai/">https://app.coderabbit.ai/</Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式】料金プラン</div>
              <Ext href="https://coderabbit.ai/pricing">https://coderabbit.ai/pricing</Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Schema】設定スキーマ</div>
              <Ext href="https://coderabbit.ai/integrations/schema.v2.json">
                https://coderabbit.ai/integrations/schema.v2.json
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 App】Learnings ダッシュボード</div>
              <Ext href="https://app.coderabbit.ai/learnings">
                https://app.coderabbit.ai/learnings
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 App】MCP 統合設定</div>
              <Ext href="https://app.coderabbit.ai/integrations">
                https://app.coderabbit.ai/integrations
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】Quickstart</div>
              <Ext href="https://docs.coderabbit.ai/getting-started/quickstart.md">
                https://docs.coderabbit.ai/getting-started/quickstart.md
              </Ext>
            </div>
          </div>

          <h3 className={styles.sectionTitle} style={{ marginTop: "1.5rem" }}>
            🔧 設定・カスタマイズ関連
          </h3>
          <div className={styles.refGrid}>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】Configuration Reference</div>
              <Ext href="https://docs.coderabbit.ai/reference/configuration.md">
                https://docs.coderabbit.ai/reference/configuration.md
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】YAML Validator</div>
              <Ext href="https://docs.coderabbit.ai/configuration/yaml-validator.md">
                https://docs.coderabbit.ai/configuration/yaml-validator.md
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】自動レビュー制御</div>
              <Ext href="https://docs.coderabbit.ai/configuration/auto-review.md">
                https://docs.coderabbit.ai/configuration/auto-review.md
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】組織設定</div>
              <Ext href="https://docs.coderabbit.ai/guides/organization-settings.md">
                https://docs.coderabbit.ai/guides/organization-settings.md
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】設定例 (Django)</div>
              <Ext href="https://docs.coderabbit.ai/configuration/example/python/django.md">
                https://docs.coderabbit.ai/configuration/example/python/django.md
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】設定例 (Expo)</div>
              <Ext href="https://docs.coderabbit.ai/configuration/example/typescript/expo.md">
                https://docs.coderabbit.ai/configuration/example/typescript/expo.md
              </Ext>
            </div>
          </div>

          <h3 className={styles.sectionTitle} style={{ marginTop: "1.5rem" }}>
            🤖 エージェント・AI 関連
          </h3>
          <div className={styles.refGrid}>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】CodeRabbit Plan 概要</div>
              <Ext href="https://docs.coderabbit.ai/plan/index.md">
                https://docs.coderabbit.ai/plan/index.md
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】Agent Handoff</div>
              <Ext href="https://docs.coderabbit.ai/plan/agent-handoff.md">
                https://docs.coderabbit.ai/plan/agent-handoff.md
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】Slop Detection</div>
              <Ext href="https://docs.coderabbit.ai/pr-reviews/slop-detection.md">
                https://docs.coderabbit.ai/pr-reviews/slop-detection.md
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】Coding Plan 作成</div>
              <Ext href="https://docs.coderabbit.ai/plan/create-plan.md">
                https://docs.coderabbit.ai/plan/create-plan.md
              </Ext>
            </div>
          </div>

          <h3 className={styles.sectionTitle} style={{ marginTop: "1.5rem" }}>
            📊 管理・エンタープライズ
          </h3>
          <div className={styles.refGrid}>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】管理概要</div>
              <Ext href="https://docs.coderabbit.ai/management/index.md">
                https://docs.coderabbit.ai/management/index.md
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】Enterprise SSO</div>
              <Ext href="https://docs.coderabbit.ai/management/sso/index.md">
                https://docs.coderabbit.ai/management/sso/index.md
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】監査ログ</div>
              <Ext href="https://docs.coderabbit.ai/management/audit-logs.md">
                https://docs.coderabbit.ai/management/audit-logs.md
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】カスタムロール</div>
              <Ext href="https://docs.coderabbit.ai/management/custom-roles.md">
                https://docs.coderabbit.ai/management/custom-roles.md
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】レポート</div>
              <Ext href="https://docs.coderabbit.ai/management/reports/index.md">
                https://docs.coderabbit.ai/management/reports/index.md
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Docs】Glossary</div>
              <Ext href="https://docs.coderabbit.ai/reference/glossary.md">
                https://docs.coderabbit.ai/reference/glossary.md
              </Ext>
            </div>
          </div>

          <h3 className={styles.sectionTitle} style={{ marginTop: "1.5rem" }}>
            🌐 外部参考資料
          </h3>
          <div className={styles.refGrid}>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【公式 Blog】CodeRabbit ブログ</div>
              <Ext href="https://coderabbit.ai/blog">https://coderabbit.ai/blog</Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【コミュニティ】Discord</div>
              <Ext href="https://discord.gg/coderabbit">https://discord.gg/coderabbit</Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【外部ライブラリ】minimatch (glob パターン)</div>
              <Ext href="https://github.com/isaacs/minimatch">
                https://github.com/isaacs/minimatch
              </Ext>
            </div>
            <div className={styles.refCard}>
              <div className={styles.refCat}>【外部 Docs】MCP プロトコル仕様</div>
              <Ext href="https://modelcontextprotocol.io/">https://modelcontextprotocol.io/</Ext>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "3rem",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
            }}
          >
            <p>
              Generated: 2025-06 | Source:{" "}
              <Ext href="https://docs.coderabbit.ai/">docs.coderabbit.ai</Ext> (一次情報源)
            </p>
            <p style={{ marginTop: "0.3rem" }}>
              CodeRabbit 公式ドキュメントに基づく中上級者向けガイド
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
