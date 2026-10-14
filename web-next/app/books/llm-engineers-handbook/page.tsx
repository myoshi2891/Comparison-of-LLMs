import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "「LLM Engineer's Handbook」徹底解説ガイド ― 初学者のためのステップバイステップ入門",
  description:
    "Paul Iusztin、Maxime Labonne 著『LLM Engineer's Handbook』の全体像、FTIパイプライン、全11章+付録の要点、ハンズオン手順、主要ツール群を体系的に学べる初学者向け完全解説ガイド。",
};

const MERMAID_THEME_VARIABLES = {
  background: "transparent",
  primaryColor: "#f1e9d6",
  primaryTextColor: "#241f18",
  primaryBorderColor: "#33417a",
  lineColor: "#5b5346",
  secondaryColor: "#e6e9f5",
  tertiaryColor: "#f2e3ba",
  fontSize: "16px",
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  edgeLabelBackground: "#fcfbf7",
} as const;

const DIAGRAM_OVERVIEW = `flowchart TB
    A[個人のデジタルデータ LinkedInやMedium GitHub 個人記事など] --> B[データ収集パイプライン Webクローラー]
    B --> C[[MongoDBデータウェアハウス]]
    C --> D[特徴量パイプライン クレンジング チャンク化 埋め込み]
    D --> E[[Qdrantベクトルストア]]
    E --> F[学習パイプライン SFTと選好アライメント]
    F --> G[[モデルレジストリ Hugging Face]]
    E --> H[推論パイプライン RAGとLLM]
    G --> H
    H --> I[LLM Twin 本人らしい文章を生成するAI分身]
    classDef hub fill:#f2e3ba,stroke:#a9781c,stroke-width:2px,color:#3a2900;
    classDef done fill:#dcefe2,stroke:#2f6b4f,stroke-width:2px,color:#0d2417;
    class C,E,G hub
    class I done`;

const DIAGRAM_FTI = `flowchart TB
    A[生データ] --> B[特徴量パイプライン]
    B --> C[[特徴量ストア ベクトルDB]]
    C --> D[学習パイプライン]
    D --> E[[モデルレジストリ]]
    C --> F[推論パイプライン]
    E --> F
    F --> G[エンドユーザーへの応答]
    classDef hub fill:#f2e3ba,stroke:#a9781c,stroke-width:2px,color:#3a2900;
    classDef done fill:#dcefe2,stroke:#2f6b4f,stroke-width:2px,color:#0d2417;
    class C,E hub
    class G done`;

const DIAGRAM_CRAWLER = `flowchart TB
    U[各種URLリスト] --> D[ディスパッチャー]
    D --> C1[GitHubクローラー]
    D --> C2[Mediumクローラー]
    D --> C3[カスタム記事クローラー]
    C1 --> W[[MongoDBデータウェアハウス]]
    C2 --> W
    C3 --> W
    W --> CDC[変更データキャプチャ CDC]
    CDC --> NEXT[特徴量パイプラインへ]`;

const DIAGRAM_RAG = `flowchart TB
    A[生データ] --> B[クレンジング]
    B --> C[チャンク分割]
    C --> D[埋め込み生成]
    D --> E[[Qdrantベクトルストア]]
    F[ユーザークエリ] --> G[クエリ拡張とSelf-Querying]
    G --> H[ベクトル検索]
    E --> H
    H --> I[リランキング]
    I --> J[コンテキスト構築]
    J --> K[LLMによる回答生成]`;

const DIAGRAM_ALIGN = `flowchart TB
    A[SFT済みモデル] --> B[選好データセット作成]
    B --> C{アライメント手法}
    C --> D[RLHF 報酬モデルと強化学習]
    C --> E[DPO 選好データから直接最適化]
    D --> F[最終モデル]
    E --> F
    classDef done fill:#dcefe2,stroke:#2f6b4f,stroke-width:2px,color:#0d2417;
    class F done`;

const DIAGRAM_DEPLOY = `flowchart TB
    A[学習済みモデル] --> B[Hugging Face DLCでSageMakerにデプロイ]
    B --> C[SageMaker推論エンドポイント]
    C --> D[FastAPIビジネスマイクロサービス]
    D --> E{デプロイ方式}
    E --> F[オンラインリアルタイム推論]
    E --> G[非同期推論]
    E --> H[オフラインバッチ推論]
    D --> I[Application Auto Scaling]`;

const DIAGRAM_MLOPS = `flowchart TB
    Dev[コード変更とプルリクエスト] --> CI[CIパイプライン Lintとテスト]
    CI --> CD[CDパイプライン ビルドとデプロイ]
    CD --> CT[CTパイプライン 継続的学習トリガー]
    CT --> Mon[プロンプト監視 Opik]
    Mon --> Alert[アラート]
    Alert --> Dev`;

const DIAGRAM_ROADMAP = `flowchart TB
    S1[ステップ1 前提知識の棚卸し Python Docker 基礎的なML用語] --> S2[ステップ2 環境構築 Poetry ZenML Docker]
    S2 --> S3[ステップ3 全体設計の理解 FTIパイプライン]
    S3 --> S4[ステップ4 データ収集とRAGの基礎を実践]
    S4 --> S5[ステップ5 SFTと選好アライメントを実践]
    S5 --> S6[ステップ6 Ragas ARESで評価]
    S6 --> S7[ステップ7 量子化とAdvanced RAGで最適化]
    S7 --> S8[ステップ8 AWS SageMakerとLLMOpsでデプロイ運用]
    S8 --> S9[ステップ9 自分なりのLLM Twinへ改造]
    classDef done fill:#dcefe2,stroke:#2f6b4f,stroke-width:2px,color:#0d2417;
    class S9 done`;

export default function Page() {
  return (
    <div
      className={styles.layout}
      data-testid="layout-root"
      data-page="llm-engineers-handbook"
    >
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.46.0/dist/tabler-icons.min.css"
        integrity="sha384-ND+q1IVc0KDElX60dZaqKc7Xl9cdxd2PpU2JfVUHcurCkFVtVLFdt9vJfxtHSL3p"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.12.0/build/styles/github.min.css"
        integrity="sha384-eFTL69TLRZTkNfYZOLM+G04821K1qZao/4QLJbet1pP4tcF+fdXq/9CdqAbWRl/L"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <button
        type="button"
        className={styles.menuToggle}
        id="menuToggle"
        aria-label="メニューを開く"
        aria-expanded="false"
      >
        <i className="ti ti-menu-2" />
      </button>
      <div className={styles.sidebarScrim} id="scrim" />

      <aside className={styles.sidebar} id="sidebar">
        <div className={styles.sidebarBrand}>
          <div className={styles.bKicker}>Beginner Guide</div>
          <div className={styles.bTitle}>
            LLM Engineer&apos;s
            <br />
            Handbook 解説
          </div>
        </div>
        <nav aria-label="目次" data-testid="sidebar-nav">
          <ul className={styles.sideNav}>
            <li>
              <a
                className={`${styles.sideLink} ${styles.active}`}
                href="#intro"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-bulb" />
                この本は何なのか
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#book-info" data-testid="sidebar-nav-link">
                <i className="ti ti-book-2" />
                書籍情報まとめ
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#authors" data-testid="sidebar-nav-link">
                <i className="ti ti-users" />
                著者について
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#reviews" data-testid="sidebar-nav-link">
                <i className="ti ti-star" />
                なぜ話題になっているのか
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#llm-twin" data-testid="sidebar-nav-link">
                <i className="ti ti-robot" />
                全体像:LLM Twin
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#data-ethics" data-testid="sidebar-nav-link">
                <i className="ti ti-shield-check" />
                データ収集時の注意
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#fti" data-testid="sidebar-nav-link">
                <i className="ti ti-sitemap" />
                FTIパイプライン設計
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#ch-overview" data-testid="sidebar-nav-link">
                <i className="ti ti-list-details" />
                章立て一覧
              </a>
            </li>
            <li>
              <a
                className={`${styles.sideLink} ${styles.sideSub}`}
                href="#ch1"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-map" />
                第1章 概念と設計
              </a>
            </li>
            <li>
              <a
                className={`${styles.sideLink} ${styles.sideSub}`}
                href="#ch2"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-tool" />
                第2章 ツール準備
              </a>
            </li>
            <li>
              <a
                className={`${styles.sideLink} ${styles.sideSub}`}
                href="#ch3"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-database" />
                第3章 データ工学
              </a>
            </li>
            <li>
              <a
                className={`${styles.sideLink} ${styles.sideSub}`}
                href="#ch4"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-search" />
                第4章 RAG特徴量
              </a>
            </li>
            <li>
              <a
                className={`${styles.sideLink} ${styles.sideSub}`}
                href="#ch5"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-adjustments" />
                第5章 SFT
              </a>
            </li>
            <li>
              <a
                className={`${styles.sideLink} ${styles.sideSub}`}
                href="#ch6"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-heart-handshake" />
                第6章 選好整合
              </a>
            </li>
            <li>
              <a
                className={`${styles.sideLink} ${styles.sideSub}`}
                href="#ch7"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-report-analytics" />
                第7章 評価
              </a>
            </li>
            <li>
              <a
                className={`${styles.sideLink} ${styles.sideSub}`}
                href="#ch8"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-bolt" />
                第8章 推論最適化
              </a>
            </li>
            <li>
              <a
                className={`${styles.sideLink} ${styles.sideSub}`}
                href="#ch9"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-filter" />
                第9章 RAG推論
              </a>
            </li>
            <li>
              <a
                className={`${styles.sideLink} ${styles.sideSub}`}
                href="#ch10"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-cloud-upload" />
                第10章 デプロイ
              </a>
            </li>
            <li>
              <a
                className={`${styles.sideLink} ${styles.sideSub}`}
                href="#ch11"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-refresh" />
                第11章 MLOps
              </a>
            </li>
            <li>
              <a
                className={`${styles.sideLink} ${styles.sideSub}`}
                href="#appendix"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-clipboard-list" />
                付録 MLOps原則
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#roadmap" data-testid="sidebar-nav-link">
                <i className="ti ti-route" />
                学習ロードマップ
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#hands-on" data-testid="sidebar-nav-link">
                <i className="ti ti-terminal-2" />
                ハンズオン
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#tools" data-testid="sidebar-nav-link">
                <i className="ti ti-stack-2" />
                主要ツール一覧
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#prerequisites" data-testid="sidebar-nav-link">
                <i className="ti ti-school" />
                前提知識
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#faq" data-testid="sidebar-nav-link">
                <i className="ti ti-help-circle" />
                よくある質問
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#summary" data-testid="sidebar-nav-link">
                <i className="ti ti-flag" />
                まとめ
              </a>
            </li>
            <li>
              <a className={styles.sideLink} href="#references" data-testid="sidebar-nav-link">
                <i className="ti ti-link" />
                参考文献・出典
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.hero}>
          <span className={styles.kicker}>
            <i className="ti ti-sparkles" />
            2026年9月9日時点の調査に基づく解説ガイド
          </span>
          <h1>
            「LLM Engineer&apos;s Handbook」徹底解説
            <br />― 初学者のためのステップバイステップ入門
          </h1>
          <p className={styles.lead}>
            本書 <strong>“LLM Engineer&apos;s Handbook”</strong>(Paul Iusztin、Maxime Labonne
            著、Packt
            Publishing、2024年10月刊)を、LLMエンジニアリングを学び始めたばかりの人でも迷わず全体像をつかめるよう、章立てに沿って噛み砕いて解説します。O&apos;Reilly公式ページ・GitHub公式リポジトリ・国際的に著名な開発者や著者による言及を調査し、末尾に出典URLをまとめました。
          </p>
          <div className={styles.chipRow}>
            <span className={styles.chip}>
              <i className="ti ti-user-edit" />
              Paul Iusztin &amp; Maxime Labonne
            </span>
            <span className={styles.chip}>
              <i className="ti ti-building" />
              Packt Publishing / 2024年10月
            </span>
            <span className={styles.chip}>
              <i className="ti ti-stack-2" />
              522ページ / 全11章+付録
            </span>
            <span className={styles.chip}>
              <i className="ti ti-gauge" />
              難易度:中級〜上級
            </span>
            <span className={styles.chip}>
              <i className="ti ti-brand-github" />
              公式コード配布あり
            </span>
          </div>
        </header>

        <div className={`${styles.content} ${styles.prose}`}>
          {/* ===================== INTRO ===================== */}
          <section className={styles.section} id="intro">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-bulb" />
              </span>
              <h2>この本は何なのか ― 3行でつかむ</h2>
            </div>
            <ul>
              <li>
                <strong>「LLM Twin」</strong>
                と呼ばれる、自分の文章スタイルを模倣するAIアシスタントを、企画から本番デプロイまで一気通貫で作りながらLLMエンジニアリングを学ぶ実践書です。
              </li>
              <li>
                データ収集 → RAG(検索拡張生成) → ファインチューニング → 評価 → 推論最適化 →
                クラウドデプロイ → MLOps/LLMOps運用まで、
                <strong>プロダクションレベルのLLMシステム開発の全工程</strong>
                を1冊でカバーしています。
              </li>
              <li>
                対象読者は「AIエンジニア・NLPエンジニア・LLM実務者」で、O&apos;Reillyの公式ページでは難易度が
                <strong>Intermediate to advanced(中級〜上級)</strong>
                に位置づけられています。本ガイドは、その中級〜上級の内容を初学者でも道筋を見失わずに読み進められるよう、要所を補足しながら解説します。
              </li>
            </ul>
          </section>

          {/* ===================== BOOK INFO ===================== */}
          <section className={styles.section} id="book-info">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-book-2" />
              </span>
              <h2>書籍情報まとめ</h2>
            </div>
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
                    <td>タイトル</td>
                    <td>
                      <em>
                        LLM Engineer&apos;s Handbook: Master the art of engineering large language
                        models from concept to production
                      </em>
                    </td>
                  </tr>
                  <tr>
                    <td>著者</td>
                    <td>Paul Iusztin、Maxime Labonne</td>
                  </tr>
                  <tr>
                    <td>出版社</td>
                    <td>Packt Publishing</td>
                  </tr>
                  <tr>
                    <td>出版年月</td>
                    <td>2024年10月</td>
                  </tr>
                  <tr>
                    <td>ページ数</td>
                    <td>522ページ(音声版で約12時間55分)</td>
                  </tr>
                  <tr>
                    <td>難易度</td>
                    <td>Intermediate to advanced(中級〜上級)</td>
                  </tr>
                  <tr>
                    <td>言語</td>
                    <td>英語</td>
                  </tr>
                  <tr>
                    <td>ISBN-13</td>
                    <td>978-1-83620-007-9</td>
                  </tr>
                  <tr>
                    <td>公式書籍ページ</td>
                    <td>
                      <a
                        href="https://www.oreilly.com/library/view/llm-engineers-handbook/9781836200079/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        O&apos;Reilly
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>コード配布</td>
                    <td>
                      <a
                        href="https://github.com/PacktPublishing/LLM-Engineers-Handbook"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub: PacktPublishing/LLM-Engineers-Handbook
                      </a>
                      (MITライセンス、本書刊行後も継続的にメンテナンスされている)
                    </td>
                  </tr>
                  <tr>
                    <td>GitHubスター数の目安</td>
                    <td>5,000+ / フォーク1,200+(Trendshiftでも人気リポジトリとして紹介)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ===================== AUTHORS ===================== */}
          <section className={styles.section} id="authors">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-users" />
              </span>
              <h2>著者について</h2>
            </div>
            <p>本書の信頼性を測るうえで、著者の実務背景は重要な手がかりです。</p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>著者</th>
                    <th>プロフィール</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Paul Iusztin</strong>
                    </td>
                    <td>
                      シニアAIエンジニア。ニュースレター・知見発信プラットフォーム
                      <strong>Decoding ML(Decoding AI)</strong>
                      の創設者で、プロダクション品質のML/AIシステムの設計・実装・デプロイについて発信を続けている。本書のベースとなったオープンソース教材「LLM
                      Twin」コースの考案者でもある。10年以上のAI/ソフトウェア実務経験を持つ。
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Maxime Labonne</strong>
                    </td>
                    <td>
                      Liquid AI の<strong>Head of Post-Training</strong>(Senior Staff Machine
                      Learning Scientist)。パリ理工科大学(Polytechnic Institute of
                      Paris)で機械学習の博士号を取得し、Google Developer
                      Expert(AI/ML分野)にも認定されている。GitHub上で8万スター超を集める人気教材「
                      <strong>LLM Course</strong>
                      」の作者としても国際的に広く知られており、書籍『Hands-On Graph Neural Networks
                      Using Python』(Packt)の著者でもある。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              両著者とも、単なる理論解説者ではなく、実際に本番運用されるAI/LLMシステムを構築してきた実務家である点が本書の特徴です。
            </p>
          </section>

          {/* ===================== REVIEWS ===================== */}
          <section className={styles.section} id="reviews">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-star" />
              </span>
              <h2>なぜ話題になっているのか(評価・レビュー)</h2>
            </div>
            <p>
              国際的に著名なAI/ML関係者や、影響力のあるテック系メディア・著者による言及を集めました。
            </p>
            <ul>
              <li>
                <strong>Hugging Face 共同創業者兼CTO Julien Chaumond</strong>
                は、本書について「LLMを使うだけでなく、適応・ファインチューニング・量子化し、実世界で効率よく動かせるレベルまで人々を導く一冊」と高く評価するコメントを寄せています(出典:出版社掲載の推薦文)。
              </li>
              <li>
                セキュリティ/IT専門メディア<strong>Help Net Security</strong>
                のレビュー(2025年7月、Mirko
                Zorz氏執筆)では、本書がFTI(feature/training/inference)パイプライン設計を軸に、現実的な計算リソース制約(小規模チーム・限られたGPU)を前提とした実務的なロードマップを提示している点を評価しつつ、「初心者向けの入門書ではなく、LLM・ベクトルDB・MLOpsパターンにある程度慣れている読者を想定している」と率直に指摘しています。
              </li>
              <li>
                テック系ブログメディア<strong>Javarevisited</strong>
                (35,000人超のフォロワーを持つ著名執筆者 javinpaul
                氏)によるレビュー(2025年6月)では、本書が<strong>1万部以上</strong>
                販売されている実績を紹介し、「LangChainの使い方を教えるだけでなく、AIプロダクトアーキテクトとしての思考法を教えてくれる」と評しています。
              </li>
              <li>
                学習コミュニティ<strong>DataTalks.Club</strong>
                (データエンジニアリング/ML教育で著名なAlexey Grigorev氏が運営)では、本書が「Book of
                the Week」として紹介されています。
              </li>
              <li>
                RAG/LLMアプリケーション開発の分野で著名なエンジニア<strong>duarteocarmo</strong>
                氏が公開したおすすめリソース集(GitHub Gist)には、Jason Liu氏やSimon Willison氏、Ben
                Clavié氏といった国際的に著名なLLM/RAG実務者の発信と並んで、本書が実践的リソースの一つとして掲載されています。
              </li>
              <li>
                LLM関連リソースのキュレーションリポジトリ
                <strong>SylphAI-Inc/LLM-engineer-handbook</strong>(READMEで言及)では、本書が Andrej
                Karpathy氏の講義や Sebastian Raschka氏・Chip
                Huyen氏の著作と並んで、LLMライフサイクル(学習・提供・ファインチューニング・アプリ構築)を学ぶための代表的な書籍として紹介されています。
              </li>
              <li>
                書評まとめサイト<strong>awesome-llm-books</strong>(Jason
                Brownlee氏)によると、Amazonレーティングは4.6、Goodreadsレーティングは3.85となっています(2026年9月時点の調査ベース)。
              </li>
            </ul>
            <div
              className={`${styles.callout} ${styles.info}`}
              data-testid="callout"
              data-variant="info"
            >
              <i className="ti ti-info-circle" />
              <div className={styles.calloutBody}>
                <p>
                  総じて「理論に寄りすぎず、かといって薄いチュートリアルでもない、“本番稼働するLLM製品をどう設計するか”に主眼を置いた実務書」という評価が国際的に一致している点が特徴です。
                </p>
              </div>
            </div>
          </section>

          {/* ===================== LLM TWIN OVERVIEW ===================== */}
          <section className={styles.section} id="llm-twin">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-robot" />
              </span>
              <h2>全体像:「LLM Twin」という教材プロジェクト</h2>
            </div>
            <p>
              本書は終始一貫して、<strong>「LLM Twin」</strong>
              (自分の文章スタイルを模倣するAI分身)という1つの具体的プロダクトを題材に進みます。単なるチャットボットのラッパーではなく、「なぜChatGPTをそのまま使うのではダメなのか」という問いから出発し、以下のようなMVP(Minimum
              Viable Product)を、実際に手を動かしながら構築していく構成です。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram
                id="diag-overview"
                chart={DIAGRAM_OVERVIEW}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
                flowchartHtmlLabels={false}
              />
            </div>
            <p className={styles.diagramCaption}>
              図:LLM Twin全体のデータフロー(データ収集からAI分身の応答生成まで)
            </p>

            <p>
              このように「個人の書いたもの」を集め、検索可能な形に整え、モデルを微調整し、最終的に本人らしい文章を生成するAPI/サービスとして提供する、というエンドツーエンドの流れそのものが本書の教材になっています。
            </p>
          </section>

          {/* ===================== DATA ETHICS ===================== */}
          <section className={styles.section} id="data-ethics">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-shield-check" />
              </span>
              <h2>データ収集時の注意</h2>
            </div>
            <div
              className={`${styles.callout} ${styles.warn}`}
              data-testid="callout"
              data-variant="warn"
            >
              <i className="ti ti-alert-triangle" />
              <div className={styles.calloutBody}>
                <strong className={styles.calloutTitle}>
                  収集してよいのは自分のコンテンツ、または許諾を得たコンテンツのみ
                </strong>
                <p>
                  このデータ収集パイプラインで扱ってよいのは、
                  <strong>
                    自分が著作権を持つコンテンツか、利用許諾を得たコンテンツに限られます
                  </strong>
                  。LLM
                  Twinは「自分の分身」を作る題材であり、他人のアカウントや第三者の投稿を無断で収集する用途を想定していません。
                </p>
              </div>
            </div>
            <p>実際にクローラーを動かす前に、少なくとも以下を確認してください。</p>
            <ul>
              <li>
                <strong>各サービスの利用規約(ToS)とrobots.txt</strong>
                :LinkedInなど、自動収集を規約で明確に禁止・制限しているサービスがあります。自分のアカウントのデータであっても、取得方法(スクレイピング可否、公式APIやデータエクスポート機能の利用)に制約がかかる場合があります。
              </li>
              <li>
                <strong>レート制限</strong>
                :短時間に大量アクセスを行うとサービス側に負荷をかけ、アカウント停止やIPブロックの対象になります。リクエスト間隔を空け、取得件数に上限を設けてください。
              </li>
              <li>
                <strong>保存期間と派生データの削除</strong>
                :保持期間は生データだけでなく、そこから派生した<em>すべてのデータ</em>
                に適用します。元の投稿が削除された場合、利用許諾が撤回された場合、保存期限が到来した場合は、以下を漏れなく無効化・削除してください。LLM
                Twinでは1件の生データがMongoDB→チャンク→埋め込み→データセット→モデル→監視ログへと多段に複製されるため、生データだけ消しても実質的には残り続けます。
                <ul>
                  <li>MongoDBの生ドキュメント(データウェアハウス層)</li>
                  <li>
                    特徴量パイプラインが生成したチャンクとその埋め込み、およびQdrant内の該当ポイント(
                    <code>author_id</code>などのメタデータで絞り込んで削除する)
                  </li>
                  <li>
                    生成済みの指示データセット・選好データセット(該当サンプルを除去したうえで再生成する)
                  </li>
                  <li>
                    当該データで学習したファインチューニング済みモデル(影響が大きい場合は再学習する)
                  </li>
                  <li>
                    プロンプト監視・トレースに保存された入出力ログ(Cometなどの監視基盤側の保持設定も確認する)
                  </li>
                  <li>
                    削除後は、削除対象の<code>author_id</code>
                    や文書IDでMongoDB・Qdrant・データセット・監視ログをそれぞれ再検索し、ヒットが0件であることを確認して記録に残す
                  </li>
                </ul>
              </li>
              <li>
                <strong>第三者の個人情報</strong>
                :自分の投稿であっても、コメント欄や本文に他人の氏名・連絡先などが含まれることがあります。学習データに混入させない、または取り込み時にマスキングする方針を決めておいてください。
              </li>
            </ul>
          </section>

          {/* ===================== FTI ===================== */}
          <section className={styles.section} id="fti">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-sitemap" />
              </span>
              <h2>アーキテクチャの核:FTIパイプライン設計</h2>
            </div>
            <p>
              本書の設計思想で最も重要なのが、第1章で導入される
              <strong>FTI(Feature / Training / Inference)パイプラインアーキテクチャ</strong>
              です。これは「1つの巨大なMLシステム」を作るのではなく、役割ごとに3種類の独立したパイプラインに分割し、それぞれが疎結合な形でデータをやり取りする設計パターンです。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram
                id="diag-fti"
                chart={DIAGRAM_FTI}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
                flowchartHtmlLabels={false}
              />
            </div>
            <p className={styles.diagramCaption}>
              図:FTI(Feature / Training / Inference)パイプラインアーキテクチャ
            </p>

            <p>
              <strong>FTI設計のメリット</strong>として本書が挙げているのは、大きく以下の点です。
            </p>
            <ul>
              <li>
                各パイプラインを
                <strong>
                  異なるチーム・異なる言語・異なるインフラで独立して開発・スケールできる
                </strong>
                こと
              </li>
              <li>
                「特徴量ストア」と「モデルレジストリ」という共有の受け渡し場所(インターフェース)さえ守れば、内部実装を自由に差し替えられること
              </li>
              <li>
                学習用データと推論用データの取得ロジックを共通化でき、
                <strong>学習・推論間のデータの不整合(training-serving skew)を防ぎやすい</strong>
                こと
              </li>
            </ul>
            <p>
              このFTIパターンは、本書全体を通じて「なぜこの章でこのツールを使うのか」を理解するための地図として繰り返し参照されます。
            </p>
          </section>

          {/* ===================== CHAPTER OVERVIEW ===================== */}
          <section className={styles.section} id="ch-overview">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-list-details" />
              </span>
              <h2>章立てで見る本書の構成(全11章+付録)</h2>
            </div>
            <p>
              本書は全11章+付録1本で構成されています。以下、各章の狙いを初学者向けに要約します。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>章</th>
                    <th>タイトル(原題)</th>
                    <th>この章で学ぶこと</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Understanding the LLM Twin Concept and Architecture</td>
                    <td>LLM Twinとは何か、MVPの定義、FTIパイプラインによるシステム設計の全体像</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Tooling and Installation</td>
                    <td>
                      Poetry・ZenML・Comet
                      ML・Opik・MongoDB・Qdrant・AWSなど、本書全体で使う開発環境のセットアップ
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Data Engineering</td>
                    <td>
                      GitHub/Medium/カスタム記事のクローラー実装、NoSQLデータウェアハウスへの格納
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>RAG Feature Pipeline</td>
                    <td>
                      RAGの基礎理論、埋め込み、ベクトルDBの仕組み、Advanced
                      RAGの前処理・後処理最適化
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Supervised Fine-Tuning</td>
                    <td>指示データセットの作り方、LoRA/QLoRAなどのPEFT手法</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>Fine-Tuning with Preference Alignment</td>
                    <td>選好データセットの作り方、RLHFとDPO</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>Evaluating LLMs</td>
                    <td>汎用/ドメイン別/タスク別評価、RAG評価ツール(Ragas, ARES)を使った実測</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>Inference Optimization</td>
                    <td>
                      KVキャッシュ、Continuous Batching、Speculative Decoding、モデル並列化、量子化
                    </td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>RAG Inference Pipeline</td>
                    <td>
                      クエリ拡張・Self-Querying・フィルタ付きベクトル検索・リランキングによるAdvanced
                      RAGの実装
                    </td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>Inference Pipeline Deployment</td>
                    <td>
                      AWS
                      SageMakerへのモデルデプロイ、FastAPIによるマイクロサービス化、オートスケーリング
                    </td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>MLOps and LLMOps</td>
                    <td>
                      DevOps→MLOps→LLMOpsの発展、CI/CD/CTパイプライン、プロンプト監視、アラート設計
                    </td>
                  </tr>
                  <tr>
                    <td>付録</td>
                    <td>MLOps Principles</td>
                    <td>
                      自動化・バージョニング・実験管理・テスト・監視・再現性という6原則の総まとめ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ===================== CHAPTER 1 ===================== */}
          <section className={styles.section} id="ch1">
            <h3>
              <span className={styles.h3Num}>1</span>LLM Twinの概念とアーキテクチャ理解
            </h3>
            <p>
              なぜ既存のチャットボット(ChatGPTなど)をそのまま使うのではなく、自分専用のLLMシステムを構築する意味があるのかという「Why」から始まり、MVPの要件定義、そして前述のFTIパイプライン設計に落とし込むまでの思考プロセスを学びます。ここで学ぶ設計原則は、以降のすべての章の土台になります。
            </p>
          </section>

          {/* ===================== CHAPTER 2 ===================== */}
          <section className={styles.section} id="ch2">
            <h3>
              <span className={styles.h3Num}>2</span>ツールとインストール
            </h3>
            <p>
              本書の実装は特定の技術スタックに強く依存しているため、この章で環境を整えることが後続章をスムーズに進める鍵になります。Poetry(依存関係管理)、Poe
              the Poet(タスクランナー)、ZenML(オーケストレーション)、Comet
              ML(実験管理)、Opik(プロンプト監視)、MongoDB(NoSQL)、Qdrant(ベクトルDB)、AWS
              CLI/SageMakerのセットアップまでを一通り扱います。
            </p>
          </section>

          {/* ===================== CHAPTER 3 ===================== */}
          <section className={styles.section} id="ch3">
            <h3>
              <span className={styles.h3Num}>3</span>データエンジニアリング
            </h3>
            <p>
              LinkedIn・Medium・GitHub・個人ブログなど複数ソースから、それぞれ異なる形式のデータをクロールするための「ディスパッチャー
              + クローラー」パターンを実装します。取得したデータはODM(Object-Document
              Mapping)パターンを使ってMongoDBに正規化して保存されます。Webクローリング特有のトラブルシューティング(Seleniumのエラー対応など)も扱われます。
            </p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram
                id="diag-crawler"
                chart={DIAGRAM_CRAWLER}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
                flowchartHtmlLabels={false}
              />
            </div>
            <p className={styles.diagramCaption}>図:データ収集クローラーパイプライン</p>
          </section>

          {/* ===================== CHAPTER 4 ===================== */}
          <section className={styles.section} id="ch4">
            <h3>
              <span className={styles.h3Num}>4</span>RAG特徴量パイプライン
            </h3>
            <p>
              RAG(Retrieval-Augmented
              Generation)がなぜ必要か(ハルシネーション対策、情報の鮮度対策)という基礎から始まり、埋め込み・ベクトルDBの仕組み、そして「Vanilla
              RAG」から一段進んだ<strong>Advanced RAG</strong>
              (前処理・検索・後処理それぞれの最適化)まで体系的に解説されます。実装面では、ZenMLパイプラインでクリーニング→チャンク化→埋め込み→ベクトルDB格納までを行います。
            </p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram
                id="diag-rag"
                chart={DIAGRAM_RAG}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
                flowchartHtmlLabels={false}
              />
            </div>
            <p className={styles.diagramCaption}>
              図:RAG特徴量パイプライン(Ingestion〜Retrieval〜Generation)
            </p>
          </section>

          {/* ===================== CHAPTER 5 ===================== */}
          <section className={styles.section} id="ch5">
            <h3>
              <span className={styles.h3Num}>5</span>教師ありファインチューニング(SFT)
            </h3>
            <p>
              質の高い指示データセットをどう作るか(データ量・データキュレーション・重複排除・データ汚染除去・データ品質評価)を丁寧に扱ったうえで、いつファインチューニングすべきか、チャットテンプレートの扱い方、そしてLoRA・QLoRAといったパラメータ効率の良いファインチューニング手法(PEFT)を実装します。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>手法</th>
                    <th>概要</th>
                    <th>特徴</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>フルファインチューニング</td>
                    <td>モデルの全パラメータを更新</td>
                    <td>表現力は最も高いが、計算・メモリコストが非常に大きい</td>
                  </tr>
                  <tr>
                    <td>LoRA</td>
                    <td>低ランク行列のみを追加学習</td>
                    <td>計算・メモリ効率が良く、元モデルの重みは凍結したまま扱える</td>
                  </tr>
                  <tr>
                    <td>QLoRA</td>
                    <td>LoRA + 4bit量子化などを組み合わせ</td>
                    <td>非常に限られたVRAMでも学習が可能になる</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ===================== CHAPTER 6 ===================== */}
          <section className={styles.section} id="ch6">
            <h3>
              <span className={styles.h3Num}>6</span>選好アライメントによるファインチューニング
            </h3>
            <p>
              SFTだけでは「文法的に正しいが人間の好みに沿わない」出力になりがちな問題に対し、選好データセット(どちらの回答がより好ましいかのペア)を作成し、
              <strong>RLHF(Reinforcement Learning from Human Feedback)</strong>と
              <strong>DPO(Direct Preference Optimization)</strong>
              という2つのアライメント手法を比較しながら、実際にDPOを実装してTwinLlama-3.1-8Bモデルを仕上げます。
            </p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram
                id="diag-align"
                chart={DIAGRAM_ALIGN}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
                flowchartHtmlLabels={false}
              />
            </div>
            <p className={styles.diagramCaption}>図:選好アライメント(RLHF/DPO)による仕上げ工程</p>
          </section>

          {/* ===================== CHAPTER 7 ===================== */}
          <section className={styles.section} id="ch7">
            <h3>
              <span className={styles.h3Num}>7</span>LLMの評価
            </h3>
            <p>
              従来のML評価とLLM評価の違いを整理したうえで、汎用LLM評価・ドメイン特化評価・タスク特化評価という3レイヤーで評価手法を体系化しています。RAGパイプラインの評価には
              <strong>Ragas</strong>や<strong>ARES</strong>
              といった専用フレームワークを使い、実際に自分たちが作ったTwinLlama-3.1-8Bモデルの回答を生成・評価・分析するところまで実践します。
            </p>
          </section>

          {/* ===================== CHAPTER 8 ===================== */}
          <section className={styles.section} id="ch8">
            <h3>
              <span className={styles.h3Num}>8</span>推論最適化
            </h3>
            <p>
              学習が終わったモデルを、実際に低遅延・高スループットで動かすための最適化技術を扱います。KVキャッシュ、Continuous
              Batching、Speculative
              Decoding、そしてデータ並列/パイプライン並列/テンソル並列といったモデル並列化に加え、GGUF(llama.cpp向け)・GPTQ・EXL2という量子化手法を比較します。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>量子化手法</th>
                    <th>特徴</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>GGUF + llama.cpp</td>
                    <td>CPU推論・ローカル実行に強く、汎用性が高い</td>
                  </tr>
                  <tr>
                    <td>GPTQ</td>
                    <td>GPU推論向けで、比較的高精度な量子化アルゴリズム</td>
                  </tr>
                  <tr>
                    <td>EXL2</td>
                    <td>可変ビット量子化。ExLlamaV2エンジン向けに最適化</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ===================== CHAPTER 9 ===================== */}
          <section className={styles.section} id="ch9">
            <h3>
              <span className={styles.h3Num}>9</span>RAG推論パイプライン
            </h3>
            <p>
              第4章で扱ったRAGの基礎を踏まえ、実際の推論時に効くAdvanced
              RAGテクニックを実装します。前処理側では<strong>クエリ拡張</strong>と
              <strong>Self-Querying</strong>、検索側では<strong>フィルタ付きベクトル検索</strong>
              、後処理側では<strong>リランキング</strong>
              を組み合わせ、それらを1本のRAG推論パイプラインとして統合します。
            </p>
          </section>

          {/* ===================== CHAPTER 10 ===================== */}
          <section className={styles.section} id="ch10">
            <h3>
              <span className={styles.h3Num}>10</span>推論パイプラインのデプロイ
            </h3>
            <p>
              「オンラインのリアルタイム推論」「非同期推論」「オフラインのバッチ推論」という3つのデプロイ方式それぞれの特徴と使い分け、さらに「モノリシック」対「マイクロサービス」というモデル提供アーキテクチャの選び方を整理したうえで、実際に
              <strong>AWS SageMaker</strong>
              へLLMマイクロサービスをデプロイし、<strong>FastAPI</strong>
              でビジネスロジック側のサービスを構築、オートスケーリング設定まで行います。
            </p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram
                id="diag-deploy"
                chart={DIAGRAM_DEPLOY}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
                flowchartHtmlLabels={false}
              />
            </div>
            <p className={styles.diagramCaption}>図:推論パイプラインのデプロイ構成</p>
          </section>

          {/* ===================== CHAPTER 11 ===================== */}
          <section className={styles.section} id="ch11">
            <h3>
              <span className={styles.h3Num}>11</span>MLOpsとLLMOps
            </h3>
            <p>
              DevOps→MLOps→LLMOpsという概念の発展の歴史を整理し、人間からのフィードバック・ガードレール・プロンプト監視といったLLMOps特有の要素を導入します。実装面では、LLM
              Twinの各パイプラインをクラウド(MongoDB・Qdrant・ZenML
              Cloud・Docker・AWS)にデプロイし、GitHub
              ActionsでCI(継続的インテグレーション)・CD(継続的デリバリー)・CT(継続的学習トリガー)を組み上げます。
            </p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram
                id="diag-mlops"
                chart={DIAGRAM_MLOPS}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
                flowchartHtmlLabels={false}
              />
            </div>
            <p className={styles.diagramCaption}>図:CI/CD/CTによるMLOps/LLMOps運用サイクル</p>
          </section>

          {/* ===================== APPENDIX ===================== */}
          <section className={styles.section} id="appendix">
            <h3>
              <span className={styles.h3Num}>付</span>付録:MLOpsの原則
            </h3>
            <p>
              自動化(オペレーション化)、バージョニング、実験管理、テスト、監視、再現性という6つの原則を、本編の実装に紐づけながら総まとめする章です。監視についてはログ・メトリクス(システム/モデル)・ドリフト検知・アラートまで細かく整理されています。
            </p>
          </section>

          {/* ===================== ROADMAP ===================== */}
          <section className={styles.section} id="roadmap">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-route" />
              </span>
              <h2>初学者向け・学習ロードマップ</h2>
            </div>
            <p>
              522ページというボリュームと「中級〜上級」という難易度表示に圧倒されず読み進めるための、おすすめの学習順序です。
            </p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram
                id="diag-roadmap"
                chart={DIAGRAM_ROADMAP}
                theme="base"
                themeVariables={MERMAID_THEME_VARIABLES}
                flowchartHtmlLabels={false}
              />
            </div>
            <p className={styles.diagramCaption}>図:初学者向け学習ロードマップ(ステップ1〜9)</p>
            <div
              className={`${styles.callout} ${styles.default}`}
              data-testid="callout"
              data-variant="default"
            >
              <i className="ti ti-flag-3" />
              <div className={styles.calloutBody}>
                <strong className={styles.calloutTitle}>ポイント</strong>
                <p>
                  第2章(環境構築)を後回しにせず先に済ませておくと、第3章以降の「実際に手を動かす」パートで詰まりにくくなります。また、AWSやOpenAI
                  APIの利用は従量課金のため、GitHub公式リポジトリのREADMEでは一通り実行した場合のコストが
                  <strong>おおよそ25米ドル程度</strong>(主にAWS
                  SageMakerでの学習・推論費用)になると案内されています。予算感を把握したうえで進めることをおすすめします。
                </p>
              </div>
            </div>
          </section>

          {/* ===================== HANDS-ON ===================== */}
          <section className={styles.section} id="hands-on">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-terminal-2" />
              </span>
              <h2>ハンズオン:公式GitHubリポジトリを動かす</h2>
            </div>
            <p>
              本書のコードは
              <a
                href="https://github.com/PacktPublishing/LLM-Engineers-Handbook"
                target="_blank"
                rel="noopener noreferrer"
              >
                PacktPublishing/LLM-Engineers-Handbook
              </a>
              で公開されており、書籍刊行後も継続的にメンテナンスされています(書籍本文とコードに差異がある場合は、常にこのリポジトリが最新版として優先されます)。
            </p>

            <h3>
              <span className={styles.h3Num}>a</span>ローカル環境の依存関係
            </h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ツール</th>
                    <th>バージョン目安</th>
                    <th>用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>pyenv</td>
                    <td>2.3.36以上(任意)</td>
                    <td>複数のPythonバージョン管理</td>
                  </tr>
                  <tr>
                    <td>Python</td>
                    <td>3.11</td>
                    <td>ランタイム環境</td>
                  </tr>
                  <tr>
                    <td>Poetry</td>
                    <td>1.8.3以上、2.0未満</td>
                    <td>パッケージ管理</td>
                  </tr>
                  <tr>
                    <td>Docker</td>
                    <td>27.1.1以上</td>
                    <td>コンテナ化・ローカルインフラ</td>
                  </tr>
                  <tr>
                    <td>Google Chrome / Chromium</td>
                    <td>Seleniumドライバと互換のバージョン</td>
                    <td>データ収集パイプラインのブラウザ自動操作</td>
                  </tr>
                  <tr>
                    <td>AWS CLI</td>
                    <td>2.15.42以上</td>
                    <td>クラウド管理</td>
                  </tr>
                  <tr>
                    <td>Git</td>
                    <td>2.44.0以上</td>
                    <td>バージョン管理</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>
              <span className={styles.h3Num}>b</span>セットアップの流れ(概要)
            </h3>
            <ul className={styles.checklist} id="setupChecklist">
              <li>
                <input type="checkbox" id="s1" />
                <label htmlFor="s1">
                  リポジトリをクローンする:
                  <code>
                    git clone https://github.com/PacktPublishing/LLM-Engineers-Handbook.git
                  </code>
                </label>
              </li>
              <li>
                <input type="checkbox" id="s2" />
                <label htmlFor="s2">
                  クローンしたリポジトリへ移動する:<code>cd LLM-Engineers-Handbook</code>
                  (以降のPoetryコマンドと<code>.env</code>
                  の読み込みは、すべてこのディレクトリ内で実行する)
                </label>
              </li>
              <li>
                <input type="checkbox" id="s3" />
                <label htmlFor="s3">Python 3.11環境を用意する(pyenv推奨)</label>
              </li>
              <li>
                <input type="checkbox" id="s4" />
                <label htmlFor="s4">Poetryで依存関係をインストールする(下記コマンド参照)</label>
              </li>
              <li>
                <input type="checkbox" id="s5" />
                <label htmlFor="s5">
                  <code>.env.example</code> を <code>.env</code> にコピーし、OpenAI APIキー・Hugging
                  Faceトークン・Comet APIキーなどの認証情報を設定する。
                  <strong>
                    <code>.env</code> は <code>.gitignore</code>{" "}
                    で除外されていることを必ず確認し、コミットも共有も絶対に行わない
                  </strong>
                  (APIキーが第三者に渡ると不正利用や課金事故に直結する)
                </label>
              </li>
              <li>
                <input type="checkbox" id="s6" />
                <label htmlFor="s6">
                  <code>poetry poe local-infrastructure-up</code>
                  でMongoDB・Qdrant・ZenMLのローカルインフラを起動する
                </label>
              </li>
              <li>
                <input type="checkbox" id="s7" />
                <label htmlFor="s7">
                  データ収集パイプラインを動かす前に、Google
                  ChromeまたはChromiumを導入する(下記の注意点を参照)
                </label>
              </li>
              <li>
                <input type="checkbox" id="s8" />
                <label htmlFor="s8">
                  (ローカル実行の場合)データ収集 → 特徴量エンジニアリング →
                  指示データセット生成、という順にZenMLパイプラインを実行する
                </label>
              </li>
              <li>
                <input type="checkbox" id="s9" />
                <label htmlFor="s9">
                  DPO(選好最適化)を行う場合は、
                  <code>poetry poe run-generate-preference-datasets-pipeline</code>
                  を別手順として実行する
                </label>
              </li>
              <li>
                <input type="checkbox" id="s10" />
                <label htmlFor="s10">
                  AWS
                  SageMakerを使う場合は、追加インストールとAWS側の権限設定を行ってからデプロイに進む(下記の注意点を参照)
                </label>
              </li>
            </ul>
            <p className={styles.checklistCounter} id="checklistCounter">
              0/10 完了
            </p>

            <div className={styles.codeBlock} data-testid="code-block">
              <div className={styles.codeLabel}>手順4:Poetryでの依存関係インストール</div>
              <pre>
                <code className="language-bash">
                  <span className={styles.codeLine}>poetry env use 3.11</span>
                  <span className={styles.codeLine}>poetry install --without aws</span>
                  <span className={styles.codeLine}>poetry run pre-commit install</span>
                </code>
              </pre>
            </div>

            <div
              className={`${styles.callout} ${styles.warn}`}
              data-testid="callout"
              data-variant="warn"
            >
              <i className="ti ti-alert-triangle" />
              <div className={styles.calloutBody}>
                <strong className={styles.calloutTitle}>
                  手順7:ChromeDriverとLinkedInクローラーの注意点
                </strong>
                <p>
                  <code>MediumCrawler</code> が継承する <code>BaseSeleniumCrawler</code> は
                  <code>webdriver.Chrome</code>
                  を使うため、対応ブラウザが無いとクロールが起動時に失敗します。なお
                  <strong>
                    <code>LinkedInCrawler</code> は非推奨(deprecated)であり、既定では利用できません
                  </strong>
                  。同クラスは <code>is_deprecated=True</code> が設定されており、
                  <code>login()</code>と <code>extract()</code> は<code>DeprecationWarning</code>
                  を送出して処理を行いません。LinkedInを収集対象として前提にした手順は組まず、サポートされているデータソース(Medium・GitHub・個人ブログなど)で進めてください(LinkedInの自動収集は利用規約上の制約もあります。前述の「データ収集時の注意」を参照)。
                </p>
                <p>
                  ローカルで動かす場合、macOSは
                  <code>brew install --cask google-chrome</code>、Debian/Ubuntuは公式パッケージの
                  <code>google-chrome-stable</code>
                  を導入します。ChromeDriver自体は手動導入不要で、
                  <code>llm_engineering.application.crawlers.base</code>の
                  <code>chromedriver_autoinstaller.install()</code>
                  がインストール済みChromeのバージョンに対応するChromeDriverを自動取得します。
                </p>
                <p>
                  ただしこの処理は
                  <code>BaseSeleniumCrawler</code>の<strong>import時点</strong>に走り、
                  <strong>ネットワーク接続が前提</strong>である点に注意してください。
                  <code>install()</code>
                  はChromeのバージョンに対応するドライバのバージョンを解決するために外部エンドポイントへ問い合わせるため、ChromeDriverを事前に配置・キャッシュしてあっても、オフライン環境やプロキシで外部通信が制限された環境では
                  import の時点で失敗しうります。
                </p>
                <p>
                  オフラインで動かす必要がある場合、
                  <strong>
                    <code>BaseSeleniumCrawler</code> を継承したクラス側で基底の
                    <code>__init__</code> を呼ばないようにするだけでは不十分
                  </strong>
                  です。<code>install()</code> は <code>BaseSeleniumCrawler</code> の
                  <code>__init__</code> の中ではなく
                  <code>llm_engineering.application.crawlers.base</code>の
                  <strong>モジュール直下</strong>
                  に書かれているため、クラスを継承するにせよインスタンス化しないにせよ、
                  <strong>当該モジュールをimportした時点で必ず実行されます</strong>(
                  <code>MediumCrawler</code>
                  などの具象クローラーは base を import するため、これらを import
                  するだけでも走ります)。したがって回避するには次のいずれかが必要です。
                </p>
                <ul>
                  <li>
                    ① <code>BaseSeleniumCrawler</code>(= base
                    モジュール)をimportしない独自のクローラー実装にする
                  </li>
                  <li>
                    ② モジュールレベルの
                    <code>install()</code>
                    呼び出しを取り除いたbaseを用意する(フォークまたはローカルでの当該行の削除)
                  </li>
                </ul>
                <p>
                  そのうえで、<code>from selenium.webdriver.chrome.service import Service</code>
                  として
                  <code>
                    webdriver.Chrome(service=Service(&quot;/path/to/chromedriver&quot;),
                    options=options)
                  </code>
                  のように、ローカルのChromeDriverのパスを明示してドライバを生成します。この①②いずれの手当てもしない限り、データ収集パイプラインの実行には外部ネットワークが必須です。
                </p>
                <p>
                  環境を汚したくない場合は、リポジトリ同梱の公式Dockerfile(
                  <code>google-chrome-stable</code>
                  を含む)でパイプラインを実行できます。
                </p>
              </div>
            </div>

            <div className={styles.codeBlock} data-testid="code-block">
              <div className={styles.codeLabel}>Docker実行の場合</div>
              <pre>
                <code className="language-bash">
                  <span className={styles.codeLine}>poetry poe build-docker-image</span>
                  <span className={styles.codeLine}>
                    poetry poe run-docker-end-to-end-data-pipeline
                  </span>
                </code>
              </pre>
            </div>
            <p>
              後者は <code>.env</code> を読み込むため、手順5を先に済ませておく必要があります。また
              <strong>
                Docker(<code>run-docker-end-to-end-data-pipeline</code>
                )を選んだ場合、手順8のデータ収集〜データセット生成はコンテナ内で実行済みのため重複実行しないでください
              </strong>
              (再実行するとクロールとデータセット生成が二重に走ります)。なお
              <code>end_to_end_data</code> パイプラインは既定の
              <code>DatasetType.INSTRUCTION</code>
              で動くため、
              <strong>
                生成されるのは指示(instruct)データセットのみで、選好(preference)データセットは含まれません
              </strong>
              。選好データセットが必要な場合は手順9を別途実行してください(ローカル実行・Docker実行のどちらを選んだ場合でも必要。SFTのみを行う場合は不要です)。
            </p>

            <div
              className={`${styles.callout} ${styles.info}`}
              data-testid="callout"
              data-variant="info"
            >
              <i className="ti ti-cloud-lock" />
              <div className={styles.calloutBody}>
                <strong className={styles.calloutTitle}>
                  手順10:AWSの権限設計(最小権限の原則)
                </strong>
                <ul>
                  <li>
                    <strong>ブートストラップ(一時的な管理者権限)</strong>:<code>aws configure</code>
                    で管理者相当の認証情報を設定し、SageMakerの実行ロール(execution
                    role)を作成する。この管理者キーの用途はロール作成までに限定する
                  </li>
                  <li>
                    作成した実行ロールのARNを <code>.env</code> の<code>AWS_ARN_ROLE</code>
                    に設定し、<code>AWS_REGION</code>(例:<code>eu-central-1</code>)も設定する
                  </li>
                  <li>
                    <strong>運用用の最小権限ユーザーを別途作成する</strong>
                    :SageMakerの学習・デプロイ・推論に必要な権限のみを付与したIAMユーザーを作成してアクセスキーを発行し、
                    <code>.env</code>の <code>AWS_ACCESS_KEY</code> と<code>AWS_SECRET_KEY</code>{" "}
                    をそのユーザーの値に置き換える(管理者キーを
                    <code>.env</code> に残さない)
                  </li>
                  <li>
                    <strong>ブートストラップ用の管理者キーは無効化または削除する</strong>
                    。以降の操作は最小権限ユーザーの認証情報だけで行う
                  </li>
                </ul>
                <p>
                  手順の詳細は公式リポジトリの
                  <a
                    href="https://github.com/PacktPublishing/LLM-Engineers-Handbook/blob/main/README.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    README.md
                  </a>
                  を参照してください。以上を済ませてから、学習・評価・推論エンドポイントのデプロイに進みます。
                </p>
              </div>
            </div>

            <h3>
              <span className={styles.h3Num}>c</span>プロジェクト構成の考え方
            </h3>
            <p>
              コードは<strong>ドメイン駆動設計(DDD)</strong>の思想に基づき、<code>domain/</code>
              (コアなビジネスエンティティ)→<code>application/</code>
              (クローラーやRAGなどのビジネスロジック)→<code>model/</code>(学習・推論)→
              <code>infrastructure/</code>
              (AWS・Qdrant・MongoDB・FastAPIなど外部サービス連携)という層に分割されています。パイプライン全体の入口は
              <code>pipelines/</code>
              ディレクトリのZenMLパイプライン定義であり、迷ったときはまずここから読むのが公式README推奨のアプローチです。
            </p>
          </section>

          {/* ===================== TOOLS ===================== */}
          <section className={styles.section} id="tools">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-stack-2" />
              </span>
              <h2>使用される主要ツール・サービス一覧</h2>
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>カテゴリ</th>
                    <th>ツール/サービス</th>
                    <th>役割</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>依存関係管理</td>
                    <td>Poetry</td>
                    <td>Python仮想環境・パッケージ管理</td>
                  </tr>
                  <tr>
                    <td>タスク実行</td>
                    <td>Poe the Poet</td>
                    <td>プロジェクトコマンドのタスクランナー</td>
                  </tr>
                  <tr>
                    <td>オーケストレーション</td>
                    <td>ZenML</td>
                    <td>MLパイプライン・アーティファクト・メタデータの管理</td>
                  </tr>
                  <tr>
                    <td>実験管理</td>
                    <td>Comet ML</td>
                    <td>学習実験のトラッキング</td>
                  </tr>
                  <tr>
                    <td>プロンプト監視</td>
                    <td>Opik(Comet提供)</td>
                    <td>LLMアプリのプロンプト・トレース監視</td>
                  </tr>
                  <tr>
                    <td>モデルレジストリ</td>
                    <td>Hugging Face</td>
                    <td>学習済みモデル・データセットの保存/共有</td>
                  </tr>
                  <tr>
                    <td>NoSQL DB</td>
                    <td>MongoDB</td>
                    <td>クロールした生データの格納(データウェアハウス)</td>
                  </tr>
                  <tr>
                    <td>ベクトルDB</td>
                    <td>Qdrant</td>
                    <td>埋め込みベクトルの格納・検索</td>
                  </tr>
                  <tr>
                    <td>クラウド計算基盤</td>
                    <td>AWS(SageMaker等)</td>
                    <td>モデルの学習・推論の計算リソース</td>
                  </tr>
                  <tr>
                    <td>CI/CD</td>
                    <td>GitHub Actions</td>
                    <td>Lint・テスト・ビルド・デプロイの自動化</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ===================== PREREQUISITES ===================== */}
          <section className={styles.section} id="prerequisites">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-school" />
              </span>
              <h2>読む前に押さえておきたい前提知識</h2>
            </div>
            <p>
              O&apos;Reilly公式ページでは「Python・AWS・一般的なAIの概念にある程度慣れていること」が想定読者像として挙げられており、Help
              Net
              Securityのレビューでも「LLMの概念・ベクトルDB・MLOpsパターンに一定の土地勘があることを前提にしている」と指摘されています。次の3点に不安がある場合は、並行して基礎を補うことをおすすめします。
            </p>
            <ul>
              <li>
                <strong>Python実務経験</strong>:型ヒント、パッケージ管理(Poetry)、非同期処理・REST
                APIの基礎的な読み書きができるレベル
              </li>
              <li>
                <strong>クラウドの基礎</strong>
                :AWSアカウント作成、IAMユーザー・アクセスキーの概念、従量課金への理解
              </li>
              <li>
                <strong>機械学習・LLMの基礎用語</strong>
                :ファインチューニング、埋め込み(embedding)、ベクトル検索、プロンプトといった用語に一度でも触れたことがある状態
              </li>
            </ul>
            <p>
              これらの前提知識を補いたい場合、著者の一人であるMaxime Labonne氏が公開している無料の
              <strong>「LLM Course」</strong>
              (GitHub上で8万スター超)は、LLMの基礎からファインチューニング・量子化までをロードマップ形式で学べる教材として、本書と併読する形で参照されることが多い教材です。
            </p>
          </section>

          {/* ===================== FAQ ===================== */}
          <section className={styles.section} id="faq">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-help-circle" />
              </span>
              <h2>よくある質問(FAQ)</h2>
            </div>

            <h3>
              <span className={styles.h3Num}>Q</span>プログラミング初心者でもいきなり読めますか?
            </h3>
            <p>
              本書自体はO&apos;Reillyの表示どおり「中級〜上級」向けであり、Pythonの実務経験がまったくない状態でいきなり全章を実装するのは難易度が高めです。まずはPythonの基礎とAPI/クラウドの基本概念を押さえたうえで、第1〜2章で全体設計とツール群を理解し、写経しながら第3章以降に進むのが挫折しにくい進め方です。
            </p>

            <h3>
              <span className={styles.h3Num}>Q</span>高性能なGPUを持っていなくても実践できますか?
            </h3>
            <p>
              学習・推論はAWS
              SageMaker上で行う設計になっており、ローカルに強力なGPUがなくても進められます。ただしAWSやOpenAI
              APIは従量課金のため、公式リポジトリのREADMEでは一通り実行した場合のコスト目安として
              <strong>約25米ドル</strong>が案内されています。
            </p>

            <h3>
              <span className={styles.h3Num}>Q</span>日本語で読めるバージョンはありますか?
            </h3>
            <p>
              2026年9月時点で調査した範囲では、原著は英語版のみの提供です(O&apos;Reilly上の書誌情報でも言語表示は英語)。
            </p>

            <h3>
              <span className={styles.h3Num}>Q</span>
              この本と、実務でよく聞く「LLMOps」はどう関係していますか?
            </h3>
            <p>
              第11章がまさにLLMOpsの章にあたり、DevOps→MLOps→LLMOpsという発展の流れと、人間フィードバック・ガードレール・プロンプト監視といったLLM特有の運用要素を、本書のLLM
              Twinプロジェクトに実装する形で学べます。
            </p>

            <h3>
              <span className={styles.h3Num}>Q</span>
              本を読まずにGitHubリポジトリだけ動かすことはできますか?
            </h3>
            <p>
              技術的には可能ですが、公式READMEでも「Chapter 2で各ツールの解説、Chapter
              10・11で環境構築のステップバイステップ手順を説明している」と案内されているとおり、書籍本文がセットアップ手順の解説を兼ねているため、つまずいたときは該当章を参照するのがスムーズです。
            </p>
          </section>

          {/* ===================== SUMMARY ===================== */}
          <section className={styles.section} id="summary">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-flag" />
              </span>
              <h2>まとめ</h2>
            </div>
            <p>
              「LLM Engineer&apos;s
              Handbook」は、単なるプロンプトエンジニアリング入門や理論書ではなく、
              <strong>
                「LLM
                Twin」という1つの具体的な製品を、FTIパイプラインという明確な設計原則のもとで、データ収集からファインチューニング・評価・推論最適化・クラウドデプロイ・LLMOps運用まで一気通貫で作り切る
              </strong>
              、非常に実務密着型の一冊です。Hugging Face CTO Julien
              Chaumond氏の推薦や、著名なLLM/RAG実務者のリソース集への掲載、GitHub公式リポジトリの活発な運用状況などからも、国際的なAI/ML実務者コミュニティで高く評価されていることがうかがえます。
            </p>
            <p>
              一方で複数のレビューが指摘するとおり、対象読者は中級〜上級エンジニアであり、Python・クラウド・LLM/ベクトルDBの基礎知識がある程度求められます。本ガイドで示したロードマップのように、環境構築(第2章)→全体設計の理解(第1章)→データ・RAG(第3〜4章)→学習(第5〜6章)→評価(第7章)→最適化(第8〜9章)→デプロイ・運用(第10〜11章)という順序で、公式GitHubリポジトリのコードを実際に手元で動かしながら読み進めることで、初学者でも着実に本書の価値を引き出せるはずです。
            </p>
          </section>

          {/* ===================== REFERENCES ===================== */}
          <section className={styles.section} id="references">
            <div className={styles.sectionHead}>
              <span className={styles.iconBadge}>
                <i className="ti ti-link" />
              </span>
              <h2>参考文献・出典URL一覧</h2>
            </div>
            <ul className={styles.refList}>
              <li>
                <div className={styles.refTitle}>
                  O&apos;Reilly公式書籍ページ(目次・概要・著者紹介)
                </div>
                <a
                  href="https://www.oreilly.com/library/view/llm-engineers-handbook/9781836200079/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.oreilly.com/library/view/llm-engineers-handbook/9781836200079/
                </a>
              </li>
              <li>
                <div className={styles.refTitle}>
                  公式GitHubリポジトリ(コード・README・セットアップ手順)
                </div>
                <a
                  href="https://github.com/PacktPublishing/LLM-Engineers-Handbook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/PacktPublishing/LLM-Engineers-Handbook
                </a>
              </li>
              <li>
                <div className={styles.refTitle}>Amazon書籍ページ</div>
                <a
                  href="https://www.amazon.com/LLM-Engineers-Handbook-engineering-production/dp/1836200072/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.amazon.com/LLM-Engineers-Handbook-engineering-production/dp/1836200072/
                </a>
              </li>
              <li>
                <div className={styles.refTitle}>Packt公式製品ページ</div>
                <a
                  href="https://www.packtpub.com/en-us/product/llm-engineers-handbook-9781836200062"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.packtpub.com/en-us/product/llm-engineers-handbook-9781836200062
                </a>
              </li>
              <li>
                <div className={styles.refTitle}>
                  Help Net Security によるレビュー(Mirko Zorz氏、2025年7月28日)
                </div>
                <a
                  href="https://www.helpnetsecurity.com/2025/07/28/review-llm-engineers-handbook/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.helpnetsecurity.com/2025/07/28/review-llm-engineers-handbook/
                </a>
              </li>
              <li>
                <div className={styles.refTitle}>
                  Javarevisited(Medium)によるレビュー(javinpaul氏、2025年6月20日)
                </div>
                <a
                  href="https://medium.com/javarevisited/review-is-the-llm-engineers-handbook-by-paul-iusztin-and-maxime-labonne-worth-it-7d075148c2bc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://medium.com/javarevisited/review-is-the-llm-engineers-handbook-by-paul-iusztin-and-maxime-labonne-worth-it-7d075148c2bc
                </a>
              </li>
              <li>
                <div className={styles.refTitle}>
                  awesome-llm-books(Jason Brownlee氏キュレーション、Julien
                  Chaumond氏の推薦文・評価スコアを収録)
                </div>
                <a
                  href="https://github.com/Jason2Brownlee/awesome-llm-books/blob/main/books/llm-engineer's-handbook.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/Jason2Brownlee/awesome-llm-books/blob/main/books/llm-engineer&apos;s-handbook.md
                </a>
              </li>
              <li>
                <div className={styles.refTitle}>
                  SylphAI-Inc/LLM-engineer-handbook(著名開発者の関連リソースと並んでの紹介)
                </div>
                <a
                  href="https://github.com/SylphAI-Inc/LLM-engineer-handbook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/SylphAI-Inc/LLM-engineer-handbook
                </a>
              </li>
              <li>
                <div className={styles.refTitle}>
                  duarteocarmo氏によるLLM/RAGおすすめリソース集(GitHub Gist)
                </div>
                <a
                  href="https://gist.github.com/duarteocarmo/bc9365ac63744234f5030b87f912669e"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://gist.github.com/duarteocarmo/bc9365ac63744234f5030b87f912669e
                </a>
              </li>
              <li>
                <div className={styles.refTitle}>DataTalks.Club「Book of the Week」紹介ページ</div>
                <a
                  href="https://datatalks.club/books/20241104-llm-engineer-s-handbook.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://datatalks.club/books/20241104-llm-engineer-s-handbook.html
                </a>
              </li>
              <li>
                <div className={styles.refTitle}>Paul Iusztin氏 GitHubプロフィール</div>
                <a href="https://github.com/iusztinpaul" target="_blank" rel="noopener noreferrer">
                  https://github.com/iusztinpaul
                </a>
              </li>
              <li>
                <div className={styles.refTitle}>Maxime Labonne氏 GitHubプロフィール</div>
                <a href="https://github.com/mlabonne" target="_blank" rel="noopener noreferrer">
                  https://github.com/mlabonne
                </a>
              </li>
              <li>
                <div className={styles.refTitle}>
                  Maxime Labonne氏「LLM Course」(GitHub、8万スター超)
                </div>
                <a
                  href="https://github.com/mlabonne/llm-course"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/mlabonne/llm-course
                </a>
              </li>
              <li>
                <div className={styles.refTitle}>
                  学習済みモデル(TwinLlama-3.1-8B-DPO、Hugging Face)
                </div>
                <a
                  href="https://huggingface.co/mlabonne/TwinLlama-3.1-8B-DPO"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://huggingface.co/mlabonne/TwinLlama-3.1-8B-DPO
                </a>
              </li>
            </ul>
          </section>
        </div>

        <footer className={styles.footer}>
          本ガイドは上記ソースの内容を要約・翻訳・再構成したものであり、原文からの長文引用は行っていません。より正確・網羅的な情報は、必ず一次情報源(特にO&apos;Reilly公式ページおよびGitHub公式リポジトリ)をご確認ください。
        </footer>
      </main>

      <TocObserver />
    </div>
  );
}
