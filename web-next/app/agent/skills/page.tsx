import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Agent Skills 完全ガイド ― 初学者のためのステップバイステップ解説",
  description:
    "Agent Skillsの仕組みと使い方を、Kaggle Whitepaperとagentskills.io、Anthropic公式ドキュメントをもとに初学者向けにステップバイステップで解説するガイドです。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_0 = `flowchart TD
    root["skill-name フォルダ"] --> skillmd["SKILL.md 必須 メタデータと指示文"]
    root --> scripts["scripts フォルダ 任意 実行可能なコード"]
    root --> references["references フォルダ 任意 詳細ドキュメント"]
    root --> assets["assets フォルダ 任意 テンプレートや素材"]`;

const DIAGRAM_1 = `flowchart LR
    discovery["Discovery 起動時に name と description だけを読み込む"] --> activation["Activation タスクに一致したら SKILL.md 本文を全て読み込む"]
    activation --> execution["Execution 指示に従いスクリプト実行や参照ファイルの読み込みを行う"]`;

const DIAGRAM_2 = `flowchart TD
    skillmd["SKILL.md 本文の指示"] --> decide{"追加の情報や処理が必要か"}
    decide -->|コードを実行したい| scripts["scripts フォルダ 自己完結した実行可能コード"]
    decide -->|詳しい資料を読みたい| references["references フォルダ 詳細ドキュメントを必要な時だけ読む"]
    decide -->|テンプレートを使いたい| assets["assets フォルダ 雛形や画像やデータファイル"]`;

const DIAGRAM_3 = `flowchart TD
    agent["Agent 本体 LLM"] --> systemprompt["System prompt 基本姿勢や性格"]
    agent --> agentsmd["AGENTS.md 常時読み込まれるプロジェクト規約"]
    agent --> mcp["MCP Server 外部システムに接続する手段"]
    agent --> skills["Agent Skills 特定作業の手順書 必要な時だけ読み込む"]
    agent --> rag["RAG 検索による知識参照"]`;

const DIAGRAM_4 = `flowchart TD
    read["Read-Only 照会や説明のみ"] --> draft["Draft-Only 人間レビュー前提の下書き作成"]
    draft --> act["Action-Allowed 取り消せない操作の実行"]`;

export default function Page() {
  return (
    <div className={styles.pageContainer}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css"
      />
      <TocObserver />
      <div className={styles.layout}>
        <button
          type="button"
          id="navToggle"
          className={styles.mobileNavToggle}
          aria-label="目次を開く"
        >
          <i className="ti ti-menu-2" />
        </button>
        <aside id="sidebar" className={styles.sidebar}>
          <div className={styles.sidebarBrand}>
            <i className="ti ti-puzzle" />
            <span>Agent Skills 完全ガイド</span>
          </div>
          <ul className={styles.sidebarNav}>
            <li>
              <a href="#ch1" className={styles.tocLink}>
                <span className={styles.navNum}>1</span>
                <span>Agent Skillsとは何か</span>
              </a>
            </li>
            <li>
              <a href="#ch2" className={styles.tocLink}>
                <span className={styles.navNum}>2</span>
                <span>なぜAgent Skillsが必要なのか（4つの課題）</span>
              </a>
            </li>
            <li>
              <a href="#ch3" className={styles.tocLink}>
                <span className={styles.navNum}>3</span>
                <span>仕組み：Progressive Disclosure（段階的開示）</span>
              </a>
            </li>
            <li>
              <a href="#ch4" className={styles.tocLink}>
                <span className={styles.navNum}>4</span>
                <span>SKILL.mdファイルの構造</span>
              </a>
            </li>
            <li>
              <a href="#ch5" className={styles.tocLink}>
                <span className={styles.navNum}>5</span>
                <span>フォルダ構成：scripts references assets</span>
              </a>
            </li>
            <li>
              <a href="#ch6" className={styles.tocLink}>
                <span className={styles.navNum}>6</span>
                <span>ステップバイステップ：最初のSkillを作る</span>
              </a>
            </li>
            <li>
              <a href="#ch7" className={styles.tocLink}>
                <span className={styles.navNum}>7</span>
                <span>どこで使えるか（対応プラットフォーム）</span>
              </a>
            </li>
            <li>
              <a href="#ch8" className={styles.tocLink}>
                <span className={styles.navNum}>8</span>
                <span>良いdescriptionの書き方</span>
              </a>
            </li>
            <li>
              <a href="#ch9" className={styles.tocLink}>
                <span className={styles.navNum}>9</span>
                <span>Skills vs MCP vs AGENTS.md</span>
              </a>
            </li>
            <li>
              <a href="#ch10" className={styles.tocLink}>
                <span className={styles.navNum}>10</span>
                <span>セキュリティに関する注意点</span>
              </a>
            </li>
            <li>
              <a href="#ch11" className={styles.tocLink}>
                <span className={styles.navNum}>11</span>
                <span>評価とベストプラクティス</span>
              </a>
            </li>
            <li>
              <a href="#ch12" className={styles.tocLink}>
                <span className={styles.navNum}>12</span>
                <span>実践ハンズオン：commitメッセージ生成Skillを作る</span>
              </a>
            </li>
            <li>
              <a href="#ch13" className={styles.tocLink}>
                <span className={styles.navNum}>13</span>
                <span>トラブルシューティング</span>
              </a>
            </li>
            <li>
              <a href="#ch14" className={styles.tocLink}>
                <span className={styles.navNum}>14</span>
                <span>まとめ：5つの黄金律と次のステップ</span>
              </a>
            </li>
            <li>
              <a href="#ch15" className={styles.tocLink}>
                <span className={styles.navNum}>15</span>
                <span>参考文献一覧</span>
              </a>
            </li>
          </ul>
        </aside>

        <main className={styles.main}>
          <div className={styles.content}>
            <header className={styles.docHeader}>
              <span className={styles.docEyebrow}>
                <i className="ti ti-sparkles" />
                初学者向けステップバイステップ解説
              </span>
              <h1 className={styles.docTitle}>
                Agent Skills 完全ガイド ― 初学者のためのステップバイステップ解説
              </h1>
              <div className={styles.docIntro}>
                <p>
                  このガイドは
                  <Ext href="https://www.kaggle.com/whitepaper-agent-skills">
                    Kaggle Agent Skills Whitepaper
                  </Ext>
                  （Google/Kaggle、2026年5月公開、著者: Tanvi Singhal, Gabriela Hernandez Larios,
                  Debanshu Das, Lavi Nigam, Smitha Kolam）、オープン仕様サイト
                  <Ext href="https://agentskills.io/home">agentskills.io</Ext>
                  、および Anthropic
                  公式ドキュメントを主な情報源として、初学者向けにステップバイステップでまとめたものです。各章末に出典URLを明記しています。
                </p>
              </div>
            </header>

            <section className={styles.chapter} id="ch1">
              <h2>1. Agent Skillsとは何か</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>
                  この章では、Agent
                  Skillsという仕組みが何なのかを一言で説明します。この章を理解しておくと、後の章の説明がすべて頭に入りやすくなります。
                </p>
              </div>
              <p>
                Agent
                Skills（エージェントスキル）とは、AIエージェント（＝自律的にタスクをこなすAIプログラム）に新しい能力や専門知識を与えるための、軽量でオープンな共通フォーマット（＝どのAIツールでも読み込める標準規格）です。
              </p>
              <p>
                一言でまとめると、
                <strong>Skillとは「SKILL.mdというファイルを1つ持つフォルダ」</strong>
                のことです。このファイルには、最低限「名前（name）」と「説明（description）」というメタデータ（＝データについてのデータ、ここでは「このSkillが何をするか」を表す情報）と、AIエージェントへの指示文（＝手順書の本文）が書かれています。加えて、スクリプト（実行可能なコード）や参考資料、テンプレートなどのファイルを一緒に束ねる（バンドルする）こともできます。
              </p>
              <p>
                以下の図は、Skillフォルダの基本構成を表しています。上から下へ読み進めてください。
              </p>

              <div className={styles.mermaidWrapper}>
                <div className={styles.mermaidDiagram}>
                  <MermaidDiagram chart={DIAGRAM_0} />
                </div>
              </div>

              <p>各ノードの意味：</p>
              <ul>
                <li>
                  「skill-name
                  フォルダ」：Skill全体を表すディレクトリ。フォルダ名がSkillの識別名（name）と一致している必要があります。
                </li>
                <li>
                  「SKILL.md」：唯一の必須ファイル。YAMLフロントマター（＝ファイル冒頭の
                  <code>---</code>で囲まれたメタデータ領域）とMarkdown本文で構成されます。
                </li>
                <li>
                  「scripts / references /
                  assets」：いずれも任意（オプション）。エージェントは必要になったときだけこれらを読み込みます。
                </li>
              </ul>
              <p>
                Agent Skillsという発想は、もともとAnthropicが Claude
                Code（Anthropicのコーディング支援エージェント）向けに開発したものでした。その後2025年12月18日に、Anthropicはこの仕様を
                <strong>オープンスタンダード（誰でも自由に採用できる公開規格）</strong>
                として公開し、agentskills.io
                で仕様書と参考実装を公開しました。現在ではClaude以外にも、OpenAI Codex、Gemini
                CLI、GitHub
                Copilot、Cursorなど、26以上のプラットフォームがこの標準を採用しています。
              </p>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>
                    AIエージェント：人間の指示を受けて、自律的に計画を立てタスクを実行するAIプログラムのこと
                  </li>
                  <li>
                    メタデータ：データそのものではなく「データの性質」を説明する付随情報のこと（例：ファイルの作成日時、著者名など）
                  </li>
                  <li>
                    オープンスタンダード：特定の企業に縛られず、誰でも自由に実装・利用できる公開された技術規格のこと
                  </li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://agentskills.io/home">
                      Agent Skills Overview - agentskills.io
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://www.kaggle.com/whitepaper-agent-skills">
                      Kaggle Agent Skills Whitepaper
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://github.com/agentskills/agentskills">
                      GitHub - agentskills/agentskills
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://www.agensi.io/learn/agent-skills-open-standard">
                      SKILL.md: The Open Standard for AI Agent Skills - agensi.io
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch2">
              <h2>2. なぜAgent Skillsが必要なのか（4つの課題）</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>
                  この章では、Agent
                  Skillsが解決しようとしている4つの技術的な課題を説明します。ここを理解すると、単なる「便利機能」ではなく「必然的に生まれた設計」であることが分かります。
                </p>
              </div>
              <p>
                Kaggle Agent Skills Whitepaperでは、Agent
                Skillsが広く使われるようになった背景として、次の4つの課題（フリクション・ポイント）を挙げています。
              </p>

              <table>
                <thead>
                  <tr>
                    <th>課題</th>
                    <th>内容</th>
                    <th>Skillsによる解決策</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>① コンテキストの劣化（Context rot）</td>
                    <td>
                      すべての指示を1つの巨大なシステムプロンプトに詰め込むと、入力が長くなるほどLLM（大規模言語モデル）の応答精度が下がっていく現象
                    </td>
                    <td>指示は「必要になったときだけ」読み込む</td>
                  </tr>
                  <tr>
                    <td>② 手続き記憶（Procedural memory）の欠如</td>
                    <td>
                      LLMは事実（何が起きたか、何を知っているか）は扱えても「どうやってやるか」という手順知識が弱い
                    </td>
                    <td>Skillsは「経験者から渡される作業マニュアル」として手続き記憶を補う</td>
                  </tr>
                  <tr>
                    <td>③ マルチエージェントの複雑化</td>
                    <td>
                      タスクごとに専用のサブエージェントを大量に用意すると、運用・保守コストが膨らむ
                    </td>
                    <td>1つの汎用エージェント＋必要に応じて呼び出すSkillライブラリに置き換える</td>
                  </tr>
                  <tr>
                    <td>④ 移植性の低さ</td>
                    <td>
                      ツールごとに独自のカスタマイズ方式（例：<code>.cursorrules</code>
                      など）があり、乗り換えると資産が引き継げない
                    </td>
                    <td>ファイルシステムさえあればどこでも動く共通フォーマット</td>
                  </tr>
                </tbody>
              </table>

              <p>
                ①のコンテキストの劣化については、入力が長くなるとモデルの精度が落ちるという現象が、&quot;Lost
                in the Middle&quot;（Liu et al., 2024）や&quot;Context Rot&quot;（Chroma,
                2025）といった研究で報告されています。Skillsは指示を必要な時だけ読み込むことで、この問題を回避します。
              </p>
              <p>
                ②の手続き記憶について、LLMが扱う「記憶」は次の3種類に分類して考えると理解しやすくなります。
              </p>

              <table>
                <thead>
                  <tr>
                    <th>記憶の種類</th>
                    <th>人間にたとえると</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>エピソード記憶（Episodic）</td>
                    <td>「今日の会話で何が起きたか」を覚えていること</td>
                  </tr>
                  <tr>
                    <td>意味記憶（Semantic）</td>
                    <td>モデルの重みやRAG（検索拡張生成）に蓄積された事実知識</td>
                  </tr>
                  <tr>
                    <td>手続き記憶（Procedural）</td>
                    <td>「どうやってこのタスクを実行するか」という手順の知識</td>
                  </tr>
                </tbody>
              </table>

              <p>
                Agent
                Skillsは、この3つ目の「手続き記憶」をエージェントに与えるための最初の実用的な仕組みだと位置づけられています。新人社員に渡す業務マニュアルのように、「何を知っているか」ではなく「どうやるか」を教えてくれる点が特徴です。
              </p>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>
                    LLM：Large Language
                    Modelの略。大量のテキストで学習された、文章を生成するAIモデルのこと
                  </li>
                  <li>
                    RAG：Retrieval-Augmented
                    Generationの略。外部の文書を検索して、その内容をもとに回答を生成する仕組みのこと
                  </li>
                  <li>
                    サブエージェント：特定の役割に特化させた、AIエージェントの分身のようなもの
                  </li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://explainx.ai/blog/kaggle-agent-skills-whitepaper-guide-2026">
                      Kaggle Agent Skills Whitepaper: Complete Guide 2026 - explainx.ai
                    </Ext>
                    （Kaggle Agent Skills Whitepaperの内容を要約・解説した二次情報源）
                  </li>
                  <li>
                    <Ext href="https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills">
                      Equipping agents for the real world with Agent Skills - Anthropic Engineering
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch3">
              <h2>3. 仕組み：Progressive Disclosure（段階的開示）</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>
                  この章では、Agent
                  SkillsがなぜコンテキストウィンドウやAI応答速度を圧迫しないのかという、中核の仕組みを説明します。
                </p>
              </div>
              <p>
                Agent Skillsの心臓部にあたる設計思想が
                <strong>Progressive Disclosure（段階的開示）</strong>
                です。これは、エージェントが情報を「必要になったタイミングで、必要な分だけ」読み込んでいく仕組みのことです。
              </p>
              <p>
                この図は、Skillが読み込まれていく3つの段階の流れを表しています。左から右へ読み進めてください。
              </p>

              <div className={styles.mermaidWrapper}>
                <div className={styles.mermaidDiagram}>
                  <MermaidDiagram chart={DIAGRAM_1} />
                </div>
              </div>

              <p>各ノードの意味：</p>
              <ul>
                <li>
                  「Discovery（発見）」：エージェントがセッションを開始した時点で、利用可能な全Skillの
                  <code>name</code>と<code>description</code>
                  だけをシステムプロンプトに読み込みます。本文はまだ読み込みません。
                </li>
                <li>
                  「Activation（起動）」：ユーザーの依頼内容がいずれかのSkillの
                  <code>description</code>と一致すると判断されたとき、そのSkillの
                  <code>SKILL.md</code>
                  本文全体をコンテキストウィンドウ（＝AIが一度に処理できる情報の範囲）に読み込みます。
                </li>
                <li>
                  「Execution（実行）」：エージェントは読み込んだ指示に従って、必要ならバンドルされたスクリプトを実行したり、参照ファイルを追加で読み込んだりします。
                </li>
              </ul>
              <p>
                この3段階には、それぞれ読み込まれるタイミングとトークンコスト（＝AIが処理する文章量のコスト）の目安があります。
              </p>

              <table>
                <thead>
                  <tr>
                    <th>レベル</th>
                    <th>読み込まれるタイミング</th>
                    <th>トークンコストの目安</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>レベル1：メタデータ</td>
                    <td>常時（起動時）</td>
                    <td>1Skillあたり約100トークン</td>
                    <td>
                      YAMLフロントマターの<code>name</code>と<code>description</code>
                    </td>
                  </tr>
                  <tr>
                    <td>レベル2：指示</td>
                    <td>Skillが起動された時</td>
                    <td>5000トークン未満が推奨</td>
                    <td>SKILL.md本文の指示とガイダンス</td>
                  </tr>
                  <tr>
                    <td>レベル3以上：リソース</td>
                    <td>必要な時だけ</td>
                    <td>実質無制限</td>
                    <td>
                      <code>scripts/</code> <code>references/</code> <code>assets/</code>
                      内のファイル
                    </td>
                  </tr>
                </tbody>
              </table>

              <p>
                この仕組みのおかげで、50個のSkillをすべて1つの巨大なプロンプトとして詰め込んだ場合には約15,000トークンかかるところを、段階的開示を使うと「常時読み込むメタデータ約4,000トークン＋実際に起動した1つの本文約2,000トークン」程度、合計6,000トークン前後に抑えられるという試算が紹介されています（残り49個の本文はディスク上に置かれたまま消費されません）。
              </p>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>
                    コンテキストウィンドウ：AIモデルが一度の応答生成で参照できる情報量の上限のこと。人間で言えば「今、頭の中で同時に意識できる情報量」に近いイメージです
                  </li>
                  <li>
                    トークン：AIがテキストを処理する際の最小単位のこと。日本語ではおおよそ1〜2文字が1トークンに相当することが多いとされています
                  </li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://agentskills.io/specification.md">
                      Specification - agentskills.io
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview">
                      Agent Skills - Claude Platform Docs
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://explainx.ai/blog/kaggle-agent-skills-whitepaper-guide-2026">
                      Kaggle Agent Skills Whitepaper: Complete Guide 2026 - explainx.ai
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch4">
              <h2>4. SKILL.mdファイルの構造</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>
                  この章では、Skillの心臓部である<code>SKILL.md</code>
                  ファイルの中身を、フィールドごとに詳しく見ていきます。
                </p>
              </div>
              <p>
                <code>SKILL.md</code>
                ファイルは、必ず「YAMLフロントマター」と「Markdown本文」の2つのパートで構成されます。
              </p>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>SKILL.md</span>
                  <span className={styles.codeLang}>markdown</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>---</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>name</span>
                    <span>{": "}</span>
                    <span className={styles.cv}>skill-name</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>description</span>
                    <span>{": "}</span>
                    <span className={styles.cv}>
                      このSkillが何をするか、いつ使うべきかを説明する文章
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>---</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.cc}>
                      ここから下がMarkdown本文（エージェントへの指示）
                    </span>
                  </div>
                </div>
              </div>

              <h3>4-1. フロントマターのフィールド一覧</h3>
              <p>
                <code>agentskills.io</code>のオープン仕様では、以下のフィールドが定義されています。
              </p>

              <table>
                <thead>
                  <tr>
                    <th>フィールド</th>
                    <th>必須</th>
                    <th>制約</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>name</code>
                    </td>
                    <td>必須</td>
                    <td>
                      最大64文字。半角小文字英数字とハイフンのみ使用可能。先頭・末尾にハイフン不可、連続ハイフン不可
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>description</code>
                    </td>
                    <td>必須</td>
                    <td>最大1024文字。空文字は不可。何をするか、いつ使うべきかの両方を説明する</td>
                  </tr>
                  <tr>
                    <td>
                      <code>license</code>
                    </td>
                    <td>任意</td>
                    <td>ライセンス名、またはバンドルされたライセンスファイルへの参照</td>
                  </tr>
                  <tr>
                    <td>
                      <code>compatibility</code>
                    </td>
                    <td>任意</td>
                    <td>
                      最大500文字。動作環境の要件（対象製品、必要パッケージ、ネットワークアクセスなど）を示す
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>metadata</code>
                    </td>
                    <td>任意</td>
                    <td>任意のキーと値のペアからなるマップ</td>
                  </tr>
                  <tr>
                    <td>
                      <code>allowed-tools</code>
                    </td>
                    <td>任意（実験的機能）</td>
                    <td>事前承認するツールをスペース区切りで指定する</td>
                  </tr>
                </tbody>
              </table>

              <p>
                なお、Claude Code / Claude API / claude.aiなど Anthropic 製品では、<code>name</code>
                に「anthropic」「claude」といった予約語を含められない、XMLタグを含められないといった追加の制約があります。
              </p>

              <h3>
                4-2. <code>name</code>フィールドの具体例
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>良い例</th>
                    <th>理由</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>pdf-processing</code>
                    </td>
                    <td>小文字・ハイフンのみで、内容が一目で分かる</td>
                  </tr>
                  <tr>
                    <td>
                      <code>data-analysis</code>
                    </td>
                    <td>シンプルで衝突しにくい</td>
                  </tr>
                </tbody>
              </table>

              <table>
                <thead>
                  <tr>
                    <th>悪い例</th>
                    <th>理由</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>PDF-Processing</code>
                    </td>
                    <td>大文字は使用不可</td>
                  </tr>
                  <tr>
                    <td>
                      <code>-pdf</code>
                    </td>
                    <td>先頭にハイフンは使用不可</td>
                  </tr>
                  <tr>
                    <td>
                      <code>pdf--processing</code>
                    </td>
                    <td>連続ハイフンは使用不可</td>
                  </tr>
                </tbody>
              </table>

              <h3>
                4-3. <code>description</code>フィールドの具体例
              </h3>
              <p>
                <code>description</code>
                はSkillが選ばれるかどうかを左右する、最も重要なフィールドです。詳しい書き方は
                <a href="#ch8">第8章</a>
                で扱いますが、ここでは基本の良い例・悪い例を紹介します。
              </p>

              <table>
                <thead>
                  <tr>
                    <th>種類</th>
                    <th>例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>良い例</td>
                    <td>
                      PDFファイルからテキストと表を抽出し、フォームへの入力やファイル結合を行います。PDF文書を扱うとき、またはユーザーがPDF・フォーム・文書抽出について言及したときに使用してください。
                    </td>
                  </tr>
                  <tr>
                    <td>悪い例</td>
                    <td>PDFを手伝います。</td>
                  </tr>
                </tbody>
              </table>

              <p>
                良い例は「何をするか」と「いつ使うか」の両方が明記されているのに対し、悪い例はどちらも曖昧で、エージェントがこのSkillを選ぶべきタイミングを判断できません。
              </p>

              <h3>4-4. 本文（Body）について</h3>
              <p>
                フロントマターより下のMarkdown本文には、厳密な書式の決まりはありません。ただし、推奨されるセクション構成があります。
              </p>
              <ul>
                <li>ステップバイステップの手順</li>
                <li>入力と出力の具体例</li>
                <li>よくあるエッジケース（例外的な状況）への対処</li>
              </ul>
              <p>
                なお、本文が長くなりすぎる場合は、<code>references/</code>
                フォルダに詳細を切り出し、<code>SKILL.md</code>
                本体は概要とナビゲーションだけに留めることが推奨されています。目安として、
                <code>SKILL.md</code>
                は500行未満に収めるとよいとされています。
              </p>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>
                    YAMLフロントマター：ファイルの先頭に<code>---</code>
                    で囲んで書く、構造化されたメタデータ領域のこと。YAML（YAML Ain&apos;t Markup
                    Language）という、人間にも読みやすいデータ形式で書かれます
                  </li>
                  <li>
                    エッジケース：通常想定される範囲から外れた、特殊で例外的な入力や状況のこと
                  </li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://agentskills.io/specification.md">
                      Specification - agentskills.io
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview">
                      Agent Skills - Claude Platform Docs
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://agentman.ai/blog/build-your-first-agent-skill-skillmd-anatomy">
                      How Do You Build Your First Agent Skill? - Agentman Blog
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch5">
              <h2>5. フォルダ構成：scripts references assets</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>この章では、SKILL.md以外にバンドルできる3種類のフォルダについて説明します。</p>
              </div>
              <p>
                Skillフォルダには、<code>SKILL.md</code>
                に加えて次の3つの任意ディレクトリを含めることができます。それぞれ役割が異なり、エージェントが参照するタイミングも異なります。
              </p>
              <p>
                この図は、それぞれのフォルダがいつ・どのように使われるかを表しています。上から下へ読み進めてください。
              </p>

              <div className={styles.mermaidWrapper}>
                <div className={styles.mermaidDiagram}>
                  <MermaidDiagram chart={DIAGRAM_2} />
                </div>
              </div>

              <p>各ノードの意味：</p>
              <ul>
                <li>「SKILL.md 本文の指示」：エージェントがまず読む中心的な指示文です。</li>
                <li>
                  「追加の情報や処理が必要か」：指示を読んだエージェントが、次に何をすべきか判断する分岐点です。
                </li>
                <li>
                  「scripts」：Python・Bash・JavaScriptなどで書かれた、自己完結した実行可能コードを置く場所です。エージェントはコードの中身をコンテキストに読み込まず、実行結果だけを受け取ります。そのため非常にトークン効率が良いという特徴があります。
                </li>
                <li>
                  「references」：<code>REFERENCE.md</code>や<code>FORMS.md</code>
                  など、詳細な技術資料やドメイン固有の文書を置く場所です。個々のファイルを小さく焦点を絞って作ることで、必要な時にだけ読み込まれ、コンテキストの消費を抑えられます。
                </li>
                <li>
                  「assets」：ドキュメントテンプレート、画像、ルックアップテーブルなどの静的リソースを置く場所です。
                </li>
              </ul>
              <p>ファイルを相互参照する際は、SKILL.mdからの相対パスを使います。</p>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>SKILL.md</span>
                  <span className={styles.codeLang}>markdown</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span>詳細は </span>
                    <span className={styles.cs}>[reference.md](references/REFERENCE.md)</span>
                    <span> を参照してください。</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span>抽出スクリプトを実行します：</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}>scripts/extract.py</span>
                  </div>
                </div>
              </div>

              <p>
                参照の深さは、SKILL.mdから1階層以内に留めることが推奨されています。深くネストした参照チェーンは避けましょう。
              </p>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>
                    自己完結したコード：外部への依存を最小限にし、それ単体で動作するように書かれたコードのこと
                  </li>
                  <li>
                    相対パス：現在のファイルの位置を基準にした、他のファイルへの道順の書き方のこと
                  </li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://agentskills.io/specification.md">
                      Specification - agentskills.io
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://code.claude.com/docs/en/skills">
                      Extend Claude with skills - Claude Code Docs
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch6">
              <h2>6. ステップバイステップ：最初のSkillを作る</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>
                  この章では、実際に手を動かしながら最初のSkillを作成する手順を、agentskills.io公式チュートリアルに沿って説明します。
                </p>
              </div>
              <p>
                ここでは、サイコロを振る機能をエージェントに与える<code>roll-dice</code>
                という最小構成のSkillを作ります。VS Code + GitHub Copilotを例にしていますが、Agent
                Skillsはオープン仕様なので、同じファイルはClaude CodeやOpenAI
                Codexでもそのまま動作します。
              </p>

              <h3>ステップ1：フォルダを作成する</h3>
              <p>
                VS Codeの場合、デフォルトでは<code>.agents/skills/</code>
                フォルダの中からSkillを探します。プロジェクト直下に次のフォルダを作成します。
              </p>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>Terminal</span>
                  <span className={styles.codeLang}>bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>mkdir</span>
                    <span className={styles.cv}> -p .agents/skills/roll-dice</span>
                  </div>
                </div>
              </div>

              <h3>ステップ2：SKILL.mdを書く</h3>
              <p>
                <code>.agents/skills/roll-dice/SKILL.md</code>
                を次の内容で作成します。
              </p>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>SKILL.md</span>
                  <span className={styles.codeLang}>markdown</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>---</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>name</span>
                    <span>{": "}</span>
                    <span className={styles.cv}>roll-dice</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>description</span>
                    <span>{": "}</span>
                    <span className={styles.cv}>
                      乱数生成器を使ってサイコロを振ります。d6やd20などのダイスを振る、サイコロを転がす、ランダムなダイス結果を生成すると頼まれたときに使用してください。
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>---</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span>
                      ダイスを振るには、1から指定された面数までのランダムな数を生成する、以下のコマンドを使用します。
                    </span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>```bash</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>echo</span>
                    <span className={styles.cv}> $((RANDOM % &lt;sides&gt; + 1))</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>```</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span>
                      `&lt;sides&gt;`をサイコロの面数（例：標準的なサイコロなら6、d20なら20）に置き換えてください。
                    </span>
                  </div>
                </div>
              </div>

              <p>
                なぜこのように書くのかというと、<code>description</code>
                にユーザーが実際に使いそうな言葉（「d6」「d20」「サイコロを振る」など）を具体的に含めることで、エージェントが逆引きのタイミングでこのSkillを選べるようになるためです。本文には、実際に実行すべきコマンドを明記しています。
              </p>

              <h3>ステップ3：動作確認する</h3>
              <ol>
                <li>VS Codeでプロジェクトを開く</li>
                <li>Copilot Chatパネルを開く</li>
                <li>チャット下部のモードドロップダウンから「Agentモード」を選択する</li>
                <li>
                  <code>/skills</code>と入力し、<code>roll-dice</code>
                  が一覧に表示されることを確認する
                </li>
                <li>「d20を振って」のように依頼する</li>
              </ol>
              <p>
                正しく動作すると、エージェントは<code>roll-dice</code>
                Skillを起動し、ターミナルコマンドの実行許可を求めたうえで、1〜20のランダムな数値を返します。
              </p>

              <h3>この体験を、第3章の3段階に当てはめると</h3>
              <ul>
                <li>
                  Discovery：セッション開始時に、エージェントは<code>roll-dice</code>
                  という名前と説明文だけを読み込んでいました
                </li>
                <li>
                  Activation：「d20を振って」という依頼が<code>description</code>
                  と一致したため、SKILL.md本文全体をコンテキストに読み込みました
                </li>
                <li>Execution：本文の指示に従い、面数を20に置き換えたコマンドを実行しました</li>
              </ul>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>乱数生成器：予測できないランダムな数値を作り出す仕組みのこと</li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://agentskills.io/skill-creation/quickstart">
                      Quickstart - agentskills.io
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://github.com/agentskills/agentskills/blob/main/docs/skill-creation/quickstart.mdx">
                      agentskills/agentskills quickstart.mdx - GitHub
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch7">
              <h2>7. どこで使えるか（対応プラットフォーム）</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>この章では、Agent Skillsが実際にどのAIツールで使えるのかを一覧で確認します。</p>
              </div>
              <p>
                Agent
                Skillsはオープン仕様のため、非常に多くのAIエージェント製品が対応しています。代表的なものを紹介します（2026年時点、詳細な最新一覧は
                <Ext href="https://agentskills.io/clients">Client Showcase</Ext>
                を参照してください）。
              </p>

              <table>
                <thead>
                  <tr>
                    <th>プラットフォーム</th>
                    <th>概要</th>
                    <th>ドキュメントURL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Claude Code</td>
                    <td>
                      Anthropicのターミナル/IDE向けコーディングエージェント。カスタムSkillのみ対応
                    </td>
                    <td>
                      <Ext href="https://code.claude.com/docs/en/skills">
                        code.claude.com/docs/en/skills
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>claude.ai</td>
                    <td>Anthropicのチャット製品。事前構築済みSkillとカスタムSkillの両方に対応</td>
                    <td>
                      <Ext href="https://support.claude.com/en/articles/12512176-what-are-skills">
                        support.claude.com Skillsとは？
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Claude API / Claude Platform</td>
                    <td>プログラムからSkillを利用するためのAPI</td>
                    <td>
                      <Ext href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview">
                        platform.claude.com/docs Skills overview
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>VS Code + GitHub Copilot</td>
                    <td>エディタ上でSkillを利用</td>
                    <td>
                      <Ext href="https://code.visualstudio.com/docs/copilot/customization/agent-skills">
                        code.visualstudio.com docs
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Cursor</td>
                    <td>AIエディタ/コーディングエージェント</td>
                    <td>
                      <Ext href="https://cursor.com/docs/context/skills">cursor.com/docs</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>OpenAI Codex</td>
                    <td>OpenAIのコーディングエージェント</td>
                    <td>
                      <Ext href="https://developers.openai.com/codex/skills/">
                        developers.openai.com/codex/skills
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Gemini CLI</td>
                    <td>Googleのオープンソースターミナルエージェント</td>
                    <td>
                      <Ext href="https://geminicli.com/docs/cli/skills/">geminicli.com/docs</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>GitHub Copilot（エージェント機能）</td>
                    <td>GitHub製のコーディング支援AI</td>
                    <td>
                      <Ext href="https://docs.github.com/en/copilot/concepts/agents/about-agent-skills">
                        docs.github.com
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Goose</td>
                    <td>オープンソースの拡張可能なAIエージェント</td>
                    <td>
                      <Ext href="https://block.github.io/goose/docs/guides/context-engineering/using-skills/">
                        block.github.io/goose docs
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>OpenHands</td>
                    <td>クラウドコーディングエージェントのオープンプラットフォーム</td>
                    <td>
                      <Ext href="https://docs.openhands.dev/overview/skills">
                        docs.openhands.dev
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p>
                異なるツール間でも基本の<code>SKILL.md</code>
                フォーマット（フロントマターとMarkdown本文の標準部分）はそのまま動作しますが、各ツールが独自拡張を追加している場合があります。例えばClaude
                Codeはコンテキストの分岐実行（<code>context: fork</code>
                ）、Codexは<code>openai.yaml</code>
                メタデータといった機能を追加しています。共通言語ではあっても、細かな挙動はツールごとに異なると考えておくとよいでしょう。
              </p>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>
                    独自拡張：オープン仕様の共通部分に加えて、各社・各プロダクトが独自に追加した機能のこと
                  </li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://agentskills.io/home">
                      Agent Skills Overview / Client Showcase - agentskills.io
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://www.agensi.io/learn/agent-skills-open-standard">
                      SKILL.md: The Open Standard for AI Agent Skills - agensi.io
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch8">
              <h2>8. 良いdescriptionの書き方</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>
                  この章では、Skillが正しいタイミングで発火するかどうかを左右する、
                  <code>description</code>
                  フィールドの書き方のコツを説明します。
                </p>
              </div>
              <p>
                第3章で説明した通り、エージェントは起動時に全Skillの<code>name</code>と
                <code>description</code>
                だけを読み込み、それをもとに「今回のタスクにどのSkillを使うか」を判断します。つまり、
                <strong>
                  本文がどれだけ優れていても、descriptionが的確でなければそのSkillは一生呼び出されません。
                </strong>
              </p>

              <h3>8-1. 三人称で書く</h3>
              <p>
                <code>description</code>
                はシステムプロンプトに直接挿入されるため、一人称（「私は〜します」）ではなく三人称（「〜を処理します」）で統一して書く必要があります。視点が一貫していないと、エージェントの発見ロジックに悪影響が出ることがあります。
              </p>

              <table>
                <thead>
                  <tr>
                    <th>評価</th>
                    <th>例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>良い</td>
                    <td>Excelファイルを処理し、レポートを生成します。</td>
                  </tr>
                  <tr>
                    <td>避けるべき</td>
                    <td>私がExcelファイルを処理してレポートを作ります。</td>
                  </tr>
                </tbody>
              </table>

              <h3>8-2. 具体的なトリガーワードを含める</h3>
              <p>
                <code>description</code>
                には「何をするか」だけでなく「いつ使うべきか」を明記し、ユーザーが実際に使いそうなキーワードを含めます。
              </p>

              <table>
                <thead>
                  <tr>
                    <th>評価</th>
                    <th>例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>良い</td>
                    <td>
                      Angular
                      20以降のプロジェクトで、シグナルベースのinput/outputとOnPushな変更検知、inject関数を使ったスタンドアロンコンポーネントを生成します。コンポーネント・ページ・機能を新規作成するときに使用してください。
                    </td>
                  </tr>
                  <tr>
                    <td>避けるべき</td>
                    <td>Angular関連を手伝います。</td>
                  </tr>
                </tbody>
              </table>

              <h3>8-3. トリガー・トライアド（3要素）で考える</h3>
              <p>
                <code>description</code>
                を書くときは、次の3つの要素を意識すると精度が上がるとされています。
              </p>

              <table>
                <thead>
                  <tr>
                    <th>要素</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>能力</td>
                    <td>
                      動詞＋目的語。このSkillが何を生み出すか（例：「SEO最適化されたブログ記事を生成する」）
                    </td>
                  </tr>
                  <tr>
                    <td>トリガー</td>
                    <td>ユーザーがどんな言葉を使ったときに反応すべきか</td>
                  </tr>
                  <tr>
                    <td>除外条件</td>
                    <td>このSkillを使うべきでない場面（「〜のためには使用しないでください」）</td>
                  </tr>
                </tbody>
              </table>

              <p>除外条件を明記しておくと、似たタスクを持つ他のSkillとの混同を防げます。</p>

              <h3>8-4. XMLタグや山括弧を避ける</h3>
              <p>
                フロントマターには<code>&lt;</code>や<code>&gt;</code>
                のような山括弧を含めないようにします。これらの文字がシステムプロンプトに意図しない指示として紛れ込む（プロンプトインジェクションの原因になる）リスクがあるためです。
              </p>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>
                    システムプロンプト：会話の最初にAIへ与えられる、基本的な役割や振る舞いを定義する指示文のこと
                  </li>
                  <li>
                    プロンプトインジェクション：外部から与えられたテキストに紛れ込ませた命令によって、AIの本来の指示を意図せず上書きしてしまう攻撃手法のこと
                  </li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices">
                      Skill authoring best practices - Claude Platform Docs
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://agentskills.io/specification.md">
                      Specification - agentskills.io
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://agentman.ai/blog/build-your-first-agent-skill-skillmd-anatomy">
                      How Do You Build Your First Agent Skill? - Agentman Blog
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://angular.love/agent-skills-in-claude-a-practical-guide-for-angular-developers">
                      Agent Skills in Claude – A Practical Guide for Angular Developers
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch9">
              <h2>9. Skills vs MCP vs AGENTS.md</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>
                  この章では、混同されやすい3つの概念「Agent
                  Skills」「MCP」「AGENTS.md」の役割の違いを整理します。
                </p>
              </div>
              <p>
                これら3つは競合する技術ではなく、それぞれ異なる役割を持ち、組み合わせて使うものです。次の図は、エージェント本体を中心に、それぞれの要素がどう位置づけられるかを表しています。
              </p>

              <div className={styles.mermaidWrapper}>
                <div className={styles.mermaidDiagram}>
                  <MermaidDiagram chart={DIAGRAM_3} />
                </div>
              </div>

              <p>各ノードの意味：</p>
              <ul>
                <li>「System prompt」：エージェントの土台となる基本的な振る舞いの指示です。</li>
                <li>
                  「AGENTS.md」：プロジェクトルートに置かれ、常に読み込まれる規約ファイルです。技術スタックや命名規則など、プロジェクト全体に関わる情報を書きます。
                </li>
                <li>
                  「MCP Server」：Model Context
                  Protocol（MCP）を通じて外部のツールやデータに接続する手段です。エージェントにとっての「手」や「道具」に相当します。
                </li>
                <li>
                  「Agent
                  Skills」：特定のタスクをどう進めるかという手順や勘所をまとめた、必要な時にだけ読み込まれる手順書です。
                </li>
                <li>「RAG」：大量の外部知識を検索して参照する仕組みです。</li>
              </ul>
              <p>3者の違いを整理すると、次の表のようになります。</p>

              <table>
                <thead>
                  <tr>
                    <th>比較項目</th>
                    <th>MCP</th>
                    <th>Agent Skills</th>
                    <th>AGENTS.md</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>主な役割</td>
                    <td>外部システムやデータへの接続を提供する</td>
                    <td>ツールをどう使うか、作業手順を教える</td>
                    <td>プロジェクト全体に常時適用される規約を提供する</td>
                  </tr>
                  <tr>
                    <td>読み込まれるタイミング</td>
                    <td>接続時・呼び出し時</td>
                    <td>関連するタスクが来たときだけ</td>
                    <td>常時</td>
                  </tr>
                  <tr>
                    <td>たとえるなら</td>
                    <td>手や道具</td>
                    <td>経験者から渡される作業マニュアル</td>
                    <td>新人向けの社内README</td>
                  </tr>
                </tbody>
              </table>

              <p>
                つまり、MCPが「何ができるか（手段）」を提供するのに対し、Agent
                Skillsは「その手段をどう使うべきか（やり方）」を教える役割を担っています。両者は競合せず、組み合わせて使うことで真価を発揮します。
              </p>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>
                    MCP：Model Context
                    Protocolの略。AIエージェントが外部のツールやデータソースに接続するための標準プロトコルのこと
                  </li>
                  <li>
                    AGENTS.md：プロジェクトルートに置く、AIエージェント向けの常時読み込み型の規約ファイルのこと
                  </li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://explainx.ai/blog/kaggle-agent-skills-whitepaper-guide-2026">
                      Kaggle Agent Skills Whitepaper: Complete Guide 2026 - explainx.ai
                    </Ext>
                    （whitepaper付録Aの概念をもとに構成）
                  </li>
                  <li>
                    <Ext href="https://agentskills.io/home">
                      Agent Skills Overview - agentskills.io
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch10">
              <h2>10. セキュリティに関する注意点</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>
                  この章では、Skillを使う・作る際に必ず知っておくべきセキュリティ上の注意点を説明します。
                </p>
              </div>
              <p>
                Skillは、エージェントに指示文とコードを通じて新しい能力を与えるため、非常に強力である一方、
                <strong>
                  悪意あるSkillはエージェントに、本来の目的とは異なる形でツールを呼び出させたりコードを実行させたりできてしまう
                </strong>
                という危険性を持っています。Anthropic公式ドキュメントでは、これを「ソフトウェアをインストールするのと同じ感覚で扱うべき」と位置づけています。
              </p>
              <p>信頼できる情報源として推奨されているのは、次のいずれかです。</p>
              <ul>
                <li>自分自身で作成したSkill</li>
                <li>Anthropicなど、信頼できる提供元から入手したSkill</li>
              </ul>
              <p>
                信頼できない、あるいは出所不明のSkillをどうしても使う必要がある場合は、次の点を必ず確認してください。
              </p>

              <table>
                <thead>
                  <tr>
                    <th>確認項目</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>徹底した監査</td>
                    <td>
                      SKILL.md本体・スクリプト・画像・その他すべてのバンドルファイルを確認する。想定外のネットワーク通信やファイルアクセスがないか調べる
                    </td>
                  </tr>
                  <tr>
                    <td>外部ソースへの注意</td>
                    <td>
                      外部URLからデータを取得するSkillは特にリスクが高い。取得したコンテンツに悪意ある指示が紛れ込んでいる可能性がある
                    </td>
                  </tr>
                  <tr>
                    <td>ツールの誤用</td>
                    <td>
                      悪意あるSkillは、ファイル操作やbashコマンド、コード実行などのツールを有害な形で呼び出す可能性がある
                    </td>
                  </tr>
                  <tr>
                    <td>データの露出</td>
                    <td>
                      機微なデータにアクセスできるSkillが、外部にその情報を漏らすように設計されている可能性がある
                    </td>
                  </tr>
                </tbody>
              </table>

              <p>
                特に、本番環境や機微なデータ・重要な操作へのアクセス権を持つシステムにSkillを組み込む場合は、細心の注意を払う必要があります。
              </p>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>
                    監査：システムやコードの内容を第三者の視点で細かく点検し、問題がないか確認する作業のこと
                  </li>
                  <li>本番環境：実際のユーザーが利用する、稼働中のシステム環境のこと</li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview">
                      Agent Skills - Claude Platform Docs（セキュリティに関する考慮事項）
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch11">
              <h2>11. 評価とベストプラクティス</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>
                  この章では、「Skillは作って終わりではない」という考え方と、その評価方法について説明します。
                </p>
              </div>
              <p>
                Kaggle Agent Skills
                Whitepaperで紹介されているSkillsBenchという評価データセットでは、Skillを使うことでかえって成果が悪化したタスクが全体の19%も存在したと報告されています。つまり、
                <strong>
                  説明文が曖昧だったり、本文が肥大化していたり、単体テストしかしていないSkillは、無いよりも有害になり得る
                </strong>
                ということです。
              </p>

              <h3>11-1. 4つの失敗モード</h3>
              <table>
                <thead>
                  <tr>
                    <th>モード</th>
                    <th>症状</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>トリガーの誤り</td>
                    <td>
                      呼び出されるべきでないSkillが発火する、または発火すべきSkillが発火しない
                    </td>
                  </tr>
                  <tr>
                    <td>実行の誤り</td>
                    <td>Skillは発火するが、出力の内容やツール呼び出しが誤っている</td>
                  </tr>
                  <tr>
                    <td>トークン予算超過</td>
                    <td>
                      本文が長すぎて、他のSkillと同時に読み込まれたときにコンテキストが圧迫される
                    </td>
                  </tr>
                  <tr>
                    <td>リグレッション</td>
                    <td>新しいSkillの追加が、既存Skillの発火判定を壊してしまう</td>
                  </tr>
                </tbody>
              </table>

              <h3>11-2. 評価は単体ではなく「同時読み込み」で行う</h3>
              <p>
                本番環境では、多くの場合5〜15個のSkillが同時に読み込まれた状態でエージェントが動作します。単体では合格したSkillでも、他のSkillと同時に読み込まれると失敗することがあるため、
                <strong>Skillを孤立させた状態でのみ評価してはいけない</strong>
                という点が強調されています。
              </p>

              <h3>11-3. Read／Draft／Actの3段階ゲート</h3>
              <p>
                不可逆な操作（元に戻せない操作）を許可する前に、段階を踏んで信頼性を積み上げていく考え方です。次の図は、その進め方を表しています。
              </p>

              <div className={styles.mermaidWrapper}>
                <div className={styles.mermaidDiagram}>
                  <MermaidDiagram chart={DIAGRAM_4} />
                </div>
              </div>

              <p>各ノードの意味：</p>
              <ul>
                <li>「Read-Only」：情報を照会したり説明したりするだけの、安全な段階です。</li>
                <li>
                  「Draft-Only」：下書きを作成しますが、必ず人間がレビューしてから採用するという前提の段階です。
                </li>
                <li>
                  「Action-Allowed」：取り消せない操作（送金、削除、デプロイなど）を実行できる、最も慎重さが求められる段階です。
                </li>
              </ul>

              <table>
                <thead>
                  <tr>
                    <th>段階</th>
                    <th>進める条件の目安</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Read-Only</td>
                    <td>発火精度（トリガー精度）がおおむね90%程度に達していること</td>
                  </tr>
                  <tr>
                    <td>Draft-Only</td>
                    <td>20件以上のテストケース（ゴールデンデータセット）で確認済みであること</td>
                  </tr>
                  <tr>
                    <td>Action-Allowed</td>
                    <td>
                      敵対的テスト（意図的に誤動作を誘発する入力での検証）と、複数回連続で成功することの確認、さらに人間による最終承認が済んでいること
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3>11-4. Claude Codeでの実践的な評価方法</h3>
              <p>
                Claude Codeには<code>skill-creator</code>
                という公式プラグインがあり、次の手順でSkillの評価サイクルを自動化できます。
              </p>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>Claude Code</span>
                  <span className={styles.codeLang}>Terminal</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>
                      /plugin install skill-creator@claude-plugins-official
                    </span>
                  </div>
                </div>
              </div>

              <p>
                インストール後、<code>/reload-plugins</code>
                でプラグインを反映させ、「summarize-changesスキルをskill-creatorで評価して」のように依頼すると、テストケースの作成、Skillあり／なしの比較（ベンチマーク）、旧バージョンとの比較（A/Bテスト）、descriptionのチューニング提案などを自動的に行ってくれます。
              </p>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>
                    ゴールデンデータセット：正解が分かっている、検証用の入力と期待される出力のペアを集めたデータのこと
                  </li>
                  <li>
                    敵対的テスト：システムを意図的に誤動作させようとする、厳しい条件での検証テストのこと
                  </li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://explainx.ai/blog/kaggle-agent-skills-whitepaper-guide-2026">
                      Kaggle Agent Skills Whitepaper: Complete Guide 2026 - explainx.ai
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://code.claude.com/docs/en/skills">
                      Extend Claude with skills（評価と反復のセクション）- Claude Code Docs
                    </Ext>
                  </li>
                  <li>
                    <Ext href="https://agentskills.io/skill-creation/evaluating-skills">
                      Evaluating skill output quality - agentskills.io
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch12">
              <h2>12. 実践ハンズオン：commitメッセージ生成Skillを作る</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>
                  この章では、これまで学んだ知識を総動員して、実務で使える完成度のSkillを最初から最後まで作ります。
                </p>
              </div>
              <p>
                作るのは、Gitのuncommitted
                changes（コミットされていない変更）を要約し、リスクを指摘してくれる
                <code>summarize-changes</code>
                というSkillです。Claude Codeを例にしますが、考え方はどのツールでも同じです。
              </p>

              <h3>ステップ1：なぜこのSkillが役立つのかを整理する</h3>
              <p>
                「変更内容を要約して」という依頼のたびに、毎回同じ手順（<code>git diff</code>
                を見る、要約する、リスクを指摘する）を口頭で説明するのは非効率です。この繰り返しをSkillとして固定化することで、以後は自動的に一貫した手順で処理されるようになります。
              </p>

              <h3>ステップ2：フォルダを作成する</h3>
              <p>個人用（すべてのプロジェクトで使える）Skillとして作成します。</p>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>Terminal</span>
                  <span className={styles.codeLang}>bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>mkdir</span>
                    <span className={styles.cv}> -p ~/.claude/skills/summarize-changes</span>
                  </div>
                </div>
              </div>

              <h3>ステップ3：SKILL.mdを書く</h3>
              <p>
                <code>~/.claude/skills/summarize-changes/SKILL.md</code>
                を次のように作成します。
              </p>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>SKILL.md</span>
                  <span className={styles.codeLang}>markdown</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>---</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>description</span>
                    <span>{": "}</span>
                    <span className={styles.cv}>
                      コミットされていない変更を要約し、リスクを指摘します。ユーザーが何を変更したか尋ねたとき、コミットメッセージを求めたとき、差分をレビューしたいときに使用してください。
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cs}>---</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.ch}>## 現在の変更内容</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span>!`git diff HEAD`</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.ch}>## 指示</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span>
                      上記の変更内容を2〜3個の箇条書きで要約してください。そのあと、エラーハンドリングの欠如、ハードコードされた値、更新が必要なテストなど、気づいたリスクを一覧にしてください。差分が空の場合は、コミットされていない変更はないと伝えてください。
                    </span>
                  </div>
                </div>
              </div>

              <p>
                なぜ<code>!`git diff HEAD`</code>
                という書き方をするのかというと、これは「動的コンテキスト注入」と呼ばれる仕組みで、Claude
                Codeがこのシェルコマンドを事前に実行し、その出力結果をプレースホルダーの位置にそのまま埋め込んでからエージェントに渡すためです。つまりエージェントは、推測ではなく実際の差分データをもとに要約を作ることができます。
              </p>

              <h3>ステップ4：動作確認する</h3>
              <ol>
                <li>Gitで管理されているプロジェクトを開き、適当なファイルを少し編集する</li>
                <li>
                  <code>claude</code>コマンドでClaude Codeを起動する
                </li>
                <li>
                  「何を変更した？」と尋ねる、あるいは直接
                  <code>/summarize-changes</code>と入力する
                </li>
              </ol>
              <p>正しく動作すると、編集内容の短い要約と、気づいたリスクの一覧が返ってきます。</p>

              <h3>ステップ5：本文だけでなく発火精度も確認する</h3>
              <p>
                Skillが「発火したかどうか」を確認するだけでは不十分です。次の2点を分けて確認する必要があります。
              </p>
              <ul>
                <li>発火すべきプロンプトで、実際にClaudeがこのSkillを見つけて起動したか</li>
                <li>起動したときの出力内容が、期待したものと一致しているか</li>
              </ul>
              <p>
                確認するには、Skillを有効にした状態と無効にした状態それぞれで、いくつかの現実的なプロンプトを新しいセッションで試し、結果を比較します。新しいセッションで試すのが重要な理由は、Skillを作成している最中の会話の文脈が残っていると、指示文自体の不備が隠れてしまうためです。
              </p>

              <h3>ステップ6：発展的な使い方</h3>
              <p>このSkillをさらに強化するなら、次のような改善が考えられます。</p>
              <ul>
                <li>
                  <code>disable-model-invocation: true</code>
                  を追加し、<code>/summarize-changes</code>
                  と明示的に入力したときだけ動くようにする（誤って自動発火してほしくない場合）
                </li>
                <li>
                  <code>context: fork</code>
                  を追加し、独立したサブエージェント上で実行させる
                </li>
                <li>
                  <code>allowed-tools: Bash(git *)</code>
                  を追加し、gitコマンドの実行を毎回許可し直さずに済むようにする
                </li>
              </ul>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>
                    動的コンテキスト注入：Skillの本文をエージェントに渡す前に、あらかじめシェルコマンドなどを実行し、その結果を本文に埋め込む仕組みのこと
                  </li>
                  <li>
                    サブエージェント：本体 of
                    会話とは別の、独立したコンテキストで動作するエージェントのインスタンスのこと
                  </li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://code.claude.com/docs/en/skills">
                      Extend Claude with skills（Getting startedセクション）- Claude Code Docs
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch13">
              <h2>13. トラブルシューティング</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>
                  この章では、Skillを作ったのに思ったように動かないときの、よくある症状と対処法をまとめます。
                </p>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>症状</th>
                    <th>主な原因</th>
                    <th>対処法</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Skillが発火しない</td>
                    <td>
                      <code>description</code>
                      にユーザーが実際に使いそうなキーワードが含まれていない
                    </td>
                    <td>
                      <code>description</code>
                      をより具体的にし、依頼文と一致しやすいトリガーワードを追加する
                    </td>
                  </tr>
                  <tr>
                    <td>Skillが利用可能かどうか分からない</td>
                    <td>一覧に表示されているか未確認</td>
                    <td>
                      「利用可能なSkillは？」のように尋ねて確認する、あるいは直接
                      <code>/skill-name</code>で起動できるか試す
                    </td>
                  </tr>
                  <tr>
                    <td>Skillが発火しすぎる</td>
                    <td>
                      <code>description</code>が広すぎる、または曖昧すぎる
                    </td>
                    <td>
                      <code>description</code>をより具体的にする。手動起動だけにしたい場合は
                      <code>disable-model-invocation: true</code>を設定する
                    </td>
                  </tr>
                  <tr>
                    <td>YAMLの記述が壊れていてメタデータが空になる</td>
                    <td>フロントマターの書式エラー（インデントミスなど）</td>
                    <td>デバッグオプションを付けて起動し、パースエラーの内容を確認する</td>
                  </tr>
                  <tr>
                    <td>Skillの内容が途中から効かなくなる</td>
                    <td>会話が長くなり、要約（compaction）によって内容が省略された</td>
                    <td>該当するSkillを再度呼び出し、内容をコンテキストに復元する</td>
                  </tr>
                  <tr>
                    <td>descriptionが途中で切られてしまう</td>
                    <td>登録しているSkillの数が多く、文字数の予算を超過している</td>
                    <td>
                      重要度の低いSkillは名前のみの表示に切り替える、または文字数予算の設定を引き上げる
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>
                    パースエラー：プログラムがテキストの構造を解析する際に、書式の誤りによって発生するエラーのこと
                  </li>
                  <li>
                    compaction（要約による圧縮）：会話が長くなった際に、古いやり取りを要約して短くまとめる処理のこと
                  </li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://code.claude.com/docs/en/skills">
                      Extend Claude with skills（Troubleshootingセクション）- Claude Code Docs
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch14">
              <h2>14. まとめ：5つの黄金律と次のステップ</h2>
              <div className={styles.chapterIntro}>
                <span className={styles.introIcon} aria-hidden="true">
                  <i className="ti ti-bulb" />
                </span>
                <p>
                  この章では、ここまでの内容を凝縮した5つの実践ルールと、次に読むべきドキュメントを紹介します。
                </p>
              </div>
              <p>
                Kaggle Agent Skills
                Whitepaperのチートシートでは、Skillを設計・運用するうえでの原則として、次の5つが挙げされています。
              </p>

              <table>
                <thead>
                  <tr>
                    <th>番号</th>
                    <th>ルール</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      1つのSkillには1つの役割だけを持たせる。「〜と〜」のように「and」が必要になったら、分割のサインだと考える
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>descriptionはSkillの入り口である。本文以上に時間をかけて磨き上げる</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      Skillは依存関係（ソフトウェアのライブラリのようなもの）として扱う。バージョン管理し、レビューし、テストする
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>
                      Skillは、それぞれの領域に詳しいチームが所有する。AIに詳しい特定の部署だけがボトルネックにならないようにする
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      実行環境（ランタイム）は入れ替え可能である。移植性こそがAgent
                      Skillsの本質的な価値である
                    </td>
                  </tr>
                </tbody>
              </table>

              <p>
                初日から一気に50個のSkillを作ろうとするのではなく、まずは1つの繰り返し作業を選んで小さく始め、実際の使用を通じて育てていくというアプローチが推奨されています。
              </p>

              <h3>次に読むと役立つ公式ドキュメント</h3>
              <ul>
                <li>
                  Agent Skillsの仕様全体を知りたい →
                  <Ext href="https://agentskills.io/specification">
                    Specification - agentskills.io
                  </Ext>
                </li>
                <li>
                  手を動かして最初の1つを作りたい →
                  <Ext href="https://agentskills.io/skill-creation/quickstart">
                    Quickstart - agentskills.io
                  </Ext>
                </li>
                <li>
                  Claude Codeでの詳しい使い方を知りたい →
                  <Ext href="https://code.claude.com/docs/en/skills">
                    Extend Claude with skills - Claude Code Docs
                  </Ext>
                </li>
                <li>
                  Claude APIでの使い方を知りたい →
                  <Ext href="https://platform.claude.com/docs/en/build-with-claude/skills-guide">
                    Skills in the API - Claude Platform Docs
                  </Ext>
                </li>
                <li>
                  claude.aiでの使い方を知りたい →
                  <Ext href="https://support.claude.com/en/articles/12512180-using-skills-in-claude">
                    Using Skills in Claude - Claude Help Center
                  </Ext>
                </li>
                <li>
                  執筆のベストプラクティスを深掘りしたい →
                  <Ext href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices">
                    Skill authoring best practices - Claude Platform Docs
                  </Ext>
                </li>
              </ul>

              <div className={styles.glossary}>
                <div className={styles.glossaryTitle}>
                  <i className="ti ti-book-2" aria-hidden="true" />
                  このセクションで登場した用語
                </div>
                <ul>
                  <li>
                    依存関係：あるソフトウェアが正しく動作するために必要とする、他の部品やライブラリのこと
                  </li>
                </ul>
              </div>

              <div className={styles.sources}>
                <div className={styles.sourcesTitle}>
                  <i className="ti ti-link" aria-hidden="true" />
                  出典
                </div>
                <ul>
                  <li>
                    <Ext href="https://explainx.ai/blog/kaggle-agent-skills-whitepaper-guide-2026">
                      Kaggle Agent Skills Whitepaper: Complete Guide 2026 - explainx.ai
                    </Ext>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.chapter} id="ch15">
              <h2>15. 参考文献一覧</h2>
              <p>このガイド全体で参照した情報源を、種類ごとに整理しています。</p>
              <h3>一次情報源（Kaggle Whitepaper / オープン仕様）</h3>
              <ul>
                <li>
                  <Ext href="https://www.kaggle.com/whitepaper-agent-skills">
                    Kaggle Agent Skills Whitepaper
                  </Ext>
                </li>
                <li>
                  <Ext href="https://agentskills.io/home">
                    Agent Skills Overview - agentskills.io
                  </Ext>
                </li>
                <li>
                  <Ext href="https://agentskills.io/specification">
                    Specification - agentskills.io
                  </Ext>
                </li>
                <li>
                  <Ext href="https://agentskills.io/skill-creation/quickstart">
                    Quickstart - agentskills.io
                  </Ext>
                </li>
                <li>
                  <Ext href="https://agentskills.io/skill-creation/evaluating-skills">
                    Evaluating skill output quality - agentskills.io
                  </Ext>
                </li>
                <li>
                  <Ext href="https://github.com/agentskills/agentskills">
                    GitHub - agentskills/agentskills
                  </Ext>
                </li>
              </ul>

              <h3>Anthropic公式ドキュメント</h3>
              <ul>
                <li>
                  <Ext href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview">
                    Agent Skills - Claude Platform Docs
                  </Ext>
                </li>
                <li>
                  <Ext href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices">
                    Skill authoring best practices - Claude Platform Docs
                  </Ext>
                </li>
                <li>
                  <Ext href="https://code.claude.com/docs/en/skills">
                    Extend Claude with skills - Claude Code Docs
                  </Ext>
                </li>
                <li>
                  <Ext href="https://platform.claude.com/docs/en/agent-sdk/skills">
                    Agent Skills in the SDK - Claude API Docs
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.claude.com/en/articles/12512176-what-are-skills">
                    What are Skills? - Claude Help Center
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.claude.com/en/articles/12512180-using-skills-in-claude">
                    Using Skills in Claude - Claude Help Center
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills">
                    Equipping agents for the real world with Agent Skills - Anthropic Engineering
                  </Ext>
                </li>
              </ul>

              <h3>解説記事・二次情報源</h3>
              <ul>
                <li>
                  <Ext href="https://explainx.ai/blog/kaggle-agent-skills-whitepaper-guide-2026">
                    Kaggle Agent Skills Whitepaper: Complete Guide 2026 - explainx.ai
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.agensi.io/learn/agent-skills-open-standard">
                    SKILL.md: The Open Standard for AI Agent Skills - agensi.io
                  </Ext>
                </li>
                <li>
                  <Ext href="https://agentman.ai/blog/build-your-first-agent-skill-skillmd-anatomy">
                    How Do You Build Your First Agent Skill? - Agentman Blog
                  </Ext>
                </li>
                <li>
                  <Ext href="https://inference.sh/blog/skills/agent-skills-overview">
                    Agent Skills: The Open Standard for AI Capabilities - inference.sh
                  </Ext>
                </li>
                <li>
                  <Ext href="https://bibek-poudel.medium.com/the-skill-md-pattern-how-to-write-ai-agent-skills-that-actually-work-72a3169dd7ee">
                    The SKILL.md Pattern - Bibek Poudel (Medium)
                  </Ext>
                </li>
                <li>
                  <Ext href="https://abvijaykumar.medium.com/deep-dive-skill-md-part-1-2-09fc9a536996">
                    Deep Dive SKILL.md Part 1/2 - A B Vijay Kumar (Medium)
                  </Ext>
                </li>
                <li>
                  <Ext href="https://angular.love/agent-skills-in-claude-a-practical-guide-for-angular-developers">
                    Agent Skills in Claude – A Practical Guide for Angular Developers - Angular.love
                  </Ext>
                </li>
                <li>
                  <Ext href="https://medium.com/@tahirbalarabe2/9-tips-for-building-claude-agent-skills-3bca85c47a26">
                    9 Tips for Building Claude Agent Skills - Tahir (Medium)
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.awesomeskills.dev/en/blog/a-beginners-guide-to-agent-skills-on-agentskills-io">
                    A Beginner&apos;s Guide to Agent Skills on AgentSkills.io - Awesome Skills Blog
                  </Ext>
                </li>
              </ul>

              <p>
                <em>
                  本ガイドは2026年7月時点で確認できた公開情報をもとに作成しています。Agent
                  Skillsのエコシステムは急速に進化しているため、最新の詳細仕様や対応プラットフォーム一覧は必ず
                  <Ext href="https://agentskills.io/home">agentskills.io</Ext>
                  と各社公式ドキュメントで確認してください。
                </em>
              </p>
            </section>

            <footer className={styles.docFooter}>
              <p>
                本ガイドは2026年7月時点で確認できた公開情報をもとに作成しています。Agent
                Skillsのエコシステムは急速に進化しているため、最新の詳細仕様や対応プラットフォーム一覧は必ず
                <Ext href="https://agentskills.io/home">agentskills.io</Ext>
                と各社公式ドキュメントで確認してください。
              </p>
              <a className={styles.backToTop} href="#top">
                <i className="ti ti-arrow-up" />
                ページの先頭に戻る
              </a>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
