import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "MCP実践ガイド - 初学者のためのステップバイステップ・ベストプラクティス | LLM-Studies",
  description:
    "Model Context Protocol (MCP) のアーキテクチャ基礎からツール設計、セキュリティ、本番運用まで、一次情報に基づいて解説する初学者向けステップバイステップ・ベストプラクティスガイド。",
};

const DIAGRAMS = {
  arch: `graph LR
  subgraph Host["MCPホスト"]
    LLM["LLM 本体"]
    C1["MCP Client A"]
    C2["MCP Client B"]
    C3["MCP Client C"]
  end
  S1["MCP Server\\nファイルシステム"]
  S2["MCP Server\\nGitHub連携"]
  S3["MCP Server\\n社内データベース"]

  LLM --- C1
  LLM --- C2
  LLM --- C3
  C1 <--> S1
  C2 <--> S2
  C3 <--> S3`,

  seq: `sequenceDiagram
  participant U as ユーザー
  participant H as MCP Host
  participant C as MCP Client
  participant S as MCP Server

  U->>H: 質問・指示を入力
  H->>C: 利用可能なツール一覧を要求
  C->>S: tools/list リクエスト
  S-->>C: ツール定義を返却
  C-->>H: ツール一覧をLLMのコンテキストに追加
  H->>H: どのツールを呼ぶか判断
  H->>C: ツール呼び出しを指示
  C->>S: tools/call リクエスト
  S-->>C: 実行結果を返却
  C-->>H: 結果をLLMのコンテキストに反映
  H-->>U: 最終的な回答を提示`,

  primitives: `graph TB
  subgraph ServerSide["サーバー側プリミティブ"]
    T["Tools\\n実行可能な関数"]
    R["Resources\\n読み取り専用データ"]
    P["Prompts\\n再利用可能テンプレート"]
  end
  subgraph ClientSide["クライアント側プリミティブ"]
    SM["Sampling\\nLLM補完の要求"]
    RT["Roots\\nアクセス範囲の宣言"]
    EL["Elicitation\\n追加入力の要求"]
  end
  ServerSide <--> ClientSide`,

  transport: `flowchart TD
  Start(["MCPサーバーを設計する"]) --> Q1{"クライアントと同じ\\nマシン上で動作させるか"}
  Q1 -- はい --> Q2{"単一クライアントのみで\\n十分か"}
  Q2 -- はい --> Stdio["stdioトランスポートを選択"]
  Q2 -- いいえ --> Http["Streamable HTTPを選択"]
  Q1 -- いいえ --> Q3{"ネットワーク越しに\\n複数クライアントへ提供するか"}
  Q3 -- はい --> Http
  Q3 -- いいえ --> Gateway["ゲートウェイパターンを検討"]`,

  steps: `flowchart TD
  A["1 環境準備\\nuv Python 3.9以上"] --> B["2 プロジェクト作成\\nuv init venv作成"]
  B --> C["3 MCP SDKをインストール\\nuv add mcp"]
  C --> D["4 最小サーバーを実装\\nFastMCPでtool resource定義"]
  D --> E["5 MCP Inspectorで動作確認\\nmcp dev コマンド"]
  E --> F{"想定通り動作するか"}
  F -- いいえ --> D
  F -- はい --> G["6 ホストアプリに接続\\nClaude Desktop設定ファイルへ登録"]
  G --> H["7 実際に呼び出して検証"]`,

  tokens: `graph LR
  A["従来方式\\n全ツール定義を毎回コンテキストへロード"] --> B["コンテキスト肥大化\\nトークンコスト増大"]
  C["コード実行方式\\n必要なツールのみをファイルとして探索・読込"] --> D["トークン使用量を大幅削減\\nレイテンシ・コスト改善"]`,

  security: `graph TD
  L1["層1 認証・認可\\nOAuth 2.1 PKCE トークンのaudience検証"] --> L2["層2 最小権限\\nツールごとにスコープを絞る"]
  L2 --> L3["層3 入力検証\\n厳格なJSON Schema"]
  L3 --> L4["層4 実行環境の分離\\nサンドボックス化"]
  L4 --> L5["層5 人間参加型の承認\\n破壊的操作には人手の確認"]
  L5 --> L6["層6 監視・監査\\nすべての呼び出しをログ記録"]`,

  gateway: `graph TB
  subgraph Users["利用者"]
    U1["エージェントA"]
    U2["エージェントB"]
  end
  GW["MCPゲートウェイ\\n認証・認可・監査ログを集中管理"]
  subgraph Servers["MCPサーバー群"]
    S1["社内DBサーバー"]
    S2["GitHubサーバー"]
    S3["クラウドストレージサーバー"]
  end

  U1 --> GW
  U2 --> GW
  GW --> S1
  GW --> S2
  GW --> S3`,
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function McpBestPracticesPage() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />
      <div className={styles.layout}>
        <nav className={styles.sidebar} id="mcpSideNav">
          <button className={styles.mobileToggle} id="mcpNavToggle" type="button">
            <i className="ti ti-menu-2" />
            目次を開く
          </button>
          <p className={styles.navTitle}>目次</p>
          <ul className={styles.navList} id="mcpNavList">
            <li>
              <a href="#intro" className={styles.tocLink}>
                <i className="ti ti-info-circle" /> このガイドについて
              </a>
            </li>
            <li>
              <a href="#ch1" className={styles.tocLink}>
                <i className="ti ti-bulb" /> 第1章 MCPとは何か
              </a>
            </li>
            <li>
              <a href="#ch2" className={styles.tocLink}>
                <i className="ti ti-topology-star" /> 第2章 アーキテクチャ
              </a>
            </li>
            <li>
              <a href="#ch3" className={styles.tocLink}>
                <i className="ti ti-puzzle" /> 第3章 プリミティブ
              </a>
            </li>
            <li>
              <a href="#ch4" className={styles.tocLink}>
                <i className="ti ti-route" /> 第4章 トランスポート
              </a>
            </li>
            <li>
              <a href="#ch5" className={styles.tocLink}>
                <i className="ti ti-list-numbers" /> 第5章 ステップバイステップ
              </a>
            </li>
            <li>
              <a href="#ch6" className={styles.tocLink}>
                <i className="ti ti-tool" /> 第6章 ツール設計
              </a>
            </li>
            <li>
              <a href="#ch7" className={styles.tocLink}>
                <i className="ti ti-shield-lock" /> 第7章 セキュリティ
              </a>
            </li>
            <li>
              <a href="#ch8" className={styles.tocLink}>
                <i className="ti ti-server-cog" /> 第8章 本番運用
              </a>
            </li>
            <li>
              <a href="#ch9" className={styles.tocLink}>
                <i className="ti ti-bug" /> 第9章 デバッグ・テスト
              </a>
            </li>
            <li>
              <a href="#ch10" className={styles.tocLink}>
                <i className="ti ti-alert-triangle" /> 第10章 アンチパターン
              </a>
            </li>
            <li>
              <a href="#ch11" className={styles.tocLink}>
                <i className="ti ti-checklist" /> 第11章 チェックリスト
              </a>
            </li>
            <li>
              <a href="#references" className={styles.tocLink}>
                <i className="ti ti-link" /> 参考文献一覧
              </a>
            </li>
          </ul>
        </nav>

        <main className={styles.main}>
          <header className={styles.hero}>
            <p className={styles.chapterNumber}>Model context protocol / 実践ガイド</p>
            <h1>MCP実践ガイド：初学者のためのステップバイステップ・ベストプラクティス</h1>
            <p className={styles.subtitle}>
              アーキテクチャの基礎からツール設計、セキュリティ、本番運用まで、一次情報に基づいて解説します。
            </p>
            <div className={styles.meta}>
              <span className={styles.pill}>
                <i className="ti ti-calendar" /> 最終更新: 2026年7月7日時点の公開情報
              </span>
              <span className={styles.pill}>
                <i className="ti ti-user" /> 対象:
                これからMCPを学ぶソフトウェアエンジニア・QAエンジニア
              </span>
              <span className={styles.badge}>
                <i className="ti ti-alert-triangle" /> 2026-07-28に大規模仕様改定予定
              </span>
            </div>
          </header>

          <section className={`${styles.chapter} chapter`} id="intro">
            <p className={styles.chapterNumber}>Introduction</p>
            <h2 className={styles.chapterTitle}>
              <i className="ti ti-info-circle" /> このガイドについて
            </h2>
            <div className={styles.notice}>
              <i className="ti ti-alert-triangle" />
              <span>
                MCPは2026年に入ってからも仕様改定が続く、非常に変化の速い技術領域です。本ガイドは執筆時点で入手可能な一次情報（公式ドキュメント・公式ブログ・OWASPなどのセキュリティ団体の資料）を中心にまとめていますが、特に2026年7月28日には大規模な仕様改定（ステートレス化・Extensions・Tasks機能など）が予定されています。実装時は必ず公式ドキュメント（末尾の参考文献リンク）で最新情報を確認してください。
              </span>
            </div>
            <p>
              前提知識としては、基本的なプログラミング経験（Python または TypeScript
              のいずれか）があり、REST
              APIやJSON-RPCの概念にある程度触れたことがあると理解が早く進みます。
            </p>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch1">
            <p className={styles.chapterNumber}>Chapter 01</p>
            <h2 className={styles.chapterTitle}>
              <i className="ti ti-bulb" /> MCPとは何か
            </h2>

            <h3>一言で言うと</h3>
            <p>
              MCPは、AIアプリケーション（Claudeやその他のLLMアプリ）と外部システム（データベース、ファイル、SaaS、APIなど）を接続するためのオープンな標準プロトコルです。Anthropicはこれを「AIアプリケーション用のUSB-C」に例えています。USB-Cが電子機器同士を統一的な方法で接続できるように、MCPはAIアプリケーションと外部システムを統一的な方法で接続します。
            </p>
            <p>
              MCPを使うことで、AIエージェントは自分のGoogleカレンダーやNotionにアクセスしてよりパーソナライズされたアシスタントとして振る舞えたり、Claude
              CodeがFigmaのデザインからWebアプリ全体を生成したり、企業向けチャットボットが組織内の複数のデータベースに接続してユーザーがチャットでデータ分析できるようになります。
            </p>

            <h3>なぜMCPが必要なのか（M×N問題）</h3>
            <p>
              MCP登場以前は、AIモデルと外部ツールを接続するたびに個別の統合コードを書く必要がありました。モデルの数をM、ツールの数をNとすると、本来はM×N通りの組み合わせぶんの統合実装が必要になり、規模が大きくなるほど開発・保守コストが膨れ上がるという課題がありました。MCPは、各モデル（ホスト）がMCPを一度実装し、各ツール（サーバー）もMCPを一度実装すれば、あらゆる組み合わせで相互接続できるようにすることで、この課題をM＋N
              の実装規模まで縮小します。
            </p>

            <h3>誕生の経緯と最新動向</h3>
            <p>
              MCPは2024年11月にAnthropicがオープンソースの標準として公開しました。仕様策定はThe
              Linux
              Foundation配下のオープンソースプロジェクトとして運営されており、Anthropic以外の企業やコミュニティからも広く貢献を受け付けています。
            </p>
            <p>
              その後、2025年3月頃にOpenAIがAgents
              SDKおよびChatGPTデスクトップアプリでMCP対応を発表し、Google
              DeepMindもGeminiエコシステムへの統合を進めました。MicrosoftもCopilot
              Studioや開発者向けツールにMCP対応を追加しており、2026年時点ではエージェント型AIアプリケーションの事実上の標準的な接続プロトコルとして扱われています。
            </p>
            <p>
              仕様バージョンの推移としては、2024年11月05日の初版から、2025年3月26日にStreamable
              HTTPトランスポートが導入され、2025年6月18日にOAuth
              2.1ベースの認可の全面刷新が行われ、2025年11月25日版が現行の最新安定仕様です。さらに2026年7月28日には、ステートレスなプロトコルコア・Extensionsフレームワーク・Tasks（長時間実行タスク）・MCP
              Apps（サーバーレンダリングUI）・認可の強化・正式な廃止ポリシーを含む、これまでで最大規模の改定を控えているリリース候補が公開されています。
            </p>

            <div className={styles.chapterRefs}>
              <h4>
                <i className="ti ti-link" /> この章の参考資料
              </h4>
              <ul>
                <li>
                  <Ext href="https://modelcontextprotocol.io/docs/getting-started/intro">
                    MCP公式ドキュメント（イントロダクション）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://github.com/modelcontextprotocol">
                    MCP公式GitHub Organization
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.anthropic.com/news/model-context-protocol">
                    Anthropic公式発表記事「Introducing the Model Context Protocol」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://en.wikipedia.org/wiki/Model_Context_Protocol">
                    Wikipedia「Model Context Protocol」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://github.com/modelcontextprotocol/modelcontextprotocol">
                    MCP仕様・ドキュメントのソースリポジトリ
                  </Ext>
                </li>
                <li>
                  <Ext href="https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/">
                    2026-07-28 仕様リリース候補について（MCP公式ブログ）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/">
                    2026年MCPロードマップ（MCP公式ブログ）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.webfuse.com/mcp-cheat-sheet">
                    MCP Cheat Sheet 2026（Webfuse）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.sitepoint.com/model-context-protocol-mcp/">
                    MCP完全ガイド2026（SitePoint）
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch2">
            <p className={styles.chapterNumber}>Chapter 02</p>
            <h2 className={styles.chapterTitle}>
              <i className="ti ti-topology-star" /> アーキテクチャの全体像
            </h2>

            <h3>三層構造：Host / Client / Server</h3>
            <p>
              MCPはホスト・クライアント・サーバーの三層構造から成るクライアントサーバー型アーキテクチャを採用しています。
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
                    <td>MCP Host</td>
                    <td>1つ以上のMCPクライアントを調整・管理するAIアプリケーション本体</td>
                    <td>Claude Desktop、Claude Code、VS Code、Cursor</td>
                  </tr>
                  <tr>
                    <td>MCP Client</td>
                    <td>
                      1つのMCPサーバーとの接続を専任で維持するコンポーネント。ホストが接続先サーバーごとに1つずつ生成する
                    </td>
                    <td>ホスト内部に組み込まれるプロトコル層</td>
                  </tr>
                  <tr>
                    <td>MCP Server</td>
                    <td>クライアントにコンテキスト（データや機能）を提供するプログラム</td>
                    <td>ファイルシステムサーバー、GitHub連携サーバー、社内DBサーバー</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              ローカルで動作しstdioトランスポートを使うMCPサーバーは通常1つのクライアントのみにサービスを提供する一方、リモートで動作しStreamable
              HTTPトランスポートを使うMCPサーバーは複数のクライアントに同時にサービスを提供するのが一般的です。
            </p>

            <div className={styles.diagramFrame}>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.arch} />
              </div>
            </div>

            <h3>基本的な通信の流れ</h3>
            <p>
              MCPの通信はすべてJSON-RPC
              2.0形式のメッセージでやり取りされます。典型的なツール呼び出しの流れは次のとおりです。
            </p>

            <div className={styles.diagramFrame}>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.seq} />
              </div>
            </div>

            <p>
              この設計により、クライアントはサーバーに「どんなツール・リソース・プロンプトを提供できるか」を自然言語の説明付きで問い合わせ、その情報をLLMに渡します。LLMがツールの利用が必要だと判断すると、ホストは該当するクライアントにツール呼び出しを指示するという流れになります。
            </p>

            <div className={styles.chapterRefs}>
              <h4>
                <i className="ti ti-link" /> この章の参考資料
              </h4>
              <ul>
                <li>
                  <Ext href="https://modelcontextprotocol.io/docs/learn/architecture">
                    MCP公式ドキュメント「Architecture overview」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://en.wikipedia.org/wiki/Model_Context_Protocol">
                    Wikipedia「Model Context Protocol」（アーキテクチャ節）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://codilime.com/blog/model-context-protocol-explained/">
                    MCP実践的技術解説（CodiLime）
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch3">
            <p className={styles.chapterNumber}>Chapter 03</p>
            <h2 className={styles.chapterTitle}>
              <i className="ti ti-puzzle" /> プリミティブ（機能単位）を理解する
            </h2>
            <p>
              MCPは「プリミティブ」と呼ばれる標準化された機能単位でサーバーとクライアントの能力を定義します。サーバー側の3つとクライアント側の3つ、合わせて6つの主要プリミティブを理解すると設計の見通しが良くなります。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>区分</th>
                    <th>プリミティブ</th>
                    <th>制御主体</th>
                    <th>役割</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>サーバー側</td>
                    <td>Tools（ツール）</td>
                    <td>モデル制御</td>
                    <td>LLMが呼び出せる実行可能な関数（DB検索、メール送信、API呼び出しなど）</td>
                  </tr>
                  <tr>
                    <td>サーバー側</td>
                    <td>Resources（リソース）</td>
                    <td>アプリケーション制御</td>
                    <td>LLMが読み取れるデータ（ファイル内容、APIレスポンス、設定情報など）</td>
                  </tr>
                  <tr>
                    <td>サーバー側</td>
                    <td>Prompts（プロンプト）</td>
                    <td>ユーザー制御</td>
                    <td>再利用可能なプロンプトテンプレート</td>
                  </tr>
                  <tr>
                    <td>クライアント側</td>
                    <td>Sampling（サンプリング）</td>
                    <td>クライアント制御</td>
                    <td>サーバーがクライアント経由でLLM補完を要求できる仕組み</td>
                  </tr>
                  <tr>
                    <td>クライアント側</td>
                    <td>Roots（ルート）</td>
                    <td>クライアント制御</td>
                    <td>
                      サーバーがアクセスしてよいファイルシステム範囲などをクライアントが明示する仕組み
                    </td>
                  </tr>
                  <tr>
                    <td>クライアント側</td>
                    <td>Elicitation（要求聴取）</td>
                    <td>クライアント制御</td>
                    <td>
                      サーバーが実行途中でユーザーへの追加入力をクライアント経由で要求する仕組み
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Tools・Resources・Promptsの使い分け</h3>
            <ul>
              <li>
                <strong>Tools</strong>
                は「実行する」ためのもので、副作用（データの変更や外部呼び出し）を伴うことが多く、実行のたびにユーザー承認を必要とする設計が推奨されます。
              </li>
              <li>
                <strong>Resources</strong>
                は「読み込む」ためのもので、副作用を持たないデータ取得に使います。REST
                APIのGETエンドポイントに近い感覚です。
              </li>
              <li>
                <strong>Prompts</strong>
                はユーザーが明示的に選択して使う定型的な指示テンプレートで、オートコンプリートのような形でユーザー体験を高める用途に向いています。
              </li>
            </ul>

            <h3>Sampling・Roots・Elicitationの使い分け</h3>
            <p>
              これらはあまり知られていないものの、人間参加型（human-in-the-loop）の設計を実現するうえで重要なプリミティブです。
            </p>
            <ul>
              <li>
                <strong>Sampling</strong>
                を使うと、サーバー自身がLLMを呼び出す代わりに、クライアント側のLLM呼び出し機能を借りることができます。これによりコストやモデル選択をユーザー・クライアント側でコントロールでき、マルチテナント環境で特に有用です。
              </li>
              <li>
                <strong>Roots</strong>
                は、サーバーがアクセスしてよいファイルシステムの安全な境界を定義します。クライアントがルートを明示することで、意図しない範囲へのファイルアクセスを防げます。
              </li>
              <li>
                <strong>Elicitation</strong>
                は、サーバーが処理の途中で追加情報をユーザーに問い合わせる際に使う、構造化された入力要求の仕組みです。機密情報の聴取に使うべきではなく、どのサーバーが要求しているかがユーザーに見えるようにする必要があるとされています。
              </li>
            </ul>

            <div className={styles.diagramFrame}>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.primitives} />
              </div>
            </div>

            <div className={styles.chapterRefs}>
              <h4>
                <i className="ti ti-link" /> この章の参考資料
              </h4>
              <ul>
                <li>
                  <Ext href="https://codilime.com/blog/model-context-protocol-explained/">
                    MCP実践的技術解説（CodiLime）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://glama.ai/blog/2025-07-10-exploring-mcps-hidden-primitives-prompts-resources-sampling-and-roots">
                    「Unlocking MCP Primitives」（Glama）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.channel.tel/blog/mcp-sampling-elicitation-patterns-builders-skip">
                    「How to Use MCP Sampling, Roots, and Elicitation」（Chanl Blog）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://workos.com/blog/mcp-features-guide">
                    「Understanding MCP features」（WorkOS）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://medium.com/@puneetsharma41/mcp-client-concepts-how-elicitation-sampling-and-roots-make-ai-agents-responsible-5f02a0666d9a">
                    「MCP Client Concepts」（Medium）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.analytical-software.de/en/the-model-context-protocol-mcp-deep-dive-into-structure-and-concepts/">
                    MCPの構造と概念の深掘り（HMS）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://frontendmasters.com/courses/mcp/roots-sampling-elicitation/">
                    Frontend Masters「Roots, Sampling, & Elicitation」
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch4">
            <p className={styles.chapterNumber}>Chapter 04</p>
            <h2 className={styles.chapterTitle}>
              <i className="ti ti-route" /> トランスポート層の選び方
            </h2>
            <p>
              トランスポート層は、クライアントとサーバー間の通信チャネルを管理する層で、接続確立・メッセージフォーミング・認証を担当します。MCPは公式には2種類のトランスポートを定義しています。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>stdio</th>
                    <th>Streamable HTTP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>通信方式</td>
                    <td>標準入出力（stdin/stdout）</td>
                    <td>HTTP POST + 任意でSSEによるストリーミング</td>
                  </tr>
                  <tr>
                    <td>想定用途</td>
                    <td>ローカルプロセス間通信、開発者ツール</td>
                    <td>リモートサーバー、複数クライアントへの同時提供</td>
                  </tr>
                  <tr>
                    <td>ネットワークオーバーヘッド</td>
                    <td>なし</td>
                    <td>あり</td>
                  </tr>
                  <tr>
                    <td>認証の要否</td>
                    <td>通常は不要</td>
                    <td>OAuth 2.1など標準的なHTTP認証が必要</td>
                  </tr>
                  <tr>
                    <td>スケーラビリティ</td>
                    <td>1クライアントに対して1サーバープロセス</td>
                    <td>ステートレス設計で水平スケール可能</td>
                  </tr>
                  <tr>
                    <td>適した場面</td>
                    <td>Claude Desktop、Claude Code、IDE拡張</td>
                    <td>クラウドVM、コンテナ、SaaS型MCPサーバー</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              なお、初期のリモート通信方式であったHTTP+SSE（Server-Sent
              Events）トランスポートは2025年3月26日の仕様改定でStreamable
              HTTPに置き換えられ、現在はレガシー扱いです。新規実装ではStreamable
              HTTPを使うことが推奨されており、既存のSSEサーバーは後方互換性のガイドラインに沿って動作し続けますが、次にコードに手を入れる際にはStreamable
              HTTPへの移行が推奨されています。
            </p>

            <h3>トランスポート選定フローチャート</h3>
            <div className={styles.diagramFrame}>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.transport} />
              </div>
            </div>

            <p>
              実運用では、ファイルシステムアクセスなどローカル処理を担当するstdioサーバーと、専門的なクラウド機能を提供するStreamable
              HTTPサーバーを組み合わせる「ゲートウェイパターン」もよく使われます。ローカルの操作は高速でネットワーク不要のまま保ちつつ、共有・高負荷な処理は集中管理されたサービスにルーティングできる構成です。
            </p>

            <div className={styles.chapterRefs}>
              <h4>
                <i className="ti ti-link" /> この章の参考資料
              </h4>
              <ul>
                <li>
                  <Ext href="https://modelcontextprotocol.io/docs/learn/architecture">
                    MCP公式ドキュメント「Architecture overview」（トランスポート節）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://sourcecraft.dev/portal/docs/en/code-assistant/operations/agent/mcp/server-transports">
                    MCPサーバートランスポート解説（SourceCraft）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://modelcontextprotocol.info/docs/concepts/transports/">
                    MCP公式ドキュメント（旧）「Transports」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://docs.roocode.com/features/mcp/server-transports">
                    MCP Server Transports（Roo Code Documentation）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://dev.to/zoricic/understanding-mcp-server-transports-stdio-sse-and-http-streamable-5b1p">
                    「Understanding MCP Server Transports」（DEV Community）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://mcpcat.io/guides/comparing-stdio-sse-streamablehttp/">
                    「MCP Transport Protocols」（MCPcat）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://dev.to/jefe_cool/mcp-transports-explained-stdio-vs-streamable-http-and-when-to-use-each-3lco">
                    「MCP Transports Explained」（DEV Community）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://kirkryan.co.uk/stdio-vs-streamable-http-choosing-the-right-mcp-transport/">
                    「stdio vs Streamable HTTP」（Kirk Ryan）
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch5">
            <p className={styles.chapterNumber}>Chapter 05</p>
            <h2 className={styles.chapterTitle}>
              <i className="ti ti-list-numbers" /> ステップバイステップ：はじめてのMCPサーバーを作る
            </h2>
            <p>ここではPython SDKを例に、初めてMCPサーバーを構築する手順を追っていきます。</p>

            <div className={styles.diagramFrame}>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.steps} />
              </div>
            </div>

            <h3>ステップ1: 環境準備</h3>
            <p>
              Python向けの公式SDKでは、パッケージ管理ツールとして <code>uv</code>{" "}
              の利用が前提とされています。Python
              3.9以上のインストールを確認したうえで、次の手順でプロジェクトを作成します。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>Terminal</span>
                <span className={styles.codeLang}>bash</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-bash">
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># プロジェクトディレクトリを作成</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}>uv init weather</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}>cd weather</span>
                  </div>
                  <div className={styles.codeLine}>&nbsp;</div>
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># 仮想環境を作成・有効化</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}>uv venv</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}>source .venv/bin/activate</span>
                  </div>
                  <div className={styles.codeLine}>&nbsp;</div>
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># 依存パッケージを追加</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}>uv add mcp httpx</span>
                  </div>
                </code>
              </pre>
            </div>

            <h3>ステップ2: 最小サーバーの実装</h3>
            <p>
              MCP Python SDKに含まれる <code>FastMCP</code>{" "}
              を使うと、型ヒント付きのPython関数とdocstringだけでツール・リソース・プロンプトを定義できます。JSON
              Schemaを手書きする必要はなく、型ヒントがそのままスキーマとして扱われます。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>server.py</span>
                <span className={styles.codeLang}>python</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-python">
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>from</span>
                    <span className={styles.cv}> mcp.server.fastmcp </span>
                    <span className={styles.ck}>import</span>
                    <span className={styles.cv}> FastMCP</span>
                  </div>
                  <div className={styles.codeLine}>&nbsp;</div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}>mcp </span>
                    <span className={styles.ck}>=</span>
                    <span className={styles.cv}> FastMCP(</span>
                    <span className={styles.cs}>"Demo"</span>
                    <span className={styles.cv}>)</span>
                  </div>
                  <div className={styles.codeLine}>&nbsp;</div>
                  <div className={styles.codeLine}>
                    <span className={styles.ce}>@mcp.tool()</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>def</span>
                    <span className={styles.ce}> add</span>
                    <span className={styles.cv}>(a: int, b: int) </span>
                    <span className={styles.ck}>-&gt;</span>
                    <span className={styles.cv}> int:</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}> </span>
                    <span className={styles.cs}>"""2つの数値を加算する"""</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}> return</span>
                    <span className={styles.cv}> a </span>
                    <span className={styles.ck}>+</span>
                    <span className={styles.cv}> b</span>
                  </div>
                  <div className={styles.codeLine}>&nbsp;</div>
                  <div className={styles.codeLine}>
                    <span className={styles.ce}>@mcp.resource("greeting://{"{name}"}")</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>def</span>
                    <span className={styles.ce}> get_greeting</span>
                    <span className={styles.cv}>(name: str) </span>
                    <span className={styles.ck}>-&gt;</span>
                    <span className={styles.cv}> str:</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}> </span>
                    <span className={styles.cs}>"""名前に応じた挨拶文を返す"""</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}> return</span>
                    <span className={styles.cv}> f</span>
                    <span className={styles.cs}>"Hello, {"{name}"}!"</span>
                  </div>
                  <div className={styles.codeLine}>&nbsp;</div>
                  <div className={styles.codeLine}>
                    <span className={styles.ce}>@mcp.prompt()</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>def</span>
                    <span className={styles.ce}> greet_user</span>
                    <span className={styles.cv}>(name: str, style: str </span>
                    <span className={styles.ck}>=</span>
                    <span className={styles.cs}> "friendly"</span>
                    <span className={styles.cv}>) </span>
                    <span className={styles.ck}>-&gt;</span>
                    <span className={styles.cv}> str:</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}> </span>
                    <span className={styles.cs}>
                      """挨拶文生成用のプロンプトテンプレートを返す"""
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}> return</span>
                    <span className={styles.cv}> f</span>
                    <span className={styles.cs}>
                      "Write a {"{style}"} greeting for someone named {"{name}"}."
                    </span>
                  </div>
                  <div className={styles.codeLine}>&nbsp;</div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>if</span>
                    <span className={styles.cv}> __name__ </span>
                    <span className={styles.ck}>==</span>
                    <span className={styles.cs}> "__main__"</span>
                    <span className={styles.cv}>:</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}> mcp.run(transport</span>
                    <span className={styles.ck}>=</span>
                    <span className={styles.cs}>"streamable-http"</span>
                    <span className={styles.cv}>)</span>
                  </div>
                </code>
              </pre>
            </div>

            <h3>ステップ3: MCP Inspectorで動作確認する</h3>
            <p>
              実装したサーバーが期待どおり動くかを確認するには、公式の「MCP
              Inspector」というブラウザベースのテストツールを使います。SDKに <code>cli</code>{" "}
              オプション付きでインストールしていれば、次のコマンドでInspectorが自動的に起動します。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>Terminal</span>
                <span className={styles.codeLang}>bash</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-bash">
                  <div className={styles.codeLine}>
                    <span className={styles.cv}>uv add "mcp[cli]"</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}>mcp dev server.py</span>
                  </div>
                </code>
              </pre>
            </div>

            <p>
              これによりローカルにInspectorのWeb
              UIが起動し（デフォルトではポート6274）、ツール一覧の確認・任意パラメータでのツール呼び出し・リソースの中身確認などをブラウザ上で対話的に行えます。npm経由でも次のようにインストール不要で起動できます。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>Terminal</span>
                <span className={styles.codeLang}>bash</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-bash">
                  <div className={styles.codeLine}>
                    <span className={styles.cv}>
                      npx -y @modelcontextprotocol/inspector uvx &lt;package-name&gt; &lt;args&gt;
                    </span>
                  </div>
                </code>
              </pre>
            </div>

            <h3>ステップ4: Claude Desktopなどホストアプリへの接続</h3>
            <p>
              動作確認ができたら、ホストアプリの設定ファイルにサーバー起動コマンドを登録します。Claude
              Desktopの場合は設定ファイル内の <code>mcpServers</code>{" "}
              オブジェクトに以下のようなエントリを追加します。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>claude_desktop_config.json</span>
                <span className={styles.codeLang}>json</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-json">
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>{"{"}</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}> "mcpServers"</span>
                    <span className={styles.cs}>: {"{"}</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}> "weather"</span>
                    <span className={styles.cs}>: {"{"}</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}> "command"</span>
                    <span className={styles.cs}>: </span>
                    <span className={styles.cv}>"uv"</span>
                    <span className={styles.cs}>,</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}> "args"</span>
                    <span className={styles.cs}>: [</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}> "--directory"</span>
                    <span className={styles.cs}>,</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}> "/absolute/path/to/weather"</span>
                    <span className={styles.cs}>,</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}> "run"</span>
                    <span className={styles.cs}>,</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}> "weather"</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}> ]</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}> {"}"}</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}> {"}"}</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>{"}"}</span>
                  </div>
                </code>
              </pre>
            </div>

            <p>
              設定後にホストアプリを再起動すると、ツールアイコン（Claude
              Desktopの場合はハンマーアイコン）から登録したツールが認識されているかを確認できます。
            </p>

            <div className={styles.chapterRefs}>
              <h4>
                <i className="ti ti-link" /> この章の参考資料
              </h4>
              <ul>
                <li>
                  <Ext href="https://github.com/modelcontextprotocol/python-sdk">
                    MCP公式Python SDK（GitHub）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://modelcontextprotocol.info/docs/quickstart/quickstart/">
                    MCP公式ドキュメント「Quickstart」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://modelcontextprotocol.io/tutorials/building-a-client">
                    MCP公式ドキュメント「Building MCP clients」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://modelcontextprotocol.io/docs/tools/inspector">
                    MCP Inspector公式ドキュメント
                  </Ext>
                </li>
                <li>
                  <Ext href="https://github.com/modelcontextprotocol/inspector">
                    MCP Inspector（GitHub）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://pypi.org/project/mcp/">Python SDKパッケージ（PyPI）</Ext>
                </li>
                <li>
                  <Ext href="https://modelcontextprotocol.github.io/python-sdk/">
                    Python SDKドキュメント
                  </Ext>
                </li>
                <li>
                  <Ext href="https://codesignal.com/learn/courses/developing-and-integrating-a-mcp-server-in-python/lessons/getting-started-with-fastmcp-running-your-first-mcp-server-with-stdio-and-sse">
                    CodeSignal「Getting Started with FastMCP」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://medium.com/@laurentkubaski/how-to-use-mcp-inspector-2748cd33faeb">
                    「How to use MCP Inspector」（Medium）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://en.bioerrorlog.work/entry/how-to-use-mcp-inspector">
                    「How to Use MCP Inspector」（BioErrorLog）
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch6">
            <p className={styles.chapterNumber}>Chapter 06</p>
            <h2 className={styles.chapterTitle}>
              <i className="ti ti-tool" /> ツール設計のベストプラクティス
            </h2>
            <p>
              ツール設計はMCPサーバー開発における最も重要な工程です。Anthropicのエンジニアリングブログでは、AIエージェント向けにツールを書く際の考え方を、人間の開発者向けAPI設計とは異なる観点から論じています。
            </p>

            <h3>良いツール設計の原則</h3>
            <ul>
              <li>
                <strong>ドメインごとの名前空間をつける</strong>: <code>search_contacts</code>{" "}
                のように機能ドメインを接頭辞として持たせることで、ツールが増えてもスケールしやすくなります。
              </li>
              <li>
                <strong>単一責任にする</strong>:
                複雑なロジックを1つの巨大なツールに詰め込まず、小さく明確な責務を持つツールに分割します。
              </li>
              <li>
                <strong>一覧取得ではなく検索を優先する</strong>:
                全件返すツールよりも、検索条件を絞り込めるツールのほうが大量データによるコンテキスト圧迫を防げます。
              </li>
              <li>
                <strong>パラメータは最小限にし、型を明確にする</strong>:
                不要なパラメータを減らし、可能な限り具体的なデータ型を指定します。
              </li>
              <li>
                <strong>ツールの説明は具体的に書く</strong>:
                「データベースを操作する」のような曖昧な説明ではなく、「分析用データベースに対して読み取り専用のSELECTクエリを実行する」のように期待される入出力・利用範囲を明示します。曖昧なツール説明は、モデルが誤ったツールを選んだり誤ったパラメータで実行してしまう最も多い原因とされています。
              </li>
              <li>
                <strong>「使うべきでない場面」も明示する</strong>:
                想定される代替手段や適用外のケースを説明に含めることで、モデルの誤用を防ぎます。
              </li>
              <li>
                <strong>エラーハンドリングを実装する</strong>:
                エラーハンドリングが欠けていると、モデルに応答が返らずハルシネーションや処理停止を招く原因になります。
              </li>
              <li>
                <strong>ツールアノテーションを活用する</strong>:
                そのツールが外部世界に影響するオープンワールドアクセスを必要とするか、破壊的な変更を伴うかをクライアントに開示できます。
              </li>
            </ul>

            <h3>良い例・悪い例の比較</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>悪い例</th>
                    <th>良い例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ツール名</td>
                    <td>
                      <code>chat</code>, <code>get_conversation</code>（汎用的すぎる）
                    </td>
                    <td>
                      <code>conversation_search</code>（ドメインと目的が明確）
                    </td>
                  </tr>
                  <tr>
                    <td>説明文</td>
                    <td>"Chat with the AI agent."</td>
                    <td>
                      応答形式・想定レスポンス時間・レート制限・代替ツールまで含めた具体的な説明
                    </td>
                  </tr>
                  <tr>
                    <td>データ取得方法</td>
                    <td>
                      <code>list_contacts</code>（全件取得）
                    </td>
                    <td>
                      <code>search_contacts</code>（検索条件で絞り込み）
                    </td>
                  </tr>
                  <tr>
                    <td>エラー処理</td>
                    <td>権限エラー時に何も返さない</td>
                    <td>「どのユーザーに権限を依頼すべきか」まで含めたエラーメッセージ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>開発プロセスとしてのツール改善サイクル</h3>
            <p>
              Anthropicのガイダンスでは、ツールをまず簡易的なプロトタイプとしてローカルで動かし、次に包括的な評価（エバリュエーション）を実行して変更の効果を測定し、その評価結果を見ながらエージェントと協力してツールを改善していくという反復プロセスが推奨されています。ツールの説明文を少し改善するだけでもエラー率が大きく下がることがあり、Claudeの各種ベンチマークにおいてツール説明の精緻化が性能向上に直結した実例が報告されています。
            </p>

            <h3>大量のツールを扱う場合のトークン効率化</h3>
            <p>
              MCPサーバーの数が増えると、ツール定義や中間結果がコンテキストウィンドウを圧迫し、エージェントの速度とコストに悪影響を与える課題があります。この課題に対し、Anthropicは「コード実行によるMCP連携」というアプローチを提案しています。あらかじめすべてのツール定義をコンテキストに読み込むのではなく、接続済みMCPサーバーのツール群をコードとして探索可能なファイルツリーのように提示し、エージェントが必要なツールのファイルだけを読み込んで実行するという方式です。この手法により、あるケースではトークン使用量を15万トークンから2,000トークンへと大幅に削減できたと報告されています。同様の発想はCloudflareも「Code
              Mode」として発表しており、LLMがコードを書くことに長けている点を活用する共通の設計思想が背景にあります。
            </p>

            <div className={styles.diagramFrame}>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.tokens} />
              </div>
            </div>

            <div className={styles.chapterRefs}>
              <h4>
                <i className="ti ti-link" /> この章の参考資料
              </h4>
              <ul>
                <li>
                  <Ext href="https://www.anthropic.com/engineering/writing-tools-for-agents">
                    「Writing effective tools for AI agents」（Anthropic Engineering）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.anthropic.com/engineering/code-execution-with-mcp">
                    「Code execution with MCP」（Anthropic Engineering）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://github.com/vishnu2kmohan/mcp-server-langgraph/blob/main/adr/adr-0023-anthropic-tool-design-best-practices.md">
                    ADR: Anthropicツール設計ベストプラクティス適用例（GitHub）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://blog.logrocket.com/understanding-anthropic-model-context-protocol-mcp/">
                    「Understanding Anthropic's MCP」（LogRocket）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://obot.ai/resources/learning-center/mcp-anthropic/">
                    「Building with MCP」（Obot AI Learning Center）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://medium.com/intuitionmachine/structuring-agents-skills-and-mcps-best-practices-from-anthropic-9312849ccea6">
                    「Structuring Agents, Skills, and MCPs」（Medium）
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch7">
            <p className={styles.chapterNumber}>Chapter 07</p>
            <h2 className={styles.chapterTitle}>
              <i className="ti ti-shield-lock" /> セキュリティのベストプラクティス
            </h2>
            <p>
              MCPはAIエージェントに強力な実行権限を与える性質上、独自のセキュリティリスクを抱えています。複数のセキュリティ調査（Equixlyによる初期の報告や2026年の別調査など）では、公開されている多くの初期MCPサーバーにおいてコマンドインジェクションやパストラバーサル、SSRF（サーバーサイドリクエストフォージェリ）などの欠陥が報告されています。また、デフォルトで認証が設定されていなかったり、認証情報を安全に扱っていないサーバーも多数存在することが指摘されており、依然として本番運用に耐えるセキュリティ設計が十分に施されていないケースが多いのが実情です。
            </p>

            <h3>主要な脅威一覧</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>脅威</th>
                    <th>概要</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tool Poisoning（ツール汚染）</td>
                    <td>
                      ツールの説明・パラメータスキーマ・戻り値に隠された悪意ある指示を埋め込み、LLMの挙動を操作する攻撃
                    </td>
                  </tr>
                  <tr>
                    <td>Rug Pull（ラグプル）</td>
                    <td>
                      ユーザーが一度承認したあとに、サーバー側がツール定義をひそかに変更し、信頼済みツールを悪意あるものへ変える攻撃
                    </td>
                  </tr>
                  <tr>
                    <td>Tool Shadowing</td>
                    <td>
                      ある悪意あるサーバーのツール説明が、別の信頼できるサーバーのツールの挙動にまで影響を及ぼす攻撃
                    </td>
                  </tr>
                  <tr>
                    <td>Confused Deputy</td>
                    <td>
                      MCPサーバーがリクエスト元ユーザーではなく、サーバー自身の広範な権限で処理を実行してしまう問題
                    </td>
                  </tr>
                  <tr>
                    <td>正規チャネル経由のデータ流出</td>
                    <td>
                      プロンプトインジェクションを利用して、検索クエリなど一見正常なツール呼び出しに機密情報を紛れ込ませて持ち出す攻撃
                    </td>
                  </tr>
                  <tr>
                    <td>過剰な権限</td>
                    <td>
                      必要以上に広いOAuthスコープをMCPサーバーが要求し、複数サービスの権限が集約されることで被害が拡大するリスク
                    </td>
                  </tr>
                  <tr>
                    <td>Token Passthrough</td>
                    <td>自分宛てに発行されていないトークンをそのまま受け入れてしまう問題</td>
                  </tr>
                  <tr>
                    <td>SSRF</td>
                    <td>
                      LLMが生成したパラメータに基づいてURLを取得するツールが、クラウドのメタデータエンドポイントなど内部リソースへのアクセスに悪用される攻撃
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              実際の事例として、Invariant
              Labsはある調査で、WhatsApp用MCPサーバーと同じエージェントコンテキストに存在する別の悪意あるMCPサーバーが、ツール説明への汚染を通じてユーザーのメッセージ履歴全体を密かに外部へ送信できることを実証しています。この攻撃はネットワークレベルの脆弱性もユーザー操作ミスも必要とせず、ツールの説明文というLLMが暗黙的に信頼する領域を悪用する点が特徴です。
            </p>

            <h3>多層防御の考え方</h3>
            <div className={styles.diagramFrame}>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.security} />
              </div>
            </div>

            <h3>具体的な実装上のポイント</h3>
            <ul>
              <li>
                <strong>OAuth 2.1とPKCEを必須にする</strong>: 2025年6月18日の仕様改定でOAuth
                2.1ベースの認可が正式に採用され、MCPサーバーは「OAuthリソースサーバー」として位置づけられ、認可機能は専用の認可サーバーが担う設計に整理されました。
              </li>
              <li>
                <strong>トークンのaudience検証を行う</strong>:
                自分宛てに発行されたトークンであることをRFC
                8707/9068などに基づいて検証し、トークンの素通しを避けます。
              </li>
              <li>
                <strong>セッションIDを認証に使わない</strong>:
                推測されにくい安全な乱数ベースのセッションIDを使い、必要に応じてユーザー固有の情報とセッションIDを紐づけて検証します。
              </li>
              <li>
                <strong>スコープは細かく絞る</strong>: 機能ごとに必要最小限の権限だけを要求します。
              </li>
              <li>
                <strong>ツール応答は構造化フォーマットを要求する</strong>:
                固定スキーマのJSONを要求し、期待する形式に一致しない応答は拒否します。
              </li>
              <li>
                <strong>権限の高いツールは隔離する</strong>:
                ファイルアクセスやDB操作など高権限のツールは、外部の未検証MCPサーバーが到達できない別のエージェントコンテキストで実行します。
              </li>
              <li>
                <strong>承認済みサーバーの許可リストを維持する</strong>:
                事前に精査・承認されたサーバーのみを許可します。
              </li>
              <li>
                <strong>ツール定義の変更を検知する</strong>:
                暗号学的ハッシュでツール定義を固定し、変更があれば警告する仕組みを導入します。
              </li>
              <li>
                <strong>SSRF対策としてURLの許可リストを設ける</strong>:
                厳格な許可リストによる検証なしに任意のURLへアクセスさせないようにします。
              </li>
              <li>
                <strong>シークレットをコードや設定に埋め込まない</strong>:
                専用のシークレット管理サービスを利用します。
              </li>
            </ul>

            <h3>やってはいけないことチェックリスト</h3>
            <div className={styles.tableWrap}>
              <table>
                <tbody>
                  <tr>
                    <td style={{ width: "40px" }}>
                      <i
                        className="ti ti-x"
                        style={{ color: "var(--color-text-danger, #ef9a92)" }}
                      />
                    </td>
                    <td>パラメータの詳細をユーザーに見せずにツール呼び出しを自動承認する</td>
                  </tr>
                  <tr>
                    <td>
                      <i
                        className="ti ti-x"
                        style={{ color: "var(--color-text-danger, #ef9a92)" }}
                      />
                    </td>
                    <td>ツールの説明文を無条件に信頼する</td>
                  </tr>
                  <tr>
                    <td>
                      <i
                        className="ti ti-x"
                        style={{ color: "var(--color-text-danger, #ef9a92)" }}
                      />
                    </td>
                    <td>複数のMCPサーバー間でOAuthトークンや認証情報を使い回す</td>
                  </tr>
                  <tr>
                    <td>
                      <i
                        className="ti ti-x"
                        style={{ color: "var(--color-text-danger, #ef9a92)" }}
                      />
                    </td>
                    <td>
                      MCPサーバーをホストへのフルアクセス権限や <code>*</code> 権限で実行する
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i
                        className="ti ti-x"
                        style={{ color: "var(--color-text-danger, #ef9a92)" }}
                      />
                    </td>
                    <td>未検証の公開レジストリからレビューなしにMCPサーバーをインストールする</td>
                  </tr>
                  <tr>
                    <td>
                      <i
                        className="ti ti-x"
                        style={{ color: "var(--color-text-danger, #ef9a92)" }}
                      />
                    </td>
                    <td>「昨日承認したツールは今日も同じ」という前提を置く</td>
                  </tr>
                  <tr>
                    <td>
                      <i
                        className="ti ti-x"
                        style={{ color: "var(--color-text-danger, #ef9a92)" }}
                      />
                    </td>
                    <td>サーバー間の相互作用を無視する</td>
                  </tr>
                  <tr>
                    <td>
                      <i
                        className="ti ti-x"
                        style={{ color: "var(--color-text-danger, #ef9a92)" }}
                      />
                    </td>
                    <td>シークレットをMCPサーバーのコード・設定・環境変数に保存する</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.chapterRefs}>
              <h4>
                <i className="ti ti-link" /> この章の参考資料
              </h4>
              <ul>
                <li>
                  <Ext href="https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices">
                    MCP公式ドキュメント「Security Best Practices」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html">
                    OWASP「MCP Security Cheat Sheet」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://owasp.org/www-community/attacks/MCP_Tool_Poisoning">
                    OWASP「MCP Tool Poisoning」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://codersera.com/blog/how-to-secure-mcp-servers-2026/">
                    「How to Secure MCP Servers」（CodersEra）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://labs.cloudsecurityalliance.org/agentic/agentic-mcp-security-best-practices-v1/">
                    Cloud Security Alliance「Agentic MCP Security Best Practices Guide」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.sentinelone.com/cybersecurity-101/cybersecurity/mcp-security/">
                    SentinelOne「Model Context Protocol (MCP) Security」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.practical-devsecops.com/mcp-security-best-practices/">
                    Practical DevSecOps「MCP Security Best Practices」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://checkmarx.com/learn/mcp-security-risks-real-world-incidents-and-security-controls/">
                    Checkmarx「MCP Security Risks, Best Practices, and Security Controls」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.descope.com/blog/post/mcp-server-security-best-practices">
                    Descope「MCP Server Security Best Practices」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.truefoundry.com/blog/mcp-security-risks-best-practices">
                    TrueFoundry「MCP Security Risks & Best Practices」
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch8">
            <p className={styles.chapterNumber}>Chapter 08</p>
            <h2 className={styles.chapterTitle}>
              <i className="ti ti-server-cog" /> 本番運用・デプロイのベストプラクティス
            </h2>

            <h3>監視・ログ・監査</h3>
            <p>
              本番環境では、すべてのツール呼び出しに対してログと監視の仕組みを整備することが強く推奨されます。誰が、どのクライアントが、どのサーバーの、どの引数で、どんな結果を得たかを記録することで、ある操作がユーザー起因なのか、モデル起因なのか、あるいはインジェクション攻撃起因なのかを事後的に追跡できるようになります。
            </p>

            <h3>バージョニングと後方互換性</h3>
            <p>
              MCPはまだ比較的新しく急速に進化しているプロトコルであるため、コアとなる概念は安定している一方で、サーバー・クライアントのバージョンアップに伴う後方互換性の課題がしばしば発生します。本番環境では、セマンティックバージョニングの採用やバージョン固定を行い、仕様変更による予期しない破壊的変更の影響を最小限に抑えることが推奨されます。
            </p>

            <h3>デプロイアーキテクチャ：ゲートウェイパターン</h3>
            <p>
              複数のMCPサーバーを組織全体で運用する場合、個別にクレデンシャルを管理するのではなく、集中管理されたゲートウェイを介して構成を一元化するパターンがよく採用されます。
            </p>

            <div className={styles.diagramFrame}>
              <div className={styles.mermaidDiagram}>
                <MermaidDiagram chart={DIAGRAMS.gateway} />
              </div>
            </div>

            <p>
              このパターンの利点は、1箇所の設定を複数のエージェントが共有できるため監査がしやすくスワップも容易になる点、また同じスキルセットや設定を対話モードとヘッドレスモードの両方に使い回せる点です。
            </p>

            <h3>開発環境と本番環境でのツール権限の使い分け</h3>
            <p>
              開発中のMCPサーバーはデータ投入やテスト用にやや広めのスコープを持たせることがあっても、本番環境では同じエージェントであっても書き込み操作は人手の承認を必須とし、既定では読み取り専用にとどめるといった、環境ごとの権限の切り替えが推奨されます。
            </p>

            <div className={styles.chapterRefs}>
              <h4>
                <i className="ti ti-link" /> この章の参考資料
              </h4>
              <ul>
                <li>
                  <Ext href="https://blog.logrocket.com/understanding-anthropic-model-context-protocol-mcp/">
                    「Understanding Anthropic's MCP」（LogRocket）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://medium.com/intuitionmachine/structuring-agents-skills-and-mcps-best-practices-from-anthropic-9312849ccea6">
                    「Structuring Agents, Skills, and MCPs」（Medium）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.descope.com/blog/post/mcp-server-security-best-practices">
                    Descope「MCP Server Security Best Practices」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/">
                    MCP公式ブログ「2026 MCP Roadmap」
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch9">
            <p className={styles.chapterNumber}>Chapter 09</p>
            <h2 className={styles.chapterTitle}>
              <i className="ti ti-bug" /> デバッグ・テスト・公開
            </h2>

            <h3>MCP Inspectorの活用</h3>
            <p>
              MCP
              Inspectorは公式が提供するブラウザベースの対話型テスト・デバッグツールです。主な構成要素は2つあります。
            </p>

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
                    <td>MCP Inspector Client (MCPI)</td>
                    <td>
                      Reactベースのウェブ画面で、ツール・リソース・プロンプトの一覧確認と実行を対話的に行える
                    </td>
                  </tr>
                  <tr>
                    <td>MCP Proxy (MCPP)</td>
                    <td>
                      Node.jsサーバーとして動作し、Web
                      UIとMCPサーバーの間をstdio・SSE・streamable-httpなど様々なトランスポートで橋渡しする
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>Inspectorは以下のようにインストール不要で起動できます。</p>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>Terminal</span>
                <span className={styles.codeLang}>bash</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-bash">
                  <div className={styles.codeLine}>
                    <span className={styles.cv}>
                      npx -y @modelcontextprotocol/inspector node build/index.js
                    </span>
                  </div>
                </code>
              </pre>
            </div>

            <p>
              CLIモードも用意されており、スクリプトや自動化パイプライン、コーディングアシスタントとの統合にも向いています。
            </p>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>Terminal</span>
                <span className={styles.codeLang}>bash</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-bash">
                  <div className={styles.codeLine}>
                    <span className={styles.cv}>
                      npx @modelcontextprotocol/inspector --cli node build/index.js
                    </span>
                  </div>
                </code>
              </pre>
            </div>

            <p>
              複数サーバーを扱う場合は設定ファイルを使って管理することもでき、
              <code>mcpServers</code>{" "}
              オブジェクトの中にサーバーごとの起動コマンドや接続方式をまとめて記述できます。
            </p>

            <h3>テストの観点</h3>
            <ul>
              <li>
                単一のホストアプリだけでなく、複数の異なるホストアプリケーションに対してサーバーを検証し、プロトコル準拠性を確認することが推奨されています。
              </li>
              <li>
                ツールの説明文やスキーマを変更した際は、必ず評価を再実行して、モデルの挙動に悪影響がないかを確認します。
              </li>
              <li>
                エラーケース（不正な入力、権限不足、タイムアウトなど）についても、モデルが適切にフォールバックできるかをテストします。
              </li>
            </ul>

            <div className={styles.chapterRefs}>
              <h4>
                <i className="ti ti-link" /> この章の参考資料
              </h4>
              <ul>
                <li>
                  <Ext href="https://modelcontextprotocol.io/docs/tools/inspector">
                    MCP Inspector公式ドキュメント
                  </Ext>
                </li>
                <li>
                  <Ext href="https://github.com/modelcontextprotocol/inspector">
                    MCP Inspector（GitHub）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://medium.com/@laurentkubaski/how-to-use-mcp-inspector-2748cd33faeb">
                    「How to use MCP Inspector」（Medium）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://en.bioerrorlog.work/entry/how-to-use-mcp-inspector">
                    「How to Use MCP Inspector」（BioErrorLog）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.sitepoint.com/model-context-protocol-mcp/">
                    MCP完全ガイド2026（SitePoint）
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch10">
            <p className={styles.chapterNumber}>Chapter 10</p>
            <h2 className={styles.chapterTitle}>
              <i className="ti ti-alert-triangle" /> よくあるアンチパターンとその対策
            </h2>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>アンチパターン</th>
                    <th>何が起きるか</th>
                    <th>対策</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ツール名・説明文が汎用的すぎる</td>
                    <td>モデルが誤ったツールを選択したり、誤った引数で呼び出す</td>
                    <td>ドメインを明示した命名と、具体的な説明文を書く</td>
                  </tr>
                  <tr>
                    <td>一覧取得系ツールしか用意しない</td>
                    <td>大量データがコンテキストを圧迫し、応答が遅くなる</td>
                    <td>検索・絞り込みができるツールを用意する</td>
                  </tr>
                  <tr>
                    <td>エラーハンドリングを省略する</td>
                    <td>モデルに応答が返らず、ハルシネーションや処理停止を招く</td>
                    <td>失敗時に次のアクションが分かるエラーメッセージを設計する</td>
                  </tr>
                  <tr>
                    <td>ツールの説明文を無条件に信頼する</td>
                    <td>ツール汚染の被害を受ける</td>
                    <td>サーバー側で実行制御を行い、モデルの指示に権限判断を委ねない</td>
                  </tr>
                  <tr>
                    <td>認証なしでリモートサーバーを公開する</td>
                    <td>機密情報や実行権限が漏洩する</td>
                    <td>OAuth 2.1 + PKCEなど標準的な認証・認可を必須にする</td>
                  </tr>
                  <tr>
                    <td>開発時と同じ広い権限を本番でも使う</td>
                    <td>一度の誤動作・侵害の被害範囲が広がる</td>
                    <td>本番では読み取り専用を既定にし、書き込みは人手承認を必須にする</td>
                  </tr>
                  <tr>
                    <td>すべてのツール定義を毎回コンテキストに載せる</td>
                    <td>トークンコストとレイテンシが増大する</td>
                    <td>必要なツールだけを動的に読み込む設計を検討する</td>
                  </tr>
                  <tr>
                    <td>バージョン固定をせずに運用する</td>
                    <td>仕様変更やSDK更新で突然動作しなくなる</td>
                    <td>セマンティックバージョニングやバージョンピン留めを採用する</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.chapterRefs}>
              <h4>
                <i className="ti ti-link" /> この章の参考資料
              </h4>
              <ul>
                <li>
                  <Ext href="https://www.anthropic.com/engineering/writing-tools-for-agents">
                    「Writing effective tools for AI agents」（Anthropic Engineering）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://owasp.org/www-community/attacks/MCP_Tool_Poisoning">
                    OWASP「MCP Tool Poisoning」
                  </Ext>
                </li>
                <li>
                  <Ext href="https://blog.logrocket.com/understanding-anthropic-model-context-protocol-mcp/">
                    「Understanding Anthropic's MCP」（LogRocket）
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.anthropic.com/engineering/code-execution-with-mcp">
                    「Code execution with MCP」（Anthropic Engineering）
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch11">
            <p className={styles.chapterNumber}>Chapter 11</p>
            <h2 className={styles.chapterTitle}>
              <i className="ti ti-checklist" /> まとめ：導入前チェックリスト
            </h2>
            <p>MCPサーバーを新規に開発・公開する前に、以下の項目を確認することをおすすめします。</p>

            <div className={styles.tableWrap}>
              <table className={styles.checkTable}>
                <tbody>
                  <tr>
                    <td>01</td>
                    <td>
                      サーバーが提供する各ツールの目的・入出力・利用範囲が明確に文書化されているか
                    </td>
                  </tr>
                  <tr>
                    <td>02</td>
                    <td>
                      ツールの説明文は具体的で、「使うべきでない場面」も含めて記載されているか
                    </td>
                  </tr>
                  <tr>
                    <td>03</td>
                    <td>一覧取得ではなく検索・絞り込みができるツール設計になっているか</td>
                  </tr>
                  <tr>
                    <td>04</td>
                    <td>すべてのツール呼び出しに対するログ・監視の仕組みが整っているか</td>
                  </tr>
                  <tr>
                    <td>05</td>
                    <td>
                      リモート公開する場合、OAuth 2.1 + PKCEなど標準的な認証・認可が実装されているか
                    </td>
                  </tr>
                  <tr>
                    <td>06</td>
                    <td>トークンのaudience検証を行い、素通しを防いでいるか</td>
                  </tr>
                  <tr>
                    <td>07</td>
                    <td>破壊的・不可逆な操作には人手の承認フローが挟まれているか</td>
                  </tr>
                  <tr>
                    <td>08</td>
                    <td>ツール定義の変更（ラグプル）を検知する仕組みがあるか</td>
                  </tr>
                  <tr>
                    <td>09</td>
                    <td>未検証のMCPサーバーを許可リストなしに接続できる状態になっていないか</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>複数のホストアプリケーションに対してプロトコル準拠性を検証したか</td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>
                      レート制限・タイムアウトポリシーが設定され、暴走リクエストを防いでいるか
                    </td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>バージョン管理の方針が定まっているか</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={`${styles.chapter} ${styles.refBlock} chapter`} id="references">
            <p className={styles.chapterNumber}>References</p>
            <h2 className={styles.chapterTitle}>
              <i className="ti ti-link" /> 参考文献一覧
            </h2>
            <p>
              本ガイド全体で参照した情報源のURL一覧です（章ごとの参考資料と重複する項目を含みます）。
            </p>

            <h3>公式ドキュメント・公式ブログ</h3>
            <ul>
              <li>
                <Ext href="https://modelcontextprotocol.io/docs/getting-started/intro">
                  <span className={styles.refTitle}>
                    <i className="ti ti-file-text" /> MCP公式ドキュメント: イントロダクション
                  </span>
                  <span className={styles.refUrl}>
                    https://modelcontextprotocol.io/docs/getting-started/intro
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://modelcontextprotocol.io/docs/learn/architecture">
                  <span className={styles.refTitle}>
                    <i className="ti ti-file-text" /> MCP公式ドキュメント: Architecture overview
                  </span>
                  <span className={styles.refUrl}>
                    https://modelcontextprotocol.io/docs/learn/architecture
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices">
                  <span className={styles.refTitle}>
                    <i className="ti ti-file-text" /> MCP公式ドキュメント: Security Best Practices
                  </span>
                  <span className={styles.refUrl}>
                    https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://modelcontextprotocol.io/docs/tools/inspector">
                  <span className={styles.refTitle}>
                    <i className="ti ti-file-text" /> MCP公式ドキュメント: Inspector
                  </span>
                  <span className={styles.refUrl}>
                    https://modelcontextprotocol.io/docs/tools/inspector
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://modelcontextprotocol.io/tutorials/building-a-client">
                  <span className={styles.refTitle}>
                    <i className="ti ti-file-text" /> MCP公式ドキュメント: Building MCP clients
                  </span>
                  <span className={styles.refUrl}>
                    https://modelcontextprotocol.io/tutorials/building-a-client
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://modelcontextprotocol.info/docs/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-file-text" /> MCP公式ドキュメント（旧版トップページ）
                  </span>
                  <span className={styles.refUrl}>https://modelcontextprotocol.info/docs/</span>
                </Ext>
              </li>
              <li>
                <Ext href="https://modelcontextprotocol.info/docs/quickstart/quickstart/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-file-text" /> MCP公式ドキュメント: Quickstart
                  </span>
                  <span className={styles.refUrl}>
                    https://modelcontextprotocol.info/docs/quickstart/quickstart/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://modelcontextprotocol.info/docs/concepts/transports/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-file-text" /> MCP公式ドキュメント（旧）: Transports
                  </span>
                  <span className={styles.refUrl}>
                    https://modelcontextprotocol.info/docs/concepts/transports/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/modelcontextprotocol">
                  <span className={styles.refTitle}>
                    <i className="ti ti-brand-github" /> MCP公式GitHub Organization
                  </span>
                  <span className={styles.refUrl}>https://github.com/modelcontextprotocol</span>
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/modelcontextprotocol/modelcontextprotocol">
                  <span className={styles.refTitle}>
                    <i className="ti ti-brand-github" /> MCP仕様・ドキュメントのソースリポジトリ
                  </span>
                  <span className={styles.refUrl}>
                    https://github.com/modelcontextprotocol/modelcontextprotocol
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/modelcontextprotocol/python-sdk">
                  <span className={styles.refTitle}>
                    <i className="ti ti-brand-github" /> MCP公式Python SDK（GitHub）
                  </span>
                  <span className={styles.refUrl}>
                    https://github.com/modelcontextprotocol/python-sdk
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/modelcontextprotocol/inspector">
                  <span className={styles.refTitle}>
                    <i className="ti ti-brand-github" /> MCP Inspector（GitHub）
                  </span>
                  <span className={styles.refUrl}>
                    https://github.com/modelcontextprotocol/inspector
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://modelcontextprotocol.github.io/python-sdk/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-file-text" /> Python SDKドキュメント
                  </span>
                  <span className={styles.refUrl}>
                    https://modelcontextprotocol.github.io/python-sdk/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://pypi.org/project/mcp/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-package" /> Python SDKパッケージ（PyPI）
                  </span>
                  <span className={styles.refUrl}>https://pypi.org/project/mcp/</span>
                </Ext>
              </li>
              <li>
                <Ext href="https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-news" /> MCP公式ブログ: 2026-07-28 仕様リリース候補について
                  </span>
                  <span className={styles.refUrl}>
                    https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-news" /> MCP公式ブログ: 2026年MCPロードマップ
                  </span>
                  <span className={styles.refUrl}>
                    https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://www.anthropic.com/news/model-context-protocol">
                  <span className={styles.refTitle}>
                    <i className="ti ti-news" /> Anthropic公式発表記事: Introducing the Model
                    Context Protocol
                  </span>
                  <span className={styles.refUrl}>
                    https://www.anthropic.com/news/model-context-protocol
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://www.anthropic.com/engineering/writing-tools-for-agents">
                  <span className={styles.refTitle}>
                    <i className="ti ti-news" /> Anthropic Engineering: Writing effective tools for
                    AI agents
                  </span>
                  <span className={styles.refUrl}>
                    https://www.anthropic.com/engineering/writing-tools-for-agents
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://www.anthropic.com/engineering/code-execution-with-mcp">
                  <span className={styles.refTitle}>
                    <i className="ti ti-news" /> Anthropic Engineering: Code execution with MCP
                  </span>
                  <span className={styles.refUrl}>
                    https://www.anthropic.com/engineering/code-execution-with-mcp
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://anthropic.skilljar.com/introduction-to-model-context-protocol">
                  <span className={styles.refTitle}>
                    <i className="ti ti-school" /> Anthropic公式eラーニング: Introduction to MCP
                  </span>
                  <span className={styles.refUrl}>
                    https://anthropic.skilljar.com/introduction-to-model-context-protocol
                  </span>
                </Ext>
              </li>
            </ul>

            <h3>セキュリティ関連資料</h3>
            <ul>
              <li>
                <Ext href="https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html">
                  <span className={styles.refTitle}>
                    <i className="ti ti-shield-check" /> OWASP: MCP Security Cheat Sheet
                  </span>
                  <span className={styles.refUrl}>
                    https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://owasp.org/www-community/attacks/MCP_Tool_Poisoning">
                  <span className={styles.refTitle}>
                    <i className="ti ti-shield-check" /> OWASP: MCP Tool Poisoning
                  </span>
                  <span className={styles.refUrl}>
                    https://owasp.org/www-community/attacks/MCP_Tool_Poisoning
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://codersera.com/blog/how-to-secure-mcp-servers-2026/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> CodersEra: How to Secure MCP Servers
                  </span>
                  <span className={styles.refUrl}>
                    https://codersera.com/blog/how-to-secure-mcp-servers-2026/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://labs.cloudsecurityalliance.org/agentic/agentic-mcp-security-best-practices-v1/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-shield-check" /> Cloud Security Alliance: Agentic MCP
                    Security Best Practices Guide
                  </span>
                  <span className={styles.refUrl}>
                    https://labs.cloudsecurityalliance.org/agentic/agentic-mcp-security-best-practices-v1/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://www.sentinelone.com/cybersecurity-101/cybersecurity/mcp-security/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> SentinelOne: Model Context Protocol (MCP) Security
                  </span>
                  <span className={styles.refUrl}>
                    https://www.sentinelone.com/cybersecurity-101/cybersecurity/mcp-security/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://www.practical-devsecops.com/mcp-security-best-practices/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> Practical DevSecOps: MCP Security Best Practices
                  </span>
                  <span className={styles.refUrl}>
                    https://www.practical-devsecops.com/mcp-security-best-practices/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://checkmarx.com/learn/mcp-security-risks-real-world-incidents-and-security-controls/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> Checkmarx: MCP Security Risks, Best Practices, and
                    Security Controls
                  </span>
                  <span className={styles.refUrl}>
                    https://checkmarx.com/learn/mcp-security-risks-real-world-incidents-and-security-controls/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://www.descope.com/blog/post/mcp-server-security-best-practices">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> Descope: MCP Server Security Best Practices
                  </span>
                  <span className={styles.refUrl}>
                    https://www.descope.com/blog/post/mcp-server-security-best-practices
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://www.truefoundry.com/blog/mcp-security-risks-best-practices">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> TrueFoundry: MCP Security Risks & Best Practices
                  </span>
                  <span className={styles.refUrl}>
                    https://www.truefoundry.com/blog/mcp-security-risks-best-practices
                  </span>
                </Ext>
              </li>
            </ul>

            <h3>解説記事・技術ブログ</h3>
            <ul>
              <li>
                <Ext href="https://en.wikipedia.org/wiki/Model_Context_Protocol">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> Wikipedia: Model Context Protocol
                  </span>
                  <span className={styles.refUrl}>
                    https://en.wikipedia.org/wiki/Model_Context_Protocol
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://www.webfuse.com/mcp-cheat-sheet">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> Webfuse: MCP Cheat Sheet 2026
                  </span>
                  <span className={styles.refUrl}>https://www.webfuse.com/mcp-cheat-sheet</span>
                </Ext>
              </li>
              <li>
                <Ext href="https://www.sitepoint.com/model-context-protocol-mcp/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> SitePoint: MCP完全ガイド2026
                  </span>
                  <span className={styles.refUrl}>
                    https://www.sitepoint.com/model-context-protocol-mcp/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://blog.logrocket.com/understanding-anthropic-model-context-protocol-mcp/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> LogRocket: Understanding Anthropic's MCP
                  </span>
                  <span className={styles.refUrl}>
                    https://blog.logrocket.com/understanding-anthropic-model-context-protocol-mcp/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://www.aiforanything.io/blog/anthropic-mcp-model-context-protocol-explained-2026">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> AI for Anything: Anthropic MCP Explained (2026)
                  </span>
                  <span className={styles.refUrl}>
                    https://www.aiforanything.io/blog/anthropic-mcp-model-context-protocol-explained-2026
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://medium.com/intuitionmachine/structuring-agents-skills-and-mcps-best-practices-from-anthropic-9312849ccea6">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> Medium: Structuring Agents, Skills, and MCPs
                  </span>
                  <span className={styles.refUrl}>
                    https://medium.com/intuitionmachine/structuring-agents-skills-and-mcps-best-practices-from-anthropic-9312849ccea6
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://obot.ai/resources/learning-center/mcp-anthropic/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> Obot AI Learning Center: Building with MCP
                  </span>
                  <span className={styles.refUrl}>
                    https://obot.ai/resources/learning-center/mcp-anthropic/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/vishnu2kmohan/mcp-server-langgraph/blob/main/adr/adr-0023-anthropic-tool-design-best-practices.md">
                  <span className={styles.refTitle}>
                    <i className="ti ti-brand-github" /> GitHub ADR:
                    Anthropicツール設計ベストプラクティス適用例
                  </span>
                  <span className={styles.refUrl}>
                    https://github.com/vishnu2kmohan/mcp-server-langgraph/blob/main/adr/adr-0023-anthropic-tool-design-best-practices.md
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://codesignal.com/learn/courses/developing-and-integrating-a-mcp-server-in-python/lessons/getting-started-with-fastmcp-running-your-first-mcp-server-with-stdio-and-sse">
                  <span className={styles.refTitle}>
                    <i className="ti ti-school" /> CodeSignal: Getting Started with FastMCP
                  </span>
                  <span className={styles.refUrl}>
                    https://codesignal.com/learn/courses/developing-and-integrating-a-mcp-server-in-python/lessons/getting-started-with-fastmcp-running-your-first-mcp-server-with-stdio-and-sse
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://medium.com/@laurentkubaski/how-to-use-mcp-inspector-2748cd33faeb">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> Medium: How to use MCP Inspector
                  </span>
                  <span className={styles.refUrl}>
                    https://medium.com/@laurentkubaski/how-to-use-mcp-inspector-2748cd33faeb
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://en.bioerrorlog.work/entry/how-to-use-mcp-inspector">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> BioErrorLog: How to Use MCP Inspector
                  </span>
                  <span className={styles.refUrl}>
                    https://en.bioerrorlog.work/entry/how-to-use-mcp-inspector
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://sourcecraft.dev/portal/docs/en/code-assistant/operations/agent/mcp/server-transports">
                  <span className={styles.refTitle}>
                    <i className="ti ti-file-text" /> SourceCraft: MCPサーバートランスポート解説
                  </span>
                  <span className={styles.refUrl}>
                    https://sourcecraft.dev/portal/docs/en/code-assistant/operations/agent/mcp/server-transports
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://docs.roocode.com/features/mcp/server-transports">
                  <span className={styles.refTitle}>
                    <i className="ti ti-file-text" /> Roo Code Documentation: MCP Server Transports
                  </span>
                  <span className={styles.refUrl}>
                    https://docs.roocode.com/features/mcp/server-transports
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://dev.to/zoricic/understanding-mcp-server-transports-stdio-sse-and-http-streamable-5b1p">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> DEV Community: Understanding MCP Server Transports
                  </span>
                  <span className={styles.refUrl}>
                    https://dev.to/zoricic/understanding-mcp-server-transports-stdio-sse-and-http-streamable-5b1p
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://mcpcat.io/guides/comparing-stdio-sse-streamablehttp/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> MCPcat: MCP Transport Protocols
                  </span>
                  <span className={styles.refUrl}>
                    https://mcpcat.io/guides/comparing-stdio-sse-streamablehttp/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://dev.to/jefe_cool/mcp-transports-explained-stdio-vs-streamable-http-and-when-to-use-each-3lco">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> DEV Community: MCP Transports Explained
                  </span>
                  <span className={styles.refUrl}>
                    https://dev.to/jefe_cool/mcp-transports-explained-stdio-vs-streamable-http-and-when-to-use-each-3lco
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://kirkryan.co.uk/stdio-vs-streamable-http-choosing-the-right-mcp-transport/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> Kirk Ryan: stdio vs Streamable HTTP
                  </span>
                  <span className={styles.refUrl}>
                    https://kirkryan.co.uk/stdio-vs-streamable-http-choosing-the-right-mcp-transport/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://codilime.com/blog/model-context-protocol-explained/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> CodiLime: MCP実践的技術解説
                  </span>
                  <span className={styles.refUrl}>
                    https://codilime.com/blog/model-context-protocol-explained/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://glama.ai/blog/2025-07-10-exploring-mcps-hidden-primitives-prompts-resources-sampling-and-roots">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> Glama: Unlocking MCP Primitives
                  </span>
                  <span className={styles.refUrl}>
                    https://glama.ai/blog/2025-07-10-exploring-mcps-hidden-primitives-prompts-resources-sampling-and-roots
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://www.channel.tel/blog/mcp-sampling-elicitation-patterns-builders-skip">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> Chanl Blog: How to Use MCP Sampling, Roots, and
                    Elicitation
                  </span>
                  <span className={styles.refUrl}>
                    https://www.channel.tel/blog/mcp-sampling-elicitation-patterns-builders-skip
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://workos.com/blog/mcp-features-guide">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> WorkOS: Understanding MCP features
                  </span>
                  <span className={styles.refUrl}>https://workos.com/blog/mcp-features-guide</span>
                </Ext>
              </li>
              <li>
                <Ext href="https://medium.com/@puneetsharma41/mcp-client-concepts-how-elicitation-sampling-and-roots-make-ai-agents-responsible-5f02a0666d9a">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> Medium: MCP Client Concepts
                  </span>
                  <span className={styles.refUrl}>
                    https://medium.com/@puneetsharma41/mcp-client-concepts-how-elicitation-sampling-and-roots-make-ai-agents-responsible-5f02a0666d9a
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://www.analytical-software.de/en/the-model-context-protocol-mcp-deep-dive-into-structure-and-concepts/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-notes" /> HMS: MCPの構造と概念の深掘り
                  </span>
                  <span className={styles.refUrl}>
                    https://www.analytical-software.de/en/the-model-context-protocol-mcp-deep-dive-into-structure-and-concepts/
                  </span>
                </Ext>
              </li>
              <li>
                <Ext href="https://frontendmasters.com/courses/mcp/roots-sampling-elicitation/">
                  <span className={styles.refTitle}>
                    <i className="ti ti-school" /> Frontend Masters: Roots, Sampling, & Elicitation
                  </span>
                  <span className={styles.refUrl}>
                    https://frontendmasters.com/courses/mcp/roots-sampling-elicitation/
                  </span>
                </Ext>
              </li>
            </ul>
          </section>
        </main>
      </div>

      <p className={styles.pageFooter}>
        本ガイドはMitsuru向けに作成された学習・実装用の技術資料です。MCP仕様は現在も活発に改定が進んでいるため、実装前には必ず
        modelcontextprotocol.io の最新版ドキュメントを確認してください。
      </p>
    </div>
  );
}
