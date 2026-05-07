import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import ChecklistApp from "./ChecklistApp";
import ExamplesApp from "./ExamplesApp";
import styles from "./page.module.css";
import StepsApp from "./StepsApp";

const MERMAID_OVERVIEW = `graph LR
SKILL["📄 SKILL.md\\nオープンスタンダード"]
subgraph GC["💻 Gemini CLI"]
GCi["ターミナルネイティブ\\nAIエージェント"]
end
subgraph AG["🚀 Antigravity"]
AGi["エージェントファースト IDE\\nVSCodeフォーク"]
end
subgraph CC["🤖 Claude Code"]
CCi["Anthropic製\\nコーディングエージェント"]
end
SKILL --> GC
SKILL --> AG
SKILL --> CC
style SKILL fill:#d1fae5,stroke:#059669,color:#065f46
style GCi fill:#bfdbfe,stroke:#0284c7,color:#0c4a6e
style AGi fill:#ede9fe,stroke:#7c3aed,color:#3b0764
style CCi fill:#fef3c7,stroke:#d97706,color:#78350f`;

const MERMAID_WHY_COMPARE = `graph TD
subgraph 従来の方法["❌ 従来の方法（非効率）"]
A1["👤 ユーザー指示"] --> B1["AIエージェント"]
B1 --> C1["📚 ドキュメント全体を読む\\n（大量トークン消費）"]
C1 --> D1["🔥 コンテキスト飽和\\n精度低下・速度低下"]
end
subgraph skill_way["✅ SKILL.md を使う方法（効率的）"]
A2["👤 ユーザー指示"] --> B2["AIエージェント"]
B2 -->|"関連スキルを\\nオンデマンド検索"| C2["📄 SKILL.md だけ読む\\n（最小トークン消費）"]
C2 --> D2["⚡ 高精度・高速・低コスト"]
end
style D1 fill:#fecaca,stroke:#dc2626,color:#7f1d1d
style D2 fill:#d1fae5,stroke:#059669,color:#065f46
style C2 fill:#bfdbfe,stroke:#0284c7,color:#0c4a6e`;

const MERMAID_WHY_LEVELS = `graph LR
L1["🏷️ レベル1: メタデータ\\nname + description\\n常にコンテキストにある\\n～100 tokens\\nセッション開始時に読込"]
L2["📄 レベル2: SKILL.md 本文\\nスキルが呼ばれたときのみ\\n5,000 tokens以内推奨\\n具体的な手順・制約"]
L3["📚 レベル3: 参照ファイル\\n本文から参照された時のみ\\n容量無制限\\nAPIドキュメント等"]
L1 -->|"スキルが選ばれたとき"| L2
L2 -->|"本文から参照されたとき"| L3
style L1 fill:#fef3c7,stroke:#f59e0b,color:#78350f
style L2 fill:#bfdbfe,stroke:#0284c7,color:#0c4a6e
style L3 fill:#d1fae5,stroke:#059669,color:#065f46`;

const MERMAID_HOWTO = `graph LR
A["---\\nYAML\\nフロントマター\\n---"]
B["# Title\\nスキル名"]
C["## Overview\\n目的・概要（1〜2文）"]
D["## Before Starting\\n前提条件・必要な入力"]
E["## Step-by-Step Guide\\n具体的な実行手順\\n（最重要）"]
F["## Examples\\n入力例と出力例\\nFew-shot学習"]
G["## Rules\\n禁止事項と推奨事項\\n❌と✅"]
A --> B --> C --> D --> E --> F --> G
style A fill:#fef3c7,stroke:#f59e0b,color:#78350f
style E fill:#d1fae5,stroke:#059669,color:#065f46
style G fill:#ede9fe,stroke:#7c3aed,color:#3b0764`;

const MERMAID_INSTALL_SCOPE = `graph TB
Root["📂 スキルの配置場所"]
Root --> Global["🌍 グローバルスコープ\\n全プロジェクトで有効"]
Root --> Local["📁 ワークスペーススコープ\\nそのプロジェクトのみ"]
Global --> G1["~/.gemini/skills/\\nGemini CLI グローバル"]
Global --> G2["~/.gemini/antigravity/skills/\\nAntigravity グローバル"]
Local --> L1[".gemini/skills/\\nGemini CLI ローカル"]
Local --> L2[".agent/skills/\\nAntigravity ローカル"]
G1 -.->|"向いているスキル例"| GU["汎用スキル\\nコードレビュー・コミット\\nフォーマット等"]
L1 -.->|"向いているスキル例"| LU["プロジェクト専用\\nデプロイ手順・独自API仕様等"]
style Global fill:#bfdbfe,stroke:#0284c7,color:#0c4a6e
style Local fill:#d1fae5,stroke:#059669,color:#065f46
style GU fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e
style LU fill:#ecfdf5,stroke:#059669,color:#065f46`;

const MERMAID_INSTALL_LIFECYCLE = `sequenceDiagram
actor User as 👤 ユーザー
participant Agent as 🤖 AIエージェント
participant Meta as 📋 メタデータ
participant Body as 📄 SKILL.md本文
participant Refs as 📁 参照ファイル
Note over Agent,Meta: 1. ディスカバリーフェーズ
Agent->>Meta: skills/配下を走査しnameとdescriptionを抽出
Meta-->>Agent: メタデータをシステムプロンプトに注入
User->>Agent: "このコードをレビューして"
Note over Agent: 2. アクティベーション判断
Agent->>Agent: プロンプトとdescriptionを照合
Agent->>Agent: "frontend-reviewer"が最適と判断
Note over Agent,Body: 3. 承認とコンテキスト展開
Agent->>User: ツール実行の承認を求める
User->>Agent: 承認 ✅
Agent->>Body: SKILL.md本文を読み込む
Body-->>Agent: 手順・制約をコンテキストに展開
Note over Agent,Refs: 4. 動的リソース読み込み
Agent->>Refs: references/css-guidelines.md を読む
Refs-->>Agent: スタイルガイドラインを取得
Note over Agent,User: 5. 実行と結果返却
Agent->>User: SKILL.mdの手順に従いレビュー結果を提示`;

const MERMAID_CHECKLIST_ANTIPATTERNS = `graph TD
A["よくある失敗"]
A --> B["description が曖昧すぎる\\n→ スキルが呼ばれない"]
A --> C["SKILL.md が長すぎる\\n→ コンテキストを圧迫"]
A --> D["スキルを入れすぎる\\n→ AIが混乱\\n目安: 10〜15個以内"]
A --> E["スクリプトに\\nハードコードされた値\\n→ 再利用できない"]
A --> F["name がディレクトリ名と\\n不一致\\n→ 発見されない"]
style B fill:#fecaca,stroke:#dc2626,color:#7f1d1d
style C fill:#fecaca,stroke:#dc2626,color:#7f1d1d
style D fill:#fecaca,stroke:#dc2626,color:#7f1d1d
style E fill:#fecaca,stroke:#dc2626,color:#7f1d1d
style F fill:#fecaca,stroke:#dc2626,color:#7f1d1d`;

export const metadata: Metadata = {
  title: "SKILL.md 完全ガイド — Gemini CLI & Antigravity",
  description:
    "AIエージェントに「専門知識の教科書」を渡す仕組み — SKILL.md の構造・書き方・インストール手順を Gemini CLI & Antigravity 対応版で完全解説。",
};

export default function Page() {
  return (
    <div className={styles.wrap}>
      {/* ===== Hero header ===== */}
      <header className={styles.hero}>
        <div className={styles.tagRow}>
          <span className={`${styles.tag} ${styles.tagGreen}`}>Google Gemini / Antigravity</span>
          <span className={`${styles.tag} ${styles.tagSky}`}>初学者向け完全ガイド</span>
          <span className={`${styles.tag} ${styles.tagViolet}`}>2026年版</span>
          <span className={`${styles.tag} ${styles.tagTeal}`}>Gemini CLI v0.34.0</span>
          <span className={`${styles.tag} ${styles.tagIndigo}`}>Antigravity v1.20.3</span>
          <span className={`${styles.tag} ${styles.tagOrange}`}>最終更新 2026-03-21</span>
        </div>
        <h1 className={styles.heroTitle}>
          SKILL.md
          <br />
          <span className={styles.heroSub}>完全解剖ガイド</span>
        </h1>
        <p className={styles.heroLead}>
          AIエージェントに「専門知識の教科書」を渡す — Gemini CLI &amp; Antigravity 対応版
        </p>
        <nav className={styles.heroNav}>
          <a href="#overview" className={styles.navBtn}>
            🌐 概要
          </a>
          <a href="#why" className={styles.navBtn}>
            ❓ なぜ必要か
          </a>
          <a href="#structure" className={styles.navBtn}>
            📁 構造
          </a>
          <a href="#howto" className={styles.navBtn}>
            ✍️ 書き方
          </a>
          <a href="#steps" className={styles.navBtn}>
            🚀 ステップ解説
          </a>
          <a href="#install" className={styles.navBtn}>
            📦 インストール
          </a>
          <a href="#examples" className={styles.navBtn}>
            💡 実例集
          </a>
          <a href="#checklist" className={styles.navBtn}>
            ✅ チェックリスト
          </a>
          <a href="#whatsnew" className={`${styles.navBtn} ${styles.navBtnNew}`}>
            🆕 最新情報
          </a>
        </nav>
      </header>

      {/* s02: overview */}
      <section id="overview" className={styles.sec}>
        <h2 className={styles.secTitle}>🌐 SKILL.md とは何か</h2>

        {/* 3-col card grid */}
        <div className={styles.grid3}>
          <div className={`${styles.card} ${styles.cardGreen}`}>
            <div className={styles.cardIcon}>📄</div>
            <div className={styles.cardLabel}>Markdownファイル</div>
            <div className={styles.cardDesc}>
              AIエージェントへの「取扱説明書」。YAMLヘッダー＋指示本文で構成
            </div>
          </div>
          <div className={`${styles.card} ${styles.cardSky}`}>
            <div className={styles.cardIcon}>🧠</div>
            <div className={styles.cardLabel}>専門知識パッケージ</div>
            <div className={styles.cardDesc}>
              再利用可能な知識の塊。一度書けばどのプロジェクトでも使い回せる
            </div>
          </div>
          <div className={`${styles.card} ${styles.cardViolet}`}>
            <div className={styles.cardIcon}>🌐</div>
            <div className={styles.cardLabel}>オープンスタンダード</div>
            <div className={styles.cardDesc}>
              Gemini CLI・Antigravity・Claude Code など主要ツール共通対応
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className={styles.quote}>
          <div className={styles.quoteLabel}>💬 一言で言うと？</div>
          <blockquote className={styles.quoteText}>
            AIエージェントに「専門知識の教科書」を渡す仕組みです。
            <br />
            必要なときだけ読み込まれるので、効率よく高精度な応答が得られます。
          </blockquote>
        </div>

        {/* Mermaid: 2ツール比較 */}
        <h3 className={styles.secH3}>Gemini CLI vs Antigravity — 対応ツール比較</h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_OVERVIEW} />
        </div>

        {/* Comparison table */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={`${styles.thGradient} ${styles.tdLeft} ${styles.thTeal}`}>項目</th>
                <th className={`${styles.thGradient} ${styles.thSky}`}>Gemini CLI</th>
                <th className={`${styles.thGradient} ${styles.thViolet}`}>Antigravity</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.tr}>
                <td className={`${styles.tdLeft}`} style={{ fontWeight: 600, color: "#334155" }}>
                  形態
                </td>
                <td style={{ color: "#475569" }}>ターミナルアプリ</td>
                <td style={{ color: "#475569" }}>IDE（エディタ）</td>
              </tr>
              <tr className={styles.trEven}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  最新バージョン
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.badgeSky}`}>v0.34.0</span>
                  <div className={styles.textSlateLight}>2026-03-17</div>
                  <div className={styles.versionLinks}>
                    <a
                      href="https://github.com/google-gemini/gemini-cli/releases"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Releases
                    </a>
                    {" · "}
                    <a
                      href="https://geminicli.com/docs/changelogs/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Changelog
                    </a>
                  </div>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.badgeViolet}`}>v1.20.3</span>
                  <div className={styles.textSlateLight}>2026-03-05</div>
                  <div className={styles.versionLinks}>
                    <a
                      href="https://antigravity.google/changelog"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Changelog
                    </a>
                  </div>
                </td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  グローバルスキルパス
                </td>
                <td className={styles.mono} style={{ color: "#0369a1", fontSize: "0.75rem" }}>
                  {"~/.gemini/skills/"}
                </td>
                <td className={styles.mono} style={{ color: "#6d28d9", fontSize: "0.75rem" }}>
                  {"~/.gemini/antigravity/skills/"}
                </td>
              </tr>
              <tr className={styles.trEven}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  ワークスペーススキルパス
                </td>
                <td className={styles.mono} style={{ color: "#0369a1", fontSize: "0.75rem" }}>
                  {".gemini/skills/"}
                </td>
                <td className={styles.mono} style={{ color: "#6d28d9", fontSize: "0.75rem" }}>
                  {".agent/skills/"}
                </td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  インストールコマンド
                </td>
                <td className={styles.mono} style={{ color: "#0369a1", fontSize: "0.75rem" }}>
                  gemini skills install
                </td>
                <td style={{ color: "#475569", fontSize: "0.75rem" }}>GUI または CLI</td>
              </tr>
              <tr className={styles.trEven}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  SKILL.md サポート
                </td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ フル対応</td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ フル対応</td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  デフォルトモデル
                </td>
                <td className={styles.mono} style={{ color: "#0369a1", fontSize: "0.75rem" }}>
                  Auto (Gemini 3)
                  <br />
                  <span style={{ color: "#94a3b8" }}>(v0.29.0〜 タスクに応じて自動選択)</span>
                </td>
                <td className={styles.mono} style={{ color: "#6d28d9", fontSize: "0.75rem" }}>
                  gemini-3-flash-preview
                </td>
              </tr>
              <tr className={styles.trEven}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  最高精度モデル
                </td>
                <td className={styles.mono} style={{ color: "#0369a1", fontSize: "0.75rem" }}>
                  gemini-3.1-pro-preview
                  <br />
                  <span style={{ color: "#94a3b8" }}>
                    (v0.31.0〜,{" "}
                    <a
                      href="https://ai.google.dev/gemini-api/docs/models"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "underline" }}
                    >
                      アクセス要件を確認
                    </a>
                    )
                  </span>
                </td>
                <td className={styles.mono} style={{ color: "#6d28d9", fontSize: "0.75rem" }}>
                  gemini-3.1-pro-preview
                </td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  Plan Mode
                </td>
                <td style={{ fontWeight: 700, color: "#059669" }}>
                  ✅{" "}
                  <span className={styles.mono} style={{ fontWeight: 400, fontSize: "0.75rem" }}>
                    /plan
                  </span>{" "}
                  (v0.29.0〜)
                </td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ あり</td>
              </tr>
              <tr className={styles.trEven}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  skill-creator メタスキル
                </td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ 標準搭載 (v0.26.0〜)</td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ あり</td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  /rewind コマンド
                </td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ (v0.27.0〜)</td>
                <td style={{ color: "#94a3b8" }}>—</td>
              </tr>
              <tr className={styles.trEven}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  AGENTS.md 対応
                </td>
                <td style={{ color: "#475569", fontSize: "0.75rem" }}>
                  ⚙️ 設定が必要
                  <br />
                  <span style={{ color: "#94a3b8" }}>
                    (context.fileName に追加 / デフォルトは GEMINI.md)
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ (v1.20.3〜)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* s03: why */}
      <section id="why" className={styles.sec}>
        <h2 className={styles.secTitle}>❓ なぜ SKILL.md が必要なのか</h2>

        {/* Red alert: context saturation */}
        <div className={styles.alertRed}>
          <div className={styles.alertRedTitle}>🔥 コンテキスト飽和（Context Saturation）問題</div>
          <p className={styles.alertRedBody}>
            AIエージェントに「すべてのドキュメントを読ませる」アプローチでは、モデルの注意機構（Attention
            Mechanism）が分散し、重要な情報を見落としたり推論精度が著しく低下します。
            また大量のトークン消費によって速度低下・コスト増大が起きます。
          </p>
        </div>

        {/* Mermaid: 従来 vs SKILL.md */}
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_WHY_COMPARE} />
        </div>

        {/* Progressive disclosure */}
        <h3 className={styles.secH3}>
          📊 プログレッシブ・ディスクロージャー — 3段階読み込みの仕組み
        </h3>
        <p
          style={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.75, marginBottom: "1rem" }}
        >
          SKILL.md
          は「必要なときだけ、必要な分だけ」読み込まれます。この3段階設計によってトークン消費を極限まで抑えています。
        </p>

        {/* Mermaid: L1/L2/L3 levels */}
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_WHY_LEVELS} />
        </div>

        {/* 3-col level cards */}
        <div className={styles.grid3}>
          <div className={styles.cardAmberLight}>
            <div className={styles.cardLabel}>レベル1 / 常駐</div>
            <div className={styles.cardDesc}>
              セッション開始時に全スキルのメタデータをロード。1スキル約100トークンなので数十〜数百スキルを待機させてもOK
            </div>
          </div>
          <div className={styles.cardSkyLight}>
            <div className={styles.cardLabel}>レベル2 / オンデマンド</div>
            <div className={styles.cardDesc}>
              ユーザーの入力とdescriptionを意味論的に照合し、最適なスキルを特定。activate_skillツールで本文を展開
            </div>
          </div>
          <div className={styles.cardEmeraldLight}>
            <div className={styles.cardLabel}>レベル3 / 動的参照</div>
            <div className={styles.cardDesc}>
              本文中で参照された外部ファイルのみを動的に読み込む。スクリプトは実行結果のみがトークン消費
            </div>
          </div>
        </div>
      </section>

      {/* s04: structure */}
      <section id="structure" className={styles.sec}>
        <h2 className={styles.secTitle}>📁 ディレクトリ構造と SKILL.md の解剖</h2>

        {/* 2-col: file tree + anatomy */}
        <div className={styles.twoColGrid}>
          {/* Left: file tree */}
          <div>
            <h3 className={styles.fileTreeHead}>ディレクトリ構成</h3>
            <div className={styles.fileTree}>
              <pre className={styles.fileTreePre}>
                <span className={styles.ftDir}>📁 my-skill/</span>
                {"\n"}
                {"├── "}
                <span className={styles.ftReq}>📄 SKILL.md</span>
                {"        "}
                <span className={styles.ftComment}>← 必須・スキルの脳</span>
                {"\n"}
                {"├── "}
                <span className={styles.ftOpt}>📁 scripts/</span>
                {"        "}
                <span className={styles.ftComment}>← 任意</span>
                {"\n"}
                {"│   ├── "}
                <span className={styles.ftOpt}>run.py</span>
                {"\n"}
                {"│   └── "}
                <span className={styles.ftOpt}>util.sh</span>
                {"\n"}
                {"├── "}
                <span className={styles.ftOpt}>📁 references/</span>
                {"     "}
                <span className={styles.ftComment}>← 任意</span>
                {"\n"}
                {"│   └── "}
                <span className={styles.ftOpt}>api-docs.md</span>
                {"\n"}
                {"└── "}
                <span className={styles.ftOpt}>📁 assets/</span>
                {"         "}
                <span className={styles.ftComment}>← 任意</span>
                {"\n"}
                {"    └── "}
                <span className={styles.ftOpt}>template.tsx</span>
              </pre>
            </div>
            <div className={styles.legendList}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "#10b981" }} />
                <span style={{ fontWeight: 700, color: "#047857" }}>SKILL.md</span>
                <span style={{ color: "#64748b" }}>— 必須。YAMLメタデータ＋指示本文</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "#38bdf8" }} />
                <span style={{ fontWeight: 700, color: "#0369a1" }}>scripts/</span>
                <span style={{ color: "#64748b" }}>— 自動実行スクリプト（Python/Bash）</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "#a78bfa" }} />
                <span style={{ fontWeight: 700, color: "#6d28d9" }}>references/</span>
                <span style={{ color: "#64748b" }}>— 参照ドキュメント（必要時のみ読込）</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "#94a3b8" }} />
                <span style={{ fontWeight: 700, color: "#334155" }}>assets/</span>
                <span style={{ color: "#64748b" }}>— テンプレート・静的ファイル</span>
              </div>
            </div>
          </div>

          {/* Right: SKILL.md anatomy */}
          <div>
            <h3 className={styles.fileTreeHead}>SKILL.md の構成</h3>
            <div className={styles.anatStack}>
              <div className={`${styles.anatCard} ${styles.anatCardAmber}`}>
                <div className={styles.anatTitle} style={{ color: "#92400e" }}>
                  🔑 YAMLフロントマター（必須）
                </div>
                <div className={styles.anatBody} style={{ color: "#b45309" }}>
                  <code className={styles.codeInlineAmber}>---</code>
                  で囲まれたYAML形式のメタデータ。
                  <br />
                  <strong>name</strong>（識別子）と
                  <strong>description</strong>（トリガー条件）が最重要
                </div>
              </div>
              <div className={styles.anatConnect}>↕</div>
              <div className={`${styles.anatCard} ${styles.anatCardSky}`}>
                <div className={styles.anatTitle} style={{ color: "#075985" }}>
                  📝 マークダウン本文（必須）
                </div>
                <div className={styles.anatBody} style={{ color: "#0369a1" }}>
                  エージェントへの具体的な指示。以下のセクションで構成：
                  <br />
                  Overview → Before Starting → Step-by-Step → Examples → Rules
                </div>
              </div>
              <div className={styles.anatConnect}>↕</div>
              <div className={`${styles.anatCard} ${styles.anatCardEmerald}`}>
                <div className={styles.anatTitle} style={{ color: "#14532d" }}>
                  🔗 参照ファイルリンク（任意）
                </div>
                <div className={styles.anatBody} style={{ color: "#15803d" }}>
                  本文中で
                  <code className={styles.codeInlineEmerald}>references/api-docs.md</code>
                  のように外部ファイルを参照。必要時だけ読込
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* YAML front matter detail */}
        <h3 className={styles.secH3}>YAMLフロントマター 詳細解説</h3>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <span>SKILL.md</span>
            <span className={styles.codeLang}>YAML</span>
          </div>
          <div className={styles.codeBody}>
            <span className={styles.cs}>---</span>
            {"\n"}
            <span className={styles.cc}>
              {"# ✅ 必須: スキルの一意な識別子（ケバブケース・英語小文字）"}
            </span>
            {"\n"}
            <span className={styles.cm}>name</span>
            {": "}
            <span className={styles.cv}>git-commit-formatter</span>
            {"\n\n"}
            <span className={styles.cc}>
              {"# ✅ 必須: エージェントへのトリガー条件（最重要！）"}
            </span>
            {"\n"}
            <span className={styles.cc}>
              {"#    「いつ」「どんな言葉が出たら」このスキルを使うかを明記する"}
            </span>
            {"\n"}
            <span className={styles.cm}>description</span>
            {": "}
            <span className={styles.cs}>|</span>
            {"\n"}
            {"  "}
            <span className={styles.cv}>
              Gitコミットメッセージを Conventional Commits 仕様に整形する。
            </span>
            {"\n"}
            {"  "}
            <span className={styles.cv}>
              {"「コミット」「commit」「コミットメッセージ」などが出たら必ず使用。"}
            </span>
            {"\n"}
            {"  "}
            <span className={styles.cv}>コード変更の記録・バージョン管理作業で呼び出すこと。</span>
            {"\n\n"}
            <span className={styles.cc}>{"# 任意: 依存関係（一部ツールでサポート）"}</span>
            {"\n"}
            <span className={styles.cm}>compatibility</span>
            {":\n"}
            {"  - "}
            <span className={styles.cv}>git</span>
            {"\n"}
            {"  - "}
            <span className={styles.cv}>{"node >= 18"}</span>
            {"\n\n"}
            <span className={styles.cc}>
              {"# 任意: 手動呼び出し専用にする（危険な操作に有効）"}
            </span>
            {"\n"}
            <span className={styles.cc}>{"# disable-model-invocation: true"}</span>
            {"\n"}
            <span className={styles.cs}>---</span>
          </div>
        </div>

        {/* description warning */}
        <div className={styles.descWarnBox}>
          <div className={styles.descWarnTitle}>⚠️ description はエージェントの「発動スイッチ」</div>
          <div className={styles.descExGrid}>
            <div className={styles.descExBad}>
              <div className={styles.descExTitle} style={{ color: "#b91c1c" }}>
                ❌ 悪い例（曖昧）
              </div>
              <code className={styles.descExCode} style={{ color: "#7f1d1d" }}>
                description: コードをレビューするスキル。
              </code>
              <div className={styles.descExNote} style={{ color: "#dc2626" }}>
                → AIがいつ使うか判断できない
              </div>
            </div>
            <div className={styles.descExGood}>
              <div className={styles.descExTitle} style={{ color: "#14532d" }}>
                ✅ 良い例（具体的）
              </div>
              <code className={styles.descExCode} style={{ color: "#14532d" }}>
                {"description: |\n"}
                {"コードレビューを実行する。\n"}
                {'"review","レビュー","PR確認"が出たら必ず使う。'}
              </code>
              <div className={styles.descExNote} style={{ color: "#059669" }}>
                → トリガーが明確で確実に呼ばれる
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* s05: howto */}
      <section id="howto" className={styles.sec}>
        <h2 className={styles.secTitle}>✍️ SKILL.md の書き方（推奨テンプレート）</h2>

        <p
          style={{
            color: "#475569",
            fontSize: "0.875rem",
            lineHeight: 1.75,
            marginBottom: "1.25rem",
          }}
        >
          効果的な SKILL.md
          は以下の標準セクション構成に従います。各セクションの役割を理解して記述しましょう。
        </p>

        {/* Mermaid: structure flow */}
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_HOWTO} />
        </div>

        {/* Complete sample */}
        <h3 className={styles.secH3}>✅ 完全なサンプル — frontend-reviewer スキル</h3>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <span>SKILL.md</span>
            <span className={styles.codeLang}>Markdown</span>
          </div>
          <div className={styles.codeBody}>
            <span className={styles.cs}>---</span>
            {"\n"}
            <span className={styles.cm}>name</span>
            {": "}
            <span className={styles.cv}>frontend-reviewer</span>
            {"\n"}
            <span className={styles.cm}>description</span>
            {": "}
            <span className={styles.cs}>|</span>
            {"\n"}
            {"  "}
            <span className={styles.cv}>
              ReactおよびTypeScriptのフロントエンドコードをレビューし、
            </span>
            {"\n"}
            {"  "}
            <span className={styles.cv}>
              コンポーネント設計・パフォーマンス・アクセシビリティ(a11y)の
            </span>
            {"\n"}
            {"  "}
            <span className={styles.cv}>観点から品質を向上させる際に使用する。</span>
            {"\n"}
            {"  "}
            <span className={styles.cv}>
              {"「コードレビュー」「レビュー」「PR確認」が出たら使うこと。"}
            </span>
            {"\n"}
            <span className={styles.cs}>---</span>
            {"\n\n"}
            <span className={styles.ch}># Frontend Code Reviewer</span>
            {"\n\n"}
            <span className={styles.ch}>## Overview</span>
            {"\n"}
            {
              "Reactコンポーネントに対して一貫性のある厳格なレビューを行い、\nパフォーマンス・型安全性・アクセシビリティを向上させる。"
            }
            {"\n\n"}
            <span className={styles.ch}>## Before Starting</span>
            {"\n"}
            {
              "レビューを開始する前に以下を確認すること：\n- レビュー対象ファイルのパスをユーザーから取得\n- 依存するフックやユーティリティファイルも一緒に読み込む"
            }
            {"\n\n"}
            <span className={styles.ch}>## Step-by-Step Guide</span>
            {"\n"}
            {"1. "}
            <span className={styles.cw}>**文脈と依存関係の解析**</span>
            {": 対象ファイルと依存関係を追跡して読み込む\n"}
            {"2. "}
            <span className={styles.cw}>**静的解析のシミュレーション**</span>
            {": 型の安全性とReactの依存配列を検証\n"}
            {"3. "}
            <span className={styles.cw}>**パフォーマンス評価**</span>
            {": useMemo/useCallbackの欠落を特定\n"}
            {"4. "}
            <span className={styles.cw}>**a11y確認**</span>
            {": WAI-ARIA属性・キーボードナビゲーションを確認\n"}
            {"5. "}
            <span className={styles.cw}>**アーティファクト生成**</span>
            {": 修正後のコードスニペットと共に提示"}
            {"\n\n"}
            <span className={styles.ch}>## Examples</span>
            {"\n"}
            <span className={styles.cw}>**Input**</span>
            {": "}
            <span className={styles.cs}>{"`UserProfile.tsx`"}</span>
            {"のパフォーマンスをレビューして\n\n"}
            <span className={styles.cw}>**Output Structure**</span>
            {":\n"}
            {"1. 概要: 現在の実装におけるボトルネック\n"}
            {"2. 修正案: "}
            <span className={styles.cs}>{"`React.memo`"}</span>
            {"の適用箇所と修正コード\n"}
            {"3. 副作用の検証: 修正による影響範囲"}
            {"\n\n"}
            <span className={styles.ch}>## Rules</span>
            {"\n"}
            <span className={styles.ck}>❌</span>
            {" 絶対に行わないこと:\n"}
            {"- ビジネスロジックの意図を推測して勝手に変更すること\n"}
            {"- 不明な点を質問せずに仮定で進めること\n\n"}
            <span className={styles.cg}>✅</span>
            {" 必ず行うこと:\n"}
            {"- 変更提案の根拠として公式ドキュメントを引用\n"}
            {"- "}
            <span className={styles.cs}>{"`references/css-guidelines.md`"}</span>
            {" を参照してスタイルをレビュー"}
          </div>
        </div>
      </section>

      {/* s06: steps */}
      <section id="steps" className={styles.sec}>
        <h2 className={styles.secTitle}>🚀 ステップバイステップ — 初めてのスキル作成</h2>
        <StepsApp />
      </section>

      {/* s07: install */}
      <section id="install" className={styles.sec}>
        <h2 className={styles.secTitle}>📦 スキルのインストール方法</h2>

        <h3 className={styles.secH3}>スコープ選択（どこに置くか）</h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_INSTALL_SCOPE} />
        </div>

        {/* Gemini CLI commands */}
        <h3 className={styles.secH3}>
          Gemini CLI コマンド一覧
          <span style={{ fontSize: "0.875rem", fontWeight: 400, color: "#64748b" }}>
            {" "}
            （v0.34.0 対応）
          </span>
        </h3>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <span>shell</span>
            <span className={styles.codeLang}>BASH</span>
          </div>
          <div className={styles.codeBody}>
            <span className={styles.cc}>{"# ✅ Git リポジトリからインストール"}</span>
            {"\n"}
            <span className={styles.ck}>{"gemini"}</span>
            {" skills install https://github.com/example/my-skills.git\n\n"}
            <span className={styles.cc}>{"# ✅ サブディレクトリを指定してインストール"}</span>
            {"\n"}
            <span className={styles.ck}>{"gemini"}</span>
            {" skills install https://github.com/example/skills.git --path skills/firebase\n\n"}
            <span className={styles.cc}>{"# ✅ ローカルディレクトリからインストール"}</span>
            {"\n"}
            <span className={styles.ck}>{"gemini"}</span>
            {" skills install ./my-local-skill/\n\n"}
            <span className={styles.cc}>{"# ✅ インストール済みスキルを一覧表示"}</span>
            {"\n"}
            <span className={styles.ck}>{"gemini"}</span>
            {" skills list\n\n"}
            <span className={styles.cc}>{"# ✅ セッション中にスキルを無効化"}</span>
            {"\n"}
            {"/skills disable <スキル番号>\n\n"}
            <span className={styles.cc}>{"# ✅ スキルを更新"}</span>
            {"\n"}
            <span className={styles.ck}>{"gemini"}</span>
            {" skills update\n\n"}
            <span className={styles.cc}>
              {"# ──────────────────────────────────────────────────"}
            </span>
            {"\n"}
            <span className={styles.cc}>{"# 🆕 v0.26.0〜 skill-creator（スキル自動生成）"}</span>
            {"\n"}
            <span className={styles.cc}>
              {"# チャットで「新しいスキルを作成したい」と入力するだけで起動"}
            </span>
            {"\n\n"}
            <span className={styles.cc}>{"# 🆕 v0.27.0〜 /rewind（セッション履歴を遡る）"}</span>
            {"\n"}
            {"/rewind\n\n"}
            <span className={styles.cc}>
              {"# 🆕 v0.29.0〜 /plan（Plan Mode: read-only で安全に変更計画を立案）"}
            </span>
            {"\n"}
            {"/plan\n\n"}
            <span className={styles.cc}>
              {"# 🆕 v0.33.0〜 /plan にリサーチサブエージェント内蔵（さらに精密な計画）"}
            </span>
            {"\n"}
            <span className={styles.cc}>
              {"# /plan で起動後、自動的に深い調査・アノテーションが可能"}
            </span>
          </div>
        </div>

        {/* skills CLI */}
        <h3 className={styles.secH3} style={{ marginTop: "1.5rem" }}>
          skills CLI（統合管理ツール）
        </h3>
        <p
          style={{
            color: "#475569",
            fontSize: "0.875rem",
            lineHeight: 1.75,
            marginBottom: "0.75rem",
          }}
        >
          <code
            style={{
              background: "#f1f5f9",
              padding: "0.125rem 0.5rem",
              borderRadius: "0.25rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.875rem",
            }}
          >
            npx skills
          </code>{" "}
          コマンドを使うと、Gemini CLI と Antigravity の両方に同時にスキルを追加できます。
        </p>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <span>shell</span>
            <span className={styles.codeLang}>BASH</span>
          </div>
          <div className={styles.codeBody}>
            <span className={styles.cc}>{"# Gemini CLI と Antigravity 両方に追加"}</span>
            {"\n"}
            <span className={styles.ck}>{"npx"}</span>
            {" skills add firebase/agent-skills -a gemini-cli -a antigravity\n\n"}
            <span className={styles.cc}>{"# スキルを検索"}</span>
            {"\n"}
            <span className={styles.ck}>{"npx"}</span>
            {" skills find flutter\n\n"}
            <span className={styles.cc}>{"# スキルを削除"}</span>
            {"\n"}
            <span className={styles.ck}>{"npx"}</span>
            {" skills remove firebase/agent-skills\n\n"}
            <span className={styles.cc}>{"# インストール済みスキルを一覧表示"}</span>
            {"\n"}
            <span className={styles.ck}>{"npx"}</span>
            {" skills list"}
          </div>
        </div>

        {/* Antigravity manual copy */}
        <h3 className={styles.secH3} style={{ marginTop: "1.5rem" }}>
          Antigravity への手動コピー
        </h3>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <span>shell</span>
            <span className={styles.codeLang}>BASH</span>
          </div>
          <div className={styles.codeBody}>
            <span className={styles.cc}>
              {"# グローバルインストール（全プロジェクトで使えるようにする）"}
            </span>
            {"\n"}
            <span className={styles.ck}>{"cp"}</span>
            {" -r my-skill/ ~/.gemini/antigravity/skills/\n\n"}
            <span className={styles.cc}>
              {"# ワークスペースインストール（このプロジェクトだけ）"}
            </span>
            {"\n"}
            <span className={styles.ck}>{"cp"}</span>
            {" -r my-skill/ .agent/skills/"}
          </div>
        </div>

        {/* Lifecycle diagram */}
        <h3 className={styles.secH3} style={{ marginTop: "1.5rem" }}>
          スキルが呼び出されるまでの流れ
        </h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_INSTALL_LIFECYCLE} />
        </div>
      </section>

      {/* s08: examples */}
      <section id="examples" className={styles.sec}>
        <h2 className={styles.secTitle}>💡 パターン別 実例集</h2>
        <ExamplesApp />
      </section>

      {/* s09: checklist */}
      <section id="checklist" className={styles.sec}>
        <h2 className={styles.secTitle}>✅ ベストプラクティス &amp; チェックリスト</h2>

        {/* Anti-patterns */}
        <h3 className={styles.secH3}>❌ よくある失敗パターン</h3>
        <div className={styles.mermaidWrap} style={{ marginBottom: "1.5rem" }}>
          <MermaidDiagram chart={MERMAID_CHECKLIST_ANTIPATTERNS} />
        </div>

        {/* Interactive checklist */}
        <ChecklistApp />

        {/* Skill count guide */}
        <h3 className={styles.secH3} style={{ marginTop: "1.5rem" }}>
          📊 スキル数の目安
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div className={styles.skillCountRow}>
            <span className={styles.skillCountLabel}>1〜5個</span>
            <div className={styles.skillCountBar}>
              <div
                className={styles.skillCountFill}
                style={{ width: "70%", background: "#7dd3fc" }}
              />
            </div>
            <span className={styles.skillCountStatus} style={{ color: "#0369a1" }}>
              普通
            </span>
          </div>
          <div className={styles.skillCountRow}>
            <span className={styles.skillCountLabel}>6〜10個</span>
            <div className={styles.skillCountBar}>
              <div
                className={styles.skillCountFill}
                style={{ width: "90%", background: "#34d399" }}
              />
            </div>
            <span className={styles.skillCountStatus} style={{ color: "#059669" }}>
              最適 ⭐
            </span>
          </div>
          <div className={styles.skillCountRow}>
            <span className={styles.skillCountLabel}>11〜20個</span>
            <div className={styles.skillCountBar}>
              <div
                className={styles.skillCountFill}
                style={{ width: "80%", background: "#facc15" }}
              />
            </div>
            <span className={styles.skillCountStatus} style={{ color: "#a16207" }}>
              やや多め
            </span>
          </div>
          <div className={styles.skillCountRow}>
            <span className={styles.skillCountLabel}>30個以上</span>
            <div className={styles.skillCountBar}>
              <div
                className={styles.skillCountFill}
                style={{ width: "40%", background: "#f87171" }}
              />
            </div>
            <span className={styles.skillCountStatus} style={{ color: "#b91c1c" }}>
              非推奨
            </span>
          </div>
        </div>

        {/* Quick reference table */}
        <h3 className={styles.secH3} style={{ marginTop: "1.5rem" }}>
          📋 クイックリファレンス
        </h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th
                  className={`${styles.thGradient} ${styles.tdLeft}`}
                  style={{ color: "#134e4a" }}
                >
                  ツール
                </th>
                <th
                  className={`${styles.thGradient} ${styles.tdLeft}`}
                  style={{ color: "#134e4a" }}
                >
                  グローバルパス
                </th>
                <th
                  className={`${styles.thGradient} ${styles.tdLeft}`}
                  style={{ color: "#134e4a" }}
                >
                  ローカルパス
                </th>
                <th
                  className={`${styles.thGradient} ${styles.tdLeft}`}
                  style={{ color: "#134e4a" }}
                >
                  インストールコマンド
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.tr}>
                <td className={styles.tdLeft} style={{ fontWeight: 700, color: "#0369a1" }}>
                  Gemini CLI
                  <br />
                  <span className={styles.textSlateLight}>v0.34.0</span>
                </td>
                <td className={`${styles.tdLeft} ${styles.mono} ${styles.textSlate}`}>
                  ~/.gemini/skills/
                </td>
                <td className={`${styles.tdLeft} ${styles.mono} ${styles.textSlate}`}>
                  .gemini/skills/
                </td>
                <td className={`${styles.tdLeft} ${styles.mono} ${styles.textSlate}`}>
                  gemini skills install &lt;url&gt;
                </td>
              </tr>
              <tr className={styles.trEven}>
                <td className={styles.tdLeft} style={{ fontWeight: 700, color: "#6d28d9" }}>
                  Antigravity
                  <br />
                  <span className={styles.textSlateLight}>v1.20.3</span>
                </td>
                <td className={`${styles.tdLeft} ${styles.mono} ${styles.textSlate}`}>
                  ~/.gemini/antigravity/skills/
                </td>
                <td className={`${styles.tdLeft} ${styles.mono} ${styles.textSlate}`}>
                  .agent/skills/
                </td>
                <td className={`${styles.tdLeft} ${styles.mono} ${styles.textSlate}`}>
                  cp -r skill/ ~/.gemini/antigravity/skills/
                </td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.tdLeft} style={{ fontWeight: 700, color: "#059669" }}>
                  両方同時
                </td>
                <td className={styles.textSlate} colSpan={2} style={{ textAlign: "center" }}>
                  — npx skills CLI を使用 —
                </td>
                <td className={`${styles.tdLeft} ${styles.mono} ${styles.textSlate}`}>
                  npx skills add &lt;name&gt; -a gemini-cli -a antigravity
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* s10: whatsnew */}
      <section
        id="whatsnew"
        className={styles.sec}
        style={{
          background: "linear-gradient(135deg,#fff7ed,#fef3c7)",
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: "#fed7aa",
        }}
      >
        <h2 className={styles.secTitle} style={{ color: "#c2410c", borderBottomColor: "#fed7aa" }}>
          🆕 最新アップデート（2026年3月21日時点）
        </h2>

        {/* 2-col: Gemini CLI + Antigravity */}
        <div className={styles.newGrid}>
          {/* Gemini CLI */}
          <div
            className={styles.newCard}
            style={{ borderColor: "#bae6fd", background: "#ffffff", padding: "1.25rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <span
                className={styles.badge}
                style={{ background: "#0ea5e9", color: "#ffffff", padding: "0.25rem 0.75rem" }}
              >
                Gemini CLI
              </span>
              <span className={styles.badge} style={{ background: "#e0f2fe", color: "#0369a1" }}>
                v0.34.0 (2026-03-17)
              </span>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                fontSize: "0.875rem",
                color: "#475569",
              }}
            >
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <span
                  style={{
                    color: "#0ea5e9",
                    fontWeight: 700,
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                >
                  v0.26.0
                </span>
                <span>
                  <strong>skill-creator</strong> メタスキル標準搭載 + ジェネラリストエージェント追加
                </span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <span
                  style={{
                    color: "#0ea5e9",
                    fontWeight: 700,
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                >
                  v0.27.0
                </span>
                <span>
                  <strong>/rewind</strong> コマンド追加（セッション履歴を遡る）
                </span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <span
                  style={{
                    color: "#0ea5e9",
                    fontWeight: 700,
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                >
                  v0.29.0
                </span>
                <span>
                  Gemini 3 をデフォルトモデルに採用（
                  <code
                    style={{
                      background: "#f1f5f9",
                      padding: "0 0.25rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.75rem",
                    }}
                  >
                    Auto (Gemini 3)
                  </code>
                  ）
                </span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <span
                  style={{
                    color: "#0ea5e9",
                    fontWeight: 700,
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                >
                  v0.30.0
                </span>
                <span>
                  <strong>Gemini CLI SDK</strong>（
                  <code
                    style={{
                      background: "#f1f5f9",
                      padding: "0 0.25rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.75rem",
                    }}
                  >
                    @google/gemini-cli-sdk
                  </code>
                  ）公開
                </span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <span
                  style={{
                    color: "#0ea5e9",
                    fontWeight: 700,
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                >
                  v0.31.0
                </span>
                <span>
                  <strong>gemini-3.1-pro-preview</strong>{" "}
                  サポート追加（段階的ロールアウト・一部アカウントで利用可）
                </span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <span
                  style={{
                    color: "#0ea5e9",
                    fontWeight: 700,
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                >
                  v0.33.0
                </span>
                <span>
                  <strong>/plan にリサーチサブエージェント</strong>・アノテーション機能を追加
                </span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <span
                  style={{
                    color: "#0ea5e9",
                    fontWeight: 700,
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                >
                  v0.34.0
                </span>
                <span>Plan Mode がデフォルト有効化、サンドボックス化・セキュリティ強化</span>
              </li>
            </ul>
          </div>

          {/* Antigravity */}
          <div
            className={styles.newCard}
            style={{ borderColor: "#ddd6fe", background: "#ffffff", padding: "1.25rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <span
                className={styles.badge}
                style={{ background: "#8b5cf6", color: "#ffffff", padding: "0.25rem 0.75rem" }}
              >
                Antigravity
              </span>
              <span className={styles.badge} style={{ background: "#ede9fe", color: "#6d28d9" }}>
                v1.20.3 (2026-03-05)
              </span>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                fontSize: "0.875rem",
                color: "#475569",
              }}
            >
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <span
                  style={{
                    color: "#8b5cf6",
                    fontWeight: 700,
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                >
                  v1.20.3
                </span>
                <span>
                  <strong>AGENTS.md サポート</strong> 追加（Claude Code
                  など他ツールとルール共有可能）
                </span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <span
                  style={{
                    color: "#8b5cf6",
                    fontWeight: 700,
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                >
                  v1.20.3
                </span>
                <span>
                  トークン計算バグ修正・<strong>Auto-continue のデフォルト有効化</strong>
                </span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <span
                  style={{
                    color: "#8b5cf6",
                    fontWeight: 700,
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                >
                  現在
                </span>
                <span>
                  対応モデル:{" "}
                  {[
                    "gemini-3.1-pro-preview",
                    "gemini-3-flash-preview",
                    "claude-sonnet-4-6",
                    "claude-opus-4-6",
                    "gpt-oss-120b",
                  ]
                    .map((m, _i) => (
                      <code
                        key={m}
                        style={{
                          background: "#f1f5f9",
                          padding: "0 0.25rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                        }}
                      >
                        {m}
                      </code>
                    ))
                    .reduce<React.ReactNode[]>((acc, el, i) => {
                      if (i !== 0) acc.push(" / ");
                      acc.push(el);
                      return acc;
                    }, [])}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Model table */}
        <h3 className={styles.secH3} style={{ color: "#9a3412", marginTop: "1.5rem" }}>
          🤖 現在サポートされるモデル（2026年3月）
        </h3>
        <div className={`${styles.tableWrap} ${styles.modelTable}`}>
          <table
            className={styles.table}
            style={{ background: "#ffffff", borderRadius: "0.75rem", overflow: "hidden" }}
          >
            <thead>
              <tr style={{ background: "#ffedd5" }}>
                <th
                  className={styles.tdLeft}
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    fontWeight: 700,
                    color: "#7c2d12",
                  }}
                >
                  モデルID
                </th>
                <th
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    fontWeight: 700,
                    color: "#7c2d12",
                  }}
                >
                  推奨用途
                </th>
                <th
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    fontWeight: 700,
                    color: "#7c2d12",
                  }}
                >
                  ステータス
                </th>
                <th
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    fontWeight: 700,
                    color: "#7c2d12",
                  }}
                >
                  対応ツール
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className={`${styles.tdLeft} ${styles.mono} ${styles.textSlate}`}
                  style={{ border: "1px solid #fed7aa", padding: "0.5rem 1rem" }}
                >
                  gemini-3-flash-preview
                </td>
                <td
                  className={styles.textSlate}
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  コードレビュー・テスト・実装・オーケストレーター
                </td>
                <td
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <span className={`${styles.badge} ${styles.badgeGreen}`}>✅ デフォルト推奨</span>
                </td>
                <td
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <span className={`${styles.badge} ${styles.badgeGreen}`}>両方</span>
                </td>
              </tr>
              <tr style={{ background: "#fff7ed" }}>
                <td
                  className={`${styles.tdLeft} ${styles.mono} ${styles.textSlate}`}
                  style={{ border: "1px solid #fed7aa", padding: "0.5rem 1rem" }}
                >
                  gemini-3.1-pro-preview
                </td>
                <td
                  className={styles.textSlate}
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  アーキテクチャ設計・セキュリティ監査（ARC-AGI-2: 77.1%）
                </td>
                <td
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <span className={`${styles.badge} ${styles.badgeViolet}`}>⭐ 新世代最高精度</span>
                </td>
                <td
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <span className={`${styles.badge} ${styles.badgeGreen}`}>両方</span>
                </td>
              </tr>
              <tr>
                <td
                  className={`${styles.tdLeft} ${styles.mono} ${styles.textSlate}`}
                  style={{ border: "1px solid #fed7aa", padding: "0.5rem 1rem" }}
                >
                  gemini-2.5-flash
                </td>
                <td
                  className={styles.textSlate}
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  安定運用・コスパ重視
                </td>
                <td
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <span className={`${styles.badge} ${styles.badgeSky}`}>✅ 安定版</span>
                </td>
                <td
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <span
                    className={styles.badge}
                    style={{ background: "#ccfbf1", color: "#0f766e" }}
                  >
                    Gemini CLI
                  </span>
                </td>
              </tr>
              <tr style={{ background: "#fff7ed" }}>
                <td
                  className={`${styles.tdLeft} ${styles.mono}`}
                  style={{ border: "1px solid #fed7aa", padding: "0.5rem 1rem", color: "#94a3b8" }}
                >
                  gemini-2.0-flash
                </td>
                <td
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                  }}
                >
                  （廃止予定）
                </td>
                <td
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <span className={`${styles.badge} ${styles.badgeRose}`}>
                    ⚠️ 2026-06-01 廃止予定
                  </span>
                </td>
                <td
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <span
                    className={styles.badge}
                    style={{ background: "#ccfbf1", color: "#0f766e" }}
                  >
                    Gemini CLI
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  className={`${styles.tdLeft} ${styles.mono} ${styles.textSlate}`}
                  style={{ border: "1px solid #fed7aa", padding: "0.5rem 1rem" }}
                >
                  claude-sonnet-4-6
                </td>
                <td
                  className={styles.textSlate}
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  Anthropic モデル（Antigravity 対応）
                </td>
                <td
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <span className={`${styles.badge} ${styles.badgeAmber}`}>✅ 対応</span>
                </td>
                <td
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <span className={`${styles.badge} ${styles.badgeViolet}`}>Antigravity</span>
                </td>
              </tr>
              <tr style={{ background: "#fff7ed" }}>
                <td
                  className={`${styles.tdLeft} ${styles.mono} ${styles.textSlate}`}
                  style={{ border: "1px solid #fed7aa", padding: "0.5rem 1rem" }}
                >
                  claude-opus-4-6
                </td>
                <td
                  className={styles.textSlate}
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  Anthropic 最高精度（Antigravity 対応）
                </td>
                <td
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <span className={`${styles.badge} ${styles.badgeAmber}`}>✅ 対応</span>
                </td>
                <td
                  style={{
                    border: "1px solid #fed7aa",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <span className={`${styles.badge} ${styles.badgeViolet}`}>Antigravity</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* s11: footer */}
      <footer className={styles.footer}>
        <p>© 2026 SKILL.md 完全ガイド — Gemini CLI &amp; Antigravity 対応版</p>
      </footer>
    </div>
  );
}
