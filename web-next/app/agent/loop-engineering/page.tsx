import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata = {
  title: "Loop Engineering 完全ガイド ― プロンプトを書く人からループを設計する人へ",
  description:
    "Boris Cherny氏（Claude Code開発者）、Peter Steinberger氏（OpenClaw開発者）、Andrew Ng氏らの発言をもとに、AIエージェントを自律的に反復させる「Loop Engineering」を初学者向けにステップバイステップで解説します。",
};

const DIAGRAMS = {
  diag1: `graph LR
  subgraph OLD["❌ これまで（人間がループそのもの）"]
    O1["人がプロンプトを書く"] --> O2["エージェントが出力"]
    O2 --> O3["人が結果を確認"]
    O3 --> O4["人が次のプロンプトを書く"]
    O4 --> O1
  end
  subgraph NEW["✅ Loop Engineering（システムがループそのもの）"]
    N1["システムがタスクを発見"] --> N2["エージェントが実行"]
    N2 --> N3["別のエージェントが検証"]
    N3 --> N4["結果を記録・記憶"]
    N4 --> N5["次の周回をスケジュール"]
    N5 --> N1
  end
  style OLD fill:#fde8e8
  style NEW fill:#e8fde8`,
  diag2: `flowchart TD
  A["① Prompt Engineering<br />（2023〜2024年頃）<br />『何を言うか』を工夫する<br />良いプロンプト vs 悪いプロンプト"]
  B["② Context Engineering<br />（2024〜2025年頃）<br />『何を見せるか』を工夫する<br />コンテキストウィンドウに何を詰めるか"]
  C["③ Harness Engineering<br />（2025年頃）<br />『どんな道具を持たせるか』を工夫する<br />ツール・権限・実行環境 of 設計"]
  D["④ Loop Engineering<br />（2026年〜）<br />『いつ・何回・どう繰り返すか』を工夫する<br />人間を実行ループから外す"]
  A -->|"進化"| B
  B -->|"進化"| C
  C -->|"進化"| D
  style A fill:#95a5a6,color:#fff
  style B fill:#3498db,color:#fff
  style C fill:#e67e22,color:#fff
  style D fill:#e74c3c,color:#fff`,
  diag3: `flowchart LR
  GOAL(["🎯 ゴール／仕様を定義する<br />（人間の仕事）"]) --> LOOP
  subgraph LOOP["🔁 ループ（自動で回り続ける）"]
    direction TB
    DO["実行する"] --> CHECK["結果を確認する"]
    CHECK --> DECIDE{"合格？"}
    DECIDE -->|"No：やり直す"| DO
    DECIDE -->|"Yes：完了"| STOP(["✅ 停止する"])
  end
  style GOAL fill:#3498db,color:#fff
  style STOP fill:#27ae60,color:#fff
  style DECIDE fill:#f39c12,color:#fff`,
  diag4: `graph TD
  subgraph EXT["🌍 外部フィードバックループ（数時間〜数週間）"]
    direction TB
    EXT1["友人に見せる・アルファテスター・<br />A/Bテスト・本番投入"]
  end
  subgraph DEV["🧑‍💻 開発者フィードバックループ（数分〜数時間）"]
    direction TB
    DEV1["人間がプロダクトを確認し<br />エージェントに方向修正を指示する"]
  end
  subgraph AGENT["🤖 エージェンティック・コーディングループ（数分単位）"]
    direction TB
    AGENT1["仕様書 + 評価基準（evals）を渡す"] --> AGENT2["エージェントがコードを書く"]
    AGENT2 --> AGENT3["エージェント自身がテストする"]
    AGENT3 --> AGENT4{"仕様を満たし<br />バグがないか？"}
    AGENT4 -->|"No"| AGENT2
    AGENT4 -->|"Yes"| AGENT5["いったん完了として報告"]
  end
  AGENT5 --> DEV1
  DEV1 -->|"仕様を更新して<br />再度エージェントへ"| AGENT1
  DEV1 --> EXT1
  EXT1 -->|"データがプロダクトビジョンを<br />更新する"| DEV1
  style EXT fill:#fef9e7
  style DEV fill:#ebf5fb
  style AGENT fill:#eafaf1`,
  diag5: `flowchart TD
  D["① Discovery（発見）<br />価値のあるタスクを自律的に見つける<br />例：CIの失敗ログ、未解決のissueを読む"]
  H["② Handoff（引き渡し）<br />タスクごとに独立した作業環境（sandbox）を用意し<br />複数のエージェントを並行させる"]
  V["③ Verification（検証）<br />成果物が基準を満たしているか判定する<br />最も重要かつ最も軽視されがちな工程"]
  P["④ Persistence（永続化）<br />『何をしたか・次に何をすべきか』を<br />会話の外部（ファイルやDB）に記録する"]
  S["⑤ Scheduling（スケジューリング）<br />次の周回を自動で起動する仕組み<br />これがあって初めて『一回きりの実行』が『ループ』になる"]
  D --> H
  H --> V
  V --> P
  P --> S
  S -->|"次の周回へ"| D
  style D fill:#3498db,color:#fff
  style H fill:#8e44ad,color:#fff
  style V fill:#e74c3c,color:#fff
  style P fill:#27ae60,color:#fff
  style S fill:#f39c12,color:#fff`,
  diag6: `graph TD
  subgraph PARTS["🧩 ループを構成する6つの部品"]
    P1["⏰ Automations<br />（自動起動の仕組み）"]
    P2["🌳 Worktrees<br />（並行作業用の作業ディレクトリ）"]
    P3["📖 Skills<br />（プロジェクト固有の知識）"]
    P4["🔌 Plugins / Connectors<br />（既存ツールとの接続）"]
    P5["🤖 Sub-agents<br />（役割分担された複数のエージェント）"]
    P6["🧠 Memory（外部記憶）<br />（会話の外にある共有状態）"]
  end
  P1 -.->|"実現する"| DISC["Discovery"]
  P2 -.->|"実現する"| HAND["Handoff"]
  P5 -.->|"実現する"| VER["Verification"]
  P6 -.->|"実現する"| PERS["Persistence"]
  P1 -.->|"実現する"| SCHED["Scheduling"]
  style P1 fill:#3498db,color:#fff
  style P2 fill:#8e44ad,color:#fff
  style P3 fill:#27ae60,color:#fff
  style P4 fill:#e67e22,color:#fff
  style P5 fill:#e74c3c,color:#fff
  style P6 fill:#f39c12,color:#fff`,
  diag7: `flowchart LR
  subgraph BAD["❌ 自己採点（避けるべき）"]
    direction TB
    B1["同じエージェントが<br />コードを書く"] --> B2["同じエージェントが<br />『これで合格』と判定する"]
    B2 -.->|"経験則：<br />自分の仕事を高評価しがち"| B3["⚠️ 品質が保証されない"]
  end
  subgraph GOOD["✅ Generator / Verifier分離（推奨）"]
    direction TB
    G1["Generator：<br />コードを書くエージェント"] --> G2["Verifier：<br />独立した別のエージェント<br />またはテストスイートが判定"]
    G2 --> G3{"合格？"}
    G3 -->|"No：理由を添えて差し戻す"| G1
    G3 -->|"Yes"| G4["✅ 次の工程へ進む"]
  end
  style BAD fill:#fde8e8
  style GOOD fill:#e8fde8
  style B3 fill:#e74c3c,color:#fff
  style G4 fill:#27ae60,color:#fff`,
  diag8: `flowchart TD
  START(["開始"]) --> READ["PROMPT.md を読み込む"]
  READ --> RUN["エージェントが1セッション実行<br />（TODOリストから最重要タスクを1つだけ選ぶ）"]
  RUN --> RESULT{"タスク完了？<br />あるいは脱線？"}
  RESULT -->|"完了・継続"| WRITE["結果をファイルに書き出す<br />（コード・ログ・新しいTODO）"]
  WRITE --> READ
  RESULT -->|"TODOが尽きた"| REGEN["新しいTODOリストを<br />生成させる指示を出す"]
  REGEN --> READ
  RESULT -->|"人間が介入すべき異常"| HUMAN(["🧑 人間が観察・チューニング"])
  HUMAN --> READ
  style START fill:#3498db,color:#fff
  style HUMAN fill:#e74c3c,color:#fff`,
};

function _Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer external">
      {children}
    </a>
  );
}

export default function Page() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>
            <span className={styles.dot} />
            Beginner Guide · 2026年7月時点
          </span>
          <h1 className={styles.title}>
            Loop Engineering
            <br />
            完全ガイド ―
            <br />
            <span className={styles.accent}>プロンプトを書く人</span>から
            <br />
            <span className={styles.accent}>ループを設計する人</span>へ
          </h1>
          <p className={styles.lead}>
            Boris Cherny氏（Claude Code開発者）、Peter Steinberger氏（OpenClaw開発者）、Andrew
            Ng氏らの発言をもとに、AIエージェントを自律的に反復させる「Loop
            Engineering」を初学者向けにステップバイステップで解説します。
          </p>
          <div className={styles.heroMeta}>
            <span>読了目安：40〜55分</span>
            <span>図解：Mermaid使用 / ASCII図禁止</span>
            <span>出典：全項目にURL明記</span>
          </div>
        </div>
      </header>

      <div className={styles.notice}>
        <strong>📅 本ガイドについて：</strong> 「Loop
        Engineering（ループエンジニアリング）」は2026年6月頃にSNS上で急速に広まったばかりの新しい概念です。本ガイドはBoris
        Cherny氏、Peter Steinberger氏、Addy Osmani氏（Google Chromeエンジニア）、Andrew
        Ng氏らの公開発言・記事をもとに、2026年7月時点の情報でまとめています。用語も実践も生まれたばかりで今後変化する可能性が高いため、実装する際は各ツールの公式ドキュメントを必ず確認してください。
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav className={styles.toc} aria-label="目次">
            <h2>Contents</h2>
            <ol>
              <li>
                <a href="#s1" className={styles.tocLink}>
                  なぜ今「Loop Engineering」なのか
                </a>
              </li>
              <li>
                <a href="#s2" className={styles.tocLink}>
                  用語の系譜：Prompt→Context→Harness→Loop
                </a>
              </li>
              <li>
                <a href="#s3" className={styles.tocLink}>
                  Loop Engineeringとは何か（定義）
                </a>
              </li>
              <li>
                <a href="#s4" className={styles.tocLink}>
                  Andrew Ngの3つの入れ子ループ
                </a>
              </li>
              <li>
                <a href="#s5" className={styles.tocLink}>
                  ループの解剖学：5つの動き
                </a>
              </li>
              <li>
                <a href="#s6" className={styles.tocLink}>
                  ループを支える6つの部品
                </a>
              </li>
              <li>
                <a href="#s7" className={styles.tocLink}>
                  心臓部：GeneratorとVerifierの分離
                </a>
              </li>
              <li>
                <a href="#s8" className={styles.tocLink}>
                  原点：Ralph Wiggumテクニック
                </a>
              </li>
              <li>
                <a href="#s9" className={styles.tocLink}>
                  ステップバイステップ実践ガイド
                </a>
              </li>
              <li>
                <a href="#s10" className={styles.tocLink}>
                  具体例：朝のCIトリアージ・ループ
                </a>
              </li>
              <li>
                <a href="#s11" className={styles.tocLink}>
                  Claude Codeで実際に組む
                </a>
              </li>
              <li>
                <a href="#s12" className={styles.tocLink}>
                  リスクと注意点
                </a>
              </li>
              <li>
                <a href="#s13" className={styles.tocLink}>
                  成熟度モデルと健全性チェック
                </a>
              </li>
              <li>
                <a href="#s14" className={styles.tocLink}>
                  まとめ
                </a>
              </li>
              <li>
                <a href="#s15" className={styles.tocLink}>
                  参考文献・出典一覧
                </a>
              </li>
            </ol>
          </nav>
        </aside>

        <main id="main-content" className={styles.mainContent}>
          {/* ============ 1 ============ */}
          <section className="chapter block" id="s1">
            <div className={styles.kicker}>01 / Introduction</div>
            <h2>なぜ今「Loop Engineering」なのか</h2>

            <h3>1.1　発端になった2つの発言</h3>
            <p>
              2026年6月, 開発者向けSNS（X/Twitter）で「Loop
              Engineering」という言葉が一気に広まりました。きっかけは主に2人の発言です。
            </p>
            <ul>
              <li>
                <strong>Boris Cherny氏</strong>（AnthropicのClaude
                Code開発者）は、自分はもうClaudeに直接プロンプトを書いておらず、「ループ」を仕込んでおいて、それがClaudeに何をすべきか指示している、と語りました。彼はこの変化を、ソースコードからエージェントへの転換と同じくらい大きな一歩だと表現しています
                <sup>
                  <a href="#ref1">[1]</a>
                  <a href="#ref2">[2]</a>
                </sup>
                。
              </li>
              <li>
                <strong>Peter Steinberger氏</strong>
                （個人アシスタントプロジェクトOpenClawの開発者）も同様に、もうコーディングエージェントに手でプロンプトを打つのはやめて、エージェントにプロンプトを送り続ける「ループ」自体を設計すべきだ、と投稿しました
                <sup>
                  <a href="#ref3">[3]</a>
                </sup>
                。
              </li>
            </ul>
            <p>
              この2つの発言がバズった直後、Google Chromeのエンジニアである
              <strong>Addy Osmani氏</strong>が2026年6月7日に自身のブログで「Loop
              Engineering」という言葉を正式に定義し、体系化しました
              <sup>
                <a href="#ref4">[4]</a>
                <a href="#ref5">[5]</a>
              </sup>
              。さらに著名なAI研究者<strong>Andrew Ng氏</strong>が自身のニュースレター「The
              Batch」でこの流れを取り上げ、ソフトウェアづくり全体を貫く3つの入れ子のループとして整理しています
              <sup>
                <a href="#ref6">[6]</a>
                <a href="#ref7">[7]</a>
              </sup>
              。
            </p>

            <h3>1.2　何が変わったのか：一言でいうと</h3>
            <figure className={styles.diagram}>
              <div id="diag-1" className={styles.mermaidContainer}>
                <MermaidDiagram chart={DIAGRAMS.diag1} id="diag-1" />
              </div>
              <figcaption>
                図1：人間主導のプロンプトループ vs システム主導 of Loop Engineering
              </figcaption>
            </figure>

            <p>
              これまでの「プロンプトエンジニアリング」は、<strong>人間自身がループの一部</strong>
              でした。プロンプトを書く→結果を見る→次のプロンプトを書く、を延々と繰り返すのは人間の仕事だったのです。一日に人間が処理できるタスク量には限界があります。
            </p>
            <p>
              Loop Engineeringでは、<strong>その繰り返し処理自体をシステムに任せます</strong>
              。人間はもう「実行者」ではなく、「その繰り返しの仕組み（ループ）を設計するアーキテクト」になる、という立場の転換です
              <sup>
                <a href="#ref4">[4]</a>
              </sup>
              。
            </p>

            <div className={`${styles.callout} ${styles.tip}`}>
              これまでは「毎回自分でオーブンのタイマーをセットし、焼け具合を見て、次に何度で何分焼くか毎回自分で決めていた」状態でした。Loop
              Engineeringは「センサー付きの全自動オーブンを設計する」ことに相当します。人間はもう鍋の前に立ち続ける必要はなく、「どんな温度で焼き上がったら合格か」というレシピ（検証基準）を設計する役に回ります。
            </div>

            <h3>1.3　なぜ今可能になったのか</h3>
            <p>
              2025年後半から2026年にかけて、コーディングエージェント（Claude
              Codeなど）が数十分〜数時間単位でタスクを自律的に継続できるようになりました。Andrew
              Ng氏は自身の例として、週末に娘のタイピング練習アプリを作った際、コーディングエージェントがブラウザで動作確認をしながら約1時間ほぼ人手を介さずに作業を続けたと述べています
              <sup>
                <a href="#ref6">[6]</a>
              </sup>
              。
            </p>
            <p>
              ボトルネックが「モデルの性能」から「その性能をどう繰り返し使わせるかという設計」へ移った、というのがLoop
              Engineeringが生まれた背景です
              <sup>
                <a href="#ref8">[8]</a>
              </sup>
              。
            </p>
          </section>

          {/* ============ 2 ============ */}
          <section className="chapter block" id="s2">
            <div className={styles.kicker}>02 / Terminology</div>
            <h2>用語の系譜：Prompt → Context → Harness → Loop</h2>
            <p>
              Addy Osmani氏はLoop
              Engineeringを、これまでの「〇〇エンジニアリング」の系譜の上に位置づけています
              <sup>
                <a href="#ref4">[4]</a>
                <a href="#ref9">[9]</a>
              </sup>
              。
            </p>

            <figure className={styles.diagram}>
              <div id="diag-2" className={styles.mermaidContainer}>
                <MermaidDiagram chart={DIAGRAMS.diag2} id="diag-2" />
              </div>
              <figcaption>図2：4層に積み重なるエンジニアリングの系譜</figcaption>
            </figure>

            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>層</th>
                    <th>問いかけ</th>
                    <th>人間の立ち位置</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>①</td>
                    <td>Prompt Engineering</td>
                    <td>何と言えばAIは動くか？</td>
                    <td>キーボードの前に座り、一言ずつ命令する</td>
                  </tr>
                  <tr>
                    <td>②</td>
                    <td>Context Engineering</td>
                    <td>何を見せればAIは正しく判断できるか？</td>
                    <td>背景情報・資料を用意する</td>
                  </tr>
                  <tr>
                    <td>③</td>
                    <td>Harness Engineering</td>
                    <td>どんな道具・権限を与えればAIは実行できるか？</td>
                    <td>ツールと実行環境を組み立てる</td>
                  </tr>
                  <tr>
                    <td>④</td>
                    <td>
                      <strong>Loop Engineering</strong>
                    </td>
                    <td>いつ・どのくらいの頻度で・どう検証しながら繰り返すか？</td>
                    <td>
                      <strong>仕組み（ループ）そのものを設計する</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              大事なポイントは、
              <strong>下位の層（Prompt / Context / Harness）が不要になるわけではない</strong>
              ということです。雑なプロンプトはループの中でも雑な結果しか生みません。Loop
              Engineeringは、それらすべての層を「自動的に何度も回すための制御構造」を新たに追加するものです
              <sup>
                <a href="#ref9">[9]</a>
              </sup>
              。
            </p>
          </section>

          {/* ============ 3 ============ */}
          <section className="chapter block" id="s3">
            <div className={styles.kicker}>03 / Definition</div>
            <h2>Loop Engineeringとは何か（定義）</h2>
            <p>
              Addy Osmani氏の定義をそのまま要約すると、Loop Engineeringとは
              <strong>
                「あなた自身がエージェントにプロンプトを送る役目をやめ、代わりにその役目を担うシステムを設計すること」
              </strong>
              です
              <sup>
                <a href="#ref4">[4]</a>
                <a href="#ref10">[10]</a>
              </sup>
              。
            </p>

            <p>もう少し噛み砕くと：</p>
            <div className={`${styles.callout} ${styles.quote}`}>
              <strong>
                ループ（loop）＝
                目的（ゴール）を1つ定義し、AIがそれを達成するまで自律的に反復し続ける仕組み
              </strong>
            </div>

            <figure className={styles.diagram}>
              <div id="diag-3" className={styles.mermaidContainer}>
                <MermaidDiagram chart={DIAGRAMS.diag3} id="diag-3" />
              </div>
              <figcaption>図3：ループの最小構造 ―「実行→確認→合否判定→停止」</figcaption>
            </figure>

            <p>
              海外の開発者コミュニティでは、この考え方を一言で「
              <strong>検証（チェック）のないタスクはただの願望にすぎない</strong>
              」と表現することもあります
              <sup>
                <a href="#ref11">[11]</a>
              </sup>
              。ループの価値のほぼ半分は「うまく繰り返す設計」にあり、残り半分は「ノーと言える仕組み（検証）」にある、と指摘されています
              <sup>
                <a href="#ref12">[12]</a>
              </sup>
              。
            </p>

            <h3>3.1　プロンプトエンジニアリングとの違い</h3>
            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>プロンプトエンジニアリング</th>
                    <th>Loop Engineering</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>人間の役割</td>
                    <td>毎回プロンプトを打つ実行者</td>
                    <td>ループを設計するアーキテクト</td>
                  </tr>
                  <tr>
                    <td>繰り返しの主体</td>
                    <td>人間</td>
                    <td>システム（自動化）</td>
                  </tr>
                  <tr>
                    <td>対応できる作業時間</td>
                    <td>人が張り付いている間だけ</td>
                    <td>24時間365日（人が寝ていても）</td>
                  </tr>
                  <tr>
                    <td>品質保証の方法</td>
                    <td>人間が目で見て確認</td>
                    <td>独立した検証ステップ（Verifier）が判定</td>
                  </tr>
                  <tr>
                    <td>典型的な失敗</td>
                    <td>疲れて雑になる、抜け漏れ</td>
                    <td>検証が甘いまま暴走し、コストだけ膨らむ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ============ 4 ============ */}
          <section className="chapter block" id="s4">
            <div className={styles.kicker}>04 / The Three Loops</div>
            <h2>Andrew Ngの3つの入れ子ループ</h2>
            <p>
              Andrew Ng氏は、Loop
              Engineeringという言葉が指す「1つのループ」だけでなく、それを包み込むもっと大きな2つのループも含めて、
              <strong>0→1でプロダクトを作るときの3つのループ</strong>として整理しました
              <sup>
                <a href="#ref6">[6]</a>
                <a href="#ref7">[7]</a>
              </sup>
              。それぞれ回転速度（サイクルタイム）が異なります。
            </p>

            <figure className={styles.diagram}>
              <div id="diag-4" className={styles.mermaidContainer}>
                <MermaidDiagram chart={DIAGRAMS.diag4} id="diag-4" />
              </div>
              <figcaption>図4：3つの入れ子ループ（Andrew Ng, The Batch）</figcaption>
            </figure>

            <h3>4.1　各ループの詳細</h3>
            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>ループ</th>
                    <th>誰が回すか</th>
                    <th>周期</th>
                    <th>何をするか</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>① エージェンティック・コーディングループ</td>
                    <td>AIエージェント</td>
                    <td>数分〜数十分ごと</td>
                    <td>
                      仕様書と評価データ（evals）をもとに、コードを書く→自分でテストする→仕様を満たすまで繰り返す
                      <sup>
                        <a href="#ref6">[6]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>② 開発者フィードバックループ</td>
                    <td>人間（開発者）</td>
                    <td>数十分〜数時間</td>
                    <td>
                      出来上がったプロダクトを見て、エージェントの向かう方向を調整する。Ng氏はこれを「人間が持つコンテキストの優位性」と表現しています
                      <sup>
                        <a href="#ref6">[6]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>③ 外部フィードバックループ</td>
                    <td>ユーザー・市場</td>
                    <td>数時間〜数週間</td>
                    <td>
                      友人へのヒアリング、アルファテスト、A/Bテスト、本番運用でのフィードバックを集める
                      <sup>
                        <a href="#ref6">[6]</a>
                      </sup>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Ng氏が強調しているのは、②の「開発者フィードバックループ」を自動化しきれない理由です。人間がAIの知らない情報（顧客の声、業界の常識、暗黙のセンス）を持っている限り、それをシステムに注入するために人間がループの中に残り続ける必要がある、という論点です
              <sup>
                <a href="#ref6">[6]</a>
              </sup>
              。俗に「センス（taste）」と呼ばれるこの人間の貢献を、Ng氏は「コンテキストの優位性」と呼び変えることで、AIをどう改善すればよいかの手がかりにできると説明しています。
            </p>

            <h3>4.2　「Loop Engineering」が指しているのはどのループ？</h3>
            <p>
              Boris Cherny氏やPeter Steinberger氏が話題にした「Loop Engineering」は、上記のうち主に
              <strong>①エージェンティック・コーディングループ</strong>
              、つまり最も内側の高速なループを自動化する技術を指しています
              <sup>
                <a href="#ref10">[10]</a>
                <a href="#ref13">[13]</a>
              </sup>
              。本ガイドの残りの章では、この①のループをどう設計・実装するかに焦点を当てます。
            </p>
          </section>
          {/* ============ 5 ============ */}
          <section className="chapter block" id="s5">
            <div className={styles.kicker}>05 / Anatomy</div>
            <h2>ループの解剖学：1ターンを構成する5つの動き</h2>
            <p>
              Addy Osmani氏はループの1回転（1ターン）を、次の<strong>5つの動き（moves）</strong>
              に分解しています
              <sup>
                <a href="#ref4">[4]</a>
                <a href="#ref5">[5]</a>
                <a href="#ref14">[14]</a>
              </sup>
              。
            </p>

            <figure className={styles.diagram}>
              <div id="diag-5" className={styles.mermaidContainer}>
                <MermaidDiagram chart={DIAGRAMS.diag5} id="diag-5" />
              </div>
              <figcaption>図5：ループの1ターンを構成する5つの動き</figcaption>
            </figure>

            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>動き</th>
                    <th>説明</th>
                    <th>具体例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Discovery（発見）</td>
                    <td>「今どのタスクをやるべきか」を人間ではなくシステムが判断する</td>
                    <td>
                      昨日のCI失敗ログ、放置されているissue、直近のコミットを読んで優先順位をつける
                      <sup>
                        <a href="#ref14">[14]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Handoff（引き渡し）</td>
                    <td>見つけたタスクを独立した実行環境に渡し、他の作業に干渉させない</td>
                    <td>
                      git worktreeで別の作業ディレクトリを切り、複数エージェントを並行実行する
                      <sup>
                        <a href="#ref15">[15]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Verification（検証）</td>
                    <td>成果物が「完了」の基準を満たしているかどうかを判定する</td>
                    <td>
                      別のエージェント（レビュー役）やテストスイートが結果を採点する。最も見落とされやすい工程
                      <sup>
                        <a href="#ref14">[14]</a>
                        <a href="#ref16">[16]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Persistence（永続化）</td>
                    <td>会話（コンテキストウィンドウ）の外側に進捗を書き残す</td>
                    <td>
                      Markdownファイル、Linearボード、SQLite、TODO.mdなど
                      <sup>
                        <a href="#ref17">[17]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Scheduling（スケジューリング）</td>
                    <td>一定間隔・条件でループを自動起動する</td>
                    <td>
                      cronジョブ、GitHub Actions、Claude Codeの <code>/loop</code> や{" "}
                      <code>/schedule</code>
                      <sup>
                        <a href="#ref18">[18]</a>
                      </sup>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Osmani氏の実例では、朝になると自動でトリアージのタスクが起動し、昨日失敗したCIテストや未解決のissue、最近のコミットを読んで対応すべき項目をMarkdownやLinearボードに書き出し、対応が必要なものごとに独立したworktreeを立て、1体のエージェントが修正案を作り、別のエージェントがプロジェクトのルールとテストに照らしてレビューし、コネクタが自動でプルリクエストを開いてチケットを更新する、という流れが紹介されています。人間の手が必要なものだけ受信箱に残り、翌日はその続きから再開できるよう状態ファイルが保持されます
              <sup>
                <a href="#ref14">[14]</a>
              </sup>
              。
            </p>
          </section>

          {/* ============ 6 ============ */}
          <section className="chapter block" id="s6">
            <div className={styles.kicker}>06 / Building Blocks</div>
            <h2>ループを支える6つの部品</h2>
            <p>
              「5つの動き」が<strong>何が起きるか</strong>
              だとすれば、それを実現するために手元に必要な<strong>6つの部品（parts）</strong>
              があります
              <sup>
                <a href="#ref14">[14]</a>
                <a href="#ref19">[19]</a>
              </sup>
              。
            </p>

            <figure className={styles.diagram}>
              <div id="diag-6" className={styles.mermaidContainer}>
                <MermaidDiagram chart={DIAGRAMS.diag6} id="diag-6" />
              </div>
              <figcaption>図6：ループを支える6つの部品と5つの動きの対応</figcaption>
            </figure>

            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>部品</th>
                    <th>役割</th>
                    <th>もし無かったら</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Automations（自動起動）</td>
                    <td>決まったスケジュールやトリガーでループを起き上がらせる</td>
                    <td>
                      「一度きり実行した記録」であり、ループとは呼べない
                      <sup>
                        <a href="#ref14">[14]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Worktrees（作業木）</td>
                    <td>
                      Gitの機能を使い、1つのリポジトリに複数の独立した作業ディレクトリを用意する
                    </td>
                    <td>
                      並行して動く複数のエージェントが同じファイルを取り合い、状態が壊れる
                      <sup>
                        <a href="#ref14">[14]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Skills（スキル）</td>
                    <td>プロジェクト固有の知識・手順を、必要なときだけ読み込む形でまとめておく</td>
                    <td>
                      エージェントが毎回推測に頼り、判断がぶれる
                      <sup>
                        <a href="#ref9">[9]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Plugins / Connectors（連携）</td>
                    <td>Linear、Slack、GitHubなど既存ツールと繋ぐ</td>
                    <td>
                      発見した課題や成果物を人間の使う場所に届けられない
                      <sup>
                        <a href="#ref19">[19]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Sub-agents（サブエージェント）</td>
                    <td>「作る役」と「確認する役」を別のエージェント・別のモデルに分ける</td>
                    <td>
                      自分の仕事を自分で採点することになり、自己満足の評価になりやすい
                      <sup>
                        <a href="#ref19">[19]</a>
                        <a href="#ref20">[20]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Memory（外部記憶）</td>
                    <td>会話の外（ファイル・DB・チケット管理ツールなど）に状態を保存する</td>
                    <td>
                      モデルは実行と実行の間の記憶を持たないため、前回何をしたか分からず同じ作業を繰り返したり、逆に必要な作業を見落としたりする
                      <sup>
                        <a href="#ref17">[17]</a>
                      </sup>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.callout} ${styles.quote}`}>
              ある開発者が構築したブログ記事提案の自動ループは、前日に何を提案したか記録していなかったために、3日連続で同じテーマの記事を提案し続けてしまいました。「昨日までの提案一覧」をMarkdownファイルに書き出し、提案前にそれを検索して重複を除く処理を1行加えただけで、問題は即座に解決したと報告されています
              <sup>
                <a href="#ref17">[17]</a>
              </sup>
              。<strong>状態はプロンプトの中ではなく、ループの外側に置く</strong>
              というのが得られた教訓です。
            </div>
          </section>
          {/* ============ 7 ============ */}
          <section className="chapter block" id="s7">
            <div className={styles.kicker}>07 / Core Discipline</div>
            <h2>心臓部：GeneratorとVerifierの分離</h2>
            <p>
              Loop Engineeringに関する複数の技術解説が共通して強調しているのが、
              <strong>「作る役（Generator）」と「確認する役（Verifier）」を分ける</strong>
              という原則です
              <sup>
                <a href="#ref16">[16]</a>
                <a href="#ref20">[20]</a>
              </sup>
              。
            </p>

            <figure className={styles.diagram}>
              <div id="diag-7" className={styles.mermaidContainer}>
                <MermaidDiagram chart={DIAGRAMS.diag7} id="diag-7" />
              </div>
              <figcaption>図7：自己採点の危険性とGenerator/Verifier分離</figcaption>
            </figure>

            <p>
              複数の解説記事が指摘している経験則は、
              <strong>AIエージェントは自分自身の成果物を採点させると、甘く評価しがちである</strong>
              という点です
              <sup>
                <a href="#ref16">[16]</a>
              </sup>
              。そのため、生成モデル自身に「批判的になれ」と指示するよりも、
              <strong>
                独立した懐疑的な評価者（Verifier）を別途チューニングするほうがはるかに扱いやすい
              </strong>
              とされています
              <sup>
                <a href="#ref16">[16]</a>
              </sup>
              。
            </p>

            <p>
              Claude Codeの <code>/goal</code>{" "}
              コマンドも同じ発想で設計されており、タスクの完了判定を実行担当のモデル自身にさせるのではなく、まっさらな別のモデルインスタンスに判定させる、という「作る側」と「確認する側」を分離する仕組みになっています
              <sup>
                <a href="#ref19">[19]</a>
              </sup>
              。
            </p>

            <h3>7.1　Verifierに使える具体的な手段</h3>
            <p>
              Verifier（検証役）は必ずしもAIである必要はありません。むしろ
              <strong>決定論的で機械的に判定できる手段ほど信頼性が高くなります</strong>。
            </p>

            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>Verifierの種類</th>
                    <th>具体例</th>
                    <th>信頼性</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>自動テスト（ユニット・統合・E2E）</td>
                    <td>pytest, Jest, Playwright</td>
                    <td>🟢 高い（決定論的）</td>
                  </tr>
                  <tr>
                    <td>静的解析・型チェック</td>
                    <td>ESLint, mypy, TypeScriptコンパイラ</td>
                    <td>🟢 高い</td>
                  </tr>
                  <tr>
                    <td>ビルド／CI パイプライン</td>
                    <td>GitHub Actionsのビルド結果</td>
                    <td>🟢 高い</td>
                  </tr>
                  <tr>
                    <td>独立したレビューエージェント（別モデル・別プロンプト）</td>
                    <td>code-reviewerサブエージェント</td>
                    <td>🟡 中程度（AI判定なので過信は禁物）</td>
                  </tr>
                  <tr>
                    <td>生成した本人のエージェントによる自己申告</td>
                    <td>「テストは通りました」という自己申告のみ</td>
                    <td>🔴 低い（避けるべき）</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              ここで、ソフトウェアテストの世界で長く使われてきた<strong>テストピラミッド</strong>
              の考え方が活きてきます。Martin
              Fowler氏が2012年に紹介したこの考え方は、実行が速く安定した
              <strong>
                ユニットテストを土台に厚く積み、E2Eテストのような広く遅いテストは少数に絞る
              </strong>
              というものです
              <sup>
                <a href="#ref21">[21]</a>
                <a href="#ref22">[22]</a>
              </sup>
              。AIエージェントが自分の書いたコードを大量に生成する時代でも、この土台となる考え方は変わりません。むしろAIが書いたコード量が増えるほど、高速で信頼できる自動テストという「安全網」の重要性は増しています
              <sup>
                <a href="#ref23">[23]</a>
              </sup>
              。
            </p>

            <p>
              なお、Martin
              Fowler氏自身も、LLMが「テストを削除・スキップすることでチェックを緑にしてしまう」ことがあると注意を促しています
              <sup>
                <a href="#ref24">[24]</a>
              </sup>
              。Verifierを設計する際は、
              <strong>
                テストの本数や見かけ上のカバレッジだけでなく、そのテストが本当にバグを検出できるかどうか
              </strong>
              まで意識する必要があります。
            </p>
          </section>

          {/* ============ 8 ============ */}
          <section className="chapter block" id="s8">
            <div className={styles.kicker}>08 / Origins</div>
            <h2>原点：Ralph Wiggumテクニック</h2>
            <p>
              Loop Engineeringという言葉が生まれる約1年前、2025年半ばにソフトウェアエンジニアの
              <strong>Geoffrey Huntley氏</strong>が、ループの原始的な実装として「
              <strong>Ralph（Ralph Wiggumテクニック）</strong>」を発表していました
              <sup>
                <a href="#ref25">[25]</a>
                <a href="#ref26">[26]</a>
              </sup>
              。名前はアニメ『ザ・シンプソンズ』に登場する、憎めないが不器用なキャラクターに由来します。
            </p>

            <h3>8.1　仕組みはたった1行のbashループ</h3>
            <div className={styles.codeWrap}>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.cc}># Ralphの核となる考え方（概念コード）</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>while</span>
                  <span> :; </span>
                  <span className={styles.ck}>do</span>
                </div>
                <div className={styles.codeLine}>
                  <span> cat PROMPT.md | npx --yes @your-favorite-coding-agent</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>done</span>
                </div>
              </div>
            </div>

            <p>
              このループは、1つの固定されたプロンプトファイル（<code>PROMPT.md</code>
              ）を繰り返しエージェントに読み込ませ、セッションが終わるたびに新しいセッションを即座に立ち上げます。前回のセッションで得られたエラーやログも次の回に引き継がれ、ディスク上のファイルを通じて作業が続いていきます
              <sup>
                <a href="#ref27">[27]</a>
              </sup>
              。
            </p>

            <figure className={styles.diagram}>
              <div id="diag-8" className={styles.mermaidContainer}>
                <MermaidDiagram chart={DIAGRAMS.diag8} id="diag-8" />
              </div>
              <figcaption>図8：Ralph Wiggumループの動作フロー</figcaption>
            </figure>

            <h3>8.2　Ralphから学べる大事な教訓</h3>
            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>教訓</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1ループ1タスク</td>
                    <td>
                      複雑な多段階計画を事前に立てさせるより、「最も重要なタスクを1つだけ選んで実行する」ほうがコンテキストの消費を抑えられ、モデルは元々タスクの優先順位付けが得意だとHuntley氏は述べています
                      <sup>
                        <a href="#ref28">[28]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>人間はループの中ではなく上に座る</td>
                    <td>
                      人間の仕事は自分でコードを書くことではなく、Ralphが成功するための環境・プロンプト・ガードレールを整えることに変わる
                      <sup>
                        <a href="#ref29">[29]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>プロンプトはギターのように調律する</td>
                    <td>
                      失敗パターンを観察し、都度プロンプトに「注意書き」を追加していく。最初から完璧なプロンプトは存在しないという前提に立つ
                      <sup>
                        <a href="#ref29">[29]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>コンテキストの圧縮（compaction）を警戒する</td>
                    <td>
                      コンテキストウィンドウが埋まってくると自動的に古い情報が圧縮・破棄される。重要な仕様がここで失われると、エージェントは自分の要約に頼るしかなくなり、目的からずれていく
                      <sup>
                        <a href="#ref30">[30]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>向いている作業と向いていない作業がある</td>
                    <td>
                      依存関係の一括移行や大規模リファクタリングなど、プログラム的に進捗と完了を検証できる作業には向く。UI/UXや曖昧な要件を含む作業では、進捗と正しさを継続的な人間の入力なしに定義しにくい
                      <sup>
                        <a href="#ref30">[30]</a>
                      </sup>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              2026年に入り、Anthropicのエンジニアがこの技術を公式のClaude
              Codeプラグイン「ralph-wiggum」として整備しました。外部のbashループの代わりに、Claude
              Codeのセッション終了を止める「stop hook」という仕組みを使い、<code>/ralph-loop</code>{" "}
              のようなスラッシュコマンドで起動できるようになっています
              <sup>
                <a href="#ref31">[31]</a>
              </sup>
              。ただし考案者のHuntley氏自身は、公式プラグイン化によって「操作を放置しても大丈夫な製品」だと誤解されるリスクに注意を促しており、LLMはあくまで「操作者のスキルを増幅する道具」であり、ただ起動して放置するだけではうまくいかないと述べています
              <sup>
                <a href="#ref32">[32]</a>
              </sup>
              。
            </p>
          </section>
          <section className="chapter block" id="s9" style={{ display: "none" }} />
          <section className="chapter block" id="s10" style={{ display: "none" }} />
          <section className="chapter block" id="s11" style={{ display: "none" }} />
          <section className="chapter block" id="s12" style={{ display: "none" }} />
          <section className="chapter block" id="s13" style={{ display: "none" }} />
          <section className="chapter block" id="s14" style={{ display: "none" }} />
          <section className="chapter block" id="s15" style={{ display: "none" }} />
        </main>
      </div>
    </div>
  );
}
