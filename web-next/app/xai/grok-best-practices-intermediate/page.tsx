import type { Metadata } from 'next';
import MermaidDiagram from '@/components/docs/MermaidDiagram';
import styles from './page.module.css';
import TocObserver from './TocObserver';

export const metadata: Metadata = {
  title: 'xAI Grok API 実践ベストプラクティスガイド',
  description:
    'モデル選定からエージェント型ツール、マルチエージェントリサーチ、Prompt Caching、コスト最適化まで。中級〜上級エンジニアが本番導入する際に押さえるべきポイントをステップバイステップで解説します。',
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const MERMAID_DIAGRAM_1 = `flowchart TD
    A["タスクの性質は?"] --> B{"テキスト/コード生成か?"}
    B -- はい --> C{"深いリサーチ・複数視点の統合が必要か?"}
    C -- はい --> D["grok-4.20-multi-agent (4 or 16 エージェント)"]
    C -- いいえ --> E["grok-4.5 (reasoning_effort で調整)"]
    B -- いいえ --> F{"モダリティは?"}
    F -- 画像生成/編集 --> G["Grok Imagine: image / image-quality"]
    F -- 動画生成/編集 --> H["Grok Imagine: video / video-1.5"]
    F -- 音声 --> I["Grok Voice API"]`;

const MERMAID_DIAGRAM_2 = `flowchart LR
    subgraph Client["クライアントアプリケーション"]
        A1["xai-sdk (Python/gRPC)"]
        A2["OpenAI SDK (base_url差し替え)"]
        A3["Vercel AI SDK (@ai-sdk/xai)"]
    end

    subgraph API["xAI API エンドポイント"]
        B1["/v1/responses (推奨)"]
        B2["/v1/chat/completions (レガシー互換)"]
    end

    subgraph Model["Grok モデル"]
        C1["grok-4.5 等"]
    end

    subgraph ServerTools["サーバーサイド組み込みツール"]
        D1["Web Search"]
        D2["X Search"]
        D3["Code Execution"]
        D4["Collections Search RAG"]
        D5["Remote MCP Tools"]
    end

    subgraph ClientTools["クライアントサイドツール"]
        E1["Function Calling (自前実装)"]
    end

    A1 --> B1
    A2 --> B1
    A2 -.-> B2
    A3 --> B1
    B1 --> C1
    B2 --> C1
    C1 -->|自動実行| ServerTools
    C1 -->|tool_call を返却| E1
    E1 -->|実行結果を返送| C1
    ServerTools -->|結果を注入| C1
    C1 --> B1
    B1 --> Client`;

const MERMAID_DIAGRAM_3 = `flowchart LR
    A["1. accounts.x.ai<br/>でアカウント作成"] --> B["2. console.x.ai<br/>でAPIキー発行"]
    B --> C["3. SDK インストール"]
    C --> D["4. 最初のリクエスト送信"]`;

const MERMAID_DIAGRAM_4 = `flowchart TD
    A["リクエストの特性は?"] --> B{"レイテンシ制約は厳しいか?"}
    B -- はい --> C["reasoning_effort = low"]
    B -- いいえ --> D{"複雑なデータ分析や長文脈推論か?"}
    D -- はい --> E["reasoning_effort = medium"]
    D -- いいえ --> F{"数学証明・多段階ロジック・<br>競技プログラミング級か?"}
    F -- はい --> G["reasoning_effort = high（デフォルト）"]
    F -- いいえ --> E`;

const MERMAID_DIAGRAM_5 = `sequenceDiagram
    participant Dev as 開発者アプリケーション
    participant Grok as Grok (grok-4.5)
    participant Tool as 外部システム/DB/API

    Dev->>Grok: ツール定義 + ユーザークエリを送信
    Grok-->>Dev: tool_call（関数名・引数）を返却
    Dev->>Tool: 関数をローカルで実行
    Tool-->>Dev: 実行結果
    Dev->>Grok: tool_result を会話履歴に追加して再送信
    Grok-->>Dev: 最終的な自然言語の応答`;

const MERMAID_DIAGRAM_6 = `flowchart TD
    A["ユーザークエリ"] --> B["grok-4.5 が必要なツールを自律判断"]
    B --> C1["Web Search (web_search)"]
    B --> C2["X Search (x_search)"]
    B --> C3["Code Execution (code_execution/code_interpreter)"]
    B --> C4["Collections Search (RAG)"]
    B --> C5["Remote MCP Tools"]
    C1 --> D["結果をモデルコンテキストに統合"]
    C2 --> D
    C3 --> D
    C4 --> D
    C5 --> D
    D --> E["最終応答 + 引用(citations)"]`;

const MERMAID_DIAGRAM_7 = `flowchart TD
    U["ユーザークエリ"] --> L["リーダーエージェント"]
    L --> S1["サブエージェント1 (Web検索担当)"]
    L --> S2["サブエージェント2 (X検索担当)"]
    L --> S3["サブエージェント3 (データ分析担当)"]
    L --> S4["サブエージェントN (統合・検証担当)"]
    S1 --> L
    S2 --> L
    S3 --> L
    S4 --> L
    L --> R["最終応答 (引用付き)"]`;

const MERMAID_DIAGRAM_8 = `sequenceDiagram
    participant App as アプリケーション
    participant Srv as xAI サーバー（特定インスタンス）

    App->>Srv: Turn 1: system + user（x-grok-conv-id 付与）
    Srv-->>App: 応答 + cached_tokens=0（初回のためキャッシュなし）
    Note over Srv: プレフィックスをキャッシュ

    App->>Srv: Turn 2: 同じプレフィックス + 新規 user メッセージ（同一 conv-id）
    Srv-->>App: 応答 + cached_tokens > 0（プレフィックス部分がキャッシュヒット）`;

const MERMAID_DIAGRAM_9 = `flowchart LR
    A["長大な会話履歴 (数十〜数百メッセージ)"] --> B["POST /v1/responses/compact"]
    B --> C["compaction アイテム (encrypted_content として集約)"]
    C --> D["次回リクエストの先頭に そのまま付与"]
    D --> E["新規 user メッセージを末尾に追加"]
    E --> F["モデルは全履歴があるかのように 会話を継続"]`;

const MERMAID_DIAGRAM_10 = `flowchart TD
    A["リクエスト送信"] --> B{"HTTP ステータス"}
    B -- 200 --> C["正常応答を処理"]
    B -- "429 Too Many Requests" --> D["指数バックオフで待機"]
    D --> E{"最大リトライ回数 到達?"}
    E -- いいえ --> A
    E -- はい --> F["エラーとして扱い アラート/フォールバック"]`;

const MERMAID_DIAGRAM_11 = `flowchart TD
    A["コスト最適化を検討"] --> B{"リアルタイム性が不要な大量処理か?"}
    B -- はい --> C["Batch API で最大20%割引"]
    B -- いいえ --> D{"同一会話が繰り返し送信されるか?"}
    D -- はい --> E["Prompt Caching (x-grok-conv-id)"]
    D -- いいえ --> F{"会話が長大化しているか?"}
    F -- はい --> G["Context Compaction で入力トークンを圧縮"]
    F -- いいえ --> H{"低レイテンシが最優先か?"}
    H -- はい --> I["Priority Processing (2倍課金)"]
    H -- いいえ --> J["reasoning_effort を low/medium に調整"]`;

export default function GrokBestPracticesIntermediatePage() {
  return (
    <div className={styles.layout}>
      <TocObserver activeClass={styles.active} />
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          Grok / xAI API
          <strong>実践ベストプラクティス</strong>
        </div>
        <nav className={styles.sidebarNav} id="side-nav">
          <a href="#sec-1">1. モデル選定</a>
          <a href="#sec-2">2. アーキテクチャ</a>
          <a href="#sec-3">3. セットアップ</a>
          <a href="#sec-4">4. Reasoning 制御</a>
          <a href="#sec-5">5. Structured Outputs</a>
          <a href="#sec-6">6. Function Calling</a>
          <a href="#sec-7">7. 組み込みツール</a>
          <a href="#sec-8">8. Multi-agent Research</a>
          <a href="#sec-9">9. Prompt Caching</a>
          <a href="#sec-10">10. Context Compaction</a>
          <a href="#sec-11">11. レート制限</a>
          <a href="#sec-12">12. コスト最適化</a>
          <a href="#sec-13">13. セキュリティ運用</a>
          <a href="#sec-14">14. 導入チェックリスト</a>
          <a href="#sec-15">15. 参考文献</a>
        </nav>
        <div className={styles.sidebarFooter}>
          docs.x.ai / grok.com
          <br />
          2026年7月15日時点の情報に基づく
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>Grok / xAI API — Intermediate to Advanced</div>
          <h1>
            xAI Grok API
            <br />
            実践ベストプラクティスガイド
          </h1>
          <p className={styles.lead}>
            モデル選定からエージェント型ツール、マルチエージェントリサーチ、Prompt
            Caching、コスト最適化まで。中級〜上級エンジニアが本番導入する際に押さえるべきポイントをステップバイステップで解説します。
          </p>
          <div className={styles.metaBox}>
            本ガイドは <Ext href="https://docs.x.ai/overview">docs.x.ai</Ext> および{' '}
            <Ext href="https://grok.com/">grok.com</Ext>{' '}
            の公式情報（2026年7月15日時点）を実際に調査した上で作成しています。xAI
            のドキュメントは更新頻度が高いため、本番投入前に第15章のリンクから最新版を再確認してください。
          </div>
        </div>

        {/* 1. モデルラインナップ */}
        <section className={styles.block} id="sec-1">
          <h2>
            <span className={styles.num}>01</span> xAI モデルラインナップとモデル選定
          </h2>
          <p>
            2026年7月時点で、コード生成・チャット・汎用タスクの旗艦モデルは <code>grok-4.5</code>{' '}
            です。xAI は「画像・動画・音声には専用モデル、それ以外はすべて Grok
            4.5」という明確な方針を打ち出しています。
          </p>

          <h3>1.1 用途別モデル選定表</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>用途</th>
                  <th>推奨モデル</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>コード生成</td>
                  <td>
                    <code>grok-4.5</code>
                  </td>
                </tr>
                <tr>
                  <td>チャット・汎用対話</td>
                  <td>
                    <code>grok-4.5</code>
                  </td>
                </tr>
                <tr>
                  <td>画像生成</td>
                  <td>
                    Grok Imagine API（<code>grok-imagine-image</code> /{' '}
                    <code>grok-imagine-image-quality</code>）
                  </td>
                </tr>
                <tr>
                  <td>動画生成</td>
                  <td>
                    Grok Imagine API（<code>grok-imagine-video</code> /{' '}
                    <code>grok-imagine-video-1.5</code>）
                  </td>
                </tr>
                <tr>
                  <td>音声</td>
                  <td>Grok Voice API</td>
                </tr>
                <tr>
                  <td>マルチエージェント・ディープリサーチ</td>
                  <td>
                    <code>grok-4.20-multi-agent</code>（ベータ）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>1.2 モデル比較表（2026年7月時点）</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>モデル</th>
                  <th>コンテキスト長</th>
                  <th>Input ($/1M)</th>
                  <th>Cached Input ($/1M)</th>
                  <th>Output ($/1M)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>grok-4.5</code>
                  </td>
                  <td>500k</td>
                  <td>$2.00</td>
                  <td>$0.50</td>
                  <td>$6.00</td>
                </tr>
                <tr>
                  <td>
                    <code>grok-4.3</code>
                  </td>
                  <td>1M</td>
                  <td>$1.25</td>
                  <td>$0.20</td>
                  <td>$2.50</td>
                </tr>
                <tr>
                  <td>
                    <code>grok-4.20-multi-agent-0309</code>
                  </td>
                  <td>1M</td>
                  <td>$1.25</td>
                  <td>$0.20</td>
                  <td>$2.50</td>
                </tr>
                <tr>
                  <td>
                    <code>grok-4.20-0309-reasoning</code>
                  </td>
                  <td>1M</td>
                  <td>$1.25</td>
                  <td>$0.20</td>
                  <td>$2.50</td>
                </tr>
                <tr>
                  <td>
                    <code>grok-build-0.1</code>（コード専用）
                  </td>
                  <td>256k</td>
                  <td>$1.00</td>
                  <td>$0.20</td>
                  <td>$2.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.callout}>
            <strong>ベストプラクティス:</strong> 迷ったら <code>grok-4.5</code>
            （エイリアス）を使用。
            <code>grok-4.5-latest</code> は最新版に自動追従し、<code>grok-4.5-&lt;日付&gt;</code>{' '}
            は特定バージョンに固定されます。本番環境で挙動の一貫性を優先するなら日付固定版、最新機能を優先するなら{' '}
            <code>-latest</code> を使い分けてください。
          </div>

          <h3>1.3 モデル選定フローチャート</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_1} />
          </div>

          <h3>1.4 重要な仕様上の注意点</h3>
          <ul>
            <li>
              <strong>リアルタイム情報へのアクセス不可</strong>: Grok
              は学習データ以降のイベントを知らないため、最新情報が必要な場合は必ず Web Search / X
              Search ツールを有効化する必要があります。
            </li>
            <li>
              <strong>
                <code>logprobs</code> / <code>top_logprobs</code> 非対応
              </strong>
              : <code>grok-4.20</code>{' '}
              以降のモデルではこれらのフィールドはエラーにならず黙って無視されます。
            </li>
            <li>
              <strong>画像入力</strong>: 最大 20 MiB / 枚、<code>jpg</code>・<code>png</code>{' '}
              のみ対応、枚数上限なし。
            </li>
            <li>
              <strong>reasoning モデルでの制約</strong>: <code>presencePenalty</code> /{' '}
              <code>frequencyPenalty</code> / <code>stop</code> は指定するとエラーになります。
            </li>
          </ul>

          <p className={styles.dim}>
            出典: <Ext href="https://docs.x.ai/developers/models">Models | xAI Docs</Ext> ／{' '}
            <Ext href="https://docs.x.ai/developers/pricing">Pricing | xAI Docs</Ext> ／{' '}
            <Ext href="https://docs.x.ai/developers/model-capabilities/text/reasoning">
              Reasoning | xAI Docs
            </Ext>
          </p>
        </section>

        {/* 2. 全体アーキテクチャ */}
        <section className={styles.block} id="sec-2">
          <h2>
            <span className={styles.num}>02</span> 全体アーキテクチャを理解する
          </h2>
          <p>
            xAI API は OpenAI 互換の <strong>Responses API</strong>（<code>/v1/responses</code>
            ）を主軸としつつ、xAI ネイティブの Python/gRPC SDK（<code>xai-sdk</code>
            ）も提供しています。レガシーな Chat Completions（
            <code>/v1/chat/completions</code>）も引き続き利用可能ですが、新規実装では Responses API
            が推奨です。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_2} />
          </div>

          <div className={styles.callout}>
            <strong>ポイント:</strong> サーバーサイドツール（Web Search・X Search・Code
            Execution・Remote MCP）は xAI 側で自動実行され応答に組み込まれますが、Function
            Calling（クライアントサイドツール）は必ず一度ターンが「一時停止」し、開発者側で実行して結果を返す必要があります。この違いを理解することがエージェント設計の第一歩です。
          </div>

          <p className={styles.dim}>
            出典: <Ext href="https://docs.x.ai/overview">Overview | xAI Docs</Ext> ／{' '}
            <Ext href="https://docs.x.ai/developers/tools/function-calling">
              Function Calling | xAI Docs
            </Ext>{' '}
            ／{' '}
            <Ext href="https://docs.x.ai/docs/guides/tools/overview">Tools Overview | xAI Docs</Ext>
          </p>
        </section>

        {/* 3. セットアップと認証 */}
        <section className={styles.block} id="sec-3">
          <h2>
            <span className={styles.num}>03</span> セットアップと認証
          </h2>

          <h3>3.1 手順フロー</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_3} />
          </div>

          <h3>3.2 環境変数の設定</h3>
          <div className={styles.codeLabel}>bash</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>export</span>{' '}
              <span className={styles.cv}>XAI_API_KEY</span>=
              <span className={styles.cs}>&quot;your_api_key&quot;</span>
            </div>
          </div>

          <h3>3.3 SDK インストール</h3>
          <div className={styles.codeLabel}>bash</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.cc}># xAI ネイティブ SDK（Python）</span>
            </div>
            <div className={styles.codeLine}>pip install xai-sdk</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              <span className={styles.cc}>
                # OpenAI SDK 経由（base_url を差し替えるだけで利用可能）
              </span>
            </div>
            <div className={styles.codeLine}>pip install openai</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              <span className={styles.cc}># Vercel AI SDK（TypeScript/JavaScript）</span>
            </div>
            <div className={styles.codeLine}>npm install ai @ai-sdk/xai zod</div>
          </div>

          <h3>3.4 最小リクエスト例</h3>
          <div className={styles.codeLabel}>python — xai-sdk</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>import</span> os
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk{' '}
              <span className={styles.ck}>import</span> Client
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk.chat{' '}
              <span className={styles.ck}>import</span> user
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              client = Client(api_key=os.getenv(
              <span className={styles.cs}>&quot;XAI_API_KEY&quot;</span>))
            </div>
            <div className={styles.codeLine}>
              chat = client.chat.create(model=
              <span className={styles.cs}>&quot;grok-4.5&quot;</span>)
            </div>
            <div className={styles.codeLine}>
              chat.append(user(
              <span className={styles.cs}>
                &quot;Fix this function and explain the bug: function median(a)
                {`{a.sort();return a[a.length/2]}`}&quot;
              </span>
              ))
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>print(chat.sample().content)</div>
          </div>

          <div className={styles.codeLabel}>bash — curl</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>curl https://api.x.ai/v1/responses \</div>
            <div className={styles.codeLine}>
              {'  '}-H{' '}
              <span className={styles.cs}>&quot;Authorization: Bearer $XAI_API_KEY&quot;</span> \
            </div>
            <div className={styles.codeLine}>
              {'  '}-H <span className={styles.cs}>&quot;Content-Type: application/json&quot;</span>{' '}
              \
            </div>
            <div className={styles.codeLine}>{'  '}-d &#123;</div>
            <div className={styles.codeLine}>
              {'    '}
              <span className={styles.cs}>&quot;model&quot;</span>:{' '}
              <span className={styles.cs}>&quot;grok-4.5&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {'    '}
              <span className={styles.cs}>&quot;input&quot;</span>:{' '}
              <span className={styles.cs}>&quot;Fix this function and explain the bug&quot;</span>
            </div>
            <div className={styles.codeLine}>{'  '}&#125;</div>
          </div>

          <p className={styles.dim}>
            出典: <Ext href="https://docs.x.ai/developers/quickstart">Quickstart | xAI Docs</Ext>
          </p>
        </section>

        {/* 4. Reasoning 制御 */}
        <section className={styles.block} id="sec-4">
          <h2>
            <span className={styles.num}>04</span> Reasoning（推論）モデルの制御
          </h2>
          <p>
            <code>grok-4.5</code> は <code>reasoning_effort</code>{' '}
            パラメータで思考の深さを制御できます。
            <strong>
              指定しない場合はデフォルトで <code>&quot;high&quot;</code> になり、reasoning
              自体を無効化することはできません。
            </strong>
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>設定値</th>
                  <th>説明</th>
                  <th>向いている用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>&quot;low&quot;</code>
                  </td>
                  <td>一部の reasoning トークンのみ使用。高速</td>
                  <td>レイテンシ重視のエージェント処理、単純なツール呼び出し</td>
                </tr>
                <tr>
                  <td>
                    <code>&quot;medium&quot;</code>
                  </td>
                  <td>ある程度の思考時間を許容</td>
                  <td>複雑なデータ分析、長文脈の推論</td>
                </tr>
                <tr>
                  <td>
                    <code>&quot;high&quot;</code>（デフォルト）
                  </td>
                  <td>最大限の思考トークンを使用</td>
                  <td>難解な数学・多段階ロジック・競技プログラミング級</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>4.1 設定フローチャート</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_4} />
          </div>

          <h3>4.2 実装例</h3>
          <div className={styles.codeLabel}>python</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>import</span> os
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk{' '}
              <span className={styles.ck}>import</span> Client
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk.chat{' '}
              <span className={styles.ck}>import</span> system, user
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              client = Client(api_key=os.getenv(
              <span className={styles.cs}>&quot;XAI_API_KEY&quot;</span>), timeout=3600)
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>chat = client.chat.create(</div>
            <div className={styles.codeLine}>
              {'    '}model=<span className={styles.cs}>&quot;grok-4.5&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {'    '}reasoning_effort=<span className={styles.cs}>&quot;high&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {'    '}messages=[system(
              <span className={styles.cs}>
                &quot;You are a highly intelligent AI assistant.&quot;
              </span>
              )],
            </div>
            <div className={styles.codeLine}>)</div>
            <div className={styles.codeLine}>
              chat.append(user(
              <span className={styles.cs}>
                &quot;Find all prime numbers p such that p^2 + 2 is also prime. Prove your
                answer.&quot;
              </span>
              ))
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>response = chat.sample()</div>
            <div className={styles.codeLine}>print(response.content)</div>
          </div>

          <div className={`${styles.callout} ${styles.warn}`}>
            <strong>注意:</strong> reasoning モデルでは <code>presencePenalty</code> /{' '}
            <code>frequencyPenalty</code> / <code>stop</code>{' '}
            を指定するとエラーになります。reasoning トークンも通常のトークンと同様に課金対象です。
          </div>

          <h3>4.3 Encrypted / Summarized Reasoning</h3>
          <p>
            マルチターン会話で前回ターンの推論内容をモデルに引き継がせたい場合は{' '}
            <code>include: [&quot;reasoning.encrypted_content&quot;]</code>{' '}
            を指定します。また、モデル内部の思考過程の要約を <code>reasoning_content</code>（xAI
            SDK）や <code>response.reasoning_text.delta</code>（Responses
            API）としてストリーミングで取得でき、デバッグや「thinking…」表示に活用できます。
          </p>

          <h3>4.4 マルチエージェントモデルにおける意味の違い</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>モデル</th>
                  <th>
                    <code>reasoning</code> パラメータ
                  </th>
                  <th>挙動</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>grok-4.5</code>
                  </td>
                  <td>
                    <code>&quot;low&quot;/&quot;medium&quot;/&quot;high&quot;</code>
                  </td>
                  <td>推論の深さを制御（無効化不可）</td>
                </tr>
                <tr>
                  <td>
                    <code>grok-4.20-multi-agent</code>
                  </td>
                  <td>
                    <code>
                      &quot;low&quot;/&quot;medium&quot;/&quot;high&quot;/&quot;xhigh&quot;
                    </code>
                  </td>
                  <td>エージェント数を制御（4体 or 16体）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.dim}>
            出典:{' '}
            <Ext href="https://docs.x.ai/developers/model-capabilities/text/reasoning">
              Reasoning | xAI Docs
            </Ext>
          </p>
        </section>

        {/* 5. Structured Outputs */}
        <section className={styles.block} id="sec-5">
          <h2>
            <span className={styles.num}>05</span> Structured Outputs で型安全な出力を得る
          </h2>
          <p>
            2つのアプローチがあります。(1) <code>response_format</code> パラメータで{' '}
            <code>type: &quot;json_schema&quot;</code> を指定し、Pydantic/Zod
            で定義したスキーマに準拠した JSON を「保証」して取得する方法。(2) Tool Calling 経由 —{' '}
            ツール定義を行うと、モデルは常に厳密にスキーマ準拠の引数を生成します（
            <code>strict</code> は暗黙的に常に <code>true</code>）。
          </p>

          <h3>5.1 サポートされる JSON Schema の範囲</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>カテゴリ</th>
                  <th>対応内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>基本型</td>
                  <td>
                    <code>string</code> / <code>number</code> / <code>integer</code> /{' '}
                    <code>boolean</code> / <code>null</code> / <code>enum</code> /{' '}
                    <code>const</code> / <code>array</code> / <code>object</code>
                  </td>
                </tr>
                <tr>
                  <td>結合</td>
                  <td>
                    <code>anyOf</code>（<code>oneOf</code> は同一挙動）/ <code>allOf</code>
                    （単一サブスキーマのみ完全保証）
                  </td>
                </tr>
                <tr>
                  <td>参照</td>
                  <td>
                    <code>$ref</code> / <code>$defs</code>（循環参照不可）
                  </td>
                </tr>
                <tr>
                  <td>文字列フォーマット（強制）</td>
                  <td>
                    <code>date</code> / <code>time</code> / <code>date-time</code> /{' '}
                    <code>email</code> / <code>uuid</code> / <code>ipv4</code> / <code>ipv6</code> /{' '}
                    <code>uri</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>5.2 制約の保証上限</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>キーワード</th>
                  <th>保証される上限</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>minimum</code> / <code>maximum</code>
                  </td>
                  <td>上限なし</td>
                </tr>
                <tr>
                  <td>
                    <code>minLength</code> / <code>maxLength</code>
                  </td>
                  <td>2,048</td>
                </tr>
                <tr>
                  <td>
                    <code>minItems</code> / <code>maxItems</code>
                  </td>
                  <td>256</td>
                </tr>
                <tr>
                  <td>
                    <code>minProperties</code> / <code>maxProperties</code>
                  </td>
                  <td>64</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.warn}`}>
            <strong>注意:</strong> <code>not</code> / <code>if-then-else</code> / 複数の{' '}
            <code>allOf</code> / 未サポートの <code>format</code>{' '}
            は「ベストエフォート」扱いで保証されません。<code>additionalProperties</code>{' '}
            はデフォルト <code>false</code> のため、許可したい場合は明示的に <code>true</code>{' '}
            を指定してください。また正規表現（
            <code>pattern</code>）は後方参照・先読み/後読み・単語境界（<code>\b</code>
            ）に非対応です。
          </div>

          <h3>5.3 却下されるスキーマ（400 エラー）</h3>
          <ul>
            <li>
              <code>enum</code> / <code>anyOf</code> の variant が 0 個
            </li>
            <li>
              プロパティのスキーマが <code>true</code> または <code>false</code>
            </li>
            <li>
              <code>maxContains</code> / <code>minContains</code>
            </li>
            <li>
              <code>items</code> を配列として指定（タプル検証には <code>prefixItems</code> を使用）
            </li>
          </ul>

          <h3>5.4 実装例：請求書のパース</h3>
          <div className={styles.codeLabel}>python</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> datetime{' '}
              <span className={styles.ck}>import</span> date
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> enum <span className={styles.ck}>import</span>{' '}
              Enum
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> pydantic{' '}
              <span className={styles.ck}>import</span> BaseModel, Field
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk{' '}
              <span className={styles.ck}>import</span> Client
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk.chat{' '}
              <span className={styles.ck}>import</span> system, user
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              <span className={styles.ck}>class</span> Currency(str, Enum):
            </div>
            <div className={styles.codeLine}>
              {'    '}USD = <span className={styles.cs}>&quot;USD&quot;</span>; EUR ={' '}
              <span className={styles.cs}>&quot;EUR&quot;</span>; GBP ={' '}
              <span className={styles.cs}>&quot;GBP&quot;</span>
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              <span className={styles.ck}>class</span> LineItem(BaseModel):
            </div>
            <div className={styles.codeLine}>{'    '}description: str</div>
            <div className={styles.codeLine}>{'    '}quantity: int = Field(ge=1)</div>
            <div className={styles.codeLine}>{'    '}unit_price: float = Field(ge=0)</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              <span className={styles.ck}>class</span> Invoice(BaseModel):
            </div>
            <div className={styles.codeLine}>{'    '}vendor_name: str</div>
            <div className={styles.codeLine}>{'    '}invoice_number: str</div>
            <div className={styles.codeLine}>{'    '}invoice_date: date</div>
            <div className={styles.codeLine}>{'    '}line_items: list[LineItem]</div>
            <div className={styles.codeLine}>{'    '}total_amount: float = Field(ge=0)</div>
            <div className={styles.codeLine}>{'    '}currency: Currency</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              client = Client(api_key=<span className={styles.cs}>&quot;...&quot;</span>)
            </div>
            <div className={styles.codeLine}>
              chat = client.chat.create(model=
              <span className={styles.cs}>&quot;grok-4.5&quot;</span>)
            </div>
            <div className={styles.codeLine}>
              chat.append(system(
              <span className={styles.cs}>
                &quot;Given a raw invoice, extract the invoice data into JSON format.&quot;
              </span>
              ))
            </div>
            <div className={styles.codeLine}>
              chat.append(user(
              <span className={styles.cs}>&quot;Vendor: Acme Corp ... Total: $80.00 USD&quot;</span>
              ))
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>response, invoice = chat.parse(Invoice)</div>
            <div className={styles.codeLine}>
              print(invoice.vendor_name, invoice.total_amount, invoice.currency)
            </div>
          </div>

          <h3>5.5 Structured Outputs × エージェント型ツールの組み合わせ</h3>
          <p>
            <code>grok-4</code> ファミリーの対応モデルでは、Web Search
            等でリサーチを行い、その結果を型安全な JSON として返すことが可能です。
          </p>
          <div className={styles.codeLabel}>python</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> pydantic{' '}
              <span className={styles.ck}>import</span> BaseModel
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk.tools{' '}
              <span className={styles.ck}>import</span> web_search
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              <span className={styles.ck}>class</span> ProofInfo(BaseModel):
            </div>
            <div className={styles.codeLine}>{'    '}name: str</div>
            <div className={styles.codeLine}>{'    '}authors: str</div>
            <div className={styles.codeLine}>{'    '}year: str</div>
            <div className={styles.codeLine}>{'    '}summary: str</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              chat = client.chat.create(model=
              <span className={styles.cs}>&quot;grok-4.5&quot;</span>, tools=[web_search()])
            </div>
            <div className={styles.codeLine}>
              chat.append(user(
              <span className={styles.cs}>
                &quot;Find the latest machine-checked proof of the four color theorem.&quot;
              </span>
              ))
            </div>
            <div className={styles.codeLine}>response, proof = chat.parse(ProofInfo)</div>
          </div>

          <p className={styles.dim}>
            出典:{' '}
            <Ext href="https://docs.x.ai/developers/model-capabilities/text/structured-outputs">
              Structured Outputs | xAI Docs
            </Ext>
          </p>
        </section>

        {/* 6. Function Calling */}
        <section className={styles.block} id="sec-6">
          <h2>
            <span className={styles.num}>06</span> Function Calling（関数呼び出し）
          </h2>

          <h3>6.1 全体フロー</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_5} />
          </div>

          <h3>6.2 基本実装</h3>
          <div className={styles.codeLabel}>python — xai-sdk</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>import</span> os, json
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk{' '}
              <span className={styles.ck}>import</span> Client
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk.chat{' '}
              <span className={styles.ck}>import</span> user, tool, tool_result
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              client = Client(api_key=os.getenv(
              <span className={styles.cs}>&quot;XAI_API_KEY&quot;</span>))
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>tools = [</div>
            <div className={styles.codeLine}>{'    '}tool(</div>
            <div className={styles.codeLine}>
              {'        '}name=<span className={styles.cs}>&quot;get_temperature&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {'        '}description=
              <span className={styles.cs}>&quot;Get current temperature for a location&quot;</span>,
            </div>
            <div className={styles.codeLine}>{'        '}parameters=&#123;</div>
            <div className={styles.codeLine}>
              {'            '}
              <span className={styles.cs}>&quot;type&quot;</span>:{' '}
              <span className={styles.cs}>&quot;object&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {'            '}
              <span className={styles.cs}>&quot;properties&quot;</span>: &#123;
            </div>
            <div className={styles.codeLine}>
              {'                '}
              <span className={styles.cs}>&quot;location&quot;</span>: &#123;
              <span className={styles.cs}>&quot;type&quot;</span>:{' '}
              <span className={styles.cs}>&quot;string&quot;</span>,{' '}
              <span className={styles.cs}>&quot;description&quot;</span>:{' '}
              <span className={styles.cs}>&quot;City name&quot;</span>&#125;,
            </div>
            <div className={styles.codeLine}>
              {'                '}
              <span className={styles.cs}>&quot;unit&quot;</span>: &#123;
              <span className={styles.cs}>&quot;type&quot;</span>:{' '}
              <span className={styles.cs}>&quot;string&quot;</span>,{' '}
              <span className={styles.cs}>&quot;enum&quot;</span>: [
              <span className={styles.cs}>&quot;celsius&quot;</span>,{' '}
              <span className={styles.cs}>&quot;fahrenheit&quot;</span>],{' '}
              <span className={styles.cs}>&quot;default&quot;</span>:{' '}
              <span className={styles.cs}>&quot;fahrenheit&quot;</span>&#125;
            </div>
            <div className={styles.codeLine}>{'            '}&#125;,</div>
            <div className={styles.codeLine}>
              {'            '}
              <span className={styles.cs}>&quot;required&quot;</span>: [
              <span className={styles.cs}>&quot;location&quot;</span>]
            </div>
            <div className={styles.codeLine}>{'        '}&#125;,</div>
            <div className={styles.codeLine}>{'    '}),</div>
            <div className={styles.codeLine}>]</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              chat = client.chat.create(model=
              <span className={styles.cs}>&quot;grok-4.5&quot;</span>, tools=tools)
            </div>
            <div className={styles.codeLine}>
              chat.append(user(
              <span className={styles.cs}>
                &quot;What is the temperature in San Francisco?&quot;
              </span>
              ))
            </div>
            <div className={styles.codeLine}>response = chat.sample()</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              <span className={styles.ck}>if</span> response.tool_calls:
            </div>
            <div className={styles.codeLine}>{'    '}chat.append(response)</div>
            <div className={styles.codeLine}>
              {'    '}
              <span className={styles.ck}>for</span> tc <span className={styles.ck}>in</span>{' '}
              response.tool_calls:
            </div>
            <div className={styles.codeLine}>
              {'        '}args = json.loads(tc.function.arguments)
            </div>
            <div className={styles.codeLine}>
              {'        '}result = &#123;<span className={styles.cs}>&quot;location&quot;</span>:
              args[<span className={styles.cs}>&quot;location&quot;</span>],{' '}
              <span className={styles.cs}>&quot;temperature&quot;</span>: 59,{' '}
              <span className={styles.cs}>&quot;unit&quot;</span>: args.get(
              <span className={styles.cs}>&quot;unit&quot;</span>,{' '}
              <span className={styles.cs}>&quot;fahrenheit&quot;</span>)&#125;
            </div>
            <div className={styles.codeLine}>
              {'        '}chat.append(tool_result(json.dumps(result)))
            </div>
            <div className={styles.codeLine}>{'    '}response = chat.sample()</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>print(response.content)</div>
          </div>

          <h3>6.3 Tool Choice（ツール使用の制御）</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>値</th>
                  <th>挙動</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>&quot;auto&quot;</code>（デフォルト）
                  </td>
                  <td>モデルがツールを使うか自律的に判断</td>
                </tr>
                <tr>
                  <td>
                    <code>&quot;required&quot;</code>
                  </td>
                  <td>必ず1つ以上のツールを呼び出す</td>
                </tr>
                <tr>
                  <td>
                    <code>&quot;none&quot;</code>
                  </td>
                  <td>ツール呼び出しを無効化</td>
                </tr>
                <tr>
                  <td>
                    <code>&#123;&quot;type&quot;: &quot;function&quot;, ...&#125;</code>
                  </td>
                  <td>特定のツールを強制的に呼び出す</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>6.4 ツールスキーマの制約</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>必須</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>name</code>
                  </td>
                  <td>✅</td>
                  <td>一意な識別子（1リクエストあたり最大200ツール）</td>
                </tr>
                <tr>
                  <td>
                    <code>description</code>
                  </td>
                  <td>✅</td>
                  <td>モデルがいつ使うべきか判断する材料</td>
                </tr>
                <tr>
                  <td>
                    <code>parameters</code>
                  </td>
                  <td>✅</td>
                  <td>
                    JSON Schema。ルートは必ず <code>object</code>（スカラー/配列は400エラー）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.callout}>
            <strong>並列関数呼び出し:</strong> デフォルトで有効。1回の応答で複数の{' '}
            <code>tool_call</code>{' '}
            が返る場合があるため、すべて処理してから次のターンに進む必要があります。無効化する場合は{' '}
            <code>parallel_tool_calls: false</code> を指定します。
          </div>

          <h3>6.5 組み込みツールとの併用</h3>
          <div className={styles.codeLabel}>python</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk.tools{' '}
              <span className={styles.ck}>import</span> web_search, x_search
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk.chat{' '}
              <span className={styles.ck}>import</span> tool
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>tools = [</div>
            <div className={styles.codeLine}>
              {'    '}web_search(), <span className={styles.cc}># サーバーサイドで自動実行</span>
            </div>
            <div className={styles.codeLine}>
              {'    '}x_search(), <span className={styles.cc}># サーバーサイドで自動実行</span>
            </div>
            <div className={styles.codeLine}>
              {'    '}tool( <span className={styles.cc}># クライアントサイド：開発者が実行</span>
            </div>
            <div className={styles.codeLine}>
              {'        '}name=<span className={styles.cs}>&quot;save_to_database&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {'        '}description=
              <span className={styles.cs}>&quot;Save research results to the database&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {'        '}parameters=&#123;<span className={styles.cs}>&quot;type&quot;</span>:{' '}
              <span className={styles.cs}>&quot;object&quot;</span>,{' '}
              <span className={styles.cs}>&quot;properties&quot;</span>: &#123;
              <span className={styles.cs}>&quot;data&quot;</span>: &#123;
              <span className={styles.cs}>&quot;type&quot;</span>:{' '}
              <span className={styles.cs}>&quot;string&quot;</span>&#125;&#125;,{' '}
              <span className={styles.cs}>&quot;required&quot;</span>: [
              <span className={styles.cs}>&quot;data&quot;</span>]&#125;,
            </div>
            <div className={styles.codeLine}>{'    '}),</div>
            <div className={styles.codeLine}>]</div>
          </div>

          <p className={styles.dim}>
            出典:{' '}
            <Ext href="https://docs.x.ai/developers/tools/function-calling">
              Function Calling | xAI Docs
            </Ext>{' '}
            ／{' '}
            <Ext href="https://docs.x.ai/docs/guides/tools/advanced-usage">
              Advanced Usage | xAI Docs
            </Ext>
          </p>
        </section>

        {/* 7. 組み込みツール */}
        <section className={styles.block} id="sec-7">
          <h2>
            <span className={styles.num}>07</span> 組み込みエージェント型ツール
          </h2>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_6} />
          </div>

          <h3>7.1 Web Search</h3>
          <p>リアルタイムでウェブ検索・ページ閲覧を行い、最新情報を回答に統合します。</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>パラメータ</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>allowed_domains</code>
                  </td>
                  <td>検索対象を特定ドメインに限定（最大5件、excluded_domains と併用不可）</td>
                </tr>
                <tr>
                  <td>
                    <code>excluded_domains</code>
                  </td>
                  <td>特定ドメインを検索対象から除外（最大5件）</td>
                </tr>
                <tr>
                  <td>
                    <code>enable_image_understanding</code>
                  </td>
                  <td>閲覧中に見つけた画像を解析可能にする</td>
                </tr>
                <tr>
                  <td>
                    <code>enable_image_search</code>
                  </td>
                  <td>画像検索結果を Markdown 画像埋め込みとして応答に含める</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.codeLabel}>python</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk.tools{' '}
              <span className={styles.ck}>import</span> web_search
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>chat = client.chat.create(</div>
            <div className={styles.codeLine}>
              {'    '}model=<span className={styles.cs}>&quot;grok-4.5&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {'    '}tools=[web_search(allowed_domains=[
              <span className={styles.cs}>&quot;example.com&quot;</span>])],
            </div>
            <div className={styles.codeLine}>)</div>
          </div>

          <h3>7.2 X Search</h3>
          <p>
            X（旧Twitter）上のキーワード検索・セマンティック検索・ユーザー検索・スレッド取得を行います。リアルタイムの世論・トレンド分析に有用です。Web
            Search と同時に有効化でき、モデルが状況に応じてどちらを使うか自律的に判断します。
          </p>

          <div className={styles.codeLabel}>python</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk.tools{' '}
              <span className={styles.ck}>import</span> x_search
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              chat = client.chat.create(model=
              <span className={styles.cs}>&quot;grok-4.5&quot;</span>, tools=[x_search()])
            </div>
            <div className={styles.codeLine}>
              chat.append(user(
              <span className={styles.cs}>&quot;What are people saying about xAI on X?&quot;</span>
              ))
            </div>
          </div>

          <div className={`${styles.callout} ${styles.warn}`}>
            <strong>移行に関する注意:</strong> 旧来の <code>search_parameters</code> を使う Live
            Search API は2026年1月12日に廃止済みです。Responses API の <code>tools</code>{' '}
            パラメータへの移行が必須です。
          </div>

          <h3>7.3 Code Execution</h3>
          <p>
            サンドボックス化された Python
            環境でコードを実行し、正確な数値計算・データ分析・統計処理・シミュレーションを行います。
          </p>

          <div className={styles.codeLabel}>python</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk.tools{' '}
              <span className={styles.ck}>import</span> code_execution
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              chat = client.chat.create(model=
              <span className={styles.cs}>&quot;grok-4.3&quot;</span>, tools=[code_execution()])
            </div>
            <div className={styles.codeLine}>
              chat.append(user(
              <span className={styles.cs}>
                &quot;Calculate the compound interest for $10,000 at 5% annually for 10 years&quot;
              </span>
              ))
            </div>
          </div>

          <p>
            <strong>ベストプラクティス:</strong>{' '}
            ①曖昧な指示ではなく具体的に指示する（例:「相関行列を計算し 0.7
            以上をハイライト」）。②データフォーマットと制約を明示する。③数値計算では temperature
            を低め（0.0〜0.3）に設定する。
          </p>
          <p className={styles.dim}>
            制約:
            ネットワーク・外部ファイルシステムへのアクセス不可、リクエスト間で状態は保持されない（ステートレス）、NumPy/Pandas/Matplotlib/SciPy
            等の主要ライブラリのみ利用可能。
          </p>

          <h3>7.4 Remote MCP Tools（Model Context Protocol）</h3>
          <p>
            外部の MCP サーバーに接続し、サードパーティ製・自社製のカスタムツール群を Grok
            に与えることができます。xAI 側が接続・実行を代行します。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>パラメータ</th>
                  <th>必須</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>server_url</code>
                  </td>
                  <td>✅</td>
                  <td>MCP サーバーの URL（Streaming HTTP / SSE のみ対応）</td>
                </tr>
                <tr>
                  <td>
                    <code>server_label</code>
                  </td>
                  <td>✅</td>
                  <td>サーバーを識別するラベル</td>
                </tr>
                <tr>
                  <td>
                    <code>allowed_tools</code>
                  </td>
                  <td>—</td>
                  <td>許可する特定ツール名のリスト（省略時は全ツール許可）</td>
                </tr>
                <tr>
                  <td>
                    <code>authorization</code>
                  </td>
                  <td>—</td>
                  <td>MCP サーバーへのリクエストに付与するトークン</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.codeLabel}>python</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk.tools{' '}
              <span className={styles.ck}>import</span> mcp
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>chat = client.chat.create(</div>
            <div className={styles.codeLine}>
              {'    '}model=<span className={styles.cs}>&quot;grok-4.3&quot;</span>,
            </div>
            <div className={styles.codeLine}>{'    '}tools=[</div>
            <div className={styles.codeLine}>
              {'        '}mcp(server_url=
              <span className={styles.cs}>&quot;https://mcp.deepwiki.com/mcp&quot;</span>,
              server_label=<span className={styles.cs}>&quot;deepwiki&quot;</span>),
            </div>
            <div className={styles.codeLine}>{'        '}mcp(</div>
            <div className={styles.codeLine}>
              {'            '}server_url=
              <span className={styles.cs}>&quot;https://your-custom-tools.com/mcp&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {'            '}server_label=<span className={styles.cs}>&quot;custom&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {'            '}allowed_tool_names=[
              <span className={styles.cs}>&quot;search_database&quot;</span>,{' '}
              <span className={styles.cs}>&quot;format_data&quot;</span>],
            </div>
            <div className={styles.codeLine}>{'        '}),</div>
            <div className={styles.codeLine}>{'    '}],</div>
            <div className={styles.codeLine}>)</div>
          </div>

          <div className={styles.callout}>
            <strong>ベストプラクティス:</strong> <code>allowed_tools</code>{' '}
            で必要最小限のツールに絞り、コンテキスト消費と意図しない書き込み操作のリスクを同時に削減します。複数サーバー使用時は{' '}
            <code>server_label</code>/<code>server_description</code> を明確にし、常に HTTPS +
            適切な認証を使用してください。なお xAI 自身も{' '}
            <Ext href="https://docs.x.ai/developers/docs-mcp">Docs MCP</Ext>（
            <code>https://docs.x.ai/api/mcp</code>）を公開しています。
          </div>

          <h3>7.5 ツール課金体系（概要）</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>単価</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Web Search / X Search / Code Execution</td>
                  <td>$5 / 1,000 回</td>
                </tr>
                <tr>
                  <td>File Attachments 検索</td>
                  <td>$10 / 1,000 回</td>
                </tr>
                <tr>
                  <td>Collections Search（RAG）</td>
                  <td>$2.50 / 1,000 回</td>
                </tr>
                <tr>
                  <td>Remote MCP Tools</td>
                  <td>呼び出し無料、トークンのみ課金</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.dim}>
            出典: <Ext href="https://docs.x.ai/developers/tools/web-search">Web Search</Ext> ／{' '}
            <Ext href="https://docs.x.ai/developers/tools/x-search">X Search</Ext> ／{' '}
            <Ext href="https://docs.x.ai/developers/tools/code-execution">Code Execution</Ext> ／{' '}
            <Ext href="https://docs.x.ai/developers/tools/remote-mcp">Remote MCP Tools</Ext> ／{' '}
            <Ext href="https://docs.x.ai/developers/pricing">Pricing</Ext>（すべて xAI Docs）
          </p>
        </section>

        {/* 8. Multi-agent Research */}
        <section className={styles.block} id="sec-8">
          <h2>
            <span className={styles.num}>08</span> Realtime Multi-agent Research{' '}
            <span className={styles.badge}>BETA</span>
          </h2>
          <p>
            <code>grok-4.20-multi-agent</code> は、複数の AI
            エージェントがリアルタイムに協調してディープリサーチを行う機能です。各エージェントが検索・分析・統合など役割を分担し、
            <strong>リーダーエージェント</strong>が議論を統合して最終回答を生成します。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_7} />
          </div>

          <div className={`${styles.callout} ${styles.warn}`}>
            <strong>重要な制約:</strong>{' '}
            ユーザーに返るのはリーダーエージェントのツール呼び出しと最終回答のみ。サブエージェントの中間状態は暗号化され{' '}
            <code>use_encrypted_content=True</code>{' '}
            指定時のみ保持されます。クライアントサイドのカスタムツール（Function
            Calling）は非対応、Chat Completions API も非対応、
            <code>max_tokens</code> パラメータも非対応です。
          </div>

          <h3>8.1 エージェント数の制御</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>SDK/API</th>
                  <th>パラメータ</th>
                  <th>4エージェント</th>
                  <th>16エージェント</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>xAI SDK</td>
                  <td>
                    <code>agent_count</code>
                  </td>
                  <td>
                    <code>4</code>
                  </td>
                  <td>
                    <code>16</code>
                  </td>
                </tr>
                <tr>
                  <td>OpenAI SDK / REST</td>
                  <td>
                    <code>reasoning.effort</code>
                  </td>
                  <td>
                    <code>low/medium</code>
                  </td>
                  <td>
                    <code>high/xhigh</code>
                  </td>
                </tr>
                <tr>
                  <td>Vercel AI SDK</td>
                  <td>
                    <code>reasoningEffort</code>
                  </td>
                  <td>
                    <code>low/medium</code>
                  </td>
                  <td>
                    <code>high/xhigh</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.codeLabel}>python</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk{' '}
              <span className={styles.ck}>import</span> Client
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk.chat{' '}
              <span className={styles.ck}>import</span> user
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              client = Client(api_key=<span className={styles.cs}>&quot;...&quot;</span>)
            </div>
            <div className={styles.codeLine}>
              chat = client.chat.create(model=
              <span className={styles.cs}>&quot;grok-4.20-multi-agent&quot;</span>, agent_count=4)
            </div>
            <div className={styles.codeLine}>
              chat.append(user(
              <span className={styles.cs}>
                &quot;What are the key differences between TCP and UDP?&quot;
              </span>
              ))
            </div>
          </div>

          <p>
            使い分け:
            4エージェント＝素早く焦点を絞ったリサーチ、16エージェント＝深い多角的分析（トークン消費・レイテンシは大幅増）。
          </p>

          <h3>8.2 プロンプト設計のベストプラクティス</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>パターン</th>
                  <th>❌ 避けるべき例</th>
                  <th>✅ 推奨される例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>範囲と深さを明示する</td>
                  <td>&quot;Tell me about electric vehicles.&quot;</td>
                  <td>
                    &quot;Compare the top 3 EV manufacturers by battery technology, range, charging
                    infrastructure, and 2025 sales projections.&quot;
                  </td>
                </tr>
                <tr>
                  <td>構造化出力を要求する</td>
                  <td>—</td>
                  <td>
                    &quot;Present your findings as a comparison table with categories: scalability,
                    complexity, deployment, team size.&quot;
                  </td>
                </tr>
                <tr>
                  <td>ソースや観点を指定する</td>
                  <td>—</td>
                  <td>
                    &quot;Cite recent academic papers and industry reports from 2024-2025.&quot;
                  </td>
                </tr>
                <tr>
                  <td>複雑な調査は会話で分割する</td>
                  <td>1発の巨大プロンプトに全部詰め込む</td>
                  <td>Turn 1 で概観 → Turn 2 で深掘り → Turn 3 で個別課題を掘り下げる</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.dim}>
            出典:{' '}
            <Ext href="https://docs.x.ai/developers/model-capabilities/text/multi-agent">
              Multi Agent | xAI Docs
            </Ext>
          </p>
        </section>

        {/* 9. Prompt Caching */}
        <section className={styles.block} id="sec-9">
          <h2>
            <span className={styles.num}>09</span> Prompt Caching によるコスト・レイテンシ最適化
          </h2>
          <p>
            xAI API はプロンプトキャッシュを<strong>自動的に</strong>
            行います。リクエストが届くと、メッセージ配列の先頭からどこまで前回のリクエストと一致するかをチェックし、一致した「プレフィックス」部分をキャッシュから再利用します。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_8} />
          </div>

          <h3>9.1 キャッシュヒット率を最大化する</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>手法</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>x-grok-conv-id</code> ヘッダー
                  </td>
                  <td>
                    同一会話 ID
                    のリクエストを同一サーバーにルーティングし、キャッシュ再利用率を高める
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>prompt_cache_key</code>（Responses API）
                  </td>
                  <td>
                    <code>x-grok-conv-id</code> と同等の効果。安定した UUID を使う
                  </td>
                </tr>
                <tr>
                  <td>先頭メッセージを変更しない</td>
                  <td>
                    既存メッセージの編集・削除・並べ替えは即座にキャッシュを破棄させる。新規メッセージは必ず末尾に追記
                  </td>
                </tr>
                <tr>
                  <td>静的コンテンツを前方に配置する</td>
                  <td>システムプロンプト・Few-shot例・参照ドキュメントは会話の先頭に置く</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.codeLabel}>python — Responses API</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>response = client.responses.create(</div>
            <div className={styles.codeLine}>
              {'    '}model=<span className={styles.cs}>&quot;grok-4.5&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {'    '}input=<span className={styles.cs}>&quot;What is prompt caching?&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {'    '}extra_body=&#123;
              <span className={styles.cs}>&quot;prompt_cache_key&quot;</span>:{' '}
              <span className={styles.cs}>&quot;b79ad29b-b3f9-463c-bca6-041d5058d366&quot;</span>
              &#125;,
            </div>
            <div className={styles.codeLine}>)</div>
            <div className={styles.codeLine}>
              print(f
              <span className={styles.cs}>
                &quot;Cached tokens:
                &#123;response.usage.input_tokens_details.cached_tokens&#125;&quot;
              </span>
              )
            </div>
          </div>

          <div className={styles.codeLabel}>bash — x-grok-conv-id ヘッダー</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>curl https://api.x.ai/v1/chat/completions \</div>
            <div className={styles.codeLine}>
              {'  '}-H <span className={styles.cs}>&quot;Content-Type: application/json&quot;</span>{' '}
              \
            </div>
            <div className={styles.codeLine}>
              {'  '}-H{' '}
              <span className={styles.cs}>&quot;Authorization: Bearer $XAI_API_KEY&quot;</span> \
            </div>
            <div className={styles.codeLine}>
              {'  '}-H <span className={styles.cs}>&quot;x-grok-conv-id: conv_abc123&quot;</span> \
            </div>
            <div className={styles.codeLine}>{'  '}-d &#123;</div>
            <div className={styles.codeLine}>
              {'    '}
              <span className={styles.cs}>&quot;model&quot;</span>:{' '}
              <span className={styles.cs}>&quot;grok-4.5&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {'    '}
              <span className={styles.cs}>&quot;messages&quot;</span>: [
            </div>
            <div className={styles.codeLine}>
              {'      '}&#123;<span className={styles.cs}>&quot;role&quot;</span>:{' '}
              <span className={styles.cs}>&quot;system&quot;</span>,{' '}
              <span className={styles.cs}>&quot;content&quot;</span>:{' '}
              <span className={styles.cs}>&quot;You are Grok, built by xAI.&quot;</span>&#125;,
            </div>
            <div className={styles.codeLine}>
              {'      '}&#123;<span className={styles.cs}>&quot;role&quot;</span>:{' '}
              <span className={styles.cs}>&quot;user&quot;</span>,{' '}
              <span className={styles.cs}>&quot;content&quot;</span>:{' '}
              <span className={styles.cs}>&quot;What is prompt caching?&quot;</span>&#125;
            </div>
            <div className={styles.codeLine}>{'    '}]</div>
            <div className={styles.codeLine}>{'  '}&#125;</div>
          </div>

          <h3>9.2 FAQ（要点）</h3>
          <ul>
            <li>キャッシュは出力内容に影響しない（プロンプト処理フェーズの高速化のみ）。</li>
            <li>キャッシュエントリはサーバー負荷等でいつでも破棄され得る。100%保証ではない。</li>
            <li>ストリーミング・非ストリーミング両方で機能する。</li>
            <li>
              ツール呼び出し結果を含むメッセージまでがキャッシュ可能プレフィックスに含まれる。
            </li>
            <li>
              <code>cached_tokens</code> が常に <code>0</code> の場合は、会話 ID
              の設定漏れやメッセージ改変を疑う。
            </li>
          </ul>

          <p className={styles.dim}>
            出典:{' '}
            <Ext href="https://docs.x.ai/developers/advanced-api-usage/prompt-caching">
              Prompt Caching
            </Ext>{' '}
            ／{' '}
            <Ext href="https://docs.x.ai/developers/advanced-api-usage/prompt-caching/how-it-works">
              How It Works
            </Ext>{' '}
            ／{' '}
            <Ext href="https://docs.x.ai/developers/advanced-api-usage/prompt-caching/maximizing-cache-hits">
              Maximizing Cache Hits
            </Ext>{' '}
            ／{' '}
            <Ext href="https://docs.x.ai/developers/advanced-api-usage/prompt-caching/best-practices">
              Best Practices &amp; FAQ
            </Ext>
            （すべて xAI Docs）
          </p>
        </section>

        {/* 10. Context Compaction */}
        <section className={styles.block} id="sec-10">
          <h2>
            <span className={styles.num}>10</span> Context Compaction による長時間会話の管理
          </h2>
          <p>
            会話が数千トークンを超えて成長すると、フォローアップのたびに全メッセージを再送信し続けることになり、入力コストとレイテンシが増大します。
            <strong>Context Compaction</strong>{' '}
            は会話を単一の不透明（opaque）なアイテムに圧縮する機能です。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_9} />
          </div>

          <h3>10.1 いつ圧縮すべきか</h3>
          <p>
            以下の<strong>すべて</strong>が真の場合に圧縮を検討します。
          </p>
          <ul>
            <li>
              各呼び出しの <code>input_tokens</code> がコスト・レイテンシを圧迫している
            </li>
            <li>それでも過去のターンをモデルに覚えていてほしい</li>
            <li>
              現在の会話がまだモデルのコンテキスト上限に収まっている（圧縮は「縮小」であり、すでに上限超過したリクエストは救済できない）
            </li>
          </ul>

          <h3>10.2 実装例（in-place 圧縮）</h3>
          <div className={styles.codeLabel}>python</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>import</span> os
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk{' '}
              <span className={styles.ck}>import</span> Client
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> xai_sdk.chat{' '}
              <span className={styles.ck}>import</span> system, user
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              client = Client(api_key=os.environ[
              <span className={styles.cs}>&quot;XAI_API_KEY&quot;</span>])
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              chat = client.chat.create(model=
              <span className={styles.cs}>&quot;grok-4.3&quot;</span>, use_encrypted_content=
              <span className={styles.ck}>True</span>)
            </div>
            <div className={styles.codeLine}>
              chat.append(system(
              <span className={styles.cs}>
                &quot;You are a helpful assistant. Keep answers brief.&quot;
              </span>
              ))
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>compact_every = 5</div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>for</span> turn <span className={styles.ck}>in</span>{' '}
              range(1, 100):
            </div>
            <div className={styles.codeLine}>
              {'    '}chat.append(user(input(<span className={styles.cs}>&quot;You: &quot;</span>)))
            </div>
            <div className={styles.codeLine}>{'    '}response = chat.sample()</div>
            <div className={styles.codeLine}>{'    '}chat.append(response)</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              {'    '}
              <span className={styles.ck}>if</span> turn % compact_every == 0:
            </div>
            <div className={styles.codeLine}>{'        '}before = len(chat.messages)</div>
            <div className={styles.codeLine}>{'        '}compact = chat.compact()</div>
            <div className={styles.codeLine}>
              {'        '}print(f
              <span className={styles.cs}>
                &quot;[compacted &#123;before&#125; -&gt; &#123;len(chat.messages)&#125; messages |
                dropped &#123;compact.dropped_message_count&#125; | tokens:
                &#123;compact.usage.total_tokens&#125;]&quot;
              </span>
              )
            </div>
          </div>

          <div className={`${styles.callout} ${styles.warn}`}>
            <strong>制約:</strong> 1リクエストにつき圧縮は1パスのみ。<code>encrypted_content</code>{' '}
            は不透明として扱い、パース・編集・手動マージをしてはならない。常に <code>output</code>{' '}
            配列全体をそのまま次のリクエストに渡すこと。
          </div>

          <p className={styles.dim}>
            出典:{' '}
            <Ext href="https://docs.x.ai/developers/advanced-api-usage/context-compaction">
              Context Compaction | xAI Docs
            </Ext>
          </p>
        </section>

        {/* 11. レート制限 */}
        <section className={styles.block} id="sec-11">
          <h2>
            <span className={styles.num}>11</span> レート制限とエラーハンドリング
          </h2>
          <p>
            各チームは <strong>RPS</strong>（Requests Per Second）と <strong>TPM</strong>（Tokens
            Per
            Minute）の2軸でモデルごとの上限を持ちます。上限は2026年1月1日以降の累積課金額に基づく「Tier」によって段階的に引き上げられ、一度到達した
            Tier は永続的に維持されます。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>累積課金額の閾値</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tier 0</td>
                  <td>$0（デフォルト）</td>
                </tr>
                <tr>
                  <td>Tier 1</td>
                  <td>$50</td>
                </tr>
                <tr>
                  <td>Tier 2</td>
                  <td>$250</td>
                </tr>
                <tr>
                  <td>Tier 3</td>
                  <td>$1,000</td>
                </tr>
                <tr>
                  <td>Tier 4</td>
                  <td>$5,000</td>
                </tr>
                <tr>
                  <td>Enterprise</td>
                  <td>個別相談</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            11.1 <code>grok-4.5</code> のレート制限例
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>RPS</th>
                  <th>TPM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>T0</td>
                  <td>150</td>
                  <td>50M</td>
                </tr>
                <tr>
                  <td>T1</td>
                  <td>172</td>
                  <td>53M</td>
                </tr>
                <tr>
                  <td>T2</td>
                  <td>208</td>
                  <td>60M</td>
                </tr>
                <tr>
                  <td>T3</td>
                  <td>312</td>
                  <td>74M</td>
                </tr>
                <tr>
                  <td>T4</td>
                  <td>500</td>
                  <td>100M</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.dim}>
            TPM
            にはプロンプトトークン・出力トークン・推論トークン・キャッシュされたトークン（割引単価でも
            TPM 自体にはカウントされる）すべてが含まれます。
          </p>

          <h3>11.2 エラーハンドリング設計</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_10} />
          </div>

          <div className={styles.codeLabel}>python — 指数バックオフ</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>import</span> os, time
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> openai{' '}
              <span className={styles.ck}>import</span> OpenAI, RateLimitError
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              client = OpenAI(base_url=
              <span className={styles.cs}>&quot;https://api.x.ai/v1&quot;</span>, api_key=os.getenv(
              <span className={styles.cs}>&quot;XAI_API_KEY&quot;</span>))
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              <span className={styles.ck}>def</span> request_with_backoff(messages, max_retries=5):
            </div>
            <div className={styles.codeLine}>
              {'    '}
              <span className={styles.ck}>for</span> attempt <span className={styles.ck}>in</span>{' '}
              range(max_retries):
            </div>
            <div className={styles.codeLine}>
              {'        '}
              <span className={styles.ck}>try</span>:
            </div>
            <div className={styles.codeLine}>
              {'            '}
              <span className={styles.ck}>return</span> client.chat.completions.create(model=
              <span className={styles.cs}>&quot;grok-4.5&quot;</span>, messages=messages)
            </div>
            <div className={styles.codeLine}>
              {'        '}
              <span className={styles.ck}>except</span> RateLimitError:
            </div>
            <div className={styles.codeLine}>{'            '}time.sleep(2 ** attempt)</div>
            <div className={styles.codeLine}>
              {'    '}
              <span className={styles.ck}>raise</span>
            </div>
          </div>

          <p className={styles.dim}>
            出典: <Ext href="https://docs.x.ai/developers/rate-limits">Rate Limits | xAI Docs</Ext>
          </p>
        </section>

        {/* 12. コスト最適化 */}
        <section className={styles.block} id="sec-12">
          <h2>
            <span className={styles.num}>12</span> コスト最適化戦略
          </h2>

          <h3>12.1 Batch API（非同期処理割引）</h3>
          <p>
            リアルタイム性が不要な大量処理は Batch API で最大 <strong>20%</strong>{' '}
            の割引を受けられます（対象: <code>grok-4.3</code>, <code>grok-4.20-0309-reasoning</code>
            , <code>grok-4.20-0309-non-reasoning</code>, <code>grok-4.20-multi-agent-0309</code>）。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>リアルタイム API</th>
                  <th>Batch API</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>トークン単価</td>
                  <td>標準料金</td>
                  <td>モデルにより最大20%割引</td>
                </tr>
                <tr>
                  <td>応答時間</td>
                  <td>即時（秒単位）</td>
                  <td>通常24時間以内</td>
                </tr>
                <tr>
                  <td>レート制限</td>
                  <td>適用される</td>
                  <td>カウントされない</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>12.2 Priority Processing（優先処理）</h3>
          <p>
            低レイテンシが必要なリクエストは標準料金の <strong>2倍</strong>{' '}
            を支払うことで優先スケジューリングを受けられます。レスポンスの <code>service_tier</code>{' '}
            が <code>&quot;priority&quot;</code>{' '}
            になっている場合のみ優先料金が課金される点に注意してください。画像/動画生成・Batch API
            には非対応です。
          </p>

          <h3>12.3 コスト最適化フローチャート</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_11} />
          </div>

          <p className={styles.dim}>
            出典: <Ext href="https://docs.x.ai/developers/pricing">Pricing | xAI Docs</Ext>
          </p>
        </section>

        {/* 13. セキュリティ運用 */}
        <section className={styles.block} id="sec-13">
          <h2>
            <span className={styles.num}>13</span> セキュリティと運用上の注意点
          </h2>

          <h3>13.1 Remote MCP Tools のリスク管理</h3>
          <ul>
            <li>
              <strong>最小権限化</strong>: <code>allowed_tools</code>{' '}
              で必要なものだけを許可し、意図しない書き込み操作のリスクとコンテキスト消費を削減する。
            </li>
            <li>
              <strong>HTTPS + 認証必須</strong>: 自社 MCP サーバーを公開する場合は必ず HTTPS と{' '}
              <code>authorization</code> トークンで認証する。
            </li>
            <li>
              <strong>サードパーティ MCP サーバーの信頼性評価</strong>: 外部が公開する MCP
              サーバーの提供元の信頼性とツールの権限範囲を事前に確認する。
            </li>
          </ul>

          <h3>13.2 Code Execution のセキュリティモデル</h3>
          <p>
            実行はサンドボックス化された隔離環境で行われ、外部ネットワーク・ファイルシステムへのアクセスは不可。実行コンテキストはリクエスト間で永続化されない（ステートレス）ため、機密データを保持させ続ける設計は不可能です。
          </p>

          <h3>13.3 Function Calling 実装時の防御的プログラミング</h3>
          <ul>
            <li>
              モデルが生成した引数は<strong>信頼できない入力</strong>
              として扱い、実行前にバリデーションする。
            </li>
            <li>ツール名が想定外の場合はエラーを返す実装にする。</li>
            <li>
              副作用のあるツール（SQL実行・ファイル書き込み・外部API呼び出し）には権限スコープを最小化した専用認証情報を使う。
            </li>
          </ul>

          <div className={`${styles.callout} ${styles.warn}`}>
            <strong>課金上の注意:</strong> xAI
            のシステムが利用ガイドライン違反と判定したリクエストは、生成前に検出された場合でも{' '}
            <strong>$0.05 の違反手数料</strong>が課金されます。
          </div>

          <p className={styles.dim}>
            出典: <Ext href="https://docs.x.ai/developers/tools/remote-mcp">Remote MCP Tools</Ext>{' '}
            ／ <Ext href="https://docs.x.ai/developers/tools/code-execution">Code Execution</Ext> ／{' '}
            <Ext href="https://docs.x.ai/developers/pricing">Pricing</Ext>（すべて xAI Docs）
          </p>
        </section>

        {/* 14. 導入チェックリスト */}
        <section className={styles.block} id="sec-14">
          <h2>
            <span className={styles.num}>14</span> 本番導入前チェックリスト
          </h2>

          <ul className={styles.checklist}>
            <li>
              <label>
                <input type="checkbox" disabled /> モデル選定: <code>grok-4.5</code>（汎用）/{' '}
                <code>grok-4.3</code>
                （長文脈・低コスト）/ <code>grok-4.20-multi-agent</code>
                （ディープリサーチ）を用途で使い分けたか
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" disabled /> <code>reasoning_effort</code>{' '}
                をタスクの複雑さに応じて明示的に設定したか（無効化不可な点に注意）
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" disabled /> Structured Outputs
                のスキーマ制約を把握し、必要なら二重検証を実装したか
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" disabled /> Function Calling
                のツール引数をアプリケーション側でバリデーションしているか
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" disabled /> Web Search / X Search の{' '}
                <code>allowed_domains</code>/<code>excluded_domains</code>{' '}
                でスコープを制限しているか
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" disabled /> Remote MCP Tools に <code>allowed_tools</code>{' '}
                で最小権限を設定したか
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" disabled /> <code>x-grok-conv-id</code> または{' '}
                <code>prompt_cache_key</code> を設定し、<code>cached_tokens</code>{' '}
                で効果を確認したか
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" disabled /> 長時間会話に対して Context Compaction
                の導入を検討したか
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" disabled /> 429 エラーに対する指数バックオフを実装したか
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" disabled /> チームの Rate Limit Tier と RPS/TPM
                上限を把握し、負荷試験を行ったか
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" disabled /> Batch API / Priority Processing
                の使い分け基準をワークロードごとに定義したか
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" disabled /> コスト監視: <code>usage</code> と{' '}
                <code>server_side_tool_usage</code> を継続的にロギングしているか
              </label>
            </li>
          </ul>
        </section>

        {/* 15. 参考文献 */}
        <section className={styles.block} id="sec-15">
          <h2>
            <span className={styles.num}>15</span> 参考文献一覧
          </h2>
          <p>
            本ガイドの内容はすべて以下の xAI
            公式ドキュメント（2026年7月時点）および公式サイトを参照して作成しています。
          </p>

          <div className={styles.refs}>
            <ul>
              <li>
                <span className={styles.label}>Grok 公式サイト</span>
                <Ext href="https://grok.com/">https://grok.com/</Ext>
              </li>
              <li>
                <span className={styles.label}>xAI Docs トップ</span>
                <Ext href="https://docs.x.ai/overview">https://docs.x.ai/overview</Ext>
              </li>
              <li>
                <span className={styles.label}>Quickstart</span>
                <Ext href="https://docs.x.ai/developers/quickstart">
                  https://docs.x.ai/developers/quickstart
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Models</span>
                <Ext href="https://docs.x.ai/developers/models">
                  https://docs.x.ai/developers/models
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Pricing</span>
                <Ext href="https://docs.x.ai/developers/pricing">
                  https://docs.x.ai/developers/pricing
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Reasoning</span>
                <Ext href="https://docs.x.ai/developers/model-capabilities/text/reasoning">
                  https://docs.x.ai/developers/model-capabilities/text/reasoning
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Structured Outputs</span>
                <Ext href="https://docs.x.ai/developers/model-capabilities/text/structured-outputs">
                  https://docs.x.ai/developers/model-capabilities/text/structured-outputs
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Multi Agent</span>
                <Ext href="https://docs.x.ai/developers/model-capabilities/text/multi-agent">
                  https://docs.x.ai/developers/model-capabilities/text/multi-agent
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Function Calling</span>
                <Ext href="https://docs.x.ai/developers/tools/function-calling">
                  https://docs.x.ai/developers/tools/function-calling
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Tools Overview</span>
                <Ext href="https://docs.x.ai/docs/guides/tools/overview">
                  https://docs.x.ai/docs/guides/tools/overview
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Advanced Tool Usage</span>
                <Ext href="https://docs.x.ai/docs/guides/tools/advanced-usage">
                  https://docs.x.ai/docs/guides/tools/advanced-usage
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Web Search</span>
                <Ext href="https://docs.x.ai/developers/tools/web-search">
                  https://docs.x.ai/developers/tools/web-search
                </Ext>
              </li>
              <li>
                <span className={styles.label}>X Search</span>
                <Ext href="https://docs.x.ai/developers/tools/x-search">
                  https://docs.x.ai/developers/tools/x-search
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Code Execution</span>
                <Ext href="https://docs.x.ai/developers/tools/code-execution">
                  https://docs.x.ai/developers/tools/code-execution
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Remote MCP Tools</span>
                <Ext href="https://docs.x.ai/developers/tools/remote-mcp">
                  https://docs.x.ai/developers/tools/remote-mcp
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Docs MCP</span>
                <Ext href="https://docs.x.ai/developers/docs-mcp">
                  https://docs.x.ai/developers/docs-mcp
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Prompt Caching（総論）</span>
                <Ext href="https://docs.x.ai/developers/advanced-api-usage/prompt-caching">
                  https://docs.x.ai/developers/advanced-api-usage/prompt-caching
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Prompt Caching — How It Works</span>
                <Ext href="https://docs.x.ai/developers/advanced-api-usage/prompt-caching/how-it-works">
                  https://docs.x.ai/developers/advanced-api-usage/prompt-caching/how-it-works
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Prompt Caching — Maximizing Cache Hits</span>
                <Ext href="https://docs.x.ai/developers/advanced-api-usage/prompt-caching/maximizing-cache-hits">
                  https://docs.x.ai/developers/advanced-api-usage/prompt-caching/maximizing-cache-hits
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Prompt Caching — What Breaks Caching</span>
                <Ext href="https://docs.x.ai/developers/advanced-api-usage/prompt-caching/multi-turn">
                  https://docs.x.ai/developers/advanced-api-usage/prompt-caching/multi-turn
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Prompt Caching — Best Practices &amp; FAQ</span>
                <Ext href="https://docs.x.ai/developers/advanced-api-usage/prompt-caching/best-practices">
                  https://docs.x.ai/developers/advanced-api-usage/prompt-caching/best-practices
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Context Compaction</span>
                <Ext href="https://docs.x.ai/developers/advanced-api-usage/context-compaction">
                  https://docs.x.ai/developers/advanced-api-usage/context-compaction
                </Ext>
              </li>
              <li>
                <span className={styles.label}>Rate Limits</span>
                <Ext href="https://docs.x.ai/developers/rate-limits">
                  https://docs.x.ai/developers/rate-limits
                </Ext>
              </li>
            </ul>
          </div>

          <footer className={styles.pageFooter}>
            xAI
            のドキュメントは頻繁に更新されます。本番導入前には必ず上記リンクから最新版をご確認ください。
            <br />
            Generated: 2026年7月15日時点の公開情報に基づく。
          </footer>
        </section>
      </main>
    </div>
  );
}
