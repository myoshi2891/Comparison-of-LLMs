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

      <button
        type="button"
        className={styles.sidebarToggle}
        id="menuToggle"
        aria-label="メニューを開く"
        aria-expanded="false"
        aria-controls="sidebar"
      >
        ☰
      </button>
      <div className={styles.sidebarOverlay} id="sidebarOverlay" />

      <aside className={styles.sidebar} id="sidebar">
        <div className={styles.brand}>OpenAI Codex Guide</div>
        <div className={styles.brandSub}>ハーネスエンジニアリング実践ガイド — 評価基盤編</div>
        <nav>
          <ul className={styles.tocList}>
            <li className={styles.tocItem}>
              <a
                href="#1-はじめに--なぜ評価基盤がハーネスエンジニアリングの核心なのか"
                className={`${styles.tocLink} ${styles.active}`}
              >
                1. はじめに — なぜ「評価基盤」がハーネスエンジニアリングの核心なのか
              </a>
            </li>
            <li className={styles.tocItem}>
              <a href="#2-ハーネスエンジニアリングとは何か" className={styles.tocLink}>
                2. ハーネスエンジニアリングとは何か
              </a>
            </li>
            <li className={styles.tocItem}>
              <a href="#3-なぜ評価が継続的でなければならないのか" className={styles.tocLink}>
                3. なぜ評価が「継続的」でなければならないのか
              </a>
            </li>
            <li className={styles.tocItem}>
              <a href="#4-評価基盤の7層モデル--詳細解説" className={styles.tocLink}>
                4. 評価基盤の7層モデル — 詳細解説
              </a>
            </li>
            <li className={styles.tocItem}>
              <a href="#5-ステップバイステップ実装ガイド" className={styles.tocLink}>
                5. ステップバイステップ実装ガイド
              </a>
            </li>
            <li className={styles.tocItem}>
              <a href="#6-ハーネス成熟度チェックリスト" className={styles.tocLink}>
                6. ハーネス成熟度チェックリスト
              </a>
            </li>
            <li className={styles.tocItem}>
              <a href="#7-アンチパターン" className={styles.tocLink}>
                7. アンチパターン
              </a>
            </li>
            <li className={styles.tocItem}>
              <a href="#8-まとめ" className={styles.tocLink}>
                8. まとめ
              </a>
            </li>
            <li className={styles.tocItem}>
              <a href="#9-参考文献" className={styles.tocLink}>
                9. 参考文献
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>
            Harness Engineering &middot; Evaluation Infrastructure
          </div>
          <h1 className={styles.heroTitle}>
            OpenAI Codexにおけるハーネスエンジニアリング実践ガイド
          </h1>
          <p className={styles.subtitle}>
            AIエージェントの品質を自動・継続的に測定する評価基盤の設計
          </p>
          <p className={styles.meta}>
            <span>
              対象読者: Codex CLI / Codex cloud
              を用いたエージェント駆動開発に取り組む中級〜上級エンジニア
            </span>
            <span>2026年7月29日時点の情報に基づく</span>
          </p>
        </div>

        <article className={styles.prose}>
          <p>
            対象読者: Codex CLI / Codex cloud
            を用いたエージェント駆動開発に取り組む中級〜上級エンジニア
          </p>
          <hr />

          {/* Section 1 */}
          <h2 id="1-はじめに--なぜ評価基盤がハーネスエンジニアリングの核心なのか">
            <span className={styles.h2Badge}>1</span>
            <span className={styles.h2Text}>
              はじめに — なぜ「評価基盤」がハーネスエンジニアリングの核心なのか
            </span>
          </h2>
          <p>
            2026年2月、OpenAIはエンジニアリングブログで「Harness engineering: leveraging Codex in an
            agent-first world」という記事を公開した。著者はOpenAIのRyan
            Lopopolo氏で、3人のエンジニアチームが5ヶ月間、
            <strong>人間が一行もコードを書かずに</strong>
            約100万行・1,500件のマージ済みプルリクエストからなる本番プロダクトを構築した実験の報告である。
          </p>
          <p>
            この実験が示した最大の教訓は、エージェントの能力そのものよりも「エージェントを取り巻く環境設計」が開発速度と品質を決定づけるという点にある。人間エンジニアの役割は「コードを書くこと」から「環境を設計し、意図を仕様化し、フィードバックループを構築すること」へ移行した。この環境設計とフィードバックループの総体こそが「ハーネス」であり、それを専門的に設計・運用する営みが「ハーネスエンジニアリング」と呼ばれる。
          </p>
          <p className={styles.callout}>
            感情的な満足感ではなく、エージェントのスループットが人間のレビュー能力を軽々と超えていく状況では、
            <strong>
              「良し悪しをどう機械的・継続的に判定するか」という評価基盤こそがハーネスの生命線になる
            </strong>
            。人間が全PRを読んでレビューするモデルは、1エンジニアあたり1日3.5件のPRが生成される環境ではそもそも成立しない。したがって、ハーネスエンジニアリングの実務は、突き詰めれば「エージェントの出力品質を自動的・継続的に測定し、悪化を検知し、改善サイクルへ差し戻す仕組み」を組み立てる作業に等しい。本ガイドはこの評価基盤の部分に焦点を絞り、OpenAI
            Codexというプラットフォーム上でそれをどう実装するかをステップバイステップで解説する。
          </p>
          <hr />

          {/* Section 2 */}
          <h2 id="2-ハーネスエンジニアリングとは何か">
            <span className={styles.h2Badge}>2</span>
            <span className={styles.h2Text}>ハーネスエンジニアリングとは何か</span>
          </h2>
          <h3 id="21-コンテキストエンジニアリングとの違い">
            2.1 コンテキストエンジニアリングとの違い
          </h3>
          <p>
            「コンテキストエンジニアリング」が問う問いは「エージェントに何を見せるべきか」であるのに対し、「ハーネスエンジニアリング」が問う問いは「システムは何を防ぎ、何を測定し、何を修正すべきか」である。前者がインプット側の設計だとすれば、後者はアウトプットの検証・強制・フィードバックの設計だと言える。
          </p>
          <p>両者は排他的ではなく、実際には積層する関係にある。</p>
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
          <h3 id="22-openaiの実証実験が示した構造">2.2 OpenAIの実証実験が示した構造</h3>
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
          <hr />

          {/* Section 3 */}
          <h2 id="3-なぜ評価が継続的でなければならないのか">
            <span className={styles.h2Badge}>3</span>
            <span className={styles.h2Text}>なぜ評価が「継続的」でなければならないのか</span>
          </h2>
          <h3 id="31-スループット増大とヒューマンqaのボトルネック化">
            3.1 スループット増大とヒューマンQAのボトルネック化
          </h3>
          <p>
            コード生成のスループットが増えるほど、ボトルネックは「コードを書く速度」から「品質を確認する速度」へ移動する。OpenAIの実験では、これに対応するためにアプリケーションのUI・ログ・メトリクス自体をCodexが直接読み書きできる形にする「アプリケーションの可読化(legibility)」が進められた。git
            worktreeごとにアプリを起動できるようにし、Chrome DevTools
            ProtocolをエージェントランタイムにMCP経由で組み込むことで、Codexはバグを再現し、修正を検証し、UI挙動を自ら推論できるようになった。
          </p>
          <h3 id="32-エントロピーは自然に増大する">3.2 エントロピーは自然に増大する</h3>
          <p className={styles.callout}>
            エージェントは既存パターンを模倣するため、リポジトリ内に不揃いな実装や最適でないパターンが一度でも紛れ込むと、それが複製され続けドリフトが蓄積する。OpenAIのチームは当初、毎週金曜日(稼働時間の20%)を「AIスロップ」の手作業クリーンアップに費やしていたが、これはスケールしないことが早々に判明した。最終的な解は「golden
            principles」と呼ぶ機械的なルール群をリポジトリに直接エンコードし、定期的なクリーンアップエージェントが逸脱をスキャンして品質グレードを更新し、的を絞ったリファクタリングPRを開くという、継続的な「ガベージコレクション」に相当する仕組みだった。技術的負債は複利で膨らむ高利子の借金に似ており、少しずつ返済し続ける方が、溜め込んで痛みを伴う形で一括処理するより常に有利だという整理である。
          </p>
          <p>
            この「継続的に少しずつ検出・修正する」設計思想こそが、次章で扱う評価基盤の各レイヤーに共通する原則である。
          </p>
          <hr />

          {/* Quicknav Grid */}
          <div className={styles.quicknavWrap}>
            <div className={styles.quicknavKicker}>
              評価基盤の7層モデル — クイックナビゲーション
            </div>
            <div className={styles.quicknavGrid}>
              <a
                className={`${styles.quicknavCard} ${styles.cardL1}`}
                href="#41-layer-1-セッション内自己検証ループralph-wiggum-loop"
              >
                <span className={styles.quicknavBadge}>L1</span>
                <span className={styles.quicknavTitle}>
                  セッション内自己検証ループ(Ralph Wiggum Loop)
                </span>
                <span className={styles.quicknavDesc}>
                  エージェント自身がその場で行う自己レビュー。最速だが最も主観的なフィードバック。
                </span>
              </a>
              <a
                className={`${styles.quicknavCard} ${styles.cardL2}`}
                href="#42-layer-2-リポジトリレベルのメカニカル強制"
              >
                <span className={styles.quicknavBadge}>L2</span>
                <span className={styles.quicknavTitle}>リポジトリレベルのメカニカル強制</span>
                <span className={styles.quicknavDesc}>
                  Linter・構造テスト・QUALITY_SCORE.mdでリポジトリの構造そのものを強制する。
                </span>
              </a>
              <a
                className={`${styles.quicknavCard} ${styles.cardL3}`}
                href="#43-layer-3-ランタイムオブザーバビリティによる実行時検証"
              >
                <span className={styles.quicknavBadge}>L3</span>
                <span className={styles.quicknavTitle}>
                  ランタイム・オブザーバビリティによる実行時検証
                </span>
                <span className={styles.quicknavDesc}>
                  Vector→Victoria Logs/Metrics/TracesでCodex自身が実行時の挙動を検証する。
                </span>
              </a>
              <a
                className={`${styles.quicknavCard} ${styles.cardL4}`}
                href="#44-layer-4-cicdにおける非対話型品質ゲートcodex-exec"
              >
                <span className={styles.quicknavBadge}>L4</span>
                <span className={styles.quicknavTitle}>
                  CI/CDにおける非対話型品質ゲート(codex exec)
                </span>
                <span className={styles.quicknavDesc}>
                  codex exec --output-schemaでPRごとに構造化された合否判定を返す。
                </span>
              </a>
              <a
                className={`${styles.quicknavCard} ${styles.cardL5}`}
                href="#45-layer-5-プラットフォームevals--tracesgradersdatasetseval-runsのフライホイール"
              >
                <span className={styles.quicknavBadge}>L5</span>
                <span className={styles.quicknavTitle}>
                  プラットフォームEvals — Traces・Graders・Datasets・Eval Runsのフライホイール
                </span>
                <span className={styles.quicknavDesc}>
                  Traces→Graders→Datasets→Eval Runsのフライホイールで継続的にベンチマークする。
                </span>
              </a>
              <a
                className={`${styles.quicknavCard} ${styles.cardL6}`}
                href="#46-layer-6-外部標準ベンチマーク--swe-bench-verifiedとterminal-bench-20--harbor"
              >
                <span className={styles.quicknavBadge}>L6</span>
                <span className={styles.quicknavTitle}>
                  外部標準ベンチマーク — SWE-bench VerifiedとTerminal-Bench 2.0 / Harbor
                </span>
                <span className={styles.quicknavDesc}>
                  SWE-Bench VerifiedやTerminal-Bench 2.0で業界標準に対する立ち位置を測る。
                </span>
              </a>
              <a
                className={`${styles.quicknavCard} ${styles.cardL7}`}
                href="#47-layer-7-継続的セキュリティ評価codex-security-cli"
              >
                <span className={styles.quicknavBadge}>L7</span>
                <span className={styles.quicknavTitle}>
                  継続的セキュリティ評価(Codex Security CLI)
                </span>
                <span className={styles.quicknavDesc}>
                  Codex Security CLIによる継続的な脆弱性スキャンとSARIF連携。
                </span>
              </a>
            </div>
          </div>

          {/* Section 4 */}
          <h2 id="4-評価基盤の7層モデル--詳細解説">
            <span className={styles.h2Badge}>4</span>
            <span className={styles.h2Text}>評価基盤の7層モデル — 詳細解説</span>
          </h2>

          {/* 4.1 */}
          <h3
            className={`${styles.layerH3} ${styles.layer1}`}
            id="41-layer-1-セッション内自己検証ループralph-wiggum-loop"
          >
            4.1 Layer 1: セッション内自己検証ループ(Ralph Wiggum Loop)
          </h3>
          <p>
            もっとも速いフィードバックは、エージェント自身がその場で行う自己レビューである。OpenAIのハーネスでは、Codexに対して「自分の変更をローカルでレビューし、ローカル/クラウド双方で追加のエージェントレビューを要求し、人間またはエージェントからのフィードバックに対応し、すべてのレビュアーが満足するまでループする」ことを指示している。この反復パターンは、Geoffrey
            Huntley氏が命名した「Ralph Wiggum Loop」(単純な{" "}
            <code>while :; do cat PROMPT.md | agent; done</code>{" "}
            型のループ)の一種として、OpenAIの記事内でも明示的に言及されている。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_2} />
          </div>
          <p>
            このレイヤーの評価基準は、人間が書いた固定チェックリストではなく、Codex自身が読み書きできる{" "}
            <code>gh</code>{" "}
            コマンド・ローカルスクリプト・リポジトリ埋め込みのSkillといった標準開発ツールを介して動的に決まる。人間がCLIへコピー&amp;ペーストして文脈を渡す必要がない点が要である。
          </p>

          {/* 4.2 */}
          <h3
            className={`${styles.layerH3} ${styles.layer2}`}
            id="42-layer-2-リポジトリレベルのメカニカル強制"
          >
            4.2 Layer 2: リポジトリレベルのメカニカル強制
          </h3>
          <p>
            Layer 1は「本人任せ」の評価だが、Layer
            2は「構造そのものが逸脱を許さない」設計である。OpenAIのハーネスでは、各ビジネスドメインを固定の層(Types
            → Config → Repo → Providers → Service → Runtime →
            UI)に分割し、依存方向を厳格に制限している。横断的関心事(認証・コネクタ・テレメトリ・フィーチャーフラグ)は「Providers」という単一の明示的インターフェースを通じてのみ入り込める。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_3} />
          </div>
          <p>
            この依存方向は人間のレビューではなく、Codex自身が生成したカスタムLinterと構造テストによって機械的に強制される。構造化ロギングやスキーマ・型の命名規則、ファイルサイズ上限、プラットフォーム固有の信頼性要件も同様にカスタムLintでチェックされる。Lintのエラーメッセージには、その場でエージェントへ是正手順を注入できるよう、修復手順そのものが埋め込まれている点が実務上のポイントである。
          </p>
          <p>
            さらに、リポジトリの <code>docs/</code> ディレクトリには <code>QUALITY_SCORE.md</code>{" "}
            のような「各プロダクトドメイン・各アーキテクチャ層を採点し、経時的なギャップを追跡する」文書が置かれ、これ自体がエージェントによって定期的に更新される。加えて「doc-gardening」エージェントが、実際のコード挙動と乖離した古いドキュメントをスキャンし、修正PRを自動的に開く。これらは、コードそのものではなく「リポジトリの整合性・鮮度」を継続測定する評価基盤の一形態である。
          </p>
          <p>
            参考:{" "}
            <Ext href="https://openai.com/index/harness-engineering/">
              Harness engineering: leveraging Codex in an agent-first world (openai.com)
            </Ext>{" "}
            /{" "}
            <Ext href="https://cookbook.openai.com/articles/codex_exec_plans">
              Using PLANS.md for multi-hour problem solving (OpenAI Cookbook)
            </Ext>
          </p>

          {/* 4.3 */}
          <h3
            className={`${styles.layerH3} ${styles.layer3}`}
            id="43-layer-3-ランタイムオブザーバビリティによる実行時検証"
          >
            4.3 Layer 3: ランタイム・オブザーバビリティによる実行時検証
          </h3>
          <p>
            静的な構造チェックだけでは「動くかどうか」は分からない。OpenAIのハーネスは、ログ・メトリクス・トレースをVectorで収集し、Victoria
            Logs / Victoria Metrics / Victoria
            Tracesへファンアウトするローカル観測可能性スタックを、git
            worktreeごとにエフェメラルに立ち上げている。Codexはこれを LogQL・PromQL・TraceQL
            で問い合わせ、相関分析を行った上で修正を実装し、アプリを再起動して同じワークロードやUIシナリオを再実行するというループを回す。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_4} />
          </div>
          <p>
            このレイヤーによって、「サービス起動を800ミリ秒未満で完了させる」「4つの重要なユーザージャーニーのどのスパンも2秒を超えない」といった、これまで自然言語では扱いにくかった性能要件がCodexにとって実行可能なタスクになる。あわせて、Chrome
            DevTools
            Protocolをランタイムに組み込み、DOMスナップショット・スクリーンショット・ナビゲーションを扱うSkillを用意することで、Codexはブラウザ操作を伴うUIバグの再現・修正検証も自律的に行えるようになる。単一のCodex実行が(人間が眠っている間に)6時間以上にわたり1つのタスクへ取り組み続けるケースも珍しくないという。
          </p>

          {/* 4.4 */}
          <h3
            className={`${styles.layerH3} ${styles.layer4}`}
            id="44-layer-4-cicdにおける非対話型品質ゲートcodex-exec"
          >
            4.4 Layer 4: CI/CDにおける非対話型品質ゲート(codex exec)
          </h3>
          <p>
            ここからは、エージェントの実行そのものを人間の監督なしにパイプライン化するレイヤーである。Codex
            CLIには <code>codex exec</code>{" "}
            という非対話モードが用意されており、対話TUIを開かずにスクリプトやCIジョブから起動できる。実行結果は終了コードで成否を判定でき、
            <code>--json</code>{" "}
            フラグで各イベント(コマンド実行・ファイル変更・エージェントメッセージ)を構造化されたJSONLストリームとして取得できるため、下流ツールでの機械的な判定に使いやすい。
          </p>
          <p>
            さらに <code>--output-schema</code> を指定すると、最終出力をJSON
            Schemaに準拠させることができる。たとえばPRレビューを「severity(重大度)」「issues(配列)」「summary(要約)」を持つ構造で返させれば、
            <code>jq</code> や後続のGitHub
            PRコメント投稿ツールへそのまま渡せる、採点可能なデータになる。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_5} />
          </div>
          <p>
            GitHub Actions環境では、CLIを自前でインストールしAPIキーを渡すよりも{" "}
            <code>openai/codex-action</code> を使う方が安全とされている。このアクションはCodex
            CLIのインストールとResponses
            APIプロキシの起動を代行し、リポジトリを直接チェックアウトするジョブに{" "}
            <code>OPENAI_API_KEY</code>{" "}
            をジョブレベル環境変数として置かないよう案内している(ビルドスクリプトやテスト、依存パッケージのライフサイクルフック経由でキーが読み取られる懸念があるため)。CI専用には{" "}
            <code>CODEX_API_KEY</code> という別名の環境変数を使うのが定石である。
          </p>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr className="header">
                  <th>フラグ / 環境変数</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd">
                  <td>
                    <code>codex exec &quot;&lt;task&gt;&quot;</code>
                  </td>
                  <td>
                    非対話モードでタスクを1回実行し、標準エラーへ進捗、標準出力へ最終メッセージを出す
                  </td>
                </tr>
                <tr className="even">
                  <td>
                    <code>--json</code>
                  </td>
                  <td>
                    各イベントを構造化JSONLとしてストリーム出力し、
                    <code>jq</code> 等で機械的に解析する
                  </td>
                </tr>
                <tr className="odd">
                  <td>
                    <code>--output-schema &lt;file&gt;</code>
                  </td>
                  <td>
                    最終出力をJSON Schemaに準拠させ、severityなどのフィールドで自動採点しやすくする
                  </td>
                </tr>
                <tr className="even">
                  <td>
                    <code>--ephemeral</code>
                  </td>
                  <td>セッションのrolloutファイルをディスクへ永続化しない(CIで推奨)</td>
                </tr>
                <tr className="odd">
                  <td>
                    <code>--sandbox read-only / workspace-write</code>
                  </td>
                  <td>エージェントに与える権限範囲を明示指定する</td>
                </tr>
                <tr className="even">
                  <td>
                    <code>CODEX_API_KEY</code>
                  </td>
                  <td>
                    CI専用の資格情報(<code>OPENAI_API_KEY</code>{" "}
                    をジョブ環境変数に直接置くことは非推奨)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            参考:{" "}
            <Ext href="https://developers.openai.com/codex/non-interactive-mode">
              Non-interactive mode (developers.openai.com)
            </Ext>{" "}
            /{" "}
            <Ext href="https://developers.openai.com/codex/github-action">
              Codex GitHub Action (developers.openai.com)
            </Ext>
          </p>

          {/* 4.5 */}
          <h3
            className={`${styles.layerH3} ${styles.layer5}`}
            id="45-layer-5-プラットフォームevals--tracesgradersdatasetseval-runsのフライホイール"
          >
            4.5 Layer 5: プラットフォームEvals — Traces・Graders・Datasets・Eval
            Runsのフライホイール
          </h3>
          <p>
            Codex自体のCI組み込みが「タスクが1件成功したか」を判定するのに対し、OpenAI
            PlatformのEvals機能群は「エージェントの振る舞いが時間軸・変更軸でどう変化しているか」を体系的に追跡するためのものである。公式ドキュメントは、この評価基盤を次の順序で育てていくことを推奨している。
          </p>
          <ol type="1">
            <li>
              <strong>Trace grading(トレース評価)</strong>:
              まだ挙動をデバッグしている段階では、1回の実行におけるモデル呼び出し・ツール呼び出し・ガードレール・ハンドオフの一連の記録である「トレース」を採取し、それをGraderで採点する。「正しいツールを選んだか」「ハンドオフは適切なタイミングで発生したか」「ワークフローが指示や安全ポリシーに違反していないか」といった問いに答えるのに向く。
            </li>
            <li>
              <strong>Datasets &amp; Eval Runs(データセットと評価実行)</strong>:
              「良い」の基準が固まったら、個別トレースの確認から、再現可能なデータセットと評価実行(Eval
              Run)へ移行する。これにより、プロンプトやモデルの変更を継続的にベンチマークし、時系列で比較できるようになる。
            </li>
            <li>
              <strong>外部モデルとの比較やバッチ評価</strong>
              など高度な機能が必要な場合は、Evals APIをデータセットと組み合わせて使う。
            </li>
          </ol>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_6} />
          </div>
          <p>Graderには複数の型があり、判定したい品質の性質に応じて使い分ける。</p>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr className="header">
                  <th>グレーダー種類</th>
                  <th>判定方法</th>
                  <th>適したケース</th>
                  <th>出力</th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd">
                  <td>
                    <code>string_check</code>
                  </td>
                  <td>
                    <code>eq</code> / <code>ne</code> / <code>like</code> / <code>ilike</code>{" "}
                    による文字列比較
                  </td>
                  <td>決定的な正解文字列がある場合</td>
                  <td>0 または 1</td>
                </tr>
                <tr className="even">
                  <td>
                    <code>text_similarity</code>
                  </td>
                  <td>
                    <code>fuzzy_match</code> / <code>bleu</code> / <code>rouge_l</code>{" "}
                    などの類似度指標
                  </td>
                  <td>表現ゆれはあるが意味的に近い正解がある場合</td>
                  <td>0.0〜1.0</td>
                </tr>
                <tr className="odd">
                  <td>
                    <code>python</code> (<code>PythonGrader</code>)
                  </td>
                  <td>
                    任意のPythonコードを実行し <code>grade</code> 関数の戻り値を採点に使う
                  </td>
                  <td>テスト実行結果・静的解析結果など機械的に判定できるもの</td>
                  <td>浮動小数点値</td>
                </tr>
                <tr className="even">
                  <td>
                    <code>score_model</code> (<code>ScoreModelGrader</code>)
                  </td>
                  <td>LLMに0.0〜1.0のスコアを付けさせる</td>
                  <td>文章のトーンや設計の妥当性など主観が絡む品質評価</td>
                  <td>0.0〜1.0</td>
                </tr>
                <tr className="odd">
                  <td>
                    <code>label_model</code> (<code>LabelModelGrader</code>)
                  </td>
                  <td>LLMにカテゴリラベルを付与させ、合格ラベル集合と照合する</td>
                  <td>合格/不合格、深刻度カテゴリなどの分類</td>
                  <td>ラベル文字列</td>
                </tr>
                <tr className="even">
                  <td>
                    <code>multi_grader</code> (<code>MultiGrader</code>)
                  </td>
                  <td>複数グレーダーの結果を計算式で合成する</td>
                  <td>複数基準を重み付けして総合スコアにしたい場合</td>
                  <td>合成スコア</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            なお、モデルグレーダーを使う際は「グレーダーハッキング(reward
            hacking)」に注意する必要がある。モデルが採点基準の弱点を学習してしまい、モデルグレーダーの評価では高得点でも、専門家による人手評価では低品質という乖離が生じることがある。これを検知するために、モデルグレーダーによる評価と専門家による人手評価の両方を定期的に突き合わせることが推奨されている。
          </p>
          <p>
            参考:{" "}
            <Ext href="https://developers.openai.com/api/docs/guides/agent-evals">
              Evaluate agent workflows (developers.openai.com)
            </Ext>{" "}
            /{" "}
            <Ext href="https://developers.openai.com/api/docs/guides/graders">
              Graders (developers.openai.com)
            </Ext>
          </p>

          {/* 4.6 */}
          <h3
            className={`${styles.layerH3} ${styles.layer6}`}
            id="46-layer-6-外部標準ベンチマーク--swe-bench-verifiedとterminal-bench-20--harbor"
          >
            4.6 Layer 6: 外部標準ベンチマーク — SWE-bench VerifiedとTerminal-Bench 2.0 / Harbor
          </h3>
          <p>
            自社ハーネス内部の評価だけでは、「今使っているモデルやエージェント設定が業界の到達点に対してどの位置にあるか」は分からない。ここで外部の標準ベンチマークが役割を果たす。
          </p>
          <p>
            <strong>SWE-Bench Verified</strong>は、実世界のGitHub
            issue解決能力を人手検証済みのタスクセットで測る、コーディングエージェント評価のデファクトスタンダードの一つである。著名な独立系のAI論評者であるSimon
            Willison氏は、2025年11月のGPT-5.1-Codex-Max発表時に、OpenAIが自己申告したSWE-Bench
            Verifiedスコアが reasoning
            effort「high」で76.5%、新設の「xhigh」で77.9%だったと報告しており、これはGemini 3
            Pro(76.2%)やClaude Sonnet 4.5(77.2%)をわずかに上回る水準だったと分析している。
          </p>
          <p>
            <strong>Terminal-Bench 2.0</strong>は、Stanford大学とLaude Instituteが主導し、Snorkel
            AIなどが貢献するオープンな端末操作エージェント評価ベンチマークである。89件のタスクがそれぞれ独立したDockerコンテナで実行され、シェルスクリプティング、システム管理、暗号、COBOLの現代化、科学技術系Pythonの移植など16カテゴリにまたがる難易度別タスクで構成される。同時にリリースされた
            <strong>Harbor</strong>
            は、クラウド上のコンテナへ並列にロールアウトを展開できる評価ハーネスで、Daytona・Modalなど複数プロバイダに対応し、任意のエージェントアーキテクチャに対して汎用的に使えるよう設計されている。VentureBeatの報道によれば、Terminal-Bench
            2.0発表当初のリーダーボードではOpenAIのCodex
            CLIが49.6%のタスク成功率で首位に立っていた。Simon
            Willison氏も、GPT-5.1-Codex-MaxがTerminal Bench 2.0で58.1%を記録し、Gemini 3
            Pro(54.2%)やSonnet 4.5(42.8%)を上回ったと報告している。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_7} />
          </div>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr className="header">
                  <th>ベンチマーク</th>
                  <th>測定対象</th>
                  <th>特徴</th>
                  <th>参考スコア(2025年11月時点、自己申告含む)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd">
                  <td>SWE-Bench Verified</td>
                  <td>実世界のGitHub issue解決</td>
                  <td>人手検証済みタスクセット</td>
                  <td>GPT-5.1-Codex-Max: high 76.5% / xhigh 77.9%</td>
                </tr>
                <tr className="even">
                  <td>Terminal-Bench 2.0</td>
                  <td>端末操作タスク(89件・コンテナ隔離)</td>
                  <td>Harborによる並列コンテナ評価、milestone報酬</td>
                  <td>GPT-5.1-Codex-Max: 58.1%(初期リーダーボードではCodex CLIが49.6%で首位)</td>
                </tr>
                <tr className="odd">
                  <td>HumanEval</td>
                  <td>関数単位のコード生成</td>
                  <td>pass@1 / pass@100</td>
                  <td>参考: 初代Codex 12Bモデルでpass@1 28.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            社内ハーネスの設計にこれらのベンチマークを組み込む実務上の意義は、単に「流行りの数字を追う」ことではない。むしろ、自社のタスク分布に近い公開ベンチマークのサブセットを定点観測し、モデルのバージョンアップやreasoning
            effortの変更が自社ワークロードにどう波及するかを、外部の再現可能な基準に照らして事前に把握することにある。
          </p>
          <p>
            参考:{" "}
            <Ext href="https://simonwillison.net/tags/gpt-codex/">Simon Willison on gpt-codex</Ext>{" "}
            / <Ext href="https://simonwillison.net/tags/evals/">Simon Willison on evals</Ext> /{" "}
            <Ext href="https://venturebeat.com/ai/terminal-bench-2-0-launches-alongside-harbor-a-new-framework-for-testing">
              Terminal-Bench 2.0 launches alongside Harbor (VentureBeat)
            </Ext>{" "}
            /{" "}
            <Ext href="https://www.tbench.ai/news/announcement-2-0">
              Introducing Terminal-Bench 2.0 and Harbor (tbench.ai)
            </Ext>
          </p>

          {/* 4.7 */}
          <h3
            className={`${styles.layerH3} ${styles.layer7}`}
            id="47-layer-7-継続的セキュリティ評価codex-security-cli"
          >
            4.7 Layer 7: 継続的セキュリティ評価(Codex Security CLI)
          </h3>
          <p>
            品質測定はコードの正しさだけでなく、セキュリティ面の継続監査も含む。OpenAIは2026年7月末、内部では「Aardvark」と呼ばれていたセキュリティレビュー機能を、Apache
            2.0ライセンスのオープンソースCLIツール <code>@openai/codex-security</code>{" "}
            として公開した。このツールは単一リポジトリのスキャンだけでなく、GitHub上のリポジトリをまとめて検出する、あるいはCSVインベントリから再開可能なキャンペーンとして実行する「bulk-scan」に対応しており、組織全体のリポジトリ群を継続的に棚卸しする用途を想定している。
          </p>
          <p>
            CI組み込みの観点では、プルリクエストの差分だけを対象にスキャンする <code>--diff</code>{" "}
            オプション、結果をSARIF形式でアップロードするサポート、重大度に基づくポリシー設定が提供されている。認証面では、対話的な利用ではChatGPTサインインが使われる一方、CIやJSON/JSONL出力など非対話コンテキストでは環境変数のAPIキーがデフォルトで使われるという振り分けになっている。スキャン結果は人間可読な{" "}
            <code>report.md</code> に加え、<code>findings.json</code> や <code>coverage.json</code>{" "}
            といった機械可読アーティファクトとしても出力されるため、Layer 4のCIゲートやLayer
            5のダッシュボードへそのまま接続できる。
          </p>
          <p>
            参考:{" "}
            <Ext href="https://github.com/openai/codex-security">
              openai/codex-security (GitHub)
            </Ext>{" "}
            /{" "}
            <Ext href="https://developers.openai.com/codex/security">
              Codex Security (developers.openai.com)
            </Ext>{" "}
            /{" "}
            <Ext href="https://the-decoder.com/openai-open-sources-codex-security-cli-to-help-developers-find-and-fix-vulnerabilities-from-the-command-line/">
              OpenAI open-sources Codex Security CLI (the-decoder.com)
            </Ext>
          </p>
          <hr />

          {/* Section 5 */}
          <h2 id="5-ステップバイステップ実装ガイド">
            <span className={styles.h2Badge}>5</span>
            <span className={styles.h2Text}>ステップバイステップ実装ガイド</span>
          </h2>
          <p>
            以下は、上記7層モデルを実際のリポジトリへ段階的に導入する際の推奨順序である。小さなプロジェクトであっても、Step
            1〜4は初日から着手できる規模感で設計してある。
          </p>
          <h3 id="step-1-agentsmdを目次として設計する">
            Step 1: AGENTS.mdを「目次」として設計する
          </h3>
          <p>
            OpenAIのチームは当初「一つの巨大なAGENTS.md」を試みたが、これは失敗パターンだと結論づけている。理由は、コンテキストが希少資源であり巨大な指示ファイルがタスクやコードそのものを押し出してしまうこと、すべてが「重要」だと何も重要でなくなること、モノリシックなファイルは即座に陳腐化すること、そして単一の塊は機械的なチェック(網羅性・鮮度・所有者・相互リンク)になじまないことである。
          </p>
          <p>
            そこでAGENTS.mdは百科事典ではなく「目次」として扱い、実体は{" "}
            <code>docs/design-docs/</code> <code>docs/exec-plans/</code>{" "}
            <code>docs/product-specs/</code> <code>docs/references/</code>{" "}
            といった構造化ディレクトリに置く。専用のLinterとCIジョブが、この知識ベースが最新で相互リンクされ正しく構造化されているかを検証し、実態と乖離した記述を検出する「doc-gardening」エージェントが定期的に修正PRを開く。これ自体が、リポジトリのドキュメント品質を継続測定する評価基盤の一部である。
          </p>
          <h3 id="step-2-plansmdexecplansで長時間タスクの検証可能性を担保する">
            Step 2: PLANS.md(ExecPlans)で長時間タスクの検証可能性を担保する
          </h3>
          <p>
            複雑な機能追加やリファクタリングでは、単発のプロンプトではなく「ExecPlan」という生きた設計文書を使う。OpenAI
            Cookbookが公開しているテンプレートは、<code>Progress</code>
            (チェックリスト形式の進捗)・<code>Surprises &amp; Discoveries</code>
            (想定外の発見)・<code>Decision Log</code>(意思決定記録)・
            <code>Outcomes &amp; Retrospective</code>
            (成果の振り返り)という4つの必須セクションを持つことを要求する。これらのセクションは、7時間を超えるような長時間の単一エージェント実行であっても、途中経過と意思決定の根拠を後から検証可能にするための「監査ログ」として機能する。評価基盤の観点では、このExecPlanこそが「その変更が何を達成しようとしたか」という受け入れ基準(Acceptance)の一次情報源になる。
          </p>
          <h3 id="step-3-アーキテクチャをメカニカルに強制する">
            Step 3: アーキテクチャをメカニカルに強制する
          </h3>
          <p>
            4.2節で述べたレイヤードアーキテクチャとカスタムLinterを整備する。ポイントは、実装の細部を規定するのではなく「不変条件(invariant)」だけを強制することである。境界でのデータ形状のパースを義務付けるが、それをZodで行うかどうかは指定しない、といった具合に、境界は厳格に・境界内の自由度は大きく保つのが基本方針である。
          </p>
          <h3 id="step-4-ローカルオブザーバビリティスタックを構築する">
            Step 4: ローカルオブザーバビリティスタックを構築する
          </h3>
          <p>
            4.3節のVector→Victoria
            Logs/Metrics/Tracesのようなスタックをworktreeごとにエフェメラルに立ち上げられるようにする。最初から完璧な可観測性を目指す必要はなく、「サービス起動時間」や「重要ユーザージャーニーのレイテンシ」など、まず1〜2個の定量指標をCodexが自分で問い合わせられるようにするところから始めるのが現実的である。
          </p>
          <h3 id="step-5-codex-execでcicdに非対話型の品質ゲートを組み込む">
            Step 5: codex execでCI/CDに非対話型の品質ゲートを組み込む
          </h3>
          <p>
            4.4節の <code>openai/codex-action</code> と <code>codex exec --output-schema</code>{" "}
            を使い、PRごとに構造化された品質レポートを生成する。最初のうちはブロッキングではなく「コメントを残すだけ」の緩いゲートから始め、誤検知率が十分下がった段階で重大度に応じたマージブロックへ昇格させると、開発フローへの摩擦を抑えられる。
          </p>
          <h3 id="step-6-openai-evals-apiでドメイン固有のグレーダーを構築する">
            Step 6: OpenAI Evals APIでドメイン固有のグレーダーを構築する
          </h3>
          <p>
            Traceを最初は目視で確認し、「良い」の基準が言語化できたら、その基準を4.5節のグレーダー(string_check・python・score_model・label_modelなど)としてコード化し、DatasetとEval
            Runへ昇格させる。重要なのは、最初から巨大な評価スイートを作ろうとしないことである。1〜2個の高頻度な失敗モードに対応するグレーダーから始め、Eval
            Runの結果を見ながら段階的に拡張するのが、Traces→Graders→Datasets→Eval
            Runsというフライホイールの回し方として推奨されている進め方である。
          </p>
          <h3 id="step-7-外部ベンチマークで継続的にモデル設定を評価する">
            Step 7: 外部ベンチマークで継続的にモデル/設定を評価する
          </h3>
          <p>
            4.6節のSWE-Bench VerifiedやTerminal-Bench
            2.0/Harborのような外部ベンチマークを、モデルのバージョンアップやreasoning
            effort変更のたびに(あるいは定期的に)自社のタスク分布に近いサブセットで再実行し、内部Eval
            Runの結果と突き合わせる。これにより、「モデルが賢くなった」という抽象的な期待と、「自社の具体的なワークロードでも実際に改善したか」という実測を切り分けられる。
          </p>
          <h3 id="step-8-codex-security-cliで継続的セキュリティスキャンを組み込む">
            Step 8: Codex Security CLIで継続的セキュリティスキャンを組み込む
          </h3>
          <p>
            4.7節のツールをまずは非クリティカルな1つのサービスに対してローカル実行し、誤検知傾向を把握したうえで、PR差分スキャン(
            <code>--diff</code>
            )をCIに追加し、重大度「high」以上のみをブロック対象とするような段階的な導入が現実的である。組織全体のリポジトリ棚卸しにはbulk-scanを用いる。
          </p>
          <h3 id="step-9-エントロピー対策--golden-principlesとgarbage-collection">
            Step 9: エントロピー対策 — Golden PrinciplesとGarbage Collection
          </h3>
          <p>
            Step
            1〜8がすべて機能しても、時間とともにパターンの不揃いは蓄積する。3.2節で述べた通り、これに対する解は人手による一括クリーンアップではなく、機械的なルール(golden
            principles)をリポジトリに明文化し、定期実行される背景タスクが逸脱をスキャンして品質グレードを更新し、小さなリファクタリングPRを自動的に開き続けることである。1分以内でレビューでき自動マージできる粒度に保つことが、このループが破綻しない鍵になる。
          </p>
          <hr />

          {/* Section 6 */}
          <h2 id="6-ハーネス成熟度チェックリスト">
            <span className={styles.h2Badge}>6</span>
            <span className={styles.h2Text}>ハーネス成熟度チェックリスト</span>
          </h2>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr className="header">
                  <th>観点</th>
                  <th>未成熟な状態</th>
                  <th>成熟した状態</th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd">
                  <td>指示ファイル</td>
                  <td>AGENTS.mdが数千行の百科事典で常に陳腐化している</td>
                  <td>
                    AGENTS.mdは目主に徹し、詳細は<code>docs/</code>
                    配下でLintにより鮮度検証される
                  </td>
                </tr>
                <tr className="even">
                  <td>アーキテクチャ強制</td>
                  <td>コードレビューでスタイルを都度指摘している</td>
                  <td>カスタムLinter/構造テストが依存方向を機械的にブロックする</td>
                </tr>
                <tr className="odd">
                  <td>実行時検証</td>
                  <td>手元で目視確認してからデプロイする</td>
                  <td>
                    worktreeごとの観測可能性スタックをCodexがLogQL/PromQL/TraceQLで自己検証する
                  </td>
                </tr>
                <tr className="even">
                  <td>CIゲート</td>
                  <td>人間が全PRを読んでからマージする</td>
                  <td>
                    <code>codex exec --output-schema</code>
                    が構造化された合否判定をPRごとに返す
                  </td>
                </tr>
                <tr className="odd">
                  <td>品質評価</td>
                  <td>「なんとなく良さそう」で判断している</td>
                  <td>Traces→Graders→Datasets→Eval Runsのフライホイールで定量追跡している</td>
                </tr>
                <tr className="even">
                  <td>モデル選定</td>
                  <td>発表時のベンチマーク数値だけで乗り換える</td>
                  <td>
                    自社タスク分布に近い外部ベンチマークのサブセットと内部Eval Runを突き合わせる
                  </td>
                </tr>
                <tr className="odd">
                  <td>セキュリティ</td>
                  <td>気づいたときに手動でレビューする</td>
                  <td>Codex Security CLIによる継続スキャンとSARIF連携がCIに組み込まれている</td>
                </tr>
                <tr className="even">
                  <td>技術的負債</td>
                  <td>定期的な一括クリーンアップ(週次の手作業日など)</td>
                  <td>Golden Principles + 背景クリーンアップエージェントによる日次の小さな返済</td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr />

          {/* Section 7 */}
          <h2 id="7-アンチパターン">
            <span className={styles.h2Badge}>7</span>
            <span className={styles.h2Text}>アンチパターン</span>
          </h2>
          <ul>
            <li>
              <strong>巨大な単一AGENTS.md</strong>:
              すべてを1ファイルに詰め込むと、コンテキストを圧迫しつつも即座に陳腐化し、機械的な検証もできなくなる。
            </li>
            <li>
              <strong>人間レビューをボトルネックとして温存する</strong>:
              エージェントのスループットが人間の目視レビュー速度を超えた段階で、全件人間レビューを維持しようとすると、せっかくの速度向上が失われる。
            </li>
            <li>
              <strong>モデルグレーダーだけに依存する</strong>:
              score_model/label_modelのようなモデルグレーダーのみに頼ると、グレーダーハッキング(reward
              hacking)によってモデルグレーダー上のスコアは高いのに実際の品質は低い、という乖離に気づけなくなる。定期的な人手評価との突き合わせが必要である。
            </li>
            <li>
              <strong>発表ベンチマーク数値の鵜呑み</strong>: SWE-Bench VerifiedやTerminal-Bench
              2.0のスコアは自己申告や特定タスク分布に基づくものであり、自社ワークロードでの実測(内部Eval
              Run)と併せて解釈する必要がある。
            </li>
            <li>
              <strong>CI/CDの資格情報をジョブ環境変数に直置きする</strong>:
              リポジトリを直接チェックアウトするジョブに
              <code>OPENAI_API_KEY</code>
              をジョブレベル環境変数として設定すると、ビルドスクリプトや依存パッケージのライフサイクルフック経由で漏えいするリスクがある。CI専用の
              <code>CODEX_API_KEY</code>や、<code>openai/codex-action</code>
              が提供するプロキシ経由の運用が推奨される。
            </li>
            <li>
              <strong>一括クリーンアップへの先送り</strong>:
              技術的負債の返済を「まとまった時間ができたら」に先送りすると、複利的に膨らんだ負債を痛みを伴う形で処理する羽目になる。小さく・頻繁に返済する設計の方が総コストは低い。
            </li>
          </ul>
          <hr />

          {/* Section 8 */}
          <h2 id="8-まとめ">
            <span className={styles.h2Badge}>8</span>
            <span className={styles.h2Text}>まとめ</span>
          </h2>
          <p>
            OpenAI
            Codexにおけるハーネスエンジニアリングは、「エージェントに何を書かせるか」の設計から、「エージェントが書いたものをどう継続的に検証し、悪化をどう検知し、改善サイクルへどう差し戻すか」という評価基盤の設計へと重心を移す営みである。本ガイドで整理した7層モデル——セッション内自己検証、リポジトリのメカニカル強制、ランタイム・オブザーバビリティ、CI/CDの非対話型ゲート、プラットフォームEvals、外部標準ベンチマーク、継続的セキュリティ評価——は、それぞれフィードバック速度と客観性のトレードオフが異なる。単一のレイヤーに頼るのではなく、速いレイヤーで日々の逸脱を吸収しながら、遅いレイヤーで長期的な方向性を検証するという多層防御的な設計が、エージェントのスループットが人間の監督能力を上回る時代における現実的な解である。
          </p>
          <hr />

          {/* Section 9 */}
          <h2 id="9-参考文献">
            <span className={styles.h2Badge}>9</span>
            <span className={styles.h2Text}>参考文献</span>
          </h2>
          <div className={styles.refGrid}>
            <div className={styles.refCard}>
              <h3 id="openai公式ソース">OpenAI公式ソース</h3>
              <ul>
                <li>
                  OpenAI. &quot;Harness engineering: leveraging Codex in an agent-first world.&quot;
                  (2026年2月11日) —{" "}
                  <Ext href="https://openai.com/index/harness-engineering/">
                    &nearr; https://openai.com/index/harness-engineering/
                  </Ext>
                </li>
                <li>
                  OpenAI Developers. &quot;Non-interactive mode.&quot; —{" "}
                  <Ext href="https://developers.openai.com/codex/non-interactive-mode">
                    &nearr; https://developers.openai.com/codex/non-interactive-mode
                  </Ext>
                </li>
                <li>
                  OpenAI Developers. &quot;Codex GitHub Action.&quot; —{" "}
                  <Ext href="https://developers.openai.com/codex/github-action">
                    &nearr; https://developers.openai.com/codex/github-action
                  </Ext>
                </li>
                <li>
                  OpenAI Cookbook. Aaron Friel. &quot;Using PLANS.md for multi-hour problem
                  solving.&quot; —{" "}
                  <Ext href="https://cookbook.openai.com/articles/codex_exec_plans">
                    &nearr; https://cookbook.openai.com/articles/codex_exec_plans
                  </Ext>
                </li>
                <li>
                  OpenAI Developers. &quot;Evaluate agent workflows.&quot; —{" "}
                  <Ext href="https://developers.openai.com/api/docs/guides/agent-evals">
                    &nearr; https://developers.openai.com/api/docs/guides/agent-evals
                  </Ext>
                </li>
                <li>
                  OpenAI Developers. &quot;Graders.&quot; —{" "}
                  <Ext href="https://developers.openai.com/api/docs/guides/graders">
                    &nearr; https://developers.openai.com/api/docs/guides/graders
                  </Ext>
                </li>
                <li>
                  OpenAI. GitHub. &quot;codex-security.&quot; —{" "}
                  <Ext href="https://github.com/openai/codex-security">
                    &nearr; https://github.com/openai/codex-security
                  </Ext>
                </li>
                <li>
                  OpenAI Developers. &quot;Codex Security.&quot; —{" "}
                  <Ext href="https://developers.openai.com/codex/security">
                    &nearr; https://developers.openai.com/codex/security
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCard}>
              <h3 id="外部評価ベンチマーク研究機関">外部評価ベンチマーク・研究機関</h3>
              <ul>
                <li>
                  Stanford University / Laude Institute. &quot;Introducing Terminal-Bench 2.0 and
                  Harbor.&quot; —{" "}
                  <Ext href="https://www.tbench.ai/news/announcement-2-0">
                    &nearr; https://www.tbench.ai/news/announcement-2-0
                  </Ext>
                </li>
                <li>
                  Snorkel AI. &quot;Terminal-Bench 2.0: Raising the bar for AI agent
                  evaluation.&quot; —{" "}
                  <Ext href="https://snorkel.ai/blog/terminal-bench-2-0-raising-the-bar-for-ai-agent-evaluation/">
                    &nearr;
                    https://snorkel.ai/blog/terminal-bench-2-0-raising-the-bar-for-ai-agent-evaluation/
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCard}>
              <h3 id="著名な開発者による分析">著名な開発者による分析</h3>
              <ul>
                <li>
                  Simon Willison. &quot;Simon Willison on gpt-codex&quot; (タグページ) —{" "}
                  <Ext href="https://simonwillison.net/tags/gpt-codex/">
                    &nearr; https://simonwillison.net/tags/gpt-codex/
                  </Ext>
                </li>
                <li>
                  Simon Willison. &quot;Simon Willison on evals&quot; (タグページ) —{" "}
                  <Ext href="https://simonwillison.net/tags/evals/">
                    &nearr; https://simonwillison.net/tags/evals/
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCard}>
              <h3 id="業界メディア報道">業界メディア報道</h3>
              <ul>
                <li>
                  InfoQ. &quot;OpenAI Introduces Harness Engineering: Codex Agents Power Large-Scale
                  Software Development.&quot; —{" "}
                  <Ext href="https://www.infoq.com/news/2026/02/openai-harness-engineering-codex/">
                    &nearr; https://www.infoq.com/news/2026/02/openai-harness-engineering-codex/
                  </Ext>
                </li>
                <li>
                  Milvus Blog. &quot;What Is Harness Engineering for AI Agents?&quot; —{" "}
                  <Ext href="https://milvus.io/blog/harness-engineering-ai-agents.md">
                    &nearr; https://milvus.io/blog/harness-engineering-ai-agents.md
                  </Ext>
                </li>
                <li>
                  VentureBeat. &quot;Terminal-Bench 2.0 launches alongside Harbor, a new framework
                  for testing agents in containers.&quot; —{" "}
                  <Ext href="https://venturebeat.com/ai/terminal-bench-2-0-launches-alongside-harbor-a-new-framework-for-testing">
                    &nearr;
                    https://venturebeat.com/ai/terminal-bench-2-0-launches-alongside-harbor-a-new-framework-for-testing
                  </Ext>
                </li>
                <li>
                  The Decoder. &quot;OpenAI open-sources Codex Security CLI to help developers find
                  and fix vulnerabilities from the command line.&quot; —{" "}
                  <Ext href="https://the-decoder.com/openai-open-sources-codex-security-cli-to-help-developers-find-and-fix-vulnerabilities-from-the-command-line/">
                    &nearr;
                    https://the-decoder.com/openai-open-sources-codex-security-cli-to-help-developers-find-and-fix-vulnerabilities-from-the-command-line/
                  </Ext>
                </li>
              </ul>
            </div>
          </div>
        </article>

        <footer className={styles.pageFooter}>
          本ガイドは2026年7月29日時点で公開されている一次情報(OpenAI公式ブログ・公式ドキュメント)および著名な開発者・研究機関の分析記事をもとに作成しています。詳細な出典は「9.
          参考文献」を参照してください。
        </footer>
      </main>
    </div>
  );
}
