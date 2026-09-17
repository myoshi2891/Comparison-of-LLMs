import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Generative AI for Software Development ― 初学者のためのステップバイステップガイド",
  description:
    "O'Reilly刊『Generative AI for Software Development』の構成をベースに、コード生成、UI/UX、コードレビュー、テスト、ドキュメント、チャットボット、実装成功事例、ワークフロー実践、リスクガバナンスまでを網羅した初学者のためのステップバイステップ解説ガイド。",
};

/** 原本 mermaid.initialize themeVariables と完全一致（ライトテーマ） */
const BOOK_THEME_VARS = {
  fontFamily: "'Noto Sans JP', sans-serif",
  fontSize: "16px",
  primaryColor: "#f2ecdd",
  primaryTextColor: "#2a2620",
  primaryBorderColor: "#413d8f",
  lineColor: "#8a8470",
  secondaryColor: "#e4ddc9",
  tertiaryColor: "#faf7ef",
} as const;

const DIAGRAM_MMD_0 = `flowchart LR
    A["要件定義"] --> B["設計・UIプロトタイプ"]
    B --> C["コード生成"]
    C --> D["コードレビュー"]
    D --> E["テスト・QA"]
    E --> F["ドキュメント作成"]
    F --> G["デプロイ・運用監視"]
    G -.->|"フィードバック"| A
    class A hub
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#413d8f,stroke-width:1px;`;

const DIAGRAM_MMD_1 = `flowchart TD
    Q["タスクの性質は"] --> S["単発の質問・スニペット生成"]
    Q --> M["複数ファイルにまたがる機能追加"]
    Q --> L["長時間の自律的な作業 リファクタ・移行等"]
    S --> S1["チャット型ツールで十分 ChatGPT・Gemini"]
    M --> M1["IDE統合エージェント Cursor・Copilot Agent mode等"]
    L --> L1["長時間実行エージェント Claude Code・Cloud Agents等"]
    class Q hub
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#413d8f,stroke-width:1px;`;

const DIAGRAM_MMD_2 = `flowchart TD
    A["開発者がPRを作成"] --> B["AIレビューボットが自動解析"]
    B --> C{"重大な問題を検出?"}
    C -->|"はい"| D["インラインコメントで指摘・修正案を提示"]
    C -->|"いいえ"| E["要約コメントを投稿"]
    D --> F["人間のレビュアーが最終確認"]
    E --> F
    F --> G["マージ"]
    class G done
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;`;

const DIAGRAM_MMD_3 = `flowchart TD
    T["テストピラミッド"] --> Un["多数 単体テスト"]
    Un --> I["中間 統合テスト"]
    I --> U["少数 E2E・UIテスト"]
    AI1["AIコーディングエージェントが単体テストを自動生成"] -.-> Un
    AI2["セルフヒーリング機能がロケーター変更を自動修正"] -.-> I
    AI3["自律エージェントがE2Eシナリオを実行・検証"] -.-> U
    class T hub
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#413d8f,stroke-width:1px;`;

const DIAGRAM_MMD_4 = `flowchart LR
    U["ユーザーの入力"] --> C["従来型チャットボット"]
    U --> Agt["AIエージェント"]
    C --> C1["あらかじめ定義された応答を返す"]
    Agt --> A1["外部ツール・APIを呼び出す"]
    A1 --> A2["結果を確認し次の行動を判断"]
    A2 --> A3["必要なら再度ツールを呼び出す ループ"]
    A3 --> A4["最終的な回答・行動を返す"]
    class Agt hub
    class A4 done
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#413d8f,stroke-width:1px;
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;`;

const DIAGRAM_MMD_5 = `flowchart TD
    P["タスクを具体的に定義する"] --> A["AIエージェントに実行を委任"]
    A --> V["結果を検証する テスト実行・差分レビュー"]
    V --> D{"期待通りか?"}
    D -->|"はい"| M["人間が最終承認しマージ"]
    D -->|"いいえ"| R["フィードバックを与えて再試行、または人間が引き取る"]
    R --> A
    class M done
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;`;

const DIAGRAM_MMD_6 = `flowchart TD
    A["機密性の高い社内データへのアクセス"] --> X["致死の三要素が揃う"]
    B["信頼できない外部コンテンツの読み込み"] --> X
    C["外部との通信能力"] --> X
    X --> R["悪意ある指示の注入による情報漏洩リスク"]
    R --> M1["対策 権限を必要最小限に絞る"]
    R --> M2["対策 重要な操作の前に人間の承認を挟む"]
    R --> M3["対策 三要素のうち少なくとも1つを切り離す設計にする"]
    class X hub
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#413d8f,stroke-width:1px;`;

export default function Page() {
  return (
    <div className={styles.layout} data-testid="layout-root">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Noto+Serif+JP:wght@600;700&display=swap"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.46.0/dist/tabler-icons.min.css"
        integrity="sha384-ND+q1IVc0KDElX60dZaqKc7Xl9cdxd2PpU2JfVUHcurCkFVtVLFdt9vJfxtHSL3p"
        crossOrigin="anonymous"
      />
      <TocObserver />

      <div className={styles.mobileBar}>
        <a className={styles.brand} href="#top">
          {" "}
          <i className="ti ti-rocket"></i>GenAI for Software Dev
        </a>
        <button id="menuToggle" type="button" aria-label="メニューを開く">
          <i className="ti ti-menu-2"></i>メニュー
        </button>
      </div>

      <div className={styles.scrim} id="scrim"></div>

      <nav className={styles.sidebar} id="sidebar" data-testid="sidebar-nav">
        <a className={styles.brand} href="#top">
          {" "}
          <i className="ti ti-rocket"></i>GenAI for Software Dev
        </a>
        <div className={styles.brandSub}>初学者向けステップバイステップガイド</div>

        <div className={styles.navGroupLabel}>イントロダクション</div>
        <a className={styles.navA} href="#book-info" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-book-2"></i>この本について
        </a>

        <div className={styles.navGroupLabel}>書籍の8章を解説</div>
        <a className={styles.navA} href="#step0" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-telescope"></i>Step 0. なぜ今このテーマなのか
        </a>
        <a className={styles.navA} href="#step1" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-code"></i>Step 1. コード生成とオートコンプリート
        </a>
        <a className={styles.navA} href="#step2" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-palette"></i>Step 2. UI/UXデザインとフロントエンド
        </a>
        <a className={styles.navA} href="#step3" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-bug-off"></i>Step 3. バグ検出とコードレビュー
        </a>
        <a className={styles.navA} href="#step4" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-test-pipe"></i>Step 4. 自動テストと品質保証
        </a>
        <a className={styles.navA} href="#step5" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-chart-line"></i>Step 5. 予測分析と性能最適化
        </a>
        <a className={styles.navA} href="#step6" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-notebook"></i>Step 6. ドキュメント作成
        </a>
        <a className={styles.navA} href="#step7" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-message-chatbot"></i>Step 7. チャットボット
        </a>
        <a className={styles.navA} href="#step8" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-trophy"></i>Step 8. 実装成功事例
        </a>

        <div className={styles.navGroupLabel}>実践・応用編</div>
        <a className={styles.navA} href="#step9" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-route"></i>Step 9. 開発ワークフロー実践編
        </a>
        <a className={styles.navA} href="#step10" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-shield-lock"></i>Step 10. リスクとガバナンス
        </a>
        <a className={styles.navA} href="#step11" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-scale"></i>Step 11. ツール評価フレームワーク
        </a>
        <a className={styles.navA} href="#step12" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-compass"></i>Step 12. 未来の展望
        </a>

        <div className={styles.navGroupLabel}>付録</div>
        <a className={styles.navA} href="#glossary" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-brain"></i>用語集
        </a>
        <a className={styles.navA} href="#checklist" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-checklist"></i>学習チェックリスト
        </a>
        <a className={styles.navA} href="#references" data-nav="" data-testid="sidebar-nav-link">
          {" "}
          <i className="ti ti-link"></i>参考文献・出典URL
        </a>
      </nav>

      <main className={styles.main} id="top">
        <header className={styles.hero}>
          <div className={styles.freshnessBar} lang="ja" data-testid="page-freshness">
            <span className={styles.freshnessItem}>
              最終確認{" "}
              <time className={styles.freshnessValue} dateTime="2026-09-17">
                2026-09-17
              </time>
            </span>
            <span className={styles.freshnessSep} aria-hidden="true">
              /
            </span>
            <span className={styles.freshnessItem}>
              公開{" "}
              <time className={styles.freshnessValue} dateTime="2026-09-17">
                2026-09-17
              </time>
            </span>
          </div>
          <div className={styles.heroKicker}>
            {" "}
            <i className="ti ti-sparkles"></i>初学者向け解説ガイド
          </div>
          <h1 className={styles.heroTitle}>
            Generative AI for Software Development ― 初学者のためのステップバイステップガイド
          </h1>
          <p className={styles.heroLead}>
            O'Reilly刊『Generative AI for Software Development: Tools, Workflows, and Practical
            Applications』の構成をベースに、2026年9月14日時点の最新動向を加えて再構成した学習用資料です。コード生成からUI/UXデザイン、コードレビュー、テスト、ドキュメント、チャットボット、実装成功事例まで、書籍全体をステップバイステップで解説します。
          </p>
          <p className={styles.heroNote}>
            <i className="ti ti-alert-triangle"></i>
            ツール名・価格・機能は執筆時点(2026年9月14日)のものです。AIツール業界は変化が非常に速いため、実際に使う際は必ず公式サイトで最新情報をご確認ください。
          </p>
        </header>

        <section className={styles.section} id="book-info">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-book-2"></i>
            </div>
            <h2>この本について</h2>
          </div>
          <div className={styles.bookCard}>
            <div className={styles.bookCover}>
              <div className={styles.bookCoverTitle}>Generative AI for Software Development</div>
              <div className={styles.bookCoverAuthor}>Sergio Pereira 著 / O'Reilly Media</div>
            </div>
            <div className={styles.bookCardBody}>
              <div className={styles.tableWrap}>
                <table className={styles.kvTable}>
                  <tbody>
                    <tr>
                      <th>タイトル</th>
                      <td>Generative AI for Software Development</td>
                    </tr>
                    <tr>
                      <th>著者</th>
                      <td>Sergio Pereira</td>
                    </tr>
                    <tr>
                      <th>出版社</th>
                      <td>O'Reilly Media</td>
                    </tr>
                    <tr>
                      <th>出版時期</th>
                      <td>2025年7月</td>
                    </tr>
                    <tr>
                      <th>ページ数</th>
                      <td>170ページ</td>
                    </tr>
                    <tr>
                      <th>レベル</th>
                      <td>中級〜上級(本ガイドは初学者向けに噛み砕いて解説)</td>
                    </tr>
                    <tr>
                      <th>原書URL</th>
                      <td>
                        <a
                          className={styles.refUrl}
                          href="https://www.oreilly.com/library/view/generative-ai-for/9781098162269/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          oreilly.com/library/view/generative-ai-for/9781098162269
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <p style={{ marginTop: "1.3rem" }}>
            著者のSergio
            Pereiraは、市場に出回るAI開発ツールを片っ端から試し、実務者が氾濫する選択肢の中で迷わないための「評価の型」を提供することを目的にこの本を書きました。各章は「ツールの種類」「ユースケース」「評価プロセス」「個別ツールの比較」という共通の型で構成されており、単なる製品レビューではなく、今後も変化し続けるツールと向き合うための思考の枠組みを提供しています。
          </p>
          <p>
            本ガイドではこの構成を踏襲しつつ、AIツールの進化スピードが非常に速い分野であることを踏まえ、各章に{" "}
            <strong>2026年9月時点の最新状況</strong>を補足しています。
          </p>
        </section>

        <section className={styles.section} id="step0">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-telescope"></i>
            </div>
            <h2>Step 0. なぜ今このテーマなのか</h2>
          </div>

          <h3>0-1. 数字で見る「AIが当たり前になった」開発現場</h3>
          <p>
            生成AIはこの数年でソフトウェア開発の「特別な機能」から「標準装備」へと変わりました。GitHubが2025年10月に発表したOctoverse
            2025レポートでは、2024年9月〜2025年8月の1年間でGitHub上の開発者数が1億8000万人を突破し、新規開発者の約8割が登録から1週間以内にGitHub
            Copilotを使い始めていることが報告されています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref1">
                1
              </a>
              ,
              <a className={styles.citeLink} href="#ref2">
                2
              </a>
              ]
            </sup>
            。同レポートは、AIが「使いやすい技術に開発者が集まり、その技術がさらにAIに最適化される」という好循環(convenience
            loop)を生み出しており、その象徴としてTypeScriptが2025年8月に月間コントリビューター数で初めてPythonとJavaScriptを抜き、GitHub上で最も使われる言語になったと分析しています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref3">
                3
              </a>
              ,
              <a className={styles.citeLink} href="#ref4">
                4
              </a>
              ]
            </sup>
            。型のある言語はAIが生成したコードのミスをコンパイル時に検出しやすいためだと考えられています。
          </p>
          <p>
            Google CloudのDORA(DevOps Research and Assessment)チームが2025年9月に公開した「State of
            AI-assisted Software
            Development」レポートでは、調査対象の技術者の約9割が業務でAIツールを日常的に使用していると回答しました{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref5">
                5
              </a>
              ,{" "}
              <a className={styles.citeLink} href="#ref6">
                6
              </a>
              ]
            </sup>
            。ただしこのレポートが強調しているのは「AIはチームの実力を増幅する」という点です。もともと開発プロセスが整っているチームはAIでさらに成果を伸ばす一方、プロセスに課題を抱えるチームはAIによって問題が拡大しやすいことが指摘されています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref6">
                6
              </a>
              ]
            </sup>
            。
          </p>

          <h3>0-2. 「バイブコーディング」という言葉の広がり</h3>
          <p>
            2025年初頭、AI研究者のAndrej Karpathy氏が提唱した「vibe
            coding(バイブコーディング)」という言葉は、自然言語での指示だけでアプリケーションを作り上げる開発スタイルを指す言葉として一気に広まりました。2026年時点では、世界で本番稼働しているコードのうち4割前後がAI支援によって生成されているという業界記事による推計もあり、AIファーストのアプリビルダー市場は前年から大きく成長しています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref7">
                7
              </a>
              ,{" "}
              <a className={styles.citeLink} href="#ref8">
                8
              </a>
              ]
            </sup>
            。
          </p>
          <div className={styles.callout} data-testid="callout" data-variant="gold">
            <div className={styles.calloutIcon}>
              {" "}
              <i className="ti ti-quote"></i>
            </div>
            <div className={styles.calloutBody}>
              <span className={styles.calloutTitle}>
                Simon Willison氏(Djangoフレームワーク共同開発者)の指摘
              </span>
              <p>
                独立系ソフトウェア開発者として知られるSimon
                Willison氏は、AIコーディングエージェントの信頼性が上がるにつれて、経験豊富なエンジニアでさえ「1行ずつのコードレビューを省略してデプロイする」場面が増えていると自身の実践を振り返りながら指摘しています{" "}
                <sup>
                  [{" "}
                  <a className={styles.citeLink} href="#ref9">
                    9
                  </a>
                  ]
                </sup>
                。便利さと引き換えに、どこまでを自動化し、どこから人間が責任を持つのかという線引きが、2026年のソフトウェア開発における最大の論点の一つになっています。
              </p>
            </div>
          </div>

          <h3>0-3. 本ガイドの読み方</h3>
          <p>
            以下のStepは、原書の章構成(第1章〜第8章)に沿って、それぞれ「どんな種類のツールがあるか」「代表的な製品」「2026年時点の最新動向」「実務での使い方のコツ」を解説します。Step
            9以降は原書の内容を踏まえた実践編・応用編として、AIを組み込んだ開発ワークフロー全体像、リスク管理、ツール選定の考え方、そして今後の展望をまとめています。
          </p>

          <div className={styles.diagramWrap} data-testid="mermaid-diagram">
            <div className={styles.diagramCard}>
              <MermaidDiagram chart={DIAGRAM_MMD_0} theme="base" themeVariables={BOOK_THEME_VARS} />
            </div>
            <div className={styles.diagramCaption}>
              図1:
              ソフトウェア開発ライフサイクル(SDLC)の各段階に、今や生成AIが何らかの形で関与している
            </div>
          </div>
        </section>

        <section className={styles.section} id="step1">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-code"></i>
            </div>
            <h2>Step 1. コード生成とオートコンプリート</h2>
          </div>
          <p className={styles.lead}>
            原書第1章のテーマです。コード生成ツールは大きく「ブラウザ(チャット)ベース」と「IDE統合型」の2種類に分けられます。
          </p>

          <h3>1-1. ブラウザベースのツール</h3>
          <p>
            ChatGPTやGoogle
            Geminiのようなチャット型AIは、コードスニペットの生成、アルゴリズムの説明、エラーメッセージの解読など、エディタを離れて「相談する」使い方に向いています。コードベース全体を継続的に把握するわけではないため、独立した小さな問題を解く場面で特に力を発揮します。
          </p>

          <h3>1-2. IDE統合型ツール(2026年の主戦場)</h3>
          <p>
            2023年頃は「次の1行を提案するオートコンプリート」が主流でしたが、2026年時点では「コードベース全体を読み、計画を立て、複数ファイルを編集し、ターミナルコマンドを実行し、自分の出力を検証する」自律型のコーディングエージェントが標準になっています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref10">
                10
              </a>
              ]
            </sup>
            。
          </p>

          <div className={styles.tableWrap}>
            <div className={styles.tableTitle}>主要なIDE統合型コーディングツール(2026年時点)</div>
            <table>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>位置づけ</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>GitHub Copilot</td>
                  <td>VS Code / GitHub純正</td>
                  <td>
                    Copilot Free提供以降に新規登録者が急増。Agent modeでリポジトリ横断の変更にも対応{" "}
                    <sup>
                      [{" "}
                      <a className={styles.citeLink} href="#ref2">
                        2
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Cursor</td>
                  <td>VS Codeフォークのエージェント特化IDE</td>
                  <td>
                    自社モデルComposer、並列エージェント実行、クラウド上で動くBackground/Cloud
                    Agentsを搭載。有料ユーザーは100万人規模、Fortune 500の6割以上が利用と報告{" "}
                    <sup>
                      [{" "}
                      <a className={styles.citeLink} href="#ref11">
                        11
                      </a>
                      ,{" "}
                      <a className={styles.citeLink} href="#ref12">
                        12
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Windsurf(Cognition傘下)</td>
                  <td>VS Codeフォーク、Cascadeエージェント</td>
                  <td>
                    2025年7月にGoogleとOpenAIが争奪戦を演じた末、Cognition(Devin開発元)が買収。自社モデルSWE-1.5と、コード構造を可視化するCodemaps機能が特徴{" "}
                    <sup>
                      [{" "}
                      <a className={styles.citeLink} href="#ref13">
                        13
                      </a>
                      ,{" "}
                      <a className={styles.citeLink} href="#ref14">
                        14
                      </a>
                      ,{" "}
                      <a className={styles.citeLink} href="#ref15">
                        15
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Claude Code</td>
                  <td>Anthropic純正のエージェント型CLI/デスクトップツール</td>
                  <td>
                    ターミナル・デスクトップアプリ・IDE連携から利用可能。長時間の自律実行に強いとの評価{" "}
                    <sup>
                      [{" "}
                      <a className={styles.citeLink} href="#ref16">
                        16
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Windsurf以外の主要プレイヤー</td>
                  <td>Cline、Aider、Devin、Zed等</td>
                  <td>
                    オープンソースのエージェント型拡張や、GPU高速化エディタなど選択肢が多様化{" "}
                    <sup>
                      [{" "}
                      <a className={styles.citeLink} href="#ref11">
                        11
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Cognitionは2025年7月にWindsurfのIP・製品・ブランドを買収すると発表しました。買収時点でWindsurfは年間経常収益(ARR)82百万ドル、エンタープライズ顧客350社以上を抱えていたと公表されています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref14">
                14
              </a>
              ]
            </sup>
            。この買収劇は、GoogleがWindsurfの創業者ら研究チームを24億ドル規模でアクハイア(人材買収)した直後に成立した点でも話題になりました{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref15">
                15
              </a>
              ]
            </sup>
            。
          </p>

          <h3>1-3. 使い分けの考え方</h3>
          <div className={styles.diagramWrap} data-testid="mermaid-diagram">
            <div className={styles.diagramCard}>
              <MermaidDiagram chart={DIAGRAM_MMD_1} theme="base" themeVariables={BOOK_THEME_VARS} />
            </div>
            <div className={styles.diagramCaption}>
              図2: タスクの性質に応じたコード生成ツールの使い分け
            </div>
          </div>

          <p>
            初学者への実践的なアドバイスとしては、まず小さな独立したタスク(関数の実装、テストの追加)でAIの提案を検証する習慣をつけ、慣れてきたら複数ファイルにまたがる変更を任せる、という段階的な移行が推奨されます。原書でも指摘されている通り、ツールごとに得意なコーディング課題の傾向が異なるため、自分のスタック(使用言語・フレームワーク)で実際に試すことが評価の基本です。
          </p>
        </section>

        <section className={styles.section} id="step2">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-palette"></i>
            </div>
            <h2>Step 2. UI/UXデザインとフロントエンド開発</h2>
          </div>
          <p className={styles.lead}>
            原書第2章のテーマです。自然言語の指示だけでUIやフロントエンドアプリケーションを生成するツールは、2025年以降のAI開発ツール市場で最も成長が著しい分野の一つです。
          </p>

          <h3>2-1. 主要な「AIアプリビルダー」</h3>
          <div className={styles.tableWrap}>
            <div className={styles.tableTitle}>主要なAIアプリビルダー</div>
            <table>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>提供元</th>
                  <th>強み</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bolt.new</td>
                  <td>StackBlitz</td>
                  <td>
                    ブラウザ完結のフルIDE。バックエンドはSupabase連携が中心で、直接コード編集も可能{" "}
                    <sup>
                      [{" "}
                      <a className={styles.citeLink} href="#ref17">
                        17
                      </a>
                      ,{" "}
                      <a className={styles.citeLink} href="#ref18">
                        18
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Lovable(旧GPT Engineer)</td>
                  <td>Lovable</td>
                  <td>
                    非エンジニアでも会話形式でフルスタックMVPを構築できる設計。Supabase統合と使いやすさが特徴{" "}
                    <sup>
                      [{" "}
                      <a className={styles.citeLink} href="#ref18">
                        18
                      </a>
                      ,{" "}
                      <a className={styles.citeLink} href="#ref19">
                        19
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>v0</td>
                  <td>Vercel</td>
                  <td>
                    Next.js/Vercelエコシステムに最適化されたReact UIコンポーネント生成に特化{" "}
                    <sup>
                      [{" "}
                      <a className={styles.citeLink} href="#ref17">
                        17
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Uizard / QoQo.ai 等</td>
                  <td>各社</td>
                  <td>
                    ワイヤーフレームからUIモックアップを素早く作る用途、UXリサーチ支援など専門特化型
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            LovableとBolt.newはいずれも異例の速さで成長したことで知られています。複数の業界レポートによれば、Lovableはローンチから数ヶ月でARR(年間経常収益)が数千万〜数億ドル規模に達し、欧州発スタートアップとして最速級の成長曲線を描いたとされ、Bolt.newも数ヶ月でARR数千万ドル規模に到達したと報じられています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref19">
                19
              </a>
              ,{" "}
              <a className={styles.citeLink} href="#ref20">
                20
              </a>
              ]
            </sup>
            。これらの数字はベンダー発表や業界サイトの推計を含むため幅がありますが、「アイデアを言葉にするだけでアプリの骨格ができる」体験が市場に強いインパクトを与えたことは間違いありません。
          </p>

          <h3>2-2. 使う上での注意点(初学者向け)</h3>
          <ul>
            <li>
              <strong>バックエンドの制約を理解する</strong>:
              Bolt.newはSupabase、Lovableも同様にSupabase中心の統合になっているなど、特定のバックエンドサービスに依存する設計のツールが多く、後から別のデータベースに移行する場合は追加の作業が発生します{" "}
              <sup>
                [{" "}
                <a className={styles.citeLink} href="#ref17">
                  17
                </a>
                ]
              </sup>
              。
            </li>
            <li>
              <strong>生成されたコードの所有権</strong>:
              多くのツールはコードのダウンロードやGitHubへのプッシュに対応していますが、ロックインの度合いはツールごとに異なるため、長期運用を前提とする場合は事前に確認しましょう。
            </li>
            <li>
              <strong>デザインとロジックの分業</strong>:
              v0のようにUIコンポーネント生成に特化したツールと、Lovable/Bolt.newのようにフルスタックで動くツールを組み合わせて使うワークフローも一般的になっています。
            </li>
          </ul>
        </section>

        <section className={styles.section} id="step3">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-bug-off"></i>
            </div>
            <h2>Step 3. バグ検出とコードレビュー</h2>
          </div>
          <p className={styles.lead}>
            原書第3章のテーマです。AIがコードを書く量が増えるほど、レビューする量も増えるというのが2026年の大きな課題になっています。
          </p>

          <h3>3-1. なぜAIコードレビューが急速に普及したのか</h3>
          <p>
            DORAの2025年レポートでは、AI活用度が高いチームはマージするプルリクエスト数が従来比で大幅に増加した一方、平均的なPRのサイズも拡大し、レビューにかかる時間も伸びたと報告されています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref21">
                21
              </a>
              ]
            </sup>
            。つまり「AIがコードを書く速度」に「人間がレビューする速度」が追いつかなくなりつつあるということです。この課題に対応する形で、AIによる自動コードレビューツールの利用が急速に広がりました。業界調査では、2026年時点で開発チームの4割超が何らかのAIコードレビューツールを導入しているという報告があります{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref22">
                22
              </a>
              ,{" "}
              <a className={styles.citeLink} href="#ref23">
                23
              </a>
              ]
            </sup>
            。
          </p>

          <h3>3-2. 代表的なツール</h3>
          <div className={styles.tableWrap}>
            <div className={styles.tableTitle}>代表的なAIコードレビューツール</div>
            <table>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Codacy</td>
                  <td>静的解析ベースの継続的なコード品質チェックプラットフォーム</td>
                </tr>
                <tr>
                  <td>Snyk Code(旧DeepCode)</td>
                  <td>セキュリティ脆弱性の検出に強みを持つ</td>
                </tr>
                <tr>
                  <td>CodeRabbit</td>
                  <td>
                    GitHub/GitLab/Bitbucket等に対応するPRレビュー特化型。無料枠でOSSリポジトリをカバーし急速に普及{" "}
                    <sup>
                      [{" "}
                      <a className={styles.citeLink} href="#ref24">
                        24
                      </a>
                      ,{" "}
                      <a className={styles.citeLink} href="#ref25">
                        25
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>GitHub Copilot Code Review</td>
                  <td>
                    Copilot
                    Business/Enterprise等の対応プランに統合。レビュー1回ごとにAIクレジットを消費し、プライベートリポジトリではGitHub
                    Actionsの実行時間も消費するため、契約プランや利用量によっては追加費用が発生し得る
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            CodeRabbitは2026年半ばまでに1300万件以上のプルリクエストをレビューしたと報告されており、GitHub上でのインストール数の多さでも業界レポートの上位に挙げられています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref24">
                24
              </a>
              ,{" "}
              <a className={styles.citeLink} href="#ref25">
                25
              </a>
              ]
            </sup>
            。ただし複数の第三者評価では、AIレビューツールは「SQLインジェクションやnullポインタのような機械的に検出しやすい問題」には強い一方、「ビジネスロジック固有の妥当性(割引計算が正しいかなど)」の判断はまだ苦手とされており、人間のレビューを完全に代替するものではないと繰り返し指摘されています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref26">
                26
              </a>
              ]
            </sup>
            。
          </p>

          <h3>3-3. レビューワークフローの実際</h3>
          <div className={styles.diagramWrap} data-testid="mermaid-diagram">
            <div className={styles.diagramCard}>
              <MermaidDiagram chart={DIAGRAM_MMD_2} theme="base" themeVariables={BOOK_THEME_VARS} />
            </div>
            <div className={styles.diagramCaption}>
              図3: AIレビューボットを組み込んだプルリクエストのレビューフロー
            </div>
          </div>

          <p>
            初学者向けのアドバイスとしては、AIレビューを「厳しい先輩の一次チェック」くらいの位置づけで捉えるのが安全です。静的解析ツール(SonarQube等のルールベース製品)とAIレビューツールを併用し、セキュリティ関連は専用ツールで、ロジックの妥当性は人間で、という役割分担を明確にするのが2026年時点のベストプラクティスとして推奨されています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref23">
                23
              </a>
              ]
            </sup>
            。
          </p>
        </section>

        <section className={styles.section} id="step4">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-test-pipe"></i>
            </div>
            <h2>Step 4. 自動テストと品質保証(QA)</h2>
          </div>
          <p className={styles.lead}>
            原書第4章のテーマです。テストの世界でも「テストケースを人間が全部書く」時代から「AIが自律的にアプリを探索してテストを書く」時代への移行が進んでいます。
          </p>

          <h3>4-1. AIテストツールの3つの型</h3>
          <p>
            2026年のAIテストツール市場は、大きく次の3つのアプローチに分類できます{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref27">
                27
              </a>
              ,{" "}
              <a className={styles.citeLink} href="#ref28">
                28
              </a>
              ]
            </sup>
            。
          </p>
          <ol>
            <li>
              <strong>自然言語ベースのテスト作成</strong>:
              平易な英語(や日本語)でテストシナリオを書くとツールが自動でテストコードに変換するタイプ。非エンジニアのQA担当者でも扱いやすい(例:
              testRigor)。
            </li>
            <li>
              <strong>セルフヒーリングなテスト自動化</strong>:
              UIの変更があってもAIがロケーター(要素の指定方法)を自動的に修正し、テストのメンテナンスコストを下げるタイプ(例:
              Katalon、Testim)。
            </li>
            <li>
              <strong>エージェント型の自律実行</strong>:
              人間が作った大まかなテスト計画をもとに、AIエージェントが実際にブラウザを操作してEnd-to-Endテストを行うタイプ。2026年に最も勢いよく成長したカテゴリとされています{" "}
              <sup>
                [{" "}
                <a className={styles.citeLink} href="#ref28">
                  28
                </a>
                ]
              </sup>
              。
            </li>
          </ol>

          <h3>4-2. 代表的なツール</h3>
          <div className={styles.tableWrap}>
            <div className={styles.tableTitle}>代表的なAIテストツール</div>
            <table>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Katalon Studio</td>
                  <td>
                    Web・モバイル・API・デスクトップを横断できるオールインワン型。AIによるセルフヒーリングロケーターを搭載{" "}
                    <sup>
                      [{" "}
                      <a className={styles.citeLink} href="#ref29">
                        29
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>testRigor</td>
                  <td>
                    平易な自然言語でテストシナリオを記述でき、非エンジニアでも自動化に参加しやすい{" "}
                    <sup>
                      [{" "}
                      <a className={styles.citeLink} href="#ref27">
                        27
                      </a>
                      ,{" "}
                      <a className={styles.citeLink} href="#ref29">
                        29
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Applitools / Percy</td>
                  <td>ビジュアルリグレッション(見た目の差分)検出に特化</td>
                </tr>
                <tr>
                  <td>QA Wolf / mabl 等</td>
                  <td>マネージド型・低コードのEnd-to-Endテスト運用サービス</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>4-3. テストピラミッドとAIの役割</h3>
          <div className={styles.diagramWrap} data-testid="mermaid-diagram">
            <div className={styles.diagramCard}>
              <MermaidDiagram chart={DIAGRAM_MMD_3} theme="base" themeVariables={BOOK_THEME_VARS} />
            </div>
            <div className={styles.diagramCaption}>図4: テストピラミッドの各層とAIが担う役割</div>
          </div>

          <p>
            2026年時点の実務では、「AIコーディングエージェント(Claude
            CodeやCursor等)にテストコードそのものを書かせる」動きと、「専門のテストプラットフォームで探索的テストや視覚回帰を任せる」動きが併存しており、両方を組み合わせるのが一般的なパターンとして紹介されています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref30">
                30
              </a>
              ]
            </sup>
            。原書でも強調されている通り、AIがテストケースを大量生成できるようになったからこそ、「本当に必要なテストは何か」を判断する人間のテスト設計スキルの重要性はむしろ増しています。
          </p>
        </section>

        <section className={styles.section} id="step5">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-chart-line"></i>
            </div>
            <h2>Step 5. 予測分析とパフォーマンス最適化</h2>
          </div>
          <p className={styles.lead}>
            原書第5章のテーマです。この章は、開発中に生成されるログやメトリクスをAIで分析し、性能改善やユーザー行動の予測に役立てる領域を扱っています。
          </p>

          <h3>5-1. 主なユースケース</h3>
          <ul>
            <li>
              <strong>パフォーマンスボトルネックの検出</strong>:
              APM(アプリケーションパフォーマンス監視)ツールが集めたメトリクスをAIが解析し、異常なレイテンシやエラー率の増加を自然言語で説明する。
            </li>
            <li>
              <strong>ユーザー行動予測</strong>:
              プロダクト利用データから離脱リスクの高いユーザーセグメントを予測する。
            </li>
            <li>
              <strong>データ分析の民主化</strong>:
              非エンジニアでも自然言語で「先月と比べて何が変わったか」を尋ねられるツールが増えている。
            </li>
          </ul>

          <h3>5-2. 代表的なツールの位置づけ</h3>
          <div className={styles.tableWrap}>
            <div className={styles.tableTitle}>予測分析・性能最適化の代表的なツール</div>
            <table>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Julius</td>
                  <td>自然言語でデータ分析・可視化を行うAIデータアナリストツール</td>
                </tr>
                <tr>
                  <td>Akkio</td>
                  <td>ノーコードで予測モデルを構築できるプラットフォーム</td>
                </tr>
                <tr>
                  <td>ChatGPT(Advanced Data Analysis等)</td>
                  <td>CSVやログファイルをアップロードして対話形式で分析できる汎用ツール</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            この分野は他の章に比べるとツール自体の入れ替わりは緩やかですが、「専用のBIツール」と「汎用AIチャット」の境界が曖昧になりつつある点が2026年時点の特徴です。専用ツールは特定のデータソースとの連携やダッシュボード化に強く、汎用AIチャットは探索的な質問への柔軟な対応に強い、という使い分けが基本になります。
          </p>
        </section>

        <section className={styles.section} id="step6">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-notebook"></i>
            </div>
            <h2>Step 6. ドキュメントとテクニカルライティング</h2>
          </div>
          <p className={styles.lead}>原書第6章のテーマです。</p>

          <h3>6-1. 「ドキュメントは書かれない」から「ドキュメントは陳腐化する」へ</h3>
          <p>
            これまでソフトウェア開発の課題は「十分なドキュメントが書かれないこと」でした。しかし2026年になると、AIがドキュメントを素早く生成できるようになった結果、課題は「AIが書いたコードとAIが書いたドキュメントの整合性をどう保つか」に移っています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref31">
                31
              </a>
              ]
            </sup>
            。Forresterの2026年第1四半期のレポートでは、エンジニア10名以上のチームの78%が何らかの「ドキュメント負債」の問題を抱えていると報告されています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref32">
                32
              </a>
              ]
            </sup>
            。また、JetBrainsの開発者エコシステム調査では、ドキュメント作成にAIツールを使う開発者の割合が2023年の11%から2025年には68%まで増加したとされています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref31">
                31
              </a>
              ]
            </sup>
            。
          </p>

          <h3>6-2. 代表的なツール</h3>
          <div className={styles.tableWrap}>
            <div className={styles.tableTitle}>代表的なドキュメント生成ツール</div>
            <table>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Swimm</td>
                  <td>
                    コードとドキュメントを紐づけ、コードが変更されると関連ドキュメントに「古くなった可能性」のフラグを立てる「コード連動ドキュメント」を提唱{" "}
                    <sup>
                      [{" "}
                      <a className={styles.citeLink} href="#ref31">
                        31
                      </a>
                      ,{" "}
                      <a className={styles.citeLink} href="#ref33">
                        33
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Mintlify</td>
                  <td>
                    API仕様書などの開発者向けドキュメントに強く、AIライティングアシスタントを統合
                  </td>
                </tr>
                <tr>
                  <td>ChatGPT / Cursor</td>
                  <td>コードからREADMEやdocstringを生成する汎用的な使い方</td>
                </tr>
                <tr>
                  <td>Scribe</td>
                  <td>操作手順をキャプチャしてステップバイステップのガイドを自動生成するツール</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>6-3. 実践のコツ</h3>
          <ul>
            <li>
              <strong>リファレンス系ドキュメント(API仕様等)はAI生成との相性が良い</strong>:
              構造化されたコードから機械的に生成できるため、AIによる自動化が特に効果を発揮します。
            </li>
            <li>
              <strong>
                概念的なドキュメント(チュートリアルや設計思想の説明)は人間の関与が重要
              </strong>
              :
              AIは「読者が何につまずくか」という教育的な勘所を持たないため、複数のレビューでこの点が共通して指摘されています{" "}
              <sup>
                [{" "}
                <a className={styles.citeLink} href="#ref32">
                  32
                </a>
                ]
              </sup>
              。
            </li>
            <li>
              <strong>コードとドキュメントを同じPRで変更する運用ルール</strong>
              を設けることで、ドキュメントの陳腐化を構造的に防ぐチームが増えています。
            </li>
          </ul>
        </section>

        <section className={styles.section} id="step7">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-message-chatbot"></i>
            </div>
            <h2>Step 7. チャットボットとバーチャルアシスタント</h2>
          </div>
          <p className={styles.lead}>
            原書第7章のテーマです。この章は「AIチャットボット」自体の作り方を扱っています。
          </p>

          <h3>7-1. チャットボットからエージェントへ</h3>
          <p>
            従来の「あらかじめ決められた応答パターンを返すチャットボット」と、現在主流になりつつある「ツールを使って状態を変化させることができるAIエージェント」は明確に区別されるようになりました{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref34">
                34
              </a>
              ]
            </sup>
            。単に質問に答えるだけでなく、外部システムのデータを検索したり、予約を確定したりといった「行動」を取れるかどうかが分岐点です。
          </p>

          <div className={styles.diagramWrap} data-testid="mermaid-diagram">
            <div className={styles.diagramCard}>
              <MermaidDiagram chart={DIAGRAM_MMD_4} theme="base" themeVariables={BOOK_THEME_VARS} />
            </div>
            <div className={styles.diagramCaption}>
              図5: 従来型チャットボットとAIエージェントの違い
            </div>
          </div>

          <h3>7-2. 代表的なツール・フレームワーク</h3>
          <div className={styles.tableWrap}>
            <div className={styles.tableTitle}>
              代表的なチャットボット・エージェントフレームワーク
            </div>
            <table>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Chatbase</td>
                  <td>
                    自社データを取り込んでカスタマーサポート向けチャットボットを構築するノーコードサービス
                  </td>
                </tr>
                <tr>
                  <td>Botpress</td>
                  <td>会話フローを視覚的に設計できるオープンソース寄りのプラットフォーム</td>
                </tr>
                <tr>
                  <td>LangChain / LangGraph</td>
                  <td>
                    AIエージェント構築の業界標準フレームワークの一つ。LangGraphはグラフ構造で状態遷移を明示的に管理でき、2025年10月にLangChainとともにv1.0へ到達し、2026年には企業導入向けのエンタープライズ機能(監査ログ、ロールバック、MCP連携など)が拡充されています{" "}
                    <sup>
                      [{" "}
                      <a className={styles.citeLink} href="#ref35">
                        35
                      </a>
                      ,{" "}
                      <a className={styles.citeLink} href="#ref36">
                        36
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            AI研究者のAndrew
            Ng氏は、AIが自らの作業結果を確認・修正・再試行するループを回せるようになったことが、単発の推論では実現できなかった能力を引き出す大きな転換点になっていると述べています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref36">
                36
              </a>
              ]
            </sup>
            。LangGraphのようなフレームワークは、まさにこの「確認・修正・再試行」のループを構造化して実装するために設計されています。
          </p>

          <h3>7-3. 使い分けの目安</h3>
          <ul>
            <li>
              単純な一問一答のFAQボットであれば、Chatbase等のノーコードツールで十分なケースが多い。
            </li>
            <li>
              複数のAPIを呼び出し、条件分岐や承認フローを含む複雑な業務プロセスを自動化したい場合は、LangGraphのようなエージェントフレームワークでの設計が推奨されます。
            </li>
            <li>
              単純なタスクにフル機能のエージェントフレームワークを使うと、かえって開発・デバッグのコストが増えるという指摘もあり、タスクの複雑さに応じた技術選定が重要です{" "}
              <sup>
                [{" "}
                <a className={styles.citeLink} href="#ref36">
                  36
                </a>
                ]
              </sup>
              。
            </li>
          </ul>
        </section>

        <section className={styles.section} id="step8">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-trophy"></i>
            </div>
            <h2>Step 8. 実装成功事例から学ぶ</h2>
          </div>
          <p className={styles.lead}>
            原書第8章のテーマです。原書ではPieter
            Levels氏(個人開発者)とShopify(大企業)という対照的な2つの事例が紹介されています。ここでは2026年時点でのアップデートを交えて解説します。
          </p>

          <h3>8-1. 個人開発者の事例: Pieter Levels</h3>
          <p>
            Pieter Levels氏は、Nomad List、Remote OK、Photo
            AIなど複数のプロダクトを一人で開発・運営してきたインディーハッカーの代表格です。2026年2月には、ブラウザ上で動くフライトシミュレーター「fly.pieter.com」を一人でAIツール(CursorとThree.jsを利用)を使って開発し、公開から17日でARR(年間経常収益)100万ドルに到達したと報告されています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref37">
                37
              </a>
              ]
            </sup>
            。同氏のポートフォリオ全体では、複数プロダクト合算で月間20万ドル前後の収益(自己申告ベース)を継続的に生み出しているとされています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref38">
                38
              </a>
              ]
            </sup>
            。
          </p>
          <p>
            一方で同氏は2026年7月、自身が使っていたSaaSツールのサブスクリプションをすべて解約し、AIで自作し直したことを公表し、「実行コストがAIによって下がることで、真っ先に淘汰される開発者はインディーハッカー自身かもしれない」という趣旨の警鐘も発信しています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref39">
                39
              </a>
              ]
            </sup>
            。AIによる開発コストの低下は、個人開発者に大きな追い風であると同時に、参入障壁の低下が既存プレイヤーの競争優位を脅かすという二面性を持つことを示す事例です。
          </p>

          <h3>8-2. 大企業の事例: Shopify</h3>
          <p>
            ECプラットフォームを運営するShopifyのCEO、Tobi
            Lütke氏は2025年4月、全社員に向けた社内メモを公開しました。このメモでは「効果的にAIを使うことは、もはや任意ではなく基本的な期待事項である」と明言され、追加の人員やリソースを要求する前に「なぜAIでその仕事ができないのか」を説明する責任が各チームに課されることになりました{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref40">
                40
              </a>
              ,{" "}
              <a className={styles.citeLink} href="#ref41">
                41
              </a>
              ]
            </sup>
            。AIの活用状況は人事評価や採用の評価基準にも組み込まれるとされています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref41">
                41
              </a>
              ,{" "}
              <a className={styles.citeLink} href="#ref42">
                42
              </a>
              ]
            </sup>
            。
          </p>
          <p>
            このメモは大きな話題を呼び、「AIの活用を組織文化として明文化した先駆的な事例」として2026年に入ってからも頻繁に参照されています。Shopifyのように数千人規模の開発組織を抱える企業が、トップダウンでAI活用を制度化した事例は、企業がAI導入を検討する際のベンチマークの一つになっています。
          </p>

          <h3>8-3. 2つの事例から見えるパターン</h3>
          <div className={styles.tableWrap}>
            <div className={styles.tableTitle}>個人開発者と大企業、2つの事例の比較</div>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>Pieter Levels(個人)</th>
                  <th>Shopify(大企業)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>意思決定の速さ</td>
                  <td>即断即決、一人でツールを選び即日導入</td>
                  <td>トップダウンの方針転換に数ヶ月〜数年</td>
                </tr>
                <tr>
                  <td>AIの役割</td>
                  <td>開発工数そのものを代替し、少人数で製品を量産</td>
                  <td>既存の大規模組織の生産性を底上げ</td>
                </tr>
                <tr>
                  <td>リスク</td>
                  <td>品質管理・セキュリティを自己責任で担う必要がある</td>
                  <td>ガバナンス・コンプライアンスの整備が前提になる</td>
                </tr>
                <tr>
                  <td>共通点</td>
                  <td>「AIを使わない理由」を問われる文化</td>
                  <td>「AIを使わない理由」を問われる文化</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            規模は違えど、両者に共通するのは「AIを使うかどうか」を議論する段階はすでに終わり、「どう使いこなすか」が組織・個人の競争力を左右する段階に入っているという点です。
          </p>
        </section>

        <section className={styles.section} id="step9">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-route"></i>
            </div>
            <h2>Step 9. AI時代のソフトウェア開発ワークフロー実践編</h2>
          </div>
          <p className={styles.lead}>
            ここからは原書の内容を踏まえた応用編です。Step
            1〜8で見てきた各カテゴリのツールを、実際の開発ワークフローの中でどう組み合わせるかを整理します。
          </p>

          <h3>9-1. エージェント中心の開発ループ</h3>
          <p>
            Simon
            Willison氏は、AIコーディングエージェントを効果的に使うための実践パターンとして、明確なタスクの切り出し、エージェントの作業結果の検証手順の設計、そして失敗したときにどこまで手戻りを許容するかをあらかじめ決めておくことの重要性を繰り返し説いています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref9">
                9
              </a>
              ,{" "}
              <a className={styles.citeLink} href="#ref43">
                43
              </a>
              ]
            </sup>
            。
          </p>

          <div className={styles.diagramWrap} data-testid="mermaid-diagram">
            <div className={styles.diagramCard}>
              <MermaidDiagram chart={DIAGRAM_MMD_5} theme="base" themeVariables={BOOK_THEME_VARS} />
            </div>
            <div className={styles.diagramCaption}>
              図6: エージェント中心の開発ループ ― 定義・委任・検証・承認または再試行
            </div>
          </div>

          <div
            className={`${styles.callout} ${styles.plum}`}
            data-testid="callout"
            data-variant="plum"
          >
            <div className={styles.calloutIcon}>
              {" "}
              <i className="ti ti-building-store"></i>
            </div>
            <div className={styles.calloutBody}>
              <span className={styles.calloutTitle}>
                ウィンチェスター・ミステリー・ハウスの教訓
              </span>
              <p>
                同氏はまた、AIエージェントによってコードを書くコスト自体が劇的に下がった結果、「コードの行数」という指標が再び意味を持ち始めていると指摘しています。かつては「実装に時間がかかる」という制約そのものが機能追加を思いとどまらせる自然なブレーキになっていましたが、AIがそのブレーキを外してしまうため、際限なく機能を追加し続けると、システム全体の一貫性を人間が把握しきれなくなるリスクがあるという警鐘です{" "}
                <sup>
                  [{" "}
                  <a className={styles.citeLink} href="#ref44">
                    44
                  </a>
                  ]
                </sup>
                。この現象は、40年かけて140の部屋が継ぎ足されたウィンチェスター・ミステリー・ハウス(米国の有名な邸宅)になぞらえて語られることもあります{" "}
                <sup>
                  [{" "}
                  <a className={styles.citeLink} href="#ref44">
                    44
                  </a>
                  ]
                </sup>
                。
              </p>
            </div>
          </div>

          <h3>9-2. 段階別に見るツールの組み合わせ例</h3>
          <div className={styles.tableWrap}>
            <div className={styles.tableTitle}>開発フェーズ別のツールの組み合わせ例</div>
            <table>
              <thead>
                <tr>
                  <th>開発フェーズ</th>
                  <th>使われるツールカテゴリ</th>
                  <th>解説箇所</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>アイデア出し・UIプロトタイプ</td>
                  <td>Bolt.new / Lovable / v0 / Uizard</td>
                  <td>
                    {" "}
                    <a href="#step2">Step 2</a>
                  </td>
                </tr>
                <tr>
                  <td>コア機能の実装</td>
                  <td>Cursor / Claude Code / GitHub Copilot Agent mode</td>
                  <td>
                    {" "}
                    <a href="#step1">Step 1</a>
                  </td>
                </tr>
                <tr>
                  <td>プルリクエストの検証</td>
                  <td>CodeRabbit / Snyk Code / Copilot Code Review</td>
                  <td>
                    {" "}
                    <a href="#step3">Step 3</a>
                  </td>
                </tr>
                <tr>
                  <td>テストの自動生成・実行</td>
                  <td>Katalon / testRigor / コーディングエージェント自身</td>
                  <td>
                    {" "}
                    <a href="#step4">Step 4</a>
                  </td>
                </tr>
                <tr>
                  <td>ドキュメント整備</td>
                  <td>Swimm / Mintlify / Scribe</td>
                  <td>
                    {" "}
                    <a href="#step6">Step 6</a>
                  </td>
                </tr>
                <tr>
                  <td>社内外向けチャット・サポート</td>
                  <td>Chatbase / Botpress / LangGraph</td>
                  <td>
                    {" "}
                    <a href="#step7">Step 7</a>
                  </td>
                </tr>
                <tr>
                  <td>運用データの分析</td>
                  <td>Julius / Akkio / 汎用AIチャット</td>
                  <td>
                    {" "}
                    <a href="#step5">Step 5</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            初学者がまず取り組みやすいのは、Step 1(コード生成)とStep
            3(コードレビュー)の組み合わせです。AIに書かせたコードを別のAI(またはツール)にレビューさせるという「二重チェック」の習慣をつけることで、AI活用のリスクを抑えながら生産性向上の恩恵を得やすくなります。
          </p>
        </section>

        <section className={styles.section} id="step10">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-shield-lock"></i>
            </div>
            <h2>Step 10. リスクとガバナンス、責任あるAI活用</h2>
          </div>

          <h3>10-1. 「レビューの質」対「開発の速さ」のトレードオフ</h3>
          <p>
            DORAの調査では、AI活用度の高いチームほどPRのマージ数や機能追加のスピードが上がる一方で、インシデント(障害)の発生率やレビュー時間も増加する傾向が報告されています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref21">
                21
              </a>
              ,{" "}
              <a className={styles.citeLink} href="#ref24">
                24
              </a>
              ]
            </sup>
            。これは「AIによって開発が速くなった分、品質管理のプロセスも同じだけ強化しないと、事故の増加という形でしっぺ返しを受ける」ことを意味します。
          </p>

          <h3>10-2. プロンプトインジェクションと「致死の三要素」</h3>
          <p>
            Simon Willison氏が提唱した概念に「lethal
            trifecta(致死の三要素)」があります。これは、AIエージェントが (1)
            機密性の高いプライベートデータにアクセスでき、(2)
            信頼できない外部コンテンツ(Webページやメール等)を読み込み、(3)
            外部と通信する能力を同時に持つ場合、悪意のある指示がそのコンテンツに埋め込まれることで機密情報が外部に漏洩するリスクが生じる、というセキュリティ上の警告です{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref43">
                43
              </a>
              ]
            </sup>
            。エージェントに強力な権限を与えるほど、この3条件が揃う可能性が高まるため、権限を必要最小限に絞る、実行前に人間の承認を挟む、といった設計上の配慮が欠かせません。
          </p>

          <div className={styles.diagramWrap} data-testid="mermaid-diagram">
            <div className={styles.diagramCard}>
              <MermaidDiagram chart={DIAGRAM_MMD_6} theme="base" themeVariables={BOOK_THEME_VARS} />
            </div>
            <div className={styles.diagramCaption}>
              図7: 「致死の三要素」が揃うことで生じるリスクと対策
            </div>
          </div>

          <h3>10-3. 「AIが書いたコードは1.7倍の問題を含む」という調査</h3>
          <p>
            CodeRabbitが470件のオープンソースGitHub
            PR(AI共同作成320件、人間のみ150件)を分析した調査では、AI共同作成PRの平均指摘事項数(バグ・脆弱性・スタイル逸脱等)が10.83件だったのに対し、人間のみのPRでは6.45件と、約1.7倍の差があったと報告されています{" "}
            <sup>
              [{" "}
              <a className={styles.citeLink} href="#ref45">
                45
              </a>
              ]
            </sup>
            。これは「AI生成コードのレビューはむしろ強化すべき」という考え方の裏付けとしてよく引用される数字です。AIにコードを書かせることと、AIが書いたコードを別の仕組み(あるいは人間)でチェックすることは、常にセットで運用する必要があります。
          </p>

          <h3>10-4. 実務者への提言</h3>
          <ul>
            <li>
              コーディングエージェントに大きな権限(本番環境へのデプロイ権限、外部APIの実行権限等)を与える場合は、段階的に権限を拡大し、最初は読み取り専用や承認制から始める。
            </li>
            <li>
              AIが生成したコードのレビューを「省略可能な工程」ではなく「AI活用によって重要性が増した工程」と位置づける。
            </li>
            <li>
              セキュリティが関わる変更(認証、決済、権限管理等)は、AIレビューだけでなく専門ツール・専門家によるチェックを必須とする。
            </li>
          </ul>
        </section>

        <section className={styles.section} id="step11">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-scale"></i>
            </div>
            <h2>Step 11. ツール選定のための評価フレームワーク</h2>
          </div>
          <p className={styles.lead}>
            原書は、各章で「評価プロセス」という共通のステップを設けており、個別ツールのレビューに入る前に「何を基準に評価するか」を明確にすることを重視しています。ここではその考え方を一般化した評価フレームワークを提示します。
          </p>

          <div className={styles.tableWrap}>
            <div className={styles.tableTitle}>ツール選定のための評価フレームワーク</div>
            <table>
              <thead>
                <tr>
                  <th>評価軸</th>
                  <th>確認するポイント</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>精度・信頼性</td>
                  <td>実際の開発課題(自社のコードベースに近いもの)で試したときの出力品質</td>
                </tr>
                <tr>
                  <td>統合のしやすさ</td>
                  <td>既存のIDE・CI/CD・バージョン管理システムとの連携のしやすさ</td>
                </tr>
                <tr>
                  <td>コンテキスト理解</td>
                  <td>コードベース全体やドキュメントをどこまで踏まえた提案ができるか</td>
                </tr>
                <tr>
                  <td>セキュリティ・コンプライアンス</td>
                  <td>データの取り扱いポリシー、SOC2等の認証取得状況、オンプレミス対応の有無</td>
                </tr>
                <tr>
                  <td>コストモデル</td>
                  <td>定額制か従量課金(トークン単位)か、チーム規模に応じた価格の伸び方</td>
                </tr>
                <tr>
                  <td>エコシステムの将来性</td>
                  <td>
                    開発元の資金状況・買収リスク・アップデート頻度(Windsurfの事例のように運営元が変わることもある)
                  </td>
                </tr>
                <tr>
                  <td>学習コストの適切さ</td>
                  <td>チームメンバーが習熟するまでの負担、既存ワークフローからの移行のしやすさ</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            原書が提案する「実際のコーディング課題に基づいた一貫した評価方法」という考え方は、2026年のようにツールの入れ替わりが激しい市場でこそ重要性を増しています。特定のツール名を覚えるだけでなく、「自分たちのユースケースでどう評価するか」という軸を持つことが、長期的に陳腐化しない知識になります。
          </p>
        </section>

        <section className={styles.section} id="step12">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-compass"></i>
            </div>
            <h2>Step 12. ソフトウェア開発の未来</h2>
          </div>
          <p className={styles.lead}>
            原書の結論部分では、AIによる自動化が過去の技術革新とどう似ていて、どう違うのかを考えるための3つの類推が紹介されています。
          </p>

          <ul>
            <li>
              <strong>ATMと銀行窓口係</strong>:
              ATMの普及は銀行窓口係という職業を消滅させませんでしたが、1店舗あたりの窓口係の人数を減らし、彼らの役割を「単純な入出金作業」から「相談業務」へと変化させました。
            </li>
            <li>
              <strong>エレベーター操作員</strong>:
              かつて存在した「エレベーターを手動操作する専門職」は自動化によって完全に姿を消しました。
            </li>
            <li>
              <strong>表計算ソフトと経理担当者</strong>:
              Excelの登場は経理担当者を代替しませんでしたが、手計算という作業を奪う一方で、より高度な分析業務へと役割をシフトさせました。
            </li>
          </ul>

          <p>
            これらの類推が示唆するのは、「AIによる自動化が仕事そのものを完全に消し去るケース」と「仕事の中身を変化させるケース」の両方があり、ソフトウェア開発がどちらに近いのかは職種やタスクの性質によって異なる、という視点です。
          </p>

          <h3>12-1. 2026年時点で見えてきた変化の兆し</h3>
          <ul>
            <li>
              <strong>開発者の役割の変化</strong>:
              GitHubのOctoverse分析では、熟練したAI活用者は「コードを書く人」から「AIに委任し、検証し、方向づける戦略的なオーケストレーター」へと役割を変えつつあると分析されています{" "}
              <sup>
                [{" "}
                <a className={styles.citeLink} href="#ref2">
                  2
                </a>
                ]
              </sup>
              。
            </li>
            <li>
              <strong>参入障壁の低下と再編</strong>: Pieter
              Levels氏の事例が示すように、AIは個人開発者の生産性を劇的に押し上げる一方、同じ理由で既存の小規模SaaS事業者の競争優位を脅かす面もあります{" "}
              <sup>
                [{" "}
                <a className={styles.citeLink} href="#ref39">
                  39
                </a>
                ]
              </sup>
              。
            </li>
            <li>
              <strong>組織のガバナンスの重要性の高まり</strong>:
              DORAの分析が繰り返し強調するように、AI導入の成果はツールの性能そのものよりも、それを取り巻く開発プロセス・組織文化に大きく左右されます{" "}
              <sup>
                [{" "}
                <a className={styles.citeLink} href="#ref6">
                  6
                </a>
                ]
              </sup>
              。
            </li>
          </ul>

          <h3>12-2. まとめ</h3>
          <p>
            生成AIはソフトウェア開発のあらゆる工程(要件定義からコード生成、レビュー、テスト、ドキュメント、運用監視まで)に浸透しつつありますが、その恩恵を最大化するのは「AIに何を任せ、何を人間が担うか」という設計を丁寧に行うチーム・個人です。本ガイドで紹介した各ツールカテゴリの特性を理解し、Step
            11の評価フレームワークを使って自分たちのユースケースに合ったツールを見極めることが、変化の速いこの分野で長く役立つスキルになります。
          </p>
        </section>

        <section className={styles.section} id="glossary">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-brain"></i>
            </div>
            <h2>用語集</h2>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>用語</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.glossaryTerm}>バイブコーディング(Vibe Coding)</td>
                  <td>
                    自然言語による指示だけでAIにアプリケーションのコードを書かせる開発スタイル。Andrej
                    Karpathy氏が2025年に提唱した言葉
                  </td>
                </tr>
                <tr>
                  <td className={styles.glossaryTerm}>
                    エージェント型コーディング(Agentic Coding)
                  </td>
                  <td>
                    AIが計画立案・複数ファイル編集・コマンド実行・結果検証までを自律的に繰り返す開発支援の形態
                  </td>
                </tr>
                <tr>
                  <td className={styles.glossaryTerm}>LLM(大規模言語モデル)</td>
                  <td>
                    ChatGPTやClaude、Geminiなどの基盤となる、大量のテキストで学習された言語モデル
                  </td>
                </tr>
                <tr>
                  <td className={styles.glossaryTerm}>SWE-bench</td>
                  <td>AIコーディングモデルの実務的な問題解決能力を測るベンチマークの一つ</td>
                </tr>
                <tr>
                  <td className={styles.glossaryTerm}>RAG(検索拡張生成)</td>
                  <td>LLMが回答する際に外部の情報源を検索して参照する仕組み</td>
                </tr>
                <tr>
                  <td className={styles.glossaryTerm}>MCP(Model Context Protocol)</td>
                  <td>AIモデルが外部ツール・データソースと接続するための標準プロトコル</td>
                </tr>
                <tr>
                  <td className={styles.glossaryTerm}>セルフヒーリングテスト</td>
                  <td>
                    UIの変更があってもAIが自動的にテストコードの参照先を修正し、メンテナンスの手間を減らす仕組み
                  </td>
                </tr>
                <tr>
                  <td className={styles.glossaryTerm}>プロンプトインジェクション</td>
                  <td>
                    外部コンテンツに埋め込まれた悪意ある指示によって、AIエージェントを意図しない挙動に誘導する攻撃手法
                  </td>
                </tr>
                <tr>
                  <td className={styles.glossaryTerm}>致死の三要素(Lethal Trifecta)</td>
                  <td>
                    機密データへのアクセス、信頼できない外部コンテンツの読み込み、外部通信能力の3つが揃うことで生じるAIエージェントのセキュリティリスク
                  </td>
                </tr>
                <tr>
                  <td className={styles.glossaryTerm}>コード連動ドキュメント</td>
                  <td>
                    コードの変更を検知し、関連するドキュメントに更新の必要性を自動でフラグ付けする仕組み(Swimm等が採用)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section} id="checklist">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-checklist"></i>
            </div>
            <h2>学習チェックリスト</h2>
          </div>
          <div className={styles.checklistCounter} id="checkCounter" data-testid="check-counter">
            0 / 9 完了
          </div>
          <ul className={styles.checklist} id="checklistItems">
            <li className={`${styles.checkItem} check-item`} data-testid="check-item">
              <input type="checkbox" id="c1" />{" "}
              <label htmlFor="c1">
                ブラウザ型(ChatGPT/Gemini)とIDE統合型(Cursor/Copilot/Claude
                Code等)のコード生成ツールの違いを説明できる
              </label>
            </li>
            <li className={`${styles.checkItem} check-item`} data-testid="check-item">
              <input type="checkbox" id="c2" />{" "}
              <label htmlFor="c2">
                AIアプリビルダー(Bolt.new/Lovable/v0)がそれぞれ得意とする用途の違いを理解している
              </label>
            </li>
            <li className={`${styles.checkItem} check-item`} data-testid="check-item">
              <input type="checkbox" id="c3" />{" "}
              <label htmlFor="c3">
                AIコードレビューツールが「機械的な問題」と「ビジネスロジックの妥当性」のどちらに強く、どちらに弱いかを説明できる
              </label>
            </li>
            <li className={`${styles.checkItem} check-item`} data-testid="check-item">
              <input type="checkbox" id="c4" />{" "}
              <label htmlFor="c4">
                AIテストツールの3つのアプローチ(自然言語ベース/セルフヒーリング/自律エージェント)を区別できる
              </label>
            </li>
            <li className={`${styles.checkItem} check-item`} data-testid="check-item">
              <input type="checkbox" id="c5" />{" "}
              <label htmlFor="c5">
                ドキュメントの「陳腐化問題」に対して、コード連動ドキュメントという解決アプローチがあることを理解している
              </label>
            </li>
            <li className={`${styles.checkItem} check-item`} data-testid="check-item">
              <input type="checkbox" id="c6" />{" "}
              <label htmlFor="c6">
                従来型チャットボットとAIエージェントの違い(外部ツールを使って行動できるかどうか)を説明できる
              </label>
            </li>
            <li className={`${styles.checkItem} check-item`} data-testid="check-item">
              <input type="checkbox" id="c7" />{" "}
              <label htmlFor="c7">
                「致死の三要素」を避けるためのセキュリティ設計の基本を理解している
              </label>
            </li>
            <li className={`${styles.checkItem} check-item`} data-testid="check-item">
              <input type="checkbox" id="c8" />{" "}
              <label htmlFor="c8">
                自分たちのユースケースに合わせたツール評価フレームワークを作成できる
              </label>
            </li>
            <li className={`${styles.checkItem} check-item`} data-testid="check-item">
              <input type="checkbox" id="c9" />{" "}
              <label htmlFor="c9">
                AIによる自動化が「職業を消滅させるケース」と「役割を変化させるケース」の両方があることを説明できる
              </label>
            </li>
          </ul>
        </section>

        <section className={styles.section} id="references">
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              {" "}
              <i className="ti ti-link"></i>
            </div>
            <h2>参考文献・出典URL一覧</h2>
          </div>
          <p className={styles.lead}>
            本ガイドの作成にあたり、2026年9月14日時点で参照した情報源です。番号は本文中の引用番号に対応します。
          </p>

          <div className={styles.refGroupLabel}>GitHub Octoverse / DORA</div>
          <ul className={styles.refList}>
            <li className={styles.refCard} id="ref1">
              <div className={styles.refNum}>1</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  GitHub Blog: Octoverse ― A new developer joins GitHub every second as AI leads
                  TypeScript to #1
                </div>
                <a
                  className={styles.refUrl}
                  href="https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref2">
              <div className={styles.refNum}>2</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  GitHub Blog: How AI is reshaping developer choice (and Octoverse data proves it)
                </div>
                <a
                  className={styles.refUrl}
                  href="https://github.blog/ai-and-ml/generative-ai/how-ai-is-reshaping-developer-choice-and-octoverse-data-proves-it/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.blog/ai-and-ml/generative-ai/how-ai-is-reshaping-developer-choice-and-octoverse-data-proves-it
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref3">
              <div className={styles.refNum}>3</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  InfoQ: GitHub Data Shows AI Tools Creating "Convenience Loops"
                </div>
                <a
                  className={styles.refUrl}
                  href="https://www.infoq.com/news/2026/03/ai-reshapes-language-choice/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  infoq.com/news/2026/03/ai-reshapes-language-choice
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref4">
              <div className={styles.refNum}>4</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Visual Studio Magazine: TypeScript Tops GitHub Octoverse as AI Era Reshapes
                  Language Choices
                </div>
                <a
                  className={styles.refUrl}
                  href="https://visualstudiomagazine.com/articles/2025/10/31/typescript-tops-github-octoverse-as-ai-era-reshapes-language-choices.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  visualstudiomagazine.com/articles/2025/10/31/typescript-tops-github-octoverse-as-ai-era-reshapes-language-choices.aspx
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref5">
              <div className={styles.refNum}>5</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Google Cloud Blog: Announcing the 2025 DORA Report
                </div>
                <a
                  className={styles.refUrl}
                  href="https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref6">
              <div className={styles.refNum}>6</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Google Blog: How are developers using AI? Inside Google's 2025 DORA report
                </div>
                <a
                  className={styles.refUrl}
                  href="https://blog.google/innovation-and-ai/technology/developers-tools/dora-report-2025/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  blog.google/innovation-and-ai/technology/developers-tools/dora-report-2025
                </a>
              </div>
            </li>
          </ul>

          <div className={styles.refGroupLabel}>バイブコーディング / AIアプリビルダー</div>
          <ul className={styles.refList}>
            <li className={styles.refCard} id="ref7">
              <div className={styles.refNum}>7</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Particula: Lovable vs Bolt.new vs v0 ― AI App Builders 2026
                </div>
                <a
                  className={styles.refUrl}
                  href="https://particula.tech/blog/lovable-vs-bolt-vs-v0-ai-app-builders"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  particula.tech/blog/lovable-vs-bolt-vs-v0-ai-app-builders
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref8">
              <div className={styles.refNum}>8</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  WeavAI: 2026 AI App Builder Guide ― v0 vs Bolt.new vs Lovable
                </div>
                <a
                  className={styles.refUrl}
                  href="https://weavai.app/blog/en/2026/05/12/2026-ai-app-builder-guide-v0-vs-bolt-new-vs-lovable/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  weavai.app/blog/en/2026/05/12/2026-ai-app-builder-guide-v0-vs-bolt-new-vs-lovable
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref17">
              <div className={styles.refNum}>17</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  ToolJet Blog: Lovable vs Bolt vs V0 ― Best AI App Builder Compared in 2026
                </div>
                <a
                  className={styles.refUrl}
                  href="https://blog.tooljet.com/lovable-vs-bolt-vs-v0/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  blog.tooljet.com/lovable-vs-bolt-vs-v0
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref18">
              <div className={styles.refNum}>18</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>NxCode: Bolt.new vs Lovable in 2026</div>
                <a
                  className={styles.refUrl}
                  href="https://www.nxcode.io/resources/news/bolt-new-vs-lovable-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  nxcode.io/resources/news/bolt-new-vs-lovable-2026
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref19">
              <div className={styles.refNum}>19</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  NxCode: Lovable vs Bolt.new 2026 ― Which AI App Builder Should You Choose
                </div>
                <a
                  className={styles.refUrl}
                  href="https://www.nxcode.io/resources/news/lovable-vs-bolt-new-2026-ai-app-builder-comparison"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  nxcode.io/resources/news/lovable-vs-bolt-new-2026-ai-app-builder-comparison
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref20">
              <div className={styles.refNum}>20</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Tech Insider (AU): Lovable vs Bolt.new vs v0 ― $400M vs $40M ARR Gap
                </div>
                <a
                  className={styles.refUrl}
                  href="https://tech-insider.org/au/lovable-vs-bolt-new-vs-v0-2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  tech-insider.org/au/lovable-vs-bolt-new-vs-v0-2026
                </a>
              </div>
            </li>
          </ul>

          <div className={styles.refGroupLabel}>Simon Willison / エージェント設計</div>
          <ul className={styles.refList}>
            <li className={styles.refCard} id="ref9">
              <div className={styles.refNum}>9</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  AI/TLDR: Simon Willison ― Vibe Coding and Agentic Engineering
                </div>
                <a
                  className={styles.refUrl}
                  href="https://ai-tldr.dev/releases/simon-willison-vibe-coding-agentic-engineering-may6/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ai-tldr.dev/releases/simon-willison-vibe-coding-agentic-engineering-may6
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref43">
              <div className={styles.refNum}>43</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Simon Willison's Newsletter: Agentic Engineering Patterns
                </div>
                <a
                  className={styles.refUrl}
                  href="https://simonw.substack.com/p/agentic-engineering-patterns"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  simonw.substack.com/p/agentic-engineering-patterns
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref44">
              <div className={styles.refNum}>44</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  AI/TLDR: Simon Willison ― lines of code count again, but…
                </div>
                <a
                  className={styles.refUrl}
                  href="https://ai-tldr.dev/releases/simonw-conceptual-integrity-aug19/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ai-tldr.dev/releases/simonw-conceptual-integrity-aug19
                </a>
              </div>
            </li>
          </ul>

          <div className={styles.refGroupLabel}>
            コード生成ツール(Cursor / Windsurf / Cognition)
          </div>
          <ul className={styles.refList}>
            <li className={styles.refCard} id="ref10">
              <div className={styles.refNum}>10</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  DEV Community: How to Build a Full-Stack App with an AI Coding Agent
                </div>
                <a
                  className={styles.refUrl}
                  href="https://dev.to/nickpe/how-to-build-a-full-stack-app-with-an-ai-coding-agent-9p9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  dev.to/nickpe/how-to-build-a-full-stack-app-with-an-ai-coding-agent-9p9
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref11">
              <div className={styles.refNum}>11</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  DeployHQ: Cursor 2026 ― Composer, Agent Mode, MCP & Background Agent
                </div>
                <a
                  className={styles.refUrl}
                  href="https://www.deployhq.com/guides/cursor"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  deployhq.com/guides/cursor
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref12">
              <div className={styles.refNum}>12</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  CodersEra: Cursor 3.5 in 2026 ― Latest Features, Pricing, Setup
                </div>
                <a
                  className={styles.refUrl}
                  href="https://codersera.com/blog/cursor-ide-complete-guide-2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  codersera.com/blog/cursor-ide-complete-guide-2026
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref13">
              <div className={styles.refNum}>13</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Cognition: Cognition's acquisition of Windsurf
                </div>
                <a
                  className={styles.refUrl}
                  href="https://cognition.com/blog/windsurf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cognition.com/blog/windsurf
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref14">
              <div className={styles.refNum}>14</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  NxCode: Cognition's $250M Windsurf Acquisition ― SWE-1.5, Codemaps
                </div>
                <a
                  className={styles.refUrl}
                  href="https://www.nxcode.io/resources/news/cognition-windsurf-acquisition-swe-1-5-codemaps-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  nxcode.io/resources/news/cognition-windsurf-acquisition-swe-1-5-codemaps-2026
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref15">
              <div className={styles.refNum}>15</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  TechCrunch: Cognition, maker of the AI coding agent Devin, acquires Windsurf
                </div>
                <a
                  className={styles.refUrl}
                  href="https://www.techcrunch.com/2025/07/14/cognition-maker-of-the-ai-coding-agent-devin-acquires-windsurf/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  techcrunch.com/2025/07/14/cognition-maker-of-the-ai-coding-agent-devin-acquires-windsurf
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref16">
              <div className={styles.refNum}>16</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Petronella Cybersecurity News: Cursor AI IDE 2026 ― Setup, Agents, Security Guide
                </div>
                <a
                  className={styles.refUrl}
                  href="https://petronellatech.com/blog/cursor-ai-ide-setup-guide/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  petronellatech.com/blog/cursor-ai-ide-setup-guide
                </a>
              </div>
            </li>
          </ul>

          <div className={styles.refGroupLabel}>AIコードレビュー</div>
          <ul className={styles.refList}>
            <li className={styles.refCard} id="ref21">
              <div className={styles.refNum}>21</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  BuildMVPFast: Best AI Code Review Tools 2026 ― Anthropic vs CodeRabbit vs Qodo
                </div>
                <a
                  className={styles.refUrl}
                  href="https://www.buildmvpfast.com/blog/best-ai-code-review-tools-anthropic-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  buildmvpfast.com/blog/best-ai-code-review-tools-anthropic-2026
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref22">
              <div className={styles.refNum}>22</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>Reptile: AI Code Review Has Gone Mainstream</div>
                <a
                  className={styles.refUrl}
                  href="https://reptile.haus/journal/ai-code-review-mainstream-adopt-without-losing-quality-2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  reptile.haus/journal/ai-code-review-mainstream-adopt-without-losing-quality-2026
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref23">
              <div className={styles.refNum}>23</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  IdeaPlan: AI Code Review Tools Market Share 2026
                </div>
                <a
                  className={styles.refUrl}
                  href="https://www.ideaplan.io/blog/ai-code-review-tools-market-share-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ideaplan.io/blog/ai-code-review-tools-market-share-2026
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref24">
              <div className={styles.refNum}>24</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>UC Strategies: CodeRabbit Review 2026</div>
                <a
                  className={styles.refUrl}
                  href="https://ucstrategies.com/news/coderabbit-review-2026-fast-ai-code-reviews-but-a-critical-gap-enterprises-cant-ignore/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ucstrategies.com/news/coderabbit-review-2026-fast-ai-code-reviews-but-a-critical-gap-enterprises-cant-ignore
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref25">
              <div className={styles.refNum}>25</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  AISO Tools: CodeRabbit Review 2026 ― Pricing, Features, Pros & Cons
                </div>
                <a
                  className={styles.refUrl}
                  href="https://aisotools.com/blog/coderabbit-review-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  aisotools.com/blog/coderabbit-review-2026
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref26">
              <div className={styles.refNum}>26</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>Verdent: Best AI for Code Review 2026</div>
                <a
                  className={styles.refUrl}
                  href="https://www.verdent.ai/guides/best-ai-for-code-review-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  verdent.ai/guides/best-ai-for-code-review-2026
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref45">
              <div className={styles.refNum}>45</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  CodeRabbit: State of AI vs Human Code Generation Report
                </div>
                <a
                  className={styles.refUrl}
                  href="https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report
                </a>
              </div>
            </li>
          </ul>

          <div className={styles.refGroupLabel}>AIテストツール</div>
          <ul className={styles.refList}>
            <li className={styles.refCard} id="ref27">
              <div className={styles.refNum}>27</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Momentic: Best AI Tools for Automated Software Testing in 2026
                </div>
                <a
                  className={styles.refUrl}
                  href="https://momentic.ai/blog/ai-test-automation-tools"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  momentic.ai/blog/ai-test-automation-tools
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref28">
              <div className={styles.refNum}>28</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  TestCollab: Best AI Testing Tools Compared 2026
                </div>
                <a
                  className={styles.refUrl}
                  href="https://testcollab.com/blog/ai-testing-tools"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  testcollab.com/blog/ai-testing-tools
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref29">
              <div className={styles.refNum}>29</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>TTMS: 10 Best AI Tools for Testers in 2026</div>
                <a
                  className={styles.refUrl}
                  href="https://ttms.com/10-best-ai-tools-for-testers/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ttms.com/10-best-ai-tools-for-testers
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref30">
              <div className={styles.refNum}>30</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  QASkills: Top 15 AI Testing Tools for QA Teams in 2026
                </div>
                <a
                  className={styles.refUrl}
                  href="https://qaskills.sh/blog/best-ai-testing-tools-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  qaskills.sh/blog/best-ai-testing-tools-2026
                </a>
              </div>
            </li>
          </ul>

          <div className={styles.refGroupLabel}>ドキュメント生成</div>
          <ul className={styles.refList}>
            <li className={styles.refCard} id="ref31">
              <div className={styles.refNum}>31</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Dualite: Code Documentation Best Practices in 2026
                </div>
                <a
                  className={styles.refUrl}
                  href="https://dualite.dev/blogs/code-documentation-best-practices"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  dualite.dev/blogs/code-documentation-best-practices
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref32">
              <div className={styles.refNum}>32</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  RockB: Best AI Documentation Generator Tools 2026
                </div>
                <a
                  className={styles.refUrl}
                  href="https://baeseokjae.github.io/posts/ai-documentation-generator-tools-2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  baeseokjae.github.io/posts/ai-documentation-generator-tools-2026
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref33">
              <div className={styles.refNum}>33</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  HappySupport: Auto Code Documentation ― 10 Tools That Generate Docs (2026)
                </div>
                <a
                  className={styles.refUrl}
                  href="https://happysupport.ai/blog/auto-code-documentation-tools"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  happysupport.ai/blog/auto-code-documentation-tools
                </a>
              </div>
            </li>
          </ul>

          <div className={styles.refGroupLabel}>チャットボット / LangChain・LangGraph</div>
          <ul className={styles.refList}>
            <li className={styles.refCard} id="ref34">
              <div className={styles.refNum}>34</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>NeuraPulse: LangChain AI Agent Tutorial 2026</div>
                <a
                  className={styles.refUrl}
                  href="https://neuraplus-ai.github.io/blog/langchain-ai-agent-tutorial-2026.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  neuraplus-ai.github.io/blog/langchain-ai-agent-tutorial-2026.html
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref35">
              <div className={styles.refNum}>35</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  ReleaseBot: LangChain Release Notes ― September 2026
                </div>
                <a
                  className={styles.refUrl}
                  href="https://releasebot.io/updates/langchain-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  releasebot.io/updates/langchain-ai
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref36">
              <div className={styles.refNum}>36</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Yaitec Solutions: LangChain vs LangGraph in 2026
                </div>
                <a
                  className={styles.refUrl}
                  href="https://www.yaitec.com/en/blog/langchain-vs-langgraph-frameworks-agentes-ai-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  yaitec.com/en/blog/langchain-vs-langgraph-frameworks-agentes-ai-2026
                </a>
              </div>
            </li>
          </ul>

          <div className={styles.refGroupLabel}>実装成功事例(Pieter Levels / Shopify)</div>
          <ul className={styles.refList}>
            <li className={styles.refCard} id="ref37">
              <div className={styles.refNum}>37</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  FindSkill.ai: Learn AI for Entrepreneurs ― The Solo Founder's 2026 Playbook
                </div>
                <a
                  className={styles.refUrl}
                  href="https://findskill.ai/learn-ai-for-entrepreneurs/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  findskill.ai/learn-ai-for-entrepreneurs
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref38">
              <div className={styles.refNum}>38</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Level Up Coding: One of the Most Successful Indie Hackers Says AI Killed the
                  Playbook
                </div>
                <a
                  className={styles.refUrl}
                  href="https://levelup.gitconnected.com/one-of-the-most-successful-indie-hackers-says-ai-killed-the-playbook-716f27f995ec"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  levelup.gitconnected.com/one-of-the-most-successful-indie-hackers-says-ai-killed-the-playbook-716f27f995ec
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref39">
              <div className={styles.refNum}>39</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Pieter Levels (levels.io): Indie hackers may be the first type of developer to go
                  extinct as AI lowers the cost of execution
                </div>
                <a
                  className={styles.refUrl}
                  href="https://levels.io/indie-hackers-first-to-go-extinct-with-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  levels.io/indie-hackers-first-to-go-extinct-with-ai
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref40">
              <div className={styles.refNum}>40</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  BetaKit: Shopify CEO Tobi Lütke tells employees to prove AI can't do the job
                  before asking for resources
                </div>
                <a
                  className={styles.refUrl}
                  href="https://betakit.com/shopify-ceo-tobi-lutke-tells-employees-to-prove-ai-cant-do-the-job-before-asking-for-resources/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  betakit.com/shopify-ceo-tobi-lutke-tells-employees-to-prove-ai-cant-do-the-job-before-asking-for-resources
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref41">
              <div className={styles.refNum}>41</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  CNBC: Shopify CEO says staffers need to prove jobs can't be done by AI before
                  asking for more headcount
                </div>
                <a
                  className={styles.refUrl}
                  href="https://www.cnbc.com/2025/04/07/shopify-ceo-prove-ai-cant-do-jobs-before-asking-for-more-headcount.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cnbc.com/2025/04/07/shopify-ceo-prove-ai-cant-do-jobs-before-asking-for-more-headcount.html
                </a>
              </div>
            </li>
            <li className={styles.refCard} id="ref42">
              <div className={styles.refNum}>42</div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  Marketing AI Institute: Shopify's CEO Just Issued a Bold AI Ultimatum to His
                  Entire Team
                </div>
                <a
                  className={styles.refUrl}
                  href="https://www.marketingaiinstitute.com/blog/shopify-ceo-ai-memo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  marketingaiinstitute.com/blog/shopify-ceo-ai-memo
                </a>
              </div>
            </li>
          </ul>

          <div className={styles.refGroupLabel}>原書情報</div>
          <ul className={styles.refList}>
            <li className={styles.refCard}>
              <div className={styles.refNum}>
                {" "}
                <i className="ti ti-book-2"></i>
              </div>
              <div className={styles.refBody}>
                <div className={styles.refTitle}>
                  O'Reilly: Generative AI for Software Development(Sergio Pereira 著)
                </div>
                <a
                  className={styles.refUrl}
                  href="https://www.oreilly.com/library/view/generative-ai-for/9781098162269/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  oreilly.com/library/view/generative-ai-for/9781098162269
                </a>
              </div>
            </li>
          </ul>
        </section>

        <footer>
          本ガイドは2026年9月14日時点の公開情報をもとに作成しています。AIツール業界は変化が非常に速いため、実際にツールを選定・導入する際は必ず各社公式サイトの最新情報をご確認ください。{" "}
          <br />
          <a className={styles.backTop} href="#top">
            {" "}
            <i className="ti ti-chevron-right" style={{ transform: "rotate(-90deg)" }}></i>
            トップに戻る
          </a>
        </footer>
      </main>
    </div>
  );
}
