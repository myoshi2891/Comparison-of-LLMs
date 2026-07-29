import type { Metadata } from "next";
import type React from "react";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Agent Skills 実践ガイド — Antigravity IDE における SKILL.md",
  description:
    "Antigravity IDE における SKILL.md の設計思想・アーキテクチャ・実装パターン・運用 — 中級〜上級エンジニア向けステップバイステップ解説",
};

function ExtRef({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.refLink}>
      {children}
    </a>
  );
}

const SKILL_THEME_VARS: Record<string, string> = {
  fontFamily: "'IBM Plex Sans JP', 'IBM Plex Mono', sans-serif",
  fontSize: "16px",
  background: "#FFFFFF",
  primaryColor: "#ECEEFC",
  primaryTextColor: "#14161C",
  primaryBorderColor: "#3648D6",
  lineColor: "#4A4D57",
  secondaryColor: "#FBF0DF",
  tertiaryColor: "#E4F4EE",
  actorBkg: "#ECEEFC",
  actorBorder: "#3648D6",
  actorTextColor: "#14161C",
  noteBkgColor: "#FBF0DF",
  noteBorderColor: "#EACB99",
  noteTextColor: "#C97A1A",
  signalTextColor: "#14161C",
};

const DIAG_1 = `flowchart LR
A["Discovery: 全スキルのdescriptionを事前ロード"] --> B{"タスクと意味的に関連するか"}
B -- "関連なし" --> C["休眠状態を維持(コストほぼゼロ)"]
B -- "関連あり" --> D["Activation: SKILL.md本文を読み込み"]
D --> E{"追加リソースが必要か"}
E -- "不要" --> F["第3層はスキップ"]
E -- "必要" --> G["Execution: 関連ファイルを必要時のみ読み込み"]
F --> H["タスク遂行"]
G --> H`;

const DIAG_2 = `sequenceDiagram
participant U as ユーザー
participant C as コンテキストウィンドウ
participant Ag as エージェント
participant F as ファイルシステム
U->>C: タスクを含むメッセージを送信
Note over C: システムプロンプトと全スキルのメタデータのみ保持
C->>Ag: タスク内容を提示
Ag->>Ag: 関連スキルを判定
Ag->>F: SKILL.mdを読み込み
F-->>C: SKILL.md本文を追加
Ag->>F: 必要に応じ関連ファイルを読み込み
F-->>C: 関連ファイルを追加
Ag->>U: タスクを実行して完了`;

const DIAG_3 = `flowchart TD
A["Discovery: 全スキルのname・descriptionを提示"] --> B["Activation: 関連するSKILL.md本文を読む"]
B --> C["Execution: 指示に従いタスクを遂行"]`;

const DIAG_4 = `flowchart TD
A["ユーザーが自然言語で指示を入力"] --> B["descriptionと意味的に照合"]
B --> C{"合致するスキルがあるか"}
C -- "あり" --> D["SKILL.mdをロード"]
C -- "なし" --> E["スキルなしで応答"]
D --> F{"スクリプト実行が必要か"}
F -- "はい" --> G{"実行モードの確認"}
G -- "Manual" --> H["実行許可を確認"]
G -- "Auto・Secure" --> I["サンドボックス内で実行"]
F -- "いいえ" --> J["指示のみで対応"]`;

const DIAG_5 = `flowchart TD
S1["Step1: スコープを決める"] --> S2["Step2: 単一責務に絞る"]
S2 --> S3["Step3: descriptionを磨く"]
S3 --> S4["Step4: 段階的に構造化する"]
S4 --> S5["Step5: スクリプトをブラックボックス化"]
S5 --> S6["Step6: 判断分岐を明示する"]
S6 --> S7["Step7: Few-shot例を追加"]
S7 --> S8["Step8: エラー処理を明文化"]
S8 --> S9["Step9: 評価とイテレーション"]`;

export default function AgentSkillsGuidePage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>SKILL.md · Agent Skills · Antigravity IDE</div>
          <h1 className={styles.heroTitle}>Agent Skills 実践ガイド</h1>
          <p className={styles.sub}>
            Antigravity IDE における SKILL.md の設計思想・アーキテクチャ・実装パターン・運用 —
            中級〜上級エンジニア向けステップバイステップ解説
          </p>
          <div className={styles.meta}>
            <span>対象読者: AIエンジニア / プラットフォームエンジニア</span>
            <span>情報基準日: 2026-07-27</span>
            <span>形式: 設計思想 → アーキテクチャ → 実装パターン → 運用</span>
          </div>
        </div>
        <div className={styles.layers} aria-hidden="true">
          <div className={`${styles.layer} ${styles.layer1}`}>
            <span>Discovery</span>
          </div>
          <div className={`${styles.layer} ${styles.layer2}`}>
            <span>Activation</span>
          </div>
          <div className={`${styles.layer} ${styles.layer3}`}>
            <span>Execution</span>
          </div>
        </div>
      </header>

      <div className={styles.wrap}>
        <nav className={styles.tocNav} aria-label="目次">
          <div className={styles.tocLabel}>On this page</div>
          <ol className={styles.tocOl}>
            <li className={styles.tocLi}>
              <a href="#intro" className={styles.tocLink}>
                はじめに
              </a>
            </li>
            <li className={styles.tocLi}>
              <a href="#origin" className={styles.tocLink}>
                起源と位置づけ
              </a>
            </li>
            <li className={styles.tocLi}>
              <a href="#philosophy" className={styles.tocLink}>
                設計思想：段階的開示
              </a>
            </li>
            <li className={styles.tocLi}>
              <a href="#architecture" className={styles.tocLink}>
                アーキテクチャ
              </a>
            </li>
            <li className={styles.tocLi}>
              <a href="#antigravity" className={styles.tocLink}>
                Antigravityの実装仕様
              </a>
            </li>
            <li className={styles.tocLi}>
              <a href="#practices" className={styles.tocLink}>
                実装パターン：9ステップ
              </a>
            </li>
            <li className={styles.tocLi}>
              <a href="#operations" className={styles.tocLink}>
                運用
              </a>
            </li>
            <li className={styles.tocLi}>
              <a href="#example" className={styles.tocLink}>
                実装例
              </a>
            </li>
            <li className={styles.tocLi}>
              <a href="#summary" className={styles.tocLink}>
                まとめ
              </a>
            </li>
            <li className={styles.tocLi}>
              <a href="#references" className={styles.tocLink}>
                参考文献・情報源
              </a>
            </li>
          </ol>
        </nav>

        <main className={styles.main}>
          <section id="intro" className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.num}>00</span>はじめに
            </h2>
            <p className={styles.p}>
              「Agent Skills」は、AIエージェントに手続き的知識（procedural
              knowledge）や組織固有のコンテキストを、<strong>フォルダとMarkdownファイル</strong>
              という極めてシンプルな形式で与えるための設計パターンです。2025年10月にAnthropicがClaude向けに発表し、同年12月には
              <code className={styles.inlineCode}>agentskills.io</code>
              として企業横断のオープン標準に格上げされました。Google の
              Antigravity（IDE／CLI／SDKからなるエージェントファースト開発環境）はこの標準をネイティブでサポートしており、Claude
              Code・OpenAI Codex・Gemini CLI・Cursor・GitHub Copilotなどと
              <strong>同一フォーマットのSKILL.md</strong>を読み込むことができます。
            </p>
            <p className={styles.p}>
              本ガイドは機能紹介ではなく、なぜこの設計になっているのか（設計思想）、内部でどう動くのか（アーキテクチャ）、どう書けば品質が上がるのか（実装パターン）、チームでどう回すのか（運用）を、一次情報にもとづいて段階的に解説します。
            </p>
          </section>

          <section id="origin" className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.num}>01</span>Agent Skills の起源と位置づけ
            </h2>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <caption className={styles.tableCaption}>
                  Agent Skills / Antigravity Skills をめぐる主な出来事
                </caption>
                <thead>
                  <tr className={styles.tbodyTr}>
                    <th className={styles.theadTh} style={{ width: "20%" }}>
                      時期
                    </th>
                    <th className={styles.theadTh}>出来事</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>2025-10-16</td>
                    <td className={styles.td}>
                      Anthropicが「Agent
                      Skills」をClaude向けに発表。エンジニアリングブログ「Equipping agents for the
                      real world with Agent Skills」を公開
                    </td>
                  </tr>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>2025-10-16</td>
                    <td className={styles.td}>
                      Simon Willison氏（Datasette作者、AI開発ツール評論で著名）が即日検証し「Claude
                      Skills are awesome, maybe a bigger deal than MCP」と評価
                    </td>
                  </tr>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>2025-12-18</td>
                    <td className={styles.td}>
                      Agent Skills形式が
                      <code className={styles.inlineCode}>agentskills.io</code>
                      としてオープン標準化。Anthropic以外のツールへの移植性を確保
                    </td>
                  </tr>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>2026-01 以降</td>
                    <td className={styles.td}>
                      Google AntigravityがSKILL.mdをネイティブサポートすると発表・文書化
                    </td>
                  </tr>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>2026-02</td>
                    <td className={styles.td}>
                      Bosch ResearchとCarnegie
                      Mellon大学の研究（arXiv:2602.08004）が公開スキル数の急増（約20日間で2,179件→40,000件超）を報告
                    </td>
                  </tr>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>2026-現在</td>
                    <td className={styles.td}>
                      Cursor、GitHub Copilot、VS Code、Gemini
                      CLI、Goose、OpenCodeなど40以上のクライアントが同一フォーマットを採用
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.p}>
              ポイントは、Agent
              Skillsが「新しいプロトコル」ではなく「Markdownファイル＋フォルダ規約」という最小限の仕様である点です。Willison氏はMCP（Model
              Context
              Protocol）と対比し、MCPがホスト・クライアント・サーバー・トランスポートを含む本格的なプロトコル仕様であるのに対し、SkillsはCLIツールの
              <code className={styles.inlineCode}>--help</code>
              をエージェントに読ませる発想の延長線上にあり、サーバー実装が不要で導入コストが極めて低いと指摘しています。
            </p>
          </section>

          <section id="philosophy" className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.num}>02</span>設計思想：Progressive Disclosure（段階的開示）
            </h2>
            <p className={styles.p}>
              Agent Skillsの中核にある設計原則が
              <strong>Progressive Disclosure（段階的開示）</strong>
              です。Anthropicのエンジニアリングブログでは、これを「よく整理されたマニュアル」に例えています。目次だけをまず読み、必要な章だけを開き、さらに詳細が必要なら巻末の付録を参照する——これと同じ階層構造をコンテキストウィンドウの中で再現します。
            </p>

            <h3 className={styles.h3}>三段階のロード</h3>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAG_1} theme="base" themeVariables={SKILL_THEME_VARS} />
              <div className={styles.diagramCaption}>
                図1: 段階的開示（Progressive Disclosure）の3層モデル
              </div>
            </div>

            <p className={styles.p}>
              この設計により、1スキルあたりの起動時コストは数十トークン程度に抑えられ、数十個のスキルを同時にインストールしても実用上のオーバーヘッドがほぼ発生しません。実際にAnthropic公式リポジトリの17スキルを分析した第三者調査では、本文サイズは最小で約275トークン相当から最大で約8,000トークン相当まで幅があり、中央値はおよそ2,000トークンと報告されています。
            </p>

            <h3 className={styles.h3}>コンテキストウィンドウ内での実際の流れ</h3>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAG_2} theme="base" themeVariables={SKILL_THEME_VARS} />
              <div className={styles.diagramCaption}>
                図2: PDFスキルを例にしたコンテキストウィンドウの推移
              </div>
            </div>

            <p className={styles.p}>
              重要なのは、スキルに同梱されたPythonスクリプトなどの
              <strong>コード自体はコンテキストに読み込まれず、実行結果のみが返る</strong>
              という点です。これにより、ソートのような決定的処理をトークン生成で行う非効率を避けつつ、再現性のある挙動を保証できます。
            </p>

            <h3 className={styles.h3}>なぜシステムプロンプトやMCPではダメなのか</h3>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <caption className={styles.tableCaption}>
                  比較: システムプロンプト直書き / MCP / Agent Skills
                </caption>
                <thead>
                  <tr className={styles.tbodyTr}>
                    <th className={styles.theadTh}>比較軸</th>
                    <th className={styles.theadTh}>システムプロンプト直書き</th>
                    <th className={styles.theadTh}>MCPサーバー</th>
                    <th className={styles.theadTh}>Agent Skills（SKILL.md）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>常時ロード</td>
                    <td className={styles.td}>常に全文がロード（Instruction Fatigueの原因）</td>
                    <td className={styles.td}>ツール定義は常時ロード</td>
                    <td className={styles.td}>メタデータのみ常時、本文は必要時のみ</td>
                  </tr>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>導入コスト</td>
                    <td className={styles.td}>低いが肥大化しやすい</td>
                    <td className={styles.td}>サーバー実装・ホスティングが必要</td>
                    <td className={styles.td}>Markdownファイル1枚から開始可能</td>
                  </tr>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>起動時トークンコスト</td>
                    <td className={styles.td}>会話が長くなるほど圧迫</td>
                    <td className={styles.td}>ツール数に比例して増大</td>
                    <td className={styles.td}>1スキルあたり数十トークン程度</td>
                  </tr>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>移植性</td>
                    <td className={styles.td}>ツール依存</td>
                    <td className={styles.td}>プロトコル準拠が必要</td>
                    <td className={styles.td}>フォルダごとコピーで他ツールへ移植可能</td>
                  </tr>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>コード実行</td>
                    <td className={styles.td}>不可</td>
                    <td className={styles.td}>サーバー側で実装次第</td>
                    <td className={styles.td}>スクリプトを同梱し決定的に実行可能</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.p}>
              この比較からもわかる通り、Agent
              Skillsは「常時稼働する外部連携」を担うMCPを置き換えるものではなく、
              <strong>
                手続き的知識・スタイルガイド・反復可能なワークフローを、低コストでエージェントに教え込む層
              </strong>
              として補完的に機能します。
            </p>
          </section>

          <section id="architecture" className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.num}>03</span>アーキテクチャ：SKILL.md の解剖
            </h2>

            <h3 className={styles.h3}>最小構成</h3>
            <p className={styles.p}>
              スキルはフォルダとして表現され、必須ファイルは
              <code className={styles.inlineCode}>SKILL.md</code> 一つだけです。
            </p>
            <div className={styles.card}>
              <ul className={styles.ul} style={{ marginBottom: 0 }}>
                <li className={styles.li}>
                  <strong>スキルフォルダ</strong>（例:{" "}
                  <code className={styles.inlineCode}>my-skill/</code>）
                  <ul className={styles.ul}>
                    <li className={styles.li}>
                      <code className={styles.inlineCode}>SKILL.md</code> —
                      必須。YAMLフロントマター＋Markdown本文
                    </li>
                    <li className={styles.li}>
                      <code className={styles.inlineCode}>scripts/</code> —
                      任意。エージェントが呼び出す実行可能スクリプト
                    </li>
                    <li className={styles.li}>
                      <code className={styles.inlineCode}>examples/</code> または
                      <code className={styles.inlineCode}>references/</code> —
                      任意。参照用ドキュメント
                    </li>
                    <li className={styles.li}>
                      <code className={styles.inlineCode}>resources/</code> または
                      <code className={styles.inlineCode}>assets/</code> —
                      任意。テンプレートや設定ファイル
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <h3 className={styles.h3}>YAMLフロントマターの仕様</h3>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tbodyTr}>
                    <th className={styles.theadTh}>フィールド</th>
                    <th className={styles.theadTh}>必須</th>
                    <th className={styles.theadTh}>説明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>
                      <code className={styles.inlineCode}>name</code>
                    </td>
                    <td className={styles.td}>任意</td>
                    <td className={styles.td}>
                      スキルの一意な識別子（小文字・ハイフン区切り）。省略時はフォルダ名がそのまま使われる
                    </td>
                  </tr>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>
                      <code className={styles.inlineCode}>description</code>
                    </td>
                    <td className={styles.td}>
                      <strong>必須</strong>
                    </td>
                    <td className={styles.td}>
                      スキルが何をし、いつ使うべきかを説明する文。エージェントがトリガー判定に使う唯一の材料
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className={styles.h3}>発見・起動・実行の3フェーズ</h3>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAG_3} theme="base" themeVariables={SKILL_THEME_VARS} />
              <div className={styles.diagramCaption}>図3: スキルのライフサイクル3フェーズ</div>
            </div>
            <p className={styles.p}>
              ユーザーは明示的にスキル名を呼び出す必要はなく、エージェントが文脈から自律的に判断します（＝セマンティックトリガリング）。ただし、確実に使わせたい場合はスキル名をプロンプト中で直接指定することも可能です。
            </p>
          </section>

          <section id="antigravity" className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.num}>04</span>Antigravity IDE における実装仕様
            </h2>

            <h3 className={styles.h3}>スキルの配置場所（スコープ）</h3>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tbodyTr}>
                    <th className={styles.theadTh}>スコープ</th>
                    <th className={styles.theadTh}>パス</th>
                    <th className={styles.theadTh}>用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>ワークスペーススコープ</td>
                    <td className={styles.td}>
                      <code className={styles.inlineCode}>
                        &lt;workspace-root&gt;/.agents/skills/&lt;skill-folder&gt;/
                      </code>
                    </td>
                    <td className={styles.td}>
                      チームのデプロイ手順やテスト規約など、プロジェクト固有のワークフロー。Gitでバージョン管理し、クローンした全開発者に自動配布される
                    </td>
                  </tr>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>グローバルスコープ</td>
                    <td className={styles.td}>ホームディレクトリ配下（下記コールアウト参照）</td>
                    <td className={styles.td}>
                      個人のユーティリティや、全プロジェクト共通で使いたい汎用スキル
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.callout}>
              <div className={styles.calloutLabel}>⚠ 実運用上のハマりどころ</div>
              <p className={styles.p} style={{ marginBottom: 0 }}>
                Antigravityは現在
                <code className={styles.inlineCode}>.agents/skills</code>
                （複数形）をデフォルトとしつつ、後方互換のため旧形式の
                <code className={styles.inlineCode}>.agent/skills</code>
                （単数形）も引き続きサポートしています。さらに、グローバルスコープのパスは製品ドキュメントのページによって表記が割れており（例:
                <code className={styles.inlineCode}>~/.gemini/config/skills/</code> と
                <code className={styles.inlineCode}>~/.gemini/antigravity/skills/</code>）、Google
                Developer ExpertのMete
                Atamel氏が実機検証したブログ記事では、Antigravity本体・Antigravity CLI・Antigravity
                IDEの3つのサーフェスがそれぞれ<strong>異なるグローバルパス</strong>
                を参照していることが報告されています。本番運用では
                <code className={styles.inlineCode}>Which skills are installed?</code>
                （IDE／Antigravity本体）や
                <code className={styles.inlineCode}>/skills</code>
                をエージェントに尋ねて実際の認識状況を確認することが推奨されます。
              </p>
            </div>

            <h3 className={styles.h3}>セマンティックトリガリングの仕組み</h3>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAG_4} theme="base" themeVariables={SKILL_THEME_VARS} />
              <div className={styles.diagramCaption}>
                図4: Antigravityにおけるセマンティックトリガリングと実行モード分岐
              </div>
            </div>

            <p className={styles.p}>
              <code className={styles.inlineCode}>description</code>
              フィールドは三人称・具体的な動詞（「生成する」「検証する」「実行する」など）で書くことが公式に推奨されています。これは、エージェントがこの一文だけを手がかりにトリガー判定を行うためで、曖昧な説明文はスキルの不発火・誤発火に直結します。
            </p>

            <h3 className={styles.h3}>実行モードとセキュリティ境界</h3>
            <p className={styles.p}>
              Antigravityはスクリプト実行の安全性を担保するため、権限モデルとして「常に確認を求める」設定と「信頼済みスキルは自動実行」設定を切り替えられるほか、ネットワークアクセス禁止・ワークスペース外への書き込み禁止・全コマンドのサンドボックス化を行う最も厳格な設定（Secure
              Mode）を提供しています。ただしこの境界がどこまで堅牢かは、後述の運用セクション（6.3）で扱う実際のインシデントも参考にしてください。
            </p>
          </section>

          <section id="practices" className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.num}>05</span>
              実装パターン：ステップバイステップのベストプラクティス
            </h2>
            <p className={styles.p}>
              以下は、Anthropic公式のガイダンスとAntigravity公式ドキュメント、および実務者による検証記事を統合した実装フローです。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAG_5} theme="base" themeVariables={SKILL_THEME_VARS} />
              <div className={styles.diagramCaption}>図5: SKILL.md 実装ステップ（9段階）</div>
            </div>

            <div className={styles.stepGrid}>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>1</div>
                <div>
                  <h4 className={styles.h4}>スコープを見極める</h4>
                  <p className={styles.p}>
                    チームのデプロイ手順やそのプロジェクト固有のビルドパイプラインは
                    <strong>ワークスペーススコープ</strong>
                    （Gitで共有）、個人のコミットメッセージ規約やJSON整形のような汎用ユーティリティは
                    <strong>グローバルスコープ</strong>に置きます。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>2</div>
                <div>
                  <h4 className={styles.h4}>単一責務の原則（Keep it Atomic）</h4>
                  <p className={styles.p}>
                    「DevOpsスキル」のような何でも屋を作るのではなく、「ステージングデプロイ」「ログ解析」「ヘルスチェック」のように
                    <strong>タスクごとに個別のスキルへ分割</strong>
                    します。トリガー精度の向上と保守性の両方に効きます。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>3</div>
                <div>
                  <h4 className={styles.h4}>description（トリガー文）を磨く</h4>
                  <p className={styles.p}>
                    公式ドキュメントの例:
                    <code className={styles.inlineCode}>
                      Generates unit tests for Python code using pytest conventions.
                    </code>
                    三人称・「いつ使うか」を含めることで意味的トリガリングの精度が上がります。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>4</div>
                <div>
                  <h4 className={styles.h4}>本文を段階的に構造化する</h4>
                  <p className={styles.p}>
                    <code className={styles.inlineCode}>SKILL.md</code>
                    が長大になったら、使用頻度の低い詳細や例外的なシナリオを
                    <code className={styles.inlineCode}>forms.md</code>
                    のような別ファイルに逃がし、リンクします。第3層の読み込みが本当に必要な場合にのみ発生し、トークン効率を維持できます。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>5</div>
                <div>
                  <h4 className={styles.h4}>スクリプトをブラックボックスとして扱わせる</h4>
                  <p className={styles.p}>
                    同梱スクリプトはソース全文を読ませず、まず
                    <code className={styles.inlineCode}>--help</code>
                    相当の使い方だけを確認させます。コンテキスト圧迫を避けつつ、決定的な処理はコードに委譲できます。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>6</div>
                <div>
                  <h4 className={styles.h4}>決定木（Decision Tree）を組み込む</h4>
                  <p className={styles.p}>
                    「Pythonファイルの場合はPEP
                    8整形を適用、それ以外はスキップ」のような判断基準を本文に明記します。Antigravity公式の「複雑なスキルには決定木を含める」推奨と一致します。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>7</div>
                <div>
                  <h4 className={styles.h4}>Few-shot例を添える</h4>
                  <p className={styles.p}>
                    ユーザーの入力例とエージェントの期待挙動のペアを2〜3件示すことで、成功率が有意に向上すると報告されています。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>8</div>
                <div>
                  <h4 className={styles.h4}>エラーハンドリングを明示する</h4>
                  <p className={styles.p}>
                    「テストスクリプトが非ゼロの終了コードを返した場合はログを解析し修正案を提示する」のように、失敗時の振る舞いまで本文に書き込みます。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>9</div>
                <div>
                  <h4 className={styles.h4}>評価から始め、エージェントと一緒に磨き込む</h4>
                  <p className={styles.p}>
                    まず代表的なタスクでエージェントを動かし、つまずいた箇所を観察してからスキルを段階的に作ります。エージェント自身に「うまくいったやり方」や「よくある間違い」を振り返らせ、その学びを
                    <code className={styles.inlineCode}>SKILL.md</code>
                    に反映させる反復サイクルが有効です。Antigravityの実務者ブログでも、AIが生成したスキルが最初はうまく機能しなくても、修正手順をコーディングエージェント自身に発見させて更新させることで、スキルが「生きたドキュメント」として継続的に改善される運用が紹介されています。
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="operations" className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.num}>06</span>運用（Operations）
            </h2>

            <h3 className={styles.h3}>6.1 バージョン管理とチーム共有</h3>
            <p className={styles.p}>
              スキルは単なるフォルダなのでGitでそのままバージョン管理でき、リポジトリのルートに置けばチーム全員に自動配布されます。より広く配布したい場合は、Claude
              Codeのプラグイン／マーケットプレイス機構（公開GitHubリポジトリ＋マニフェストファイル）のような仕組みや、コミュニティ主導のスキル集（
              <code className={styles.inlineCode}>awesome-claude-skills</code>、
              <code className={styles.inlineCode}>antigravity-awesome-skills</code>
              等）を利用する運用も広がっています。ある集計では、エコシステム全体で1,400件超のスキルが主要な互換クライアント（Antigravity、Claude
              Code、Codex、Gemini
              CLI、Cursor、Copilot、OpenCode、Windsurfなど）を横断して共有可能な状態にあると報告されています。
            </p>

            <h3 className={styles.h3}>6.2 クロスプラットフォーム運用時の注意</h3>
            <ul className={styles.ul}>
              <li className={styles.li}>
                各クライアントで<strong>スキルの探索パスが異なる</strong>（例: Claude Codeは
                <code className={styles.inlineCode}>~/.claude/skills/</code> や
                <code className={styles.inlineCode}>.claude/skills/</code>、Codex CLIは
                <code className={styles.inlineCode}>.agents/skills/</code>、Gemini CLIは
                <code className={styles.inlineCode}>.gemini/skills/</code>
                ）。フォーマットは共通でも配置場所はツール依存です。
              </li>
              <li className={styles.li}>
                <strong>ツール固有の実行フック</strong>
                （特定のCLIに依存したBashコマンドなど）を本文に埋め込むと、他ツールへ移植した際にそのまま動かないことがあります。移植性を重視するなら、最小限のフロントマターと特定ツールに依存しない指示文からなる「中立的なSKILL.md」として書くことが推奨されます。
              </li>
              <li className={styles.li}>
                同時稼働ツール数の目安（20未満が推奨、10を超えたあたりから精度が劣化しやすいという報告あり）を踏まえ、スキル自体の数よりも
                <strong>同時にアクティブ化されうるツール／スクリプトの複雑さ</strong>
                を管理する視点も必要です。
              </li>
            </ul>

            <h3 className={styles.h3}>6.3 セキュリティ運用（最重要）</h3>
            <p className={styles.p}>
              Anthropic公式のガイダンスは明確です。「信頼できる提供元のスキルのみをインストールすること。信頼度の低いソースからスキルを導入する場合は、使用前に必ず内容を精査すること」。特に、同梱されたコードの依存関係や画像・スクリプトなどのリソース、そして
              <strong>
                エージェントを外部の未信頼なネットワーク先へ接続させようとする指示やコード
              </strong>
              には注意を払うべきだとされています。悪意あるスキルは、実行環境に脆弱性を持ち込んだり、エージェントにデータを不正に持ち出させたり意図しない操作を取らせたりする可能性があるためです。
            </p>

            <p className={styles.p}>
              この懸念は理論上の話にとどまりません。2026年前半には、Antigravity自体に関わる実際のセキュリティインシデントが複数報告されています。
            </p>

            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <caption className={styles.tableCaption}>
                  2026年前半に報告されたAntigravity関連のセキュリティインシデント
                </caption>
                <thead>
                  <tr className={styles.tbodyTr}>
                    <th className={styles.theadTh} style={{ width: "16%" }}>
                      時期
                    </th>
                    <th className={styles.theadTh} style={{ width: "18%" }}>
                      報告元
                    </th>
                    <th className={styles.theadTh}>概要</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>
                      2026-01〜02
                      <br />
                      （発見・修正）
                    </td>
                    <td className={styles.td}>
                      Pillar Security
                      <br />
                      （研究者 Dan Lisichkin氏）
                    </td>
                    <td className={styles.td}>
                      Antigravityのネイティブツール
                      <code className={styles.inlineCode}>find_by_name</code>
                      のパターン引数がサニタイズされておらず、
                      <code className={styles.inlineCode}>fd</code>
                      コマンドへフラグを注入することでリモートコード実行が可能だった。最も厳格な「Secure
                      Mode」はシェルコマンド層でのみ制御を行っており、ネイティブツール呼び出しはその境界の外側で実行されるため、Secure
                      Mode有効時でも回避が成立していた。Googleへ報告後、脆弱性報奨金制度を通じて修正・報奨が行われた。
                    </td>
                  </tr>
                  <tr className={styles.tbodyTr}>
                    <td className={styles.td}>2026年</td>
                    <td className={styles.td}>PromptArmor</td>
                    <td className={styles.td}>
                      オンライン上の一見無害な文書に埋め込まれた間接的プロンプトインジェクションが、Antigravityのエージェントにセキュリティ設定を回避させ、認証情報やソースコードを持ち出させる攻撃チェーンを実証。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className={styles.p}>
              これらの事例が示す教訓は、
              <strong>「サンドボックスや権限設定があるから安全」という前提を置かないこと</strong>
              です。ネイティブツール呼び出しはシェルコマンド向けの制御をすり抜けうる、外部ドキュメント経由の間接的プロンプトインジェクションはユーザーが直接入力していない指示としてエージェントに届く、という2点は、スキル自体の監査だけでなく、エージェントが呼び出すツール層全体の運用ポリシーとして押さえておく必要があります。
            </p>

            <div className={`${styles.callout} ${styles.goodCallout}`}>
              <div className={styles.calloutLabel}>✓ 運用チェックリスト</div>
              <ul className={styles.checklist}>
                <li className={styles.checkItem}>
                  スキルは信頼できる提供元（社内リポジトリ、監査済みの公開リポジトリ）からのみ導入する
                </li>
                <li className={styles.checkItem}>
                  未監査のスキルを追加する前に、SKILL.md本文・同梱スクリプト・参照リソースを人手でレビューする
                </li>
                <li className={styles.checkItem}>
                  外部ネットワークへの接続を指示するスキルやスクリプトは特に注意深く確認する
                </li>
                <li className={styles.checkItem}>
                  破壊的操作を伴うワークフローでは「都度確認（Manual）」モードを既定とし、自動実行は十分に検証されたスキルに限定する
                </li>
                <li className={styles.checkItem}>
                  Secure
                  Modeなどの制限設定は「効いていることが前提」ではなく、ネイティブツール層も含めて定期的に検証する
                </li>
                <li className={styles.checkItem}>
                  間接的プロンプトインジェクション（外部文書・検索結果・PRコメントなど）を想定した脅威モデルを持つ
                </li>
              </ul>
            </div>

            <h3 className={styles.h3}>6.4 評価駆動での継続的改善</h3>
            <p className={styles.p}>
              スキルは一度書いて終わりではなく、「生きたドキュメント」として運用します。実タスクでの挙動を観察し、エージェントが期待外れの経路をたどった箇所や、特定のコンテキストへの過度な依存が見られた箇所を洗い出し、SKILL.mdに反映していきます。Anthropicはこのプロセスを、事前にすべてを想定して書き切るのではなく、
              <strong>エージェントが実際に何を必要としているかを発見していく反復プロセス</strong>
              として位置づけています。
            </p>
          </section>

          <section id="example" className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.num}>07</span>実装例：SKILL.md サンプル
            </h2>
            <p className={styles.p}>
              Antigravity公式ドキュメントに掲載されているコードレビュー用スキルの例です（フロントマター＋本文の最小構成）。
            </p>

            <pre className={styles.codePre}>
              <span className={styles.cm}>---</span>
              {"\n"}
              <span className={styles.kw}>name</span>: code-review{"\n"}
              <span className={styles.kw}>description</span>:{" "}
              <span className={styles.str}>
                Reviews code changes for bugs, style issues, and best practices. Use when reviewing
                PRs or checking code quality.
              </span>
              {"\n"}
              <span className={styles.cm}>---</span>
            </pre>

            <pre className={styles.codePre}>
              <span className={styles.cm}># Code Review Skill</span>
              {"\n\n"}
              When reviewing code, follow these steps:{"\n\n"}
              <span className={styles.cm}>## Review checklist</span>
              {"\n\n"}
              1. Correctness: Does the code do what it's supposed to?{"\n"}
              2. Edge cases: Are error conditions handled?{"\n"}
              3. Style: Does it follow project conventions?{"\n"}
              4. Performance: Are there obvious inefficiencies?{"\n\n"}
              <span className={styles.cm}>## How to provide feedback</span>
              {"\n\n"}- Be specific about what needs to change{"\n"}- Explain why, not just what
              {"\n"}- Suggest alternatives when possible
            </pre>

            <p className={styles.p}>
              この最小構成に対して、本ガイドで解説したベストプラクティスを適用すると、次のような拡張が考えられます。
            </p>
            <ul className={styles.ul}>
              <li className={styles.li}>
                大規模PR向けに「差分が500行を超える場合は先にファイル単位のサマリーを作る」という決定木を追加する
              </li>
              <li className={styles.li}>
                <code className={styles.inlineCode}>scripts/lint_check.sh</code>
                のような静的解析スクリプトを同梱し、「まず
                <code className={styles.inlineCode}>./scripts/lint_check.sh --help</code>
                を確認してから実行する」よう指示する
              </li>
              <li className={styles.li}>
                「Pythonファイルの場合はPEP
                8整形の観点を追加、TypeScriptファイルの場合はESLint設定を参照する」といった言語別の分岐を明記する
              </li>
              <li className={styles.li}>
                スクリプトが失敗した場合の振る舞い（ログを解析し修正案を提示する、など）を明文化する
              </li>
            </ul>
          </section>

          <section id="summary" className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.num}>08</span>まとめ
            </h2>
            <ul className={styles.ul}>
              <li className={styles.li}>
                Agent Skills（SKILL.md）は、<strong>Progressive Disclosure</strong>
                という段階的開示の設計原則を核に、常時ロードされるシステムプロンプトの肥大化問題と、MCPのような重量級プロトコルを必要とする課題の両方を、フォルダとMarkdownファイルという最小限の形式で解決するパターンである
              </li>
              <li className={styles.li}>
                Antigravity
                IDEはこの仕様をネイティブサポートし、ワークスペーススコープとグローバルスコープという2階層の配置場所、セマンティックトリガリングによる自動発火、実行モードによる安全性制御を提供する
              </li>
              <li className={styles.li}>
                ただし配置パスや実行境界の実装詳細は製品面（IDE／CLI／本体）によって差異があり、また実際にネイティブツール層の脆弱性を突いたインシデントも報告されているため、「仕様通りに動く」ことを前提とせず、都度の検証と監査を運用に組み込む必要がある
              </li>
              <li className={styles.li}>
                実装品質を左右する最大の変数はdescriptionの書き方であり、次いで本文の段階的構造化、スクリプトのブラックボックス化、決定木・Few-shot例・エラーハンドリングの明文化である
              </li>
              <li className={styles.li}>
                スキルは一度作って終わりではなく、実タスクでの挙動観察とエージェント自身による振り返りを通じて継続的に磨き込む「生きたドキュメント」として運用する
              </li>
            </ul>
          </section>
        </main>
      </div>

      <footer id="references" className={styles.footer}>
        <div className={styles.refsCard}>
          <h2 className={styles.refsH2}>参考文献・情報源（URL）</h2>
          <p className={styles.p} style={{ fontSize: "14px", color: "var(--ink-soft)" }}>
            本記事は以下の一次情報・著名な開発者/セキュリティ研究者による解説記事に基づいて作成しました（すべて2026年7月27日時点でアクセス確認）。
          </p>
          <ol className={styles.refsOl}>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>Anthropic Engineering Blog</span> — "Equipping
              agents for the real world with Agent Skills"（Barry Zhang, Keith Lazuka, Mahesh Murag
              著, 2025-10-16）
              <br />
              <ExtRef href="https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills">
                https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>Agent Skills オープン標準サイト</span> —
              agentskills.io
              <br />
              <ExtRef href="https://agentskills.io/home">https://agentskills.io/home</ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>Google Antigravity 公式ドキュメント</span>
              （Antigravity 2.0 / Customizations / Skills）
              <br />
              <ExtRef href="https://antigravity.google/docs/skills">
                https://antigravity.google/docs/skills
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>Google Antigravity 公式ドキュメント</span>
              （Antigravity IDE / Customizations / Skills）
              <br />
              <ExtRef href="https://antigravity.google/docs/ide/skills">
                https://antigravity.google/docs/ide/skills
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>Simon Willison's Weblog</span> — "Claude Skills are
              awesome, maybe a bigger deal than MCP"（2025-10-16）
              <br />
              <ExtRef href="https://simonwillison.net/2025/Oct/16/claude-skills/">
                https://simonwillison.net/2025/Oct/16/claude-skills/
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>Mete Atamel</span> — "Where does Antigravity look
              for Agent Skills?"
              <br />
              <ExtRef href="https://atamel.dev/posts/2026/07-01_where_agy_agent_skills/">
                https://atamel.dev/posts/2026/07-01_where_agy_agent_skills/
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>Google Codelabs</span> — "Authoring Google
              Antigravity Skills"
              <br />
              <ExtRef href="https://codelabs.developers.google.com/getting-started-with-antigravity-skills">
                https://codelabs.developers.google.com/getting-started-with-antigravity-skills
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>Giovanni Galloro</span> — "Creating an ADK Agent
              Skill in Antigravity"（Google Cloud Community / Medium）
              <br />
              <ExtRef href="https://medium.com/google-cloud/creating-an-adk-agent-skill-in-antigravity-0031f5f82ccb">
                https://medium.com/google-cloud/creating-an-adk-agent-skill-in-antigravity-0031f5f82ccb
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>Dazbo (Darren Lester)</span> — "Confused About Where
              to Put Your Agent Skills? (Updated for Antigravity.)"（Google Cloud Community /
              Medium）
              <br />
              <ExtRef href="https://medium.com/google-cloud/confused-about-where-to-put-your-agent-skills-ea778f3c64f3">
                https://medium.com/google-cloud/confused-about-where-to-put-your-agent-skills-ea778f3c64f3
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>RuleSell</span> — "Google Antigravity Rules and
              Agent Skills: The Setup Guide"
              <br />
              <ExtRef href="https://www.rulesell.com/topic/antigravity-rules">
                https://www.rulesell.com/topic/antigravity-rules
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>VERTU</span> — "What are Google Antigravity Skills?
              Build 24/7 AI Agents"
              <br />
              <ExtRef href="https://vertu.com/lifestyle/mastering-google-antigravity-skills-the-ultimate-guide-to-extending-agentic-ai-in-2026">
                https://vertu.com/lifestyle/mastering-google-antigravity-skills-the-ultimate-guide-to-extending-agentic-ai-in-2026
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>DEV Community</span> — "My First Experience Creating
              Antigravity Skills"
              <br />
              <ExtRef href="https://dev.to/googleai/my-first-experience-creating-antigravity-skills-524b">
                https://dev.to/googleai/my-first-experience-creating-antigravity-skills-524b
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>Pillar Security</span> — "Prompt Injection leads to
              RCE and Sandbox Escape in Antigravity"
              <br />
              <ExtRef href="https://www.pillar.security/blog/prompt-injection-leads-to-rce-and-sandbox-escape-in-antigravity">
                https://www.pillar.security/blog/prompt-injection-leads-to-rce-and-sandbox-escape-in-antigravity
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>The Hacker News</span> — "Google Patches Antigravity
              IDE Flaw Enabling Prompt Injection Code Execution"（2026-04-21）
              <br />
              <ExtRef href="https://thehackernews.com/2026/04/google-patches-antigravity-ide-flaw.html">
                https://thehackernews.com/2026/04/google-patches-antigravity-ide-flaw.html
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>Dark Reading</span> — "Google Fixes Critical RCE
              Flaw in AI-Based 'Antigravity' Tool"（2026-04-22）
              <br />
              <ExtRef href="https://www.darkreading.com/vulnerabilities-threats/google-fixes-critical-rce-flaw-ai-based-antigravity-tool">
                https://www.darkreading.com/vulnerabilities-threats/google-fixes-critical-rce-flaw-ai-based-antigravity-tool
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>CSO Online</span> — "Prompt injection turned
              Google's Antigravity file search into RCE"
              <br />
              <ExtRef href="https://www.csoonline.com/article/4161382/prompt-injection-turned-googles-antigravity-file-search-into-rce.html">
                https://www.csoonline.com/article/4161382/prompt-injection-turned-googles-antigravity-file-search-into-rce.html
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>BDTechTalks</span> — "Antigravity prompt injection
              vulnerability highlights security threats of AI-powered coding tools"
              <br />
              <ExtRef href="https://bdtechtalks.substack.com/p/antigravity-prompt-injection-vulnerability">
                https://bdtechtalks.substack.com/p/antigravity-prompt-injection-vulnerability
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>SwirlAI Newsletter</span> — "Agent Skills:
              Progressive Disclosure as a System Design Pattern"
              <br />
              <ExtRef href="https://www.newsletter.swirlai.com/p/agent-skills-progressive-disclosure">
                https://www.newsletter.swirlai.com/p/agent-skills-progressive-disclosure
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>Firecrawl Blog</span> — "Agent Skills Explained: How
              SKILL.md Files Work and Why They're Everywhere"
              <br />
              <ExtRef href="https://www.firecrawl.dev/blog/agent-skills">
                https://www.firecrawl.dev/blog/agent-skills
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>Ry Walker Research</span> — "Anthropic Skills
              (anthropics/skills)"
              <br />
              <ExtRef href="https://rywalker.com/research/anthropic-skills">
                https://rywalker.com/research/anthropic-skills
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>GitHub</span> — travisvn/awesome-claude-skills
              <br />
              <ExtRef href="https://github.com/travisvn/awesome-claude-skills">
                https://github.com/travisvn/awesome-claude-skills
              </ExtRef>
            </li>
            <li className={styles.refsLi}>
              <span className={styles.refTitle}>GitHub</span> — anthropics/skills（公式Agent
              Skillsリポジトリ）
              <br />
              <ExtRef href="https://github.com/anthropics/skills">
                https://github.com/anthropics/skills
              </ExtRef>
            </li>
          </ol>
          <p className={styles.footerNote}>
            注記:
            Antigravityは2026年7月現在も活発に開発が続く製品であり、スキルの配置パスや実行モードの仕様は将来のバージョンで変更される可能性があります。実装前には必ず上記の公式ドキュメント（3・4）の最新版をご確認ください。
          </p>
        </div>
      </footer>
    </div>
  );
}
