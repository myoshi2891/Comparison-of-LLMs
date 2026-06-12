import type { Metadata } from "next";
import CodeCopyButton from "@/components/docs/CodeCopyButton";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Claude Self-hosted Sandboxes 完全ガイド",
  description:
    "AIエージェントのツール実行環境を自社インフラに移動する方法を、初学者から実務者まで使えるようにステップバイステップで解説します。",
};

// ── MERMAID DIAGRAMS ──
const DIAG_LIFECYCLE = `sequenceDiagram
    participant App as Your App
    participant API as Anthropic API
    participant WQ  as Work Queue
    participant W   as Worker
    participant SB  as Sandbox

    Note over App,SB: フェーズ1 — セッション作成
    App->>API: sessions.create(agent_id, env_id, metadata)
    API->>WQ:  セッションをキューにエンキュー
    API-->>App: session_id を返す

    Note over W,WQ: フェーズ2 — ワーカーポーリング
    loop ポーリングループ
        W->>WQ:  GET /environments/{id}/work
        WQ-->>W: ワークアイテムを返す
        W->>WQ:  POST /work/{id}/ack（取得確認）
    end

    Note over W,SB: フェーズ3 — サンドボックス起動
    W->>SB: コンテナを起動
    SB->>SB: /workspace/skills/ にスキルをダウンロード

    Note over API,SB: フェーズ4 — エージェントループ
    loop ツール実行ループ
        API->>W: ツール呼び出しリクエスト
        W->>SB: ローカルでツールを実行
        W->>WQ: POST /work/{id}/heartbeat（生存確認）
        SB-->>W: 実行結果
        W->>API: POST /work/{id}/results（結果投稿）
    end

    Note over API,App: フェーズ5 — 完了
    API-->>App: SSE でファイナルイベントをストリーミング
    Note over SB: /mnt/session/outputs に出力を保存`;

const DIAG_SETUP = `flowchart TD
    S([Start]) --> P0
    P0["Step 0\\n前提条件を確認"]
    P1["Step 1\\nエージェントを作成"]
    P2["Step 2\\nself_hosted 環境を作成\\n環境キーを安全に保管"]
    P3{"Step 3\\nワーカーパターンを選択"}
    P3A["Always-on\\nant CLI\\n最もシンプル"]
    P3B["Always-on\\nPython / TS SDK\\nカスタムロジック"]
    P3C["Webhook-triggered\\nPython / TS SDK\\nコスト効率重視"]
    P4["Step 4\\nセッションを開始"]
    P5["Step 5\\nキュー深度・ワーカーを監視"]
    E([完了])

    P0-->P1-->P2-->P3
    P3-->|開発用|P3A
    P3-->|本番カスタム|P3B
    P3-->|スケール|P3C
    P3A-->P4
    P3B-->P4
    P3C-->P4
    P4-->P5-->E

    style S fill:#8b5cf6,color:#fff,stroke:none
    style E fill:#10b981,color:#fff,stroke:none
    style P3 fill:#1e1650,color:#c4b5fd,stroke:#8b5cf6
    style P3A fill:#131330,color:#a78bfa,stroke:#6d28d9
    style P3B fill:#131330,color:#a78bfa,stroke:#6d28d9
    style P3C fill:#0e2818,color:#86efac,stroke:#16a34a`;

const DIAG_WORKERS = `flowchart TD
    Start([開始]) --> Q1{用途は？}
    Q1-->|"開発・テスト\\nすぐ試したい"| AO_CLI
    Q1-->|"本番・一定負荷"| AO_SDK
    Q1-->|"断続的な負荷\\nコスト最適化"| WT_SDK

    AO_CLI["Always-on: ant CLI\\n常時ポーリング\\nコマンド1行で起動"]
    AO_SDK["Always-on: Python/TS SDK\\n常時ポーリング\\nカスタムロジック実装可能"]
    WT_SDK["Webhook-triggered\\nPython/TS SDK\\nsession.status_run_started で起動\\nアイドル時はゼロコスト"]

    AO_CLI --> R1["ant worker --environment-id ID"]
    AO_SDK --> R2["worker.run()"]
    WT_SDK --> R3["worker.run_until_empty()"]

    style AO_CLI fill:#1a1650,color:#c4b5fd,stroke:#8b5cf6
    style AO_SDK fill:#1a1650,color:#c4b5fd,stroke:#8b5cf6
    style WT_SDK fill:#0e2818,color:#86efac,stroke:#22c55e`;

const DIAG_MCP = `flowchart TD
    Q{何を制御したいか？}

    Q-->|"ツール実行を境界内に置いたい"| A
    Q-->|"プライベートMCPサーバーに接続"| B
    Q-->|"両方"| C

    A["Self-hosted Sandbox のみ\\n\\nCloud Sandbox +\\nPublic MCP Server"]
    B["MCP Tunnels のみ\\n\\nCloud Sandbox +\\nPrivate MCP Server（Tunnel 経由）"]
    C["両方を組み合わせ\\n\\nYour Sandbox +\\nPrivate MCP Server（Tunnel 経由）\\n\\n実行もツールも境界内に完全維持"]

    style A fill:#131338,color:#93c5fd,stroke:#3b82f6
    style B fill:#1a1208,color:#fde68a,stroke:#d97706
    style C fill:#0a2010,color:#86efac,stroke:#22c55e`;

interface ExtProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function Ext({ href, children, className }: ExtProps) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Page() {
  return (
    <div className={styles.layout}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css"
      />

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sbBrand}>
          <div className={styles.sbIcon}>🤖</div>
          <div>
            <div className={styles.sbTxt}>Self-hosted Sandboxes</div>
            <div className={styles.sbSub}>完全ガイド · Public Beta</div>
          </div>
        </div>
        <nav id="sidenav">
          <p className={styles.navCat}>はじめに</p>
          <a href="#about" className={styles.navA}>
            Self-hosted とは
          </a>
          <a href="#comparison" className={styles.navA}>
            Cloud との違い
          </a>
          <a href="#usecases" className={styles.navA}>
            ユースケース
          </a>
          <p className={styles.navCat}>アーキテクチャ</p>
          <a href="#architecture" className={styles.navA}>
            システム概要（SVG）
          </a>
          <a href="#lifecycle" className={styles.navA}>
            セッションライフサイクル
          </a>
          <p className={styles.navCat}>セットアップ</p>
          <a href="#step0" className={styles.navA}>
            <span className={styles.navStep}>0</span>&nbsp;前提条件
          </a>
          <a href="#step1" className={styles.navA}>
            <span className={styles.navStep}>1</span>&nbsp;エージェント作成
          </a>
          <a href="#step2" className={styles.navA}>
            <span className={styles.navStep}>2</span>&nbsp;環境作成
          </a>
          <a href="#step3" className={styles.navA}>
            <span className={styles.navStep}>3</span>&nbsp;ワーカー起動
          </a>
          <a href="#step4" className={styles.navA}>
            <span className={styles.navStep}>4</span>&nbsp;セッション開始
          </a>
          <a href="#step5" className={styles.navA}>
            <span className={styles.navStep}>5</span>&nbsp;モニタリング設定
          </a>
          <p className={styles.navCat}>詳細ガイド</p>
          <a href="#workers" className={styles.navA}>
            ワーカーパターン
          </a>
          <a href="#filesystem" className={styles.navA}>
            ファイルシステム
          </a>
          <a href="#security" className={styles.navA}>
            セキュリティモデル
          </a>
          <a href="#providers" className={styles.navA}>
            プロバイダー
          </a>
          <a href="#mcp" className={styles.navA}>
            MCP トンネル
          </a>
          <p className={styles.navCat}>運用</p>
          <a href="#bestpractices" className={styles.navA}>
            ベストプラクティス
          </a>
          <a href="#monitoring" className={styles.navA}>
            モニタリングと運用
          </a>
          <p className={styles.navCat}>リソース</p>
          <a href="#sources" className={styles.navA}>
            参考 URL
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero} id="hero">
          <div className={styles.hBadge}>
            <span className={styles.hDot} />
            Public Beta — 2026年5月19日リリース
          </div>
          <h1>
            Claude <span className={styles.hl}>Self-hosted Sandboxes</span>
            <br />
            完全ガイド
          </h1>
          <p className={styles.hLead}>
            AIエージェントのツール実行環境を自社インフラに移動する方法を、初学者から実務者まで使えるようにステップバイステップで解説します。
          </p>
          <div className={styles.hMeta}>
            <span className={styles.hMetaI}>
              🤖 <strong>対象モデル</strong>: Claude Opus 4 系最新版（2026年時点）を含む最新モデル
            </span>
            <span className={styles.hMetaI}>
              📋 <strong>ステータス</strong>: Public Beta
            </span>
            <span className={styles.hMetaI}>
              📅 <strong>更新日</strong>: 2026年6月10日
            </span>
          </div>
        </section>

        {/* 1. About */}
        <section id="about" className={styles.sec}>
          <h2>
            <span className={styles.secN}>1</span>Self-hosted Sandboxes とは？
          </h2>
          <p>
            <strong>Self-hosted Sandboxes</strong> は Claude Managed Agents
            の機能で、AIエージェントの<strong>ツール実行環境をあなた自身のインフラに移動</strong>
            できる仕組みです。デフォルトでは Anthropic
            が管理するクラウドサンドボックスでツールが実行されますが、Self-hosted
            を選択すると、ツールの実際の実行だけがあなたのインフラに移ります。
          </p>

          <div className={`${styles.ca} ${styles.caV}`}>
            <span className={styles.caI}>💡</span>
            <p>
              <strong>核心：</strong>
              オーケストレーション（推論・エラー回復・プロンプトキャッシュ）は常に Anthropic
              のクラウドで動きます。Self-hosted で変わるのは「ツールが実行される場所」だけです。
            </p>
          </div>

          {/* Architecture SVG */}
          <div className={styles.svgw}>
            <div className={styles.svgwT}>システムアーキテクチャ概要</div>
            <svg
              role="img"
              aria-label="システムアーキテクチャ概要"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 880 456"
              style={{ width: "100%", maxWidth: "880px", display: "block", margin: "0 auto" }}
            >
              <title>システムアーキテクチャ概要</title>
              <rect width="880" height="456" fill="#0f0f28" rx="8" />
              <text
                x="440"
                y="36"
                textAnchor="middle"
                fontSize="16"
                fontWeight="700"
                fill="#e2e8f0"
              >
                Claude Self-hosted Sandboxes — アーキテクチャ概要
              </text>

              {/* Left zone: Anthropic Cloud */}
              <rect
                x="18"
                y="52"
                width="372"
                height="388"
                rx="14"
                fill="#111138"
                stroke="#4285f4"
                strokeWidth="2"
              />
              <text
                x="204"
                y="82"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#7dd3fc"
              >
                ☁ Anthropic Cloud
              </text>
              <text x="204" y="100" textAnchor="middle" fontSize="10.5" fill="#64748b">
                オーケストレーション（指揮制御）
              </text>
              <line x1="36" y1="109" x2="372" y2="109" stroke="#1e3a5f" strokeWidth="1" />

              {/* Claude Model */}
              <rect x="36" y="117" width="155" height="52" rx="8" fill="#1a2e5a" />
              <rect
                x="36"
                y="117"
                width="155"
                height="52"
                rx="8"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1"
              />
              <text
                x="113"
                y="141"
                textAnchor="middle"
                fontSize="11.5"
                fill="#93c5fd"
                fontWeight="600"
              >
                🤖 Claude Model
              </text>
              <text x="113" y="157" textAnchor="middle" fontSize="9.5" fill="#64748b">
                推論エンジン
              </text>

              {/* Orchestration */}
              <rect x="205" y="117" width="155" height="52" rx="8" fill="#1a2e5a" />
              <rect
                x="205"
                y="117"
                width="155"
                height="52"
                rx="8"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1"
              />
              <text
                x="282"
                y="141"
                textAnchor="middle"
                fontSize="11.5"
                fill="#93c5fd"
                fontWeight="600"
              >
                ⚙ Orchestration
              </text>
              <text x="282" y="157" textAnchor="middle" fontSize="9.5" fill="#64748b">
                エージェントループ
              </text>

              {/* Work Queue */}
              <rect
                x="36"
                y="186"
                width="324"
                height="64"
                rx="8"
                fill="#1e1650"
                stroke="#8b5cf6"
                strokeWidth="1.5"
              />
              <text
                x="198"
                y="213"
                textAnchor="middle"
                fontSize="12.5"
                fill="#c4b5fd"
                fontWeight="700"
              >
                📬 Work Queue
              </text>
              <text x="198" y="232" textAnchor="middle" fontSize="9.5" fill="#64748b">
                depth · pending · workers_polling でキュー状態を管理
              </text>

              {/* Context / Error */}
              <rect
                x="36"
                y="268"
                width="155"
                height="52"
                rx="8"
                fill="#172340"
                stroke="#1d4ed8"
                strokeWidth="1"
              />
              <text
                x="113"
                y="292"
                textAnchor="middle"
                fontSize="11.5"
                fill="#7dd3fc"
                fontWeight="600"
              >
                📝 Context Mgmt
              </text>
              <text x="113" y="308" textAnchor="middle" fontSize="9.5" fill="#64748b">
                コンテキスト管理
              </text>

              <rect
                x="205"
                y="268"
                width="155"
                height="52"
                rx="8"
                fill="#172340"
                stroke="#1d4ed8"
                strokeWidth="1"
              />
              <text
                x="282"
                y="292"
                textAnchor="middle"
                fontSize="11.5"
                fill="#7dd3fc"
                fontWeight="600"
              >
                🔄 Error Recovery
              </text>
              <text x="282" y="308" textAnchor="middle" fontSize="9.5" fill="#64748b">
                エラー回復
              </text>

              {/* Sessions API */}
              <rect
                x="36"
                y="338"
                width="324"
                height="52"
                rx="8"
                fill="#0e3320"
                stroke="#22c55e"
                strokeWidth="1.5"
              />
              <text
                x="198"
                y="362"
                textAnchor="middle"
                fontSize="11.5"
                fill="#86efac"
                fontWeight="600"
              >
                🔗 Sessions API · Webhooks · SSE
              </text>
              <text x="198" y="380" textAnchor="middle" fontSize="9.5" fill="#64748b">
                ユーザーアプリのアクセスポイント
              </text>

              {/* Right zone: Your Infrastructure */}
              <rect
                x="490"
                y="52"
                width="372"
                height="388"
                rx="14"
                fill="#0f2018"
                stroke="#22c55e"
                strokeWidth="2"
              />
              <text
                x="676"
                y="82"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#86efac"
              >
                🏢 Your Infrastructure
              </text>
              <text x="676" y="100" textAnchor="middle" fontSize="10.5" fill="#64748b">
                ツール実行環境
              </text>
              <line x1="508" y1="109" x2="844" y2="109" stroke="#14532d" strokeWidth="1" />

              {/* Worker */}
              <rect
                x="508"
                y="117"
                width="336"
                height="52"
                rx="8"
                fill="#14532d"
                stroke="#22c55e"
                strokeWidth="1.5"
              />
              <text
                x="676"
                y="141"
                textAnchor="middle"
                fontSize="11.5"
                fill="#86efac"
                fontWeight="700"
              >
                🖥 Environment Worker
              </text>
              <text x="676" y="157" textAnchor="middle" fontSize="9.5" fill="#64748b">
                Always-on or Webhook-triggered
              </text>

              {/* Sandbox */}
              <rect
                x="508"
                y="186"
                width="336"
                height="84"
                rx="8"
                fill="#052e16"
                stroke="#16a34a"
                strokeWidth="1"
              />
              <text
                x="676"
                y="210"
                textAnchor="middle"
                fontSize="11.5"
                fill="#86efac"
                fontWeight="600"
              >
                📦 Sandbox Container
              </text>
              <rect x="522" y="220" width="145" height="40" rx="5" fill="#14532d" />
              <text
                x="594"
                y="238"
                textAnchor="middle"
                fontSize="9.5"
                fill="#bbf7d0"
                fontWeight="600"
              >
                /workspace
              </text>
              <text x="594" y="253" textAnchor="middle" fontSize="9" fill="#64748b">
                スキル・作業ファイル
              </text>
              <rect x="679" y="220" width="151" height="40" rx="5" fill="#14532d" />
              <text
                x="754"
                y="238"
                textAnchor="middle"
                fontSize="9.5"
                fill="#bbf7d0"
                fontWeight="600"
              >
                /mnt/session/outputs
              </text>
              <text x="754" y="253" textAnchor="middle" fontSize="9" fill="#64748b">
                出力ファイル
              </text>

              {/* Tool Execution / Internal */}
              <rect
                x="508"
                y="288"
                width="158"
                height="52"
                rx="8"
                fill="#14532d"
                stroke="#16a34a"
                strokeWidth="1"
              />
              <text
                x="587"
                y="312"
                textAnchor="middle"
                fontSize="11.5"
                fill="#86efac"
                fontWeight="600"
              >
                🔧 Tool Execution
              </text>
              <text x="587" y="328" textAnchor="middle" fontSize="9.5" fill="#64748b">
                Bash / File / Web
              </text>

              <rect
                x="678"
                y="288"
                width="158"
                height="52"
                rx="8"
                fill="#14532d"
                stroke="#16a34a"
                strokeWidth="1"
              />
              <text
                x="757"
                y="312"
                textAnchor="middle"
                fontSize="11.5"
                fill="#86efac"
                fontWeight="600"
              >
                🌐 Internal Services
              </text>
              <text x="757" y="328" textAnchor="middle" fontSize="9.5" fill="#64748b">
                社内 API · DB
              </text>

              {/* Security Controls */}
              <rect
                x="508"
                y="358"
                width="336"
                height="38"
                rx="8"
                fill="#052e16"
                stroke="#16a34a"
                strokeWidth="1"
              />
              <text
                x="676"
                y="374"
                textAnchor="middle"
                fontSize="10.5"
                fill="#86efac"
                fontWeight="600"
              >
                🔒 VPC · Firewall · Audit Log · Compliance
              </text>
              <text x="676" y="389" textAnchor="middle" fontSize="9" fill="#64748b">
                あなたのセキュリティコントロール
              </text>

              {/* Network boundary */}
              <line
                x1="433"
                y1="52"
                x2="433"
                y2="430"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="10 6"
              />
              <rect x="378" y="432" width="112" height="16" rx="3" fill="#0f0f28" />
              <text x="434" y="443" textAnchor="middle" fontSize="9.5" fill="#64748b">
                ネットワーク境界
              </text>

              {/* Arrows */}
              <defs>
                <marker
                  id="mb"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <polygon points="0,1 9,5 0,9" fill="#8b5cf6" />
                </marker>
                <marker
                  id="mg"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <polygon points="0,1 9,5 0,9" fill="#22c55e" />
                </marker>
              </defs>
              <line
                x1="488"
                y1="212"
                x2="398"
                y2="212"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeDasharray="7 3"
                markerEnd="url(#mb)"
              />
              <rect
                x="403"
                y="194"
                width="62"
                height="16"
                rx="4"
                fill="#0f0f28"
                stroke="#8b5cf6"
                strokeWidth="1"
              />
              <text
                x="434"
                y="206"
                textAnchor="middle"
                fontSize="9"
                fill="#c4b5fd"
                fontWeight="700"
              >
                ① Poll
              </text>
              <line
                x1="398"
                y1="234"
                x2="488"
                y2="234"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeDasharray="7 3"
                markerEnd="url(#mg)"
              />
              <rect
                x="401"
                y="238"
                width="68"
                height="16"
                rx="4"
                fill="#0f0f28"
                stroke="#22c55e"
                strokeWidth="1"
              />
              <text
                x="435"
                y="250"
                textAnchor="middle"
                fontSize="9"
                fill="#86efac"
                fontWeight="700"
              >
                ② Results
              </text>
            </svg>
          </div>

          <h3>Managed Agents の4つのコアコンセプト</h3>
          <div className={styles.tw}>
            <table>
              <thead>
                <tr>
                  <th>コンセプト</th>
                  <th>説明</th>
                  <th>Self-hosted での変化</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.tl}>Agent（エージェント）</td>
                  <td>モデル・システムプロンプト・ツール・MCP・スキルの定義</td>
                  <td>変化なし</td>
                </tr>
                <tr>
                  <td className={styles.tl}>Environment（環境）</td>
                  <td>セッションが動作する場所の設定</td>
                  <td>
                    type を <code>self_hosted</code> に変更
                  </td>
                </tr>
                <tr>
                  <td className={styles.tl}>Session（セッション）</td>
                  <td>タスクを実行するエージェントの稼働インスタンス</td>
                  <td>変化なし（起動方法は同じ）</td>
                </tr>
                <tr>
                  <td className={styles.tl}>Events（イベント）</td>
                  <td>アプリとエージェント間のメッセージ</td>
                  <td>変化なし</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. Comparison */}
        <section id="comparison" className={styles.sec}>
          <h2>
            <span className={styles.secN}>2</span>Cloud 環境との違い
          </h2>
          <div className={styles.tw}>
            <table>
              <thead>
                <tr>
                  <th>比較項目</th>
                  <th>☁️ Cloud Environment</th>
                  <th>🏢 Self-hosted Sandbox</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.tl}>ツール実行場所</td>
                  <td>Anthropic 管理のサンドボックス</td>
                  <td>
                    <strong>あなたのインフラ</strong>
                  </td>
                </tr>
                <tr>
                  <td className={styles.tl}>ネットワーク制御</td>
                  <td>Anthropic のエグレスポリシー</td>
                  <td>
                    <strong>あなたのネットワークポリシー</strong>
                  </td>
                </tr>
                <tr>
                  <td className={styles.tl}>ファイル・GitHub マウント</td>
                  <td>Anthropic が管理</td>
                  <td>
                    <strong>あなたが管理</strong>
                  </td>
                </tr>
                <tr>
                  <td className={styles.tl}>コンテナライフサイクル</td>
                  <td>Anthropic が管理</td>
                  <td>
                    <strong>あなたが管理</strong>
                  </td>
                </tr>
                <tr>
                  <td className={styles.tl}>カスタムコンテナイメージ</td>
                  <td>
                    <span className={`${styles.badge} ${styles.br}`}>❌ 不可</span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.bg}`}>✅ 可能</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.tl}>社内サービスアクセス</td>
                  <td>限定的</td>
                  <td>
                    <span className={`${styles.badge} ${styles.bg}`}>
                      ✅ プライベートネットワーク経由
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.tl}>データのネットワーク外出力</td>
                  <td>Anthropic インフラ上に入る</td>
                  <td>
                    <span className={`${styles.badge} ${styles.bg}`}>✅ 境界内で完結</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.tl}>ZDR / HIPAA BAA 対象</td>
                  <td>
                    <span className={`${styles.badge} ${styles.br}`}>
                      ❌ 非対象（Managed Agents全体）
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.br}`}>❌ 同左</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.tl}>セットアップ難易度</td>
                  <td>低い（すぐ使える）</td>
                  <td>中程度（ワーカー実装が必要）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.ca} ${styles.caA}`}>
            <span className={styles.caI}>⚠️</span>
            <p>
              <strong>注意:</strong> Managed Agents はステートフルな設計のため、現時点では{" "}
              <strong>Zero Data Retention (ZDR)</strong> および <strong>HIPAA BAA</strong>{" "}
              の対象外です。詳細:{" "}
              <Ext href="https://platform.claude.com/docs/en/manage-claude/api-and-data-retention#feature-eligibility">
                API and data retention
              </Ext>
            </p>
          </div>
        </section>

        {/* 3. Use Cases */}
        <section id="usecases" className={styles.sec}>
          <h2>
            <span className={styles.secN}>3</span>ユースケース
          </h2>
          <div className={styles.tw}>
            <table>
              <thead>
                <tr>
                  <th>ユースケース</th>
                  <th>詳細</th>
                  <th>対象業界</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.tl}>機密データ処理</td>
                  <td>患者情報・金融データをネットワーク境界内で AI 分析</td>
                  <td>医療・金融</td>
                </tr>
                <tr>
                  <td className={styles.tl}>社内システム連携</td>
                  <td>イントラネット API・プライベート DB へのアクセス</td>
                  <td>製造・エンタープライズ</td>
                </tr>
                <tr>
                  <td className={styles.tl}>コンプライアンス対応</td>
                  <td>組織独自の監査ログ・セキュリティコントロールの適用</td>
                  <td>政府・金融・ヘルスケア</td>
                </tr>
                <tr>
                  <td className={styles.tl}>重計算処理</td>
                  <td>長時間ビルド・画像生成・データパイプライン（GPU 活用）</td>
                  <td>AI/ML・メディア</td>
                </tr>
                <tr>
                  <td className={styles.tl}>ステートフル開発環境</td>
                  <td>長時間稼働・状態保持・SSH アクセスが必要なエージェント</td>
                  <td>エンジニアリング・R&amp;D</td>
                </tr>
                <tr>
                  <td className={styles.tl}>カスタムランタイム</td>
                  <td>特定の OS イメージ・パッケージ・設定が必要な環境</td>
                  <td>DevOps・システム開発</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>実採用事例（公式ブログ, 2026年5月）</h3>
          <div className={styles.tw}>
            <table>
              <thead>
                <tr>
                  <th>企業</th>
                  <th>使用内容</th>
                  <th>プロバイダー</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.tl}>Clay</td>
                  <td>
                    GTM エンジニアリングエージェント「Sculptor」でワークフローを自律構築・テスト
                  </td>
                  <td>Daytona</td>
                </tr>
                <tr>
                  <td className={styles.tl}>Rogo</td>
                  <td>機関投資家向け金融 AI プラットフォームで独自データを安全処理</td>
                  <td>Vercel</td>
                </tr>
                <tr>
                  <td className={styles.tl}>Amplitude</td>
                  <td>ブランド準拠 of UI を生成する Design Agent</td>
                  <td>Cloudflare</td>
                </tr>
                <tr>
                  <td className={styles.tl}>Mason</td>
                  <td>複雑な製品面での社内ツールのセキュアなオーケストレーション</td>
                  <td>Modal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Architecture & Lifecycle */}
        <section id="architecture" className={styles.sec}>
          <h2>
            <span className={styles.secN}>4</span>システムアーキテクチャ
          </h2>
          <h3 id="lifecycle">セッションライフサイクル</h3>
          <div className={`${styles.mw} ${styles.mwLg}`}>
            <div className={styles.mwT}>セッションデータフロー（Sequence Diagram）</div>
            <MermaidDiagram chart={DIAG_LIFECYCLE} />
          </div>
        </section>

        {/* 5. Setup */}
        <section id="setup" className={styles.sec}>
          <h2>
            <span className={styles.secN}>5</span>Step-by-Step セットアップ
          </h2>
          <div className={styles.mw}>
            <div className={styles.mwT}>セットアップ全体フロー</div>
            <MermaidDiagram chart={DIAG_SETUP} />
          </div>

          {/* Step 0 */}
          <div id="step0" className={styles.stepCard}>
            <div className={styles.stepNBadge}>0</div>
            <h3>前提条件の確認</h3>
            <div className={styles.stepTags}>
              <span className={`${styles.tag} ${styles.tv}`}>必須</span>
              <span className={`${styles.tag} ${styles.ta}`}>最初に確認</span>
            </div>
            <div className={styles.tw}>
              <table>
                <thead>
                  <tr>
                    <th>要件</th>
                    <th>詳細</th>
                    <th>取得先</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.tl}>Claude API キー</td>
                    <td>
                      <code>sk-ant-...</code> 形式
                    </td>
                    <td>
                      <Ext href="https://platform.claude.com/settings/keys">
                        platform.claude.com/settings/keys
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.tl}>Beta ヘッダー</td>
                    <td>
                      <code>managed-agents-2026-04-01</code>（SDK は自動付与）
                    </td>
                    <td>SDK 利用時は自動</td>
                  </tr>
                  <tr>
                    <td className={styles.tl}>Python SDK</td>
                    <td>
                      <code>pip install anthropic</code>
                    </td>
                    <td>PyPI</td>
                  </tr>
                  <tr>
                    <td className={styles.tl}>TypeScript SDK</td>
                    <td>
                      <code>npm install @anthropic-ai/sdk</code>
                    </td>
                    <td>npm</td>
                  </tr>
                  <tr>
                    <td className={styles.tl}>ant CLI</td>
                    <td>
                      <code>pip install anthropic</code> に同梱
                    </td>
                    <td>PyPI</td>
                  </tr>
                  <tr>
                    <td className={styles.tl}>/bin/bash（固定パス）</td>
                    <td>SDK ヘルパーが固定パスで参照</td>
                    <td>OS 標準（PATH 解決不可）</td>
                  </tr>
                  <tr>
                    <td className={styles.tl}>Node.js 22+（TS SDK のみ）</td>
                    <td>
                      <code>unzip</code>, <code>tar</code> も必要
                    </td>
                    <td>nodejs.org</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.cb}>
              <div className={styles.ch}>
                <div className={styles.dots}>
                  <div className={`${styles.d} ${styles.dr}`} />
                  <div className={`${styles.d} ${styles.dy}`} />
                  <div className={`${styles.d} ${styles.dg}`} />
                </div>
                <span className={styles.cl}>bash</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`pip install anthropic            # Python SDK + ant CLI\nnpm install @anthropic-ai/sdk    # TypeScript SDK\nexport ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxx"`}
                />
              </div>
              <pre>
                <code>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>pip</span> install anthropic{"            "}
                    <span className={styles.cc}># Python SDK + ant CLI</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>npm</span> install @anthropic-ai/sdk{"    "}
                    <span className={styles.cc}># TypeScript SDK</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>export</span> ANTHROPIC_API_KEY=
                    <span className={styles.st}>&quot;sk-ant-xxxxxxxxxx&quot;</span>
                  </div>
                </code>
              </pre>
            </div>
            <div className={`${styles.ca} ${styles.caA}`}>
              <span className={styles.caI}>⚠️</span>
              <p>
                SDK ヘルパーは <code>/bin/bash</code> を<strong>固定パス</strong>で参照します。PATH
                変数での解決は行われません。
              </p>
            </div>
          </div>

          {/* Step 1 */}
          <div id="step1" className={styles.stepCard}>
            <div className={styles.stepNBadge}>1</div>
            <h3>エージェントを作成する</h3>
            <div className={styles.stepTags}>
              <span className={`${styles.tag} ${styles.tv}`}>モデル定義</span>
              <span className={`${styles.tag} ${styles.tg}`}>一度作成・ID で再利用</span>
            </div>
            <p>
              エージェントは「モデル・システムプロンプト・ツール・スキルの定義」です。モデルはエージェント側で設定します（環境側ではありません）。
            </p>
            <div className={styles.cb}>
              <div className={styles.ch}>
                <div className={styles.dots}>
                  <div className={`${styles.d} ${styles.dr}`} />
                  <div className={`${styles.d} ${styles.dy}`} />
                  <div className={`${styles.d} ${styles.dg}`} />
                </div>
                <span className={styles.cl}>python</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`import anthropic\n\nclient = anthropic.Anthropic()\n\nagent = client.beta.agents.create(\n    name="Self-hosted Demo Agent",\n    model="claude-opus-4-latest",\n    system_prompt="""You are a helpful coding assistant.\nYour working directory is /workspace.\nSkills are available at /workspace/skills/.\nOutput files should be written to /mnt/session/outputs.\n""",\n)\n\nprint(f"Agent ID: {agent.id}")`}
                />
              </div>
              <pre>
                <code>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>import</span> anthropic
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    client = anthropic.<span className={styles.fn}>Anthropic</span>()
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    agent = client.beta.agents.<span className={styles.fn}>create</span>(
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}name=
                    <span className={styles.st}>&quot;Self-hosted Demo Agent&quot;</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}model=
                    <span className={styles.st}>&quot;claude-opus-4-latest&quot;</span>,{"      "}
                    <span className={styles.cc}>
                      # 必要に応じて Managed Agents 対応の最新モデルに置き換えてください
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}system_prompt=
                    <span className={styles.st}>
                      &quot;&quot;&quot;You are a helpful coding assistant.
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.st}>Your working directory is /workspace.</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.st}>Skills are available at /workspace/skills/.</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.st}>
                      Output files should be written to /mnt/session/outputs.
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.st}>&quot;&quot;&quot;</span>,
                  </div>
                  <div className={styles.codeLine}>)</div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.fn}>print</span>(f
                    <span className={styles.st}>&quot;Agent ID: &#123;agent.id&#125;&quot;</span>)
                    {"  "}
                    <span className={styles.cc}># agent_01XxXx...</span>
                  </div>
                </code>
              </pre>
            </div>
          </div>

          {/* Step 2 */}
          <div id="step2" className={styles.stepCard}>
            <div className={styles.stepNBadge}>2</div>
            <h3>Self-hosted 環境を作成する</h3>
            <div className={styles.stepTags}>
              <span className={`${styles.tag} ${styles.tv}`}>環境作成</span>
              <span className={`${styles.tag} ${styles.tr}`}>環境キーを安全に保管！</span>
            </div>
            <p>
              <code>type=&quot;self_hosted&quot;</code> を指定して環境を作成します。ここで発行される{" "}
              <strong>環境キー（ANTHROPIC_ENVIRONMENT_KEY）</strong> の取り扱いが最も重要です。
            </p>
            <div className={styles.cb}>
              <div className={styles.ch}>
                <div className={styles.dots}>
                  <div className={`${styles.d} ${styles.dr}`} />
                  <div className={`${styles.d} ${styles.dy}`} />
                  <div className={`${styles.d} ${styles.dg}`} />
                </div>
                <span className={styles.cl}>python</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`environment = client.beta.environments.create(\n    name="Production Self-hosted Environment",\n    type="self_hosted",\n)\n\nprint(f"Environment ID : {environment.id}")\nprint(f"Environment Key: {environment.key}")`}
                />
              </div>
              <pre>
                <code>
                  <div className={styles.codeLine}>
                    environment = client.beta.environments.<span className={styles.fn}>create</span>
                    (
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}name=
                    <span className={styles.st}>
                      &quot;Production Self-hosted Environment&quot;
                    </span>
                    ,
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}type=<span className={styles.st}>&quot;self_hosted&quot;</span>,
                  </div>
                  <div className={styles.codeLine}>)</div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.fn}>print</span>(f
                    <span className={styles.st}>
                      &quot;Environment ID : &#123;environment.id&#125;&quot;
                    </span>
                    )
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.fn}>print</span>(f
                    <span className={styles.st}>
                      &quot;Environment Key: &#123;environment.key&#125;&quot;
                    </span>
                    ){"  "}
                    <span className={styles.cc}># &lt;-- 必ずシークレットマネージャーへ！</span>
                  </div>
                </code>
              </pre>
            </div>
            <div className={styles.tw}>
              <table>
                <thead>
                  <tr>
                    <th>❌ やってはいけない</th>
                    <th>✅ 推奨</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>.env ファイルに平文で保存</td>
                    <td>AWS Secrets Manager に保管</td>
                  </tr>
                  <tr>
                    <td>コンテナイメージに焼き込む</td>
                    <td>GCP Secret Manager に保管</td>
                  </tr>
                  <tr>
                    <td>Git リポジトリにコミット</td>
                    <td>HashiCorp Vault に保管</td>
                  </tr>
                  <tr>
                    <td>ワーカーホストの環境変数に設定</td>
                    <td>CI/CD パイプラインでランタイム注入</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={`${styles.ca} ${styles.caR}`}>
              <span className={styles.caI}>🔑</span>
              <p>
                <strong>AWS を使用する場合：</strong> Claude Platform on AWS では環境キーの代わりに
                AWS IAM（SigV4）で認証します。IAM プリンシパルに{" "}
                <code>AnthropicSelfHostedEnvironmentAccess</code>{" "}
                マネージドポリシーをアタッチしてください。Console で生成した環境キーは AWS
                エンドポイントでは動作しません。
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div id="step3" className={styles.stepCard}>
            <div className={styles.stepNBadge}>3</div>
            <h3>ワーカーを起動する（3パターン）</h3>
            <div className={styles.stepTags}>
              <span className={`${styles.tag} ${styles.tv}`}>核心部分</span>
              <span className={`${styles.tag} ${styles.ta}`}>パターンを選択</span>
            </div>
            <p>
              ワーカーはワークキューをポーリングしてツール呼び出しをローカルで実行するプロセスです。
            </p>

            <h4>パターン A: Always-on（ant CLI）— 最もシンプル</h4>
            <div className={styles.cb}>
              <div className={styles.ch}>
                <div className={styles.dots}>
                  <div className={`${styles.d} ${styles.dr}`} />
                  <div className={`${styles.d} ${styles.dy}`} />
                  <div className={`${styles.d} ${styles.dg}`} />
                </div>
                <span className={styles.cl}>bash</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`export ANTHROPIC_ENVIRONMENT_KEY="env-key-xxxxxxxxxx"\nexport ANTHROPIC_ENVIRONMENT_ID="env-xxxxxxxxxxxx"\n\nant worker --environment-id "$ANTHROPIC_ENVIRONMENT_ID"\n\n# 作業ディレクトリを変更する場合\nant worker --environment-id "$ANTHROPIC_ENVIRONMENT_ID" --workdir /custom/workspace`}
                />
              </div>
              <pre>
                <code>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>export</span> ANTHROPIC_ENVIRONMENT_KEY=
                    <span className={styles.st}>&quot;env-key-xxxxxxxxxx&quot;</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>export</span> ANTHROPIC_ENVIRONMENT_ID=
                    <span className={styles.st}>&quot;env-xxxxxxxxxxxx&quot;</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>ant</span> worker --environment-id{" "}
                    <span className={styles.st}>&quot;$ANTHROPIC_ENVIRONMENT_ID&quot;</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.cc}>
                      # 作業ディレクトリを変更する場合（システムプロンプトも合わせて更新すること）
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>ant</span> worker --environment-id{" "}
                    <span className={styles.st}>&quot;$ANTHROPIC_ENVIRONMENT_ID&quot;</span>{" "}
                    --workdir /custom/workspace
                  </div>
                </code>
              </pre>
            </div>

            <h4>パターン B: Always-on（Python SDK）— カスタムロジック対応</h4>
            <div className={styles.cb}>
              <div className={styles.ch}>
                <div className={styles.dots}>
                  <div className={`${styles.d} ${styles.dr}`} />
                  <div className={`${styles.d} ${styles.dy}`} />
                  <div className={`${styles.d} ${styles.dg}`} />
                </div>
                <span className={styles.cl}>python</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`import os\nimport anthropic\n\nworker = anthropic.beta.EnvironmentWorker(\n    environment_id=os.environ["ANTHROPIC_ENVIRONMENT_ID"],\n    environment_key=os.environ["ANTHROPIC_ENVIRONMENT_KEY"],\n)\n\nworker.run()`}
                />
              </div>
              <pre>
                <code>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>import</span> os
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>import</span> anthropic
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    worker = anthropic.beta.<span className={styles.fn}>EnvironmentWorker</span>(
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}environment_id=os.environ[
                    <span className={styles.st}>&quot;ANTHROPIC_ENVIRONMENT_ID&quot;</span>],
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}environment_key=os.environ[
                    <span className={styles.st}>&quot;ANTHROPIC_ENVIRONMENT_KEY&quot;</span>],
                  </div>
                  <div className={styles.codeLine}>)</div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    worker.<span className={styles.fn}>run</span>()
                    {"  "}
                    <span className={styles.cc}>
                      # ブロッキング実行（Ctrl+C でグレースフルシャットダウン）
                    </span>
                  </div>
                </code>
              </pre>
            </div>

            <h4>パターン C: Webhook-triggered（Python SDK）— コスト効率重視</h4>
            <div className={styles.cb}>
              <div className={styles.ch}>
                <div className={styles.dots}>
                  <div className={`${styles.d} ${styles.dr}`} />
                  <div className={`${styles.d} ${styles.dy}`} />
                  <div className={`${styles.d} ${styles.dg}`} />
                </div>
                <span className={styles.cl}>python</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`import os\nimport anthropic\nfrom flask import Flask, request, jsonify\n\napp = Flask(__name__)\n\n@app.route("/webhook/anthropic", methods=["POST"])\ndef handle_webhook():\n    payload = request.get_json()\n    if payload.get("type") == "session.status_run_started":\n        worker = anthropic.beta.EnvironmentWorker(\n            environment_id=os.environ["ANTHROPIC_ENVIRONMENT_ID"],\n            environment_key=os.environ["ANTHROPIC_ENVIRONMENT_KEY"],\n        )\n        worker.run_until_empty()\n    return jsonify({"status": "ok"})\n\nif __name__ == "__main__":\n    app.run(port=8080)`}
                />
              </div>
              <pre>
                <code>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>import</span> os
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>import</span> anthropic
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>from</span> flask{" "}
                    <span className={styles.kw}>import</span> Flask, request, jsonify
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    app = <span className={styles.fn}>Flask</span>(__name__)
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.op}>@</span>app.<span className={styles.fn}>route</span>
                    (<span className={styles.st}>&quot;/webhook/anthropic&quot;</span>, methods=[
                    <span className={styles.st}>&quot;POST&quot;</span>])
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>def</span>{" "}
                    <span className={styles.fn}>handle_webhook</span>():
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}payload = request.<span className={styles.fn}>get_json</span>()
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.kw}>if</span> payload.
                    <span className={styles.fn}>get</span>(
                    <span className={styles.st}>&quot;type&quot;</span>) =={" "}
                    <span className={styles.st}>&quot;session.status_run_started&quot;</span>:
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}
                    <span className={styles.cc}># セッション開始時だけワーカーを起動</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}worker = anthropic.beta.
                    <span className={styles.fn}>EnvironmentWorker</span>(
                  </div>
                  <div className={styles.codeLine}>
                    {"            "}environment_id=os.environ[
                    <span className={styles.st}>&quot;ANTHROPIC_ENVIRONMENT_ID&quot;</span>],
                  </div>
                  <div className={styles.codeLine}>
                    {"            "}environment_key=os.environ[
                    <span className={styles.st}>&quot;ANTHROPIC_ENVIRONMENT_KEY&quot;</span>],
                  </div>
                  <div className={styles.codeLine}>{"        "})</div>
                  <div className={styles.codeLine}>
                    {"        "}worker.<span className={styles.fn}>run_until_empty</span>()
                    {"  "}
                    <span className={styles.cc}># キューが空になったら自動終了</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.kw}>return</span>{" "}
                    <span className={styles.fn}>jsonify</span>(&#123;
                    <span className={styles.st}>&quot;status&quot;</span>:{" "}
                    <span className={styles.st}>&quot;ok&quot;</span>&#125;)
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>if</span> __name__ =={" "}
                    <span className={styles.st}>&quot;__main__&quot;</span>:
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}app.<span className={styles.fn}>run</span>(port=
                    <span className={styles.nm}>8080</span>)
                  </div>
                </code>
              </pre>
            </div>
            <div className={`${styles.ca} ${styles.caV}`}>
              <span className={styles.caI}>💡</span>
              <p>
                TypeScript SDK も同様 of パターンで実装できます。TypeScript では追加で{" "}
                <code>unzip</code>、<code>tar</code>、Node.js 22+ が必要です。
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div id="step4" className={styles.stepCard}>
            <div className={styles.stepNBadge}>4</div>
            <h3>セッションを開始する</h3>
            <div className={styles.stepTags}>
              <span className={`${styles.tag} ${styles.tg}`}>ワーカー起動後に実行</span>
            </div>
            <p>
              <code>environment_id</code> を指定することで Self-hosted が有効になります。
              <code>metadata</code> でセッション固有の情報をワーカーに渡せます。
            </p>
            <div className={styles.cb}>
              <div className={styles.ch}>
                <div className={styles.dots}>
                  <div className={`${styles.d} ${styles.dr}`} />
                  <div className={`${styles.d} ${styles.dy}`} />
                  <div className={`${styles.d} ${styles.dg}`} />
                </div>
                <span className={styles.cl}>python</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`session = client.beta.sessions.create(\n    agent=agent.id,\n    environment_id=environment.id,\n    metadata={\n        "input_file": "s3://my-bucket/sensitive-data.csv",\n        "user_id":    "user_12345",\n        "task":       "analyze_q1_report",\n    },\n)\n\nprint(f"Session ID: {session.id}")\n\nfor event in client.beta.sessions.stream_events(session.id):\n    if event.type == "content_block_delta":\n        print(event.delta.text, end="", flush=True)\n    elif event.type == "session.status_completed":\n        print("\\n\\n🎉 セッション完了")\n        break`}
                />
              </div>
              <pre>
                <code>
                  <div className={styles.codeLine}>
                    session = client.beta.sessions.<span className={styles.fn}>create</span>(
                  </div>
                  <div className={styles.codeLine}>{"    "}agent=agent.id,</div>
                  <div className={styles.codeLine}>{"    "}environment_id=environment.id,</div>
                  <div className={styles.codeLine}>{"    "}metadata=&#123;</div>
                  <div className={styles.codeLine}>
                    {"        "}
                    <span className={styles.st}>&quot;input_file&quot;</span>:{" "}
                    <span className={styles.st}>&quot;s3://my-bucket/sensitive-data.csv&quot;</span>
                    ,{"  "}
                    <span className={styles.cc}># ワーカーが読み取る</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}
                    <span className={styles.st}>&quot;user_id&quot;</span>:{"    "}
                    <span className={styles.st}>&quot;user_12345&quot;</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}
                    <span className={styles.st}>&quot;task&quot;</span>:{"       "}
                    <span className={styles.st}>&quot;analyze_q1_report&quot;</span>,
                  </div>
                  <div className={styles.codeLine}>{"    "}&#125;,</div>
                  <div className={styles.codeLine}>)</div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.fn}>print</span>(f
                    <span className={styles.st}>
                      &quot;Session ID: &#123;session.id&#125;&quot;
                    </span>
                    )
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># SSE でイベントをストリーミング受信</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>for</span> event{" "}
                    <span className={styles.kw}>in</span> client.beta.sessions.
                    <span className={styles.fn}>stream_events</span>(session.id):
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.kw}>if</span> event.type =={" "}
                    <span className={styles.st}>&quot;content_block_delta&quot;</span>:
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}
                    <span className={styles.fn}>print</span>(event.delta.text, end=
                    <span className={styles.st}>&quot;&quot;</span>, flush=
                    <span className={styles.kw}>True</span>)
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.kw}>else</span> <span className={styles.kw}>if</span>{" "}
                    event.type =={" "}
                    <span className={styles.st}>&quot;session.status_completed&quot;</span>:
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}
                    <span className={styles.fn}>print</span>(
                    <span className={styles.st}>&quot;\\n\\n🎉 セッション完了&quot;</span>)
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}
                    <span className={styles.kw}>break</span>
                  </div>
                </code>
              </pre>
            </div>
            <div className={`${styles.ca} ${styles.caA}`}>
              <span className={styles.caI}>📌</span>
              <p>
                <strong>ファイルとリポジトリ：</strong> Cloud 環境と異なり、ファイル・GitHub
                リポジトリのマウントは Anthropic が管理しません。
                <code>metadata</code>{" "}
                でパスを渡してワーカー側で処理するか、コンテナイメージに組み込んでください。
              </p>
            </div>
            <div className={`${styles.ca} ${styles.caR}`}>
              <span className={styles.caI}>🚫</span>
              <p>
                <strong>制限：</strong> Self-hosted サンドボックスでは現在{" "}
                <strong>Memory（永続メモリ）</strong> はサポートされていません。
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div id="step5" className={styles.stepCard}>
            <div className={styles.stepNBadge}>5</div>
            <h3>モニタリングを設定する</h3>
            <div className={styles.stepTags}>
              <span className={`${styles.tag} ${styles.tg}`}>運用フェーズ</span>
              <span className={`${styles.tag} ${styles.tr}`}>組織 API キーで認証</span>
            </div>
            <div className={styles.cb}>
              <div className={styles.ch}>
                <div className={styles.dots}>
                  <div className={`${styles.d} ${styles.dr}`} />
                  <div className={`${styles.d} ${styles.dy}`} />
                  <div className={`${styles.d} ${styles.dg}`} />
                </div>
                <span className={styles.cl}>python</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`import os\nimport anthropic\n\nclient = anthropic.Anthropic()\n\nstats = client.beta.environments.work.stats(\n    os.environ["ANTHROPIC_ENVIRONMENT_ID"]\n)\nprint(f"depth={stats.depth} pending={stats.pending}")\nprint(f"workers_polling={stats.workers_polling}")`}
                />
              </div>
              <pre>
                <code>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>import</span> os
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>import</span> anthropic
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.cc}>
                      # ⚠️ 組織 API キー（ANTHROPIC_API_KEY）で認証すること
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cc}>
                      # ワーカーホストから呼び出さない（組織スコープ認証情報の漏洩リスク）
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    client = anthropic.<span className={styles.fn}>Anthropic</span>()
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    stats = client.beta.environments.work.<span className={styles.fn}>stats</span>(
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}os.environ[
                    <span className={styles.st}>&quot;ANTHROPIC_ENVIRONMENT_ID&quot;</span>]
                  </div>
                  <div className={styles.codeLine}>)</div>
                  <div className={styles.codeLine}>
                    <span className={styles.fn}>print</span>(f
                    <span className={styles.st}>
                      &quot;depth=&#123;stats.depth&#125; pending=&#123;stats.pending&#125;&quot;
                    </span>
                    )
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.fn}>print</span>(f
                    <span className={styles.st}>
                      &quot;workers_polling=&#123;stats.workers_polling&#125;&quot;
                    </span>
                    )
                  </div>
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Worker Patterns */}
        <section id="workers" className={styles.sec}>
          <h2>
            <span className={styles.secN}>6</span>ワーカーパターンの選び方
          </h2>
          <div className={styles.mw}>
            <div className={styles.mwT}>ワーカーパターン選択フロー</div>
            <MermaidDiagram chart={DIAG_WORKERS} />
          </div>

          <div className={styles.pcards}>
            <div className={styles.pcard}>
              <div className={styles.pcH}>
                <div className={styles.pcT}>Always-on（ant CLI）</div>
                <div className={styles.pcS}>最もシンプルなパターン</div>
              </div>
              <div className={styles.pcB}>
                <div className={styles.pr}>
                  <span className={styles.prK}>実装の複雑さ</span>
                  <span className={styles.prV}>
                    <span className={`${styles.badge} ${styles.bg}`}>最低</span>
                  </span>
                </div>
                <div className={styles.pr}>
                  <span className={styles.prK}>カスタムロジック</span>
                  <span className={styles.prV}>
                    <span className={`${styles.badge} ${styles.br}`}>❌</span>
                  </span>
                </div>
                <div className={styles.pr}>
                  <span className={styles.prK}>レイテンシ</span>
                  <span className={styles.prV}>最低</span>
                </div>
                <div className={styles.pr}>
                  <span className={styles.prK}>アイドルコスト</span>
                  <span className={styles.prV}>常時発生</span>
                </div>
                <div className={styles.pr}>
                  <span className={styles.prK}>向いているケース</span>
                  <span className={styles.prV}>開発・テスト</span>
                </div>
              </div>
            </div>

            <div className={styles.pcard}>
              <div className={styles.pcH}>
                <div className={styles.pcT}>Always-on（SDK）</div>
                <div className={styles.pcS}>カスタムロジック対応</div>
              </div>
              <div className={styles.pcB}>
                <div className={styles.pr}>
                  <span className={styles.prK}>実装の複雑さ</span>
                  <span className={styles.prV}>
                    <span className={`${styles.badge} ${styles.bv}`}>低い</span>
                  </span>
                </div>
                <div className={styles.pr}>
                  <span className={styles.prK}>カスタムロジック</span>
                  <span className={styles.prV}>
                    <span className={`${styles.badge} ${styles.bg}`}>✅</span>
                  </span>
                </div>
                <div className={styles.pr}>
                  <span className={styles.prK}>レイテンシ</span>
                  <span className={styles.prV}>低い</span>
                </div>
                <div className={styles.pr}>
                  <span className={styles.prK}>アイドルコスト</span>
                  <span className={styles.prV}>常時発生</span>
                </div>
                <div className={styles.pr}>
                  <span className={styles.prK}>向いているケース</span>
                  <span className={styles.prV}>一定負荷の本番</span>
                </div>
              </div>
            </div>

            <div className={styles.pcard}>
              <div className={styles.pcH}>
                <div className={styles.pcT}>Webhook-triggered（SDK）</div>
                <div className={styles.pcS}>コスト効率重視</div>
              </div>
              <div className={styles.pcB}>
                <div className={styles.pr}>
                  <span className={styles.prK}>実装の複雑さ</span>
                  <span className={styles.prV}>
                    <span className={`${styles.badge} ${styles.ba}`}>中程度</span>
                  </span>
                </div>
                <div className={styles.pr}>
                  <span className={styles.prK}>カスタムロジック</span>
                  <span className={styles.prV}>
                    <span className={`${styles.badge} ${styles.bg}`}>✅</span>
                  </span>
                </div>
                <div className={styles.pr}>
                  <span className={styles.prK}>レイテンシ</span>
                  <span className={styles.prV}>やや高い</span>
                </div>
                <div className={styles.pr}>
                  <span className={styles.prK}>アイドルコスト</span>
                  <span className={styles.prV}>
                    <span className={`${styles.badge} ${styles.bg}`}>ほぼゼロ</span>
                  </span>
                </div>
                <div className={styles.pr}>
                  <span className={styles.prK}>向いているケース</span>
                  <span className={styles.prV}>断続的な本番負荷</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Filesystem */}
        <section id="filesystem" className={styles.sec}>
          <h2>
            <span className={styles.secN}>7</span>サンドボックスのファイルシステム
          </h2>
          <div className={styles.tw}>
            <table>
              <thead>
                <tr>
                  <th>パス</th>
                  <th>説明</th>
                  <th>注意点</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.tl}>
                    <code>/workspace</code>
                  </td>
                  <td>デフォルト作業ディレクトリ。ツール実行の基点</td>
                  <td>
                    <code>--workdir</code> で変更した場合はシステムプロンプトも必ず更新
                  </td>
                </tr>
                <tr>
                  <td className={styles.tl}>
                    <code>/workspace/skills/&lt;name&gt;/</code>
                  </td>
                  <td>エージェントスキルの自動ダウンロード先</td>
                  <td>スキルを使う際はこのパスをプロンプトに記載</td>
                </tr>
                <tr>
                  <td className={styles.tl}>
                    <code>/mnt/session/outputs</code>
                  </td>
                  <td>セッションの最終出力ファイル置き場</td>
                  <td>ホストディレクトリをここにマウントしないと出力が取得できない</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`${styles.ca} ${styles.caA}`}>
            <span className={styles.caI}>⚠️</span>
            <p>
              <code>--workdir</code> をデフォルトの <code>/workspace</code>{" "}
              から変更した場合、Claudeがスキルを見つけられるようエージェントのシステムプロンプトも合わせて更新してください。
            </p>
          </div>
        </section>

        {/* 8. Security */}
        <section id="security" className={styles.sec}>
          <h2>
            <span className={styles.secN}>8</span>セキュリティ責任分担モデル
          </h2>

          {/* Security SVG */}
          <div className={styles.svgw}>
            <div className={styles.svgwT}>Shared Responsibility Model</div>
            <svg
              role="img"
              aria-label="セキュリティ責任分担モデル"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 840 420"
              style={{ width: "100%", maxWidth: "840px", display: "block", margin: "0 auto" }}
            >
              <title>セキュリティ責任分担モデル</title>
              <rect width="840" height="420" fill="#0f0f28" rx="8" />
              <text
                x="420"
                y="34"
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill="#e2e8f0"
              >
                セキュリティ責任分担モデル
              </text>

              {/* Left: Anthropic */}
              <rect
                x="16"
                y="50"
                width="398"
                height="356"
                rx="12"
                fill="#111138"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <text
                x="215"
                y="80"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#7dd3fc"
              >
                🛡 Anthropic が管理・保証
              </text>
              <line x1="32" y1="90" x2="396" y2="90" stroke="#1e3a5f" strokeWidth="1" />

              <circle cx="44" cy="114" r="5" fill="#3b82f6" />
              <text x="58" y="118" fontSize="11.5" fill="#93c5fd">
                コントロールプレーンのセキュリティ管理
              </text>
              <circle cx="44" cy="148" r="5" fill="#3b82f6" />
              <text x="58" y="152" fontSize="11.5" fill="#93c5fd">
                セッション・ワークキューの完全性
              </text>
              <circle cx="44" cy="182" r="5" fill="#3b82f6" />
              <text x="58" y="186" fontSize="11.5" fill="#93c5fd">
                マルチテナント分離の保証
              </text>
              <circle cx="44" cy="216" r="5" fill="#3b82f6" />
              <text x="58" y="220" fontSize="11.5" fill="#93c5fd">
                エージェントコンテキストの最小化
              </text>
              <circle cx="44" cy="250" r="5" fill="#3b82f6" />
              <text x="58" y="254" fontSize="11.5" fill="#93c5fd">
                API 認証の管理（ANTHROPIC_API_KEY）
              </text>
              <circle cx="44" cy="284" r="5" fill="#3b82f6" />
              <text x="58" y="288" fontSize="11.5" fill="#93c5fd">
                Claude Platform インフラの運用・保守
              </text>

              <line
                x1="32"
                y1="308"
                x2="396"
                y2="308"
                stroke="#1e3a5f"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              <text
                x="215"
                y="328"
                textAnchor="middle"
                fontSize="10.5"
                fill="#64748b"
                fontStyle="italic"
              >
                ⚠ Anthropic にできないこと
              </text>
              <text x="215" y="347" textAnchor="middle" fontSize="10" fill="#64748b">
                漏洩キーの即時無効化
              </text>
              <text x="215" y="364" textAnchor="middle" fontSize="10" fill="#64748b">
                ワーカービルドの検証
              </text>
              <text x="215" y="381" textAnchor="middle" fontSize="10" fill="#64748b">
                コンテナ内ツール間の分離
              </text>
              <text x="215" y="396" textAnchor="middle" fontSize="10" fill="#64748b">
                あなたの環境のデータ保持の強制
              </text>

              {/* Right: You */}
              <rect
                x="426"
                y="50"
                width="398"
                height="356"
                rx="12"
                fill="#1a1208"
                stroke="#d97706"
                strokeWidth="2"
              />
              <text
                x="625"
                y="80"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#fbbf24"
              >
                ⚠ あなたが担当・管理
              </text>
              <line x1="442" y1="90" x2="806" y2="90" stroke="#451a03" strokeWidth="1" />

              <circle cx="454" cy="114" r="5" fill="#d97706" />
              <text x="468" y="118" fontSize="11" fill="#fde68a">
                コンテナイメージ品質・ランタイム堅牢化
              </text>
              <text x="468" y="133" fontSize="9.5" fill="#64748b">
                非 root ユーザー / ケーパビリティ削除 / RO rootfs
              </text>

              <circle cx="454" cy="156" r="5" fill="#d97706" />
              <text x="468" y="160" fontSize="11" fill="#fde68a">
                ネットワークエグレス制御
              </text>
              <text x="468" y="175" fontSize="9.5" fill="#64748b">
                VPC / FW / 必要エンドポイントのみ許可
              </text>

              <circle cx="454" cy="198" r="5" fill="#d97706" />
              <text x="468" y="202" fontSize="11" fill="#fde68a">
                ANTHROPIC_ENVIRONMENT_KEY の保管・ローテーション
              </text>
              <text x="468" y="217" fontSize="9.5" fill="#64748b">
                シークレットマネージャーに保管・漏洩時は即ローテーション
              </text>

              <circle cx="454" cy="240" r="5" fill="#d97706" />
              <text x="468" y="244" fontSize="11" fill="#fde68a">
                信頼境界ごとの環境分離
              </text>
              <text x="468" y="259" fontSize="9.5" fill="#64748b">
                ユーザー / チームごとに別ワークスペース・環境を作成
              </text>

              <circle cx="454" cy="282" r="5" fill="#d97706" />
              <text x="468" y="286" fontSize="11" fill="#fde68a">
                ツール実行の最小権限適用
              </text>
              <text x="468" y="301" fontSize="9.5" fill="#64748b">
                プロセスユーザー権限・マウントディレクトリを最小化
              </text>

              <circle cx="454" cy="324" r="5" fill="#d97706" />
              <text x="468" y="328" fontSize="11" fill="#fde68a">
                ログ保持・セッションコンテンツ管理
              </text>
              <text x="468" y="343" fontSize="9.5" fill="#64748b">
                Anthropic は visibility なし・自社ポリシーに従う
              </text>

              <circle cx="454" cy="366" r="5" fill="#d97706" />
              <text x="468" y="370" fontSize="11" fill="#fde68a">
                コンプライアンス・監査対応
              </text>
              <text x="468" y="385" fontSize="9.5" fill="#64748b">
                ZDR / HIPAA BAA は Managed Agents 対象外
              </text>
            </svg>
          </div>

          <div className={styles.tw}>
            <table>
              <thead>
                <tr>
                  <th>Anthropic にできないこと</th>
                  <th>詳細と推奨対応</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.tl}>漏洩キーの即時無効化</td>
                  <td>
                    異常検出は可能だが瞬時の無効化は不可。<code>ANTHROPIC_ENVIRONMENT_KEY</code> は
                    DB パスワードと同等に扱い、漏洩時は<strong>即座にローテーション</strong>
                  </td>
                </tr>
                <tr>
                  <td className={styles.tl}>ワーカービルドの検証</td>
                  <td>
                    コンテナイメージを検査する仕組みがない。サプライチェーン攻撃はコントロールプレーンから検出不可
                  </td>
                </tr>
                <tr>
                  <td className={styles.tl}>コンテナ内ツール間の分離</td>
                  <td>
                    Anthropic
                    のセキュリティ境界はコンテナの外側で終わる。コンテナ内のツール分離はすべてあなたの責任
                  </td>
                </tr>
                <tr>
                  <td className={styles.tl}>データ保持の強制</td>
                  <td>
                    セッションコンテンツがワーカーに届いた後は Anthropic
                    のデータライフサイクル管理外
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 9. Providers */}
        <section id="providers" className={styles.sec}>
          <h2>
            <span className={styles.secN}>9</span>サンドボックスプロバイダー
          </h2>
          <p>
            Self-hosted Sandboxes
            は任意のプラットフォームで構築できますが、公式統合ガイドが提供されているプロバイダーがあります。
          </p>
          <div className={styles.provs}>
            <div className={styles.prov}>
              <div className={styles.provN}>☁️ Cloudflare</div>
              <div className={styles.provTags}>
                <span className={styles.provTag}>microVM</span>
                <span className={styles.provTag}>エグレス制御</span>
                <span className={styles.provTag}>スケール</span>
              </div>
              <div className={styles.provD}>
                microVM +
                軽量アイソレート。ゼロトラスト秘密注入、カスタマイズ可能なエグレスプロキシ、Cloudflare
                ネットワーク経由の内部サービス接続。
                <br />
                <em>採用: Amplitude（Design Agent）</em>
              </div>
              <Ext
                href="https://developers.cloudflare.com/sandbox/claude-managed-agents/"
                className={styles.provA}
              >
                → 統合ガイド
              </Ext>
            </div>
            <div className={styles.prov}>
              <div className={styles.provN}>🖥️ Daytona</div>
              <div className={styles.provTags}>
                <span className={styles.provTag}>ステートフル</span>
                <span className={styles.provTag}>長時間実行</span>
                <span className={styles.provTag}>SSH</span>
              </div>
              <div className={styles.provD}>
                長時間稼働・ステートフルなフルコンピュータ環境。SSH や認証済みプレビュー URL
                でアクセス。状態の一時停止・復元が可能。
                <br />
                <em>採用: Clay（Sculptor）</em>
              </div>
              <Ext
                href="https://www.daytona.io/docs/en/guides/claude/claude-managed-agents"
                className={styles.provA}
              >
                → 統合ガイド
              </Ext>
            </div>
            <div className={styles.prov}>
              <div className={styles.provN}>🤖 Modal</div>
              <div className={styles.provTags}>
                <span className={styles.provTag}>GPU 対応</span>
                <span className={styles.provTag}>サブ秒起動</span>
                <span className={styles.provTag}>大規模並列</span>
              </div>
              <div className={styles.provD}>
                AI ワークロード専用クラウド。サブ秒起動、GPU / CPU
                オンデマンド、数十万の並列サンドボックスに対応。
                <br />
                <em>採用: Mason、DoorDash</em>
              </div>
              <Ext
                href="https://github.com/modal-labs/claude-managed-agents-modal-sandbox"
                className={styles.provA}
              >
                → GitHub ガイド
              </Ext>
            </div>
            <div className={styles.prov}>
              <div className={styles.provN}>⚡ Vercel</div>
              <div className={styles.provTags}>
                <span className={styles.provTag}>VPC ピアリング</span>
                <span className={styles.provTag}>ミリ秒起動</span>
                <span className={styles.provTag}>資格情報注入</span>
              </div>
              <div className={styles.provD}>
                VM セキュリティ + VPC
                ピアリング。ミリ秒起動。認証情報はネットワーク境界で注入されるため、サンドボックス内に入らない。
                <br />
                <em>採用: Rogo</em>
              </div>
              <Ext
                href="https://vercel.com/kb/guide/run-claude-managed-agent-tools-with-vercel-sandbox"
                className={styles.provA}
              >
                → 統合ガイド
              </Ext>
            </div>
          </div>
        </section>

        {/* 10. MCP Tunnels */}
        <section id="mcp" className={styles.sec}>
          <h2>
            <span className={styles.secN}>10</span>MCP トンネルとの組み合わせ
          </h2>
          <p>
            Self-hosted Sandboxes と MCP Tunnels
            は独立した機能です。それぞれが別の「制御軸」を担います。
          </p>
          <div className={styles.tw}>
            <table>
              <thead>
                <tr>
                  <th>機能</th>
                  <th>制御対象</th>
                  <th>独立性</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.tl}>Self-hosted Sandboxes</td>
                  <td>
                    エージェントのコードが<strong>実行される場所</strong>
                  </td>
                  <td>単独で使用可能</td>
                </tr>
                <tr>
                  <td className={styles.tl}>MCP Tunnels</td>
                  <td>
                    Anthropic がプライベートネットワーク内の MCP サーバーに
                    <strong>到達する方法</strong>
                  </td>
                  <td>単独で使用可能</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.mw}>
            <div className={styles.mwT}>MCP トンネル組み合わせ判断フロー</div>
            <MermaidDiagram chart={DIAG_MCP} />
          </div>
          <div className={`${styles.ca} ${styles.caV}`}>
            <span className={styles.caI}>📌</span>
            <p>
              <strong>MCP Tunnels のステータス：</strong>
              現在リサーチプレビュー中です。アクセスには申請が必要:{" "}
              <Ext href="https://claude.com/form/claude-managed-agents">
                claude.com/form/claude-managed-agents
              </Ext>
            </p>
          </div>
        </section>

        {/* 11. Best Practices */}
        <section id="bestpractices" className={styles.sec}>
          <h2>
            <span className={styles.secN}>11</span>ベストプラクティス チェックリスト
          </h2>

          <h4>🔐 セキュリティ</h4>
          <ul className={styles.clList}>
            <li>
              <div className={styles.clBox} />
              ANTHROPIC_ENVIRONMENT_KEY を AWS Secrets Manager / GCP Secret Manager / Vault
              に保管した
            </li>
            <li>
              <div className={styles.clBox} />
              環境変数ファイル (.env) やコンテナイメージに環境キーを埋め込んでいない
            </li>
            <li>
              <div className={styles.clBox} />
              ワーカーホストに ANTHROPIC_API_KEY
              を設定していない（ツール呼び出しから漏洩するリスク）
            </li>
            <li>
              <div className={styles.clBox} />
              コンテナを非 root ユーザー（UID 1000 等）で実行している
            </li>
            <li>
              <div className={styles.clBox} />
              不要な Linux ケーパビリティを削除している（--cap-drop=ALL）
            </li>
            <li>
              <div className={styles.clBox} />
              読み取り専用ルートファイルシステムを検討した（--read-only）
            </li>
            <li>
              <div className={styles.clBox} />
              ネットワークエグレスをツールが必要とするエンドポイントのみに制限した
            </li>
            <li>
              <div className={styles.clBox} />
              信頼境界ごとに別々の環境（Environment）を作成した
            </li>
            <li>
              <div className={styles.clBox} />
              鍵漏洩が疑われた場合の即時ローテーション手順を整備した
            </li>
          </ul>

          <h4>⚡ パフォーマンス</h4>
          <ul className={styles.clList}>
            <li>
              <div className={styles.clBox} />
              work.stats で depth を監視し、バックログに応じてワーカーをスケールする仕組みを用意した
            </li>
            <li>
              <div className={styles.clBox} />
              workers_polling == 0 になったら死活アラートを発火するようにした
            </li>
            <li>
              <div className={styles.clBox} />
              断続的な負荷には Webhook-triggered パターンでコストを最適化した
            </li>
            <li>
              <div className={styles.clBox} />
              oldest_queued_at が古くなりすぎた場合のアラートを設定した
            </li>
          </ul>

          <h4>🛠️ 運用</h4>
          <ul className={styles.clList}>
            <li>
              <div className={styles.clBox} />
              /mnt/session/outputs にホストディレクトリをマウントして出力を取得できるようにした
            </li>
            <li>
              <div className={styles.clBox} />
              work.stop によるグレースフルシャットダウン手順を整備した
            </li>
            <li>
              <div className={styles.clBox} />
              --workdir を変更した場合、エージェントのシステムプロンプトも更新した
            </li>
            <li>
              <div className={styles.clBox} />
              モニタリング呼び出しはワーカーホストではなく別の運用ツールから行っている
            </li>
            <li>
              <div className={styles.clBox} />
              Memory は Self-hosted では現在未サポートであることを把握している
            </li>
          </ul>

          <h3>Docker セキュリティ設定例</h3>
          <div className={styles.cb}>
            <div className={styles.ch}>
              <div className={styles.dots}>
                <div className={`${styles.d} ${styles.dr}`} />
                <div className={`${styles.d} ${styles.dy}`} />
                <div className={`${styles.d} ${styles.dg}`} />
              </div>
              <span className={styles.cl}>dockerfile</span>
              <CodeCopyButton
                className={styles.codeCopy}
                text={`FROM ubuntu:24.04\n\n# 非 root ユーザーを作成\nRUN useradd -u 1000 -m -s /bin/bash agentuser\nRUN apt-get update && apt-get install -y bash curl unzip tar \\\n    && rm -rf /var/lib/apt/lists/*\n\nWORKDIR /workspace\nRUN chown agentuser:agentuser /workspace\nUSER agentuser`}
              />
            </div>
            <pre>
              <code>
                <div className={styles.codeLine}>
                  <span className={styles.kw}>FROM</span> ubuntu:24.04
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}># 非 root ユーザーを作成</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.kw}>RUN</span> useradd -u 1000 -m -s /bin/bash agentuser
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.kw}>RUN</span> apt-get update{" "}
                  <span className={styles.op}>&&</span> apt-get install -y bash curl unzip tar{" "}
                  <span className={styles.op}>\</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.op}>&&</span> rm -rf /var/lib/apt/lists/*
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.kw}>WORKDIR</span> /workspace
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.kw}>RUN</span> chown agentuser:agentuser /workspace
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.kw}>USER</span> agentuser
                </div>
              </code>
            </pre>
          </div>

          <div className={styles.cb}>
            <div className={styles.ch}>
              <div className={styles.dots}>
                <div className={`${styles.d} ${styles.dr}`} />
                <div className={`${styles.d} ${styles.dy}`} />
                <div className={`${styles.d} ${styles.dg}`} />
              </div>
              <span className={styles.cl}>bash</span>
              <CodeCopyButton
                className={styles.codeCopy}
                text={`docker run \\\n  --user 1000:1000 \\\n  --cap-drop ALL \\\n  --read-only \\\n  --tmpfs /tmp \\\n  --network restricted_network \\\n  -v /host/outputs:/mnt/session/outputs \\\n  -e ANTHROPIC_ENVIRONMENT_KEY="$(get_secret env_key)" \\\n  my-worker-image:latest`}
              />
            </div>
            <pre>
              <code>
                <div className={styles.codeLine}>
                  <span className={styles.kw}>docker</span> run \
                </div>
                <div className={styles.codeLine}>{"  "}--user 1000:1000 \</div>
                <div className={styles.codeLine}>{"  "}--cap-drop ALL \</div>
                <div className={styles.codeLine}>{"  "}--read-only \</div>
                <div className={styles.codeLine}>{"  "}--tmpfs /tmp \</div>
                <div className={styles.codeLine}>{"  "}--network restricted_network \</div>
                <div className={styles.codeLine}>{"  "}-v /host/outputs:/mnt/session/outputs \</div>
                <div className={styles.codeLine}>
                  {"  "}-e ANTHROPIC_ENVIRONMENT_KEY=
                  <span className={styles.st}>&quot;$(get_secret env_key)&quot;</span> \
                </div>
                <div className={styles.codeLine}>{"  "}my-worker-image:latest</div>
              </code>
            </pre>
          </div>
        </section>

        {/* 12. Monitoring */}
        <section id="monitoring" className={styles.sec}>
          <h2>
            <span className={styles.secN}>12</span>モニタリングと運用
          </h2>

          <h3>キューメトリクスの意味</h3>
          <div className={styles.tw}>
            <table>
              <thead>
                <tr>
                  <th>メトリクス</th>
                  <th>説明</th>
                  <th>活用方法</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.tl}>
                    <code>depth</code>
                  </td>
                  <td>キューで待機中のアイテム数</td>
                  <td>ワーカースケールアウトのトリガー</td>
                </tr>
                <tr>
                  <td className={styles.tl}>
                    <code>pending</code>
                  </td>
                  <td>ワーカーが取得・処理中のアイテム数</td>
                  <td>現在の処理負荷の把握</td>
                </tr>
                <tr>
                  <td className={styles.tl}>
                    <code>oldest_queued_at</code>
                  </td>
                  <td>最古の待機アイテムのタイムスタンプ（空なら null）</td>
                  <td>バックログアラートの基準</td>
                </tr>
                <tr>
                  <td className={styles.tl}>
                    <code>workers_polling</code>
                  </td>
                  <td>過去30秒でポーリングしたワーカー数</td>
                  <td>死活監視（0になったら要アラート）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>キュー監視 + オートスケールの例</h3>
          <div className={styles.cb}>
            <div className={styles.ch}>
              <div className={styles.dots}>
                <div className={`${styles.d} ${styles.dr}`} />
                <div className={`${styles.d} ${styles.dy}`} />
                <div className={`${styles.d} ${styles.dg}`} />
              </div>
              <span className={styles.cl}>python</span>
              <CodeCopyButton
                className={styles.codeCopy}
                text={`import os\nfrom datetime import datetime, timezone\nimport anthropic\n\nclient = anthropic.Anthropic()\n\ndef check_queue_and_scale():\n    stats = client.beta.environments.work.stats(\n        os.environ["ANTHROPIC_ENVIRONMENT_ID"]\n    )\n    print(f"depth={stats.depth} pending={stats.pending} workers={stats.workers_polling}")\n\n    if stats.depth > 10:\n        print(f"Scaling up: launching {stats.depth // 5} workers")\n\n    if stats.workers_polling == 0:\n        print("ALERT: No workers polling!")\n\n    if stats.oldest_queued_at:\n        age = (datetime.now(timezone.utc) - stats.oldest_queued_at).total_seconds() / 60\n        if age > 10:\n            print(f"Backlog: oldest item is {age:.1f} min old")`}
              />
            </div>
            <pre>
              <code>
                <div className={styles.codeLine}>
                  <span className={styles.kw}>import</span> os
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.kw}>from</span> datetime{" "}
                  <span className={styles.kw}>import</span> datetime, timezone
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.kw}>import</span> anthropic
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    # ⚠️ 組織 API キーで認証・ワーカーホスト外から実行
                  </span>
                </div>
                <div className={styles.codeLine}>
                  client = anthropic.<span className={styles.fn}>Anthropic</span>()
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.kw}>def</span>{" "}
                  <span className={styles.fn}>check_queue_and_scale</span>():
                </div>
                <div className={styles.codeLine}>
                  {"    "}stats = client.beta.environments.work.
                  <span className={styles.fn}>stats</span>(
                </div>
                <div className={styles.codeLine}>
                  {"        "}os.environ[
                  <span className={styles.st}>&quot;ANTHROPIC_ENVIRONMENT_ID&quot;</span>]
                </div>
                <div className={styles.codeLine}>{"    "})</div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.fn}>print</span>(f
                  <span className={styles.st}>
                    &quot;depth=&#123;stats.depth&#125; pending=&#123;stats.pending&#125; &quot;
                  </span>
                </div>
                <div className={styles.codeLine}>
                  {"          "}f
                  <span className={styles.st}>
                    &quot;workers=&#123;stats.workers_polling&#125;&quot;
                  </span>
                  )
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.cc}># depth &gt; 10 ならワーカーをスケールアウト</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.kw}>if</span> stats.depth{" "}
                  <span className={styles.op}>&gt;</span> <span className={styles.nm}>10</span>:
                </div>
                <div className={styles.codeLine}>
                  {"        "}
                  <span className={styles.fn}>print</span>(f
                  <span className={styles.st}>
                    &quot;Scaling up: launching &#123;stats.depth {"//"} 5&#125; workers&quot;
                  </span>
                  )
                </div>
                <div className={styles.codeLine}>
                  {"        "}
                  <span className={styles.cc}># launch_workers(count=stats.depth {"//"} 5)</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.cc}># workers_polling == 0 は死活アラート</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.kw}>if</span> stats.workers_polling =={" "}
                  <span className={styles.nm}>0</span>:
                </div>
                <div className={styles.codeLine}>
                  {"        "}
                  <span className={styles.fn}>print</span>(
                  <span className={styles.st}>&quot;ALERT: No workers polling!&quot;</span>)
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.cc}># バックログアラート</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.kw}>if</span> stats.oldest_queued_at:
                </div>
                <div className={styles.codeLine}>
                  {"        "}age = (datetime.<span className={styles.fn}>now</span>(timezone.utc) -
                  stats.oldest_queued_at).<span className={styles.fn}>total_seconds</span>() /{" "}
                  <span className={styles.nm}>60</span>
                </div>
                <div className={styles.codeLine}>
                  {"        "}
                  <span className={styles.kw}>if</span> age <span className={styles.op}>&gt;</span>{" "}
                  <span className={styles.nm}>10</span>:
                </div>
                <div className={styles.codeLine}>
                  {"        "}
                  {"    "}
                  <span className={styles.fn}>print</span>(f
                  <span className={styles.st}>
                    &quot;Backlog: oldest item is &#123;age:.1f&#125; min old&quot;
                  </span>
                  )
                </div>
              </code>
            </pre>
          </div>

          <h3>グレースフルシャットダウン</h3>
          <div className={styles.cb}>
            <div className={styles.ch}>
              <div className={styles.dots}>
                <div className={`${styles.d} ${styles.dr}`} />
                <div className={`${styles.d} ${styles.dy}`} />
                <div className={`${styles.d} ${styles.dg}`} />
              </div>
              <span className={styles.cl}>python</span>
              <CodeCopyButton
                className={styles.codeCopy}
                text={`import os\nimport anthropic\n\nclient = anthropic.Anthropic()\n\nwork = client.beta.environments.work.stop(\n    os.environ["ANTHROPIC_WORK_ID"],\n    environment_id=os.environ["ANTHROPIC_ENVIRONMENT_ID"],\n)\nprint(f"State: {work.state}")`}
              />
            </div>
            <pre>
              <code>
                <div className={styles.codeLine}>
                  <span className={styles.kw}>import</span> os
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.kw}>import</span> anthropic
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  client = anthropic.<span className={styles.fn}>Anthropic</span>()
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    # グレースフルシャットダウン（現在のツール呼び出し完了後に停止）
                  </span>
                </div>
                <div className={styles.codeLine}>
                  work = client.beta.environments.work.<span className={styles.fn}>stop</span>(
                </div>
                <div className={styles.codeLine}>
                  {"    "}os.environ[
                  <span className={styles.st}>&quot;ANTHROPIC_WORK_ID&quot;</span>],{"   "}
                  <span className={styles.cc}>
                    # 対象ワークアイテム ID（ワーカーホストで自動設定されない）
                  </span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}environment_id=os.environ[
                  <span className={styles.st}>&quot;ANTHROPIC_ENVIRONMENT_ID&quot;</span>],
                </div>
                <div className={styles.codeLine}>)</div>
                <div className={styles.codeLine}>
                  <span className={styles.fn}>print</span>(f
                  <span className={styles.st}>&quot;State: &#123;work.state&#125;&quot;</span>)
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}># 即時強制終了: force=True を追加</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    # client.beta.environments.work.stop(..., force=True)
                  </span>
                </div>
              </code>
            </pre>
          </div>
        </section>

        {/* 13. Sources */}
        <section id="sources" className={styles.sec}>
          <h2>
            <span className={styles.secN}>13</span>参考リソース（ソース URL）
          </h2>

          <h4>公式ドキュメント</h4>
          <div className={styles.srcGrid}>
            <Ext
              href="https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>📖</span>
              <div>
                <div className={styles.srcTit}>Self-hosted Sandboxes 統合ガイド</div>
                <div className={styles.srcUrl}>
                  platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes
                </div>
              </div>
            </Ext>
            <Ext
              href="https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-security"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>🔒</span>
              <div>
                <div className={styles.srcTit}>セキュリティモデル（責任分担）</div>
                <div className={styles.srcUrl}>
                  platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-security
                </div>
              </div>
            </Ext>
            <Ext
              href="https://platform.claude.com/docs/en/managed-agents/overview"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>📋</span>
              <div>
                <div className={styles.srcTit}>Managed Agents 概要</div>
                <div className={styles.srcUrl}>
                  platform.claude.com/docs/en/managed-agents/overview
                </div>
              </div>
            </Ext>
            <Ext
              href="https://platform.claude.com/docs/en/managed-agents/quickstart"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>🚀</span>
              <div>
                <div className={styles.srcTit}>クイックスタート</div>
                <div className={styles.srcUrl}>
                  platform.claude.com/docs/en/managed-agents/quickstart
                </div>
              </div>
            </Ext>
            <Ext
              href="https://platform.claude.com/docs/en/managed-agents/sessions"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>📡</span>
              <div>
                <div className={styles.srcTit}>セッションの開始</div>
                <div className={styles.srcUrl}>
                  platform.claude.com/docs/en/managed-agents/sessions
                </div>
              </div>
            </Ext>
            <Ext
              href="https://platform.claude.com/docs/en/api/beta/environments/work"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>⚙️</span>
              <div>
                <div className={styles.srcTit}>Environments Work API リファレンス</div>
                <div className={styles.srcUrl}>
                  platform.claude.com/docs/en/api/beta/environments/work
                </div>
              </div>
            </Ext>
            <Ext
              href="https://platform.claude.com/docs/en/manage-claude/api-and-data-retention"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>🗄️</span>
              <div>
                <div className={styles.srcTit}>API データ保持ポリシー</div>
                <div className={styles.srcUrl}>
                  platform.claude.com/docs/en/manage-claude/api-and-data-retention
                </div>
              </div>
            </Ext>
            <Ext
              href="https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>☁️</span>
              <div>
                <div className={styles.srcTit}>Claude Platform on AWS</div>
                <div className={styles.srcUrl}>
                  platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws
                </div>
              </div>
            </Ext>
            <Ext
              href="https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>🔗</span>
              <div>
                <div className={styles.srcTit}>MCP Tunnels 概要</div>
                <div className={styles.srcUrl}>
                  platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview
                </div>
              </div>
            </Ext>
          </div>

          <h4>公式ブログ</h4>
          <div className={styles.srcGrid}>
            <Ext
              href="https://claude.com/blog/claude-managed-agents-updates"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>📰</span>
              <div>
                <div className={styles.srcTit}>
                  Self-hosted Sandboxes &amp; MCP Tunnels 発表（2026年5月19日）
                </div>
                <div className={styles.srcUrl}>claude.com/blog/claude-managed-agents-updates</div>
              </div>
            </Ext>
            <Ext href="https://platform.claude.com/" className={styles.srcA}>
              <span className={styles.srcIcon}>🖥️</span>
              <div>
                <div className={styles.srcTit}>Claude Console</div>
                <div className={styles.srcUrl}>platform.claude.com</div>
              </div>
            </Ext>
          </div>

          <h4>プロバイダー統合ガイド</h4>
          <div className={styles.srcGrid}>
            <Ext
              href="https://developers.cloudflare.com/sandbox/claude-managed-agents/"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>☁️</span>
              <div>
                <div className={styles.srcTit}>Cloudflare 統合ガイド</div>
                <div className={styles.srcUrl}>
                  developers.cloudflare.com/sandbox/claude-managed-agents/
                </div>
              </div>
            </Ext>
            <Ext
              href="https://www.daytona.io/docs/en/guides/claude/claude-managed-agents"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>🖥️</span>
              <div>
                <div className={styles.srcTit}>Daytona 統合ガイド</div>
                <div className={styles.srcUrl}>
                  daytona.io/docs/en/guides/claude/claude-managed-agents
                </div>
              </div>
            </Ext>
            <Ext
              href="https://github.com/modal-labs/claude-managed-agents-modal-sandbox"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>🤖</span>
              <div>
                <div className={styles.srcTit}>Modal 統合ガイド（GitHub）</div>
                <div className={styles.srcUrl}>
                  github.com/modal-labs/claude-managed-agents-modal-sandbox
                </div>
              </div>
            </Ext>
            <Ext
              href="https://vercel.com/kb/guide/run-claude-managed-agent-tools-with-vercel-sandbox"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>⚡</span>
              <div>
                <div className={styles.srcTit}>Vercel 統合ガイド</div>
                <div className={styles.srcUrl}>
                  vercel.com/kb/guide/run-claude-managed-agent-tools-with-vercel-sandbox
                </div>
              </div>
            </Ext>
          </div>

          <h4>サンプルコード</h4>
          <div className={styles.srcGrid}>
            <Ext
              href="https://github.com/anthropics/claude-cookbooks/tree/main/managed_agents/self_hosted_sandboxes"
              className={styles.srcA}
            >
              <span className={styles.srcIcon}>🍳</span>
              <div>
                <div className={styles.srcTit}>Claude Cookbooks（Self-hosted Sandboxes）</div>
                <div className={styles.srcUrl}>
                  github.com/anthropics/claude-cookbooks/tree/main/managed_agents/self_hosted_sandboxes
                </div>
              </div>
            </Ext>
            <Ext href="https://claude.com/form/claude-managed-agents" className={styles.srcA}>
              <span className={styles.srcIcon}>📝</span>
              <div>
                <div className={styles.srcTit}>MCP Tunnels アクセス申請</div>
                <div className={styles.srcUrl}>claude.com/form/claude-managed-agents</div>
              </div>
            </Ext>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>
            📌 本ガイドは公式ドキュメント（取得日: 2026年6月10日）を基に作成しています。Claude
            Managed Agents は Public Beta のため、API
            仕様は予告なく変更される可能性があります。最新情報は
            <Ext href="https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes">
              公式ドキュメント
            </Ext>
            をご確認ください。
          </p>
        </footer>
      </main>
    </div>
  );
}
