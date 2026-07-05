import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata = {
  title: "skills.sh 完全ガイド ― AIエージェントを賢くする「Agent Skills」入門",
  description: "skills.shの仕組み、CLIの使い方、主要スキルの利用方法を初学者向けにステップバイステップで解説する技術ガイド",
};

const DIAGRAMS = {
  diagramProgressive: `flowchart TD
    A[エージェントが起動する] --> B["Tier 1: 全スキルの<br/>name + description のみ読み込む<br/>(1スキルあたり約30トークン程度)"]
    B --> C{ユーザーの依頼内容が<br/>いずれかのdescriptionと一致する?}
    C -- 一致しない --> E[通常の会話・処理を続行<br/>スキルは使わない]
    C -- 一致する --> D["Tier 2: 該当スキルの<br/>SKILL.md本文を読み込む<br/>(具体的な手順・ルール)"]
    D --> F{本文が追加ファイルを<br/>参照している?<br/>例: forms.md, validate.py}
    F -- 参照なし --> H[SKILL.mdの指示に従い<br/>タスクを実行]
    F -- 参照あり --> G["Tier 3: 参照された<br/>スクリプトや参考資料だけを<br/>bashコマンド等でその都度読み込む"]
    G --> H
    H --> I[結果をユーザーに返す]`,

  diagramEcosystem: `graph LR
    subgraph SRC[スキルの提供元 = GitHubリポジトリ]
        A1[anthropics/skills<br/>公式ドキュメント生成系]
        A2[vercel-labs/skills<br/>vercel-labs/agent-skills<br/>フロントエンド系]
        A3[supabase/agent-skills<br/>データベース系]
        A4[shadcn/ui<br/>UIコンポーネント系]
        A5[microsoft/azure-skills<br/>クラウド系]
        A6[obra/superpowers<br/>開発手法・思考法系]
    end

    subgraph HUB[skills.sh]
        B1[検索・ランキング<br/>カテゴリ別ディレクトリ]
        B2[セキュリティ監査<br/>Agent Trust Hub / Socket / Snyk]
        B3["CLI: npx skills"]
    end

    subgraph RUN[実行環境 = AIエージェント]
        C1[Claude Code]
        C2[Cursor]
        C3[Codex CLI]
        C4[GitHub Copilot]
        C5[Windsurf / Cline ほか]
    end

    A1 --> B1
    A2 --> B1
    A3 --> B1
    A4 --> B1
    A5 --> B1
    A6 --> B1
    B2 -.スキャン・格付け.-> B1
    B1 --> B3
    B3 -->|npx skills add| C1
    B3 -->|npx skills add| C2
    B3 -->|npx skills add| C3
    B3 -->|npx skills add| C4
    B3 -->|npx skills add| C5`,

  diagramInstallSequence: `sequenceDiagram
    participant U as ユーザー
    participant T as ターミナル(npx skills)
    participant GH as GitHubリポジトリ
    participant FS as ローカルのスキル格納フォルダ
    participant AG as AIエージェント

    U->>T: npx skills add anthropics/skills --skill pdf
    T->>GH: pdfスキルのファイル一式を取得
    GH-->>T: SKILL.md + scripts/ + reference.md
    T->>FS: エージェント用フォルダへ保存
    T-->>U: インストール完了
    Note over U,AG: ここで新しい会話を開始 or エージェント再起動
    U->>AG: 「このPDFのフォーム項目を抽出して」
    AG->>FS: 全スキルのdescriptionを走査(Tier1)
    FS-->>AG: pdfスキルのdescriptionが一致
    AG->>FS: SKILL.md本文を読み込む(Tier2)
    AG->>FS: 同梱のPythonスクリプトを実行(Tier3)
    FS-->>AG: スクリプトの実行結果のみ返却
    AG-->>U: 抽出結果を提示`,

  diagramCategoryMap: `graph TD
    ROOT[skills.sh 主要カテゴリ]
    ROOT --> CAT1[① エージェント運用<br/>Agent Workflows]
    ROOT --> CAT2[② デザイン & UI]
    ROOT --> CAT3[③ React / Next.js]
    ROOT --> CAT4[④ ドキュメント生成]
    ROOT --> CAT5[⑤ テスト]
    ROOT --> CAT6[⑥ データベース]
    ROOT --> CAT7[⑦ クラウド / DevOps]

    CAT1 --> S1[find-skills]
    CAT1 --> S2[skill-creator]
    CAT1 --> S3[agent-browser]
    CAT1 --> S4[superpowers系<br/>brainstorming等]

    CAT2 --> S5[frontend-design]
    CAT2 --> S6[web-design-guidelines]
    CAT2 --> S7[shadcn]

    CAT3 --> S8[vercel-react-best-practices]
    CAT3 --> S9[vercel-composition-patterns]

    CAT4 --> S10[pptx / docx / xlsx / pdf]

    CAT5 --> S11[webapp-testing]

    CAT6 --> S12[supabase-postgres-best-practices]

    CAT7 --> S13[microsoft-foundry<br/>azure-skills]`,

  diagramDecision: `flowchart TD
    Q{何をしたい?}
    Q -->|Webサイトの見た目・UIを改善したい| R1[frontend-design<br/>web-design-guidelines]
    Q -->|Word/PDF/Excel/PowerPointを操作したい| R2[docx / pdf / xlsx / pptx]
    Q -->|Reactアプリのパフォーマンスを最適化したい| R3[vercel-react-best-practices]
    Q -->|ブラウザを自動操作させたい| R4[agent-browser]
    Q -->|作ったWebアプリを自動テストしたい| R5[webapp-testing]
    Q -->|DB設計・SQLの品質を上げたい| R6[supabase-postgres-best-practices]
    Q -->|自分専用のスキルを作りたい| R7[skill-creator]
    Q -->|どんなスキルがあるか探したい| R8[find-skills]`,

  diagramSkillcreatorLoop: `flowchart LR
    A[1. 目的を1〜2行で言語化する] --> B[2. SKILL.mdのドラフトを書く<br/>name + description + 手順]
    B --> C[3. 実際にありそうな依頼文を<br/>テストケースとして複数用意する]
    C --> D[4. スキルあり/なしで<br/>エージェントの挙動を比較実行]
    D --> E[5. 結果を評価する<br/>期待通りに発火したか/手順通り動いたか]
    E --> F{品質は十分か?}
    F -- 不十分 --> G[6. descriptionや手順を<br/>フィードバックに基づき修正]
    G --> C
    F -- 十分 --> H[7. 公開/チーム共有<br/>あるいは自分用として保存]`,

  diagramSummarySteps: `flowchart LR
    A["① find-skillsを導入して<br/>ざっくり探してみる"] --> B["② 気になったスキルを<br/>npx skills add で1つ入れてみる"]
    B --> C["③ 実際にエージェントに<br/>関連する依頼をして発火を確認"]
    C --> D["④ 慣れてきたら<br/>skill-creatorで自作に挑戦"]`
};

export default function SkillsShGuidePage() {
  return (
    <div className={styles.pageContainer}>
      <TocObserver />
      <button className={styles.navToggle} id="navToggle" aria-label="メニューを開閉">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" role="img" aria-label="メニュー開閉アイコン">
          <title>メニュー開閉</title>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className={styles.layout}>
        <aside className={styles.sidebar} id="sidebar">
          <div className={styles.brand}>
            <div className={styles.brandMark}>S</div>
            <div className={styles.brandText}>
              <strong>skills.sh ガイド</strong>
              <span>Agent Skills 入門</span>
            </div>
          </div>

          <div className={styles.progressTrack}>
            <div className={styles.progressFill} id="progressFill" style={{ width: "0%" }}></div>
          </div>

          <nav>
            <div className={styles.navGroupLabel}>はじめに</div>
            <ul className={styles.toc}>
              <li className={styles.tocItem}>
                <a href="#sec-01" className={styles.tocLink}>
                  <span className={styles.tocNum}>01</span>skills.sh とは何か
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-02" className={styles.tocLink}>
                  <span className={styles.tocNum}>02</span>Agent Skills の基本概念
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-03" className={styles.tocLink}>
                  <span className={styles.tocNum}>03</span>SKILL.md のフォーマット
                </a>
              </li>
            </ul>

            <div className={styles.navGroupLabel}>全体像を掴む</div>
            <ul className={styles.toc}>
              <li className={styles.tocItem}>
                <a href="#sec-04" className={styles.tocLink}>
                  <span className={styles.tocNum}>04</span>エコシステム全体像
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-05" className={styles.tocLink}>
                  <span className={styles.tocNum}>05</span>CLI 実践ガイド
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-06" className={styles.tocLink}>
                  <span className={styles.tocNum}>06</span>カテゴリマップと選び方
                </a>
              </li>
            </ul>

            <div className={styles.navGroupLabel}>主要スキル</div>
            <ul className={styles.toc}>
              <li className={styles.tocItem}>
                <a href="#sec-07" className={styles.tocLink}>
                  <span className={styles.tocNum}>07</span>主要スキル徹底解説
                </a>
              </li>
            </ul>
            <ul className={styles.tocSub}>
              <li><a href="#skill-find-skills" className={styles.tocSubLink}>find-skills</a></li>
              <li><a href="#skill-skill-creator" className={styles.tocSubLink}>skill-creator</a></li>
              <li><a href="#skill-frontend-design" className={styles.tocSubLink}>frontend-design</a></li>
              <li><a href="#skill-web-design-guidelines" className={styles.tocSubLink}>web-design-guidelines</a></li>
              <li><a href="#skill-shadcn" className={styles.tocSubLink}>shadcn</a></li>
              <li><a href="#skill-vercel-react" className={styles.tocSubLink}>vercel-react-best-practices</a></li>
              <li><a href="#skill-agent-browser" className={styles.tocSubLink}>agent-browser</a></li>
              <li><a href="#skill-docs" className={styles.tocSubLink}>pptx / docx / xlsx / pdf</a></li>
              <li><a href="#skill-webapp-testing" className={styles.tocSubLink}>webapp-testing</a></li>
              <li><a href="#skill-supabase" className={styles.tocSubLink}>supabase-postgres</a></li>
              <li><a href="#skill-superpowers" className={styles.tocSubLink}>superpowers系</a></li>
              <li><a href="#skill-foundry" className={styles.tocSubLink}>microsoft-foundry</a></li>
            </ul>

            <div className={styles.navGroupLabel}>応用と安全性</div>
            <ul className={styles.toc}>
              <li className={styles.tocItem}>
                <a href="#sec-08" className={styles.tocLink}>
                  <span className={styles.tocNum}>08</span>対応AIエージェント
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-09" className={styles.tocLink}>
                  <span className={styles.tocNum}>09</span>セキュリティと監査
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-10" className={styles.tocLink}>
                  <span className={styles.tocNum}>10</span>自作スキルの作り方
                </a>
              </li>
            </ul>

            <div className={styles.navGroupLabel}>おわりに</div>
            <ul className={styles.toc}>
              <li className={styles.tocItem}>
                <a href="#sec-11" className={styles.tocLink}>
                  <span className={styles.tocNum}>11</span>まとめ:3ステップ
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-12" className={styles.tocLink}>
                  <span className={styles.tocNum}>12</span>参考URL一覧
                </a>
              </li>
            </ul>
          </nav>

          <div className={styles.sidebarFooter}>
            2026年7月時点の情報を基に作成。最新情報は<br />
            <a href="https://www.skills.sh/" target="_blank" rel="noopener noreferrer">
              skills.sh
            </a>
            本体でご確認ください。
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.contentInner}>
            <header className={styles.hero}>
              <span className={styles.heroEyebrow}>
                <span className={styles.dot}></span>TECHNICAL GUIDE ・ 初学者向け
              </span>
              <h1>skills.sh 完全ガイド<br />AIエージェントを賢くする「Agent Skills」入門</h1>
              <p className={styles.heroLede}>
                Claude Code や Cursor、Codex CLI などのAIコーディングエージェントに専門知識を追加する仕組み「Agent Skills」と、そのハブである skills.sh の使い方を、実際のCLIコマンド・図解付きでゼロから解説します。
              </p>
              <div className={styles.heroMeta}>
                <div className={styles.heroChip}>📚 <strong>全12章</strong>構成</div>
                <div className={styles.heroChip}>🧭 対象: <strong>Agent Skills初学者</strong></div>
                <div className={styles.heroChip}>🔗 参照元: <strong>skills.sh / Anthropic公式</strong></div>
                <div className={styles.heroChip}>🗓️ <strong>2026年7月</strong>時点の情報</div>
              </div>
            </header>

            <section className={styles.chapter} id="sec-01">
              <span className={styles.chapterEyebrow}>CHAPTER 01</span>
              <h2>skills.sh とは何か</h2>
              <div className={styles.prose}>
                <p>
                  <strong>skills.sh</strong> は、AIエージェント(Claude Code、Cursor、Codex CLI、GitHub Copilot など)に「専門知識」を追加で持たせるための拡張パッケージ = <strong>Agent Skills</strong> を検索・比較・インストールできる、GitHubリポジトリ横断型のディレクトリ(登録・検索サイト)です。
                </p>
                <p>
                  npm(JavaScriptのパッケージ)における <code>npmjs.com</code> のような立ち位置を、AIエージェント向けの「スキル」というパッケージ種別で提供していると考えるとイメージしやすいです。
                </p>
              </div>

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
                      <td>検索・発見</td>
                      <td>カテゴリ別・ランキング別にスキルを閲覧し、キーワードで検索できる</td>
                    </tr>
                    <tr>
                      <td>CLI配布</td>
                      <td>
                        <code>npx skills</code> コマンド一発でGitHub上のスキルをローカルにインストールできる
                      </td>
                    </tr>
                    <tr>
                      <td>セキュリティ監査</td>
                      <td>主要スキルに対し、複数の第三者機関によるコード監査結果を掲示している</td>
                    </tr>
                    <tr>
                      <td>ドキュメント</td>
                      <td>Agent Skills仕様の使い方、CLIリファレンス、FAQなどを提供</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={`${styles.callout} ${styles.note}`}>
                <div className={styles.calloutIcon}>i</div>
                <p>
                  <strong>重要:</strong> skills.sh自体がスキルを作っているわけではありません。GitHub上に公開された各社・各個人のスキルリポジトリ(Anthropic公式、Vercel、Supabase、Microsoft、個人開発者など)を横断的に集約・可視化している「ハブ」です。実体(コード)は各GitHubリポジトリ側にあり、インストール時にCLIがそこから直接ファイルを取得します。
                </p>
              </div>
            </section>

            <section className={styles.chapter} id="sec-02">
              <span className={styles.chapterEyebrow}>CHAPTER 02</span>
              <h2>そもそも「Agent Skills」とは何か</h2>

              <h3>一言で言うと</h3>
              <div className={styles.prose}>
                <p>
                  Agent Skills は、<strong>「指示書・スクリプト・参考資料をまとめたフォルダ」</strong>です。中身は基本的に <code>SKILL.md</code> という1つのMarkdownファイルと、必要に応じて付随するスクリプトや資料ファイルです。
                </p>
                <p>
                  Anthropicのエンジニアリングブログでは、スキルを作ることは「新しく入社したベテラン社員に渡すオンボーディング資料を作ること」に例えられています。エージェント自身(モデル)は再学習・ファインチューニングされるわけではなく、汎用的な能力を保ったまま、<strong>特定のタスクに対する「やり方」だけを外部から差し込む</strong>、という考え方です。
                </p>
              </div>

              <h3>なぜ生まれたのか</h3>
              <div className={styles.prose}>
                <ul>
                  <li>会話のたびに同じ手順・同じ社内ルールを説明し直すのは非効率</li>
                  <li>
                    かといって、すべてのツール定義やルールを常にプロンプトに詰め込むとコンテキストウィンドウ(トークン)を圧迫する
                  </li>
                  <li>
                    そこでAnthropicは「必要になったときだけ、必要な分だけ読み込む」= <strong>段階的開示(Progressive Disclosure)</strong> という設計を採用したスキル形式を考案
                  </li>
                </ul>
                <p>
                  この形式は現在、Anthropicだけでなく OpenAI の Codex CLI や Microsoft の GitHub Copilot などでも採用が進んでいる、いわば<strong>オープンな業界標準</strong>になりつつあります。
                </p>
              </div>

              <h3>段階的開示(Progressive Disclosure)の仕組み</h3>
              <div className={styles.prose}>
                <p>
                  Agent Skillsの最大の特徴は、スキルの中身を<strong>3つの層(Tier)</strong>に分けて、必要な層だけを順番に読み込む点です。
                </p>
              </div>

              <div className={styles.diagramCard}>
                <div className={styles.diagramTitle}>図1: 段階的開示(Progressive Disclosure)のフロー</div>
                <div className={styles.mermaidDiagram}>
                  <MermaidDiagram chart={DIAGRAMS.diagramProgressive} />
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>層(Tier)</th>
                      <th>読み込まれる内容</th>
                      <th>タイミング</th>
                      <th>目安コスト</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Tier 1</td>
                      <td>YAML frontmatterの <code>name</code> と <code>description</code></td>
                      <td>エージェント起動時に常に</td>
                      <td>スキル1つあたり約30トークン</td>
                    </tr>
                    <tr>
                      <td>Tier 2</td>
                      <td><code>SKILL.md</code> の本文(手順・ルール・注意点)</td>
                      <td>ユーザーの依頼がTier1のdescriptionと一致した時</td>
                      <td>数百〜数千トークン</td>
                    </tr>
                    <tr>
                      <td>Tier 3</td>
                      <td>同梱スクリプト・追加のMarkdown資料・テンプレート</td>
                      <td>Tier2の指示が参照した時のみ</td>
                      <td>必要な分だけ</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={`${styles.callout} ${styles.tip}`}>
                <div className={styles.calloutIcon}>✓</div>
                <p>
                  ポイントは、<strong>エージェントがフォルダの中身をあらかじめ全部覚えているわけではなく</strong>、Linuxのファイルシステムを操作するのと同じ感覚で、必要なファイルだけをその場で <code>cat</code> や <code>bash</code> で読みに行く、という設計になっていることです。これにより、数百個のスキルをインストールしていても、使わないスキルはほぼゼロコストで放置できます。
                </p>
              </div>
            </section>

            <section className={styles.chapter} id="sec-03">
              <span className={styles.chapterEyebrow}>CHAPTER 03</span>
              <h2>SKILL.md のフォーマットを理解する</h2>
              <div className={styles.prose}>
                <p>すべてのスキルは、最低限これだけの構造を持ちます。</p>
              </div>

              <div className={styles.codeBlock}>
                <div className={styles.codeLabel}>
                  <span>SKILL.md</span>
                  <div className={styles.dots}><span></span><span></span><span></span></div>
                </div>
                <pre>
                  <code className="language-yaml">
                    <div className={styles.codeLine}><span className={styles.cs}>---</span></div>
                    <div className={styles.codeLine}><span className={styles.ck}>name</span><span className={styles.cs}>: </span><span className={styles.cv}>my-skill-name</span></div>
                    <div className={styles.codeLine}><span className={styles.ck}>description</span><span className={styles.cs}>: </span><span className={styles.cv}>このスキルが何をするか、どんな時に使うべきかを明確に書く。</span></div>
                    <div className={styles.codeLine}><span className={styles.cv}>             エージェントはこの文章だけを見てスキルを使うか判断するため、</span></div>
                    <div className={styles.codeLine}><span className={styles.cv}>             ここの品質がスキルの「発火率」を左右する最重要項目。</span></div>
                    <div className={styles.codeLine}><span className={styles.cs}>---</span></div>
                    <div className={styles.codeLine}></div>
                    <div className={styles.codeLine}><span className={styles.ch}># My Skill Name</span></div>
                    <div className={styles.codeLine}></div>
                    <div className={styles.codeLine}><span className={styles.cm}>## 概要</span></div>
                    <div className={styles.codeLine}>このスキルの目的を1〜2段落で説明する。</div>
                    <div className={styles.codeLine}></div>
                    <div className={styles.codeLine}><span className={styles.cm}>## 手順</span></div>
                    <div className={styles.codeLine}>1. まず〇〇を確認する</div>
                    <div className={styles.codeLine}>2. 次に△△を実行する</div>
                    <div className={styles.codeLine}>3. 最後に□□を検証する</div>
                    <div className={styles.codeLine}></div>
                    <div className={styles.codeLine}><span className={styles.cm}>## 注意点</span></div>
                    <div className={styles.codeLine}>- こういうケースでは✕✕をしてはいけない</div>
                  </code>
                </pre>
              </div>

              <h3>必須フィールド</h3>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>フィールド</th>
                      <th>役割</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>name</code></td>
                      <td>
                        スキルの一意な識別子(ケバブケース推奨、例: <code>pdf-form-filler</code>)
                      </td>
                    </tr>
                    <tr>
                      <td><code>description</code></td>
                      <td>
                        <strong>最重要。</strong>エージェントがTier1の段階で読む唯一の情報。「何をするか」だけでなく「いつ使うべきか」までトリガーとなる言葉を具体的に書く必要がある
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>本文(Markdown部分)の書き方のコツ</h3>
              <div className={styles.prose}>
                <ul>
                  <li>手順は箇条書き・番号付きリストで明確に</li>
                  <li>
                    SKILL.md自体が長くなりすぎる場合は、別ファイル(例: <code>forms.md</code>, <code>reference.md</code>)に分割し、本文からリンクで参照する(= Tier 3として遅延読み込みされる)
                  </li>
                  <li>
                    「コードとして実行させたいスクリプト」と「読み込ませて理解させたいドキュメント」を明確に区別して書く(実行 vs 参照)
                  </li>
                </ul>
              </div>

              <h3>フォルダ構成の例</h3>
              <div className={styles.codeBlock}>
                <div className={styles.codeLabel}>
                  <span>folder structure</span>
                  <div className={styles.dots}><span></span><span></span><span></span></div>
                </div>
                <pre>
                  <code className="language-plaintext">
                    <div className={styles.codeLine}>my-skill/</div>
                    <div className={styles.codeLine}>├── SKILL.md          <span className={styles.cc}>← 必須。エントリーポイント</span></div>
                    <div className={styles.codeLine}>├── reference.md       <span className={styles.cc}>← 任意。詳細な参考資料(Tier 3)</span></div>
                    <div className={styles.codeLine}>├── scripts/</div>
                    <div className={styles.codeLine}>│   └── validate.py    <span className={styles.cc}>← 任意。エージェントがbashで実行するスクリプト</span></div>
                    <div className={styles.codeLine}>└── templates/</div>
                    <div className={styles.codeLine}>    └── example.docx   <span className={styles.cc}>← 任意。生成物のひな形など</span></div>
                  </code>
                </pre>
              </div>
            </section>

            <section className={styles.chapter} id="sec-04">
              <span className={styles.chapterEyebrow}>CHAPTER 04</span>
              <h2>skills.sh エコシステムの全体像</h2>
              <div className={styles.prose}>
                <p>
                  skills.sh を中心に、「どこでスキルが作られ」「どこに集約され」「どこで実行されるか」を図にすると次のようになります。
                </p>
              </div>

              <div className={styles.diagramCard}>
                <div className={styles.diagramTitle}>図2: skills.sh エコシステムマップ</div>
                <div className={styles.mermaidDiagram}>
                  <MermaidDiagram chart={DIAGRAMS.diagramEcosystem} />
                </div>
              </div>

              <div className={`${styles.callout} ${styles.note}`}>
                <div className={styles.calloutIcon}>i</div>
                <p>
                  重要なのは、<strong>skills.sh はあくまで「入口」であり、実体(コード)は各GitHubリポジトリ側にある</strong>という点です。インストール時にCLIがGitHubから直接ファイルを取得します。
                </p>
              </div>
            </section>

            <section className={styles.chapter} id="sec-05">
              <span className={styles.chapterEyebrow}>CHAPTER 05</span>
              <h2>CLI のインストールと使い方(ステップバイステップ)</h2>

              <div className={styles.stepFlow}>
                <div className={styles.stepItem}>
                  <h4>前提環境を確認する</h4>
                  <p>
                    Node.js が入っていれば追加インストール不要です(<code>npx</code> はnpmに同梱)。
                  </p>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeLabel}>
                      <span>bash</span>
                      <div className={styles.dots}><span></span><span></span><span></span></div>
                    </div>
                    <pre>
                      <code className="language-bash">
                        <div className={styles.codeLine}>node -v</div>
                        <div className={styles.codeLine}>npx --version</div>
                      </code>
                    </pre>
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <h4>気になるスキルをインストールする</h4>
                  <p>
                    skills.sh の各スキル詳細ページには、そのままコピペできるインストールコマンドが表示されています。基本形は次の2パターンです。
                  </p>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeLabel}>
                      <span>bash</span>
                      <div className={styles.dots}><span></span><span></span><span></span></div>
                    </div>
                    <pre>
                      <code className="language-bash">
                        <div className={styles.codeLine}><span className={styles.cc}># パターンA: リポジトリ全体(複数スキルをまとめて配布している場合)をインストール</span></div>
                        <div className={styles.codeLine}>npx skills add &lt;owner&gt;/&lt;repo&gt;</div>
                        <div className={styles.codeLine}></div>
                        <div className={styles.codeLine}><span className={styles.cc}># パターンB: リポジトリの中から特定の1スキルだけをインストール(最も一般的)</span></div>
                        <div className={styles.codeLine}>npx skills add &lt;owner&gt;/&lt;repo&gt; --skill &lt;skill-name&gt;</div>
                      </code>
                    </pre>
                  </div>
                  <p>具体例(<code>frontend-design</code> スキルの場合):</p>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeLabel}>
                      <span>bash</span>
                      <div className={styles.dots}><span></span><span></span><span></span></div>
                    </div>
                    <pre>
                      <code className="language-bash">
                        <div className={styles.codeLine}>npx skills add anthropics/skills --skill frontend-design</div>
                      </code>
                    </pre>
                  </div>
                  <p>フルURL形式で指定することもできます(スキル詳細ページに表示される正式な形式):</p>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeLabel}>
                      <span>bash</span>
                      <div className={styles.dots}><span></span><span></span><span></span></div>
                    </div>
                    <pre>
                      <code className="language-bash">
                        <div className={styles.codeLine}>npx skills add https://github.com/anthropics/skills --skill frontend-design</div>
                      </code>
                    </pre>
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <h4>スキルを探す(名前がわからない場合)</h4>
                  <p>
                    <code>find-skills</code> スキルを導入すると、エージェントに自然文で頼むだけでキーワード検索・インストールまで自動化できます。
                  </p>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeLabel}>
                      <span>bash</span>
                      <div className={styles.dots}><span></span><span></span><span></span></div>
                    </div>
                    <pre>
                      <code className="language-bash">
                        <div className={styles.codeLine}>npx skills add https://github.com/vercel-labs/skills --skill find-skills</div>
                      </code>
                    </pre>
                  </div>
                  <p>導入後は、Claude Codeなどのチャットで以下のように話しかけるだけで完結します。</p>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeLabel}>
                      <span>chat</span>
                      <div className={styles.dots}><span></span><span></span><span></span></div>
                    </div>
                    <pre>
                      <code className="language-plaintext">
                        <div className={styles.codeLine}>「Reactのパフォーマンスを改善するスキルを探してインストールして」</div>
                      </code>
                    </pre>
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <h4>エージェントに認識させる</h4>
                  <p>
                    インストールが完了すると、CLIはエージェントが参照するローカルのスキル格納フォルダ(エージェントの種類によって配置場所は異なります)に <code>SKILL.md</code> 一式をコピーします。多くの場合、<strong>エージェントを再起動する、または新しい会話を始めるだけ</strong>で自動的にTier1(name/description)がスキャンされ、以降のリクエストに応じて自動発火するようになります。
                  </p>
                  <p>
                    Claude Code の場合はプラグイン形式での導入にも対応しており、次のようなコマンドでマーケットプレイス経由の一括インストールも可能です(Anthropic公式スキルの場合)。
                  </p>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeLabel}>
                      <span>Claude Code</span>
                      <div className={styles.dots}><span></span><span></span><span></span></div>
                    </div>
                    <pre>
                      <code className="language-bash">
                        <div className={styles.codeLine}>/plugin install document-skills@anthropic-agent-skills</div>
                      </code>
                    </pre>
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <h4>匿名テレメトリを無効化したい場合(任意)</h4>
                  <p>
                    CLIはデフォルトでインストール状況などの匿名利用統計をskills.shへ送信します。送信したくない場合は環境変数で無効化できます。
                  </p>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeLabel}>
                      <span>bash</span>
                      <div className={styles.dots}><span></span><span></span><span></span></div>
                    </div>
                    <pre>
                      <code className="language-bash">
                        <div className={styles.codeLine}>DISABLE_TELEMETRY=1 npx skills add anthropics/skills --skill pdf</div>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>

              <h3>インストールから実行までの流れ(全体シーケンス)</h3>
              <div className={styles.diagramCard}>
                <div className={styles.diagramTitle}>図3: CLIインストール〜スキル発火までのシーケンス</div>
                <div className={styles.mermaidDiagram}>
                  <MermaidDiagram chart={DIAGRAMS.diagramInstallSequence} />
                </div>
              </div>
            </section>

            <section className={styles.chapter} id="sec-06">
              <span className={styles.chapterEyebrow}>CHAPTER 06</span>
              <h2>主要スキル カテゴリ別マップ</h2>
              <div className={styles.prose}>
                <p>
                  skills.sh に登録されているスキルは膨大な数がありますが、初学者がまず押さえておくべき代表的なものを7カテゴリに整理しました。
                </p>
              </div>

              <div className={styles.diagramCard}>
                <div className={styles.diagramTitle}>図4: 主要スキルのカテゴリマップ</div>
                <div className={styles.mermaidDiagram}>
                  <MermaidDiagram chart={DIAGRAMS.diagramCategoryMap} />
                </div>
              </div>

              <h3>どのスキルを選べばいいか迷ったときの早見表</h3>
              <div className={styles.diagramCard}>
                <div className={styles.diagramTitle}>図5: スキル選定フローチャート</div>
                <div className={styles.mermaidDiagram}>
                  <MermaidDiagram chart={DIAGRAMS.diagramDecision} />
                </div>
              </div>
            </section>

            <section className={styles.chapter} id="sec-07">
              <span className={styles.chapterEyebrow}>CHAPTER 07</span>
              <h2>主要スキル 徹底解説</h2>
              <div className={styles.prose}>
                <p>
                  ここからは、実際にskills.shのランキング上位・代表格となっているスキルを1つずつ、<strong>「何をするか」「いつ使うか」「インストール方法」</strong>の3点セットで解説します。
                </p>
              </div>

              <div className={styles.skillCard} id="skill-find-skills">
                <div className={styles.skillCardHead}>
                  <h3>7-1. find-skills ― スキルを探すためのスキル</h3>
                  <span className={styles.skillBadge}>エージェント運用</span>
                </div>
                <div className={styles.skillRepo}>
                  提供元: <code>vercel-labs/skills</code> ・ カテゴリ: エージェント運用
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>できること</td>
                        <td>
                          ユーザーの自然文の依頼から必要なスキルをキーワード検索し、その場でインストールまで行う、いわば「メタスキル」
                        </td>
                      </tr>
                      <tr>
                        <td>こんな時に使う</td>
                        <td>
                          「〇〇をしたいけど、どのスキルを入れればいいかわからない」という入り口の段階
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.codeBlock}>
                  <div className={styles.codeLabel}>
                    <span>install</span>
                    <div className={styles.dots}><span></span><span></span><span></span></div>
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>npx skills add https://github.com/vercel-labs/skills --skill find-skills</div>
                    </code>
                  </pre>
                </div>
                <div className={`${styles.callout} ${styles.tip}`}>
                  <div className={styles.callIcon}>✓</div>
                  <p>
                    導入後は、エージェントに「〇〇のためのスキルを探して」と話しかけるだけで、検索からインストールまでを自動化できます。他のすべてのスキルの入り口として、最初に入れておくと便利な1本です。
                  </p>
                </div>
              </div>

              <div className={styles.skillCard} id="skill-skill-creator">
                <div className={styles.skillCardHead}>
                  <h3>7-2. skill-creator ― スキルを作るためのスキル</h3>
                  <span className={styles.skillBadge}>エージェント運用</span>
                </div>
                <div className={styles.skillRepo}>
                  提供元: <code>anthropics/skills</code> ・ カテゴリ: エージェント運用
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>できること</td>
                        <td>
                          Anthropicのベストプラクティスに沿った <code>SKILL.md</code> の雛形生成、トリガー精度(description)の評価、反復改善までを支援
                        </td>
                      </tr>
                      <tr>
                        <td>こんな時に使う</td>
                        <td>
                          社内ルールや個人のワークフローを、自分専用のスキルとして固定化・再利用したいとき
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.codeBlock}>
                  <div className={styles.codeLabel}>
                    <span>install</span>
                    <div className={styles.dots}><span></span><span></span><span></span></div>
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>npx skills add anthropics/skills --skill skill-creator</div>
                    </code>
                  </pre>
                </div>
                <div className={`${styles.callout} ${styles.note}`}>
                  <div className={styles.calloutIcon}>i</div>
                  <p>
                    詳しい使い方は <a href="#sec-10">第10章「自作スキルの作り方」</a> で解説します。
                  </p>
                </div>
              </div>

              <div className={styles.skillCard} id="skill-frontend-design">
                <div className={styles.skillCardHead}>
                  <h3>7-3. frontend-design ― フロントエンドの意匠設計</h3>
                  <span className={styles.skillBadge}>デザイン & UI</span>
                </div>
                <div className={styles.skillRepo}>
                  提供元: <code>anthropics/skills</code> ・ カテゴリ: デザイン & UI
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>できること</td>
                        <td>
                          新規UIを作る、または既存UIを作り直す際に、「テンプレート感の出ない」意図的なビジュアル方向性・タイポグラフィ・配色などの判断基準をエージェントに与える
                        </td>
                      </tr>
                      <tr>
                        <td>こんな時に使う</td>
                        <td>
                          「なんとなくAIっぽい/量産型に見えるUI」から脱却し、独自性のあるデザインをコーディングエージェントに作らせたいとき
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.codeBlock}>
                  <div className={styles.codeLabel}>
                    <span>install</span>
                    <div className={styles.dots}><span></span><span></span><span></span></div>
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>npx skills add anthropics/skills --skill frontend-design</div>
                    </code>
                  </pre>
                </div>
              </div>

              <div className={styles.skillCard} id="skill-web-design-guidelines">
                <div className={styles.skillCardHead}>
                  <h3>7-4. web-design-guidelines ― Webデザインの一般原則</h3>
                  <span className={styles.skillBadge}>デザイン & UI</span>
                </div>
                <div className={styles.skillRepo}>
                  提供元: <code>vercel-labs/agent-skills</code> ・ カテゴリ: デザイン & UI
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>できること</td>
                        <td>
                          余白・階層構造・可読性・アクセシビリティなど、Webデザインの普遍的な原則をチェックリストとしてエージェントに参照させる
                        </td>
                      </tr>
                      <tr>
                        <td>こんな時に使う</td>
                        <td>
                          frontend-designと組み合わせて、デザインの「独自性」だけでなく「基本品質」も担保したいとき
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.codeBlock}>
                  <div className={styles.codeLabel}>
                    <span>install</span>
                    <div className={styles.dots}><span></span><span></span><span></span></div>
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines</div>
                    </code>
                  </pre>
                </div>
              </div>

              <div className={styles.skillCard} id="skill-shadcn">
                <div className={styles.skillCardHead}>
                  <h3>7-5. shadcn ― UIコンポーネントライブラリ連携</h3>
                  <span className={styles.skillBadge}>デザイン & UI / React</span>
                </div>
                <div className={styles.skillRepo}>
                  提供元: <code>shadcn/ui</code> ・ カテゴリ: デザイン & UI / React
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>できること</td>
                        <td>
                          shadcn/ui のコンポーネント(Button, Dialog, Formなど)を正しい作法でエージェントに導入・カスタマイズさせる
                        </td>
                      </tr>
                      <tr>
                        <td>こんな時に使う</td>
                        <td>Reactプロジェクトでshadcn/uiベースのUIを構築・拡張したいとき</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.codeBlock}>
                  <div className={styles.codeLabel}>
                    <span>install</span>
                    <div className={styles.dots}><span></span><span></span><span></span></div>
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>npx skills add shadcn/ui --skill shadcn</div>
                    </code>
                  </pre>
                </div>
              </div>

              <div className={styles.skillCard} id="skill-vercel-react">
                <div className={styles.skillCardHead}>
                  <h3>7-6. vercel-react-best-practices / vercel-composition-patterns</h3>
                  <span className={styles.skillBadge}>React / Next.js</span>
                </div>
                <div className={styles.skillRepo}>
                  提供元: <code>vercel-labs/agent-skills</code> ・ カテゴリ: React / Next.js
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>できること</td>
                        <td>
                          不要な再レンダリングの回避、Server Components/Client Componentsの適切な使い分け、コンポーネント分割パターンなど、Vercelが推奨するReact設計指針をエージェントに適用させる
                        </td>
                      </tr>
                      <tr>
                        <td>こんな時に使う</td>
                        <td>
                          Next.js/Reactアプリのコードレビューやリファクタリングをエージェントに任せるとき
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.codeBlock}>
                  <div className={styles.codeLabel}>
                    <span>install</span>
                    <div className={styles.dots}><span></span><span></span><span></span></div>
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices</div>
                      <div className={styles.codeLine}>npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-composition-patterns</div>
                    </code>
                  </pre>
                </div>
              </div>

              <div className={styles.skillCard} id="skill-agent-browser">
                <div className={styles.skillCardHead}>
                  <h3>7-7. agent-browser ― ブラウザ自動操作</h3>
                  <span className={styles.skillBadge}>エージェント運用 / テスト</span>
                </div>
                <div className={styles.skillRepo}>
                  提供元: <code>vercel-labs/agent-browser</code> ・ カテゴリ: エージェント運用 / テスト
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>できること</td>
                        <td>
                          エージェントに実ブラウザを操作させ、画面のクリック・入力・スクリーンショット取得・動作確認などを行わせる
                        </td>
                      </tr>
                      <tr>
                        <td>こんな時に使う</td>
                        <td>
                          作ったWebアプリを実際にブラウザで動かして目視確認・デバッグさせたいとき
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.codeBlock}>
                  <div className={styles.codeLabel}>
                    <span>install</span>
                    <div className={styles.dots}><span></span><span></span><span></span></div>
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>npx skills add https://github.com/vercel-labs/agent-browser --skill agent-browser</div>
                    </code>
                  </pre>
                </div>
              </div>

              <div className={styles.skillCard} id="skill-docs">
                <div className={styles.skillCardHead}>
                  <h3>7-8. Anthropic公式ドキュメント生成スキル群(pptx / docx / xlsx / pdf)</h3>
                  <span className={styles.skillBadge}>ドキュメント生成</span>
                </div>
                <div className={styles.skillRepo}>
                  提供元: <code>anthropics/skills</code> ・ カテゴリ: ドキュメント生成
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>できること</td>
                        <td>
                          PowerPoint・Word・Excel・PDFファイルの<strong>実際に開けるバイナリファイル</strong>を、テキスト説明ではなく生成物として作成・編集する
                        </td>
                      </tr>
                      <tr>
                        <td>こんな時に使う</td>
                        <td>
                          「報告書をWordで」「決算資料をExcelで」といった、成果物がオフィス文書そのものであるとき
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.codeBlock}>
                  <div className={styles.codeLabel}>
                    <span>install</span>
                    <div className={styles.dots}><span></span><span></span><span></span></div>
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>npx skills add anthropics/skills --skill pptx</div>
                      <div className={styles.codeLine}>npx skills add anthropics/skills --skill docx</div>
                      <div className={styles.codeLine}>npx skills add anthropics/skills --skill xlsx</div>
                      <div className={styles.codeLine}>npx skills add anthropics/skills --skill pdf</div>
                    </code>
                  </pre>
                </div>
                <div className={`${styles.callout} ${styles.note}`}>
                  <div className={styles.calloutIcon}>i</div>
                  <p>
                    補足: Claude.aiの有料プランでは、これらのドキュメント生成スキルは追加インストールなしで既定で使えるようになっています。
                  </p>
                </div>
              </div>

              <div className={styles.skillCard} id="skill-webapp-testing">
                <div className={styles.skillCardHead}>
                  <h3>7-9. webapp-testing ― Webアプリの自動テスト</h3>
                  <span className={styles.skillBadge}>テスト</span>
                </div>
                <div className={styles.skillRepo}>
                  提供元: <code>anthropics/skills</code> ・ カテゴリ: テスト
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>できること</td>
                        <td>
                          実装したWebアプリに対して、実ブラウザ相当の環境で動作確認・回帰テストのシナリオを組み立てて実行させる
                        </td>
                      </tr>
                      <tr>
                        <td>こんな時に使う</td>
                        <td>
                          実装が完了した機能について、「ちゃんと動くか」をエージェント自身に検証させたいとき
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.codeBlock}>
                  <div className={styles.codeLabel}>
                    <span>install</span>
                    <div className={styles.dots}><span></span><span></span><span></span></div>
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>npx skills add anthropics/skills --skill webapp-testing</div>
                    </code>
                  </pre>
                </div>
              </div>

              <div className={styles.skillCard} id="skill-supabase">
                <div className={styles.skillCardHead}>
                  <h3>7-10. supabase-postgres-best-practices ― DB設計・SQL品質</h3>
                  <span className={styles.skillBadge}>データベース</span>
                </div>
                <div className={styles.skillRepo}>
                  提供元: <code>supabase/agent-skills</code> ・ カテゴリ: データベース
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>できること</td>
                        <td>
                          PostgreSQL(Supabase)のスキーマ設計、インデックス設計、Row Level Security(RLS)などのベストプラクティスをエージェントに適用させる
                        </td>
                      </tr>
                      <tr>
                        <td>こんな時に使う</td>
                        <td>
                          Supabase/PostgreSQLベースのバックエンド設計・マイグレーションをエージェントにレビューさせたいとき
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.codeBlock}>
                  <div className={styles.codeLabel}>
                    <span>install</span>
                    <div className={styles.dots}><span></span><span></span><span></span></div>
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>npx skills add https://github.com/supabase/agent-skills --skill supabase-postgres-best-practices</div>
                    </code>
                  </pre>
                </div>
              </div>

              <div className={styles.skillCard} id="skill-superpowers">
                <div className={styles.skillCardHead}>
                  <h3>7-11. superpowers系 ― 開発方法論・思考の型</h3>
                  <span className={styles.skillBadge}>エージェント運用</span>
                </div>
                <div className={styles.skillRepo}>
                  提供元: <code>obra/superpowers</code> ・ カテゴリ: エージェント運用
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>できること</td>
                        <td>
                          <code>brainstorming</code>(発散的思考の型)、<code>systematic-debugging</code>(体系的なデバッグ手順)など、特定の技術領域ではなく「進め方・考え方」そのものをスキル化したもの
                        </td>
                      </tr>
                      <tr>
                        <td>こんな時に使う</td>
                        <td>
                          個別ツールの使い方ではなく、エージェントの思考プロセス自体をより体系立てたいとき
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.codeBlock}>
                  <div className={styles.codeLabel}>
                    <span>install</span>
                    <div className={styles.dots}><span></span><span></span><span></span></div>
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>npx skills add cobra/superpowers --skill brainstorming</div>
                      <div className={styles.codeLine}>npx skills add cobra/superpowers --skill systematic-debugging</div>
                    </code>
                  </pre>
                </div>
              </div>

              <div className={styles.skillCard} id="skill-foundry">
                <div className={styles.skillCardHead}>
                  <h3>7-12. microsoft-foundry / azure-skills ― クラウド・エンタープライズ</h3>
                  <span className={styles.skillBadge}>クラウド / DevOps</span>
                </div>
                <div className={styles.skillRepo}>
                  提供元: <code>microsoft/azure-skills</code> ・ カテゴリ: クラウド / DevOps
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>できること</td>
                        <td>
                          Microsoft Foundry(Azure上のAnthropicホスティング環境)を利用する際の設定・デプロイ手順をエージェントに適用させる
                        </td>
                      </tr>
                      <tr>
                        <td>こんな時に使う</td>
                        <td>Azure環境でClaudeベースのエージェントを構築・運用するとき</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.codeBlock}>
                  <div className={styles.codeLabel}>
                    <span>install</span>
                    <div className={styles.dots}><span></span><span></span><span></span></div>
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>npx skills add microsoft/azure-skills --skill microsoft-foundry</div>
                    </code>
                  </pre>
                </div>
              </div>
            </section>

            <section className={styles.chapter} id="sec-08">
              <span className={styles.chapterEyebrow}>CHAPTER 08</span>
              <h2>対応しているAIエージェント</h2>
              <div className={styles.prose}>
                <p>
                  Agent Skills はオープンな仕様であるため、Claude系だけでなく複数のエージェント/IDEで利用が広がっています。skills.sh 上では、エージェントごとの対応状況ページも用意されています。
                </p>
              </div>

              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>エージェント</th>
                      <th>タイプ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Claude Code</td>
                      <td>CLI型コーディングエージェント(Anthropic)</td>
                    </tr>
                    <tr>
                      <td>Cursor</td>
                      <td>IDE統合型エージェント</td>
                    </tr>
                    <tr>
                      <td>Codex CLI</td>
                      <td>OpenAIのコーディングエージェント</td>
                    </tr>
                    <tr>
                      <td>GitHub Copilot</td>
                      <td>IDE統合型エージェント(Microsoft)</td>
                    </tr>
                    <tr>
                      <td>Windsurf</td>
                      <td>IDE統合型エージェント</td>
                    </tr>
                    <tr>
                      <td>Cline</td>
                      <td>VS Code拡張型エージェント</td>
                    </tr>
                    <tr>
                      <td>Gemini CLI</td>
                      <td>Googleのコーディングエージェント</td>
                    </tr>
                    <tr>
                      <td>OpenCode / Roo / Trae / Zed など</td>
                      <td>その他のオープンソース/独立系エージェント</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={`${styles.callout} ${styles.warn}`}>
                <div className={styles.calloutIcon}>!</div>
                <p>
                  <strong>注意点:</strong> エージェントの種類によって「スキルフォルダの配置場所」や「発見(discovery)の仕組み」に細かな違いがあります。同じ <code>SKILL.md</code> を複数のエージェントで使い回せることが「オープン標準」としての強みですが、導入時は各エージェントの公式ドキュメントで配置パスを確認するのが確実です。
                </p>
              </div>
            </section>

            <section className={styles.chapter} id="sec-09">
              <span className={styles.chapterEyebrow}>CHAPTER 09</span>
              <h2>セキュリティと監査の仕組み</h2>
              <div className={styles.prose}>
                <p>
                  スキルは「指示書」であると同時に、<strong>スクリプトを実行する権限をエージェントに与えるもの</strong>でもあります。裏を返せば、悪意あるスキルを不用意にインストールすると、想定外のコマンド実行やデータの持ち出し(exfiltration)につながるリスクがあります。
                </p>
              </div>

              <h3>skills.sh が提供する監査情報</h3>
              <div className={styles.prose}>
                <p>
                  skills.sh には <code>/audits</code> ページがあり、登録されている主要スキルについて、複数の第三者セキュリティ機関による静的スキャン結果(安全度のレーティング)を確認できます。監査は継続的に実施されており、既知の危険パターン(不審なネットワーク呼び出し、認証情報へのアクセスなど)を機械的にチェックしています。
                </p>
              </div>

              <h3>Anthropic公式が推奨する自衛策</h3>
              <div className={styles.prose}>
                <ul>
                  <li>
                    <strong>信頼できる提供元のスキルだけを使う</strong>(自作、またはAnthropic公式)
                  </li>
                  <li>
                    出所不明のスキルを使う場合は、<code>SKILL.md</code> 本文・同梱スクリプト・画像・参考資料まで<strong>すべて目視で確認</strong>する
                  </li>
                  <li>
                    想定外のネットワーク呼び出しや、スキルの説明と矛盾する挙動(ファイルアクセスパターンなど)がないか確認する
                  </li>
                  <li>本番環境で使う場合は特に、機密データの取り扱いに注意する</li>
                </ul>
              </div>

              <h3>実務でのチェックリスト</h3>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>チェック項目</th>
                      <th>確認方法</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>提供元は信頼できるか</td>
                      <td>公式組織(Anthropic/Vercel/Supabaseなど)か、実績のある個人か</td>
                    </tr>
                    <tr>
                      <td>skills.shの監査結果は良好か</td>
                      <td><code>/audits</code> ページのレーティングを確認</td>
                    </tr>
                    <tr>
                      <td>SKILL.md本文を読んだか</td>
                      <td>指示内容が説明(description)と矛盾していないか</td>
                    </tr>
                    <tr>
                      <td>同梱スクリプトを読んだか</td>
                      <td>外部通信・認証情報アクセスの有無を確認</td>
                    </tr>
                    <tr>
                      <td>インストール数・更新頻度は妥当か</td>
                      <td>極端に新しい/更新が止まっているものは慎重に</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className={styles.chapter} id="sec-10">
              <span className={styles.chapterEyebrow}>CHAPTER 10</span>
              <h2>自分だけのスキルを作る(skill-creator活用法)</h2>
              <div className={styles.prose}>
                <p>
                  既存スキルに満足できない、あるいは社内独自のルールをスキル化したい場合は <code>skill-creator</code> を使います。基本的な進め方は次のループです。
                </p>
              </div>

              <div className={styles.diagramCard}>
                <div className={styles.diagramTitle}>図6: スキル自作のワークフロー</div>
                <div className={styles.mermaidDiagram}>
                  <MermaidDiagram chart={DIAGRAMS.diagramSkillcreatorLoop} />
                </div>
              </div>

              <h3>導入コマンド</h3>
              <div className={styles.codeBlock}>
                <div className={styles.codeLabel}>
                  <span>bash</span>
                  <div className={styles.dots}><span></span><span></span><span></span></div>
                </div>
                <pre>
                  <code className="language-bash">
                    <div className={styles.codeLine}>npx skills add anthropics/skills --skill skill-creator</div>
                  </code>
                </pre>
              </div>

              <h3>作成時のベストプラクティス(Anthropic公式ブログより要約)</h3>
              <div className={styles.stepFlow}>
                <div className={styles.stepItem}>
                  <h4>評価から始める</h4>
                  <p>
                    まず既存のエージェントに代表的なタスクをやらせてみて、どこで詰まるか・情報不足になるかを observe する
                  </p>
                </div>
                <div className={styles.stepItem}>
                  <h4>description に全力を注ぐ</h4>
                  <p>
                    Tier1で読まれるのはこの一文だけなので、「何を」「いつ」使うかが明確に伝わる書き方をする
                  </p>
                </div>
                <div className={styles.stepItem}>
                  <h4>肥大化したら分割する</h4>
                  <p>
                    SKILL.md本文が長くなりすぎたら、参考資料を別ファイルに切り出し、Tier3として遅延読み込みさせる
                  </p>
                </div>
                <div className={styles.stepItem}>
                  <h4>実行させたいのか読ませたいのか区別する</h4>
                  <p>
                    決定的な処理(ソートやバリデーションなど)はスクリプトとして実行させ、判断が必要な部分だけを自然文の指示にする
                  </p>
                </div>
                <div className={styles.stepItem}>
                  <h4>他のスキルとの共存を前提にする</h4>
                  <p>
                    1つのタスクに複数のスキルが同時に有効な場合もあるため、自分のスキルだけが動くことを前提に書かない
                  </p>
                </div>
              </div>
            </section>

            <hr className={styles.divider} />

            <section className={styles.chapter} id="sec-11">
              <span className={styles.chapterEyebrow}>CHAPTER 11</span>
              <h2>まとめ:今日から始める3ステップ</h2>

              <div className={styles.diagramCard}>
                <div className={styles.diagramTitle}>図7: 導入から自作までのロードマップ</div>
                <div className={styles.mermaidDiagram}>
                  <MermaidDiagram chart={DIAGRAMS.diagramSummarySteps} />
                </div>
              </div>

              <div className={styles.codeBlock}>
                <div className={styles.codeLabel}>
                  <span>bash</span>
                  <div className={styles.dots}><span></span><span></span><span></span></div>
                </div>
                <pre>
                  <code className="language-bash">
                    <div className={styles.codeLine}><span className={styles.cc}># ステップ1: 検索用スキルを入れる</span></div>
                    <div className={styles.codeLine}>npx skills add https://github.com/vercel-labs/skills --skill find-skills</div>
                    <div className={styles.codeLine}></div>
                    <div className={styles.codeLine}><span className={styles.cc}># ステップ2: 興味のあるスキルを1つ入れてみる(例: フロントエンド設計)</span></div>
                    <div className={styles.codeLine}>npx skills add anthropics/skills --skill frontend-design</div>
                    <div className={styles.codeLine}></div>
                    <div className={styles.codeLine}><span className={styles.cc}># ステップ3: エージェントに関連の依頼をして、実際に使われるか確認する</span></div>
                  </code>
                </pre>
              </div>

              <div className={`${styles.callout} ${styles.tip}`}>
                <div className={styles.calloutIcon}>✓</div>
                <p>
                  Agent Skills は「モデルを賢くする」のではなく、<strong>「エージェントに正しい手順書を渡す」</strong>ための仕組みです。まずは自分の日常業務で繰り返している作業を1つ思い浮かべ、それに近いスキルをskills.shで探すところから始めるのが、最も理解が早い入り口です。
                </p>
              </div>
            </section>

            <section className={styles.chapter} id="sec-12">
              <span className={styles.chapterEyebrow}>CHAPTER 12</span>
              <h2>参考URL一覧</h2>

              <h3>skills.sh 本体</h3>
              <ul className={styles.refList}>
                <li>
                  <span className={styles.refLabel}>skills.sh トップページ</span>
                  <a className={styles.refUrl} href="https://www.skills.sh/" target="_blank" rel="noopener noreferrer">
                    https://www.skills.sh/
                  </a>
                </li>
                <li>
                  <span className={styles.refLabel}>ドキュメント</span>
                  <a className={styles.refUrl} href="https://www.skills.sh/docs" target="_blank" rel="noopener noreferrer">
                    https://www.skills.sh/docs
                  </a>
                </li>
                <li>
                  <span className={styles.refLabel}>CLIリファレンス</span>
                  <a className={styles.refUrl} href="https://www.skills.sh/docs/cli" target="_blank" rel="noopener noreferrer">
                    https://www.skills.sh/docs/cli
                  </a>
                </li>
                <li>
                  <span className={styles.refLabel}>FAQ</span>
                  <a className={styles.refUrl} href="https://www.skills.sh/docs/faq" target="_blank" rel="noopener noreferrer">
                    https://www.skills.sh/docs/faq
                  </a>
                </li>
                <li>
                  <span className={styles.refLabel}>セキュリティ監査ページ</span>
                  <a className={styles.refUrl} href="https://www.skills.sh/audits" target="_blank" rel="noopener noreferrer">
                    https://www.skills.sh/audits
                  </a>
                </li>
              </ul>

              <h3>本ガイドで扱った主要スキルの詳細ページ</h3>
              <ul className={styles.refList}>
                <li>
                  <span className={styles.refLabel}>find-skills</span>
                  <a className={styles.refUrl} href="https://www.skills.sh/vercel-labs/skills/find-skills" target="_blank" rel="noopener noreferrer">
                    https://www.skills.sh/vercel-labs/skills/find-skills
                  </a>
                </li>
                <li>
                  <span className={styles.refLabel}>skill-creator</span>
                  <a className={styles.refUrl} href="https://www.skills.sh/anthropics/skills/skill-creator" target="_blank" rel="noopener noreferrer">
                    https://www.skills.sh/anthropics/skills/skill-creator
                  </a>
                </li>
                <li>
                  <span className={styles.refLabel}>frontend-design</span>
                  <a className={styles.refUrl} href="https://www.skills.sh/anthropics/skills/frontend-design" target="_blank" rel="noopener noreferrer">
                    https://www.skills.sh/anthropics/skills/frontend-design
                  </a>
                </li>
                <li>
                  <span className={styles.refLabel}>web-design-guidelines</span>
                  <a className={styles.refUrl} href="https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines" target="_blank" rel="noopener noreferrer">
                    https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines
                  </a>
                </li>
                <li>
                  <span className={styles.refLabel}>shadcn</span>
                  <a className={styles.refUrl} href="https://www.skills.sh/shadcn/ui/shadcn" target="_blank" rel="noopener noreferrer">
                    https://www.skills.sh/shadcn/ui/shadcn
                  </a>
                </li>
                <li>
                  <span className={styles.refLabel}>agent-browser</span>
                  <a className={styles.refUrl} href="https://www.skills.sh/vercel-labs/agent-browser/agent-browser" target="_blank" rel="noopener noreferrer">
                    https://www.skills.sh/vercel-labs/agent-browser/agent-browser
                  </a>
                </li>
                <li>
                  <span className={styles.refLabel}>supabase-postgres-best-practices</span>
                  <a className={styles.refUrl} href="https://www.skills.sh/supabase/agent-skills/supabase-postgres-best-practices" target="_blank" rel="noopener noreferrer">
                    https://www.skills.sh/supabase/agent-skills/supabase-postgres-best-practices
                  </a>
                </li>
              </ul>

              <h3>元となるGitHubリポジトリ</h3>
              <ul className={styles.refList}>
                <li>
                  <span className={styles.refLabel}>anthropics/skills</span>
                  <a className={styles.refUrl} href="https://github.com/anthropics/skills" target="_blank" rel="noopener noreferrer">
                    https://github.com/anthropics/skills
                  </a>
                </li>
                <li>
                  <span className={styles.refLabel}>vercel-labs/skills</span>
                  <a className={styles.refUrl} href="https://github.com/vercel-labs/skills" target="_blank" rel="noopener noreferrer">
                    https://github.com/vercel-labs/skills
                  </a>
                </li>
              </ul>

              <h3>Anthropic公式ドキュメント・エンジニアリングブログ</h3>
              <ul className={styles.refList}>
                <li>
                  <span className={styles.refLabel}>Agent Skillsの設計思想(エンジニアリングブログ)</span>
                  <a className={styles.refUrl} href="https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills" target="_blank" rel="noopener noreferrer">
                    https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
                  </a>
                </li>
                <li>
                  <span className={styles.refLabel}>Agent Skills 公式ドキュメント(Claude Platform Docs)</span>
                  <a className={styles.refUrl} href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview" target="_blank" rel="noopener noreferrer">
                    https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
                  </a>
                </li>
              </ul>
            </section>

            <footer className={styles.pageFooter}>
              本ガイドは2026年7月時点でskills.shおよび関連公式ドキュメントを参照して作成しました。エコシステムは急速に拡大しているため、最新のスキル一覧・カテゴリ構成は都度{" "}
              <a href="https://www.skills.sh/" target="_blank" rel="noopener noreferrer">
                skills.sh
              </a>{" "}
              本体でご確認ください。
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
