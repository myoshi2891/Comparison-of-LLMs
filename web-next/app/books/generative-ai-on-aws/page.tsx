import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";
export const metadata: Metadata = {
  title:
    "初学者向けガイド：Generative AI on AWS ― コンテキスト認識型マルチモーダル推論アプリケーションの構築 | LLM コスト計算機",
  description:
    "『Generative AI on AWS』の全12章を、生成AIの基礎から最適化・RAG・マルチモーダル・Amazon Bedrockまで順に学ぶ初学者向けガイド。2026年9月10日時点の補足情報、13項目のチェックリストと23件の出典を収録。",
};
const THEME = {
  primaryColor: "#fffdf8",
  primaryBorderColor: "#3f3d8a",
  primaryTextColor: "#2a2418",
  lineColor: "#7a3b63",
  fontFamily: "Noto Sans JP, sans-serif",
  fontSize: "16px",
  edgeLabelBackground: "#faf6ec",
} as const;
const DIAGRAM_ROADMAP = `flowchart TB
    P1["フェーズ1 基礎を学ぶ 第1〜3章"] --> A1["生成AIのユースケースとプロジェクトライフサイクル"]
    A1 --> A2["プロンプトエンジニアリングとインコンテキスト学習"]
    A2 --> A3["大規模言語基盤モデルの仕組み"]
    A3 --> P2["フェーズ2 モデルを適応させる 第4〜8章"]
    P2 --> B1["メモリと計算の最適化"]
    B1 --> B2["ファインチューニングと評価"]
    B2 --> B3["パラメータ効率の良いファインチューニング LoRAとQLoRA"]
    B3 --> B4["RLHFによる人間整合"]
    B4 --> B5["モデルデプロイの最適化"]
    B5 --> P3["フェーズ3 アプリケーションを組む 第9〜11章"]
    P3 --> C1["RAGとエージェントによるコンテキスト認識推論"]
    C1 --> C2["マルチモーダル基盤モデル"]
    C2 --> C3["Stable Diffusionの制御生成とファインチューニング"]
    C3 --> P4["フェーズ4 AWSで実装する 第12章"]
    P4 --> D1["Amazon Bedrock マネージド生成AIサービス"]
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#3f3d8a,stroke-width:1px;
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;
    class P1 hub;
    class D1 done;`;
const DIAGRAM_LIFECYCLE = `flowchart TB
    A["ユースケースの定義 業務課題とゴールを明確化"] --> B["基盤モデルの選定 Model Hubから候補を比較"]
    B --> C["プロンプトエンジニアリング Zero-Shot・One-Shot・Few-Shotで試行"]
    C --> D{"性能は十分か"}
    D -->|"はい"| H["アプリケーション統合 RAG・エージェント連携"]
    D -->|"いいえ"| E["ファインチューニング 指示チューニング・LoRA等"]
    E --> G["評価 ベンチマーク・人手評価"]
    E -.->|"任意 価値観との整合が必要な場合"| F["人間フィードバックによる整合 RLHF"]
    F --> G
    G --> D
    H --> I["デプロイ最適化 量子化・蒸留・オートスケーリング"]
    I --> J["継続的モニタリング 本番運用とフィードバック収集"]
    J -.->|"改善サイクル"| A
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#3f3d8a,stroke-width:1px;
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;
    class A hub;
    class J done;`;
const DIAGRAM_TRANSFORMER = `flowchart TB
    INPUT["入力処理"] --> A["入力テキスト"]
    A --> B["トークナイザ テキストをトークンIDへ分割"]
    B --> C["埋め込み層 トークンをベクトル化"]
    C --> D["位置エンコーディング 語順情報を付加"]
    D --> ENC["エンコーダ"]
    ENC --> E["自己注意層 Self-Attention"]
    E --> F["フィードフォワード層 FFN"]
    T["デコーダ入力 1つ右にずらした出力系列"] --> DEC["デコーダ"]
    DEC --> G["マスク付き自己注意層 Masked Self-Attention"]
    G -->|"クエリQ"| H["エンコーダ-デコーダ注意層 Cross-Attention"]
    F -->|"エンコーダ出力をキーとバリューとして供給"| H
    H --> I["フィードフォワード層 FFN"]
    I --> J["Softmax出力層 次トークンの確率分布"]
    J --> K["生成テキスト"]
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#3f3d8a,stroke-width:1px;
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;
    class INPUT hub;
    class K done;`;
const DIAGRAM_LORA = `flowchart LR
    E["入力x"] --> A["元の重み行列W 凍結・更新なし"]
    E --> B["低ランク行列A"]
    B --> C["低ランク行列B"]
    A -->|"元の重みによる出力"| S["加算"]
    C -->|"低ランク行列による差分出力"| S
    S --> D["出力"]
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#3f3d8a,stroke-width:1px;
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;
    class E hub;
    class D done;`;
const DIAGRAM_RLHF = `flowchart TB
    A["指示チューニング済みモデル SFTモデル"] --> B["同一プロンプトに対し複数の応答を生成"]
    B --> C["人間のラベラーが応答をランキング評価"]
    C --> D["報酬モデルを訓練 Reward Model"]
    D --> E["ポリシーモデルがプロンプトへの応答を生成"]
    E --> F["報酬モデルで応答をスコアリング"]
    F --> G["PPOでポリシーモデルを更新 Proximal Policy Optimization"]
    G --> H{"報酬は改善したか"}
    H -->|"はい"| I["人間の価値観に整合したRLHF済みモデル"]
    H -->|"いいえ・過学習の兆候"| J["報酬ハッキングを緩和 KLダイバージェンス制約など"]
    J --> E
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#3f3d8a,stroke-width:1px;
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;
    class A hub;
    class I done;`;
const DIAGRAM_RAG = `flowchart TB
    A["ユーザーの質問"] --> B["クエリを埋め込みベクトルに変換"]
    B --> C["ベクトルストアで類似検索 Vector Store"]
    C --> D["関連文書チャンクを取得 Document Retrieval"]
    D --> E["最大限界関連性で再ランキング Maximum Marginal Relevance"]
    E --> F["取得した文脈をプロンプトに追加 Prompt Augmentation"]
    F --> G["LLMが文脈をもとに推論"]
    G --> H["根拠に基づく回答を生成"]
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#3f3d8a,stroke-width:1px;
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;
    class A hub;
    class H done;`;
const DIAGRAM_REACT = `flowchart TB
    A["ユーザーのゴール"] --> B["思考 Thought 次に何をすべきか推論"]
    B --> C["行動 Action ツールやAPIを呼び出す"]
    C --> D["観察 Observation ツールの実行結果を取得"]
    D --> E{"ゴールは達成されたか"}
    E -->|"いいえ"| B
    E -->|"はい"| F["最終回答を返す"]
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#3f3d8a,stroke-width:1px;
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;
    class A hub;
    class F done;`;
const DIAGRAM_DIFFUSION = `flowchart TB
    FWD["前方拡散プロセス Forward Diffusion 学習時のみ"] --> A["学習データの元画像"]
    A --> B["少しノイズを加える"]
    B --> C["さらにノイズを加える 繰り返し"]
    C --> D["ノイズを加えた画像 ノイズ予測の学習教材"]
    REV["逆拡散プロセス Reverse Diffusion 生成時"] --> UNET["U-Net内部の処理"]
    N["初期ノイズ ガウス分布からサンプリング 潜在空間のノイズ"] --> UNET
    E["テキストプロンプト 条件付け"] --> UNET
    UNET --> F["クロスアテンション層でテキスト条件を内部に注入"]
    F --> G["ノイズを予測"]
    G --> H["予測ノイズを除去して1ステップ更新"]
    H -.->|"ステップを反復"| F
    D -.->|"ノイズ予測器の学習 学習時の入力"| F
    H --> I["生成された画像"]
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#3f3d8a,stroke-width:1px;
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;
    class REV hub;
    class I done;`;
const DIAGRAM_BEDROCK = `flowchart TB
    A["アプリケーション Web・モバイル・業務システム"] --> B["Amazon Bedrock 統合API"]
    B --> GI["ガードレール 推論前の入力評価"]
    GI --> C["基盤モデル群 Titan・Claude・Stable Diffusion等"]
    GI --> D["ナレッジベース Knowledge Base for RAG"]
    GI --> E["エージェント Agents for Bedrock"]
    D --> DR["検索結果 参照文書・引用元 ガードレール評価の対象外"]
    DR --> C
    C --> GO["ガードレール 推論後の応答評価"]
    E --> GO
    GO --> G["推論結果"]
    G --> A
    X["推論フロー全体を横断する統制 データプライバシー・ネットワークセキュリティ・ガバナンス"]
    X -.-> B
    X -.-> GI
    X -.-> C
    X -.-> D
    X -.-> DR
    X -.-> E
    X -.-> GO
    AC["Amazon Bedrock AgentCore エージェント・Gateway・Memory"]
    MKB["Bedrock Managed Knowledge Base"]
    OBS["AgentCore Observability 対象はAgentCoreのリソースのみ"]
    OBS -.-> AC
    OBS -.->|"統合"| MKB
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#3f3d8a,stroke-width:1px;
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;
    class A hub;
    class G done;`;
const VARIANT_PLAIN = "info";
const VARIANT_FOREST = "good";
export default function Page() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap"
        rel="stylesheet"
        precedence="aws-guide"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.46.0/dist/tabler-icons.min.css"
        integrity="sha384-ND+q1IVc0KDElX60dZaqKc7Xl9cdxd2PpU2JfVUHcurCkFVtVLFdt9vJfxtHSL3p"
        crossOrigin="anonymous"
        precedence="aws-guide"
      />
      <div className={styles.layout} data-testid="layout-root">
        <div className={styles.scrim} id="scrim"></div>
        <div className={styles.mobileBar}>
          <div className={styles.brand}>
            <i className="ti ti-book-2"></i>
            {"Generative AI on AWS"}
          </div>
          <button
            id="menuToggle"
            type="button"
            aria-label="目次を開く"
            aria-expanded="false"
            aria-controls="sidebar"
          >
            <i className="ti ti-menu-2"></i>
            {"メニュー"}
          </button>
        </div>
        <nav className={styles.sidebar} id="sidebar" data-testid="sidebar-nav">
          <div className={styles.brand}>
            <i className="ti ti-book-2"></i>
            {"Gen AI on AWS ガイド"}
          </div>
          <ul className={styles.sidebarNav}>
            <li>
              <a
                className={styles.navA + " " + styles.active}
                href="#intro"
                data-testid="sidebar-nav-link"
              >
                <i className="ti ti-sparkles"></i>
                {"はじめに"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#book-info" data-testid="sidebar-nav-link">
                <i className="ti ti-file-text"></i>
                {"書籍の基本情報"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#authors" data-testid="sidebar-nav-link">
                <i className="ti ti-users"></i>
                {"著者について"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#audience" data-testid="sidebar-nav-link">
                <i className="ti ti-target"></i>
                {"対象読者と読み方"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#roadmap" data-testid="sidebar-nav-link">
                <i className="ti ti-map-2"></i>
                {"学習ロードマップ"}
              </a>
            </li>
          </ul>
          <div className={styles.navGroupLabel}>{"ステップバイステップ"}</div>
          <ul className={styles.sidebarNav}>
            <li>
              <a className={styles.navA} href="#step-1" data-testid="sidebar-nav-link">
                <span className={styles.nNum}>{"1"}</span>
                <i className="ti ti-route"></i>
                {"ユースケースとライフサイクル"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#step-2" data-testid="sidebar-nav-link">
                <span className={styles.nNum}>{"2"}</span>
                <i className="ti ti-message-2"></i>
                {"プロンプトエンジニアリング"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#step-3" data-testid="sidebar-nav-link">
                <span className={styles.nNum}>{"3"}</span>
                <i className="ti ti-brain"></i>
                {"大規模言語基盤モデル"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#step-4" data-testid="sidebar-nav-link">
                <span className={styles.nNum}>{"4"}</span>
                <i className="ti ti-cpu"></i>
                {"メモリと計算の最適化"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#step-5" data-testid="sidebar-nav-link">
                <span className={styles.nNum}>{"5"}</span>
                <i className="ti ti-adjustments"></i>
                {"ファインチューニングと評価"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#step-6" data-testid="sidebar-nav-link">
                <span className={styles.nNum}>{"6"}</span>
                <i className="ti ti-puzzle"></i>
                {"LoRA・QLoRA"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#step-7" data-testid="sidebar-nav-link">
                <span className={styles.nNum}>{"7"}</span>
                <i className="ti ti-git-branch"></i>
                {"RLHF"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#step-8" data-testid="sidebar-nav-link">
                <span className={styles.nNum}>{"8"}</span>
                <i className="ti ti-server-2"></i>
                {"モデルデプロイの最適化"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#step-9" data-testid="sidebar-nav-link">
                <span className={styles.nNum}>{"9"}</span>
                <i className="ti ti-search"></i>
                {"RAGとエージェント"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#step-10" data-testid="sidebar-nav-link">
                <span className={styles.nNum}>{"10"}</span>
                <i className="ti ti-photo"></i>
                {"マルチモーダル基盤モデル"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#step-11" data-testid="sidebar-nav-link">
                <span className={styles.nNum}>{"11"}</span>
                <i className="ti ti-wand"></i>
                {"制御生成とファインチューニング"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#step-12" data-testid="sidebar-nav-link">
                <span className={styles.nNum}>{"12"}</span>
                <i className="ti ti-cloud-computing"></i>
                {"Amazon Bedrock"}
              </a>
            </li>
          </ul>
          <div className={styles.navGroupLabel}>{"仕上げ"}</div>
          <ul className={styles.sidebarNav}>
            <li>
              <a className={styles.navA} href="#updates" data-testid="sidebar-nav-link">
                <i className="ti ti-refresh"></i>
                {"2026年9月の最新動向"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#resources" data-testid="sidebar-nav-link">
                <i className="ti ti-external-link"></i>
                {"おすすめリソース"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#checklist" data-testid="sidebar-nav-link">
                <i className="ti ti-checklist"></i>
                {"理解度チェックリスト"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#summary" data-testid="sidebar-nav-link">
                <i className="ti ti-flag-3"></i>
                {"まとめ"}
              </a>
            </li>
            <li>
              <a className={styles.navA} href="#references" data-testid="sidebar-nav-link">
                <i className="ti ti-bookmark"></i>
                {"参考文献・出典"}
              </a>
            </li>
          </ul>
        </nav>
        <main className={styles.main}>
          <div className={styles.content}>
            <section className={styles.hero} id="top">
              <div className={styles.heroKicker}>{"初学者向け ステップバイステップガイド"}</div>
              <h1>
                {" Generative AI on AWS"}
                <br />
                {"コンテキスト認識型マルチモーダル推論アプリケーションの構築 "}
              </h1>
              <p>
                {
                  " O'Reilly刊『Generative AI on AWS: Building Context-Aware Multimodal Reasoning Applications』（Chris Fregly、Antje Barth、Shelbee Eigenbrode 著）の内容を、初めて生成AIを学ぶ人でも理解できるようステップバイステップで解説します。2026年9月10日時点の最新情報も踏まえてアップデートしています。 "
                }
              </p>
              <div className={styles.heroMeta}>
                <span>
                  <i className="ti ti-building-bank"></i>
                  {"O'Reilly Media"}
                </span>
                <span>
                  <i className="ti ti-calendar"></i>
                  {"2023年11月刊行"}
                </span>
                <span>
                  <i className="ti ti-stack-2"></i>
                  {"全12章"}
                </span>
                <span>
                  <i className="ti ti-refresh"></i>
                  {"2026年9月更新情報つき"}
                </span>
              </div>
            </section>
            <section className={styles.section} id="intro">
              <div className={styles.sectionKicker}>
                <i className="ti ti-sparkles"></i>
                {"INTRODUCTION"}
              </div>
              <h2 id="intro-heading">{"はじめに"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 生成AI（Generative AI）は2023年前後から爆発的に注目を集め、今では多くの企業が自社の製品やサービスに組み込もうとしています。しかし「大規模言語モデルをAPIで呼び出せば終わり」という単純な話ではなく、ユースケースの定義からモデル選定、プロンプト設計、ファインチューニング、人間の価値観への整合（アライメント）、そして本番環境への安全なデプロイまで、一連のプロジェクトライフサイクルを理解する必要があります。 "
                  }
                </p>
                <p>
                  {
                    " 本書『Generative AI on AWS』は、AWSの機械学習分野の専門家3名が、この一連のライフサイクル全体を体系的に解説した一冊です。原題のサブタイトルが示す通り、単なるテキスト生成にとどまらず、検索拡張生成（RAG）やエージェントを使った「コンテキストを理解する」アプリケーション、そして画像を含む「マルチモーダルな推論」を行うアプリケーションの構築までをカバーしているのが大きな特徴です。 "
                  }
                </p>
                <p>
                  {
                    " 本ガイドでは、この書籍の12章構成を1つずつ「Step」として区切り、各章で扱われている概念を図解（Mermaid）とともに初学者向けに噛み砕いて説明します。あわせて、書籍刊行（2023年11月）以降にAmazon Bedrockまわりで起きた大きな変化についても、2026年9月時点の情報で補足します。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="book-info">
              <div className={styles.sectionKicker}>
                <i className="ti ti-file-text"></i>
                {"BOOK INFO"}
              </div>
              <h2 id="book-info-heading">{"書籍の基本情報"}</h2>
              <div className={styles.tableWrap}>
                <div className={styles.tableTitle}>{"書籍データ"}</div>
                <table className={styles.kvTable}>
                  <tbody>
                    <tr>
                      <th>{"タイトル"}</th>
                      <td>
                        {
                          " Generative AI on AWS: Building Context-Aware Multimodal Reasoning Applications "
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>{"著者"}</th>
                      <td>{"Chris Fregly、Antje Barth、Shelbee Eigenbrode"}</td>
                    </tr>
                    <tr>
                      <th>{"出版社"}</th>
                      <td>{"O'Reilly Media, Inc."}</td>
                    </tr>
                    <tr>
                      <th>{"刊行日"}</th>
                      <td>{"2023年11月"}</td>
                    </tr>
                    <tr>
                      <th>{"ページ数"}</th>
                      <td>{"312ページ"}</td>
                    </tr>
                    <tr>
                      <th>{"オーディオブック"}</th>
                      <td>{"約8時間15分（音声版あり）"}</td>
                    </tr>
                    <tr>
                      <th>{"対象レベル"}</th>
                      <td>{"中級〜上級（Intermediate to advanced）"}</td>
                    </tr>
                    <tr>
                      <th>{"言語"}</th>
                      <td>{"英語"}</td>
                    </tr>
                    <tr>
                      <th>{"章構成"}</th>
                      <td>{"序文＋全12章＋索引＋著者紹介"}</td>
                    </tr>
                    <tr>
                      <th>{"サンドボックス"}</th>
                      <td>{"O'Reillyプラットフォーム上でハンズオン実行環境（Sandbox）が付属"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " 本書は「Intermediate to advanced（中級〜上級）」向けと位置づけられており、Transformerや機械学習の基礎用語にある程度触れたことがある読者を想定しています。本ガイドはその内容を、初学者でも概念のつながりを見失わないように順序立てて解説する「地図」として使うことを意図しています。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="authors">
              <div className={styles.sectionKicker}>
                <i className="ti ti-users"></i>
                {"AUTHORS"}
              </div>
              <h2 id="authors-heading">{"著者について"}</h2>
              <div className={styles.peopleGrid}>
                <div className={styles.personCard}>
                  <h4>{"Chris Fregly"}</h4>
                  <p>
                    {
                      " AWSで生成AI関連の専門家として活動し、本書の姉妹書にあたる『Data Science on AWS』の共著者でもあります。 "
                    }
                  </p>
                </div>
                <div className={styles.personCard}>
                  <h4>{"Antje Barth"}</h4>
                  <p>
                    {
                      " AWSでAI/ML分野のPrincipal Developer Advocateを務め、「Generative AI on AWS Meetup」というグローバルなコミュニティの共同創設者です。AI・機械学習系カンファレンスでの登壇も多数。 "
                    }
                  </p>
                </div>
                <div className={styles.personCard}>
                  <h4>{"Shelbee Eigenbrode"}</h4>
                  <p>
                    {
                      " AWSで生成AI分野のPrincipal Solutions Architectを務め、「Women in Big Data」デンバー支部の共同創設者でもあります。 "
                    }
                  </p>
                </div>
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " 3人ともAWSの実務側から生成AIプロジェクトに深く関わってきた実践者であり、本書はアカデミックな理論書というより「実際にAWS上で生成AIアプリケーションを構築するための実務書」という色合いが強い構成になっています。 "
                  }
                </p>
              </div>
              <div
                className={styles.callout + " " + styles.gold}
                data-testid="callout"
                data-variant={VARIANT_PLAIN}
              >
                <i className="ti ti-quote"></i>
                <div className={styles.calloutBody}>
                  <p>
                    {
                      " MetaのApplied AIリーダーであるGeeta Chauhan氏は、実践的に生成AIを構築するための資料として本書を高く評価するコメントを寄せており、HRS GroupのデータサイエンスプラットフォームディレクターであるOlalekan Elesin氏も、AWS上で大規模に生成AIアプリケーションを構築する人にとって必読の一冊だと推薦しています（詳細は参考文献5を参照）。 "
                    }
                  </p>
                </div>
              </div>
            </section>
            <section className={styles.section} id="audience">
              <div className={styles.sectionKicker}>
                <i className="ti ti-target"></i>
                {"WHO IS THIS FOR"}
              </div>
              <h2 id="audience-heading">{"対象読者と本ガイドの読み方"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " O'Reillyの紹介文によれば、本書はCTO、機械学習エンジニア、アプリケーション開発者、ビジネスアナリスト、データエンジニア、データサイエンティストなど、幅広い職種を対象としています。本ガイドでは、特に次のような方を想定しています。 "
                  }
                </p>
                <ul>
                  <li>
                    {"生成AIという言葉は知っているが、プロジェクトの全体像がつかめていない方"}
                  </li>
                  <li>
                    {
                      " プロンプトエンジニアリングまでは触れたことがあるが、ファインチューニングやRAGの仕組みが曖昧な方 "
                    }
                  </li>
                  <li>
                    {
                      " AWS上で本格的に生成AIアプリケーションを作りたいが、どのサービスをどう組み合わせればよいか整理したい方 "
                    }
                  </li>
                </ul>
                <p>
                  {
                    " 各Stepは独立して読めるように構成していますが、初めての方は上から順に読むことで、生成AIプロジェクトの一連の流れ（ライフサイクル）が自然につながって理解できるようになっています。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="roadmap">
              <div className={styles.sectionKicker}>
                <i className="ti ti-map-2"></i>
                {"ROADMAP"}
              </div>
              <h2 id="roadmap-heading">{"学習ロードマップ全体像"}</h2>
              <div className={styles.prose}>
                <p>{"本書の12章は、大きく4つのフェーズに分けて捉えると理解しやすくなります。"}</p>
              </div>
              <div className={styles.diagramCaption}>
                <i className="ti ti-chart-dots-3"></i>
                {"図：12章を4フェーズに整理した学習ロードマップ "}
              </div>
              <div className={styles.diagramWrap}>
                <MermaidDiagram
                  id="aws-diagram-roadmap"
                  chart={DIAGRAM_ROADMAP}
                  theme="base"
                  themeVariables={THEME}
                  flowchartHtmlLabels={false}
                />
              </div>
              <div className={styles.prose}>
                <ul>
                  <li>
                    <strong>{"フェーズ1（第1〜3章）"}</strong>
                    {
                      "：生成AIとは何か、どんなユースケースがあるか、そしてその中核であるTransformerベースの基盤モデルがどう動くかという「土台」を学びます。 "
                    }
                  </li>
                  <li>
                    <strong>{"フェーズ2（第4〜8章）"}</strong>
                    {
                      "：巨大なモデルを実際に動かす・調整するための技術的な工夫（メモリ最適化、ファインチューニング、RLHF、デプロイ最適化）を学びます。 "
                    }
                  </li>
                  <li>
                    <strong>{"フェーズ3（第9〜11章）"}</strong>
                    {
                      "：本書のサブタイトルにある「コンテキスト認識」「マルチモーダル」なアプリケーションの作り方、すなわちRAG・エージェント・画像生成モデルを学びます。 "
                    }
                  </li>
                  <li>
                    <strong>{"フェーズ4（第12章）"}</strong>
                    {
                      "：これまで学んだ内容を、AWSのマネージドサービスであるAmazon Bedrockを使って実装する方法を学びます。 "
                    }
                  </li>
                </ul>
                <p>{"それでは、各章を1つずつStepとして見ていきましょう。"}</p>
              </div>
            </section>
            <section className={styles.section} id="step-1">
              <div className={styles.stepMarker}>
                <span className={styles.stepNum}>{"1"}</span>
                <span className={styles.stepTag} data-testid="step-tag">
                  {"第1章"}
                </span>
              </div>
              <h2 id="step-1-heading">
                {"生成AIのユースケースと基礎、プロジェクトライフサイクル"}
              </h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 第1章は本書全体の地図にあたる章です。まず生成AIがどのようなタスク（テキスト生成、要約、翻訳、質問応答、コード生成など）に使えるかを整理し、次に「基盤モデル（Foundation Model）」と「モデルハブ（Model Hub）」という考え方を紹介します。基盤モデルとは、大量のデータで事前学習された汎用モデルのことで、Hugging Face HubやAmazon SageMaker JumpStartのようなモデルハブから選んで利用するのが一般的な進め方です。 "
                  }
                </p>
                <p>
                  {
                    " 第1章の後半では、生成AIプロジェクトが辿る典型的なライフサイクルが提示されます。これは本書全体の構成そのものにも対応しています。 "
                  }
                </p>
              </div>
              <div className={styles.diagramCaption}>
                <i className="ti ti-chart-dots-3"></i>
                {"図：生成AIプロジェクトのライフサイクル "}
              </div>
              <div className={styles.diagramWrap}>
                <MermaidDiagram
                  id="aws-diagram-lifecycle"
                  chart={DIAGRAM_LIFECYCLE}
                  theme="base"
                  themeVariables={THEME}
                  flowchartHtmlLabels={false}
                />
              </div>
              <div className={styles.callout} data-testid="callout" data-variant={VARIANT_PLAIN}>
                <i className="ti ti-bulb"></i>
                <div className={styles.calloutBody}>
                  <p>
                    <strong>{"初学者向けのポイント"}</strong>
                    {
                      "：多くの入門記事は「プロンプトを工夫すれば終わり」という印象を与えがちですが、実際のプロジェクトでは「プロンプトだけで十分な性能が出るか」を判断し、不十分ならファインチューニングやRLHFに進むという分岐が発生します。このライフサイクル図を頭に入れておくと、以降の章（第2章〜第8章）がこの図のどの部分を深掘りしているのかが分かりやすくなります。 "
                    }
                  </p>
                </div>
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " 最後に第1章では「なぜAWS上で生成AIを構築するのか」という問いに対し、Amazon SageMakerによる学習基盤、AWS Trainium/Inferentiaのような専用ハードウェア、そしてAmazon Bedrockのようなマネージドサービスの存在を理由として挙げています。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="step-2">
              <div className={styles.stepMarker}>
                <span className={styles.stepNum}>{"2"}</span>
                <span className={styles.stepTag} data-testid="step-tag">
                  {"第2章"}
                </span>
              </div>
              <h2 id="step-2-heading">{"プロンプトエンジニアリングとインコンテキスト学習"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 第2章では、モデルに与える入力（プロンプト）と、モデルが出力する応答（コンプリーション）の関係、そしてプロンプトを構成する要素（指示・文脈・入力データ・出力形式の指定など）を整理します。あわせて「トークン」という単位についても解説されており、これは課金やコンテキストウィンドウの上限を理解する上で欠かせない基礎知識です。 "
                  }
                </p>
                <p>
                  {
                    " 本章の中心的なテーマが「インコンテキスト学習（In-Context Learning）」です。これは、モデルの重みを一切更新せずに、プロンプトの中に例（デモンストレーション）を含めるだけでモデルの振る舞いを誘導する手法です。 "
                  }
                </p>
              </div>
              <div className={styles.tableWrap}>
                <div className={styles.tableTitle}>{"インコンテキスト学習の3つの型"}</div>
                <table>
                  <thead>
                    <tr>
                      <th>{"手法"}</th>
                      <th>{"説明"}</th>
                      <th>{"例に必要なサンプル数"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Zero-Shot Inference"}</td>
                      <td>{"例を1つも与えず、指示だけでタスクを実行させる"}</td>
                      <td>{"0件"}</td>
                    </tr>
                    <tr>
                      <td>{"One-Shot Inference"}</td>
                      <td>{"1つの例をプロンプトに含めて実行させる"}</td>
                      <td>{"1件"}</td>
                    </tr>
                    <tr>
                      <td>{"Few-Shot Inference"}</td>
                      <td>{"複数の例をプロンプトに含めて実行させる"}</td>
                      <td>{"2件以上"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " 一般に、モデルの規模が大きいほどZero-Shotでも高い性能を発揮しやすく、モデルが小さい場合はFew-Shotで例を増やすことで性能を補う、という関係があります。ただし、例を詰め込みすぎるとコンテキストウィンドウを圧迫したり、かえって性能が落ちる「インコンテキスト学習がうまくいかないケース」もあり、本章ではそのアンチパターンとベストプラクティスの両方が扱われています。 "
                  }
                </p>
                <p>
                  {" さらに、"}
                  <code>{"temperature"}</code>
                  {"（出力のランダム性）や"}
                  <code>{"top-k"}</code>
                  {"/"}
                  <code>{"top-p"}</code>
                  {
                    "（サンプリング時に候補とするトークンの絞り込み方）といった推論設定パラメータも本章で扱われます。ただし、"
                  }
                  <strong>
                    {
                      "どのパラメータをサポートするか、既定値がいくつか、指定できる値の範囲がどこまでかはモデルごとに異なります"
                    }
                  </strong>
                  {"。たとえば"}
                  <code>{"top-k"}</code>
                  {"は公開していないモデルもあり、"}
                  <code>{"temperature"}</code>
                  {
                    "の上限値もモデルによって変わります。したがってこれらは「すべてのモデルで必ず調整する項目」ではなく、選択したモデルがそのパラメータをサポートしている場合に限り、対象モデルのドキュメント（Bedrockであれば各モデルの推論パラメータ仕様）で許容範囲を確認したうえで調整してください。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="step-3">
              <div className={styles.stepMarker}>
                <span className={styles.stepNum}>{"3"}</span>
                <span className={styles.stepTag} data-testid="step-tag">
                  {"第3章"}
                </span>
              </div>
              <h2 id="step-3-heading">{"大規模言語基盤モデルの仕組み"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 第3章は、生成AIの中核技術であるTransformerアーキテクチャを解説する、本書の中でも技術的に濃い章の一つです。トークナイザ、埋め込みベクトル、そしてTransformer本体（エンコーダ・デコーダ）の各構成要素が順を追って説明されます。 "
                  }
                </p>
                <p>
                  {' 次の図は、原論文 "Attention Is All You Need" が提示した'}
                  <strong>{"エンコーダ－デコーダ型（encoder-decoder）Transformer"}</strong>
                  {
                    "の構成です。エンコーダスタック・デコーダスタック・両者をつなぐエンコーダ－デコーダ注意層を持つこの型は、Transformerの一形態であってすべてのTransformerを代表するものではありません（GPT系はデコーダのみ、BERT系はエンコーダのみで構成されます）。 "
                  }
                </p>
              </div>
              <div className={styles.diagramCaption}>
                <i className="ti ti-chart-dots-3"></i>
                {"図：エンコーダ－デコーダ型Transformerの構成 "}
              </div>
              <div className={styles.diagramWrap}>
                <MermaidDiagram
                  id="aws-diagram-transformer"
                  chart={DIAGRAM_TRANSFORMER}
                  theme="base"
                  themeVariables={THEME}
                  flowchartHtmlLabels={false}
                />
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " ポイントは「自己注意（Self-Attention）」の仕組みです。これは文中の各単語が、他のどの単語とどれくらい関連しているかを計算する仕組みで、これにより「it」のような代名詞が文中のどの名詞を指しているかをモデルが判断できるようになります。Transformerを視覚的に理解したい場合は、著名なブロガーであるJay Alammar氏による「The Illustrated Transformer」という解説記事が国際的に広く参照されており、本書と合わせて読むと理解が深まります（参考文献8）。 "
                  }
                </p>
                <p>
                  {
                    " 第3章の後半では、Transformerベースのモデルが「エンコーダのみ（BERT系）」「デコーダのみ（GPT系）」「エンコーダ-デコーダ両方（T5系）」の3種類に大別されることや、事前学習に使われるデータセットの規模、そして「スケーリング則（Scaling Laws）」と呼ばれる、モデルサイズ・データ量・計算量と性能の関係についても解説されています。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="step-4">
              <div className={styles.stepMarker}>
                <span className={styles.stepNum}>{"4"}</span>
                <span className={styles.stepTag} data-testid="step-tag">
                  {"第4章"}
                </span>
              </div>
              <h2 id="step-4-heading">{"メモリと計算の最適化"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 大規模言語モデルは数十億〜数千億パラメータに達するため、そのまま学習・推論しようとすると膨大なGPUメモリが必要になります。第4章では、このメモリ制約にどう対処するかが解説されます。 "
                  }
                </p>
              </div>
              <div className={styles.tableWrap}>
                <div className={styles.tableTitle}>{"数値精度の種類"}</div>
                <table>
                  <thead>
                    <tr>
                      <th>{"数値精度"}</th>
                      <th>{"ビット数"}</th>
                      <th>{"特徴"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"fp32"}</td>
                      <td>{"32bit"}</td>
                      <td>{"標準的な精度。メモリ消費が最大"}</td>
                    </tr>
                    <tr>
                      <td>{"fp16"}</td>
                      <td>{"16bit"}</td>
                      <td>{"メモリを半減できるが数値範囲が狭い"}</td>
                    </tr>
                    <tr>
                      <td>{"bfloat16"}</td>
                      <td>{"16bit"}</td>
                      <td>{"fp32と同じ指数部を持ち、学習時の安定性が高い"}</td>
                    </tr>
                    <tr>
                      <td>{"fp8"}</td>
                      <td>{"8bit"}</td>
                      <td>{"最新の推論高速化で使われる超低精度"}</td>
                    </tr>
                    <tr>
                      <td>{"int8"}</td>
                      <td>{"8bit"}</td>
                      <td>{"量子化でよく使われる整数表現"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " この量子化（Quantization）に加えて、第4章では「FlashAttention」（自己注意の計算を高速化・省メモリ化する手法）や「Grouped-Query Attention」（複数のクエリヘッドでキー・バリューを共有してメモリを削減する手法）といった、注意機構そのものを最適化する技術も紹介されます。 "
                  }
                </p>
                <p>
                  {
                    " さらに、1台のGPUに収まらない巨大モデルを複数GPU・複数ノードに分散させる手法として「分散データ並列（Distributed Data Parallel）」と「完全シャーディングデータ並列（Fully Sharded Data Parallel, FSDP）」が比較され、AWS上ではAmazon SageMakerのFSDPサポートや、AWS独自の学習用チップであるAWS Trainiumを使う方法が紹介されています。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="step-5">
              <div className={styles.stepMarker}>
                <span className={styles.stepNum}>{"5"}</span>
                <span className={styles.stepTag} data-testid="step-tag">
                  {"第5章"}
                </span>
              </div>
              <h2 id="step-5-heading">{"ファインチューニングと評価"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 第5章では、事前学習済みモデルを特定のタスクに適応させる「指示チューニング（Instruction Fine-Tuning）」を扱います。Llama 2-Chat、Falcon-Chat、FLAN-T5といった、実際に指示チューニングによって作られた代表的なモデル群を例に、どのようなデータセット（指示とその模範解答のペア）を用意すればよいかが説明されます。 "
                  }
                </p>
                <p>
                  {
                    " 学習の実行環境としては、Amazon SageMaker StudioやSageMaker JumpStart、Hugging Face向けのSageMaker Estimatorが紹介されており、AWS上でどのようにファインチューニングのジョブを立ち上げるかという実務的な内容が中心です。 "
                  }
                </p>
                <p>
                  {
                    " 章の後半では「評価（Evaluation）」がテーマになります。ファインチューニングをしても、それが本当に性能向上につながったかを測定しなければ意味がありません。ROUGEやBLEUのような定量的な評価指標や、既存のベンチマークデータセットを使った評価方法が紹介されます。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="step-6">
              <div className={styles.stepMarker}>
                <span className={styles.stepNum}>{"6"}</span>
                <span className={styles.stepTag} data-testid="step-tag">
                  {"第6章"}
                </span>
              </div>
              <h2 id="step-6-heading">{"パラメータ効率のよいファインチューニング"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 第6章の主役は「LoRA（Low-Rank Adaptation）」と、その量子化版である「QLoRA」です。フルファインチューニング（Full Fine-Tuning）ではモデルの全パラメータを更新するため、巨大なモデルほど膨大な計算資源が必要になります。LoRAはこの問題を解決するために考案された手法で、元のモデルの重みは凍結したまま、低ランクの小さな行列だけを新たに学習します。 "
                  }
                </p>
              </div>
              <div className={styles.diagramCaption}>
                <i className="ti ti-chart-dots-3"></i>
                {"図：LoRAの仕組み"}
              </div>
              <div className={styles.diagramWrap}>
                <MermaidDiagram
                  id="aws-diagram-lora"
                  chart={DIAGRAM_LORA}
                  theme="base"
                  themeVariables={THEME}
                  flowchartHtmlLabels={false}
                />
              </div>
              <div className={styles.prose}>
                <p>
                  {" 推論時は、凍結した元の重みによる計算 "}
                  <code>{"W x"}</code>
                  {" と、低ランク行列によるアダプターの計算 "}
                  <code>{"B(A x)"}</code>
                  {" を"}
                  <strong>{"加算"}</strong>
                  {"し、その和が出力になります（"}
                  <code>{"W x + B(A x)"}</code>
                  {"）。元の重みは書き換えず、差分だけを足し込む構造です。 "}
                </p>
                <p>
                  {
                    " 学習対象になるのは行列AとBだけなので、更新すべきパラメータ数が劇的に減り、消費GPUメモリも小さくなります。QLoRAはこれをさらに発展させ、元のモデル自体を4bitに量子化した状態でLoRAを適用することで、より少ないメモリで大規模モデルのファインチューニングを可能にします。 "
                  }
                </p>
              </div>
              <div className={styles.tableWrap}>
                <div className={styles.tableTitle}>{"ファインチューニング手法の比較"}</div>
                <table>
                  <thead>
                    <tr>
                      <th>{"手法"}</th>
                      <th>{"更新対象"}</th>
                      <th>{"メモリ効率"}</th>
                      <th>{"備考"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"フルファインチューニング"}</td>
                      <td>{"全パラメータ"}</td>
                      <td>{"低い"}</td>
                      <td>{"性能は高いが計算コストが最大"}</td>
                    </tr>
                    <tr>
                      <td>{"LoRA"}</td>
                      <td>{"低ランク行列のみ"}</td>
                      <td>{"高い"}</td>
                      <td>{"元モデルは凍結、アダプタを差し替え可能"}</td>
                    </tr>
                    <tr>
                      <td>{"QLoRA"}</td>
                      <td>{"量子化モデル＋低ランク行列"}</td>
                      <td>{"非常に高い"}</td>
                      <td>{"メモリはさらに節約できるが学習時間はやや増加する傾向"}</td>
                    </tr>
                    <tr>
                      <td>{"プロンプトチューニング"}</td>
                      <td>{"ソフトプロンプトのみ"}</td>
                      <td>{"非常に高い"}</td>
                      <td>{"モデル本体は一切変更しない"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                className={styles.callout + " " + styles.forest}
                data-testid="callout"
                data-variant={VARIANT_FOREST}
              >
                <i className="ti ti-flask-2"></i>
                <div className={styles.calloutBody}>
                  <p>
                    {
                      " LoRAとQLoRAの実践的なチューニングについては、機械学習分野で著名な研究者・教育者であるSebastian Raschka氏が、数百回規模のLoRA/QLoRA実験を行った知見を公開しており、「QLoRAはメモリを約33%削減できる一方で学習時間が約39%増加するというトレードオフがある」といった具体的な指摘は今でも広く引用されています（参考文献7・23）。 "
                    }
                  </p>
                  <p>
                    {
                      " なお同氏の詳細記事（参考文献23）には、この要約値39%と並んで、LoRA（bf16）1.85時間／QLoRA（4bit NF4）2.79時間という実測の学習時間も掲載されています。この2値からそのまま増加率を計算すると約50.8%となり、要約値の39%とは一致しません（記事上、この差がどこから生じるかは説明されていません）。引用する際は、要約値の39%と実測値から算出した約50.8%のどちらを根拠にしたのかを明示してください。 "
                    }
                  </p>
                  <p>
                    {
                      " いずれにせよこの数値は、同氏が特定の条件下で行った実験の実測値です。対象モデル、量子化の方式とビット数、LoRAのランクと適用先モジュール、シーケンス長、バッチサイズ、使用GPUといった設定によって削減率も増加率も変わるため、そのまま一般則として扱わず、必ず自分の設定で計測してください（実験条件の詳細は参考文献23の原典を参照）。本書の該当章と合わせて読むことで、理論だけでなく実務上の勘所もつかめます。 "
                    }
                  </p>
                </div>
              </div>
            </section>
            <section className={styles.section} id="step-7">
              <div className={styles.stepMarker}>
                <span className={styles.stepNum}>{"7"}</span>
                <span className={styles.stepTag} data-testid="step-tag">
                  {"第7章"}
                </span>
              </div>
              <h2 id="step-7-heading">{"RLHFによる人間フィードバックからの強化学習"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 第7章は「人間の価値観にモデルをどう整合させるか」という、生成AIの安全性に直結するテーマを扱います。キーワードは「HHH（Helpful, Honest, Harmless＝役に立ち、正直で、無害）」という3原則です。 "
                  }
                </p>
              </div>
              <div className={styles.diagramCaption}>
                <i className="ti ti-chart-dots-3"></i>
                {"図：RLHFのループ"}
              </div>
              <div className={styles.diagramWrap}>
                <MermaidDiagram
                  id="aws-diagram-rlhf"
                  chart={DIAGRAM_RLHF}
                  theme="base"
                  themeVariables={THEME}
                  flowchartHtmlLabels={false}
                />
              </div>
              <div className={styles.prose}>
                <p>{"流れを整理すると次のようになります。"}</p>
                <ol>
                  <li>
                    <strong>{"報酬モデルの学習"}</strong>
                    {
                      "：Amazon SageMaker Ground Truthのような人手アノテーションの仕組みを使い、人間のラベラーが複数の応答にランキングを付け、そのデータから「どの応答が好ましいか」を予測する報酬モデルを訓練します。既存の毒性検出モデル（Meta製など）を報酬モデルとして流用するケースも紹介されています。 "
                    }
                  </li>
                  <li>
                    <strong>{"強化学習によるファインチューニング"}</strong>
                    {
                      "：報酬モデルが出すスコアを最大化するように、PPO（Proximal Policy Optimization）というアルゴリズムでポリシー（＝生成AIモデル本体）を更新します。 "
                    }
                  </li>
                  <li>
                    <strong>{"報酬ハッキングの緩和"}</strong>
                    {
                      "：報酬モデルを騙すような不自然な出力（報酬ハッキング）を防ぐため、元のモデルの出力分布から大きく逸脱しないようKLダイバージェンスによる制約をかけます。 "
                    }
                  </li>
                  <li>
                    <strong>{"評価"}</strong>
                    {
                      "：定性的評価（人間による読み比べ）と定量的評価（毒性スコアなどの指標）の両方でRLHF後のモデルを検証します。 "
                    }
                  </li>
                </ol>
                <p>
                  {
                    " 第6章で学んだLoRAをRLHFのフェーズでも併用できる点（パラメータ効率のよいRLHF）が紹介されているのも実務上重要なポイントです。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="step-8">
              <div className={styles.stepMarker}>
                <span className={styles.stepNum}>{"8"}</span>
                <span className={styles.stepTag} data-testid="step-tag">
                  {"第8章"}
                </span>
              </div>
              <h2 id="step-8-heading">{"モデルデプロイの最適化"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 学習・ファインチューニングが終わったモデルを、実際にユーザーに使ってもらうにはどう配置すればよいかを扱うのが第8章です。 "
                  }
                </p>
              </div>
              <div className={styles.tableWrap}>
                <div className={styles.tableTitle}>{"モデル圧縮手法"}</div>
                <table>
                  <thead>
                    <tr>
                      <th>{"手法"}</th>
                      <th>{"概要"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"プルーニング（Pruning）"}</td>
                      <td>{"影響の小さいパラメータを削除してモデルを軽量化"}</td>
                    </tr>
                    <tr>
                      <td>{"量子化（Post-Training Quantization / GPTQ）"}</td>
                      <td>{"学習後のモデルの重みを低精度に変換して軽量化"}</td>
                    </tr>
                    <tr>
                      <td>{"蒸留（Distillation）"}</td>
                      <td>{"大きな教師モデルの出力を、小さな生徒モデルに学習させる"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " これらの最適化に加え、AWS Inferentiaのような推論専用ハードウェアの活用や、モデル更新時のリスクを抑える「A/Bテスト」「シャドーデプロイ（本番トラフィックを使いつつ結果はユーザーに返さずに新モデルを検証する手法）」といったデプロイ戦略も紹介されています。本番運用ではメトリクスによるモニタリングと、負荷に応じてインスタンス数を自動調整する「オートスケーリングポリシー」の設計も欠かせない要素として扱われます。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="step-9">
              <div className={styles.stepMarker}>
                <span className={styles.stepNum}>{"9"}</span>
                <span className={styles.stepTag} data-testid="step-tag">
                  {"第9章"}
                </span>
              </div>
              <h2 id="step-9-heading">
                {"RAGとエージェントによるコンテキスト認識推論アプリケーション"}
              </h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 本書のサブタイトルにある「コンテキスト認識（Context-Aware）」という言葉が正面から扱われるのが第9章です。まず、大規模言語モデルには2つの根本的な限界があることが説明されます。 "
                  }
                </p>
                <ul>
                  <li>
                    <strong>{"ハルシネーション（Hallucination）"}</strong>
                    {"：事実に基づかない、もっともらしい嘘の情報を生成してしまう現象 "}
                  </li>
                  <li>
                    <strong>{"知識のカットオフ（Knowledge Cutoff）"}</strong>
                    {
                      "：学習データの収集時点以降の出来事や、学習データに含まれない社内情報などを知らない "
                    }
                  </li>
                </ul>
                <p>
                  {
                    " この2つの限界に対処する代表的な手法が「検索拡張生成（Retrieval-Augmented Generation, RAG）」です。 "
                  }
                </p>
              </div>
              <div className={styles.diagramCaption}>
                <i className="ti ti-chart-dots-3"></i>
                {"図：RAGのワークフロー "}
              </div>
              <div className={styles.diagramWrap}>
                <MermaidDiagram
                  id="aws-diagram-rag"
                  chart={DIAGRAM_RAG}
                  theme="base"
                  themeVariables={THEME}
                  flowchartHtmlLabels={false}
                />
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " RAGのワークフローは、社内文書のような外部知識源を「文書の読み込みとチャンク分割」→「埋め込みベクトル化してベクトルストアに格納」→「質問に類似した文書を検索・取得」→「取得した文脈をプロンプトに追加」→「LLMに推論させる」という流れで構成されます。 "
                  }
                </p>
                <p>
                  {
                    " 第9章のもう一つの柱が「エージェント（Agents）」です。エージェントは、LLM自身に「次に何をすべきか」を考えさせながら、外部ツール（検索、計算、API呼び出しなど）を呼び出させる仕組みです。本書ではその代表的な枠組みとして「ReActフレームワーク」と「Program-Aided Language（PAL）フレームワーク」が紹介されています。 "
                  }
                </p>
              </div>
              <div className={styles.diagramCaption}>
                <i className="ti ti-chart-dots-3"></i>
                {"図：ReActエージェントのループ "}
              </div>
              <div className={styles.diagramWrap}>
                <MermaidDiagram
                  id="aws-diagram-react"
                  chart={DIAGRAM_REACT}
                  theme="base"
                  themeVariables={THEME}
                  flowchartHtmlLabels={false}
                />
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " ReActは「Reasoning（推論）」と「Acting（行動）」を交互に繰り返すことで、モデルが単発の応答ではなく、複数ステップにわたってタスクを解決できるようにする枠組みです。DeepLearning.AIの創設者として国際的に知られるAndrew Ng氏も、この種の「エージェント的なRAG（Agentic RAG）」―実行時にエージェント自身がどのデータを取得すべきかを自律的に判断する発展形―を、今後大きく伸びる領域として紹介しています（参考文献9）。また、著書『AI Engineering』で知られるChip Huyen氏も、RAGとエージェントを統一的に捉える視点を提示しており、本章のテーマと強く重なります（参考文献10）。 "
                  }
                </p>
                <p>
                  {
                    " 第9章の最後では、これらのRAG・エージェントを含むアプリケーションを本番運用するための「FMOps（Foundation Model Ops）」という考え方が紹介されます。実験段階・開発段階・本番デプロイ段階のそれぞれで気をつけるべき観点が整理されています。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="step-10">
              <div className={styles.stepMarker}>
                <span className={styles.stepNum}>{"10"}</span>
                <span className={styles.stepTag} data-testid="step-tag">
                  {"第10章"}
                </span>
              </div>
              <h2 id="step-10-heading">{"マルチモーダル基盤モデル"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " ここから本書のもう一つのテーマである「マルチモーダル（Multimodal）」の領域に入ります。第10章では、テキストだけでなく画像も扱えるモデルのユースケース（画像生成、画像編集・補正、画像キャプション生成、視覚的質問応答＝VQAなど）が紹介されます。 "
                  }
                </p>
                <p>{"画像生成タスクの中核技術が「拡散モデル（Diffusion Model）」です。"}</p>
              </div>
              <div className={styles.diagramCaption}>
                <i className="ti ti-chart-dots-3"></i>
                {"図：拡散モデルの前方拡散と逆拡散 "}
              </div>
              <div className={styles.diagramWrap}>
                <MermaidDiagram
                  id="aws-diagram-diffusion"
                  chart={DIAGRAM_DIFFUSION}
                  theme="base"
                  themeVariables={THEME}
                  flowchartHtmlLabels={false}
                />
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " 拡散モデルは、元画像に少しずつノイズを加えていく「前方拡散プロセス」と、そのノイズを少しずつ取り除きながら画像を復元していく「逆拡散プロセス」という2つのプロセスから成り立ちます。ここで注意したいのは、前方拡散が"
                  }
                  <strong>{"学習時の処理"}</strong>
                  {
                    "だという点です。学習データの画像を段階的にノイズ化し、「どのノイズが加えられたか」をU-Netに当てさせることでノイズ予測器を訓練します。 "
                  }
                </p>
                <p>
                  {" 一方、テキストから画像を生成する"}
                  <strong>{"推論時には元画像は不要"}</strong>
                  {
                    "で、ガウス分布からサンプリングした純粋なノイズ（Stable Diffusionでは潜在空間上のノイズ）を出発点として逆拡散を回します（上図でも、学習時の入力である「ノイズを加えた画像」は点線でU-Netの入口へ入り、推論時は前方拡散の出力ではなく独立した「初期ノイズ」ノードから逆拡散へ接続しています）。テキストから画像を生成する場合は、この逆拡散プロセスの各ステップで、テキストプロンプトの情報を「クロスアテンション」という仕組みを通じてU-Netに注入し、ノイズ除去の方向をテキストの意味に沿ったものへと導きます。 "
                  }
                </p>
                <p>
                  {
                    " 本章ではStable Diffusion 2とStable Diffusion XLという2つのアーキテクチャの違い（XLでは条件付けの仕組みが強化され、加えてRefinerモデルが用意されている点など）も具体的に解説されています。XLのBaseモデルはそれ単体で画像を生成でき、Refinerは生成された画像のディテールを仕上げるために"
                  }
                  <strong>{"任意で"}</strong>
                  {
                    "追加適用する別モデルです（必須の後段工程ではありません）。また、画像だけでなく「Inpainting（画像の一部を修復・置換）」「Outpainting（画像の外側を拡張）」「Depth-to-Image（深度情報から画像を生成）」といった応用的な画像編集タスクも扱われます。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="step-11">
              <div className={styles.stepMarker}>
                <span className={styles.stepNum}>{"11"}</span>
                <span className={styles.stepTag} data-testid="step-tag">
                  {"第11章"}
                </span>
              </div>
              <h2 id="step-11-heading">{"Stable Diffusionの制御生成とファインチューニング"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 第10章で拡散モデルの基本を学んだ上で、第11章ではその出力をより精密にコントロールする手法や、特定のスタイル・被写体に特化させるファインチューニング手法が紹介されます。 "
                  }
                </p>
              </div>
              <div className={styles.tableWrap}>
                <div className={styles.tableTitle}>
                  {"Stable Diffusionの制御・カスタマイズ手法"}
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>{"手法"}</th>
                      <th>{"目的"}</th>
                      <th>{"特徴"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"ControlNet"}</td>
                      <td>{"生成する構図やポーズを制御"}</td>
                      <td>{"エッジ検出画像や姿勢情報などを追加の条件として入力"}</td>
                    </tr>
                    <tr>
                      <td>{"DreamBooth"}</td>
                      <td>{"特定の被写体をモデルに学習させる"}</td>
                      <td>{"少数の参照画像から特定の人物・物体を再現できるようにする"}</td>
                    </tr>
                    <tr>
                      <td>{"DreamBooth + LoRA"}</td>
                      <td>{"DreamBoothを軽量に実施"}</td>
                      <td>{"第6章のLoRAの考え方を拡散モデルに応用し、学習コストを削減"}</td>
                    </tr>
                    <tr>
                      <td>{"Textual Inversion"}</td>
                      <td>{"新しい概念を単語として学習"}</td>
                      <td>
                        {"新しい「単語（トークン）」を1つ学習させ、既存モデルの語彙に追加する"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " 本章の最後では、第7章で学んだRLHFの考え方を画像生成モデルにも応用する「人間の価値観に整合した画像生成」についても触れられており、テキスト生成とマルチモーダル生成の両方で「人間のフィードバックを取り込む」という発想が共通して現れることが分かります。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="step-12">
              <div className={styles.stepMarker}>
                <span className={styles.stepNum}>{"12"}</span>
                <span className={styles.stepTag} data-testid="step-tag">
                  {"第12章"}
                </span>
              </div>
              <h2 id="step-12-heading">{"Amazon Bedrock ― マネージド生成AIサービス"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 最終章では、これまで学んできた技術要素を、AWSのマネージドサービスであるAmazon Bedrockを使って実際にどう実装するかがまとめられています。 "
                  }
                </p>
              </div>
              <div className={styles.diagramCaption}>
                <i className="ti ti-chart-dots-3"></i>
                {"図：Amazon Bedrockのアーキテクチャ概観 "}
              </div>
              <div className={styles.diagramWrap}>
                <MermaidDiagram
                  id="aws-diagram-bedrock"
                  chart={DIAGRAM_BEDROCK}
                  theme="base"
                  themeVariables={THEME}
                  flowchartHtmlLabels={false}
                />
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " 刊行当時（2023年）のBedrockには、AWS自社開発のAmazon Titanファミリーや、Stability AIのStable Diffusion系モデルが基盤モデルとして提供されていました。本章では、大規模言語モデル向けの推論API（SQLコード生成、テキスト要約、埋め込みベクトル生成など）、ファインチューニング機能、エージェント機能、そしてマルチモーダルモデル向けのAPI（テキストからの画像生成、画像からの画像生成）が一通り紹介され、最後にデータプライバシー・ネットワークセキュリティ、ガバナンス・モニタリングといった、企業利用に欠かせない観点でまとめられています。 "
                  }
                </p>
              </div>
              <div className={styles.callout} data-testid="callout" data-variant={VARIANT_PLAIN}>
                <i className="ti ti-shield-check"></i>
                <div className={styles.calloutBody}>
                  <p>
                    {" 上図が示すとおり、ガードレールは推論結果と並ぶ独立の出力元ではなく、"}
                    <strong>{"ユーザー入力と、LLMが生成した応答の両方を評価するフィルタ"}</strong>
                    {
                      "として機能します。評価対象はこの2つであり、ナレッジベースから取得した参照文書そのものではありません。そのため上図では、ナレッジベースの検索結果を生成された応答とは別のノードとして分け、ガードレールを経由しない経路で基盤モデルへ渡しています。 "
                    }
                  </p>
                  <p>
                    <code>{"RetrieveAndGenerate API"}</code>
                    {
                      " はこの「検索 → 取得文書を文脈として与えて生成」までを一括で実行しますが、ガードレールの評価対象は"
                    }
                    <strong>{"入力クエリと生成された応答の2つ"}</strong>
                    {
                      "であり、検索で取得した参照文書そのものは評価されません。これに対し、エージェント型の検索を行う "
                    }
                    <code>{"AgenticRetrieveStream API"}</code>
                    {" では、"}
                    <code>{"agenticRetrieveConfiguration.policyConfiguration"}</code>
                    {" でガードレールを設定し、"}
                    <strong>{"検索（リトリーブ）の過程に"}</strong>
                    {"適用します。ただしこの経路でサポートされるガードレールのアクションは "}
                    <code>{"BLOCK"}</code>
                    {" のみで、"}
                    <code>{"MASK"}</code>
                    {
                      "（該当箇所のマスキング）はサポートされません。MASKを前提にした設計（機微情報を伏せたうえで検索結果を利用する等）はAgenticRetrieveStreamでは成立せず、該当時は検索自体がブロックされる点に注意してください。 "
                    }
                  </p>
                  <p>
                    {
                      " つまり両者は「どこで設定するか」も「何を評価するか」も異なるため、「ガードレールを有効にした」という一言でまとめず、使用するAPIごとに適用範囲を確認してください（設定項目の詳細は参考文献20のAWS公式ドキュメント最新版を参照）。 "
                    }
                  </p>
                </div>
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " また、データプライバシー・セキュリティ・ガバナンス・モニタリングは推論後の後処理段ではなく、"
                  }
                  <strong>{"推論フロー全体を横断する統制"}</strong>
                  {
                    "として捉えるのが実態に近い点にも注意してください。ここで統制と可観測性は別のノードに分けています。 "
                  }
                </p>
              </div>
              <div
                className={styles.callout + " " + styles.forest}
                data-testid="callout"
                data-variant={VARIANT_FOREST}
              >
                <i className="ti ti-gauge"></i>
                <div className={styles.calloutBody}>
                  <p>
                    <strong>
                      {
                        "AgentCore Observabilityの対象は Amazon Bedrock AgentCore のリソースに限られます"
                      }
                    </strong>
                    {"。ここで「ナレッジベース」を一括りにせず、区別しておく必要があります。"}
                    <strong>
                      {
                        "Managed Knowledge BaseはBedrockのリソースですが、AgentCore Observabilityと統合されます"
                      }
                    </strong>
                    {"（上図でもAgentCoreとは別ノードとして描き、統合関係を接続で示しています）。 "}
                  </p>
                  <p>
                    {
                      " ただしこの統合も「つなげば見える」ものではありません。Managed Knowledge Base側の可観測性は、"
                    }
                    <code>{"AWS/Bedrock/KnowledgeBases"}</code>
                    {
                      " 名前空間のランタイムメトリクスをCloudWatchへ出力することと、Retrieve系オペレーションのトレース（TRACES）をAWS X-Rayへ配信することを有効化してはじめてデータが集まります（参考文献17・20。Bedrock側の設定であり、AgentCoreの設定ではありません）。有効化していない場合、統合されていてもダッシュボードは空のままです。 "
                    }
                  </p>
                  <p>
                    {" 一方、"}
                    <strong>
                      {
                        "従来のBedrock Knowledge Base、Bedrockへの直接のモデル呼び出し、ガードレールはAgentCoreのリソースではないため、AgentCore Observabilityの自動収集対象外です"
                      }
                    </strong>
                    {
                      "。これら対象外の要素を含めた統制・監査はCloudWatchやCloudTrailといった基盤側の仕組みで行います。上図でも、AgentCore ObservabilityはAgentCoreと（統合関係にある）Managed Knowledge Baseのノードにのみ接続しており、図中の「エージェント（Agents for Bedrock）」＝従来型のエージェントには接続していません。 "
                    }
                  </p>
                  <p>
                    {" なお、AgentCore Observabilityのすべての機能に計装が要るわけではありません。"}
                    <strong>
                      {
                        "組込みメトリクス（セッション数、レイテンシ、エラー率など）やAgentCore Memoryの標準スパンは、エージェント側に追加のコード計装を書かなくても収集されます"
                      }
                    </strong>
                    {
                      "。ただしこれは「何の設定も不要」という意味ではありません。コード計装が不要であることとは"
                    }
                    <strong>{"別の要件"}</strong>
                    {
                      "として、①AgentCore Memoryリソース側でトレースを有効化すること、②アカウント（リージョン）単位でCloudWatch Transaction Searchを有効化すること、の2点を満たす必要があります（参考文献22）。"
                    }
                    <strong>
                      {
                        "この2点はAgentCore固有の要件であり、上記のManaged Knowledge Base側の設定とは別物です"
                      }
                    </strong>
                    {
                      "。混同すると、片方だけを有効化して「統合したのにデータが出ない」という状態になります。 "
                    }
                  </p>
                  <p>
                    <strong>
                      {
                        "エージェント側の計装（OpenTelemetry互換の設定）が必要になるのは、エージェント内部の処理を細かく追う詳細トレース（独自のスパン、ツール呼び出し、セッション単位の追跡など）や、独自のテレメトリを送る場合に限られます"
                      }
                    </strong>
                    {"。 "}
                  </p>
                </div>
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " この章の内容は、Bedrockという製品自体が今も高速に進化し続けているサービスであるため、刊行後のアップデートを踏まえて読む価値が特に高い部分です。次のセクションで、2026年9月時点での主な変化を補足します。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="updates">
              <div className={styles.sectionKicker}>
                <i className="ti ti-refresh"></i>
                {"2026 UPDATE"}
              </div>
              <h2 id="updates-heading">{"2026年9月時点の最新動向とのギャップ"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 本書は2023年11月に刊行されており、第12章で解説されているAmazon Bedrockの機能は、当時のスナップショットです。生成AIの分野、特にAWSのマネージドサービスはその後も急速に進化しているため、学習の際は以下の変化を念頭に置いてください。 "
                  }
                </p>
              </div>
              <div className={styles.tableWrap}>
                <div className={styles.tableTitle}>{"2023年刊行時 と 2026年9月時点の比較"}</div>
                <table>
                  <thead>
                    <tr>
                      <th>{"分野"}</th>
                      <th>{"2023年刊行当時"}</th>
                      <th>{"2026年9月時点の状況"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"モデルラインナップ"}</td>
                      <td>{"Titan、Stable Diffusion系が中心"}</td>
                      <td>
                        {
                          " Anthropic Claude、Meta Llama、Mistral、Google Gemma、OpenAI GPT系、Amazon Nova、xAI Grokなど、20近いプロバイダーの100以上のモデルが利用可能に拡大（参考文献18・11） "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"エージェント機能"}</td>
                      <td>{"「Agents」として第9章・第12章で紹介"}</td>
                      <td>
                        {
                          " 「Bedrock Agents」（現「Bedrock Agents Classic」）は2026年7月30日以降、新規顧客への提供を停止。ただし直前12か月以内に利用実績があるアカウントでは、既存エージェントの利用と新規エージェントの作成を引き続き行える。後継の「Amazon Bedrock AgentCore」がエージェント構築の中心的な仕組みに（参考文献19・13） "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"RAG関連機能"}</td>
                      <td>{"自前でベクトルストアと検索チェーンを構築する解説が中心"}</td>
                      <td>
                        {
                          " フルマネージドの「Bedrock Knowledge Base」やAgentCore経由の「Managed Knowledge Base」が登場し、データ接続・チャンク分割・再ランキングまで自動化される方向に進化（参考文献20・17） "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"ルーティング／コスト最適化"}</td>
                      <td>{"明示的なモデル選択が前提"}</td>
                      <td>
                        {
                          " 同一モデルファミリ内であらかじめ指定したモデルを対象に、プロンプトごとの予測応答品質と設定したルーティング条件に基づいて送信先モデルを選択する「Intelligent Prompt Routing」などの最適化機能が追加。ただし"
                        }
                        <strong>
                          {
                            "最適化が有効なのは英語のプロンプトに限られ、日本語プロンプトでの最適化は保証されません"
                          }
                        </strong>
                        {"（参考文献21） "}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                className={styles.callout + " " + styles.gold}
                data-testid="callout"
                data-variant={VARIANT_PLAIN}
              >
                <i className="ti ti-alert-triangle"></i>
                <div className={styles.calloutBody}>
                  <p>
                    {" 上表の各行は、末尾に示したAWS公式資料に基づいています。"}
                    <strong>
                      {
                        "利用可能なモデル・リージョン、アカウントごとの提供条件（Bedrock Agents Classicの許可リスト判定）、Intelligent Prompt Routingの対象モデルファミリとルーティング条件は、いずれもリージョンとアカウントによって異なります"
                      }
                    </strong>
                    {
                      "。導入前に必ず参考文献18〜21の公式ドキュメントで自分のリージョン・アカウントの条件を確認してください。 "
                    }
                  </p>
                </div>
              </div>
              <div className={styles.prose}>
                <p>
                  {
                    " とりわけ重要なのは、第9章・第12章で解説されている「Agents」の仕組みが、2026年時点では「Amazon Bedrock AgentCore」という新しいアーキテクチャに置き換わりつつある点です。AgentCoreはメモリ管理、ガバナンス（Policy機能による行動制御）、評価（Evaluations）、そして詳細な可観測性（Observability）を備えた、エージェントをより安全に本番運用するための基盤として位置づけられています（参考文献12〜16）。本書でReActフレームワークやエージェントの基本概念を理解した上で、実際にAWS上で構築する際は、最新のAgentCoreのドキュメントもあわせて確認することをおすすめします。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="resources">
              <div className={styles.sectionKicker}>
                <i className="ti ti-external-link"></i>
                {"FURTHER READING"}
              </div>
              <h2 id="resources-heading">{"さらに学びを深めるためのおすすめリソース"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 本書と組み合わせて読むことで理解が深まる、国際的に評価の高いリソースを分野別にまとめました。 "
                  }
                </p>
                <ul>
                  <li>
                    <strong>{"書籍のコード実践"}</strong>
                    {
                      "：著者らが公開しているGitHubリポジトリには、本書の各章に対応したノートブックやワークショップ資料が公開されています（参考文献2・3）。 "
                    }
                  </li>
                  <li>
                    <strong>{"Transformerの仕組みをより深く"}</strong>
                    {
                      "：Jay Alammar氏の「The Illustrated Transformer」は、TransformerやAttentionの仕組みを視覚的に解説した記事として、スタンフォードやハーバードなど多くの大学の講義でも参照されており、国際的に最も広く読まれている解説記事の一つです（参考文献8）。 "
                    }
                  </li>
                  <li>
                    <strong>{"LoRA/QLoRAの実践的チューニング"}</strong>
                    {
                      "：Sebastian Raschka氏によるLoRA・QLoRAの実験ブログは、ハイパーパラメータ選定の実務的な勘所を数値付きで示しており、第6章の理解を補完します（参考文献6・7）。 "
                    }
                  </li>
                  <li>
                    <strong>{"RAGとエージェントの最新動向"}</strong>
                    {
                      "：Andrew Ng氏によるAgentic RAGの紹介や、Chip Huyen氏の著書『AI Engineering』でのRAGとエージェントの統合的な解説は、第9章のテーマをより広い文脈で捉える助けになります（参考文献9・10）。 "
                    }
                  </li>
                  <li>
                    <strong>{"Amazon Bedrockの最新状況"}</strong>
                    {
                      "：AWS公式の一次情報源はAgentCoreのリリースノート、What's New、AWS Machine Learningブログです（参考文献13〜15）。参考文献12はAmazonのニュースルーム（About Amazon）による発表記事、参考文献16はEnterprise DNAによる第三者の解説記事であり、いずれもAWSの公式技術ドキュメントではありません。AWSの公式見解として扱う際は参考文献13〜15を根拠としてください。 "
                    }
                  </li>
                </ul>
              </div>
            </section>
            <section className={styles.section} id="checklist">
              <div className={styles.sectionKicker}>
                <i className="ti ti-checklist"></i>
                {"SELF CHECK"}
              </div>
              <h2 id="checklist-heading">{"理解度チェックリスト"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 各Stepの理解度を自己チェックするための一覧です。説明できるか怪しい項目があれば、該当のStepに戻って読み返してみてください。 "
                  }
                </p>
              </div>
              <span className={styles.checklistCounter} id="checklistCounterText">
                {"0 / 13 完了"}
              </span>
              <ul className={styles.checklist} id="checklistItems">
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>
                      {"生成AIプロジェクトのライフサイクル図を自分の言葉で説明できる（第1章）"}
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>
                      {"Zero-Shot・One-Shot・Few-Shot Inferenceの違いを説明できる（第2章）"}
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>
                      {"Transformerにおける自己注意（Self-Attention）の役割を説明できる（第3章）"}
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>
                      {
                        "fp32・fp16・bfloat16・int8の違いと、量子化がなぜメモリ削減になるか理解した（第4章）"
                      }
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>{"指示チューニングと、ROUGE等の評価指標の役割を理解した（第5章）"}</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>
                      {
                        "LoRAとQLoRAがなぜ効率的か、フルファインチューニングとの違いを説明できる（第6章）"
                      }
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>
                      {
                        "RLHFの4つのステップ（報酬モデル学習・強化学習・報酬ハッキング緩和・評価）を説明できる（第7章）"
                      }
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>
                      {
                        "プルーニング・量子化・蒸留という3つのモデル圧縮手法の違いを理解した（第8章）"
                      }
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>
                      {
                        "RAGのワークフローと、ReActエージェントの思考・行動・観察ループを説明できる（第9章）"
                      }
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>
                      {
                        "拡散モデルの前方拡散（学習時）と逆拡散（生成時）の違いを説明できる（第10章）"
                      }
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>
                      {"ControlNet・DreamBooth・Textual Inversionの違いを理解した（第11章）"}
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>
                      {
                        "Amazon Bedrockのガードレールが、どの範囲（入力・出力）に適用されるか説明できる（第12章）"
                      }
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>
                      {
                        "従来のBedrock AgentsとAmazon Bedrock AgentCoreの違いを理解した（2026年最新動向）"
                      }
                    </span>
                  </label>
                </li>
              </ul>
            </section>
            <section className={styles.section} id="summary">
              <div className={styles.sectionKicker}>
                <i className="ti ti-flag-3"></i>
                {"SUMMARY"}
              </div>
              <h2 id="summary-heading">{"まとめ"}</h2>
              <div className={styles.prose}>
                <p>
                  {
                    " 『Generative AI on AWS』は、生成AIプロジェクトの全体像（ユースケース定義からデプロイまで）を、AWSという具体的なプラットフォーム上での実装と結び付けて解説した実務書です。本ガイドで見てきたように、12章の内容は次のように整理できます。 "
                  }
                </p>
                <ul>
                  <li>{"第1〜3章で、生成AIの基礎とTransformerの仕組みという「土台」を固める"}</li>
                  <li>
                    {
                      " 第4〜8章で、巨大なモデルを効率よく学習・調整・デプロイするための技術（メモリ最適化、LoRA/QLoRA、RLHF、モデル圧縮）を身につける "
                    }
                  </li>
                  <li>
                    {
                      " 第9〜11章で、RAGとエージェントによる「コンテキスト認識」、そして拡散モデルによる「マルチモーダル」なアプリケーションの作り方を学ぶ "
                    }
                  </li>
                  <li>
                    {"第12章で、それらすべてをAmazon Bedrockという具体的なサービス上に落とし込む"}
                  </li>
                </ul>
                <p>
                  {
                    " 生成AI、特にAWSのマネージドサービス周りは変化が非常に速い分野です。本書で体系的な「地図」を頭に入れつつ、Amazon Bedrock AgentCoreのような最新のサービスアップデートは都度、公式ドキュメントで確認しながら学習を進めることをおすすめします。 "
                  }
                </p>
              </div>
            </section>
            <section className={styles.section} id="references">
              <div className={styles.sectionKicker}>
                <i className="ti ti-bookmark"></i>
                {"SOURCES"}
              </div>
              <h2 id="references-heading">{"参考文献・出典"}</h2>
              <div className={styles.refList}>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"1"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {"O'Reilly公式書籍ページ「Generative AI on AWS」"}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {" https://www.oreilly.com/library/view/generative-ai-on/9781098159214/ "}
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"2"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {"著者公式GitHubリポジトリ generative-ai-on-aws"}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {" https://github.com/generative-ai-on-aws/generative-ai-on-aws "}
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"3"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {" AWSサンプルのワークショップリポジトリ data-science-on-aws "}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {"https://github.com/aws-samples/data-science-on-aws"}
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"4"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>{"Bookshop.org 書籍情報・著者紹介ページ"}</div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://bookshop.org/p/books/generative-ai-on-aws-building-context-aware-multimodal-reasoning-applications-anje-barth/e415aa7851c60313 "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"5"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {"Amazon.com 書籍ページ（推薦コメント掲載）"}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://www.amazon.com/Generative-AWS-Context-Aware-Multimodal-Applications/dp/1098159225 "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"6"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {"Sebastian Raschka氏によるLoRA解説ブログ"}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {" https://sebastianraschka.com/blog/2023/llm-finetuning-lora.html "}
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"7"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {"Sebastian Raschka氏によるLoRA/QLoRA実験知見の投稿"}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {"https://x.com/rasbt/status/1712816975083155496"}
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"8"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {"Jay Alammar氏「The Illustrated Transformer」"}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {"https://jalammar.github.io/illustrated-transformer/"}
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"9"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {"Andrew Ng氏によるRAG／Agentic RAGに関する投稿"}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {"https://x.com/AndrewYNg/status/1945502636012445937"}
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"10"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {" Chip Huyen氏『AI Engineering』RAGとエージェントの章に関する解説 "}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://alexstrick.com/posts/2025-01-24-notes-on-ai-engineering-chip-huyen-chapter-6.html "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"11"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {" AWSブログ「Introducing Gemma 4 models on Amazon Bedrock」 "}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://aws.amazon.com/blogs/machine-learning/introducing-gemma-4-models-on-amazon-bedrock/ "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"12"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {" About Amazon「New Amazon Bedrock AgentCore capabilities」 "}
                    </div>{" "}
                    <div className={styles.refNote}>
                      {" Amazonニュースルームによる発表記事。AWS公式技術ドキュメントではない "}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://www.aboutamazon.com/news/aws/aws-amazon-bedrock-agent-core-ai-agents "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"13"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {"Amazon Bedrock AgentCore 公式リリースノート"}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"14"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {" AWS「Amazon Bedrock AgentCore expands to two new regions」 "}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://aws.amazon.com/about-aws/whats-new/2026/08/bedrock-agentcore-two-new-regions/ "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"15"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {
                        " AWSブログ「New in Amazon Bedrock AgentCore: broader knowledge and continuous learning」 "
                      }
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://aws.amazon.com/blogs/machine-learning/new-in-amazon-bedrock-agentcore-build-agents-with-broader-knowledge-and-continuous-learning/ "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"16"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {" Enterprise DNA「AWS Retires Bedrock Agents: AgentCore Is the New Path」 "}
                    </div>{" "}
                    <div className={styles.refNote}>
                      {"第三者による解説記事。AWS公式技術ドキュメントではない"}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://enterprisedna.co/resources/news/amazon-bedrock-agents-classic-agentcore-enterprise-july-2026/ "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"17"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {" AWSブログ「Introducing Amazon Bedrock Managed Knowledge Base」 "}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://aws.amazon.com/blogs/aws/introducing-amazon-bedrock-managed-knowledge-base-for-faster-more-accurate-enterprise-ai-applications/ "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"18"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {" AWS公式ドキュメント「Supported foundation models in Amazon Bedrock」 "}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"19"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {" AWS公式ドキュメント「Amazon Bedrock Agents Classic maintenance mode」 "}
                    </div>{" "}
                    <div className={styles.refNote}>
                      {"提供停止日と既存顧客の許可リスト条件を記載"}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://docs.aws.amazon.com/bedrock/latest/userguide/agents-classic-maintenance-mode.html "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"20"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {"AWS公式ドキュメント「Amazon Bedrock Knowledge Bases」"}
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {" https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html "}
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"21"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {
                        " AWS公式ドキュメント「Understanding intelligent prompt routing in Amazon Bedrock」 "
                      }
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {" https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-routing.html "}
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"22"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {
                        " AWS公式ドキュメント「Add observability to your Amazon Bedrock AgentCore resources」 "
                      }
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
                <div className={styles.refCard}>
                  {" "}
                  <span className={styles.refNum}>{"23"}</span>{" "}
                  <div className={styles.refBody}>
                    {" "}
                    <div className={styles.refTitle}>
                      {
                        " Sebastian Raschka氏「Practical Tips for Finetuning LLMs Using LoRA (Low-Rank Adaptation)」 "
                      }
                    </div>{" "}
                    <div className={styles.refNote}>
                      {
                        " QLoRAのメモリ33%削減・学習時間39%増加、および実測時間1.85時間／2.79時間の原典 "
                      }
                    </div>{" "}
                    <div className={styles.refUrl}>
                      {
                        " https://magazine.sebastianraschka.com/p/practical-tips-for-finetuning-llms "
                      }
                    </div>{" "}
                  </div>{" "}
                </div>
              </div>
            </section>
            <footer className={styles.footer}>
              <p>
                {
                  " 本ガイドの記述内容は2026年9月10日時点で確認できた情報に基づいています。特にAmazon Bedrockまわりのサービス仕様は変更が頻繁なため、実装の際は必ずAWS公式ドキュメントの最新版をご確認ください。 "
                }
              </p>
            </footer>
          </div>
        </main>
        <TocObserver />
      </div>
    </>
  );
}
