import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Google Sandbox 完全ガイド 2026 — 初学者向け",
  description:
    "AIエージェント・API・コンテナ・C/C++・ブラウザ、それぞれの領域で Google が推奨する安全なサンドボックス技術（実行の箱）を、初学者でも理解できるよう図解とステップで解説します。",
};

// ── MERMAID DIAGRAMS ──
const DIAG_1 = `graph TD
    A["⚠️ 危険なコード<br/>(AI生成 / ユーザー入力)"] --> B{"サンドボックス<br/>あり？"}
    B -->|"なし"| C["💀 ホストOS侵害<br/>データ漏洩 / 横断攻撃"]
    B -->|"あり"| D["🔒 隔離環境内で実行<br/>問題は箱の中に封じ込め"]
    D --> E["✅ ホストOS・他データは安全"]

    subgraph 多層防御["Googleの三層防御"]
        L1["🌐 L1 ネットワーク分離<br/>（デフォルト拒否 Network Policy）"]
        L2["🖥️ L2 カーネル分離<br/>（gVisor / Seccomp-bpf）"]
        L3["🔑 L3 ID・権限分離<br/>（Workload Identity / IAM）"]
        L1 --> L2 --> L3
    end`;

const DIAG_2 = `flowchart TD
    START(["🔍 何を実行したいか？"]) --> Q1

    Q1{"AIエージェントが<br/>生成したコード？"} -->|"Yes"| Q2
    Q1 -->|"No"| Q3

    Q2{"インフラを<br/>自分で管理したい？"} -->|"Kubernetes で管理"| R1
    Q2 -->|"API を呼ぶだけでOK"| R2

    Q3{"C/C++ライブラリを<br/>安全に使いたい？"} -->|"Yes"| R4
    Q3 -->|"No"| Q4

    Q4{"多数ユーザーの<br/>コンテナを隔離？"} -->|"Yes"| R3
    Q4 -->|"No"| Q5

    Q5{"ブラウザ内の<br/>JavaScript実行？"} -->|"Yes"| R5
    Q5 -->|"No"| R6

    R1["✅ GKE Agent Sandbox<br/>300 sandboxes/秒 + Pod Snapshot"]
    R2["✅ Gemini Code Execution<br/>API 1 行で Python 実行"]
    R3["✅ gVisor / GKE Sandbox<br/>RuntimeClass: gvisor"]
    R4["✅ Sandbox2 / SAPI<br/>seccomp-bpf + Namespaces"]
    R5["✅ V8 Sandbox<br/>Chrome が自動適用"]
    R6["💬 ユースケースを確認<br/>→ セキュリティチームに相談"]

    style R1 fill:#152036,stroke:#4285F4
    style R2 fill:#152036,stroke:#34A853
    style R3 fill:#152036,stroke:#FF6D00
    style R4 fill:#152036,stroke:#FBBC04
    style R5 fill:#152036,stroke:#9C27B0`;

const DIAG_3 = `flowchart TB
    subgraph FW["AIフレームワーク（ADK / LangChain）"]
        CLAIM["SandboxClaim<br/>（実行環境リクエスト）"]
    end

    subgraph CTRL["GKE Agent Sandbox Controller"]
        TMPL["SandboxTemplate<br/>セキュリティ設計図"]
        POOL["SandboxWarmPool<br/>事前起動プール（常時N個待機）"]
        SB["Sandbox Pod<br/>（gVisor RuntimeClass）"]
    end

    subgraph STORAGE["Pod Snapshot（GCS）"]
        SNAP["スナップショット<br/>実行状態を保存・復元"]
    end

    CLAIM -->|"1. テンプレート参照"| TMPL
    TMPL -->|"2. 事前起動"| POOL
    CLAIM -->|"3. Poolから即割り当て（<1秒）"| SB
    SB -->|"4. コード実行（gVisor分離）"| SB
    SB -.->|"5. 状態を保存"| SNAP
    SNAP -.->|"6. コールドスタート時に復元"| POOL`;

const DIAG_4 = `sequenceDiagram
    actor User as あなた
    participant API as Gemini API
    participant Model as Geminiモデル
    participant Sandbox as マネージドサンドボックス

    User->>API: 「最初の50個の素数の合計は？」<br/>tools: [codeExecution]
    API->>Model: ツール有効化状態でリクエスト転送
    Model->>Model: 問題を分析し Python コードを生成
    Model->>Sandbox: コード送信（executableCode）
    Sandbox->>Sandbox: 安全な環境で Python 実行（最大30秒）
    Sandbox-->>Model: 実行結果（codeExecutionResult）
    Model->>Model: 結果を検証・必要なら再試行
    Model-->>API: 最終回答（テキスト + 実行済みコード）
    API-->>User: 回答を返却
    Note over User,Sandbox: 💡注: 実行結果の検証は自動で行われます`;

const DIAG_5 = `flowchart LR
    A["📊 分析タスク"] --> B{"ファイルが<br/>必要か？"}
    B -->|"不要"| C["Code Execution<br/>単体で解決"]
    B -->|"必要"| D["Function Calling で<br/>ファイル取得を実装"]
    D --> C
    C --> E{"30秒以内に<br/>収まるか？"}
    E -->|"Yes"| F["✅ そのまま実行"]
    E -->|"No"| G["複数ターンに<br/>処理を分割"]
    G --> F`;

const DIAG_6 = `graph TB
    subgraph normal["通常のコンテナ（高速だが隔離が弱い）"]
        APP1["アプリ"] -->|"syscall直接発行"| HOST_KERNEL["ホストOS カーネル"]
        HOST_KERNEL --> RISK["⚠️ カーネル脆弱性で<br/>ホスト侵害リスク"]
    end

    subgraph gvisor["gVisor コンテナ（やや遅いが強力に隔離）"]
        APP2["アプリ"] -->|"1. syscall 発行"| SENTRY["Sentry（疑似カーネル）<br/>Linux API をユーザー空間で再実装"]
        SENTRY -->|"2. ファイルI/Oのみ委譲"| GOFER["Gofer（I/O プロキシ）"]
        SENTRY -->|"3. 最小限の syscall のみ"| HOST_KERNEL2["ホストOS カーネル"]
        GOFER -->|"4. 検証済みI/Oのみ"| HOST_KERNEL2
        HOST_KERNEL2 --> SAFE["✅ ホストOS は保護"]
    end

    RISK ~~~ APP2`;

const DIAG_7 = `flowchart LR
    subgraph TRUSTED["信頼済みプロセス（Executor）"]
        HC["メインアプリ<br/>（C++ コード）"]
        PB["PolicyBuilder<br/>syscall 許可リスト設計"]
        IPC["IPC Layer<br/>TLV / FD 受け渡し"]
    end

    subgraph SANDBOX["サンドボックス環境（Sandboxee）"]
        SBEE["信頼されないライブラリ<br/>（例: 古い zlib / libpng）"]
        subgraph POLICY["適用済みポリシー"]
            SC["seccomp-bpf<br/>syscall フィルタ"]
            NS["Linux Namespaces<br/>PID / Net / Mount"]
        end
    end

    HC -->|"1. 起動・ポリシー適用"| PB
    PB -->|"2. seccomp インストール"| SBEE
    HC <-->|"3. データ交換（RPC）"| IPC
    IPC <-->|"4. TLV / FD"| SBEE
    SBEE -->|"5. syscall 発行"| SC
    SC -->|"許可外 → SIGKILL"| HC`;

const DIAG_8 = `graph TB
    subgraph PROC["Chrome レンダラープロセス（64bit）"]
        subgraph SANDBOX["V8 Sandbox 保護領域（最大 1TB 仮想アドレス）"]
            HEAP["JavaScript Heap<br/>全JSオブジェクト"]
            PTR["ポインタ圧縮（32bit）<br/>= sandbox_base + 32bit_offset<br/>→ sandbox 外は参照不可"]
            GUARD_L["Guard Region（左境界）"]
            GUARD_R["Guard Region（右境界）"]
        end
        subgraph TABLES["サンドボックス外テーブル（改ざん保護）"]
            EPT["ExternalPointerTable (EPT)<br/>外部ポインタの間接テーブル"]
            TPT["TrustedPointerTable (TPT)<br/>JITコードメタデータ"]
        end
        OTHER["ブラウザプロセスの<br/>他のメモリ（DOM 等）"]
    end

    HEAP -->|"外部参照"| EPT
    EPT -->|"検証済みアドレスのみ解決"| OTHER
    GUARD_L & GUARD_R -->|"境界外アクセスをブロック"| OTHER

    style SANDBOX fill:#1a0d2e,stroke:#9C27B0
    style GUARD_L fill:#2e0d0d,stroke:#EA4335
    style GUARD_R fill:#2e0d0d,stroke:#EA4335`;

interface ExtProps {
  href: string;
  children: React.ReactNode;
}

/**
 * Renders an external anchor link with standard target and security attributes.
 */
function Ext({ href, children }: ExtProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const TOC_ITEMS = [
  { id: "intro", label: "はじめに" },
  { id: "selector", label: "選択ガイド" },
  { id: "s1", label: "GKE Agent Sandbox" },
  { id: "s2", label: "Gemini Code Execution" },
  { id: "s3", label: "gVisor / GKE Sandbox" },
  { id: "s4", label: "Sandbox2 / SAPI" },
  { id: "s5", label: "V8 Sandbox" },
  { id: "s6", label: "Privacy Sandbox ⚠️" },
  { id: "compare", label: "技術比較表" },
  { id: "glossary", label: "用語集" },
  { id: "resources", label: "公式リンク集" },
] as const;

export default function GoogleSandboxBestPracticesPage() {
  return (
    <>
      <div className={styles.prog} />

      <div className={styles.wrap}>
        {/* HERO */}
        <header className={styles.hero}>
          <div className={styles.heroEyebrow}>Google Sandbox Best Practices 2026</div>
          <h1 className={styles.heroTitle}>
            Google の<span> サンドボックス</span>技術
            <br />
            完全ガイド
          </h1>
          <p className={styles.heroSub}>
            AIエージェント・API・コンテナ・C/C++・ブラウザ、それぞれの領域で Google
            が推奨する安全な「実行の箱」を、初学者でも理解できるよう図解とステップで解説します。
          </p>
          <div className={styles.heroChips}>
            <span
              className={styles.chip}
              style={{
                color: "var(--c1)",
                borderColor: "rgba(66, 133, 244, 0.35)",
                background: "rgba(66, 133, 244, 0.08)",
              }}
            >
              <span className={styles.chipDot} style={{ background: "var(--c1)" }} />
              AIエージェント
            </span>
            <span
              className={styles.chip}
              style={{
                color: "var(--c2)",
                borderColor: "rgba(52, 168, 83, 0.35)",
                background: "rgba(52, 168, 83, 0.08)",
              }}
            >
              <span className={styles.chipDot} style={{ background: "var(--c2)" }} />
              LLM / API
            </span>
            <span
              className={styles.chip}
              style={{
                color: "var(--c3)",
                borderColor: "rgba(255, 109, 0, 0.35)",
                background: "rgba(255, 109, 0, 0.08)",
              }}
            >
              <span className={styles.chipDot} style={{ background: "var(--c3)" }} />
              コンテナ
            </span>
            <span
              className={styles.chip}
              style={{
                color: "var(--c4)",
                borderColor: "rgba(251, 188, 4, 0.35)",
                background: "rgba(251, 188, 4, 0.08)",
              }}
            >
              <span className={styles.chipDot} style={{ background: "var(--c4)" }} />
              C/C++
            </span>
            <span
              className={styles.chip}
              style={{
                color: "var(--c5)",
                borderColor: "rgba(156, 39, 176, 0.35)",
                background: "rgba(156, 39, 176, 0.08)",
              }}
            >
              <span className={styles.chipDot} style={{ background: "var(--c5)" }} />
              ブラウザ
            </span>
          </div>
        </header>

        {/* TOC */}
        <nav className={styles.toc} aria-label="目次">
          <div className={styles.tocTitle}>目次</div>
          <ol>
            {TOC_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        {/* INTRO */}
        <section className={styles.sec} id="intro">
          <div className={styles.secEyebrow} style={{ color: "var(--c1)" }}>
            CHAPTER 01 — OVERVIEW
          </div>
          <h2 className={styles.secTitle}>サンドボックスとは何か？</h2>
          <p className={styles.secLead}>
            「砂場（サンドボックス）」のように隔離された環境で怪しいコードを実行し、万が一問題が起きてもシステム全体に影響が及ばないようにする仕組みです。
          </p>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <div className={styles.calloutIcon}>💡</div>
            <div className={styles.calloutBody}>
              <strong>子どもの砂場のイメージ</strong>
              <br />
              子どもが砂場で遊んでも、砂が外に出ないように囲いがあります。サンドボックスも同じで、プログラムが「囲いの中」だけで動き、外（ホストOS・他のデータ）には触れられません。
            </div>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c1)" } as React.CSSProperties}
          >
            Google の 6 つのサンドボックス技術 — クイックリファレンス
          </div>
          <table className={styles.mdTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>名称</th>
                <th>領域</th>
                <th>主要技術</th>
                <th>2026年ステータス</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <strong style={{ color: "var(--c1)" }}>GKE Agent Sandbox</strong>
                </td>
                <td>AIエージェント</td>
                <td>gVisor + Pod Snapshot</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>✅ GA（2026年5月〜）</span>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <strong style={{ color: "var(--c2)" }}>Gemini Code Execution</strong>
                </td>
                <td>AI / LLM API</td>
                <td>マネージドLinux環境</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>✅ GA</span>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>
                  <strong style={{ color: "var(--c3)" }}>gVisor / GKE Sandbox</strong>
                </td>
                <td>コンテナ</td>
                <td>ユーザー空間カーネル</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>✅ GA</span>
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>
                  <strong style={{ color: "var(--c4)" }}>Sandbox2 / SAPI</strong>
                </td>
                <td>C/C++ アプリ</td>
                <td>Seccomp-bpf / Namespaces</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>✅ GA（OSS）</span>
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td>
                  <strong style={{ color: "var(--c5)" }}>V8 Sandbox</strong>
                </td>
                <td>ブラウザ JS</td>
                <td>メモリ空間分離</td>
                <td>
                  <span style={{ color: "#fbbc04", fontWeight: 700 }}>🔄 開発継続中</span>
                </td>
              </tr>
              <tr>
                <td>6</td>
                <td>
                  <strong style={{ color: "var(--c6)" }}>Privacy Sandbox</strong>
                </td>
                <td>Web 広告</td>
                <td>デバイス内暗号化API</td>
                <td>
                  <span style={{ color: "#ea4335", fontWeight: 700 }}>⛔ 2025年10月廃止</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c1)" } as React.CSSProperties}
          >
            サンドボックスが必要な理由（3 層防御モデル）
          </div>
          <div
            className={styles.diagramWrap}
            style={{ "--diag-w": "650px" } as React.CSSProperties}
          >
            <div className={styles.preMermaid}>
              <MermaidDiagram chart={DIAG_1} />
            </div>
            <p className={styles.diagramLabel}>
              図1: サンドボックスが防ぐ攻撃と Google の三層防御モデル
            </p>
          </div>
        </section>

        {/* SELECTOR */}
        <section className={styles.sec} id="selector">
          <div className={styles.secEyebrow} style={{ color: "var(--c2)" }}>
            CHAPTER 02 — DECISION GUIDE
          </div>
          <h2 className={styles.secTitle}>どのサンドボックスを選ぶべきか？</h2>
          <p className={styles.secLead}>
            実行したいものの種類で最適技術が決まります。以下のフローチャートで自分のユースケースを確認してください。
          </p>
          <div
            className={`${styles.diagramWrap} ${styles.diagramScrollable}`}
            style={{ "--diag-min-w": "900px" } as React.CSSProperties}
          >
            <div className={styles.preMermaid}>
              <MermaidDiagram chart={DIAG_2} />
            </div>
            <p className={styles.diagramLabel}>
              図2: ユースケース別サンドボックス選択フローチャート
            </p>
          </div>
        </section>

        {/* S1: GKE AGENT SANDBOX */}
        <section className={styles.sec} id="s1">
          <div className={styles.secEyebrow} style={{ color: "var(--c1)" }}>
            CHAPTER 03 — AI AGENTS
          </div>
          <h2 className={styles.secTitle}>GKE Agent Sandbox</h2>

          <div className={styles.sbHeader} style={{ borderLeftColor: "var(--c1)" }}>
            <div
              className={styles.sbIcon}
              style={{ background: "rgba(66, 133, 244, 0.15)", color: "var(--c1)" }}
            >
              🤖
            </div>
            <div className={styles.sbHeaderMeta}>
              <div className={styles.sbName}>GKE Agent Sandbox</div>
              <div className={styles.sbDomain}>
                領域: AIエージェント &nbsp;|&nbsp; 主要技術: gVisor + Pod Snapshot
              </div>
              <div className={styles.sbDesc}>
                AIエージェントが生成した「信頼できないコード」をKubernetes上で安全・高速に実行するための専用インフラ。
                <br />
                1秒未満のレイテンシで <strong>300サンドボックス/秒</strong> のスループットを実現。
              </div>
            </div>
            <div>
              <span
                className={styles.statusBadge}
                style={{
                  background: "rgba(52, 168, 83, 0.12)",
                  color: "#34a853",
                  border: "1px solid rgba(52, 168, 83, 0.3)",
                }}
              >
                <span className={styles.statusPulse} style={{ background: "#34a853" }} />
                GA
              </span>
            </div>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c1)" } as React.CSSProperties}
          >
            仕組みの全体像
          </div>
          <div
            className={`${styles.diagramWrap} ${styles.diagramScrollable}`}
            style={{ "--diag-min-w": "800px" } as React.CSSProperties}
          >
            <div className={styles.preMermaid}>
              <MermaidDiagram chart={DIAG_3} />
            </div>
            <p className={styles.diagramLabel}>図3: GKE Agent Sandbox の CRD 連携フロー</p>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c1)" } as React.CSSProperties}
          >
            4 つの主要 CRD の役割
          </div>
          <table className={styles.mdTable}>
            <thead>
              <tr>
                <th>CRD名</th>
                <th>例え</th>
                <th>主な役割</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong style={{ color: "var(--c1)" }}>SandboxTemplate</strong>
                </td>
                <td>「箱の設計図」</td>
                <td>
                  Podのリソース・セキュリティポリシー・ネットワークルールを定義する再利用可能な青写真
                </td>
              </tr>
              <tr>
                <td>
                  <strong style={{ color: "var(--c1)" }}>SandboxWarmPool</strong>
                </td>
                <td>「予備の箱を常備」</td>
                <td>事前起動済みPodを常時N個確保し、コールドスタートを&lt;1秒に短縮</td>
              </tr>
              <tr>
                <td>
                  <strong style={{ color: "var(--c1)" }}>SandboxClaim</strong>
                </td>
                <td>「箱の引き取り票」</td>
                <td>AIフレームワークがPoolに「箱を1つ貸してください」とリクエストするリソース</td>
              </tr>
              <tr>
                <td>
                  <strong style={{ color: "var(--c1)" }}>Pod Snapshot</strong>
                </td>
                <td>「中断・再開ボタン」</td>
                <td>実行中のPod状態をGCSに保存し、次回起動時に即座に復元してアイドルコスト削減</td>
              </tr>
            </tbody>
          </table>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c1)" } as React.CSSProperties}
          >
            SandboxTemplate の最小設定例
          </div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLabel}>YAML — SandboxTemplate</div>
            <pre className="language-yaml">
              {`apiVersion: extensions.agents.x-k8s.io/v1alpha1
kind: SandboxTemplate
metadata:
  name: python-agent-template
spec:
  networkPolicy:
    egress:
      - ports:
          - port: 443       # HTTPS のみ許可（デフォルト拒否）
            protocol: TCP
  podTemplate:
    spec:
      runtimeClassName: gvisor    # gVisor で実行（必須）
      serviceAccountName: agent-sa
      containers:
      - name: executor
        image: python:3.12-slim
        resources:
          limits:
            cpu: "2"
            memory: "4Gi"
        securityContext:
          runAsNonRoot: true          # root での実行を禁止
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true`}
            </pre>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c1)" } as React.CSSProperties}
          >
            セットアップ手順
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div
                className={styles.stepNum}
                style={{ background: "rgba(66, 133, 244, 0.2)", color: "var(--c1)" }}
              >
                1
              </div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>GKE クラスタを Workload Identity 付きで作成</div>
                <div className={styles.stepDesc}>
                  <code
                    style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#a8c4e0" }}
                  >
                    --workload-pool=${"{PROJECT_ID}"}.svc.id.goog
                  </code>{" "}
                  オプションを付けて作成します。
                </div>
              </div>
            </div>
            <div className={styles.step}>
              <div
                className={styles.stepNum}
                style={{ background: "rgba(66, 133, 244, 0.2)", color: "var(--c1)" }}
              >
                2
              </div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>gVisor ノードプールを追加</div>
                <div className={styles.stepDesc}>
                  <code
                    style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", color: "#a8c4e0" }}
                  >
                    --sandbox type=gvisor --image-type cos_containerd
                  </code>{" "}
                  でサンドボックス専用ノードを作成します。
                </div>
              </div>
            </div>
            <div className={styles.step}>
              <div
                className={styles.stepNum}
                style={{ background: "rgba(66, 133, 244, 0.2)", color: "var(--c1)" }}
              >
                3
              </div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>Agent Sandbox アドオンをインストール</div>
                <div className={styles.stepDesc}>
                  GKE マネージドアドオンとして Agent Sandbox Controller を有効化します（Google
                  がライフサイクル管理）。
                </div>
              </div>
            </div>
            <div className={styles.step}>
              <div
                className={styles.stepNum}
                style={{ background: "rgba(66, 133, 244, 0.2)", color: "var(--c1)" }}
              >
                4
              </div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>SandboxTemplate と SandboxWarmPool を作成</div>
                <div className={styles.stepDesc}>
                  上記 YAML を kubectl apply し、セキュリティポリシーと事前起動数を設定します。
                </div>
              </div>
            </div>
            <div className={styles.step}>
              <div
                className={styles.stepNum}
                style={{ background: "rgba(66, 133, 244, 0.2)", color: "var(--c1)" }}
              >
                5
              </div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>
                  AIフレームワーク（ADK/LangChain）から SandboxClaim を発行
                </div>
                <div className={styles.stepDesc}>
                  フレームワークが SandboxClaim を発行すると、Warm Pool
                  から即座に隔離環境が割り当てられます。
                </div>
              </div>
            </div>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c1)" } as React.CSSProperties}
          >
            ベストプラクティス
          </div>
          <table className={styles.mdTable}>
            <thead>
              <tr>
                <th>カテゴリ</th>
                <th>推奨事項</th>
                <th>理由</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🔒 分離</td>
                <td>信頼できないコードは必ず gVisor Pod で実行</td>
                <td>ホストOS侵害（RCE）を防止</td>
              </tr>
              <tr>
                <td>⚡ パフォーマンス</td>
                <td>SandboxWarmPool でPodを常時待機</td>
                <td>コールドスタートをサブ秒に短縮</td>
              </tr>
              <tr>
                <td>💰 コスト</td>
                <td>Pod Snapshot でアイドルPodをsuspend</td>
                <td>GPU/CPUの無駄なアイドルコストを削減</td>
              </tr>
              <tr>
                <td>🔑 ID管理</td>
                <td>Workload Identity で Pod 単位の最小権限 IAM</td>
                <td>1つのPod侵害が他に波及しない</td>
              </tr>
              <tr>
                <td>🌐 ネットワーク</td>
                <td>NetworkPolicy をデフォルト拒否に設定</td>
                <td>外部コールバックや横断移動を防止</td>
              </tr>
              <tr>
                <td>📦 リソース</td>
                <td>全コンテナに resource.limits を設定</td>
                <td>ノードリソース枯渇DoSを防止</td>
              </tr>
            </tbody>
          </table>

          <ul className={styles.linkList}>
            <li>
              <span className={styles.linkLabel}>公式ドキュメント</span>
              <Ext href="https://cloud.google.com/kubernetes-engine/docs/concepts/machine-learning/agent-sandbox">
                GKE Agent Sandbox コンセプトドキュメント
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>セットアップ</span>
              <Ext href="https://cloud.google.com/kubernetes-engine/docs/how-to/how-install-agent-sandbox">
                Agent Sandbox インストールガイド
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>CRD リファレンス</span>
              <Ext href="https://cloud.google.com/kubernetes-engine/docs/reference/crds/agentsandbox">
                SandboxTemplate / SandboxClaim スペック
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>GA 発表ブログ</span>
              <Ext href="https://cloud.google.com/blog/products/containers-kubernetes/bringing-you-agent-sandbox-on-gke-and-agent-substrate">
                Cloud Next '26: GKE Agent Sandbox &amp; Agent Substrate
              </Ext>
            </li>
          </ul>
        </section>

        {/* S2: GEMINI CODE EXECUTION */}
        <section className={styles.sec} id="s2">
          <div className={styles.secEyebrow} style={{ color: "var(--c2)" }}>
            CHAPTER 04 — AI / LLM API
          </div>
          <h2 className={styles.secTitle}>Gemini Code Execution</h2>

          <div className={styles.sbHeader} style={{ borderLeftColor: "var(--c2)" }}>
            <div
              className={styles.sbIcon}
              style={{ background: "rgba(52, 168, 83, 0.15)", color: "var(--c2)" }}
            >
              ✨
            </div>
            <div className={styles.sbHeaderMeta}>
              <div className={styles.sbName}>Gemini Code Execution</div>
              <div className={styles.sbDomain}>
                領域: AI / LLM API &nbsp;|&nbsp; 主要技術: マネージド Linux 環境
              </div>
              <div className={styles.sbDesc}>
                Gemini API の「ツール」として提供されるマネージドなコード実行環境。
                <strong>インフラ構築ゼロ</strong>で、API 1 行有効化するだけで Gemini が Python
                コードを生成・実行して結果を確認します。
              </div>
            </div>
            <div>
              <span
                className={styles.statusBadge}
                style={{
                  background: "rgba(52, 168, 83, 0.12)",
                  color: "#34a853",
                  border: "1px solid rgba(52, 168, 83, 0.3)",
                }}
              >
                <span className={styles.statusPulse} style={{ background: "#34a853" }} />
                GA
              </span>
            </div>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c2)" } as React.CSSProperties}
          >
            コード実行の流れ（シーケンス図）
          </div>
          <div
            className={`${styles.diagramWrap} ${styles.diagramScrollable}`}
            style={{ "--diag-min-w": "850px" } as React.CSSProperties}
          >
            <div className={styles.preMermaid}>
              <MermaidDiagram chart={DIAG_4} />
            </div>
            <p className={styles.diagramLabel}>図4: Gemini Code Execution の ReAct ループ</p>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c2)" } as React.CSSProperties}
          >
            制約事項と対処法
          </div>
          <table className={styles.mdTable}>
            <thead>
              <tr>
                <th>制約</th>
                <th>詳細</th>
                <th>対処法</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>⏱️ タイムアウト</td>
                <td>
                  最大 <strong>30 秒</strong> で強制終了
                </td>
                <td>処理を複数ターンに分割して実行</td>
              </tr>
              <tr>
                <td>📂 ファイルI/O不可</td>
                <td>ファイルの読み書きができない</td>
                <td>データをプロンプト内にテキストで埋め込む</td>
              </tr>
              <tr>
                <td>🌐 ネットワーク不可</td>
                <td>外部 API 呼び出し不可</td>
                <td>Function Calling と組み合わせる</td>
              </tr>
              <tr>
                <td>🐍 Python のみ</td>
                <td>他の言語は非対応</td>
                <td>Python で記述 or GKE Agent Sandbox を採用</td>
              </tr>
              <tr>
                <td>♻️ ステートレス</td>
                <td>セッション間で状態が失われる</td>
                <td>マルチターン会話で継続性を確保</td>
              </tr>
            </tbody>
          </table>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c2)" } as React.CSSProperties}
          >
            Python SDK で有効化する方法
          </div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLabel}>Python — Gemini Code Execution 有効化</div>
            <pre className="language-python">
              {`from google import genai
from google.genai.types import Tool, ToolCodeExecution, GenerateContentConfig

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash",           # 2026年6月時点推奨モデル
    contents="最初の50個の素数の合計を計算してください",
    config=GenerateContentConfig(
        tools=[Tool(code_execution=ToolCodeExecution())],
        temperature=0,                   # 再現性確保
    )
)

# レスポンスには text / executableCode / codeExecutionResult の3種が混在
for part in response.candidates[0].content.parts:
    if part.text:
        print("[説明]", part.text)
    if part.executable_code:
        print("[コード]\\n", part.executable_code.code)
    if part.code_execution_result:
        print("[実行結果]", part.code_execution_result.output)`}
            </pre>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c2)" } as React.CSSProperties}
          >
            ベストプラクティス
          </div>
          <div
            className={`${styles.diagramWrap} ${styles.diagramScrollable}`}
            style={{ "--diag-min-w": "800px" } as React.CSSProperties}
          >
            <div className={styles.preMermaid}>
              <MermaidDiagram chart={DIAG_5} />
            </div>
            <p className={styles.diagramLabel}>図5: Code Execution タスク設計フロー</p>
          </div>

          <ul className={styles.linkList}>
            <li>
              <span className={styles.linkLabel}>API ドキュメント</span>
              <Ext href="https://ai.google.dev/gemini-api/docs/code-execution">
                Gemini Code Execution — ai.google.dev
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>Vertex AI 版</span>
              <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/tools/code-execution">
                Gemini Enterprise Agent Platform — Code Execution
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>Function Calling</span>
              <Ext href="https://ai.google.dev/gemini-api/docs/interactions/function-calling">
                Function Calling リファレンス
              </Ext>
            </li>
          </ul>
        </section>

        {/* S3: gVISOR */}
        <section className={styles.sec} id="s3">
          <div className={styles.secEyebrow} style={{ color: "var(--c3)" }}>
            CHAPTER 05 — CONTAINER
          </div>
          <h2 className={styles.secTitle}>gVisor / GKE Sandbox</h2>

          <div className={styles.sbHeader} style={{ borderLeftColor: "var(--c3)" }}>
            <div
              className={styles.sbIcon}
              style={{ background: "rgba(255, 109, 0, 0.15)", color: "var(--c3)" }}
            >
              🛡️
            </div>
            <div className={styles.sbHeaderMeta}>
              <div className={styles.sbName}>gVisor / GKE Sandbox</div>
              <div className={styles.sbDomain}>
                領域: コンテナ &nbsp;|&nbsp; 主要技術: ユーザー空間カーネル（Sentry + Gofer）
              </div>
              <div className={styles.sbDesc}>
                Google が開発した OSS のアプリケーションカーネル。コンテナがホスト OS
                のカーネルに直接触れることなく実行される。
                <strong>GKE Agent Sandbox の基盤技術</strong>
                であり、Gemini の実行にも使用されている。
              </div>
            </div>
            <div>
              <span
                className={styles.statusBadge}
                style={{
                  background: "rgba(52, 168, 83, 0.12)",
                  color: "#34a853",
                  border: "1px solid rgba(52, 168, 83, 0.3)",
                }}
              >
                <span className={styles.statusPulse} style={{ background: "#34a853" }} />
                GA
              </span>
            </div>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c3)" } as React.CSSProperties}
          >
            通常コンテナ vs gVisor コンテナ
          </div>
          <div
            className={styles.diagramWrap}
            style={{ "--diag-w": "600px" } as React.CSSProperties}
          >
            <div className={styles.preMermaid}>
              <MermaidDiagram chart={DIAG_6} />
            </div>
            <p className={styles.diagramLabel}>
              図6: 通常コンテナと gVisor コンテナのアーキテクチャ比較
            </p>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c3)" } as React.CSSProperties}
          >
            通常コンテナとの比較表
          </div>
          <table className={styles.mdTable}>
            <thead>
              <tr>
                <th>比較項目</th>
                <th>通常コンテナ</th>
                <th>gVisor コンテナ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>カーネル</td>
                <td>ホストOSカーネルを直接使用</td>
                <td>Sentry（疑似カーネル）が仲介</td>
              </tr>
              <tr>
                <td>隔離強度</td>
                <td>中（名前空間・cgroup）</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>高</span>
                  （ユーザー空間カーネル）
                </td>
              </tr>
              <tr>
                <td>パフォーマンス</td>
                <td>ネイティブに近い</td>
                <td>
                  syscall heavy: 10〜30%オーバーヘッド
                  <br />
                  CPU bound: 3%以下
                </td>
              </tr>
              <tr>
                <td>Breakoutリスク</td>
                <td>カーネル脆弱性で逃脱可能</td>
                <td>ホストカーネルに直接アクセス不可</td>
              </tr>
              <tr>
                <td>KubernetesでのPod設定</td>
                <td>（デフォルト）</td>
                <td>
                  <code style={{ fontFamily: "var(--font-mono)", fontSize: "1rem" }}>
                    runtimeClassName: gvisor
                  </code>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c3)" } as React.CSSProperties}
          >
            GKE Sandbox 有効化手順
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div
                className={styles.stepNum}
                style={{ background: "rgba(255, 109, 0, 0.2)", color: "var(--c3)" }}
              >
                1
              </div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>
                  cos_containerd イメージタイプのノードプールを作成
                </div>
                <div className={styles.stepDesc}>
                  gVisor が動作するためには Container-Optimized OS with containerd が必要です。
                </div>
              </div>
            </div>
            <div className={styles.step}>
              <div
                className={styles.stepNum}
                style={{ background: "rgba(255, 109, 0, 0.2)", color: "var(--c3)" }}
              >
                2
              </div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>
                  gVisor ノードプールを作成（--sandbox type=gvisor）
                </div>
                <div className={styles.stepDesc}>
                  専用ノードプールを作成し、gVisor ランタイムを有効化します。
                </div>
              </div>
            </div>
            <div className={styles.step}>
              <div
                className={styles.stepNum}
                style={{ background: "rgba(255, 109, 0, 0.2)", color: "var(--c3)" }}
              >
                3
              </div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>
                  Deployment に runtimeClassName: gvisor を追加
                </div>
                <div className={styles.stepDesc}>
                  信頼できないワークロードの Pod spec に RuntimeClass を指定します。
                </div>
              </div>
            </div>
            <div className={styles.step}>
              <div
                className={styles.stepNum}
                style={{ background: "rgba(255, 109, 0, 0.2)", color: "var(--c3)" }}
              >
                4
              </div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>securityContext で最小権限を設定</div>
                <div className={styles.stepDesc}>
                  <code style={{ fontSize: "1rem", color: "#a8c4e0" }}>
                    runAsNonRoot: true / allowPrivilegeEscalation: false
                  </code>{" "}
                  を必ず設定します。
                </div>
              </div>
            </div>
          </div>

          <ul className={styles.linkList}>
            <li>
              <span className={styles.linkLabel}>GKE ドキュメント</span>
              <Ext href="https://cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods">
                GKE Sandbox Pods — Google Cloud
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>gVisor 公式</span>
              <Ext href="https://gvisor.dev/">gvisor.dev — 公式サイト</Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>Performance Guide</span>
              <Ext href="https://gvisor.dev/docs/architecture_guide/performance/">
                gVisor パフォーマンスガイド
              </Ext>
            </li>
          </ul>
        </section>

        {/* S4: SANDBOX2 / SAPI */}
        <section className={styles.sec} id="s4">
          <div className={styles.secEyebrow} style={{ color: "var(--c4)" }}>
            CHAPTER 06 — C/C++ APPS
          </div>
          <h2 className={styles.secTitle}>Sandbox2 / SAPI</h2>

          <div className={styles.sbHeader} style={{ borderLeftColor: "var(--c4)" }}>
            <div
              className={styles.sbIcon}
              style={{ background: "rgba(251, 188, 4, 0.15)", color: "var(--c4)" }}
            >
              🔩
            </div>
            <div className={styles.sbHeaderMeta}>
              <div className={styles.sbName}>Sandbox2 / Sandboxed API（SAPI）</div>
              <div className={styles.sbDomain}>
                領域: C/C++ アプリ &nbsp;|&nbsp; 主要技術: Seccomp-bpf + Linux Namespaces
              </div>
              <div className={styles.sbDesc}>
                C/C++ で書かれたライブラリやプログラムを安全に実行するための Google OSS
                フレームワーク。古い脆弱なライブラリを「
                <strong>一度サンドボックス化したらどこでも再利用</strong>
                」できる設計。
              </div>
            </div>
            <div>
              <span
                className={styles.statusBadge}
                style={{
                  background: "rgba(52, 168, 83, 0.12)",
                  color: "#34a853",
                  border: "1px solid rgba(52, 168, 83, 0.3)",
                }}
              >
                <span className={styles.statusPulse} style={{ background: "#34a853" }} />
                GA（OSS）
              </span>
            </div>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c4)" } as React.CSSProperties}
          >
            Sandbox2 の 2 プロセスモデル
          </div>
          <div
            className={`${styles.diagramWrap} ${styles.diagramScrollable}`}
            style={{ "--diag-min-w": "800px" } as React.CSSProperties}
          >
            <div className={styles.preMermaid}>
              <MermaidDiagram chart={DIAG_7} />
            </div>
            <p className={styles.diagramLabel}>図7: Sandbox2 の Executor-Sandboxee 分離モデル</p>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c4)" } as React.CSSProperties}
          >
            Sandbox2 vs SAPI — 使い分けガイド
          </div>
          <table className={styles.mdTable}>
            <thead>
              <tr>
                <th>観点</th>
                <th>Sandbox2</th>
                <th>SAPI（Sandboxed API）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>対象</td>
                <td>プログラム全体・複雑なケース</td>
                <td>特定の C/C++ ライブラリ</td>
              </tr>
              <tr>
                <td>実装コスト</td>
                <td>高（ポリシー・RPC を手動設計）</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>低</span>（スタブ自動生成）
                </td>
              </tr>
              <tr>
                <td>再利用性</td>
                <td>低（プロジェクトごとに再実装）</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>高</span>
                  （一度書いたらどこでも）
                </td>
              </tr>
              <tr>
                <td>クラッシュ対応</td>
                <td>手動でリスタートを実装</td>
                <td>Transactions API が自動リスタート</td>
              </tr>
              <tr>
                <td>推奨場面</td>
                <td>プログラム全体の細かい制御</td>
                <td>
                  <strong>古い C ライブラリを安全に再利用</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c4)" } as React.CSSProperties}
          >
            seccomp-bpf の仕組み（初学者向け）
          </div>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <div className={styles.calloutIcon}>📚</div>
            <div className={styles.calloutBody}>
              <strong>syscall（システムコール）</strong>
              とは、プログラムがOSカーネルに機能を頼む命令のこと（ファイルを開く・ネットワークに接続する等）。
              <br />
              <strong>seccomp-bpf</strong> は「このプログラムが使える syscall
              リスト（許可リスト）」をカーネルに登録する仕組みです。リスト外の syscall
              が呼ばれると即座にプロセスを終了させます。
            </div>
          </div>

          <ul className={styles.linkList}>
            <li>
              <span className={styles.linkLabel}>公式ドキュメント</span>
              <Ext href="https://developers.google.com/code-sandboxing">
                Google Code Sandboxing Overview
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>Sandbox2 解説</span>
              <Ext href="https://developers.google.com/code-sandboxing/sandbox2/explained">
                Sandbox2 Explained
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>SAPI Getting Started</span>
              <Ext href="https://developers.google.com/code-sandboxing/sandboxed-api/getting-started">
                SAPI Getting Started Guide
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>GitHub</span>
              <Ext href="https://github.com/google/sandboxed-api">google/sandboxed-api</Ext>
            </li>
          </ul>
        </section>

        {/* S5: V8 SANDBOX */}
        <section className={styles.sec} id="s5">
          <div className={styles.secEyebrow} style={{ color: "var(--c5)" }}>
            CHAPTER 07 — BROWSER
          </div>
          <h2 className={styles.secTitle}>V8 Sandbox</h2>

          <div className={styles.sbHeader} style={{ borderLeftColor: "var(--c5)" }}>
            <div
              className={styles.sbIcon}
              style={{ background: "rgba(156, 39, 176, 0.15)", color: "var(--c5)" }}
            >
              🌐
            </div>
            <div className={styles.sbHeaderMeta}>
              <div className={styles.sbName}>V8 Sandbox</div>
              <div className={styles.sbDomain}>
                領域: ブラウザ JavaScript 実行 &nbsp;|&nbsp; 主要技術:
                メモリ空間分離（ポインタ圧縮）
              </div>
              <div className={styles.sbDesc}>
                Chrome ブラウザ内部で JavaScript を実行する V8 エンジン専用のメモリ隔離機構。JS
                の脆弱性がブラウザプロセス全体に波及しないよう設計されている。
                <br />
                2021〜2023年のChromeゼロデイの <strong>約60%がV8に起因</strong>。
              </div>
            </div>
            <div>
              <span
                className={styles.statusBadge}
                style={{
                  background: "rgba(251, 188, 4, 0.12)",
                  color: "var(--c4)",
                  border: "1px solid rgba(251, 188, 4, 0.3)",
                }}
              >
                🔄 開発継続中
              </span>
            </div>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c5)" } as React.CSSProperties}
          >
            V8 Sandbox のメモリ隔離モデル
          </div>
          <div
            className={`${styles.diagramWrap} ${styles.diagramScrollable}`}
            style={{ "--diag-min-w": "800px" } as React.CSSProperties}
          >
            <div className={styles.preMermaid}>
              <MermaidDiagram chart={DIAG_8} />
            </div>
            <p className={styles.diagramLabel}>図8: V8 Sandbox のメモリ分離とポインタ圧縮</p>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c5)" } as React.CSSProperties}
          >
            ポインタ圧縮とは？（初学者向け）
          </div>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <div className={styles.calloutIcon}>🔢</div>
            <div className={styles.calloutBody}>
              通常のポインタは「メモリのどこでも指せる 64bit アドレス」ですが、V8 Sandbox では
              <strong>32bit のオフセット</strong>に圧縮します。
              <br />
              実際のアドレス ={" "}
              <code style={{ fontFamily: "var(--font-mono)" }}>
                サンドボックス基底アドレス + 32bit オフセット
              </code>
              <br />
              攻撃者がポインタを改ざんしても、常に「サンドボックス内のアドレス」しか指せないため、外部メモリへのアクセスが不可能になります。
            </div>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c5)" } as React.CSSProperties}
          >
            役割別アクションアイテム
          </div>
          <table className={styles.mdTable}>
            <thead>
              <tr>
                <th>あなたの役割</th>
                <th>推奨アクション</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🌐 Web アプリ開発者</td>
                <td>Chrome を最新バージョンに保つ（V8 ゼロデイパッチの迅速適用）</td>
              </tr>
              <tr>
                <td>🏢 企業セキュリティ担当</td>
                <td>Chrome Enterprise ポリシーで組織全体に自動更新を強制適用</td>
              </tr>
              <tr>
                <td>⚙️ Node.js 開発者</td>
                <td>
                  <code style={{ fontFamily: "var(--font-mono)", fontSize: "1rem" }}>
                    isolated-vm
                  </code>{" "}
                  パッケージ（V8 Isolate ベース）で各テナントに独立した実行環境を付与
                </td>
              </tr>
              <tr>
                <td>🔍 セキュリティ研究者</td>
                <td>
                  V8 Sandbox バイパスは Chrome
                  VRP（脆弱性報奨金）の対象セキュリティ境界として認定済み
                </td>
              </tr>
            </tbody>
          </table>

          <ul className={styles.linkList}>
            <li>
              <span className={styles.linkLabel}>V8 ブログ</span>
              <Ext href="https://v8.dev/blog/sandbox">V8 Sandbox — 設計解説ブログ</Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>ソースREADME</span>
              <Ext href="https://chromium.googlesource.com/v8/v8.git/+/refs/heads/main/src/sandbox/README.md">
                V8 Sandbox README（設計詳細）
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>学術論文</span>
              <Ext href="https://2025.programming-conference.org/details/MoreVMs-2025-papers/3/The-V8-Sandbox">
                The V8 Sandbox — MoreVMs 2025
              </Ext>
            </li>
          </ul>
        </section>

        {/* S6: PRIVACY SANDBOX */}
        <section className={styles.sec} id="s6">
          <div className={styles.secEyebrow} style={{ color: "var(--c6)" }}>
            CHAPTER 08 — DEPRECATED
          </div>
          <h2 className={styles.secTitle}>Privacy Sandbox</h2>

          <div className={styles.deprecatedBanner}>
            <div className={styles.depIcon}>⛔</div>
            <div>
              <div className={styles.depTitle}>2025年10月17日に正式廃止されました</div>
              <div className={styles.depBody}>
                Topics API、Protected Audience、Attribution Reporting を含む全 API
                が廃止されています。新規プロジェクトでの採用は絶対に避けてください。サードパーティ
                Cookie は Chrome に残存しています。
              </div>
            </div>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c6)" } as React.CSSProperties}
          >
            Privacy Sandbox とは何だったか
          </div>
          <p
            style={{
              color: "var(--ts)",
              fontSize: "1rem",
              marginBottom: "24px",
              lineHeight: "1.75",
            }}
          >
            2019年にGoogleが発表したプライバシー配慮型Web広告APIの総称。サードパーティCookieを廃止しながらも広告のターゲティング・計測を維持するという目標で開発されていましたが、採用率の低迷・規制当局（英国CMA等）からの懸念・業界からの冷ややかな反応により、6年間の開発の末に廃止されました。
          </p>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c6)" } as React.CSSProperties}
          >
            廃止までのタイムライン
          </div>
          <div className={styles.timeline}>
            <div className={styles.tlItem}>
              <div className={styles.tlLeft}>
                <div className={styles.tlDot} />
                <div className={styles.tlLine} />
              </div>
              <div className={styles.tlBody}>
                <div className={styles.tlYear}>2019</div>
                <div className={styles.tlEvent}>
                  Google が Privacy Sandbox 構想を発表。サードパーティCookie の段階的廃止を宣言。
                </div>
              </div>
            </div>
            <div className={styles.tlItem}>
              <div className={styles.tlLeft}>
                <div className={styles.tlDot} />
                <div className={styles.tlLine} />
              </div>
              <div className={styles.tlBody}>
                <div className={styles.tlYear}>2022〜2024</div>
                <div className={styles.tlEvent}>
                  廃止期限を繰り返し延期。規制当局の懸念を受け、スケジュールが揺れ続ける。
                </div>
              </div>
            </div>
            <div className={styles.tlItem}>
              <div className={styles.tlLeft}>
                <div className={styles.tlDot} />
                <div className={styles.tlLine} />
              </div>
              <div className={styles.tlBody}>
                <div className={styles.tlYear}>2024年7月</div>
                <div className={styles.tlEvent}>
                  完全廃止からユーザー選択型モデルへ方針転換を発表。
                </div>
              </div>
            </div>
            <div className={styles.tlItem}>
              <div className={styles.tlLeft}>
                <div className={styles.tlDot} />
                <div className={styles.tlLine} />
              </div>
              <div className={styles.tlBody}>
                <div className={styles.tlYear}>2025年4月</div>
                <div className={styles.tlEvent}>
                  新規プロンプト展開を中止。既存のCookie設定を維持すると発表。
                </div>
              </div>
            </div>
            <div className={styles.tlItem}>
              <div className={styles.tlLeft}>
                <div className={styles.tlDot} style={{ background: "#ea4335" }} />
                <div className={styles.tlLine} />
              </div>
              <div className={styles.tlBody}>
                <div className={styles.tlYear} style={{ color: "#ea4335" }}>
                  2025年10月17日
                </div>
                <div className={styles.tlEvent}>
                  <strong>
                    Topics API / Protected Audience / Attribution Reporting を含む全 API
                    を正式廃止。
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c6)" } as React.CSSProperties}
          >
            現在の代替アプローチ
          </div>
          <table className={styles.mdTable}>
            <thead>
              <tr>
                <th>廃止されたAPI</th>
                <th>目的</th>
                <th>2026年時点の代替</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Topics API</td>
                <td>関心カテゴリ ターゲティング</td>
                <td>ファーストパーティデータ + Customer Match</td>
              </tr>
              <tr>
                <td>Protected Audience</td>
                <td>クロスサイト リマーケティング</td>
                <td>サーバーサイド オーディエンス + Consent Mode</td>
              </tr>
              <tr>
                <td>Attribution Reporting</td>
                <td>コンバージョン計測</td>
                <td>GTM Server-Side + サーバーサイド計測</td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <div className={styles.calloutIcon}>⚠️</div>
            <div className={styles.calloutBody}>
              <strong>注意:</strong> サードパーティ Cookie は Chrome
              に引き続き存在しています。ただし Safari・Firefox
              は既にブロックしており、GDPR/同意管理（CMP）の維持は引き続き法的義務です。
            </div>
          </div>
        </section>

        {/* COMPARE */}
        <section className={styles.sec} id="compare">
          <div className={styles.secEyebrow} style={{ color: "var(--c1)" }}>
            CHAPTER 09 — COMPARISON
          </div>
          <h2 className={styles.secTitle}>技術比較マトリクス</h2>
          <p className={styles.secLead}>6つのサンドボックス技術を主要軸で比較します。</p>
          <table className={styles.mdTable}>
            <thead>
              <tr>
                <th>比較軸</th>
                <th style={{ color: "var(--c1)" }}>GKE Agent</th>
                <th style={{ color: "var(--c2)" }}>Gemini CE</th>
                <th style={{ color: "var(--c3)" }}>gVisor</th>
                <th style={{ color: "var(--c4)" }}>Sandbox2</th>
                <th style={{ color: "var(--c5)" }}>V8</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>セットアップ難度</td>
                <td>中</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>最低</span>
                </td>
                <td>中</td>
                <td>
                  <span style={{ color: "#ea4335", fontWeight: 700 }}>高</span>
                </td>
                <td>自動</td>
              </tr>
              <tr>
                <td>隔離強度</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>◎</span>
                </td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>◎</span>
                </td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>◎</span>
                </td>
                <td>
                  <span style={{ color: "#fbbc04", fontWeight: 700 }}>○</span>
                </td>
                <td>
                  <span style={{ color: "#fbbc04", fontWeight: 700 }}>△</span>
                </td>
              </tr>
              <tr>
                <td>対応言語</td>
                <td>全言語</td>
                <td>
                  <span style={{ color: "#fbbc04", fontWeight: 700 }}>Python のみ</span>
                </td>
                <td>全言語</td>
                <td>
                  <span style={{ color: "#fbbc04", fontWeight: 700 }}>C/C++ のみ</span>
                </td>
                <td>JS/WASM</td>
              </tr>
              <tr>
                <td>ステートフル</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>◎ (Snapshot)</span>
                </td>
                <td>
                  <span style={{ color: "#ea4335", fontWeight: 700 }}>✗</span>
                </td>
                <td>
                  <span style={{ color: "#fbbc04", fontWeight: 700 }}>○ (PVC)</span>
                </td>
                <td>
                  <span style={{ color: "#ea4335", fontWeight: 700 }}>✗</span>
                </td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>コールドスタート</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>&lt; 1秒</span>
                </td>
                <td>〜数秒</td>
                <td>〜数秒</td>
                <td>μs</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>Kubernetes 対応</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>◎ (CRD)</span>
                </td>
                <td>不要</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>◎ (RuntimeClass)</span>
                </td>
                <td>不要</td>
                <td>不要</td>
              </tr>
              <tr>
                <td>インフラ管理コスト</td>
                <td>GKE 料金</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>最小 (API)</span>
                </td>
                <td>GKE 料金</td>
                <td>自己管理</td>
                <td>ゼロ</td>
              </tr>
              <tr>
                <td>スループット</td>
                <td>
                  <span style={{ color: "#34a853", fontWeight: 700 }}>300/秒</span>
                </td>
                <td>API quota 依存</td>
                <td>ノード依存</td>
                <td>syscall 依存</td>
                <td>N/A</td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <div className={styles.calloutIcon}>💡</div>
            <div className={styles.calloutBody}>
              <strong>迷ったら：</strong> まず
              <strong style={{ color: "var(--c2)" }}>Gemini Code Execution</strong>{" "}
              から試してください。Python に限定されますが、インフラ不要でGemini
              が自律的にコードを実行します。より複雑な要件（多言語・ステートフル・高スループット）が出てきたら
              <strong style={{ color: "var(--c1)" }}>GKE Agent Sandbox</strong> に移行するのが
              Google 推奨のパスです。
            </div>
          </div>
        </section>

        {/* GLOSSARY */}
        <section className={styles.sec} id="glossary">
          <div className={styles.secEyebrow} style={{ color: "var(--ts)" }}>
            APPENDIX A — GLOSSARY
          </div>
          <h2 className={styles.secTitle}>用語集</h2>
          <div className={styles.glossaryGrid}>
            <div className={styles.glossaryItem}>
              <div className={styles.glossaryTerm}>syscall（システムコール）</div>
              <div className={styles.glossaryDef}>
                アプリがOSカーネルに機能を頼む命令。ファイル読み書き・ネットワーク接続・プロセス生成などが該当する。
              </div>
            </div>
            <div className={styles.glossaryItem}>
              <div className={styles.glossaryTerm}>gVisor</div>
              <div className={styles.glossaryDef}>
                Google が開発した OSS のアプリケーションカーネル。Linux syscall
                をユーザー空間で再実装し、ホストOSカーネルへの直接接触を防ぐ。
              </div>
            </div>
            <div className={styles.glossaryItem}>
              <div className={styles.glossaryTerm}>seccomp-bpf</div>
              <div className={styles.glossaryDef}>
                Linuxカーネルのセキュリティ機能。BPF プログラムで「どの syscall
                を許可するか」を細かく制御できる。
              </div>
            </div>
            <div className={styles.glossaryItem}>
              <div className={styles.glossaryTerm}>Linux Namespaces</div>
              <div className={styles.glossaryDef}>
                PID・ネットワーク・ファイルシステム等をプロセスごとに独立した「見え方」で分離する
                Linux の機能。
              </div>
            </div>
            <div className={styles.glossaryItem}>
              <div className={styles.glossaryTerm}>Pod Snapshot</div>
              <div className={styles.glossaryDef}>
                GKEでPodの実行状態をまるごとGCSに保存・復元できる機能。コールドスタートを1秒未満にする鍵となる技術。
              </div>
            </div>
            <div className={styles.glossaryItem}>
              <div className={styles.glossaryTerm}>SandboxClaim</div>
              <div className={styles.glossaryDef}>
                AIフレームワークが GKE Agent Sandbox
                に「実行環境を1つ貸してください」とリクエストするKubernetesリソース。PVCと同様のClaimモデル。
              </div>
            </div>
            <div className={styles.glossaryItem}>
              <div className={styles.glossaryTerm}>Workload Identity</div>
              <div className={styles.glossaryDef}>
                GKEのPodに個別のGCPサービスアカウントを紐付ける仕組み。Podごとに最小権限IAMを実現し、横断攻撃を防ぐ。
              </div>
            </div>
            <div className={styles.glossaryItem}>
              <div className={styles.glossaryTerm}>RCE（リモートコード実行）</div>
              <div className={styles.glossaryDef}>
                攻撃者がリモートから任意のコードを実行できる脆弱性。サンドボックスが防ぐべき最大の脅威の一つ。
              </div>
            </div>
            <div className={styles.glossaryItem}>
              <div className={styles.glossaryTerm}>ポインタ圧縮（V8）</div>
              <div className={styles.glossaryDef}>
                64bitのメモリアドレスを32bitのオフセットに変換する技術。V8
                Sandboxがサンドボックス外のメモリを参照できなくするための核心技術。
              </div>
            </div>
            <div className={styles.glossaryItem}>
              <div className={styles.glossaryTerm}>RuntimeClass（Kubernetes）</div>
              <div className={styles.glossaryDef}>
                KubernetesでPodの実行エンジン（runc / gVisor 等）を指定するためのリソース。
                <code style={{ fontSize: "1rem" }}>runtimeClassName: gvisor</code>{" "}
                でgVisorを指定する。
              </div>
            </div>
          </div>
        </section>

        {/* RESOURCES */}
        <section className={styles.sec} id="resources">
          <div className={styles.secEyebrow} style={{ color: "var(--ts)" }}>
            APPENDIX B — REFERENCES
          </div>
          <h2 className={styles.secTitle}>公式リンク集</h2>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c1)" } as React.CSSProperties}
          >
            GKE Agent Sandbox
          </div>
          <ul className={styles.linkList}>
            <li>
              <span className={styles.linkLabel}>コンセプト</span>
              <Ext href="https://cloud.google.com/kubernetes-engine/docs/concepts/machine-learning/agent-sandbox">
                GKE Agent Sandbox コンセプトドキュメント
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>セットアップ</span>
              <Ext href="https://cloud.google.com/kubernetes-engine/docs/how-to/how-install-agent-sandbox">
                Agent Sandbox インストールガイド（2026-05-08 更新）
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>Pod Snapshot</span>
              <Ext href="https://cloud.google.com/kubernetes-engine/docs/how-to/agent-sandbox-pod-snapshots">
                Pod Snapshots ハウツー
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>CRD Ref</span>
              <Ext href="https://cloud.google.com/kubernetes-engine/docs/reference/crds/agentsandbox">
                Agent Sandbox CRD リファレンス
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>GA ブログ</span>
              <Ext href="https://cloud.google.com/blog/products/containers-kubernetes/bringing-you-agent-sandbox-on-gke-and-agent-substrate">
                Cloud Next '26: GKE Agent Sandbox GA 発表（2026/05/20）
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>Codelab</span>
              <Ext href="https://codelabs.developers.google.com/codelabs/gke/ai-agents-on-gke">
                Google Codelabs: AI Agents on GKE
              </Ext>
            </li>
          </ul>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c2)" } as React.CSSProperties}
          >
            Gemini Code Execution
          </div>
          <ul className={styles.linkList}>
            <li>
              <span className={styles.linkLabel}>API Ref</span>
              <Ext href="https://ai.google.dev/gemini-api/docs/code-execution">
                Code Execution — ai.google.dev
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>Vertex AI</span>
              <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/tools/code-execution">
                Gemini Enterprise Agent Platform — Code Execution
              </Ext>
            </li>
          </ul>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c3)" } as React.CSSProperties}
          >
            gVisor / GKE Sandbox
          </div>
          <ul className={styles.linkList}>
            <li>
              <span className={styles.linkLabel}>GKE Docs</span>
              <Ext href="https://cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods">
                GKE Sandbox Pods（Google Cloud）
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>gVisor</span>
              <Ext href="https://gvisor.dev/">gvisor.dev — 公式サイト</Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>Performance</span>
              <Ext href="https://gvisor.dev/docs/architecture_guide/performance/">
                gVisor パフォーマンスガイド
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>Platforms</span>
              <Ext href="https://gvisor.dev/docs/architecture_guide/platforms/">
                gVisor Platform ガイド（systrap/KVM/ptrace）
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>Production</span>
              <Ext href="https://gvisor.dev/docs/user_guide/production/">gVisor 本番環境ガイド</Ext>
            </li>
          </ul>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c4)" } as React.CSSProperties}
          >
            Sandbox2 / SAPI
          </div>
          <ul className={styles.linkList}>
            <li>
              <span className={styles.linkLabel}>Overview</span>
              <Ext href="https://developers.google.com/code-sandboxing">Google Code Sandboxing</Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>Sandbox2</span>
              <Ext href="https://developers.google.com/code-sandboxing/sandbox2/explained">
                Sandbox2 Explained
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>SAPI</span>
              <Ext href="https://developers.google.com/code-sandboxing/sandboxed-api/getting-started">
                SAPI Getting Started
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>GitHub</span>
              <Ext href="https://github.com/google/sandboxed-api">google/sandboxed-api</Ext>
            </li>
          </ul>

          <div
            className={styles.subH2}
            style={{ "--accent-c": "var(--c5)" } as React.CSSProperties}
          >
            V8 Sandbox
          </div>
          <ul className={styles.linkList}>
            <li>
              <span className={styles.linkLabel}>Blog</span>
              <Ext href="https://v8.dev/blog/sandbox">V8 Sandbox — 設計解説ブログ</Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>README</span>
              <Ext href="https://chromium.googlesource.com/v8/v8.git/+/refs/heads/main/src/sandbox/README.md">
                V8 Sandbox ソース README（設計詳細）
              </Ext>
            </li>
            <li>
              <span className={styles.linkLabel}>Paper</span>
              <Ext href="https://2025.programming-conference.org/details/MoreVMs-2025-papers/3/The-V8-Sandbox">
                The V8 Sandbox — MoreVMs 2025 論文
              </Ext>
            </li>
          </ul>

          <div className={styles.footerNote}>
            本ドキュメントは 2026年6月12日時点の Google 公式情報・発表に基づいています。
            <br />
            各技術は急速に進化しています。最新情報は公式ドキュメントをご確認ください。
          </div>
        </section>
      </div>
    </>
  );
}
