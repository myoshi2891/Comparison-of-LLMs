import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Cursor 実践ガイド ｜ 中〜上級者のためのベストプラクティス集",
  description:
    "中〜上級者のためのCursor実践ガイド。アーキテクチャ全体像、Tab補完、インライン編集、Plan Mode、Debug Mode、MCP、Agent Skills、Subagents、Hooks等の各機能の仕組みとベストプラクティスを解説。",
};

const TOC_ITEMS = [
  { num: "01", id: "ch1", title: "アーキテクチャ全体像" },
  { num: "02", id: "ch2", title: "Tab 補完" },
  { num: "03", id: "ch3", title: "インライン編集" },
  { num: "04", id: "ch4", title: "Agent モード" },
  { num: "05", id: "ch5", title: "Plan Mode" },
  { num: "06", id: "ch6", title: "Debug Mode" },
  { num: "07", id: "ch7", title: "コンテキスト管理" },
  { num: "08", id: "ch8", title: "Rules" },
  { num: "09", id: "ch9", title: "MCP" },
  { num: "10", id: "ch10", title: "Agent Skills" },
  { num: "11", id: "ch11", title: "Subagents" },
  { num: "12", id: "ch12", title: "Hooks" },
  { num: "13", id: "ch13", title: "Terminal & Sandbox" },
  { num: "14", id: "ch14", title: "Browser ツール" },
  { num: "15", id: "ch15", title: "Worktrees" },
  { num: "16", id: "ch16", title: "Cloud Agents" },
  { num: "17", id: "ch17", title: "Cursor CLI" },
  { num: "18", id: "ch18", title: "Bugbot / Agent Review" },
  { num: "19", id: "ch19", title: "モデル選定とコスト" },
  { num: "20", id: "ch20", title: "ワークフロー統合" },
  { num: "21", id: "ch21", title: "参考文献一覧" },
];

const DIAGRAMS = {
  d01_architecture: `flowchart TD
    User[開発者の入力] --> Tab[Tab 補完]
    User --> InlineEdit[インライン編集 Cmd K]
    User --> AgentChat[Agent Chat]
    User --> CLI[Cursor CLI]

    AgentChat --> Context[コンテキスト層]
    CLI --> Context
    Context --> Rules[Rules AGENTS.md]
    Context --> MentionsIndex[at メンション インデックス]
    Context --> MCP[MCP サーバー]
    Context --> Skills[Agent Skills]

    Rules --> Loop[Agent 実行ループ]
    MentionsIndex --> Loop
    MCP --> Loop
    Skills --> Loop

    Loop --> Hooks[Hooks による制御]
    Hooks --> Tools[ツール実行 編集 端末 ブラウザ]
    Tools --> Local[ローカル実行]
    Tools --> CloudVM[Cloud Agent VM]

    Local --> Review[Agent Review Bugbot]
    CloudVM --> Review
    Review --> Result[コード変更 PR]`,
  d03_inline_vs_agent: `flowchart TD
    Start[コードを変更したい] --> Scope{影響範囲は 1 ファイル内か}
    Scope -->|はい かつ 小規模| InlineK[Cmd K でインライン編集]
    Scope -->|いいえ 複数ファイル| AgentL[Cmd L で Agent へ]
    InlineK --> Grow{編集中に他ファイルへの影響が判明}
    Grow -->|はい| AgentL
    Grow -->|いいえ| Done[適用して完了]
    AgentL --> Done2[Agent が探索し複数ファイルを編集]`,
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Page() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <nav className={styles.sidebar} id="sidebar" aria-label="目次">
        <div className={styles.brand}>
          <span className={styles.brandMark}>
            Cursor<span className={styles.cursorBlink}></span>
          </span>
        </div>
        <div className={styles.brandSub}>実践ガイド ｜ 中〜上級者向け</div>

        <div className={styles.tocGroupLabel}>Chapters</div>
        <ul className={styles.navList}>
          {TOC_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                className={`${styles.tocLink} nav-link`}
                data-target={item.id}
                href={`#${item.id}`}
              >
                <span className={styles.tocNum}>{item.num}</span>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className={styles.main} id="main">
        <header className={styles.hero}>
          <span className={styles.eyebrow}>Cursor Docs Reference ｜ 2026-07-01 時点</span>
          <h1>
            Cursor 実践ガイド<span className={styles.cursorBlink}></span>
          </h1>
          <p className={styles.heroLede}>
            中〜上級者のためのベストプラクティス集。各機能の「使い方」だけでなく「なぜその設定が推奨されるのか」「実務でどう組み合わせるとチーム開発の事故を減らせるか」を、Cursor
            公式ドキュメントを一次情報源として解説する。
          </p>
          <div className={styles.heroMeta}>
            <span>
              <strong>対象読者：</strong>Agent を日常的に使っているユーザー
            </span>
            <span>
              <strong>図解：</strong>すべて Mermaid（ASCIIアート不使用）
            </span>
            <span>
              <strong>出典：</strong>cursor.com/docs, cursor.com/help
            </span>
            <span>
              <strong>最終確認日：</strong>2026年7月1日
            </span>
          </div>

          <div className={styles.tocGrid}>
            {TOC_ITEMS.map((item) => (
              <a key={item.id} className={styles.tocItem} href={`#${item.id}`}>
                <span className={styles.n}>{item.num}</span>
                {item.title}
              </a>
            ))}
          </div>
        </header>

        {/* ==================== Chapter 1 ==================== */}
        <section className={`${styles.chapter} chapter`} id="ch1">
          <div className={styles.chapterEyebrow}>Chapter 01</div>
          <h2>Cursor のアーキテクチャ全体像</h2>

          <div className={styles.introCallout}>
            <span className={styles.icon}>💡</span>
            <div>
              この章では、これから解説する各機能（Tab・Agent・Rules・MCP・Hooks など）が Cursor
              全体の中でどう位置づけられるかを俯瞰します。個々の章を読み進める前に、この全体図を頭に入れておくと、後続の説明が繋がりやすくなります。
            </div>
          </div>

          <p>
            Cursor は VS Code をベースにしたエディタに、複数の AI
            機能レイヤーを重ねた構成になっている。ローカルの「エディタ」機能（Tab・Cmd+K・Agent
            Chat）と、クラウド上で独立した VM が動く「Cloud
            Agents」、そしてターミナルから叩ける「CLI」の3系統が存在し、いずれも同じ Agent
            ループ（探索→編集→検証）を共有している。
          </p>

          <div className={styles.figure}>
            <p className={styles.figureLead}>
              この図は、ユーザーの入力がどの経路を通って最終的なコード変更に至るかを表しています。上から下へ読み進めてください。
            </p>
            <div className={styles.figureCanvas}>
              <MermaidDiagram chart={DIAGRAMS.d01_architecture} />
            </div>
          </div>

          <div className={styles.figureLegend}>
            <div className={styles.legendTitle}>各ノードの意味</div>
            <dl>
              <div>
                <dt>Tab 補完 / インライン編集 / Agent Chat / CLI</dt>
                <dd>
                  ユーザーが AI
                  機能へアクセスする4つの入口。用途に応じて使い分ける（第2〜4章、第17章）
                </dd>
              </div>
              <div>
                <dt>コンテキスト層</dt>
                <dd>
                  Agent が参照する情報源の集合。Rules・@メンション・インデックス・MCP・Skills
                  から構成される（第7〜10章）
                </dd>
              </div>
              <div>
                <dt>Agent 実行ループ</dt>
                <dd>「探索 → 計画 → 編集 → 検証」を自律的に繰り返す中核処理</dd>
              </div>
              <div>
                <dt>Hooks による制御</dt>
                <dd>
                  ループの各段階に割り込み、承認・拒否・追加コンテキスト注入を行う仕組み（第12章）
                </dd>
              </div>
              <div>
                <dt>ローカル実行 / Cloud Agent VM</dt>
                <dd>
                  実際にツール（端末コマンド・ファイル編集・ブラウザ操作）が実行される場所（第13〜16章）
                </dd>
              </div>
              <div>
                <dt>Agent Review / Bugbot</dt>
                <dd>変更が完了した後の品質ゲート（第18章）</dd>
              </div>
            </dl>
          </div>

          <h3>この章の要点</h3>
          <ul>
            <li>
              Cursor の各機能は独立しているわけではなく、
              <strong>同じコンテキスト層とAgentループを共有する複数の入口</strong>
              として設計されている。
            </li>
            <li>
              ローカルとクラウド（Cloud Agents）は実行環境が異なるだけで、Rules・Hooks・MCP
              の大部分は両方で機能する。
            </li>
            <li>
              次章以降は、この図の左（入口）から右（品質ゲート）へ向かって順番に解説していく。
            </li>
          </ul>

          <div className={styles.sectionRefs}>
            <div className={styles.boxTitle}>📎 参照URL</div>
            <ul className={styles.refs}>
              <li>
                <span className={styles.refTag}>01</span>
                <Ext href="https://cursor.com/docs">cursor.com/docs</Ext>
              </li>
              <li>
                <span className={styles.refTag}>02</span>
                <Ext href="https://cursor.com/docs/agent/overview">
                  cursor.com/docs/agent/overview
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== Chapter 2 ==================== */}
        <section className={`${styles.chapter} chapter`} id="ch2">
          <div className={styles.chapterEyebrow}>Chapter 02</div>
          <h2>Tab 補完（インライン予測）</h2>

          <div className={styles.introCallout}>
            <span className={styles.icon}>💡</span>
            <div>
              この章では、最も利用頻度が高い機能である Tab
              補完の内部動作と、中〜上級者が見落としがちな設定（ジャンプ機能・クロスファイル編集・無効化の粒度）を扱います。
            </div>
          </div>

          <p>
            Tab は Cursor
            独自のAIオートコンプリートで、直前の編集履歴・周辺コード・リンターのエラー情報を根拠に次の入力を予測する。単なる補完ではなく「次に編集すべき場所」までナビゲートする点が
            VS Code 標準の補完と異なる。
          </p>

          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepBody}>
              <h4>基本操作を体に覚えさせる</h4>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>操作</th>
                      <th>Mac</th>
                      <th>Windows / Linux</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>提案を全体承認</td>
                      <td>
                        <code>Tab</code>
                      </td>
                      <td>
                        <code>Tab</code>
                      </td>
                    </tr>
                    <tr>
                      <td>提案を拒否</td>
                      <td>
                        <code>Esc</code>（または入力を続ける）
                      </td>
                      <td>
                        <code>Esc</code>
                      </td>
                    </tr>
                    <tr>
                      <td>単語単位で承認</td>
                      <td>
                        <code>Cmd + →</code>
                      </td>
                      <td>
                        <code>Ctrl + →</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepBody}>
              <h4>ジャンプ機能（jump-in-file）を使いこなす</h4>
              <p>
                Tab 提案を承認した直後にもう一度 <code>Tab</code> を押すと、Cursor
                は「次に編集すべき場所」を予測してカーソルをジャンプさせる。スクロールや手動でのカーソル移動が不要になるため、複数箇所にまたがる小さな修正（変数名のリネーム後の呼び出し側修正など）では、承認
                → Tab → 承認 → Tab という連打だけで一連の修正が完結することが多い。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepBody}>
              <h4>クロスファイル編集を見逃さない</h4>
              <p>
                ある1ファイルの変更が別ファイルの更新を要求する場合、Tab
                はファイル間の連携編集も予測する。ジャンプ可能な別ファイルがある場合はエディタ下部に「ポータルウィンドウ」が表示されるので、これを見落とさないようにする。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepBody}>
              <h4>Tab の有効/無効を粒度別に制御する</h4>
              <p>エディタ右下の Tab ステータスインジケーターから、以下の3段階で制御できる。</p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>粒度</th>
                      <th>用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Snooze（一時停止）</strong>
                      </td>
                      <td>一定時間だけ Tab を止めたいとき（ペアプロ中の説明など）</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>全体で無効化</strong>
                      </td>
                      <td>Tab の挙動が邪魔になるプロジェクトで恒久的に切る</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>拡張子ごとに無効化</strong>
                      </td>
                      <td>Markdown・JSON など、予測がノイズになりやすいファイル種別だけ切る</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                <code>Cursor Settings &gt; Tab</code>
                からも同様の設定が可能。ショートカットを変更したい場合は Keyboard Shortcuts 設定で
                <code>Accept Cursor Tab Suggestions</code> を検索してリマップする。
              </p>
            </div>
          </div>

          <h3>ベストプラクティス</h3>
          <div className={`${styles.box} ${styles.tip}`}>
            <div className={styles.boxTitle}>✓ Best Practice</div>
            <ul style={{ marginBottom: 0 }}>
              <li>
                <strong>リンターを併用する</strong>：Tab
                はリンターのエラー情報も根拠にするため、ESLint / Ruff
                などを有効にしておくと予測精度が上がる。
              </li>
              <li>
                <strong>Markdown/JSON では拡張子単位の無効化を検討する</strong>
                ：説明文やロックファイルでは誤補完がノイズになりやすい。
              </li>
              <li>
                <strong>ジャンプ機能を意図的に使う</strong>
                ：リネームなど「連鎖する小修正」ではジャンプ機能を前提にした操作フローを組むと高速。
              </li>
            </ul>
          </div>

          <div className={`${styles.box} ${styles.glossary}`}>
            <div className={styles.boxTitle}>📖 用語ノート</div>
            <dl>
              <div>
                <dt>Tab補完</dt>
                <dd>カーソル位置の次の入力を予測しグレーアウト表示するAI機能</dd>
              </div>
              <div>
                <dt>jump-in-file</dt>
                <dd>Tab 承認後に次の編集箇所へ自動でカーソルを移動させる予測機能</dd>
              </div>
              <div>
                <dt>ポータルウィンドウ</dt>
                <dd>クロスファイル編集がある場合にエディタ下部へ表示される遷移UI</dd>
              </div>
            </dl>
          </div>

          <div className={styles.sectionRefs}>
            <div className={styles.boxTitle}>📎 参照URL</div>
            <ul className={styles.refs}>
              <li>
                <span className={styles.refTag}>01</span>
                <Ext href="https://cursor.com/help/ai-features/tab">
                  cursor.com/help/ai-features/tab
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== Chapter 3 ==================== */}
        <section className={`${styles.chapter} chapter`} id="ch3">
          <div className={styles.chapterEyebrow}>Chapter 03</div>
          <h2>インライン編集（Cmd+K）</h2>

          <div className={styles.introCallout}>
            <span className={styles.icon}>💡</span>
            <div>
              この章では、チャットパネルを開かずに選択範囲だけを直接書き換える Inline Edit
              の使い方と、Agent への昇格判断を扱います。
            </div>
          </div>

          <p>
            Inline Edit
            は、選択したコード範囲に対してその場で指示を出し、差分を直接適用する軽量な編集手段である。Agent
            Chat のようにマルチファイル探索は行わないため、範囲が明確な小さな変更に向いている。
          </p>

          <h3>ステップバイステップ</h3>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepBody}>
              <p>変更したいコードを選択する</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepBody}>
              <p>
                <code>Cmd + K</code>（Mac）/ <code>Ctrl + K</code>（Windows/Linux）を押す
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepBody}>
              <p>指示を入力する（例：「この関数を async 化して」）</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepBody}>
              <p>
                <code>Enter</code> で適用。差分がその場に反映される
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>5</div>
            <div className={styles.stepBody}>
              <p>
                追加の指示を続けて入力し、再度 <code>Enter</code> で微調整できる
              </p>
            </div>
          </div>

          <h3>質問モード（コードを変更せず聞くだけ）</h3>
          <p>
            選択範囲について「変更せずに質問だけしたい」場合は、<code>Cmd+K</code>
            の直後に以下でモードを切り替える。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>OS</th>
                  <th>キー</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mac</td>
                  <td>
                    <code>Option + Enter</code>
                  </td>
                </tr>
                <tr>
                  <td>Windows/Linux</td>
                  <td>
                    <code>Alt + Enter</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            回答を見て気に入れば「do it」と入力して
            <code>Enter</code> を押すと、そのまま適用に切り替わる。
          </p>

          <h3>Agent への昇格</h3>
          <p>
            範囲を選択した状態で <code>Cmd + L</code>（Mac）/
            <code>Ctrl + L</code>
            （Windows/Linux）を押すと、選択コードをコンテキストとして持った状態で Agent Chat
            が開く。複数ファイルにまたがる変更が必要だと気づいた時点で、Inline Edit から Agent
            へシームレスに移行できる。
          </p>

          <div className={styles.figure}>
            <p className={styles.figureLead}>
              この図は、変更範囲の大きさに応じてどちらの機能を選ぶべきかの判断フローを表しています。
            </p>
            <div className={styles.figureCanvas}>
              <MermaidDiagram chart={DIAGRAMS.d03_inline_vs_agent} />
            </div>
          </div>
          <div className={styles.figureLegend}>
            <div className={styles.legendTitle}>各ノードの意味</div>
            <dl>
              <div>
                <dt>影響範囲は1ファイル内か</dt>
                <dd>まず変更が閉じた範囲かどうかを判定する分岐</dd>
              </div>
              <div>
                <dt>編集中に他ファイルへの影響が判明</dt>
                <dd>Inline Edit 中に想定外の依存が見つかった場合の再判定</dd>
              </div>
            </dl>
          </div>

          <div className={`${styles.box} ${styles.tip}`}>
            <div className={styles.boxTitle}>✓ Best Practice</div>
            <ul style={{ marginBottom: 0 }}>
              <li>
                <strong>迷ったら Inline Edit から始める</strong>：Agent Chat
                よりコンテキスト消費が少なく、応答も速い。
              </li>
              <li>
                <strong>質問モードを疑問解消に使う</strong>
                ：コードの意図を尋ねたいだけの場面でうっかり変更を適用してしまう事故を防げる。
              </li>
              <li>
                <strong>昇格をためらわない</strong>：Inline Edit
                で対応しきれないと分かった時点ですぐ <code>Cmd+L</code> で Agent
                へ渡す方が、手戻りが少ない。
              </li>
            </ul>
          </div>

          <div className={styles.sectionRefs}>
            <div className={styles.boxTitle}>📎 参照URL</div>
            <ul className={styles.refs}>
              <li>
                <span className={styles.refTag}>01</span>
                <Ext href="https://cursor.com/help/ai-features/inline-edit">
                  cursor.com/help/ai-features/inline-edit
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== Placeholders for Chapters 4-21 ==================== */}
        {TOC_ITEMS.slice(3).map((item) => (
          <section key={item.id} className={`${styles.chapter} chapter`} id={item.id}>
            <div className={styles.chapterEyebrow}>Chapter {item.num}</div>
            <h2>{item.title}</h2>
            <p>移行中...</p>
          </section>
        ))}

        <footer className={styles.pageFooter}>
          <div className={styles.footerContainer}>
            <p>© 2026 LLM-Studies. Built with Next.js &amp; CSS Modules.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
