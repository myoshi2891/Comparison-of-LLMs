import type { Metadata } from "next";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

// MermaidDiagram はクライアントサイドでのみ実行する必要があるため ssr: false
const MermaidDiagram = dynamic(() => import("@/components/docs/MermaidDiagram"), { ssr: false });

export const metadata: Metadata = {
  title: "SKILL.md 完全解説ガイド — Claude Code",
  description:
    "Claude Code に「専門的なスキル」を追加するための設定ファイル SKILL.md の概念・構造・活用方法を理解するための初学者向け完全ガイドです。",
};

/**
 * Render the SKILL.md complete guide page layout with navigation and content.
 *
 * Renders a documentation-style page containing a sidebar with numbered navigation,
 * a main area with a hero and content sections (including a client-only Mermaid diagram).
 *
 * @returns A React element representing the SKILL.md guide page.
 */
export default function Page() {
  return (
    <div className={styles.pageWrap}>
      <div className={styles.tocProgress}>
        <div className={styles.tocProgressFill} id="readProgress" />
      </div>

      <div className={styles.layout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLogo}>
            <div className={styles.logoTag}>SKILL.md</div>
            <h2>完全解説ガイド</h2>
            <p>Claude Code v2.1.76 対応</p>
          </div>
          <p className={styles.navSectionLabel}>はじめに</p>
          <a href="#what" className={styles.navItem}>
            <span className={styles.navNum}>01</span>SKILL.md とは何か？
          </a>
          <a href="#arch" className={styles.navItem}>
            <span className={styles.navNum}>02</span>全体アーキテクチャ
          </a>
          <a href="#token" className={styles.navItem}>
            <span className={styles.navNum}>03</span>トークン経済の仕組み
          </a>
          <p className={styles.navSectionLabel}>コア概念</p>
          <a href="#structure" className={styles.navItem}>
            <span className={styles.navNum}>04</span>基本構造
          </a>
          <a href="#directory" className={styles.navItem}>
            <span className={styles.navNum}>05</span>ディレクトリ構造
          </a>
          <a href="#invoke" className={styles.navItem}>
            <span className={styles.navNum}>06</span>呼び出しの仕組み
          </a>
          <a href="#claudemd" className={styles.navItem}>
            <span className={styles.navNum}>07</span>CLAUDE.md との違い
          </a>
          <p className={styles.navSectionLabel}>実践</p>
          <a href="#build" className={styles.navItem}>
            <span className={styles.navNum}>08</span>最初のスキルを作る
          </a>
          <a href="#yaml" className={styles.navItem}>
            <span className={styles.navNum}>09</span>YAMLフロントマター解説
          </a>
          <a href="#args" className={styles.navItem}>
            <span className={styles.navNum}>10</span>引数と動的コンテキスト
          </a>
          <a href="#bundle" className={styles.navItem}>
            <span className={styles.navNum}>11</span>リソースバンドル
          </a>
          <p className={styles.navSectionLabel}>応用</p>
          <a href="#best" className={styles.navItem}>
            <span className={styles.navNum}>12</span>ベストプラクティス
          </a>
          <a href="#debug" className={styles.navItem}>
            <span className={styles.navNum}>13</span>デバッグと最適化
          </a>
          <a href="#mistakes" className={styles.navItem}>
            <span className={styles.navNum}>14</span>よくあるミス
          </a>
          <a href="#enterprise" className={styles.navItem}>
            <span className={styles.navNum}>15</span>エンタープライズ展開
          </a>
        </aside>

        {/* MAIN */}
        <main className={styles.main}>
          {/* HERO */}
          <section className={styles.hero}>
            <div className={styles.heroBadge}>Claude Code Agent Skills · SKILL.md</div>
            <h1>
              SKILL.md
              <br />
              完全解説ガイド
            </h1>
            <p className={styles.heroSub}>
              Claude Code
              に「専門的なスキル」を追加するための設定ファイル。ゼロから概念・構造・活用方法を理解するための初学者向け完全ガイドです。
            </p>
            <div className={styles.heroMeta}>
              <span className={`${styles.heroChip} ${styles.chipGreen}`}>
                ✓ Claude Code v2.1.76 対応
              </span>
              <span className={`${styles.heroChip} ${styles.chipBlue}`}>✓ 初学者向け</span>
              <span className={`${styles.heroChip} ${styles.chipPurple}`}>
                ✓ ステップバイステップ
              </span>
            </div>
          </section>

          {/* 01 WHAT */}
          <section className={styles.sec} id="what">
            <div className={styles.secHeader}>
              <span className={styles.secNum}>01</span>
              <h2>SKILL.md とは何か？</h2>
            </div>
            <p>
              <strong>SKILL.md</strong> は、Claude Code
              に「専門的なスキル（能力）」を追加するための設定ファイルです。一言でいうと —{" "}
              <strong>「Claudeに特定のタスクのプロの手順書を渡す仕組み」</strong>
              です。
            </p>
            <div className={`${styles.callout} ${styles.calloutTip}`}>
              <span className={styles.calloutIcon}>💡</span>
              <p>
                Claude Code
                はセッションをまたいで記憶を保持しません。毎回「このプロジェクトではPDFはこう作る」「コードレビューはこの観点でやる」と説明し直すのは非効率です。
                <br />
                <strong>SKILL.md を使うと一度書けば何度でも再利用できます。</strong>
              </p>
            </div>
            <h3>なぜ SKILL.md が必要なのか？</h3>
            <div className={styles.cardGrid}>
              <div className={styles.card}>
                <div className={styles.cardIcon}>♻️</div>
                <div className={styles.cardTitle}>再利用性</div>
                <div className={styles.cardDesc}>
                  一度書けば何度でも繰り返し使える。毎回同じ説明をする必要がなくなる。
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>🤖</div>
                <div className={styles.cardTitle}>自動読み込み</div>
                <div className={styles.cardDesc}>
                  Claude が状況を判断し、適切なスキルを自動的に読み込んで実行する。
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>📦</div>
                <div className={styles.cardTitle}>バンドル対応</div>
                <div className={styles.cardDesc}>
                  スクリプトやテンプレート、参考資料をスキルにまとめて同梱できる。
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>🌐</div>
                <div className={styles.cardTitle}>オープンスタンダード</div>
                <div className={styles.cardDesc}>
                  チームで共有可能。複数のAIツール間でも互換性があるオープン仕様。
                </div>
              </div>
            </div>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                chart={`graph LR
A["😤 毎回説明する\\n従来の方法"]
B["💬 Claude"]
C["📄 SKILL.md\\nに手順を書く"]
D["✅ 高品質な出力"]
A -->|非効率| B
C -->|自動読み込み| B
B --> D
style A fill:#2a1c1c,stroke:#f85149,color:#e6edf3
style C fill:#1c2a1c,stroke:#3fb950,color:#e6edf3
style D fill:#1c2033,stroke:#58a6ff,color:#e6edf3`}
              />
            </div>
          </section>

          {/* ── 02 全体アーキテクチャ ── */}
          <section id="arch" className={styles.sec}>
            <div className={styles.secHeader}>
              <span className={styles.secNum}>02</span>
              <h2>全体アーキテクチャを理解する</h2>
            </div>
            <p>
              SKILL.md を理解するには、まず Claude Code
              の「記憶・拡張システム」の全体像を把握しましょう。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                chart={`graph TD
subgraph MEM["💾 記憶システム（Memory）"]
A["📄 CLAUDE.md\\n常時読み込み\\nプロジェクト設定・規約"]
B["🤖 Auto Memory\\n~/.claude/projects/.../MEMORY.md\\nClaude が自動で記録"]
end
subgraph EXT["🔧 拡張システム（Extensions）"]
C["⚡ Skills .claude/skills/\\nSKILL.md — 専門スキル手順書"]
E["🤖 Agents .claude/agents/\\nagent.md — サブエージェント"]
F["🔌 MCP Servers\\n外部ツール連携"]
H["🧩 Plugins .claude/plugins/\\nplugin.json — サードパーティ拡張"]
end
G["🚀 Claude Code 起動"]
G -->|自動読み込み| A
G -->|自動読み込み| B
G -->|必要時に動的読み込み| C
G -->|タスク実行時| E
G -->|設定した連携| F
G -->|プラグイン登録| H
style MEM fill:#1a2535,stroke:#3b5270,color:#e6edf3
style EXT fill:#1a2535,stroke:#3b5270,color:#e6edf3`}
              />
            </div>
            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <span className={styles.calloutIcon}>ℹ️</span>
              <p>
                旧バージョンの <code>.claude/commands/</code> によるスラッシュコマンドは現在{" "}
                <code>skills/</code> に統合されています。<code>invocation: explicit</code>
                を指定することで同等の手動呼び出し動作が得られます。
              </p>
            </div>
            <h3>各要素の役割比較</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>機能</th>
                    <th>ファイル</th>
                    <th>呼び出し元</th>
                    <th>用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>CLAUDE.md</strong>
                    </td>
                    <td>
                      <code>CLAUDE.md</code>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeGreen}`}>自動・常時</span>
                    </td>
                    <td>プロジェクト規約・コーディングスタイル</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>SKILL.md</strong>
                    </td>
                    <td>
                      <code>skills/xxx/SKILL.md</code>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeBlue}`}>Claude が自動</span>
                      {" / "}
                      <span className={`${styles.badge} ${styles.badgePurple}`}>/コマンド</span>
                    </td>
                    <td>専門タスクの手順書・ワークフロー</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Agent</strong>
                    </td>
                    <td>
                      <code>agents/xxx.md</code>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeOrange}`}>タスク実行時</span>
                    </td>
                    <td>サブエージェントの役割定義</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Plugin</strong>
                    </td>
                    <td>
                      <code>plugins/xxx/plugin.json</code>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeOrange}`}>
                        /plugin install
                      </span>
                    </td>
                    <td>サードパーティ機能拡張</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>MCP Servers</strong>
                    </td>
                    <td>設定ファイル</td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeOrange}`}>連携設定時</span>
                    </td>
                    <td>外部ツール・API連携</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── 03 トークン経済と3層アーキテクチャ ── */}
          <section id="token" className={styles.sec}>
            <div className={styles.secHeader}>
              <span className={styles.secNum}>03</span>
              <h2>トークン経済と3層アーキテクチャ</h2>
            </div>
            <p>
              なぜ単一の巨大なプロンプトではなく、ディレクトリとファイル群による階層的な構造なのか？その答えが「
              <strong>プログレッシブ・ディスクロージャー</strong>
              」という設計思想です。
            </p>
            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <span className={styles.calloutIcon}>🧠</span>
              <p>
                情報を無秩序にコンテキストへ詰め込むと「アテンション・バジェット（注意力の予算）」が枯渇し、モデルの推論精度が著しく低下します。SKILL.md
                はこれを防ぐため、
                <strong>必要な情報を必要なタイミングでのみ読み込む</strong>
                3層構造を採用しています。
              </p>
            </div>
            <h3>3層読み込みレベル</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>レベル</th>
                    <th>構成要素</th>
                    <th>トークン消費</th>
                    <th>読み込みタイミング</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeGreen}`}>Level 1</span>{" "}
                      メタデータ
                    </td>
                    <td>YAMLフロントマター（nameとdescription）</td>
                    <td>~100 tokens/スキル</td>
                    <td>Claude Code 起動時・常時</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeBlue}`}>Level 2</span>{" "}
                      インストラクション
                    </td>
                    <td>SKILL.md のマークダウン本文（推奨500行未満）</td>
                    <td>~5000 tokens</td>
                    <td>スキルがトリガーされた瞬間のみ</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.badgePurple}`}>Level 3</span>{" "}
                      参照ファイル
                    </td>
                    <td>外部ドキュメント・実行スクリプト</td>
                    <td>実質無制限</td>
                    <td>エージェントが必要と判断した時のみ</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                chart={`sequenceDiagram
participant User as 👤 ユーザー
participant C as ⚡ Claude Code
participant L1 as Level 1 (YAML)
participant L2 as Level 2 (本文)
participant L3 as Level 3 (スクリプト)
Note over C,L1: セッション開始フェーズ
C->>L1: 全スキルのメタデータをスキャン
L1-->>C: name と description のみ登録（~100 tokens/スキル）
User->>C: READMEを作成してください
Note over C: ユーザーの意図と description を照合して判断
C->>L2: readme-writer スキルの本文を読み込み
L2-->>C: 指示内容をコンテキストに展開
C->>L3: references/style.md を読み込み
L3-->>C: スタイルガイドラインを返す
C->>L3: scripts/validate.sh を実行
L3-->>C: 実行結果のみを返す（コードは不要）
C-->>User: ガイドラインに準拠したREADMEを出力`}
              />
            </div>
            <div className={`${styles.callout} ${styles.calloutTip}`}>
              <span className={styles.calloutIcon}>⚡</span>
              <p>
                この設計の最大の利点は<strong>スケーラビリティ</strong>
                です。100個のスキルを追加しても、トリガーされないスキルのコストはほぼゼロ。メインの会話コンテキストを圧迫しません。
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
