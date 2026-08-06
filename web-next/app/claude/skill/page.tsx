import type { Metadata } from "next";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

const MermaidDiagram = dynamic(() => import("@/components/docs/MermaidDiagram"), { ssr: false });

export const metadata: Metadata = {
  title: "Claude Codeで始めるAI仕様駆動開発 ― Markdownファイル完全ガイド",
  description:
    "CLAUDE.mdからrequirements.md、design.md、tasks.mdまで。各Markdownファイルの役割・構造・ベストプラクティスを、初学者でも迷わないようステップバイステップで解説します。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_WORKFLOW = `flowchart TD
A["アイデア・要望"] --> B["Specify: 要件定義<br/>(requirements.md / spec.md)"]
B --> C{"要件レビュー<br/>合意できたか"}
C -- 修正が必要 --> B
C -- 承認 --> D["Plan: 技術設計<br/>(design.md / plan.md)"]
D --> E{"設計レビュー<br/>合意できたか"}
E -- 修正が必要 --> D
E -- 承認 --> F["Tasks: タスク分解<br/>(tasks.md)"]
F --> G["Implement: 実装"]
G --> H["Verify: テスト・検証"]
H --> I{"検証結果"}
I -- 失敗 --> G
I -- 成功 --> J["完了・コミット・PR作成"]`;

const DIAGRAM_LOGIN_SEQUENCE = `sequenceDiagram
participant U as ユーザー
participant FE as フロントエンド
participant BE as バックエンド
participant DB as データベース
U->>FE: ログイン情報を入力
FE->>BE: POST /api/login
BE->>DB: ユーザー情報を照会
DB-->>BE: ユーザーレコードを返却
BE-->>FE: 認証トークンを返却
FE-->>U: ダッシュボードへ遷移`;

const DIAGRAM_IMPLEMENTATION = `flowchart LR
A["Explore<br/>Planモードで読み取り専用調査"] --> B["Plan<br/>実装計画を作成<br/>(Ctrl+Gで直接編集可)"]
B --> C["Implement<br/>Planモードを解除しコード実装<br/>テストを実行"]
C --> D["Commit<br/>わかりやすいメッセージでコミット<br/>PR作成"]`;

const DIAGRAM_CONTEXT_LOADING = `flowchart TD
subgraph ALWAYS["常時読み込み"]
CM["CLAUDE.md<br/>セッション開始時に自動読込"]
end
subgraph ONDEMAND["必要時のみ読み込み"]
SK["SKILL.md<br/>該当タスク検知時に読込"]
SUB["サブエージェント定義<br/>(.claude/agents/*.md)<br/>委任時に別コンテキストで読込"]
end
Session["Claude Codeセッション開始"] --> CM
Session -. 該当タスクを検知 .-> SK
Session -. 独立した調査/実装を委任 .-> SUB`;

const DIAGRAM_DATA_FLOW = `flowchart LR
R["requirements.md<br/>spec.md"] --> D["design.md<br/>plan.md"]
D --> T["tasks.md"]
T --> Code["実装コード"]
Code -. 齟齬が見つかれば更新 .-> R`;

export default function ClaudeSkillPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <button
        className={styles.sidebarToggle}
        id="menuToggle"
        aria-label="メニュー開閉"
        type="button"
      >
        ≡
      </button>

      <nav className={styles.sidebar} id="sidebar">
        <div className={styles.sidebarBrand}>
          <span className={styles.dot} />
          <span>SPEC-DRIVEN DEV</span>
        </div>
        <div className={styles.sidebarSub}>
          Claude Codeにおける仕様駆動開発
          <br />
          Markdownファイル完全ガイド
        </div>
        <ul className={styles.toc}>
          <li>
            <a href="#s0" className={styles.tocLink}>
              <span className={styles.num}>00</span>はじめに
            </a>
          </li>
          <li>
            <a href="#s1" className={styles.tocLink}>
              <span className={styles.num}>01</span>全体ワークフロー
            </a>
          </li>
          <li
            role="presentation"
            className={`${styles.tocGroupLabel} ${styles.tocGroupLabelFirst}`}
          >
            Step-by-step
          </li>
          <li>
            <a href="#s2" className={styles.tocLink}>
              <span className={styles.num}>02</span>CLAUDE.md / AGENTS.md
            </a>
          </li>
          <li>
            <a href="#s3" className={styles.tocLink}>
              <span className={styles.num}>03</span>requirements.md
            </a>
          </li>
          <li>
            <a href="#s4" className={styles.tocLink}>
              <span className={styles.num}>04</span>design.md / plan.md
            </a>
          </li>
          <li>
            <a href="#s5" className={styles.tocLink}>
              <span className={styles.num}>05</span>tasks.md
            </a>
          </li>
          <li>
            <a href="#s6" className={styles.tocLink}>
              <span className={styles.num}>06</span>実装・検証
            </a>
          </li>
          <li role="presentation" className={styles.tocGroupLabel}>
            Reference
          </li>
          <li>
            <a href="#s7" className={styles.tocLink}>
              <span className={styles.num}>07</span>ファイル早見表
            </a>
          </li>
          <li>
            <a href="#s8" className={styles.tocLink}>
              <span className={styles.num}>08</span>コンテキストウィンドウ
            </a>
          </li>
          <li>
            <a href="#s9" className={styles.tocLink}>
              <span className={styles.num}>09</span>ツール比較
            </a>
          </li>
          <li>
            <a href="#s10" className={styles.tocLink}>
              <span className={styles.num}>10</span>失敗パターン
            </a>
          </li>
          <li>
            <a href="#s11" className={styles.tocLink}>
              <span className={styles.num}>11</span>境界線ルール
            </a>
          </li>
          <li>
            <a href="#s12" className={styles.tocLink}>
              <span className={styles.num}>12</span>実践チェックリスト
            </a>
          </li>
          <li>
            <a href="#s13" className={styles.tocLink}>
              <span className={styles.num}>13</span>まとめ
            </a>
          </li>
          <li>
            <a href="#s14" className={styles.tocLink}>
              <span className={styles.num}>14</span>参考文献・出典
            </a>
          </li>
        </ul>
      </nav>

      <main className={styles.content}>
        <div className={styles.hero}>
          <span className={styles.eyebrow}>Claude Code / AI Spec-Driven Development</span>
          <h1>
            Claude Codeで始めるAI仕様駆動開発
            <br />― Markdownファイル完全ガイド
          </h1>
          <p className={styles.lead}>
            CLAUDE.mdからrequirements.md、design.md、tasks.mdまで。各Markdownファイルの役割・構造・ベストプラクティスを、初学者でも迷わないようステップバイステップで解説します。
          </p>
          <div className={styles.metaBadges}>
            <span className={styles.badge}>対象: 初学者〜中級エンジニア</span>
            <span className={styles.badge}>情報源: 2026年8月1日時点のWeb検索</span>
            <span className={styles.badge}>
              出典: Anthropic / GitHub / AWS / 国際的開発者ブログ
            </span>
          </div>
        </div>

        {/* 0 */}
        <section id="s0">
          <span className={styles.secEyebrow}>00 / Introduction</span>
          <h2>はじめに ― なぜ「仕様駆動開発 × Markdown」なのか</h2>
          <p>
            Claude
            CodeのようなAIコーディングエージェントは、ターミナルからファイルを読み書きし、コマンドを実行し、自律的にタスクを進められる強力なツールです。しかし指示があいまいなまま作業を任せると、「なんとなく動くコード」が生成され、後から見ると意図と違う実装になっている、という事態が起こりがちです。
          </p>
          <p>
            Andrej Karpathy氏が2025年に提唱した「
            <strong>vibe coding</strong>
            （バイブコーディング）」という言葉は、コードの中身をほとんど確認せずAIに生成させ続けるスタイルを指します。プロトタイピングには向いていますが、本番運用のソフトウェアにそのまま持ち込むと、後から破綻する「砂上の楼閣」のようなコードになりがちだと多くの実務者が指摘しています。
          </p>
          <p>
            これに対して登場したのが「
            <strong>仕様駆動開発（Spec-Driven Development, SDD）</strong>
            」です。コードを書かせる前に、何を・なぜ作るのかを明文化した「仕様」をAIと人間の共通の拠り所として用意し、それを土台に設計・タスク分解・実装を進めていく考え方です。
          </p>
          <h3>なぜMarkdownなのか</h3>
          <ol>
            <li>
              <strong>AIエージェントにはセッションをまたぐ記憶がない</strong>
              ため、プロジェクトの文脈・決定事項・ルールをテキストファイルとして永続化しておく必要があります。Markdownはプレーンテキストでありながら見出し・箇条書き・表・コードブロックで構造化でき、人間にもAIにも読みやすい形式です。
            </li>
            <li>
              Claude Code、GitHub Copilot、OpenAI Codex、Cursor、Gemini
              CLIなど主要なAIコーディングツールが軒並み「CLAUDE.md」「AGENTS.md」といったMarkdownファイルを自動的に読み込む仕組みを標準搭載しており、事実上の業界標準になっているためです。
            </li>
          </ol>
          <blockquote>
            <p>
              本ガイドでは、Claude Codeを主軸にしながら、GitHub公式の「Spec
              Kit」やAWSの「Kiro」など他の代表的なフレームワークとも比較しつつ、各Markdownファイルの役割・構造・書き方をステップバイステップで解説します。
            </p>
          </blockquote>
        </section>

        {/* 1 */}
        <section id="s1">
          <span className={styles.secEyebrow}>01 / Big Picture</span>
          <h2>全体像をつかむ：仕様駆動開発のワークフロー</h2>
          <p>
            仕様駆動開発は、ツールによって呼び方は異なりますが、おおむね次のような流れをたどります。
          </p>

          <div className={styles.diagramCard}>
            <MermaidDiagram chart={DIAGRAM_WORKFLOW} id="diagram-workflow" />
          </div>
          <p className={styles.figCaption}>Fig.1 ― 仕様駆動開発の基本ワークフロー</p>

          <p>
            この「要件 → 設計 → タスク → 実装 → 検証」という流れは、GitHub公式のツールキット「Spec
            Kit」の <code>/specify → /plan → /tasks</code> というスラッシュコマンド群や、AWSのAI
            IDE「Kiro」が生成する <code>requirements.md → design.md → tasks.md</code>{" "}
            という3点セットにも共通します。Claude
            Code自体には固定のスラッシュコマンドとしてのSDDフローは同梱されていませんが、Anthropicは後述する「インタビュー形式でSPEC.mdを作る」ワークフローを推奨しており、考え方の骨格は同じです。
          </p>

          <h3>vibe codingとの違い</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>vibe coding</th>
                  <th>仕様駆動開発（SDD）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>開始点</td>
                  <td>思いついたことをそのままプロンプトに書く</td>
                  <td>目的・ユーザー・成功条件を明文化してから着手</td>
                </tr>
                <tr>
                  <td>コードレビュー</td>
                  <td>省略されがち</td>
                  <td>各フェーズでレビュー・承認ゲートを設ける</td>
                </tr>
                <tr>
                  <td>向いている場面</td>
                  <td>プロトタイプ、探索的な検証、使い捨てスクリプト</td>
                  <td>複数ファイルにまたがる機能開発、チーム開発、本番運用コード</td>
                </tr>
                <tr>
                  <td>変更履歴の追跡</td>
                  <td>会話ログに埋もれ難しい</td>
                  <td>
                    仕様ファイルをGit管理し<code>git diff</code>で追跡可能
                  </td>
                </tr>
                <tr>
                  <td>リスク</td>
                  <td>説明できないコードが積み上がりやすい</td>
                  <td>仕様と実装の乖離を早期発見しやすい</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Simon
            Willison氏（Djangoの共同開発者、Datasetteの開発者）は、AIが書いたコードであっても人間がレビュー・理解していれば「タイピングを代行してもらっているだけ」であり問題ないが、レビューをせずに動くコードを積み上げる行為こそが本来の意味でのvibe
            codingだと整理しています。vibe
            codingと仕様駆動開発は対立概念というより、タスクの重要度に応じて使い分けるグラデーションだと捉えるのが実務的です。
          </p>
        </section>

        <hr className={styles.divider} />

        {/* 2 */}
        <section id="s2">
          <span className={styles.secEyebrow}>02 / Step 0 ― Foundation</span>
          <h2>土台を作る ― CLAUDE.md / AGENTS.md</h2>
          <p>
            コードを1行も書く前に、まずプロジェクト全体に効くルールを1つのMarkdownファイルにまとめます。これが仕様駆動開発の「地盤」になります。
          </p>

          <h3>CLAUDE.mdとは</h3>
          <p>
            <code>CLAUDE.md</code>はClaude
            Codeがセッション開始時に自動的に読み込む特別なファイルです。ビルドコマンド、コーディング規約、ワークフロー上のルールなど、コードを読むだけでは推測できない情報を書く場所として設計されています。
          </p>
          <ul>
            <li>
              <code>/init</code>
              コマンドで、既存プロジェクトを解析したたたき台を自動生成できます。
            </li>
            <li>決まったフォーマットはありませんが、短く・人間にも読みやすく保つのが基本です。</li>
            <li>
              <code>/context</code>
              コマンドで実際に読み込まれているか確認できます。
            </li>
          </ul>
          <p>
            CLAUDE.mdは<strong>毎セッションで必ず読み込まれる</strong>
            ため、書きすぎるとコンテキストを圧迫し、逆に指示が埋もれて無視されやすくなります。「この1行を消したらClaudeがミスをするか？」を基準に、答えがNoなら削るのが目安です。
          </p>

          <h3>配置場所</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>配置場所</th>
                  <th>適用範囲</th>
                  <th>Gitでの扱い</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>~/.claude/CLAUDE.md</code>
                  </td>
                  <td>すべてのプロジェクトに共通する個人設定</td>
                  <td>リポジトリに含めない</td>
                </tr>
                <tr>
                  <td>
                    <code>./CLAUDE.md</code>
                  </td>
                  <td>プロジェクト全体、チーム共有ルール</td>
                  <td>コミットして共有</td>
                </tr>
                <tr>
                  <td>
                    <code>./CLAUDE.local.md</code>
                  </td>
                  <td>個人的なメモ・一時的な指示</td>
                  <td>
                    <code>.gitignore</code>に入れる
                  </td>
                </tr>
                <tr>
                  <td>
                    親ディレクトリの<code>CLAUDE.md</code>
                  </td>
                  <td>モノレポ全体</td>
                  <td>コミット（自動読込）</td>
                </tr>
                <tr>
                  <td>
                    子ディレクトリの<code>CLAUDE.md</code>
                  </td>
                  <td>そのサブディレクトリ配下のみ</td>
                  <td>コミット（オンデマンド読込）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>書くべきこと・書かないこと</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>✅ 書くべきこと</th>
                  <th>❌ 書かないほうがよいこと</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Claudeが推測できないビルド・テストコマンド</td>
                  <td>コードを読めば分かること</td>
                </tr>
                <tr>
                  <td>プロジェクト固有のコーディング規約</td>
                  <td>一般的な言語作法（既に知っていること）</td>
                </tr>
                <tr>
                  <td>テストの実行方法・優先するテストランナー</td>
                  <td>詳細なAPI仕様（ドキュメントへリンクで十分）</td>
                </tr>
                <tr>
                  <td>ブランチ命名やPRルールなどの運用</td>
                  <td>頻繁に変わる情報</td>
                </tr>
                <tr>
                  <td>プロジェクト固有のアーキテクチャ決定</td>
                  <td>長い解説やチュートリアル</td>
                </tr>
                <tr>
                  <td>開発環境特有の癖（必須の環境変数など）</td>
                  <td>ファイル単位の説明の羅列</td>
                </tr>
                <tr>
                  <td>よくあるハマりどころ・非自明な挙動</td>
                  <td>「きれいに書く」等の自明な心構え</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Claudeが何度も同じ間違いを繰り返すなら、CLAUDE.mdが長すぎてルールが埋もれている可能性が高いというのがAnthropicの経験則です。逆にCLAUDE.mdに書いてあることをわざわざ質問してくる場合は、表現があいまいかもしれません。「IMPORTANT」「YOU
            MUST」のような強調語で追従度を上げられるとされています。
          </p>

          <h3>@import構文で分割する</h3>
          <p>
            CLAUDE.mdが肥大化してきたら、<code>@path/to/file</code>
            という記法で他のMarkdownファイルを読み込ませ、関心ごとに分割できます。「READMEの概要は
            <code>@README.md</code>参照」のような形で本体をスリムに保てます。
          </p>

          <h3>AGENTS.md ― ツール横断のオープン標準</h3>
          <p>
            CLAUDE.mdがClaude Code専用であるのに対し、<code>AGENTS.md</code>
            はOpenAI Codex、Cursor、Gemini CLI、Google
            Jules、Amp、Factoryなど複数のAIコーディングツールが共通で読み込める、いわば「エージェント向けREADME」を目指すオープン標準です。現在はLinux
            Foundation傘下のAgentic AI Foundationが管理を引き継いでいます。
          </p>
          <ul>
            <li>中身は素のMarkdownで、必須のフィールドや見出し構成は存在しません。</li>
            <li>
              モノレポでは各ディレクトリにネストして配置でき、編集対象ファイルから見て
              <strong>最も近い階層のAGENTS.mdが優先</strong>
              されます（OpenAIの自社リポジトリでは88個ものAGENTS.mdファイルが使われています）。
            </li>
            <li>
              README.mdが人間向けの入口であるのに対し、AGENTS.mdはビルド手順・テスト方法・規約などAIエージェントが必要とする詳細情報を切り出す場所と位置づけられています。
            </li>
            <li>
              Claude
              Codeを含む30以上のツールが読み込めるため、複数のAIツールを併用するチームでは「まずAGENTS.mdを整備し、Claude
              Code固有の機能が必要な場合だけCLAUDE.mdを追加する」運用がすすめられています。
            </li>
          </ul>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ファイル</th>
                  <th>主な対象ツール</th>
                  <th>必須フォーマット</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>CLAUDE.md</code>
                  </td>
                  <td>Claude Code</td>
                  <td>
                    自由形式（<code>@import</code>対応）
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>AGENTS.md</code>
                  </td>
                  <td>Codex, Cursor, Gemini CLI, Jules, Claude Code(インポート経由) ほか30以上</td>
                  <td>自由形式のMarkdown</td>
                </tr>
                <tr>
                  <td>
                    <code>.github/copilot-instructions.md</code>
                  </td>
                  <td>GitHub Copilot</td>
                  <td>自由形式のMarkdown</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            GitHubが2,500以上の公開リポジトリの<code>agents.md</code>
            系ファイルを分析したところ、うまく機能しているファイルには共通点があることが分かりました。詳しくは3章・11章で扱います。
          </p>
          <blockquote>
            <p>
              出典: Anthropic公式 Claude Code Best Practices ／ AGENTS.md公式サイト ／ GitHub
              Blog「How to write a great agents.md」（URLは14章に一覧掲載）
            </p>
          </blockquote>
        </section>

        <hr className={styles.divider} />

        {/* 3 */}
        <section id="s3">
          <span className={styles.secEyebrow}>03 / Step 1 ― Requirements</span>
          <h2>要件を書く ― requirements.md / spec.md</h2>
          <p>
            土台ができたら、次に取り組むのが「何を、誰のために、なぜ作るのか」を定義する要件定義ファイルです。
          </p>

          <h3>「何を」より先に「なぜ」を書く</h3>
          <p>
            Googleで14年以上エンジニアリング・エバンジェリズムを率いた経験を持つAddy
            Osmani氏は、AIエージェント向けの仕様は技術スタックの詳細から入るのではなく、まず高レベルのビジョン（誰が使うのか、どんな課題を解決するのか、成功とは何か）から始め、そこからAI自身に詳細な仕様案を作らせるという進め方を推奨しています。GitHub公式の考え方も同様で、
            <code>/specify</code>
            フェーズではユーザー体験や成功条件にフォーカスし、技術的な実装方法にはまだ踏み込まないとされています。
          </p>
          <p>
            Claude
            Codeでは、この「たたき台を対話で作る」プロセスを次のように行うのが効果的だとAnthropicは案内しています。
          </p>
          <ol>
            <li>
              Claudeに「〇〇を作りたい。<code>AskUserQuestion</code>
              ツールを使って技術的な実装、UI/UX、エッジケース、トレードオフについて詳しくインタビューしてほしい」と依頼する。
            </li>
            <li>
              質問と回答が一通り終わったら、その内容を<code>SPEC.md</code>
              としてまとめてもらう。
            </li>
            <li>
              実装は新しいセッションで始める。インタビューの会話履歴に邪魔されない、まっさらなコンテキストで実装に集中できる。
            </li>
          </ol>

          <h3>EARS記法で受け入れ基準を書く</h3>
          <p>
            要件をあいまいなまま箇条書きするのではなく、「EARS（Easy Approach to Requirements
            Syntax）」と呼ばれる定型文で書くと解釈のブレが生じにくくなります。AWSの開発ツール「Kiro」はこの記法を
            <code>requirements.md</code>
            の標準フォーマットとして採用しています。基本パターンは次の通りです。
          </p>
          <blockquote>
            <p>
              <code>WHEN [イベント/条件] THE SYSTEM SHALL [期待される振る舞い]</code>
            </p>
          </blockquote>

          <h3>requirements.md / spec.mdのテンプレート例</h3>
          <div className={styles.codeWindow}>
            <div className={styles.bar}>
              <span />
              <span />
              <span />
            </div>
            <pre>
              <code>{`# 要件定義書: ユーザー認証機能

## 背景・目的
既存のゲスト利用のみのアプリに会員登録機能を追加し、
ユーザーごとにデータを保存できるようにしたい。

## ユーザーストーリー
- 会員として、メールアドレスとパスワードでログインしたい。
  なぜなら、自分のデータを次回訪問時にも参照したいから。

## 受け入れ基準（EARS記法）
- WHEN ユーザーが正しいメールアドレスとパスワードを入力したとき
  THE SYSTEM SHALL ログインを許可しダッシュボードへ遷移する
- WHEN ユーザーが5回連続でログインに失敗したとき
  THE SYSTEM SHALL 該当アカウントを15分間ロックする
- WHEN パスワードが8文字未満のとき
  THE SYSTEM SHALL 登録エラーを表示し登録を拒否する

## スコープ外（今回は対応しない）
- ソーシャルログイン（Google/GitHub連携）
- 二要素認証

## 成功指標
- 新規登録完了率
- ログイン失敗によるサポート問い合わせ件数の減少`}</code>
            </pre>
          </div>

          <h3>抜け漏れを防ぐ「6つの必須領域」</h3>
          <p>
            GitHubが2,500以上のリポジトリの<code>agents.md</code>
            系ファイルを分析した結果、うまく機能している仕様ファイルは次の6領域を押さえていることが分かりました。主にCLAUDE.md/AGENTS.md向けの知見ですが、要件定義のセルフチェックリストとしても有効です。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>領域</th>
                  <th>内容の例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>コマンド</td>
                  <td>
                    <code>npm test</code>
                    のようにフラグまで含めた実行可能なコマンド
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>テスト</td>
                  <td>使用するテストフレームワーク、テストファイルの置き場所</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>プロジェクト構成</td>
                  <td>ソース・テスト・ドキュメントの配置ルール</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>コードスタイル</td>
                  <td>説明文より実際のコード例を1つ示すほうが伝わる</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Gitワークフロー</td>
                  <td>ブランチ命名規則、コミットメッセージ形式、PR要件</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>境界線</td>
                  <td>触ってはいけない領域（11章で詳述）</td>
                </tr>
              </tbody>
            </table>
          </div>
          <blockquote>
            <p>
              出典: Addy Osmani「How to write a good spec for AI agents」／ Anthropic公式 Claude
              Code Best Practices ／ AWS Kiro Docs ／ GitHub Blog「How to write a great
              agents.md」（URLは14章）
            </p>
          </blockquote>
        </section>

        <hr className={styles.divider} />

        {/* 4 */}
        <section id="s4">
          <span className={styles.secEyebrow}>04 / Step 2 ― Design</span>
          <h2>設計する ― design.md / plan.md</h2>
          <p>
            要件が固まったら、それを技術的にどう実現するかを<code>design.md</code>
            （Kiro流）または<code>plan.md</code>
            （GitHub Spec
            Kit流）にまとめます。ここでようやく技術スタックやアーキテクチャの話に踏み込みます。
          </p>

          <h3>design.md / plan.mdに書くべき項目</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>アーキテクチャ概要</td>
                  <td>どのコンポーネントがどう連携するか</td>
                </tr>
                <tr>
                  <td>データモデル</td>
                  <td>テーブル構造、エンティティ間の関係</td>
                </tr>
                <tr>
                  <td>API/インターフェース仕様</td>
                  <td>エンドポイント、リクエスト/レスポンスの形</td>
                </tr>
                <tr>
                  <td>技術スタックと採用理由</td>
                  <td>バージョンまで明記する（「React」ではなく「React 18」）</td>
                </tr>
                <tr>
                  <td>非機能要件への対応</td>
                  <td>パフォーマンス、セキュリティ、可用性など</td>
                </tr>
                <tr>
                  <td>代替案の検討記録</td>
                  <td>なぜその設計を選び、他の案を採らなかったか</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>design.mdの中にMermaid図を埋め込む</h3>
          <p>
            design.md自体もMarkdownファイルなので、Mermaidのシーケンス図やER図をそのまま埋め込めます。文章だけで説明するより、処理の流れが一目で分かるようになります。以下はログイン処理をdesign.mdに書く場合の例です。
          </p>

          <div className={styles.diagramCard}>
            <MermaidDiagram chart={DIAGRAM_LOGIN_SEQUENCE} id="diagram-login-sequence" />
          </div>
          <p className={styles.figCaption}>Fig.2 ― design.mdに埋め込むシーケンス図の例</p>

          <p>
            GitHub Spec Kitの<code>/plan</code>コマンドは、要件仕様(
            <code>spec.md</code>)を読み込み、リサーチ結果(
            <code>research.md</code>)・データモデル(<code>data-model.md</code>
            )・APIコントラクト(<code>contracts/</code>
            )などをまとめて<code>plan.md</code>
            として出力する、複数ファイル構成を採用しています。プロジェクトの規模に応じて、design.mdを1ファイルにまとめるか、Spec
            Kitのように関心ごとに分割するかを選ぶとよいでしょう。
          </p>
          <blockquote>
            <p>
              出典: Addy Osmani「How to write a good spec for AI agents」／ GitHub spec-kit
              plan-template.md ／ AWS Kiro Docs（URLは14章）
            </p>
          </blockquote>
        </section>

        <hr className={styles.divider} />

        {/* 5 */}
        <section id="s5">
          <span className={styles.secEyebrow}>05 / Step 3 ― Task Breakdown</span>
          <h2>タスクに分解する ― tasks.md</h2>
          <p>
            設計ができたら、実装を一気に進めるのではなく、小さく検証可能な単位に分解します。この分解結果を書き留めるのが
            <code>tasks.md</code>です。
          </p>

          <h3>なぜ分解が必要なのか</h3>
          <p>
            Addy
            Osmani氏は、1つのプロンプトに要件・設計・実装指示すべてを詰め込むと、モデルが指示の一部を無視し始める「curse
            of
            instructions（指示の呪い）」と呼ばれる現象が起きやすいと指摘しています。タスクを1つずつ小さく渡し、都度検証していくほうが、結果的に品質も速度も安定するとされています。
          </p>

          <h3>tasks.mdのテンプレート例</h3>
          <p>
            各タスクには対応する要件番号を紐付けておくと、実装があとから「なぜこの処理があるのか」を追跡しやすくなります（トレーサビリティ）。KiroやGitHub
            Spec Kitでも重視されている考え方です。
          </p>
          <div className={styles.codeWindow}>
            <div className={styles.bar}>
              <span />
              <span />
              <span />
            </div>
            <pre>
              <code>{`# 実装タスク: ユーザー認証機能

- [ ] 1. usersテーブルをマイグレーションで作成する（要件: REQ-001）
      - 依存: なし
- [ ] 2. パスワードハッシュ化ユーティリティを実装する（要件: REQ-001）
      - 依存: タスク1
- [ ] 3. ログインAPIエンドポイントを実装する（要件: REQ-001, REQ-002）
      - 依存: タスク1, タスク2
- [ ] 4. ログイン失敗5回でのアカウントロック処理を実装する（要件: REQ-003）
      - 依存: タスク3
- [ ] 5. E2Eテスト（ログイン成功・失敗・ロック）を実装する（要件: REQ-001, REQ-003）
      - 依存: タスク3, タスク4`}</code>
            </pre>
          </div>

          <h3>依存関係のない作業は並列化できる</h3>
          <p>
            AWSのKiroは、<code>tasks.md</code>
            内のタスク間の依存関係を自動的にグラフ化し、依存関係のないタスク同士を「ウェーブ（波）」としてまとめて並列実行する機能を備えています。Claude
            Codeでも同様の考え方で、独立したタスクごとに複数セッションやサブエージェントへ作業を振り分けることで、全体の所要時間を短縮できます（8章・9章で詳述）。
          </p>
          <blockquote>
            <p>
              出典: Addy Osmani「How to write a good spec for AI agents」／ AWS Kiro Docs ／
              GitHub「spec-based-claude-code」（URLは14章）
            </p>
          </blockquote>
        </section>

        <hr className={styles.divider} />

        {/* 6 */}
        <section id="s6">
          <span className={styles.secEyebrow}>06 / Step 4 ― Implement &amp; Verify</span>
          <h2>実装・検証する</h2>
          <p>
            仕様とタスクが揃ったら、いよいよ実装フェーズです。Anthropicは公式ガイドで次の4段階のワークフローを推奨しています。
          </p>

          <div className={styles.diagramCard}>
            <MermaidDiagram chart={DIAGRAM_IMPLEMENTATION} id="diagram-implementation" />
          </div>
          <p className={styles.figCaption}>Fig.3 ― Anthropic推奨の4段階ワークフロー</p>

          <ul>
            <li>
              <strong>Explore（調査）</strong>: Plan
              Mode（読み取り専用モード）に入り、関連コードを読ませて質問に答えさせる。この段階ではファイルは一切変更されない。
            </li>
            <li>
              <strong>Plan（計画）</strong>:
              「〇〇を実装したい。どのファイルを変更する必要があるか、詳細な計画を作って」と依頼する。
              <code>Ctrl+G</code>
              でエディタを開き、生成された計画を人間が直接編集できる。
            </li>
            <li>
              <strong>Implement（実装）</strong>: Plan
              Modeを解除し、計画に沿ってコードを書かせ、テストも実行・修正させる。
            </li>
            <li>
              <strong>Commit（コミット）</strong>:
              わかりやすいコミットメッセージでコミットし、PRを作成させる。
            </li>
          </ul>
          <p>
            変更が小さい場合（誤字修正、ログ追加、変数名の変更など）は、計画フェーズを省略してそのまま実装させても構わないとAnthropicは補足しています。「差分を1文で説明できるならPlanは飛ばしてよい」という目安が示されています。
          </p>

          <h3>検証基準を渡す</h3>
          <p>
            Claudeは「完了したように見える」ことを完了の判断材料にしてしまいがちです。テスト・ビルド・スクリーンショット比較など、合否を機械的に判定できる「チェック」を与えることで、Claude自身がコード→テスト→修正のループを自走できるようになります。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>悪い例</th>
                  <th>良い例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>「メールアドレスを検証する関数を実装して」</td>
                  <td>
                    「validateEmail関数を実装して。<code>user@example.com</code>
                    はtrue、<code>invalid</code>はfalse、<code>user@.com</code>
                    はfalseになるようにし、実装後にテストを実行して」
                  </td>
                </tr>
                <tr>
                  <td>「ダッシュボードをもっと良い見た目にして」</td>
                  <td>
                    「（スクリーンショット添付）このデザイン通りに実装して。実装後にスクリーンショットを撮り、元のデザインと比較して差分をリストアップし修正して」
                  </td>
                </tr>
                <tr>
                  <td>「ビルドが失敗している」</td>
                  <td>
                    「ビルドがこのエラーで失敗している：（エラーを貼付）。原因を直しビルドが通ることを確認して。エラーを握りつぶさず根本原因を直して」
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>第三者視点でのレビュー</h3>
          <p>
            実装したのと同じ会話の中でレビューさせると、Claudeは自分が書いたコードに引っ張られがちです。会話履歴を持たない新しいサブエージェントに、実装の差分と検証基準だけを渡してレビューさせることで、より客観的な指摘が得られます。「差分を計画書と突き合わせ、要件がすべて実装されているか、指定したエッジケースにテストがあるか、範囲外の変更が紛れ込んでいないかを確認して」といった形で依頼すると効果的です。
          </p>
          <blockquote>
            <p>出典: Anthropic公式 Claude Code Best Practices（URLは14章）</p>
          </blockquote>
        </section>

        <hr className={styles.divider} />

        {/* 7 */}
        <section id="s7">
          <span className={styles.secEyebrow}>07 / Reference</span>
          <h2>補助的なMarkdownファイル群（早見表）</h2>
          <p>
            ここまで登場したファイルに加え、Claude
            Codeのエコシステムには目的別のMarkdownファイルがいくつも存在します。全体像を1つの表にまとめます。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ファイル</th>
                  <th>主な役割</th>
                  <th>読み込まれるタイミング</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>CLAUDE.md</code>
                  </td>
                  <td>プロジェクト共通ルール、コマンド、規約</td>
                  <td>毎セッション開始時に自動読み込み</td>
                </tr>
                <tr>
                  <td>
                    <code>CLAUDE.local.md</code>
                  </td>
                  <td>個人用の一時的な指示</td>
                  <td>毎セッション開始時（Git管理外）</td>
                </tr>
                <tr>
                  <td>
                    <code>AGENTS.md</code>
                  </td>
                  <td>ツール横断の共通ルール</td>
                  <td>対応する各種AIツールが自動読み込み</td>
                </tr>
                <tr>
                  <td>
                    <code>.claude/skills/&lt;name&gt;/SKILL.md</code>
                  </td>
                  <td>特定ドメイン・タスクの知識やワークフロー</td>
                  <td>関連タスク検知時にオンデマンドで読み込み</td>
                </tr>
                <tr>
                  <td>
                    <code>.claude/agents/&lt;name&gt;.md</code>
                  </td>
                  <td>サブエージェント（専門特化アシスタント）の定義</td>
                  <td>サブエージェントへの委任時、独立コンテキストで読み込み</td>
                </tr>
                <tr>
                  <td>
                    <code>requirements.md</code> / <code>spec.md</code>
                  </td>
                  <td>何を・なぜ作るか（要件）</td>
                  <td>各フェーズ冒頭でAIと人間が参照</td>
                </tr>
                <tr>
                  <td>
                    <code>design.md</code> / <code>plan.md</code>
                  </td>
                  <td>どう作るか（技術設計）</td>
                  <td>実装前に参照</td>
                </tr>
                <tr>
                  <td>
                    <code>tasks.md</code>
                  </td>
                  <td>実装単位への分解、進捗管理</td>
                  <td>実装フェーズ全体を通して参照・更新</td>
                </tr>
                <tr>
                  <td>
                    <code>constitution.md</code>
                  </td>
                  <td>プロジェクトの不変原則（GitHub Spec Kit流）</td>
                  <td>各フェーズの整合性チェック時に参照</td>
                </tr>
                <tr>
                  <td>
                    <code>SPEC.md</code>
                  </td>
                  <td>インタビュー形式で作る一枚仕様書（Claude Code流）</td>
                  <td>実装セッション開始時に参照</td>
                </tr>
                <tr>
                  <td>
                    <code>README.md</code>
                  </td>
                  <td>人間（開発者）向けのプロジェクト概要</td>
                  <td>人間が読む。AGENTS.mdと役割分担</td>
                </tr>
              </tbody>
            </table>
          </div>
          <blockquote>
            <p>
              出典: Anthropic公式 Claude Code Best Practices ／ GitHub spec-kit ／
              AGENTS.md公式サイト（URLは14章）
            </p>
          </blockquote>
        </section>

        <hr className={styles.divider} />

        {/* 8 */}
        <section id="s8">
          <span className={styles.secEyebrow}>08 / Context Window</span>
          <h2>ファイルはどう読み込まれる？ ― コンテキストウィンドウの話</h2>
          <p>
            なぜファイルを分ける必要があるのか、その理由はClaude
            Codeの「コンテキストウィンドウ」の仕組みにあります。
          </p>
          <p>
            Claudeとの会話・読み込んだファイル・コマンドの実行結果はすべて同じコンテキストウィンドウに蓄積されます。これは有限であり、埋まってくるほどClaudeの応答品質は劣化していきます。長時間のデバッグセッションだけで数万トークンを消費することも珍しくありません。
          </p>
          <p>
            そのため、Claude
            Codeのファイル群は「常に読み込むもの」と「必要な時だけ読み込むもの」に意図的に分けて設計されています。
          </p>

          <div className={styles.diagramCard}>
            <MermaidDiagram chart={DIAGRAM_CONTEXT_LOADING} id="diagram-context-loading" />
          </div>
          <p className={styles.figCaption}>Fig.4 ― ファイルの読み込みタイミング</p>

          <ul>
            <li>
              <strong>CLAUDE.md</strong>
              は毎セッション必ずコンテキストに乗るため、「広く一般的に当てはまること」だけを書く。
            </li>
            <li>
              <strong>SKILL.md</strong>（<code>.claude/skills/</code>
              配下）は、特定ドメインの知識やワークフローを必要な時だけ読み込む「オンデマンド読み込み」の仕組みで、CLAUDE.mdを圧迫しません。
            </li>
            <li>
              <strong>サブエージェント</strong>（<code>.claude/agents/</code>
              配下）は、それぞれが独自のコンテキストウィンドウを持つため、大量のファイルを読む調査作業やレビュー作業をメインの会話から切り離せます。
            </li>
          </ul>
          <p>
            このほか、<code>/clear</code>
            で無関係なタスクの間に文脈をリセットする、<code>/compact</code>
            で会話を要約して圧縮する、2回同じ指摘をしても直らない場合は
            <code>/clear</code>
            してより具体的なプロンプトで仕切り直す、といった運用がAnthropicから推奨されています。
          </p>
          <blockquote>
            <p>
              出典: Anthropic公式 Claude Code Best Practices ／ Anthropic公式「How Claude Code works
              in large codebases」（URLは14章）
            </p>
          </blockquote>
        </section>

        <hr className={styles.divider} />

        {/* 9 */}
        <section id="s9">
          <span className={styles.secEyebrow}>09 / Comparison</span>
          <h2>代表的な仕様駆動開発ツールの比較</h2>
          <p>
            仕様駆動開発という考え方自体は複数のツール・ベンダーが実装しており、それぞれ生成するMarkdownファイルの名前や流儀が微妙に異なります。代表的な3つを比較します。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th />
                  <th>Claude Code（インタビュー形式）</th>
                  <th>GitHub Spec Kit</th>
                  <th>AWS Kiro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>提供元</td>
                  <td>Anthropic</td>
                  <td>GitHub</td>
                  <td>AWS</td>
                </tr>
                <tr>
                  <td>主要ファイル</td>
                  <td>
                    <code>SPEC.md</code>
                  </td>
                  <td>
                    <code>constitution.md</code>, <code>spec.md</code>, <code>plan.md</code>,{" "}
                    <code>tasks.md</code>
                  </td>
                  <td>
                    <code>requirements.md</code>, <code>design.md</code>, <code>tasks.md</code>
                  </td>
                </tr>
                <tr>
                  <td>要件の記法</td>
                  <td>自由記述（対話で作成）</td>
                  <td>ユーザー体験・成功条件中心の自由記述</td>
                  <td>EARS記法</td>
                </tr>
                <tr>
                  <td>フェーズ間のゲート</td>
                  <td>人間が都度レビュー</td>
                  <td>各コマンド実行前に前段の承認状況をチェック</td>
                  <td>フェーズごとに承認、または一括自動実行も可</td>
                </tr>
                <tr>
                  <td>整合性チェック</td>
                  <td>サブエージェントによるレビュー依頼</td>
                  <td>
                    <code>/speckit.analyze</code>
                    で憲章との整合性を検証
                  </td>
                  <td>タスクの依存関係を自動解析</td>
                </tr>
                <tr>
                  <td>特徴的な概念</td>
                  <td>
                    Plan Mode、<code>AskUserQuestion</code>
                  </td>
                  <td>
                    <code>constitution.md</code>＝不変原則（9つの条項）
                  </td>
                  <td>独立タスクの並列実行「ウェーブ」</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.diagramCard}>
            <MermaidDiagram chart={DIAGRAM_DATA_FLOW} id="diagram-data-flow" />
          </div>
          <p className={styles.figCaption}>Fig.5 ― ツール横断で共通する基本データフロー</p>

          <p>
            GitHub Spec Kitの<code>constitution.md</code>
            は、テスト方針やCLIファーストといった「プロジェクトが絶対に譲れない原則」を、コーディング開始前に定義しておくファイルです。ソフトウェア開発の専門家であるGojko
            Adzic氏は、Spec
            Kit登場時のブログ投稿で、こうした仕様駆動開発の潮流はビヘイビア駆動開発（BDD）の延長線上にある合理的な進化だと評価しつつも、フェーズを厳密に区切りすぎるとアジャイル以前のウォーターフォール型開発が持っていた硬直性を再導入しかねない、という懸念も示しています。実務では、タスクの複雑さに応じて仕様の厚みを調整するバランス感覚が重要です。
          </p>
          <blockquote>
            <p>
              出典: GitHub spec-kit（spec-driven.md）／ AWS Kiro Docs ／ Tessl「A look at Spec
              Kit」／ Microsoft Learn（URLは14章）
            </p>
          </blockquote>
        </section>

        <hr className={styles.divider} />

        {/* 10 */}
        <section id="s10">
          <span className={styles.secEyebrow}>10 / Pitfalls</span>
          <h2>よくある失敗パターンと対策</h2>
          <p>
            Anthropic公式ガイドおよびAddy
            Osmani氏の記事から、初学者が陥りやすい失敗パターンと対策をまとめます。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>失敗パターン</th>
                  <th>症状</th>
                  <th>対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>何でも詰め込みセッション</td>
                  <td>1つのタスクの途中で無関係な話題を挟み、コンテキストが雑多な情報で埋まる</td>
                  <td>
                    無関係なタスクの間は<code>/clear</code>する
                  </td>
                </tr>
                <tr>
                  <td>同じ指摘の繰り返し</td>
                  <td>訂正しても直らず、失敗した試みが文脈に蓄積する</td>
                  <td>
                    2回訂正しても直らなければ<code>/clear</code>
                    し、学びを盛り込んだ具体的なプロンプトで仕切り直す
                  </td>
                </tr>
                <tr>
                  <td>肥大化したCLAUDE.md</td>
                  <td>ルールが長すぎて重要な指示が埋もれ、Claudeが無視するようになる</td>
                  <td>「削っても問題ないか」を基準に容赦なく整理する</td>
                </tr>
                <tr>
                  <td>「信じて→あとで検証」のギャップ</td>
                  <td>もっともらしい実装がエッジケースを処理できていない</td>
                  <td>テスト・スクリプト・スクリーンショット等の検証手段を必ず用意する</td>
                </tr>
                <tr>
                  <td>無限探索</td>
                  <td>範囲を絞らず調査依頼し、大量のファイル読込でコンテキストを消費</td>
                  <td>調査範囲を狭く指定するか、サブエージェントに任せる</td>
                </tr>
                <tr>
                  <td>あいまいなプロンプト</td>
                  <td>「いい感じに作って」は拠り所がなく誤った成果物になりやすい</td>
                  <td>入力・出力・制約を具体的に書く。役割も指定する</td>
                </tr>
                <tr>
                  <td>要約なしの長すぎる文脈</td>
                  <td>長大なドキュメントをそのまま貼り、要点を拾えなくなる</td>
                  <td>階層的な要約（目次＋各セクションの要点）を作る</td>
                </tr>
                <tr>
                  <td>人間レビューの省略</td>
                  <td>テストが通っているだけで安全だと思い込む</td>
                  <td>重要なコードパスは必ず人間が目を通す</td>
                </tr>
              </tbody>
            </table>
          </div>
          <blockquote>
            <p>
              出典: Anthropic公式 Claude Code Best Practices ／ Addy Osmani「How to write a good
              spec for AI agents」（URLは14章）
            </p>
          </blockquote>
        </section>

        <hr className={styles.divider} />

        {/* 11 */}
        <section id="s11">
          <span className={styles.secEyebrow}>11 / Boundaries</span>
          <h2>三段階の境界線ルール</h2>
          <p>
            「絶対にやってはいけないこと」を単純な禁止リストとして並べるだけでは不十分だと、GitHubの分析（2,500以上のリポジトリの
            <code>agents.md</code>
            ）は指摘しています。うまく機能しているファイルは、行動を3段階に分けて明示しているのが特徴です。
          </p>
          <div className={styles.chipRow}>
            <span className={styles.chip}>✅ 常にやってよい</span>
            <span className={styles.chip}>⚠️ 確認してから</span>
            <span className={styles.chip}>🚫 絶対にダメ</span>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>レベル</th>
                  <th>意味</th>
                  <th>記述例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>✅ 常にやってよい</td>
                  <td>確認なしで進めてよい行動</td>
                  <td>「コミット前に必ずテストを実行する」「命名規則に従う」</td>
                </tr>
                <tr>
                  <td>⚠️ 確認してから</td>
                  <td>人間の承認が必要な行動</td>
                  <td>
                    「DBスキーマの変更は事前に確認する」「新しい依存関係の追加は事前に確認する」
                  </td>
                </tr>
                <tr>
                  <td>🚫 絶対にダメ</td>
                  <td>ハードストップ、例外なし</td>
                  <td>
                    「シークレットやAPIキーをコミットしない」「<code>node_modules/</code>や
                    <code>vendor/</code>を編集しない」
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            GitHubの分析では、「シークレットをコミットしない」が最も頻出する制約だったと報告されています。この三段階方式を使うと、Claudeは「常にやってよいこと」には迷わず進み、「確認してから」は立ち止まって人間に相談し、「絶対にダメ」は問答無用で回避する、というメリハリのある振る舞いを取りやすくなります。CLAUDE.md、AGENTS.md、requirements.mdのいずれに書いてもかまいませんが、少なくともプロジェクトに1箇所は必ず明文化しておくことが推奨されます。
          </p>
          <blockquote>
            <p>
              出典: GitHub Blog「How to write a great agents.md」／ Addy Osmani「How to write a good
              spec for AI agents」（URLは14章）
            </p>
          </blockquote>
        </section>

        <hr className={styles.divider} />

        {/* 12 */}
        <section id="s12">
          <span className={styles.secEyebrow}>12 / Checklist</span>
          <h2>初学者向け実践チェックリスト</h2>
          <p>はじめて仕様駆動開発をClaude Codeで試す場合、次の順番で進めるとつまずきにくいです。</p>
          <ul className={styles.checklist}>
            <li>
              <label>
                <input type="checkbox" />
                <span>
                  プロジェクトルートで<code>/init</code>
                  を実行し、たたき台となるCLAUDE.mdを生成する
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>CLAUDE.mdを見直し、「消しても問題ない行」を削って短く保つ</span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>三段階の境界線（✅常に/⚠️確認/🚫絶対にダメ）を最低限書く</span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>複数のAIツールを併用するなら、AGENTS.mdも検討する</span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>
                  新機能を作る前に、Plan
                  Modeまたはインタビュー形式でAIに質問させ、SPEC.md（またはrequirements.md）を作る
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>
                  要件をレビューし、あいまいな箇所を修正する（可能ならEARS記法で受け入れ基準を書く）
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>技術設計をdesign.md（またはplan.md）にまとめ、必要ならMermaid図を添える</span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>設計を小さなタスクに分解し、tasks.mdにチェックボックス形式で書き出す</span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>
                  Plan
                  Modeを解除して実装を進め、テストやスクリーンショットなど検証可能な基準を都度与える
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>
                  実装が終わったら、新しいセッション（サブエージェント）にレビューを依頼する
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>コミットメッセージとPRの説明にも、仕様との対応関係が分かるよう書く</span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>
                  うまくいかなかった箇所は、次回の仕様の書き方に反映させる（仕様は生きたドキュメントとして更新し続ける）
                </span>
              </label>
            </li>
          </ul>
        </section>

        <hr className={styles.divider} />

        {/* 13 */}
        <section id="s13">
          <span className={styles.secEyebrow}>13 / Summary</span>
          <h2>まとめ</h2>
          <p>
            仕様駆動開発は「AIに丸投げする」対極にある考え方です。要件・設計・タスクという3つのMarkdownファイルを軸に、人間がどのフェーズでも立ち止まってレビューできる「ゲート」を用意し、CLAUDE.md/AGENTS.mdでプロジェクト全体のルールを、SKILL.mdやサブエージェント定義で専門知識を、それぞれ適切な粒度でAIに渡していく――これが2026年8月時点での実務的なベストプラクティスの共通項です。
          </p>
          <p>
            最初から完璧な仕様書を書く必要はありません。Addy
            Osmani氏が述べるように、まずは高レベルな目的をAIに渡し、AI自身に詳細化させ、それを人間がレビューして磨き込んでいくという反復こそが、仕様駆動開発を継続可能にする鍵です。
          </p>
        </section>

        <hr className={styles.divider} />

        {/* 14 */}
        <section id="s14" className={styles.refs}>
          <span className={styles.secEyebrow}>14 / Sources</span>
          <h2>参考文献・出典</h2>
          <p>
            本ガイドの作成にあたり、2026年8月1日時点で以下の情報源をWeb検索・閲覧しました。原文からの長文引用は行わず、要約・翻訳・再構成しています。より正確な最新情報は各URLの原文をご参照ください。
          </p>

          <h3>Anthropic公式</h3>
          <ul>
            <li>
              <span className={styles.srcName}>
                Claude Code Best Practices（Anthropicエンジニアリングブログ）
              </span>
              <Ext href="https://www.anthropic.com/engineering/claude-code-best-practices">
                https://www.anthropic.com/engineering/claude-code-best-practices
              </Ext>
            </li>
            <li>
              <span className={styles.srcName}>同上・最新版ドキュメント</span>
              <Ext href="https://code.claude.com/docs/en/best-practices">
                https://code.claude.com/docs/en/best-practices
              </Ext>
            </li>
            <li>
              <span className={styles.srcName}>How Claude Code works in large codebases</span>
              <Ext href="https://claude.com/blog/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start">
                https://claude.com/blog/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start
              </Ext>
            </li>
          </ul>

          <h3>GitHub公式</h3>
          <ul>
            <li>
              <span className={styles.srcName}>
                spec-kit（GitHub公式リポジトリ, spec-driven.md）
              </span>
              <Ext href="https://github.com/github/spec-kit/blob/main/spec-driven.md">
                https://github.com/github/spec-kit/blob/main/spec-driven.md
              </Ext>
            </li>
            <li>
              <span className={styles.srcName}>spec-kit plan-template.md</span>
              <Ext href="https://github.com/github/spec-kit/blob/main/templates/plan-template.md">
                https://github.com/github/spec-kit/blob/main/templates/plan-template.md
              </Ext>
            </li>
            <li>
              <span className={styles.srcName}>
                GitHub Blog ― How to write a great agents.md: Lessons from over 2,500 repositories
              </span>
              <Ext href="https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/">
                https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/
              </Ext>
            </li>
          </ul>

          <h3>AWS公式（Kiro）</h3>
          <ul>
            <li>
              <span className={styles.srcName}>Kiro Docs ― Specs</span>
              <Ext href="https://kiro.dev/docs/specs/">https://kiro.dev/docs/specs/</Ext>
            </li>
            <li>
              <span className={styles.srcName}>Kiro Docs ― Feature Specs</span>
              <Ext href="https://kiro.dev/docs/specs/feature-specs/">
                https://kiro.dev/docs/specs/feature-specs/
              </Ext>
            </li>
            <li>
              <span className={styles.srcName}>
                Harness Engineering with Kiro（AWS Builder Center）
              </span>
              <Ext href="https://builder.aws.com/content/3DlOO7A9RFAazBbwbNl2iV8WHr9/harness-engineering-with-kiro-spec-driven-development-for-the-multi-agent-era">
                https://builder.aws.com/content/3DlOO7A9RFAazBbwbNl2iV8WHr9/harness-engineering-with-kiro-spec-driven-development-for-the-multi-agent-era
              </Ext>
            </li>
          </ul>

          <h3>著名な国際的開発者による記事</h3>
          <ul>
            <li>
              <span className={styles.srcName}>
                Addy Osmani（元Google Director、『Beyond Vibe Coding』著者）― How to write a good
                spec for AI agents
              </span>
              <Ext href="https://addyosmani.com/blog/good-spec/">
                https://addyosmani.com/blog/good-spec/
              </Ext>
            </li>
            <li>
              <span className={styles.srcName}>
                Simon Willison（Django共同開発者、Datasette開発者）― Agentic Engineering Patterns
              </span>
              <Ext href="https://simonw.substack.com/p/agentic-engineering-patterns">
                https://simonw.substack.com/p/agentic-engineering-patterns
              </Ext>
            </li>
          </ul>

          <h3>オープン標準・その他</h3>
          <ul>
            <li>
              <span className={styles.srcName}>AGENTS.md公式サイト</span>
              <Ext href="https://agents.md/">https://agents.md/</Ext>
            </li>
            <li>
              <span className={styles.srcName}>
                Microsoft Learn ― Get Started with Spec-Driven Development and GitHub Spec Kit
              </span>
              <Ext href="https://learn.microsoft.com/en-us/training/modules/spec-driven-development-github-spec-kit-greenfield-intro/">
                https://learn.microsoft.com/en-us/training/modules/spec-driven-development-github-spec-kit-greenfield-intro/
              </Ext>
            </li>
            <li>
              <span className={styles.srcName}>
                Tessl ― A look at Spec Kit, GitHub&apos;s spec-driven software development
                toolkit（Gojko Adzic氏の見解を含む）
              </span>
              <Ext href="https://tessl.io/blog/a-look-at-spec-kit-githubs-spec-driven-software-development-toolkit/">
                https://tessl.io/blog/a-look-at-spec-kit-githubs-spec-driven-software-development-toolkit/
              </Ext>
            </li>
          </ul>

          <p className={styles.disclaimer}>
            本ガイドはこれら一次情報・信頼できる情報源をもとに要約・翻訳・再構成したものです。フローチャートはすべてMermaid.jsで描画しており、ASCIIアートによる図解は使用していません。
          </p>
        </section>
      </main>
    </div>
  );
}
