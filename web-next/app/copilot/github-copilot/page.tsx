import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import { ChecklistCard } from "./ChecklistCard";
import styles from "./page.module.css";
import { TocObserver } from "./TocObserver";

export const metadata: Metadata = {
  title: "GitHub Copilot 実践ベストプラクティスガイド",
  description:
    "GitHub Copilot 実践ベストプラクティスガイド — 中級者〜上級者のためのステップバイステップ活用法(2026年7月31日時点)",
};

const COPILOT_THEME_VARS = {
  fontSize: "16px",
  background: "#101f34",
  primaryColor: "#16273f",
  primaryTextColor: "#dce6f5",
  primaryBorderColor: "#2c4570",
  lineColor: "#5878b0",
  secondaryColor: "#0d1b2e",
  tertiaryColor: "#0d1b2e",
  noteBkgColor: "#16273f",
  noteTextColor: "#dce6f5",
  noteBorderColor: "#2c4570",
  actorBkg: "#16273f",
  actorBorder: "#2c4570",
  actorTextColor: "#dce6f5",
  signalColor: "#8ea3c2",
  signalTextColor: "#dce6f5",
};

const CHART_1 = `flowchart TB
    A["GitHub Copilot<br/>共通ハーネス"] --> B["インライン補完 / NES<br/>(Next Edit Suggestions)"]
    A --> C["Copilot Chat<br/>Ask / Edit / Agent"]
    A --> D["Copilot CLI<br/>ターミナル常駐エージェント"]
    A --> E["Copilot Coding Agent<br/>(クラウド/バックグラウンド)"]
    A --> F["Copilot Code Review<br/>PRレビュー自動化"]
    A --> G["Copilot Spaces<br/>チームのナレッジベース"]
    A --> H["Copilot App<br/>キャンバス型の新インターフェース"]

    C --> C1["VS Code / Visual Studio / JetBrains<br/>/ Eclipse / Xcode"]
    D --> D1["/plan・Autopilot・Allow All"]
    E --> E1["@copilot へIssueを割り当て"]
    F --> F1["Agent Skills + MCP(GA)"]`;

const CHART_2 = `flowchart TD
    Start["タスクを分類する"] --> Q1{"コードを変更する必要があるか?"}
    Q1 -- "いいえ(説明・学習・調査のみ)" --> Ask["Ask モード<br/>質問応答のみ、ファイル変更なし"]
    Q1 -- "はい" --> Q2{"変更範囲は単一ファイルか?"}
    Q2 -- "はい(対象が明確)" --> Edit["Edit モード<br/>選択ファイル内で編集"]
    Q2 -- "いいえ(複数ファイル・調査・<br/>ツール実行が必要)" --> Agent["Agent モード<br/>自律的に計画・編集・実行・修正"]
    Agent --> Q3{"MCPサーバーや外部ツール<br/>連携が必要か?"}
    Q3 -- "はい" --> AgentMCP["Agent モード + MCP接続"]
    Q3 -- "いいえ" --> AgentPlain["Agent モードのみで実行"]`;

const CHART_3 = `flowchart TD
    P["個人インストラクション<br/>(ユーザー単位・全プロジェクト共通)"] --> Merge["Copilotが全てのソースを<br/>統合してコンテキストに含める"]
    R["リポジトリインストラクション<br/>.github/copilot-instructions.md"] --> Merge
    Path["パス限定インストラクション<br/>.github/instructions/**.instructions.md<br/>(applyTo で対象パスを指定)"] --> Merge
    Agents["AGENTS.md<br/>(エージェント/CLI/コーディングエージェント向け)"] --> Merge
    Merge --> Priority["優先順位: 個人 > リポジトリ > 組織<br/>(ただし全て同時にコンテキストへ供給される)"]
    Priority --> Output["矛盾する指示は避けること<br/>(競合時は個人インストラクションが優先)"]`;

const CHART_4 = `flowchart LR
    Repo["ナレッジベースリポジトリ<br/>(コーディング規約・ADR・セキュリティルール<br/>・テスト規約・テンプレート)"] --> Space["Copilot Space<br/>「エンジニアリング標準コーチ」"]
    App["アプリケーションリポジトリ"] --> Space
    Instr["指示(Rules of Engagement)"] --> Space
    Space --> Dev["開発者からの質問"]
    Dev --> Answer["標準に沿った回答<br/>+ 準拠している規約の明示<br/>+ レビュー用チェックリスト"]`;

const CHART_5 = `flowchart TD
    S1["① ツールを1つ選ぶ<br/>(CLI / VS Code / Visual Studio / JetBrains)"] --> S2["② YOLOモード(Allow All)を有効化<br/>※必ずサンドボックス内で"]
    S2 --> S3["③ プロトタイプから始める<br/>複数バリエーションを一括生成"]
    S3 --> S4["④ Planモードで方法論的に計画<br/>/plan でエッジケースを洗い出す"]
    S4 --> S5["⑤ Autopilotで実装<br/>計画の各項目を自律的に完了"]
    S5 --> S6["⑥ 人間によるレビューと反復<br/>妥協せず品質を追求する"]
    S6 --> S7["⑦ Rubber Duckレビュー<br/>別系統のモデルに二重チェックさせる"]
    S7 --> S8["⑧ コミット<br/>新しいトピックは新セッションで"]`;

const CHART_6 = `sequenceDiagram
    participant Dev as 開発者
    participant CLI as Copilot CLI
    participant Repo as リポジトリ/ファイルシステム

    Dev->>CLI: プロンプトを入力
    CLI->>Repo: AGENTS.md / copilot-instructions.md<br/>を自動検出・読み込み
    Dev->>CLI: Shift+Tab で Plan モードへ切替
    CLI->>Dev: 質問を重ねながら実装計画を提示
    Dev->>CLI: 計画を承認
    CLI->>Repo: Autopilotでファイル読み書き・<br/>コマンド実行(許可された範囲で)
    CLI-->>Dev: 進捗と結果を報告
    Dev->>CLI: /allow-all でYOLOモードに切替(任意)
    Note over CLI,Repo: サンドボックス環境(/sandbox enable, --cloud)を<br/>推奨(いずれもPublic Preview, 2026年7月時点)`;

const CHART_7 = `sequenceDiagram
    participant Dev as 開発者
    participant Issue as GitHub Issue
    participant Agent as Copilot Coding Agent
    participant PR as Pull Request

    Dev->>Issue: Issueを作成し、要件・受け入れ条件を明記
    Dev->>Agent: Issueを @copilot にアサイン
    Agent->>Agent: AGENTS.md / copilot-instructions.md /<br/>.instructions.md を読み込み
    Agent->>Agent: MCPサーバー(GitHub MCP等)を用いて<br/>リポジトリ情報・Issue履歴を収集
    Agent->>PR: ドラフトPRを作成しコミットをpush
    Agent->>Dev: レビュアーとして開発者を追加、通知
    Dev->>PR: 人間と同じレビュープロセスでマージ判断`;

const CHART_8 = `flowchart TD
    PR["Pull Requestが作成される"] --> Review["Copilot Code Reviewが起動<br/>(GitHub Actionsで実行)"]
    Review --> Skill{".github/skills 配下に<br/>SKILL.md はあるか?"}
    Skill -- "あり" --> SkillUse["リポジトリ/組織固有の規約・<br/>内部ツールをレビューに反映"]
    Skill -- "なし" --> Default["Copilotの標準分析のみ"]
    Review --> MCP{"MCPサーバー設定は<br/>あるか?"}
    MCP -- "あり(読み取り専用)" --> MCPUse["Issueトラッカー・ドキュメント・<br/>サービスカタログ等から文脈を取得"]
    MCP -- "なし" --> DefaultMCP["GitHub MCP / Playwright MCPが<br/>既定で有効"]
    SkillUse --> Comment["レビューコメントを生成"]
    MCPUse --> Comment
    Default --> Comment
    DefaultMCP --> Comment
    Comment --> Attribution["コメントにSkill/MCPの<br/>出典を明示(Attribution)"]`;

const CHART_9 = `flowchart TD
    Task["タスクの性質を評価"] --> Simple{"構文・定型文・<br/>ボイラープレート程度か?"}
    Simple -- "はい" --> Fast["高速・低コストモデル<br/>(Haiku系 / Grok Code Fast 等)"]
    Simple -- "いいえ" --> Mid{"標準的な機能実装・<br/>アルゴリズムか?"}
    Mid -- "はい" --> Balanced["バランス型モデル<br/>(Sonnet系 / GPT-5.4系等)を<br/>中程度の推論レベルで"]
    Mid -- "いいえ" --> Hard{"アーキテクチャ設計・<br/>ミッションクリティカルな判断か?"}
    Hard -- "はい" --> Premium["フラッグシップモデル<br/>(Opus系 / GPT-5.5系等)"]
    Hard -- "いいえ" --> Context{"非常に大きな<br/>コンテキストが必要か?"}
    Context -- "はい" --> LargeCtx["大規模コンテキスト対応モデル<br/>(Gemini Pro系等)"]
    Context -- "いいえ" --> Balanced`;

const CHART_10 = `flowchart TD
    Threat["脅威: プロンプトインジェクション<br/>(コード/コメント/Issue/PRコメント/<br/>ツール出力に隠された指示)"] --> L1["対策① 最小権限の原則<br/>エージェントに与えるデータ・権限を必要最小限に"]
    Threat --> L2["対策② サンドボックス実行<br/>Codespaces / Dev Container / /sandbox enable"]
    Threat --> L3["対策③ 人間によるレビュー<br/>PRマージ前の必須チェック"]
    Threat --> L4["対策④ MCP読み取り専用化<br/>書き込み権限は慎重に評価"]
    Threat --> L5["対策⑤ シークレット衛生<br/>プロンプト・環境変数にシークレットを含めない"]
    Threat --> L6["対策⑥ 監査可能性<br/>コミットの共著者表示・アクション属性の明確化"]
    L1 --> Result["攻撃が成功しても<br/>被害範囲(blast radius)を限定"]
    L2 --> Result
    L3 --> Result
    L4 --> Result
    L5 --> Result
    L6 --> Result`;

const CHART_11 = `flowchart TD
    AP["よくあるアンチパターン"] --> AP1["何でもAgentモードで済ませる<br/>(高コストな割に精度が下がる)"]
    AP1 --> Fix1["→ タスクの性質に応じてAsk/Edit/Agentを使い分ける"]
    AP --> AP2["巨大で曖昧な1発プロンプト"]
    AP2 --> Fix2["→ プロトタイプ→計画(/plan)→実装の順に分解する"]
    AP --> AP3["生成コードを無検証でマージ"]
    AP3 --> Fix3["→ 必ず読み、テストし、レビューしてから採用する"]
    AP --> AP4["インストラクションファイルを肥大化させる"]
    AP4 --> Fix4["→ 1指示1文・600語以内を目安に簡潔化する"]
    AP --> AP5["ローカルマシンでYOLOモードを実行"]
    AP5 --> Fix5["→ Codespaces / Dev Containerなどサンドボックスで実行"]
    AP --> AP6["関係のない話題を1つのChatセッションに詰め込む"]
    AP6 --> Fix6["→ 話題ごとに新しいセッションを開始する"]`;

/**
 * Renders the GitHub Copilot Best Practices Guide page.
 */
export default function GithubCopilotPage() {
  return (
    <div className={styles.layout}>
      <button
        type="button"
        className={styles.sidebarToggle}
        id="sidebarToggle"
        aria-label="目次を開く"
        aria-expanded="false"
      >
        ☰
      </button>
      <div className={styles.sidebarOverlay} id="sidebarOverlay" />

      <nav className={styles.sidebar} id="sidebar">
        <div className={styles.sidebarBrand}>
          <span className={styles.mark}>⚙</span>Copilot Guide
        </div>
        <p className={styles.sidebarTagline}>Best Practices 2026</p>
        <ul className={styles.navList}>
          <li>
            <a
              href="#1-github-copilotの全体像2026年時点のプロダクトファミリー"
              className={styles.navLink}
              data-id="1-github-copilotの全体像2026年時点のプロダクトファミリー"
            >
              1. GitHub Copilotの全体像(2026年時点のプロダクトファミリー)
            </a>
          </li>
          <li>
            <a
              href="#2-3つのchatモードを使い分けるask--edit--agent"
              className={styles.navLink}
              data-id="2-3つのchatモードを使い分けるask--edit--agent"
            >
              2. 3つのChatモードを使い分ける(Ask / Edit / Agent)
            </a>
          </li>
          <li>
            <a
              href="#3-カスタムインストラクションの3層構造"
              className={styles.navLink}
              data-id="3-カスタムインストラクションの3層構造"
            >
              3. カスタムインストラクションの3層構造
            </a>
          </li>
          <li>
            <a
              href="#4-プロンプトファイルとカスタムチャットモード"
              className={styles.navLink}
              data-id="4-プロンプトファイルとカスタムチャットモード"
            >
              4. プロンプトファイルとカスタムチャットモード
            </a>
          </li>
          <li>
            <a
              href="#5-カスタムエージェントとサブエージェント"
              className={styles.navLink}
              data-id="5-カスタムエージェントとサブエージェント"
            >
              5. カスタムエージェントとサブエージェント
            </a>
          </li>
          <li>
            <a
              href="#6-copilot-spacesでチームのナレッジベースを構築する"
              className={styles.navLink}
              data-id="6-copilot-spacesでチームのナレッジベースを構築する"
            >
              6. Copilot Spacesでチームのナレッジベースを構築する
            </a>
          </li>
          <li>
            <a
              href="#7-エージェントモード実践ワークフロー8ステップ"
              className={styles.navLink}
              data-id="7-エージェントモード実践ワークフロー8ステップ"
            >
              7. エージェントモード実践ワークフロー(8ステップ)
            </a>
          </li>
          <li>
            <a
              href="#8-github-copilot-cliを使いこなす"
              className={styles.navLink}
              data-id="8-github-copilot-cliを使いこなす"
            >
              8. GitHub Copilot CLIを使いこなす
            </a>
          </li>
          <li>
            <a
              href="#9-coding-agentクラウドエージェントにissueを任せる"
              className={styles.navLink}
              data-id="9-coding-agentクラウドエージェントにissueを任せる"
            >
              9. Coding Agent(クラウドエージェント)にIssueを任せる
            </a>
          </li>
          <li>
            <a
              href="#10-copilot-code-review--agent-skillsとmcpの活用"
              className={styles.navLink}
              data-id="10-copilot-code-review--agent-skillsとmcpの活用"
            >
              10. Copilot Code Review — Agent SkillsとMCPの活用
            </a>
          </li>
          <li>
            <a
              href="#11-mcpサーバー統合のベストプラクティス"
              className={styles.navLink}
              data-id="11-mcpサーバー統合のベストプラクティス"
            >
              11. MCPサーバー統合のベストプラクティス
            </a>
          </li>
          <li>
            <a href="#12-モデル選定戦略" className={styles.navLink} data-id="12-モデル選定戦略">
              12. モデル選定戦略
            </a>
          </li>
          <li>
            <a
              href="#13-セキュリティと責任あるai活用"
              className={styles.navLink}
              data-id="13-セキュリティと責任あるai活用"
            >
              13. セキュリティと責任あるAI活用
            </a>
          </li>
          <li>
            <a
              href="#14-コストとai-creditsの管理"
              className={styles.navLink}
              data-id="14-コストとai-creditsの管理"
            >
              14. コストとAI Creditsの管理
            </a>
          </li>
          <li>
            <a
              href="#15-よくあるアンチパターン"
              className={styles.navLink}
              data-id="15-よくあるアンチパターン"
            >
              15. よくあるアンチパターン
            </a>
          </li>
          <li>
            <a
              href="#16-ベストプラクティスチェックリスト"
              className={styles.navLink}
              data-id="16-ベストプラクティスチェックリスト"
            >
              16. ベストプラクティスチェックリスト
            </a>
          </li>
          <li>
            <a href="#17-参考文献" className={styles.navLink} data-id="17-参考文献">
              17. 参考文献
            </a>
          </li>
        </ul>
      </nav>

      <main className={styles.main} id="main">
        <div className={styles.hero}>
          <p className={styles.eyebrow}>GitHub Copilot 実践ガイド</p>
          <h1>GitHub Copilot 実践ベストプラクティスガイド</h1>
          <p className={styles.heroSub}>
            中級者〜上級者のためのステップバイステップ活用法(2026年7月31日時点)
          </p>
          <div className={styles.heroLede}>
            <p>
              GitHub Copilotは、単なる「コード補完ツール」から「エージェント・ハーネス(agent
              harness)」へと姿を変えました。Chat・CLI・Coding Agent・Code
              Review・Spaces——複数の製品面が同じ推論基盤を共有し、Ask/Edit/Agentという3つのモード、カスタムインストラクション、MCP(Model
              Context Protocol)、サブエージェントといった仕組みで構成されています。
            </p>
            <p>
              本ガイドは、GitHub公式ドキュメント・GitHub Changelog・VS
              Code公式ドキュメント、そしてSimon Willison氏、GitHubのBurke Holland氏、Google
              Engineering LeadのAddy
              Osmani氏といった著名な開発者の発信内容を調査した上でまとめたものです。GitHub
              Copilotは更新が非常に速いため、実際の挙動は必ず公式ドキュメントで確認してください。
            </p>
          </div>
        </div>

        <hr />

        <h2 id="1-github-copilotの全体像2026年時点のプロダクトファミリー">
          1. GitHub Copilotの全体像(2026年時点のプロダクトファミリー)
        </h2>
        <p>
          GitHub Copilotはもはや単一機能ではなく、用途の異なる複数の面(surface)からなる製品群です。
        </p>
        <MermaidDiagram chart={CHART_1} theme="dark" themeVariables={COPILOT_THEME_VARS} />
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr className="header">
                <th>面(サーフェス)</th>
                <th>主な用途</th>
                <th>主なドキュメント</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>インライン補完 / Next Edit Suggestions</td>
                <td>1行〜数行単位の即時補完。無制限・無料枠あり</td>
                <td>
                  <code>docs.github.com/copilot</code>
                </td>
              </tr>
              <tr className="even">
                <td>Copilot Chat(Ask/Edit/Agent)</td>
                <td>IDE内での対話・複数ファイル編集</td>
                <td>VS Code / Visual Studio / JetBrains</td>
              </tr>
              <tr className="odd">
                <td>Copilot CLI</td>
                <td>ターミナルでのエージェント作業、Plan/Autopilot</td>
                <td>
                  <code>docs.github.com/copilot/how-tos/copilot-cli</code>
                </td>
              </tr>
              <tr className="even">
                <td>Copilot Coding Agent(クラウド)</td>
                <td>Issueをバックグラウンドで自律的に処理しPRを作成</td>
                <td>
                  <code>docs.github.com/copilot/how-tos/agents</code>
                </td>
              </tr>
              <tr className="odd">
                <td>Copilot Code Review</td>
                <td>PRの自動レビュー。Agent Skills / MCPに対応(2026年7月29日GA)</td>
                <td>
                  <code>docs.github.com/copilot/using-github-copilot/code-review</code>
                </td>
              </tr>
              <tr className="even">
                <td>Copilot Spaces</td>
                <td>コード・ドキュメント・Issueを束ねたチームのナレッジベース</td>
                <td>
                  <code>docs.github.com</code> / Microsoft Learn
                </td>
              </tr>
              <tr className="odd">
                <td>Copilot App</td>
                <td>プロトタイピングやキャンバス型のインタラクティブ作業向け新インターフェース</td>
                <td>GitHub Blog</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          各サーフェスの詳細な挙動は異なりますが、
          <strong>同じハーネス(harness)を共有している</strong>
          ため、一度使い方を覚えればどこでも応用できます。GitHubのBurke
          Holland氏はこれを次のように表現しています——学ぶべきは個々の小技ではなく、ハーネスそのものの使い方だという考え方です。
        </p>
        <blockquote>
          <p>
            出典: Burke Holland, <em>"The harness is all you need (mostly)"</em>, The GitHub Blog,
            2026-07-27
          </p>
        </blockquote>
        <hr />
        <h2 id="2-3つのchatモードを使い分けるask--edit--agent">
          2. 3つのChatモードを使い分ける(Ask / Edit / Agent)
        </h2>
        <p>
          GitHub Copilot
          Chatには3つの基本モードがあり、タスクの性質に応じて選ぶことでコストと精度のバランスが取れます。
        </p>
        <MermaidDiagram chart={CHART_2} theme="dark" themeVariables={COPILOT_THEME_VARS} />
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr className="header">
                <th>モード</th>
                <th>挙動</th>
                <th>適した場面</th>
                <th>コスト特性</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>
                  <strong>Ask</strong>
                </td>
                <td>ファイルを変更せず回答のみ</td>
                <td>コードの説明、設計相談、概念の理解</td>
                <td>最も安価</td>
              </tr>
              <tr className="even">
                <td>
                  <strong>Edit</strong>
                </td>
                <td>選択中のファイル内でピンポイントに編集</td>
                <td>対象ファイルが分かっている単純なリファクタ</td>
                <td>中程度</td>
              </tr>
              <tr className="odd">
                <td>
                  <strong>Agent</strong>
                </td>
                <td>
                  複数ファイルを横断し、必要なツール・ターミナルコマンドを自律的に呼び出し、エラーを自己修正しながら反復
                </td>
                <td>機能追加、複雑なリファクタ、テスト作成、レガシー移行</td>
                <td>高め(反復のたびにAI Creditsを消費)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>実践のコツ</strong>
        </p>
        <ul>
          <li>
            まず <strong>Ask モード</strong>で問題のスコープを固め、要件が固まってから
            <strong>Agent モード</strong>に切り替えると、AI Creditsの浪費を防げます。
          </li>
          <li>
            Agent
            モードは1回の複雑なタスクで10〜20回分のプレミアムリクエストを消費することもあるため、着手前に要件を明確化しておくことが重要です。
          </li>
          <li>
            VS Codeでは、Copilot Editsビューのモードドロップダウンから切り替え可能です。Copilot
            CLIでは <code>Shift+Tab</code> でPlanモードとの行き来ができます。
          </li>
        </ul>
        <blockquote>
          <p>
            出典: <em>"Copilot ask, edit, and agent modes: What they do and when to use them"</em>,
            The GitHub Blog / <em>"GitHub Copilot Agent Mode: The Complete Guide for 2026"</em>,
            fundesk.io
          </p>
        </blockquote>
        <hr />
        <h2 id="3-カスタムインストラクションの3層構造">3. カスタムインストラクションの3層構造</h2>
        <p>
          Copilotは複数のインストラクションソースを同時に読み込み、優先順位に従って解決します。この階層を理解しないまま設定すると、「なぜか指示が無視される」という事態に陥ります。
        </p>
        <MermaidDiagram chart={CHART_3} theme="dark" themeVariables={COPILOT_THEME_VARS} />
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr className="header">
                <th>ファイル</th>
                <th>適用範囲</th>
                <th>主な用途</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>
                  <code>.github/copilot-instructions.md</code>
                </td>
                <td>リポジトリ全体、全リクエストに常時適用</td>
                <td>コーディング規約・ビルド/テストコマンド・命名規則</td>
              </tr>
              <tr className="even">
                <td>
                  <code>.github/instructions/*.instructions.md</code>
                </td>
                <td>
                  <code>applyTo</code> で指定したパスのみ(例: <code>**/*.tsx</code>)
                </td>
                <td>フレームワーク別・ファイル種別ごとのルール</td>
              </tr>
              <tr className="odd">
                <td>
                  <code>AGENTS.md</code>(ルートおよびネスト可能)
                </td>
                <td>Copilot CLI、Coding Agent、Copilot Chatのエージェント的タスク</td>
                <td>ビルド・テスト・検証手順など「エージェントが自律的に動く際に必要な情報」</td>
              </tr>
              <tr className="even">
                <td>個人インストラクション</td>
                <td>そのユーザーの全プロジェクト</td>
                <td>好みのコーディングスタイルなど個人設定</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>ベストプラクティス</strong>
        </p>
        <ul>
          <li>
            <strong>1指示1文</strong>を徹底する。複数の情報を詰め込みたい場合は箇条書きで分割する。
          </li>
          <li>
            <strong>理由を書く</strong>
            。「なぜそのルールが存在するか」を書き添えると、エッジケースでの判断精度が上がる。
          </li>
          <li>
            <strong>600語を超えない</strong>
            。インライン提案生成時、Copilotは長大な指示ファイルを全文読み込まない場合があり、実効コンテキストウィンドウを超えた部分は無視される。
          </li>
          <li>
            VS Codeでは <code>/init</code> で既存の規約を検出しつつ雛形を生成、
            <code>/create-instructions</code>
            で特定用途向けの指示を追加生成できる。
          </li>
          <li>
            Copilot CLIでは
            <code>@相対パス</code>
            の記法で別ファイルを読み込ませることができ、参照先ファイル内のさらなる参照も解決される。
          </li>
          <li>
            <code>.github/copilot-instructions.md</code> と<code>.cursorrules</code>{" "}
            は似て非なるものであり、
            <strong>
              Copilotは <code>.cursorrules</code> を読まない
            </strong>
            。
          </li>
        </ul>
        <blockquote>
          <p>
            出典: GitHub Docs <em>"Adding custom instructions for GitHub Copilot"</em> / VS Code
            Docs <em>"Use custom instructions"</em> / GitHub Changelog (AGENTS.md対応, 2025-08-28) /
            <em>"AI Coding Best Practices for GitHub Copilot (2026)"</em>, cursor-alternatives.com
          </p>
        </blockquote>
        <hr />
        <h2 id="4-プロンプトファイルとカスタムチャットモード">
          4. プロンプトファイルとカスタムチャットモード
        </h2>
        <p>
          繰り返し使うプロンプトは
          <code>.prompt.md</code> ファイルとして保存し、スラッシュコマンドのように呼び出せます。
        </p>
        <pre className={styles.codeBlock}>
          <div className={styles.codeLine}>
            <span className={styles.ck}>---</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.ck}>mode</span>:{" "}
            <span className={styles.cs}>&apos;agent&apos;</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.ck}>tools</span>: [
            <span className={styles.cs}>&apos;githubRepo&apos;</span>,{" "}
            <span className={styles.cs}>&apos;codebase&apos;</span>]
          </div>
          <div className={styles.codeLine}>
            <span className={styles.ck}>description</span>:{" "}
            <span className={styles.cs}>&apos;Reactフォームコンポーネントを新規生成する&apos;</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.ck}>---</span>
          </div>
          <div className={styles.codeLine}>
            あなたの目標は #githubRepo contoso/react-templates のテンプレートを参考に、
          </div>
          <div className={styles.codeLine}>
            新しいReactフォームコンポーネントを生成することです。
          </div>
          <div className={styles.codeLine}>
            フォーム名とフィールドが未指定の場合は質問してください。
          </div>
        </pre>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr className="header">
                <th>フィールド</th>
                <th>意味</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>
                  <code>mode</code>
                </td>
                <td>
                  実行時のChatモード(<code>ask</code> / <code>edit</code> /<code>agent</code>
                  、既定は <code>agent</code>)
                </td>
              </tr>
              <tr className="even">
                <td>
                  <code>tools</code>
                </td>
                <td>Agentモード時に使用を許可するツール一覧</td>
              </tr>
              <tr className="odd">
                <td>
                  <code>model</code>
                </td>
                <td>使用する特定モデルを固定したい場合に指定</td>
              </tr>
              <tr className="even">
                <td>
                  <code>description</code>
                </td>
                <td>プロンプトの説明(スラッシュコマンド一覧に表示)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          さらに、<code>.chatmode.md</code>
          を使うと<strong>カスタムチャットモード</strong>
          を定義でき、特定領域(コードレビュー専任、テスト専任など)にフォーカスしたモードを何個でも作成できます。ただし、カスタムチャットモードもAI
          Creditsを消費するため、無秩序に増やすとコストが見えにくくなる点に注意してください。
        </p>
        <blockquote>
          <p>
            出典: <em>"GitHub Copilot Chat を使う時のTips(Instruction files, Prompt files)"</em>,
            Zenn /
            <em>
              "Master GitHub Copilot Customization in VS Code with Instructions and Prompt Files"
            </em>
            , Copilot That Jawn / <em>"Blog Post - Modes of Chatting with GitHub Copilot"</em>, CODE
            Magazine
          </p>
        </blockquote>
        <hr />
        <h2 id="5-カスタムエージェントとサブエージェント">
          5. カスタムエージェントとサブエージェント
        </h2>
        <p>
          <code>.agent.md</code>
          ファイルを使うと、特化型のペルソナ(コードレビュー専任、テスト専任、セキュリティ監査専任など)を定義できます。
        </p>
        <pre className={styles.codeBlock}>
          <div className={styles.codeLine}>
            <span className={styles.ck}>---</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.ck}>description</span>:{" "}
            <span className={styles.cs}>
              &apos;テストカバレッジと品質、テストのベストプラクティスに特化&apos;
            </span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.ck}>name</span>:{" "}
            <span className={styles.cs}>&apos;Test Specialist&apos;</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.ck}>tools</span>: [
            <span className={styles.cs}>&apos;read&apos;</span>,{" "}
            <span className={styles.cs}>&apos;edit&apos;</span>,{" "}
            <span className={styles.cs}>&apos;search&apos;</span>]
          </div>
          <div className={styles.codeLine}>
            <span className={styles.ck}>model</span>:{" "}
            <span className={styles.cs}>&apos;Claude Sonnet 4.5&apos;</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.ck}>target</span>:{" "}
            <span className={styles.cs}>&apos;vscode&apos;</span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.ck}>---</span>
          </div>
          <div className={styles.codeLine}>あなたはテスト専門のスペシャリストです。</div>
          <div className={styles.codeLine}>実装の前に必ずテストケースの網羅性を確認し、</div>
          <div className={styles.codeLine}>エッジケースを洗い出してから実装を進めてください。</div>
        </pre>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr className="header">
                <th>項目</th>
                <th>配置場所</th>
                <th>スコープ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>リポジトリレベルのカスタムエージェント</td>
                <td>
                  <code>.github/agents/</code>
                </td>
                <td>リポジトリ単位</td>
              </tr>
              <tr className="even">
                <td>個人のカスタムエージェント</td>
                <td>
                  <code>~/.copilot/agents/</code>
                </td>
                <td>全プロジェクト共通</td>
              </tr>
              <tr className="odd">
                <td>組織/Enterprise共有エージェント</td>
                <td>
                  <code>agents/</code>(組織レベル)
                </td>
                <td>組織全体</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>サブエージェント(subagents)</strong>
          は、メインのChatセッション内で独立したコンテキストウィンドウを持つ子エージェントに作業を委譲する仕組みです。リサーチや大量ドキュメントの処理など、メインの会話コンテキストを汚したくない場合に有効で、Agentモードは複雑なタスクの際に自動的に「Explore」(小型モデル)や「General
          Purpose」(大型モデル)といった組み込みサブエージェントへオーケストレーションを行います。特別な設定をしなくても、この恩恵は標準で得られます。
        </p>
        <blockquote>
          <p>
            出典: GitHub Docs <em>"Asking GitHub Copilot questions in your IDE"</em> /
            <em>awesome-copilot</em> リポジトリ(<code>agents.instructions.md</code>) / Burke
            Holland, <em>"The harness is all you need (mostly)"</em>
          </p>
        </blockquote>
        <hr />
        <h2 id="6-copilot-spacesでチームのナレッジベースを構築する">
          6. Copilot Spacesでチームのナレッジベースを構築する
        </h2>
        <p>
          2025年11月1日に「Copilot Knowledge Bases」が廃止され、後継として
          <strong>Copilot Spaces</strong>
          に一本化されました。Spacesは、コード・Markdown・Issue・PR・アップロードファイル・自由記述テキストなどを1つのコンテキストにまとめ、チームで共有できる仕組みです。
        </p>
        <MermaidDiagram chart={CHART_4} theme="dark" themeVariables={COPILOT_THEME_VARS} />
        <p>
          <strong>活用パターン</strong>
        </p>
        <ol type="1">
          <li>
            <strong>プロジェクト専任アシスタント</strong>
            :主要プロジェクトごとにSpaceを作成し、内部規約に沿ったコード生成・複雑なモジュールの説明・安全なリファクタリングを行わせる。
          </li>
          <li>
            <strong>チームのナレッジベース</strong>
            :コーディング規約・アーキテクチャ決定・ベストプラクティスを集約し、新人のオンボーディングを加速する。
          </li>
          <li>
            <strong>API/ドキュメント支援</strong>
            :APIドキュメントのドラフト作成、README生成、用語の一貫性維持。
          </li>
          <li>
            <strong>セキュリティ/コンプライアンス</strong>
            :セキュリティポリシーやコンプライアンスチェックリストを添付し、方針に沿った安全なコードを提案させる。
          </li>
        </ol>
        <p>
          <strong>運用のコツ</strong>
          :1つのSpaceは単一の目的に絞ること。「何でも入れたSpace」は回答精度を落とします。Spaceは組織・チーム・個人ユーザー単位で共有・非公開を選択でき、GitHub上のコンテンツが更新されれば内容も追随して最新化されます。
        </p>
        <blockquote>
          <p>
            出典:
            <em>
              "Turning GitHub Copilot into a 'Best Practices Coach' with Copilot Spaces + a Markdown
              Knowledge Base"
            </em>
            , Microsoft Community Hub, 2026-05-06 /<em>"Sunset notice: Copilot knowledge bases"</em>
            , GitHub Changelog /<em>"How to use GitHub Copilot Spaces to debug issues faster"</em>,
            The GitHub Blog
          </p>
        </blockquote>
        <hr />
        <h2 id="7-エージェントモード実践ワークフロー8ステップ">
          7. エージェントモード実践ワークフロー(8ステップ)
        </h2>
        <p>
          GitHubのBurke Holland氏が2026年7月27日に公開した記事
          <em>"The harness is all you need (mostly)"</em>
          では、特別なMCPやスキルに頼らず、既存機能だけで生産性を大きく高める実践的な8ステップワークフローが紹介されています。以下はその要点です。
        </p>
        <MermaidDiagram chart={CHART_5} theme="dark" themeVariables={COPILOT_THEME_VARS} />
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr className="header">
                <th>ステップ</th>
                <th>ポイント</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>① ツール選択</td>
                <td>
                  ハーネスは共通なので、どれか1つを深く学べば他にも応用できる。初学者はUIが少ないCLIから始めるのがおすすめ
                </td>
              </tr>
              <tr className="even">
                <td>② YOLOモード</td>
                <td>
                  エージェントに自律性を与えないと生産性向上は得られない。ただし
                  <strong>ローカルマシンでは実行しない</strong>。GitHub CodespacesやDev
                  Containerなどサンドボックス環境を使う
                </td>
              </tr>
              <tr className="odd">
                <td>③ プロトタイプ</td>
                <td>
                  「20パターンのモック」のように複数バリエーションを一括生成させ、人間が比較検討する。視覚情報は密なテキストより速く処理できる
                </td>
              </tr>
              <tr className="even">
                <td>④ 計画(Plan)</td>
                <td>
                  <code>/plan</code>
                  で要件のヌケモレ・エッジケースを洗い出す。曖昧な一文のプロンプトでも、計画フェーズが質問を重ねて具体化してくれる
                </td>
              </tr>
              <tr className="odd">
                <td>⑤ 実装(Autopilot)</td>
                <td>
                  計画の各項目を完了させるまで自律的にループする。複雑さに応じて内部的に小型/大型モデルのサブエージェントへ自動振り分けされる
                </td>
              </tr>
              <tr className="even">
                <td>⑥ 人間レビュー</td>
                <td>「だいたいで良い」を許容しない。品質の見極めは依然として人間の責任</td>
              </tr>
              <tr className="odd">
                <td>⑦ Rubber Duckレビュー</td>
                <td>
                  異なるモデルファミリーに二重チェックさせる(例:
                  GPT系で実装→Claude系でレビュー)ことで、単一モデルの死角を補える
                </td>
              </tr>
              <tr className="even">
                <td>⑧ 完了</td>
                <td>
                  話題が変わったら新しいセッションを開始する。コンテキストウィンドウは有限であることを忘れない
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>モデル選択のヒント(同記事より)</strong>:多くの作業には中規模モデル(例: GPT-5.6
          Terra やClaude
          Sonnet系)を中程度の推論レベルで使い、その機能・バグ修正の間はモデルや推論レベルを変えないことが推奨されています。これは、モデルや推論レベルを変えない限りプロンプトキャッシュが効き、以降のリクエストのコストが下がるためです。
        </p>
        <blockquote>
          <p>
            出典: Burke Holland, <em>"The harness is all you need (mostly)"</em>, The GitHub Blog,
            2026-07-27(更新: 2026-07-28)
          </p>
        </blockquote>
        <hr />
        <h2 id="8-github-copilot-cliを使いこなす">8. GitHub Copilot CLIを使いこなす</h2>
        <p>
          Copilot
          CLIは、ターミナルに常駐するエージェント型アシスタントです。チャットボットとしても使えますが、真価は自律的にコマンドを実行しながらタスクをこなす点にあります。
        </p>
        <MermaidDiagram chart={CHART_6} theme="dark" themeVariables={COPILOT_THEME_VARS} />
        <p>
          <strong>主要なスラッシュコマンド</strong>
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr className="header">
                <th>コマンド</th>
                <th>役割</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>
                  <code>/help</code>
                </td>
                <td>最新の利用可能なコマンド一覧を表示(CLIは頻繁に更新されるため都度確認推奨)</td>
              </tr>
              <tr className="even">
                <td>
                  <code>/models</code>
                </td>
                <td>使用するモデルを切り替え</td>
              </tr>
              <tr className="odd">
                <td>
                  <code>/plan</code>(または <code>Shift+Tab</code>)
                </td>
                <td>実装前に協働的な計画フェーズへ入る</td>
              </tr>
              <tr className="even">
                <td>
                  <code>/allow-all</code>
                </td>
                <td>YOLOモード(Allow All)を有効化</td>
              </tr>
              <tr className="odd">
                <td>
                  <code>/sandbox enable</code>
                </td>
                <td>ローカルサンドボックスを有効化(2026年7月時点でPublic Preview)</td>
              </tr>
              <tr className="even">
                <td>
                  <code>--cloud</code>
                </td>
                <td>クラウド側サンドボックスでの実行(同上)</td>
              </tr>
              <tr className="odd">
                <td>
                  <code>--secret-env-vars</code>
                </td>
                <td>スクリプト実行時に指定したシークレットをログから redact</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>ベストプラクティス</strong>
        </p>
        <ul>
          <li>
            リポジトリインストラクションは常にユーザーレベルのインストラクションより優先されるため、チーム規約の強制に使える。
          </li>
          <li>
            <code>GITHUB_TOKEN</code> や <code>COPILOT_GITHUB_TOKEN</code> は既定でログから redact
            されるが、それ以外のシークレットをプロンプトや環境変数に含めないことが重要。
          </li>
          <li>
            実行前に「そのフォルダ以下は信頼できるか」を必ず確認する。CLIはそのフォルダ以下のファイルを読み書き・実行できるため。
          </li>
          <li>
            Plan mode →
            Autopilotの順に進めることで、いきなり巨大で曖昧な依頼を投げるアンチパターンを避けられる。
          </li>
        </ul>
        <blockquote>
          <p>
            出典: GitHub Docs <em>"Best practices for GitHub Copilot CLI"</em> / GitHub Changelog
            <em>"GitHub Copilot CLI: Plan before you build, steer as you go"</em>, 2026-01-21 /
            <em>"The GitHub Copilot CLI Permission Model: What It Can and Can't Touch"</em>,
            devleader.ca, 2026-07-21 /
            <em>"GitHub Copilot CLI: The Complete Developer Guide (2026)"</em>, DEV Community
          </p>
        </blockquote>
        <hr />
        <h2 id="9-coding-agentクラウドエージェントにissueを任せる">
          9. Coding Agent(クラウドエージェント)にIssueを任せる
        </h2>
        <p>
          Copilot Coding Agentは、GitHub Issueを直接
          <code>@copilot</code>
          にアサインすることで、バックグラウンド(クラウド上)でタスクを処理させ、完了したらPull
          Requestを作成させる仕組みです。
        </p>
        <MermaidDiagram chart={CHART_7} theme="dark" themeVariables={COPILOT_THEME_VARS} />
        <p>
          <strong>タスクを任せる際のベストプラクティス</strong>
        </p>
        <ul>
          <li>
            Issueには<strong>明確なスコープと受け入れ条件</strong>
            を書く。曖昧なIssueほどPRの手戻りが増える。
          </li>
          <li>
            リポジトリに一度だけ丁寧な
            <code>.github/copilot-instructions.md</code>
            を用意しておくと、以降すべてのタスクの品質が上がる。ビルド/テスト/lintコマンドを明記し、CIで失敗しやすいポイントを減らすことが目的。
          </li>
          <li>
            PRのマージまでのプロセスは、人間が作成したPRと<strong>全く同じ</strong>
            。特別扱いせず通常のレビューフローに乗せる。
          </li>
          <li>
            独立したタスクは複数の並列セッション(ローカル・バックグラウンド・クラウド)で同時に走らせ、セッション一覧から監視できる。
          </li>
          <li>
            チーム協働が絡む、あるいはレビューを介したい作業はクラウドエージェントに向いている一方、対話しながら細かく操作したい作業はローカルのAgentモードが向いている。
          </li>
        </ul>
        <blockquote>
          <p>
            出典: GitHub Docs <em>"Best practices for using GitHub Copilot to work on tasks"</em> /
            VS Code Docs <em>"Best practices for using AI in VS Code"</em>, 2026-07-29更新
          </p>
        </blockquote>
        <hr />
        <h2 id="10-copilot-code-review--agent-skillsとmcpの活用">
          10. Copilot Code Review — Agent SkillsとMCPの活用
        </h2>
        <p>
          2026年7月29日、Copilot Code ReviewにおけるAgent SkillsとMCPサーバー対応が
          <strong>Public PreviewからGA(一般提供)</strong>
          へ移行しました。これはPro・Pro+・Business・Enterpriseの全有償プランで利用可能です。
        </p>
        <MermaidDiagram chart={CHART_8} theme="dark" themeVariables={COPILOT_THEME_VARS} />
        <p>
          <strong>重要なポイント</strong>
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr className="header">
                <th>項目</th>
                <th>内容</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>Agent Skills</td>
                <td>
                  <code>.github/skills/&lt;skill-name&gt;/SKILL.md</code>
                  を配置すると、レビューがその内部規約・ツールを踏まえた指摘を行う
                </td>
              </tr>
              <tr className="even">
                <td>MCP設定</td>
                <td>
                  リポジトリ設定 → Copilot → MCP servers からJSON設定を追加。認証トークンは Secrets
                  and variables → Agents に保管
                </td>
              </tr>
              <tr className="odd">
                <td>読み取り専用の原則</td>
                <td>
                  Code Review中のMCPツール呼び出しは<strong>すべて読み取り専用</strong>
                  に制限されている(書き込み不可)
                </td>
              </tr>
              <tr className="even">
                <td>既定で有効なMCP</td>
                <td>GitHub MCP、Playwright MCPは特別な設定なしで既定有効</td>
              </tr>
              <tr className="odd">
                <td>Coding Agentとの設定共有</td>
                <td>
                  Copilot Coding Agent向けに既に設定済みのMCP構成は、Code
                  Reviewにも自動的に引き継がれる
                </td>
              </tr>
              <tr className="even">
                <td>Attribution(出典表示)</td>
                <td>
                  どのコメントがSkill/MCPの文脈を使って生成されたかが明示される。監査可能性を重視した設計
                </td>
              </tr>
              <tr className="odd">
                <td>分析の深さ</td>
                <td>
                  変更の複雑さに応じて分析ティアが自動的に上がり、複雑なPRはより高い推論力のモデルに回される(Medium
                  analysis tier)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <blockquote>
          <p>
            出典: GitHub Changelog
            <em>"Copilot code review: Agent skills and MCP now generally available"</em>, 2026-07-29
            / <em>"Shape Copilot code review around your team"</em>, GitHub Changelog, 2026-06-02 /
            <em>"MCP Adoption Week: Copilot Code Review Goes GA"</em>, digitalapplied.com
          </p>
        </blockquote>
        <hr />
        <h2 id="11-mcpサーバー統合のベストプラクティス">11. MCPサーバー統合のベストプラクティス</h2>
        <p>
          Model Context
          Protocol(MCP)により、Copilotは社内ツール・イシュートラッカー・ドキュメントシステムなど外部システムと連携できます。
        </p>
        <p>
          <strong>Coding AgentおよびCode Reviewの制約(2026年7月時点)</strong>
        </p>
        <ul>
          <li>
            <strong>ツールのみサポート</strong>:MCPサーバーが提供する resources や prompts
            には対応しておらず、tools のみが利用可能。
          </li>
          <li>
            <strong>OAuth認証のリモートMCPサーバーは未対応</strong>:Coding AgentおよびCode
            Reviewでは、OAuthを用いるリモートMCPサーバーはサポート対象外。
          </li>
          <li>
            GitHub MCPサーバーはCoding
            Agent向けに自動設定され、Issueやプルリクエストなどのデータへのアクセスが可能。
          </li>
        </ul>
        <p>
          <strong>IDE(VS Code / CLI)でのMCP活用</strong>
        </p>
        <ul>
          <li>
            VS Codeの <code>#tool名</code> 記法、または「Add Context &gt;
            Tools」からMCPツールを明示的に指定できる。
          </li>
          <li>
            Copilot
            CLIでも同様にMCPサーバーを設定し、GitHubのMCPサーバーや任意のMCPサーバーと統合可能。
          </li>
        </ul>
        <p>
          <strong>運用の指針</strong>
        </p>
        <ol type="1">
          <li>
            まず読み取り専用のMCPサーバー(ドキュメント検索、Issue参照など)から導入し、書き込み権限を伴うMCPは慎重に評価する。
          </li>
          <li>
            MCP経由で取得する情報は「信頼できない外部入力」として扱い、後述のプロンプトインジェクション対策を適用する。
          </li>
          <li>組織で使うMCPサーバーは一元管理し、リポジトリごとに乱立させない。</li>
        </ol>
        <blockquote>
          <p>
            出典: GitHub Docs
            <em>"Model Context Protocol (MCP) and GitHub Copilot cloud agent"</em> /
            <em>
              "GitHub Copilot Instructions vs Prompts vs Custom Agents vs Skills vs X vs WHY?"
            </em>
            , DEV Community
          </p>
        </blockquote>
        <hr />
        <h2 id="12-モデル選定戦略">12. モデル選定戦略</h2>
        <p>
          Copilotのモデルピッカーには、Anthropic・OpenAI・Google・xAIなど複数プロバイダーのモデルが並びます。2026年7月時点で確認できる代表的なラインナップは以下の通りです(
          <strong>
            プランや管理者設定により利用可否が変わるため、必ず実際のモデルピッカーで確認してください
          </strong>
          )。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr className="header">
                <th>モデル系統</th>
                <th>提供元</th>
                <th>得意な用途の目安</th>
                <th>備考</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>Claude Sonnet 4.5 / 4.6</td>
                <td>Anthropic</td>
                <td>日常のコーディング全般、Agentモードの既定選択肢になりやすい</td>
                <td>バランスの取れた品質とコスト</td>
              </tr>
              <tr className="even">
                <td>Claude Opus 4.7 / 4.8</td>
                <td>Anthropic</td>
                <td>複雑な設計判断、難易度の高いマルチファイル作業</td>
                <td>コスト高めで、上位プラン限定になりやすい</td>
              </tr>
              <tr className="odd">
                <td>Claude Haiku 4.5</td>
                <td>Anthropic</td>
                <td>高速・軽量なタスク</td>
                <td>低コスト</td>
              </tr>
              <tr className="even">
                <td>GPT-5.4 / GPT-5.5</td>
                <td>OpenAI</td>
                <td>実装・レビュー・深い分析</td>
                <td>GPT-5.5はOpenAI側の「価値の効くフラッグシップ」的な位置づけ</td>
              </tr>
              <tr className="odd">
                <td>GPT-5.6(Luna / Sol / Terra)</td>
                <td>OpenAI</td>
                <td>拡張コンテキスト・拡張推論が必要なタスク</td>
                <td>2026年7月10日GA。VS Code 1.128以上が必要</td>
              </tr>
              <tr className="even">
                <td>Gemini 3 / 3.1 Pro、Gemini 3 Flash</td>
                <td>Google</td>
                <td>非常に大きなコンテキストが必要なタスク</td>
                <td>Copilot on Web では提供範囲が縮小(2026年5月時点)</td>
              </tr>
              <tr className="odd">
                <td>Grok 4.5 / Grok Code Fast 1</td>
                <td>xAI</td>
                <td>高速・日常的な軽量タスク</td>
                <td>ゼロデータ保持ポリシーでホスティング</td>
              </tr>
              <tr className="even">
                <td>Claude Fable 5</td>
                <td>Anthropic(Mythos系)</td>
                <td>追加の安全対策を備えたモデル</td>
                <td>
                  Anthropicが安全性分類のため入出力を保持する点が他のClaudeモデルと異なる。Enterprise/Businessでは組織側で有効化が必要
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>選定の考え方</strong>
        </p>
        <MermaidDiagram chart={CHART_9} theme="dark" themeVariables={COPILOT_THEME_VARS} />
        <p>
          <strong>実践的なヒント</strong>
        </p>
        <ul>
          <li>
            <strong>1つの機能・バグ修正の作業中はモデルと推論レベルを変えない</strong>
            。プロンプトキャッシュが効き続け、以降のリクエストが割引価格になる。
          </li>
          <li>
            重要な実装の最終確認には、<strong>別系統のモデルによる「Rubber Duckレビュー」</strong>
            (第7章参照)を組み合わせると、単一モデルの盲点を補完できる。
          </li>
          <li>
            モデルによってデータ保持ポリシー・ホスティング先(AWS/Anthropic/GCP/xAI等)が異なるため、機密性の高いプロジェクトではモデルごとのデータ取り扱いポリシーを確認する。
          </li>
        </ul>
        <blockquote>
          <p>
            出典: GitHub Docs <em>"Supported AI models in GitHub Copilot"</em> /
            <em>"Hosting of models for GitHub Copilot"</em> /
            <em>"GitHub Copilot Model Guide — Cost, Tasks, and Workflows"</em> /
            <em>"Updates to available models in Copilot on web"</em>, GitHub Changelog, 2026-05-20
          </p>
        </blockquote>
        <hr />
        <h2 id="13-セキュリティと責任あるai活用">13. セキュリティと責任あるAI活用</h2>
        <p>
          AIコーディングエージェントは、リポジトリ内のコード・コメント・Issue・PRコメント・ツール出力など、
          <strong>エージェントが理解するために読み込む情報そのもの</strong>
          を攻撃経路として悪用される可能性があります。これはCopilotに限らず、Claude Code・Gemini
          CLIなど同種のエージェント全般に共通するリスクです。
        </p>
        <MermaidDiagram chart={CHART_10} theme="dark" themeVariables={COPILOT_THEME_VARS} />
        <p>
          <strong>知っておくべき既知の事例</strong>
        </p>
        <ul>
          <li>
            <strong>CVE-2025-53773</strong>
            :リポジトリ内のソースコードに埋め込まれたインジェクションペイロードが、エージェントに任意のターミナルコマンドを実行させた脆弱性(CVSS
            9.6)。特別な権限昇格を必要とせず、エージェントの通常の「コードを読む」挙動だけで発火した点が特徴。
          </li>
          <li>
            GitHub自身も、Coding
            Agentのリスクと緩和策について公式ドキュメントで言及しており、ユーザー入力を渡す前に隠し文字やHTMLコメント内容を除去する、エージェントのインターネットアクセスを制限してデータ持ち出しを防ぐ、Coding
            Agentのコミットは常に監査可能かつ人間との共著扱いにする、といった防御策を講じています。
          </li>
        </ul>
        <p>
          <strong>実務での対応</strong>
        </p>
        <ol type="1">
          <li>
            <strong>リポジトリ内のテキストはすべて「信頼できない入力」として扱う</strong>
            。ソースファイル・コメント・Issue説明・PRディスカッション・ドキュメント・コミットメッセージ・テスト出力・ターミナルログのいずれも例外ではない。
          </li>
          <li>
            <strong>YOLOモード(Allow All)は必ずサンドボックスの中で使う</strong>
            。ローカルマシン上、特に業務用途では実行しない。GitHub CodespacesやDev
            Containerなど使い捨て可能な環境を使う。
          </li>
          <li>
            <strong>エージェントの成果物は常に「ドラフト」として扱う</strong>
            。読み、テストし、リファクタリングし、Pull
            Requestに載せる前に自分のものとして理解・検証する。
          </li>
          <li>
            <strong>権限境界を明確にする</strong>
            。エージェントが読み書き・実行できる範囲を最小化し、シークレットや不要な環境変数をプロンプトに含めない。
          </li>
          <li>
            <strong>セキュリティ機能を併用する</strong>
            。Copilot自体が提供するハードコードされた認証情報やSQLインジェクションのフィルタ、Copilot
            Autofixに加え、静的/動的解析ツールとの併用が推奨される。
          </li>
        </ol>
        <blockquote>
          <p>
            出典:
            <em>
              "AI Agent Security Practices 2026: Prompt Injection, MCP Risks &amp; Data Leaks"
            </em>
            , TechStoriess.com /
            <em>"GitHub Copilot Security: Risks, Controls, and Best Practices"</em>, CybeDefend /
            <em>"GitHub Copilot Security: Risks, Built-In Controls, and Best Practices"</em>,
            Checkmarx /
            <em>"The GitHub Copilot CLI Permission Model: What It Can and Can't Touch"</em>,
            devleader.ca
          </p>
        </blockquote>
        <hr />
        <h2 id="14-コストとai-creditsの管理">14. コストとAI Creditsの管理</h2>
        <p>
          2026年6月1日より、GitHub Copilotは使用量ベース(AI
          Credits)の課金体系に移行しました。基本のインライン補完・Next Edit
          Suggestionsは引き続き無制限・無料枠の対象ですが、Chat・Agentモード・CLI・Coding
          Agent・Code Reviewなどの高度な機能はAI Creditsを消費します。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr className="header">
                <th>プラン</th>
                <th>月額</th>
                <th>含まれるAI Credits(目安)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>Free</td>
                <td>無料</td>
                <td>限定的な範囲(試用向け)</td>
              </tr>
              <tr className="even">
                <td>Pro</td>
                <td>$10/月</td>
                <td>月$10相当</td>
              </tr>
              <tr className="odd">
                <td>Pro+</td>
                <td>$39/月</td>
                <td>月$39相当(より多くのモデル・エージェント機能)</td>
              </tr>
              <tr className="even">
                <td>Business</td>
                <td>$19/ユーザー/月</td>
                <td>月$19相当/ユーザー</td>
              </tr>
              <tr className="odd">
                <td>Enterprise</td>
                <td>$39/ユーザー/月</td>
                <td>月$39相当/ユーザー(追加のセキュリティ・カスタマイズ)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>コストを抑えるための実践</strong>
        </p>
        <ul>
          <li>
            <strong>モードを使い分ける</strong>
            :調査・学習にはAsk、範囲が明確な修正にはEdit、複雑なタスクにのみAgentを使う(第2章参照)。
          </li>
          <li>
            <strong>モデルと推論レベルを不用意に切り替えない</strong>
            :プロンプトキャッシュの割引を維持するため、1つの作業単位の中では固定する。
          </li>
          <li>
            <strong>軽量タスクには軽量モデルを使う</strong>
            :全てのタスクに最上位モデルを使う必要はない。
          </li>
          <li>
            <strong>チーム全体の利用状況を可視化する</strong>
            :Chat・CLI・Spaces・クラウドエージェント・サードパーティエージェント・Code
            Reviewの利用状況をモニタリングし、コストとROIをセットで追跡する。
          </li>
          <li>Copilot Code Reviewは実行にGitHub Actionsの分数も消費する点に留意する。</li>
        </ul>
        <blockquote>
          <p>
            出典: <em>"GitHub Copilot Best Practices: Your Complete Beginner-Friendly Guide"</em>,
            Tales on Tech / <em>"GitHub Copilot Best Practices for Engineering Teams (2026)"</em>,
            metacto.com / <em>"Copilot vs. raw API access: What are you actually paying for?"</em>,
            The GitHub Blog
          </p>
        </blockquote>
        <hr />
        <h2 id="15-よくあるアンチパターン">15. よくあるアンチパターン</h2>
        <MermaidDiagram chart={CHART_11} theme="dark" themeVariables={COPILOT_THEME_VARS} />
        <p>
          Google Engineering LeadのAddy
          Osmani氏も、AIが生成したコードは「ロジック・セキュリティ・エッジケースで人間より誤りが多くなりがちである」と指摘した上で、CI(自動テスト・Lint・型チェック)を整備し、失敗ログをAIにそのままフィードバックして反復修正させるワークフローの重要性を述べています。「自分の目でコードが正しく動くのを確認するまでは、動いているとは言えない」という原則は、AIの活用が進むほど重要性を増すとしています。
        </p>
        <blockquote>
          <p>
            出典: Addy Osmani, <em>"My LLM coding workflow going into 2026"</em>, addyosmani.com /
            Addy Osmani, <em>"Code Review in the Age of AI"</em>, Elevate(Substack)
          </p>
        </blockquote>
        <hr />
        <h2 id="16-ベストプラクティスチェックリスト">16. ベストプラクティスチェックリスト</h2>
        <ChecklistCard />
        <hr />
        <h2 id="17-参考文献">17. 参考文献</h2>
        <div className={styles.refGrid}>
          <div className={styles.refCard}>
            <h3 id="公式ドキュメントgithub-changelog">公式ドキュメント・GitHub Changelog</h3>
            <ul>
              <li>
                GitHub Docs, <em>"Adding custom instructions for GitHub Copilot"</em> —
                <a
                  href="https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot
                </a>
              </li>
              <li>
                GitHub Docs, <em>"Best practices for using GitHub Copilot to work on tasks"</em> —
                <a
                  href="https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/best-practices-for-using-copilot-to-work-on-tasks"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/best-practices-for-using-copilot-to-work-on-tasks
                </a>
              </li>
              <li>
                GitHub Docs, <em>"Best practices for GitHub Copilot CLI"</em> —
                <a
                  href="https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices
                </a>
              </li>
              <li>
                GitHub Docs, <em>"Adding custom instructions for GitHub Copilot CLI"</em> —
                <a
                  href="https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions
                </a>
              </li>
              <li>
                GitHub Docs, <em>"Asking GitHub Copilot questions in your IDE"</em> —
                <a
                  href="https://docs.github.com/copilot/using-github-copilot/asking-github-copilot-questions-in-your-ide"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.github.com/copilot/using-github-copilot/asking-github-copilot-questions-in-your-ide
                </a>
              </li>
              <li>
                GitHub Docs, <em>"Using GitHub Copilot code review"</em> —
                <a
                  href="https://docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review
                </a>
              </li>
              <li>
                GitHub Docs,
                <em>"Model Context Protocol (MCP) and GitHub Copilot cloud agent"</em> —
                <a
                  href="https://docs.github.com/en/copilot/concepts/agents/cloud-agent/mcp-and-cloud-agent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.github.com/en/copilot/concepts/agents/cloud-agent/mcp-and-cloud-agent
                </a>
              </li>
              <li>
                GitHub Docs, <em>"Supported AI models in GitHub Copilot"</em> —
                <a
                  href="https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/ai-models/supported-models"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/ai-models/supported-models
                </a>
              </li>
              <li>
                GitHub Docs, <em>"Hosting of models for GitHub Copilot"</em> —
                <a
                  href="https://docs.github.com/en/copilot/reference/ai-models/model-hosting"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.github.com/en/copilot/reference/ai-models/model-hosting
                </a>
              </li>
              <li>
                GitHub Docs, <em>"Using Claude in GitHub Copilot"</em> —
                <a
                  href="https://docs.github.com/copilot/using-github-copilot/ai-models/using-claude-in-github-copilot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.github.com/copilot/using-github-copilot/ai-models/using-claude-in-github-copilot
                </a>
              </li>
              <li>
                GitHub Changelog,
                <em>"Copilot coding agent now supports AGENTS.md custom instructions"</em>
                (2025-08-28) —
                <a
                  href="https://github.blog/changelog/2025-08-28-copilot-coding-agent-now-supports-agents-md-custom-instructions/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.blog/changelog/2025-08-28-copilot-coding-agent-now-supports-agents-md-custom-instructions/
                </a>
              </li>
              <li>
                GitHub Changelog,
                <em>
                  "GitHub Copilot coding agent now supports .instructions.md custom instructions"
                </em>
                (2025-07-23) —
                <a
                  href="https://github.blog/changelog/2025-07-23-github-copilot-coding-agent-now-supports-instructions-md-custom-instructions/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.blog/changelog/2025-07-23-github-copilot-coding-agent-now-supports-instructions-md-custom-instructions/
                </a>
              </li>
              <li>
                GitHub Changelog, <em>"Shape Copilot code review around your team"</em>(2026-06-02)
                —
                <a
                  href="https://github.blog/changelog/2026-06-02-shape-copilot-code-review-around-your-team/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.blog/changelog/2026-06-02-shape-copilot-code-review-around-your-team/
                </a>
              </li>
              <li>
                GitHub Changelog,
                <em>"Copilot code review: Agent skills and MCP now generally available"</em>
                (2026-07-29) —
                <a
                  href="https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/
                </a>
              </li>
              <li>
                GitHub Changelog,
                <em>"GitHub Copilot CLI: Plan before you build, steer as you go"</em>(2026-01-21) —
                <a
                  href="https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/
                </a>
              </li>
              <li>
                GitHub Changelog,
                <em>"Copilot knowledge bases can now be converted to Copilot Spaces"</em>
                (2025-10-17) —
                <a
                  href="https://github.blog/changelog/2025-10-17-copilot-knowledge-bases-can-now-be-converted-to-copilot-spaces/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.blog/changelog/2025-10-17-copilot-knowledge-bases-can-now-be-converted-to-copilot-spaces/
                </a>
              </li>
              <li>
                GitHub Changelog, <em>"Sunset notice: Copilot knowledge bases"</em> —
                <a
                  href="https://github.blog/changelog/2025-08-20-sunset-notice-copilot-knowledge-bases/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.blog/changelog/2025-08-20-sunset-notice-copilot-knowledge-bases/
                </a>
              </li>
              <li>
                GitHub Changelog,
                <em>"Updates to available models in Copilot on web"</em>(2026-05-20) —
                <a
                  href="https://github.blog/changelog/2026-05-20-updates-to-available-models-in-copilot-on-web/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.blog/changelog/2026-05-20-updates-to-available-models-in-copilot-on-web/
                </a>
              </li>
              <li>
                VS Code Docs, <em>"Best practices for using AI in VS Code"</em> —
                <a
                  href="https://code.visualstudio.com/docs/agents/best-practices"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://code.visualstudio.com/docs/agents/best-practices
                </a>
              </li>
              <li>
                VS Code Docs, <em>"Use custom instructions in VS Code"</em> —
                <a
                  href="https://code.visualstudio.com/docs/agent-customization/custom-instructions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://code.visualstudio.com/docs/agent-customization/custom-instructions
                </a>
              </li>
              <li>
                VS Code Blog, <em>"Introducing GitHub Copilot agent mode (preview)"</em> —
                <a
                  href="https://code.visualstudio.com/blogs/2025/02/24/introducing-copilot-agent-mode"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://code.visualstudio.com/blogs/2025/02/24/introducing-copilot-agent-mode
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.refCard}>
            <h3 id="著名な開発者企業テクノロジストによる発信">
              著名な開発者・企業テクノロジストによる発信
            </h3>
            <ul>
              <li>
                Burke Holland(GitHub, Technologist),
                <em>"The harness is all you need (mostly)"</em>, The GitHub Blog(2026-07-27) —
                <a
                  href="https://github.blog/ai-and-ml/github-copilot/the-harness-is-all-you-need-mostly/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.blog/ai-and-ml/github-copilot/the-harness-is-all-you-need-mostly/
                </a>
              </li>
              <li>
                Burke Holland,
                <em>"Copilot ask, edit, and agent modes: What they do and when to use them"</em>,
                The GitHub Blog —
                <a
                  href="https://github.blog/ai-and-ml/github-copilot/copilot-ask-edit-and-agent-modes-what-they-do-and-when-to-use-them/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.blog/ai-and-ml/github-copilot/copilot-ask-edit-and-agent-modes-what-they-do-and-when-to-use-them/
                </a>
              </li>
              <li>
                Burke Holland, <em>"Opus 4.5 is going to change everything"</em>(個人ブログ,
                2026-01-05) —
                <a
                  href="https://burkeholland.github.io/posts/opus-4-5-change-everything/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://burkeholland.github.io/posts/opus-4-5-change-everything/
                </a>
              </li>
              <li>
                Simon Willison, <em>タグ「github-copilot」記事一覧</em> —
                <a
                  href="https://simonwillison.net/tags/github-copilot/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://simonwillison.net/tags/github-copilot/
                </a>
              </li>
              <li>
                Simon Willison,
                <em>"The Five Levels: from Spicy Autocomplete to the Dark Factory"</em>(2026-01-28)
                —
                <a
                  href="https://simonwillison.net/2026/Jan/28/the-five-levels/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://simonwillison.net/2026/Jan/28/the-five-levels/
                </a>
              </li>
              <li>
                Addy Osmani(Google, Engineering Lead),
                <em>"My LLM coding workflow going into 2026"</em> —
                <a
                  href="https://addyosmani.com/blog/ai-coding-workflow/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://addyosmani.com/blog/ai-coding-workflow/
                </a>
              </li>
              <li>
                Addy Osmani, <em>"Code Review in the Age of AI"</em>, Elevate(Substack, 2026-01-06)
                —
                <a
                  href="https://addyo.substack.com/p/code-review-in-the-age-of-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://addyo.substack.com/p/code-review-in-the-age-of-ai
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.refCard}>
            <h3 id="copilot-spacesとカスタムインストラクション関連">
              Copilot Spacesとカスタムインストラクション関連
            </h3>
            <ul>
              <li>
                Microsoft Community Hub,
                <em>
                  "Turning GitHub Copilot into a 'Best Practices Coach' with Copilot Spaces + a
                  Markdown Knowledge Base"
                </em>
                (2026-05-06) —
                <a
                  href="https://techcommunity.microsoft.com/blog/azuredevcommunityblog/turning-github-copilot-into-a-%E2%80%9Cbest-practices-coach%E2%80%9D-with-copilot-spaces--a-mark/4511567"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://techcommunity.microsoft.com/blog/azuredevcommunityblog/turning-github-copilot-into-a-%E2%80%9Cbest-practices-coach%E2%80%9D-with-copilot-spaces--a-mark/4511567
                </a>
              </li>
              <li>
                Microsoft Learn, <em>"Introduction to Copilot Spaces"</em> —
                <a
                  href="https://learn.microsoft.com/en-us/training/modules/introduction-copilot-spaces/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://learn.microsoft.com/en-us/training/modules/introduction-copilot-spaces/
                </a>
              </li>
              <li>
                The GitHub Blog,
                <em>"How to use GitHub Copilot Spaces to debug issues faster"</em> —
                <a
                  href="https://github.blog/ai-and-ml/github-copilot/how-to-use-github-copilot-spaces-to-debug-issues-faster/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.blog/ai-and-ml/github-copilot/how-to-use-github-copilot-spaces-to-debug-issues-faster/
                </a>
              </li>
              <li>
                Zenn,
                <em>"GitHub Copilot Chat を使う時のTips(Instruction files, Prompt files)"</em> —
                <a
                  href="https://zenn.dev/chot/articles/b8b830571ba088"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://zenn.dev/chot/articles/b8b830571ba088
                </a>
              </li>
              <li>
                DEV Community,
                <em>
                  "GitHub Copilot Instructions vs Prompts vs Custom Agents vs Skills vs X vs WHY?"
                </em>
                —
                <a
                  href="https://dev.to/pwd9000/github-copilot-instructions-vs-prompts-vs-custom-agents-vs-skills-vs-x-vs-why-339l"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://dev.to/pwd9000/github-copilot-instructions-vs-prompts-vs-custom-agents-vs-skills-vs-x-vs-why-339l
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.refCard}>
            <h3 id="cliモデル選定コスト関連の解説記事">CLI・モデル選定・コスト関連の解説記事</h3>
            <ul>
              <li>
                DEV Community, <em>"GitHub Copilot CLI: The Complete Developer Guide (2026)"</em> —
                <a
                  href="https://dev.to/proflead/github-copilot-cli-the-complete-developer-guide-2026-3cjj"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://dev.to/proflead/github-copilot-cli-the-complete-developer-guide-2026-3cjj
                </a>
              </li>
              <li>
                devleader.ca,
                <em>"The GitHub Copilot CLI Permission Model: What It Can and Can't Touch"</em>
                (2026-07-21) —
                <a
                  href="https://www.devleader.ca/2026/07/21/the-github-copilot-cli-permission-model-what-it-can-and-cant-touch"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.devleader.ca/2026/07/21/the-github-copilot-cli-permission-model-what-it-can-and-cant-touch
                </a>
              </li>
              <li>
                fundesk.io, <em>"GitHub Copilot Agent Mode: The Complete Guide for 2026"</em> —
                <a
                  href="https://www.fundesk.io/github-copilot-agent-mode-guide-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.fundesk.io/github-copilot-agent-mode-guide-2026
                </a>
              </li>
              <li>
                movarnell.github.io,
                <em>"GitHub Copilot Model Guide — Cost, Tasks, and Workflows"</em> —
                <a
                  href="https://movarnell.github.io/Copilot-Links/models.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://movarnell.github.io/Copilot-Links/models.html
                </a>
              </li>
              <li>
                Tales on Tech,
                <em>"GitHub Copilot Best Practices: Your Complete Beginner-Friendly Guide"</em> —
                <a
                  href="https://www.talesontech.com/blog/github-copilot-best-practices-guide-2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.talesontech.com/blog/github-copilot-best-practices-guide-2026/
                </a>
              </li>
              <li>
                metacto.com, <em>"GitHub Copilot Best Practices for Engineering Teams (2026)"</em> —
                <a
                  href="https://www.metacto.com/blogs/github-copilot-best-practices-from-high-performing-teams"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.metacto.com/blogs/github-copilot-best-practices-from-high-performing-teams
                </a>
              </li>
              <li>
                The GitHub Blog,
                <em>"Copilot vs. raw API access: What are you actually paying for?"</em> —
                <a
                  href="https://github.blog/ai-and-ml/github-copilot/copilot-vs-raw-api-access-what-are-you-actually-paying-for/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.blog/ai-and-ml/github-copilot/copilot-vs-raw-api-access-what-are-you-actually-paying-for/
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.refCard}>
            <h3 id="セキュリティ関連">セキュリティ関連</h3>
            <ul>
              <li>
                Checkmarx,
                <em>"GitHub Copilot Security: Risks, Built-In Controls, and Best Practices"</em>
                (2026-05-11) —
                <a
                  href="https://checkmarx.com/learn/ai-security/top-5-github-copilot-security-risks-9-ways-to-mitigate-them/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://checkmarx.com/learn/ai-security/top-5-github-copilot-security-risks-9-ways-to-mitigate-them/
                </a>
              </li>
              <li>
                CybeDefend,
                <em>"GitHub Copilot Security: Risks, Controls, and Best Practices"</em>(2026-06-10)
                —
                <a
                  href="https://www.cybedefend.com/en/blog/github-copilot-security-risks-best-practices"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.cybedefend.com/en/blog/github-copilot-security-risks-best-practices
                </a>
              </li>
              <li>
                TechStoriess.com,
                <em>
                  "AI Agent Security Practices 2026: Prompt Injection, MCP Risks &amp; Data Leaks"
                </em>
                (2026-06-30) —
                <a
                  href="https://www.techstoriess.com/ai-agent-security-practices-2026-prompt-injection-mcp-risks-data-leaks/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.techstoriess.com/ai-agent-security-practices-2026-prompt-injection-mcp-risks-data-leaks/
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr />
        <p>
          <em>
            本ガイドは2026年7月31日時点で確認できた情報をもとに作成しています。GitHub
            Copilotは頻繁に機能更新が行われるため、実際の設定・挙動は必ず上記の公式ドキュメントやご利用中のバージョンのin-product
            helpで最終確認してください。
          </em>
        </p>

        <footer className={styles.colophon}>
          <p>
            本ガイドはMarkdown版と同一内容のHTML版です。Mermaidダイアグラムはこのページ内で描画され、参考文献は各URLへのリンクとして提供されています。
          </p>
        </footer>
      </main>

      <TocObserver />
    </div>
  );
}
