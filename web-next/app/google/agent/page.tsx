import type { Metadata } from "next";
import type { ReactNode } from "react";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import { TocObserver } from "./TocObserver";

export const metadata: Metadata = {
  title:
    "AI仕様駆動開発とMarkdown ― Google Antigravityの Rules / Skills / Workflows / Artifacts 徹底ガイド | LLM コスト計算機",
  description:
    "AIエージェントIDE「Google Antigravity」が扱う4種類のMarkdownファイル（Rules / Skills / Workflows / Artifacts）の役割・置き場所・書き方・ベストプラクティスを体系化した完全ガイド。",
};

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_0 = `flowchart TB
    subgraph "人間が事前に定義するMarkdown"
        direction TB
        R["Rules<br/>行動規範・制約"]
        S["Skills<br/>専門知識パッケージ"]
        W["Workflows<br/>手順のマクロ"]
        R ~~~ S ~~~ W
    end
    U["開発者"] -->|作成・編集| R
    U -->|作成・編集| S
    U -->|呼び出し登録| W
    R -->|常時 または 条件付きで適用| A["Agent"]
    S -->|関連しそうなら読み込み| A
    W -->|スラッシュコマンドで起動| A
    A -->|生成| AR["Artifacts<br/>Plan・Task List・Walkthrough等"]
    AR -->|レビュー・コメント| U
    U -->|Proceed または 修正指示| A`;

const DIAGRAM_1 = `flowchart TB
    Start["Ruleファイルを保存する"] --> Mode{"どの発火方式を選ぶか"}
    Mode -->|Manual| M1["チャット欄で ＠ルール名 と明示的にメンションした時のみ適用"]
    Mode -->|Always On| M2["会話開始時に毎回自動で適用"]
    Mode -->|Model Decision| M3["説明文をもとにモデルが要否を自律判断"]
    Mode -->|Glob| M4["指定したglobパターンに一致するファイル操作時のみ適用"]`;

const DIAGRAM_2 = `flowchart LR
    D["① Discovery<br/>会話開始時にSkill名とdescriptionの一覧だけが見える"] --> A2["② Activation<br/>タスクに関連しそうだとモデルが判断したらSKILL.md全文を読み込む"] --> E["③ Execution<br/>読み込んだ指示に従ってタスクを遂行する"]`;

const DIAGRAM_3 = `flowchart LR
    U["ユーザーが /ship-feature を実行"] --> W1["Workflow: ship-feature"]
    W1 --> C1["手順内に「Run Testsを呼び出す」と記述"]
    C1 --> W2["Workflow: run-tests が実行される"]
    W2 --> C2["手順内に「Deployを呼び出す」と記述"]
    C2 --> W3["Workflow: deploy が実行される"]
    W3 --> Done["一連の作業が完了"]`;

const DIAGRAM_4 = `flowchart TB
    Task["ユーザーがタスクを依頼する"] --> Plan["Agentが Implementation Plan を生成"]
    Plan --> Review{"ユーザーがレビューする"}
    Review -->|コメントして修正を依頼| Plan
    Review -->|Proceed で承認| Exec["Agentがコード変更・テストを実行"]
    Exec --> TaskList["Task List で進捗をリアルタイムに可視化"]
    TaskList --> Walk["完了後 Walkthrough を生成"]
    Walk --> Confirm["ユーザーが最終確認する"]`;

const DIAGRAM_5 = `flowchart TB
    subgraph "常時ロードされるコンテキスト"
        direction TB
        RR["Rules"]
        SS["Skills"]
        RR ~~~ SS
    end
    WF["Workflow起動（/機能名）"] --> Plan["Implementation Plan を生成"]
    RR -.->|制約を適用| Plan
    SS -.->|専門知識を提供| Plan
    Plan --> Review{"人間がレビューする"}
    Review -->|修正を依頼| Plan
    Review -->|Proceedで承認| Exec["実装とテストを実行"]
    SS -.->|手順知識を提供| Exec
    Exec --> Walk["Walkthrough を生成"]
    Walk --> Done["人間が最終承認する"]`;

export default function AntigravitySpecPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <nav className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>AG</div>
          <div className={styles.brandText}>
            <strong>Antigravity 徹底ガイド</strong>Spec-Driven Development
          </div>
        </div>

        <div className={styles.navLabel}>目次</div>
        <ul className={styles.toc}>
          <li>
            <a href="#section-1">1. なぜMarkdownが仕様になるのか</a>
          </li>
          <li>
            <a href="#section-2">2. 全体像：4つの役割分担</a>
          </li>
          <li>
            <a href="#section-3">3. Step 1：Rules</a>
          </li>
          <li>
            <a href="#section-4">4. Step 2：Skills</a>
          </li>
          <li>
            <a href="#section-5">5. Step 3：Workflows</a>
          </li>
          <li>
            <a href="#section-6">6. Step 4：Artifacts</a>
          </li>
          <li>
            <a href="#section-7">7. 実践フロー</a>
          </li>
          <li>
            <a href="#section-8">8. ベストプラクティス</a>
          </li>
          <li>
            <a href="#section-9">9. よくある落とし穴</a>
          </li>
          <li>
            <a href="#section-10">10. 参考文献・情報源</a>
          </li>
        </ul>
      </nav>

      <main className={styles.main}>
        <header className={styles.hero} id="top">
          <div className={styles.heroEyebrow}>AI Spec-Driven Development Guide</div>
          <h1>
            AI仕様駆動開発とMarkdown
            <br />
            Google Antigravityの Rules / Skills / Workflows / Artifacts 徹底ガイド
          </h1>
          <p className={styles.heroSub}>
            対象読者：AIエージェントIDE「Google
            Antigravity」を初めて触る人、あるいは「AI仕様駆動開発（Spec-Driven Development,
            SDD）」という考え方を実務に落とし込みたい人向け。Antigravityが扱う4種類のMarkdownファイルそれぞれの役割・置き場所・書き方・ベストプラクティスを、手順を追って理解できるようにまとめました。
          </p>
          <div className={styles.callout}>
            <p>
              <strong>読む前に押さえておきたい1点：</strong>
              Rules・Skills・Workflowsは「人間があらかじめ書いて渡す仕様」、Artifactsは「エージェントがタスク遂行中に生成する仕様・記録」です。
            </p>
            <p>この非対称性さえ理解すれば、残りはすべてその応用にすぎません。</p>
          </div>
        </header>

        {/* 1 */}
        <section className={styles.section} id="section-1">
          <div className={styles.sectionNumber}>01 / イントロダクション</div>
          <h2>なぜ「Markdownが仕様になる」のか</h2>
          <div className={styles.prose}>
            <p>
              Spec-Driven Development（仕様駆動開発）とは、「なんとなく指示してAIに書かせる（vibe
              coding）」のではなく、
              <strong>
                仕様（spec）そのものを一次情報源（source of
                truth）とし、コードはその仕様から導かれる成果物として扱う
              </strong>
              という考え方です。GitHubのSpec Kit、AWSのKiro、Claude Codeのskills機能、CursorのPlan
              Modeなど、2026年時点で主要なAIコーディングツールはそれぞれ独自の形でこの思想を実装しています。
            </p>
            <p>
              Google
              Antigravityの場合、この「仕様」や「行動規範」「専門知識」「実行手順」を記述する媒体として、一貫して
              <strong>プレーンなMarkdownファイル</strong>
              が使われています。これは意図的な設計判断です。Antigravityの公式ドキュメントでも、Skillsの仕組みについて、あえてMarkdownとYAMLという広く理解されているフォーマットに乗せることで、IDEの機能拡張への参入障壁を下げていると説明されています。
            </p>
            <p>
              Antigravity自体は、VS
              Codeをベースにしたデスクトップ型のエージェント型開発プラットフォームで、2025年11月にGemini
              3と同時に発表されました。著名な開発者であるSimon
              Willisonは公開直後のレビューで、Antigravityの見た目は「よくあるVS
              Codeフォーク」だが、内部にはいくつか興味深い新しいアイデアがあると評しています。その「新しいアイデア」の中核が、これから解説する4種類のMarkdownファイルです。
            </p>
          </div>
          <a className={styles.backToTop} href="#top">
            ↑ 目次へ戻る
          </a>
        </section>

        {/* 2 */}
        <section className={styles.section} id="section-2">
          <div className={styles.sectionNumber}>02 / 全体像</div>
          <h2>全体像：4つのMarkdownファイルの役割分担</h2>
          <div className={styles.prose}>
            <p>まず全体像を1枚の図で押さえます。</p>
          </div>

          <div className={styles.diagramBlock}>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_0} id="diagram-0" />
            </div>
            <div className={styles.diagramCaption}>
              図1：Rules / Skills / Workflows / Artifacts の関係
            </div>
          </div>

          <div className={styles.prose}>
            <p>
              次に、それぞれの特徴を表で比較します。この4分類はAntigravityの公式ドキュメント構成（Customizations配下のSkills・Rules・Workflowsと、Artifacts配下のPlan・Walkthrough等）にそのまま対応しています。
            </p>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>Rules</th>
                  <th>Skills</th>
                  <th>Workflows</th>
                  <th>Artifacts</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>目的</strong>
                  </td>
                  <td>エージェントの振る舞いを常時／条件付きで制約する「憲法」</td>
                  <td>特定タスクのための専門知識・手順をパッケージ化する</td>
                  <td>定型作業を手順化し、スラッシュコマンドで再実行する</td>
                  <td>エージェントが思考・計画・実行結果を人間に伝える成果物</td>
                </tr>
                <tr>
                  <td>
                    <strong>誰が作る</strong>
                  </td>
                  <td>人間（開発者）</td>
                  <td>人間（開発者・チーム）</td>
                  <td>人間（または会話履歴からエージェントが自動生成）</td>
                  <td>エージェント自身</td>
                </tr>
                <tr>
                  <td>
                    <strong>発火のされ方</strong>
                  </td>
                  <td>Manual／Always On／Model Decision／Globの4種類</td>
                  <td>会話の文脈に応じてモデルが自律的に判断（progressive disclosure）</td>
                  <td>
                    <code>/workflow-name</code> のスラッシュコマンドで明示的に実行
                  </td>
                  <td>Planningモード中にエージェントが自動生成</td>
                </tr>
                <tr>
                  <td>
                    <strong>主な形式</strong>
                  </td>
                  <td>Markdown単体（frontmatterなし）</td>
                  <td>
                    フォルダ＋<code>SKILL.md</code>（YAML frontmatter必須）
                  </td>
                  <td>Markdown（タイトル・説明・手順のリスト）</td>
                  <td>Markdown（コードdiffや画像・録画を含む場合あり）</td>
                </tr>
                <tr>
                  <td>
                    <strong>文字数制限</strong>
                  </td>
                  <td>12,000文字</td>
                  <td>明記なし（詳細はscripts/やresources/へ分離）</td>
                  <td>12,000文字</td>
                  <td>明記なし</td>
                </tr>
                <tr>
                  <td>
                    <strong>具体例</strong>
                  </td>
                  <td>「マイグレーションファイルは確認なしに変更しない」</td>
                  <td>「PRレビューの手順」「安全なDBマイグレーション手順」</td>
                  <td>「/ship-feature（テスト実行→デプロイを一括実行）」</td>
                  <td>Implementation Plan、Task List、Walkthrough</td>
                </tr>
              </tbody>
            </table>
          </div>
          <a className={styles.backToTop} href="#top">
            ↑ 目次へ戻る
          </a>
        </section>

        {/* 3 */}
        <section className={styles.section} id="section-3">
          <div className={styles.sectionNumber}>03 / Step 1</div>
          <h2>Step 1：Rules ― エージェントの行動規範を定義する</h2>

          <h3>Rulesとは何か</h3>
          <div className={styles.prose}>
            <p>
              Rulesは、エージェントに常駐する「システムプロンプトの追加分」のようなものです。コーディング規約やアーキテクチャ上の制約、プロジェクト固有のルールを、毎回のチャットで繰り返し伝える代わりに、Markdownファイル1枚として保存しておく仕組みです。
            </p>
          </div>

          <h3>保存場所</h3>
          <div className={styles.prose}>
            <p>Rulesにはワークスペース単位とグローバル単位の2種類があり、保存先が異なります。</p>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>種類</th>
                  <th>保存場所</th>
                  <th>適用範囲</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Global Rules</td>
                  <td>
                    <code>~/.gemini/GEMINI.md</code>
                  </td>
                  <td>すべてのワークスペースに適用</td>
                </tr>
                <tr>
                  <td>Workspace Rules</td>
                  <td>
                    ワークスペース（またはgitルート）の <code>.agents/rules/</code> 配下
                  </td>
                  <td>そのワークスペースのみ</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.prose}>
            <p>
              公式ドキュメントによれば、Antigravityは現在 <code>.agents/rules</code>{" "}
              をデフォルトの保存場所としていますが、旧来の <code>.agent/rules</code>（
              <code>agent</code>
              が単数形）も後方互換として引き続きサポートされています。他のツールが生成した{" "}
              <code>.agent/</code>{" "}
              構成のプロジェクトを開いても問題なく動作する、という互換性への配慮です。
            </p>
          </div>

          <h3>発火方式（Activation）は4種類</h3>
          <div className={styles.prose}>
            <p>Rule単位で「いつ適用するか」を設定できます。</p>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>発火方式</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Manual</strong>
                  </td>
                  <td>
                    チャット入力欄で <code>@ルール名</code>{" "}
                    のように明示的にメンションした時だけ適用される
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Always On</strong>
                  </td>
                  <td>会話が始まるたびに常に適用される</td>
                </tr>
                <tr>
                  <td>
                    <strong>Model Decision</strong>
                  </td>
                  <td>
                    Ruleに書かれた自然言語の説明を手がかりに、適用すべきかどうかをモデル自身が判断する
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Glob</strong>
                  </td>
                  <td>
                    <code>*.js</code> や <code>{"src/**/*.ts"}</code>{" "}
                    のようなglobパターンに一致するファイルを操作する時だけ適用される
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.diagramBlock}>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_1} id="diagram-1" />
            </div>
            <div className={styles.diagramCaption}>図2：Ruleの4つの発火方式</div>
          </div>

          <h3>@ メンションで他ファイルを参照できる</h3>
          <div className={styles.prose}>
            <p>
              Rulesファイルの中では <code>@ファイル名</code>{" "}
              という記法で他のファイルを参照できます。相対パスならRuleファイルからの相対位置として、絶対パスならそのまま絶対パスとして解決されます。例えば{" "}
              <code>@/path/to/file.md</code> はまず <code>/path/to/file.md</code>{" "}
              として解決を試み、存在しなければワークスペース内の{" "}
              <code>workspace/path/to/file.md</code>{" "}
              として解決されます。これにより、共通のコーディング規約ドキュメントをRuleの中から引用するといった構成が可能になります。
            </p>
          </div>

          <h3>Rulesの実例</h3>
          <span className={styles.codeLabel}>Rule ファイル（frontmatter不要）</span>
          <pre className={styles.codeBlock}>
            <div className={styles.codeLine}># データベース関連の制約</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>
              - マイグレーションファイル（migrations/ 配下）は、明示的な確認なしに変更・削除しない
            </div>
            <div className={styles.codeLine}>
              - Prismaスキーマを唯一の正とし、生成されたマイグレーションを手で直接編集しない
            </div>
            <div className={styles.codeLine}>
              - 本番環境に影響するコマンドを実行する前には、必ず実行内容を要約して確認を求める
            </div>
          </pre>
          <div className={styles.prose}>
            <p>
              このような「やってはいけないこと（deny
              rule）」を明文化しておくと、後戻りできない事故（本番DBの破壊など）を未然に防げる、という指摘は複数の実務者ブログでも共通して強調されています。
            </p>
          </div>
          <a className={styles.backToTop} href="#top">
            ↑ 目次へ戻る
          </a>
        </section>

        {/* 4 */}
        <section className={styles.section} id="section-4">
          <div className={styles.sectionNumber}>04 / Step 2</div>
          <h2>Step 2：Skills ― 再利用可能な専門知識パッケージを作る</h2>

          <h3>Skillsとは何か</h3>
          <div className={styles.prose}>
            <p>
              Skillsは、特定の作業に関する「専門知識」と「手順」、そして必要に応じて「補助スクリプト」をひとまとめにしたフォルダです。Antigravityの公式ドキュメントは、SkillsをAgent
              Skillsという<strong>オープンな標準規格</strong>の実装として位置づけており、
              <code>SKILL.md</code> というファイル形式自体はAntigravity専用ではなく、Claude
              Code・Cursor・Gemini
              CLIなど複数のエージェントツール間で共通して使えるモデル非依存のフォーマットだと説明されています。
            </p>
          </div>

          <h3>フォルダ構成</h3>
          <div className={styles.prose}>
            <p>
              Skillは「フォルダ＋<code>SKILL.md</code>」という最小構成から始められます。
            </p>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>パス</th>
                  <th>必須／任意</th>
                  <th>役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>SKILL.md</code>
                  </td>
                  <td>必須</td>
                  <td>YAML frontmatter付きの本体。専門知識・手順の説明を書く</td>
                </tr>
                <tr>
                  <td>
                    <code>scripts/</code>
                  </td>
                  <td>任意</td>
                  <td>エージェントが実行できる補助スクリプト（Python・Bash・Node等）</td>
                </tr>
                <tr>
                  <td>
                    <code>examples/</code>
                  </td>
                  <td>任意</td>
                  <td>参考実装・サンプルコード</td>
                </tr>
                <tr>
                  <td>
                    <code>resources/</code>
                  </td>
                  <td>任意</td>
                  <td>テンプレートやその他の静的アセット</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>保存場所</h3>
          <div className={styles.prose}>
            <p>Skillsにもワークスペース単位とグローバル単位があります。</p>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>種類</th>
                  <th>保存場所</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Workspace Skills</td>
                  <td>
                    <code>&lt;ワークスペースルート&gt;/.agents/skills/&lt;skill-folder&gt;/</code>
                  </td>
                  <td>チームのデプロイ手順やテスト規約など、プロジェクト固有の作業</td>
                </tr>
                <tr>
                  <td>Global Skills</td>
                  <td>
                    <code>~/.gemini/config/skills/&lt;skill-folder&gt;/</code>
                  </td>
                  <td>個人的によく使うユーティリティなど、全プロジェクト共通の作業</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.prose}>
            <p>
              Rulesと同様に、Antigravityは現在 <code>.agents/skills</code> をデフォルトとしつつ、旧{" "}
              <code>.agent/skills</code> も後方互換としてサポートしています。
            </p>
          </div>

          <h3>SKILL.md のfrontmatterフィールド</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>フィールド</th>
                  <th>必須</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>name</code>
                  </td>
                  <td>任意</td>
                  <td>
                    Skillの一意な識別子（小文字・ハイフン区切り）。省略時はフォルダ名がそのまま使われる
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>description</code>
                  </td>
                  <td>必須</td>
                  <td>
                    Skillが何をするか、いつ使うべきかを説明する文。エージェントが「このSkillを使うべきか」を判断する材料になる
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.prose}>
            <p>
              公式ドキュメントは、descriptionを<strong>三人称で</strong>
              、かつエージェントがタスクとの関連性を認識しやすいキーワードを含めて書くことを推奨しています。例えば「Pythonコードに対してpytest規約に沿った単体テストを生成する」のように、具体的な動詞と対象を明示する書き方です。
            </p>
          </div>

          <h3>Skillはどう発火するか：progressive disclosure</h3>
          <div className={styles.prose}>
            <p>
              Skillsは「会話が始まった瞬間に全文が読み込まれる」わけではありません。次の3段階を踏む
              <strong>progressive disclosure（段階的開示）</strong>
              というパターンで動作します。
            </p>
          </div>

          <div className={styles.diagramBlock}>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_2} id="diagram-2" />
            </div>
            <div className={styles.diagramCaption}>
              図3：Skillのprogressive disclosure（段階的開示）
            </div>
          </div>

          <div className={styles.prose}>
            <p>
              この段階的開示により、使っていないSkillの詳細情報でコンテキストウィンドウを圧迫せずに済みます。ユーザー側からSkill名を明示的に指定して使わせることも可能です。
            </p>
          </div>

          <h3>Skills作成のベストプラクティス</h3>
          <div className={styles.prose}>
            <p>公式ドキュメントが挙げているポイントは次の4つです。</p>
            <ul>
              <li>
                <strong>1つのSkillには1つの役割だけを持たせる</strong>
                ：「何でも屋」のSkillではなく、独立したタスクごとに別々のSkillへ分割する
              </li>
              <li>
                <strong>descriptionを明確に書く</strong>
                ：エージェントがSkillを使うかどうかを判断する唯一の手がかりなので、具体性が重要
              </li>
              <li>
                <strong>スクリプトは「ブラックボックス」として扱わせる</strong>
                ：スクリプトを含む場合、エージェントにはソースコード全体を読ませるのではなく、まず{" "}
                <code>--help</code> を実行させて使い方を把握させる方が、コンテキストを節約できる
              </li>
              <li>
                <strong>複雑なSkillには判断ツリーを含める</strong>
                ：状況に応じてどちらのアプローチを取るべきか、Skillの中に条件分岐の説明を書いておく
              </li>
            </ul>
          </div>

          <h3>Skillsの実例</h3>
          <span className={styles.codeLabel}>SKILL.md</span>
          <pre className={styles.codeBlock}>
            <div className={styles.codeLine}>---</div>
            <div className={styles.codeLine}>name: code-review</div>
            <div className={styles.codeLine}>
              description:
              コードの変更をバグ・スタイル・ベストプラクティスの観点でレビューする。PRレビューやコード品質チェックの際に使用する。
            </div>
            <div className={styles.codeLine}>---</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}># コードレビューSkill</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>コードをレビューする際は、次の手順に従うこと。</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>## レビューチェックリスト</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>1. 正しさ：コードは意図通りに動作するか</div>
            <div className={styles.codeLine}>
              2. エッジケース：エラー条件は適切に処理されているか
            </div>
            <div className={styles.codeLine}>3. スタイル：プロジェクトの規約に沿っているか</div>
            <div className={styles.codeLine}>4. パフォーマンス：明らかな非効率はないか</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>## フィードバックの与え方</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>- 何を変更すべきか具体的に示す</div>
            <div className={styles.codeLine}>- 「何を」だけでなく「なぜ」を説明する</div>
            <div className={styles.codeLine}>- 可能であれば代替案を提示する</div>
          </pre>
          <a className={styles.backToTop} href="#top">
            ↑ 目次へ戻る
          </a>
        </section>

        {/* 5 */}
        <section className={styles.section} id="section-5">
          <div className={styles.sectionNumber}>05 / Step 3</div>
          <h2>Step 3：Workflows ― 手順を「マクロ」として自動化する</h2>

          <h3>WorkflowsとRulesの違い</h3>
          <div className={styles.prose}>
            <p>
              RulesとWorkflowsは、どちらもエージェントの動作をカスタマイズする仕組みですが、性質がまったく異なります。
            </p>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>Rules</th>
                  <th>Workflows</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>性質</strong>
                  </td>
                  <td>受動的な制約（常にバックグラウンドで効いているコンテキスト）</td>
                  <td>能動的な手順（ユーザーが明示的に呼び出して実行するタスク）</td>
                </tr>
                <tr>
                  <td>
                    <strong>発生するレベル</strong>
                  </td>
                  <td>プロンプトレベルの継続的なガイダンス</td>
                  <td>一連のタスクをつなぐ「トラジェクトリ」レベルの構造化された手順</td>
                </tr>
                <tr>
                  <td>
                    <strong>典型的な用途</strong>
                  </td>
                  <td>「常にTypeScriptの厳格モードを使う」等の恒常的な方針</td>
                  <td>「サービスをデプロイする」「PRコメントに対応する」等の繰り返し作業</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>保存場所と呼び出し方</h3>
          <div className={styles.prose}>
            <p>
              Workflowsもワークスペース単位・グローバル単位で保存でき、いずれもMarkdownファイルとして保存されます。作成は「Customizations」パネルの「Workflows」タブから、
              <code>+ Workspace</code> または <code>+ Global</code>{" "}
              ボタンで行います。保存後は、チャット欄で <code>/workflow-name</code>{" "}
              と入力するだけでいつでも呼び出せます。
            </p>
            <p>
              コミュニティの実践報告によれば、ワークスペースWorkflowsは{" "}
              <code>.agent/workflows/</code>（Rules・Skillsと同様に新バージョンでは{" "}
              <code>.agents/workflows/</code>{" "}
              に移行している可能性があります）、グローバルWorkflowsは{" "}
              <code>~/.gemini/antigravity/global_workflows/</code>{" "}
              に保存されるとされています。公式ドキュメントはUI操作の説明に留まり絶対パスまでは明記していないため、実際の保存先はインストールしているAntigravityのバージョンで確認することをおすすめします。
            </p>
            <p>
              Workflowファイルにもタイトル・説明・手順のリストを持たせる必要があり、Rulesと同じく1ファイルあたり12,000文字までという上限があります。
            </p>
          </div>

          <h3>Workflowは連鎖できる</h3>
          <div className={styles.prose}>
            <p>
              Workflowの中から別のWorkflowを呼び出すことができます。例えば「Ship
              Feature」というWorkflowの手順の中に「Run Testsを呼び出す」という指示を含めておけば、
              <code>/ship-feature</code> の実行が自動的に <code>/run-tests</code>{" "}
              の実行につながります。
            </p>
          </div>

          <div className={styles.diagramBlock}>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_3} id="diagram-3" />
            </div>
            <div className={styles.diagramCaption}>図4：Workflowの連鎖呼び出し</div>
          </div>

          <h3>エージェントにWorkflowを自動生成させる</h3>
          <div className={styles.prose}>
            <p>
              Antigravityでは、Workflowを手書きするだけでなく、エージェントに「今の手順をWorkflowとして保存して」と頼むこともできます。特に、エージェントと一緒に一連の作業を手動でこなした直後にお願いすると、その会話履歴を参考にした精度の高いWorkflowを自動生成してくれます。
            </p>
          </div>
          <a className={styles.backToTop} href="#top">
            ↑ 目次へ戻る
          </a>
        </section>

        {/* 6 */}
        <section className={styles.section} id="section-6">
          <div className={styles.sectionNumber}>06 / Step 4</div>
          <h2>Step 4：Artifacts ― エージェントの思考を可視化し人間がレビューする</h2>

          <h3>Artifactsとは何か</h3>
          <div className={styles.prose}>
            <p>
              Artifactは、エージェントがタスクを遂行し、その進捗や意図を人間に伝えるために生成する構造化された成果物です。リッチなMarkdown形式の計画書、コードdiff、アーキテクチャ図、画像、ブラウザ操作の録画などが含まれます。
            </p>
            <p>
              公式ドキュメントは、Artifactsの存在意義を「非同期的な協働（asynchronous
              collaboration）」の実現だと説明しています。エージェントがより自律的に長時間の複雑なタスクを実行するようになるほど、人間が一つひとつのツール呼び出しを同期的に監視する必要はなくなり、代わりに主要な節目で高レベルの成果物だけをレビューすればよくなる、という発想です。
            </p>
          </div>

          <h3>主なArtifactの種類</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Artifact</th>
                  <th>生成タイミング</th>
                  <th>役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Implementation Plan</strong>（実装計画）
                  </td>
                  <td>コード変更を始める前</td>
                  <td>どのファイルをどう変更するかという技術的な設計をレビューできるようにする</td>
                </tr>
                <tr>
                  <td>
                    <strong>Task List</strong>（タスクリスト）
                  </td>
                  <td>作業中随時更新</td>
                  <td>
                    調査・実装・検証といったエージェントの現在の取り組み方を、生きたMarkdownのスナップショットとして可視化する
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Walkthrough</strong>（完了報告）
                  </td>
                  <td>タスク完了後</td>
                  <td>
                    会話の中で何が行われたかを簡潔にまとめ、途中を追っていなくても状況を把握できるようにする
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Screenshots / Browser Recordings</strong>
                  </td>
                  <td>ブラウザを使った検証時</td>
                  <td>
                    ブラウザ用のサブエージェントが取得した、フロントエンドの見た目や動作の視覚的な証拠
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Knowledge</strong>（永続的な学習内容）
                  </td>
                  <td>プロジェクトを跨いだ知見の蓄積時</td>
                  <td>
                    プロジェクト固有のパターンや知見を記憶し、<code>product-guidelines.md</code>{" "}
                    のようなファイルを手動更新しなくても、エージェントが自分のスタイルを「学習」できるようにする
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>人間はArtifactsとどう関わるか（レビューのループ）</h3>
          <div className={styles.prose}>
            <p>
              Implementation
              Planは、既定の設定（「常に進める」以外の設定）では、コード変更に着手する前に必ずユーザーのレビューを要求します。ユーザーはプラン全体に対して「Proceed」ボタンで承認することも、個別の行にインラインコメントを残して「もっと影響範囲を小さくしてほしい」「別の技術スタックを使ってほしい」といった修正指示を出すこともできます。コメント後も「Proceed」で先に進めるか、「Review」トグルでコメント一覧をまとめて確認してからフィードバックを送るかを選べます。
            </p>
          </div>

          <div className={styles.diagramBlock}>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_4} id="diagram-4" />
            </div>
            <div className={styles.diagramCaption}>図5：Artifactの人間参加型レビューループ</div>
          </div>

          <h3>最重要のベストプラクティス：Planを安易に承認しない</h3>
          <div className={styles.prose}>
            <p>
              複数の実務者ブログが共通して指摘している落とし穴は、「コーディングに早く進みたいがために、Planの段階を機械的に承認してしまう」ことです。Artifactの本質は「コードdiffを読む」から「Artifactを読む」への習慣の転換であり、Implementation
              Planの段階でこそ厳しく内容を吟味すべきだとされています。ここで手を抜くと、後工程での手戻りコストの方がはるかに大きくなります。
            </p>
          </div>

          <h3>AntigravityのArtifactsが仕様駆動開発にもたらす違い</h3>
          <div className={styles.prose}>
            <p>
              Google Cloudのカスタマーエンジニアによる解説記事では、従来のSpec-Driven
              Developmentが「機能仕様・技術仕様・実装計画」といった固定のアーティファクト一式を毎回律儀に作成させる方式だったのに対し、Antigravityでは
              <strong>モデル自身が「このタスクにはどのArtifactが必要か」を判断する</strong>
              という違いが強調されています。例えば「タイポを直して」という単純なタスクにはImplementation
              Planを生成せずそのまま修正し、「認証システムをリファクタリングして」という複雑なタスクには詳細なPlanを自律的に生成する、という具合です。これにより、「シンプルな作業には仰々しすぎる」「複雑な作業には心もとない」という、固定テンプレート型の仕様駆動開発が抱えていたジレンマを緩和できるとされています。
            </p>
          </div>
          <a className={styles.backToTop} href="#top">
            ↑ 目次へ戻る
          </a>
        </section>

        {/* 7 */}
        <section className={styles.section} id="section-7">
          <div className={styles.sectionNumber}>07 / 統合フロー</div>
          <h2>4つを組み合わせる：仕様駆動開発の実践フロー</h2>
          <div className={styles.prose}>
            <p>
              ここまでのRules・Skills・Workflows・Artifactsを1つの図に統合すると、次のような循環になります。
            </p>
          </div>

          <div className={styles.diagramBlock}>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_5} id="diagram-5" />
            </div>
            <div className={styles.diagramCaption}>
              図6：Rules / Skills / Workflows / Artifacts を統合した実践フロー
            </div>
          </div>

          <div className={styles.prose}>
            <p>実際の運用イメージとしては、次のような役割分担になります。</p>
            <ol className={styles.steps}>
              <li>
                <strong>Rules</strong>
                で「触ってはいけないもの（DBマイグレーション等）」や「常に守るべき方針（言語・フレームワークの選択等）」を定義しておく
              </li>
              <li>
                <strong>Skills</strong>
                で「PRレビューの手順」「安全なマイグレーション手順」「仕様駆動開発そのものの進め方」など、繰り返し使う専門知識をパッケージ化しておく
              </li>
              <li>
                定型作業は<strong>Workflows</strong>として<code>/deploy</code>や
                <code>/ship-feature</code>
                のようなコマンドに落とし込み、いつでも同じ手順で再実行できるようにする
              </li>
              <li>
                実際の開発は、エージェントが自律的に生成する<strong>Artifacts</strong>（Plan → 実行
                → Walkthrough）を人間が都度レビューしながら進める
              </li>
            </ol>
            <p>
              Google
              Cloud発の解説記事が指摘するように、Antigravityは「厳格な指示で完全にAIを制御する」という従来のSDD観から一歩進み、「モデルに一定の裁量を持たせつつ、要所要所でArtifactsを介して人間がチェックする」という設計思想を採っています。GitHub
              Spec KitをAntigravity向けに移植したオープンソースプロジェクトも存在し、Workflows（
              <code>/</code>コマンド）とSkills（<code>@</code>
              メンション）を組み合わせて、要件定義から実装までのソフトウェア開発ライフサイクル全体を仕様駆動で進める、という応用例も報告されています。
            </p>
          </div>
          <a className={styles.backToTop} href="#top">
            ↑ 目次へ戻る
          </a>
        </section>

        {/* 8 */}
        <section className={styles.section} id="section-8">
          <div className={styles.sectionNumber}>08 / チェックリスト</div>
          <h2>ベストプラクティス・チェックリスト</h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>チェック項目</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    Global
                    Ruleは「すべてのプロジェクトで常に守りたい方針」だけに絞り、プロジェクト固有の事情はWorkspace
                    Ruleに書く
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    破壊的操作（DBマイグレーション、本番デプロイ等）は明示的な「deny
                    rule」としてRuleに書き出す
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    Ruleの発火方式（Manual/Always On/Model
                    Decision/Glob）は、内容の重要度と適用範囲に応じて使い分ける
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Skillは1つにつき1つの役割だけを持たせ、「何でも屋」化させない</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>
                    SKILL.mdのdescriptionは三人称・具体的なキーワード付きで書き、エージェントが自律的に発見できるようにする
                  </td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>
                    Skillに補助スクリプトを含める場合は、まず <code>--help</code>{" "}
                    で使い方を確認させる運用にし、ソース全文を読ませない
                  </td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>
                    繰り返し行う定型作業（デプロイ・PR対応等）は早めにWorkflow化し、
                    <code>/コマンド</code> として再利用する
                  </td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>
                    一連の作業をエージェントと手動でこなした直後は、「今の手順をWorkflowにして」と依頼して自動生成させる
                  </td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>
                    Implementation Planは自動承認（Always
                    Proceed）に頼りきらず、特に複雑なタスクでは内容を吟味してからProceedする
                  </td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>
                    Walkthroughは、離席していた間の変更内容を追いつくための一次情報として活用する
                  </td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>
                    Rules・Skills・Workflowsはgit管理下に置き、チーム全体で同じ行動規範・専門知識・手順を共有する
                  </td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>
                    <code>.agent/</code> 系と <code>.agents/</code>{" "}
                    系のどちらが有効になっているか、使用中のAntigravityのバージョンで確認する
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <a className={styles.backToTop} href="#top">
            ↑ 目次へ戻る
          </a>
        </section>

        {/* 9 */}
        <section className={styles.section} id="section-9">
          <div className={styles.sectionNumber}>09 / アンチパターン</div>
          <h2>よくある落とし穴（アンチパターン）</h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>落とし穴</th>
                  <th>内容</th>
                  <th>対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Planの機械的承認</strong>
                  </td>
                  <td>
                    コーディングに早く進みたいがためにImplementation
                    Planを吟味せず「Proceed」してしまう
                  </td>
                  <td>複雑なタスクほど、Plan段階でのレビューに時間をかける運用を徹底する</td>
                </tr>
                <tr>
                  <td>
                    <strong>Skillの肥大化</strong>
                  </td>
                  <td>1つのSKILL.mdに何でも詰め込み、「何でも屋Skill」になってしまう</td>
                  <td>タスクの種類ごとにSkillを分割し、descriptionを具体的に保つ</td>
                </tr>
                <tr>
                  <td>
                    <strong>保存場所の思い込み</strong>
                  </td>
                  <td>
                    <code>.agent/</code> と <code>.agents/</code>{" "}
                    の新旧混在、Global/Workspaceの取り違えにより、意図したRule・Skillが読み込まれない
                  </td>
                  <td>公式ドキュメントとインストール済みバージョンの両方で保存先を確認する</td>
                </tr>
                <tr>
                  <td>
                    <strong>機密情報の書き込み</strong>
                  </td>
                  <td>
                    RuleやSkill、あるいはコード中のコメントにAPIキー等の機密情報を書いてしまう
                  </td>
                  <td>機密情報は環境変数や秘密管理サービスに置き、Markdownファイルには含めない</td>
                </tr>
                <tr>
                  <td>
                    <strong>外部コンテンツ経由の指示注入</strong>
                  </td>
                  <td>
                    第三者が用意したドキュメントやコードコメントに隠された指示を、エージェントがそのまま実行してしまうリスク
                  </td>
                  <td>
                    外部から取り込むファイルやリンクの内容は鵜呑みにせず、機密操作の前には人間の確認を挟む
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Workflowの1本道信仰</strong>
                  </td>
                  <td>
                    すべての作業をWorkflowで固定化しすぎ、モデルの自律的な判断の余地を奪ってしまう
                  </td>
                  <td>
                    定型作業はWorkflow化する一方、探索的なタスクはAgentの裁量とArtifactsレビューに委ねる
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <a className={styles.backToTop} href="#top">
            ↑ 目次へ戻る
          </a>
        </section>

        {/* 10 */}
        <section className={styles.section} id="section-10">
          <div className={styles.sectionNumber}>10 / 出典</div>
          <h2>参考文献・情報源</h2>
          <div className={styles.prose}>
            <p>
              本ガイドは、2026年7月26日時点で参照可能な以下の一次情報・著名な開発者による解説記事をもとに作成しました。
            </p>
          </div>

          <div className={styles.refGroupTitle}>Google公式ドキュメント</div>
          <ul className={styles.refList}>
            <li>
              <span className={styles.refTitle}>
                Google Antigravity Docs, &quot;Rules&quot; / &quot;Workflows&quot;
              </span>
              <Ext href="https://antigravity.google/docs/rules-workflows">
                https://antigravity.google/docs/rules-workflows
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                Google Antigravity Docs, &quot;Agent Skills&quot;
              </span>
              <Ext href="https://antigravity.google/docs/skills">
                https://antigravity.google/docs/skills
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                Google Antigravity Docs, &quot;Artifacts Overview&quot;
              </span>
              <Ext href="https://antigravity.google/docs/artifacts">
                https://antigravity.google/docs/artifacts
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                Google Antigravity Docs, &quot;Implementation Plan&quot;
              </span>
              <Ext href="https://antigravity.google/docs/ide/implementation-plan">
                https://antigravity.google/docs/ide/implementation-plan
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                Google Antigravity Docs, &quot;Walkthrough&quot;
              </span>
              <Ext href="https://antigravity.google/docs/ide/walkthrough">
                https://antigravity.google/docs/ide/walkthrough
              </Ext>
            </li>
          </ul>

          <div className={styles.refGroupTitle}>Google公式 Codelabs</div>
          <ul className={styles.refList}>
            <li>
              <span className={styles.refTitle}>
                &quot;Authoring Google Antigravity Skills&quot;
              </span>
              <Ext href="https://codelabs.developers.google.com/getting-started-with-antigravity-skills">
                https://codelabs.developers.google.com/getting-started-with-antigravity-skills
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                &quot;Build Autonomous Developer Pipelines using agents.md and skills.md in
                Antigravity&quot;
              </span>
              <Ext href="https://codelabs.developers.google.com/autonomous-ai-developer-pipelines-antigravity">
                https://codelabs.developers.google.com/autonomous-ai-developer-pipelines-antigravity
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                &quot;Spec-Driven ADK Agent Development with Antigravity and Spec-kit&quot;
              </span>
              <Ext href="https://codelabs.developers.google.com/sdd-adk-antigravity">
                https://codelabs.developers.google.com/sdd-adk-antigravity
              </Ext>
            </li>
          </ul>

          <div className={styles.refGroupTitle}>著名な開発者・実務者による解説記事</div>
          <ul className={styles.refList}>
            <li>
              <span className={styles.refTitle}>
                Simon Willison, &quot;Google Antigravity&quot;（Antigravity発表直後の一次レビュー）
              </span>
              <Ext href="https://simonwillison.net/2025/Nov/18/google-antigravity/">
                https://simonwillison.net/2025/Nov/18/google-antigravity/
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                Giovanni Galloro（Google Cloudカスタマーエンジニア）, &quot;How Google Antigravity
                is changing spec-driven development&quot;
              </span>
              <Ext href="https://medium.com/google-cloud/benefits-and-challenges-of-spec-driven-development-and-how-antigravity-is-changing-the-game-3343a6942330">
                https://medium.com/google-cloud/benefits-and-challenges-of-spec-driven-development-and-how-antigravity-is-changing-the-game-3343a6942330
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                Amulya Bhatia, &quot;Advanced Tips for Mastering Google Antigravity&quot;
              </span>
              <Ext href="https://iamulya.one/posts/advanced-tips-for-mastering-google-antigravity/">
                https://iamulya.one/posts/advanced-tips-for-mastering-google-antigravity/
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                Alex Merced, &quot;Context Management Strategies for Google Antigravity: A Complete
                Guide to the Agent-First IDE&quot;
              </span>
              <Ext href="https://iceberglakehouse.com/posts/2026-03-context-google-antigravity/">
                https://iceberglakehouse.com/posts/2026-03-context-google-antigravity/
              </Ext>
            </li>
          </ul>

          <div className={styles.noteBox}>
            <strong>注記：</strong>
            Workflowsの保存先の絶対パス（特にグローバルWorkflowsの格納場所）については、公式ドキュメントではUI操作のみが説明されており、ファイルシステム上のパスは明記されていません。本ガイドで示したパスはコミュニティによる実地検証の報告に基づくものであり、Antigravityのバージョンによって変わる可能性があります。実際の運用では、お使いのバージョンのCustomizationsパネルで挙動を確認してください。
          </div>
          <a className={styles.backToTop} href="#top">
            ↑ 目次へ戻る
          </a>
        </section>

        <footer className={styles.footer}>
          AI仕様駆動開発とMarkdown ― Google Antigravity Rules / Skills / Workflows / Artifacts
          徹底ガイド ｜ 作成日：2026年7月26日時点の情報に基づく
        </footer>
      </main>
    </div>
  );
}
