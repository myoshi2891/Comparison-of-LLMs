import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Z.ai (GLM) LLM ベストプラクティスガイド | AI Model Cost Calculator",
  description:
    "Z.ai(GLM) LLMの初学者向け実践ベストプラクティスガイド。モデル選定、API仕様、Deep Thinking、Structured Output、Context Caching、GLM Coding Planまで徹底解説。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.a}>
      {children}
    </a>
  );
}

export default function ZaiGlmBestPracticesPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <nav className={styles.sidebar}>
        <div className={styles.brand}>Z.ai GLM ガイド</div>
        <div className={styles.tocNav}>
          <a href="#intro" className={styles.tocLink}>
            <span className={styles.num}>00</span>
            <span>はじめに</span>
          </a>
          <a href="#s1" className={styles.tocLink}>
            <span className={styles.num}>01</span>
            <span>GLMモデルファミリー概要</span>
          </a>
          <a href="#s2" className={styles.tocLink}>
            <span className={styles.num}>02</span>
            <span>アカウント作成とAPIキー</span>
          </a>
          <a href="#s3" className={styles.tocLink}>
            <span className={styles.num}>03</span>
            <span>モデルを選ぶ</span>
          </a>
          <a href="#s4" className={styles.tocLink}>
            <span className={styles.num}>04</span>
            <span>呼び出し方法を選ぶ</span>
          </a>
          <a href="#s5" className={styles.tocLink}>
            <span className={styles.num}>05</span>
            <span>最初のAPIコール</span>
          </a>
          <a href="#s6" className={styles.tocLink}>
            <span className={styles.num}>06</span>
            <span>コアパラメータ</span>
          </a>
          <a href="#s7" className={styles.tocLink}>
            <span className={styles.num}>07</span>
            <span>推論モードの使い分け</span>
          </a>
          <a href="#s8" className={styles.tocLink}>
            <span className={styles.num}>08</span>
            <span>Streaming</span>
          </a>
          <a href="#s9" className={styles.tocLink}>
            <span className={styles.num}>09</span>
            <span>Function Calling</span>
          </a>
          <a href="#s10" className={styles.tocLink}>
            <span className={styles.num}>10</span>
            <span>Structured Output</span>
          </a>
          <a href="#s11" className={styles.tocLink}>
            <span className={styles.num}>11</span>
            <span>Context Caching</span>
          </a>
          <a href="#s12" className={styles.tocLink}>
            <span className={styles.num}>12</span>
            <span>エラーハンドリング</span>
          </a>
          <a href="#s13" className={styles.tocLink}>
            <span className={styles.num}>13</span>
            <span>料金体系とコスト最適化</span>
          </a>
          <a href="#s14" className={styles.tocLink}>
            <span className={styles.num}>14</span>
            <span>GLM Coding Plan</span>
          </a>
          <a href="#s15" className={styles.tocLink}>
            <span className={styles.num}>15</span>
            <span>セキュリティ</span>
          </a>
          <a href="#s16" className={styles.tocLink}>
            <span className={styles.num}>16</span>
            <span>チェックリスト</span>
          </a>
          <a href="#s17" className={styles.tocLink}>
            <span className={styles.num}>17</span>
            <span>参考URLまとめ</span>
          </a>
        </div>
      </nav>

      <main className={styles.content}>
        <div className={styles.hero} id="intro">
          <div className={styles.eyebrow}>Z.ai (GLM) LLM ベストプラクティスガイド</div>
          <h1 className={styles.h1}>初学者向けステップバイステップ解説</h1>
          <p
            className={styles.p}
            style={{ fontSize: "16px", color: "var(--color-text-secondary)" }}
          >
            これから Z.ai の GLM モデル API
            を触り始めるエンジニア向けに、アカウント作成から本番運用のエラーハンドリング・コスト最適化までを順を追って解説する。全項目は
            2026年7月16日時点で docs.z.ai / z.ai
            の公式ドキュメントを直接確認し、内容を検証済みである。
          </p>
          <div
            style={{
              fontSize: "11.5px",
              color: "var(--color-text-tertiary)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              margin: "6px 0 22px",
            }}
          >
            <span style={{ color: "var(--color-text-success)" }}>✓</span>公式ドキュメント docs.z.ai
            / z.ai を直接確認して作成(2026年7月16日時点)
          </div>
        </div>

        <section id="s1">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>01</span>Z.aiとGLMモデルファミリーの概要
          </h2>
          <p className={styles.p}>
            Z.ai(旧 Zhipu AI)は GLM(General Language Model)シリーズを開発する AI
            企業で、コンシューマー向けの Z Chat と、開発者向けの API 基盤である
            <strong>Z.AI Open Platform</strong> の両方を提供している。2026年7月時点の旗艦モデルは
            <strong>GLM-5.2</strong>
            であり、1M(100万)トークンという実用レベルのコンテキスト長と、長時間タスク(long-horizon
            task)を安定して遂行できる点を最大の特徴として打ち出している。GLM-5.2
            は要件定義からデプロイ可能な成果物までの開発ワークフロー全体を、単一タスクの中で完結させることを狙って設計されたモデルである。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>モデル</th>
                  <th>位置づけ</th>
                  <th>コンテキスト長</th>
                  <th>最大出力</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-5.2</code>
                  </td>
                  <td>最新の旗艦モデル。長時間タスク・エージェント型コーディングに最適化</td>
                  <td>1M トークン</td>
                  <td>128K(=131,072)トークン</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-5.1</code> /{" "}
                    <code className={styles.codeInline}>glm-5</code> /{" "}
                    <code className={styles.codeInline}>glm-5-turbo</code>
                  </td>
                  <td>汎用の上位モデル群</td>
                  <td>〜128K程度</td>
                  <td>最大131,072</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-4.7</code> /{" "}
                    <code className={styles.codeInline}>glm-4.6</code>
                  </td>
                  <td>バランス型の実用モデル。GLM-4.7は既定でthinkingが有効</td>
                  <td>〜128K</td>
                  <td>最大131,072</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-4.5</code> 系(Air/X/AirX含む)
                  </td>
                  <td>コスト効率重視のバランス型</td>
                  <td>〜128K</td>
                  <td>最大98,304</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-4.5-flash</code> /{" "}
                    <code className={styles.codeInline}>glm-4.7-flash</code>
                  </td>
                  <td>無料枠モデル。軽量タスク・プロトタイピング向け</td>
                  <td>-</td>
                  <td>65,536〜98,304</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-5v-turbo</code> /{" "}
                    <code className={styles.codeInline}>glm-4.6v</code> /{" "}
                    <code className={styles.codeInline}>glm-4.5v</code>
                  </td>
                  <td>ビジョン(画像・動画理解)モデル</td>
                  <td>-</td>
                  <td>16,384〜131,072</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-ocr</code>
                  </td>
                  <td>文書レイアウト解析・OCR特化</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.calloutInfo}>
            <div>
              <strong>公式ベンチマーク上の位置づけ:</strong> GLM-5.2 は Terminal-Bench 2.1 で
              81.0(GLM-5.1 の 62.0 から大幅向上)、SWE-bench Pro で 62.1
              を記録し、オープンソースモデルの中で最上位、Claude Opus 4.8
              とも僅差の水準にあると公式モデルガイドで報告されている。数値は自社ベンチマークであり、実運用での体感とは異なりうる点に留意する。
            </div>
          </div>

          <p className={styles.p}>
            以下は、これから解説する開発フロー全体を俯瞰したフローチャートである。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram
              chart={`flowchart TD
    A["Z.AI Open Platformにアクセス"] --> B["アカウント登録・ログイン"]
    B --> C["Billingページで残高をチャージ"]
    C --> D["API Keyを発行"]
    D --> E["タスクに合うモデルを選択"]
    E --> F["呼び出し方法を選択(HTTP / SDK)"]
    F --> G["パラメータを設計(thinking, max_tokens等)"]
    G --> H["最初のAPIコールを実行"]
    H --> I{"成功したか?"}
    I -->|"Yes"| J["Streaming・Function Calling等を追加"]
    I -->|"No"| K["エラーコードを確認して対処"]
    K --> H
    J --> L["本番運用: キャッシュ・レート制限対策"]`}
            />
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考: <Ext href="https://z.ai/model-api">Z.AI Open Platform トップページ</Ext> /{" "}
            <Ext href="https://docs.z.ai/guides/llm/glm-5.2">GLM-5.2 モデルガイド</Ext> /{" "}
            <Ext href="https://docs.z.ai/guides/overview/quick-start">クイックスタート</Ext>
          </p>
        </section>

        <section id="s2">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>02</span>アカウント作成とAPIキー発行
          </h2>
          <p className={styles.p}>Z.ai公式クイックスタートに沿った手順は次の4段階である。</p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram
              chart={`flowchart LR
    A["1. Z.AI Open Platformで登録/ログイン"] --> B["2. Billingページで残高をチャージ"]
    B --> C["3. API Keys管理画面でキーを作成"]
    C --> D["4. キーをコピーして安全に保管"]`}
            />
          </div>

          <ol className={styles.ol}>
            <li className={styles.li}>
              <strong>
                <Ext href="https://z.ai/model-api">Z.AI Open Platform</Ext>
              </strong>
              にアクセスし、登録またはログインする。
            </li>
            <li className={styles.li}>
              必要に応じて
              <strong>
                <Ext href="https://z.ai/manage-apikey/billing">Billingページ</Ext>
              </strong>
              で残高をチャージする(従量課金のため、事前チャージが必要な場合がある)。
            </li>
            <li className={styles.li}>
              <strong>
                <Ext href="https://z.ai/manage-apikey/apikey-list">API Keys管理ページ</Ext>
              </strong>
              で新しいAPIキーを作成する。
            </li>
            <li className={styles.li}>
              発行されたキーをコピーし、環境変数やシークレット管理サービスに保存する(コードに直書きしない)。
            </li>
          </ol>

          <div className={styles.card}>
            <h4 className={styles.h4}>ベストプラクティス</h4>
            <ul className={styles.ul}>
              <li className={styles.li}>
                APIキーはリポジトリにコミットせず、<code className={styles.codeInline}>.env</code>{" "}
                ファイルや
                <code className={styles.codeInline}>ZAI_API_KEY</code>{" "}
                のような環境変数として管理する。
              </li>
              <li className={styles.li}>
                ブラウザなどクライアントサイドのコードにキーを埋め込まない。呼び出しは必ずサーバー側で行う。
              </li>
              <li className={styles.li}>
                キーはいつでも無効化・再発行できるため、漏えいの疑いがある場合は速やかに管理画面から失効させる。
              </li>
            </ul>
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考:{" "}
            <Ext href="https://docs.z.ai/guides/overview/quick-start">
              クイックスタート: Get API Key
            </Ext>
          </p>
        </section>

        <section id="s3">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>03</span>モデルを選ぶ
          </h2>
          <p className={styles.p}>
            タスクの性質によって最適なモデルは異なる。以下の判断フローを目安にするとよい。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram
              chart={`flowchart TD
    A["タスクの性質を確認"] --> B{"複雑な推論や長時間の\\nエージェント型タスクか?"}
    B -->|"Yes"| C["GLM-5.2\\n(1Mコンテキスト, reasoning_effort=max)"]
    B -->|"No"| D{"コストを最優先したいか?"}
    D -->|"Yes"| E["GLM-4.5-Flash / GLM-4.7-Flash\\n(無料枠)"]
    D -->|"No"| F{"画像や動画の理解が必要か?"}
    F -->|"Yes"| G["GLM-5V-Turbo / GLM-4.6V"]
    F -->|"No"| H["GLM-5.1 / GLM-4.6 / GLM-4.7\\n(汎用バランス型)"]`}
            />
          </div>

          <p className={styles.p}>
            GLM-5.2
            は、プロジェクト全体のコードベース理解、長期リファクタリング、実機デバッグ、研究論文の再現実装など、複数ステップにわたる開発ワークフローを1タスクで完結させることを想定して設計されている。一方、軽量なQ&amp;Aや定型処理では、無料枠のFlash系モデルや廉価なGLM-4.5-Airのほうがコスト効率がよい。
          </p>

          <div className={styles.card}>
            <h4 className={styles.h4}>ベストプラクティス</h4>
            <ul className={styles.ul}>
              <li className={styles.li}>
                まず廉価モデルで動作検証し、精度が不足する場合のみ上位モデルへ切り替える「段階的アップグレード」が費用対効果に優れる。
              </li>
              <li className={styles.li}>
                ビジョン系タスク(画像・動画・OCR)は専用のVLM(Vision-Language
                Model)を使う。テキスト専用モデルに画像を渡しても処理できない。
              </li>
              <li className={styles.li}>
                モデルコードは大文字小文字を区別しないが、公式ドキュメントの表記(例:
                <code className={styles.codeInline}>glm-5.2</code>)にそろえておくと混乱がない。
              </li>
            </ul>
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考: <Ext href="https://docs.z.ai/guides/llm/glm-5.2">GLM-5.2 モデルガイド</Ext> /{" "}
            <Ext href="https://docs.z.ai/guides/overview/pricing">Pricing(モデル一覧)</Ext> /{" "}
            <Ext href="https://docs.z.ai/guides/overview/migrate-to-glm-new">
              Migrate to GLM-5.2
            </Ext>
          </p>
        </section>

        <section id="s4">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>04</span>呼び出し方法(SDK/HTTP)を選ぶ
          </h2>
          <p className={styles.p}>
            Z.ai は複数の統合方法を公式に提供している。既存のスタックに合わせて選択する。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>方式</th>
                  <th>特徴</th>
                  <th>向いているケース</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>HTTP API(REST)</td>
                  <td>
                    言語非依存。<code className={styles.codeInline}>curl</code>
                    や任意のHTTPクライアントから利用可能
                  </td>
                  <td>言語を問わない汎用統合、簡易検証</td>
                </tr>
                <tr>
                  <td>
                    公式 Python SDK(<code className={styles.codeInline}>zai-sdk</code>)
                  </td>
                  <td>型ヒント完備、async対応</td>
                  <td>Pythonでの本格開発</td>
                </tr>
                <tr>
                  <td>
                    公式 Java SDK(<code className={styles.codeInline}>zai-sdk</code>)
                  </td>
                  <td>高並列・高可用性設計</td>
                  <td>Javaでの本格開発</td>
                </tr>
                <tr>
                  <td>OpenAI互換 SDK(Python/Node.js)</td>
                  <td>
                    既存のOpenAI用コードを<code className={styles.codeInline}>base_url</code>
                    変更のみで移行可能
                  </td>
                  <td>OpenAI SDKから移行したい場合</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={styles.h3}>エンドポイントの使い分け</h3>
          <p className={styles.p}>
            Z.aiには契約プランに応じて複数のベースURLが存在する点に注意が必要である。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>API種別</th>
                  <th>ベースURL</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>一般API(Pay-as-you-go)</td>
                  <td>
                    <code className={styles.codeInline}>https://api.z.ai/api/paas/v4/</code>
                  </td>
                  <td>通常のアプリケーション開発(Chat Completions等)</td>
                </tr>
                <tr>
                  <td>GLM Coding Plan(OpenAI互換)</td>
                  <td>
                    <code className={styles.codeInline}>https://api.z.ai/api/coding/paas/v4/</code>
                  </td>
                  <td>Cline / OpenCode / Kilo Code などOpenAI互換ツール連携</td>
                </tr>
                <tr>
                  <td>GLM Coding Plan(Anthropic互換)</td>
                  <td>
                    <code className={styles.codeInline}>https://api.z.ai/api/anthropic</code>
                  </td>
                  <td>
                    Claude Code 専用。<code className={styles.codeInline}>ANTHROPIC_BASE_URL</code>
                    にこのURLを設定して利用
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.calloutWarning}>
            <div>
              一般APIのキーをCoding
              Plan用エンドポイントに向けてしまう、あるいはその逆といった設定ミスは、実運用でよく見られる接続エラーの原因である。契約しているプラン・利用ツールに応じて正しいベースURLを選ぶこと。
            </div>
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考:{" "}
            <Ext href="https://docs.z.ai/guides/overview/quick-start">
              クイックスタート: Choose the Calling Method
            </Ext>{" "}
            / <Ext href="https://github.com/zai-org/z-ai-sdk-python">Python SDK (GitHub)</Ext> /{" "}
            <Ext href="https://docs.z.ai/guides/develop/openai/python">OpenAI互換SDK連携ガイド</Ext>{" "}
            / <Ext href="https://docs.z.ai/devpack/quick-start">Coding Plan Quick Start</Ext>
          </p>
        </section>

        <section id="s5">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>05</span>最初のAPIコール
          </h2>
          <p className={styles.p}>
            以下は Python の公式SDK(<code className={styles.codeInline}>zai-sdk</code>
            )を使った最小構成の例である。
          </p>

          <div className={styles.preBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>pip</span> install zai-sdk
            </div>
          </div>

          <div className={styles.preBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> zai <span className={styles.ck}>import</span>{" "}
              ZaiClient
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              client = <span className={styles.fn}>ZaiClient</span>(api_key=
              <span className={styles.cs}>&quot;YOUR_API_KEY&quot;</span>)
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              response = client.chat.completions.<span className={styles.fn}>create</span>(
            </div>
            <div className={styles.codeLine}>
              {"    "}model=<span className={styles.cs}>&quot;glm-5.2&quot;</span>,
            </div>
            <div className={styles.codeLine}>{"    "}messages=[</div>
            <div className={styles.codeLine}>
              {"        "}&#123;<span className={styles.cs}>&quot;role&quot;</span>:{" "}
              <span className={styles.cs}>&quot;system&quot;</span>,{" "}
              <span className={styles.cs}>&quot;content&quot;</span>:{" "}
              <span className={styles.cs}>&quot;あなたは有能なアシスタントです。&quot;</span>&#125;,
            </div>
            <div className={styles.codeLine}>
              {"        "}&#123;<span className={styles.cs}>&quot;role&quot;</span>:{" "}
              <span className={styles.cs}>&quot;user&quot;</span>,{" "}
              <span className={styles.cs}>&quot;content&quot;</span>:{" "}
              <span className={styles.cs}>&quot;自己紹介をしてください。&quot;</span>&#125;,
            </div>
            <div className={styles.codeLine}>{"    "}],</div>
            <div className={styles.codeLine}>)</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              <span className={styles.fn}>print</span>(response.choices[
              <span className={styles.cv}>0</span>].message.content)
            </div>
          </div>

          <p className={styles.p}>
            OpenAI SDKからの移行を考えているなら、
            <code className={styles.codeInline}>base_url</code>
            を変更するだけで既存コードをほぼ流用できる。
          </p>

          <div className={styles.preBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> openai{" "}
              <span className={styles.ck}>import</span> OpenAI
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              client = <span className={styles.fn}>OpenAI</span>(
            </div>
            <div className={styles.codeLine}>
              {"    "}api_key=<span className={styles.cs}>&quot;YOUR_ZAI_API_KEY&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {"    "}base_url=
              <span className={styles.cs}>&quot;https://api.z.ai/api/paas/v4/&quot;</span>,
            </div>
            <div className={styles.codeLine}>)</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              completion = client.chat.completions.<span className={styles.fn}>create</span>(
            </div>
            <div className={styles.codeLine}>
              {"    "}model=<span className={styles.cs}>&quot;glm-5.2&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {"    "}messages=[&#123;<span className={styles.cs}>&quot;role&quot;</span>:{" "}
              <span className={styles.cs}>&quot;user&quot;</span>,{" "}
              <span className={styles.cs}>&quot;content&quot;</span>:{" "}
              <span className={styles.cs}>&quot;こんにちは&quot;</span>&#125;],
            </div>
            <div className={styles.codeLine}>)</div>
            <div className={styles.codeLine}>
              <span className={styles.fn}>print</span>(completion.choices[
              <span className={styles.cv}>0</span>].message.content)
            </div>
          </div>

          <p className={styles.p}>
            GLM-5.2で複雑な推論を行わせる場合は、<code className={styles.codeInline}>thinking</code>
            と<code className={styles.codeInline}>reasoning_effort</code>
            を明示的に指定する構成が公式ガイドでも例示されている(詳細は第7章)。
          </p>

          <div className={styles.preBlock}>
            <div className={styles.codeLine}>
              response = client.chat.completions.<span className={styles.fn}>create</span>(
            </div>
            <div className={styles.codeLine}>
              {"    "}model=<span className={styles.cs}>&quot;glm-5.2&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {"    "}messages=[&#123;<span className={styles.cs}>&quot;role&quot;</span>:{" "}
              <span className={styles.cs}>&quot;user&quot;</span>,{" "}
              <span className={styles.cs}>&quot;content&quot;</span>:{" "}
              <span className={styles.cs}>&quot;この設計案のトレードオフを整理して&quot;</span>
              &#125;],
            </div>
            <div className={styles.codeLine}>
              {"    "}thinking=&#123;<span className={styles.cs}>&quot;type&quot;</span>:{" "}
              <span className={styles.cs}>&quot;enabled&quot;</span>&#125;,
            </div>
            <div className={styles.codeLine}>
              {"    "}reasoning_effort=<span className={styles.cs}>&quot;max&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {"    "}max_tokens=<span className={styles.cv}>32000</span>,
            </div>
            <div className={styles.codeLine}>)</div>
          </div>

          <div className={styles.card}>
            <h4 className={styles.h4}>ベストプラクティス</h4>
            <ul className={styles.ul}>
              <li className={styles.li}>
                本番運用ではタイムアウトとリトライ回数を明示的に設定する(
                <code className={styles.codeInline}>timeout</code>,
                <code className={styles.codeInline}>max_retries</code>
                など)。デフォルト値のまま長時間ジョブを投げると、ネットワーク瞬断で処理全体が失敗するリスクがある。
              </li>
              <li className={styles.li}>
                例外処理では、SDKが提供する<code className={styles.codeInline}>APIStatusError</code>{" "}
                /<code className={styles.codeInline}>APITimeoutError</code>
                を個別にキャッチし、第12章のエラーコード表と対応させてハンドリングする。
              </li>
            </ul>
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考:{" "}
            <Ext href="https://docs.z.ai/guides/overview/quick-start">
              クイックスタート: Make API Call
            </Ext>{" "}
            / <Ext href="https://docs.z.ai/guides/llm/glm-5.2">GLM-5.2 Quick Start</Ext> /{" "}
            <Ext href="https://github.com/zai-org/z-ai-sdk-python">Python SDK (GitHub)</Ext>
          </p>
        </section>

        <section id="s6">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>06</span>コアパラメータのベストプラクティス
          </h2>
          <p className={styles.p}>
            GLMモデルの出力品質・コスト・速度は、以下のパラメータの組み合わせで大きく変わる。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>パラメータ</th>
                  <th>型</th>
                  <th>デフォルト</th>
                  <th>役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code className={styles.codeInline}>do_sample</code>
                  </td>
                  <td>Boolean</td>
                  <td>
                    <code className={styles.codeInline}>true</code>
                  </td>
                  <td>
                    サンプリングの有無。<code className={styles.codeInline}>false</code>
                    で決定論的出力
                  </td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>temperature</code>
                  </td>
                  <td>Float</td>
                  <td>モデル依存</td>
                  <td>出力のランダム性。低いほど堅実、高いほど多様</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>top_p</code>
                  </td>
                  <td>Float</td>
                  <td>モデル依存</td>
                  <td>Nucleus samplingによる多様性制御</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>max_tokens</code>
                  </td>
                  <td>Integer</td>
                  <td>モデル依存</td>
                  <td>1回の応答で生成する最大トークン数</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>stream</code>
                  </td>
                  <td>Boolean</td>
                  <td>
                    <code className={styles.codeInline}>false</code>
                  </td>
                  <td>ストリーミング出力の有効化</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>thinking</code>
                  </td>
                  <td>Object</td>
                  <td>モデル・エンドポイントにより異なる</td>
                  <td>Chain-of-Thought(深い推論)の有効/無効</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>reasoning_effort</code>
                  </td>
                  <td>String</td>
                  <td>
                    <code className={styles.codeInline}>max</code>
                  </td>
                  <td>GLM-5.2以降で推論の深さを段階制御</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.card}>
            <h4 className={styles.h4}>ベストプラクティス</h4>
            <ul className={styles.ul}>
              <li className={styles.li}>
                事実確認や厳密な回答が必要な場面(要約・抽出・コード生成など)では
                <code className={styles.codeInline}>temperature</code>
                を低め(0.2前後)に設定する。創作・ブレインストーミングでは高め(0.8前後)にする。
              </li>
              <li className={styles.li}>
                <code className={styles.codeInline}>temperature</code>と
                <code className={styles.codeInline}>top_p</code>
                は同時に調整しない。片方だけを動かすほうが挙動を予測しやすい。
              </li>
              <li className={styles.li}>
                チャットボットやコード生成のようなインタラクティブ用途では
                <code className={styles.codeInline}>stream=true</code>
                を強く推奨する。体感レイテンシが大幅に改善される。
              </li>
              <li className={styles.li}>
                <code className={styles.codeInline}>max_tokens</code>
                は用途に応じて最小限に設定する。短い応答で十分な場合に大きすぎる値を設定すると、応答が冗長になりコストも増える。
              </li>
            </ul>
          </div>

          <h3 className={styles.h3}>モデル別 max_tokens の目安(公式ドキュメント確認済み)</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>モデルコード</th>
                  <th>デフォルト max_tokens</th>
                  <th>最大 max_tokens</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-5.2</code> /{" "}
                    <code className={styles.codeInline}>glm-5.1</code> /{" "}
                    <code className={styles.codeInline}>glm-5-turbo</code> /{" "}
                    <code className={styles.codeInline}>glm-5</code>
                  </td>
                  <td>65,536</td>
                  <td>131,072</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-4.7</code> /{" "}
                    <code className={styles.codeInline}>glm-4.6</code>
                  </td>
                  <td>65,536</td>
                  <td>131,072</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-4.5</code> /{" "}
                    <code className={styles.codeInline}>glm-4.5-air</code> /{" "}
                    <code className={styles.codeInline}>glm-4.5-x</code> /{" "}
                    <code className={styles.codeInline}>glm-4.5-airx</code> /{" "}
                    <code className={styles.codeInline}>glm-4.5-flash</code>
                  </td>
                  <td>65,536</td>
                  <td>98,304</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-5v-turbo</code>
                  </td>
                  <td>16,384</td>
                  <td>131,072</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-4.6v</code> /{" "}
                    <code className={styles.codeInline}>glm-4.6v-flash</code> /{" "}
                    <code className={styles.codeInline}>glm-4.6v-flashx</code>
                  </td>
                  <td>16,384</td>
                  <td>32,768</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-4.5v</code>
                  </td>
                  <td>16,384</td>
                  <td>16,384</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>glm-4-32b-0414-128k</code>
                  </td>
                  <td>16,384</td>
                  <td>16,384</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考: <Ext href="https://docs.z.ai/guides/overview/concept-param">Core Parameters</Ext>
          </p>
        </section>

        <section id="s7">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>07</span>Deep Thinking(推論モード)の使い分け
          </h2>
          <p className={styles.p}>
            GLM-4.5以降のモデルは、回答前に内部で段階的な思考(Chain-of-Thought)を行う「Deep
            Thinking」機能を備えている。<code className={styles.codeInline}>thinking.type</code>
            で有効/無効を切り替え、GLM-5.2以降ではさらに
            <code className={styles.codeInline}>reasoning_effort</code>
            で思考の深さを段階的に制御できる。GLM-5.2/5.1/5/4.7系ではthinkingが既定で有効(モデルがタスクの難易度を見て思考の要否を自動判断)であるのに対し、GLM-4.6のようなハイブリッドモデルは既定で無効という違いがある点に注意する。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <code className={styles.codeInline}>reasoning_effort</code>の値
                  </th>
                  <th>挙動</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code className={styles.codeInline}>max</code>(デフォルト・推奨)
                  </td>
                  <td>最も深い推論。精度重視、コストと遅延は最大</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>xhigh</code>
                  </td>
                  <td>
                    内部的に<code className={styles.codeInline}>max</code>として扱われる
                  </td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>high</code>
                  </td>
                  <td>拡張推論。精度とコストのバランス型</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>medium</code> /{" "}
                    <code className={styles.codeInline}>low</code>
                  </td>
                  <td>
                    内部的に<code className={styles.codeInline}>high</code>として扱われる
                  </td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.codeInline}>minimal</code> /{" "}
                    <code className={styles.codeInline}>none</code>
                  </td>
                  <td>思考をスキップし、即座に応答を生成</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.diagramWrap}>
            <MermaidDiagram
              chart={`flowchart LR
    A["リクエスト受信"] --> B{"thinking.type"}
    B -->|"enabled"| C{"reasoning_effort"}
    B -->|"disabled"| D["即時応答(CoTなし)"]
    C -->|"max または xhigh"| E["最大推論(高精度・高コスト)"]
    C -->|"high, medium, low"| F["拡張推論(高相当にマップ)"]
    C -->|"minimal または none"| D`}
            />
          </div>

          <h3 className={styles.h3}>
            マルチターンでの思考の扱い(Interleaved / Preserved Thinking)
          </h3>
          <p className={styles.p}>
            公式ドキュメントでは、会話が複数ターンにわたる場合の思考内容の扱いについて2つの概念が説明されている。
          </p>
          <ul className={styles.ul}>
            <li className={styles.li}>
              <strong>Interleaved thinking(会話間思考)</strong>:
              前のターンの思考内容を後続ターンの入力コンテキストに含めるかどうかの制御。既定では前ターンの
              <code className={styles.codeInline}>reasoning_content</code>
              は次ターンへ引き継がれない。
            </li>
            <li className={styles.li}>
              <strong>Preserved thinking(思考の保持)</strong>:
              <code className={styles.codeInline}>clear_thinking: false</code>
              を指定すると、直前ターンの思考過程を保持したまま次のリクエストを送れる。一般API(Pay-as-you-goエンドポイント)では既定で無効、GLM
              Coding Plan専用エンドポイントでは既定で有効という違いがある。
            </li>
          </ul>

          <div className={styles.card}>
            <h4 className={styles.h4}>ベストプラクティス</h4>
            <ul className={styles.ul}>
              <li className={styles.li}>
                複雑な設計判断・数学的推論・長期のコーディングタスクには
                <code className={styles.codeInline}>
                  thinking: &#123;&quot;type&quot;: &quot;enabled&quot;&#125;
                </code>
                と<code className={styles.codeInline}>reasoning_effort: &quot;max&quot;</code>
                を組み合わせる。
              </li>
              <li className={styles.li}>
                単純なFAQ応答や定型フォーマット変換のような軽量タスクでは
                <code className={styles.codeInline}>
                  thinking: &#123;&quot;type&quot;: &quot;disabled&quot;&#125;
                </code>
                にして応答速度とコストを最適化する。
              </li>
              <li className={styles.li}>
                ストリーミング時は<code className={styles.codeInline}>delta.reasoning_content</code>
                と<code className={styles.codeInline}>delta.content</code>
                が別フィールドとして返るため、UI側で「思考中」と「回答」を分けて表示すると体験が向上する。
              </li>
              <li className={styles.li}>
                マルチターンのエージェント的なやり取りでは、Context Cachingのヒット率を高めるために
                <code className={styles.codeInline}>clear_thinking</code>
                の設定を意図的にそろえるとよい(第11章参照)。
              </li>
              <li className={styles.li}>
                深い思考ほど出力トークン数(=課金対象)が増える。
                <code className={styles.codeInline}>max</code>は
                <code className={styles.codeInline}>high</code>
                に比べて出力トークンが大幅に増える傾向があるため、精度が本当に必要な場面に限定して使うとコストを抑えられる。
              </li>
            </ul>
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考:{" "}
            <Ext href="https://docs.z.ai/guides/capabilities/thinking-mode">
              Deep Thinking / Thinking Mode
            </Ext>{" "}
            / <Ext href="https://docs.z.ai/guides/overview/concept-param">Core Parameters</Ext>
          </p>
        </section>

        <section id="s8">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>08</span>Streaming(ストリーミング応答)
          </h2>
          <p className={styles.p}>
            ストリーミングは、生成が完了するのを待たずに逐次コンテンツを受け取る仕組みで、Server-Sent
            Events(SSE)形式で送信される。チャットボットやコード生成のようなリアルタイム性が求められるUXでは必須の機能である。
          </p>

          <div className={styles.preBlock}>
            <div className={styles.codeLine}>
              response = client.chat.completions.<span className={styles.fn}>create</span>(
            </div>
            <div className={styles.codeLine}>
              {"    "}model=<span className={styles.cs}>&quot;glm-5.2&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {"    "}messages=[&#123;<span className={styles.cs}>&quot;role&quot;</span>:{" "}
              <span className={styles.cs}>&quot;user&quot;</span>,{" "}
              <span className={styles.cs}>&quot;content&quot;</span>:{" "}
              <span className={styles.cs}>&quot;春をテーマにした短い文章を書いて&quot;</span>
              &#125;],
            </div>
            <div className={styles.codeLine}>
              {"    "}stream=<span className={styles.ce}>True</span>,
            </div>
            <div className={styles.codeLine}>)</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              collected = <span className={styles.cs}>&quot;&quot;</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>for</span> chunk <span className={styles.ck}>in</span>{" "}
              response:
            </div>
            <div className={styles.codeLine}>
              {"    "}
              <span className={styles.ck}>if not</span> chunk.choices:
            </div>
            <div className={styles.codeLine}>
              {"        "}
              <span className={styles.ck}>continue</span>
            </div>
            <div className={styles.codeLine}>
              {"    "}delta = chunk.choices[<span className={styles.cv}>0</span>].delta
            </div>
            <div className={styles.codeLine}>
              {"    "}
              <span className={styles.ck}>if</span> <span className={styles.fn}>getattr</span>
              (delta, <span className={styles.cs}>&quot;content&quot;</span>,{" "}
              <span className={styles.ce}>None</span>):
            </div>
            <div className={styles.codeLine}>{"        "}collected += delta.content</div>
            <div className={styles.codeLine}>
              {"        "}
              <span className={styles.fn}>print</span>(delta.content, end=
              <span className={styles.cs}>&quot;&quot;</span>, flush=
              <span className={styles.ce}>True</span>)
            </div>
            <div className={styles.codeLine}>
              {"    "}
              <span className={styles.ck}>if</span> chunk.choices[
              <span className={styles.cv}>0</span>].finish_reason:
            </div>
            <div className={styles.codeLine}>
              {"        "}
              <span className={styles.fn}>print</span>(f
              <span className={styles.cs}>
                &quot;\n完了理由: &#123;chunk.choices[0].finish_reason&#125;&quot;
              </span>
              )
            </div>
          </div>

          <div className={styles.card}>
            <h4 className={styles.h4}>ベストプラクティス</h4>
            <ul className={styles.ul}>
              <li className={styles.li}>
                各チャンクの<code className={styles.codeInline}>choices[0].delta.content</code>
                を都度連結してUIに反映する。最後のチャンクにのみ
                <code className={styles.codeInline}>finish_reason</code>と
                <code className={styles.codeInline}>usage</code>
                (トークン使用量)が含まれる点に注意する。
              </li>
              <li className={styles.li}>
                ストリーミング中にAPIが異常終了した場合、通常のエラーコードではなく
                <code className={styles.codeInline}>finish_reason</code>
                フィールドに理由が格納される。ストリーミング処理では
                <code className={styles.codeInline}>finish_reason</code>の監視を必ず実装する。
              </li>
              <li className={styles.li}>
                Deep Thinkingと併用する場合は
                <code className={styles.codeInline}>delta.reasoning_content</code>
                も同時に監視し、UIで思考過程と最終回答を区別する。
              </li>
              <li className={styles.li}>
                Function
                Callingと組み合わせる場合、ツール呼び出し引数もストリーミングで分割配信されるため、JSON断片を正しく連結してからパースする。
              </li>
            </ul>
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考:{" "}
            <Ext href="https://docs.z.ai/guides/capabilities/streaming">Streaming Messages</Ext>
          </p>
        </section>

        <section id="s9">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>09</span>Function Calling(関数呼び出し)
          </h2>
          <p className={styles.p}>
            Function
            CallingはAIモデルが外部関数・APIを呼び出せるようにする仕組みで、天気取得・DB検索・計算・外部サービス連携などエージェント的な振る舞いを実現する基盤になる。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram
              chart={`sequenceDiagram
    participant U as "ユーザー"
    participant App as "アプリケーション"
    participant API as "Z.AI Chat Completions API"
    participant Fn as "外部関数"

    U->>App: "質問を送信"
    App->>API: "messages + tools を送信"
    API-->>App: "tool_calls を返却"
    App->>Fn: "関数を実行(引数はJSON文字列)"
    Fn-->>App: "実行結果を返却"
    App->>API: "role='tool' で結果を追加送信"
    API-->>App: "最終応答を生成"
    App-->>U: "回答を表示"`}
            />
          </div>

          <p className={styles.p}>基本的な実装パターンは以下の通り。</p>

          <div className={styles.preBlock}>
            <div className={styles.codeLine}>import json</div>
            <div className={styles.codeLine}>from zai import ZaiClient</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>
              client = ZaiClient(api_key=&quot;YOUR_API_KEY&quot;)
            </div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>tools = [&#123;</div>
            <div className={styles.codeLine}> &quot;type&quot;: &quot;function&quot;,</div>
            <div className={styles.codeLine}> &quot;function&quot;: &#123;</div>
            <div className={styles.codeLine}> &quot;name&quot;: &quot;get_weather&quot;,</div>
            <div className={styles.codeLine}>
              {" "}
              &quot;description&quot;: &quot;指定した都市の現在の天気情報を取得する&quot;,
            </div>
            <div className={styles.codeLine}> &quot;parameters&quot;: &#123;</div>
            <div className={styles.codeLine}> &quot;type&quot;: &quot;object&quot;,</div>
            <div className={styles.codeLine}> &quot;properties&quot;: &#123;</div>
            <div className={styles.codeLine}>
              {" "}
              &quot;city&quot;: &#123;&quot;type&quot;: &quot;string&quot;, &quot;description&quot;:
              &quot;都市名。例: 東京、大阪&quot;&#125;
            </div>
            <div className={styles.codeLine}> &#125;,</div>
            <div className={styles.codeLine}> &quot;required&quot;: [&quot;city&quot;],</div>
            <div className={styles.codeLine}> &#125;,</div>
            <div className={styles.codeLine}> &#125;,</div>
            <div className={styles.codeLine}>&#125;]</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>
              messages = [&#123;&quot;role&quot;: &quot;user&quot;, &quot;content&quot;:
              &quot;東京の天気は?&quot;&#125;]
            </div>
            <div className={styles.codeLine}>response = client.chat.completions.create(</div>
            <div className={styles.codeLine}>
              {" "}
              model=&quot;glm-5.2&quot;, messages=messages, tools=tools,
              tool_choice=&quot;auto&quot;
            </div>
            <div className={styles.codeLine}>)</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>message = response.choices[0].message</div>
            <div className={styles.codeLine}>messages.append(message.model_dump())</div>
            <div className={styles.codeLine}></div>
            <div className={styles.codeLine}>if message.tool_calls:</div>
            <div className={styles.codeLine}> for call in message.tool_calls:</div>
            <div className={styles.codeLine}> args = json.loads(call.function.arguments)</div>
            <div className={styles.codeLine}>
              {" "}
              weather = &#123;&quot;city&quot;: args[&quot;city&quot;], &quot;temperature&quot;:
              &quot;22C&quot;, &quot;condition&quot;: &quot;晴れ&quot;&#125;
            </div>
            <div className={styles.codeLine}> messages.append(&#123;</div>
            <div className={styles.codeLine}> &quot;role&quot;: &quot;tool&quot;,</div>
            <div className={styles.codeLine}>
              {" "}
              &quot;content&quot;: json.dumps(weather, ensure_ascii=False),
            </div>
            <div className={styles.codeLine}> &quot;tool_call_id&quot;: call.id,</div>
            <div className={styles.codeLine}> &#125;)</div>
            <div className={styles.codeLine}>
              {" "}
              final = client.chat.completions.create(model=&quot;glm-5.2&quot;, messages=messages,
              tools=tools)
            </div>
            <div className={styles.codeLine}> print(final.choices[0].message.content)</div>
          </div>

          <div className={styles.card}>
            <h4 className={styles.h4}>ベストプラクティス</h4>
            <ul className={styles.ul}>
              <li className={styles.li}>
                <strong>単一責任の原則</strong>: 1つの関数には1つの役割のみを持たせる。
              </li>
              <li className={styles.li}>
                <strong>明確な命名と詳細な説明</strong>:
                関数名・パラメータ名・descriptionは、モデルが誤解なく解釈できるよう具体的に書く(都市名の記入例を挙げるなど)。
              </li>
              <li className={styles.li}>
                <strong>入力検証を必ず行う</strong>:
                関数呼び出しはコード実行を伴うため、SQLインジェクションや危険な文字列のフィルタリングなど、通常のバックエンド開発と同等のセキュリティ対策を実施する。
              </li>
              <li className={styles.li}>
                <strong>権限制御</strong>:
                関数がDB操作やファイル操作を行う場合、呼び出し元ユーザーの権限チェックを関数内部で行う。
              </li>
              <li className={styles.li}>
                <strong>エラーを構造化して返す</strong>: 関数内部で例外が起きた場合も
                <code className={styles.codeInline}>
                  &#123;&quot;success&quot;: false, &quot;error&quot;: &quot;...&quot;,
                  &quot;error_code&quot;: &quot;...&quot;&#125;
                </code>
                のような一貫した形式で返すと、モデルが後続の応答生成でエラー内容を適切に扱える。
              </li>
              <li className={styles.li}>
                <code className={styles.codeInline}>tool_choice</code>は現状
                <code className={styles.codeInline}>auto</code>のみのサポートである点に留意する。
              </li>
            </ul>
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考:{" "}
            <Ext href="https://docs.z.ai/guides/capabilities/function-calling">
              Function Calling
            </Ext>
          </p>
        </section>

        <section id="s10">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>10</span>Structured Output(構造化出力/JSONモード)
          </h2>
          <p className={styles.p}>
            <code className={styles.codeInline}>
              response_format: &#123;&quot;type&quot;: &quot;json_object&quot;&#125;
            </code>
            を指定すると、モデルは自由文ではなく事前定義した構造に沿ったJSONを返すようになる。感情分析、情報抽出、レポート整形など、後続システムでパースする前提の処理に向いている。
          </p>

          <div className={styles.preBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>import</span> json
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> zai <span className={styles.ck}>import</span>{" "}
              ZaiClient
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              client = <span className={styles.fn}>ZaiClient</span>(api_key=
              <span className={styles.cs}>&quot;YOUR_API_KEY&quot;</span>)
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              schema_prompt = <span className={styles.cs}>&quot;&quot;&quot;</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.cs}>以下のJSON形式で感情分析結果を返してください:</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.cs}>&#123;</span>
            </div>
            <div className={styles.codeLine}>
              {"  "}
              <span className={styles.cs}>
                &quot;sentiment&quot;: &quot;positive/negative/neutral&quot;,
              </span>
            </div>
            <div className={styles.codeLine}>
              {"  "}
              <span className={styles.cs}>&quot;confidence&quot;: 0.95,</span>
            </div>
            <div className={styles.codeLine}>
              {"  "}
              <span className={styles.cs}>
                &quot;keywords&quot;: [&quot;キーワード1&quot;, &quot;キーワード2&quot;]
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.cs}>&#125;</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.cs}>&quot;&quot;&quot;</span>
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              response = client.chat.completions.<span className={styles.fn}>create</span>(
            </div>
            <div className={styles.codeLine}>
              {"    "}model=<span className={styles.cs}>&quot;glm-5.2&quot;</span>,
            </div>
            <div className={styles.codeLine}>{"    "}messages=[</div>
            <div className={styles.codeLine}>
              {"        "}&#123;<span className={styles.cs}>&quot;role&quot;</span>:{" "}
              <span className={styles.cs}>&quot;system&quot;</span>,{" "}
              <span className={styles.cs}>&quot;content&quot;</span>: schema_prompt&#125;,
            </div>
            <div className={styles.codeLine}>
              {"        "}&#123;<span className={styles.cs}>&quot;role&quot;</span>:{" "}
              <span className={styles.cs}>&quot;user&quot;</span>,{" "}
              <span className={styles.cs}>&quot;content&quot;</span>:{" "}
              <span className={styles.cs}>&quot;今日は天気が良くて気分がいい!&quot;</span>&#125;,
            </div>
            <div className={styles.codeLine}>{"    "}],</div>
            <div className={styles.codeLine}>
              {"    "}response_format=&#123;<span className={styles.cs}>&quot;type&quot;</span>:{" "}
              <span className={styles.cs}>&quot;json_object&quot;</span>&#125;,
            </div>
            <div className={styles.codeLine}>)</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              result = json.<span className={styles.fn}>loads</span>(response.choices[
              <span className={styles.cv}>0</span>].message.content)
            </div>
            <div className={styles.codeLine}>
              <span className={styles.fn}>print</span>(result[
              <span className={styles.cs}>&quot;sentiment&quot;</span>], result[
              <span className={styles.cs}>&quot;confidence&quot;</span>])
            </div>
          </div>

          <p className={styles.p}>
            より厳密な検証が必要な場合は、<code className={styles.codeInline}>jsonschema</code>
            ライブラリでスキーマバリデーションを組み合わせるとよい。
          </p>

          <div className={styles.preBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>from</span> jsonschema{" "}
              <span className={styles.ck}>import</span> validate
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>schema = &#123;</div>
            <div className={styles.codeLine}>
              {"    "}
              <span className={styles.cs}>&quot;type&quot;</span>:{" "}
              <span className={styles.cs}>&quot;object&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {"    "}
              <span className={styles.cs}>&quot;properties&quot;</span>: &#123;
            </div>
            <div className={styles.codeLine}>
              {"        "}
              <span className={styles.cs}>&quot;sentiment&quot;</span>: &#123;
              <span className={styles.cs}>&quot;type&quot;</span>:{" "}
              <span className={styles.cs}>&quot;string&quot;</span>,{" "}
              <span className={styles.cs}>&quot;enum&quot;</span>: [
              <span className={styles.cs}>&quot;positive&quot;</span>,{" "}
              <span className={styles.cs}>&quot;negative&quot;</span>,{" "}
              <span className={styles.cs}>&quot;neutral&quot;</span>]&#125;,
            </div>
            <div className={styles.codeLine}>
              {"        "}
              <span className={styles.cs}>&quot;confidence&quot;</span>: &#123;
              <span className={styles.cs}>&quot;type&quot;</span>:{" "}
              <span className={styles.cs}>&quot;number&quot;</span>,{" "}
              <span className={styles.cs}>&quot;minimum&quot;</span>:{" "}
              <span className={styles.cv}>0</span>,{" "}
              <span className={styles.cs}>&quot;maximum&quot;</span>:{" "}
              <span className={styles.cv}>1</span>&#125;,
            </div>
            <div className={styles.codeLine}>{"    "}&#125;,</div>
            <div className={styles.codeLine}>
              {"    "}
              <span className={styles.cs}>&quot;required&quot;</span>: [
              <span className={styles.cs}>&quot;sentiment&quot;</span>,{" "}
              <span className={styles.cs}>&quot;confidence&quot;</span>],
            </div>
            <div className={styles.codeLine}>&#125;</div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              <span className={styles.fn}>validate</span>(instance=result, schema=schema)
            </div>
          </div>

          <div className={styles.card}>
            <h4 className={styles.h4}>ベストプラクティス</h4>
            <ul className={styles.ul}>
              <li className={styles.li}>
                スキーマは最初はシンプルに設計し、必要に応じて段階的に複雑化する。
              </li>
              <li className={styles.li}>
                各フィールドに具体例(examples)や制約(enum,
                minimum/maximumなど)を明記すると、モデルの出力精度が上がる。
              </li>
              <li className={styles.li}>
                モデル出力を必ず<code className={styles.codeInline}>json.loads</code>
                等でパースし、失敗時・スキーマ不一致時のフォールバック処理(簡易スキーマへの切り替え、再試行など)を用意する。
              </li>
              <li className={styles.li}>
                情報量が多すぎるJSON構造を一度に要求すると、モデルの追従性が落ちる場合がある。抽出対象が多い場合は複数回のリクエストに分割することも検討する。
              </li>
            </ul>
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考:{" "}
            <Ext href="https://docs.z.ai/guides/capabilities/struct-output">Structured Output</Ext>
          </p>
        </section>

        <section id="s11">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>11</span>Context Caching(コンテキストキャッシュ)
          </h2>
          <p className={styles.p}>
            Context
            Cachingは、システムプロンプトや会話履歴など繰り返し送信される内容を自動的に検知し、再計算を省略することでレイテンシとコストを削減する機能である。Z.aiでは
            <strong>追加設定なしの暗黙的キャッシュ(Implicit Caching)</strong>
            として実装されており、キャッシュヒット状況は応答の
            <code className={styles.codeInline}>usage.prompt_tokens_details.cached_tokens</code>
            フィールドで確認できる。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram
              chart={`flowchart LR
    A["安定したSystem Promptを先頭に配置"] --> B["可変部分(ユーザー入力)を末尾に配置"]
    B --> C["リクエスト送信"]
    C --> D{"先頭部分が\\n過去のリクエストと一致?"}
    D -->|"Yes"| E["cached_tokensとして低単価で課金"]
    D -->|"No"| F["通常価格で処理し、新規キャッシュとして記録"]
    E --> G["usage.prompt_tokens_details.cached_tokensで確認"]
    F --> G`}
            />
          </div>

          <div className={styles.preBlock}>
            <div className={styles.codeLine}>
              response = client.chat.completions.<span className={styles.fn}>create</span>(
            </div>
            <div className={styles.codeLine}>
              {"    "}model=<span className={styles.cs}>&quot;glm-5.2&quot;</span>,
            </div>
            <div className={styles.codeLine}>{"    "}messages=[...],</div>
            <div className={styles.codeLine}>)</div>
            <div className={styles.codeLine}>usage = response.usage</div>
            <div className={styles.codeLine}>
              <span className={styles.fn}>print</span>(
              <span className={styles.cs}>&quot;total prompt tokens:&quot;</span>,
              usage.prompt_tokens)
            </div>
            <div className={styles.codeLine}>
              <span className={styles.fn}>print</span>(
              <span className={styles.cs}>&quot;cached tokens:&quot;</span>,
              usage.prompt_tokens_details.cached_tokens)
            </div>
          </div>

          <div className={styles.card}>
            <h4 className={styles.h4}>ベストプラクティス</h4>
            <ul className={styles.ul}>
              <li className={styles.li}>
                <strong>安定したプレフィックスを先頭に置く</strong>:
                システムプロンプトや長文ドキュメントなど変化しない部分をメッセージの先頭に、ユーザーごとに変わる質問文を末尾に配置する。キャッシュは先頭からの一致度で判定されるため、この順序が極めて重要である。
              </li>
              <li className={styles.li}>
                <strong>同一システムプロンプトの使い回し</strong>:
                マルチターン会話や、同じ指示文で複数タスクを処理するバッチ処理では、システムプロンプトを変更せず固定することでキャッシュ効率が最大化する。
              </li>
              <li className={styles.li}>
                <strong>長文ドキュメントをシステムメッセージ化</strong>:
                同じ文書に対して複数の質問を行う場合、文書内容をシステムメッセージとして固定し、質問部分だけをユーザーメッセージとして変える設計にすると、文書部分がキャッシュされ大幅なコスト削減になる。
              </li>
              <li className={styles.li}>
                キャッシュされたトークンは通常価格より大幅に安い単価で課金される(第13章の料金表を参照)。GLM
                Coding Planのようなエージェント型の連続呼び出しでは特に効果が大きい。
              </li>
            </ul>
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考: <Ext href="https://docs.z.ai/guides/capabilities/cache">Context Caching</Ext>
          </p>
        </section>

        <section id="s12">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>12</span>エラーハンドリングとレート制限対応
          </h2>
          <p className={styles.p}>
            Z.aiのAPIエラーは「外側のHTTPステータスコード」と「内側のビジネスエラーコード」の二層構造になっている。
          </p>

          <div className={styles.preBlock}>
            <div className={styles.codeLine}>&#123;</div>
            <div className={styles.codeLine}>
              {"  "}
              <span className={styles.cs}>&quot;error&quot;</span>: &#123;
            </div>
            <div className={styles.codeLine}>
              {"    "}
              <span className={styles.cs}>&quot;code&quot;</span>:{" "}
              <span className={styles.cs}>&quot;1214&quot;</span>,
            </div>
            <div className={styles.codeLine}>
              {"    "}
              <span className={styles.cs}>&quot;message&quot;</span>:{" "}
              <span className={styles.cs}>
                &quot;Parameter `$&#123;field&#125;` is invalid. Please check the
                documentation.&quot;
              </span>
            </div>
            <div className={styles.codeLine}>{"  "}&#125;</div>
            <div className={styles.codeLine}>&#125;</div>
          </div>

          <h3 className={styles.h3}>主要なエラーコード一覧(公式APIリファレンス確認済み)</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>コード</th>
                  <th>HTTPステータス</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>-</td>
                  <td>500</td>
                  <td>Internal Error(内部エラー)</td>
                </tr>
                <tr>
                  <td>1000</td>
                  <td>401</td>
                  <td>認証失敗</td>
                </tr>
                <tr>
                  <td>1001</td>
                  <td>401</td>
                  <td>Header内に認証パラメータがなく認証不可</td>
                </tr>
                <tr>
                  <td>1003</td>
                  <td>401</td>
                  <td>認証トークンの期限切れ。再発行が必要</td>
                </tr>
                <tr>
                  <td>1005</td>
                  <td>401</td>
                  <td>二要素認証が必要</td>
                </tr>
                <tr>
                  <td>1113</td>
                  <td>429</td>
                  <td>残高不足またはリソースパッケージ未購入</td>
                </tr>
                <tr>
                  <td>1200</td>
                  <td>400</td>
                  <td>リクエストパラメータの形式が不正</td>
                </tr>
                <tr>
                  <td>1210</td>
                  <td>400</td>
                  <td>APIパラメータが不正</td>
                </tr>
                <tr>
                  <td>1211</td>
                  <td>400</td>
                  <td>不明なモデル(モデルコードを要確認)</td>
                </tr>
                <tr>
                  <td>1212</td>
                  <td>400</td>
                  <td>現在のモデルはこの呼び出し方法に非対応</td>
                </tr>
                <tr>
                  <td>1213</td>
                  <td>400</td>
                  <td>必須パラメータが未指定</td>
                </tr>
                <tr>
                  <td>1214</td>
                  <td>400</td>
                  <td>パラメータの値が不正</td>
                </tr>
                <tr>
                  <td>1215</td>
                  <td>400</td>
                  <td>同時指定できないパラメータの組み合わせ</td>
                </tr>
                <tr>
                  <td>1220</td>
                  <td>403</td>
                  <td>該当APIへのアクセス権限なし</td>
                </tr>
                <tr>
                  <td>1221 / 1222</td>
                  <td>400</td>
                  <td>APIが廃止済み/存在しない</td>
                </tr>
                <tr>
                  <td>1230</td>
                  <td>400</td>
                  <td>コンテンツがプラットフォームの利用規約に抵触</td>
                </tr>
                <tr>
                  <td>1234</td>
                  <td>500</td>
                  <td>ネットワークエラー(一時的なもの)</td>
                </tr>
                <tr>
                  <td>1261</td>
                  <td>400</td>
                  <td>プロンプトが長すぎる</td>
                </tr>
                <tr>
                  <td>1301</td>
                  <td>400</td>
                  <td>入力または生成内容に安全性上の懸念を検知</td>
                </tr>
                <tr>
                  <td>1302</td>
                  <td>429</td>
                  <td>リクエストのレート制限に到達</td>
                </tr>
                <tr>
                  <td>1305</td>
                  <td>500</td>
                  <td>サービス側が一時的に過負荷状態</td>
                </tr>
                <tr>
                  <td>1308 / 1310</td>
                  <td>429</td>
                  <td>利用上限到達(リセット時刻まで待機が必要)</td>
                </tr>
                <tr>
                  <td>1309</td>
                  <td>429</td>
                  <td>GLM Coding Planの契約期限切れ</td>
                </tr>
                <tr>
                  <td>1311</td>
                  <td>429</td>
                  <td>現在のプランでは当該モデルに未対応</td>
                </tr>
                <tr>
                  <td>1313</td>
                  <td>429</td>
                  <td>Fair Usage Policy違反によるレート制限</td>
                </tr>
                <tr>
                  <td>1314〜1321</td>
                  <td>429 / 400</td>
                  <td>
                    プラン別の詳細な利用制限(モデル別クォータ、同時実行数上限など)。詳細は公式一覧を参照
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.diagramWrap}>
            <MermaidDiagram
              chart={`flowchart TD
    A["APIリクエスト送信"] --> B{"HTTPステータス"}
    B -->|"200"| C["正常応答を処理"]
    B -->|"401"| D["APIキー・認証情報を確認(1000/1001/1003)"]
    B -->|"400"| E["パラメータを確認(1210〜1215)"]
    B -->|"429"| F{"エラーコードで分岐"}
    F -->|"1113 残高不足"| G["Billingページでチャージ"]
    F -->|"1302 レート制限"| H["Exponential Backoffで再試行"]
    F -->|"1308/1310 利用上限"| I["reset時刻まで待機 or 上位プランへ変更"]
    B -->|"500"| J["一時的エラーとして再試行(1234/1305)"]
    H --> A
    J --> A`}
            />
          </div>

          <div className={styles.card}>
            <h4 className={styles.h4}>ベストプラクティス</h4>
            <ul className={styles.ul}>
              <li className={styles.li}>
                <strong>Exponential Backoff(指数バックオフ)を実装する</strong>:
                429(レート制限)や500系エラーに対しては、即座に再試行せず待機時間を段階的に延ばしながらリトライする。Pythonでは
                <code className={styles.codeInline}>tenacity</code>ライブラリなどが利用しやすい。
              </li>
              <li className={styles.li}>
                <strong>エラーコードごとに分岐処理を実装する</strong>:
                401系は認証情報の再確認、400系はリクエスト内容の見直し、429系は待機またはプラン変更、500系は一時的リトライ、というように対応を分ける。
              </li>
              <li className={styles.li}>
                <strong>
                  ストリーミング時は<code className={styles.codeInline}>finish_reason</code>
                  を監視する
                </strong>
                : SSE接続中に異常終了した場合は通常のエラーオブジェクトが返らず、
                <code className={styles.codeInline}>finish_reason</code>に理由が入る点を再確認する。
              </li>
              <li className={styles.li}>
                <strong>一般APIとCoding Plan APIのエンドポイント取り違えに注意</strong>:
                契約プランと異なるベースURLにリクエストすると、認証エラーや接続エラー(タイムアウト・切断)が発生しやすい。
              </li>
            </ul>
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考:{" "}
            <Ext href="https://docs.z.ai/api-reference/api-code">Errors(エラーコード一覧)</Ext>
          </p>
        </section>

        <section id="s13">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>13</span>料金体系とコスト最適化
          </h2>
          <p className={styles.p}>
            Z.aiの料金は100万トークンあたりの単価で設定されており、入力・キャッシュ入力・出力でそれぞれ異なる単価が設定されている。以下は公式Pricingページに掲載されている主要テキストモデルの料金(2026年7月16日時点、単位:
            USD/1Mトークン)である。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>モデル</th>
                  <th>入力</th>
                  <th>キャッシュ入力</th>
                  <th>出力</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>GLM-5.2</strong>
                  </td>
                  <td>$1.4</td>
                  <td>$0.26</td>
                  <td>$4.4</td>
                </tr>
                <tr>
                  <td>GLM-5.1</td>
                  <td>$1.4</td>
                  <td>$0.26</td>
                  <td>$4.4</td>
                </tr>
                <tr>
                  <td>GLM-5</td>
                  <td>$1.0</td>
                  <td>$0.2</td>
                  <td>$3.2</td>
                </tr>
                <tr>
                  <td>GLM-5-Turbo</td>
                  <td>$1.2</td>
                  <td>$0.24</td>
                  <td>$4.0</td>
                </tr>
                <tr>
                  <td>GLM-4.7</td>
                  <td>$0.6</td>
                  <td>$0.11</td>
                  <td>$2.2</td>
                </tr>
                <tr>
                  <td>GLM-4.7-FlashX</td>
                  <td>$0.07</td>
                  <td>$0.01</td>
                  <td>$0.4</td>
                </tr>
                <tr>
                  <td>GLM-4.6</td>
                  <td>$0.6</td>
                  <td>$0.11</td>
                  <td>$2.2</td>
                </tr>
                <tr>
                  <td>GLM-4.5</td>
                  <td>$0.6</td>
                  <td>$0.11</td>
                  <td>$2.2</td>
                </tr>
                <tr>
                  <td>GLM-4.5-X</td>
                  <td>$2.2</td>
                  <td>$0.45</td>
                  <td>$8.9</td>
                </tr>
                <tr>
                  <td>GLM-4.5-Air</td>
                  <td>$0.2</td>
                  <td>$0.03</td>
                  <td>$1.1</td>
                </tr>
                <tr>
                  <td>GLM-4.5-AirX</td>
                  <td>$1.1</td>
                  <td>$0.22</td>
                  <td>$4.5</td>
                </tr>
                <tr>
                  <td>GLM-4-32B-0414-128K</td>
                  <td>$0.1</td>
                  <td>-</td>
                  <td>$0.1</td>
                </tr>
                <tr>
                  <td>GLM-4.7-Flash / GLM-4.5-Flash</td>
                  <td>無料</td>
                  <td>無料</td>
                  <td>無料</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.calloutSuccess}>
            <div>
              <strong>検証済み更新:</strong>
              GLM-5.2は公式Pricingページに正式掲載されており、単価はGLM-5.1と同水準(入力$1.4 /
              キャッシュ入力$0.26 /
              出力$4.4、100万トークンあたり)であることを直接確認した。ビジョンモデル・画像/動画生成モデル・組み込みツール(Web
              Search等)にもそれぞれ料金が設定されているため、詳細は公式ページを参照のこと。
            </div>
          </div>

          <div className={styles.card}>
            <h4 className={styles.h4}>コスト最適化のベストプラクティス</h4>
            <ul className={styles.ul}>
              <li className={styles.li}>
                <strong>タスクの複雑さに応じたモデル選定</strong>:
                すべてのリクエストに旗艦モデルを使うのではなく、軽量タスクにはFlash系無料モデルやGLM-4.5-Airのような廉価モデルを割り当てる「モデルルーティング」を行う。
              </li>
              <li className={styles.li}>
                <strong>出力トークンの単価は入力の3〜4倍程度高い</strong>ため、
                <code className={styles.codeInline}>max_tokens</code>
                を適切に絞り、不要に長い応答を避ける。
              </li>
              <li className={styles.li}>
                <strong>Context Cachingを活用する</strong>(第11章参照):
                固定プロンプト部分をキャッシュヒットさせることで入力コストを大幅に下げられる。
              </li>
              <li className={styles.li}>
                <strong>reasoning_effortを用途に応じて下げる</strong>(第7章参照):
                <code className={styles.codeInline}>max</code>
                は精度が高い分、出力トークン数が大きく増えるため課金額も増える。要求精度に見合った設定にする。
              </li>
              <li className={styles.li}>
                <strong>
                  無料枠モデル(Flash系)でプロトタイピングし、精度検証後に有料モデルへ移行する
                </strong>
                段階的な検証フローがコスト面で有利である。
              </li>
            </ul>
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考: <Ext href="https://docs.z.ai/guides/overview/pricing">Pricing</Ext>
          </p>
        </section>

        <section id="s14">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>14</span>GLM Coding Plan とコーディングエージェント運用
          </h2>
          <p className={styles.p}>
            Z.aiは、Claude Code・Cline・OpenCode・Kilo
            Codeなど主要なコーディングエージェントツールと連携できる<strong>GLM Coding Plan</strong>
            というサブスクリプション型プランを提供している。通常のPay-as-you-go
            APIとは別のエンドポイントを使用する点は第4章で述べた通りである。
          </p>

          <h3 className={styles.h3}>プラン階層の概要</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>プラン</th>
                  <th>位置づけ</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lite</td>
                  <td>個人・軽量利用向けの入門プラン</td>
                  <td>月額固定料金でプロンプト送信数に上限あり</td>
                </tr>
                <tr>
                  <td>Pro</td>
                  <td>個人開発者の日常利用向け</td>
                  <td>Liteより高いプロンプト上限、ピーク時倍率の緩和</td>
                </tr>
                <tr>
                  <td>Max</td>
                  <td>チーム・重量級エージェントタスク向け</td>
                  <td>最上位のプロンプト上限、複数エージェントの並行実行に対応</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.calloutInfo}>
            <div>
              公式ドキュメントでは、ピーク時間帯・オフピーク時間帯でプロンプト消費倍率が変動する仕組み(ピーク時は消費倍率が上がる)が説明されている。加えて、Vision・Web
              Search・Web
              Reader・Zreadといった補助機能をMCP経由で呼び出せる専用クォータが、契約プランごとに月次で付与される。正確な上限値・倍率・期間限定キャンペーンの有無は変動するため、契約前に必ず公式ページの最新表を確認すること。
            </div>
          </div>

          <h3 className={styles.h3}>Claude Codeとの接続設定</h3>
          <p className={styles.p}>
            Claude CodeはAnthropic互換のAPI形状を要求するため、OpenAI互換のCoding
            Planエンドポイントではなく、専用のAnthropic互換エンドポイントを環境変数で指定する。
          </p>

          <div className={styles.preBlock}>
            <div className={styles.codeLine}>
              <span className={styles.ck}>export</span> ANTHROPIC_BASE_URL=
              <span className={styles.cs}>&quot;https://api.z.ai/api/anthropic&quot;</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.ck}>export</span> ANTHROPIC_AUTH_TOKEN=
              <span className={styles.cs}>&quot;YOUR_ZAI_API_KEY&quot;</span>
            </div>
          </div>

          <h3 className={styles.h3}>コーディングエージェント運用の考え方</h3>
          <p className={styles.p}>
            Z.ai公式のBest
            Practiceガイドでは、エージェントの成果物の質を安定させるための実践として、おおむね次のような観点が挙げられている。
          </p>

          <ul className={styles.ul}>
            <li className={styles.li}>
              <strong>タスクコンテキストを丁寧に設計する</strong>:
              単発の質問応答として使うのではなく、目的・変更範囲・リスク境界・検証方法を明示したタスク記述を与える。
            </li>
            <li className={styles.li}>
              <strong>大きなタスクを検証可能な単位に分割する</strong>:
              一度に広範囲の変更を依頼せず、レビューやテストがしやすい粒度に区切って進める。
            </li>
            <li className={styles.li}>
              <strong>Skill(再利用可能なワークフローテンプレート)を活用する</strong>:
              繰り返し使う定型作業(コードレビュー観点、デプロイ前チェックなど)は、都度プロンプトで説明するのではなく、構造化されたSkillとして登録し一貫した挙動を得る。
            </li>
            <li className={styles.li}>
              <strong>MCP(Model Context Protocol)で外部ツールと接続する</strong>:
              コードホスティング・データベース・社内ツールなどをMCP経由で接続し、エージェントが常に最新のコンテキストを取得できるようにする。
            </li>
            <li className={styles.li}>
              <strong>ビルド・Lint・テストを実行環境に組み込む</strong>:
              エージェントが自分の変更を検証できる仕組みを用意し、フィードバックループを短くする。
            </li>
            <li className={styles.li}>
              <strong>セッションを目的ごとに分離する</strong>:
              無関係なタスクを同一セッションに詰め込むと、コンテキストが肥大化し精度が落ちる。タスクの単位でセッションを区切る。
            </li>
            <li className={styles.li}>
              <strong>長期記憶の仕組みを活用する</strong>:
              プロジェクト固有の規約や過去の意思決定を、セッションをまたいで参照できる仕組み(メモリ機構)に記録しておく。
            </li>
          </ul>

          <div className={styles.diagramWrap}>
            <MermaidDiagram
              chart={`flowchart TD
    A["タスクを定義(目的・範囲・検証方法)"] --> B["関連コンテキストをMCP等で取得"]
    B --> C["エージェントに実行を委任"]
    C --> D["ビルド・Lint・テストを実行させる"]
    D --> E{"検証結果はOKか?"}
    E -->|"Yes"| F["結果をレビューしてマージ"]
    E -->|"No"| G["失敗内容をフィードバックし再実行"]
    G --> C`}
            />
          </div>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考: <Ext href="https://docs.z.ai/devpack/overview">GLM Coding Plan Overview</Ext> /{" "}
            <Ext href="https://docs.z.ai/devpack/resources/best-practice">
              Best Practice(コーディングエージェント運用)
            </Ext>{" "}
            / <Ext href="https://docs.z.ai/devpack/quick-start">Coding Plan Quick Start</Ext> /{" "}
            <Ext href="https://docs.z.ai/devpack/resources/memory-mechanism">Memory Mechanism</Ext>
          </p>
        </section>

        <section id="s15">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>15</span>セキュリティ上の注意点
          </h2>
          <ul className={styles.ul}>
            <li className={styles.li}>
              <strong>APIキーの管理</strong>:
              キーはソースコードに直書きせず、環境変数やシークレットマネージャーで管理する。クライアントサイド(ブラウザ)にキーを露出させない。
            </li>
            <li className={styles.li}>
              <strong>Function Callingの安全性</strong>:
              外部関数がDB操作・ファイル操作・シェルコマンド実行などを行う場合、入力バリデーション・権限チェック・実行ログの記録を必ず実装する(第9章参照)。
            </li>
            <li className={styles.li}>
              <strong>入力コンテンツの安全性</strong>:
              機微・有害となりうるコンテンツを扱うプロンプトは、エラーコード1301(安全性検知によるブロック)の対象となりうる。想定される入力パターンを事前にテストしておく。
            </li>
            <li className={styles.li}>
              <strong>プロンプトインジェクション対策</strong>:
              外部から取得したドキュメントやWeb検索結果をそのままシステムプロンプトに混入させず、ユーザー入力と信頼できる指示を明確に分離する設計を心がける。
            </li>
            <li className={styles.li}>
              <strong>コーディングエージェントの実行権限</strong>: Claude
              Code等の連携時にファイル書き込みやシェル実行を許可する場合、実行範囲をリポジトリ内に限定し、破壊的操作の前に確認ステップを挟む。
            </li>
          </ul>

          <p className={styles.p} style={{ fontSize: "13px" }}>
            参考:{" "}
            <Ext href="https://docs.z.ai/guides/capabilities/function-calling">
              Function Calling: Security Considerations
            </Ext>{" "}
            / <Ext href="https://docs.z.ai/api-reference/api-code">Errors</Ext>
          </p>
        </section>

        <section id="s16">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>16</span>ベストプラクティス チェックリスト
          </h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>チェック項目</th>
                  <th>対応章</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>APIキーを環境変数で管理し、コードに直書きしていないか</td>
                  <td>2, 15</td>
                </tr>
                <tr>
                  <td>
                    タスクの複雑さに応じてモデルを使い分けているか(旗艦モデルの乱用を避けているか)
                  </td>
                  <td>3, 13</td>
                </tr>
                <tr>
                  <td>
                    契約プラン・利用ツールに合ったベースURL(一般API / Coding Plan API /
                    Anthropic互換API)を使用しているか
                  </td>
                  <td>4, 12, 14</td>
                </tr>
                <tr>
                  <td>
                    チャット・生成系UXで<code className={styles.codeInline}>stream=true</code>
                    を活用しているか
                  </td>
                  <td>8</td>
                </tr>
                <tr>
                  <td>
                    複雑な推論タスクでのみ
                    <code className={styles.codeInline}>reasoning_effort=max</code>
                    を使い、軽量タスクではthinkingを無効化しているか
                  </td>
                  <td>7, 13</td>
                </tr>
                <tr>
                  <td>Function Callingで入力検証・権限制御・エラーの構造化を行っているか</td>
                  <td>9, 15</td>
                </tr>
                <tr>
                  <td>JSONモード利用時にスキーマバリデーションとフォールバックを用意しているか</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>システムプロンプトを先頭固定にしてContext Cachingを活用しているか</td>
                  <td>11</td>
                </tr>
                <tr>
                  <td>429/500系エラーに対してExponential Backoffを実装しているか</td>
                  <td>12</td>
                </tr>
                <tr>
                  <td>
                    ストリーミング時に<code className={styles.codeInline}>finish_reason</code>
                    を監視しているか
                  </td>
                  <td>8, 12</td>
                </tr>
                <tr>
                  <td>
                    GLM Coding Plan利用時、プロンプト消費量とピーク/オフピーク倍率を把握しているか
                  </td>
                  <td>14</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="s17">
          <h2 className={styles.h2}>
            <span className={styles.secNum}>17</span>参考URLまとめ
          </h2>
          <p className={styles.p}>
            本ガイド作成にあたり、以下のURLを2026年7月16日時点で直接確認した。
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { label: "Z.AI Open Platform(API起点)", url: "https://z.ai/model-api" },
              { label: "クイックスタート", url: "https://docs.z.ai/guides/overview/quick-start" },
              { label: "ドキュメント総合インデックス", url: "https://docs.z.ai/llms.txt" },
              { label: "GLM-5.2 モデルガイド", url: "https://docs.z.ai/guides/llm/glm-5.2" },
              {
                label: "Migrate to GLM-5.2",
                url: "https://docs.z.ai/guides/overview/migrate-to-glm-new",
              },
              { label: "Core Parameters", url: "https://docs.z.ai/guides/overview/concept-param" },
              {
                label: "Deep Thinking / Thinking Mode",
                url: "https://docs.z.ai/guides/capabilities/thinking-mode",
              },
              {
                label: "Streaming Messages",
                url: "https://docs.z.ai/guides/capabilities/streaming",
              },
              {
                label: "Function Calling",
                url: "https://docs.z.ai/guides/capabilities/function-calling",
              },
              {
                label: "Structured Output",
                url: "https://docs.z.ai/guides/capabilities/struct-output",
              },
              { label: "Context Caching", url: "https://docs.z.ai/guides/capabilities/cache" },
              {
                label: "Errors(エラーコード一覧)",
                url: "https://docs.z.ai/api-reference/api-code",
              },
              { label: "API Reference(全体)", url: "https://docs.z.ai/api-reference/introduction" },
              { label: "Pricing(料金表)", url: "https://docs.z.ai/guides/overview/pricing" },
              { label: "GLM Coding Plan Overview", url: "https://docs.z.ai/devpack/overview" },
              { label: "Coding Plan Quick Start", url: "https://docs.z.ai/devpack/quick-start" },
              {
                label: "Best Practice(コーディングエージェント運用)",
                url: "https://docs.z.ai/devpack/resources/best-practice",
              },
              {
                label: "Memory Mechanism",
                url: "https://docs.z.ai/devpack/resources/memory-mechanism",
              },
              { label: "Python SDK(GitHub)", url: "https://github.com/zai-org/z-ai-sdk-python" },
              { label: "Java SDK(GitHub)", url: "https://github.com/zai-org/z-ai-sdk-java" },
              {
                label: "OpenAI互換 Python SDK連携ガイド",
                url: "https://docs.z.ai/guides/develop/openai/python",
              },
              { label: "Billingページ", url: "https://z.ai/manage-apikey/billing" },
              { label: "API Keys管理ページ", url: "https://z.ai/manage-apikey/apikey-list" },
              { label: "FAQ", url: "https://docs.z.ai/help/faq" },
            ].map((item) => (
              <li
                key={item.url}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--color-border-tertiary)",
                  fontSize: "13.5px",
                }}
              >
                <span
                  style={{ color: "var(--color-text-primary)", fontWeight: 500, minWidth: "220px" }}
                >
                  {item.label}
                </span>
                <Ext href={item.url}>{item.url}</Ext>
              </li>
            ))}
          </ul>
        </section>

        <footer
          style={{
            marginTop: "64px",
            paddingTop: "24px",
            borderTop: "1px solid var(--color-border-primary)",
            fontSize: "12.5px",
            color: "var(--color-text-tertiary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          本ガイドはZ.ai公式ドキュメント(docs.z.ai /
          z.ai)を一次情報源とし、2026年7月16日時点ですべての参照先に直接アクセスして内容を検証したうえで作成している。API仕様・料金・モデルラインナップ・プラン内容は頻繁に更新されるため、実装前に必ず公式ドキュメントの最新版を確認すること。
        </footer>
      </main>
    </div>
  );
}
