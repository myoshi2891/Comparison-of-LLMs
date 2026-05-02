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

          {/* ── 04 SKILL.md の基本構造 ── */}
          <section id="structure" className={styles.sec}>
            <div className={styles.secHeader}>
              <span className={styles.secNum}>04</span>
              <h2>SKILL.md の基本構造</h2>
            </div>
            <p>
              SKILL.md は <strong>2つのパート</strong> で構成されます。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                chart={`graph TD
A["YAMLフロントマター\\nname: スキル名\\ndescription: いつ使うかの説明\\nallowed-tools: Read, Write"]
B["マークダウン本文（手順書）\\nStep 1: 〇〇をする\\nStep 2: 〇〇をする\\n出力フォーマット ..."]
A --> B
style A fill:#1c2a1c,stroke:#3fb950,color:#e6edf3
style B fill:#1c2530,stroke:#58a6ff,color:#e6edf3`}
              />
            </div>
            <h3>実際のファイル例：コードレビュースキル</h3>
            <div className={styles.codeBlock}>
              <div className={styles.codeBlockHeader}>
                <div className={styles.codeBlockDots}>
                  <div className={`${styles.dot} ${styles.dotR}`} />
                  <div className={`${styles.dot} ${styles.dotY}`} />
                  <div className={`${styles.dot} ${styles.dotG}`} />
                </div>
                <span className={styles.codeBlockLang}>~/.claude/skills/code-review/SKILL.md</span>
              </div>
              <pre>
                <code>
                  <span className={styles.cmt}>
                    {"--- ← YAMLフロントマター（Level 1 · 常時読み込み）"}
                  </span>
                  {"\n"}
                  <span className={styles.key}>name</span>
                  {": "}
                  <span className={styles.str}>code-review</span>
                  {"\n"}
                  <span className={styles.key}>description</span>
                  {": "}
                  <span className={styles.str}>{">"}</span>
                  {"\n  "}
                  <span className={styles.str}>
                    {"コードのセキュリティ・バグ・パフォーマンス・スタイルをレビューする。"}
                  </span>
                  {"\n  "}
                  <span className={styles.str}>
                    {"「レビューして」「確認して」「チェックして」と言われたときに使用する。"}
                  </span>
                  {"\n"}
                  <span className={styles.key}>allowed-tools</span>
                  {": "}
                  <span className={styles.val}>[Read, Grep, Glob]</span>
                  {"\n"}
                  <span className={styles.cmt}>---</span>
                  {"\n\n"}
                  <span className={styles.hdr}># コードレビュースキル</span>
                  {"\n\n"}
                  <span className={styles.hdr}>## レビュー観点</span>
                  {"\n\n"}
                  {"1. "}
                  <span className={styles.str}>**セキュリティ**</span>
                  {": SQLインジェクション、XSS をチェック"}
                  {"\n"}
                  {"2. "}
                  <span className={styles.str}>**バグ**</span>
                  {": NULL参照、境界値、例外処理を確認"}
                  {"\n"}
                  {"3. "}
                  <span className={styles.str}>**パフォーマンス**</span>
                  {": N+1クエリ、不要なループを検出"}
                  {"\n"}
                  {"4. "}
                  <span className={styles.str}>**スタイル**</span>
                  {": プロジェクトの命名規則に従っているか確認"}
                  {"\n\n"}
                  <span className={styles.hdr}>## 出力フォーマット</span>
                  {"\n\n"}
                  {"- 🔴 重大: すぐに修正が必要"}
                  {"\n"}
                  {"- 🟡 警告: できれば修正を推奨"}
                  {"\n"}
                  {"- 🟢 提案: コード品質向上のヒント"}
                </code>
              </pre>
            </div>
            <div className={`${styles.callout} ${styles.calloutWarn}`}>
              <span className={styles.calloutIcon}>⚠️</span>
              <p>
                <code>---</code> で囲まれたYAMLフロントマターは必須です。これがないと Claude
                はスキルを認識できません。また、<code>name</code> と <code>description</code>{" "}
                は最低限必要なフィールドです。
              </p>
            </div>
          </section>

          {/* ── 05 ディレクトリ構造と優先順位 ── */}
          <section id="directory" className={styles.sec}>
            <div className={styles.secHeader}>
              <span className={styles.secNum}>05</span>
              <h2>ディレクトリ構造と優先順位</h2>
            </div>
            <p>
              スキルを置く場所は <strong>3種類</strong> あり、適用範囲（スコープ）が異なります。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>スコープ</th>
                    <th>パス</th>
                    <th>用途</th>
                    <th>共有</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeRed}`}>Enterprise</span>{" "}
                      最高優先
                    </td>
                    <td>管理者が設定</td>
                    <td>組織全体で強制適用するスキル</td>
                    <td>全ユーザー</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeBlue}`}>Personal</span>
                    </td>
                    <td>
                      <code>~/.claude/skills/スキル名/</code>
                    </td>
                    <td>自分だけの全プロジェクト共通スキル</td>
                    <td>個人のみ</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeGreen}`}>Project</span>
                    </td>
                    <td>
                      <code>.claude/skills/スキル名/</code>
                    </td>
                    <td>プロジェクト固有・チーム共有スキル</td>
                    <td>Git で共有</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                chart={`graph LR
E["🏢 Enterprise\\n（最高優先度）"]
P["👤 Personal\\n~/.claude/skills/"]
PR["📁 Project\\n.claude/skills/"]
E -->|上書き| P
P -->|上書き| PR
style E fill:#2a1c1c,stroke:#f85149,color:#e6edf3
style P fill:#1c2530,stroke:#58a6ff,color:#e6edf3
style PR fill:#1c2a1c,stroke:#3fb950,color:#e6edf3`}
              />
            </div>
            <h3>実際のフォルダ構造</h3>
            <div className={styles.codeBlock}>
              <div className={styles.codeBlockHeader}>
                <div className={styles.codeBlockDots}>
                  <div className={`${styles.dot} ${styles.dotR}`} />
                  <div className={`${styles.dot} ${styles.dotY}`} />
                  <div className={`${styles.dot} ${styles.dotG}`} />
                </div>
                <span className={styles.codeBlockLang}>ディレクトリ構造例</span>
              </div>
              <pre>
                <code>
                  <span className={styles.cmt}>
                    {"~/.claude/                      ← ホームディレクトリ（個人用）"}
                  </span>
                  {"\n"}
                  {"├── CLAUDE.md                   "}
                  <span className={styles.cmt}>← 全プロジェクト共通設定</span>
                  {"\n"}
                  {"└── "}
                  <span className={styles.key}>skills/</span>
                  {"                     "}
                  <span className={styles.cmt}>← 個人スキルフォルダ</span>
                  {"\n"}
                  {"    ├── "}
                  <span className={styles.val}>code-review/</span>
                  {"\n"}
                  {"    │   ├── "}
                  <span className={styles.hdr}>SKILL.md</span>
                  {"            "}
                  <span className={styles.cmt}>← ★ これが主役！</span>
                  {"\n"}
                  {"    │   ├── checklist.md"}
                  {"\n"}
                  {"    │   └── scripts/"}
                  {"\n"}
                  {"    │       └── lint.sh"}
                  {"\n"}
                  {"    └── "}
                  <span className={styles.val}>deploy/</span>
                  {"\n"}
                  {"        └── "}
                  <span className={styles.hdr}>SKILL.md</span>
                  {"\n"}
                  {"\n"}
                  <span className={styles.cmt}>
                    {"your-project/                   ← プロジェクトルート"}
                  </span>
                  {"\n"}
                  {"├── CLAUDE.md"}
                  {"\n"}
                  {"└── "}
                  <span className={styles.key}>.claude/</span>
                  {"\n"}
                  {"    ├── "}
                  <span className={styles.key}>skills/</span>
                  {"             "}
                  <span className={styles.cmt}>← プロジェクト専用スキル</span>
                  {"\n"}
                  {"    │   └── "}
                  <span className={styles.val}>api-docs/</span>
                  {"\n"}
                  {"    │       └── "}
                  <span className={styles.hdr}>SKILL.md</span>
                  {"\n"}
                  {"    └── plugins/               "}
                  <span className={styles.cmt}>← プラグイン拡張</span>
                </code>
              </pre>
            </div>
          </section>

          {/* ── 06 スキルが呼び出される仕組み ── */}
          <section id="invoke" className={styles.sec}>
            <div className={styles.secHeader}>
              <span className={styles.secNum}>06</span>
              <h2>スキルが呼び出される仕組み</h2>
            </div>
            <p>スキルが実行されるまでの流れを見てみましょう。</p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                chart={`sequenceDiagram
participant U as 👤 ユーザー
participant CC as ⚡ Claude Code
participant SK as 📚 Skills一覧
participant SM as 📄 SKILL.md
U->>CC: 「このコードをレビューして」
CC->>SK: 利用可能なスキルを確認
SK-->>CC: code-review, deploy, api-docs ...
Note over CC: description とユーザーの意図を照合
CC->>SM: code-review/SKILL.md を読み込む
SM-->>CC: レビュー手順・観点・出力形式を返す
CC->>U: 手順に従ったコードレビュー結果`}
              />
            </div>
            <h3>2つの呼び出し方法</h3>
            <div className={styles.cardGrid}>
              <div className={styles.card}>
                <div className={styles.cardIcon}>🤖</div>
                <div className={styles.cardTitle}>方法①：Claude が自動判断（推奨）</div>
                <div className={styles.cardDesc}>
                  description
                  を読んで、ユーザーの意図と一致すると判断したら自動で実行。ユーザーは何も意識する必要がない。
                </div>
                <div className={styles.codeBlock} style={{ marginTop: "0.75rem" }}>
                  <pre style={{ padding: "0.75rem", fontSize: "0.75rem" }}>
                    <code>
                      <span className={styles.cmt}>ユーザー:</span>
                      {" 「このPDFを解析して要約してくれ」"}
                      {"\n"}
                      <span className={styles.cmt}>Claude:</span>
                      {"  "}
                      <span className={styles.str}>(自動でpdfスキルを検出・実行)</span>
                    </code>
                  </pre>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>⌨️</div>
                <div className={styles.cardTitle}>方法②：スラッシュコマンドで手動</div>
                <div className={styles.cardDesc}>
                  ユーザーが直接スキル名をコマンドとして入力して実行する。確実に特定のスキルを動かしたい時に使う。
                </div>
                <div className={styles.codeBlock} style={{ marginTop: "0.75rem" }}>
                  <pre style={{ padding: "0.75rem", fontSize: "0.75rem" }}>
                    <code>
                      <span className={styles.cmt}>ユーザー:</span>
                      {" /code-review src/auth/login.ts"}
                      {"\n"}
                      <span className={styles.cmt}>Claude:</span>
                      {"  "}
                      <span className={styles.str}>(code-reviewスキルを直接実行)</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
            <h3>invocation フィールドで制御する</h3>
            <div className={styles.codeBlock}>
              <div className={styles.codeBlockHeader}>
                <div className={styles.codeBlockDots}>
                  <div className={`${styles.dot} ${styles.dotR}`} />
                  <div className={`${styles.dot} ${styles.dotY}`} />
                  <div className={`${styles.dot} ${styles.dotG}`} />
                </div>
                <span className={styles.codeBlockLang}>YAML frontmatter</span>
              </div>
              <pre>
                <code>
                  <span className={styles.cmt}># Claude が自動判断（デフォルト）</span>
                  {"\n"}
                  <span className={styles.key}>invocation</span>
                  {": "}
                  <span className={styles.val}>automatic</span>
                  {"\n\n"}
                  <span className={styles.cmt}>
                    # /deploy と入力したときのみ実行（破壊的操作に推奨）
                  </span>
                  {"\n"}
                  <span className={styles.key}>invocation</span>
                  {": "}
                  <span className={styles.val}>explicit</span>
                </code>
              </pre>
            </div>
          </section>

          {/* ── 07 CLAUDE.md との違い ── */}
          <section id="claudemd" className={styles.sec}>
            <div className={styles.secHeader}>
              <span className={styles.secNum}>07</span>
              <h2>CLAUDE.md との違い</h2>
            </div>
            <p>初学者が最も混乱するのがこの違いです。</p>
            <div className={`${styles.callout} ${styles.calloutTip}`}>
              <span className={styles.calloutIcon}>🎯</span>
              <p>
                <strong>「常に守るべきルール」→ CLAUDE.md</strong>
                <br />
                <strong>「特定のタスクの詳しい手順」→ SKILL.md</strong>
              </p>
            </div>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                chart={`graph LR
subgraph CLAUDEMD["📄 CLAUDE.md の領域\\n常時適用 × ルール・制約"]
C1["コーディングスタイル"]
C2["命名規則"]
C3["コミット形式"]
end
subgraph SKILLMD["📄 SKILL.md の領域\\n必要な時だけ × 手順・プロセス"]
S1["PDF作成手順"]
S2["コードレビュー観点"]
S3["APIドキュメント生成"]
S4["デプロイ手順"]
end
style CLAUDEMD fill:#1c2530,stroke:#58a6ff,color:#e6edf3
style SKILLMD fill:#1c2a1c,stroke:#3fb950,color:#e6edf3`}
              />
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>CLAUDE.md</th>
                    <th>SKILL.md</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>読み込みタイミング</strong>
                    </td>
                    <td>
                      セッション開始時・
                      <span className={`${styles.badge} ${styles.badgeRed}`}>常時</span>
                    </td>
                    <td>
                      必要なときだけ（
                      <span className={`${styles.badge} ${styles.badgeGreen}`}>オンデマンド</span>）
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>内容</strong>
                    </td>
                    <td>常に守るべきルール・制約・コンテキスト</td>
                    <td>特定タスクの詳細な手順書</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>コンテキスト消費</strong>
                    </td>
                    <td>毎回消費（重くなりやすい）</td>
                    <td>必要時のみ消費（効率的）</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>スクリプト同梱</strong>
                    </td>
                    <td>❌ できない</td>
                    <td>✅ できる</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>推奨行数</strong>
                    </td>
                    <td>20〜200行</td>
                    <td>500行未満（本文）</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── 08 ステップバイステップ：最初のスキルを作る ── */}
          <section id="build" className={styles.sec}>
            <div className={styles.secHeader}>
              <span className={styles.secNum}>08</span>
              <h2>ステップバイステップ：最初のスキルを作る</h2>
            </div>
            <p>「コードを分かりやすく説明する」スキルを実際に作ってみましょう。</p>
            <div className={styles.steps}>
              {/* Step 1 */}
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>1</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>ディレクトリを作成する</div>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeBlockHeader}>
                      <div className={styles.codeBlockDots}>
                        <div className={`${styles.dot} ${styles.dotR}`} />
                        <div className={`${styles.dot} ${styles.dotY}`} />
                        <div className={`${styles.dot} ${styles.dotG}`} />
                      </div>
                      <span className={styles.codeBlockLang}>Terminal</span>
                    </div>
                    <pre>
                      <code>
                        <span className={styles.tag}>$</span>
                        {" mkdir -p "}
                        <span className={styles.str}>~/.claude/skills/explain-code</span>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
              {/* Step 2 */}
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>2</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>SKILL.md ファイルを作成する</div>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeBlockHeader}>
                      <div className={styles.codeBlockDots}>
                        <div className={`${styles.dot} ${styles.dotR}`} />
                        <div className={`${styles.dot} ${styles.dotY}`} />
                        <div className={`${styles.dot} ${styles.dotG}`} />
                      </div>
                      <span className={styles.codeBlockLang}>Terminal</span>
                    </div>
                    <pre>
                      <code>
                        <span className={styles.tag}>$</span>
                        {" touch "}
                        <span className={styles.str}>~/.claude/skills/explain-code/SKILL.md</span>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
              {/* Step 3 */}
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>3</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>YAMLフロントマターを書く</div>
                  <div className={styles.stepDesc}>
                    <code>name</code> と <code>description</code> を必ず記入。
                    <strong>description はトリガーワードを具体的に含めることが最重要です。</strong>
                  </div>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeBlockHeader}>
                      <div className={styles.codeBlockDots}>
                        <div className={`${styles.dot} ${styles.dotR}`} />
                        <div className={`${styles.dot} ${styles.dotY}`} />
                        <div className={`${styles.dot} ${styles.dotG}`} />
                      </div>
                      <span className={styles.codeBlockLang}>SKILL.md — フロントマター部分</span>
                    </div>
                    <pre>
                      <code>
                        <span className={styles.cmt}>---</span>
                        {"\n"}
                        <span className={styles.key}>name</span>
                        {": "}
                        <span className={styles.str}>explain-code</span>
                        {"\n"}
                        <span className={styles.key}>description</span>
                        {": "}
                        <span className={styles.str}>{">"}</span>
                        {"\n  "}
                        <span className={styles.str}>
                          {"コードの動作をビジュアル図解と例えを使って説明する。"}
                        </span>
                        {"\n  "}
                        <span className={styles.str}>
                          {"「どうやって動いてる？」「わかりやすく説明して」"}
                        </span>
                        {"\n  "}
                        <span className={styles.str}>{"「教えて」と言われたときに使用する。"}</span>
                        {"\n"}
                        <span className={styles.cmt}>---</span>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
              {/* Step 4 */}
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>4</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>本文（指示書）を書く</div>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeBlockHeader}>
                      <div className={styles.codeBlockDots}>
                        <div className={`${styles.dot} ${styles.dotR}`} />
                        <div className={`${styles.dot} ${styles.dotY}`} />
                        <div className={`${styles.dot} ${styles.dotG}`} />
                      </div>
                      <span className={styles.codeBlockLang}>SKILL.md — 本文部分</span>
                    </div>
                    <pre>
                      <code>
                        <span className={styles.hdr}># コード説明スキル</span>
                        {"\n\n"}
                        <span className={styles.hdr}>## 説明プロセス</span>
                        {"\n\n"}
                        {"1. "}
                        <span className={styles.str}>**アナロジー（例え話）で始める**</span>
                        {"\n   日常生活の何かに例えてから説明する"}
                        {"\n"}
                        {"2. "}
                        <span className={styles.str}>**図を描く（ASCII アート）**</span>
                        {"\n   コードの流れ・構造・関係性を視覚化する"}
                        {"\n"}
                        {"3. "}
                        <span className={styles.str}>**ステップバイステップで解説する**</span>
                        {"\n   コードを上から順に、何が起きているか説明"}
                        {"\n"}
                        {"4. "}
                        <span className={styles.str}>**「落とし穴」を1つ挙げる**</span>
                        {"\n   よくある誤解や注意すべき点を1つ教える"}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
              {/* Step 5 */}
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>5</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>動作確認する</div>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeBlockHeader}>
                      <div className={styles.codeBlockDots}>
                        <div className={`${styles.dot} ${styles.dotR}`} />
                        <div className={`${styles.dot} ${styles.dotY}`} />
                        <div className={`${styles.dot} ${styles.dotG}`} />
                      </div>
                      <span className={styles.codeBlockLang}>Terminal</span>
                    </div>
                    <pre>
                      <code>
                        <span className={styles.tag}>$</span>
                        {" claude"}
                        {"\n"}
                        <span className={styles.str}>{">"}</span>
                        {" 「このコードはどうやって動いているの？」"}
                        {"\n"}
                        <span className={styles.str}>{">"}</span>
                        {" /explain-code src/utils/parser.ts"}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
              {/* Step 6 */}
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>6</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>完成！ディレクトリ構造を確認</div>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeBlockHeader}>
                      <div className={styles.codeBlockDots}>
                        <div className={`${styles.dot} ${styles.dotR}`} />
                        <div className={`${styles.dot} ${styles.dotY}`} />
                        <div className={`${styles.dot} ${styles.dotG}`} />
                      </div>
                      <span className={styles.codeBlockLang}>最終構造</span>
                    </div>
                    <pre>
                      <code>
                        {"~/.claude/skills/explain-code/"}
                        {"\n"}
                        {"└── "}
                        <span className={styles.hdr}>SKILL.md</span>
                        {"     "}
                        <span className={styles.val}>✅ 完成！</span>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 09 YAMLフロントマター 全フィールド解説 ── */}
          <section id="yaml" className={styles.sec}>
            <div className={styles.secHeader}>
              <span className={styles.secNum}>09</span>
              <h2>YAMLフロントマター 全フィールド解説</h2>
            </div>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                chart={`graph TD
FM["--- YAMLフロントマター ---"]
FM --> N["📛 name\\nスキル名・/slash-commandの名前になる\\n最大64文字、小文字・数字・ハイフンのみ"]
FM --> D["📝 description\\n最重要 いつ使うかをClaudeが判断する\\n最大1024文字。具体的なトリガーワードを含める"]
FM --> AT["🔒 allowed-tools\\nスキルで使えるツールを制限\\n例: Read, Write, Bash, Grep, Glob"]
FM --> INV["⚡ invocation\\nautomatic: Claude自動判断（デフォルト）\\nexplicit: /コマンドのみ実行"]
FM --> CTX["🔀 context\\nfork: 独立したコンテキストで実行\\ninherit: メイン会話を引き継ぐ（デフォルト）"]
FM --> AG["🤖 agent\\ngeneral-purpose（デフォルト）\\nExplore / Plan / カスタム"]
FM --> VER["🏷️ version\\nスキルのバージョン管理\\n例: version: 1.0.0"]
style FM fill:#1c2a1c,stroke:#3fb950,color:#e6edf3`}
              />
            </div>
            <h3>完全な設定例</h3>
            <div className={styles.codeBlock}>
              <div className={styles.codeBlockHeader}>
                <div className={styles.codeBlockDots}>
                  <div className={`${styles.dot} ${styles.dotR}`} />
                  <div className={`${styles.dot} ${styles.dotY}`} />
                  <div className={`${styles.dot} ${styles.dotG}`} />
                </div>
                <span className={styles.codeBlockLang}>SKILL.md — YAMLフロントマター完全版</span>
              </div>
              <pre>
                <code>
                  <span className={styles.cmt}>---</span>
                  {"\n"}
                  <span className={styles.key}>name</span>
                  {": "}
                  <span className={styles.str}>security-audit</span>
                  {"\n"}
                  <span className={styles.key}>description</span>
                  {": "}
                  <span className={styles.str}>{">"}</span>
                  {"\n"}
                  {"  "}
                  <span className={styles.str}>コードのセキュリティ監査を行う。</span>
                  {"\n"}
                  {"  "}
                  <span className={styles.str}>
                    「セキュリティをチェックして」「脆弱性を探して」と言われたときに使用する。
                  </span>
                  {"\n"}
                  <span className={styles.key}>allowed-tools</span>
                  {":\n"}
                  {"  - "}
                  <span className={styles.val}>Read</span>
                  {"\n"}
                  {"  - "}
                  <span className={styles.val}>Grep</span>
                  {"\n"}
                  {"  - "}
                  <span className={styles.val}>Glob</span>
                  {"\n"}
                  <span className={styles.key}>invocation</span>
                  {": "}
                  <span className={styles.val}>automatic</span>
                  {"\n"}
                  <span className={styles.key}>context</span>
                  {": "}
                  <span className={styles.val}>fork</span>
                  {"\n"}
                  <span className={styles.key}>agent</span>
                  {": "}
                  <span className={styles.val}>general-purpose</span>
                  {"\n"}
                  <span className={styles.key}>version</span>
                  {": "}
                  <span className={styles.str}>&quot;1.0.0&quot;</span>
                  {"\n"}
                  <span className={styles.cmt}>---</span>
                </code>
              </pre>
            </div>
            <h3>
              <code>context: fork</code> の具体的な使用例
            </h3>
            <p>
              <code>context: fork</code>
              を指定すると、メイン会話のコンテキストを保持したまま独立した環境でスキルを実行します。完了後は
              <strong>最終結果だけ</strong>がメインに返却されます。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>シーン</th>
                    <th>context: fork が有効な理由</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>セキュリティ監査・静的解析</td>
                    <td>大量の読み取りログがメイン会話を圧迫しない</td>
                  </tr>
                  <tr>
                    <td>ドキュメント自動生成</td>
                    <td>生成過程の試行錯誤をメインに残さない</td>
                  </tr>
                  <tr>
                    <td>データ変換・バッチ処理</td>
                    <td>中間成果物をコンテキストから除外できる</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3>
              <code>/skill-creator</code> コマンドでスキルを自動生成する
            </h3>
            <p>
              Claude Code には
              <code>/skill-creator</code>
              という組み込みメタスキルが付属しています。自然言語で要件を伝えるだけで公式ベストプラクティスに準拠したスキルの雛形を生成できます。
            </p>
            <div className={styles.codeBlock}>
              <div className={styles.codeBlockHeader}>
                <div className={styles.codeBlockDots}>
                  <div className={`${styles.dot} ${styles.dotR}`} />
                  <div className={`${styles.dot} ${styles.dotY}`} />
                  <div className={`${styles.dot} ${styles.dotG}`} />
                </div>
                <span className={styles.codeBlockLang}>Terminal</span>
              </div>
              <pre>
                <code>
                  <span className={styles.str}>{">"}</span>
                  {" /skill-creator\n\n"}
                  <span className={styles.cmt}># または自然言語で依頼</span>
                  {"\n"}
                  <span className={styles.str}>{">"}</span>
                  {
                    ' "/skill-creator を使って、UIデザインを最適化し\n   ブラウザで検証するスキルを作成して"'
                  }
                </code>
              </pre>
            </div>
            <div className={`${styles.callout} ${styles.calloutTip}`}>
              <span className={styles.calloutIcon}>💡</span>
              <p>
                Agent Teams (<code>--team</code>) 利用時は <code>/effort</code> コマンドで思考深度を{" "}
                <code>low</code>・<code>medium</code>・<code>high</code>{" "}
                から選択できます。スキル内に <code>effort: high</code> を frontmatter
                で指定することも可能です（Opus 4.6 使用時のみ有効）。<code>/loop</code>{" "}
                コマンドを使えばスキルを定期的に繰り返し実行させることもできます。
              </p>
            </div>
          </section>

          {/* ── 10 引数と動的コンテキストの注入 ── */}
          <section id="args" className={styles.sec}>
            <div className={styles.secHeader}>
              <span className={styles.secNum}>10</span>
              <h2>引数と動的コンテキストの注入</h2>
            </div>
            <p>
              SKILL.md
              は静的な手順書だけではありません。ユーザーからの動的な入力値や、実行時のシステム状態をリアルタイムで取り込む強力な機能があります。
            </p>
            <h3>引数の受け取り方</h3>
            <div className={styles.codeBlock}>
              <div className={styles.codeBlockHeader}>
                <div className={styles.codeBlockDots}>
                  <div className={`${styles.dot} ${styles.dotR}`} />
                  <div className={`${styles.dot} ${styles.dotY}`} />
                  <div className={`${styles.dot} ${styles.dotG}`} />
                </div>
                <span className={styles.codeBlockLang}>SKILL.md — 引数処理</span>
              </div>
              <pre>
                <code>
                  {"以下のファイルを解説してください: "}
                  <span className={styles.val}>$ARGUMENTS</span>
                  {"\n"}
                  <span className={styles.cmt}>
                    # ↑ /explain-code src/main.py と実行すると &quot;src/main.py&quot; に置換される
                  </span>
                  {"\n\n対象ファイル: "}
                  <span className={styles.val}>$1</span>
                  {"   "}
                  <span className={styles.cmt}># 最初の引数</span>
                  {"\n比較対象:     "}
                  <span className={styles.val}>$2</span>
                  {"   "}
                  <span className={styles.cmt}># 2番目の引数</span>
                </code>
              </pre>
            </div>
            <h3>動的コンテキストの事前注入（強力な機能）</h3>
            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <span className={styles.calloutIcon}>🚀</span>
              <p>
                <strong>バッククォート構文（! `command`）</strong>
                を使うと、スキルが実行される「前」にシェルコマンドを実行し、その結果をプロンプトに自動で埋め込めます。
              </p>
            </div>
            <div className={styles.codeBlock}>
              <div className={styles.codeBlockHeader}>
                <div className={styles.codeBlockDots}>
                  <div className={`${styles.dot} ${styles.dotR}`} />
                  <div className={`${styles.dot} ${styles.dotY}`} />
                  <div className={`${styles.dot} ${styles.dotG}`} />
                </div>
                <span className={styles.codeBlockLang}>SKILL.md — 動的コンテキスト注入</span>
              </div>
              <pre>
                <code>
                  {"現在のOS情報:\n"}
                  <span className={styles.val}>! `uname -a`</span>
                  {"\n\n最新のコミット:\n"}
                  <span className={styles.val}>! `git log -1 --oneline`</span>
                  {"\n\n解析対象ファイル: "}
                  <span className={styles.val}>$1</span>
                </code>
              </pre>
            </div>
          </section>

          {/* ── 11 リソースファイルのバンドル ── */}
          <section id="bundle" className={styles.sec}>
            <div className={styles.secHeader}>
              <span className={styles.secNum}>11</span>
              <h2>リソースファイルのバンドル</h2>
            </div>
            <p>スキルには指示書だけでなく、スクリプトや参考資料もまとめられます。</p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                chart={`graph LR
subgraph DIR["📁 pdf-processor/ スキルディレクトリ"]
A["📄 SKILL.md\\n（メインの指示書）"]
B["🐍 scripts/extract.py\\n（実行スクリプト）"]
C["📋 references/format.md\\n（参考資料・仕様書）"]
D["🗂️ assets/template.html\\n（出力テンプレート）"]
end
A -->|指示する| B
A -->|参照する| C
A -->|使用する| D
style DIR fill:#1a2030,stroke:#58a6ff,color:#e6edf3`}
              />
            </div>
            <div className={`${styles.callout} ${styles.calloutWarn}`}>
              <span className={styles.calloutIcon}>⚠️</span>
              <p>
                参照ファイルは必ず
                <strong>1階層（One level deep）</strong>
                にとどめること。深くネストされた参照は情報が不完全になるリスクがあります。100行を超える参照ファイルには冒頭に目次を設置してください。
              </p>
            </div>
          </section>

          {/* ── 12 ベストプラクティス ── */}
          <section id="best" className={styles.sec}>
            <div className={styles.secHeader}>
              <span className={styles.secNum}>12</span>
              <h2>ベストプラクティス</h2>
            </div>
            <h3>✅ description の書き方が最重要</h3>
            <div className={styles.compare}>
              <div className={`${styles.compareCard} ${styles.bad}`}>
                <div className={styles.compareLabel}>❌ 悪い例（曖昧すぎる）</div>
                <div className={styles.codeBlock} style={{ margin: 0 }}>
                  <pre style={{ padding: "0.75rem", fontSize: "0.75rem" }}>
                    <code>
                      <span className={styles.key}>description</span>
                      {": "}
                      <span className={styles.str}>コードに関する作業をする</span>
                    </code>
                  </pre>
                </div>
              </div>
              <div className={`${styles.compareCard} ${styles.good}`}>
                <div className={styles.compareLabel}>✅ 良い例（トリガーワードを含む）</div>
                <div className={styles.codeBlock} style={{ margin: 0 }}>
                  <pre style={{ padding: "0.75rem", fontSize: "0.75rem" }}>
                    <code>
                      <span className={styles.key}>description</span>
                      {": "}
                      <span className={styles.str}>{">"}</span>
                      {"\n  "}
                      <span className={styles.str}>
                        コードのセキュリティ・パフォーマンス・バグを包括的にレビューする。
                      </span>
                      {"\n  "}
                      <span className={styles.str}>
                        「レビューして」「確認して」「チェックして」という言葉をトリガーに使用する。
                      </span>
                      {"\n  "}
                      <span className={styles.str}>Pull Request のレビューにも使用する。</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
            <h3>✅ SKILL.md の適切なサイズ</h3>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                chart={`graph LR
A["短すぎる\\n< 10行"] -->|不十分| B["❌ Claudeが\\n何をすべきか不明"]
C["適切\\n50〜500行"] -->|最適| D["✅ 明確な指示で\\n一貫した出力"]
E["長すぎる\\n> 5000行"] -->|コンテキスト肥大| F["❌ 重要な指示が\\n埋もれる"]
style B fill:#2a1c1c,stroke:#f85149,color:#e6edf3
style D fill:#1c2a1c,stroke:#3fb950,color:#e6edf3
style F fill:#2a1c1c,stroke:#f85149,color:#e6edf3`}
              />
            </div>
            <h3>✅ チェックリスト</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>確認項目</th>
                    <th>説明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      ✅ <code>description</code> は具体的か
                    </td>
                    <td>トリガーとなる言葉・状況を含める</td>
                  </tr>
                  <tr>
                    <td>✅ 手順は番号付きリストか</td>
                    <td>箇条書きより番号付きが指示に従いやすい</td>
                  </tr>
                  <tr>
                    <td>✅ 出力形式は明示されているか</td>
                    <td>何を出力すべきか明確にする</td>
                  </tr>
                  <tr>
                    <td>
                      ✅ <code>allowed-tools</code> は必要最小限か
                    </td>
                    <td>不要な権限は与えない（セキュリティ）</td>
                  </tr>
                  <tr>
                    <td>✅ 本文は500行以内か</td>
                    <td>冗長な説明は別ファイルに分ける</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── 13 デバッグと最適化 ── */}
          <section id="debug" className={styles.sec}>
            <div className={styles.secHeader}>
              <span className={styles.secNum}>13</span>
              <h2>デバッグと最適化</h2>
            </div>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                chart={`flowchart TD
A["スキルが正常に動作しない"] --> B{問題の種類}
B -->|発動すべきで発動しない| C["アンダートリガー"]
B -->|無関係な時に発動する| D["オーバートリガー"]
B -->|発動はするが結果が悪い| E["実行フェーズの問題"]
C --> C1["descriptionにトリガーワードを追記"]
C --> C2["/スキル名 で手動呼び出してテスト"]
D --> D1["トリガー条件を絞り込む"]
D --> D2["ネガティブトリガーを追加"]
E --> E1["インストラクションを見直す"]
E --> E2["claude --debug で詳細ログを確認"]
style C fill:#2a2010,stroke:#fbbf24,color:#e6edf3
style D fill:#2a2010,stroke:#fbbf24,color:#e6edf3
style E fill:#1c2530,stroke:#58a6ff,color:#e6edf3`}
              />
            </div>
            <h3>CLIデバッグフラグ一覧</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>フラグ</th>
                    <th>挙動</th>
                    <th>主な用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>claude --debug</code>
                    </td>
                    <td>システム全体のデバッグログを出力</td>
                    <td>スキルがトリガーされない原因調査</td>
                  </tr>
                  <tr>
                    <td>
                      <code>claude --debug &quot;api,hooks&quot;</code>
                    </td>
                    <td>特定カテゴリのログのみ表示</td>
                    <td>API通信・動的注入の挙動調査</td>
                  </tr>
                  <tr>
                    <td>
                      <code>claude --disable-slash-commands</code>
                    </td>
                    <td>全スキルを無効化</td>
                    <td>スキルの干渉を切り分けたい時</td>
                  </tr>
                  <tr>
                    <td>
                      <code>claude --disallowedTools</code>
                    </td>
                    <td>指定ツールを使用不能に</td>
                    <td>テスト環境での安全な検証</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
