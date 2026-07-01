import type { Metadata } from "next";
import CodeCopyButton from "@/components/docs/CodeCopyButton";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Vercel Sandbox 完全入門ガイド 2026",
  description:
    "信頼できないコードをミリ秒単位で安全に実行できる Linux マイクロVM。初学者でもわかるステップバイステップ解説＋ベストプラクティス付き。",
};

// ── MERMAID DIAGRAMS ──
const DIAG_ARCHITECTURE = `graph TB
subgraph CLIENT[" 呼び出し元レイヤー "]
A1[" JS SDK <br/> @vercel/sandbox "]
A2[" Python SDK <br/> vercel パッケージ "]
A3[" CLI <br/> sandbox - sbx "]
A4[" AI エージェント <br/> v0, Roo Code 等 "]
end
subgraph API[" Vercel Sandbox API "]
B1[" OIDC Token 認証 - 推奨 "]
B2[" ルーティング・管理 "]
B3[" スナップショット管理 "]
end
subgraph HIVE[" Hive コンピュートプラットフォーム "]
C1[" MicroVM クラスター <br/> Region A "]
C2[" MicroVM クラスター <br/> Region B "]
C3[" MicroVM クラスター <br/> Region C "]
end
subgraph SBX[" 個別 Sandbox インスタンス "]
D1[" Sandbox A <br/> Amazon Linux 2023 "]
D2[" Sandbox B <br/> python3.13 "]
D3[" Sandbox C <br/> Persistent モード "]
end
CLIENT --> API
API --> HIVE
HIVE --> SBX
style CLIENT fill:#1e1b4b,stroke:#6366f1,color:#c7d2fe
style API fill:#0c1a2e,stroke:#0ea5e9,color:#7dd3fc
style HIVE fill:#0a1f0a,stroke:#22c55e,color:#86efac
style SBX fill:#1a0a2e,stroke:#a855f7,color:#d8b4fe`;

const DIAG_SETUP = `flowchart LR
S1[" 1 Vercel CLI<br/>インストール "] --> S2[" 2 プロジェクト<br/>作成・リンク "]
S2 --> S3[" 3 Sandbox CLI - SDK<br/>インストール "]
S3 --> S4[" 4 認証設定<br/>OIDC or Token "]
S4 --> S5[" 最初の Sandbox 作成 "]
style S1 fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd
style S2 fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd
style S3 fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd
style S4 fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd
style S5 fill:#14532d,stroke:#22c55e,color:#86efac`;

const DIAG_CONCEPTS = `graph TB
SBX["Sandbox - 永続的な存在<br/>name で識別 - プロジェクト内でユニーク"]
SBX --> S1["Session 1<br/>最初の起動 - 実行 - 停止"]
SBX --> S2["Session 2<br/>再開 - Snapshot から復元 - 実行 - 停止"]
SBX --> S3["Session 3<br/>さらに再開 - 実行 - 停止"]
S1 -->|"停止時に自動 Snapshot"| SS1[("Snapshot 1<br/>ファイルシステムの状態")]
SS1 -->|"次回再開時に復元"| S2
S2 -->|"停止時に自動 Snapshot"| SS2[("Snapshot 2<br/>最新の状態")]
SS2 -->|"次回再開時に復元"| S3
style SBX fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd
style S1 fill:#14532d,stroke:#22c55e,color:#86efac
style S2 fill:#14532d,stroke:#22c55e,color:#86efac
style S3 fill:#14532d,stroke:#22c55e,color:#86efac
style SS1 fill:#2d1b4e,stroke:#a855f7,color:#d8b4fe
style SS2 fill:#2d1b4e,stroke:#a855f7,color:#d8b4fe`;

const DIAG_PERSISTENT_VS = `flowchart LR
subgraph PERSIST["Persistent - デフォルト"]
P1["作成"] --> P2["Session 起動"]
P2 --> P3["コード実行"]
P3 --> P4["停止"]
P4 -->|"自動 Snapshot"| P5["状態を保存"]
P5 -->|"次回 Snapshot から再開"| P2
end
subgraph EPHEMERAL["Non-persistent"]
E1["作成"] --> E2["Session 起動"]
E2 --> E3["コード実行"]
E3 --> E4["停止"]
E4 -->|"状態を破棄"| E5["終了 - 再開不可"]
end
style PERSIST fill:#0a1f0a,stroke:#22c55e,color:#86efac
style EPHEMERAL fill:#1f0a0a,stroke:#ef4444,color:#fca5a5`;

const DIAG_FLOW = `flowchart TD
A(["開始"]) --> B["Sandbox.create()<br/>または sandbox create"]
B --> C{"暗慢的な状態変化を防ぐため<br/>Sandbox が存在する？"}
C -->|"はい - Persistent"| D["既存 Sandbox を再開<br/>Snapshot から復元"]
C -->|"いいえ"| E["新規 MicroVM を起動<br/>ミリ秒で完了"]
D --> F["コマンド実行<br/>runCommand - exec"]
E --> F
F --> G{"処理を継続する？"}
G -->|"はい"| F
G -->|"いいえ"| H["sandbox.stop()"]
H --> I{"Persistent?"}
I -->|"Yes"| J["自動スナップショット<br/>ファイルシステムを保存"]
I -->|"No"| K["状態を破棄<br/>ストレージ課金なし"]
J --> L(["終了"])
K --> L
style A fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd
style L fill:#14532d,stroke:#22c55e,color:#86efac
style J fill:#2d1b4e,stroke:#a855f7,color:#d8b4fe
style K fill:#3b1515,stroke:#ef4444,color:#fca5a5`;

const DIAG_GETORCREATE = `flowchart TD
GC["Sandbox.getOrCreate - name: 'my-sandbox'"]
GC --> E1{"同じ name の<br/>Sandbox が存在？"}
E1 -->|"存在する"| E2{"Snapshot の<br/>有効期限は？"}
E2 -->|"有効"| E3["既存 Sandbox を再開<br/>onResume() を実行"]
E2 -->|"期限切れ"| E4["Sandbox を再作成<br/>onCreate() を実行"]
E1 -->|"存在しない"| E5["新規 Sandbox を作成<br/>onCreate() を実行"]
E3 --> DONE(["Sandbox インスタンス返却"])
E4 --> DONE
E5 --> DONE
style GC fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd
style DONE fill:#14532d,stroke:#22c55e,color:#86efac
style E3 fill:#0a1f0a,stroke:#22c55e,color:#86efac
style E4 fill:#2d1a00,stroke:#f59e0b,color:#fde68a
style E5 fill:#2d1b4e,stroke:#a855f7,color:#d8b4fe`;

const DIAG_CLI = `mindmap
  root((sandbox CLI))
    サンドボックス管理
      list - ls
      create
      fork
      remove
      config
    実行系
      run - 停止中も自動再開
      exec - 起動中のみ
      connect - ssh - shell
    ファイル操作
      copy - cp
    セッション管理
      sessions
    スナップショット
      snapshot - 手動作成
      snapshots - 一覧・管理
    認証
      login
      logout`;

const DIAG_LIFECYCLE = `sequenceDiagram
  participant Dev as 開発者 - AI エージェント
  participant API as Vercel Sandbox API
  participant VM as MicroVM - Session
  participant SS as Snapshot ストレージ
  Dev->>API: Sandbox.create - name: "my-sandbox"
  API->>VM: 新規 MicroVM を起動
  VM-->>Dev: Sandbox インスタンス返却
  Dev->>VM: runCommand("npm install")
  VM-->>Dev: 実行結果 exit 0
  Dev->>VM: sandbox.stop()
  VM->>SS: ファイルシステムを自動スナップショット
  VM-->>Dev: 停止完了 - Session 1 終了
  Note over Dev,SS: 数時間後 - 翌日でも問題なし
  Dev->>API: Sandbox.get - name: "my-sandbox"
  API-->>Dev: Sandbox ハンドル返却
  Dev->>API: sandbox.runCommand("npm test")
  API->>SS: 最新 Snapshot を取得
  SS-->>API: Snapshot データ
  API->>VM: 新規 MicroVM を Snapshot から起動
  VM-->>Dev: 実行結果 - npm install 済の状態から
  Note right of VM: Session 2 開始`;

const DIAG_SNAPSHOTS = `flowchart TD
A["Sandbox が停止"] --> B["自動スナップショット作成"]
B --> C{"keepLastSnapshots<br/>設定あり？"}
C -->|"設定なし"| D["すべての Snapshot を保持<br/>有効期限まで"]
C -->|"設定あり - 例: count: 1"| E{"保持上限 N 件を<br/>超過した？"}
E -->|"いいえ"| D
E -->|"はい"| F{"deleteEvicted?"}
F -->|"true - デフォルト"| G["古い Snapshot を即時削除"]
F -->|"false"| H["有効期限まで保持"]
style B fill:#2d1b4e,stroke:#a855f7,color:#d8b4fe
style G fill:#3b1515,stroke:#ef4444,color:#fca5a5`;

const DIAG_NETWORK = `flowchart LR
subgraph ALLOW["allow-all - デフォルト"]
AS["Sandbox"] -->|"すべて許可"| AN["インターネット全体"]
end
subgraph DENY["deny-all"]
DS["Sandbox"] -->|"すべて遮断"| DN["インターネット"]
end
subgraph CUSTOM["custom - カスタム"]
CS["Sandbox"] -->|"許可"| CN1["ai-gateway.vercel.sh"]
CS -->|"遮断"| CN2["その他"]
end
style ALLOW fill:#0a1f0a,stroke:#22c55e,color:#86efac
style DENY fill:#1f0a0a,stroke:#ef4444,color:#fca5a5
style CUSTOM fill:#0c1a2e,stroke:#3b82f6,color:#93c5fd`;

const DIAG_TAGS = `graph LR
subgraph PROD["env=production"]
P1["prod-agent-1"]
P2["prod-agent-2"]
end
subgraph STG["env=staging"]
S1["staging-agent-1"]
end
subgraph CI["env=ci"]
C1["ci-build-1"]
C2["ci-build-2"]
end
MGMT["Dashboard - CLI<br/>sandbox list --tag env=production"] --> PROD
MGMT --> STG
MGMT --> CI
style PROD fill:#14532d,stroke:#22c55e,color:#86efac
style STG fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd
style CI fill:#2d1b4e,stroke:#a855f7,color:#d8b4fe`;

const DIAG_BEST_PRACTICES = `mindmap
  root((ベストプラクティス))
    コスト最適化
      keepLastSnapshots - 1 に設定
      CI - CD には non-persistent を使う
      適切なタイムアウト設定
      処理後は必ず stop
    セキュリティ
      untrusted code には deny-all
      OIDC Token を優先使用
      処理後にネットワーク遮断
      不要な Sandbox を定期削除
    パフォーマンス
      getOrCreate でスナップショットを活用
      onCreate で重い初期化を一度だけ
      onResume で軽量な再起動
      detached でバックグラウンド実行
    管理 - 運用
      name を必ず明示的に指定
      タグで環境 - チームを分類
      v1 から v2 移行は name に注意`;

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

/**
 * Renders the Vercel Sandbox guide page.
 *
 * @returns The documentation layout for the Vercel Sandbox introductory guide.
 */
export default function Page() {
  return (
    <div className={styles.layout}>
      {/* ══════════════════════════════════════════════════════
       SIDEBAR
      ══════════════════════════════════════════════════════════ */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <svg
            viewBox="0 0 76 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Vercel Logo"
          >
            <title>Vercel Logo</title>
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="white" />
          </svg>
          <div>
            <div className={styles.sidebarLogoText}>Vercel Sandbox</div>
            <div className={styles.sidebarLogoSub}>完全入門ガイド 2026</div>
          </div>
        </div>

        <div className={styles.sidebarNav}>
          <div className={styles.navGroupLabel}>はじめに</div>
          <a className={`${styles.navLink} ${styles.navLinkActive}`} href="#intro">
            <span className={styles.navNum}>1</span>Sandboxとは？
          </a>
          <a className={styles.navLink} href="#architecture">
            <span className={styles.navNum}>2</span>アーキテクチャ
          </a>
          <a className={styles.navLink} href="#usecases">
            <span className={styles.navNum}>3</span>ユースケース
          </a>

          <div className={styles.navGroupLabel}>セットアップ</div>
          <a className={styles.navLink} href="#setup">
            <span className={styles.navNum}>4</span>セットアップ手順
          </a>
          <a className={styles.navLink} href="#concepts">
            <span className={styles.navNum}>5</span>コアコンセプト
          </a>
          <a className={styles.navLink} href="#persistent-vs">
            <span className={styles.navNum}>6</span>永続的 vs 一時的
          </a>

          <div className={styles.navGroupLabel}>実践ガイド</div>
          <a className={styles.navLink} href="#first-sandbox">
            <span className={styles.navNum}>7</span>最初のSandbox
          </a>
          <a className={styles.navLink} href="#sdk">
            <span className={styles.navNum}>8</span>JS SDK ガイド
          </a>
          <a className={styles.navLink} href="#cli">
            <span className={styles.navNum}>9</span>CLI リファレンス
          </a>

          <div className={styles.navGroupLabel}>高度な機能</div>
          <a className={styles.navLink} href="#persistent-detail">
            <span className={styles.navNum}>10</span>永続Sandboxの詳細
          </a>
          <a className={styles.navLink} href="#snapshots">
            <span className={styles.navNum}>11</span>スナップショット
          </a>
          <a className={styles.navLink} href="#network">
            <span className={styles.navNum}>12</span>ネットワークポリシー
          </a>
          <a className={styles.navLink} href="#tags">
            <span className={styles.navNum}>13</span>タグ管理
          </a>

          <div className={styles.navGroupLabel}>まとめ</div>
          <a className={styles.navLink} href="#best-practices">
            <span className={styles.navNum}>14</span>ベストプラクティス
          </a>
          <a className={styles.navLink} href="#resources">
            <span className={styles.navNum}>15</span>参考ソース
          </a>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════
       MAIN CONTENT
      ══════════════════════════════════════════════════════════ */}
      <main className={styles.main}>
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroEyebrow}>
            <span>⚡</span> Vercel Sandbox GA · 2026年6月
          </div>
          <h1>
            Vercel Sandbox
            <br />
            完全入門ガイド
          </h1>
          <p className={styles.heroDesc}>
            信頼できないコードを<strong>ミリ秒単位</strong>で安全に実行できる Linux マイクロVM。
            <br />
            初学者でもわかるステップバイステップ解説＋ベストプラクティス付き。
          </p>
          <div className={styles.heroBadges}>
            <span className={`${styles.badge} ${styles.badgeBlue}`}>📦 @vercel/sandbox v2</span>
            <span className={`${styles.badge} ${styles.badgeTeal}`}>🔒 Firecracker MicroVM</span>
            <span className={`${styles.badge} ${styles.badgeGreen}`}>🚀 サブ秒起動</span>
            <span className={`${styles.badge} ${styles.badgeAmber}`}>📸 自動スナップショット</span>
            <span className={`${styles.badge} ${styles.badgePurple}`}>🌐 OSS</span>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 1 WHAT IS VERCEL SANDBOX
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="intro">
          <div className={styles.sectionEyebrow}>Section 01</div>
          <h2>Vercel Sandbox とは？</h2>
          <p className={styles.sectionIntro}>
            <strong>Vercel Sandbox</strong> は、AI
            エージェントが生成したコード・ユーザーが入力したスクリプト・サードパーティ製コードなど、
            <em>信頼できないコード</em>を<strong>完全に隔離された Linux マイクロVM</strong>
            内で安全に実行するためのサービスです。 2026年1月30日に GA（一般公開）となり、CLI と SDK
            はオープンソース化されました。
          </p>

          <div className={`${styles.callout} ${styles.calloutBlue}`}>
            <span className={styles.calloutIcon}>💡</span>
            <div>
              <strong>一言で言うと:</strong> 「コードを安全に動かせる使い捨ての Linux マシン」を
              <strong>数ミリ秒</strong>で用意できるサービスです。従来のコンテナよりも強力な VM
              レベルの隔離を実現しています。
            </div>
          </div>

          <h3>Vercel Sandbox が解決する課題</h3>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>従来インフラの問題</th>
                  <th>Vercel Sandbox の解決策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>環境準備に数分かかる</td>
                  <td>
                    ⚡ <strong>ミリ秒単位で起動</strong>（サブ秒）
                  </td>
                </tr>
                <tr>
                  <td>実行環境が共有され攻撃リスクが高い</td>
                  <td>
                    🔒 <strong>Firecracker MicroVM による完全分離</strong>（独自カーネル）
                  </td>
                </tr>
                <tr>
                  <td>アイドル時間にもコストがかかる</td>
                  <td>
                    💰 <strong>Active CPU 時間のみ課金</strong>
                  </td>
                </tr>
                <tr>
                  <td>複雑な環境の状態引き継ぎが困難</td>
                  <td>
                    📸 <strong>自動スナップショットで状態を保存・復元</strong>
                  </td>
                </tr>
                <tr>
                  <td>本番環境への意図しない影響リスク</td>
                  <td>
                    🌐 <strong>完全に隔離された VM のため本番への影響ゼロ</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>システム仕様</h3>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>詳細</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ベース OS</td>
                  <td>
                    <code>Amazon Linux 2023</code>
                  </td>
                </tr>
                <tr>
                  <td>利用可能ランタイム</td>
                  <td>
                    <code>node26</code>, <code>node24</code>（デフォルト）, <code>node22</code>,{" "}
                    <code>python3.13</code>
                  </td>
                </tr>
                <tr>
                  <td>デフォルト作業ディレクトリ</td>
                  <td>
                    <code>/vercel/sandbox</code>
                  </td>
                </tr>
                <tr>
                  <td>実行ユーザー</td>
                  <td>
                    <code>vercel-sandbox</code>（<code>sudo</code> アクセス可）
                  </td>
                </tr>
                <tr>
                  <td>仮想化技術</td>
                  <td>Firecracker MicroVM（各 VM が独自カーネルを保有）</td>
                </tr>
                <tr>
                  <td>起動速度</td>
                  <td>
                    <strong>ミリ秒単位</strong>（サブ秒）
                  </td>
                </tr>
                <tr>
                  <td>最大 vCPU</td>
                  <td>8 vCPU（各 vCPU に 2048 MB RAM）</td>
                </tr>
                <tr>
                  <td>最大公開ポート数</td>
                  <td>15 ポート</td>
                </tr>
                <tr>
                  <td>プリインストールツール</td>
                  <td>
                    <code>git</code>, <code>curl</code>, <code>unzip</code>, <code>tar</code>,{" "}
                    <code>openssl</code> 等
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 2 ARCHITECTURE
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="architecture">
          <div className={styles.sectionEyebrow}>Section 02</div>
          <h2>全体アーキテクチャを理解する</h2>
          <p className={styles.sectionIntro}>
            Vercel の内部コンピュートプラットフォーム「<strong>Hive</strong>」は、毎日
            270万件以上のデプロイを処理する基盤の上に Sandbox を構築しています。 SDK・CLI から
            Firecracker MicroVM まで、呼び出しがどのように流れるかを把握しましょう。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_ARCHITECTURE} id="diag-architecture" />
            <p className={styles.mermaidCaption}>
              Vercel Sandbox の多層アーキテクチャ — 呼び出し元から Firecracker MicroVM まで
            </p>
          </div>

          <div className={`${styles.callout} ${styles.calloutAmber}`}>
            <span className={styles.calloutIcon}>⚠️</span>
            <div>
              <strong>コンテナとの違い:</strong> Docker などのコンテナはホスト OS
              のカーネルを共有しますが、Vercel Sandbox は各 VM が
              <strong>独自のカーネルを持つ</strong>
              Firecracker MicroVM のため、より強力な隔離が実現されています。
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 3 USE CASES
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="usecases">
          <div className={styles.sectionEyebrow}>Section 03</div>
          <h2>主なユースケース</h2>
          <p className={styles.sectionIntro}>Vercel Sandbox は多様なシナリオに対応できます。</p>

          <div className={`${styles.cardGrid} ${styles.cardGrid2}`}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🤖</div>
              <div className={styles.cardTitle}>AI エージェントのコード実行</div>
              <div className={styles.cardDesc}>
                LLM が生成したコードを安全に実行。v0・Roo Code・Blackbox AI
                などが採用。本番環境への影響はゼロ。
              </div>
              <span className={`${styles.cardTag} ${styles.badgeGreen}`}>Persistent 推奨</span>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🧪</div>
              <div className={styles.cardTitle}>コードプレイグラウンド / IDE</div>
              <div className={styles.cardDesc}>
                ユーザーがリアルタイムにコードを書いて実行。各ユーザーが完全に独立した環境を持てる。
              </div>
              <span className={`${styles.cardTag} ${styles.badgeBlue}`}>Persistent 推奨</span>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🔍</div>
              <div className={styles.cardTitle}>CI/CD・テスト分離実行</div>
              <div className={styles.cardDesc}>
                ユーザー投稿コードを本番と切り離してビルド・テスト。使い捨て環境のため後始末不要。
              </div>
              <span className={`${styles.cardTag} ${styles.badgeAmber}`}>Non-persistent 推奨</span>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🚀</div>
              <div className={styles.cardTitle}>開発サーバー / ライブプレビュー</div>
              <div className={styles.cardDesc}>
                Sandbox 内で Dev Server を起動して公開 URL
                を発行。エージェントが生成したアプリを即プレビュー。
              </div>
              <span className={`${styles.cardTag} ${styles.badgePurple}`}>--publish-port</span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 4 SETUP
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="setup">
          <div className={styles.sectionEyebrow}>Section 04</div>
          <h2>セットアップ手順（Step-by-Step）</h2>
          <p className={styles.sectionIntro}>
            5 つのステップで Vercel Sandbox を使い始められます。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_SETUP} id="diag-setup" />
          </div>

          <div className={styles.steps}>
            {/* Step 1 */}
            <div className={styles.step}>
              <div className={styles.stepNum}>1</div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>Vercel CLI のインストール</div>
                <div className={styles.stepDesc}>Vercel CLI をグローバルインストールします。</div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHeader}>
                    <span className={styles.codeLang}>bash</span>
                    <CodeCopyButton className={styles.copyBtn} text="npm install -g vercel" />
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>
                        <span className={styles.ck}>npm</span> install -g vercel
                      </div>
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>プロジェクトの作成・リンク（認証の準備）</div>
                <div className={styles.stepDesc}>
                  <code>vercel link</code> で プロジェクトとリンクすることで OIDC
                  トークン認証が使えるようになります。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHeader}>
                    <span className={styles.codeLang}>bash</span>
                    <CodeCopyButton
                      className={styles.copyBtn}
                      text={`mkdir my-sandbox-project && cd my-sandbox-project\n\n# Vercel にリンク（OIDC トークン認証を有効化）\nvercel link\n\n# 環境変数を取得（VERCEL_OIDC_TOKEN が .env.local に保存される）\nvercel env pull`}
                    />
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>
                        <span className={styles.ck}>mkdir</span> my-sandbox-project &amp;&amp;{" "}
                        <span className={styles.ck}>cd</span> my-sandbox-project
                      </div>
                      <div className={styles.codeLine} />
                      <div className={styles.codeLine}>
                        <span className={styles.cc}>
                          {"# Vercel にリンク（OIDC トークン認証を有効化）"}
                        </span>
                      </div>
                      <div className={styles.codeLine}>
                        <span className={styles.ck}>vercel</span> link
                      </div>
                      <div className={styles.codeLine} />
                      <div className={styles.codeLine}>
                        <span className={styles.cc}>
                          {"# 環境変数を取得（VERCEL_OIDC_TOKEN が .env.local に保存される）"}
                        </span>
                      </div>
                      <div className={styles.codeLine}>
                        <span className={styles.ck}>vercel</span> env pull
                      </div>
                    </code>
                  </pre>
                </div>
                <div
                  className={`${styles.callout} ${styles.calloutAmber}`}
                  style={{ marginTop: "12px" }}
                >
                  <span className={styles.calloutIcon}>⚠️</span>
                  <div>
                    <strong>重要:</strong> OIDC トークンは <strong>12時間で失効</strong>します。
                    長時間の開発では <code>vercel env pull</code> を再実行してください。
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className={styles.step}>
              <div className={styles.stepNum}>3</div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>Sandbox CLI / JS SDK のインストール</div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHeader}>
                    <span className={styles.codeLang}>bash</span>
                    <CodeCopyButton
                      className={styles.copyBtn}
                      text={`# CLI をグローバルインストール\nnpm install -g sandbox\n\n# または npx で直接使用（インストール不要）\nnpx sandbox --help\n\n# JS SDK をプロジェクトに追加\nnpm install @vercel/sandbox\n\n# Python SDK の場合\npip install vercel`}
                    />
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>
                        <span className={styles.cc}>{"# CLI をグローバルインストール"}</span>
                      </div>
                      <div className={styles.codeLine}>
                        <span className={styles.ck}>npm</span> install -g sandbox
                      </div>
                      <div className={styles.codeLine} />
                      <div className={styles.codeLine}>
                        <span className={styles.cc}>
                          {"# または npx で直接使用（インストール不要）"}
                        </span>
                      </div>
                      <div className={styles.codeLine}>
                        <span className={styles.ck}>npx</span> sandbox --help
                      </div>
                      <div className={styles.codeLine} />
                      <div className={styles.codeLine}>
                        <span className={styles.cc}>{"# JS SDK をプロジェクトに追加"}</span>
                      </div>
                      <div className={styles.codeLine}>
                        <span className={styles.ck}>npm</span> install @vercel/sandbox
                      </div>
                      <div className={styles.codeLine} />
                      <div className={styles.codeLine}>
                        <span className={styles.cc}>{"# Python SDK の場合"}</span>
                      </div>
                      <div className={styles.codeLine}>
                        <span className={styles.ck}>pip</span> install vercel
                      </div>
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className={styles.step}>
              <div className={styles.stepNum}>4</div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>認証方法を選択する</div>
                <div className={styles.tblWrap}>
                  <table>
                    <thead>
                      <tr>
                        <th>認証方法</th>
                        <th>使用環境</th>
                        <th>セキュリティ</th>
                        <th>設定コマンド</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>OIDC Token（推奨）</strong>
                        </td>
                        <td>Vercel 上・ローカル開発</td>
                        <td>◎ 自動ローテーション</td>
                        <td>
                          <code>vercel link &amp;&amp; vercel env pull</code>
                        </td>
                      </tr>
                      <tr>
                        <td>Access Token</td>
                        <td>外部 CI/CD・非 Vercel 環境</td>
                        <td>○ 長期間有効</td>
                        <td>Dashboard で手動生成</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className={styles.step}>
              <div className={styles.stepNum}>5</div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>最初の Sandbox を作成する</div>
                <div className={styles.stepDesc}>
                  CLI で 1 コマンドか、JS SDK で数行 of コードで起動できます。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHeader}>
                    <span className={styles.codeLang}>bash</span>
                    <CodeCopyButton
                      className={styles.copyBtn}
                      text="npx sandbox create --connect"
                    />
                  </div>
                  <pre>
                    <code className="language-bash">
                      <div className={styles.codeLine}>
                        <span className={styles.cc}>
                          {"# CLI で最速スタート（作成してシェルに接続）"}
                        </span>
                      </div>
                      <div className={styles.codeLine}>
                        <span className={styles.ck}>npx</span> sandbox create --connect
                      </div>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 5 CORE CONCEPTS
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="concepts">
          <div className={styles.sectionEyebrow}>Section 05</div>
          <h2>コアコンセプト：Sandbox 和 Session</h2>
          <p className={styles.sectionIntro}>
            Vercel Sandbox を使いこなすために、<strong>Sandbox</strong>・<strong>Session</strong>・
            <strong>Snapshot</strong> の 3 つの概念を理解しましょう。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_CONCEPTS} id="diag-concepts" />
            <p className={styles.mermaidCaption}>
              Sandbox（長期的な存在）の中で Session（単一の VM 起動）が繰り返される
            </p>
          </div>

          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>概念</th>
                  <th>説明</th>
                  <th>ライフタイム</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Sandbox</strong>
                  </td>
                  <td>
                    <code>name</code> で識別される長期的な存在。設定・Snapshot を保持
                  </td>
                  <td>プロジェクトが存在する限り</td>
                </tr>
                <tr>
                  <td>
                    <strong>Session</strong>
                  </td>
                  <td>Sandbox 内で起動する単一の VM インスタンス</td>
                  <td>コマンド実行中〜停止まで</td>
                </tr>
                <tr>
                  <td>
                    <strong>Snapshot</strong>
                  </td>
                  <td>Session 停止時に自動保存されるファイルシステムの状態</td>
                  <td>設定した有効期限まで</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 6 PERSISTENT VS NON-PERSISTENT
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="persistent-vs">
          <div className={styles.sectionEyebrow}>Section 06</div>
          <h2>永続的 vs 一時的サンドボックス</h2>
          <p className={styles.sectionIntro}>
            Vercel Sandbox にはデフォルトの <strong>Persistent（永続）</strong>{" "}
            モードと、一時タスク向けの <strong>Non-persistent（一時）</strong> モードがあります。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_PERSISTENT_VS} id="diag-persistent-vs" />
          </div>

          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>Persistent（デフォルト）</th>
                  <th>Non-persistent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>停止時の挙動</td>
                  <td>✅ 自動スナップショット保存</td>
                  <td>❌ 状態は破棄</td>
                </tr>
                <tr>
                  <td>再開方法</td>
                  <td>
                    <code>Sandbox.get(&#123; name &#125;)</code> で自動再開
                  </td>
                  <td>不可（新規作成のみ）</td>
                </tr>
                <tr>
                  <td>スナップショット管理</td>
                  <td>自動（手動管理不要）</td>
                  <td>なし</td>
                </tr>
                <tr>
                  <td>ストレージ課金</td>
                  <td>Snapshot Storage が発生</td>
                  <td>発生しない</td>
                </tr>
                <tr>
                  <td>主な用途</td>
                  <td>開発環境・エージェントワークスペース・長期ジョブ</td>
                  <td>CI/CD・ビルド専用・使い捨てタスク</td>
                </tr>
                <tr>
                  <td>作成時の指定</td>
                  <td>デフォルト（省略可）</td>
                  <td>
                    <code>persistent: false</code> または <code>--non-persistent</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 7 FIRST SANDBOX
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="first-sandbox">
          <div className={styles.sectionEyebrow}>Section 07</div>
          <h2>はじめての Sandbox を作る</h2>

          <h3>CLI で最速スタート（1コマンド）</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>bash</span>
              <CodeCopyButton
                className={styles.copyBtn}
                text={`# Sandbox を作成してインタラクティブシェルに接続\nnpx sandbox create --connect\n\n# 名前を指定して作成\nsandbox create --name my-first-sandbox --connect`}
              />
            </div>
            <pre>
              <code className="language-bash">
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    {"# Sandbox を作成してインタラクティブシェルに接続"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>npx</span> sandbox create --connect
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# 名前を指定して作成"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> create --name my-first-sandbox
                  --connect
                </div>
              </code>
            </pre>
          </div>

          <h3>JS SDK で最小コード</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>typescript</span>
              <CodeCopyButton
                className={styles.copyBtn}
                text={`import { Sandbox } from "@vercel/sandbox";\n\nasync function main() {\n  // 1. サンドボックスを作成（persistent がデフォルト）\n  const sandbox = await Sandbox.create({\n    name: "my-first-sandbox",    // 省略するとランダム名が生成される\n    runtime: "node24",           // デフォルトは node24\n    timeout: 5 * 60 * 1000,     // タイムアウト: 5分（ミリ秒単位）\n  });\n\n  // 2. コマンドを実行\n  const result = await sandbox.runCommand("node", [\n    "-e",\n    'console.log("Hello from Vercel Sandbox!")',\n  ]);\n  console.log("Exit code:", result.exitCode);       // 0\n  console.log("Output:", await result.stdout());    // Hello from...\n\n  // 3. 停止（persistent なので自動スナップショット保存）\n  await sandbox.stop();\n}\n\nmain();`}
              />
            </div>
            <pre>
              <code className="language-typescript">
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span> &#123; Sandbox &#125;{" "}
                  <span className={styles.ck}>from</span>{" "}
                  <span className={styles.cs}>&quot;@vercel/sandbox&quot;</span>
                  {";"}
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.ck}>async</span>{" "}
                  <span className={styles.ck}>function</span> main() &#123;
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.cc}>
                    {"// 1. サンドボックスを作成（persistent がデフォルト）"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.ck}>const</span>{" "}
                  <span className={styles.cv}>sandbox</span> ={" "}
                  <span className={styles.ck}>await</span> Sandbox.create(&#123;
                </div>
                <div className={styles.codeLine}>
                  {"    "}name: <span className={styles.cs}>&quot;my-first-sandbox&quot;</span>,{" "}
                  <span className={styles.cc}>{"// 省略するとランダム名が生成される"}</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}runtime: <span className={styles.cs}>&quot;node24&quot;</span>,{" "}
                  <span className={styles.cc}>{"// デフォルト is node24"}</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}timeout: <span className={styles.nm}>5</span> *{" "}
                  <span className={styles.nm}>60</span> * <span className={styles.nm}>1000</span>,{" "}
                  <span className={styles.cc}>{"// タイムアウト: 5分（ミリ秒単位）"}</span>
                </div>
                <div className={styles.codeLine}>{"  "}&#125;);</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.cc}>{"// 2. コマンドを実行"}</span>
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.ck}>const</span> <span className={styles.cv}>result</span>{" "}
                  = <span className={styles.ck}>await</span> sandbox.runCommand(
                  <span className={styles.cs}>&quot;node&quot;</span>, [
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.cs}>&quot;-e&quot;</span>,
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.cs}>
                    &apos;console.log(&quot;Hello from Vercel Sandbox!&quot;)&apos;
                  </span>
                  ,
                </div>
                <div className={styles.codeLine}>{"  "}]);</div>
                <div className={styles.codeLine}>
                  {"  "}console.log(<span className={styles.cs}>&quot;Exit code:&quot;</span>,
                  result.exitCode); <span className={styles.cc}>{"// 0"}</span>
                </div>
                <div className={styles.codeLine}>
                  {"  "}console.log(<span className={styles.cs}>&quot;Output:&quot;</span>,{" "}
                  <span className={styles.ck}>await</span> result.stdout());{" "}
                  <span className={styles.cc}>{"// Hello from..."}</span>
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.cc}>
                    {"// 3. 停止（persistent なので自動スナップショット保存）"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.ck}>await</span> sandbox.stop();
                </div>
                <div className={styles.codeLine}>&#125;</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>main();</div>
              </code>
            </pre>
          </div>

          <h3>作成〜実行フロー</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_FLOW} id="diag-flow" />
            <p className={styles.mermaidCaption}>Sandbox 作成から停止まで全体フロー</p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 8 JS SDK
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="sdk">
          <div className={styles.sectionEyebrow}>Section 08</div>
          <h2>JS SDK 実践ガイド</h2>

          <h3>主要メソッド一覧</h3>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>メソッド</th>
                  <th>用途</th>
                  <th>戻り値</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>Sandbox.create()</code>
                  </td>
                  <td>新規 Sandbox を作成</td>
                  <td>
                    <code>Promise&lt;Sandbox&gt;</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>Sandbox.get()</code>
                  </td>
                  <td>既存 Sandbox を名前で取得</td>
                  <td>
                    <code>Promise&lt;Sandbox&gt;</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>Sandbox.getOrCreate()</code>
                  </td>
                  <td>
                    あれば再開・なければ作成（<strong>推奨</strong>）
                  </td>
                  <td>
                    <code>Promise&lt;Sandbox&gt;</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>Sandbox.fork()</code>
                  </td>
                  <td>既存 Sandbox をフォーク</td>
                  <td>
                    <code>Promise&lt;Sandbox&gt;</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>Sandbox.list()</code>
                  </td>
                  <td>Sandbox 一覧を取得（async-iterable）</td>
                  <td>
                    <code>Promise&lt;Paginated&gt;</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>sandbox.runCommand()</code>
                  </td>
                  <td>コマンドを実行</td>
                  <td>
                    <code>Promise&lt;CommandFinished&gt;</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>sandbox.writeFiles()</code>
                  </td>
                  <td>ファイルを書き込む</td>
                  <td>
                    <code>Promise&lt;void&gt;</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>sandbox.readFileToBuffer()</code>
                  </td>
                  <td>ファイルを読み込む</td>
                  <td>
                    <code>Promise&lt;Buffer|null&gt;</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>sandbox.domain()</code>
                  </td>
                  <td>公開 URL を取得</td>
                  <td>
                    <code>string</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>sandbox.stop()</code>
                  </td>
                  <td>Sandbox を停止</td>
                  <td>
                    <code>Promise&lt;...&gt;</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>sandbox.update()</code>
                  </td>
                  <td>設定を動的に更新</td>
                  <td>
                    <code>Promise&lt;void&gt;</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>sandbox.delete()</code>
                  </td>
                  <td>完全削除（Snapshot も消去）</td>
                  <td>
                    <code>Promise&lt;void&gt;</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>sandbox.extendTimeout()</code>
                  </td>
                  <td>タイムアウト延長</td>
                  <td>
                    <code>Promise&lt;void&gt;</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>sandbox.snapshot()</code>
                  </td>
                  <td>手動スナップショット</td>
                  <td>
                    <code>Promise&lt;Snapshot&gt;</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>パターン A：一時タスク向け（Non-persistent）</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>typescript</span>
              <CodeCopyButton
                className={styles.copyBtn}
                text={`const sandbox = await Sandbox.create({\n  persistent: false,            // 停止後に状態を破棄（Snapshot 課金なし）\n  timeout: 15 * 60 * 1000,     // 15分\n});\n\ntry {\n  await sandbox.runCommand("npm", ["test"]);\n} finally {\n  await sandbox.stop();         // 状態は破棄される\n}`}
              />
            </div>
            <pre>
              <code className="language-typescript">
                <div className={styles.codeLine}>
                  <span className={styles.ck}>const</span>{" "}
                  <span className={styles.cv}>sandbox</span> ={" "}
                  <span className={styles.ck}>await</span> Sandbox.create(&#123;
                </div>
                <div className={styles.codeLine}>
                  {"  "}persistent: <span className={styles.ck}>false</span>,{" "}
                  <span className={styles.cc}>{"// 停止後に状態を破棄（Snapshot 課金なし）"}</span>
                </div>
                <div className={styles.codeLine}>
                  {"  "}timeout: <span className={styles.nm}>15</span> *{" "}
                  <span className={styles.nm}>60</span> * <span className={styles.nm}>1000</span>,{" "}
                  <span className={styles.cc}>{"// 15分"}</span>
                </div>
                <div className={styles.codeLine}>&#125;);</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.ck}>try</span> &#123;
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.ck}>await</span> sandbox.runCommand(
                  <span className={styles.cs}>&quot;npm&quot;</span>, [
                  <span className={styles.cs}>&quot;test&quot;</span>]);
                </div>
                <div className={styles.codeLine}>
                  &#125; <span className={styles.ck}>finally</span> &#123;
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.ck}>await</span> sandbox.stop();{" "}
                  <span className={styles.cc}>{"// 状態は破棄される"}</span>
                </div>
                <div className={styles.codeLine}>&#125;</div>
              </code>
            </pre>
          </div>

          <h3>パターン B：長期利用向け getOrCreate（最推奨）</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_GETORCREATE} id="diag-getorcreate" />
            <p className={styles.mermaidCaption}>getOrCreate の 3 つの動作分岐</p>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>typescript</span>
              <CodeCopyButton
                className={styles.copyBtn}
                text={`const sandbox = await Sandbox.getOrCreate({\n  name: "dev-environment",\n  runtime: "node24",\n\n  // 🔴 初回作成時のみ実行（重い初期化）\n  onCreate: async (sbx) => {\n    await sbx.runCommand("git", ["clone", "https://github.com/your/repo", "."]);\n    await sbx.runCommand("npm", ["install"]);\n    console.log("初回セットアップ完了！（次回から skip）");\n  },\n\n  // 🔵 再開のたびに実行（バックグラウンドサービスの再起動等）\n  onResume: async (sbx) => {\n    await sbx.runCommand({\n      cmd: "npm",\n      args: ["run", "dev"],\n      detached: true,           // バックグラウンドで実行\n    });\n    console.log("Dev サーバー起動！");\n  },\n});`}
              />
            </div>
            <pre>
              <code className="language-typescript">
                <div className={styles.codeLine}>
                  <span className={styles.ck}>const</span>{" "}
                  <span className={styles.cv}>sandbox</span> ={" "}
                  <span className={styles.ck}>await</span> Sandbox.getOrCreate(&#123;
                </div>
                <div className={styles.codeLine}>
                  {"  "}name: <span className={styles.cs}>&quot;dev-environment&quot;</span>,
                </div>
                <div className={styles.codeLine}>
                  {"  "}runtime: <span className={styles.cs}>&quot;node24&quot;</span>,
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.cc}>{"// 🔴 初回作成時のみ実行（重い初期化）"}</span>
                </div>
                <div className={styles.codeLine}>
                  {"  "}onCreate: <span className={styles.ck}>async</span> (
                  <span className={styles.cv}>sbx</span>) =&gt; &#123;
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.ck}>await</span> sbx.runCommand(
                  <span className={styles.cs}>&quot;git&quot;</span>, [
                  <span className={styles.cs}>&quot;clone&quot;</span>,{" "}
                  <span className={styles.cs}>&quot;https://github.com/your/repo&quot;</span>,{" "}
                  <span className={styles.cs}>&quot;.&quot;</span>]);
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.ck}>await</span> sbx.runCommand(
                  <span className={styles.cs}>&quot;npm&quot;</span>, [
                  <span className={styles.cs}>&quot;install&quot;</span>]);
                </div>
                <div className={styles.codeLine}>
                  {"    "}console.log(
                  <span className={styles.cs}>
                    &quot;初回セットアップ完了！（次回から skip）&quot;
                  </span>
                  );
                </div>
                <div className={styles.codeLine}>{"  "}&#125;,</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.cc}>
                    {"// 🔵 再開のたびに実行（バックグラウンドサービスの再起動等）"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  {"  "}onResume: <span className={styles.ck}>async</span> (
                  <span className={styles.cv}>sbx</span>) =&gt; &#123;
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.ck}>await</span> sbx.runCommand(&#123;
                </div>
                <div className={styles.codeLine}>
                  {"      "}cmd: <span className={styles.cs}>&quot;npm&quot;</span>,
                </div>
                <div className={styles.codeLine}>
                  {"      "}args: [<span className={styles.cs}>&quot;run&quot;</span>,{" "}
                  <span className={styles.cs}>&quot;dev&quot;</span>],
                </div>
                <div className={styles.codeLine}>
                  {"      "}detached: <span className={styles.ck}>true</span>,{" "}
                  <span className={styles.cc}>{"// バックグラウンドで実行"}</span>
                </div>
                <div className={styles.codeLine}>{"    "}&#125;);</div>
                <div className={styles.codeLine}>
                  {"    "}console.log(
                  <span className={styles.cs}>&quot;Dev サーバー起動！&quot;</span>);
                </div>
                <div className={styles.codeLine}>{"  "}&#125;,</div>
                <div className={styles.codeLine}>&#125;);</div>
              </code>
            </pre>
          </div>

          <h3>ファイル操作</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>typescript</span>
              <CodeCopyButton
                className={styles.copyBtn}
                text={`// ファイルの書き込み\nawait sandbox.writeFiles([\n  {\n    path: "/vercel/sandbox/src/index.ts",\n    content: Buffer.from(\`export const hello = () => "world";\`),\n  },\n  {\n    path: "/vercel/sandbox/scripts/run.sh",\n    content: Buffer.from("#!/bin/bash\\nnpm start"),\n    mode: 0o755,                // 実行権限を付与（chmod +x 相当）\n  },\n]);\n\n// ファイルの読み込み\nconst buf = await sandbox.readFileToBuffer({ path: "dist/output.js" });\nif (buf) console.log(buf.toString());\n\n// ローカルにダウンロード\nawait sandbox.downloadFile(\n  { path: "/vercel/sandbox/coverage/lcov.info" },\n  { path: "./reports/lcov.info", mkdirRecursive: true }\n);`}
              />
            </div>
            <pre>
              <code className="language-typescript">
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"// ファイルの書き込み"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>await</span> sandbox.writeFiles([
                </div>
                <div className={styles.codeLine}>{"  "}&#123;</div>
                <div className={styles.codeLine}>
                  {"    "}path:{" "}
                  <span className={styles.cs}>&quot;/vercel/sandbox/src/index.ts&quot;</span>,
                </div>
                <div className={styles.codeLine}>
                  {"    "}content: Buffer.from(
                  <span className={styles.cs}>
                    `export const hello = () =&gt; &quot;world&quot;;`
                  </span>
                  ),
                </div>
                <div className={styles.codeLine}>{"  "}&#125;,</div>
                <div className={styles.codeLine}>{"  "}&#123;</div>
                <div className={styles.codeLine}>
                  {"    "}path:{" "}
                  <span className={styles.cs}>&quot;/vercel/sandbox/scripts/run.sh&quot;</span>,
                </div>
                <div className={styles.codeLine}>
                  {"    "}content: Buffer.from(
                  <span className={styles.cs}>&quot;#!/bin/bash\\nnpm start&quot;</span>),
                </div>
                <div className={styles.codeLine}>
                  {"    "}mode: <span className={styles.nm}>0o755</span>,{" "}
                  <span className={styles.cc}>{"// 実行権限を付与（chmod +x 相当）"}</span>
                </div>
                <div className={styles.codeLine}>{"  "}&#125;,</div>
                <div className={styles.codeLine}>]);</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"// ファイルの読み込み"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>const</span> <span className={styles.cv}>buf</span> ={" "}
                  <span className={styles.ck}>await</span> sandbox.readFileToBuffer(&#123; path:{" "}
                  <span className={styles.cs}>&quot;dist/output.js&quot;</span> &#125;);
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>if</span> (buf) console.log(buf.toString());
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"// ローカルにダウンロード"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>await</span> sandbox.downloadFile(
                </div>
                <div className={styles.codeLine}>
                  {"  "}&#123; path:{" "}
                  <span className={styles.cs}>&quot;/vercel/sandbox/coverage/lcov.info&quot;</span>{" "}
                  &#125;,
                </div>
                <div className={styles.codeLine}>
                  {"  "}&#123; path:{" "}
                  <span className={styles.cs}>&quot;./reports/lcov.info&quot;</span>,
                  mkdirRecursive: <span className={styles.ck}>true</span> &#125;
                </div>
                <div className={styles.codeLine}>);</div>
              </code>
            </pre>
          </div>

          <h3>ポート公開（Dev サーバーのプレビュー URL）</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>typescript</span>
              <CodeCopyButton
                className={styles.copyBtn}
                text={`const sandbox = await Sandbox.create({\n  name: "web-preview",\n  ports: [3000, 8080],           // 公開するポート番号\n});\n\n// Dev サーバーをバックグラウンドで起動\nawait sandbox.runCommand({\n  cmd: "npm",\n  args: ["run", "dev"],\n  detached: true,\n});\n\n// 公開 URL を取得\nconst previewUrl = sandbox.domain(3000);\nconsole.log("プレビュー URL:", previewUrl);\n// => https://xxxxxxxx-3000.sandbox.vercel.app`}
              />
            </div>
            <pre>
              <code className="language-typescript">
                <div className={styles.codeLine}>
                  <span className={styles.ck}>const</span>{" "}
                  <span className={styles.cv}>sandbox</span> ={" "}
                  <span className={styles.ck}>await</span> Sandbox.create(&#123;
                </div>
                <div className={styles.codeLine}>
                  {"  "}name: <span className={styles.cs}>&quot;web-preview&quot;</span>,
                </div>
                <div className={styles.codeLine}>
                  {"  "}ports: [<span className={styles.nm}>3000</span>,{" "}
                  <span className={styles.nm}>8080</span>],{" "}
                  <span className={styles.cc}>{"// 公開するポート番号"}</span>
                </div>
                <div className={styles.codeLine}>&#125;);</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"// Dev サーバーをバックグラウンドで起動"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>await</span> sandbox.runCommand(&#123;
                </div>
                <div className={styles.codeLine}>
                  {"  "}cmd: <span className={styles.cs}>&quot;npm&quot;</span>,
                </div>
                <div className={styles.codeLine}>
                  {"  "}args: [<span className={styles.cs}>&quot;run&quot;</span>,{" "}
                  <span className={styles.cs}>&quot;dev&quot;</span>],
                </div>
                <div className={styles.codeLine}>
                  {"  "}detached: <span className={styles.ck}>true</span>,
                </div>
                <div className={styles.codeLine}>&#125;);</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"// 公開 URL を取得"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>const</span>{" "}
                  <span className={styles.cv}>previewUrl</span> = sandbox.domain(
                  <span className={styles.nm}>3000</span>);
                </div>
                <div className={styles.codeLine}>
                  console.log(<span className={styles.cs}>&quot;プレビュー URL:&quot;</span>,
                  previewUrl);
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    {"// =&gt; https://xxxxxxxx-3000.sandbox.vercel.app"}
                  </span>
                </div>
              </code>
            </pre>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 9 CLI
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="cli">
          <div className={styles.sectionEyebrow}>Section 09</div>
          <h2>CLI 完全リファレンス</h2>

          <h3>コマンド全体マップ</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_CLI} id="diag-cli" />
            <p className={styles.mermaidCaption}>sandbox CLI の全コマンド体系</p>
          </div>

          <h3>よく使うコマンド実例</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>bash</span>
              <CodeCopyButton
                className={styles.copyBtn}
                text={`# ─── 作成 ──────────────────────────────────────────────\n# 基本（Node.js 24）\nsandbox create --name my-sandbox\n\n# Python ランタイムで 1 時間タイムアウト\nsandbox create --runtime python3.13 --timeout 1h --name py-box\n\n# 作成と同時にシェルに接続\nsandbox create --name dev-box --connect\n\n# ポートを公開（Dev サーバー向け）\nsandbox create --name web-app --publish-port 3000\n\n# 非永続（一時）サンドボックス\nsandbox create --name ci-task --non-persistent\n\n# Snapshot 7日保持 + 最新1件のみ\nsandbox create --name long-lived \\\n  --snapshot-expiration 7d \\\n  --keep-last-snapshots 1\n\n# ─── コマンド実行 ───────────────────────────────────────\n# 停止中でも自動再開してからコマンド実行\nsandbox run --name my-sandbox -- npm test\n\n# 起動中の Sandbox にコマンドを送信\nsandbox exec my-sandbox -- node script.js\n\n# sudo でシステムパッケージをインストール\nsandbox exec --sudo my-sandbox -- dnf install -y curl\n\n# インタラクティブシェルに接続\nsandbox connect my-sandbox\n\n# ─── ファイル操作 ──────────────────────────────────────\n# ローカル → Sandbox\nsandbox copy ./local.txt my-sandbox:/vercel/sandbox/remote.txt\n\n# Sandbox → ローカル\nsandbox copy my-sandbox:/vercel/sandbox/output.log ./logs/\n\n# ─── 設定変更 ──────────────────────────────────────────\nsandbox config list my-sandbox           # 現在の設定を確認\nsandbox config vcpus my-sandbox 4        # 4 vCPU に変更\nsandbox config timeout my-sandbox 30m   # タイムアウト 30 分\nsandbox config tags my-sandbox --tag env=staging --tag team=backend\n\n# ─── 停止・削除 ────────────────────────────────────────\nsandbox stop my-sandbox                  # 停止（Snapshot 保存）\nsandbox remove my-sandbox               # 完全削除（Snapshot も消去）`}
              />
            </div>
            <pre>
              <code className="language-bash">
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    {"# ─── 作成 ──────────────────────────────────────────────"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# 基本（Node.js 24）"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> create --name my-sandbox
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# Python ランタイムで 1 時間タイムアウト"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> create --runtime python3.13 --timeout
                  1h --name py-box
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# 作成と同時にシェルに接続"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> create --name dev-box --connect
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# ポートを公開（Dev サーバー向け）"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> create --name web-app --publish-port
                  3000
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# 非永続（一時）サンドボックス"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> create --name ci-task --non-persistent
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# Snapshot 7日保持 + 最新1件のみ"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> create --name long-lived \
                </div>
                <div className={styles.codeLine}>{"  "}--snapshot-expiration 7d \</div>
                <div className={styles.codeLine}>{"  "}--keep-last-snapshots 1</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    {"# ─── コマンド実行 ───────────────────────────────────────"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# 停止中でも自動再開してからコマンド実行"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> run --name my-sandbox -- npm test
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# 起動中の Sandbox にコマンドを送信"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> exec my-sandbox -- node script.js
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# sudo でシステムパッケージをインストール"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> exec --sudo my-sandbox -- dnf install
                  -y curl
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# インタラクティブシェルに接続"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> connect my-sandbox
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    {"# ─── ファイル操作 ──────────────────────────────────────"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# ローカル → Sandbox"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> copy ./local.txt
                  my-sandbox:/vercel/sandbox/remote.txt
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# Sandbox → ローカル"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> copy
                  my-sandbox:/vercel/sandbox/output.log ./logs/
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    {"# ─── 設定変更 ──────────────────────────────────────────"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> config list my-sandbox{" "}
                  <span className={styles.cc}>{"# 現在の設定を確認"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> config vcpus my-sandbox 4{" "}
                  <span className={styles.cc}>{"# 4 vCPU に変更"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> config timeout my-sandbox 30m{" "}
                  <span className={styles.cc}>{"# タイムアウト 30 分"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> config tags my-sandbox --tag
                  env=staging --tag team=backend
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    {"# ─── 停止・削除 ────────────────────────────────────────"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> stop my-sandbox{" "}
                  <span className={styles.cc}>{"# 停止（Snapshot 保存）"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> remove my-sandbox{" "}
                  <span className={styles.cc}>{"# 完全削除（Snapshot も消去）"}</span>
                </div>
              </code>
            </pre>
          </div>

          <h3>run vs exec の違い</h3>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>コマンド</th>
                  <th>対象 Sandbox の状態</th>
                  <th>動作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>sandbox run</code>
                  </td>
                  <td>停止中・起動中どちらでも OK</td>
                  <td>
                    停止中なら <strong>自動的に再開</strong>してから実行
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>sandbox exec</code>
                  </td>
                  <td>
                    <strong>起動中のみ</strong>
                  </td>
                  <td>停止中の場合はエラー</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 10 PERSISTENT SANDBOXES DETAIL
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="persistent-detail">
          <div className={styles.sectionEyebrow}>Section 10</div>
          <h2>永続的サンドボックスの詳細</h2>

          <h3>ライフサイクル全体フロー（シーケンス）</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_LIFECYCLE} id="diag-lifecycle" />
            <p className={styles.mermaidCaption}>
              停止 → スナップショット → 再開 の完全なシーケンス
            </p>
          </div>

          <h3>ライフサイクルフック（onCreate と onResume）</h3>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>フック</th>
                  <th>実行タイミング</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>onCreate</code>
                  </td>
                  <td>
                    Sandbox が<strong>初回作成されたとき</strong>のみ
                  </td>
                  <td>重い初期化（git clone、npm install 等）</td>
                </tr>
                <tr>
                  <td>
                    <code>onResume</code>
                  </td>
                  <td>
                    <strong>毎回の再開時</strong>（自動再開も含む）
                  </td>
                  <td>バックグラウンドサービスの再起動、キャッシュの再読み込み</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>typescript</span>
              <CodeCopyButton
                className={styles.copyBtn}
                text={`const sandbox = await Sandbox.getOrCreate({\n  name: "agent-workspace",\n\n  // ✅ 初回のみ（重い処理）\n  onCreate: async (sbx) => {\n    await sbx.runCommand("git", ["clone", repoUrl, "."]);\n    await sbx.runCommand("npm", ["install"]);\n    await sbx.runCommand("pip", ["install", "-r", "requirements.txt"]);\n  },\n\n  // ✅ 毎回の再開時（軽量な再起動）\n  onResume: async (sbx) => {\n    await sbx.runCommand({ cmd: "redis-server", detached: true });\n    await sbx.runCommand({ cmd: "npm", args: ["run", "dev"], detached: true });\n  },\n});`}
              />
            </div>
            <pre>
              <code className="language-typescript">
                <div className={styles.codeLine}>
                  <span className={styles.ck}>const</span>{" "}
                  <span className={styles.cv}>sandbox</span> ={" "}
                  <span className={styles.ck}>await</span> Sandbox.getOrCreate(&#123;
                </div>
                <div className={styles.codeLine}>
                  {"  "}name: <span className={styles.cs}>&quot;agent-workspace&quot;</span>,
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.cc}>{"// ✅ 初回のみ（重い処理）"}</span>
                </div>
                <div className={styles.codeLine}>
                  {"  "}onCreate: <span className={styles.ck}>async</span> (
                  <span className={styles.cv}>sbx</span>) =&gt; &#123;
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.ck}>await</span> sbx.runCommand(
                  <span className={styles.cs}>&quot;git&quot;</span>, [
                  <span className={styles.cs}>&quot;clone&quot;</span>, repoUrl,{" "}
                  <span className={styles.cs}>&quot;.&quot;</span>]);
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.ck}>await</span> sbx.runCommand(
                  <span className={styles.cs}>&quot;npm&quot;</span>, [
                  <span className={styles.cs}>&quot;install&quot;</span>]);
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.ck}>await</span> sbx.runCommand(
                  <span className={styles.cs}>&quot;pip&quot;</span>, [
                  <span className={styles.cs}>&quot;install&quot;</span>,{" "}
                  <span className={styles.cs}>&quot;-r&quot;</span>,{" "}
                  <span className={styles.cs}>&quot;requirements.txt&quot;</span>]);
                </div>
                <div className={styles.codeLine}>{"  "}&#125;,</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.cc}>{"// ✅ 毎回の再開時（軽量な再起動）"}</span>
                </div>
                <div className={styles.codeLine}>
                  {"  "}onResume: <span className={styles.ck}>async</span> (
                  <span className={styles.cv}>sbx</span>) =&gt; &#123;
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.ck}>await</span> sbx.runCommand(&#123; cmd:{" "}
                  <span className={styles.cs}>&quot;redis-server&quot;</span>, detached:{" "}
                  <span className={styles.ck}>true</span> &#125;);
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.ck}>await</span> sbx.runCommand(&#123; cmd:{" "}
                  <span className={styles.cs}>&quot;npm&quot;</span>, args: [
                  <span className={styles.cs}>&quot;run&quot;</span>,{" "}
                  <span className={styles.cs}>&quot;dev&quot;</span>], detached:{" "}
                  <span className={styles.ck}>true</span> &#125;);
                </div>
                <div className={styles.codeLine}>{"  "}&#125;,</div>
                <div className={styles.codeLine}>&#125;);</div>
              </code>
            </pre>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 11 SNAPSHOTS
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="snapshots">
          <div className={styles.sectionEyebrow}>Section 11</div>
          <h2>スナップショット管理</h2>

          <h3>スナップショット保持ポリシーのフロー</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_SNAPSHOTS} id="diag-snapshots" />
          </div>

          <h3>推奨設定（コスト最小化）</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>typescript</span>
              <CodeCopyButton
                className={styles.copyBtn}
                text={`// ✅ 最新 1 件のみ保持してストレージコストを最小化\nconst sandbox = await Sandbox.create({\n  name: "my-sandbox",\n  snapshotExpiration: 7 * 24 * 60 * 60 * 1000,   // 7日\n  keepLastSnapshots: {\n    count: 1,               // 最新 1 件のみ\n    deleteEvicted: true,    // 古いものは即座に削除\n  },\n});`}
              />
            </div>
            <pre>
              <code className="language-typescript">
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    {"// ✅ 最新 1 件のみ保持してストレージコストを最小化"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>const</span>{" "}
                  <span className={styles.cv}>sandbox</span> ={" "}
                  <span className={styles.ck}>await</span> Sandbox.create(&#123;
                </div>
                <div className={styles.codeLine}>
                  {"  "}name: <span className={styles.cs}>&quot;my-sandbox&quot;</span>,
                </div>
                <div className={styles.codeLine}>
                  {"  "}snapshotExpiration: <span className={styles.nm}>7</span> *{" "}
                  <span className={styles.nm}>24</span> * <span className={styles.nm}>60</span> *{" "}
                  <span className={styles.nm}>60</span> * <span className={styles.nm}>1000</span>,{" "}
                  <span className={styles.cc}>{"// 7日"}</span>
                </div>
                <div className={styles.codeLine}>{"  "}keepLastSnapshots: &#123;</div>
                <div className={styles.codeLine}>
                  {"    "}count: <span className={styles.nm}>1</span>,{" "}
                  <span className={styles.cc}>{"// 最新 1 件のみ"}</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}deleteEvicted: <span className={styles.ck}>true</span>,{" "}
                  <span className={styles.cc}>{"// 古いものは即座に削除"}</span>
                </div>
                <div className={styles.codeLine}>{"  "}&#125;,</div>
                <div className={styles.codeLine}>&#125;);</div>
              </code>
            </pre>
          </div>

          <h3>スナップショット操作コマンド</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>bash</span>
              <CodeCopyButton
                className={styles.copyBtn}
                text={`# 手動でスナップショットを作成\nsandbox snapshot my-sandbox\n\n# スナップショット一覧を表示\nsandbox snapshots list my-sandbox\n\n# 特定スナップショットに巻き戻し\nsandbox config current-snapshot my-sandbox snap_abc123\n\n# 特定スナップショットから新規 Sandbox を作成\nsandbox create --name forked-sandbox --snapshot snap_abc123\n\n# 既存 Sandbox をフォーク（スナップショットを継承）\nsandbox fork my-sandbox --name my-fork`}
              />
            </div>
            <pre>
              <code className="language-bash">
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# 手動でスナップショットを作成"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> snapshot my-sandbox
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# スナップショット一覧を表示"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> snapshots list my-sandbox
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# 特定スナップショットに巻き戻し"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> config current-snapshot my-sandbox
                  snap_abc123
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    {"# 特定スナップショットから新規 Sandbox を作成"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> create --name forked-sandbox --snapshot
                  snap_abc123
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    {"# 既存 Sandbox をフォーク（スナップショットを継承）"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> fork my-sandbox --name my-fork
                </div>
              </code>
            </pre>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 12 NETWORK POLICY
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="network">
          <div className={styles.sectionEyebrow}>Section 12</div>
          <h2>ネットワークポリシー</h2>

          <h3>3 種類のポリシー</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_NETWORK} id="diag-network" />
          </div>

          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>ポリシー</th>
                  <th>説明</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>allow-all</code>
                  </td>
                  <td>
                    すべての通信を許可（<strong>デフォルト</strong>）
                  </td>
                  <td>開発・テスト</td>
                </tr>
                <tr>
                  <td>
                    <code>deny-all</code>
                  </td>
                  <td>すべての通信を遮断</td>
                  <td>最高セキュリティが必要な実行</td>
                </tr>
                <tr>
                  <td>カスタム</td>
                  <td>ドメイン / CIDR を個別指定</td>
                  <td>特定 API のみ許可</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>bash</span>
              <CodeCopyButton
                className={styles.copyBtn}
                text={`# すべて遮断（最もセキュア）\nsandbox create --name secure-box --network-policy deny-all\n\n# Vercel AI ゲートウェイのみ許可\nsandbox create --name ai-box --allowed-domain ai-gateway.vercel.sh\n\n# ワイルドカードでサブドメインを許可\nsandbox create --name api-box \\\n  --allowed-domain "*.vercel.app" \\\n  --allowed-domain api.example.com\n\n# 実行後に設定変更（動的に変更可能）\nsandbox config network-policy my-sandbox --mode deny-all`}
              />
            </div>
            <pre>
              <code className="language-bash">
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# すべて遮断（最もセキュア）"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> create --name secure-box
                  --network-policy deny-all
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# Vercel AI ゲートウェイのみ許可"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> create --name ai-box --allowed-domain
                  ai-gateway.vercel.sh
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# ワイルドカードでサブドメインを許可"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> create --name api-box \
                </div>
                <div className={styles.codeLine}>
                  {"  "}--allowed-domain <span className={styles.cs}>&quot;*.vercel.app&quot;</span>{" "}
                  \
                </div>
                <div className={styles.codeLine}>{"  "}--allowed-domain api.example.com</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# 実行後に設定変更（動的に変更可能）"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> config network-policy my-sandbox --mode
                  deny-all
                </div>
              </code>
            </pre>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 13 TAGS
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="tags">
          <div className={styles.sectionEyebrow}>Section 13</div>
          <h2>タグによる管理</h2>
          <p className={styles.sectionIntro}>
            タグ（Tags）は Sandbox を <strong>環境・チーム・用途</strong>{" "}
            などで分類するためのキーバリューペアです（最大 5 個）。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_TAGS} id="diag-tags" />
            <p className={styles.mermaidCaption}>タグを使ったフリート管理 of 例</p>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>bash</span>
              <CodeCopyButton
                className={styles.copyBtn}
                text={`# 作成時にタグを付与\nsandbox create --name prod-sandbox \\\n  --tag env=production \\\n  --tag team=backend \\\n  --tag version=2.0\n\n# タグでフィルタして一覧表示\nsandbox list --tag env=staging\n\n# タグを更新（既存タグはすべて置き換え）\nsandbox config tags my-sandbox \\\n  --tag env=production \\\n  --tag team=platform\n\n# タグをすべてクリア\nsandbox config tags my-sandbox`}
              />
            </div>
            <pre>
              <code className="language-bash">
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# 作成時にタグを付与"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> create --name prod-sandbox \
                </div>
                <div className={styles.codeLine}>{"  "}--tag env=production \</div>
                <div className={styles.codeLine}>{"  "}--tag team=backend \</div>
                <div className={styles.codeLine}>{"  "}--tag version=2.0</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# タグでフィルタして一覧表示"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> list --tag env=staging
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# タグを更新（既存タグはすべて置き換え）"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> config tags my-sandbox \
                </div>
                <div className={styles.codeLine}>{"  "}--tag env=production \</div>
                <div className={styles.codeLine}>{"  "}--tag team=platform</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  <span className={styles.cc}>{"# タグをすべてクリア"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>sandbox</span> config tags my-sandbox
                </div>
              </code>
            </pre>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 14 BEST PRACTICES
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="best-practices">
          <div className={styles.sectionEyebrow}>Section 14</div>
          <h2>ベストプラクティス集</h2>

          <h3>全体像</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_BEST_PRACTICES} id="diag-best-practices" />
          </div>

          {/* BP 1 */}
          <h3>✅ BP-1：Snapshot は最新 1 件のみ保持（コスト最小化）</h3>
          <div className={styles.vsGrid}>
            <div className={`${styles.vsCard} ${styles.vsCardBad}`}>
              <span className={`${styles.vsLabel} ${styles.vsLabelBad}`}>❌ 悪い例</span>
              <div className={styles.codeWrap} style={{ margin: 0 }}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeLang}>typescript</span>
                  <CodeCopyButton
                    className={styles.copyBtn}
                    text={`// Snapshot が無制限に蓄積される\nawait Sandbox.create({ name: "my-sandbox" });`}
                  />
                </div>
                <pre>
                  <code className="language-typescript">
                    <div className={styles.codeLine}>
                      <span className={styles.cc}>{"// Snapshot が無制限に蓄積される"}</span>
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.ck}>await</span> Sandbox.create(&#123; name:{" "}
                      <span className={styles.cs}>&quot;my-sandbox&quot;</span> &#125;);
                    </div>
                  </code>
                </pre>
              </div>
            </div>
            <div className={`${styles.vsCard} ${styles.vsCardGood}`}>
              <span className={`${styles.vsLabel} ${styles.vsLabelGood}`}>✅ 良い例</span>
              <div className={styles.codeWrap} style={{ margin: 0 }}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeLang}>typescript</span>
                  <CodeCopyButton
                    className={styles.copyBtn}
                    text={`// 最新 1 件のみ保持してコスト最小化\nawait Sandbox.create({\n  name: "my-sandbox",\n  snapshotExpiration: 7 * 24 * 60 * 60 * 1000,\n  keepLastSnapshots: { count: 1, deleteEvicted: true },\n});`}
                  />
                </div>
                <pre>
                  <code className="language-typescript">
                    <div className={styles.codeLine}>
                      <span className={styles.cc}>{"// 最新 1 件のみ保持してコスト最小化"}</span>
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.ck}>await</span> Sandbox.create(&#123;
                    </div>
                    <div className={styles.codeLine}>
                      {"  "}name: <span className={styles.cs}>&quot;my-sandbox&quot;</span>,
                    </div>
                    <div className={styles.codeLine}>
                      {"  "}snapshotExpiration: <span className={styles.nm}>7</span> *{" "}
                      <span className={styles.nm}>24</span> * <span className={styles.nm}>60</span>{" "}
                      * <span className={styles.nm}>60</span> *{" "}
                      <span className={styles.nm}>1000</span>,
                    </div>
                    <div className={styles.codeLine}>
                      {"  "}keepLastSnapshots: &#123; count: <span className={styles.nm}>1</span>,
                      deleteEvicted: <span className={styles.ck}>true</span> &#125;,
                    </div>
                    <div className={styles.codeLine}>&#125;);</div>
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* BP 2 */}
          <h3>✅ BP-2：CI/CD の使い捨てタスクは Non-persistent</h3>
          <div className={styles.vsGrid}>
            <div className={`${styles.vsCard} ${styles.vsCardBad}`}>
              <span className={`${styles.vsLabel} ${styles.vsLabelBad}`}>❌ 悪い例</span>
              <div className={styles.codeWrap} style={{ margin: 0 }}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeLang}>typescript</span>
                  <CodeCopyButton
                    className={styles.copyBtn}
                    text={`// CI で永続モード → 不要な Snapshot 課金\nawait Sandbox.create({ name: "ci-run-123" });`}
                  />
                </div>
                <pre>
                  <code className="language-typescript">
                    <div className={styles.codeLine}>
                      <span className={styles.cc}>
                        {"// CI で永続モード → 不要な Snapshot 課金"}
                      </span>
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.ck}>await</span> Sandbox.create(&#123; name:{" "}
                      <span className={styles.cs}>&quot;ci-run-123&quot;</span> &#125;);
                    </div>
                  </code>
                </pre>
              </div>
            </div>
            <div className={`${styles.vsCard} ${styles.vsCardGood}`}>
              <span className={`${styles.vsLabel} ${styles.vsLabelGood}`}>✅ 良い例</span>
              <div className={styles.codeWrap} style={{ margin: 0 }}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeLang}>typescript</span>
                  <CodeCopyButton
                    className={styles.copyBtn}
                    text={`// non-persistent で課金ゼロ\nawait Sandbox.create({\n  name: "ci-run-123",\n  persistent: false,\n  timeout: 15 * 60 * 1000,\n});`}
                  />
                </div>
                <pre>
                  <code className="language-typescript">
                    <div className={styles.codeLine}>
                      <span className={styles.cc}>{"// non-persistent で課金ゼロ"}</span>
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.ck}>await</span> Sandbox.create(&#123;
                    </div>
                    <div className={styles.codeLine}>
                      {"  "}name: <span className={styles.cs}>&quot;ci-run-123&quot;</span>,
                    </div>
                    <div className={styles.codeLine}>
                      {"  "}persistent: <span className={styles.ck}>false</span>,
                    </div>
                    <div className={styles.codeLine}>
                      {"  "}timeout: <span className={styles.nm}>15</span> *{" "}
                      <span className={styles.nm}>60</span> *{" "}
                      <span className={styles.nm}>1000</span>,
                    </div>
                    <div className={styles.codeLine}>&#125;);</div>
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* BP 3 */}
          <h3>✅ BP-3：getOrCreate で冪等性を確保</h3>
          <div className={styles.vsGrid}>
            <div className={`${styles.vsCard} ${styles.vsCardBad}`}>
              <span className={`${styles.vsLabel} ${styles.vsLabelBad}`}>❌ 悪い例</span>
              <div className={styles.codeWrap} style={{ margin: 0 }}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeLang}>typescript</span>
                  <CodeCopyButton
                    className={styles.copyBtn}
                    text={`// 2 回目は同名 Sandbox が既に存在しエラー\nconst sb = await Sandbox.create({ name: "dev" });`}
                  />
                </div>
                <pre>
                  <code className="language-typescript">
                    <div className={styles.codeLine}>
                      <span className={styles.cc}>
                        {"// 2 回目は同名 Sandbox が既に存在しエラー"}
                      </span>
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.ck}>const</span> <span className={styles.cv}>sb</span>{" "}
                      = <span className={styles.ck}>await</span> Sandbox.create(&#123; name:{" "}
                      <span className={styles.cs}>&quot;dev&quot;</span> &#125;);
                    </div>
                  </code>
                </pre>
              </div>
            </div>
            <div className={`${styles.vsCard} ${styles.vsCardGood}`}>
              <span className={`${styles.vsLabel} ${styles.vsLabelGood}`}>✅ 良い例</span>
              <div className={styles.codeWrap} style={{ margin: 0 }}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeLang}>typescript</span>
                  <CodeCopyButton
                    className={styles.copyBtn}
                    text={`// 「あれば再開・なければ作成」で常に安全\nconst sb = await Sandbox.getOrCreate({ name: "dev" });`}
                  />
                </div>
                <pre>
                  <code className="language-typescript">
                    <div className={styles.codeLine}>
                      <span className={styles.cc}>
                        {"// 「あれば再開・なければ作成」で常に安全"}
                      </span>
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.ck}>const</span> <span className={styles.cv}>sb</span>{" "}
                      = <span className={styles.ck}>await</span> Sandbox.getOrCreate(&#123; name:{" "}
                      <span className={styles.cs}>&quot;dev&quot;</span> &#125;);
                    </div>
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* BP 4 */}
          <h3>✅ BP-4：name は必ず明示的に指定</h3>
          <div className={styles.vsGrid}>
            <div className={`${styles.vsCard} ${styles.vsCardBad}`}>
              <span className={`${styles.vsLabel} ${styles.vsLabelBad}`}>❌ 悪い例</span>
              <div className={styles.codeWrap} style={{ margin: 0 }}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeLang}>typescript</span>
                  <CodeCopyButton
                    className={styles.copyBtn}
                    text={`// 用途不明なランダム名が生成される\nawait Sandbox.create();`}
                  />
                </div>
                <pre>
                  <code className="language-typescript">
                    <div className={styles.codeLine}>
                      <span className={styles.cc}>{"// 用途不明なランダム名が生成される"}</span>
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.ck}>await</span> Sandbox.create();
                    </div>
                  </code>
                </pre>
              </div>
            </div>
            <div className={`${styles.vsCard} ${styles.vsCardGood}`}>
              <span className={`${styles.vsLabel} ${styles.vsLabelGood}`}>✅ 良い例</span>
              <div className={styles.codeWrap} style={{ margin: 0 }}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeLang}>typescript</span>
                  <CodeCopyButton
                    className={styles.copyBtn}
                    text={`// ユーザー ID 等を含めた意味のある名前\nawait Sandbox.create({\n  name: \`user-\${userId}-workspace\`,\n  tags: { userId, env: "development" },\n});`}
                  />
                </div>
                <pre>
                  <code className="language-typescript">
                    <div className={styles.codeLine}>
                      <span className={styles.cc}>{"// ユーザー ID 等を含めた意味のある名前"}</span>
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.ck}>await</span> Sandbox.create(&#123;
                    </div>
                    <div className={styles.codeLine}>
                      {"  "}name:{" "}
                      <span className={styles.cs}>`user-$&#123;userId&#125;-workspace`</span>,
                    </div>
                    <div className={styles.codeLine}>
                      {"  "}tags: &#123; userId, env:{" "}
                      <span className={styles.cs}>&quot;development&quot;</span> &#125;,
                    </div>
                    <div className={styles.codeLine}>&#125;);</div>
                  </code>
                </pre>
              </div>
            </div>
          </div>

          <h3>✅ BP-5：タイムアウトを用途に合わせて設定</h3>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>用途</th>
                  <th>推奨タイムアウト</th>
                  <th>設定例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>インタラクティブ開発</td>
                  <td>長め（1時間）</td>
                  <td>
                    <code>--timeout 1h</code>
                  </td>
                </tr>
                <tr>
                  <td>AI エージェントのタスク</td>
                  <td>中程度（30分）</td>
                  <td>
                    <code>--timeout 30m</code>
                  </td>
                </tr>
                <tr>
                  <td>CI/CD ビルド</td>
                  <td>短め（15分）</td>
                  <td>
                    <code>--timeout 15m</code>
                  </td>
                </tr>
                <tr>
                  <td>デフォルト</td>
                  <td>5分</td>
                  <td>省略可</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
         § 15 RESOURCES
        ══════════════════════════════════════════════════════════ */}
        <section className={styles.section} id="resources">
          <div className={styles.sectionEyebrow}>Section 15</div>
          <h2>参考ソース / 公式リンク集</h2>
          <p className={styles.sectionIntro}>
            本ガイドの根拠となるソース源です。最新情報は必ず公式ドキュメントをご確認ください。
          </p>

          <h3>公式ドキュメント</h3>
          <div className={styles.resourceGrid}>
            <Ext className={styles.resourceCard} href="https://vercel.com/sandbox">
              <span className={styles.resourceIcon}>🏠</span>
              <div>
                <div className={styles.resourceTitle}>Vercel Sandbox ランディングページ</div>
                <div className={styles.resourceUrl}>vercel.com/sandbox</div>
              </div>
            </Ext>
            <Ext className={styles.resourceCard} href="https://vercel.com/docs/sandbox">
              <span className={styles.resourceIcon}>📖</span>
              <div>
                <div className={styles.resourceTitle}>Vercel Sandbox ドキュメント（概要）</div>
                <div className={styles.resourceUrl}>vercel.com/docs/sandbox</div>
              </div>
            </Ext>
            <Ext
              className={styles.resourceCard}
              href="https://vercel.com/docs/sandbox/cli-reference"
            >
              <span className={styles.resourceIcon}>⌨️</span>
              <div>
                <div className={styles.resourceTitle}>CLI 完全リファレンス</div>
                <div className={styles.resourceUrl}>vercel.com/docs/sandbox/cli-reference</div>
              </div>
            </Ext>
            <Ext
              className={styles.resourceCard}
              href="https://vercel.com/docs/sandbox/sdk-reference"
            >
              <span className={styles.resourceIcon}>📦</span>
              <div>
                <div className={styles.resourceTitle}>JS SDK リファレンス</div>
                <div className={styles.resourceUrl}>vercel.com/docs/sandbox/sdk-reference</div>
              </div>
            </Ext>
            <Ext
              className={styles.resourceCard}
              href="https://vercel.com/docs/sandbox/concepts/persistent-sandboxes"
            >
              <span className={styles.resourceIcon}>♾️</span>
              <div>
                <div className={styles.resourceTitle}>永続的サンドボックス</div>
                <div className={styles.resourceUrl}>
                  vercel.com/docs/sandbox/concepts/persistent-sandboxes
                </div>
              </div>
            </Ext>
            <Ext
              className={styles.resourceCard}
              href="https://vercel.com/docs/sandbox/concepts/snapshots"
            >
              <span className={styles.resourceIcon}>📸</span>
              <div>
                <div className={styles.resourceTitle}>スナップショット</div>
                <div className={styles.resourceUrl}>vercel.com/docs/sandbox/concepts/snapshots</div>
              </div>
            </Ext>
            <Ext className={styles.resourceCard} href="https://vercel.com/docs/sandbox/pricing">
              <span className={styles.resourceIcon}>💰</span>
              <div>
                <div className={styles.resourceTitle}>料金・プラン</div>
                <div className={styles.resourceUrl}>vercel.com/docs/sandbox/pricing</div>
              </div>
            </Ext>
            <Ext className={styles.resourceCard} href="https://vercel.com/docs/sandbox/quickstart">
              <span className={styles.resourceIcon}>🚀</span>
              <div>
                <div className={styles.resourceTitle}>クイックスタート</div>
                <div className={styles.resourceUrl}>vercel.com/docs/sandbox/quickstart</div>
              </div>
            </Ext>
          </div>

          <h3>OSS・ブログ</h3>
          <div className={styles.resourceGrid}>
            <Ext className={styles.resourceCard} href="https://github.com/vercel/sandbox">
              <span className={styles.resourceIcon}>🐙</span>
              <div>
                <div className={styles.resourceTitle}>
                  GitHub リポジトリ（CLI + SDK オープンソース）
                </div>
                <div className={styles.resourceUrl}>github.com/vercel/sandbox</div>
              </div>
            </Ext>
            <Ext
              className={styles.resourceCard}
              href="https://vercel.com/blog/vercel-sandbox-is-now-generally-available"
            >
              <span className={styles.resourceIcon}>📰</span>
              <div>
                <div className={styles.resourceTitle}>GA 発表ブログ（2026/01/30）</div>
                <div className={styles.resourceUrl}>
                  vercel.com/blog/vercel-sandbox-is-now-generally-available
                </div>
              </div>
            </Ext>
            <Ext
              className={styles.resourceCard}
              href="https://www.npmjs.com/package/@vercel/sandbox"
            >
              <span className={styles.resourceIcon}>📦</span>
              <div>
                <div className={styles.resourceTitle}>@vercel/sandbox（JS SDK）</div>
                <div className={styles.resourceUrl}>npmjs.com/package/@vercel/sandbox</div>
              </div>
            </Ext>
            <Ext className={styles.resourceCard} href="https://www.npmjs.com/package/sandbox">
              <span className={styles.resourceIcon}>⌨️</span>
              <div>
                <div className={styles.resourceTitle}>sandbox（CLI）</div>
                <div className={styles.resourceUrl}>npmjs.com/package/sandbox</div>
              </div>
            </Ext>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────── */}
        <footer className={styles.footer}>
          <div>© 2026 Vercel Sandbox 完全入門ガイド — 公式ドキュメントに基づき作成</div>
          <div>
            最終更新: 2026年6月30日 |{" "}
            <Ext href="https://vercel.com/docs/sandbox">vercel.com/docs/sandbox</Ext>
          </div>
        </footer>
      </main>
    </div>
  );
}
