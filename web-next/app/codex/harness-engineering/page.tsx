import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "OpenAI Codexにおけるハーネスエンジニアリング実践ガイド | LLM Study",
  description:
    "自己採点(Layer 1)から標準ベンチマーク(Layer 6)・セキュリティ評価(Layer 7)まで、Codex向け評価基盤の7層モデルと実装パターンを詳細解説。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_1 = `flowchart TB
    A["Layer 1: セッション内自己検証<br/>(Ralph Wiggum Loop)"] --> B["Layer 2: リポジトリの<br/>メカニカル強制"]
    B --> C["Layer 3: ランタイム<br/>オブザーバビリティ検証"]
    C --> D["Layer 4: CI/CD 非対話型<br/>品質ゲート (codex exec)"]
    D --> E["Layer 5: プラットフォーム Evals<br/>(Traces→Graders→Datasets)"]
    E --> F["Layer 6: 外部標準ベンチマーク<br/>(SWE-bench / Terminal-Bench)"]
    F --> G["Layer 7: 継続的セキュリティ評価<br/>(Codex Security CLI)"]`;

const DIAGRAM_2 = `sequenceDiagram
    participant Eng as エンジニア
    participant Codex as Codexエージェント
    participant Local as ローカル自己レビュー
    participant Cloud as クラウドエージェントレビュー
    participant PR as プルリクエスト

    Eng->>Codex: タスクをプロンプトで指示
    Codex->>Codex: 変更を実装
    Codex->>Local: 自分の変更をローカルでレビュー依頼
    Local-->>Codex: フィードバックを返却
    Codex->>Cloud: 追加のエージェントレビューを要求
    Cloud-->>Codex: 指摘事項を返却
    Codex->>Codex: フィードバックへ対応し修正
    Codex->>PR: 全レビュアーが満足するまでループ後PRを作成
    PR-->>Eng: 人間レビューは任意(必須ではない)`;

const DIAGRAM_3 = `flowchart LR
    Types["Types"] --> Config["Config"]
    Config --> Repo["Repo"]
    Repo --> Service["Service"]
    Utils["Utils"] --> Providers["Providers"]
    Providers --> Service
    Service --> Runtime["Runtime"]
    Runtime --> UI["UI"]`;

const DIAGRAM_4 = `flowchart LR
    App["アプリ (worktreeごとに起動)"] -->|"ログ/メトリクス/トレース"| Vector["Vector"]
    Vector --> Logs["Victoria Logs (LogQL)"]
    Vector --> Metrics["Victoria Metrics (PromQL)"]
    Vector --> Traces["Victoria Traces (TraceQL)"]
    Logs --> Codex["Codexが問い合わせ・相関分析"]
    Metrics --> Codex
    Traces --> Codex
    Codex --> Fix["修正を実装"]
    Fix --> Restart["アプリを再起動"]
    Restart --> Rerun["ワークロード/UIシナリオを再実行"]
    Rerun --> App`;

const DIAGRAM_5 = `flowchart TB
    PR["プルリクエスト作成/更新"] --> Action["openai/codex-action (GitHub Action)"]
    Action --> Exec["codex exec --sandbox read-only --output-schema"]
    Exec --> Schema["JSON Schema準拠の構造化出力<br/>(severity / issues / summary)"]
    Schema --> Gate{"重大度しきい値を超えるか?"}
    Gate -->|"Yes"| Block["マージをブロックし修正を要求"]
    Gate -->|"No"| Merge["自動マージ or 人間レビューへ"]`;

const DIAGRAM_6 = `flowchart LR
    Traces["Traces<br/>(モデル呼び出し/ツール呼び出し/ハンドオフの記録)"] --> Graders["Graders<br/>(string_check/python/score_model等)"]
    Graders --> Datasets["Datasets<br/>(代表的ケースを蓄積)"]
    Datasets --> Runs["Eval Runs<br/>(プロンプト/モデル比較)"]
    Runs --> Improve["プロンプト・ツール構成・ルーティングを改善"]
    Improve --> Traces`;

const DIAGRAM_7 = `flowchart TB
    Suite["Terminal-Bench 2.0<br/>(89タスク・コンテナ隔離)"] --> Harbor["Harbor評価ハーネス<br/>(クラウド並列ロールアウト)"]
    Harbor --> Agents["Codex CLI / Claude Code / 他エージェント"]
    Agents --> Verify["コンテナ内Verifierが合否判定"]
    Verify --> Board["リーダーボード集計"]
    Board --> Decision["自社ハーネスのモデル/設定選定に反映"]`;

export default function Page() {
  return (
    <div className={styles.layout}>
      <div className={styles.topBar} />
      <div className={styles.bgGlow} />

      <TocObserver />

      <div className={styles.pageContainer}>
        {/* Mobile Toggle */}
        <button type="button" className={styles.sidebarToggle} id="sidebarToggle">
          📋 目次を表示
        </button>

        {/* Sidebar */}
        <aside className={styles.sidebar} id="sidebar">
          <div className={styles.sidebarInner}>
            <div className={styles.tocHeader}>
              <span>目次</span>
            </div>
            <ul className={styles.tocList}>
              <li className={styles.tocItem}>
                <a href="#sec-1" className={styles.tocLink}>
                  1. はじめに — なぜ評価基盤が核心なのか
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-2" className={styles.tocLink}>
                  2. ハーネスエンジニアリングとは何か
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-3" className={styles.tocLink}>
                  3. なぜ評価が継続的でなければならないのか
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-4" className={styles.tocLink}>
                  4. 評価基盤の7層モデル — 詳細解説
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-5" className={styles.tocLink}>
                  5. ステップバイステップ実装ガイド
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-6" className={styles.tocLink}>
                  6. ハーネス成熟度チェックリスト
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-7" className={styles.tocLink}>
                  7. アンチパターン
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-8" className={styles.tocLink}>
                  8. まとめ
                </a>
              </li>
              <li className={styles.tocItem}>
                <a href="#sec-9" className={styles.tocLink}>
                  9. 参考文献
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {/* Hero */}
          <header className={styles.hero}>
            <div className={styles.heroTag}>OpenAI Codex Architecture</div>
            <h1 className={styles.heroTitle}>
              OpenAI Codexにおけるハーネスエンジニアリング実践ガイド
            </h1>
            <p className={styles.heroLead}>
              自己採点(Layer 1)から標準ベンチマーク(Layer 6)・セキュリティ評価(Layer 7)まで、
              Codex向け評価基盤の7層モデルと非対話型CI/CD統合(codex exec)の実装パターンを完全網羅。
            </p>
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>対象モデル</span>
                <span className={styles.metaValue}>GPT-5.1-Codex-Max / Codex CLI</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>評価フレームワーク</span>
                <span className={styles.metaValue}>OpenAI Evals / Terminal-Bench 2.0</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>更新日</span>
                <span className={styles.metaValue}>2026-08-10</span>
              </div>
            </div>
          </header>

          {/* Section 1 */}
          <section className={styles.chapter} id="sec-1">
            <h2>1. はじめに — なぜ評価基盤がハーネスエンジニアリングの核心なのか</h2>
            <p>
              AIコーディングエージェントの運用において、最も致命的な誤解は「優秀なモデルを選び、適切なプロンプトを与えれば、エージェントは正しくコードを書く」という幻想である。実際のソフトウェア開発において、モデルの単体能力(Intelligence)は成功の半分に過ぎない。残りの半分を支配するのが「ハーネスエンジニアリング(Harness
              Engineering)」——すなわち、エージェントを取り囲み、その出力を機械的に検証し、逸脱を補正し、品質を継続測定するインフラの設計である。
            </p>
            <p>
              2026年現在、OpenAIが推進するCodex CLIアーキテクチャや、GitHub Copilot、Claude
              Codeといった先端ツールキットは、いずれも「評価(Evals)を中心としたハーネス」を第一級の市民として扱っている。本ガイドでは、OpenAIが自社開発の実証実験で得た知見をもとに、Codexにおける評価基盤の7層モデル、非対話型実行(codex
              exec)による品質ゲート構築、および実用に耐えるテスト評価の実装パターンを徹底的に解説する。
            </p>
          </section>

          {/* Section 2 */}
          <section className={styles.chapter} id="sec-2">
            <h2>2. ハーネスエンジニアリングとは何か</h2>
            <h3>2.1 コンテキストエンジニアリングとの対比</h3>
            <p>
              「コンテキストエンジニアリング」が問う問いは「エージェントに何を見せるべきか」であるのに対し、「ハーネスエンジニアリング」が問う問いは「システムは何を防ぎ、何を測定し、何を修正すべきか」である。前者がインプット側の設計だとすれば、後者はアウトプットの検証・強制・フィードバックの設計だと言える。両者は排他的ではなく、実際には積層する関係にある。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_1} />
            </div>
            <p>
              この7層モデルは、評価がかかる範囲の「近さ」で並べたものである。Layer
              1はエージェント自身がその場で行う自己採点、Layer
              7は業界全体で共有される外部標準に基づく評価であり、下に行くほど客観性は増すがフィードバックは遅くなる。優れたハーネスは、この全レイヤーを同時に運用し、速いフィードバック(Layer
              1〜2)で日々の逸脱を潰しながら、遅いフィードバック(Layer
              5〜7)で長期的な方向性を検証する。
            </p>
            <h3>2.2 OpenAIの実証実験が示した構造</h3>
            <p>
              Ryan
              Lopopolo氏の報告によれば、2025年8月末に空のGitリポジトリへの最初のコミットが行われ、リポジトリ構造・CI設定・フォーマットルール・パッケージマネージャ設定・アプリケーションフレームワークに至るまで、初期スキャフォールド自体がCodex
              CLI(GPT-5使用)によって生成された。5ヶ月後、リポジトリは約100万行規模となり、3人だったチームは7人に拡大したが、1人あたりのPRスループットはむしろ増加した。同記事はこの体制を「Humans
              steer. Agents execute.」という一言で要約している。
            </p>
            <p>
              重要なのは、エージェントが生成した成果物には「プロダクトコードとテスト」だけでなく、「CI設定とリリースツール」「内部開発者ツール」「ドキュメントと設計履歴」、そして本ガイドの主題である評価ハーネス(Evaluation
              harnesses)自体が含まれていたと明記されている点である。つまりOpenAI自身の実験においても、評価基盤はエージェントが自ら構築・改良する対象として扱われていた。
            </p>
            <p>
              参考:{" "}
              <Ext href="https://openai.com/index/harness-engineering/">
                Harness engineering: leveraging Codex in an agent-first world (openai.com)
              </Ext>
            </p>
          </section>

          {/* Section 3 */}
          <section className={styles.chapter} id="sec-3">
            <h2>3. なぜ評価が継続的でなければならないのか</h2>
            <p>
              従来のシステム開発におけるテストは「機能が正しく動作するか」を二元論(Pass/Fail)で確認するものであった。しかし、確率的な挙動を示すLLMエージェントにおいては、単一のテスト成功は「たまたまうまく行った」可能性を排除できない。エージェント開発において評価が継続的(Continuous
              Evals)でなければならない理由は主に3つある。
            </p>

            <div className={styles.callout}>
              <div className={styles.calloutTitle}>継続的評価の3大必要性</div>
              <ul>
                <li>
                  <strong>モデル更新によるサイレント劣化の検知:</strong>{" "}
                  OpenAIやAnthropicが提供する基盤モデルは定期的にアップデートされる。モデルバージョンが同一であってもAPIのバックエンド最適化により挙動が微変することがあり、固定評価セットによる回帰テストが不可欠である。
                </li>
                <li>
                  <strong>プロンプト・ツールの変更影響の可視化:</strong>{" "}
                  システムプロンプトの1行の変更や新しいMCPツールの追加が、意図しないドメインでのタスク成功率を下げる事態を防ぐ。
                </li>
                <li>
                  <strong>無人ループにおける逸脱の早期ブロック:</strong> codex
                  exec等で夜間・自動PR生成を運用する場合、評価ゲートが存在しなければ低品質なコードや潜在バグがリポジトリを破壊する。
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.chapter} id="sec-4">
            <h2>4. 評価基盤の7層モデル — 詳細解説</h2>

            {/* 4.1 */}
            <h3>4.1 Layer 1: セッション内自己検証 (Ralph Wiggum Loop)</h3>
            <p>
              もっとも速いフィードバックは、エージェント自身がその場で行う自己レビューである。OpenAIのハーネスでは、Codexに対して「自分の変更をローカルでレビューし、ローカル/クラウド双方で追加のエージェントレビューを要求し、人間またはエージェントからのフィードバックに対応し、すべてのレビュアーが満足するまでループする」ことを指示している。この反復パターンは、Geoffrey
              Huntley氏が命名した「Ralph Wiggum Loop」(単純な{" "}
              <code>while :; do cat PROMPT.md | agent; done</code>{" "}
              型のループ)の一種として、OpenAIの記事内でも明示的に言及されている。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_2} />
            </div>

            {/* 4.2 */}
            <h3>4.2 Layer 2: リポジトリレベルのメカニカル強制</h3>
            <p>
              Layer 1は「本人任せ」の評価だが、Layer
              2は「構造そのものが逸脱を許さない」設計である。OpenAIのハーネスでは、各ビジネスドメインを固定の層(Types
              → Config → Repo → Providers → Service → Runtime →
              UI)に分割し、依存方向を厳格に制限している。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_3} />
            </div>
            <p>
              この依存方向は人間のレビューではなく、Codex自身が生成したカスタムLinterと構造テストによって機械的に強制される。Lintのエラーメッセージには、その場でエージェントへ是正手順を注入できるよう、修復手順そのものが埋め込まれている点が実務上のポイントである。
            </p>

            {/* 4.3 */}
            <h3>4.3 Layer 3: ランタイム・オブザーバビリティによる実行時検証</h3>
            <p>
              静的な構造チェックだけでは「動くかどうか」は分からない。OpenAIのハーネスは、ログ・メトリクス・トレースをVectorで収集し、Victoria
              Logs / Victoria Metrics / Victoria
              Tracesへファンアウトするローカル観測可能性スタックを、git
              worktreeごとにエフェメラルに立ち上げている。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_4} />
            </div>

            {/* 4.4 */}
            <h3>4.4 Layer 4: CI/CDにおける非対話型品質ゲート (codex exec)</h3>
            <p>
              Codex CLIには <code>codex exec</code>{" "}
              という非対話モードが用意されており、対話TUIを開かずにスクリプトやCIジョブから起動できる。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_5} />
            </div>

            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>フラグ / 環境変数</th>
                    <th>用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>codex exec "&lt;task&gt;"</code>
                    </td>
                    <td>
                      非対話モードでタスクを1回実行し、標準エラーへ進捗、標準出力へ最終メッセージを出す
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>--json</code>
                    </td>
                    <td>JSONLストリーム形式で全アクティビティログを出力する</td>
                  </tr>
                  <tr>
                    <td>
                      <code>--output-schema &lt;file.json&gt;</code>
                    </td>
                    <td>最終応答メッセージを特定JSON Schemaに強制準拠させる</td>
                  </tr>
                  <tr>
                    <td>
                      <code>CODEX_API_KEY</code>
                    </td>
                    <td>CI/CD環境専用のAPIキー指定環境変数</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4.5 */}
            <h3>4.5 Layer 5: プラットフォーム Evals (Traces → Graders → Datasets)</h3>
            <p>
              OpenAI
              PlatformのEvals機能は、Agentの試行結果を構造化データとして集積・採点する仕組みを提供する。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_6} />
            </div>

            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>グレーダー種類</th>
                    <th>判定方法</th>
                    <th>適したケース</th>
                    <th>出力</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>string_check</code>
                    </td>
                    <td>
                      <code>eq</code> / <code>like</code> による文字列比較
                    </td>
                    <td>決定的な正解文字列がある場合</td>
                    <td>0 または 1</td>
                  </tr>
                  <tr>
                    <td>
                      <code>text_similarity</code>
                    </td>
                    <td>
                      <code>bleu</code> / <code>rouge_l</code> 類似度指標
                    </td>
                    <td>意味的に近い正解がある場合</td>
                    <td>0.0〜1.0</td>
                  </tr>
                  <tr>
                    <td>
                      <code>python</code>
                    </td>
                    <td>
                      Pythonコードを実行し <code>grade</code> 関数の戻り値で採点
                    </td>
                    <td>テスト結果・静的解析結果</td>
                    <td>数値</td>
                  </tr>
                  <tr>
                    <td>
                      <code>score_model</code>
                    </td>
                    <td>LLMにスコアを付けさせる</td>
                    <td>設計妥当性などの主観的評価</td>
                    <td>0.0〜1.0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4.6 */}
            <h3>
              4.6 Layer 6: 外部標準ベンチマーク — SWE-bench VerifiedとTerminal-Bench 2.0 / Harbor
            </h3>
            <p>
              自社ハーネス内部の評価だけでなく、SWE-bench VerifiedやTerminal-Bench
              2.0等の業界標準ベンチマークを利用してエージェントの客観的実力を測定する。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_7} />
            </div>

            {/* 4.7 */}
            <h3>4.7 Layer 7: 継続的セキュリティ評価 (Codex Security CLI)</h3>
            <p>
              静的解析と動的検証に加え、Codex Security
              CLIやSASTツールを活用して、脆弱性・秘密情報の混入・不適切な権限昇格を継続的に自動監査する。
            </p>
          </section>

          {/* Section 5 */}
          <section className={styles.chapter} id="sec-5">
            <h2>5. ステップバイステップ実装ガイド</h2>
            <p>
              以下は、実際に <code>codex exec</code> と JSON Schema、GitHub Actions
              を組み合わせて非対話型コード品質ゲートを構築する実装例である。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeHeader}>
                <span>eval_schema.json</span>
                <span>JSON Schema</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.ck}>&quot;$schema&quot;</span>:{" "}
                  <span className={styles.cs}>
                    &quot;http://json-schema.org/draft-07/schema#&quot;
                  </span>
                  ,
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.ck}>&quot;type&quot;</span>:{" "}
                  <span className={styles.cs}>&quot;object&quot;</span>,
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.ck}>&quot;properties&quot;</span>:{" "}
                  <span className={styles.cs}>&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.ck}>&quot;passed&quot;</span>:{" "}
                  <span className={styles.cs}>
                    &#123; &quot;type&quot;: &quot;boolean&quot; &#125;
                  </span>
                  ,
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.ck}>&quot;score&quot;</span>:{" "}
                  <span className={styles.cs}>
                    &#123; &quot;type&quot;: &quot;number&quot;, &quot;minimum&quot;: 0,
                    &quot;maximum&quot;: 100 &#125;
                  </span>
                  ,
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.ck}>&quot;issues&quot;</span>:{" "}
                  <span className={styles.cs}>&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.ck}>&quot;type&quot;</span>:{" "}
                  <span className={styles.cs}>&quot;array&quot;</span>,
                </div>
                <div className={styles.codeLine}>
                  {"      "}
                  <span className={styles.ck}>&quot;items&quot;</span>:{" "}
                  <span className={styles.cs}>
                    &#123; &quot;type&quot;: &quot;string&quot; &#125;
                  </span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.cs}>&#125;</span>
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.cs}>&#125;</span>,
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.ck}>&quot;required&quot;</span>: [
                  <span className={styles.cs}>&quot;passed&quot;</span>,{" "}
                  <span className={styles.cs}>&quot;score&quot;</span>,{" "}
                  <span className={styles.cs}>&quot;issues&quot;</span>]
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>&#125;</span>
                </div>
              </div>
            </div>

            <div className={styles.codeWrap}>
              <div className={styles.codeHeader}>
                <span>.github/workflows/codex-eval.yml</span>
                <span>YAML</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>name:</span>{" "}
                  <span className={styles.cs}>Codex Quality Gate</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>on:</span> [
                  <span className={styles.cs}>pull_request</span>]
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>jobs:</span>
                </div>
                <div className={styles.codeLine}>
                  {"  "}
                  <span className={styles.ck}>eval:</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.ck}>runs-on:</span>{" "}
                  <span className={styles.cs}>ubuntu-latest</span>
                </div>
                <div className={styles.codeLine}>
                  {"    "}
                  <span className={styles.ck}>steps:</span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}- <span className={styles.ck}>uses:</span>{" "}
                  <span className={styles.cs}>actions/checkout@v4</span>
                </div>
                <div className={styles.codeLine}>
                  {"      "}- <span className={styles.ck}>name:</span>{" "}
                  <span className={styles.cs}>Run Codex Eval Gate</span>
                </div>
                <div className={styles.codeLine}>
                  {"        "}
                  <span className={styles.ck}>env:</span>
                </div>
                <div className={styles.codeLine}>
                  {"          "}
                  <span className={styles.ck}>CODEX_API_KEY:</span>{" "}
                  <span className={styles.cv}>
                    $&#123;&#123; secrets.CODEX_API_KEY &#125;&#125;
                  </span>
                </div>
                <div className={styles.codeLine}>
                  {"        "}
                  <span className={styles.ck}>run:</span> <span className={styles.cs}>|</span>
                </div>
                <div className={styles.codeLine}>
                  {"          "}
                  <span className={styles.cs}>npm install -g @openai/codex</span>
                </div>
                <div className={styles.codeLine}>
                  {"          "}
                  <span className={styles.cs}>
                    codex exec &quot;Review diff against main and check for harness rules&quot; \
                  </span>
                </div>
                <div className={styles.codeLine}>
                  {"            "}
                  <span className={styles.cs}>--sandbox read-only \</span>
                </div>
                <div className={styles.codeLine}>
                  {"            "}
                  <span className={styles.cs}>
                    --output-schema eval_schema.json &gt; result.json
                  </span>
                </div>
                <div className={styles.codeLine}>
                  {"          "}
                  <span className={styles.cs}>cat result.json</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className={styles.chapter} id="sec-6">
            <h2>6. ハーネス成熟度チェックリスト</h2>
            <p>プロジェクトにおけるハーネスエンジニアリングの導入度を測るチェックリストである。</p>

            <ul className={styles.checklistGrid}>
              <li className={styles.checklistItem}>
                <input type="checkbox" id="c1" defaultChecked />
                <label htmlFor="c1">
                  <strong>Layer 1:</strong> AGENTS.md / SKILL.md に自己レビュー手順が明記されている
                </label>
              </li>
              <li className={styles.checklistItem}>
                <input type="checkbox" id="c2" defaultChecked />
                <label htmlFor="c2">
                  <strong>Layer 2:</strong> 依存方向や命名規則がカスタムLintで機械強制されている
                </label>
              </li>
              <li className={styles.checklistItem}>
                <input type="checkbox" id="c3" defaultChecked />
                <label htmlFor="c3">
                  <strong>Layer 3:</strong>{" "}
                  ローカルで観測可能性スタック(Vector/Victoria)を自動起動できる
                </label>
              </li>
              <li className={styles.checklistItem}>
                <input type="checkbox" id="c4" defaultChecked />
                <label htmlFor="c4">
                  <strong>Layer 4:</strong> CI上で codex exec を用いた非対話型レビューが稼働している
                </label>
              </li>
              <li className={styles.checklistItem}>
                <input type="checkbox" id="c5" />
                <label htmlFor="c5">
                  <strong>Layer 5:</strong>{" "}
                  プラットフォームEvalsでプロンプト変更の回帰を追跡している
                </label>
              </li>
              <li className={styles.checklistItem}>
                <input type="checkbox" id="c6" />
                <label htmlFor="c6">
                  <strong>Layer 6:</strong>{" "}
                  SWE-bench等の標準タスクで定期的にベンチマークを実施している
                </label>
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className={styles.chapter} id="sec-7">
            <h2>7. アンチパターン</h2>
            <div className={`${styles.callout} ${styles.calloutDanger}`}>
              <div className={styles.calloutTitle}>避けるべきハーネス設計のアンチパターン</div>
              <ul>
                <li>
                  <strong>プロンプト依存の品質保証:</strong>{" "}
                  「コードの品質を高く保ってください」といった曖昧な指示に頼り、Linterやテストによる機械的判定を怠る。
                </li>
                <li>
                  <strong>無保護なAPIキーのCI混入:</strong> <code>OPENAI_API_KEY</code>{" "}
                  をテスト環境全体に無差別露出させ、依存パッケージフック経由での流出リスクを放置する。
                </li>
                <li>
                  <strong>単一モデル評価への固執:</strong>{" "}
                  特定モデルの癖に過剰適合したプロンプトを作成し、上位モデル登場時の移植性を失う。
                </li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section className={styles.chapter} id="sec-8">
            <h2>8. まとめ</h2>
            <p>
              「Humans steer. Agents
              execute.」の世界において、人間の最も重要な責務はコードを書くことではなく、「エージェントが自律的に正しいコードを書き続けられる評価ハーネス」を構築することである。
            </p>
            <p>
              自己検証(Layer 1)からセキュリティ評価(Layer
              7)に至る積層型評価基盤を整えることで、Codexは単なる補完ツールを超え、堅牢で信頼できる共同開発者へと進化する。
            </p>
          </section>

          {/* Section 9 */}
          <section className={styles.chapter} id="sec-9">
            <h2>9. 参考文献</h2>
            <div className={styles.refGrid}>
              <div className={styles.refCard}>
                <div className={styles.refTitle}>Harness Engineering: OpenAI Blog</div>
                <Ext href="https://openai.com/index/harness-engineering/">
                  <span className={styles.refUrl}>
                    https://openai.com/index/harness-engineering/
                  </span>
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refTitle}>OpenAI Agent Evals Guide</div>
                <Ext href="https://developers.openai.com/api/docs/guides/agent-evals">
                  <span className={styles.refUrl}>
                    https://developers.openai.com/api/docs/guides/agent-evals
                  </span>
                </Ext>
              </div>
              <div className={styles.refCard}>
                <div className={styles.refTitle}>OpenAI Cookbook: PLANS.md</div>
                <Ext href="https://cookbook.openai.com/articles/codex_exec_plans">
                  <span className={styles.refUrl}>
                    https://cookbook.openai.com/articles/codex_exec_plans
                  </span>
                </Ext>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
