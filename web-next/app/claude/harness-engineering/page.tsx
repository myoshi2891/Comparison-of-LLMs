import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title:
    "ハーネスエンジニアリング入門ガイド — AIコーディングの信頼と構造を設計する | LLM Model Cost",
  description:
    "プロンプトやコンテキストを超え、AIエージェントの自律性・精度・安全性を両立させる『ハーネスエンジニアリング』の全体像、5層構造、フィードフォワード/フィードバック制御、ステップバイステップ実践法を包括解説。",
};

const DIAGRAM_1 = `flowchart LR
    A["フェーズ1: プロンプトエンジニアリング (〜2023)"] --> B["フェーズ2: コンテキストエンジニアリング (2024-2025)"]
    B --> C["フェーズ3: ハーネスエンジニアリング (2026〜)"]`;

const DIAGRAM_2 = `flowchart LR
    Core["① モデル本体（Claude / GPT など）"] --> Builder["② ビルダーハーネス（Anthropic / OpenAI等が実装）"]
    Builder --> User["③ ユーザーハーネス（あなたが構築・調整する層）"]`;

const DIAGRAM_3 = `flowchart TB
    L1["1. ツールオーケストレーション層：Bash・MCP・Skills"]
    L2["2. 検証ループ層：テスト・型チェック・スクリーンショット比較"]
    L3["3. コンテキスト&メモリ層：CLAUDE.md・圧縮・サブエージェント"]
    L4["4. ガードレール層：権限モデル・サンドボックス・フック"]
    L5["5. 可観測性層：ログ・トレース・コスト計測"]
    L1 --> L2 --> L3 --> L4 --> L5`;

const DIAGRAM_4 = `flowchart LR
    Human["人間（ステアリング）"] -->|"設計・改善"| Guides["ガイド（フィードフォワード）"]
    Guides -->|"事前に誘導"| Agent["コーディングエージェント"]
    Agent -->|"成果物を生成"| Sensors["センサー（フィードバック）"]
    Sensors -->|"自己修正シグナル"| Agent
    Sensors -->|"傾向を報告"| Human`;

const DIAGRAM_5 = `flowchart LR
E["1. 探索 (Explore)"] --> P["2. 計画 (Plan)"]
P --> I["3. 実装 (Implement)"]
I --> V["4. 検証 (Verify)"]
V --> C["5. コミット (Commit)"]
V -->|"失敗した場合"| I`;

const DIAGRAM_6 = `flowchart TB
    Main["メインセッション（オーケストレーション）"] -->|"調査を委任"| Sub1["サブエージェント1（独立したコンテキスト）"]
    Main -->|"実装レビューを委任"| Sub2["サブエージェント2（独立したコンテキスト）"]
    Sub1 -->|"要約のみ返却"| Main
    Sub2 -->|"要約のみ返却"| Main`;

const DIAGRAM_7 = `flowchart TB
    Init["初期化エージェント（最初のセッションのみ）"] -->|"init.sh / feature_list.json / progress.txt を生成"| Repo["リポジトリ状態（Git + ファイルシステム）"]
    Repo --> S1["セッション1（コーディングエージェント）"]
    S1 -->|"進捗をコミット・記録"| Repo
    Repo --> S2["セッション2（コーディングエージェント）"]
    S2 -->|"進捗をコミット・記録"| Repo
    Repo --> Sn["セッションN..."]`;

const DIAGRAM_8 = `flowchart LR
    M["エージェントがミスをする"] --> D["失敗パターンを診断する"]
    D --> R["ルール・フック・テストとしてハーネスに追加する"]
    R --> Run["次回以降の実行"]
    Run -->|"同じミスは再発しにくくなる"| Ok["信頼性が向上し監視の手間が減る"]
    Ok -.->|"より難しいタスクに挑戦"| M`;

const DIAGRAM_9 = `flowchart LR
    A["モデルが進化する"] --> B["一部の足場（仮説）が不要になる"]
    B --> C["新しい能力に対応する足場が必要になる"]
    C --> D["ハーネスの複雑さは縮まず移動する"]
    D -.->|"次の進化へ"| A`;

function Ext({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function HarnessEngineeringPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <i className="ti ti-adjustments-horizontal" />
          <span>目次</span>
        </div>
        <nav>
          <ul className={styles.sidebarNav}>
            <li>
              <a href="#intro" className={styles.navLink}>
                <i className="ti ti-home" />
                <span>はじめに</span>
              </a>
            </li>
            <li>
              <a href="#chapter1" className={styles.navLink}>
                <i className="ti ti-info-circle" />
                <span>1. ハーネスとは何か</span>
              </a>
            </li>
            <li>
              <a href="#chapter2" className={styles.navLink}>
                <i className="ti ti-stack-2" />
                <span>2. ハーネスの全体構造</span>
              </a>
            </li>
            <li>
              <a href="#chapter3" className={styles.navLink}>
                <i className="ti ti-refresh" />
                <span>3. 制御設計（FF & FB）</span>
              </a>
            </li>
            <li>
              <a href="#chapter4" className={styles.navLink}>
                <i className="ti ti-list-check" />
                <span>4. ステップバイステップ実践</span>
              </a>
            </li>
            <li>
              <a href="#chapter5" className={styles.navLink}>
                <i className="ti ti-alert-triangle" />
                <span>5. 失敗パターンと対策</span>
              </a>
            </li>
            <li>
              <a href="#chapter6" className={styles.navLink}>
                <i className="ti ti-telescope" />
                <span>6. ハーネス可能性と展望</span>
              </a>
            </li>
            <li>
              <a href="#chapter7" className={styles.navLink}>
                <i className="ti ti-flag-check" />
                <span>7. まとめ：良いハーネス</span>
              </a>
            </li>
            <li>
              <a href="#references" className={styles.navLink}>
                <i className="ti ti-link" />
                <span>8. 参考文献・出典</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.hero}>
          <div className={styles.heroEyebrow}>
            <i className="ti ti-bookmarks" />
            <span>総合ガイド / Harness Engineering 2026</span>
          </div>
          <h1>ハーネスエンジニアリング入門ガイド</h1>
          <p className={styles.heroSub}>
            プロンプトを超え、エージェントが自律的に正確なコードを書き続けるための「足場と制御」を構築する
          </p>
          <div className={styles.heroMeta}>
            <span>
              <i className="ti ti-calendar" />
              2026年7月改訂版
            </span>
            <span>
              <i className="ti ti-target" />
              対象: AIエンジニア / TL / AI開発者
            </span>
            <span>
              <i className="ti ti-clock" />
              読了時間: 約20分
            </span>
          </div>
        </header>

        {/* 初めに */}
        <section id="intro" className={styles.section}>
          <h2>
            <i className="ti ti-home" />
            はじめに
          </h2>
          <p>
            AIコーディングエージェント（Claude Code, Cursor, Codex
            など）が本格的に実務へ投入される中、エンジニアリングの焦点は単なる「プロンプトの工夫」や「コンテキストの注入」から、
            <strong>「エージェントを取り巻く環境全体（ハーネス）の設計」</strong>
            へとシフトしています。
          </p>
          <p>
            どれほど優秀なモデルであっても、適切な足場（Harness）がなければ、方向を見失ったり、間違った前提で作業を続けたり、コードベースを破壊してしまいます。本ガイドでは、業界のトップ実務者（Anthropic,
            Thoughtworks, OpenAI, LangChain
            等）の知見を統合し、実効性の高いハーネスを構築するための体系的な概念とステップを解説します。
          </p>
        </section>

        {/* 第1章 */}
        <section id="chapter1" className={styles.section}>
          <h2>
            <i className="ti ti-info-circle" />
            1. ハーネスエンジニアリングとは何か
          </h2>

          <h3>1.1 「ハーネス（Harness）」の基本定義</h3>
          <p>
            ハーネスエンジニアリング（Harness Engineering）とは、
            <strong>
              LLM/AIエージェントが安全かつ自律的に高品質な成果物を生成できるように、モデルの外部に構築する「誘導（ガイド）・検証（センサー）・ツール・制約・可観測性のシステム全体」を設計・運用する技術
            </strong>
            です。
          </p>
          <p>
            乗馬の「馬具（ハーネス）」が馬の強大な力を人間に制御可能にするように、あるいはモータースポーツのハーネスがドライバーを保護しながら限界走行を可能にするように、エージェントの自律性を解き放ちつつ逸脱を防ぐための「枠組み」を意味します。
          </p>

          <blockquote className={styles.blockquote}>
            <p>
              「Agent = Model + Harness」
              <br />
              モデル単体は頭脳に過ぎない。モデルが世界を観察し、判断し、行動し、自律的に修正できる環境全体を整えて初めて“エージェント”として機能する。
            </p>
          </blockquote>

          <h3>1.2 歴史的変遷：プロンプトからハーネスへ</h3>
          <p>
            AI活用エンジニアリングの重心は、ここ数年で次のように移り変わってきたと整理されています。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_1} />
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>フェーズ</th>
                  <th>主な問い</th>
                  <th>中心的な取り組み</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>プロンプトエンジニアリング</td>
                  <td>どう言葉を選べば良い出力が出るか</td>
                  <td>指示文の言い回し、Few-shot例</td>
                </tr>
                <tr>
                  <td>コンテキストエンジニアリング</td>
                  <td>モデルに何を読ませるべきか</td>
                  <td>関連ファイル、プロジェクトルール、RAG、MCP</td>
                </tr>
                <tr>
                  <td>ハーネスエンジニアリング</td>
                  <td>自律性・精度・制御をどう両立させるか</td>
                  <td>ツールオーケストレーション、検証ループ、ガードレール、可観測性</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://www.faros.ai/blog/harness-engineering"
                className={styles.sourceChip}
              >
                Faros AI
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>

          <h3>1.3 用語の起源について</h3>
          <p>
            「harness
            engineering」という言葉の起点には複数の系譜があり、単一の発明者に一意に帰属させるのは難しい状況です。
          </p>
          <ul>
            <li>
              HashiCorp／Terraformの創業者である<strong>Mitchell Hashimoto</strong>
              は、自身のAI活用の実践原則として「エージェントが一度ミスをしたら、二度と同じミスをしないように仕組みを作り込む」という考え方を示しました。
            </li>
            <li>
              LangChainの<strong>Viv Trivedy</strong>は「Agent = Model +
              Harness」という定式化と、ハーネスを構成する要素を体系立てて図解した記事を公開し、多くの実務者がこの図式を引用しています。
            </li>
            <li>
              ThoughtworksのDistinguished Engineerである<strong>Birgitta Böckeler</strong>
              は、martinfowler.com上で「ガイド（フィードフォワード）」と「センサー（フィードバック）」からなる体系的なメンタルモデルを発表し、実務者コミュニティで最も引用される整理のひとつになっています。
            </li>
            <li>
              OpenAIのエンジニアリングチームは、100万行規模のプロダクトをゼロ行の手書きコードで構築した経験をもとに、この語を一般に広めました。
            </li>
          </ul>
          <p>
            本ガイドは、これら複数の情報源の共通項を統合し、初学者にもわかりやすい形に再構成したものです。
          </p>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://mitchellh.com/writing/my-ai-adoption-journey"
                className={styles.sourceChip}
              >
                Mitchell Hashimoto
                <i className="ti ti-arrow-up-right" />
              </Ext>
              <Ext
                href="https://blog.langchain.com/the-anatomy-of-an-agent-harness/"
                className={styles.sourceChip}
              >
                LangChain Blog (Trivedy)
                <i className="ti ti-arrow-up-right" />
              </Ext>
              <Ext
                href="https://martinfowler.com/articles/harness-engineering.html"
                className={styles.sourceChip}
              >
                Böckeler / martinfowler.com
                <i className="ti ti-arrow-up-right" />
              </Ext>
              <Ext
                href="https://openai.com/index/harness-engineering/"
                className={styles.sourceChip}
              >
                OpenAI
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>
        </section>

        {/* 第2章 */}
        <section id="chapter2" className={styles.section}>
          <h2>
            <i className="ti ti-stack-2" />
            2. ハーネスの全体構造
          </h2>

          <h3>2.1 三層構造で理解する「ハーネス」</h3>
          <p>
            Böckelerは、「ハーネス」という言葉が指す範囲は文脈によって異なると指摘しています。モデルを中心に、内側から外側へ次の三層で捉えると混乱が減ります。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_2} />
            <p className={styles.mermaidCaption}>
              図: 内側（コア）から外側（利用者が組み立てる層）へ
            </p>
          </div>

          <ul>
            <li>
              <strong>モデル本体</strong>: 学習済みの言語モデルそのもの。
            </li>
            <li>
              <strong>ビルダーハーネス</strong>: Claude
              CodeやCodexといった製品自体に組み込まれた仕組み（システムプロンプト、標準ツール、オーケストレーションロジックなど）。
            </li>
            <li>
              <strong>ユーザーハーネス</strong>:
              私たち利用者がリポジトリや開発環境に構築する仕組み（<code>CLAUDE.md</code>
              、カスタムフック、テスト・Lint設定、サブエージェント構成など）。
            </li>
          </ul>
          <p>
            ビルダーハーネスはベンダーが磨き込みますが、プロジェクト固有のルールや検証ロジックを担う「ユーザーハーネス」の設計こそが、チームの開発速度と品質の差を生む源泉になります。
          </p>

          <h3>2.2 ユーザーハーネスを構成する主要要素</h3>
          <p>私たちが構築すべきユーザーハーネスの要素は、大きく次の5つに整理できます。</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>構成要素</th>
                  <th>主な役割</th>
                  <th>具体例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>コンテキスト &amp; メモリ管理</td>
                  <td>必要な情報のみを抽出し、トークン枯渇を防ぐ</td>
                  <td>
                    <code>CLAUDE.md</code>、<code>.claudeignore</code>
                    、要約（Compaction）、サブエージェント
                  </td>
                </tr>
                <tr>
                  <td>ツールオーケストレーション</td>
                  <td>エージェントの行動能力を定義・拡張する</td>
                  <td>
                    Bash実行、MCPサーバー、カスタムSkill（<code>SKILL.md</code>）
                  </td>
                </tr>
                <tr>
                  <td>検証ループ（センサー）</td>
                  <td>成果物の正しさを機械的・自動的に評価する</td>
                  <td>テスト実行、Linter/型チェック、スクリーンショット比較、E2Eテスト</td>
                </tr>
                <tr>
                  <td>ガードレール &amp; ガイド</td>
                  <td>危険な操作の遮断と、望ましい挙動への誘導</td>
                  <td>フック（Pre-commit/Post-tool）、権限モデル、Autoモード設定</td>
                </tr>
                <tr>
                  <td>可観測性 &amp; 記録</td>
                  <td>エージェントの動作ログとコストを可視化する</td>
                  <td>
                    セッションログ、トークン使用量監視、進捗記録（<code>progress.txt</code>）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://blog.langchain.com/the-anatomy-of-an-agent-harness/"
                className={styles.sourceChip}
              >
                LangChain Blog (Trivedy)
                <i className="ti ti-arrow-up-right" />
              </Ext>
              <Ext
                href="https://code.claude.com/docs/en/best-practices"
                className={styles.sourceChip}
              >
                Anthropic — Claude Code Best Practices
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>

          <h3>2.3 5層アーキテクチャで俯瞰する</h3>
          <p>
            上記の要素を「積み重なる層」として俯瞰すると、次のようなスタックとして理解できます。下の層ほど基盤的で、上の層ほど運用・信頼性に関わります。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_3} />
          </div>

          <p>
            エンジニアリングリーダーがハーネス投資の優先順位を判断する際は、まず「マージ済みPRあたりのコスト」「エージェント支援PRのマージまでの時間」「PRサイズに対するレビュー速度」「開発者あたりの計算コスト」といった既存メトリクスで現状を把握し、そのデータをもとにどの層に投資すべきかを決めることが推奨されています。
          </p>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://www.faros.ai/blog/harness-engineering"
                className={styles.sourceChip}
              >
                Faros AI
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>
        </section>

        {/* 第3章 */}
        <section id="chapter3" className={styles.section}>
          <h2>
            <i className="ti ti-refresh" />
            3. フィードフォワードとフィードバック — 信頼を設計する
          </h2>

          <h3>3.1 ガイド（Feedforward）とセンサー（Feedback）</h3>
          <p>
            Böckelerのモデルの核心は、ハーネスを「事前の誘導」と「事後の検知」という2つの制御方向に分けて考えることです。
          </p>
          <ul>
            <li>
              <strong>ガイド（フィードフォワード制御）</strong>:
              エージェントの挙動をあらかじめ予測し、行動する<strong>前に</strong>
              方向づける仕組み。最初の一回で良い結果が出る確率を高める。例: <code>CLAUDE.md</code>
              、アーキテクチャ文書、スキル、コーディング規約。
            </li>
            <li>
              <strong>センサー（フィードバック制御）</strong>: エージェントが行動した
              <strong>後</strong>
              に観測し、自己修正を助ける仕組み。特に「LLMがそのまま読める形式のシグナル」を返すセンサー（自己修正の指示を含むLintメッセージなど）は効果が高い。例:
              静的解析、テスト結果、ログ、ブラウザでの実行結果。
            </li>
          </ul>
          <p>
            ガイドだけに偏ると「ルールは決めたが、それが機能しているか誰も検証していない」状態になり、センサーだけに偏ると「同じミスを何度も繰り返し、そのたびに人間が指摘する」状態になります。両方が揃って初めて自己修正ループが成立します。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_4} />
          </div>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://martinfowler.com/articles/harness-engineering.html"
                className={styles.sourceChip}
              >
                Böckeler / martinfowler.com
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>

          <h3>3.2 計算的 (Computational) vs 推論的 (Inferential)</h3>
          <p>ガイドとセンサーは、さらに「実行方式」でも分類できます。</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>種別</th>
                  <th>特徴</th>
                  <th>速度・コスト</th>
                  <th>例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>計算的 (Computational)</td>
                  <td>決定論的、CPUで実行</td>
                  <td>数ミリ秒〜数秒。安価で信頼性が高い</td>
                  <td>テスト、Linter、型チェッカー、構造解析</td>
                </tr>
                <tr>
                  <td>推論的 (Inferential)</td>
                  <td>意味的判断、GPU/NPUで実行</td>
                  <td>相対的に低速・高コスト。非決定論的</td>
                  <td>AIによるコードレビュー、LLM-as-judge</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            計算的な制御は構造的な問題（重複コード、循環的複雑度、テストカバレッジ不足、アーキテクチャの逸脱、スタイル違反）を安価かつ確実に検知できます。一方、意味的な重複や過剰設計、指示の誤解といった「高インパクトだが意味理解を要する問題」は、推論的な制御でも部分的にしか捕捉できません。人間が最初に何を求めているかを明確に伝えることが、依然として最も重要です。
          </p>

          <h3>3.3 品質を「左」に寄せる（Shift Left）</h3>
          <p>
            継続的インテグレーションの文脈と同様に、チェックはコストと速度に応じてライフサイクルの中に分散配置すべきです。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>タイミング</th>
                  <th>想定されるチェック</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>エディタ保存時（IDE / Hook）</td>
                  <td>型チェック、Linter、自動フォーマットなどの計算的チェック</td>
                </tr>
                <tr>
                  <td>コミット前 / PR時（Pre-commit / CI）</td>
                  <td>
                    ユニットテスト、アドバーサリアル（対立的）サブエージェントによる自動コードレビュー
                  </td>
                </tr>
                <tr>
                  <td>人間による最終レビュー前</td>
                  <td>意味的整合性チェック、デモスクリーンショット確認</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            計算的チェックをできる限り左（エージェント自身のループ内）へ寄せることで、人間がPRレビュー時に行う指摘の大部分（スタイル崩れ、型ミス、既存テスト破壊など）を事前に自動消滅させることができます。
          </p>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://martinfowler.com/articles/harness-engineering.html"
                className={styles.sourceChip}
              >
                Böckeler / martinfowler.com
                <i className="ti ti-arrow-up-right" />
              </Ext>
              <Ext
                href="https://martinfowler.com/articles/sensors-for-coding-agents.html"
                className={styles.sourceChip}
              >
                Böckeler (Sensors続編)
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>
        </section>

        {/* 第4章 */}
        <section id="chapter4" className={styles.section}>
          <h2>
            <i className="ti ti-list-check" />
            4. ステップバイステップ実践ガイド
          </h2>
          <p>
            ここからは、自分のプロジェクトにハーネスを構築するための具体手順を10のステップで解説します。
          </p>

          <div className={styles.stepTitle}>
            <i className="ti ti-file-text" />
            Step 1: CLAUDE.md / AGENTS.md を薄く保ち、指示を明確にする
          </div>
          <p>
            <code>CLAUDE.md</code>（または<code>AGENTS.md</code>
            ）はエージェントがセッション開始時に最初に読み込むガイドです。最大の誤解は「プロジェクトのすべてを書き込むべき」という思い込みです。
          </p>
          <p>
            ファイルが長すぎると、最も重要なルールが埋もれて無視されます。
            <strong>目安は50行以内</strong>とし、具体的な詳細は別ファイル（<code>docs/</code>
            配下）へポインタとして参照させる「段階的開示（Progressive Disclosure）」を採用します。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>書くべきこと</th>
                  <th>書くべきでないこと</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>コマンド</td>
                  <td>ビルド、テスト、Lintの実行コマンド（正確な1行）</td>
                  <td>
                    環境構築の長文手順（<code>init.sh</code>へ切り出す）
                  </td>
                </tr>
                <tr>
                  <td>ルール</td>
                  <td>絶対に破ってはいけない禁止事項（Prohibitions）</td>
                  <td>言語の標準的な文法解説や一般的なマナー</td>
                </tr>
                <tr>
                  <td>構造</td>
                  <td>主要ファイルの配置場所と役割のマップ</td>
                  <td>全ディレクトリの詳細な木構造</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-bulb" />
            <p>
              「指示がなくてもモデルがすでに正しく行っていること」を<code>CLAUDE.md</code>
              に書くのはノイズになります。実際に過去にエージェントが起こした失敗から逆算して、最小限の制約を追加していく「ラチェット原則（Step
              9参照）」を守りましょう。
            </p>
          </div>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://code.claude.com/docs/en/best-practices"
                className={styles.sourceChip}
              >
                Anthropic — Claude Code Best Practices
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>

          <div className={styles.stepTitle}>
            <i className="ti ti-compass" />
            Step 2: 「探索 → 計画 → 実装 → 検証 → コミット」のワークフローを徹底する
          </div>
          <p>
            Anthropicが推奨する基本ワークフローは、調査と計画を実装から明確に分離することです。いきなりコードを書かせると、間違った問題を解決してしまうリスクが高まります。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_5} />
          </div>

          <ol>
            <li>
              <strong>探索</strong>: Plan
              Mode（変更を加えずファイル閲覧・質問のみ行うモード）に入り、関連コードを読ませる。
            </li>
            <li>
              <strong>計画</strong>:
              実装計画を作成させる。エディタで直接編集して調整することも可能。
            </li>
            <li>
              <strong>実装</strong>: Plan Modeを解除し、計画に沿って実装・テストを書かせる。
            </li>
            <li>
              <strong>検証</strong>: テストを実行し、失敗があれば修正させる。
            </li>
            <li>
              <strong>コミット</strong>: 説明的なコミットメッセージでコミットし、PRを作成させる。
            </li>
          </ol>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-bulb" />
            <p>
              スコープが明確で変更が小さい作業（タイポ修正、ログ追加、変数名変更など）にまで計画フェーズを強制するとオーバーヘッドになります。「diffを一文で説明できるなら計画は省略してよい」という目安が示されています。
            </p>
          </div>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://code.claude.com/docs/en/best-practices"
                className={styles.sourceChip}
              >
                Anthropic — Claude Code Best Practices
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>

          <div className={styles.stepTitle}>
            <i className="ti ti-checklist" />
            Step 3: 検証ループ（テスト・型チェック・スクリーンショット比較）を用意する
          </div>
          <p>
            エージェントは「完了したように見える」ことを唯一の判断材料にして作業を止めます。実行可能なチェックを与えなければ、すべてのミスを人間が発見するまで気づかれません。合否を返す仕組みを用意すれば、エージェントは自分で実行し、結果を読み、合格するまで反復できます。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>戦略</th>
                  <th>Before（曖昧な指示）</th>
                  <th>After（検証可能な指示）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>検証基準を与える</td>
                  <td>「メールアドレスを検証する関数を実装して」</td>
                  <td>
                    「validateEmail関数を書いて。テストケース例あり。実装後にテストを実行して」
                  </td>
                </tr>
                <tr>
                  <td>UI変更を視覚的に検証する</td>
                  <td>「ダッシュボードをもっと良く見せて」</td>
                  <td>
                    「[スクリーンショット添付]
                    このデザイン通りに実装し、結果を撮影して元画像と比較・修正して」
                  </td>
                </tr>
                <tr>
                  <td>根本原因に対処する</td>
                  <td>「ビルドが失敗している」</td>
                  <td>「[エラー内容] を修正しビルド成功を確認して。根本原因に対処して」</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>チェックをどの程度厳格に「作業終了のゲート」にするかは、次の4段階から選べます。</p>
          <ul>
            <li>
              <strong>1回のプロンプト内</strong>: 同じメッセージ内でチェック実行と反復を依頼する。
            </li>
            <li>
              <strong>セッションをまたぐ条件</strong>: <code>/goal</code>
              条件として設定し、別の評価者が毎ターン後に再チェックする。
            </li>
            <li>
              <strong>決定論的なゲート</strong>: <code>Stop</code>
              フックでチェックをスクリプトとして実行し、合格するまでターン終了をブロックする。
            </li>
            <li>
              <strong>第三者による評価</strong>:
              検証用サブエージェントや、実装したエージェント自身ではなく新鮮なモデルに結果を疑わせる仕組み。
            </li>
          </ul>
          <p>
            「成功したと主張する」のではなく「テスト出力・実行コマンド・スクリーンショットなどの証拠を提示させる」ことが、監視していないセッションでも結果を信頼するための鍵になります。
          </p>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://code.claude.com/docs/en/best-practices"
                className={styles.sourceChip}
              >
                Anthropic — Claude Code Best Practices
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>

          <div className={styles.stepTitle}>
            <i className="ti ti-shield-lock" />
            Step 4: フックで決定論的なガードレールを敷く
          </div>
          <p>
            <code>CLAUDE.md</code>
            の指示はあくまで「助言」であり、エージェントが読み飛ばす可能性があります。一方
            <strong>フック (Hooks)</strong>
            は、特定のライフサイクルイベント（ツール呼び出し前後、コミット前、セッション開始時など）で自動実行されるスクリプトで、「毎回・例外なく」実行させたい処理に向いています。
          </p>
          <ul>
            <li>
              編集のたびにLintと型チェックを走らせ、失敗のみをエージェントに伝える（成功時は無音、失敗時のみ詳細を返す「Silent
              on success, verbose on failure」という原則が推奨されています）
            </li>
            <li>
              <code>rm -rf</code>や<code>git push --force</code>など破壊的なコマンドをブロックする
            </li>
            <li>PR作成やmainブランチへのプッシュ前に承認を必須にする</li>
            <li>
              保存時に自動フォーマットし、エージェントが空白調整にトークンを浪費しないようにする
            </li>
          </ul>

          <h4>概念的なフック例（型チェック＋Lintを実行し、失敗時のみエラーを返す）</h4>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>hook.sh</span>
              <span>BASH</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>#!/bin/bash</div>
              <div className={styles.codeLine}>EXIT_CODE=0</div>
              <div className={styles.codeLine}>ERRORS=&quot;&quot;</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                TC_OUT=$(npm run typecheck 2&gt;&amp;1) || &#123; EXIT_CODE=$?;
                ERRORS=&quot;$&#123;ERRORS&#125;$&#123;TC_OUT&#125;\n&quot;; &#125;
              </div>
              <div className={styles.codeLine}>
                LINT_OUT=$(npm run lint 2&gt;&amp;1) || &#123; LINT_STATUS=$?; [ $EXIT_CODE -eq 0 ]
                &amp;&amp; EXIT_CODE=$LINT_STATUS;
                ERRORS=&quot;$&#123;ERRORS&#125;$&#123;LINT_OUT&#125;\n&quot;; &#125;
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>if [ $EXIT_CODE -ne 0 ]; then</div>
              <div className={styles.codeLine}>
                {" "}
                printf &quot;%b&quot; &quot;$ERRORS&quot; &gt;&amp;2
              </div>
              <div className={styles.codeLine}> exit $EXIT_CODE</div>
              <div className={styles.codeLine}>fi</div>
              <div className={styles.codeLine}>
                # 成功時は何も出力しない（コンテキストを汚さない）
              </div>
            </div>
          </div>

          <p>
            このように「合格時は完全に無音、失敗時のみ簡潔なエラーを返す」設計にすることで、フィードバックループがほぼ無料になり、問題が起きたときだけ確実にエージェントへ届きます。
          </p>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents"
                className={styles.sourceChip}
              >
                HumanLayer
                <i className="ti ti-arrow-up-right" />
              </Ext>
              <Ext
                href="https://code.claude.com/docs/en/best-practices"
                className={styles.sourceChip}
              >
                Anthropic — Claude Code Best Practices
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>

          <div className={styles.stepTitle}>
            <i className="ti ti-git-branch" />
            Step 5: サブエージェントでコンテキストを保護する
          </div>
          <p>
            コンテキストウィンドウは有限であり、埋まるほどモデルの性能は劣化します（いわゆる「コンテキスト・ロット」）。
            <strong>サブエージェント</strong>
            は独立したコンテキストウィンドウで動作し、要約された結果だけを親セッションに返す「コンテキスト・ファイアウォール」として機能します。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_6} />
          </div>

          <p>サブエージェントが向いているタスク:</p>
          <ul>
            <li>コードベース内の特定の定義・実装箇所を探す</li>
            <li>特定の作業パターンを調査する</li>
            <li>サービス境界をまたぐリクエストの流れを追跡する</li>
            <li>一般的なコード・ドキュメント・Web調査</li>
          </ul>
          <p>
            Chroma社の「コンテキスト・ロット」研究では、18モデルを対象にしたneedle-in-a-haystackタスクで、コンテキストが長くなるほど性能が劣化し、質問と関連情報の意味的類似度が低いほど劣化が急になることが確認されています。サブエージェントは各タスクに「新鮮で高関連度な」コンテキストウィンドウを与えることで、この劣化を構造的に回避します。
          </p>
          <p>
            また、実装を書いたセッション自身にレビューさせると評価が甘くなりがちなため、
            <strong>
              「実装セッションとは別の、新鮮なコンテキストのサブエージェントにdiffをレビューさせる」
            </strong>
            アドバーサリアル・レビューも推奨されています。レビュー担当には「何をチェックすべきか」を明確に絞って伝えないと、些細なスタイル指摘まで大量に報告し、過剰なリファクタリングを誘発するため注意が必要です。
          </p>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents"
                className={styles.sourceChip}
              >
                HumanLayer
                <i className="ti ti-arrow-up-right" />
              </Ext>
              <Ext
                href="https://code.claude.com/docs/en/best-practices"
                className={styles.sourceChip}
              >
                Anthropic — Claude Code Best Practices
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>

          <div className={styles.stepTitle}>
            <i className="ti ti-plug-connected" />
            Step 6: MCP とスキルで能力と知識を拡張する
          </div>
          <ul>
            <li>
              <strong>MCPサーバー</strong>:
              ファイルI/OやBash以外の能力（外部API、データベース、Issueトラッカーなど）をエージェントに追加する仕組み。接続したMCPサーバーのツール説明はシステムプロンプトに注入されるため、
              <strong>信頼できないMCPサーバーには接続しないこと</strong>
              が強く推奨されています。ツール説明文自体がプロンプトインジェクションの経路になり得るためです。
            </li>
            <li>
              <strong>スキル (Skills)</strong>: <code>SKILL.md</code>
              という形式で、必要なときだけ読み込まれる知識・手順書。すべてのツールやMCPを常時コンテキストに載せると性能が劣化するため、「プログレッシブ・ディスクロージャー（段階的開示）」の考え方でスキルとして切り出すのが定石です。
            </li>
          </ul>

          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className="ti ti-alert-triangle" />
            <p>
              MCPサーバーが提供する機能が、既に学習データに含まれる有名なCLI（<code>gh</code>、
              <code>aws</code>、<code>gcloud</code>
              など）と重複している場合は、MCPサーバーを使わずCLIを直接使わせたほうが、コンテキスト効率と
              <code>grep</code>・<code>jq</code>
              などとの組み合わせやすさの点で有利になることが多いという報告もあります。
            </p>
          </div>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://code.claude.com/docs/en/best-practices"
                className={styles.sourceChip}
              >
                Anthropic — Claude Code Best Practices
                <i className="ti ti-arrow-up-right" />
              </Ext>
              <Ext
                href="https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents"
                className={styles.sourceChip}
              >
                HumanLayer
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>

          <div className={styles.stepTitle}>
            <i className="ti ti-lock" />
            Step 7: 権限モデルとサンドボックスでリスクを制御する
          </div>
          <p>
            デフォルトでは、ファイル書き込みやBash実行など、システムに影響する操作のたびに承認を求められます。安全ですが、10回目の承認あたりから人間は「レビューしているつもり」で実際には確認していない状態になりがちです。これを避けつつ安全性を保つ方法が3つあります。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>方法</th>
                  <th>概要</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Autoモード</td>
                  <td>
                    別の分類モデルがコマンドをレビューし、スコープの逸脱・未知のインフラ操作・敵対的コンテンツ由来の操作のみをブロックする
                  </td>
                </tr>
                <tr>
                  <td>権限アローリスト</td>
                  <td>
                    <code>npm run lint</code>や<code>git commit</code>
                    など、安全と分かっている特定のコマンドのみを許可する
                  </td>
                </tr>
                <tr>
                  <td>サンドボックス</td>
                  <td>
                    OSレベルの隔離を有効にし、ファイルシステム・ネットワークアクセスを制限した上で自由に動かせるようにする
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://code.claude.com/docs/en/best-practices"
                className={styles.sourceChip}
              >
                Anthropic — Claude Code Best Practices
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>

          <div className={styles.stepTitle}>
            <i className="ti ti-history" />
            Step 8: 長時間実行タスクのためにステートを橋渡しする
          </div>
          <p>
            数時間〜数日にまたがるタスクでは、エージェントは複数のコンテキストウィンドウ（＝複数の「シフト」）にまたがって作業することになります。新しいセッションは前のセッションの記憶を一切持たずに始まるため、Anthropicは「初期化エージェント」と「コーディングエージェント」の二段構成を提案しています。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_7} />
          </div>

          <ul>
            <li>
              <strong>初期化エージェント</strong>: 最初のセッションで、<code>init.sh</code>
              （開発サーバー起動スクリプト）、進捗ログファイル、初期Gitコミット、そして「合格/不合格」を持つ機能一覧ファイルをセットアップする。この機能一覧は、AIが誤って上書き・削除しにくいJSON形式で管理するのが有効だと報告されています。
            </li>
            <li>
              <strong>コーディングエージェント</strong>: 以降の各セッションは、まず<code>pwd</code>
              で作業ディレクトリを確認し、Gitログと進捗ファイルを読んで状況を把握し、機能一覧から未完了の最優先項目を選んで着手し、セッション終了時にはGitコミットと進捗更新を残す、という定型手順で「引き継ぎ」を行う。
            </li>
          </ul>
          <p>
            こうして「Gitコミット履歴」「<code>progress.txt</code>」「<code>feature_list.json</code>
            」を組み合わせることで、コンテキストウィンドウが切れても次のセッションが即座に前回の作業を引き継ぐことができます。
          </p>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
                className={styles.sourceChip}
              >
                Anthropic Engineering
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>

          <div className={styles.stepTitle}>
            <i className="ti ti-repeat" />
            Step 9: 「ラチェット原則」で継続的にハーネスを改善する
          </div>
          <p>
            ハーネスは一度作って終わりの設定ファイルではなく、生き続けるシステムです。最も重要な習慣は、
            <strong>
              エージェントのミスを「一過性の失敗談」ではなく「恒久的なシグナル」として扱うこと
            </strong>
            です。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_8} />
          </div>

          <p>
            例えば、コメントアウトされたテストを含んだPRを誤ってマージしてしまったら、それは単なる不運ではなく入力データです。次のバージョンの
            <code>AGENTS.md</code>
            には「テストをコメントアウトしない。削除するか修正すること」という一文を足し、pre-commitフックには該当パターンを検知するgrepを足し、レビュー用サブエージェントにはコメントアウトされたテストをブロッカーとして検知させる、というように三重に手当てします。
          </p>
          <ul>
            <li>
              制約を追加するのは、<strong>実際に起きた失敗を見たときだけ</strong>。
            </li>
            <li>
              制約を取り除くのは、
              <strong>モデルの能力向上によってその制約が不要になったと確認できたときだけ</strong>。
            </li>
            <li>
              良い<code>AGENTS.md</code>のすべての行は、
              <strong>特定の過去の失敗にたどり着けるべき</strong>。
            </li>
          </ul>
          <p>
            裏を返せば、モデルが賢くなるとハーネスが不要になっていく、という単純な話ではありません。Anthropicのレポートが指摘するように「ハーネスの各構成要素は、モデルが単独ではできないことについての“仮説”を体現している」ため、モデルが進化すればある仮説（＝ある種の足場）は不要になりますが、同時にモデルが新しくできるようになった作業には、また新しい種類の足場が必要になります。ハーネスの複雑さは「縮む」のではなく「移動する」と表現されています。
          </p>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://addyosmani.com/blog/agent-harness-engineering/"
                className={styles.sourceChip}
              >
                Addy Osmani
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>

          <div className={styles.stepTitle}>
            <i className="ti ti-layers-linked" />
            Step 10: 並列化してスケールする
          </div>
          <p>
            一人のエンジニアと一つのエージェントの会話、という単位に慣れたら、次はスケールさせる番です。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>手法</th>
                  <th>概要</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Worktree並列実行</td>
                  <td>
                    複数のCLIセッションを独立したGitチェックアウトで実行し、編集の衝突を避ける
                  </td>
                </tr>
                <tr>
                  <td>
                    非対話モード (<code>claude -p</code>)
                  </td>
                  <td>CI、pre-commitフック、自動化スクリプトにエージェントを組み込む</td>
                </tr>
                <tr>
                  <td>Writer/Reviewerパターン</td>
                  <td>
                    あるセッションに実装させ、別の新鮮なコンテキストのセッションにレビューさせ、指摘を実装セッションに戻す
                  </td>
                </tr>
                <tr>
                  <td>ファンアウト</td>
                  <td>
                    大規模移行などで、タスクリストをスクリプトでループしながら<code>claude -p</code>
                    を大量に呼び出し、<code>--allowedTools</code>で権限を絞って並列実行する
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Writer/Reviewerパターンが有効なのは、実装したセッション自身がレビューすると自分のコードにバイアスがかかりやすい一方、新しいセッションはその実装に至った思考過程を持たず、結果と基準だけを見て評価できるためです。
          </p>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://code.claude.com/docs/en/best-practices"
                className={styles.sourceChip}
              >
                Anthropic — Claude Code Best Practices
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>
        </section>

        {/* 第5章 */}
        <section id="chapter5" className={styles.section}>
          <h2>
            <i className="ti ti-alert-triangle" />
            5. よくある失敗パターンと対策
          </h2>
          <p>初学者が最初につまずきやすいパターンと、その対処法を一覧化します。</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>失敗パターン</th>
                  <th>症状</th>
                  <th>対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>キッチンシンク・セッション</td>
                  <td>
                    1つのタスクから始めたのに無関係な質問を挟み、また元のタスクに戻る。コンテキストが無関係な情報で埋まる
                  </td>
                  <td>
                    無関係なタスクの間は<code>/clear</code>でコンテキストをリセットする
                  </td>
                </tr>
                <tr>
                  <td>堂々巡りの修正</td>
                  <td>
                    同じ問題を2回、3回と指摘しても直らない。コンテキストが失敗した試行錯誤で汚染されている
                  </td>
                  <td>
                    2回修正しても直らなければ<code>/clear</code>
                    し、学んだことを反映したより具体的な初期プロンプトで再開する
                  </td>
                </tr>
                <tr>
                  <td>
                    肥大化した<code>CLAUDE.md</code>
                  </td>
                  <td>
                    ファイルが長すぎて、重要なルールがノイズに埋もれてエージェントに無視される
                  </td>
                  <td>
                    容赦なく刈り込む。指示がなくてもエージェントが正しく動くなら削除するかフックに置き換える
                  </td>
                </tr>
                <tr>
                  <td>「信頼してから検証する」の逆転</td>
                  <td>もっともらしく見える実装がエッジケースを処理できていない</td>
                  <td>
                    常にテスト・スクリプト・スクリーンショットなどの検証手段を用意する。検証できないものは出荷しない
                  </td>
                </tr>
                <tr>
                  <td>際限のない探索</td>
                  <td>
                    スコープを絞らずに「調査して」と指示し、何百ものファイルを読んでコンテキストを埋め尽くす
                  </td>
                  <td>
                    調査範囲を狭く指定するか、サブエージェントを使ってメインコンテキストを汚染しないようにする
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://code.claude.com/docs/en/best-practices"
                className={styles.sourceChip}
              >
                Anthropic — Claude Code Best Practices
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>
        </section>

        {/* 第6章 */}
        <section id="chapter6" className={styles.section}>
          <h2>
            <i className="ti ti-telescope" />
            6. ハーネス可能性（Harnessability）と今後の展望
          </h2>

          <h3>6.1 すべてのコードベースが同じように「ハーネス可能」なわけではない</h3>
          <p>
            強い静的型付け言語のコードベースには型チェックというセンサーが自然に備わっており、明確なモジュール境界はアーキテクチャ制約ルールを可能にし、Springのようなフレームワークはエージェントが気にする必要のない詳細を抽象化してくれます。これらの性質がなければ、そもそも構築できる制御の種類が限られてしまいます。Thoughtworksの同僚であるNed
            Letcherはこれを<strong>「アンビエント・アフォーダンス」</strong>
            （環境そのものがエージェントにとって読み解きやすく、扱いやすい構造的性質）と呼んでいます。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>グリーンフィールド（新規開発）</th>
                  <th>レガシー（技術的負債あり）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ハーネス可能性の織り込み</td>
                  <td>技術選定・アーキテクチャ段階から設計できる</td>
                  <td>既存の構造に後から適合させる必要がある</td>
                </tr>
                <tr>
                  <td>センサーの入手しやすさ</td>
                  <td>型チェックや明確なモジュール境界を最初から選べる</td>
                  <td>型安全性やモジュール境界が乏しいことが多い</td>
                </tr>
                <tr>
                  <td>直面しやすい課題</td>
                  <td>ハーネスへの投資優先順位づけ</td>
                  <td>「最も必要な場所ほど構築が難しい」ジレンマ</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            グリーンフィールドのチームは最初からハーネス可能性を技術選定・設計の段階で織り込めますが、技術的負債を多く抱えたレガシーなチームはこのジレンマに直面します。
          </p>

          <h3>6.2 ハーネステンプレートという発想</h3>
          <p>
            多くの企業では、業務APIサービス・イベント処理サービス・データダッシュボードのように、少数のトポロジー（サービス構成の型）が全体の大部分をカバーしています。これらをあらかじめ「ハーネステンプレート」として整備し、ガイドとセンサーのセットをトポロジーごとにインスタンス化できるようにする、という発想が提案されています。
          </p>

          <div className={styles.definitionBlock}>
            <div className={styles.label}>関連法則: Ashbyの法則（必要多様性の法則）</div>
            <div className={styles.formula}>制御装置が持つ多様性 ≥ 制御対象が持つ多様性</div>
            <p style={{ marginTop: "10px", marginBottom: 0 }}>
              英国のサイバネティクス学者Ross
              Ashbyが示した原則。逆に言えば、対象とするシステムの多様性を絞り込むほど、それを包括的に制御するハーネスを設計しやすくなる。少数のトポロジーに絞った「ハーネステンプレート」はこの法則の実践例といえる。
            </p>
          </div>

          <h3>6.3 まだ答えが出ていない領域：振る舞いハーネス</h3>
          <p>
            構造的な保守性（重複、複雑度、カバレッジ）を扱う「保守性ハーネス」や、性能・可観測性要件を扱う「アーキテクチャ適合性ハーネス」に比べ、
            <strong>
              「アプリケーションが仕様通りに機能的に振る舞っているか」を保証する“振る舞いハーネス”は依然として未解決の課題
            </strong>
            とされています。
          </p>

          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className="ti ti-alert-triangle" />
            <p>
              現状の主流は、機能仕様をフィードフォワードとして与え、AIが生成したテストスイートが緑（合格）であること・カバレッジ・場合によってはミューテーションテストをフィードバックとして確認し、最後に人手のテストで補う、という組み合わせです。しかしAI生成テストへの信頼はまだ十分ではなく、「承認済みフィクスチャ（approved
              fixtures）」パターンなど部分的な解決策が模索されている段階です。
            </p>
          </div>

          <h3>6.4 モデルとハーネスの共進化</h3>
          <p>
            もう一つの重要な観測は、コーディングエージェント製品は「ハーネスを内側に組み込んだ状態」で事後学習（post-training）されているという点です。そのため、あるモデルが特定のハーネス内で学習された挙動に最適化されすぎる（オーバーフィットする）ことがあり、同じモデルを別のハーネスに載せ替えるとベンチマーク順位が大きく変わる、という報告があります。これは「新しいモデルを待てば全て解決する」という考え方に対する反例であり、
            <strong>ハーネス側の設計にも独立した価値がある</strong>ことを示しています。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_9} />
            <p className={styles.mermaidCaption}>
              図: モデルとハーネスの共進化ループ — 複雑さは消えるのではなく移動する
            </p>
          </div>

          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://martinfowler.com/articles/harness-engineering.html"
                className={styles.sourceChip}
              >
                Böckeler / martinfowler.com
                <i className="ti ti-arrow-up-right" />
              </Ext>
              <Ext
                href="https://addyosmani.com/blog/agent-harness-engineering/"
                className={styles.sourceChip}
              >
                Addy Osmani
                <i className="ti ti-arrow-up-right" />
              </Ext>
              <Ext
                href="https://blog.langchain.com/the-anatomy-of-an-agent-harness/"
                className={styles.sourceChip}
              >
                LangChain Blog (Trivedy)
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>
        </section>

        {/* 第7章 */}
        <section id="chapter7" className={styles.section}>
          <h2>
            <i className="ti ti-flag-check" />
            7. まとめ：良いハーネスの条件
          </h2>
          <p>
            人間のエンジニアは、コードベースに対する暗黙の「ハーネス」を自然に持っています。長年の経験で身につけた規約、300行の関数を見たときの美的な違和感、「うちのチームではそうしない」という直感、そしてコミットに自分の名前が載るという社会的な責任感です。エージェントにはこれらが一切ありません。どの規約が本質的でどれが単なる慣習なのか分からず、組織の記憶も持ちません。
          </p>
          <p>
            ハーネスは、こうした人間の開発経験が暗黙のうちに担っていたものを、明示的で検証可能な形に外部化する試みです。ただし、それにも限界があります。良いハーネスの目的は、人間の入力を完全にゼロにすることではなく、
            <strong>人間の判断が最も重要な場所にその入力を集中させること</strong>にあります。
          </p>

          <h4>実践上の要点</h4>
          <ul className={styles.recapList}>
            <li>
              <i className="ti ti-point" />
              ハーネスは「モデル以外のすべて」であり、あなた自身が設計・改善できる資産である。
            </li>
            <li>
              <i className="ti ti-point" />
              ガイド（事前の誘導）とセンサー（事後の検知）の両輪を揃えて初めて自己修正ループが機能する。
            </li>
            <li>
              <i className="ti ti-point" />
              <code>CLAUDE.md</code>/<code>AGENTS.md</code>は短く、実際の失敗から逆算して書く。
            </li>
            <li>
              <i className="ti ti-point" />
              検証可能なチェック（テスト・型チェック・スクリーンショット）を必ず用意する。
            </li>
            <li>
              <i className="ti ti-point" />
              フックは「毎回・例外なく」実行させたい制御に、サブエージェントはコンテキスト保護に使う。
            </li>
            <li>
              <i className="ti ti-point" />
              一つのミスを見つけたら、それを二度と起きないようにする恒久的な仕組みに変える（ラチェット原則）。
            </li>
            <li>
              <i className="ti ti-point" />
              ハーネスは一度作って終わりではなく、モデルの進化に合わせて絶えず作り直されていくものである。
            </li>
          </ul>
          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteLabel}>
              <i className="ti ti-external-link" />
              出典
            </div>
            <div className={styles.sourceLinks}>
              <Ext
                href="https://martinfowler.com/articles/harness-engineering.html"
                className={styles.sourceChip}
              >
                Böckeler / martinfowler.com
                <i className="ti ti-arrow-up-right" />
              </Ext>
              <Ext
                href="https://addyosmani.com/blog/agent-harness-engineering/"
                className={styles.sourceChip}
              >
                Addy Osmani
                <i className="ti ti-arrow-up-right" />
              </Ext>
            </div>
          </div>
        </section>

        {/* 第8章 参考文献 */}
        <section id="references" className={styles.section}>
          <h2>
            <i className="ti ti-link" />
            8. 参考文献・出典
          </h2>
          <p>本ガイドは以下の一次情報源をもとに、2026年7月時点の情報として作成しました。</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>出典</th>
                  <th>著者・組織</th>
                  <th>タイトル</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className={styles.chip}>公式</span>Anthropic
                  </td>
                  <td>Anthropic Engineering</td>
                  <td>Best practices for Claude Code</td>
                  <td>
                    <Ext href="https://code.claude.com/docs/en/best-practices">
                      code.claude.com/docs/en/best-practices
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className={styles.chip}>公式</span>Anthropic
                  </td>
                  <td>Justin Young ほか, Anthropic</td>
                  <td>Effective harnesses for long-running agents</td>
                  <td>
                    <Ext href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">
                      anthropic.com/engineering/effective-harnesses-for-long-running-agents
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className={styles.chip}>公式</span>Anthropic
                  </td>
                  <td>Anthropic Engineering</td>
                  <td>Claude Code: Best practices for agentic coding（旧版）</td>
                  <td>
                    <Ext href="https://www.anthropic.com/engineering/claude-code-best-practices">
                      anthropic.com/engineering/claude-code-best-practices
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>Thoughtworks / martinfowler.com</td>
                  <td>Birgitta Böckeler</td>
                  <td>Harness engineering for coding agent users</td>
                  <td>
                    <Ext href="https://martinfowler.com/articles/harness-engineering.html">
                      martinfowler.com/articles/harness-engineering.html
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>Thoughtworks / martinfowler.com</td>
                  <td>Birgitta Böckeler</td>
                  <td>Maintainability sensors for coding agents（続編）</td>
                  <td>
                    <Ext href="https://martinfowler.com/articles/sensors-for-coding-agents.html">
                      martinfowler.com/articles/sensors-for-coding-agents.html
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className={styles.chip}>公式</span>OpenAI
                  </td>
                  <td>Ryan Lopopolo ほか, OpenAI</td>
                  <td>Harness engineering: leveraging Codex in an agent-first world</td>
                  <td>
                    <Ext href="https://openai.com/index/harness-engineering/">
                      openai.com/index/harness-engineering
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>個人ブログ（著名エンジニア）</td>
                  <td>Addy Osmani（元Google Chrome/AI DevXディレクター）</td>
                  <td>Agent Harness Engineering</td>
                  <td>
                    <Ext href="https://addyosmani.com/blog/agent-harness-engineering/">
                      addyosmani.com/blog/agent-harness-engineering
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>個人ブログ（著名エンジニア）</td>
                  <td>Simon Willison（Django共同開発者）</td>
                  <td>Designing agentic loops</td>
                  <td>
                    <Ext href="https://simonwillison.net/2025/Sep/30/designing-agentic-loops/">
                      simonwillison.net/2025/Sep/30/designing-agentic-loops
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>企業ブログ</td>
                  <td>LangChain (Viv Trivedy)</td>
                  <td>The Anatomy of an Agent Harness</td>
                  <td>
                    <Ext href="https://blog.langchain.com/the-anatomy-of-an-agent-harness/">
                      blog.langchain.com/the-anatomy-of-an-agent-harness
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>企業ブログ</td>
                  <td>HumanLayer (Kyle)</td>
                  <td>Skill Issue: Harness Engineering for Coding Agents</td>
                  <td>
                    <Ext href="https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents">
                      humanlayer.dev/blog/skill-issue
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>個人ブログ</td>
                  <td>Mitchell Hashimoto（HashiCorp/Terraform創業者）</td>
                  <td>My AI adoption journey</td>
                  <td>
                    <Ext href="https://mitchellh.com/writing/my-ai-adoption-journey">
                      mitchellh.com/writing/my-ai-adoption-journey
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>業界メディア</td>
                  <td>Thoughtworks Technology Podcast</td>
                  <td>What is harness engineering?</td>
                  <td>
                    <Ext href="https://www.thoughtworks.com/insights/podcasts/technology-podcasts/what-harness-engineering">
                      thoughtworks.com/insights/podcasts
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>業界メディア</td>
                  <td>Faros AI</td>
                  <td>Harness Engineering: Making AI Coding Agents Work in 2026</td>
                  <td>
                    <Ext href="https://www.faros.ai/blog/harness-engineering">
                      faros.ai/blog/harness-engineering
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>企業ブログ</td>
                  <td>Stripe Engineering</td>
                  <td>Minions: Stripe&#39;s one-shot end-to-end coding agents</td>
                  <td>
                    <Ext href="https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents">
                      stripe.dev/blog/minions
                    </Ext>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <footer className={styles.pageFooter}>
            <p>
              各情報源の内容は要約・言い換えのうえ本ガイドに統合しており、原文からの逐語的な引用は最小限（15語未満）に留めています。より詳細な一次情報や図版はリンク先の原文を直接ご参照ください。業界の議論は現在進行形で発展しており、特に第6章で触れた「振る舞いハーネス」や「ハーネステンプレート」は未解決の論点として各情報源でも明言されています。
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}
