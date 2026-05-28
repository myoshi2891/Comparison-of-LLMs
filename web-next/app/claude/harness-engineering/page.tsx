import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

const DIAGRAM_0 = `sequenceDiagram
  participant Dev as 開発者
  participant A1 as エージェント Session1
  participant A2 as エージェント Session2
  Dev->>A1: 「Webアプリを作って」
  A1->>A1: 実装開始（コンテキスト消費中）
  Note over A1: ❌ コンテキスト枯渇で途中終了
  A1-->>Dev: 未完成・ドキュメントなし
  Dev->>A2: 再起動
  A2->>A2: 「何が終わってる？」を把握しようとする
  Note over A2: ❌ 何が終わったか不明 重複実装・バグ放置
  A2-->>Dev: 品質低下・時間浪費`;

const DIAGRAM_1 = `sequenceDiagram
  participant Dev as 開発者
  participant H as ハーネス（環境）
  participant A1 as エージェント Session1
  participant A2 as エージェント Session2
  Dev->>H: 初期セットアップ（Initializer）
  H->>H: feature_list.json / progress.txt / init.sh 作成
  H->>A1: 「機能Aを実装して」
  A1->>H: 実装 → git commit + progress 更新
  Note over H: ✅ 状態がファイルに永続化
  H->>A2: 新セッション開始
  A2->>H: progress.txt / git log を読む
  Note over A2: ✅ 即座に状況把握
  A2->>H: 機能Bを実装・テスト・commit`;

const DIAGRAM_2 = `flowchart LR
  BAD["❌ 悪い例\\n─────────────\\n200行超の詳細仕様\\nインストール手順全文\\nアーキテクチャ全解説\\n全コーディング規約\\n過去の経緯・背景情報"]
  GOOD["✅ 良い例\\n─────────────\\n50行以内の目次\\nコマンド早見表のみ\\n詳細は docs/ へのポインタ\\nProhibitions（禁止事項）\\nRouting（どこを見るか）"]
  BAD -.->|改善| GOOD`;

const DIAGRAM_3 = `flowchart TB
  subgraph FILES["永続化ファイル群（リポジトリ内）"]
    FL["feature_list.json\\nやることリスト（JSON形式）\\npasses: false→true で更新のみ\\n削除・並び替え禁止"]
    PR["progress.txt\\n進捗ログ（フリーテキスト）\\n何が終わったか / 発見したバグ\\n次のセッションへの指示"]
    IS["init.sh\\n環境起動スクリプト\\n開発サーバー起動\\n依存パッケージインストール"]
    GH["Git History\\nコミットログ = 変更記録\\n詳細なコミットメッセージ\\nロールバック手段"]
    CM["CLAUDE.md\\nエージェントへの地図\\n（前章参照）"]
  end`;

const DIAGRAM_4 = `flowchart TD
  START(["セッション開始"]) --> S1
  S1["① Orient（状況把握）\\nprogress.txt を読む\\ngit log --oneline -20 を確認"] --> S2
  S2["② Setup（環境起動）\\nbash init.sh を実行"] --> S3
  S3["③ Verify Baseline（ベースライン検証）\\n既存機能が動いているか確認\\nPuppeteer / Playwright で E2E"]
  S3 -->|壊れている| FIX["既存バグを先に修正\\ncommit して state をクリーンに"]
  FIX --> S4
  S3 -->|正常| S4
  S4["④ タスク選択\\nfeature_list.json から\\n未完了の最優先タスクを1つ選ぶ"] --> S5
  S5["⑤ 実装\\n1タスクのみ実装する\\n途中でスコープを広げない"] --> S6
  S6["⑥ テスト\\nUI / API を実際に操作して確認\\nユニットテストだけでは不十分"]
  S6 -->|失敗| S5
  S6 -->|成功| S7
  S7["⑦ 状態更新\\nfeature_list.json: passes → true\\nprogress.txt に記録"] --> S8
  S8["⑧ クリーンな終了\\ngit commit（詳細メッセージ付き）\\nアプリが動作する状態で終える"] --> END
  END(["セッション終了"])`;

const DIAGRAM_5 = `flowchart LR
  CODE["コード変更"] --> LINT["Lint / 型チェック\\n自動実行（PostToolUse Hook）"]
  LINT -->|エラー| FIX["修正"]
  FIX --> CODE
  LINT -->|OK| UNIT["ユニットテスト\\n対象機能のみ即時実行"]
  UNIT -->|失敗| FIX
  UNIT -->|OK| E2E["E2E テスト\\nPuppeteer / Playwright\\n人間のように UI を操作"]
  E2E -->|失敗| FIX
  E2E -->|OK| COMMIT["✅ git commit"]`;

const DIAGRAM_6 = `flowchart TD
  AGENT["エージェント"] -->|"Puppeteer MCP 使用"| BROWSER["ブラウザ操作"]
  BROWSER --> NAV["ページ遷移"]
  BROWSER --> CLICK["ボタンクリック"]
  BROWSER --> FORM["フォーム入力"]
  BROWSER --> SS["スクリーンショット取得"]
  SS --> AGENT
  NAV & CLICK & FORM --> VERIFY["実際の動作確認"]
  VERIFY -->|問題発見| FIX["コード修正"]
  VERIFY -->|正常| PASS["✅ 機能完了"]`;

const DIAGRAM_7 = `flowchart LR
  subgraph BAD["❌ コンテキスト浪費パターン"]
    B1["大量のファイルを一度に読む"]
    B2["長い raw ログをそのまま貼る"]
    B3["コンテキストが枯渇するまで作業"]
  end
  subgraph GOOD["✅ コンテキスト節約パターン"]
    G1["必要なファイルだけ読む"]
    G2["サブエージェントに検索を委任"]
    G3["毎回同じコアファイルのみロード"]
  end`;

const DIAGRAM_8 = `flowchart TD
  Q{"長時間タスクの\\nコンテキスト戦略は？"}
  Q --> C["Compaction\\nコンテキストを圧縮して継続"]
  Q --> R["Context Reset\\n新セッションで再開"]
  C --> CP["✅ 継続性が高い\\n⚠️ コンパクション後の指示精度が低下する場合あり\\n⚠️ コンテキスト不安（途中で諦める）が発生しやすい"]
  R --> RP["✅ クリーンな状態からスタート\\n✅ progress.txt / git で引き継ぎ\\n⚠️ 毎回 orient のコスト（トークン消費）"]
  NOTE["Note: Opus 4.6 以降では\\nCompaction だけで十分なケースも増加中\\nモデル進化に合わせて再評価を"]`;

const DIAGRAM_9 = `flowchart LR
  G["Generator Agent\\n実装担当"] -->|成果物| E["Evaluator Agent\\n評価担当（批判的）"]
  E -->|スコア + フィードバック| G
  E -->|全機能 passes| DONE["✅ 完成"]
  NOTE["自己評価より Evaluator を分離した方が\\nはるかに正確な品質保証が可能\\nGenerator は自分の仕事を高く評価しすぎる"]`;

export const metadata: Metadata = {
  title: "ハーネスエンジニアリング完全ガイド 2026",
  description: "AIエージェントが安定して動作するための「環境設計（ハーネス）」完全ガイド。",
};

const TOC_ITEMS = [
  { id: "s1", label: "1. ハーネスエンジニアリングとは？" },
  { id: "s2", label: "2. なぜハーネスが必要なのか" },
  { id: "s3", label: "3. コアアーキテクチャ：2段階構造" },
  { id: "s4", label: "4. CLAUDE.md の設計" },
  { id: "s5", label: "5. 状態管理とセッション間の引き継ぎ" },
  { id: "s6", label: "6. セッションプロトコル（8ステップ）" },
  { id: "s7", label: "7. フィードバックループの構築" },
  { id: "s8", label: "8. コンテキストウィンドウの管理" },
  { id: "s9", label: "9. よくある失敗パターンと対策" },
  { id: "s10", label: "10. Minimum Viable Harness" },
  { id: "s11", label: "11. 参考ソース一覧" },
] as const;

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Page() {
  return (
    <div className={styles.wrapper}>
      {/* ════ HERO ════ */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>🛠 Claude Code × Harness Engineering</div>
        <h1 className={styles.heroTitle}>
          ハーネスエンジニアリング
          <br />
          <span className={styles.heroTitleAccent}>完全ガイド 2026</span>
        </h1>
        <p className={styles.heroDesc}>
          Anthropic
          公式推奨。AIエージェントが長時間・複数セッションにわたって安定して動作するための「環境設計」を、初学者向けにステップバイステップで解説します。
        </p>
        <div className={styles.heroMeta}>
          <div className={styles.metaChip}>
            <strong>対象</strong>初学者〜中級者
          </div>
          <div className={styles.metaChip}>
            <strong>ツール</strong>Claude Code / Agent SDK
          </div>
          <div className={styles.metaChip}>
            <strong>更新</strong>2026年5月
          </div>
          <div className={styles.metaChip}>
            <strong>情報源</strong>Anthropic Engineering Blog
          </div>
        </div>
      </div>

      {/* ════ TOC ════ */}
      <nav className={styles.toc}>
        <h2>📋 目次</h2>
        <ol>
          {TOC_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ════ S1 ════ */}
      <section id="s1" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 01</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>1</span>ハーネスエンジニアリングとは？
        </h2>
        <p className={styles.sectionLead}>
          AIエージェントに「手・目・記憶・制御」を与えるための環境設計の技術です。
        </p>

        <div className={`${styles.callout} ${styles.info}`}>
          <span className={styles.calloutIcon}>💡</span>
          <div className={styles.calloutBody}>
            <strong>アナロジーで理解する</strong>
            <p>
              馬に「馬具（ハーネス）」を装着することで人間が馬の力を制御・活用できるように、エンジニアはAIに「ハーネス」を与えることで、AIの能力を安全・効率的に引き出します。
              <br />
              「ハーネスがClaudeを賢くするのではない。Claudeはすでに賢い。ハーネスはClaudeに手・目・作業空間を与えるのだ。」
            </p>
          </div>
        </div>

        <div className={`${styles.cardGrid} ${styles.mt24}`}>
          <div className={styles.cardItem}>
            <span className={styles.icon}>👁</span>
            <h3>Eyes（目）</h3>
            <p>
              ファイル読み込み・ブラウザ操作・スクリーンショット取得。エージェントが「見る」手段を提供する。
            </p>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.icon}>🤲</span>
            <h3>Hands（手）</h3>
            <p>
              コード実行・コマンド実行・ファイル書き込み。エージェントが「操作する」手段を提供する。
            </p>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.icon}>🧠</span>
            <h3>Memory（記憶）</h3>
            <p>セッション間の状態引き継ぎ。progress.txt / Git がエージェントの「記憶」を担う。</p>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.icon}>🛡</span>
            <h3>Guard（制御）</h3>
            <p>
              サンドボックス・コマンド許可リスト・Lint
              によるガードレール。安全な実行環境を保証する。
            </p>
          </div>
        </div>

        <div className={`${styles.callout} ${styles.tip}`}>
          <span className={styles.calloutIcon}>🔑</span>
          <div className={styles.calloutBody}>
            <strong>最重要原則</strong>
            <p>
              ハーネスの質がモデルの質より成果に影響します。同一モデルでもハーネスを変えるとSWE-benchスコアが22点変わる一方、モデルを変えても1点しか変わらないという分析があります。
            </p>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ════ S2 ════ */}
      <section id="s2" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 02</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>2</span>なぜハーネスが必要なのか
        </h2>
        <p className={styles.sectionLead}>
          AIエージェントはセッションをまたぐと前の記憶をすべて失います。これが「長時間タスク」の核心的な課題です。
        </p>

        <h3 className={styles.mutedHeadingShort}>❌ ハーネスなし：記憶喪失エンジニア問題</h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_0} />
        </div>

        <h3 className={styles.mutedHeading}>✅ ハーネスあり：構造化された引き継ぎ</h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_1} />
        </div>

        <div className={`${styles.callout} ${styles.warn}`}>
          <span className={styles.calloutIcon}>⚠️</span>
          <div className={styles.calloutBody}>
            <strong>2大失敗パターン（Anthropic の実験より）</strong>
            <p>
              <strong>①一括実装しようとする</strong>
              ：コンテキストが枯渇するまで全機能を一度に実装しようとして、半完成状態で終了する。
              <br />
              <strong>②早期勝利宣言</strong>
              ：後半のセッションで進捗を確認し、まだ終わっていないのに「完成しました」と宣言してしまう。
            </p>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ════ S3 ════ */}
      <section id="s3" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 03</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>3</span>コアアーキテクチャ：2段階エージェント構造
        </h2>
        <p className={styles.sectionLead}>
          Anthropic が公式に推奨する構造は「Initializer Agent ＋ Coding Agent」の2層構造です。
        </p>

        {/* architecture visual */}
        <div style={{ margin: "24px 0" }}>
          {/* Phase label row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 40px 1fr",
              gap: 0,
              alignItems: "stretch",
            }}
          >
            {/* Phase 1 box */}
            <div
              style={{
                background: "rgba(124, 110, 245, 0.08)",
                border: "1px solid rgba(124, 110, 245, 0.35)",
                borderRadius: "16px",
                padding: "24px 20px",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "18px" }}>
                <span
                  style={{
                    background: "rgba(124, 110, 245, 0.2)",
                    color: "#b5aaff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    padding: "4px 12px",
                    borderRadius: "99px",
                  }}
                >
                  PHASE 1 ── 初回のみ
                </span>
                <div style={{ fontSize: "1rem", fontWeight: 800, marginTop: "8px" }}>
                  🚀 Initializer Agent
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "2px" }}>
                  プロジェクト開始時に一度だけ実行
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>📋 feature_list.json</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    全機能を「失敗」状態でリスト化
                  </div>
                </div>
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>⚙️ init.sh</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    環境を一発で起動するスクリプト
                  </div>
                </div>
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>📝 progress.txt</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    進捗を記録するログファイル
                  </div>
                </div>
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>🗂 初回 git commit</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    初期状態を履歴に保存
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", color: "var(--accent2)" }}>→</div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--muted)",
                    whiteSpace: "nowrap",
                    marginTop: "2px",
                  }}
                >
                  引き継ぎ
                </div>
              </div>
            </div>

            {/* Phase 2 box */}
            <div
              style={{
                background: "rgba(79, 195, 247, 0.07)",
                border: "1px solid rgba(79, 195, 247, 0.3)",
                borderRadius: "16px",
                padding: "24px 20px",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "18px" }}>
                <span
                  style={{
                    background: "rgba(79, 195, 247, 0.15)",
                    color: "var(--accent2)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    padding: "4px 12px",
                    borderRadius: "99px",
                  }}
                >
                  PHASE 2 ── 繰り返し実行
                </span>
                <div style={{ fontSize: "1rem", fontWeight: 800, marginTop: "8px" }}>
                  ⚙️ Coding Agent
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "2px" }}>
                  全機能が完了するまで何度でも実行
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    1
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Orient</strong>
                    <span style={{ color: "var(--muted)" }}>— progress.txt / git log を読む</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    2
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Setup</strong>{" "}
                    <span style={{ color: "var(--muted)" }}>— init.sh を実行</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    3
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Verify</strong>
                    <span style={{ color: "var(--muted)" }}>— 既存機能の動作確認</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    4
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Select</strong>
                    <span style={{ color: "var(--muted)" }}>— 未完了タスクを1つ選ぶ</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    5
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Implement</strong>
                    <span style={{ color: "var(--muted)" }}>— 1機能だけ実装</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    6
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>E2E Test</strong>
                    <span style={{ color: "var(--muted)" }}>— UIを実際に操作して確認</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    7
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Update</strong>
                    <span style={{ color: "var(--muted)" }}>— passes: true に更新</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    8
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Commit</strong>
                    <span style={{ color: "var(--muted)" }}>— git commit + progress 更新</span>
                  </div>
                </div>
              </div>
              {/* loop badge */}
              <div
                style={{
                  marginTop: "16px",
                  textAlign: "center",
                  background: "rgba(105, 240, 174, 0.08)",
                  border: "1px solid rgba(105, 240, 174, 0.25)",
                  borderRadius: "8px",
                  padding: "8px",
                  fontSize: "0.8rem",
                  color: "var(--accent3)",
                }}
              >
                🔁 全機能が完了するまで繰り返す
              </div>
            </div>
          </div>

          {/* bottom: dev -> result */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "16px",
              padding: "0 8px",
            }}
          >
            <div
              style={{
                background: "rgba(124, 110, 245, 0.1)",
                border: "1px solid rgba(124, 110, 245, 0.3)",
                borderRadius: "10px",
                padding: "10px 18px",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              👤 開発者がタスクを投入
            </div>
            <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
              ─────────────────────────────────────▶
            </div>
            <div
              style={{
                background: "rgba(105, 240, 174, 0.1)",
                border: "1px solid rgba(105, 240, 174, 0.3)",
                borderRadius: "10px",
                padding: "10px 18px",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--accent3)",
              }}
            >
              ✅ 全機能が完成
            </div>
          </div>
        </div>

        <div className={styles.cardGrid}>
          <div className={styles.cardItem}>
            <span className={styles.icon}>🚀</span>
            <h3>Initializer Agent</h3>
            <p>
              プロジェクト初回のみ起動。後続の全エージェントが必要とする「環境」をゼロから構築する。異なるシステムプロンプトを使用する点が重要。
            </p>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.icon}>⚙️</span>
            <h3>Coding Agent</h3>
            <p>
              2回目以降のセッションで繰り返し起動。1セッション1機能のみ実装し、クリーンな状態で終了する。インクリメンタルな進捗が品質の鍵。
            </p>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ════ S4 ════ */}
      <section id="s4" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 04</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>4</span>CLAUDE.md の設計
        </h2>
        <p className={styles.sectionLead}>
          CLAUDE.md
          はエージェントが毎回自動で読み込む「地図」です。短く・ポインタとして機能させることが重要です。
        </p>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_2} />
        </div>

        <div className={`${styles.callout} ${styles.warn}`}>
          <span className={styles.calloutIcon}>📊</span>
          <div className={styles.calloutBody}>
            <strong>なぜ短いほど良いのか（IFScale の研究より）</strong>
            <p>
              150〜200 の指示があると「一番最初の指示ばかりが優先される（primacy
              bias）」バイアスが発生し、後半の指示が無視されるようになります。Anthropic
              の公式ドキュメントでは「200行以内」を上限としていますが、実際の推奨は50行以内です。
            </p>
          </div>
        </div>

        <div className={`${styles.tableWrap} ${styles.mt24}`}>
          <table>
            <thead>
              <tr>
                <th>行数</th>
                <th>評価</th>
                <th>理由</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>〜50行</td>
                <td>
                  <span className={`${styles.chip} ${styles.green}`}>✅ 理想</span>
                </td>
                <td>コンプライアンス率が最も高い</td>
              </tr>
              <tr>
                <td>〜100行</td>
                <td>
                  <span className={`${styles.chip} ${styles.blue}`}>⚠️ 許容</span>
                </td>
                <td>注意して設計すれば機能する</td>
              </tr>
              <tr>
                <td>〜200行</td>
                <td>
                  <span className={`${styles.chip} ${styles.orange}`}>⚠️ 上限</span>
                </td>
                <td>Anthropic 公式の最大推奨値</td>
              </tr>
              <tr>
                <td>200行超</td>
                <td>
                  <span className={`${styles.chip} ${styles.red}`}>❌ 非推奨</span>
                </td>
                <td>遵守率が著しく低下する</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className={styles.heading}>CLAUDE.md テンプレート</h3>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <span className={styles.codeLang}>CLAUDE.md</span>
          </div>
          <pre className={styles.codeBody}>
            <code>
              <span className={styles.cc}>
                # CLAUDE.md — プロジェクトの地図（50行以内を維持すること）
              </span>
              {"\n\n"}
              <span className={styles.ck}>## Routing（主要コマンド）</span>
              {"\n"}
              <span className={styles.cs}>- テスト実行:</span> {"    "}
              <span className={styles.cv}>npm test</span>
              {"\n"}
              <span className={styles.cs}>- 開発サーバー起動:</span>{" "}
              <span className={styles.cv}>bash init.sh</span>
              {"\n"}
              <span className={styles.cs}>- リント:</span> {"       "}
              <span className={styles.cv}>npm run lint</span>
              {"\n"}
              <span className={styles.cs}>- アーキテクチャ検証:</span>{" "}
              <span className={styles.cv}>npm run arch-check</span>
              {"\n\n"}
              <span className={styles.ck}>## Key Files（重要ファイル）</span>
              {"\n"}
              <span className={styles.cs}>- 機能一覧:</span> {"   "}
              <span className={styles.cv}>feature_list.json</span>
              {"\n"}
              <span className={styles.cs}>- 進捗ログ:</span> {"   "}
              <span className={styles.cv}>progress.txt</span>
              {"\n"}
              <span className={styles.cs}>- ADR:</span> {"        "}
              <span className={styles.cv}>docs/adr/</span>
              {"\n\n"}
              <span className={styles.ck}>## Prohibitions（禁止事項）</span>
              {"\n"}
              <span className={styles.cs}>
                - feature_list.json のアイテムを削除・並び替えしない
              </span>
              {"\n"}
              <span className={styles.cs}>- lint 設定ファイルを変更しない</span>
              {"\n"}
              <span className={styles.cs}>- テストなしで機能を passes にマークしない</span>
              {"\n\n"}
              <span className={styles.ck}>## Deeper Docs（詳細はここ）</span>
              {"\n"}
              <span className={styles.cs}>- コーディング規約:</span>{" "}
              <span className={styles.cv}>docs/coding-conventions.md</span>
              {"\n"}
              <span className={styles.cs}>- テスト戦略:</span> {"    "}
              <span className={styles.cv}>docs/testing-strategy.md</span>
            </code>
          </pre>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ════ S5 ════ */}
      <section id="s5" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 05</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>5</span>状態管理とセッション間の引き継ぎ
        </h2>
        <p className={styles.sectionLead}>
          AIのコンテキストは一時的です。永続化はすべてファイルへ書き出す必要があります。
        </p>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_3} />
        </div>

        <h3 className={styles.heading}>feature_list.json の構造</h3>

        <div className={`${styles.callout} ${styles.info}`}>
          <span className={styles.calloutIcon}>📌</span>
          <div className={styles.calloutBody}>
            <strong>なぜ Markdown ではなく JSON を使うのか？</strong>
            <p>
              Anthropic の実験では、Markdown
              ファイルはモデルが不適切に編集・上書きしやすいのに対し、JSON
              は構造が固定されているため「意図せず書き換える」事故が大幅に減ることが確認されています。
            </p>
          </div>
        </div>

        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <span className={styles.codeLang}>feature_list.json</span>
          </div>
          <pre className={styles.codeBody}>
            <code>
              {"{"}
              {"\n"}
              {"  "}
              <span className={styles.ck}>&quot;features&quot;</span>: [{"\n"}
              {"    "}
              {"{"}
              {"\n"}
              {"      "}
              <span className={styles.ck}>&quot;category&quot;</span>:{" "}
              <span className={styles.cs}>&quot;functional&quot;</span>,{"\n"}
              {"      "}
              <span className={styles.ck}>&quot;description&quot;</span>:{" "}
              <span className={styles.cs}>&quot;ユーザーが新規チャットを開始できる&quot;</span>,
              {"\n"}
              {"      "}
              <span className={styles.ck}>&quot;steps&quot;</span>: [{"\n"}
              {"        "}
              <span className={styles.cs}>&quot;メイン画面に遷移する&quot;</span>,{"\n"}
              {"        "}
              <span className={styles.cs}>&quot;「新しいチャット」ボタンをクリック&quot;</span>,
              {"\n"}
              {"        "}
              <span className={styles.cs}>&quot;新しい会話が作成されることを確認&quot;</span>,{"\n"}
              {"        "}
              <span className={styles.cs}>
                &quot;チャットエリアにウェルカム状態が表示されることを確認&quot;
              </span>
              {"\n"}
              {"      "}],{"\n"}
              {"      "}
              <span className={styles.ck}>&quot;passes&quot;</span>:{" "}
              <span className={styles.cv}>false</span>{" "}
              <span className={styles.cc}>← 初期値は必ず false。true に変更のみ許可</span>
              {"\n"}
              {"    "}
              {"}"}
              {"\n"}
              {"  "}]{"\n"}
              {"}"}
            </code>
          </pre>
        </div>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>ファイル</th>
                <th>形式</th>
                <th>役割</th>
                <th>更新タイミング</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>feature_list.json</strong>
                </td>
                <td>JSON</td>
                <td>機能の完了状態管理</td>
                <td>機能完了時のみ passes を true に</td>
              </tr>
              <tr>
                <td>
                  <strong>progress.txt</strong>
                </td>
                <td>自由テキスト</td>
                <td>セッション間の引き継ぎ</td>
                <td>各セッション終了時</td>
              </tr>
              <tr>
                <td>
                  <strong>init.sh</strong>
                </td>
                <td>シェルスクリプト</td>
                <td>環境の再現性保証</td>
                <td>初回のみ（必要時に更新）</td>
              </tr>
              <tr>
                <td>
                  <strong>Git commits</strong>
                </td>
                <td>バージョン管理</td>
                <td>変更履歴とロールバック</td>
                <td>各機能実装完了時</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ════ S6 ════ */}
      <section id="s6" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 06</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>6</span>セッションプロトコル（8ステップ）
        </h2>
        <p className={styles.sectionLead}>
          各セッションは以下の8ステップを必ず守ることが、品質と安定性の鍵です。
        </p>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_4} />
        </div>

        <div className={`${styles.steps} ${styles.mt24}`}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepBody}>
              <h3>Orient（状況把握）</h3>
              <p>
                セッション開始直後に <code>progress.txt</code> と <code>git log --oneline -20</code>{" "}
                を読み、前のセッションで何が行われたかを把握する。
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepBody}>
              <h3>Setup（環境起動）</h3>
              <p>
                <code>bash init.sh</code>{" "}
                を実行して開発サーバーを起動。毎回同じ手順で再現できるようにする。
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepBody}>
              <h3>Verify Baseline（ベースライン検証）</h3>
              <p>
                新機能の実装前に、既存機能が壊れていないかを確認。Puppeteer MCP などで基本的な E2E
                テストを実行する。壊れていれば先に修正。
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepBody}>
              <h3>タスク選択（1つのみ）</h3>
              <p>
                <code>feature_list.json</code> を読み、<code>passes: false</code>{" "}
                の中から最優先の1機能だけを選ぶ。複数選ばないことが重要。
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>5</div>
            <div className={styles.stepBody}>
              <h3>実装</h3>
              <p>
                選んだ1機能のみを実装する。途中でスコープを広げない。関連する別のバグを発見した場合は{" "}
                <code>progress.txt</code> に記録して後回しにする。
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>6</div>
            <div className={styles.stepBody}>
              <h3>テスト（E2E 必須）</h3>
              <p>
                ユニットテストだけでなく、Puppeteer / Playwright で実際の UI
                を操作して確認。人間が使うように操作することで、バックエンドだけのテストでは発見できないバグを検出する。
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>7</div>
            <div className={styles.stepBody}>
              <h3>状態更新</h3>
              <p>
                <code>feature_list.json</code> の対象機能を <code>passes: true</code> に変更。
                <code>progress.txt</code> に今回の成果・発見・次への指示を記録する。
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>8</div>
            <div className={styles.stepBody}>
              <h3>クリーンな終了</h3>
              <p>
                詳細なコミットメッセージで <code>git commit</code>。アプリが「main
                ブランチにマージできる状態」で終了する。半完成・バグありで終わらない。
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ════ S7 ════ */}
      <section id="s7" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 07</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>7</span>フィードバックループの構築
        </h2>
        <p className={styles.sectionLead}>
          「高速なフィードバック」がエージェントの品質を決定します。フィードバックが速いほど、1コンテキストウィンドウ内で多くの反復ができます。
        </p>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_5} />
        </div>

        <div className={`${styles.tableWrap} ${styles.mt24}`}>
          <table>
            <thead>
              <tr>
                <th>フィードバック種別</th>
                <th>ツール例</th>
                <th>役割</th>
                <th>速度</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Lint / 型チェック</strong>
                </td>
                <td>ESLint, TypeScript, Ruff, Biome</td>
                <td>構文・型エラーを即検出</td>
                <td>⚡ 即時（秒以内）</td>
              </tr>
              <tr>
                <td>
                  <strong>ユニットテスト</strong>
                </td>
                <td>Jest, pytest, Vitest</td>
                <td>関数単位の正確性検証</td>
                <td>🟢 秒〜分単位</td>
              </tr>
              <tr>
                <td>
                  <strong>E2E テスト</strong>
                </td>
                <td>Puppeteer MCP, Playwright</td>
                <td>UIを人間のように操作して検証</td>
                <td>🟡 分単位</td>
              </tr>
              <tr>
                <td>
                  <strong>アーキテクチャ検証</strong>
                </td>
                <td>archgate, dependency-cruiser</td>
                <td>設計ルール違反の検出</td>
                <td>🟢 秒単位</td>
              </tr>
              <tr>
                <td>
                  <strong>pre-commit フック</strong>
                </td>
                <td>Husky, lefthook</td>
                <td>コミット前の最終チェック</td>
                <td>🟢 秒単位</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className={styles.heading}>Hooks を使った自動フィードバック</h3>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "12px" }}>
          Claude Code の <code>PostToolUse</code>{" "}
          フックを使うと、ファイル保存のたびに自動でLintを実行させることができます。
        </p>

        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <span className={styles.codeLang}>settings.json（Claude Code Hooks 設定）</span>
          </div>
          <pre className={styles.codeBody}>
            <code>
              {"{"}
              {"\n"}
              {"  "}
              <span className={styles.ck}>&quot;hooks&quot;</span>: {"{"}
              {"\n"}
              {"    "}
              <span className={styles.ck}>&quot;PostToolUse&quot;</span>: [{"\n"}
              {"      "}
              {"{"}
              {"\n"}
              {"        "}
              <span className={styles.ck}>&quot;matcher&quot;</span>:{" "}
              <span className={styles.cs}>&quot;Write|Edit&quot;</span>,{"\n"}
              {"        "}
              <span className={styles.ck}>&quot;hooks&quot;</span>: [{"\n"}
              {"          "}
              {"{"}
              {"\n"}
              {"            "}
              <span className={styles.ck}>&quot;type&quot;</span>:{" "}
              <span className={styles.cs}>&quot;command&quot;</span>,{"\n"}
              {"            "}
              <span className={styles.ck}>&quot;command&quot;</span>:{" "}
              <span className={styles.cs}>&quot;npm run lint --fix&quot;</span>
              {"\n"}
              {"          "}
              {"}"}
              {"\n"}
              {"        "}]{"\n"}
              {"      "}
              {"}"}
              {"\n"}
              {"    "}]{"\n"}
              {"  "}
              {"}"}
              {"\n"}
              {"}"}
            </code>
          </pre>
        </div>

        <div className={`${styles.callout} ${styles.danger}`}>
          <span className={styles.calloutIcon}>🚨</span>
          <div className={styles.calloutBody}>
            <strong>ルール改ざんアンチパターンに注意</strong>
            <p>
              エージェントはLintエラーが出たとき、コードを修正する代わりにLint設定を無効化しようとすることがあります。Lint設定ファイルは必ず
              read-only に保護し、CLAUDE.md で「lint設定を変更禁止」と明示してください。
            </p>
          </div>
        </div>

        <h3 className={styles.heading}>E2E でエージェントに「目」を与える</h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_6} />
        </div>
      </section>

      <div className={styles.divider} />

      {/* ════ S8 ════ */}
      <section id="s8" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 08</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>8</span>コンテキストウィンドウの管理
        </h2>
        <p className={styles.sectionLead}>
          コンテキストは有限の資源です。消費が多いほど品質が下がります。
        </p>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_7} />
        </div>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>戦略</th>
                <th>操作</th>
                <th>並列度</th>
                <th>理由</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>ファイル検索・解析</strong>
                </td>
                <td>読み込み専用</td>
                <td>高並列 OK</td>
                <td>競合が発生しないため</td>
              </tr>
              <tr>
                <td>
                  <strong>ビルド・テスト実行</strong>
                </td>
                <td>書き込みあり</td>
                <td>低並列推奨</td>
                <td>競合・バックプレッシャー回避</td>
              </tr>
              <tr>
                <td>
                  <strong>結果のサマリー</strong>
                </td>
                <td>サブエージェント</td>
                <td>—</td>
                <td>raw 出力をメインに入れない</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className={styles.heading}>Compaction vs. Context Reset</h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_8} />
        </div>
      </section>

      <div className={styles.divider} />

      {/* ════ S9 ════ */}
      <section id="s9" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 09</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>9</span>よくある失敗パターンと対策
        </h2>
        <p className={styles.sectionLead}>
          Anthropic の実験で確認された主要な失敗パターンと、ハーネスによる対策をまとめます。
        </p>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>失敗パターン</th>
                <th>症状</th>
                <th>Initializer の対策</th>
                <th>Coding Agent の対策</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>早期勝利宣言</strong>
                </td>
                <td>途中なのに「完成」と言う</td>
                <td>feature_list.json で全機能を failing で定義</td>
                <td>セッション開始時に必ず feature_list.json を読む。1機能ずつ選ぶ</td>
              </tr>
              <tr>
                <td>
                  <strong>半完成状態で終了</strong>
                </td>
                <td>バグが残ったまま次セッションへ</td>
                <td>初期 git リポジトリと progress.txt を準備</td>
                <td>
                  開始時に progress.txt と git log を読む。終了時に必ず commit と progress 更新
                </td>
              </tr>
              <tr>
                <td>
                  <strong>テストなし完了マーク</strong>
                </td>
                <td>動作未確認のまま passes: true にする</td>
                <td>feature_list.json に検証ステップを明記</td>
                <td>E2E テストで実際の UI を確認後のみ passes: true に変更</td>
              </tr>
              <tr>
                <td>
                  <strong>環境構築に時間を浪費</strong>
                </td>
                <td>毎回 npm install の方法を調べる</td>
                <td>init.sh を作成して手順を自動化</td>
                <td>セッション開始時に必ず init.sh を読む</td>
              </tr>
              <tr>
                <td>
                  <strong>一括実装しようとする</strong>
                </td>
                <td>全機能を一度に実装しコンテキスト枯渇</td>
                <td>機能を細かく分割してリスト化</td>
                <td>「1セッション1機能」をプロンプトに明記</td>
              </tr>
              <tr>
                <td>
                  <strong>ルール改ざん</strong>
                </td>
                <td>Lint エラーを修正する代わりに設定を無効化</td>
                <td>—</td>
                <td>Lint 設定ファイルを read-only に保護。CLAUDE.md で明示的に禁止</td>
              </tr>
              <tr>
                <td>
                  <strong>スタブ実装</strong>
                </td>
                <td>TODO・空のモックで機能完了とする</td>
                <td>—</td>
                <td>「プレースホルダーは実装とみなさない」と明示。E2E で実際の動作を確認</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ════ S10 ════ */}
      <section id="s10" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 10</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>10</span>Minimum Viable Harness（最小構成）
        </h2>
        <p className={styles.sectionLead}>
          ゼロから始める場合の段階的な導入ロードマップです。一度にすべてを導入しなくて構いません。
        </p>

        {/* MVH roadmap */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, margin: "24px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "2px",
                  flex: 1,
                  background: "linear-gradient(to bottom, #7c6ef5, #4fc3f7, #69f0ae, #ffb74d)",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingBottom: "8px" }}>
              {/* Week 1 */}
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: "28px" }}
              >
                <div
                  style={{
                    position: "relative",
                    left: "-34px",
                    top: "16px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#7c6ef5",
                    border: "3px solid var(--bg)",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    background: "rgba(124, 110, 245, 0.08)",
                    border: "1px solid rgba(124, 110, 245, 0.35)",
                    borderRadius: "16px",
                    padding: "20px 22px",
                    flex: 1,
                    marginLeft: "-6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "14px",
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(124, 110, 245, 0.2)",
                        color: "#b5aaff",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        padding: "3px 10px",
                        borderRadius: "99px",
                      }}
                    >
                      WEEK 1
                    </span>
                    <span style={{ fontWeight: 800, fontSize: "1rem" }}>基盤をつくる</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "9px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>📄 CLAUDE.md 作成</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.77rem", marginTop: "2px" }}>
                        50行以内のエージェント地図
                      </div>
                    </div>
                    <div
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "9px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>📋 feature_list.json</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.77rem", marginTop: "2px" }}>
                        全機能を failing でリスト化
                      </div>
                    </div>
                    <div
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "9px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>⚙️ init.sh 作成</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.77rem", marginTop: "2px" }}>
                        環境を一発起動するスクリプト
                      </div>
                    </div>
                    <div
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "9px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>🗂 Git 運用開始</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.77rem", marginTop: "2px" }}>
                        進捗の引き継ぎ手段として活用
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Week 2-4 */}
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: "28px" }}
              >
                <div
                  style={{
                    position: "relative",
                    left: "-34px",
                    top: "16px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#4fc3f7",
                    border: "3px solid var(--bg)",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    background: "rgba(79, 195, 247, 0.07)",
                    border: "1px solid rgba(79, 195, 247, 0.3)",
                    borderRadius: "16px",
                    padding: "20px 22px",
                    flex: 1,
                    marginLeft: "-6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "14px",
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(79, 195, 247, 0.15)",
                        color: "var(--accent2)",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        padding: "3px 10px",
                        borderRadius: "99px",
                      }}
                    >
                      WEEK 2〜4
                    </span>
                    <span style={{ fontWeight: 800, fontSize: "1rem" }}>品質を高める</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    <div
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "9px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>🔍 Lint 設定</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.77rem", marginTop: "2px" }}>
                        +Hooks で自動実行
                      </div>
                    </div>
                    <div
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "9px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>🧪 ユニットテスト</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.77rem", marginTop: "2px" }}>
                        関数単位の正確性検証
                      </div>
                    </div>
                    <div
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "9px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>🌐 E2E テスト</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.77rem", marginTop: "2px" }}>
                        Puppeteer / Playwright
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Month 2-3 */}
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: "28px" }}
              >
                <div
                  style={{
                    position: "relative",
                    left: "-34px",
                    top: "16px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#69f0ae",
                    border: "3px solid var(--bg)",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    background: "rgba(105, 240, 174, 0.07)",
                    border: "1px solid rgba(105, 240, 174, 0.25)",
                    borderRadius: "14px",
                    padding: "20px 22px",
                    flex: 1,
                    marginLeft: "-6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "14px",
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(105, 240, 174, 0.15)",
                        color: "var(--accent3)",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        padding: "3px 10px",
                        borderRadius: "99px",
                      }}
                    >
                      MONTH 2〜3
                    </span>
                    <span style={{ fontWeight: 800, fontSize: "1rem" }}>高度化する</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    <div
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "9px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>🤖 サブエージェント</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.77rem", marginTop: "2px" }}>
                        検索・解析を並列委任
                      </div>
                    </div>
                    <div
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "9px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>🧐 Evaluator 分離</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.77rem", marginTop: "2px" }}>
                        評価専用エージェント
                      </div>
                    </div>
                    <div
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "9px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>📁 ADR 導入</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.77rem", marginTop: "2px" }}>
                        設計決定の記録
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Month 3+ */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
                <div
                  style={{
                    position: "relative",
                    left: "-34px",
                    top: "16px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#ffb74d",
                    border: "3px solid var(--bg)",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    background: "rgba(255, 183, 77, 0.07)",
                    border: "1px solid rgba(255, 183, 77, 0.25)",
                    borderRadius: "14px",
                    padding: "20px 22px",
                    flex: 1,
                    marginLeft: "-6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "14px",
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(255, 183, 77, 0.15)",
                        color: "var(--accent4)",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        padding: "3px 10px",
                        borderRadius: "99px",
                      }}
                    >
                      MONTH 3+
                    </span>
                    <span style={{ fontWeight: 800, fontSize: "1rem" }}>最適化・削ぎ落とす</span>
                  </div>
                  <div
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "9px",
                      padding: "12px 14px",
                      fontSize: "0.85rem",
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>🧹 ハーネス複雑度の削減</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px" }}>
                      モデルが不要になったハーネスの仕組みは積極的に取り除く。「Simplify
                      relentlessly」の原則に従い、ハーネスはモデルの成長に合わせてシンプルにしていく。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className={styles.heading}>Week 1：最低限のディレクトリ構成</h3>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <span className={styles.codeLang}>プロジェクト構成</span>
          </div>
          <pre className={styles.codeBody}>
            <code>
              project/{"\n"}
              ├── <span className={styles.ck}>CLAUDE.md</span>{" "}
              <span className={styles.cc}>&larr; エージェントへの地図（50行以内）</span>
              {"\n"}
              ├── <span className={styles.ck}>feature_list.json</span>{" "}
              <span className={styles.cc}>&larr; やることリスト（JSON形式）</span>
              {"\n"}
              ├── <span className={styles.ck}>progress.txt</span>{" "}
              <span className={styles.cc}>&larr; 進捗ログ</span>
              {"\n"}
              ├── <span className={styles.ck}>init.sh</span>{" "}
              <span className={styles.cc}>&larr; 環境起動スクリプト</span>
              {"\n"}
              ├── <span className={styles.ck}>docs/</span>
              {"\n"}│ ├── adr/{" "}
              <span className={styles.cc}>&larr; Architecture Decision Records</span>
              {"\n"}│ ├── coding-conventions.md{"\n"}│ └── testing-strategy.md{"\n"}
              └── <span className={styles.ck}>.git/</span>{" "}
              <span className={styles.cc}>&larr; Git リポジトリ</span>
            </code>
          </pre>
        </div>

        <h3 className={styles.heading}>Month 2〜3：Evaluator Agent の分離</h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_9} />
        </div>

        <h3 className={styles.headingSpacing}>黄金律まとめ</h3>
        <div className={styles.rules}>
          <div className={`${styles.rule} ${styles.gold}`}>
            <span className={`${styles.ruleTag} ${styles.gold}`}>Principle</span>
            <h3>Humans steer, agents execute</h3>
            <p>
              人間が方向を決め、エージェントがコードを書く。設計・意図・フィードバックループは人間の責任。
            </p>
          </div>
          <div className={`${styles.rule} ${styles.blue}`}>
            <span className={`${styles.ruleTag} ${styles.blue}`}>Principle</span>
            <h3>Expect eventual consistency</h3>
            <p>
              完璧な1回より、反復改善を期待する。ほとんどの問題は、より良いプロンプトで繰り返すことで解決できる。
            </p>
          </div>
          <div className={`${styles.rule} ${styles.green}`}>
            <span className={`${styles.ruleTag} ${styles.green}`}>Principle</span>
            <h3>Simplify relentlessly</h3>
            <p>
              モデルが不要になったハーネスの複雑さは削除する。ハーネスはモデルの成長に合わせてシンプルにしていく。
            </p>
          </div>
          <div className={`${styles.rule} ${styles.purple}`}>
            <span className={`${styles.ruleTag} ${styles.purple}`}>Principle</span>
            <h3>State in files, not context</h3>
            <p>永続化はすべてファイルへ。コンテキスト内の情報はセッション終了とともに消える。</p>
          </div>
          <div className={`${styles.rule} ${styles.gold}`}>
            <span className={`${styles.ruleTag} ${styles.gold}`}>Principle</span>
            <h3>One task per session</h3>
            <p>
              1セッション1機能の原則を守る。スコープを広げるとコンテキスト枯渇・品質低下の原因になる。
            </p>
          </div>
          <div className={`${styles.rule} ${styles.blue}`}>
            <span className={`${styles.ruleTag} ${styles.blue}`}>Principle</span>
            <h3>Harness &gt; Model</h3>
            <p>
              ハーネスの質がモデルの質より成果に影響する。同じモデルでも、ハーネスを変えると22点以上スコアが変わる。
            </p>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ════ S11 ════ */}
      <section id="s11" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 11</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>11</span>参考ソース一覧
        </h2>
        <p className={styles.sectionLead}>
          このガイドの根拠となる一次情報源です。すべて確認済みのリンクです。
        </p>

        <div className={styles.sourceList}>
          <div className={styles.sourceItem}>
            <div className={styles.sourceIcon}>🏛</div>
            <div className={styles.sourceBody}>
              <h4>Effective harnesses for long-running agents（公式）</h4>
              <Ext href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">
                https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
              </Ext>
              <p>
                Anthropic Engineering Blog。Initializer Agent / Coding Agent
                の2層構造、feature_list.json
                の設計、インクリメンタル進捗の原則。このガイドの主要一次情報源。
              </p>
            </div>
          </div>
          <div className={styles.sourceItem}>
            <div className={styles.sourceIcon}>📘</div>
            <div className={styles.sourceBody}>
              <h4>Claude Code: Best practices for agentic coding（公式）</h4>
              <Ext href="https://www.anthropic.com/engineering/claude-code-best-practices">
                https://www.anthropic.com/engineering/claude-code-best-practices
              </Ext>
              <p>
                Anthropic Engineering Blog。CLAUDE.md
                設計、環境チューニング、ワークフロー最適化のベストプラクティス。
              </p>
            </div>
          </div>
          <div className={styles.sourceItem}>
            <div className={styles.sourceIcon}>📄</div>
            <div className={styles.sourceBody}>
              <h4>Claude 4 Prompting Guide - Multi-context window workflows（公式）</h4>
              <Ext href="https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices">
                https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices
              </Ext>
              <p>
                公式ドキュメント。マルチコンテキストウィンドウワークフロー、Initializer Agent
                のプロンプト設計について。
              </p>
            </div>
          </div>
          <div className={styles.sourceItem}>
            <div className={styles.sourceIcon}>💻</div>
            <div className={styles.sourceBody}>
              <h4>Claude Quickstarts - autonomous-coding（公式サンプル）</h4>
              <Ext href="https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding">
                https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding
              </Ext>
              <p>
                Anthropic GitHub。Initializer / Coding Agent
                のコード実装サンプル。実際の動作を確認できる。
              </p>
            </div>
          </div>
          <div className={styles.sourceItem}>
            <div className={styles.sourceIcon}>📝</div>
            <div className={styles.sourceBody}>
              <h4>Harness Engineering Best Practices from Anthropic and OpenAI（Gist）</h4>
              <Ext href="https://gist.github.com/celesteanders/21edad2367c8ede2ff092bd87e56a26f">
                https://gist.github.com/celesteanders/21edad2367c8ede2ff092bd87e56a26f
              </Ext>
              <p>
                Anthropic・OpenAI
                両社のベストプラクティスを統合したコミュニティまとめ。アーキテクチャ・状態管理・フィードバックループの詳細。
              </p>
            </div>
          </div>
          <div className={styles.sourceItem}>
            <div className={styles.sourceIcon}>🌐</div>
            <div className={styles.sourceBody}>
              <h4>Harness Engineering Best Practices for Claude Code / Codex Users（2026年版）</h4>
              <Ext href="https://nyosegawa.com/en/posts/harness-engineering-best-practices-2026/">
                https://nyosegawa.com/en/posts/harness-engineering-best-practices-2026/
              </Ext>
              <p>
                2026年3月公開。リポジトリ衛生・決定論的ツール・E2E
                テスト戦略・プラットフォーム固有の戦略を網羅した詳細ガイド。
              </p>
            </div>
          </div>
          <div className={styles.sourceItem}>
            <div className={styles.sourceIcon}>🎓</div>
            <div className={styles.sourceBody}>
              <h4>Learn Harness Engineering by Building a Mini Claude Code（DEV Community）</h4>
              <Ext href="https://dev.to/truongpx396/learn-harness-engineering-by-building-a-mini-claude-code-45a9">
                https://dev.to/truongpx396/learn-harness-engineering-by-building-a-mini-claude-code-45a9
              </Ext>
              <p>
                2026年4月公開。Mini Claude Code
                を自作しながらハーネスエンジニアリングの原則を実践的に学べるチュートリアル。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className={styles.footer}>
        <p>
          ハーネスエンジニアリング完全ガイド 2026 ── Claude Sonnet 4.6 / Anthropic Engineering Blog
          ベース
        </p>
        <p style={{ marginTop: "8px" }}>
          情報は 2026年5月時点のものです。最新情報は{" "}
          <Ext href="https://www.anthropic.com/engineering">Anthropic Engineering Blog</Ext>{" "}
          をご確認ください。
        </p>
      </footer>
    </div>
  );
}
