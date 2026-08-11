import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Google サンドボックス技術 完全ガイド ― AIエージェント・API・コンテナ・C/C++・ブラウザ",
  description:
    "AIエージェント・API・コンテナ・C/C++・ブラウザ、5領域のサンドボックス技術のベストプラクティスをステップバイステップで解説するガイドライン。",
};

const MERMAID_CHART_2 = `flowchart TB
    A["Google のサンドボックス戦略<br/>(隔離レイヤーごとの使い分け)"]
    A --> B["① AIエージェント"]
    A --> C["② API"]
    A --> D["③ コンテナ"]
    A --> E["④ C / C++"]
    A --> F["⑤ ブラウザ"]

    B --> B1["GKE Agent Sandbox (gVisor)"]
    B --> B2["Gemini Code Execution"]

    C --> C1["Apigee サンドボックス環境"]
    C --> C2["Cloud Armor / WAAP"]

    D --> D1["GKE Sandbox (gVisor)"]
    D --> D2["Cloud Run / App Engine / Functions"]

    E --> E1["Sandbox2"]
    E --> E2["Sandboxed API (SAPI)"]

    F --> F1["マルチプロセス + Site Isolation"]
    F --> F2["V8 Sandbox"]`;

const MERMAID_CHART_3_2 = `flowchart LR
    App["エージェントが生成した<br/>コード / プロセス"] --> Sentry["gVisor Sentry<br/>(ユーザー空間の疑似カーネル)"]
    Sentry --> Gofer["gVisor Gofer<br/>(ファイルI/Oプロキシ)"]
    Gofer --> Kernel["ホストのLinuxカーネル"]
    Sentry -.-|直接到達は不可| Kernel`;

const MERMAID_CHART_4_1 = `flowchart LR
    Client["クライアント"] --> GFE["Google Front End<br/>(TLS終端)"]
    GFE --> Proxy["Apigee APIプロキシ<br/>(環境=サンドボックス)"]
    Proxy --> Policy1["トラフィック管理<br/>ポリシー"]
    Proxy --> Policy2["メッセージレベル<br/>保護ポリシー"]
    Proxy --> Policy3["セキュリティポリシー<br/>(RBAC / OAuth等)"]
    Proxy --> Backend["バックエンドサービス"]`;

const MERMAID_CHART_5_1 = `flowchart LR
    Container["コンテナ内アプリケーション"] --> Sentry2["gVisor Sentry<br/>(ユーザー空間カーネル)"]
    Sentry2 --> Seccomp["seccomp-bpf<br/>システムコールフィルタ"]
    Seccomp --> HostKernel["ホストのLinuxカーネル"]`;

const MERMAID_CHART_6_1 = `flowchart LR
    Policy["Sandbox Policy<br/>(許可するsyscallを定義)"] --> Executor["Executor<br/>(信頼済みの管理プロセス)"]
    Executor -->|ポリシーを適用して起動| Sandboxee["Sandboxee<br/>(隔離対象プロセス)"]
    Sandboxee -->|許可済みsyscallのみ通過| Kernel3["Linuxカーネル"]`;

const MERMAID_CHART_6_2 = `flowchart LR
    HostCode["ホストコード<br/>(信頼済みプログラム本体)"] --> SapiObject["SAPI Object"]
    SapiObject -->|RPC呼び出し| RpcStub["RPC Stub"]
    RpcStub --> SandboxedLib["サンドボックス化された<br/>C/C++ライブラリ(Sandbox2内)"]`;

const MERMAID_CHART_7_1 = `flowchart TB
    Browser["ブラウザプロセス<br/>(無サンドボックス・特権)"]
    Browser --> RendererA["レンダラープロセスA<br/>(サイトA専用・サンドボックス化)"]
    Browser --> RendererB["レンダラープロセスB<br/>(サイトB専用・サンドボックス化)"]
    Browser --> GPU["GPUプロセス<br/>(サンドボックス化)"]
    Browser --> Network["ネットワークプロセス"]
    RendererA -.-|IPC経由のみ| Browser
    RendererB -.-|IPC経由のみ| Browser`;

const MERMAID_CHART_7_3 = `flowchart LR
    JS["JavaScript / WebAssembly<br/>コード"] --> V8Heap["V8ヒープ<br/>(サンドボックス化されたメモリ領域)"]
    V8Heap -->|メモリ破壊が発生しても脱出不可| Boundary["サンドボックス境界"]
    Boundary -.-|通常はアクセス不可| ProcessMemory["レンダラープロセスの<br/>その他のメモリ"]`;

const MERMAID_CHART_8 = `flowchart TD
    Start["何を隔離したいか?"] --> Q1{"AIエージェントが<br/>生成したコードを実行する"}
    Q1 -->|はい| A1["GKE Agent Sandbox<br/>または Gemini Code Execution"]
    Q1 -->|いいえ| Q2{"C/C++のライブラリや<br/>バイナリを隔離したい"}
    Q2 -->|はい| A2["Sandbox2 / Sandboxed API (SAPI)"]
    Q2 -->|いいえ| Q3{"コンテナ全体を<br/>カーネルから隔離したい"}
    Q3 -->|はい| A3["gVisor / GKE Sandbox"]
    Q3 -->|いいえ| Q4{"ブラウザや拡張機能の<br/>コンテンツを隔離したい"}
    Q4 -->|はい| A4["Site Isolation / V8 Sandbox<br/>/ 拡張機能sandboxディレクティブ"]
    Q4 -->|いいえ| A5["Apigee等でAPIレイヤーを保護"]`;

/**
 * Google Sandbox Best Practices Page Component
 * Renders 100% faithful content from Google-sandbox-best-practices.html
 */
export default function GoogleSandboxBestPracticesPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <div className={styles.bgGlow} />
      <div className={styles.topAccentBar} />

      <button
        className={styles.sidebarToggle}
        id="sidebarToggle"
        type="button"
        aria-controls="sidebar"
        aria-label="目次を開く"
        aria-expanded="false"
      >
        ☰
      </button>

      <nav className={styles.sidebar} id="sidebar">
        <div className={styles.brand}>
          <div className={styles.brandBadge}>GS</div>
          <div className={styles.brandText}>
            <strong>Google Sandbox</strong>完全ガイド
          </div>
        </div>
        <div className={styles.navGroupLabel}>目次</div>
        <ul className={styles.navList}>
          <li>
            <a href="#section-1">
              <span className={styles.navDot} />
              1. はじめに
            </a>
          </li>
          <li>
            <a href="#section-2">
              <span className={styles.navDot} />
              2. 全体マップ
            </a>
          </li>
          <li>
            <a href="#section-3">
              <span
                className={styles.navDot}
                style={{ "--dot": "var(--c-agent)" } as React.CSSProperties}
              />
              3. ① AIエージェント
            </a>
          </li>
          <li>
            <a href="#section-4">
              <span
                className={styles.navDot}
                style={{ "--dot": "var(--c-api)" } as React.CSSProperties}
              />
              4. ② API
            </a>
          </li>
          <li>
            <a href="#section-5">
              <span
                className={styles.navDot}
                style={{ "--dot": "var(--c-container)" } as React.CSSProperties}
              />
              5. ③ コンテナ
            </a>
          </li>
          <li>
            <a href="#section-6">
              <span
                className={styles.navDot}
                style={{ "--dot": "var(--c-cpp)" } as React.CSSProperties}
              />
              6. ④ C/C++
            </a>
          </li>
          <li>
            <a href="#section-7">
              <span
                className={styles.navDot}
                style={{ "--dot": "var(--c-browser)" } as React.CSSProperties}
              />
              7. ⑤ ブラウザ
            </a>
          </li>
          <li>
            <a href="#section-8">
              <span className={styles.navDot} />
              8. 意思決定フロー
            </a>
          </li>
          <li>
            <a href="#section-9">
              <span className={styles.navDot} />
              9. 横断ベストプラクティス
            </a>
          </li>
          <li>
            <a href="#section-10">
              <span className={styles.navDot} />
              10. 参考文献・出典URL
            </a>
          </li>
        </ul>
      </nav>

      <main className={styles.main}>
        <h1>Google サンドボックス技術 完全ガイド</h1>
        <p className={styles.lede}>
          AIエージェント・API・コンテナ・C/C++・ブラウザ、5領域のベストプラクティスをステップバイステップで理解する
        </p>
        <blockquote>
          <p>
            対象読者:サンドボックス技術の初学者〜中級エンジニア
            <br />
            情報基準日:2026年7月27日時点(以降の変更は各社公式ドキュメントで要確認)
          </p>
        </blockquote>

        <div className={styles.quicknavLabel}>5つの領域をひと目で</div>
        <div className={styles.quicknavGrid}>
          <a
            className={styles.quicknavCard}
            href="#section-3"
            style={{ "--domain": "var(--c-agent)" } as React.CSSProperties}
          >
            <div className={styles.quicknavHead}>
              <span className={styles.quicknavBadge}>AI</span>
              <span className={styles.quicknavTitle}>AIエージェント</span>
            </div>
            <p className={styles.quicknavDesc}>
              GKE Agent Sandbox(gVisor)とGemini Code Executionで、生成されたコードを隔離実行
            </p>
          </a>
          <a
            className={styles.quicknavCard}
            href="#section-4"
            style={{ "--domain": "var(--c-api)" } as React.CSSProperties}
          >
            <div className={styles.quicknavHead}>
              <span className={styles.quicknavBadge}>API</span>
              <span className={styles.quicknavTitle}>API</span>
            </div>
            <p className={styles.quicknavDesc}>
              Apigeeの環境分離とセキュリティポリシーでAPIレイヤーを保護
            </p>
          </a>
          <a
            className={styles.quicknavCard}
            href="#section-5"
            style={{ "--domain": "var(--c-container)" } as React.CSSProperties}
          >
            <div className={styles.quicknavHead}>
              <span className={styles.quicknavBadge}>CT</span>
              <span className={styles.quicknavTitle}>コンテナ</span>
            </div>
            <p className={styles.quicknavDesc}>
              gVisorのカーネルレベル分離でGKE・Cloud Run・App Engineを保護
            </p>
          </a>
          <a
            className={styles.quicknavCard}
            href="#section-6"
            style={{ "--domain": "var(--c-cpp)" } as React.CSSProperties}
          >
            <div className={styles.quicknavHead}>
              <span className={styles.quicknavBadge}>C+</span>
              <span className={styles.quicknavTitle}>C/C++</span>
            </div>
            <p className={styles.quicknavDesc}>
              Sandbox2とSandboxed API(SAPI)でネイティブライブラリを隔離
            </p>
          </a>
          <a
            className={`${styles.quicknavCard} ${styles.spanFull}`}
            href="#section-7"
            style={{ "--domain": "var(--c-browser)" } as React.CSSProperties}
          >
            <div className={styles.quicknavHead}>
              <span className={styles.quicknavBadge}>WEB</span>
              <span className={styles.quicknavTitle}>ブラウザ</span>
            </div>
            <p className={styles.quicknavDesc}>
              マルチプロセス構造・Site Isolation・V8 Sandboxによる多層防御
            </p>
          </a>
        </div>

        <hr />

        <span className={styles.sectionAnchor} id="section-1" aria-hidden="true" />
        <h2 id="1-はじめになぜサンドボックスが必要なのか">
          1. はじめに:なぜ「サンドボックス」が必要なのか
        </h2>
        <p>
          「サンドボックス(sandbox)」とは、信頼できないコードやデータを、ホストシステム(OS本体・他のプロセス・他の顧客のデータなど)から隔離された領域の中だけで実行させるための仕組みです。子どもが砂場の外に砂をこぼさないのと同じように、「万が一そのコードが悪意を持っていたり、バグを含んでいたりしても、被害が砂場の外に漏れない」ことを保証するのが目的です。
        </p>
        <p>Googleがサンドボックスを重視する背景には、次の3つの共通した脅威があります。</p>
        <ul>
          <li>
            <strong>信頼できない入力の実行</strong>
            :AIエージェントが生成したコード、ユーザーがアップロードしたファイル、サードパーティのライブラリなど、開発者自身がレビューしきれないコードを動かす機会が増え続けている
          </li>
          <li>
            <strong>マルチテナンシー</strong>
            :クラウド上では複数の顧客・複数のワークロードが同じ物理ハードウェアを共有するため、1つのワークロードの侵害が他のワークロードに波及してはならない
          </li>
          <li>
            <strong>メモリ安全性が保証できない領域の存在</strong>
            :C/C++やJavaScriptエンジンのように、言語仕様上メモリ安全性を完全には保証できない領域が、今なお本番システムの中核に存在する
          </li>
        </ul>
        <p>
          Googleはこの課題に対して、単一の万能な解決策ではなく、
          <strong>隔離したい対象のレイヤーごとに専用のサンドボックス技術を使い分ける</strong>
          という設計思想を取っています。本ガイドでは、その中でも特に問い合わせの多い次の5領域を、ステップバイステップのベストプラクティスとして整理します。
        </p>

        <hr />

        <span className={styles.sectionAnchor} id="section-2" aria-hidden="true" />
        <h2 id="2-全体マップgoogleの5つのサンドボックス領域">
          2. 全体マップ:Googleの5つのサンドボックス領域
        </h2>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_CHART_2} />
        </div>
        <p>
          この図からもわかるとおり、5つの領域の多くが「gVisor」という同一のオープンソース技術を土台にしていることが特徴です。gVisorはGoogle社内で長年本番ワークロードの隔離に使われてきた実績をもとにオープンソース化された、ユーザー空間でLinuxカーネルAPIを再実装する「アプリケーションカーネル」です。まずこの共通基盤を理解しておくと、以降の各領域の理解が格段に速くなります。
        </p>

        <hr />

        <span className={styles.sectionAnchor} id="section-3" aria-hidden="true" />
        <h2
          className={styles.domainH2}
          id="3-領域①-aiエージェントのサンドボックス"
          style={{ "--domain": "var(--c-agent)" } as React.CSSProperties}
        >
          <span className={styles.domainBadge}>AI</span>3. 領域① AIエージェントのサンドボックス
        </h2>
        <h3
          className={styles.domainH3}
          id="3-1-なぜaiエージェント専用の隔離が必要か"
          style={{ "--domain": "var(--c-agent)" } as React.CSSProperties}
        >
          3-1. なぜAIエージェント専用の隔離が必要か
        </h3>
        <p>
          AIエージェントは、LLMが生成した非決定的なコードをその場で実行したり、外部ツールを自律的に呼び出したりします。これは「常に信頼できない入力を、常に本番同然の権限で実行し続ける」ことに等しく、通常のアプリケーションよりもはるかに広い攻撃対象領域を生み出します。GoogleはこれをGKE(Google
          Kubernetes Engine)向けの<strong>Agent Sandbox</strong>と、Gemini APIやAgent Platform向けの
          <strong>Code Execution</strong>という2つの製品ラインで解決しています。
        </p>
        <h3
          className={styles.domainH3}
          id="3-2-gke-agent-sandboxアーキテクチャ"
          style={{ "--domain": "var(--c-agent)" } as React.CSSProperties}
        >
          3-2. GKE Agent Sandbox:アーキテクチャ
        </h3>
        <p>
          GKE Agent Sandboxは、Kubernetes SIG
          Apps配下でオープンソース開発されているKubernetesネイティブな拡張機能です。gVisorによるカーネルレベルの隔離を、
          <code>Sandbox</code>・<code>SandboxTemplate</code>・<code>SandboxClaim</code>
          という3つの新しいKubernetesカスタムリソースを通じて提供します。
        </p>
        <p>gVisorの内部は「Sentry」と「Gofer」という2つのコンポーネントで構成されます。</p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_CHART_3_2} />
        </div>
        <p>
          Sentryはエージェントが発行するすべてのシステムコール(<code>exec</code>や
          <code>socket</code>
          など)を横取りし、ホストカーネルに直接触れさせない「偽のカーネル」として振る舞います。ファイルシステム操作だけは別プロセスのGoferが仲介するため、たとえSentryに未知の脆弱性があっても、ファイルシステムへの被害範囲を最小化できます。
        </p>
        <h3
          className={styles.domainH3}
          id="3-3-ステップバイステップ導入のベストプラクティス"
          style={{ "--domain": "var(--c-agent)" } as React.CSSProperties}
        >
          3-3. ステップバイステップ:導入のベストプラクティス
        </h3>
        <ol type="1">
          <li>
            <strong>隔離(ISOLATE)</strong>
            :非決定的なエージェントのコード・ツール実行・ユーザー入力処理はすべてGKE Agent
            Sandbox(gVisor)上で実行し、RCE(リモートコード実行)攻撃をサンドボックス内に封じ込める
          </li>
          <li>
            <strong>高速化(ACCELERATE)</strong>
            :サンドボックスの起動レイテンシを隠すため、事前にプロビジョニングされた「ウォームプール」を用意する。さらにコスト削減のため、アイドル状態のエージェントは「コールドプール(サスペンド状態のVM)」に退避させ、Pod
            Snapshotsで低コストに復元する
          </li>
          <li>
            <strong>権限の制限(RESTRICT・ID)</strong>:Workload Identity
            Federationを使い、エージェントごとに使い捨ての最小権限IAMアイデンティティを付与する
          </li>
          <li>
            <strong>通信の制限(RESTRICT・Network)</strong>:デフォルト拒否(default-deny)のKubernetes
            NetworkPolicyを設定し、エージェントが必要とするDNS・メタデータ・APIエンドポイントだけを明示的に許可リスト化する
          </li>
          <li>
            <strong>多層防御を過信しない</strong>:gVisor・Workload Identity・VPC Service
            Controlsをすべて設定しても、それらは「許可されたチャネルの中で行われる正規の操作」しか防げない。プロンプトインジェクションによって、許可済みのAPI呼び出し経由でデータが持ち出されるリスクは別途モニタリングで検知する必要がある、と複数のセキュリティ研究者が指摘している
          </li>
        </ol>
        <h3
          className={styles.domainH3}
          id="3-4-gemini-api--agent-platform-の-code-execution"
          style={{ "--domain": "var(--c-agent)" } as React.CSSProperties}
        >
          3-4. Gemini API / Agent Platform の Code Execution
        </h3>
        <p>
          GKE以外にも、Gemini APIおよびGemini Enterprise Agent Platformが提供する
          <strong>Code Execution</strong>
          ツールを使えば、GKEにデプロイしなくてもマネージドなサンドボックスでPythonコードを実行できます。特徴は次のとおりです。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>特徴</th>
                <th>内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>起動速度</td>
                <td>1秒未満でサンドボックスを作成・実行可能</td>
              </tr>
              <tr>
                <td>ファイル入出力</td>
                <td>リクエスト/レスポンス全体で最大100MBまで対応</td>
              </tr>
              <tr>
                <td>状態保持</td>
                <td>実行状態(メモリ)を最大14日間保持(TTLで調整可能)</td>
              </tr>
              <tr>
                <td>デフォルトのネットワーク</td>
                <td>無効(明示的な許可リストを設定しない限りアウトバウンド通信不可)</td>
              </tr>
              <tr>
                <td>対応フレームワーク</td>
                <td>
                  特定のフレームワークに依存せず、任意のエージェント実装・任意のモデルから利用可能
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Agent Development
          Kit(ADK)の公式安全設計ドキュメントでも、「コード実行は特にセキュリティ上の影響が大きい特殊なツールであり、モデルが生成したコードがローカル環境を侵害しないよう、必ずサンドボックス化しなければならない」と明記されています。あわせてModel
          ArmorプラグインやPII
          redactionプラグインといった、入出力を検査する追加のガードレールも推奨されています。
        </p>

        <hr />

        <span className={styles.sectionAnchor} id="section-4" aria-hidden="true" />
        <h2
          className={styles.domainH2}
          id="4-領域②-apiのサンドボックス"
          style={{ "--domain": "var(--c-api)" } as React.CSSProperties}
        >
          <span className={styles.domainBadge}>API</span>4. 領域② APIのサンドボックス
        </h2>
        <h3
          className={styles.domainH3}
          id="4-1-apigeeにおけるサンドボックス環境の考え方"
          style={{ "--domain": "var(--c-api)" } as React.CSSProperties}
        >
          4-1. Apigeeにおける「サンドボックス環境」の考え方
        </h3>
        <p>
          API領域での「サンドボックス」は、これまでの実行時隔離とは意味合いが少し異なります。Apigee(Googleのネイティブなフルライフサイクル
          API管理製品)における「環境(environment)」は、
          <strong>APIプロキシを実行するための隔離されたコンテキスト</strong>
          を指し、公式ドキュメントでも「サンドボックス」と表現されています。1つの組織の中に複数の環境(開発用・テスト用・本番用など)を作成し、プロキシのデプロイ先を環境ごとに分離するのが基本設計です。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_CHART_4_1} />
        </div>
        <h3
          className={styles.domainH3}
          id="4-2-ステップバイステップapiサンドボックスのベストプラクティス"
          style={{ "--domain": "var(--c-api)" } as React.CSSProperties}
        >
          4-2. ステップバイステップ:APIサンドボックスのベストプラクティス
        </h3>
        <ol type="1">
          <li>
            <strong>環境を目的別に分離する</strong>
            :hybrid構成では、1つの環境に大量のプロキシを詰め込まず、複数の環境を作り、環境ごとにデプロイするプロキシ数を絞ることが推奨されている
          </li>
          <li>
            <strong>デフォルトポリシーを有効化する</strong>
            :Apigeeが提供する3種類の既定ポリシー(トラフィック管理・メッセージレベル保護・セキュリティ)をプロキシ層にアタッチする
          </li>
          <li>
            <strong>IPアドレス/地理情報によるアクセス制御にはCloud Armorを使う</strong>
            :Apigee自体のポリシーだけでなく、Cloud Armorと組み合わせたWAAP(Web App and API
            Protection)構成が推奨されている
          </li>
          <li>
            <strong>クライアントIP解決を環境ごとにカスタマイズする</strong>
            :プロキシ経由のリクエストでは<code>X-Forwarded-For</code>
            ヘッダーの保持設定が必要になるケースがあり、デフォルトのIP解決アルゴリズムが合わない場合は環境単位でカスタマイズできる
          </li>
          <li>
            <strong>開発者向けサンドボックスは60日間の無償トライアルで検証する</strong>
            :本番導入前に、Apigeeの試用サンドボックス環境でAPI設計を検証してから、本番の環境構成に反映するワークフローが一般的
          </li>
          <li>
            <strong>モックとの併用(一般的なAPIサンドボックス設計のベストプラクティス)</strong>
            :OpenAPI仕様からモックエンドポイントを自動生成できるAPI管理プラットフォームの機能を活用し、モックとAPI仕様を常に同期させ、成功シナリオだけでなくエラーシナリオも用意し、CI/CDパイプラインに組み込むことが、業界全体のAPIサンドボックス運用における共通ベストプラクティスとして紹介されている
          </li>
        </ol>

        <hr />

        <span className={styles.sectionAnchor} id="section-5" aria-hidden="true" />
        <h2
          className={styles.domainH2}
          id="5-領域③-コンテナのサンドボックス"
          style={{ "--domain": "var(--c-container)" } as React.CSSProperties}
        >
          <span className={styles.domainBadge}>CT</span>5. 領域③ コンテナのサンドボックス
        </h2>
        <h3
          className={styles.domainH3}
          id="5-1-gvisorの基本アーキテクチャ再掲詳細版"
          style={{ "--domain": "var(--c-container)" } as React.CSSProperties}
        >
          5-1. gVisorの基本アーキテクチャ(再掲・詳細版)
        </h3>
        <p>
          コンテナ領域におけるGoogleの主力技術は、AIエージェント領域でも登場した
          <strong>gVisor</strong>
          そのものです。通常のコンテナはホストカーネルを直接共有するため、1つのコンテナ内のカーネル脆弱性が、ノード全体・他の全コンテナに波及するリスクを抱えます。gVisorは、コンテナが発行するシステムコールをユーザー空間の「Sentry」で受け止め、seccomp-bpfによるシステムコールフィルタリングでさらに一段階の防御を重ねます。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_CHART_5_1} />
        </div>
        <p>
          Googleのサーバーレス製品群(App Engine、Cloud Run、Cloud
          Functions)はいずれも、アプリケーションワークロードの隔離にgVisorを採用しています。Cloud
          Runの場合、各インスタンスは仮想マシンモニター(VMM)によって他のインスタンスから隔離され、さらにコンテナ境界の強制とseccompによるシステムコールフィルタリングが重ねられる多層防御構成になっています。
        </p>
        <h3
          className={styles.domainH3}
          id="5-2-ステップバイステップgke-sandboxの有効化手順"
          style={{ "--domain": "var(--c-container)" } as React.CSSProperties}
        >
          5-2. ステップバイステップ:GKE Sandboxの有効化手順
        </h3>
        <ol type="1">
          <li>
            <strong>専用ノードプールを作成する</strong>:GKE
            SandboxはデフォルトのノードプールにはEnableできない。Standardクラスタでは、すべてのワークロードをサンドボックス化する場合でも、GKE
            Sandboxを有効化していないノードプールを最低1つ残す必要がある
          </li>
          <li>
            <strong>イメージタイプを揃える</strong>
            :ノードプールのイメージタイプは「Container-Optimized OS with Containerd(
            <code>cos_containerd</code>)」のみがサポート対象
          </li>
          <li>
            <strong>RuntimeClassを確認する</strong>
            :ノードプール作成後、GKEが自動的に<code>gvisor</code>
            という名前のRuntimeClassを作成する。<code>kubectl get runtimeclass gvisor</code>
            で存在を確認する
          </li>
          <li>
            <strong>Podスペックでサンドボックスを指定する</strong>
            :隔離したいPodのマニフェストに<code>runtimeClassName: gvisor</code>を追加する
          </li>
          <li>
            <strong>リソース上限を必ず設定する</strong>:GKE
            Sandboxを使う場合でも、すべてのコンテナにリソース制限(CPU/メモリ)を指定し、不良コードや悪意あるアプリケーションがノードのリソースを枯渇させないようにする
          </li>
          <li>
            <strong>GPU/TPUワークロードでの注意点</strong>:GKE
            SandboxはNVIDIAドライバの脆弱性すべてを緩和するわけではないが、Linuxカーネルの脆弱性に対する保護は維持される。またGPUタイムシェアリングはGPUが完全に隔離されないため、GKE
            Sandboxとの併用は非推奨とされている
          </li>
          <li>
            <strong>ログとモニタリングを有効化する</strong>
            :必須ではないが、gVisorのメッセージがログに残るよう、クラスタの機能設定でLogging/Monitoringを有効化することが推奨されている
          </li>
          <li>
            <strong>チェックポイント/リストア機能を活用する</strong>
            :gVisorはコンテナのチェックポイント・リストアに対応しており、ウォームアップ済みサービスのキャッシュ、他マシンでのワークロード再開、実行状態のスナップショット取得、フォレンジック用の状態保存などに活用できる
          </li>
        </ol>

        <hr />

        <span className={styles.sectionAnchor} id="section-6" aria-hidden="true" />
        <h2
          className={styles.domainH2}
          id="6-領域④-ccのサンドボックス"
          style={{ "--domain": "var(--c-cpp)" } as React.CSSProperties}
        >
          <span className={styles.domainBadge}>C+</span>6. 領域④ C/C++のサンドボックス
        </h2>
        <h3
          className={styles.domainH3}
          id="6-1-sandbox2プログラム全体一部を隔離する"
          style={{ "--domain": "var(--c-cpp)" } as React.CSSProperties}
        >
          6-1. Sandbox2:プログラム全体・一部を隔離する
        </h3>
        <p>
          <strong>Sandbox2</strong>
          は、Linux向けのオープンソースC++セキュリティサンドボックスで、Google内のセキュリティチームが開発・保守しています。Linuxのnamespace、リソース制限、そしてseccomp-bpfによるシステムコールフィルタを組み合わせて、プログラム全体、あるいはプログラムの一部分だけを隔離できます。
        </p>
        <p>
          seccomp-bpfは、Secure Computing
          Mode(seccomp)を拡張したLinuxカーネルの機能です。素のseccompは<code>exit</code>・
          <code>sigreturn</code>・<code>read</code>・<code>write</code>
          の4つしか許可しませんが、seccomp-bpfはBPF(Berkeley Packet
          Filter)プログラムでシステムコールごとに柔軟な判定ロジックを書けるようにし、許可・ダミー値を返す・プロセス終了・シグナル送出・トレーサーへの通知、といった細かい制御を可能にします。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_CHART_6_1} />
        </div>
        <h3
          className={styles.domainH3}
          id="6-2-sandboxed-apisapiライブラリ単位でサンドボックス化する"
          style={{ "--domain": "var(--c-cpp)" } as React.CSSProperties}
        >
          6-2. Sandboxed API(SAPI):ライブラリ単位でサンドボックス化する
        </h3>
        <p>
          Sandbox2をそのまま使う場合、プロジェクトごとにポリシーやプロセス間のデータ交換の仕組みをゼロから設計し直す必要がありました。
          <strong>Sandboxed API(SAPI)</strong>
          はこの負担を解消するために作られたオープンソースプロジェクトで、Sandbox2を基盤にしながら「
          <strong>C/C++のライブラリ単位</strong>
          」でサンドボックス化できるようにします。開発チームのモットーは &quot;Sandbox once, use
          anywhere&quot;(一度サンドボックス化すれば、どこでも使い回せる)です。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_CHART_6_2} />
        </div>
        <p>
          SAPIライブラリはそれぞれ、必要最小限のシステムコール/リソースだけを許可するタイトなセキュリティポリシーを個別に持てる点が、プロジェクト全体で1つの巨大なポリシーを共有する従来型のサンドボックス設計との大きな違いです。
        </p>
        <h3
          className={styles.domainH3}
          id="6-3-ステップバイステップzlibをsapiでサンドボックス化する例"
          style={{ "--domain": "var(--c-cpp)" } as React.CSSProperties}
        >
          6-3. ステップバイステップ:zlibをSAPIでサンドボックス化する例
        </h3>
        <p>公式のGetting Startedガイドで紹介されている典型的な流れは次のとおりです。</p>
        <ol type="1">
          <li>
            <strong>サンドボックス化したいライブラリの関数を洗い出す</strong>
            :今回の例ではzlibの<code>deflate()</code>など、実際に使う関数だけを対象にする
          </li>
          <li>
            <strong>アンサンドボックス版のホストコードをまず動かす</strong>
            :最初はライブラリを直接呼び出す通常のプログラムとして実装し、動作を確認する
          </li>
          <li>
            <strong>
              <code>sapi_library</code>ビルドルールを定義する
            </strong>
            :Bazel/CMakeのビルドルールでSAPIライブラリを生成する
          </li>
          <li>
            <strong>SAPI ObjectとRPC Stubの自動生成を確認する</strong>
            :ビルドプロセス中にSAPIが自動生成するため、開発者がRPCの配線を手書きする必要はない
          </li>
          <li>
            <strong>ホストコードをSAPI呼び出しに置き換える</strong>:<code>sapi::Sandbox</code>
            でサンドボックスオブジェクトを作成し、生成されたAPIクラス経由で関数を呼び出すようにホストコードを書き換える
          </li>
          <li>
            <strong>必要に応じて専用のsandbox policyを書く</strong>
            :デフォルトポリシーで足りない場合は、<code>sandbox.h</code>
            ヘッダーファイルに許可するシステムコール・ファイルアクセス範囲を定義し、
            <code>sapi_library</code>ルールに渡す
          </li>
          <li>
            <strong>Transactionsモジュールで監視・自動再起動を設定する</strong>
            :セキュリティ違反・クラッシュ・リソース枯渇でライブラリが落ちた場合に自動的に再起動する高レベルAPIも用意されている
          </li>
        </ol>
        <h3
          className={styles.domainH3}
          id="6-4-cc領域における他の選択肢比較"
          style={{ "--domain": "var(--c-cpp)" } as React.CSSProperties}
        >
          6-4. C/C++領域における他の選択肢比較
        </h3>
        <p>
          Google Developersの公式ページでは、用途別に複数のサンドボックス技術が一覧化されています。
        </p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>製品</th>
                <th>概要</th>
                <th>主な用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sandbox2</td>
                <td>
                  namespace・リソース制限・seccomp-bpfを用いたLinuxサンドボックス。SAPIの基盤技術
                </td>
                <td>汎用サンドボックス</td>
              </tr>
              <tr>
                <td>gVisor</td>
                <td>
                  システムコールをアプリケーションカーネルとして実装。ptraceまたはハードウェア仮想化でインターセプト
                </td>
                <td>汎用サンドボックス</td>
              </tr>
              <tr>
                <td>Bubblewrap</td>
                <td>user namespaceのサブセットで実装。Flatpakの実行エンジンとしても利用</td>
                <td>CLIツール</td>
              </tr>
              <tr>
                <td>Minijail</td>
                <td>ChromeOS/Androidで使われるサンドボックス・封じ込めツール</td>
                <td>CLIツール</td>
              </tr>
              <tr>
                <td>NSJail</td>
                <td>
                  namespace・リソース制限・seccomp-bpfによるプロセス隔離。独自DSLのKafelにも対応
                </td>
                <td>CLIツール</td>
              </tr>
              <tr>
                <td>Sandboxed API (SAPI)</td>
                <td>Sandbox2を使ったC/C++ライブラリの再利用可能なサンドボックス</td>
                <td>C/C++コード</td>
              </tr>
              <tr>
                <td>Native Client(NaCl)</td>
                <td>
                  <strong>非推奨</strong>
                  。x86/LLVMバイトコードの制限されたサブセットにコンパイルして隔離。後継のWebAssembly設計に影響を与えた
                </td>
                <td>C/C++コード(廃止)</td>
              </tr>
              <tr>
                <td>WebAssembly (WASM)</td>
                <td>移植可能なバイナリフォーマット。隔離された実行環境でモジュールを実行</td>
                <td>C/C++コード</td>
              </tr>
              <tr>
                <td>RLBox</td>
                <td>
                  C++17で書かれたサンドボックスAPI。NaCl・WASM・リモートプロセスなど複数の実行バックエンドを選択可能
                </td>
                <td>C/C++コード</td>
              </tr>
              <tr>
                <td>Flatpak</td>
                <td>
                  Bubblewrapを土台にしたLinuxデスクトップアプリ向けサンドボックス。パッケージング・配布に重点
                </td>
                <td>デスクトップアプリ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr />

        <span className={styles.sectionAnchor} id="section-7" aria-hidden="true" />
        <h2
          className={styles.domainH2}
          id="7-領域⑤-ブラウザのサンドボックス"
          style={{ "--domain": "var(--c-browser)" } as React.CSSProperties}
        >
          <span className={styles.domainBadge}>WEB</span>7. 領域⑤ ブラウザのサンドボックス
        </h2>
        <h3
          className={styles.domainH3}
          id="7-1-chromeのマルチプロセスアーキテクチャ"
          style={{ "--domain": "var(--c-browser)" } as React.CSSProperties}
        >
          7-1. Chromeのマルチプロセスアーキテクチャ
        </h3>
        <p>
          Chromeのセキュリティ設計の中核は「サンドボックス化されたマルチプロセスアーキテクチャ」です。DOMのレンダリング・スクリプト実行・メディアデコードなど、Web由来の攻撃対象領域の大部分は、権限を持たない「レンダラープロセス」に閉じ込められます。唯一「ブラウザプロセス」だけが、ファイルシステムやネットワークに直接アクセスできる無サンドボックスの特権プロセスとして動作します。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_CHART_7_1} />
        </div>
        <h3
          className={styles.domainH3}
          id="7-2-site-isolationサイトをまたいだデータ漏洩を防ぐ"
          style={{ "--domain": "var(--c-browser)" } as React.CSSProperties}
        >
          7-2. Site Isolation:サイトをまたいだデータ漏洩を防ぐ
        </h3>
        <p>
          Chrome 67(デスクトップ、全サイト対象)およびChrome
          77(Android、ログイン済みサイト対象)からデフォルトで有効化されているのが
          <strong>Site Isolation</strong>
          です。目的は「1つのレンダラープロセスには、最大でも1つのWebサイト由来のページしか含めない」ことを保証し、レンダラープロセスに脆弱性があっても、他サイトのCookieやデータへのアクセスを遮断することにあります。ブラウザプロセスは、どのサイトが専用プロセスを必要とするかに基づいて、各レンダラープロセスのCookieや他リソースへのアクセスを制限します。
        </p>
        <h3
          className={styles.domainH3}
          id="7-3-v8-sandboxjavascriptエンジン自体を隔離する"
          style={{ "--domain": "var(--c-browser)" } as React.CSSProperties}
        >
          7-3. V8 Sandbox:JavaScriptエンジン自体を隔離する
        </h3>
        <p>
          Site Isolationがプロセス間の隔離だとすれば、<strong>V8 Sandbox</strong>
          はプロセス<strong>内</strong>の隔離です。V8のセキュリティ技術リードであるSamuel
          Groß氏によれば、今日発見・悪用されるV8の脆弱性のほぼすべてに共通するのは、「コンパイラとランタイムがほぼ例外なくV8のHeapObjectインスタンスだけを操作するため、最終的なメモリ破壊が必ずV8ヒープの内部で発生する」という点です。
        </p>
        <p>
          V8
          Sandboxは、V8が実行するコードを、プロセスの仮想アドレス空間の一部(=サンドボックス、64bit環境で最大1TB分を予約)に限定し、それ以外のメモリ領域からは切り離します。サンドボックス外のメモリにアクセスできるすべてのデータ型を「サンドボックス互換」の代替型に置き換えることで、たとえV8内でメモリ破壊が起きても、サンドボックスの外側には影響が及ばない設計です。Chrome
          123から、Android・ChromeOS・Linux・macOS・Windowsの全プラットフォームでデフォルト有効化されており、SpeedometerやJetStreamのベンチマークでは、性能オーバーヘッドは約1%に抑えられています。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_CHART_7_3} />
        </div>
        <h3
          className={styles.domainH3}
          id="7-4-chrome拡張機能開発者向けsandboxディレクティブのベストプラクティス"
          style={{ "--domain": "var(--c-browser)" } as React.CSSProperties}
        >
          7-4. Chrome拡張機能開発者向け:sandboxディレクティブのベストプラクティス
        </h3>
        <p>
          ブラウザ本体だけでなく、拡張機能を開発する側にもGoogleが公式に推奨するサンドボックス機構があります。Manifest
          V3の<code>sandbox</code>
          プロパティを使うと、拡張機能内の特定のページを「一意のオリジンを持つサンドボックス」として動作させられます。
        </p>
        <ol type="1">
          <li>
            <strong>
              <code>eval</code>やインラインスクリプトが必要なページだけをsandbox指定する
            </strong>
            :サンドボックス化されたページは拡張機能全体のCSP(コンテンツセキュリティポリシー)の対象外になり、独自のCSPを持てるため、
            <code>eval()</code>やインラインスクリプトの実行が可能になる
          </li>
          <li>
            <strong>拡張機能APIへの直接アクセスはできない前提で設計する</strong>
            :サンドボックス化ページは拡張機能API・非サンドボックスページへの直接アクセスができず、
            <code>postMessage()</code>経由でのみ通信できる
          </li>
          <li>
            <strong>
              CSPを絞り込む場合は<code>sandbox</code>ディレクティブを外さない
            </strong>
            :デフォルトのCSP値は
            <code>
              sandbox allow-scripts allow-forms allow-popups allow-modals; script-src
              &apos;self&apos; &apos;unsafe-inline&apos; &apos;unsafe-eval&apos;; child-src
              &apos;self&apos;;
            </code>
            。これをより厳しく絞り込むことは可能だが、<code>sandbox</code>
            ディレクティブ自体は必須で、<code>allow-same-origin</code>トークンは指定できない
          </li>
          <li>
            <strong>外部Webコンテンツの読み込みは避ける</strong>:Chrome
            57以降、サンドボックス化ページの中に外部Webコンテンツ(埋め込みフレーム・スクリプトを含む)を読み込むことはできない。外部コンテンツが必要な場合は
            <code>webview</code>を使う
          </li>
          <li>
            <strong>通常の拡張機能ページのCSPも最小権限に保つ</strong>
            :通常のページ(<code>extension_pages</code>)側では、Chromeが強制する最小CSP(
            <code>
              script-src &apos;self&apos; &apos;wasm-unsafe-eval&apos;; object-src &apos;self&apos;;
            </code>
            )より緩和することはできない仕様になっている
          </li>
        </ol>

        <hr />

        <span className={styles.sectionAnchor} id="section-8" aria-hidden="true" />
        <h2 id="8-意思決定フロー自分のケースにはどのサンドボックス技術を選ぶべきか">
          8. 意思決定フロー:自分のケースにはどのサンドボックス技術を選ぶべきか
        </h2>
        <p>
          ここまでの5領域を踏まえて、「自分は何を隔離したいのか」から逆引きできる意思決定フローにまとめました。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_CHART_8} />
        </div>

        <hr />

        <span className={styles.sectionAnchor} id="section-9" aria-hidden="true" />
        <h2 id="9-横断ベストプラクティス早見表">9. 横断ベストプラクティス早見表</h2>
        <p>5つの領域を貫く共通原則を、実務でチェックリストとして使える形にまとめました。</p>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>原則</th>
                <th>AIエージェント</th>
                <th>API</th>
                <th>コンテナ</th>
                <th>C/C++</th>
                <th>ブラウザ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>最小権限</strong>
                </td>
                <td>Workload Identity Federationで使い捨てIAM</td>
                <td>RBAC・OAuthスコープの絞り込み</td>
                <td>サンドボックス化ノードプールの分離</td>
                <td>ポリシーで許可syscallを最小化</td>
                <td>拡張機能CSPを最小権限に</td>
              </tr>
              <tr>
                <td>
                  <strong>デフォルト拒否</strong>
                </td>
                <td>ネットワークポリシーで通信先を許可リスト化</td>
                <td>Cloud Armorでの地理/IP制御</td>
                <td>GPUタイムシェアリングを避ける等の制約順守</td>
                <td>seccomp-bpfでsyscallをデフォルト拒否</td>
                <td>
                  サンドボックス化ページに<code>allow-same-origin</code>を付けない
                </td>
              </tr>
              <tr>
                <td>
                  <strong>多層防御</strong>
                </td>
                <td>gVisor+ID+ネットワークを重ねても過信しない</td>
                <td>トラフィック管理+メッセージ保護+セキュリティポリシー</td>
                <td>VMM境界+コンテナ境界+seccomp</td>
                <td>namespace+リソース制限+seccomp-bpf</td>
                <td>マルチプロセス+Site Isolation+V8 Sandbox</td>
              </tr>
              <tr>
                <td>
                  <strong>状態管理/リソース制御</strong>
                </td>
                <td>Pod Snapshotsでウォーム/コールドプール</td>
                <td>環境ごとにデプロイ数を制限</td>
                <td>全コンテナにリソース上限を設定</td>
                <td>Transactionsで異常時に自動再起動</td>
                <td>プロセスクラッシュ時も他タブは継続動作</td>
              </tr>
              <tr>
                <td>
                  <strong>監視・可観測性</strong>
                </td>
                <td>トレーシングでツール呼び出しを可視化</td>
                <td>Advanced API Securityでクライアント挙動を分析</td>
                <td>gVisorログのLogging/Monitoring連携</td>
                <td>セキュリティ違反のログ記録</td>
                <td>サンドボックス違反の検知</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr />

        <span className={styles.sectionAnchor} id="section-10" aria-hidden="true" />
        <h2 id="10-参考文献出典url">10. 参考文献・出典URL</h2>
        <p>
          本ガイドの作成にあたり、以下のGoogle公式ドキュメント・Google公式ブログ・著名なセキュリティエンジニア/開発者による技術記事を参照しました。
        </p>
        <div className={styles.refGrid}>
          <div className={styles.refCard}>
            <h3 id="google公式サンドボックス技術全般">Google公式:サンドボックス技術全般</h3>
            <ul>
              <li>
                Code Sandboxing(Google for Developers、Sandbox2/SAPI/gVisor等の比較表):
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://developers.google.com/code-sandboxing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://developers.google.com/code-sandboxing
                </a>
              </li>
              <li>
                Sandbox2 Explained: <span className={styles.refIcon}>↗</span>
                <a
                  href="https://developers.google.com/code-sandboxing/sandbox2/explained"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://developers.google.com/code-sandboxing/sandbox2/explained
                </a>
              </li>
              <li>
                Sandboxed API (SAPI) 概要: <span className={styles.refIcon}>↗</span>
                <a
                  href="https://developers.google.com/code-sandboxing/sandboxed-api"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://developers.google.com/code-sandboxing/sandboxed-api
                </a>
              </li>
              <li>
                SAPI Explained: <span className={styles.refIcon}>↗</span>
                <a
                  href="https://developers.google.com/code-sandboxing/sandboxed-api/explained"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://developers.google.com/code-sandboxing/sandboxed-api/explained
                </a>
              </li>
              <li>
                SAPI Getting Started: <span className={styles.refIcon}>↗</span>
                <a
                  href="https://developers.google.com/code-sandboxing/sandboxed-api/getting-started"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://developers.google.com/code-sandboxing/sandboxed-api/getting-started
                </a>
              </li>
              <li>
                google/sandboxed-api (GitHub): <span className={styles.refIcon}>↗</span>
                <a
                  href="https://github.com/google/sandboxed-api"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/google/sandboxed-api
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.refCard}>
            <h3 id="①-aiエージェント">① AIエージェント</h3>
            <ul>
              <li>
                GKE Sandbox(GKEセキュリティ公式ドキュメント):{" "}
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://docs.cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods
                </a>
              </li>
              <li>
                Isolate AI code execution with Agent Sandbox:{" "}
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://docs.cloud.google.com/kubernetes-engine/docs/how-to/agent-sandbox"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.cloud.google.com/kubernetes-engine/docs/how-to/agent-sandbox
                </a>
              </li>
              <li>
                Bringing you Agent Sandbox on GKE and Agent Substrate(Google Cloud Blog):
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://cloud.google.com/blog/products/containers-kubernetes/bringing-you-agent-sandbox-on-gke-and-agent-substrate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://cloud.google.com/blog/products/containers-kubernetes/bringing-you-agent-sandbox-on-gke-and-agent-substrate
                </a>
              </li>
              <li>
                Safety and Security for AI Agents(Agent Development Kit公式):
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://google.github.io/adk-docs/safety/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://google.github.io/adk-docs/safety/
                </a>
              </li>
              <li>
                Code Execution(Gemini Enterprise Agent Platform公式):{" "}
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox/code-execution-overview"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox/code-execution-overview
                </a>
              </li>
              <li>
                Sandboxes overview(Gemini Enterprise Agent Platform公式):
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox
                </a>
              </li>
              <li>
                Agents Overview(Gemini API公式): <span className={styles.refIcon}>↗</span>
                <a
                  href="https://ai.google.dev/gemini-api/docs/agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://ai.google.dev/gemini-api/docs/agents
                </a>
              </li>
              <li>
                A Deep Dive into GKE Sandbox for Agents(The New Stack、Darryl K. Taft氏):
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://thenewstack.io/google-cloud-a-deep-dive-into-gke-sandbox-for-agents/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://thenewstack.io/google-cloud-a-deep-dive-into-gke-sandbox-for-agents/
                </a>
              </li>
              <li>
                Google Announces GKE Agent Sandbox and Hypercluster at Next &apos;26(InfoQ、Google
                Cloud AmbassadorのAlex Gkiouros氏の見解を含む):{" "}
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://www.infoq.com/news/2026/05/gke-agent-sandbox-hypercluster/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.infoq.com/news/2026/05/gke-agent-sandbox-hypercluster/
                </a>
              </li>
              <li>
                Securing AI Agents on GKE(ARMO、Shauli Rozen氏):{" "}
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://www.armosec.io/blog/sandboxing-ai-agents-gke-workload-identity/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.armosec.io/blog/sandboxing-ai-agents-gke-workload-identity/
                </a>
              </li>
              <li>
                GKE Agent SandboxとGKE Pod Snapshots(Rahul Ranganathan氏、Google Cloud
                Community/Medium ― ISOLATE/ACCELERATE/RESTRICTのフレームワークの出典):
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://medium.com/google-cloud/gke-agent-sandbox-and-gke-pod-snapshots-zero-trust-security-for-ai-agents-at-scale-559261ee20b5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://medium.com/google-cloud/gke-agent-sandbox-and-gke-pod-snapshots-zero-trust-security-for-ai-agents-at-scale-559261ee20b5
                </a>
              </li>
              <li>
                Deploying Secure AI Agents on GKE(Google Codelabs):{" "}
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://codelabs.developers.google.com/codelabs/gke/ai-agents-on-gke"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://codelabs.developers.google.com/codelabs/gke/ai-agents-on-gke
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.refCard}>
            <h3 id="②-api">② API</h3>
            <ul>
              <li>
                Apigee API Management(製品ページ): <span className={styles.refIcon}>↗</span>
                <a href="https://cloud.google.com/apigee" target="_blank" rel="noopener noreferrer">
                  https://cloud.google.com/apigee
                </a>
              </li>
              <li>
                Best practices for securing your applications and APIs using Apigee:
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://docs.cloud.google.com/architecture/best-practices-securing-applications-and-apis-using-apigee"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.cloud.google.com/architecture/best-practices-securing-applications-and-apis-using-apigee
                </a>
              </li>
              <li>
                Advanced API Security best practices(Apigee公式):{" "}
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://docs.cloud.google.com/apigee/docs/api-security/best-practices"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.cloud.google.com/apigee/docs/api-security/best-practices
                </a>
              </li>
              <li>
                About environments(Apigee hybrid公式、環境=サンドボックスの定義):
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://cloud.google.com/apigee/docs/hybrid/v1.9/environments-about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://cloud.google.com/apigee/docs/hybrid/v1.9/environments-about
                </a>
              </li>
              <li>
                Top Sandbox Development Environment Best Practices Guide(DigitalAPI):
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://www.digitalapi.ai/blogs/what-are-the-best-practices-for-managing-a-sandbox-development-environment"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.digitalapi.ai/blogs/what-are-the-best-practices-for-managing-a-sandbox-development-environment
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.refCard}>
            <h3 id="③-コンテナ">③ コンテナ</h3>
            <ul>
              <li>
                GKE Sandbox(概念ドキュメント): <span className={styles.refIcon}>↗</span>
                <a
                  href="https://docs.cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods
                </a>
              </li>
              <li>
                Harden workload isolation with GKE Sandbox(手順ドキュメント):
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://docs.cloud.google.com/kubernetes-engine/docs/how-to/sandbox-pods"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.cloud.google.com/kubernetes-engine/docs/how-to/sandbox-pods
                </a>
              </li>
              <li>
                gVisor公式サイト: <span className={styles.refIcon}>↗</span>
                <a href="https://gvisor.dev/" target="_blank" rel="noopener noreferrer">
                  https://gvisor.dev/
                </a>
              </li>
              <li>
                Security design overview(Cloud Run公式): <span className={styles.refIcon}>↗</span>
                <a
                  href="https://docs.cloud.google.com/run/docs/securing/security"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://docs.cloud.google.com/run/docs/securing/security
                </a>
              </li>
              <li>
                Improved gVisor file system performance for GKE, Cloud Run, App Engine and Cloud
                Functions(Google Cloud Blog): <span className={styles.refIcon}>↗</span>
                <a
                  href="https://cloud.google.com/blog/products/containers-kubernetes/gvisor-file-system-improvements-for-gke-and-serverless"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://cloud.google.com/blog/products/containers-kubernetes/gvisor-file-system-improvements-for-gke-and-serverless
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.refCard}>
            <h3 id="④-cc">④ C/C++</h3>
            <ul>
              <li>
                Sandbox2 Explained: <span className={styles.refIcon}>↗</span>
                <a
                  href="https://developers.google.com/code-sandboxing/sandbox2/explained"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://developers.google.com/code-sandboxing/sandbox2/explained
                </a>
              </li>
              <li>
                Sandboxed API README(GitHub): <span className={styles.refIcon}>↗</span>
                <a
                  href="https://github.com/google/sandboxed-api/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/google/sandboxed-api/blob/main/README.md
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.refCard}>
            <h3 id="⑤-ブラウザ">⑤ ブラウザ</h3>
            <ul>
              <li>
                Site Isolation Design Document(Chromium公式):{" "}
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://www.chromium.org/developers/design-documents/site-isolation/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.chromium.org/developers/design-documents/site-isolation/
                </a>
              </li>
              <li>
                Secure Architecture(Chromium Security公式):{" "}
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://www.chromium.org/Home/chromium-security/guts/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.chromium.org/Home/chromium-security/guts/
                </a>
              </li>
              <li>
                The V8 Sandbox(V8公式ブログ、Samuel Groß氏):{" "}
                <span className={styles.refIcon}>↗</span>
                <a href="https://v8.dev/blog/sandbox" target="_blank" rel="noopener noreferrer">
                  https://v8.dev/blog/sandbox
                </a>
              </li>
              <li>
                The V8 Heap Sandbox, OffensiveCon 2024講演資料(Samuel Groß氏):
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://saelo.github.io/presentations/offensivecon_24_the_v8_heap_sandbox.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://saelo.github.io/presentations/offensivecon_24_the_v8_heap_sandbox.pdf
                </a>
              </li>
              <li>
                Google Chrome Adds V8 Sandbox(The Hacker News):{" "}
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://thehackernews.com/2024/04/google-chrome-adds-v8-sandbox-new.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://thehackernews.com/2024/04/google-chrome-adds-v8-sandbox-new.html
                </a>
              </li>
              <li>
                Manifest - Sandbox(Chrome Extensions公式、Manifest V3):
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://developer.chrome.com/docs/extensions/reference/manifest/sandbox"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://developer.chrome.com/docs/extensions/reference/manifest/sandbox
                </a>
              </li>
              <li>
                Manifest - Content Security Policy(Chrome Extensions公式):
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy
                </a>
              </li>
              <li>
                Cleanly Escaping the Chrome Sandbox(Theori Blog):{" "}
                <span className={styles.refIcon}>↗</span>
                <a
                  href="https://theori.io/blog/cleanly-escaping-the-chrome-sandbox"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://theori.io/blog/cleanly-escaping-the-chrome-sandbox
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr />
        <blockquote>
          <p>
            <strong>免責事項</strong>
            :本ガイドは2026年7月27日時点で確認できた公開情報に基づいています。GKE Agent
            SandboxやGemini Enterprise Agent
            Platform関連の一部機能はPre-GA(プレビュー)段階の製品を含むため、実際の導入前には必ずGoogle
            Cloud公式ドキュメントの最新版を確認してください。
          </p>
        </blockquote>
      </main>
    </div>
  );
}
