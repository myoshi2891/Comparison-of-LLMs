import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import TocObserver from "@/components/docs/TocObserver";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Hermes Agent ベストプラクティスガイド ― 中級者から上級者向け",
  description:
    "Nous Research製オープンソース自己改善型AIエージェント「Hermes Agent」を実運用レベルで使いこなすためのステップバイステップ解説。アーキテクチャ・メモリ設計・スキル運用・サブエージェント委任・/goal・execute_code・Cron・MCP統合・セキュリティ・コスト最適化まで全網羅。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_1_1 = `flowchart LR
    subgraph Entry["エントリーポイント"]
        CLI["CLI (hermes)"]
        GW["Gateway（Telegram/Discord/Slack等）"]
        CRON["Cron Scheduler"]
        ACP["ACP（VS Code/Zed/JetBrains）"]
    end

    Entry --> Agent["AIAgent（会話ループの中核）"]

    Agent --> Prompt["Prompt Builder<br/>system_prompt.py"]
    Agent --> Provider["Provider Runtime<br/>18+プロバイダ解決"]
    Agent --> Tools["Tool Dispatch<br/>70+ツール / 28 toolset"]

    Tools --> Terminal["Terminal（6バックエンド）"]
    Tools --> MCP["MCPクライアント"]
    Tools --> Skills["Skills System"]
    Tools --> Memory["Memory Manager"]

    Agent --> Session["Session Storage<br/>SQLite + FTS5"]`;

const DIAGRAM_2_1 = `sequenceDiagram
    participant U as ユーザー
    participant CLI as HermesCLI
    participant Agent as AIAgent
    participant Prov as Provider Runtime
    participant Tool as Tool Registry
    participant DB as SessionDB

    U->>CLI: 入力
    CLI->>Agent: run_conversation()
    Agent->>Agent: build_system_prompt()
    Agent->>Prov: resolve_runtime_provider()
    Prov-->>Agent: api_mode / credentials
    Agent->>Tool: API呼び出し（tool_calls検出）
    Tool-->>Agent: 実行結果
    Agent->>DB: 会話を保存
    Agent-->>CLI: 最終応答
    CLI-->>U: 表示`;

const DIAGRAM_2_2 = `sequenceDiagram
    participant P as プラットフォーム（Telegram等）
    participant Adp as Adapter
    participant GW as GatewayRunner
    participant Agent as AIAgent

    P->>Adp: メッセージイベント
    Adp->>GW: MessageEvent
    GW->>GW: ユーザー認可チェック
    GW->>GW: セッションキー解決
    GW->>Agent: 履歴付きAIAgent生成
    Agent-->>GW: 応答
    GW-->>Adp: 配信
    Adp-->>P: 送信`;

const DIAGRAM_2_3 = `sequenceDiagram
    participant Sch as Scheduler
    participant Job as jobs.json
    participant Agent as 新規AIAgent
    participant Deliv as 配信先

    Sch->>Job: 60秒ごとにtick
    Job-->>Sch: 期限到来ジョブ取得
    Sch->>Agent: 履歴なしで新規生成
    Sch->>Agent: 添付スキルを注入
    Agent->>Agent: プロンプトを実行
    Agent-->>Deliv: 結果を配信
    Sch->>Job: next_run_atを更新`;

const DIAGRAM_5_1 = `flowchart LR
    L0["Level 0<br/>skills_list()<br/>名前+説明のみ（約3千トークン）"] --> L1["Level 1<br/>skill_view(name)<br/>SKILL.md全文"]
    L1 --> L2["Level 2<br/>skill_view(name, path)<br/>参照ファイル個別"]`;

const DIAGRAM_6_1 = `flowchart LR
    Active["active<br/>（通常使用中）"] -->|30日未使用| Stale["stale<br/>（休眠候補）"]
    Stale -->|90日未使用| Archived["archived<br/>（.archive/へ退避）"]
    Archived -->|hermes curator restore| Active
    Pin["hermes curator pin"] -.自動遷移を無効化.-> Active`;

const DIAGRAM_8_1 = `flowchart TB
    Parent["親エージェント（depth 0）"] --> Leaf1["leaf子（depth 1）<br/>これ以上委任不可"]
    Parent --> Orch["orchestrator子（depth 1）<br/>max_spawn_depthを引き上げた場合のみ委任可"]
    Orch --> GrandLeaf["leaf孫（depth 2）"]`;

const DIAGRAM_10_1 = `flowchart TB
    Set["/goal でゴール設定<br/>（デフォルト20ターン予算）"] --> Turn["1ターン実行"]
    Turn --> Judge["補助モデルによる判定<br/>done or continue"]
    Judge -->|continue| Turn
    Judge -->|done| Done["✓ ゴール達成"]
    Turn -.ターン予算超過.-> Pause["⏸ 一時停止<br/>/goal resume で再開"]`;

const DIAGRAM_11_1 = `flowchart LR
    J1["Job1: 収集<br/>HN上位10件を取得しraw.mdへ"] -->|context_from| J2["Job2: 選別<br/>スコアリングしranked.mdへ"]
    J2 -->|context_from| J3["Job3: 配信<br/>ツイート下書き3本を作りTelegramへ"]`;

const DIAGRAM_13_1 = `flowchart TB
    L1["1. ユーザー認可<br/>許可リスト・DMペアリング"]
    L2["2. 危険コマンド承認<br/>Human-in-the-loop"]
    L3["3. ファイル書き込み安全性<br/>拒否リスト・HERMES_WRITE_SAFE_ROOT"]
    L4["4. コンテナ隔離<br/>Docker/Singularity/Modal"]
    L5["5. MCP資格情報フィルタリング"]
    L6["6. コンテキストファイルスキャン<br/>プロンプトインジェクション検知"]
    L7["7. セッション間隔離<br/>cronパストラバーサル対策込み"]
    L8["8. 入力サニタイズ<br/>作業ディレクトリの許可リスト検証"]
    L1 --> L2 --> L3 --> L4 --> L5 --> L6 --> L7 --> L8`;

const DIAGRAM_15_1 = `flowchart TB
    Start["問題が発生"] --> Q1{"MCPツールが<br/>見えない?"}
    Q1 -->|Yes| Q1a{"サーバーは<br/>接続済み?"}
    Q1a -->|No| Fix1["hermes mcp login /<br/>OAuth再認証"]
    Q1a -->|Yes| Fix2["tools.include/excludeの<br/>設定を確認"]
    Q1 -->|No| Q2{"承認プロンプトが<br/>出ない?"}
    Q2 -->|Yes| Fix3["approvals.mode /<br/>command_allowlistを確認"]
    Q2 -->|No| Q3{"メモリ/スキルが<br/>更新されない?"}
    Q3 -->|Yes| Fix4["write_approvalの<br/>pendingキューを確認"]
    Q3 -->|No| Q4{"Cronジョブが<br/>実行されない?"}
    Q4 -->|Yes| Fix5["hermes cron status /<br/>runsで履歴確認"]`;

export default function HermesAgentAdvancedGuidePage() {
  return (
    <div className={styles.layout}>
      <TocObserver
        navLinkClassName={styles.navLink}
        activeClassName={styles.navLinkActive}
        chapterSelector="h2[id]"
        toggleId="menuToggle"
        sidebarId="sidebar"
        sidebarOpenClassName={styles.sidebarOpen}
      />

      <button
        id="menuToggle"
        className={styles.sidebarToggle}
        type="button"
        aria-label="メニューを開く"
        aria-expanded="false"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <nav className={styles.sidebar} id="sidebar">
        <div className={styles.brand}>Hermes Agent Guide</div>
        <div className={styles.brandSub}>Nous Research Agent Architecture &amp; Best Practices</div>

        <div className={styles.navGroup} style={{ "--group-color": "var(--c-overview)" } as React.CSSProperties}>
          <div className={styles.navGroupLabel}>概要 &amp; アーキテクチャ</div>
          <a className={styles.navLink} href="#1-hermes-agentとは何か">
            1. Hermes Agentとは何か
          </a>
          <a className={styles.navLink} href="#2-アーキテクチャ概観">
            2. アーキテクチャ概観
          </a>
        </div>

        <div className={styles.navGroup} style={{ "--group-color": "var(--c-data)" } as React.CSSProperties}>
          <div className={styles.navGroupLabel}>環境 &amp; メモリ設計</div>
          <a className={styles.navLink} href="#3-セットアップとプロファイル運用のベストプラクティス">
            3. セットアップとプロファイル運用
          </a>
          <a className={styles.navLink} href="#4-メモリシステム設計のベストプラクティス">
            4. メモリシステム設計
          </a>
        </div>

        <div className={styles.navGroup} style={{ "--group-color": "var(--c-skills)" } as React.CSSProperties}>
          <div className={styles.navGroupLabel}>スキル &amp; コンテキスト</div>
          <a className={styles.navLink} href="#5-スキルシステムとprogressive-disclosure">
            5. スキルシステムとProgressive Disclosure
          </a>
          <a className={styles.navLink} href="#6-curatorによるスキルの自動メンテナンス">
            6. Curatorによるスキルの自動メンテナンス
          </a>
          <a className={styles.navLink} href="#7-コンテキストファイル戦略agentsmd--soulmd">
            7. コンテキストファイル戦略（AGENTS.md / SOUL.md）
          </a>
        </div>

        <div className={styles.navGroup} style={{ "--group-color": "var(--c-exec)" } as React.CSSProperties}>
          <div className={styles.navGroupLabel}>実行系機能</div>
          <a className={styles.navLink} href="#8-サブエージェント委任delegation">
            8. サブエージェント委任（Delegation）
          </a>
          <a className={styles.navLink} href="#9-execute_codeによるトークン最適化">
            9. execute_codeによるトークン最適化
          </a>
          <a className={styles.navLink} href="#10-persistent-goalsgoal-ralph-loopの実践">
            10. Persistent Goals（/goal）― Ralph loopの実践
          </a>
          <a className={styles.navLink} href="#11-cron自動化のベストプラクティス">
            11. Cron自動化のベストプラクティス
          </a>
          <a className={styles.navLink} href="#12-mcp統合のベストプラクティス">
            12. MCP統合のベストプラクティス
          </a>
        </div>

        <div className={styles.navGroup} style={{ "--group-color": "var(--c-ops)" } as React.CSSProperties}>
          <div className={styles.navGroupLabel}>本番運用</div>
          <a className={styles.navLink} href="#13-本番運用のセキュリティチェックリスト">
            13. 本番運用のセキュリティ・チェックリスト
          </a>
          <a className={styles.navLink} href="#14-コスト最適化とプロンプトキャッシュ">
            14. コスト最適化とプロンプトキャッシュ
          </a>
          <a className={styles.navLink} href="#15-トラブルシューティング">
            15. トラブルシューティング
          </a>
          <a className={styles.navLink} href="#16-ベストプラクティス総括チェックリスト">
            16. ベストプラクティス総括チェックリスト
          </a>
          <a className={styles.navLink} href="#17-参考文献出典">
            17. 参考文献・出典
          </a>
        </div>
      </nav>

      <div className={styles.main}>
        <div className={styles.hero}>
          <span className={styles.eyebrow}>HERMES AGENT &middot; NOUS RESEARCH</span>
          <h1>
            Hermes Agent ベストプラクティスガイド{" "}
            <br />― 中級者から上級者向け
          </h1>
          <p className={styles.subtitle}>
            Nous Research製オープンソース自己改善型AIエージェント「Hermes Agent」を、実運用レベルで使いこなすためのステップバイステップ解説。対象読者は、CLI／エージェント系ツールの利用経験があり、メモリ設計・スキル運用・マルチエージェント委任・本番セキュリティまで踏み込みたい中級〜上級エンジニア。情報基準日: 2026年8月2日(Hermes Agent公式ドキュメント/GitHubリポジトリの内容に基づく)。
          </p>
        </div>

        <div className={styles.content}>
          <hr />

          <h2 id="1-hermes-agentとは何か">1. Hermes Agentとは何か</h2>
          <p>
            Hermes Agentは、AI基盤研究企業Nous Research（Hermesモデルシリーズ、分散学習フレームワークDisTrO、分散学習ネットワークPsycheなどで知られる）が開発したMITライセンスのオープンソース自律AIエージェントである。GitHubリポジトリ<code>NousResearch/hermes-agent</code>は2026年8月時点で20万スターを超える規模に成長しており、公式には「The agent that grows with you（あなたと共に成長するエージェント）」と位置づけられている。
          </p>
          <p>
            Hermes Agentが他のコーディング特化エージェント（IDE常駐型のコパイロット）や単発のチャットボットラッパーと一線を画す最大の特徴は、<strong>組み込みの学習ループ</strong>を持つ点にある。
          </p>
          <ul>
            <li>
              タスク実行の経験から<strong>スキル（procedural memory）</strong>を自律生成する
            </li>
            <li>生成したスキルを使用しながら自己改善する</li>
            <li>過去の会話をFTS5全文検索で横断的に参照する</li>
            <li>
              ユーザーの好み・環境情報を<strong>メモリ（MEMORY.md / USER.md）</strong>として蓄積する
            </li>
          </ul>
          <p>
            ローカルのlocalバックエンドはもちろん、Docker・SSH・Singularity・Daytona・Modal・Vercel Sandboxなど6種類のターミナルバックエンドで動作し、$5程度のVPSからGPUクラスタ、アイドル時にほぼ課金されないサーバーレス基盤まで、実行環境を選ばない。Telegram・Discord・Slack・WhatsApp・Signal・Matrix・Mattermost・Email・SMSなど20以上のメッセージングプラットフォームに単一のゲートウェイプロセスから同時接続できる。
          </p>

          <h3 id="11-業界での位置づけ">1.1 業界での位置づけ</h3>
          <p>
            2026年前半、Peter Steinberger氏が公開したエージェント「OpenClaw」が爆発的に普及したことを受け、その数週間後にNous ResearchがHermesを競合として投入した経緯がある。両者は設計思想が異なり、OpenClawが多チャンネル対応の中央ゲートウェイ型アーキテクチャを志向するのに対し、Hermesは自己改善ループ（スキル自動生成・メモリ蓄積）に重きを置く。2026年5月時点でOpenRouter上の1日あたりトークン生成量でHermesがOpenClawを上回り首位に立ったと報じられている。同年7月にはNous ResearchがRobot Ventures主導・USV参加のラウンドで評価額15億ドル規模の資金調達を進めていると報じられた。
          </p>
          <p>
            OpenClawからの移行者向けに<code>hermes claw migrate</code>コマンドが用意されており、SOUL.md相当のペルソナファイル、メモリ、スキル、コマンド許可リスト、メッセージング設定、APIキーなどを自動的に取り込める。
          </p>

          <h3 id="12-全体像を一目で">1.2 全体像を一目で</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_1_1} />
          </div>
          <p>この後の章では、この図の各コンポーネントを実務でどう設定・運用すべきかを順に掘り下げる。</p>

          <hr />

          <h2 id="2-アーキテクチャ概観">2. アーキテクチャ概観</h2>
          <h3 id="21-ディレクトリ構成の要点">2.1 ディレクトリ構成の要点</h3>
          <p>
            Hermes Agentのソースツリーは大きく分けて次の要素で構成される（実装を読む・パッチを当てる際の道しるべとして把握しておくとよい）。
          </p>
          <ul>
            <li>
              <code>run_agent.py</code> ― <code>AIAgent</code>本体。プロバイダ選択・プロンプト構築・ツール実行・リトライ・フォールバック・圧縮・永続化を司る会話ループ
            </li>
            <li>
              <code>cli.py</code> ― <code>HermesCLI</code>、対話型ターミナルUI
            </li>
            <li>
              <code>agent/</code> ― プロンプト組み立て（<code>prompt_builder.py</code>）、コンテキスト圧縮（<code>context_compressor.py</code>）、Anthropicプロンプトキャッシュ（<code>prompt_caching.py</code>）など
            </li>
            <li>
              <code>hermes_cli/</code> ― サブコマンド群、認証・プロバイダ解決、プラグインマネージャ
            </li>
            <li>
              <code>tools/</code> ― ツール実装。1ファイル1ツールが原則で、インポート時に<code>registry.register()</code>を呼んで自己登録する
            </li>
            <li>
              <code>gateway/</code> ― メッセージングゲートウェイ本体。20種のプラットフォームアダプタを収録
            </li>
            <li>
              <code>cron/</code> ― スケジューラ
            </li>
            <li>
              <code>skills/</code> と <code>optional-skills/</code> ― バンドル済みスキルと任意インストール可能な公式スキル
            </li>
            <li>
              <code>tests/</code> ― 約1,250ファイル・25,000件規模のpytestスイート
            </li>
          </ul>

          <h3 id="22-データフロー">2.2 データフロー</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_2_1} />
          </div>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_2_2} />
          </div>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_2_3} />
          </div>

          <h3 id="23-設計原則">2.3 設計原則</h3>
          <p>公式ドキュメントが明示する設計原則は、カスタマイズや障害対応を行う際の判断基準として有用である。</p>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>原則</th>
                  <th>実務上の意味</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>プロンプトの安定性</td>
                  <td>
                    システムプロンプトはセッション中に変化しない。<code>/model</code>など明示的な操作を除き、キャッシュを破壊する変更は起きない
                  </td>
                </tr>
                <tr>
                  <td>実行の可観測性</td>
                  <td>
                    すべてのツール呼び出しはコールバック経由でユーザーに可視化される（CLIのスピナー、ゲートウェイのチャットメッセージ）
                  </td>
                </tr>
                <tr>
                  <td>中断可能性</td>
                  <td>API呼び出しやツール実行はユーザー入力やシグナルでいつでも中断できる</td>
                </tr>
                <tr>
                  <td>プラットフォーム非依存のコア</td>
                  <td>
                    <code>AIAgent</code>は1クラスでCLI・ゲートウェイ・ACP・バッチ・APIサーバーを兼ねる。差異はエントリーポイント側に閉じ込める
                  </td>
                </tr>
                <tr>
                  <td>疎結合</td>
                  <td>
                    MCP・プラグイン・メモリプロバイダ・RL環境などのオプション機構はレジストリパターンと<code>check_fn</code>ゲーティングで実現し、ハード依存にしない
                  </td>
                </tr>
                <tr>
                  <td>プロファイル分離</td>
                  <td>
                    <code>hermes -p &lt;name&gt;</code>でプロファイルごとにHERMES_HOME・設定・メモリ・セッション・ゲートウェイPIDが独立し、複数プロファイルを同時実行できる
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>実務Tips</strong>: 個人用と業務用、あるいは検証用と本番用のエージェントを分けたい場合は、複数の<code>.hermes</code>ディレクトリを作るのではなく<code>hermes profile create &lt;name&gt;</code>でプロファイルを切ることを推奨する。プロファイルごとにスキル・メモリ・cronジョブが完全に独立するため、実験的な設定変更が本番プロファイルに波及しない。
          </p>

          <hr />

          <h2 id="3-セットアップとプロファイル運用のベストプラクティス">
            3. セットアップとプロファイル運用のベストプラクティス
          </h2>
          <h3 id="31-インストール">3.1 インストール</h3>
          <p>Linux / macOS / WSL2 / Termux（Android）は以下のワンライナーで導入できる。</p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>curl</span> -fsSL https://hermes-agent.nousresearch.com/install.sh | <span className={styles.ck}>bash</span>
            </div>
          </div>
          <p>Windowsはネイティブ対応しており、PowerShellで以下を実行する（WSL2を経由する必要はない）。</p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>iex</span> (irm https://hermes-agent.nousresearch.com/install.ps1)
            </div>
          </div>
          <p>
            インストーラはuv・Python 3.11・Node.js・ripgrep・ffmpeg・ポータブルGit Bash（MinGit）まで自動導入する。既存のGitがあればそれを優先利用し、システムのGit環境には干渉しない。
          </p>

          <h3 id="32-モデルプロバイダの選定">3.2 モデルプロバイダの選定</h3>
          <p>
            Nous Portal・OpenRouter・OpenAI・Anthropic・Google・その他OpenAI互換エンドポイントまで対応する。プロバイダごとに個別のAPIキーを管理したくない場合は、次の1コマンドでNous Portal経由のOAuthとTool Gateway（Web検索・画像生成・TTS・クラウドブラウザ）を一括有効化できる。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>hermes</span> setup --portal
            </div>
          </div>
          <p>
            モデルの切り替えはセッション中いつでも<code>/model</code>で可能だが、後述するプロンプトキャッシュの観点から、切り替え頻度は最小限にとどめるのがベストプラクティスである。
          </p>

          <h3 id="33-プロファイル分離とバックアップ">3.3 プロファイル分離とバックアップ</h3>
          <ul>
            <li>
              検証用スキルをバンドルなしのクリーンな状態で試したい場合は<code>hermes profile create research --no-skills</code>で空のプロファイルを作る
            </li>
            <li>
              既存プロファイルをバンドルスキルなしに切り替えたい場合は<code>hermes skills opt-out</code>（<code>--remove</code>で未編集のバンドルスキルも削除）
            </li>
            <li>定期的に<code>hermes update</code>でセキュリティパッチを取り込む</li>
          </ul>

          <hr />

          <h2 id="4-メモリシステム設計のベストプラクティス">4. メモリシステム設計のベストプラクティス</h2>
          <h3 id="41-2つのメモリストア">4.1 2つのメモリストア</h3>
          <p>Hermesのメモリは意図的に<strong>厳格な文字数上限</strong>を持つ2ファイル構成である。</p>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>ファイル</th>
                  <th>用途</th>
                  <th>上限</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>MEMORY.md</code></td>
                  <td>エージェント自身のメモ（環境情報・規約・学んだ教訓）</td>
                  <td>約2,200文字（≒800トークン）</td>
                </tr>
                <tr>
                  <td><code>USER.md</code></td>
                  <td>ユーザープロファイル（好み・コミュニケーションスタイル）</td>
                  <td>約1,375文字（≒500トークン）</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            両ファイルは<code>~/.hermes/memories/</code>に保存され、セッション開始時に<strong>フローズンスナップショット</strong>としてシステムプロンプトへ注入される。この設計はプロンプトキャッシュを維持するための意図的なトレードオフであり、セッション中にエージェントがメモリを追加・削除しても、その変更はディスクには即時反映される一方、システムプロンプト上の表示は次回セッション開始まで更新されない。
          </p>

          <h3 id="42-何を保存し何を保存しないか">4.2 何を保存し、何を保存しないか</h3>
          <p><strong>保存すべきもの（エージェントが自動的に行う）</strong></p>
          <ul>
            <li>ユーザーの技術的な好み（「TypeScriptを使う」など）→ <code>user</code></li>
            <li>環境事実（OS・ミドルウェアのバージョンなど）→ <code>memory</code></li>
            <li>
              訂正（「Dockerコマンドにsudoは不要、ユーザーはdockerグループに所属」など）→ <code>memory</code>
            </li>
            <li>プロジェクト規約（インデント幅・命名規則など）→ <code>memory</code></li>
            <li>完了した作業の記録 → <code>memory</code></li>
          </ul>
          <p><strong>保存すべきでないもの</strong></p>
          <ul>
            <li>曖昧すぎる情報（「Pythonについて質問された」）</li>
            <li>再検索で容易に得られる一般知識</li>
            <li>生データダンプ（大きなコードブロック・ログファイル）</li>
            <li>セッション限りの一時的な文脈</li>
            <li>すでにAGENTS.md/SOUL.mdに書かれている内容の重複</li>
          </ul>

          <h3 id="43-容量管理の実務">4.3 容量管理の実務</h3>
          <p>
            メモリは自動圧縮されない。上限を超える書き込みはエラーとして拒否され、エージェントは既存エントリを<code>replace</code>で統合するか<code>remove</code>で削除してから再試行する必要がある。<strong>容量が80%を超えた時点で統合する</strong>運用がベストプラクティスとして明示されている。良いエントリの例は次のように情報密度が高く簡潔である。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>このプロジェクト ~/code/api はGo 1.22・sqlcでDBクエリ・chiルータを使用。</div>
            <div className={styles.codeLine}>テストは &apos;make test&apos;。CI はGitHub Actions。</div>
          </div>
          <p>
            逆に「ユーザーは1月5日にプロジェクトについて質問し…」のような冗長な記述や、「ユーザーはプロジェクトを持っている」のような曖昧な記述は避けるべきである。
          </p>

          <h3 id="44-書き込み承認ゲートwrite_approval">
            4.4 書き込み承認ゲート（<code>write_approval</code>）
          </h3>
          <p>
            デフォルトではエージェントはメモリ・スキルへ自由に書き込む。誤った推測を保存されるのを防ぎたい場合は、次のように承認制へ切り替えられる。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}><span className={styles.ck}>memory:</span></div>
            <div className={styles.codeLine}>  <span className={styles.cv}>write_approval:</span> <span className={styles.cs}>true</span>   <span className={styles.cc}># true = 保存前に承認が必要</span></div>
            <div className={styles.codeLine}><span className={styles.ck}>skills:</span></div>
            <div className={styles.codeLine}>  <span className={styles.cv}>write_approval:</span> <span className={styles.cs}>true</span></div>
          </div>
          <p>
            有効化すると、対話的CLIではその場でインラインに承認を求められ、メッセージングプラットフォームやバックグラウンドの自己改善レビューからの書き込みは<code>/memory pending</code>・<code>/skills pending</code>でステージングされ、<code>approve</code>/<code>reject</code>で個別に判断できる。「エージェントが自分について誤った前提を保存してしまった」という問題への直接的な解決策である。
          </p>

          <h3 id="45-メモリ-vs-セッション検索">4.5 メモリ vs セッション検索</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>永続メモリ</th>
                  <th>セッション検索（<code>session_search</code>）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>容量</td>
                  <td>約1,300トークン相当</td>
                  <td>無制限（全セッション）</td>
                </tr>
                <tr>
                  <td>速度</td>
                  <td>即時（システムプロンプト内）</td>
                  <td>FTS5クエリで約20ms</td>
                </tr>
                <tr>
                  <td>コスト</td>
                  <td>毎回のプロンプトにトークンコストが発生</td>
                  <td>オンデマンド、LLM呼び出し不要</td>
                </tr>
                <tr>
                  <td>用途</td>
                  <td>常に必要な重要事実</td>
                  <td>「先週これについて話したか」の検索</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>使い分けの指針</strong>: 「常にコンテキストにあるべき事実」はメモリへ、「特定の過去の会話を思い出したい」場合はセッション検索へ、と役割を明確に分離する。
          </p>

          <h3 id="46-外部メモリプロバイダ">4.6 外部メモリプロバイダ</h3>
          <p>
            MEMORY.md/USER.mdを超える深いメモリが必要な場合、Honcho・OpenViking・Mem0・Hindsight・Holographic・RetainDB・ByteRover・Supermemoryの8種の外部メモリプロバイダプラグインが用意されている。これらは組み込みメモリを置き換えるのではなく<strong>並行して動作</strong>し、知識グラフ・意味検索・自動事実抽出・セッション横断のユーザーモデリングを追加する。<code>hermes memory setup</code>対話的に選択できる。
          </p>

          <hr />

          <h2 id="5-スキルシステムとprogressive-disclosure">
            5. スキルシステムとProgressive Disclosure
          </h2>
          <h3 id="51-3段階のロード方式">5.1 3段階のロード方式</h3>
          <p>
            スキルは<Ext href="https://agentskills.io">agentskills.io</Ext>のオープン標準に準拠した、オンデマンドで読み込まれる知識ドキュメントである。トークン効率を保つため次の3段階で開示される。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_5_1} />
          </div>
          <p>
            エージェントは実際に必要になった時だけ完全な内容をロードする。すべてのスキルは<code>~/.hermes/skills/</code>を単一の情報源として保持され、<code>external_dirs</code>設定で共有ディレクトリ（複数ツール共通の<code>~/.agents/skills/</code>など）を追加でスキャンさせることもできる。
          </p>

          <h3 id="52-skillmdフォーマットの要点">5.2 SKILL.mdフォーマットの要点</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}><span className={styles.cm}>---</span></div>
            <div className={styles.codeLine}><span className={styles.ck}>name:</span> <span className={styles.cs}>my-skill</span></div>
            <div className={styles.codeLine}><span className={styles.ck}>description:</span> <span className={styles.cs}>このスキルが何をするかの簡潔な説明</span></div>
            <div className={styles.codeLine}><span className={styles.ck}>version:</span> <span className={styles.cs}>1.0.0</span></div>
            <div className={styles.codeLine}><span className={styles.ck}>platforms:</span> [<span className={styles.cs}>macos</span>, <span className={styles.cs}>linux</span>]</div>
            <div className={styles.codeLine}><span className={styles.ck}>metadata:</span></div>
            <div className={styles.codeLine}>  <span className={styles.cv}>hermes:</span></div>
            <div className={styles.codeLine}>    <span className={styles.cv}>tags:</span> [<span className={styles.cs}>python</span>, <span className={styles.cs}>automation</span>]</div>
            <div className={styles.codeLine}>    <span className={styles.cv}>category:</span> <span className={styles.cs}>devops</span></div>
            <div className={styles.codeLine}>    <span className={styles.cv}>fallback_for_toolsets:</span> [<span className={styles.cs}>web</span>]     <span className={styles.cc}># 条件付き活性化：このtoolsetが無い時だけ表示</span></div>
            <div className={styles.codeLine}>    <span className={styles.cv}>requires_toolsets:</span> [<span className={styles.cs}>terminal</span>]    <span className={styles.cc}># 条件付き活性化：このtoolsetがある時だけ表示</span></div>
            <div className={styles.codeLine}><span className={styles.cm}>---</span></div>
          </div>
          <p>
            <code>fallback_for_toolsets</code>は特に有用なパターンで、有料ツール（例: Web検索）が利用不可の時にだけ無料の代替スキル（DuckDuckGo検索など）を表示させる、というフォールバック設計を宣言的に書ける。
          </p>

          <h3 id="53-learnでスキルを素早く作る">5.3 <code>/learn</code>でスキルを素早く作る</h3>
          <p>
            手作業でSKILL.mdを書く代わりに、<code>/learn</code>はエージェントに既存の知識・資料からスキルを自動生成させるコマンドである。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>/learn ~/projects/acme-sdk のRESTクライアントを、認証とページネーションに焦点を当てて</div>
            <div className={styles.codeLine}>/learn https://docs.example.com/api/quickstart</div>
            <div className={styles.codeLine}>/learn さっきやったステージングサーバーへのデプロイ手順</div>
          </div>
          <p>
            CLI・ゲートウェイ・TUI・ダッシュボードのいずれからでも同じように動作し、実際に稼働中のエージェントが情報収集からSKILL.md執筆まで行うため、専用の取り込みエンジンは存在しない。
          </p>

          <h3 id="54-スキルバンドルで複数スキルを1コマンド化">
            5.4 スキルバンドルで複数スキルを1コマンド化
          </h3>
          <p>
            頻繁に組み合わせて使うスキル群は、YAMLベースの「バンドル」として1つのスラッシュコマンドにまとめられる。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}><span className={styles.ck}>hermes</span> bundles create backend-dev \</div>
            <div className={styles.codeLine}>  --skill github-code-review \</div>
            <div className={styles.codeLine}>  --skill test-driven-development \</div>
            <div className={styles.codeLine}>  --skill github-pr-workflow \</div>
            <div className={styles.codeLine}>  -d &quot;バックエンド機能開発：レビュー・テスト・PRワークフロー&quot;</div>
          </div>
          <p>
            以後<code>/backend-dev 認証ミドルウェアをリファクタリングして</code>と打つだけで、3つのスキルが同時にロードされる。バンドルはスキル名の衝突時に個別スキルより優先される点に注意する。
          </p>

          <h3 id="55-エージェントによる自己改善skill_manage">
            5.5 エージェントによる自己改善（<code>skill_manage</code>）
          </h3>
          <p>
            エージェントは複雑なタスク（5回以上のツール呼び出し）を完了した後、エラーから抜け出す方法を発見した後、あるいはユーザーに訂正された後に、自発的にスキルを作成する。<code>create</code> / <code>patch</code>（推奨・差分のみで効率的）/ <code>edit</code> / <code>delete</code> / <code>write_file</code> / <code>remove_file</code>の6アクションがある。
          </p>

          <h3 id="56-skills-hubとトラストレベル">5.6 Skills Hubとトラスト・レベル</h3>
          <p>
            外部のスキルエコシステムとして、公式オプションスキル・skills.sh（Vercel運営）・well-known エンドポイント（<code>/.well-known/skills/index.json</code>）・GitHubタップ（openai/skills、anthropics/skills、huggingface/skills、NVIDIA/skillsなど）・ClawHub・LobeHub・browse.sh（Browserbase運営の200以上のサイト別ブラウザ自動化スキル集）が統合されている。
          </p>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>トラストレベル</th>
                  <th>ソース</th>
                  <th>ポリシー</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>builtin</code></td>
                  <td>Hermes本体に同梱</td>
                  <td>常に信頼</td>
                </tr>
                <tr>
                  <td><code>official</code></td>
                  <td>リポジトリの<code>optional-skills/</code></td>
                  <td>組み込み信頼、警告表示なし</td>
                </tr>
                <tr>
                  <td><code>trusted</code></td>
                  <td>openai/skills、anthropics/skills等の指定レジストリ</td>
                  <td>コミュニティより緩やかなポリシー</td>
                </tr>
                <tr>
                  <td><code>community</code></td>
                  <td>skills.sh・well-known・カスタムGitHubリポジトリ等</td>
                  <td>
                    危険でない指摘は<code>--force</code>で上書き可能。<code>dangerous</code>判定は上書き不可
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            すべてのハブ経由インストールは、データ漏洩・プロンプトインジェクション・破壊的コマンド・サプライチェーン兆候を検査するセキュリティスキャナを通過する。<strong>未検証のコミュニティスキルを本番プロファイルにインストールする前には、必ず<code>hermes skills inspect</code>でプレビューする</strong>のがベストプラクティスである。
          </p>

          <hr />

          <h2 id="6-curatorによるスキルの自動メンテナンス">
            6. Curatorによるスキルの自動メンテナンス
          </h2>
          <p>
            エージェントが問題を解決するたびにスキルを保存し続けると、似たようなスキルが乱立してカタログを汚染し、トークンを浪費する。Curatorはこれを防ぐバックグラウンドメンテナンス機構である。
          </p>

          <h3 id="61-ライフサイクル">6.1 ライフサイクル</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_6_1} />
          </div>
          <p>
            Curatorが管理するのは「<strong>エージェント作成</strong>」と明示的にマークされたスキルのみである。具体的には、バックグラウンドの自己改善レビュー（約10ターンごとに実行）が生成したアンブレラスキルがこれに該当し、ユーザーが手動作成したスキルや、フォアグラウンド会話中にエージェントへ依頼して作らせたスキルは対象外となる。バンドル済み・ハブインストール済みスキルは原則対象外だが、<code>curator.prune_builtins: true</code>（デフォルト）の場合のみ、未使用のバンドルスキルが90日後にアーカイブされる（削除ではなく退避）。
          </p>

          <h3 id="62-実行タイミングと安全策">6.2 実行タイミングと安全策</h3>
          <p>
            Curatorはcronデーモンではなく、<strong>非アクティブ検知</strong>によって起動する。CLIセッション開始時、およびゲートウェイのcronティッカー内で、前回実行から<code>interval_hours</code>（デフォルト7日）が経過し、かつ<code>min_idle_hours</code>（デフォルト2時間）以上アイドルであった場合にのみバックグラウンドフォークとして走る。新規インストール直後は最初の実行が1インターバル分先送りされ、ユーザーがスキルライブラリを確認したりピン留めしたりする猶予が確保される。
          </p>
          <p>実行は2フェーズに分かれる。</p>
          <ol>
            <li>
              <strong>自動遷移</strong>（決定的・LLM不使用）: 30日/90日ルールによる<code>active → stale → archived</code>の遷移
            </li>
            <li>
              <strong>LLM統合レビュー</strong>（デフォルトOFF、<code>curator.consolidate: true</code>で有効化）: 補助モデルが重複スキルの統合・パッチ・アーカイブを提案する
            </li>
          </ol>

          <h3 id="63-バックアップとロールバック">6.3 バックアップとロールバック</h3>
          <p>
            実際のCurator実行の前には必ず<code>~/.hermes/skills/.curator_backups/</code>にtar.gzスナップショットが作成される。想定外の変更があった場合は次の1コマンドで即座に復元できる。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}><span className={styles.ck}>hermes</span> curator rollback        <span className={styles.cc}># 最新スナップショットへ復元（確認あり）</span></div>
            <div className={styles.codeLine}><span className={styles.ck}>hermes</span> curator rollback --list <span className={styles.cc}># スナップショット一覧</span></div>
          </div>
          <p>
            ロールバック自体も「ロールバック前」のスナップショットを取ってから実行されるため、誤ロールバックすら取り消せる。<strong>本番運用では<code>curator.backup.enabled</code>を明示的にtrueのままにしておくこと</strong>、そして<code>/plan</code>のようなスラッシュコマンドが依存する保護対象ビルトインスキルは、<code>prune_builtins</code>設定に関わらずCuratorの候補リストから常に除外される点も押さえておきたい。
          </p>

          <hr />

          <h2 id="7-コンテキストファイル戦略agentsmd--soulmd">
            7. コンテキストファイル戦略（AGENTS.md / SOUL.md）
          </h2>
          <h3 id="71-優先順位システム">7.1 優先順位システム</h3>
          <p>
            プロジェクトコンテキストファイルは<strong>1セッションにつき1種類のみ</strong>ロードされる。優先順位は次の通りで、最初に見つかったものが採用される。
          </p>
          <p>
            <code>.hermes.md</code>（<code>HERMES.md</code>も可）→ <code>AGENTS.md</code> → <code>CLAUDE.md</code> → <code>.cursorrules</code>
          </p>
          <p>
            一方、<code>SOUL.md</code>は常に独立してロードされる（Hermesインスタンス全体のペルソナ層）。<code>HERMES_HOME</code>直下からのみ読み込まれ、作業ディレクトリは探索しない。
          </p>

          <h3 id="72-段階的サブディレクトリ発見">7.2 段階的サブディレクトリ発見</h3>
          <p>
            モノレポで各サブディレクトリに個別の規約がある場合、起動時にすべてを読み込む必要はない。エージェントが<code>read_file</code>や<code>terminal</code>でそのディレクトリに触れた瞬間に、該当する<code>AGENTS.md</code>が遅延発見されてツール結果に注入される仕組みになっている。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>my-project/</div>
            <div className={styles.codeLine}>  AGENTS.md              ← セッション開始時にロード</div>
            <div className={styles.codeLine}>  frontend/AGENTS.md     ← frontend/ 配下を読んだ時に発見</div>
            <div className={styles.codeLine}>  backend/AGENTS.md      ← backend/ 配下を読んだ時に発見</div>
          </div>
          <p>
            この設計には2つの利点がある。第一にシステムプロンプトが肥大化しない。第二にプロンプトキャッシュが維持される（サブディレクトリのヒントは会話履歴に追記されるだけで、システムプロンプト自体は変化しない）。
          </p>

          <h3 id="73-効果的なagentsmdの書き方">7.3 効果的なAGENTS.mdの書き方</h3>
          <p>公式のベストプラクティスとして次の5点が挙げられている。</p>
          <ol>
            <li>
              <strong>簡潔に保つ</strong> — 設定した<code>context_file_max_chars</code>（デフォルト2万文字）以内に収める。毎ターン読み込まれるコストを意識する
            </li>
            <li>
              <strong>見出しで構造化する</strong> — アーキテクチャ・規約・注意事項を<code>##</code>セクションで分ける
            </li>
            <li><strong>具体例を含める</strong> — 望ましいコードパターン・API形状・命名規則を示す</li>
            <li>
              <strong>やってはいけないことを明記する</strong> — 「マイグレーションファイルを直接編集しない」など
            </li>
            <li>
              <strong>重要なパス・ポート番号を列挙する</strong> — エージェントがターミナルコマンドで使う
            </li>
          </ol>

          <h3 id="74-プロンプトインジェクション対策">7.4 プロンプトインジェクション対策</h3>
          <p>
            すべてのコンテキストファイルは読み込み前にスキャンされ、「以前の指示を無視しろ」といった指示上書き試行、非表示のHTMLコメント、認証情報の窃取パターン（<code>curl ... $API_KEY</code>など）、不可視Unicode文字（ゼロ幅スペース、双方向オーバーライド）が検出されるとブロックされる。<strong>共有リポジトリ内のAGENTS.mdは、この自動スキャンだけに頼らず、自分でも内容を確認する</strong>ことが推奨されている。
          </p>

          <hr />

          <h2 id="8-サブエージェント委任delegation">8. サブエージェント委任（Delegation）</h2>
          <h3 id="81-サブエージェントは何も知らない">8.1 サブエージェントは「何も知らない」</h3>
          <p>
            <code>delegate_task</code>が生成する子エージェントは完全にフレッシュな会話から始まる。親の会話履歴・過去のツール呼び出し・議論内容について一切の知識を持たない。したがって、<code>goal</code>と<code>context</code>パラメータに<strong>子が必要とするすべて</strong>を明示的に渡す必要がある。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}><span className={styles.cc}># 悪い例：「そのエラー」が何か子には分からない</span></div>
            <div className={styles.codeLine}>delegate_task(goal=<span className={styles.cs}>&quot;そのエラーを直して&quot;</span>)</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}><span className={styles.cc}># 良い例：子が必要とする情報を全て含む</span></div>
            <div className={styles.codeLine}>delegate_task(</div>
            <div className={styles.codeLine}>    goal=<span className={styles.cs}>&quot;api/handlers.py の TypeError を修正&quot;</span>,</div>
            <div className={styles.codeLine}>    context=<span className={styles.cs}>&quot;&quot;&quot;47行目でTypeError: &apos;NoneType&apos; object has no attribute &apos;get&apos;。</span></div>
            <div className={styles.codeLine}><span className={styles.cs}>    process_request() が parse_body() からNoneを受け取っている。</span></div>
            <div className={styles.codeLine}><span className={styles.cs}>    プロジェクトは /home/user/myproject、Python 3.11。&quot;&quot;&quot;</span></div>
            <div className={styles.codeLine}>)</div>
          </div>

          <h3 id="82-単発-vs-並列バッチ">8.2 単発 vs 並列バッチ</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}><span className={styles.cc}># 単発</span></div>
            <div className={styles.codeLine}>delegate_task(goal=<span className={styles.cs}>&quot;テスト失敗の原因を調査&quot;</span>, context=<span className={styles.cs}>&quot;...&quot;</span>)</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}><span className={styles.cc}># 並列バッチ（デフォルト最大3並列、設定変更可）</span></div>
            <div className={styles.codeLine}>delegate_task(tasks=[</div>
            <div className={styles.codeLine}>    &#123;<span className={styles.cs}>&quot;goal&quot;</span>: <span className={styles.cs}>&quot;話題Aを調査&quot;</span>, <span className={styles.cs}>&quot;context&quot;</span>: <span className={styles.cs}>&quot;...&quot;</span>&#125;,</div>
            <div className={styles.codeLine}>    &#123;<span className={styles.cs}>&quot;goal&quot;</span>: <span className={styles.cs}>&quot;話題Bを調査&quot;</span>, <span className={styles.cs}>&quot;context&quot;</span>: <span className={styles.cs}>&quot;...&quot;</span>&#125;,</div>
            <div className={styles.codeLine}>    &#123;<span className={styles.cs}>&quot;goal&quot;</span>: <span className={styles.cs}>&quot;ビルドを修正&quot;</span>, <span className={styles.cs}>&quot;context&quot;</span>: <span className={styles.cs}>&quot;...&quot;</span>&#125;,</div>
            <div className={styles.codeLine}>])</div>
          </div>

          <h3 id="83-深さ制限とオーケストレーション">8.3 深さ制限とオーケストレーション</h3>
          <p>
            デフォルトでは委任は<strong>フラット</strong>（親→子の1階層のみ、子はさらに委任できない）。多段階ワークフロー（調査→統合など）が必要な場合のみ、<code>role="orchestrator"</code>の子を作る。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_8_1} />
          </div>
          <p>
            <code>max_spawn_depth: 3</code>かつ<code>max_concurrent_children: 3</code>を組み合わせると理論上3×3×3=27の並列leafエージェントが生まれうる点はコスト上の注意点として明記されている。深さを上げる際は意図的に行うべきである。
          </p>

          <h3 id="84-delegate_task-と-execute_code-の使い分け">
            8.4 delegate_task と execute_code の使い分け
          </h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th><code>delegate_task</code></th>
                  <th><code>execute_code</code></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>推論</td>
                  <td>フルLLM推論ループ</td>
                  <td>Pythonコード実行のみ（推論なし）</td>
                </tr>
                <tr>
                  <td>コンテキスト</td>
                  <td>独立した新規会話</td>
                  <td>会話なし、スクリプトのみ</td>
                </tr>
                <tr>
                  <td>並列性</td>
                  <td>デフォルト3並列</td>
                  <td>単一スクリプト</td>
                </tr>
                <tr>
                  <td>向いている用途</td>
                  <td>判断・推論を要する複雑なタスク</td>
                  <td>機械的な多段パイプライン</td>
                </tr>
                <tr>
                  <td>トークンコスト</td>
                  <td>高い（フルLLMループ）</td>
                  <td>低い（標準出力のみ返る）</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>判断基準</strong>: サブタスクが推論・判断・多段階の問題解決を要するなら<code>delegate_task</code>、機械的なデータ処理やスクリプト化されたワークフローなら<code>execute_code</code>を選ぶ。
          </p>

          <h3 id="85-恒久実行が必要な場合">8.5 恒久実行が必要な場合</h3>
          <p>
            セッションが閉じられても・プロセスが再起動してもタスクを継続させたい場合、<code>delegate_task</code>は不向きである（プロセス再起動後の子は<code>unknown</code>扱いになり再開されない）。代わりに以下を使う。
          </p>
          <ul>
            <li>
              <code>cronjob(action="create")</code> ― 独立したエージェント実行としてスケジュールし、親ターンの中断の影響を受けない
            </li>
            <li>
              <code>terminal(background=True, notify_on_complete=True)</code> ― 長時間シェルコマンドをバックグラウンドで継続
            </li>
          </ul>

          <hr />

          <h2 id="9-execute_codeによるトークン最適化">9. execute_codeによるトークン最適化</h2>
          <p>
            <code>execute_code</code>は、Hermesツールをプログラム的に呼び出すPythonスクリプトをエージェントに書かせ、多段階ワークフローを1回のLLMターンに圧縮する仕組みである。スクリプトは子プロセスとして動作し、Unixドメインソケット経由のRPCでツールを呼び出す。<strong>中間結果はコンテキストウィンドウに一切入らず、<code>print()</code>の出力のみがLLMに返る</strong>点が最大の利点である。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}><span className={styles.ck}>from</span> hermes_tools <span className={styles.ck}>import</span> web_search, web_extract</div>
            <div className={styles.codeLine}><span className={styles.ck}>import</span> json</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>results = web_search(<span className={styles.cs}>&quot;Rust async runtime 比較 2025&quot;</span>, limit=5)</div>
            <div className={styles.codeLine}>summaries = []</div>
            <div className={styles.codeLine}><span className={styles.ck}>for</span> r <span className={styles.ck}>in</span> results[<span className={styles.cs}>&quot;data&quot;</span>][<span className={styles.cs}>&quot;web&quot;</span>]:</div>
            <div className={styles.codeLine}>    page = web_extract([r[<span className={styles.cs}>&quot;url&quot;</span>]])</div>
            <div className={styles.codeLine}>    <span className={styles.ck}>for</span> p <span className={styles.ck}>in</span> page.get(<span className={styles.cs}>&quot;results&quot;</span>, []):</div>
            <div className={styles.codeLine}>        <span className={styles.ck}>if</span> p.get(<span className={styles.cs}>&quot;content&quot;</span>):</div>
            <div className={styles.codeLine}>            summaries.append(&#123;<span className={styles.cs}>&quot;title&quot;</span>: r[<span className={styles.cs}>&quot;title&quot;</span>], <span className={styles.cs}>&quot;excerpt&quot;</span>: p[<span className={styles.cs}>&quot;content&quot;</span>][:500]&#125;)</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>print(json.dumps(summaries, ensure_ascii=False, indent=2))</div>
          </div>

          <h3 id="91-使うべき場面">9.1 使うべき場面</h3>
          <ul>
            <li>3回以上のツール呼び出しに処理ロジックが挟まる場合</li>
            <li>大量データのフィルタリングや条件分岐</li>
            <li>検索結果に対するループ処理</li>
          </ul>

          <h3 id="92-実行モードとリソース制限">9.2 実行モードとリソース制限</h3>
          <p>
            <code>code_execution.mode</code>は<code>project</code>（デフォルト、アクティブな仮想環境のPythonを使用し作業ディレクトリもセッションと同じ）と<code>strict</code>（Hermes自身のPythonを使い、隔離された一時ディレクトリで実行）の2種類がある。再現性を最優先するCI的な用途では<code>strict</code>、通常の開発作業では<code>project</code>が適する。
          </p>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>リソース</th>
                  <th>上限</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>タイムアウト</td>
                  <td>300秒（SIGTERM→5秒後SIGKILL）</td>
                </tr>
                <tr>
                  <td>標準出力</td>
                  <td>50KB（超過分は切り詰め）</td>
                </tr>
                <tr>
                  <td>標準エラー</td>
                  <td>10KB（非ゼロ終了時のみ出力に含まれる）</td>
                </tr>
                <tr>
                  <td>ツール呼び出し回数</td>
                  <td>実行あたり50回</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            セキュリティ面では、子プロセスは<code>KEY</code> / <code>TOKEN</code> / <code>SECRET</code> / <code>PASSWORD</code> / <code>CREDENTIAL</code> / <code>AUTH</code>を含む環境変数名をすべて除去した最小権限環境で動く。スキルが<code>required_environment_variables</code>を宣言していれば、そのスキルロード後は該当変数のみ自動的に通過する。この仕組みにより「任意コード実行だが秘密情報は漏れない」というバランスを取っている。
          </p>
          <p>
            <strong>プラットフォーム制限</strong>: Unixドメインソケットに依存するため<strong>Linux/macOSのみ</strong>対応。Windowsでは自動的に無効化され、通常の逐次ツール呼び出しにフォールバックする。
          </p>

          <hr />

          <h2 id="10-persistent-goalsgoal-ralph-loopの実践">
            10. Persistent Goals（/goal）― Ralph loopの実践
          </h2>
          <h3 id="101-概要と出典">10.1 概要と出典</h3>
          <p>
            <code>/goal</code>は、ターンをまたいで生き続ける目標をエージェントに与える機能である。毎ターン後、補助モデル（judge）がゴールが達成されたかを判定し、未達なら継続プロンプトを自動投入して作業を続けさせる。これはOpenAIのCodex CLI 0.128.0（Eric Traut氏実装）が普及させた「Ralph loop」パターンへの、Hermes独自実装によるオマージュである。「ゴールが達成されるまで止まらない」という中核アイデアはCodex由来であることが公式ドキュメントに明記されている。
          </p>

          <h3 id="102-使うべき場面">10.2 使うべき場面</h3>
          <p>「3回も『続けて』と言うことになりそうなタスク」がまさに<code>/goal</code>の適用対象である。</p>
          <ul>
            <li><code>src/</code>内のすべてのlintエラーを修正し<code>ruff check</code>を通す</li>
            <li>リポジトリYの機能Xをテスト込みで移植し、CIをグリーンにする</li>
            <li>セッションID漂流の原因を調査してレポートを書く</li>
          </ul>
          <p>1ターンで完結するタスクには不要である。</p>

          <h3 id="103-動作の仕組み">10.3 動作の仕組み</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_10_1} />
          </div>
          <p>
            judgeは意図的に保守的に設計されており、「応答が明示的にゴール完了を確認している」「成果物が明確に生成されている」「ゴールが達成不能・ブロックされている」場合のみ<code>done</code>と判定する。judge自体がエラーを返した場合は<code>continue</code>扱いとなり（フェイルオープン）、暴走を防ぐ最終防波堤はターン予算（デフォルト20、<code>goals.max_turns</code>で変更可）である。
          </p>

          <h3 id="104-実務上の注意点">10.4 実務上の注意点</h3>
          <ul>
            <li>
              ゴール実行中にユーザーが実際にメッセージを送ると、それは継続ループより<strong>常に優先</strong>される
            </li>
            <li>
              ゴール実行中に<strong>新しい</strong>ゴールを設定しようとすると拒否される。先に<code>/stop</code>してから再設定する
            </li>
            <li>
              継続プロンプトは通常のuser roleメッセージとして追記されるだけで、システムプロンプトを変更しないため、20ターンのゴール実行は20ターンの通常会話と<strong>同じキャッシュコスト</strong>で済む
            </li>
            <li>
              judgeの誤判定（早すぎる<code>done</code>、または<code>continue</code>し続ける）はどちらも起こりうる。前者は追加メッセージで継続させ、後者はターン予算が保険になる
            </li>
          </ul>

          <hr />

          <h2 id="11-cron自動化のベストプラクティス">11. Cron自動化のベストプラクティス</h2>
          <h3 id="111-スケジュール形式">11.1 スケジュール形式</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>30m             → 30分後に1回</div>
            <div className={styles.codeLine}>every 2h        → 2時間ごとに繰り返し</div>
            <div className={styles.codeLine}>0 9 * * *       → 毎日9:00（cron式）</div>
            <div className={styles.codeLine}>0 9 * * 1-5     → 平日9:00</div>
            <div className={styles.codeLine}>2026-03-15T09:00:00 → 特定日時に1回（ISO形式）</div>
          </div>

          <h3 id="112-自己完結したプロンプトが必須">11.2 自己完結したプロンプトが必須</h3>
          <p>
            Cronジョブは<strong>完全にフレッシュなセッション</strong>で実行される。スキルが提供しない情報はすべてプロンプト自体に含める必要がある。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>悪い例: 「サーバーの件を確認して」</div>
            <div className={styles.codeLine}>良い例: 「192.168.1.100にdeployユーザーでSSHし、</div>
            <div className={styles.codeLine}>        systemctl status nginx でnginxの稼働を確認し、</div>
            <div className={styles.codeLine}>        https://example.com がHTTP 200を返すか検証して」</div>
          </div>

          <h3 id="113-ジョブの連鎖context_from">11.3 ジョブの連鎖（<code>context_from</code>）</h3>
          <p>
            複数ジョブをパイプライン化したい場合、<code>context_from</code>で前段ジョブの最新出力を後段ジョブのプロンプトへ自動的に前置できる。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_11_1} />
          </div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>cronjob(action=<span className={styles.cs}>&quot;create&quot;</span>, prompt=<span className={styles.cs}>&quot;...&quot;</span>, schedule=<span className={styles.cs}>&quot;0 7 * * *&quot;</span>, name=<span className={styles.cs}>&quot;AI News Collector&quot;</span>)</div>
            <div className={styles.codeLine}>cronjob(action=<span className={styles.cs}>&quot;create&quot;</span>, prompt=<span className={styles.cs}>&quot;...&quot;</span>, schedule=<span className={styles.cs}>&quot;30 7 * * *&quot;</span>,</div>
            <div className={styles.codeLine}>        context_from=<span className={styles.cs}>&quot;&lt;job1_id&gt;&quot;</span>, name=<span className={styles.cs}>&quot;AI News Triage&quot;</span>)</div>
            <div className={styles.codeLine}>cronjob(action=<span className={styles.cs}>&quot;create&quot;</span>, prompt=<span className={styles.cs}>&quot;...&quot;</span>, schedule=<span className={styles.cs}>&quot;0 8 * * *&quot;</span>,</div>
            <div className={styles.codeLine}>        context_from=<span className={styles.cs}>&quot;&lt;job2_id&gt;&quot;</span>, name=<span className={styles.cs}>&quot;AI News Brief&quot;</span>)</div>
          </div>
          <p>各ジョブは<code>context_from</code>が指す先の<strong>直近の完了済み出力</strong>を読むだけで、他ジョブの完了を待つわけではない点に注意する。</p>

          <h3 id="114-コストゼロのゲートwakeagent">
            11.4 コストゼロのゲート：<code>wakeAgent</code>
          </h3>
          <p>
            高頻度（1〜5分おき）のポーリングジョブで、状態に変化がない限りLLMを起動したくない場合、事前チェックスクリプトの最終行に次を出力させることで、そのティックのエージェント起動自体をスキップできる。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>&#123;<span className={styles.cs}>&quot;wakeAgent&quot;</span>: <span className={styles.ck}>false</span>&#125;</div>
          </div>
          <p>
            ファイル変更ゲート・外部フラグゲート・SQL件数ゲートなど、この仕組みで大半の「変化があった時だけ動かす」ユースケースを$0で実現できる。さらに徹底したいなら、LLMを一切介さない<strong>no-agent モード</strong>（<code>no_agent=True</code>）でスクリプトの標準出力をそのまま配信するワークドッグ運用も可能である。
          </p>

          <h3 id="115-モデルプロバイダのスナップショット">
            11.5 モデル・プロバイダのスナップショット
          </h3>
          <p>
            未指定（provider/modelを明示しない）で作成されたジョブは、作成時点のグローバルデフォルトを<strong>スナップショット</strong>する。後でグローバルデフォルトを変更しても、そのジョブは<strong>フェイルクローズ</strong>する（推論を呼ばず、実行をスキップしてアラートを送る）。これは「意図せず有料プロバイダへ切り替わって課金される」事故を防ぐ設計であり、変更を追随させたい場合は明示的にジョブを更新してピン留めし直す必要がある。
          </p>

          <h3 id="116-ワークディレクトリとagentsmd">11.6 ワークディレクトリとAGENTS.md</h3>
          <p>
            Cronジョブはデフォルトでどのリポジトリからも切り離されて動く（AGENTS.md等はロードされない）。<code>workdir</code>を指定するとそのディレクトリのAGENTS.md/CLAUDE.md/.cursorrulesが注入され、terminal・file系ツールもそのディレクトリを基準に動作する。ただし<code>workdir</code>付きジョブは並列プールではなく<strong>シーケンシャル</strong>に実行される点（プロセスグローバルなcwd状態の衝突を避けるため）は把握しておく必要がある。
          </p>

          <hr />

          <h2 id="12-mcp統合のベストプラクティス">12. MCP統合のベストプラクティス</h2>
          <h3 id="121-サーバー種別と設定">12.1 サーバー種別と設定</h3>
          <p>
            MCP（Model Context Protocol）は外部ツールサーバーに接続する標準規格である。Hermesはstdioサーバー（ローカルサブプロセス）とHTTPサーバー（リモートエンドポイント）の両方を同じ設定ファイルで扱える。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}><span className={styles.ck}>mcp_servers:</span></div>
            <div className={styles.codeLine}>  <span className={styles.cv}>filesystem:</span></div>
            <div className={styles.codeLine}>    <span className={styles.cv}>command:</span> <span className={styles.cs}>&quot;npx&quot;</span></div>
            <div className={styles.codeLine}>    <span className={styles.cv}>args:</span> [<span className={styles.cs}>&quot;-y&quot;</span>, <span className={styles.cs}>&quot;@modelcontextprotocol/server-filesystem&quot;</span>, <span className={styles.cs}>&quot;/home/user/projects&quot;</span>]</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>  <span className={styles.cv}>linear:</span></div>
            <div className={styles.codeLine}>    <span className={styles.cv}>url:</span> <span className={styles.cs}>&quot;https://mcp.linear.app/mcp&quot;</span></div>
            <div className={styles.codeLine}>    <span className={styles.cv}>auth:</span> <span className={styles.cs}>oauth</span></div>
          </div>
          <p>
            OAuth 2.1が必要なホスト型MCPサーバー（Linear・Sentry・Atlassian・Asana・Figma・Stripeなど）は<code>auth: oauth</code>を指定するだけで、Hermesがディスカバリ・動的クライアント登録・PKCE・トークンリフレッシュまで面倒を見る。
          </p>

          <h3 id="122-ツール単位のフィルタリング">12.2 ツール単位のフィルタリング</h3>
          <p>サーバー丸ごとではなく、公開するツールを絞り込むのがセキュリティ上のベストプラクティスである。</p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}><span className={styles.ck}>mcp_servers:</span></div>
            <div className={styles.codeLine}>  <span className={styles.cv}>stripe:</span></div>
            <div className={styles.codeLine}>    <span className={styles.cv}>url:</span> <span className={styles.cs}>&quot;https://mcp.stripe.com&quot;</span></div>
            <div className={styles.codeLine}>    <span className={styles.cv}>tools:</span></div>
            <div className={styles.codeLine}>      <span className={styles.cv}>exclude:</span> [<span className={styles.cs}>delete_customer</span>, <span className={styles.cs}>refund_payment</span>]</div>
          </div>
          <p>
            <code>include</code>（ホワイトリスト）と<code>exclude</code>（ブラックリスト）が両方指定された場合は<code>include</code>が優先される。すべてのツールがフィルタで除外され、かつリソース/プロンプトのユーティリティラッパーも無効化されている場合、Hermesはそのサーバーの空のツールセットを作らない（ツール一覧を汚さない）。
          </p>

          <h3 id="123-一意名前空間">12.3 一意名前空間</h3>
          <p>
            MCPツールは<code>mcp_&lt;server名&gt;_&lt;tool名&gt;</code>の形式で自動的にプレフィックスされ、組み込みツールと衝突しない。例えば<code>github</code>サーバーの<code>create-issue</code>ツールは<code>mcp_github_create_issue</code>として登録される。
          </p>

          <h3 id="124-並列実行と信頼できる用途のみ許可">12.4 並列実行と信頼できる用途のみ許可</h3>
          <p>
            読み取り専用の問い合わせなど、同時実行しても安全なツールに限り<code>supports_parallel_tool_calls: true</code>を設定すると並列実行が有効になる。書き込みを伴うツールや共有状態に触れるツールでは、競合状態のリスクを検証してから有効化すべきである。
          </p>

          <h3 id="125-資格情報の分離">12.5 資格情報の分離</h3>
          <p>
            stdioサーバーのサブプロセスには、ホストのシェル環境がそのまま渡ることはない。<code>PATH</code> / <code>HOME</code> / <code>USER</code> / <code>LANG</code>などの安全な変数と、<code>env:</code>で明示的に指定した変数のみが渡される。エラーメッセージ中のGitHub PAT・OpenAI形式キー・Bearerトークンなどは自動的に<code>[REDACTED]</code>へ置換される。
          </p>

          <h3 id="126-カタログ経由インストールの信頼モデル">
            12.6 カタログ経由インストールの信頼モデル
          </h3>
          <p>
            <code>hermes mcp catalog</code> / <code>hermes mcp install &lt;name&gt;</code>で導入できる公式カタログエントリはNousのPRレビューを経ているが、それでも<strong><code>source:</code>のリポジトリと<code>bootstrap</code>コマンドは自分の目で確認する</strong>ことが推奨されている。マニフェストは<code>optional-mcps/&lt;name&gt;/manifest.yaml</code>としてGitHub上で公開されており、インストール前にレビューできる。
          </p>

          <hr />

          <h2 id="13-本番運用のセキュリティチェックリスト">
            13. 本番運用のセキュリティ・チェックリスト
          </h2>
          <p>Hermesのセキュリティモデルは8層の多重防御として設計されている。</p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_13_1} />
          </div>

          <h3 id="131-危険コマンド承認">13.1 危険コマンド承認</h3>
          <p>
            承認モードは<code>smart</code>（補助LLMがリスクを判定、低リスクは自動承認・高リスクは自動拒否・不明確なものは人間に確認）、<code>manual</code>（常に確認）、<code>off</code>（<code>--yolo</code>相当、全チェック無効）の3種類。<strong>本番のゲートウェイでは<code>off</code>を使わない</strong>のが原則である。
          </p>
          <p>
            さらに、<code>--yolo</code>や<code>approvals.mode: off</code>を設定していても絶対に実行されない<strong>ハードラインブロックリスト</strong>が存在する。<code>rm -rf /</code>、フォーク爆弾、マウント済みルートデバイスへの<code>mkfs</code>、<code>dd if=/dev/zero of=/dev/sd*</code>などが該当し、これは承認レイヤーより手前でコマンドを止める、上書き不可能な床（floor）として機能する。
          </p>
          <p>
            ユーザー定義の拒否ルール<code>approvals.deny</code>は、この床の一段上にある編集可能なガードレールで、<code>--yolo</code>より先に評価される。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}><span className={styles.ck}>approvals:</span></div>
            <div className={styles.codeLine}>  <span className={styles.cv}>deny:</span></div>
            <div className={styles.codeLine}>    - <span className={styles.cs}>&quot;git push --force*&quot;</span></div>
            <div className={styles.codeLine}>    - <span className={styles.cs}>&quot;*curl*|*sh*&quot;</span></div>
          </div>

          <h3 id="132-コンテナバックエンドの選定">13.2 コンテナ・バックエンドの選定</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>バックエンド</th>
                  <th>隔離</th>
                  <th>危険コマンドチェック</th>
                  <th>適する用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>local</td>
                  <td>なし（ホスト上で実行）</td>
                  <td>実施される</td>
                  <td>開発・信頼できるユーザー</td>
                </tr>
                <tr>
                  <td>ssh</td>
                  <td>リモートマシン</td>
                  <td>実施される</td>
                  <td>別サーバーでの実行</td>
                </tr>
                <tr>
                  <td>docker</td>
                  <td>コンテナ</td>
                  <td>スキップ（コンテナが境界）</td>
                  <td>本番ゲートウェイ</td>
                </tr>
                <tr>
                  <td>modal / daytona</td>
                  <td>クラウドサンドボックス</td>
                  <td>スキップ</td>
                  <td>スケーラブルなクラウド隔離</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            本番のメッセージングゲートウェイでは、危険コマンド承認そのものを不要にする<strong>コンテナバックエンド（Docker/Modal/Daytona/Vercel Sandbox）の採用</strong>が推奨されている。コンテナはケイパビリティを<code>ALL</code>ドロップした上で必要最小限（<code>DAC_OVERRIDE</code>・<code>CHOWN</code>・<code>FOWNER</code>）のみ再付与し、<code>no-new-privileges</code>・プロセス数制限・サイズ制限付き<code>tmpfs</code>が既定で適用される。
          </p>

          <h3 id="133-ゲートウェイ認可">13.3 ゲートウェイ認可</h3>
          <p>
            <strong><code>GATEWAY_ALLOW_ALL_USERS=true</code>を本番で使わない</strong>ことが最重要事項である。プラットフォーム別許可リスト（<code>TELEGRAM_ALLOWED_USERS</code>など）かDMペアリング（ワンタイムコード＋所有者承認）を使う。認可チェックの優先順位は「プラットフォーム別all-allowフラグ → DMペアリング承認済みリスト → プラットフォーム別許可リスト → グローバル許可リスト → グローバルall-allow → デフォルト拒否」の順である。
          </p>

          <h3 id="134-ssrf対策とwebアクセス方針">13.4 SSRF対策とWebアクセス方針</h3>
          <p>
            Web検索・抽出・ブラウザ・vision URL取得はすべて、RFC 1918プライベートアドレス・ループバック・リンクローカル（クラウドメタデータ<code>169.254.169.254</code>含む）・CGNAT空間へのアクセスをデフォルトでブロックする。DNS解決失敗もfail-closed（ブロック扱い）として扱われ、リダイレクトチェーンもホップごとに再検証される。社内サービスへのアクセスを意図的に許可する必要がある特殊な環境でのみ<code>security.allow_private_urls: true</code>を検討する。
          </p>

          <h3 id="135-tirithによる実行前スキャン">13.5 Tirithによる実行前スキャン</h3>
          <p>
            コマンド実行前に<Ext href="https://github.com/sheeki03/tirith">tirith</Ext>というコンテンツレベルのスキャナが追加で動作し、ホモグラフURLスプーフィング（国際化ドメイン攻撃）やパイプ・トゥ・インタープリタパターン（<code>curl | bash</code>など）をパターンマッチだけでは検出できない粒度で検知する。
          </p>

          <h3 id="136-サプライチェーンアドバイザリ">13.6 サプライチェーン・アドバイザリ</h3>
          <p>
            既知の侵害されたパッケージバージョン（例として2026年5月の<code>mistralai 2.4.6</code>汚染事案が挙げられている）に一致するPythonパッケージがアクティブなvenvにないか、起動時に検査される。<code>hermes doctor</code>で詳細な是正手順を確認できる。
          </p>

          <h3 id="137-本番デプロイチェックリスト">13.7 本番デプロイ・チェックリスト</h3>
          <ol>
            <li>
              明示的な許可リストを設定する（<code>GATEWAY_ALLOW_ALL_USERS=true</code>は使わない）
            </li>
            <li>コンテナバックエンド（<code>terminal.backend: docker</code>等）を使う</li>
            <li>CPU・メモリ・ディスクのリソース制限を適切に設定する</li>
            <li><code>.env</code>のパーミッションを<code>chmod 600</code>にする</li>
            <li>DMペアリングを有効化し、ユーザーIDのハードコードを避ける</li>
            <li><code>command_allowlist</code>を定期的に監査する</li>
            <li><code>terminal.cwd</code>を機密ディレクトリに設定しない</li>
            <li>ゲートウェイをrootで実行しない</li>
            <li><code>~/.hermes/logs/</code>を監視する</li>
            <li><code>hermes update</code>を定期的に実行する</li>
          </ol>

          <hr />

          <h2 id="14-コスト最適化とプロンプトキャッシュ">14. コスト最適化とプロンプトキャッシュ</h2>
          <h3 id="141-プロンプトキャッシュを壊さない">14.1 プロンプトキャッシュを壊さない</h3>
          <p>
            多くのLLMプロバイダは会話プレフィックス（システムプロンプト＋履歴）をキャッシュする。システムプロンプトが安定していれば（同じコンテキストファイル、同じメモリ）、以降のメッセージはキャッシュヒットにより大幅に安価になる。キャッシュはモデルとアカウントに紐づくため、<code>/model</code>での明示的切り替え、自動プロバイダフォールバック、資格情報プールのローテーションはいずれも<strong>次のターンで会話全体を通常価格で再読み込みさせる</strong>。長いセッションでの頻繁なモデル切り替えはコストを大きく押し上げる。
          </p>

          <h3 id="142-実務上のコスト削減パターン">14.2 実務上のコスト削減パターン</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>手法</th>
                  <th>効果</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>/compress</code>を早めに使う</td>
                  <td>会話履歴を要約し、トークン数を大幅に削減</td>
                </tr>
                <tr>
                  <td><code>delegate_task</code>で並列調査</td>
                  <td>各サブエージェントの最終要約のみが親のコンテキストに戻る</td>
                </tr>
                <tr>
                  <td><code>execute_code</code>でバッチ処理</td>
                  <td>中間ツール結果がコンテキストに入らず、<code>print()</code>のみ返る</td>
                </tr>
                <tr>
                  <td>cronの<code>enabled_toolsets</code>を絞る</td>
                  <td>使わないtoolset（browser・delegationなど）を毎回のツールスキーマから除外</td>
                </tr>
                <tr>
                  <td>補助タスク（curator・goal judge・background review）を安価なモデルへ</td>
                  <td>メイン会話のキャッシュとは独立して低コスト化できる</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 id="143-補助モデルのルーティング">14.3 補助モデルのルーティング</h3>
          <p>
            curator・goal judge・memory/skillのバックグラウンドレビューは、いずれも独立した「補助タスク」スロットとして扱われ、メインモデルとは別のプロバイダ/モデルを指定できる。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}><span className={styles.ck}>auxiliary:</span></div>
            <div className={styles.codeLine}>  <span className={styles.cv}>background_review:</span></div>
            <div className={styles.codeLine}>    <span className={styles.cv}>provider:</span> <span className={styles.cs}>openrouter</span></div>
            <div className={styles.codeLine}>    <span className={styles.cv}>model:</span> <span className={styles.cs}>google/gemini-3-flash-preview</span></div>
            <div className={styles.codeLine}>  <span className={styles.cv}>goal_judge:</span></div>
            <div className={styles.codeLine}>    <span className={styles.cv}>provider:</span> <span className={styles.cs}>openrouter</span></div>
            <div className={styles.codeLine}>    <span className={styles.cv}>model:</span> <span className={styles.cs}>google/gemini-3-flash-preview</span></div>
          </div>
          <p>
            メインモデルと異なるモデルを指定した場合、そのレビューはメインの会話プレフィックスキャッシュを再利用できないため、直近ターン＋古い部分の要約という「ダイジェスト」形式で会話を再現し、新しいキャッシュへの書き込みコストを最小化する設計になっている。
          </p>

          <hr />

          <h2 id="15-トラブルシューティング">15. トラブルシューティング</h2>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_15_1} />
          </div>

          <h3 id="151-よくある落とし穴">15.1 よくある落とし穴</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>症状</th>
                  <th>主な原因</th>
                  <th>対処</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>MCPツールが一覧に出ない</td>
                  <td>サーバー未接続・フィルタで除外・<code>enabled: false</code></td>
                  <td><code>/reload-mcp</code>後にログ確認、<code>tools.include</code>を見直す</td>
                </tr>
                <tr>
                  <td>Docker内でユーザーがpairing approveできない</td>
                  <td><code>docker exec</code>がデフォルトでrootになりファイル権限が合わない</td>
                  <td><code>docker exec -u hermes ...</code>で実行する</td>
                </tr>
                <tr>
                  <td>cronジョブが急に課金モデルに切り替わって驚いた</td>
                  <td>グローバルデフォルト変更前に作成したジョブがスナップショットを保持</td>
                  <td>
                    ジョブは意図通りフェイルクローズしている。明示的に<code>provider</code>/<code>model</code>をピン留めする
                  </td>
                </tr>
                <tr>
                  <td>OAuth MCPサーバーでトークンが取得できているように見えるが実際は失敗</td>
                  <td>
                    一部プロバイダ（Google Drive等）が動的クライアント登録を拒否しつつ<code>tools/list</code>は無認証で応答する
                  </td>
                  <td>
                    独自OAuthクライアントを作成し<code>oauth.client_id</code>/<code>client_secret</code>を設定する
                  </td>
                </tr>
                <tr>
                  <td>長時間セッションで応答が遅い・高コスト</td>
                  <td>プロンプトキャッシュが頻繁なモデル切り替えで破棄されている</td>
                  <td>モデル切り替え頻度を下げる、<code>/compress</code>を使う</td>
                </tr>
                <tr>
                  <td>Windowsでexecute_codeが動かない</td>
                  <td>Unixドメインソケット非対応</td>
                  <td>仕様通り。<code>terminal</code>ツールへのフォールバックを前提に設計する</td>
                </tr>
              </tbody>
            </table>
          </div>

          <hr />

          <h2 id="16-ベストプラクティス総括チェックリスト">
            16. ベストプラクティス総括チェックリスト
          </h2>
          <ul className={`${styles.checklistGrid} task-list`}>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-1" />
              <label htmlFor="chk-1" className={styles.checklistText}>
                プロファイルを用途別（開発／本番／検証）に分離している
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-2" />
              <label htmlFor="chk-2" className={styles.checklistText}>
                MEMORY.md/USER.mdの容量が80%を超えたら統合する運用にしている
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-3" />
              <label htmlFor="chk-3" className={styles.checklistText}>
                メモリ・スキルの<code>write_approval</code>を、信頼度に応じて有効化するか判断済み
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-4" />
              <label htmlFor="chk-4" className={styles.checklistText}>
                AGENTS.mdは<code>context_file_max_chars</code>以内に収め、やってはいけないことを明記している
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-5" />
              <label htmlFor="chk-5" className={styles.checklistText}>
                サブエージェントへの委任では<code>goal</code>と<code>context</code>に必要な情報を過不足なく詰めている
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-6" />
              <label htmlFor="chk-6" className={styles.checklistText}>
                恒久実行が必要な処理は<code>delegate_task</code>ではなく<code>cronjob</code>/<code>background terminal</code>を使っている
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-7" />
              <label htmlFor="chk-7" className={styles.checklistText}>
                Cronジョブのプロンプトは完全に自己完結している
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-8" />
              <label htmlFor="chk-8" className={styles.checklistText}>
                高頻度ポーリングジョブには<code>wakeAgent</code>ゲートを設けてLLM起動コストを削減している
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-9" />
              <label htmlFor="chk-9" className={styles.checklistText}>
                本番ゲートウェイは<code>GATEWAY_ALLOW_ALL_USERS=true</code>を使わず、許可リストかDMペアリングを使っている
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-10" />
              <label htmlFor="chk-10" className={styles.checklistText}>
                本番ゲートウェイはコンテナバックエンド（Docker/Modal/Daytona）で動かしている
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-11" />
              <label htmlFor="chk-11" className={styles.checklistText}>
                MCPサーバーは<code>tools.include</code>/<code>exclude</code>でツール単位に絞り込んでいる
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-12" />
              <label htmlFor="chk-12" className={styles.checklistText}>
                コミュニティ製スキル・MCPは<code>hermes skills inspect</code>等でレビューしてから導入している
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-13" />
              <label htmlFor="chk-13" className={styles.checklistText}>
                モデル切り替え頻度を抑え、プロンプトキャッシュのヒット率を意識している
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-14" />
              <label htmlFor="chk-14" className={styles.checklistText}>
                Curatorのバックアップ（<code>curator.backup.enabled</code>）を有効なままにしている
              </label>
            </li>
            <li className={styles.checklistItem}>
              <input type="checkbox" id="chk-15" />
              <label htmlFor="chk-15" className={styles.checklistText}>
                <code>hermes update</code>を定期的に実行しセキュリティパッチを取り込んでいる
              </label>
            </li>
          </ul>

          <hr />

          <h2 id="17-参考文献出典">17. 参考文献・出典</h2>
          <p>
            本ガイドは以下の一次情報源（Hermes Agent公式ドキュメント・公式GitHubリポジトリ）および、国際的な技術メディア・著名開発者の発信に基づいて作成した。
          </p>
          <div className={styles.refGrid}>
            <div className={styles.refCard}>
              <h4>公式ドキュメント・リポジトリ</h4>
              <ul>
                <li>
                  Hermes Agent公式ドキュメント トップ:{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/">
                    https://hermes-agent.nousresearch.com/docs/
                  </Ext>
                </li>
                <li>
                  GitHubリポジトリ（README）:{" "}
                  <Ext href="https://github.com/nousresearch/hermes-agent">
                    https://github.com/nousresearch/hermes-agent
                  </Ext>
                </li>
                <li>
                  Architecture:{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/developer-guide/architecture">
                    https://hermes-agent.nousresearch.com/docs/developer-guide/architecture
                  </Ext>
                </li>
                <li>
                  Security:{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/user-guide/security">
                    https://hermes-agent.nousresearch.com/docs/user-guide/security
                  </Ext>
                </li>
                <li>
                  Skills System:{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/user-guide/features/skills">
                    https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
                  </Ext>
                </li>
                <li>
                  Curator:{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/user-guide/features/curator">
                    https://hermes-agent.nousresearch.com/docs/user-guide/features/curator
                  </Ext>
                </li>
                <li>
                  Persistent Memory:{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/user-guide/features/memory">
                    https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
                  </Ext>
                </li>
                <li>
                  Context Files:{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files">
                    https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files
                  </Ext>
                </li>
                <li>
                  MCP (Model Context Protocol):{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp">
                    https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp
                  </Ext>
                </li>
                <li>
                  Subagent Delegation:{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation">
                    https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation
                  </Ext>
                </li>
                <li>
                  Code Execution:{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/user-guide/features/code-execution">
                    https://hermes-agent.nousresearch.com/docs/user-guide/features/code-execution
                  </Ext>
                </li>
                <li>
                  Persistent Goals(/goal):{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/user-guide/features/goals">
                    https://hermes-agent.nousresearch.com/docs/user-guide/features/goals
                  </Ext>
                </li>
                <li>
                  Scheduled Tasks (Cron):{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/user-guide/features/cron">
                    https://hermes-agent.nousresearch.com/docs/user-guide/features/cron
                  </Ext>
                </li>
                <li>
                  Tips &amp; Best Practices（公式ベストプラクティス集）:{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/guides/tips">
                    https://hermes-agent.nousresearch.com/docs/guides/tips
                  </Ext>
                </li>
                <li>
                  llms.txt（ドキュメント全体の索引）:{" "}
                  <Ext href="https://hermes-agent.nousresearch.com/docs/assets/files/llms-faaf9398aa5828403fd56f6be7989c9f.txt">
                    https://hermes-agent.nousresearch.com/docs/assets/files/llms-faaf9398aa5828403fd56f6be7989c9f.txt
                  </Ext>
                </li>
              </ul>
            </div>
            <div className={styles.refCard}>
              <h4>業界動向・第三者メディア（国際的な技術メディア）</h4>
              <ul>
                <li>
                  TechCrunch「Hermes agent maker Nous Research in talks for new funding at $1.5B valuation」:{" "}
                  <Ext href="https://techcrunch.com/2026/07/13/hermes-agent-maker-nous-research-in-talks-for-new-funding-at-1-5b-valuation/">
                    https://techcrunch.com/2026/07/13/hermes-agent-maker-nous-research-in-talks-for-new-funding-at-1-5b-valuation/
                  </Ext>
                </li>
                <li>
                  MarkTechPost「OpenClaw vs Hermes Agent: Why Nous Research's Self-Improving Agent Now Leads OpenRouter's Global Rankings」:{" "}
                  <Ext href="https://www.marktechpost.com/2026/05/10/openclaw-vs-hermes-agent-why-nous-researchs-self-improving-agent-now-leads-openrouters-global-rankings/">
                    https://www.marktechpost.com/2026/05/10/openclaw-vs-hermes-agent-why-nous-researchs-self-improving-agent-now-leads-openrouters-global-rankings/
                  </Ext>
                </li>
                <li>
                  Simon Willison（Nous Research関連の継続的な技術解説）:{" "}
                  <Ext href="https://simonwillison.net/tags/nous-research/">
                    https://simonwillison.net/tags/nous-research/
                  </Ext>
                </li>
                <li>
                  Turing Post「Hermes vs OpenClaw」:{" "}
                  <Ext href="https://www.turingpost.com/p/hermes">
                    https://www.turingpost.com/p/hermes
                  </Ext>
                </li>
              </ul>
            </div>
            <div className={styles.refCard}>
              <h4>関連プロジェクト・エコシステム</h4>
              <ul>
                <li>
                  agentskills.io（オープンスキル標準）:{" "}
                  <Ext href="https://agentskills.io">https://agentskills.io</Ext>
                </li>
                <li>
                  skills.sh（Vercel運営のスキルディレクトリ）:{" "}
                  <Ext href="https://skills.sh/">https://skills.sh/</Ext>
                </li>
                <li>
                  tirith（実行前セキュリティスキャナ）:{" "}
                  <Ext href="https://github.com/sheeki03/tirith">https://github.com/sheeki03/tirith</Ext>
                </li>
                <li>
                  OpenAI Codex CLI（<code>/goal</code>のRalph loop着想元）:{" "}
                  <Ext href="https://github.com/openai/codex">https://github.com/openai/codex</Ext>
                </li>
              </ul>
            </div>
          </div>

          <hr />

          <p>
            <em>
              本ガイドはHermes Agentの公開ドキュメント（2026年8月2日時点）を基に作成した。Hermesは開発の速いプロジェクトであり、設定キー名やデフォルト値は将来のリリースで変更される可能性がある。最新情報は上記の公式ドキュメントを参照されたい。
            </em>
          </p>
        </div>
      </div>
    </div>
  );
}
