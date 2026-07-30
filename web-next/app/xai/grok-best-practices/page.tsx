import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "xAI の LLM（Grok）完全ガイド ― 初学者のためのベストプラクティス",
  description:
    "xAI API（Grok モデル群）をこれから使い始めるエンジニア・QAエンジニア向けに、モデル選定からセキュリティ運用まで、ステップバイステップで解説します。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const MERMAID_DIAGRAM_1 = `flowchart TD
A["xAIアカウント作成<br/>accounts.x.ai"] --> B["APIキー発行<br/>console.x.ai"]
B --> C["クレジットのチャージ"]
C --> D["SDKのインストール<br/>xai-sdk / openai"]
D --> E["最初のリクエスト送信"]
E --> F{"用途に応じて<br/>機能を追加"}
F --> G["Reasoning<br/>推論効果の調整"]
F --> H["Function Calling<br/>外部ツール連携"]
F --> I["Structured Outputs<br/>構造化データ抽出"]
F --> J["Web/X Search<br/>リアルタイム情報取得"]
G --> K["本番運用の最適化"]
H --> K
I --> K
J --> K
K --> L["Prompt Caching<br/>コスト・遅延の削減"]
K --> M["Rate Limit 対策<br/>リトライ設計"]
K --> N["セキュリティ設定<br/>鍵管理・ZDR"]`;

const MERMAID_DIAGRAM_2 = `flowchart TD
Start["タスクの性質を確認"] --> Q1{"レイテンシが最優先か"}
Q1 -- はい --> Low["reasoning_effort = low"]
Q1 -- いいえ --> Q2{"複雑なデータ分析\n長文コンテキストか"}
Q2 -- はい --> Med["reasoning_effort = medium"]
Q2 -- いいえ --> Q3{"数学の証明\n多段階ロジック\n競技レベルの難問か"}
Q3 -- はい --> High["reasoning_effort = high（デフォルト）"]
Q3 -- いいえ --> Med`;

const MERMAID_DIAGRAM_3 = `sequenceDiagram
participant Dev as 開発者アプリ
participant Grok as Grokモデル
Dev->>Grok: ツール定義付きのユーザークエリを送信
Grok-->>Dev: tool_call を返す
Dev->>Dev: 関数をローカルで実行
Dev->>Grok: 実行結果を返送
Grok-->>Dev: 最終的な自然言語の回答`;

const MERMAID_DIAGRAM_4 = `flowchart TD
A["APIリクエスト送信"] --> B{"HTTPステータス"}
B -- 200 OK --> C["正常にレスポンス処理"]
B -- 429 Too Many Requests --> D{"リトライ回数が上限未満か"}
D -- はい --> E["指数バックオフで待機（2の attempt 乗 秒）"]
E --> A
D -- いいえ --> F["エラーとしてアプリ側で処理"]
B -- 400 Bad Request --> G["スキーマ・パラメータを見直して修正"]`;

const MERMAID_DIAGRAM_5 = `flowchart LR
A["曖昧な指示"] --> B["タスクを明確に定義"]
B --> C["制約・出力形式を明示"]
C --> D["構造化されたマークアップで区切る"]
D --> E["ツール利用の判断基準を<br/>システムプロンプトで指定"]
E --> F["まず小さく試し、<br/>結果を見て反復改善"]
F --> G["高品質な出力"]`;

export default function GrokBestPracticesPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <i className="ti ti-bolt" style={{ color: "var(--c-teal-500)", fontSize: "20px" }} />
          <span className={styles.sidebarBrandTitle}>xAI Grok Guide</span>
        </div>
        <nav>
          <div className={styles.navGroupTitle}>概要 &amp; 導入</div>
          <a className={styles.navLink} href="#overview">
            <i className="ti ti-info-circle" />
            0. xAI と Grok とは
          </a>
          <a className={styles.navLink} href="#workflow">
            <i className="ti ti-route" />
            1. 利用開始ワークフロー
          </a>

          <div className={styles.navGroupTitle}>ステップバイステップ</div>
          <a className={styles.navLink} href="#step1">
            <i className="ti ti-box" />
            Step1: モデルを選ぶ
          </a>
          <a className={styles.navLink} href="#step2">
            <i className="ti ti-key" />
            Step2: アカウント &amp; キー
          </a>
          <a className={styles.navLink} href="#step3">
            <i className="ti ti-code" />
            Step3: SDK &amp; リクエスト
          </a>
          <a className={styles.navLink} href="#step4">
            <i className="ti ti-brain" />
            Step4: Reasoning モデル
          </a>
          <a className={styles.navLink} href="#step5">
            <i className="ti ti-tools" />
            Step5: Function Calling
          </a>
          <a className={styles.navLink} href="#step6">
            <i className="ti ti-brackets" />
            Step6: Structured Outputs
          </a>
          <a className={styles.navLink} href="#step7">
            <i className="ti ti-world" />
            Step7: Web &amp; X 検索
          </a>
          <a className={styles.navLink} href="#step8">
            <i className="ti ti-database" />
            Step8: Prompt Caching
          </a>
          <a className={styles.navLink} href="#step9">
            <i className="ti ti-arrows-minimize" />
            Step9: Context Compaction
          </a>
          <a className={styles.navLink} href="#step10">
            <i className="ti ti-refresh-alert" />
            Step10: レート制限
          </a>
          <a className={styles.navLink} href="#step11">
            <i className="ti ti-coin" />
            Step11: 料金体系
          </a>

          <div className={styles.navGroupTitle}>ガバナンス</div>
          <a className={styles.navLink} href="#security">
            <i className="ti ti-shield-lock" />
            セキュリティ/プライバシー
          </a>
          <a className={styles.navLink} href="#prompting">
            <i className="ti ti-message-2" />
            プロンプト設計
          </a>
          <a className={styles.navLink} href="#antipatterns">
            <i className="ti ti-alert-triangle" />
            アンチパターン
          </a>
          <a className={styles.navLink} href="#checklist">
            <i className="ti ti-checklist" />
            チェックリスト
          </a>
          <a className={styles.navLink} href="#references">
            <i className="ti ti-books" />
            参考資料
          </a>
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.eyebrow}>
            <i className="ti ti-bolt" />
            AI ENGINEERING GUIDE
          </div>
          <h1>xAI の LLM（Grok）完全ガイド ― 初学者のためのベストプラクティス</h1>
          <p className={styles.lead}>
            xAI API（Grok
            モデル群）をこれから使い始めるエンジニア・QAエンジニア向けに、モデル選定からセキュリティ運用まで、ステップバイステップで解説します。
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaChip}>
              <i className="ti ti-calendar" />
              情報時点: 2026年7月15日
            </span>
            <span className={styles.metaChip}>
              <i className="ti ti-users" />
              対象: 初学者〜中級エンジニア
            </span>
            <span className={styles.metaChip}>
              <i className="ti ti-brand-python" />
              コード例: Python 中心
            </span>
            <span className={styles.metaChip}>
              <i className="ti ti-link" />
              出典: docs.x.ai 公式ドキュメント
            </span>
          </div>
        </div>

        <section className={styles.docSection} id="overview">
          <h2>
            <i className="ti ti-info-circle" />
            0. xAI と Grok とは
          </h2>
          <p>
            xAI は Grok シリーズの
            LLM（大規模言語モデル）を開発する企業です。2026年7月時点で、公式ドキュメントサイト（docs.x.ai）上のブランド表記は「
            <strong>SpaceXAI</strong>」となっています（ドメインや API エンドポイント自体は引き続き{" "}
            <code>x.ai</code> / <code>api.x.ai</code>{" "}
            のままです）。本ガイドでは実務上の表記に合わせて「xAI」「Grok」と記載します。
          </p>

          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <i
                className="ti ti-message-chatbot"
                style={{ fontSize: "24px", color: "var(--c-teal-500)" }}
              />
              <h4>Grok（コンシューマーアプリ）</h4>
              <p>チャット・画像生成・リアルタイム検索を行うエンドユーザー向けアシスタント。</p>
              <Ext href="https://grok.com/">
                <span className={styles.cardLink}>grok.com を開く →</span>
              </Ext>
            </div>
            <div className={styles.card}>
              <i className="ti ti-api" style={{ fontSize: "24px", color: "var(--c-teal-500)" }} />
              <h4>xAI API</h4>
              <p>開発者が自分のアプリケーションに Grok モデルを組み込むための REST / gRPC API。</p>
              <Ext href="https://docs.x.ai/overview">
                <span className={styles.cardLink}>docs.x.ai を開く →</span>
              </Ext>
            </div>
            <div className={styles.card}>
              <i className="ti ti-code" style={{ fontSize: "24px", color: "var(--c-teal-500)" }} />
              <h4>Grok Build</h4>
              <p>ターミナル・IDE 上で動く自律型コーディングエージェント（CLI）。</p>
              <Ext href="https://docs.x.ai/build/overview">
                <span className={styles.cardLink}>Build を開く →</span>
              </Ext>
            </div>
          </div>

          <p>
            本ガイドは主に <strong>xAI API</strong> を使ってアプリケーションに Grok
            を組み込む開発者を対象に、ステップバイステップでベストプラクティスを解説します。
          </p>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典: <Ext href="https://docs.x.ai/overview">docs.x.ai/overview</Ext> /{" "}
            <Ext href="https://grok.com/">grok.com</Ext>
          </div>
        </section>

        <section className={styles.docSection} id="workflow">
          <h2>
            <i className="ti ti-route" />
            1. 全体像を掴む：利用開始までのワークフロー
          </h2>
          <p>
            初めて xAI API
            に触れる場合、以下の流れで進めます。各ステップは後述のセクションで詳しく解説します。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_1} />
          </div>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典: <Ext href="https://docs.x.ai/developers/quickstart">Quickstart | xAI Docs</Ext>
            （最終更新 2026年7月3日）
          </div>
        </section>

        <section className={styles.docSection} id="step1">
          <h2>
            <span className={styles.stepNumber}>1</span>Step1：モデルを選ぶ
          </h2>
          <p>
            xAI は用途別に複数のモデルファミリーを提供しています。「何でも Grok 4.5
            を使えばよい」という単純な整理がされているのが大きな特徴です。
          </p>

          <h3>1.1 テキスト（チャット・コード）モデル比較表</h3>
          <table>
            <thead>
              <tr>
                <th>モデル</th>
                <th>コンテキスト長</th>
                <th>入力（1Mトークン）</th>
                <th>キャッシュ入力</th>
                <th>出力（1Mトークン）</th>
                <th>特徴</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>grok-4.5</strong>（フラッグシップ・最新）
                </td>
                <td>500k</td>
                <td>$2.00</td>
                <td>$0.50</td>
                <td>$6.00</td>
                <td>エージェント型ツール呼び出し、幻覚が少ない、推論強度を調整可能</td>
              </tr>
              <tr>
                <td>grok-4.3</td>
                <td>1M</td>
                <td>$1.25</td>
                <td>$0.20</td>
                <td>$2.50</td>
                <td>長文コンテキスト向け</td>
              </tr>
              <tr>
                <td>grok-4.20-0309-reasoning / non-reasoning</td>
                <td>1M</td>
                <td>$1.25</td>
                <td>$0.20</td>
                <td>$2.50</td>
                <td>推論あり／なしを選択可能</td>
              </tr>
              <tr>
                <td>grok-4.20-multi-agent-0309</td>
                <td>1M</td>
                <td>$1.25</td>
                <td>$0.20</td>
                <td>$2.50</td>
                <td>複数エージェント（4体 or 16体）が協調して回答を生成</td>
              </tr>
              <tr>
                <td>grok-build-0.1（Code API）</td>
                <td>256k</td>
                <td>$1.00</td>
                <td>$0.20</td>
                <td>$2.00</td>
                <td>エージェント的コーディング専用</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典: <Ext href="https://docs.x.ai/developers/models">Models | xAI Docs</Ext>
            （最終更新 2026年7月9日）、
            <Ext href="https://docs.x.ai/developers/pricing">Pricing | xAI Docs</Ext>
            （最終更新 2026年7月3日）
          </div>

          <h3>1.2 用途別モデル選定ガイド</h3>
          <table>
            <thead>
              <tr>
                <th>用途</th>
                <th>推奨モデル</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>コード生成・デバッグ</td>
                <td>grok-4.5</td>
              </tr>
              <tr>
                <td>一般的なチャット・質問応答</td>
                <td>grok-4.5</td>
              </tr>
              <tr>
                <td>画像生成</td>
                <td>Grok Imagine API（grok-imagine-image / grok-imagine-image-quality）</td>
              </tr>
              <tr>
                <td>動画生成</td>
                <td>Grok Imagine API（grok-imagine-video / grok-imagine-video-1.5）</td>
              </tr>
              <tr>
                <td>音声（リアルタイム会話・TTS・STT）</td>
                <td>Grok Voice API</td>
              </tr>
            </tbody>
          </table>

          <h3>1.3 モデル利用時の重要な注意点</h3>
          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className="ti ti-alert-triangle" />
            <div className={styles.calloutBody}>
              <div className={styles.calloutTitle}>初学者が特に見落としやすいポイント</div>
              Grok は学習データ以降の出来事を知りません。最新情報が必要な場合は Web Search / X
              Search ツールを有効化する必要があります。grok-4.5 の知識カットオフは{" "}
              <strong>2026年2月1日</strong> です。
            </div>
          </div>
          <ul>
            <li>
              画像入力は最大 <code>20MiB</code>、対応形式は <code>jpg/jpeg</code> または{" "}
              <code>png</code>。画像枚数の上限はありません。
            </li>
            <li>
              <code>grok-4.20</code> 以降のモデルでは <code>logprobs</code> /{" "}
              <code>top_logprobs</code>{" "}
              パラメータは無視されます（エラーにはならず黙って無視される点に注意）。
            </li>
            <li>
              モデル名には3種類のエイリアスがあります。<code>&lt;modelname&gt;</code> は最新安定版、
              <code>&lt;modelname&gt;-latest</code> は最新版全般、
              <code>&lt;modelname&gt;-&lt;date&gt;</code>{" "}
              は特定リリースに固定されます。再現性が必要なワークフローでは日付付きエイリアスを使うのがベストプラクティスです。
            </li>
          </ul>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典:{" "}
            <Ext href="https://docs.x.ai/developers/models#additional-information-regarding-models">
              Models | xAI Docs — Additional Information
            </Ext>
          </div>
        </section>

        <section className={styles.docSection} id="step2">
          <h2>
            <span className={styles.stepNumber}>2</span>Step2：アカウント作成と API キー発行
          </h2>
          <ol>
            <li>
              <Ext href="https://accounts.x.ai/sign-up?redirect=cloud-console">accounts.x.ai</Ext>{" "}
              でアカウントを作成し、クレジットをチャージします。
            </li>
            <li>
              <Ext href="https://console.x.ai/team/default/api-keys">
                console.x.ai の API Keys ページ
              </Ext>{" "}
              で API キーを発行します。
            </li>
            <li>環境変数として設定します。</li>
          </ol>

          <div className={styles.codeLabel}>bash</div>
          <pre className={styles.codeBlockPre}>
            <code>export XAI_API_KEY=&quot;your_api_key&quot;</code>
          </pre>

          <p>
            または <code>.env</code> ファイルに記載します。
          </p>
          <div className={styles.codeLabel}>bash（.env）</div>
          <pre className={styles.codeBlockPre}>
            <code>XAI_API_KEY=your_api_key</code>
          </pre>

          <div className={`${styles.callout} ${styles.calloutDanger}`}>
            <i className="ti ti-shield-lock" />
            <div className={styles.calloutBody}>
              <div className={styles.calloutTitle}>セキュリティ上の注意</div>
              API
              キーはパスワードやクレジットカード情報と同様に機密情報として扱ってください。チームメンバー間でキーを共有せず、環境変数やシークレット管理ツールで安全に保管し、公開リポジトリにコミットしないようにしてください（詳細はセクション13参照）。
            </div>
          </div>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典: <Ext href="https://docs.x.ai/developers/quickstart">Quickstart | xAI Docs</Ext>
          </div>
        </section>

        <section className={styles.docSection} id="step3">
          <h2>
            <span className={styles.stepNumber}>3</span>Step3：SDK インストールと最初のリクエスト
          </h2>
          <p>
            xAI API は独自の <code>xai-sdk</code> に加えて、<strong>OpenAI SDK 互換</strong>
            のエンドポイント（<code>base_url</code> を <code>https://api.x.ai/v1</code>{" "}
            に変更するだけ）も提供しています。既存の OpenAI
            向けコードベースがある場合、この互換性は大きなメリットです。
          </p>

          <h3>3.1 SDK インストール</h3>
          <div className={styles.codeLabel}>bash</div>
          <pre className={styles.codeBlockPre}>
            <code>
              pip install xai-sdk{"\n"}
              pip install openai{"\n"}
              npm install ai @ai-sdk/xai zod{"\n"}
              npm install openai
            </code>
          </pre>

          <h3>3.2 最初のリクエスト（Python / xai-sdk）</h3>
          <div className={styles.codeLabel}>python</div>
          <pre className={styles.codeBlockPre}>
            <code>
              import os{"\n"}
              from xai_sdk import Client{"\n"}
              from xai_sdk.chat import user{"\n\n"}
              client = Client(api_key=os.getenv(&quot;XAI_API_KEY&quot;)){"\n\n"}
              chat = client.chat.create(model=&quot;grok-4.5&quot;){"\n"}
              chat.append(user(&quot;Fix this function and explain the bug: function
              median(a)&#123;a.sort();return a[a.length/2]&#125;&quot;)){"\n\n"}
              print(chat.sample().content)
            </code>
          </pre>

          <h3>3.3 最初のリクエスト（OpenAI 互換 SDK）</h3>
          <div className={styles.codeLabel}>python</div>
          <pre className={styles.codeBlockPre}>
            <code>
              from openai import OpenAI{"\n\n"}
              client = OpenAI({"\n"}
              {"    "}api_key=&quot;&lt;YOUR_XAI_API_KEY_HERE&gt;&quot;,{"\n"}
              {"    "}base_url=&quot;https://api.x.ai/v1&quot;,{"\n"}){"\n\n"}
              response = client.responses.create({"\n"}
              {"    "}model=&quot;grok-4.5&quot;,{"\n"}
              {"    "}input=&quot;Fix this function and explain the bug: function
              median(a)&#123;a.sort();return a[a.length/2]&#125;&quot;,{"\n"}){"\n\n"}
              print(response.output_text)
            </code>
          </pre>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-bulb" />
            <div className={styles.calloutBody}>
              <div className={styles.calloutTitle}>ベストプラクティス</div>
              新規プロジェクトでは <code>/v1/responses</code>（Responses
              API）の利用が推奨されています。Chat
              Completions（レガシー）からの移行ガイドも用意されています。
            </div>
          </div>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典: <Ext href="https://docs.x.ai/developers/quickstart">Quickstart | xAI Docs</Ext>
            （最終更新 2026年7月3日）、
            <Ext href="https://docs.x.ai/developers/model-capabilities/text/comparison">
              Migrating to Responses API
            </Ext>
          </div>
        </section>

        <section className={styles.docSection} id="step4">
          <h2>
            <span className={styles.stepNumber}>4</span>Step4：Reasoning（推論）モデルを使いこなす
          </h2>
          <p>
            grok-4.5
            は回答前に「考える」推論モデルです。数学・論理パズル・複雑な分析タスクに強みがあります。
          </p>

          <h3>4.1 reasoning_effort パラメータ</h3>
          <p>
            推論にどれだけ計算リソースを使うかを制御します。指定しない場合のデフォルトは{" "}
            <code>&quot;high&quot;</code> で、推論そのものを完全に無効化することはできません。
          </p>

          <table>
            <thead>
              <tr>
                <th>設定値</th>
                <th>説明</th>
                <th>最適な用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>&quot;low&quot;</code>
                </td>
                <td>推論トークンを一部使用しつつ高速</td>
                <td>レイテンシ重視のエージェント処理、シンプルなツール呼び出し</td>
              </tr>
              <tr>
                <td>
                  <code>&quot;medium&quot;</code>
                </td>
                <td>レイテンシに寛容な用途向けにより多く思考</td>
                <td>複雑なデータ分析、長文コンテキストでの推論</td>
              </tr>
              <tr>
                <td>
                  <code>&quot;high&quot;</code>（デフォルト）
                </td>
                <td>深い思考のため推論トークンを多く使用</td>
                <td>非常に難しい問題、複雑な数学、多段階のロジック</td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className="ti ti-alert-triangle" />
            <div className={styles.calloutBody}>
              推論モデルでは <code>presencePenalty</code>、<code>frequencyPenalty</code>、
              <code>stop</code> パラメータは使用できません（指定するとエラーになります）。
            </div>
          </div>

          <h3>4.2 選択フローチャート</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_2} />
          </div>

          <h3>4.3 コード例</h3>
          <div className={styles.codeLabel}>python</div>
          <pre className={styles.codeBlockPre}>
            <code>
              import os{"\n"}
              from xai_sdk import Client{"\n"}
              from xai_sdk.chat import system, user{"\n\n"}
              client = Client({"\n"}
              {"    "}api_key=os.getenv(&quot;XAI_API_KEY&quot;),{"\n"}
              {"    "}timeout=3600,{"\n"}){"\n\n"}
              chat = client.chat.create({"\n"}
              {"    "}model=&quot;grok-4.5&quot;,{"\n"}
              {"    "}reasoning_effort=&quot;high&quot;,{"\n"}
              {"    "}messages=[system(&quot;You are a highly intelligent AI assistant.&quot;)],
              {"\n"}){"\n"}
              chat.append(user(&quot;Find all prime numbers p such that p^2 + 2 is also prime. Prove
              your answer.&quot;)){"\n\n"}
              response = chat.sample(){"\n"}
              print(response.content)
            </code>
          </pre>

          <h3>4.4 推論トレースの活用</h3>
          <ul>
            <li>
              <code>reasoning_tokens</code> として使用量メトリクスに公開されます（課金対象です）。
            </li>
            <li>
              <code>include: [&quot;reasoning.encrypted_content&quot;]</code>{" "}
              を指定すると暗号化された推論内容を取得でき、後続の会話に文脈として渡すことができます。
            </li>
            <li>
              grok-4.5 では推論内容の要約（Summarized Reasoning
              Content）をストリーミングで取得できます。
            </li>
          </ul>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-bulb" />
            <div className={styles.calloutBody}>
              <div className={styles.calloutTitle}>タイムアウトのベストプラクティス</div>
              推論モデルは応答生成に時間がかかることがあるため、HTTP
              クライアントのタイムアウトを長め（例：3600秒）に設定することが公式に推奨されています。
            </div>
          </div>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典:{" "}
            <Ext href="https://docs.x.ai/developers/model-capabilities/text/reasoning">
              Reasoning | xAI Docs
            </Ext>
            （最終更新 2026年7月9日）
          </div>
        </section>

        <section className={styles.docSection} id="step5">
          <h2>
            <span className={styles.stepNumber}>5</span>Step5：Function
            Calling（関数呼び出し）のベストプラクティス
          </h2>
          <p>
            Function Calling を使うと、モデルがデータベースや外部 API
            など任意のシステムと連携できます。
          </p>

          <h3>5.1 動作の流れ</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_3} />
          </div>

          <h3>5.2 ツール定義の基本パターン</h3>
          <div className={styles.codeLabel}>python</div>
          <pre className={styles.codeBlockPre}>
            <code>
              import os{"\n"}
              import json{"\n"}
              from xai_sdk import Client{"\n"}
              from xai_sdk.chat import user, tool, tool_result{"\n\n"}
              client = Client(api_key=os.getenv(&quot;XAI_API_KEY&quot;)){"\n\n"}
              tools = [{"\n"}
              {"    "}tool({"\n"}
              {"        "}name=&quot;get_temperature&quot;,{"\n"}
              {"        "}description=&quot;Get current temperature for a location&quot;,{"\n"}
              {"        "}parameters=&#123;{"\n"}
              {"            "}&quot;type&quot;: &quot;object&quot;,{"\n"}
              {"            "}&quot;properties&quot;: &#123;{"\n"}
              {"                "}&quot;location&quot;: &#123;&quot;type&quot;: &quot;string&quot;,
              &quot;description&quot;: &quot;City name&quot;&#125;,{"\n"}
              {"                "}&quot;unit&quot;: &#123;&quot;type&quot;: &quot;string&quot;,
              &quot;enum&quot;: [&quot;celsius&quot;, &quot;fahrenheit&quot;], &quot;default&quot;:
              &quot;fahrenheit&quot;&#125;{"\n"}
              {"            "}&#125;,{"\n"}
              {"            "}&quot;required&quot;: [&quot;location&quot;]{"\n"}
              {"        "}&#125;,{"\n"}
              {"    "}),{"\n"}]{"\n\n"}
              chat = client.chat.create(model=&quot;grok-4.5&quot;, tools=tools){"\n"}
              chat.append(user(&quot;What is the temperature in San Francisco?&quot;)){"\n"}
              response = chat.sample(){"\n\n"}
              if response.tool_calls:{"\n"}
              {"    "}chat.append(response){"\n"}
              {"    "}for tc in response.tool_calls:{"\n"}
              {"        "}args = json.loads(tc.function.arguments){"\n"}
              {"        "}result = &#123;&quot;location&quot;: args[&quot;location&quot;],
              &quot;temperature&quot;: 59, &quot;unit&quot;: args.get(&quot;unit&quot;,
              &quot;fahrenheit&quot;)&#125;{"\n"}
              {"        "}chat.append(tool_result(json.dumps(result))){"\n"}
              {"    "}response = chat.sample(){"\n\n"}
              print(response.content)
            </code>
          </pre>

          <h3>5.3 ツール選択の制御（tool_choice）</h3>
          <table>
            <thead>
              <tr>
                <th>値</th>
                <th>動作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>&quot;auto&quot;</code>（デフォルト）
                </td>
                <td>モデルがツールを呼ぶかどうかを自律的に判断</td>
              </tr>
              <tr>
                <td>
                  <code>&quot;required&quot;</code>
                </td>
                <td>少なくとも1つのツール呼び出しを強制</td>
              </tr>
              <tr>
                <td>
                  <code>&quot;none&quot;</code>
                </td>
                <td>ツール呼び出しを無効化</td>
              </tr>
              <tr>
                <td>
                  <code>
                    &#123;&quot;type&quot;: &quot;function&quot;, &quot;function&quot;:
                    &#123;&quot;name&quot;: &quot;...&quot;&#125;&#125;
                  </code>
                </td>
                <td>特定のツールを強制的に呼ばせる</td>
              </tr>
            </tbody>
          </table>

          <h3>5.4 ベストプラクティス</h3>
          <ul>
            <li>
              <strong>並列関数呼び出しはデフォルトで有効</strong>です。1回のレスポンスに複数の{" "}
              <code>tool_call</code>{" "}
              が含まれる可能性があるため、必ず全件をループ処理してください。無効化したい場合は{" "}
              <code>parallel_tool_calls: false</code> を指定します。
            </li>
            <li>
              <strong>1リクエストあたり最大200個</strong>のツールを定義できます。
            </li>
            <li>
              ツール定義の <code>description</code>{" "}
              フィールドは、モデルが「いつこのツールを使うべきか」を判断する材料になるため、曖昧さを排除した明確な説明を書くことが品質に直結します。
            </li>
            <li>
              Pydantic（Python）や Zod（JavaScript）でスキーマを定義すると、型安全性を保ちながら
              JSON Schema を自動生成できます。
            </li>
            <li>
              <code>parameters</code> のルートは必ず <code>object</code> 型（または全分岐が object
              の <code>oneOf</code>/<code>anyOf</code>
              ）である必要があります。スカラー値や配列をルートに置くと <code>400</code>{" "}
              エラーになります。
            </li>
            <li>
              組み込みツール（Web Search・X Search
              など）とカスタム関数は併用可能です。組み込みツールは xAI
              のサーバー側で自動実行され、カスタムツールは呼び出し時に実行が一時停止し、開発者側の処理待ちになります。
            </li>
          </ul>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典:{" "}
            <Ext href="https://docs.x.ai/developers/tools/function-calling">
              Function Calling | xAI Docs
            </Ext>
            （最終更新 2026年6月24日）
          </div>
        </section>

        <section className={styles.docSection} id="step6">
          <h2>
            <span className={styles.stepNumber}>6</span>Step6：Structured
            Outputs（構造化出力）を活用する
          </h2>
          <p>
            自由形式のテキストではなく、あらかじめ定義した JSON
            スキーマに確実に一致する出力を得られる機能です。文書解析・エンティティ抽出・レポート生成に有効です。
          </p>

          <h3>6.1 2つの利用方法</h3>
          <ol>
            <li>
              <strong>response_format パラメータ</strong>：<code>type</code> を{" "}
              <code>&quot;json_schema&quot;</code> にしてスキーマを指定（最も柔軟）。
              <code>&quot;json_object&quot;</code>（任意の整形済みJSON）や{" "}
              <code>&quot;text&quot;</code>（デフォルト、自由形式）も選択可能。
            </li>
            <li>
              <strong>Function Calling 経由</strong>
              ：ツールの引数は常にスキーマに厳密準拠して生成されます（
              <code>strict</code> は暗黙的に常に <code>true</code>）。
            </li>
          </ol>

          <h3>6.2 対応している JSON Schema の範囲</h3>
          <table>
            <thead>
              <tr>
                <th>対応済み型</th>
                <th>備考</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>string</code> / <code>number</code> / <code>integer</code> /{" "}
                  <code>boolean</code> / <code>null</code>
                </td>
                <td>基本型</td>
              </tr>
              <tr>
                <td>
                  <code>enum</code> / <code>const</code>
                </td>
                <td>列挙・定数</td>
              </tr>
              <tr>
                <td>
                  <code>array</code> / <code>object</code>
                </td>
                <td>コレクション型</td>
              </tr>
              <tr>
                <td>
                  <code>anyOf</code> / <code>oneOf</code>
                </td>
                <td>
                  <code>oneOf</code> は <code>anyOf</code> と同一挙動
                </td>
              </tr>
              <tr>
                <td>
                  <code>allOf</code>（単一サブスキーマのみ）
                </td>
                <td>複数指定は「ベストエフォート」扱い</td>
              </tr>
              <tr>
                <td>
                  <code>$ref</code> / <code>$defs</code>（非循環参照のみ）
                </td>
                <td>再利用可能な定義</td>
              </tr>
            </tbody>
          </table>
          <p className={styles.muted}>
            <code>additionalProperties</code> はデフォルトで <code>false</code>（明示的に{" "}
            <code>true</code> を指定しない限り追加プロパティ不可）。
          </p>

          <h3>6.3 制約の保証範囲</h3>
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
                  <code>minimum</code> / <code>maximum</code> / <code>exclusiveMinimum</code> /{" "}
                  <code>exclusiveMaximum</code>
                </td>
                <td>上限なし（完全保証）</td>
              </tr>
              <tr>
                <td>
                  <code>minLength</code> / <code>maxLength</code>
                </td>
                <td>2,048 まで</td>
              </tr>
              <tr>
                <td>
                  <code>minItems</code> / <code>maxItems</code>
                </td>
                <td>256 まで</td>
              </tr>
              <tr>
                <td>
                  <code>minProperties</code> / <code>maxProperties</code>
                </td>
                <td>64 まで</td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className="ti ti-alert-triangle" />
            <div className={styles.calloutBody}>
              <code>not</code>、<code>if</code>/<code>then</code>/<code>else</code>、複数の{" "}
              <code>allOf</code>
              、上表にない <code>format</code>{" "}
              値は「ベストエフォート」（モデルが概ね守るが厳密には保証されない）扱いです。厳密な準拠が必要な場合はアプリ側でバリデーションを行うことが推奨されています。
            </div>
          </div>

          <h3>6.4 実装例：請求書（Invoice）データの抽出</h3>
          <div className={styles.codeLabel}>python</div>
          <pre className={styles.codeBlockPre}>
            <code>
              import os{"\n"}
              from datetime import date{"\n"}
              from enum import Enum{"\n"}
              from pydantic import BaseModel, Field{"\n"}
              from xai_sdk import Client{"\n"}
              from xai_sdk.chat import system, user{"\n\n"}
              class Currency(str, Enum):{"\n"}
              {"    "}USD = &quot;USD&quot;{"\n"}
              {"    "}EUR = &quot;EUR&quot;{"\n"}
              {"    "}GBP = &quot;GBP&quot;{"\n\n"}
              class LineItem(BaseModel):{"\n"}
              {"    "}description: str = Field(description=&quot;Description of the item or
              service&quot;){"\n"}
              {"    "}quantity: int = Field(description=&quot;Number of units&quot;, ge=1){"\n"}
              {"    "}unit_price: float = Field(description=&quot;Price per unit&quot;, ge=0)
              {"\n\n"}
              class Invoice(BaseModel):{"\n"}
              {"    "}vendor_name: str{"\n"}
              {"    "}invoice_number: str{"\n"}
              {"    "}invoice_date: date{"\n"}
              {"    "}line_items: list[LineItem]{"\n"}
              {"    "}total_amount: float = Field(ge=0){"\n"}
              {"    "}currency: Currency{"\n\n"}
              client = Client(api_key=os.getenv(&quot;XAI_API_KEY&quot;)){"\n"}
              chat = client.chat.create(model=&quot;grok-4.5&quot;){"\n"}
              chat.append(system(&quot;Given a raw invoice, extract the invoice data into JSON
              format.&quot;)){"\n"}
              chat.append(user(&quot;Vendor: Acme Corp | Invoice: INV-1042 | Date: 2026-07-01 |
              Service: Consulting, 8 hours at $10.00 | Total: $80.00 USD&quot;)){"\n\n"}
              response, invoice = chat.parse(Invoice){"\n"}
              print(invoice.vendor_name, invoice.total_amount, invoice.currency)
            </code>
          </pre>

          <h3>6.5 ツールと構造化出力の組み合わせ</h3>
          <p>
            Web Search
            などのエージェント型ツールでも、カスタム関数呼び出しでも、最終出力を型安全なスキーマに強制することができます（Grok
            4 系モデルで対応）。これにより「ツールで情報収集 →
            決まった形式で返す」というワークフローが実現します。
          </p>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典:{" "}
            <Ext href="https://docs.x.ai/developers/model-capabilities/text/structured-outputs">
              Structured Outputs | xAI Docs
            </Ext>
            （最終更新 2026年5月12日）
          </div>
        </section>

        <section className={styles.docSection} id="step7">
          <h2>
            <span className={styles.stepNumber}>7</span>
            Step7：Web検索・X検索ツールでリアルタイム性を確保する
          </h2>
          <p>
            Grok モデルは学習データ以降の情報を持たないため、最新情報が必要な場合は必ず Web Search /
            X Search ツールを有効化します。
          </p>

          <div className={styles.codeLabel}>python</div>
          <pre className={styles.codeBlockPre}>
            <code>
              from xai_sdk.tools import web_search{"\n\n"}
              chat = client.chat.create({"\n"}
              {"    "}model=&quot;grok-4.5&quot;,{"\n"}
              {"    "}tools=[web_search()],{"\n"}){"\n"}
              chat.append(user(&quot;What is xAI?&quot;))
            </code>
          </pre>

          <h3>7.1 主なパラメータ</h3>
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
                <td>検索対象を特定ドメインに限定（最大5件）</td>
              </tr>
              <tr>
                <td>
                  <code>excluded_domains</code>
                </td>
                <td>
                  特定ドメインを検索対象から除外（最大5件、<code>allowed_domains</code>{" "}
                  と同時指定不可）
                </td>
              </tr>
              <tr>
                <td>
                  <code>enable_image_understanding</code>
                </td>
                <td>検索中に発見した画像を解析可能にする</td>
              </tr>
              <tr>
                <td>
                  <code>enable_image_search</code>
                </td>
                <td>画像検索結果を Markdown 画像として応答に埋め込む</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典:{" "}
            <Ext href="https://docs.x.ai/developers/tools/web-search">Web Search | xAI Docs</Ext>
            （最終更新 2026年5月27日）
          </div>
        </section>

        <section className={styles.docSection} id="step8">
          <h2>
            <span className={styles.stepNumber}>8</span>Step8：Prompt Caching
            でコストと遅延を削減する
          </h2>
          <p>
            同じプレフィックス（システムプロンプトや会話履歴の先頭部分）を繰り返し送信する場合、キャッシュを活用することで入力トークンのコストと初回応答までの遅延（レイテンシ）を大幅に削減できます。これは公式ドキュメントが明示的に「ベストプラクティス」として列挙している数少ないセクションです。
          </p>

          <h3>8.1 公式ベストプラクティス</h3>
          <ol>
            <li>
              <strong>
                x-grok-conv-id（Chat Completions）または prompt_cache_key（Responses
                API）を必ず設定する
              </strong>
              — 同一サーバーにリクエストをルーティングし、キャッシュヒット率を最大化します。
            </li>
            <li>
              <strong>安定した会話IDを使う</strong> — UUID
              やアプリケーションのセッションIDが適しています。
            </li>
            <li>
              <strong>過去のメッセージを変更しない</strong> —
              新しいメッセージの追記のみに留めます。編集・削除・並べ替えを行うとキャッシュが破棄されます。
            </li>
            <li>
              <strong>静的コンテンツを先頭に配置する</strong> — システムプロンプト、Few-shot
              例、参照ドキュメントを会話の先頭に置き、安定したプレフィックスを形成します。
            </li>
            <li>
              <strong>cached_tokens を監視する</strong> —
              常に0であれば、会話ID設定やメッセージ順序に問題がある可能性があります。
            </li>
            <li>
              <strong>キャッシュミスを前提に設計する</strong> —
              サーバーの負荷や再起動によりキャッシュはいつでも失効し得ます。キャッシュなしでも正常に動作するようアプリを設計してください。
            </li>
          </ol>

          <h3>8.2 よくある質問</h3>
          <table>
            <thead>
              <tr>
                <th>質問</th>
                <th>回答</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>キャッシュは出力品質に影響するか</td>
                <td>
                  いいえ。プロンプト処理フェーズを高速化するだけで、モデルの出力はキャッシュの有無に関わらず同一です。
                </td>
              </tr>
              <tr>
                <td>キャッシュはどれくらい保持されるか</td>
                <td>
                  サーバー負荷や再起動でいつでも失効し得ます。<code>x-grok-conv-id</code>{" "}
                  を使うことで保持率を高められます。
                </td>
              </tr>
              <tr>
                <td>意図的にキャッシュミスを起こせるか</td>
                <td>
                  可能です。異なる <code>x-grok-conv-id</code> を使うか、ヘッダーを省略します。
                </td>
              </tr>
              <tr>
                <td>ストリーミングでもキャッシュは効くか</td>
                <td>
                  はい。ストリームの最初の空トークンがキャッシュ検索とプリフィル処理に対応します。
                </td>
              </tr>
              <tr>
                <td>ツール呼び出しでもキャッシュは効くか</td>
                <td>
                  はい。ツール呼び出し結果を含む全メッセージまでがキャッシュ可能なプレフィックスです。
                </td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-bulb" />
            <div className={styles.calloutBody}>
              <div className={styles.calloutTitle}>grok-4.5 固有の推奨事項</div>
              公式ドキュメントは「<code>prompt_cache_key</code>{" "}
              を設定しない場合、キャッシュが冷えたサーバーに当たり、フル価格の入力トークン料金を支払うことが多い」と明記しています。
            </div>
          </div>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典:{" "}
            <Ext href="https://docs.x.ai/developers/advanced-api-usage/prompt-caching/best-practices">
              Prompt Caching: Best Practices &amp; FAQ | xAI Docs
            </Ext>
            （最終更新 2026年3月16日）、
            <Ext href="https://docs.x.ai/developers/grok-4-5#important-details">
              grok-4.5 | xAI Docs
            </Ext>
            （最終更新 2026年7月8日）
          </div>
        </section>

        <section className={styles.docSection} id="step9">
          <h2>
            <span className={styles.stepNumber}>9</span>Step9：長時間のエージェントループと Context
            Compaction
          </h2>
          <p>
            数千トークンを超える長い会話では、フォローアップのたびに過去の全メッセージを再送信することになり、入力トークンのコストが膨らみます。Context
            Compaction（コンテキスト圧縮）を使うと、会話を1つの不透明な圧縮アイテムに変換し、システムプロンプトや添付ファイル、直前の推論内容などの要点を保持したまま冗長なツール出力を削減できます。
          </p>

          <h3>9.1 圧縮すべきタイミング（すべて満たす場合）</h3>
          <ul>
            <li>
              会話が大きくなり、各呼び出しの <code>input_tokens</code>{" "}
              がコストやレイテンシを悪化させている
            </li>
            <li>
              モデルに過去のやり取りを覚えていてほしい（覚えなくてよいなら新規会話を始めるだけでよい）
            </li>
            <li>
              現在のウィンドウがまだモデルのコンテキスト上限に収まっている（圧縮は既に上限超過したリクエストを救済できません）
            </li>
          </ul>

          <h3>9.2 実装パターン（エージェントループ内で N ターンごとに圧縮）</h3>
          <div className={styles.codeLabel}>python</div>
          <pre className={styles.codeBlockPre}>
            <code>
              compact_every = 5{"\n"}
              for turn in range(1, 100):{"\n"}
              {"    "}chat.append(user(input(&quot;You: &quot;))){"\n"}
              {"    "}response = chat.sample(){"\n"}
              {"    "}chat.append(response){"\n\n"}
              {"    "}if turn % compact_every == 0:{"\n"}
              {"        "}compact = chat.compact(){"\n"}
              {"        "}print(f&quot;dropped &#123;compact.dropped_message_count&#125; messages,
              tokens used: &#123;compact.usage.total_tokens&#125;&quot;)
            </code>
          </pre>

          <h3>9.3 制約と注意点</h3>
          <ul>
            <li>
              既にコンテキスト上限を超えている会話は圧縮できません（圧縮前にプルーニングや分割が必要）。
            </li>
            <li>1リクエストにつき圧縮は1回まで。</li>
            <li>
              <code>encrypted_content</code>{" "}
              は不透明なブロブとして扱うこと。パース・編集・手動マージをしてはいけません。
            </li>
            <li>再圧縮は可能です。圧縮後さらに会話が長くなった場合、再度圧縮できます。</li>
            <li>
              圧縮処理自体もトークンを消費するため、頻繁に圧縮する場合は小型・高速なモデルを圧縮専用に選ぶことが推奨されています。
            </li>
            <li>
              推論モデルを使う場合は <code>use_encrypted_content=True</code>{" "}
              を設定すると、過去ターンの推論内容も圧縮を通じて保持されます。
            </li>
          </ul>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典:{" "}
            <Ext href="https://docs.x.ai/developers/advanced-api-usage/context-compaction">
              Context Compaction | xAI Docs
            </Ext>
            （最終更新 2026年5月21日）
          </div>
        </section>

        <section className={styles.docSection} id="step10">
          <h2>
            <span className={styles.stepNumber}>10</span>Step10：レート制限とエラーハンドリング
          </h2>

          <h3>10.1 レート制限の仕組み</h3>
          <p>
            xAI API は RPS（1秒あたりのリクエスト数）と
            TPM（1分あたりのトークン数）の2軸で制限されます。制限値はチーム累計支出額に基づく「Tier（階層）」によって自動的に引き上げられます。
          </p>

          <table>
            <thead>
              <tr>
                <th>Tier</th>
                <th>累計支出のしきい値</th>
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
                <td>要問い合わせ</td>
              </tr>
            </tbody>
          </table>
          <p className={styles.muted}>一度到達した Tier は永続します（ダウングレードしません）。</p>

          <h3>10.2 grok-4.5 のレート制限例（Tier別）</h3>
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
                <td>Tier 0</td>
                <td>150</td>
                <td>50M</td>
              </tr>
              <tr>
                <td>Tier 1</td>
                <td>172</td>
                <td>53M</td>
              </tr>
              <tr>
                <td>Tier 2</td>
                <td>208</td>
                <td>60M</td>
              </tr>
              <tr>
                <td>Tier 3</td>
                <td>312</td>
                <td>74M</td>
              </tr>
              <tr>
                <td>Tier 4</td>
                <td>500</td>
                <td>100M</td>
              </tr>
            </tbody>
          </table>
          <p className={styles.muted}>
            TPM
            にカウントされるもの：プロンプトトークン（テキスト・画像・音声）、完了トークン、推論トークン、そしてキャッシュされたプロンプトトークンも含まれます（課金は割引されますが
            TPM 消費としてはカウントされる点に注意）。
          </p>

          <h3>10.3 429エラーへの対処（指数バックオフ）</h3>
          <div className={styles.codeLabel}>python</div>
          <pre className={styles.codeBlockPre}>
            <code>
              import os{"\n"}
              import time{"\n"}
              from openai import OpenAI, RateLimitError{"\n\n"}
              client = OpenAI(base_url=&quot;https://api.x.ai/v1&quot;,
              api_key=os.getenv(&quot;XAI_API_KEY&quot;)){"\n\n"}
              def request_with_backoff(messages, max_retries=5):{"\n"}
              {"    "}for attempt in range(max_retries):{"\n"}
              {"        "}try:{"\n"}
              {"            "}return client.chat.completions.create(model=&quot;grok-4.5&quot;,
              messages=messages){"\n"}
              {"        "}except RateLimitError:{"\n"}
              {"            "}wait = 2 ** attempt{"\n"}
              {"            "}time.sleep(wait){"\n"}
              {"    "}raise
            </code>
          </pre>

          <h3>10.4 エラーハンドリングのフロー</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_4} />
          </div>

          <h3>10.5 制限を引き上げる方法</h3>
          <ul>
            <li>
              <strong>支出を増やす</strong>：累計支出に応じて Tier は自動的に引き上げられます。
            </li>
            <li>
              <strong>引き上げをリクエストする</strong>：追加支出なしで制限を引き上げたい場合や Tier
              4 を超える制限が必要な場合、
              <Ext href="https://console.x.ai/team/default/rate-limits">xAI Console</Ext>{" "}
              から申請できます。
            </li>
            <li>
              <strong>セールスに問い合わせる</strong>
              ：エンタープライズ規模のキャパシティが必要な場合は <code>sales@x.ai</code>{" "}
              へ連絡します。
            </li>
          </ul>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典: <Ext href="https://docs.x.ai/developers/rate-limits">Rate Limits | xAI Docs</Ext>
            （最終更新 2026年6月20日）
          </div>
        </section>

        <section className={styles.docSection} id="step11">
          <h2>
            <span className={styles.stepNumber}>11</span>Step11：料金体系を理解する
          </h2>

          <h3>11.1 Chat API（テキストモデル）</h3>
          <table>
            <thead>
              <tr>
                <th>モデル</th>
                <th>コンテキスト</th>
                <th>入力</th>
                <th>キャッシュ入力</th>
                <th>出力</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>grok-4.5</td>
                <td>500k</td>
                <td>$2.00</td>
                <td>$0.50</td>
                <td>$6.00</td>
              </tr>
              <tr>
                <td>grok-4.3</td>
                <td>1M</td>
                <td>$1.25</td>
                <td>$0.20</td>
                <td>$2.50</td>
              </tr>
              <tr>
                <td>grok-4.20 系（reasoning/non-reasoning/multi-agent）</td>
                <td>1M</td>
                <td>$1.25</td>
                <td>$0.20</td>
                <td>$2.50</td>
              </tr>
            </tbody>
          </table>

          <h3>11.2 サーバー側ツールの呼び出し料金</h3>
          <table>
            <thead>
              <tr>
                <th>ツール</th>
                <th>ツール名</th>
                <th>料金（1,000回あたり）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Web Search</td>
                <td>
                  <code>web_search</code>
                </td>
                <td>$5</td>
              </tr>
              <tr>
                <td>X Search</td>
                <td>
                  <code>x_search</code>
                </td>
                <td>$5</td>
              </tr>
              <tr>
                <td>Code Execution</td>
                <td>
                  <code>code_execution</code> / <code>code_interpreter</code>
                </td>
                <td>$5</td>
              </tr>
              <tr>
                <td>File Attachments</td>
                <td>
                  <code>attachment_search</code>
                </td>
                <td>$10</td>
              </tr>
              <tr>
                <td>Collections Search（RAG）</td>
                <td>
                  <code>collections_search</code> / <code>file_search</code>
                </td>
                <td>$2.50</td>
              </tr>
              <tr>
                <td>Image / X Video Understanding</td>
                <td>
                  <code>view_image</code> / <code>view_x_video</code>
                </td>
                <td>トークン課金</td>
              </tr>
              <tr>
                <td>Remote MCP Tools</td>
                <td>サーバーごとに異なる</td>
                <td>呼び出し自体は無料、トークンのみ課金</td>
              </tr>
            </tbody>
          </table>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-bulb" />
            <div className={styles.calloutBody}>
              エージェントが自律的にツール回数を決めるため、クエリの複雑さに比例してコストが変動する点に注意してください。
            </div>
          </div>

          <h3>11.3 Batch API（非同期・割引あり）</h3>
          <p>
            大量のリクエストを非同期でまとめて処理すると、標準料金より割引されます（多くの場合24時間以内に完了）。
          </p>
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
                <td>料金</td>
                <td>標準レート</td>
                <td>モデルにより最大20%割引</td>
              </tr>
              <tr>
                <td>応答時間</td>
                <td>即時（数秒）</td>
                <td>通常24時間以内</td>
              </tr>
              <tr>
                <td>レート制限</td>
                <td>分単位の制限が適用</td>
                <td>レート制限にカウントされない</td>
              </tr>
            </tbody>
          </table>
          <p className={styles.muted}>
            grok-4.3・grok-4.20系は20%割引、それ以外のモデルは割引対象外です。
          </p>

          <h3>11.4 Priority Processing（優先処理）</h3>
          <p>
            低レイテンシが必要なテキストリクエストに対し、標準料金の <strong>2倍</strong>{" "}
            でスケジューリング優先度を引き上げられます。実際に優先処理されたかは、レスポンス内の{" "}
            <code>&quot;service_tier&quot;: &quot;priority&quot;</code>{" "}
            で確認できます（優先されなかった場合は標準料金のまま課金）。
          </p>

          <h3>11.5 その他の料金</h3>
          <table>
            <thead>
              <tr>
                <th>項目</th>
                <th>料金</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ファイルストレージ</td>
                <td>$0.025 / GiB / 日</td>
              </tr>
              <tr>
                <td>コレクション（RAG）ストレージ</td>
                <td>$0.10 / GiB / 日</td>
              </tr>
              <tr>
                <td>ファイル・コレクションのダウンロード</td>
                <td>$0.20 / GiB</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典: <Ext href="https://docs.x.ai/developers/pricing">Pricing | xAI Docs</Ext>
            （最終更新 2026年7月3日）
          </div>
        </section>

        <section className={styles.docSection} id="security">
          <h2>
            <i className="ti ti-shield-lock" />
            12. セキュリティとデータプライバシーのベストプラクティス
          </h2>
          <p>
            AIエンジニアリングにおいてガバナンス・セキュリティ要件を考慮することは重要です。xAI API
            のデータ取り扱いポリシーを正確に把握しておきましょう。
          </p>

          <h3>12.1 データ保持ポリシー</h3>
          <ul>
            <li>xAI はユーザーの明示的な許可なしに API の入出力データを学習に使用しません。</li>
            <li>
              API のリクエスト・レスポンスは、不正利用の監査目的で <strong>30日間</strong>{" "}
              サーバーに一時保存された後、自動的に削除されます。
            </li>
          </ul>

          <h3>12.2 Zero Data Retention（ZDR）</h3>
          <p>
            エンタープライズアカウント限定の機能で、有効化するとリクエスト・レスポンスデータが一切保存されません（応答が返された時点で記録が残りません）。
          </p>
          <ul>
            <li>
              モデレーション（安全性チェック）はリアルタイムで実施されますが、結果は保存されません。
            </li>
            <li>
              全レスポンスに <code>x-zero-data-retention</code> ヘッダー（
              <code>&quot;true&quot;</code> / <code>&quot;false&quot;</code>
              ）が付与され、プログラム的に ZDR の有効性を確認できます。
            </li>
            <li>
              ZDR 環境下では <code>previous_response_id</code>{" "}
              によるサーバー側の会話継続機能が使えないため、クライアント側で会話状態を管理する必要があります（
              <code>use_encrypted_content</code> の活用が推奨）。
            </li>
          </ul>

          <h3>12.3 コンプライアンス</h3>
          <table>
            <thead>
              <tr>
                <th>項目</th>
                <th>状況</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>HIPAA（医療情報）</td>
                <td>BAA（Business Associate Agreement）締結の問い合わせフォームあり</td>
              </tr>
              <tr>
                <td>GDPR / SOC 2</td>
                <td>SOC 2 Type 2 準拠。NDA締結済み顧客は Trust Center で証明書類を確認可能</td>
              </tr>
              <tr>
                <td>監査ログ</td>
                <td>チーム管理者は xAI Console の Audit Log でユーザー操作の全履歴を確認可能</td>
              </tr>
            </tbody>
          </table>

          <h3>12.4 API キー管理のベストプラクティス</h3>
          <ul>
            <li>APIキーはパスワードやクレジットカード情報と同様の機密情報として扱う</li>
            <li>チームメンバー間でキーを共有しない</li>
            <li>環境変数やシークレット管理ツールで安全に保管する</li>
            <li>公開リポジトリへのコミットを避ける</li>
            <li>定期的にキーをローテーションする</li>
            <li>侵害が疑われる場合は xAI Console から即座にキーを無効化し、新規キーを発行する</li>
          </ul>

          <div className={`${styles.callout} ${styles.calloutSuccess}`}>
            <i className="ti ti-circle-check" />
            <div className={styles.calloutBody}>
              xAI は GitHub の Secret Scanning
              プログラムと連携しており、漏洩したキーが検出されると自動的に無効化され、メールで通知が届きます。
            </div>
          </div>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典:{" "}
            <Ext href="https://docs.x.ai/developers/faq/security">
              FAQ - xAI API Security | xAI Docs
            </Ext>
            （最終更新 2026年5月9日）
          </div>
        </section>

        <section className={styles.docSection} id="prompting">
          <h2>
            <i className="ti ti-message-2" />
            13. プロンプト設計のベストプラクティス
          </h2>
          <p>
            Grok に限らず LLM 全般に通じる原則ですが、xAI API
            をエージェント的（ツール呼び出し・多段階タスク）に使う場合には以下が特に重要になります。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_DIAGRAM_5} />
          </div>

          <h3>13.1 5つの原則</h3>
          <ol>
            <li>
              <strong>タスクを明示的にスコープする</strong>
              ：「説明して」ではなく「〇〇について、△△字以内で、□□向けに、具体例を1つ含めて説明して」のように、タスク・分量・対象読者・出力形式を具体化する。
            </li>
            <li>
              <strong>長い・複雑な指示は構造化する</strong>：Markdown の見出しや箇条書き（あるいは
              XML タグ）でタスク・制約・コンテキストを分離すると、モデルの情報抽出精度が上がります。
            </li>
            <li>
              <strong>エビデンス・根拠を要求する</strong>
              ：「説明を求めるだけでなく「引用元・時系列・比較表を含めて」のように明示的に要求しないと、自信ありげだが検証不能な回答になりがちです。
            </li>
            <li>
              <strong>ツール利用の指針をシステムプロンプトに書く</strong>
              ：「どのサブタスクにどのツールを使うか」「ツール結果をどう連鎖させるか」を明示すると、ループや不完全な応答を防げます。
            </li>
            <li>
              <strong>一発で完璧を目指さず、素早く試して反復する</strong>
              ：最初から時間をかけて「完璧な」プロンプトを作るより、まず短いプロンプトを送り、結果を見て具体的な修正指示を追加する方が、多くの場合、結果的に早く良い出力にたどり着きます。
            </li>
          </ol>

          <h3>13.2 システムプロンプトの実例</h3>
          <div className={styles.codeLabel}>system prompt</div>
          <pre className={styles.codeBlockPre}>
            <code>
              You are a senior backend engineer with access to web search and code execution tools.
              {"\n"}
              When solving problems:{"\n"}
              1. State your reasoning plan before taking any action{"\n"}
              2. Use search to verify external facts, library versions, or API specs before assuming
              {"\n"}
              3. Execute and test code, don&apos;t just write it{"\n"}
              4. If a test fails, diagnose and fix before moving on{"\n"}
              5. Rate your final output 1-10 and flag any remaining uncertainties
            </code>
          </pre>
          <p>
            このようにシステムプロンプトで「思考の型」を明示することで、モデルが根拠のないAPIエンドポイントを想定してしまう、といった典型的な失敗を減らせます。
          </p>
          <div className={styles.sourceNote}>
            <i className="ti ti-external-link" />
            出典:{" "}
            <Ext href="https://docs.x.ai/developers/tools/function-calling">
              Function Calling | xAI Docs
            </Ext>
            、
            <Ext href="https://docs.x.ai/developers/model-capabilities/text/reasoning">
              Reasoning | xAI Docs
            </Ext>
            （プロンプト設計の一般原則は、公式ドキュメントの実装例パターンに基づき整理したもの）
          </div>
        </section>

        <section className={styles.docSection} id="antipatterns">
          <h2>
            <i className="ti ti-alert-triangle" />
            14. よくある落とし穴（アンチパターン）チェックリスト
          </h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>アンチパターン</th>
                <th>何が起きるか</th>
                <th>対策</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>会話IDを設定せずに繰り返しリクエスト</td>
                <td>毎回キャッシュがコールドヒットし、フル価格の入力トークン料金がかかる</td>
                <td>
                  <code>prompt_cache_key</code> / <code>x-grok-conv-id</code> を必ず設定
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>過去メッセージを編集・並び替え</td>
                <td>プロンプトキャッシュが破棄される</td>
                <td>新しいメッセージは常に追記のみ</td>
              </tr>
              <tr>
                <td>3</td>
                <td>最新情報が必要なのに検索ツールを付けない</td>
                <td>学習データ以降の出来事について誤った／古い回答をする</td>
                <td>Web Search / X Search を有効化</td>
              </tr>
              <tr>
                <td>4</td>
                <td>推論モデルにデフォルトのタイムアウトを使う</td>
                <td>応答完了前にタイムアウトエラーになる</td>
                <td>タイムアウトを長め（例：3600秒）に設定</td>
              </tr>
              <tr>
                <td>5</td>
                <td>ツールの description が曖昧</td>
                <td>モデルが誤った呼び出しや無視をする</td>
                <td>具体的で明確な説明文を書く</td>
              </tr>
              <tr>
                <td>6</td>
                <td>レート制限エラーへの再試行ロジックがない</td>
                <td>429エラーでアプリが即座にクラッシュする</td>
                <td>指数バックオフを実装する</td>
              </tr>
              <tr>
                <td>7</td>
                <td>長大な会話をそのまま送り続ける</td>
                <td>入力トークンコストとレイテンシが増大し続ける</td>
                <td>Context Compaction を定期的に実行</td>
              </tr>
              <tr>
                <td>8</td>
                <td>Structured Outputs で保証範囲外の制約に依存する</td>
                <td>出力が制約を満たさない場合がある</td>
                <td>アプリ側でも追加バリデーションを行う</td>
              </tr>
              <tr>
                <td>9</td>
                <td>APIキーをコードにハードコーディングする</td>
                <td>漏洩リスク、不正利用による高額請求</td>
                <td>環境変数・シークレット管理ツールを使用</td>
              </tr>
              <tr>
                <td>10</td>
                <td>圧縮済みコンテキストを手動で編集・パースしようとする</td>
                <td>圧縮チェーンが壊れ、会話継続に失敗する</td>
                <td>常に不透明なブロブとしてそのまま渡す</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.docSection} id="checklist">
          <h2>
            <i className="ti ti-checklist" />
            15. まとめ：ベストプラクティス チェックリスト
          </h2>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-square" />
              用途に応じて適切なモデル（基本は grok-4.5）を選定した
            </li>
            <li>
              <i className="ti ti-square" />
              APIキーを環境変数で管理し、コードにハードコーディングしていない
            </li>
            <li>
              <i className="ti ti-square" />
              タスクの難易度に応じて reasoning_effort を調整している
            </li>
            <li>
              <i className="ti ti-square" />
              ツールの description を具体的に記述し、並列呼び出しに対応している
            </li>
            <li>
              <i className="ti ti-square" />
              型安全性が必要な場面で Structured Outputs（Pydantic/Zod）を使っている
            </li>
            <li>
              <i className="ti ti-square" />
              リアルタイム情報が必要な場合は Web Search / X Search を有効化している
            </li>
            <li>
              <i className="ti ti-square" />
              prompt_cache_key（または x-grok-conv-id）を設定し、静的コンテンツを先頭に配置している
            </li>
            <li>
              <i className="ti ti-square" />
              長時間のエージェントループでは Context Compaction を活用している
            </li>
            <li>
              <i className="ti ti-square" />
              429エラーに対する指数バックオフのリトライロジックを実装している
            </li>
            <li>
              <i className="ti ti-square" />
              コスト最適化のため、バッチ処理が可能なワークロードは Batch API を検討している
            </li>
            <li>
              <i className="ti ti-square" />
              機密性の高いデータを扱う場合は ZDR やコンプライアンス要件（SOC 2 / HIPAA
              BAA）を確認している
            </li>
          </ul>
        </section>

        <section className={styles.docSection} id="references">
          <h2>
            <i className="ti ti-books" />
            16. 参考資料・出典URL一覧
          </h2>
          <p>
            本ガイドの各セクションは、以下の一次情報源（xAI公式ドキュメント）を参照して作成しました（すべて2026年7月15日時点でアクセス可能な内容）。
          </p>
          <table>
            <thead>
              <tr>
                <th>セクション</th>
                <th>ドキュメント</th>
                <th>URL</th>
                <th>最終更新日</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>全体像・製品概要</td>
                <td>Overview</td>
                <td>
                  <Ext href="https://docs.x.ai/overview">docs.x.ai/overview</Ext>
                </td>
                <td>—</td>
              </tr>
              <tr>
                <td>Grok コンシューマーアプリ</td>
                <td>Grok</td>
                <td>
                  <Ext href="https://grok.com/">grok.com</Ext>
                </td>
                <td>—</td>
              </tr>
              <tr>
                <td>モデル選定</td>
                <td>Models</td>
                <td>
                  <Ext href="https://docs.x.ai/developers/models">docs.x.ai/developers/models</Ext>
                </td>
                <td>2026年7月9日</td>
              </tr>
              <tr>
                <td>クイックスタート</td>
                <td>Quickstart</td>
                <td>
                  <Ext href="https://docs.x.ai/developers/quickstart">
                    docs.x.ai/developers/quickstart
                  </Ext>
                </td>
                <td>2026年7月3日</td>
              </tr>
              <tr>
                <td>grok-4.5 詳細</td>
                <td>grok-4.5</td>
                <td>
                  <Ext href="https://docs.x.ai/developers/grok-4-5">
                    docs.x.ai/developers/grok-4-5
                  </Ext>
                </td>
                <td>2026年7月8日</td>
              </tr>
              <tr>
                <td>Reasoning（推論）</td>
                <td>Reasoning</td>
                <td>
                  <Ext href="https://docs.x.ai/developers/model-capabilities/text/reasoning">
                    docs.x.ai/.../reasoning
                  </Ext>
                </td>
                <td>2026年7月9日</td>
              </tr>
              <tr>
                <td>Function Calling</td>
                <td>Function Calling</td>
                <td>
                  <Ext href="https://docs.x.ai/developers/tools/function-calling">
                    docs.x.ai/.../function-calling
                  </Ext>
                </td>
                <td>2026年6月24日</td>
              </tr>
              <tr>
                <td>Structured Outputs</td>
                <td>Structured Outputs</td>
                <td>
                  <Ext href="https://docs.x.ai/developers/model-capabilities/text/structured-outputs">
                    docs.x.ai/.../structured-outputs
                  </Ext>
                </td>
                <td>2026年5月12日</td>
              </tr>
              <tr>
                <td>Web Search</td>
                <td>Web Search</td>
                <td>
                  <Ext href="https://docs.x.ai/developers/tools/web-search">
                    docs.x.ai/.../web-search
                  </Ext>
                </td>
                <td>2026年5月27日</td>
              </tr>
              <tr>
                <td>Prompt Caching ベストプラクティス</td>
                <td>Best Practices &amp; FAQ</td>
                <td>
                  <Ext href="https://docs.x.ai/developers/advanced-api-usage/prompt-caching/best-practices">
                    docs.x.ai/.../prompt-caching/best-practices
                  </Ext>
                </td>
                <td>2026年3月16日</td>
              </tr>
              <tr>
                <td>Context Compaction</td>
                <td>Context Compaction</td>
                <td>
                  <Ext href="https://docs.x.ai/developers/advanced-api-usage/context-compaction">
                    docs.x.ai/.../context-compaction
                  </Ext>
                </td>
                <td>2026年5月21日</td>
              </tr>
              <tr>
                <td>レート制限</td>
                <td>Rate Limits</td>
                <td>
                  <Ext href="https://docs.x.ai/developers/rate-limits">
                    docs.x.ai/developers/rate-limits
                  </Ext>
                </td>
                <td>2026年6月20日</td>
              </tr>
              <tr>
                <td>料金体系</td>
                <td>Pricing</td>
                <td>
                  <Ext href="https://docs.x.ai/developers/pricing">
                    docs.x.ai/developers/pricing
                  </Ext>
                </td>
                <td>2026年7月3日</td>
              </tr>
              <tr>
                <td>セキュリティ・データプライバシー</td>
                <td>FAQ - xAI API Security</td>
                <td>
                  <Ext href="https://docs.x.ai/developers/faq/security">
                    docs.x.ai/developers/faq/security
                  </Ext>
                </td>
                <td>2026年5月9日</td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-pin" />
            <div className={styles.calloutBody}>
              本ガイドは執筆時点（2026年7月15日）の情報に基づいています。xAI
              は頻繁にモデルやAPI機能を更新するため、本番導入前に必ず{" "}
              <Ext href="https://docs.x.ai/">docs.x.ai</Ext>{" "}
              の最新情報をご確認ください。ドキュメントページ右上の「View as Markdown」リンクや{" "}
              <Ext href="https://docs.x.ai/llms.txt">/llms.txt</Ext>{" "}
              を使うと、LLM向けに整形された最新ドキュメントを取得できます。
            </div>
          </div>
        </section>

        <footer className={styles.pageFooter}>
          xAI の LLM（Grok）完全ガイド ― 初学者のためのベストプラクティス / 出典: docs.x.ai
          公式ドキュメント（2026年7月15日時点）
        </footer>
      </main>
    </div>
  );
}
