import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "LangChain in your Pocket 徹底解説ガイド | LLM コスト計算機",
  description:
    "Mehul Gupta著『LangChain in your Pocket』を基に、LLMの基礎、Models/Prompts、Chains、Agents、OutputParsers/Memory、Callbacks、RAG、評価、自律型AIエージェント、2026年9月の最新動向までを網羅した初学者向けステップバイステップ完全読解ガイド。",
};

const DIAGRAM_BOOKMAP =
  'flowchart TB\n    accTitle: 本書の章構成マップ\n    accDescr: 第1章 LLMとLangChainの基礎から第16章 追加機能、最後に2026年最新動向まとめまでを順に進む学習ルート。第1〜4章は基礎、第5〜10章はコア機能、第11章以降は応用編。\n    A["第1章 LLMとLangChainの基礎"] --> B["第2章 Hello World"]\n    B --> C["第3章 LangChainのモジュール構成"]\n    C --> D["第4章 Models and Prompts"]\n    D --> E["第5章 Chains"]\n    E --> F["第6章 Agents"]\n    F --> G["第7章 OutputParsers and Memory"]\n    G --> H["第8章 Callbacks"]\n    H --> I["第9章 RAGとベクトルDB"]\n    I --> J["第10章 NLPタスクへの応用"]\n    J --> K["第11章 ハルシネーション対策"]\n    K --> L["第12章 LLMの評価"]\n    L --> M["第13章 高度なプロンプト設計"]\n    M --> N["第14章 自律型AIエージェント"]\n    N --> O["第15章 LangSmith and LangServe"]\n    O --> P["第16章 追加機能"]\n    P --> Q["2026年最新動向まとめ"]\n\n    classDef basic fill:#241b3d,stroke:#8f7ae5,color:#ece7fb\n    classDef core fill:#0f2a28,stroke:#35b8a8,color:#d7f5f0\n    classDef advanced fill:#331a17,stroke:#e2735a,color:#ffe1d8\n    class A,B,C,D basic\n    class E,F,G,H,I,J core\n    class K,L,M,N,O,P,Q advanced';

const DIAGRAM_FEATURES =
  'flowchart LR\n    accTitle: LangChainが提供する主な機能\n    accDescr: LLM単体に、Models、Prompts、Chains、Agents、Memory、Retrievalの6機能を組み合わせることで実用的なAIアプリケーションになることを示す図。\n    subgraph Core["LangChainが提供する主な機能"]\n        direction TB\n        M["Models: 複数プロバイダーを共通APIで呼び出す"]\n        P["Prompts: プロンプトのテンプレート化"]\n        Ch["Chains: 複数ステップの処理を連結"]\n        Ag["Agents: ツールを使った自律的な意思決定"]\n        Mem["Memory: 会話履歴の保持"]\n        R["Retrieval: 外部データの検索・RAG"]\n    end\n    LLM["LLM単体"] --> Core --> App["実用的なAIアプリケーション"]';

const DIAGRAM_HELLOFLOW =
  'flowchart LR\n    accTitle: Hello Worldの処理フロー\n    accDescr: 入力テキストを前処理で記号や空白を除去し、PromptTemplateに埋め込んでクラウドAPIまたはローカルLLMを呼び出し、生成結果を得る流れ。\n    A["入力テキスト"] --> B["Text Pre-processing\\n記号/空白除去"]\n    B --> C["PromptTemplate"]\n    C --> D["LLM呼び出し\\nクラウドAPI or ローカルLLM"]\n    D --> E["生成結果"]';

const DIAGRAM_MODULEMAP =
  'flowchart TB\n    accTitle: LangChainのモジュール構成\n    accDescr: 入力層のPromptsから処理層のModels、Chains、Agentsへ順に流れ、支援層のMemory、OutputParsers、CallbacksがChainsを、Indexes / RetrievalがAgentsを補助する構成。\n    subgraph Input["入力層"]\n        Pr["Prompts"]\n    end\n    subgraph Processing["処理層"]\n        Mo["Models"]\n        Ch["Chains"]\n        Ag["Agents"]\n    end\n    subgraph Support["支援層"]\n        Me["Memory"]\n        Op["OutputParsers"]\n        Cb["Callbacks"]\n        Idx["Indexes / Retrieval"]\n    end\n    Pr --> Mo --> Ch --> Ag\n    Me -.-> Ch\n    Op -.-> Ch\n    Cb -.-> Ch\n    Idx -.-> Ag';

const DIAGRAM_LCEL =
  'flowchart LR\n    accTitle: LCELのパイプライン\n    accDescr: PromptTemplateをパイプ演算子でChatModelへ、さらにパイプ演算子でOutputParserへつなぎ、最終結果を得る流れ。\n    P["PromptTemplate"] -->|"パイプ演算子"| M["ChatModel"]\n    M -->|"パイプ演算子"| O["OutputParser"]\n    O --> R["最終結果"]';

const DIAGRAM_AGENTLOOP =
  'flowchart TB\n    accTitle: エージェントの実行ループ\n    accDescr: ユーザーの質問を受けてLLMが思考し、ツールが必要なら検索・計算・DB照会などのツールを実行して再びLLMへ戻る。ツールが不要または十分な情報が揃ったら最終回答を生成する。\n    U["ユーザーの質問"] --> LLM["LLMが思考"]\n    LLM --> D{"ツールが必要か?"}\n    D -->|"必要"| T["ツールを実行\\n検索/計算/DB照会など"]\n    T --> LLM\n    D -->|"不要 / 十分な情報が揃った"| A["最終回答を生成"]';

const DIAGRAM_CALLBACKS =
  "sequenceDiagram\n    accTitle: Callbacksのイベント発火順序\n    accDescr: アプリケーションがChainまたはAgentのinvokeを呼ぶと、ChainがCallbackHandlerへon_chain_start、on_llm_start、ストリーミング時はon_llm_new_token、on_llm_end、on_chain_endの順にイベントを通知し、最後に結果をアプリケーションへ返す。\n    participant App as アプリケーション\n    participant Chain as Chain/Agent\n    participant CB as CallbackHandler\n    App->>Chain: invoke()\n    Chain->>CB: on_chain_start\n    Chain->>CB: on_llm_start\n    Chain->>CB: on_llm_new_token(ストリーミング時)\n    Chain->>CB: on_llm_end\n    Chain->>CB: on_chain_end\n    Chain-->>App: 結果を返す";

const DIAGRAM_RAGPIPE =
  'flowchart LR\n    accTitle: RAGパイプライン\n    accDescr: 事前準備として元ドキュメント群をチャンク分割してEmbedding化しベクトルデータベースへ格納する。質問時は質問をベクトル化して類似度検索で関連チャンクを取得し、質問と検索結果をプロンプトに結合してLLMが最終回答を生成する。\n    Q["ユーザーの質問"] --> Emb["質問をベクトル化\\nEmbedding"]\n    Emb --> VDB[("ベクトルデータベース")]\n    VDB -->|"類似度検索"| Chunks["関連ドキュメントの\\nチャンクを取得"]\n    Chunks --> Prompt["質問 + 検索結果を\\nプロンプトに結合"]\n    Prompt --> LLM["LLMが回答を生成"]\n    LLM --> Ans["最終回答"]\n\n    Docs["元ドキュメント群"] --> Split["チャンク分割"]\n    Split --> Emb2["Embedding化"]\n    Emb2 --> VDB';

const DIAGRAM_HALLU =
  'flowchart TB\n    accTitle: ハルシネーションの発生メカニズム\n    accDescr: LLMは質問に対し確率的に次の単語を予測する。学習データに十分な根拠があれば事実に基づいた回答になり、根拠がなければもっともらしいが誤った内容、つまりハルシネーションを生成する。\n    Q["質問"] --> LLM["LLMが確率的に\\n次の単語を予測"]\n    LLM --> Known{"学習データに\\n十分な根拠があるか?"}\n    Known -->|"Yes"| Correct["事実に基づいた回答"]\n    Known -->|"No"| Guess["もっともらしいが\\n誤った内容を生成\\n=ハルシネーション"]';

const DIAGRAM_REACT =
  'flowchart LR\n    accTitle: ReActの思考サイクル\n    accDescr: Thoughtで何を調べるべきか考え、Actionでツールを実行し、Observationで結果を確認し、再びThoughtで次の行動を考えて次のツール実行または回答確定へ進む。\n    T1["Thought: 何を調べるべきか考える"] --> A1["Action: ツールを実行"]\n    A1 --> O1["Observation: 実行結果を確認"]\n    O1 --> T2["Thought: 次に何をすべきか再度考える"]\n    T2 --> A2["Action: 次のツールを実行 / 回答を確定"]';

const DIAGRAM_AUTONOMOUS =
  'flowchart TB\n    accTitle: 自律型AIエージェントの動作\n    accDescr: 大目標を入力するとLLMがタスクに分解してタスクキューに入れ、1つずつツール呼び出しで実行する。結果を評価して新たなタスクを追加・更新しキューへ戻し、目標達成で完了する。\n    Goal["大目標の入力"] --> Plan["LLMがタスクに分解"]\n    Plan --> Queue["タスクキュー"]\n    Queue --> Exec["1つのタスクを実行\\nツール呼び出し"]\n    Exec --> Eval["結果を評価し\\n新たなタスクを追加/更新"]\n    Eval --> Queue\n    Eval -->|"目標達成"| Done["完了"]';

const DIAGRAM_TIMELINE =
  'flowchart LR\n    accTitle: LangChainの変遷タイムライン\n    accDescr: 2024年の本書刊行当時はLLMChain、initialize_agent、ConversationBufferMemory、LangServeが中心。2025年10月のv1.0でcreate_agentが導入されLangGraphが実行基盤に統合。2026年9月現在は会話履歴をcheckpointer、要約をミドルウェア、長期記憶をStoreで扱い、LangSmithが評価・監視の中核、LangServeはアーカイブされLangSmith Deploymentへ移行。\n    subgraph Y2024["2024年: 本書刊行当時"]\n        A1["LLMChain / initialize_agent"]\n        A2["ConversationBufferMemory"]\n        A3["LangServeでAPI化"]\n    end\n    subgraph Y2025["2025年10月: v1.0リリース"]\n        B1["create_agentがエージェント構築の\\n新しい正面玄関に"]\n        B2["LangGraphがLangChain\\nエージェントの実行基盤に統合"]\n    end\n    subgraph Y2026["2026年9月: 現在"]\n        C1["会話履歴: checkpointer\\n要約: ミドルウェア / 長期記憶: Store"]\n        C2["LangSmithが評価・監視の中核"]\n        C3["LangServeはアーカイブ済み\\n→ LangSmith Deploymentへ移行"]\n    end\n    Y2024 --> Y2025 --> Y2026';

const DIAGRAM_THEME = {
  fontSize: "16px",
  primaryColor: "#16233a",
  primaryTextColor: "#e8edf5",
  primaryBorderColor: "#3b5b8c",
  lineColor: "#4d6485",
  secondaryColor: "#101d2c",
  tertiaryColor: "#0d1826",
  mainBkg: "#101d2c",
  nodeBorder: "#3b5b8c",
  clusterBkg: "#0d1826",
  clusterBorder: "#223447",
  edgeLabelBackground: "#0d1826",
  actorBkg: "#101d2c",
  actorBorder: "#3b5b8c",
  actorTextColor: "#e8edf5",
  actorLineColor: "#4d6485",
  signalColor: "#8fb4ff",
  signalTextColor: "#e8edf5",
  labelBoxBkgColor: "#16233a",
  labelBoxBorderColor: "#3b5b8c",
  labelTextColor: "#e8edf5",
  loopTextColor: "#a9b6c9",
  noteBkgColor: "#2a2013",
  noteTextColor: "#f0c674",
  noteBorderColor: "#b8802a",
  activationBkgColor: "#16233a",
  activationBorderColor: "#3b5b8c",
} as const;

export default function Page() {
  return (
    <div className={styles.layout} data-testid="layout-root" data-page="langchain-in-your-pocket">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/3.44.0/tabler-icons.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
      />
      <TocObserver />
      <aside className={[styles.sidebar].filter(Boolean).join(" ")}>
        <div className={[styles.brand].filter(Boolean).join(" ")}>
          <div className={[styles.mark].filter(Boolean).join(" ")}>
            <i className="ti ti-link"></i>
          </div>
          <div>
            <div className={[styles.name].filter(Boolean).join(" ")}>
              {"LangChain in your Pocket"}
            </div>
            <div className={[styles.sub].filter(Boolean).join(" ")}>{"徹底解説ガイド"}</div>
          </div>
        </div>
        <nav id="nav" data-testid="sidebar-nav">
          <a href="#intro" className={styles.active} data-testid="sidebar-nav-link">
            {"この解説ガイドについて"}
          </a>
          <div className={[styles.grp].filter(Boolean).join(" ")}>{"基礎編"}</div>
          <a href="#ch1" data-testid="sidebar-nav-link">
            {"第1章 LLMとLangChainの基礎"}
          </a>
          <a href="#ch2" data-testid="sidebar-nav-link">
            {"第2章 Hello World"}
          </a>
          <a href="#ch3" data-testid="sidebar-nav-link">
            {"第3章 モジュール構成"}
          </a>
          <a href="#ch4" data-testid="sidebar-nav-link">
            {"第4章 Models and Prompts"}
          </a>
          <div className={[styles.grp].filter(Boolean).join(" ")}>{"コア機能編"}</div>
          <a href="#ch5" data-testid="sidebar-nav-link">
            {"第5章 Chains"}
          </a>
          <a href="#ch6" data-testid="sidebar-nav-link">
            {"第6章 Agents"}
          </a>
          <a href="#ch7" data-testid="sidebar-nav-link">
            {"第7章 OutputParsers and Memory"}
          </a>
          <a href="#ch8" data-testid="sidebar-nav-link">
            {"第8章 Callbacks"}
          </a>
          <a href="#ch9" data-testid="sidebar-nav-link">
            {"第9章 RAGとベクトルDB"}
          </a>
          <a href="#ch10" data-testid="sidebar-nav-link">
            {"第10章 NLPタスク"}
          </a>
          <div className={[styles.grp].filter(Boolean).join(" ")}>{"応用編"}</div>
          <a href="#ch11" data-testid="sidebar-nav-link">
            {"第11章 ハルシネーション対策"}
          </a>
          <a href="#ch12" data-testid="sidebar-nav-link">
            {"第12章 LLMの評価"}
          </a>
          <a href="#ch13" data-testid="sidebar-nav-link">
            {"第13章 高度なプロンプト設計"}
          </a>
          <a href="#ch14" data-testid="sidebar-nav-link">
            {"第14章 自律型AIエージェント"}
          </a>
          <a href="#ch15" data-testid="sidebar-nav-link">
            {"第15章 LangSmith / LangServe"}
          </a>
          <a href="#ch16" data-testid="sidebar-nav-link">
            {"第16章 追加機能"}
          </a>
          <div className={[styles.grp].filter(Boolean).join(" ")}>{"まとめ"}</div>
          <a href="#update2026" data-testid="sidebar-nav-link">
            {"2026年最新動向まとめ"}
          </a>
          <a href="#refs" data-testid="sidebar-nav-link">
            {"参考文献・ソース一覧"}
          </a>
        </nav>
      </aside>
      <main className={[styles.main].filter(Boolean).join(" ")}>
        <div className={[styles.hero].filter(Boolean).join(" ")}>
          <div className={[styles.kicker].filter(Boolean).join(" ")}>
            {"Beginner Guide · 全16章 徹底解説"}
          </div>
          <h1>{"LangChain in your Pocket 徹底解説ガイド"}</h1>
          <div className={[styles.meta].filter(Boolean).join(" ")}>
            {"初学者のためのステップバイステップ学習マニュアル"}
          </div>
          <div className={[styles.meta].filter(Boolean).join(" ")}>
            {"\n            原著:\n            "}
            <em>
              {
                "LangChain in your Pocket: Beginner's Guide to Building Generative AI Applications\n              using LLMs"
              }
            </em>
          </div>
          <div className={[styles.meta].filter(Boolean).join(" ")}>
            {
              "\n            著者: Mehul Gupta / 出版: Packt Publishing（O'Reilly収録, 2024年5月, 152ページ）\n          "
            }
          </div>
          <div className={[styles.meta].filter(Boolean).join(" ")}>
            {"\n            参照元:\n            "}
            <a
              href="https://www.oreilly.com/library/view/langchain-in-your/9781836201250/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"O'Reilly 書籍ページ"}
            </a>
          </div>
        </div>
        <section className={[styles.section].filter(Boolean).join(" ")} id="intro">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Guide"}</span>
            {"この解説ガイドについて"}
          </h2>
          <p>
            {"\n            このガイドは、Mehul Gupta 氏の著書\n            "}
            <em>{"LangChain in your Pocket"}</em>
            {
              "\n            を初学者向けに再構成し、各章の要点をステップバイステップで解説するものです。原著は2024年1月〜5月に刊行されたため、"
            }
            <code>{"LLMChain"}</code>
            {"\n            や "}
            <code>{"ConversationBufferMemory"}</code>
            {" のような LangChain\n            0.1系のAPIを中心に説明しています。\n          "}
          </p>
          <div
            className={[styles.callout, styles.important].filter(Boolean).join(" ")}
            data-testid="callout"
          >
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-alert-triangle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"重要な注意点:"}</strong>
              {" LangChainは2025年10月22日に\n              "}
              <strong>{"LangChain 1.0 / LangGraph 1.0"}</strong>
              {"\n              を同時リリースし、エージェントの実行基盤が根本的に刷新されました（"}
              <a
                href="https://docs.langchain.com/oss/python/langchain-philosophy"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"LangChain公式ドキュメント"}
              </a>
              {"）。本ガイドでは原著の構成・用語をそのまま解説しつつ、各章末に「"}
              <strong>{"2026年9月時点の補足"}</strong>
              {
                "」を設け、現在の推奨アプローチとの違いを明記しています。これにより、書籍の学習効果を損なわずに、実務で通用する最新知識も同時に得られる構成にしています。\n            "
              }
            </div>
          </div>
          <h3>{"本ガイドの読み方（全体マップ）"}</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={DIAGRAM_BOOKMAP}
              id="diagram-bookmap"
              theme="dark"
              themeVariables={DIAGRAM_THEME}
            />
          </div>
          <h3>{"書籍の目次（原著全16章）"}</h3>
          <div className={[styles.bookToc].filter(Boolean).join(" ")}>
            <table>
              <thead>
                <tr>
                  <th>{"章"}</th>
                  <th>{"タイトル"}</th>
                  <th>{"主な内容"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{"1"}</td>
                  <td>{"Introduction"}</td>
                  <td>{"LLMとは何か、LangChainが必要な理由"}</td>
                </tr>
                <tr>
                  <td>{"2"}</td>
                  <td>{"Hello World"}</td>
                  <td>{"セットアップ、Name Generator、Storyteller"}</td>
                </tr>
                <tr>
                  <td>{"3"}</td>
                  <td>{"Different LangChain Modules"}</td>
                  <td>{"LangChainのモジュール全体像"}</td>
                </tr>
                <tr>
                  <td>{"4"}</td>
                  <td>{"Models and Prompts"}</td>
                  <td>{"LLM/ChatModel、PromptTemplate"}</td>
                </tr>
                <tr>
                  <td>{"5"}</td>
                  <td>{"Chains"}</td>
                  <td>{"LLMChain、Auto-SQL、LCEL"}</td>
                </tr>
                <tr>
                  <td>{"6"}</td>
                  <td>{"Agents"}</td>
                  <td>{"Chainとの違い、カスタムツール"}</td>
                </tr>
                <tr>
                  <td>{"7"}</td>
                  <td>{"OutputParsers and Memory"}</td>
                  <td>{"出力整形、会話記憶"}</td>
                </tr>
                <tr>
                  <td>{"8"}</td>
                  <td>{"Callbacks"}</td>
                  <td>{"実行フックの仕組み"}</td>
                </tr>
                <tr>
                  <td>{"9"}</td>
                  <td>{"RAG Framework and Vector Databases"}</td>
                  <td>{"RAGとベクトル検索"}</td>
                </tr>
                <tr>
                  <td>{"10"}</td>
                  <td>{"LangChain for NLP problems"}</td>
                  <td>{"要約・分類・NER・Few-Shot"}</td>
                </tr>
                <tr>
                  <td>{"11"}</td>
                  <td>{"Handling LLM Hallucinations"}</td>
                  <td>{"ハルシネーション対策"}</td>
                </tr>
                <tr>
                  <td>{"12"}</td>
                  <td>{"Evaluating LLMs"}</td>
                  <td>{"評価手法"}</td>
                </tr>
                <tr>
                  <td>{"13"}</td>
                  <td>{"Advanced Prompt Engineering"}</td>
                  <td>{"CoT、ReAct、Tree of Thoughts"}</td>
                </tr>
                <tr>
                  <td>{"14"}</td>
                  <td>{"Autonomous AI agents"}</td>
                  <td>{"AutoGPT、BabyAGI、HuggingGPT"}</td>
                </tr>
                <tr>
                  <td>{"15"}</td>
                  <td>{"LangSmith and LangServe"}</td>
                  <td>{"可観測性とデプロイ"}</td>
                </tr>
                <tr>
                  <td>{"16"}</td>
                  <td>{"Additional Features"}</td>
                  <td>{"Fallback、Safety、デバッグ"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--color-text-tertiary)" }}>
            {"\n            出典:\n            "}
            <a
              href="https://www.oreilly.com/library/view/langchain-in-your/9781836201250/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"O'Reilly収録版 目次"}
            </a>
          </p>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch1">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.1"}</span>
            {"LLMとLangChainの基礎知識"}
          </h2>
          <h3>{"1.1 LLM（大規模言語モデル）とは"}</h3>
          <p>
            {
              "\n            LLM（Large Language\n            Model）は、大量のテキストデータから「次に来る単語」を予測することを学習した深層学習モデルです。原著では、ChatGPTが2022年末に登場して以降、AI業界が劇的に変化したことがLangChain誕生の背景として紹介されています。\n          "
            }
          </p>
          <p>{"LLM単体では以下のような制約があります。"}</p>
          <ul>
            <li>{"学習データの時点までの知識しか持たない（最新情報を知らない）"}</li>
            <li>{"外部ツール（検索、計算機、DB）を自分では呼び出せない"}</li>
            <li>{"長い会話の文脈を保持する仕組みがない"}</li>
            <li>{"出力形式（JSON化など）を厳密に制御しづらい"}</li>
          </ul>
          <h3>{"1.2 LLMのファミリー（主要な系統）"}</h3>
          <table>
            <thead>
              <tr>
                <th>{"ファミリー"}</th>
                <th>{"提供元"}</th>
                <th>{"特徴"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"GPTシリーズ"}</td>
                <td>{"OpenAI"}</td>
                <td>{"汎用性が高く商用利用の主力"}</td>
              </tr>
              <tr>
                <td>{"Claudeシリーズ"}</td>
                <td>{"Anthropic"}</td>
                <td>{"長文コンテキスト、安全性重視"}</td>
              </tr>
              <tr>
                <td>{"Geminiシリーズ"}</td>
                <td>{"Google"}</td>
                <td>{"マルチモーダル対応"}</td>
              </tr>
              <tr>
                <td>{"Llamaシリーズ"}</td>
                <td>{"Meta"}</td>
                <td>{"オープンウェイトモデル"}</td>
              </tr>
              <tr>
                <td>{"Mistral / Mixtral"}</td>
                <td>{"Mistral AI"}</td>
                <td>{"軽量・高効率なオープンモデル"}</td>
              </tr>
            </tbody>
          </table>
          <h3>{"1.3 なぜLangChainが必要なのか"}</h3>
          <p>
            {
              "\n            LangChainは、LLM単体の弱点を補うための「接着剤（グルーコード）」を提供するフレームワークです。具体的には次の機能を統一的なインターフェースで扱えるようにします。\n          "
            }
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={DIAGRAM_FEATURES}
              id="diagram-features"
              theme="dark"
              themeVariables={DIAGRAM_THEME}
            />
          </div>
          <p>
            {
              "\n            LangChainを使うことで、モデルプロバイダーを切り替えたり、ツール呼び出しやRAGを組み込んだりする際に、アプリケーションのコアロジックを書き換える必要がなくなります。\n          "
            }
          </p>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong>
              {
                "\n              この「モデルを差し替え可能にする」という思想は現在も変わっていません。ただし2025年10月のLangChain\n              1.0リリース以降、OSSの LangChain 1.0\n              は"
              }
              <strong>{"エージェントフレームワーク"}</strong>
              {"、LangSmith\n              は"}
              <strong>{"エージェントエンジニアリングプラットフォーム"}</strong>
              {
                "（評価・監視・デプロイ）という役割分担が明確になり、これらを組み合わせた構成が\n              Uber・JPMorgan・LinkedIn・Ciscoなど大企業の本番運用でも採用が進んでいます（"
              }
              <a
                href="https://futureagi.com/blog/what-is-langchain/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"FutureAGI: What is LangChain? 2026"}
              </a>
              {"）。\n            "}
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch2">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.2"}</span>
            {"Hello World ― 環境構築と最初のアプリ"}
          </h2>
          <h3>{"2.1 LangChainのセットアップ"}</h3>
          <p>{"原著のPythonベースの基本セットアップは以下の通りです（書籍刊行時点のAPI）。"}</p>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"# インストール"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"# pip install langchain langchain-openai"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {
                  "# 本ガイドの「原著の書き方」の例（langchain.chains / langchain.agents の initialize_agent・load_tools /"
                }
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {
                  "# langchain.memory / langchain.evaluation）は 1.x では動きません。試す場合は別の仮想環境で 0.3 系を固定します:"
                }
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {
                  '# pip install "langchain>=0.3,<0.4" "langchain-community>=0.3,<0.4" "langchain-openai<1.0"'
                }
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"import os"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {'os.environ["OPENAI_API_KEY"] = "sk-..."'}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_openai import ChatOpenAI"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {'llm = ChatOpenAI(model="gpt-3.5-turbo")'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {'response = llm.invoke("こんにちは、自己紹介してください")'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"print(response.content)"}
              </span>
            </code>
          </pre>
          <h3>{"2.2 Name Generator（最初の実践例）"}</h3>
          <p>
            {
              "\n            原著の最初のハンズオン例は「商品名を生成するアプリ」です。プロンプトテンプレートを使い、入力（商品カテゴリ）に応じた出力を得る流れを学びます。\n          "
            }
          </p>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_core.prompts import PromptTemplate"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"prompt = PromptTemplate.from_template("}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'"{category}のブランドに相応しい名前を3つ提案してください。"'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {")"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"chain = prompt | llm"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {'result = chain.invoke({"category": "オーガニック紅茶"})'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"print(result.content)"}
              </span>
            </code>
          </pre>
          <p>
            {"\n            このコードの "}
            <code>{"|"}</code>
            {"（パイプ）演算子は\n            "}
            <strong>{"LCEL（LangChain Expression Language）"}</strong>
            {
              "\n            と呼ばれる書き方で、「プロンプト→モデル」という処理の流れを直感的に表現します。第5章で詳しく扱います。\n          "
            }
          </p>
          <h3>{"2.3 テキスト前処理／2.4 Storyteller／2.5 ローカルLLM"}</h3>
          <p>
            {
              "\n            原著ではこの後、テキストクリーニング（不要な空白・記号の除去）、物語生成（Storyteller）、そして\n            "
            }
            <code>{"llama.cpp"}</code>
            {" や\n            "}
            <code>{"Ollama"}</code>
            {
              "\n            のようなツールを使ったローカルLLM実行にも触れています。ローカルLLMは、APIコストをかけずに検証したい場合や、機密データを外部に送信できない場合に有効な選択肢です。\n          "
            }
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={DIAGRAM_HELLOFLOW}
              id="diagram-helloflow"
              theme="dark"
              themeVariables={DIAGRAM_THEME}
            />
          </div>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong>
              {
                "\n              ローカルLLM運用は2026年時点でさらに一般化しており、Ollama・LM\n              Studio・vLLMなどのツールがLangChainの\n              "
              }
              <code>{"ChatOllama"}</code>
              {
                "\n              等の統合を通じて簡単に接続できます。またAPIキー管理は、本番では\n              "
              }
              <code>{".env"}</code>
              {
                " ファイルではなく、AWS Secrets Manager や Google Secret Manager\n              などの外部シークレットマネージャーを使うのが実務上の標準になっています。LangSmith\n              Deployment\n              にデプロイする場合は、デプロイ設定のシークレット（環境変数）として登録します。\n            "
              }
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch3">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.3"}</span>
            {"LangChainのモジュール構成"}
          </h2>
          <p>
            {
              "\n            原著は第3章で、LangChainを構成する主要モジュールの全体像を提示します。各モジュールは独立して使うことも、組み合わせて使うこともできます。\n          "
            }
          </p>
          <table>
            <thead>
              <tr>
                <th>{"モジュール"}</th>
                <th>{"役割"}</th>
                <th>{"詳しく学ぶ章"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"Models"}</td>
                <td>{"LLM/ChatModelの呼び出し"}</td>
                <td>{"第4章"}</td>
              </tr>
              <tr>
                <td>{"Prompts"}</td>
                <td>{"プロンプトのテンプレート管理"}</td>
                <td>{"第4章"}</td>
              </tr>
              <tr>
                <td>{"Chains"}</td>
                <td>{"複数処理の連結"}</td>
                <td>{"第5章"}</td>
              </tr>
              <tr>
                <td>{"Agents"}</td>
                <td>{"ツールを使う自律的な意思決定"}</td>
                <td>{"第6章"}</td>
              </tr>
              <tr>
                <td>{"OutputParsers"}</td>
                <td>{"出力の構造化"}</td>
                <td>{"第7章"}</td>
              </tr>
              <tr>
                <td>{"Memory"}</td>
                <td>{"会話履歴の保持"}</td>
                <td>{"第7章"}</td>
              </tr>
              <tr>
                <td>{"Callbacks"}</td>
                <td>{"実行中のイベントフック"}</td>
                <td>{"第8章"}</td>
              </tr>
              <tr>
                <td>{"Indexes（Retrieval）"}</td>
                <td>{"外部ドキュメントの検索"}</td>
                <td>{"第9章"}</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={DIAGRAM_MODULEMAP}
              id="diagram-modulemap"
              theme="dark"
              themeVariables={DIAGRAM_THEME}
            />
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch4">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.4"}</span>
            {"Models and Prompts"}
          </h2>
          <h3>{"4.1 Models: LLM と ChatModel の違い"}</h3>
          <p>{"原著は2種類のモデルインターフェースを区別しています。"}</p>
          <ul>
            <li>
              <strong>{"LLM:"}</strong>
              {" 文字列を入力し、文字列を返すシンプルなインターフェース（例:\n              "}
              <code>{"text-davinci-003"}</code>
              {" のような補完型モデル）\n            "}
            </li>
            <li>
              <strong>{"ChatModel:"}</strong>
              {
                "\n              メッセージのリスト（system/human/aiロール）を入出力とする、対話向けのインターフェース（例:\n              "
              }
              <code>{"gpt-3.5-turbo"}</code>
              {", "}
              <code>{"gpt-4"}</code>
              {"）\n            "}
            </li>
          </ul>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_core.messages import HumanMessage, SystemMessage"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_openai import ChatOpenAI"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {'chat = ChatOpenAI(model="gpt-4o-mini")'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"messages = ["}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'SystemMessage(content="あなたは丁寧な日本語アシスタントです。"),'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'HumanMessage(content="LangChainのChatModelとLLMの違いを教えてください。"),'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"]"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"response = chat.invoke(messages)"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"print(response.content)"}
              </span>
            </code>
          </pre>
          <p>
            {
              "\n            補完型（純粋なLLM）モデルは現在ではほとんど提供が終了しており、実務ではChatModelインターフェースを使うのが標準です。\n          "
            }
          </p>
          <h3>{"4.2 Prompts: PromptTemplate と ChatPromptTemplate"}</h3>
          <p>
            <code>{"PromptTemplate"}</code>
            {" は単一の文字列プロンプトに変数を埋め込む仕組み、"}
            <code>{"ChatPromptTemplate"}</code>
            {"\n            はロールごとにメッセージを組み立てる仕組みです。\n          "}
          </p>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_core.prompts import ChatPromptTemplate"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"template = ChatPromptTemplate.from_messages(["}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'("system", "あなたは{domain}の専門家です。"),'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'("human", "{question}"),'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"])"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {
                  'formatted = template.invoke({"domain": "栄養学", "question": "タンパク質摂取の目安は？"})'
                }
              </span>
            </code>
          </pre>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong> <code>{"PromptTemplate"}</code>
              {" /\n              "}
              <code>{"ChatPromptTemplate"}</code>
              {" のAPI自体は現在も現役で、"}
              <code>{"langchain-core"}</code>
              {
                "\n              パッケージの安定した基盤機能として維持されています。ただし大規模なプロンプト管理は現在、LangSmithの「Prompt\n              Hub」でバージョン管理・A/Bテストを行うのが一般的です。\n            "
              }
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch5">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.5"}</span>
            {"Chains（チェーン）"}
          </h2>
          <h3>{"5.1〜5.4 LLMChain・Auto-SQL Chain・MathsChain・DALL-E連携"}</h3>
          <p>
            {"\n            原著では\n            "}
            <code>{"LLMChain"}</code>
            {
              "\n            を軸に、プロンプトとモデルを1つの処理単位として結合する方法を学びます。さらに応用例として、自然言語をSQLに変換する"
            }
            <strong>{"Auto-SQL Chain"}</strong>
            {"、数式を解く"}
            <strong>{"MathsChain"}</strong>
            {"、画像生成モデルと連携する"}
            <strong>{"DALL-E Chain"}</strong>
            {"が紹介されます。\n          "}
          </p>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"# 原著の書き方（LLMChain、2024年当時の標準）"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain.chains import LLMChain"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"chain = LLMChain(llm=llm, prompt=prompt)"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {'result = chain.run(category="スポーツウェア")'}
              </span>
            </code>
          </pre>
          <h3>{"5.5 Custom Chains using LCEL"}</h3>
          <p>
            {"\n            原著は本章の後半で"}
            <strong>{"LCEL（LangChain Expression Language）"}</strong>
            {"を紹介し、"}
            <code>{"|"}</code>
            {
              "\n            演算子でRunnableを連結する新しい書き方を提示しています。これは書籍刊行当時から「今後推奨される書き方」として案内されていました。\n          "
            }
          </p>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"# LCELによる書き方"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_core.output_parsers import StrOutputParser"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"output_parser = StrOutputParser()"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"chain = prompt | llm | output_parser"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {'result = chain.invoke({"category": "スポーツウェア"})'}
              </span>
            </code>
          </pre>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={DIAGRAM_LCEL}
              id="diagram-lcel"
              theme="dark"
              themeVariables={DIAGRAM_THEME}
            />
          </div>
          <h3>{"5.6 Types of Chains"}</h3>
          <p>
            {"\n            原著は\n            "}
            <code>{"SimpleSequentialChain"}</code>
            {"（単一入出力を順に繋ぐ）、"}
            <code>{"SequentialChain"}</code>
            {"（複数の入出力変数を扱う）などのチェーン種別を紹介しています。\n          "}
          </p>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong> <code>{"LLMChain"}</code>
              {" は"}
              <strong>
                {"LangChain 0.1.17で非推奨化され、1.0では本体の "}
                <code>{"langchain"}</code>
                {" パッケージから\n                "}
                <code>{"langchain-classic"}</code>
                {"\n                パッケージへ移され、そこで非推奨のまま残されて"}
              </strong>
              {"います。現在は本章で紹介されている\n              "}
              <code>{"prompt | llm"}</code>
              {" というLCELの書き方がそのまま標準です（"}
              <a
                href="https://www.aurelio.ai/learn/langchain-lcel"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"Aurelio AI: LangChain Expression Language解説"}
              </a>
              {"）。また "}
              <code>{"SimpleSequentialChain"}</code>
              {" 等の旧式チェーンクラスも\n              "}
              <code>{"langchain_classic"}</code>
              {
                "\n              パッケージに後方互換性維持のためだけに残されている状態で、新規開発では非推奨とされています（"
              }
              <a
                href="https://reference.langchain.com/python/langchain-classic/langchain_classic"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"LangChain Reference: langchain_classic"}
              </a>
              {
                "）。つまり、原著の5.5節で「これから使うべき書き方」として紹介されたLCELが、2026年現在ではまさに主流になっています。\n            "
              }
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch6">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.6"}</span>
            {"Agents（エージェント）"}
          </h2>
          <h3>{"6.1 AgentとChainの違い"}</h3>
          <p>
            {"\n            Chainは「あらかじめ決められた処理の順序」を実行するのに対し、"}
            <strong>
              {"Agent（エージェント）はLLM自身が次にどのツールを使うかを都度判断する"}
            </strong>
            {"点が根本的に異なります。\n          "}
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={DIAGRAM_AGENTLOOP}
              id="diagram-agentloop"
              theme="dark"
              themeVariables={DIAGRAM_THEME}
            />
          </div>
          <h3>{"6.2〜6.3 Agentの構築とタイプ"}</h3>
          <p>
            {"\n            原著は "}
            <code>{"initialize_agent"}</code>
            {" 関数と、"}
            <code>{"ZERO_SHOT_REACT_DESCRIPTION"}</code>
            {
              "\n            などのエージェントタイプ（推論戦略）を使ったエージェント構築を解説しています。\n          "
            }
          </p>
          <p>
            <code>{"serpapi"}</code>
            {
              " ツールを動かすには、事前に SerpAPI 用パッケージの導入と API\n            キーの設定が必要です（キーはコードに直書きせず環境変数で渡します）。\n          "
            }
          </p>
          <pre data-testid="code-block">
            <code className="language-bash">
              <span className={styles.codeLine} data-testid="code-line">
                {"pip install google-search-results"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {'export SERPAPI_API_KEY="your-serpapi-key"'}
              </span>
            </code>
          </pre>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"# 原著の書き方（2024年当時のAgent API）"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain.agents import initialize_agent, AgentType, load_tools"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {'tools = load_tools(["serpapi", "llm-math"], llm=llm)'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"agent = initialize_agent("}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {"tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {")"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {'agent.run("2024年のノーベル物理学賞受賞者の年齢を2倍した数値は？")'}
              </span>
            </code>
          </pre>
          <h3>{"6.4 Custom Tools for Agents"}</h3>
          <p>
            {
              "\n            エージェントに独自のツール（社内APIやデータベース照会関数など）を追加する方法も紹介されており、"
            }
            <code>{"@tool"}</code>
            {
              "\n            デコレータを使ってPython関数をエージェントが呼び出せるツールに変換します。\n          "
            }
          </p>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_core.tools import tool"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"@tool"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"def get_shipping_status(order_id: str) -> str:"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'"""注文IDから配送状況を取得する"""'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'return f"注文 {order_id} は配送中です。"'}
              </span>
            </code>
          </pre>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong> <code>{"initialize_agent"}</code>
              {" と\n              "}
              <code>{"AgentExecutor"}</code>
              {" は\n              "}
              <code>{"create_agent"}</code>
              {
                "\n              を推奨とする形で非推奨（deprecated）になっています。なお「2026年12月」はこれらAPIの移行期限ではなく、LangChain\n              0.3 系のメンテナンスサポート終了時期です。非推奨APIはLangChain 1.x でも\n              "
              }
              <code>{"langchain-classic"}</code>
              {" パッケージ経由で引き続き動作しますが、新規コードでは\n              "}
              <code>{"create_agent"}</code>
              {
                "\n              を使うのが推奨です。内部的にはLangGraphのランタイム上でエージェントループが動作しており、開発者は高レベルAPI（"
              }
              <code>{"create_agent"}</code>
              {"）のまま使うことも、必要に応じてLangGraphの\n              "}
              <code>{"StateGraph"}</code>
              {" まで降りて細かく制御することもできます（"}
              <a
                href="https://uvik.net/blog/langchain-vs-langgraph/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"uvik.net: LangChain vs LangGraph 2026年版ガイド"}
              </a>
              {"）。\n            "}
            </div>
          </div>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"# 2026年時点の推奨される書き方"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain.agents import create_agent"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"agent = create_agent("}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'model="openai:gpt-5",'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {"tools=[get_shipping_status],"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'system_prompt="あなたはECサイトのカスタマーサポート担当です。",'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {")"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {
                  'result = agent.invoke({"messages": [{"role": "user", "content": "注文12345の状況は？"}]})'
                }
              </span>
            </code>
          </pre>
          <p style={{ fontSize: "13.5px", color: "var(--color-text-tertiary)" }}>
            {"\n            出典:\n            "}
            <a
              href="https://www.educative.io/courses/langchain-llm/what-is-create-agent"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"Educative: What Is create_agent?"}
            </a>
          </p>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch7">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.7"}</span>
            {"OutputParsers and Memory"}
          </h2>
          <h3>{"7.1 OutputParsers（出力パーサー）"}</h3>
          <p>
            {"\n            LLMの出力はデフォルトでは自由形式のテキストです。"}
            <code>{"OutputParser"}</code>
            {
              "\n            はこれを構造化データ（リスト、JSON、独自クラス）に変換する仕組みです。\n          "
            }
          </p>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_core.output_parsers import CommaSeparatedListOutputParser"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"parser = CommaSeparatedListOutputParser()"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"# LLMに「カンマ区切りで答えて」と指示するプロンプトと組み合わせて使う"}
              </span>
            </code>
          </pre>
          <p>
            {"\n            原著では、パース失敗時にLLM自身に修正させる"}
            <strong>{"Magic Output Fixer"}</strong>
            {"（"}
            <code>{"OutputFixingParser"}</code>
            {
              "\n            に相当）というテクニックも紹介されています。これは「出力が期待した形式でない場合、その旨をLLMに伝えて再生成させる」仕組みです。\n          "
            }
          </p>
          <h3>{"7.2 Memory（会話記憶）"}</h3>
          <p>
            <code>{"ConversationBufferMemory"}</code>
            {" はすべての会話履歴をそのまま保持し、"}
            <code>{"ConversationSummaryMemory"}</code>
            {"\n            は履歴が長くなるとLLMを使って要約する仕組みです。\n          "}
          </p>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"# 原著の書き方（2024年当時のMemory API）"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain.memory import ConversationBufferMemory"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"memory = ConversationBufferMemory()"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {
                  'memory.save_context({"input": "こんにちは"}, {"output": "こんにちは、ご用件は？"})'
                }
              </span>
            </code>
          </pre>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong>
              <code>{"ConversationBufferMemory"}</code>
              {"\n              を含む旧来のインプロセスMemoryクラス群は、"}
              <strong>{"LangChain 1.0で非推奨"}</strong>
              {"となりました。現在の本番運用では、"}
              <strong>{"スレッド単位の短期的な会話履歴"}</strong>
              {"については、LangGraphの"}
              <strong>{"チェックポインター（checkpointer）"}</strong>
              {
                "が会話状態を永続化する仕組みに置き換わっています。ただしチェックポインターは\n              "
              }
              <code>{"ConversationSummaryMemory"}</code>
              {
                "\n              のような履歴の要約や、スレッドをまたいで共有する長期記憶までは代替しません。要約はミドルウェア（Summarization\n              等）、長期記憶は LangGraph の Store など、別の仕組みで扱う必要があります（"
              }
              <a
                href="https://atlan.com/know/ai-agent/ai-agent-memory/what-is-langchain/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"Atlan: What is LangChain? 2026"}
              </a>
              {"）。構造化出力についても、現在は "}
              <code>{"create_agent"}</code>
              {" の\n              "}
              <code>{"response_format"}</code>
              {
                "\n              パラメータでPydanticモデルを直接指定する方法が主流になりつつあります。\n            "
              }
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch8">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.8"}</span>
            {"Callbacks"}
          </h2>
          <p>
            {
              "\n            Callbacksは、チェーンやエージェントの実行中に発生するイベント（開始・終了・トークン生成・エラーなど）をフックして処理を差し込む仕組みです。\n          "
            }
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={DIAGRAM_CALLBACKS}
              id="diagram-callbacks"
              theme="dark"
              themeVariables={DIAGRAM_THEME}
            />
          </div>
          <p>
            {"\n            原著では\n            "}
            <code>{"StdOutputCallbackHandler"}</code>
            {"（標準出力にログを流す）、"}
            <code>{"FileCallbackHandler"}</code>
            {"（ファイルにログを保存する）、そして独自のロジックを実装する"}
            <strong>{"Custom Callbacks"}</strong>
            {
              "が紹介されています。ログ収集、コスト計測、リアルタイムのトークンストリーミング表示など、実務上のデバッグ・監視用途で重要な機能です。\n          "
            }
          </p>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong>
              {
                "\n              Callbacksの仕組み自体は現在も健在ですが、本番環境でのトレース・監視は自作のCallbackHandlerよりも"
              }
              <strong>{"LangSmith"}</strong>
              {
                "のトレーシング機能を使うのが標準的です。LangSmithはトレースの入出力表示のカスタマイズやベースライン比較機能などが2026年に入ってから拡充されています（"
              }
              <a
                href="https://blog.langchain.com/febraury-2026-langchain-newsletter"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"LangChain 2026年2月ニュースレター"}
              </a>
              {"）。\n            "}
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch9">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.9"}</span>
            {"RAGフレームワークとベクトルデータベース"}
          </h2>
          <p>{"本章は原著の中でも特に実務価値の高いパートです。"}</p>
          <h3>{"9.1 RAGとは何か"}</h3>
          <p>
            {
              "\n            RAG（Retrieval-Augmented\n            Generation、検索拡張生成）とは、LLMが回答を生成する前に、外部データソースから関連情報を検索し、その情報をプロンプトに含めることで、最新情報や社内固有情報に基づいた回答を可能にする手法です。\n          "
            }
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={DIAGRAM_RAGPIPE}
              id="diagram-ragpipe"
              theme="dark"
              themeVariables={DIAGRAM_THEME}
            />
          </div>
          <h3>{"9.2〜9.3 RAGの構成要素とLangChainでの実装"}</h3>
          <p>{"RAGパイプラインは主に4つの要素で構成されます。"}</p>
          <table>
            <thead>
              <tr>
                <th>{"構成要素"}</th>
                <th>{"役割"}</th>
                <th>{"原著で扱われるクラス例"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"Document Loader"}</td>
                <td>{"元データ（PDF, Webページ, DB等）を読み込む"}</td>
                <td>
                  <code>{"PyPDFLoader"}</code>
                  {", "}
                  <code>{"WebBaseLoader"}</code>
                </td>
              </tr>
              <tr>
                <td>{"Text Splitter"}</td>
                <td>{"長い文書を検索しやすい単位に分割"}</td>
                <td>
                  <code>{"RecursiveCharacterTextSplitter"}</code>
                </td>
              </tr>
              <tr>
                <td>{"Embeddings"}</td>
                <td>{"テキストをベクトルに変換"}</td>
                <td>
                  <code>{"OpenAIEmbeddings"}</code>
                </td>
              </tr>
              <tr>
                <td>{"Vector Store"}</td>
                <td>{"ベクトルを保存し類似度検索する"}</td>
                <td>
                  <code>{"Chroma"}</code>
                  {", "}
                  <code>{"FAISS"}</code>
                  {", "}
                  <code>{"Pinecone"}</code>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            {"\n            以下のコードを新しい環境で動かすには、"}
            <code>{"langchain_community"}</code>
            {" と\n            "}
            <code>{"langchain_chroma"}</code>
            {" を提供するパッケージを事前に導入します（"}
            <code>{"WebBaseLoader"}</code>
            {"\n            は内部で "}
            <code>{"beautifulsoup4"}</code>
            {" を使用します）。\n          "}
          </p>
          <pre data-testid="code-block">
            <code className="language-bash">
              <span className={styles.codeLine} data-testid="code-line">
                {"pip install langchain-community langchain-chroma beautifulsoup4"}
              </span>
            </code>
          </pre>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_community.document_loaders import WebBaseLoader"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_text_splitters import RecursiveCharacterTextSplitter"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_openai import OpenAIEmbeddings"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_chroma import Chroma"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {'loader = WebBaseLoader("https://example.com/docs")'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"docs = loader.load()"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"chunks = splitter.split_documents(docs)"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"vectorstore = Chroma.from_documents(chunks, OpenAIEmbeddings())"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"retriever = vectorstore.as_retriever()"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"# RAG用プロンプト（context と question を受け取る）"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_core.prompts import ChatPromptTemplate"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"rag_prompt = ChatPromptTemplate.from_template("}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {
                  '"次の文脈だけを使って質問に答えてください。\\n\\n文脈:\\n{context}\\n\\n質問: {question}"'
                }
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {")"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"# RAGチェーン（LCEL）"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {'# 入力は {"question": "..."} 形式。retriever には質問文字列だけを渡し、'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"# 取得した Document の page_content を連結して context にする。"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from operator import itemgetter"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"def format_docs(docs):"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'return "\\n\\n".join(doc.page_content for doc in docs)'}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"rag_chain = ("}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {"{"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"        "}
                {'"context": itemgetter("question") | retriever | format_docs,'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"        "}
                {'"question": itemgetter("question"),'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {"}"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {"| rag_prompt"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {"| llm"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {")"}
              </span>
            </code>
          </pre>
          <h3>{"9.4〜9.5 Multi-document RAGとレコメンドシステム"}</h3>
          <p>
            {
              "\n            原著は複数文書にまたがる検索（Multi-document\n            RAG）と、RAGの応用としてのレコメンドシステム構築にも触れています。複数ドキュメントを扱う際は、メタデータフィルタリング（例:\n            部署別、日付別）を組み合わせることで検索精度を高めるのが実務上のポイントです。\n          "
            }
          </p>
          <h3>{"9.6 ベクトルデータベースの選び方"}</h3>
          <p>
            {
              "\n            原著執筆時点（2024年）ではPinecone・FAISS・Chromaなどが主に紹介されていましたが、2026年現在のベクトルDBの選択肢は以下のように整理できます。\n          "
            }
          </p>
          <table>
            <thead>
              <tr>
                <th>{"データベース"}</th>
                <th>{"得意分野"}</th>
                <th>{"ホスティング"}</th>
                <th>{"2026年の位置づけ"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"Pinecone"}</td>
                <td>{"運用負荷ゼロの本番RAG"}</td>
                <td>{"フルマネージド"}</td>
                <td>{"サーバーレス化で運用簡易性No.1"}</td>
              </tr>
              <tr>
                <td>{"Qdrant"}</td>
                <td>{"高性能なセルフホスト"}</td>
                <td>{"セルフホスト / クラウド"}</td>
                <td>{"コストパフォーマンスに優れる"}</td>
              </tr>
              <tr>
                <td>{"Weaviate"}</td>
                <td>{"ハイブリッド検索（BM25+ベクトル）"}</td>
                <td>{"両対応"}</td>
                <td>{"マルチモーダル検索に強い"}</td>
              </tr>
              <tr>
                <td>{"Chroma"}</td>
                <td>{"ローカル開発・プロトタイピング"}</td>
                <td>{"組込み / セルフホスト"}</td>
                <td>{"学習・検証用途で依然人気"}</td>
              </tr>
              <tr>
                <td>{"pgvector"}</td>
                <td>{"既存のPostgreSQL活用"}</td>
                <td>{"セルフホスト（拡張機能）"}</td>
                <td>{"追加インフラ不要で運用がシンプル"}</td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: "13.5px", color: "var(--color-text-tertiary)" }}>
            {"\n            出典:\n            "}
            <a
              href="https://www.braintrust.dev/articles/best-vector-databases-for-rag-2026"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"Braintrust: Best Vector Databases for RAG 2026"}
            </a>
            {",\n            "}
            <a
              href="https://dupple.com/learn/best-vector-databases"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"Dupple: Best Vector Databases 2026"}
            </a>
          </p>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong>
              {
                "\n              2026年時点では「ベクトル検索単体」ではなく、BM25のようなキーワード検索とベクトル検索を組み合わせた"
              }
              <strong>{"ハイブリッド検索"}</strong>
              {
                "が本番RAGの標準的な構成になっています。また、ベクトル検索機能がPostgreSQL・MongoDB\n              Atlas・主要クラウドのマネージドDBに標準搭載されるようになり、「専用ベクトルDBを新規導入するかどうか」自体が設計判断のポイントになっています（"
              }
              <a
                href="https://solguruz.com/generative-ai/vector-database/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"Solguruz: Vector Database解説"}
              </a>
              {"）。\n            "}
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch10">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.10"}</span>
            {"LangChainを使ったNLPタスク"}
          </h2>
          <p>
            {
              "\n            原著は本章で、LangChainを従来型のNLP（自然言語処理）タスクに応用する方法を紹介しています。\n          "
            }
          </p>
          <table>
            <thead>
              <tr>
                <th>{"タスク"}</th>
                <th>{"説明"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"10.1 Summarization"}</td>
                <td>
                  {"長文の要約（"}
                  <code>{"load_summarize_chain"}</code>
                  {" 等）"}
                </td>
              </tr>
              <tr>
                <td>{"10.2 Text Tagging / Classification"}</td>
                <td>{"テキストへのラベル付け・分類"}</td>
              </tr>
              <tr>
                <td>{"10.3 Named Entity Recognition (NER)"}</td>
                <td>{"固有表現抽出（人名・地名・組織名など）"}</td>
              </tr>
              <tr>
                <td>{"10.4 Text Embeddings"}</td>
                <td>{"テキストの意味的ベクトル表現"}</td>
              </tr>
              <tr>
                <td>{"10.5 Few-Shot Classification"}</td>
                <td>{"少数の例示から分類させる手法"}</td>
              </tr>
              <tr>
                <td>{"10.6 POS Tagging, Segmentation"}</td>
                <td>{"品詞タグ付け・文分割"}</td>
              </tr>
            </tbody>
          </table>
          <h3>{"Few-Shot Learningの考え方"}</h3>
          <p>
            {
              "\n            Few-Shot\n            Learningとは、モデルを再学習させることなく、プロンプト内にいくつかの「入力と正解のペア（例示）」を含めることで、望ましい出力形式や分類基準をLLMに理解させる手法です。\n          "
            }
          </p>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain_core.prompts import FewShotPromptTemplate, PromptTemplate"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"examples = ["}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'{"text": "このカレーは辛すぎる", "label": "ネガティブ"},'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'{"text": "サービスがとても丁寧だった", "label": "ポジティブ"},'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"]"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {'example_prompt = PromptTemplate.from_template("入力: {text}\\n分類: {label}")'}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"few_shot_prompt = FewShotPromptTemplate("}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {"examples=examples,"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {"example_prompt=example_prompt,"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'suffix="入力: {input}\\n分類:",'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'input_variables=["input"],'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {")"}
              </span>
            </code>
          </pre>
          <p>
            <strong>{"Example Selection"}</strong>
            {
              "（原著10.5.3節）は、大量の例示候補の中から、入力に最も類似した例だけを動的に選んで使う手法で、ベクトル類似度検索（第9章のRAGと同じ仕組み）を応用します。\n          "
            }
          </p>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong>
              {
                "\n              従来のNLPタスク（分類・NER・要約）は、2026年現在では汎用LLM（GPT-5, Claude Sonnet\n              4.5等）に直接プロンプトで指示するだけで、専用モデルの訓練なしに高精度な結果が得られるケースが大半です。ただし超高速・低コストが求められる大量バッチ処理では、依然として軽量な専用モデル（spaCy等）とLLMを併用する設計が採られています。\n            "
              }
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch11">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.11"}</span>
            {"LLMのハルシネーション対策"}
          </h2>
          <h3>{"11.1〜11.2 ハルシネーションとは、なぜ起きるのか"}</h3>
          <p>
            {
              "\n            ハルシネーション（Hallucination）とは、LLMが事実に基づかない内容を、あたかも真実であるかのように生成してしまう現象です。原著では、LLMが確率的に「もっともらしい単語列」を生成する仕組み上、学習データにない情報や、曖昧な質問に対して誤った内容を「自信満々に」出力してしまうことが原因として説明されています。\n          "
            }
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={DIAGRAM_HALLU}
              id="diagram-hallu"
              theme="dark"
              themeVariables={DIAGRAM_THEME}
            />
          </div>
          <h3>{"11.3〜11.4 LLMCheckerChainとLLMSummarizationChain"}</h3>
          <p>
            {"\n            原著は、LLM自身に自分の回答の妥当性をチェックさせる\n            "}
            <code>{"LLMCheckerChain"}</code>
            {" や、要約結果の正確性を検証する\n            "}
            <code>{"LLMSummarizationChain"}</code>
            {
              "\n            を対策として紹介しています。これは「LLMにLLMの出力を検証させる」というセルフチェック方式です。\n          "
            }
          </p>
          <h3>{"11.5 RAGによるハルシネーション回避"}</h3>
          <p>
            {
              "\n            最も効果的な対策として原著が強調しているのが、第9章で学んだRAGです。回答の根拠となる情報を検索結果としてプロンプトに含めることで、LLMが「知らないことを作り話しする」リスクを大幅に減らせます。\n          "
            }
          </p>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong>
              {
                "\n              ハルシネーション対策は2026年でも生成AI活用の中心課題であり続けています。RAGに加えて、"
              }
              <strong>{"出典の引用（Citation）を強制する仕組み"}</strong>
              {"、"}
              <strong>{"複数モデルによるクロスチェック"}</strong>
              {
                "、そして評価パイプライン（第12章）を使った継続的なハルシネーション率のモニタリングが標準的な実務プラクティスとして定着しています。\n            "
              }
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch12">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.12"}</span>
            {"LLMの評価（Evaluating LLMs）"}
          </h2>
          <p>
            {
              "\n            原著は、LLMを使ったアプリケーションの品質を定量的に測るための評価手法を紹介しています。\n          "
            }
          </p>
          <table>
            <thead>
              <tr>
                <th>{"評価手法"}</th>
                <th>{"説明"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"12.1 String Evaluators"}</td>
                <td>{"出力文字列を基準に評価（正解と完全一致するか等）"}</td>
              </tr>
              <tr>
                <td>{"12.1.1 Criteria Evaluators"}</td>
                <td>{"「簡潔さ」「正確性」等の基準でLLM自身に採点させる"}</td>
              </tr>
              <tr>
                <td>{"12.1.2 Custom Evaluators"}</td>
                <td>{"独自の評価ロジックを実装"}</td>
              </tr>
              <tr>
                <td>{"12.2 Comparison Evaluators"}</td>
                <td>{"2つの出力のどちらが優れているかを比較評価"}</td>
              </tr>
              <tr>
                <td>{"12.3 Trajectory Evaluators"}</td>
                <td>{"エージェントの意思決定プロセス全体（ツール呼び出しの順序等）を評価"}</td>
              </tr>
            </tbody>
          </table>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"# 原著の書き方（Criteria Evaluatorの例）"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from langchain.evaluation import load_evaluator"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {'evaluator = load_evaluator("criteria", criteria="conciseness")'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"eval_result = evaluator.evaluate_strings("}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'prediction="LangChainはLLMアプリ開発用のフレームワークです。",'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"    "}
                {'input="LangChainとは何ですか？",'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {")"}
              </span>
            </code>
          </pre>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong>
              {
                "\n              評価（Evaluation）はLangChainエコシステムの中でも特に進化が著しい領域です。現在は"
              }
              <strong>{"LangSmith上のEvaluation/Experiments機能"}</strong>
              {
                "を使い、データセットに対してチェーンやエージェントをバッチ実行し、複数の評価指標（正確性・レイテンシ・コストなど）を継続的にトラッキングするのが標準です。2026年2月のアップデートでは、実験結果を「ベースラインとしてピン留めし、以降の変更との差分を自動比較する」機能が追加されており、CI/CDパイプラインに評価を組み込む動きが加速しています（"
              }
              <a
                href="https://blog.langchain.com/febraury-2026-langchain-newsletter"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"LangChain 2026年2月ニュースレター"}
              </a>
              {"）。\n            "}
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch13">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.13"}</span>
            {"高度なプロンプトエンジニアリング"}
          </h2>
          <h3>{"13.1 Chain of Thought（思考の連鎖）"}</h3>
          <p>
            <strong>{"Chain of Thought（CoT）"}</strong>
            {
              "は、LLMに最終的な答えだけでなく、そこに至る推論過程を段階的に出力させることで、複雑な問題への回答精度を高める手法です。\n          "
            }
          </p>
          <ul>
            <li>
              <strong>{"13.1.1 Think Step by Step:"}</strong>
              {
                "\n              プロンプトに「ステップバイステップで考えてください」という指示を加えるだけの手軽な手法（Zero-shot\n              CoT）\n            "
              }
            </li>
            <li>
              <strong>{"13.1.2 Few-Shot Prompting:"}</strong>
              {
                "\n              推論過程を含む例示をいくつか与えることで、より安定した推論パターンをLLMに学習させる手法\n            "
              }
            </li>
          </ul>
          <h3>{"13.2 ReAct（Reasoning + Acting）"}</h3>
          <p>
            <strong>{"ReAct"}</strong>
            {
              "は「推論（Reasoning）」と「行動（Acting）」を交互に繰り返すことで、LLMがツールを使いながら段階的に問題を解決していく手法です。第6章のAgentの内部動作の理論的基盤にもなっています。\n          "
            }
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={DIAGRAM_REACT}
              id="diagram-react"
              theme="dark"
              themeVariables={DIAGRAM_THEME}
            />
          </div>
          <h3>{"13.3 Tree of Thoughts（思考の木）"}</h3>
          <p>
            <strong>{"Tree of Thoughts（ToT）"}</strong>
            {
              "は、CoTが一本道の推論であるのに対し、複数の推論経路を並行して探索し、有望な経路を評価・選択しながら最終解に到達する、より高度な推論戦略です。\n          "
            }
          </p>
          <h3>{"13.4 その他のプロンプトエンジニアリング手法"}</h3>
          <p>
            {
              "\n            原著はこのほか、Self-Consistency（複数回生成し多数決を取る）などの手法にも触れています。\n          "
            }
          </p>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong>
              {
                "\n              CoT・ReAct・ToTはいずれも2026年時点でも有効な基礎テクニックですが、GPT-5やClaude\n              Sonnet系のような「推論（reasoning）」に最適化されたモデルでは、モデル自体が内部的に段階的思考を行うため、明示的な「ステップバイステップで考えて」という指示なしでも高い推論性能を発揮するようになっています。とはいえ、エージェントの意思決定プロセスを人間が検証・デバッグしやすくするという観点で、ReAct的な「思考の可視化」は現在も実務上重要な設計パターンです。\n            "
              }
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch14">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.14"}</span>
            {"自律型AIエージェント（Autonomous AI agents）"}
          </h2>
          <h3>{"14.1 AGIとは"}</h3>
          <p>
            {
              "\n            原著は本章の導入として、AGI（Artificial General\n            Intelligence、汎用人工知能）という概念と、2023年頃に話題となった「完全自律型エージェント」の実験プロジェクト群を紹介しています。\n          "
            }
          </p>
          <h3>{"14.2〜14.4 AutoGPT・BabyAGI・HuggingGPT"}</h3>
          <table>
            <thead>
              <tr>
                <th>{"プロジェクト"}</th>
                <th>{"コンセプト"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"AutoGPT"}</td>
                <td>
                  {
                    "\n                  与えられた大目標を、LLM自身がサブタスクに分解し、ツール（Web検索・ファイル操作等）を使って自律的に達成を目指す\n                "
                  }
                </td>
              </tr>
              <tr>
                <td>{"BabyAGI"}</td>
                <td>
                  {
                    "\n                  タスクリストを動的に生成・優先順位付け・実行するループ構造で、シンプルな自律エージェントの実装例として知られる\n                "
                  }
                </td>
              </tr>
              <tr>
                <td>{"HuggingGPT"}</td>
                <td>
                  {
                    "\n                  LLMを「司令塔」とし、Hugging\n                  Face上の多数の専門特化モデル（画像認識、音声認識等）をタスクに応じて呼び分ける仕組み\n                "
                  }
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={DIAGRAM_AUTONOMOUS}
              id="diagram-autonomous"
              theme="dark"
              themeVariables={DIAGRAM_THEME}
            />
          </div>
          <p>
            {
              "\n            これらのプロジェクトは2023年当時、完全自律型AIの可能性を示す一方で、「無限ループに陥る」「コストが予測不能に膨らむ」といった実務上の課題も広く指摘されました。\n          "
            }
          </p>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong>
              {
                "\n              AutoGPT・BabyAGIのような「完全放任型」の自律エージェントは実務での採用が限定的だった一方、その設計思想は2026年の"
              }
              <strong>{"LangGraph"}</strong>
              {
                "による「制御可能な自律性」へと発展的に継承されています。LangGraphでは、エージェントのループ構造をグラフとして明示的に定義し、人間による承認ステップ（Human-in-the-loop）や実行予算の上限設定（"
              }
              <code>{"langchain-runcycles"}</code>
              {
                "\n              のようなミドルウェアによるツール呼び出し回数の制御等）を組み込めるため、「暴走しない自律エージェント」の実現が進んでいます。また、常時バックグラウンドでイベントを監視し続ける「アンビエントエージェント（Ambient\n              Agents）」という新しい概念も、LangChain CEO Harrison\n              Chase氏によって提唱されています（"
              }
              <a href="https://sequoiacap.com/?p=17611" target="_blank" rel="noopener noreferrer">
                {"Sequoia Capital: Harrison Chase インタビュー"}
              </a>
              {"）。\n            "}
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch15">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.15"}</span>
            {"LangSmith and LangServe"}
          </h2>
          <h3>{"15.1 LangSmith"}</h3>
          <p>
            <strong>{"LangSmith"}</strong>
            {
              "は、LangChainアプリケーションの実行トレース収集、デバッグ、評価（第12章参照）を行うための観測プラットフォームです。原著刊行時点でも「本番運用に耐えるアプリケーションを作るための必須ツール」として紹介されています。\n          "
            }
          </p>
          <h3>{"15.2 LangServe"}</h3>
          <p>
            <strong>{"LangServe"}</strong>
            {
              "は、LangChainのRunnable（Chain/Agent）をFastAPIベースのREST\n            APIとして即座に公開するためのライブラリです。原著では "
            }
            <code>{"/invoke"}</code>
            {",\n            "}
            <code>{"/batch"}</code>
            {",\n            "}
            <code>{"/stream"}</code>
            {" といった標準エンドポイントが自動生成される点が紹介されています。\n          "}
          </p>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"# 原著の書き方（LangServeによるデプロイ例）"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from fastapi import FastAPI"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"from langserve import add_routes"}
              </span>
              <span className={styles.codeLine} data-testid="code-line"></span>
              <span className={styles.codeLine} data-testid="code-line">
                {"app = FastAPI()"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {'add_routes(app, rag_chain, path="/rag")'}
              </span>
            </code>
          </pre>
          <div
            className={[styles.callout, styles.important].filter(Boolean).join(" ")}
            data-testid="callout"
          >
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-alert-triangle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足（重要）:"}</strong>
              <strong>
                {
                  "LangServeは2024年11月18日付で正式に非推奨（deprecated）となり、2026年5月5日にGitHubリポジトリがアーカイブされました。"
                }
              </strong>
              {"公式には新規プロジェクトでの利用は推奨されておらず、後継として"}
              <strong>{"LangSmith Deployment"}</strong>
              {"（旧 LangGraph Platform）への移行が案内されています（"}
              <a
                href="https://github.com/langchain-ai/langserve"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"LangServe公式GitHubの非推奨表示"}
              </a>
              {
                "）。実務コミュニティの評価では、LangServeは「最初の2〜4週間は非常に便利だが、要件が複雑化する3ヶ月目あたりから抽象化の限界が露呈しやすい」という指摘もありました（"
              }
              <a
                href="https://enterprisedna.co/resources/blog/practitioner-langserve-review"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"Enterprise DNA: LangServeの実運用レビュー"}
              </a>
              {
                "）。一方LangSmithは現役かつ主力製品として継続的に機能強化されており、2025年10月23日にInsights\n              Agent（定期レポートの自動生成）が発表され、2025年10月29日にAgent\n              Builder（会話からエージェントを直接生成する機能）が公開されました。Agent Builder\n              は2026年3月以降、"
              }
              <strong>{"LangSmith Fleet"}</strong>
              {" に名称変更されています（"}
              <a
                href="https://www.langchain.com/blog/introducing-langsmith-fleet"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"LangChain公式ブログ: Introducing LangSmith Fleet"}
              </a>
              {"）。\n            "}
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="ch16">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Ch.16"}</span>
            {"追加機能（Additional Features）"}
          </h2>
          <h3>{"16.1 Fallbacks（フォールバック）"}</h3>
          <p>
            <strong>{"Fallback"}</strong>
            {
              "は、あるモデルやチェーンの呼び出しが失敗（レート制限、タイムアウト、エラー等）した際に、代替のモデルやロジックへ自動的に切り替える仕組みです。原著ではLLM単体に対するFallbackと、Chain全体に対するFallbackの両方が紹介されています。\n          "
            }
          </p>
          <pre data-testid="code-block">
            <code className="language-python">
              <span className={styles.codeLine} data-testid="code-line">
                {"# 原著の書き方（Fallbackの概念例）"}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {'primary_llm = ChatOpenAI(model="gpt-4o")'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {'backup_llm = ChatOpenAI(model="gpt-4o-mini")'}
              </span>
              <span className={styles.codeLine} data-testid="code-line">
                {"robust_llm = primary_llm.with_fallbacks([backup_llm])"}
              </span>
            </code>
          </pre>
          <h3>{"16.2 Safety（安全性）"}</h3>
          <p>
            <code>{"OpenAIModerationChain"}</code>
            {"（有害コンテンツの検出）や\n            "}
            <code>{"ConstitutionalChain"}</code>
            {
              "（あらかじめ定義した倫理原則に沿うよう出力を修正する仕組み）が、安全性確保のための機能として紹介されています。\n          "
            }
          </p>
          <h3>{"16.3〜16.4 Model LaboratoryとDebugging"}</h3>
          <p>
            <code>{"ModelLaboratory"}</code>
            {" は複数モデルの出力を並べて比較する実験用ツール、そして\n            "}
            <code>{"verbose=True"}</code>
            {
              "\n            の設定やデバッグモードは、チェーン・エージェントの内部動作を可視化するための基本的な手段として紹介されています。\n          "
            }
          </p>
          <div className={[styles.callout].filter(Boolean).join(" ")} data-testid="callout">
            <div className={[styles.ic].filter(Boolean).join(" ")}>
              <i className="ti ti-info-circle"></i>
            </div>
            <div className={[styles.body].filter(Boolean).join(" ")}>
              <strong>{"2026年9月時点の補足:"}</strong>
              {"\n              Fallback機能は2026年現在も現役の重要パターンであり、"}
              <code>{"create_agent"}</code>
              {
                "\n              のミドルウェアシステムを通じてより柔軟に設定できるようになっています。Safety機能についても、単一のModerationChainだけでなく、入力・出力の両方を多層的にガードレール（Guardrails）でチェックする設計が業界標準になりつつあります。デバッグに関しては、"
              }
              <code>{"verbose=True"}</code>
              {
                "\n              のようなテキストログよりも、LangSmithのトレースビューでツール呼び出し・トークン使用量・レイテンシを可視的に追う方法が主流です。\n            "
              }
            </div>
          </div>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="update2026">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"2026"}</span>
            {"2026年9月時点の最新動向まとめ"}
          </h2>
          <p>
            {"\n            本書は2024年前半の執筆であり、LangChainは2025年10月22日の"}
            <strong>{"v1.0 / LangGraph v1.0 同時リリース"}</strong>
            {
              "を境に大きく進化しました。本書で学んだ概念を実務に活かす際は、以下の対応関係を押さえておくと役立ちます。\n          "
            }
          </p>
          <table>
            <thead>
              <tr>
                <th>{"本書（2024年）のAPI・概念"}</th>
                <th>{"2026年9月時点の現行アプローチ"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>{"LLMChain"}</code>
                </td>
                <td>
                  <code>{"prompt | llm"}</code>
                  {
                    "（LCEL）。ツール呼び出しの実行ループを伴うエージェント動作が必要な場合のみ\n                  "
                  }
                  <code>{"create_agent"}</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>{"initialize_agent"}</code>
                  {" / "}
                  <code>{"AgentExecutor"}</code>
                </td>
                <td>
                  <code>{"langchain.agents.create_agent"}</code>
                  {"（LangGraphランタイム上で動作）"}
                </td>
              </tr>
              <tr>
                <td>
                  <code>{"ConversationBufferMemory"}</code>
                  {" 等の旧Memoryクラス"}
                </td>
                <td>
                  {
                    "\n                  用途別に置き換え：スレッド単位の会話履歴はLangGraphの checkpointer\n                  で永続化、履歴の要約はSummarizationミドルウェア、スレッドをまたぐ長期記憶はLangGraph\n                  Store\n                "
                  }
                </td>
              </tr>
              <tr>
                <td>
                  <code>{"SimpleSequentialChain"}</code>
                  {" 等の旧チェーン群"}
                </td>
                <td>
                  <code>{"langchain_classic"}</code>
                  {" に後方互換として残存、新規開発では非推奨"}
                </td>
              </tr>
              <tr>
                <td>{"LangServeでのAPI化"}</td>
                <td>
                  {
                    "\n                  LangSmith Deployment（旧 LangGraph\n                  Platform）への移行が公式推奨（LangServeは2026年5月にアーカイブ）\n                "
                  }
                </td>
              </tr>
              <tr>
                <td>
                  {"手動での "}
                  <code>{"verbose=True"}</code>
                  {" デバッグ"}
                </td>
                <td>{"LangSmithのトレーシング・評価（Evaluation/Experiments）機能"}</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={DIAGRAM_TIMELINE}
              id="diagram-timeline"
              theme="dark"
              themeVariables={DIAGRAM_THEME}
            />
          </div>
          <p>
            {
              "\n            この移行の背景については、LangChain公式の設計思想の変遷が\n            "
            }
            <a
              href="https://docs.langchain.com/oss/python/langchain-philosophy"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"langchain-philosophy ドキュメント"}
            </a>
            {
              "で詳しく解説されています。要点は「LangChainは高レベルの使いやすいインターフェースを提供し、より細かい制御が必要になった開発者はLangGraphに降りていける」という二層構造の考え方です。またLangChain\n            0.3系は2026年12月まで"
            }
            <strong>{"メンテナンスモード（セキュリティパッチと重大な不具合修正）"}</strong>
            {
              "として継続サポートされる予定であり、旧APIから急いで移行する必要はないものの、新規プロジェクトでは1.0系の採用が推奨されています（"
            }
            <a
              href="https://docs.langchain.com/oss/python/release-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"LangChain公式: リリースポリシー"}
            </a>
            {"）。\n          "}
          </p>
        </section>
        <section className={[styles.section].filter(Boolean).join(" ")} id="refs">
          <h2>
            <span className={[styles.num].filter(Boolean).join(" ")}>{"Refs"}</span>
            {"参考文献・ソース一覧"}
          </h2>
          <p>
            {
              "\n            本ガイドの作成にあたり、以下の情報源を参照しました。書籍の詳細情報は公式・著者本人の投稿を、2026年時点の技術動向は国際的に著名な開発者・企業の一次情報を優先して参照しています。\n          "
            }
          </p>
          <div className={[styles.refList].filter(Boolean).join(" ")}>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"1"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"O'Reilly（Packt Publishing収録）書籍ページ「LangChain in your Pocket」"}
                </span>
                <a
                  href="https://www.oreilly.com/library/view/langchain-in-your/9781836201250/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://www.oreilly.com/library/view/langchain-in-your/9781836201250/"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"2"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"著者 Mehul Gupta 氏によるDEV Community投稿（書籍出版のアナウンス）"}
                </span>
                <a
                  href="https://dev.to/mehulgupta7991/my-debut-book-langchain-in-your-pocket-is-out--7oc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {
                    "https://dev.to/mehulgupta7991/my-debut-book-langchain-in-your-pocket-is-out--7oc"
                  }
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"3"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"Amazon書籍ページ（目次・Key Features）"}
                </span>
                <a
                  href="https://www.amazon.com/LangChain-your-Pocket-Generative-Applications-ebook/dp/B0CTHQHT25"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {
                    "https://www.amazon.com/LangChain-your-Pocket-Generative-Applications-ebook/dp/B0CTHQHT25"
                  }
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"4"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {
                    "LangChain公式ドキュメント「LangChain\n                  philosophy」（LangGraphへの統合の経緯）"
                  }
                </span>
                <a
                  href="https://docs.langchain.com/oss/python/langchain-philosophy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://docs.langchain.com/oss/python/langchain-philosophy"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"5"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"LangChain公式ドキュメント「Release policy」（LTSとバージョン方針）"}
                </span>
                <a
                  href="https://docs.langchain.com/oss/python/release-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://docs.langchain.com/oss/python/release-policy"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"6"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"LangChain Reference「langchain_classic」（非推奨モジュール一覧）"}
                </span>
                <a
                  href="https://reference.langchain.com/python/langchain-classic/langchain_classic"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://reference.langchain.com/python/langchain-classic/langchain_classic"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"7"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"Aurelio AI「LangChain Expression Language (LCEL)」解説"}
                </span>
                <a
                  href="https://www.aurelio.ai/learn/langchain-lcel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://www.aurelio.ai/learn/langchain-lcel"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"8"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"uvik.net「LangChain vs LangGraph: A Senior Engineer's 2026 Decision Guide」"}
                </span>
                <a
                  href="https://uvik.net/blog/langchain-vs-langgraph/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://uvik.net/blog/langchain-vs-langgraph/"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"9"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"Educative「What Is create_agent?」"}
                </span>
                <a
                  href="https://www.educative.io/courses/langchain-llm/what-is-create-agent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://www.educative.io/courses/langchain-llm/what-is-create-agent"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"10"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"Atlan「What is LangChain? Open-Source AI Framework Explained (2026)」"}
                </span>
                <a
                  href="https://atlan.com/know/ai-agent/ai-agent-memory/what-is-langchain/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://atlan.com/know/ai-agent/ai-agent-memory/what-is-langchain/"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"11"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"FutureAGI「What is LangChain? A 2026 Production Engineer's Guide」"}
                </span>
                <a
                  href="https://futureagi.com/blog/what-is-langchain/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://futureagi.com/blog/what-is-langchain/"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"12"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"LangServe 公式GitHubリポジトリ（非推奨・アーカイブ表示）"}
                </span>
                <a
                  href="https://github.com/langchain-ai/langserve"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://github.com/langchain-ai/langserve"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"13"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"Enterprise DNA「LangServe: What Engineers Actually Found」実運用レビュー"}
                </span>
                <a
                  href="https://enterprisedna.co/resources/blog/practitioner-langserve-review"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://enterprisedna.co/resources/blog/practitioner-langserve-review"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"14"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {
                    "LangChain公式ブログ「2026年2月ニュースレター」（LangSmith新機能、Interrupt\n                  2026）"
                  }
                </span>
                <a
                  href="https://blog.langchain.com/febraury-2026-langchain-newsletter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://blog.langchain.com/febraury-2026-langchain-newsletter"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"15"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {
                    "Sequoia Capital「LangChain's Harrison Chase on Building the Orchestration Layer\n                  for AI Agents」"
                  }
                </span>
                <a href="https://sequoiacap.com/?p=17611" target="_blank" rel="noopener noreferrer">
                  {"https://sequoiacap.com/?p=17611"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"16"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"Braintrust「Best Vector Databases for RAG in 2026」"}
                </span>
                <a
                  href="https://www.braintrust.dev/articles/best-vector-databases-for-rag-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://www.braintrust.dev/articles/best-vector-databases-for-rag-2026"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"17"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"Dupple「Best Vector Databases in 2026: 8 Options Tested for RAG and Scale」"}
                </span>
                <a
                  href="https://dupple.com/learn/best-vector-databases"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://dupple.com/learn/best-vector-databases"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"18"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"Solguruz「Vector Database解説（2026年時点の市場動向）」"}
                </span>
                <a
                  href="https://solguruz.com/generative-ai/vector-database/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://solguruz.com/generative-ai/vector-database/"}
                </a>
              </div>
            </div>
            <div className={[styles.refCard].filter(Boolean).join(" ")}>
              <div className={[styles.badge].filter(Boolean).join(" ")}>{"19"}</div>
              <div className={[styles.txt].filter(Boolean).join(" ")}>
                <span className={[styles.t].filter(Boolean).join(" ")}>
                  {"LangChain公式ブログ「Introducing LangSmith Fleet」"}
                </span>
                <a
                  href="https://www.langchain.com/blog/introducing-langsmith-fleet"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://www.langchain.com/blog/introducing-langsmith-fleet"}
                </a>
              </div>
            </div>
          </div>
        </section>
        <footer>
          {
            "\n          本ガイドはPackt\n          Publishing刊行の書籍を要約・解説する二次的な学習資料であり、原著の全文を転載するものではありません。より詳細な内容やコード全文は、上記O'Reilly/Packtの公式書籍でご確認ください。\n        "
          }
        </footer>
      </main>
    </div>
  );
}
