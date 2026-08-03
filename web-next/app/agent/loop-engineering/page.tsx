import SharedMermaidDiagram from "@/components/docs/MermaidDiagram";
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
  style A fill:#546e7a,color:#fff
  style B fill:#1565c0,color:#fff
  style C fill:#a64b00,color:#fff
  style D fill:#c62828,color:#fff`,
  diag3: `flowchart LR
  GOAL(["🎯 ゴール／仕様を定義する<br />（人間の仕事）"]) --> LOOP
  subgraph LOOP["🔁 ループ（自動で回り続ける）"]
    direction TB
    DO["実行する"] --> CHECK["結果を確認する"]
    CHECK --> DECIDE{"合格？"}
    DECIDE -->|"No：やり直す"| DO
    DECIDE -->|"Yes：完了"| STOP(["✅ 停止する"])
  end
  style GOAL fill:#1565c0,color:#fff
  style STOP fill:#1b5e20,color:#fff
  style DECIDE fill:#8a5a00,color:#fff`,
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
  style D fill:#1565c0,color:#fff
  style H fill:#6a1b9a,color:#fff
  style V fill:#c62828,color:#fff
  style P fill:#1b5e20,color:#fff
  style S fill:#8a5a00,color:#fff`,
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
  style P1 fill:#1565c0,color:#fff
  style P2 fill:#6a1b9a,color:#fff
  style P3 fill:#1b5e20,color:#fff
  style P4 fill:#a64b00,color:#fff
  style P5 fill:#c62828,color:#fff
  style P6 fill:#8a5a00,color:#fff`,
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
  style B3 fill:#c62828,color:#fff
  style G4 fill:#1b5e20,color:#fff`,
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
  style START fill:#1565c0,color:#fff
  style HUMAN fill:#c62828,color:#fff`,
  diag9: `flowchart TD
  S1["Step 1<br />検証可能なタスクを選ぶ"] --> S2["Step 2<br />『完了』の基準を決める"]
  S2 --> S3["Step 3<br />Verifierを設計する"]
  S3 --> S4["Step 4<br />状態(Memory)を外部化する"]
  S4 --> S5["Step 5<br />並列化のためのSandbox/Worktreeを用意する"]
  S5 --> S6["Step 6<br />スケジューリングで自動化する"]
  S6 --> S7["Step 7<br />観察・チューニング・コスト管理をする"]
  S7 -->|"改善を反映"| S1
  style S1 fill:#1565c0,color:#fff
  style S2 fill:#6a1b9a,color:#fff
  style S3 fill:#c62828,color:#fff
  style S4 fill:#1b5e20,color:#fff
  style S5 fill:#a64b00,color:#fff
  style S6 fill:#8a5a00,color:#fff
  style S7 fill:#00796b,color:#fff`,
  diag10: `graph TD
  STOP["🛑 停止条件を3種類用意する"]
  STOP --> C1["① 成功条件<br />仕様を満たし、テストが全て通った"]
  STOP --> C2["② 上限条件<br />最大イテレーション回数・最大予算に達した"]
  STOP --> C3["③ 異常検知条件<br />同じ失敗を繰り返している（無進捗）"]
  style C1 fill:#1b5e20,color:#fff
  style C2 fill:#8a5a00,color:#fff
  style C3 fill:#c62828,color:#fff`,
  diag11: `graph TD
  TRIAGE["トリアージ結果<br />（複数の要修正項目）"] --> W1["Worktree A<br />（issue #101用）"]
  TRIAGE --> W2["Worktree B<br />（issue #102用）"]
  TRIAGE --> W3["Worktree C<br />（issue #103用）"]
  W1 --> AGENT1["Generatorエージェント"] --> VER1["Verifierエージェント"]
  W2 --> AGENT2["Generatorエージェント"] --> VER2["Verifierエージェント"]
  W3 --> AGENT3["Generatorエージェント"] --> VER3["Verifierエージェント"]
  VER1 --> MERGE["mainブランチへ<br />プルリクエスト"]
  VER2 --> MERGE
  VER3 --> MERGE
  style TRIAGE fill:#2c3e50,color:#fff
  style MERGE fill:#1b5e20,color:#fff`,
  diag12: `sequenceDiagram
  participant CRON as ⏰ スケジューラ
  participant DISC as 🔍 発見エージェント
  participant STATE as 🧠 状態ファイル
  participant WT as 🌳 Worktree
  participant GEN as ✍️ Generatorエージェント
  participant VER as 🕵️ Verifierエージェント
  participant HUMAN as 🧑 人間の受信箱
  CRON->>DISC: 毎朝トリガー
  DISC->>DISC: 昨日のCI失敗ログ・未解決issue・<br />最近のコミットを読む
  DISC->>STATE: 対応候補をMarkdown/Linearに書き出す
  loop 対応候補ごとに
    STATE->>WT: 独立したworktreeを作成
    WT->>GEN: 修正案の作成を依頼
    GEN->>VER: 生成した差分を提出
    VER->>VER: プロジェクトのルール・テストと照合
    alt 合格
      VER->>HUMAN: プルリクエストを自動オープン
    else 不合格
      VER->>GEN: 理由を添えて差し戻す
    else 判断がつかない
      VER->>HUMAN: 受信箱に転送し、人間の判断を待つ
    end
  end
  STATE->>STATE: 状態ファイルを更新（翌日に引き継ぐ）`,
  diag13: `flowchart TD
  RISK["⚠️ Loop Engineeringの主なリスク"]
  RISK --> R1["💸 コストの暴走<br />検証が甘いループはトークン代を<br />静かに、しかし際限なく消費し続ける"]
  RISK --> R2["🧠 認知的な明け渡し<br />『Cognitive Surrender』<br />ループが自動で回るほど、考えるのをやめて<br />結果を鵜呑みにしやすくなる"]
  RISK --> R3["🌀 コンテキストの劣化<br />『Context Rot』<br />圧縮（compaction）で重要な仕様が失われ<br />目的から少しずつずれていく"]
  RISK --> R4["🪞 自己採点バイアス<br />生成モデル自身に判定させると<br />甘い評価になりがち"]
  RISK --> R5["📊 サンプリングバイアス<br />ツールベンダーの成功事例は<br />すでにそのツールを使いこなす人からのデータ"]
  style RISK fill:#2c3e50,color:#fff
  style R1 fill:#c62828,color:#fff
  style R2 fill:#c62828,color:#fff
  style R3 fill:#c62828,color:#fff
  style R4 fill:#c62828,color:#fff
  style R5 fill:#c62828,color:#fff`,
  diag14: `graph TD
  LV0["Level 0：手動プロンプト<br />すべてのやり取りを人間が毎回入力する"]
  LV1["Level 1：単発の自動化<br />1つのタスクをcronで一度だけ自動実行する"]
  LV2["Level 2：検証つきループ<br />Generator/Verifierを分離し、<br />停止条件を明確に設定する"]
  LV3["Level 3：状態の永続化<br />会話の外に状態を保存し、<br />複数回の実行をまたいで文脈を維持する"]
  LV4["Level 4：並列化された複数ループ<br />Worktreeで複数タスクを並行処理し、<br />コストと進捗を継続的に監視する"]
  LV5["Level 5：ループのエコシステム化<br />複数のループが互いに連携し、<br />人間はアーキテクトとして設計・監督に専念する"]
  LV0 --> LV1
  LV1 --> LV2
  LV2 --> LV3
  LV3 --> LV4
  LV4 --> LV5
  style LV0 fill:#c62828,color:#fff
  style LV1 fill:#a64b00,color:#fff
  style LV2 fill:#8a5a00,color:#fff
  style LV3 fill:#1b5e20,color:#fff
  style LV4 fill:#1565c0,color:#fff
  style LV5 fill:#6a1b9a,color:#fff`,
  diag15: `flowchart TD
  CHECK["🔍 ループの健全性チェック"]
  Q1{"停止条件（成功・上限・無進捗）<br />を3種類とも設定しているか？"}
  Q2{"作る役と確認する役は<br />別のプロンプト／モデルに<br />分かれているか？"}
  Q3{"状態は会話の外（ファイル等）に<br />保存されているか？"}
  Q4{"コストを日次・週次で<br />監視できているか？"}
  Q5{"人間へのエスカレーション経路が<br />明確に定義されているか？"}
  FIX1["🔧 max-iterationsと予算上限、<br />無進捗検知を追加する"]
  FIX2["🔧 レビュー専任のサブエージェントを<br />切り出す"]
  FIX3["🔧 TODO.md等の外部ファイルに<br />進捗を書き出す仕組みを追加する"]
  FIX4["🔧 コストダッシュボードを設定し、<br />アラートを仕込む"]
  FIX5["🔧 『人間が判断すべき境界線』を<br />ドキュメント化する"]
  HEALTHY["✅ 健全なループ運用"]
  CHECK --> Q1
  Q1 -->|"No"| FIX1
  Q1 -->|"Yes"| Q2
  Q2 -->|"No"| FIX2
  Q2 -->|"Yes"| Q3
  Q3 -->|"No"| FIX3
  Q3 -->|"Yes"| Q4
  Q4 -->|"No"| FIX4
  Q4 -->|"Yes"| Q5
  Q5 -->|"No"| FIX5
  Q5 -->|"Yes"| HEALTHY
  style HEALTHY fill:#1b5e20,color:#fff
  style FIX1 fill:#1565c0,color:#fff
  style FIX2 fill:#1565c0,color:#fff
  style FIX3 fill:#1565c0,color:#fff
  style FIX4 fill:#1565c0,color:#fff
  style FIX5 fill:#1565c0,color:#fff`,
};

/** Mermaid theme variables matching the legacy HTML (theme: "base"). */
const LOOP_THEME_VARS: Record<string, string> = {
  fontFamily: "IBM Plex Sans JP, IBM Plex Sans, sans-serif",
  fontSize: "16px",
  primaryColor: "#EAF6F4",
  primaryBorderColor: "#0B7A75",
  primaryTextColor: "#12202B",
  lineColor: "#3B4C58",
  secondaryColor: "#FBF0DF",
  tertiaryColor: "#F1EEFB",
};

// flowchartHtmlLabels は常にラッパー側で false に固定するため、呼び出し側から受け取らない。
type MermaidDiagramProps = Readonly<
  Omit<React.ComponentProps<typeof SharedMermaidDiagram>, "flowchartHtmlLabels">
>;

function MermaidDiagram(props: MermaidDiagramProps) {
  return <SharedMermaidDiagram {...props} flowchartHtmlLabels={false} />;
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
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
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag1}
                  id="diag-1"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
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
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag2}
                  id="diag-2"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
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
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag3}
                  id="diag-3"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
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
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag4}
                  id="diag-4"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
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
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag5}
                  id="diag-5"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
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
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag6}
                  id="diag-6"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
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
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag7}
                  id="diag-7"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
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
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag8}
                  id="diag-8"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
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
          {/* ============ 9 ============ */}
          <section className="chapter block" id="s9">
            <div className={styles.kicker}>09 / Practice</div>
            <h2>ステップバイステップ実践ガイド</h2>
            <p>
              ここからは、実際に自分の手でループを組み立てるための手順を、初心者でも迷わないよう順番に解説します。
            </p>

            <figure className={styles.diagram}>
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag9}
                  id="diag-9"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
              </div>
              <figcaption>図9：ループ構築の7ステップ</figcaption>
            </figure>

            <h3>Step 1：検証可能なタスクを選ぶ</h3>
            <p>
              すべてのタスクがループ向きなわけではありません。まずは「機械的に正解・不正解を判定できるタスク」から始めるのが鉄則です。
            </p>
            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>✅ ループ向きなタスク</th>
                    <th>❌ ループ向きでないタスク</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>依存パッケージのバージョン移行</td>
                    <td>まったく新しいUI/UXのデザイン</td>
                  </tr>
                  <tr>
                    <td>型エラー・Lintエラーの一括修正</td>
                    <td>ブランド戦略や事業方針の決定</td>
                  </tr>
                  <tr>
                    <td>CIの失敗しているテストの修正</td>
                    <td>「良い雰囲気」など主観的な評価が必要な作業</td>
                  </tr>
                  <tr>
                    <td>既存パターンに沿ったテストコードの追加</td>
                    <td>一度きりの調査・意思決定</td>
                  </tr>
                  <tr>
                    <td>ドキュメントとコードの同期</td>
                    <td>顧客に直接影響する重大な意思決定</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              判断に迷ったら、「この作業が終わったかどうかを、人間が目視確認せずプログラムだけで判定できるか？」と自問してください。できないなら、まず人間の判断基準を明文化するところから始める必要があります。
            </p>

            <h3>Step 2：「完了」の基準（Stop Condition）を決める</h3>
            <p>
              ループ最大のリスクは「終わり時を決めずに走らせてしまうこと」です。始める前に、必ず次の3種類の停止条件を用意します。
            </p>

            <figure className={styles.diagram}>
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag10}
                  id="diag-10"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
              </div>
              <figcaption>図10：3種類の停止条件</figcaption>
            </figure>

            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>条件の種類</th>
                    <th>設定例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>成功条件</td>
                    <td>
                      「指定したテストスイートがすべてグリーンになる」「仕様書のチェックリストが全項目満たされる」
                    </td>
                  </tr>
                  <tr>
                    <td>上限条件（回数）</td>
                    <td>
                      最大イテレーション回数を指定するオプション（例：
                      <code>--max-iterations 20</code>）
                    </td>
                  </tr>
                  <tr>
                    <td>上限条件（コスト）</td>
                    <td>1日あたり／1ジョブあたり／のドル予算の上限を決めておく</td>
                  </tr>
                  <tr>
                    <td>無進捗検知</td>
                    <td>
                      直近N回のイテレーションで差分（diff）がほぼゼロ、または同じエラーメッセージが繰り返されている場合に停止する
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              「停止条件を決めずにループを回す」ことは、根本的な設計ミスとされています。無人のループが検証の甘いまま走り続けると、失敗は静かに起こり、気づいたときには夜通しトークン代だけが積み上がっている、という指摘があります
              <sup>
                <a href="#ref12">[12]</a>
              </sup>
              。
            </p>

            <h3>Step 3：Verifierを設計する</h3>
            <p>7章で述べたGenerator / Verifier分離の原則を実装レベルで反映します。</p>
            <ol>
              <li>
                <strong>既存の自動テストを土台にする</strong>：ユニットテスト → 統合テスト →
                E2Eテストの順に、実行が速く数が多いものを優先します（テストピラミッドの考え方）
                <sup>
                  <a href="#ref21">[21]</a>
                </sup>
                。
              </li>
              <li>
                <strong>レビュー役のサブエージェントを別途用意する</strong>
                ：コードを書くエージェントとは別のモデル・別のプロンプトで、プロジェクトのルール（コーディング規約やAGENTS.mdなど）に照らしてレビューさせます
                <sup>
                  <a href="#ref19">[19]</a>
                </sup>
                。
              </li>
              <li>
                <strong>人間が確認すべき境界線を明文化する</strong>
                ：「テストが通れば自動マージしてよい変更」と「必ず人間の承認が必要な変更（例：認証まわり、課金まわり、削除操作）」を事前に切り分けます。
              </li>
            </ol>

            <h3>Step 4：状態（Memory）をループの外に置く</h3>
            <p>
              AIモデルは実行と実行の間の記憶を持ちません。前回何をしたか、今何が終わっていて何が残っているかは、
              <strong>会話の外側にある永続的な場所</strong>に書き出す必要があります
              <sup>
                <a href="#ref17">[17]</a>
              </sup>
              。
            </p>
            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>保存先</th>
                    <th>向いている用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>TODO.md</code> / <code>PROGRESS.md</code> などのMarkdownファイル
                    </td>
                    <td>小規模〜中規模のプロジェクト、個人利用</td>
                  </tr>
                  <tr>
                    <td>Linear / Jira などのチケット管理ツール</td>
                    <td>チームで共有する必要がある場合</td>
                  </tr>
                  <tr>
                    <td>SQLite / 軽量DB</td>
                    <td>構造化されたログを蓄積・検索したい場合</td>
                  </tr>
                  <tr>
                    <td>Git のコミット履歴そのもの</td>
                    <td>「何がいつ変わったか」を追いたい場合</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              ここで重要なのは、
              <strong>
                「今日提案する記事は何か」のような判断材料を、システムプロンプトに固定でハードコードしないこと
              </strong>
              です。前述のブログ提案ループの失敗例のように、状態がプロンプトに埋め込まれていると更新が反映されず、重複や矛盾が発生します。エージェントに毎回外部の記憶を実際に読みに行かせる（例：ファイルを
              <code>ls</code>して<code>grep</code>する）ことで、この種の事故を防げます
              <sup>
                <a href="#ref17">[17]</a>
              </sup>
              。
            </p>

            <h3>Step 5：並列化のためのSandbox / Worktreeを用意する</h3>
            <p>
              複数のタスクを同時に処理したい場合、それぞれのエージェントが互いのファイルを壊さないよう、
              <strong>独立した作業環境</strong>を用意します。
            </p>
            <ul>
              <li>
                <strong>Git Worktree</strong>
                ：1つのリポジトリに対して複数の独立した作業ディレクトリを作れるGitの標準機能です。並行して動くエージェントが同じファイルを同時に触って壊す事故を防ぎます
                <sup>
                  <a href="#ref15">[15]</a>
                </sup>
                。
              </li>
              <li>
                <strong>サンドボックス環境</strong>
                ：ファイルシステムやネットワークへのアクセスを制限した隔離環境で実行し、意図しないコマンド実行の被害範囲を限定します。
              </li>
            </ul>

            <figure className={styles.diagram}>
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag11}
                  id="diag-11"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
              </div>
              <figcaption>図11：Worktreeによる並列実行のイメージ</figcaption>
            </figure>

            <h3>Step 6：スケジューリングで自動化する</h3>
            <p>
              ここまでの部品が揃って初めて、「一度きりの実行」が本当の意味での「ループ」になります。トリガーの方法はいくつかあります。
            </p>
            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>方式</th>
                    <th>特徴</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ローカルのcronジョブ</td>
                    <td>シンプルだが、マシンの電源が入っている間しか動かない</td>
                  </tr>
                  <tr>
                    <td>クラウド上のスケジュールタスク</td>
                    <td>マシンを閉じても実行され、再起動をまたいで継続できる</td>
                  </tr>
                  <tr>
                    <td>CI/CD（GitHub Actionsなど）のスケジュールトリガー</td>
                    <td>既存のCI基盤に統合しやすく、チームで共有しやすい</td>
                  </tr>
                  <tr>
                    <td>ツール内蔵のスケジューリング機能</td>
                    <td>
                      Claude Codeの <code>/loop</code>（セッション内の一定間隔実行）や{" "}
                      <code>/schedule</code>（クラウド常駐のcronタスク）など（11章で詳述）
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Step 7：観察・チューニング・コスト管理をする</h3>
            <p>
              ループを起動したら終わりではありません。運用しながら次の観点で継続的に見直します。
            </p>
            <ul>
              <li>
                <strong>失敗パターンの記録</strong>
                ：エージェントが同じ間違いを繰り返す箇所があれば、プロンプトやAGENTS.md／CLAUDE.mdに「注意書き」として追記します（8.2節「ギターの調律」の教訓）。
              </li>
              <li>
                <strong>トークン・コストの監視</strong>
                ：想定外にコストが跳ね上がっていないか、1日単位・1ジョブ単位で確認します（12章のリスクも参照）。
              </li>
              <li>
                <strong>人間へのエスカレーション経路の確認</strong>
                ：ループが自力で解決できなかった項目が、きちんと人間の受信箱（Triage
                Inbox）に届いているかを確認します
                <sup>
                  <a href="#ref14">[14]</a>
                </sup>
                。
              </li>
            </ul>
          </section>

          {/* ============ 10 ============ */}
          <section className="chapter block" id="s10">
            <div className={styles.kicker}>10 / Worked Example</div>
            <h2>具体例で理解する：朝のCIトリアージ・ループ</h2>
            <p>
              Addy
              Osmani氏が紹介している「朝のトリアージ・ループ」の例を、これまでの用語と対応させて整理します
              <sup>
                <a href="#ref14">[14]</a>
              </sup>
              。
            </p>

            <figure className={styles.diagram}>
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag12}
                  id="diag-12"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
              </div>
              <figcaption>図12：朝のCIトリアージ・ループの全体シーケンス</figcaption>
            </figure>

            <p>
              この例からわかる重要なポイントは、
              <strong>「何も見つからなかった実行はそのまま自己完結して終わる」</strong>
              ことです。対応が必要な項目が見つかったときだけ人間の元に届き、それ以外は静かに完了します。人間はループの中に張り付いている必要はありませんが、
              <strong>必要な場所ではきちんと立ち止まって人間を待つ</strong>設計になっています
              <sup>
                <a href="#ref14">[14]</a>
              </sup>
              。
            </p>
          </section>
          {/* ============ 11 ============ */}
          <section className="chapter block" id="s11">
            <div className={styles.kicker}>11 / Implementation</div>
            <h2>Claude Codeで実際に組んでみる</h2>
            <p>
              Loop Engineeringに必要な部品は、2026年前半にかけてClaude Code（Anthropic）やOpenAI
              Codexといった主要なコーディングエージェント製品に標準搭載されるようになりました
              <sup>
                <a href="#ref4">[4]</a>
                <a href="#ref19">[19]</a>
              </sup>
              。ここではClaude Codeを例に、代表的な機能と対応関係を紹介します。
            </p>

            <div className={`${styles.callout} ${styles.warn}`}>
              以下はガイド執筆時点の情報を整理したものです。コマンド名や仕様は更新される可能性が高いため、実装前に必ずClaude
              Codeの公式ドキュメント（
              <Ext href="https://code.claude.com/docs/">https://code.claude.com/docs/</Ext>
              ）を確認してください。
            </div>

            <h3>11.1　主な機能と5つの動きの対応</h3>
            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>Loop Engineeringの動き</th>
                    <th>Claude Codeでの対応機能</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Discovery / Scheduling</td>
                    <td>
                      <code>/loop</code>（セッション内で一定間隔ごとに再実行）、
                      <code>/schedule</code> または <code>claude trigger create</code>
                      （クラウド上のcronタスクとして永続実行）、Hooks（ライフサイクルの特定タイミングでシェルコマンドを発火）
                      <sup>
                        <a href="#ref18">[18]</a>
                        <a href="#ref33">[33]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Handoff</td>
                    <td>
                      Git
                      Worktreeによる並列作業ディレクトリの分離、バックグラウンド実行（Ctrl+Bでサブエージェントを裏で動かしながら手元の作業を継続）
                      <sup>
                        <a href="#ref34">[34]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Verification</td>
                    <td>
                      サブエージェント（Subagents）に「コードレビュー専任」など役割を持たせ、実装担当とは別の文脈・別のモデルで検証させる
                      <sup>
                        <a href="#ref35">[35]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Persistence</td>
                    <td>
                      <code>CLAUDE.md</code> / <code>AGENTS.md</code>
                      （プロジェクトの前提知識）、進捗ファイル、MCP経由でのLinear連携など
                      <sup>
                        <a href="#ref19">[19]</a>
                        <a href="#ref35">[35]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>（知識の注入）</td>
                    <td>
                      Skills（<code>.claude/skills/</code>
                      以下にまとめた、必要なときだけ読み込む手順書）
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>11.2　スケジューリングの選び方</h3>
            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>選択肢</th>
                    <th>永続性</th>
                    <th>向いている用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>/loop &lt;間隔&gt; &lt;コマンド&gt;</code>
                    </td>
                    <td>セッションが開いている間だけ</td>
                    <td>
                      「15分おきにサブエージェントの完了を確認する」など、今このセッション内で完結する短期の反復
                      <sup>
                        <a href="#ref33">[33]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>/schedule</code> またはクラウドのスケジュールタスク
                    </td>
                    <td>マシンの再起動・終了をまたいで継続</td>
                    <td>
                      「毎週平日9時にCIダッシュボードを確認して要約する」など、長期的に繰り返す定型業務
                      <sup>
                        <a href="#ref33">[33]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Hooks（<code>PreToolUse</code> / <code>PostToolUse</code> / <code>Stop</code>{" "}
                      など）
                    </td>
                    <td>イベント駆動（時間ではなく出来事に反応）</td>
                    <td>
                      「ファイル編集のたびにLintを走らせる」「セッション終了時に必ずテストを走らせてから終わらせる」など、確実に実行させたい処理
                      <sup>
                        <a href="#ref36">[36]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>外部のCIツール（GitHub Actionsなど）からヘッドレス起動</td>
                    <td>CI基盤に依存</td>
                    <td>チーム共有の定型ワークフローに組み込みたい場合</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>11.3　Subagents（サブエージェント）の実装イメージ</h3>
            <p>
              サブエージェントは、それぞれ独自のシステムプロンプト・使用できるツール・独立したコンテキストウィンドウを持つ、専門特化したAIインスタンスです。例えば「コードレビュー専任」のサブエージェントは、次のように定義できます（概念例）
              <sup>
                <a href="#ref35">[35]</a>
              </sup>
              。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>---</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>name</span>:{" "}
                  <span className={styles.cv}>code-reviewer</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>description</span>:{" "}
                  <span className={styles.cv}>
                    コード品質・セキュリティを専門にレビューする。実装直後に必ず使用する。
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>tools</span>:{" "}
                  <span className={styles.cv}>Read, Grep, Glob, Bash</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>model</span>:{" "}
                  <span className={styles.cv}>sonnet</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>---</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    あなたはコード品質とセキュリティを厳しくチェックするシニアレビュアーです。
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    実装を書いたエージェントとは独立した視点で、以下を確認してください：
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    - プロジェクトのルール（CLAUDE.md）に沿っているか
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    - テストが実際にバグを検出できる内容になっているか
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    - セキュリティ上の懸念（権限、入力値検証など）がないか
                  </span>
                </div>
              </div>
            </div>

            <h3>11.4　まず動かしてみる最小構成（初学者向け）</h3>
            <p>
              複雑な仕組みを一気に組む前に、次のようなごく小さな構成から始めることをお勧めします。
            </p>
            <ol className={styles.stepList}>
              <li>
                <strong>小さなリポジトリを1つ用意する</strong>
                ：すでにテストが整備されている、小規模なプロジェクトを選びます
              </li>
              <li>
                <strong>単純な仕様書を用意する</strong>
                ：「失敗しているテストを1つ選んで直す」など、検証可能なタスクを1つ選びます（Step
                1・2）
              </li>
              <li>
                <strong>レビュー専用のサブエージェントを1つ定義する</strong>
                ：実装用のセッションとは別に用意します（Step 3、11.3節）
              </li>
              <li>
                <strong>進捗ファイルを用意する</strong>：進捗を <code>PROGRESS.md</code>{" "}
                に書き出すようエージェントに指示します（Step 4）
              </li>
              <li>
                <strong>
                  <code>/loop</code>を試す
                </strong>
                ：短い間隔（例：数分おき）で「テストが全部通ったか確認して、通っていなければ続行」という指示を回してみます（Step
                6）
              </li>
              <li>
                <strong>上限を必ず設定して観察する</strong>
                ：最大イテレーション回数を必ず設定し、最初は目の前で観察しながら動かします（Step
                2・7）
              </li>
            </ol>
            <p>
              慣れてきたら、Worktreeでの並列化やクラウドのスケジュールタスクへと段階的に拡張していきます。
            </p>
          </section>

          {/* ============ 12 ============ */}
          <section className="chapter block" id="s12">
            <div className={styles.kicker}>12 / Risks</div>
            <h2>リスクと注意点</h2>
            <p>
              Loop
              Engineeringは強力な一方、複数の実践者・批評家から具体的なリスクが指摘されています。導入前に必ず把握しておきましょう。
            </p>

            <figure className={styles.diagram}>
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag13}
                  id="diag-13"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
              </div>
              <figcaption>図13：Loop Engineeringの主なリスク5選</figcaption>
            </figure>

            <h3>12.1　コストの暴走：実例</h3>
            <p>
              大手配車サービスUberでは、エンジニア一人あたりのエージェント関連ツール利用に月1,500ドルの上限を設けたと報じられています。これは、年間のAI予算をわずか4か月で使い切ってしまったことを受けた措置とされています
              <sup>
                <a href="#ref37">[37]</a>
              </sup>
              。
              <strong>
                検証（Verifier）が弱いまま放置されたループは、派手に失敗するのではなく、トークン価格という形で一晩中静かに失敗し続ける
              </strong>
              という指摘は、コスト管理の重要性を端的に表しています
              <sup>
                <a href="#ref37">[37]</a>
              </sup>
              。
            </p>

            <h3>12.2　「認知的な明け渡し」への警戒</h3>
            <p>
              Addy
              Osmani氏自身も、ループ設計が「思考停止への近道」になりうる危険性に言及しています。ループが自分で回り始めると、人間はつい思考を止めて、返ってくる結果をそのまま受け入れがちになる、という懸念です
              <sup>
                <a href="#ref9">[9]</a>
                <a href="#ref38">[38]</a>
              </sup>
              。ソフトウェアエンジニアのArmin Ronacher氏も同様の懸念を共有しているとされています
              <sup>
                <a href="#ref9">[9]</a>
              </sup>
              。ループの設計は、判断力を働かせて行えば効果的な処方箋になり得る一方、考えることを避けるために行えば逆効果になる、というのがOsmani氏の立場です
              <sup>
                <a href="#ref9">[9]</a>
              </sup>
              。
            </p>

            <h3>12.3　コンテキストの劣化（Context Rot）とCompaction</h3>
            <p>
              長時間動き続けるループでは、コンテキストウィンドウが埋まるたびに古い情報が自動的に圧縮・破棄されます。Geoffrey
              Huntley氏はこれを「圧縮は悪魔だ」とまで表現しており、重要な仕様がこの過程で失われると、エージェントは自分自身の不完全な要約に頼らざるを得なくなり、当初の目的から少しずつずれていく（ドリフトする）と警告しています
              <sup>
                <a href="#ref30">[30]</a>
              </sup>
              。これを避けるための工夫が、9章・Step
              4で述べた「状態を会話の外側（ディスク上のファイルなど）に持たせる」設計です。
            </p>

            <h3>12.4　このムーブメント自体への健全な懐疑</h3>
            <p>
              すべての意見が肯定一色というわけではありません。ある開発者は、Claude
              Codeのようなツールが「ソフトウェアを書く」という課題を解決していることは事実だとしつつも、それだけで「誰もがどうソフトウェア開発をすべきか」を再定義する根拠にはならないと指摘しています。理由は単純で、ベンダーが示すデータの多くは、すでにそのベンダーの製品を積極的に使っているユーザーから得られたものだからです
              <sup>
                <a href="#ref8">[8]</a>
              </sup>
              。この2つの見方――「本物の転換点である」ことと「証拠には偏りがある」こと――は両立しうる、という冷静な受け止め方が重要です
              <sup>
                <a href="#ref8">[8]</a>
              </sup>
              。
            </p>

            <p>
              また別の視点として、ループをエージェント中心に設計すること自体への批判もあります。決定論的なロジック（プログラム）こそが土台であり、LLMはあくまでその土台の上で使われる部品にすぎない、という考え方です。ループを設計しただけで満足してしまい、その先に本当のユーザーがいなければ、それは思考停止を先延ばしにしているに過ぎない、という手厳しい指摘もあります
              <sup>
                <a href="#ref39">[39]</a>
              </sup>
              。ループが何を最適化すべきか、「完了」とは何を意味するのか、どこで処理を止めるべきかを最終的に決めるのは、依然として人間の役割です
              <sup>
                <a href="#ref39">[39]</a>
              </sup>
              。
            </p>

            <h3>12.5　リスクと対策のまとめ</h3>
            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>リスク</th>
                    <th>対策</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>コストの暴走</td>
                    <td>
                      Step
                      2で必ず金額・回数の上限を設定する。日次・週次でコストダッシュボードを確認する
                    </td>
                  </tr>
                  <tr>
                    <td>認知的な明け渡し</td>
                    <td>
                      Verifierの判定結果を定期的に人間が抜き打ちで確認する。「なぜ合格としたか」の理由をログに残させる
                    </td>
                  </tr>
                  <tr>
                    <td>コンテキストの劣化</td>
                    <td>
                      重要な仕様は会話の外（ファイル）に保存し、毎ターン読み直させる。圧縮が起きたタイミングをログで把握する
                    </td>
                  </tr>
                  <tr>
                    <td>自己採点バイアス</td>
                    <td>
                      Generator（作る役）とVerifier（確認する役）を必ず別のプロンプト・可能なら別のモデルにする
                    </td>
                  </tr>
                  <tr>
                    <td>サンプリングバイアスへの過信</td>
                    <td>自社の環境で小規模に試し、成功事例をそのまま鵜呑みにしない</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          {/* ============ 13 ============ */}
          <section className="chapter block" id="s13">
            <div className={styles.kicker}>13 / Maturity</div>
            <h2>成熟度モデルと健全性チェック</h2>

            <h3>13.1　Loop Engineering成熟度モデル</h3>
            <figure className={styles.diagram}>
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag14}
                  id="diag-14"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
              </div>
              <figcaption>図14：Loop Engineering成熟度モデル（Level 0〜5）</figcaption>
            </figure>

            <h3>13.2　健全性チェックフロー</h3>
            <p>自分のループが健全かどうか、導入後に振り返るためのチェックリストです。</p>

            <figure className={styles.diagram}>
              <div className={styles.mermaidContainer}>
                <MermaidDiagram
                  chart={DIAGRAMS.diag15}
                  id="diag-15"
                  theme="base"
                  themeVariables={LOOP_THEME_VARS}
                />
              </div>
              <figcaption>図15：ループの健全性チェックフロー</figcaption>
            </figure>
          </section>

          {/* ============ 14 ============ */}
          <section className="chapter block" id="s14">
            <div className={styles.kicker}>14 / Summary</div>
            <h2>まとめ</h2>
            <ul>
              <li>
                <strong>Loop Engineering</strong>
                とは、人間がAIエージェントに毎回プロンプトを打つ役目をやめ、その繰り返し処理を担うシステム自体を設計する考え方です
                <sup>
                  <a href="#ref4">[4]</a>
                </sup>
                。
              </li>
              <li>
                系譜としては、Prompt Engineering → Context Engineering → Harness Engineering
                に続く4番目の層として位置づけられています
                <sup>
                  <a href="#ref9">[9]</a>
                </sup>
                。
              </li>
              <li>
                Andrew Ng氏は、この考え方をさらに大きな枠組みで捉え、
                <strong>
                  エージェンティック・コーディングループ（分単位）／開発者フィードバックループ（時間単位）／外部フィードバックループ（日〜週単位）
                </strong>
                という3つの入れ子のループとして整理しています
                <sup>
                  <a href="#ref6">[6]</a>
                </sup>
                。
              </li>
              <li>
                1つのループは
                <strong>Discovery・Handoff・Verification・Persistence・Scheduling</strong>
                という5つの動きに分解でき、それを
                <strong>
                  Automations・Worktrees・Skills・Plugins/Connectors・Sub-agents・Memory
                </strong>
                という6つの部品が実現します
                <sup>
                  <a href="#ref14">[14]</a>
                </sup>
                。
              </li>
              <li>
                成否を分ける最大のポイントは、
                <strong>「作る役」と「確認する役」を分離すること</strong>
                、そして
                <strong>停止条件を必ず明示的に設計すること</strong>
                です
                <sup>
                  <a href="#ref16">[16]</a>
                </sup>
                。
              </li>
              <li>
                コストの暴走・認知的な明け渡し・コンテキストの劣化といったリスクが実例つきで報告されており、導入時には十分な注意とガードレールが必要です
                <sup>
                  <a href="#ref9">[9]</a>
                  <a href="#ref30">[30]</a>
                  <a href="#ref37">[37]</a>
                </sup>
                。
              </li>
              <li>
                この分野はまだ生まれたばかりで急速に変化しています。実装の際は必ず各ツールの最新の公式ドキュメントを確認してください。
              </li>
            </ul>
          </section>

          {/* ============ 15 ============ */}
          <section className="references block" id="s15">
            <div className={styles.kicker}>15 / References</div>
            <h2>参考文献・出典一覧</h2>

            <h3>🐦 きっかけとなった発言・ニュースレター</h3>
            <div className={styles.tableScroll}>
              <table className="ref-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>出典</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="ref1">
                    <td>[1]</td>
                    <td>Boris Cherny氏の発言を報じた記事（BigGo Finance）</td>
                    <td>
                      <Ext href="https://finance.biggo.com/news/0be3d022-660e-4c74-9399-1e6f5cf70d24">
                        finance.biggo.com/news/0be3d022…
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref2">
                    <td>[2]</td>
                    <td>Boris Cherny氏「ループを書くのが仕事になった」に関する記事（Medium）</td>
                    <td>
                      <Ext href="https://ai-engineering-trend.medium.com/claude-code-creator-boris-i-dont-write-prompts-anymore-i-write-loops-03540f440511">
                        ai-engineering-trend.medium.com/…
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref3">
                    <td>[3]</td>
                    <td>Peter Steinberger氏の発言に関する記事（KuCoin News）</td>
                    <td>
                      <Ext href="https://www.kucoin.com/news/flash/prompt-engineering-declines-as-loop-engineering-gains-momentum-in-silicon-valley">
                        kucoin.com/news/flash/…
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref6">
                    <td>[6]</td>
                    <td>Andrew Ng氏のポスト「Loop engineering」（X / The Batch）</td>
                    <td>
                      <Ext href="https://x.com/AndrewYNg/status/2071988145667928442">
                        x.com/AndrewYNg/status/2071988145667928442
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref7">
                    <td>[7]</td>
                    <td>Andrew Ngの3つのループに関する解説記事（explainx.ai）</td>
                    <td>
                      <Ext href="https://explainx.ai/blog/andrew-ng-three-loops-0-to-1-products-2026">
                        explainx.ai/blog/andrew-ng-three-loops…
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>—</td>
                    <td>Boris Cherny氏のポスト（X、ユーザー指定URL）</td>
                    <td>
                      <Ext href="https://x.com/bcherny/status/2064426115255730578">
                        x.com/bcherny/status/2064426115255730578
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>📖 Loop Engineeringの定義・体系化</h3>
            <div className={styles.tableScroll}>
              <table className="ref-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>出典</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="ref4">
                    <td>[4]</td>
                    <td>Addy Osmani「Loop Engineering」（本人ブログ）</td>
                    <td>
                      <Ext href="https://addyosmani.com/blog/loop-engineering/">
                        addyosmani.com/blog/loop-engineering/
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref5">
                    <td>[5]</td>
                    <td>同上（Substack転載版）</td>
                    <td>
                      <Ext href="https://addyo.substack.com/p/loop-engineering">
                        addyo.substack.com/p/loop-engineering
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref9">
                    <td>[9]</td>
                    <td>同上（O'Reilly Radar転載版）</td>
                    <td>
                      <Ext href="https://www.oreilly.com/radar/loop-engineering/">
                        oreilly.com/radar/loop-engineering/
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref10">
                    <td>[10]</td>
                    <td>Loop Engineeringクラッシュコース（Panaversity Agent Factory）</td>
                    <td>
                      <Ext href="https://agentfactory.panaversity.org/docs/loop-engineering-crash-course">
                        agentfactory.panaversity.org/docs/loop-engineering-crash-course
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref13">
                    <td>[13]</td>
                    <td>Loop Engineeringガイド2026（AI Builder Club）</td>
                    <td>
                      <Ext href="https://www.aibuilderclub.com/blog/loop-engineering-guide-2026">
                        aibuilderclub.com/blog/loop-engineering-guide-2026
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref14">
                    <td>[14]</td>
                    <td>5つの構成要素の実例解説（Google Gate News）</td>
                    <td>
                      <Ext href="https://www.gate.com/news/detail/google-engineer-loop-engineerings-five-building-blocks-let-ai-automatically-21751012">
                        gate.com/news/detail/google-engineer…
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref16">
                    <td>[16]</td>
                    <td>Loop EngineeringのIEEE形式サマリー（HyperAI）</td>
                    <td>
                      <Ext href="https://hyper.ai/en/papers/Loop-Engineering-IEEE">
                        hyper.ai/en/papers/Loop-Engineering-IEEE
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref19">
                    <td>[19]</td>
                    <td>実践フィールドガイド（DEV Community）</td>
                    <td>
                      <Ext href="https://dev.to/truongpx396/the-agentic-loop-a-practical-field-guide-mnc">
                        dev.to/truongpx396/the-agentic-loop…
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref20">
                    <td>[20]</td>
                    <td>Loop Engineeringクラッシュコース（同上、Generator/Verifier分離）</td>
                    <td>
                      <Ext href="https://agentfactory.panaversity.org/docs/loop-engineering-crash-course">
                        agentfactory.panaversity.org/docs/loop-engineering-crash-course
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>🔧 Ralph Wiggumテクニック</h3>
            <div className={styles.tableScroll}>
              <table className="ref-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>出典</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="ref25">
                    <td>[25][26][29]</td>
                    <td>
                      Geoffrey Huntley「Ralph Wiggum as a &quot;software engineer&quot;」（原典）
                    </td>
                    <td>
                      <Ext href="https://ghuntley.com/ralph/">ghuntley.com/ralph/</Ext>
                    </td>
                  </tr>
                  <tr id="ref28">
                    <td>[28]</td>
                    <td>Dev Interrupted podcast「Inventing the Ralph Wiggum Loop」</td>
                    <td>
                      <Ext href="https://linearb.io/dev-interrupted/podcast/inventing-the-ralph-wiggum-loop">
                        linearb.io/dev-interrupted/podcast/…
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref30">
                    <td>[30][37]</td>
                    <td>Ralph Wiggum流コーディングの解説（tessl.io）</td>
                    <td>
                      <Ext href="https://tessl.io/blog/unpacking-the-unpossible-logic-of-ralph-wiggumstyle-ai-coding/">
                        tessl.io/blog/unpacking-the-unpossible-logic…
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref31">
                    <td>[31]</td>
                    <td>Ralph Wiggum LoopとClaude Codeプラグイン化の経緯（Shiqi Mei）</td>
                    <td>
                      <Ext href="https://shiqimei.github.io/posts/ralph-wiggum-loop-claude-code">
                        shiqimei.github.io/posts/ralph-wiggum-loop-claude-code
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref32">
                    <td>[32]</td>
                    <td>Ralphの歴史（HumanLayer Blog）</td>
                    <td>
                      <Ext href="https://www.humanlayer.dev/blog/brief-history-of-ralph">
                        humanlayer.dev/blog/brief-history-of-ralph
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>—</td>
                    <td>Ralph実践プレイブック（GitHub）</td>
                    <td>
                      <Ext href="https://github.com/ghuntley/how-to-ralph-wiggum">
                        github.com/ghuntley/how-to-ralph-wiggum
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>—</td>
                    <td>Ralphループの経済性解説（LinearB Blog）</td>
                    <td>
                      <Ext href="https://linearb.io/blog/ralph-loop-agentic-engineering-geoffrey-huntley">
                        linearb.io/blog/ralph-loop-agentic-engineering…
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>🧪 ソフトウェアテスト関連（Verifier設計の参考）</h3>
            <div className={styles.tableScroll}>
              <table className="ref-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>出典</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="ref21">
                    <td>[21]</td>
                    <td>Martin Fowler「The Practical Test Pyramid」</td>
                    <td>
                      <Ext href="https://martinfowler.com/articles/practical-test-pyramid.html">
                        martinfowler.com/articles/practical-test-pyramid.html
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref22">
                    <td>[22]</td>
                    <td>Martin Fowler「TestPyramid」（Bliki）</td>
                    <td>
                      <Ext href="https://martinfowler.com/bliki/TestPyramid.html">
                        martinfowler.com/bliki/TestPyramid.html
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>—</td>
                    <td>Ministry of Testing「The Test Pyramid」解説</td>
                    <td>
                      <Ext href="https://www.ministryoftesting.com/software-testing-glossary/the-test-pyramid">
                        ministryoftesting.com/software-testing-glossary/the-test-pyramid
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref23">
                    <td>[23]</td>
                    <td>AI時代におけるテストピラミッドの重要性（minware）</td>
                    <td>
                      <Ext href="https://www.minware.com/blog/test-pyramid-ai-assisted-development">
                        minware.com/blog/test-pyramid-ai-assisted-development
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref24">
                    <td>[24]</td>
                    <td>
                      テストピラミッドは終わったのか（Augment Code、Martin Fowler氏への言及あり）
                    </td>
                    <td>
                      <Ext href="https://www.augmentcode.com/guides/is-the-test-pyramid-dead">
                        augmentcode.com/guides/is-the-test-pyramid-dead
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>🛠️ Claude Code 実装関連（公式ドキュメント含む）</h3>
            <div className={styles.tableScroll}>
              <table className="ref-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>出典</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="ref33">
                    <td>[33]</td>
                    <td>スケジュールタスク・Cronツールの解説（Panaversity Agent Factory）</td>
                    <td>
                      <Ext href="https://agentfactory.panaversity.org/docs/General-Agents-Foundations/general-agents/scheduled-tasks-cron">
                        agentfactory.panaversity.org/docs/General-Agents-Foundations/…
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref34">
                    <td>[34]</td>
                    <td>Claude Codeの非async・バックグラウンドエージェント解説</td>
                    <td>
                      <Ext href="https://claudefa.st/blog/guide/agents/async-workflows">
                        claudefa.st/blog/guide/agents/async-workflows
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref35">
                    <td>[35]</td>
                    <td>Claude Code Hooks/Subagents/Skills完全ガイド</td>
                    <td>
                      <Ext href="https://ofox.ai/blog/claude-code-hooks-subagents-skills-complete-guide-2026/">
                        ofox.ai/blog/claude-code-hooks-subagents-skills…
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref36">
                    <td>[36]</td>
                    <td>Claude Code Hooksリファレンス（公式ドキュメント）</td>
                    <td>
                      <Ext href="https://code.claude.com/docs/en/hooks">
                        code.claude.com/docs/en/hooks
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>—</td>
                    <td>Claude Codeアーキテクチャ解説（Penligent）</td>
                    <td>
                      <Ext href="https://www.penligent.ai/hackinglabs/inside-claude-code-the-architecture-behind-tools-memory-hooks-and-mcp/">
                        penligent.ai/hackinglabs/inside-claude-code…
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>📰 業界動向・背景解説</h3>
            <div className={styles.tableScroll}>
              <table className="ref-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>出典</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="ref8">
                    <td>[8][12]</td>
                    <td>
                      サンプリングバイアス・「検証のないタスクは願望にすぎない」に関する実践ガイド（DEV
                      Community）
                    </td>
                    <td>
                      <Ext href="https://dev.to/truongpx396/the-agentic-loop-a-practical-field-guide-mnc">
                        dev.to/truongpx396/the-agentic-loop…
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref15">
                    <td>[15][18]</td>
                    <td>Loop Engineeringガイド・Worktree/スケジューリング解説（explainx.ai）</td>
                    <td>
                      <Ext href="https://explainx.ai/blog/loop-engineering-coding-agents-claude-code-guide-2026">
                        explainx.ai/blog/loop-engineering-coding-agents…
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref17">
                    <td>[17]</td>
                    <td>Loop Engineeringの実践的教訓（個人ブログ、Gerald Chen）</td>
                    <td>
                      <Ext href="https://chenguangliang.com/en/posts/blog191_loop-engineering-design-loops-prompt-agents/">
                        chenguangliang.com/en/posts/blog191…
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref38">
                    <td>[38]</td>
                    <td>Loop Engineeringの日本語まとめ（note、MAKE A CHANGE, inc）</td>
                    <td>
                      <Ext href="https://note.com/make_a_change/n/na8ae99b24c36?hl=en">
                        note.com/make_a_change/n/na8ae99b24c36
                      </Ext>
                    </td>
                  </tr>
                  <tr id="ref39">
                    <td>[39]</td>
                    <td>ループ中心設計への批判「The Loop Is Not the Product」（DEV Community）</td>
                    <td>
                      <Ext href="https://dev.to/dannwaneri/the-loop-is-not-the-product-466d">
                        dev.to/dannwaneri/the-loop-is-not-the-product-466d
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>—</td>
                    <td>Jensen Huang氏の発言を含む業界動向解説（HTX Insights）</td>
                    <td>
                      <Ext href="https://www.htx.com/news/jensen-huang-prompts-are-becoming-obsolete-loops-are-the-new-dqI2WOBl/">
                        htx.com/news/jensen-huang-prompts…
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>—</td>
                    <td>DeepLearning.AI公式サイト（Andrew Ng氏のニュースレター元）</td>
                    <td>
                      <Ext href="https://www.deeplearning.ai/">deeplearning.ai</Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <a className={styles.backTop} href="#s1">
              ↑ 目次トップへ戻る
            </a>
          </section>

          {/* ============ FOOTER ============ */}
          <footer className={styles.pageFooter}>
            <div className={styles.finalNote}>
              <strong>⚠️ 免責事項：</strong>
              本ガイドで紹介した内容の多くは、2026年6月〜7月というごく最近の期間にSNS上で急速に広まった、まだ確立されていない実践知です。企業名・製品名・数値（コスト等）は各出典記事が報じた内容をそのまま紹介しており、筆者自身による検証を経たものではありません。実装前には必ず一次情報（各ツールの公式ドキュメント、原著者本人の発言）を確認することを強く推奨します。
            </div>
            <p>
              本ガイドは教育目的で作成されています。バージョン 1.0 ／ Mermaid.js によるライブ図解 ／
              ASCII図解は不使用
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
