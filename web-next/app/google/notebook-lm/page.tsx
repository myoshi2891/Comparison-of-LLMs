import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Google NotebookLM 完全ベストプラクティスガイド | LLM-Studies",
  description:
    "Google NotebookLM を実務や研究で使いこなすための中〜上級者向け完全ガイド。アーキテクチャの理解からソース設計、カスタムインストラクション、Studio活用、Gemini連携、セキュリティ・Enterprise導入、トラブルシューティングまで網羅。",
};

// ── MERMAID DIAGRAMS ──
const DIAG_1 = `flowchart LR
    subgraph INPUT["ソース投入"]
        A1["PDF・Google Docs<br/>Slides・Sheets"]
        A2["Web URL・YouTube<br/>音声ファイル・EPUB"]
        A3["画像 OCR対応<br/>CSV・コピペテキスト"]
    end
    subgraph CORE["NotebookLMコア RAGエンジン"]
        B1["ソースのインデックス化<br/>ノートブック単位で分離"]
        B2["Geminiモデルによる検索・推論"]
        B3["引用チップ付き回答生成"]
    end
    subgraph OUTPUT["Studio出力"]
        C1["Chat回答"]
        C2["Audio・Video Overview"]
        C3["Slide・Infographic・Report"]
        C4["Quiz・Flashcard・Data Table"]
    end
    A1 --> B1
    A2 --> B1
    A3 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> C1
    B3 --> C2
    B3 --> C3
    B3 --> C4
    classDef input fill:#103433,stroke:#7fe0d3,color:#cdf5ee
    classDef core fill:#2a2150,stroke:#c9b8ff,color:#e3d9ff
    classDef output fill:#3a2018,stroke:#ffab8a,color:#ffdccb
    class A1,A2,A3 input
    class B1,B2,B3 core
    class C1,C2,C3,C4 output
    style INPUT fill:transparent,stroke:#2b313b
    style CORE fill:transparent,stroke:#2b313b
    style OUTPUT fill:transparent,stroke:#2b313b`;

const DIAG_2 = `flowchart TD
    A["2023: Google Labs実験プロダクトとして始動"] --> B["2024: Audio Overview公開<br/>ポッドキャスト風の音声解説が話題に"]
    B --> C["2025: Discover Sources・Deep Research<br/>Data Tables 追加"]
    C --> D["2026年前半: Geminiアプリとの<br/>双方向同期・Cinematic Video Overview"]
    D --> E["2026年6月: Gemini 3.5 + Antigravity<br/>コード実行・エージェント型ソース探索"]
    classDef normal fill:#1c2027,stroke:#3a4150,color:#e8eaed
    classDef highlight fill:#2a2150,stroke:#c9b8ff,color:#e3d9ff
    class A,B,C,D normal
    class E highlight`;

const DIAG_3 = `flowchart TD
    S1["Step 1: 目的を1文で定義する<br/>例: 四半期の競合分析"] --> S2["Step 2: スコープを決める<br/>このノートブックで扱う範囲・扱わない範囲"]
    S2 --> S3["Step 3: グローバル用途か<br/>プロジェクト用途かを判断"]
    S3 --> S4["Step 4: 最初のソースをまとめて投入"]
    S4 --> S5["Step 5: Chatの要約を確認し<br/>スコープの過不足をチェック"]
    S5 --> S6["Step 6: Configure Chatで<br/>ペルソナ・応答スタイルを設定"]
    classDef normal fill:#1c2027,stroke:#3a4150,color:#e8eaed
    classDef start fill:#2a2150,stroke:#c9b8ff,color:#e3d9ff
    classDef goal fill:#103433,stroke:#7fe0d3,color:#cdf5ee
    class S1 start
    class S2,S3,S4,S5 normal
    class S6 goal`;

const DIAG_4 = `sequenceDiagram
    actor User as 利用者
    participant NLM as NotebookLM
    participant Web as Web検索

    User->>NLM: Sourcesパネルで Discover をクリック
    User->>NLM: 学びたいテーマを記述
    NLM->>Web: 関連候補を大規模に収集
    Web-->>NLM: 候補ページ群
    NLM->>NLM: 上位10件に絞り込み・要約を生成
    NLM-->>User: 候補一覧を提示
    User->>NLM: 必要な候補にチェックを入れてインポート
    NLM-->>User: ノートブックにソースとして追加完了`;

const DIAG_5 = `flowchart LR
    A["Chatパネル右上の<br/>設定アイコンをクリック"] --> B{"どちらの粒度で<br/>指示したいか"}
    B -->|ノートブック全体に適用| C["Configure Chat を開く"]
    B -->|今回の質問だけ調整| D["チャット入力欄に直接<br/>一時的な指示を書く"]
    C --> E["Default・Learning Guide・Custom<br/>から会話スタイルを選択"]
    E --> F["Customの場合は<br/>役割・トーン・出力形式を自由記述"]
    F --> G["応答の長さを選択<br/>Default・Longer・Shorter"]
    G --> H["Save"]
    D --> I["その回答1件にのみ反映される"]
    classDef normal fill:#1c2027,stroke:#3a4150,color:#e8eaed
    classDef decision fill:#2a2150,stroke:#c9b8ff,color:#e3d9ff
    classDef goal fill:#103433,stroke:#7fe0d3,color:#cdf5ee
    class A,C,E,F,G,D,I normal
    class B decision
    class H goal`;

const DIAG_6 = `flowchart TD
    Q["何を達成したいか"] --> A{"ソース全体の<br/>構造を把握したい"}
    A -->|Yes| A1["要点抽出プロンプト:<br/>本質的な問いを5つ挙げて"]
    A -->|No| B{"複数ソース間の<br/>矛盾や見解の相違を知りたい"}
    B -->|Yes| B1["対立点抽出プロンプト:<br/>矛盾する記述や対立する立場を洗い出して"]
    B -->|No| C{"抜け漏れ・不足を<br/>把握したい"}
    C -->|Yes| C1["ギャップ分析プロンプト:<br/>業界標準との差分を挙げて<br/>Deep Researchへ渡す"]
    C -->|No| D{"学習・記憶定着<br/>させたい"}
    D -->|Yes| D1["Quiz・Flashcardと組み合わせ<br/>出題形式を限定して指定"]
    D -->|No| E["定型レポート生成<br/>Briefing Doc・Study Guide・FAQ等"]
    classDef q fill:#1c2027,stroke:#3a4150,color:#e8eaed
    classDef decision fill:#2a2150,stroke:#c9b8ff,color:#e3d9ff
    classDef result fill:#103433,stroke:#7fe0d3,color:#cdf5ee
    class Q,E q
    class A,B,C,D decision
    class A1,B1,C1,D1 result`;

const DIAG_7 = `flowchart TD
    S["Studioパネル"] --> O1["Audio Overview<br/>AIポッドキャスト"]
    S --> O2["Video Overview<br/>ナレーション付き解説動画"]
    S --> O3["Mind Map<br/>概念の関係性を可視化"]
    S --> O4["Slide Deck<br/>プレゼン資料"]
    S --> O5["Infographic<br/>1枚のビジュアル要約"]
    S --> O6["Reports<br/>Briefing Doc・Study Guide・FAQ等"]
    S --> O7["Data Table<br/>構造化された比較表"]
    S --> O8["Quiz<br/>理解度確認"]
    S --> O9["Flashcard<br/>暗記・反復学習"]
    classDef root fill:#2a2150,stroke:#c9b8ff,color:#e3d9ff
    classDef leaf fill:#1c2027,stroke:#3a4150,color:#e8eaed
    class S root
    class O1,O2,O3,O4,O5,O6,O7,O8,O9 leaf`;

const DIAG_8 = `flowchart TD
    Q["伝えたい・使いたい状況は"] --> A{"移動中や作業中に<br/>耳で理解したい"}
    A -->|Yes| A1["Audio Overview"]
    A -->|No| B{"視覚的な解説を<br/>座って視聴したい"}
    B -->|Yes| B1["Video Overview<br/>高精度が必要ならCinematic"]
    B -->|No| C{"概念同士の関係を<br/>俯瞰したい"}
    C -->|Yes| C1["Mind Map"]
    C -->|No| D{"人前で発表する<br/>資料が必要"}
    D -->|Yes| D1["Slide Deck"]
    D -->|No| E{"1枚で要点を<br/>視覚的に見せたい"}
    E -->|Yes| E1["Infographic"]
    E -->|No| F{"文章形式の<br/>成果物が欲しい"}
    F -->|Yes| F1["Reports<br/>Briefing Doc・Study Guide・FAQ・Timeline等"]
    F -->|No| G{"数値・項目を<br/>比較表にしたい"}
    G -->|Yes| G1["Data Table<br/>Google Sheetsへ書き出し可"]
    G -->|No| H{"理解度を<br/>確認・定着させたい"}
    H -->|Yes| H1["Quiz または Flashcard"]
    classDef q fill:#1c2027,stroke:#3a4150,color:#e8eaed
    classDef decision fill:#2a2150,stroke:#c9b8ff,color:#e3d9ff
    classDef result fill:#103433,stroke:#7fe0d3,color:#cdf5ee
    class Q q
    class A,B,C,D,E,F,G,H decision
    class A1,B1,C1,D1,E1,F1,G1,H1 result`;

const DIAG_9 = `sequenceDiagram
    actor User as 利用者
    participant Gemini as Geminiアプリ
    participant NLM as NotebookLM

    User->>Gemini: 左サイドパネルで Notebooks を開く
    Gemini-->>User: 既存のノートブック一覧を表示
    User->>Gemini: PDFやURLをNotebook内にアップロード
    Gemini->>NLM: ソースを自動同期
    NLM-->>Gemini: 同一ノートブックとして反映
    User->>NLM: Cinematic Video Overviewを生成
    NLM-->>Gemini: 生成物はStudio上に残る
    User->>Gemini: 翌日 同じNotebookで続きの質問をする
    Gemini-->>User: 保存済みの文脈を踏まえて回答`;

const DIAG_10 = `flowchart TB
    subgraph T1["個人アカウント 無料・Plus・Pro・Ultra"]
        A1["Google利用規約が適用"]
        A2["フィードバック提出時のみ<br/>Googleアカウントと切り離した<br/>人間レビューの対象になりうる"]
        A3["フィードバックデータは<br/>最大3年保持 切り離し済み"]
    end
    subgraph T2["Workspace 組織の業務・教育アカウント"]
        B1["コアサービスとして扱われる<br/>Gmail・Driveと同格"]
        B2["人間レビュー・モデル学習の<br/>対象に一切ならない<br/>フィードバック提出時も含む"]
        B3["管理者がオン・オフ・共有範囲を制御可能"]
    end
    subgraph T3["NotebookLM Enterprise Google Cloud"]
        C1["データはGoogle Cloudプロジェクト内に<br/>常駐し外部共有不可"]
        C2["VPC Service Controls・<br/>CMEK 顧客管理暗号鍵 に対応"]
        C3["米国・EUマルチリージョンで<br/>データ常在地を選択可能"]
    end
    classDef t1 fill:#3a2018,stroke:#ffab8a,color:#ffdccb
    classDef t2 fill:#2a2150,stroke:#c9b8ff,color:#e3d9ff
    classDef t3 fill:#103433,stroke:#7fe0d3,color:#cdf5ee
    class A1,A2,A3 t1
    class B1,B2,B3 t2
    class C1,C2,C3 t3`;

const DIAG_11 = `flowchart TD
    E1["Step 1: Google Cloudプロジェクトを準備"] --> E2["Step 2: Cloud NotebookLM Adminロールを付与"]
    E2 --> E3["Step 3: IDプロバイダーを設定<br/>Google ID または サードパーティIdP"]
    E3 --> E4["Step 4: 必要ならCMEKを事前登録<br/>登録前に作成したノートブックは非対象"]
    E4 --> E5["Step 5: Cloud NotebookLM Userロールと<br/>ライセンスをユーザーに割り当て"]
    E5 --> E6["Step 6: 固有URLをユーザーに配布し利用開始"]
    classDef normal fill:#1c2027,stroke:#3a4150,color:#e8eaed
    classDef start fill:#2a2150,stroke:#c9b8ff,color:#e3d9ff
    classDef goal fill:#103433,stroke:#7fe0d3,color:#cdf5ee
    class E1 start
    class E2,E3,E4,E5 normal
    class E6 goal`;

const DIAG_12 = `flowchart TD
    A["よくある失敗パターン"] --> B["曖昧なプロンプト<br/>要約してだけで終わる"]
    A --> C["無関係な資料を<br/>1つのノートブックに混在"]
    A --> D["検索エンジンのように<br/>単発の質問だけで終える"]
    A --> E["Discover Sourcesの結果を<br/>無検証で採用"]
    A --> F["引用チップを確認せず<br/>そのまま転用"]

    B --> B1["出力が一般論的になり<br/>差別化された洞察が得られない"]
    C --> C1["本来分離すべき情報が<br/>混ざった回答になる"]
    D --> D1["Flashcard・Quiz・構造化出力を<br/>活用できずAIの能力を使い切れない"]
    E --> E1["一次情報としての信頼性を<br/>欠いたまま意思決定に使ってしまう"]
    F --> F1["ハルシネーションや文脈誤りを<br/>見逃したまま公開・提出してしまう"]

    classDef root fill:#3a2018,stroke:#ffab8a,color:#ffdccb
    classDef cause fill:#1c2027,stroke:#3a4150,color:#e8eaed
    classDef effect fill:#2a2150,stroke:#c9b8ff,color:#e3d9ff
    class A root
    class B,C,D,E,F cause
    class B1,C1,D1,E1,F1 effect`;

const DIAG_13 = `timeline
    title NotebookLM 主要アップデート年表
    2023 : Google Labsの実験プロダクトとして始動
    2024 : Audio Overview公開 ポッドキャスト風解説が話題に
    2025-04 : Discover Sources提供開始
    2025-11 : Deep Research・画像・CSV等の対応ソース拡大
         : モバイルアプリにFlashcard・Quiz追加
    2025-12 : Data Tables追加
         : Geminiアプリの一方向ソースとしてNotebookLMが利用可能に
    2026-01 : Chatの会話メモリ6倍・コンテキスト8倍に拡大
         : カスタムペルソナ・ゴール設定が全ユーザーに開放
         : チャット履歴の自動保存に対応
    2026-03 : Cinematic Video Overview追加 Ultra限定
         : Slide revisions・EPUB取込・PPTX書き出しに対応
         : Infographic 10スタイル刷新
    2026-04 : Geminiアプリに双方向同期のNotebooks機能が追加
    2026-05 : Google I/O 2026・Ultraプランの2段階再編 20TB・30TB
    2026-06 : Gemini 3.5 + Antigravityへ刷新
         : ノートブックごとにコード実行環境を付与
         : チャート・XLSX・PPTX等の直接生成に対応`;

interface ExtProps {
  href: string;
  children: React.ReactNode;
}

/**
 * Renders an external anchor link with standard target and security attributes.
 */
function Ext({ href, children }: ExtProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function GoogleNotebookLMPage() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />

      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>NotebookLM ガイド</div>
        <p className={styles.subtle} style={{ paddingLeft: "8px" }}>
          目次 / 中級〜上級者向け
        </p>
        <nav aria-label="ページ内目次">
          <ul>
            <li>
              <a href="#ch1" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-bulb`} aria-hidden="true" />
                <span>1. ソースグラウンディングとは</span>
                <span className={styles.tocBadge}>K1</span>
              </a>
            </li>
            <li>
              <a href="#ch2" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-rocket`} aria-hidden="true" />
                <span>2. 2026年のアーキテクチャ変化</span>
                <span className={styles.tocBadge}>K1</span>
              </a>
            </li>
            <li>
              <a href="#ch3" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-stack-2`} aria-hidden="true" />
                <span>3. プラン比較と上限</span>
                <span className={styles.tocBadge}>K1</span>
              </a>
            </li>
            <li>
              <a href="#ch4" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-books`} aria-hidden="true" />
                <span>4. ノートブック設計</span>
                <span className={styles.tocBadge}>K2</span>
              </a>
            </li>
            <li>
              <a href="#ch5" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-file-search`} aria-hidden="true" />
                <span>5. ソースの追加</span>
                <span className={styles.tocBadge}>K2</span>
              </a>
            </li>
            <li>
              <a href="#ch6" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-settings`} aria-hidden="true" />
                <span>6. Chatの設定</span>
                <span className={styles.tocBadge}>K2</span>
              </a>
            </li>
            <li>
              <a href="#ch7" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-message-2`} aria-hidden="true" />
                <span>7. プロンプト設計</span>
                <span className={styles.tocBadge}>K2</span>
              </a>
            </li>
            <li>
              <a href="#ch8" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-layout-grid`} aria-hidden="true" />
                <span>8. Studio 9つの出力形式</span>
                <span className={styles.tocBadge}>K2</span>
              </a>
            </li>
            <li>
              <a href="#ch9" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-git-merge`} aria-hidden="true" />
                <span>9. Geminiアプリ連携</span>
                <span className={styles.tocBadge}>K3</span>
              </a>
            </li>
            <li>
              <a href="#ch10" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-shield-lock`} aria-hidden="true" />
                <span>10. セキュリティ / ガバナンス</span>
                <span className={styles.tocBadge}>K3</span>
              </a>
            </li>
            <li>
              <a href="#ch11" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-building-skyscraper`} aria-hidden="true" />
                <span>11. Enterprise 導入ガイド</span>
                <span className={styles.tocBadge}>K3</span>
              </a>
            </li>
            <li>
              <a href="#ch12" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-device-mobile`} aria-hidden="true" />
                <span>12. モバイルアプリ</span>
                <span className={styles.tocBadge}>K2</span>
              </a>
            </li>
            <li>
              <a href="#ch13" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-alert-triangle`} aria-hidden="true" />
                <span>13. アンチパターン対処</span>
                <span className={styles.tocBadge}>K2</span>
              </a>
            </li>
            <li>
              <a href="#ch14" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-route`} aria-hidden="true" />
                <span>14. ワークフロー実例</span>
                <span className={styles.tocBadge}>K3</span>
              </a>
            </li>
            <li>
              <a href="#ch15" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-checklist`} aria-hidden="true" />
                <span>15. 20則チェックリスト</span>
                <span className={styles.tocBadge}>K2</span>
              </a>
            </li>
            <li>
              <a href="#ch16" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-timeline`} aria-hidden="true" />
                <span>16. アップデート年表</span>
                <span className={styles.tocBadge}>K1</span>
              </a>
            </li>
            <li>
              <a href="#ch17" className={styles.tocLink}>
                <i className={`${styles.tocIcon} ti ti-link`} aria-hidden="true" />
                <span>17. 参考ソースURL一覧</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.content}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>
            <i className="ti ti-sparkles" aria-hidden="true" /> 中級者〜上級者向け
            ステップバイステップ実践編
          </span>
          <h1 className={styles.pageTitle}>Google NotebookLM 完全ベストプラクティスガイド</h1>
          <p className={styles.subtitle}>
            アーキテクチャの理解からソース設計、Chat設定、Studio全出力形式、Gemini連携、セキュリティ・Enterprise導入、アンチパターン対処まで。ソースグラウンディングという設計思想を軸に、NotebookLMを個人・組織の知識基盤へ育てるための実践知を一冊にまとめました。
          </p>
          <div className={styles.heroMeta}>
            <span className={styles.metaChip}>
              <i className="ti ti-calendar" aria-hidden="true" /> 最終更新: 2026年7月5日時点
            </span>
            <span className={styles.metaChip}>
              <i className="ti ti-bolt" aria-hidden="true" /> 直近の大型更新: 2026年6月8日 Gemini
              3.5 + Antigravity
            </span>
            <span className={styles.metaChip}>
              <i className="ti ti-list-numbers" aria-hidden="true" /> 全17章
            </span>
          </div>
        </header>

        {/* CHAPTER 1 */}
        <section className={styles.chapter} id="ch1">
          <span className={styles.chapterTag}>K1 基礎</span>
          <h2>
            <span className={styles.num}>01</span>NotebookLMとは何か —
            ソースグラウンディングという設計思想
          </h2>

          <h3>
            <i className="ti ti-file-description" aria-hidden="true" /> 定義
          </h3>
          <p>
            NotebookLMは、Googleが提供する
            <strong>ソースグラウンデッド型(source-grounded)のAIリサーチアシスタント</strong>
            です。Gemini系モデルを基盤に、RAG(Retrieval Augmented
            Generation：検索拡張生成)というアーキテクチャを採用しています。ユーザーがアップロードした資料(ソース)だけを根拠として回答を生成し、その根拠には引用(citation
            chip)が自動的に付与されます。
          </p>

          <h3>
            <i className="ti ti-bulb" aria-hidden="true" /> なぜこの設計が重要か
          </h3>
          <p>
            汎用チャットボット(ChatGPTやGemini本体など)は学習データと外部知識を自由に組み合わせて回答しますが、NotebookLMは意図的に「アップロードされたソース以外は使わない」という制約を設けています。この制約こそが最大の価値です。
          </p>
          <ul>
            <li>ハルシネーション(もっともらしい嘘)を大幅に抑制できる</li>
            <li>回答の根拠を引用チップからワンクリックで元資料の該当箇所まで遡って検証できる</li>
            <li>
              ソースに書かれていないことを聞かれた場合は「回答できません」と正直に答える(推測で埋めない)
            </li>
          </ul>

          <h3>
            <i className="ti ti-briefcase" aria-hidden="true" /> 具体例
          </h3>
          <p>
            3社の医療保険会社からそれぞれ異なる形式(PDFのパンフレット、スプレッドシート、長文の規約書)で資料が送られてきた場合、人間が3つの資料を横断して比較するのは骨が折れます。NotebookLMに3つとも読み込ませれば、フォーマットの違いを超えて「保障内容の比較表を作って」と一発で指示できます。
          </p>

          <h3>
            <i className="ti ti-topology-star" aria-hidden="true" /> 全体アーキテクチャ図
          </h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAG_1} />
            <div className={styles.diagramCaption}>
              図1: ソース投入 → RAGコア → Studio出力までの全体アーキテクチャ
            </div>
          </div>

          <h3>
            <i className="ti ti-arrows-left-right" aria-hidden="true" />{" "}
            従来の検索・要約ツールとの違い
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>汎用チャットAI(Gemini/ChatGPT本体)</th>
                  <th>NotebookLM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>知識の範囲</td>
                  <td>学習データ+Web検索+対話履歴</td>
                  <td>アップロードしたソースのみ(Deep Research/Web検索使用時は例外)</td>
                </tr>
                <tr>
                  <td>引用</td>
                  <td>一部機能でのみ対応</td>
                  <td>常に引用チップが付与される</td>
                </tr>
                <tr>
                  <td>未知の質問への応答</td>
                  <td>それらしい推測で回答してしまうことがある</td>
                  <td>「ソースにない」と明示して回答を拒否する設計</td>
                </tr>
                <tr>
                  <td>得意分野</td>
                  <td>汎用対話・創作・コーディング</td>
                  <td>大量ドキュメントの横断分析・要約・教材化</td>
                </tr>
                <tr>
                  <td>コンテキストの永続性</td>
                  <td>セッション/プロジェクト単位</td>
                  <td>ノートブック単位(ノートブック間は独立)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.subtle}>
            参照: 公式ヘルプセンター、プライバシー・利用規約(第17章の参考ソースURL一覧を参照)
          </p>
        </section>

        {/* CHAPTER 2 */}
        <section className={styles.chapter} id="ch2">
          <span className={styles.chapterTag}>K1 基礎</span>
          <h2>
            <span className={styles.num}>02</span>2026年のアーキテクチャ変化 —
            エージェント化への転換
          </h2>

          <h3>
            <i className="ti ti-bolt" aria-hidden="true" /> 2026年6月8日の大型アップデート(Gemini
            3.5 + Antigravity)
          </h3>
          <p>
            Google公式ブログ「Do your best research with
            NotebookLM」(2026年6月8日付)によると、NotebookLMは以下の点で根本的に強化されました。
          </p>
          <ul>
            <li>
              基盤モデルを<strong>Gemini 3.5 + Antigravity</strong>
              に刷新し、推論の正確性・透明性が向上
            </li>
            <li>
              各ノートブックに<strong>セキュアなクラウド実行環境(cloud computer)</strong>
              が付与され、コードを書いて実行できるようになった(データ分析・集計処理などLLMが苦手な決定論的処理を代行)
            </li>
            <li>
              <strong>100種類以上のキュレーション済みスキル</strong>
              が組み込まれ、ソース理解の幅が拡大
            </li>
            <li>出力フォーマットが大幅に拡張(下記表を参照)</li>
            <li>
              「まだソースを持っていない、漠然としたアイデアの段階」からでもプロジェクトを開始できるようになり、エージェントがGoogle検索を使って関連ソースを探索・提案する
            </li>
          </ul>
          <p>
            Google社内の評価では、旧システムに対して<strong>平均勝率65%超</strong>
            (AI対決による評価結果。拮抗ラインより約15ポイント優位)、特に大規模文書分析で
            <strong>69.9%</strong>、Web調査・ソース発見で<strong>78.2%</strong>
            の勝率を記録したと報告されています。
          </p>

          <h3>
            <i className="ti ti-file-export" aria-hidden="true" />{" "}
            新しい出力フォーマット(2026年6月〜)
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>フォーマット種別</th>
                  <th>具体例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>データ可視化・チャート</td>
                  <td>PNG, SVG</td>
                </tr>
                <tr>
                  <td>ドキュメント</td>
                  <td>PDF, DOCX, Markdown, テキストファイル</td>
                </tr>
                <tr>
                  <td>画像生成</td>
                  <td>Nano Bananaモデルによる PNG, JPG, GIF</td>
                </tr>
                <tr>
                  <td>構造化データ</td>
                  <td>CSV, JSON</td>
                </tr>
                <tr>
                  <td>Microsoft Excel</td>
                  <td>XLSX</td>
                </tr>
                <tr>
                  <td>Microsoft PowerPoint</td>
                  <td>PPTX</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            これらは生成後に<strong>編集も可能</strong>
            になっており、以前の「生成後は修正不可」という制約が大きく緩和されました。
          </p>

          <h3>
            <i className="ti ti-timeline" aria-hidden="true" /> なぜこの変化が重要か
          </h3>
          <p>
            NotebookLMは当初「受け身の要約ツール(Passive
            Assistant)」でしたが、コード実行環境とWeb検索によるソース探索能力を得たことで「能動的なリサーチエージェント(Active
            Agent)」へと役割が変化しています。この変化を理解しておくと、後述のプロンプト設計(第7章)やユースケース設計(第14章)の判断がしやすくなります。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAG_2} />
            <div className={styles.diagramCaption}>
              図2: Passive AssistantからActive Agentへの進化の道筋
            </div>
          </div>

          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className="ti ti-alert-triangle" aria-hidden="true" />
            <div>
              <strong>注意</strong>エージェント機能(コード実行・自律的なソース探索)は現時点で
              <strong>Google AI Ultra</strong>ユーザーおよび一部のWorkspaceビジネスアカウント(AI
              Ultra Access / AI Expanded Access
              契約)から順次展開されています。無料版・Plus版では利用できない場合があります。最新の提供状況は必ず公式ヘルプページで確認してください。
            </div>
          </div>
        </section>

        {/* CHAPTER 3 */}
        <section className={styles.chapter} id="ch3">
          <span className={styles.chapterTag}>K1 基礎</span>
          <h2>
            <span className={styles.num}>03</span>プラン比較とシステム上限
          </h2>

          <h3>
            <i className="ti ti-info-circle" aria-hidden="true" /> 公式に確認できる基礎情報
          </h3>
          <p>Google公式ヘルプセンターによると、無料(Standard)プランの基本仕様は以下の通りです。</p>
          <ul>
            <li>ノートブック数: 最大100個</li>
            <li>ノートブックあたりのソース数: 最大50個</li>
            <li>
              ソース1件あたりの上限: 500,000語 または
              200MB(ファイルアップロード時)のいずれか早い方。ページ数の上限はなし
            </li>
            <li>1日あたりのチャットクエリ: 50件</li>
            <li>1日あたりのAudio Overview生成: 3件</li>
          </ul>
          <p>コピー保護されたPDFはアップロードできません。</p>

          <h3>
            <i className="ti ti-credit-card" aria-hidden="true" />{" "}
            有料プランの目安(2026年6月時点・複数の第三者集計に基づく)
          </h3>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-info-circle" aria-hidden="true" />
            <div>
              <strong>重要な注意</strong>NotebookLM単体を購入することはできません。Google
              AIプラン(Plus/Pro/Ultra)または対応するGoogle Workspace/Google
              Cloudプランの一部として提供されます。以下の数値は本ガイド執筆時点の集計値であり、Google側の仕様変更が頻繁にあるため、契約前に必ず公式アップグレードページで最新の数値を確認してください。
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>プラン</th>
                  <th>目安の月額</th>
                  <th>ノートブック数</th>
                  <th>ソース/ノートブック</th>
                  <th>1日のチャット</th>
                  <th>備考</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Free (Standard)</td>
                  <td>$0</td>
                  <td>100</td>
                  <td>50</td>
                  <td>50</td>
                  <td>Audio Overview 1日3件</td>
                </tr>
                <tr>
                  <td>Plus</td>
                  <td>約$7.99(Google AI Plus経由)</td>
                  <td>200</td>
                  <td>100</td>
                  <td>200</td>
                  <td>Freeのほぼ倍の容量</td>
                </tr>
                <tr>
                  <td>Pro</td>
                  <td>約$19.99(Google AI Pro経由)</td>
                  <td>500</td>
                  <td>300</td>
                  <td>500</td>
                  <td>Deep Research 1日20件、個人の重研究用途に最適</td>
                </tr>
                <tr>
                  <td>Ultra(20TBプラン)</td>
                  <td>約$99.99(Google AI Ultra経由)</td>
                  <td>500</td>
                  <td>500</td>
                  <td>2,500</td>
                  <td>Cinematic Video Overview対応</td>
                </tr>
                <tr>
                  <td>Ultra(30TBプラン)</td>
                  <td>約$200(Google AI Ultra経由)</td>
                  <td>500</td>
                  <td>600</td>
                  <td>5,000</td>
                  <td>最上位。透かし除去・最上位のDeep Research件数</td>
                </tr>
                <tr>
                  <td>Workspace(Business等)</td>
                  <td>Workspaceプランに含まれる</td>
                  <td>契約により変動</td>
                  <td>Plus相当が目安</td>
                  <td>契約により変動</td>
                  <td>組織のコアサービスとして人間レビュー・学習利用の対象外</td>
                </tr>
                <tr>
                  <td>Enterprise(Google Cloud)</td>
                  <td>個別見積り</td>
                  <td>プロジェクト単位</td>
                  <td>契約により変動</td>
                  <td>契約により変動</td>
                  <td>VPC-SC・CMEK・データレジデンシー対応</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.subtle}>
            全プラン共通の制約: ソース1件あたり500,000語 /
            200MBの上限は、Ultraであっても変わりません。上位プランが上げるのは「ソースの数」であり「1つのソースの大きさ」ではない点に注意してください。
          </p>

          <h3>
            <i className="ti ti-tool" aria-hidden="true" /> 上限に達したときの実務対応
          </h3>
          <ul>
            <li>
              <strong>大きすぎるファイル</strong>:
              500,000語を超えるPDFは分割してからアップロードする
            </li>
            <li>
              <strong>ソース数が足りない</strong>:
              関連性の低いソースを整理・削除するか、プランをアップグレードする
            </li>
            <li>
              <strong>コピー保護PDF</strong>:
              印刷可能なPDFに変換し直す、またはテキストをコピー&ペーストしてソース化する
            </li>
            <li>
              <strong>チャット回数が足りない</strong>:
              1つの質問に複数の意図を詰め込み、リクエスト回数自体を減らす
            </li>
          </ul>
        </section>

        {/* CHAPTER 4 */}
        <section className={styles.chapter} id="ch4">
          <span className={styles.chapterTag}>K2 応用</span>
          <h2>
            <span className={styles.num}>04</span>ステップ1: ノートブック設計 — スコープを絞る
          </h2>

          <h3>
            <i className="ti ti-file-description" aria-hidden="true" /> 定義
          </h3>
          <p>
            ノートブックとは、特定のプロジェクト・トピックのためのソース集合体です。
            <strong>
              ノートブック同士は完全に独立しており、NotebookLMは複数ノートブックを横断して同時に参照することはできません
            </strong>
            (第9章で解説するGemini連携を使わない限り)。
          </p>

          <h3>
            <i className="ti ti-bulb" aria-hidden="true" /> なぜスコープ設計が重要か
          </h3>
          <p>
            無関係な資料(例:
            契約書Aと契約書B)を1つのノートブックに混在させると、Chatが横断的に統合しようとした結果、本来分離すべき情報が混ざった回答になりやすいという指摘が複数の実践者コミュニティで共有されています。ノートブックは「1トピック・1プロジェクト・1文書群」の単位で作るのが基本です。
          </p>

          <h3>
            <i className="ti ti-list-numbers" aria-hidden="true" /> ステップバイステップ
          </h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAG_3} />
            <div className={styles.diagramCaption}>
              図3: ノートブック設計の6ステップ(第6章のConfigure Chatへつながる)
            </div>
          </div>

          <h3>
            <i className="ti ti-scale" aria-hidden="true" /> 良い例・悪い例
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>悪い例</th>
                  <th>良い例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>スコープ</td>
                  <td className={styles.bad}>「仕事の資料全部」ノートブックに何でも放り込む</td>
                  <td className={styles.ok}>
                    「2026 Q3競合分析」のように単一プロジェクト単位で作成
                  </td>
                </tr>
                <tr>
                  <td>混在</td>
                  <td className={styles.bad}>
                    契約書Aと契約書Bを同一ノートブックに入れて比較させる
                  </td>
                  <td className={styles.ok}>
                    契約書ごとにノートブックを分け、比較が必要ならGemini連携(第9章)でノートブックをまたいで質問する
                  </td>
                </tr>
                <tr>
                  <td>命名</td>
                  <td className={styles.bad}>「無題のノートブック」のまま放置</td>
                  <td className={styles.ok}>目的が一目で分かる名前と絵文字(自動付与)を活用</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CHAPTER 5 */}
        <section className={styles.chapter} id="ch5">
          <span className={styles.chapterTag}>K2 応用</span>
          <h2>
            <span className={styles.num}>05</span>ステップ2: ソースの追加 — Discover SourcesとDeep
            Research
          </h2>

          <h3>
            <i className="ti ti-files" aria-hidden="true" /> 対応ソース形式
          </h3>
          <p>公式ヘルプによると、以下の形式がソースとして利用できます。</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>カテゴリ</th>
                  <th>対応形式</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>文書</td>
                  <td>
                    Google Docs, Microsoft Word (docx), PDF, テキスト(txt), Markdown(md), EPUB
                  </td>
                </tr>
                <tr>
                  <td>表計算・データ</td>
                  <td>Google Sheets, CSV</td>
                </tr>
                <tr>
                  <td>プレゼン</td>
                  <td>Google Slides, PowerPoint (pptx)</td>
                </tr>
                <tr>
                  <td>Web</td>
                  <td>公開Webページ URL, 公開YouTube動画URL</td>
                </tr>
                <tr>
                  <td>メディア</td>
                  <td>音声ファイル(MP3, WAVなど), 画像(OCR対応、精度に限界あり)</td>
                </tr>
                <tr>
                  <td>その他</td>
                  <td>コピー&ペーストしたテキスト, Geminiでのチャット履歴</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-bulb" aria-hidden="true" />
            <div>
              <strong>Tips: Google Drive由来のソース</strong>Google Docs / Slides /
              Sheetsをソースとして追加した場合、これらは「生きた文書」として扱われ、元ファイルが更新されると通知が出て手動で再同期できます。一方でPDFなど直接アップロードしたファイルは、アップロード時点の静的なコピーとして扱われ、自動では更新されません。
            </div>
          </div>

          <h3>
            <i className="ti ti-search" aria-hidden="true" /> 手動追加だけでなく「発見」する —
            Discover Sources
          </h3>
          <p>
            自分でリンクを集める代わりに、<strong>Discover Sources</strong>
            機能を使うとテーマを記述するだけでWeb上から関連性の高いソース候補を最大10件、要約付きで提示してくれます。「気になるままに(I'm
            feeling curious)」ボタンでランダムなトピックの探索も可能です。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAG_4} />
            <div className={styles.diagramCaption}>図4: Discover Sourcesによるソース発見フロー</div>
          </div>

          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className="ti ti-alert-triangle" aria-hidden="true" />
            <div>
              <strong>注意点</strong>Discover
              Sourcesが提示する候補は「Googleが内部評価した上での推薦」であり、専門家によるファクトチェックを保証するものではありません。特に教育現場や意思決定に関わる用途では、提示された各ソースの一次情報としての信頼性を人間が確認する工程を省略しないでください。
            </div>
          </div>

          <h3>
            <i className="ti ti-telescope" aria-hidden="true" /> より本格的な調査 — Deep Research
          </h3>
          <p>
            Deep
            Researchは、ユーザーに代わって数百のWebサイトを自律的に巡回し、内容を吟味した上で複数ページに及ぶ調査レポートを生成するエージェント型機能です。生成されたレポートと、引用元・非引用元を含む関連ソース一覧をまとめてノートブックにインポートできます。
          </p>

          <div className={styles.stepGrid}>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>STEP 1</span>
              <h4>調査したい問いを入力</h4>
              <p>
                Sourcesパネルの検索ボックスに「競合製品Aと自社製品の機能比較」のような問いを入力する
              </p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>STEP 2</span>
              <h4>数分間の処理を待つ</h4>
              <p>他の作業と並行可能。数百のWebサイトを自律的に巡回・吟味する</p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>STEP 3</span>
              <h4>レポートをレビュー</h4>
              <p>
                生成されたレポートと関連ソースをレビューし、必要なものだけ選択してインポートする
              </p>
            </div>
          </div>

          <h3>
            <i className="ti ti-arrows-left-right" aria-hidden="true" /> Discover Sources / Deep
            Research 使い分け
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>Discover Sources</th>
                  <th>Deep Research</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>用途</td>
                  <td>新しいトピックの概要をすばやく把握したい</td>
                  <td>込み入った調査課題に対して体系的なレポートが欲しい</td>
                </tr>
                <tr>
                  <td>出力</td>
                  <td>候補ソースのリスト(最大10件)</td>
                  <td>引用付きの多ページレポート+ソース一覧</td>
                </tr>
                <tr>
                  <td>所要時間</td>
                  <td>数秒〜数十秒</td>
                  <td>数分程度</td>
                </tr>
                <tr>
                  <td>向いている場面</td>
                  <td>ノートブック作成の初動、授業の導入</td>
                  <td>競合分析、文献レビュー、意思決定資料の下地作り</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CHAPTER 6 */}
        <section className={styles.chapter} id="ch6">
          <span className={styles.chapterTag}>K2 応用</span>
          <h2>
            <span className={styles.num}>06</span>ステップ3: Chatの設定 — Configure
            Chatとカスタムインストラクション
          </h2>

          <h3>
            <i className="ti ti-file-description" aria-hidden="true" /> 定義
          </h3>
          <p>
            Chatパネル上部の設定アイコンから開く<strong>Configure Chat</strong>
            は、そのノートブック全体(Chatおよび派生するStudio出力すべて)に適用される「人格・応答スタイルの設定」です。
          </p>

          <h3>
            <i className="ti ti-adjustments" aria-hidden="true" /> 提供されている会話スタイル
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>スタイル</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Default</td>
                  <td>一般的なリサーチ・ブレインストーミング向けの標準応答</td>
                </tr>
                <tr>
                  <td>Learning Guide</td>
                  <td>
                    教育コンテンツ向け。単に答えを返すのではなく、段階的に理解を促す「家庭教師モード」的な振る舞いになる
                  </td>
                </tr>
                <tr>
                  <td>Custom</td>
                  <td>
                    自由記述でペルソナや役割を指定できる(例:「博士課程の学生のように振る舞って」「特定のロールプレイゲームの進行役を演じて」)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.subtle}>
            Customモードには、複数の実践者コミュニティ情報によると2026年3月更新以降
            <strong>最大10,000文字</strong>
            のカスタムインストラクションを設定できるようになったと報告されています(正確な文字数上限は変更される可能性があるため、実際の入力欄で確認してください)。応答の長さも
            Default / Longer(詳細) / Shorter(簡潔) の3段階で選べます。
          </p>

          <h3>
            <i className="ti ti-star" aria-hidden="true" /> なぜこれが最重要設定なのか
          </h3>
          <p>
            多くのユーザーが「毎回のプロンプトに前提条件を書き直す」という非効率な使い方をしています。Configure
            Chatでペルソナ・トーン・出力フォーマットの前提を
            <strong>ノートブック単位で一度だけ設定</strong>
            しておけば、以降のすべての質問・Studio出力にその前提が適用されます。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAG_5} />
            <div className={styles.diagramCaption}>
              図5: Configure Chatとその場限りの指示の使い分け
            </div>
          </div>

          <h3>
            <i className="ti ti-briefcase" aria-hidden="true" /> 実践例
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>シーン</th>
                  <th>Configure Chatでの設定例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>経営会議の準備</td>
                  <td>
                    Custom:「シニアアナリストとして振る舞い、結論を先に述べ、根拠は箇来書きで簡潔に」+応答長Shorter
                  </td>
                </tr>
                <tr>
                  <td>資格試験の勉強</td>
                  <td>Learning Guide+応答長Default(AIが問いかけながら理解を促す)</td>
                </tr>
                <tr>
                  <td>創作のブレスト</td>
                  <td>
                    Custom:「経験豊富な編集者として、批判的だが建設的なフィードバックを返して」
                  </td>
                </tr>
                <tr>
                  <td>社内FAQボット</td>
                  <td>Custom:「新入社員向けに専門用語を避け、優しい言葉で説明して」</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            <i className="ti ti-history" aria-hidden="true" /> チャット履歴の扱い
          </h3>
          <p>
            2026年1月・3月のアップデートにより、チャット履歴は自動的に保存されるようになり、セッションを閉じても後で再開できます。共有ノートブックであっても、チャット履歴は各利用者ごとに非公開です。履歴はいつでも削除できます。
          </p>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-bulb" aria-hidden="true" />
            <div>
              <strong>Tips</strong>
              トピックを大きく切り替える前に履歴を削除すると、過去の文脈に引きずられない新しい回答が得られやすくなります。ただし削除前に残しておきたい内容がないか一度確認しましょう。
            </div>
          </div>
        </section>

        {/* CHAPTER 7 */}
        <section className={styles.chapter} id="ch7">
          <span className={styles.chapterTag}>K2 応用</span>
          <h2>
            <span className={styles.num}>07</span>ステップ4: プロンプト設計のベストプラクティス
          </h2>

          <h3>
            <i className="ti ti-message-2" aria-hidden="true" />{" "}
            NotebookLM向けプロンプトが汎用チャットAIと異なる理由
          </h3>
          <p>
            NotebookLMはソース以外の知識を使わないよう設計されています。そのため、プロンプトには「ソースだけを根拠にせよ」「引用元を明示せよ」「不明な場合はその旨を述べよ」という制約を明示的に書き込むことで、回答の信頼性がさらに高まります。
          </p>

          <h3>
            <i className="ti ti-git-branch" aria-hidden="true" /> 判断フロー —
            目的別プロンプトパターン
          </h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAG_6} />
            <div className={styles.diagramCaption}>図6: 目的別プロンプト選択の判断フロー</div>
          </div>

          <h3>
            <i className="ti ti-checklist" aria-hidden="true" /> プロンプト設計チェックリスト
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>チェック項目</th>
                  <th>悪い例</th>
                  <th>良い例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>根拠の制約</td>
                  <td className={styles.bad}>「〇〇について教えて」</td>
                  <td className={styles.ok}>
                    「アップロードしたソースのみを根拠に、〇〇について説明して。ソースに記載がない場合はその旨を明記して」
                  </td>
                </tr>
                <tr>
                  <td>出力の粒度</td>
                  <td className={styles.bad}>特に指定しない</td>
                  <td className={styles.ok}>「200〜300語で」「6問構成で」など長さ・構成を明示</td>
                </tr>
                <tr>
                  <td>複数ソースの指名</td>
                  <td className={styles.bad}>ソースが多いのに全体に問いかける</td>
                  <td className={styles.ok}>関連するソース名を質問文中で明示し、検索範囲を絞る</td>
                </tr>
                <tr>
                  <td>検証可能性</td>
                  <td className={styles.bad}>事実確認せずそのまま信用する</td>
                  <td className={styles.ok}>
                    「該当箇所を引用して」と指示し、引用チップから元資料を確認する
                  </td>
                </tr>
                <tr>
                  <td>反復作業</td>
                  <td className={styles.bad}>毎回ゼロから同じ前提を書く</td>
                  <td className={styles.ok}>
                    Configure Chat(第6章)にペルソナ・制約を一度だけ設定する
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            <i className="ti ti-template" aria-hidden="true" /> 代表的なテンプレートプロンプト集
          </h3>
          <p className={styles.subtle}>
            以下は複数の実践記事で有効性が報告されているパターンを要旨として再構成したものです。角括弧は自分の状況に置き換えてください。
          </p>

          <h4>1. 要点抽出(新しいノートブック作成直後に)</h4>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-quote" aria-hidden="true" />
            <div>
              すべてのソースを分析し、この内容を本質的に理解するために答えられるべき重要な問いを5つ提示してください。各問いは核となる定義・重要概念・概念間の関係性・実務での応用のいずれかをカバーするようにしてください。
            </div>
          </div>

          <h4>2. 矛盾・対立点の抽出(プレゼン前のリスク潰しに)</h4>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-quote" aria-hidden="true" />
            <div>
              アップロードされたすべての文書を横断的に確認し、記載内容が一致していない箇所や、立場が対立している論点を洗い出してください。それぞれの主張について、どのソースがそう述べているかを明示してください。
            </div>
          </div>

          <h4>3. ギャップ分析(市場調査・企画立案に)</h4>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-quote" aria-hidden="true" />
            <div>
              現在のソース群で「既にカバーされている内容」ではなく「欠けている観点」に注目してください。特定のトピックに関する業界標準や最新動向に照らして、抜け落ちている論点を指摘し、それを埋めるために調べるべき追加の問いを5つ提案してください。
            </div>
          </div>

          <h4>4. タイムライン生成(経緯の整理に)</h4>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-quote" aria-hidden="true" />
            <div>
              ソースのみを根拠に、時系列順の出来事一覧を作成してください。各出来事には日付・簡潔な説明・出典を付け、日付不明のものは別枠にまとめてください。矛盾する日付や、出来事間の因果関係があれば併せて指摘してください。
            </div>
          </div>

          <h4>5. 出題スタイル模倣(試験対策に)</h4>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-quote" aria-hidden="true" />
            <div>
              過去問をソースとして読み込んだ上で、出題者の問題形式・頻出パターンを踏襲した模擬試験を作成してください。正解は最後にまとめ、各設問にはソースの該当箇所を引用してください。
            </div>
          </div>
        </section>

        {/* CHAPTER 8 */}
        <section className={styles.chapter} id="ch8">
          <span className={styles.chapterTag}>K2 応用</span>
          <h2>
            <span className={styles.num}>08</span>ステップ5: Studioパネル完全攻略 — 9つの出力形式
          </h2>

          <h3>
            <i className="ti ti-layout-grid" aria-hidden="true" /> 全体像
          </h3>
          <p>
            2026年前半時点で、Studioパネルは大きく分けて以下の9系統の出力に対応しています(6月のエージェント化アップデートにより、これに加えてチャットから直接チャート・XLSX・PPTX等を生成する経路も追加されました)。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAG_7} />
            <div className={styles.diagramCaption}>図7: Studioパネルの9系統の出力形式</div>
          </div>

          <h3>
            <i className="ti ti-git-branch" aria-hidden="true" />{" "}
            どの出力形式を選ぶべきか(判断フロー)
          </h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAG_8} />
            <div className={styles.diagramCaption}>図8: 出力形式選択の判断フロー</div>
          </div>

          <h3>
            <i className="ti ti-microphone-2" aria-hidden="true" /> Audio Overview(AIポッドキャスト)
          </h3>
          <p>2人のAIホストが資料について対話形式で解説する、NotebookLMの代名詞的機能です。</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>カスタマイズ項目</th>
                  <th>選択肢</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>フォーマット</td>
                  <td>
                    Deep Dive(深掘り対話)/ Brief(短時間要約)/ Critique(批評)/ Debate(討論)/
                    Lecture(講義形式)
                  </td>
                </tr>
                <tr>
                  <td>言語</td>
                  <td>80以上の言語に対応(音声出力の対応言語は順次拡大中)</td>
                </tr>
                <tr>
                  <td>フォーカス指定</td>
                  <td>
                    「今回のエピソードでAIホストに何を重点的に扱ってほしいか」を自由記述で指定可能
                  </td>
                </tr>
                <tr>
                  <td>対話モード</td>
                  <td>
                    Interactive Mode —
                    再生中にAIホストへ割り込み、リアルタイムで質問・誘導できる(英語のみ、ベータ)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-bulb" aria-hidden="true" />
            <div>
              <strong>Tips</strong>
              生成には数分〜十数分かかることがあり、Studio内の出力の中でも最も時間がかかる部類です。他の作業と並行して待つのが実務的です。
            </div>
          </div>

          <h3>
            <i className="ti ti-video" aria-hidden="true" /> Video
            Overview(ナレーション付き解説動画)
          </h3>
          <p>Audio Overviewに視覚要素(図表・引用・数値のハイライト等)を加えたものです。</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>カスタマイズ項目</th>
                  <th>選択肢</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>フォーマット</td>
                  <td>Explainer(説明重視)/ Brief(短時間)</td>
                </tr>
                <tr>
                  <td>ビジュアルスタイル</td>
                  <td>Whiteboard / Kawaii / Watercolor / Classic など</td>
                </tr>
                <tr>
                  <td>フォーカス指定</td>
                  <td>「AIホストに何を重視して解説してほしいか」を自由記述</td>
                </tr>
                <tr>
                  <td>Cinematic Video Overview</td>
                  <td>
                    2026年3月導入。Gemini 3 + Veo
                    3を用いた、流麗なアニメーションとドキュメンタリー品質の映像。
                    <strong>Ultraプラン限定</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            <i className="ti ti-sitemap" aria-hidden="true" /> Mind Map(マインドマップ)
          </h3>
          <p>
            ソースから高レベルの情報を抽出し、概念同士の関係性を視覚的な図として提示します。特定のプロンプトによる生成内容の誘導はできず、どのソースを含めるかの選択のみがコントロール可能です。ノード(節点)をクリックするとサブトピックを展開できます。
          </p>

          <h3>
            <i className="ti ti-presentation" aria-hidden="true" /> Slide Deck(プレゼン資料)
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>フォーマット</td>
                  <td>
                    Detailed(読み物として自己完結する詳細版)/
                    Presenter(発表の補助となる要点のみの簡潔版)
                  </td>
                </tr>
                <tr>
                  <td>エクスポート</td>
                  <td>PDFに加え、編集可能なPPTX形式でのエクスポートに対応</td>
                </tr>
                <tr>
                  <td>部分修正</td>
                  <td>
                    生成後、スライド単位でスタイルや事実関係のフィードバックを入力すると、その部分だけを再生成する「Slide
                    revisions」機能に対応(デスクトップ・モバイル両対応)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            <i className="ti ti-photo" aria-hidden="true" /> Infographic(インフォグラフィック)
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>スタイル例</td>
                  <td>
                    Sketch Note, Kawaii, Professional, Scientific, Anime, Clay, Editorial,
                    Instructional, Bento Grid, Bricks(計10種類)
                  </td>
                </tr>
                <tr>
                  <td>向き</td>
                  <td>Landscape / Portrait / Square</td>
                </tr>
                <tr>
                  <td>カスタムプロンプト</td>
                  <td>
                    「青系のコーポレートカラーを使い、3つの主要な数値を強調して」のように色・強調点を指定可能
                  </td>
                </tr>
                <tr>
                  <td>制約</td>
                  <td>
                    生成後の直接編集は原則不可(静止画として書き出されるため、修正が必要な場合は再生成が基本)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            <i className="ti ti-report" aria-hidden="true" /> Reports(各種レポート)
          </h3>
          <p>
            「Briefing Doc(要点整理の概要資料)」「Study
            Guide(学習ガイド)」「FAQ」「Timeline(年表)」「ブログ記事風の文章」など、目的別の定型文書を生成できます。第7章のテンプレートプロンプトと組み合わせることで、対象読者・粒度を細かく指定した成果物になります。
          </p>

          <h3>
            <i className="ti ti-table" aria-hidden="true" /> Data Table(データテーブル)
          </h3>
          <p>
            複数ソースを横断した比較表を構造化データとして生成し、Google
            Sheetsへそのままエクスポートして加工できます。価格比較・機能比較・仕様比較のような定量的な整理に向いています。ソースに厳密に根拠づけられるため、他の生成AIが作る表よりも数値の信頼度が高いという実践者の評価があります。
          </p>

          <h3>
            <i className="ti ti-cards" aria-hidden="true" /> Quiz / Flashcard(学習支援ツール)
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>機能</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Quiz</td>
                  <td>
                    ソースに基づく多肢選択式の設問を自動生成。能動的想起(active
                    recall)による定着を狙う
                  </td>
                </tr>
                <tr>
                  <td>Flashcard</td>
                  <td>
                    進捗はセッションをまたいで保存される。「わかった・わからなかった」でマークし、わからなかったものだけ再出題・シャッフル可能
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className="ti ti-alert-triangle" aria-hidden="true" />
            <div>
              <strong>注意</strong>
              Quizはデフォルトでは独自のスタイルで出題されるため、特定の試験対策では「過去問の出題形式を踏襲して」という指示(第7章テンプレート⑤)を組み合わせることを推奨します。
            </div>
          </div>

          <h3>
            <i className="ti ti-robot" aria-hidden="true" /> 2026年6月以降の新出力(エージェント型)
          </h3>
          <p>
            チャットから直接、Audio/Video
            Overview・レポート・チャート・スプレッドシート・PDFなどの成果物(アーティファクト)を生成できるようになりました。Studioパネルに移動しなくても「これをスライドにして」「この数値からグラフを作って」とチャット内で依頼するだけで完結します。
          </p>
        </section>

        {/* CHAPTER 9 */}
        <section className={styles.chapter} id="ch9">
          <span className={styles.chapterTag}>K3 発展</span>
          <h2>
            <span className={styles.num}>09</span>ステップ6: Gemini アプリとの双方向連携
          </h2>

          <h3>
            <i className="ti ti-refresh" aria-hidden="true" /> 何が変わったか
          </h3>
          <p>
            2026年4月8日、Googleは Gemini アプリに<strong>Notebooks</strong>
            機能を追加し、NotebookLMのノートブックと<strong>双方向に自動同期</strong>
            するようにしました。これにより「ノートブックはNotebookLM、対話はGemini」という使い分けが可能になり、従来の「1ノートブックは孤立している」という制約の一部が解消されます。
          </p>

          <h3>
            <i className="ti ti-arrows-exchange" aria-hidden="true" /> 同期の仕組み
          </h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAG_9} />
            <div className={styles.diagramCaption}>
              図9: Gemini アプリとNotebookLMの双方向同期フロー
            </div>
          </div>

          <h3>
            <i className="ti ti-thumb-up" aria-hidden="true" /> このワークフローで得られる利点
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>課題(従来のNotebookLM単体)</th>
                  <th>Gemini連携による解決</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ノートブックをまたいだ質問ができない</td>
                  <td>複数のノートブックを1つのGemini会話に添付し、横断的に質問できる</td>
                </tr>
                <tr>
                  <td>リアルタイムのWeb情報が使えない</td>
                  <td>Geminiの通常のWeb検索機能と組み合わせて回答を補強できる</td>
                </tr>
                <tr>
                  <td>会話がGemini側でのみ完結し、資料に定着しない</td>
                  <td>Geminiでの会話をノートブックのソースとして取り込める</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            <i className="ti ti-alert-circle" aria-hidden="true" /> 利用上の注意点
          </h3>
          <ul>
            <li>
              本機能は現在、<strong>Google AI Ultra / Pro / Plus</strong>
              のWeb版利用者から順次展開されています。モバイル・無料版・一部地域は展開待ちです。
            </li>
            <li>
              深く集中して1つのソース群だけを扱う作業(試験勉強、特定レポートの精読など)には、依然として
              <strong>NotebookLM単体での利用が適している</strong>
              という評価が実践者の間で共有されています。Gemini連携は「複数ノートブックを横断する調査」に強みがあります。
            </li>
            <li>
              連携がリアルタイムで自動反映されない場合があり(大きなPDFなどで同期に数分かかる例が報告されている)、即時性が必要な作業では注意してください。
            </li>
          </ul>
        </section>

        {/* CHAPTER 10 */}
        <section className={styles.chapter} id="ch10">
          <span className={styles.chapterTag}>K3 発展</span>
          <h2>
            <span className={styles.num}>10</span>セキュリティとプライバシー — 3層のデータガバナンス
          </h2>

          <h3>
            <i className="ti ti-shield-lock" aria-hidden="true" /> 3つの利用形態
          </h3>
          <p>
            NotebookLMは、どのアカウントでログインするかによって適用される契約・データ保護レベルが異なります。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAG_10} />
            <div className={styles.diagramCaption}>
              図10: 個人・Workspace・Enterpriseの3層データガバナンス
            </div>
          </div>

          <h3>
            <i className="ti ti-file-check" aria-hidden="true" /> データ利用に関する公式方針の要点
          </h3>
          <ul>
            <li>
              アップロードしたファイル・生成物・チャット履歴は「知識ベースの構築」と「回答生成」のために使われますが、
              <strong>基盤モデルの直接的な学習には使われません</strong>
              (ユーザーが自発的にフィードバックを送信した場合を除く)
            </li>
            <li>
              フィードバックを送信した場合、訓練を受けたレビュー担当チームが内容を確認することがあります。その際、Googleアカウントとの紐付けは解除された上でレビューされます
            </li>
            <li>
              レビュー済みフィードバックとそれに関連するデータは、Googleアカウントと切り離した状態で
              <strong>最長3年間保持</strong>されます
            </li>
            <li>
              ノートブックはデフォルトで非公開(鍵アイコン)。「Viewer」「Editor」権限を指定して個別共有するか、リンクを知っている全員に公開する設定も可能です
            </li>
          </ul>

          <h3>
            <i className="ti ti-users" aria-hidden="true" /> 共有時のセキュリティ設計
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>権限</th>
                  <th>できること</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Viewer(閲覧者)</td>
                  <td>ノートブックとの対話は可能だが、ソースの追加・削除・ノートの編集は不可</td>
                </tr>
                <tr>
                  <td>Editor(編集者)</td>
                  <td>ソースの追加・削除、ノート編集に加え、さらに他者への共有も可能</td>
                </tr>
                <tr>
                  <td>チャットのみ共有(Workspaceの一部プランで対応)</td>
                  <td>相手にソース原本を見せずに、対話(質問応答)だけを許可する</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.calloutDanger}`}>
            <i className="ti ti-copyright" aria-hidden="true" />
            <div>
              <strong>実務上の注意</strong>
              著作権を保有していない資料をアップロードしないことが利用規約で明確に求められています。繰り返しの著作権侵害はアカウント停止の対象になります。
            </div>
          </div>
        </section>

        {/* CHAPTER 11 */}
        <section className={styles.chapter} id="ch11">
          <span className={styles.chapterTag}>K3 発展</span>
          <h2>
            <span className={styles.num}>11</span>NotebookLM Enterprise(Google Cloud)導入ガイド
          </h2>

          <h3>
            <i className="ti ti-building-skyscraper" aria-hidden="true" />{" "}
            個人版・Workspace版との違い
          </h3>
          <p>
            NotebookLM Enterpriseは、Google
            Cloudプロジェクト上で稼働する組織向け版です。個人向けNotebookLM/NotebookLM
            Plusとの間でノートブックを移行・共有することはできません(アカウント基盤が異なるため)。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>個人版 NotebookLM</th>
                  <th>NotebookLM Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>データの所在</td>
                  <td>Googleアカウントに紐づく</td>
                  <td>Google Cloudプロジェクト内に固定(US/EUマルチリージョンを選択)</td>
                </tr>
                <tr>
                  <td>アクセス管理</td>
                  <td>個人のGoogleアカウント</td>
                  <td>Cloud IAMロールで管理(Admin/User/Owner/Editor/Viewerの5種)</td>
                </tr>
                <tr>
                  <td>認証方式</td>
                  <td>Google識別情報</td>
                  <td>
                    Google ID または サードパーティIdP(Workforce Identity Federation経由でOkta/Entra
                    IDなど)
                  </td>
                </tr>
                <tr>
                  <td>暗号鍵</td>
                  <td>Google標準暗号化</td>
                  <td>Google標準暗号化 または CMEK(顧客管理暗号鍵)</td>
                </tr>
                <tr>
                  <td>ライセンス</td>
                  <td>個人単位で契約</td>
                  <td>管理者がユーザーへ手動/自動でライセンスを割り当て</td>
                </tr>
                <tr>
                  <td>Gemini Enterprise連携</td>
                  <td>非対応</td>
                  <td>データストアとして接続し、組織横断検索の対象にできる</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            <i className="ti ti-list-numbers" aria-hidden="true" /> 導入ステップ
          </h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAG_11} />
            <div className={styles.diagramCaption}>図11: NotebookLM Enterpriseの導入6ステップ</div>
          </div>

          <h3>
            <i className="ti ti-alert-triangle" aria-hidden="true" />{" "}
            導入時に注意すべき制約(公式FAQより)
          </h3>
          <ul>
            <li>
              Cloud
              NotebookLM組織間でノートブックを直接移行することはできません。エクスポート+再インポートが必要です
            </li>
            <li>
              Excelワークブックは1シートあたり約150,000セル(アクティブセル)までを目安に処理されます
            </li>
            <li>
              サインインが必要なページや、ペイウォールの背後にあるWebサイトはインデックスされません
            </li>
            <li>
              ユーザー単位の詳細な利用状況メトリクス(トークン使用量など)は現時点で提供されていません。組織単位のログはCloud
              LoggingやObservability Analytics経由で取得します
            </li>
            <li>
              Gemini
              Enterprise検索結果からノートブックに追加したソースを含むノートブックは、他ユーザーへの共有ができません
            </li>
          </ul>

          <h3>
            <i className="ti ti-arrows-left-right" aria-hidden="true" /> NotebookLM Enterprise と
            Gemini Enterprise の使い分け
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>判断軸</th>
                  <th>NotebookLM Enterprise</th>
                  <th>Gemini Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>適した用途</td>
                  <td>厳選した信頼できる資料群を土台に、深い理解・コンテンツ生成を行う</td>
                  <td>組織全体のデータを横断検索し、自律型エージェントで業務を遂行する</td>
                </tr>
                <tr>
                  <td>検索範囲</td>
                  <td>ユーザーが明示的に追加したソースのみ</td>
                  <td>Google/サードパーティSaaSを含む組織全体のデータ</td>
                </tr>
                <tr>
                  <td>得意なこと</td>
                  <td>特定トピックの単一の参照拠点構築、Podcast風音声化</td>
                  <td>広範な情報発見、自律ワークフロー、エージェントの構築・実行</td>
                </tr>
                <tr>
                  <td>補完関係</td>
                  <td>Gemini Enterpriseの検索結果を新しいソースとして取り込める</td>
                  <td>NotebookLM Enterpriseのノートブックを検索対象データストアとして登録できる</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            <i className="ti ti-code" aria-hidden="true" /> 設定サンプル
          </h3>
          <p>NotebookLM Enterpriseにおける構成定義のYAMLサンプル（スキーマ例）です。</p>
          <pre className={styles.pre}>
            <code className="language-yaml">
              {`# Enterprise API Config Sample
apiVersion: v1
kind: NotebookConfig
metadata:
  name: org-research-notebook
spec:
  licensing:
    autoAssign: true
  storage:
    dataResidency: "US-EAST1"`}
            </code>
          </pre>
        </section>

        {/* CHAPTER 12 */}
        <section className={styles.chapter} id="ch12">
          <span className={styles.chapterTag}>K2 応用</span>
          <h2>
            <span className={styles.num}>12</span>モバイルアプリの活用と制限事項
          </h2>

          <h3>
            <i className="ti ti-device-mobile" aria-hidden="true" /> 基本情報
          </h3>
          <p>
            NotebookLMモバイルアプリはAndroid 10以降、iOS
            17以降に対応しています。段階的に世界展開されているため、地域によっては未提供の場合があります。
          </p>

          <h3>
            <i className="ti ti-circle-check" aria-hidden="true" /> モバイルでできること
          </h3>
          <ul>
            <li>ソースについてその場で質問する</li>
            <li>Audio Overviewをオフライン再生用にダウンロードする</li>
            <li>Flashcard・Quizで復習する</li>
            <li>Infographic・Slide Deckを閲覧・プレゼンする</li>
            <li>閲覧中のWebページ・PDF・YouTube動画を、共有シートから直接NotebookLMに送る</li>
            <li>Video Overviewの生成・全画面再生・再生速度変更</li>
            <li>生成中のアーティファクトが完了した際のプッシュ通知</li>
            <li>数式のLaTeXレンダリング表示(Ultraプランの英語環境から順次対応)</li>
          </ul>

          <h3>
            <i className="ti ti-exclamation-circle" aria-hidden="true" />{" "}
            モバイル版の既知の制限(デスクトップ版との差分)
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>制限事項</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Chatの高度な設定</td>
                  <td>Configure Chat・チャット分析はモバイルでは提供されない場合がある</td>
                </tr>
                <tr>
                  <td>一部の生成物閲覧</td>
                  <td>
                    ノート・Mind Map・Data
                    Tableの生成/閲覧は段階的に追加されている機能であり、時期によっては未対応
                  </td>
                </tr>
                <tr>
                  <td>Featured Notebooksタブ</td>
                  <td>
                    ホーム画面のタブとしては未提供だが、直接URLでアクセスすればホーム画面に表示される
                  </td>
                </tr>
                <tr>
                  <td>Audio Overviewの扱い</td>
                  <td>ダウンロードはできるが、端末へのファイルとしての保存はできない</td>
                </tr>
                <tr>
                  <td>Discover Sources / Deep Research</td>
                  <td>検索クエリの入力欄からアクセス可能(ソース追加画面経由)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-bulb" aria-hidden="true" />
            <div>
              <strong>Tips</strong>
              公式ヘルプでも「フル機能を使うならデスクトップ版を推奨」と明記されています。モバイルは「移動中の消費・簡易な質問応答」に用途を絞るのが実務的です。
            </div>
          </div>
        </section>

        {/* CHAPTER 13 */}
        <section className={styles.chapter} id="ch13">
          <span className={styles.chapterTag}>K2 応用</span>
          <h2>
            <span className={styles.num}>13</span>アンチパターンとトラブルシューティング
          </h2>

          <h3>
            <i className="ti ti-alert-octagon" aria-hidden="true" /> よくある失敗の連鎖
          </h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAG_12} />
            <div className={styles.diagramCaption}>図12: よくある失敗パターンとその帰結</div>
          </div>

          <h3>
            <i className="ti ti-stethoscope" aria-hidden="true" /> 症状別トラブルシューティング表
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>症状</th>
                  <th>主な原因</th>
                  <th>対処法</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>「回答できません」と表示される</td>
                  <td>①ソースにその情報が本当にない ②質問文が曖昧で関連ソースを特定できていない</td>
                  <td>
                    ①関連ソースを追加する ②質問をより具体的に言い換える
                    ③特定のソース名を明示して検索範囲を絞る
                  </td>
                </tr>
                <tr>
                  <td>引用が一部の箇所にしか付かない</td>
                  <td>ソースの該当箇所の分量が短すぎて、文書全体を参照した扱いになっている</td>
                  <td>
                    短いソースは複数まとめて1つの文書にするか、該当箇所を含む一次資料を追加する
                  </td>
                </tr>
                <tr>
                  <td>ソースの取り込みに失敗する</td>
                  <td>500,000語 / 200MBの上限超過、またはコピー保護PDF</td>
                  <td>
                    ファイルを分割する・コピー保護を解除した版を用意する・テキストをコピペでソース化する
                  </td>
                </tr>
                <tr>
                  <td>Google Docsの更新が反映されない</td>
                  <td>NotebookLMは自動追従せず、手動同期が必要</td>
                  <td>
                    ソースパネルの「Click to sync with Google Drive」を選択する(編集権限が必要)
                  </td>
                </tr>
                <tr>
                  <td>生成された画像/インフォグラフィックの一部だけ直したい</td>
                  <td>静止画として書き出されるため直接編集不可</td>
                  <td>
                    該当箇所のみをカスタムプロンプトで再指定して再生成する。スライドはSlide
                    revisions機能で部分修正が可能
                  </td>
                </tr>
                <tr>
                  <td>特定の話題で「安全フラグ」がかかり回答が拒否される</td>
                  <td>
                    暴力・性的表現など、歴史的文脈であってもセンシティブな語彙がソースに含まれる
                  </td>
                  <td>質問の切り口を変える、該当箇所を除いた抜粋をソース化する</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            <i className="ti ti-scale" aria-hidden="true" />{" "}
            過度な依存を避けるための工夫(教育・研究現場向け)
          </h3>
          <p>
            要約や設問生成をAIに完全に委ねてしまうと、資料を精読して統合するという学習・研究上の重要なプロセスをスキップしてしまうリスクが指摘されています。教育現場の実践例では、評価方法を「AIが生成しやすい要約の採点」から「口頭試問やディベートのように、AIを準備段階の壁打ち相手としてのみ使い、本番は自分の言葉で説明させる」形式へ移行する動きが報告されています。
          </p>
        </section>

        {/* CHAPTER 14 */}
        <section className={styles.chapter} id="ch14">
          <span className={styles.chapterTag}>K3 発展</span>
          <h2>
            <span className={styles.num}>14</span>ユースケース別ワークフロー実例
          </h2>

          <h3>
            <i className="ti ti-microscope" aria-hidden="true" /> 研究者・アナリスト向け
          </h3>
          <ol>
            <li>Deep Researchで競合製品のWeb情報を収集し、レポートとソースをまとめてインポート</li>
            <li>Configure ChatでCustomペルソナ「シニアアナリスト」を設定</li>
            <li>「矛盾・対立点抽出」プロンプト(第7章②)で情報の食い違いを洗い出す</li>
            <li>Data Tableで機能・価格を横断比較する表を生成し、Google Sheetsへエクスポート</li>
            <li>2026年6月以降のエージェント機能でグラフ・PDFレポートを直接生成する</li>
          </ol>

          <h3>
            <i className="ti ti-school" aria-hidden="true" /> 学生・受験者向け
          </h3>
          <ol>
            <li>講義資料・教科書の章・過去問をまとめて1つのノートブックに投入</li>
            <li>「要点抽出」プロンプト(第7章①)で本質的な理解ポイントを洗い出す</li>
            <li>
              Quiz機能を「過去問の出題形式を踏襲して」という指示付きで生成し、模擬試験として利用
            </li>
            <li>間違えた分野だけFlashcardで反復</li>
            <li>通学中にAudio Overview(Lectureフォーマット)で耳から復習</li>
          </ol>

          <h3>
            <i className="ti ti-chalkboard" aria-hidden="true" /> 教員向け
          </h3>
          <ol>
            <li>単元のシラバス・教科書該当章・過去の教材をソースとして投入</li>
            <li>
              「対象学年向けに、学習目標・重要概念・指導の流れ・具体例・振り返りを含む授業案を作成して」と依頼
            </li>
            <li>45〜60分の時間配分を明示すると現実的な計画になりやすい</li>
            <li>
              生成された宿題・小テストを、実際の使用前に必ず内容を確認する(生徒の学習到達度の判定に直結するため)
            </li>
          </ol>

          <h3>
            <i className="ti ti-users-group" aria-hidden="true" /> ビジネス・チーム利用向け
          </h3>
          <ol>
            <li>製品仕様書・市場調査資料をWorkspaceアカウントでノートブック化</li>
            <li>営業チームに「Viewer」権限で共有し、想定問答をChatで即座に引けるようにする</li>
            <li>商談前にBriefing Docを生成して要点を素早くキャッチアップ</li>
            <li>
              議事録notebook(Meeting Notes Knowledge
              Base)を継続運用し、会議前に関連する過去の議論をChatで検索する
            </li>
          </ol>
        </section>

        {/* CHAPTER 15 */}
        <section className={styles.chapter} id="ch15">
          <span className={styles.chapterTag}>K2 応用</span>
          <h2>
            <span className={styles.num}>15</span>ベストプラクティス20則チェックリスト
          </h2>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              ノートブックは「1トピック・1プロジェクト」の単位でスコープを絞っている
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              無関係な資料を同一ノートブックに混在させていない
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" /> Configure
              Chatでノートブックごとにペルソナ・応答スタイルを一度設定している
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              プロンプトには「ソースのみを根拠にする」「不明な場合は明示する」という制約を明示している
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              出力の長さ・構成(語数、設問数など)を具体的に指定している
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              ソースが多い場合、質問文で対象ソース名を明示して検索範囲を絞っている
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" /> Discover Sources /
              Deep Researchの結果は、一次情報としての信頼性を人間が検証してから採用している
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              生成された回答の引用チップを確認し、元資料と突き合わせている
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" /> Google
              Drive由来のソース(Docs/Slides/Sheets)は必要に応じて手動で再同期している
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              各ソースが500,000語/200MBの上限を超えないよう事前に分割・整理している
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              コピー保護されたPDFは事前にテキスト化またはコピペでソース化している
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              目的に応じてStudioの出力形式(Audio/Video/Mind Map/Slide/Infographic/Report/Data
              Table/Quiz/Flashcard)を使い分けている
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              試験対策など出題形式を模倣したい場合、過去問をソースとして与えている
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              議事録・継続プロジェクトはノートブックを使い回し、Chat履歴を資産として活用している
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              トピックを大きく切り替える前にチャット履歴の要否を確認し、必要に応じて削除している
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              個人利用と業務利用でアカウントの種類(個人/Workspace/Enterprise)とデータ保護レベルの違いを理解している
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              共有ノートブックの権限(Viewer/Editor/チャットのみ)を用途に応じて適切に設定している
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              複数ノートブックを横断する調査が必要な場面ではGeminiアプリのNotebooks連携を活用している
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              モバイル版の機能制限(Configure Chat非対応など)を理解した上で用途を切り分けている
            </li>
            <li>
              <i className="ti ti-square-rounded-check" aria-hidden="true" />{" "}
              契約プラン・上限(ソース数、チャット回数等)は公式ページで定期的に確認し、業務量に見合っているか点検している
            </li>
          </ul>
        </section>

        {/* CHAPTER 16 */}
        <section className={styles.chapter} id="ch16">
          <span className={styles.chapterTag}>K1 基礎</span>
          <h2>
            <span className={styles.num}>16</span>2023〜2026 アップデート年表
          </h2>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAG_13} />
            <div className={styles.diagramCaption}>
              図13: 2023年の始動から2026年6月のエージェント化まで
            </div>
          </div>
          <p className={styles.subtle}>
            補足:
            上記の年月は各機能について確認できた公式発表・アナウンスに基づく目安です。地域・プランによって提供開始時期が前後する場合があります。
          </p>
        </section>

        {/* CHAPTER 17 */}
        <section className={styles.chapter} id="ch17">
          <span className={styles.chapterTag}>参照</span>
          <h2>
            <span className={styles.num}>17</span>参考ソースURL一覧
          </h2>

          <h3>
            <i className="ti ti-brand-google" aria-hidden="true" /> Google公式情報(第一次情報)
          </h3>
          <ul className={styles.refList}>
            <li>
              <span className={styles.refTitle}>公式ヘルプセンター</span>
              <span className={styles.refDesc}>NotebookLM全般のFAQ・チュートリアルの入口</span>
              <span className={styles.refUrl}>
                <Ext href="https://support.google.com/notebooklm/?hl=en">
                  https://support.google.com/notebooklm/?hl=en
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>プライバシー・利用規約</span>
              <span className={styles.refDesc}>
                データの学習利用有無、フィードバック審査プロセス、保持期間の公式説明
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://support.google.com/notebooklm/answer/17004255?hl=en">
                  https://support.google.com/notebooklm/answer/17004255?hl=en
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>NotebookLMについて(基本)</span>
              <span className={styles.refDesc}>対応年齢、対応地域、安全フラグの仕組み</span>
              <span className={styles.refUrl}>
                <Ext href="https://support.google.com/notebooklm/answer/16164461?hl=en&co=GENIE.Platform%3DDesktop">
                  https://support.google.com/notebooklm/answer/16164461?hl=en&co=GENIE.Platform%3DDesktop
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>ソースの追加・発見</span>
              <span className={styles.refDesc}>
                Discover Sources・Deep Researchの操作手順、対応ソース形式の公式一覧
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://support.google.com/notebooklm/answer/16215270?hl=en&co=GENIE.Platform%3DDesktop">
                  https://support.google.com/notebooklm/answer/16215270?hl=en&co=GENIE.Platform%3DDesktop
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>ノートブックの作成・共有</span>
              <span className={styles.refDesc}>
                ノートブック作成手順、共有権限(Viewer/Editor)、Analytics機能
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://support.google.com/notebooklm/answer/16206563?hl=en">
                  https://support.google.com/notebooklm/answer/16206563?hl=en
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Chatの使い方・Configure Chat</span>
              <span className={styles.refDesc}>
                会話スタイル(Default/Learning Guide/Custom)、応答長設定の公式説明
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://support.google.com/notebooklm/answer/16179559?hl=en">
                  https://support.google.com/notebooklm/answer/16179559?hl=en
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>よくある質問(上限・プライバシー)</span>
              <span className={styles.refDesc}>
                無料プランの公式な数値(ノートブック数・ソース数・チャット回数)
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://support.google.com/notebooklm/answer/16269187?hl=en">
                  https://support.google.com/notebooklm/answer/16269187?hl=en
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>アップグレード案内</span>
              <span className={styles.refDesc}>
                Google AIプラン・Cloud・Workspace経由でのアップグレード方法
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://support.google.com/notebooklm/answer/16213268?hl=en">
                  https://support.google.com/notebooklm/answer/16213268?hl=en
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>モバイルアプリ(Android)</span>
              <span className={styles.refDesc}>モバイル版の対応機能・制限の公式一覧</span>
              <span className={styles.refUrl}>
                <Ext href="https://support.google.com/notebooklm/answer/16296687?hl=en&co=GENIE.Platform%3DAndroid">
                  https://support.google.com/notebooklm/answer/16296687?hl=en&co=GENIE.Platform%3DAndroid
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>モバイルアプリ(iOS)</span>
              <span className={styles.refDesc}>同上(iOS版)</span>
              <span className={styles.refUrl}>
                <Ext href="https://support.google.com/notebooklm/answer/16296687?hl=en&co=GENIE.Platform%3DiOS">
                  https://support.google.com/notebooklm/answer/16296687?hl=en&co=GENIE.Platform%3DiOS
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Google Workspace生成AIプライバシーハブ</span>
              <span className={styles.refDesc}>
                Workspaceにおけるコアサービス化・データ保護の公式説明
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://support.google.com/a/answer/15706919?hl=en">
                  https://support.google.com/a/answer/15706919?hl=en
                </Ext>
              </span>
            </li>
          </ul>

          <h3>
            <i className="ti ti-news" aria-hidden="true" /> Google公式ブログ(The Keyword / Google
            Labs)
          </h3>
          <ul className={styles.refList}>
            <li>
              <span className={styles.refTitle}>2026年6月の大型アップデート</span>
              <span className={styles.refDesc}>
                Gemini 3.5+Antigravity刷新、コード実行環境、新出力形式の公式発表
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://blog.google/innovation-and-ai/products/notebooklm/better-research-notebooklm/">
                  https://blog.google/innovation-and-ai/products/notebooklm/better-research-notebooklm/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Discover Sources公式発表</span>
              <span className={styles.refDesc}>Discover Sources機能の設計思想と使い方</span>
              <span className={styles.refUrl}>
                <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-discover-sources/">
                  https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-discover-sources/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Deep Research・対応形式拡大</span>
              <span className={styles.refDesc}>Deep Research機能の公式発表</span>
              <span className={styles.refUrl}>
                <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-deep-research-file-types/">
                  https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-deep-research-file-types/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Data Tables公式発表</span>
              <span className={styles.refDesc}>Data Table機能の公式発表</span>
              <span className={styles.refUrl}>
                <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-data-tables/">
                  https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-data-tables/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>モバイルアプリのFlashcard/Quiz</span>
              <span className={styles.refDesc}>モバイル版のFlashcard・Quiz追加の公式発表</span>
              <span className={styles.refUrl}>
                <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-app-quizzes-flashcards/">
                  https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-app-quizzes-flashcards/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Cinematic Video Overview</span>
              <span className={styles.refDesc}>Cinematic Video Overview機能の公式発表</span>
              <span className={styles.refUrl}>
                <Ext href="https://blog.google/innovation-and-ai/products/notebooklm/generate-your-own-cinematic-video-overviews-in-notebooklm/">
                  https://blog.google/innovation-and-ai/products/notebooklm/generate-your-own-cinematic-video-overviews-in-notebooklm/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Chatのカスタムペルソナ強化</span>
              <span className={styles.refDesc}>
                コンテキスト拡大・会話メモリ延長・ペルソナ開放の公式発表
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-custom-personas-engine-upgrade/">
                  https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-custom-personas-engine-upgrade/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Gemini アプリのNotebooks機能</span>
              <span className={styles.refDesc}>Gemini↔NotebookLM双方向同期の公式発表</span>
              <span className={styles.refUrl}>
                <Ext href="https://blog.google/innovation-and-ai/products/gemini-app/notebooks-gemini-notebooklm/">
                  https://blog.google/innovation-and-ai/products/gemini-app/notebooks-gemini-notebooklm/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>モバイルアプリ公式リリース</span>
              <span className={styles.refDesc}>NotebookLMモバイルアプリのリリース公式発表</span>
              <span className={styles.refUrl}>
                <Ext href="https://blog.google/innovation-and-ai/products/notebooklm-app/">
                  https://blog.google/innovation-and-ai/products/notebooklm-app/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Google I/O 2026とNotebookLM</span>
              <span className={styles.refDesc}>I/O 2026のまとめノートブック公式紹介</span>
              <span className={styles.refUrl}>
                <Ext href="https://blog.google/innovation-and-ai/products/notebooklm/notebooklm-google-io-2026/">
                  https://blog.google/innovation-and-ai/products/notebooklm/notebooklm-google-io-2026/
                </Ext>
              </span>
            </li>
          </ul>

          <h3>
            <i className="ti ti-cloud" aria-hidden="true" /> Google Workspace / Google
            Cloud公式ドキュメント
          </h3>
          <ul className={styles.refList}>
            <li>
              <span className={styles.refTitle}>Workspace向けNotebookLM紹介</span>
              <span className={styles.refDesc}>Workspaceにおけるセキュリティ・活用事例</span>
              <span className={styles.refUrl}>
                <Ext href="https://workspace.google.com/products/notebooklm/">
                  https://workspace.google.com/products/notebooklm/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>2026年3月Workspaceアップデート</span>
              <span className={styles.refDesc}>
                Slide revisions・Cinematic Video・EPUB・PPTX書き出し等の公式リリースノート
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://workspaceupdates.googleblog.com/2026/03/new-ways-to-customize-and-interact-with-your-content-in-NotebookLM.html">
                  https://workspaceupdates.googleblog.com/2026/03/new-ways-to-customize-and-interact-with-your-content-in-NotebookLM.html
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Education向けコアサービス化</span>
              <span className={styles.refDesc}>教育機関向けデータ保護強化の公式発表</span>
              <span className={styles.refUrl}>
                <Ext href="https://workspaceupdates.googleblog.com/2025/04/notebookLM-and-gemini-app-core-services-for-education-customers.html">
                  https://workspaceupdates.googleblog.com/2025/04/notebookLM-and-gemini-app-core-services-for-education-customers.html
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>NotebookLM Enterprise概要</span>
              <span className={styles.refDesc}>
                Enterprise版のアーキテクチャ・IAMロールの公式ドキュメント
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/overview">
                  https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/overview
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>NotebookLM Enterpriseセットアップ</span>
              <span className={styles.refDesc}>ID連携・CMEK設定の公式手順</span>
              <span className={styles.refUrl}>
                <Ext href="https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/set-up-notebooklm">
                  https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/set-up-notebooklm
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>ライセンス管理</span>
              <span className={styles.refDesc}>ライセンス割り当て方法の公式手順</span>
              <span className={styles.refUrl}>
                <Ext href="https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/set-up-licensing">
                  https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/set-up-licensing
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>ノートブック共有(Enterprise)</span>
              <span className={styles.refDesc}>Enterprise版での共有権限の公式説明</span>
              <span className={styles.refUrl}>
                <Ext href="https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/share-notebooks">
                  https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/share-notebooks
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Enterprise FAQ</span>
              <span className={styles.refDesc}>組織間移行不可等、公式FAQ</span>
              <span className={styles.refUrl}>
                <Ext href="https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/faq">
                  https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/faq
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>NotebookLM Enterprise vs Gemini Enterprise</span>
              <span className={styles.refDesc}>2製品の使い分け公式ガイド</span>
              <span className={styles.refUrl}>
                <Ext href="https://docs.cloud.google.com/gemini/enterprise/docs/choose-product">
                  https://docs.cloud.google.com/gemini/enterprise/docs/choose-product
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Gemini Enterpriseとの検索連携</span>
              <span className={styles.refDesc}>
                NotebookLM Enterpriseを検索ソースとして接続する公式手順
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://docs.cloud.google.com/gemini/enterprise/docs/connectors/connect-notebooklm">
                  https://docs.cloud.google.com/gemini/enterprise/docs/connectors/connect-notebooklm
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>NotebookLM Enterprise API</span>
              <span className={styles.refDesc}>ノートブック管理APIの公式リファレンス</span>
              <span className={styles.refUrl}>
                <Ext href="https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks">
                  https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks
                </Ext>
              </span>
            </li>
          </ul>

          <h3>
            <i className="ti ti-file-text" aria-hidden="true" />{" "}
            第三者による実践的な集計・解説記事(プラン上限・活用術の参考)
          </h3>
          <ul className={styles.refList}>
            <li>
              <span className={styles.refTitle}>プラン・上限の集計</span>
              <span className={styles.refDesc}>Free〜Ultraの上限を一覧化した独立系の集計記事</span>
              <span className={styles.refUrl}>
                <Ext href="https://notebooklm-guide.com/notebooklm-system-limits-benchmarks">
                  https://notebooklm-guide.com/notebooklm-system-limits-benchmarks
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>ソース上限の解説</span>
              <span className={styles.refDesc}>ソース数・ファイルサイズ上限の独立系解説</span>
              <span className={styles.refUrl}>
                <Ext href="https://elephas.app/blog/notebooklm-source-limits">
                  https://elephas.app/blog/notebooklm-source-limits
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>日次上限の解説</span>
              <span className={styles.refDesc}>チャット回数・Audio Overview回数の独立系解説</span>
              <span className={styles.refUrl}>
                <Ext href="https://elephas.app/blog/notebooklm-daily-limit">
                  https://elephas.app/blog/notebooklm-daily-limit
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>ファイルアップロード上限</span>
              <span className={styles.refDesc}>上限到達時の回避策の独立系解説</span>
              <span className={styles.refUrl}>
                <Ext href="https://elephas.app/blog/how-to-upload-more-files-notebooklm">
                  https://elephas.app/blog/how-to-upload-more-files-notebooklm
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>プラン料金の集計</span>
              <span className={styles.refDesc}>
                Free/Plus/Pro/Ultraの料金を一覧化した独立系記事
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://felloai.com/notebooklm-pricing/">
                  https://felloai.com/notebooklm-pricing/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Ultraプラン刷新の解説</span>
              <span className={styles.refDesc}>Ultraプラン新設時の独立系解説記事</span>
              <span className={styles.refUrl}>
                <Ext href="https://www.xda-developers.com/notebooklm-launches-new-ultra-tier-with-higher-limits/">
                  https://www.xda-developers.com/notebooklm-launches-new-ultra-tier-with-higher-limits/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>2026年の変化まとめ</span>
              <span className={styles.refDesc}>2026年の機能変化を実務目線でまとめた解説記事</span>
              <span className={styles.refUrl}>
                <Ext href="https://www.jeffsu.org/notebooklm-changed-completely-heres-what-matters-in-2026/">
                  https://www.jeffsu.org/notebooklm-changed-completely-heres-what-matters-in-2026/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>活用ワークフロー集</span>
              <span className={styles.refDesc}>
                Custom Instructions・Deep Research等の実践的活用術
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://www.shareuhack.com/en/posts/notebooklm-advanced-guide-2026">
                  https://www.shareuhack.com/en/posts/notebooklm-advanced-guide-2026
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Gemini連携の実践レビュー</span>
              <span className={styles.refDesc}>Gemini↔NotebookLM連携の1週間実践レビュー</span>
              <span className={styles.refUrl}>
                <Ext href="https://www.mejba.me/blog/notebooklm-gemini-app-integration">
                  https://www.mejba.me/blog/notebooklm-gemini-app-integration
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>データセキュリティ解説</span>
              <span className={styles.refDesc}>
                個人版/Workspace/Enterpriseのセキュリティ比較解説
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://www.devoteam.com/expert-view/a-guide-to-notebooklm-data-security/">
                  https://www.devoteam.com/expert-view/a-guide-to-notebooklm-data-security/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>機能全般の解説</span>
              <span className={styles.refDesc}>既知の制約・Studio機能全般の解説記事</span>
              <span className={styles.refUrl}>
                <Ext href="https://www.digitalocean.com/resources/articles/what-is-notebooklm">
                  https://www.digitalocean.com/resources/articles/what-is-notebooklm
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Discover Sourcesの功罪</span>
              <span className={styles.refDesc}>
                Discover Sources導入時の教育現場での留意点に関する考察
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://tomdaccordai.substack.com/p/exploring-notebooklms-new-discover">
                  https://tomdaccordai.substack.com/p/exploring-notebooklms-new-discover
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>プロンプト実践集(学習用途)</span>
              <span className={styles.refDesc}>学習者向けプロンプトパターンの実践解説</span>
              <span className={styles.refUrl}>
                <Ext href="https://www.learnwithmeai.com/p/notebooklm-prompts-for-studying">
                  https://www.learnwithmeai.com/p/notebooklm-prompts-for-studying
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>プロンプト実践集(教員向け)</span>
              <span className={styles.refDesc}>教員向けプロンプトパターンの実践解説</span>
              <span className={styles.refUrl}>
                <Ext href="https://www.analyticsvidhya.com/blog/2026/01/notebooklm-for-teachers/">
                  https://www.analyticsvidhya.com/blog/2026/01/notebooklm-for-teachers/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>プロンプト実践集(研究者向け)</span>
              <span className={styles.refDesc}>
                上級リサーチャー向けプロンプトワークフローの解説
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://pasqualepillitteri.it/en/news/1506/notebooklm-prompts-senior-researcher-workflow">
                  https://pasqualepillitteri.it/en/news/1506/notebooklm-prompts-senior-researcher-workflow
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refTitle}>Custom Instructions解説</span>
              <span className={styles.refDesc}>Configure Chatの各設定項目の解説</span>
              <span className={styles.refUrl}>
                <Ext href="https://cdil.bc.edu/resources/google-ai/adding-custom-instructions-in-notebooklm/">
                  https://cdil.bc.edu/resources/google-ai/adding-custom-instructions-in-notebooklm/
                </Ext>
              </span>
            </li>
          </ul>
        </section>

        {/* END NOTE */}
        <div className={styles.endNote}>
          <h2>
            <i className="ti ti-flag-3" style={{ color: "var(--teal)" }} aria-hidden="true" />{" "}
            おわりに
          </h2>
          <p>
            NotebookLMは「ソースに忠実であること」を最大の武器とするツールですが、2026年6月のアップデートにより、コード実行やエージェント的なソース探索といった能動的な能力も獲得しつつあります。本ガイドの各ステップ(ノートブック設計
            → ソース追加 → Chat設定 → プロンプト設計 → Studio活用 → Gemini連携 →
            セキュリティ理解)を順に踏むことで、単なる「要約ツール」から「組織・個人の知識基盤」へとNotebookLMを育てていくことができます。
          </p>
          <p style={{ marginBottom: 0 }}>
            機能は頻繁にアップデートされるため、本ガイドの数値・仕様は必ず
            <Ext href="https://support.google.com/notebooklm/?hl=en">公式ヘルプセンター</Ext>
            で最新情報を確認する習慣とあわせてご活用ください。
          </p>
        </div>
      </main>
    </div>
  );
}
