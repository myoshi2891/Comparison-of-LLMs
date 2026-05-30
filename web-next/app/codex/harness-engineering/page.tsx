import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

const DIAGRAM_0 = `flowchart LR
A["評価目標の定義\\nWhat to measure"]
B["Eval セット設計\\nHow to measure"]
C["ハーネス実装\\nInfrastructure"]
D["分析・改善\\nIterate"]
A --> B
B --> C
C --> D
D --> A`;

const DIAGRAM_1 = `mindmap
  root((LLM の\\nテスト課題))
    非決定性
      同じ入力でも毎回異なる出力
      温度パラメータの影響
      モデルアップデートによる挙動変化
    評価の難しさ
      正解が一意ではない
      文脈依存の正しさ
      人間の感性が必要なケース
    スケール問題
      手動評価のコスト爆発
      大量テストケース管理
      複数モデル間の比較
    回帰リスク
      プロンプト変更の副作用
      Fine-tuning前後の比較
      本番環境での品質劣化`;

const DIAGRAM_2 = `flowchart LR
subgraph IN["入力層"]
  DS["Dataset\\nJSONL 形式"]
  PT["Prompt\\nTemplate"]
end
subgraph HN["ハーネス層"]
  direction TB
  RN["Runner\\n実行エンジン"]
  SA["Sampler\\nモデル呼び出し"]
  EV["Evaluator\\n採点器"]
end
subgraph OUT["出力層"]
  RP["results.jsonl\\n生の結果"]
  DB["Platform\\nDashboard"]
  AL["Alert\\nSlack / GitHub"]
end
DS --> RN
PT --> RN
RN --> SA
SA --> EV
EV --> RP
RP --> DB
RP --> AL`;

const DIAGRAM_3 = `flowchart TD
S0["Step 0\\n環境構築"]
S1["Step 1\\nデータセット作成\\nsamples.jsonl"]
S2["Step 2\\nYAML 定義\\neval_name.yaml"]
S3["Step 3\\nEval 実行\\noaieval model eval"]
S4{"合格ライン\\n超えたか？"}
S5["ダッシュボード\\nアップロード"]
S6["改善\\nプロンプト調整\\nデータ追加"]
S0 --> S1
S1 --> S2
S2 --> S3
S3 --> S4
S4 -->|"Yes"| S5
S4 -->|"No"| S6
S6 --> S3`;

const DIAGRAM_4 = `flowchart TD
Q1{"出力は\\n一意に決まるか？"}
A1["String Match\\nMatch / Includes /\\nFuzzyMatch\\n最速・最安"]
Q2{"判断基準を\\n明文化できるか？"}
A2["Model Graded\\nClosedQA\\n/ Criteria\\nGPT-4o が採点"]
Q3{"コスト・時間を\\nかけられるか？"}
A3["Human\\nEval\\nゴールデンセット構築"]
A4["LLM-as-Judge\\nGPT-4o で代替"]
A5["Custom\\nPython\\n任意ロジック実装"]
Q4{"複雑なロジックが\\n必要か？"}
Q1 -->|"Yes\\n数値・コード・固定値"| A1
Q1 -->|"No\\n自由記述・翻訳"| Q2
Q2 -->|"Yes"| Q4
Q2 -->|"No"| Q3
Q3 -->|"Yes"| A3
Q3 -->|"No"| A4
Q4 -->|"Yes\\nコード実行・API検証"| A5
Q4 -->|"No"| A2`;

const DIAGRAM_5 = `sequenceDiagram
participant H as ハーネス
participant UT as 被評価モデル(gpt-4o-mini)
participant JD as 採点モデル(gpt-4o)
H->>UT: テスト入力を送信
UT-->>H: 回答を返す
H->>JD: この回答は正しいか？+ 採点基準
JD-->>H: スコア (Y / N / Unclear)
H->>H: results.jsonl に記録`;

const DIAGRAM_6 = `sequenceDiagram
participant Dev as 開発者
participant Codex as Codex Agent
participant Harness as Eval ハーネス
participant CI as GitHub Actions
participant Review as レビュアー
Dev->>Codex: タスクを指示
Codex->>Codex: AGENTS.md を読み込み
Codex->>Codex: コード・プロンプトを変更
Codex->>Harness: ミニセット Eval 自動実行
Harness-->>Codex: Score: 0.87 合格
Codex->>Dev: PR を提案
Dev->>CI: PR をマージ要求
CI->>Harness: フルセット Eval 実行
Harness-->>CI: accuracy: 0.88 合格
CI-->>Review: テスト結果レポート
Review->>Dev: LGTM / マージ`;

const DIAGRAM_7 = `flowchart LR
PR["PR 作成時\\nミニセット 30件\\ngpt-4o-mini\\n~$0.01"]
MG["main\\nマージ前\\nフルセット 500件\\ngpt-4o\\n~$0.50"]
NT["毎夜 cron\\nゴールデン\\n100件\\ngpt-4o\\n~$0.10"]
RL["リリース前\\n包括セット 全件\\ngpt-4o + human\\n~$5-50"]
PR --> MG
MG --> NT
NT --> RL`;

const DIAGRAM_8 = `flowchart TD
IN["エージェントへのタスク入力"]
E1["Step 1\\nEval\\n意図理解の正確さ\\naccuracy >= 0.90"]
E2["Step 2 Eval\\n計画の妥当性\\nmodel_graded\\n>= 0.85"]
E3["Step 3 Eval\\n最終出力の品質\\nhuman_graded >= 0.80"]
G1{"Step 1 合格？"}
G2{"Step 2 合格？"}
FAIL["早期失敗\\nコスト節約"]
PASS["全ステップ合格"]
IN --> E1
E1 --> G1
G1 -->|"Yes"| E2
E2 --> G2
G1 -->|"No"| FAIL
G2 -->|"Yes"| E3
G2 -->|"No"| FAIL
E3 --> PASS`;

const DIAGRAM_9 = `flowchart TD
START["Eval スコアが期待より低い"]
Q1{"データセット品質\\nの問題？"}
Q2{"プロンプトの問題？"}
Q3{"採点基準の問題？"}
Q4{"モデルの問題？"}
Q1 -->|"Yes"| A1
Q1 -->|"No"| Q2
Q2 -->|"Yes"| A2
Q2 -->|"No"| Q3
Q3 -->|"Yes"| A3
Q3 -->|"No"| Q4
Q4 --> A4
A1["サンプルを手動確認\\n曖昧な正解を修正\\nエッジケースを追加"]
A2["Few-shot\\nを追加\\nシステムプロンプトを修正\\nタスクを分解する"]
A3["採点プロンプトを見直し\\n別の\\nEvaluator を試す\\n人手評価でサンプル確認"]
A4["上位モデルを試す\\nFine-tuning\\nを検討\\nRAG を活用する"]`;

export default function HarnessEngineeringGuide() {
  return (
    <div className={styles.wrapper}>
      {/*  ═══ HERO ═══  */}
      <header className={styles.header}>
        <div className={styles.eyebrow}>OpenAI Harness Engineering · 2026 Edition</div>
        <h1 className={styles.h1}>
          <span className={`${styles.span} ${styles.t1}`}>ハーネスエンジニアリング</span>
          <span className={`${styles.span} ${styles.t2}`}>完全ガイド</span>
        </h1>
        <p className={`${styles.p} ${styles.heroSub}`}>
          AIエージェントの品質を自動・継続的に測定するための評価基盤を、
          <br />
          ゼロからステップバイステップで構築する実践的解説。
        </p>
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <div className={styles.statV}>11</div>
            <div className={styles.statL}>チャプター</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statV}>3</div>
            <div className={styles.statL}>Eval パターン</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statV}>10</div>
            <div className={styles.statL}>BP 原則</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statV}>13</div>
            <div className={styles.statL}>参考ソース</div>
          </div>
        </div>
        <div className={styles.scrollCue}>
          <span className={styles.span}>scroll</span>
          <div className={styles.scrollLine}></div>
        </div>
      </header>

      {/*  ═══ NAV ═══  */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navLogo}>HARNESS GUIDE</div>
          <a className={styles.a} href="#what">
            概要
          </a>
          <a className={styles.a} href="#why">
            背景
          </a>
          <a className={styles.a} href="#overview">
            全体像
          </a>
          <a className={styles.a} href="#setup">
            セットアップ
          </a>
          <a className={styles.a} href="#patterns">
            Eval パターン
          </a>
          <a className={styles.a} href="#bp">
            ベストプラクティス
          </a>
          <a className={styles.a} href="#agents">
            AGENTS.md 統合
          </a>
          <a className={styles.a} href="#cicd">
            CI/CD
          </a>
          <a className={styles.a} href="#advanced">
            上級テクニック
          </a>
          <a className={styles.a} href="#pitfalls">
            落とし穴
          </a>
          <a className={styles.a} href="#sources">
            参考文献
          </a>
        </div>
      </nav>

      {/*  ═══ MAIN ═══  */}
      <main className={styles.main}>
        {/*  ────────────────────────────────  */}
        {/*  SECTION 1 — WHAT IS  */}
        {/*  ────────────────────────────────  */}
        <section className={styles.section} id="what">
          <div className={styles.secLabel}>Chapter 01</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>1</div>
            <div>
              <h2 className={styles.secTitle}>ハーネスエンジニアリングとは何か？</h2>
              <div className={styles.secSub}>AI 評価基盤の概念・定義・位置づけ</div>
            </div>
          </div>

          <p className={`${styles.p} ${styles.body}`}>
            <strong className={styles.strong}>
              ハーネスエンジニアリング（Harness Engineering）
            </strong>
            とは、AIモデル・エージェントの品質を
            <strong className={styles.strong}>体系的・自動的に評価するためのテスト基盤</strong>
            を設計・構築する工学的手法です。 "ハーネス"
            とは「被試験体を取り囲み、制御・計測する仕組み全体」を指します。LLMの時代において、これは
            <strong className={styles.strong}>Eval（Evaluation）フレームワーク</strong>
            と呼ばれる評価パイプラインとして具体化されます。
          </p>

          <h3 className={`${styles.h3} ${styles.subH}`}>従来のテストとの根本的な違い</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.tr}>
                  <th className={styles.th}>比較軸</th>
                  <th className={styles.th}>従来のソフトウェアテスト</th>
                  <th className={styles.th}>AI ハーネスエンジニアリング</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                <tr className={styles.tr}>
                  <td className={styles.td}>出力の性質</td>
                  <td className={styles.td}>入力が同じなら出力は常に同じ</td>
                  <td className={styles.td}>確率的・非決定的（モデルごとに異なる）</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>判定方式</td>
                  <td className={styles.td}>Pass / Fail の二値</td>
                  <td className={styles.td}>スコア・グレードによる多段階評価</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>テスト手法</td>
                  <td className={styles.td}>ユニットテスト・統合テスト</td>
                  <td className={styles.td}>Eval セット・ベンチマーク・LLM-as-Judge</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>正解の定義</td>
                  <td className={styles.td}>明確・一意</td>
                  <td className={styles.td}>複数の正解あり・文脈依存</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>回帰テスト</td>
                  <td className={styles.td}>コード変更時に実行</td>
                  <td className={styles.td}>プロンプト変更・モデル更新時にも必要</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>実行環境</td>
                  <td className={styles.td}>ローカル・高速</td>
                  <td className={styles.td}>クラウド・API コスト・並列実行</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>
            OpenAI が定義するハーネスエンジニアリングの3層構造
          </h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ ハーネスエンジニアリング サイクル</div>
            <div id="diag-0" className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAM_0} />
            </div>
          </div>

          <div className={styles.cardGrid3}>
            <div className={`${styles.mc} ${styles.mcOai}`}>
              <div className={`${styles.mcTag} ${styles.oai}`}>🎯 Layer 1 — 評価目標</div>
              <p className={styles.p}>
                「何を評価するか」を定義する。精度・安全性・レイテンシ・コストなど、ビジネス目標と直結した指標を選ぶ。
              </p>
            </div>
            <div className={`${styles.mc} ${styles.mcBlue}`}>
              <div className={`${styles.mcTag} ${styles.blue}`}>🔬 Layer 2 — Eval セット</div>
              <p className={styles.p}>
                「どうやって評価するか」を設計する。テストケース・正解データ・採点基準の3点セットを用意する。
              </p>
            </div>
            <div className={`${styles.mc} ${styles.mcPurp}`}>
              <div className={`${styles.mcTag} ${styles.purple}`}>⚙️ Layer 3 — インフラ</div>
              <p className={styles.p}>
                「評価の仕組み」を実装する。自動実行・結果の記録・CI/CD
                統合・ダッシュボードで継続的に品質を見える化する。
              </p>
            </div>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 2 — WHY  */}
        {/*  ────────────────────────────────  */}
        <section className={styles.section} id="why">
          <div className={styles.secLabel}>Chapter 02</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>2</div>
            <div>
              <h2 className={styles.secTitle}>なぜ必要なのか？</h2>
              <div className={styles.secSub}>LLM 特有の課題とハーネスなし開発のリスク</div>
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>LLM アプリケーション固有の問題</h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ LLM テスト課題マップ</div>
            <div id="diag-1" className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAM_1} />
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>ハーネスなし開発のリスク一覧</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.tr}>
                  <th className={styles.th}>リスク</th>
                  <th className={styles.th}>発生確率</th>
                  <th className={styles.th}>影響度</th>
                  <th className={styles.th}>対策</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                <tr className={styles.tr}>
                  <td className={styles.td}>サイレント品質劣化（モデル更新時）</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tRose}`}>高</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tRose}`}>高</span>
                  </td>
                  <td className={styles.td}>自動 Eval CI/CD の構築</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>プロンプト変更による意図しない副作用</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tRose}`}>高</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                  <td className={styles.td}>回帰テストスイート</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>エッジケースの見落とし</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tRose}`}>高</span>
                  </td>
                  <td className={styles.td}>Eval セット多様化</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>本番環境でのユーザー体験劣化</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tRose}`}>高</span>
                  </td>
                  <td className={styles.td}>本番ログからの Eval 生成</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>コスト爆発（無効 API 呼び出し）</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                  <td className={styles.td}>キャッシュ + ミニセット戦略</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>Fine-tuning 効果の検証不能</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tBlue}`}>低</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tRose}`}>高</span>
                  </td>
                  <td className={styles.td}>ゴールデンセットの固定管理</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 3 — OVERVIEW  */}
        {/*  ────────────────────────────────  */}
        <section className={styles.section} id="overview">
          <div className={styles.secLabel}>Chapter 03</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>3</div>
            <div>
              <h2 className={styles.secTitle}>OpenAI Evals フレームワーク全体像</h2>
              <div className={styles.secSub}>
                コンポーネント構成と openai/evals ライブラリの役割
              </div>
            </div>
          </div>

          <p className={`${styles.p} ${styles.body}`}>
            <strong className={styles.strong}>OpenAI Evals</strong> は、LLM
            の品質を評価するためのオープンソースフレームワークです（
            <code className={styles.code}>github.com/openai/evals</code>）。 JSONL
            形式のデータセット・YAML 定義ファイル・Python Evaluator
            クラスの3要素で構成されています。
          </p>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ OpenAI Evals コンポーネント構成</div>
            <div id="diag-2" className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAM_2} />
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>Evaluator クラス一覧（組み込み）</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.tr}>
                  <th className={styles.th}>クラス</th>
                  <th className={styles.th}>判定方式</th>
                  <th className={styles.th}>適用場面</th>
                  <th className={styles.th}>コスト</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                <tr className={styles.tr}>
                  <td className={styles.td}>Match</td>
                  <td className={styles.td}>完全一致</td>
                  <td className={styles.td}>数値・固定値・コード出力</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tOai}`}>最低</span>
                  </td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>Includes</td>
                  <td className={styles.td}>部分一致</td>
                  <td className={styles.td}>特定キーワードの有無</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tOai}`}>最低</span>
                  </td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>FuzzyMatch</td>
                  <td className={styles.td}>近似一致</td>
                  <td className={styles.td}>大文字小文字・スペース無視</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tOai}`}>最低</span>
                  </td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>ClosedQA</td>
                  <td className={styles.td}>LLM 採点</td>
                  <td className={styles.td}>自由記述・Yes/No 判定</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>Criteria</td>
                  <td className={styles.td}>LLM ルーブリック</td>
                  <td className={styles.td}>品質・スタイル・完全性</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>Custom Python</td>
                  <td className={styles.td}>任意ロジック</td>
                  <td className={styles.td}>コード実行・API 検証・複合評価</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tBlue}`}>設計次第</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.ib} ${styles.iOai}`}>
            <span className={`${styles.span} ${styles.ibIcon}`}>💡</span>
            <div>
              <strong className={styles.strong}>OpenAI Evals はオープンソースです。</strong>
              <code className={styles.code}>github.com/openai/evals</code> でコードを確認でき、自作
              Evaluator クラスをプルリクエストで貢献することも可能です。 公式ドキュメント:
              <code className={styles.code}>
                github.com/openai/evals/blob/main/docs/build-eval.md
              </code>
            </div>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 4 — SETUP  */}
        {/*  ────────────────────────────────  */}
        <section className={styles.section} id="setup">
          <div className={styles.secLabel}>Chapter 04</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>4</div>
            <div>
              <h2 className={styles.secTitle}>5ステップでゼロから始める</h2>
              <div className={styles.secSub}>インストールから初回 Eval 実行まで</div>
            </div>
          </div>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ セットアップ → 実行 → 改善サイクル</div>
            <div id="diag-3" className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAM_3} />
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.stepFlow}>
            {/*  Step 0  */}
            <div className={styles.stepItem}>
              <div className={styles.stepLine}>
                <div className={styles.stepDot}>0</div>
                <div className={styles.stepConnector}></div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>環境構築 — openai/evals をインストールする</div>
                <div className={styles.stepDesc}>
                  GitHub からリポジトリをクローンし、仮想環境に依存パッケージをインストールします。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHdr}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdG}`}></div>
                    </div>
                    <div className={styles.codeLang}>bash</div>
                  </div>
                  <pre className={styles.pre}>
                    <span className={`${styles.span} ${styles.cm}`}># 1. リポジトリをクローン</span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.fn}`}>git</span> clone{" "}
                    https://github.com/openai/evals.git
                    {"\n"}
                    <span className={`${styles.span} ${styles.fn}`}>cd</span> evals
                    {"\n"}
                    <span className={`${styles.span} ${styles.cm}`}>
                      # 2. 仮想環境を作成（推奨）
                    </span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.fn}`}>python</span> -m venv .venv
                    {"\n"}
                    <span className={`${styles.span} ${styles.fn}`}>source</span> .venv/bin/activate{" "}
                    <span className={`${styles.span} ${styles.cm}`}>
                      # Windows: .venv\Scripts\activate
                    </span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.cm}`}>
                      # 3. 依存パッケージをインストール
                    </span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.fn}`}>pip</span> install -e{" "}
                    <span className={`${styles.span} ${styles.str}`}>".[dev]"</span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.cm}`}># 4. API キーを設定</span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.kw}`}>export</span>{" "}
                    <span className={`${styles.span} ${styles.op}`}>OPENAI_API_KEY</span>=
                    <span className={`${styles.span} ${styles.str}`}>"sk-..."</span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.cm}`}>
                      # 5. 動作確認（サンプル Eval を実行）
                    </span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.fn}`}>oaieval</span> gpt-4o test-match{" "}
                    --max_samples <span className={`${styles.span} ${styles.num}`}>10</span>
                  </pre>
                </div>
                <div className={`${styles.ib} ${styles.iBlue}`}>
                  <span className={`${styles.span} ${styles.ibIcon}`}>ℹ️</span>
                  <div>
                    <code className={styles.code}>pip install -e ".[dev]"</code> の
                    <code className={styles.code}>-e</code>
                    は「編集可能インストール」。ソースコードを変更しても再インストール不要になるため、カスタム
                    Evaluator 開発時に必須です。
                  </div>
                </div>
              </div>
            </div>

            {/*  Step 1  */}
            <div className={styles.stepItem}>
              <div className={styles.stepLine}>
                <div className={styles.stepDot}>1</div>
                <div className={styles.stepConnector}></div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  データセット作成 — JSONL 形式で 1行 = 1テストケース
                </div>
                <div className={styles.stepDesc}>
                  各行に <code className={styles.code}>input</code>（会話履歴）と
                  <code className={styles.code}>ideal</code>（期待する回答）を記述します。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHdr}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdG}`}></div>
                    </div>
                    <div className={styles.codeLang}>
                      jsonl — evals/registry/data/my_qa/samples.jsonl
                    </div>
                  </div>
                  <pre className={`${styles.pre} ${styles.wrapLines}`}>
                    <span className={`${styles.span} ${styles.str}`}>
                      &#123;"input": [&#123;"role": "user", "content":
                      "日本の首都はどこですか？"&#125;], "ideal": "東京"&#125;
                    </span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.str}`}>
                      &#123;"input": [&#123;"role": "user", "content":
                      "富士山の標高を教えてください"&#125;], "ideal": ["3776メートル", "3,776m",
                      "3776m"]&#125;
                    </span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.str}`}>
                      &#123;"input": [&#123;"role": "system", "content":
                      "あなたはSQLの専門家です"&#125;, &#123;"role": "user", "content":
                      "ユーザー一覧を取得するSQLを書いてください"&#125;], "ideal": "SELECT * FROM
                      users"&#125;
                    </span>
                  </pre>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead className={styles.thead}>
                      <tr className={styles.tr}>
                        <th className={styles.th}>フィールド</th>
                        <th className={styles.th}>型</th>
                        <th className={styles.th}>説明</th>
                        <th className={styles.th}>注意点</th>
                      </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                      <tr className={styles.tr}>
                        <td className={styles.td}>input</td>
                        <td className={styles.td}>Array</td>
                        <td className={styles.td}>role/content 形式の会話履歴</td>
                        <td className={styles.td}>system プロンプトも含められる</td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={styles.td}>ideal</td>
                        <td className={styles.td}>String / Array</td>
                        <td className={styles.td}>期待する回答（正解）</td>
                        <td className={styles.td}>配列で複数の正解を指定可能</td>
                      </tr>
                      <tr className={styles.tr}>
                        <td className={styles.td}>metadata</td>
                        <td className={styles.td}>Object（任意）</td>
                        <td className={styles.td}>カテゴリ・難易度などのタグ</td>
                        <td className={styles.td}>分析時のフィルタリングに活用</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/*  Step 2  */}
            <div className={styles.stepItem}>
              <div className={styles.stepLine}>
                <div className={styles.stepDot}>2</div>
                <div className={styles.stepConnector}></div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  YAML 定義 — Evaluator クラスとデータセットを紐付ける
                </div>
                <div className={styles.stepDesc}>
                  <code className={styles.code}>evals/registry/evals/</code> 配下に YAML
                  ファイルを作成します。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHdr}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdG}`}></div>
                    </div>
                    <div className={styles.codeLang}>yaml — evals/registry/evals/my_qa.yaml</div>
                  </div>
                  <pre className={styles.pre}>
                    <span className={`${styles.span} ${styles.cm}`}>
                      # Eval グループ定義（最上位）
                    </span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.op}`}>my_qa</span>
                    <span className={`${styles.span} ${styles.kw}`}>:</span>
                    {"\n"}
                    {"  "}
                    <span className={`${styles.span} ${styles.fn}`}>id</span>
                    <span className={`${styles.span} ${styles.kw}`}>:</span> my_qa.v1
                    {"\n"}
                    {"  "}
                    <span className={`${styles.span} ${styles.fn}`}>metrics</span>
                    <span className={`${styles.span} ${styles.kw}`}>:</span> [accuracy]
                    {"\n\n"}
                    <span className={`${styles.span} ${styles.cm}`}># Eval バージョン定義</span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.op}`}>my_qa.v1</span>
                    <span className={`${styles.span} ${styles.kw}`}>:</span>
                    {"\n"}
                    {"  "}
                    <span className={`${styles.span} ${styles.fn}`}>class</span>
                    <span className={`${styles.span} ${styles.kw}`}>:</span>{" "}
                    <span className={`${styles.span} ${styles.str}`}>
                      evals.elsuite.basic.match:Match
                    </span>
                    {"\n"}
                    {"  "}
                    <span className={`${styles.span} ${styles.fn}`}>args</span>
                    <span className={`${styles.span} ${styles.kw}`}>:</span>
                    {"\n"}
                    {"    "}
                    <span className={`${styles.span} ${styles.fn}`}>samples_jsonl</span>
                    <span className={`${styles.span} ${styles.kw}`}>:</span> my_qa/samples.jsonl
                  </pre>
                </div>
              </div>
            </div>

            {/*  Step 3  */}
            <div className={styles.stepItem}>
              <div className={styles.stepLine}>
                <div className={styles.stepDot}>3</div>
                <div className={styles.stepConnector}></div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Eval 実行 — oaieval CLI で評価を走らせる</div>
                <div className={styles.stepDesc}>
                  モデル名と Eval 名を指定するだけで評価が実行されます。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHdr}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdG}`}></div>
                    </div>
                    <div className={styles.codeLang}>bash</div>
                  </div>
                  <pre className={styles.pre}>
                    <span className={`${styles.span} ${styles.cm}`}># 基本実行</span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.fn}`}>oaieval</span> gpt-4o my_qa
                    {"\n\n"}
                    <span className={`${styles.span} ${styles.cm}`}>
                      # コスト節約: サンプル数を制限してテスト
                    </span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.fn}`}>oaieval</span> gpt-4o my_qa{" "}
                    --max_samples <span className={`${styles.span} ${styles.num}`}>20</span>
                    {"\n\n"}
                    <span className={`${styles.span} ${styles.cm}`}>
                      # モデル比較: 結果ファイルを分けて保存
                    </span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.fn}`}>oaieval</span> gpt-4o-mini my_qa{" "}
                    --record_path results/mini.jsonl
                    {"\n"}
                    <span className={`${styles.span} ${styles.fn}`}>oaieval</span> gpt-4o my_qa{" "}
                    --record_path results/4o.jsonl
                    {"\n\n"}
                    <span className={`${styles.span} ${styles.cm}`}>
                      # 並列実行でスピードアップ（コスト注意）
                    </span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.fn}`}>oaieval</span> gpt-4o my_qa{" "}
                    --num_threads <span className={`${styles.span} ${styles.num}`}>10</span>
                    {"\n\n"}
                    <span className={`${styles.span} ${styles.cm}`}>
                      # 結果を OpenAI Platform にアップロード
                    </span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.fn}`}>oaieval</span> gpt-4o my_qa{" "}
                    --upload
                  </pre>
                </div>
              </div>
            </div>

            {/*  Step 4  */}
            <div className={styles.stepItem}>
              <div className={styles.stepLine}>
                <div className={styles.stepDot}>4</div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>結果の確認 — results.jsonl を分析する</div>
                <div className={styles.stepDesc}>
                  各サンプルの採点結果が JSONL
                  形式で保存されます。集計スクリプトで合否を判定します。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHdr}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdG}`}></div>
                    </div>
                    <div className={styles.codeLang}>jsonl — results.jsonl（出力サンプル）</div>
                  </div>
                  <pre className={`${styles.pre} ${styles.wrapLines}`}>
                    <span className={`${styles.span} ${styles.str}`}>
                      &#123;"run_id": "abc123", "event_id": 0, "type": "match", "data":
                      &#123;"correct": true, "expected": "東京", "sampled": "東京"&#125;&#125;
                    </span>
                    {"\n"}
                    <span className={`${styles.span} ${styles.str}`}>
                      &#123;"run_id": "abc123", "event_id": 1, "type": "match", "data":
                      &#123;"correct": false, "expected": "3776メートル", "sampled":
                      "約3776m"&#125;&#125;
                    </span>
                  </pre>
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHdr}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdG}`}></div>
                    </div>
                    <div className={styles.codeLang}>python — 合否判定スクリプト</div>
                  </div>
                  <pre className={styles.pre}>
                    <span className={`${styles.span} ${styles.kw}`}>import</span> json, sys
                    {"\n"}
                    <span className={`${styles.span} ${styles.kw}`}>def</span>{" "}
                    <span className={`${styles.span} ${styles.fn}`}>check_threshold</span>
                    (results_path: <span className={`${styles.span} ${styles.fn}`}>str</span>,
                    threshold: <span className={`${styles.span} ${styles.fn}`}>float</span> ={" "}
                    <span className={`${styles.span} ${styles.num}`}>0.85</span>):
                    {"\n"}
                    {"    "}correct = total ={" "}
                    <span className={`${styles.span} ${styles.num}`}>0</span>
                    {"\n"}
                    {"    "}
                    <span className={`${styles.span} ${styles.kw}`}>with</span>{" "}
                    <span className={`${styles.span} ${styles.fn}`}>open</span>
                    (results_path) <span className={`${styles.span} ${styles.kw}`}>as</span> f:
                    {"\n"}
                    {"        "}
                    <span className={`${styles.span} ${styles.kw}`}>for</span> line{" "}
                    <span className={`${styles.span} ${styles.kw}`}>in</span> f:
                    {"\n"}
                    {"            "}ev = json.
                    <span className={`${styles.span} ${styles.fn}`}>loads</span>(line)
                    {"\n"}
                    {"            "}
                    <span className={`${styles.span} ${styles.kw}`}>if</span> ev.get(
                    <span className={`${styles.span} ${styles.str}`}>"type"</span>) =={" "}
                    <span className={`${styles.span} ${styles.str}`}>"match"</span>:{"\n"}
                    {"                "}total +={" "}
                    <span className={`${styles.span} ${styles.num}`}>1</span>
                    {"\n"}
                    {"                "}
                    <span className={`${styles.span} ${styles.kw}`}>if</span> ev[
                    <span className={`${styles.span} ${styles.str}`}>"data"</span>][
                    <span className={`${styles.span} ${styles.str}`}>"correct"</span>]:
                    {"\n"}
                    {"                    "}correct +={" "}
                    <span className={`${styles.span} ${styles.num}`}>1</span>
                    {"\n"}
                    {"    "}accuracy = correct / total{" "}
                    <span className={`${styles.span} ${styles.kw}`}>if</span> total{" "}
                    <span className={`${styles.span} ${styles.kw}`}>else</span>{" "}
                    <span className={`${styles.span} ${styles.num}`}>0</span>
                    {"\n"}
                    {"    "}
                    <span className={`${styles.span} ${styles.fn}`}>print</span>(
                    <span className={`${styles.span} ${styles.str}`}>
                      f"Accuracy: &#123;accuracy:.2%&#125; (&#123;correct&#125;/&#123;total&#125;)"
                    </span>
                    ){"\n"}
                    {"    "}sys.<span className={`${styles.span} ${styles.fn}`}>exit</span>(
                    <span className={`${styles.span} ${styles.num}`}>0</span>{" "}
                    <span className={`${styles.span} ${styles.kw}`}>if</span> accuracy &gt;=
                    threshold <span className={`${styles.span} ${styles.kw}`}>else</span>{" "}
                    <span className={`${styles.span} ${styles.num}`}>1</span>){"\n\n"}
                    <span className={`${styles.span} ${styles.fn}`}>check_threshold</span>(
                    <span className={`${styles.span} ${styles.str}`}>"results/4o.jsonl"</span>,
                    threshold=
                    <span className={`${styles.span} ${styles.num}`}>0.85</span>)
                  </pre>
                </div>
              </div>
            </div>
          </div>
          {/*  /step-flow  */}
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 5 — PATTERNS  */}
        {/*  ────────────────────────────────  */}
        <section className={styles.section} id="patterns">
          <div className={styles.secLabel}>Chapter 05</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>5</div>
            <div>
              <h2 className={styles.secTitle}>Eval の3大パターン</h2>
              <div className={styles.secSub}>
                String Match · Model Graded · Custom Python — 使い分けの判断木
              </div>
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>パターン選択フロー</h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ Eval パターン選択の判断木</div>
            <div id="diag-4" className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAM_4} />
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>パターン比較表</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.tr}>
                  <th className={styles.th}>パターン</th>
                  <th className={styles.th}>精度</th>
                  <th className={styles.th}>コスト</th>
                  <th className={styles.th}>速度</th>
                  <th className={styles.th}>適用場面</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                <tr className={styles.tr}>
                  <td className={styles.td}>String Match</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tAmb}`}>
                      △ 固定正解のみ
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tOai}`}>◎ 最低</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tOai}`}>◎ 最速</span>
                  </td>
                  <td className={styles.td}>固定値・数値・コード出力・True/False</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>Model Graded</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tOai}`}>◎ 高精度</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tAmb}`}>△ 高め</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tAmb}`}>△ 低め</span>
                  </td>
                  <td className={styles.td}>自由記述・要約・翻訳・説明品質</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>Human Eval</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tOai}`}>◎◎ 最高</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tRose}`}>✗ 最高</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tRose}`}>✗ 最遅</span>
                  </td>
                  <td className={styles.td}>ゴールデンデータセット構築・最終検証</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>Custom Python</td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tBlue}`}>設計次第</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tBlue}`}>設計次第</span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.span} ${styles.tag} ${styles.tBlue}`}>設計次第</span>
                  </td>
                  <td className={styles.td}>コード実行・API 検証・複合評価</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.patternGrid}>
            <div className={`${styles.patCard} ${styles.pcOai}`}>
              <div className={styles.patNum}>01</div>
              <div className={styles.patIcon}>🎯</div>
              <div className={styles.patName}>String Match</div>
              <p className={`${styles.p} ${styles.patDesc}`}>
                最もシンプル。出力が固定値に一致するかを検証。
                <strong className={styles.strong}>Match</strong>（完全）・
                <strong className={styles.strong}>Includes</strong>（部分）・
                <strong className={styles.strong}>FuzzyMatch</strong>
                （近似）の3種類がある。
              </p>
              <span className={`${styles.span} ${styles.patBadge} ${styles.tOai}`}>最安・最速</span>
            </div>
            <div className={`${styles.patCard} ${styles.pcBlue}`}>
              <div className={styles.patNum}>02</div>
              <div className={styles.patIcon}>🤖</div>
              <div className={styles.patName}>Model Graded</div>
              <p className={`${styles.p} ${styles.patDesc}`}>
                別の LLM（通常
                GPT-4o）が採点者として評価。自由記述など正解が一意でない場合に有効。採点プロンプトの設計が品質を左右する。
              </p>
              <span className={`${styles.span} ${styles.patBadge} ${styles.tBlue}`}>
                LLM-as-Judge
              </span>
            </div>
            <div className={`${styles.patCard} ${styles.pcPurp}`}>
              <div className={styles.patNum}>03</div>
              <div className={styles.patIcon}>🔧</div>
              <div className={styles.patName}>Custom Python</div>
              <p className={`${styles.p} ${styles.patDesc}`}>
                完全にカスタマイズした評価ロジックを Python で実装。コードの実行確認・外部 API
                の検証・複数条件の組み合わせなど複雑なケースに対応。
              </p>
              <span className={`${styles.span} ${styles.patBadge} ${styles.tPurp}`}>最も柔軟</span>
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>
            パターン 2 — Model Graded の仕組み（シーケンス図）
          </h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ LLM-as-Judge シーケンス</div>
            <div id="diag-5" className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAM_5} />
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>
            パターン 2 — LLM-as-Judge 採点プロンプトテンプレート
          </h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>
                python — 採点プロンプト（OpenAI 推奨フォーマット）
              </div>
            </div>
            <pre className={styles.pre}>
              <span className={`${styles.span} ${styles.op}`}>GRADER_PROMPT</span> ={" "}
              <span className={`${styles.span} ${styles.str}`}>
                """
                {"\n"}
                あなたは厳格かつ公平な評価者です。以下の基準で回答を評価してください。
                {"\n\n"}
                ## 評価対象
                {"\n"}
                **質問**: &#123;question&#125;
                {"\n"}
                **回答**: &#123;answer&#125;
                {"\n\n"}
                ## 評価基準
                {"\n"}
                &#123;criteria&#125;
                {"\n\n"}
                ## 採点ルール
                {"\n"}- `Y` : 基準を完全に満たしている
                {"\n"}- `N` : 基準を満たしていない
                {"\n"}- `Unclear` : 判断が難しい場合（乱用禁止）
                {"\n\n"}
                ## 重要な指示
                {"\n"}
                1. 自分の知識ではなく「提示された情報のみ」で評価すること
                {"\n"}
                2. 部分的に正しくても基準を完全に満たさなければ N{"\n"}
                3. 採点理由を 1 文で説明すること
                {"\n\n"}
                ## 出力（JSON のみ）
                {"\n"}
                &#123;&#123;"grade": "Y/N/Unclear", "reason": "採点理由"&#125;&#125;
                {"\n"}
                """
              </span>
            </pre>
          </div>

          <div className={`${styles.ib} ${styles.iRose}`}>
            <span className={`${styles.span} ${styles.ibIcon}`}>🔑</span>
            <div>
              <strong className={styles.strong}>採点モデルは被評価モデルと分けること。</strong>
              GPT-4o-mini を評価する場合は
              GPT-4o（上位モデル）を採点者にする。採点者が自分と同じ出力を高く評価する「採点者バイアス」を防ぐためです。
            </div>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 6 — BEST PRACTICES  */}
        {/*  ────────────────────────────────  */}
        <section className={styles.section} id="bp">
          <div className={styles.secLabel}>Chapter 06</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>6</div>
            <div>
              <h2 className={styles.secTitle}>ハーネス設計のベストプラクティス</h2>
              <div className={styles.secSub}>データセット品質 10 原則 + 推奨ディレクトリ構成</div>
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>データセット品質の 10 原則</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.tr}>
                  <th className={styles.th}>#</th>
                  <th className={styles.th}>原則</th>
                  <th className={styles.th}>悪い例 ❌</th>
                  <th className={styles.th}>良い例 ✅</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                <tr className={styles.tr}>
                  <td className={styles.td}>1</td>
                  <td className={styles.td}>多様性</td>
                  <td className={styles.td}>同パターンの問題のみ</td>
                  <td className={styles.td}>エッジケース・境界値を含む</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>2</td>
                  <td className={styles.td}>代表性</td>
                  <td className={styles.td}>開発者が作った問題のみ</td>
                  <td className={styles.td}>実際のユーザーログから抽出</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>3</td>
                  <td className={styles.td}>難易度分散</td>
                  <td className={styles.td}>簡単な問題だけ</td>
                  <td className={styles.td}>Easy / Medium / Hard を均等に</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>4</td>
                  <td className={styles.td}>正解の明確化</td>
                  <td className={styles.td}>「良い回答」</td>
                  <td className={styles.td}>「100文字以内で箇条書き3点」</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>5</td>
                  <td className={styles.td}>カテゴリバランス</td>
                  <td className={styles.td}>特定カテゴリに偏る</td>
                  <td className={styles.td}>カテゴリ比率を意図的に設計</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>6</td>
                  <td className={styles.td}>汚染防止</td>
                  <td className={styles.td}>訓練データと重複</td>
                  <td className={styles.td}>独立したホールドアウトセット</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>7</td>
                  <td className={styles.td}>バージョン管理</td>
                  <td className={styles.td}>上書き保存</td>
                  <td className={styles.td}>v1, v2 ... と分けて git 管理</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>8</td>
                  <td className={styles.td}>サイズ適正化</td>
                  <td className={styles.td}>1000件を毎回全実行</td>
                  <td className={styles.td}>ミニ 20件 + フル 500件 で使い分け</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>9</td>
                  <td className={styles.td}>ゴールデンセット</td>
                  <td className={styles.td}>随時更新</td>
                  <td className={styles.td}>固定した参照セットを保持</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>10</td>
                  <td className={styles.td}>メタデータ付与</td>
                  <td className={styles.td}>JSONL のみ</td>
                  <td className={styles.td}>カテゴリ・難易度タグを追加</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>推奨ディレクトリ構成</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>tree — プロジェクト構成（推奨）</div>
            </div>
            <pre className={styles.pre}>
              <span className={`${styles.span} ${styles.hl}`}>my-ai-project/</span>
              {"\n"}
              ├── <span className={`${styles.span} ${styles.op}`}>evals/</span> {"  "}
              <span className={`${styles.span} ${styles.cm}`}>← Eval ルートディレクトリ</span>
              {"\n"}│ ├── registry/
              {"\n"}│ │ ├── data/
              {"\n"}│ │ │ ├── <span className={`${styles.span} ${styles.fn}`}>qa_basic/</span>{" "}
              {"  "}
              <span className={`${styles.span} ${styles.cm}`}>← カテゴリ別に分割</span>
              {"\n"}│ │ │ │ ├── train.jsonl {"  "}
              <span className={`${styles.span} ${styles.cm}`}>← 開発用（少量・変更可）</span>
              {"\n"}│ │ │ │ └── test.jsonl {"  "}
              <span className={`${styles.span} ${styles.cm}`}>← 本番評価用（固定・変更禁止）</span>
              {"\n"}│ │ │ ├── <span className={`${styles.span} ${styles.fn}`}>code_gen/</span>
              {"\n"}│ │ │ │ └── samples.jsonl
              {"\n"}│ │ │ └── <span className={`${styles.span} ${styles.rose}`}>safety/</span>{" "}
              {"  "}
              <span className={`${styles.span} ${styles.cm}`}>← セーフティ Eval は必ず独立</span>
              {"\n"}│ │ │ └── samples.jsonl
              {"\n"}│ │ └── evals/
              {"\n"}│ │ ├── qa_basic.yaml
              {"\n"}│ │ ├── code_gen.yaml
              {"\n"}│ │ └── safety.yaml
              {"\n"}│ └── elsuite/custom/
              {"\n"}│ └── my_custom_eval.py {"  "}
              <span className={`${styles.span} ${styles.cm}`}>← カスタム Evaluator</span>
              {"\n"}
              ├── scripts/
              {"\n"}│ ├── run_evals.sh {"  "}
              <span className={`${styles.span} ${styles.cm}`}>← 実行スクリプト</span>
              {"\n"}│ └── compare_models.py {"  "}
              <span className={`${styles.span} ${styles.cm}`}>← モデル比較スクリプト</span>
              {"\n"}
              ├── results/{" "}
              <span className={`${styles.span} ${styles.rose}`}>← .gitignore 推奨</span>
              {"\n"}
              ├── <span className={`${styles.span} ${styles.op}`}>AGENTS.md</span>{" "}
              <span className={`${styles.span} ${styles.cm}`}>← Codex 向け永続設定</span>
              {"\n"}
              └── <span className={`${styles.span} ${styles.op}`}>TEST.md</span>{" "}
              <span className={`${styles.span} ${styles.cm}`}>← 受け入れ基準チェックリスト</span>
            </pre>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>ベストプラクティス10則</h3>

          <div className={styles.bpGrid}>
            <div className={`${styles.bpCard} ${styles.bpOai}`}>
              <div className={styles.bpN}>01</div>
              <h4>テストコマンドを AGENTS.md に明示する</h4>
              <p className={styles.p}>
                AGENTS.md はテストを自動実行しない。「ファイル変更後は必ず oaieval
                を実行すること」と明記することで Codex が自動的に Eval を走らせる。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpBlue}`}>
              <div className={styles.bpN}>02</div>
              <h4>ゴールデンセットを絶対に更新しない</h4>
              <p className={styles.p}>
                ゴールデンセットは参照基準。更新する場合は新バージョン (v2)
                として作成し、旧バージョンは残す。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpPurp}`}>
              <div className={styles.bpN}>03</div>
              <h4>temperature=0 + seed を固定する</h4>
              <p className={styles.p}>
                Eval 実行時は決定的出力のため temperature=0 と seed
                を固定。再現性のある結果が得られる。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpAmb}`}>
              <div className={styles.bpN}>04</div>
              <h4>採点モデルは上位モデルを使う</h4>
              <p className={styles.p}>
                被評価モデルより高性能なモデルを採点者に。採点者バイアスを最小化できる。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpRose}`}>
              <div className={styles.bpN}>05</div>
              <h4>セーフティ Eval は violation_rate=0</h4>
              <p className={styles.p}>
                安全性に関する Eval だけは合格基準をゼロトレランス（違反率 0%）に設定する。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpCyan}`}>
              <div className={styles.bpN}>06</div>
              <h4>ミニセット戦略でコスト管理</h4>
              <p className={styles.p}>
                PR 時は 20〜30件のミニセットで高速チェック。フルセットは main ブランチの PR
                前のみ実行。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpOai}`}>
              <div className={styles.bpN}>07</div>
              <h4>本番ログからサンプルを自動生成</h4>
              <p className={styles.p}>
                高評価ユーザー回答を Eval データセットに取り込む自動パイプラインを構築する。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpBlue}`}>
              <div className={styles.bpN}>08</div>
              <h4>難易度別に合格基準を分ける</h4>
              <p className={styles.p}>
                Easy ≥ 0.95、Medium ≥ 0.85、Hard ≥ 0.70 のように難易度別に閾値を設定する。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpPurp}`}>
              <div className={styles.bpN}>09</div>
              <h4>Eval セットを公開しない</h4>
              <p className={styles.p}>
                テストデータを公開するとプロンプトが最適化され、本当の性能が見えなくなる過学習を招く。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpAmb}`}>
              <div className={styles.bpN}>10</div>
              <h4>複数の指標を組み合わせる</h4>
              <p className={styles.p}>
                accuracy 一つだけ高くても意味がない。ROUGE、レイテンシ、コスト、人手評価を併用する。
              </p>
            </div>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 7 — AGENTS / TEST.md  */}
        {/*  ────────────────────────────────  */}
        <section className={styles.section} id="agents">
          <div className={styles.secLabel}>Chapter 07</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>7</div>
            <div>
              <h2 className={styles.secTitle}>AGENTS.md / TEST.md とハーネスの統合</h2>
              <div className={styles.secSub}>
                Codex エージェントが自律的に Eval を実行する仕組み
              </div>
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>AGENTS.md — Eval コマンドを永続記録する</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>markdown — AGENTS.md（Eval セクションの記載例）</div>
            </div>
            <pre className={styles.pre}>
              <span className={`${styles.span} ${styles.hl}`}>## Build & Test Commands</span>
              {"\n"}
              <span className={`${styles.span} ${styles.op}`}>### AI Eval（ハーネス）</span>
              {"\n"}
              <span className={`${styles.span} ${styles.cm}`}>
                # ★ ファイルを変更したら必ず以下を実行すること
              </span>
              {"\n"}- ミニセット（開発中）: `oaieval gpt-4o-mini qa_basic --max_samples 20`
              {"\n"}- フルセット（PR前必須）: `oaieval gpt-4o qa_basic`
              {"\n"}- モデル比較: `python scripts/compare_models.py --models gpt-4o,gpt-4o-mini`
              {"\n"}- 合格基準: accuracy &gt;= 0.85
              {"\n\n"}
              <span className={`${styles.span} ${styles.op}`}>### 注意事項</span>
              {"\n"}- Eval 実行には OPENAI_API_KEY 環境変数が必要
              {"\n"}- フルセットはコストが発生するため main ブランチ PR 時のみ実行
              {"\n"}- results/ ディレクトリは .gitignore 済み
            </pre>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>TEST.md — 受け入れ基準を定義する</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>markdown — TEST.md（Eval 品質基準）</div>
            </div>
            <pre className={styles.pre}>
              <span className={`${styles.span} ${styles.hl}`}>
                # TEST.md — AI 品質基準チェックリスト
              </span>
              {"\n\n"}
              <span className={`${styles.span} ${styles.op}`}>## Eval 基準</span>
              {"\n"}- [ ] [Eval] `qa_basic` eval の accuracy &gt;= 0.85
              {"\n"}- [ ] [Eval] `code_gen` eval の pass_rate &gt;= 0.80
              {"\n"}- [ ] [Eval] `safety` eval の violation_rate == 0.0（ゼロトレランス）
              {"\n"}- [ ] [Eval] 新機能追加時は対応する eval サンプルを最低 10件追加
              {"\n\n"}
              <span className={`${styles.span} ${styles.op}`}>## 回帰テスト</span>
              {"\n"}- [ ] [CI] 前バージョン比で accuracy が 2% 以上低下していない
              {"\n"}- [ ] [CI] レスポンスタイム p99 &lt; 3000ms
            </pre>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>
            Eval と開発フローの統合（全体シーケンス）
          </h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>
              ▸ Codex エージェント × Eval ハーネス 統合フロー
            </div>
            <div id="diag-6" className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAM_6} />
            </div>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 8 — CI/CD  */}
        {/*  ────────────────────────────────  */}
        <section className={styles.section} id="cicd">
          <div className={styles.secLabel}>Chapter 08</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>8</div>
            <div>
              <h2 className={styles.secTitle}>CI/CD パイプラインへの組み込み</h2>
              <div className={styles.secSub}>GitHub Actions × Eval の自動化とコスト管理戦略</div>
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>コスト管理：段階的 Eval 実行戦略</h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ 実行タイミング別コスト管理戦略</div>
            <div id="diag-7" className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAM_7} />
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.tr}>
                  <th className={styles.th}>タイミング</th>
                  <th className={styles.th}>サンプル数</th>
                  <th className={styles.th}>モデル</th>
                  <th className={styles.th}>目安コスト</th>
                  <th className={styles.th}>合格基準</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                <tr className={styles.tr}>
                  <td className={styles.td}>PR 作成時</td>
                  <td className={styles.td}>20〜30件</td>
                  <td className={styles.td}>gpt-4o-mini</td>
                  <td className={styles.td}>~$0.01</td>
                  <td className={styles.td}>≥ 0.80</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>main ブランチ PR</td>
                  <td className={styles.td}>200〜500件</td>
                  <td className={styles.td}>gpt-4o</td>
                  <td className={styles.td}>~$0.30〜$0.80</td>
                  <td className={styles.td}>≥ 0.85</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>毎日 cron</td>
                  <td className={styles.td}>100件固定</td>
                  <td className={styles.td}>gpt-4o</td>
                  <td className={styles.td}>~$0.10</td>
                  <td className={styles.td}>前日比 -2%以内</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>リリース前</td>
                  <td className={styles.td}>全件</td>
                  <td className={styles.td}>gpt-4o + human</td>
                  <td className={styles.td}>$5〜$50</td>
                  <td className={styles.td}>≥ 0.90</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>GitHub Actions ワークフロー実装例</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>yaml — .github/workflows/eval.yml</div>
            </div>
            <pre className={styles.pre}>
              <span className={`${styles.span} ${styles.op}`}>name:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>AI Eval Pipeline</span>
              {"\n\n"}
              <span className={`${styles.span} ${styles.op}`}>on:</span>
              {"\n"}
              {"  "}
              <span className={`${styles.span} ${styles.fn}`}>pull_request:</span>
              {"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.fn}`}>branches:</span> [main]
              {"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.fn}`}>paths:</span>
              {"\n"}
              {"      "}- <span className={`${styles.span} ${styles.str}`}>'prompts/**'</span>{" "}
              <span className={`${styles.span} ${styles.cm}`}># プロンプト変更時</span>
              {"\n"}
              {"      "}- <span className={`${styles.span} ${styles.str}`}>'evals/**'</span>{" "}
              <span className={`${styles.span} ${styles.cm}`}># Eval 定義変更時</span>
              {"\n"}
              {"      "}- <span className={`${styles.span} ${styles.str}`}>'src/ai/**'</span>{" "}
              <span className={`${styles.span} ${styles.cm}`}># AI ロジック変更時</span>
              {"\n\n"}
              <span className={`${styles.span} ${styles.op}`}>jobs:</span>
              {"\n"}
              {"  "}
              <span className={`${styles.span} ${styles.fn}`}>mini_eval:</span>
              {"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.fn}`}>name:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>
                ミニセット Eval（高速チェック）
              </span>
              {"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.fn}`}>runs-on:</span> ubuntu-latest
              {"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.fn}`}>steps:</span>
              {"\n"}
              {"      "}- <span className={`${styles.span} ${styles.kw}`}>uses:</span>{" "}
              actions/checkout@v4
              {"\n"}
              {"      "}- <span className={`${styles.span} ${styles.kw}`}>name:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>Python セットアップ</span>
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.kw}`}>uses:</span> actions/setup-python@v5
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.kw}`}>with:</span>
              {"\n"}
              {"          "}
              <span className={`${styles.span} ${styles.fn}`}>python-version:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>'3.11'</span>
              {"\n"}
              {"      "}- <span className={`${styles.span} ${styles.kw}`}>name:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>依存関係インストール</span>
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.kw}`}>run:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>pip install -e "evals/[dev]"</span>
              {"\n"}
              {"      "}- <span className={`${styles.span} ${styles.kw}`}>name:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>ミニセット Eval 実行</span>
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.fn}`}>env:</span>
              {"\n"}
              {"          "}
              <span className={`${styles.span} ${styles.fn}`}>OPENAI_API_KEY:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>
                $&#123;&#123; secrets.OPENAI_API_KEY &#125;&#125;
              </span>
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.fn}`}>run:</span> |{"\n"}
              {"          "}oaieval gpt-4o-mini qa_basic \{"\n"}
              {"            "}--max_samples{" "}
              <span className={`${styles.span} ${styles.num}`}>30</span> \{"\n"}
              {"            "}--record_path results/mini_eval.jsonl
              {"\n"}
              {"      "}- <span className={`${styles.span} ${styles.kw}`}>name:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>合格判定（0.80 以上）</span>
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.fn}`}>run:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>
                python scripts/check_threshold.py --results results/mini_eval.jsonl --threshold 0.80
              </span>
              {"\n\n"}
              {"  "}
              <span className={`${styles.span} ${styles.fn}`}>full_eval:</span>
              {"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.fn}`}>name:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>フルセット Eval（マージ前）</span>
              {"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.fn}`}>runs-on:</span> ubuntu-latest
              {"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.hl}`}>needs:</span> mini_eval{" "}
              <span className={`${styles.span} ${styles.cm}`}># ミニセット合格後のみ実行</span>
              {"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.fn}`}>steps:</span>
              {"\n"}
              {"      "}- <span className={`${styles.span} ${styles.kw}`}>uses:</span>{" "}
              actions/checkout@v4
              {"\n"}
              {"      "}- <span className={`${styles.span} ${styles.kw}`}>name:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>フルセット Eval 実行</span>
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.fn}`}>env:</span>
              {"\n"}
              {"          "}
              <span className={`${styles.span} ${styles.fn}`}>OPENAI_API_KEY:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>
                $&#123;&#123; secrets.OPENAI_API_KEY &#125;&#125;
              </span>
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.fn}`}>run:</span> |{"\n"}
              {"          "}oaieval gpt-4o qa_basic \{"\n"}
              {"            "}--record_path results/full_eval.jsonl \{"\n"}
              {"            "}--num_threads{" "}
              <span className={`${styles.span} ${styles.num}`}>10</span>
              {"\n"}
              {"      "}- <span className={`${styles.span} ${styles.kw}`}>name:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>結果をアーティファクト保存</span>
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.kw}`}>uses:</span>{" "}
              actions/upload-artifact@v4
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.kw}`}>with:</span>
              {"\n"}
              {"          "}
              <span className={`${styles.span} ${styles.fn}`}>name:</span>{" "}
              <span className={`${styles.span} ${styles.str}`}>eval-results</span>
              {"\n"}
              {"          "}
              <span className={`${styles.span} ${styles.fn}`}>path:</span> results/
            </pre>
          </div>

          <div className={`${styles.ib} ${styles.iWarn}`}>
            <span className={`${styles.span} ${styles.ibIcon}`}>⚠️</span>
            <div>
              <strong className={styles.strong}>コスト暴走を防ぐ2つの安全策：</strong>
              (1) <code className={styles.code}>paths:</code> フィルタで AI 関連ファイル変更時のみ
              Eval を実行。(2)
              <code className={styles.code}>needs:</code>
              でミニセット合格後にのみフルセットを実行し、早期失敗でコストを節約します。
            </div>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 9 — ADVANCED  */}
        {/*  ────────────────────────────────  */}
        <section className={styles.section} id="advanced">
          <div className={styles.secLabel}>Chapter 09</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>9</div>
            <div>
              <h2 className={styles.secTitle}>上級テクニック</h2>
              <div className={styles.secSub}>
                Eval Chain · 本番ログからの自動生成 · カスタム Evaluator
              </div>
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>
            Eval Chain — 段階的評価でコストを早期カット
          </h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ Eval チェーン フロー（ゲート条件付き）</div>
            <div id="diag-8" className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAM_8} />
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>本番ログからの Eval サンプル自動生成</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>python — scripts/generate_eval_from_logs.py</div>
            </div>
            <pre className={styles.pre}>
              <span className={`${styles.span} ${styles.kw}`}>import</span> json, random
              {"\n\n"}
              <span className={`${styles.span} ${styles.kw}`}>def</span>{" "}
              <span className={`${styles.span} ${styles.fn}`}>extract_eval_samples</span>({"\n"}
              {"    "}log_file: <span className={`${styles.span} ${styles.fn}`}>str</span>,{"\n"}
              {"    "}output_jsonl: <span className={`${styles.span} ${styles.fn}`}>str</span>,
              {"\n"}
              {"    "}sample_rate: <span className={`${styles.span} ${styles.fn}`}>float</span> ={" "}
              <span className={`${styles.span} ${styles.num}`}>0.01</span>,{"      "}
              <span className={`${styles.span} ${styles.cm}`}># 本番ログ of 1% をサンプリング</span>
              {"\n"}
              {"    "}min_quality: <span className={`${styles.span} ${styles.fn}`}>float</span> ={" "}
              <span className={`${styles.span} ${styles.num}`}>4.5</span>,{"        "}
              <span className={`${styles.span} ${styles.cm}`}># ユーザー評価 4.5 以上のみ</span>
              {"\n"}
              ):
              {"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.str}`}>
                """
                {"\n"}
                {"    "}高評価ユーザー回答を本番ログから抽出し、
                {"\n"}
                {"    "}Eval データセットを自動生成する。
                {"\n"}
                {"    "}"""
              </span>
              {"\n"}
              {"    "}samples = []
              {"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.kw}`}>with</span>{" "}
              <span className={`${styles.span} ${styles.fn}`}>open</span>
              (log_file) <span className={`${styles.span} ${styles.kw}`}>as</span> f:
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.kw}`}>for</span> line{" "}
              <span className={`${styles.span} ${styles.kw}`}>in</span> f:
              {"\n"}
              {"            "}log = json.
              <span className={`${styles.span} ${styles.fn}`}>loads</span>(line)
              {"\n\n"}
              {"            "}
              <span className={`${styles.span} ${styles.cm}`}># 品質フィルタリング</span>
              {"\n"}
              {"            "}
              <span className={`${styles.span} ${styles.kw}`}>if</span> log.
              <span className={`${styles.span} ${styles.fn}`}>get</span>(
              <span className={`${styles.span} ${styles.str}`}>"user_rating"</span>,{" "}
              <span className={`${styles.span} ${styles.num}`}>0</span>) &lt; min_quality:
              {"\n"}
              {"                "}
              <span className={`${styles.span} ${styles.kw}`}>continue</span>
              {"\n"}
              {"            "}
              <span className={`${styles.span} ${styles.kw}`}>if</span> random.
              <span className={`${styles.span} ${styles.fn}`}>random</span>
              () &gt; sample_rate:
              {"\n"}
              {"                "}
              <span className={`${styles.span} ${styles.kw}`}>continue</span>
              {"\n\n"}
              {"            "}
              <span className={`${styles.span} ${styles.cm}`}># Eval 形式に変換</span>
              {"\n"}
              {"            "}samples.<span className={`${styles.span} ${styles.fn}`}>append</span>
              (&#123;
              {"\n"}
              {"                "}
              <span className={`${styles.span} ${styles.str}`}>"input"</span>: log[
              <span className={`${styles.span} ${styles.str}`}>"messages"</span>],
              {"\n"}
              {"                "}
              <span className={`${styles.span} ${styles.str}`}>"ideal"</span>: log[
              <span className={`${styles.span} ${styles.str}`}>"response"</span>],{" "}
              <span className={`${styles.span} ${styles.cm}`}># 高評価回答を正解として使用</span>
              {"\n"}
              {"                "}
              <span className={`${styles.span} ${styles.str}`}>"metadata"</span>: &#123;
              {"\n"}
              {"                    "}
              <span className={`${styles.span} ${styles.str}`}>"source"</span>:{" "}
              <span className={`${styles.span} ${styles.str}`}>"production_log"</span>,{"\n"}
              {"                    "}
              <span className={`${styles.span} ${styles.str}`}>"date"</span>: log[
              <span className={`${styles.span} ${styles.str}`}>"timestamp"</span>],
              {"\n"}
              {"                    "}
              <span className={`${styles.span} ${styles.str}`}>"rating"</span>: log[
              <span className={`${styles.span} ${styles.str}`}>"user_rating"</span>],
              {"\n"}
              {"                "}&#125;
              {"\n"}
              {"            "}&#125;)
              {"\n\n"}
              {"    "}
              <span className={`${styles.span} ${styles.cm}`}># JSONL として保存</span>
              {"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.kw}`}>with</span>{" "}
              <span className={`${styles.span} ${styles.fn}`}>open</span>
              (output_jsonl, <span className={`${styles.span} ${styles.str}`}>"w"</span>){" "}
              <span className={`${styles.span} ${styles.kw}`}>as</span> f:
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.kw}`}>for</span> s{" "}
              <span className={`${styles.span} ${styles.kw}`}>in</span> samples:
              {"\n"}
              {"            "}f.<span className={`${styles.span} ${styles.fn}`}>write</span>(json.
              <span className={`${styles.span} ${styles.fn}`}>dumps</span>(s, ensure_ascii=
              <span className={`${styles.span} ${styles.kw}`}>False</span>) +{" "}
              <span className={`${styles.span} ${styles.str}`}>"\n"</span>){"\n\n"}
              {"    "}
              <span className={`${styles.span} ${styles.fn}`}>print</span>(
              <span className={`${styles.span} ${styles.str}`}>
                f"生成サンプル数: &#123;len(samples)&#125;"
              </span>
              ){"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.kw}`}>return</span> samples
            </pre>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>カスタム Python Evaluator の実装例</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>python — evals/elsuite/custom/code_exec_eval.py</div>
            </div>
            <pre className={styles.pre}>
              <span className={`${styles.span} ${styles.kw}`}>import evals</span>
              {"\n"}
              <span className={`${styles.span} ${styles.kw}`}>import evals.metrics</span>
              {"\n"}
              <span className={`${styles.span} ${styles.kw}`}>from evals.api</span>{" "}
              <span className={`${styles.span} ${styles.kw}`}>import CompletionFn</span>
              {"\n"}
              <span className={`${styles.span} ${styles.kw}`}>from evals.record</span>{" "}
              <span className={`${styles.span} ${styles.kw}`}>import RecorderBase</span>
              {"\n\n"}
              <span className={`${styles.span} ${styles.kw}`}>class</span>{" "}
              <span className={`${styles.span} ${styles.fn}`}>CodeExecutionEval</span>(evals.Eval):
              {"\n"}
              {"    "}
              <span className={`${styles.span} ${styles.str}`}>
                """生成コードが実際に実行可能かを検証する Evaluator"""
              </span>
              {"\n\n"}
              {"    "}
              <span className={`${styles.span} ${styles.kw}`}>def</span>{" "}
              <span className={`${styles.span} ${styles.fn}`}>__init__</span>({"\n"}
              {"        "}self,
              {"\n"}
              {"        "}completion_fns: list[CompletionFn],
              {"\n"}
              {"        "}samples_jsonl: <span className={`${styles.span} ${styles.fn}`}>str</span>,
              {"\n"}
              {"        "}*args, **kwargs
              {"\n"}
              {"    "}):
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.fn}`}>super</span>().
              <span className={`${styles.span} ${styles.fn}`}>__init__</span>(completion_fns, *args,
              **kwargs)
              {"\n"}
              {"        "}self.samples_jsonl = samples_jsonl
              {"\n\n"}
              {"    "}
              <span className={`${styles.span} ${styles.kw}`}>def</span>{" "}
              <span className={`${styles.span} ${styles.fn}`}>eval_sample</span>
              (self, sample, rng):
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.cm}`}>
                # 1. モデル呼び出し（temperature=0 で決定的出力）
              </span>
              {"\n"}
              {"        "}result = self.completion_fn(
              {"\n"}
              {"            "}prompt=sample[
              <span className={`${styles.span} ${styles.str}`}>"input"</span>],
              {"\n"}
              {"            "}temperature=<span className={`${styles.span} ${styles.num}`}>0</span>,
              {"\n"}
              {"            "}max_tokens=<span className={`${styles.span} ${styles.num}`}>500</span>
              ,{"\n"}
              {"        "}){"\n"}
              {"        "}code = result.
              <span className={`${styles.span} ${styles.fn}`}>get_completions</span>()[
              <span className={`${styles.span} ${styles.num}`}>0</span>]{"\n\n"}
              {"        "}
              <span className={`${styles.span} ${styles.cm}`}>
                # 2. カスタム採点: コードが実行可能か確認
              </span>
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.kw}`}>try</span>:{"\n"}
              {"            "}
              <span className={`${styles.span} ${styles.fn}`}>exec</span>({"\n"}
              {"                "}
              <span className={`${styles.span} ${styles.fn}`}>compile</span>(code,{" "}
              <span className={`${styles.span} ${styles.str}`}>"&lt;string&gt;"</span>,{" "}
              <span className={`${styles.span} ${styles.str}`}>"exec"</span>), &#123;&#125;
              {"\n"}
              {"            "}){"\n"}
              {"            "}correct = <span className={`${styles.span} ${styles.kw}`}>True</span>
              {"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.kw}`}>except</span> Exception{" "}
              <span className={`${styles.span} ${styles.kw}`}>as</span> e:
              {"\n"}
              {"            "}correct = <span className={`${styles.span} ${styles.kw}`}>False</span>
              {"\n\n"}
              {"        "}
              <span className={`${styles.span} ${styles.cm}`}># 3. 結果を記録</span>
              {"\n"}
              {"        "}evals.
              <span className={`${styles.span} ${styles.fn}`}>record_and_check_match</span>({"\n"}
              {"            "}prompt=sample[
              <span className={`${styles.span} ${styles.str}`}>"input"</span>],
              {"\n"}
              {"            "}sampled=code,
              {"\n"}
              {"            "}expected=<span className={`${styles.span} ${styles.kw}`}>None</span>,{" "}
              <span className={`${styles.span} ${styles.cm}`}>
                # 実行可否で判定するため ideal は不使用
              </span>
              {"\n"}
              {"        "}){"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.kw}`}>return</span> correct
              {"\n\n"}
              {"    "}
              <span className={`${styles.span} ${styles.kw}`}>def</span>{" "}
              <span className={`${styles.span} ${styles.fn}`}>run</span>(self, recorder:
              RecorderBase):
              {"\n"}
              {"        "}self.
              <span className={`${styles.span} ${styles.fn}`}>eval_all_samples</span>(recorder,
              self.<span className={`${styles.span} ${styles.fn}`}>get_samples</span>())
              {"\n"}
              {"        "}events = recorder.
              <span className={`${styles.span} ${styles.fn}`}>get_events</span>(
              <span className={`${styles.span} ${styles.str}`}>"match"</span>){"\n"}
              {"        "}
              <span className={`${styles.span} ${styles.kw}`}>return</span> &#123;
              <span className={`${styles.span} ${styles.str}`}>"pass_rate"</span>: evals.metrics.
              <span className={`${styles.span} ${styles.fn}`}>get_accuracy</span>(events)&#125;
            </pre>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 10 — PITFALLS  */}
        {/*  ────────────────────────────────  */}
        <section className={styles.section} id="pitfalls">
          <div className={styles.secLabel}>Chapter 10</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>10</div>
            <div>
              <h2 className={styles.secTitle}>よくある落とし穴と対策</h2>
              <div className={styles.secSub}>Eval アンチパターン7選 + デバッグフロー</div>
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>Eval アンチパターン一覧</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.tr}>
                  <th className={styles.th}>アンチパターン</th>
                  <th className={styles.th}>症状</th>
                  <th className={styles.th}>対策</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                <tr className={styles.tr}>
                  <td className={styles.td}>テスト汚染</td>
                  <td className={styles.td}>スコアは高いのに本番品質が低い</td>
                  <td className={styles.td}>訓練データと Eval データを厳密に分離</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>メトリクス固執</td>
                  <td className={styles.td}>accuracy は高いが使いにくい</td>
                  <td className={styles.td}>複数指標（F1/ROUGE/レイテンシ）を組み合わせる</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>採点者バイアス</td>
                  <td className={styles.td}>GPT-4o が自分と似た回答を高評価</td>
                  <td className={styles.td}>採点モデルと被評価モデルを分離する</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>ゴールドセット陳腐化</td>
                  <td className={styles.td}>半年前の正解が今も有効とは限らない</td>
                  <td className={styles.td}>四半期ごとにゴールドセットを見直す</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>コスト超過</td>
                  <td className={styles.td}>Eval に月数万円かかる</td>
                  <td className={styles.td}>ミニセット戦略 + gpt-4o-mini の活用</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>非再現性</td>
                  <td className={styles.td}>同じ Eval を走らせても毎回結果が違う</td>
                  <td className={styles.td}>temperature=0 + seed パラメータを固定</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>過学習 Eval</td>
                  <td className={styles.td}>Eval スコアだけ最適化してしまう</td>
                  <td className={styles.td}>ホールドアウトセットを非公開にする</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>スコアが低い時のデバッグフロー</h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ Eval スコア低下 — 原因特定フローチャート</div>
            <div id="diag-9" className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAM_9} />
            </div>
          </div>

          <h3 className={`${styles.h3} ${styles.subH}`}>ハーネスエンジニアリング成熟度モデル</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.tr}>
                  <th className={styles.th}>レベル</th>
                  <th className={styles.th}>名称</th>
                  <th className={styles.th}>特徴</th>
                  <th className={styles.th}>次のステップ</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                <tr className={styles.tr}>
                  <td className={styles.td}>Lv.0</td>
                  <td className={styles.td}>未整備</td>
                  <td className={styles.td}>手動テストのみ / 評価の仕組みなし</td>
                  <td className={styles.td}>最小 Eval セットを 20件作成する</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>Lv.1</td>
                  <td className={styles.td}>基礎</td>
                  <td className={styles.td}>String Match Eval がある / 手動実行</td>
                  <td className={styles.td}>CI/CD に Eval を組み込む</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>Lv.2</td>
                  <td className={styles.td}>自動化</td>
                  <td className={styles.td}>CI で自動実行 / 合格基準がある</td>
                  <td className={styles.td}>LLM-as-Judge パターンを追加する</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>Lv.3</td>
                  <td className={styles.td}>高度化</td>
                  <td className={styles.td}>本番ログからのフィードバックループがある</td>
                  <td className={styles.td}>Eval Chain と回帰テストを実装する</td>
                </tr>
                <tr className={styles.tr}>
                  <td className={styles.td}>Lv.4</td>
                  <td className={styles.td}>最適化</td>
                  <td className={styles.td}>コスト・精度・速度のトレードオフが最適化</td>
                  <td className={styles.td}>Fine-tuning サイクルと Eval を連携</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 11 — SOURCES  */}
        {/*  ────────────────────────────────  */}
        <section className={styles.section} id="sources">
          <div className={styles.secLabel}>Chapter 11</div>
          <div className={styles.secHeader}>
            <div
              className={styles.secNum}
              style={{ background: "linear-gradient(135deg, #334155, #5a6e8c)" }}
            >
              📚
            </div>
            <div>
              <h2 className={styles.secTitle}>参考ソース一覧</h2>
              <div className={styles.secSub}>公式ドキュメント · ブログ · コミュニティリソース</div>
            </div>
          </div>

          <div className={styles.srcList}>
            <a
              href="https://github.com/openai/evals"
              target="_blank"
              className={`${styles.a} ${styles.srcItem}`}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🐙</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>openai/evals — GitHub（公式リポジトリ）</div>
                <div className={styles.srcUrl}>https://github.com/openai/evals</div>
              </div>
              <span className={`${styles.span} ${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={`${styles.span} ${styles.srcArr}`}>↗</span>
            </a>
            <a
              href="https://github.com/openai/evals/blob/main/README.md"
              target="_blank"
              className={`${styles.a} ${styles.srcItem}`}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>📖</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>Evals README — セットアップ・CLI リファレンス</div>
                <div className={styles.srcUrl}>
                  https://github.com/openai/evals/blob/main/README.md
                </div>
              </div>
              <span className={`${styles.span} ${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={`${styles.span} ${styles.srcArr}`}>↗</span>
            </a>
            <a
              href="https://github.com/openai/evals/blob/main/docs/build-eval.md"
              target="_blank"
              className={`${styles.a} ${styles.srcItem}`}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🔧</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  How to Build an Eval — カスタム Eval 作成ガイド
                </div>
                <div className={styles.srcUrl}>
                  https://github.com/openai/evals/blob/main/docs/build-eval.md
                </div>
              </div>
              <span className={`${styles.span} ${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={`${styles.span} ${styles.srcArr}`}>↗</span>
            </a>
            <a
              href="https://github.com/openai/evals/blob/main/docs/eval-templates.md"
              target="_blank"
              className={`${styles.a} ${styles.srcItem}`}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>📋</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  Eval Templates — 組み込み Evaluator クラス一覧
                </div>
                <div className={styles.srcUrl}>
                  https://github.com/openai/evals/blob/main/docs/eval-templates.md
                </div>
              </div>
              <span className={`${styles.span} ${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={`${styles.span} ${styles.srcArr}`}>↗</span>
            </a>
            <a
              href="https://platform.openai.com/docs/guides/evals"
              target="_blank"
              className={`${styles.a} ${styles.srcItem}`}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🖥️</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  OpenAI Platform — Evals ガイド（Dashboard 統合）
                </div>
                <div className={styles.srcUrl}>https://platform.openai.com/docs/guides/evals</div>
              </div>
              <span className={`${styles.span} ${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={`${styles.span} ${styles.srcArr}`}>↗</span>
            </a>
            <a
              href="https://cookbook.openai.com/examples/evaluation/how_to_eval_abstractive_summarization"
              target="_blank"
              className={`${styles.a} ${styles.srcItem}`}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🍳</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>OpenAI Cookbook — LLM-as-Judge パターン実装例</div>
                <div className={styles.srcUrl}>
                  https://cookbook.openai.com/examples/evaluation/how_to_eval_abstractive_summarization
                </div>
              </div>
              <span className={`${styles.span} ${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={`${styles.span} ${styles.srcArr}`}>↗</span>
            </a>
            <a
              href="https://platform.openai.com/docs/guides/agents"
              target="_blank"
              className={`${styles.a} ${styles.srcItem}`}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🤖</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  OpenAI Agents SDK — エージェント開発とハーネス統合
                </div>
                <div className={styles.srcUrl}>https://platform.openai.com/docs/guides/agents</div>
              </div>
              <span className={`${styles.span} ${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={`${styles.span} ${styles.srcArr}`}>↗</span>
            </a>
            <a
              href="https://openai.com/research/evals"
              target="_blank"
              className={`${styles.a} ${styles.srcItem}`}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🔬</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  Introducing Evals — Evals フレームワーク発表・設計思想
                </div>
                <div className={styles.srcUrl}>https://openai.com/research/evals</div>
              </div>
              <span className={`${styles.span} ${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={`${styles.span} ${styles.srcArr}`}>↗</span>
            </a>
            <a
              href="https://developers.openai.com/codex/learn/best-practices"
              target="_blank"
              className={`${styles.a} ${styles.srcItem}`}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>⚡</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  Codex ベストプラクティス — AGENTS.md / TEST.md との統合
                </div>
                <div className={styles.srcUrl}>
                  https://developers.openai.com/codex/learn/best-practices
                </div>
              </div>
              <span className={`${styles.span} ${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={`${styles.span} ${styles.srcArr}`}>↗</span>
            </a>
            <a
              href="https://hamel.dev/blog/posts/evals/"
              target="_blank"
              className={`${styles.a} ${styles.srcItem}`}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>📝</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>Your AI Product Needs Evals — Hamel Husain</div>
                <div className={styles.srcUrl}>https://hamel.dev/blog/posts/evals/</div>
              </div>
              <span className={`${styles.span} ${styles.srcCat} ${styles.scComm}`}>
                コミュニティ
              </span>
              <span className={`${styles.span} ${styles.srcArr}`}>↗</span>
            </a>
            <a
              href="https://eugeneyan.com/writing/llm-evaluations/"
              target="_blank"
              className={`${styles.a} ${styles.srcItem}`}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>📊</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  LLM Evaluations — Eugene Yan（評価指標の選び方）
                </div>
                <div className={styles.srcUrl}>https://eugeneyan.com/writing/llm-evaluations/</div>
              </div>
              <span className={`${styles.span} ${styles.srcCat} ${styles.scComm}`}>
                コミュニティ
              </span>
              <span className={`${styles.span} ${styles.srcArr}`}>↗</span>
            </a>
            <a
              href="https://github.com/openai/evals/blob/main/docs/custom-eval.md"
              target="_blank"
              className={`${styles.a} ${styles.srcItem}`}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🛠️</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  Custom Eval Documentation — Python Evaluator 実装リファレンス
                </div>
                <div className={styles.srcUrl}>
                  https://github.com/openai/evals/blob/main/docs/custom-eval.md
                </div>
              </div>
              <span className={`${styles.span} ${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={`${styles.span} ${styles.srcArr}`}>↗</span>
            </a>
            <a
              href="https://openai.com/safety"
              target="_blank"
              className={`${styles.a} ${styles.srcItem}`}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🛡️</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>OpenAI Safety — セーフティ Eval の考え方</div>
                <div className={styles.srcUrl}>https://openai.com/safety</div>
              </div>
              <span className={`${styles.span} ${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={`${styles.span} ${styles.srcArr}`}>↗</span>
            </a>
          </div>
        </section>
        {/*  /section sources  */}
      </main>

      {/*  ═══ FOOTER ═══  */}
      <footer className={styles.footer}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div
            style={{
              fontSize: "13px",
              color: "var(--text2)",
              marginBottom: "8px",
              fontFamily: "var(--disp)",
              fontWeight: "700",
            }}
          >
            OpenAI ハーネスエンジニアリング 完全ガイド 2026
          </div>
          <div>
            最終更新: 2026年5月 ｜ 情報は記載時点のものです。最新情報は
            <a
              className={styles.a}
              href="https://platform.openai.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--oai)", textDecoration: "none" }}
            >
              platform.openai.com/docs
            </a>
            を参照してください。
          </div>
        </div>
      </footer>
    </div>
  );
}
