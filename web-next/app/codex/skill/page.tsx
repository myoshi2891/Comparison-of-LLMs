import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import CopyButton from "./CopyButton";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "AI仕様駆動開発におけるMarkdownファイル実践ガイド",
  description:
    "GitHub Spec Kit・AWS Kiro・Claude Code・AGENTS.md・Agent Skillsなど、2026年時点の主要なSDDツール群が共通して採用する「Markdownで仕様を書き、AIエージェントに実装させる」ワークフローを、ステップバイステップで体系化しました。EARS記法、ファイル構成、Mermaid図解の作法まで一気通貫で扱います。",
};

const THEME_VARS = {
  background: "#07111e",
  primaryColor: "#132745",
  primaryTextColor: "#e7edf7",
  primaryBorderColor: "#7c9eff",
  lineColor: "#5c7cb8",
  secondaryColor: "#0d1c30",
  tertiaryColor: "#0d1c30",
  fontSize: "16px",
  fontFamily: 'Inter, "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
} as const;

const DIAGRAM_1 = `flowchart TB
A["constitution.md<br/>（プロジェクトの不変原則）"] --> B["① Specify<br/>spec.md / requirements.md"]
B --> C{"人間によるレビュー<br/>曖昧さの解消（Clarify）"}
C -->|"要修正"| B
C -->|"承認"| D["② Plan<br/>plan.md / design.md"]
D --> E{"技術レビュー"}
E -->|"要修正"| D
E -->|"承認"| F["③ Tasks<br/>tasks.md"]
F --> G["④ Implement<br/>AIエージェントによる実装"]
G --> H{"テスト・検証"}
H -->|"失敗"| F
H -->|"合格"| I["マージ"]
I -.->|"仕様は生きたドキュメント：<br/>変更時はSpecを先に更新"| B`;

const DIAGRAM_2 = `flowchart TB
subgraph Root["リポジトリルート"]
    AGENTS["AGENTS.md<br/>プロジェクト全体のコンテキスト"]
    CONST["constitution.md<br/>不変の原則"]
end
subgraph Feature["specs/001-feature/"]
    SPEC["spec.md<br/>What と Why"]
    PLAN["plan.md<br/>How"]
    TASKS["tasks.md<br/>実行単位"]
end
subgraph Skills["再利用可能な手順"]
    SKILL["SKILL.md<br/>YAML frontmatter + 手順"]
end
AGENTS --> SPEC
CONST --> SPEC
SPEC --> PLAN
PLAN --> TASKS
TASKS -.->|"必要時にオンデマンドで読込"| SKILL`;

const DIAGRAM_3 = `flowchart TD
Q1{"常に真であるべき要件か？"}
Q1 -->|"Yes"| U["Ubiquitous<br/>THE SYSTEM SHALL ..."]
Q1 -->|"No"| Q2{"特定のイベントで発火するか？"}
Q2 -->|"Yes"| EV["Event-driven<br/>WHEN event THE SYSTEM SHALL ..."]
Q2 -->|"No"| Q3{"特定の状態が続く間だけ有効か？"}
Q3 -->|"Yes"| ST["State-driven<br/>WHILE state THE SYSTEM SHALL ..."]
Q3 -->|"No"| Q4{"望ましくない事象への対応か？"}
Q4 -->|"Yes"| UB["Unwanted behavior<br/>IF trigger THEN THE SYSTEM SHALL ..."]
Q4 -->|"No"| OPT["Optional feature<br/>WHERE feature THE SYSTEM SHALL ..."]`;

const DIAGRAM_4 = `flowchart TB
S1["セッション開始<br/>SKILL.md の name / description のみ読込"] --> S2{"タスクがスキルの<br/>ドメインと一致するか？"}
S2 -->|"No"| S1
S2 -->|"Yes"| S3["SKILL.md 本文を読込"]
S3 --> S4{"補助ファイルが必要か？<br/>（スクリプト・参考資料）"}
S4 -->|"Yes"| S5["補助ファイルをオンデマンドで読込"]
S4 -->|"No"| S6["タスクを実行"]
S5 --> S6`;

const CODE_TEXT_1 = `### US-1（P1）: パスワードレス・ログイン
ユーザーとして、パスワードを覚えずにメールリンクだけでログインしたい。
これにより、パスワード忘れによる離脱を防げるため。`;

const CODE_TEXT_2 = `## Task 12: マジックリンク送信APIの実装
- 対応要件: US-1 / EARS-EV-1
- 依存: Task 03（メール送信基盤）
- 完了条件: \`POST /auth/magic-link\` が15分間有効なトークンを発行し、単体テストが通ること`;

const CODE_TEXT_3 = `# AGENTS.md

## セットアップ
- 依存関係インストール: \`pnpm install\`
- 開発サーバー起動: \`pnpm dev\`

## テスト
- 変更前に必ず実行: \`pnpm test -- --changed\`
- E2Eは \`pnpm test:e2e\`（CI専用、ローカルでは実行しない）

## 規約
- 状態管理はZustandのみ使用し、Reduxを追加しない
- APIクライアントは \`src/lib/api/\` 以下に集約する

## 境界
- \`packages/billing/\` 配下は決済監査対象。変更時は必ず人間レビューを要求すること`;

const CODE_TEXT_4 = `---
name: deploy
description: アプリケーションを本番またはステージング環境へデプロイする
---

# Deploy

## 手順
1. テストスイートを実行: \`bun run test\`
2. 本番ビルド: \`bun run build\`
3. デプロイコマンドを実行し、ヘルスチェックを確認する`;

/**
 * Renders the Markdown and spec-driven development practical guide page.
 */
export default function Page() {
  return (
    <div className={styles.layout} data-testid="layout-root">
      <TocObserver />

      <div className={styles.mobileTopbar}>
        <button
          className={styles.hamburger}
          id="hamburgerBtn"
          type="button"
          aria-label="目次を開く"
          aria-expanded="false"
          aria-controls="sidebar"
        >
          <span />
        </button>
        <span className={styles.brand}>Markdown実践ガイド / SDD</span>
      </div>
      <div className={styles.sidebarBackdrop} id="sidebarBackdrop" />

      <aside className={styles.sidebar} id="sidebar" data-testid="sidebar-nav">
        <div className={styles.brandBlock}>
          <p className={styles.eyebrow}>AI Spec-Driven Development</p>
          <h2>Markdownファイル実践ガイド</h2>
          <div className={styles.brandMeta}>最終更新: 2026-07-28 ・ 全15章 ・ 出典33件</div>
        </div>
        <ul className={styles.toc} id="tocList">
          <li>
            <a href="#sec-1" className={styles.active}>
              <span className={styles.num}>01</span>
              <span className={styles.dot} />
              SDDとは何か・なぜMarkdownか
            </a>
          </li>
          <li>
            <a href="#sec-2">
              <span className={styles.num}>02</span>
              <span className={styles.dot} />
              成熟度モデル
            </a>
          </li>
          <li>
            <a href="#sec-3">
              <span className={styles.num}>03</span>
              <span className={styles.dot} />
              全体ワークフロー
            </a>
          </li>
          <li>
            <a href="#sec-4">
              <span className={styles.num}>04</span>
              <span className={styles.dot} />
              ファイル構成の全体像
            </a>
          </li>
          <li>
            <a href="#sec-5">
              <span className={styles.num}>05</span>
              <span className={styles.dot} />
              spec.md の書き方
            </a>
          </li>
          <li>
            <a href="#sec-6">
              <span className={styles.num}>06</span>
              <span className={styles.dot} />
              plan.md の書き方
            </a>
          </li>
          <li>
            <a href="#sec-7">
              <span className={styles.num}>07</span>
              <span className={styles.dot} />
              tasks.md の書き方
            </a>
          </li>
          <li>
            <a href="#sec-8">
              <span className={styles.num}>08</span>
              <span className={styles.dot} />
              AGENTS.md / CLAUDE.md
            </a>
          </li>
          <li>
            <a href="#sec-9">
              <span className={styles.num}>09</span>
              <span className={styles.dot} />
              SKILL.md と段階的開示
            </a>
          </li>
          <li>
            <a href="#sec-10">
              <span className={styles.num}>10</span>
              <span className={styles.dot} />
              Markdown記法のベストプラクティス
            </a>
          </li>
          <li>
            <a href="#sec-11">
              <span className={styles.num}>11</span>
              <span className={styles.dot} />
              生きたドキュメントの運用
            </a>
          </li>
          <li>
            <a href="#sec-12">
              <span className={styles.num}>12</span>
              <span className={styles.dot} />
              よくある落とし穴
            </a>
          </li>
          <li>
            <a href="#sec-13">
              <span className={styles.num}>13</span>
              <span className={styles.dot} />
              導入前チェックリスト
            </a>
          </li>
          <li>
            <a href="#sec-14">
              <span className={styles.num}>14</span>
              <span className={styles.dot} />
              まとめ
            </a>
          </li>
          <li>
            <a href="#sec-15">
              <span className={styles.num}>15</span>
              <span className={styles.dot} />
              参考文献
            </a>
          </li>
        </ul>
      </aside>

      <div className={styles.main}>
        {/* ===================== HERO ===================== */}
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>中級〜上級エンジニア向け実践ガイド</p>
              <h1>
                AI仕様駆動開発における
                <br />
                <span className={styles.grad}>Markdownファイル</span>実践ガイド
              </h1>
              <p className={styles.lede}>
                GitHub Spec Kit・AWS Kiro・Claude Code・AGENTS.md・Agent
                Skillsなど、2026年時点の主要なSDDツール群が
                共通して採用する「Markdownで仕様を書き、AIエージェントに実装させる」ワークフローを、
                ステップバイステップで体系化しました。EARS記法、ファイル構成、Mermaid図解の作法まで一気通貫で扱います。
              </p>
              <div className={styles.heroBadges}>
                <span className={styles.badge}>
                  <strong>14</strong>ステップ構成
                </span>
                <span className={styles.badge}>
                  <strong>4</strong>本のMermaid図解
                </span>
                <span className={styles.badge}>
                  <strong>33</strong>件の一次情報を参照
                </span>
                <span className={styles.badge}>
                  最終更新 <strong>2026-07-28</strong>
                </span>
              </div>
            </div>

            <div className={styles.filetreeCard} aria-hidden="true">
              <div className={styles.ftHead}>
                <span className={`${styles.ftDot} ${styles.r}`} />
                <span className={`${styles.ftDot} ${styles.y}`} />
                <span className={`${styles.ftDot} ${styles.g}`} />
                <span>specs/001-magic-link-auth/</span>
              </div>
              <div className={styles.filetree}>
                <div className={`${styles.row} ${styles.lvl1}`}>
                  <span className={styles.path}>├─</span>
                  <span className={styles.name}>constitution.md</span>
                </div>
                <div className={`${styles.row} ${styles.lvl1} ${styles.active}`}>
                  <span className={styles.path}>├─</span>
                  <span className={styles.name}>
                    spec.md
                    <span className={styles.cursor} />
                  </span>
                </div>
                <div className={`${styles.row} ${styles.lvl2}`}>
                  <span className={styles.path}>│&nbsp;&nbsp;</span>
                  <span className={styles.path}>受け入れ基準（EARS）</span>
                </div>
                <div className={`${styles.row} ${styles.lvl1}`}>
                  <span className={styles.path}>├─</span>
                  <span className={styles.name}>plan.md</span>
                </div>
                <div className={`${styles.row} ${styles.lvl2}`}>
                  <span className={styles.path}>│&nbsp;&nbsp;</span>
                  <span className={styles.path}>アーキテクチャ図（Mermaid）</span>
                </div>
                <div className={`${styles.row} ${styles.lvl1}`}>
                  <span className={styles.path}>└─</span>
                  <span className={styles.name}>tasks.md</span>
                </div>
                <div className={`${styles.row} ${styles.lvl2}`}>
                  <span className={styles.path}>&nbsp;&nbsp;&nbsp;</span>
                  <span className={styles.path}>実装タスク一覧</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ===================== 1 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-1">
          <span className={styles.chapterNum} aria-hidden="true">
            01
          </span>
          <p className={styles.sectionKicker}>Chapter 01</p>
          <h2>SDDとは何か、なぜMarkdownなのか</h2>

          <h3>Vibe Codingの限界</h3>
          <p>
            Andrej Karpathy氏が2025年初頭に提唱した「Vibe
            Coding」という言葉は、コーディングエージェントに緩いプロンプトを
            投げて生成物をそのまま受け入れるスタイルを指し、2025年のCollins English
            Dictionary「今年の言葉」にも選出される ほど広まりました<sup>[16]</sup>
            。プロトタイピングや個人開発では有効ですが、数百行を超える規模になると、
            エージェントが「言語化されていない意図」を推測で埋めるようになり、その推測の積み重ねがコードベース全体の
            ドリフト（意図からのズレ）を生みます<sup>[15][20]</sup>。
          </p>

          <div className={styles.callout} data-variant="default">
            <span className={styles.calLabel}>Simon Willison氏の視点</span>
            <p>
              Datasette作者のSimon
              Willison氏は、LLMが書いたコードであっても開発者がレビュー・テスト・理解を尽くしていれば、
              それはもはやVibe
              Codingではなく「LLMをタイピングアシスタントとして使っている」状態だと整理しています
              <sup>[23]</sup>。
              この「所有できるかどうか」の境界線こそが、SDD導入の判断基準になります。
            </p>
          </div>

          <h3>SDDの定義</h3>
          <p>
            仕様駆動開発（Spec-Driven Development）とは、コードではなく
            <strong>バージョン管理された仕様書そのもの</strong>を
            正とし、そこから実装計画・タスク・コードを導出する開発手法です<sup>[14]</sup>
            。2025年に、GitHub Spec Kit （2025年9月公開）やAWS
            Kiro（2025年7月公開）といったツールがAIエージェント向けに具体化し、2026年には主要な
            AIコーディングツールのほぼすべて（GitHub Spec Kit, AWS Kiro, Claude Code, Cursor,
            OpenSpec, BMAD-METHOD, Tessl, Google
            Antigravityなど）が何らかのSDDワークフローを実装するに至りました<sup>[16]</sup>。
          </p>
          <p>
            SDDが解決しようとしている問題は明快です。AIエージェントは明示された契約（仕様）に対する実装は非常に得意ですが、
            暗黙の意図を推測することは苦手です<sup>[16]</sup>
            。曖昧なプロンプトは曖昧なコードを生みますが、
            構造化された仕様は、意図に近いコードを生みます。
          </p>

          <h3>なぜMarkdownなのか</h3>
          <p>SDDの実務ツールがほぼ例外なくMarkdownを採用しているのには理由があります。</p>
          <ul>
            <li>
              <strong>人間にもAIにも読める</strong>:
              プレーンテキストであるため、人間のレビュアーとAIエージェントの
              双方が同じファイルをそのまま解釈できる<sup>[4]</sup>。
            </li>
            <li>
              <strong>バージョン管理と親和性が高い</strong>:
              Gitでdiffが取れるため、「仕様がいつ・どう変わったか」を 追跡できる<sup>[9]</sup>。
            </li>
            <li>
              <strong>ツール非依存（ポータブル）</strong>:
              特定ベンダーのフォーマットに縛られず、Claude Code・Codex・ Cursor・Gemini
              CLIなど複数のエージェント間で使い回せる<sup>[7]</sup>。
            </li>
            <li>
              <strong>構造と自由度のバランス</strong>:
              見出し・表・コードブロックといった軽量な構造化要素を持ちながら、
              厳密なスキーマを強制しない<sup>[26][7]</sup>。
            </li>
          </ul>
        </section>

        {/* ===================== 2 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-2">
          <span className={styles.chapterNum} aria-hidden="true">
            02
          </span>
          <p className={styles.sectionKicker}>Chapter 02</p>
          <h2>成熟度モデル:Spec-first / Spec-anchored / Spec-as-source</h2>
          <p>
            Thoughtworks社のMartin
            Fowler氏らのチームは、SDDの実践パターンを3段階の厳密度スペクトラムとして整理して います
            <sup>[13]</sup>
            。自分たちのチームがどの段階を目指すのかを最初に決めておくことが、後述する
            「過剰形式化（Waterfall化）」を防ぐ第一歩になります。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>段階</th>
                  <th>考え方</th>
                  <th>仕様が担う役割</th>
                  <th>コードの位置づけ</th>
                  <th>向いているケース</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Spec-first</strong>
                    <br />
                    （仕様先行）
                  </td>
                  <td>仕様を書いてからプロンプトする</td>
                  <td>AIへの高品質なコンテキスト</td>
                  <td>依然として正（メンテナンス対象）</td>
                  <td>
                    ほとんどの現場のデフォルト。実務での主流<sup>[16]</sup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Spec-anchored</strong>
                    <br />
                    （仕様係留）
                  </td>
                  <td>仕様は実装後も「生きた契約」として残り続ける</td>
                  <td>継続的なガバナンス文書</td>
                  <td>正だが、仕様との乖離をCIで機械的に検知</td>
                  <td>チーム開発・長期保守プロジェクト</td>
                </tr>
                <tr>
                  <td>
                    <strong>Spec-as-source</strong>
                    <br />
                    （仕様が源泉）
                  </td>
                  <td>仕様こそが唯一のソースで、コードは使い捨て可能な生成物</td>
                  <td>実行可能な仕様そのもの</td>
                  <td>生成物（規約変更時は再生成）</td>
                  <td>
                    OpenAPIからのスタブ生成、Simulinkモデルからの組込みコード生成など、既に標準化された領域
                    <sup>[15]</sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            多くの現場が実際に運用しているのは<strong>Spec-anchored</strong>寄りのアプローチであり、
            「仕様がAIの仕事を楽にし、人間レビュアーの仕事も楽にする」という位置づけです
            <sup>[15]</sup>。
          </p>
        </section>

        {/* ===================== 3 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-3">
          <span className={styles.chapterNum} aria-hidden="true">
            03
          </span>
          <p className={styles.sectionKicker}>Chapter 03</p>
          <h2>全体ワークフロー:Specify → Plan → Tasks → Implement</h2>
          <p>
            GitHub Spec Kitに代表される主要ツール群は、ほぼ共通して「Specify → Plan → Tasks →
            Implement」という 4フェーズループを採用しています<sup>[15][16]</sup>。各フェーズの間に
            <strong>人間によるレビューゲート</strong>を 置くことが、品質を保つ最大のポイントです。
          </p>

          <div className={styles.mermaidWrapper}>
            <MermaidDiagram chart={DIAGRAM_1} theme="base" themeVariables={THEME_VARS} />
          </div>
          <p className={styles.figCaption}>
            図1: Spec Kit / Kiro 共通の4フェーズループと人間レビューゲート
          </p>

          <p>
            GitHub Spec Kitでは、この4フェーズに加えて
            <code>/speckit.constitution</code>（プロジェクトの非交渉原則を 定義）、
            <code>/speckit.clarify</code>（曖昧点の質問）、<code>/speckit.analyze</code>
            （spec/plan/tasks間の 矛盾チェック）、<code>/speckit.checklist</code>
            （仕様の抜け漏れを検査する「英語のユニットテスト」）といった
            補助コマンドがスラッシュコマンドとして用意されています<sup>[3]</sup>。AWS
            Kiroも同様に、要件定義→設計→実装計画
            の3フェーズを踏み、各フェーズ間に承認ゲートを設けます<sup>[5][6]</sup>。
          </p>
        </section>

        {/* ===================== 4 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-4">
          <span className={styles.chapterNum} aria-hidden="true">
            04
          </span>
          <p className={styles.sectionKicker}>Chapter 04</p>
          <h2>ファイル構成の全体像</h2>
          <p>
            SDDのMarkdown群は役割ごとに階層化して配置するのが定石です。プロジェクト全体に効くファイルと、
            機能単位でスコープされるファイルを混在させないことが重要です。
          </p>

          <div className={styles.mermaidWrapper}>
            <MermaidDiagram chart={DIAGRAM_2} theme="base" themeVariables={THEME_VARS} />
          </div>
          <p className={styles.figCaption}>
            図2: プロジェクト全体スコープと機能スコープのファイル階層
          </p>

          <p>
            主要なツール・標準がそれぞれどのファイル名を使っているかを整理すると以下の通りです。名前は違えど、役割
            （What/Why・How・実行単位・全体コンテキスト）はほぼ共通しています。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ツール / 標準</th>
                  <th>主なファイル</th>
                  <th>提供元・管理団体</th>
                  <th>位置づけ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>GitHub Spec Kit</strong>
                  </td>
                  <td>
                    <code>constitution.md</code> <code>spec.md</code> <code>plan.md</code>{" "}
                    <code>tasks.md</code>
                  </td>
                  <td>GitHub（Microsoft傘下）</td>
                  <td>
                    OSSツールキット（MITライセンス）<sup>[1]</sup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>AWS Kiro</strong>
                  </td>
                  <td>
                    <code>requirements.md</code> <code>design.md</code> <code>tasks.md</code>
                  </td>
                  <td>AWS</td>
                  <td>
                    統合IDEに組み込み。EARS記法をネイティブ採用<sup>[5]</sup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Claude Code</strong>
                  </td>
                  <td>
                    <code>CLAUDE.md</code>
                  </td>
                  <td>Anthropic</td>
                  <td>
                    セッションを跨いで読み込まれる指示書<sup>[20]</sup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>AGENTS.md</strong>（オープン標準）
                  </td>
                  <td>
                    <code>AGENTS.md</code>
                  </td>
                  <td>
                    Agentic AI Foundation（Linux
                    Foundation傘下）。OpenAI・Google（Jules）・Cursor・Factor等が策定を主導
                  </td>
                  <td>
                    ベンダー中立、必須フィールドなしのプレーンMarkdown<sup>[32]</sup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Cursor</strong>
                  </td>
                  <td>
                    <code>.cursor/rules/*.mdc</code>
                  </td>
                  <td>Cursor（Anysphere）</td>
                  <td>
                    YAML frontmatter付きMarkdown。パスごとに適用範囲を制御<sup>[22]</sup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Agent Skills</strong>
                  </td>
                  <td>
                    <code>SKILL.md</code>
                  </td>
                  <td>Anthropicが提唱、オープン標準化</td>
                  <td>
                    Claude Code・Codex・Cursorなど30以上のツールが対応<sup>[18][29]</sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.good}`} data-variant="good">
            <span className={styles.calLabel}>モノレポでの配置ルール</span>
            <p>
              AGENTS.mdやCLAUDE.mdはモノレポの各パッケージ配下にも配置でき、エージェントは「編集対象ファイルに最も近い
              ファイル」を優先して読み込みます（例:
              OpenAIのCodexリポジトリでは88個のAGENTS.mdが階層的に配置されている）
              <sup>[27]</sup>。Claude Codeは独自にCLAUDE.mdを読みますが、
              <code>@AGENTS.md</code> のインポート記法を
              使えばAGENTS.mdを取り込めるため、複数ツールを併用するチームは「AGENTS.mdを単一の正とし、CLAUDE.mdは1行の
              インポート文だけにする」運用が推奨されています<sup>[26]</sup>。
            </p>
          </div>
        </section>

        {/* ===================== 5 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-5">
          <span className={styles.chapterNum} aria-hidden="true">
            05
          </span>
          <p className={styles.sectionKicker}>Chapter 05 ・ Step-by-Step</p>
          <h2>spec.md / requirements.md の書き方</h2>

          <h3>Step 1: メタデータと目的を明記する</h3>
          <p>
            冒頭に「何のための機能か」「誰のためか」「スコープ外は何か」を短く書きます。実装方法（How）はここに書きません。
            GitHub Spec
            Kitの実運用では、LLMが張り切りすぎて要素サイズや配色などの実装詳細をspecに混入させてしまう傾向が
            報告されており、気づいた時点で技術要件をplanドキュメント側へ移動するよう指示することが推奨されています
            <sup>[3]</sup>。
          </p>

          <h3>Step 2: ユーザーストーリーを優先度付きで書く</h3>
          <p>
            <code>P1</code>/<code>P2</code>/<code>P3</code>
            のように優先度ラベルを振り、各ストーリーを独立してテスト可能な
            MVPスライスとして記述するテンプレートが広く使われています<sup>[19]</sup>。
          </p>

          <div className={styles.codeBlock} data-testid="code-block">
            <div className={styles.cbHead}>
              <div className={styles.cbMeta}>
                <span>spec.md</span>
                <span className={styles.cbLang}>markdown</span>
              </div>
              <CopyButton text={CODE_TEXT_1} />
            </div>
            <pre>
              <code>
                <span className={styles.tokenSection}>
                  ### US-1（P1）: パスワードレス・ログイン
                </span>
                {"\n"}
                {"ユーザーとして、パスワードを覚えずにメールリンクだけでログインしたい。\n"}
                {"これにより、パスワード忘れによる離脱を防げるため。"}
              </code>
            </pre>
          </div>

          <h3>Step 3: 受け入れ基準をEARS記法で書く</h3>
          <p>
            自然文の受け入れ基準（"ユーザーはログインできる"
            等）は曖昧で、人間にもAIにも解釈のブレを生みます。 この問題に対する業界標準の解が
            <strong>EARS（Easy Approach to Requirements Syntax）</strong> です。
            2009年にRolls-RoyceのAlistair
            Mavin氏らが航空機エンジン制御の要件定義用に考案した記法で、Kiroをはじめとする
            主要SDDツールがAIエージェント向けの受け入れ基準記法として採用しています
            <sup>[16][24]</sup>。EARSはベンダー
            中立の記法であり、Kiroは採用者であって考案者ではありません<sup>[24]</sup>。
          </p>
          <p>
            EARSは5つのパターンで構成されます。どのパターンを使うべきかは、以下のように機械的に判定できます。
          </p>

          <div className={styles.mermaidWrapper}>
            <MermaidDiagram chart={DIAGRAM_3} theme="base" themeVariables={THEME_VARS} />
          </div>
          <p className={styles.figCaption}>図3: EARS 5パターンの判定フロー</p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>パターン</th>
                  <th>用途</th>
                  <th>構文テンプレート</th>
                  <th>例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Ubiquitous</strong>
                    <br />
                    （恒常要件）
                  </td>
                  <td>常に真である基本要件</td>
                  <td>
                    <code>THE SYSTEM SHALL &lt;応答&gt;</code>
                  </td>
                  <td>THE SYSTEM SHALL 全APIレスポンスをJSON形式で返す</td>
                </tr>
                <tr>
                  <td>
                    <strong>Event-driven</strong>
                    <br />
                    （イベント駆動）
                  </td>
                  <td>特定のイベント発生時</td>
                  <td>
                    <code>WHEN &lt;トリガー&gt; THE SYSTEM SHALL &lt;応答&gt;</code>
                  </td>
                  <td>
                    WHEN ユーザーが有効なメールアドレスを送信 THE SYSTEM SHALL
                    15分間有効なワンタイムリンクを送付する<sup>[21]</sup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>State-driven</strong>
                    <br />
                    （状態駆動）
                  </td>
                  <td>特定の状態が続く間</td>
                  <td>
                    <code>WHILE &lt;状態&gt; THE SYSTEM SHALL &lt;応答&gt;</code>
                  </td>
                  <td>WHILE メンテナンスモード中 THE SYSTEM SHALL 書き込みAPIを503で拒否する</td>
                </tr>
                <tr>
                  <td>
                    <strong>Unwanted behavior</strong>
                    <br />
                    （望まない挙動への対応）
                  </td>
                  <td>異常系・エラー処理</td>
                  <td>
                    <code>IF &lt;トリガー&gt; THEN THE SYSTEM SHALL &lt;応答&gt;</code>
                  </td>
                  <td>
                    IF ログインリンクが2回目以降使用された THEN THE SYSTEM SHALL HTTP 410で拒否する
                    <sup>[21]</sup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Optional feature</strong>
                    <br />
                    （オプション機能）
                  </td>
                  <td>特定機能が有効な場合のみ</td>
                  <td>
                    <code>WHERE &lt;機能&gt; THE SYSTEM SHALL &lt;応答&gt;</code>
                  </td>
                  <td>
                    WHERE 多要素認証が有効化されている THE SYSTEM SHALL
                    追加のワンタイムコード入力を要求する
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            EARSで書かれた受け入れ基準は、ほぼ1対1でテストケースに変換できるという実務上の利点があります
            <sup>[21]</sup>。
            一方で、EARSは「表現の型」を統一するだけであり、それ自体が実行可能なテストになるわけではない点には注意が必要です
            <sup>[24]</sup>。
          </p>

          <h3>Step 4: 曖昧さを可視化するマーカーを使う</h3>
          <p>
            GitHub Spec Kitの実運用では、spec.md中に
            <code>[NEEDS CLARIFICATION]</code> のようなマーカーを埋め込み、
            これが残っている間はタスクを「完了」とマークしない、という運用が確認されています
            <sup>[19]</sup>。曖昧な要件を 無理に確定させず、可視化したまま人間の判断を仰ぐ設計です。
          </p>

          <h3>Step 5: 実装詳細を書かない(Whatに徹する)</h3>
          <p>
            spec.mdは「何を」「なぜ」に徹し、「どう作るか」はplan.mdに譲ります。良い仕様書の条件を扱った
            Addy
            Osmani氏（Googleの著名なエンジニア）の記事でも、仕様はAIエージェントが自己修正しつつ安全な境界内に
            留まるための"契約"であるべきだと述べられています<sup>[10]</sup>。
          </p>
        </section>

        {/* ===================== 6 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-6">
          <span className={styles.chapterNum} aria-hidden="true">
            06
          </span>
          <p className={styles.sectionKicker}>Chapter 06 ・ Step-by-Step</p>
          <h2>plan.md / design.md の書き方</h2>
          <ol>
            <li>
              <strong>技術スタックとアーキテクチャ方針を明記する</strong>:
              使用するフレームワーク、データストア、
              外部API連携などをspecの要件にひもづけて記述します。
            </li>
            <li>
              <strong>アーキテクチャ図・シーケンス図はMermaidで描く</strong>:
              Kiroのdesign.mdも、技術アーキテクチャと
              シーケンス図をこの段階で文書化する運用になっています<sup>[5]</sup>
              。ASCIIアートは避け、Mermaidの フローチャート／シーケンス図で表現します。
            </li>
            <li>
              <strong>意思決定の根拠を残す（ADR的に）</strong>:
              なぜこの技術を選んだかを一言添えるだけで、後からの
              手戻りやレビュー時間を大きく減らせます。
            </li>
            <li>
              <strong>エラーハンドリング・テスト戦略を明記する</strong>:
              Kiroのdesign.mdはエラーハンドリングとテスト
              戦略を含むのが標準ですが、必要な粒度は都度調整します<sup>[32]</sup>。
            </li>
          </ol>

          <div className={`${styles.callout} ${styles.warn}`} data-variant="warn">
            <span className={styles.calLabel}>生成物を鵜呑みにしない</span>
            <p>
              Scott Logic社の検証では、planフェーズで自動生成された406行の「research
              doc」が、既存ページと同じ
              ライブラリを使う理由付けなど、冗長で価値の薄い内容になっていた例が報告されています
              <sup>[17]</sup>。
              <strong>生成させたら鵜呑みにせず、価値のある意思決定記録だけを残す</strong>
              姿勢が重要です。
            </p>
          </div>
        </section>

        {/* ===================== 7 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-7">
          <span className={styles.chapterNum} aria-hidden="true">
            07
          </span>
          <p className={styles.sectionKicker}>Chapter 07 ・ Step-by-Step</p>
          <h2>tasks.md の書き方</h2>
          <ol>
            <li>
              <strong>アトミックなタスクに分解する</strong>:
              各タスクは独立してレビュー・差し戻し可能な単位にします。
            </li>
            <li>
              <strong>要件へのトレーサビリティを持たせる</strong>:
              各タスクがどのユーザーストーリー／受け入れ基準に
              対応するかを明示し、実装が要件から逸脱していないかを追跡できるようにします
              <sup>[33]</sup>。
            </li>
            <li>
              <strong>依存関係を明示し、並列実行可能なタスクをグルーピングする</strong>:
              Kiroはtasks.mdから依存関係 グラフを構築し、依存のないタスクを「Wave
              1」としてまとめて並列に扱う仕組みを持ちます<sup>[5]</sup>。
            </li>
            <li>
              <strong>実装フェーズで内容を変更しない</strong>:
              タスクはLLMが何を作るかの直接的な反映であるため、
              この段階で不正確な内容が混入していないかの確認が特に重要だと、Spec
              Kitの実運用知見として指摘されています<sup>[3]</sup>。
            </li>
          </ol>

          <div className={styles.codeBlock} data-testid="code-block">
            <div className={styles.cbHead}>
              <div className={styles.cbMeta}>
                <span>tasks.md</span>
                <span className={styles.cbLang}>markdown</span>
              </div>
              <CopyButton text={CODE_TEXT_2} />
            </div>
            <pre>
              <code>
                <span className={styles.tokenSection}>## Task 12: マジックリンク送信APIの実装</span>
                {"\n"}
                <span className={styles.tokenBullet}>-</span>
                {" 対応要件: US-1 / EARS-EV-1\n"}
                <span className={styles.tokenBullet}>-</span>
                {" 依存: Task 03（メール送信基盤）\n"}
                <span className={styles.tokenBullet}>-</span>
                {" 完了条件: "}
                <span className={styles.tokenCode}>`POST /auth/magic-link`</span>
                {" が15分間有効なトークンを発行し、単体テストが通ること"}
              </code>
            </pre>
          </div>
        </section>

        {/* ===================== 8 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-8">
          <span className={styles.chapterNum} aria-hidden="true">
            08
          </span>
          <p className={styles.sectionKicker}>Chapter 08</p>
          <h2>AGENTS.md / CLAUDE.md:プロジェクト全体のコンテキストファイル</h2>
          <p>
            AGENTS.mdは「エージェント向けのREADME」と位置づけられる、プレーンMarkdownのオープン標準です
            <sup>[7]</sup>。 特徴は以下の通りです。
          </p>
          <ul>
            <li>
              <strong>必須フィールドなし</strong>: YAML
              frontmatterも不要で、見出しの付け方や粒度は完全に自由です<sup>[28]</sup>。
            </li>
            <li>
              <strong>対応ツールの広さ</strong>: 2026年前半時点でOpenAI Codex、Cursor、GitHub
              Copilot coding agent、 Gemini CLI、Windsurf、Aider、Zed、Devin、Amazon
              Qなど30以上のツールがネイティブまたはインポート経由で 読み込みます<sup>[25][26]</sup>
              。
            </li>
            <li>
              <strong>ガバナンス</strong>:
              元々OpenAI・Amp・Google（Jules）・Cursor・Factoryなどの協業から生まれ、 現在はLinux
              Foundation傘下のAgentic AI Foundationがスチュワードシップを担っています<sup>[7]</sup>
              。
            </li>
            <li>
              <strong>コンフリクト解決</strong>:
              「編集対象ファイルに最も近いAGENTS.md」が優先され、さらにユーザーの
              チャット上の明示的な指示はすべてに優先します<sup>[7]</sup>。
            </li>
          </ul>

          <div className={styles.codeBlock} data-testid="code-block">
            <div className={styles.cbHead}>
              <div className={styles.cbMeta}>
                <span>AGENTS.md</span>
                <span className={styles.cbLang}>markdown</span>
              </div>
              <CopyButton text={CODE_TEXT_3} />
            </div>
            <pre>
              <code>
                <span className={styles.tokenSection}># AGENTS.md</span>
                {"\n\n"}
                <span className={styles.tokenSection}>## セットアップ</span>
                {"\n"}
                <span className={styles.tokenBullet}>-</span>
                {" 依存関係インストール: "}
                <span className={styles.tokenCode}>`pnpm install`</span>
                {"\n"}
                <span className={styles.tokenBullet}>-</span>
                {" 開発サーバー起動: "}
                <span className={styles.tokenCode}>`pnpm dev`</span>
                {"\n\n"}
                <span className={styles.tokenSection}>## テスト</span>
                {"\n"}
                <span className={styles.tokenBullet}>-</span>
                {" 変更前に必ず実行: "}
                <span className={styles.tokenCode}>`pnpm test -- --changed`</span>
                {"\n"}
                <span className={styles.tokenBullet}>-</span>
                {" E2Eは "}
                <span className={styles.tokenCode}>`pnpm test:e2e`</span>
                {"（CI専用、ローカルでは実行しない）\n\n"}
                <span className={styles.tokenSection}>## 規約</span>
                {"\n"}
                <span className={styles.tokenBullet}>-</span>
                {" 状態管理はZustandのみ使用し、Reduxを追加しない\n"}
                <span className={styles.tokenBullet}>-</span>
                {" APIクライアントは "}
                <span className={styles.tokenCode}>`src/lib/api/`</span>
                {" 以下に集約する\n\n"}
                <span className={styles.tokenSection}>## 境界</span>
                {"\n"}
                <span className={styles.tokenBullet}>-</span>{" "}
                <span className={styles.tokenCode}>`packages/billing/`</span>
                {" 配下は決済監査対象。変更時は必ず人間レビューを要求すること"}
              </code>
            </pre>
          </div>

          <p>
            Claude CodeはAGENTS.mdではなく独自の
            <code>CLAUDE.md</code> を読み込みますが、二重管理を避けるため 「CLAUDE.mdの中身は
            <code>@AGENTS.md</code> の1行インポートのみにし、実体はAGENTS.mdに一本化する」という
            移行パターンが定着しています<sup>[25]</sup>。
          </p>
        </section>

        {/* ===================== 9 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-9">
          <span className={styles.chapterNum} aria-hidden="true">
            09
          </span>
          <p className={styles.sectionKicker}>Chapter 09</p>
          <h2>SKILL.md:段階的開示(Progressive Disclosure)</h2>
          <p>
            AGENTS.mdが「プロジェクトが何であるか」を伝えるのに対し、SKILL.mdは「特定のタスクをどうこなすか」という
            再利用可能な手順をエージェントに渡す仕組みです<sup>[27]</sup>。Anthropicが提唱し、Claude
            Code・Codex・ Cursorなど多くのツールに広がったオープン標準です<sup>[18]</sup>。
          </p>
          <p>
            SKILL.mdの最大の設計思想は<strong>段階的開示（Progressive Disclosure）</strong>
            です。コンテキストウィンドウは
            有限であり、すべてのスキルの全文を常時ロードするとノイズが増えるため、必要になった瞬間にだけ詳細を
            読み込む設計になっています<sup>[8]</sup>。
          </p>

          <div className={styles.mermaidWrapper}>
            <MermaidDiagram chart={DIAGRAM_4} theme="base" themeVariables={THEME_VARS} />
          </div>
          <p className={styles.figCaption}>図4: SKILL.mdの段階的開示(Progressive Disclosure)</p>

          <p>
            構造は「YAML frontmatter（<code>name</code> と<code>description</code>{" "}
            の2つが必須）＋Markdown本文の指示＋
            任意の補助ファイル（スクリプト・テンプレート）」というシンプルな形です
            <sup>[27][18]</sup>。
          </p>

          <div className={styles.codeBlock} data-testid="code-block">
            <div className={styles.cbHead}>
              <div className={styles.cbMeta}>
                <span>SKILL.md</span>
                <span className={styles.cbLang}>markdown</span>
              </div>
              <CopyButton text={CODE_TEXT_4} />
            </div>
            <pre>
              <code>
                <span className={styles.tokenMeta}>---</span>
                {"\n"}
                <span className={styles.tokenAttr}>name</span>
                {": "}
                <span className={styles.tokenString}>deploy</span>
                {"\n"}
                <span className={styles.tokenAttr}>description</span>
                {": "}
                <span className={styles.tokenString}>
                  アプリケーションを本番またはステージング環境へデプロイする
                </span>
                {"\n"}
                <span className={styles.tokenMeta}>---</span>
                {"\n\n"}
                <span className={styles.tokenSection}># Deploy</span>
                {"\n\n"}
                <span className={styles.tokenSection}>## 手順</span>
                {"\n"}
                <span className={styles.tokenNumber}>1.</span>
                {" テストスイートを実行: "}
                <span className={styles.tokenCode}>`bun run test`</span>
                {"\n"}
                <span className={styles.tokenNumber}>2.</span>
                {" 本番ビルド: "}
                <span className={styles.tokenCode}>`bun run build`</span>
                {"\n"}
                <span className={styles.tokenNumber}>3.</span>
                {" デプロイコマンドを実行し、ヘルスチェックを確認する"}
              </code>
            </pre>
          </div>
        </section>

        {/* ===================== 10 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-10">
          <span className={styles.chapterNum} aria-hidden="true">
            10
          </span>
          <p className={styles.sectionKicker}>Chapter 10</p>
          <h2>Markdown記法そのもののベストプラクティス</h2>
          <p>
            Anthropicの公式エンジニアリングブログ「Effective context engineering for AI
            agents」は、プロンプトや コンテキストを<code>&lt;background_information&gt;</code>
            のようなXMLタグ、または
            <strong>Markdownの見出し</strong>で
            明確にセクション分けすることを推奨しています。具体的な整形方法自体は今後変わっていく可能性があるが、
            明確なセクション区切りという原則自体は重要だと位置づけられています<sup>[8]</sup>
            。この原則はspec.md等の SDDドキュメントにもそのまま当てはまります。
          </p>

          <h3>10.1 見出し階層とセクション分け</h3>
          <ul>
            <li>
              見出し（<code>#</code>〜<code>####</code>
              ）でセクションを明確に分離し、AIが「今どのセクションを読んで
              いるか」を見出しテキストだけで判断できるようにする。
            </li>
            <li>1見出しに1目的。複数の関心事を1つの見出し配下に詰め込まない。</li>
            <li>
              アンカーリンク付きの目次を長いドキュメントには必ず用意し、人間のレビュー時のナビゲーションコストを下げる。
            </li>
          </ul>

          <h3>10.2 表 vs 箇条書きの使い分け</h3>
          <ul>
            <li>
              <strong>表が向くケース</strong>:
              複数の項目を同じ軸（列）で比較する場合。AIエージェントにとっても
              構造化データとして解釈しやすい。
            </li>
            <li>
              <strong>箇条書きが向くケース</strong>: 単純な列挙、手順のステップ、条件の羅列。
            </li>
          </ul>

          <h3>10.3 Mermaidダイアグラムのルール</h3>
          <p>
            ASCIIアートによる図解は保守性が低く、フォントやレンダリング環境によって崩れるため、フローチャートは必ず
            Mermaidのコードブロックで記述します。実務での注意点は以下の通りです。
          </p>
          <ul>
            <li>
              <code>mindmap</code> と <code>quadrantChart</code>{" "}
              は環境によって表示が崩れやすいため避け、
              <code>flowchart</code> + <code>subgraph</code> で代替する。
            </li>
            <li>
              サブグラフのタイトルには特殊文字を避けるか、クォートで囲んでパースエラーを防ぐ。
            </li>
            <li>
              ノード数が多い横方向のフローチャートはビューポート幅を超えやすいため、<code>TB</code>
              （縦方向）レイアウトを 優先する。
            </li>
            <li>
              ノード間に実際のエッジがない兄弟要素は横に並んで幅が広がりがちなので、意味のある接続だけを描き、
              レイアウトを縦に収める。
            </li>
          </ul>

          <h3>10.4 コードブロックとfrontmatter</h3>
          <ul>
            <li>
              コマンド例・設定例は必ずフェンス付きコードブロック（<code>```</code>
              ）で囲み、言語識別子 （<code>bash</code>, <code>json</code>, <code>markdown</code>
              など）を付与する。
            </li>
            <li>
              SKILL.mdやCursorの<code>.mdc</code>ファイルのように、メタデータが必要な場合はYAML
              frontmatterを使う。 本文の指示と機械可読なメタデータを分離できる<sup>[27]</sup>。
            </li>
          </ul>
        </section>

        {/* ===================== 11 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-11">
          <span className={styles.chapterNum} aria-hidden="true">
            11
          </span>
          <p className={styles.sectionKicker}>Chapter 11</p>
          <h2>生きたドキュメントとしての運用</h2>
          <p>
            仕様は「書いたら終わり」ではありません。SDDが従来のウォーターフォール型ドキュメントと決定的に違うのは、
            <strong>要求が変わったらまず仕様を更新し、そこからコードを再生成・修正する</strong>
            という運用ループを 回す点です<sup>[16]</sup>。
          </p>
          <ul>
            <li>バグ修正・機能追加のリクエストが来たら、実装コードより先にspec.mdを更新する。</li>
            <li>
              仕様変更のコストが「重い」と感じ始めたら、それは過剰形式化（Waterfall化）のサインとして扱い、
              プロセスを軽量化する<sup>[31]</sup>。
            </li>
            <li>
              大きな機能追加のたびに1つの巨大な仕様に機能を積み増すのではなく、機能ごとに仕様を分割する。
            </li>
          </ul>
        </section>

        {/* ===================== 12 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-12">
          <span className={styles.chapterNum} aria-hidden="true">
            12
          </span>
          <p className={styles.sectionKicker}>Chapter 12</p>
          <h2>よくある落とし穴と対策</h2>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>落とし穴</th>
                  <th>症状</th>
                  <th>対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Spec Bloat</strong>
                    <br />
                    （仕様の肥大化）
                  </td>
                  <td>
                    30分で実装できるはずの機能に対して800行超のMarkdownが生成される<sup>[30]</sup>
                  </td>
                  <td>テンプレートを最小構成にトリムし、「必要十分」をチーム内で明文化する</td>
                </tr>
                <tr>
                  <td>
                    <strong>ウォーターフォール化</strong>
                  </td>
                  <td>
                    Spec→Plan→Tasksの往復が硬直化する。Scott Logic社の実機検証では、Spec
                    Kitのフルパイプラインが
                    通常の反復プロンプトよりも約10倍遅く、レビューだけで3.5時間を要した例も報告されている
                    <sup>[17]</sup>
                  </td>
                  <td>
                    変更コストが高いと感じたら過剰形式化のサイン。小規模な変更は軽量な仕様更新に留める
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Semantic Diffusion</strong>
                    <br />
                    （用語の希薄化）
                  </td>
                  <td>
                    「仕様駆動開発」という言葉がツールごとに異なる哲学を指すため、比較が噛み合わなくなる
                    <sup>[24]</sup>
                  </td>
                  <td>
                    ツール名やラベルではなく、実際のワークフロー（何がSource of Truthか）で比較する
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>実装詳細の混入</strong>
                  </td>
                  <td>
                    機能仕様（spec.md）に色・サイズ・ライブラリ選定などの技術詳細が紛れ込む
                    <sup>[3]</sup>
                  </td>
                  <td>気づいた時点でLLMに指示し、該当箇所をplan.md側へ移動する</td>
                </tr>
                <tr>
                  <td>
                    <strong>Spec Drift</strong>
                    <br />
                    （仕様と実装の乖離）
                  </td>
                  <td>コードだけが変更され、仕様が古いまま放置される</td>
                  <td>
                    「要求変更時は必ず仕様を先に更新する」運用をチームルール化し、CIで乖離を検知する仕組みを検討する
                    <sup>[16]</sup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>偽の網羅感</strong>
                  </td>
                  <td>
                    仕様を読み流し、エッジケースが書かれていると錯覚したまま実装を進めてしまう
                  </td>
                  <td>
                    仕様は「読まれる前提」で簡潔に保ち、レビュー担当を明確に決める<sup>[30]</sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ===================== 13 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-13">
          <span className={styles.chapterNum} aria-hidden="true">
            13
          </span>
          <p className={styles.sectionKicker}>Chapter 13</p>
          <h2>導入前チェックリスト</h2>
          <ul className={styles.checklist}>
            <li>
              <span className={styles.chk} />
              <span>
                <code>constitution.md</code>
                （またはAGENTS.md冒頭）にプロジェクトの非交渉原則が明文化されている
              </span>
            </li>
            <li>
              <span className={styles.chk} />
              <span>
                spec.md / requirements.mdが「What」「Why」に徹し、実装詳細（How）を含んでいない
              </span>
            </li>
            <li>
              <span className={styles.chk} />
              <span>
                受け入れ基準がEARS記法（またはGiven-When-Then）で書かれ、曖昧な自然文のままになっていない
              </span>
            </li>
            <li>
              <span className={styles.chk} />
              <span>
                曖昧な要件には <code>[NEEDS CLARIFICATION]</code>{" "}
                等のマーカーが付き、放置されていない
              </span>
            </li>
            <li>
              <span className={styles.chk} />
              <span>
                plan.md /
                design.mdのアーキテクチャ図・シーケンス図がMermaidで記述され、ASCIIアートを含まない
              </span>
            </li>
            <li>
              <span className={styles.chk} />
              <span>
                tasks.mdの各タスクが要件へのトレーサビリティを持ち、独立してレビュー可能な粒度になっている
              </span>
            </li>
            <li>
              <span className={styles.chk} />
              <span>
                AGENTS.md（またはCLAUDE.md）にビルド／テストコマンドと「触ってはいけない領域」が明記されている
              </span>
            </li>
            <li>
              <span className={styles.chk} />
              <span>
                繰り返し使う手順はSKILL.mdとして切り出し、YAML frontmatterの<code>description</code>
                だけで用途が判断できる
              </span>
            </li>
            <li>
              <span className={styles.chk} />
              <span>
                長いドキュメントにはアンカーリンク付き目次があり、見出し階層が1見出し1目的になっている
              </span>
            </li>
            <li>
              <span className={styles.chk} />
              <span>比較・列挙情報は表で、手順・条件は箇条書きで整理されている</span>
            </li>
            <li>
              <span className={styles.chk} />
              <span>
                仕様変更時は「まず仕様を更新してからコードを再生成・修正する」運用ルールがチームに共有されている
              </span>
            </li>
            <li>
              <span className={styles.chk} />
              <span>
                生成された仕様・計画ドキュメントの分量が肥大化していないか、レビュー時に確認している
              </span>
            </li>
          </ul>
        </section>

        {/* ===================== 14 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-14">
          <span className={styles.chapterNum} aria-hidden="true">
            14
          </span>
          <p className={styles.sectionKicker}>Chapter 14</p>
          <h2>まとめ</h2>
          <p>
            AI仕様駆動開発におけるMarkdown運用の本質は、
            <strong>
              「AIエージェントが迷わず実装でき、人間が短時間で
              レビューできる」構造をどれだけ作れるか
            </strong>
            に尽きます。EARS記法による受け入れ基準の明確化、What/Howの
            分離、段階的開示によるコンテキスト管理、そして「仕様は生きたドキュメントである」という運用ルールの4つが、
            ツールを問わず共通する骨格です。同時に、Spec
            Kitの実運用レビューが示すように、仕様が肥大化し
            ウォーターフォール的な硬直運用に陥るリスクも実際に報告されています<sup>[17]</sup>
            。仕様の「厳密さ」と
            「軽さ」のバランスは、プロジェクトの規模とチームの成熟度に応じて都度調整していく前提で運用してください。
          </p>
        </section>

        {/* ===================== 15 ===================== */}
        <section className={`${styles.section} ${styles.prose}`} id="sec-15">
          <span className={styles.chapterNum} aria-hidden="true">
            15
          </span>
          <p className={styles.sectionKicker}>Chapter 15</p>
          <h2>参考文献</h2>
          <p>
            本ガイドの記述は、2026年7月28日時点で参照可能な以下の一次情報・著名な開発者/組織の発信に基づいています。
          </p>
          <ol className={styles.refList}>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>GitHub, &quot;spec-kit&quot; 公式リポジトリ</p>
                <a
                  className={styles.refUrl}
                  href="https://github.com/github/spec-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/github/spec-kit
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>GitHub, Spec Kit 公式ドキュメントサイト</p>
                <a
                  className={styles.refUrl}
                  href="https://github.github.com/spec-kit/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.github.com/spec-kit/
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Den Delimarsky（GitHub Principal PM）, &quot;What&apos;s The Deal With GitHub Spec
                  Kit&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://den.dev/blog/github-spec-kit/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://den.dev/blog/github-spec-kit/
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Microsoft for Developers, &quot;Diving Into Spec-Driven Development With GitHub
                  Spec Kit&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://developer.microsoft.com/blog/spec-driven-development-spec-kit/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://developer.microsoft.com/blog/spec-driven-development-spec-kit/
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>AWS Kiro 公式ドキュメント, &quot;Specs&quot;</p>
                <a
                  className={styles.refUrl}
                  href="https://kiro.dev/docs/specs/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://kiro.dev/docs/specs/
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  AWS Kiro 公式ドキュメント, &quot;Feature Specs&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://kiro.dev/docs/specs/feature-specs/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://kiro.dev/docs/specs/feature-specs/
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  AGENTS.md 公式サイト（Agentic AI Foundation / Linux Foundation）
                </p>
                <a
                  className={styles.refUrl}
                  href="https://agents.md/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://agents.md/
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Anthropic Engineering, &quot;Effective context engineering for AI agents&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Anthropic Engineering, &quot;Effective harnesses for long-running agents&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Addy Osmani（Google, Chrome Engineering）, &quot;How to write a good spec for AI
                  agents&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://addyosmani.com/blog/good-spec/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://addyosmani.com/blog/good-spec/
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Simon Willison（Datasette作者）, &quot;Agentic Engineering Patterns&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://simonw.substack.com/p/agentic-engineering-patterns"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://simonw.substack.com/p/agentic-engineering-patterns
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>Simon Willison, ai-assisted-programming タグ一覧</p>
                <a
                  className={styles.refUrl}
                  href="https://simonwillison.net/tags/ai-assisted-programming/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://simonwillison.net/tags/ai-assisted-programming/
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Martin Fowler / Thoughtworks, &quot;Exploring Generative AI&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://martinfowler.com/articles/exploring-gen-ai.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://martinfowler.com/articles/exploring-gen-ai.html
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>Wikipedia, &quot;Spec-driven development&quot;</p>
                <a
                  className={styles.refUrl}
                  href="https://en.wikipedia.org/wiki/Spec-driven_development"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://en.wikipedia.org/wiki/Spec-driven_development
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Java Code Geeks, &quot;Spec-Driven Development with AI: Write the Spec First, Then
                  Prompt the Implementation&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://www.javacodegeeks.com/2026/05/spec-driven-development-with-ai-write-the-spec-first-then-prompt-the-implementation.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.javacodegeeks.com/2026/05/spec-driven-development-with-ai-write-the-spec-first-then-prompt-the-implementation.html
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  BCMS, &quot;Spec-Driven Development (SDD): The Definitive 2026 Guide&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://thebcms.com/blog/spec-driven-development"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://thebcms.com/blog/spec-driven-development
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Scott Logic（Colin Eberhardt, CTO）, &quot;Putting Spec Kit Through Its Paces:
                  Radical Idea or Reinvented Waterfall?&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Agentailor, &quot;Top AI Agent Standards to Know in 2026&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://blog.agentailor.com/posts/top-ai-agent-standards-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://blog.agentailor.com/posts/top-ai-agent-standards-2026
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  SSOJet, &quot;9 PRD and Spec Templates Built for AI Coding Agents&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://ssojet.com/blog/prd-spec-templates-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://ssojet.com/blog/prd-spec-templates-ai-agents
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Joshua McDonald, &quot;EARS, Fifteen Years On: The Requirements Format Built for
                  the Agent Era&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://joshmcdonald.medium.com/ears-fifteen-years-on-the-requirements-format-built-for-the-agent-era-0f78f8ff35a0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://joshmcdonald.medium.com/ears-fifteen-years-on-the-requirements-format-built-for-the-agent-era-0f78f8ff35a0
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  DEV Community (krlz), &quot;Spec-Driven Development in 2026: What It Is, the
                  Tooling, and How Teams Actually Use It&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://dev.to/krlz/spec-driven-development-in-2026-what-it-is-the-tooling-and-how-teams-actually-use-it-2fk2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://dev.to/krlz/spec-driven-development-in-2026-what-it-is-the-tooling-and-how-teams-actually-use-it-2fk2
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Augment Code, &quot;6 Best Spec-Driven Development Tools for AI Coding in
                  2026&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://www.augmentcode.com/tools/best-spec-driven-development-tools"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.augmentcode.com/tools/best-spec-driven-development-tools
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  SoftwareSeni, &quot;Spec-Driven Development Is Replacing Vibe Coding as the
                  Professional Standard for AI Teams&quot;（Simon Willison氏の見解を含む）
                </p>
                <a
                  className={styles.refUrl}
                  href="https://www.softwareseni.com/spec-driven-development-is-replacing-vibe-coding-as-the-professional-standard-for-ai-teams/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.softwareseni.com/spec-driven-development-is-replacing-vibe-coding-as-the-professional-standard-for-ai-teams/
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  CodeMySpec, &quot;Spec-Driven Development in 2026: Guide + Tool
                  Comparison&quot;（EARS記法の歴史・Rolls-Royce起源の詳細）
                </p>
                <a
                  className={styles.refUrl}
                  href="https://codemyspec.com/blog/spec-driven-development"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://codemyspec.com/blog/spec-driven-development
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  CodersEra, &quot;AGENTS.md Complete Guide 2026&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://codersera.com/blog/agents-md-complete-guide-2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://codersera.com/blog/agents-md-complete-guide-2026/
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  BuildBetter, &quot;AGENTS.md Complete Guide for Engineering Teams in 2026&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://blog.buildbetter.ai/agents-md-complete-guide-for-engineering-teams-in-2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://blog.buildbetter.ai/agents-md-complete-guide-for-engineering-teams-in-2026/
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  MorphLLM, &quot;AGENTS.md Spec (2026): Recommended Sections and Comparison With
                  CLAUDE.md / .cursorrules&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://www.morphllm.com/agents-md-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.morphllm.com/agents-md-guide
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  DeepWiki, &quot;AGENTS.md Format Documentation&quot;（openai/agents.md）
                </p>
                <a
                  className={styles.refUrl}
                  href="https://deepwiki.com/openai/agents.md/5-agents.md-format-documentation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://deepwiki.com/openai/agents.md/5-agents.md-format-documentation
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Agensi, &quot;What Is the Agent Skills Open Standard?&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://www.agensi.io/learn/agent-skills-open-standard"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.agensi.io/learn/agent-skills-open-standard
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  bitbytebit（Substack）, &quot;Spec-Driven Development: From Vibe Coding to
                  Structured Development&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://bitbytebit.substack.com/p/spec-driven-development-from-vibe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://bitbytebit.substack.com/p/spec-driven-development-from-vibe
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  The Main Thread, &quot;Spec-Driven Development Needs an Exit Strategy&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://www.the-main-thread.com/p/spec-driven-development-exit-strategy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.the-main-thread.com/p/spec-driven-development-exit-strategy
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  AWS Builder Center, &quot;Getting Started With Spec-Driven Development Using
                  Kiro&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://builder.aws.com/content/36nn9PbSZuKJiWWoO2UWmFaaCHs/getting-started-with-spec-driven-development-using-kiro"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://builder.aws.com/content/36nn9PbSZuKJiWWoO2UWmFaaCHs/getting-started-with-spec-driven-development-using-kiro
                </a>
              </div>
            </li>
            <li className={styles.refItem}>
              <div className={styles.refBody}>
                <p className={styles.refTitle}>
                  Kanai Dutta（Medium）, &quot;Experience With Kiro&apos;s Spec Driven Development
                  Methodology&quot;
                </p>
                <a
                  className={styles.refUrl}
                  href="https://medium.com/@kanaiduttaiem/experience-with-kiros-spec-driven-development-methodology-1e57af895fd7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://medium.com/@kanaiduttaiem/experience-with-kiros-spec-driven-development-methodology-1e57af895fd7
                </a>
              </div>
            </li>
          </ol>
        </section>

        <footer className={styles.footer}>
          <div className={styles.disclaimer}>
            免責事項:
            上記は2026年7月28日時点のWeb検索結果に基づく要約であり、各ツールの仕様・対応状況は今後変更される
            可能性があります。導入前には各公式ドキュメントの最新版を必ず確認してください。
          </div>
        </footer>
      </div>
    </div>
  );
}
