import type { Metadata } from "next";
import Ext from "@/components/docs/Ext";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "OpenAI GPT-5.6 完全ガイド | LLM-Studies",
  description:
    "OpenAI GPT-5.6 Sol / Terra / Luna のモデル選定、Reasoning、PTC、プロンプト設計、移行とコスト最適化を解説する実践ガイド。",
};

const DIAGRAMS = {
  diagram1: `flowchart TD
    A["タスクを受信"] --> B{"深い推論や高精度コーディングが必要か"}
    B -->|"Yes"| C["gpt-5.6-sol を選択"]
    B -->|"No"| D{"高頻度かつコスト最優先か"}
    D -->|"Yes"| E["gpt-5.6-luna を選択"]
    D -->|"No"| F["gpt-5.6-terra を選択"]
    C --> G["reasoning effort と mode を選定"]
    E --> G
    F --> G
    G --> H["代表的なタスクで品質とコストを検証"]

    class B,D decision
    class C,E,F outcome
    classDef default fill:#2a1b47,stroke:#8b5cf6,color:#ede9fe
    classDef decision fill:#0f3d38,stroke:#2dd4bf,color:#ccfbf1
    classDef outcome fill:#3a2062,stroke:#a78bfa,color:#ede9fe`,
  diagram2: `flowchart LR
    subgraph Dial1["ダイヤル1: モデル選択"]
        M["gpt-5.6-sol / terra / luna"]
    end
    subgraph Dial2["ダイヤル2: reasoning.effort"]
        E1["none"] --- E2["low"] --- E3["medium"] --- E4["high"] --- E5["xhigh"] --- E6["max"]
    end
    subgraph Dial3["ダイヤル3: reasoning.mode"]
        R1["standard（既定）"]
        R2["pro"]
    end
    M -.組み合わせ自在.-> Dial2
    M -.組み合わせ自在.-> Dial3

    style Dial1 fill:#1c1c22,stroke:#3a3a42,color:#f2f2f4
    style Dial2 fill:#1c1c22,stroke:#3a3a42,color:#f2f2f4
    style Dial3 fill:#1c1c22,stroke:#3a3a42,color:#f2f2f4
    class M default
    class E1,E2,E3,E4,E5,E6 effort
    class R1,R2 mode
    classDef default fill:#2a1b47,stroke:#8b5cf6,color:#ede9fe
    classDef effort fill:#0f3d38,stroke:#2dd4bf,color:#ccfbf1
    classDef mode fill:#4a2415,stroke:#fb7185,color:#ffe4de`,
  diagram3: `flowchart TD
    A["Turn 1: ユーザー入力"] --> B["GPT-5.6が推論して応答"]
    B --> C{"reasoning.context"}
    C -->|"all_turns"| D["reasoning itemsを保持しTurn2で再利用"]
    C -->|"current_turn"| E["reasoning itemsを破棄"]
    D --> F["Turn 2: previous_response_id で継続"]
    E --> G["Turn 2: ゼロから推論"]

    class C decision
    classDef default fill:#2a1b47,stroke:#8b5cf6,color:#ede9fe
    classDef decision fill:#0f3d38,stroke:#2dd4bf,color:#ccfbf1`,
  diagram4: `sequenceDiagram
    participant App as "アプリケーション"
    participant Model as "GPT-5.6"
    participant Runtime as "Hosted JS Runtime"
    participant Tools as "許可済みツール群"

    App->>Model: "リクエスト送信"
    Model->>Runtime: "処理プログラムを生成"
    Runtime->>Tools: "複数ツールを並列/逐次呼び出し"
    Tools-->>Runtime: "個々の結果を返却"
    Runtime->>Runtime: "フィルタ・集約・重複排除"
    Runtime-->>Model: "program_output（縮約済み結果）"
    Model-->>App: "最終回答メッセージ"`,
  diagram5: `flowchart TD
    A["複雑なタスク"] --> B["独立可能なワークストリームに分解"]
    B --> C1["サブエージェント1"]
    B --> C2["サブエージェント2"]
    B --> C3["サブエージェント3"]
    C1 --> D["結果を統合"]
    C2 --> D
    C3 --> D
    D --> E["単一の最終回答"]

    class C1,C2,C3 worker
    class D outcome
    classDef default fill:#2a1b47,stroke:#8b5cf6,color:#ede9fe
    classDef worker fill:#0f3d38,stroke:#2dd4bf,color:#ccfbf1
    classDef outcome fill:#4a2415,stroke:#fb7185,color:#ffe4de`,
  diagram6: `flowchart TD
    A["現状動作しているプロンプトとツールセットから開始"] --> B["1グループの指示/例/ツールを削除"]
    B --> C["同一evalセットを再実行"]
    C --> D{"スコアが維持されるか"}
    D -->|"Yes"| E["削除を確定し次のグループへ"]
    D -->|"No"| F["その指示は製品要件を反映しているため復元"]
    E --> B
    F --> G["最小構成のプロンプトが完成"]

    class D decision
    class G outcome
    classDef default fill:#2a1b47,stroke:#8b5cf6,color:#ede9fe
    classDef decision fill:#0f3d38,stroke:#2dd4bf,color:#ccfbf1
    classDef outcome fill:#3a2062,stroke:#a78bfa,color:#ede9fe`,
  diagram7: `flowchart LR
    A["ユーザー入力"] --> B["GPT-5.6 生成開始"]
    B --> C["リアルタイム分類器（サイバー・バイオ領域）"]
    C -->|"問題なし"| D["生成継続・出力"]
    C -->|"要レビュー"| E["生成を数秒一時停止しレビュー"]
    E --> D
    E -->|"ポリシー違反"| F["ブロック・拒否"]

    class D safe
    class E review
    class F danger
    classDef default fill:#2a1b47,stroke:#8b5cf6,color:#ede9fe
    classDef safe fill:#0b3a26,stroke:#34d399,color:#a7f3d0
    classDef review fill:#4a3510,stroke:#fbbf24,color:#fde68a
    classDef danger fill:#4a1414,stroke:#f87171,color:#fecaca`,
  diagram8: `flowchart TD
    A["現行のモデル・reasoning effort・プロンプトを棚卸し"] --> B["ワークロードに応じてsol/terra/lunaを選定"]
    B --> C["Responses APIへ統一"]
    C --> D["reasoning.effortを現行値のまま設定"]
    D --> E["同一設定と1段階下の設定を代表タスクで比較評価"]
    E --> F{"品質が維持されるか"}
    F -->|"Yes"| G["低いeffortを採用しコスト削減"]
    F -->|"No"| H["現行effortを維持、もしくはpro modeを検討"]
    G --> I["prompt cachingの設定を見直し"]
    H --> I
    I --> J["PTC/Multi-agentの適用可否をタスク形状で判断"]
    J --> K["本番投入・継続的なeval監視"]

    class F decision
    class G outcome
    classDef default fill:#2a1b47,stroke:#8b5cf6,color:#ede9fe
    classDef decision fill:#0f3d38,stroke:#2dd4bf,color:#ccfbf1
    classDef outcome fill:#0b3a26,stroke:#34d399,color:#a7f3d0`,
};

export default function Gpt56BestPracticesPage() {
  return (
    <div className={styles.root}>
      <TocObserver />
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarBrand}>
            <i className="ti ti-brain" />
            <div>
              <div className={styles.sidebarBrandText}>GPT-5.6 ガイド</div>
              <div className={styles.sidebarBrandSub}>Sol / Terra / Luna</div>
            </div>
          </div>

          <nav>
            <div className={styles.navGroup}>
              <div className={styles.navGroupLabel}>はじめに</div>
              <a className={styles.navLink} href="#overview"><i className="ti ti-info-circle" />GPT-5.6とは</a>
              <a className={styles.navLink} href="#lineup"><i className="ti ti-stack-2" />モデル比較</a>
              <a className={styles.navLink} href="#selection-flow"><i className="ti ti-route" />モデル選定フロー</a>
            </div>

            <div className={styles.navGroup}>
              <div className={styles.navGroupLabel}>Reasoningシステム</div>
              <a className={styles.navLink} href="#effort-mode"><i className="ti ti-adjustments" />Effort と Mode</a>
              <a className={styles.navLink} href="#persisted-reasoning"><i className="ti ti-history" />Persisted Reasoning</a>
            </div>

            <div className={styles.navGroup}>
              <div className={styles.navGroupLabel}>高度な機能</div>
              <a className={styles.navLink} href="#ptc"><i className="ti ti-terminal-2" />PTC（Tool Calling）</a>
              <a className={styles.navLink} href="#multi-agent"><i className="ti ti-affiliate" />Multi-agent</a>
              <a className={styles.navLink} href="#prompt-caching"><i className="ti ti-database" />Prompt Caching</a>
            </div>

            <div className={styles.navGroup}>
              <div className={styles.navGroupLabel}>プロンプト・制御</div>
              <a className={styles.navLink} href="#prompt-design"><i className="ti ti-pencil" />プロンプト設計</a>
              <a className={styles.navLink} href="#verbosity"><i className="ti ti-align-left" />応答スタイル</a>
              <a className={styles.navLink} href="#autonomy"><i className="ti ti-shield-check" />自律性と承認境界</a>
              <a className={styles.navLink} href="#safety"><i className="ti ti-shield-lock" />セーフガード</a>
            </div>

            <div className={styles.navGroup}>
              <div className={styles.navGroupLabel}>実践と運用</div>
              <a className={styles.navLink} href="#migration"><i className="ti ti-arrows-shuffle" />移行ステップ</a>
              <a className={styles.navLink} href="#code"><i className="ti ti-code" />コード実践例</a>
              <a className={styles.navLink} href="#availability"><i className="ti ti-apps" />利用可能性</a>
              <a className={styles.navLink} href="#cost"><i className="ti ti-coin" />コスト最適化</a>
              <a className={styles.navLink} href="#summary"><i className="ti ti-list-check" />まとめ</a>
              <a className={styles.navLink} href="#sources"><i className="ti ti-link" />参考ソース</a>
            </div>
          </nav>
        </aside>

        <main className={styles.main}>
          <header className={styles.pageHeader}>
            <div className={styles.eyebrow}>
              <i className="ti ti-sparkles" />
              <span>OPENAI GPT-5.6 PRACTICAL GUIDE</span>
            </div>
            <h1>OpenAI GPT-5.6 完全ガイド — Sol / Terra / Luna 実践ベストプラクティス</h1>
            <p className={styles.subtitle}>
              2026年7月に一般提供（GA）されたOpenAI GPT-5.6の最新アーキテクチャ、Reasoning Effort / Modeのダイヤル制御、Programmatic Tool Calling（PTC）、Multi-agent機能、Prompt Cachingの改定、およびプロンプト簡素化のベストプラクティスを体系的に解説します。
            </p>
          </header>

          <section id="overview" className={styles.section}>
            <h2><span className={styles.stepNo}>01</span><i className="ti ti-info-circle" />GPT-5.6とは何か</h2>
            <p>
              GPT-5.6は、OpenAIが2026年7月9日に正式発表・一般提供（GA）を開始したフラッグシップモデルファミリーです。先行して限定プレビューが提供されていた<strong>GPT-5.6 Sol</strong>に加え、汎用ワークホースモデルの<strong>GPT-5.6 Terra</strong>、および高速・低コストモデルの<strong>GPT-5.6 Luna</strong>で構成されます。
            </p>
            <p>
              従来のGPT-5/5.5世代と比較した主な進化点は以下の通りです。
            </p>
            <ul>
              <li><strong>Responses APIへの完全移行</strong>：従来のCompletions APIから、非同期タスク処理や状態保持をネイティブサポートするResponses APIが標準となりました。</li>
              <li><strong>Reasoning機能の分離と微細制御</strong>：Reasoningの深さ（<code>effort</code>）と実行モード（<code>mode</code>）がモデルの選定から独立したダイヤルとして提供されます。</li>
              <li><strong>Programmatic Tool Calling (PTC)</strong>：ホスト型JavaScriptランタイムを介してモデルがコードを書き、複数ツールの結果をフィルタ・集約してからトークンとして受け取る機能が導入されました。</li>
              <li><strong>Explicit Prompt Caching Breakpoints</strong>：明示的にキャッシュポイントを設定できるようになり、長いシステムプロンプトの再利用効率が向上しました。</li>
            </ul>
          </section>

          <section id="lineup" className={styles.section}>
            <h2><span className={styles.stepNo}>02</span><i className="ti ti-stack-2" />モデルラインナップ</h2>
            <p>GPT-5.6ファミリーは用途・予算に応じて3つのモデルが提供されます。</p>

            <div className={styles.modelGrid}>
              <div className={`${styles.modelCard} ${styles.accentPurple}`}>
                <div className={styles.modelName}><i className="ti ti-sun" />GPT-5.6 Sol</div>
                <div className={styles.modelId}>gpt-5.6-sol</div>
                <div className={styles.modelDesc}>
                  最上位のフラッグシップモデル。複雑な数理推論、高度なソフトウェアアーキテクチャ設計、長期コンテキストを伴うリファクタリング、およびエージェントタスクに最適です。
                </div>
              </div>
              <div className={`${styles.modelCard} ${styles.accentTeal}`}>
                <div className={styles.modelName}><i className="ti ti-planet" />GPT-5.6 Terra</div>
                <div className={styles.modelId}>gpt-5.6-terra</div>
                <div className={styles.modelDesc}>
                  汎用バランスモデル。日常的なコーディング補助、テキスト生成、データ抽出、要約など、コストとスピードのバランスが求められる一般的な本番ワークロードに適しています。
                </div>
              </div>
              <div className={`${styles.modelCard} ${styles.accentCoral}`}>
                <div className={styles.modelName}><i className="ti ti-moon" />GPT-5.6 Luna</div>
                <div className={styles.modelId}>gpt-5.6-luna</div>
                <div className={styles.modelDesc}>
                  超高速・低コストモデル。分類、簡易なエンティティ抽出、リアルタイムチャットボット、高頻度なバックグラウンド処理に特化しています。
                </div>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>モデル名</th>
                    <th>モデルID</th>
                    <th>Input単価 / 1M</th>
                    <th>Output単価 / 1M</th>
                    <th>Context Window</th>
                    <th>Max Output</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>GPT-5.6 Sol</strong></td>
                    <td><code>gpt-5.6-sol</code></td>
                    <td>$3.00</td>
                    <td>$12.00</td>
                    <td>1M tokens (1,048,576)</td>
                    <td>64,000 tokens</td>
                  </tr>
                  <tr>
                    <td><strong>GPT-5.6 Terra</strong></td>
                    <td><code>gpt-5.6-terra</code></td>
                    <td>$0.75</td>
                    <td>$3.00</td>
                    <td>512K tokens (524,288)</td>
                    <td>32,000 tokens</td>
                  </tr>
                  <tr>
                    <td><strong>GPT-5.6 Luna</strong></td>
                    <td><code>gpt-5.6-luna</code></td>
                    <td>$0.15</td>
                    <td>$0.60</td>
                    <td>256K tokens (262,144)</td>
                    <td>16,000 tokens</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>※ 長文コンテキスト（272,000トークン超過）を処理する場合、Input/Output単価に長文プレミアム料金（1.5倍〜2.0倍）が適用される点にご留意ください。</p>
          </section>

          <section id="selection-flow" className={styles.section}>
            <h2><span className={styles.stepNo}>03</span><i className="ti ti-route" />モデル選定フロー</h2>
            <p>タスクの複雑さとコスト制約に応じて、以下の判断フローでモデルを選定します。</p>

            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAMS.diagram1} />
            </div>

            <div className={`${styles.alertBox} ${styles.warning}`}>
              <i className="ti ti-alert-triangle" />
              <p>
                OpenAIのベンダー公表値ではSolが最上位ベンチマークで優位性を示していますが、これは自社評価であり独立した再現性はまだ限定的です。<strong>Terra/Lunaで要件を満たせるかを先に検証し、満たせない場合のみSolへエスカレーションする</strong>運用が推奨されます。
              </p>
            </div>
          </section>

          <section id="effort-mode" className={styles.section}>
            <h2>
              <span className={styles.stepNo}>04</span><i className="ti ti-adjustments" />Reasoning Effort と Reasoning Mode
            </h2>
            <p>
              GPT-5.6を理解する上で最も重要な概念は、「モデルの選択」「reasoning.effort」「reasoning.mode」という<strong>3つの独立したダイヤル</strong>が存在することです。
            </p>

            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAMS.diagram2} />
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Effort レベル</th>
                    <th>用途・特徴</th>
                    <th>消費トークン傾向</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>none</code></td>
                    <td>推論ステップをスキップ。即時応答が求められる単純分類・定型応答用</td>
                    <td>最小</td>
                  </tr>
                  <tr>
                    <td><code>low</code></td>
                    <td>軽微なロジック修正、単純な指示に従うコード生成</td>
                    <td>少</td>
                  </tr>
                  <tr>
                    <td><code>medium</code> (既定)</td>
                    <td>一般的な開発タスク、一般的な問い合わせ、マルチターン会話</td>
                    <td>標準</td>
                  </tr>
                  <tr>
                    <td><code>high</code></td>
                    <td>複雑なアルゴリズム実装、非自明なバグ修正、システム設計レビュー</td>
                    <td>多</td>
                  </tr>
                  <tr>
                    <td><code>xhigh</code> / <code>max</code></td>
                    <td>最高難度の数理証明、広範なリファクタリング、未知のバグ解析</td>
                    <td>極めて多</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>4.1 Reasoning Mode (standard vs pro)</h3>
            <p>
              <code>reasoning.mode: "pro"</code>を指定すると、通常の思考プロセスに加えて探索空間を深掘りする拡張推論アルゴリズムが有効になります。特に競技プログラミングや難解な数理証明で威力を発揮しますが、応答時間とトークン消費が大幅に増加するため、高付加価値タスクに限定して適用すべきです。
            </p>
          </section>

          <section id="persisted-reasoning" className={styles.section}>
            <h2>
              <span className={styles.stepNo}>05</span><i className="ti ti-history" />Persisted Reasoning
            </h2>
            <p>
              Responses APIでは、マルチターン会話において前回の推論状態（思考トークン）を安全に保持・再利用する<strong>Persisted Reasoning</strong>がサポートされています。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>値</th>
                    <th>動作</th>
                    <th>使用場面</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>auto</code>（デフォルト）</td>
                    <td>モデルが状況に応じた既定動作を選択</td>
                    <td>特別な要件がない場合</td>
                  </tr>
                  <tr>
                    <td><code>all_turns</code></td>
                    <td>過去ターンのreasoning itemsを利用可能にする</td>
                    <td>タスクのゴール・前提が全ターンを通じて安定している場合</td>
                  </tr>
                  <tr>
                    <td><code>current_turn</code></td>
                    <td>過去の推論を破棄し現在のターンのみで推論</td>
                    <td>ターンごとに独立した処理を行わせたい場合</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAMS.diagram3} />
            </div>

            <p>
              <code>all_turns</code>を使う場合は<code>previous_response_id</code>で過去のレスポンスを連結します。会話履歴を自前管理する場合（Zero Data Retention環境など）は、APIが返す暗号化されたreasoning itemsをそのまま再送する必要があります。
            </p>
          </section>

          <section id="ptc" className={styles.section}>
            <h2>
              <span className={styles.stepNo}>06</span><i className="ti ti-terminal-2" />Programmatic Tool Calling（PTC）
            </h2>
            <p>
              PTCは、GPT-5.6がホスト型ランタイム上でJavaScriptプログラムを書き、複数ツールを呼び出し・中間結果を処理してから、コンパクトな結果だけをモデルに返す仕組みです。Zero Data Retention互換で、追加のコンテナ課金は発生しません。
            </p>

            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAMS.diagram4} />
            </div>

            <h3>6.1 PTCが適するタスク形状</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>適している</th>
                    <th>適していない</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>大量ツール結果のフィルタ・結合・ランキング・重複排除・集約・検証</td>
                    <td>1回の呼び出しで完結するタスク</td>
                  </tr>
                  <tr>
                    <td>中間出力が大きく、モデルに逐一渡すのが非効率な場合</td>
                    <td>各結果が次の判断に影響を与える対話的なタスク</td>
                  </tr>
                  <tr>
                    <td>判断の余地が少ない機械的な処理</td>
                    <td>承認が必要なアクション</td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td>最終出力に引用やネイティブな成果物の保持が必要な場合</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>6.2 実装時の注意点</h3>
            <ul>
              <li><code>programmatic_tool_calling</code>ツールを追加し、対象ツールを<code>allowed_callers</code>で明示的にオプトインします。</li>
              <li>どの段階でPTCを使うか、どのツールを呼べるか、出力スキーマ、並行数・リトライ・停止条件を<strong>タスク固有に明示</strong>してください。曖昧な指示では期待した経路選択になりません。</li>
              <li><code>program_output</code>と最終的なassistantメッセージは別物です。プログラムが正しいレコードを返していても、メッセージ側で必須フィールドや引用が欠落する場合があるため、<strong>両方を検証</strong>してください。</li>
            </ul>
          </section>

          <section id="multi-agent" className={styles.section}>
            <h2>
              <span className={styles.stepNo}>07</span><i className="ti ti-affiliate" />Multi-agent（ベータ）とUltra Mode
            </h2>
            <p>
              GPT-5.6は単一インスタンスが複数のサブエージェントを並列に調整し、結果を統合する<strong>Multi-agent</strong>機能をResponses APIのベータ機能として提供します（ChatGPT/Codexの「ultra」モードと同様の考え方）。独立したワークストリームに分割できる複雑なタスクにおいて、ウォールクロック時間の短縮に有効です。
            </p>

            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAMS.diagram5} />
            </div>

            <div className={`${styles.alertBox} ${styles.info}`}>
              <i className="ti ti-bulb" />
              <p>
                ワークストリーム間の依存関係が強いタスクでは並列化の恩恵が薄く、統合コストが増える場合があります。分割可能性を事前に評価してから導入してください。
              </p>
            </div>
          </section>

          <section id="prompt-caching" className={styles.section}>
            <h2>
              <span className={styles.stepNo}>08</span><i className="ti ti-database" />Prompt Cachingの変更点
            </h2>
            <p>
              GPT-5.6では、キャッシュされるプロンプト接頭辞を明示的に指定できる<strong>Explicit Cache Breakpoints</strong>が導入されました。暗黙のキャッシュ（Implicit caching）も引き続き利用できます。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cache write（新規書き込み）</td>
                    <td>非キャッシュ時のInput単価の<strong>1.25倍</strong>で課金</td>
                  </tr>
                  <tr>
                    <td>Cache read（再利用）</td>
                    <td>従来通り約90%割引</td>
                  </tr>
                  <tr>
                    <td>最小キャッシュ保持期間</td>
                    <td>30分</td>
                  </tr>
                  <tr>
                    <td>設定方法</td>
                    <td><code>prompt_cache_options.mode: "explicit"</code></td>
                  </tr>
                  <tr>
                    <td>TTL指定</td>
                    <td><code>prompt_cache_retention</code>は廃止、<code>prompt_cache_options.ttl</code>を使用</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.alertBox} ${styles.warning}`}>
              <i className="ti ti-alert-triangle" />
              <p>
                キャッシュ書き込みが有償化されたため、頻繁に変化するプロンプト接頭辞に対して不要なキャッシュ書き込みが発生しないよう、<code>cached_tokens</code>と<code>cache_write_tokens</code>の両方をモニタリングし、実質コストを把握することが重要です。
              </p>
            </div>
          </section>

          <section id="prompt-design" className={styles.section}>
            <h2>
              <span className={styles.stepNo}>09</span><i className="ti ti-pencil" />プロンプト設計のベストプラクティス
            </h2>
            <p>
              公式ドキュメントが明示する最重要原則は「<strong>プロンプトを簡潔にする</strong>」ことです。内部の評価では、冗長な指示を削ぎ落とした「リーンな」システムプロンプトにより、評価スコアが約10〜15%向上し、総トークン数が41〜66%、コストが33〜67%削減された事例が報告されています（数値はワークロードに依存するため、自社タスクでの検証が前提です）。
            </p>

            <h3>9.1 プロンプト簡素化の手順</h3>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAMS.diagram6} />
            </div>

            <p>具体的な指針：</p>
            <ul>
              <li><strong>各指示は一度だけ記述する</strong>（重複ルールは削除）</li>
              <li><strong>タスクに関連するツールだけを公開</strong>し、説明文を簡潔かつ正確にする</li>
              <li>例やスタイルガイドは、製品要件をエンコードしている場合や、計測されたギャップを補正する場合のみ残す</li>
              <li>セッション開始時と会話が長くなった時の両方でコンテキスト量を追跡する（長時間セッションは重複プロンプト/ツール内容の影響を増幅させる）</li>
            </ul>

            <h3>9.2 意図理解の向上を活かす</h3>
            <p>
              GPT-5.6はユーザーの根本的な目的と適切な作業レベルを、より少ない指示から推測できるようになりました。ただし、以下は引き続き明示する必要があります。
            </p>
            <ul>
              <li>ドメイン固有のコンテキスト</li>
              <li>明確な制約（ハード制約）</li>
              <li>承認境界（何をして良いか／悪いか）</li>
              <li>成功基準</li>
              <li>「このあいまいさが生じたら質問すべき」というトリガー条件</li>
            </ul>
          </section>

          <section id="verbosity" className={styles.section}>
            <h2>
              <span className={styles.stepNo}>10</span><i className="ti ti-align-left" />応答の長さとスタイル制御
            </h2>
            <p>
              GPT-5.6はGPT-5.5よりデフォルトで簡潔な応答を返す傾向があります。そのため、従来の「簡潔にして」という広範な指示が不要、あるいは逆に応答を短くしすぎる場合があります。
            </p>

            <h3>10.1 text.verbosityによるデフォルト制御</h3>
            <p>
              <code>text.verbosity</code>に<code>low</code> / <code>medium</code> / <code>high</code>を指定することで、リクエストのデフォルトの詳細度を設定し、タスク固有の要件はプロンプト側に記述する、という役割分担が推奨されます。
            </p>

            <h3>10.2 短い回答で「何を残すか」を明示する</h3>
            <p>
              単に「短くして」と指示するのではなく、保持すべき情報と省略してよい情報を明示します。
            </p>
            <pre className={styles.codeWrap}>
              <code className={styles.codeBody}>
                <div className={styles.codeLine}><span className={styles.cm}>結論を先に述べる。それを裏付ける根拠、重要な留意点、次のアクションを含める。</span></div>
                <div className={styles.codeLine}><span className={styles.cm}>副次的な詳細や重複は省略する。</span></div>
                <div className={styles.codeLine}><span className={styles.ck}>必ず残す：</span><span>事実、判断、留意点、次のアクション。</span></div>
                <div className={styles.codeLine}><span className={styles.cw}>優先的に削る：</span><span>導入文、繰り返し、一般的な安心づけ、任意の背景情報。</span></div>
              </code>
            </pre>

            <h3>10.3 トーンの定義</h3>
            <p>
              「フレンドリーに」「共感的に」といった抽象的なラベルは曖昧になりがちです。どの程度直接的に答えるか、問題発生時にどう言及するか、いつ安心づけを行うかなど、<strong>具体的な書き方のルール</strong>として定義してください。
            </p>
          </section>

          <section id="autonomy" className={styles.section}>
            <h2>
              <span className={styles.stepNo}>11</span><i className="ti ti-shield-check" />自律性と承認境界の定義
            </h2>
            <p>
              GPT-5.6はマルチステップタスクにおいてより能動的・持続的に振る舞うため、<strong>各リクエストがどこまでの行動を許可しているか</strong>を明示することが不可欠です。以下は公式ガイドが示す方針を日本語で再構成したポリシー例です。
            </p>

            <pre className={styles.codeWrap}>
              <code className={styles.codeBody}>
                <div className={styles.codeLine}><span className={styles.ch}>【回答・説明・レビュー・診断・計画のリクエストの場合】</span></div>
                <div className={styles.codeLine}><span>関連資料を調査し、結果を報告する。変更の実施も求められていない限り、実際の変更は行わない。</span></div>
                <div className={styles.codeLine}><span className={styles.ch}>【変更・構築・修正のリクエストの場合】</span></div>
                <div className={styles.codeLine}><span>スコープ内のローカルな変更を実施し、破壊的でない検証（テスト実行など）を確認なしに行ってよい。</span></div>
                <div className={styles.codeLine}><span className={styles.ch}>【外部への書き込み、破壊的操作、購入、スコープの大幅な拡張を伴う場合】</span></div>
                <div className={styles.codeLine}><span>必ず事前確認を求める。</span></div>
              </code>
            </pre>

            <div className={`${styles.alertBox} ${styles.warning}`}>
              <i className="ti ti-alert-triangle" />
              <p>
                「まず確認して」「変更しないで」「承認を待って」といった指示をポリシー内で重複して記述すると、安全な想定内の操作にまで不要な承認要求が発生することがあります。ルールは一箇所にまとめ、各規則は一度だけ記述してください。
              </p>
            </div>
          </section>

          <section id="safety" className={styles.section}>
            <h2>
              <span className={styles.stepNo}>12</span><i className="ti ti-shield-lock" />セーフガードとsafety_identifier
            </h2>
            <p>
              GPT-5.6には、生成中にリアルタイムで動作するサイバー・生物学関連の誤用検知分類器が組み込まれています。
            </p>

            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAMS.diagram7} />
            </div>

            <ul>
              <li>これらの分類器は、脆弱性調査・パッチ開発・デバッグ・セキュリティ教育・防御的テストなど、正当な業務に介入してしまう場合があります（デュアルユース領域では攻撃的活動と防御的活動が初期段階で似て見えるため）。</li>
              <li>エンドユーザー向けアプリケーションを運用する場合は、リクエストごとに安定した匿名化済みの<code>safety_identifier</code>を送信することが推奨されます。これにより誤用パターンの検知精度向上に寄与します。</li>
            </ul>
          </section>

          <section id="migration" className={styles.section}>
            <h2>
              <span className={styles.stepNo}>13</span><i className="ti ti-arrows-shuffle" />GPT-5.5/5.4からの移行ステップ
            </h2>

            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAMS.diagram8} />
            </div>

            <h3>13.1 コーディングエージェントでの自動移行</h3>
            <p>
              Codexを利用している場合、公式の<code>openai-docs</code>スキルを用いて自動的に本ガイドの推奨変更を適用できます。
            </p>

            <pre className={styles.codeWrap}>
              <code className={styles.codeBody}>
                <div className={styles.codeLine}><span className={styles.ck}>openai-docs</span><span className={styles.cs}> migrate this project to the GPT-5.6 model family</span></div>
              </code>
            </pre>
            <p>
              このスキルは<code>openai/skills</code>リポジトリの<code>.curated/openai-docs</code>から他のコーディングエージェントにも導入可能です。
            </p>
          </section>

          <section id="code" className={styles.section}>
            <h2><span className={styles.stepNo}>14</span><i className="ti ti-code" />コード実践例</h2>

            <h3>14.1 基本的なResponses API呼び出し</h3>
            <pre className={styles.codeWrap}>
              <code className={styles.codeBody}>
                <div className={styles.codeLine}><span className={styles.ck}>from</span><span> openai </span><span className={styles.ck}>import</span><span> OpenAI</span></div>
                <div className={styles.codeLine}><span className={styles.cv}>client</span><span> = OpenAI()</span></div>
                <div className={styles.codeLine}><span className={styles.cv}>response</span><span> = client.responses.create(</span></div>
                <div className={styles.codeLine}><span>    model=</span><span className={styles.cs}>&quot;gpt-5.6-terra&quot;</span><span>,</span></div>
                <div className={styles.codeLine}><span>    reasoning=&#123;</span><span className={styles.cs}>&quot;effort&quot;</span><span>: </span><span className={styles.cs}>&quot;medium&quot;</span><span>&#125;,</span></div>
                <div className={styles.codeLine}><span>    text=&#123;</span><span className={styles.cs}>&quot;verbosity&quot;</span><span>: </span><span className={styles.cs}>&quot;low&quot;</span><span>&#125;,</span></div>
                <div className={styles.codeLine}><span>    input=[&#123;</span><span className={styles.cs}>&quot;role&quot;</span><span>: </span><span className={styles.cs}>&quot;user&quot;</span><span>, </span><span className={styles.cs}>&quot;content&quot;</span><span>: </span><span className={styles.cs}>&quot;matrixを文字列&apos;[1,2],[3,4],[5,6]&apos;として受け取り、同形式で転置行列を出力するbashスクリプトを書いてください。&quot;</span><span>&#125;],</span></div>
                <div className={styles.codeLine}><span>)</span></div>
                <div className={styles.codeLine}><span className={styles.ck}>print</span><span>(response.output_text)</span></div>
              </code>
            </pre>

            <h3>14.2 curlでのリクエスト例（max reasoning effort）</h3>
            <pre className={styles.codeWrap}>
              <code className={styles.codeBody}>
                <div className={styles.codeLine}><span className={styles.ck}>curl</span><span> https://api.openai.com/v1/responses \</span></div>
                <div className={styles.codeLine}><span>  -H </span><span className={styles.cs}>&quot;Content-Type: application/json&quot;</span><span> \</span></div>
                <div className={styles.codeLine}><span>  -H </span><span className={styles.cs}>&quot;Authorization: Bearer $OPENAI_API_KEY&quot;</span><span> \</span></div>
                <div className={styles.codeLine}><span>  -d </span><span className={styles.cs}>&#123;&quot;model&quot;: &quot;gpt-5.6-sol&quot;, &quot;reasoning&quot;: &#123;&quot;effort&quot;: &quot;max&quot;&#125;, &quot;safety_identifier&quot;: &quot;hashed-user-id-xxxx&quot;, &quot;input&quot;: [&#123;&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;本番障害の根本原因を特定するための調査計画を立ててください。&quot;&#125;]&#125;</span></div>
              </code>
            </pre>

            <h3>14.3 Persisted Reasoningを使ったマルチターン継続</h3>
            <pre className={styles.codeWrap}>
              <code className={styles.codeBody}>
                <div className={styles.codeLine}><span className={styles.cv}>first</span><span> = client.responses.create(</span></div>
                <div className={styles.codeLine}><span>    model=</span><span className={styles.cs}>&quot;gpt-5.6-sol&quot;</span><span>,</span></div>
                <div className={styles.codeLine}><span>    reasoning=&#123;</span><span className={styles.cs}>&quot;effort&quot;</span><span>: </span><span className={styles.cs}>&quot;high&quot;</span><span>, </span><span className={styles.cs}>&quot;context&quot;</span><span>: </span><span className={styles.cs}>&quot;all_turns&quot;</span><span>&#125;,</span></div>
                <div className={styles.codeLine}><span>    input=[&#123;</span><span className={styles.cs}>&quot;role&quot;</span><span>: </span><span className={styles.cs}>&quot;user&quot;</span><span>, </span><span className={styles.cs}>&quot;content&quot;</span><span>: </span><span className={styles.cs}>&quot;このリファクタリング計画をレビューして&quot;</span><span>&#125;],</span></div>
                <div className={styles.codeLine}><span>)</span></div>
                <div className={styles.codeLine}><span className={styles.cv}>second</span><span> = client.responses.create(</span></div>
                <div className={styles.codeLine}><span>    model=</span><span className={styles.cs}>&quot;gpt-5.6-sol&quot;</span><span>,</span></div>
                <div className={styles.codeLine}><span>    reasoning=&#123;</span><span className={styles.cs}>&quot;effort&quot;</span><span>: </span><span className={styles.cs}>&quot;high&quot;</span><span>, </span><span className={styles.cs}>&quot;context&quot;</span><span>: </span><span className={styles.cs}>&quot;all_turns&quot;</span><span>&#125;,</span></div>
                <div className={styles.codeLine}><span>    previous_response_id=first.id,</span></div>
                <div className={styles.codeLine}><span>    input=[&#123;</span><span className={styles.cs}>&quot;role&quot;</span><span>: </span><span className={styles.cs}>&quot;user&quot;</span><span>, </span><span className={styles.cs}>&quot;content&quot;</span><span>: </span><span className={styles.cs}>&quot;先ほどの指摘のうち、優先度が最も高いものを実装して&quot;</span><span>&#125;],</span></div>
                <div className={styles.codeLine}><span>)</span></div>
              </code>
            </pre>
          </section>

          <section id="availability" className={styles.section}>
            <h2>
              <span className={styles.stepNo}>15</span><i className="ti ti-apps" />ChatGPT / Codex / ChatGPT Workでの利用可能性
            </h2>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>プラン</th>
                    <th>標準ChatGPT会話</th>
                    <th>Work / Codex</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Free / Go</td>
                    <td>GPT-5.5 Instantがデフォルト。Solは利用不可</td>
                    <td>一部機能のみ</td>
                  </tr>
                  <tr>
                    <td>Plus</td>
                    <td>Medium / High reasoningでSolを利用可</td>
                    <td>Terra/Lunaを含め利用可（段階的展開）</td>
                  </tr>
                  <tr>
                    <td>Pro</td>
                    <td>Medium / High / Extra High / Proまで利用可</td>
                    <td>フルアクセス</td>
                  </tr>
                  <tr>
                    <td>Business / Enterprise</td>
                    <td>全reasoningレベル + 管理者によるモデル制御</td>
                    <td>フルアクセス、ワークスペースポリシーで制御可能</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              標準のChatGPT会話では、日常応答のデフォルトは引き続きGPT-5.5 Instantであり、GPT-5.6 SolはMedium以上のreasoningオプションを選択した場合にのみ使用されます。Terra/Lunaは標準チャットでは選択できず、ChatGPT Work・Codex・APIから利用します。
            </p>
            <p>
              ChatGPT Workは、GPT-5.6を基盤としたエージェント型ワークスペース製品で、ローカルファイル・アプリ・ブラウザを横断したマルチステップタスクの自動実行を目的としています。
            </p>
          </section>

          <section id="cost" className={styles.section}>
            <h2>
              <span className={styles.stepNo}>16</span><i className="ti ti-coin" />コスト最適化チェックリスト
            </h2>

            <div className={styles.checklistItem}>
              <i className="ti ti-square-rounded-check" />
              <span><strong>モデル階層の見直し</strong> — まずLuna/Terraで要件を満たせるか検証してからSolへエスカレーション</span>
            </div>
            <div className={styles.checklistItem}>
              <i className="ti ti-square-rounded-check" />
              <span><strong>reasoning effortの再検証</strong> — 旧設定をそのまま引き継がず、1段階下げて品質を比較</span>
            </div>
            <div className={styles.checklistItem}>
              <i className="ti ti-square-rounded-check" />
              <span><strong>Pro modeの適用範囲</strong> — 高付加価値タスクに限定し、全リクエストへの一律適用を避ける</span>
            </div>
            <div className={styles.checklistItem}>
              <i className="ti ti-square-rounded-check" />
              <span><strong>キャッシュ戦略</strong> — 再利用可能な接頭辞を安定させ、explicit breakpointsで不要な書き込みを抑制</span>
            </div>
            <div className={styles.checklistItem}>
              <i className="ti ti-square-rounded-check" />
              <span><strong>272K超過リクエストの分離</strong> — 長文コンテキスト料金（2×/1.5×）が適用される処理を別クラスとして管理</span>
            </div>
            <div className={styles.checklistItem}>
              <i className="ti ti-square-rounded-check" />
              <span><strong>PTCの適用判断</strong> — 1回の呼び出しで済むタスクにPTCを乱用しない</span>
            </div>
            <div className={styles.checklistItem}>
              <i className="ti ti-square-rounded-check" />
              <span><strong>プロンプトの継続的な簡素化</strong> — 評価結果を見ながら重複指示・不要な例を削減</span>
            </div>
          </section>

          <section id="summary" className={styles.section}>
            <h2><span className={styles.stepNo}>17</span><i className="ti ti-list-check" />まとめ</h2>
            <p>
              GPT-5.6の本質は「モデルが賢くなった」ことよりも、<strong>運用側が持つダイヤル（モデル階層・reasoning effort・reasoning mode・persisted reasoning・prompt caching戦略）が独立して細分化された</strong>ことにあります。ベストプラクティスの核心は一貫しています。
            </p>
            <ul>
              <li>プロンプトは最小構成から始め、evalで検証しながら足す</li>
              <li>各ダイヤルは独立して比較評価する（思い込みで最大設定を選ばない）</li>
              <li>自律性の境界と成功基準を明示し、細かい手順は指示しすぎない</li>
              <li>コストに影響する変更（キャッシュ書き込み、272K超過、Pro mode）は必ず計測する</li>
            </ul>
          </section>

          <section id="sources" className={styles.section}>
            <h2><span className={styles.stepNo}>18</span><i className="ti ti-link" />参考ソース</h2>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ソース</th>
                    <th>内容</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>OpenAI公式リリース</td>
                    <td>GPT-5.6ファミリー正式発表</td>
                    <td>
                      <Ext href="https://openai.com/index/gpt-5-6/">openai.com/index/gpt-5-6</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>OpenAI公式プレビュー発表</td>
                    <td>限定プレビュー時の告知（政府審査の経緯を含む）</td>
                    <td>
                      <Ext href="https://openai.com/index/previewing-gpt-5-6-sol/">openai.com/index/previewing-gpt-5-6-sol</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>OpenAI Developers</td>
                    <td>モデル比較・移行ガイド・プロンプトベストプラクティスの一次情報</td>
                    <td>
                      <Ext href="https://developers.openai.com/api/docs/guides/latest-model">developers.openai.com/.../latest-model</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>OpenAI Developers</td>
                    <td>reasoning.effort / reasoning.mode の技術仕様</td>
                    <td>
                      <Ext href="https://developers.openai.com/api/docs/guides/reasoning">developers.openai.com/.../reasoning</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>OpenAI Developers</td>
                    <td>GPT-5.6 Solのプロンプト設計の詳細ガイダンス</td>
                    <td>
                      <Ext href="https://developers.openai.com/api/docs/guides/prompt-guidance-gpt-5p6">developers.openai.com/.../prompt-guidance-gpt-5p6</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>OpenAI Developers</td>
                    <td>Programmatic Tool Callingの実装ガイド</td>
                    <td>
                      <Ext href="https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling">developers.openai.com/.../tools-programmatic-tool-calling</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>OpenAI Developers</td>
                    <td>Prompt Cachingの課金体系の詳細</td>
                    <td>
                      <Ext href="https://developers.openai.com/api/docs/guides/prompt-caching">developers.openai.com/.../prompt-caching</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>OpenAI Developers</td>
                    <td>Multi-agent（ベータ）の技術詳細</td>
                    <td>
                      <Ext href="https://developers.openai.com/api/docs/guides/responses-multi-agent">developers.openai.com/.../responses-multi-agent</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>OpenAI Developers</td>
                    <td>safety_identifierの実装方法</td>
                    <td>
                      <Ext href="https://developers.openai.com/api/docs/guides/safety-best-practices">developers.openai.com/.../safety-best-practices</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Wikipedia</td>
                    <td>GPT-5.6の背景情報・Preparedness Framework上の分類</td>
                    <td>
                      <Ext href="https://en.wikipedia.org/wiki/GPT-5.6">en.wikipedia.org/wiki/GPT-5.6</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>TechCrunch</td>
                    <td>一般提供開始時の報道、価格体系の確認</td>
                    <td>
                      <Ext href="https://techcrunch.com/2026/07/09/openai-launches-its-new-family-of-models-with-gpt-5-6/">techcrunch.com/2026/07/09/...</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Axios</td>
                    <td>GA発表の経緯・政府対応の背景</td>
                    <td>
                      <Ext href="https://www.axios.com/2026/07/09/ai-openai-gpt-release">axios.com/2026/07/09/...</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>MacRumors</td>
                    <td>ChatGPT Work / プラン別利用可能性</td>
                    <td>
                      <Ext href="https://www.macrumors.com/2026/07/09/openai-chatgpt-work/">macrumors.com/2026/07/09/...</Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <footer className={styles.pageFooter}>
            価格・提供プラン・ベータ機能の可用性は変更される可能性があるため、本番導入前に必ず一次ソース（developers.openai.com）で最新情報を確認してください。
          </footer>
        </main>
      </div>
    </div>
  );
}
