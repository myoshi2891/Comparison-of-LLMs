import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

const DIAG_0 = `graph LR
subgraph WEB["Claude.ai Web Mobile"]
W1["テキスト生成・質問回答"]
W2["コード生成・説明"]
W3["ファイルアップロード 単発"]
end
subgraph CW["Cowork Desktop"]
C1["ファイルシステムへの直接アクセス"]
C2["フォルダ監視・自動トリガー"]
C3["Skills による繰り返し自動化"]
C4["ローカルアプリとの連携"]
end
style WEB fill:#1a2530,stroke:#58a6ff,color:#e6edf3
style CW fill:#2a1a0a,stroke:#f97316,color:#e6edf3`;

const DIAG_1 = `sequenceDiagram
participant U as ユーザー
participant CW as Cowork
participant FS as ファイルシステム
participant AI as Claude AI
U->>CW: Downloads の PDF を月別に整理して
CW->>FS: フォルダの内容をスキャン
FS-->>CW: ファイル一覧を返す
CW->>AI: ファイル一覧と指示を送信
AI-->>CW: 実行計画を生成
Note over CW: 実行前に計画をユーザーに提示
CW->>U: これを実行しますか
U->>CW: OK
CW->>FS: ファイルを移動・整理
CW-->>U: 完了レポート`;

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export const metadata: Metadata = {
  title: "Claude Cowork 完全入門ガイド",
  description:
    "コードを一行も書かずに自然言語の指示だけでファイル管理・タスク自動化を実現する Anthropic のデスクトップツール「Cowork」を初学者向けにゼロから解説します。",
};

export default function Page() {
  return (
    <div className={styles.pageWrap}>
      {/* ── TOP NAV ── */}
      <nav className={styles.topnav} aria-label="ページナビゲーション">
        <div className={styles.topnavInner}>
          <div className={styles.topnavLogo}>
            <span className={styles.logoPill}>Cowork</span>
            <span className={styles.siteTitle}>完全入門ガイド</span>
          </div>
          <div className={styles.topnavLinks}>
            <div className={styles.topnavGroup}>
              <span className={styles.groupLabel}>基礎</span>
              <a href="#what" className={styles.navLink}>
                <span className={styles.navNum}>01</span>&nbsp;概要
              </a>
              <a href="#products" className={styles.navLink}>
                <span className={styles.navNum}>02</span>&nbsp;製品比較
              </a>
              <a href="#setup" className={styles.navLink}>
                <span className={styles.navNum}>03</span>&nbsp;セットアップ
              </a>
            </div>
            <div className={styles.topnavGroup}>
              <span className={styles.groupLabel}>機能</span>
              <a href="#natural-language" className={styles.navLink}>
                <span className={styles.navNum}>04</span>&nbsp;自然言語操作
              </a>
              <a href="#file-tasks" className={styles.navLink}>
                <span className={styles.navNum}>05</span>&nbsp;タスク自動化
              </a>
              <a href="#skills" className={styles.navLink}>
                <span className={styles.navNum}>06</span>&nbsp;Skills連携
              </a>
            </div>
            <div className={styles.topnavGroup}>
              <span className={styles.groupLabel}>実践</span>
              <a href="#workflow" className={styles.navLink}>
                <span className={styles.navNum}>07</span>&nbsp;ワークフロー
              </a>
              <a href="#skill-writing" className={styles.navLink}>
                <span className={styles.navNum}>08</span>&nbsp;スキルの書き方
              </a>
              <a href="#best-practices" className={styles.navLink}>
                <span className={styles.navNum}>09</span>&nbsp;ベストプラクティス
              </a>
              <a href="#advanced" className={styles.navLink}>
                <span className={styles.navNum}>10</span>&nbsp;応用
              </a>
            </div>
            <div className={styles.topnavGroup}>
              <span className={styles.groupLabel}>参考</span>
              <a href="#sources" className={styles.navLink}>
                <span className={styles.navNum}>11</span>&nbsp;ソース
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.pageContent}>
        {/* ── HERO ── */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            Claude Cowork · 非開発者向けデスクトップ自動化ツール
          </div>
          <h1>
            Claude Cowork
            <br />
            完全入門ガイド
          </h1>
          <p className={styles.heroSub}>
            コードを一行も書かずに、自然言語の指示だけでファイル管理・タスク自動化を実現する
            Anthropic のデスクトップツール「Cowork」を、初学者向けにゼロから解説します。 Skills
            との連携・ベストプラクティス・実践ワークフロー例まで網羅。
          </p>
          <div className={styles.heroMeta}>
            <span className={`${styles.heroChip} ${styles.chipOrange}`}>🖥️ デスクトップアプリ</span>
            <span className={`${styles.heroChip} ${styles.chipBlue}`}>👥 非開発者向け</span>
            <span className={`${styles.heroChip} ${styles.chipGreen}`}>⚡ Skills 対応</span>
            <span className={`${styles.heroChip} ${styles.chipPurple}`}>🤖 Claude AI 搭載</span>
          </div>
        </section>

        {/* ── 01 WHAT IS COWORK ── */}
        <section className={styles.section} id="what">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>01</span>
            <h2>Cowork とは何か？</h2>
          </div>
          <p>
            <strong>Cowork</strong> は Anthropic が提供するデスクトップアプリケーションです。
            <strong>コードを一行も書かずに</strong>、自然言語（日本語・英語）の指示だけで
            ファイル管理やタスク自動化を実現できます。
          </p>
          <div className={`${styles.callout} ${styles.calloutTip}`}>
            <span className={styles.calloutIcon}>💡</span>
            <p>
              <strong>ひとことで言うと:</strong>
              「AI にパソコンの操作権限を与えたもの」です。 Claude に「この 400 件の PDF
              を要約して」「毎週月曜に売上レポートをまとめて」と話しかけるだけで実行してくれます。
            </p>
          </div>
          <h3>Cowork が解決する問題</h3>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>😩</div>
              <div className={styles.cardTitle}>繰り返し作業の疲弊</div>
              <div className={styles.cardDesc}>
                毎週同じ形式でファイルを整理・リネーム・変換する単調作業を自動化。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📄</div>
              <div className={styles.cardTitle}>大量ドキュメント処理</div>
              <div className={styles.cardDesc}>
                PDF・Word・Excel
                を一括で読み取り・要約・変換。手作業では数時間かかる処理が分単位で完了。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🔄</div>
              <div className={styles.cardTitle}>定型ワークフロー</div>
              <div className={styles.cardDesc}>
                「毎朝9時に〇〇をして」「このフォルダにファイルが来たら〇〇して」などを定期実行。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🚫</div>
              <div className={styles.cardTitle}>プログラミング不要</div>
              <div className={styles.cardDesc}>
                Python・bash の知識ゼロでも、複雑な自動化タスクを自然言語で実現できる。
              </div>
            </div>
          </div>
          <h3>Cowork vs Claude.ai の違い</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_0} />
          </div>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <span className={styles.calloutIcon}>ℹ️</span>
            <p>
              <strong>現在の提供状況:</strong> Cowork は Anthropic の Beta
              製品として提供されています。 アクセスには waitlist への登録が必要な場合があります。
              最新の提供状況は <Ext href="https://claude.ai">claude.ai</Ext> で確認してください。
            </p>
          </div>
        </section>

        {/* ── 02 PRODUCTS ── */}
        <section className={styles.section} id="products">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>02</span>
            <h2>Anthropic 製品ラインアップとの比較</h2>
          </div>
          <p>
            Anthropic は Claude を複数の形態で提供しています。Cowork
            は「デスクトップで動く非開発者向けツール」として独自のポジションを持ちます。
          </p>
          <div className={styles.productRow}>
            <div className={styles.productCard}>
              <div className={styles.productEmoji}>💬</div>
              <div className={styles.productName}>Claude.ai</div>
              <div className={styles.productTarget}>Web / Mobile Chat</div>
              <div className={styles.productDesc}>日常的な質問・コード生成・文書作成</div>
            </div>
            <div className={`${styles.productCard} ${styles.productCardHighlight}`}>
              <div className={styles.productEmoji}>🖥️</div>
              <div className={styles.productName}>Cowork</div>
              <div className={styles.productTarget}>Desktop App (Beta)</div>
              <div className={styles.productDesc}>ファイル管理・タスク自動化（非開発者）</div>
            </div>
            <div className={styles.productCard}>
              <div className={styles.productEmoji}>⌨️</div>
              <div className={styles.productName}>Claude Code</div>
              <div className={styles.productTarget}>CLI (Terminal)</div>
              <div className={styles.productDesc}>コードベース全体の理解・リファクタリング</div>
            </div>
            <div className={styles.productCard}>
              <div className={styles.productEmoji}>🌐</div>
              <div className={styles.productName}>Claude in Chrome</div>
              <div className={styles.productTarget}>Browser Extension (Beta)</div>
              <div className={styles.productDesc}>Web ブラウジングの自動化エージェント</div>
            </div>
            <div className={styles.productCard}>
              <div className={styles.productEmoji}>📊</div>
              <div className={styles.productName}>Claude in Excel</div>
              <div className={styles.productTarget}>Spreadsheet Agent (Beta)</div>
              <div className={styles.productDesc}>スプレッドシート操作・データ分析</div>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>Claude.ai</th>
                  <th>Cowork ★</th>
                  <th>Claude Code</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>対象ユーザー</strong>
                  </td>
                  <td>誰でも</td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeOrange}`}>非開発者</span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeBlue}`}>開発者</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>ファイル直接操作</strong>
                  </td>
                  <td>❌</td>
                  <td>✅ ローカル直接</td>
                  <td>✅ リポジトリ内</td>
                </tr>
                <tr>
                  <td>
                    <strong>自動化・定期実行</strong>
                  </td>
                  <td>❌</td>
                  <td>✅ トリガー設定可</td>
                  <td>⚡ /loop コマンド</td>
                </tr>
                <tr>
                  <td>
                    <strong>Skills 連携</strong>
                  </td>
                  <td>✅ (claude.ai Skills)</td>
                  <td>✅ SKILL.md 対応</td>
                  <td>✅ SKILL.md ネイティブ</td>
                </tr>
                <tr>
                  <td>
                    <strong>プログラミング知識</strong>
                  </td>
                  <td>不要</td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>不要</span>
                  </td>
                  <td>必要（推奨）</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`${styles.callout} ${styles.calloutTip}`}>
            <span className={styles.calloutIcon}>🎯</span>
            <p>
              <strong>選択指針:</strong>
              「コードを書きたくないが、ファイル整理・定期レポートを自動化したい」なら
              <strong>Cowork</strong> が最適解です。エンジニアリングチームには Claude Code、
              日常的な質疑には Claude.ai を使い分けましょう。
            </p>
          </div>
        </section>

        {/* ── 03 SETUP ── */}
        <section className={styles.section} id="setup">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>03</span>
            <h2>セットアップ手順</h2>
          </div>
          <p>Cowork のインストールから初期設定まで、ステップバイステップで解説します。</p>
          <div className={styles.steps}>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>1</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Anthropic アカウントを用意する</div>
                <div className={styles.stepDesc}>
                  <Ext href="https://claude.ai">claude.ai</Ext> でアカウントを作成します。 Cowork は
                  Pro プラン以上（または Team/Enterprise）で利用できます。
                  <div
                    className={`${styles.callout} ${styles.calloutInfo}`}
                    style={{ marginTop: "0.75rem" }}
                  >
                    <span className={styles.calloutIcon}>ℹ️</span>
                    <p>
                      Beta 期間中はウェイトリストへの登録が必要な場合があります。
                      <Ext href="https://support.claude.com">support.claude.com</Ext>{" "}
                      で最新状況を確認してください。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Cowork デスクトップアプリをダウンロード</div>
                <div className={styles.stepDesc}>
                  claude.ai のダッシュボードから「Cowork」を選択し、お使いの OS（macOS /
                  Windows）用インストーラーをダウンロードします。
                </div>
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>3</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>インストールとサインイン</div>
                <div className={styles.stepDesc}>
                  インストーラーを実行してアプリをインストールします。起動後、Claude.ai
                  と同じアカウントでサインインします。
                </div>
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>4</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>作業フォルダへのアクセス権限を設定</div>
                <div className={styles.stepDesc}>
                  Cowork が操作するフォルダへのアクセス許可を設定します。
                  <div
                    className={`${styles.callout} ${styles.calloutWarn}`}
                    style={{ marginTop: "0.75rem" }}
                  >
                    <span className={styles.calloutIcon}>⚠️</span>
                    <p>
                      <strong>セキュリティ注意:</strong>
                      必要最小限のフォルダのみアクセスを許可しましょう。機密情報を含むフォルダへのアクセスは慎重に検討してください。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>5</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>動作確認 — 最初の指示を試す</div>
                <div className={styles.stepDesc}>
                  <div className={styles.codeBlock} style={{ marginTop: "0.5rem" }}>
                    <div className={styles.codeBlockHeader}>
                      <div className={styles.codeBlockDots}>
                        <div className={styles.dotR} />
                        <div className={styles.dotY} />
                        <div className={styles.dotG} />
                      </div>
                      <span className={styles.codeBlockLang}>
                        Cowork チャット欄（最初の動作確認）
                      </span>
                    </div>
                    <pre>「デスクトップにある .txt ファイルの一覧を教えてください」</pre>
                  </div>
                  Cowork がファイル一覧を返してくれればセットアップ完了です。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 NATURAL LANGUAGE ── */}
        <section className={styles.section} id="natural-language">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>04</span>
            <h2>自然言語による操作 — 基本的な使い方</h2>
          </div>
          <p>
            Cowork の最大の特徴は
            <strong>「話しかけるように指示するだけ」</strong> で複雑な作業を実行できることです。
            コマンドや構文を覚える必要はありません。
          </p>
          <h3>指示の書き方パターン</h3>
          <div className={styles.compare}>
            <div className={`${styles.compareCard} ${styles.compareCardBad}`}>
              <div className={styles.compareLabel}>❌ 曖昧な指示（うまくいかない例）</div>
              <pre style={{ fontSize: "0.8rem", color: "var(--text2)", whiteSpace: "pre-wrap" }}>
                {`"ファイルを整理して"

"レポートを作って"

"データをまとめて"`}
              </pre>
            </div>
            <div className={`${styles.compareCard} ${styles.compareCardGood}`}>
              <div className={styles.compareLabel}>✅ 具体的な指示（うまくいく例）</div>
              <pre style={{ fontSize: "0.8rem", color: "var(--text2)", whiteSpace: "pre-wrap" }}>
                {`"~/Downloads 内の PDF を
~/Documents/PDF_Archive/ に移動して"

"~/Sales の Excel を読んで
今月の売上合計を表にまとめて"

"~/Reports の txt を全部
1つの markdown ファイルに結合して"`}
              </pre>
            </div>
          </div>
          <h3>良い指示の3原則</h3>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📍</div>
              <div className={styles.cardTitle}>場所を具体的に</div>
              <div className={styles.cardDesc}>
                「デスクトップの〇〇フォルダ」「~/Documents/Projects/2025/」など、フルパスに近い表現で指定する。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🎯</div>
              <div className={styles.cardTitle}>出力形式を指定する</div>
              <div className={styles.cardDesc}>
                「PDF で」「markdown で」「Excel
                の新しいシートに」など、返してほしい形式を明記する。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📋</div>
              <div className={styles.cardTitle}>条件・範囲を絞る</div>
              <div className={styles.cardDesc}>
                「今月分だけ」「.docx のみ」「10MB 以上は除く」などの条件を付け加える。
              </div>
            </div>
          </div>
          <h3>よく使う指示パターン集</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>カテゴリ</th>
                  <th>指示の例</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>ファイル整理</strong>
                  </td>
                  <td>
                    <code>~/Downloads の PDF を ~/Archive/年月/ に日付別に整理して</code>
                  </td>
                  <td>ダウンロードフォルダの定期整理</td>
                </tr>
                <tr>
                  <td>
                    <strong>一括変換</strong>
                  </td>
                  <td>
                    <code>~/Docs 内の .docx を全部 PDF に変換して</code>
                  </td>
                  <td>書式統一・共有用変換</td>
                </tr>
                <tr>
                  <td>
                    <strong>要約・抽出</strong>
                  </td>
                  <td>
                    <code>~/Contracts/ の契約書から「契約期間」と「金額」を一覧表にして</code>
                  </td>
                  <td>大量文書からのデータ抽出</td>
                </tr>
                <tr>
                  <td>
                    <strong>レポート生成</strong>
                  </td>
                  <td>
                    <code>~/Logs の csv を読んで先週の KPI サマリーを markdown で作成して</code>
                  </td>
                  <td>週次・月次レポート自動化</td>
                </tr>
                <tr>
                  <td>
                    <strong>重複検出</strong>
                  </td>
                  <td>
                    <code>~/Photos/ の重複ファイルを探してリストアップして（削除はしないで）</code>
                  </td>
                  <td>ストレージ管理</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 05 FILE TASKS ── */}
        <section className={styles.section} id="file-tasks">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>05</span>
            <h2>ファイル・タスク自動化の仕組み</h2>
          </div>
          <p>Cowork がどのように動作するかを理解すると、より効果的に使えます。</p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_1} />
          </div>
          <h3>自動化トリガーの種類</h3>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🖱️</div>
              <div className={styles.cardTitle}>手動実行</div>
              <div className={styles.cardDesc}>
                チャット欄に指示を入力して即座に実行。最もシンプルな使い方。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📂</div>
              <div className={styles.cardTitle}>フォルダ監視</div>
              <div className={styles.cardDesc}>
                「このフォルダにファイルが来たら自動で〇〇する」フォルダウォッチャー機能。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>⏰</div>
              <div className={styles.cardTitle}>スケジュール実行</div>
              <div className={styles.cardDesc}>
                「毎週月曜9時に〇〇する」「毎日終業後にバックアップする」などの定期実行。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>⚡</div>
              <div className={styles.cardTitle}>Skills 起動</div>
              <div className={styles.cardDesc}>
                定義済みの SKILL.md を呼び出して、標準化されたワークフローを実行。
              </div>
            </div>
          </div>
          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <span className={styles.calloutIcon}>⚠️</span>
            <p>
              <strong>重要 — 「確認ファースト」の原則:</strong> Cowork
              は破壊的な操作（ファイルの削除・上書き・大量移動）の前に
              必ず確認ダイアログを表示します。最初のうちは「削除はしないで」「コピーだけして」など
              安全な指示から始めることを強く推奨します。
            </p>
          </div>
        </section>

        {/* ── 06 SKILLS ── */}
        <section className={styles.section} id="skills">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>06</span>
            <h2>Skills との連携 — 繰り返し作業を「定義」する</h2>
          </div>
          <p>
            毎回同じ指示を打ち込むのは非効率です。Cowork は <strong>SKILL.md</strong>{" "}
            を使って繰り返し作業を「再利用可能なスキル」として登録できます。
          </p>
          <div className={styles.skillCmp}>
            <div className={`${styles.skillCmpCol} ${styles.cmpBad}`}>
              <div className={styles.colTitle}>Skills なし（毎回入力）</div>
              <div className={styles.cmpNode}>ユーザー</div>
              <div className={styles.cmpArr}>
                ↓ <span>毎回この長文を入力...</span>
              </div>
              <div className={styles.cmpNode}>Cowork</div>
            </div>
            <div className={styles.skillCmpVs}>VS</div>
            <div className={`${styles.skillCmpCol} ${styles.cmpGood}`}>
              <div className={styles.colTitle}>Skills あり（一言で完了）</div>
              <div className={styles.cmpNode}>ユーザー</div>
              <div className={styles.cmpArr}>
                ↓ <span>/monthly-report</span>
              </div>
              <div className={`${styles.cmpNode} ${styles.cmpNodeAccent}`}>
                SKILL.md<small>月次レポート手順書</small>
              </div>
              <div className={styles.cmpArr}>↓</div>
              <div className={styles.cmpNode}>Cowork</div>
              <div className={styles.cmpArr}>↓</div>
              <div className={`${styles.cmpNode} ${styles.cmpNodeGreen}`}>月次レポート自動生成</div>
            </div>
          </div>
          <h3>Skills でできること</h3>
          <div className={styles.usecase}>
            <div className={styles.usecaseHeader}>
              <div className={styles.usecaseIcon}>📊</div>
              <div className={styles.usecaseTitle}>月次レポートの自動生成</div>
            </div>
            <div className={styles.usecaseBody}>
              毎月末に「~/Sales/*.csv を読んで、前月比・累計・Top5 商品を含む月次レポートを
              ~/Reports/YYYY-MM-report.md に保存する」という手順を1つのスキルとして定義。 来月以降は{" "}
              <code>/monthly-report</code> と入力するだけで完了。
            </div>
          </div>
          <div className={styles.usecase}>
            <div className={styles.usecaseHeader}>
              <div className={styles.usecaseIcon}>📥</div>
              <div className={styles.usecaseTitle}>受信メール添付ファイルの自動仕分け</div>
            </div>
            <div className={styles.usecaseBody}>
              「~/Downloads に保存した請求書 PDF を読んで、取引先名・金額・日付を抽出し、
              ~/Accounting/YYYY/MM/ に取引先名でリネームして保存する」スキルを登録。
              月末の経費精算作業が数秒で完了。
            </div>
          </div>
          <div className={styles.usecase}>
            <div className={styles.usecaseHeader}>
              <div className={styles.usecaseIcon}>🗂️</div>
              <div className={styles.usecaseTitle}>プロジェクトフォルダの定期整理</div>
            </div>
            <div className={styles.usecaseBody}>
              「~/Projects 内の各フォルダで、3ヶ月以上更新のないファイルを ~/Archive/ に移動し、
              移動ログを ~/Projects/cleanup-log.txt に追記する」スキルをスケジュール実行に設定。
            </div>
          </div>
        </section>

        {/* sections s07–s11 will be added in subsequent Green commits */}
      </div>
    </div>
  );
}
