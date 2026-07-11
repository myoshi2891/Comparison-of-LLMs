import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title:
    "コンテキストエンジニアリング入門 AIエージェントのためのステップバイステップ実践ガイド | LLM-Studies",
  description:
    "プロンプト単体の最適化ではなく、システムプロンプト、ツール定義、履歴、外部データ、メモリ等を含むコンテキスト全体を設計・キュレーションするコンテキストエンジニアリングの実践ガイド。",
};

const DIAGRAMS = {
  relation:
    "flowchart LR\n    A[プロンプトエンジニアリング 指示文の設計] --> B[コンテキストエンジニアリング 情報環境全体の設計]\n    B --> C[システムプロンプト]\n    B --> D[ツール定義]\n    B --> E[会話履歴]\n    B --> F[検索された外部知識]\n    B --> G[長期メモリ]",

  rot: "flowchart LR\n    A[短いコンテキスト 高い精度] --> B[中程度のコンテキスト やや精度が低下]\n    B --> C[長いコンテキスト コンテキストロットが顕在化]\n    C --> D[非常に長いコンテキスト 予測が不安定になる]",

  loop: "flowchart TD\n    Sys[システムプロンプト] --> Context[コンテキストウィンドウ]\n    Tools[ツール定義] --> Context\n    Mem[メモリファイル] --> Context\n    User[ユーザーの入力] --> Context\n    Context --> LLM[LLMによる推論]\n    LLM --> Action[ツール呼び出しを実行]\n    Action --> Result[ツールの実行結果]\n    Result --> Context\n    LLM --> Output[エージェントの応答を出力]",

  jit: "flowchart TD\n    Q1{データは高頻度で更新されるか}\n    Q1 -->|更新は少なく安定的| Pre[事前取得を選ぶ 埋め込み検索であらかじめ読み込む]\n    Q1 -->|更新が多く流動的| JIT[ジャストインタイム取得を選ぶ ファイルパスやクエリを都度実行する]\n    Pre --> Hybrid[多くの現場ではハイブリッド戦略が最適]\n    JIT --> Hybrid",

  wsci: "flowchart TB\n    Core[有限のコンテキストウィンドウ]\n    Core --> Write[Write コンテキストウィンドウの外に書き出す]\n    Core --> Select[Select 必要な情報だけを取り込む]\n    Core --> Compress[Compress 要約して圧縮する]\n    Core --> Isolate[Isolate サブエージェントへ分離する]",

  compaction:
    "sequenceDiagram\n    participant U as ユーザー\n    participant A as エージェント\n    participant C as コンテキストウィンドウ\n    U->>A: 長時間タスクを依頼する\n    loop 会話が続く限り\n        A->>C: メッセージやツール結果を追加する\n    end\n    C-->>A: トークン上限に近づいたことを検知する\n    A->>A: これまでの内容を要約する\n    A->>C: 要約と直近の重要情報だけを残す\n    A->>U: 作業を継続する",

  subagent:
    "flowchart TD\n    Lead[リードエージェント 計画と統合を担当]\n    Lead --> Sub1[サブエージェント1 調査タスクAを担当]\n    Lead --> Sub2[サブエージェント2 調査タスクBを担当]\n    Lead --> Sub3[サブエージェント3 調査タスクCを担当]\n    Sub1 --> Summary1[凝縮された要約]\n    Sub2 --> Summary2[凝縮された要約]\n    Sub3 --> Summary3[凝縮された要約]\n    Summary1 --> Merge[リードエージェントによる統合結果]\n    Summary2 --> Merge\n    Summary3 --> Merge",

  failure:
    "flowchart LR\n    subgraph 原因\n        A1[ハルシネーションが記録され続ける]\n        A2[コンテキストが長くなりすぎる]\n        A3[無関係な情報やツールが多すぎる]\n        A4[矛盾する情報や指示が混在する]\n    end\n    subgraph 症状\n        B1[コンテキスト汚染]\n        B2[コンテキスト散漫]\n        B3[コンテキスト混乱]\n        B4[コンテキスト衝突]\n    end\n    A1 --> B1\n    A2 --> B2\n    A3 --> B3\n    A4 --> B4",
};

export default function Page() {
  return (
    <div className={styles.docWrapper}>
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
        <div className={styles.sidebarTitle}>目次</div>
        <a href="#intro" className={styles.tocLink} data-target="intro">
          はじめに
        </a>
        <a href="#ch1" className={styles.tocLink} data-target="ch1">
          1. コンテキストエンジニアリングとは
        </a>
        <a href="#ch2" className={styles.tocLink} data-target="ch2">
          2. なぜ重要なのか
        </a>
        <a href="#ch3" className={styles.tocLink} data-target="ch3">
          3. コンテキストの解剖学
        </a>
        <a href="#ch4" className={styles.tocLink} data-target="ch4">
          4. ステップバイステップ実践
        </a>
        <a href="#ch5" className={styles.tocLink} data-target="ch5">
          5. よくある落とし穴
        </a>
        <a href="#ch6" className={styles.tocLink} data-target="ch6">
          6. 実践チェックリスト
        </a>
        <a href="#ch7" className={styles.tocLink} data-target="ch7">
          7. ツール早見表
        </a>
        <a href="#ch8" className={styles.tocLink} data-target="ch8">
          8. まとめ
        </a>
        <a href="#ch9" className={styles.tocLink} data-target="ch9">
          9. 参考文献
        </a>
      </nav>

      <main className={styles.content}>
        <header className={styles.docHeader} id="intro">
          <div className={styles.docEyebrow}>
            <i className="ti ti-brain" role="img" aria-label="brain"></i>
            {" AI engineering guide"}
          </div>
          <h1>コンテキストエンジニアリング入門</h1>
          <p className={styles.docLead}>AIエージェントのためのステップバイステップ実践ガイド</p>
        </header>

        <section>
          <p>
            2023年から2024年にかけて、AI活用の中心にあったのは「プロンプトエンジニアリング」でした。しかし2025年後半以降、AIエージェントが複数ターンにわたって自律的にツールを使いこなすようになると、業界の関心は「コンテキストエンジニアリング」という、より広い概念へと移っています。
          </p>
          <p>
            本記事は、この分野に初めて触れるエンジニアやプロダクト担当者を対象に、コンテキストエンジニアリングの基礎から実践的なベストプラクティスまでをステップバイステップで解説するものです。各章の末尾には、その章の内容の根拠となった一次情報源のURLを明記しています。
          </p>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-users" role="img" aria-label="users"></i>
            <div>
              <strong>対象読者</strong>
              {": "}
              LLMを使ったアプリケーションやAIエージェントを開発しているエンジニア、QAエンジニア、プロダクトマネージャー。プロンプトエンジニアリングの基礎知識があるとより理解しやすいですが、必須ではありません。
            </div>
          </div>
        </section>

        {/* ============ 1. コンテキストエンジニアリングとは ============ */}
        <section id="ch1">
          <h2>
            <i className="ti ti-bulb" role="img" aria-label="bulb"></i>1.
            コンテキストエンジニアリングとは何か
          </h2>

          <h3>1.1 定義</h3>
          <p>
            Anthropicのエンジニアリングチームは、コンテキストエンジニアリングを次のように定義しています。「コンテキスト」とはLLMが推論を行う際に読み込まれるトークンの集合を指し、「エンジニアリング」とは、望ましい挙動を一貫して引き出すために、そのトークン集合の有用性を最大化する作業を意味します。つまりコンテキストエンジニアリングとは、システムプロンプトだけでなく、ツール定義、会話履歴、検索された外部データなど、LLMに渡されるあらゆる情報を、絶えず変化する状況の中で取捨選択し続ける技術です。
          </p>
          <p>
            言い換えると、コンテキストエンジニアリングは単発のタスクである「プロンプトを書く」こととは異なり、エージェントが1ステップ推論するたびに繰り返される、反復的なキュレーション作業です。
          </p>

          <h3>1.2 プロンプトエンジニアリングとの違い</h3>
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
                  <td>システムプロンプトや指示文の言い回し</td>
                  <td>
                    システムプロンプト、ツール、会話履歴、検索データ、メモリなど全体の情報環境
                  </td>
                </tr>
                <tr>
                  <td>タイミング</td>
                  <td>主に事前に一度設計する</td>
                  <td>エージェントの各推論ステップごとに継続的に行う</td>
                </tr>
                <tr>
                  <td>想定用途</td>
                  <td>一問一答の分類や文章生成タスク</td>
                  <td>複数ターン、長時間にわたり自律的に動くエージェント</td>
                </tr>
                <tr>
                  <td>主な失敗要因</td>
                  <td>曖昧な指示、言葉選びのミス</td>
                  <td>情報過多、古い情報の残留、無関係な情報の混入</td>
                </tr>
                <tr>
                  <td>代表的な提唱者</td>
                  <td>各種プロンプトガイド</td>
                  <td>Anthropic、LangChain、Cognition AI、Drew Breunig氏など</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.diagramContainer}>
            <div className={styles.diagramTitle}>
              <i className="ti ti-git-branch" role="img" aria-label="git-branch"></i>
              {"図1: プロンプトエンジニアリングとコンテキストエンジニアリングの関係"}
            </div>
            <div className={styles.mermaidDiagram}>
              <MermaidDiagram chart={DIAGRAMS.relation} />
            </div>
          </div>

          <p>
            Anthropicは、コンテキストエンジニアリングを「プロンプトエンジニアリングの自然な延長」と位置づけています。LLMを使ったエンジニアリングの初期には、日常的なチャット以外の用途の多くが一発勝負の分類やテキスト生成であったため、プロンプトの書き方がすべてでした。しかし、より高度で長時間動作するエージェントを構築する段階に入ると、システム指示、ツール、Model
            Context
            Protocol、外部データ、会話履歴など、コンテキスト全体の状態を管理する戦略が必要になります。
          </p>
          <p>
            著名な研究者Andrej
            Karpathy氏は、LLMを新しい種類のオペレーティングシステムに例え、LLM自体をCPU、コンテキストウィンドウをRAMになぞらえました。RAMと同様、コンテキストウィンドウにも限られた容量しかなく、OSがRAMに何を載せるかを管理するように、私たちはエージェントのコンテキストウィンドウに何を載せるかを管理する必要がある、という考え方です。
          </p>

          <h3>1.3 なぜウィンドウが重要なのか</h3>
          <p>
            エージェントはループの中で動作し続けるため、次のターンで役立つかもしれない情報がどんどん蓄積されていきます。この絶えず膨張する情報の宇宙の中から、限られたコンテキストウィンドウに何を入れるかを選び取る作業こそが、コンテキストエンジニアリングの本質です。
          </p>

          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteTitle}>
              <i className="ti ti-link" role="img" aria-label="link"></i>
              {"出典"}
            </div>
            <ul>
              <li>
                {"Anthropic「Effective context engineering for AI agents」 "}
                <a
                  href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/effective-context-engineering-for-ai-agents
                </a>
              </li>
              <li>
                {"LangChain「Context Engineering for Agents」 "}
                <a
                  href="https://www.langchain.com/blog/context-engineering-for-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  langchain.com/blog/context-engineering-for-agents
                </a>
              </li>
              <li>
                {"Drew Breunig「How Long Contexts Fail」 "}
                <a
                  href="https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ 2. なぜ重要なのか ============ */}
        <section id="ch2">
          <h2>
            <i className="ti ti-trending-down" role="img" aria-label="trending-down"></i>
            {"2. なぜ重要なのか: コンテキストロットという現象"}
          </h2>

          <h3>2.1 コンテキストロットとは</h3>
          <p>
            コンテキストウィンドウが大きければ大きいほど良い、と考えるのは自然なことですが、実際の研究結果はこれを否定しています。AIベクトルデータベース企業Chromaが2025年に発表した研究「Context
            Rot」は、GPT-4.1、Claude 4系、Gemini
            2.5、Qwen3を含む18の最先端モデルを対象に検証を行い、入力トークン数が増えるほど、すべてのモデルで性能が劣化するという結果を示しました。しかもこの劣化は、コンテキストウィンドウの上限にかなり余裕がある段階から始まります。
          </p>
          <p>
            この現象は「コンテキストロット」と呼ばれ、Needle in a
            Haystackのような単純な検索型ベンチマークでは見えてこなかった、より現実的なタスクにおける性能劣化を明らかにしました。
          </p>

          <h3>2.2 Chromaの研究結果の要点</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>検証項目</th>
                  <th>結果の概要</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>対象モデル数</td>
                  <td>GPT-4.1、Claude 4系、Gemini 2.5系、Qwen3など18モデル</td>
                </tr>
                <tr>
                  <td>基本的な傾向</td>
                  <td>入力トークン数が増えるほど、全モデルで不規則に性能が低下する</td>
                </tr>
                <tr>
                  <td>100万トークン級モデル</td>
                  <td>
                    広告される上限よりずっと手前、実務的にはおおむね20万トークン前後から性能劣化が目立ち始める
                  </td>
                </tr>
                <tr>
                  <td>Lost in the middleの効果</td>
                  <td>
                    関連する情報が20件の文書の中央付近、5番目から15番目あたりに置かれると正解率が大きく低下する
                  </td>
                </tr>
                <tr>
                  <td>誤解されがちな点</td>
                  <td>
                    Needle in a
                    Haystackで高得点でも、要約や複雑な推論を伴う実タスクでは性能が保証されない
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.diagramContainer}>
            <div className={styles.diagramTitle}>
              <i className="ti ti-chart-line" role="img" aria-label="chart-line"></i>
              {"図2: コンテキストが増えるにつれて性能が低下していく概念図"}
            </div>
            <div className={styles.mermaidDiagram}>
              <MermaidDiagram chart={DIAGRAMS.rot} />
            </div>
          </div>

          <h3>2.3 なぜ起こるのか: Transformerの構造的な制約</h3>
          <p>
            この劣化の背景には、LLMの基盤であるTransformerアーキテクチャの構造的な制約があります。Transformerでは、すべてのトークンが他のすべてのトークンに注意を向けることができる仕組みになっているため、トークン数がnであれば、n対nの組み合わせの関係が発生します。コンテキスト長が伸びるほど、この関係を捉えるモデルの能力は薄く引き伸ばされ、コンテキストサイズと注意の集中度との間に自然な緊張関係が生まれます。
          </p>
          <p>
            さらにモデルは、比較的短い文章が多い訓練データの分布から注意パターンを学習するため、非常に長いコンテキストにまたがる依存関係については、経験や専用パラメータが相対的に少なくなります。位置エンコーディングの補間といった技術によって長いシーケンスを扱えるようにはなっていますが、トークンの位置に関する理解には多少の劣化が伴います。これらの要因が積み重なり、崖のような急激な性能低下ではなく、なだらかな性能勾配が生まれます。
          </p>
          <p>
            こうした事実から、思慮深いコンテキストエンジニアリングは、能力の高いエージェントを構築するうえで不可欠であるとAnthropicは結論づけています。
          </p>

          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteTitle}>
              <i className="ti ti-link" role="img" aria-label="link"></i>
              {"出典"}
            </div>
            <ul>
              <li>
                {
                  "Chroma Research「Context Rot: How Increasing Input Tokens Impacts LLM Performance」 "
                }
                <a
                  href="https://research.trychroma.com/context-rot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  research.trychroma.com/context-rot
                </a>
              </li>
              <li>
                {"Anthropic「Effective context engineering for AI agents」 "}
                <a
                  href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/effective-context-engineering-for-ai-agents
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ 3. コンテキストの解剖学 ============ */}
        <section id="ch3">
          <h2>
            <i className="ti ti-layout-grid" role="img" aria-label="layout-grid"></i>
            {"3. コンテキストの解剖学: 何が入っているのか"}
          </h2>
          <p>エージェントのコンテキストウィンドウには、主に次のような要素が含まれます。</p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>構成要素</th>
                  <th>説明</th>
                  <th>代表例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>システムプロンプト</td>
                  <td>エージェントの役割や振る舞いを定義する指示文</td>
                  <td>背景情報、指示、ツールの使い方、出力形式の説明</td>
                </tr>
                <tr>
                  <td>ツール定義</td>
                  <td>エージェントが呼び出せる関数のスキーマと説明文</td>
                  <td>検索ツール、ファイル操作ツール、外部APIとの連携</td>
                </tr>
                <tr>
                  <td>Few-shotの例</td>
                  <td>期待する挙動を示す具体例</td>
                  <td>入力と出力のペア</td>
                </tr>
                <tr>
                  <td>会話履歴</td>
                  <td>これまでのやり取りの記録</td>
                  <td>ユーザー発言、エージェントの応答、ツールの実行結果</td>
                </tr>
                <tr>
                  <td>検索された知識</td>
                  <td>実行時に取り込まれる外部データ</td>
                  <td>RAGによる文書検索結果、ファイルの内容、Web検索結果</td>
                </tr>
                <tr>
                  <td>メモリ</td>
                  <td>セッションをまたいで保持される情報</td>
                  <td>ノートファイル、進捗ログ、学習した知見</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.diagramContainer}>
            <div className={styles.diagramTitle}>
              <i className="ti ti-refresh" role="img" aria-label="refresh"></i>
              {"図3: エージェントループの中でのコンテキストの流れ"}
            </div>
            <div className={styles.mermaidDiagram}>
              <MermaidDiagram chart={DIAGRAMS.loop} />
            </div>
          </div>

          <p>
            Anthropicによれば、良いコンテキストエンジニアリングとは、望ましい結果が得られる可能性を最大化する、可能な限り小さく高シグナルなトークン集合を見つけることです。ここで言う「最小限」とは「短い」という意味ではありません。エージェントに期待通りの振る舞いをさせるには、十分な情報を最初から与える必要がある、という点には注意が必要です。
          </p>
          <p>
            システムプロンプトについては、複雑で壊れやすいif-elseロジックを詰め込みすぎる失敗と、逆に曖昧で高レベルすぎる指示になり具体的な信号を与えられない失敗の、両極端の間にある「適切な高度」を狙うべきだとされています。
          </p>

          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteTitle}>
              <i className="ti ti-link" role="img" aria-label="link"></i>
              {"出典"}
            </div>
            <ul>
              <li>
                {"Anthropic「Effective context engineering for AI agents」 "}
                <a
                  href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/effective-context-engineering-for-ai-agents
                </a>
              </li>
              <li>
                {"Model Context Protocol公式ドキュメント "}
                <a
                  href="https://modelcontextprotocol.io/docs/getting-started/intro"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  modelcontextprotocol.io/docs/getting-started/intro
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ 4. ステップバイステップ実践 ============ */}
        <section id="ch4">
          <h2>
            <i className="ti ti-route" role="img" aria-label="route"></i>
            {"4. ステップバイステップ ベストプラクティス"}
          </h2>
          <p>
            ここからは、実際にコンテキストエンジニアリングを行う際の具体的な手順を、ステップごとに解説します。
          </p>

          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepTitle}>システムプロンプトを適切な高度で書く</div>
          </div>
          <p>
            システムプロンプトは、明確でシンプルかつ直接的な言葉を用い、エージェントにとって「適切な高度」で提示するべきです。
          </p>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {"複雑で壊れやすいif-elseロジックをハードコーディングしない"}
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {"曖昧で高レベルすぎる、共有された文脈を勝手に前提とするような指示も避ける"}
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {
                "background_information、instructions、Tool guidance、Output descriptionのようにセクションごとに整理し、タグや見出しで区切る"
              }
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {
                "まずは最良のモデルを使い、最小限のプロンプトでテストし、失敗パターンを見ながら指示や例を追加していく"
              }
            </li>
          </ul>

          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepTitle}>ツールを設計する</div>
          </div>
          <p>
            ツールはエージェントが環境とやり取りし、新しい情報をコンテキストに取り込むための手段です。ツールはエージェントと情報空間との間の契約にあたるため、トークン効率の良い情報を返し、効率的な振る舞いを促すことが極めて重要です。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>原則</th>
                  <th>悪い例</th>
                  <th>良い例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>機能を絞る</td>
                  <td>list_users、list_events、create_eventの3つを個別に用意する</td>
                  <td>空き時間を探して予定を登録するschedule_eventを1つ用意する</td>
                </tr>
                <tr>
                  <td>検索指向にする</td>
                  <td>すべての連絡先を返すlist_contacts</td>
                  <td>検索条件で絞り込むsearch_contacts</td>
                </tr>
                <tr>
                  <td>名前空間を分ける</td>
                  <td>chat、get_conversationのような曖昧な名前</td>
                  <td>asana_search、jira_searchのようにサービス名で前置する</td>
                </tr>
                <tr>
                  <td>レスポンス形式を選べるようにする</td>
                  <td>常に詳細な情報を返す</td>
                  <td>concise、detailedのようなresponse_formatを用意する</td>
                </tr>
                <tr>
                  <td>エラーメッセージを親切にする</td>
                  <td>内部のトレースバックをそのまま返す</td>
                  <td>何をどう修正すればよいか明確に伝える</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>JSON Schema</span>
              <span className={styles.codeLang}>JSON</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.ck}>{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                <span>{"  "}</span>
                <span className={styles.cs}>{'"name"'}</span>
                <span>{": "}</span>
                <span className={styles.cv}>{'"search_contacts"'}</span>
                <span>{","}</span>
              </div>
              <div className={styles.codeLine}>
                <span>{"  "}</span>
                <span className={styles.cs}>{'"description"'}</span>
                <span>{": "}</span>
                <span className={styles.cv}>
                  {'"名前や会社名で連絡先を検索する。結果は関連度順に返す。"'}
                </span>
                <span>{","}</span>
              </div>
              <div className={styles.codeLine}>
                <span>{"  "}</span>
                <span className={styles.cs}>{'"parameters"'}</span>
                <span>{": "}</span>
                <span className={styles.ck}>{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                <span>{"    "}</span>
                <span className={styles.cs}>{'"query"'}</span>
                <span>{": "}</span>
                <span className={styles.cv}>{'"検索キーワード"'}</span>
                <span>{","}</span>
              </div>
              <div className={styles.codeLine}>
                <span>{"    "}</span>
                <span className={styles.cs}>{'"response_format"'}</span>
                <span>{": "}</span>
                <span className={styles.cv}>{'"concise または detailed"'}</span>
              </div>
              <div className={styles.codeLine}>
                <span>{"  "}</span>
                <span className={styles.ck}>{"}"}</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>{"}"}</span>
              </div>
            </div>
          </div>

          <p>
            ツールが多すぎたり機能が重複していたりすると、エージェントはどのツールを使うべきか判断できなくなります。人間のエンジニアが「どちらのツールを使うべきか」を即答できない状況では、AIエージェントにそれ以上の判断を期待するべきではない、というのがAnthropicの指摘です。
          </p>

          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepTitle}>Few-shotの例は厳選する</div>
          </div>
          <p>
            Few-shotプロンプティングは有効なベストプラクティスですが、あらゆるエッジケースを網羅しようとして例を詰め込みすぎるのは避けるべきです。代わりに、期待される挙動を的確に示す、多様で代表的な例を厳選して用意することが推奨されています。LLMにとって、こうした例は「百聞は一見に如かず」の一枚の絵に相当します。
          </p>

          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepTitle}>
              検索戦略を選ぶ: 事前取得、ジャストインタイム、ハイブリッド
            </div>
          </div>
          <p>
            多くのAIネイティブなアプリケーションは、埋め込みベースの検索を推論前に行い、重要なコンテキストをあらかじめ用意します。一方でエージェント指向のアプローチが広がるにつれ、こうした事前検索を「ジャストインタイム」戦略で補うチームが増えています。
          </p>
          <p>
            ジャストインタイム戦略では、すべてのデータを事前処理するのではなく、ファイルパスや保存済みクエリ、Webリンクといった軽量な識別子だけを保持し、実行時にツールを使ってその識別子から動的にデータを読み込みます。Claude
            Codeはこの手法を用いて、巨大なデータベースに対する複雑な分析を行う際に、データ全体をコンテキストに載せることなくBashのheadやtailなどのコマンドで必要な部分だけを読み込みます。この考え方は人間の認知にも似ています。私たちは情報のすべてを記憶するのではなく、ファイルシステムや受信箱、ブックマークのような外部の整理、索引システムを使って、必要なときに情報を引き出しています。
          </p>
          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className="ti ti-alert-triangle" role="img" aria-label="warning"></i>
            <div>
              実行時の探索は事前計算済みデータの取得より遅くなるというトレードオフがあります。適切なツールとヒューリスティックがなければ、エージェントはツールの誤用や行き止まりの探索によってコンテキストを浪費してしまいます。
            </div>
          </div>

          <div className={styles.diagramContainer}>
            <div className={styles.diagramTitle}>
              <i className="ti ti-git-branch" role="img" aria-label="git-branch"></i>
              {"図4: 検索戦略の意思決定フロー"}
            </div>
            <div className={styles.mermaidDiagram}>
              <MermaidDiagram chart={DIAGRAMS.jit} />
            </div>
          </div>

          <p>
            法務や財務のように動的な内容が少ない領域ではハイブリッド戦略が適していることが多く、Claude
            Codeも実際にこのハイブリッドモデルを採用しています。CLAUDE.mdのようなファイルは最初からそのままコンテキストに読み込まれる一方、globやgrepのような仕組みで環境を探索し、必要なファイルをジャストインタイムで取得します。モデルの性能が上がるにつれ、設計は次第に「賢いモデルに賢く動いてもらう」方向へ、つまり人間によるキュレーションを減らす方向へ進むと予想されています。
          </p>

          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>5</div>
            <div className={styles.stepTitle}>長時間タスクのためのコンテキスト管理: 4つの戦略</div>
          </div>
          <p>
            数十分から数時間に及ぶような長時間タスク、たとえば大規模なコードベースの移行や本格的な調査プロジェクトでは、トークン数がコンテキストウィンドウの上限を超えてしまいます。コンテキストウィンドウが将来さらに大きくなったとしても、最強のエージェント性能を求める限り、コンテキスト汚染や情報関連性の問題は残り続けると考えられています。
          </p>
          <p>
            LangChainはこうした課題への対処法を、Write、Select、Compress、Isolateという4つの戦略に整理しています。
          </p>

          <div className={styles.diagramContainer}>
            <div className={styles.diagramTitle}>
              <i className="ti ti-stack-2" role="img" aria-label="stack"></i>
              {"図5: Write、Select、Compress、Isolateの4戦略"}
            </div>
            <div className={styles.mermaidDiagram}>
              <MermaidDiagram chart={DIAGRAMS.wsci} />
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>戦略</th>
                  <th>内容</th>
                  <th>代表的な実装例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Write</td>
                  <td>コンテキストウィンドウの外部に情報を保存する</td>
                  <td>スクラッチパッド、NOTES.mdのようなメモファイル</td>
                </tr>
                <tr>
                  <td>Select</td>
                  <td>必要な情報だけをコンテキストに取り込む</td>
                  <td>類似度検索、埋め込みベースの検索、ツールのフィルタリング</td>
                </tr>
                <tr>
                  <td>Compress</td>
                  <td>必要なトークンだけを残す</td>
                  <td>会話の要約、ツール結果の圧縮、コンパクション</td>
                </tr>
                <tr>
                  <td>Isolate</td>
                  <td>複数のエージェントやサンドボックスに分割する</td>
                  <td>サブエージェントアーキテクチャ、サンドボックス環境</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Anthropicは特に,
            長時間タスクのために有効な3つの技法として、コンパクション、構造化されたノートテイキング、サブエージェントアーキテクチャを挙げています。
          </p>

          <h3>5-1 コンパクション</h3>
          <p>
            コンパクションとは、コンテキストウィンドウの上限に近づいた会話の内容を要約し、その要約をもとに新しいコンテキストウィンドウを再構築する手法です。Claude
            Codeでは、メッセージ履歴をモデルに渡して要約と圧縮を行わせ、アーキテクチャ上の意思決定や未解決のバグ、実装の詳細は保持しつつ、冗長なツール出力やメッセージは破棄します。その後、圧縮されたコンテキストと直近でアクセスした5つのファイルとともに作業を継続します。
          </p>

          <div className={styles.diagramContainer}>
            <div className={styles.diagramTitle}>
              <i className="ti ti-arrows-shuffle" role="img" aria-label="arrows-shuffle"></i>
              {"図6: コンパクションのプロセス"}
            </div>
            <div className={styles.mermaidDiagram}>
              <MermaidDiagram chart={DIAGRAMS.compaction} />
            </div>
          </div>

          <p>
            コンパクションの難しさは、何を残し何を捨てるかの見極めにあります。過度に積極的な圧縮は、後になって重要性が判明するような微妙な文脈を失わせるリスクがあります。実装にあたっては、複雑なエージェントのトレースを使ってプロンプトを丁寧にチューニングし、まずは再現率を最大化してあらゆる関連情報を確実に捉え、そのうえで不要な内容を削って精度を高めていくアプローチが推奨されています。もっとも軽量な圧縮手法の一つが「ツール結果のクリア」で、深い履歴の中で一度呼び出されたツールの生の結果を、後から再び見る必要がない場合に消去する、というものです。
          </p>

          <h3>5-2 構造化されたノートテイキング</h3>
          <p>
            構造化されたノートテイキング、いわゆるエージェント的メモリは、エージェントがコンテキストウィンドウの外部にあるメモリに定期的にメモを書き込み、それを後で再びコンテキストに取り込むという技法です。Claude
            Codeが作成するTo-Doリストや、独自エージェントが保持するNOTES.mdファイルのように、このシンプルなパターンによって、何十回ものツール呼び出しの中で失われてしまいがちな重要な文脈や依存関係を、複雑なタスク全体を通じて追跡できます。
          </p>
          <p>
            Anthropicは2025年9月、Claude Sonnet
            4.5とともに、コンテキストウィンドウの外にファイルベースでストレージできるメモリツールをパブリックベータとして公開しました。これによりエージェントは、時間をかけて知識ベースを構築し、セッションをまたいでプロジェクトの状態を保持し、すべてをコンテキストに保持しなくても過去の作業を参照できるようになります。この機能はコンテキストの編集機能と組み合わせて使うこともでき、Anthropicの社内評価では、両者を組み合わせることでベースラインに対して39%の性能向上が見られたと報告されています。
          </p>

          <h3>5-3 サブエージェントアーキテクチャ</h3>
          <p>
            サブエージェントアーキテクチャは、コンテキストの制約を回避するもう一つの方法です。1つのエージェントがプロジェクト全体の状態を保持し続けるのではなく、専門化されたサブエージェントがそれぞれクリーンなコンテキストウィンドウで焦点を絞ったタスクを担当します。メインのエージェントは高レベルの計画で調整役を担い、サブエージェントは深い技術的作業やツールを使った情報収集を行います。各サブエージェントは数万トークン規模の探索を行うこともありますが、返すのは1000から2000トークン程度に凝縮された要約だけです。
          </p>

          <div className={styles.diagramContainer}>
            <div className={styles.diagramTitle}>
              <i className="ti ti-sitemap" role="img" aria-label="sitemap"></i>
              {"図7: サブエージェントアーキテクチャの構成"}
            </div>
            <div className={styles.mermaidDiagram}>
              <MermaidDiagram chart={DIAGRAMS.subagent} />
            </div>
          </div>

          <p>
            この構成では、詳細な探索の文脈はサブエージェントの中に隔離されたまま保たれ、リードエージェントは結果の統合と分析に専念できます。Anthropicの多エージェント研究システムでは、この設計が単一エージェントシステムに対して大幅な性能改善をもたらしたことが報告されています。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>状況</th>
                  <th>適した技法</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>継続的なやり取りが必要な会話的タスク</td>
                  <td>コンパクション</td>
                </tr>
                <tr>
                  <td>明確なマイルストーンがある反復的な開発作業</td>
                  <td>構造化されたノートテイキング</td>
                </tr>
                <tr>
                  <td>並列探索が価値を生む複雑な調査や分析</td>
                  <td>マルチエージェントアーキテクチャ</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>6</div>
            <div className={styles.stepTitle}>マルチエージェントを設計すべきか判断する</div>
          </div>
          <p>
            マルチエージェントアーキテクチャについては、業界内で活発な議論があります。Cognition
            AIは「Don't Build
            Multi-Agents」と題した記事で、サブエージェント間でコンテキストが共有されないこと、各エージェントの行動が暗黙の意思決定を伴い、それらが衝突するとまずい結果を招くことを理由に、マルチエージェント構成は壊れやすいと主張しました。一方Anthropicは、複雑な調査タスクにおいてリードエージェントと隔離されたサブエージェントを組み合わせる設計が、トークン使用量の増大を通じて性能をスケールさせる有効な手段になると報告しています。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>論点</th>
                  <th>Cognition AIの立場</th>
                  <th>Anthropicの立場</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>主張</td>
                  <td>並列サブエージェントはコンテキストが分断され、壊れやすい</td>
                  <td>隔離されたコンテキストによって並列探索が可能になり、性能が向上する</td>
                </tr>
                <tr>
                  <td>象徴的な例</td>
                  <td>
                    Flappy Birdのクローン作成でサブエージェント同士のビジュアルスタイルが食い違う例
                  </td>
                  <td>調査タスクでBrowseCompの性能が大幅に向上した例</td>
                </tr>
                <tr>
                  <td>推奨する設計</td>
                  <td>単一スレッドで線形に動くエージェントを基本にする</td>
                  <td>リードエージェントが計画し、サブエージェントに委任する</td>
                </tr>
                <tr>
                  <td>読み取り作業との相性</td>
                  <td>やや慎重</td>
                  <td>読み取り中心のタスクは並列化しやすいとされる</td>
                </tr>
                <tr>
                  <td>書き込み作業との相性</td>
                  <td>特に危険と指摘</td>
                  <td>書き込みが競合する場合は慎重な設計が必要という点で一致</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className="ti ti-bulb" role="img" aria-label="bulb"></i>
            <div>
              両者の議論に共通する教訓は、読み取り操作は書き込み操作よりも並列化しやすいということです。複数のエージェントが同時にコードや文章を書き込むと、互いに矛盾する決定が両立できない出力を生み出しやすくなります。
            </div>
          </div>

          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>7</div>
            <div className={styles.stepTitle}>評価してイテレーションする</div>
          </div>
          <p>
            ツールやプロンプトの改善効果を正しく測るには、評価の仕組みが欠かせません。Anthropicが提案する手順は次のとおりです。
          </p>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {"実際の利用シーンに基づいたプロトタイプを素早く構築し、自分自身でテストする"}
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {
                "実際のデータソースやサービスに基づいた、複数ツール呼び出しを要するような現実的な評価タスクを多数用意する"
              }
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {"評価タスクごとに、検証可能な正解や期待される結果を対応づける"}
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {
                "シンプルなエージェントループでプログラム的に評価を実行し、精度だけでなく、ツール呼び出し回数やトークン消費量、エラー発生状況も計測する"
              }
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {
                "エージェント自身にトランスクリプトを分析させ、ツールの説明文やスキーマの改善案を出してもらう"
              }
            </li>
          </ul>
          <p>
            こうした評価駆動のプロセスを通じて、ツールの説明文をわずかに調整するだけでも劇的な性能向上が得られることがあるとAnthropicは報告しています。
          </p>

          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteTitle}>
              <i className="ti ti-link" role="img" aria-label="link"></i>
              {"出典"}
            </div>
            <ul>
              <li>
                {"Anthropic「Effective context engineering for AI agents」 "}
                <a
                  href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/effective-context-engineering-for-ai-agents
                </a>
              </li>
              <li>
                {"Anthropic「Writing effective tools for AI agents」 "}
                <a
                  href="https://www.anthropic.com/engineering/writing-tools-for-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/writing-tools-for-agents
                </a>
              </li>
              <li>
                {"Anthropic「How we built our multi-agent research system」 "}
                <a
                  href="https://www.anthropic.com/engineering/multi-agent-research-system"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/engineering/multi-agent-research-system
                </a>
              </li>
              <li>
                {"Anthropic「Managing context on the Claude Developer Platform」 "}
                <a
                  href="https://www.anthropic.com/news/context-management"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/news/context-management
                </a>
              </li>
              <li>
                {"Anthropic Platform Docs「Memory tool」 "}
                <a
                  href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
                </a>
              </li>
              <li>
                {"Cognition AI「Don't Build Multi-Agents」 "}
                <a
                  href="https://cognition.com/blog/dont-build-multi-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cognition.com/blog/dont-build-multi-agents
                </a>
              </li>
              <li>
                {"LangChain「How and when to build multi-agent systems」 "}
                <a
                  href="https://www.langchain.com/blog/how-and-when-to-build-multi-agent-systems"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  langchain.com/blog/how-and-when-to-build-multi-agent-systems
                </a>
              </li>
              <li>
                {"LangChain「Context Engineering for Agents」 "}
                <a
                  href="https://www.langchain.com/blog/context-engineering-for-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  langchain.com/blog/context-engineering-for-agents
                </a>
              </li>
              <li>
                {"HumanLayer「12-Factor Agents」 "}
                <a
                  href="https://github.com/humanlayer/12-factor-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/humanlayer/12-factor-agents
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ 5. よくある落とし穴 ============ */}
        <section id="ch5">
          <h2>
            <i className="ti ti-alert-triangle" role="img" aria-label="warning"></i>
            {"5. よくある落とし穴: 4つの失敗モード"}
          </h2>
          <p>
            リサーチャーのDrew
            Breunig氏は、長いコンテキストがどのように失敗するかを4つのパターンに整理しました。この分類は業界で広く引用されており、LangChainも独自のリポジトリでこれらの失敗モードへの対処法を実装として公開しています。
          </p>

          <div className={styles.diagramContainer}>
            <div className={styles.diagramTitle}>
              <i className="ti ti-git-merge" role="img" aria-label="git-merge"></i>
              {"図8: 原因と症状の対応関係"}
            </div>
            <div className={styles.mermaidDiagram}>
              <MermaidDiagram chart={DIAGRAMS.failure} />
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>失敗モード</th>
                  <th>説明</th>
                  <th>典型的な兆候</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>コンテキスト汚染</td>
                  <td>
                    ハルシネーションやエラーがコンテキストに入り込み、以降くり返し参照されてしまう
                  </td>
                  <td>目標が誤って記録されると、達成不可能な目標のために不合理な戦略を繰り返す</td>
                </tr>
                <tr>
                  <td>コンテキスト散漫</td>
                  <td>
                    コンテキストが長くなりすぎて、モデルが訓練で学んだことよりも積み込まれた文脈に過度に依存してしまう
                  </td>
                  <td>
                    Pokemonをプレイするエージェントで、10万トークンを超えたあたりから新しい計画を立てず過去の行動を繰り返す傾向が観測された
                  </td>
                </tr>
                <tr>
                  <td>コンテキスト混乱</td>
                  <td>コンテキスト中の余計な情報が、低品質な応答の生成に使われてしまう</td>
                  <td>ツールを30個以上並べると説明文同士が重なり合い、選択精度が大きく落ちる</td>
                </tr>
                <tr>
                  <td>コンテキスト衝突</td>
                  <td>新たに蓄積された情報やツールが、プロンプト中の他の情報と矛盾してしまう</td>
                  <td>
                    自分で作っていないMCPツールを組み込んだ際に、説明文がプロンプトの他の指示と食い違う
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>これらの問題への対処法として、Breunig氏らは次のような技法を提案しています。</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>対処法</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>RAG</td>
                  <td>関連する情報だけを選んでコンテキストに追加し、より良い応答を助ける</td>
                </tr>
                <tr>
                  <td>Tool Loadout</td>
                  <td>タスクのフェーズごとに、関連するツール定義だけを絞り込んで有効化する</td>
                </tr>
                <tr>
                  <td>Context Quarantine</td>
                  <td>
                    サブタスクごとに専用のスレッドやコンテキストへ隔離し、早期のエラーがプロジェクト全体を汚染するのを防ぐ
                  </td>
                </tr>
                <tr>
                  <td>Context Pruning</td>
                  <td>検索結果の中から無関係な内容を取り除いてからモデルに渡す</td>
                </tr>
                <tr>
                  <td>Context Offloading</td>
                  <td>
                    スクラッチパッドのような領域にメモを書き出し、コンテキストを圧迫せずに後で参照できるようにする
                  </td>
                </tr>
                <tr>
                  <td>Context Summarization</td>
                  <td>蓄積された会話やツール結果を要約し、必要な情報だけを残す</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className="ti ti-alert-octagon" role="img" aria-label="danger"></i>
            <div>
              ツール数と精度の関係については、あるモデルでは30個を超えたあたりからツールの説明が重なり合い始め、100個を超えるとほぼ確実に失敗するという報告があります。より小さいモデルではその閾値はさらに下がり、19個までは成功していたのに46個のツールを与えると失敗する、という事例も報告されています。ツールは多ければ良いというものではなく、タスクに応じて動的に絞り込む設計が重要です。
            </div>
          </div>

          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteTitle}>
              <i className="ti ti-link" role="img" aria-label="link"></i>
              {"出典"}
            </div>
            <ul>
              <li>
                {"Drew Breunig「How Long Contexts Fail」 "}
                <a
                  href="https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html
                </a>
              </li>
              <li>
                {"Drew Breunig「How to Fix Your Context」 "}
                <a
                  href="https://www.dbreunig.com/2025/06/26/how-to-fix-your-context.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  dbreunig.com/2025/06/26/how-to-fix-your-context.html
                </a>
              </li>
              <li>
                {"LangChain「how_to_fix_your_context」リポジトリ "}
                <a
                  href="https://github.com/langchain-ai/how_to_fix_your_context"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/langchain-ai/how_to_fix_your_context
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ 6. 実践チェックリスト ============ */}
        <section id="ch6">
          <h2>
            <i className="ti ti-checklist" role="img" aria-label="checklist"></i>
            {"6. 実践チェックリスト"}
          </h2>
          <p>コンテキストエンジニアリングに取り組む際の、簡易チェックリストです。</p>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {
                "システムプロンプトの高度: 壊れやすいほど具体的すぎず、曖昧すぎて信号を与えられないほど抽象的でもないか"
              }
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {
                "ツールの数と機能範囲: 人間のエンジニアが「どのツールを使うべきか」を即答できる程度に整理されているか"
              }
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {"ツールの命名: サービス名やリソース名で名前空間が分けられているか"}
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {
                "ツールのレスポンス: 低レベルなIDではなく、意味のある自然言語の情報を優先して返しているか"
              }
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {"トークン効率: ページネーションやフィルタリング、切り詰めが適切に実装されているか"}
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {"Few-shotの例: エッジケースを網羅しようとして例を詰め込みすぎていないか"}
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {
                "検索戦略: データの更新頻度に応じて、事前取得、ジャストインタイム、ハイブリッドを使い分けているか"
              }
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {
                "長時間タスクへの備え: コンパクション、構造化ノートテイキング、サブエージェントのいずれかを用意しているか"
              }
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {"マルチエージェント設計: 書き込みが競合するタスクを不用意に並列化していないか"}
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {"コンテキスト汚染対策: ハルシネーションが繰り返し参照されない仕組みがあるか"}
            </li>
            <li>
              <i className="ti ti-circle-check" role="img" aria-label="check"></i>
              {"評価の仕組み: 現実的なタスクに基づく評価セットを用意し、継続的に改善しているか"}
            </li>
          </ul>
        </section>

        {/* ============ 7. ツール早見表 ============ */}
        <section id="ch7">
          <h2>
            <i className="ti ti-tools" role="img" aria-label="tools"></i>
            {"7. ツールとフレームワーク早見表"}
          </h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ツールやフレームワーク</th>
                  <th>主な役割</th>
                  <th>対応する戦略</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Claudeのメモリツール</td>
                  <td>ファイルベースでコンテキストウィンドウ外にメモリを保持する</td>
                  <td>Write、長時間タスクの継続</td>
                </tr>
                <tr>
                  <td>Claudeのコンテキスト編集機能</td>
                  <td>古くなったツール呼び出しや結果を自動でコンテキストから取り除く</td>
                  <td>Compress</td>
                </tr>
                <tr>
                  <td>Model Context Protocol</td>
                  <td>エージェントに外部ツールやデータソースを接続するための標準規格</td>
                  <td>Select</td>
                </tr>
                <tr>
                  <td>LangGraph</td>
                  <td>状態グラフによってエージェントのメモリや分岐を管理するフレームワーク</td>
                  <td>Write、Select、Compress、Isolateの全体</td>
                </tr>
                <tr>
                  <td>LangGraph Supervisor</td>
                  <td>サブエージェントに処理を委任し、隔離されたコンテキストで並列実行する</td>
                  <td>Isolate</td>
                </tr>
                <tr>
                  <td>LangGraph Bigtool</td>
                  <td>大量のツールの中から意味的に関連するものだけを選択する</td>
                  <td>Select</td>
                </tr>
                <tr>
                  <td>Claude Code</td>
                  <td>
                    CLAUDE.mdの事前読み込みとglob、grepによるジャストインタイム探索を組み合わせるハイブリッド設計
                  </td>
                  <td>Select、Write</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.sourceNote}>
            <div className={styles.sourceNoteTitle}>
              <i className="ti ti-link" role="img" aria-label="link"></i>
              {"出典"}
            </div>
            <ul>
              <li>
                {"Anthropic Platform Docs「Memory tool」 "}
                <a
                  href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
                </a>
              </li>
              <li>
                {"Anthropic「Managing context on the Claude Developer Platform」 "}
                <a
                  href="https://www.anthropic.com/news/context-management"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com/news/context-management
                </a>
              </li>
              <li>
                {"Model Context Protocol公式ドキュメント "}
                <a
                  href="https://modelcontextprotocol.io/docs/getting-started/intro"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  modelcontextprotocol.io/docs/getting-started/intro
                </a>
              </li>
              <li>
                {"LangChain「context_engineering」リポジトリ "}
                <a
                  href="https://github.com/langchain-ai/context_engineering"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/langchain-ai/context_engineering
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ 8. まとめ ============ */}
        <section id="ch8">
          <h2>
            <i className="ti ti-flag" role="img" aria-label="flag"></i>8. まとめ
          </h2>
          <div className={styles.summaryCard}>
            <p>
              コンテキストエンジニアリングとは、LLMの限られた「注意の予算」の中に,
              望ましい挙動を引き出すために必要な、最小限かつ高シグナルな情報だけを継続的にキュレーションし続ける技術です。プロンプトエンジニアリングが一度きりの指示文設計であるのに対し、コンテキストエンジニアリングはエージェントが動き続ける限り繰り返される作業であるという点が、最大の違いです。
            </p>
            <p>
              コンテキストウィンドウが大きければ大きいほど良いという単純な話ではなく、Chromaの研究が示すように、すべての最先端モデルは入力トークン数が増えるにつれて性能が劣化します。この現実を踏まえ、システムプロンプトの高度を調整すること、ツールを絞り込み設計すること、検索戦略を状況に応じて選ぶこと、そして長時間タスクにはコンパクション、構造化ノートテイキング、サブエージェントアーキテクチャを組み合わせることが、実践的なベストプラクティスとして確立されつつあります。
            </p>
            <p>
              モデルの性能は今後も向上し続けると見られますが、コンテキストを希少で有限な資源として扱うという考え方そのものは、信頼性が高く効果的なエージェントを構築するうえで、引き続き中心的な役割を果たすとAnthropicは結論づけています。
            </p>
          </div>
        </section>

        {/* ============ 9. 参考文献 ============ */}
        <section id="ch9">
          <h2>
            <i className="ti ti-books" role="img" aria-label="books"></i>9. 参考文献 全リンク一覧
          </h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>発行元</th>
                  <th>タイトル</th>
                  <th>公開時期</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Anthropic</td>
                  <td>Effective context engineering for AI agents</td>
                  <td>2025年9月29日</td>
                  <td>
                    <a
                      href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Anthropic</td>
                  <td>Writing effective tools for AI agents</td>
                  <td>2025年9月11日</td>
                  <td>
                    <a
                      href="https://www.anthropic.com/engineering/writing-tools-for-agents"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Anthropic</td>
                  <td>How we built our multi-agent research system</td>
                  <td>2025年6月13日</td>
                  <td>
                    <a
                      href="https://www.anthropic.com/engineering/multi-agent-research-system"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Anthropic</td>
                  <td>Managing context on the Claude Developer Platform</td>
                  <td>2025年9月29日</td>
                  <td>
                    <a
                      href="https://www.anthropic.com/news/context-management"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Anthropic Platform Docs</td>
                  <td>Memory tool</td>
                  <td>随時更新</td>
                  <td>
                    <a
                      href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Anthropic Docs</td>
                  <td>Prompt engineering overview</td>
                  <td>随時更新</td>
                  <td>
                    <a
                      href="https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>Chroma Research</td>
                  <td>Context Rot: How Increasing Input Tokens Impacts LLM Performance</td>
                  <td>2025年</td>
                  <td>
                    <a
                      href="https://research.trychroma.com/context-rot"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>LangChain</td>
                  <td>Context Engineering for Agents</td>
                  <td>2025年</td>
                  <td>
                    <a
                      href="https://www.langchain.com/blog/context-engineering-for-agents"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>LangChain</td>
                  <td>context_engineeringリポジトリ</td>
                  <td>2025年</td>
                  <td>
                    <a
                      href="https://github.com/langchain-ai/context_engineering"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>LangChain</td>
                  <td>How and when to build multi-agent systems</td>
                  <td>2025年6月16日</td>
                  <td>
                    <a
                      href="https://www.langchain.com/blog/how-and-when-to-build-multi-agent-systems"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>LangChain</td>
                  <td>how_to_fix_your_contextリポジトリ</td>
                  <td>2025年</td>
                  <td>
                    <a
                      href="https://github.com/langchain-ai/how_to_fix_your_context"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>Cognition AI</td>
                  <td>Don't Build Multi-Agents</td>
                  <td>2025年6月12日</td>
                  <td>
                    <a
                      href="https://cognition.com/blog/dont-build-multi-agents"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>13</td>
                  <td>Drew Breunig</td>
                  <td>How Long Contexts Fail</td>
                  <td>2025年6月22日</td>
                  <td>
                    <a
                      href="https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>14</td>
                  <td>Drew Breunig</td>
                  <td>How to Fix Your Context</td>
                  <td>2025年6月26日</td>
                  <td>
                    <a
                      href="https://www.dbreunig.com/2025/06/26/how-to-fix-your-context.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>15</td>
                  <td>HumanLayer</td>
                  <td>12-Factor Agents, Factor 3: Own your context window</td>
                  <td>2025年</td>
                  <td>
                    <a
                      href="https://github.com/humanlayer/12-factor-agents"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>16</td>
                  <td>Model Context Protocol</td>
                  <td>公式ドキュメント Introduction</td>
                  <td>随時更新</td>
                  <td>
                    <a
                      href="https://modelcontextprotocol.io/docs/getting-started/intro"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      リンク
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.pageFooterDisclaimer}>
            すべての情報は2026年7月時点での各サイトの公開内容に基づいています。コンテキストエンジニアリングは非常に速いスピードで進化している分野のため、最新の情報については各URLを直接ご確認ください。
          </p>
        </section>
      </main>
    </div>
  );
}
