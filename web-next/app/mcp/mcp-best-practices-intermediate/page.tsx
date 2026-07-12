import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "MCP実践ベストプラクティス | Model Context Protocol 完全ガイド | LLM-Studies",
  description:
    "Model Context Protocol (MCP) の詳細なアーキテクチャ、バージョン管理、トランスポート、セキュリティ、認証・認可から運用プラクティスまで網羅的に解説するベストプラクティスガイド。",
};

const DIAGRAMS = {
  timeline: `timeline
    title MCPプロトコル仕様のリリース履歴
    2024-11-05 : 初版仕様（stdio / HTTP+SSE）
    2025-03-26 : Streamable HTTP追加、HTTP+SSEを非推奨化
    2025-06-18 : OAuth 2.1認可仕様を正式化
    2025-11-25 : 現行安定版、Tasksを実験導入
    2026-07-28 : RC版、ステートレス化とExtensions導入`,

  arch: `graph TB
    subgraph Host["ホストアプリケーション（Claude Desktop / Claude Code / Cursor 等）"]
        direction TB
        HostCore["ホストコア<br/>(UI・会話管理・LLM呼び出し)"]
        C1["MCP Client #1"]
        C2["MCP Client #2"]
        C3["MCP Client #3"]
        HostCore --> C1
        HostCore --> C2
        HostCore --> C3
    end

    S1[("MCP Server<br/>GitHub連携")]
    S2[("MCP Server<br/>ファイルシステム")]
    S3[("MCP Server<br/>社内データベース")]

    C1 <-->|"JSON-RPC 2.0<br/>(stdio)"| S1
    C2 <-->|"JSON-RPC 2.0<br/>(Streamable HTTP)"| S2
    C3 <-->|"JSON-RPC 2.0<br/>(Streamable HTTP + OAuth)"| S3`,

  seq: `sequenceDiagram
    participant U as ユーザー
    participant H as ホスト（LLMアプリ）
    participant C as MCPクライアント
    participant S as MCPサーバー

    U->>H: タスクを依頼
    H->>C: セッション開始
    C->>S: initialize（protocolVersion, capabilities）
    S-->>C: initializeResult（サーバーのcapabilities）
    C->>S: notifications/initialized
    C->>S: tools/list
    S-->>C: ツール定義一覧（name, description, inputSchema）
    H->>H: LLMが状況に応じてツールを選択
    H->>C: tools/call（name, arguments）
    C->>S: tools/call リクエスト
    S-->>C: 実行結果（content, isError）
    C-->>H: 結果をコンテキストへ追加
    H-->>U: 最終応答を生成`,

  transport: `flowchart TD
    A["MCPサーバーを実装する"] --> B{"クライアントは同一マシン上で<br/>子プロセスとして起動される？"}
    B -->|"Yes（ローカルCLI/IDE統合）"| C["stdioトランスポートを選択"]
    B -->|"No（リモート/複数クライアントで共有）"| D{"認証・認可が必要？"}
    D -->|"Yes（推奨）"| E["Streamable HTTP + OAuth 2.1"]
    D -->|"No（閉域網・開発環境限定）"| F["Streamable HTTP<br/>+ ネットワークレベルの制御"]
    C --> G["stdoutにはJSON-RPCメッセージのみを出力<br/>ログは必ずstderrへ"]
    E --> H["単一の /mcp エンドポイント<br/>（POST + GET, 任意でSSEへアップグレード）"]
    F --> H
    H --> I["Origin ヘッダー検証でDNSリバインディング対策"]`,

  primitives: `sequenceDiagram
    participant U as ユーザー
    participant H as ホスト/クライアント
    participant S as MCPサーバー

    U->>H: 「配送中の注文3件をメールして」
    H->>S: resources/read（注文ステータスの定義を取得）
    S-->>H: リソース内容（正規化されたステータス値）
    H->>S: tools/call（getOrdersByStatus）
    S-->>H: 該当する注文データ
    S->>H: sampling/createMessage（要約を依頼）
    H->>H: クライアント側LLMで要約を生成（ユーザーが承認）
    H-->>S: 要約テキストを返却
    S->>H: elicitation/create（送信先メールアドレスを確認）
    H->>U: 「どのメールアドレスに送りますか？」
    U-->>H: メールアドレスを入力
    H-->>S: 入力値を返却
    S->>H: tools/call（sendEmail）
    S-->>H: 送信完了
    H-->>U: 「送信しました」`,

  improvement: `flowchart LR
    A["ツールを実装する"] --> B["評価セット（Evaluation）を構築<br/>タスク成功率・トークン消費・エラー率を計測"]
    B --> C["Claude Codeにツール定義の<br/>プロンプトエンジニアリングを依頼"]
    C --> D["改善版のdescription/schemaを生成"]
    D --> E["評価セットで再計測"]
    E -->|"改善が確認できた"| F["本番反映"]
    E -->|"改善が見られない"| B`,

  disclosure: `flowchart TD
    subgraph Before["旧方式：全ツール定義を先読み"]
        B1["7台のMCPサーバー"] --> B2["起動時に67,300トークンを消費<br/>（200kウィンドウの33.7%）"]
        B2 --> B3["選択精度低下・レイテンシ増加"]
    end

    subgraph After["対策後：段階的開示"]
        A1["Tool Search方式<br/>(defer_loading: true)"] --> A2["起動時は軽量な検索インターフェースのみロード"]
        A2 --> A3["必要なツールのみ<br/>オンデマンドで取得"]
        A3 --> A4["トークン消費を最大85%削減<br/>（Anthropic計測値）"]

        C1["Code Execution方式"] --> C2["MCPサーバーをコードAPIとして提示"]
        C2 --> C3["エージェントがコードを書いてツールを呼び出す"]
        C3 --> C4["中間結果を実行環境内で処理し<br/>必要な結果のみモデルへ返す"]
    end`,

  oauth: `sequenceDiagram
    participant Client as MCPクライアント
    participant RS as MCPサーバー（リソースサーバー）
    participant AS as 認可サーバー（IdP）
    participant User as ユーザー

    Client->>RS: 未認証でリクエスト
    RS-->>Client: 401 Unauthorized + WWW-Authenticate(resource_metadata)
    Client->>RS: GET /.well-known/oauth-protected-resource
    RS-->>Client: Protected Resource Metadata（認可サーバーのURLを含む）
    Client->>AS: GET /.well-known/oauth-authorization-server
    AS-->>Client: 認可サーバーメタデータ
    Client->>AS: 認可リクエスト（PKCE code_challenge, resource=RSのURL）
    AS->>User: ログイン画面 & 同意画面を表示
    User-->>AS: 同意
    AS-->>Client: 認可コードを発行
    Client->>AS: トークン交換（code_verifierを提示）
    AS-->>Client: アクセストークン（audience=RS限定、短命）
    Client->>RS: Authorization: Bearer トークン
    RS->>RS: 署名・有効期限・audience・scopeを検証
    RS-->>Client: 認可済みレスポンス`,

  poisoning: `flowchart LR
    subgraph Attacker["悪意のあるMCPサーバー"]
        T["一見無害なツール<br/>(例: get_compliance_status)"]
        D["説明文または出力の中に<br/>隠された指示を埋め込む"]
        T --> D
    end

    D -->|"tools/list または tools/call のレスポンス"| Ctx["LLMのコンテキストウィンドウへ混入"]
    Ctx -->|"信頼できる指示として解釈"| Agent["エージェントが指示に従って行動"]
    Agent -->|"read_file等の内部ツールを誤って実行"| Leak["機密情報の読み取り・外部への送信"]`,

  defense: `flowchart TD
    A["未知/外部のMCPサーバーからの応答"] --> B{"構造化スキーマに一致するか？"}
    B -->|"No"| C["応答を拒否・破棄"]
    B -->|"Yes"| D{"破壊的・機密操作を伴うか？"}
    D -->|"Yes"| E["Elicitation/確認ダイアログで<br/>人間の承認を要求"]
    D -->|"No"| F["最小権限のスコープ内で実行"]
    E -->|"承認"| F
    E -->|"拒否"| C
    F --> G["実行ログを監査基盤へ記録"]`,

  testing: `flowchart LR
    S["サーバーコード"] --> I["npx @modelcontextprotocol/inspector"]
    I --> W["ブラウザUI (localhost:6274)"]
    W --> T1["Toolsタブで<br/>個別ツールの入出力を確認"]
    W --> T2["Resourcesタブで<br/>公開データの内容を確認"]
    W --> T3["Promptsタブで<br/>テンプレートの動作を確認"]
    W --> Log["メッセージログで<br/>生のJSON-RPCを確認"]
    Log --> Fix["コードを修正"]
    Fix --> S
    W -.CLIモード.-> CI["CI/CDパイプラインへ統合し<br/>リグレッションテストを自動化"]`,

  gateway: `graph TB
    subgraph Agents["AIエージェント層"]
        A1["Claude Code"]
        A2["社内カスタムAgent"]
        A3["Cursor / VS Code"]
    end

    GW["MCP Gateway<br/>（認証・認可・ルーティング・<br/>レート制限・監査ログ）"]

    subgraph Servers["MCPサーバー群"]
        M1["GitHub MCP"]
        M2["Slack MCP"]
        M3["社内データベース MCP"]
        M4["Observability MCP"]
    end

    IdP[("社内IdP / SSO<br/>(Keycloak, Entra ID等)")]
    Log[("監査ログ / SIEM")]

    A1 --> GW
    A2 --> GW
    A3 --> GW
    GW <--> IdP
    GW --> Log
    GW --> M1
    GW --> M2
    GW --> M3
    GW --> M4`,
};

export default function McpBestPracticesIntermediatePage() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />
      <div className={styles.layout}>
        {/* ================= SIDEBAR ================= */}
        <nav className={styles.sidebar} id="mcpSideNav">
          <button
            className={styles.mobileToggle}
            id="mcpInterNavToggle"
            type="button"
            aria-controls="mcpInterNavList"
            aria-expanded="false"
          >
            <i className="ti ti-menu-2" />
            目次を開く
          </button>
          <div className={styles.brand}>
            <svg
              className={styles.brandMark}
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="MCP Brand Mark"
            >
              <title>MCP Brand Mark</title>
              <rect x="1" y="1" width="24" height="24" rx="6" stroke="#4fd8c4" strokeWidth="1.4" />
              <path
                d="M7 13H11M15 13H19M11 13C11 11 12 10 13 10C14 10 15 11 15 13C15 15 14 16 13 16C12 16 11 15 11 13Z"
                stroke="#4fd8c4"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            MCPベストプラクティス
          </div>
          <p className={styles.brandSub}>Model Context Protocol Guide</p>

          <p className={styles.navTitle}>目次</p>
          <ul className={styles.navList} id="mcpInterNavList">
            <li>
              <a href="#sec01" className={styles.tocLink}>
                第1章 MCPとは何か
              </a>
            </li>
            <li>
              <a href="#sec02" className={styles.tocLink}>
                第2章 アーキテクチャ基礎
              </a>
            </li>
            <li>
              <a href="#sec03" className={styles.tocLink}>
                第3章 バージョンとライフサイクル
              </a>
            </li>
            <li>
              <a href="#sec04" className={styles.tocLink}>
                第4章 トランスポート選定
              </a>
            </li>
            <li>
              <a href="#sec05" className={styles.tocLink}>
                第5章 コアプリミティブ設計
              </a>
            </li>
            <li>
              <a href="#sec06" className={styles.tocLink}>
                第6章 ツール設計指針
              </a>
            </li>
            <li>
              <a href="#sec07" className={styles.tocLink}>
                第7章 コンテキスト管理
              </a>
            </li>
            <li>
              <a href="#sec08" className={styles.tocLink}>
                第8章 認証・認可 OAuth 2.1
              </a>
            </li>
            <li>
              <a href="#sec09" className={styles.tocLink}>
                第9章 セキュリティ脅威と対策
              </a>
            </li>
            <li>
              <a href="#sec10" className={styles.tocLink}>
                第10章 テストとデバッグ
              </a>
            </li>
            <li>
              <a href="#sec11" className={styles.tocLink}>
                第11章 Gatewayアーキテクチャ
              </a>
            </li>
            <li>
              <a href="#sec12" className={styles.tocLink}>
                第12章 2026年ロードマップ
              </a>
            </li>
            <li>
              <a href="#sec13" className={styles.tocLink}>
                第13章 総括チェックリスト
              </a>
            </li>
            <li>
              <a href="#sec14" className={styles.tocLink}>
                第14章 参考文献一覧
              </a>
            </li>
          </ul>
        </nav>

        {/* ================= MAIN ================= */}
        <main className={styles.main}>
          <header className={styles.hero}>
            <div className={styles.pill}>
              <span className={styles.dot}></span>INTERMEDIATE &mdash; ADVANCED / 2026年7月版
            </div>
            <h1>MCP実践ベストプラクティスガイド</h1>
            <p className={styles.subtitle}>
              Model Context
              Protocolを本番環境で安全・スケーラブルに運用するための、アーキテクチャ・トランスポート・認可・セキュリティ・スケーラビリティなどの設計判断を、ステップバイステップで解説します。
            </p>
            <div className={styles.meta}>
              <span className={styles.pill}>
                対象読者: <b>MCPサーバー/クライアント構築経験者</b>
              </span>
              <span className={styles.pill}>
                情報基準日: <b>2026年7月</b>
              </span>
              <span className={styles.pill}>
                セクション数: <b>14</b>
              </span>
              <span className={styles.pill}>
                図解: <b>Mermaid 12点</b>
              </span>
            </div>

            <div className={styles.diagramFrame}>
              <svg
                viewBox="0 0 760 160"
                width="100%"
                style={{ maxHeight: "180px", display: "block" }}
                height="auto"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Host Client Server connection flow"
              >
                <title>Host Client Server connection flow</title>
                {/* Host */}
                <rect
                  x={20}
                  y={55}
                  width={130}
                  height={50}
                  rx={8}
                  fill="#0f1f33"
                  stroke="#4fd8c4"
                  strokeWidth={1.4}
                />
                <text
                  x={85}
                  y={85}
                  textAnchor="middle"
                  fill="#e9eff7"
                  fontFamily="Space Grotesk"
                  fontSize={13}
                  fontWeight="600"
                >
                  Host
                </text>

                {/* connecting trace host -> client */}
                <path d="M150 80 H 230" stroke="#4fd8c4" strokeWidth={1.4} fill="none" />
                <circle cx={190} cy={80} r={3} fill="#7ff0de">
                  <animate
                    attributeName="cx"
                    values="150;230;150"
                    dur="3.2s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Client */}
                <rect
                  x={230}
                  y={55}
                  width={120}
                  height={50}
                  rx={8}
                  fill="#0f1f33"
                  stroke="#4fd8c4"
                  strokeWidth={1.4}
                />
                <text
                  x={290}
                  y={85}
                  textAnchor="middle"
                  fill="#e9eff7"
                  fontFamily="Space Grotesk"
                  fontSize={13}
                  fontWeight="600"
                >
                  Client
                </text>

                {/* MCP connector plug shape */}
                <g>
                  <rect
                    x={350}
                    y={65}
                    width={40}
                    height={30}
                    rx={4}
                    fill="#091420"
                    stroke="#f5b84f"
                    strokeWidth={1.4}
                  />
                  <rect x={360} y={72} width={6} height={16} rx={1} fill="#f5b84f" />
                  <rect x={374} y={72} width={6} height={16} rx={1} fill="#f5b84f" />
                </g>
                <text
                  x={370}
                  y={120}
                  textAnchor="middle"
                  fill="#f5b84f"
                  fontFamily="JetBrains Mono"
                  fontSize={10}
                >
                  JSON-RPC 2.0
                </text>

                <path d="M390 80 H 470" stroke="#f5b84f" strokeWidth={1.4} fill="none" />
                <circle cx={430} cy={80} r={3} fill="#f5b84f">
                  <animate
                    attributeName="cx"
                    values="390;470;390"
                    dur="3.2s"
                    repeatCount="indefinite"
                    begin="0.4s"
                  />
                </circle>

                {/* Servers */}
                <rect
                  x={470}
                  y={20}
                  width={120}
                  height={40}
                  rx={8}
                  fill="#0f1f33"
                  stroke="#4fd8c4"
                  strokeWidth={1.2}
                />
                <text
                  x={530}
                  y={45}
                  textAnchor="middle"
                  fill="#e9eff7"
                  fontFamily="Space Grotesk"
                  fontSize={12}
                >
                  Server: Tools
                </text>

                <rect
                  x={470}
                  y={70}
                  width={120}
                  height={40}
                  rx={8}
                  fill="#0f1f33"
                  stroke="#4fd8c4"
                  strokeWidth={1.2}
                />
                <text
                  x={530}
                  y={95}
                  textAnchor="middle"
                  fill="#e9eff7"
                  fontFamily="Space Grotesk"
                  fontSize={12}
                >
                  Resources
                </text>

                <rect
                  x={470}
                  y={120}
                  width={120}
                  height={30}
                  rx={8}
                  fill="#0f1f33"
                  stroke="#4fd8c4"
                  strokeWidth={1.2}
                />
                <text
                  x={530}
                  y={140}
                  textAnchor="middle"
                  fill="#e9eff7"
                  fontFamily="Space Grotesk"
                  fontSize={12}
                >
                  Prompts
                </text>

                <path
                  d="M470 80 L 430 40 M470 80 L 430 80 M470 80 L 430 120"
                  stroke="#4fd8c4"
                  strokeWidth={1}
                  fill="none"
                  opacity={0.4}
                />

                <rect
                  x={630}
                  y={55}
                  width={110}
                  height={50}
                  rx={8}
                  fill="#0f1f33"
                  stroke="#f5716b"
                  strokeWidth={1.2}
                  strokeDasharray="4 3"
                />
                <text
                  x={685}
                  y={78}
                  textAnchor="middle"
                  fill="#e9eff7"
                  fontFamily="Space Grotesk"
                  fontSize={11}
                  fontWeight="600"
                >
                  外部データ
                </text>
                <text
                  x={685}
                  y={93}
                  textAnchor="middle"
                  fill="#9fb0c4"
                  fontFamily="JetBrains Mono"
                  fontSize={9}
                >
                  未検証入力
                </text>
                <path
                  d="M590 80 H 630"
                  stroke="#9fb0c4"
                  strokeWidth={1.2}
                  strokeDasharray="3 3"
                  fill="none"
                />
              </svg>
              <div
                className={styles.codeBar}
                style={{
                  borderBottom: "none",
                  background: "none",
                  padding: "10px 0 0 0",
                  justifyContent: "center",
                }}
              >
                MCP = Host / Client / Server 間を JSON-RPC 2.0 で接続する共通コネクタ
              </div>
            </div>
          </header>

          {/* ================= SECTION 01 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec01">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                01
              </span>
              <h2>MCPとは何か、なぜ今重要なのか</h2>
            </div>

            <p>
              Model Context
              Protocol（MCP）は、2024年11月にAnthropicが発表したオープンプロトコルで、LLMアプリケーション（ホスト）と外部のデータソース・ツールを標準化された方法で接続するための仕様です。しばしば「AIにとってのUSB-C」と例えられます。
            </p>

            <p>
              MCP登場以前は、LLMをPostgreSQL・GitHub・Slackなどと連携させるたびに個別の統合コードを書く必要があり、いわゆる
              <b>「N×M問題」</b>
              （N個のAIアプリケーションとM個のツールの組み合わせ爆発）が発生していました。MCPはサーバーを一度実装すれば、あらゆるMCP対応クライアントから利用できる「1回実装、どこでも利用」を実現します。
            </p>

            <p>
              2025年3月にはOpenAIが、その後Google
              DeepMind、Microsoftなど主要プレイヤーが相次いでMCPを採用し、事実上の業界標準になりました。2026年に入り、MCPの公開レジストリは2025年第1四半期の約1,200件から2026年4月時点で
              <b>9,400件超</b>
              へと7倍以上に拡大しており、攻撃対象領域（アタックサーフェス）も同様に拡大しています。
            </p>

            <div className={styles.notice}>
              <i className="ti ti-info-circle" />
              <div>
                <b>本ガイドの焦点：</b>
                単なる「動くMCPサーバーの作り方」ではなく、本番環境で安全かつスケーラブルに運用するための設計判断（アーキテクチャ、トランスポート、ツール設計、コンテキスト管理、認証・認可、セキュリティ、テスト、エンタープライズ構成）を扱います。
              </div>
            </div>

            <div
              className={styles.cardGrid}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "14px",
                margin: "28px 0",
              }}
            >
              <div
                className={styles["mini-card"]}
                style={{
                  border: "1px solid var(--color-border-primary, #2c313c)",
                  borderRadius: "10px",
                  background: "var(--color-background-secondary, #14171d)",
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-text-info, #7bb8ea)",
                    fontSize: "12px",
                  }}
                >
                  02–03
                </div>
                <h4 style={{ margin: "6px 0 4px 0", color: "#e9eaee", fontSize: "14.5px" }}>
                  基礎
                </h4>
                <p style={{ fontSize: "12.5px", color: "#757a87", margin: 0 }}>
                  アーキテクチャとプロトコルバージョン
                </p>
              </div>
              <div
                className={styles["mini-card"]}
                style={{
                  border: "1px solid var(--color-border-primary, #2c313c)",
                  borderRadius: "10px",
                  background: "var(--color-background-secondary, #14171d)",
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-text-info, #7bb8ea)",
                    fontSize: "12px",
                  }}
                >
                  04–07
                </div>
                <h4 style={{ margin: "6px 0 4px 0", color: "#e9eaee", fontSize: "14.5px" }}>
                  設計
                </h4>
                <p style={{ fontSize: "12.5px", color: "#757a87", margin: 0 }}>
                  トランスポート・プリミティブ・ツール・コンテキスト
                </p>
              </div>
              <div
                className={styles["mini-card"]}
                style={{
                  border: "1px solid var(--color-border-primary, #2c313c)",
                  borderRadius: "10px",
                  background: "var(--color-background-secondary, #14171d)",
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-text-info, #7bb8ea)",
                    fontSize: "12px",
                  }}
                >
                  08–09
                </div>
                <h4 style={{ margin: "6px 0 4px 0", color: "#e9eaee", fontSize: "14.5px" }}>
                  セキュリティ
                </h4>
                <p style={{ fontSize: "12.5px", color: "#757a87", margin: 0 }}>
                  OAuth 2.1認可と脅威モデル
                </p>
              </div>
              <div
                className={styles["mini-card"]}
                style={{
                  border: "1px solid var(--color-border-primary, #2c313c)",
                  borderRadius: "10px",
                  background: "var(--color-background-secondary, #14171d)",
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-text-info, #7bb8ea)",
                    fontSize: "12px",
                  }}
                >
                  10–11
                </div>
                <h4 style={{ margin: "6px 0 4px 0", color: "#e9eaee", fontSize: "14.5px" }}>
                  運用
                </h4>
                <p style={{ fontSize: "12.5px", color: "#757a87", margin: 0 }}>
                  テスト・デバッグ・Gateway構成
                </p>
              </div>
              <div
                className={styles["mini-card"]}
                style={{
                  border: "1px solid var(--color-border-primary, #2c313c)",
                  borderRadius: "10px",
                  background: "var(--color-background-secondary, #14171d)",
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-text-info, #7bb8ea)",
                    fontSize: "12px",
                  }}
                >
                  12–14
                </div>
                <h4 style={{ margin: "6px 0 4px 0", color: "#e9eaee", fontSize: "14.5px" }}>
                  展望
                </h4>
                <p style={{ fontSize: "12.5px", color: "#757a87", margin: 0 }}>
                  ロードマップ・チェックリスト・参照元
                </p>
              </div>
            </div>

            <details className={styles.refs}>
              <summary>参考資料（3件）</summary>
              <ul>
                <li>
                  MCP公式サイト（仕様トップ）:{" "}
                  <a
                    href="https://modelcontextprotocol.io/specification/2025-11-25"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://modelcontextprotocol.io/specification/2025-11-25
                  </a>
                </li>
                <li>
                  Model Context Protocol - Wikipedia:{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Model_Context_Protocol"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://en.wikipedia.org/wiki/Model_Context_Protocol
                  </a>
                </li>
                <li>
                  Model Context Protocol (MCP): The Standard That&apos;s Changing AI Integration in
                  2026:{" "}
                  <a
                    href="https://devstarsj.github.io/2026/03/18/model-context-protocol-mcp-complete-guide-2026/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    devstarsj.github.io/.../model-context-protocol-mcp-complete-guide-2026
                  </a>
                </li>
              </ul>
            </details>
          </section>

          {/* ================= SECTION 02 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec02">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                02
              </span>
              <h2>アーキテクチャの基礎：Host / Client / Serverモデル</h2>
            </div>

            <p>
              MCPは <b>Host（ホスト）・Client（クライアント）・Server（サーバー）</b>{" "}
              の3層構造を取ります。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>役割</th>
                    <th>説明</th>
                    <th>具体例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>Host</b>
                    </td>
                    <td>
                      ユーザーとの対話を管理し、複数のMCP Clientを統括するAIアプリケーション本体
                    </td>
                    <td>Claude Desktop, Claude Code, Cursor, VS Code (Copilot)</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Client</b>
                    </td>
                    <td>
                      1つのMCP
                      Serverと1対1で通信するプロトコルレベルのコンポーネント。Hostによってサーバーごとにインスタンス化される
                    </td>
                    <td>Host内部のクライアントインスタンス</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Server</b>
                    </td>
                    <td>
                      ツール・リソース・プロンプトなどの「コンテキストと能力」を提供する独立したプロセスまたはサービス
                    </td>
                    <td>GitHub MCP Server, Filesystem MCP Server, 自社DB MCP Server</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              通信はすべて <b>JSON-RPC 2.0</b> メッセージに基づきます。この設計はLanguage Server
              Protocol（LSP）から着想を得ており、「プログラミング言語ごとの支援」を「AIアプリケーションごとの外部ツール連携」に置き換えたものと理解すると分かりやすいでしょう。
            </p>

            <div className={styles.diagramFrame}>
              <div
                className={styles.codeBar}
                style={{ borderBottom: "none", background: "none", padding: "0 0 10px 0" }}
              >
                Fig. 2-1 — Host / Client / Server 全体構成
              </div>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.arch} />
              </div>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                2.1
              </span>
              セッションライフサイクルとメッセージフロー
            </h3>
            <p>
              MCPのセッションは「初期化 → 運用 → 終了」の3フェーズで構成されます。クライアントは
              <code>initialize</code>
              リクエストでプロトコルバージョンと自身のケイパビリティ（sampling、elicitation、rootsのサポート有無など）を宣言し、サーバーは対応するプロトコルバージョンと自身のケイパビリティ（tools、resources、promptsのサポート有無）を返します。
            </p>

            <p>以下は、ツール呼び出しが行われる際の典型的なメッセージフローです。</p>

            <div className={styles.diagramFrame}>
              <div
                className={styles.codeBar}
                style={{ borderBottom: "none", background: "none", padding: "0 0 10px 0" }}
              >
                Fig. 2-2 — ツール呼び出しのシーケンス
              </div>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.seq} />
              </div>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                2.2
              </span>
              設計上の要点
            </h3>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "20px",
                color: "var(--color-text-secondary, #aeb2bd)",
                margin: "0 0 16px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <b>サーバーは「信頼できない入力」を扱う前提で設計する：</b>
                サーバーが返すツールの説明文（description）やアノテーションは、たとえ正規のサーバーからのものであっても、クライアント側では「未検証の情報」として扱うべきとMCP仕様は明記しています。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>1つのClientは1つのServerとのみ対話する：</b>
                複数サーバーを束ねる場合はHost側で複数Clientインスタンスを管理するか、後述のGatewayパターンを採用します。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>Toolsは「任意のコード実行」を意味する：</b>
                ツールはLLMの単なる関数呼び出しではなく、実際のシステム操作（ファイル削除、API呼び出し、DB更新など）に直結するため、相応の慎重さが求められます。
              </li>
            </ul>

            <details className={styles.refs}>
              <summary>参考資料（3件）</summary>
              <ul>
                <li>
                  MCP Specification（アーキテクチャ全般）:{" "}
                  <a
                    href="https://modelcontextprotocol.io/specification/2025-11-25"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    modelcontextprotocol.io/specification/2025-11-25
                  </a>
                </li>
                <li>
                  Model Context Protocol (MCP) explained: A practical technical overview:{" "}
                  <a
                    href="https://codilime.com/blog/model-context-protocol-explained/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    codilime.com/blog/model-context-protocol-explained
                  </a>
                </li>
                <li>
                  The Hitchhiker&apos;s Guide to Agentic AI:{" "}
                  <a
                    href="https://arxiv.org/pdf/2606.24937"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    arxiv.org/pdf/2606.24937
                  </a>
                </li>
              </ul>
            </details>
          </section>

          {/* ================= SECTION 03 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec03">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                03
              </span>
              <h2>プロトコルのバージョンとライフサイクル管理</h2>
            </div>

            <p>
              MCPの仕様は日付形式（例: <code>2025-11-25</code>）でバージョニングされ、
              <code>initialize</code>
              時にクライアント・サーバー間でネゴシエーションされます。中級〜上級者が押さえるべき最大のポイントは、
              <b>どのバージョンがどの機能を持ち、どれが非推奨かを正確に把握すること</b>
              です。バージョン間の差分を知らずに実装すると、非推奨のSSEトランスポートを新規に採用してしまう、廃止済みの設計を前提にしてしまうといった事故が起きやすくなります。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                3.1
              </span>
              バージョン履歴
            </h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>バージョン</th>
                    <th>リリース時期</th>
                    <th>主な変更点</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>2024-11-05</code>
                    </td>
                    <td>2024年11月</td>
                    <td>初版。stdioとHTTP+SSEの2トランスポート</td>
                  </tr>
                  <tr>
                    <td>
                      <code>2025-03-26</code>
                    </td>
                    <td>2025年3月</td>
                    <td>
                      <b>Streamable HTTP</b> を導入し、HTTP+SSEを非推奨化
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>2025-06-18</code>
                    </td>
                    <td>2025年6月</td>
                    <td>
                      <b>OAuth 2.1</b>{" "}
                      ベースの認可仕様を正式化（MCPサーバー＝リソースサーバー、認可サーバーとの役割・責務の分離を明確化。物理的な分離強制ではない）
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>2025-11-25</code>
                    </td>
                    <td>2025年11月</td>
                    <td>現行の安定版。Tasksを実験的機能として導入</td>
                  </tr>
                  <tr>
                    <td>
                      <code>2026-07-28</code>（RC）
                    </td>
                    <td>2026年5月にRC公開、7月28日に確定予定</td>
                    <td>
                      プロトコル発足以来最大の改訂。<b>ステートレスコア化</b>
                      （initializeハンドシェイクとセッションIDの廃止）、
                      <b>Extensionsフレームワーク</b>の導入、Feature Lifecycle
                      Policy（Active/Deprecated/Removedの3段階、廃止から削除まで最低12か月）の制定
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.diagramFrame}>
              <div
                className={styles.codeBar}
                style={{ borderBottom: "none", background: "none", padding: "0 0 14px 0" }}
              >
                Fig. 3-1 — 仕様リリース履歴タイムライン
              </div>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.timeline} />
              </div>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                3.2
              </span>
              2026-07-28版で何が変わるのか
            </h3>
            <p>2026-07-28のリリース候補は、これまでの中で最大級の破壊的変更を含みます。</p>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "20px",
                color: "var(--color-text-secondary, #aeb2bd)",
                margin: "0 0 16px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <b>ステートレス化：</b>プロトコルバージョンやクライアント情報を毎回
                <code>_meta</code>に載せる方式に変更され、<code>Mcp-Session-Id</code>
                ヘッダーとセッション概念そのものが廃止されます。これにより、どのリクエストもどのサーバーインスタンスでも処理できるようになり、単純なラウンドロビン型ロードバランサーでスケールできるようになります。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>Extensionsフレームワーク：</b>
                逆引きDNS形式のIDで識別される拡張機能が、コア仕様とは独立したライフサイクルでリリースできるようになります。
                <code>MCP Apps</code>
                （サーバーがサンドボックス化されたiframe内でインタラクティブなUIを提供できる仕様）が最初の公式拡張として提供されます。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>アプリ側の状態管理：</b>
                プロトコルレベルのセッションがなくなっても、アプリケーション側で
                <code>basket_id</code>
                のような明示的なハンドルをツール引数として受け渡しすることで、状態を維持する設計は引き続き可能です。
              </li>
            </ul>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                3.3
              </span>
              実務上の指針
            </h3>
            <ol
              style={{
                paddingLeft: "20px",
                color: "var(--color-text-secondary, #aeb2bd)",
                margin: "0 0 16px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <b>サーバーは複数のプロトコルバージョンをサポートする設計にする：</b>
                少なくとも現行の安定版（<code>2025-11-25</code>
                ）と、必要であれば1つ前のバージョンとの互換性を維持します。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>バージョン互換性マトリクスを文書化する：</b>
                どの機能がどのバージョンで動くかを一覧化しておくと、クライアント側の挙動差異によるバグ調査が格段に楽になります。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>SEP（Spec Enhancement Proposal）の動向を追う：</b>MCPは現在、Working
                Group主導の開発体制に移行しており、優先領域（トランスポートのスケーラビリティ、エージェント間通信、ガバナンス、エンタープライズ対応）に沿ったSEPほどレビューが早く進みます。
              </li>
            </ol>

            <details className={styles.refs}>
              <summary>参考資料（5件）</summary>
              <ul>
                <li>
                  The 2026 MCP Roadmap:{" "}
                  <a
                    href="https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    blog.modelcontextprotocol.io/posts/2026-mcp-roadmap
                  </a>
                </li>
                <li>
                  The 2026-07-28 MCP Specification Release Candidate:{" "}
                  <a
                    href="https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate
                  </a>
                </li>
                <li>
                  Model Context Protocol Blog（トップページ）:{" "}
                  <a
                    href="https://blog.modelcontextprotocol.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    blog.modelcontextprotocol.io
                  </a>
                </li>
                <li>
                  GitHub Releases:{" "}
                  <a
                    href="https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/modelcontextprotocol/modelcontextprotocol/releases
                  </a>
                </li>
                <li>
                  MCP Cheat Sheet (2026) - Webfuse:{" "}
                  <a
                    href="https://www.webfuse.com/mcp-cheat-sheet"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    webfuse.com/mcp-cheat-sheet
                  </a>
                </li>
              </ul>
            </details>
          </section>

          {/* ================= SECTION 04 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec04">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                04
              </span>
              <h2>トランスポート選定戦略：stdio vs Streamable HTTP vs SSE</h2>
            </div>

            <p>
              MCPのトランスポート層は「データ層（tools/resources/promptsの定義）」とは独立したレイヤーです。2026年7月時点で現行かつ推奨されるトランスポートは{" "}
              <b>stdio</b> と <b>Streamable HTTP</b> の2つのみです。
              <b>HTTP+SSE（2024-11-05仕様）は2025-03-26で正式に非推奨化</b>
              されており、新規実装での採用は避けるべきです。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                4.1
              </span>
              トランスポート比較表
            </h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>stdio</th>
                    <th>Streamable HTTP（現行）</th>
                    <th>HTTP+SSE（非推奨）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>用途</td>
                    <td>ローカル・単一クライアント（IDE統合、CLIツール）</td>
                    <td>リモート・複数クライアント（本番サービス）</td>
                    <td>リモート（2025-03-26より非推奨）</td>
                  </tr>
                  <tr>
                    <td>通信路</td>
                    <td>子プロセスの標準入出力（stdin/stdout）</td>
                    <td>
                      単一の<code>/mcp</code>エンドポイント（POST + GET、SSEへ任意アップグレード）
                    </td>
                    <td>2つの独立エンドポイント（GET /sse と POST /messages）</td>
                  </tr>
                  <tr>
                    <td>認証</td>
                    <td>ローカル環境変数・OSレベルの権限に依存</td>
                    <td>OAuth 2.1 + Bearerトークン</td>
                    <td>同左（ただし設計が複雑）</td>
                  </tr>
                  <tr>
                    <td>スケーラビリティ</td>
                    <td>単一クライアントのみ、水平スケール不可</td>
                    <td>ステートレス化により単純なロードバランサーで水平スケール可能</td>
                    <td>セッション管理が煩雑でロードバランサー・サーバーレス基盤と相性が悪い</td>
                  </tr>
                  <tr>
                    <td>新規実装での推奨度</td>
                    <td>◎ ローカル用途</td>
                    <td>◎ リモート用途</td>
                    <td>&times; 非推奨。既存資産の移行を計画すべき</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.diagramFrame}>
              <div
                className={styles.codeBar}
                style={{ borderBottom: "none", background: "none", padding: "0 0 10px 0" }}
              >
                Fig. 4-1 — トランスポート選定の意思決定フロー
              </div>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.transport} />
              </div>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                4.2
              </span>
              stdio実装時の落とし穴
            </h3>
            <p>stdioは仕組みとしては単純ですが、実務では次の1点が最大の事故原因になります。</p>
            <div
              className={styles.notice}
              style={{
                borderLeftColor: "var(--color-text-warning, #f5716b)",
                background: "rgba(245, 113, 107, 0.08)",
              }}
            >
              <i
                className="ti ti-alert-triangle"
                style={{ color: "var(--color-text-warning, #f5716b)" }}
              />
              <div>
                <b>鉄則：</b>
                サーバーは標準出力（stdout）に
                <b>有効なJSON-RPCメッセージ以外を一切書き込んではならない</b>。デバッグ用の
                <code>console.log</code>
                やライブラリの警告出力が1行でも混入すると、メッセージストリームが破損し、クライアントがハングまたは切断されます。ログ・デバッグ出力は必ず標準エラー出力（stderr）へ送ってください。
              </div>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                4.3
              </span>
              Streamable HTTP実装時の要点
            </h3>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "20px",
                color: "var(--color-text-secondary, #aeb2bd)",
                margin: "0 0 16px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                サーバーは単一のMCPエンドポイント（例: <code>https://example.com/mcp</code>
                ）でPOSTとGETの両方をサポートする必要があります。
              </li>
              <li style={{ marginBottom: "8px" }}>
                レスポンスは通常のJSON、またはSSEストリームへのアップグレードのいずれかを選択できます。「Streamable」という名称は、この段階的なレスポンス配信能力を指しており、HTTP/2を必須とするものではありません（HTTP/1.1のchunked
                transfer encodingでも動作します）。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>DNSリバインディング攻撃対策</b>として、受信するすべての接続で<code>Origin</code>
                ヘッダーを検証すること、ローカル実行時は<code>0.0.0.0</code>ではなく
                <code>127.0.0.1</code>にバインドすることが仕様上強く推奨されています。
              </li>
              <li style={{ marginBottom: "8px" }}>
                ローカル開発とリモート本番を1つのコードベースで両立させる場合、環境変数やCLIフラグでトランスポートを切り替える設計（ツールロジックは共通化し、トランスポート初期化のみ分岐）が一般的です。
              </li>
            </ul>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                4.4
              </span>
              移行時の注意点
            </h3>
            <p>
              既存のHTTP+SSEサーバーを運用中の場合、後方互換のために旧エンドポイント（
              <code>/sse</code>と<code>/messages</code>）を維持しつつ、新しい<code>/mcp</code>
              エンドポイントを並行提供するのが仕様が定める移行パスです。ただし、Keboola社は2026年4月1日、Atlassian
              Rovo社は2026年6月30日といった形で、主要プラットフォームがSSEサポートの打ち切り期限を相次いで発表しており、
              <b>移行は計画的に急ぐべき</b>フェーズに入っています。
            </p>

            <details className={styles.refs}>
              <summary>参考資料（9件）</summary>
              <ul>
                <li>
                  MCP Specification - Transports（2025-03-26版）:{" "}
                  <a
                    href="https://modelcontextprotocol.io/specification/2025-03-26/basic/transports"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    modelcontextprotocol.io/specification/2025-03-26/basic/transports
                  </a>
                </li>
                <li>
                  MCP Server Transports - Roo Code Documentation:{" "}
                  <a
                    href="https://docs.roocode.com/features/mcp/server-transports"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    docs.roocode.com/features/mcp/server-transports
                  </a>
                </li>
                <li>
                  MCP Transport: Stdio vs Streamable HTTP — TrueFoundry:{" "}
                  <a
                    href="https://www.truefoundry.com/blog/mcp-stdio-vs-streamable-http-enterprise"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    truefoundry.com/blog/mcp-stdio-vs-streamable-http-enterprise
                  </a>
                </li>
                <li>
                  MCP Transport Protocols: stdio vs SSE vs StreamableHTTP — MCPcat:{" "}
                  <a
                    href="https://mcpcat.io/guides/comparing-stdio-sse-streamablehttp/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mcpcat.io/guides/comparing-stdio-sse-streamablehttp
                  </a>
                </li>
                <li>
                  MCP stdio vs HTTP vs SSE Transport: Which Should You Choose in 2026?:{" "}
                  <a
                    href="https://startdebugging.net/2026/07/mcp-stdio-vs-http-vs-sse-transport-which-to-choose/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    startdebugging.net/.../mcp-stdio-vs-http-vs-sse-transport-which-to-choose
                  </a>
                </li>
                <li>
                  MCP Transports Explained — ChatForest:{" "}
                  <a
                    href="https://chatforest.com/guides/mcp-transports-explained/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    chatforest.com/guides/mcp-transports-explained
                  </a>
                </li>
                <li>
                  MCP SSE vs Stdio: Transport Options Explained (2026) — Apigene:{" "}
                  <a
                    href="https://apigene.ai/blog/mcp-sse-vs-stdio"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    apigene.ai/blog/mcp-sse-vs-stdio
                  </a>
                </li>
                <li>
                  MCP Transports: stdio vs SSE vs HTTP — RapidDev:{" "}
                  <a
                    href="https://www.rapidevelopers.com/mcp-tutorial/mcp-transport-stdio-vs-sse-vs-http"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    rapidevelopers.com/mcp-tutorial/mcp-transport-stdio-vs-sse-vs-http
                  </a>
                </li>
                <li>
                  MCP Transport Mechanisms: STDIO vs Streamable HTTP — AWS Builder Center:{" "}
                  <a
                    href="https://builder.aws.com/content/35A0IphCeLvYzly9Sw40G1dVNzc/mcp-transport-mechanisms-stdio-vs-streamable-http"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    builder.aws.com/.../mcp-transport-mechanisms-stdio-vs-streamable-http
                  </a>
                </li>
              </ul>
            </details>
          </section>

          {/* ================= SECTION 05 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec05">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                05
              </span>
              <h2>コアプリミティブ設計：Tools・Resources・Prompts・Sampling・Elicitation・Roots</h2>
            </div>

            <p>
              MCPは6つの主要なプリミティブ（構成要素）を定義しています。サーバー側が提供するのが
              <b>Tools・Resources・Prompts</b>、クライアント側が提供するのが
              <b>Sampling・Elicitation・Roots</b>
              です。この非対称な設計こそが、MCPを単なる「関数呼び出しAPI」ではなく「双方向のプロトコル」たらしめている核心部分です。
            </p>
            <p
              style={{
                fontSize: "0.875em",
                color: "var(--color-text-muted, #8b98a7)",
                marginTop: "4px",
              }}
            >
              ※ 上記の6プリミティブ分類は現行安定版（<code>2025-11-25</code>）仕様に基づきます。
              2026-07-28 RC では <b>Roots</b> と <b>Sampling</b> が非推奨（deprecated）となり、
              Extensions
              機構による新設計への移行が予定されています。詳細は下記「バージョニングと後方互換性」セクションを参照してください。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                5.1
              </span>
              プリミティブ一覧
            </h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>プリミティブ</th>
                    <th>提供側</th>
                    <th>方向</th>
                    <th>制御主体</th>
                    <th>主な用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>Tools</b>
                    </td>
                    <td>サーバー</td>
                    <td>クライアント→サーバー</td>
                    <td>モデル駆動</td>
                    <td>副作用のある操作（DB更新、API呼び出し、ファイル操作）</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Resources</b>
                    </td>
                    <td>サーバー</td>
                    <td>クライアント→サーバー</td>
                    <td>アプリケーション駆動</td>
                    <td>読み取り専用データの提供（設定、ドキュメント、既存データ一覧）</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Prompts</b>
                    </td>
                    <td>サーバー</td>
                    <td>クライアント→サーバー</td>
                    <td>ユーザー駆動</td>
                    <td>再利用可能なプロンプトテンプレート</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sampling</b>
                    </td>
                    <td>クライアント</td>
                    <td>サーバー→クライアント</td>
                    <td>ホストが可否判断</td>
                    <td>サーバーがクライアント側LLMに推論を依頼（要約生成など）</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Elicitation</b>
                    </td>
                    <td>クライアント</td>
                    <td>サーバー→クライアント</td>
                    <td>ユーザーが応答</td>
                    <td>処理途中でユーザーに追加情報を確認</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Roots</b>
                    </td>
                    <td>クライアント</td>
                    <td>クライアント→サーバー</td>
                    <td>ホストが管理</td>
                    <td>サーバーがアクセスしてよい範囲を制限</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                5.2
              </span>
              プリミティブ間の連携フロー例
            </h3>
            <p>
              「最新の配送中の注文3件をメールで送って」というリクエストを例に、6つのプリミティブがどう連携するかを見てみましょう。
            </p>

            <div className={styles.diagramFrame}>
              <div
                className={styles.codeBar}
                style={{ borderBottom: "none", background: "none", padding: "0 0 10px 0" }}
              >
                Fig. 5-1 — 6プリミティブの連携シーケンス
              </div>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.primitives} />
              </div>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                5.3
              </span>
              各プリミティブの設計指針
            </h3>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "20px",
                color: "var(--color-text-secondary, #aeb2bd)",
                margin: "0 0 16px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <b>Tools：</b>
                副作用（書き込み・削除・送信など）を伴う操作は必ずToolsとして実装し、ユーザーの明示的な承認フローに乗せます。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>Resources：</b>
                「一覧を返すだけ」の読み取り専用データはResourcesとして実装し、Toolsと混同しないようにします。境界を曖昧にすると、後述するコンテキスト肥大化の原因にもなります。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>Prompts：</b>
                ドメイン知識をテンプレート化して配布したい場合（例:「インシデント報告書生成」テンプレート）に活用します。あくまで「ユーザーが明示的に選ぶ」体験を想定した設計にします。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>Sampling：</b>サーバー自身がLLM
                APIキーを持たずに、クライアント側のモデルを間接的に借用できる仕組みです。APIキーがサーバー側に漏れる心配がなく、ユーザーはどのモデル利用にも同意フローを経由します。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>Elicitation：</b>
                「危険な操作の前に必ず人に確認する」設計の中核です。ボタン選択式（accept/decline/cancel）などクライアントが解釈しやすい形式で要求するのが望ましく、機微な情報を求める設計は避けます。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>Roots：</b>
                ホスト側がサーバーに公開してよいディレクトリやリソース範囲を制限する仕組みで、最小権限の原則を実装レベルで担保します。
              </li>
            </ul>

            <details className={styles.refs}>
              <summary>参考資料（6件）</summary>
              <ul>
                <li>
                  Understanding MCP features: Tools, Resources, Prompts, Sampling, Roots, and
                  Elicitation — WorkOS:{" "}
                  <a
                    href="https://workos.com/blog/mcp-features-guide"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    workos.com/blog/mcp-features-guide
                  </a>
                </li>
                <li>
                  What is MCP elicitation and sampling? — Stacktree:{" "}
                  <a
                    href="https://stacktr.ee/blog/what-is-mcp-elicitation"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    stacktr.ee/blog/what-is-mcp-elicitation
                  </a>
                </li>
                <li>
                  MCP Concepts: Sampling and Elicitation — Medium:{" "}
                  <a
                    href="https://medium.com/@__nagarajan__/mcp-concepts-sampling-and-elicitation-95c5c0c4df71"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    medium.com/@__nagarajan__/mcp-concepts-sampling-and-elicitation
                  </a>
                </li>
                <li>
                  Memgraph MCP Experimental Server: Elicitation and Sampling Explained:{" "}
                  <a
                    href="https://memgraph.com/blog/memgraph-mcp-elicitation-and-sampling"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    memgraph.com/blog/memgraph-mcp-elicitation-and-sampling
                  </a>
                </li>
                <li>
                  MCP Client Concepts: How Elicitation, Sampling, and Roots Make AI Agents
                  Responsible:{" "}
                  <a
                    href="https://medium.com/@puneetsharma41/mcp-client-concepts-how-elicitation-sampling-and-roots-make-ai-agents-responsible-5f02a0666d9a"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    medium.com/@puneetsharma41/mcp-client-concepts
                  </a>
                </li>
                <li>
                  The Model Context Protocol (MCP): Deep dive into structure and concepts — HMS:{" "}
                  <a
                    href="https://www.analytical-software.de/en/the-model-context-protocol-mcp-deep-dive-into-structure-and-concepts/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    analytical-software.de/.../mcp-deep-dive-into-structure-and-concepts
                  </a>
                </li>
              </ul>
            </details>
          </section>

          {/* ================= SECTION 06 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec06">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                06
              </span>
              <h2>ツール設計のベストプラクティス（Anthropic公式指針）</h2>
            </div>

            <p>
              Anthropicのエンジニアリングチームは &quot;Writing effective tools for agents—using
              agents&quot;
              と題した記事で、ツール設計に関する実証的な知見を公開しています。核心的な主張は、
              <b>開発者向けAPIの設計原則と、エージェント向けツールの設計原則は根本的に異なる</b>
              という点です。決定論的なシステム向けの設計思想（人間が仕様を読んで正しく呼び出す前提）を、非決定論的なエージェント向けにそのまま持ち込むと機能しません。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                6.1
              </span>
              主要な設計原則
            </h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>原則</th>
                    <th>内容</th>
                    <th>Bad例</th>
                    <th>Good例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>高レバレッジなツールを選ぶ</b>
                    </td>
                    <td>
                      既存APIの薄いラッパーではなく、エージェントの能力を実質的に拡張するツールを優先する
                    </td>
                    <td>既存REST APIを1エンドポイント=1ツールで機械的に変換</td>
                    <td>複数のAPI呼び出しをまとめた「意味のある業務単位」のツール</td>
                  </tr>
                  <tr>
                    <td>
                      <b>名前空間で衝突を防ぐ</b>
                    </td>
                    <td>
                      ドメインごとにプレフィックスを付け、似た名前のツールが混在しないようにする
                    </td>
                    <td>
                      <code>search</code>, <code>get_status</code> のような汎用名
                    </td>
                    <td>
                      <code>asana_search_tasks</code>, <code>github_get_pr_status</code>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>検索指向のツールを優先する</b>
                    </td>
                    <td>
                      <code>list_all</code>型ではなく<code>search</code>
                      型のツールを用意し、大量データを一度に返さない
                    </td>
                    <td>
                      <code>list_contacts</code>（全件返却）
                    </td>
                    <td>
                      <code>search_contacts(query, limit)</code>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>人間が読める文脈を返す</b>
                    </td>
                    <td>
                      生のID（<code>user_id: &quot;8f3e...&quot;</code>
                      ）ではなく、意味のあるフィールドを返す
                    </td>
                    <td>
                      <code>{'{"id":"usr_123","status":2}'}</code>
                    </td>
                    <td>
                      <code>{'{"user_name":"田中太郎","status":"承認待ち"}'}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>トークン効率を最適化する</b>
                    </td>
                    <td>
                      ページネーション・切り詰め・フィルタリングを実装し、無制限のデータ返却を避ける
                    </td>
                    <td>数万行のCSVを丸ごと返す</td>
                    <td>
                      <code>limit</code>/<code>offset</code>付きで必要な範囲のみ返す
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>明確な使用ガイダンスを含める</b>
                    </td>
                    <td>
                      「いつ使うべきでないか」「トークン予算」「期待レスポンス時間」まで説明文に含める
                    </td>
                    <td>「チャットで質問する」</td>
                    <td>
                      「質問・調査に利用。概要形式(~500トークン,2-5秒)/詳細形式(~2000トークン,5-10秒)。レート制限:60req/分」
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>エラーメッセージで行動を誘導する</b>
                    </td>
                    <td>
                      スタックトレースやエラーコードだけでなく、次に取るべき具体的な行動を提示する
                    </td>
                    <td>
                      <code>Error 403</code>
                    </td>
                    <td>
                      「&apos;thread_id&apos;の編集権限がありません。所有者にアクセス権を依頼するか、別のthread_idを使用してください。」
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                6.2
              </span>
              評価駆動の反復改善
            </h3>
            <p>
              Anthropicが強調するもう1つの要点は、
              <b>ツール自体の評価（Evaluation）をシステム的に構築すること</b>
              です。手作業の勘に頼った改善ではなく、タスク成功率・トークン消費量・エラー率を定量的に測定できる評価セットを用意し、Claude
              Code自身にツール定義を最適化させる「自己改善ループ」を回す手法が紹介されています。実際に、ツールの説明文（description）を精密に調整するだけで、Claude
              Sonnet 3.5がSWE-bench Verifiedで大幅な性能向上を達成した事例が報告されています。
            </p>

            <div className={styles.diagramFrame}>
              <div
                className={styles.codeBar}
                style={{ borderBottom: "none", background: "none", padding: "0 0 10px 0" }}
              >
                Fig. 6-1 — 評価駆動によるツール改善サイクル
              </div>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.improvement} />
              </div>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                6.3
              </span>
              アノテーションによる意図の開示
            </h3>
            <p>
              MCP仕様では、ツールに<code>annotations</code>
              を付与し、そのツールが「オープンワールドアクセス（外部ネットワーク呼び出し等）を必要とするか」「破壊的変更（削除・上書き）を行うか」を宣言できます。これはUXレベルの安全対策であると同時に、後述するセキュリティ対策の土台にもなります。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                6.4
              </span>
              実装レベルのチェックリスト
            </h3>
            <ul style={{ listStyleType: "none", paddingLeft: "0px", margin: "20px 0" }}>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>
                  ツール名は<code>{`{ドメイン}_{動詞}_{対象}`}</code>
                  のような一貫した命名規則に従っているか
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>
                  <code>list_all</code>系ツールを<code>search</code>
                  系に置き換えられないか再検討したか
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>レスポンスに生のIDだけでなく人間が読めるフィールドを含めているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>ページネーション・フィルタ・詳細度パラメータを用意しているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>エラーレスポンスは「次に取るべき行動」を明示しているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>
                  破壊的操作には<code>annotations</code>
                  で明示し、確認フロー（Elicitation）を挟んでいるか
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>評価セットを用意し、変更のたびに定量的な回帰確認をしているか</span>
              </li>
            </ul>

            <details className={styles.refs}>
              <summary>参考資料（4件）</summary>
              <ul>
                <li>
                  Writing effective tools for AI agents—using AI agents（Anthropic公式）:{" "}
                  <a
                    href="https://www.anthropic.com/engineering/writing-tools-for-agents"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    anthropic.com/engineering/writing-tools-for-agents
                  </a>
                </li>
                <li>
                  Writing Effective Tools for AI Agents: Lessons from Anthropic — Medium:{" "}
                  <a
                    href="https://laxmikumars.medium.com/writing-effective-tools-for-ai-agents-lessons-from-anthropic-25b85bf74f5d"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    laxmikumars.medium.com/.../lessons-from-anthropic
                  </a>
                </li>
                <li>
                  Writing Effective Tools for AI Agents: Production Lessons from Anthropic — Medium:{" "}
                  <a
                    href="https://techwithibrahim.medium.com/writing-effective-tools-for-ai-agents-production-lessons-from-anthropic-99ea76a7fcf0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    techwithibrahim.medium.com/.../production-lessons-from-anthropic
                  </a>
                </li>
                <li>
                  ADR-0023: Anthropic Tool Design Best Practices（実装事例）:{" "}
                  <a
                    href="https://github.com/vishnu2kmohan/mcp-server-langgraph/blob/main/adr/adr-0023-anthropic-tool-design-best-practices.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/vishnu2kmohan/mcp-server-langgraph/.../adr-0023
                  </a>
                </li>
              </ul>
            </details>
          </section>

          {/* ================= SECTION 07 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec07">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                07
              </span>
              <h2>コンテキスト管理とスケーラビリティ：ツール肥大化問題への対処</h2>
            </div>

            <p>
              MCPが普及するにつれ、2026年に入って最も頻繁に報告されている実運用上の課題が
              <b>「コンテキスト肥大化（Context Bloat）」</b>
              です。複数のMCPサーバーを接続すると、各サーバーが持つツール定義（名前・説明文・パラメータスキーマ）がすべて起動時にモデルのコンテキストウィンドウへ読み込まれるため、会話が始まる前に大量のトークンを消費してしまいます。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                7.1
              </span>
              問題の規模
            </h3>
            <p>
              実測例として、GitHub・Slack・Sentry・Grafana・Splunkの5サーバーを接続した構成では、約58個のツールでおよそ55,000トークンが会話開始前に消費されるという報告があります。別の事例では、GitHub・Playwright・IDE統合の3サーバーだけで20万トークンのウィンドウの72%（約14.3万トークン）が消費されたケースも報告されています。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>指標</th>
                    <th>悪化の内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>トークンコスト</b>
                    </td>
                    <td>
                      ツール定義1個あたり200〜800トークン。50ツールで1万〜2.5万トークンが毎リクエスト消費される
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>選択精度の低下</b>
                    </td>
                    <td>
                      ツール数が30〜50個を超えると選択精度が大きく低下する。RAG-MCP論文では、肥大化したツールセットで選択精度が43%から14%未満まで低下（約3分の1）したと報告
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>レイテンシ増加</b>
                    </td>
                    <td>コンテキストが肥大化するほどモデルの処理時間が伸びる</td>
                  </tr>
                  <tr>
                    <td>
                      <b>誤動作パターン</b>
                    </td>
                    <td>
                      似た名前のツール（get_status/fetch_status/query_status）の混同、存在しないツール名のハルシネーション、選択不能によるフリーズ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                7.2
              </span>
              対処法の全体像
            </h3>
            <p>2026年に入り、この問題に対する複数のアプローチが実用段階に入りました。</p>

            <div className={styles.diagramFrame}>
              <div
                className={styles.codeBar}
                style={{ borderBottom: "none", background: "none", padding: "0 0 10px 0" }}
              >
                Fig. 7-1 — 旧方式 vs 段階的開示（Progressive Disclosure）
              </div>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.disclosure} />
              </div>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                7.3
              </span>
              具体的な対策一覧
            </h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>対策</th>
                    <th>概要</th>
                    <th>効果の目安</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>Tool Search（遅延ロード）</b>
                    </td>
                    <td>
                      ツール定義に<code>defer_loading: true</code>
                      を付与し、起動時は検索インターフェースのみ提示、必要な時に個別スキーマを取得する
                    </td>
                    <td>トークン消費を最大85%削減（Anthropic計測）</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Code Execution with MCP</b>
                    </td>
                    <td>
                      MCPサーバーをツール呼び出しの羅列ではなく「コードAPI」として提示し、エージェントがコードを書いて呼び出す。中間結果はコード実行環境内に留める
                    </td>
                    <td>
                      大規模API（2,500以上のエンドポイント）で入力トークンを99.9%削減した事例あり
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>RAG-MCP（検索拡張ツール選択）</b>
                    </td>
                    <td>
                      全ツールをベクトル空間に埋め込み、クエリに応じて意味的に近い上位ツールのみをコンテキストへ注入する
                    </td>
                    <td>ツール選択精度が3倍以上、プロンプトトークンを50%以上削減</td>
                  </tr>
                  <tr>
                    <td>
                      <b>サーバーの分割</b>
                    </td>
                    <td>
                      1つの巨大なMCPサーバーではなく、ドメインごとに小さなサーバーへ分割し、必要なものだけ接続する
                    </td>
                    <td>実運用時のツール数そのものを削減</td>
                  </tr>
                  <tr>
                    <td>
                      <b>使わないサーバーを接続しない</b>
                    </td>
                    <td>
                      セッションごとに本当に必要なMCPサーバーのみ接続する、という最も単純だが効果の大きい対策
                    </td>
                    <td>追加コスト・複雑さゼロで実施可能</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                7.4
              </span>
              実務上の指針
            </h3>
            <ol
              style={{
                paddingLeft: "20px",
                color: "var(--color-text-secondary, #aeb2bd)",
                margin: "0 0 16px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                接続するMCPサーバー数を<b>「必要最小限」に絞る</b>運用ルールをチーム内で明文化する。
              </li>
              <li style={{ marginBottom: "8px" }}>
                サーバー実装者側は、<b>既存APIをそのまま1対1でツール化しない</b>
                。前章のツール設計原則（検索指向、意味のある単位）を徹底することが、肥大化対策の第一歩になる。
              </li>
              <li style={{ marginBottom: "8px" }}>
                クライアント/フレームワーク側がTool SearchやCode
                Executionパターンをサポートしている場合は、積極的に有効化する（Claude Codeでは
                <code>ENABLE_TOOL_SEARCH</code>環境変数などで制御可能）。
              </li>
              <li style={{ marginBottom: "8px" }}>
                ツール出力自体の肥大化（生HTML・base64画像・巨大JSONをそのまま返す）にも注意し、サーバー側で出力の切り詰めやアノテーション化（大きな結果を外部に保存し参照IDのみ返す）を検討する。
              </li>
            </ol>

            <details className={styles.refs}>
              <summary>参考資料（8件）</summary>
              <ul>
                <li>
                  Code execution with MCP: building more efficient AI agents（Anthropic公式）:{" "}
                  <a
                    href="https://www.anthropic.com/engineering/code-execution-with-mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    anthropic.com/engineering/code-execution-with-mcp
                  </a>
                </li>
                <li>
                  When too many tools become too much context — WRITER:{" "}
                  <a
                    href="https://writer.com/engineering/rag-mcp/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    writer.com/engineering/rag-mcp
                  </a>
                </li>
                <li>
                  How to Prevent MCP Tool Overload and Build Faster, Safer AI Agents — Lunar.dev:{" "}
                  <a
                    href="https://www.lunar.dev/post/why-is-there-mcp-tool-overload-and-how-to-solve-it-for-your-ai-agents"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    lunar.dev/post/why-is-there-mcp-tool-overload
                  </a>
                </li>
                <li>
                  MCP&apos;s Context Bloat Crisis — AgentMarketCap:{" "}
                  <a
                    href="https://agentmarketcap.ai/blog/2026/04/08/mcp-context-bloat-enterprise-scale-tool-definitions-agent-context-budget"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    agentmarketcap.ai/blog/2026/04/08/mcp-context-bloat
                  </a>
                </li>
                <li>
                  MCP Context Bloat Fix 2026 (Tool Search) — MCP.Directory:{" "}
                  <a
                    href="https://mcp.directory/blog/mcp-context-bloat-fix-2026-tool-search-code-mode-progressive-disclosure"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mcp.directory/blog/mcp-context-bloat-fix-2026
                  </a>
                </li>
                <li>
                  How to Reduce the Number of MCP Tools Claude Loads — Start Debugging:{" "}
                  <a
                    href="https://startdebugging.net/2026/05/how-to-reduce-the-number-of-mcp-tools-claude-loads/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    startdebugging.net/2026/05/how-to-reduce-the-number-of-mcp-tools-claude-loads
                  </a>
                </li>
                <li>
                  10 strategies to reduce MCP token bloat — The New Stack:{" "}
                  <a
                    href="https://thenewstack.io/how-to-reduce-mcp-token-bloat/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    thenewstack.io/how-to-reduce-mcp-token-bloat
                  </a>
                </li>
                <li>
                  Thousands of MCP Tools, Zero Context Left — AgentPMT:{" "}
                  <a
                    href="https://www.agentpmt.com/articles/thousands-of-mcp-tools-zero-context-left-the-bloat-tax-breaking-ai-agents"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    agentpmt.com/articles/thousands-of-mcp-tools-zero-context-left
                  </a>
                </li>
              </ul>
            </details>
          </section>

          {/* ================= SECTION 08 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec08">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                08
              </span>
              <h2>認証・認可：OAuth 2.1によるセキュアなMCPサーバー</h2>
            </div>

            <p>
              リモートのMCPサーバー（Streamable
              HTTPトランスポート）において、認可は「任意」とされていますが、ユーザー固有データ（メール、ドキュメント、DB）や管理操作を扱う場合は
              <b>強く推奨</b>されています。MCPは独自の認証方式を発明するのではなく、
              <b>OAuth 2.1の規約に従う</b>という設計判断をしています。
            </p>

            <p>
              しかし現実には、2026年の監査でも依然として
              <b>
                MCPサーバーの40%が無認証のまま運用され、43%がコマンドインジェクション脆弱性を抱え、79%が認証情報を平文で扱っている
              </b>
              という報告があり、「仕様は健全だが実装が追いついていない」状態が続いています。実装のハードルの高さから、静的APIキーに頼るサーバーが53%に上るという調査結果も報告されています。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                8.1
              </span>
              基本アーキテクチャ：責務の分離
            </h3>
            <p>
              2025-06-18仕様以降、
              <b>
                MCPサーバーはOAuthの「リソースサーバー」として、認可サーバー（Authorization
                Server）と役割（責務）の観点で分離
              </b>
              されることが公式に規定されました。この分離は役割上の定義であり、物理的・デプロイ面での強制的な分離を意味するものではありません。認可サーバーは同じホストを共有して動作することも、独立した別個のエンティティとしてデプロイされることも可能です。以前のバージョンではMCPサーバーがリソースサーバーと認可サーバーを兼務する設計も許容されており、これが実装の複雑さの一因になっていました。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>コンポーネント</th>
                    <th>役割</th>
                    <th>実装例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>
                        MCPサーバー
                        <br />
                        （リソースサーバー）
                      </b>
                    </td>
                    <td>
                      トークンを検証し、スコープに応じてツール実行を許可/拒否する。ログイン画面もトークン発行も行わない
                    </td>
                    <td>自作のMCPサーバー本体</td>
                  </tr>
                  <tr>
                    <td>
                      <b>認可サーバー</b>
                    </td>
                    <td>ユーザー認証、同意画面の表示、トークンの発行・失効を担う</td>
                    <td>Keycloak, Auth0, WorkOS, Microsoft Entra ID</td>
                  </tr>
                  <tr>
                    <td>
                      <b>MCPクライアント</b>
                    </td>
                    <td>
                      OAuth
                      2.1のクライアントとして振る舞い、PKCEを用いた認可コードフローでトークンを取得する
                    </td>
                    <td>Claude Desktop, Claude Code, カスタムエージェント</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                8.2
              </span>
              認可フローの全体像
            </h3>
            <div className={styles.diagramFrame}>
              <div
                className={styles.codeBar}
                style={{ borderBottom: "none", background: "none", padding: "0 0 10px 0" }}
              >
                Fig. 8-1 — OAuth 2.1認可コードフロー（PKCE）
              </div>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.oauth} />
              </div>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                8.3
              </span>
              仕様が要求する主要コンポーネント
            </h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>仕様要素</th>
                    <th>目的</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>PKCE</b>
                      <br />
                      (Proof Key for Code Exchange)
                    </td>
                    <td>
                      認可コード横取り攻撃を防ぐ。クライアント側で生成した<code>code_verifier</code>
                      をトークン交換時に提示させ、公開クライアント（デスクトップアプリ等）でも安全に認証できるようにする
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Protected Resource Metadata</b>
                      <br />
                      (PRM, RFC 9728)
                    </td>
                    <td>
                      MCPサーバーが<code>/.well-known/oauth-protected-resource</code>
                      で自身に対応する認可サーバーの情報を公開する仕組み
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Resource Indicators</b>
                      <br />
                      (RFC 8707)
                    </td>
                    <td>
                      トークンの<code>audience</code>
                      を特定のMCPサーバーに限定し、あるサーバー用のトークンが別のサーバーで不正に再利用されるのを防ぐ
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Dynamic Client Registration</b>
                      <br />
                      (DCR, RFC 7591)
                    </td>
                    <td>
                      クライアントが事前調整なしに認可サーバーへ自己登録できる仕組み。無制限に許可すると悪用の余地があるため統制が必須
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Client ID Metadata Documents</b>
                      <br />
                      (CIMD)
                    </td>
                    <td>
                      DCRの課題を解決するため、クライアントがHTTPS
                      URL上に静的なJSONメタデータを公開する新方式。オープンなMCPエコシステム向けの推奨デフォルトとして採用が進む
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                8.4
              </span>
              実装ベストプラクティス
            </h3>
            <ol
              style={{
                paddingLeft: "20px",
                color: "var(--color-text-secondary, #aeb2bd)",
                margin: "0 0 16px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <b>トークン検証は自作しない：</b>
                署名検証・スコープ判定などのロジックは、成熟した検証済みライブラリに任せる。MCP公式ドキュメントも「専門家でない限り自作するな」と明記しています。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>短命なアクセストークンを使う：</b>
                長命トークンは、盗まれた場合の被害期間が長くなります。リフレッシュトークンと組み合わせ、短寿命を基本とします。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>audience（対象者）を必ず検証する：</b>
                自分のサーバー宛てに発行されたトークンかどうかをResource
                Indicatorsで確認し、他サーバー用トークンの使い回しを拒否します。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>realm/テナントを分離する：</b>
                マルチテナント運用でない限り、1つの認可レルムに固定し、同一の認可サーバー内であっても他レルムのトークンは拒否します。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>DCRを有効にする場合は統制をかける：</b>
                無制限の匿名登録を許可せず、信頼できるホストの許可リストや審査プロセスを設ける。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>機微情報をログに残さない：</b>
                アクセストークン・認可コード・シークレット・Authorizationヘッダーの内容はログに出力しない。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>JWTのローカル検証とトークンイントロスペクションを使い分ける：</b>
                通常の読み取り系ツールは署名検証+短いTTLのJWKSキャッシュで十分ですが、書き込み・PII・金銭取引を伴う高セキュリティなツールでは、即時失効が反映できるイントロスペクション方式を検討します。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>ローカル（stdio）サーバーの認証：</b>
                stdioはOSレベルの信頼境界内で動作するため、環境変数や外部ライブラリが提供する資格情報を使うのが一般的です。OAuthはリモートのHTTPベーストランスポート向けの設計であることを理解しておきます。
              </li>
            </ol>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                8.5
              </span>
              エンタープライズでの委譲パターン
            </h3>
            <p>
              大規模組織では、MCPサーバーが独自にOAuthサーバーを実装するのではなく、既存の企業IdP（Keycloak、Entra
              ID等）に認可を委譲するパターンが標準になりつつあります。MCPサーバーは「リソースサーバーとして振る舞い、スコープを強制するだけ」というシンプルな責務に留め、ログイン画面・トークン発行・クライアント登録といった重い処理はIdP側に任せます。これにより、企業のSSO・多要素認証（MFA）基盤をそのまま再利用できます。
            </p>

            <details className={styles.refs}>
              <summary>参考資料（10件）</summary>
              <ul>
                <li>
                  Understanding Authorization in MCP（MCP公式）:{" "}
                  <a
                    href="https://modelcontextprotocol.io/docs/tutorials/security/authorization"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    modelcontextprotocol.io/docs/tutorials/security/authorization
                  </a>
                </li>
                <li>
                  MCP security: Implementing robust authentication and authorization — Red Hat:{" "}
                  <a
                    href="https://www.redhat.com/en/blog/mcp-security-implementing-robust-authentication-and-authorization"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    redhat.com/en/blog/mcp-security-implementing-robust-authentication-and-authorization
                  </a>
                </li>
                <li>
                  MCP Server Security: Auth Best Practices 2026:{" "}
                  <a
                    href="https://medium.com/data-science-collective/why-your-mcp-server-is-a-security-disaster-waiting-to-happen-660577d8077c"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    medium.com/data-science-collective/why-your-mcp-server-is-a-security-disaster
                  </a>
                </li>
                <li>
                  MCP OAuth 2.1 Authentication: Complete Developer Guide 2026 — RockB:{" "}
                  <a
                    href="https://baeseokjae.github.io/posts/mcp-oauth-authentication-guide-2026/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    baeseokjae.github.io/posts/mcp-oauth-authentication-guide-2026
                  </a>
                </li>
                <li>
                  How MCP Authentication Works: Authorization, OAuth & Security — Obot:{" "}
                  <a
                    href="https://obot.ai/resources/learning-center/mcp-authentication/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    obot.ai/resources/learning-center/mcp-authentication
                  </a>
                </li>
                <li>
                  How to Secure MCP Servers (2026 Guide):{" "}
                  <a
                    href="https://codersera.com/blog/how-to-secure-mcp-servers-2026/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    codersera.com/blog/how-to-secure-mcp-servers-2026
                  </a>
                </li>
                <li>
                  The New MCP Authorization Specification:{" "}
                  <a
                    href="https://dasroot.net/posts/2026/04/mcp-authorization-specification-oauth-2-1-resource-indicators/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dasroot.net/posts/2026/04/mcp-authorization-specification
                  </a>
                </li>
                <li>
                  MCP Server Security Best Practices to Prevent Risk — Descope:{" "}
                  <a
                    href="https://www.descope.com/blog/post/mcp-server-security-best-practices"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    descope.com/blog/post/mcp-server-security-best-practices
                  </a>
                </li>
                <li>
                  MCP server authentication in 2026: what practitioners need to know:{" "}
                  <a
                    href="https://nhimg.org/articles/mcp-server-authentication-in-2026-what-practitioners-need-to-know/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    nhimg.org/articles/mcp-server-authentication-in-2026
                  </a>
                </li>
                <li>
                  The best providers for MCP server authentication in 2026 — WorkOS:{" "}
                  <a
                    href="https://workos.com/blog/best-mcp-server-authentication-providers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    workos.com/blog/best-mcp-server-authentication-providers
                  </a>
                </li>
              </ul>
            </details>
          </section>

          {/* ================= SECTION 09 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec09">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                09
              </span>
              <h2>セキュリティ脅威と対策：Tool Poisoning・Prompt Injection・Confused Deputy</h2>
            </div>

            <p>
              OAuthによる認証・認可を固めても、MCP特有の脅威モデルはそれだけではカバーできません。MCPの核心的なリスクは、
              <b>
                「ツールのメタデータや実行結果がそのままLLMのコンテキストに注入され、信頼できる指示として解釈されてしまう」
              </b>
              という構造そのものに起因します。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                9.1
              </span>
              Tool Poisoning（ツールポイズニング）の仕組み
            </h3>
            <p>
              Tool
              Poisoningは間接的プロンプトインジェクションの一種で、悪意のあるMCPサーバーがツールの名前・説明文・パラメータスキーマ、あるいは実行結果の中に、ユーザーには見えないがLLMには読み取られる悪意ある指示を埋め込む攻撃です。
            </p>

            <div className={styles.diagramFrame}>
              <div
                className={styles.codeBar}
                style={{ borderBottom: "none", background: "none", padding: "0 0 10px 0" }}
              >
                Fig. 9-1 — Tool Poisoning攻撃の仕組み
              </div>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.poisoning} />
              </div>
            </div>

            <p>
              攻撃を特に厄介にしているのが「<b>Rug Pull（ラグプル）</b>
              」という手口です。ユーザーが一度レビュー・承認した正規のツールが、承認後にサーバー側の定義だけ静かに書き換えられ、悪意ある指示が追加されるというものです。一度承認したツールを再チェックする習慣は通常ないため、検知が非常に困難になります。
            </p>

            <p>
              さらに研究では、<b>Full-Schema Poisoning（FSP）</b>
              として、説明文だけでなくパラメータ名・型・デフォルト値・enum値などスキーマ全体が攻撃対象になり得ること、また
              <b>Active Tool Poisoning Attack（ATPA）</b>
              として、ツールの出力（エラーメッセージも含む）が動的に悪意ある指示を生成するケースも報告されています。学術研究（MCPTox）では、20種のLLMエージェントに対して最大72.8%の攻撃成功率が観測され、最も拒否率が高かったClaude
              3.7 Sonnetでも拒否率は3%未満だったと報告されています。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                9.2
              </span>
              主要な脅威の一覧と対策
            </h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>脅威</th>
                    <th>概要</th>
                    <th>主な対策</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>Tool Poisoning</b>
                    </td>
                    <td>ツールのメタデータ（説明文・スキーマ）に悪意ある指示を埋め込む</td>
                    <td>
                      承認済みサーバーの許可リスト化、静的スキャンによる異常検知、最小権限設計
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Rug Pull</b>
                    </td>
                    <td>承認後にツール定義を密かに書き換える</td>
                    <td>ツール定義のハッシュ値・バージョンを記録し、変更時は再承認を要求</td>
                  </tr>
                  <tr>
                    <td>
                      <b>間接的プロンプトインジェクション</b>
                    </td>
                    <td>ツールの実行結果（外部データ）に悪意ある指示を混入させる</td>
                    <td>ツール応答を「信頼できないデータ」として扱い、構造化出力を要求</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Confused Deputy攻撃</b>
                    </td>
                    <td>
                      高権限エージェントが低権限リクエスト経由で意図しない高権限操作を実行してしまう
                    </td>
                    <td>ツール実行層でアクセス制御を強制し、LLMの指示追従だけに依存しない</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Token Passthrough</b>
                    </td>
                    <td>クライアントのトークンをそのまま下流APIへ転送してしまう</td>
                    <td>
                      トークン交換（Token Exchange）で下流専用の権限に絞ったトークンへ変換する
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>SSRF</b>
                    </td>
                    <td>
                      ツールが任意のURLへのリクエストを許してしまい、内部ネットワークへの不正アクセスに悪用される
                    </td>
                    <td>プライベートIPレンジへのアウトバウンド通信をブロックする許可リスト方式</td>
                  </tr>
                  <tr>
                    <td>
                      <b>コマンドインジェクション/パストラバーサル</b>
                    </td>
                    <td>入力値をサニタイズせずシェルコマンドやファイルパスに渡してしまう</td>
                    <td>
                      すべての入力をスキーマで厳格に検証し、シェル呼び出しの代わりに安全なAPIを使う
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                9.3
              </span>
              具体的な防御レイヤー
            </h3>
            <ol
              style={{
                paddingLeft: "20px",
                color: "var(--color-text-secondary, #aeb2bd)",
                margin: "0 0 16px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <b>信頼境界を明示的に設計する：</b>
                「内部ツール」と「外部・未検証サーバーのツール」を同一の権限レベルで扱わない。外部サーバーからの応答が、内部の高権限ツール呼び出しを誘発できないようにアーキテクチャで分離します。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>許可リスト運用を徹底する：</b>
                ユーザーが任意のMCPサーバーへ自由に接続できる状態を避け、事前に審査・承認したサーバーのみ接続可能にします。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>破壊的操作の前には必ず人間の確認を挟む：</b>
                Elicitationプリミティブや明示的な承認ダイアログを使い、LLMコンテキスト外で（=プロンプトインジェクションで迂回できない経路で）承認を得ます。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>構造化出力を要求する：</b>
                可能な限り、ツールの応答は自由形式テキストではなく固定スキーマのJSONを要求し、想定と異なる形状の応答は拒否します。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>ランタイム監査を行う：</b>
                すべてのツール呼び出しをログに記録し、「機密データへの予期しないアクセス」「エラー直後に発生する不審な連続ツール呼び出し」などの異常パターンを監視します。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>供給網（サプライチェーン）セキュリティ：</b>
                サードパーティ製MCPサーバーは、依存関係の透明性やコード署名の有無を確認し、信頼できる供給元からのみ導入します。
              </li>
            </ol>

            <div className={styles.diagramFrame}>
              <div
                className={styles.codeBar}
                style={{ borderBottom: "none", background: "none", padding: "0 0 10px 0" }}
              >
                Fig. 9-2 — 外部サーバー応答に対する防御フロー
              </div>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.defense} />
              </div>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                9.4
              </span>
              実務チェックリスト
            </h3>
            <ul style={{ listStyleType: "none", paddingLeft: "0px", margin: "20px 0" }}>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>接続可能なMCPサーバーの許可リストを運用しているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>ツール定義のバージョン変更（Rug Pull）を検知する仕組みがあるか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>ツール応答を「信頼できないデータ」として扱い、構造検証をしているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>破壊的操作にはLLMコンテキスト外の承認フローを設けているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>SSRF対策としてプライベートIPレンジへのアウトバウンド制御をしているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>すべてのツール呼び出しを監査ログに記録し、異常検知の仕組みがあるか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>
                  クライアントトークンを下流APIへそのまま転送していないか（トークン交換を使っているか）
                </span>
              </li>
            </ul>

            <details className={styles.refs}>
              <summary>参考資料（10件）</summary>
              <ul>
                <li>
                  MCP Tool Poisoning — OWASP Foundation:{" "}
                  <a
                    href="https://owasp.org/www-community/attacks/MCP_Tool_Poisoning"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    owasp.org/www-community/attacks/MCP_Tool_Poisoning
                  </a>
                </li>
                <li>
                  MCP Security Vulnerabilities: How to Prevent Prompt Injection and Tool Poisoning
                  Attacks in 2026 — Practical DevSecOps:{" "}
                  <a
                    href="https://www.practical-devsecops.com/mcp-security-vulnerabilities/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    practical-devsecops.com/mcp-security-vulnerabilities
                  </a>
                </li>
                <li>
                  Understanding MCP Tool Poisoning Attacks — Descope:{" "}
                  <a
                    href="https://www.descope.com/learn/post/mcp-tool-poisoning"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    descope.com/learn/post/mcp-tool-poisoning
                  </a>
                </li>
                <li>
                  Protecting against indirect prompt injection attacks in MCP — Microsoft for
                  Developers:{" "}
                  <a
                    href="https://developer.microsoft.com/blog/protecting-against-indirect-injection-attacks-mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    developer.microsoft.com/blog/protecting-against-indirect-injection-attacks-mcp
                  </a>
                </li>
                <li>
                  Prompt injection in MCP: how tool poisoning works — Aptible:{" "}
                  <a
                    href="https://www.aptible.com/mcp-security/mcp-prompt-injection"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    aptible.com/mcp-security/mcp-prompt-injection
                  </a>
                </li>
                <li>
                  MCP Tool Poisoning - How It Works & How To Fight It — MCP Manager:{" "}
                  <a
                    href="https://mcpmanager.ai/blog/tool-poisoning/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mcpmanager.ai/blog/tool-poisoning
                  </a>
                </li>
                <li>
                  Model Context Protocol Threat Modeling（MCPTox学術研究）:{" "}
                  <a
                    href="https://arxiv.org/html/2603.22489v1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    arxiv.org/html/2603.22489v1
                  </a>
                </li>
                <li>
                  Poison everywhere: No output from your MCP server is safe — CyberArk:{" "}
                  <a
                    href="https://www.cyberark.com/resources/threat-research-blog/poison-everywhere-no-output-from-your-mcp-server-is-safe"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    cyberark.com/resources/threat-research-blog/poison-everywhere
                  </a>
                </li>
                <li>
                  MCP security: How to prevent prompt injection and tool poisoning attacks —
                  Security Boulevard:{" "}
                  <a
                    href="https://securityboulevard.com/2026/01/mcp-security-how-to-prevent-prompt-injection-and-tool-poisoning-attacks/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    securityboulevard.com/2026/01/mcp-security
                  </a>
                </li>
                <li>
                  MCP Security: How to Stop Prompt Injection Attacks — Datadome:{" "}
                  <a
                    href="https://datadome.co/agent-trust-management/mcp-security-prompt-injection-prevention/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    datadome.co/agent-trust-management/mcp-security-prompt-injection-prevention
                  </a>
                </li>
              </ul>
            </details>
          </section>

          {/* ================= SECTION 10 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec10">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                10
              </span>
              <h2>テストとデバッグ：MCP Inspectorの活用</h2>
            </div>

            <p>
              MCPサーバーの開発では、標準的なprintデバッグやインタラクティブデバッガがそのままでは使いにくいという特有の課題があります。stdioトランスポートでは標準出力がプロトコルメッセージ専用のため、通常のログ出力すら破壊的な影響を及ぼしうるからです。この課題を解決するのが公式ツール{" "}
              <b>MCP Inspector</b> です。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                10.1
              </span>
              MCP Inspectorの構成
            </h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>コンポーネント</th>
                    <th>役割</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>MCP Inspector Client (MCPI)</b>
                    </td>
                    <td>
                      React製のWebベースUI。ツール・リソース・プロンプトを対話的にテストできる
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>MCP Proxy (MCPP)</b>
                    </td>
                    <td>
                      Node.js製のプロトコルブリッジ。Web UIとMCPサーバー間を、stdio・SSE・Streamable
                      HTTPなど複数のトランスポートで橋渡しする
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>ターミナル</span>
                <span className={styles.codeLang}>BASH</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-bash">
                  <span className={styles.codeLine}>
                    <span className={styles.cc}># ローカルのMCPサーバー（stdio）をテスト</span>
                  </span>
                  <span className={styles.codeLine}>
                    <span className={styles.cv}>
                      npx @modelcontextprotocol/inspector node build/index.js
                    </span>
                  </span>
                  <span className={styles.codeLine}></span>
                  <span className={styles.codeLine}>
                    <span className={styles.cc}># CLIモード（スクリプト・CI統合向け）</span>
                  </span>
                  <span className={styles.codeLine}>
                    <span className={styles.cv}>
                      npx @modelcontextprotocol/inspector --cli node build/index.js
                    </span>
                  </span>
                </code>
              </pre>
            </div>

            <p>
              起動すると、既定で <code>http://localhost:6274</code> にWeb UIが立ち上がり、プロキシは{" "}
              <code>http://localhost:6277</code> で待ち受けます。両者は既定で<code>localhost</code>
              のみにバインドされ、ネットワーク外部からのアクセスは遮断されます（開発目的で全インターフェースにバインドする場合は
              <code>HOST</code>
              環境変数で明示的に上書きしますが、信頼できるネットワーク内でのみ行うべきです）。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                10.2
              </span>
              テスト・デバッグのワークフロー
            </h3>
            <div className={styles.diagramFrame}>
              <div
                className={styles.codeBar}
                style={{ borderBottom: "none", background: "none", padding: "0 0 10px 0" }}
              >
                Fig. 10-1 — MCP Inspectorを用いた開発ループ
              </div>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.testing} />
              </div>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                10.3
              </span>
              段階的なテスト戦略
            </h3>
            <p>
              信頼性の高いMCPサーバーを構築するには、単一の手法に頼らず、以下の3層でテストを組み合わせるのが実務上の定石です。
            </p>
            <ol
              style={{
                paddingLeft: "20px",
                color: "var(--color-text-secondary, #aeb2bd)",
                margin: "0 0 16px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <b>インタラクティブテスト（MCP Inspector）：</b>
                開発中の即時フィードバックに使う。ホストアプリケーション（Claude
                Desktopなど）を介さずに、プロトコルの生の挙動を直接確認できる。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>自動化された単体・結合テスト：</b>
                SDKが提供するインメモリトランスポートを使い、CI環境でも実行できるクライアント・サーバーのペアを構築する。stdioをサブプロセスとして起動しメッセージをやり取りする方式でもよい。テストフレームワークはpytestやJest/Vitestなど通常のものを利用できる。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>本番相当環境での結合テスト：</b>
                Inspector上で動いてもホストアプリ経由の実運用で失敗するケースの大半は、トランスポートや認証まわりに起因します。ロードバランサーやプロキシを経由する本番同等の経路まで含めて検証することが重要です。
              </li>
            </ol>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                10.4
              </span>
              よくある不具合と原因の切り分け
            </h3>
            <div className={styles.tableWrap}>
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
                    <td>Inspectorに接続できない</td>
                    <td>ポート競合（6274/6277）、コマンドパスの誤り、ファイアウォール</td>
                    <td>ポート使用状況を確認し、コマンドパスを再検証する</td>
                  </tr>
                  <tr>
                    <td>JSONパースエラー（Unexpected token）</td>
                    <td>stdoutに非JSON-RPCの出力（console.logなど）が混入</td>
                    <td>すべてのログ出力をstderrへリダイレクトする</td>
                  </tr>
                  <tr>
                    <td>ツールが見つからない/一覧に出ない</td>
                    <td>
                      <code>initialize</code>応答でcapabilitiesの宣言漏れ
                    </td>
                    <td>
                      サーバーが<code>tools</code>ケイパビリティを正しく宣言しているか確認する
                    </td>
                  </tr>
                  <tr>
                    <td>Inspectorでは動くが実エージェントで失敗する</td>
                    <td>トランスポートや認証の設定差異</td>
                    <td>本番と同じトランスポート経路でエンドツーエンドの検証を行う</td>
                  </tr>
                  <tr>
                    <td>環境変数起因の設定不備</td>
                    <td>APIキー等がサーバープロセスに渡っていない</td>
                    <td>Inspectorの環境変数パネルで渡された値を確認する</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <details className={styles.refs}>
              <summary>参考資料（7件）</summary>
              <ul>
                <li>
                  MCP Inspector（MCP公式ドキュメント）:{" "}
                  <a
                    href="https://modelcontextprotocol.io/docs/tools/inspector"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    modelcontextprotocol.io/docs/tools/inspector
                  </a>
                </li>
                <li>
                  GitHub - modelcontextprotocol/inspector:{" "}
                  <a
                    href="https://github.com/modelcontextprotocol/inspector"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/modelcontextprotocol/inspector
                  </a>
                </li>
                <li>
                  MCP Inspector – Testing and Debugging for MCP Servers — Stainless:{" "}
                  <a
                    href="https://www.stainless.com/mcp/mcp-inspector-testing-and-debugging-mcp-servers/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    stainless.com/mcp/mcp-inspector-testing-and-debugging-mcp-servers
                  </a>
                </li>
                <li>
                  Error Handling And Debugging MCP Servers — Stainless:{" "}
                  <a
                    href="https://www.stainless.com/mcp/error-handling-and-debugging-mcp-servers/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    stainless.com/mcp/error-handling-and-debugging-mcp-servers
                  </a>
                </li>
                <li>
                  Testing & Debugging MCP Servers (Inspector Tools Guide) — MCP Server Spot:{" "}
                  <a
                    href="https://www.mcpserverspot.com/learn/building/testing-debugging-mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mcpserverspot.com/learn/building/testing-debugging-mcp
                  </a>
                </li>
                <li>
                  Debugging | MCP Framework:{" "}
                  <a
                    href="https://www.mcp-framework.com/docs/debugging"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mcp-framework.com/docs/debugging
                  </a>
                </li>
                <li>
                  Debugging Model Context Protocol (MCP) Servers: Tips and Best Practices —
                  mcpevals.io:{" "}
                  <a
                    href="https://www.mcpevals.io/blog/debugging-mcp-servers-tips-and-best-practices"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mcpevals.io/blog/debugging-mcp-servers-tips-and-best-practices
                  </a>
                </li>
              </ul>
            </details>
          </section>

          {/* ================= SECTION 11 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec11">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                11
              </span>
              <h2>エンタープライズアーキテクチャ：MCP Gatewayパターン</h2>
            </div>

            <p>
              組織内で接続するAIエージェントとMCPサーバーの数がそれぞれ数個から数十・数百に増えると、「すべてのエージェントがすべてのサーバーに直接接続する」N×Mのメッシュ構造は、認証の重複、監査ログの分散、ポリシー適用の不統一といった運用上の破綻を招きます。これを解決するのが
              <b>MCP Gateway</b>です。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                11.1
              </span>
              Gatewayの役割
            </h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>機能</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>認証・認可</b>
                    </td>
                    <td>どのエージェント/ユーザーがどのMCPサーバーにアクセスできるかを一元管理</td>
                  </tr>
                  <tr>
                    <td>
                      <b>ルーティング</b>
                    </td>
                    <td>リクエストを適切なMCPサーバーへ振り分ける</td>
                  </tr>
                  <tr>
                    <td>
                      <b>ポリシー適用</b>
                    </td>
                    <td>危険な操作をツール到達前にブロックする</td>
                  </tr>
                  <tr>
                    <td>
                      <b>レート制限</b>
                    </td>
                    <td>サーバーごと・エージェントごとの呼び出し頻度を制御</td>
                  </tr>
                  <tr>
                    <td>
                      <b>可観測性</b>
                    </td>
                    <td>
                      すべてのツール呼び出しをフルコンテキスト付きでログ記録し、デバッグとコンプライアンス監査を支援
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>プロトコル変換</b>
                    </td>
                    <td>必要に応じてMCPと非MCP APIをブリッジする</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              「N×Mのメッシュ」を「1対Nのハブ&amp;スポーク」構造に変換することで、ガバナンスをスケーラブルにするのがGatewayパターンの本質です。
            </p>

            <div className={styles.diagramFrame}>
              <div
                className={styles.codeBar}
                style={{ borderBottom: "none", background: "none", padding: "0 0 10px 0" }}
              >
                Fig. 11-1 — MCP Gateway アーキテクチャ
              </div>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.gateway} />
              </div>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                11.2
              </span>
              ID伝播（Identity Propagation）の設計選択
            </h3>
            <p>
              エージェントがGatewayに認証された後、その「身元」を下流のMCPサーバーへどう伝えるかには複数の方式があります。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>方式</th>
                    <th>内容</th>
                    <th>適したケース</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>トークン転送</b>
                    </td>
                    <td>エージェントの元トークンをそのまま下流サーバーへ渡す</td>
                    <td>サーバー側が同一の認可サーバーを信頼している場合</td>
                  </tr>
                  <tr>
                    <td>
                      <b>トークン交換</b>
                    </td>
                    <td>
                      Gatewayがエージェントのトークンを、サーバー固有の権限に絞ったトークンへ交換する
                    </td>
                    <td>最小権限の原則を厳密に守りたい場合（推奨）</td>
                  </tr>
                  <tr>
                    <td>
                      <b>なりすまし</b>
                    </td>
                    <td>
                      Gatewayがサービスアカウントを使いつつ、エージェントの身元をログに記録する
                    </td>
                    <td>サーバー側がエージェント単位の認証をサポートしない場合</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              className={styles.notice}
              style={{
                borderLeftColor: "var(--color-text-info, #7bb8ea)",
                background: "rgba(123, 184, 234, 0.08)",
              }}
            >
              <i
                className="ti ti-info-circle"
                style={{ color: "var(--color-text-info, #7bb8ea)" }}
              />
              <div>
                セキュリティの観点からは、クライアントのトークンをそのまま下流へ転送する「Token
                Passthrough」は前章で触れた脅威の一つでもあるため、可能な限り<b>トークン交換方式</b>
                を選ぶことが望ましいとされています。
              </div>
            </div>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                11.3
              </span>
              可観測性・監査ログの設計
            </h3>
            <p>
              Gatewayは「AIエージェントが何をしているか」を可視化する絶好のポイントでもあります。最低限、以下の情報を不変な監査ログとして記録することが推奨されます。
            </p>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "20px",
                color: "var(--color-text-secondary, #aeb2bd)",
                margin: "0 0 16px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>どのエージェント（身元）が</li>
              <li style={{ marginBottom: "8px" }}>どのツールを</li>
              <li style={{ marginBottom: "8px" }}>どのパラメータで呼び出し</li>
              <li style={{ marginBottom: "8px" }}>
                いつ、どのような結果（成功/失敗、レイテンシ）になったか
              </li>
            </ul>
            <p>
              これらのログはPrometheus/Grafana、あるいはDatadog等の既存の可観測性基盤に統合し、ダッシュボードとアラートを構築します。ゲートウェイ自体のレイテンシ（p95/p99）も継続的に監視し、認証・ポリシー評価のオーバーヘッドが許容範囲内であることを確認します（健全なゲートウェイであれば、キャッシュヒット時のオーバーヘッドは数ミリ秒程度に収まるのが一般的です）。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                11.4
              </span>
              導入判断の指針
            </h3>
            <ol
              style={{
                paddingLeft: "20px",
                color: "var(--color-text-secondary, #aeb2bd)",
                margin: "0 0 16px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <b>アクセス制御の粒度：</b>
                サーバー単位だけでなく、ツール単位・パラメータ単位でのポリシー適用ができるか
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>監査証跡の完全性：</b>改ざん不能な監査ログがあるか、コンプライアンス要件（SOC
                2等）を満たせるか
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>エコシステム統合：</b>
                既存のIdP、既存の可観測性基盤（OpenTelemetry対応等）とスムーズに連携できるか
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>オープンソース vs マネージドサービス：</b>
                完全なデータ主権を求めるなら自己ホスト型（例: IBM ContextForge, Docker MCP
                Gateway）、迅速な導入を求めるならマネージドSaaS（例: MintMCP, WorkOS）を検討する
              </li>
            </ol>

            <details className={styles.refs}>
              <summary>参考資料（10件）</summary>
              <ul>
                <li>
                  MCP Gateway: What It Is, Top Options — OpenObserve:{" "}
                  <a
                    href="https://openobserve.ai/blog/mcp-gateway-guide/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    openobserve.ai/blog/mcp-gateway-guide
                  </a>
                </li>
                <li>
                  7 top MCP gateways for enterprise AI infrastructure – 2026 — MintMCP:{" "}
                  <a
                    href="https://www.mintmcp.com/blog/enterprise-ai-infrastructure-mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mintmcp.com/blog/enterprise-ai-infrastructure-mcp
                  </a>
                </li>
                <li>
                  12 Best MCP Gateways for Engineering Teams (2026) — MCP Manager:{" "}
                  <a
                    href="https://mcpmanager.ai/blog/best-mcp-gateway-for-engineering/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mcpmanager.ai/blog/best-mcp-gateway-for-engineering
                  </a>
                </li>
                <li>
                  10 Best MCP Gateways In 2026 — TrueFoundry:{" "}
                  <a
                    href="https://www.truefoundry.com/blog/best-mcp-gateways"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    truefoundry.com/blog/best-mcp-gateways
                  </a>
                </li>
                <li>
                  Best MCP Gateways and AI Agent Security Tools (2026) — Integrate.io:{" "}
                  <a
                    href="https://www.integrate.io/blog/best-mcp-gateways-and-ai-agent-security-tools/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    integrate.io/blog/best-mcp-gateways-and-ai-agent-security-tools
                  </a>
                </li>
                <li>
                  10 Best MCP Gateways for Developers in 2026 — Composio:{" "}
                  <a
                    href="https://composio.dev/content/best-mcp-gateway-for-developers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    composio.dev/content/best-mcp-gateway-for-developers
                  </a>
                </li>
                <li>
                  Best Open Source MCP Gateways 2026 — Lunar.dev:{" "}
                  <a
                    href="https://www.lunar.dev/post/the-best-open-source-mcp-gateways-in-2026"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    lunar.dev/post/the-best-open-source-mcp-gateways-in-2026
                  </a>
                </li>
                <li>
                  What Is an MCP Gateway? Why Every Enterprise AI Deployment Needs One:{" "}
                  <a
                    href="https://silentinfotech.com/blog/ai-9/mcp-gateway-every-enterprise-ai-deployment-needs-536"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    silentinfotech.com/blog/ai-9/mcp-gateway-every-enterprise-ai-deployment-needs
                  </a>
                </li>
                <li>
                  MCP Gateway: The Control Plane for Enterprise AI Agents — Tyk:{" "}
                  <a
                    href="https://tyk.io/learning-center/mcp-gateway-architecture-technical-guide/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    tyk.io/learning-center/mcp-gateway-architecture-technical-guide
                  </a>
                </li>
                <li>
                  Best MCP Gateways for SOC 2 Compliant Organizations 2026 — MintMCP:{" "}
                  <a
                    href="https://www.mintmcp.com/blog/mcp-gateways-soc2-compliant-organizations"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mintmcp.com/blog/mcp-gateways-soc2-compliant-organizations
                  </a>
                </li>
              </ul>
            </details>
          </section>

          {/* ================= SECTION 12 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec12">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                12
              </span>
              <h2>2026年ロードマップと今後の展望</h2>
            </div>

            <p>
              MCPの開発体制は、少人数のコアメンテナーによるリリース単位の運営から、
              <b>Working Group主導・優先領域ベースの運営</b>
              へと移行しています。2026年のロードマップは、リリース日程ではなく「優先領域」を軸に構成されている点が過去との大きな違いです。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                12.1
              </span>
              2026年の優先領域
            </h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>優先領域</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>トランスポートのスケーラビリティ</b>
                    </td>
                    <td>ステートレス化により、水平スケール可能なStreamable HTTP基盤を確立する</td>
                  </tr>
                  <tr>
                    <td>
                      <b>エージェント間通信</b>
                    </td>
                    <td>
                      Multi Round-Trip
                      Requests（MRTR）など、サーバーからクライアントへの新しい相互作用パターンを整備する
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>ガバナンスの成熟</b>
                    </td>
                    <td>
                      Feature Lifecycle Policy、Extensions Track、Conformance
                      Suiteなど、破壊的変更を安全に導入する仕組みを整備する
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>エンタープライズ対応</b>
                    </td>
                    <td>監査証跡、SSO統合認証、Gatewayの標準的な振る舞い、設定の可搬性</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Anthropicはエンタープライズ対応の多くを
              <b>コア仕様ではなく拡張（Extension）として提供する</b>
              方針を明言しており、「基本プロトコルを万人向けに軽量に保ちつつ、企業固有のニーズは
              opt-in の拡張で満たす」という設計思想が貫かれています。
            </p>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                12.2
              </span>
              ガバナンスの変更点
            </h3>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "20px",
                color: "var(--color-text-secondary, #aeb2bd)",
                margin: "0 0 16px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <b>Feature Lifecycle Policy：</b>すべての機能に Active → Deprecated → Removed
                の3段階のライフサイクルが定義され、廃止（Deprecated）から削除（Removed）までに最低12か月の猶予期間が設けられます。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>Extensions Framework：</b>新機能は逆引きDNS形式のID
                を持つ拡張として、コア仕様とは独立したリポジトリ・独立したバージョニングでリリースされます。実験的機能から公式ステータスへ進むための「Extensions
                Track」が新設されました。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>Conformance Suite：</b>Standard Track
                SEPは、対応するシナリオが適合性スイートに実装されるまでFinalステータスに到達できなくなり、SDK
                Tierシステムとも連動します。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>SEPレビューの委任モデル：</b>
                これまで全てのSEPがコアメンテナーの全面レビューを必要としていたボトルネックを解消するため、信頼されたWorking
                Groupが自領域のSEPを承認できる委任モデルの導入が計画されています。
              </li>
            </ul>

            <h3>
              <span
                className={styles.h3Num}
                style={{
                  color: "var(--color-text-info, #7bb8ea)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                12.3
              </span>
              実務者が今取るべきアクション
            </h3>
            <ol
              style={{
                paddingLeft: "20px",
                color: "var(--color-text-secondary, #aeb2bd)",
                margin: "0 0 16px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <b>ステートレス化を見越したサーバー設計にしておく：</b>
                セッションIDに依存したステートフルな実装は、今後アプリケーションレベルでの明示的なハンドル管理（
                <code>basket_id</code>等）へ置き換えていく方針を検討する。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>MCP Apps拡張の動向を注視する：</b>サーバーがインタラクティブなHTML
                UIをサンドボックス化されたiframe内で提供できるようになるため、UIを伴うツール体験を計画している場合は仕様策定を追う。
              </li>
              <li style={{ marginBottom: "8px" }}>
                <b>Deprecatedタグが付いた機能は計画的に移行する：</b>
                最低12か月の猶予があるとはいえ、削除が確定してから移行に着手するのではなく、Deprecated化された時点で移行計画を立てる。
              </li>
            </ol>

            <details className={styles.refs}>
              <summary>参考資料（4件）</summary>
              <ul>
                <li>
                  The 2026 MCP Roadmap（MCP公式ブログ）:{" "}
                  <a
                    href="https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    blog.modelcontextprotocol.io/posts/2026-mcp-roadmap
                  </a>
                </li>
                <li>
                  The 2026-07-28 MCP Specification Release Candidate:{" "}
                  <a
                    href="https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate
                  </a>
                </li>
                <li>
                  Model Context Protocol Blog:{" "}
                  <a
                    href="https://blog.modelcontextprotocol.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    blog.modelcontextprotocol.io
                  </a>
                </li>
                <li>
                  Model Context Protocol - Wikipedia（ガバナンス・普及動向）:{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Model_Context_Protocol"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    en.wikipedia.org/wiki/Model_Context_Protocol
                  </a>
                </li>
              </ul>
            </details>
          </section>

          {/* ================= SECTION 13 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec13">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                13
              </span>
              <h2>ベストプラクティス総括チェックリスト</h2>
            </div>

            <p>本ガイドで扱った内容を、実装フェーズ別に整理した最終チェックリストです。</p>

            <h3>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10.5px",
                  background: "rgba(79,184,234,0.12)",
                  border: "1px solid rgba(79,184,234,0.3)",
                  color: "#7bb8ea",
                  padding: "2px 10px",
                  borderRadius: "5px",
                  marginRight: "10px",
                  verticalAlign: "middle",
                  fontWeight: 500,
                }}
              >
                設計
              </span>
            </h3>
            <ul style={{ listStyleType: "none", paddingLeft: "0px", margin: "20px 0" }}>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>Host/Client/Serverの責務が明確に分離されているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>プロトコルバージョンの互換性マトリクスを文書化しているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>
                  トランスポート（stdio / Streamable HTTP）を用途に応じて正しく選定しているか
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>Tools/Resources/Promptsの境界を正しく使い分けているか</span>
              </li>
            </ul>

            <h3>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10.5px",
                  background: "rgba(79,184,234,0.12)",
                  border: "1px solid rgba(79,184,234,0.3)",
                  color: "#7bb8ea",
                  padding: "2px 10px",
                  borderRadius: "5px",
                  marginRight: "10px",
                  verticalAlign: "middle",
                  fontWeight: 500,
                }}
              >
                ツール実装
              </span>
            </h3>
            <ul style={{ listStyleType: "none", paddingLeft: "0px", margin: "20px 0" }}>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>ツール名にドメインの名前空間プレフィックスを付けているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>
                  <code>list_all</code>ではなく検索指向のツールを設計しているか
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>レスポンスに人間が読める文脈を含めているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>ページネーション・フィルタ・詳細度指定でトークン消費を抑えているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>エラーメッセージが次の行動を具体的に示しているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>評価セット（Evaluation）を用意し定量的に改善しているか</span>
              </li>
            </ul>

            <h3>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10.5px",
                  background: "rgba(79,184,234,0.12)",
                  border: "1px solid rgba(79,184,234,0.3)",
                  color: "#7bb8ea",
                  padding: "2px 10px",
                  borderRadius: "5px",
                  marginRight: "10px",
                  verticalAlign: "middle",
                  fontWeight: 500,
                }}
              >
                スケーラビリティ
              </span>
            </h3>
            <ul style={{ listStyleType: "none", paddingLeft: "0px", margin: "20px 0" }}>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>接続するMCPサーバー数を必要最小限に絞っているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>Tool Search / Code Executionなど遅延ロードの仕組みを活用しているか</span>
              </li>
            </ul>

            <h3>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10.5px",
                  background: "rgba(79,184,234,0.12)",
                  border: "1px solid rgba(79,184,234,0.3)",
                  color: "#7bb8ea",
                  padding: "2px 10px",
                  borderRadius: "5px",
                  marginRight: "10px",
                  verticalAlign: "middle",
                  fontWeight: 500,
                }}
              >
                認証・認可
              </span>
            </h3>
            <ul style={{ listStyleType: "none", paddingLeft: "0px", margin: "20px 0" }}>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>MCPサーバーをリソースサーバーとして、認可サーバーと責務分離しているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>PKCE、Resource Indicators、短命トークンを実装しているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>トークン検証ロジックを自作せず、検証済みライブラリを使っているか</span>
              </li>
            </ul>

            <h3>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10.5px",
                  background: "rgba(79,184,234,0.12)",
                  border: "1px solid rgba(79,184,234,0.3)",
                  color: "#7bb8ea",
                  padding: "2px 10px",
                  borderRadius: "5px",
                  marginRight: "10px",
                  verticalAlign: "middle",
                  fontWeight: 500,
                }}
              >
                セキュリティ
              </span>
            </h3>
            <ul style={{ listStyleType: "none", paddingLeft: "0px", margin: "20px 0" }}>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>接続可能なMCPサーバーの許可リストを運用しているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>ツール定義の変更（Rug Pull）を検知する仕組みがあるか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>破壊的操作の前にLLMコンテキスト外での人間承認を挟んでいるか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>SSRF・コマンドインジェクション対策を実装しているか</span>
              </li>
            </ul>

            <h3>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10.5px",
                  background: "rgba(79,184,234,0.12)",
                  border: "1px solid rgba(79,184,234,0.3)",
                  color: "#7bb8ea",
                  padding: "2px 10px",
                  borderRadius: "5px",
                  marginRight: "10px",
                  verticalAlign: "middle",
                  fontWeight: 500,
                }}
              >
                テスト
              </span>
            </h3>
            <ul style={{ listStyleType: "none", paddingLeft: "0px", margin: "20px 0" }}>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>MCP Inspectorによるインタラクティブテストを開発フローに組み込んでいるか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>インメモリトランスポート等による自動テストをCIに統合しているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>stdoutにJSON-RPC以外を出力していないか（ログはstderrのみか）</span>
              </li>
            </ul>

            <h3>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10.5px",
                  background: "rgba(79,184,234,0.12)",
                  border: "1px solid rgba(79,184,234,0.3)",
                  color: "#7bb8ea",
                  padding: "2px 10px",
                  borderRadius: "5px",
                  marginRight: "10px",
                  verticalAlign: "middle",
                  fontWeight: 500,
                }}
              >
                運用
              </span>
            </h3>
            <ul style={{ listStyleType: "none", paddingLeft: "0px", margin: "20px 0" }}>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>すべてのツール呼び出しを監査ログとして記録しているか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>本番規模での接続にはGatewayパターンの採用を検討したか</span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-primary, #2c313c)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "3px",
                    border: "1.5px solid var(--color-border-primary, #2c313c)",
                    borderRadius: "4px",
                  }}
                ></span>
                <span>プロトコルの非推奨機能・Deprecatedタグを継続的に監視しているか</span>
              </li>
            </ul>
          </section>

          {/* ================= SECTION 14 ================= */}
          <section className={`${styles.chapter} chapter`} id="sec14">
            <div className={styles.chapterTitle}>
              <span
                className={styles.chapterNumber}
                style={{
                  border: "1px solid rgba(79, 216, 196, 0.35)",
                  background: "rgba(79, 216, 196, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  marginRight: "12px",
                }}
              >
                14
              </span>
              <h2>参考文献一覧（全URL）</h2>
            </div>

            <p>
              本ガイド作成にあたり参照した情報源を、カテゴリ別に一覧化します（2026年7月時点でのアクセス確認済み）。
            </p>

            <div className={styles.refBlock}>
              <h3>公式仕様・公式ブログ</h3>
              <ul>
                <li>
                  <a
                    href="https://modelcontextprotocol.io/specification/2025-11-25"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Specification (2025-11-25)
                    </div>
                    <span className={styles.refUrl}>
                      modelcontextprotocol.io/specification/2025-11-25
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://modelcontextprotocol.io/specification/2025-03-26/basic/transports"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Specification - Transports (2025-03-26)
                    </div>
                    <span className={styles.refUrl}>
                      modelcontextprotocol.io/specification/2025-03-26/basic/transports
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://modelcontextprotocol.io/docs/tutorials/security/authorization"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Understanding Authorization in MCP
                    </div>
                    <span className={styles.refUrl}>
                      modelcontextprotocol.io/docs/tutorials/security/authorization
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://modelcontextprotocol.io/docs/tools/inspector"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Inspector（公式ドキュメント）
                    </div>
                    <span className={styles.refUrl}>
                      modelcontextprotocol.io/docs/tools/inspector
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/modelcontextprotocol/modelcontextprotocol"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> GitHub -
                      modelcontextprotocol/modelcontextprotocol
                    </div>
                    <span className={styles.refUrl}>
                      github.com/modelcontextprotocol/modelcontextprotocol
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> GitHub Releases
                    </div>
                    <span className={styles.refUrl}>
                      github.com/modelcontextprotocol/modelcontextprotocol/releases
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/modelcontextprotocol/inspector"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> GitHub - modelcontextprotocol/inspector
                    </div>
                    <span className={styles.refUrl}>github.com/modelcontextprotocol/inspector</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> The 2026 MCP Roadmap
                    </div>
                    <span className={styles.refUrl}>
                      blog.modelcontextprotocol.io/posts/2026-mcp-roadmap
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> The 2026-07-28 MCP Specification Release
                      Candidate
                    </div>
                    <span className={styles.refUrl}>
                      blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://blog.modelcontextprotocol.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Model Context Protocol Blog
                    </div>
                    <span className={styles.refUrl}>blog.modelcontextprotocol.io</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://modelcontextprotocol.info/specification/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Specification – Model Context Protocol（MCP
                      Info）
                    </div>
                    <span className={styles.refUrl}>modelcontextprotocol.info/specification</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.anthropic.com/engineering/writing-tools-for-agents"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Writing effective tools for AI agents—using AI
                      agents（Anthropic）
                    </div>
                    <span className={styles.refUrl}>
                      anthropic.com/engineering/writing-tools-for-agents
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.anthropic.com/engineering/code-execution-with-mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Code execution with MCP: building more efficient
                      AI agents（Anthropic）
                    </div>
                    <span className={styles.refUrl}>
                      anthropic.com/engineering/code-execution-with-mcp
                    </span>
                  </a>
                </li>
              </ul>

              <h3>概要・アーキテクチャ解説</h3>
              <ul>
                <li>
                  <a
                    href="https://en.wikipedia.org/wiki/Model_Context_Protocol"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Model Context Protocol - Wikipedia
                    </div>
                    <span className={styles.refUrl}>
                      en.wikipedia.org/wiki/Model_Context_Protocol
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webfuse.com/mcp-cheat-sheet"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Cheat Sheet (2026) — Webfuse
                    </div>
                    <span className={styles.refUrl}>webfuse.com/mcp-cheat-sheet</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://devstarsj.github.io/2026/03/18/model-context-protocol-mcp-complete-guide-2026/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Model Context Protocol (MCP): The Standard
                      That&apos;s Changing AI Integration in 2026
                    </div>
                    <span className={styles.refUrl}>
                      devstarsj.github.io/.../mcp-complete-guide-2026
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://codilime.com/blog/model-context-protocol-explained/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Model Context Protocol (MCP) explained — CodiLime
                    </div>
                    <span className={styles.refUrl}>
                      codilime.com/blog/model-context-protocol-explained
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://arxiv.org/pdf/2606.24937"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> The Hitchhiker&apos;s Guide to Agentic AI
                    </div>
                    <span className={styles.refUrl}>arxiv.org/pdf/2606.24937</span>
                  </a>
                </li>
              </ul>

              <h3>トランスポート</h3>
              <ul>
                <li>
                  <a
                    href="https://docs.roocode.com/features/mcp/server-transports"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Server Transports — Roo Code
                    </div>
                    <span className={styles.refUrl}>
                      docs.roocode.com/features/mcp/server-transports
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.truefoundry.com/blog/mcp-stdio-vs-streamable-http-enterprise"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Transport: Stdio vs Streamable HTTP —
                      TrueFoundry
                    </div>
                    <span className={styles.refUrl}>
                      truefoundry.com/blog/mcp-stdio-vs-streamable-http-enterprise
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://mcpcat.io/guides/comparing-stdio-sse-streamablehttp/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Transport Protocols: stdio vs SSE vs
                      StreamableHTTP — MCPcat
                    </div>
                    <span className={styles.refUrl}>
                      mcpcat.io/guides/comparing-stdio-sse-streamablehttp
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://startdebugging.net/2026/07/mcp-stdio-vs-http-vs-sse-transport-which-to-choose/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP stdio vs HTTP vs SSE Transport: Which Should
                      You Choose in 2026? — Start Debugging
                    </div>
                    <span className={styles.refUrl}>
                      startdebugging.net/.../mcp-stdio-vs-http-vs-sse-transport-which-to-choose
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://chatforest.com/guides/mcp-transports-explained/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Transports Explained — ChatForest
                    </div>
                    <span className={styles.refUrl}>
                      chatforest.com/guides/mcp-transports-explained
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://apigene.ai/blog/mcp-sse-vs-stdio"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP SSE vs Stdio: Transport Options Explained
                      (2026) — Apigene
                    </div>
                    <span className={styles.refUrl}>apigene.ai/blog/mcp-sse-vs-stdio</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.rapidevelopers.com/mcp-tutorial/mcp-transport-stdio-vs-sse-vs-http"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Transports: stdio vs SSE vs HTTP — RapidDev
                    </div>
                    <span className={styles.refUrl}>
                      rapidevelopers.com/mcp-tutorial/mcp-transport-stdio-vs-sse-vs-http
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://builder.aws.com/content/35A0IphCeLvYzly9Sw40G1dVNzc/mcp-transport-mechanisms-stdio-vs-streamable-http"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Transport Mechanisms: STDIO vs Streamable
                      HTTP — AWS Builder Center
                    </div>
                    <span className={styles.refUrl}>
                      builder.aws.com/.../mcp-transport-mechanisms
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://rollbrains.com/mcp/mcp-transports-compared/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Transports Compared: stdio vs SSE vs
                      Streamable HTTP (2026) — rollbrains
                    </div>
                    <span className={styles.refUrl}>
                      rollbrains.com/mcp/mcp-transports-compared
                    </span>
                  </a>
                </li>
              </ul>

              <h3>プリミティブ（Tools/Resources/Prompts/Sampling/Elicitation/Roots）</h3>
              <ul>
                <li>
                  <a
                    href="https://workos.com/blog/mcp-features-guide"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Understanding MCP features — WorkOS
                    </div>
                    <span className={styles.refUrl}>workos.com/blog/mcp-features-guide</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://stacktr.ee/blog/what-is-mcp-elicitation"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> What is MCP elicitation and sampling? — Stacktree
                    </div>
                    <span className={styles.refUrl}>stacktr.ee/blog/what-is-mcp-elicitation</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://medium.com/@__nagarajan__/mcp-concepts-sampling-and-elicitation-95c5c0c4df71"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Concepts: Sampling and Elicitation — Medium
                    </div>
                    <span className={styles.refUrl}>
                      medium.com/@__nagarajan__/mcp-concepts-sampling-and-elicitation
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://memgraph.com/blog/memgraph-mcp-elicitation-and-sampling"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Memgraph MCP Experimental Server: Elicitation and
                      Sampling Explained
                    </div>
                    <span className={styles.refUrl}>
                      memgraph.com/blog/memgraph-mcp-elicitation-and-sampling
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://medium.com/@puneetsharma41/mcp-client-concepts-how-elicitation-sampling-and-roots-make-ai-agents-responsible-5f02a0666d9a"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Client Concepts: How Elicitation, Sampling,
                      and Roots Make AI Agents Responsible
                    </div>
                    <span className={styles.refUrl}>
                      medium.com/@puneetsharma41/mcp-client-concepts
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.analytical-software.de/en/the-model-context-protocol-mcp-deep-dive-into-structure-and-concepts/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> The Model Context Protocol (MCP): Deep dive into
                      structure and concepts — HMS
                    </div>
                    <span className={styles.refUrl}>
                      analytical-software.de/.../mcp-deep-dive-into-structure-and-concepts
                    </span>
                  </a>
                </li>
              </ul>

              <h3>ツール設計ベストプラクティス</h3>
              <ul>
                <li>
                  <a
                    href="https://laxmikumars.medium.com/writing-effective-tools-for-ai-agents-lessons-from-anthropic-25b85bf74f5d"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Writing Effective Tools for AI Agents: Lessons
                      from Anthropic — Medium
                    </div>
                    <span className={styles.refUrl}>
                      laxmikumars.medium.com/.../lessons-from-anthropic
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://techwithibrahim.medium.com/writing-effective-tools-for-ai-agents-production-lessons-from-anthropic-99ea76a7fcf0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Writing Effective Tools for AI Agents: Production
                      Lessons from Anthropic — Medium
                    </div>
                    <span className={styles.refUrl}>
                      techwithibrahim.medium.com/.../production-lessons
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/vishnu2kmohan/mcp-server-langgraph/blob/main/adr/adr-0023-anthropic-tool-design-best-practices.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> ADR-0023: Anthropic Tool Design Best Practices
                    </div>
                    <span className={styles.refUrl}>
                      github.com/vishnu2kmohan/mcp-server-langgraph/.../adr-0023
                    </span>
                  </a>
                </li>
              </ul>

              <h3>コンテキスト管理・スケーラビリティ</h3>
              <ul>
                <li>
                  <a
                    href="https://writer.com/engineering/rag-mcp/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> When too many tools become too much context —
                      WRITER
                    </div>
                    <span className={styles.refUrl}>writer.com/engineering/rag-mcp</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lunar.dev/post/why-is-there-mcp-tool-overload-and-how-to-solve-it-for-your-ai-agents"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> How to Prevent MCP Tool Overload and Build
                      Faster, Safer AI Agents — Lunar.dev
                    </div>
                    <span className={styles.refUrl}>
                      lunar.dev/post/why-is-there-mcp-tool-overload
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://agentmarketcap.ai/blog/2026/04/08/mcp-context-bloat-enterprise-scale-tool-definitions-agent-context-budget"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP&apos;s Context Bloat Crisis — AgentMarketCap
                    </div>
                    <span className={styles.refUrl}>
                      agentmarketcap.ai/blog/2026/04/08/mcp-context-bloat
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://mcp.directory/blog/mcp-context-bloat-fix-2026-tool-search-code-mode-progressive-disclosure"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Context Bloat Fix 2026 (Tool Search) —
                      MCP.Directory
                    </div>
                    <span className={styles.refUrl}>
                      mcp.directory/blog/mcp-context-bloat-fix-2026
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://startdebugging.net/2026/05/how-to-reduce-the-number-of-mcp-tools-claude-loads/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> How to Reduce the Number of MCP Tools Claude
                      Loads — Start Debugging
                    </div>
                    <span className={styles.refUrl}>
                      startdebugging.net/2026/05/how-to-reduce-the-number-of-mcp-tools-claude-loads
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://thenewstack.io/how-to-reduce-mcp-token-bloat/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> 10 strategies to reduce MCP token bloat — The New
                      Stack
                    </div>
                    <span className={styles.refUrl}>
                      thenewstack.io/how-to-reduce-mcp-token-bloat
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://apigene.ai/blog/mcp-tools"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Tools: What They Are and How to Build Them
                      Right (2026) — Apigene
                    </div>
                    <span className={styles.refUrl}>apigene.ai/blog/mcp-tools</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.agentpmt.com/articles/thousands-of-mcp-tools-zero-context-left-the-bloat-tax-breaking-ai-agents"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Thousands of MCP Tools, Zero Context Left —
                      AgentPMT
                    </div>
                    <span className={styles.refUrl}>
                      agentpmt.com/articles/thousands-of-mcp-tools-zero-context-left
                    </span>
                  </a>
                </li>
              </ul>

              <h3>認証・認可（OAuth 2.1）</h3>
              <ul>
                <li>
                  <a
                    href="https://www.redhat.com/en/blog/mcp-security-implementing-robust-authentication-and-authorization"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP security: Implementing robust authentication
                      and authorization — Red Hat
                    </div>
                    <span className={styles.refUrl}>
                      redhat.com/en/blog/mcp-security-implementing-robust-authentication-and-authorization
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://medium.com/data-science-collective/why-your-mcp-server-is-a-security-disaster-waiting-to-happen-660577d8077c"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Server Security: Auth Best Practices 2026 —
                      Medium
                    </div>
                    <span className={styles.refUrl}>
                      medium.com/data-science-collective/why-your-mcp-server-is-a-security-disaster
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://baeseokjae.github.io/posts/mcp-oauth-authentication-guide-2026/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP OAuth 2.1 Authentication: Complete Developer
                      Guide 2026 — RockB
                    </div>
                    <span className={styles.refUrl}>
                      baeseokjae.github.io/posts/mcp-oauth-authentication-guide-2026
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://obot.ai/resources/learning-center/mcp-authentication/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> How MCP Authentication Works: Authorization,
                      OAuth & Security — Obot
                    </div>
                    <span className={styles.refUrl}>
                      obot.ai/resources/learning-center/mcp-authentication
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://codersera.com/blog/how-to-secure-mcp-servers-2026/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> How to Secure MCP Servers (2026 Guide)
                    </div>
                    <span className={styles.refUrl}>
                      codersera.com/blog/how-to-secure-mcp-servers-2026
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://dasroot.net/posts/2026/04/mcp-authorization-specification-oauth-2-1-resource-indicators/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> The New MCP Authorization Specification
                    </div>
                    <span className={styles.refUrl}>
                      dasroot.net/posts/2026/04/mcp-authorization-specification
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.descope.com/blog/post/mcp-server-security-best-practices"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Server Security Best Practices to Prevent
                      Risk — Descope
                    </div>
                    <span className={styles.refUrl}>
                      descope.com/blog/post/mcp-server-security-best-practices
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://nhimg.org/articles/mcp-server-authentication-in-2026-what-practitioners-need-to-know/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP server authentication in 2026: what
                      practitioners need to know
                    </div>
                    <span className={styles.refUrl}>
                      nhimg.org/articles/mcp-server-authentication-in-2026
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://workos.com/blog/best-mcp-server-authentication-providers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> The best providers for MCP server authentication
                      in 2026 — WorkOS
                    </div>
                    <span className={styles.refUrl}>
                      workos.com/blog/best-mcp-server-authentication-providers
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://auth0.com/ai/docs/mcp/guides/test-your-mcp-server-with-mcp-inspector"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Test MCP Server with MCP Inspector — Auth for MCP
                    </div>
                    <span className={styles.refUrl}>
                      auth0.com/ai/docs/mcp/guides/test-your-mcp-server-with-mcp-inspector
                    </span>
                  </a>
                </li>
              </ul>

              <h3>セキュリティ脅威（Tool Poisoning / Prompt Injection）</h3>
              <ul>
                <li>
                  <a
                    href="https://owasp.org/www-community/attacks/MCP_Tool_Poisoning"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Tool Poisoning — OWASP Foundation
                    </div>
                    <span className={styles.refUrl}>
                      owasp.org/www-community/attacks/MCP_Tool_Poisoning
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.practical-devsecops.com/mcp-security-vulnerabilities/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Security Vulnerabilities: How to Prevent
                      Prompt Injection and Tool Poisoning Attacks in 2026 — Practical DevSecOps
                    </div>
                    <span className={styles.refUrl}>
                      practical-devsecops.com/mcp-security-vulnerabilities
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.descope.com/learn/post/mcp-tool-poisoning"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Understanding MCP Tool Poisoning Attacks —
                      Descope
                    </div>
                    <span className={styles.refUrl}>descope.com/learn/post/mcp-tool-poisoning</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://developer.microsoft.com/blog/protecting-against-indirect-injection-attacks-mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Protecting against indirect prompt injection
                      attacks in MCP — Microsoft for Developers
                    </div>
                    <span className={styles.refUrl}>
                      developer.microsoft.com/blog/protecting-against-indirect-injection-attacks-mcp
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.aptible.com/mcp-security/mcp-prompt-injection"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Prompt injection in MCP: how tool poisoning works
                      — Aptible
                    </div>
                    <span className={styles.refUrl}>
                      aptible.com/mcp-security/mcp-prompt-injection
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://mcpmanager.ai/blog/tool-poisoning/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Tool Poisoning - How It Works & How To Fight
                      It — MCP Manager
                    </div>
                    <span className={styles.refUrl}>mcpmanager.ai/blog/tool-poisoning</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://arxiv.org/html/2603.22489v1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Model Context Protocol Threat
                      Modeling（MCPTox学術研究）
                    </div>
                    <span className={styles.refUrl}>arxiv.org/html/2603.22489v1</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.cyberark.com/resources/threat-research-blog/poison-everywhere-no-output-from-your-mcp-server-is-safe"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Poison everywhere: No output from your MCP server
                      is safe — CyberArk
                    </div>
                    <span className={styles.refUrl}>
                      cyberark.com/resources/threat-research-blog/poison-everywhere
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://securityboulevard.com/2026/01/mcp-security-how-to-prevent-prompt-injection-and-tool-poisoning-attacks/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP security: How to prevent prompt injection and
                      tool poisoning attacks — Security Boulevard
                    </div>
                    <span className={styles.refUrl}>
                      securityboulevard.com/2026/01/mcp-security
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://datadome.co/agent-trust-management/mcp-security-prompt-injection-prevention/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Security: How to Stop Prompt Injection
                      Attacks — Datadome
                    </div>
                    <span className={styles.refUrl}>
                      datadome.co/agent-trust-management/mcp-security-prompt-injection-prevention
                    </span>
                  </a>
                </li>
              </ul>

              <h3>テスト・デバッグ</h3>
              <ul>
                <li>
                  <a
                    href="https://www.stainless.com/mcp/mcp-inspector-testing-and-debugging-mcp-servers/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Inspector – Testing and Debugging for MCP
                      Servers — Stainless
                    </div>
                    <span className={styles.refUrl}>
                      stainless.com/mcp/mcp-inspector-testing-and-debugging-mcp-servers
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.stainless.com/mcp/error-handling-and-debugging-mcp-servers/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Error Handling And Debugging MCP Servers —
                      Stainless
                    </div>
                    <span className={styles.refUrl}>
                      stainless.com/mcp/error-handling-and-debugging-mcp-servers
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mcpserverspot.com/learn/building/testing-debugging-mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Testing & Debugging MCP Servers (Inspector Tools
                      Guide) — MCP Server Spot
                    </div>
                    <span className={styles.refUrl}>
                      mcpserverspot.com/learn/building/testing-debugging-mcp
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mcp-framework.com/docs/debugging"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Debugging | MCP Framework
                    </div>
                    <span className={styles.refUrl}>mcp-framework.com/docs/debugging</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mcpevals.io/blog/debugging-mcp-servers-tips-and-best-practices"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Debugging Model Context Protocol (MCP) Servers:
                      Tips and Best Practices — mcpevals.io
                    </div>
                    <span className={styles.refUrl}>
                      mcpevals.io/blog/debugging-mcp-servers-tips-and-best-practices
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://mcpcat.io/guides/setting-up-mcp-inspector-server-testing/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Inspector Setup Guide — MCPcat
                    </div>
                    <span className={styles.refUrl}>
                      mcpcat.io/guides/setting-up-mcp-inspector-server-testing
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://agenthermes.ai/blog/testing-mcp-server-guide"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> How to Test Your MCP Server: Validation,
                      Debugging, and Scoring Impact — AgentHermes
                    </div>
                    <span className={styles.refUrl}>
                      agenthermes.ai/blog/testing-mcp-server-guide
                    </span>
                  </a>
                </li>
              </ul>

              <h3>エンタープライズアーキテクチャ・Gateway</h3>
              <ul>
                <li>
                  <a
                    href="https://openobserve.ai/blog/mcp-gateway-guide/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Gateway: What It Is, Top Options —
                      OpenObserve
                    </div>
                    <span className={styles.refUrl}>openobserve.ai/blog/mcp-gateway-guide</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mintmcp.com/blog/enterprise-ai-infrastructure-mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> 7 top MCP gateways for enterprise AI
                      infrastructure – 2026 — MintMCP
                    </div>
                    <span className={styles.refUrl}>
                      mintmcp.com/blog/enterprise-ai-infrastructure-mcp
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://mcpmanager.ai/blog/best-mcp-gateway-for-engineering/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> 12 Best MCP Gateways for Engineering Teams (2026)
                      — MCP Manager
                    </div>
                    <span className={styles.refUrl}>
                      mcpmanager.ai/blog/best-mcp-gateway-for-engineering
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.truefoundry.com/blog/best-mcp-gateways"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> 10 Best MCP Gateways In 2026 — TrueFoundry
                    </div>
                    <span className={styles.refUrl}>truefoundry.com/blog/best-mcp-gateways</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.integrate.io/blog/best-mcp-gateways-and-ai-agent-security-tools/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Best MCP Gateways and AI Agent Security Tools
                      (2026) — Integrate.io
                    </div>
                    <span className={styles.refUrl}>
                      integrate.io/blog/best-mcp-gateways-and-ai-agent-security-tools
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://composio.dev/content/best-mcp-gateway-for-developers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> 10 Best MCP Gateways for Developers in 2026 —
                      Composio
                    </div>
                    <span className={styles.refUrl}>
                      composio.dev/content/best-mcp-gateway-for-developers
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lunar.dev/post/the-best-open-source-mcp-gateways-in-2026"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Best Open Source MCP Gateways 2026 — Lunar.dev
                    </div>
                    <span className={styles.refUrl}>
                      lunar.dev/post/the-best-open-source-mcp-gateways-in-2026
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://silentinfotech.com/blog/ai-9/mcp-gateway-every-enterprise-ai-deployment-needs-536"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> What Is an MCP Gateway? Why Every Enterprise AI
                      Deployment Needs One
                    </div>
                    <span className={styles.refUrl}>
                      silentinfotech.com/blog/ai-9/mcp-gateway-every-enterprise-ai-deployment-needs
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://tyk.io/learning-center/mcp-gateway-architecture-technical-guide/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> MCP Gateway: The Control Plane for Enterprise AI
                      Agents — Tyk
                    </div>
                    <span className={styles.refUrl}>
                      tyk.io/learning-center/mcp-gateway-architecture-technical-guide
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mintmcp.com/blog/mcp-gateways-soc2-compliant-organizations"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.refTitle}>
                      <i className="ti ti-link" /> Best MCP Gateways for SOC 2 Compliant
                      Organizations 2026 — MintMCP
                    </div>
                    <span className={styles.refUrl}>
                      mintmcp.com/blog/mcp-gateways-soc2-compliant-organizations
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </section>

          <footer className={styles.pageFooter}>
            本ドキュメントはWeb検索により収集した2026年7月時点の情報を基に作成されています。MCP仕様は活発に進化しているため、実装前に必ず{" "}
            <a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener noreferrer">
              公式サイト
            </a>{" "}
            および{" "}
            <a
              href="https://blog.modelcontextprotocol.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              公式ブログ
            </a>{" "}
            で最新情報をご確認ください。
          </footer>
        </main>
      </div>
    </div>
  );
}
