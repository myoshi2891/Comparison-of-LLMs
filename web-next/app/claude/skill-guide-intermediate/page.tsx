import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import SkillGuideClient from "./SkillGuideClient";

export const metadata: Metadata = {
  title: "SKILL.md 実践ガイド — Claude Code Agent Skills のベストプラクティス",
  description:
    "Claude Code を業務で使い込んでいる中級者〜上級者向けに、SKILL.md の設計思想・書き方・Claude Code固有のフロントマター・評価運用フローまでをステップバイステップで解説する。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_DECISION = `flowchart TB
    Q["拡張したい振る舞いは?"] --> A{"毎セッション常時必要な方針か"}
    A -->|"Yes"| CM["CLAUDE.mdに書く"]
    A -->|"No"| B{"独立コンテキストで実行するタスクか"}
    B -->|"Yes"| SA["Subagentを使う"]
    B -->|"No"| C{"外部サービスへのリアルタイム接続が必要か"}
    C -->|"Yes"| MCPN["MCPサーバーを使う"]
    C -->|"No"| D{"手順や知識を繰り返し再利用したいか"}
    D -->|"Yes"| SK["Skill(SKILL.md)を作る"]
    D -->|"No"| P["通常のプロンプトで対応"]

    classDef pick fill:#2e1f5c,stroke:#c4b5fd,color:#ede9fe;
    class CM,SA,MCPN,SK pick;`;

const DIAGRAM_DISCLOSURE = `flowchart TB
    A["セッション開始"] --> B["Level1: メタデータ読込(約100トークン)"]
    B --> C{"descriptionとタスクが一致するか"}
    C -->|"一致しない"| D["それ以上ロードしない(コストゼロ)"]
    C -->|"一致する"| E["Level2: SKILL.md本文を読込(5000トークン未満推奨)"]
    E --> F{"他ファイルへの参照があるか"}
    F -->|"なし"| G["そのままタスクを実行"]
    F -->|"あり"| H["Level3: 参照ファイル/スクリプトを必要分だけ読込"]
    H --> G

    classDef lvl1 fill:#5c2a1a,stroke:#fdba8c,color:#fff1e8;
    classDef lvl2 fill:#0f3d38,stroke:#99f6e4,color:#ecfdf9;
    classDef lvl3 fill:#2e1f5c,stroke:#c4b5fd,color:#ede9fe;
    class B lvl1;
    class E lvl2;
    class H lvl3;`;

const DIAGRAM_DIR = `flowchart LR
    subgraph DIR["pdf-processing/ディレクトリ"]
        S["SKILL.md(必須)"]
        F["FORMS.md(参照)"]
        R["REFERENCE.md(参照)"]
        SC["scripts/"]
        P1["fill_form.py"]
        V1["validate.py"]
    end
    S -.->|"参照"| F
    S -.->|"参照"| R
    S -.->|"実行"| SC
    SC --- P1
    SC --- V1

    classDef req fill:#5c2a1a,stroke:#fdba8c,color:#fff1e8;
    classDef ref fill:#0f3d38,stroke:#99f6e4,color:#ecfdf9;
    classDef code fill:#2e1f5c,stroke:#c4b5fd,color:#ede9fe;
    class S req;
    class F,R ref;
    class SC,P1,V1 code;`;

const DIAGRAM_LOOP = `flowchart LR
    A["変更を加える"] --> B["検証スクリプトを実行"]
    B --> C{"検証は成功したか"}
    C -->|"失敗"| D["エラーを確認し修正"]
    D --> B
    C -->|"成功"| E["次のステップへ進む"]

    classDef ng fill:#4a1414,stroke:#fca5a5,color:#fef2f2;
    classDef ok fill:#0d3d2a,stroke:#86efac,color:#ecfdf5;
    class D ng;
    class E ok;`;

const DIAGRAM_EVAL = `flowchart LR
    A1["Claude Aとスキルなしでタスク実施"] --> A2["繰り返し提供する文脈を特定"]
    A2 --> A3["Claude AにSKILL.md作成を依頼"]
    A3 --> A4["冗長な説明を削り簡潔化"]
    A4 --> B1["Claude B(Skill読込済み)で実タスク実行"]
    B1 --> B2{"想定通り動作したか"}
    B2 -->|"No"| A3
    B2 -->|"Yes"| CN["チームへ共有しevals.json化"]

    classDef design fill:#2e1f5c,stroke:#c4b5fd,color:#ede9fe;
    classDef test fill:#0f3d38,stroke:#99f6e4,color:#ecfdf9;
    class A1,A2,A3,A4 design;
    class B1,B2,CN test;`;

export default function Page() {
  return (
    <SkillGuideClient>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>
            <i className="ti ti-brand-claude" />
            Claude Code / Agent Skills
          </div>
          <h1>SKILL.md 実践ガイド</h1>
          <p className={styles.lead}>
            Claude Code を業務で使い込んでいる中級者〜上級者向けに、SKILL.md の設計思想・書き方・Claude Code固有のフロントマター・評価運用フローまでをステップバイステップで解説する。
          </p>
          <div className={styles.metaBox}>
            <div className={styles.metaChip}>
              <i className="ti ti-target-arrow" />
              対象: 中級者〜上級者
            </div>
            <div className={styles.metaChip}>
              <i className="ti ti-calendar" />
              情報基準日: 2026年7月26日
            </div>
            <div className={styles.metaChip}>
              <i className="ti ti-list-check" />
              公式ドキュメント + 著名開発者の一次情報
            </div>
          </div>
        </div>

        <section id="intro" className={styles.section}>
          <h2>
            <i className="ti ti-info-circle" /> はじめに — なぜ今 SKILL.md なのか
          </h2>
          <p>
            Claude Code における「振る舞いの拡張」には CLAUDE.md、Skills、Subagents、MCP という複数の選択肢がある。この中で Skills（
            <code className={styles.codeInline}>SKILL.md</code>
            ）は、2025年10月の発表以降、コミュニティで急速に採用が広がっている仕組みである。Django の共同開発者として知られる著名開発者 Simon Willison は、発表当日に「Claude Skills はすごい。MCP より大きなインパクトを持つかもしれない」という趣旨の考察を公開し、その理由として、SKILL.md が Markdown ファイル + YAML フロントマターというだけの、概念的に極めてシンプルな仕組みでありながら、トークン効率が非常に高い点を挙げている（出典は末尾を参照）。
          </p>
          <p>
            このガイドでは、公式ドキュメントの内容を土台にしながら、実務で SKILL.md を設計・運用するための手順を段階的に解説する。
          </p>

          <h3>CLAUDE.md / Skills / Subagents / MCP の使い分け</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>選択肢</th>
                  <th>読み込まれるタイミング</th>
                  <th>向いている用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CLAUDE.md</td>
                  <td>毎セッション常時</td>
                  <td>プロジェクト全体に関わる短い方針・規約</td>
                </tr>
                <tr>
                  <td>Skills (SKILL.md)</td>
                  <td>関連タスク検出時にオンデマンド</td>
                  <td>再利用したい手順・ワークフロー・ドメイン知識</td>
                </tr>
                <tr>
                  <td>Subagents</td>
                  <td>明示的に委譲したとき</td>
                  <td>独立したコンテキストで動かしたい専門タスク</td>
                </tr>
                <tr>
                  <td>MCP</td>
                  <td>ツール呼び出し時</td>
                  <td>外部サービスへのライブ・双方向アクセス</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_DECISION} />
            <p className={styles.diagramCaption}>図: 4つの選択肢の判断フロー</p>
          </div>
        </section>

        <section id="architecture" className={styles.section}>
          <h2>
            <i className="ti ti-stack-2" /> Progressive Disclosure — Skillのアーキテクチャ
          </h2>
          <p>
            Skills を正しく設計する上で最も重要な前提は、すべての情報が常にコンテキストに乗るわけではないという点である。Claude Code は Skill の内容を3段階（Progressive Disclosure）で読み込む。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_DISCLOSURE} />
            <p className={styles.diagramCaption}>図: Progressive Disclosureの3段階読み込みフロー</p>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>レベル</th>
                  <th>読み込まれるタイミング</th>
                  <th>トークンコストの目安</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Level 1: メタデータ</td>
                  <td>常時(起動時)</td>
                  <td>1 Skillあたり約100トークン</td>
                  <td>YAMLフロントマターの name と description</td>
                </tr>
                <tr>
                  <td>Level 2: 本文</td>
                  <td>Skillが発火した時</td>
                  <td>5,000トークン未満を推奨</td>
                  <td>SKILL.md のMarkdown本体(手順・ガイダンス)</td>
                </tr>
                <tr>
                  <td>Level 3: 参照/コード</td>
                  <td>必要になった時のみ</td>
                  <td>参照されるまで0</td>
                  <td>追加のMarkdownファイル、テンプレート、実行スクリプト</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-bulb" />
            <p>
              <strong>設計の要点:</strong>
              スクリプトのコード自体はコンテキストに載らず、実行結果だけがトークンを消費する。したがって、Skillフォルダにどれだけ大量の参照資料やスクリプトを同梱しても、実際に読まれない限りコストはかからない。Simon Willisonはこの点を「非常にトークン効率が良い」設計と評している。
            </p>
          </div>
        </section>

        <div className={styles.divider} />

        <section id="step1" className={styles.section}>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepBadge}>1</span> ギャップを特定する(評価駆動開発から始める)
          </h2>
          <p>
            公式のベストプラクティスは「ドキュメントを書く前に評価(eval)を作れ」という原則を強調している。手順は次の通り。
          </p>
          <ol>
            <li>
              Skillなしで、Claude(Claude Aと呼ぶ)に代表的なタスクを実施させ、具体的にどこで失敗するか・何度も同じ指示を与えているかを観察する
            </li>
            <li>その失敗パターンをカバーする3つ程度のテストシナリオを作る</li>
            <li>Skillなしでのベースライン挙動を記録する</li>
            <li>ギャップを埋める最小限の指示だけを SKILL.md に書く</li>
            <li>評価を実行し、ベースラインと比較しながら改善する</li>
          </ol>
          <p>
            「想像上の要件」ではなく「実際に発生した失敗」を出発点にすることで、無駄に長いドキュメントを避けられる。
          </p>
        </section>

        <section id="step2" className={styles.section}>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepBadge}>2</span> ディレクトリ構成を設計する
          </h2>
          <p>
            Skillは1つのディレクトリで、SKILL.md だけが必須である。それ以外は用途に応じて自由に追加できる。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_DIR} />
            <p className={styles.diagramCaption}>図: Skillディレクトリの構成例</p>
          </div>

          <p>配置場所によって、そのSkillが誰から見えるかが決まる。</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>配置場所</th>
                  <th>パス</th>
                  <th>適用範囲</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Enterprise</td>
                  <td>管理設定(managed settings)経由</td>
                  <td>組織内の全ユーザー</td>
                </tr>
                <tr>
                  <td>Personal</td>
                  <td><code className={styles.codeInline}>~/.claude/skills/&lt;skill-name&gt;/SKILL.md</code></td>
                  <td>自分の全プロジェクト</td>
                </tr>
                <tr>
                  <td>Project</td>
                  <td><code className={styles.codeInline}>.claude/skills/&lt;skill-name&gt;/SKILL.md</code></td>
                  <td>このプロジェクトのみ</td>
                </tr>
                <tr>
                  <td>Plugin</td>
                  <td><code className={styles.codeInline}>&lt;plugin&gt;/skills/&lt;skill-name&gt;/SKILL.md</code></td>
                  <td>プラグインが有効な範囲</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            同名のSkillが複数レベルに存在する場合は、Enterprise &gt; Personal &gt; Project の順で優先される。モノレポでは <code className={styles.codeInline}>packages/frontend/.claude/skills/</code> のようにネストした場所にもSkillを置け、その配下のファイルを扱っているときだけ自動的に読み込まれる。
          </p>
        </section>

        <section id="step3" className={styles.section}>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepBadge}>3</span> YAMLフロントマターを書く
          </h2>
          <p>
            SKILL.md の <code className={styles.codeInline}>name</code> と <code className={styles.codeInline}>description</code> は推奨される任意フィールドである。省略時、nameにはディレクトリ名または同等の識別子が使われ、descriptionには本文の最初の段落が使われる。指定する場合のバリデーションルールは以下の通り。
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>フィールド</th>
                  <th>要件</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code className={styles.codeInline}>name</code></td>
                  <td>
                    任意。指定する場合は最大64文字、小文字英数字とハイフンのみ、XMLタグ不可、予約語(anthropic, claude)不可
                  </td>
                </tr>
                <tr>
                  <td><code className={styles.codeInline}>description</code></td>
                  <td>
                    任意。指定する場合は空文字不可、最大1,024文字(Claude Code上の一覧表示では when_to_use と合算で1,536文字が上限)、XMLタグ不可
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <span className={styles.codeLabel}>
            <i className="ti ti-code" />
            SKILL.md 推奨例
          </span>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>---</div>
            <div className={styles.codeLine}>name: processing-pdfs</div>
            <div className={styles.codeLine}>description: PDFファイルからテキストや表を抽出し、フォーム入力やドキュメント結合を行う。PDF、フォーム、ドキュメント抽出についてユーザーが言及した場合に使用する。</div>
            <div className={styles.codeLine}>---</div>
          </div>

          <p>
            命名規則は「動名詞(-ing形)」が推奨されている。避けるべき命名の例: <code className={styles.codeInline}>helper</code> / <code className={styles.codeInline}>utils</code> / <code className={styles.codeInline}>tools</code> のような曖昧な名前、<code className={styles.codeInline}>documents</code> / <code className={styles.codeInline}>data</code> のような汎用すぎる名前。
          </p>
        </section>

        <section id="step4" className={styles.section}>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepBadge}>4</span> 発見可能性を高める description の書き方
          </h2>
          <p>
            <code className={styles.codeInline}>description</code> はClaudeが「このSkillを今使うべきか」を判断する唯一の材料である。以下の原則を守る。
          </p>
          <ul>
            <li>
              必ず三人称で書く(description はシステムプロンプトに注入されるため、視点が一貫しないと発見精度が落ちる)
            </li>
            <li>「何をするか」と「いつ使うか」の両方を書く</li>
            <li>具体的なトリガーワードを含める</li>
          </ul>

          <div className={styles.compareGrid}>
            <div className={`${styles.compareCard} ${styles.compareCardGood}`}>
              <div className={styles.compareLabel}>
                <i className="ti ti-check" />
                良い例
              </div>
              <p>
                Excelファイルを解析し、ピボットテーブルを作成し、チャートを含むレポートを生成する。Excelファイル、スプレッドシート、表形式データ、.xlsxファイルを扱う際に使用する。
              </p>
            </div>
            <div className={`${styles.compareCard} ${styles.compareCardBad}`}>
              <div className={styles.compareLabel}>
                <i className="ti ti-x" />
                避けるべき例
              </div>
              <p>ドキュメントを助けます</p>
            </div>
          </div>
        </section>

        <section id="step5" className={styles.section}>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepBadge}>5</span> 本文(Level 2)を簡潔に書く
          </h2>
          <p>
            Level 2 に読み込まれた本文は、会話履歴や他のコンテキストと同じ枠を奪い合う。公式ガイドの前提は「Claudeはすでに十分賢い」であり、Claudeがすでに知っていることの説明を書かないことが核心である。
          </p>
          <p>
            例えば、PDFの説明から入るのではなく、いきなり具体的なコードとライブラリ名を示す方が良い、という考え方である。「なぜpdfplumberが良いか」を長々と説明する必要はなく、「pdfplumberを使う」と書いてコード例を1つ示せば十分、というのが公式の姿勢である。
          </p>
          <p>また、指示の自由度(degrees of freedom)はタスクの性質に応じて調整する。</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>自由度</th>
                  <th>適するケース</th>
                  <th>書き方</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>高</td>
                  <td>複数のアプローチが有効、状況に応じた判断が必要</td>
                  <td>「コードレビューでは構造を分析し、バグを確認し…」のような方針ベースの文章</td>
                </tr>
                <tr>
                  <td>中</td>
                  <td>好ましいパターンはあるが多少のばらつきは許容</td>
                  <td>パラメータ付きの疑似コードやテンプレート関数</td>
                </tr>
                <tr>
                  <td>低</td>
                  <td>操作が壊れやすく再現性が最重要</td>
                  <td>「このスクリプトを一字一句そのまま実行せよ」という具体的コマンド</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-bulb" />
            <p>
              公式ドキュメントの比喩がわかりやすい。「両側が崖の細い橋」なら低自由度(DBマイグレーションのように失敗が許されない)、「障害物のない野原」なら高自由度(コードレビューのように多様な正解がある)と例えられている。
            </p>
          </div>
        </section>

        <section id="step6" className={styles.section}>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepBadge}>6</span> Progressive Disclosureのパターンを設計する
          </h2>
          <p>
            本文が長くなりそうな場合、以下の3パターンのいずれかで分割する。共通ルールは「参照は SKILL.md から1階層のみ」にすることである。ネストした参照(SKILL.md → advanced.md → details.md)は、Claudeが <code className={styles.codeInline}>head -100</code> のような部分読み込みで済ませてしまい、情報が欠落するリスクがある。
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>パターン</th>
                  <th>使いどころ</th>
                  <th>構成イメージ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>概要+参照型</td>
                  <td>クイックスタートと詳細ガイドを分離したい</td>
                  <td>SKILL.md に基本、FORMS.md / REFERENCE.md / EXAMPLES.md に詳細</td>
                </tr>
                <tr>
                  <td>ドメイン別分割型</td>
                  <td>複数の業務領域を扱うSkill(BigQueryの財務/営業/プロダクト等)</td>
                  <td><code className={styles.codeInline}>reference/finance.md</code> のようにドメインごとにファイル分割</td>
                </tr>
                <tr>
                  <td>条件分岐型</td>
                  <td>基本操作と高度な操作で必要な知識が大きく異なる</td>
                  <td>基本はSKILL.mdに直接、高度な操作は別ファイルへリンク</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            100行を超える参照ファイルには目次を付け、Claudeが部分読み込みでも全体像を把握できるようにする。
          </p>
        </section>

        <section id="step7" className={styles.section}>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepBadge}>7</span> ワークフローとフィードバックループを組み込む
          </h2>
          <p>
            複雑な操作は明確なステップに分解し、複雑なワークフローには「コピーしてチェックを付けていけるチェックリスト」を用意すると、手順の飛ばしを防げる。
          </p>
          <p>さらに効果が高いのが「検証→修正→再検証」のフィードバックループである。</p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_LOOP} />
            <p className={styles.diagramCaption}>図: 検証・修正フィードバックループ</p>
          </div>
          <p>
            このパターンはコード実行を伴うSkillだけでなく、「STYLE_GUIDE.mdと照合してレビューする」のようなコードなしのSkillにも適用できる。
          </p>
        </section>

        <section id="step8" className={styles.section}>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepBadge}>8</span> Claude Code 固有のフロントマターを使いこなす
          </h2>
          <p>
            Claude Code は Agent Skills のオープン標準を拡張し、name / description 以外にも多数のフロントマターフィールドをサポートしている(すべて任意項目)。
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>フィールド</th>
                  <th>役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code className={styles.codeInline}>when_to_use</code></td>
                  <td>発火条件の補足(description と合算で1,536文字上限)</td>
                </tr>
                <tr>
                  <td><code className={styles.codeInline}>argument-hint</code></td>
                  <td>オートコンプリート時に表示される引数のヒント(例: [issue-number])</td>
                </tr>
                <tr>
                  <td><code className={styles.codeInline}>arguments</code></td>
                  <td><code className={styles.codeInline}>$name</code> 形式で参照できる名前付き引数のリスト</td>
                </tr>
                <tr>
                  <td><code className={styles.codeInline}>disable-model-invocation</code></td>
                  <td>true にするとClaudeによる自動発火を禁止し、/name での手動実行のみに限定</td>
                </tr>
                <tr>
                  <td><code className={styles.codeInline}>user-invocable</code></td>
                  <td>false にすると / メニューから隠し、Claude専用の背景知識として扱う</td>
                </tr>
                <tr>
                  <td><code className={styles.codeInline}>allowed-tools</code></td>
                  <td>そのSkillが発火したターンに限り、確認なしで使えるツールを許可</td>
                </tr>
                <tr>
                  <td><code className={styles.codeInline}>disallowed-tools</code></td>
                  <td>そのターンの間、特定ツールを利用不可にする</td>
                </tr>
                <tr>
                  <td><code className={styles.codeInline}>model</code> / <code className={styles.codeInline}>effort</code></td>
                  <td>Skill実行中だけモデルや推論の強度を上書き</td>
                </tr>
                <tr>
                  <td><code className={styles.codeInline}>context: fork</code></td>
                  <td>独立したサブエージェントのコンテキストで実行</td>
                </tr>
                <tr>
                  <td><code className={styles.codeInline}>agent</code></td>
                  <td>context: fork 時に使うサブエージェントの種類</td>
                </tr>
                <tr>
                  <td><code className={styles.codeInline}>paths</code></td>
                  <td>特定のファイルパターンを扱っている時だけ自動発火させる</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            <code className={styles.codeInline}>disable-model-invocation</code> と <code className={styles.codeInline}>user-invocable</code> の組み合わせで、誰が呼び出せるかが変わる。
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>フロントマター</th>
                  <th>ユーザーが呼べるか</th>
                  <th>Claudeが呼べるか</th>
                  <th>コンテキストへの影響</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>(デフォルト)</td>
                  <td>可</td>
                  <td>可</td>
                  <td>説明は常時コンテキストにあり、発火時に本文がロードされる</td>
                </tr>
                <tr>
                  <td><code className={styles.codeInline}>disable-model-invocation: true</code></td>
                  <td>可</td>
                  <td>不可</td>
                  <td>説明はコンテキストに出ず、手動実行時のみ本文がロードされる</td>
                </tr>
                <tr>
                  <td><code className={styles.codeInline}>user-invocable: false</code></td>
                  <td>不可</td>
                  <td>可</td>
                  <td>説明は常時コンテキストにあり、発火時に本文がロードされる</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            副作用を伴う操作(<code className={styles.codeInline}>/deploy</code> や <code className={styles.codeInline}>/commit</code> のような操作)には <code className={styles.codeInline}>disable-model-invocation: true</code> を付け、Claudeが自律的に実行してしまわないようにするのが定石である。
          </p>
        </section>

        <section id="step9" className={styles.section}>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepBadge}>9</span> 実行コードを含むSkillのベストプラクティス
          </h2>
          <p>スクリプトを同梱するSkillでは、以下の原則が実務上とくに効いてくる。</p>
          <ul>
            <li>
              Claudeに委ねず、スクリプト側でエラーを処理する(ファイルが無ければ作る、権限エラーなら代替値を返す、など)
            </li>
            <li>
              マジックナンバーを避ける(<code className={styles.codeInline}>TIMEOUT = 30 # HTTPリクエストは通常30秒以内に完了する</code> のように理由をコメントで示す)
            </li>
            <li>
              実行するのか参照として読ませるのか、指示を明確にする(「analyze_form.py を実行せよ」と「analyze_form.py の抽出アルゴリズムを参照せよ」は別の指示)
            </li>
            <li>
              破壊的な操作や大量更新には「計画ファイルを作成→検証→実行」のパターンを使う(例: 50件のPDFフォーム更新を一気に適用する前に changes.json を検証する)
            </li>
          </ul>
          <p>
            実行環境はSurfaceによって制約が異なるため、依存パッケージを明記する前提で設計する必要がある。
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Surface</th>
                  <th>ネットワークアクセス</th>
                  <th>パッケージインストール</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>claude.ai</td>
                  <td>設定により全面/部分/なし</td>
                  <td>npm・PyPI・GitHubから可能</td>
                </tr>
                <tr>
                  <td>Claude API</td>
                  <td>なし</td>
                  <td>不可(事前インストール済みのもののみ)</td>
                </tr>
                <tr>
                  <td>Claude Code</td>
                  <td>フルアクセス(ローカル環境と同等)</td>
                  <td>可能だがグローバルインストールは非推奨</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="step10" className={styles.section}>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepBadge}>10</span> セキュリティを考慮する
          </h2>
          <p>
            Skillはコードを実行し、ツールを呼び出す能力を持つため、公式ドキュメントは「信頼できる作成元(自作またはAnthropic提供)のSkillのみを使う」ことを強く推奨している。信頼できない出どころのSkillを使わざるを得ない場合は、以下を確認する。
          </p>
          <ul>
            <li>SKILL.md 本文・スクリプト・画像などバンドルされた全ファイルを監査する</li>
            <li>想定外のネットワーク呼び出しやファイルアクセスパターンがないか確認する</li>
            <li>
              外部URLから動的にコンテンツを取得するSkillは特にリスクが高い(取得内容に悪意ある指示が混入し得る)
            </li>
            <li>
              機微データへのアクセス権を持つ本番環境に組み込む際は、ソフトウェアのインストールと同じ慎重さで扱う
            </li>
          </ul>
          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className="ti ti-shield-exclamation" />
            <p>
              Simon Willisonも自身の記事の中で「Skillは任意のコードを実行できる」点に触れており、信頼できる出どころのものだけを使うことが強調されている。
            </p>
          </div>
        </section>

        <section id="step11" className={styles.section}>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepBadge}>11</span> テスト・評価・イテレーション
          </h2>
          <p>
            公式の推奨フローは「Claude A(Skillを設計する側)」と「Claude B(実際にSkillを使ってタスクをこなす側)」を役割分担させ、観察に基づいて改善を回すというものである。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_EVAL} />
            <p className={styles.diagramCaption}>図: Claude A / Claude B による評価イテレーション</p>
          </div>

          <p>
            Claude Code には <code className={styles.codeInline}>skill-creator</code> プラグインが用意されており、テストケースを <code className={styles.codeInline}>evals/evals.json</code> に保存し、Skillあり/なしの合格率・トークン数・実行時間を自動比較できる。バージョン間のブラインドA/B比較や、発火条件(description)のチューニング支援機能も含まれている。
          </p>

          <p>観察すべき兆候は次の3つである。</p>
          <ul>
            <li>
              <strong>想定外の探索経路:</strong>
              Claudeが意図しない順序でファイルを読んでいないか(構造がわかりにくいサイン)
            </li>
            <li>
              <strong>参照の見落とし:</strong>
              重要な参照ファイルへのリンクをClaudeが辿っていないか(リンクをより明示的にする必要がある)
            </li>
            <li>
              <strong>偏った利用:</strong>
              同じファイルばかり読まれる場合はメイン本文への統合を検討し、逆に一度も読まれないファイルは不要か、誘導が弱い可能性がある
            </li>
          </ul>
        </section>

        <div className={styles.divider} />

        <section id="antipatterns" className={styles.section}>
          <h2>
            <i className="ti ti-alert-triangle" /> アンチパターン集
          </h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>アンチパターン</th>
                  <th>なぜ問題か</th>
                  <th>代わりにすべきこと</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Windowsスタイルのパス(<code className={styles.codeInline}>scripts\helper.py</code>)</td>
                  <td>Unix環境でエラーになる</td>
                  <td>常にスラッシュ区切り(<code className={styles.codeInline}>scripts/helper.py</code>)</td>
                </tr>
                <tr>
                  <td>選択肢を並べすぎる</td>
                  <td>Claudeが判断に迷う</td>
                  <td>デフォルトを1つ提示し、例外時の代替案だけ添える</td>
                </tr>
                <tr>
                  <td>参照の多段ネスト</td>
                  <td>部分読み込みで情報が欠落しやすい</td>
                  <td>参照は SKILL.md から1階層のみに保つ</td>
                </tr>
                <tr>
                  <td>時限的な情報をそのまま書く</td>
                  <td>いずれ内容が古くなる</td>
                  <td>「現在の方法」と「旧パターン(折りたたみ)」に分ける</td>
                </tr>
                <tr>
                  <td>用語の揺れ</td>
                  <td>Claudeの解釈が不安定になる</td>
                  <td>用語を1つに統一する</td>
                </tr>
                <tr>
                  <td>スクリプトがエラーをClaudeに丸投げする</td>
                  <td>再現性が下がる</td>
                  <td>スクリプト側で例外処理を書き切る</td>
                </tr>
                <tr>
                  <td>MCPツール名を短縮して書く</td>
                  <td>複数MCPサーバーがある場合に見つからない</td>
                  <td><code className={styles.codeInline}>ServerName:tool_name</code> の完全修飾名を使う</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="checklist" className={styles.section}>
          <h2>
            <i className="ti ti-checklist" /> SKILL.md チェックリスト
          </h2>
          <p>公開・共有する前に、以下を確認する(公式チェックリストを基に整理)。</p>

          <h3>基本品質</h3>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-square-check" />
              description が具体的で、鍵となる語句を含んでいる
            </li>
            <li>
              <i className="ti ti-square-check" />
              description に「何をするか」と「いつ使うか」の両方がある
            </li>
            <li>
              <i className="ti ti-square-check" />
              SKILL.md 本文が500行未満に収まっている
            </li>
            <li>
              <i className="ti ti-square-check" />
              詳細情報は必要に応じて別ファイルに分離されている
            </li>
            <li>
              <i className="ti ti-square-check" />
              時限的な情報が「旧パターン」セクションに隔離されている
            </li>
            <li>
              <i className="ti ti-square-check" />
              用語が一貫している
            </li>
            <li>
              <i className="ti ti-square-check" />
              例が抽象的でなく具体的である
            </li>
            <li>
              <i className="ti ti-square-check" />
              ファイル参照が1階層に保たれている
            </li>
          </ul>

          <h3>コードとスクリプト</h3>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-square-check" />
              スクリプトがClaudeに丸投げせず問題を解決している
            </li>
            <li>
              <i className="ti ti-square-check" />
              エラー処理が明示的で分かりやすい
            </li>
            <li>
              <i className="ti ti-square-check" />
              マジックナンバーがなく、値の根拠が示されている
            </li>
            <li>
              <i className="ti ti-square-check" />
              必要なパッケージが明記され、利用可能性が確認されている
            </li>
            <li>
              <i className="ti ti-square-check" />
              Windowsスタイルのパスが使われていない
            </li>
          </ul>

          <h3>テスト</h3>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-square-check" />
              最低3つの評価シナリオが用意されている
            </li>
            <li>
              <i className="ti ti-square-check" />
              Haiku / Sonnet / Opus など複数モデルでテスト済みである
            </li>
            <li>
              <i className="ti ti-square-check" />
              実運用に近いシナリオでテスト済みである
            </li>
          </ul>
        </section>

        <section id="summary" className={styles.section}>
          <h2>
            <i className="ti ti-flag" /> まとめ
          </h2>
          <p>
            SKILL.md の設計は、突き詰めると「Claudeはすでに賢い」という前提のもとで、足りていない情報だけを、必要なタイミングでだけ渡すという一点に集約される。Progressive Disclosureのアーキテクチャを理解し、評価駆動で本文を磨き、Claude Code固有のフロントマター(disable-model-invocation や allowed-tools など)で発火・権限を制御することで、コンテキストを圧迫せずに再利用可能な専門知識を積み上げていくことができる。
          </p>
        </section>

        <section id="sources" className={styles.section}>
          <h2>
            <i className="ti ti-books" /> 参考文献・ソース
          </h2>

          <div className={styles.sourceGroupLabel}>Anthropic 公式ドキュメント</div>
          <ul className={styles.sourcesList}>
            <li>
              <div className={styles.sourceTitle}>
                <i className="ti ti-link" />
                Agent Skills 概要
              </div>
              <Ext href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview">
                https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
              </Ext>
            </li>
            <li>
              <div className={styles.sourceTitle}>
                <i className="ti ti-link" />
                Skill authoring best practices(本ガイドの中心的な出典)
              </div>
              <Ext href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices">
                https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
              </Ext>
            </li>
            <li>
              <div className={styles.sourceTitle}>
                <i className="ti ti-link" />
                Claude Code — Extend Claude with skills(フロントマター詳細・運用機能)
              </div>
              <Ext href="https://code.claude.com/docs/en/skills">
                https://code.claude.com/docs/en/skills
              </Ext>
            </li>
            <li>
              <div className={styles.sourceTitle}>
                <i className="ti ti-link" />
                Claude Code ドキュメントマップ
              </div>
              <Ext href="https://docs.anthropic.com/en/docs/claude-code/claude_code_docs_map.md">
                https://docs.anthropic.com/en/docs/claude-code/claude_code_docs_map.md
              </Ext>
            </li>
          </ul>

          <div className={styles.sourceGroupLabel}>Anthropic Engineering Blog</div>
          <ul className={styles.sourcesList}>
            <li>
              <div className={styles.sourceTitle}>
                <i className="ti ti-link" />
                Equipping agents for the real world with Agent Skills(Barry Zhang, Keith Lazuka, Mahesh Murag 著、アーキテクチャ設計の背景解説)
              </div>
              <Ext href="https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills">
                https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
              </Ext>
            </li>
          </ul>

          <div className={styles.sourceGroupLabel}>著名開発者による一次情報</div>
          <ul className={styles.sourcesList}>
            <li>
              <div className={styles.sourceTitle}>
                <i className="ti ti-link" />
                Simon Willison(Django共同開発者)「Claude Skills are awesome, maybe a bigger deal than MCP」
              </div>
              <Ext href="https://simonwillison.net/2025/Oct/16/claude-skills/">
                https://simonwillison.net/2025/Oct/16/claude-skills/
              </Ext>
            </li>
            <li>
              <div className={styles.sourceTitle}>
                <i className="ti ti-link" />
                Simon Willison, Skillsタグ一覧(コミュニティ動向の記録)
              </div>
              <Ext href="https://simonwillison.net/tags/skills/">
                https://simonwillison.net/tags/skills/
              </Ext>
            </li>
          </ul>

          <div className={styles.sourceGroupLabel}>公式スキルリポジトリ / コミュニティ</div>
          <ul className={styles.sourcesList}>
            <li>
              <div className={styles.sourceTitle}>
                <i className="ti ti-link" />
                anthropics/skills(公式オープンソースSkillsリポジトリ)
              </div>
              <Ext href="https://github.com/anthropics/skills">
                https://github.com/anthropics/skills
              </Ext>
            </li>
            <li>
              <div className={styles.sourceTitle}>
                <i className="ti ti-link" />
                travisvn/awesome-claude-skills(コミュニティによるキュレーションリスト)
              </div>
              <Ext href="https://github.com/travisvn/awesome-claude-skills">
                https://github.com/travisvn/awesome-claude-skills
              </Ext>
            </li>
          </ul>

          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className="ti ti-alert-triangle" />
            <p>
              Claude Codeのフロントマターフィールドや挙動はバージョンにより追加・変更されることがある。本ガイドは2026年7月26日時点の公式ドキュメントに基づいており、最新の詳細は上記リンク(特に code.claude.com/docs/en/skills)を直接参照すること。
            </p>
          </div>
        </section>

        <footer className={styles.pageFooter}>
          SKILL.md 実践ガイド — 情報基準日: 2026年7月26日
        </footer>
    </SkillGuideClient>
  );
}
