import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import { TocObserver } from "./TocObserver";

export const metadata: Metadata = {
  title: "GitHub Copilot AI仕様駆動開発 ベストプラクティスガイド",
  description:
    "copilot-instructions.md / .instructions.md / .prompt.md / .chatmode.md / .agent.md / SKILL.md / MCP / Plan Mode を、中級〜上級エンジニア向けにステップバイステップで解説します。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_0 = `flowchart TB
    subgraph AO["常時適用 (Always-on)"]
        A["Personal Instructions<br/>個人のユーザー設定"]
        B["Organization Instructions<br/>組織/Enterprise設定"]
        C["Repository Instructions<br/>copilot-instructions.md / AGENTS.md"]
        D[".instructions.md<br/>applyTo で条件付き適用"]
    end
    subgraph OD["呼び出し時のみ (On-demand)"]
        E[".prompt.md<br/>/コマンドで手動起動"]
        F[".agent.md（旧 .chatmode.md）<br/>役割・ツールセットを切替"]
        G["SKILL.md<br/>description との一致で自動ロード"]
    end
    subgraph EXT["外部連携 (External)"]
        H["MCP Servers<br/>ツール・データソースの接続"]
    end
    A --> M["1回のリクエストごとに<br/>Copilotがコンテキストを統合"]
    B --> M
    C --> M
    D --> M
    M --> E
    M --> F
    M --> G
    M --> H

    classDef purple fill:#2f2a52,stroke:#b6a6f0,color:#efe9fd;
    classDef teal fill:#113f3b,stroke:#7fd9c9,color:#e3faf5;
    classDef coral fill:#4a2620,stroke:#f0a688,color:#fbe4da;
    class A,B,C,D purple;
    class E,F,G teal;
    class H,M coral;`;

const DIAGRAM_1 = `flowchart TD
    Q1{"このルールは常に<br/>適用したいか?"}
    Q1 -->|"はい・リポジトリ全体"| R1["copilot-instructions.md<br/>または AGENTS.md"]
    Q1 -->|"はい・特定言語/ディレクトリのみ"| R2[".instructions.md<br/>applyTo で限定"]
    Q1 -->|"いいえ・手動で呼び出したい"| Q2{"再利用したいのは何か?"}
    Q2 -->|"定型プロンプト・単発タスク"| R3[".prompt.md<br/>/command"]
    Q2 -->|"AIの役割・使えるツール・モデル"| R4[".agent.md<br/>カスタムエージェント"]
    Q2 -->|"手順書・スクリプト付き専門知識"| R5["SKILL.md<br/>description一致で自動ロード"]
    Q1 -->|"外部システムのデータ/操作が必要"| R6["MCP サーバー"]

    classDef decision fill:#16233a,stroke:#47607f,color:#d7e0ec;
    classDef result fill:#113f3b,stroke:#7fd9c9,color:#e3faf5;
    class Q1,Q2 decision;
    class R1,R2,R3,R4,R5,R6 result;`;

const DIAGRAM_2 = `flowchart LR
    U["ユーザーが<br/>/explain-code と入力"] --> F["explain-code.prompt.md<br/>を読み込み"]
    F --> Ag["Agent modeで実行<br/>(frontmatterのagent/tools/modelに従う)"]
    Ag --> Out["結果を返す"]

    classDef purple fill:#2f2a52,stroke:#b6a6f0,color:#efe9fd;
    class U,F,Ag,Out purple;`;

const DIAGRAM_3 = `flowchart LR
    Old[".chatmode.md<br/>(旧: Custom Chat Modes)"] -->|"リネーム"| New[".agent.md<br/>(新: Custom Agents)"]
    New --> Loc[".github/agents/<br/>または ユーザープロファイル"]

    classDef coral fill:#4a2620,stroke:#f0a688,color:#fbe4da;
    classDef teal fill:#113f3b,stroke:#7fd9c9,color:#e3faf5;
    class Old coral;
    class New,Loc teal;`;

const DIAGRAM_4 = `flowchart TB
    L1["Level 1: Discovery<br/>全SKILL.mdの description だけを常時スキャン"] --> L2["Level 2: Instructions<br/>関連しそうなSKILL.md本文を読み込む"]
    L2 --> L3["Level 3: Resources<br/>スクリプト・参照資料・テンプレートを必要時にのみ読み込む"]

    classDef teal fill:#113f3b,stroke:#7fd9c9,color:#e3faf5;
    class L1,L2,L3 teal;`;

const DIAGRAM_5 = `flowchart TB
    S1["Explore and clarify<br/>読み取り専用ツールでコードベースを調査し、<br/>曖昧な点は質問する"] --> S2["Draft and refine<br/>詳細な実装計画を作成し、一緒にレビューする"]
    S2 --> S3["Edit the plan directly<br/>計画は .copilot/plans/plan-{title}.md<br/>として保存され、直接編集できる"]
    S3 --> S4["Implement<br/>『Implement plan』を押すまで<br/>コードは一切変更されない"]

    classDef purple fill:#2f2a52,stroke:#b6a6f0,color:#efe9fd;
    class S1,S2,S3,S4 purple;`;

const DIAGRAM_6 = `flowchart TB
    P1["1. プロトタイピング<br/>複数案をモックで比較する"] --> P2["2. Plan Mode<br/>/plan で要件を詰める・質問に答える"]
    P2 --> P3["3. Autopilot<br/>計画に沿って自律的に実装するループ"]
    P3 --> P4["4. 人間によるレビューと反復"]
    P4 --> P5["5. Rubber Duck Review<br/>別系統のモデルにセカンドオピニオンを求める"]
    P5 -->|"要修正"| P3
    P5 -->|"承認"| P6["6. コミット・PR作成"]

    classDef coral fill:#4a2620,stroke:#f0a688,color:#fbe4da;
    classDef teal fill:#113f3b,stroke:#7fd9c9,color:#e3faf5;
    class P1,P2,P3,P4,P5 coral;
    class P6 teal;`;

const DIAGRAM_7 = `flowchart LR
    C["constitution.md<br/>プロジェクトの<br/>非交渉的な原則"] --> S["/specify<br/>spec.md を生成"]
    S --> P["/plan<br/>plan.md（技術方針）を生成"]
    P --> T["/tasks<br/>tasks.md（実行可能な単位に分解）"]
    T --> I["/implement<br/>タスクごとに<br/>段階的にコード生成"]
    I --> Rev{"人間による<br/>チェックポイント"}
    Rev -->|"要修正"| P
    Rev -->|"承認"| Done["PR作成・マージ"]

    classDef purple fill:#2f2a52,stroke:#b6a6f0,color:#efe9fd;
    classDef gray fill:#16233a,stroke:#47607f,color:#d7e0ec;
    classDef teal fill:#113f3b,stroke:#7fd9c9,color:#e3faf5;
    class C,S,P,T,I purple;
    class Rev gray;
    class Done teal;`;

export default function MarkdownFileGuidePage() {
  return (
    <div className={styles.layout}>
      <button
        type="button"
        id="sidebarToggle"
        className={styles.sidebarToggle}
        aria-label="目次を開く"
        aria-expanded="false"
      >
        <i className="ti ti-menu-2" />
      </button>
      <div id="sidebarOverlay" className={styles.sidebarOverlay} />

      <aside id="sidebar" className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <i className="ti ti-brand-github-copilot" />
          <span>COPILOT SDD GUIDE</span>
        </div>
        <ul className={styles.sidebarNav}>
          <li>
            <a href="#overview" className={`${styles.navLink} ${styles.active}`}>
              <i className="ti ti-layout-dashboard" />
              <span>全体像</span>
            </a>
          </li>
          <li>
            <a href="#step-instructions" className={styles.navLink}>
              <i className="ti ti-file-text" />
              <span>Step 1: copilot-instructions.md</span>
            </a>
          </li>
          <li>
            <a href="#step-path-instructions" className={styles.navLink}>
              <i className="ti ti-git-branch" />
              <span>Step 2: .instructions.md / AGENTS.md</span>
            </a>
          </li>
          <li>
            <a href="#step-prompt-files" className={styles.navLink}>
              <i className="ti ti-terminal-2" />
              <span>Step 3: .prompt.md</span>
            </a>
          </li>
          <li>
            <a href="#step-custom-agents" className={styles.navLink}>
              <i className="ti ti-users-group" />
              <span>Step 4: .agent.md</span>
            </a>
          </li>
          <li>
            <a href="#step-skills" className={styles.navLink}>
              <i className="ti ti-puzzle" />
              <span>Step 5: SKILL.md</span>
            </a>
          </li>
          <li>
            <a href="#step-mcp" className={styles.navLink}>
              <i className="ti ti-plug-connected" />
              <span>Step 6: MCP</span>
            </a>
          </li>
          <li>
            <a href="#step-plan-mode" className={styles.navLink}>
              <i className="ti ti-route" />
              <span>Step 7: Plan Mode</span>
            </a>
          </li>
          <li>
            <a href="#sdd" className={styles.navLink}>
              <i className="ti ti-clipboard-list" />
              <span>Spec Kitと仕様駆動開発</span>
            </a>
          </li>
          <li>
            <a href="#security" className={styles.navLink}>
              <i className="ti ti-shield-check" />
              <span>セキュリティ</span>
            </a>
          </li>
          <li>
            <a href="#maturity" className={styles.navLink}>
              <i className="ti ti-trending-up" />
              <span>成熟度モデル</span>
            </a>
          </li>
          <li>
            <a href="#references" className={styles.navLink}>
              <i className="ti ti-books" />
              <span>参考文献</span>
            </a>
          </li>
        </ul>
      </aside>

      <main className={styles.content}>
        <header className={styles.hero}>
          <div className={styles.kicker}>
            <i className="ti ti-brand-github-copilot" />
            <span>GITHUB COPILOT / AI SPEC-DRIVEN DEVELOPMENT</span>
          </div>
          <h1>GitHub Copilot AI仕様駆動開発 ベストプラクティスガイド</h1>
          <p className={styles.lead}>
            copilot-instructions.md / .instructions.md / .prompt.md / .chatmode.md / .agent.md /
            SKILL.md / MCP / Plan Mode
            を、中級〜上級エンジニア向けにステップバイステップで解説します。
          </p>
          <div className={styles.metaRow}>
            <span>
              <i className="ti ti-users" />
              対象読者: 中級〜上級のソフトウェアエンジニア・AIエンジニア
            </span>
            <span>
              <i className="ti ti-calendar" />
              情報基準日: 2026年7月31日
            </span>
          </div>

          <div
            className={`${styles.callout} ${styles.calloutWarning}`}
            data-variant="warn"
            data-testid="callout-warn"
          >
            <i className="ti ti-alert-triangle" />
            <div>
              本ガイドで扱う機能の多くはプレビュー(public
              preview)段階であり、UI・ファイル配置・コマンド名は今後変更される可能性があります。特に「カスタムチャットモード」から「カスタムエージェント」への名称変更のように、記事執筆時点でも仕様が流動的な部分があるため、実装前に必ず本文末の参考文献で最新仕様を確認してください。
            </div>
          </div>
        </header>

        {/* Overview */}
        <section id="overview">
          <h2>
            <i className="ti ti-layout-dashboard" />
            全体像:Copilotのコンテキストはどう組み立てられるか
          </h2>
          <p>
            GitHub
            Copilotは1回のリクエストごとに、複数のレイヤーから集めた情報を統合してモデルに渡しています。これらのレイヤーを正しく使い分けることが、AI仕様駆動開発（Spec-Driven
            Development, SDD）の土台になります。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_0} />
          </div>

          <p>
            VS Codeの公式ドキュメントによれば、複数の指示が衝突した場合は「Personal
            instructions（個人設定）が最も優先され、その後 Repository instructions（
            <code>.github/copilot-instructions.md</code> または <code>AGENTS.md</code>
            ）、Organization
            instructions（組織設定）の順に適用される」とされています（GitHub.com上のCopilot
            Chatではこの優先順位が異なる場合があるため、利用面ごとに公式ドキュメントを確認してください）。
          </p>

          <p>以下は、どのファイル/機能をいつ使うべきかの判断フローです。</p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_1} />
          </div>

          <p>まずは全体像を俯瞰する一覧表です。</p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>機能</th>
                  <th>ファイル / 場所</th>
                  <th>スコープ</th>
                  <th>発動方法</th>
                  <th>主な用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Repository instructions</td>
                  <td>
                    <code>.github/copilot-instructions.md</code>
                  </td>
                  <td>リポジトリ全体</td>
                  <td>自動（常時）</td>
                  <td>技術スタック、ビルド/テスト手順、コーディング規約</td>
                </tr>
                <tr>
                  <td>Path-specific instructions</td>
                  <td>
                    <code>.github/instructions/*.instructions.md</code>
                  </td>
                  <td>
                    <code>applyTo</code> で指定したパス/言語のみ
                  </td>
                  <td>自動（条件付き）</td>
                  <td>言語別・ディレクトリ別の詳細ルール</td>
                </tr>
                <tr>
                  <td>AGENTS.md</td>
                  <td>
                    リポジトリルートの <code>AGENTS.md</code>
                  </td>
                  <td>リポジトリ全体（複数のAIツール共通）</td>
                  <td>自動（常時）</td>
                  <td>Copilot以外のエージェントとも共有する規約</td>
                </tr>
                <tr>
                  <td>Prompt files</td>
                  <td>
                    <code>.github/prompts/*.prompt.md</code>
                  </td>
                  <td>単発タスク</td>
                  <td>
                    手動（<code>/command</code>）
                  </td>
                  <td>定型作業をスラッシュコマンド化</td>
                </tr>
                <tr>
                  <td>Custom agents（旧Custom chat modes）</td>
                  <td>
                    <code>.github/agents/*.agent.md</code>
                  </td>
                  <td>セッション/タスク単位</td>
                  <td>手動（エージェント選択）</td>
                  <td>役割・ツールセット・モデルの切り替え</td>
                </tr>
                <tr>
                  <td>Agent Skills</td>
                  <td>
                    <code>.github/skills/&lt;name&gt;/SKILL.md</code>
                  </td>
                  <td>タスク単位</td>
                  <td>
                    自動（<code>description</code>一致で動的ロード）
                  </td>
                  <td>手続き的知識、スクリプト、テンプレートの束</td>
                </tr>
                <tr>
                  <td>MCP</td>
                  <td>
                    <code>.vscode/mcp.json</code> など
                  </td>
                  <td>ツール/データ接続</td>
                  <td>自動（Agent modeが解決）</td>
                  <td>外部システムとの連携</td>
                </tr>
                <tr>
                  <td>Plan Mode</td>
                  <td>機能（専用ファイル形式なし）</td>
                  <td>セッション単位</td>
                  <td>手動（モード切替）</td>
                  <td>実装前の要件確認・合意形成</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Step 1 */}
        <section id="step-instructions">
          <h2>
            <span className={styles.stepBadge}>1</span>
            copilot-instructions.md — リポジトリ全体のルール
          </h2>

          <h3>概要</h3>
          <p>
            <code>.github/copilot-instructions.md</code>{" "}
            は、リポジトリのルートに置く単一のMarkdownファイルです。VS
            Codeが自動検出し、そのワークスペース内のすべてのチャットリクエストに適用されます。Copilot
            Chat・Copilot coding agent・Copilot code reviewの全てが参照します。
          </p>

          <h3>ベストプラクティス</h3>
          <ul>
            <li>
              <strong>簡潔・具体的に書く</strong>: GitHub公式ブログの「5
              tips」でも、完璧を目指しすぎず「不完全な instructions
              ファイルでも、何も無いよりずっと良い」と述べられています。まず小さく始めて、ドキュメントのように継続的に更新するのが推奨されています。
            </li>
            <li>
              <strong>必ずコミットする</strong>:
              ローカルにしか無いファイルはチーム全体に効果がありません。リポジトリにコミットして初めて全員の環境で機能します。
            </li>
            <li>
              <strong>矛盾を避ける</strong>:
              実際のコードベースと矛盾する指示（例:「コールバックを使わない」と書いてあるのに実装の4割がコールバックを使っている）は、Copilotの出力を不安定にします。既存コードを整理するか、例外を明記しましょう。
            </li>
            <li>
              <strong>曖昧な指示を避ける</strong>:
              「良いコードを書いて」のような抽象的な指示ではなく、「観測可能でチェック可能なルール」を書くことが効果的だとされています。
            </li>
            <li>
              <strong>長すぎないようにする</strong>:
              指示ファイルが長大になりすぎる（目安として1000行超）と、Copilot code
              reviewなどの一部機能で挙動が不安定になることが報告されています。短く、見出しと箇条書きで構造化しましょう。
            </li>
            <li>
              <strong>自動生成を活用する</strong>: GitHub上のCopilot coding
              agentには、リポジトリを解析して <code>copilot-instructions.md</code>{" "}
              の叩き台を生成する機能があります。まずAIに生成させ、人間がレビュー・調整する流れが効率的です。
            </li>
            <li>
              <strong>動作確認する</strong>: VS CodeのCopilot Chatで「@github このプロジェクトの
              copilot-instructions.md
              にあるコーディング規約を要約して」のように尋ね、正確な要約が返ってくるかで読み込まれているか検証できます。
            </li>
          </ul>

          <h3>サンプル</h3>
          <pre className={styles.codeBlock}>
            <code>
              <div className={styles.codeLine}>
                <span className={styles.cm}># Project Guidelines</span>
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                This is a Go-based backend with a Ruby client for specific API endpoints.
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cm}>## Stack</span>
              </div>
              <div className={styles.codeLine}>
                - Language: Go 1.23 (backend), Ruby 3.3 (client SDK)
              </div>
              <div className={styles.codeLine}>- Test: go test ./... / bundle exec rspec</div>
              <div className={styles.codeLine}>- Lint: golangci-lint run</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cm}>## Conventions</span>
              </div>
              <div className={styles.codeLine}>- Prefer table-driven tests in Go.</div>
              <div className={styles.codeLine}>- All exported functions require doc comments.</div>
              <div className={styles.codeLine}>
                - Do not introduce new third-party HTTP clients; use the internal httpx wrapper.
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cm}>## Ask before assuming</span>
              </div>
              <div className={styles.codeLine}>
                If requirements are ambiguous, ask a clarifying question instead of guessing.
              </div>
            </code>
          </pre>
        </section>

        {/* Step 2 */}
        <section id="step-path-instructions">
          <h2>
            <span className={styles.stepBadge}>2</span>
            .instructions.md — パス限定ルールと AGENTS.md
          </h2>

          <h3>.instructions.md</h3>
          <p>
            リポジトリ全体ではなく「Pythonファイルのときだけ」「<code>src/api/</code>{" "}
            配下だけ」といった条件付きルールを与えたい場合は、<code>.github/instructions/</code>{" "}
            配下に <code>*.instructions.md</code> ファイルを作成します。YAMLフロントマターの{" "}
            <code>applyTo</code> フィールドでglobパターンを指定します。
          </p>

          <pre className={styles.codeBlock}>
            <code>
              <div className={styles.codeLine}>
                <span className={styles.ck}>---</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>applyTo</span>:{" "}
                <span className={styles.cs}>&quot;**/*.py&quot;</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>---</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cm}># Python Code Standards</span>
              </div>
              <div className={styles.codeLine}>- Use Python 3.11+ features</div>
              <div className={styles.codeLine}>- Follow PEP 8</div>
              <div className={styles.codeLine}>
                - Use type hints for all function parameters and returns
              </div>
              <div className={styles.codeLine}>- Prefer pathlib over os.path</div>
            </code>
          </pre>

          <pre className={styles.codeBlock}>
            <code>
              <div className={styles.codeLine}>
                <span className={styles.ck}>---</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>applyTo</span>:{" "}
                <span className={styles.cs}>&quot;src/api/**&quot;</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>---</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cm}># API Development Standards</span>
              </div>
              <div className={styles.codeLine}>- Use RESTful conventions</div>
              <div className={styles.codeLine}>- Return proper HTTP status codes</div>
              <div className={styles.codeLine}>- Validate all input data</div>
              <div className={styles.codeLine}>- Use async/await for database operations</div>
            </code>
          </pre>

          <p>
            <strong>使い分けの目安</strong>: まず単一の <code>copilot-instructions.md</code>{" "}
            でプロジェクト全体の規約から始め、フロントエンドとバックエンドで求めるスタイルが違う、認証やインフラなど特に慎重に扱いたい領域があるといった「差分」が出てきたタイミングで{" "}
            <code>.instructions.md</code> を追加していくのが実務上のおすすめです。
          </p>

          <h3>AGENTS.md との違い</h3>
          <p>
            似た名前の <code>AGENTS.md</code> は、GitHub
            Copilot専用ではなく、Codexやその他多くのAIコーディングツールが共通で読み込むオープンなフォーマットです。VS
            Codeも <code>AGENTS.md</code>{" "}
            をサポートしており、「複数のAIエージェントを併用するプロジェクトでは{" "}
            <code>AGENTS.md</code>、Copilot専用なら <code>copilot-instructions.md</code>
            」という使い分けが公式ドキュメントで案内されています。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>比較項目</th>
                  <th>copilot-instructions.md</th>
                  <th>AGENTS.md</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>対象ツール</td>
                  <td>GitHub Copilotファミリー</td>
                  <td>Copilot・Codexなど複数の対応ツール</td>
                </tr>
                <tr>
                  <td>位置づけ</td>
                  <td>Copilot向けの「常時適用ルール」</td>
                  <td>複数エージェント共通の「リポジトリのREADME」的存在</td>
                </tr>
                <tr>
                  <td>使い分けの目安</td>
                  <td>Copilotのみを使うチーム</td>
                  <td>複数のAIコーディングツールを併用するチーム</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            さらにややこしいのが、後述する <code>.agent.md</code>
            （カスタムエージェント）との混同です。開発者Hidde de
            Smetのブログ記事が端的にまとめている通り、<code>AGENTS.md</code>{" "}
            は「リポジトリの中でどう振る舞うべきか」を伝えるプロジェクトガイダンスであるのに対し、
            <code>.agent.md</code>{" "}
            は「プランナー」「セキュリティレビュアー」のような特定の役割（ペルソナ）を定義するカスタムエージェントのプロファイルです。名前は似ていますが役割は別物なので注意してください。
          </p>
        </section>

        {/* Step 3 */}
        <section id="step-prompt-files">
          <h2>
            <span className={styles.stepBadge}>3</span>
            .prompt.md — 再利用可能なスラッシュコマンド
          </h2>

          <h3>概要</h3>
          <p>
            Custom instructionsが「常に効くルール」であるのに対し、Prompt
            filesは「必要なときだけ手動で呼び出すタスクテンプレート」です。
            <code>.github/prompts/</code> 配下に <code>*.prompt.md</code> として保存すると、VS
            Code・Visual Studio・JetBrainsのCopilot Chatで <code>/ファイル名</code>{" "}
            と入力するだけで呼び出せます。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_2} />
          </div>

          <h3>フロントマター</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>フィールド</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>description</code>
                  </td>
                  <td>チャット入力欄にプレースホルダーとして表示される説明文</td>
                </tr>
                <tr>
                  <td>
                    <code>agent</code>（旧 <code>mode</code>）
                  </td>
                  <td>
                    実行時のエージェント種別（例: <code>agent</code>）
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>model</code>
                  </td>
                  <td>使用するモデル（未指定時はモデルピッカーの選択値）</td>
                </tr>
                <tr>
                  <td>
                    <code>tools</code>
                  </td>
                  <td>
                    利用可能なツール/ツールセット名のリスト（組み込みツール・MCPツール・拡張機能のツールを含む）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>サンプル</h3>
          <pre className={styles.codeBlock}>
            <code>
              <div className={styles.codeLine}>
                <span className={styles.ck}>---</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>description</span>:{" "}
                <span className={styles.cs}>&quot;Generate a new React form component&quot;</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>agent</span>: agent
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>tools</span>: [
                <span className={styles.cs}>&quot;search/codebase&quot;</span>]
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>---</span>
              </div>
              <div className={styles.codeLine}>
                Your goal is to generate a new React form component based on the templates
              </div>
              <div className={styles.codeLine}>
                in this repo&apos;s <code>src/components/forms</code> directory. Ask for the form
                name and
              </div>
              <div className={styles.codeLine}>fields if not provided.</div>
            </code>
          </pre>

          <p>計画レビューを強制したい場合の例（実装前に必ず計画を作らせるパターン）:</p>
          <pre className={styles.codeBlock}>
            <code>
              <div className={styles.codeLine}>
                <span className={styles.ck}>---</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>description</span>:{" "}
                <span className={styles.cs}>
                  &quot;Draft a step-by-step implementation plan before editing any files&quot;
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>agent</span>: agent
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>---</span>
              </div>
              <div className={styles.codeLine}>
                Before making any changes, draft a numbered implementation plan: the files
              </div>
              <div className={styles.codeLine}>
                you intend to touch, the reasoning for each change, and any risks. Ask
              </div>
              <div className={styles.codeLine}>
                clarifying questions if the request is ambiguous. Wait for explicit approval
              </div>
              <div className={styles.codeLine}>before editing.</div>
            </code>
          </pre>

          <p>
            VS Codeには <code>/create-prompt</code>{" "}
            というコマンドもあり、「やりたいことを説明するだけで、適切なfrontmatter付きの{" "}
            <code>.prompt.md</code>{" "}
            を自動生成してくれる」機能も用意されています。ゼロから書くよりも、まずAIに叩き台を作らせて調整する方が効率的です。
          </p>

          <p>
            <strong>「Prompt files / Custom agents / Skills、どれを使うべきか」の判断基準</strong>
            として、VS Code公式ドキュメントは「軽量で単発のタスクにはPrompt
            filesを、複雑なワークフローの自動化にはSkillsやCustom
            agentsを」という指針を示しています。
          </p>
        </section>

        {/* Step 4 */}
        <section id="step-custom-agents">
          <h2>
            <span className={styles.stepBadge}>4</span>
            .chatmode.md → .agent.md — カスタムエージェント
          </h2>

          <h3>重要な仕様変更</h3>
          <p>
            かつて「Custom Chat Modes」と呼ばれ <code>.chatmode.md</code>{" "}
            ファイルで定義されていた機能は、VS Code公式ドキュメントの記載によれば
            <strong>
              「Custom Agents」に名称変更され、ファイル拡張子も <code>.agent.md</code>{" "}
              に変わりました
            </strong>
            。機能自体は同じですが、用語とファイル形式が更新されています。既存の{" "}
            <code>.chatmode.md</code> ファイルは、<code>.agent.md</code> にリネームして所定の場所（
            <code>chat.agentFilesLocations</code> で設定するディレクトリ、リポジトリでは典型的に{" "}
            <code>.github/agents/</code>）に置き直すことで引き続き利用できます。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_3} />
          </div>

          <h3>何のためのファイルか</h3>
          <p>
            Custom
            agentsは「読み取り専用ツールしか使えないPlanning用エージェント」「ファイル編集もできるImplementation用エージェント」のように、
            <strong>タスクごとに使えるツール・モデル・振る舞いを切り替える</strong>
            ための仕組みです。ローカルのAgent
            modeだけでなく、バックグラウンド実行のクラウドエージェントでも同じ設定を再利用できます。
          </p>

          <h3>フロントマター</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>フィールド</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>description</code>
                  </td>
                  <td>エージェント選択時に表示される説明</td>
                </tr>
                <tr>
                  <td>
                    <code>tools</code>
                  </td>
                  <td>利用可能なツール（YAML配列）</td>
                </tr>
                <tr>
                  <td>
                    <code>model</code>
                  </td>
                  <td>使用モデル（未指定時はモデルピッカーの選択値）</td>
                </tr>
                <tr>
                  <td>
                    <code>handoffs</code>
                  </td>
                  <td>
                    応答完了後に提案される「次の一手」（別のエージェント/プロンプトへの引き継ぎボタン）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            VS Codeは <code>.github/agents/*.agent.md</code> に加え、<code>.claude/agents/</code>{" "}
            配下のClaude Code形式（サブエージェント）の <code>.md</code>{" "}
            ファイルも自動認識します。Claude形式のカンマ区切りツール指定は、VS
            Code用のツール名に自動マッピングされるため、
            <strong>同じエージェント定義をVS CodeとClaude Codeで共有できる</strong>
            という互換性が確保されています。
          </p>

          <h3>サンプル: プランニング専用エージェント</h3>
          <pre className={styles.codeBlock}>
            <code>
              <div className={styles.codeLine}>
                <span className={styles.ck}>---</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>description</span>:{" "}
                <span className={styles.cs}>
                  &quot;Explore the codebase and draft a plan. Never edit files directly.&quot;
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>tools</span>: [
                <span className={styles.cs}>&quot;search/codebase&quot;</span>,{" "}
                <span className={styles.cs}>&quot;readFile&quot;</span>]
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>model</span>: Claude Sonnet
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>---</span>
              </div>
              <div className={styles.codeLine}>
                You are a planning specialist. Investigate the codebase using read-only
              </div>
              <div className={styles.codeLine}>
                tools, identify open questions, and produce a numbered implementation plan.
              </div>
              <div className={styles.codeLine}>
                Do not edit or create files. Hand off to the implementation agent once the
              </div>
              <div className={styles.codeLine}>plan is approved.</div>
            </code>
          </pre>
        </section>

        {/* Step 5 */}
        <section id="step-skills">
          <h2>
            <span className={styles.stepBadge}>5</span>
            SKILL.md — Agent Skills(手続き的知識)
          </h2>

          <h3>概要</h3>
          <p>
            SKILL.mdは、Anthropicが提唱し <code>agentskills.io</code>{" "}
            としてオープン仕様化された形式で、GitHub Copilotだけでなく Claude Code・Cursor・Codex
            CLIなど複数のエージェントで共通して読み込める「再利用可能な手続き的知識のパッケージ」です。GitHub公式ドキュメントも「Agent
            Skills is an open standard, used by a range of different agents」と明記しています。
          </p>

          <h3>Instructions(常時適用)との違い</h3>
          <ul>
            <li>
              <code>copilot-instructions.md</code> / <code>.instructions.md</code> は
              <strong>常時適用される「あるべき論」</strong>（コーディング規約など）
            </li>
            <li>
              SKILL.mdは
              <strong>特定のタスクが来たときだけオンデマンドでロードされる「専門的な手順」</strong>
              （スクリプトやテンプレート付きの実行手順）
            </li>
          </ul>
          <p>
            この違いにより、多数のスキルをインストールしてもコンテキストウィンドウを圧迫しない設計になっています。これを実現する仕組みが
            <strong>Progressive Disclosure（段階的開示）</strong>です。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_4} />
          </div>

          <h3>ディレクトリ構成</h3>
          <pre className={styles.codeBlock}>
            <code>
              <div className={styles.codeLine}>your-repo/</div>
              <div className={styles.codeLine}>└── .github/</div>
              <div className={styles.codeLine}>{"    "}└── skills/</div>
              <div className={styles.codeLine}>{"        "}└── webapp-testing/</div>
              <div className={styles.codeLine}>
                {"            "}├── SKILL.md
                <span className={styles.cc}>{"        "}# 必須: メタデータ + 手順</span>
              </div>
              <div className={styles.codeLine}>
                {"            "}├── scripts/
                <span className={styles.cc}>{"        "}# 任意: 実行可能なスクリプト</span>
              </div>
              <div className={styles.codeLine}>
                {"            "}├── references/
                <span className={styles.cc}>{"     "}# 任意: 参照ドキュメント</span>
              </div>
              <div className={styles.codeLine}>
                {"            "}└── assets/
                <span className={styles.cc}>{"         "}# 任意: テンプレート・リソース</span>
              </div>
            </code>
          </pre>

          <p>
            プロジェクト固有のスキルは <code>.github/skills</code>（または{" "}
            <code>.claude/skills</code>、<code>.agents/skills</code>）に、個人用の横断的なスキルは{" "}
            <code>~/.copilot/skills</code>（または <code>~/.agents/skills</code>）に置きます。
          </p>

          <h3>SKILL.mdのサンプル</h3>
          <pre className={styles.codeBlock}>
            <code>
              <div className={styles.codeLine}>
                <span className={styles.ck}>---</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>name</span>: webapp-testing
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>description</span>: &gt;-
              </div>
              <div className={styles.codeLine}>
                {"  "}Assists with web application test strategies and automated test creation.
              </div>
              <div className={styles.codeLine}>
                {"  "}Use when the user asks about testing, test coverage, or writing E2E tests.
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>---</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cm}>## Procedure</span>
              </div>
              <div className={styles.codeLine}>
                1. Analyze the target code and determine the appropriate testing strategy.
              </div>
              <div className={styles.codeLine}>
                2. Create test files following the Arrange-Act-Assert (AAA) pattern.
              </div>
              <div className={styles.codeLine}>3. Run the tests and report the results.</div>
            </code>
          </pre>

          <h3>description の書き方が命</h3>
          <p>
            Copilotは、ユーザーの発言と各SKILL.mdの <code>description</code>{" "}
            フィールドを照合して、どのスキルをロードするか判断します。「レビューして」「バグを見つけて」など
            <strong>複数の言い回しを想定した具体的な description</strong>
            を書くことが、意図通りにスキルを発火させるコツです。GitHub公式のAgent
            Skillsガイドでも、Anthropic発の <code>skill-creator</code>{" "}
            スキルを使ってスキル自体をAIに生成させる方法が紹介されています（
            <code>anthropics/skills</code> リポジトリで公開）。
          </p>
        </section>

        {/* Step 6 */}
        <section id="step-mcp">
          <h2>
            <span className={styles.stepBadge}>6</span>
            MCP — 外部ツール・データソースとの接続
          </h2>

          <h3>概要</h3>
          <p>
            Model Context
            Protocol（MCP）は、LLMアプリケーションが外部のツールやデータソースとやり取りするためのオープンな標準規格です。VS
            Codeでは <code>.vscode/mcp.json</code>{" "}
            をリポジトリにコミットすることで、チーム全員がそのMCPサーバーを共有できます。
          </p>

          <h3>設定ファイルの注意点</h3>
          <pre className={styles.codeBlock}>
            <code>
              <div className={styles.codeLine}>{"{"}</div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.ck}>&quot;servers&quot;</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.ck}>&quot;github&quot;</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {"      "}
                <span className={styles.ck}>&quot;type&quot;</span>:{" "}
                <span className={styles.cs}>&quot;http&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"      "}
                <span className={styles.ck}>&quot;url&quot;</span>:{" "}
                <span className={styles.cs}>&quot;https://api.githubcopilot.com/mcp/&quot;</span>
              </div>
              <div className={styles.codeLine}>
                {"    "}
                {"}"},
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.ck}>&quot;playwright&quot;</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {"      "}
                <span className={styles.ck}>&quot;command&quot;</span>:{" "}
                <span className={styles.cs}>&quot;npx&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"      "}
                <span className={styles.ck}>&quot;args&quot;</span>: [
                <span className={styles.cs}>&quot;-y&quot;</span>,{" "}
                <span className={styles.cs}>&quot;@playwright/mcp@latest&quot;</span>]
              </div>
              <div className={styles.codeLine}>
                {"    "}
                {"}"}
              </div>
              <div className={styles.codeLine}>
                {"  "}
                {"}"}
              </div>
              <div className={styles.codeLine}>{"}"}</div>
            </code>
          </pre>

          <p>
            ルートキーは{" "}
            <strong>
              <code>servers</code>
            </strong>{" "}
            です。Cursor や Claude Desktop の設定ファイルでは <code>mcpServers</code>{" "}
            が使われているため、他ツールの設定をそのままコピー&amp;ペーストすると動かないというのが「よくある設定ミス」として複数の解説記事で指摘されています。
          </p>

          <h3>トランスポートの種類</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>トランスポート</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>stdio</code>
                  </td>
                  <td>ローカルのサブプロセスとして起動する標準的なMCP方式。多くのサーバーが採用</td>
                </tr>
                <tr>
                  <td>
                    <code>http</code>（Streamable HTTP）
                  </td>
                  <td>リモートエンドポイントに接続する現行の推奨方式</td>
                </tr>
                <tr>
                  <td>
                    <code>sse</code>
                  </td>
                  <td>レガシーなServer-Sent Events方式。MCP仕様上は非推奨だが後方互換のため対応</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Agent
            modeでのみMCPツールは有効になり、AskモードやEditモードでは利用できない点にも注意してください。
          </p>

          <h3>利用範囲</h3>
          <p>
            MCPはVS Codeだけでなく、Copilot CLI・Copilot cloud agent・Copilot code review・GitHub
            Copilotアプリなど、Copilotファミリー全体で利用可能です。ただし、CLIの設定ファイル形式はVS
            Codeの <code>.vscode/mcp.json</code>{" "}
            とは別物なので、CLIでMCPを使う場合は専用の設定手順を公式ドキュメントで確認してください。組織/Enterpriseプランでは「MCP
            servers in Copilot」ポリシーが既定で無効になっているため、管理者による有効化が必要です。
          </p>
        </section>

        {/* Step 7 */}
        <section id="step-plan-mode">
          <h2>
            <span className={styles.stepBadge}>7</span>
            Plan Mode — 実装前に合意形成する
          </h2>

          <h3>なぜPlan Modeが必要か</h3>
          <p>
            エージェントに大きめのタスクを依頼すると「気づいたら大量のファイルが書き換わっていて、それは望んでいた実装ではなかった」という失敗が起きやすいものです。Plan
            Modeは、
            <strong>
              コードを一切変更せずに、読み取り専用ツールで調査・質問・計画立案だけを行うモード
            </strong>
            です。
          </p>

          <p>
            Visual Studioには2026年5月に専用の「Plan
            agent」が導入されました。公式ブログによれば、その流れは次の通りです。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_5} />
          </div>

          <p>
            計画は自動的にMarkdownファイルとして保存されるため、そのままチームにレビュー共有したり、Gitで履歴管理したりできます。
          </p>

          <h3>実践例: Burke Hollandの「ハーネス」ワークフロー</h3>
          <p>
            GitHub公式ブログ（2026年7月27日、著者Burke
            Holland）で紹介されている実践的なワークフローは、Plan
            Modeを中心に据えたステップです。派手なツールや秘伝のプロンプトではなく、「ハーネス（Copilotそのもの）を理解して使いこなすこと」こそが生産性向上の鍵だと述べられています。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_6} />
          </div>

          <p>ポイントは次の通りです。</p>
          <ul>
            <li>
              <strong>プロトタイピングを軽視しない</strong>:
              「日付ピッカーを20パターンモックアップして」のように、実装前にビジュアルで比較することで、テキストだけでは気づけない要求の細部（年→月→日とズームする体験など）が見えてきます。
            </li>
            <li>
              <strong>Plan Modeでは提案を鵜呑みにしない</strong>:
              計画立案の価値は「AIの提案を全部受け入れること」ではなく、「人間が深く関与し、モデルを導くこと」にあります。Matt
              Pocockが公開している <code>grill-me</code> という追加スキルを組み合わせる（
              <code>/plan /grill-me ...</code>
              ）と、より突っ込んだ質問をエージェントにさせることもできます。
            </li>
            <li>
              <strong>Autopilotは「計画を守らせるループ」</strong>:
              計画の各項目を実際にやり遂げたかを確認しながら実行を続ける仕組みで、単純な自動実行とは異なります。
            </li>
            <li>
              <strong>Rubber Duck Reviewは別モデル系統によるレビュー</strong>:
              例えばGPT系で実装した場合はClaude系にレビューを依頼するなど、学習データや癖の異なるモデル同士でクロスチェックすることで見落としを減らせます。
            </li>
          </ul>
          <p>
            同記事は「今日の魔法のようなテクニックも、明日にはアンチパターンになりうる。ハーネスを理解していればそれで十分」と結んでおり、機能を追いかけすぎず基本のワークフローを固めることの重要性を強調しています。
          </p>
        </section>

        {/* SDD */}
        <section id="sdd">
          <h2>
            <i className="ti ti-clipboard-list" />
            仕様駆動開発(SDD)への統合: GitHub Spec Kit
          </h2>

          <p>
            Plan Modeが「その場限りの計画」であるのに対し、<strong>GitHub Spec Kit</strong>
            は「仕様(spec)・計画(plan)・タスク(tasks)をリポジトリに永続化されたMarkdown成果物として残す」ためのオープンソースツールキットです。Microsoft
            for Developersのブログによれば、Spec Kitは <code>.specify</code>{" "}
            フォルダにSDD用テンプレート（spec/plan/tasksの雛形）を、<code>.github</code>{" "}
            などエージェント固有のフォルダにプロンプト定義を配置します。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_7} />
          </div>

          <h3>4つの成果物</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>成果物</th>
                  <th>役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>constitution.md</code>
                  </td>
                  <td>プロジェクト全体で守るべき非交渉的な原則（品質基準、禁止事項など）</td>
                </tr>
                <tr>
                  <td>
                    <code>spec.md</code>
                  </td>
                  <td>
                    「何を作るか」。ユーザーゴール・シナリオ・受け入れ基準（実装詳細は含めない）
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>plan.md</code>
                  </td>
                  <td>「どう作るか」。使用する技術スタックや既存パターンとの整合性</td>
                </tr>
                <tr>
                  <td>
                    <code>tasks.md</code>
                  </td>
                  <td>実行可能な最小単位に分解したタスクリスト</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>実務上のコツ</h3>
          <ul>
            <li>
              <strong>一気に生成させない</strong>: <code>/implement</code>{" "}
              を一度に全部走らせるのではなく、フェーズやタスク単位で段階的に生成し、都度レビューすることが強調されています。小さく検証しながら進めることで、間違った方向に進んだ場合の手戻りを最小化できます。
            </li>
            <li>
              <strong>整合性チェックを使う</strong>:
              spec/plan/tasksの間で矛盾（ディレクトリの想定違い、要件の抜け漏れなど）を検出するコマンドも用意されており、実装に入る前の最終確認に活用します。
            </li>
            <li>
              <strong>Copilot専用ではない</strong>: <code>specify init --ai copilot</code>{" "}
              のようにAIツールを指定して初期化でき、Claude
              CodeやCursor、Geminiなど他ツールでも同じSDDプロセスを使い回せます。
            </li>
          </ul>

          <h3>Plan Mode との使い分け</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>Plan Mode（IDE組み込み）</th>
                  <th>GitHub Spec Kit（SDD）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>成果物</td>
                  <td>
                    セッション内の計画（Visual Studioでは <code>.copilot/plans/</code> に保存）
                  </td>
                  <td>
                    <code>spec.md</code> / <code>plan.md</code> / <code>tasks.md</code>{" "}
                    としてリポジトリにコミット
                  </td>
                </tr>
                <tr>
                  <td>適した規模</td>
                  <td>単機能・単一PR程度の作業</td>
                  <td>複数人・複数PRにまたがる大きめの機能開発</td>
                </tr>
                <tr>
                  <td>目的</td>
                  <td>「実装前に一呼吸おく」その場の合意形成</td>
                  <td>仕様そのものをチームの生きたドキュメントとして残す</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            どちらか一方を選ぶというより、
            <strong>
              小さな作業にはPlan Mode、機能単位の大きな作業にはSpec Kitによるフル装備のSDD
            </strong>
            、という併用が現実的な落としどころです。仕様駆動開発の専門解説記事でも、「フルスペックのSDDは計画コストやレビューのボトルネックという税金を伴うため、その税金に見合う規模かどうかを見極めるべき」という指摘がされています。
          </p>
        </section>

        {/* Security */}
        <section id="security">
          <h2>
            <i className="ti ti-shield-check" />
            セキュリティとガバナンスの勘所
          </h2>

          <p>
            AIエージェントが「読む」コンテキストが増えるほど、悪意のある指示が紛れ込む余地（プロンプトインジェクション）も増えます。GitHub自身のセキュリティブログでも、VS
            Codeにおける対策として次のような機能追加が説明されています。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>リスク</th>
                  <th>具体例</th>
                  <th>主な対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>間接プロンプトインジェクション</td>
                  <td>
                    Issueやコードコメント、ファイルの中に隠された指示にAgent modeが従ってしまう
                  </td>
                  <td>
                    使用可能なツールの一覧表示、ツールの手動選択、ワークスペース外のファイル読み書き時の確認ダイアログ
                  </td>
                </tr>
                <tr>
                  <td>信頼できないMCPサーバー</td>
                  <td>未検証のMCPサーバーが機密情報を持ち出す、あるいは不正な操作を行う</td>
                  <td>
                    MCPサーバー起動前の信頼確認ダイアログ、組織による許可リスト、サンドボックス化
                  </td>
                </tr>
                <tr>
                  <td>シークレットの漏洩</td>
                  <td>プロンプトや生成コードに認証情報が紛れ込む</td>
                  <td>Secret scanning + push protection、Content exclusions設定</td>
                </tr>
                <tr>
                  <td>生成コードの脆弱性</td>
                  <td>一見正しく見えるが入力検証が甘いコードが生成される</td>
                  <td>人間によるレビューを必須化、Copilot Autofix等の静的解析との併用</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>実務上のポイントは次の通りです。</p>
          <ul>
            <li>
              <strong>MCPサーバーは信頼できる提供元に限定する</strong>:
              組織として許可するMCPサーバーの一覧を定義し、未検証の外部提供元をブロックすることが推奨されています。
            </li>
            <li>
              <strong>YOLOモード（Allow All）は隔離環境で使う</strong>: Burke
              Hollandの記事でも「エージェントに全自動での実行権限を与える場合は、GitHub
              Codespacesやdev
              containerのようなサンドボックス上で行うべきで、特に業務データを扱う場合はローカルマシンで実行すべきではない」と明確に注意喚起されています。
            </li>
            <li>
              <strong>常に人間のレビューを最終防波堤にする</strong>:
              instructions・skills・MCPをどれだけ整えても、生成されたコード・実行されたコマンドの最終承認は人間が担うという原則は変わりません。
            </li>
          </ul>
        </section>

        {/* Maturity */}
        <section id="maturity">
          <h2>
            <i className="ti ti-trending-up" />
            成熟度モデルとチェックリスト
          </h2>

          <p>チームでの導入は、次のように段階を踏むのが現実的です。</p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>段階</th>
                  <th>やること</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Crawl（開始期）</strong>
                  </td>
                  <td>
                    <code>.github/copilot-instructions.md</code>{" "}
                    を1本作成しコミットする。まずは技術スタック・ビルド/テストコマンドなど最低限の情報から
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Walk（定着期）</strong>
                  </td>
                  <td>
                    差分の大きい領域（認証・課金・インフラなど）に <code>.instructions.md</code>{" "}
                    を追加。よく使う定型作業を <code>.prompt.md</code> 化する
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Run（高度化期）</strong>
                  </td>
                  <td>
                    役割別のCustom agent（<code>.agent.md</code>）、チーム共有のAgent
                    Skills（SKILL.md）、MCPによる外部連携を整備。大きな機能開発ではGitHub Spec
                    KitでSDDを回す
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>継続運用</strong>
                  </td>
                  <td>
                    月次でCopilotの利用状況・アウトカム・コスト・インシデントをレビューし、エビデンスに基づいて適用範囲を広げる
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>最終チェックリスト</h3>
          <ul className={styles.checklist}>
            <li>
              <label className={styles.checkItem}>
                <input type="checkbox" className={styles.checkInput} />
                <span className={styles.checkBox}>
                  <i className="ti ti-check" />
                </span>
                <span className={styles.checkText}>
                  <code>.github/copilot-instructions.md</code> はリポジトリにコミットされているか
                </span>
              </label>
            </li>
            <li>
              <label className={styles.checkItem}>
                <input type="checkbox" className={styles.checkInput} />
                <span className={styles.checkBox}>
                  <i className="ti ti-check" />
                </span>
                <span className={styles.checkText}>
                  指示ファイルは矛盾なく、具体的で観測可能な表現になっているか（1000行を超えていないか）
                </span>
              </label>
            </li>
            <li>
              <label className={styles.checkItem}>
                <input type="checkbox" className={styles.checkInput} />
                <span className={styles.checkBox}>
                  <i className="ti ti-check" />
                </span>
                <span className={styles.checkText}>
                  パス限定のルールが必要な領域に <code>.instructions.md</code> を用意しているか
                </span>
              </label>
            </li>
            <li>
              <label className={styles.checkItem}>
                <input type="checkbox" className={styles.checkInput} />
                <span className={styles.checkBox}>
                  <i className="ti ti-check" />
                </span>
                <span className={styles.checkText}>
                  繰り返し行うタスクを <code>.prompt.md</code> 化してチームで共有しているか
                </span>
              </label>
            </li>
            <li>
              <label className={styles.checkItem}>
                <input type="checkbox" className={styles.checkInput} />
                <span className={styles.checkBox}>
                  <i className="ti ti-check" />
                </span>
                <span className={styles.checkText}>
                  Planning用とImplementation用でツール権限を分けたCustom agent（
                  <code>.agent.md</code>）を用意しているか
                </span>
              </label>
            </li>
            <li>
              <label className={styles.checkItem}>
                <input type="checkbox" className={styles.checkInput} />
                <span className={styles.checkBox}>
                  <i className="ti ti-check" />
                </span>
                <span className={styles.checkText}>
                  チーム固有の手順をSKILL.mdとして言語化し、<code>description</code>{" "}
                  を具体的に書いているか
                </span>
              </label>
            </li>
            <li>
              <label className={styles.checkItem}>
                <input type="checkbox" className={styles.checkInput} />
                <span className={styles.checkBox}>
                  <i className="ti ti-check" />
                </span>
                <span className={styles.checkText}>
                  MCPサーバーは信頼できる提供元に限定し、YOLOモードは隔離環境でのみ使っているか
                </span>
              </label>
            </li>
            <li>
              <label className={styles.checkItem}>
                <input type="checkbox" className={styles.checkInput} />
                <span className={styles.checkBox}>
                  <i className="ti ti-check" />
                </span>
                <span className={styles.checkText}>
                  大きな機能開発の前に、Plan Mode（または Spec Kitの
                  spec/plan/tasks）で合意形成しているか
                </span>
              </label>
            </li>
            <li>
              <label className={styles.checkItem}>
                <input type="checkbox" className={styles.checkInput} />
                <span className={styles.checkBox}>
                  <i className="ti ti-check" />
                </span>
                <span className={styles.checkText}>
                  生成物は必ず人間がレビューしてからマージしているか
                </span>
              </label>
            </li>
          </ul>
        </section>

        {/* References */}
        <section id="references">
          <h2>
            <i className="ti ti-books" />
            参考文献
          </h2>

          <div className={styles.refGroup}>
            <h3>
              <i className="ti ti-file-certificate" />
              公式ドキュメント・一次情報
            </h3>
            <ul className={styles.refList}>
              <li>
                <span className={styles.refTitle}>
                  GitHub Docs — Best practices for using GitHub Copilot to work on tasks
                </span>
                <Ext href="https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/best-practices-for-using-copilot-to-work-on-tasks">
                  <span className={styles.refUrl}>
                    https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/best-practices-for-using-copilot-to-work-on-tasks
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitHub Docs — Best practices for GitHub Copilot CLI
                </span>
                <Ext href="https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices">
                  <span className={styles.refUrl}>
                    https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitHub Docs — Your first custom instructions
                </span>
                <Ext href="https://docs.github.com/en/copilot/tutorials/customization-library/custom-instructions/your-first-custom-instructions">
                  <span className={styles.refUrl}>
                    https://docs.github.com/en/copilot/tutorials/customization-library/custom-instructions/your-first-custom-instructions
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitHub Docs — About customizing GitHub Copilot responses
                </span>
                <Ext href="https://docs.github.com/copilot/concepts/about-customizing-github-copilot-chat-responses">
                  <span className={styles.refUrl}>
                    https://docs.github.com/copilot/concepts/about-customizing-github-copilot-chat-responses
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>GitHub Docs — Your first prompt file</span>
                <Ext href="https://docs.github.com/en/copilot/tutorials/customization-library/prompt-files/your-first-prompt-file">
                  <span className={styles.refUrl}>
                    https://docs.github.com/en/copilot/tutorials/customization-library/prompt-files/your-first-prompt-file
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>VS Code Docs — Use prompt files in VS Code</span>
                <Ext href="https://code.visualstudio.com/docs/agent-customization/prompt-files">
                  <span className={styles.refUrl}>
                    https://code.visualstudio.com/docs/agent-customization/prompt-files
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  VS Code Docs — Use custom instructions in VS Code
                </span>
                <Ext href="https://code.visualstudio.com/docs/agent-customization/custom-instructions">
                  <span className={styles.refUrl}>
                    https://code.visualstudio.com/docs/agent-customization/custom-instructions
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>VS Code Docs — Custom agents in VS Code</span>
                <Ext href="https://code.visualstudio.com/docs/agent-customization/custom-agents">
                  <span className={styles.refUrl}>
                    https://code.visualstudio.com/docs/agent-customization/custom-agents
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  microsoft/vscode-docs — Custom chat modes（旧仕様の一次資料）
                </span>
                <Ext href="https://github.com/microsoft/vscode-docs/blob/main/docs/copilot/customization/custom-chat-modes.md">
                  <span className={styles.refUrl}>
                    https://github.com/microsoft/vscode-docs/blob/main/docs/copilot/customization/custom-chat-modes.md
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Visual Studio Blog — Custom Agents in Visual Studio: Built in and Build-Your-Own
                  agents
                </span>
                <Ext href="https://devblogs.microsoft.com/visualstudio/custom-agents-in-visual-studio-built-in-and-build-your-own-agents/">
                  <span className={styles.refUrl}>
                    https://devblogs.microsoft.com/visualstudio/custom-agents-in-visual-studio-built-in-and-build-your-own-agents/
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Visual Studio Blog — Plan Before You Build: Introducing the Plan agent in Visual
                  Studio
                </span>
                <Ext href="https://devblogs.microsoft.com/visualstudio/plan-before-you-build-introducing-the-plan-agent-in-visual-studio/">
                  <span className={styles.refUrl}>
                    https://devblogs.microsoft.com/visualstudio/plan-before-you-build-introducing-the-plan-agent-in-visual-studio/
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>GitHub Docs — About agent skills</span>
                <Ext href="https://docs.github.com/en/copilot/concepts/agents/about-agent-skills">
                  <span className={styles.refUrl}>
                    https://docs.github.com/en/copilot/concepts/agents/about-agent-skills
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitHub Docs — Adding agent skills for GitHub Copilot CLI
                </span>
                <Ext href="https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills">
                  <span className={styles.refUrl}>
                    https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Microsoft Learn — Use Agent Skills with GitHub Copilot (Visual Studio)
                </span>
                <Ext href="https://learn.microsoft.com/en-us/visualstudio/ide/copilot-agent-skills?view=visualstudio">
                  <span className={styles.refUrl}>
                    https://learn.microsoft.com/en-us/visualstudio/ide/copilot-agent-skills?view=visualstudio
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitHub Changelog — GitHub Copilot now supports Agent Skills
                </span>
                <Ext href="https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/">
                  <span className={styles.refUrl}>
                    https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitHub Changelog — Copilot code review: Agent skills and MCP now generally
                  available
                </span>
                <Ext href="https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/">
                  <span className={styles.refUrl}>
                    https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitHub Docs — Extending GitHub Copilot Chat with MCP servers
                </span>
                <Ext href="https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/extend-copilot-chat-with-mcp">
                  <span className={styles.refUrl}>
                    https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/extend-copilot-chat-with-mcp
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitHub Docs — About Model Context Protocol (MCP)
                </span>
                <Ext href="https://docs.github.com/en/copilot/concepts/context/mcp">
                  <span className={styles.refUrl}>
                    https://docs.github.com/en/copilot/concepts/context/mcp
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>VS Code Docs — MCP configuration reference</span>
                <Ext href="https://code.visualstudio.com/docs/agents/reference/mcp-configuration">
                  <span className={styles.refUrl}>
                    https://code.visualstudio.com/docs/agents/reference/mcp-configuration
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitHub Blog（Security）— Safeguarding VS Code against prompt injections
                </span>
                <Ext href="https://github.blog/security/vulnerability-research/safeguarding-vs-code-against-prompt-injections/">
                  <span className={styles.refUrl}>
                    https://github.blog/security/vulnerability-research/safeguarding-vs-code-against-prompt-injections/
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Microsoft for Developers — Diving Into Spec-Driven Development With GitHub Spec
                  Kit
                </span>
                <Ext href="https://developer.microsoft.com/blog/spec-driven-development-spec-kit/">
                  <span className={styles.refUrl}>
                    https://developer.microsoft.com/blog/spec-driven-development-spec-kit/
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitHub Blog — Spec-driven development with AI: Get started with a new open source
                  toolkit
                </span>
                <Ext href="https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/">
                  <span className={styles.refUrl}>
                    https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>GitHub Spec Kit 公式サイト</span>
                <Ext href="https://github.github.com/spec-kit/">
                  <span className={styles.refUrl}>https://github.github.com/spec-kit/</span>
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3>
              <i className="ti ti-user-star" />
              著名な開発者・実務者による解説
            </h3>
            <ul className={styles.refList}>
              <li>
                <span className={styles.refTitle}>
                  Burke Holland（GitHub, Staff DevRel）— The harness is all you need (mostly)
                </span>
                <Ext href="https://github.blog/ai-and-ml/github-copilot/the-harness-is-all-you-need-mostly/">
                  <span className={styles.refUrl}>
                    https://github.blog/ai-and-ml/github-copilot/the-harness-is-all-you-need-mostly/
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Burke Holland — Essential custom instructions for GitHub Copilot
                </span>
                <Ext href="https://burkeholland.github.io/posts/essential-custom-instructions/">
                  <span className={styles.refUrl}>
                    https://burkeholland.github.io/posts/essential-custom-instructions/
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitHub Blog（Burke Holland 寄稿含む）— 5 tips for writing better custom
                  instructions for Copilot
                </span>
                <Ext href="https://github.blog/ai-and-ml/github-copilot/5-tips-for-writing-better-custom-instructions-for-copilot/">
                  <span className={styles.refUrl}>
                    https://github.blog/ai-and-ml/github-copilot/5-tips-for-writing-better-custom-instructions-for-copilot/
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitHub Blog — Unlocking the full power of Copilot code review: Master your
                  instructions files
                </span>
                <Ext href="https://github.blog/ai-and-ml/github-copilot/unlocking-the-full-power-of-copilot-code-review-master-your-instructions-files/">
                  <span className={styles.refUrl}>
                    https://github.blog/ai-and-ml/github-copilot/unlocking-the-full-power-of-copilot-code-review-master-your-instructions-files/
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  VS Code Blog（Rob Conery, Burke Holland）— Context is all you need: Better AI
                  results with custom instructions
                </span>
                <Ext href="https://code.visualstudio.com/blogs/2025/03/26/custom-instructions">
                  <span className={styles.refUrl}>
                    https://code.visualstudio.com/blogs/2025/03/26/custom-instructions
                  </span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Hidde de Smet — AGENTS.md vs .agent.md: repo rules and custom agent roles
                  explained
                </span>
                <Ext href="https://hiddedesmet.com/agent-md-explained">
                  <span className={styles.refUrl}>https://hiddedesmet.com/agent-md-explained</span>
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>Matt Pocock — grill-me skill</span>
                <Ext href="https://www.skills.sh/mattpocock/skills/grill-me">
                  <span className={styles.refUrl}>
                    https://www.skills.sh/mattpocock/skills/grill-me
                  </span>
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        <div className={styles.footer}>
          本ガイドはあくまで2026年7月31日時点の情報に基づく解説です。GitHub
          Copilotの機能は頻繁に更新されるため、導入前には必ず最新の公式ドキュメントをご確認ください。
        </div>

        <TocObserver />
      </main>
    </div>
  );
}
