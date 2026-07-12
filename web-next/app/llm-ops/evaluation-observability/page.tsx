import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "LLM評価・ベンチマーク & オブザーバビリティ ベストプラクティスガイド(2026年版) | LLM-Studies",
  description:
    "LLMアプリケーションの品質評価(Evaluation)、公開ベンチマーク(Benchmarking)の読み方、そして本番環境でのオブザーバビリティ(Observability)を体系的に学びたいエンジニア向けのベストプラクティスガイド。",
};

const DIAGRAMS = {
  lifecycle: `flowchart TD
A["要件定義: 何を良いとするか"] --> B["評価データセットの構築"]
B --> C["オフライン評価: 開発中の実験"]
C --> D{"品質基準を満たすか"}
D -- "No" --> C
D -- "Yes" --> E["CI Gate評価: PRごとに自動実行"]
E --> F{"リグレッションなし"}
F -- "No" --> C
F -- "Yes" --> G["本番デプロイ"]
G --> H["オブザーバビリティ: トレース収集"]
H --> I["オンライン評価: 本番トラフィックのサンプリング評価"]
I --> J["ドリフト/品質低下を検知"]
J -- "検知" --> K["失敗ケースをデータセットへ還元"]
K --> B
J -- "問題なし" --> H`,

  metricMix: `flowchart LR
A["出力対象 of 応答"] --> B["決定論的チェック"]
A --> C["統計的類似度スコア"]
A --> D["LLM-as-a-Judge採点"]
B --> E["集約スコアパネル"]
C --> E
D --> E
E --> F{"閾値を満たすか"}
F -- "境界線上" --> G["人間レビューへエスカレーション"]
F -- "明確に合格/不合格" --> H["自動判定を確定"]`,

  benchmarkFlow: `flowchart TD
A["公開ベンチマークで候補モデルを絞り込む"] --> B["自社の代表的タスクを5〜10件選ぶ"]
B --> C["候補モデルすべてに同じタスクを実行させる"]
C --> D["正確性/完全性/指示追従度を評価"]
D --> E["コスト/レイテンシ/安全性を比較"]
E --> F["自社データに基づき最終選定"]`,

  ragEval: `flowchart TD
A["ユーザーの質問"] --> B["Retriever: 関連チャンクを検索"]
B --> C["Context Precision を測定"]
B --> D["Context Recall を測定"]
B --> E["Generator: 回答を生成"]
E --> F["Faithfulness を測定"]
E --> G["Answer Relevancy を測定"]
C --> H["検索品質パネル"]
D --> H
F --> I["生成品質パネル"]
G --> I
H --> J["総合RAGスコアカード"]
I --> J`,

  agentEval: `flowchart TD
A["ユーザーリクエスト"] --> B["エージェント実行トレース"]
B --> C["Final-answer評価: 最終応答を採点"]
B --> D["Trajectory評価: ツール呼び出し系列を採点"]
B --> E["Per-turn評価: 本番の各ターンを採点"]
C --> F["オフラインベンチマーク: 再現可能なリグレッション検知"]
D --> F
E --> G["オンライン監視: ドリフト/新規失敗/ジェイルブレイクの検知"]
F --> H["CIでの品質ゲート"]
G --> I["本番アラート/人間レビューへのエスカレーション"]`,

  hitl: `flowchart LR
A["本番トレース/失敗候補"] --> B["自動スコアで低信頼度をフィルタ"]
B --> C["アノテーションキュー"]
C --> D["レビュアーによる採点"]
D --> E["複数レビュアー間の一致率を確認"]
E --> F["ラベル付きデータセットとして確定"]
F --> G["LLM-as-a-Judgeの閾値/プロンプトを再調整"]
G --> H["自動評価パイプラインへ反映"]`,

  cicdGate: `flowchart TD
A["プロンプト/モデル/リトリーバル設定の変更"] --> B["Pull Request作成"]
B --> C["Batch Evaluation Engine起動"]
C --> D["ゴールデンデータセットに対して実行"]
D --> E["LLM-as-a-Judgeでスコアリング"]
E --> F["品質スコアのトレンドを比較"]
E --> G["レイテンシ/コストのリグレッションを確認"]
F --> H{"閾値を満たすか"}
G --> H
H -- "合格" --> I["マージ/本番デプロイ"]
H -- "境界線上" --> J["人間レビューへルーティング"]
H -- "明確な悪化" --> K["ビルドを失敗させる"]
J -- "承認" --> I
J -- "却下" --> K`,

  otelSpan: `flowchart TD
A["invoke_agent スパン"] --> B["chat スパン: LLM呼び出し1"]
A --> C["execute_tool スパン: ツールA呼び出し"]
A --> D["chat スパン: LLM呼び出し2"]
A --> E["execute_tool スパン: ツールB呼び出し"]
B --> F["gen_ai.usage.input/output_tokens"]
B --> G["gen_ai.response.finish_reasons"]
C --> H["ツール引数/実行結果"]
D --> I["gen_ai.request.model"]`,

  drift: `flowchart TD
A["本番トラフィックのトレース"] --> B["5〜10%をサンプリング"]
B --> C["Faithfulness/Groundednessスコアを計算"]
B --> D["入力プロンプトの分布統計を計算"]
C --> E{"スコアが閾値を下回るか"}
D --> F{"入力分布が有意にシフトしたか"}
E -- "Yes" --> G{"入力ドリフトも同時に検知したか"}
F -- "Yes" --> G
G -- "Yes" --> H["アラート発火/オンコール通知"]
G -- "No" --> I["経過観察/ダッシュボードに記録"]
H --> J["失敗ケースを評価データセットへ還元"]`,

  flywheel: `flowchart LR
A["本番トレース収集"] --> B["オンライン評価でスコアリング"]
B --> C{"品質低下/新規失敗を検知"}
C -- "検知" --> D["失敗ケースを抽出"]
D --> E["人間レビューで検証/ラベル付け"]
E --> F["ゴールデンデータセットへ追加"]
E --> G["CI Gate評価で継続的に再テスト"]
E --> H["プロンプト/モデル/リトリーバル設定を改善"]
H --> A
C -- "問題なし" --> A`
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function LLMOpsEvaluationObservabilityGuidePage() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.kicker}>LLMOps best practices / 2026</div>
            <h1>評価・ベンチマーク &amp; オブザーバビリティ</h1>
          </div>
          <button className={styles.mobileToggle} id="llmopsNavToggle" type="button">
            <i className="ti ti-menu-2" />
            目次を開く
          </button>
          <nav className={styles.sidebarNav} id="llmopsNavList">
            <a href="#section1" className={styles.tocLink}>
              <i className="ti ti-info-circle" />
              <span>1. はじめに</span>
            </a>
            <a href="#section2" className={styles.tocLink}>
              <i className="ti ti-hierarchy-3" />
              <span>2. 全体像</span>
            </a>
            <div className={styles.navGroupLabel}>Step by step</div>
            <a href="#section3" className={styles.tocLink}>
              <i className="ti ti-stack-2" />
              <span>3. Step1: 評価戦略の3層設計</span>
            </a>
            <a href="#section4" className={styles.tocLink}>
              <i className="ti ti-list-numbers" />
              <span>4. Step2: 評価指標の分類</span>
            </a>
            <a href="#section5" className={styles.tocLink}>
              <i className="ti ti-trophy" />
              <span>5. Step3: 公開ベンチマーク</span>
            </a>
            <a href="#section6" className={styles.tocLink}>
              <i className="ti ti-database-search" />
              <span>6. Step4: RAG評価</span>
            </a>
            <a href="#section7" className={styles.tocLink}>
              <i className="ti ti-robot" />
              <span>7. Step5: エージェント評価</span>
            </a>
            <a href="#section8" className={styles.tocLink}>
              <i className="ti ti-gavel" />
              <span>8. Step6: LLM-as-a-Judge</span>
            </a>
            <a href="#section9" className={styles.tocLink}>
              <i className="ti ti-users" />
              <span>9. Step7: Human-in-the-Loop</span>
            </a>
            <a href="#section10" className={styles.tocLink}>
              <i className="ti ti-git-pull-request" />
              <span>10. Step8: CI/CD評価ゲート</span>
            </a>
            <a href="#section11" className={styles.tocLink}>
              <i className="ti ti-antenna" />
              <span>11. Step9: OTel GenAI規約</span>
            </a>
            <a href="#section12" className={styles.tocLink}>
              <i className="ti ti-activity" />
              <span>12. Step10: ドリフト・幻覚検知</span>
            </a>
            <a href="#section13" className={styles.tocLink}>
              <i className="ti ti-currency-yen" />
              <span>13. Step11: コスト・レイテンシ</span>
            </a>
            <a href="#section14" className={styles.tocLink}>
              <i className="ti ti-apps" />
              <span>14. Step12: ツール選定</span>
            </a>
            <a href="#section15" className={styles.tocLink}>
              <i className="ti ti-refresh" />
              <span>15. Step13: フィードバックループ</span>
            </a>
            <div className={styles.navGroupLabel}>Wrap up</div>
            <a href="#section16" className={styles.tocLink}>
              <i className="ti ti-checklist" />
              <span>16. 実践チェックリスト</span>
            </a>
            <a href="#section17" className={styles.tocLink}>
              <i className="ti ti-flag-2" />
              <span>17. まとめ</span>
            </a>
            <a href="#section18" className={styles.tocLink}>
              <i className="ti ti-books" />
              <span>18. 総合参考資料一覧</span>
            </a>
          </nav>
        </aside>

        <main className={styles.content}>
          <div className={styles.contentHeader}>
            <div className={styles.eyebrow}>Step-by-step guide</div>
            <h1>LLM評価・ベンチマーク &amp; オブザーバビリティ ベストプラクティスガイド(2026年版)</h1>
            <p>
              対象読者:AI/MLエンジニア、ソフトウェアアーキテクト、QAエンジニアで、LLMアプリケーションの品質評価(Evaluation)、公開ベンチマーク(Benchmarking)の読み方、そして本番環境でのオブザーバビリティ(Observability)を体系的に学びたい初学者〜中級者。本ガイドは2026年7月時点で参照可能な一次情報・業界レポートに基づいています。LLMエコシステムは変化が非常に速い領域のため、ツールのバージョンや料金体系は必ず公式サイトで最新情報を確認してください。
            </p>
          </div>

          <section id="section1">
            <h2>
              <i className="ti ti-info-circle" />1. はじめに:なぜ評価とオブザーバビリティが必要なのか
            </h2>
            <p>
              LLMを使ったアプリケーションには、従来のソフトウェアテストが前提としてきた「同じ入力には同じ出力が返る」という決定論的な性質がありません。プロンプトを1単語変えただけでも出力の質が大きく変わり、ある不具合を直しても別の不具合が静かに生まれることがあります。さらに深刻なのは、LLMが失敗しても例外は発生せず、HTTPステータスコードは200のまま、もっともらしい誤った回答(ハルシネーション)を返す点です。この「静かな失敗」こそが、評価(Evaluation)とオブザーバビリティ(Observability)という2つの規律が2026年のLLMOpsにおいて中核的な実践になっている理由です。
            </p>
            <p>
              実務上のリスクも具体化しています。大手メディアがAI生成記事の誤りで訂正を余儀なくされたり、大手テック企業がAIニュース要約機能を一時停止した事例が報告されており、評価を怠ることは「シートベルトなしで運転する」ことに例えられています。さらにEU
              AI Actのような規制は2026年8月2日から本格施行され、リスクベースでの評価証跡の保存が義務化される領域が拡大しています。
            </p>

            <div className={styles.calloutGrid}>
              <div className={styles.calloutCard}>
                <i className={`${styles.calloutIcon} ti ti-target-arrow`} />
                <h4>Evaluation(評価)</h4>
                <p>
                  LLMの出力を品質・安全性・コスト・レイテンシといった複数の観点でスコアリングする行為そのもの。
                </p>
              </div>
              <div className={styles.calloutCard}>
                <i className={`${styles.calloutIcon} ti ti-trophy`} />
                <h4>Benchmarking(ベンチマーク)</h4>
                <p>
                  公開データセットや標準化されたタスク集合を使い、モデル同士を横並びで比較する行為。
                </p>
              </div>
              <div className={styles.calloutCard}>
                <i className={`${styles.calloutIcon} ti ti-antenna`} />
                <h4>Observability(オブザーバビリティ)</h4>
                <p>
                  本番環境で実際に何が起きているかを、トレース・メトリクス・ログとして可視化し続ける仕組み。
                </p>
              </div>
            </div>

            <p>
              この3つは独立した活動ではなく、開発から本番運用まで続く1本のライフサイクルの異なる段階を担っています。
            </p>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://gogloby.com/insights/llm-evaluation/">
                    What is LLM Evaluation: Best Frameworks, Metrics, Tools &amp; Practices in 2026
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://medium.com/@future_agi/llm-evaluation-frameworks-metrics-and-best-practices-2026-edition-162790f831f4">
                    LLM Evaluation: Frameworks, Metrics, and Best Practices (2026 Edition)
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://techsy.io/en/blog/llm-evals-guide">
                    LLM Evaluation: Metrics, Frameworks &amp; Best Practices(EU AI Act施行時期)
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section2">
            <h2>
              <i className="ti ti-hierarchy-3" />2. 全体像:Evaluation・Benchmarking・Observabilityの関係
            </h2>
            <p>
              2026年時点のベストプラクティスでは、評価は「開発が終わった後の後付け作業」ではなく、プロンプト・データセット・ポリシーをコードと同様にバージョン管理された一級市民(first-class, versioned assets)として扱う考え方が定着しています。評価とトレースをモデルバージョンに紐付けることで、すべての出力に明確な系譜(lineage)を持たせられます。
            </p>
            <p>評価は開発ライフサイクルの3つの地点で実行されます。</p>
            <ol>
              <li>
                <strong>オフライン評価</strong>:キュレーションされたデータセットに対して実行(開発中・リリース前)
              </li>
              <li>
                <strong>CI Gate評価</strong>:プロンプトやモデルを変更するたびにCI上で自動実行(マージ前)
              </li>
              <li>
                <strong>オンライン評価</strong>:実際の本番トラフィックに対して継続的に実行(リリース後)
              </li>
            </ol>
            <p>これら3層をどうつなげるかを示したのが以下の図です。</p>

            <div className={styles.diagramBlock}>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAMS.lifecycle} />
              </div>
              <div className={styles.diagramCaption}>評価とオブザーバビリティの全体ライフサイクル</div>
            </div>

            <p>
              この図が示す通り、オブザーバビリティで収集したトレースは、次の評価データセットの材料(=データフライホイール)として還元され続けます。これが単発のテストと2026年のLLM評価の最大の違いです。
            </p>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://medium.com/online-inference/the-best-llm-evaluation-tools-of-2026-40fd9b654dce">
                    The best LLM evaluation tools of 2026
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://futureagi.com/blog/llm-evaluation-frameworks-metrics-best-practices/">
                    Best LLM Evaluation Frameworks in 2026: Ranked for Production
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section3">
            <h2>
              <span className={styles.stepBadge}>STEP 1</span>3. 評価戦略を3層で設計する
            </h2>
            <p>
              評価を始める前に、まず「何を良い出力とするか」を定義する必要があります。ベストプラクティスとして繰り返し挙げられるのが以下の4点です。
            </p>
            <ol>
              <li>
                <strong>本番を代表するデータセットを使う</strong>:ベンチマーク用の綺麗な質問だけでなく、実際のユーザーの入力(表記揺れ、不完全な質問、業界固有の用語など)を反映させる。
              </li>
              <li>
                <strong>自動評価と人手評価を組み合わせる</strong>:単一の評価手法だけでは不十分であるため、決定論的メトリクス・統計的メトリクス・LLM-as-a-Judgeを併用します。
              </li>
              <li>
                <strong>継続的に評価する</strong>:一度きりの品質チェックではなく、CIとオンライン監視の両方で継続的に実行する。
              </li>
              <li>
                <strong>失敗を定期的にレビューする</strong>:失敗事例を単なるバグ修正で終わらせず、評価データセットへ組み込むプロセスを設計する。
              </li>
            </ol>
            <p>
              データセットの出どころとしては、本番ログから抽出した実際のユーザークエリ、既知の失敗ケース、意図的に作られたエッジケースが最も価値が高いとされています。合成データだけに頼ると、実運用との乖離が生じやすくなります。
            </p>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://gogloby.com/insights/llm-evaluation/">
                    What is LLM Evaluation: Best Frameworks, Metrics, Tools &amp; Practices in 2026
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://futureagi.com/blog/llm-evaluation-frameworks-metrics-best-practices/">
                    Best LLM Evaluation Frameworks in 2026: Ranked for Production
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://zylos.ai/research/2026-01-16-llm-evaluation-benchmarking/">
                    LLM Evaluation and Benchmarking 2026 | Zylos Research
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section4">
            <h2>
              <span className={styles.stepBadge}>STEP 2</span>4. 評価指標(メトリクス)の分類を理解する
            </h2>
            <p>
              評価指標は大きく3種類に分類できます。それぞれ得意なことと苦手なことが異なるため、単独ではなく組み合わせて使うのが2026年の標準的なアプローチです。
            </p>

            <table>
              <thead>
                <tr>
                  <th style={{ width: "20%" }}>分類</th>
                  <th>説明</th>
                  <th>代表例</th>
                  <th>長所</th>
                  <th>短所</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>決定論的<br />(Deterministic)</td>
                  <td>ルールベースの厳密一致・正規表現・スキーマ検証</td>
                  <td>完全一致、JSON/XMLスキーマ検証、正規表現チェック</td>
                  <td>高速・低コスト・再現性が高い</td>
                  <td>意味的な誤りを検出できない</td>
                </tr>
                <tr>
                  <td>統計的<br />(Statistical)</td>
                  <td>単語やベクトルの類似度に基づくスコア</td>
                  <td>BLEU、ROUGE、埋め込みコサイン類似度</td>
                  <td>計算コストが低い</td>
                  <td>表層的な文字列類似度に依存し、事実の正しさを保証しない</td>
                </tr>
                <tr>
                  <td>LLM-as-a-Judge</td>
                  <td>別のLLMに出力を採点させる手法</td>
                  <td>G-Eval、DAGMetric、pairwise比較</td>
                  <td>人間の判断との一致率が高い(80〜90%程度)、柔軟な基準定義が可能</td>
                  <td>コスト・レイテンシが増える、判定側LLM自体のバイアス</td>
                </tr>
              </tbody>
            </table>

            <p>
              LLM-as-a-Judgeは、人間による評価と比べて500〜5,000倍程度低コストで、80〜90%の一致率を達成できると報告されており、量産評価の主軸になっています。ただし人間の判断を完全に置き換えるものではなく、「自動評価で全件をスクリーニングし、フラグが立ったケースだけを人間がレビューする」という補完関係で使うのがベストプラクティスとされています。
            </p>

            <h3>実務でよく使われるLLM-as-a-Judgeの実装パターン</h3>
            <ul>
              <li>
                <strong>criteria(基準)ベース</strong>:新しいメトリクスを試作する初期段階で使う、自然言語による大まかな評価基準。
              </li>
              <li>
                <strong>evaluation_steps(手順)ベース</strong>:メトリクスがCI/CDや本番監視で重要になった段階で、採点手順を明示的なステップに分解する。
              </li>
              <li>
                <strong>GEval(参照ベース)</strong>:正解(reference)を含めることで、正解との比較を伴う採点に発展させる。
              </li>
              <li>
                <strong>DAGMetric</strong>:複数ステップの厳密な採点ロジックを有向非巡回グラフ(DAG)としてモデル化する手法。
              </li>
              <li>
                <strong>ArenaGEval</strong>:プロンプトやモデルのバージョン同士をペアで比較する手法。
              </li>
            </ul>

            <div className={styles.diagramBlock}>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAMS.metricMix} />
              </div>
              <div className={styles.diagramCaption}>3種類のメトリクスを組み合わせた評価パネル</div>
            </div>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://deepeval.com/blog/llm-as-a-judge">
                    LLM-as-a-Judge in 2026: Top evaluation techniques and best practices | DeepEval
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://zylos.ai/research/2026-01-16-llm-evaluation-benchmarking/">
                    LLM Evaluation and Benchmarking 2026 | Zylos Research
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.braintrust.dev/articles/llm-as-a-judge-vs-human-in-the-loop-evals">
                    LLM-as-a-judge vs human-in-the-loop evals | Braintrust
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section5">
            <h2>
              <span className={styles.stepBadge}>STEP 3</span>5. 公開ベンチマーク/リーダーボードの正しい読み方
            </h2>
            <p>
              公開ベンチマークは「業界全体でモデルを比較するための共通言語」として重要ですが、2026年時点では多くの伝統的ベンチマークが飽和(Saturation)しており、単独のスコアだけで判断するのは危険です。
            </p>
            <p>
              MMLU(57分野にまたがる知識テスト)は、2020年の登場時点では平均32%だったフロンティアモデルのスコアが、2026年には平均92%前後まで上昇し、上位モデルが88〜94%の範囲に密集するようになりました。この結果、モデル間の実力差を見分ける指標としての価値が大きく低下しています。HellaSwag(常識推論)も同様に95%以上で飽和状態にあると報告されています。
            </p>
            <p>この飽和を受けて、業界はより難易度の高いベンチマークに軸足を移しています。</p>

            <table>
              <thead>
                <tr>
                  <th style={{ width: "25%" }}>ベンチマーク</th>
                  <th>主な目的</th>
                  <th>2026年時点の特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>MMLU</td>
                  <td>57分野の知識網羅性</td>
                  <td>飽和(88〜94%)。差別化指標としての価値は低下</td>
                </tr>
                <tr>
                  <td>GPQA Diamond</td>
                  <td>大学院レベルの科学推論(生物・化学・物理)</td>
                  <td>専門家でも正答率が低い難問設計。モデル間の差が明確</td>
                </tr>
                <tr>
                  <td>SWE-bench Verified</td>
                  <td>実際のソフトウェアバグの自動修正能力</td>
                  <td>コーディングエージェントの実力評価で重視</td>
                </tr>
                <tr>
                  <td>Humanity's Last Exam(HLE)</td>
                  <td>最難関の推論タスク</td>
                  <td>最上位モデルでも正答率が数十%台にとどまる</td>
                </tr>
                <tr>
                  <td>ARC-AGI-2</td>
                  <td>抽象的推論・汎化能力</td>
                  <td>パターン学習では解けない設計</td>
                </tr>
                <tr>
                  <td>LMSYS Chatbot Arena(Arena Elo)</td>
                  <td>人間による盲検A/B比較に基づく総合評価</td>
                  <td>600万票超、360以上のモデルを比較</td>
                </tr>
                <tr>
                  <td>AgentBench / GAIA / τ-bench</td>
                  <td>エージェントのツール利用・計画・タスク遂行能力</td>
                  <td>マルチステップタスクを評価</td>
                </tr>
              </tbody>
            </table>

            <p>
              Arena形式のブラインドA/Bバトルは、モデル名を伏せて2つの応答を人間に比較させ、勝敗をEloレーティングに変換する仕組みで、自動採点よりもスコアの水増しに強いとされています。一方、ベンチマークにも共通の弱点があります。
            </p>
            <ul>
              <li>
                <strong>データ汚染(Data Contamination)</strong>:モデルが学習データの中に、ベンチマークの問題そのもの(またはよく似た問題)を含んでいる可能性がある。
              </li>
              <li>
                <strong>自社ユースケースを代表しない</strong>:公開リーダーボードは、あなた自身のプロンプト形式・ツールスキーマ・言語・レイテンシ予算での挙動を予測できない。
              </li>
            </ul>
            <p>
              したがって実務的な結論は次の通りです。「リーダーボードはモデル選定の一次スクリーニングに使い、最終判断は必ず自社データでの評価(オフライン評価)で行う」。
            </p>

            <div className={styles.diagramBlock}>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAMS.benchmarkFlow} />
              </div>
              <div className={styles.diagramCaption}>公開ベンチマークから自社評価への流れ</div>
            </div>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://futureagi.com/blog/llm-leaderboard-explained/">
                    LLM Leaderboard Explained 2026: Arena, MMLU, GPQA, SWE-bench
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://valueaddvc.com/blog/ai-model-benchmarks-explained-mmlu-humaneval-lmsys-arena-and-what-they-actually-measure">
                    AI Model Benchmarks: 92% MMLU, SWE-bench, 2026
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.lxt.ai/blog/llm-benchmarks/">
                    LLM Benchmarks Compared: MMLU, HumanEval, GSM8K and More (2026)
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://iternal.ai/llm-selection-guide">
                    LLM Comparison 2026: 30+ Models Benchmarked &amp; Ranked
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://mysummit.school/blog/en/how-llm-benchmarks-work-2026/">
                    LLM Benchmarks Explained: MMLU, Chatbot Arena &amp; SWE-bench Leaderboard (2026)
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section6">
            <h2>
              <span className={styles.stepBadge}>STEP 4</span>6. RAGシステムの評価(Ragas 4大メトリクス)
            </h2>
            <p>
              RAG(Retrieval-Augmented Generation)は2026年時点で本番LLMシステムの主流パターンとなっており、専用の評価アプローチが確立されています。RAGの評価は「検索(Retrieval)の質」と「生成(Generation)の質」という2つの独立した失敗モードに分解して考えるのが鉄則です。
            </p>
            <p>
              Ragas(オープンソースのRAG評価フレームワーク)を軸に、業界で最も広く使われている4つのコアメトリクスは以下の通りです。
            </p>

            <table>
              <thead>
                <tr>
                  <th style={{ width: "25%" }}>メトリクス</th>
                  <th>測定対象</th>
                  <th>何を検出するか</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Faithfulness(忠実性)</td>
                  <td>生成</td>
                  <td>回答が検索コンテキストに基づいているか(根拠のないハルシネーションがないか)</td>
                </tr>
                <tr>
                  <td>Answer Relevancy(回答の関連性)</td>
                  <td>生成</td>
                  <td>回答がユーザーの質問に実際に答えているか</td>
                </tr>
                <tr>
                  <td>Context Precision(コンテキスト精度)</td>
                  <td>検索</td>
                  <td>検索されたチャンクが質問に関連しているか</td>
                </tr>
                <tr>
                  <td>Context Recall(コンテキスト再現率)</td>
                  <td>検索</td>
                  <td>正解を導くために必要な情報が検索結果に含まれているか</td>
                </tr>
              </tbody>
            </table>

            <p>
              このほか、Context Entity Recall、Answer Correctness、Answer Similarity、Aspect Critiqueといった拡張メトリクスも用意されています。
            </p>

            <div className={styles.leadNote}>
              <p>
                <strong>教訓となる事例</strong>:ある法律系RAGシステムでは、オフライン評価でFaithfulness 0.91という高スコアを記録していたにもかかわらず、本番稼働後に「複数ホップの質問で重要な条文が回答から漏れる」不具合が報告されました。調査するとContext Recallはわずか0.62しかなく、検索側が2つ目の条文を取得できていなかったことが判明しました。生成モデルは取得できた部分的なコンテキストに忠実に(Faithfulness高く)回答していたため、生成品質だけを見るダッシュボードでは検知できなかったのです。
              </p>
            </div>

            <div className={styles.diagramBlock}>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAMS.ragEval} />
              </div>
              <div className={styles.diagramCaption}>検索と生成を分けて測定するRAG評価パイプライン</div>
            </div>

            <p>
              Ragasの実装は、LLM-as-a-Judgeの考え方を使い、回答を原子的な主張(atomic claim)に分解し、それぞれの主張を検索されたコンテキストと突き合わせて0〜1の連続値スコアを返します。文字列の完全一致を求める従来のユニットテストとは異なり、このスコアは時系列で追跡したり、CIでゲートしたり、質問の種類ごとにスライスして分析することができます。
            </p>
            <p>
              実践フローとしては、まず50〜200件程度の代表的なクエリからなる「ゴールデンデータセット」を用意し、可能であれば手動で検証した理想的な回答と情報源の文書を紐づけます。最初はFaithfulnessとContext Recallの2つから計測を始め、CIに組み込んで閾値を設定し、その後アプリケーションの進化に合わせてメトリクスとデータセットを拡張していくアプローチが推奨されています。
            </p>
            <p>
              なお、標準的な4メトリクスは「検索インデックス自体が信頼できる」ことを前提にしている点に注意が必要です。検索対象のドキュメントが古い、所有者が不明、正規のソースと食い違っているといった場合、Faithfulnessスコアが高くてもビジネス上誤った回答を返すことがあります。これは「コンテキストの信頼性」という第5の評価軸として指摘されており、データのリネージ管理と合わせて考える必要があります。
            </p>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://qaskills.sh/blog/ragas-rag-evaluation-metrics-complete-guide">
                    Ragas RAG Evaluation Metrics Complete Guide 2026
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://futureagi.com/blog/rag-evaluation-metrics-2025/">
                    RAG Evaluation Metrics in 2026: Faithfulness &amp; More
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://atlan.com/know/how-to-evaluate-rag-systems-explained/">
                    RAG Evaluation: Metrics, Tools, and the Context Gap (2026)
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://datavlab.ai/post/rag-evaluation-methods-metrics-2026-guide">
                    RAG Evaluation 2026: Methods, Metrics, Frameworks
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section7">
            <h2>
              <span className={styles.stepBadge}>STEP 5</span>7. AIエージェントの評価(3層評価モデル)
            </h2>
            <p>
              AIエージェント(複数ステップでツール呼び出しや計画立案を行うシステム)は、単発の応答を評価するだけでは不十分です。エージェントは「すべてのツール呼び出しは正しいのに、最終的なタスクは失敗している」というケースが起こり得るためです。2026年のベストプラクティスでは、評価を3つの層に分けて考えます。
            </p>
            <ol>
              <li>
                <strong>Final-answer評価(最終出力評価)</strong>:最後のメッセージを期待される結果と比較する。ほとんどのベンチマークが対象とする層。
              </li>
              <li>
                <strong>Trajectory評価(実行軌跡評価)</strong>:ステップの並びとツール呼び出しの系列を評価する。正しい手順を踏んだか、無駄なループがなかったかを見る。
              </li>
              <li>
                <strong>Per-turn評価(ターンごとの評価)</strong>:本番環境の各ターンの意味を評価する。オフラインでは再現できない、実際のやり取りの品質を捉える。
              </li>
            </ol>
            <p>
              held-outタスクに対する最終回答の正解率だけを見る評価は、「ループしてから答えたか」「間違ったツールを呼んで後から回復したか」「途中で推論過程を漏洩したか」「3ターン目でユーザーが苛立っていたか」といった、本番トラフィックでしか見えない失敗をほとんど検出できません。
            </p>

            <table>
              <thead>
                <tr>
                  <th style={{ width: "30%" }}>メトリクス</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Task Completion(タスク完了率)</td>
                  <td>ユーザーが与えたタスクをエージェントが完了できたかどうか</td>
                </tr>
                <tr>
                  <td>Tool Call Accuracy(ツール呼び出し精度)</td>
                  <td>正しいツールを、正しい順序で、正しい引数で呼び出せたか</td>
                </tr>
                <tr>
                  <td>Trajectory Match(軌跡一致度)</td>
                  <td>期待される実行系列とどれだけ一致しているか</td>
                </tr>
                <tr>
                  <td>Reasoning(推論の一貫性)</td>
                  <td>各ステップの判断がゴールに対して妥当か、思考の連鎖が一貫しているか</td>
                </tr>
                <tr>
                  <td>Step/Loop Count(ステップ数・ループ回数)</td>
                  <td>無駄な繰り返しや暴走ループがないか</td>
                </tr>
                <tr>
                  <td>Cost per Successful Task</td>
                  <td>タスク完了に要したトークン・API費用</td>
                </tr>
              </tbody>
            </table>

            <p>
              代表的な公開エージェントベンチマークとしては、AgentBench(先駆的なエージェント行動評価)、GAIA(ブラウザ操作・ファイル検索・ツール利用を要する現実的タスク)、τ-bench(プリンストン大学とSierra社が開発したカスタマーサービスタスク評価)などがあります。
            </p>

            <div className={styles.diagramBlock}>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAMS.agentEval} />
              </div>
              <div className={styles.diagramCaption}>Final-answer / Trajectory / Per-turn の3層評価モデル</div>
            </div>

            <p>
              エージェントは非決定的であるため、同じ入力でも実行のたびに異なるツールを選んだり、異なるコンテキストを検索したりします。オフライン評価は既知タスクの固定データセットに対してCIで再現性高く実行し、オンライン評価は実際のトラフィックに対してドリフトや未知の失敗、ジェイルブレイクの試行を検知する、という役割分担が基本です。
            </p>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide">
                    LLM Agent Evaluation Metrics in 2026 | Confident AI
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.morphllm.com/ai-agent-evaluation">
                    AI Agent Evaluation (2026): Metrics, Frameworks, and Production Failures
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.getmaxim.ai/articles/top-5-ai-agent-evaluation-platforms-in-2026/">
                    Top 5 AI Agent Evaluation Platforms in 2026
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.confident-ai.com/knowledge-base/compare/best-llm-evaluation-tools-for-ai-agents">
                    Best LLM Evaluation Tools for AI Agents in 2026
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section8">
            <h2>
              <span className={styles.stepBadge}>STEP 6</span>8. LLM-as-a-Judgeを正しく使う
            </h2>
            <p>
              LLM-as-a-Judgeは強力な手法ですが、判定側LLM自体が一貫性を欠いたりバイアスを持ったりすることが学術研究でも指摘されています。実務で安定した運用をするためのポイントは以下の通りです。
            </p>
            <ul>
              <li>
                <strong>temperatureを0に固定する</strong>:自動パイプラインでLLM-as-a-Judgeを実行する際は、再現性のあるスコアリングのためにtemperatureを0に設定するのが推奨されています。
              </li>
              <li>
                <strong>pairwise比較を活用する</strong>:単一応答への絶対スコアよりも、2つの応答を比較させる方が、判定の一貫性が高くなる傾向があります。
              </li>
              <li>
                <strong>判定プロンプトのバージョン管理</strong>:判定プロンプトを変更した場合、過去のスコアとの比較は無効になります。変更時点でベースラインを再計測し、境界としてタグ付けする必要があります。
              </li>
              <li>
                <strong>人間によるキャリブレーション</strong>:定期的に人間のレビューとの一致率を確認し、判定プロンプトを調整します。
              </li>
              <li>
                <strong>バイアスと一貫性の分析</strong>:同じ入力を複数回判定させて分散を見る、判定順序を入れ替えて位置バイアスがないか確認するといった手法で信頼性を検証します。
              </li>
            </ul>
            <p>
              LLM-as-a-Judgeは自動採点の量産化に不可欠な一方、人間の判断を完全に置き換えるものではなく、「自動評価で全件をスクリーニングし、境界線上や重要なケースだけを人間がレビューする」というハイブリッド運用が2026年の標準的な考え方です。
            </p>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://deepeval.com/blog/llm-as-a-judge">
                    LLM-as-a-Judge in 2026: Top evaluation techniques and best practices | DeepEval
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://galtea.ai/blog/automated-llm-evaluation-building-a-ci-cd-quality-gate-that-actually-runs">
                    Automated LLM Evaluation: Building a CI/CD quality gate that actually runs | Galtea
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://latitude.so/blog/ultimate-ci-cd-llm-evaluation-guide">
                    Ultimate Guide to CI/CD for LLM Evaluation | Latitude
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section9">
            <h2>
              <span className={styles.stepBadge}>STEP 7</span>9. Human-in-the-Loop評価ワークフロー
            </h2>
            <p>
              自動評価だけでは捉えきれない品質次元(トーン、ポリシー遵守、ドメイン固有の妥当性など)を扱うために、人間によるレビュー(Human-in-the-Loop, HITL)は依然として不可欠です。効果的なHITLワークフローを構築するための実践ポイントは以下の通りです。
            </p>
            <ol>
              <li>
                <strong>明確な採点基準を先に定義する</strong>:「5点」が何を意味するのか(事実の正確性か、トーンか、タスク完了か、ポリシー遵守か)を、レビューを始める前に定義します。
              </li>
              <li>
                <strong>単純な尺度から始め、キャリブレーションセッションを行う</strong>:1〜5点の有用性評価のようなシンプルな尺度から始め、複数のレビュアーが解釈をすり合わせるセッションを実施します。
              </li>
              <li>
                <strong>エンドユーザーとレビュアーの役割を分ける</strong>:エンドユーザーには可視化された結果についてフィードバックを求め、検索・ツール呼び出し・ガードレールといった内部の仕組みはドメインエキスパートやQAレビュアーが評価します。
              </li>
              <li>
                <strong>信頼度ベースの選択的レビュー</strong>:LLMがすべての項目にラベルを付け、信頼度スコアが低いものだけを人間の再レビューに回すことで、コストを50〜96%程度削減できたという報告があります。ただし自動化バイアスのリスクに注意が必要です。
              </li>
              <li>
                <strong>失敗を評価データセットに還元する</strong>:レビュアーが発見したツール呼び出しの誤りや微妙な推論エラーを、テストスイートに追加し将来の更新で自動採点されるようにします。
              </li>
            </ol>
            <p>
              学術研究では、LLMを評価者として使う場合の一貫性・バイアスに関する課題(位置バイアス、冗長性バイアスなど)が報告されており、自動化された判定と人間の判断を組み合わせた「五層の監督スタック」(自動チェック、LLM採点、人間レビュー、人間による監視、フィードバックループ)が最も高い信頼性を実現するという指摘もあります。
            </p>

            <div className={styles.diagramBlock}>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAMS.hitl} />
              </div>
              <div className={styles.diagramCaption}>Human-in-the-Loopのレビューフィードバックループ</div>
            </div>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.comet.com/site/blog/human-in-the-loop/">
                    Human-in-the-Loop Review Workflows for LLM Applications &amp; Agents | Comet
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.braintrust.dev/articles/llm-as-a-judge-vs-human-in-the-loop-evals">
                    LLM-as-a-judge vs human-in-the-loop evals | Braintrust
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.confident-ai.com/blog/human-in-the-loop-ai-agent-evaluation">
                    Human-in-the-Loop Workflows for AI Agent Evaluation | Confident AI
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://kili-technology.com/blog/human-in-the-loop-human-on-the-loop-and-llm-as-a-judge-for-validating-ai-outputs">
                    Human-in-the-Loop, Human-on-the-Loop, and LLM-as-a-Judge for Validating AI Outputs | Kili Technology
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section10">
            <h2>
              <span className={styles.stepBadge}>STEP 8</span>10. CI/CDへの評価組み込み(Evaluation Gate)
            </h2>
            <p>
              プロンプトはコードではありませんが、デプロイ対象の成果物のように振る舞います。本番のプロンプトを変更することは、アプリケーションの挙動そのものを変えることであり、コードの変更と同じレベルの厳格さが必要です。
            </p>
            <p>
              すべてのコード変更が評価トリガーになるわけではありません。以下の3種類の変更が評価実行のトリガーになるべきとされています。
            </p>
            <ol>
              <li>
                <strong>モデルバージョン/モデル設定の変更</strong>:モデルプロバイダーがモデル名を変えずに内部モデルを更新することがあるため、切り替え時は必ず全量評価を実行する。
              </li>
              <li><strong>プロンプトの変更</strong>:システムプロンプトやテンプレートの変更。</li>
              <li>
                <strong>リトリーバル設定の変更</strong>:チャンク分割戦略や埋め込みモデルの変更など、RAGの検索側の設定変更。
              </li>
            </ol>
            <p>CI/CDゲートの評価パイプラインは、以下の要素で構成されます。</p>
            <ul>
              <li>
                <strong>Batch Evaluation Engine</strong>:新しいプロンプトバージョンをテストデータセットに対して実行し、各出力をLLM-as-a-Judgeに送ってスコアリングする。
              </li>
              <li>
                <strong>品質だけでなく性能も見る</strong>:レイテンシスパイクやコスト超過を検知し、閾値を超えたらビルドを失敗させる。
              </li>
              <li>
                <strong>スコアの傾向を追跡する</strong>:単一のポイントスコアではなくトレンドとして追跡し、集団としてのリグレッションを検知する。
              </li>
              <li>
                <strong>境界線上のケースは人間レビューへ</strong>:自動判定で白黒つけがたいケースは、ハードブロックにせず人間レビューへルーティングする。
              </li>
            </ul>

            <div className={styles.diagramBlock}>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAMS.cicdGate} />
              </div>
              <div className={styles.diagramCaption}>CI/CD Evaluation Gateのフロー</div>
            </div>

            <p>
              なお、LLM評価はソフトウェアテストとは本質的に異なる点に注意が必要です。従来のテストでは入力はスペックで固定されますが、LLM評価では、失敗モードが新たに発見されるたびに、あるいは製品スコープが変わるたびに、ゴールデンデータセット自体が変化していきます。つまりデータセット管理自体を第一級のエンジニアリング課題として扱う必要があります。
            </p>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.traceloop.com/blog/automated-prompt-regression-testing-with-llm-as-a-judge-and-ci-cd">
                    Automated Prompt Regression Testing with LLM-as-a-Judge and CI/CD | Traceloop
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://galtea.ai/blog/automated-llm-evaluation-building-a-ci-cd-quality-gate-that-actually-runs">
                    Automated LLM Evaluation: Building a CI/CD quality gate that actually runs | Galtea
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.promptfoo.dev/docs/integrations/ci-cd/">
                    CI/CD Integration for LLM Eval and Security | Promptfoo
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://agenta.ai/blog/cicd-for-llm-prompts">
                    CI/CD for LLM Prompts: How to Build a Prompt Deployment Pipeline | Agenta
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.braintrust.dev/articles/best-ai-evals-tools-cicd-2025">
                    Best AI Eval Tools for CI/CD Pipelines (2026 Review) | Braintrust
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section11">
            <h2>
              <span className={styles.stepBadge}>STEP 9</span>11. オブザーバビリティ基盤 — OpenTelemetry GenAI Semantic Conventions
            </h2>
            <p>
              従来のマイクロサービス向けオブザーバビリティは、LLMアプリケーションにはそのまま使えません。LLM呼び出しは通常のHTTPリクエストよりもはるかに多くのテレメトリを生成し、プロンプトや補完結果は巨大なテキストの塊であり、ツール呼び出しのパラメータは毎回異なる構造を取り、エージェントの多段階推論は固定スキーマに収まりません。
            </p>
            <p>
              こうした課題に対応するため、2024年4月にOpenTelemetryの中にGenAI Special Interest Group(GenAI SIG)が発足し、LLM/エージェント向けのテレメトリを標準化する意味論的規約(Semantic Conventions)の策定を進めています。CNCFがバックアップするこの規約は、Google Cloud、AWS、Azure、Datadogなど主要な観測プラットフォームに採用されつつあります。
            </p>

            <h3>主要な属性(gen_ai.*)</h3>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>属性</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>gen_ai.provider.name</code></td>
                  <td>プロバイダー識別子(例:openai、anthropic、aws.bedrock)</td>
                </tr>
                <tr>
                  <td><code>gen_ai.request.model</code></td>
                  <td>リクエスト先のモデル名</td>
                </tr>
                <tr>
                  <td><code>gen_ai.response.model</code></td>
                  <td>実際に応答を生成したモデル名</td>
                </tr>
                <tr>
                  <td><code>gen_ai.usage.input_tokens</code> / <code>gen_ai.usage.output_tokens</code></td>
                  <td>入力/出力トークン数</td>
                </tr>
                <tr>
                  <td><code>gen_ai.response.finish_reasons</code></td>
                  <td>生成が終了した理由(例:stop、tool_calls)</td>
                </tr>
                <tr>
                  <td><code>gen_ai.operation.name</code></td>
                  <td>操作の種別(例:chat、text_completion、execute_tool)</td>
                </tr>
                <tr>
                  <td><code>gen_ai.input.messages</code> / <code>gen_ai.output.messages</code></td>
                  <td>プロンプト・応答の内容(コンテンツ記録がオプトインされた場合のみ)</td>
                </tr>
              </tbody>
            </table>

            <p>
              規約は「クライアントスパン」「エージェントスパン」「MCP(Model Context Protocol)ツール呼び出し」「イベント」「メトリクス」「プロバイダー固有の規約」という6つの層をカバーしています。エージェントがLLMを呼び出す際は、トップレベルの<code>invoke_agent</code>スパンの下に、各LLM呼び出しに対応する<code>chat</code>スパンと、各ツール呼び出しに対応する<code>execute_tool</code>スパンが子として連なるスパンツリーが形成されます。
            </p>

            <div className={styles.diagramBlock}>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAMS.otelSpan} />
              </div>
              <div className={styles.diagramCaption}>OTel GenAIのトレーススパンツリー</div>
            </div>

            <h3>メトリクス</h3>
            <p>
              <code>gen_ai.client.operation.duration</code>(LLM呼び出しのレイテンシのヒストグラム)や<code>gen_ai.client.token.usage</code>(トークン消費量のヒストグラム、<code>gen_ai.token.type</code>で入力/出力を区別)といったメトリクスにより、モデルごとのコスト推定、レイテンシ回帰の検知、モデル横断的な利用パターンの監視が可能になります。
            </p>

            <h3>現状の成熟度と注意点</h3>
            <p>
              2026年前半時点で、規約は正式には「Development(開発中)」ステータスにあり、多くの<code>gen_ai.*</code>属性は依然として実験的(Experimental)扱いです。属性名は将来的に変更される可能性があるため、既存のインストルメンテーションを使うチームは<code>OTEL_SEMCONV_STABILITY_OPT_IN</code>環境変数によって、旧バージョンと最新実験版のどちらを出力するか制御できます。OpenAI Python SDKのインストルメンテーションが最も成熟しており、Anthropic・Cohere・AWS Bedrockなどはコミュニティライブラリ(OpenLLMetryなど)経由でカバーされています。Datadog・Honeycomb・New Relicといった主要ベンダーは既にこの規約をネイティブサポートしています。
            </p>

            <h3>プライバシーと3段階のコンテンツ記録モデル</h3>
            <p>
              プロンプトや補完結果の全文をスパンに記録することはデバッグに強力ですが、顧客データやPIIを含む可能性があるため、データガバナンス上のリスクにもなります。デフォルトではプロンプトの内容やツール引数は記録されず、モデル名・トークン数・所要時間といったメタデータのみが含まれます。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>env</span>
                <span className={styles.codeLang}>bash</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-bash">
                  <div className={styles.codeLine}><span className={styles.cc}># 環境変数の例(コンテンツ記録を有効化する場合の設定イメージ)</span></div>
                  <div className={styles.codeLine}><span className={styles.cv}>OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT</span><span>=</span><span className={styles.cs}>true</span></div>
                  <div className={styles.codeLine}><span className={styles.cc}># 推奨: 機微情報をエクスポート前にレダクションするコレクタープロセッサーと併用する</span></div>
                </code>
              </pre>
            </div>

            <p>
              OpenTelemetryはあくまで「何が起きたか」を記録するテレメトリの土台であり、「その結果が良かったかどうか」の評価(忠実性・毒性・ポリシー遵守など)は担いません。実務では両者を組み合わせたアーキテクチャ(OTelをデータプレーンとし、専用 of 評価レイヤーをその上に重ねる構成)が推奨されています。
            </p>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/">
                    Semantic conventions for generative client AI spans | OpenTelemetry(公式仕様)
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://opentelemetry.io/docs/specs/semconv/gen-ai/">
                    Generative AI semantic conventions | OpenTelemetry(公式)
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://opentelemetry.io/blog/2026/genai-observability/">
                    Inside the LLM Call: GenAI Observability with OpenTelemetry
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://greptime.com/blogs/2026-05-09-opentelemetry-genai-semantic-conventions">
                    How OpenTelemetry Traces LLM Calls, Agent Reasoning, and MCP Tools | Greptime
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.fiddler.ai/blog/opentelemetry-ai-observability-guide">
                    OpenTelemetry for AI Observability: What It Covers and Where It Stops | Fiddler AI
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://mlflow.org/docs/latest/genai/tracing/opentelemetry/genai-semconv/">
                    OpenTelemetry GenAI Semantic Conventions | MLflow AI Platform
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section12">
            <h2>
              <span className={styles.stepBadge}>STEP 10</span>12. 本番監視 — ドリフト検知とハルシネーション検知
            </h2>
            <p>
              本番のLLMシステムは、ローンチ時にうまく機能していても、数ヶ月かけて静かに劣化していくことがあります。これを引き起こすメカニズムが「ドリフト(Drift)」です。
            </p>

            <h3>モデルドリフトとデータドリフトの違い</h3>
            <ul>
              <li>
                <strong>モデルドリフト</strong>:デプロイされたモデルの性能が、学習/評価時点の前提条件から世界が変化したことで劣化する現象。LLM/エージェントシステムでは忠実性、グラウンデッドネス、タスク成功率、ツール呼び出し精度、下流のコンバージョン率が代表的な指標になります。
              </li>
              <li>
                <strong>データドリフト(プロンプト分布ドリフト)</strong>:実際のユーザーが送る入力の分布が時間とともに変化する現象。平均プロンプト長、語彙、話題の分布の変化を監視します。
              </li>
            </ul>
            <p>
              2026年時点で多くのチームは自社モデルを学習しておらず、ゲートウェイの背後でGPT系・Claude系・Gemini系・オープンソースのLlama系モデルを切り替えて使っています。プロバイダー側がモデル名を変えずに内部モデルを更新することもあるため、ガバナンス上の注意が必要です。
            </p>

            <table>
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>手法</th>
                  <th>概要</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PSI(Population Stability Index)</td>
                  <td>入力/出力分布の変化を数値化する統計指標</td>
                </tr>
                <tr>
                  <td>KS検定(Kolmogorov-Smirnov test)</td>
                  <td>2つの分布が同一かどうかを検定する統計的手法</td>
                </tr>
                <tr>
                  <td>埋め込み(Embedding)コサイン類似度</td>
                  <td>プロンプトや応答をベクトル化し、意味的な変化を捉える</td>
                </tr>
                <tr>
                  <td>オートエンコーダによる再構成誤差</td>
                  <td>埋め込みの再構成損失を使い、セマンティックドリフトを検知する</td>
                </tr>
              </tbody>
            </table>

            <p>
              2026年のベストプラクティスとして、ドリフト監視はトレース・評価スコア・ガードレール判定と同じ観測ストリームに統合し、単一のアラート体系にまとめることが推奨されています。入力側のドリフトだけでは誤検知になりやすいため、「入力分布の変化」と「評価スコアの低下」が同時に発生した場合にアラートを発火させる、という条件付きの設計が実務的です。
            </p>

            <h3>ハルシネーション検知の3つのアプローチ</h3>
            <ol>
              <li>
                <strong>検索グラウンディングチェック(RAG向け)</strong>:応答を検索コンテキストと照合し、根拠のない主張がないかを採点する。Faithfulnessスコアが0.7を下回った場合にアラートを出す運用も報告されています。
              </li>
              <li>
                <strong>自動LLM-as-a-Judge評価</strong>:本番トレースの5〜10%程度をサンプリングし、評価用モデルに通してハルシネーションリスクスコアを追跡し、統計的に有意な増加が見られた場合にアラートを出す。
              </li>
              <li>
                <strong>グラウンデッドネスチェック(ルールベース)</strong>:事実・価格・日付を引用する応答について、既知の商品名や価格帯・日付といった正規表現ベースのチェックを行う。
              </li>
            </ol>
            <p>
              より高度な手法として、応答全体に単一のスコアを付けるのではなく、文単位でハルシネーションの有無を判定する「スパンレベルのハルシネーション検知」も報告されており、長文コンテンツで部分的な誤りが全体の信頼性評価を歪めるのを防ぐのに有効です。
            </p>

            <div className={styles.diagramBlock}>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAMS.drift} />
              </div>
              <div className={styles.diagramCaption}>ドリフト検知とハルシネーション検知のアラートフロー</div>
            </div>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://futureagi.com/blog/model-vs-data-drift-how-to-identify-and-handle-it/">
                    Model Drift vs Data Drift in 2026: Detection &amp; Mitigation Guide | Future AGI
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://valuestreamai.com/blog/ai-monitoring-in-production-guide-2026">
                    AI Monitoring in Production 2026: LLM Observability &amp; Drift Detection
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://openobserve.ai/blog/llm-monitoring-best-practices/">
                    LLM Monitoring Best Practices: Complete Guide for 2026 | OpenObserve
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.getmaxim.ai/articles/how-to-detect-hallucinations-in-your-llm-applications/">
                    How to Detect Hallucinations in Your LLM Applications | Maxim AI
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://galileo.ai/blog/best-llm-output-drift-monitoring-platforms">
                    9 Best LLM Drift Monitoring Platforms in 2026 | Galileo
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section13">
            <h2>
              <span className={styles.stepBadge}>STEP 11</span>13. コスト・レイテンシ監視
            </h2>
            <p>
              LLM APIはトークン単位で課金されるため、コストは容易に制御不能な規模に膨らみます。コストを一級の監視対象として扱うためのポイントは以下の通りです。
            </p>
            <ul>
              <li>
                <strong>ユーザー単位・テナント単位・機能単位で予算を設定する</strong>:ハードリミット(強制停止)とソフトアラート(警告通知)の両方を設定する。
              </li>
              <li>
                <strong>会話単位・タスク成功単位のコストを追跡する</strong>:単純なAPIコール数ではなく、タスクを1件成功させるのに何円かかったかを追う。
              </li>
              <li>
                <strong>プロンプト長のトレンドを監視する</strong>:プロンプトの肥大化(prompt bloat)はコスト超過の典型的な原因です。
              </li>
              <li>
                <strong>タスクに応じて安価なモデルにA/Bテストする</strong>:品質要件が許す範囲でモデルをダウングレードし、コストを最適化する。
              </li>
              <li>
                <strong>キャッシュを活用する</strong>:FAQ的な繰り返し質問に対しては、共通する応答をキャッシュして冗長なAPI呼び出しを削減する。
              </li>
            </ul>
            <p>
              レイテンシについては、平均値(p50)だけでなくp95・p99のテール(裾野)レイテンシに注目することが重要です。ユーザーが実際に体感するのはテールレイテンシであり、これを最適化すれば平均値も自然に改善するという指摘があります。プロバイダーが提供するダッシュボードは集計済みのトークン使用量とコストしか見せないことが多く、ユーザー単位・機能単位のコスト内訳、品質スコア、ドリフト指標、それらの相関関係までは可視化されません。このギャップを埋めるのが、専用のLLMオブザーバビリティ層の役割です。
            </p>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://openobserve.ai/blog/llm-monitoring-best-practices/">
                    LLM Monitoring Best Practices: Complete Guide for 2026 | OpenObserve
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://valuestreamai.com/blog/ai-monitoring-in-production-guide-2026">
                    AI Monitoring in Production 2026: LLM Observability &amp; Drift Detection
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://opentelemetry.io/blog/2026/genai-observability/">
                    Inside the LLM Call: GenAI Observability with OpenTelemetry(テールレイテンシの重要性)
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section14">
            <h2>
              <span className={styles.stepBadge}>STEP 12</span>14. ツール選定ガイド(比較表)
            </h2>
            <p>
              2026年のLLM評価・オブザーバビリティ市場は非常に多くのツールで賑わっています。以下は代表的なオープンソース/商用ツールを整理した比較表です(価格やバージョンは変化が速いため、必ず各公式サイトで最新情報を確認してください)。
            </p>

            <table>
              <thead>
                <tr>
                  <th style={{ width: "15%" }}>ツール</th>
                  <th style={{ width: "25%" }}>主な役割</th>
                  <th style={{ width: "20%" }}>ライセンス/形態</th>
                  <th>得意領域</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Langfuse</td>
                  <td>トレーシング + 評価 + プロンプト管理</td>
                  <td>MIT、セルフホスト/クラウド両対応</td>
                  <td>データ主権要件、フレームワーク非依存の柔軟性、コスト効率</td>
                </tr>
                <tr>
                  <td>Arize Phoenix / Arize AX</td>
                  <td>観測 + RAG評価 + ドリフト監視</td>
                  <td>Phoenix: Elastic License 2.0(OSS)、AX: 商用SaaS</td>
                  <td>RAG評価の深さ、ML/LLM混在ワークロードの統合監視</td>
                </tr>
                <tr>
                  <td>LangSmith</td>
                  <td>トレーシング + 評価</td>
                  <td>商用、無料枠あり</td>
                  <td>LangChain/LangGraphへの深い統合、エージェントIDE</td>
                </tr>
                <tr>
                  <td>W&amp;B Weave</td>
                  <td>トレーシング + 評価</td>
                  <td>一部OSS、商用</td>
                  <td>既存のW&amp;B ML実験管理基盤との統合</td>
                </tr>
                <tr>
                  <td>Helicone</td>
                  <td>プロキシ型ログ収集 + コスト管理</td>
                  <td>Apache 2.0</td>
                  <td>URL/ヘッダー変更のみで導入できる手軽さ、キャッシュ機能</td>
                </tr>
                <tr>
                  <td>DeepEval</td>
                  <td>評価フレームワーク(CI/CD向け)</td>
                  <td>オープンソース</td>
                  <td>Pytestネイティブ統合、G-Eval/DAGMetricなど豊富なメトリクス</td>
                </tr>
                <tr>
                  <td>Ragas</td>
                  <td>RAG評価フレームワーク</td>
                  <td>オープンソース</td>
                  <td>RAGの検索/生成メトリクスの標準実装</td>
                </tr>
                <tr>
                  <td>Braintrust</td>
                  <td>評価 + 人間レビュー + CI/CD</td>
                  <td>商用、無料枠あり</td>
                  <td>評価回帰テストに特化、人間レビューと自動評価の統合</td>
                </tr>
                <tr>
                  <td>Confident AI</td>
                  <td>評価 + 監視 + アラート</td>
                  <td>商用(DeepEvalの商用版)</td>
                  <td>本番トレース全件への自動評価、品質低下時のアラート連携</td>
                </tr>
                <tr>
                  <td>MLflow</td>
                  <td>ML実験管理 + LLMトレーシング</td>
                  <td>Apache 2.0</td>
                  <td>既存のML実験管理基盤の延長、OTel GenAI規約のネイティブ対応</td>
                </tr>
              </tbody>
            </table>

            <h3>よく紹介される組み合わせパターン</h3>
            <ul>
              <li>
                <strong>Langfuse + Arize Phoenix</strong>:Langfuseが運用テレメトリ(トークンコスト・レイテンシ・プロンプト・リクエストトレース)を担当し、PhoenixがRAG観測(忠実性スコアリング・ハルシネーション検知・検索評価)を担当する構成。
              </li>
              <li>
                <strong>LangSmith + W&amp;B Weave</strong>:LangChainに深く依存し、実験重視のワークフローを持つチーム向け。LangSmithがLangGraphの詳細なトレーシングとプロンプトデバッグを担当し、Weaveが実験管理・データセットバージョニング・評価管理を追加する構成。
              </li>
              <li>
                <strong>ゲートウェイ + 評価ツール</strong>:Helicone/Portkeyのようなプロキシゲートウェイでコストトラッキングとルーティングを行い、Phoenix/TruLensのような評価ツールで品質メトリクスを測定する構成。
              </li>
            </ul>
            <p>
              いずれの場合も、OpenTelemetry(またはOpenInferenceのようなOTel準拠の規約)を採用しているツールを選んでおくと、将来的にバックエンドを乗り換える際にアプリケーションコードの変更を避けられるという利点があります。
            </p>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://aiprosol.com/llm-observability">
                    The LLM Observability &amp; Eval Index (2026) | Aiprosol
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.firecrawl.dev/blog/best-llm-observability-tools">
                    Best LLM Observability Tools in 2026 | Firecrawl
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://guptadeepak.com/tools/top-5-llm-observability-platforms-2026/">
                    Top 5 LLM Observability Platforms 2026 | Deepak Gupta
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://langfuse.com/faq/all/best-phoenix-arize-alternatives">
                    Arize AX Alternative? Langfuse vs. Arize AI and Arize Phoenix | Langfuse公式
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://www.confident-ai.com/knowledge-base/compare/10-llm-observability-tools-to-evaluate-and-monitor-ai-2026">
                    10 LLM Observability Tools to Evaluate &amp; Monitor AI in 2026 | Confident AI
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section15">
            <h2>
              <span className={styles.stepBadge}>STEP 13</span>15. 継続的改善のフィードバックループ(Data Flywheel)
            </h2>
            <p>
              評価とオブザーバビリティの最終的な価値は、「本番で起きた失敗が、次の評価データセットを強化する」という循環(データフライホイール)を作り出すことにあります。開発データをログに残すことで、エッジケースを特定し、より一貫したLLM-as-a-Judgeスコアリングのためのペアワイズ比較を用い、失敗したトレースを価値ある新しいテストデータセットに変えるフィードバックループを構築できます。この「データフライホイール」が、評価を単発の作業から継続的な改善サイクルへと変えます。
            </p>
            <p>
              このフィードバックループを支えるのが「プロンプト・データセット・ポリシーを、コードと同様にバージョン管理された一級市民として扱う」という考え方です。評価結果とトレースをモデルバージョンに紐付けて管理することで、どの出力がどのプロンプトバージョン・どのモデルバージョンで生成されたのかという系譜を、組織全体で一貫した形で追跡できます。
            </p>

            <div className={styles.diagramBlock}>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAMS.flywheel} />
              </div>
              <div className={styles.diagramCaption}>
                本番の失敗を評価データセットへ還元するデータフライホイール
              </div>
            </div>

            <div className={styles.refBlock}>
              <h4><i className="ti ti-link" />参考資料</h4>
              <ul>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://medium.com/@future_agi/llm-evaluation-frameworks-metrics-and-best-practices-2026-edition-162790f831f4">
                    LLM Evaluation: Frameworks, Metrics, and Best Practices (2026 Edition) | Future AGI
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-external-link" />
                  <Ext href="https://medium.com/online-inference/the-best-llm-evaluation-tools-of-2026-40fd9b654dce">
                    The best LLM evaluation tools of 2026
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <section id="section16">
            <h2>
              <i className="ti ti-checklist" />16. 実践チェックリスト
            </h2>
            <p>
              導入の優先順位に迷った場合は、以下の順序で着手することが推奨されています:ログとレイテンシの記録から始め、品質評価(Evaluation)を追加し、システムが成熟するにつれて安全性評価とドリフト監視を段階的に重ねていく。目標は「すべてを一度に監視すること」ではなく、「常に何が起きていて、なぜ起きているかを把握し続けること」です。
            </p>

            <ul className={styles.checklist}>
              <li>
                <i className="ti ti-square" />
                本番ログから抽出した代表的なクエリで、50〜200件規模のゴールデンデータセットを用意した
              </li>
              <li>
                <i className="ti ti-square" />
                決定論的・統計的・LLM-as-a-Judgeの3種類のメトリクスを組み合わせている
              </li>
              <li>
                <i className="ti ti-square" />
                RAGを使う場合、Faithfulness/Answer Relevancy/Context Precision/Context Recallの4指標を計測している
              </li>
              <li>
                <i className="ti ti-square" />
                エージェントを使う場合、Final-answer/Trajectory/Per-turnの3層評価を設計している
              </li>
              <li>
                <i className="ti ti-square" />
                プロンプト・モデル・リトリーバル設定の変更時にCI Gate評価が自動実行される
              </li>
              <li>
                <i className="ti ti-square" />
                LLM-as-a-Judgeのtemperatureを0に固定し、判定プロンプトをバージョン管理している
              </li>
              <li>
                <i className="ti ti-square" />
                境界線上のケースを人間レビューにルーティングする仕組みがある
              </li>
              <li>
                <i className="ti ti-square" />
                OpenTelemetry GenAI Semantic Conventions(またはOTel準拠の規約)でトレースを収集している
              </li>
              <li>
                <i className="ti ti-square" />
                コンテンツ記録を有効化する前に、サンプリング・レダクション・保持期間ポリシーを整備した
              </li>
              <li>
                <i className="ti ti-square" />
                入力分布ドリフトと評価スコア低下を組み合わせたアラート条件を設定している
              </li>
              <li>
                <i className="ti ti-square" />
                ユーザー単位・機能単位でコスト予算とアラートを設定している
              </li>
              <li>
                <i className="ti ti-square" />
                本番の失敗ケースがゴールデンデータセットへ還元される仕組み(データフライホイール)がある
              </li>
            </ul>
          </section>

          <section id="section17">
            <h2>
              <i className="ti ti-flag-2" />17. まとめ
            </h2>
            <p>
              LLM評価・ベンチマーク・オブザーバビリティは、2026年時点でLLMOpsの中核をなす一体の規律です。ベンチマークは業界横断でモデルを比較するための一次スクリーニングとして使い、最終判断は自社データに基づくオフライン評価で行います。評価は決定論的・統計的・LLM-as-a-Judgeを組み合わせ、境界線上のケースは人間レビューにエスカレーションします。RAGでは検索と生成を分けて測定し、エージェントでは最終出力・実行軌跡・ターンごとの3層で評価します。CI/CDへの評価ゲート組み込みによってリグレッションをリリース前に検知し、OpenTelemetry GenAI Semantic Conventionsを基盤としたオブザーバビリティによって本番の挙動を可視化し、ドリフトとハルシネーションを継続的に監視します。そして最も重要なのは、本番で見つかった失敗を次の評価データセットへ還元し続けるフィードバックループ(データフライホイール)を組織として維持することです。
            </p>
          </section>

          <section id="section18">
            <h2>
              <i className="ti ti-books" />18. 総合参考資料一覧
            </h2>

            <div className={styles.refGroups}>
              <h4>評価の基礎・ベストプラクティス全般</h4>
              <div className={styles.refBlock}>
                <ul>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://medium.com/online-inference/the-best-llm-evaluation-tools-of-2026-40fd9b654dce">
                      The best LLM evaluation tools of 2026
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://gogloby.com/insights/llm-evaluation/">
                      What is LLM Evaluation: Best Frameworks, Metrics, Tools &amp; Practices in 2026 | GoGloby
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://zylos.ai/research/2026-01-16-llm-evaluation-benchmarking/">
                      LLM Evaluation and Benchmarking 2026 | Zylos Research
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://medium.com/@future_agi/llm-evaluation-frameworks-metrics-and-best-practices-2026-edition-162790f831f4">
                      LLM Evaluation: Frameworks, Metrics, and Best Practices (2026 Edition) | Future AGI
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://futureagi.com/blog/llm-evaluation-frameworks-metrics-best-practices/">
                      Best LLM Evaluation Frameworks in 2026: Ranked for Production
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://techsy.io/en/blog/llm-evals-guide">
                      LLM Evaluation: Metrics, Frameworks &amp; Best Practices
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://deepeval.com/blog/llm-as-a-judge">
                      LLM-as-a-Judge in 2026: Top evaluation techniques and best practices | DeepEval
                    </Ext>
                  </li>
                </ul>
              </div>

              <h4>オブザーバビリティ / OpenTelemetry GenAI</h4>
              <div className={styles.refBlock}>
                <ul>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/">
                      Semantic conventions for generative client AI spans | OpenTelemetry(公式仕様)
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://opentelemetry.io/docs/specs/semconv/gen-ai/">
                      Generative AI semantic conventions | OpenTelemetry(公式)
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://opentelemetry.io/blog/2026/genai-observability/">
                      Inside the LLM Call: GenAI Observability with OpenTelemetry
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://greptime.com/blogs/2026-05-09-opentelemetry-genai-semantic-conventions">
                      How OpenTelemetry Traces LLM Calls, Agent Reasoning, and MCP Tools | Greptime
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.fiddler.ai/blog/opentelemetry-ai-observability-guide">
                      OpenTelemetry for AI Observability: What It Covers and Where It Stops | Fiddler AI
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.digitalapplied.com/blog/ai-agent-observability-2026-tracing-monitoring-stack-guide">
                      AI Agent Observability 2026: Tracing &amp; Monitoring Stack
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://mlflow.org/docs/latest/genai/tracing/opentelemetry/genai-semconv/">
                      OpenTelemetry GenAI Semantic Conventions | MLflow AI Platform
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://zylos.ai/research/2026-02-28-opentelemetry-ai-agent-observability">
                      OpenTelemetry for AI Agents: Observability, Tracing, and the GenAI Semantic Conventions | Zylos Research
                    </Ext>
                  </li>
                </ul>
              </div>

              <h4>公開ベンチマーク / リーダーボード</h4>
              <div className={styles.refBlock}>
                <ul>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://futureagi.com/blog/llm-leaderboard-explained/">
                      LLM Leaderboard Explained 2026: Arena, MMLU, GPQA, SWE-bench | Future AGI
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.clickrank.ai/llm-leaderboard/">
                      LLM Leaderboard 2026: Best AI Models Benchmark &amp; Ranking
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://valueaddvc.com/blog/ai-model-benchmarks-explained-mmlu-humaneval-lmsys-arena-and-what-they-actually-measure">
                      AI Model Benchmarks: 92% MMLU, SWE-bench, 2026
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.lxt.ai/blog/llm-benchmarks/">
                      LLM Benchmarks Compared: MMLU, HumanEval, GSM8K and More (2026)
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://iternal.ai/llm-selection-guide">
                      LLM Comparison 2026: 30+ Models Benchmarked &amp; Ranked
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://mysummit.school/blog/en/how-llm-benchmarks-work-2026/">
                      LLM Benchmarks Explained: MMLU, Chatbot Arena &amp; SWE-bench Leaderboard (2026)
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://lmmarketcap.com/benchmarks">
                      AI Benchmarks 2026 - MMLU, GPQA, SWE-bench, MATH
                    </Ext>
                  </li>
                </ul>
              </div>

              <h4>RAG評価</h4>
              <div className={styles.refBlock}>
                <ul>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://qaskills.sh/blog/ragas-rag-evaluation-metrics-complete-guide">
                      Ragas RAG Evaluation Metrics Complete Guide 2026
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://futureagi.com/blog/rag-evaluation-metrics-2025/">
                      RAG Evaluation Metrics in 2026: Faithfulness &amp; More | Future AGI
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://datavlab.ai/post/rag-evaluation-methods-metrics-2026-guide">
                      RAG Evaluation 2026: Methods, Metrics, Frameworks
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://qaskills.sh/blog/rag-evaluation-metrics-complete-2026">
                      RAG Evaluation Metrics 2026: The Complete Guide
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://atlan.com/know/how-to-evaluate-rag-systems-explained/">
                      RAG Evaluation: Metrics, Tools, and the Context Gap (2026) | Atlan
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://qaskills.sh/blog/ragas-faithfulness-answer-relevancy-guide">
                      Ragas Faithfulness &amp; Answer Relevancy: 2026 Guide
                    </Ext>
                  </li>
                </ul>
              </div>

              <h4>エージェント評価</h4>
              <div className={styles.refBlock}>
                <ul>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide">
                      LLM Agent Evaluation Metrics in 2026 | Confident AI
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.morphllm.com/ai-agent-evaluation">
                      AI Agent Evaluation (2026): Metrics, Frameworks, and Production Failures
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.automationanywhere.com/company/blog/product-insights/ai-agent-benchmark">
                      AI Agent Benchmarks: The 2026 Enterprise Evaluation Guide | Automation Anywhere
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.getmaxim.ai/articles/top-5-ai-agent-evaluation-platforms-in-2026/">
                      Top 5 AI Agent Evaluation Platforms in 2026 | Maxim AI
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.confident-ai.com/knowledge-base/compare/best-llm-evaluation-tools-for-ai-agents">
                      Best LLM Evaluation Tools for AI Agents in 2026 | Confident AI
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.randalolson.com/2026/03/06/top-tools-to-evaluate-and-benchmark-ai-agent-performance-2026/">
                      Top Tools to Evaluate and Benchmark AI Agent Performance in 2026 | Dr. Randal S. Olson
                    </Ext>
                  </li>
                </ul>
              </div>

              <h4>Human-in-the-Loop</h4>
              <div className={styles.refBlock}>
                <ul>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.comet.com/site/blog/human-in-the-loop/">
                      Human-in-the-Loop Review Workflows for LLM Applications &amp; Agents | Comet
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.braintrust.dev/articles/llm-as-a-judge-vs-human-in-the-loop-evals">
                      LLM-as-a-judge vs human-in-the-loop evals | Braintrust
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.braintrust.dev/articles/best-human-in-the-loop-llm-evaluation-platforms-2026">
                      8 best human-in-the-loop LLM evaluation platforms in 2026 | Braintrust
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.confident-ai.com/blog/human-in-the-loop-ai-agent-evaluation">
                      Human-in-the-Loop Workflows for AI Agent Evaluation | Confident AI
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://kili-technology.com/blog/human-in-the-loop-human-on-the-loop-and-llm-as-a-judge-for-validating-ai-outputs">
                      Human-in-the-Loop, Human-on-the-Loop, and LLM-as-a-Judge for Validating AI Outputs | Kili Technology
                    </Ext>
                  </li>
                </ul>
              </div>

              <h4>CI/CD統合</h4>
              <div className={styles.refBlock}>
                <ul>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.traceloop.com/blog/automated-prompt-regression-testing-with-llm-as-a-judge-and-ci-cd">
                      Automated Prompt Regression Testing with LLM-as-a-Judge and CI/CD | Traceloop
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.braintrust.dev/articles/best-ai-evals-tools-cicd-2025">
                      Best AI Eval Tools for CI/CD Pipelines (2026 Review) | Braintrust
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://galtea.ai/blog/automated-llm-evaluation-building-a-ci-cd-quality-gate-that-actually-runs">
                      Automated LLM Evaluation: Building a CI/CD quality gate that actually runs | Galtea
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.promptfoo.dev/docs/integrations/ci-cd/">
                      CI/CD Integration for LLM Eval and Security | Promptfoo
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://latitude.so/blog/ultimate-ci-cd-llm-evaluation-guide">
                      Ultimate Guide to CI/CD for LLM Evaluation | Latitude
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://agenta.ai/blog/cicd-for-llm-prompts">
                      CI/CD for LLM Prompts: How to Build a Prompt Deployment Pipeline | Agenta
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.confident-ai.com/knowledge-base/compare/best-ci-cd-tools-ai-applications-2026">
                      Top 7 CI/CD Tools for AI Applications in 2026 | Confident AI
                    </Ext>
                  </li>
                </ul>
              </div>

              <h4>ドリフト・ハルシネーション・本番監視</h4>
              <div className={styles.refBlock}>
                <ul>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://openobserve.ai/blog/llm-monitoring-best-practices/">
                      LLM Monitoring Best Practices: Complete Guide for 2026 | OpenObserve
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://futureagi.com/blog/model-vs-data-drift-how-to-identify-and-handle-it/">
                      Model Drift vs Data Drift in 2026: Detection &amp; Mitigation Guide | Future AGI
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://valuestreamai.com/blog/ai-monitoring-in-production-guide-2026">
                      AI Monitoring in Production 2026: LLM Observability &amp; Drift Detection
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.getmaxim.ai/articles/how-to-detect-hallucinations-in-your-llm-applications/">
                      How to Detect Hallucinations in Your LLM Applications | Maxim AI
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://galileo.ai/blog/best-llm-output-drift-monitoring-platforms">
                      9 Best LLM Drift Monitoring Platforms in 2026 | Galileo
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.confident-ai.com/knowledge-base/compare/top-5-llm-monitoring-tools-for-ai">
                      Top 5 Tools for Monitoring LLM Applications in 2026 | Confident AI
                    </Ext>
                  </li>
                </ul>
              </div>

              <h4>観測/評価プラットフォーム比較</h4>
              <div className={styles.refBlock}>
                <ul>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://aiprosol.com/llm-observability">
                      The LLM Observability &amp; Eval Index (2026) | Aiprosol
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.firecrawl.dev/blog/best-llm-observability-tools">
                      Best LLM Observability Tools in 2026 | Firecrawl
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://guptadeepak.com/tools/top-5-llm-observability-platforms-2026/">
                      Top 5 LLM Observability Platforms 2026 | Deepak Gupta
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://medium.com/@kanerika/llmops-observability-langsmith-vs-arize-vs-langfuse-vs-w-b-f1baeabd1bbf">
                      LLMOps Observability: LangSmith vs Arize vs Langfuse vs W&amp;B | Kanerika
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://langfuse.com/faq/all/best-phoenix-arize-alternatives">
                      Arize AX Alternative? Langfuse vs. Arize AI and Arize Phoenix | Langfuse公式
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.confident-ai.com/knowledge-base/compare/10-llm-observability-tools-to-evaluate-and-monitor-ai-2026">
                      10 LLM Observability Tools to Evaluate &amp; Monitor AI in 2026 | Confident AI
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://laminar.sh/article/langfuse-alternatives-2026">
                      Langfuse Alternatives 2026: 7 Top Picks for Agent Observability | Laminar
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://laminar.sh/article/arize-phoenix-alternatives-2026">
                      Arize Phoenix Alternatives 2026: Top 7 for Agent Observability | Laminar
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://aimultiple.com/agentic-monitoring">
                      15 AI Agent Observability Tools in 2026 | AIMultiple
                    </Ext>
                  </li>
                  <li>
                    <i className="ti ti-external-link" />
                    <Ext href="https://www.confident-ai.com/knowledge-base/compare/best-ai-observability-tools-2026">
                      Best AI Observability Tools in 2026 | Confident AI
                    </Ext>
                  </li>
                </ul>
              </div>
            </div>

            <footer className={styles.pageFooter}>
              本ガイドは2026年7月時点の情報に基づいて作成されています。LLMエコシステムは変化が非常に速いため、ツールのバージョン・料金・仕様は必ず各公式サイトで最新情報を確認してください。
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}
