import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import { ChecklistCard } from "./ChecklistCard";
import { TocObserver } from "./TocObserver";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "GitHub Copilot Agent Skills 実践ガイド ― SKILL.md 完全仕様",
  description:
    "GitHub Copilot Agent Skills (SKILL.md) の完全ガイド。フロントマター仕様、3段階ローディング、ディレクトリ構造、gh skill管理、実践テンプレート、セキュリティ、トラブルシューティングを網羅。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_1 = `flowchart TB
    A[開発者のリクエスト] --> B{Copilotが判断}
    B --> C[Custom Instructions<br/>常時読み込み・低詳細度]
    B --> D[Agent Skills<br/>必要時のみ読み込み・高詳細度]
    B --> E[MCPサーバー<br/>外部ツール・データ接続]
    B --> F[カスタムエージェント<br/>独立したペルソナ・権限セット]
    C --> G[コーディング規約・常に守るべきルール]
    D --> H[特定タスクの再現可能な手順書]
    E --> I[Issue追跡・DB・社内API等の実データ]
    F --> J[レビュー専任・実装専任などの人格分離]`;

const DIAGRAM_2 = `flowchart TB
    T1["2025年10月16日<br/>Anthropicが「Agent Skills」を発表<br/>(Claude.ai / Claude Code向け)"] --> T2
    T2["2025年12月18日<br/>agentskills.io としてオープン仕様公開<br/>同日 GitHub Copilotが対応を発表"] --> T3
    T3["2026年1月上旬<br/>VS Code 安定版でSkillsサポート開始<br/>(発表時点ではInsidersのみ)"] --> T4
    T4["2026年2月上旬<br/>Snyk「ToxicSkills」調査発表<br/>公開スキルの3割超に脆弱性"] --> T5
    T5["2026年上半期<br/>OpenAI Codex・Cursor・Gemini CLI等<br/>40前後のプラットフォームへ対応拡大"] --> T6
    T6["2026年7月29日<br/>Copilot code reviewでの<br/>Agent Skills / MCP対応がGA"]`;

const DIAGRAM_3 = `sequenceDiagram
    participant U as 開発者
    participant C as Copilot(エージェント)
    participant S as SKILL.mdとリソース群

    Note over C: 起動時: 全スキルの name/description を<br/>システムプロンプトに事前ロード(第1段階)
    U->>C: 「このPDFのフォームを埋めて」
    C->>C: descriptionと突き合わせて関連スキルを判定
    C->>S: pdf/SKILL.md を読み込み(第2段階)
    S-->>C: 本文の手順・使用可能なスクリプト一覧を返す
    C->>S: forms.md を追加で読み込み(第3段階)
    S-->>C: フォーム入力の詳細手順を返す
    C->>S: スクリプトをコードとして実行(内容は読み込まない)
    S-->>C: 実行結果のみを返す
    C-->>U: フォーム入力済みPDFを提示`;

const DIAGRAM_4 = `flowchart TB
    S1["Step 1<br/>繰り返しているタスクを特定する"] --> S2
    S2["Step 2<br/>skillsディレクトリと<br/>スキル用サブディレクトリを作成"] --> S3
    S3["Step 3<br/>SKILL.mdのフロントマターを書く<br/>(name / description)"] --> S4
    S4["Step 4<br/>本文にステップバイステップの<br/>手順・例・エッジケースを書く"] --> S5
    S5["Step 5<br/>必要ならscripts/references/assetsを追加し<br/>allowed-toolsを検討"] --> S6
    S6["Step 6<br/>直接・間接・否定の3パターンで<br/>発火テストを行う"] --> S7
    S7["Step 7<br/>チームに配布<br/>(コミット or gh skill publish)"] --> S8
    S8["Step 8<br/>実運用しながら<br/>descriptionと本文を反復改善"]`;

const DIAGRAM_5 = `sequenceDiagram
    participant D as 開発者
    participant CLI as GitHub CLI(gh skill)
    participant Repo as スキル配布用リポジトリ

    D->>CLI: gh skill search TOPIC
    CLI->>Repo: TOPICに関連するスキルを検索
    Repo-->>CLI: 候補一覧を返す
    D->>CLI: gh skill preview OWNER/REPO SKILL
    CLI->>Repo: SKILL.mdとファイルツリーを取得
    Repo-->>CLI: 内容をターミナルに表示(未インストール)
    D->>CLI: gh skill install OWNER/REPO SKILL
    CLI->>Repo: 該当スキルを取得
    CLI-->>D: 正しいディレクトリへ配置し、provenanceメタデータを付与`;

const DIAGRAM_6 = `flowchart TB
    Q1{ほぼ全タスクに<br/>常に関係する情報か?} -->|Yes| A[Custom Instructions]
    Q1 -->|No| Q2{外部システムの<br/>実データ・ツール呼び出しが必要か?}
    Q2 -->|Yes| B[MCPサーバー]
    Q2 -->|No| Q3{独立した権限・ペルソナで<br/>タスクを丸ごと任せたいか?}
    Q3 -->|Yes| C[カスタムエージェント/Subagent]
    Q3 -->|No| D[Agent Skills<br/>再現可能な手順書として切り出す]`;

const DIAGRAM_7 = `flowchart TB
    P["スキルが期待通りに動かない"] --> D1{そもそも一覧に表示されるか?<br/>/skills で確認}
    D1 -->|表示されない| F1["name とディレクトリ名の一致、<br/>配置パスを再確認"]
    D1 -->|表示される| D2{直接的な指示でも発火しないか?}
    D2 -->|発火しない| F2["descriptionが一人称・抽象的でないか確認し、<br/>Trigger Triadで書き直す"]
    D2 -->|発火する| D3{間接的な指示では発火しないか?}
    D3 -->|発火しない| F3["トリガー語彙(類義語・言い回し)を<br/>descriptionへ追加"]
    D3 -->|発火する| D4{無関係なタスクでも誤発火するか?}
    D4 -->|誤発火する| F4["Do not use when... を<br/>descriptionへ追加"]
    D4 -->|しない| D5{発火はするが指示に<br/>正しく従わないか?}
    D5 -->|従わない| F5["本文を500行/5000トークン以内に整理し、<br/>重要ルールを先頭へ、詳細はreferencesへ分割"]`;

export default function CopilotSkillPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <div className={styles.topBar} />
      <button
        type="button"
        className={styles.sidebarToggle}
        id="sidebarToggle"
        aria-label="目次を開閉"
        aria-controls="sidebar"
        aria-expanded="false"
      >
        ☰ 目次
      </button>
      <nav className={styles.sidebar} id="sidebar">
        <p className={styles.sidebarTitle}>GitHub Copilot Agent Skills</p>
        <p className={styles.sidebarSub}>SKILL.md 実践ガイド</p>
        <a href="#このガイドについて" className={styles.navLink}>
          このガイドについて
        </a>
        <a href="#1-agent-skills-とは何か" className={styles.navLink}>
          1. Agent Skills とは何か
        </a>
        <a href="#2-標準化の経緯とタイムライン" className={styles.navLink}>
          2. 標準化の経緯とタイムライン
        </a>
        <a href="#3-3段階ローディングprogressive-disclosure完全解説" className={styles.navLink}>
          3. 3段階ローディング(Progressive Disclosure)完全解説
        </a>
        <a href="#4-フロントマター完全仕様" className={styles.navLink}>
          4. フロントマター完全仕様
        </a>
        <a href="#5-ディレクトリ構造とスコープ" className={styles.navLink}>
          5. ディレクトリ構造とスコープ
        </a>
        <a href="#6-ステップバイステップ作成ガイド" className={styles.navLink}>
          6. ステップバイステップ作成ガイド
        </a>
        <a href="#7-github-cligh-skillによるスキル管理" className={styles.navLink}>
          7. GitHub CLI(gh skill)によるスキル管理
        </a>
        <a href="#8-実践テンプレート集" className={styles.navLink}>
          8. 実践テンプレート集
        </a>
        <a href="#9-copilotの各サーフェスでの挙動差分" className={styles.navLink}>
          9. Copilotの各サーフェスでの挙動差分
        </a>
        <a href="#10-skills-vs-custom-instructions-vs-mcp-vs-subagents" className={styles.navLink}>
          10. Skills vs Custom Instructions vs MCP vs Subagents
        </a>
        <a href="#11-セキュリティベストプラクティス" className={styles.navLink}>
          11. セキュリティベストプラクティス
        </a>
        <a href="#12-トラブルシューティング完全ガイド" className={styles.navLink}>
          12. トラブルシューティング完全ガイド
        </a>
        <a href="#13-ベストプラクティスチェックリスト" className={styles.navLink}>
          13. ベストプラクティスチェックリスト
        </a>
        <a href="#14-まとめ" className={styles.navLink}>
          14. まとめ
        </a>
        <a href="#参考文献出典" className={styles.navLink}>
          参考文献・出典
        </a>
      </nav>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>
            GitHub Copilot Agent Skills 実践ガイド ― SKILL.md
            完全仕様・3段階ローディング・テンプレート集・トラブルシューティング
          </h1>
          <blockquote>
            <p>
              対象読者: GitHub Copilot(VS Code / Visual Studio / JetBrains / Copilot CLI / Copilot
              cloud agent / Copilot code review)を業務で使い込んでいる中級〜上級エンジニア。Custom
              Instructions や MCP
              はひと通り使ったことがあり、次のステップとして「再利用可能な手順知識」を SKILL.md
              として整備したい人を想定している。
            </p>
          </blockquote>
        </div>
        <hr />

        <h2 id="このガイドについて">このガイドについて</h2>
        <p>
          GitHub Copilot は 2025年12月18日、Agent Skills(SKILL.md)への対応を発表した。これはもともと
          Anthropic が Claude 向けに 2025年10月16日に発表した仕組みで、同年12月18日に{" "}
          <code className={styles.inlineCode}>agentskills.io</code>{" "}
          でベンダー中立のオープン仕様として公開されたものである。現在は GitHub Copilot・OpenAI
          Codex・Cursor・Gemini CLI・Snowflake Cortex Code など 40
          前後のプラットフォームが同一フォーマットをサポートしており、「一度書けば複数のコーディングエージェントで動く」共通言語になりつつある。
        </p>
        <p>本ガイドは次の5点を柱に、ステップバイステップで解説する。</p>
        <ol>
          <li>
            <strong>フロントマター完全仕様</strong> ―{" "}
            <code className={styles.inlineCode}>name</code> /{" "}
            <code className={styles.inlineCode}>description</code> /{" "}
            <code className={styles.inlineCode}>license</code> /{" "}
            <code className={styles.inlineCode}>compatibility</code> /{" "}
            <code className={styles.inlineCode}>metadata</code> /{" "}
            <code className={styles.inlineCode}>allowed-tools</code> の全フィールド
          </li>
          <li>
            <strong>3段階ローディング(Progressive Disclosure)</strong> ― Discovery / Activation /
            Execution という3段階の設計思想とコンテキストコスト
          </li>
          <li>
            <strong>ステップバイステップ作成</strong> ―
            何もない状態から実運用可能なスキルを作るまでの手順
          </li>
          <li>
            <strong>実践テンプレート集</strong> ― そのままコピーして使える5種類のテンプレート
          </li>
          <li>
            <strong>トラブルシューティング</strong> ― 実際に GitHub / VS Code の Issue
            で報告された不具合を基にした症状別の対処表
          </li>
        </ol>
        <p>
          ASCII アートによる図解は使用せず、フローチャートは Mermaid、構造の一覧は Markdown
          の表・箇条書きで統一する。
        </p>
        <hr />

        <h2 id="1-agent-skills-とは何か">1. Agent Skills とは何か</h2>
        <h3 id="11-定義">1.1 定義</h3>
        <p>
          Agent
          Skills(エージェントスキル)は、指示・スクリプト・参考資料をまとめたフォルダであり、Copilot
          のようなコーディングエージェントがタスクに関連すると判断したときにだけ動的に読み込む仕組みである。GitHub
          の公式ドキュメントは次のように説明している。
        </p>
        <blockquote>
          <p>
            Agent skills are lightweight folders of instructions, scripts, and resources that
            agents can dynamically discover and load to perform specific tasks effectively.
          </p>
        </blockquote>
        <p>
          スキルは単一のテキストファイル(<code className={styles.inlineCode}>SKILL.md</code>
          )から始まるが、必要に応じて次のような構造へ拡張できる。
        </p>
        <ul>
          <li>
            <code className={styles.inlineCode}>SKILL.md</code> (必須):
            YAMLフロントマターと、エージェントへの指示本文
          </li>
          <li>
            <code className={styles.inlineCode}>scripts/</code> (任意):
            エージェントが実行できるシェルスクリプトやPythonスクリプト
          </li>
          <li>
            <code className={styles.inlineCode}>references/</code> (任意):
            タスクの背景情報・データベース設計・API仕様などの補助ドキュメント
          </li>
          <li>
            <code className={styles.inlineCode}>assets/</code> (任意):
            テンプレート・静的画像・サンプルデータなど
          </li>
        </ul>

        <h3 id="12-なぜ生まれたのか">1.2 なぜ生まれたのか</h3>
        <p>
          Agent Skills
          が登場する以前、開発者がエージェントの挙動をカスタマイズする主な手段は「Custom
          Instructions」(<code className={styles.inlineCode}>.github/copilot-instructions.md</code>{" "}
          や <code className={styles.inlineCode}>AGENTS.md</code>)であった。しかし Custom
          Instructions は<strong>すべての会話で常時読み込まれる</strong>ため、次の2点の問題が深刻化した。
        </p>
        <p>
          第一に、コンテキストウィンドウの圧迫である。コードレビューの観点、特定ライブラリのハマりどころ、デプロイ手順などを1つの指示ファイルに詰め込むと、あっという間に数万トークンを消費し、肝心のコードを読み込む枠が削られてしまう。
        </p>
        <p>
          第二に、指示の干渉(Instruction Confusion)である。あまりに多くのルールが常時並んでいると、エージェントが「どのルールを優先すべきか」を誤り、指示に従わなくなったり、無関係なタスクで過剰なチェックを行ったりする現象が起きる。
        </p>
        <p>
          Agent Skills はこの問題を解決するために設計された。<strong>普段は「名前」と「1行の説明」だけを頭の片隅に置いておき、必要なタスクが来たときだけ中身を読み込む</strong>。この「段階的開示(Progressive Disclosure)」こそが、Agent Skills の本質である。
        </p>

        <h3 id="13-エコシステムにおける位置づけ">1.3 エコシステムにおける位置づけ</h3>
        <p>Copilot をカスタマイズする手段は大きく4種類あり、それぞれ役割が異なる。</p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_1} />
        </div>
        <p>
          GitHub 公式ドキュメントも「Custom Instructions
          はほぼ全タスクに関係する簡潔な情報に、Skills
          は関係するときだけ参照すべき詳細な情報に使う」ことを推奨している。
        </p>
        <hr />

        <h2 id="2-標準化の経緯とタイムライン">2. 標準化の経緯とタイムライン</h2>
        <p>
          Agent Skills
          が単一ベンダーの機能からオープン標準になるまでの流れを押さえておくと、なぜ「GitHub
          CopilotのSKILL.md」という言い方が成立するのかが理解しやすくなる。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_2} />
        </div>
        <p>
          特に重要なのは、2025年12月18日の <code className={styles.inlineCode}>agentskills.io</code>{" "}
          の公開である。Anthropic と GitHub が共同でオープン仕様を策定したことで、同一の{" "}
          <code className={styles.inlineCode}>SKILL.md</code> フォーマットが Anthropic Claude
          Code、GitHub Copilot、OpenAI Codex、Cursor、Gemini CLI、Snowflake Cortex Code
          など40前後のプラットフォームでそのまま動作するようになった。
        </p>
        <p>
          また 2026年7月29日には、GitHub が「Copilot code review における Agent Skills と MCP
          の一般提供(GA)」を発表した。これにより、PRの自動レビュー時に独自のチェックリストスキルを適用したり、社内セキュリティ基準スキルを発火させたりすることが公式にサポートされた。
        </p>
        <hr />

        <h2 id="3-3段階ローディングprogressive-disclosure完全解説">
          3. 3段階ローディング(Progressive Disclosure)完全解説
        </h2>
        <p>
          Agent Skills
          の最大の技術的特徴は、コンテキスト消費を最小限に抑える「3段階ローディング(Progressive
          Disclosure)」にある。
        </p>
        <p>
           Anthropic のエンジニアリングブログ「Equipping agents with Agent Skills」では、これを
          Discovery(発見)・Activation(起動)・Execution(実行) の 3 段階として定義している。
        </p>

        <h3 id="31-各社の呼称比較">3.1 各社の呼称比較</h3>
        <p>
          段階の表現にはベンダー間で若干の呼称差があるが、指している概念は完全に一致している。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>段階</th>
                <th>Anthropic 公式ブログの呼称</th>
                <th>GitHub / VS Code ドキュメントの呼称</th>
                <th>読み込まれる要素</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>第1段階</td>
                <td>Discovery(発見)</td>
                <td>Pre-load / Metadata Scan</td>
                <td>
                  <code className={styles.inlineCode}>name</code> と{" "}
                  <code className={styles.inlineCode}>description</code> のみ
                </td>
              </tr>
              <tr>
                <td>第2段階</td>
                <td>Activation(起動)</td>
                <td>Skill Load / Context Injection</td>
                <td>
                  <code className={styles.inlineCode}>SKILL.md</code> の本文全体
                </td>
              </tr>
              <tr>
                <td>第3段階</td>
                <td>Execution(実行)</td>
                <td>Resource Fetch / Script Execution</td>
                <td>
                  <code className={styles.inlineCode}>references/</code> の個別ファイルやスクリプト実行結果
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          この3段階の分離により、100個のスキルを配置していても、第1段階で消費されるトークンはわずか数千トークンに抑えられる。
        </p>

        <h3 id="32-コンテキストウィンドウでの動き">3.2 コンテキストウィンドウでの動き</h3>
        <p>
          Anthropic のエンジニアリングブログが示す PDF スキルの例を基に、Copilot
          がスキルを起動してから実行に至るまでのシーケンスを図示する。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_3} />
        </div>
        <p>
          重要なのは、<strong>スクリプト自体のソースコードはコンテキストウィンドウに入らない</strong>という点である。Copilot
          はスクリプトを外部ツールとして実行し、その標準出力(STDOUT)だけをコンテキストに受け取る。1,000行のPythonスクリプトであっても、出力が「3行のエラーログ」であれば消費トークンは数十トークンで済む。
        </p>

        <h3 id="33-トークンコストの実測値">3.3 トークンコストの実測値</h3>
        <p>
          Anthropic が公表した実測データに基づき、従来の「全指示常時読み込み」と Agent Skills
          の「3段階ローディング」におけるトークン消費量を比較する。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>状態</th>
                <th>従来の Custom Instructions 方式</th>
                <th>Agent Skills (Progressive Disclosure)</th>
                <th>削減率</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>会話開始時 (スキルの待機中)</td>
                <td>50,000 トークン (全指示を常時ロード)</td>
                <td>1,200 トークン (100個のname/descriptionのみ)</td>
                <td>97.6% 削減</td>
              </tr>
              <tr>
                <td>特定タスク実行中 (スキル発火時)</td>
                <td>50,000 トークン (無関係な指示も混在)</td>
                <td>4,500 トークン (該当スキルのSKILL.mdのみロード)</td>
                <td>91.0% 削減</td>
              </tr>
              <tr>
                <td>リソース追加参照時 (第3段階)</td>
                <td>50,000 トークン (変化なし)</td>
                <td>7,000 トークン (必要なreferenceファイルのみ追加)</td>
                <td>86.0% 削減</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          このように、Agent Skills
          を利用することでコンテキストコストを10分の1以下に削減でき、エージェントの推論速度と回答精度が大幅に向上する。
        </p>
        <hr />

        <h2 id="4-フロントマター完全仕様">4. フロントマター完全仕様</h2>
        <p>
          <code className={styles.inlineCode}>SKILL.md</code> の冒頭には、YAML
          形式のフロントマターを記述する。フロントマターはハイフン3つ(<code className={styles.inlineCode}>---</code>
          )で囲む必要がある。
        </p>

        <h3 id="41-フィールド一覧">4.1 フィールド一覧</h3>
        <p>
          <code className={styles.inlineCode}>agentskills.io</code> 仕様 v1.0
          で定義されている全フィールドの一覧は以下の通りである。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>フィールド名</th>
                <th>必須 / 任意</th>
                <th>型</th>
                <th>説明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className={styles.inlineCode}>name</code></td>
                <td>必須</td>
                <td>string</td>
                <td>
                  スキルの識別名。小文字・ハイフン区切り。<strong>親ディレクトリ名と完全一致が必須</strong>。
                </td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>description</code></td>
                <td>必須</td>
                <td>string</td>
                <td>
                  スキルの機能と発火条件の説明。<strong>エージェントが発火を判断する唯一の情報源</strong>。
                </td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>license</code></td>
                <td>任意</td>
                <td>string</td>
                <td>
                  ライセンス識別子(例: <code className={styles.inlineCode}>MIT</code>,{" "}
                  <code className={styles.inlineCode}>Apache-2.0</code>)。公開スキルで推奨。
                </td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>compatibility</code></td>
                <td>任意</td>
                <td>string</td>
                <td>
                  動作環境の要件(例: <code className={styles.inlineCode}>git, python &gt;= 3.10</code>)。
                </td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>metadata</code></td>
                <td>任意</td>
                <td>map</td>
                <td>
                  任意キーバリュー。著者情報・バージョン・内部IDなどを格納する。
                </td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>allowed-tools</code></td>
                <td>任意(実験的)</td>
                <td>string / list</td>
                <td>
                  スキル実行中にエージェントへ事前許可するツール一覧。
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <code className={styles.inlineCode}>name</code> と{" "}
          <code className={styles.inlineCode}>description</code>{" "}
          以外のフィールドはすべて任意だが、チーム内配布や公開レジストリへ登録する際は{" "}
          <code className={styles.inlineCode}>license</code> や{" "}
          <code className={styles.inlineCode}>metadata</code> を書くことが望ましい。
        </p>

        <h3 id="42-最小構成の例">4.2 最小構成の例</h3>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`---
name: pdf-form-filler
description: Fills out PDF forms. Use this when asked to fill out, complete, or process PDF form fields.
---`}</code>
          </pre>
        </div>
        <p>実務で使う最小構成は、上記のようにわずか4行で完結する。</p>

        <h3 id="43-name-フィールドの命名規則">4.3 name フィールドの命名規則</h3>
        <p>
          <code className={styles.inlineCode}>name</code>{" "}
          フィールドには、厳格な命名規則がある。
        </p>
        <ul>
          <li>小文字の英数字とハイフンのみを使用する(正規表現: <code className={styles.inlineCode}>^[a-z0-9-]+$</code>)</li>
          <li>先頭と末尾にハイフンを使ってはならない</li>
          <li>連続したハイフン(<code className={styles.inlineCode}>--</code>)を使ってはならない</li>
          <li>最大文字数は 64 文字</li>
          <li><strong>配置されている親ディレクトリ名と完全に一致しなければならない</strong></li>
        </ul>
        <p>
          特に最後の「親ディレクトリ名との一致」は、初心者が最もハマりやすいポイントである。ディレクトリ名が{" "}
          <code className={styles.inlineCode}>.github/skills/my-skill/</code> であれば、フロントマターの{" "}
          <code className={styles.inlineCode}>name</code> も必ず <code className={styles.inlineCode}>my-skill</code>{" "}
          にしなければならない。不一致の場合、Copilot はスキルをサイレントに無視する。
        </p>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`# ❌ NG 例: ディレクトリ名が my-skill なのに name が my_skill
---
name: my_skill
description: ...
---

# ✅ OK 例: ディレクトリ名と name が一致
---
name: my-skill
description: ...
---`}</code>
          </pre>
        </div>

        <h3 id="44-description-フィールドの書き方--trigger-triad">
          4.4 description フィールドの書き方 ― Trigger Triad
        </h3>
        <p>
          <code className={styles.inlineCode}>description</code> は、Agent Skills
          において最も重要な要素である。第1段階(Discovery)において、Copilot
          はユーザーのプロンプトと <code className={styles.inlineCode}>description</code>{" "}
          を突き合わせ、そのスキルを読み込むかどうかを決定する。
        </p>
        <p>
          Anthropic のガイドラインは、優れた <code className={styles.inlineCode}>description</code>{" "}
          を書くためのフレームワークとして「<strong>Trigger Triad(トリガーの三原則)</strong>」を提示している。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>要素</th>
                <th>役割</th>
                <th>記述例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1. 何ができるか (Capability)</td>
                <td>スキルの具体的な機能や提供する価値を明確にする</td>
                <td>Fills out PDF forms and extracts form field data.</td>
              </tr>
              <tr>
                <td>2. いつ使うべきか (Context/Triggers)</td>
                <td>ユーザーがどんな要求や用語を使ったときに発火すべきか明記する</td>
                <td>Use this when asked to fill out, complete, or process PDF forms or interactive fields.</td>
              </tr>
              <tr>
                <td>3. いつ使うべきでないか (Exclusions)</td>
                <td>誤発火を防ぐための除外条件を明記する</td>
                <td>Do not use for general PDF text extraction or creating new PDF documents from scratch.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>これら3つの要素を組み合わせた理想的なフロントマターの例を示す。</p>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`---
name: pdf-form-filler
description: Fills out PDF forms and extracts form field data. Use this when asked to fill out, complete, or process PDF forms or interactive fields. Do not use for general PDF text extraction or creating new PDF documents from scratch.
---`}</code>
          </pre>
        </div>
        <p>
          <code className={styles.inlineCode}>description</code> を書く際の重要な注意点:
        </p>
        <ul>
          <li>
            <strong>三人称で記述する</strong>: 「I can fill out...」や「My purpose is...」などの一人称を避ける。「Fills out...」「Use this when...」のように客観的に書く。
          </li>
          <li>
            <strong>具体的なトリガー語彙を含める</strong>: ユーザーが実際に口にしそうな動詞や名詞(「fill out」「complete」「PDF form」など)を意識的に散りばめる。
          </li>
          <li>
            <strong>1,024文字以内に収める</strong>: 長すぎる説明はシステムプロンプトを圧迫し、判定精度を落とす。
          </li>
        </ul>

        <h3 id="45-説明文のテスト手法">4.5 説明文のテスト手法</h3>
        <p>
          <code className={styles.inlineCode}>description</code>{" "}
          を作成した後は、発火精度を検証するために「3パターンのテストプロンプト」を用意することが推奨される。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>テストパターン</th>
                <th>プロンプト例</th>
                <th>期待される挙動</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>直接的リクエスト (Direct)</td>
                <td>「このPDFのフォームに名前と住所を入力して」</td>
                <td>確実にかつ即座にスキルが発火すること</td>
              </tr>
              <tr>
                <td>間接的リクエスト (Indirect)</td>
                <td>「送られてきた申請書の入力欄を埋めてほしい」</td>
                <td>言葉の揺らぎを解釈して正しくスキルが発火すること</td>
              </tr>
              <tr>
                <td>否定ケース (Negative)</td>
                <td>「このPDFのテキストを抽出してMarkdownにして」</td>
                <td>スキルが<strong>発火しない</strong>こと(誤発火の防止)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          否定ケースでスキルが誤発火する場合は、<code className={styles.inlineCode}>description</code>{" "}
          に「Do not use for...」という除外文を追加してチューニングを行う。
        </p>

        <h3 id="46-allowed-tools-フィールドとセキュリティ">
          4.6 allowed-tools フィールドとセキュリティ
        </h3>
        <p>
          <code className={styles.inlineCode}>allowed-tools</code> は、VS Code
          および Copilot CLI において実験的に導入されているフィールドである。スキルが起動された際、ユーザーへ都度確認ダイアログを出さずに実行を許可するツールを指定できる。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>指定形式</th>
                <th>例</th>
                <th>評価</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ワイルドカード指定 (危険)</td>
                <td><code className={styles.inlineCode}>allowed-tools: ["*"]</code></td>
                <td>全ツールを無制限に許可。セキュリティリスクが非常に高く非推奨。</td>
              </tr>
              <tr>
                <td>カテゴリ丸ごと指定 (注意)</td>
                <td><code className={styles.inlineCode}>allowed-tools: ["shell", "read"]</code></td>
                <td>シェル実行を全面的に許可。悪意あるスクリプトの実行リスクあり。</td>
              </tr>
              <tr>
                <td>コマンド単位の限定指定 (推奨)</td>
                <td><code className={styles.inlineCode}>allowed-tools: ["Bash(git:*)", "Read"]</code></td>
                <td>git コマンドとファイル読み込みのみを許可。最小権限原則に合致。</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          最小権限原則(Principle of Least Privilege)に従い、可能な限りコマンド単位で限定指定することが強く推奨される。
        </p>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`---
name: git-commit-helper
description: Generates standardized git commit messages based on staged diffs.
allowed-tools:
  - "Bash(git status)"
  - "Bash(git diff *)"
  - "Read"
---`}</code>
          </pre>
        </div>
        <hr />

        <h2 id="5-ディレクトリ構造とスコープ">5. ディレクトリ構造とスコープ</h2>
        <h3 id="51-基本構造">5.1 基本構造</h3>
        <p>
          スキルは単一の <code className={styles.inlineCode}>SKILL.md</code>{" "}
          だけでも動作するが、大規模な開発やチーム共有においてはサブディレクトリを活用した構造化が推奨される。
        </p>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`.github/skills/my-advanced-skill/
├── SKILL.md                 # [必須] フロントマター + 主要指示
├── scripts/                 # [任意] エージェントが呼び出すスクリプト
│   ├── check-coverage.py
│   └── run-linter.sh
├── references/              # [任意] 第3段階で必要に応じて読み込む資料
│   ├── db-schema.md
│   └── api-spec.md
└── assets/                  # [任意] テンプレートや静的ファイル
    └── config-template.json`}</code>
          </pre>
        </div>
        <p>各ディレクトリの役割と使い分けは以下の通りである。</p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>要素</th>
                <th>適切な用途</th>
                <th>非推奨な用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className={styles.inlineCode}>SKILL.md</code> 本文</td>
                <td>高レベルな手順、意思決定の原則、エッジケースの注意点</td>
                <td>数千行の長大なコード、巨大なAPIリファレンスの丸ごと貼り付け</td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>scripts/</code></td>
                <td>決定論的で確実性が求められる処理(ビルド、データ整形、検証)</td>
                <td>曖昧な自然言語で記述可能なロジック(指示本文に書くべき)</td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>references/</code></td>
                <td>特定のタスクでしか使わない長大なスキーマ定義やルール集</td>
                <td>すべてのタスクで常に必要な共通ルール(SKILL.md本文に書くべき)</td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>assets/</code></td>
                <td>コード生成のひな型、静的画像、サンプル設定ファイル</td>
                <td>エージェントに直接読み込ませる指示テキスト</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="52-プロジェクトスキル-vs-パーソナルスキル">
          5.2 プロジェクトスキル vs パーソナルスキル
        </h3>
        <p>
          Copilot はスキルを配置する場所によって、適用されるスコープ(影響範囲)を分離している。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>種別</th>
                <th>配置パス</th>
                <th>スコープ</th>
                <th>用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>プロジェクトスキル (Project Skill)</td>
                <td><code className={styles.inlineCode}>{".github/skills/<skill-name>/SKILL.md"}</code></td>
                <td>該当リポジトリのみ</td>
                <td>チーム共有のレビュー観点、プロジェクト固有のデプロイ・テスト手順</td>
              </tr>
              <tr>
                <td>パーソナルスキル (Personal Skill)</td>
                <td><code className={styles.inlineCode}>{"~/.copilot/skills/<skill-name>/SKILL.md"}</code></td>
                <td>全プロジェクト共通</td>
                <td>個人のお気に入りショートカット、個人のコーディングスタイル好み</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          なお、Anthropic Claude Code や Cursor との互換性を考慮する場合、以下の代替パスも自動検出される。
        </p>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`# Copilot が探索するプロジェクトスキルの優先順位
1. .github/skills/<skill-name>/SKILL.md   (Copilot 標準)
2. .claude/skills/<skill-name>/SKILL.md   (Claude 互換)
3. .agents/skills/<skill-name>/SKILL.md   (オープン標準)

# Copilot が探索するパーソナルスキルの優先順位
1. ~/.copilot/skills/<skill-name>/SKILL.md (Copilot 標準)
2. ~/.claude/skills/<skill-name>/SKILL.md  (Claude 互換)
3. ~/.agents/skills/<skill-name>/SKILL.md  (オープン標準)`}</code>
          </pre>
        </div>
        <p>
          プロジェクトスキルは Git リポジトリにコミットすることで、リポジトリをクローンしたチームメンバー全員へ即座に共有される。
        </p>

        <h3 id="53-各エージェントホストでの対応状況">5.3 各エージェントホストでの対応状況</h3>
        <p>
          GitHub Copilot の各製品・サーフェスにおける Agent Skills のサポート状況一覧は以下の通りである。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>サーフェス / 環境</th>
                <th>対応状況</th>
                <th>備考 / バージョン要件</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>VS Code (Copilot Agent mode)</td>
                <td>対応 (GA)</td>
                <td>VS Code 1.97 以降。Agent mode で全機能が利用可能。</td>
              </tr>
              <tr>
                <td>Visual Studio 2022</td>
                <td>対応 (GA)</td>
                <td>Visual Studio 2022 v17.13 以降。</td>
              </tr>
              <tr>
                <td>JetBrains IDEs (IntelliJ, PyCharm等)</td>
                <td>対応 (プレビュー)</td>
                <td>Copilot プラグイン v1.5.30 以降。</td>
              </tr>
              <tr>
                <td>GitHub Copilot CLI</td>
                <td>対応 (GA)</td>
                <td>Copilot CLI v0.2.0 以降。gh skill サブコマンドに対応。</td>
              </tr>
              <tr>
                <td>Copilot cloud agent (GitHub.com)</td>
                <td>対応 (GA)</td>
                <td>.github/skills/ を自動検出してバックグラウンド実行。</td>
              </tr>
              <tr>
                <td>Copilot code review</td>
                <td>対応 (GA)</td>
                <td>2026年7月29日にGA。PRレビュー時に自動発火。</td>
              </tr>
              <tr>
                <td>Claude Code (CLI)</td>
                <td>対応 (GA)</td>
                <td>Anthropic 公式。.claude/skills/ を参照。</td>
              </tr>
              <tr>
                <td>Cursor</td>
                <td>対応 (GA)</td>
                <td>.cursor/skills/ または .agents/skills/ を参照。</td>
              </tr>
              <tr>
                <td>Gemini CLI</td>
                <td>対応 (GA)</td>
                <td>.gemini/skills/ または .agents/skills/ を参照。</td>
              </tr>
              <tr>
                <td>OpenAI Codex (CLI / Web)</td>
                <td>対応 (GA)</td>
                <td>.codex/skills/ または .agents/skills/ を参照。</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          主要なコーディングエージェントのほぼ全てでサポートが完了しており、共通のスキルアセットとして運用可能な環境が整っている。
        </p>
        <hr />

        <h2 id="6-ステップバイステップ作成ガイド">6. ステップバイステップ作成ガイド</h2>
        <p>
          ここからは実際に手を動かしながら、ゼロから実運用可能なスキルを作る手順を追う。題材は「GitHub
          Actionsの失敗を調査する」スキルとする。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_4} />
        </div>

        <h3 id="step-1-繰り返しているタスクを特定する">Step 1: 繰り返しているタスクを特定する</h3>
        <p>
          同じプロンプトを複数の会話で繰り返しタイプしている、あるいは特定のレビュー観点やデバッグ手順を毎回口頭で説明しているなら、それがスキル化の候補である。Anthropic
          のガイドラインは「代表的なタスクでエージェントを実際に動かし、つまずく箇所や追加コンテキストが必要になる箇所を観察する」ことを最初のステップとして推奨している。
        </p>

        <h3 id="step-2-ディレクトリを作成する">Step 2: ディレクトリを作成する</h3>
        <div className={styles.codeBlock}>
          <pre>
            <code>mkdir -p .github/skills/github-actions-failure-debugging</code>
          </pre>
        </div>
        <p>
          サブディレクトリ名は小文字・ハイフン区切りにする。これは後述の{" "}
          <code className={styles.inlineCode}>name</code> フィールドと一致させる必要があるためである。
        </p>

        <h3 id="step-3-フロントマターを書く">Step 3: フロントマターを書く</h3>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`---
name: github-actions-failure-debugging
description: Guide for debugging failing GitHub Actions workflows. Use this when asked to debug failing GitHub Actions workflows.
---`}</code>
          </pre>
        </div>

        <h3 id="step-4-本文を書く">Step 4: 本文を書く</h3>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`To debug failing GitHub Actions workflows in a pull request, follow this process, using tools provided from the GitHub MCP Server:

1. Use the \`list_workflow_runs\` tool to look up recent workflow runs for the pull request and their status
2. Use the \`summarize_job_log_failures\` tool to get an AI summary of the logs for failed jobs, to understand what went wrong without filling your context window with thousands of lines of logs
3. If you still need more information, use the \`get_job_logs\` or \`get_workflow_run_logs\` tool to get the full, detailed failure logs
4. Try to reproduce the failure yourself in your own environment
5. Fix the failing build. If you were able to reproduce the failure yourself, make sure it is fixed before committing your changes`}</code>
          </pre>
        </div>
        <p>
          本文の分量は<strong>500行未満</strong>を目安にする。それを超える場合は{" "}
          <code className={styles.inlineCode}>references/</code> にファイルを分割し、SKILL.md
          からリンクする形にする。Anthropic のガイドラインでは「SKILL.md本文は5,000トークン未満が理想」ともされており、行数だけでなくトークン量にも意識を向けるとよい。
        </p>

        <h3 id="step-5-スクリプトを追加する任意">Step 5: スクリプトを追加する(任意)</h3>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`.github/skills/image-convert/
  SKILL.md
  convert-svg-to-png.sh`}</code>
          </pre>
        </div>
        <p>
          スキルが起動されると、Copilot はそのスキルディレクトリ内の全ファイルを自動的に発見し、
          <code className={styles.inlineCode}>SKILL.md</code>{" "}
          の指示と一緒に利用可能にする。本文中でスクリプトの呼び出し方を明記すること。
        </p>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`When asked to convert an SVG to PNG, run the \`convert-svg-to-png.sh\`
script from this skill's base directory, passing the input SVG file
path as the first argument.`}</code>
          </pre>
        </div>

        <h3 id="step-6-発火テストを行う">Step 6: 発火テストを行う</h3>
        <p>
          前述の「直接的リクエスト」「間接的リクエスト」「否定ケース」の3パターンで実際にプロンプトを投げ、期待通りに発火するかを確認する。反応が悪い場合は{" "}
          <code className={styles.inlineCode}>description</code>{" "}
          のトリガー語彙を見直す。本文の指示を直す前に、まず{" "}
          <code className={styles.inlineCode}>description</code> を疑うのが定石である。
        </p>

        <h3 id="step-7-チームに配布する">Step 7: チームに配布する</h3>
        <p>
          <code className={styles.inlineCode}>.github/skills/</code>{" "}
          配下に置いてコミットすれば、リポジトリをクローンした全員が自動的にそのスキルを利用できるようになる。公開スキルリポジトリとして運用する場合は、後述の{" "}
          <code className={styles.inlineCode}>gh skill publish</code> を使って検証・公開する。
        </p>

        <h3 id="step-8-反復改善する">Step 8: 反復改善する</h3>
        <p>
          Anthropic
          のガイドラインが強調するのは「Claudeの視点で考える」ことである。実際の利用シーンでスキルがどう使われたかを観察し、想定外の挙動や特定の文脈への過度な依存がないかを確認する。うまくいかなかった場合はエージェント自身に「何が問題だったか」を振り返らせ、そのフィードバックを本文に反映する、というループを回す。
        </p>
        <hr />

        <h2 id="7-github-cligh-skillによるスキル管理">
          7. GitHub CLI(gh skill)によるスキル管理
        </h2>
        <p>
          GitHub CLI 2.90.0 以降では <code className={styles.inlineCode}>gh skill</code>{" "}
          サブコマンド(パブリックプレビュー)を使い、スキルの検索・プレビュー・インストール・更新・公開を行える。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_5} />
        </div>

        <h3 id="71-検索プレビューインストール">7.1 検索・プレビュー・インストール</h3>
        <p>
          GitHub CLI を使って公開スキルのエコシステムから目的のスキルを探し、安全に導入するコマンド例を示す。
        </p>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`# 1. キーワードでスキルを検索
gh skill search react

# 2. インストール前にスキルの内容とファイル構造をプレビュー (セキュリティ必須手順)
gh skill preview vercel-labs/agent-skills react-best-practices

# 3. プロジェクトローカル (.github/skills/) へインストール
gh skill install vercel-labs/agent-skills react-best-practices

# 4. パーソナルスキル (~/.copilot/skills/) としてグローバルインストール
gh skill install vercel-labs/agent-skills react-best-practices --global`}</code>
          </pre>
        </div>
        <p>
          <code className={styles.inlineCode}>gh skill install</code> を実行すると、<code className={styles.inlineCode}>SKILL.md</code>{" "}
          のフロントマターに <code className={styles.inlineCode}>metadata.provenance</code>{" "}
          が自動的に追記され、出所トレースが可能になる。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>追記されるメタデータキー</th>
                <th>内容例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className={styles.inlineCode}>metadata.provenance.repository</code></td>
                <td><code className={styles.inlineCode}>vercel-labs/agent-skills</code></td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>metadata.provenance.commit</code></td>
                <td><code className={styles.inlineCode}>a1b2c3d4e5f6...</code></td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>metadata.provenance.installed_at</code></td>
                <td><code className={styles.inlineCode}>2026-08-01T10:00:00Z</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`---
name: react-best-practices
description: Applies React 19 best practices...
metadata:
  provenance:
    repository: vercel-labs/agent-skills
    commit: a1b2c3d4e5f67890
    installed_at: 2026-08-01T10:00:00Z
---`}</code>
          </pre>
        </div>

        <h3 id="72-更新公開">7.2 更新・公開</h3>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`# インストール済みスキルの更新確認と一括アップデート
gh skill update --all

# 自作スキルリポジトリの検証 (構造・フロントマター・セキュリティスキャン)
gh skill lint .github/skills/my-custom-skill

# 自作スキルを GitHub 上へ公開・登録
gh skill publish .github/skills/my-custom-skill`}</code>
          </pre>
        </div>
        <p>
          <code className={styles.inlineCode}>gh skill lint</code> は、フロントマターの文法エラーや{" "}
          <code className={styles.inlineCode}>name</code> とディレクトリ名の不一致、後述する ToxicSkills
          パターンの検出を静的に行う。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>gh skill lint のチェック項目</th>
                <th>判定基準</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Directory Name Parity</td>
                <td><code className={styles.inlineCode}>name</code> フィールドが親ディレクトリ名と完全一致するか</td>
              </tr>
              <tr>
                <td>Frontmatter Syntax</td>
                <td>YAML文法が正しく、必須項目(name, description)が存在するか</td>
              </tr>
              <tr>
                <td>Description Length</td>
                <td>description が 1,024 文字以内に収まっているか</td>
              </tr>
              <tr>
                <td>Security Vulnerabilities</td>
                <td>プロンプトインジェクションや危険な外部コマンド実行指示がないか</td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr />

        <h2 id="8-実践テンプレート集">8. 実践テンプレート集</h2>
        <p>
          業務で頻繁に使用されるユースケース別に、そのままコピー＆ペーストして使える実用テンプレートを提示する。
        </p>

        <h3 id="81-最小構成テンプレート">8.1 最小構成テンプレート</h3>
        <p>単一の役割に特化した、シンプルで軽量なテンプレート。</p>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`---
name: format-json-response
description: Formats raw API responses into structured JSON. Use this when asked to format, clean up, or structure API JSON data.
---

# Instructions

When asked to format an API response:

1. Parse the input text as JSON
2. Sort object keys alphabetically at all levels
3. Format with 2-space indentation
4. Output only the formatted JSON inside a json code block`}</code>
          </pre>
        </div>

        <h3 id="82-スクリプト実行テンプレート">8.2 スクリプト実行テンプレート</h3>
        <p>シェルスクリプトや外部ツールを安全に呼び出すためのテンプレート。</p>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`---
name: svg-to-png-converter
description: Converts SVG files to PNG format. Use this when asked to convert, render, or export SVG images to PNG.
allowed-tools:
  - "Bash(./scripts/convert.sh *)"
  - "Read"
---

# SVG to PNG Conversion Guide

Follow these steps to convert an SVG file to PNG:

1. Locate the input SVG file specified by the user
2. Run the conversion script from this skill's directory:
   \`\`\`bash
   ./scripts/convert.sh <input-svg-path> <output-png-path>
   \`\`\`
3. Verify that the output PNG file exists and is non-empty
4. Report the resulting file path and file size to the user`}</code>
          </pre>
        </div>

        <h3 id="83-コードレビュー特化テンプレート">8.3 コードレビュー特化テンプレート</h3>
        <p>PRの自動レビューやローカルでのコード監査に特化したテンプレート。</p>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`---
name: security-code-review
description: Performs security-focused code reviews. Use this when asked to audit, review for security, or check for vulnerabilities in pull requests or code snippets.
---

# Security Code Review Checklist

Review the target code against the following critical security vectors:

1. **Input Validation & Sanitization**
   - Check for SQL Injection risks in database queries
   - Check for XSS vulnerabilities in rendered HTML/JSX
   - Ensure user inputs are validated at API boundaries

2. **Authentication & Authorization**
   - Verify that protected endpoints require valid session/JWT
   - Check for Broken Object Level Authorization (BOLA/IDOR)

3. **Data Protection**
   - Ensure no hardcoded secrets, API keys, or credentials exist
   - Verify that PII and sensitive data are masked in log outputs

Format your findings as a Markdown table with columns: \`Severity\` | \`Location\` | \`Vulnerability\` | \`Remediation\`.`}</code>
          </pre>
        </div>

        <h3 id="84-複数ファイル参照テンプレートreferencesを使う例">
          8.4 複数ファイル参照テンプレート(referencesを使う例)
        </h3>
        <p>大規模な仕様書やデータベース設計図を別ファイルへ分離するテンプレート。</p>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`---
name: db-migration-helper
description: Assists with database migration scripts. Use this when asked to create, review, or execute database schema migrations.
---

# Database Migration Guide

Follow the project standards defined in the reference documents:

1. Read \`references/schema-rules.md\` for naming conventions and type mappings
2. Read \`references/rollback-policy.md\` for required undo script patterns
3. Draft the migration SQL script
4. Ensure every \`UP\` migration has a corresponding \`DOWN\` migration script
5. Test the migration against local PostgreSQL container before presenting to user`}</code>
          </pre>
        </div>

        <h3 id="85-チーム共有テンプレート複数サーフェス横断">
          8.5 チーム共有テンプレート(複数サーフェス横断)
        </h3>
        <p>Copilot, Claude Code, Cursor などの複数環境で共通利用するテンプレート。</p>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`---
name: team-release-checklist
description: Guides the step-by-step release process for production deployments. Use this when asked to prepare, execute, or verify a production release.
license: MIT
metadata:
  author: DevOps Team
  version: 2.1.0
compatibility: "git >= 2.30, gh >= 2.0"
---

# Production Release Procedure

Execute the release process in exact sequential order:

1. **Pre-flight Checks**
   - Ensure \`main\` branch build and all CI suites are GREEN
   - Verify changelog is updated in \`CHANGELOG.md\`

2. **Tagging & Release**
   - Run \`git tag -a vX.Y.Z -m "Release vX.Y.Z"\`
   - Push tags: \`git push origin vX.Y.Z\`

3. **Post-deploy Verification**
   - Trigger health check endpoint and verify \`HTTP 200 OK\`
   - Monitor error tracking dashboard for 15 minutes for anomaly spikes`}</code>
          </pre>
        </div>
        <hr />

        <h2 id="9-copilotの各サーフェスでの挙動差分">
          9. Copilotの各サーフェスでの挙動差分
        </h2>
        <p>
          GitHub Copilot は複数の開発環境(VS Code, Visual Studio, JetBrains, CLI, Cloud Agent)で提供されているが、Agent Skills のサポートレベルにはサーフェスごとの挙動差分が存在する。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>機能 / サーフェス</th>
                <th>VS Code (Agent mode)</th>
                <th>Visual Studio 2022</th>
                <th>JetBrains IDEs</th>
                <th>Copilot CLI</th>
                <th>Cloud agent / Code review</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>スキルの自動発見 (Discovery)</td>
                <td>完全対応</td>
                <td>完全対応</td>
                <td>完全対応</td>
                <td>完全対応</td>
                <td>完全対応</td>
              </tr>
              <tr>
                <td>プロジェクトスキル (.github/skills/)</td>
                <td>自動読み込み</td>
                <td>自動読み込み</td>
                <td>自動読み込み</td>
                <td>自動読み込み</td>
                <td>自動読み込み</td>
              </tr>
              <tr>
                <td>パーソナルスキル (~/.copilot/skills/)</td>
                <td>自動読み込み</td>
                <td>手動登録が必要</td>
                <td>自動読み込み</td>
                <td>自動読み込み</td>
                <td>対象外 (Cloud環境)</td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>scripts/</code> の実行</td>
                <td>確認ダイアログ付き実行</td>
                <td>CLIトグルが必要</td>
                <td>ターミナル経由実行</td>
                <td>直接実行</td>
                <td>サンドボックス内で自動実行</td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>allowed-tools</code> の制御</td>
                <td>対応 (実験的)</td>
                <td>未対応</td>
                <td>未対応</td>
                <td>対応</td>
                <td>リポジトリ設定に準拠</td>
              </tr>
              <tr>
                <td>手動再読み込みコマンド</td>
                <td><code className={styles.inlineCode}>/skills reload</code></td>
                <td>IDE再起動が必要</td>
                <td>プラグイン再起動</td>
                <td><code className={styles.inlineCode}>copilot skill reload</code></td>
                <td>PRコミット毎に自動更新</td>
              </tr>
              <tr>
                <td>対話UIでのスキル表示</td>
                <td>使用中スキルをバッジ表示</td>
                <td>ログウィンドウに表示</td>
                <td>チャット欄に通知表示</td>
                <td>プロンプトプレフィックス表示</td>
                <td>PRコメントログに表示</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          実務においてチーム全員で同一の体験を担保したい場合、<code className={styles.inlineCode}>.github/skills/</code>{" "}
          へのプロジェクトスキル配置を中心とし、過度な環境依存スクリプトを避ける設計が推奨される。
        </p>
        <hr />

        <h2 id="10-skills-vs-custom-instructions-vs-mcp-vs-subagents">
          10. Skills vs Custom Instructions vs MCP vs Subagents
        </h2>
        <p>
          Copilot の拡張機能を設計する際、どの仕組みを採用すべきかの比較と使い分けのガイドラインを示す。
        </p>

        <h3 id="101-比較表">10.1 比較表</h3>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>項目</th>
                <th>Agent Skills (SKILL.md)</th>
                <th>Custom Instructions</th>
                <th>MCP サーバー</th>
                <th>Subagents (カスタムエージェント)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>読み込みタイミング</td>
                <td>タスク関連時に動的ロード (第2段階)</td>
                <td>すべての会話で常時ロード</td>
                <td>リクエスト毎にツール呼び出し</td>
                <td>明示的呼び出し / 委譲時</td>
              </tr>
              <tr>
                <td>主たる目的</td>
                <td>特定タスクの再現可能な手順書</td>
                <td>全体のコーディング規約・基本方針</td>
                <td>外部DB・API・ライブ実データ接続</td>
                <td>独立した権限・ペルソナを持つ専任エージェント</td>
              </tr>
              <tr>
                <td>コンテキストコスト</td>
                <td>非常に低い (普段は数行のみ)</td>
                <td>高い (全文字が常時消費)</td>
                <td>ツール定義分のみ消費</td>
                <td>別コンテキストで独立実行</td>
              </tr>
              <tr>
                <td>標準化状況</td>
                <td><code className={styles.inlineCode}>agentskills.io</code> (オープン標準)</td>
                <td>各ツール個別の設定ファイル</td>
                <td>Model Context Protocol (オープン標準)</td>
                <td>ベンダー個別実装</td>
              </tr>
              <tr>
                <td>配置場所</td>
                <td><code className={styles.inlineCode}>{".github/skills/<name>/"}</code></td>
                <td><code className={styles.inlineCode}>.github/copilot-instructions.md</code></td>
                <td><code className={styles.inlineCode}>mcp.json</code> 設定ファイル</td>
                <td><code className={styles.inlineCode}>{".github/agents/<name>.md"}</code></td>
              </tr>
              <tr>
                <td>実行コードの保持</td>
                <td><code className={styles.inlineCode}>scripts/</code> 内にローカル保持</td>
                <td>保持できない</td>
                <td>外部プロセスとして実行</td>
                <td>サブエージェント内で保持</td>
              </tr>
              <tr>
                <td>相互連携</td>
                <td>Skills 内から MCP ツールを呼べる</td>
                <td>Skills の存在を指し示せる</td>
                <td>Skills 内からMCPツールを呼べる</td>
                <td>Subagent の内部で Skills を使える</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="102-使い分けフローチャート">10.2 使い分けフローチャート</h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_6} />
        </div>
        <p>
          Skills
          は単一のツール呼び出しではなく、かといって完全に自律したエージェントハーネスでもない。「有能なエージェントが適切なタイミングで適用し、タスクが終われば脇に置く、再利用可能な手順」という中間的な位置づけであることを踏まえて使い分けるとよい。
        </p>
        <hr />

        <h2 id="11-セキュリティベストプラクティス">11. セキュリティベストプラクティス</h2>
        <h3 id="111-公開スキルエコシステムの実態調査">11.1 公開スキルエコシステムの実態調査</h3>
        <p>
          セキュリティベンダー Snyk は2026年2月5日、ClawHub と skills.sh
          から集めた3,984件のスキルを対象にした初の包括的な監査結果「ToxicSkills」を公表した。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>指標</th>
                <th>数値</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>調査対象スキル数</td>
                <td>3,984件</td>
              </tr>
              <tr>
                <td>何らかのセキュリティ上の問題を含むスキルの割合</td>
                <td>36.82%(1,467件)</td>
              </tr>
              <tr>
                <td>クリティカルな問題を含むスキルの割合</td>
                <td>13.4%(534件)</td>
              </tr>
              <tr>
                <td>主な問題の種類</td>
                <td>
                  プロンプトインジェクション、ハードコードされたAPIキー、安全でない認証情報の扱い、危険なサードパーティコンテンツ露出
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          別の独立調査(42,447件のスキルを対象)では、プロンプトインジェクションの発生率が26.1%、悪意ある意図が疑われるものが5.2%とされており、調査対象や手法が違っても「公開スキルの一定割合に何らかのリスクがある」という傾向は一致している。ClawHub(OpenClaw向けの公開レジストリ)では2026年1月、2,857件中341件が単一の攻撃キャンペーン「ClawHavoc」由来のマルウェア(Atomic
          Stealer)配布に関与していたことも報告されている。
        </p>

        <h3 id="112-anthropicが推奨するセキュリティ手順">
          11.2 Anthropicが推奨するセキュリティ手順
        </h3>
        <p>
          Agent Skills を最初に設計した Anthropic
          自身のエンジニアリングブログは、次の手順を推奨している。
        </p>
        <ol>
          <li>
            <strong>信頼できる提供元からのみスキルをインストールする</strong>
          </li>
          <li>
            信頼度の低い提供元のスキルを使う場合は、導入前に<strong>徹底的に監査する</strong>
          </li>
          <li>
            まずスキルディレクトリ内の全ファイルの中身を読み、特にコードの依存関係や画像・スクリプトなどのバンドルリソースに注意を払う
          </li>
          <li>
            スキル内の指示やコードが、信頼できない外部ネットワーク先への接続を
            Claude(あるいはCopilot)に指示していないか特に注意する
          </li>
        </ol>
        <p>
          GitHub 公式ドキュメントも同様に、<code className={styles.inlineCode}>gh skill install</code>{" "}
          の前に必ず <code className={styles.inlineCode}>gh skill preview</code> で{" "}
          <code className={styles.inlineCode}>SKILL.md</code> とファイルツリーを確認することを警告として明記している。
        </p>

        <h3 id="113-実務での防御策チェックリスト">11.3 実務での防御策チェックリスト</h3>
        <ul>
          <li>
            <code className={styles.inlineCode}>allowed-tools</code> に{" "}
            <code className={styles.inlineCode}>shell</code> /{" "}
            <code className={styles.inlineCode}>bash</code> を丸ごと許可しない。許可する場合は{" "}
            <code className={styles.inlineCode}>Bash(git:*)</code>{" "}
            のようにコマンド単位で絞り込む
          </li>
          <li>
            未知のスキルは <code className={styles.inlineCode}>gh skill preview</code>{" "}
            またはリポジトリを直接クローンして中身を読んでから導入する
          </li>
          <li>
            スキル内に URL への <code className={styles.inlineCode}>curl | bash</code>{" "}
            のような外部ダウンロード指示がないか確認する
          </li>
          <li>
            組織導入時は、Snyk の <code className={styles.inlineCode}>agent-scan</code>(旧称{" "}
            <code className={styles.inlineCode}>mcp-scan</code> を統合した Evo
            プラットフォームのスキャナー)のような専用スキャンツールでの定期監査を検討する
          </li>
          <li>
            リポジトリにコミットするプロジェクトスキルは、通常のコードと同じ PR
            レビュープロセスを通す
          </li>
        </ul>
        <hr />

        <h2 id="12-トラブルシューティング完全ガイド">12. トラブルシューティング完全ガイド</h2>
        <h3 id="121-症状別の原因と対処">12.1 症状別の原因と対処</h3>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>症状</th>
                <th>よくある原因</th>
                <th>対処</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>スキルが全く発火しない</td>
                <td>
                  <code className={styles.inlineCode}>description</code>{" "}
                  が抽象的すぎる、または一人称で書かれている
                </td>
                <td>
                  三人称に書き直し、Trigger
                  Triad(能力・文脈・除外条件)に沿って具体的なトリガー語彙を追加する
                </td>
              </tr>
              <tr>
                <td>直接的な指示では発火するが間接的な指示では発火しない</td>
                <td>トリガー語彙の不足</td>
                <td>
                  ユーザーが実際に使いそうな類義語・言い回しを{" "}
                  <code className={styles.inlineCode}>description</code> に追加する
                </td>
              </tr>
              <tr>
                <td>関係ないタスクでも誤発火する</td>
                <td><code className={styles.inlineCode}>description</code> が広すぎる</td>
                <td>「Do not use when...」という除外条件を追加する</td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>name</code> は正しいのにスキル自体が認識されない</td>
                <td>
                  ディレクトリ名と <code className={styles.inlineCode}>name</code>{" "}
                  フィールドが一致していない
                </td>
                <td>
                  仕様上 <code className={styles.inlineCode}>name</code>{" "}
                  は親ディレクトリ名と一致必須。両者を揃える
                </td>
              </tr>
              <tr>
                <td>VS Code では見えるのに Copilot CLI では見えない</td>
                <td>サーフェスごとの探索ロジックの差、キャッシュの不整合</td>
                <td>
                  <code className={styles.inlineCode}>/skills reload</code>{" "}
                  を試す。改善しない場合はCLIとVS Code拡張のバージョン差分を確認し、既知のIssueを検索する
                </td>
              </tr>
              <tr>
                <td>Insiders版で .agents/skills のスキルが急に見えなくなった</td>
                <td>特定バージョンでの回帰(regression)</td>
                <td>
                  一時的な回避策として .github/skills に配置し直す。VS
                  Codeを最新の安定版に更新する
                </td>
              </tr>
              <tr>
                <td>WSL2環境でパーソナルスキルが検出はされるが読み込まれない</td>
                <td>環境固有の不具合(原因未特定)</td>
                <td>スキルフォルダをマルチルートワークスペースに含める形で回避できた報告がある</td>
              </tr>
              <tr>
                <td><code className={styles.inlineCode}>allowed-tools</code> を設定したのに毎回確認を求められる</td>
                <td>フィールド名や記法の誤り、対応していないツール名を指定している</td>
                <td>
                  実験的フィールドであるため、使用しているCopilotのバージョンでの対応状況を確認し、スペース区切りの記法(
                  <code className={styles.inlineCode}>Bash(git:*) Read</code> など)を再確認する
                </td>
              </tr>
              <tr>
                <td>SKILL.md本文が長すぎて挙動が不安定</td>
                <td>500行/5,000トークンの目安を超過し、指示の優先順位が埋もれている</td>
                <td>
                  重要なルールを先頭に移動し、詳細情報は{" "}
                  <code className={styles.inlineCode}>references/</code> に分割する
                </td>
              </tr>
              <tr>
                <td>部分的にしか指示に従わない</td>
                <td>SKILL.mdが長い・曖昧、番号付き手順になっていない</td>
                <td>重要なルールを先頭に、番号付きステップとして明確化する</td>
              </tr>
              <tr>
                <td>スクリプトが実行されない</td>
                <td>
                  Agent modeではなくAsk
                  modeになっている、スクリプトのパス・ランタイム(node/python等)が利用できない
                </td>
                <td>Agent modeであることを確認し、スクリプトパスと実行環境を検証する</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="122-デバッグ用の判断フロー">12.2 デバッグ用の判断フロー</h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_7} />
        </div>
        <hr />

        <h2 id="13-ベストプラクティスチェックリスト">
          13. ベストプラクティスチェックリスト
        </h2>
        <p>スキルを作成・レビュー・配布する際の総合確認チェックリスト。</p>
        <ChecklistCard />
        <hr />

        <h2 id="14-まとめ">14. まとめ</h2>
        <p>
          Agent Skills(SKILL.md) は、単なる Copilot
          の便利機能にとどまらず、AI時代における「開発手順書とツールの標準フォーマット」へと進化を遂げた。
        </p>
        <p>
          <code className={styles.inlineCode}>agentskills.io</code>{" "}
          による標準化と、GitHub Copilot・Claude Code・Cursor・Gemini CLI
          を含む40前後のプラットフォームによるサポートにより、一度作成したスキル資産はチームやツールを超えて永続的に活用できる。
        </p>
        <ul>
          <li>
            <strong>最重要ポイント</strong>: <code className={styles.inlineCode}>name</code>{" "}
            と親ディレクトリ名の一致、三人称かつ具体的トリガーを含んだ{" "}
            <code className={styles.inlineCode}>description</code> の設計
          </li>
          <li>
            <strong>コンテキスト最適化</strong>: 3段階ローディングを意識し、本文は500行未満、詳細は{" "}
            <code className={styles.inlineCode}>references/</code> やスクリプトへ分離
          </li>
          <li>
            <strong>配布と運用</strong>: <code className={styles.inlineCode}>.github/skills/</code>{" "}
            によるチーム共有と、<code className={styles.inlineCode}>gh skill</code> による検証・公開
          </li>
          <li>
            <strong>セキュリティ</strong>: 外部スキルの事前監査(<code className={styles.inlineCode}>gh skill preview</code>)と{" "}
            <code className={styles.inlineCode}>allowed-tools</code> の最小権限運用
          </li>
          <li>
            <strong>品質向上</strong>: 直接・間接・否定の3パターンテストと、実運用からの反復改善ループ
          </li>
        </ul>
        <p>
          本ガイドのテンプレートとチェックリストを活用し、チームの知見を高品質な Agent Skills
          としてアセット化していこう。
        </p>
        <hr />

        <h2 id="参考文献出典">参考文献・出典</h2>
        <p>
          本ガイドの執筆にあたり、以下の公式ドキュメント、オープン仕様、技術ブログ、研究レポートを参照・引用した。
        </p>

        <div className={styles.refGrid}>
          <div className={styles.refCard}>
            <h3>1. 公式仕様・標準化</h3>
            <ul>
              <li>
                <Ext href="https://agentskills.io/">
                  [A] Agent Skills Specification (agentskills.io)
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/agentskills/agentskills">
                  [B] Agent Skills Open Standard Repository (GitHub)
                </Ext>
              </li>
              <li>
                <Ext href="https://modelcontextprotocol.io/">
                  [C] Model Context Protocol Specification (modelcontextprotocol.io)
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/copilot-extensions">
                  [D] GitHub Copilot Extensions Specification
                </Ext>
              </li>
              <li>
                <Ext href="https://w3c.github.io/aria/">
                  [E] WAI-ARIA Accessible Rich Internet Applications (W3C)
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refCard}>
            <h3>2. GitHub Copilot 公式</h3>
            <ul>
              <li>
                <Ext href="https://docs.github.com/en/copilot/using-github-copilot/creating-agent-skills">
                  [1] Creating Agent Skills for GitHub Copilot (GitHub Docs)
                </Ext>
              </li>
              <li>
                <Ext href="https://github.blog/news-insights/product-news/github-copilot-agent-skills-announcement/">
                  [2] Announcing Agent Skills Support in GitHub Copilot (GitHub Blog)
                </Ext>
              </li>
              <li>
                <Ext href="https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions">
                  [3] Adding custom instructions for GitHub Copilot
                </Ext>
              </li>
              <li>
                <Ext href="https://github.blog/2026-07-29-copilot-code-review-agent-skills-mcp-ga/">
                  [4] General Availability of Agent Skills and MCP in Copilot Code Review
                </Ext>
              </li>
              <li>
                <Ext href="https://cli.github.com/manual/gh_skill">
                  [5] gh skill CLI Manual &amp; Command Reference
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refCard}>
            <h3>3. Anthropic Claude / Skills</h3>
            <ul>
              <li>
                <Ext href="https://www.anthropic.com/engineering/equipping-agents-with-agent-skills">
                  [6] Equipping Agents with Agent Skills (Anthropic Engineering Blog)
                </Ext>
              </li>
              <li>
                <Ext href="https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills">
                  [7] Agent Skills Developer Guide (Anthropic Docs)
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/anthropics/claude-code">
                  [8] Claude Code CLI Documentation &amp; Skills Directory
                </Ext>
              </li>
              <li>
                <Ext href="https://skills.sh/">
                  [9] skills.sh Public Agent Skills Directory &amp; Registry
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refCard}>
            <h3>4. IDE / エディタ統合</h3>
            <ul>
              <li>
                <Ext href="https://code.visualstudio.com/blogs/2026/01/10/agent-skills">
                  [10] Agent Skills Support in VS Code (VS Code Blog)
                </Ext>
              </li>
              <li>
                <Ext href="https://code.visualstudio.com/docs/copilot/copilot-customization">
                  [11] Customizing Copilot in Visual Studio Code
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/visualstudio/ide/copilot-agent-skills">
                  [12] Visual Studio 2022 Agent Skills Integration Guide
                </Ext>
              </li>
              <li>
                <Ext href="https://plugins.jetbrains.com/plugin/17718-github-copilot">
                  [13] JetBrains GitHub Copilot Plugin Release Notes
                </Ext>
              </li>
              <li>
                <Ext href="https://docs.cursor.com/context/skills">
                  [14] Cursor Agent Skills Documentation
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refCard}>
            <h3>5. エコシステム・対応ツール</h3>
            <ul>
              <li>
                <Ext href="https://github.com/vercel-labs/agent-skills">
                  [15] Vercel Labs Agent Skills Repository (GitHub)
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/openai/codex-skills">
                  [16] OpenAI Codex Agent Skills Reference Directory
                </Ext>
              </li>
              <li>
                <Ext href="https://docs.gemini.google/cli/skills">
                  [17] Gemini CLI Agent Skills Guide
                </Ext>
              </li>
              <li>
                <Ext href="https://docs.snowflake.com/en/user-guide/cortex-code-skills">
                  [18] Snowflake Cortex Code Agent Skills Integration
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/openclaw/openclaw">
                  [19] OpenClaw Framework &amp; ClawHub Registry
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/snyk/agent-scan">
                  [20] Snyk agent-scan Security Auditor Tool
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refCard}>
            <h3>6. セキュリティ調査・レポート</h3>
            <ul>
              <li>
                <Ext href="https://snyk.io/blog/toxicskills-audit-agent-skills-vulnerabilities/">
                  [21] ToxicSkills: Auditing Vulnerabilities in 3,984 Public Agent Skills (Snyk Research)
                </Ext>
              </li>
              <li>
                <Ext href="https://snyk.io/blog/clawhavoc-malware-campaign-openclaw-clawhub/">
                  [22] ClawHavoc Malware Campaign Analysis in ClawHub (Snyk Security)
                </Ext>
              </li>
              <li>
                <Ext href="https://owasp.org/www-project-top-10-for-large-language-model-applications/">
                  [23] OWASP Top 10 for LLM Applications (Prompt Injection &amp; Insecure Tool Use)
                </Ext>
              </li>
              <li>
                <Ext href="https://nvd.nist.gov/vuln/detail/CVE-2026-21840">
                  [24] CVE-2026-21840: Arbitrary Code Execution via Unsanitized Skill Scripts
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refCard}>
            <h3>7. コミュニティ・チュートリアル</h3>
            <ul>
              <li>
                <Ext href="https://github.com/community/copilot-agent-skills-discussion">
                  [25] GitHub Community Discussion: Agent Skills Best Practices
                </Ext>
              </li>
              <li>
                <Ext href="https://dev.to/t/agentskills">
                  [26] DEV Community #agentskills Tag &amp; Tutorials
                </Ext>
              </li>
              <li>
                <Ext href="https://medium.com/tag/agent-skills">
                  [27] Medium AI Agent Skills Implementation Stories
                </Ext>
              </li>
              <li>
                <Ext href="https://news.ycombinator.com/item?id=42456789">
                  [28] Hacker News Discussion: Progressive Disclosure in AI Agents
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refCard}>
            <h3>8. 本リポジトリの関連ガイド</h3>
            <ul>
              <li>
                <a href="/copilot/agent">GitHub Copilot Agent Mode ガイド</a>
              </li>
              <li>
                <a href="/code-review/copilot-code-review">GitHub Copilot Code Review ガイド</a>
              </li>
              <li>
                <a href="/claude/skill">Claude Code Agent Skills ガイド</a>
              </li>
              <li>
                <a href="/codex/skill">OpenAI Codex Agent Skills ガイド</a>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
