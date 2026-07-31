import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import { TocObserver } from "./TocObserver";

export const metadata: Metadata = {
  title: "Microsoft Foundry 活用ガイド — 初学者のためのステップバイステップ・ベストプラクティス",
  description:
    "Microsoft Foundry（旧Azure AI Studio/Azure AI Foundry）を用いたAIアプリ・エージェント開発のステップバイステップ・ベストプラクティスガイド。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_01 = `flowchart TB
    subgraph Models["モデルレイヤー"]
        M1["Foundry Models<br/>1900以上のモデルカタログ"]
        M2["OpenAI / Anthropic / Meta / Google / xAI 等"]
        M3["Model Router<br/>コスト最適ルーティング"]
    end

    subgraph Agents["エージェント & フレームワーク層"]
        A1["Foundry Agent Service"]
        A2["Microsoft Agent Framework"]
        A3["LangChain / LangGraph 等 OSS連携"]
    end

    subgraph Knowledge["ナレッジ & ツール層"]
        K1["Foundry IQ"]
        K2["Azure AI Search"]
        K3["MCPツール（1400以上のコネクタ）"]
    end

    subgraph Trust["オブザーバビリティ & 信頼層"]
        T1["Foundry Control Plane"]
        T2["トレーシング & 評価"]
        T3["Content Safety / Guardrails"]
    end

    subgraph Edge["ローカル & エッジ層"]
        E1["Foundry Local"]
    end

    Models --> Agents
    Knowledge --> Agents
    Agents --> Trust
    Edge -. オフライン開発 .-> Agents`;

const DIAGRAM_02 = `flowchart TB
    subgraph Runtime["Foundry Agent Service"]
        Agent["エージェント本体"]
        Memory["メモリ<br/>Procedural / User / Session"]
        Orchestrator["マルチエージェント<br/>オーケストレーション"]
    end

    Agent --> Memory
    Agent --> Orchestrator

    subgraph ToolLayer["ツール層"]
        MCP["MCPサーバー"]
        Func["Azure Functions"]
        SearchTool["Azure AI Search"]
        Logic["Logic Apps（1400以上のコネクタ）"]
    end

    Agent --> ToolLayer

    subgraph IdentitySec["ID & セキュリティ"]
        EntraID["Microsoft Entra Agent ID"]
        RbacCtrl["RBAC（最小権限）"]
    end

    Agent --> IdentitySec`;

const DIAGRAM_03 = `flowchart TB
    D1["ドキュメント取り込み"] --> D2["検索設定<br/>Vector / Semantic / Hybrid"]
    D2 --> D3["Groundedness評価"]
    D2 --> D4["Relevance評価"]
    D3 --> D5{"品質基準を満たすか"}
    D4 --> D5
    D5 -->|No| D2
    D5 -->|Yes| D6["本番投入"]
    D6 --> D7["継続モニタリング"]
    D7 -. フィードバック .-> D2`;

const DIAGRAM_04 = `flowchart TB
    L1["ID層<br/>Microsoft Entra Agent ID"] --> L2["アクセス制御層<br/>RBAC（最小権限）"]
    L2 --> L3["ネットワーク層<br/>Private Link / BYO VNet"]
    L3 --> L4["データガバナンス層<br/>Microsoft Purview"]
    L4 --> L5["コンテンツ安全層<br/>Content Safety / Guardrails"]
    L5 --> L6["監視層<br/>Microsoft Defender for Cloud"]`;

const DIAGRAM_05 = `flowchart TD
    Q1{"誰が主に運用するか"} -->|業務ユーザー中心| CS["Copilot Studio<br/>ローコード・ガバナンス内蔵"]
    Q1 -->|開発者中心| Q2{"コードを書くか"}
    Q2 -->|コードなし・宣言的| PA["Prompt Agent<br/>Foundry Agent Service"]
    Q2 -->|コードを書く| Q3{"主な実行場所"}
    Q3 -->|クラウドで常時運用| HA["Hosted Agent<br/>Foundry Agent Service"]
    Q3 -->|オフライン・オンデバイス| FL["Foundry Local"]`;

export default function MicrosoftFoundryBestPracticesPage() {
  return (
    <div className={styles.layout}>
      <TocObserver
        activeClass={styles.active}
        navSelector="#side-nav a"
        sectionSelector="main section[id]"
      />

      <aside className={styles.sidebar}>
        <div className={styles.brand}>Microsoft Foundry</div>
        <div className={styles.sidebarTitle}>活用ガイド — 初学者のためのベストプラクティス</div>
        <nav id="side-nav">
          <ul>
            <li>
              <a href="#s01">01. Foundryとは何か</a>
            </li>
            <li>
              <a href="#s02">02. 全体アーキテクチャ</a>
            </li>
            <li>
              <a href="#s03">03. Step1: アカウント準備</a>
            </li>
            <li>
              <a href="#s04">04. Step2: モデル選定</a>
            </li>
            <li>
              <a href="#s05">05. Step3: 初めてのAPI呼び出し</a>
            </li>
            <li>
              <a href="#s06">06. Step4: エージェント構築</a>
            </li>
            <li>
              <a href="#s07">07. Step5: ツール/ナレッジ連携</a>
            </li>
            <li>
              <a href="#s08">08. Step6: 評価/オブザーバビリティ</a>
            </li>
            <li>
              <a href="#s09">09. Step7: セキュリティ/ガバナンス</a>
            </li>
            <li>
              <a href="#s10">10. Step8: コスト最適化</a>
            </li>
            <li>
              <a href="#s11">11. Step9: 責任あるAI</a>
            </li>
            <li>
              <a href="#s12">12. Step10: 本番デプロイ</a>
            </li>
            <li>
              <a href="#s13">13. チェックリスト</a>
            </li>
            <li>
              <a href="#s14">14. 著名開発者の知見</a>
            </li>
            <li>
              <a href="#s15">15. 参考ソース一覧</a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.hero}>
          <div className={styles.eyebrow}>Beginner's Guide / Best Practices</div>
          <h1>
            Microsoft Foundry 活用ガイド
            <br />
            初学者のためのステップバイステップ・ベストプラクティス
          </h1>
          <p>
            最終更新:
            2026年7月18日時点の公開情報（Microsoft公式ドキュメント・公式ブログ・著名開発者の技術記事）をもとに作成。Foundryは頻繁にアップデートされるプラットフォームのため、実装時は必ず{" "}
            <Ext href="https://learn.microsoft.com/en-us/azure/foundry/">Microsoft Learn</Ext>{" "}
            の最新情報をご確認ください。
          </p>
        </header>

        <section className={styles.section} id="s01">
          <h2>
            <span className={styles.num}>01</span>Microsoft Foundryとは何か
          </h2>
          <div className={styles.prose}>
            <p>
              Microsoft Foundryは、旧称「Azure AI Studio」「Azure AI
              Foundry」を統合・刷新した、エンタープライズ向けのAIアプリ／エージェント開発プラットフォームです。モデルの選定からエージェントの構築、ナレッジ連携、監視、セキュリティ統制までを、単一の管理基盤（リソースプロバイダー名前空間）の上で一貫して扱えるようにすることを目的としています。
            </p>
            <p>
              Microsoft公式ドキュメントによれば、Foundryはエンタープライズ規模のAI運用・モデル開発・アプリケーション開発を対象としたAzureのプラットフォームサービスであり、トレーシング・モニタリング・評価・エンタープライズ向けの構成機能を備え、統一されたRBAC・ネットワーク・ポリシー管理を1つのAzureリソースプロバイダーの下で提供します。
            </p>
            <p>初学者がまず押さえておくべき用語の変化は以下の通りです（旧概念 → 現行概念）。</p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>旧称・旧概念</th>
                    <th>現行の名称・概念</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ブランド名</td>
                    <td>Azure AI Studio / Azure AI Foundry</td>
                    <td>Microsoft Foundry</td>
                  </tr>
                  <tr>
                    <td>サービス名</td>
                    <td>Azure AI Services</td>
                    <td>Foundry Tools</td>
                  </tr>
                  <tr>
                    <td>ポータル</td>
                    <td>Foundry (classic)</td>
                    <td>Foundry（新ポータル）</td>
                  </tr>
                  <tr>
                    <td>エージェントAPI</td>
                    <td>Assistants API (Agents v0.5/v1)</td>
                    <td>Responses API (Agents v2)</td>
                  </tr>
                  <tr>
                    <td>リソースモデル</td>
                    <td>Hub + Azure OpenAI + Azure AI Services（複数リソース）</td>
                    <td>Foundryリソース（単一、プロジェクト内包）</td>
                  </tr>
                  <tr>
                    <td>SDK</td>
                    <td>
                      複数パッケージに分散（<code>azure-ai-inference</code> 等）
                    </td>
                    <td>
                      統一プロジェクトクライアント（<code>azure-ai-projects</code>）+{" "}
                      <code>OpenAI()</code>
                    </td>
                  </tr>
                  <tr>
                    <td>用語</td>
                    <td>Threads, Messages, Runs, Assistants</td>
                    <td>Conversations, Items, Responses, Agent Versions</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              初学者への実務的な示唆として、これから新規に学習・実装する場合は「Foundry（新ポータル）」と「Responses
              API」を前提に学ぶのが最も効率的です。Azure
              OpenAIから移行する場合も、エンドポイントやAPIキー、既存の状態を保ったままFoundryリソースへアップグレードできる経路が用意されています。
            </p>
          </div>
        </section>

        <section className={styles.section} id="s02">
          <h2>
            <span className={styles.num}>02</span>全体アーキテクチャを理解する
          </h2>
          <div className={styles.prose}>
            <p>
              Foundryは大きく5つのレイヤーで構成されています。各レイヤーの役割を最初に俯瞰しておくと、以降のステップの位置づけが理解しやすくなります。
            </p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_01} id="diagram-01" />
            </div>
            <p>この図の要点は次の3つです。</p>
            <ul>
              <li>
                <strong>モデルは交換可能な部品として扱う</strong>:
                Foundryはモデル非依存（model-agnostic）を志向しており、OpenAI、Anthropic（Claude）、Meta、xAI、DeepSeek、Hugging
                Face、Microsoft自社のPhi/MAIなど、幅広いモデルを単一のプロジェクトエンドポイントから呼び出せます。
              </li>
              <li>
                <strong>エージェントはモデル・ツール・メモリの合成物である</strong>: Foundry Agent
                ServiceとMicrosoft Agent
                Frameworkが、モデル呼び出し・ツール実行・記憶（メモリ）・マルチエージェント連携を束ねます。
              </li>
              <li>
                <strong>信頼レイヤーは後付けではなく前提</strong>:
                トレーシング、評価、コンテンツセーフティは開発の初期段階から組み込むべき機能として設計されています。
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.section} id="s03">
          <h2>
            <span className={styles.num}>03</span>Step 1: Azureアカウントとプロジェクトの準備
          </h2>
          <div className={styles.prose}>
            <h3>1-1. 前提条件</h3>
            <ul>
              <li>有効なAzureサブスクリプション（無料トライアルでも開始可能）</li>
              <li>
                Foundryリソースを作成できるロール（Foundry Account Owner / Foundry Owner
                など、サブスクリプションまたはリソースグループスコープ）
              </li>
            </ul>
            <h3>1-2. 手順（ポータルの場合）</h3>
            <ol>
              <li>
                <Ext href="https://ai.azure.com">Foundryポータル</Ext>にサインインする
              </li>
              <li>
                画面右上の「New
                Foundry」トグルがオンになっていることを確認する（新ポータル前提で本ガイドは解説します）
              </li>
              <li>左上のプロジェクト名部分から「Create new project」を選択する</li>
              <li>
                プロジェクト名を入力し、リソースグループとリージョンを選択する（初学者は新規リソースグループを作成し、プロジェクトと関連リソースをまとめて管理するのが推奨されています）
              </li>
              <li>「Create」を選択し、プロジェクトが作成されるのを待つ</li>
            </ol>
            <h3>1-3. 手順（Azure CLIの場合）</h3>
            <p>
              CLIでの再現性のある構築を重視するチームは、以下のような流れでリソースグループとFoundryリソースを作成できます。
            </p>
            <div className={styles.codeBlock}>
              <div className={styles.codeBar}>bash</div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.cm}>az</span> login
                </div>
                <div className={styles.codeLine}></div>
                <div className={styles.codeLine}>
                  <span className={styles.cm}>az</span> group create{" "}
                  <span className={styles.ck}>--name</span> my-foundry-rg{" "}
                  <span className={styles.ck}>--location</span> eastus
                </div>
                <div className={styles.codeLine}></div>
                <div className={styles.codeLine}>
                  <span className={styles.cm}>az</span> cognitiveservices account create \
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span className={styles.ck}>--name</span> my-foundry-resource \
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span className={styles.ck}>--resource-group</span> my-foundry-rg \
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span className={styles.ck}>--kind</span> AIServices \
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span className={styles.ck}>--sku</span> S0 \
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span className={styles.ck}>--location</span> eastus \
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span className={styles.ck}>--custom-domain</span> my-foundry-resource \
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span className={styles.ck}>--allow-project-management</span> true
                </div>
              </div>
            </div>
            <h3>ベストプラクティス</h3>
            <ul>
              <li>
                <strong>初学者はまず専用のリソースグループを1つ作る</strong>:
                プロジェクトと関連リソース（ストレージ、検索、Key
                Vaultなど）をひとまとめに管理でき、後片付けも容易になります。
              </li>
              <li>
                <strong>チームメンバーの追加はEntraセキュリティグループ単位で行う</strong>:
                個別メールアドレスでの追加は管理コストが高くなるため、複数人を一括登録する場合はMicrosoft
                Entraのセキュリティグループを使うことが推奨されています。
              </li>
              <li>
                <strong>サンドボックスと本番は最初から分離する</strong>:
                実験用プロジェクトと本番用プロジェクトを分けておくことで、後述するRBACやネットワーク分離の設計がシンプルになります。
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.section} id="s04">
          <h2>
            <span className={styles.num}>04</span>Step 2: モデルを選定してデプロイする
          </h2>
          <div className={styles.prose}>
            <p>
              Foundryのモデルカタログには1,900以上のモデルが用意されており、GPT-5系列、Claude、Grok、Mistral、DeepSeek-R1、Phi-4、Meta
              Llamaなど多様な選択肢があります。初学者はまず用途別の「当たり」を知っておくと選定が早くなります。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>モデルファミリー</th>
                    <th>得意とする用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>GPT-5</td>
                    <td>複雑な推論・多段階タスク・マルチモーダル処理</td>
                  </tr>
                  <tr>
                    <td>GPT-4.1</td>
                    <td>本番ワークロード向けの性能とコストのバランス</td>
                  </tr>
                  <tr>
                    <td>GPT-4.1 mini</td>
                    <td>低遅延・高スループットが必要な場面</td>
                  </tr>
                  <tr>
                    <td>Claude</td>
                    <td>高度な推論、コード生成、マルチモーダルタスク</td>
                  </tr>
                  <tr>
                    <td>Grok</td>
                    <td>推論、コーディング、データ抽出</td>
                  </tr>
                  <tr>
                    <td>Mistral</td>
                    <td>コード生成、多言語対応、汎用チャット</td>
                  </tr>
                  <tr>
                    <td>DeepSeek-R1</td>
                    <td>オープンウェイトでの大規模推論</td>
                  </tr>
                  <tr>
                    <td>Phi-4</td>
                    <td>オンデバイス・省リソース環境向け小型モデル</td>
                  </tr>
                  <tr>
                    <td>Meta Llama</td>
                    <td>カスタマイズ・ファインチューニング前提のオープンモデル</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3>ベストプラクティス（モデル選定）</h3>
            <ol>
              <li>
                <strong>モデルカタログを開く前に成功基準を定義する</strong>: Microsoft
                Foundry開発者向けガイドでは、モデルの知名度に引きずられず、ワークロードの要件（精度・レイテンシ・コスト）を先に定義してから評価すべきだと述べられています。
              </li>
              <li>
                <strong>タスクごとにモデルを使い分ける</strong>:
                単純な分類タスク、RAG応答、長文脈の推論、多段階のエージェント処理は、それぞれ異なるモデル・デプロイ戦略を採用すべきとされています。すべてを最上位モデルで処理するのはプロトタイプ段階では許容できても、本番では破綻しやすいコスト構造になります。
              </li>
              <li>
                <strong>Model Router（インテリジェントルーティング）を活用する</strong>:
                タスクの複雑さと予算に応じて、リアルタイムに最適なモデルへ自動的に振り分ける機能が提供されています。アプリの書き換えなしに性能とコストの最適化が可能です。
              </li>
              <li>
                <strong>迷ったらモデル比較ガイドを参照する</strong>: Microsoft
                Learnにはモデル比較のための専用ガイドが用意されています。
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.section} id="s05">
          <h2>
            <span className={styles.num}>05</span>Step 3: 初めてのAPI呼び出し
          </h2>
          <div className={styles.prose}>
            <p>
              プロジェクトとモデルデプロイが完了したら、まずは最小構成でAPIを呼び出して疎通確認を行います。以下はPythonでの例です。
            </p>
            <div className={styles.codeBlock}>
              <div className={styles.codeBar}>python</div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>from</span> azure.identity{" "}
                  <span className={styles.ck}>import</span> DefaultAzureCredential
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>from</span> azure.ai.projects{" "}
                  <span className={styles.ck}>import</span> AIProjectClient
                </div>
                <div className={styles.codeLine}></div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    # 形式: &quot;https://resource_name.ai.azure.com/api/projects/project_name&quot;
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>PROJECT_ENDPOINT</span> ={" "}
                  <span className={styles.cs}>&quot;your_project_endpoint&quot;</span>
                </div>
                <div className={styles.codeLine}></div>
                <div className={styles.codeLine}>
                  project = <span className={styles.fn}>AIProjectClient</span>(
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  endpoint=<span className={styles.cv}>PROJECT_ENDPOINT</span>,
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  credential=<span className={styles.fn}>DefaultAzureCredential</span>(),
                </div>
                <div className={styles.codeLine}>)</div>
                <div className={styles.codeLine}>
                  openai = project.<span className={styles.fn}>get_openai_client</span>()
                </div>
                <div className={styles.codeLine}></div>
                <div className={styles.codeLine}>
                  response = openai.responses.<span className={styles.fn}>create</span>(
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  model=<span className={styles.cs}>&quot;gpt-5-mini&quot;</span>,
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  input=
                  <span className={styles.cs}>&quot;日本の人口はおよそ何人ですか？&quot;</span>,
                </div>
                <div className={styles.codeLine}>)</div>
                <div className={styles.codeLine}>
                  <span className={styles.fn}>print</span>(response.output_text)
                </div>
              </div>
            </div>
            <h3>ベストプラクティス</h3>
            <ul>
              <li>
                <strong>
                  認証はAPIキーではなく<code>DefaultAzureCredential</code>（マネージドID）を優先する
                </strong>
                :
                キーの管理・ローテーションの負担をなくし、シークレット漏えいのリスクを下げられます。
              </li>
              <li>
                <strong>Responses APIを起点に学ぶ</strong>: 旧Assistants
                APIからの移行者は用語（Threads→Conversations、Runs→Responsesなど）の対応関係を意識すると混乱が少なくなります。
              </li>
              <li>
                <strong>環境変数でエンドポイントを管理する</strong>: <code>PROJECT_ENDPOINT</code>
                のような値はコードに直書きせず、環境変数や設定ストアから読み込むようにします。
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.section} id="s06">
          <h2>
            <span className={styles.num}>06</span>Step 4: エージェントを構築する
          </h2>
          <div className={styles.prose}>
            <p>
              Foundry Agent
              Serviceは、モデル・ツール・メモリ・マルチエージェント連携を統合的に扱う管理型ランタイムです。エージェントの実装スタイルは大きく2種類あります。
            </p>
            <ul>
              <li>
                <strong>Prompt Agent（宣言的エージェント）</strong>:
                FoundryポータルまたはSDK/RESTでプロンプトとツール構成を定義するだけで、実行基盤の管理が不要なタイプ。
              </li>
              <li>
                <strong>Hosted Agent（ホスト型エージェント）</strong>: Microsoft Agent
                Framework、LangGraph、OpenAI Agents SDK、Anthropic Agent SDK、GitHub Copilot
                SDKなど任意のフレームワークで書いたコードをコンテナ化し、Foundryが管理するランタイム上で実行するタイプ。セッションごとにハイパーバイザーレベルで分離されたサンドボックスが割り当てられます。
              </li>
            </ul>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_02} id="diagram-02" />
            </div>
            <h3>ベストプラクティス</h3>
            <ol>
              <li>
                <strong>
                  まずPrompt Agentで要件を検証し、必要になったらHosted Agentへ移行する
                </strong>
                : コードを書かずに始められるPrompt
                Agentで業務要件を素早く検証し、カスタムロジックや独自フレームワークが必要になった段階でHosted
                Agentへ移行する、という段階的なアプローチが推奨されています。
              </li>
              <li>
                <strong>メモリ機能は種類を理解してから有効化する</strong>:
                Foundryのメモリには、実行を跨いでやり方を学習する「Procedural
                memory」、ユーザーの好みや事実を記憶する「User
                memory」、会話内の文脈を保持する「Session
                memory」の3種類があります。テストエージェントでメモリを有効化し、タスク成功率・ツール呼び出し回数・トークン消費量を比較検証することが推奨されています。
              </li>
              <li>
                <strong>フレームワーク非依存の設計を維持する</strong>: Microsoft Agent
                Framework、LangGraph、OpenAI Agents SDK、GitHub Copilot
                SDKなど複数のSDKに対応しているため、特定フレームワークへのロックインを避けた設計にしておくと将来の変更コストを抑えられます。
              </li>
              <li>
                <strong>コンテナ化されたエージェントはセッションごとの分離を前提に設計する</strong>:
                Hosted
                Agentは各セッションが独立したVM分離サンドボックスを持ち、ファイルシステムの状態もスケールゼロ後に復元されます。ステートフルな処理を前提にした設計が可能です。
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.section} id="s07">
          <h2>
            <span className={styles.num}>07</span>Step 5: ツールとナレッジを連携する（RAG / Foundry
            IQ）
          </h2>
          <div className={styles.prose}>
            <p>
              エージェントに社内データや外部知識を根拠づけさせる（グラウンディングする）ことは、幻覚（ハルシネーション）を抑える上で最重要のステップです。Foundryでは、Foundry
              IQ（旧Azure AI Search発展形）を中心に、Agentic Retrieval
              APIによる高度な検索が提供されています。
            </p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_03} id="diagram-03" />
            </div>
            <h3>ベストプラクティス</h3>
            <ol>
              <li>
                <strong>複数の検索アルゴリズムを比較評価してから決める</strong>:
                テキスト検索、ベクトル検索、セマンティック検索、セマンティックハイブリッド検索など複数パターンを評価し、Groundedness（根拠性）・Relevance（関連性）評価指標で比較してから採用するパラメータを決定することがMicrosoftのRAG最適化ガイドで推奨されています。
              </li>
              <li>
                <strong>複雑な問い合わせにはAgentic Retrievalを使う</strong>:
                会話履歴を踏まえて複合的な質問をサブクエリに分解し、並列実行してから再ランキング・統合する「Agentic
                Retrieval
                API」は、複雑なクエリに対して従来手法よりも高い関連性を示す結果が報告されています。
              </li>
              <li>
                <strong>ツール呼び出しの決定則を明文化する</strong>:
                複数のツールが役割的に重複する場合（例: File SearchとWeb
                Search）、「社内コンテンツにはFile Searchを優先し、それで見つからない場合のみWeb
                Searchを使う」といった判断基準をエージェントの指示文に明記することが公式ドキュメントのツールベストプラクティスとして案内されています。
              </li>
              <li>
                <strong>ツールの出力は信頼しない（untrusted inputとして扱う）</strong>:
                ツールから返る値は検証してから利用し、重要な値をそのままアクションに使わないこと。認証情報をプロンプトに含めず、トレースやログにも機密情報を残さないことが推奨されています。
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.section} id="s08">
          <h2>
            <span className={styles.num}>08</span>Step 6: 評価とオブザーバビリティを整備する
          </h2>
          <div className={styles.prose}>
            <p>
              Foundryは、評価（Evaluators）、本番モニタリング、トレーシングの3本柱でAIアプリケーションのライフサイクル全体を可視化します。OpenTelemetryベースのトレーシングにより、エージェントの本番挙動をエンドツーエンドで記録できます。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>評価カテゴリ</th>
                    <th>代表的な評価指標</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>汎用品質</td>
                    <td>Coherence（一貫性）、Fluency（流暢さ）、Relevance（関連性）</td>
                  </tr>
                  <tr>
                    <td>RAG特化</td>
                    <td>Groundedness（根拠性）、Retrieval品質（XDCGなど）</td>
                  </tr>
                  <tr>
                    <td>安全性・セキュリティ</td>
                    <td>Hate/Unfairness、Violence、Protected Material、Self-harm</td>
                  </tr>
                  <tr>
                    <td>エージェント特化</td>
                    <td>
                      Tool Call Accuracy（ツール呼び出し精度）、Task Completion（タスク完了率）
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3>ベストプラクティス</h3>
            <ol>
              <li>
                <strong>評価はチェックリストではなく継続的なシグナルとして扱う</strong>:
                評価と継続モニタリングをAzure
                Monitorに接続し、品質を「出荷前の一度きりのチェック」ではなく「本番の生きたシグナル」として扱うことが2026年のアップデートで強調されています。
              </li>
              <li>
                <strong>すべての観測データを一箇所に集約する</strong>:
                評価結果、トレース、レイテンシ、トークン使用量、品質指標をAzure
                Monitorに集約することで、他のAzureスタックとの横断的な相関分析が可能になります。
              </li>
              <li>
                <strong>Ask AIによるコスト・パフォーマンスの要約を活用する</strong>: Foundry Control
                Plane上のAI搭載アシスタントに「特定エージェントのコストとパフォーマンス詳細を見せて」「モデル・デプロイ別のコスト内訳を出して」のように尋ねることで、コストスパイクの原因（トークン使用量の増加、応答長の増大、評価実行の頻度など）を素早く特定できます。
              </li>
              <li>
                <strong>
                  Prompt Optimizer（プレビュー）で評価結果からプロンプトを自動改善する
                </strong>
                :
                評価結果に基づいてエージェントのプロンプトを自動的に改善する機能がプレビュー提供されています。
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.section} id="s09">
          <h2>
            <span className={styles.num}>09</span>Step 7: セキュリティとガバナンスを設計する
          </h2>
          <div className={styles.prose}>
            <p>
              エージェントは「単なるプロンプト」ではなく、実世界のシステムに接続された権限を持つ主体として扱う必要があります。Foundryのセキュリティは、ID・アクセス制御・ネットワーク・データガバナンス・コンテンツ安全性という層構造で提供されています。
            </p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_04} id="diagram-04" />
            </div>
            <h3>ベストプラクティス</h3>
            <ol>
              <li>
                <strong>エージェントごとに独立したIDを割り当てる</strong>: 各エージェントにMicrosoft
                Entra
                IDに紐づく専用のマネージドIDを持たせ、モデル・ツール・データへのアクセスをAzure
                RBACで統制することで、共有APIキーや過剰権限エージェントを排除できます。例えば、RAGエージェントにはAzure
                AI SearchとBlob
                Storageへの読み取り専用権限のみを与え、アクション型エージェントにはCRM
                APIへのスコープ付き書き込み権限のみを与える、といった分離が実務例として紹介されています。
              </li>
              <li>
                <strong>RBACのスコープをハブ単位ではなくプロジェクト単位で絞る</strong>:
                ハブスコープでの<code>Azure AI Developer</code>
                ロール付与は、そのハブ配下の全プロジェクト（他チームのプロジェクトを含む）への読み取りアクセスを許してしまう可能性があるため、プロジェクトリソースへスコープを絞ることが推奨されています。
              </li>
              <li>
                <strong>本番環境ではプライベートエンドポイントを既定にする</strong>:
                パブリックネットワークアクセスを無効化し、Private Link / BYO
                VNetを用いてネットワーク境界を明確にすることが、機微なワークロードに対する推奨構成です。Azure
                AI Search・Azure Storage・Azure Cosmos
                DBへのプライベートエンドポイントは自動作成されないため、明示的な設定が必要です。
              </li>
              <li>
                <strong>APIキーではなくマネージドIDを使い、キーはKey Vaultで管理する</strong>:
                キーを使わざるを得ない場合も、Azure Key
                Vaultに保管し、ソースコードやログ、クライアントアプリに直接埋め込まないようにします。
              </li>
              <li>
                <strong>MCPサーバー経由の操作には追加の注意が必要</strong>: プレビュー段階のFoundry
                MCP
                Serverはネットワーク分離に対応しておらず、パブリックエンドポイントを介して接続されるため、リージョンをまたいだデータ処理の可能性や、Conditional
                Accessポリシーでのアクセス制御適用状況を事前に確認する必要があります。
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.section} id="s10">
          <h2>
            <span className={styles.num}>10</span>Step 8: コストを最適化する
          </h2>
          <div className={styles.prose}>
            <p>
              Microsoft
              Foundry開発者ガイドでは、コストを「後から気にするもの」ではなく「最初から設計に組み込むアーキテクチャ上の関心事」として扱うべきだと明言されています。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>コスト最適化のレバー</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>インテリジェントルーティング</td>
                    <td>タスクの複雑さと予算に応じて最適なモデルへ振り分ける</td>
                  </tr>
                  <tr>
                    <td>バッチ処理</td>
                    <td>リアルタイム応答が不要なワークロードは非同期処理にまとめる</td>
                  </tr>
                  <tr>
                    <td>キャッシュ</td>
                    <td>同一・類似リクエストへの重複課金を避ける</td>
                  </tr>
                  <tr>
                    <td>プロビジョンドスループット（PTU）</td>
                    <td>予測可能な性能を専用キャパシティで確保する</td>
                  </tr>
                  <tr>
                    <td>クォータ管理</td>
                    <td>
                      クォータのティア分け、グローバル/データゾーンのクォータで予測可能にスケールする
                    </td>
                  </tr>
                  <tr>
                    <td>モデル最適化</td>
                    <td>圧縮・ファインチューニング・蒸留を適材適所で使う</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3>ベストプラクティス</h3>
            <ol>
              <li>
                <strong>タスク種別ごとにコストをプロファイリングしてから最適化する</strong>:
                ルーティングの意思決定はワークロード固有であり、画一的な最適化は成立しません。まずタスクごとのコスト構造を可視化してから手を打つべきとされています。
              </li>
              <li>
                <strong>本番運用では「デプロイ＝運用完了」ではないと理解する</strong>:
                エンドポイントのデプロイ後も、システムの挙動理解、ポリシー適用、使用量とコストの監視、モデル変更の安全なテスト、品質劣化時のロールバックといった運用能力が必要です。
              </li>
              <li>
                <strong>コストデータのエクスポートを定期化する</strong>:
                コストデータをストレージアカウントへ日次・週次・月次でエクスポートし、財務チームがExcelやPower
                BIで分析できるようにしておくことが推奨されています。
              </li>
              <li>
                <strong>軽量ワークロードには小型モデル・低コンピュートティアを使う</strong>:
                実験段階では小型モデルや低ティアのコンピュートを使い、本番スケール前にコストとパフォーマンスのトレードオフを検証するパイプラインを構築します。中断可能なジョブにはSpot
                VMの活用でコストを大幅に下げられる場合があります。
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.section} id="s11">
          <h2>
            <span className={styles.num}>11</span>Step 9: 責任あるAI（Responsible AI）とガードレール
          </h2>
          <div className={styles.prose}>
            <p>
              FoundryはMicrosoftのResponsible
              AI原則に沿って、Discover（発見）・Protect（保護）・Govern（統制）の3段階でガードレールを提供しています。
            </p>
            <ul>
              <li>
                <strong>Discover</strong>:
                敵対的プロンプトによるテストなど、デプロイ前後でエージェントの品質・安全性・セキュリティリスクを発見する。
              </li>
              <li>
                <strong>Protect</strong>:
                モデル出力レベルとエージェント実行時レベルの両方で、セキュリティリスク・望ましくない出力・安全でない行動から保護する。コンテンツフィルターとGuardrailsで有害な出力をユーザーに届く前にブロックする。
              </li>
              <li>
                <strong>Govern</strong>:
                トレーシング・モニタリングツールとコンプライアンス統合を通じてエージェントを統制し、本番環境での継続的モニタリングで異常な振る舞いを検知する。
              </li>
            </ul>
            <h3>ベストプラクティス</h3>
            <ol>
              <li>
                <strong>既定の安全設定を理解した上でチューニングする</strong>: Azure OpenAI in
                Foundry
                Modelsには、Whisperなどの音声モデルを除くすべてのモデルに既定の安全ポリシー（コンテンツフィルタリング、ブロックリスト、プロンプト変換など）が適用されています。まずは既定（中程度のしきい値など）から始め、ブロック率を観察しながら調整していくアプローチが実務者から提案されています。
              </li>
              <li>
                <strong>Prompt Shieldsで直接・間接のプロンプトインジェクションに備える</strong>:
                直接的な指示上書きだけでなく、外部ドキュメントや検索結果に埋め込まれた間接的な攻撃も検知・軽減する仕組みが提供されています。
              </li>
              <li>
                <strong>Groundedness Detectionでハルシネーションを検出する</strong>:
                モデル出力が実際に検索結果などの根拠に基づいているかを検証する機能を、RAGアプリケーションでは特に有効化すべきです。
              </li>
              <li>
                <strong>Red-teamingを自動化し、初期段階からシフトレフトする</strong>:
                既知のリスクを大規模に検出する自動スキャンや敵対的プロービングを導入し、事後対応ではなく開発の早い段階での安全性テストへ移行することが推奨されています。
              </li>
              <li>
                <strong>カスタムコンテンツフィルターと組み合わせる</strong>:
                業界固有の禁止コンテンツについては、独自の例を与えてカスタムカテゴリーを学習させることができます。
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.section} id="s12">
          <h2>
            <span className={styles.num}>12</span>Step 10: ローカル開発から本番デプロイへ
          </h2>
          <div className={styles.prose}>
            <p>
              Microsoftの各種フィールドガイドは、エージェントの実行環境を「誰が運用するか」「コードを書くか」「どこで実行するか」という軸で整理することを提案しています。
            </p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_05} id="diagram-05" />
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>選択肢</th>
                    <th>向いているケース</th>
                    <th>特徴</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Copilot Studio</td>
                    <td>業務ユーザーがライフサイクルを所有し、速度重視で試作したい場合</td>
                    <td>ローコード・オーケストレーション、ガバナンス内蔵</td>
                  </tr>
                  <tr>
                    <td>Prompt Agent</td>
                    <td>カスタムランタイムコードなしでエージェントを素早く立ち上げたい場合</td>
                    <td>スキーマ駆動、インフラ管理不要</td>
                  </tr>
                  <tr>
                    <td>Hosted Agent</td>
                    <td>独自フレームワークのコードをクラウドで常時運用したい場合</td>
                    <td>
                      セッションごとにハイパーバイザー分離、スケールゼロ課金、専用Entraエージェント識別情報
                    </td>
                  </tr>
                  <tr>
                    <td>Foundry Local</td>
                    <td>オフライン・プライバシー重視・エッジデバイスでの推論が必要な場合</td>
                    <td>Azureサブスクリプション不要、デバイス上で完結</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3>ベストプラクティス</h3>
            <ol>
              <li>
                <strong>ローカルで動かしたコードをそのまま本番に持ち込む</strong>: Hosted
                Agentsは、ローカルで実行していたエージェント・ワークフローのコードをそのままコンテナ化して本番に持ち込める設計になっており、書き換えの必要が最小限に抑えられます。
              </li>
              <li>
                <strong>
                  Foundry Localは「プライバシー・オフライン要件」がある場合の選択肢として検討する
                </strong>
                :
                クラウド依存なしにデバイス上でモデルをダウンロードし推論できるため、機密性の高いローカル処理やネットワーク制約のある環境に向いています。ただし2026年時点でFoundry
                LocalからIChatClientへの公式ブリッジは提供されておらず、コミュニティ製アダプターの利用や自作が必要になる場合があります。
              </li>
              <li>
                <strong>スケールゼロ特性を前提にステート設計をする</strong>: Hosted
                Agentのセッションはアイドル時に自動的にスケールダウンし、再開時にはファイルシステムの状態を保持したまま復元されるため、この特性を前提にした冪等な処理設計が有効です。
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.section} id="s13">
          <h2>
            <span className={styles.num}>13</span>ベストプラクティス総合チェックリスト
          </h2>
          <div className={styles.prose}>
            <ul className={styles.checklist}>
              <li>プロジェクトは目的別（サンドボックス／本番）に分離されている</li>
              <li>チームメンバーの権限はEntraセキュリティグループ単位で管理されている</li>
              <li>モデル選定は成功基準（精度・レイテンシ・コスト）を先に定義してから行っている</li>
              <li>
                認証はAPIキーではなくマネージドID（<code>DefaultAzureCredential</code>）を使っている
              </li>
              <li>エージェントの指示文にツール選択の判断基準を明記している</li>
              <li>ツールの出力は未検証の入力として扱い、機密情報をログ・トレースに残していない</li>
              <li>RAGの検索パラメータをGroundedness/Relevance評価で比較検証してから採用している</li>
              <li>評価・トレース・監視データをAzure Monitorに集約している</li>
              <li>
                エージェントごとに独立したID（Microsoft Entra Agent ID）とRBACスコープを設計している
              </li>
              <li>本番環境ではプライベートエンドポイント／BYO VNetを既定にしている</li>
              <li>
                コストをタスク種別ごとにプロファイリングし、ルーティング・バッチ・キャッシュ・PTUを使い分けている
              </li>
              <li>
                コンテンツフィルター・Prompt Shields・Groundedness Detectionを本番前に有効化している
              </li>
              <li>Red-teamingや敵対的テストを開発初期から実施している</li>
              <li>
                実行環境（Copilot Studio／Prompt Agent／Hosted Agent／Foundry
                Local）の選択基準をチームで明文化している
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.section} id="s14">
          <h2>
            <span className={styles.num}>14</span>補足: 海外の著名開発者・実務者による知見
          </h2>
          <div className={styles.prose}>
            <p>
              Microsoft公式ドキュメント・公式ブログに加え、以下のような海外の開発者・実務者の技術記事も参考になります。それぞれの要点を要約します。
            </p>
            <div className={styles.devQuote}>
              <div className={styles.devName}>
                El Bruno（Bruno Capuano、Microsoft MVP／.NET Community Standup登壇者）
              </div>
              <p>
                Foundry Localをローカル推論に使いつつ、Microsoft.Extensions.AI（MEAI）が期待する
                <code>IChatClient</code>
                抽象とのブリッジが公式には存在しないという実務上のギャップを指摘し、コミュニティ製アダプターを自作・公開しています。プロバイダー非依存のアプリコードを書きながらローカル推論を維持したいチームにとって参考になる知見です。
              </p>
            </div>
            <div className={styles.devQuote}>
              <div className={styles.devName}>byteiota（技術ブログ）</div>
              <p>
                Foundry Agent ServiceのHosted
                AgentsがGAに至った経緯を整理し、セッションごとのVM分離（ハイパーバイザーレベルの境界）が単なる「使いやすいコンテナサービス」ではない点を強調しています。一方で、特定のサービスメッシュやカスタムTLS終端、特定の認証取得が必須な場合はAzure
                Kubernetes Serviceなど自己管理型の選択肢が依然として適切だと指摘しています。
              </p>
            </div>
            <div className={styles.devQuote}>
              <div className={styles.devName}>
                Big Hat Group（エンタープライズIT向けブリーフィング）
              </div>
              <p>
                Copilot Studio、Microsoft 365 Copilotエージェント、Prompt Agent、Hosted
                Agent、In-processエージェントという5つの選択肢を「誰が運用するか」「コードを書くか」の軸で整理し、ガバナンス上の懸念からエージェントの本番投入を先送りしてきたIT部門向けに実践的な判断フレームワークを提示しています。
              </p>
            </div>
            <div className={styles.devQuote}>
              <div className={styles.devName}>Savita Mittal（Medium）</div>
              <p>
                Foundryにおけるエージェント分離の実装を、ID分離・RBACによるデータ分離・ランタイム実行分離・オーケストレーションの4つの側面から具体例つきで解説しています。RAGエージェントには読み取り専用権限のみ、アクション型エージェントにはスコープ付き書き込み権限のみを与えるという最小権限設計の実例は、初学者がRBAC設計を考える際の良い出発点になります。
              </p>
            </div>
            <div className={styles.devQuote}>
              <div className={styles.devName}>Jannik Reinhard（技術ブログ）</div>
              <p>
                Azure AI Content
                Safetyを「単純なフィルターから成熟したガードレールプラットフォームへ進化した」と評価し、まずは既定の中程度のしきい値から始めてブロック率を観察しながら調整するという、現場で扱いやすい導入手順を提案しています。
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section} id="s15">
          <h2>
            <span className={styles.num}>15</span>参考ソース一覧
          </h2>
          <div className={styles.prose}>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>タイトル</th>
                    <th>発行元 / 著者</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Microsoft Foundry（製品ページ）</td>
                    <td>Microsoft Azure（公式）</td>
                    <td>
                      <Ext href="https://azure.microsoft.com/en-us/products/ai-foundry/">
                        azure.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>What is Microsoft Foundry?</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry?tabs=python">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Tool best practices for Microsoft Foundry Agent Service</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/tool-best-practice">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Build and run agents at scale with Microsoft Foundry at Build 2026</td>
                    <td>Microsoft Foundry Blog（公式）</td>
                    <td>
                      <Ext href="https://devblogs.microsoft.com/foundry/agent-service-build2026/">
                        devblogs.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>What's new in Microsoft Foundry, March 2026</td>
                    <td>Microsoft Foundry Blog（公式）</td>
                    <td>
                      <Ext href="https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-mar-2026/">
                        devblogs.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>What's new in Microsoft Foundry, Build Edition</td>
                    <td>Microsoft Foundry Blog（公式）</td>
                    <td>
                      <Ext href="https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-build-2026/">
                        devblogs.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>What is Microsoft Foundry Agent Service?</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/agents/overview">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>Foundry Agent Service（製品ページ）</td>
                    <td>Microsoft Azure（公式）</td>
                    <td>
                      <Ext href="https://azure.microsoft.com/en-us/products/ai-foundry/agent-service">
                        azure.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>Microsoft Foundry Agent Service Is GA: What Developers Need to Know</td>
                    <td>byteiota</td>
                    <td>
                      <Ext href="https://byteiota.com/foundry-agent-service-ga/">byteiota.com</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>Microsoft Foundry Hosted Agents: What Enterprise IT Should Do Now</td>
                    <td>Big Hat Group Inc.</td>
                    <td>
                      <Ext href="https://www.bighatgroup.com/blog/microsoft-foundry-hosted-agents-enterprise-guide-april-2026/">
                        bighatgroup.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>Azure AI security best practices</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/security/fundamentals/ai-security-best-practices">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>Agent Isolation in Microsoft Foundry — How It's Implemented in Practice</td>
                    <td>Savita Mittal (Medium)</td>
                    <td>
                      <Ext href="https://medium.com/@smazcloud/agent-isolation-in-microsoft-foundry-how-its-implemented-in-practice-66250eaaf96b">
                        medium.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>13</td>
                    <td>Explore Foundry MCP Server best practices and security guidance</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/mcp/security-best-practices">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>14</td>
                    <td>How to configure network isolation for Microsoft Foundry</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/how-to/configure-private-link">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>15</td>
                    <td>
                      Role-Based Access Control for Microsoft Foundry: 2026 Azure AI Foundry RBAC
                      Guide
                    </td>
                    <td>IT trip</td>
                    <td>
                      <Ext href="https://en.ittrip.xyz/ai/foundry-rbac-guide">en.ittrip.xyz</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>16</td>
                    <td>Evaluating and Optimizing RAG Agents with Azure AI Foundry</td>
                    <td>Microsoft Tech Community（公式）</td>
                    <td>
                      <Ext href="https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/the-future-of-ai-evaluating-and-optimizing-custom-rag-agents-using-azure-ai-foun/4455215">
                        techcommunity.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>17</td>
                    <td>How to debug and optimize RAG agents in Microsoft Foundry</td>
                    <td>Microsoft Foundry Blog（公式）</td>
                    <td>
                      <Ext href="https://devblogs.microsoft.com/foundry/how-to-debug-and-optimize-rag-agents-in-azure-ai-foundry/">
                        devblogs.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>18</td>
                    <td>Foundry observability concepts</td>
                    <td>Microsoft Learn（公式・GitHubソース）</td>
                    <td>
                      <Ext href="https://github.com/MicrosoftDocs/azure-ai-docs/blob/main/articles/foundry/concepts/observability.md">
                        github.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>19</td>
                    <td>
                      Generally Available: Evaluations, Monitoring, and Tracing in Microsoft Foundry
                    </td>
                    <td>Azure Feeds</td>
                    <td>
                      <Ext href="https://azurefeeds.com/2026/03/17/generally-available-evaluations-monitoring-and-tracing-in-microsoft-foundry/">
                        azurefeeds.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>20</td>
                    <td>
                      A Developer's Guide to Managing Models, Cost and Quality in Microsoft Foundry
                    </td>
                    <td>Microsoft Foundry Blog（公式）</td>
                    <td>
                      <Ext href="https://devblogs.microsoft.com/foundry/build-2026-foundry-models/">
                        devblogs.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>21</td>
                    <td>Optimize model cost and performance</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/control-plane/how-to-optimize-cost-performance">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>22</td>
                    <td>Cost Optimization of Azure AI Services</td>
                    <td>Microsoft Community Hub（公式）</td>
                    <td>
                      <Ext href="https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/cost-optimization-of-azure-ai-services/4459100">
                        techcommunity.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>23</td>
                    <td>Plan and Manage Costs for Foundry</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>24</td>
                    <td>
                      Local-first AI Agents in C#: Foundry Local, MEAI, and Microsoft Agent
                      Framework
                    </td>
                    <td>El Bruno（Bruno Capuano）</td>
                    <td>
                      <Ext href="https://elbruno.com/2026/06/05/local-first-ai-agents-in-c-foundry-local-meai-and-microsoft-agent-framework/">
                        elbruno.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>25</td>
                    <td>
                      From Local to Production: Deploy Your Microsoft Agent Framework Agent with
                      Foundry Hosted Agents
                    </td>
                    <td>Microsoft Agent Framework Blog（公式）</td>
                    <td>
                      <Ext href="https://devblogs.microsoft.com/agent-framework/from-local-to-production-deploy-your-microsoft-agent-framework-agent-with-foundry-hosted-agents/">
                        devblogs.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>26</td>
                    <td>
                      Build a real-world example with Microsoft Agent Framework, Microsoft Foundry,
                      MCP and Aspire
                    </td>
                    <td>Microsoft for Developers（公式）</td>
                    <td>
                      <Ext href="https://developer.microsoft.com/blog/build-a-real-world-example-with-microsoft-agent-framework-microsoft-foundry-mcp-and-aspire">
                        developer.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>27</td>
                    <td>microsoft/agent-framework（GitHubリポジトリ）</td>
                    <td>Microsoft（公式OSS）</td>
                    <td>
                      <Ext href="https://github.com/microsoft/agent-framework">github.com</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>28</td>
                    <td>Create a project</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/how-to/create-projects">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>29</td>
                    <td>Quickstart: Set up Microsoft Foundry resources</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/tutorials/quickstart-create-foundry-resources">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>30</td>
                    <td>Quickstart: Get started with Microsoft Foundry SDK</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>31</td>
                    <td>Get started with Foundry Local</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry-local/get-started">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>32</td>
                    <td>Responsible AI for Microsoft Foundry</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/responsible-use-of-ai-overview">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>33</td>
                    <td>Content Safety in Foundry Control Plane（製品ページ）</td>
                    <td>Microsoft Azure（公式）</td>
                    <td>
                      <Ext href="https://azure.microsoft.com/en-us/products/ai-services/ai-content-safety/">
                        azure.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>34</td>
                    <td>
                      Enhance AI security with Azure Prompt Shields and Azure AI Content Safety
                    </td>
                    <td>Microsoft Azure Blog（公式）</td>
                    <td>
                      <Ext href="https://azure.microsoft.com/en-us/blog/enhance-ai-security-with-azure-prompt-shields-and-azure-ai-content-safety/">
                        azure.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>35</td>
                    <td>Default Guardrail policies for Azure OpenAI</td>
                    <td>Microsoft Learn（公式）</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/default-safety-policies">
                        learn.microsoft.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>36</td>
                    <td>Azure AI Content Safety: 7 Essential Best Practices</td>
                    <td>Jannik Reinhard</td>
                    <td>
                      <Ext href="https://jannikreinhard.com/2026/02/18/what-azure-ai-content-safety-does-and-why-it-matters/">
                        jannikreinhard.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>37</td>
                    <td>Microsoft Foundry Content Moderation &amp; AI Governance</td>
                    <td>Princeton IT Services</td>
                    <td>
                      <Ext href="https://princetonits.com/blog/ai-governance-responsible-ai/microsoft-foundry-content-moderation-ai-governance/">
                        princetonits.com
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <footer className={styles.pageFooter}>
          <p>
            本ガイドは2026年7月18日時点の情報にもとづいています。Microsoft
            FoundryはPreview機能が短期間でGAへ移行する、あるいは名称や課金体系が変更されるなど変化が速いプラットフォームです。本番導入の意思決定を行う際は、必ず上記の参考ソース、特にMicrosoft
            Learn公式ドキュメントの該当ページで最新の状態を確認してください。
          </p>
        </footer>
      </main>
    </div>
  );
}
