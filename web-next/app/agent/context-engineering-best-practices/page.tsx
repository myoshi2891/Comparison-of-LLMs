import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title:
    "コンテキストエンジニアリング実践ガイド — Write / Select / Compress / Isolate | LLM-Studies",
  description:
    "プロンプト単体の最適化ではなく、エージェントが推論の瞬間に参照するトークン集合全体—システムプロンプト、ツール定義、履歴、外部データ、メモリ—を設計する実践ガイド。",
};

const DIAGRAMS = {
  d1: `flowchart TB
    subgraph CTX["コンテキストウィンドウ(有限のリソース)"]
        SP["システムプロンプト<br/>役割・振る舞い・出力形式の指示"]
        TL["ツール定義<br/>Function Schema・パラメータ説明"]
        FX["Few-shotの例<br/>望ましい入出力のサンプル"]
        MH["メッセージ履歴<br/>ユーザー発話・エージェントの行動記録"]
        RD["取得データ<br/>RAG検索結果・ツール実行結果"]
        MEM["メモリ<br/>セッションをまたいで永続化されたノート"]
    end
    SP --> LLM["LLMによる推論"]
    TL --> LLM
    FX --> LLM
    MH --> LLM
    RD --> LLM
    MEM --> LLM
    LLM --> OUT["次のアクション or 最終応答"]`,

  d2: `flowchart LR
    A["エージェントの実行ステップ"] --> W["Write: 書き出す<br/>ウィンドウの外に保存する"]
    A --> S["Select: 選び取る<br/>必要な情報だけを呼び戻す"]
    A --> C["Compress: 圧縮する<br/>必要なトークンだけを残す"]
    A --> I["Isolate: 分離する<br/>サブタスクごとに独立した窓を持つ"]
    W --> CTX[("コンテキストウィンドウ")]
    S --> CTX
    C --> CTX
    I --> CTX
    CTX --> LLM["LLM推論"]`,

  d3: `sequenceDiagram
    participant U as ユーザー
    participant A as エージェント(LLM)
    participant TS as Tool Search Tool
    participant T as ツール群(数百〜数千)
    U->>A: タスクを依頼
    A->>TS: 必要そうなツールをクエリで検索
    TS->>T: 該当するツールのみ defer_loading を解除
    T-->>A: 必要なツール定義のみ注入される
    A->>T: 選ばれたツールを実行
    T-->>A: 実行結果(構造化データ)
    A-->>U: 応答`,

  d4: `flowchart LR
    D["ドキュメント群"] --> CH["チャンキング<br/>構造認識 + 意味的分割"]
    CH --> EMB["埋め込み生成"]
    EMB --> IDX[("ベクトルDB / ハイブリッド索引")]
    Q["ユーザークエリ"] --> QR["クエリ書き換え(任意)"]
    QR --> RET["ハイブリッド検索<br/>Dense top-50 + BM25 top-50をRRF融合"]
    IDX --> RET
    RET --> RR["リランキング<br/>Cross-Encoderで再順位付け"]
    RR --> TOPK["上位5〜8件を選択"]
    TOPK --> CTXB["コンテキスト構築<br/>メタデータ付与"]
    CTXB --> GEN["LLMによる生成"]`,

  d5: `flowchart TD
    Start(["エージェントセッション開始"]) --> Loop["ツール呼び出しループを実行"]
    Loop --> Check{"コンテキスト使用量が<br/>閾値を超えたか?"}
    Check -- いいえ --> Loop
    Check -- はい --> Edit["Context Editing<br/>古いツール結果をクリア"]
    Edit --> Check2{"それでも上限に近いか?"}
    Check2 -- はい --> Compact["Compaction<br/>会話全体を要約に置換"]
    Check2 -- いいえ --> Loop
    Compact --> Loop
    Loop --> Note["重要な知見をMemoryファイルへ書き出す"]
    Note --> NextSession(["次のセッションでMemoryを読み込み再開"])`,

  d6: `flowchart TB
    U["ユーザーのクエリ"] --> Lead["リードエージェント<br/>(計画・タスク分解・統合)"]
    Lead -->|"サブタスクA"| SA1["サブエージェント1<br/>独立したコンテキスト"]
    Lead -->|"サブタスクB"| SA2["サブエージェント2<br/>独立したコンテキスト"]
    Lead -->|"サブタスクC"| SA3["サブエージェント3<br/>独立したコンテキスト"]
    SA1 -->|"要約(1,000〜2,000トークン)"| Lead
    SA2 -->|"要約(1,000〜2,000トークン)"| Lead
    SA3 -->|"要約(1,000〜2,000トークン)"| Lead
    Lead --> Synth["統合・レポート生成"]
    Synth --> U`,

  d7: `flowchart TD
    Sym["エージェントの挙動がおかしい"] --> Q1{"存在しない前提や誤った事実を<br/>繰り返し参照している?"}
    Q1 -- はい --> Poison["Context Poisoning<br/>(汚染)"]
    Q1 -- いいえ --> Q2{"同じ行動を延々と繰り返し、<br/>新しい計画を立てない?"}
    Q2 -- はい --> Distract["Context Distraction<br/>(注意散漫)"]
    Q2 -- いいえ --> Q3{"無関係な情報やツールが多く、<br/>誤った選択をしている?"}
    Q3 -- はい --> Confuse["Context Confusion<br/>(混乱)"]
    Q3 -- いいえ --> Q4{"矛盾する指示・情報が<br/>混在していないか?"}
    Q4 -- はい --> Clash["Context Clash<br/>(衝突)"]`,

  d8: `sequenceDiagram
    participant Turn1 as ターン1
    participant Cache as プロンプトキャッシュ
    participant Turn2 as ターン2(5分以内)
    Turn1->>Cache: システムプロンプト+ツール定義を<br/>cache_controlで書き込み
    Note over Cache: 書き込みコストは通常入力より高い
    Turn2->>Cache: 同一プレフィックスで問い合わせ
    Cache-->>Turn2: キャッシュヒット<br/>大幅に安価なコストで再利用
    Note over Turn2: プレフィックスが1文字でも変わると<br/>キャッシュミスとなり全体が再計算される`,

  d9: `flowchart TD
    A["エージェント設計を開始"] --> B["システムプロンプトを<br/>適切な高度で書く(Step 1)"]
    B --> C["ツールを最小集合に絞り、<br/>明確な責務を定義する(Step 2)"]
    C --> D{"外部知識の取得が必要か?"}
    D -- はい --> E["RAG / Just-in-Time取得を設計する(Step 3)"]
    D -- いいえ --> F{"長時間実行・複数セッションが必要か?"}
    E --> F
    F -- はい --> G["Compaction / Memory /<br/>Context Editingを組み込む(Step 4)"]
    F -- いいえ --> H{"並列での幅広い探索が必要か?"}
    G --> H
    H -- はい --> I["マルチエージェント<br/>を検討(Step 5)"]
    H -- いいえ --> J["単一エージェントとして実装"]
    I --> K["コンテキスト障害の診断体制を整える(Step 6)"]
    J --> K
    K --> L["プロンプトキャッシュでコストを最適化する(Step 7)"]
    L --> M["Evalsとトークン監視を継続的に運用する(Step 8)"]
    M --> N["本番運用・継続的改善"]`,
};

export default function Page() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />
      <button
        type="button"
        className={styles.sidebarToggle}
        id="sidebarToggle"
        aria-label="目次を開閉する"
      >
        ☰
      </button>

      <nav className={styles.sidebar} id="sidebar" aria-label="目次">
        <div className={styles.brand}>
          <span className={styles.brandMark}>Context Engineering</span>
          <span className={styles.brandTitle}>実践ガイド</span>
          <span className={styles.brandSub}>中級 → 上級 / 2026-07 版</span>
        </div>

        <ul className={styles.tocList}>
          <li>
            <a className={styles.tocLink} href="#intro" data-target="intro">
              <span className={styles.n}>00</span>はじめに
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#sec-1" data-target="sec-1">
              <span className={styles.n}>01</span>定義
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#sec-2" data-target="sec-2">
              <span className={styles.n}>02</span>コンテキストロット
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#sec-3" data-target="sec-3">
              <span className={styles.n}>03</span>構成要素
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#sec-4" data-target="sec-4">
              <span className={styles.n}>04</span>基本4戦略
            </a>
          </li>
        </ul>

        <div className={styles.tocLabel}>Step by Step</div>
        <ul className={styles.tocList}>
          <li>
            <a className={styles.tocLink} href="#step-1" data-target="step-1">
              <span className={styles.n}>05</span>システムプロンプト
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step-2" data-target="step-2">
              <span className={styles.n}>06</span>ツール設計
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step-3" data-target="step-3">
              <span className={styles.n}>07</span>RAG設計
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step-4" data-target="step-4">
              <span className={styles.n}>08</span>長時間実行の管理
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step-5" data-target="step-5">
              <span className={styles.n}>09</span>マルチエージェント
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step-6" data-target="step-6">
              <span className={styles.n}>10</span>障害の診断
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step-7" data-target="step-7">
              <span className={styles.n}>11</span>コスト最適化
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step-8" data-target="step-8">
              <span className={styles.n}>12</span>観測性と評価
            </a>
          </li>
        </ul>

        <div className={styles.tocLabel}>Reference</div>
        <ul className={styles.tocList}>
          <li>
            <a className={styles.tocLink} href="#sec-6" data-target="sec-6">
              <span className={styles.n}>13</span>アンチパターン
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#sec-7" data-target="sec-7">
              <span className={styles.n}>14</span>チェックリスト
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#sec-8" data-target="sec-8">
              <span className={styles.n}>15</span>意思決定フロー
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#sec-9" data-target="sec-9">
              <span className={styles.n}>16</span>参考文献
            </a>
          </li>
        </ul>
      </nav>

      <main className={styles.content}>
        {/* ============ HERO ============ */}
        <header className={styles.hero} id="intro">
          <div className={styles.heroEyebrow}>Context Engineering Field Guide</div>
          <h1 className={styles.heroTitle}>
            コンテキストウィンドウは
            <br />
            <em>有限のRAM</em>である
          </h1>
          <p className={styles.heroSub}>
            プロンプト単体の最適化ではなく、エージェントが推論の瞬間に参照するトークン集合全体—システムプロンプト、ツール定義、履歴、外部データ、メモリ—を設計する。中級者から上級者向けに、8つのステップで実践知を整理した。
          </p>
          <div className={styles.heroMeta}>
            <span className={styles.chip}>最終更新 2026-07-07</span>
            <span className={styles.chip}>対象: エージェント開発者</span>
            <span className={styles.chip}>参照文献 32件</span>
            <span className={styles.chip}>図解 9点 (Mermaid)</span>
          </div>

          <div className={styles.capacity}>
            <div className={styles.capacityHead}>
              <span className={styles.t}>Context Window Capacity — 未設計の場合</span>
              <span className={styles.v}>200K tokens</span>
            </div>
            <div className={styles.capacityTrack}>
              <div
                className={styles.capacitySeg}
                style={{ width: "12%", background: "#5eead4", animationDelay: "0.05s" }}
              ></div>
              <div
                className={styles.capacitySeg}
                style={{ width: "22%", background: "#4fb8c9", animationDelay: "0.15s" }}
              ></div>
              <div
                className={styles.capacitySeg}
                style={{ width: "38%", background: "#f2b465", animationDelay: "0.25s" }}
              ></div>
              <div
                className={styles.capacitySeg}
                style={{ width: "18%", background: "#e88a5c", animationDelay: "0.35s" }}
              ></div>
              <div
                className={styles.capacitySeg}
                style={{ width: "10%", background: "#f2789a", animationDelay: "0.45s" }}
              ></div>
            </div>
            <div className={styles.capacityLegend}>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "#5eead4" }}></span>
                システムプロンプト
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "#4fb8c9" }}></span>
                ツール定義
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "#f2b465" }}></span>
                メッセージ履歴
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "#e88a5c" }}></span>
                RAG / ツール結果
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "#f2789a" }}></span>
                コンテキストロット領域
              </span>
            </div>
          </div>
        </header>

        {/* ============ 1. 定義 ============ */}
        <section className={styles.chapter} id="sec-1">
          <div className={styles.eyebrow}>
            <span className={styles.idx}>01</span>Definition
          </div>
          <h2 className={styles.chapterTitle}>コンテキストエンジニアリングとは何か</h2>
          <p className={styles.lede}>
            プロンプトエンジニアリングは「1回の指示・1回の生成に対して、どのような文言・構造 of
            指示を与えれば望む出力が得られるか」を扱う技術である。一方でエージェントが複数ステップにわたりツールを呼び出し、外部情報を取得し、長時間セッションを維持するようになると、単一のプロンプトだけでは制御しきれない領域が広がる。
          </p>
          <p>
            Anthropicのアプライドエンジニアリングチームは、この広がった領域を指して「推論時にモデルへ入力される最適なトークン集合を選定・維持するための一連の戦略」と定義している。これはシステムプロンプトだけでなく、ツール定義、会話履歴、外部から取得したデータ、Few-shot例など、モデルが参照するあらゆる情報を対象とする。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>プロンプトエンジニアリング</th>
                  <th>コンテキストエンジニアリング</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>対象</td>
                  <td>1回の指示文・システムプロンプトの文言</td>
                  <td>推論時にモデルが参照する情報全体(指示・ツール・履歴・外部データ・メモリ)</td>
                </tr>
                <tr>
                  <td>時間軸</td>
                  <td>単発〜数ターンの対話</td>
                  <td>マルチターン・長時間・複数セッションにまたがるエージェント実行</td>
                </tr>
                <tr>
                  <td>典型的な問い</td>
                  <td>「どう書けば意図通りの出力になるか」</td>
                  <td>「今この瞬間、モデルに何を見せるべきか」</td>
                </tr>
                <tr>
                  <td>主なリスク</td>
                  <td>曖昧な指示、Few-shotの不足</td>
                  <td>コンテキストロット、ツール過多、情報の汚染・矛盾</td>
                </tr>
                <tr>
                  <td>位置づけ</td>
                  <td>コンテキストエンジニアリングの一部分</td>
                  <td>プロンプトエンジニアリングとRAGを内包する上位概念</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            AIエンジニアの間では、LLMを新種のOSに、コンテキストウィンドウをそのRAMに例える見方が広く共有されている。RAMと同様に容量は有限であり、OSが何をRAMに載せるかを慎重に管理するように、エンジニアはコンテキストウィンドウに何を載せるかを設計する必要がある。
          </p>

          <div className={styles.refs}>
            <span className={styles.refsLabel}>参考</span>
            <ul>
              <li>
                Anthropic, &quot;Effective context engineering for AI agents&quot; —{" "}
                <a
                  href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/effective-context-engineering-for-ai-agents
                </a>
              </li>
              <li>
                LangChain Blog, &quot;Context Engineering for Agents&quot; —{" "}
                <a
                  href="https://www.langchain.com/blog/context-engineering-for-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  langchain.com/blog/context-engineering-for-agents
                </a>
              </li>
              <li>
                Cronus, &quot;Anthropic&apos;s Approach to Effective Context Engineering&quot; —{" "}
                <a
                  href="https://cr0nu3.github.io/posts/Effective_context_engineering_for_AI_Agents/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cr0nu3.github.io/posts/Effective_context_engineering_for_AI_Agents
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ 2. コンテキストロット ============ */}
        <section className={styles.chapter} id="sec-2">
          <div className={styles.eyebrow}>
            <span className={styles.idx}>02</span>Context Rot
          </div>
          <h2 className={styles.chapterTitle}>
            なぜ今これが重要なのか：コンテキストロットという現象
          </h2>
          <p className={styles.lede}>
            数百万トークン級のコンテキストウィンドウが普及するにつれ、「大きな窓があるなら全部詰め込めばよい」という発想が広まった。しかし実態はそう単純ではない。
          </p>
          <p>
            ベクトルデータベース企業Chromaが公開した技術レポートは、GPT-4.1・Claude 4・Gemini
            2.5・Qwen3を含む18の主要モデルを対象に、入力トークン数を増やしたときの性能変化を検証した。その結果、単純な「干し草の中の針」タスクでさえ、入力長が1万トークンから10万トークン超に増えるにつれて精度が20〜50%低下すること、さらにクエリと正解箇所の意味的な類似度が高いほど劣化が早まることが確認されている。この現象は
            <strong>コンテキストロット(Context Rot)</strong>と呼ばれる。
          </p>
          <p>
            同レポートの興味深い知見として、正解に似ているが誤っている情報(ディストラクター)が1つ混入するだけで性能が大きく落ち込むこと、そして直感に反して、支離滅裂な文の羅列よりも一貫した文章構造を持つ長文の方が、モデルが物語の流れに引きずられてしまい特定の情報を探し出しにくくなる場合があることが挙げられる。行き詰まったときの挙動もモデルにより異なり、幻覚を生成して答えようとする系統と、回答を拒否する系統に分かれる傾向が報告されている。
          </p>
          <p>
            同様の現象は2024年の研究「Lost in the
            Middle」でも指摘されており、関連情報がコンテキストの中央付近に位置する場合、モデルの参照性能が両端に位置する場合より低下することが示されている。開発者のDrew
            Breunigは、この劣化がどのような形で現れるかを4つのパターンに整理した(詳細はStep
            6で扱う)。
          </p>

          <div className={styles.refs}>
            <span className={styles.refsLabel}>参考</span>
            <ul>
              <li>
                Chroma Research, &quot;Context Rot: How Increasing Input Tokens Impacts LLM
                Performance&quot; —{" "}
                <a
                  href="https://research.trychroma.com/context-rot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  research.trychroma.com/context-rot
                </a>
              </li>
              <li>
                Chroma, GitHub再現用リポジトリ —{" "}
                <a
                  href="https://github.com/chroma-core/context-rot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/chroma-core/context-rot
                </a>
              </li>
              <li>
                Liu et al., &quot;Lost in the Middle: How Language Models Use Long Contexts&quot;,
                TACL 2024 —{" "}
                <a
                  href="https://aclanthology.org/2024.tacl-1.9/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  aclanthology.org/2024.tacl-1.9
                </a>
              </li>
              <li>
                Drew Breunig, &quot;How Long Contexts Fail&quot; —{" "}
                <a
                  href="https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  dbreunig.com/2025/06/22/how-contexts-fail
                </a>
              </li>
              <li>
                PromptLayer, &quot;Why LLMs Get Distracted and How to Write Shorter Prompts&quot; —{" "}
                <a
                  href="https://blog.promptlayer.com/why-llms-get-distracted-and-how-to-write-shorter-prompts/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  blog.promptlayer.com/why-llms-get-distracted
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ 3. 構成要素 ============ */}
        <section className={styles.chapter} id="sec-3">
          <div className={styles.eyebrow}>
            <span className={styles.idx}>03</span>Anatomy
          </div>
          <h2 className={styles.chapterTitle}>コンテキストウィンドウを構成する要素</h2>
          <p className={styles.lede}>
            エージェントに渡されるコンテキストは、単一の「プロンプト」ではなく複数のレイヤーから構成される動的なシステムとして捉える必要がある。
          </p>

          <div className={styles.diagram}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.d1} />
            </div>
            <div className={styles.diagramCaption}>
              Fig.1 — コンテキストウィンドウを構成する6つのレイヤー
            </div>
          </div>

          <p>
            それぞれの要素は独立して肥大化しうるため、どれか一つを最適化しても他が膨張すればコンテキストロットは避けられない。次章以降で紹介する4つの戦略は、この6要素すべてに横断的に適用される考え方である。
          </p>

          <div className={styles.refs}>
            <span className={styles.refsLabel}>参考</span>
            <ul>
              <li>
                Anthropic, &quot;Effective context engineering for AI agents&quot; —{" "}
                <a
                  href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/effective-context-engineering-for-ai-agents
                </a>
              </li>
              <li>
                Yashwant Deshmukh, &quot;Context Engineering: The Critical AI Skill&quot; —{" "}
                <a
                  href="https://medium.com/@yashwant.deshmukh23/a-complete-guide-to-context-engineering-for-ai-agents-56b84ff6bc26"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  medium.com/@yashwant.deshmukh23
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ 4. 基本4戦略 ============ */}
        <section className={styles.chapter} id="sec-4">
          <div className={styles.eyebrow}>
            <span className={styles.idx}>04</span>Framework
          </div>
          <h2 className={styles.chapterTitle}>基本戦略：Write / Select / Compress / Isolate</h2>
          <p className={styles.lede}>
            LangChainのエンジニアリングチームは、業界で実践されているコンテキスト管理手法を横断的に調査し、4つのカテゴリーに整理した。現在ではコンテキストエンジニアリングの標準的なメンタルモデルとして広く参照されている。
          </p>

          <div className={styles.diagram}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.d2} />
            </div>
            <div className={styles.diagramCaption}>
              Fig.2 — 4つの基本戦略とコンテキストウィンドウの関係
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>戦略</th>
                  <th>何をするか</th>
                  <th>代表的な実装例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Write</strong> 書き出す
                  </td>
                  <td>ウィンドウ外部(ファイル・DB・状態)に保存し、必要時に参照する</td>
                  <td>
                    スクラッチパッド、<code>CLAUDE.md</code>、メモリツールによる永続化
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Select</strong> 選び取る
                  </td>
                  <td>今のステップに必要な情報だけをウィンドウに引き込む</td>
                  <td>Embedding検索、Just-in-Timeのファイルパス解決、ツール定義へのRAG適用</td>
                </tr>
                <tr>
                  <td>
                    <strong>Compress</strong> 圧縮する
                  </td>
                  <td>冗長なトークンを削り、必要な情報密度を保ったまま縮める</td>
                  <td>会話全体の要約(Compaction)、ツール結果の一括クリア、サブエージェント要約</td>
                </tr>
                <tr>
                  <td>
                    <strong>Isolate</strong> 分離する
                  </td>
                  <td>サブタスクごとにクリーンな状態を用意し、干渉を防ぐ</td>
                  <td>サブエージェント構成、サンドボックス実行、状態スキーマによる部分公開</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            これら4つは互いに排他的ではなく、実務では組み合わせて使うのが一般的である。Anthropicのマルチエージェント・リサーチシステムでは、リードエージェントが計画をメモリに書き出し(Write)、サブエージェントが独立したコンテキストで探索し(Isolate)、結果を1,000〜2,000トークン程度に要約して返し(Compress)、リードエージェントは統合に必要な情報だけを選び取る(Select)という形で4戦略すべてが同時に機能している。
          </p>

          <div className={styles.refs}>
            <span className={styles.refsLabel}>参考</span>
            <ul>
              <li>
                LangChain Blog, &quot;Context Engineering for Agents&quot; —{" "}
                <a
                  href="https://www.langchain.com/blog/context-engineering-for-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  langchain.com/blog/context-engineering-for-agents
                </a>
              </li>
              <li>
                LangChain, GitHub <code>context_engineering</code>リポジトリ —{" "}
                <a
                  href="https://github.com/langchain-ai/context_engineering"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/langchain-ai/context_engineering
                </a>
              </li>
              <li>
                DeepWiki, &quot;Isolate Context Strategy&quot; —{" "}
                <a
                  href="https://deepwiki.com/langchain-ai/context_engineering/2.4-isolate-context-strategy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  deepwiki.com/langchain-ai/context_engineering
                </a>
              </li>
              <li>
                Anthropic, &quot;How we built our multi-agent research system&quot; —{" "}
                <a
                  href="https://www.anthropic.com/engineering/multi-agent-research-system"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/multi-agent-research-system
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ STEP 1 ============ */}
        <section className={styles.chapter} id="step-1">
          <div className={styles.stepBadge}>Step 1 / 8</div>
          <div className={styles.eyebrow}>
            <span className={styles.idx}>05</span>System Prompt
          </div>
          <h2 className={styles.chapterTitle}>システムプロンプトを「適切な高度」で書く</h2>
          <p className={styles.lede}>
            システムプロンプトの設計における最大の落とし穴は両極端である。すべてのエッジケースをif-else的にハードコードした脆いプロンプトは保守性を失い、逆に抽象的すぎる指示はモデルに具体的な指針を与えられない。Anthropicはこれを「適切な高度(right
            altitude)」という比喩で説明している。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>セクション</th>
                  <th>役割</th>
                  <th>記述のポイント</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>背景・役割定義</td>
                  <td>エージェントが何者で、何を達成すべきかを明示する</td>
                  <td>曖昧な形容詞を避け、期待される振る舞いを具体的に記述する</td>
                </tr>
                <tr>
                  <td>指示の階層</td>
                  <td>優先度の高い制約から順に並める</td>
                  <td>矛盾する指示がないか確認する(Context Clashの予防)</td>
                </tr>
                <tr>
                  <td>ツールガイダンス</td>
                  <td>いつ・どのツールを・どう使うべきかの方針</td>
                  <td>ツールのdescriptionとプロンプトに書く内容を分離する</td>
                </tr>
                <tr>
                  <td>出力フォーマット</td>
                  <td>期待する出力の構造</td>
                  <td>構造化出力(JSON Schema等)は明示的に定義する</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            ポイントは「モデルが自分で正しい判断を下せるだけの余地を残しつつ、期待される行動の輪郭を明確にする」ことである。過度に細かいルールの羅列は、後述するContext
            Confusion(無関係情報による混乱)の温床にもなる。
          </p>

          <div className={styles.refs}>
            <span className={styles.refsLabel}>参考</span>
            <ul>
              <li>
                Anthropic, &quot;Effective context engineering for AI agents&quot; —{" "}
                <a
                  href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/effective-context-engineering-for-ai-agents
                </a>
              </li>
              <li>
                Anthropic, &quot;Building effective agents&quot; —{" "}
                <a
                  href="https://www.anthropic.com/engineering/building-effective-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/building-effective-agents
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ STEP 2 ============ */}
        <section className={styles.chapter} id="step-2">
          <div className={styles.stepBadge}>Step 2 / 8</div>
          <div className={styles.eyebrow}>
            <span className={styles.idx}>06</span>Tool Design
          </div>
          <h2 className={styles.chapterTitle}>ツールを設計する</h2>
          <p className={styles.lede}>
            ツールはエージェントが外部の情報や実行環境にアクセスするための契約である。Anthropicはツール設計における原則として、明確で非重複な機能、堅牢でスコープの明確な目的、入力パラメータの曖昧さ排除を重視している。
          </p>
          <p>
            ツールセットが肥大化すると、機能が重複し、モデルがどのツールを選ぶべきか混乱する「Context
            Confusion」の典型例になる。実務上の目安として、よく使う3〜5個のツールは常時読み込み、10個を超える場合は動的な発見の仕組みを導入することが推奨される。
          </p>

          <div className={styles.diagram}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.d3} />
            </div>
            <div className={styles.diagramCaption}>
              Fig.3 — Tool Search Toolによる動的なツール発見フロー
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>手法</th>
                  <th>課題への対処</th>
                  <th>効果(Anthropic社内評価)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tool Search Tool</td>
                  <td>全ツール定義を事前ロードせず、必要なものだけをオンデマンドで発見する</td>
                  <td>従来比85%のトークン削減、Opus 4での精度が49%→74%に改善</td>
                </tr>
                <tr>
                  <td>Programmatic Tool Calling</td>
                  <td>コード実行環境内でツールを呼び出し、中間結果をコンテキストに溜め込まない</td>
                  <td>ループ・条件分岐をコード側に委譲し、全量推論を回避</td>
                </tr>
                <tr>
                  <td>Tool Use Examples</td>
                  <td>JSONスキーマだけでは伝わらない使い方の慣習を例示で補う</td>
                  <td>オプションパラメータの使い分けなどスキーマ外の知識を提供</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            LangChainの調査では、ツール自体の説明文にもRAGを適用し、関連しそうなツールだけを検索的に絞り込むことでツール選択精度が約3倍向上したという報告もある。
          </p>

          <div className={styles.refs}>
            <span className={styles.refsLabel}>参考</span>
            <ul>
              <li>
                Anthropic, &quot;Effective context engineering for AI agents&quot; —{" "}
                <a
                  href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/effective-context-engineering-for-ai-agents
                </a>
              </li>
              <li>
                Anthropic, &quot;Introducing advanced tool use on the Claude Developer
                Platform&quot; —{" "}
                <a
                  href="https://www.anthropic.com/engineering/advanced-tool-use"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/advanced-tool-use
                </a>
              </li>
              <li>
                Vorstel, &quot;Effective Context Engineering for AI Agents&quot; —{" "}
                <a
                  href="https://vorstel.com/feeds/blog/effective-context-engineering-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  vorstel.com/feeds/blog/effective-context-engineering-ai-agents
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ STEP 3 ============ */}
        <section className={styles.chapter} id="step-3">
          <div className={styles.stepBadge}>Step 3 / 8</div>
          <div className={styles.eyebrow}>
            <span className={styles.idx}>07</span>Retrieval
          </div>
          <h2 className={styles.chapterTitle}>Just-in-Time retrievalとRAGパイプライン設計</h2>
          <p className={styles.lede}>
            コンテキストへの情報投入には大きく2つの流派がある。事前処理型(Embeddingベースの検索を推論前に実行)と、Just-in-Time型(ファイルパスやクエリなど軽量な識別子だけを保持し、必要になった瞬間にツール経由で実データを取得する)である。
          </p>
          <p>
            Anthropicは、エージェントがより自律的になるにつれて後者の重要性が増していると指摘している。実務では両者を併用するハイブリッド構成が一般的である。
          </p>

          <div className={styles.diagram}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.d4} />
            </div>
            <div className={styles.diagramCaption}>
              Fig.4 — 2026年の実務で標準化されたハイブリッドRAGパイプライン
            </div>
          </div>

          <p>
            2026年時点の実務知見としては、「まずチャンキングを直す」がもっとも投資対効果の高い改善だと繰り返し指摘されている。業界分析では、RAGの品質問題の大半が生成部分ではなく検索部分(チャンキング・埋め込み・ランキング)に起因するとされる。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>チャンキング戦略</th>
                  <th>概要</th>
                  <th>向いているケース</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>固定長分割</td>
                  <td>一定文字数ごとに機械的に分割</td>
                  <td>素早いプロトタイピング、構造の薄いテキスト</td>
                </tr>
                <tr>
                  <td>構造認識分割</td>
                  <td>見出し・関数境界など文書の構造単位で分割</td>
                  <td>Markdown文書、コードベース、仕様書</td>
                </tr>
                <tr>
                  <td>意味的分割</td>
                  <td>隣接文の埋め込み類似度が閾値を下回った位置で区切る</td>
                  <td>構造の乏しい長文プローズ、法務・医療文書</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            リランキングは、広く再現率高く候補を集めた後に高精度なモデルで絞り込む工程であり、Cross-Encoder型のリランカーはハイブリッド検索単体と比べて10〜25%の追加精度向上をもたらすとされる。なお「フルコンテキスト(ファイル全体をそのまま渡す)」を推す立場もあり、SWE-bench
            Verifiedではファイル全体を渡すアプローチが約95%、断片化された検索では約80%程度という分析もある。コストとレイテンシとのトレードオフを踏まえ、タスクの性質に応じた使い分けが必要になる。
          </p>

          <div className={styles.refs}>
            <span className={styles.refsLabel}>参考</span>
            <ul>
              <li>
                Anthropic, &quot;Effective context engineering for AI agents&quot; —{" "}
                <a
                  href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/effective-context-engineering-for-ai-agents
                </a>
              </li>
              <li>
                Sourcegraph Blog, &quot;Context Engineering: A Practical Guide&quot; —{" "}
                <a
                  href="https://sourcegraph.com/blog/context-engineering"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  sourcegraph.com/blog/context-engineering
                </a>
              </li>
              <li>
                StackAI, &quot;RAG Best Practices for Enterprise AI&quot; —{" "}
                <a
                  href="https://www.stackai.com/insights/retrieval-augmented-generation-(rag)-best-practices-for-enterprise-ai-chunking-embeddings-reranking-and-hybrid-search-optimization"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  stackai.com/insights/rag-best-practices
                </a>
              </li>
              <li>
                Lushbinary, &quot;RAG Production Guide 2026&quot; —{" "}
                <a
                  href="https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  lushbinary.com/blog/rag-production-guide
                </a>
              </li>
              <li>
                Starmorph Blog, &quot;RAG Techniques Compared&quot; —{" "}
                <a
                  href="https://blog.starmorph.com/blog/rag-techniques-compared-best-practices-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  blog.starmorph.com/blog/rag-techniques-compared
                </a>
              </li>
              <li>
                Zilliz Blog, &quot;Context Engineering Strategies for AI Agents&quot; —{" "}
                <a
                  href="https://zilliz.com/blog/context-engineering-for-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  zilliz.com/blog/context-engineering-for-ai-agents
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ STEP 4 ============ */}
        <section className={styles.chapter} id="step-4">
          <div className={styles.stepBadge}>Step 4 / 8</div>
          <div className={styles.eyebrow}>
            <span className={styles.idx}>08</span>Long-running Agents
          </div>
          <h2 className={styles.chapterTitle}>長時間実行エージェントのコンテキスト管理</h2>
          <p className={styles.lede}>
            数十〜数百のツール呼び出しにまたがる長時間セッションでは、コンテキストウィンドウがいずれ上限に達する。Anthropicは3つの機構をClaude
            Developer Platformに実装しており、それぞれ役割が異なるため使い分けの理解が重要である。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>機構</th>
                  <th>何をするか</th>
                  <th>適したケース</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Compaction</td>
                  <td>会話全体をサーバー側で高忠実度の要約に置き換える</td>
                  <td>長い会話の流れを維持したまま文脈を圧縮したいタスク全般</td>
                </tr>
                <tr>
                  <td>Context Editing</td>
                  <td>古いツール呼び出し結果をクライアント側で明示的に削除する</td>
                  <td>深い履歴の中の結果を再度見る必要がない場合の軽量な圧縮</td>
                </tr>
                <tr>
                  <td>Memory Tool</td>
                  <td>ファイルベースでセッションをまたいだ知識を永続化する</td>
                  <td>プロジェクト単位で複数セッションにわたり知見を積み上げたい場合</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.diagram}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.d5} />
            </div>
            <div className={styles.diagramCaption}>
              Fig.5 — Compaction・Context Editing・Memoryの連携ライフサイクル
            </div>
          </div>

          <p>
            これら3つは併用も可能で、Anthropicの内部評価では、メモリとコンテキスト編集を組み合わせたエージェント検索タスクで39%の性能改善、100ターンのWeb検索評価では84%のトークン削減が報告されている。特に指示せずとも、長時間タスクに取り組むエージェントが探索済み領域の記録を自発的に構築し、コンテキストがリセットされた後も自分のノートを読み返して作業を継続する挙動が観察されている。
          </p>

          <div className={styles.refs}>
            <span className={styles.refsLabel}>参考</span>
            <ul>
              <li>
                Claude by Anthropic, &quot;Managing context on the Claude Developer Platform&quot; —{" "}
                <a
                  href="https://claude.com/blog/context-management"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  claude.com/blog/context-management
                </a>
              </li>
              <li>
                Anthropic, &quot;Effective context engineering for AI agents&quot; —{" "}
                <a
                  href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/effective-context-engineering-for-ai-agents
                </a>
              </li>
              <li>
                Claude Platform Docs, &quot;Memory tool&quot; —{" "}
                <a
                  href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  platform.claude.com/docs/agents-and-tools/tool-use/memory-tool
                </a>
              </li>
              <li>
                Claude Cookbook, &quot;Context engineering: memory, compaction, tool clearing&quot;
                —{" "}
                <a
                  href="https://platform.claude.com/cookbook/tool-use-context-engineering-context-engineering-tools"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  platform.claude.com/cookbook/context-engineering-tools
                </a>
              </li>
              <li>
                Claude Cookbook, &quot;Automatic context compaction&quot; —{" "}
                <a
                  href="https://platform.claude.com/cookbook/tool-use-automatic-context-compaction"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  platform.claude.com/cookbook/automatic-context-compaction
                </a>
              </li>
              <li>
                Claude Cookbook, &quot;Memory &amp; context management&quot; —{" "}
                <a
                  href="https://platform.claude.com/cookbook/tool-use-memory-cookbook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  platform.claude.com/cookbook/memory-cookbook
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ STEP 5 ============ */}
        <section className={styles.chapter} id="step-5">
          <div className={styles.stepBadge}>Step 5 / 8</div>
          <div className={styles.eyebrow}>
            <span className={styles.idx}>09</span>Multi-Agent
          </div>
          <h2 className={styles.chapterTitle}>マルチエージェントによるコンテキスト分離</h2>
          <p className={styles.lede}>
            単一エージェントのコンテキストウィンドウには物理的な上限がある。並列で幅広い探索が必要なタスクでは、複数の専門化されたサブエージェントに作業を分散させ、それぞれが独立したコンテキストウィンドウを持つアーキテクチャが有効になる。
          </p>

          <div className={styles.diagram}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.d6} />
            </div>
            <div className={styles.diagramCaption}>
              Fig.6 — オーケストレーター/サブエージェント・アーキテクチャ
            </div>
          </div>

          <p>
            各サブエージェントは数万トークン規模で自由に探索しつつ、リードエージェントには凝縮された要約だけを返す。Anthropicの内部評価では、Opus
            4をリードエージェント・Sonnet 4をサブエージェントとする構成が、単一のOpus
            4エージェントを社内リサーチ評価で90.2%上回ったと報告されている。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>判断基準</th>
                  <th>マルチエージェントが有効</th>
                  <th>単一エージェントで十分</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>コンテキスト分離の必要性</td>
                  <td>サブタスクが1,000トークン超の文脈を生むが本筋と無関係</td>
                  <td>サブタスク間で共有すべき情報が多い</td>
                </tr>
                <tr>
                  <td>探索の性質</td>
                  <td>独立した複数の方向性を並行して深掘りする(幅優先型)</td>
                  <td>単一の連続した推論の流れが必要(深さ優先型)</td>
                </tr>
                <tr>
                  <td>コスト許容度</td>
                  <td>タスクの価値がトークンコスト増加に見合う</td>
                  <td>コストが厳しく制約されている</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            マルチエージェントシステムは単純なチャットの約15倍のトークンを消費するとされ、Anthropic自身も「単一エージェントのプロンプト改善で同等の結果が得られたのに、数ヶ月かけて複雑な構成を作ってしまった」事例を報告している。導入前に、本当にコンテキスト分離が必要なタスクかどうかを見極めることが重要である。
          </p>

          <div className={styles.refs}>
            <span className={styles.refsLabel}>参考</span>
            <ul>
              <li>
                Anthropic, &quot;How we built our multi-agent research system&quot; —{" "}
                <a
                  href="https://www.anthropic.com/engineering/multi-agent-research-system"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/multi-agent-research-system
                </a>
              </li>
              <li>
                Claude by Anthropic, &quot;When to use multi-agent systems (and when not to)&quot; —{" "}
                <a
                  href="https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  claude.com/blog/building-multi-agent-systems
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ STEP 6 ============ */}
        <section className={styles.chapter} id="step-6">
          <div className={styles.stepBadge}>Step 6 / 8</div>
          <div className={styles.eyebrow}>
            <span className={styles.idx}>10</span>Failure Modes
          </div>
          <h2 className={styles.chapterTitle}>コンテキスト障害の診断と対処</h2>
          <p className={styles.lede}>
            コンテキストロットは単一の現象ではなく、複数の異なる失敗モードの総称である。Drew
            Breunigはこれを4つのパターンに整理しており、現在では業界で広く参照される分類になっている。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>失敗モード</th>
                  <th>定義</th>
                  <th>主な対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Context Poisoning
                    <br />
                    <span
                      style={{
                        color: "#5f7396",
                        fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                        fontSize: "11px",
                      }}
                    >
                      汚染
                    </span>
                  </td>
                  <td>誤った情報や幻覚が一度入り込み、繰り返し参照され続ける</td>
                  <td>早期の誤情報検出・修正、重要な事実の検証ステップ</td>
                </tr>
                <tr>
                  <td>
                    Context Distraction
                    <br />
                    <span
                      style={{
                        color: "#5f7396",
                        fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                        fontSize: "11px",
                      }}
                    >
                      注意散漫
                    </span>
                  </td>
                  <td>コンテキストが長大化し、学習済み知識より蓄積履歴に過度に依存する</td>
                  <td>Compaction・サブエージェント分離で実効文脈長を抑える</td>
                </tr>
                <tr>
                  <td>
                    Context Confusion
                    <br />
                    <span
                      style={{
                        color: "#5f7396",
                        fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                        fontSize: "11px",
                      }}
                    >
                      混乱
                    </span>
                  </td>
                  <td>無関係な情報が存在し、それを使うことで応答品質が下がる</td>
                  <td>ツールの絞り込み(3〜5個常時ロード)、選択的検索によるフィルタリング</td>
                </tr>
                <tr>
                  <td>
                    Context Clash
                    <br />
                    <span
                      style={{
                        color: "#5f7396",
                        fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                        fontSize: "11px",
                      }}
                    >
                      衝突
                    </span>
                  </td>
                  <td>異なる出所の情報・ツールが既存の情報と矛盾する</td>
                  <td>情報源間の整合性チェック、指示の優先順位を明示</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.diagram}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.d7} />
            </div>
            <div className={styles.diagramCaption}>
              Fig.7 — 4つの失敗モードを切り分ける診断フロー
            </div>
          </div>

          <p>
            いずれのケースでも共通する対処の方向性は「まず何が起きているかを名指しできるようにすること」である。原因不明のまま経験則だけで対処し続けず、上記4分類のどれに該当するかを特定できれば、Step
            4・5・2で紹介した具体的な手段を的確に適用できる。
          </p>

          <div className={styles.refs}>
            <span className={styles.refsLabel}>参考</span>
            <ul>
              <li>
                Drew Breunig, &quot;How Long Contexts Fail&quot; —{" "}
                <a
                  href="https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  dbreunig.com/2025/06/22/how-contexts-fail
                </a>
              </li>
              <li>
                Simon Willison, &quot;How to Fix Your Context&quot; —{" "}
                <a
                  href="https://simonwillison.net/2025/Jun/29/how-to-fix-your-context/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  simonwillison.net/2025/Jun/29/how-to-fix-your-context
                </a>
              </li>
              <li>
                O&apos;Reilly Radar, &quot;Working with Contexts&quot; —{" "}
                <a
                  href="https://www.oreilly.com/radar/working-with-contexts/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  oreilly.com/radar/working-with-contexts
                </a>
              </li>
              <li>
                LambdaTest Blog, &quot;Why AI Agents Forget&quot; —{" "}
                <a
                  href="https://www.lambdatest.com/blog/why-ai-agents-forget/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  lambdatest.com/blog/why-ai-agents-forget
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ STEP 7 ============ */}
        <section className={styles.chapter} id="step-7">
          <div className={styles.stepBadge}>Step 7 / 8</div>
          <div className={styles.eyebrow}>
            <span className={styles.idx}>11</span>Cost Optimization
          </div>
          <h2 className={styles.chapterTitle}>プロンプトキャッシュによるコスト最適化</h2>
          <p className={styles.lede}>
            コンテキストエンジニアリングは品質だけでなくコストの問題でもある。Claude
            APIのプロンプトキャッシュは、プロンプトの先頭部分(プレフィックス)を再利用することで、繰り返し送信される固定的なコンテキストの処理コストを大幅に削減する仕組みである。
          </p>

          <div className={styles.diagram}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.d8} />
            </div>
            <div className={styles.diagramCaption}>
              Fig.8 — プロンプトキャッシュのプレフィックス再利用の仕組み
            </div>
          </div>

          <div className={styles.card}>
            <ul className={styles.cardList}>
              <li>
                <strong>安定した内容を先頭に配置する</strong> —
                システムプロンプトやツール定義など変化しない部分を前方に、動的なユーザー入力を末尾に置く
              </li>
              <li>
                <strong>プレフィックスの完全一致が必須</strong> —
                途中のタイムスタンプや動的な値が1つでも変わると、それより後ろのキャッシュはすべて無効になる
              </li>
              <li>
                <strong>ツール呼び出しのキー順序を安定させる</strong> —
                言語によってはJSONのキー順がランダム化され、意図せずキャッシュが壊れることがある
              </li>
              <li>
                <strong>キャッシュの有効期限(TTL)を意識する</strong> —
                標準5分、延長オプションで1時間。セッションの実行間隔に応じて選択する
              </li>
            </ul>
          </div>

          <p>
            キャッシュはあくまで「送信する固定コンテキストを安く再利用する」仕組みであり、そもそも送信する必要のないトークンを削るコンテキストエンジニアリングとは補完関係にある。キャッシュを効かせる前に、まず本当に必要な情報だけを渡せているかを見直すことが優先される。
          </p>

          <div className={styles.refs}>
            <span className={styles.refsLabel}>参考</span>
            <ul>
              <li>
                Claude Platform Docs, &quot;Prompt caching&quot; —{" "}
                <a
                  href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  platform.claude.com/docs/build-with-claude/prompt-caching
                </a>
              </li>
              <li>
                Anthropic, &quot;Prompt caching with Claude&quot; —{" "}
                <a
                  href="https://www.anthropic.com/news/prompt-caching"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/news/prompt-caching
                </a>
              </li>
              <li>
                hidekazu-konishi.com, &quot;Prompt Caching and Token Efficiency Guide&quot; —{" "}
                <a
                  href="https://hidekazu-konishi.com/entry/anthropic_claude_api_prompt_caching_and_token_efficiency.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  hidekazu-konishi.com/entry/prompt-caching
                </a>
              </li>
              <li>
                ProjectDiscovery Blog, &quot;How We Cut LLM Costs by 59% With Prompt Caching&quot; —{" "}
                <a
                  href="https://projectdiscovery.io/blog/how-we-cut-llm-cost-with-prompt-caching"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  projectdiscovery.io/blog/prompt-caching
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ STEP 8 ============ */}
        <section className={styles.chapter} id="step-8">
          <div className={styles.stepBadge}>Step 8 / 8</div>
          <div className={styles.eyebrow}>
            <span className={styles.idx}>12</span>Evals
          </div>
          <h2 className={styles.chapterTitle}>観測性と評価(Evals)</h2>
          <p className={styles.lede}>
            コンテキストエンジニアリングの各施策(圧縮、分離、ツール絞り込みなど)は、必ずしも直感通りの効果をもたらすとは限らない。Anthropicのマルチエージェントリサーチシステム開発チームは、評価の重要性について次のような教訓を共有している。
          </p>

          <div className={styles.card}>
            <ul className={styles.cardList}>
              <li>
                <strong>小規模でもすぐに評価を始める</strong> —
                数百件規模の網羅的な評価セットが揃うまで待たず、少数の具体例からでも評価を開始する
              </li>
              <li>
                <strong>自動評価と人間評価の併用</strong> —
                LLM-as-a-judgeで事実の正確性・網羅性・ツール使用効率などを採点しつつ、稀なエッジケースは人間のレビューで補う
              </li>
              <li>
                <strong>観測性の確保</strong> —
                エージェントのトークン使用量をトレースし、どこにコンテキストエンジニアリングの効果を投じるべきかを可視化する
              </li>
            </ul>
          </div>

          <p>
            LangChainも同様に、施策を導入する前に「そもそも今どこでトークンが消費されているかを追跡する仕組み」と「その施策が実際に性能を改善したか悪化させたかを検証できる簡易な仕組み」の2つを用意することを推奨している。
          </p>

          <div className={styles.refs}>
            <span className={styles.refsLabel}>参考</span>
            <ul>
              <li>
                Anthropic, &quot;How we built our multi-agent research system&quot; —{" "}
                <a
                  href="https://www.anthropic.com/engineering/multi-agent-research-system"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/multi-agent-research-system
                </a>
              </li>
              <li>
                LangChain Blog, &quot;Context Engineering for Agents&quot; —{" "}
                <a
                  href="https://www.langchain.com/blog/context-engineering-for-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  langchain.com/blog/context-engineering-for-agents
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ 6. アンチパターン ============ */}
        <section className={styles.chapter} id="sec-6">
          <div className={styles.eyebrow}>
            <span className={styles.idx}>13</span>Anti-patterns
          </div>
          <h2 className={styles.chapterTitle}>アンチパターン集</h2>

          <div className={styles.apGrid}>
            <div className={styles.apCard}>
              <div className={styles.apTitle}>全部乗せプロンプト</div>
              <div className={styles.apRow}>
                <b>症状</b>システムプロンプトが数千行に肥大化し、保守不能になる
              </div>
              <div className={styles.apRow}>
                <b>原因</b>エッジケースを都度ハードコードし続けた結果
              </div>
              <div className={`${styles.apRow} ${styles.apFix}`}>
                <b>改善策</b> Step 1: 適切な高度で再設計、Step 4: 動的なコンテキスト構築へ移行
              </div>
            </div>
            <div className={styles.apCard}>
              <div className={styles.apTitle}>ツールの氾濫</div>
              <div className={styles.apRow}>
                <b>症状</b>数十〜数百のツールを常時ロードし、モデルが誤ったツールを選ぶ
              </div>
              <div className={styles.apRow}>
                <b>原因</b>ツール追加のたびに定義を素朴に積み上げた
              </div>
              <div className={`${styles.apRow} ${styles.apFix}`}>
                <b>改善策</b> Step 2: Tool Loadoutの絞り込み、Tool Search Toolによる動的発見
              </div>
            </div>
            <div className={styles.apCard}>
              <div className={styles.apTitle}>会話履歴の無制限蓄積</div>
              <div className={styles.apRow}>
                <b>症状</b>セッションが長くなるほど応答が劣化し、コストも増大する
              </div>
              <div className={styles.apRow}>
                <b>原因</b>Compaction・Context Editingを導入していない
              </div>
              <div className={`${styles.apRow} ${styles.apFix}`}>
                <b>改善策</b> Step 4: 圧縮・メモリ機構の導入
              </div>
            </div>
            <div className={styles.apCard}>
              <div className={styles.apTitle}>RAGの雑なチャンキング</div>
              <div className={styles.apRow}>
                <b>症状</b>検索結果が的外れで、生成が自信満々に間違える
              </div>
              <div className={styles.apRow}>
                <b>原因</b>固定長分割で文や表の途中で切れている
              </div>
              <div className={`${styles.apRow} ${styles.apFix}`}>
                <b>改善策</b> Step 3: 構造認識・意味的チャンキングへの切り替え
              </div>
            </div>
            <div className={styles.apCard}>
              <div className={styles.apTitle}>無条件のマルチエージェント化</div>
              <div className={styles.apRow}>
                <b>症状</b>トークンコストが単一エージェントの15倍に膨らみ、成果が見合わない
              </div>
              <div className={styles.apRow}>
                <b>原因</b>タスクの性質を吟味せずに複雑な構成へ飛びついた
              </div>
              <div className={`${styles.apRow} ${styles.apFix}`}>
                <b>改善策</b> Step 5: 判断基準表に照らして本当に必要か再検討
              </div>
            </div>
            <div className={styles.apCard}>
              <div className={styles.apTitle}>症状ベースのその場しのぎ対応</div>
              <div className={styles.apRow}>
                <b>症状</b>「なんか調子が悪い」を経験則だけで対処し続ける
              </div>
              <div className={styles.apRow}>
                <b>原因</b>4つの失敗モードを区別せずに対処している
              </div>
              <div className={`${styles.apRow} ${styles.apFix}`}>
                <b>改善策</b> Step 6: 診断フローで失敗モードを特定してから対処
              </div>
            </div>
            <div className={styles.apCard}>
              <div className={styles.apTitle}>キャッシュを効かせない構成</div>
              <div className={styles.apRow}>
                <b>症状</b>毎ターン同じ内容をフルコストで再処理している
              </div>
              <div className={styles.apRow}>
                <b>原因</b>動的な値を先頭付近に置いてしまいプレフィックスが安定しない
              </div>
              <div className={`${styles.apRow} ${styles.apFix}`}>
                <b>改善策</b> Step 7: 安定部分を前方に、動的部分を末尾に再配置
              </div>
            </div>
            <div className={styles.apCard}>
              <div className={styles.apTitle}>評価なしでの施策導入</div>
              <div className={styles.apRow}>
                <b>症状</b>良かれと思った圧縮・分離が実は性能を悪化させている
              </div>
              <div className={styles.apRow}>
                <b>原因</b>Before/Afterを比較する評価の仕組みがない
              </div>
              <div className={`${styles.apRow} ${styles.apFix}`}>
                <b>改善策</b> Step 8: 小規模でもEvalsとトレーシングを先に用意する
              </div>
            </div>
          </div>
        </section>

        {/* ============ 7. チェックリスト ============ */}
        <section className={styles.chapter} id="sec-7">
          <div className={styles.eyebrow}>
            <span className={styles.idx}>14</span>Checklist
          </div>
          <h2 className={styles.chapterTitle}>実践チェックリスト</h2>
          <ul className={styles.checklist}>
            <li>
              <span className={styles.box}></span>
              システムプロンプトは「具体的すぎず抽象的すぎない」適切な高度で書かれているか
            </li>
            <li>
              <span className={styles.box}></span>
              ツールは3〜5個程度の中核セットに絞られ、10個を超える場合は動的発見の仕組みがあるか
            </li>
            <li>
              <span className={styles.box}></span>
              ツール同士の役割が重複せず、パラメータの意味が曖昧でないか
            </li>
            <li>
              <span className={styles.box}></span>
              外部知識の取得は「事前処理」と「Just-in-Time取得」を適切に使い分けているか
            </li>
            <li>
              <span className={styles.box}></span>
              RAGを使う場合、チャンキング戦略は文書の構造に合っているか
            </li>
            <li>
              <span className={styles.box}></span>
              リランキングを導入し、上位数件に絞り込んでからコンテキストへ渡しているか
            </li>
            <li>
              <span className={styles.box}></span>長時間セッションに対してCompaction・Context
              Editing・Memoryのいずれかを導入しているか
            </li>
            <li>
              <span className={styles.box}></span>
              マルチエージェント構成を採用する前に、単一エージェント＋プロンプト改善で十分でないか検証したか
            </li>
            <li>
              <span className={styles.box}></span>
              エージェントの不調が発生した際、4つの失敗モードのどれに該当するか診断できる体制があるか
            </li>
            <li>
              <span className={styles.box}></span>
              プロンプトキャッシュのプレフィックス設計(安定部分を前方に)ができているか
            </li>
            <li>
              <span className={styles.box}></span>
              トークン使用量のトレースと、施策のBefore/Afterを比較できる評価の仕組みがあるか
            </li>
          </ul>
        </section>

        {/* ============ 8. 全体設計フロー ============ */}
        <section className={styles.chapter} id="sec-8">
          <div className={styles.eyebrow}>
            <span className={styles.idx}>15</span>Decision Flow
          </div>
          <h2 className={styles.chapterTitle}>全体設計フロー(意思決定図)</h2>
          <p className={styles.lede}>
            これまでのステップを踏まえた、エージェント設計時の全体的な意思決定フローである。
          </p>

          <div className={styles.diagram}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.d9} />
            </div>
            <div className={styles.diagramCaption}>
              Fig.9 — エージェント設計における全体意思決定フロー
            </div>
          </div>
        </section>

        {/* ============ 9. 参考文献 ============ */}
        <section className={styles.chapter} id="sec-9">
          <div className={styles.eyebrow}>
            <span className={styles.idx}>16</span>Bibliography
          </div>
          <h2 className={styles.chapterTitle}>参考文献一覧</h2>

          <h4>Anthropic公式(一次情報)</h4>
          <div className={styles.tableWrap}>
            <table>
              <tbody>
                <tr>
                  <td>01</td>
                  <td>&quot;Effective context engineering for AI agents&quot;</td>
                  <td>
                    <a
                      href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      anthropic.com/engineering/effective-context-engineering-for-ai-agents
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>02</td>
                  <td>&quot;Building effective agents&quot;</td>
                  <td>
                    <a
                      href="https://www.anthropic.com/engineering/building-effective-agents"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      anthropic.com/engineering/building-effective-agents
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>03</td>
                  <td>&quot;How we built our multi-agent research system&quot;</td>
                  <td>
                    <a
                      href="https://www.anthropic.com/engineering/multi-agent-research-system"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      anthropic.com/engineering/multi-agent-research-system
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>04</td>
                  <td>
                    &quot;Introducing advanced tool use on the Claude Developer Platform&quot;
                  </td>
                  <td>
                    <a
                      href="https://www.anthropic.com/engineering/advanced-tool-use"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      anthropic.com/engineering/advanced-tool-use
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>05</td>
                  <td>
                    &quot;Managing context on the Claude Developer Platform&quot; (Claude Blog)
                  </td>
                  <td>
                    <a
                      href="https://claude.com/blog/context-management"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      claude.com/blog/context-management
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>06</td>
                  <td>
                    &quot;When to use multi-agent systems (and when not to)&quot; (Claude Blog)
                  </td>
                  <td>
                    <a
                      href="https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      claude.com/blog/building-multi-agent-systems
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>07</td>
                  <td>&quot;Prompt caching with Claude&quot;</td>
                  <td>
                    <a
                      href="https://www.anthropic.com/news/prompt-caching"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      anthropic.com/news/prompt-caching
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>08</td>
                  <td>Claude Platform Docs, &quot;Memory tool&quot;</td>
                  <td>
                    <a
                      href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      platform.claude.com/docs/agents-and-tools/tool-use/memory-tool
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>09</td>
                  <td>Claude Platform Docs, &quot;Prompt caching&quot;</td>
                  <td>
                    <a
                      href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      platform.claude.com/docs/build-with-claude/prompt-caching
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>
                    Claude Cookbook, &quot;Context engineering: memory, compaction, tool
                    clearing&quot;
                  </td>
                  <td>
                    <a
                      href="https://platform.claude.com/cookbook/tool-use-context-engineering-context-engineering-tools"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      platform.claude.com/cookbook/context-engineering-tools
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>Claude Cookbook, &quot;Automatic context compaction&quot;</td>
                  <td>
                    <a
                      href="https://platform.claude.com/cookbook/tool-use-automatic-context-compaction"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      platform.claude.com/cookbook/automatic-context-compaction
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>Claude Cookbook, &quot;Memory &amp; context management&quot;</td>
                  <td>
                    <a
                      href="https://platform.claude.com/cookbook/tool-use-memory-cookbook"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      platform.claude.com/cookbook/memory-cookbook
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>研究機関・技術レポート</h4>
          <div className={styles.tableWrap}>
            <table>
              <tbody>
                <tr>
                  <td>13</td>
                  <td>Chroma Research, &quot;Context Rot&quot;</td>
                  <td>
                    <a
                      href="https://research.trychroma.com/context-rot"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      research.trychroma.com/context-rot
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>14</td>
                  <td>Chroma, GitHub再現用リポジトリ</td>
                  <td>
                    <a
                      href="https://github.com/chroma-core/context-rot"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      github.com/chroma-core/context-rot
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>15</td>
                  <td>Liu et al., &quot;Lost in the Middle&quot;, TACL 2024</td>
                  <td>
                    <a
                      href="https://aclanthology.org/2024.tacl-1.9/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      aclanthology.org/2024.tacl-1.9
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>フレームワーク・実務ブログ</h4>
          <div className={styles.tableWrap}>
            <table>
              <tbody>
                <tr>
                  <td>16</td>
                  <td>LangChain Blog, &quot;Context Engineering for Agents&quot;</td>
                  <td>
                    <a
                      href="https://www.langchain.com/blog/context-engineering-for-agents"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      langchain.com/blog/context-engineering-for-agents
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>17</td>
                  <td>
                    LangChain, GitHub <code>context_engineering</code>
                  </td>
                  <td>
                    <a
                      href="https://github.com/langchain-ai/context_engineering"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      github.com/langchain-ai/context_engineering
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>18</td>
                  <td>DeepWiki, &quot;Isolate Context Strategy&quot;</td>
                  <td>
                    <a
                      href="https://deepwiki.com/langchain-ai/context_engineering/2.4-isolate-context-strategy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      deepwiki.com/langchain-ai/context_engineering
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>19</td>
                  <td>Sourcegraph Blog, &quot;Context Engineering&quot;</td>
                  <td>
                    <a
                      href="https://sourcegraph.com/blog/context-engineering"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      sourcegraph.com/blog/context-engineering
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>20</td>
                  <td>Zilliz Blog, &quot;Context Engineering Strategies for AI Agents&quot;</td>
                  <td>
                    <a
                      href="https://zilliz.com/blog/context-engineering-for-ai-agents"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      zilliz.com/blog/context-engineering-for-ai-agents
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>コンテキスト失敗モード・実務家の考察</h4>
          <div className={styles.tableWrap}>
            <table>
              <tbody>
                <tr>
                  <td>21</td>
                  <td>Drew Breunig, &quot;How Long Contexts Fail&quot;</td>
                  <td>
                    <a
                      href="https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      dbreunig.com/2025/06/22/how-contexts-fail
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>22</td>
                  <td>Simon Willison, &quot;How to Fix Your Context&quot;</td>
                  <td>
                    <a
                      href="https://simonwillison.net/2025/Jun/29/how-to-fix-your-context/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      simonwillison.net/2025/Jun/29/how-to-fix-your-context
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>23</td>
                  <td>O&apos;Reilly Radar, &quot;Working with Contexts&quot;</td>
                  <td>
                    <a
                      href="https://www.oreilly.com/radar/working-with-contexts/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      oreilly.com/radar/working-with-contexts
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>24</td>
                  <td>LambdaTest Blog, &quot;Why AI Agents Forget&quot;</td>
                  <td>
                    <a
                      href="https://www.lambdatest.com/blog/why-ai-agents-forget/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      lambdatest.com/blog/why-ai-agents-forget
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>25</td>
                  <td>PromptLayer, &quot;Why LLMs Get Distracted&quot;</td>
                  <td>
                    <a
                      href="https://blog.promptlayer.com/why-llms-get-distracted-and-how-to-write-shorter-prompts/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      blog.promptlayer.com/why-llms-get-distracted
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>RAG設計の実務ガイド</h4>
          <div className={styles.tableWrap}>
            <table>
              <tbody>
                <tr>
                  <td>26</td>
                  <td>StackAI, &quot;RAG Best Practices for Enterprise AI&quot;</td>
                  <td>
                    <a
                      href="https://www.stackai.com/insights/retrieval-augmented-generation-(rag)-best-practices-for-enterprise-ai-chunking-embeddings-reranking-and-hybrid-search-optimization"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      stackai.com/insights/rag-best-practices
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>27</td>
                  <td>Lushbinary, &quot;RAG Production Guide 2026&quot;</td>
                  <td>
                    <a
                      href="https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      lushbinary.com/blog/rag-production-guide
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>28</td>
                  <td>Starmorph Blog, &quot;RAG Techniques Compared&quot;</td>
                  <td>
                    <a
                      href="https://blog.starmorph.com/blog/rag-techniques-compared-best-practices-guide"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      blog.starmorph.com/blog/rag-techniques-compared
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>コスト最適化(プロンプトキャッシュ)</h4>
          <div className={styles.tableWrap}>
            <table>
              <tbody>
                <tr>
                  <td>29</td>
                  <td>
                    hidekazu-konishi.com, &quot;Prompt Caching and Token Efficiency Guide&quot;
                  </td>
                  <td>
                    <a
                      href="https://hidekazu-konishi.com/entry/anthropic_claude_api_prompt_caching_and_token_efficiency.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      hidekazu-konishi.com/entry/prompt-caching
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>30</td>
                  <td>ProjectDiscovery Blog, &quot;How We Cut LLM Costs by 59%&quot;</td>
                  <td>
                    <a
                      href="https://projectdiscovery.io/blog/how-we-cut-llm-cost-with-prompt-caching"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      projectdiscovery.io/blog/prompt-caching
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>総論・入門解説</h4>
          <div className={styles.tableWrap}>
            <table>
              <tbody>
                <tr>
                  <td>31</td>
                  <td>
                    Cronus, &quot;Anthropic&apos;s Approach to Effective Context Engineering&quot;
                  </td>
                  <td>
                    <a
                      href="https://cr0nu3.github.io/posts/Effective_context_engineering_for_AI_Agents/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      cr0nu3.github.io/posts/Effective_context_engineering
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>32</td>
                  <td>Yashwant Deshmukh, &quot;Context Engineering: The Critical AI Skill&quot;</td>
                  <td>
                    <a
                      href="https://medium.com/@yashwant.deshmukh23/a-complete-guide-to-context-engineering-for-ai-agents-56b84ff6bc26"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      medium.com/@yashwant.deshmukh23
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <footer className={styles.pageFooter}>
          本ドキュメントは2026年7月時点で参照可能な情報をもとに作成。コンテキストエンジニアリングは急速に発展している分野であり、Anthropic・LangChain等の公式ドキュメントは随時更新されるため、実装時は各リンク先の最新版を確認すること。
        </footer>
      </main>
    </div>
  );
}
