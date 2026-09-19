import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "AI Engineering 入門ガイド ― 基盤モデル時代のソフトウェア開発を学ぶ",
  description:
    "基盤モデル時代のソフトウェア開発を実務の順序で学ぶ入門ガイド。Chip Huyen著『AI Engineering』の章構成を土台に17セクションで解説。",
};

const MERMAID_THEME_VARIABLES = {
  fontSize: "16px",
  primaryColor: "#E7E9F5",
  primaryBorderColor: "#3B4A87",
  primaryTextColor: "#241F17",
  lineColor: "#5B5140",
  secondaryColor: "#F3E7CC",
  secondaryBorderColor: "#9C6B1F",
  tertiaryColor: "#FFFFFF",
  tertiaryBorderColor: "#E1D6BC",
  clusterBkg: "#FFFFFF",
  clusterBorder: "#D8CBA8",
  edgeLabelBackground: "#F7F2E7",
  mainBkg: "#E7E9F5",
  nodeTextColor: "#241F17",
};

const DIAGRAM_EVOLUTION = `flowchart TB
    A["Software 1.0<br/>人間が明示的にコードを書く<br/>例: C++, Python"] --> B["Software 2.0<br/>ニューラルネットワークの重みが「コード」になる<br/>例: 画像認識モデルの学習"]
    B --> C["Software 3.0<br/>LLMを自然言語のプロンプトでプログラムする<br/>例: システムプロンプト, エージェント指示"]
    C --> D["AI Engineering<br/>基盤モデルを使って実際の製品を作る実践知"]`;

const DIAGRAM_STACK3 = `flowchart TB
    subgraph App["① アプリケーション開発層"]
        A1["プロンプト設計・コンテキスト構築"]
        A2["評価（Evaluation）"]
        A3["ユーザーインターフェース"]
    end
    subgraph Model["② モデル開発層"]
        M1["モデリング・学習・Fine-tuning"]
        M2["データセットエンジニアリング"]
        M3["推論最適化"]
    end
    subgraph Infra["③ インフラ層"]
        I1["モデルサービング"]
        I2["データ・計算リソース管理"]
        I3["モニタリング"]
    end
    App --> Model --> Infra`;

const DIAGRAM_CONTEXT = `flowchart TB
    CW["コンテキストウィンドウ全体の設計 = コンテキストエンジニアリング"]
    CW --> P["プロンプト本文の文言<br/>（プロンプトエンジニアリングの範囲）"]
    CW --> H["会話履歴"]
    CW --> R["検索で取得したドキュメント（RAG）"]
    CW --> T["ツール定義（Function Calling / MCP）"]
    CW --> M["メモリー・過去のやり取りの要約"]
    P ~~~ H
    H ~~~ R
    R ~~~ T
    T ~~~ M`;

const DIAGRAM_EVALLOOP = `flowchart TB
    S1["① システム内の各コンポーネントを個別に評価する"] --> S2["② 評価ガイドラインを作成する"]
    S2 --> S3["③ 評価手法と評価データを定義する"]
    S3 --> S4["④ 自動評価を実行する（LLM-as-a-judge / 類似度 / 厳密評価）"]
    S4 --> S5["⑤ 実際の出力を読み、エラー分析を行う"]
    S5 --> S6["⑥ 修正を反映し、再評価する"]
    S6 -.->|継続的改善のループ| S1`;

const DIAGRAM_RAG = `flowchart TB
    Q["ユーザーの質問"] --> E["クエリを埋め込みベクトルに変換"]
    E --> RT["検索: ベクトル検索・キーワード検索・ハイブリッド検索"]
    RT --> RR["リランキングで関連度の高い文書に絞り込む"]
    RR --> CTX["取得した文書をコンテキストとして追加"]
    CTX --> LLM["LLMが回答を生成"]
    LLM --> A["引用付きで回答をユーザーへ返す"]`;

const DIAGRAM_WORKFLOW_AGENT = `flowchart TB
    subgraph WF["ワークフロー: 開発者があらかじめ実行経路を決める"]
        direction TB
        W1["入力"] --> W2["LLM呼び出し 1"]
        W2 --> W3["LLM呼び出し 2"]
        W3 --> W4["出力"]
    end
    subgraph AG["エージェント: LLMが自律的に次の行動を決める"]
        direction TB
        A1["入力・目標"] --> A2["LLMが次のツールを選択"]
        A2 --> A3["ツールを実行し結果を観察"]
        A3 --> A4{"目標を達成したか"}
        A4 -- "いいえ" --> A2
        A4 -- "はい" --> A5["出力"]
    end
    WF ~~~ AG`;

const DIAGRAM_MCP = `flowchart TB
    Host["MCPホスト（AIアプリ本体）"] --> Client["MCPクライアント"]
    Client -- "標準化されたプロトコルで通信" --> Server1["MCPサーバー: 社内データベース"]
    Client --> Server2["MCPサーバー: ファイルシステム"]
    Client --> Server3["MCPサーバー: 外部API・SaaS連携"]`;

const DIAGRAM_FINETUNE = `flowchart TB
    Q1{"プロンプト設計とコンテキスト追加だけで<br/>十分な精度が出るか"}
    Q1 -- "はい" --> R1["プロンプト/コンテキストエンジニアリングで十分"]
    Q1 -- "いいえ" --> Q2{"外部知識や最新情報の不足が原因か"}
    Q2 -- "いいえ" --> Q3{"特定の出力形式・トーン・<br/>専門ドメインの振る舞いをモデル自体に<br/>学習させたいか"}
    Q2 -- "はい" --> Q2b{"代表的な質問で検証: ナレッジベースの規模・更新頻度、入力コンテキスト上限、プロンプトキャッシュの可否、品質/コスト/レイテンシを踏まえても全文投入で足りるか"}
    Q2b -- "はい" --> R2b["コンテキストへの全文投入で十分（RAG導入は不要）"]
    Q2b -- "いいえ" --> R2["RAGを導入する"]
    Q3 -- "はい" --> R3["Fine-tuningを検討する"]
    Q3 -- "いいえ" --> R4["RAGと評価による改善サイクルを継続する"]`;

const DIAGRAM_ROADMAP = `flowchart TB
    P1["1. プログラミング基礎（Python, Git, データ構造）"] --> P2["2. LLM APIの基本とプロンプト/コンテキストエンジニアリング"]
    P2 --> P3["3. 評価（Evaluation）設計の基礎"]
    P3 --> P4["4. RAGパイプラインの構築"]
    P4 --> P5["5. AIエージェントとMCPツール連携"]
    P5 --> P6["6. Fine-tuningと推論最適化"]
    P6 --> P7["7. LLMOps：本番監視と継続的改善"]`;

export default function AiEngineeringGuidePage() {
  return (
    <div className={styles.layout} data-testid="layout-root" data-page="ai-engineering-guide">
      {/*
       * ページ固有スタイル: Server Component として SSR 時から即時適用。
       * CSS Module :global() より先に読まれるため、JS ハイドレーション前から
       * body 背景をページのベージュに揃え、隙間が「黒い線」に見えるのを防ぐ。
       * border-bottom: none で disclaimer 下の線も除去。
       * #site-freshness-bar は data-page で本ページに限定し、React 19 の
       * <style precedence> が遷移後も <head> に残存しても他ページへ波及しないようにする。
       */}
      <style href="ai-engineering-guide-page-overrides" precedence="default">{`
        body:has([data-testid="layout-root"][data-page="ai-engineering-guide"]) {
          background: #f7f2e7 !important;
        }
        body:has([data-testid="layout-root"][data-page="ai-engineering-guide"]) .ch-disclaimer {
          background-color: #120e04 !important;
          border-bottom: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        body:has([data-testid="layout-root"][data-page="ai-engineering-guide"]) #common-header {
          background-color: #05080f !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        body:has([data-testid="layout-root"][data-page="ai-engineering-guide"]) #site-freshness-bar {
          display: none !important;
          height: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: hidden !important;
        }
      `}</style>
      {/* 外部CSS（Tabler Icons）SRI付き */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.46.0/dist/tabler-icons.min.css"
        integrity="sha384-ND+q1IVc0KDElX60dZaqKc7Xl9cdxd2PpU2JfVUHcurCkFVtVLFdt9vJfxtHSL3p"
        crossOrigin="anonymous"
      />
      {/* 原本準拠のGoogle Fonts link */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif+JP:wght@600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,600;0,8..60,700;1,8..60,400&display=swap"
      />

      <a className={styles.skipLink} href="#main">
        本文へスキップ
      </a>

      <button
        type="button"
        className={styles.navToggle}
        id="navToggle"
        aria-label="目次メニューを開く"
        aria-expanded="false"
      >
        <i className="ti ti-menu-2" />
      </button>

      <div className={styles.scrim} id="scrim" />

      <nav className={styles.sidebar} id="sidebar" aria-label="目次" data-testid="sidebar-nav">
        <div className={styles.sidebarBrand}>
          <i className="ti ti-compass" />
          <span>
            AI Engineering 入門
            <small>ステップバイステップガイド</small>
          </span>
        </div>
        <ul className={styles.navlist} id="navlist">
          <li>
            <a href="#sec-1" className={styles.active} data-testid="sidebar-nav-link">
              <i className="ti ti-rocket" />
              <span className={styles.n}>1</span>はじめに
            </a>
          </li>
          <li>
            <a href="#sec-2" data-testid="sidebar-nav-link">
              <i className="ti ti-history" />
              <span className={styles.n}>2</span>歴史的背景
            </a>
          </li>
          <li>
            <a href="#sec-3" data-testid="sidebar-nav-link">
              <i className="ti ti-scale-outline" />
              <span className={styles.n}>3</span>MLとの違い
            </a>
          </li>
          <li>
            <a href="#sec-4" data-testid="sidebar-nav-link">
              <i className="ti ti-stack-2" />
              <span className={styles.n}>4</span>3つの層
            </a>
          </li>
          <li>
            <a href="#sec-5" data-testid="sidebar-nav-link">
              <i className="ti ti-atom" />
              <span className={styles.n}>5</span>Foundation Models
            </a>
          </li>
          <li>
            <a href="#sec-6" data-testid="sidebar-nav-link">
              <i className="ti ti-message-chatbot" />
              <span className={styles.n}>6</span>コンテキスト設計
            </a>
          </li>
          <li>
            <a href="#sec-7" data-testid="sidebar-nav-link">
              <i className="ti ti-checklist" />
              <span className={styles.n}>7</span>評価を設計する
            </a>
          </li>
          <li>
            <a href="#sec-8" data-testid="sidebar-nav-link">
              <i className="ti ti-database-search" />
              <span className={styles.n}>8</span>RAG
            </a>
          </li>
          <li>
            <a href="#sec-9" data-testid="sidebar-nav-link">
              <i className="ti ti-robot" />
              <span className={styles.n}>9</span>AIエージェント
            </a>
          </li>
          <li>
            <a href="#sec-10" data-testid="sidebar-nav-link">
              <i className="ti ti-plug" />
              <span className={styles.n}>10</span>MCP
            </a>
          </li>
          <li>
            <a href="#sec-11" data-testid="sidebar-nav-link">
              <i className="ti ti-adjustments" />
              <span className={styles.n}>11</span>Fine-tuning
            </a>
          </li>
          <li>
            <a href="#sec-12" data-testid="sidebar-nav-link">
              <i className="ti ti-gauge" />
              <span className={styles.n}>12</span>推論最適化
            </a>
          </li>
          <li>
            <a href="#sec-13" data-testid="sidebar-nav-link">
              <i className="ti ti-activity-heartbeat" />
              <span className={styles.n}>13</span>LLMOps
            </a>
          </li>
          <li>
            <a href="#sec-14" data-testid="sidebar-nav-link">
              <i className="ti ti-shield" />
              <span className={styles.n}>14</span>セキュリティ
            </a>
          </li>
          <li>
            <a href="#sec-15" data-testid="sidebar-nav-link">
              <i className="ti ti-route" />
              <span className={styles.n}>15</span>ロードマップ
            </a>
          </li>
          <li>
            <a href="#sec-16" data-testid="sidebar-nav-link">
              <i className="ti ti-flag" />
              <span className={styles.n}>16</span>まとめ
            </a>
          </li>
          <li>
            <a href="#sec-17" data-testid="sidebar-nav-link">
              <i className="ti ti-books" />
              <span className={styles.n}>17</span>参考文献・出典
            </a>
          </li>
        </ul>
      </nav>

      <main className={styles.main} id="main">
        <header className={styles.hero}>
          <span className={styles.eyebrow}>
            <i className="ti ti-sparkles" /> 初学者向けステップバイステップガイド
          </span>
          <h1>AI Engineering 入門ガイド</h1>
          <p className={styles.lede}>基盤モデル時代のソフトウェア開発を、実務の順序で学ぶ。</p>
          <div className={styles.heroMeta}>
            <span data-testid="page-freshness">
              <i className="ti ti-calendar" /> 公開: <time dateTime="2026-09-17">2026-09-17</time> ·
              最終確認: <time dateTime="2026-09-17">2026-09-17</time>
            </span>
            <span>
              <i className="ti ti-calendar" /> 情報基準日: 2026年9月9日
            </span>
            <span>
              <i className="ti ti-language" /> 日本語
            </span>
            <span>
              <i className="ti ti-list-numbers" /> 全17セクション
            </span>
          </div>
        </header>

        <div className={styles.prose}>
          <div className={styles.callout} data-variant="info" data-testid="callout">
            <strong>このガイドについて：</strong> Chip Huyen著『AI Engineering』（O'Reilly,
            2024年12月刊）の章構成を土台に、Andrej
            Karpathy、Shawn&nbsp;&quot;swyx&quot;&nbsp;Wang、Simon&nbsp;Willison、Hamel&nbsp;Husainなど、国際的に著名な開発者・エンジニアの発信内容を参照しながら、初学者向けにステップバイステップで再構成しています。AI分野は変化が非常に速いため、実際に手を動かす際は巻末の「
            <a href="#sec-17">参考文献・出典</a>
            」セクションに集約したURLから最新情報を確認してください（出典URLはSection&nbsp;17に集約していますが、一部は本文中にも記載しています）。
          </div>
        </div>

        {/* ============ 1 ============ */}
        <section className={styles.chapter} id="sec-1">
          <div className={styles.chapterKicker}>
            <i className="ti ti-rocket" />
            SECTION 1
          </div>
          <h2 id="sec-1-title">はじめに — AI Engineeringとは何か</h2>
          <div className={styles.prose}>
            <p>
              AI Engineering（AIエンジニアリング）とは、ゼロからモデルを学習させるのではなく、
              <strong>
                すでに公開されている基盤モデル（Foundation
                Model）を使ってアプリケーションを構築するプロセス
              </strong>
              を指します。これはChip Huyenの著書『AI
              Engineering』での定義を土台とした説明で、GPT・Claude・Geminiのようなモデルを「材料」として捉え、それをどう組み合わせ、評価し、製品として届けるかに焦点を当てる新しい職種・スキルセットです。
            </p>
            <p>
              以前は高度な機械学習の知識がなければAIを使った製品を作ることはできませんでした。しかし基盤モデルがAPIやオープンウェイトの形で誰でも使えるようになったことで、Web開発者やプロダクトエンジニアも「モデルを訓練する人」ではなく「モデルを使いこなして製品を作る人」としてAI開発に参加できるようになりました。これが数年で急速に確立された理由です。
            </p>
            <p>
              この職種は2023年前後に体系化され始めました。開発者コミュニティ「Latent
              Space」および「AI Engineer」カンファレンスの創設者であるShawn &quot;swyx&quot;
              Wangは、2023年のエッセイ「The Rise of the AI
              Engineer」の中で、AIを使う技術者・AI製品を作る技術者・AIそのものがエンジニアリング作業を行うケースという3つの新しい役割を整理し、これが「AI
              Engineer」という職業名が広まる出発点になりました。
            </p>
          </div>
        </section>

        {/* ============ 2 ============ */}
        <section className={styles.chapter} id="sec-2">
          <div className={styles.chapterKicker}>
            <i className="ti ti-history" />
            SECTION 2
          </div>
          <h2 id="sec-2-title">なぜ今、AI Engineeringなのか（歴史的背景）</h2>
          <div className={styles.prose}>
            <p>
              OpenAIの創業メンバーであり元Tesla AI責任者でもあるAndrej
              Karpathyは、2025年6月にAIスタートアップスクール（サンフランシスコ）で行った講演「Software
              Is Changing (Again)」の中で、ソフトウェアの歴史を3つの世代に分けて説明しました。
            </p>
            <ul>
              <li>
                <strong>Software 1.0</strong>
                ：人間が明示的にC++やPythonなどのコードを書く、従来型のプログラミング
              </li>
              <li>
                <strong>Software 2.0</strong>
                ：ニューラルネットワークの重み（パラメータ）そのものが「コード」になり、データセットと最適化によって開発する形態
              </li>
              <li>
                <strong>Software 3.0</strong>
                ：LLM（大規模言語モデル）を英語などの自然言語でプログラムする、新しい形態
              </li>
            </ul>
            <p>
              Karpathyは、LLMを「新しい種類のコンピュータ」であり、プロンプトが新しい種類のプログラムであると位置づけ、現在はこのLLMという新しいコンピュータの計算コストがまだ高く中央集権的にクラウドで動いている点で、コンピュータ黎明期の1960年代に似た状況にあると述べています。AI
              Engineeringは、まさにこの「Software 3.0」を実務として動かすための工学的な実践知です。
            </p>
          </div>

          <div className={styles.diagramCard}>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots-3" />
              図: ソフトウェアの3つの世代とAI Engineeringの位置づけ
            </div>
            <div
              className={styles.mermaidWrapper}
              id="wrap-evolution"
              data-testid="mermaid-diagram"
            >
              <MermaidDiagram
                chart={DIAGRAM_EVOLUTION}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
              />
            </div>
          </div>

          <div className={styles.prose}>
            <p>
              さらに2025年半ば以降は、単発のプロンプトではなく「コンテキストウィンドウに何を入れるか」を体系的に設計する「コンテキストエンジニアリング（Context
              Engineering）」という考え方をKarpathyが用い、業界で急速に定着しました（詳細はStep
              2で解説します）。
            </p>
          </div>
        </section>

        {/* ============ 3 ============ */}
        <section className={styles.chapter} id="sec-3">
          <div className={styles.chapterKicker}>
            <i className="ti ti-scale-outline" />
            SECTION 3
          </div>
          <h2 id="sec-3-title">AI EngineeringとMLエンジニアリングの違い</h2>
          <div className={styles.prose}>
            <p>
              Chip Huyenは著書の中で、AI
              EngineeringをMLエンジニアリング・フルスタックエンジニアリングと比較し、次のような違いを整理しています。
            </p>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>従来のMLエンジニアリング</th>
                  <th>AI Engineering</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>出発点</td>
                  <td>自社データを集め、モデルをゼロから設計・学習する</td>
                  <td>既存の基盤モデルから始め、プロンプトやRAGで製品要件に適応させる</td>
                </tr>
                <tr>
                  <td>主な作業</td>
                  <td>モデルアーキテクチャ設計、学習パイプライン構築</td>
                  <td>プロンプト設計、評価設計、コンテキスト構築、インターフェース開発</td>
                </tr>
                <tr>
                  <td>必要スキル</td>
                  <td>統計・数理最適化・モデル理論の比重が高い</td>
                  <td>ソフトウェアエンジニアリング・プロダクト感覚の比重が高い</td>
                </tr>
                <tr>
                  <td>開発サイクル</td>
                  <td>データ収集からモデル学習まで長期化しやすい</td>
                  <td>まずプロトタイプを作り、ユーザーの反応を見ながら段階的に高度化する</td>
                </tr>
                <tr>
                  <td>評価の重み</td>
                  <td>精度などの定量指標が中心</td>
                  <td>
                    オープンエンドな出力の評価（LLM-as-a-judgeなど）が中心で比重が非常に大きい
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.prose}>
            <p>
              Huyenは、参入障壁が下がったからこそ「誰でも始められるが、しっかりした評価と反復設計ができるチームだけが本番品質のAI製品を作れる」という点を強調しています。この視点は、Web開発者がAI
              Engineeringに参入しやすい理由であり、同時に評価（Evaluation）が本ガイドの中で繰り返し重視される理由でもあります。
            </p>
          </div>
        </section>

        {/* ============ 4 ============ */}
        <section className={styles.chapter} id="sec-4">
          <div className={styles.chapterKicker}>
            <i className="ti ti-stack-2" />
            SECTION 4
          </div>
          <h2 id="sec-4-title">AIエンジニアリングスタック：3つの層</h2>
          <div className={styles.prose}>
            <p>
              Huyenは、AIアプリケーションのスタックを3つの層に整理しています。開発は基本的に上の層（アプリケーション開発層）から始め、必要に応じて下の層に降りていくという設計指針が示されています。
            </p>
          </div>

          <div className={styles.diagramCard}>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots-3" />
              図: AIエンジニアリングスタックの3層構造
            </div>
            <div className={styles.mermaidWrapper} id="wrap-stack3" data-testid="mermaid-diagram">
              <MermaidDiagram
                chart={DIAGRAM_STACK3}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
              />
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>層</th>
                  <th>何をする層か</th>
                  <th>代表的な技術要素</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>① アプリケーション開発層</td>
                  <td>
                    既存モデルに良いプロンプトと必要なコンテキストを与え、厳密な評価を行い、良いUIを提供する
                  </td>
                  <td>
                    プロンプト/コンテキストエンジニアリング、RAG、エージェント、評価パイプライン
                  </td>
                </tr>
                <tr>
                  <td>② モデル開発層</td>
                  <td>モデルそのものを開発・適応させるための層。データセントリックな作業が中心</td>
                  <td>Fine-tuning、モデルマージ、データセット構築、推論最適化</td>
                </tr>
                <tr>
                  <td>③ インフラ層</td>
                  <td>実際にモデルを動かし続けるための基盤</td>
                  <td>サービング、ゲートウェイ、計算資源管理、監視</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.prose}>
            <p>
              多くのAIエンジニアは①のアプリケーション開発層でキャリアをスタートし、必要が生じたときだけ②③に踏み込みます。「まずプロンプトと評価で解決できないか」を常に最初に検討する、という考え方は本ガイド全体に共通する重要な指針です。
            </p>
          </div>
        </section>

        {/* ============ 5 ============ */}
        <section className={styles.chapter} id="sec-5">
          <div className={styles.chapterKicker}>
            <i className="ti ti-atom" />
            SECTION 5 · STEP 1
          </div>
          <h2 id="sec-5-title">Foundation Modelsの基礎を理解する</h2>
          <div className={styles.prose}>
            <p>
              基盤モデル（Foundation
              Model）は、大量のテキスト・画像・コードなどで事前学習された汎用モデルです。AIエンジニアが理解すべき基礎知識は次の通りです。
            </p>
            <ul>
              <li>
                <strong>学習データ</strong>
                ：多言語対応やドメイン特化型モデルの性質は学習データによって大きく左右されます。
              </li>
              <li>
                <strong>モデリングとポストトレーニング</strong>
                ：教師ありファインチューニング（SFT）や選好チューニング（RLHFなど）を経て、指示に従いやすい・安全な応答をするモデルへと調整されます。
              </li>
              <li>
                <strong>サンプリング</strong>
                ：LLMは決定論的ではなく、確率分布から次のトークンをサンプリングして応答を生成する確率的なシステムです。temperatureなどのサンプリングパラメータで挙動が変わります。
              </li>
              <li>
                <strong>構造化出力</strong>：JSON
                Schemaなどを指定し、後続処理がしやすい形式で出力させる技術は、実務のAIエンジニアリングで非常に重要です。
              </li>
            </ul>
            <p>
              Karpathyは、現在のLLMには「ジャギー・インテリジェンス（Jagged
              Intelligence）」と呼ばれる特徴があると指摘しています。これは、非常に高度な数学の問題を解ける一方で、単純な比較（例：9.11と9.9のどちらが大きいか）を間違えることがあるなど、能力にムラがある現象を指す表現です。この特性を理解した上で、モデルの得意・不得意を前提にシステムを設計することがAIエンジニアリングの出発点になります。
            </p>
          </div>
        </section>

        {/* ============ 6 ============ */}
        <section className={styles.chapter} id="sec-6">
          <div className={styles.chapterKicker}>
            <i className="ti ti-message-chatbot" />
            SECTION 6 · STEP 2
          </div>
          <h2 id="sec-6-title">プロンプトエンジニアリングからコンテキストエンジニアリングへ</h2>
          <div className={styles.prose}>
            <p>
              初学者が最初に触れる技術がプロンプトエンジニアリングです。明確で具体的な指示を書く、十分なコンテキストを与える、複雑なタスクをより単純なサブタスクに分解する、モデルに考える時間を与える（Chain-of-Thoughtなど）、といった基本テクニックはHuyenの著書でも整理されています。
            </p>
            <p>
              一方で2025年半ば、Karpathyは「プロンプトエンジニアリング」よりも「コンテキストエンジニアリング（Context
              Engineering）」という言葉を好むと発信し、大きな反響を呼びました。彼の説明では、日常会話でのプロンプトは短いタスク説明を指すことが多いのに対し、実務レベルのLLMアプリケーションでは、次のステップのために「コンテキストウィンドウに適切な情報だけを詰め込む、繊細な技術と科学」が必要になるとされています。ShopifyのCEOであるTobi
              Lütkeも同様に、タスクをLLMが解決可能な形にするためにすべての文脈を提供する技術だと表現しており、この用語は業界に急速に定着しました。
            </p>
          </div>

          <div className={styles.diagramCard}>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots-3" />
              図: コンテキストウィンドウの構成要素
            </div>
            <div className={styles.mermaidWrapper} id="wrap-context" data-testid="mermaid-diagram">
              <MermaidDiagram
                chart={DIAGRAM_CONTEXT}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
              />
            </div>
          </div>

          <div className={styles.prose}>
            <p>
              つまりプロンプトエンジニアリングはコンテキストエンジニアリングの一部です。単発の質問応答であればプロンプト文言の工夫だけで十分ですが、複数ターンにわたるエージェントや、検索結果・ツール出力・会話履歴を組み合わせるアプリケーションでは、「何をコンテキストウィンドウに入れて、何を入れないか」を設計する視点が不可欠になります。
            </p>
          </div>
        </section>

        {/* ============ 7 ============ */}
        <section className={styles.chapter} id="sec-7">
          <div className={styles.chapterKicker}>
            <i className="ti ti-checklist" />
            SECTION 7 · STEP 3
          </div>
          <h2 id="sec-7-title">評価（Evaluation）を設計する</h2>
          <div className={styles.prose}>
            <p>
              Huyenは、AIの利用が広がるほど致命的な失敗の機会も増えるため、評価がAIエンジニアリングの中でも特に重要になると述べています。評価には複数のアプローチがあります。
            </p>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>評価手法</th>
                  <th>概要</th>
                  <th>向いている場面</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    厳密評価
                    <br />
                    (Exact Evaluation)
                  </td>
                  <td>機能的正しさや参照データとの類似度を機械的に測定</td>
                  <td>コード生成、構造化出力など正解が明確なタスク</td>
                </tr>
                <tr>
                  <td>埋め込みベースの類似度評価</td>
                  <td>出力と参照回答の意味的な近さをベクトル距離で測定</td>
                  <td>要約や言い換えなど表現の自由度が高いタスク</td>
                </tr>
                <tr>
                  <td>
                    AI as a Judge
                    <br />
                    (LLM-as-a-judge)
                  </td>
                  <td>別のLLMに出力を採点・比較させる</td>
                  <td>オープンエンドな生成、大規模な自動評価が必要な場面</td>
                </tr>
                <tr>
                  <td>
                    比較評価
                    <br />
                    (Comparative Evaluation)
                  </td>
                  <td>複数モデル・複数プロンプトの出力を相対的にランキングする</td>
                  <td>モデル選定、プロンプトのA/Bテスト</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.prose}>
            <p>
              LLM-as-a-judgeは人手評価に比べて大幅に低コスト・高速に評価をスケールできる一方、既知のバイアスがあります。これらを体系的に測定した代表的な一次研究がZheng
              et al., &quot;Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena&quot;（NeurIPS
              2023 Datasets and Benchmarks,{" "}
              <a href="https://arxiv.org/abs/2306.05685" target="_blank" rel="noopener noreferrer">
                arXiv:2306.05685
              </a>
              ）で、同論文は ①提示順序を入れ替えると判定が変わる
              <strong>位置バイアス（position bias）</strong>
              、②長い出力を過大評価する
              <strong>冗長性バイアス（verbosity bias）</strong>
              の2つを、実験によって定量的に報告しています。さらに
              ③判定側が自分自身の生成した応答を優遇する
              <strong>自己贔屓バイアス（self-enhancement bias）</strong>
              にも言及していますが、こちらは一部の判定モデルで自己生成応答を優遇する例が観察されたという
              <strong>限られたデータに基づく予備的な結果</strong>
              であり、バイアスの有無を確定できるものではないと同論文自身が断っています。
            </p>
            <p>
              ただし、これらのバイアスの大きさは
              <strong>タスクの種類・判定に使うモデル・プロンプトの書き方によって変動する</strong>
              ため、論文の数値をそのまま自社システムに当てはめることはできません。自動評価だけに依存せず、人間によるスポットチェックと組み合わせ、自社データで判定器そのものを検証することが推奨されます。
            </p>
            <p>
              AI評価の専門家であるHamel
              Husainは、多くのチームが評価に取り組む際、いきなり汎用的な自動指標やダッシュボードを整えようとして失敗すると指摘しています。彼は、実際のプロダクトのアウトプットを人間が丁寧に読み込む「エラー分析」から始め、そこで見つかった具体的な失敗パターンをもとに評価基準を作るべきだと主張しています。この考え方は「まずデータを見る」というデータサイエンスの基本に立ち返るものとして、AI評価コミュニティで広く支持されています。
            </p>
          </div>

          <div className={styles.diagramCard}>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots-3" />
              図: 評価パイプラインの継続的改善ループ
            </div>
            <div className={styles.mermaidWrapper} id="wrap-evalloop" data-testid="mermaid-diagram">
              <MermaidDiagram
                chart={DIAGRAM_EVALLOOP}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
              />
            </div>
          </div>
        </section>

        {/* ============ 8 ============ */}
        <section className={styles.chapter} id="sec-8">
          <div className={styles.chapterKicker}>
            <i className="ti ti-database-search" />
            SECTION 8 · STEP 4
          </div>
          <h2 id="sec-8-title">RAG（検索拡張生成）で外部知識を活用する</h2>
          <div className={styles.prose}>
            <p>
              RAG（Retrieval-Augmented
              Generation）は、モデルの学習データにない私的な情報や最新情報をもとに回答させるための最も基本的で広く使われている手法です。単純なベクトル検索だけの「素朴なRAG（Naive
              RAG）」は本番環境で検索精度が不足しやすく、誤った文書に基づく回答が相当な割合で発生すると各所で報告されています（ベンダーやコミュニティの解説記事では「4割前後」といった数字も挙げられますが、評価条件や対象コーパスが明示されない報告例が多く、一次ベンチマークとして扱うべきではありません）。重要なのは数値そのものではなく、
              <strong>
                自社のコーパスと実際の質問セットで検索の Recall / Precision
                を測り、そこを起点に改善する
              </strong>
              という進め方です。
            </p>
          </div>

          <div className={styles.diagramCard}>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots-3" />
              図: RAGの基本アーキテクチャ
            </div>
            <div className={styles.mermaidWrapper} id="wrap-rag" data-testid="mermaid-diagram">
              <MermaidDiagram
                chart={DIAGRAM_RAG}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
              />
            </div>
          </div>

          <div className={styles.prose}>
            <p>2026年時点でよく整理されているRAGの発展形は以下の通りです。</p>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>種類</th>
                  <th>特徴</th>
                  <th>適した場面</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Naive RAG</td>
                  <td>ベクトル検索のみで上位k件を取得して渡す</td>
                  <td>プロトタイプ・単一文書内で答えが完結する質問</td>
                </tr>
                <tr>
                  <td>Advanced RAG</td>
                  <td>ハイブリッド検索（密ベクトル＋BM25）＋リランカー＋クエリ変換</td>
                  <td>2〜3件の文書を横断する質問</td>
                </tr>
                <tr>
                  <td>GraphRAG</td>
                  <td>知識グラフを用い、エンティティ間の関係性をたどって検索する</td>
                  <td>関係性を問う質問（人物間のつながり等）</td>
                </tr>
                <tr>
                  <td>Agentic RAG</td>
                  <td>エージェントが検索の要否・検索対象・粒度を自律的に判断する</td>
                  <td>複数ステップの推論が必要な複雑な質問</td>
                </tr>
                <tr>
                  <td>Adaptive RAG</td>
                  <td>クエリの複雑さに応じて上記のパイプラインを動的に切り替える</td>
                  <td>質問の種類が多岐にわたる汎用アシスタント</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.prose}>
            <p>
              チャンク分割については、300〜500トークン程度・10〜15%程度のオーバーラップを持たせる再帰的チャンキングが「まず試す初期値の例」として広く紹介されています（多くのユースケースをこれでカバーできるという解説もありますが、公開された統一ベンチマークに基づく数字ではありません）。実務では、この初期値のまま固定せず、代表的な質問と正解文書のペアを50〜100件用意して
              Recall@k
              などを実測し、結果に応じてチャンクサイズ・オーバーラップ・分割単位（見出し単位／文単位）を調整してください。またチャンクには元文書名・見出し・親チャンクIDなどのメタデータを必ず付与し、引用や階層的な検索を可能にすることが推奨されています。
            </p>
            <p>
              なお、Gemini
              2.5やGPT-4.1のように100万トークン級の長いコンテキストウィンドウを持つモデルが普及したことで、「知識ベース全体をそのままコンテキストに入れる（フルコンテキスト方式）」という選択肢が現実的になりました。フルコンテキスト方式とRAGのどちらを採るかは、
              <strong>
                知識ベースの総トークン数・コスト・プロンプトキャッシュの利用可否・モデルのコンテキスト長・検索品質
              </strong>
              を見て決めるべきで、どちらかが常に既定というわけではありません。どの程度の規模までフルコンテキスト方式が現実的かは、対象モデルの入力トークン上限、1リクエストあたりに確保したい出力トークン予算、許容できるコストとレイテンシによって変わるため、固定的な閾値はありません。知識ベース全体が対象モデルの入力上限に無理なく収まり更新頻度も低いのであれば、検索パイプラインを持たないフルコンテキスト方式のほうが構成が単純で、検索漏れが原理的に起きないという利点があります。ただし検索漏れが起きないことは回答精度を保証しません。長いコンテキストでは中間に埋もれた情報の再現率が落ちる現象（lost
              in the
              middle）が知られており、文脈が長くなるほど品質が下がることもあります。したがって方式の選択は思い込みではなく、自社の代表的な質問セットを用いて実測したうえで決めてください。その際、検索の指標は両方式で意味が異なる点に注意が必要です。RAGでは検索器が正解文書を上位k件に含められたかを
              Recall@k
              で測定しますが、フルコンテキスト方式には検索段階そのものが存在しないため、代わりに「正解情報がそもそも入力コンテキストに含まれていたか」という入力被覆率を測定します。そのうえで、両方式の回答品質・コスト・レイテンシを横並びで比較してください。知識ベースが入力上限を大きく超える、リクエストごとに長大なコンテキストを送るコスト・レイテンシが見合わない、といった条件ではRAGが有利になります。
            </p>
          </div>
        </section>

        {/* ============ 9 ============ */}
        <section className={styles.chapter} id="sec-9">
          <div className={styles.chapterKicker}>
            <i className="ti ti-robot" />
            SECTION 9 · STEP 5
          </div>
          <h2 id="sec-9-title">AIエージェントを構築する</h2>
          <div className={styles.prose}>
            <p>
              「エージェント」という言葉は文脈によって定義が揺れやすい用語ですが、Anthropicはブログ記事「Building
              Effective Agents」の中で、開発者があらかじめ経路を決める
              <strong>ワークフロー</strong>
              と、LLM自身が次に取るべき行動を動的に決定する
              <strong>エージェント</strong>
              を明確に区別しています。
            </p>
          </div>

          <div className={styles.diagramCard}>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots-3" />
              図: ワークフロー vs エージェント
            </div>
            <div
              className={styles.mermaidWrapper}
              id="wrap-workflow-agent"
              data-testid="mermaid-diagram"
            >
              <MermaidDiagram
                chart={DIAGRAM_WORKFLOW_AGENT}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
              />
            </div>
          </div>

          <div className={styles.prose}>
            <p>
              Anthropicは、LLMアプリケーションを構築する際にはまず最もシンプルな解決策を探すべきであり、複雑さは本当に必要な場合にのみ追加すべきだと明言しています。エージェント的な仕組みは柔軟性と引き換えにレイテンシとコストが増加するため、その代表的な構成要素として次のようなワークフローパターンが紹介されています。
            </p>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>パターン名</th>
                  <th>概要</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>プロンプトチェイニング</td>
                  <td>
                    タスクを複数の逐次的なLLM呼び出しに分割し、各段階でプログラム的なチェックを挟む
                  </td>
                </tr>
                <tr>
                  <td>ルーティング</td>
                  <td>入力内容を分類し、専用のプロンプトやモデルに振り分ける</td>
                </tr>
                <tr>
                  <td>並列化</td>
                  <td>複数のLLM呼び出しを同時に実行し、結果を集約する（投票や分業）</td>
                </tr>
                <tr>
                  <td>オーケストレーター・ワーカー</td>
                  <td>中心となるLLMがタスクを動的に分解し、複数のワーカーLLMに割り振る</td>
                </tr>
                <tr>
                  <td>
                    評価者・最適化者
                    <br />
                    (Evaluator-Optimizer)
                  </td>
                  <td>一方のLLMが生成し、もう一方が評価とフィードバックを行うループを繰り返す</td>
                </tr>
                <tr>
                  <td>自律エージェント</td>
                  <td>環境からのフィードバックをもとに、LLMがツール利用のループを自律的に回す</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.prose}>
            <p>
              Anthropicは、フレームワークを使う場合でも、内部で何が起きているかを正確に理解しておくべきだと強調しています。抽象化レイヤーの裏側の挙動を誤解していることが、実務でのトラブルの一般的な原因になるためです。
            </p>
          </div>
        </section>

        {/* ============ 10 ============ */}
        <section className={styles.chapter} id="sec-10">
          <div className={styles.chapterKicker}>
            <i className="ti ti-plug" />
            SECTION 10 · STEP 6
          </div>
          <h2 id="sec-10-title">Model Context Protocol（MCP）でツールを繋ぐ</h2>
          <div className={styles.prose}>
            <p>
              エージェントが実際に価値を発揮するには、外部のデータやツールに接続できる必要があります。この接続を標準化するためにAnthropicが2024年11月に公開したオープン規格が
              <strong>Model Context Protocol（MCP）</strong>
              です。
            </p>
          </div>

          <div className={styles.diagramCard}>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots-3" />
              図: MCPのホスト・クライアント・サーバー構成
            </div>
            <div className={styles.mermaidWrapper} id="wrap-mcp" data-testid="mermaid-diagram">
              <MermaidDiagram
                chart={DIAGRAM_MCP}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
              />
            </div>
          </div>

          <div className={styles.prose}>
            <p>
              MCPが登場する以前は、AIをそれぞれの外部サービスに接続するために毎回個別の統合コードを書く必要がありました。MCPは、クライアント（AIアプリ側）とサーバー（ツール側）の間の双方向のやり取り——ツールの一覧取得と呼び出し、リソースやプロンプトの提供、サーバーからクライアントへのサンプリング要求や通知——を単一のプロトコルとして定義しています。ツール側がMCPサーバーとして機能を公開しておけば、MCPに対応したクライアントは、認証・権限付与・トランスポート設定といった接続条件を満たしたうえで、その機能を共通の方法で利用できます。サービスごとに個別の統合コードを書き直す必要がなくなる点が評価されています。
            </p>
            <p>
              2026年時点でMCPは急速に業界標準化が進んでいます。普及規模については、2025年12月9日のMCP公式（Anthropic）による発表が、月間SDKダウンロード数9,700万超・
              <strong>アクティブなMCPサーバー</strong>
              1万超という数字を示しています（いずれも同発表時点の値であり、測定方法は公表元の定義に依存します）。同じく2025年12月9日にAnthropicがMCPをLinux
              Foundation傘下の新団体「Agentic AI
              Foundation（AAIF）」に寄贈し、Block・OpenAIが共同創設メンバーとして、AWS・Google・Microsoft・Cloudflareなどがプラチナメンバーとして参加したことで、単一企業の技術から業界横断のオープンスタンダードへと移行しました。ChatGPT・Cursor・Gemini・Microsoft
              Copilot・VS Codeなど主要なAI開発ツールがMCPをサポートしています。
            </p>
            <p>
              一方で、急速な普及によってセキュリティの検証が追いついていない領域もあり、2025〜2026年にかけて
              <strong>
                個々のMCPサーバー実装（特定のプロダクト・特定バージョン）における脆弱性
              </strong>
              が複数報告されています。これらはMCPというプロトコル仕様そのものの欠陥ではなく、あくまで実装側の問題として報告されたものです。導入するMCPサーバーを選定する際は、対象実装ごとにCVE/GHSAなどのアドバイザリと修正版の有無を個別に確認してください。エンタープライズ導入では、まず読み取り専用の連携（レポート閲覧・ナレッジ検索など）から始め、書き込みを伴う操作（CRMの更新や送信など）には人間の承認ステップを挟むという段階的な導入が推奨されています。
            </p>
          </div>
        </section>

        {/* ============ 11 ============ */}
        <section className={styles.chapter} id="sec-11">
          <div className={styles.chapterKicker}>
            <i className="ti ti-adjustments" />
            SECTION 11 · STEP 7
          </div>
          <h2 id="sec-11-title">Fine-tuningが必要になる場面</h2>
          <div className={styles.prose}>
            <p>
              Fine-tuning（追加学習）はAIエンジニアリングの中でもコストと専門性の要求が高い手法であり、Huyenの著書でも「まず本当に必要かどうかを見極める」ことが強調されています。次の判断フローは、Huyenのアプリケーション開発層優先の考え方と、Anthropicの「複雑さは必要な場合にのみ追加する」という指針を統合したものです。
            </p>
          </div>

          <div className={styles.diagramCard}>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots-3" />
              図: Fine-tuning要否の判断フロー
            </div>
            <div className={styles.mermaidWrapper} id="wrap-finetune" data-testid="mermaid-diagram">
              <MermaidDiagram
                chart={DIAGRAM_FINETUNE}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
              />
            </div>
          </div>

          <div className={styles.prose}>
            <p>
              Fine-tuningを検討する際は、LoRAなどのパラメータ効率的ファインチューニング（PEFT）技術を使うことでメモリと計算コストを抑えられます。また、RAGとFine-tuningは競合する手法ではなく、「知識の注入」はRAGで、「振る舞い・形式の調整」はFine-tuningで、と役割分担して併用されるケースも一般的です。
            </p>
          </div>
        </section>

        {/* ============ 12 ============ */}
        <section className={styles.chapter} id="sec-12">
          <div className={styles.chapterKicker}>
            <i className="ti ti-gauge" />
            SECTION 12 · STEP 8
          </div>
          <h2 id="sec-12-title">推論最適化とコスト・レイテンシ管理</h2>
          <div className={styles.prose}>
            <p>
              モデルを選んで動かし始めると、次に直面するのがコストとレイテンシの最適化です。代表的な指標と手法は次の通りです。
            </p>
            <ul>
              <li>
                <strong>推論パフォーマンス指標</strong>
                ：初回トークンまでの時間（TTFT）、トークン生成速度、スループットなどをモニタリングします。
              </li>
              <li>
                <strong>量子化（Quantization）</strong>
                ：モデルの重みを低精度で表現し、メモリ使用量と推論速度を改善します。モデルの層ごとに異なる量子化戦略を組み合わせ、ベンチマーク品質を保ちながらスループットを改善できたという報告例もあります（改善幅はモデル・ハードウェア・バッチ設定に依存するため、自環境でのベンチマークが必須です）。
              </li>
              <li>
                <strong>モデルルーティング</strong>
                ：簡単なタスクは軽量・低コストなモデルに、難しいタスクは高性能モデルに振り分けるゲートウェイを導入し、コストと品質のバランスを取ります。
              </li>
              <li>
                <strong>キャッシュ</strong>
                ：頻出する質問や共通のプロンプトプレフィックスをキャッシュし、レイテンシとコストを削減します。
              </li>
            </ul>
            <p>
              なお、ここで挙げたルーティングやキャッシュを「段階的な拡張ステップ」としてまとめた整理をAnthropicに帰属させている解説を見かけますが、Anthropicの一次資料である「Building
              Effective Agents」が実際に扱っているのは、検索・ツール・メモリを付加した
              <strong>拡張LLM（augmented LLM）</strong>
              を基本構成要素とし、そこからプロンプトチェイニング・ルーティング・並列化・オーケストレーター-ワーカー・評価者-最適化者といったワークフローパターン、さらに自律的なエージェントへと段階的に複雑さを上げていく、という設計指針までです（モデルゲートウェイや推論キャッシュの導入手順は同記事の対象外です）。上記のルーティング・キャッシュ・量子化は業界一般の推論最適化手法として捉え、根底にある「まずシンプルに始め、必要な場合にのみ複雑さを足す」という原則のみをAnthropicの主張として引用してください。
            </p>
          </div>
        </section>

        {/* ============ 13 ============ */}
        <section className={styles.chapter} id="sec-13">
          <div className={styles.chapterKicker}>
            <i className="ti ti-activity-heartbeat" />
            SECTION 13 · STEP 9
          </div>
          <h2 id="sec-13-title">LLMOps：本番運用のオブザーバビリティ</h2>
          <div className={styles.prose}>
            <p>
              LLMを使ったアプリケーションは、従来のソフトウェアと違い「エラーコードを返さずに、もっともらしく誤った回答をする」という特有の失敗モードを持ちます。そのため専用の観測（オブザーバビリティ）基盤が必要になります。2026年時点で広く比較・利用されている主なツールは次の通りです。
            </p>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>LangSmith</td>
                  <td>
                    LangChain/LangGraphとの統合が深く、トレース可視化とアノテーションキューが強力。LangChain中心のチームに向く
                  </td>
                </tr>
                <tr>
                  <td>Langfuse</td>
                  <td>
                    コアがMITライセンスのオープンソースで、セルフホストすればトレースを自社インフラ内で管理しやすい（テレメトリ・保持期間・バックアップは運用者側の管理責任。データ保持ポリシー等の一部機能はEnterprise
                    Editionが必要）。トレーシングとプロンプトのバージョン管理を両立
                  </td>
                </tr>
                <tr>
                  <td>Arize Phoenix</td>
                  <td>
                    RAGのデバッグや大規模なML計測に強く、エンタープライズのML運用と親和性が高い
                  </td>
                </tr>
                <tr>
                  <td>Helicone / Portkey</td>
                  <td>プロキシ型でコスト・ルーティングの可視化を素早く導入できる</td>
                </tr>
                <tr>
                  <td>Datadog LLM Observability</td>
                  <td>既存のDatadog導入企業向けに、インフラ監視とLLM監視を一体運用できる</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.prose}>
            <p>
              一般的な推奨構成としては、リクエストごとにLLM呼び出し・検索ステップ・ツール呼び出し・エージェントの意思決定分岐までを追跡する分散トレーシングを導入し、レイテンシやコストといった定量指標に加えて、忠実性（Faithfulness）や有害性などの品質指標をLLM-as-a-judgeや人間のフィードバックで継続的に測定する、という2層構成が挙げられています。これは従来のAPM（アプリケーションパフォーマンス監視）だけでは「意味的に間違っている」出力を検知できないためです。
            </p>
            <p>
              ただしトレースと監査ログは、プロンプト・検索結果・ツール引数といった「本来ログに残すべきでないデータ」がそのまま蓄積されやすい場所でもあるため、機密データの取り扱い方針を設計時点で決めておく必要があります。
            </p>
            <ul>
              <li>
                <strong>記録内容のマスキング／許可リスト化</strong>
                ：ユーザー入力・取得文書・ツール引数に含まれるPII（氏名、メールアドレス、電話番号、住所など）や秘密情報は、記録前にマスキングするか、記録してよいフィールドだけを列挙する許可リスト方式にする。全文をそのまま保存する既定設定を無批判に使わない
              </li>
              <li>
                <strong>認証情報を記録しない</strong>：<code>Authorization</code> ヘッダー、
                <code>Cookie</code>
                、APIキー、アクセストークンはトレース・監査ログのいずれにも記録しない。SDKやプロキシ型ツールが既定でヘッダー全体を送信する場合は、除外設定を明示的に入れる
              </li>
              <li>
                <strong>アクセス制御</strong>
                ：トレース閲覧権限はロールベースで最小権限に絞り、誰がいつ閲覧したかを別途監査可能にする。本番のトレースを開発環境や外部SaaSへ無制限に複製しない
              </li>
              <li>
                <strong>保持期間と削除手段</strong>
                ：トレース・監査ログごとに保持期間を定め、期限到来時に自動削除されるようにする。あわせて、削除請求（GDPRの消去権など）に応じて特定ユーザーのレコードを検索・削除できる手段をあらかじめ用意しておく。削除対象はログだけではない。原文書の削除・アクセス権限の変更・保持期限の到来時には、そこから派生したデータ——検索チャンク（インデックスと埋め込み）、保存済みプロンプト、生成された回答、評価用トレース——までを対象に、一括で無効化または削除する。訴訟ホールド（リーガルホールド）等で削除を保留する場合は、保留の理由・対象範囲・解除条件を記録し、期限のない例外として放置しない
              </li>
            </ul>
          </div>
        </section>

        {/* ============ 14 ============ */}
        <section className={styles.chapter} id="sec-14">
          <div className={styles.chapterKicker}>
            <i className="ti ti-shield" />
            SECTION 14
          </div>
          <h2 id="sec-14-title">セキュリティと安全性</h2>
          <div className={styles.prose}>
            <p>
              Django共同開発者であり、&quot;prompt
              injection&quot;という用語を広めたことで知られるSimon
              Willison（同語はhimbodhisattvaによる先行使用も指摘されています）は、AIエージェントが持つ本質的なリスクを「
              <strong>Lethal Trifecta（致死の三要素）</strong>
              」という概念で説明しています。これは、(1) 私的なデータへのアクセスを持つこと、(2)
              信頼できないコンテンツにさらされること（プロンプトインジェクションの入口）、(3)
              外部へ通信できる能力を持つこと（データを持ち出せる経路）、という3条件が同時に揃ったときに、攻撃者が機密データを外部へ流出させられるという枠組みです。自律性や影響のある操作の可否はリスクを増幅させますが、この三要素の定義には含まれません。Willisonは、LLMは指示に従うようにできているがゆえに「本質的に騙されやすい」性質を持ち、これは修正すべきバグではなくLLMという技術の特性そのものだと述べ、エージェントを実行する際にはサンドボックス化などで行動範囲を制限することを推奨しています。
            </p>
            <p>AIエンジニアリングにおける実務的なセキュリティ対策は以下の通りです。</p>
            <ul>
              <li>
                <strong>防御的プロンプト設計</strong>
                ：システムプロンプトの漏えい対策や、ユーザー入力とシステム指示を明確に分離する。
              </li>
              <li>
                <strong>ガードレール</strong>
                ：出力内容のフィルタリング、危険なツール呼び出しの検知、機密操作前の人間による承認ステップの導入。
              </li>
              <li>
                <strong>最小権限の原則</strong>
                ：エージェントやMCPサーバーに与えるツールの権限を必要最小限に絞る。
              </li>
              <li>
                <strong>監査ログ</strong>
                ：誰が・いつ・どのツールを・どういう入力で呼び出したかを追跡できるようにする。
              </li>
            </ul>
          </div>
        </section>

        {/* ============ 15 ============ */}
        <section className={styles.chapter} id="sec-15">
          <div className={styles.chapterKicker}>
            <i className="ti ti-route" />
            SECTION 15
          </div>
          <h2 id="sec-15-title">AIエンジニアになるためのロードマップ</h2>
          <div className={styles.prose}>
            <p>
              2026年時点で複数の教育系メディアが紹介しているAIエンジニア育成ロードマップを統合すると、おおむね次のような順序が共通して推奨されています。
            </p>
          </div>

          <div className={styles.diagramCard}>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots-3" />
              図: 学習ロードマップ
            </div>
            <div className={styles.mermaidWrapper} id="wrap-roadmap" data-testid="mermaid-diagram">
              <MermaidDiagram
                chart={DIAGRAM_ROADMAP}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
              />
            </div>
          </div>

          <div className={styles.prose}>
            <p>
              いくつかのロードマップ記事では、この過程をおおむね8〜12ヶ月程度で踏破できる目安として紹介していますが、実際の期間は既存のプログラミング経験や学習に割ける時間によって大きく変わります。共通して強調されている点は次の3つです。
            </p>
            <ul>
              <li>
                最新のモデルやフレームワークを追いかける前に、Python・Git・ソフトウェア工学の基礎を固めること。
              </li>
              <li>
                学習の早い段階から「評価」を意識し、成功の定義を先に決めてから開発を始めること。
              </li>
              <li>
                学位や資格よりも、実際にデプロイされ動いているプロジェクトのポートフォリオが評価されやすいこと。
              </li>
            </ul>
          </div>
        </section>

        {/* ============ 16 ============ */}
        <section className={styles.chapter} id="sec-16">
          <div className={styles.chapterKicker}>
            <i className="ti ti-flag" />
            SECTION 16
          </div>
          <h2 id="sec-16-title">まとめ</h2>
          <div className={styles.prose}>
            <p>
              AI
              Engineeringは、基盤モデルという強力な「素材」を、プロンプト・コンテキスト・評価・RAG・エージェント・MCP・Fine-tuning・推論最適化・LLMOpsという一連の工学的なレイヤーを通じて、実際に信頼できる製品へと組み上げていく実践的な分野です。Chip
              Huyenが示す「まずアプリケーション開発層で解決できないかを考え、必要な場合にのみモデル開発層・インフラ層に踏み込む」という指針と、Anthropicが示す「複雑さは必要な場合にのみ追加する」という指針は共通しており、これはこの分野全体を貫く基本姿勢だと言えます。
            </p>
            <p>
              同時に、Karpathyが指摘する「ジャギー・インテリジェンス」やWillisonが指摘する「Lethal
              Trifecta」が示すように、LLMは強力である一方で予測しづらく騙されやすい性質を持つ技術でもあります。だからこそ、評価とセキュリティ設計を後回しにせず、最初から開発プロセスに組み込むことが、AIエンジニアとして製品を安全に届けるための鍵になります。
            </p>
          </div>
        </section>

        {/* ============ 17 ============ */}
        <section className={styles.chapter} id="sec-17">
          <div className={styles.chapterKicker}>
            <i className="ti ti-books" />
            SECTION 17
          </div>
          <h2 id="sec-17-title">参考文献・出典</h2>
          <div className={styles.prose}>
            <p>本ガイドの作成にあたり、2026年9月9日時点で参照した主な情報源は以下の通りです。</p>
          </div>

          <div className={styles.refGroup}>
            <h3 id="ref-books">
              <i className="ti ti-book-2" />
              基盤となる書籍
            </h3>
            <ul className={styles.refList}>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    Chip Huyen, &quot;AI Engineering&quot;（O&apos;Reilly, 2024年12月）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://www.oreilly.com/library/view/ai-engineering/9781098166298/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.oreilly.com/library/view/ai-engineering/9781098166298/
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    Gergely Orosz &amp; Chip Huyen, &quot;The AI Engineering Stack&quot;（The
                    Pragmatic Engineer）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://newsletter.pragmaticengineer.com/p/the-ai-engineering-stack"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://newsletter.pragmaticengineer.com/p/the-ai-engineering-stack
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3 id="ref-karpathy">
              <i className="ti ti-brain" />
              ソフトウェアの世代交代とコンテキストエンジニアリング（Andrej Karpathy）
            </h3>
            <ul className={styles.refList}>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;Andrej Karpathy on Software 3.0: Software in the Age of AI&quot;（Latent
                    Space）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://www.latent.space/p/s3"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.latent.space/p/s3
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;Talk: Andrej Karpathy: Software Is Changing (Again)&quot;（ikyle.me）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://ikyle.me/blog/2025/andrej-karpathy-software-is-changing-again"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://ikyle.me/blog/2025/andrej-karpathy-software-is-changing-again
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    Andrej Karpathy, X（旧Twitter）投稿「コンテキストエンジニアリング」について
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://x.com/karpathy/status/1937902205765607626"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://x.com/karpathy/status/1937902205765607626
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;Context Engineering Vs Prompt Engineering: The Real
                    Difference&quot;（NextAgile）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://nextagile.ai/blogs/gen-ai/context-engineering-vs-prompt-engineering/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://nextagile.ai/blogs/gen-ai/context-engineering-vs-prompt-engineering/
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3 id="ref-swyx">
              <i className="ti ti-users" />
              AI Engineerという職種の起源（swyx / Latent Space）
            </h3>
            <ul className={styles.refList}>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    swyxプロフィール（AI Engineerカンファレンス）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://ai.engineer/speakers/swyx"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://ai.engineer/speakers/swyx
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>Latent Space About ページ</span>
                  <a
                    className={styles.refUrl}
                    href="https://www.latent.space/about"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.latent.space/about
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3 id="ref-anthropic">
              <i className="ti ti-robot" />
              エージェントとワークフロー（Anthropic）
            </h3>
            <ul className={styles.refList}>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    Anthropic, &quot;Building Effective Agents&quot;
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://www.anthropic.com/engineering/building-effective-agents"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.anthropic.com/engineering/building-effective-agents
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3 id="ref-evals">
              <i className="ti ti-checklist" />
              評価（LLM-as-a-judge・Hamel Husain）
            </h3>
            <ul className={styles.refList}>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    Lianmin Zheng et al., &quot;Judging LLM-as-a-Judge with MT-Bench and Chatbot
                    Arena&quot;（NeurIPS 2023 Datasets and Benchmarks Track）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://arxiv.org/abs/2306.05685"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://arxiv.org/abs/2306.05685
                  </a>
                  <span className={styles.refNote}>
                    ※位置バイアス・冗長性バイアス・自己贔屓バイアスの一次出典
                  </span>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    Hamel Husain, &quot;AI Evals: Everything You Need to Know&quot;
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://hamel.dev/blog/posts/evals-faq/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://hamel.dev/blog/posts/evals-faq/
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    Hamel Husain &amp; Shreya Shankar, &quot;Evals Skills for Coding Agents&quot;
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://hamel.dev/blog/posts/evals-skills/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://hamel.dev/blog/posts/evals-skills/
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;LLM as a Judge: A 2026 Guide to Automated Model Assessment&quot;（Label
                    Your Data）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://labelyourdata.com/articles/llm-as-a-judge"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://labelyourdata.com/articles/llm-as-a-judge
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3 id="ref-security">
              <i className="ti ti-shield" />
              セキュリティ（Simon Willison）
            </h3>
            <ul className={styles.refList}>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;Simon Willison on Agentic Engineering: TDD, Prompt Injection, and the
                    Lethal Trifecta&quot;（Agent Wars）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://agent-wars.com/news/2026-03-14-simon-willison-agentic-engineering-tdd-prompt-injection"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://agent-wars.com/news/2026-03-14-simon-willison-agentic-engineering-tdd-prompt-injection
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    Simon Willisonのブログ紹介（tomrochette.com）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://tomrochette.com/agents/simon-willison/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://tomrochette.com/agents/simon-willison/
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3 id="ref-mcp">
              <i className="ti ti-plug" />
              Model Context Protocol（MCP）
            </h3>
            <ul className={styles.refList}>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>MCP公式サイト（仕様・SDK・サーバー一覧）</span>
                  <a
                    className={styles.refUrl}
                    href="https://modelcontextprotocol.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://modelcontextprotocol.io/
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    Anthropic ニュースルーム（2025年12月9日のAgentic AI
                    Foundation寄贈発表およびエコシステム統計の一次出典）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://www.anthropic.com/news"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.anthropic.com/news
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;The MCP Ecosystem in 2026&quot;（ChatForest）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://chatforest.com/guides/mcp-ecosystem-2026-state-of-the-standard/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://chatforest.com/guides/mcp-ecosystem-2026-state-of-the-standard/
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;MCP in 2026: The Universal Connector for AI Agents&quot;（Raulji
                    Technologies）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://www.rauljitechnologies.com/blog/mcp-model-context-protocol-2026/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.rauljitechnologies.com/blog/mcp-model-context-protocol-2026/
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;MCP Adoption Statistics 2026&quot;（Digital Applied）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3 id="ref-rag">
              <i className="ti ti-database-search" />
              RAG
            </h3>
            <ul className={styles.refList}>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;RAG Architecture Guide 2026&quot;（jobsbyculture.com）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://jobsbyculture.com/blog/rag-architecture-guide-2026"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://jobsbyculture.com/blog/rag-architecture-guide-2026
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;RAG Production Guide 2026&quot;（Lushbinary）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;RAG Techniques Compared: A Practical Guide to Retrieval Augmented
                    Generation in 2026&quot;（Starmorph）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://blog.starmorph.com/blog/rag-techniques-compared-best-practices-guide"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://blog.starmorph.com/blog/rag-techniques-compared-best-practices-guide
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3 id="ref-llmops">
              <i className="ti ti-activity-heartbeat" />
              LLMOps・オブザーバビリティ
            </h3>
            <ul className={styles.refList}>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;Top LLM Observability Tools in 2026: A Pro Guide&quot;（MLflow）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://mlflow.org/articles/top-llm-observability-tools-in-2026-a-pro-guide/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://mlflow.org/articles/top-llm-observability-tools-in-2026-a-pro-guide/
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;Best LLM Observability Tools of 2026&quot;（Firecrawl）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://www.firecrawl.dev/blog/best-llm-observability-tools"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.firecrawl.dev/blog/best-llm-observability-tools
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3 id="ref-roadmap">
              <i className="ti ti-route" />
              キャリアロードマップ
            </h3>
            <ul className={styles.refList}>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;How to Become an AI Engineer in 2026 (A Complete
                    Roadmap)&quot;（Dataquest）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://www.dataquest.io/blog/ai-engineer-roadmap/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.dataquest.io/blog/ai-engineer-roadmap/
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;AI Engineer Roadmap 2026: From LLM APIs to Production&quot;（dataskew.io）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://dataskew.io/roadmaps/ai-engineering/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://dataskew.io/roadmaps/ai-engineering/
                  </a>
                </span>
              </li>
              <li className={styles.refItem}>
                <i className="ti ti-external-link" />
                <span>
                  <span className={styles.refTitle}>
                    &quot;How to Become an AI Engineer in 2026: A Self-Study
                    Roadmap&quot;（KDnuggets）
                  </span>
                  <a
                    className={styles.refUrl}
                    href="https://www.kdnuggets.com/how-to-become-an-ai-engineer-in-2026-a-self-study-roadmap"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.kdnuggets.com/how-to-become-an-ai-engineer-in-2026-a-self-study-roadmap
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.prose}>
            <div className={styles.callout} data-variant="warn" data-testid="callout">
              <strong>⚠️ ご注意：</strong>
              AI分野の情報は非常に速く更新されます。特にツールの比較表やロードマップの期間感、MCPのエコシステム統計などは執筆時点（2026年9月9日）のスナップショットです。実践に移す前に、必ず一次情報（各社公式ドキュメントやブログ）を直接確認してください。
            </div>
          </div>
        </section>

        <footer className={styles.pageFooter}>
          AI Engineering 入門ガイド &middot; 情報基準日 2026年9月9日 &middot;
          出典はセクション17に集約して記載（一部は本文中にも記載）
        </footer>
      </main>

      <TocObserver />
    </div>
  );
}
