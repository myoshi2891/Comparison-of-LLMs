import Ext from "@/components/docs/Ext";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import Sidebar from "./Sidebar";
import TocObserver from "./TocObserver";

export const metadata = {
  title:
    "Claude Fable 5 実践活用ガイド ― フィールドガイド版 | Claude Code エンジニアのためのベストプラクティス",
  description:
    "地図は現地ではない。Claude Fable 5 の特性、安全分類器、プロンプト転換、Effortレベル、/goal・Dynamic Workflows、Loop Engineering、ThariqのUnknownsフレームワークを詳細解説。",
};

const DIAGRAMS = {
  mmd1: `graph TD
    MF["共通の基盤モデル"]
    MF --> Mythos5["Claude Mythos 5<br/>安全分類器なし<br/>Project Glasswing 経由の限定提供"]
    MF --> Fable5["Claude Fable 5<br/>安全分類器あり(サイバー/生物/推論抽出/競合LLM開発)<br/>一般提供(GA)"]
    Mythos5 --> GW["Project Glasswing<br/>信頼されたパートナー向けプログラム"]
    Fable5 --> Users["Claude API / Claude Platform on AWS / Bedrock<br/>Google Cloud / Microsoft Foundry<br/>Claude Code / Claude.ai / Claude Cowork"]`,
  mmd3: `flowchart TD
    A["ユーザーのリクエスト<br/>(CLAUDE.md・gitステータスも含む)"] --> B{"安全分類器が検知?"}
    B -- "いいえ(95%超のケース)" --> C["Fable 5がそのまま応答"]
    B -- "はい(cyber/bio/frontier_llm/reasoning_extraction)" --> D["Claude Opus 4.8 へ自動フォールバック"]
    D --> E["トランスクリプトに通知が表示される"]
    E --> F["セッションはOpus 4.8のまま継続"]
    F --> G["/model fable を実行するとFable 5に復帰"]`,
  mmd4: `flowchart TB
    subgraph Old["旧来の指示スタイル(Opus世代までの習慣)"]
        O1["手順を逐一列挙する"] --> O2["禁止事項を網羅的に書き出す"]
        O2 --> O3["思考過程を逐一報告させる"]
        O3 --> O4["Fable 5には不向き<br/>過剰な制約がむしろ性能を落とす"]
    end
    subgraph New["Fable 5向けの指示スタイル"]
        N1["ゴールと『なぜそれが必要か』を伝える"] --> N2["越えてはいけない境界だけを明示する"]
        N2 --> N3["検証方法(何をもって完了とするか)を明示する"]
        N3 --> N4["Fable 5に適合<br/>自律的な判断力を最大限活かせる"]
    end`,
  mmd5: `flowchart TD
    A["有効なEffortレベルの決定"] --> B{"環境変数<br/>CLAUDE_CODE_EFFORT_LEVEL<br/>が設定されている?"}
    B -- はい --> Z["環境変数の値を採用(最優先)"]
    B -- いいえ --> C{"実行中の<br/>Skill/Subagentのfrontmatter<br/>にeffort指定がある?"}
    C -- はい --> Y["frontmatterの値を採用<br/>(セッション設定より優先、環境変数には劣後)"]
    C -- いいえ --> D{"/effort やsettingsファイルで手動設定済み?"}
    D -- はい --> X["手動設定値を採用(セッションをまたいで永続化)"]
    D -- いいえ --> W["モデルごとの既定値を採用<br/>(Fable 5・Sonnet 5・Opus 4.8はhigh、Opus 4.7はxhighが既定)"]`,
  mmd6: `sequenceDiagram
    participant Dev as 開発者
    participant Worker as Fable 5(作業者)
    participant Eval as 評価モデル(既定はHaiku)
    Dev->>Worker: "/goal 条件"を設定
    loop 条件が満たされるまで
        Worker->>Worker: 1ターン分の作業を実行
        Worker->>Eval: これまでの会話全体を提示
        Eval-->>Worker: 条件は成立したか(Yes/Noと理由)
        alt No
            Worker->>Worker: 理由を踏まえて次のターンへ
        else Yes
            Worker-->>Dev: ゴール達成としてクリア
        end
    end`,
  mmd7: `flowchart TD
    O["トップレベルのオーケストレーター<br/>(スクリプトとして実行、モデルトークンを消費しない)"] --> T1["タスク1"]
    O --> T2["タスク2"]
    O --> TN["タスクN(数百件まで拡張可能)"]
    T1 --> I1["実装エージェント"] --> V1a["検証エージェントA"] & V1b["検証エージェントB"]
    V1a --> F1["修正エージェント"]
    V1b --> F1
    F1 --> R["各タスクの結果をオーケストレーターに返却"]
    T2 -.同様の3段階構成.-> R
    TN -.同様の3段階構成.-> R
    R --> Done["全ブランチ完了後、まとめてユーザーに返却"]`,
  mmd8: `graph TD
    U["開発者"] --> O["Fable 5: オーケストレーター<br/>(アーキテクチャ判断・計画・最終レビュー)"]
    O --> S1["Sonnet 5: 実装サブエージェント"]
    O --> S2["Opus 4.8: 複雑な実装サブエージェント"]
    O --> H1["Haiku 4.5: コード検索・棚卸しサブエージェント"]
    O --> V["Fable 5: 検証サブエージェント(fresh context)"]
    S1 -.結果を返す.-> O
    S2 -.結果を返す.-> O
    H1 -.結果を返す.-> O
    V -.検証結果を返す.-> O`,
  mmd9: `flowchart LR
    subgraph Inner["内側のループ(Inner Loop)"]
        direction TB
        A1["生成(Generate)"] --> A2["検証(Verify)"] --> A3["続行/停止の判断"]
        A3 -.繰り返し.-> A1
    end
    subgraph Outer["外側のループ(Outer Loop)= 人間が握り続ける領域"]
        direction TB
        B1["Quality: 何が『良い』かの基準"]
        B2["Verdict: 出荷するか・止めるかの最終判断"]
        B3["Answerability: なぜそう判断したかを説明できること"]
    end
    Inner -->|"結果を提示"| Outer`,
  mmd10: `graph TD
    L1["① エージェンティックコーディングループ<br/>(数分単位)<br/>仕様とevalに基づき、コーディングエージェントが<br/>自らコードを書きテストし、バグがなくなるまで反復"]
    L2["② 開発者フィードバックループ<br/>(数十分〜数時間単位)<br/>開発者が成果物をレビューし、方向修正を指示"]
    L3["③ 外部フィードバックループ<br/>(数時間〜数週間単位)<br/>友人へのレビュー依頼、αテスター、本番環境でのA/Bテスト"]
    L1 -->|"完成したコード"| L2
    L2 -->|"改善された製品仕様"| L3
    L3 -->|"実データによる学び"| L2
    L2 -->|"詳細化された仕様"| L1`,
  mmd11: `flowchart TD
    subgraph Pre["実装前"]
        T1["① Blindspot Pass<br/>『盲区スキャンをして。私のunknown unknownsは何?』"]
        T2["② 複数案のブレインストーミング<br/>『安いものから野心的なものまで10通りの解法を出して』"]
        T3["③ 使い捨てプロトタイプの試作<br/>『見れば分かる』要求には3〜4案の粗いドラフトを先に出させる"]
        T4["④ Interview Me<br/>『不明確な点を1つずつ質問して。<br/>設計全体を変えるものから聞いて』"]
        T5["⑤ Show, don't explain<br/>既存の近いコード・文書を直接参照させる"]
        T6["⑥ 大きな決定を先に見せる計画<br/>『変更したくなりそうな選択肢を先に見せて』"]
    end
    subgraph During["実装中"]
        T7["⑦ Implementation Notes<br/>『決めた内容と理由をメモファイルに記録し続けて』"]
    end
    subgraph Post["実装後"]
        T8["⑧ Quiz & Pitch<br/>『変更点を要約し、私にクイズを出して』"]
        T9["⑨ 教えてもらってから判断する<br/>良し悪しを判断できない場合は先に教えてもらう"]
    end
    T1 --> T2 --> T3 --> T4 --> T5 --> T6 --> T7 --> T8 --> T9
    T9 -.新たなunknownsの発覚.-> T1`,
  mmd12: `flowchart TD
    Start["新しいタスクが来た"] --> Q1{"曖昧・長時間・高難度か?"}
    Q1 -- はい --> Q2{"サイバー/生物学/競合LLM開発に近い内容か?"}
    Q2 -- はい --> Opus["Opus 4.8を直接使用<br/>(フォールバックを待つより効率的)"]
    Q2 -- いいえ --> Fable["Fable 5をhigh〜xhigh effortで使用<br/>(オーケストレーター役)"]
    Q1 -- いいえ --> Q3{"日常的なコーディング・反復作業か?"}
    Q3 -- はい --> Sonnet["Sonnet 5を使用"]
    Q3 -- いいえ --> Q4{"難所だけ高性能モデルの助言が欲しいか?"}
    Q4 -- はい --> Advisor["Sonnet/Haikuを実行役、Opus/Fable5を<br/>アドバイザーとして/advisorで併用"]
    Q4 -- いいえ --> Q5{"検索・棚卸しなど軽量タスクか?"}
    Q5 -- はい --> Haiku["Haiku 4.5をサブエージェントで使用"]
    Q5 -- いいえ --> Sonnet`,
};

export default function Fable5BestPracticesPage() {
  return (
    <div className={styles.pageContainer}>
      <TocObserver />
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.hero} id="top">
          <div className={styles.heroTag}>CLAUDE CODE FIELD GUIDE</div>
          <h1 className={styles.heroTitle}>
            地図は、<em>現地</em>ではない。
            <br />
            Claude Fable 5 実践活用ガイド
          </h1>
          <p className={styles.heroDesc}>
            「指示を積み上げる」から「ゴールと検証基準を渡して任せる」へ ― Fable
            5に最適化された思考法・設定・Loop
            Engineering・Unknownsフレームワークをステップバイステップで完全解説。
          </p>
          <div className={styles.heroMeta}>
            <div>初出: 2026年7月4日</div>
            <div>
              改訂: <span>2026年7月26日公式ドキュメント対応版</span>
            </div>
            <div>
              対象: <span>Claude Code 中〜上級エンジニア</span>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <section className={`${styles.section} chapter`} id="s1">
          <span className={styles.eyebrowNum}>01 / 15</span>
          <h2 className={styles.sectionTitle}>Claude Fable 5 とは何か</h2>
          <p>
            Claude Fable 5 は、2026年6月9日に Anthropic が発表したフラッグシップモデルである。Claude
            Code
            などのエージェント型開発ツールに最適化されており、長時間に及ぶ複雑なタスクでの文脈保持能力、コードベース全体の自律的な調査能力、自己検証能力において、従来の
            Claude Opus 5 / Opus 4.8 を凌駕する性能を持つ。
          </p>
          <h3>1.1 スペック概要</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>スペック・値</th>
                  <th>補足</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>発表・一般提供日</strong>
                  </td>
                  <td>2026年6月9日(GA)</td>
                  <td>6月12日〜30日は一時停止期間</td>
                </tr>
                <tr>
                  <td>
                    <strong>API 価格(1Mトークン)</strong>
                  </td>
                  <td>入力 $10.00 / 出力 $50.00</td>
                  <td>Opus 4.8 のちょうど2倍の価格帯</td>
                </tr>
                <tr>
                  <td>
                    <strong>コンテキストウィンドウ</strong>
                  </td>
                  <td>200,000 トークン (標準) / 最大 1,000,000 トークン (エンタープライズ)</td>
                  <td>Claude Code 上では自動コンパクション(95%で要約)が動作</td>
                </tr>
                <tr>
                  <td>
                    <strong>既定 Effort レベル</strong>
                  </td>
                  <td>high</td>
                  <td>low / medium / high / xhigh / max / ultracode から選択可</td>
                </tr>
                <tr>
                  <td>
                    <strong>データ保持ポリシー</strong>
                  </td>
                  <td>Covered Model (30日間保持)</td>
                  <td>Zero Data Retention (ZDR) には非対応</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>1.2 モデルファミリーの関係性</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAMS.mmd1} />
          </div>
          <p className={styles.diagramCaption}>
            図1-1: Fable 5 / Mythos 5 モデルファミリーの関係性
          </p>
          <p>
            Fable 5 と Mythos 5
            は「同じ頭脳、異なる安全装備」というイメージで捉えると理解しやすい。Mythos 5
            はプロジェクト Glasswing
            を通じて重要インフラ事業者向けに限定提供されており、一般的な開発者が使用するのは安全分類器を備えた
            Fable 5 となる。
          </p>
        </section>

        {/* Section 2 */}
        <section className={`${styles.section} chapter`} id="s2">
          <span className={styles.eyebrowNum}>02 / 15</span>
          <h2 className={styles.sectionTitle}>タイムライン: リリースから輸出規制、価格変更まで</h2>
          <p>
            Fable 5
            は発表から1ヶ月あまりの間に、サービス停止・価格体系の変更という2つの大きな出来事を経験している。プロンプト設計とは直接関係ないが、可用性設計(フォールバックの必要性)とコスト管理の両面で重要な背景である。
          </p>

          {/* Custom Visual Timeline */}
          <ul className={styles.timelineLegend} aria-label="タイムライン凡例">
            <li className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "#7c9eff" }} />
              リリース
            </li>
            <li className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "#ff8080" }} />
              輸出規制・停止
            </li>
            <li className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "#7ee0b8" }} />
              規制解除・復旧
            </li>
            <li className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "#ffb873" }} />
              プロモーション期間
            </li>
            <li className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "#c084fc" }} />
              新モデル
            </li>
          </ul>

          <div className={styles.timelineWrap}>
            <div className={styles.timelineTrack} aria-hidden="true" />
            <ol
              className={styles.timeline}
              aria-label="Claude Fable 5 / Mythos 5 タイムライン 2026年7月26日時点"
            >
              {/* 2026-06-09 */}
              <li className={`${styles.timelineItem} ${styles.tlLaunch}`}>
                <div className={styles.timelineDateCol}>
                  <span className={styles.timelineDate}>
                    2026
                    <br />
                    06-09
                  </span>
                </div>
                <div className={styles.timelineDotCol}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineConnector} />
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.timelineTag}>リリース</span>
                  <p className={styles.timelineTitle}>Fable 5 / Mythos 5 発表・一般提供開始</p>
                  <p className={styles.timelineDesc}>
                    Claude Fable 5（安全分類器あり・一般公開）と Claude Mythos 5（Project Glasswing
                    経由の限定提供）が同時リリース。Claude Code・Claude.ai・Bedrock・Google Cloud
                    などで利用可能に。
                  </p>
                </div>
              </li>

              {/* 2026-06-12 */}
              <li className={`${styles.timelineItem} ${styles.tlDanger}`}>
                <div className={styles.timelineDateCol}>
                  <span className={styles.timelineDate}>
                    2026
                    <br />
                    06-12
                  </span>
                </div>
                <div className={styles.timelineDotCol}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineConnector} />
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.timelineTag}>輸出規制・停止</span>
                  <p className={styles.timelineTitle}>
                    米商務省 BIS が輸出規制を発動 — 全世界でアクセス停止
                  </p>
                  <p className={styles.timelineDesc}>
                    Amazon の研究者が安全策を回避する脆弱性特定手法を報告。BIS が Fable 5・Mythos 5
                    への輸出管理措置を発動。外国籍ユーザーをリアルタイムに識別できないため、Anthropic
                    は全ユーザー向けに即時停止を実施。
                  </p>
                </div>
              </li>

              {/* 2026-06-30 */}
              <li className={`${styles.timelineItem} ${styles.tlRecovery}`}>
                <div className={styles.timelineDateCol}>
                  <span className={styles.timelineDate}>
                    2026
                    <br />
                    06-30
                  </span>
                </div>
                <div className={styles.timelineDotCol}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineConnector} />
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.timelineTag}>規制解除</span>
                  <p className={styles.timelineTitle}>米商務省が輸出規制を解除</p>
                  <p className={styles.timelineDesc}>
                    政府との協議が成立し、強化されたサイバーセキュリティ分類器と安全対策の導入を条件に規制が解除された。
                  </p>
                </div>
              </li>

              {/* 2026-07-01 */}
              <li className={`${styles.timelineItem} ${styles.tlRecovery}`}>
                <div className={styles.timelineDateCol}>
                  <span className={styles.timelineDate}>
                    2026
                    <br />
                    07-01
                  </span>
                </div>
                <div className={styles.timelineDotCol}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineConnector} />
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.timelineTag}>復旧</span>
                  <p className={styles.timelineTitle}>
                    全世界でアクセス復旧 — 強化された分類器を導入
                  </p>
                  <p className={styles.timelineDesc}>
                    Fable 5 の全世界アクセスが復旧。Mythos 5 は Project Glasswing
                    経由の限定組織（米国内の信頼パートナー）向けのみ復旧。週次利用枠の 50%
                    まで無料相当で利用できる補償期間が開始。
                  </p>
                </div>
              </li>

              {/* 2026-07-01〜07 */}
              <li className={`${styles.timelineItem} ${styles.tlPromo}`}>
                <div className={styles.timelineDateCol}>
                  <span className={styles.timelineDate}>
                    2026
                    <br />
                    07-01〜07
                  </span>
                </div>
                <div className={styles.timelineDotCol}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineConnector} />
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.timelineTag}>プロモーション</span>
                  <p className={styles.timelineTitle}>週次利用枠の 50% まで無料相当で利用可能</p>
                  <p className={styles.timelineDesc}>
                    Pro / Max / Team / 一部 Enterprise プランで Fable 5 を週次利用枠の最大 50%
                    まで無料相当クレジットとして利用できる補償期間。
                  </p>
                </div>
              </li>

              {/* 2026-07-07 */}
              <li className={`${styles.timelineItem} ${styles.tlPromo}`}>
                <div className={styles.timelineDateCol}>
                  <span className={styles.timelineDate}>
                    2026
                    <br />
                    07-07
                  </span>
                </div>
                <div className={styles.timelineDotCol}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineConnector} />
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.timelineTag}>延長①</span>
                  <p className={styles.timelineTitle}>無料相当期間を 7月12日 まで第1回延長</p>
                  <p className={styles.timelineDesc}>当初 7月7日 だった締切が延長された。</p>
                </div>
              </li>

              {/* 2026-07-12 */}
              <li className={`${styles.timelineItem} ${styles.tlPromo}`}>
                <div className={styles.timelineDateCol}>
                  <span className={styles.timelineDate}>
                    2026
                    <br />
                    07-12
                  </span>
                </div>
                <div className={styles.timelineDotCol}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineConnector} />
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.timelineTag}>延長②</span>
                  <p className={styles.timelineTitle}>無料相当期間を 7月19日 まで第2回延長</p>
                  <p className={styles.timelineDesc}>
                    再度の延長。この期限到来後は、Fable 5
                    の利用に別途「使用クレジット」の有効化が必要となった。
                  </p>
                </div>
              </li>

              {/* 2026-07-19 */}
              <li className={`${styles.timelineItem} ${styles.tlPromo}`}>
                <div className={styles.timelineDateCol}>
                  <span className={styles.timelineDate}>
                    2026
                    <br />
                    07-19
                  </span>
                </div>
                <div className={styles.timelineDotCol}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineConnector} />
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.timelineTag}>プロモーション終了</span>
                  <p className={styles.timelineTitle}>無料相当期間終了 — 使用クレジット制に移行</p>
                  <p className={styles.timelineDesc}>
                    プロモーション期間が終了。以降は Pro / Max / Team / 一部 Enterprise プランでも
                    Fable 5
                    利用には「使用クレジット」の明示的な有効化が必要。有効化しないと週次枠到達時点でアクセスが停止。
                  </p>
                </div>
              </li>

              {/* 2026-07-24 */}
              <li className={`${styles.timelineItem} ${styles.tlNew}`}>
                <div className={styles.timelineDateCol}>
                  <span className={styles.timelineDate}>
                    2026
                    <br />
                    07-24
                  </span>
                </div>
                <div className={styles.timelineDotCol}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineConnector} />
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.timelineTag}>新モデル</span>
                  <p className={styles.timelineTitle}>
                    Claude Opus 5 リリース — Fable 5 級性能を半額で
                  </p>
                  <p className={styles.timelineDesc}>
                    Anthropic が <strong>Claude Opus 5</strong> をリリース。入力 $5 / 出力 $25（per
                    1M tokens）と Fable 5（$10 / $50）の約半額で、近い性能を実現。Claude Max
                    のデフォルトモデルに昇格し、Claude Pro の最上位として利用可能。
                  </p>
                </div>
              </li>

              {/* 2026-07-26 (今日) */}
              <li className={`${styles.timelineItem} ${styles.tlNew}`}>
                <div className={styles.timelineDateCol}>
                  <span className={styles.timelineDate}>
                    2026
                    <br />
                    07-26
                  </span>
                </div>
                <div className={styles.timelineDotCol}>
                  <div
                    className={styles.timelineDot}
                    style={{ boxShadow: "0 0 0 4px rgba(192,132,252,0.25)" }}
                  />
                  {/* last item — no connector */}
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.timelineTag}>現在</span>
                  <p className={styles.timelineTitle}>現況（7月26日時点）</p>
                  <p className={styles.timelineDesc}>
                    Fable 5 は使用クレジット制で継続提供中。Mythos 5 は Project Glasswing
                    経由の限定提供。Opus 5 が Claude Max のデフォルト・Claude Pro
                    の最上位として提供開始。規制環境は引き続き流動的であり、
                    <code>support.claude.com</code> の「Claude Fable 5 Promotional
                    Access」記事での最新状況確認を推奨。
                  </p>
                </div>
              </li>
            </ol>
          </div>
          <p className={styles.diagramCaption}>
            図2-1: Claude Fable 5 / Mythos 5 タイムライン（2026年7月26日時点）
          </p>

          <p>
            一時停止の経緯は、Amazon の研究者が Fable 5
            の安全策を回避してソフトウェア脆弱性を特定できる手法を発見し報告したことがきっかけだった。Anthropic
            の検証では同様の脆弱性特定は Opus 4.8
            や他社モデルでも可能であったとされているが、米商務省産業安全保障局(BIS)は6月12日付で
            Fable 5・Mythos 5
            に対する輸出管理措置を発動し、外国籍ユーザーを区別する即時的な手段がなかった Anthropic
            は全ユーザー向けにモデルを一時停止した。
          </p>

          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <div className={styles.calloutTitle}>⚠ 2026年7月26日時点の実務上の要点</div>
            <p>
              7月19日にプロモーション期間が終了し、現在は Fable 5
              の利用に別途「使用クレジット」の有効化が必要となっている。また7月24日にリリースされた{" "}
              <strong>Claude Opus 5</strong>（入力 $5 / 出力 $25 per 1M tokens）は Fable 5
              に近い性能を約半額で提供しており、コスト優先のユースケースでは Opus 5
              がフォールバック先の有力候補となる。最新情報は <code>support.claude.com</code>{" "}
              の「Claude Fable 5 Promotional Access」記事で確認すること。
            </p>
          </div>

          <p>
            この一件は、実務上「Fable 5 に固定的に依存する設計は避け、フォールバック先(Opus 5・Opus
            4.8
            など)を必ず用意しておく」という教訓を残した。3章で解説する自動フォールバック機構と、10章で解説するコスト管理は、まさにこの種のリスクに対する備えとしても機能する。
          </p>
        </section>

        {/* Section 3 */}
        <section className={`${styles.section} chapter`} id="s3">
          <span className={styles.eyebrowNum}>03 / 15</span>
          <h2 className={styles.sectionTitle}>安全分類器と自動フォールバックの仕組み</h2>
          <p>
            Fable 5
            には、以下の4領域を対象とした安全分類器が組み込まれている(Anthropic公式ドキュメント「Refusals
            and fallback」で明記されている正式なカテゴリ名)。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>
                    <code>category</code> 値
                  </th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>cyber</code>
                  </td>
                  <td>
                    攻撃的なエクスプロイト・マルウェア開発などサイバー被害につながりうる要求。
                    <strong>善意のセキュリティ作業もこのカテゴリで検知されうる</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>bio</code>
                  </td>
                  <td>
                    危険な実験手法など生物学的被害につながりうる要求。
                    <strong>有益なライフサイエンス研究もこのカテゴリで検知されうる</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>frontier_llm</code>
                  </td>
                  <td>
                    競合AIモデルの開発を助ける要求。Anthropicの商用利用規約で制限されている領域。
                    <strong>良性の機械学習研究もこのカテゴリで検知されうる</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>reasoning_extraction</code>
                  </td>
                  <td>
                    モデルの内部推論をそのまま応答テキストとして再現・書き起こしさせようとする要求
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            該当すると判定されたリクエストは、API上では成功レスポンス(HTTP 200)として{" "}
            <code>stop_reason: "refusal"</code> が返る。これはエラーではなく、<code>content</code>{" "}
            は空、出力前の拒否であれば課金もされない。
          </p>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>JSON ・ refusal レスポンス例</span>
              <span className={styles.codeLang}>JSON</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>{"{"}</div>
              <div className={styles.codeLine}>
                {" "}
                &quot;id&quot;: &quot;msg_01XFUDYJgAACzvnptvVoYEL&quot;,
              </div>
              <div className={styles.codeLine}> &quot;type&quot;: &quot;message&quot;,</div>
              <div className={styles.codeLine}> &quot;stop_reason&quot;: &quot;refusal&quot;,</div>
              <div className={styles.codeLine}> &quot;stop_details&quot;: {"{"}</div>
              <div className={styles.codeLine}> &quot;type&quot;: &quot;refusal&quot;,</div>
              <div className={styles.codeLine}> &quot;category&quot;: &quot;cyber&quot;,</div>
              <div className={styles.codeLine}>
                {" "}
                &quot;explanation&quot;: &quot;This request was declined because it could enable
                cyber harm.&quot;
              </div>
              <div className={styles.codeLine}> {"}"},</div>
              <div className={styles.codeLine}>
                {" "}
                &quot;usage&quot;: {"{"} &quot;input_tokens&quot;: 412, &quot;output_tokens&quot;: 0{" "}
                {"}"}
              </div>
              <div className={styles.codeLine}>{"}"}</div>
            </div>
          </div>

          <p>
            Claude Code のようなハーネス上では、この拒否は自動的に Opus 4.8
            へのフォールバックとして処理される。Anthropic の公表によれば、
            <strong>Fable 5 セッションの95%超はフォールバックが一切発生しない</strong>
            とのことである。
          </p>

          <h3>3.1 リクエストのライフサイクル(Claude Code上での挙動)</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAMS.mmd3} />
          </div>
          <p className={styles.diagramCaption}>図3-1: 安全分類器発火時のリクエストライフサイクル</p>

          <h3>3.2 APIレベルでのフォールバック設計(自作ハーネス向け)</h3>
          <p>
            API上で自前のアプリケーションを構築している場合、フォールバックには3つの方式がある。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>状況</th>
                  <th>使う方式</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Claude APIまたはClaude Platform on AWS、最もシンプルな構成</td>
                  <td>
                    <strong>サーバーサイドフォールバック</strong>
                    <br />
                    <code>fallbacks</code>パラメータ
                  </td>
                  <td>1リクエスト・1レスポンスで完結。最大3モデルまで連鎖指定可</td>
                </tr>
                <tr>
                  <td>任意のプラットフォーム、TS/Python/Go/Java/C# SDK利用</td>
                  <td>
                    <strong>SDKミドルウェア</strong>
                    <br />
                    <code>BetaRefusalFallbackMiddleware</code>
                  </td>
                  <td>クライアント側で一度設定すれば自動的にリトライ</td>
                </tr>
                <tr>
                  <td>Ruby/PHP/独自リトライロジック</td>
                  <td>
                    手動リトライ + <code>fallback-credit-2026-06-01</code>ヘッダー
                  </td>
                  <td>キャッシュの二重課金を避けつつ完全な制御が可能</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>実務上の落とし穴として、Anthropic公式ドキュメントは以下を明記している。</p>
          <ul>
            <li>
              <strong>同一モデルへの再送は意味がない</strong>:
              拒否されたリクエストは必ずフォールバック先モデルに送る
            </li>
            <li>
              <strong>リトライ予算はターン単位ではなくリクエスト単位で設計する</strong>:
              サブエージェントを含む1ターンで複数回の拒否が起こりうる
            </li>
            <li>
              <strong>サブエージェント呼び出しには個別にフォールバックを設定する</strong>:{" "}
              <code>fallbacks</code>パラメータはツール実行内部のモデル呼び出しには伝播しない
            </li>
            <li>
              <strong>拒否は成功レスポンス(HTTP 200)なので、5xxベースの監視では検知できない</strong>
              : <code>stop_reason: &quot;refusal&quot;</code> を直接監視イベントとして計装すること
            </li>
          </ul>

          <h3>3.3 実務上の注意点(Claude Code)</h3>
          <ul>
            <li>
              <strong>初回リクエストだけで発火することがある</strong>:
              フォールバックはユーザーの発言内容だけでなく、セッション開始時に一緒に送られる{" "}
              <code>CLAUDE.md</code> の内容や <code>git status</code>
              、ディレクトリ名などのワークスペース情報も判定対象に含む。
            </li>
            <li>
              <strong>トリガー源の切り分け</strong>: <code>claude --safe-mode</code>{" "}
              で起動すると、CLAUDE.md・Skills・MCPサーバー・Hooksなどのカスタマイズを無効化してセッションを開始できる(gitステータスとディレクトリ名は無効化されない)。これにより、フォールバックの原因の切り分けが可能になる。
            </li>
            <li>
              <strong>セキュリティ研究・生物学系タスクは高頻度でフォールバックする</strong>:
              これは想定内の挙動であり、アカウントへのペナルティではない。Fable級の能力がどうしても必要な場合は、Anthropicの信頼されたアクセスプログラムへの相談が推奨される。
            </li>
            <li>
              <strong>自動切り替えを無効化し、都度確認する設定も可能</strong>: <code>/config</code>
              から「switch models when a message is
              flagged」をオフにすると、フラグが立った際にセッションを一時停止できる。
            </li>
            <li>
              <strong>サードパーティ基盤(Bedrock/Vertex/Foundry)での自動フォールバック</strong>:
              モデルIDがプロバイダ固有であるため、<code>ANTHROPIC_DEFAULT_FABLE_MODEL</code>と
              <code>ANTHROPIC_DEFAULT_OPUS_MODEL</code>を設定する必要がある。
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className={`${styles.section} chapter`} id="s4">
          <span className={styles.eyebrowNum}>04 / 15</span>
          <h2 className={styles.sectionTitle}>
            プロンプティング思想の転換: チェックリストからゴールへ
          </h2>
          <p>
            これはFable 5を使いこなす上で最も重要な認識転換である。Anthropic公式の「Prompting Claude
            Fable
            5」ガイドは、旧世代向けに書かれた作り込み過ぎた指示(過剰な手順列挙・網羅的な禁止事項・逐次的な確認要求など)が、Fable
            5ではむしろ性能を落とす場合があると明記している。
          </p>

          <h3>4.1 旧来のスタイル vs Fable 5向けのスタイル</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAMS.mmd4} />
          </div>
          <p className={styles.diagramCaption}>
            図4-1: 旧来のプロンプトスタイルとFable 5向けスタイルの対比
          </p>

          <div className={styles.dividerQuote}>
            &quot;The goal is not to micro-manage the path, but to clarify the destination and the
            boundaries.&quot;
            <span className={styles.attribution}>
              — Anthropic Prompt Engineering Guide for Fable 5
            </span>
          </div>

          <h3>4.2 公式ガイドが挙げる具体的なプロンプトパターン</h3>
          <p>Anthropic公式ドキュメントに記載されている代表的なパターン例:</p>

          <ul>
            <li>
              <strong>① 結果と目的の明示 (Goal &amp; Context)</strong>:
              単に「リファクタリングして」ではなく、「このモジュールのテストカバレッジを80%に引き上げ、保守性を高めるためにリファクタリングして」のように、ゴールと背景の双方を明確に伝える。
            </li>
            <li>
              <strong>② 境界条件の明記 (Guardrails)</strong>:
              「APIの外部インターフェースを変更しない」「既存のDBスキーマを壊さない」といった絶対的な制約(ガードレール)を提示する。
            </li>
            <li>
              <strong>③ 証拠の提示要求 (Proof requirement)</strong>: 「完了したと主張する前に、`bun
              run test` の合格ログを出力して示して」と、客観的な完了証拠を要求する。
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className={`${styles.section} chapter`} id="s5">
          <span className={styles.eyebrowNum}>05 / 15</span>
          <h2 className={styles.sectionTitle}>Effort(推論深度)レベルの使い方</h2>
          <p>
            Fable 5 では推論深度(Effort)を細かく制御できる。タスクの複雑さに応じて適切に Effort
            レベルを選択することが、パフォーマンス向上とコスト最適化の鍵となる。
          </p>

          <h3>5.1 レベル一覧(Claude Code公式ドキュメント準拠)</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Effort レベル</th>
                  <th>特徴・用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>low</code>
                  </td>
                  <td>
                    レスポンスが高速。単純なファイル修正、タイポ修正、ドキュメントのフォーマット調整向け
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>medium</code>
                  </td>
                  <td>速度と精度のバランス型。単一コンポーネントの実装、小規模なバグ修正向け</td>
                </tr>
                <tr>
                  <td>
                    <code>high</code> (既定)
                  </td>
                  <td>
                    標準的な思考深さ。複雑な機能実装、複数ファイルにまたがる修正、設計パターンの適用向け
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>xhigh</code>
                  </td>
                  <td>深い推論を実行。複雑なアルゴリズムの実装、基幹設計、大規模なバグ調査向け</td>
                </tr>
                <tr>
                  <td>
                    <code>max</code> / <code>ultracode</code>
                  </td>
                  <td>
                    最深推論・長時間自律動作用。セッション単位で計画立案・多段階リサーチ・複数エージェントを自律制御
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>5.2 Effortの決定優先順位(2026年7月時点の公式仕様)</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAMS.mmd5} />
          </div>
          <p className={styles.diagramCaption}>図5-1: Effortレベルの決定優先順位</p>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>補足</div>
            <p>
              Enterpriseプランの管理者はロールごとに「上限effortレベル」を設定でき、上限を超えるレベルを指定した場合は自動的にクランプされる。
              <code>max</code>と<code>ultracode</code>
              はセッション限定(settingsファイルには保存不可)であり、<code>ultracode</code>は環境変数
              <code>CLAUDE_CODE_EFFORT_LEVEL</code>には設定できない。
            </p>
          </div>

          <h3>
            5.3 <code>ultrathink</code>キーワードとその他の言い回し
          </h3>
          <p>
            <code>ultrathink</code>{" "}
            というキーワードをプロンプト中に含めると、セッションのeffort設定を変えずにそのターンだけ深い推論をリクエストできる。一方で「think」「think
            hard」「think
            more」といった他の言い回しは特別なキーワードとしては認識されず、通常の文章として扱われる点に注意。
          </p>

          <h3>5.4 過剰思考を防ぐ指示例</h3>
          <p>
            高いeffortで動かすと、Fable
            5がタスクに必要な範囲を超えて調査・熟考してしまうことがある。これを防ぐには、4.2節②のような境界指定が有効である。
          </p>
        </section>

        {/* Section 6 */}
        <section className={`${styles.section} chapter`} id="s6">
          <span className={styles.eyebrowNum}>06 / 15</span>
          <h2 className={styles.sectionTitle}>Claude Code での実践設定</h2>

          <h3>6.1 モデルの選択とエイリアス</h3>
          <p>
            Fable 5はClaude Codeの既定モデルではない。以下のいずれかで明示的に選択する必要がある。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>モデルエイリアス</th>
                  <th>挙動</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>default</code>
                  </td>
                  <td>
                    アカウント種別の既定モデルに戻す(Pro/Team Standardは Sonnet 5、Max/Team
                    Premium/Enterprise pay-as-you-go は Opus 4.8)
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>best</code>
                  </td>
                  <td>組織がFable 5にアクセスできる場合はFable 5、そうでない場合は最新のOpus</td>
                </tr>
                <tr>
                  <td>
                    <code>fable</code>
                  </td>
                  <td>Claude Fable 5 を使用(最も難しく長時間のタスク向け)</td>
                </tr>
                <tr>
                  <td>
                    <code>sonnet</code>
                  </td>
                  <td>日常的なコーディング作業向けの最新Sonnet</td>
                </tr>
                <tr>
                  <td>
                    <code>opus</code>
                  </td>
                  <td>複雑な推論作業向けの最新Opus</td>
                </tr>
                <tr>
                  <td>
                    <code>haiku</code>
                  </td>
                  <td>高速・軽量なタスク向け</td>
                </tr>
                <tr>
                  <td>
                    <code>opusplan</code>
                  </td>
                  <td>
                    プランモード中はOpus、実行フェーズではSonnetに自動切替するハイブリッドモード
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>6.2 Fable 5から最大限の成果を引き出すための基本方針(公式)</h3>
          <div className={styles.stepGrid}>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>01</span>
              <h4>結果を説明する</h4>
              <p>
                手順ではなく欲しい結果を渡し、経路の計画はモデルに任せる。維持し続けたい結果は
                <code>/goal</code>で設定する。
              </p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>02</span>
              <h4>曖昧な問題を渡す</h4>
              <p>
                根本原因の調査、障害対応、アーキテクチャ判断など、追加の調査・検証が効果を発揮する領域に向いている。
              </p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>03</span>
              <h4>検証の念押しを省く</h4>
              <p>
                Fable
                5は指示が少なくても自ら検証を行うため、「テストして」「確認して」といったリマインダーは基本的に不要。
              </p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>04</span>
              <h4>タスクを大きくする</h4>
              <p>
                通常は分割するような作業も、そのままのサイズで渡してよい。長いセッションでも文脈を見失いにくい。
              </p>
            </div>
          </div>

          <h3>
            6.3 <code>/goal</code> コマンドの仕組みを正確に理解する
          </h3>
          <p>
            <code>/goal</code> は完了条件を設定すると、その条件が満たされるまでClaude
            Codeがユーザーの入力なしにターンを重ね続ける機能である。Anthropic公式ドキュメントによれば、その内部実装は「セッション限定のプロンプトベースStop
            hook」のラッパーである。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAMS.mmd6} />
          </div>
          <p className={styles.diagramCaption}>図6-1: /goal コマンドの内部シーケンス</p>

          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <div className={styles.calloutTitle}>⚠ 重要な制約</div>
            <p>
              評価モデルはトランスクリプトを読むだけで、コマンドを自ら実行したりファイルを直接確認したりはしない。したがって条件は「Claudeの出力自体が証拠になる」形で書く必要がある。
            </p>
          </div>

          <h3>
            6.4 Dynamic Workflows(<code>ultracode</code>)の活用
          </h3>
          <p>
            Dynamic Workflowsは、Fable
            5(または他モデル)がタスクのためのオーケストレーションスクリプト(JavaScript)を自身で書き、バックグラウンドで実行する仕組みである。1つの会話では調整しきれないほど多くのエージェントが必要なタスク(コードベース全体の監査、数百ファイル規模の移行など)に適している。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAMS.mmd7} />
          </div>
          <p className={styles.diagramCaption}>
            図6-2: Dynamic Workflowsのオーケストレーション構造
          </p>

          <h3>6.5 サブエージェント戦略とアドバイザーツール</h3>
          <p>
            Fable
            5は並列サブエージェントのディスパッチ・維持において旧モデルより大幅に信頼性が向上している。実務上は、Fable
            5を高コストな「判断役」に据え、実装の大部分は安価なモデルに任せる
            <strong>階層型のモデルルーティング</strong>が推奨される。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAMS.mmd8} />
          </div>
          <p className={styles.diagramCaption}>図6-3: サブエージェントの階層型モデルルーティング</p>

          <div className={`${styles.callout} ${styles.calloutTip}`}>
            <div className={styles.calloutTitle}>
              ✓ 新しいコスト最適化パターン: アドバイザーツール
            </div>
            <p>
              安価な「実行役(executor)」モデル(Haiku/Sonnet)が、判断が難しい局面でのみサーバーサイドで高性能な「助言役(advisor)」モデル(Opus、Fable
              5も対応)にワンショットで相談できる仕組み。
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section className={`${styles.section} chapter`} id="s7">
          <span className={styles.eyebrowNum}>07 / 15</span>
          <h2 className={styles.sectionTitle}>Loop Engineering: 長時間自律ループの設計思想</h2>
          <p>
            エージェント開発における「Loop
            Engineering」とは、人間が手動でプロンプトを投げる代わりに、エージェントを自動周回させる検証・改善ループそのものを設計・構築するエンジニアリング手法である。
          </p>

          <h3>7.1 「ループ」の起源: Boris Chernyの三段階進化</h3>
          <div className={styles.dividerQuote}>
            &quot;I don&apos;t prompt Claude anymore. I have loops that are running. They&apos;re
            the ones that are prompting Claude and figuring out what to do. My job is to write
            loops.&quot;
            <span className={styles.attribution}>— Boris Cherny, Anthropic(Claude Code創設者)</span>
          </div>

          <h3>7.2 命名の瞬間: Peter SteinbergerとAddy Osmani</h3>
          <p>
            2026年6月8日、Google Cloud AI DirectorのAddy Osmaniが「Loop
            Engineering」と題したエッセイを公開し、この実践に名前と体系(anatomy)を与えた。同氏は内側のループ(inner
            loop)と外側のループ(outer loop)を区別する原則を提示した。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAMS.mmd9} />
          </div>
          <p className={styles.diagramCaption}>図7-1: Addy Osmaniの内側/外側ループモデル</p>

          <h3>7.3 Andrew Ngの「3つのループ」フレームワーク</h3>
          <p>
            DeepLearning.AIの『The Batch』にて、Andrew
            Ngはソフトウェア開発を入れ子構造の3つのループとして整理した。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAMS.mmd10} />
          </div>
          <p className={styles.diagramCaption}>図7-2: Andrew Ngの3つのループフレームワーク</p>
        </section>

        {/* Section 8 */}
        <section className={`${styles.section} chapter`} id="s8">
          <span className={styles.eyebrowNum}>08 / 15</span>
          <h2 className={styles.sectionTitle}>Thariq の「Unknowns フレームワーク」徹底解説</h2>
          <p>
            Thariq Shihipar(Anthropic, Claude Codeチーム)が公開した &quot;A Field Guide to Fable:
            Finding Your Unknowns&quot; は、「
            <strong>地図は現地そのものではない(the map is not the territory)</strong>
            」という比喩を中心に据えている。
          </p>

          <div className={styles.dividerQuote}>
            &quot;The map, a representation of the work to be done, is my prompts and skills and
            context... The territory is where the work needs to happen, the codebase, the real
            world... The difference between the map and the territory is what I call unknowns.&quot;
            <span className={styles.attribution}>
              — Thariq Shihipar (@trq212), Anthropic Claude Codeチーム
            </span>
          </div>

          <h3>8.1 4つの象限(Thariq自身の定義)</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>象限</th>
                  <th>Thariq自身の定義</th>
                  <th>具体例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Known Knowns</strong> (既知の既知)
                  </td>
                  <td>プロンプトに書いてあること。求める成果物を伝えている部分</td>
                  <td>「関数の戻り値の型はstringにする」</td>
                </tr>
                <tr>
                  <td>
                    <strong>Known Unknowns</strong> (既知の未知)
                  </td>
                  <td>まだ決めていないが、決めていないと自覚しているギャップ</td>
                  <td>「エラー時の挙動は未決定」</td>
                </tr>
                <tr>
                  <td>
                    <strong>Unknown Knowns</strong> (未知の既知)
                  </td>
                  <td>当たり前すぎて書き出さないが、見れば認識できるもの</td>
                  <td>コードの「きれいさ」の暗黙基準</td>
                </tr>
                <tr>
                  <td>
                    <strong>Unknown Unknowns</strong> (未知の未知)
                  </td>
                  <td>まったく考慮していなかったこと。「どこまで良くできるか」を知らないこと</td>
                  <td>想定外のレガシーな依存関係</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>8.2 実践技法(9つのステップ)</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAMS.mmd11} />
          </div>
          <p className={styles.diagramCaption}>
            図8-1: Thariqの9つの実践技法(Ole Lehmannによる整理)
          </p>
        </section>

        {/* Section 9 */}
        <section className={`${styles.section} chapter`} id="s9">
          <span className={styles.eyebrowNum}>09 / 15</span>
          <h2 className={styles.sectionTitle}>検証ループとメモリシステムの設計</h2>
          <h3>9.1 検証はサブエージェントに任せる</h3>
          <p>
            独立した文脈を持つ検証専用のサブエージェントが、自己批評よりも一貫して優れた結果を出すことが確認されている。
          </p>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>PROMPT PATTERN</span>
              <span className={styles.codeLang}>TEXT</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                Establish a method for checking your own work at an interval of [X] as you build.
              </div>
              <div className={styles.codeLine}>
                Run this every [X interval], verifying your work with subagents against the
                specification.
              </div>
            </div>
          </div>

          <h3>9.2 コンテキストエンジニアリングとメモリ</h3>
          <p>
            過去のセッションから得た教訓を <code>.claude/memory/</code>{" "}
            などファイルベースで蓄積・更新することで、モデルの文脈過多を防ぎつつ高い品質を安定して維持できる。
          </p>
        </section>

        {/* Section 10 */}
        <section className={`${styles.section} chapter`} id="s10">
          <span className={styles.eyebrowNum}>10 / 15</span>
          <h2 className={styles.sectionTitle}>コスト管理とモデル選定フロー</h2>
          <p>
            Fable 5
            は入力$10/出力$50(100万トークン)と高価である。適材適所のモデルルーティングによって、費用対効果を極大化する。
          </p>

          <h3>10.1 モデル選定フロー</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAMS.mmd12} />
          </div>
          <p className={styles.diagramCaption}>図10-1: モデル選定フロー</p>
        </section>

        {/* Section 11 */}
        <section className={`${styles.section} chapter`} id="s11">
          <span className={styles.eyebrowNum}>11 / 15</span>
          <h2 className={styles.sectionTitle}>よくある落とし穴(アンチパターン)</h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>アンチパターン</th>
                  <th>発生する現象</th>
                  <th>対処法</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Opus世代のプロンプトをそのまま流用する</td>
                  <td>過剰な手順指定・禁止事項がFable 5の自律的判断を阻害し、性能が落ちる</td>
                  <td>CLAUDE.md/Skillsを棚卸しし、ゴール・理由・境界・検証の4要素に再構成する</td>
                </tr>
                <tr>
                  <td>常に最大effort(xhigh/max/ultracode)で動かす</td>
                  <td>トークン消費が増えるだけでなく、過剰思考・過剰調査で逆に遅くなる</td>
                  <td>タスクの難度に応じて high を基準に上下させる</td>
                </tr>
                <tr>
                  <td>「思考過程を説明して」と指示する</td>
                  <td>
                    reasoning_extraction
                    カテゴリに抵触し、Opusへの意図しないフォールバックを誘発する
                  </td>
                  <td>構造化された thinking ブロックを読む設計にする</td>
                </tr>
                <tr>
                  <td>単一モデルによる自己採点だけで完了と判断する</td>
                  <td>平凡な出来を「良くできた」と過大評価しがち</td>
                  <td>独立した文脈を持つ検証サブエージェントや /goal の評価モデルを併用する</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 12 */}
        <section className={`${styles.section} chapter`} id="s12">
          <span className={styles.eyebrowNum}>12 / 15</span>
          <h2 className={styles.sectionTitle}>実力・ベンチマークと「検証必須」の理由</h2>
          <p>
            SWE-bench Pro 80.3%, Terminal-Bench 88.0%, Remote Labor Index 16.1%
            など最高峰のスコアを記録しているが、プロ品質に全工程が無検証で届く確率は限定的であり、人間による外側のループ(Outer
            Loop)での検証と評価が必須である。
          </p>

          <div className={styles.pillRow}>
            <span className={styles.pill}>SWE-bench Pro: 80.3%</span>
            <span className={styles.pill}>Terminal-Bench: 88.0%</span>
            <span className={styles.pill}>SWE-bench Verified: 93.9%</span>
            <span className={styles.pill}>Remote Labor Index: 16.1%</span>
          </div>
        </section>

        {/* Section 13 */}
        <section className={`${styles.section} chapter`} id="s13">
          <span className={styles.eyebrowNum}>13 / 15</span>
          <h2 className={styles.sectionTitle}>既知の制限事項</h2>
          <ul>
            <li>
              <strong>Zero Data Retention(ZDR)非対応</strong>:
              30日保持対象モデル。規約厳しい組織では無効化される場合あり。
            </li>
            <li>
              <strong>実在する公人になり代わった発言の制限</strong>:
              著名人の言葉を創作してなり代わる挙動は制限される。
            </li>
            <li>
              <strong>特定4領域での安全分類器の動作</strong>:
              サイバー・生物・LLM抽出・推論抽出でのフォールバック動作。
            </li>
            <li>
              <strong>価格・提供制限の流動性</strong>:
              キャンペーン期間や利用枠は状況に応じて更新される。
            </li>
          </ul>
        </section>

        {/* Section 14 */}
        <section className={`${styles.section} chapter`} id="s14">
          <span className={styles.eyebrowNum}>14 / 15</span>
          <h2 className={styles.sectionTitle}>まとめ</h2>
          <div className={styles.stepGrid}>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>①</span>
              <h4>モデル選定</h4>
              <p>Fable 5をオーケストレーター、他モデルをワーカーに据える階層設計</p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>②</span>
              <h4>Effortの使い分け</h4>
              <p>Effortレベルとultracode/Dynamic Workflowsの使い分け</p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>③</span>
              <h4>検証ループの設計</h4>
              <p>/goal、独立した検証サブエージェントの併用</p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>④</span>
              <h4>Unknownsの可視化</h4>
              <p>自分自身のunknownsを可視化する技法(Thariqのフレームワーク)</p>
            </div>
          </div>
        </section>

        {/* Section 15 */}
        <section className={`${styles.section} chapter`} id="s15">
          <span className={styles.eyebrowNum}>15 / 15</span>
          <h2 className={styles.sectionTitle}>参考文献・ソースURL一覧</h2>
          <div className={styles.refGroup}>
            <h4>公式ドキュメント・公式発表(Anthropic)</h4>
            <ul className={styles.refList}>
              <li>
                <span className={styles.refName}>
                  Anthropic「Claude Fable 5 and Claude Mythos 5」
                </span>
                <Ext href="https://www.anthropic.com/news/claude-fable-5-mythos-5">
                  anthropic.com/news/claude-fable-5-mythos-5
                </Ext>
              </li>
              <li>
                <span className={styles.refName}>
                  Claude Platform Docs「Prompting Claude Fable 5」
                </span>
                <Ext href="https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5">
                  platform.claude.com/.../prompting-claude-fable-5
                </Ext>
              </li>
              <li>
                <span className={styles.refName}>
                  Claude Code Docs「Keep Claude working toward a goal」
                </span>
                <Ext href="https://code.claude.com/docs/en/goal">code.claude.com/docs/en/goal</Ext>
              </li>
            </ul>
          </div>
          <div className={styles.refGroup}>
            <h4>著名な開発者・研究者の発信</h4>
            <ul className={styles.refList}>
              <li>
                <span className={styles.refName}>
                  Thariq Shihipar「A Field Guide to Fable: Finding Your Unknowns」
                </span>
                <Ext href="https://x.com/trq212/status/2073100352921215386">
                  x.com/trq212/status/2073100352921215386
                </Ext>
              </li>
              <li>
                <span className={styles.refName}>Addy Osmani「Loop Engineering」</span>
                <Ext href="https://addyosmani.com/blog/loop-engineering/">
                  addyosmani.com/blog/loop-engineering
                </Ext>
              </li>
              <li>
                <span className={styles.refName}>Andrew Ng「My 3 key loops」</span>
                <Ext href="https://www.deeplearning.ai/the-batch/issue-359">
                  deeplearning.ai/the-batch/issue-359
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        <footer className={styles.pageFooter}>
          Claude Fable 5 実践活用ガイド ―
          2026年7月26日時点の公式ドキュメントおよび開発者の発信を追加調査してブラッシュアップ。本ガイドの内容は今後のモデル・価格改定により変わる可能性があります。
        </footer>
      </main>
    </div>
  );
}
