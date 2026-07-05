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
};

export default function Fable5BestPracticesPage() {
  return (
    <div className={styles.pageContainer}>
      <aside className={styles.sidebar}>
        <a href="#top" className={styles.brand}>
          <div className={styles.brandMark}>F5</div>
          <div className={styles.brandText}>
            Claude Fable 5
            <span className={styles.brandSub}>Best Practices</span>
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
              Claude Codeエンジニアのための中級〜上級者向けベストプラクティス。「指示を積み上げる」から「ゴールと検証基準を渡して任せる」へ ― Fable 5に最適化された思考法をステップバイステップで解説する。
            </p>
            <div className={styles.heroAudience}>
              <b>対象読者:</b> Claude Codeを日常的に使っており、Opus / Sonnet世代のプロンプト設計には慣れているが、Fable 5特有の挙動にまだ最適化できていないエンジニア。
              <br />
              <br />
              <b>情報時点:</b> 2026年7月4日。Fable 5は現在進行形でアップデートされているモデルのため、記載内容は今後変わる可能性がある。
            </div>
          </header>

          <section className={`${styles.chapter} chapter`} id="ch1">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>01</span>
              <h2>Claude Fable 5 とは何か</h2>
            </div>

            <p>
              Claude Fable 5 は、Anthropic が2026年6月9日に発表した「Claude 5」世代の最初のモデルで、Opus よりも上位に位置づけられる新しい「Mythos」クラスの一般提供版である。同時に発表された <b>Claude Mythos 5</b> は同一の基盤モデルを共有しているが、Fable 5 にのみ追加の安全分類器(セーフガード)が搭載されている点が異なる。Mythos 5 は &quot;Project Glasswing&quot; という信頼されたパートナー向けプログラムを通じてのみ限定提供されている。
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
                    <td>Anthropicが一般提供する中で最も高性能なモデル。長時間・高難度・曖昧なタスク向け</td>
                  </tr>
                  <tr>
                    <td>提供チャネル</td>
                    <td>
                      Claude API / Claude Platform on AWS / Amazon Bedrock / Google Cloud / Microsoft Foundry / Claude Code / Claude.ai / Claude Cowork
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
              <div className={styles.diagramCaption}>図1: Fable 5 / Mythos 5 / Project Glasswing の関係</div>
            </div>

            <p>
              Fable 5 と Mythos 5 は「同じ頭脳、異なる安全装備」というイメージで捉えると理解しやすい。Fable 5 は分類器というガードレールを装備することで安全に広く配布できるようにした版、Mythos 5 はガードレールなしで信頼できるパートナーにのみ渡す版、という棲み分けである。
            </p>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch2">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>02</span>
              <h2>タイムライン: リリースから輸出規制、復旧まで</h2>
            </div>

            <p>
              Fable 5 は発表から1ヶ月足らずで、一度サービス停止という大きな出来事を経験している。プロンプト設計とは直接関係ないが、可用性設計(フォールバックの必要性)を理解する上で重要な背景である。
            </p>

            <div className={styles.timeline}>
              <div className={styles.tItem}>
                <div className={styles.tDate}>2026-06-09</div>
                <div className={styles.tBody}>
                  <b>Fable 5 / Mythos 5 発表・一般提供開始。</b>
                  Claude 5世代の最初のモデルとして、Claude API・Claude Code・Claude.ai等で同時に利用可能になった。
                </div>
              </div>
              <div className={styles.tItem}>
                <div className={styles.tDate}>2026-06-12</div>
                <div className={styles.tBody}>
                  <b>米商務省が輸出規制を適用、全世界でアクセスを一時停止。</b>
                  Amazonの研究者がFable 5の安全策を回避してソフトウェア脆弱性を特定できる手法を発見・報告したことがきっかけ。外国籍ユーザーを区別する即時的な手段がなかったため、全ユーザー向けに停止された。
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
                  Claude Code / Claude.ai / API / Cowork を含む全チャネルで利用可能に。分類器の精度は強化され、サイバーセキュリティ関連の誤検知率も改善されたと報告されている。
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
                この一件は、「Fable 5 に固定的に依存する設計は避け、フォールバック先(Opus 4.8 など)を必ず用意しておく」という教訓を残した。一時停止の経緯についての公式声明は、Anthropicのニュースページで確認できる(巻末の参考文献を参照)。次章で解説する自動フォールバック機構は、まさにこの種のリスクに対する備えとしても機能する。
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
                <b>サイバーセキュリティ</b>: 攻撃的なエクスプロイト・マルウェア・攻撃ツールの構築など
              </li>
              <li>
                <b>生物学・生命科学</b>: 実験手法や分子メカニズムに関する内容など
              </li>
              <li>
                <b>推論内容の抽出</b>: モデルの要約された思考過程をそのまま応答に転記させようとする指示
              </li>
            </ul>
            <p>
              これらに該当すると判定されたリクエストは、Fable 5では <code className={styles.inlineCode}>stop_reason: &quot;refusal&quot;</code> として拒否されるか、Claude Codeのようなハーネス上では自動的にOpus 4.8へフォールバックする。Anthropicの公表によれば、<b>Fable 5セッションの95%超はフォールバックが一切発生しない</b>とのことである。
            </p>

            <h3>3.1 リクエストのライフサイクル</h3>
            <div className={styles.diagramFrame}>
              <div className={styles.mermaid} id="diagram-2">
                <MermaidDiagram chart={DIAGRAMS.diagram2} />
              </div>
              <div className={styles.diagramCaption}>図2: 安全分類器によるフォールバックのライフサイクル</div>
            </div>

            <h3>3.2 実務上の注意点</h3>

            <h4>初回リクエストだけで発火することがある</h4>
            <p>
              フォールバックはユーザーの発言内容だけでなく、セッション開始時に一緒に送られる <code className={styles.inlineCode}>CLAUDE.md</code> の内容や <code className={styles.inlineCode}>git status</code>、ディレクトリ名などのワークスペース情報も判定対象に含む。セキュリティ関連や生物学関連の資料がリポジトリに含まれているだけで、何も入力していない段階でフォールバックすることがある。
            </p>

            <h4>トリガー源の切り分け</h4>
            <p>
              <code className={styles.inlineCode}>claude --safe-mode</code> で起動すると、CLAUDE.md・Skills・MCPサーバー・Hooksなどのカスタマイズを無効化してセッションを開始できるため、フォールバックの原因がカスタマイズ側にあるのか、リクエスト内容そのものにあるのかを切り分けられる。
            </p>

            <h4>セキュリティ研究・生物学系タスクは高頻度でフォールバックする</h4>
            <p>
              ペネトレーションテストやCTF演習、生物学隣接のコードベースなどは、初回リクエストから頻繁にフォールバックが発生する「想定内の挙動」である。これはアカウントへのペナルティではない。Fable級の能力がどうしても必要な場合は、Anthropicの信頼されたアクセスプログラムへの相談が推奨されている。
            </p>

            <h4>自動切り替えを無効化し、都度確認する設定も可能</h4>
            <p>
              <code className={styles.inlineCode}>/config</code> から「switch models when a message is flagged」をオフにすると、フラグが立った際にセッションを一時停止し、Opusへの切り替えか、プロンプトを編集してFable 5のまま再試行するかを選べるようになる。
            </p>

            <h4>サードパーティ基盤(Bedrock/Vertex/Foundry)での自動フォールバック</h4>
            <p>
              モデルIDがプロバイダ固有であるため、<code className={styles.inlineCode}>ANTHROPIC_DEFAULT_FABLE_MODEL</code> と <code className={styles.inlineCode}>ANTHROPIC_DEFAULT_OPUS_MODEL</code> を設定して、Claude CodeがどちらのモデルがFable 5/Opus 4.8であるかを認識できるようにする必要がある。
            </p>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch4">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>04</span>
              <h2>プロンプティング思想の転換: チェックリストからゴールへ</h2>
            </div>

            <p>
              これはFable 5を使いこなす上で最も重要な認識転換である。Anthropic公式の「Prompting Claude Fable 5」ガイドは、旧世代向けに書かれた作り込み過ぎた指示(過剰な手順列挙・網羅的な禁止事項・逐次的な確認要求など)が、Fable 5ではむしろ性能を落とす場合があると明記している。Fable 5は指示追従性が大幅に向上しているため、行動を一つひとつ列挙するのではなく、短い指示で意図を伝える方が有効に機能する。
            </p>

            <h3>4.1 旧来のスタイル vs Fable 5向けのスタイル</h3>
            <div className={styles.patternPair}>
              <div className={`${styles.patternCard} ${styles.old}`}>
                <span className={styles.patternTag}>Before ― Opus世代の習慣</span>
                <p>
                  手順を逐一列挙する → 禁止事項を網羅的に書き出す → 思考過程を逐一報告させる。過剰な制約がむしろFable 5の性能を落とす。
                </p>
              </div>
              <div className={`${styles.patternCard} ${styles.new}`}>
                <span className={styles.patternTag}>After ― Fable 5向け</span>
                <p>
                  ゴールと「なぜそれが必要か」を伝える → 越えてはいけない境界だけを明示する → 検証方法を明示する。自律的な判断力を最大限活かせる。
                </p>
              </div>
            </div>

            <div className={styles.callout}>
              <span className={styles.calloutLabel}>Claude Codeチームの声</span>
              <p>
                Anthropic Claude Codeチームのエンジニアである Thariq Shihipar(@trq212)は、Fable 5導入後のチーム内の働き方の変化を「以前は &quot;Claudeが正しく作業したか&quot; を検証していたが、今は &quot;そもそも正しい作業をしているか&quot; を検証するようになった」という趣旨で表現している。これは、成果物の細部を逐一チェックする姿勢から、そもそもの方向性・スコープが合っているかを見る姿勢への転換を意味しており、上記の「チェックリストからゴールへ」という転換と同じ現象を、検証者側の視点から語ったものだと言える。
              </p>
            </div>

            <h3>4.2 実践プロンプトパターン(概念の再構成・自作例)</h3>
            <p>
              以下は公式ガイドが示す考え方を踏まえて筆者が独自に組み立てた、Claude Codeでそのまま使える日本語プロンプト断片の例である。用途に応じて適宜書き換えてほしい。
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
              <div className={styles.codeBlockLabel}>パターン B ― 過剰な深掘り・改変を防ぐ境界指定</div>
              <pre>
                <code className="language-text">
                  このタスクに必要な範囲を超えて、機能追加・リファクタリング・抽象化を{"\n"}
                  行わないでください。バグ修正には周辺の整理は不要です。まだ発生していない{"\n"}
                  シナリオのためのエラーハンドリングやフォールバックは追加しないでください。
                </code>
              </pre>
            </div>

            <div className={styles.codeBlock}>
              <div className={styles.codeBlockLabel}>パターン C ― 進捗報告は「ツール結果に基づく事実」だけを許可する</div>
              <pre>
                <code className="language-text">
                  進捗を報告する前に、このセッション内のツール実行結果を根拠として{"\n"}
                  各主張を確認してください。根拠を示せない内容は報告しないでください。{"\n"}
                  テストが失敗していれば失敗した旨と出力を、未検証であれば未検証である旨を、{"\n"}
                  率率に伝えてください。
                </code>
              </pre>
            </div>

            <div className={styles.codeBlock}>
              <div className={styles.codeBlockLabel}>パターン D ― 自律実行中の「許可待ち」を防ぐ</div>
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
              Fable 5における性能・速度・コストのトレードオフを制御する最も重要なパラメータが <code className={styles.inlineCode}>effort</code> である。API上はモデルパラメータとして、Claude Code上は <code className={styles.inlineCode}>/effort</code> コマンドやモデルピッカーのスライダーとして操作する。
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
                    <td><code className={styles.inlineCode}>low</code></td>
                    <td>高速・低コスト。知的な深さは犠牲になる</td>
                    <td>レイテンシ重視で知的難度が低い、短く範囲の狭いタスク</td>
                  </tr>
                  <tr>
                    <td><code className={styles.inlineCode}>medium</code></td>
                    <td>コストを抑えつつ、ある程度の知性を維持</td>
                    <td>コスト重視で多少の知性低下を許容できる作業</td>
                  </tr>
                  <tr>
                    <td><code className={styles.inlineCode}>high</code></td>
                    <td>トークン消費と知性のバランスが良い(Fable 5の既定値)</td>
                    <td>大半のコーディング・エージェント作業</td>
                  </tr>
                  <tr>
                    <td><code className={styles.inlineCode}>xhigh</code></td>
                    <td>より深い推論、トークン消費は増加</td>
                    <td>能力の上限が求められる難しいワークロード</td>
                  </tr>
                  <tr>
                    <td><code className={styles.inlineCode}>max</code></td>
                    <td>最も深い推論。過剰思考になりやすく収穫逓減の傾向あり</td>
                    <td>導入前に必ず個別タスクで効果測定を行う。セッション限定設定</td>
                  </tr>
                  <tr>
                    <td><code className={styles.inlineCode}>ultracode</code></td>
                    <td>
                      Claude Code独自の設定。xhighに加え、実質的なタスクごとにDynamic Workflowsを自動計画
                    </td>
                    <td>大規模タスクの自動オーケストレーションが必要な場合。セッション限定設定</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Anthropic公式ガイドは「まず<code className={styles.inlineCode}>high</code>を既定とし、最も能力が求められる作業に<code className={styles.inlineCode}>xhigh</code>を、日常的な定型作業には<code className={styles.inlineCode}>medium</code>/<code className={styles.inlineCode}>low</code>を検討する」ことを推奨している。興味深いのは、<b>Fable 5の低いeffort設定でも、旧モデルのxhigh設定を上回る性能が出ることが多い</b>という指摘である。つまり「常に最大effortを使う」のは必ずしも最適ではない。
            </p>

            <h3>5.2 Effortの決定優先順位</h3>
            <div className={styles.diagramFrame}>
              <div className={styles.mermaid} id="diagram-3">
                <MermaidDiagram chart={DIAGRAMS.diagram3} />
              </div>
              <div className={styles.diagramCaption}>図3: Claude CodeにおけるEffortレベルの決定優先順位</div>
            </div>

            <p>
              なお、<code className={styles.inlineCode}>ultrathink</code> というキーワードをプロンプト中に含めると、セッションのeffort設定を変えずにそのターンだけ深い推論をリクエストできる。一方で「think」「think hard」など他の言い回しは特別なキーワードとしては認識されず、通常の文章として扱われる点に注意してほしい。
            </p>

            <h3>5.3 過剰思考を防ぐ指示例</h3>
            <p>
              高いeffortで動かすと、Fable 5がタスクに必要な範囲を超えて調査・熟考してしまうことがある。これを防ぐには、4.2節のパターンBのような境界指定が有効である。
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
              <li>セッション中: <code className={styles.inlineCode}>/model fable</code></li>
              <li>起動時: <code className={styles.inlineCode}>claude --model fable</code></li>
              <li>環境変数: <code className={styles.inlineCode}>ANTHROPIC_MODEL=fable</code></li>
              <li>
                設定ファイル: <code className={styles.inlineCode}>settings.json</code> の <code className={styles.inlineCode}>model</code> フィールド
              </li>
            </ul>
            <p>
              <code className={styles.inlineCode}>best</code> エイリアスは、組織がFable 5にアクセスできる場合はFable 5を、そうでない場合は最新のOpusを指すよう自動解決される。バージョンを固定したい場合はエイリアスではなく完全なモデル名(<code className={styles.inlineCode}>claude-fable-5</code>)を指定してほしい。
            </p>

            <h3>6.2 Fable 5から最大限の成果を引き出すための基本方針</h3>
            <p>Claude Code公式ドキュメントは、Fable 5の使い方について次の4点を挙げている。</p>
            <ol>
              <li>
                <b>手順ではなく結果を説明する</b>: 欲しい結果を渡し、経路の計画はモデルに任せる。その結果を維持し続けたい場合は <code className={styles.inlineCode}>/goal</code> を設定する。
              </li>
              <li>
                <b>曖昧な問題を渡す</b>: 根本原因の調査、障害対応、アーキテクチャ判断など、追加の調査・検証が効果を発揮する領域に向いている。
              </li>
              <li>
                <b>検証の念押しを省く</b>: Fable 5は指示が少なくても自ら検証を行うため、「テストして」「確認して」といったリマインダーは基本的に不要。
              </li>
              <li>
                <b>タスクのサイズを大きくする</b>: 通常は分割するような作業も、そのままのサイズで渡してよい。長いセッションでも文脈を見失いにくい。
              </li>
            </ol>

            <h3>6.3 サブエージェント戦略</h3>
            <p>
              Fable 5は並列サブエージェントのディスパッチ・維持において旧モデルより大幅に信頼性が向上している。実務上は、Fable 5を高コストな「判断役」に据え、実装の大部分は安価なモデルに任せる<b>階層型のモデルルーティング</b>が推奨される。
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
              サブエージェントのモデルは、<code className={styles.inlineCode}>.claude/agents/</code> 配下のfrontmatterで <code className={styles.inlineCode}>model: sonnet</code> のように指定できる。優先順位は「<code className={styles.inlineCode}>CLAUDE_CODE_SUBAGENT_MODEL</code> 環境変数 &gt; Agentツールの呼び出し時パラメータ &gt; frontmatter &gt; メインセッションのモデル」の順である。独立したサブタスクはサブエージェントに委任し、完了を待たずに他の作業を継続する非同期的な連携が推奨されている。長時間稼働するサブエージェントは文脈を保持し続けることで、キャッシュ読み込みの恩恵を受けられ、最も遅いサブエージェントによるボトルネックも避けられる。
            </p>

            <h3>6.4 Dynamic Workflows(ultracode)の活用</h3>
            <p>
              1つの会話では調整しきれないほど多くのエージェントが必要なタスク(コードベース全体の監査、数百ファイル規模の移行、相互検証が必要な調査など)には、Dynamic Workflowsが適している。これはFable 5(または他モデル)がタスクのためのオーケストレーションスクリプトを自身で書き、バックグラウンドで実行する仕組みである。
            </p>
            <ul>
              <li>
                プロンプト中に <code className={styles.inlineCode}>ultracode</code> というキーワードを含めるか、「ワークフローを使って」と自然言語で依頼すると、その場でワークフローが起動する。
              </li>
              <li>
                <code className={styles.inlineCode}>/effort ultracode</code> を設定すると、セッション内のすべての実質的なタスクに対してワークフローを自動計画するようになる(トークン消費・時間は増加する)。
              </li>
              <li>実行状況は <code className={styles.inlineCode}>/workflows</code> で一覧・進捗確認ができる。</li>
              <li>
                うまく機能したワークフローはコマンドとして保存し、<code className={styles.inlineCode}>/</code>のオートコンプリートから再利用できる。
              </li>
            </ul>

            <h3>6.5 Worktreeによる並列実験</h3>
            <p>
              <code className={styles.inlineCode}>claude --worktree</code> を使うと、独立したgit worktree上でセッションを起動でき、複数のセッションが同じファイルを同時に編集する衝突を避けられる。Fable 5に複数の実装方針を提案させ、それぞれを別のworktree上で(コストの低いモデルの)サブエージェントに実装させた上で、差分をFable 5に持ち帰らせて比較・選定させる、といった使い方が実務では有効である。
            </p>

            <h3>6.6 CLAUDE.md / Skillsの再設計</h3>
            <p>
              Fable 5への移行時に最も見落とされがちなのが、<b>旧モデル向けに書かれた過剰に規範的な指示の棚卸し</b>である。公式ガイドは「旧モデル向けに開発されたSkillは、Fable 5にとって規範的すぎることが多く、出力品質を下げる可能性がある」と明記している。
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
                    <td>Fable 5は自ら計画を立てられるため、過剰な手順指定が創造的な判断を阻害する</td>
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
                      <code className={styles.inlineCode}>reasoning_extraction</code> の拒否カテゴリに抵触し、Opusへのフォールバックを誘発する可能性がある
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
                まずFable 5自身に既存の <code className={styles.inlineCode}>CLAUDE.md</code> やSkillファイルを読ませ、「矛盾している箇所」「弱いモデルのための保険にすぎない箇所」「模範と矛盾する箇所」を洗い出させ、削除案をレポートさせた上で、実際の削除判断は人間が行う、という「監査は任せるが決定は自分でする」進め方が有効である。
              </p>
            </div>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch7">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>07</span>
              <h2>Loop Engineering: 長時間自律ループの設計思想</h2>
            </div>

            <p>
              2026年6月から7月にかけて、Fable 5のような長時間自律動作が可能なモデルの登場と歩調を合わせる形で、&quot;Loop Engineering&quot;(ループ・エンジニアリング)という概念がAI開発者コミュニティで急速に広がった。これは本ガイドが参照した投稿の著者である Thariq Shihipar が所属する、Claude Codeチームの内外で語られている考え方でもあり、Fable 5を実務で使いこなす上での重要な補助線になる。
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
                      Boris Cherny<br />
                      <span className={styles.brandSub} style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                        Claude Code創設者 / Anthropic
                      </span>
                    </td>
                    <td>
                      「もうClaudeに直接プロンプトを書くことはない。プロンプトを送っているのはループの方で、私の仕事はループを書くことだ」という趣旨の発言をWorkOSのイベントで行い、大きな反響を呼んだ。
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Peter Steinberger<br />
                      <span className={styles.brandSub} style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                        OpenClaw創設者
                      </span>
                    </td>
                    <td>
                      同様に「コーディングエージェントに直接プロンプトを書くのをやめ、エージェントにプロンプトを送るループを設計すべきだ」と発信している。
                    </td>
                  </tr>
                  <tr>
                    <td>Andrew Ng</td>
                    <td>
                      著書『The Batch』にて、ソフトウェア開発を「エージェンティックコーディングループ(分単位)」「開発者フィードバックループ(時間単位)」「外部フィードバックループ(日〜週単位)」という3つの入れ子構造として整理した。人間がエージェントより多くの情報(顧客理解や審美眼など)を持っている限り、人間はこのループに関与し続ける必要があるという「文脈的優位性(context advantage)」という考え方を提示している。
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Addy Osmani<br />
                      <span className={styles.brandSub} style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                        Google
                      </span>
                    </td>
                    <td>
                      この一連の実践に &quot;Loop Engineering&quot; という名前を与え、ボトルネックが「コードを書くこと」から「コードが正しく動くことを証明すること」へ移ったと論じている。
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Lance Martin<br />
                      <span className={styles.brandSub} style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                        Anthropic
                      </span>
                    </td>
                    <td>
                      Fable 5を用いた実験で、独立した文脈を持つ検証用サブエージェントが自己批評よりも一貫して優れた結果を出すことを報告している。
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
              Loop Engineeringという発想を、Claude Codeでは <code className={styles.inlineCode}>/goal</code> コマンドと <code className={styles.inlineCode}>/loop</code> コマンドという具体的な機能として実装している。
            </p>
            <ul>
              <li>
                <b><code className={styles.inlineCode}>/goal &lt;条件&gt;</code></b>: 検証可能な完了条件を設定すると、Fable 5が1ターン作業するたびに、作業を行っているモデルとは別の(既定では軽量な)評価モデルがトランスクリプトを読み、条件が満たされたかどうかをYes/Noで判定する。満たされていなければ、その理由を踏まえて次のターンが自動的に始まる。
              </li>
              <li>
                <b><code className={styles.inlineCode}>/loop &lt;指示&gt;</code></b>: 条件による判定ではなく、時間間隔で繰り返し実行する場合に使用する。
              </li>
            </ul>

            <div className={styles.diagramFrame}>
              <div className={styles.mermaid} id="diagram-5">
                <MermaidDiagram chart={DIAGRAMS.diagram5} />
              </div>
              <div className={styles.diagramCaption}>図5: /goal による検証ループのシーケンス</div>
            </div>

            <p>
              この設計の核心は、<b>「作業をするモデル」と「完了を判定するモデル」を分離している</b>点にある。単一のモデルに自分の仕事を自己採点させると、平凡な出来栄えでも「よくできた」と過大評価してしまう傾向があるためである。Anthropicのエンジニアリングブログでも、標準的な評価者を懐疑的にチューニングする方が、生成モデル自身に批判的な自己評価をさせるより現実的だ、という趣旨の指摘がされている。
            </p>

            <p><code className={styles.inlineCode}>/goal</code> の条件を書く際のコツは以下の3点に集約される。</p>
            <ol>
              <li>
                <b>測定可能な終了状態を1つ定める</b>: テスト結果、ビルドの終了コード、ファイル数、キューが空になったことなど
              </li>
              <li>
                <b>どう証明するかを明記する</b>: 「<code className={styles.inlineCode}>npm test</code> が exit code 0 で終わる」のように、Fableの出力自体が証拠になる形にする
              </li>
              <li>
                <b>守るべき制約を明記する</b>: 「他のテストファイルを変更しない」など、途中で崩れてはいけない条件も書く
              </li>
            </ol>

            <p>
              評価モデルはトランスクリプトを読むだけで、コマンドを自ら実行したりファイルを直接確認したりはしない。したがって「わかりやすく体裁の整った進捗報告」と「実際に検証された事実」を混同しないよう、Fable 5自身に根拠を明示させる指示(4.2節 of パターンC)と組み合わせることが重要である。また、無条件で朝まで走らせるような使い方は推奨されておらず、ターン数や時間の上限を条件に含めておくことが安全策として案内されている。
            </p>
          </section>
        </div>
      </main>

      <TocObserver />
    </div>
  );
}
