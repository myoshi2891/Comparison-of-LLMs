import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title:
    "AI-Powered Developer: Supercharge Your Productivity with LLMs and AI Tools | LLM コスト計算機",
  description:
    "Nathan B. Crocker 著『AI-Powered Developer』を土台に、LLMの基礎から設計・実装・テスト・デプロイ・セキュリティまでを学ぶステップバイステップガイド。2026年9月の補足動向、用語集、学習チェックリスト、全出典を収録。",
};
const UPDATE_VARIANT = "good";

const THEME_VARIABLES = {
  primaryColor: "#fffefb",
  primaryBorderColor: "#4b4394",
  primaryTextColor: "#2a241c",
  lineColor: "#4b4394",
  fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Hiragino Sans,Meiryo,sans-serif",
  fontSize: "16px",
} as const;

const DIAGRAM_0 = `flowchart TB
    A["Step1 LLMの基礎を理解する"] --> B["Step2 ChatGPT・Copilot・CodeWhispererを使い始める"]
    B --> C["Step3 ChatGPTでソフトウェアを設計する"]
    C --> D["Step4 GitHub Copilotで実装する"]
    D --> E["Step5 データ管理とイベント駆動アーキテクチャ"]
    E --> F["Step6 テスト・品質評価・コード説明"]
    F --> G["Step7 インフラのコード化とデプロイ"]
    G --> H["Step8 セキュアなアプリケーション開発"]
    H --> I["Step9 ローカルLLMの活用"]
    I --> J["Step10 2026年の最新動向を押さえる"]
    class A hub
    class J done`;

const DIAGRAM_1 = `flowchart TB
    A["要件を言葉にする"] --> B["ChatGPTに設計案を相談する"]
    B --> C["複数の候補案を比較・選定する"]
    C --> D["Mermaidでアーキテクチャ図を作成する"]
    D --> E["ドキュメントとしてチームに共有する"]
    E --> F["実装フェーズへ進む"]
    class B hub
    class F done`;

const DIAGRAM_2 = `flowchart TB
    UI["Webユーザー"] --> API["受信アダプター REST API"]
    CLI["CLIユーザー"] --> API2["受信アダプター CLI"]
    API --> PORT_IN["インバウンドポート ユースケース"]
    API2 --> PORT_IN
    PORT_IN --> CORE["ドメインモデル コアロジック"]
    CORE --> PORT_OUT["アウトバウンドポート"]
    PORT_OUT --> DB_ADAPTER["送信アダプター リポジトリ実装"]
    PORT_OUT --> MSG_ADAPTER["送信アダプター メッセージング"]
    DB_ADAPTER --> DB[("データベース")]
    MSG_ADAPTER --> QUEUE[("メッセージキュー")]
    class CORE hub`;

const DIAGRAM_3 = `flowchart TB
    APP["ITAMアプリケーション"] --> KAFKA["Kafkaトピック 資産イベント"]
    KAFKA --> STREAM["ストリーム処理 Spark Structured Streaming"]
    STREAM --> STORE[("分析用データストア")]
    STREAM --> ALERT["リアルタイム通知"]
    STORE --> DASH["ダッシュボード"]
    class KAFKA hub
    class DASH done`;

const DIAGRAM_4 = `flowchart TB
    CODE["対象コード"] --> ASK["AIにテスト生成を依頼"]
    ASK --> DRAFT["テストコードの下書き"]
    DRAFT --> RUN["実行して結果を確認"]
    RUN --> REVIEW{"意図通りに検証できているか？"}
    REVIEW -->|いいえ| REFINE["プロンプトを修正して再生成"]
    REFINE --> DRAFT
    REVIEW -->|はい| QUALITY["品質・複雑度・カバレッジを評価"]
    QUALITY --> DONE["テストスイートとして確定"]
    class REVIEW box
    class DONE done`;

const DIAGRAM_5 = `flowchart TB
    DEV["開発者がコードをコミット"] --> GH["GitHubリポジトリ"]
    GH --> CI["GitHub Actions ビルド＆テスト"]
    CI --> DOCKER["Copilot支援でDockerイメージを作成"]
    DOCKER --> REGISTRY["コンテナレジストリへpush"]
    REGISTRY --> TF["LLM支援でTerraformによるインフラ構築"]
    TF --> EKS["Amazon EKSへデプロイ"]
    EKS --> MONITOR["監視・ロールバック判断"]
    class GH hub
    class MONITOR done`;

const DIAGRAM_6 = `flowchart TB
    START["対象システムを定義する"] --> ASSET["資産・データフローを洗い出す"]
    ASSET --> CHATGPT["ChatGPTに脅威をブレインストーミングしてもらう"]
    CHATGPT --> CLASSIFY["脅威を分類する 例えばSTRIDE等の枠組み"]
    CLASSIFY --> RISK["リスクの優先順位をつける"]
    RISK --> MIT["緩和策をChatGPTと一緒に検討する"]
    MIT --> REVIEW["人間によるセキュリティレビュー"]
    REVIEW --> DONE["設計・実装に反映する"]
    class REVIEW box
    class DONE done`;

const DIAGRAM_7 = `flowchart TB
    Q1{"機密データを扱うか、オフライン環境か？"} -->|はい| LOCAL["ローカルLLMを使う"]
    Q1 -->|いいえ| Q2{"最高水準の回答品質が必要か？"}
    Q2 -->|はい| CLOUD["クラウドLLMを使う"]
    Q2 -->|いいえ| Q3{"コストやレイテンシを抑えたいか？"}
    Q3 -->|はい| LOCAL
    Q3 -->|いいえ| CLOUD
    class Q1 box
    class Q2 box
    class Q3 box
    class LOCAL done
    class CLOUD done`;

const DIAGRAM_8 = `flowchart LR
    A["Vibe Coding　コードをほぼ見ずにAI任せ"] -->|2025から2026年に注目される変化| B["Agentic Programming　人間がAIの出力を精査・監督"]
    class A hub
    class B done`;

export default function Page() {
  return (
    <div className={styles.layout} data-testid="layout-root">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.46.0/dist/tabler-icons.min.css"
        integrity="sha384-ND+q1IVc0KDElX60dZaqKc7Xl9cdxd2PpU2JfVUHcurCkFVtVLFdt9vJfxtHSL3p"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap"
        rel="stylesheet"
      />
      <TocObserver />
      <div className={styles.mobileBar}>
        {" "}
        <span className={styles.brand}>
          <i className="ti ti-sparkles"></i>
          {"AI-Powered Developer ガイド"}
        </span>{" "}
        <button
          id="menuToggle"
          aria-label="目次を開く"
          type="button"
          aria-controls="sidebar"
          aria-expanded="false"
        >
          <i className="ti ti-menu-2"></i>
        </button>{" "}
      </div>
      <div className={styles.scrim} id="scrim" aria-hidden="true"></div>
      <nav className={styles.sidebar} id="sidebar" data-testid="sidebar-nav" aria-label="目次">
        {" "}
        <div className={styles.sidebarBrand}>
          {" "}
          <i className="ti ti-sparkles"></i>{" "}
          <div className={styles.brandTitle}>
            {"AI-Powered Developer"}
            <br />
            {"初学者ステップガイド"}
          </div>{" "}
          <div className={styles.brandSub}>{"2026年9月版"}</div>{" "}
        </div>{" "}
        <div className={styles.navGroupLabel}>{"はじめに"}</div>{" "}
        <a
          className={[styles.navA, styles.active].join(" ")}
          href="#intro"
          data-testid="sidebar-nav-link"
        >
          <i className="ti ti-sparkles"></i>
          {"本ガイドについて"}
        </a>{" "}
        <a className={styles.navA} href="#s0" data-testid="sidebar-nav-link">
          <i className="ti ti-users"></i>
          {"対象読者と前提知識"}
        </a>{" "}
        <a className={styles.navA} href="#s1" data-testid="sidebar-nav-link">
          <i className="ti ti-book"></i>
          {"書籍情報"}
        </a>{" "}
        <a className={styles.navA} href="#s2" data-testid="sidebar-nav-link">
          <i className="ti ti-bulb"></i>
          {"なぜ今重要か"}
        </a>{" "}
        <a className={styles.navA} href="#s3" data-testid="sidebar-nav-link">
          <i className="ti ti-route"></i>
          {"学習ロードマップ"}
        </a>{" "}
        <div className={styles.navGroupLabel}>{"ステップ"}</div>{" "}
        <a className={styles.navA} href="#step1" data-testid="sidebar-nav-link">
          <i className="ti ti-brain"></i>
          {"Step1 LLMの基礎"}
        </a>{" "}
        <a className={styles.navA} href="#step2" data-testid="sidebar-nav-link">
          <i className="ti ti-message-chatbot"></i>
          {"Step2 ツールを使い始める"}
        </a>{" "}
        <a className={styles.navA} href="#step3" data-testid="sidebar-nav-link">
          <i className="ti ti-sitemap"></i>
          {"Step3 ソフトウェア設計"}
        </a>{" "}
        <a className={styles.navA} href="#step4" data-testid="sidebar-nav-link">
          <i className="ti ti-code"></i>
          {"Step4 Copilotで実装"}
        </a>{" "}
        <a className={styles.navA} href="#step5" data-testid="sidebar-nav-link">
          <i className="ti ti-database"></i>
          {"Step5 データ管理"}
        </a>{" "}
        <a className={styles.navA} href="#step6" data-testid="sidebar-nav-link">
          <i className="ti ti-flask"></i>
          {"Step6 テストと品質"}
        </a>{" "}
        <a className={styles.navA} href="#step7" data-testid="sidebar-nav-link">
          <i className="ti ti-cloud-upload"></i>
          {"Step7 インフラとデプロイ"}
        </a>{" "}
        <a className={styles.navA} href="#step8" data-testid="sidebar-nav-link">
          <i className="ti ti-shield-lock"></i>
          {"Step8 セキュリティ"}
        </a>{" "}
        <a className={styles.navA} href="#step9" data-testid="sidebar-nav-link">
          <i className="ti ti-device-laptop"></i>
          {"Step9 ローカルLLM"}
        </a>{" "}
        <a className={styles.navA} href="#step10" data-testid="sidebar-nav-link">
          <i className="ti ti-trending-up"></i>
          {"Step10 2026年の動向"}
        </a>{" "}
        <div className={styles.navGroupLabel}>{"まとめ"}</div>{" "}
        <a className={styles.navA} href="#glossary" data-testid="sidebar-nav-link">
          <i className="ti ti-book-2"></i>
          {"用語集"}
        </a>{" "}
        <a className={styles.navA} href="#checklist" data-testid="sidebar-nav-link">
          <i className="ti ti-checklist"></i>
          {"学習チェックリスト"}
        </a>{" "}
        <a className={styles.navA} href="#summary" data-testid="sidebar-nav-link">
          <i className="ti ti-flag"></i>
          {"まとめ"}
        </a>{" "}
        <a className={styles.navA} href="#references" data-testid="sidebar-nav-link">
          <i className="ti ti-link"></i>
          {"参考文献・出典"}
        </a>{" "}
      </nav>
      <div className={styles.main}>
        {" "}
        <header className={styles.hero} id="intro">
          {" "}
          <div className={styles.heroKicker}>
            <i className="ti ti-sparkles"></i>
            {"Beginner Step-by-Step Guide"}
          </div>{" "}
          <h1 className={styles.heroTitle} id="intro-heading">
            {" AI-Powered Developer: Supercharge Your Productivity with LLMs and AI Tools "}
          </h1>{" "}
          <p className={styles.heroSub}>
            {"― 初学者のためのステップバイステップ完全ガイド（2026年9月版）"}
          </p>{" "}
          <div className={styles.heroNote}>
            {" "}
            <strong>{"本ガイドについて"}</strong>
            <br />
            {" このガイドは、書籍ページ "}
            <a
              href="https://www.manning.com/books/ai-powered-developer"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"manning.com/books/ai-powered-developer"}
            </a>
            {" に掲載されている、Nathan B. Crocker 著『"}
            <strong>{"AI-Powered Developer: Build software with ChatGPT and Copilot"}</strong>
            {
              '』（Manning Publications、2024年8月刊）を土台にした学習ガイドです。Manning公式ページ上の副題は "Build software with ChatGPT and Copilot" ですが、書籍紹介文で一貫して掲げられている「生成AIツールで生産性・効率・コード品質を高める」というテーマは、ご質問の副題「Supercharge Your Productivity with LLMs and AI Tools」の内容と一致します。'
            }
            <br />
            <br />
            {
              " 書籍は2024年8月刊行のため登場ツール（GPT-4/GPT-3.5、GitHub Copilot、AWS CodeWhisperer）は当時世代のものです。本ガイドでは書籍の章構成をベースにした学習ステップに加え、2026年9月17日時点の最新動向を、Simon Willison・Andrej Karpathy・Martin Fowler・Kent Beck・Addy Osmaniら国際的に著名な開発者の発言を根拠に補足しています。出典URLは"
            }
            <a href="#references">{"参考文献・出典"}</a>
            {"にまとめています。 "}
          </div>{" "}
        </header>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="s0">
          {" "}
          <h2 className={styles.hTitle} id="s0-heading">
            <i className="ti ti-users"></i>
            {"0. 対象読者と前提知識"}
          </h2>{" "}
          <p>
            {
              " 本書は「中級のソフトウェア開発者向け、AIの経験は不要」とされています。本ガイドも同様に、以下のような方を想定しています。 "
            }
          </p>{" "}
          <ul>
            {" "}
            <li>{"基本的なプログラミング経験（言語は問わない）がある"}</li>{" "}
            <li>
              {
                " ChatGPTやGitHub Copilotなどの生成AIツールに触れたことはあるが、体系的に業務へ組み込んだことはない "
              }
            </li>{" "}
            <li>
              {
                " 設計・実装・テスト・デプロイ・セキュリティという開発ライフサイクル全体でAIをどう活用すべきか知りたい "
              }
            </li>{" "}
          </ul>{" "}
          <p>
            {
              " 前提知識がなくても読み進められるよう、各ステップで専門用語には簡単な説明を添えています。 "
            }
          </p>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="s1">
          {" "}
          <h2 className={styles.hTitle} id="s1-heading">
            <i className="ti ti-book"></i>
            {"1. 書籍情報"}
          </h2>{" "}
          <div className={styles.bookCard}>
            {" "}
            <div className={styles.bookCover}>
              {" "}
              <i className="ti ti-book"></i>{" "}
              <div>
                {" "}
                <div className={styles.bookCoverTitle}>{"AI-Powered Developer"}</div>{" "}
                <div className={styles.bookCoverAuthor}>
                  {" Nathan B. Crocker"}
                  <br />
                  {"Manning Publications, 2024 "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className={styles.bookCardBody}>
              {" "}
              <div className={styles.tableWrap}>
                {" "}
                <table className={styles.kvTable}>
                  {" "}
                  <tbody>
                    <tr>
                      {" "}
                      <th>{"書名"}</th>{" "}
                      <td>
                        {"AI-Powered Developer: Build software with ChatGPT and Copilot"}
                      </td>{" "}
                    </tr>{" "}
                    <tr>
                      {" "}
                      <th>{"著者"}</th>{" "}
                      <td>{"Nathan B. Crocker（Checker Corp. 共同創業者 兼 CTO）"}</td>{" "}
                    </tr>{" "}
                    <tr>
                      {" "}
                      <th>{"技術編集者"}</th> <td>{"Nicolai Nielsen"}</td>{" "}
                    </tr>{" "}
                    <tr>
                      {" "}
                      <th>{"出版社"}</th> <td>{"Manning Publications"}</td>{" "}
                    </tr>{" "}
                    <tr>
                      {" "}
                      <th>{"出版時期"}</th> <td>{"2024年8月"}</td>{" "}
                    </tr>{" "}
                    <tr>
                      {" "}
                      <th>{"ページ数"}</th> <td>{"240ページ"}</td>{" "}
                    </tr>{" "}
                    <tr>
                      {" "}
                      <th>{"ISBN"}</th> <td>{"9781633437616"}</td>{" "}
                    </tr>{" "}
                    <tr>
                      {" "}
                      <th>{"対象読者"}</th> <td>{"中級ソフトウェア開発者（AI経験は不要）"}</td>{" "}
                    </tr>{" "}
                    <tr>
                      {" "}
                      <th>{"翻訳版"}</th> <td>{"ドイツ語、簡体字中国語"}</td>{" "}
                    </tr>{" "}
                    <tr>
                      {" "}
                      <th>{"題材アプリ"}</th> <td>{"IT資産管理システム（ITAM）"}</td>{" "}
                    </tr>{" "}
                    <tr>
                      {" "}
                      <th>{"書籍ページ"}</th>{" "}
                      <td>
                        {" "}
                        <a
                          href="https://www.manning.com/books/ai-powered-developer"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"manning.com/books/ai-powered-developer"}
                        </a>{" "}
                      </td>{" "}
                    </tr>{" "}
                  </tbody>
                </table>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <p>
            {
              " 書籍全体は、架空のITAM（IT資産管理）システムを1本通しで構築しながら、設計・実装・データ管理・テスト・インフラ・セキュリティ・オフライン活用という開発ライフサイクルの各段階にAIをどう組み込むかを学ぶ構成になっています。 "
            }
          </p>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="s2">
          {" "}
          <h2 className={styles.hTitle} id="s2-heading">
            {" "}
            <i className="ti ti-bulb"></i>
            {"2. なぜ今このテーマが重要なのか（2026年の状況） "}
          </h2>{" "}
          <p>
            {
              " 書籍が刊行された2024年以降、AIを使ったコーディングは「一部の先進的な開発者の実験」から「業界標準のワークフロー」へと急速に変化しました。Stack Overflowが2025年に実施した大規模な開発者調査（177カ国・約5万人が回答）では、AIコーディングツールを「利用している、または利用予定」と回答した割合は84%に達した一方、AIの出力を「信頼している」と答えた開発者はわずか29%にとどまり、前年の40%から大きく低下しています"
            }
            <sup>
              <a href="#ref14" className={styles.cite}>
                {"14"}
              </a>
            </sup>
            {
              "。デバッグに時間がかかる（45%）、出力が「惜しいけれど微妙に間違っている」（66%）といった不満が上位を占めており、「使ってはいるが無条件には信じない」という姿勢が定着しつつあります。 "
            }
          </p>{" "}
          <p>
            {
              " 同時に、Django共同開発者として知られるSimon Willisonや、Thoughtworksのチーフサイエンティストで『リファクタリング』の著者としても有名なMartin Fowlerらは、2025〜2026年にかけて「vibe coding（バイブコーディング＝コードを読まずにAIに丸投げする手法）」から、人間がAIの出力を精査・監督する「エージェント型プログラミング（agentic programming）」への移行が起きていると指摘しています"
            }
            <sup>
              <a href="#ref10" className={styles.cite}>
                {"10"}
              </a>
            </sup>
            {
              "。つまり、本書が提示する「AIを“優秀だがジュニアな開発者”として扱い、設計レビューやコードレビューを人間が行う」という基本姿勢は、2026年時点でもむしろより重要性を増しているといえます。 "
            }
          </p>{" "}
          <p>
            {
              " 各ステップの終わりに設けた「2026年アップデート」の囲みでは、こうした最新の実務知見を補足していきます。 "
            }
          </p>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="s3">
          {" "}
          <h2 className={styles.hTitle} id="s3-heading">
            <i className="ti ti-route"></i>
            {"3. 学習ロードマップ全体図"}
          </h2>{" "}
          <p>
            {
              " 書籍の9つの章を、本ガイドではStep1〜Step9として整理し、さらに2026年時点の補足を独自のStep10として追加しています。 "
            }
          </p>{" "}
          <div className={styles.diagramWrap}>
            {" "}
            <div className={styles.diagramCaption}>{"図1｜学習ロードマップ全体図"}</div>{" "}
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                id="dg-roadmap"
                chart={DIAGRAM_0}
                theme="base"
                flowchartHtmlLabels={false}
                themeVariables={THEME_VARIABLES}
              />
            </div>{" "}
          </div>{" "}
          <p>{"書籍の章とStepの対応関係は以下のとおりです。"}</p>{" "}
          <div className={styles.tableWrap}>
            {" "}
            <table>
              {" "}
              <thead>
                {" "}
                <tr>
                  {" "}
                  <th>{"Step"}</th> <th>{"書籍の章"}</th> <th>{"章タイトル（原題）"}</th>{" "}
                  <th>{"主な内容"}</th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody>
                {" "}
                <tr>
                  {" "}
                  <td>{"Step1"}</td> <td>{"第1章"}</td>{" "}
                  <td>{"Understanding large language models"}</td>{" "}
                  <td>{"LLMの基礎、生成AIの利点、使うべき場面・避けるべき場面"}</td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"Step2"}</td> <td>{"第2章"}</td>{" "}
                  <td>{"Getting started with large language models"}</td>{" "}
                  <td>
                    {
                      " ChatGPT/Copilot/CodeWhispererの使い方比較、プロンプトエンジニアリングパターン "
                    }
                  </td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"Step3"}</td> <td>{"第3章"}</td> <td>{"Designing software with ChatGPT"}</td>{" "}
                  <td>{"ITAMシステムの設計、Mermaidによるアーキテクチャ文書化"}</td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"Step4"}</td> <td>{"第4章"}</td>{" "}
                  <td>{"Building software with GitHub Copilot"}</td>{" "}
                  <td>{"ドメインモデル実装、デザインパターン、ヘキサゴナルアーキテクチャ"}</td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"Step5"}</td> <td>{"第5章"}</td>{" "}
                  <td>{"Managing data with GitHub Copilot and Copilot Chat"}</td>{" "}
                  <td>{"データ永続化、Kafkaストリーミング、Sparkによる分析"}</td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"Step6"}</td> <td>{"第6章"}</td>{" "}
                  <td>{"Testing, assessing, and explaining with LLMs"}</td>{" "}
                  <td>{"単体/統合/振る舞いテスト、品質評価、バグ検出、コード説明・翻訳"}</td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"Step7"}</td> <td>{"第7章"}</td>{" "}
                  <td>{"Coding infrastructure and managing deployments"}</td>{" "}
                  <td>{"Docker、Terraform、コンテナレジストリ、Kubernetes、CI/CD"}</td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"Step8"}</td> <td>{"第8章"}</td>{" "}
                  <td>{"Secure application development with ChatGPT"}</td>{" "}
                  <td>
                    {"脅威モデリング、脆弱性評価、セキュリティのベストプラクティス、暗号化"}
                  </td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"Step9"}</td> <td>{"第9章"}</td> <td>{"GPT-ing on the go"}</td>{" "}
                  <td>
                    {"ローカルLLM（Llama 2、GPT4All）の実行と比較、オフライン活用の判断基準"}
                  </td>{" "}
                </tr>{" "}
              </tbody>{" "}
            </table>{" "}
          </div>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="step1">
          {" "}
          <div className={styles.stepBadge} data-testid="step-tag">
            {"STEP 1 / 9"}
          </div>{" "}
          <h2 className={styles.hTitle} id="step1-heading">
            <i className="ti ti-brain"></i>
            {"LLMの基礎を理解する"}
          </h2>{" "}
          <h3 id="step1-sub-1">
            <i className="ti ti-flag"></i>
            {"この章のねらい"}
          </h3>{" "}
          <p>
            {
              " 書籍は冒頭で、印象的な例えを使っています。「あなたは知らないうちに昇進していた。世界で最も優秀で意欲的なジュニア開発者が、あなたのチームに加わったのだ」というものです。つまり生成AI（特にLLM）は、指示すれば動いてくれるが、成果物のレビューや方向づけは依然として人間の役目である、という基本姿勢が全編を貫いています。 "
            }
          </p>{" "}
          <h3 id="step1-sub-2">
            <i className="ti ti-list-check"></i>
            {"学ぶポイント"}
          </h3>{" "}
          <ul>
            {" "}
            <li>
              {" "}
              <strong>{"生成AIとLLMの違い"}</strong>
              {
                "：生成AI（Generative AI）は画像・音声・コードなど多様な出力を生成するAI全般を指す広い概念で、LLM（大規模言語モデル）はそのうちテキスト（自然言語やコード）を扱うモデルを指します。 "
              }
            </li>{" "}
            <li>
              {" "}
              <strong>{"LLMが得意なこと"}</strong>
              {
                "：定型的なコード生成（ボイラープレート）、既存コードの説明、テストコードの下書き、ドキュメント作成など。 "
              }
            </li>{" "}
            <li>
              {" "}
              <strong>{"LLMが苦手・注意が必要なこと"}</strong>
              {
                "：最新情報の反映（学習データのカットオフ以降の情報は知らない）、厳密な数値計算、社内固有のビジネスルールの正確な理解、出力の“もっともらしい誤り”（ハルシネーション）。 "
              }
            </li>{" "}
            <li>
              {" "}
              <strong>{"いつ使い、いつ避けるべきか"}</strong>
              {
                "：定型作業や叩き台作りには積極的に使い、機密情報を含むコードの丸投げや、検証なしの本番反映は避けるべき、というのが書籍の基本方針です。 "
              }
            </li>{" "}
          </ul>{" "}
          <div
            className={[styles.callout, styles.update].join(" ")}
            data-testid="callout"
            data-variant={UPDATE_VARIANT}
          >
            {" "}
            <i className="ti ti-trending-up"></i>{" "}
            <div className={styles.calloutBody}>
              {" "}
              <span className={styles.calloutTitle} data-testid="callout-label">
                {"2026年アップデート"}
              </span>{" "}
              <p>
                {" Stack Overflowの2025年調査"}
                <sup>
                  <a href="#ref14" className={styles.cite}>
                    {"14"}
                  </a>
                </sup>
                {
                  "でも、「AIの回答が“惜しいけれど微妙に間違っている”」ことが開発者の最大の不満（66%）として挙げられており、この章が説く「AIをジュニア開発者として扱い、成果物は必ずレビューする」という姿勢は今なお有効です。 "
                }
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="step2">
          {" "}
          <div className={styles.stepBadge} data-testid="step-tag">
            {"STEP 2 / 9"}
          </div>{" "}
          <h2 className={styles.hTitle} id="step2-heading">
            {" "}
            <i className="ti ti-message-chatbot"></i>
            {"ChatGPT・Copilot・CodeWhispererを使い始める（プロンプトエンジニアリング入門） "}
          </h2>{" "}
          <h3 id="step2-sub-3">
            <i className="ti ti-flag"></i>
            {"この章のねらい"}
          </h3>{" "}
          <p>
            {
              " 書籍は、大手テック企業の技術面接を模したシナリオを題材に、ChatGPT（GPT-4とGPT-3.5の両方）、GitHub Copilot、AWS CodeWhispererという3つのツールを比較しながら基本操作を学びます。同時に、プロンプトエンジニアリングの代表的なパターンをいくつも紹介しています。 "
            }
          </p>{" "}
          <h3 id="step2-sub-4">
            <i className="ti ti-scale"></i>
            {"3つのツールの位置づけ（書籍刊行時点）"}
          </h3>{" "}
          <div className={styles.tableWrap}>
            {" "}
            <table>
              {" "}
              <thead>
                {" "}
                <tr>
                  {" "}
                  <th>{"ツール"}</th> <th>{"主な使い方（2024年当時）"}</th> <th>{"特徴"}</th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody>
                {" "}
                <tr>
                  {" "}
                  <td>{"ChatGPT（GPT-4 / GPT-3.5）"}</td>{" "}
                  <td>{"チャット形式での対話、設計相談、コード生成・説明"}</td>{" "}
                  <td>
                    {"汎用的な対話能力が高く、設計や説明のような「会話」が必要な場面に強い"}
                  </td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"GitHub Copilot"}</td> <td>{"IDE内でのインライン補完、Copilot Chat"}</td>{" "}
                  <td>
                    {"エディタに統合されており、実装作業の流れを止めずにコードを書き進められる"}
                  </td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"AWS CodeWhisperer"}</td> <td>{"IDE内でのインライン補完"}</td>{" "}
                  <td>{"AWSサービスとの親和性が高く、AWS SDKやIaCコードの提案に強み"}</td>{" "}
                </tr>{" "}
              </tbody>{" "}
            </table>{" "}
          </div>{" "}
          <h3 id="step2-sub-5">
            <i className="ti ti-wand"></i>
            {"プロンプトエンジニアリングの代表的パターン"}
          </h3>{" "}
          <p>
            {
              " 書籍のFAQでも触れられている通り、Persona（ペルソナ）、Audience Persona（想定読者ペルソナ）、Refinement（リファインメント）といったパターンを使うと、LLMからより一貫性のある・文脈に即した回答を引き出しやすくなります。これらは学術研究でも体系化されている、プロンプトエンジニアリングの定番パターンです。 "
            }
          </p>{" "}
          <div className={styles.tableWrap}>
            {" "}
            <table>
              {" "}
              <thead>
                {" "}
                <tr>
                  {" "}
                  <th>{"パターン名"}</th> <th>{"目的"}</th> <th>{"使い方の例（意訳）"}</th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody>
                {" "}
                <tr>
                  {" "}
                  <td>{"Persona（ペルソナ）"}</td> <td>{"AIに特定の役割・専門性を与える"}</td>{" "}
                  <td>
                    {
                      " 「あなたはシニアバックエンドエンジニアです。以下のAPI設計をレビューしてください」 "
                    }
                  </td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"Audience Persona（想定読者ペルソナ）"}</td>{" "}
                  <td>{"出力の説明レベルを読者に合わせる"}</td>{" "}
                  <td>
                    {" 「プログラミング初心者にもわかるように、この関数の動きを説明してください」 "}
                  </td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"Refinement（リファインメント）"}</td>{" "}
                  <td>{"一度の回答で終わらせず、対話的に改善する"}</td>{" "}
                  <td>{"「この実装を、可読性を優先する方向でもう一度書き直してください」"}</td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"Flipped Interaction（質問の逆転）"}</td>{" "}
                  <td>{"AI側から必要な情報を質問させる"}</td>{" "}
                  <td>{"「設計を提案する前に、不明な点があれば先に質問してください」"}</td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"Cognitive Verifier（検証の分解）"}</td>{" "}
                  <td>{"複雑な問いを小さな確認問いに分解させる"}</td>{" "}
                  <td>
                    {" 「この要件を満たすために確認すべき前提条件を、先に箇条書きにしてください」 "}
                  </td>{" "}
                </tr>{" "}
              </tbody>{" "}
            </table>{" "}
          </div>{" "}
          <div
            className={[styles.callout, styles.update].join(" ")}
            data-testid="callout"
            data-variant={UPDATE_VARIANT}
          >
            {" "}
            <i className="ti ti-trending-up"></i>{" "}
            <div className={styles.calloutBody}>
              {" "}
              <span className={styles.calloutTitle} data-testid="callout-label">
                {"2026年アップデート"}
              </span>{" "}
              <p>
                {
                  " AWSのCodeWhispererは2024年4月30日付けで「Amazon Q Developer」へと統合・改称されており"
                }
                <sup>
                  <a href="#ref18" className={styles.cite}>
                    {"18"}
                  </a>
                </sup>
                {
                  "、現在は単体製品としては存在しません。エージェント機能（自律的な機能実装・ドキュメント生成・リファクタリング）やMCP（Model Context Protocol）連携なども追加され、書籍刊行時よりも大幅に機能が拡張されています。学習の際は「CodeWhisperer」という名称ではなく「Amazon Q Developer」で検索するとよいでしょう。 "
                }
              </p>{" "}
              <p>
                {
                  " またGitHub Copilotも、単純なインライン補完だけでなく、リポジトリ全体を横断してタスクを自律的にこなす「Copilotエージェントモード」などが追加されています。プロンプトエンジニアリングの基本パターン自体は現在も有効ですが、著名なプロンプトエンジニアリング解説者であるSimon Willison"
                }
                <sup>
                  <a href="#ref4" className={styles.cite}>
                    {"4"}
                  </a>
                </sup>
                {
                  "は、2026年にはタスクごとに使うモデルの性能を使い分ける判断も重要になってきていると述べています。 "
                }
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="step3">
          {" "}
          <div className={styles.stepBadge} data-testid="step-tag">
            {"STEP 3 / 9"}
          </div>{" "}
          <h2 className={styles.hTitle} id="step3-heading">
            <i className="ti ti-sitemap"></i>
            {"ChatGPTでソフトウェアを設計する"}
          </h2>{" "}
          <h3 id="step3-sub-6">
            <i className="ti ti-flag"></i>
            {"この章のねらい"}
          </h3>{" "}
          <p>
            {
              " 書籍では、いきなり実装に入るのではなく、まずChatGPTと対話しながらITAM（IT資産管理）システムの設計案を練り、Mermaidを使ってアーキテクチャを文書化する流れを解説しています。設計を先に言語化しておくことで、実装の手戻りを減らし、チームやステークホルダーへの説明もしやすくなる、という考え方です。 "
            }
          </p>{" "}
          <div className={styles.diagramWrap}>
            {" "}
            <div className={styles.diagramCaption}>{"図2｜設計ワークフロー"}</div>{" "}
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                id="dg-design"
                chart={DIAGRAM_1}
                theme="base"
                flowchartHtmlLabels={false}
                themeVariables={THEME_VARIABLES}
              />
            </div>{" "}
          </div>{" "}
          <h3 id="step3-sub-7">
            <i className="ti ti-bulb"></i>
            {"実践のコツ"}
          </h3>{" "}
          <ul>
            {" "}
            <li>
              {" "}
              <strong>{"要件を先に箇条書きにする"}</strong>
              {
                "：曖昧な依頼より、機能要件・非機能要件を整理してから相談したほうが精度の高い提案が返ってきます。 "
              }
            </li>{" "}
            <li>
              {" "}
              <strong>{"一度で決め打ちしない"}</strong>
              {
                "：複数の設計案を出させ、トレードオフ（コスト・複雑さ・拡張性など）を比較検討する材料として使います。 "
              }
            </li>{" "}
            <li>
              {" "}
              <strong>{"図はAIに書かせてレビューする"}</strong>
              {
                "：Mermaid記法でアーキテクチャ図やシーケンス図を生成させ、人間がその図を見ながら妥当性を確認する、という使い方が効率的です。 "
              }
            </li>{" "}
          </ul>{" "}
          <div
            className={[styles.callout, styles.update].join(" ")}
            data-testid="callout"
            data-variant={UPDATE_VARIANT}
          >
            {" "}
            <i className="ti ti-trending-up"></i>{" "}
            <div className={styles.calloutBody}>
              {" "}
              <span className={styles.calloutTitle} data-testid="callout-label">
                {"2026年アップデート"}
              </span>{" "}
              <p>
                {" Martin Fowル"}
                <sup>
                  <a href="#ref11" className={styles.cite}>
                    {"11"}
                  </a>
                </sup>
                {
                  "は、コードそのものより「既存の大規模で複雑なレガシーシステムを理解する」ことにこそ生成AIの価値があるとも指摘しています。設計フェーズでAIを使う効用は、ゼロからの設計だけでなく、既存システムの構造を素早く把握し直す場面でも広がっています。 "
                }
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="step4">
          {" "}
          <div className={styles.stepBadge} data-testid="step-tag">
            {"STEP 4 / 9"}
          </div>{" "}
          <h2 className={styles.hTitle} id="step4-heading">
            <i className="ti ti-code"></i>
            {"GitHub Copilotで実装する"}
          </h2>{" "}
          <h3 id="step4-sub-8">
            <i className="ti ti-flag"></i>
            {"この章のねらい"}
          </h3>{" "}
          <p>
            {
              " 設計が固まったら、GitHub Copilotを使ってドメインモデル（業務ルールを表現するコアのクラス群）を実装していきます。書籍はこの章について「LLMを使う最大のメリットは、知らないことすら知らない落とし穴（unknown unknowns）を照らし出してくれる点にある」と述べており、難しいことを易しく、一見不可能に思えることを可能にしてくれると位置づけています。 "
            }
          </p>{" "}
          <h3 id="step4-sub-9">
            <i className="ti ti-list-check"></i>
            {"扱うトピック"}
          </h3>{" "}
          <ul>
            {" "}
            <li>{"ドメインモデルの実装と、イミュータビリティ（不変性）を重視した設計"}</li>{" "}
            <li>
              {
                " デコレーターパターン・ファクトリーパターン・オブザーバーパターンなど、古典的なデザインパターンの適用 "
              }
            </li>{" "}
            <li>
              <strong>{"ヘキサゴナルアーキテクチャ（ポート＆アダプター）"}</strong>
              {"の導入"}
            </li>{" "}
          </ul>{" "}
          <h3 id="step4-sub-10">
            <i className="ti ti-hexagon"></i>
            {"ヘキサゴナルアーキテクチャのイメージ"}
          </h3>{" "}
          <p>
            {
              " 業務ロジック（ドメインモデル）を中心に置き、外部システム（Web、CLI、データベース、メッセージング等）とのやり取りを「ポート」と「アダプター」を介して行うことで、コアロジックを外部技術から独立させる設計手法です。 "
            }
          </p>{" "}
          <div className={styles.diagramWrap}>
            {" "}
            <div className={styles.diagramCaption}>
              {"図3｜ヘキサゴナルアーキテクチャ（ポート＆アダプター）"}
            </div>{" "}
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                id="dg-hexagonal"
                chart={DIAGRAM_2}
                theme="base"
                flowchartHtmlLabels={false}
                themeVariables={THEME_VARIABLES}
              />
            </div>{" "}
          </div>{" "}
          <p>
            {
              " このように中心のドメインモデルを外部の技術的関心事から切り離しておくと、後から実装を差し替えたり、テストのためにモックへ置き換えたりしやすくなります。 "
            }
          </p>{" "}
          <div
            className={[styles.callout, styles.update].join(" ")}
            data-testid="callout"
            data-variant={UPDATE_VARIANT}
          >
            {" "}
            <i className="ti ti-trending-up"></i>{" "}
            <div className={styles.calloutBody}>
              {" "}
              <span className={styles.calloutTitle} data-testid="callout-label">
                {"2026年アップデート"}
              </span>{" "}
              <p>
                {" TDDの提唱者として知られるKent Beck"}
                <sup>
                  <a href="#ref13" className={styles.cite}>
                    {"13"}
                  </a>
                </sup>
                {
                  "は、AIエージェントと組み合わせたコーディングについて「エージェントはテスト駆動開発をやりたがらない。まず実装を書いて、それに通るテストを後から書こうとする」と述べ、油断するとAIがテストを消してでも帳尻を合わせようとする挙動に注意が必要だと指摘しています。ヘキサゴナルアーキテクチャのようにコアロジックと外部技術を分離しておくことは、AIにテストを書かせる際にも、境界がはっきりしている分、悪い挙動に気づきやすくするという意味でも有効です。 "
                }
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="step5">
          {" "}
          <div className={styles.stepBadge} data-testid="step-tag">
            {"STEP 5 / 9"}
          </div>{" "}
          <h2 className={styles.hTitle} id="step5-heading">
            {" "}
            <i className="ti ti-database"></i>
            {"データ管理とイベント駆動アーキテクチャ "}
          </h2>{" "}
          <h3 id="step5-sub-11">
            <i className="ti ti-flag"></i>
            {"この章のねらい"}
          </h3>{" "}
          <p>
            {
              " ITAMシステムに実際のデータを流し込み、扱えるようにする章です。リレーショナルデータベースへの永続化に始まり、Apache Kafkaを使ったイベントストリーミング、Apache Sparkを使ったリアルタイム分析までを、GitHub CopilotとCopilot Chatの支援を受けながら実装していきます。 "
            }
          </p>{" "}
          <div className={styles.diagramWrap}>
            {" "}
            <div className={styles.diagramCaption}>{"図4｜イベント駆動データフローのイメージ"}</div>{" "}
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                id="dg-event"
                chart={DIAGRAM_3}
                theme="base"
                flowchartHtmlLabels={false}
                themeVariables={THEME_VARIABLES}
              />
            </div>{" "}
          </div>{" "}
          <h3 id="step5-sub-12">
            <i className="ti ti-list-check"></i>
            {"学ぶポイント"}
          </h3>{" "}
          <ul>
            {" "}
            <li>
              {" "}
              <strong>{"なぜイベント駆動か"}</strong>
              {
                "：資産の状態変化（購入・配備・廃棄など）をイベントとして流すことで、複数のシステムがリアルタイムに連携できるようになります。 "
              }
            </li>{" "}
            <li>
              {" "}
              <strong>{"AIの役割"}</strong>
              {
                "：Kafkaのプロデューサー/コンシューマーのボイラープレートコードや、Sparkのストリーミング処理のひな形をCopilotに生成させ、人間はビジネスロジックの妥当性検証に集中する、という分業がこの章のテーマです。 "
              }
            </li>{" "}
          </ul>{" "}
          <div
            className={[styles.callout, styles.update].join(" ")}
            data-testid="callout"
            data-variant={UPDATE_VARIANT}
          >
            {" "}
            <i className="ti ti-trending-up"></i>{" "}
            <div className={styles.calloutBody}>
              {" "}
              <span className={styles.calloutTitle} data-testid="callout-label">
                {"2026年アップデート"}
              </span>{" "}
              <p>
                {
                  " データパイプラインやストリーミング処理のコードは定型パターンが多く、AIによる生成の効果が出やすい領域です。一方で、スキーマ設計やイベントの意味づけは業務理解が必要なため、依然として人間の設計判断が中心になります。 "
                }
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="step6">
          {" "}
          <div className={styles.stepBadge} data-testid="step-tag">
            {"STEP 6 / 9"}
          </div>{" "}
          <h2 className={styles.hTitle} id="step6-heading">
            <i className="ti ti-flask"></i>
            {"テスト・品質評価・コード説明"}
          </h2>{" "}
          <h3 id="step6-sub-13">
            <i className="ti ti-flag"></i>
            {"この章のねらい"}
          </h3>{" "}
          <p>
            {
              " 書籍が「ソフトウェア工学における重要な側面」と位置づけるテストの章です。単体テスト・統合テスト・振る舞いテスト（Behavior Testing）の3種類をLLMに書かせる方法、コード品質・複雑度の評価、バグ発見、コードカバレッジの確認、さらにコードの説明や、プログラミング言語間の変換までを扱います。 "
            }
          </p>{" "}
          <div className={styles.tableWrap}>
            {" "}
            <table>
              {" "}
              <thead>
                {" "}
                <tr>
                  {" "}
                  <th>{"テストの種類"}</th> <th>{"目的"}</th> <th>{"AIが役立つ場面"}</th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody>
                {" "}
                <tr>
                  {" "}
                  <td>{"単体テスト（Unit Testing）"}</td>{" "}
                  <td>{"個々の関数・クラスの正しさを検証する"}</td>{" "}
                  <td>{"典型的なテストケースの下書き生成、境界値の洗い出し"}</td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"統合テスト（Integration Testing）"}</td>{" "}
                  <td>{"複数コンポーネント間の連携を検証する"}</td>{" "}
                  <td>{"テスト用のモック・スタブコードの生成"}</td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"振る舞いテスト（Behavior Testing）"}</td>{" "}
                  <td>{"ユーザー視点での挙動を検証する"}</td>{" "}
                  <td>{"自然言語のシナリオからテストコードへの変換"}</td>{" "}
                </tr>{" "}
              </tbody>{" "}
            </table>{" "}
          </div>{" "}
          <div className={styles.diagramWrap}>
            {" "}
            <div className={styles.diagramCaption}>{"図5｜AI活用の流れ（テスト生成ループ）"}</div>{" "}
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                id="dg-testing"
                chart={DIAGRAM_4}
                theme="base"
                flowchartHtmlLabels={false}
                themeVariables={THEME_VARIABLES}
              />
            </div>{" "}
          </div>{" "}
          <div
            className={[styles.callout, styles.update].join(" ")}
            data-testid="callout"
            data-variant={UPDATE_VARIANT}
          >
            {" "}
            <i className="ti ti-trending-up"></i>{" "}
            <div className={styles.calloutBody}>
              {" "}
              <span className={styles.calloutTitle} data-testid="callout-label">
                {"2026年アップデート：AIとTDDを組み合わせる際の注意点"}
              </span>{" "}
              <p>
                {
                  " 前述のKent Beckの指摘の通り、AIエージェントは「テストを通すこと」自体を目的化し、実装のバグを直す代わりにテストのほうを書き換えたり削除したりしてしまうことがあります。実務では次のような工夫が有効とされています。 "
                }
              </p>{" "}
              <ul>
                {" "}
                <li>
                  {
                    " 生成されたテストとその実装が、本当に意図した仕様を検証しているかを必ず人間がレビューする "
                  }
                </li>{" "}
                <li>
                  {
                    " 「既存のテストは変更せず、実装だけを直すこと」のようにプロンプトで明示的に制約を与える "
                  }
                </li>{" "}
                <li>
                  {"テストをコードレビューの対象として扱い、実装コードと同じ厳格さで確認する"}
                </li>{" "}
              </ul>{" "}
              <p>
                {" Addy Osmani"}
                <sup>
                  <a href="#ref7" className={styles.cite}>
                    {"7"}
                  </a>
                </sup>
                {
                  "も、AIとのペアプログラミングは「自信満々だが間違いも多い」相棒として捉えるべきであり、盲目的に成果物を信用しないことを鉄則として挙げています。 "
                }
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="step7">
          {" "}
          <div className={styles.stepBadge} data-testid="step-tag">
            {"STEP 7 / 9"}
          </div>{" "}
          <h2 className={styles.hTitle} id="step7-heading">
            <i className="ti ti-cloud-upload"></i>
            {"インフラのコード化とデプロイ"}
          </h2>{" "}
          <h3 id="step7-sub-14">
            <i className="ti ti-flag"></i>
            {"この章のねらい"}
          </h3>{" "}
          <p>
            {
              " テストが完了したアプリケーションを、実際にクラウド環境へリリースするフェーズです。Copilotの支援を受けながらDockerfileを作成し、Terraformでインフラをコード化し、コンテナレジストリでイメージを管理し、Amazon EKS（Kubernetes）へデプロイし、最後にGitHub ActionsでCI/CDパイプラインを組み上げるところまでを扱います。 "
            }
          </p>{" "}
          <div className={styles.diagramWrap}>
            {" "}
            <div className={styles.diagramCaption}>{"図6｜CI/CDパイプラインのイメージ"}</div>{" "}
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                id="dg-cicd"
                chart={DIAGRAM_5}
                theme="base"
                flowchartHtmlLabels={false}
                themeVariables={THEME_VARIABLES}
              />
            </div>{" "}
          </div>{" "}
          <h3 id="step7-sub-15">
            <i className="ti ti-list-check"></i>
            {"学ぶポイント"}
          </h3>{" "}
          <ul>
            {" "}
            <li>
              {" "}
              <strong>{"IaC（Infrastructure as Code）とAI"}</strong>
              {
                "：TerraformやKubernetesマニフェストのような定型的だが間違えやすい記述は、AIによる下書き生成の効果が特に大きい領域です。 "
              }
            </li>{" "}
            <li>
              {" "}
              <strong>{"人間が確認すべき点"}</strong>
              {
                "：生成されたIaCコードが、意図しない過剰な権限（IAMロールなど）を作っていないか、コスト面で問題がないかは必ず人間がレビューする必要があります。 "
              }
            </li>{" "}
          </ul>{" "}
          <div
            className={[styles.callout, styles.update].join(" ")}
            data-testid="callout"
            data-variant={UPDATE_VARIANT}
          >
            {" "}
            <i className="ti ti-trending-up"></i>{" "}
            <div className={styles.calloutBody}>
              {" "}
              <span className={styles.calloutTitle} data-testid="callout-label">
                {"2026年アップデート"}
              </span>{" "}
              <p>
                {
                  " インフラのコード化においても、AIエージェントに実行権限を与えて自律的に作業させる「エージェント型」の運用が増えています。Simon Willison"
                }
                <sup>
                  <a href="#ref6" className={styles.cite}>
                    {"6"}
                  </a>
                </sup>
                {
                  "は、システムへのフルアクセス権を持つエージェントは強力だが危険でもあり、エージェント自身の操作ログを一元管理して異常時に検知・復旧できるようにしておく重要性を強調しています。デプロイや権限まわりの自動化ほど、慎重なガードレール設計が必要になります。 "
                }
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="step8">
          {" "}
          <div className={styles.stepBadge} data-testid="step-tag">
            {"STEP 8 / 9"}
          </div>{" "}
          <h2 className={styles.hTitle} id="step8-heading">
            <i className="ti ti-shield-lock"></i>
            {"セキュアなアプリケーション開発"}
          </h2>{" "}
          <h3 id="step8-sub-16">
            <i className="ti ti-flag"></i>
            {"この章のねらい"}
          </h3>{" "}
          <p>
            {
              " 書籍では、PythonとFastAPIで書かれたISAM（Information Security Asset Management）を題材に、ChatGPTを脅威モデリング・脆弱性評価・セキュリティのベストプラクティス適用・保存時および通信時のデータ暗号化に活用する方法を解説しています。 "
            }
          </p>{" "}
          <div className={styles.diagramWrap}>
            {" "}
            <div className={styles.diagramCaption}>{"図7｜脅威モデリングの流れ"}</div>{" "}
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                id="dg-threat"
                chart={DIAGRAM_6}
                theme="base"
                flowchartHtmlLabels={false}
                themeVariables={THEME_VARIABLES}
              />
            </div>{" "}
          </div>{" "}
          <h3 id="step8-sub-17">
            <i className="ti ti-list-check"></i>
            {"学ぶポイント"}
          </h3>{" "}
          <ul>
            {" "}
            <li>
              {
                " ChatGPTは、脆弱性のパターン（インジェクション、認可不備など）を網羅的に洗い出す「壁打ち相手」として有効ですが、最終的なリスク判断は必ず人間が行う必要があります。 "
              }
            </li>{" "}
            <li>
              {
                " 保存時の暗号化（Encryption at Rest）と通信時の暗号化（Encryption in Transit）は別々の課題であり、それぞれに適した手法をAIに調べさせながら実装します。 "
              }
            </li>{" "}
          </ul>{" "}
          <h3 id="step8-sub-18">
            {" "}
            <i className="ti ti-alert-triangle"></i>
            {"LLM・AIエージェント特有のセキュリティリスク（OWASP LLM Top 10） "}
          </h3>{" "}
          <div className={styles.tableWrap}>
            {" "}
            <table>
              {" "}
              <thead>
                {" "}
                <tr>
                  {" "}
                  <th>{"リスク分類（例）"}</th> <th>{"概要"}</th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody>
                {" "}
                <tr>
                  {" "}
                  <td>{"プロンプトインジェクション"}</td>{" "}
                  <td>{"外部からの入力によってLLMの挙動を意図しない方向に操作される"}</td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"機微情報の漏えい"}</td>{" "}
                  <td>
                    {"LLMの出力を通じて、学習データや内部プロンプトに含まれる機密情報が漏れる"}
                  </td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"不適切な出力処理"}</td>{" "}
                  <td>
                    {
                      " LLMの出力をそのまま実行・表示することで、XSSやコードインジェクションなど従来型の脆弱性が再発する "
                    }
                  </td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"過剰な自律性（Excessive Agency）"}</td>{" "}
                  <td>
                    {
                      " AIエージェントに与える権限・実行範囲が過大で、意図しない操作を自律的に行ってしまう "
                    }
                  </td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"サプライチェーンの脆弱性"}</td>{" "}
                  <td>{"利用するモデルやプラグイン、学習データの出どころに起因するリスク"}</td>{" "}
                </tr>{" "}
              </tbody>{" "}
            </table>{" "}
          </div>{" "}
          <div
            className={[styles.callout, styles.update].join(" ")}
            data-testid="callout"
            data-variant={UPDATE_VARIANT}
          >
            {" "}
            <i className="ti ti-trending-up"></i>{" "}
            <div className={styles.calloutBody}>
              {" "}
              <span className={styles.calloutTitle} data-testid="callout-label">
                {"2026年アップデート：LLM／AIエージェント特有のセキュリティリスク"}
              </span>{" "}
              <p>
                {" 2026年版のOWASP LLM Top 10"}
                <sup>
                  <a href="#ref17" className={styles.cite}>
                    {"17"}
                  </a>
                </sup>
                {
                  "では、AIが自律的に「行動する」エージェント時代を踏まえ、プロンプトインジェクションが依然として最重要リスクとされる一方、権限を超えたツール呼び出し（unauthorized tool invocation）は「LLM03:2026 Excessive Agency」の一部として位置づけられています。なお、正規に付与された権限内でエージェントがツールを不適切に使ってしまう「ツールの誤用」は、別ガイドであるOWASP Top 10 for Agentic Applications"
                }
                <sup>
                  <a href="#ref22" className={styles.cite}>
                    {"22"}
                  </a>
                </sup>
                {
                  "の「ASI02: Tool Misuse & Exploitation」で個別に扱われています。書籍第8章で学ぶ「ChatGPTを使った脅威モデリング」の考え方は、いまや「AIを組み込んだアプリケーション自体をどう守るか」という新しい脅威モデリングの対象にも、そのまま応用できる考え方です。 "
                }
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="step9">
          {" "}
          <div className={styles.stepBadge} data-testid="step-tag">
            {"STEP 9 / 9"}
          </div>{" "}
          <h2 className={styles.hTitle} id="step9-heading">
            <i className="ti ti-device-laptop"></i>
            {"ローカルLLMの活用"}
          </h2>{" "}
          <h3 id="step9-sub-19">
            <i className="ti ti-flag"></i>
            {"この章のねらい"}
          </h3>{" "}
          <p>
            {
              " 「海外のAIカンファレンスに向かう飛行機の中で、機内Wi-Fiが遅くて高いとき、手元のノートPCでLLMをオフラインで動かせたら」という導入から始まる章です。Llama 2やGPT4Allをローカル環境で動かし、ChatGPTの回答と比較しながら、いつオフラインモデルで十分か、いつクラウドのモデルが必要かを判断する材料を提供しています。 "
            }
          </p>{" "}
          <div className={styles.diagramWrap}>
            {" "}
            <div className={styles.diagramCaption}>{"図8｜ローカルLLM活用の判断フロー"}</div>{" "}
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                id="dg-local"
                chart={DIAGRAM_7}
                theme="base"
                flowchartHtmlLabels={false}
                themeVariables={THEME_VARIABLES}
              />
            </div>{" "}
          </div>{" "}
          <h3 id="step9-sub-20">
            <i className="ti ti-scale"></i>
            {"書籍刊行時点（2024年）と2026年時点の比較"}
          </h3>{" "}
          <div className={styles.tableWrap}>
            {" "}
            <table>
              {" "}
              <thead>
                {" "}
                <tr>
                  {" "}
                  <th>{"観点"}</th> <th>{"2024年（書籍刊行時）"}</th> <th>
                    {"2026年（現在）"}
                  </th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody>
                {" "}
                <tr>
                  {" "}
                  <td>{"代表的なツール"}</td> <td>{"Llama 2、GPT4All"}</td>{" "}
                  <td>{"Ollama、LM Studio（両者とも安定版が2年以上継続提供）"}</td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"実行環境"}</td> <td>{"CLIやデスクトップアプリが中心"}</td>{" "}
                  <td>
                    {
                      " OpenAI互換APIを備えたローカルサーバーとして、IDEやコーディングエージェントから直接呼び出せる "
                    }
                  </td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"実用性の目安"}</td>{" "}
                  <td>{"クラウドモデルとの性能差が大きく、限定的な用途向け"}</td>{" "}
                  <td>
                    {
                      " 8B〜35B前後のオープンウェイトモデルでも、一般的な開発マシンで実用的な速度と品質を達成 "
                    }
                  </td>{" "}
                </tr>{" "}
                <tr>
                  {" "}
                  <td>{"主な用途"}</td> <td>{"オフライン時の代替手段"}</td>{" "}
                  <td>
                    {
                      " 機密コードの解析、コスト削減、レイテンシ削減、プライバシー保護が必要な場面での積極的な選択肢 "
                    }
                  </td>{" "}
                </tr>{" "}
              </tbody>{" "}
            </table>{" "}
          </div>{" "}
          <div
            className={[styles.callout, styles.update].join(" ")}
            data-testid="callout"
            data-variant={UPDATE_VARIANT}
          >
            {" "}
            <i className="ti ti-trending-up"></i>{" "}
            <div className={styles.calloutBody}>
              {" "}
              <span className={styles.calloutTitle} data-testid="callout-label">
                {"2026年アップデート"}
              </span>{" "}
              <p>
                {
                  " ローカルLLMは、単なる「オフライン時の代替」から一歩進み、機密性の高いコードや社内データを外部に送りたくない場合の第一選択肢としても定着しています"
                }
                <sup>
                  <a href="#ref19" className={styles.cite}>
                    {"19"}
                  </a>
                </sup>
                {
                  "。Ollamaは主要なAIコーディングエージェントのAPI形式（Anthropic形式・OpenAI形式）を模倣できるため、既存のツールの向き先をローカルサーバーに変更するだけで、同じワークフローのままローカルモデルへ切り替えられる点が実務上便利です。 "
                }
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="step10">
          {" "}
          <div className={styles.stepBadge} data-testid="step-tag">
            {"2026 UPDATE"}
          </div>{" "}
          <h2 className={styles.hTitle} id="step10-heading">
            {" "}
            <i className="ti ti-trending-up"></i>
            {"Step10 2026年の最新動向を押さえる（書籍刊行後のアップデート） "}
          </h2>{" "}
          <p>
            {
              " 書籍が扱う9章はいずれも今なお通用する骨太な内容ですが、2024年8月の刊行から2年以上が経過し、AI活用の「作法」そのものが進化しています。国際的に著名な開発者たちの発言を手がかりに、押さえておきたいポイントを整理します。 "
            }
          </p>{" "}
          <h3 id="step10-sub-21">
            {" "}
            <i className="ti ti-arrows-shuffle"></i>
            {"(1) 「vibe coding」から「エージェント型プログラミング」へ "}
          </h3>{" "}
          <p>
            {" 2025年2月、著名なAI研究者Andrej Karpathy"}
            <sup>
              <a href="#ref8" className={styles.cite}>
                {"8"}
              </a>
            </sup>
            {
              "（元Tesla AI部門責任者、OpenAI共同創業者の一人）が「vibe coding（バイブコーディング）」という言葉をSNSに投稿し、一気に広まりました。これは、コードの中身をほとんど確認せず、AIの提案を次々に受け入れながら「とにかく動くものを作る」スタイルを指します。 "
            }
          </p>{" "}
          <p>
            {" しかし2026年に入り、Karpathy自身"}
            <sup>
              <a href="#ref9" className={styles.cite}>
                {"9"}
              </a>
            </sup>
            {
              "も「LLMがより賢くなったことで、プロフェッショナルの現場ではより多くの監督・精査を伴う“エージェントによるプログラミング”がデフォルトのワークフローになりつつある」と述べています。Martin Fowler"
            }
            <sup>
              <a href="#ref10" className={styles.cite}>
                {"10"}
              </a>
            </sup>
            {
              "も同様に、コードを一切見ない「vibe coding」と、人間が詳細にレビューしながらAIエージェントを指揮する「agentic programming（エージェント型プログラミング）」を明確に区別すべきだと提唱しています。 "
            }
          </p>{" "}
          <div className={styles.diagramWrap}>
            {" "}
            <div className={styles.diagramCaption}>
              {"図9｜vibe codingからagentic programmingへ"}
            </div>{" "}
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                id="dg-vibe"
                chart={DIAGRAM_8}
                theme="base"
                flowchartHtmlLabels={false}
                themeVariables={THEME_VARIABLES}
              />
            </div>{" "}
          </div>{" "}
          <p>
            {
              " 本書が一貫して説く「AIをジュニア開発者として扱い、必ずレビューする」という姿勢は、まさにこの「エージェント型プログラミング」の考え方そのものであり、2026年時点でも古びていません。 "
            }
          </p>{" "}
          <h3 id="step10-sub-22">
            <i className="ti ti-gauge"></i>
            {"(2) AIコーディングの生産性と信頼のギャップ"}
          </h3>{" "}
          <p>
            {" Stack Overflowの2025年開発者調査"}
            <sup>
              <a href="#ref14" className={styles.cite}>
                {"14"}
              </a>
            </sup>
            {
              "によると、AIツールを「利用している、または利用予定」と回答した割合は84%まで拡大した一方、出力を信頼すると答えた開発者は29%にとどまりました。ソフトウェアエンジニアリングブログの著者Josh Collinsworth"
            }
            <sup>
              <a href="#ref21" className={styles.cite}>
                {"21"}
              </a>
            </sup>
            {
              "も、LLMの支援効果は「定型的な作業」や「専門外の領域」にとって特に大きく、その範囲を外れるほど効果が薄れるという傾向を指摘しています。 "
            }
          </p>{" "}
          <p>
            {" 一方でAnthropic社内での利用実態調査（Martin Fowlerが紹介"}
            <sup>
              <a href="#ref11" className={styles.cite}>
                {"11"}
              </a>
            </sup>
            {
              "）では、開発者の59%が業務の一部にAIを利用し、平均で約50%の生産性向上が見られ、特に「パワーユーザー」と呼ばれる層（全体の14%）ではさらに大きな効果が得られているとされています。効果の大きさは「どう使うか」次第であり、書籍第2章のプロンプトエンジニアリングや、第6章のテスト駆動の考え方が、この効果差を左右する実務スキルといえます。 "
            }
          </p>{" "}
          <h3 id="step10-sub-23">
            <i className="ti ti-repeat"></i>
            {"(3) テスト駆動開発（TDD）とAIエージェントの相性"}
          </h3>{" "}
          <p>
            {" Extreme Programming（XP）とTDDの提唱者として知られるKent Beck"}
            <sup>
              <a href="#ref13" className={styles.cite}>
                {"13"}
              </a>
            </sup>
            {
              "は、2025〜2026年にかけて積極的にAIコーディングエージェントを実務で使い込み、その知見を発信しています。要点は次の通りです。 "
            }
          </p>{" "}
          <ul>
            {" "}
            <li>
              {
                " AIエージェントは「テストを通すこと」自体を目的化しやすく、実装のバグ修正よりもテストの書き換え・削除を選んでしまうことがある "
              }
            </li>{" "}
            <li>
              {
                " それでもTDD自体は、非決定的なAIエージェントと組む上で「精神安定剤」のような役割を果たす、有効な規律であるとBeckは位置づけている "
              }
            </li>{" "}
            <li>
              {
                " 期待する挙動を先にテストとして固定しておくことで、AIの実装が正しいかどうかを人間が判断しやすくなる "
              }
            </li>{" "}
          </ul>{" "}
          <h3 id="step10-sub-24">
            <i className="ti ti-shield-check"></i>
            {"(4) AI活用を前提にしたセキュリティの標準化"}
          </h3>{" "}
          <p>
            {" OWASPは「LLMアプリケーションのためのTop 10」を継続的に更新しており、2026年版"}
            <sup>
              <a href="#ref17" className={styles.cite}>
                {"17"}
              </a>
            </sup>
            {
              "ではAIエージェントが自律的に「行動する」ことを前提に、権限を超えたツール呼び出しが「LLM03:2026 Excessive Agency」として上位リスクに位置づけられています（ツールの誤用に特化した観点は別ガイドのOWASP Top 10 for Agentic Applications"
            }
            <sup>
              <a href="#ref22" className={styles.cite}>
                {"22"}
              </a>
            </sup>
            {
              "のASI02が扱います）。書籍第8章の脅威モデリングの考え方に、こうした「AIを組み込んだシステムそのものを守る」という新しい観点を重ねて学ぶことが、2026年の開発者には求められています。 "
            }
          </p>{" "}
          <h3 id="step10-sub-25">
            <i className="ti ti-device-laptop"></i>
            {"(5) ローカルLLMの実用化"}
          </h3>{" "}
          <p>
            {" 書籍第9章で紹介されているLlama 2やGPT4Allは、2026年時点ではOllama"}
            <sup>
              <a href="#ref19" className={styles.cite}>
                {"19"}
              </a>
            </sup>
            {"やLM Studio"}
            <sup>
              <a href="#ref20" className={styles.cite}>
                {"20"}
              </a>
            </sup>
            {
              "といったツールを通じて、より手軽かつ実用的に使えるようになっています。特にコーディング用途に最適化されたオープンウェイトモデルが充実し、通常の開発マシンでも十分な速度と品質でローカル実行できる場面が広がっています。 "
            }
          </p>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="glossary">
          {" "}
          <h2 className={styles.hTitle} id="glossary-heading">
            <i className="ti ti-book-2"></i>
            {"用語集"}
          </h2>{" "}
          <dl className={styles.glossary}>
            {" "}
            <dt>{"LLM（大規模言語モデル）"}</dt>{" "}
            <dd>{"大量のテキストデータで学習され、自然言語やコードを理解・生成できるAIモデル"}</dd>{" "}
            <dt>{"プロンプトエンジニアリング"}</dt>{" "}
            <dd>{"LLMから望む出力を引き出すために、指示文（プロンプト）を工夫する技術"}</dd>{" "}
            <dt>{"ハルシネーション"}</dt>{" "}
            <dd>{"LLMが事実に基づかない、もっともらしい誤った情報を生成する現象"}</dd>{" "}
            <dt>{"ヘキサゴナルアーキテクチャ"}</dt>{" "}
            <dd>
              {
                " ドメインロジックを中心に置き、外部システムとのやり取りをポート＆アダプターで抽象化する設計手法 "
              }
            </dd>{" "}
            <dt>{"IaC（Infrastructure as Code）"}</dt>{" "}
            <dd>{"インフラ構成をコードとして記述・管理する手法（例：Terraform）"}</dd>{" "}
            <dt>{"CI/CD"}</dt> <dd>{"継続的インテグレーション／継続的デリバリーの略"}</dd>{" "}
            <dt>{"脅威モデリング"}</dt>{" "}
            <dd>{"システムに対する潜在的な脅威を体系的に洗い出し、対策を検討するプロセス"}</dd>{" "}
            <dt>{"vibe coding（バイブコーディング）"}</dt>{" "}
            <dd>
              {"コードの中身をほとんど確認せず、AIの提案を次々受け入れながら開発するスタイル"}
            </dd>{" "}
            <dt>{"agentic programming（エージェント型プログラミング）"}</dt>{" "}
            <dd>{"人間がAIエージェントの出力を精査・監督しながら開発を進めるスタイル"}</dd>{" "}
            <dt>{"ローカルLLM"}</dt>{" "}
            <dd>
              {
                " クラウドではなく、自分のPCやサーバー上で動かすLLM（例：Ollama、LM Studio経由のモデル） "
              }
            </dd>{" "}
            <dt>{"OWASP LLM Top 10"}</dt>{" "}
            <dd>
              {"LLMアプリケーション特有のセキュリティリスクを整理した、業界標準的なガイドライン"}
            </dd>{" "}
          </dl>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="checklist">
          {" "}
          <h2 className={styles.hTitle} id="checklist-heading">
            <i className="ti ti-checklist"></i>
            {"学習チェックリスト"}
          </h2>{" "}
          <div className={styles.checklistCounter}>
            {" "}
            <i className="ti ti-flag"></i>
            <span id="checklistCounterText">{"0 / 10 完了"}</span>{" "}
          </div>{" "}
          <ul className={styles.checklist} id="checklistItems">
            {" "}
            <li>
              {" "}
              <input type="checkbox" id="c1" />
              <label htmlFor="c1">
                {"LLMが得意な場面・苦手な場面を自分の言葉で説明できる"}
              </label>{" "}
            </li>{" "}
            <li>
              {" "}
              <input type="checkbox" id="c2" />
              <label htmlFor="c2">
                {
                  "Persona・Audience Persona・Refinementなど、基本的なプロンプトパターンを実際に試した"
                }
              </label>{" "}
            </li>{" "}
            <li>
              {" "}
              <input type="checkbox" id="c3" />
              <label htmlFor="c3">
                {"ChatGPTと対話しながら、簡単なシステムの設計案をMermaid図として書き出せる"}
              </label>{" "}
            </li>{" "}
            <li>
              {" "}
              <input type="checkbox" id="c4" />
              <label htmlFor="c4">
                {"ヘキサゴナルアーキテクチャの「ポート」と「アダプター」の役割を説明できる"}
              </label>{" "}
            </li>{" "}
            <li>
              {" "}
              <input type="checkbox" id="c5" />
              <label htmlFor="c5">
                {
                  "AIに単体テストを生成させ、その内容が意図した仕様を検証しているか自分でレビューできる"
                }
              </label>{" "}
            </li>{" "}
            <li>
              {" "}
              <input type="checkbox" id="c6" />
              <label htmlFor="c6">
                {"AIの支援を受けてDockerfileやTerraformコードを書き、内容を自分でレビューできる"}
              </label>{" "}
            </li>{" "}
            <li>
              {" "}
              <input type="checkbox" id="c7" />
              <label htmlFor="c7">
                {"LLMを使った脅威モデリングの基本的な流れを説明できる"}
              </label>{" "}
            </li>{" "}
            <li>
              {" "}
              <input type="checkbox" id="c8" />
              <label htmlFor="c8">{"ローカルLLM（Ollamaなど）を1つ実際に動かしてみた"}</label>{" "}
            </li>{" "}
            <li>
              {" "}
              <input type="checkbox" id="c9" />
              <label htmlFor="c9">
                {"「vibe coding」と「agentic programming」の違いを説明できる"}
              </label>{" "}
            </li>{" "}
            <li>
              {" "}
              <input type="checkbox" id="c10" />
              <label htmlFor="c10">
                {
                  "自分のチームやプロジェクトにおいて、AIの出力を人間がレビューする体制ができているか点検した"
                }
              </label>{" "}
            </li>{" "}
          </ul>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="summary">
          {" "}
          <h2 className={styles.hTitle} id="summary-heading">
            <i className="ti ti-flag"></i>
            {"まとめ"}
          </h2>{" "}
          <p>
            {
              " 『AI-Powered Developer』は、設計・実装・データ管理・テスト・インフラ・セキュリティ・オフライン活用という開発ライフサイクル全体を、ひとつのITAMアプリケーションを通しでAI支援を受けながら構築する、実践重視の構成になっています。書籍刊行から2年以上が経過した2026年においても、「AIを優秀だが未熟なジュニア開発者として扱い、人間が設計判断とレビューの責任を持つ」という基本姿勢は色褪せていません。 "
            }
          </p>{" "}
          <div className={styles.summaryBox}>
            {" "}
            <p style={{ margin: "0 0 0.6rem" }}>
              <strong>{"一方で進化しているポイント"}</strong>
            </p>{" "}
            <span className={styles.tag}>{"CodeWhisperer→Amazon Q Developer"}</span>{" "}
            <span className={styles.tag}>{"Copilotエージェントモード"}</span>{" "}
            <span className={styles.tag}>{"vibe coding→agentic programming"}</span>{" "}
            <span className={styles.tag}>{"AIコード生成物への信頼を巡る議論"}</span>{" "}
            <span className={styles.tag}>{"LLM特有のセキュリティリスク（OWASP LLM Top 10）"}</span>{" "}
            <span className={styles.tag}>{"Ollama / LM Studioの実用化"}</span>{" "}
          </div>{" "}
          <p style={{ marginTop: "1.2rem" }}>
            {
              " 書籍で体系立った基礎を学びつつ、本ガイドのStep10で紹介したような最新動向を随時アップデートしていくことが、2026年の開発者には求められています。 "
            }
          </p>{" "}
        </section>{" "}
        <section className={[styles.section, styles.prose].join(" ")} id="references">
          {" "}
          <h2 className={styles.hTitle} id="references-heading">
            <i className="ti ti-link"></i>
            {"参考文献・出典"}
          </h2>{" "}
          <div className={styles.refGroupTitle}>
            <i className="ti ti-book"></i>
            {"書籍・公式情報"}
          </div>{" "}
          <div className={styles.refCard} id="ref1">
            {" "}
            <div className={styles.refNum}>{"1"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {" AI-Powered Developer（書籍公式ページ、Manning Publications） "}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://www.manning.com/books/ai-powered-developer"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://www.manning.com/books/ai-powered-developer"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref2">
            {" "}
            <div className={styles.refNum}>{"2"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {"AI-Powered Developer liveBook（章立て・目次）"}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://livebook.manning.com/book/ai-powered-developer"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://livebook.manning.com/book/ai-powered-developer"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref3">
            {" "}
            <div className={styles.refNum}>{"3"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {
                  " AI-Powered Developer ソースコードリポジトリ（GitHub、Manning公式ページからのリンク先） "
                }
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://github.com/nathanbcrocker/ai_assisted_dev_public"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://github.com/nathanbcrocker/ai_assisted_dev_public"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refGroupTitle}>
            {" "}
            <i className="ti ti-users"></i>
            {"国際的に著名な開発者の発言・記事 "}
          </div>{" "}
          <div className={styles.refCard} id="ref4">
            {" "}
            <div className={styles.refNum}>{"4"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {
                  " Simon Willison（Django共同開発者／Datasette開発者）「Prompt engineering」タグ記事一覧 "
                }
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://simonwillison.net/tags/prompt-engineering/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://simonwillison.net/tags/prompt-engineering/"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref5">
            {" "}
            <div className={styles.refNum}>{"5"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {"Simon Willison「Agentic Engineering Patterns」"}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://simonw.substack.com/p/agentic-engineering-patterns"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://simonw.substack.com/p/agentic-engineering-patterns"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref6">
            {" "}
            <div className={styles.refNum}>{"6"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {
                  " Simon Willison インタビュー「The AI Coding Paradigm Shift」（Heavybit, High Leverageポッドキャスト） "
                }
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://www.heavybit.com/library/podcasts/high-leverage/ep-9-the-ai-coding-paradigm-shift-with-simon-willison"
                target="_blank"
                rel="noopener noreferrer"
              >
                {
                  "https://www.heavybit.com/library/podcasts/high-leverage/ep-9-the-ai-coding-paradigm-shift-with-simon-willison"
                }
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref7">
            {" "}
            <div className={styles.refNum}>{"7"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {
                  " Addy Osmani（元Google Chromeエンジニアリングリード）「My LLM coding workflow going into 2026」 "
                }
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://addyosmani.com/blog/ai-coding-workflow/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://addyosmani.com/blog/ai-coding-workflow/"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref8">
            {" "}
            <div className={styles.refNum}>{"8"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {" Andrej Karpathy（元Tesla AI部門責任者）「vibe coding」提唱ポスト "}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://x.com/karpathy/status/1886192184808149383"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://x.com/karpathy/status/1886192184808149383"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref9">
            {" "}
            <div className={styles.refNum}>{"9"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {" Andrej Karpathyのフォローアップ発言に関する解説記事（The New Stack） "}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://thenewstack.io/vibe-coding-is-passe/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://thenewstack.io/vibe-coding-is-passe/"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref10">
            {" "}
            <div className={styles.refNum}>{"10"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {" Martin Fowler（Thoughtworksチーフサイエンティスト）「Agentic Programming」 "}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://martinfowler.com/bliki/AgenticProgramming.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://martinfowler.com/bliki/AgenticProgramming.html"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref11">
            {" "}
            <div className={styles.refNum}>{"11"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {" Martin Fowler「Fragments: January 8」（Anthropic社内利用調査の紹介） "}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://martinfowler.com/fragments/2026-01-08.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://martinfowler.com/fragments/2026-01-08.html"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref12">
            {" "}
            <div className={styles.refNum}>{"12"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {" Martin Fowler インタビュー（The Pragmatic Engineer, Gergely Orosz） "}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://newsletter.pragmaticengineer.com/p/martin-fowler"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://newsletter.pragmaticengineer.com/p/martin-fowler"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref13">
            {" "}
            <div className={styles.refNum}>{"13"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {
                  " Kent Beck（Extreme Programming／TDD提唱者）インタビュー「TDD, AI agents and coding with Kent Beck」（The Pragmatic Engineer） "
                }
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refGroupTitle}>
            <i className="ti ti-chart-bar"></i>
            {"統計・業界標準"}
          </div>{" "}
          <div className={styles.refCard} id="ref14">
            {" "}
            <div className={styles.refNum}>{"14"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {"Stack Overflow 2025 Developer Survey ― AIセクション"}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://survey.stackoverflow.co/2025/ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://survey.stackoverflow.co/2025/ai"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref15">
            {" "}
            <div className={styles.refNum}>{"15"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {
                  " Stack Overflow公式プレスリリース「2025 Developer Survey Reveals Trust in AI at an All Time Low」 "
                }
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {
                  "https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/"
                }
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref16">
            {" "}
            <div className={styles.refNum}>{"16"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {" Stack Overflow Blog「Closing the AI trust gap for developers」 "}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref17">
            {" "}
            <div className={styles.refNum}>{"17"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {" OWASP Top 10 for LLM Applications 2026（OWASP GenAI Security Project公式） "}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref18">
            {" "}
            <div className={styles.refNum}>{"18"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {
                  " AWS公式ドキュメント「Amazon Q Developer rename - Summary of changes」（CodeWhisperer→Q Developer統合の一次情報） "
                }
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/service-rename.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/service-rename.html"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refGroupTitle}>
            {" "}
            <i className="ti ti-device-laptop"></i>
            {"ローカルLLMツール（2026年時点） "}
          </div>{" "}
          <div className={styles.refCard} id="ref19">
            {" "}
            <div className={styles.refNum}>{"19"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {
                  " 「Ollama: How to Run Any Open-Source LLM Locally with Your Existing Tools」（Better Stack） "
                }
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://betterstack.com/community/guides/ai/ollama-local-llm/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://betterstack.com/community/guides/ai/ollama-local-llm/"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref20">
            {" "}
            <div className={styles.refNum}>{"20"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {" 「Top 5 Local LLM Tools and Models in 2026」（Pinggy Blog） "}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://pinggy.io/blog/top_5_local_llm_tools_and_models/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://pinggy.io/blog/top_5_local_llm_tools_and_models/"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref21">
            {" "}
            <div className={styles.refNum}>{"21"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {"Josh Collinsworth「LLMs and performative productivity」"}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://joshcollinsworth.com/blog/productivity"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://joshcollinsworth.com/blog/productivity"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.refCard} id="ref22">
            {" "}
            <div className={styles.refNum}>{"22"}</div>{" "}
            <div className={styles.refBody}>
              {" "}
              <div className={styles.refTitle}>
                {" OWASP Top 10 for Agentic Applications 2026（OWASP GenAI Security Project公式） "}
              </div>{" "}
              <a
                className={styles.refUrl}
                href="https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/"}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <p style={{ marginTop: "1.8rem", color: "var(--ink-soft)", fontSize: "1rem" }}>
            {
              " 本ガイドは2026年9月17日時点の公開情報をもとに作成しています。AI関連ツールの名称・機能は変化が速いため、実際に導入する際は各公式ドキュメントで最新情報をご確認ください。 "
            }
          </p>{" "}
        </section>{" "}
      </div>
    </div>
  );
}
