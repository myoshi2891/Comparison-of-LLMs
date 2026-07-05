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

          {/* ============ Placeholder sections 3-15 ============ */}
          <section className="chapter block" id="s3" style={{ display: "none" }} />
          <section className="chapter block" id="s4" style={{ display: "none" }} />
          <section className="chapter block" id="s5" style={{ display: "none" }} />
          <section className="chapter block" id="s6" style={{ display: "none" }} />
          <section className="chapter block" id="s7" style={{ display: "none" }} />
          <section className="chapter block" id="s8" style={{ display: "none" }} />
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
