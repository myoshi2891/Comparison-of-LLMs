import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata = {
  title: "Claude Fable 5 実践活用ガイド | Claude Code エンジニアのためのベストプラクティス",
  description:
    "Claude Codeエンジニアのための中級〜上級者向けベストプラクティス。「指示を積み上げる」から「ゴールと検証基準を渡して任せる」へ ― Fable 5に最適化された思考法をステップバイステップで解説します。",
};

const DIAGRAMS = {
  diagram1: `graph TD
    MF["共通の基盤モデル<br/>(旧世代 Mythos Preview からの進化)"]
    MF --> Mythos5["Claude Mythos 5<br/>安全分類器なし<br/>Project Glasswing 経由の限定提供"]
    MF --> Fable5["Claude Fable 5<br/>安全分類器あり<br/>一般提供(GA)"]
    Mythos5 --> GW["Project Glasswing<br/>重要インフラ防御パートナー向けプログラム<br/>(AWS / Apple / Google / Microsoft / NVIDIA / CrowdStrike 等)"]
    Fable5 --> Users["Claude API / Claude Platform on AWS / Bedrock<br/>Google Cloud / Microsoft Foundry<br/>Claude Code / Claude.ai / Claude Cowork"]`,
  diagram2: `flowchart TD
    A["ユーザーのリクエスト<br/>(CLAUDE.md・gitステータスも含む)"] --> B{"安全分類器が検知?"}
    B -- "いいえ(95%超のケース)" --> C["Fable 5がそのまま応答"]
    B -- "はい(サイバー/生物学/推論抽出)" --> D["Claude Opus 4.8 へ自動フォールバック"]
    D --> E["トランスクリプトに通知が表示される"]
    E --> F["セッションはOpus 4.8のまま継続"]
    F --> G["/model fable を実行するとFable 5に復帰"]`,
  diagram3: `flowchart TD
    A["有効なEffortレベルの決定"] --> B{"環境変数 CLAUDE_CODE_EFFORT_LEVEL が設定されている?"}
    B -- はい --> Z["環境変数の値を採用(最優先)"]
    B -- いいえ --> C{"実行中のSkill/Subagentのfrontmatterにeffort指定がある?"}
    C -- はい --> Y["frontmatterの値を採用<br/>(セッション設定より優先、環境変数には劣後)"]
    C -- いいえ --> D{"/effort やsettingsファイルで手動設定済み?"}
    D -- はい --> X["手動設定値を採用"]
    D -- いいえ --> W["モデルごとの既定値を採用<br/>(Fable 5・Sonnet 5・Opus 4.8はhighが既定)"]`,
  diagram4: `graph TD
    U["開発者"] --> O["Fable 5: オーケストレーター<br/>(計画・アーキテクチャ判断・最終レビュー)"]
    O --> S1["Sonnet 5: 実装サブエージェント"]
    O --> S2["Opus 4.8: 複雑な実装サブエージェント"]
    O --> H1["Haiku 4.5: コード検索・棚卸しサブエージェント"]
    O --> V["Fable 5: 検証サブエージェント(fresh context)"]
    S1 -.結果を返す.-> O
    S2 -.結果を返す.-> O
    H1 -.結果を返す.-> O
    V -.検証結果を返す.-> O`,
  diagram5: `sequenceDiagram
    participant Dev as 開発者
    participant Worker as Fable 5(作業者)
    participant Eval as 評価モデル(既定は軽量モデル)
    Dev->>Worker: 「/goal 条件」を設定
    loop 条件が満たされるまで
        Worker->>Worker: 1ターン分の作業を実行
        Worker->>Eval: セッションのトランスクリプトを提示
        Eval-->>Worker: 条件は成立したか(Yes / No)
        alt No
            Worker->>Worker: 理由を踏まえて次のターンへ
        else Yes
            Worker-->>Dev: ゴール達成としてセッション終了
        end
    end`,
  diagram6: `flowchart LR
    subgraph Pre["実装前"]
        A["① Blindspot Pass<br/>プロンプトの曖昧さ・未定義部分を<br/>Fable自身にスキャンさせる"]
        B["② Brainstorm / Prototype<br/>正式なプロンプトの前に、複数の切り口を<br/>発散的に検討させる"]
        C["③ Interview / Reference<br/>Fableに逆質問させる<br/>または既存の実装を参照点として与える"]
    end
    subgraph During["実装中"]
        D["④ Implementation Notes<br/>各ステップに着手する前に<br/>そのステップの前提を書き出させる"]
    end
    subgraph Post["実装後"]
        E["⑤ Quiz / Pitch<br/>成果物について小テストをする<br/>または説明させることで<br/>暗黙の前提を逆照射する"]
    end
    A --> B --> C --> D --> E
    E -.新たなunknownsが発覚.-> A`,
  diagram7: `flowchart TD
    Start["新しいタスクが来た"] --> Q1{"曖昧・長時間・高難度か?"}
    Q1 -- はい --> Q2{"サイバーセキュリティ/生物学に近い内容か?"}
    Q2 -- はい --> Opus["Opus 4.8を直接使用<br/>(フォールバックを待つより効率的)"]
    Q2 -- いいえ --> Fable["Fable 5をhigh〜xhigh effortで使用<br/>(オーケストレーター役)"]
    Q1 -- いいえ --> Q3{"日常的なコーディング・反復作業か?"}
    Q3 -- はい --> Sonnet["Sonnet 5を使用"]
    Q3 -- いいえ --> Q4{"検索・棚卸しなど軽量タスクか?"}
    Q4 -- はい --> Haiku["Haiku 4.5をサブエージェントで使用"]
    Q4 -- いいえ --> Sonnet`,
};

export default function Fable5BestPracticesPage() {
  return (
    <div className={styles.pageContainer}>
      <aside className={styles.sidebar}>
        <a href="#top" className={styles.brand}>
          <div className={styles.brandMark}>F5</div>
          <div className={styles.brandText}>
            Claude Fable 5<span className={styles.brandSub}>Best Practices</span>
          </div>
        </a>
        <div className={styles.sidebarMeta}>
          最終更新: 2026-07-04
          <br />
          対象: Claude Code 中〜上級者
        </div>
        <nav className={styles.toc} id="toc">
          <a href="#ch1" className={styles.tocLink}>
            <span className={styles.num}>01</span>Fable 5とは何か
          </a>
          <a href="#ch2" className={styles.tocLink}>
            <span className={styles.num}>02</span>タイムライン
          </a>
          <a href="#ch3" className={styles.tocLink}>
            <span className={styles.num}>03</span>安全分類器とフォールバック
          </a>
          <a href="#ch4" className={styles.tocLink}>
            <span className={styles.num}>04</span>プロンプティングの転換
          </a>
          <a href="#ch5" className={styles.tocLink}>
            <span className={styles.num}>05</span>Effortレベル
          </a>
          <a href="#ch6" className={styles.tocLink}>
            <span className={styles.num}>06</span>Claude Codeでの実践設定
          </a>
          <a href="#ch7" className={styles.tocLink}>
            <span className={styles.num}>07</span>Loop Engineering
          </a>
          <a href="#ch8" className={styles.tocLink}>
            <span className={styles.num}>08</span>Unknownsフレームワーク
          </a>
          <a href="#ch9" className={styles.tocLink}>
            <span className={styles.num}>09</span>検証ループとメモリ
          </a>
          <a href="#ch10" className={styles.tocLink}>
            <span className={styles.num}>10</span>モデル選定とコスト
          </a>
          <a href="#ch11" className={styles.tocLink}>
            <span className={styles.num}>11</span>アンチパターン
          </a>
          <a href="#ch12" className={styles.tocLink}>
            <span className={styles.num}>12</span>実力と検証の必要性
          </a>
          <a href="#ch13" className={styles.tocLink}>
            <span className={styles.num}>13</span>既知の制限事項
          </a>
          <a href="#ch14" className={styles.tocLink}>
            <span className={styles.num}>14</span>まとめ
          </a>
          <a href="#ch15" className={styles.tocLink}>
            <span className={styles.num}>15</span>参考文献
          </a>
        </nav>
      </aside>

      <main className={styles.content}>
        <div className={styles.wrap}>
          <header className={styles.hero} id="top">
            <span className={styles.heroEyebrow}>CLAUDE CODE ・ MODEL PLAYBOOK</span>
            <h1>
              Claude Fable 5
              <br />
              実践活用ガイド
            </h1>
            <p className={styles.lead}>
              Claude
              Codeエンジニアのための中級〜上級者向けベストプラクティス。「指示を積み上げる」から「ゴールと検証基準を渡して任せる」へ
              ― Fable 5に最適化された思考法をステップバイステップで解説する。
            </p>
            <div className={styles.heroAudience}>
              <b>対象読者:</b> Claude Codeを日常的に使っており、Opus /
              Sonnet世代のプロンプト設計には慣れているが、Fable
              5特有の挙動にまだ最適化できていないエンジニア。
              <br />
              <br />
              <b>情報時点:</b> 2026年7月4日。Fable
              5は現在進行形でアップデートされているモデルのため、記載内容は今後変わる可能性がある。
            </div>
          </header>

          <section className={`${styles.chapter} chapter`} id="ch1">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>01</span>
              <h2>Claude Fable 5 とは何か</h2>
            </div>

            <p>
              Claude Fable 5 は、Anthropic が2026年6月9日に発表した「Claude
              5」世代の最初のモデルで、Opus
              よりも上位に位置づけられる新しい「Mythos」クラスの一般提供版である。同時に発表された{" "}
              <b>Claude Mythos 5</b> は同一の基盤モデルを共有しているが、Fable 5
              にのみ追加の安全分類器(セーフガード)が搭載されている点が異なる。Mythos 5 は
              &quot;Project Glasswing&quot;
              という信頼されたパートナー向けプログラムを通じてのみ限定提供されている。
            </p>

            <h3>1.1 スペック概要</h3>
            <div className={styles.specGrid}>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>Model ID</div>
                <div className={styles.specValue}>
                  <code className={styles.inlineCode}>claude-fable-5</code>
                </div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>コンテキスト窓</div>
                <div className={styles.specValue}>既定 100万トークン</div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>最大出力</div>
                <div className={styles.specValue}>12.8万トークン/リクエスト</div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>価格(入力)</div>
                <div className={styles.specValue}>$10 / 100万トークン</div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>価格(出力)</div>
                <div className={styles.specValue}>$50 / 100万トークン</div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>Thinking</div>
                <div className={styles.specValue}>Adaptive Thinkingのみ</div>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>位置づけ</td>
                    <td>
                      Anthropicが一般提供する中で最も高性能なモデル。長時間・高難度・曖昧なタスク向け
                    </td>
                  </tr>
                  <tr>
                    <td>提供チャネル</td>
                    <td>
                      Claude API / Claude Platform on AWS / Amazon Bedrock / Google Cloud /
                      Microsoft Foundry / Claude Code / Claude.ai / Claude Cowork
                    </td>
                  </tr>
                  <tr>
                    <td>データ保持</td>
                    <td>30日間保持の「Covered Model」扱い。Zero Data Retention(ZDR)は非対応</td>
                  </tr>
                  <tr>
                    <td>Thinking表示</td>
                    <td>
                      生の思考過程(raw chain of thought)は返却されない。
                      <code className={styles.inlineCode}>thinking.display</code>
                      で「要約」または「非表示」を選択
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>1.2 モデルファミリーの関係性</h3>
            <div className={styles.diagramFrame}>
              <div className={styles.mermaid} id="diagram-1">
                <MermaidDiagram chart={DIAGRAMS.diagram1} />
              </div>
              <div className={styles.diagramCaption}>
                図1: Fable 5 / Mythos 5 / Project Glasswing の関係
              </div>
            </div>

            <p>
              Fable 5 と Mythos 5
              は「同じ頭脳、異なる安全装備」というイメージで捉えると理解しやすい。Fable 5
              は分類器というガードレールを装備することで安全に広く配布できるようにした版、Mythos 5
              はガードレールなしで信頼できるパートナーにのみ渡す版、という棲み分けである。
            </p>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch2">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>02</span>
              <h2>タイムライン: リリースから輸出規制、復旧まで</h2>
            </div>

            <p>
              Fable 5
              は発表から1ヶ月足らずで、一度サービス停止という大きな出来事を経験している。プロンプト設計とは直接関係ないが、可用性設計(フォールバックの必要性)を理解する上で重要な背景である。
            </p>

            <div className={styles.timeline}>
              <div className={styles.tItem}>
                <div className={styles.tDate}>2026-06-09</div>
                <div className={styles.tBody}>
                  <b>Fable 5 / Mythos 5 発表・一般提供開始。</b>
                  Claude 5世代の最初のモデルとして、Claude API・Claude
                  Code・Claude.ai等で同時に利用可能になった。
                </div>
              </div>
              <div className={styles.tItem}>
                <div className={styles.tDate}>2026-06-12</div>
                <div className={styles.tBody}>
                  <b>米商務省が輸出規制を適用、全世界でアクセスを一時停止。</b>
                  Amazonの研究者がFable
                  5の安全策を回避してソフトウェア脆弱性を特定できる手法を発見・報告したことがきっかけ。外国籍ユーザーを区別する即時的な手段がなかったため、全ユーザー向けに停止された。
                </div>
              </div>
              <div className={styles.tItem}>
                <div className={styles.tDate}>2026-06-30</div>
                <div className={styles.tBody}>
                  <b>米商務省が規制を解除、Anthropicが復旧を発表。</b>
                  Anthropicが安全対策の強化と米政府への協力を約束したことを受け、輸出管理措置が撤回された。
                </div>
              </div>
              <div className={styles.tItem}>
                <div className={styles.tDate}>2026-07-01</div>
                <div className={styles.tBody}>
                  <b>全世界でアクセス復旧。</b>
                  Claude Code / Claude.ai / API / Cowork
                  を含む全チャネルで利用可能に。分類器の精度は強化され、サイバーセキュリティ関連の誤検知率も改善されたと報告されている。
                </div>
              </div>
              <div className={styles.tItem}>
                <div className={styles.tDate}>2026-07-07(予定)</div>
                <div className={styles.tBody}>
                  <b>無料利用枠の変更予定。</b>
                  Pro/Max/Team等における週次利用枠上限50%の無料提供が終了し、以降は使用クレジット制に移行する見込み。
                </div>
              </div>
            </div>

            <div className={`${styles.callout} ${styles.warn}`}>
              <span className={styles.calloutLabel}>実務への含意</span>
              <p>
                この一件は、「Fable 5 に固定的に依存する設計は避け、フォールバック先(Opus 4.8
                など)を必ず用意しておく」という教訓を残した。一時停止の経緯についての公式声明は、Anthropicのニュースページで確認できる(巻末の参考文献を参照)。次章で解説する自動フォールバック機構は、まさにこの種のリスクに対する備えとしても機能する。
              </p>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch3">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>03</span>
              <h2>安全分類器と自動フォールバックの仕組み</h2>
            </div>

            <p>Fable 5には、以下の3領域を対象とした安全分類器が組み込まれている。</p>
            <ul>
              <li>
                <b>サイバーセキュリティ</b>:
                攻撃的なエクスプロイト・マルウェア・攻撃ツールの構築など
              </li>
              <li>
                <b>生物学・生命科学</b>: 実験手法や分子メカニズムに関する内容など
              </li>
              <li>
                <b>推論内容の抽出</b>:
                モデルの要約された思考過程をそのまま応答に転記させようとする指示
              </li>
            </ul>
            <p>
              これらに該当すると判定されたリクエストは、Fable 5では{" "}
              <code className={styles.inlineCode}>stop_reason: &quot;refusal&quot;</code>{" "}
              として拒否されるか、Claude Codeのようなハーネス上では自動的にOpus
              4.8へフォールバックする。Anthropicの公表によれば、
              <b>Fable 5セッションの95%超はフォールバックが一切発生しない</b>とのことである。
            </p>

            <h3>3.1 リクエストのライフサイクル</h3>
            <div className={styles.diagramFrame}>
              <div className={styles.mermaid} id="diagram-2">
                <MermaidDiagram chart={DIAGRAMS.diagram2} />
              </div>
              <div className={styles.diagramCaption}>
                図2: 安全分類器によるフォールバックのライフサイクル
              </div>
            </div>

            <h3>3.2 実務上の注意点</h3>

            <h4>初回リクエストだけで発火することがある</h4>
            <p>
              フォールバックはユーザーの発言内容だけでなく、セッション開始時に一緒に送られる{" "}
              <code className={styles.inlineCode}>CLAUDE.md</code> の内容や{" "}
              <code className={styles.inlineCode}>git status</code>
              、ディレクトリ名などのワークスペース情報も判定対象に含む。セキュリティ関連や生物学関連の資料がリポジトリに含まれているだけで、何も入力していない段階でフォールバックすることがある。
            </p>

            <h4>トリガー源の切り分け</h4>
            <p>
              <code className={styles.inlineCode}>claude --safe-mode</code>{" "}
              で起動すると、CLAUDE.md・Skills・MCPサーバー・Hooksなどのカスタマイズを無効化してセッションを開始できるため、フォールバックの原因がカスタマイズ側にあるのか、リクエスト内容そのものにあるのかを切り分けられる。
            </p>

            <h4>セキュリティ研究・生物学系タスクは高頻度でフォールバックする</h4>
            <p>
              ペネトレーションテストやCTF演習、生物学隣接のコードベースなどは、初回リクエストから頻繁にフォールバックが発生する「想定内の挙動」である。これはアカウントへのペナルティではない。Fable級の能力がどうしても必要な場合は、Anthropicの信頼されたアクセスプログラムへの相談が推奨されている。
            </p>

            <h4>自動切り替えを無効化し、都度確認する設定も可能</h4>
            <p>
              <code className={styles.inlineCode}>/config</code> から「switch models when a message
              is
              flagged」をオフにすると、フラグが立った際にセッションを一時停止し、Opusへの切り替えか、プロンプトを編集してFable
              5のまま再試行するかを選べるようになる。
            </p>

            <h4>サードパーティ基盤(Bedrock/Vertex/Foundry)での自動フォールバック</h4>
            <p>
              モデルIDがプロバイダ固有であるため、
              <code className={styles.inlineCode}>ANTHROPIC_DEFAULT_FABLE_MODEL</code> と{" "}
              <code className={styles.inlineCode}>ANTHROPIC_DEFAULT_OPUS_MODEL</code>{" "}
              を設定して、Claude CodeがどちらのモデルがFable 5/Opus
              4.8であるかを認識できるようにする必要がある。
            </p>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch4">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>04</span>
              <h2>プロンプティング思想の転換: チェックリストからゴールへ</h2>
            </div>

            <p>
              これはFable 5を使いこなす上で最も重要な認識転換である。Anthropic公式の「Prompting
              Claude Fable
              5」ガイドは、旧世代向けに書かれた作り込み過ぎた指示(過剰な手順列挙・網羅的な禁止事項・逐次的な確認要求など)が、Fable
              5ではむしろ性能を落とす場合があると明記している。Fable
              5は指示追従性が大幅に向上しているため、行動を一つひとつ列挙するのではなく、短い指示で意図を伝える方が有効に機能する。
            </p>

            <h3>4.1 旧来のスタイル vs Fable 5向けのスタイル</h3>
            <div className={styles.patternPair}>
              <div className={`${styles.patternCard} ${styles.old}`}>
                <span className={styles.patternTag}>Before ― Opus世代の習慣</span>
                <p>
                  手順を逐一列挙する → 禁止事項を網羅的に書き出す →
                  思考過程を逐一報告させる。過剰な制約がむしろFable 5の性能を落とす。
                </p>
              </div>
              <div className={`${styles.patternCard} ${styles.new}`}>
                <span className={styles.patternTag}>After ― Fable 5向け</span>
                <p>
                  ゴールと「なぜそれが必要か」を伝える → 越えてはいけない境界だけを明示する →
                  検証方法を明示する。自律的な判断力を最大限活かせる。
                </p>
              </div>
            </div>

            <div className={styles.callout}>
              <span className={styles.calloutLabel}>Claude Codeチームの声</span>
              <p>
                Anthropic Claude Codeチームのエンジニアである Thariq Shihipar(@trq212)は、Fable
                5導入後のチーム内の働き方の変化を「以前は &quot;Claudeが正しく作業したか&quot;
                を検証していたが、今は &quot;そもそも正しい作業をしているか&quot;
                を検証するようになった」という趣旨で表現している。これは、成果物の細部を逐一チェックする姿勢から、そもそもの方向性・スコープが合っているかを見る姿勢への転換を意味しており、上記の「チェックリストからゴールへ」という転換と同じ現象を、検証者側の視点から語ったものだと言える。
              </p>
            </div>

            <h3>4.2 実践プロンプトパターン(概念の再構成・自作例)</h3>
            <p>
              以下は公式ガイドが示す考え方を踏まえて筆者が独自に組み立てた、Claude
              Codeでそのまま使える日本語プロンプト断片の例である。用途に応じて適宜書き換えてほしい。
            </p>

            <div className={styles.codeBlock}>
              <div className={styles.codeBlockLabel}>パターン A ― ゴールと理由を先に伝える</div>
              <pre>
                <code className="language-text">
                  私は[対象読者]向けに[成果物]を作っています。彼らが必要としているのは{"\n"}
                  [何がその成果物を役立たせるか]です。{"\n"}
                  これらを踏まえて: [具体的な依頼内容]
                </code>
              </pre>
            </div>

            <div className={styles.codeBlock}>
              <div className={styles.codeBlockLabel}>
                パターン B ― 過剰な深掘り・改変を防ぐ境界指定
              </div>
              <pre>
                <code className="language-text">
                  このタスクに必要な範囲を超えて、機能追加・リファクタリング・抽象化を{"\n"}
                  行わないでください。バグ修正には周辺の整理は不要です。まだ発生していない{"\n"}
                  シナリオのためのエラーハンドリングやフォールバックは追加しないでください。
                </code>
              </pre>
            </div>

            <div className={styles.codeBlock}>
              <div className={styles.codeBlockLabel}>
                パターン C ― 進捗報告は「ツール結果に基づく事実」だけを許可する
              </div>
              <pre>
                <code className="language-text">
                  進捗を報告する前に、このセッション内のツール実行結果を根拠として{"\n"}
                  各主張を確認してください。根拠を示せない内容は報告しないでください。{"\n"}
                  テストが失敗していれば失敗した旨と出力を、未検証であれば未検証である旨を、{"\n"}
                  率直に伝えてください。
                </code>
              </pre>
            </div>

            <div className={styles.codeBlock}>
              <div className={styles.codeBlockLabel}>
                パターン D ― 自律実行中の「許可待ち」を防ぐ
              </div>
              <pre>
                <code className="language-text">
                  あなたは自律的に動作しています。ユーザーはリアルタイムでは見ておらず、{"\n"}
                  作業途中の質問には答えられません。元の依頼から自然に導かれる可逆的な{"\n"}
                  操作は、確認を取らずに進めてください。ターンを終える前に、自分の最後の{"\n"}
                  発言が「計画」「分析」「質問」「まだやっていない作業の予告」に{"\n"}
                  なっていないか確認し、なっていれば今すぐ手を動かしてください。
                </code>
              </pre>
            </div>

            <p>
              これらはいずれも「何をすべきか」を細かく指示するのではなく、「ゴール」「理由」「境界」「検証基準」の4要素を示す形になっている点が共通している。
            </p>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch5">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>05</span>
              <h2>Effort(推論深度)レベルの使い方</h2>
            </div>

            <p>
              Fable 5における性能・速度・コストのトレードオフを制御する最も重要なパラメータが{" "}
              <code className={styles.inlineCode}>effort</code>{" "}
              である。API上はモデルパラメータとして、Claude Code上は{" "}
              <code className={styles.inlineCode}>/effort</code>{" "}
              コマンドやモデルピッカーのスライダーとして操作する。
            </p>

            <h3>5.1 レベル一覧</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>レベル</th>
                    <th>特徴</th>
                    <th>主な用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code className={styles.inlineCode}>low</code>
                    </td>
                    <td>高速・低コスト。知的な深さは犠牲になる</td>
                    <td>レイテンシ重視で知的難度が低い、短く範囲の狭いタスク</td>
                  </tr>
                  <tr>
                    <td>
                      <code className={styles.inlineCode}>medium</code>
                    </td>
                    <td>コストを抑えつつ、ある程度の知性を維持</td>
                    <td>コスト重視で多少の知性低下を許容できる作業</td>
                  </tr>
                  <tr>
                    <td>
                      <code className={styles.inlineCode}>high</code>
                    </td>
                    <td>トークン消費と知性のバランスが良い(Fable 5の既定値)</td>
                    <td>大半のコーディング・エージェント作業</td>
                  </tr>
                  <tr>
                    <td>
                      <code className={styles.inlineCode}>xhigh</code>
                    </td>
                    <td>より深い推論、トークン消費は増加</td>
                    <td>能力の上限が求められる難しいワークロード</td>
                  </tr>
                  <tr>
                    <td>
                      <code className={styles.inlineCode}>max</code>
                    </td>
                    <td>最も深い推論。過剰思考になりやすく収穫逓減の傾向あり</td>
                    <td>導入前に必ず個別タスクで効果測定を行う。セッション限定設定</td>
                  </tr>
                  <tr>
                    <td>
                      <code className={styles.inlineCode}>ultracode</code>
                    </td>
                    <td>
                      Claude Code独自の設定。xhighに加え、実質的なタスクごとにDynamic
                      Workflowsを自動計画
                    </td>
                    <td>大規模タスクの自動オーケストレーションが必要な場合。セッション限定設定</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Anthropic公式ガイドは「まず<code className={styles.inlineCode}>high</code>
              を既定とし、最も能力が求められる作業に<code className={styles.inlineCode}>xhigh</code>
              を、日常的な定型作業には<code className={styles.inlineCode}>medium</code>/
              <code className={styles.inlineCode}>low</code>
              を検討する」ことを推奨している。興味深いのは、
              <b>Fable 5の低いeffort設定でも、旧モデルのxhigh設定を上回る性能が出ることが多い</b>
              という指摘である。つまり「常に最大effortを使う」のは必ずしも最適ではない。
            </p>

            <h3>5.2 Effortの決定優先順位</h3>
            <div className={styles.diagramFrame}>
              <div className={styles.mermaid} id="diagram-3">
                <MermaidDiagram chart={DIAGRAMS.diagram3} />
              </div>
              <div className={styles.diagramCaption}>
                図3: Claude CodeにおけるEffortレベルの決定優先順位
              </div>
            </div>

            <p>
              なお、<code className={styles.inlineCode}>ultrathink</code>{" "}
              というキーワードをプロンプト中に含めると、セッションのeffort設定を変えずにそのターンだけ深い推論をリクエストできる。一方で「think」「think
              hard」など他の言い回しは特別なキーワードとしては認識されず、通常の文章として扱われる点に注意してほしい。
            </p>

            <h3>5.3 過剰思考を防ぐ指示例</h3>
            <p>
              高いeffortで動かすと、Fable
              5がタスクに必要な範囲を超えて調査・熟考してしまうことがある。これを防ぐには、4.2節のパターンBのような境界指定が有効である。
            </p>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch6">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>06</span>
              <h2>Claude Code での実践設定</h2>
            </div>

            <h3>6.1 モデルの選択</h3>
            <p>
              Fable 5はClaude Codeの既定モデルではない。以下のいずれかで明示的に選択する必要がある。
            </p>
            <ul>
              <li>
                セッション中: <code className={styles.inlineCode}>/model fable</code>
              </li>
              <li>
                起動時: <code className={styles.inlineCode}>claude --model fable</code>
              </li>
              <li>
                環境変数: <code className={styles.inlineCode}>ANTHROPIC_MODEL=fable</code>
              </li>
              <li>
                設定ファイル: <code className={styles.inlineCode}>settings.json</code> の{" "}
                <code className={styles.inlineCode}>model</code> フィールド
              </li>
            </ul>
            <p>
              <code className={styles.inlineCode}>best</code> エイリアスは、組織がFable
              5にアクセスできる場合はFable
              5を、そうでない場合は最新のOpusを指すよう自動解決される。バージョンを固定したい場合はエイリアスではなく完全なモデル名(
              <code className={styles.inlineCode}>claude-fable-5</code>)を指定してほしい。
            </p>

            <h3>6.2 Fable 5から最大限の成果を引き出すための基本方針</h3>
            <p>Claude Code公式ドキュメントは、Fable 5の使い方について次の4点を挙げている。</p>
            <ol>
              <li>
                <b>手順ではなく結果を説明する</b>:
                欲しい結果を渡し、経路の計画はモデルに任せる。その結果を維持し続けたい場合は{" "}
                <code className={styles.inlineCode}>/goal</code> を設定する。
              </li>
              <li>
                <b>曖昧な問題を渡す</b>:
                根本原因の調査、障害対応、アーキテクチャ判断など、追加の調査・検証が効果を発揮する領域に向いている。
              </li>
              <li>
                <b>検証の念押しを省く</b>: Fable
                5は指示が少なくても自ら検証を行うため、「テストして」「確認して」といったリマインダーは基本的に不要。
              </li>
              <li>
                <b>タスクのサイズを大きくする</b>:
                通常は分割するような作業も、そのままのサイズで渡してよい。長いセッションでも文脈を見失いにくい。
              </li>
            </ol>

            <h3>6.3 サブエージェント戦略</h3>
            <p>
              Fable
              5は並列サブエージェントのディスパッチ・維持において旧モデルより大幅に信頼性が向上している。実務上は、Fable
              5を高コストな「判断役」に据え、実装の大部分は安価なモデルに任せる
              <b>階層型のモデルルーティング</b>が推奨される。
            </p>

            <div className={styles.diagramFrame}>
              <div className={styles.mermaid} id="diagram-4">
                <MermaidDiagram chart={DIAGRAMS.diagram4} />
              </div>
              <div className={styles.diagramCaption}>
                図4: Fable 5をオーケストレーターとする階層型サブエージェント構成
              </div>
            </div>

            <p>
              サブエージェントのモデルは、<code className={styles.inlineCode}>.claude/agents/</code>{" "}
              配下のfrontmatterで <code className={styles.inlineCode}>model: sonnet</code>{" "}
              のように指定できる。優先順位は「
              <code className={styles.inlineCode}>CLAUDE_CODE_SUBAGENT_MODEL</code> 環境変数 &gt;
              Agentツールの呼び出し時パラメータ &gt; frontmatter &gt;
              メインセッションのモデル」の順である。独立したサブタスクはサブエージェントに委任し、完了を待たずに他の作業を継続する非同期的な連携が推奨されている。長時間稼働するサブエージェントは文脈を保持し続けることで、キャッシュ読み込みの恩恵を受けられ、最も遅いサブエージェントによるボトルネックも避けられる。
            </p>

            <h3>6.4 Dynamic Workflows(ultracode)の活用</h3>
            <p>
              1つの会話では調整しきれないほど多くのエージェントが必要なタスク(コードベース全体の監査、数百ファイル規模の移行、相互検証が必要な調査など)には、Dynamic
              Workflowsが適している。これはFable
              5(または他モデル)がタスクのためのオーケストレーションスクリプトを自身で書き、バックグラウンドで実行する仕組みである。
            </p>
            <ul>
              <li>
                プロンプト中に <code className={styles.inlineCode}>ultracode</code>{" "}
                というキーワードを含めるか、「ワークフローを使って」と自然言語で依頼すると、その場でワークフローが起動する。
              </li>
              <li>
                <code className={styles.inlineCode}>/effort ultracode</code>{" "}
                を設定すると、セッション内のすべての実質的なタスクに対してワークフローを自動計画するようになる(トークン消費・時間は増加する)。
              </li>
              <li>
                実行状況は <code className={styles.inlineCode}>/workflows</code>{" "}
                で一覧・進捗確認ができる。
              </li>
              <li>
                うまく機能したワークフローはコマンドとして保存し、
                <code className={styles.inlineCode}>/</code>のオートコンプリートから再利用できる。
              </li>
            </ul>

            <h3>6.5 Worktreeによる並列実験</h3>
            <p>
              <code className={styles.inlineCode}>claude --worktree</code> を使うと、独立したgit
              worktree上でセッションを起動でき、複数のセッションが同じファイルを同時に編集する衝突を避けられる。Fable
              5に複数の実装方針を提案させ、それぞれを別のworktree上で(コストの低いモデルの)サブエージェントに実装させた上で、差分をFable
              5に持ち帰らせて比較・選定させる、といった使い方が実務では有効である。
            </p>

            <h3>6.6 CLAUDE.md / Skillsの再設計</h3>
            <p>
              Fable 5への移行時に最も見落とされがちなのが、
              <b>旧モデル向けに書かれた過剰に規範的な指示の棚卸し</b>
              である。公式ガイドは「旧モデル向けに開発されたSkillは、Fable
              5にとって規範的すぎることが多く、出力品質を下げる可能性がある」と明記している。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>見直すべきパターン</th>
                    <th>理由</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>手順を1から10まで列挙したチェックリスト</td>
                    <td>
                      Fable 5は自ら計画を立てられるため、過剰な手順指定が創造的な判断を阻害する
                    </td>
                  </tr>
                  <tr>
                    <td>あらゆる失敗ケースを想定した網羅的な禁止事項リスト</td>
                    <td>
                      弱いモデルの失敗モードを前提にした「保険」が、そのまま制約として重荷になる
                    </td>
                  </tr>
                  <tr>
                    <td>「思考過程を説明してください」という指示</td>
                    <td>
                      <code className={styles.inlineCode}>reasoning_extraction</code>{" "}
                      の拒否カテゴリに抵触し、Opusへのフォールバックを誘発する可能性がある
                    </td>
                  </tr>
                  <tr>
                    <td>ハードコードされた日付や古い前提を含むメモ・ルールファイル</td>
                    <td>更新されずに残り続け、誤った前提を毎セッション伝え続けてしまう</td>
                  </tr>
                  <tr>
                    <td>禁止しているパターンそのものを使って書かれたルール文書</td>
                    <td>「模範」と「指示」が矛盾し、モデルが手本の方を学習してしまう</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.callout}>
              <span className={styles.calloutLabel}>実務の進め方</span>
              <p>
                まずFable 5自身に既存の <code className={styles.inlineCode}>CLAUDE.md</code>{" "}
                やSkillファイルを読ませ、「矛盾している箇所」「弱いモデルのための保険にすぎない箇所」「模範と矛盾する箇所」を洗い出させ、削除案をレポートさせた上で、実際の削除判断は人間が行う、という「監査は任せるが決定は自分でする」進め方が有効である。
              </p>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch7">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>07</span>
              <h2>Loop Engineering: 長時間自律ループの設計思想</h2>
            </div>

            <p>
              2026年6月から7月にかけて、Fable
              5のような長時間自律動作が可能なモデルの登場と歩調を合わせる形で、&quot;Loop
              Engineering&quot;(ループ・エンジニアリング)という概念がAI開発者コミュニティで急速に広がった。これは本ガイドが参照した投稿の著者である
              Thariq Shihipar が所属する、Claude Codeチームの内外で語られている考え方でもあり、Fable
              5を実務で使いこなす上での重要な補助線になる。
            </p>

            <h3>7.1 提唱者たちの発言</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>発信者</th>
                    <th>要旨</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      Boris Cherny
                      <br />
                      <span className={styles.authorSub}>Claude Code創設者 / Anthropic</span>
                    </td>
                    <td>
                      「もうClaudeに直接プロンプトを書くことはない。プロンプトを送っているのはループの方で、私の仕事はループを書くことだ」という趣旨の発言をWorkOSのイベントで行い、大きな反響を呼んだ。
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Peter Steinberger
                      <br />
                      <span className={styles.authorSub}>OpenClaw創設者</span>
                    </td>
                    <td>
                      同様に「コーディングエージェントに直接プロンプトを書くのをやめ、エージェントにプロンプトを送るループを設計すべきだ」と発信している。
                    </td>
                  </tr>
                  <tr>
                    <td>Andrew Ng</td>
                    <td>
                      著書『The
                      Batch』にて、ソフトウェア開発を「エージェンティックコーディングループ(分単位)」「開発者フィードバックループ(時間単位)」「外部フィードバックループ(日〜週単位)」という3つの入れ子構造として整理した。人間がエージェントより多くの情報(顧客理解や審美眼など)を持っている限り、人間はこのループに関与し続ける必要があるという「文脈的優位性(context
                      advantage)」という考え方を提示している。
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Addy Osmani
                      <br />
                      <span className={styles.authorSub}>Google</span>
                    </td>
                    <td>
                      この一連の実践に &quot;Loop Engineering&quot;
                      という名前を与え、ボトルネックが「コードを書くこと」から「コードが正しく動くことを証明すること」へ移ったと論じている。
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Lance Martin
                      <br />
                      <span className={styles.authorSub}>Anthropic</span>
                    </td>
                    <td>
                      Fable
                      5を用いた実験で、独立した文脈を持つ検証用サブエージェントが自己批評よりも一貫して優れた結果を出すことを報告している。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.callout} ${styles.warn}`}>
              <span className={styles.calloutLabel}>留意点: 懐疑的な見方も存在する</span>
              <p>
                これらの発信はいずれもX(旧Twitter)上で行われ、賛否を含め活発な議論を呼んでいる。懐疑的な意見としては、「本質的にはただのwhileループにすぎない」「トークン消費が跳ね上がる」(実際にUberが社内のエージェントツール利用料を1人あたり月1,500ドルに上限設定したという報告もある)、「ベンダーの成功事例はすでにその製品を使っているユーザーからのデータであり、サンプリングバイアスがある」といった指摘も出ている。実務では、こうした肯定・否定双方の視点を踏まえて導入判断をするのが健全である。
              </p>
            </div>

            <h3>7.2 Claude Code の /goal と /loop</h3>
            <p>
              Loop Engineeringという発想を、Claude Codeでは{" "}
              <code className={styles.inlineCode}>/goal</code> コマンドと{" "}
              <code className={styles.inlineCode}>/loop</code>{" "}
              コマンドという具体的な機能として実装している。
            </p>
            <ul>
              <li>
                <b>
                  <code className={styles.inlineCode}>/goal &lt;条件&gt;</code>
                </b>
                : 検証可能な完了条件を設定すると、Fable
                5が1ターン作業するたびに、作業を行っているモデルとは別の(既定では軽量な)評価モデルがトランスクリプトを読み、条件が満たされたかどうかをYes/Noで判定する。満たされていなければ、その理由を踏まえて次のターンが自動的に始まる。
              </li>
              <li>
                <b>
                  <code className={styles.inlineCode}>/loop &lt;指示&gt;</code>
                </b>
                : 条件による判定ではなく、時間間隔で繰り返し実行する場合に使用する。
              </li>
            </ul>

            <div className={styles.diagramFrame}>
              <div className={styles.mermaid} id="diagram-5">
                <MermaidDiagram chart={DIAGRAMS.diagram5} />
              </div>
              <div className={styles.diagramCaption}>図5: /goal による検証ループのシーケンス</div>
            </div>

            <p>
              この設計の核心は、<b>「作業をするモデル」と「完了を判定するモデル」を分離している</b>
              点にある。単一のモデルに自分の仕事を自己採点させると、平凡な出来栄えでも「よくできた」と過大評価してしまう傾向があるためである。Anthropicのエンジニアリングブログでも、標準的な評価者を懐疑的にチューニングする方が、生成モデル自身に批判的な自己評価をさせるより現実的だ、という趣旨の指摘がされている。
            </p>

            <p>
              <code className={styles.inlineCode}>/goal</code>{" "}
              の条件を書く際のコツは以下の3点に集約される。
            </p>
            <ol>
              <li>
                <b>測定可能な終了状態を1つ定める</b>:
                テスト結果、ビルドの終了コード、ファイル数、キューが空になったことなど
              </li>
              <li>
                <b>どう証明するかを明記する</b>: 「
                <code className={styles.inlineCode}>npm test</code> が exit code 0
                で終わる」のように、Fableの出力自体が証拠になる形にする
              </li>
              <li>
                <b>守るべき制約を明記する</b>:
                「他のテストファイルを変更しない」など、途中で崩れてはいけない条件も書く
              </li>
            </ol>

            <p>
              評価モデルはトランスクリプトを読むだけで、コマンドを自ら実行したりファイルを直接確認したりはしない。したがって「わかりやすく体裁の整った進捗報告」と「実際に検証された事実」を混同しないよう、Fable
              5自身に根拠を明示させる指示(4.2節 of
              パターンC)と組み合わせることが重要である。また、無条件で朝まで走らせるような使い方は推奨されておらず、ターン数や時間の上限を条件に含めておくことが安全策として案内されている。
            </p>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch8">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>08</span>
              <h2>Thariq の「Unknowns フレームワーク」(参照ポスト解説)</h2>
            </div>

            <p>
              ご提示いただいた投稿(Thariq Shihipar, &quot;A Field Guide to Fable: Finding Your
              Unknowns&quot;, 2026年7月3日)は、Fable 5を使う中で著者が繰り返し学んだ教訓として「
              <b>地図は現地そのものではない</b>
              」という比喩を掲げている。ここでの「地図」とは、Fableに与えるプロンプトやSkill、コンテキストのことであり、「現地」とは実装時に実際に立ちはだかる制約や現実を指す。この投稿の核心的な主張は、エージェンティックコーディングの成否は
              <b>
                実装の前と最中に、自分自身の&quot;unknowns(未知の要素)&quot;をどれだけ明確にできるか
              </b>
              にかかっている、というものである。
            </p>

            <h3>8.1 4つの象限</h3>
            <p>
              Thariqは、政治家ドナルド・ラムズフェルドの知識分類(および後にスラヴォイ・ジジェクが加えた4つ目の区分)を借りて、プロンプトに潜む情報の非対称性を次の4象限に整理している。
            </p>

            <div className={styles.quadrant}>
              <div className={`${styles.qCell} ${styles.qKnown}`}>
                <div className={styles.qTitle}>
                  <span>QUADRANT 1</span>Known Knowns(既知の既知)
                </div>
                <div className={styles.qDesc}>
                  自分もFable
                  5も明確に理解している、明示済みの指示。例:「この関数の戻り値の型はstringにする」
                </div>
              </div>
              <div className={`${styles.qCell} ${styles.qPartial}`}>
                <div className={styles.qTitle}>
                  <span>QUADRANT 2</span>Known Unknowns(既知の未知)
                </div>
                <div className={styles.qDesc}>
                  自分が「まだ決まっていない」と認識しているギャップ。例:「エラー時の挙動をどうするかはまだ決めていない」
                </div>
              </div>
              <div className={`${styles.qCell} ${styles.qUnknown}`}>
                <div className={styles.qTitle}>
                  <span>QUADRANT 3</span>Unknown Knowns(未知の既知)
                </div>
                <div className={styles.qDesc}>
                  自分は無意識に分かっている(センス・美意識・業界の慣習など)が、言語化していない暗黙の基準。例:コードの「きれいさ」の基準を説明せずに期待している
                </div>
              </div>
              <div className={`${styles.qCell} ${styles.qPartial} ${styles.qPartialStrong}`}>
                <div className={styles.qTitle}>
                  <span>QUADRANT 4</span>Unknown Unknowns(未知の未知)
                </div>
                <div className={styles.qDesc}>
                  自分がそもそも結果に影響すると想定していなかった要因。例:想定していなかったレガシーな依存関係の存在
                </div>
              </div>
            </div>

            <p>
              Thariqの観察によれば、Fable
              5の出力品質が頭打ちになる最大の要因は、大抵この第3・第4象限、つまり
              <b>自分自身がその前提の存在にすら気づいていない領域</b>にある。開発者が「Fable
              5は要件を理解していない」と感じる場面の多くは、実際には要件そのものにこうしたunknownsが潜んでいることが原因だ、というのがこの投稿の重要な指摘である。
            </p>

            <h3>8.2 5つの実践技法</h3>
            <p>
              このフレームワークに対応する形で、Thariqは実装前・実装中・実装後の3段階にわたる5つの具体的な技法を提示している。
            </p>

            <div className={styles.diagramFrame}>
              <div className={styles.mermaid} id="diagram-6">
                <MermaidDiagram chart={DIAGRAMS.diagram6} />
              </div>
              <div className={styles.diagramCaption}>
                図6: Unknownsを段階的に可視化する5つの技法
              </div>
            </div>

            <p>
              この5つの技法に共通する狙いは、
              <b>
                第3・第4象限(Unknown Knowns / Unknown
                Unknowns)にある要素を、少しずつ第1・第2象限(Known Knowns / Known
                Unknowns)へ移していく
              </b>
              ことである。特に④のImplementation Notesは、Fable
              5が実装の各ステップに入る前に前提を書き出すことで、開発者がリアルタイムでunknownsを検知・介入できるようにする点で、9章で述べるメモリシステムや検証ループの設計とも密接に関連している。また⑤のQuiz
              &amp;
              Pitchは、完成後に成果物について小テストをしたり、ステークホルダーへのピッチのような形で設計判断を説明させたりすることで、実装中に無意識に行っていた仮定を逆に暴き出す、という点がユニークな工夫である。
            </p>

            <div className={styles.callout}>
              <span className={styles.calloutLabel}>7章との接続</span>
              <p>
                このフレームワークは、7章で紹介したLoop
                Engineeringの考え方(検証条件をどう設計するか)とも補完関係にある。
                <code className={styles.inlineCode}>/goal</code> の条件を書く作業自体が、実は「Known
                Unknowns」を「Known
                Knowns」に変換する作業そのものだと捉えると、両者のつながりが見えてくる。
              </p>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch9">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>09</span>
              <h2>検証ループとメモリシステムの設計</h2>
            </div>

            <h3>9.1 検証はサブエージェントに任せる</h3>
            <p>
              Fable 5は自己検証の精度も高いモデルだが、Anthropicの実験・Lance
              Martinの報告いずれにおいても、<b>独立した文脈を持つ検証専用のサブエージェント</b>
              が自己批評よりも一貫して優れた結果を出すことが確認されている。長時間タスクでは「[X]間隔で自分の作業を確認する仕組みを確立し、その間隔ごとにサブエージェントで仕様と照らし合わせて検証する」という趣旨の指示を、明示的にプロンプトへ含めることが推奨される。
            </p>

            <h3>9.2 ファイルベースのメモリシステム</h3>
            <p>
              Fable
              5は、過去の実行から得た教訓を記録し、それを参照できる状態にしておくと特によいパフォーマンスを発揮する。実装はシンプルなMarkdownファイルで構わない。
            </p>
            <ul>
              <li>1つの教訓につき1ファイル、先頭に一行要約をつける</li>
              <li>「なぜそれが重要だったか」も含め、修正内容・確認済みの方針の両方を記録する</li>
              <li>会話履歴やリポジトリの内容としてすでに残っている情報は保存しない</li>
              <li>既存のメモは重複作成せず更新し、誤りだと判明したメモは削除する</li>
            </ul>

            <p>
              過去のセッション群からこの仕組みを立ち上げたい場合は、Fable
              5自身にサブエージェントを使って過去のセッションを振り返らせ、テーマや教訓を抽出・保存させ、以後その保存先を参照するよう指示する、という「自己ブートストラップ」的な使い方も有効である。実際にAnthropicの内部テストでは、このような永続的なファイルベースの記憶を与えることで、
              <i>Slay the Spire</i> のようなゲームをプレイさせた際にOpus
              4.8比で成績が大幅に向上したという報告もある。
            </p>

            <h3>9.3 長時間実行特有の注意点</h3>

            <div className={`${styles.callout} ${styles.warn}`}>
              <span className={styles.calloutLabel}>早期停止</span>
              <p>
                長いセッションの終盤で、Fable
                5が「これからXを実行します」という意図表明だけをして実際のツール呼び出しをしなかったり、十分な情報があるのに許可を求めて止まってしまうことがある。「続けて」の一言で再開するが、無人運用のパイプラインでは、ユーザーが見ていないこと・確認が返せないことを明示し、可逆的な操作については確認なしで進めるよう指示しておくと安定する。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.warn}`}>
              <span className={styles.calloutLabel}>コンテキスト予算への過剰反応</span>
              <p>
                残りトークン数のカウントダウンをモデルに見せる設計だと、必要以上に「新しいセッションを始めましょうか」といった提案をしてくることがある。可能であればコンテキスト残量を明示的に見せない設計にするか、「コンテキストは十分残っているので気にせず続けてください」という一文を添えるとよい。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.warn}`}>
              <span className={styles.calloutLabel}>クライアント側のタイムアウト調整</span>
              <p>
                高いeffort設定での個個のリクエストは数分から数時間に及ぶことがある。API/ハーネスを自作している場合は、タイムアウト・ストリーミング・進捗表示の設計を見直し、ブロッキングではなく非同期的(スケジュールジョブなど)に実行状況を確認する構成に寄せることが推奨されている。
              </p>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch10">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>10</span>
              <h2>モデル選定フローとコスト管理</h2>
            </div>

            <h3>10.1 モデル選定フロー</h3>
            <div className={styles.diagramFrame}>
              <div className={styles.mermaid} id="diagram-7">
                <MermaidDiagram chart={DIAGRAMS.diagram7} />
              </div>
              <div className={styles.diagramCaption}>図7: タスク特性に応じたモデル選定の決定木</div>
            </div>

            <h3>10.2 コスト管理の考え方</h3>
            <p>
              Fable 5は入力$10/出力$50(100万トークンあたり)と、Opus
              4.8の2倍程度の単価である。すべてのターンをFable
              5で処理するのは、想定外に高額な請求につながる最も簡単な方法だとよく指摘される。実務では以下の分散が有効である。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>役割</th>
                    <th>推奨モデル</th>
                    <th>理由</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>計画・アーキテクチャ判断・最終レビュー</td>
                    <td>Fable 5</td>
                    <td>曖昧さの処理・長時間の一貫性・自己検証能力が活きる領域</td>
                  </tr>
                  <tr>
                    <td>通常の実装作業</td>
                    <td>Sonnet 5 / Opus 4.8</td>
                    <td>コストと性能のバランスが良い</td>
                  </tr>
                  <tr>
                    <td>コード検索・棚卸し・単純な反復作業</td>
                    <td>Haiku 4.5</td>
                    <td>低コストで十分な精度が出る</td>
                  </tr>
                  <tr>
                    <td>コードレビュー・診断(最終判断)</td>
                    <td>Fable 5(高effort)</td>
                    <td>「安全に出荷できるか」という判断そのものが強みを発揮する領域</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              またサブエージェントを増やすとトークン消費は単純に掛け算で増えるため、チームは小さく保ち、起動プロンプトは焦点を絞り、役目を終えたサブエージェントは早めに終了させることが推奨されている。大規模タスクの前には{" "}
              <code className={styles.inlineCode}>/model</code>{" "}
              で現在のモデルを確認し、定型作業は小さいモデルに任せる判断を習慣化すると良い。
            </p>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch11">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>11</span>
              <h2>よくある落とし穴(アンチパターン)</h2>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>アンチパターン</th>
                    <th>何が起きるか</th>
                    <th>対処</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Opus世代のプロンプトをそのまま流用する</td>
                    <td>過剰な手順指定・禁止事項がFable 5の自律的判断を阻害し、性能が落ちる</td>
                    <td>CLAUDE.md/Skillsを棚卸しし、ゴール・理由・境界・検証の4要素に再構成する</td>
                  </tr>
                  <tr>
                    <td>常に最大effort(xhigh/max)で動かす</td>
                    <td>
                      トークン消費が増えるだけでなく、過剰思考・過剰な調査で逆に遅くなることがある
                    </td>
                    <td>タスクの難度に応じてhighを基準に上下させる。導入前に効果測定する</td>
                  </tr>
                  <tr>
                    <td>「思考過程を説明して」と指示する</td>
                    <td>
                      reasoning_extractionカテゴリに抵触し、Opusへの意図しないフォールバックを誘発しうる
                    </td>
                    <td>推論の可視性が必要な場合は構造化されたthinkingブロックを読む設計にする</td>
                  </tr>
                  <tr>
                    <td>セキュリティ関連のリポジトリでFable 5をそのまま使う</td>
                    <td>初回リクエストからフォールバックが頻発し、想定より遅く・高くつく</td>
                    <td>該当領域は最初からOpus 4.8を使うか、--safe-modeで原因を切り分ける</td>
                  </tr>
                  <tr>
                    <td>すべてのサブタスクをFable 5に担わせる</td>
                    <td>コストが不必要に膨らむ</td>
                    <td>
                      オーケストレーターはFable
                      5、実装はSonnet/Opus、検索はHaiku、という階層構造にする
                    </td>
                  </tr>
                  <tr>
                    <td>無条件・無期限の/goalや自律ループを一晩放置する</td>
                    <td>想定外の挙動やコスト超過に気づけない</td>
                    <td>条件にターン数・時間の上限を含め、最初の数サイクルは監視する</td>
                  </tr>
                  <tr>
                    <td>進捗報告を鵜呑みにする</td>
                    <td>「テストが通りました」という報告が実際には未検証であるケースがある</td>
                    <td>根拠となるツール実行結果の提示を明示的に要求する</td>
                  </tr>
                  <tr>
                    <td>単一モデルによる自己採点だけで完了と判断する</td>
                    <td>平凡な出来を「良くできた」と過大評価しがちである</td>
                    <td>独立した文脈を持つ検証サブエージェントや/goalの評価モデルを併用する</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch12">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>12</span>
              <h2>実力・ベンチマークと「検証必須」の理由</h2>
            </div>

            <p>
              Fable 5は複数のベンチマークで高い成績を収めている。例えば Center for AI Safety と
              Scale AI Labs が公表した Remote Labor
              Index(実在するフリーランス案件240件を人間の専門家基準で採点するベンチマーク)では、Fable
              5は16.1%の案件で人間の専門家と同等かそれを上回る成果を出し、Opus
              4.8(8.3%)やGPT-5.5(6.3%)を上回った。ただし裏を返せば、
              <b>このベンチマークでもプロ品質に届いた案件は6件に1件程度</b>
              であり、過信は禁物である。
            </p>

            <div className={styles.specGrid}>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>Fable 5</div>
                <div className={styles.specValue}>16.1%</div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>Opus 4.8</div>
                <div className={styles.specValue}>8.3%</div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>GPT-5.5</div>
                <div className={styles.specValue}>6.3%</div>
              </div>
            </div>
            <p className={styles.specCaption}>
              Remote Labor Index: 人間の専門家と同等以上と判定された案件の割合
            </p>

            <p>
              法律分野の実践検証を行った Artificial Lawyer の記事では、Fable
              5は個別の評価基準(criteria)ベースでは約90%の精度で正答する一方、法律文書の完成品全体として完全に正しいと言える出力は約11%程度にとどまったと報告されている。これは「部分点は高いが、成果物全体を無検証でそのまま採用するのは危険」という典型的な傾向を示しており、Fable
              5に限らず高性能モデル全般に当てはまる教訓である。専門性が求められる領域では、人間によるレビューを省略しない設計が引き続き重要である。
            </p>

            <div className={styles.callout}>
              <span className={styles.calloutLabel}>
                &quot;Claudish&quot;の噂に見る一次情報の重要性
              </span>
              <p>
                Fable
                5をめぐっては「長時間の複数エージェントセッションで独自の省略言語(通称&quot;Claudish&quot;)を発達させる」という噂がSNS上で広がったが、これを多角的に裏取りした分析記事では、そのような現象の出どころは確認できず、実際に文書化されているのは「長時間セッションの終盤で、ユーザー向けの要約が矢印の連鎖のような密な省略表現になりやすい」という、より地味な挙動だったと結論づけられている。Anthropic自身もこの挙動を認識しており、最終的な要約では省略表現を避け、完全な文章で書き直すよう促す一文を加える対処法を公式ガイドに含めている。この一件は、AIモデルに関する派手な噂ほど、一次情報(公式ドキュメントやAPIの挙動そのもの)に立ち返って検証する価値がある、という良い教訓例である。
              </p>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch13">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>13</span>
              <h2>既知の制限事項</h2>
            </div>

            <ul>
              <li>
                <b>Zero Data Retention(ZDR)非対応</b>: Fable 5・Mythos
                5はいずれも30日間データ保持の「Covered
                Model」であり、ZDRの対象外である。厳格なデータ保持要件がある組織は、Claude Codeの
                <code className={styles.inlineCode}>/model</code>ピッカー上でFable
                5が非表示または無効化されている場合がある。
              </li>
              <li>
                <b>実在する公人になり代わった発言はできない</b>:
                創作におけるフィクションのキャラクターは問題ないが、実言する著名人の発言として言葉を作り出すことは避ける設計になっている。
              </li>
              <li>
                <b>サイバーセキュリティ・生物学領域は不得手というより「意図的に不可」</b>:
                該当領域での能力そのものはMythos 5と共通だが、Fable
                5では安全分類器によって意図的にOpus 4.8へフォールバックするよう設計されている。
              </li>
              <li>
                <b>モデルは日々アップデートされる</b>:
                本ガイド執筆時点(2026年7月上旬)の情報であり、価格・利用枠・分類器の精度・コマンド仕様などは今後変更される可能性がある。特に無料利用枠の条件(2026年7月7日ごろまでの週次利用枠上限50%)は近い将来に変わることが予告されている。最新情報は必ず公式ドキュメントで確認してほしい。
              </li>
            </ul>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch14">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>14</span>
              <h2>まとめ</h2>
            </div>

            <p>
              Claude Fable 5をClaude Codeで使いこなす上でのポイントを一言でまとめると、
              <b>「細かく指示する」から「ゴールと検証基準を渡し、あとは任せる」への発想転換</b>
              に尽きる。これは単なるプロンプトの書き方の変化ではなく、
            </p>
            <ul>
              <li>モデル選定(Fable 5をオーケストレーター、他モデルをワーカーに据える階層設計)</li>
              <li>Effortレベルの使い分け</li>
              <li>
                検証ループの設計(<code className={styles.inlineCode}>/goal</code>
                、独立した検証サブエージェント)
              </li>
              <li>メモリシステム(ファイルベースの教訓の蓄積)</li>
              <li>自分自身のunknownsを可視化する技法(Thariqのフレームワーク)</li>
            </ul>
            <p>
              という複数のレイヤーにまたがる設計思想の転換である。同時に、ベンチマーク上の高い成績や華々しい発表の裏にも、部分点と完成品の間には依然としてギャップがあること、SNS上の噂は一次情報で裏取りする必要があることも忘れずに、実務では検証を省略しない姿勢を保つことが重要である。
            </p>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch15">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>15</span>
              <h2>参考文献・ソースURL一覧</h2>
            </div>

            <div className={styles.refGroup}>
              <h4>公式ドキュメント・公式発表(Anthropic)</h4>
              <ul className={styles.refList}>
                <li>
                  <span className={styles.refTitle}>
                    Anthropic「Claude Fable 5 and Claude Mythos 5」(発表記事)
                  </span>
                  <a
                    href="https://www.anthropic.com/news/claude-fable-5-mythos-5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.anthropic.com/news/claude-fable-5-mythos-5
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Anthropic「Redeploying Claude Fable 5」(輸出規制解除後の復旧に関する声明)
                  </span>
                  <a
                    href="https://www.anthropic.com/news/redeploying-fable-5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.anthropic.com/news/redeploying-fable-5
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Claude Platform Docs「Introducing Claude Fable 5 and Claude Mythos 5」
                  </span>
                  <a
                    href="https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Claude Platform Docs「Prompting Claude Fable
                    5」(公式プロンプトガイド、本ガイド4章・6章の一次情報)
                  </span>
                  <a
                    href="https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Claude Platform Docs「Prompting best practices」
                  </span>
                  <a
                    href="https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Claude Code Docs「Model
                    configuration」(モデル選択・effort設定・自動フォールバックの一次情報)
                  </span>
                  <a
                    href="https://code.claude.com/docs/en/model-config"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://code.claude.com/docs/en/model-config
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Claude Code Docs「Orchestrate subagents at scale with dynamic workflows」
                  </span>
                  <a
                    href="https://code.claude.com/docs/en/workflows"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://code.claude.com/docs/en/workflows
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Claude Code Docs「Run agents in parallel」
                  </span>
                  <a
                    href="https://code.claude.com/docs/en/agents"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://code.claude.com/docs/en/agents
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Claude Code Docs「Run parallel sessions with worktrees」
                  </span>
                  <a
                    href="https://code.claude.com/docs/en/worktrees"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://code.claude.com/docs/en/worktrees
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Claude Code Docs「Keep Claude working toward a goal」(/goalコマンドの一次情報)
                  </span>
                  <a
                    href="https://code.claude.com/docs/en/goal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://code.claude.com/docs/en/goal
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>Claude Code Docs「Glossary」</span>
                  <a
                    href="https://code.claude.com/docs/en/glossary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://code.claude.com/docs/en/glossary
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>Claude Code Docs「Subagents in the SDK」</span>
                  <a
                    href="https://code.claude.com/docs/en/agent-sdk/subagents"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://code.claude.com/docs/en/agent-sdk/subagents
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.refGroup}>
              <h4>著名な開発者・業界関係者の発信(引用元の投稿を含む)</h4>
              <ul className={styles.refList}>
                <li>
                  <span className={styles.refTitle}>
                    Thariq Shihipar(Anthropic, Claude Codeチーム)「A Field Guide to Fable: Finding
                    Your Unknowns」― 本ガイドで提示いただいた投稿。8章の一次情報
                  </span>
                  <a
                    href="https://x.com/trq212/status/2073100352921215386"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://x.com/trq212/status/2073100352921215386
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Thariq Shihipar「Fable is a step-change in models...」― Fable 5導入後のClaude
                    Codeチームの働き方変化に関する投稿。4章で言及
                  </span>
                  <a
                    href="https://x.com/trq212/status/2064437561930682672"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://x.com/trq212/status/2064437561930682672
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    ClaudeDevs(Anthropic公式アカウント)「Claude Fable 5 changed how we work on the
                    Claude Code team day to day」
                  </span>
                  <a
                    href="https://x.com/ClaudeDevs/status/2064399512664526853"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://x.com/ClaudeDevs/status/2064399512664526853
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Andrew Ng「My 3 key loops for building 0-to-1 products」(The Batch,
                    2026年6月26日号。7章の一次情報)
                  </span>
                  <a
                    href="https://x.com/AndrewYNg/status/2071988145667928442"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://x.com/AndrewYNg/status/2071988145667928442
                  </a>
                  {" / "}
                  <a
                    href="https://www.deeplearning.ai/the-batch/issue-359"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.deeplearning.ai/the-batch/issue-359
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.refGroup}>
              <h4>分析・解説記事(二次情報、事実確認のうえ引用)</h4>
              <ul className={styles.refList}>
                <li>
                  <span className={styles.refTitle}>
                    AlphaSignal AI「How to Actually Prompt Claude Fable
                    5」(公式ガイドの実務的な要約)
                  </span>
                  <a
                    href="https://alphasignalai.substack.com/p/how-to-actually-prompt-claude-fable"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://alphasignalai.substack.com/p/how-to-actually-prompt-claude-fable
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Ken Huang「Claude Fable 5: What Changed, and How to Stop Prompting It Like
                    Opus」(&quot;Claudish&quot;の噂の裏取りを含む)
                  </span>
                  <a
                    href="https://kenhuangus.substack.com/p/claude-fable-5-what-changed-and-how"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://kenhuangus.substack.com/p/claude-fable-5-what-changed-and-how
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Wavect Blog「Fable Is Back. Here's How to Actually Code With It」(Claude
                    Codeでの実践的なモデルルーティング例)
                  </span>
                  <a
                    href="https://wavect.io/blog/coding-with-claude-fable-5/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://wavect.io/blog/coding-with-claude-fable-5/
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    MCP.Directory「Fable 5 in Claude Code: Routing &amp;
                    Limits」(サブエージェント設定・フォールバック挙動の実務ガイド)
                  </span>
                  <a
                    href="https://mcp.directory/blog/fable-5-claude-code-model-routing-guide-2026"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://mcp.directory/blog/fable-5-claude-code-model-routing-guide-2026
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Product Compass「Claude Fable 5 for PMs: Ultimate Guide」(CLAUDE.md棚卸しの実例)
                  </span>
                  <a
                    href="https://www.productcompass.pm/p/claude-fable-5-guide"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.productcompass.pm/p/claude-fable-5-guide
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    Artificial Lawyer「Anthropic's 'Dangerous' Fable Is Back! How Does It
                    Do?」(法律分野での実力検証。12章の一次情報)
                  </span>
                  <a
                    href="https://www.artificiallawyer.com/2026/07/02/anthropics-dangerous-fable-is-back-how-does-it-do/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.artificiallawyer.com/2026/07/02/anthropics-dangerous-fable-is-back-how-does-it-do/
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    The Rundown AI「Anthropic's Fable returns
                    worldwide」(復旧後の分類器精度に関する報道)
                  </span>
                  <a
                    href="https://www.therundown.ai/p/anthropic-fable-returns-worldwide"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.therundown.ai/p/anthropic-fable-returns-worldwide
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    dsebastien.net「Loop Engineering Went Mainstream」(Loop
                    Engineeringを巡る賛否両論のまとめ、Boris Cherny/Peter Steinberger発言の出典)
                  </span>
                  <a
                    href="https://www.dsebastien.net/loop-engineering-went-mainstream/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.dsebastien.net/loop-engineering-went-mainstream/
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    VentureBeat「Claude Code's '/goals' separates the agent that works from the one
                    that decides it's done」
                  </span>
                  <a
                    href="https://venturebeat.com/orchestration/claude-codes-goals-separates-the-agent-that-works-from-the-one-that-decides-its-done"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://venturebeat.com/orchestration/claude-codes-goals-separates-the-agent-that-works-from-the-one-that-decides-its-done
                  </a>
                </li>
                <li>
                  <span className={styles.refTitle}>
                    TechTimes「Claude Fable 5 Is Back: Safety Classifiers Now Reroute Security Agent
                    Loops」(輸出規制の経緯とLoop Engineeringの接続)
                  </span>
                  <a
                    href="https://www.techtimes.com/articles/319665/20260703/claude-fable-5-back-safety-classifiers-now-reroute-security-agent-loops.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.techtimes.com/articles/319665/20260703/claude-fable-5-back-safety-classifiers-now-reroute-security-agent-loops.htm
                  </a>
                </li>
              </ul>
              <p className={styles.refNote}>
                注記:
                上記のうち個人ブログ・メディア記事(二次情報)は、公式ドキュメントと突き合わせて事実確認を行った上で本ガイドに反映している。とはいえAI分野は情報の更新が非常に速いため、実装に移す前に必ず一次情報(公式ドキュメント)側の最新記載を確認してほしい。
              </p>
            </div>
          </section>

          <footer className={styles.pageFooter}>
            Claude Fable 5 実践活用ガイド ― 2026年7月4日時点の情報にもとづく
          </footer>
        </div>
      </main>

      <TocObserver />
    </div>
  );
}
