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
        </div>
      </main>

      <TocObserver />
    </div>
  );
}
