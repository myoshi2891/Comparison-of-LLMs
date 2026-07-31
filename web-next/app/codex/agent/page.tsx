import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import SidebarToggle from "./SidebarToggle";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "OpenAI Codex サブエージェント開発ベストプラクティス完全ガイド | LLM コスト計算機",
  description:
    "AGENTS.md・AGENTS.override.md・SKILL.md・config.toml・requirements.toml で構築するマルチエージェントワークフローの完全ガイド",
};

/**
 * Renders an external link that opens in a new browser tab.
 *
 * @param href - The destination URL
 * @param children - The link content
 */
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_1 = `flowchart TB
    A["~/.codex/AGENTS.override.md"] -->|"優先"| B["~/.codex/AGENTS.md"]
    B --> C["グローバル指示 確定"]
    C --> D["プロジェクトルート AGENTS.override.md / AGENTS.md"]
    D --> E["サブディレクトリ AGENTS.override.md / AGENTS.md"]
    E --> F["結合済みプロンプト（project_doc_max_bytesまで）"]
    G["config.toml / requirements.toml"] --> H["ランタイム挙動（承認方針・サンドボックス・モデル）"]
    I["SKILL.md"] --> J["能力の拡張（Progressive Disclosure）"]
    F --> K["Codex セッション開始"]
    H --> K
    J --> K
    K --> L["サブエージェントへ委譲（spawn_agent）"]`;

const DIAGRAM_4 = `sequenceDiagram
    participant U as Codex起動
    participant G as グローバルスコープ(~/.codex)
    participant P as プロジェクトルート
    participant S as サブディレクトリ(CWD)
    U->>G: AGENTS.override.md を検索
    G-->>U: なければ AGENTS.md を読込
    U->>P: AGENTS.override.md を検索
    P-->>U: なければ AGENTS.md / fallback を読込
    U->>S: 現在の作業ディレクトリまで同様に走査
    S-->>U: 各階層で最大1ファイルを採用
    U->>U: ルートから順に連結（空行区切り）
    Note over U: 近い階層のファイルほど後方に配置され優先度が高い`;

const DIAGRAM_5 = `flowchart TB
    A["CLIフラグ / -c key=value（セッション限定）"] --> E["合成された希望設定"]
    B["プロジェクトスコープ .codex/config.toml（ルート→CWD、信頼済みのみ）"] --> E
    C["プロファイル --profile 指定時の設定ファイル"] --> E
    D["ユーザースコープ ~/.codex/config.toml"] --> E
    E --> F["requirements.toml による検証（管理者施行の上限・強制値）"]
    F --> G["最終的な実行時設定"]`;

const DIAGRAM_10 = `flowchart LR
    A["メインエージェント（要件・意思決定）"] --> B["探索ノート・テストログ・コマンド出力が蓄積"]
    B --> C["コンテキスト汚染 Context Pollution"]
    C --> D["コンテキスト腐敗 Context Rot"]
    D --> E["応答品質の低下"]
    F["サブエージェントへ委譲"] --> G["ノイズの多い作業を分離"]
    G --> H["要約のみメインへ返却"]
    H --> A`;

const DIAGRAM_12 = `flowchart TB
    U["開発者のプロンプト：このブランチをレビューして"] --> M["メインCodexセッション"]
    M --> P1["pr_explorer（読み取り専用・コード調査）"]
    M --> P2["reviewer（正確性・セキュリティ・テスト）"]
    M --> P3["docs_researcher（MCP経由でAPI仕様確認）"]
    P1 --> R["各エージェントの結果を収集"]
    P2 --> R
    P3 --> R
    R --> S["メインエージェントが統合要約"]`;

const DIAGRAM_13 = `flowchart TB
    A["components.csv（path, owner）"] --> B["spawn_agents_on_csv"]
    B --> C["行ごとに1ワーカーを起動（max_concurrencyまで並列）"]
    C --> D["各ワーカーが report_agent_job_result を1回呼出"]
    D --> E["結果を output_csv_path へ集約（job_id, status, result_json）"]`;

const DIAGRAM_14 = `flowchart TB
    A["サブエージェントのタスク性質は？"] --> B{"曖昧・多段階・要検証？"}
    B -- Yes --> C["gpt-5.5（高能力の起点として推奨）"]
    B -- No --> D{"低遅延・大量の対話的反復が必要？"}
    D -- Yes --> E["gpt-5.3-codex-spark（Cerebras上で高速動作）"]
    D -- No --> F["gpt-5.4（安定版の既定ワークフロー）"]`;

/**
 * Renders a comprehensive Japanese guide to OpenAI Codex subagent development.
 */
export default function CodexAgentPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <SidebarToggle />
      <aside className={styles.sidebar} id="sidebar">
        <div className={styles.sidebarBrand}>
          OpenAI Codex <span>サブエージェント</span> ガイド
        </div>
        <div className={styles.sidebarSub}>
          AGENTS.md・config.toml・requirements.toml 実践ガイド
        </div>
        <nav>
          <ul className={styles.navList}>
            <li>
              <a href="#この記事の前提-requirementsmdについて一点補足" className={styles.navLink}>
                この記事の前提: 「REQUIREMENTS.md」について一点補足
              </a>
            </li>
            <li>
              <a href="#step-1-codex-エコシステム全体像" className={styles.navLink}>
                Step 1. Codex エコシステム全体像
              </a>
            </li>
            <li>
              <a href="#step-2-agentsmd--基本のプロジェクト指示ファイル" className={styles.navLink}>
                Step 2. AGENTS.md ― 基本のプロジェクト指示ファイル
              </a>
            </li>
            <li>
              <a href="#step-3-agentsoverridemd--一時的な上書きレイヤー" className={styles.navLink}>
                Step 3. AGENTS.override.md ― 一時的な上書きレイヤー
              </a>
            </li>
            <li>
              <a href="#step-4-発見順序とマージロジックの詳細" className={styles.navLink}>
                Step 4. 発見順序とマージロジックの詳細
              </a>
            </li>
            <li>
              <a href="#step-5-configtoml--階層構造とスコープ" className={styles.navLink}>
                Step 5. config.toml ― 階層構造とスコープ
              </a>
            </li>
            <li>
              <a href="#step-6-configtoml-の主要キーとスキーマ" className={styles.navLink}>
                Step 6. config.toml の主要キーとスキーマ
              </a>
            </li>
            <li>
              <a href="#step-7-requirementstoml--管理者施行の強制設定" className={styles.navLink}>
                Step 7. requirements.toml ― 管理者施行の強制設定
              </a>
            </li>
            <li>
              <a
                href="#step-8-skillmd--progressive-disclosure-によるスキル拡張"
                className={styles.navLink}
              >
                Step 8. SKILL.md ― Progressive Disclosure によるスキル拡張
              </a>
            </li>
            <li>
              <a href="#step-9-skills-運用のベストプラクティス" className={styles.navLink}>
                Step 9. Skills 運用のベストプラクティス
              </a>
            </li>
            <li>
              <a
                href="#step-10-subagents-の概念--コンテキスト汚染とコンテキスト腐敗"
                className={styles.navLink}
              >
                Step 10. Subagents の概念 ― コンテキスト汚染とコンテキスト腐敗
              </a>
            </li>
            <li>
              <a href="#step-11-カスタムサブエージェント定義ファイル" className={styles.navLink}>
                Step 11. カスタムサブエージェント定義ファイル
              </a>
            </li>
            <li>
              <a
                href="#step-12-マルチエージェントワークフロー設計パターン①-prレビューの3分割"
                className={styles.navLink}
              >
                Step 12. マルチエージェントワークフロー設計パターン①: PRレビューの3分割
              </a>
            </li>
            <li>
              <a
                href="#step-13-マルチエージェントワークフロー設計パターン②-csvファンアウト"
                className={styles.navLink}
              >
                Step 13. マルチエージェントワークフロー設計パターン②: CSVファンアウト
              </a>
            </li>
            <li>
              <a href="#step-14-モデルreasoning-effort-の選定指針" className={styles.navLink}>
                Step 14. モデル・reasoning effort の選定指針
              </a>
            </li>
            <li>
              <a
                href="#step-15-hooks-と-rulesexecpolicy-によるガバナンス"
                className={styles.navLink}
              >
                Step 15. Hooks と Rules(execpolicy) によるガバナンス
              </a>
            </li>
            <li>
              <a href="#step-16-実践チェックリスト" className={styles.navLink}>
                Step 16. 実践チェックリスト
              </a>
            </li>
            <li>
              <a href="#step-17-トラブルシューティング" className={styles.navLink}>
                Step 17. トラブルシューティング
              </a>
            </li>
            <li>
              <a href="#step-18-まとめ" className={styles.navLink}>
                Step 18. まとめ
              </a>
            </li>
            <li>
              <a href="#参考文献" className={styles.navLink}>
                参考文献
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>
            OpenAI Codex サブエージェント開発ベストプラクティス完全ガイド
          </h1>
          <p className={styles.heroSubtitle}>
            AGENTS.md・AGENTS.override.md・SKILL.md・config.toml・requirements.toml
            で構築するマルチエージェントワークフロー
          </p>
          <p className={styles.heroLine}>
            対象読者: Codex CLI / Codex Cloud を使ったチーム開発の経験がある中級〜上級エンジニア
          </p>
          <p className={styles.heroLine}>
            最終更新: 2026年7月29日時点の公式ドキュメント・コミュニティ記事に基づく
          </p>
        </div>

        <hr />
        <h2 id="この記事の前提-requirementsmdについて一点補足">
          この記事の前提: 「REQUIREMENTS.md」について一点補足
        </h2>
        <p>
          ご依頼の中で <code>REQUIREMENTS.md</code> という名称が挙がっていますが、Codex
          エコシステムに実在するのは{" "}
          <strong>
            <code>requirements.toml</code>
          </strong>
          （Markdown ではなく TOML 形式の管理者施行ファイル）です。本ガイドでは実際の仕様に忠実に{" "}
          <code>requirements.toml</code>{" "}
          として解説します。名前は近いものの、役割・書式・配置場所はまったく別物なので、移行時に検索して見つからず戸惑わないよう最初に明記しておきます。
        </p>
        <hr />

        <hr />
        <h2 id="step-1-codex-エコシステム全体像">Step 1. Codex エコシステム全体像</h2>
        <p>
          Codex
          の「設定・指示・能力拡張・実行制御」は、役割の異なる複数のファイル群によって階層的に構成されています。まず全体の関係を俯瞰します。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_1} />
        </div>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>ファイル</th>
                <th>役割</th>
                <th>書式</th>
                <th>主なスコープ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>AGENTS.md</code>
                </td>
                <td>エージェントへの恒久的な指示(規約・ワークフロー)</td>
                <td>Markdown</td>
                <td>ユーザー / プロジェクト / サブディレクトリ</td>
              </tr>
              <tr>
                <td>
                  <code>AGENTS.override.md</code>
                </td>
                <td>
                  同階層の <code>AGENTS.md</code> を完全に置き換える一時的な指示
                </td>
                <td>Markdown</td>
                <td>同上(各階層に1つだけ有効)</td>
              </tr>
              <tr>
                <td>
                  <code>SKILL.md</code>
                </td>
                <td>再利用可能な手順・スクリプト・参照資料をまとめた「スキル」</td>
                <td>Markdown + フォルダ</td>
                <td>ユーザー / プロジェクト / プラグイン</td>
              </tr>
              <tr>
                <td>
                  <code>config.toml</code>
                </td>
                <td>モデル・承認方針・サンドボックス・MCP・サブエージェントなどランタイム設定</td>
                <td>TOML</td>
                <td>システム / ユーザー / プロジェクト / プロファイル</td>
              </tr>
              <tr>
                <td>
                  <code>requirements.toml</code>
                </td>
                <td>管理者が強制するセキュリティ上限(ユーザーは上書き不可)</td>
                <td>TOML</td>
                <td>組織全体(MDM・クラウドポリシー・ファイルシステム配布)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          この5つは互いに独立した軸であり、「指示(何をすべきか)」「能力(何ができるか)」「実行制御(どこまで許可されるか)」の3層に分けて理解すると設計しやすくなります。
        </p>
        <hr />

        <h2 id="step-2-agentsmd--基本のプロジェクト指示ファイル">
          Step 2. AGENTS.md ― 基本のプロジェクト指示ファイル
        </h2>
        <p>
          <code>AGENTS.md</code>{" "}
          はプロジェクトやチームの規約・コーディングスタイル・テスト方法などをエージェントに伝える、Codex
          起動時に自動的に読み込まれる自然言語の指示ファイルです。特別なシステムAPIではなく、Codex
          が Markdown
          をそのままプロンプトの一部として注入する仕組みであるため、書き方は「新しいチームメンバー向けのオンボーディング資料」を書くのに近い感覚で構いません。
        </p>
        <p>実務上のベストプラクティス:</p>
        <ul>
          <li>
            <strong>短く、具体的に。</strong>{" "}
            一般論(「良いコードを書いてください」)ではなく、「このリポジトリでは{" "}
            <code>pnpm test</code> を実行する」「<code>src/legacy/</code>{" "}
            配下は変更禁止」のように、検証可能な具体指示に寄せる。
          </li>
          <li>
            <strong>強制力のあるインフラと組み合わせる。</strong> <code>AGENTS.md</code>{" "}
            に書いたルールは pre-commit
            フック・リンター・型チェッカーと組み合わせることで、エージェントが同じミスを繰り返さないよう「システム側で気づける」ようにする。
          </li>
          <li>
            <strong>グローバルとリポジトリで役割を分ける。</strong> <code>~/.codex/AGENTS.md</code>
            (グローバル)はレビューのトーンや詳細度などエージェントとの対話スタイルに、リポジトリの{" "}
            <code>AGENTS.md</code> はチーム・コードベース固有の規約に専念させる。
          </li>
        </ul>
        <hr />

        <h2 id="step-3-agentsoverridemd--一時的な上書きレイヤー">
          Step 3. AGENTS.override.md ― 一時的な上書きレイヤー
        </h2>
        <p>
          <code>AGENTS.override.md</code> は同じディレクトリにある <code>AGENTS.md</code> を
          <strong>完全に置き換える</strong>
          ための仕組みです。「一部だけ変更したい」場合の差分ファイルではなく、その階層で発見されると{" "}
          <code>AGENTS.md</code> は無視され、<code>override</code>{" "}
          ファイルの内容だけが採用されます。
        </p>
        <p>典型的な使いどころ:</p>
        <ul>
          <li>
            一時的な移行作業やインシデント対応中だけ、通常の規約(慎重な段階的コミットなど)を外して別の作業モードに切り替えたいとき
          </li>
          <li>
            CI 専用セッションや検証用ブランチなど、恒久的な <code>AGENTS.md</code>{" "}
            を書き換えずに一時的な挙動を注入したいとき
          </li>
          <li>
            個人のローカル環境だけ挙動を変えたいが、リポジトリにコミットする <code>AGENTS.md</code>{" "}
            は触りたくないとき(<code>.gitignore</code> に <code>AGENTS.override.md</code>{" "}
            を加えて個人用に運用)
          </li>
        </ul>
        <hr />

        <h2 id="step-4-発見順序とマージロジックの詳細">Step 4. 発見順序とマージロジックの詳細</h2>
        <p>
          Codex は <code>CODEX_HOME</code>(既定 <code>~/.codex</code>
          )のグローバル階層から、プロジェクトルートを経て現在の作業ディレクトリ(CWD)まで、ディレクトリを1段ずつ辿りながら指示ファイルを探索します。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_4} />
        </div>
        <p>補足として押さえておきたい設定キー:</p>
        <ul>
          <li>
            <strong>
              <code>project_doc_fallback_filenames</code>
            </strong>
            : <code>AGENTS.md</code>{" "}
            が見つからない階層で代わりに読み込むファイル名のリストを指定可能。既存の{" "}
            <code>README</code> や社内規約ファイル名をそのまま流用したい場合に使う。
          </li>
          <li>
            <strong>
              <code>project_doc_max_bytes</code>
            </strong>
            : 連結後の指示テキストの合計サイズ上限。大きすぎる <code>AGENTS.md</code>{" "}
            群は自動的に切り詰められるため、重要な指示ほどファイルの先頭近くに書く。
          </li>
          <li>
            <strong>
              <code>model_instructions_file</code>
            </strong>
            : <code>AGENTS.md</code>{" "}
            の自動読み込みそのものを別ファイルで完全に置き換えるための設定キー(旧名{" "}
            <code>experimental_instructions_file</code>{" "}
            は非推奨、新設定への移行が必要)。階層探索ロジックごと差し替える強力なオプションなので、通常は{" "}
            <code>AGENTS.md</code>/<code>AGENTS.override.md</code> の組み合わせで足りることが多い。
          </li>
        </ul>
        <hr />

        <h2 id="step-5-configtoml--階層構造とスコープ">Step 5. config.toml ― 階層構造とスコープ</h2>
        <p>
          <code>config.toml</code>{" "}
          はモデル選択・承認ポリシー・サンドボックスモード・MCPサーバー・サブエージェント上限など、Codex
          の<strong>振る舞い</strong>
          を決めるランタイム設定です。指示ファイル(AGENTS.md系)とは異なるレイヤーで、以下の順に解決されます。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_5} />
        </div>
        <p>実務上のポイント:</p>
        <ul>
          <li>
            プロジェクト直下の <code>.codex/config.toml</code> は、そのプロジェクトを{" "}
            <strong>trusted(信頼済み)</strong>{" "}
            と判断した場合のみ読み込まれます。未信頼のプロジェクトでは、プロジェクトスコープの
            config・hooks・rules は一切ロードされず、ユーザー / システムスコープのみが有効です。
          </li>
          <li>
            「プロジェクト設定が効かない」という相談の多くは、実は該当キーが
            <strong>プロジェクトスコープでは無視される予約キー</strong>(<code>model_provider</code>
            ・<code>notify</code>・<code>profile</code>{" "}
            など、認証やテレメトリに関わるもの)であるケースです。これらはユーザースコープの{" "}
            <code>~/.codex/config.toml</code> で設定する必要があります。
          </li>
          <li>
            <code>--profile profile-name</code> を指定すると{" "}
            <code>~/.codex/profile-name.config.toml</code> を読み込みます。共通設定は{" "}
            <code>config.toml</code>{" "}
            に、環境差分だけをプロファイルファイルに分離するのが推奨構成です。
          </li>
          <li>
            ファイル冒頭に{" "}
            <code>#:schema https://developers.openai.com/codex/config-schema.json</code>{" "}
            を書いておくと、対応エディタでキー補完とバリデーションが効きます。
          </li>
        </ul>
        <hr />

        <h2 id="step-6-configtoml-の主要キーとスキーマ">
          Step 6. config.toml の主要キーとスキーマ
        </h2>
        <p>中級〜上級者が実際に触ることになる主要キーを機能別に整理します。</p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>カテゴリ</th>
                <th>キー例</th>
                <th>概要</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>モデル</td>
                <td>
                  <code>model</code>, <code>review_model</code>, <code>model_reasoning_effort</code>
                  , <code>model_reasoning_summary</code>, <code>model_verbosity</code>
                </td>
                <td>既定モデル・レビュー専用モデル・reasoning の強度や要約詳細度</td>
              </tr>
              <tr>
                <td>プロバイダ</td>
                <td>
                  <code>model_provider</code>, <code>model_providers.&lt;id&gt;</code>
                </td>
                <td>
                  組み込み(<code>openai</code>/<code>ollama</code>/<code>lmstudio</code>
                  )以外の独自プロバイダ定義
                </td>
              </tr>
              <tr>
                <td>承認/サンドボックス</td>
                <td>
                  <code>approval_policy</code>, <code>sandbox_mode</code>,{" "}
                  <code>approval_policy.granular.*</code>
                </td>
                <td>
                  <code>untrusted</code>/<code>on-request</code>/<code>never</code>{" "}
                  などの承認方針と、<code>sandbox_approval</code>・<code>skill_approval</code>・
                  <code>mcp_elicitations</code> の粒度別トグル
                </td>
              </tr>
              <tr>
                <td>ネットワーク</td>
                <td>
                  <code>features.network_proxy</code>, <code>features.network_proxy.domains</code>
                </td>
                <td>ドメイン単位の allow/deny を伴うネットワークプロキシ機能</td>
              </tr>
              <tr>
                <td>サブエージェント</td>
                <td>
                  <code>agents.&lt;name&gt;.config_file</code>, <code>agents.max_depth</code>,{" "}
                  <code>agents.max_threads</code>, <code>features.multi_agent</code>
                </td>
                <td>
                  カスタムエージェント定義への参照、再帰の深さ・並列数の上限、マルチエージェント機能全体のオン/オフ
                </td>
              </tr>
              <tr>
                <td>Hooks</td>
                <td>
                  <code>[hooks]</code>(インライン)または <code>hooks.json</code>
                </td>
                <td>ライフサイクルフックの定義(後述)</td>
              </tr>
              <tr>
                <td>MCP</td>
                <td>
                  <code>mcp_servers.&lt;id&gt;</code>
                </td>
                <td>Model Context Protocol サーバーの登録</td>
              </tr>
              <tr>
                <td>その他</td>
                <td>
                  <code>file_opener</code>, <code>request_max_retries</code>,{" "}
                  <code>stream_max_retries</code>, <code>notify</code>, <code>otel</code>
                </td>
                <td>エディタ連携・リトライ・通知・テレメトリ</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          補足: <code>instructions</code> キーは将来のための予約で、実際には{" "}
          <code>model_instructions_file</code> または <code>AGENTS.md</code>{" "}
          を使うのが現行の正しい方法です。
        </p>
        <p>
          以下は、上記キーの一部を実際に組み合わせた <code>~/.codex/config.toml</code> の例です。
        </p>
        <div className={styles.codeBlock}>
          <div className={styles.codeBar}>
            <span>~/.codex/config.toml</span>
            <span className={styles.codeLang}>toml</span>
          </div>
          <div className={styles.codeBody}>
            <div className={styles.codeLine}>
              <span className={styles.cc}>
                #:schema https://developers.openai.com/codex/config-schema.json
              </span>
            </div>
            <div className={styles.codeLine}> </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>model</span> ={" "}
              <span className={styles.cs}>&quot;gpt-5.4&quot;</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>review_model</span> ={" "}
              <span className={styles.cs}>&quot;gpt-5.5&quot;</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>model_reasoning_effort</span> ={" "}
              <span className={styles.cs}>&quot;high&quot;</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>model_verbosity</span> ={" "}
              <span className={styles.cs}>&quot;medium&quot;</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>approval_policy</span> ={" "}
              <span className={styles.cs}>&quot;on-request&quot;</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>sandbox_mode</span> ={" "}
              <span className={styles.cs}>&quot;workspace-write&quot;</span>
            </div>
            <div className={styles.codeLine}> </div>
            <div className={styles.codeLine}>
              <span className={styles.ch}>[approval_policy.granular]</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>sandbox_approval</span> ={" "}
              <span className={styles.cm}>true</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>skill_approval</span> ={" "}
              <span className={styles.cm}>true</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>mcp_elicitations</span> ={" "}
              <span className={styles.ck}>false</span>
            </div>
            <div className={styles.codeLine}> </div>
            <div className={styles.codeLine}>
              <span className={styles.ch}>[agents]</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>max_depth</span> = <span className={styles.cv}>2</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>max_threads</span> = <span className={styles.cv}>4</span>
            </div>
            <div className={styles.codeLine}> </div>
            <div className={styles.codeLine}>
              <span className={styles.ch}>[agents.security_reviewer]</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>config_file</span> ={" "}
              <span className={styles.cs}>&quot;~/.codex/agents/security-reviewer.toml&quot;</span>
            </div>
            <div className={styles.codeLine}> </div>
            <div className={styles.codeLine}>
              <span className={styles.ch}>[features.network_proxy]</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>enabled</span> = <span className={styles.cm}>true</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>domains</span> = &#123;{" "}
              <span className={styles.cs}>&quot;api.github.com&quot;</span> ={" "}
              <span className={styles.cs}>&quot;allow&quot;</span>,{" "}
              <span className={styles.cs}>&quot;example.com&quot;</span> ={" "}
              <span className={styles.cs}>&quot;deny&quot;</span> &#125;
            </div>
          </div>
        </div>
        <hr />

        <h2 id="step-7-requirementstoml--管理者施行の強制設定">
          Step 7. requirements.toml ― 管理者施行の強制設定
        </h2>
        <p>
          <code>requirements.toml</code> は、個人やプロジェクトの <code>config.toml</code> では
          <strong>上書きできない</strong>
          、組織のセキュリティチームが強制する設定です。「ユーザーの利便性のための既定値」ではなく「絶対に譲れない下限・上限」を書く場所だと考えてください。
        </p>
        <p>主な特徴:</p>
        <ul>
          <li>
            クラウドポリシー、macOS/Windows の
            MDM(Jamf・Kandji・Mosyle等)、あるいは単純なファイル配布の3経路で組織全体に配布可能。
          </li>
          <li>
            例: <code>approval_policy = "never"</code> や{" "}
            <code>sandbox_mode = "danger-full-access"</code> を組織全体で禁止する、といった強制。
          </li>
          <li>
            併用される{" "}
            <strong>
              <code>managed_config.toml</code>
            </strong>{" "}
            は「ソフトな既定値」を配布するためのファイルで、ユーザーが必要なら上書きできる点が{" "}
            <code>requirements.toml</code> との決定的な違いです。「ハードな制約は{" "}
            <code>requirements.toml</code>、ソフトな既定値は <code>managed_config.toml</code>{" "}
            」という役割分担で覚えると混同しません。
          </li>
          <li>
            <code>[features]</code> テーブルを使うことで、<code>config.toml</code>{" "}
            と同じキー名でフィーチャーフラグそのものを固定できます(省略したキーは制約なし)。
          </li>
          <li>
            <code>allow_managed_hooks_only = true</code>{" "}
            を設定すると、ユーザー・プロジェクト・セッション単位の hooks を無視し、管理レイヤーの
            hooks のみを有効にできます。
          </li>
          <li>
            ChatGPT Business/Enterprise では、ローカルファイルに加えてクラウド側から取得した
            requirements も適用されます(優先順位はセキュリティドキュメントで規定)。
          </li>
        </ul>
        <hr />

        <h2 id="step-8-skillmd--progressive-disclosure-によるスキル拡張">
          Step 8. SKILL.md ― Progressive Disclosure によるスキル拡張
        </h2>
        <p>
          Skill は「フォルダ + <code>SKILL.md</code>(メタデータ)+
          必要に応じたスクリプトや参照資料」という構成を取り、Codex に
          <strong>再利用可能な手順</strong>を教える仕組みです。ポイントは{" "}
          <strong>Progressive Disclosure(段階的開示)</strong> というロード方式です。
        </p>
        <ul>
          <li>
            Codex は起動時、各スキルの<strong>説明(description)だけ</strong>を読み込みます。
          </li>
          <li>
            タスクに関連しそうだと判断したスキルについてのみ、<code>SKILL.md</code>{" "}
            の本文やスクリプト・参照資料をその都度ロードします。
          </li>
          <li>これにより、大量のスキルを登録してもコンテキストウィンドウを圧迫しません。</li>
        </ul>
        <p>配置場所と実行方式:</p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>実行方式</th>
                <th>概要</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ローカル実行(local shell)</td>
                <td>インフラを自前管理したい場合に、実行をローカル環境に閉じ込める</td>
              </tr>
              <tr>
                <td>ホスト型コンテナ実行</td>
                <td>
                  Codex
                  側が用意するコンテナで実行。コンテナのライフサイクルに合わせてマウントしたファイルも保持・破棄される
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          スキルが MCP サーバーに依存する場合は <code>agents/openai.yaml</code>{" "}
          にその依存関係を宣言しておくと、Codex が自動的にインストール・接続まで面倒を見てくれます。
        </p>
        <hr />

        <h2 id="step-9-skills-運用のベストプラクティス">Step 9. Skills 運用のベストプラクティス</h2>
        <p>
          公式ガイダンスが強調しているのは「スキルは開発者が事前に検証してから配布する」という原則です。
        </p>
        <ul>
          <li>
            スキルは開発者がレビュー・統合したうえで、
            <strong>特定のプロダクトワークフローに紐づけて</strong>エンドユーザーに提供する。
          </li>
          <li>
            エンドユーザーが任意のスキルを自由に選べる状態を避ける(スコープを絞ったUX経由でのみ呼び出す)。
          </li>
          <li>
            書き込みや影響範囲の大きい操作を行うスキルは、明示的な承認とポリシーチェックをゲートとして挟む。
          </li>
          <li>
            「一度きりの手順」は AGENTS.md
            の指示で十分な場合が多く、「繰り返し使う複雑な手順・スクリプト・参照資料が伴うもの」こそスキル化する価値がある、という使い分けが実務的です。
          </li>
          <li>
            社内で頻繁に使うスキルは<strong>プラグイン</strong>
            としてパッケージ化し、マーケットプレイス経由でチーム配布すると、hooks
            やスキルをまとめて一貫バージョンで展開できます。
          </li>
        </ul>
        <hr />

        <h2 id="step-10-subagents-の概念--コンテキスト汚染とコンテキスト腐敗">
          Step 10. Subagents の概念 ― コンテキスト汚染とコンテキスト腐敗
        </h2>
        <p>
          Subagents(サブエージェント)は 2026年3月16日に GA(一般提供)となった機能で、Codex は既定で{" "}
          <code>explorer</code>(調査系)・<code>worker</code>(バッチ処理系)・<code>default</code>{" "}
          という3種類の組み込みエージェントを持ちます。サブエージェントを使う最大の動機は、
          <strong>メインスレッドのコンテキストを汚さないこと</strong>です。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_10} />
        </div>
        <p>
          大きなタスクを1本のスレッドで処理し続けると、探索過程のログやコマンド出力が蓄積して
          <strong>コンテキスト汚染</strong>
          が起こり、それが進行すると関連情報が埋もれて応答品質が落ちる
          <strong>コンテキスト腐敗(Context Rot)</strong>
          につながります。サブエージェントは、ノイズの多い調査やバッチ作業を隔離したスレッドに切り出し、要約だけをメインへ返すことでこれを防ぎます。
        </p>
        <p>
          ただし無料ではありません。公式ドキュメントも警告している通り、サブエージェントは同等の単一エージェント実行より
          <strong>多くのトークンを消費</strong>します。著名な開発者 Simon Willison
          氏も、並列エージェント運用について「本当のボトルネックは自分がどれだけ速く結果をレビューできるかだ」という趣旨の指摘を自身のブログで行っており、オーケストレーションはタイピングの負荷をレビューの負荷に移すだけだと戒めています。設計時は「並列化すれば必ず速くなる」という前提を置かず、レビュー体制とセットで計画することが重要です。
        </p>
        <hr />

        <h2 id="step-11-カスタムサブエージェント定義ファイル">
          Step 11. カスタムサブエージェント定義ファイル
        </h2>
        <p>
          組み込みの3エージェントに加えて、<code>~/.codex/agents/</code> 配下に TOML
          ファイルを置くことで独自のサブエージェントを定義できます。名前を指定して呼び出せるほか、エージェントごとに異なるモデルを割り当てることも可能です(例:
          高速性を優先するなら <code>gpt-5.3-codex-spark</code> を指定するなど)。
        </p>
        <p>
          サブエージェントのオーケストレーションは Codex
          本体が受け持ち、次のような操作を内部的に扱います。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>操作</th>
                <th>概要</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>spawn_agent</code>
                </td>
                <td>新しいサブエージェントスレッドを起動</td>
              </tr>
              <tr>
                <td>
                  <code>send_input</code>
                </td>
                <td>起動済みのサブエージェントへ追加指示を送信</td>
              </tr>
              <tr>
                <td>
                  <code>resume_agent</code>
                </td>
                <td>中断していたサブエージェントを再開</td>
              </tr>
              <tr>
                <td>
                  <code>wait_agent</code>
                </td>
                <td>サブエージェントの完了を待機</td>
              </tr>
              <tr>
                <td>
                  <code>close_agent</code>
                </td>
                <td>サブエージェントのスレッドを終了</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <code>config.toml</code> 側では <code>agents.max_depth</code>
          (何段まで入れ子でサブエージェントを起動できるか)と <code>agents.max_threads</code>
          (同時並列数)で暴走を防ぎます。トリガーは特別なコマンドではなく自然言語で構いません。「レビュー観点ごとにエージェントを1つずつ立ち上げて、すべて完了したら結果をまとめて」と指示するだけで、Codex
          が複数スレッドを開いて集約します。
        </p>
        <p>
          <code>~/.codex/agents/security-reviewer.toml</code> の例:
        </p>
        <div className={styles.codeBlock}>
          <div className={styles.codeBar}>
            <span>~/.codex/agents/security-reviewer.toml</span>
            <span className={styles.codeLang}>toml</span>
          </div>
          <div className={styles.codeBody}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>name</span> ={" "}
              <span className={styles.cs}>&quot;security_reviewer&quot;</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>description</span> ={" "}
              <span className={styles.cs}>
                &quot;セキュリティ観点のみに特化した読み取り専用レビュー担当&quot;
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>model</span> ={" "}
              <span className={styles.cs}>&quot;gpt-5.5&quot;</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>model_reasoning_effort</span> ={" "}
              <span className={styles.cs}>&quot;high&quot;</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>sandbox_mode</span> ={" "}
              <span className={styles.cs}>&quot;read-only&quot;</span>
            </div>
            <div className={styles.codeLine}> </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>instructions</span> ={" "}
              <span className={styles.cs}>&quot;&quot;&quot;</span>
            </div>
            <div className={styles.codeLine}>
              あなたはセキュリティレビュー専任のサブエージェントです。
            </div>
            <div className={styles.codeLine}>
              認証・認可・シークレット管理・依存パッケージの既知脆弱性のみに焦点を当て、
            </div>
            <div className={styles.codeLine}>スタイルや命名規則には言及しないでください。</div>
            <div className={styles.codeLine}>
              <span className={styles.cs}>&quot;&quot;&quot;</span>
            </div>
          </div>
        </div>
        <hr />

        <h2 id="step-12-マルチエージェントワークフロー設計パターン①-prレビューの3分割">
          Step 12. マルチエージェントワークフロー設計パターン①: PRレビューの3分割
        </h2>
        <p>
          実務でよく使われる型の一つが、プルリクエストのレビューをコード探索・レビュー・外部仕様確認の3系統に分ける並列パターンです。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_12} />
        </div>
        <p>設計のコツ:</p>
        <ul>
          <li>
            <strong>役割ごとに読み書き権限を分ける。</strong>
            コード調査担当は読み取り専用サンドボックスに固定し、変更を加える担当だけ書き込み権限を持たせる。
          </li>
          <li>
            <strong>外部情報の検証は専任エージェントに。</strong>
            MCP経由でドキュメントや実サービスの仕様を突き合わせる作業は、コードレビューと混ぜずに独立させると、メインの思考が汚れません。
          </li>
          <li>
            <strong>集約は必ずメインエージェントが行う。</strong>
            各サブエージェントの結果をそのまま並べるのではなく、メインが矛盾点や優先度を踏まえて再統合することで、レビュー全体の一貫性を保ちます。
          </li>
        </ul>
        <hr />

        <h2 id="step-13-マルチエージェントワークフロー設計パターン②-csvファンアウト">
          Step 13. マルチエージェントワークフロー設計パターン②: CSVファンアウト
        </h2>
        <p>
          多数の小タスクを一括処理したい場合(例:
          リポジトリ内の全コンポーネントに同じ改修を適用する)は、CSVを起点にしたファンアウトパターンが有効です。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_13} />
        </div>
        <p>
          このパターンは <code>worker</code>{" "}
          系エージェントが得意とする領域で、CSVの行数分だけワーカーを起動し、
          <code>max_concurrency</code>{" "}
          で同時実行数を絞りつつ、各ワーカーが結果を1回だけ報告して指定した出力CSVに集約させます。大量の定型タスクをレビュー可能な単位に分割したいときの定番構成です。
        </p>
        <p>
          入力となる <code>components.csv</code> の最小例:
        </p>
        <div className={styles.codeBlock}>
          <div className={styles.codeBar}>
            <span>components.csv</span>
            <span className={styles.codeLang}>csv</span>
          </div>
          <div className={styles.codeBody}>
            <div className={styles.codeLine}>path,owner</div>
            <div className={styles.codeLine}>src/services/billing,team-payments</div>
            <div className={styles.codeLine}>src/services/auth,team-identity</div>
            <div className={styles.codeLine}>src/services/search,team-platform</div>
          </div>
        </div>
        <p>このCSVを渡す際のプロンプト例:</p>
        <div className={styles.codeBlock}>
          <div className={styles.codeBar}>
            <span>prompt.txt</span>
            <span className={styles.codeLang}>text</span>
          </div>
          <div className={styles.codeBody}>
            <div className={styles.codeLine}>
              components.csv の各行についてworkerサブエージェントを1つずつ起動し、
            </div>
            <div className={styles.codeLine}>max_concurrency=3で並列実行してください。</div>
            <div className={styles.codeLine}>
              各workerはpathの配下でdeprecated APIの呼び出しを検出し、
            </div>
            <div className={styles.codeLine}>report_agent_job_resultで結果を1回だけ報告し、</div>
            <div className={styles.codeLine}>最終的にresults.csvへ集約してください。</div>
          </div>
        </div>
        <hr />

        <h2 id="step-14-モデルreasoning-effort-の選定指針">
          Step 14. モデル・reasoning effort の選定指針
        </h2>
        <p>
          すべてのサブエージェントに同じモデルを割り当てる必要はありません。タスクの性質に応じて使い分けることで、コストと品質のバランスを取れます。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_14} />
        </div>
        <p>
          加えて <code>model_reasoning_effort</code>(例: <code>xhigh</code>)や{" "}
          <code>model_reasoning_summary</code>(<code>detailed</code>{" "}
          など)は、探索系のエージェントには高め、定型的なバッチワーカーには低めに設定するなど、エージェントごとの{" "}
          <code>config.toml</code> 参照(<code>agents.&lt;name&gt;.config_file</code>
          )で個別最適化するのが実務的です。モデル名やバリアントは頻繁に更新されるため、実際に指定する前に{" "}
          <code>codex models</code> や利用中のプロバイダのカタログで最新の識別子を確認してください。
        </p>
        <hr />

        <h2 id="step-15-hooks-と-rulesexecpolicy-によるガバナンス">
          Step 15. Hooks と Rules(execpolicy) によるガバナンス
        </h2>
        <p>
          サブエージェントを増やすほど、「何を承認なしで実行してよいか」の統制が重要になります。Codex
          にはこれを扱う2つの仕組みがあります。
        </p>
        <p>
          <strong>Hooks</strong>: <code>PermissionRequest</code> 型のフックでコマンド実行前に
          allow/deny を判定し、複数のフックが競合した場合は deny が優先されます。
          <code>PostToolUse</code> フックは Bash・<code>apply_patch</code>
          ・MCPツール呼び出しの後に発火しますが、まだ全てのシェル呼び出しを捕捉できるわけではない点(新しい{" "}
          <code>unified_exec</code> 系統は途上)には注意が必要です。プロジェクトローカルの hooks
          は、そのプロジェクトが信頼済みの場合のみ読み込まれます。
        </p>
        <p>
          <strong>Rules(execpolicy)</strong>: <code>.rules</code> ファイル(Starlark構文)で{" "}
          <code>
            prefix_rule(pattern=...,
            decision=&quot;allow&quot;|&quot;prompt&quot;|&quot;forbidden&quot;, justification=...)
          </code>{" "}
          を定義し、コマンドの引数列とパターンを照合します。複数ルールが一致した場合は最も制限の強い判定(
          <code>forbidden</code> &gt; <code>prompt</code> &gt; <code>allow</code>
          )が採用されます。
          <code>codex execpolicy check --rules &lt;file&gt; -- &lt;command&gt;</code>{" "}
          でルールの動作を事前検証できるため、大規模なサブエージェント運用を始める前にルールセットをテストしておくと安全です。管理者は{" "}
          <code>requirements.toml</code> から制限的な <code>prefix_rule</code>{" "}
          を強制することもできます。
        </p>
        <p>
          <code>~/.codex/rules/default.rules</code> の例:
        </p>
        <div className={styles.codeBlock}>
          <div className={styles.codeBar}>
            <span>~/.codex/rules/default.rules</span>
            <span className={styles.codeLang}>python</span>
          </div>
          <div className={styles.codeBody}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>prefix_rule</span>(
            </div>
            <div className={styles.codeLine}>
              {"  "}
              <span className={styles.cv}>pattern</span> = [
              <span className={styles.cs}>&quot;git&quot;</span>,{" "}
              <span className={styles.cs}>&quot;push&quot;</span>],
            </div>
            <div className={styles.codeLine}>
              {"  "}
              <span className={styles.cv}>decision</span> ={" "}
              <span className={styles.cs}>&quot;prompt&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {"  "}
              <span className={styles.cv}>justification</span> ={" "}
              <span className={styles.cs}>&quot;リモートへの反映は必ず人間の確認を挟む&quot;</span>,
            </div>
            <div className={styles.codeLine}>)</div>
            <div className={styles.codeLine}> </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>prefix_rule</span>(
            </div>
            <div className={styles.codeLine}>
              {"  "}
              <span className={styles.cv}>pattern</span> = [
              <span className={styles.cs}>&quot;rm&quot;</span>,{" "}
              <span className={styles.cs}>&quot;-rf&quot;</span>],
            </div>
            <div className={styles.codeLine}>
              {"  "}
              <span className={styles.cv}>decision</span> ={" "}
              <span className={styles.cs}>&quot;forbidden&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {"  "}
              <span className={styles.cv}>justification</span> ={" "}
              <span className={styles.cs}>
                &quot;破壊的削除は禁止。個別ファイル指定のrmを使うこと。&quot;
              </span>
              ,
            </div>
            <div className={styles.codeLine}>)</div>
            <div className={styles.codeLine}> </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>prefix_rule</span>(
            </div>
            <div className={styles.codeLine}>
              {"  "}
              <span className={styles.cv}>pattern</span> = [
              <span className={styles.cs}>&quot;gh&quot;</span>, [
              <span className={styles.cs}>&quot;pr&quot;</span>,{" "}
              <span className={styles.cs}>&quot;issue&quot;</span>], [
              <span className={styles.cs}>&quot;view&quot;</span>,{" "}
              <span className={styles.cs}>&quot;list&quot;</span>]],
            </div>
            <div className={styles.codeLine}>
              {"  "}
              <span className={styles.cv}>decision</span> ={" "}
              <span className={styles.cs}>&quot;allow&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {"  "}
              <span className={styles.cv}>justification</span> ={" "}
              <span className={styles.cs}>&quot;読み取り専用のgh操作は常に許可&quot;</span>,
            </div>
            <div className={styles.codeLine}>)</div>
          </div>
        </div>
        <p>検証コマンド:</p>
        <div className={styles.codeBlock}>
          <div className={styles.codeBar}>
            <span>shell</span>
            <span className={styles.codeLang}>bash</span>
          </div>
          <div className={styles.codeBody}>
            <div className={styles.codeLine}>codex execpolicy check --pretty \</div>
            <div className={styles.codeLine}>{"  "}--rules ~/.codex/rules/default.rules \</div>
            <div className={styles.codeLine}>{"  "}-- git push origin main</div>
          </div>
        </div>
        <hr />

        <h2 id="step-16-実践チェックリスト">Step 16. 実践チェックリスト</h2>
        <ul className={styles.taskList}>
          <li>
            <input type="checkbox" readOnly id="check-1" />
            <label htmlFor="check-1">
              <code>AGENTS.md</code>{" "}
              は検証可能な具体的ルールになっているか(抽象的な精神論になっていないか)
            </label>
          </li>
          <li>
            <input type="checkbox" readOnly id="check-2" />
            <label htmlFor="check-2">
              <code>AGENTS.override.md</code>{" "}
              を使う場合、それが「一時的な例外」であることをチーム内で共有できているか
            </label>
          </li>
          <li>
            <input type="checkbox" readOnly id="check-3" />
            <label htmlFor="check-3">
              <code>project_doc_max_bytes</code>{" "}
              を超えていないか、重要な指示が末尾で切り詰められていないか確認したか
            </label>
          </li>
          <li>
            <input type="checkbox" readOnly id="check-4" />
            <label htmlFor="check-4">
              <code>config.toml</code>{" "}
              の変更が想定のスコープ(ユーザー/プロジェクト/プロファイル)で効いているか、予約キーで無視されていないか
            </label>
          </li>
          <li>
            <input type="checkbox" readOnly id="check-5" />
            <label htmlFor="check-5">
              組織で譲れない制約(承認ポリシーやサンドボックスモードの下限)は{" "}
              <code>requirements.toml</code> に、単なる既定値は <code>managed_config.toml</code>{" "}
              に分離しているか
            </label>
          </li>
          <li>
            <input type="checkbox" readOnly id="check-6" />
            <label htmlFor="check-6">
              スキルはエンドユーザーが任意選択できる状態になっていないか、書き込み系スキルに承認ゲートがあるか
            </label>
          </li>
          <li>
            <input type="checkbox" readOnly id="check-7" />
            <label htmlFor="check-7">
              サブエージェントの並列度(<code>agents.max_threads</code>)と再帰深さ(
              <code>agents.max_depth</code>)に上限を設定しているか
            </label>
          </li>
          <li>
            <input type="checkbox" readOnly id="check-8" />
            <label htmlFor="check-8">
              マルチエージェント運用のレビュー体制(誰が・どれだけの頻度で結果をレビューするか)を並列化前に決めているか
            </label>
          </li>
          <li>
            <input type="checkbox" readOnly id="check-9" />
            <label htmlFor="check-9">
              <code>.rules</code> ファイルを <code>codex execpolicy check</code> で事前検証したか
            </label>
          </li>
        </ul>
        <hr />

        <h2 id="step-17-トラブルシューティング">Step 17. トラブルシューティング</h2>
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
                <td>
                  プロジェクトの <code>config.toml</code> が効かない
                </td>
                <td>
                  プロジェクトが untrusted 扱い、または予約キー(<code>model_provider</code>・
                  <code>notify</code>・<code>profile</code> 等)を使っている
                </td>
                <td>
                  プロジェクトを信頼済みにする/該当キーはユーザースコープの{" "}
                  <code>~/.codex/config.toml</code> に移す
                </td>
              </tr>
              <tr>
                <td>
                  <code>AGENTS.md</code> の指示が反映されない
                </td>
                <td>
                  同階層に <code>AGENTS.override.md</code> が存在し、そちらが優先されている
                </td>
                <td>override ファイルの有無を確認し、意図しないものであれば削除する</td>
              </tr>
              <tr>
                <td>指示の一部が無視されている</td>
                <td>
                  連結後の合計サイズが <code>project_doc_max_bytes</code> を超えて切り詰められている
                </td>
                <td>重要な指示をファイル先頭に移動する、または上限を引き上げる</td>
              </tr>
              <tr>
                <td>hooks が急に効かなくなった</td>
                <td>
                  <code>requirements.toml</code> の <code>allow_managed_hooks_only = true</code>{" "}
                  により、管理外の hooks が無効化されている
                </td>
                <td>管理者に確認し、必要な hooks を管理レイヤー側で登録してもらう</td>
              </tr>
              <tr>
                <td>サブエージェントがコストを消費しすぎる</td>
                <td>
                  並列度・再帰深さの上限が未設定、またはモデル選定が一律で高コストなものになっている
                </td>
                <td>
                  <code>agents.max_threads</code>/<code>agents.max_depth</code>{" "}
                  を設定し、探索系タスクには軽量なモデルを割り当てる
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr />

        <h2 id="step-18-まとめ">Step 18. まとめ</h2>
        <p>
          Codexのマルチエージェント開発は、「エージェントに何をすべきか教える層(AGENTS.md/override)」「繰り返し使える能力を教える層(SKILL.md)」「実行時の挙動を決める層(config.toml)」「組織として絶対に譲れない制約を敷く層(requirements.toml)」という4層構造で理解すると設計がぶれません。そのうえでサブエージェントは、コンテキスト汚染を防ぐための「隔離」の道具であり、並列化そのものが目的ではなく、レビュー体制とセットで初めて効果を発揮する点を忘れないことが、中級者から上級者へステップアップする際の分岐点になります。
        </p>
        <hr />

        <section id="参考文献">
          <h2>参考文献</h2>
          <ul className={styles.refList}>
            <li className={styles.refItem}>
              AGENTS.md 発見順序・階層仕様:{" "}
              <Ext href="https://developers.openai.com/codex/guides/agents-md">
                https://developers.openai.com/codex/guides/agents-md
              </Ext>
            </li>
            <li className={styles.refItem}>
              config.toml 基礎(階層・precedence):{" "}
              <Ext href="https://developers.openai.com/codex/config-basic">
                https://developers.openai.com/codex/config-basic
              </Ext>
            </li>
            <li className={styles.refItem}>
              config.toml 全キーリファレンス:{" "}
              <Ext href="https://developers.openai.com/codex/config-reference">
                https://developers.openai.com/codex/config-reference
              </Ext>
            </li>
            <li className={styles.refItem}>
              Advanced Configuration(予約キー・プロジェクトスコープの制約):{" "}
              <Ext href="https://learn.chatgpt.com/docs/config-file/config-advanced">
                https://learn.chatgpt.com/docs/config-file/config-advanced
              </Ext>
            </li>
            <li className={styles.refItem}>
              Subagents の概念(コンテキスト汚染・モデル選定指針):{" "}
              <Ext href="https://developers.openai.com/codex/concepts/subagents">
                https://developers.openai.com/codex/concepts/subagents
              </Ext>
            </li>
            <li className={styles.refItem}>
              Subagents のセットアップとツール一覧:{" "}
              <Ext href="https://developers.openai.com/codex/subagents">
                https://developers.openai.com/codex/subagents
              </Ext>
            </li>
            <li className={styles.refItem}>
              Skills(Progressive Disclosure・実行方式):{" "}
              <Ext href="https://developers.openai.com/codex/skills">
                https://developers.openai.com/codex/skills
              </Ext>
            </li>
            <li className={styles.refItem}>
              AGENTS.md と Skills / Subagents / MCP の使い分け:{" "}
              <Ext href="https://developers.openai.com/codex/concepts/customization">
                https://developers.openai.com/codex/concepts/customization
              </Ext>
            </li>
            <li className={styles.refItem}>
              Agent approvals &amp; security(承認粒度・ネットワークプロキシ):{" "}
              <Ext href="https://developers.openai.com/codex/agent-approvals-security">
                https://developers.openai.com/codex/agent-approvals-security
              </Ext>
            </li>
            <li className={styles.refItem}>
              Rules / execpolicy:{" "}
              <Ext href="https://developers.openai.com/codex/rules">
                https://developers.openai.com/codex/rules
              </Ext>
            </li>
            <li className={styles.refItem}>
              execpolicy README(Starlarkルールのサンプル):{" "}
              <Ext href="https://github.com/openai/codex/blob/main/codex-rs/execpolicy/README.md">
                https://github.com/openai/codex/blob/main/codex-rs/execpolicy/README.md
              </Ext>
            </li>
            <li className={styles.refItem}>
              Codex changelog(モデル世代・機能変遷):{" "}
              <Ext href="https://developers.openai.com/codex/changelog">
                https://developers.openai.com/codex/changelog
              </Ext>
            </li>
            <li className={styles.refItem}>
              requirements.toml / managed_config.toml の実践解説(Codex Knowledge Base):{" "}
              <Ext href="https://codex.danielvaughan.com/2026/04/27/codex-cli-enterprise-managed-configuration-requirements-toml-admin-policies/">
                https://codex.danielvaughan.com/2026/04/27/codex-cli-enterprise-managed-configuration-requirements-toml-admin-policies/
              </Ext>
            </li>
            <li className={styles.refItem}>
              Simon Willison「Use subagents and custom agents in
              Codex」(GA発表・組み込み3エージェント・カスタムTOML定義):{" "}
              <Ext href="https://simonwillison.net/2026/Mar/16/codex-subagents/">
                https://simonwillison.net/2026/Mar/16/codex-subagents/
              </Ext>
            </li>
            <li className={styles.refItem}>
              Firecrawl「Multi-Agent Orchestration With
              Codex」(PRレビュー3分割パターン、レビュー負荷への言及):{" "}
              <Ext href="https://www.firecrawl.dev/blog/codex-multi-agent-orchestration">
                https://www.firecrawl.dev/blog/codex-multi-agent-orchestration
              </Ext>
            </li>
            <li className={styles.refItem}>
              Codex CLI config.toml 実践解説(150以上のキーの整理):{" "}
              <Ext href="https://ofox.ai/blog/codex-cli-config-toml-deep-dive/">
                https://ofox.ai/blog/codex-cli-config-toml-deep-dive/
              </Ext>
            </li>
            <li className={styles.refItem}>
              Codex(AI agent)の機能・モデル世代の変遷(背景情報):{" "}
              <Ext href="https://en.wikipedia.org/wiki/Codex_(AI_agent)">
                https://en.wikipedia.org/wiki/Codex_(AI_agent)
              </Ext>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
