import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import Checklist from "./Checklist";

export const metadata: Metadata = {
  title: "Google Gemini AIエージェント ハーネスエンジニアリング 完全ガイド",
  description:
    "Google ADKとGeminiを組み合わせたAIエージェント評価ハーネスの設計思想、実装パターン、テストダブル、LLM-as-Judge、CI統合のベストプラクティスを解説する完全ガイドです。",
};

// ── MERMAID DIAGRAMS ──
const DIAG_1 = `flowchart TD
TEST["AIエージェントのテスト観点"]
FUNC["機能テスト"]
SAFE["安全性テスト"]
PERF["性能テスト"]
FUNC_1["正しいツールを選択するか"]
FUNC_2["引数は正確か"]
FUNC_3["応答は質問に答えているか"]
SAFE_1["有害コンテンツを生成しないか"]
SAFE_2["禁止操作を実行しないか"]
SAFE_3["プロンプトインジェクション耐性"]
PERF_1["応答時間は許容範囲内か"]
PERF_2["トークンコストは適切か"]
PERF_3["何ターンで解決できるか"]
TEST --> FUNC
TEST --> SAFE
TEST --> PERF
FUNC --> FUNC_1
FUNC --> FUNC_2
FUNC --> FUNC_3
SAFE --> SAFE_1
SAFE --> SAFE_2
SAFE --> SAFE_3
PERF --> PERF_1
PERF --> PERF_2
PERF --> PERF_3`;

const DIAG_2 = `flowchart TD
EVALSET["評価セット\\nEval Set — JSON/YAML で管理"]
RUNNER["テストランナー\\nADK Eval Runner / pytest / Cloud Build"]
AGENT["テスト対象エージェント\\nSUT — ADK LlmAgent"]
FAKE_TOOL["フェイクツール\\nFake Tools — 外部APIの替え玉"]
FAKE_MODEL["フェイクモデル\\nFake LLM — 決定論的な返答"]
SCORER["採点システム\\nScorers — ツール/応答/安全性"]
REPORTER["レポーター\\nHTML + JSON + CI Dashboard"]
EVALSET --> RUNNER
RUNNER --> AGENT
AGENT --> FAKE_TOOL
AGENT --> FAKE_MODEL
FAKE_TOOL --> SCORER
FAKE_MODEL --> SCORER
SCORER --> REPORTER`;

const DIAG_3 = `flowchart LR
P1["原則1\\n代表性\\n実際のユースケースをカバー"]
P2["原則2\\n多様性\\nエッジケース・境界値を含む"]
P3["原則3\\n独立性\\n各ケースが互いに依存しない"]
P4["原則4\\n保守性\\nコードと分離して管理"]
P5["原則5\\n追跡性\\n失敗原因が特定できる"]
P1 --> P2
P2 --> P3
P3 --> P4
P4 --> P5`;

const DIAG_4 = `flowchart TD
PROBLEM["本物APIを毎回呼ぶ問題"]
P1["コスト問題\\n1回のE2E評価に数百〜数千円のAPIコスト"]
P2["速度問題\\nAPI応答待ちでCIが数十分に"]
P3["再現性問題\\n確率的な応答で毎回結果が変わる"]
P4["安定性問題\\nAPIレート制限・ネットワーク障害でCI失敗"]
PROBLEM --> P1
PROBLEM --> P2
PROBLEM --> P3
PROBLEM --> P4`;

const DIAG_5 = `flowchart TD
START["adk eval コマンド実行"]
LOAD["評価セットの読み込み\\neval_set.json"]
FOR_EACH["各評価ケースを順番に処理"]
AGENT_RUN["エージェントを実行\\nLlmAgent.run(query)"]
CAPTURE["応答・ツール呼び出しを記録\\nTrajectory の取得"]
SCORE_TOOL["ツール呼び出し採点\\ntool_call_quality Scorer"]
SCORE_RESP["応答品質採点\\nresponse_quality Scorer"]
AGGREGATE["スコアの集計\\n全ケースの平均スコア"]
REPORT["レポート生成\\nHTML + JSON"]
CHECK["閾値チェック\\n基準値を下回ったら FAIL"]
START --> LOAD
LOAD --> FOR_EACH
FOR_EACH --> AGENT_RUN
AGENT_RUN --> CAPTURE
CAPTURE --> SCORE_TOOL
CAPTURE --> SCORE_RESP
SCORE_TOOL --> AGGREGATE
SCORE_RESP --> AGGREGATE
AGGREGATE --> REPORT
REPORT --> CHECK`;

const DIAG_6 = `flowchart TD
JUDGE["LLM-as-Judge の種類"]
P1["パターン1\\nReference-based Judge\\n参考答案と比較して採点\\n正確性の評価に最適"]
P2["パターン2\\nPairwise Judge\\n2つの応答を比較してどちらが優れているか判定\\nモデル改善評価に最適"]
P3["パターン3\\nCriteria-based Judge\\n特定の基準で採点\\n安全性・品質保証に最適"]
JUDGE --> P1
JUDGE --> P2
JUDGE --> P3`;

const DIAG_7 = `flowchart TD
EVAL_INPUT["評価入力\\nユーザーの最初の質問"]
ORCH["Orchestrator Agent\\n評価対象"]
FAKE_SUB_A["フェイク サブエージェントA\\n研究エージェントの替え玉"]
FAKE_SUB_B["フェイク サブエージェントB\\n実装エージェントの替え玉"]
REAL_SUB_C["本物 サブエージェントC\\n評価対象のサブエージェント"]
CAPTURE_ORCH["Orchestratorの動作記録\\n委譲先・タイミング・引数"]
CAPTURE_C["サブエージェントCの動作記録\\n応答品質・ツール呼び出し"]
SCORER["マルチエージェント採点\\n委譲精度 + サブ品質 + E2E品質"]
EVAL_INPUT --> ORCH
ORCH --> FAKE_SUB_A
ORCH --> FAKE_SUB_B
ORCH --> REAL_SUB_C
FAKE_SUB_A --> CAPTURE_ORCH
FAKE_SUB_B --> CAPTURE_ORCH
REAL_SUB_C --> CAPTURE_C
CAPTURE_ORCH --> SCORER
CAPTURE_C --> SCORER`;

const DIAG_8 = `flowchart TD
CI_RUN["CI でのフレイキー検出\\n3回以上 PASS/FAIL が混在"]
QUARANTINE["隔離 Quarantine\\n専用ラベルでメインCIから除外"]
ANALYZE["原因分析"]
CAUSE_LLM["原因: LLMの変動\\n→ スコア閾値調整\\nまたは多数決評価を導入"]
CAUSE_DATA["原因: 評価データの問題\\n→ 期待値の表現を緩和\\n正規表現・部分一致に変更"]
CAUSE_ENV["原因: 環境の問題\\n→ ハーミティック化\\nDBリセット・APIモック化"]
VERIFY["再検証\\n10回連続で安定を確認"]
RESTORE["メインCIに復帰"]
DEADLINE["一定期間内に未解決\\n→ 評価ケースを削除\\nGitHub Issue を発行"]
CI_RUN --> QUARANTINE
QUARANTINE --> ANALYZE
ANALYZE --> CAUSE_LLM
ANALYZE --> CAUSE_DATA
ANALYZE --> CAUSE_ENV
CAUSE_LLM --> VERIFY
CAUSE_DATA --> VERIFY
CAUSE_ENV --> VERIFY
VERIFY --> RESTORE
QUARANTINE --> DEADLINE`;

const DIAG_9 = `flowchart TD
PUSH["git push / Pull Request"]
SMALL["Stage 1: Small テスト\\nフェイクLLM使用\\nユニット評価 〜30秒"]
MEDIUM["Stage 2: Medium テスト\\n安価なモデル使用\\n統合評価 〜5分"]
LARGE["Stage 3: Large テスト\\n最高精度モデル使用\\nE2E評価 〜15分（オプション）"]
SAFETY["Stage 4: 安全性テスト\\n有害コンテンツ検出\\nプロンプトインジェクション 〜5分"]
DEPLOY["デプロイ承認"]
FAIL_EARLY["早期失敗\\n後のStageをスキップ コスト節約"]
PUSH --> SMALL
SMALL -->|PASS| MEDIUM
SMALL -->|FAIL| FAIL_EARLY
MEDIUM -->|PASS| LARGE
MEDIUM -->|FAIL| FAIL_EARLY
LARGE -->|PASS| SAFETY
SAFETY -->|PASS| DEPLOY`;

const DIAG_10 = `flowchart TD
PHILOSOPHY["Googleのエージェント評価哲学\\nSmall 70% / Medium 25% / Large 5%\\n確率的 → スコアリング評価"]
HARNESS["ハーネス構成要素\\n評価セット + FakeLLM + FakeTool + Scorer"]
HERMETIC["ハーミティック原則\\n各テストが独立・再現可能・自己完結"]
DOUBLE["テストダブル\\nFakeLlm / StubTool / MockTool / Recording"]
IMPL["実装ステップ\\nDI設計 → ダブル作成 → 評価セット → ADK Eval"]
FLAKY["フレイキー対策\\n多数決評価 + スコア閾値 + 隔離 → 根本解決"]
CI["CI統合\\n段階的実行 + コスト最適化\\nGitHub Actions / Cloud Build"]
MULTI["マルチエージェント評価\\n委譲精度 + 中間出力 + 並行性チェック"]
PHILOSOPHY --> HARNESS
HARNESS --> HERMETIC
HERMETIC --> DOUBLE
DOUBLE --> IMPL
IMPL --> FLAKY
FLAKY --> CI
CI --> MULTI`;

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function AgentHarnessEngineeringPage() {
  return (
    <>
      <div className={styles.prog} />

      {/* HERO */}
      <header className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroEyebrow}>Google ADK × Gemini 3.1 Pro — 2026年5月最新版</div>
        <h1>
          Google Gemini<br />
          <span className={styles.rainbow}>AIエージェント ハーネスエンジニアリング</span>
          <br />完全ガイド
        </h1>
        <p className={styles.heroSub}>
          初学者でもステップバイステップで理解できる — 評価セット設計からテストダブル・ADK
          Eval・LLM-as-Judge・CIパイプライン統合まで、Google推奨のベストプラクティスを根拠ソース付きで徹底解説
        </p>
        <div className={styles.heroChips}>
          <span className={`${styles.chip} ${styles.cb}`}>Gemini CLI v0.34.0</span>
          <span className={`${styles.chip} ${styles.cg}`}>Google ADK v1.x</span>
          <span className={`${styles.chip} ${styles.cy}`}>ADK Eval</span>
          <span className={`${styles.chip} ${styles.cr}`}>LLM-as-Judge</span>
          <span className={`${styles.chip} ${styles.cp}`}>GitHub Actions</span>
        </div>
      </header>

      <main className={styles.wrap}>
        {/* TOC */}
        <nav className={styles.toc} aria-label="目次">
          <div className={styles.tocLabel}>目次</div>
          <ol>
            <li>
              <a href="#s1">AIエージェントのテストとは — 通常ソフトウェアとの決定的な違い</a>
            </li>
            <li>
              <a href="#s2">ハーネスアーキテクチャ全体像</a>
            </li>
            <li>
              <a href="#s3">評価セット（Eval Set）の設計</a>
            </li>
            <li>
              <a href="#s4">テストダブル — フェイクLLM・フェイクツールの実装</a>
            </li>
            <li>
              <a href="#s5">ADK Eval — Google公式評価フレームワーク</a>
            </li>
            <li>
              <a href="#s6">LLM-as-Judge パターン</a>
            </li>
            <li>
              <a href="#s7">マルチエージェント評価ハーネス</a>
            </li>
            <li>
              <a href="#s8">フレイキー（不安定）評価への対処</a>
            </li>
            <li>
              <a href="#s9">CIパイプラインへの統合</a>
            </li>
            <li>
              <a href="#s10">ベストプラクティス 10則 &amp; チェックリスト</a>
            </li>
            <li>
              <a href="#s11">参考ソース一覧</a>
            </li>
          </ol>
        </nav>

        {/* ── SECTION 1 ── */}
        <section id="s1" className={styles.sec}>
          <div className={styles.secNo}>Section 01</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>01.</span>AIエージェントのテストとは何か
          </h2>
          <p>
            通常のソフトウェアは「同じ入力 → 必ず同じ出力」という<strong>決定論的</strong>な性質を持ちます。一方、LLMベースのAIエージェントは<strong>確率的</strong>であり、同じ質問でも毎回微妙に異なる回答を生成します。このため、従来の{" "}
            <code>assert output == expected</code> アプローチが使えません。
          </p>

          <h3>通常ソフトウェア vs AIエージェントの違い</h3>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>比較軸</th>
                  <th>通常のソフトウェア</th>
                  <th>AIエージェント</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>出力の性質</td>
                  <td>決定論的（毎回同じ）</td>
                  <td>確率的（毎回変わりうる）</td>
                </tr>
                <tr>
                  <td>テスト手法</td>
                  <td>
                    <code>{"assert output == expected"}</code>
                  </td>
                  <td>スコアリング・LLM-as-Judge</td>
                </tr>
                <tr>
                  <td>失敗基準</td>
                  <td>1件でも FAIL</td>
                  <td>スコアが閾値を下回る</td>
                </tr>
                <tr>
                  <td>テストデータ</td>
                  <td>単体テストケース</td>
                  <td>評価セット（Eval Set）</td>
                </tr>
                <tr>
                  <td>検証対象</td>
                  <td>戻り値・副作用</td>
                  <td>ツール呼び出し・応答品質・安全性</td>
                </tr>
                <tr>
                  <td>実行コスト</td>
                  <td>ミリ秒〜秒単位・無料</td>
                  <td>秒〜分単位・APIコスト発生</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>AIエージェントのテスト3観点</h3>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>テスト観点の全体像</div>
            <div id="diag-1">
              <MermaidDiagram chart={DIAG_1} />
            </div>
          </div>

          <div className={`${styles.info} ${styles.iNote}`}>
            <span className={styles.ii}>💡</span>
            <div>
              <strong>例え話：</strong>
              自動車のクラッシュテストでは、ダミー人形・センサー・高速カメラ・制御された環境がすべて揃って初めて「安全性スコア」が出ます。AIエージェントも同様に、テスト環境・評価データ・採点ロジックがセットになった<strong>テストハーネス</strong>がなければ品質を数値化できません。
            </div>
          </div>
        </section>

        {/* ── SECTION 2 ── */}
        <section id="s2" className={styles.sec}>
          <div className={styles.secNo}>Section 02</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>02.</span>ハーネスアーキテクチャ全体像
          </h2>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>Google推奨エージェント評価ハーネスの構成</div>
            <div id="diag-2">
              <MermaidDiagram chart={DIAG_2} />
            </div>
          </div>

          <h3>3種類のテストレベル</h3>
          <p>
            Googleはエージェントテストを <strong>Small / Medium / Large</strong>{" "}
            で分類しています（Software Engineering at Google の分類をAIに適用）。
          </p>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>レベル</th>
                  <th>名称</th>
                  <th>LLM</th>
                  <th>外部API</th>
                  <th>目的</th>
                  <th>実行時間</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Small</td>
                  <td>ユニット評価</td>
                  <td>フェイクLLM</td>
                  <td>モック</td>
                  <td>ツール呼び出しロジックのテスト</td>
                  <td>〜5秒</td>
                </tr>
                <tr>
                  <td>Medium</td>
                  <td>統合評価</td>
                  <td>本物LLM（安価なモデル）</td>
                  <td>スタブ</td>
                  <td>1〜3ターンの会話品質評価</td>
                  <td>〜60秒</td>
                </tr>
                <tr>
                  <td>Large</td>
                  <td>E2E評価</td>
                  <td>本物LLM（最高精度モデル）</td>
                  <td>本物API</td>
                  <td>複数ステップの自律タスク評価</td>
                  <td>〜300秒</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.cardGrid}>
            <div className={styles.miniCard}>
              <div className={styles.mcTag} style={{ color: "var(--g-green)" }}>
                🔬 Small テストを最大化
              </div>
              <p>
                フェイクLLMを使い APIコスト 0円・高速で設計ミスを早期発見。全テストの70%以上をSmallに。
              </p>
            </div>
            <div className={styles.miniCard}>
              <div className={styles.mcTag} style={{ color: "var(--g-blue)" }}>
                🔗 Medium テストでバランス
              </div>
              <p>
                安価な <code>gemini-3-flash-preview</code>{" "}
                を使い実際の会話品質を確認。コスト90%削減。
              </p>
            </div>
            <div className={styles.miniCard}>
              <div className={styles.mcTag} style={{ color: "var(--g-yellow)" }}>
                🚀 Large テストは最小限に
              </div>
              <p>最高精度モデルのE2E評価は時間・コストが高い。リリース前の最終確認に限定。</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3 ── */}
        <section id="s3" className={styles.sec}>
          <div className={styles.secNo}>Section 03</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>03.</span>評価セット（Eval Set）の設計
          </h2>
          <p>
            <strong>評価セット</strong>
            とは「こう聞いたら・こうツールを呼んで・こう答えるはず」という期待を定義したテストデータの集合です。コードと分離してJSON/YAMLで管理することで、<strong>評価観点の変更をコード変更なしに実施</strong>できます。
          </p>

          <h3>ADK Eval の評価セット形式（JSON）</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <div className={styles.codeDots}>
                <div className={`${styles.cd} ${styles.red}`} />
                <div className={`${styles.cd} ${styles.yel}`} />
                <div className={`${styles.cd} ${styles.grn}`} />
              </div>
              <span>evals/eval_set.json</span>
            </div>
            <pre className={`${styles.codeBody} language-json`}>
              <div className={styles.codeLine}><span className={styles.key}>[</span></div>
              <div className={styles.codeLine}>  <span className={styles.key}>{"{"}</span></div>
              <div className={styles.codeLine}>    <span className={styles.str}>"name"</span>: <span className={styles.str}>"deploy_staging_query"</span>,</div>
              <div className={styles.codeLine}>    <span className={styles.str}>"query"</span>: <span className={styles.str}>"ステージング環境にデプロイする手順を実行してください"</span>,</div>
              <div className={styles.codeLine}>    <span className={styles.str}>"expected_tool_calls"</span>: <span className={styles.key}>[</span></div>
              <div className={styles.codeLine}>      <span className={styles.key}>{"{"}</span></div>
              <div className={styles.codeLine}>        <span className={styles.str}>"tool_name"</span>: <span className={styles.str}>"check_test_coverage"</span>,</div>
              <div className={styles.codeLine}>        <span className={styles.str}>"args"</span>: <span className={styles.key}>{"{"}</span> <span className={styles.str}>"threshold"</span>: <span className={styles.num}>80</span> <span className={styles.key}>{"}"}</span></div>
              <div className={styles.codeLine}>      <span className={styles.key}>{"}"}</span>,</div>
              <div className={styles.codeLine}>      <span className={styles.key}>{"{"}</span></div>
              <div className={styles.codeLine}>        <span className={styles.str}>"tool_name"</span>: <span className={styles.str}>"run_deploy"</span>,</div>
              <div className={styles.codeLine}>        <span className={styles.str}>"args"</span>: <span className={styles.key}>{"{"}</span> <span className={styles.str}>"environment"</span>: <span className={styles.str}>"staging"</span> <span className={styles.key}>{"}"}</span></div>
              <div className={styles.codeLine}>      <span className={styles.key}>{"}"}</span></div>
              <div className={styles.codeLine}>    <span className={styles.key}>]</span>,</div>
              <div className={styles.codeLine}>    <span className={styles.str}>"reference"</span>: <span className={styles.str}>"テスト通過後、ステージングへのデプロイが完了しました。"</span></div>
              <div className={styles.codeLine}>  <span className={styles.key}>{"}"}</span>,</div>
              <div className={styles.codeLine}>  <span className={styles.key}>{"{"}</span></div>
              <div className={styles.codeLine}>    <span className={styles.str}>"name"</span>: <span className={styles.str}>"security_check_query"</span>,</div>
              <div className={styles.codeLine}>    <span className={styles.str}>"query"</span>: <span className={styles.str}>"このコードにSQLインジェクションのリスクはありますか？"</span>,</div>
              <div className={styles.codeLine}>    <span className={styles.str}>"expected_tool_calls"</span>: <span className={styles.key}>[</span></div>
              <div className={styles.codeLine}>      <span className={styles.key}>{"{"}</span></div>
              <div className={styles.codeLine}>        <span className={styles.str}>"tool_name"</span>: <span className={styles.str}>"security_scanner"</span>,</div>
              <div className={styles.codeLine}>        <span className={styles.str}>"args"</span>: <span className={styles.key}>{"{"}</span> <span className={styles.str}>"scan_type"</span>: <span className={styles.str}>"sql_injection"</span> <span className={styles.key}>{"}"}</span></div>
              <div className={styles.codeLine}>      <span className={styles.key}>{"}"}</span></div>
              <div className={styles.codeLine}>    <span className={styles.key}>]</span>,</div>
              <div className={styles.codeLine}>    <span className={styles.str}>"reference"</span>: <span className={styles.str}>"SQLインジェクションのリスクを分析した結果を提示してください。"</span></div>
              <div className={styles.codeLine}>  <span className={styles.key}>{"}"}</span></div>
              <div className={styles.codeLine}><span className={styles.key}>]</span></div>
            </pre>
          </div>

          <h3>評価セット設計の5原則</h3>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>評価セット5原則</div>
            <div id="diag-3">
              <MermaidDiagram chart={DIAG_3} />
            </div>
          </div>
        </section>

        {/* ── SECTION 4 ── */}
        <section id="s4" className={styles.sec}>
          <div className={styles.secNo}>Section 04</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>04.</span>テストダブル — フェイクLLM・フェイクツールの実装
          </h2>

          <h3>なぜテストダブルが必要か</h3>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>本物APIを毎回呼ぶ問題</div>
            <div id="diag-4">
              <MermaidDiagram chart={DIAG_4} />
            </div>
          </div>

          <h3>フェイクLLM（Fake LLM）の実装 — Small テスト用</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <div className={styles.codeDots}>
                <div className={`${styles.cd} ${styles.red}`} />
                <div className={`${styles.cd} ${styles.yel}`} />
                <div className={`${styles.cd} ${styles.grn}`} />
              </div>
              <span>tests/doubles/fake_llm.py</span>
            </div>
            <pre className={`${styles.codeBody} language-python`}>
              <div className={styles.codeLine}><span className={styles.kw}>from</span> google.adk.models <span className={styles.kw}>import</span> BaseLlm, LlmResponse</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.kw}>class</span> <span className={styles.fn}>FakeLlm</span>(BaseLlm):</div>
              <div className={styles.codeLine}>    <span className={styles.str}>"""</span></div>
              <div className={styles.codeLine}><span className={styles.str}>    テスト用フェイクLLM。</span></div>
              <div className={styles.codeLine}><span className={styles.str}>    事前に定義したシナリオ（query → response）に従って</span></div>
              <div className={styles.codeLine}><span className={styles.str}>    決定論的な応答を返す。APIコスト・ネットワーク接続なし。</span></div>
              <div className={styles.codeLine}><span className={styles.str}>    """</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>    <span className={styles.kw}>def</span> <span className={styles.fn}>__init__</span>(self, scenarios: dict[str, LlmResponse]):</div>
              <div className={styles.codeLine}>        self._scenarios = scenarios</div>
              <div className={styles.codeLine}>        self._call_history: list[str] = []  <span className={styles.cmt}># 呼び出し記録（検証用）</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>    <span className={styles.kw}>async def</span> <span className={styles.fn}>generate_content_async</span>(self, llm_request, **kwargs) -&gt; LlmResponse:</div>
              <div className={styles.codeLine}>        query = llm_request.contents[-1].parts[0].text</div>
              <div className={styles.codeLine}>        self._call_history.append(query)</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>        <span className={styles.kw}>for</span> pattern, response <span class="kw">in</span> self._scenarios.items():</div>
              <div className={styles.codeLine}>            <span className={styles.kw}>if</span> pattern <span class="kw">in</span> query:</div>
              <div className={styles.codeLine}>                <span className={styles.kw}>return</span> response</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>        <span className={styles.kw}>return</span> LlmResponse(text=<span className={styles.str}>"デフォルト応答です。"</span>)</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>    <span className={styles.kw}>@property</span></div>
              <div className={styles.codeLine}>    <span className={styles.kw}>def</span> <span className={styles.fn}>call_count</span>(self) -&gt; int:</div>
              <div className={styles.codeLine}>        <span className={styles.str}>"""何回呼ばれたかを返す（アサーション用）"""</span></div>
              <div className={styles.codeLine}        >        <span className={styles.kw}>return</span> len(self._call_history)</div>
            </pre>
          </div>

          <h3>フェイクツール（Fake Tool）の実装</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <div className={styles.codeDots}>
                <div className={`${styles.cd} ${styles.red}`} />
                <div className={`${styles.cd} ${styles.yel}`} />
                <div className={`${styles.cd} ${styles.grn}`} />
              </div>
              <span>tests/doubles/fake_tools.py</span>
            </div>
            <pre className={`${styles.codeBody} language-python`}>
              <div className={styles.codeLine}><span className={styles.kw}>from</span> google.adk.tools <span className={styles.kw}>import</span> FunctionTool</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.kw}>def</span> <span className={styles.fn}>make_fake_deploy_tool</span>(should_succeed: bool = <span className={styles.kw}>True</span>):</div>
              <div className={styles.codeLine}>    <span className={styles.str}>"""デプロイツールの替え玉。本番環境には触れず成功/失敗を制御できる。"""</span></div>
              <div className={styles.codeLine}>    call_log = []  <span className={styles.cmt}># 呼び出し記録</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>    <span className={styles.kw}>def</span> <span className={styles.fn}>fake_deploy</span>(environment: str) -&gt; dict:</div>
              <div className={styles.codeLine}>        call_log.append(<span className={styles.key}>{"{\"environment\": environment}"}</span>)</div>
              <div className={styles.codeLine}>        <span className={styles.kw}>if</span> should_succeed:</div>
              <div className={styles.codeLine}>            <span className={styles.kw}>return</span> <span className={styles.key}>{"{\"status\": \"success\", \"url\": f\"https://{environment}.example.com\"}"}</span></div>
              <div className={styles.codeLine}>        <span className={styles.kw}>return</span> <span className={styles.key}>{"{\"status\": \"error\", \"message\": \"Deployment failed\"}"}</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>    fake_deploy.call_log = call_log  <span className={styles.cmt}># テストから参照できるように付与</span></div>
              <div className={styles.codeLine}>    <span className={styles.kw}>return</span> FunctionTool(fake_deploy)</div>
            </pre>
          </div>

          <h3>テストダブルの種類と使い分け</h3>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>種類</th>
                  <th>特徴</th>
                  <th>AIエージェントでの使用場面</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fake LLM</td>
                  <td>決定論的な応答を返す軽量実装</td>
                  <td>ツール呼び出しロジックのSmallテスト</td>
                </tr>
                <tr>
                  <td>Stub Tool</td>
                  <td>固定値を返すだけのツール</td>
                  <td>外部APIが不安定な統合テスト</td>
                </tr>
                <tr>
                  <td>Mock Tool</td>
                  <td>呼び出しを記録して検証するツール</td>
                  <td>「このツールが正確に呼ばれたか」の検証</td>
                </tr>
                <tr>
                  <td>Spy</td>
                  <td>本物のツールを使いつつ呼び出しを記録</td>
                  <td>本番に近い環境での動作監視</td>
                </tr>
                <tr>
                  <td>Recording/Replay</td>
                  <td>実際のAPI応答を録画・再生</td>
                  <td>高コストAPIのコスト削減</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SECTION 5 ── */}
        <section id="s5" className={styles.sec}>
          <div className={styles.secNo}>Section 05</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>05.</span>ADK Eval — Google公式評価フレームワーク
          </h2>
          <p>
            <strong>ADK Eval</strong>（Agent Development Kit
            Evaluation）はGoogleが提供するAIエージェント専用の評価フレームワークです。ツール呼び出しの正確性・応答品質・会話の流れを自動で評価します。
          </p>

          <h3>ADK Eval の採点器（Scorers）一覧</h3>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>採点器</th>
                  <th>測定内容</th>
                  <th>スコア範囲</th>
                  <th>推奨閾値</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>tool_call_quality</td>
                  <td>ツール名・引数の正確性</td>
                  <td>0.0〜1.0</td>
                  <td>
                    <span className={`${styles.scoreBadge} ${styles.sbG}`}>≥ 0.8</span>
                  </td>
                </tr>
                <tr>
                  <td>response_quality</td>
                  <td>応答の正確性・有用性</td>
                  <td>0.0〜1.0</td>
                  <td>
                    <span className={`${styles.scoreBadge} ${styles.sbG}`}>≥ 0.7</span>
                  </td>
                </tr>
                <tr>
                  <td>trajectory_accuracy</td>
                  <td>会話の経路が期待通りか</td>
                  <td>0.0〜1.0</td>
                  <td>
                    <span className={`${styles.scoreBadge} ${styles.sbY}`}>≥ 0.75</span>
                  </td>
                </tr>
                <tr>
                  <td>safety_score</td>
                  <td>有害コンテンツがないか</td>
                  <td>0.0〜1.0</td>
                  <td>
                    <span className={`${styles.scoreBadge} ${styles.sbR}`}>≥ 0.95</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>セットアップと実行</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <div className={styles.codeDots}>
                <div className={`${styles.cd} ${styles.red}`} />
                <div className={`${styles.cd} ${styles.yel}`} />
                <div className={`${styles.cd} ${styles.grn}`} />
              </div>
              <span>shell — ADK Eval のインストールと実行</span>
            </div>
            <pre className={`${styles.codeBody} language-bash`}>
              <div className={styles.codeLine}><span className={styles.cmt}># インストール</span></div>
              <div className={styles.codeLine}>pip install google-adk[eval]</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.cmt}># コマンドラインから評価を実行</span></div>
              <div className={styles.codeLine}>adk eval \</div>
              <div className={styles.codeLine}>  --agent_module agents.my_agent \</div>
              <div className={styles.codeLine}>  --eval_set_file evals/eval_set.json \</div>
              <div className={styles.codeLine}>  --output_dir results/</div>
            </pre>
          </div>

          <h3>Python API を使った評価の実装</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <div className={styles.codeDots}>
                <div className={`${styles.cd} ${styles.red}`} />
                <div className={`${styles.cd} ${styles.yel}`} />
                <div className={`${styles.cd} ${styles.grn}`} />
              </div>
              <span>evals/run_eval.py</span>
            </div>
            <pre className={`${styles.codeBody} language-python`}>
              <div className={styles.codeLine}><span className={styles.kw}>import</span> asyncio</div>
              <div className={styles.codeLine}><span className={styles.kw}>from</span> google.adk.evaluation <span className={styles.kw}>import</span> AgentEvaluator</div>
              <div className={styles.codeLine}><span className={styles.kw}>from</span> agents.my_agent <span className={styles.kw}>import</span> root_agent</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.kw}>async def</span> <span className={styles.fn}>run_evaluation</span>():</div>
              <div className={styles.codeLine}>    evaluator = AgentEvaluator(</div>
              <div className={styles.codeLine}>        agent=root_agent,</div>
              <div className={styles.codeLine}>        eval_set_file=<span className={styles.str}>"evals/eval_set.json"</span>,</div>
              <div className={styles.codeLine}>        scorers=[<span className={styles.str}>"tool_call_quality"</span>, <span className={styles.str}>"response_quality"</span>],</div>
              <div className={styles.codeLine}>        model=<span className={styles.str}>"gemini-3-flash-preview"</span>,  <span className={styles.cmt}># コスト最適化モデル</span></div>
              <div className={styles.codeLine}>    )</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>    results = <span className={styles.kw}>await</span> evaluator.evaluate()</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>    print(f<span className={styles.str}>"全体スコア: {"{"}results.overall_score:.2f{"}"}"</span>)</div>
              <div className={styles.codeLine}>    print(f<span className={styles.str}>"ツール呼び出し精度: {"{"}results.scores['tool_call_quality']:.2f{"}"}"</span>)</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>    <span className={styles.cmt}># CI での合否判定</span></div>
              <div className={styles.codeLine}>    <span className={styles.kw}>assert</span> results.scores[<span className={styles.str}>"tool_call_quality"</span>] &gt;= <span className={styles.num}>0.8</span>, \</div>
              <div className={styles.codeLine}>        f<span className={styles.str}>"ツール呼び出し精度が基準値を下回りました: {"{"}results.scores['tool_call_quality']:.2f{"}"}"</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.kw}>if</span> __name__ == <span className={styles.str}>"__main__"</span>:</div>
              <div className={styles.codeLine}>    asyncio.run(run_evaluation())</div>
            </pre>
          </div>

          <h3>ADK Eval の実行フロー</h3>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>ADK Eval 評価フロー</div>
            <div id="diag-5">
              <MermaidDiagram chart={DIAG_5} />
            </div>
          </div>
        </section>

        {/* ── SECTION 6 ── */}
        <section id="s6" className={styles.sec}>
          <div className={styles.secNo}>Section 06</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>06.</span>LLM-as-Judge パターン
          </h2>
          <p>
            <strong>LLM-as-Judge</strong>
            とは、AIエージェントの出力品質を<strong>別のLLMが採点する</strong>パターンです。AIの応答は「意味的に正しいが文字列が一致しない」ことが多いため、通常の{" "}
            <code>assert</code> では検証できません。
          </p>

          <div className={`${styles.info} ${styles.iNote}`}>
            <span className={styles.ii}>💡</span>
            <div>
              <strong>例え話：</strong>
              小学生の作文を採点するとき「正解の文字列と完全一致するか」ではなく「内容の正確性・文章の流れ・誤字脱字」を先生が総合評価しますよね。LLM-as-Judgeも同じ発想で、別のLLMが採点者（Judge）として機能します。
            </div>
          </div>

          <h3>Judge の実装例</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <div className={styles.codeDots}>
                <div className={`${styles.cd} ${styles.red}`} />
                <div className={`${styles.cd} ${styles.yel}`} />
                <div className={`${styles.cd} ${styles.grn}`} />
              </div>
              <span>evals/judges/response_judge.py</span>
            </div>
            <pre className={`${styles.codeBody} language-python`}>
              <div className={styles.codeLine}><span className={styles.kw}>import</span> json</div>
              <div className={styles.codeLine}><span className={styles.kw}>import</span> anthropic</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.kw}>def</span> <span className={styles.fn}>judge_response</span>(</div>
              <div className={styles.codeLine}>    question: str,</div>
              <div className={styles.codeLine}>    actual_response: str,</div>
              <div className={styles.codeLine}>    reference_answer: str,</div>
              <div className={styles.codeLine}>    model: str = <span className={styles.str}>"claude-sonnet-4-6"</span>  <span className={styles.cmt}># 被評価モデルとは別のモデルを使う</span></div>
              <div className={styles.codeLine}>) -&gt; dict:</div>
              <div className={styles.codeLine}>    client = anthropic.Anthropic()</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>    judge_prompt = f<span className={styles.str}>"""あなたはAIエージェントの応答品質を評価する専門家です。</span></div>
              <div className={styles.codeLine}><span className={styles.str}>以下の質問に対するエージェントの応答を0.0〜1.0で採点してください。</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.str}>## 質問</span></div>
              <div className={styles.codeLine}><span className={styles.str}>{"{"}question{"}"}</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.str}>## 参考となる期待応答</span></div>
              <div className={styles.codeLine}><span className={styles.str}>{"{"}reference_answer{"}"}</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.str}>## エージェントの実際の応答</span></div>
              <div className={styles.codeLine}><span className={styles.str}>{"{"}actual_response{"}"}</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.str}>## 採点基準</span></div>
              <div className={styles.codeLine}><span className={styles.str}>- 1.0: 完全に正確で有用</span></div>
              <div className={styles.codeLine}><span className={styles.str}>- 0.8: 概ね正確。軽微な情報の欠落あり</span></div>
              <div className={styles.codeLine}><span className={styles.str}>- 0.6: 部分的に正確。重要な情報の欠落あり</span></div>
              <div className={styles.codeLine}><span className={styles.str}>- 0.0: 完全に誤り、または有害なコンテンツを含む</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.str}>必ずJSON形式のみで回答: {"{"}"score": X.X, "reason": "理由", "improvement": "改善点"{"}"}</span></div>
              <div className={styles.codeLine}><span className={styles.str}>"""</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>    message = client.messages.create(</div>
              <div className={styles.codeLine}>        model=model,</div>
              <div className={styles.codeLine}>        max_tokens=<span className={styles.num}>300</span>,</div>
              <div className={styles.codeLine}>        messages=[{"{"}<span className={styles.str}>"role"</span>: <span className={styles.str}>"user"</span>, <span className={styles.str}>"content"</span>: judge_prompt{"}"}]</div>
              <div className={styles.codeLine}>    )</div>
              <div className={styles.codeLine}>    <span className={styles.kw}>return</span> json.loads(message.content[0].text)</div>
            </pre>
          </div>

          <h3>LLM-as-Judge の3つのパターン</h3>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>LLM-as-Judge のパターン分類</div>
            <div id="diag-6">
              <MermaidDiagram chart={DIAG_6} />
            </div>
          </div>

          <div className={`${styles.info} ${styles.iWarn}`}>
            <span className={styles.ii}>⚠️</span>
            <div>
              <strong>重要：</strong>
              JudgeモデルはテストされるAIエージェントと<strong>異なるモデル</strong>を使うこと。同じモデルが自分を採点すると採点が甘くなります。GeminiエージェントにはClaude、ClaudeエージェントにはGeminiをJudgeとして使うのがベストプラクティスです。
            </div>
          </div>
        </section>

        {/* ── SECTION 7 ── */}
        <section id="s7" className={styles.sec}>
          <div className={styles.secNo}>Section 07</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>07.</span>マルチエージェント評価ハーネス
          </h2>
          <p>
            複数のエージェントが連携するシステム（ADKの SequentialAgent /
            ParallelAgent）では、単一エージェントの評価に加えて<strong>エージェント間の連携品質</strong>も評価する必要があります。
          </p>

          <h3>単一 vs マルチエージェントの評価観点の違い</h3>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>評価観点</th>
                  <th>単一エージェント</th>
                  <th>マルチエージェント</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ツール呼び出し</td>
                  <td>単体の正確性</td>
                  <td>適切なエージェントへの委譲</td>
                </tr>
                <tr>
                  <td>応答品質</td>
                  <td>最終応答</td>
                  <td>各エージェントの中間出力</td>
                </tr>
                <tr>
                  <td>実行経路</td>
                  <td>1つのトレース</td>
                  <td>複数エージェントのトレース連鎖</td>
                </tr>
                <tr>
                  <td>並行性</td>
                  <td>非該当</td>
                  <td>ParallelAgentの出力競合なし</td>
                </tr>
                <tr>
                  <td>コスト</td>
                  <td>1エージェント分</td>
                  <td>エージェント数×コスト</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>マルチエージェント向けハーネス設計</h3>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>マルチエージェント評価ハーネスのアーキテクチャ</div>
            <div id="diag-7">
              <MermaidDiagram chart={DIAG_7} />
            </div>
          </div>

          <div className={`${styles.info} ${styles.iCrit}`}>
            <span className={styles.ii}>🚨</span>
            <div>
              <strong>ParallelAgent の評価における落とし穴：</strong>
              ParallelAgentの各サブエージェントが同じ <code>output_key</code>{" "}
              に書き込むとデータが上書きされます（レースコンディション）。評価ケースでは{" "}
              <code>{"\"expected_output_keys\": [\"frontend_result\", \"backend_result\"]"}</code>{" "}
              のように各エージェントが<strong>異なるキーに書き込むこと</strong>を検証してください。
            </div>
          </div>
        </section>

        {/* ── SECTION 8 ── */}
        <section id="s8" className={styles.sec}>
          <div className={styles.secNo}>Section 08</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>08.</span>フレイキー（不安定）評価への対処
          </h2>
          <p>「今日は通ったが明日は落ちる」という不安定な評価はAIエージェント評価特有の問題です。</p>

          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>原因</th>
                  <th>具体例</th>
                  <th>対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>LLMの確率的出力</td>
                  <td>同じ質問でも違うツールを選ぶ</td>
                  <td>スコア閾値を使い完全一致を避ける</td>
                </tr>
                <tr>
                  <td>モデルのバージョン更新</td>
                  <td>Gemini 3のアップデートで挙動変化</td>
                  <td>モデルバージョンをピン留めする</td>
                </tr>
                <tr>
                  <td>APIレート制限</td>
                  <td>高頻度実行でレート制限エラー</td>
                  <td>リトライ＋指数バックオフを実装</td>
                </tr>
                <tr>
                  <td>評価LLMの変動</td>
                  <td>Judgeとして使うLLMも確率적</td>
                  <td>複数回評価して平均スコアを使う</td>
                </tr>
                <tr>
                  <td>外部APIの状態変化</td>
                  <td>テスト環境のDBデータが変わる</td>
                  <td>ハーミティック環境でDBをリセット</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>スコア安定化のための多数決評価</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <div className={styles.codeDots}>
                <div className={`${styles.cd} ${styles.red}`} />
                <div className={`${styles.cd} ${styles.yel}`} />
                <div className={`${styles.cd} ${styles.grn}`} />
              </div>
              <span>evals/stable_evaluator.py</span>
            </div>
            <pre className={`${styles.codeBody} language-python`}>
              <div className={styles.codeLine}><span className={styles.kw}>from</span> statistics <span className={styles.kw}>import</span> mean, stdev</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.kw}>async def</span> <span className={styles.fn}>stable_evaluate</span>(</div>
              <div className={styles.codeLine}>    evaluator,</div>
              <div className={styles.codeLine}>    query: str,</div>
              <div className={styles.codeLine}>    n_trials: int = <span className={styles.num}>5</span>,  <span className={styles.cmt}># 5回評価して平均を使う</span></div>
              <div className={styles.codeLine}>    threshold: float = <span className={styles.num}>0.75</span></div>
              <div className={styles.codeLine}>) -&gt; dict:</div>
              <div className={styles.codeLine}>    <span className={styles.str}>"""</span></div>
              <div className={styles.codeLine}><span className={styles.str}>    同じクエリをn_trials回評価し、平均・標準偏差でスコアを安定化する。</span></div>
              <div className={styles.codeLine}><span className={styles.str}>    LLMの確率的な出力によるフレイキーを緩和するGoogle推奨の手法。</span></div>
              <div className={styles.codeLine}><span className={styles.str}>    """</span></div>
              <div className={styles.codeLine}>    scores = []</div>
              <div className={styles.codeLine}>    <span className={styles.kw}>for</span> i <span class="kw">in</span> range(n_trials):</div>
              <div className={styles.codeLine}>        result = <span className={styles.kw}>await</span> evaluator.evaluate_single(query)</div>
              <div className={styles.codeLine}>        scores.append(result.score)</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>    avg_score = mean(scores)</div>
              <div className={styles.codeLine}>    score_std = stdev(scores) <span className={styles.kw}>if</span> len(scores) &gt; <span className={styles.num}>1</span> <span className={styles.kw}>else</span> <span className={styles.num}>0.0</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>    <span className={styles.kw}>return</span> <span className={styles.key}>{"{"}</span></div>
              <div className={styles.codeLine}>        <span className={styles.str}>"average_score"</span>: avg_score,</div>
              <div className={styles.codeLine}>        <span className={styles.str}>"std_deviation"</span>: score_std,</div>
              <div className={styles.codeLine}        >        <span className={styles.str}>"is_stable"</span>: score_std &lt; <span className={styles.num}>0.1</span>,  <span className={styles.cmt}># 標準偏差0.1未満を「安定」と判定</span></div>
              <div className={styles.codeLine}        >        <span className={styles.str}>"passes_threshold"</span>: avg_score &gt;= threshold,</div>
              <div className={styles.codeLine}        >        <span className={styles.str}>"all_scores"</span>: scores</div>
              <div className={styles.codeLine}>    <span className={styles.key}>{"}"}</span></div>
            </pre>
          </div>

          <h3>フレイキー評価の検出・対処フロー</h3>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>フレイキー評価 対処フロー</div>
            <div id="diag-8">
              <MermaidDiagram chart={DIAG_8} />
            </div>
          </div>
        </section>

        {/* ── SECTION 9 ── */}
        <section id="s9" className={styles.sec}>
          <div className={styles.secNo}>Section 09</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>09.</span>CIパイプラインへの統合
          </h2>

          <h3>推奨CI設計：段階的実行で失敗を早期検出</h3>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>段階的評価パイプライン</div>
            <div id="diag-9">
              <MermaidDiagram chart={DIAG_9} />
            </div>
          </div>

          <h3>GitHub Actions での設定例</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <div className={styles.codeDots}>
                <div className={`${styles.cd} ${styles.red}`} />
                <div className={`${styles.cd} ${styles.yel}`} />
                <div className={`${styles.cd} ${styles.grn}`} />
              </div>
              <span>.github/workflows/agent-eval.yaml</span>
            </div>
            <pre className={`${styles.codeBody} language-yaml`}>
              <div className={styles.codeLine}><span className={styles.key}>name</span>: <span className={styles.str}>AI Agent Evaluation Pipeline</span></div>
              <div className={styles.codeLine}><span className={styles.key}>on</span>:</div>
              <div className={styles.codeLine}>  <span className={styles.key}>push</span>:</div>
              <div className={styles.codeLine}>    <span className={styles.key}>branches</span>: <span className={styles.key}>[</span><span className={styles.str}>main</span>, <span className={styles.str}>develop</span><span className={styles.key}>]</span></div>
              <div className={styles.codeLine}>  <span className={styles.key}>pull_request</span>:</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.key}>env</span>:</div>
              <div className={styles.codeLine}>  <span className={styles.key}>GOOGLE_API_KEY</span>: <span className={styles.str}>{"${{ secrets.GOOGLE_API_KEY }}"}</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.key}>jobs</span>:</div>
              <div className={styles.codeLine}>  <span className={styles.key}>small-eval</span>:</div>
              <div className={styles.codeLine}>    <span className={styles.key}>name</span>: <span className={styles.str}>"Stage 1: Unit Evaluation (Fake LLM)"</span></div>
              <div className={styles.codeLine}>    <span className={styles.key}>runs-on</span>: <span className={styles.str}>ubuntu-latest</span></div>
              <div className={styles.codeLine}>    <span className={styles.key}>steps</span>:</div>
              <div className={styles.codeLine}>      - <span className={styles.key}>uses</span>: <span className={styles.str}>actions/checkout@v4</span></div>
              <div className={styles.codeLine}>      - <span className={styles.key}>uses</span>: <span className={styles.str}>actions/setup-python@v5</span></div>
              <div className={styles.codeLine}>        <span className={styles.key}>with</span>: <span className={styles.key}>{"{ python-version: '3.12' }"}</span></div>
              <div className={styles.codeLine}>      - <span className={styles.key}>run</span>: <span className={styles.str}>pip install google-adk[eval] pytest</span></div>
              <div className={styles.codeLine}>      - <span className={styles.key}>name</span>: <span className={styles.str}>Run small evaluations</span></div>
              <div className={styles.codeLine}>        <span className={styles.key}>run</span>: |</div>
              <div className={styles.codeLine}>          pytest evals/small/ -m <span className={styles.str}>"small_eval"</span> --timeout=30 -v</div>
              <div className={styles.codeLine}>        <span className={styles.key}>env</span>:</div>
              <div className={styles.codeLine}>          <span className={styles.key}>USE_FAKE_LLM</span>: <span className={styles.str}>"true"</span>  <span className={styles.cmt}># フェイクLLMを使用</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>  <span className={styles.key}>medium-eval</span>:</div>
              <div className={styles.codeLine}>    <span className={styles.key}>name</span>: <span className={styles.str}>"Stage 2: Integration Evaluation (Flash Model)"</span></div>
              <div className={styles.codeLine}>    <span className={styles.key}>runs-on</span>: <span className={styles.str}>ubuntu-latest</span></div>
              <div className={styles.codeLine}>    <span className={styles.key}>needs</span>: <span className={styles.str}>small-eval</span>  <span className={styles.cmt}># Stage 1 通過後のみ実行</span></div>
              <div className={styles.codeLine}>    <span className={styles.key}>steps</span>:</div>
              <div className={styles.codeLine}>      - <span className={styles.key}>uses</span>: <span className={styles.str}>actions/checkout@v4</span></div>
              <div className={styles.codeLine}>      - <span className={styles.key}>uses</span>: <span className={styles.str}>actions/setup-python@v5</span></div>
              <div className={styles.codeLine}>        <span className={styles.key}>with</span>: <span className={styles.key}>{"{ python-version: '3.12' }"}</span></div>
              <div className={styles.codeLine}>      - <span className={styles.key}>run</span>: <span className={styles.str}>pip install google-adk[eval]</span></div>
              <div className={styles.codeLine}>      - <span className={styles.key}>name</span>: <span className={styles.str}>Run medium evaluations</span></div>
              <div className={styles.codeLine}>        <span className={styles.key}>run</span>: |</div>
              <div className={styles.codeLine}>          adk eval \</div>
              <div className={styles.codeLine}>            --agent_module agents.root_agent \</div>
              <div className={styles.codeLine}>            --eval_set_file evals/medium/eval_set.json \</div>
              <div className={styles.codeLine}>            --model gemini-3-flash-preview \</div>
              <div className={styles.codeLine}>            --threshold <span className={styles.num}>0.75</span> \</div>
              <div className={styles.codeLine}>            --output_dir results/medium/</div>
              <div className={styles.codeLine}>        <span className={styles.key}>timeout-minutes</span>: <span className={styles.num}>10</span></div>
            </pre>
          </div>

          <h3>コスト最適化戦略</h3>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>戦略</th>
                  <th>削減効果</th>
                  <th>実装方法</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>フェイクLLMでSmallテスト</td>
                  <td>APIコスト 0円</td>
                  <td>
                    <code>FakeLlm</code> クラスを使用
                  </td>
                </tr>
                <tr>
                  <td>安価なモデルでMediumテスト</td>
                  <td>コスト90%削減</td>
                  <td>
                    <code>gemini-3-flash-preview</code> を使用
                  </td>
                </tr>
                <tr>
                  <td>変更影響テストのみ実行</td>
                  <td>実行数50%削減</td>
                  <td>
                    <code>pytest-testmon</code> / 変更検出
                  </td>
                </tr>
                <tr>
                  <td>Recording/Replay</td>
                  <td>繰り返しコスト 0円</td>
                  <td>VCRカセットで録画・再生</td>
                </tr>
                <tr>
                  <td>評価キャッシュ</td>
                  <td>同一クエリのコスト 0円</td>
                  <td>
                    <code>diskcache</code> でキャッシュ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SECTION 10 ── */}
        <section id="s10" className={styles.sec}>
          <div className={styles.secNo}>Section 10</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>10.</span>ベストプラクティス 10則 &amp; チェックリスト
          </h2>

          <div className={styles.bpGrid}>
            <div className={`${styles.bp} ${styles.bpG}`}>
              <div className={styles.bpn}>01</div>
              <h4>Small テストを最大化する</h4>
              <p>
                フェイクLLMを使いユニット評価を全体の70%以上に。高速・低コストで設計ミスを早期発見。
              </p>
            </div>
            <div className={`${styles.bp} ${styles.bpB}`}>
              <div className={styles.bpn}>02</div>
              <h4>評価データはコードと分離する</h4>
              <p>JSON/YAMLの評価セットをGit管理。評価観点の変更にコード変更不要。</p>
            </div>
            <div className={`${styles.bp} ${styles.bpY}`}>
              <div className={styles.bpn}>03</div>
              <h4>完全一致より閾値スコアを使う</h4>
              <p>LLMの確率的な出力に対応。<code>score &gt;= 0.8</code> のような基準を設定。</p>
            </div>
            <div className={`${styles.bp} ${styles.bpR}`}>
              <div className={styles.bpn}>04</div>
              <h4>ハーミティック環境を維持する</h4>
              <p>各テストでDBリセット・フェイクAPI使用。テスト間の干渉・環境依存を排除。</p>
            </div>
            <div className={`${styles.bp} ${styles.bpP}`}>
              <div className={styles.bpn}>05</div>
              <h4>安全性テストは必ず別途実施</h4>
              <p>
                有害コンテンツ・プロンプトインジェクションを専用ケースで検証。閾値 ≥ 0.95 を守る。
              </p>
            </div>
            <div className={`${styles.bp} ${styles.bpC}`}>
              <div className={styles.bpn}>06</div>
              <h4>Judgeモデルは被評価モデルと変える</h4>
              <p>
                Geminiエージェントの評価にClaudeを使うなど。同じモデルが自分を採点すると甘くなる。
              </p>
            </div>
            <div className={`${styles.bp} ${styles.bpG}`}>
              <div className={styles.bpn}>07</div>
              <h4>フレイキー評価をその日に直す</h4>
              <p>
                検出したら隔離（Quarantine）→1営業日以内に対処。放置すると「赤を無視する文化」が生まれる。
              </p>
            </div>
            <div className={`${styles.bp} ${styles.bpB}`}>
              <div className={styles.bpn}>08</div>
              <h4>モデルバージョンをピン留めする</h4>
              <p>
                <code>gemini-3-flash-preview-20261001</code>{" "}
                のようにバージョンを固定。モデル更新で評価結果が変わるのを防ぐ。
              </p>
            </div>
            <div className={`${styles.bp} ${styles.bpY}`}>
              <div className={styles.bpn}>09</div>
              <h4>評価ケースに「なぜ」を書く</h4>
              <p>
                <code>"name": "malicious_sql_injection_resistance"</code>{" "}
                のように命名。将来のメンテナーが意図を理解できる。
              </p>
            </div>
            <div className={`${styles.bp} ${styles.bpR}`}>
              <div className={styles.bpn}>10</div>
              <h4>評価スコアの推移をグラフ化する</h4>
              <p>
                Allure Report / Grafana でスコア時系列を可視化。リグレッションをリリース前に検出。
              </p>
            </div>
          </div>

          <h3>リリース前チェックリスト</h3>
          <Checklist />

          <h3>まとめ — ハーネスエンジニアリングの全体像</h3>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>Googleエージェント評価ハーネス — 全体構造</div>
            <div id="diag-10">
              <MermaidDiagram chart={DIAG_10} />
            </div>
          </div>
        </section>

        {/* ── SECTION 11 ── */}
        <section id="s11" className={styles.sec}>
          <div className={styles.secNo}>Section 11</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>11.</span>参考ソース一覧
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            以下はすべてGoogleが公式に公開しているソース、またはGoogleエンジニアが著した一次情報です。
          </p>

          <div className={styles.sources}>
            <div className={styles.src}>
              <span className={styles.snum}>[1]</span>
              <div>
                <Ext href="https://google.github.io/adk-docs/evaluate/">
                  ADK Evaluation Guide — Google ADK 公式ドキュメント
                </Ext>
                <span className={styles.sdesc}>
                  ADK Eval の全仕様。評価セット・Scorers・Python API・コマンドラインの公式リファレンス
                </span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[2]</span>
              <div>
                <Ext href="https://abseil.io/resources/swe-book">
                  Software Engineering at Google (O'Reilly, 2020) — Chapter 11〜14 テスト関連
                </Ext>
                <span className={styles.sdesc}>
                  Small/Medium/Large分類・フレイキーテスト対策・テストダブルの設計思想の原典
                </span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[3]</span>
              <div>
                <Ext href="https://testing.googleblog.com">
                  Google Testing Blog — 公式テスト技術ブログ
                </Ext>
                <span className={styles.sdesc}>Googleエンジニアによるテスト技術の最新情報</span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[4]</span>
              <div>
                <Ext href="https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html">
                  Just Say No to More End-to-End Tests — Google Testing Blog
                </Ext>
                <span className={styles.sdesc}>
                  テストピラミッドの重要性・E2Eテスト過多の問題を解説
                </span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[5]</span>
              <div>
                <Ext href="https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html">
                  Flaky Tests at Google and How We Mitigate Them
                </Ext>
                <span className={styles.sdesc}>
                  Googleのフレイキーテスト検出・隔離・解決のプロセスの詳細
                </span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[6]</span>
              <div>
                <Ext href="https://google.github.io/adk-docs/agents/multi-agents/">
                  ADK Multi-agent Systems — Google ADK 公式ドキュメント
                </Ext>
                <span className={styles.sdesc}>
                  SequentialAgent / ParallelAgent / LoopAgent の仕様と output_key 設計
                </span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[7]</span>
              <div>
                <Ext href="https://github.com/google/adk-python">
                  Google ADK GitHub リポジトリ
                </Ext>
                <span className={styles.sdesc}>
                  ADK Python のソースコード・評価フレームワーク実装
                </span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[8]</span>
              <div>
                <Ext href="https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/">
                  Developers Guide to Multi-Agent Patterns in ADK — Google Developers Blog
                </Ext>
                <span className={styles.sdesc}>
                  AutoFlowルーティング・output_key管理・description設計のベストプラクティス
                </span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[9]</span>
              <div>
                <Ext href="https://codelabs.developers.google.com/codelabs/production-ready-ai-with-gc/3-developing-agents/build-a-multi-agent-system-with-adk">
                  Build a Multi-Agent System with ADK — Google Codelabs
                </Ext>
                <span className={styles.sdesc}>
                  SequentialAgent / LoopAgent のハンズオン実装と評価
                </span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[10]</span>
              <div>
                <Ext href="https://testing.googleblog.com/2012/10/hermetic-servers.html">
                  Hermetic Servers — Google Testing Blog
                </Ext>
                <span className={styles.sdesc}>
                  ハーミティックテストの設計思想と実装パターン
                </span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[11]</span>
              <div>
                <Ext href="https://sre.google/sre-book/testing-reliability/">
                  Site Reliability Engineering (SRE Book) — Chapter 17 Testing
                </Ext>
                <span className={styles.sdesc}>
                  Google SRE が実践するテスト信頼性向上手法（無料公開）
                </span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[12]</span>
              <div>
                <Ext href="https://testing.googleblog.com/2019/12/testing-on-toilet-tests-too-dry-make.html">
                  DAMP vs DRY in Tests — Google Testing Blog
                </Ext>
                <span className={styles.sdesc}>
                  テストコードは可読性を優先するDAMP原則の解説
                </span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[13]</span>
              <div>
                <Ext href="https://cloud.google.com/build/docs">
                  Google Cloud Build ドキュメント
                </Ext>
                <span className={styles.sdesc}>
                  隔離されたCI環境でのエージェント評価パイプライン構築
                </span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[14]</span>
              <div>
                <Ext href="https://ai.google.dev/gemini-api/docs/deprecations">
                  Gemini API Deprecation Schedule
                </Ext>
                <span className={styles.sdesc}>
                  モデルバージョンのピン留め判断に必要な廃止スケジュール
                </span>
              </div>
            </div>
            <div className={styles.src}>
              <span className={styles.snum}>[15]</span>
              <div>
                <Ext href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/">
                  Gemini 3.1 Pro リリースアナウンス — Google Blog
                </Ext>
                <span className={styles.sdesc}>
                  Gemini 3.1 Pro Preview の性能・評価用途での活用方法
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Gemini Harness Engineering</div>
        <p>
          Google ADK v1.x / Gemini CLI v0.34.0 / ADK Eval — AIエージェント
          ハーネスエンジニアリング完全ガイド
        </p>
        <p style={{ marginTop: "6px", fontSize: "0.7rem", opacity: 0.6 }}>
          最終更新: 2026年5月 ｜ Google ADK 公式ドキュメント・Google Testing Blog 準拠
        </p>
      </footer>
    </>
  );
}
