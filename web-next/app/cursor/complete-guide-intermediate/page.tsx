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
  d04_agent_mode_decision: `flowchart TD
    Task[新しいタスク] --> Known{見慣れた小規模な変更か}
    Known -->|はい| DirectAgent[Agent モードへ直接投入]
    Known -->|いいえ かつ 複雑| PlanMode[Plan Mode で計画を作成]
    Known -->|原因不明のバグ| DebugMode[Debug Mode で仮説検証]

    PlanMode --> Review1{計画は妥当か}
    Review1 -->|はい| Build[計画を Build 実装開始]
    Review1 -->|いいえ| Refine[計画を編集し再生成]
    Refine --> Review1

    DirectAgent --> Diff[差分ビューでレビュー]
    Build --> Diff
    DebugMode --> Diff

    Diff --> Match{意図と一致するか}
    Match -->|はい| Merge[変更を確定]
    Match -->|いいえ かつ Planから来た| Refine
    Match -->|いいえ かつ 直接投入だった| PlanMode`,
  d05_plan_mode_flow: `flowchart TD
    Trigger[Shift Tab または自動提案] --> Ask[確認質問で要件を明確化]
    Ask --> Research[コードベースを調査]
    Research --> Draft[実装計画を Markdown で生成]
    Draft --> Edit[ユーザーがチャットまたはファイルで編集]
    Edit --> Save{Save to workspace を押したか}
    Save -->|はい| WorkspacePlan[.cursor slash plans に保存]
    Save -->|いいえ| HomePlan[ホームディレクトリに保存]
    WorkspacePlan --> Build[Build で実装開始]
    HomePlan --> Build`,
  d06_debug_mode_flow: `flowchart TD
    S1[1 探索と仮説立案] --> S2[2 ログ計装の挿入]
    S2 --> S3[3 バグの再現をユーザーに依頼]
    S3 --> S4[4 収集したログの分析]
    S4 --> S5[5 的を絞った修正]
    S5 --> S6[6 検証と計装 of 除去]
    S6 --> Done{再現手順で修正確認できたか}
    Done -->|いいえ| S3
    Done -->|はい| Finish[計装を全削除して完了]`,
  d07_context_sources: `flowchart LR
    Prompt[ユーザーのプロンプト] --> Merge[文脈の合成]
    Rules[Rules AGENTS.md] --> Merge
    Mentions[at メンションで指定したファイル] --> Merge
    SemanticIndex[コードベースの自動検索] --> Merge
    MCP[MCP サーバーからの情報] --> Merge
    Skills[関連する Skill] --> Merge
    Merge --> Model[モデルへの最終入力]`,
  d08_rules_priority: `flowchart TD
    TeamRules[Team Rules] --> Merge[コンテキストへの合成]
    ProjectRules[Project Rules .cursor slash rules] --> Merge
    UserRules[User Rules グローバル設定] --> Merge
    AgentsMd[AGENTS.md] --> Merge
    Merge --> Priority[競合時は先勝ち Team から Project User の順]
    Priority --> FinalContext[モデルへ渡る最終コンテキスト]`,
  d09_mcp_architecture: `flowchart LR
    Cursor[Cursor Host] --> Client[MCP Client 内蔵]
    Client -->|stdio| LocalServer[ローカル MCP サーバー]
    Client -->|SSE または HTTP| RemoteServer[リモート MCP サーバー]
    LocalServer --> ExternalTool1[DB API ファイルシステムなど]
    RemoteServer --> ExternalTool2[SaaS API GitHub Slack など]
    ExternalTool1 --> Result[ツール結果を Agent へ返却]
    ExternalTool2 --> Result
    Result --> AgentLoop[Agent 実行ループへ合流]`,
  d10_skills_decision: `flowchart TD
    Q1[常に守らせたい規約か] -->|はい| Rules[Rules を選択]
    Q1 -->|いいえ| Q2[特定のファイルやチームに絞るか]
    Q2 -->|はい| Skills[Skills を選択 paths / folder スコープ]
    Q2 -->|いいえ| Q3[独立した文脈での長時間作業か]
    Q3 -->|はい| Subagents[Subagents を選択 Explore / Bash / Browser など]
    Q3 -->|いいえ| Hooks[Hooks を選択 ツール実行前後の検証・ブロックなど]`,
  d11_subagent_isolation: `flowchart TD
    subgraph Direct [メインエージェント直接処理]
      Task1[探索タスク] --> MainContext1[大量の中間出力がメイン文脈に蓄積]
      MainContext1 --> Slow[動作の遅延や要約による情報の損失]
    end
    subgraph Isolated [Subagent 委任]
      Task2[探索タスク] --> SubAgent[Explore Subagent]
      SubAgent --> SubContext[独自のコンテキストで探索処理]
      SubContext --> Result[要約のみが親へ返却]
      Result --> MainContext2[メイン文脈は最小限で綺麗に維持]
    end`,
  d12_hooks_sequence: `flowchart TD
    Agent[Agent がシェル実行を要求] --> preToolUse{preToolUse Hook}
    preToolUse -->|allow| beforeShell{beforeShellExecution Hook}
    preToolUse -->|deny| Block[実行を拒否しメッセージを返す]
    beforeShell -->|allow| Terminal[ターミナルでコマンド実行]
    beforeShell -->|deny| Block
    Terminal --> afterShell[afterShellExecution Hook]
    afterShell --> postToolUse[postToolUse Hook]
    postToolUse --> FinalResult[実行結果と監査ログを合成]`,
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

        {/* ==================== Chapter 4 ==================== */}
        <section className={`${styles.chapter} chapter`} id="ch4">
          <div className={styles.chapterEyebrow}>Chapter 04</div>
          <h2>Agent モード</h2>

          <div className={styles.introCallout}>
            <span className={styles.icon}>💡</span>
            <div>
              この章では、Cursor の中核機能である Agent（およびその兄弟モードである Ask / Plan /
              Debug）の使い分けと、実務で効果が実証されているプロンプト設計・並列実行のプラクティスを扱います。
            </div>
          </div>

          <p>
            Agent
            はコードベースを探索し、複数ファイルを編集し、端末コマンドを実行し、エラーを自律的に修正するアシスタントである。ゼロからの機能構築、既存コードのリファクタリング、バグ修正、テスト作成、シェルコマンド実行までを一貫して任せられる。
          </p>

          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepBody}>
              <h4>4つのモードを正しく使い分ける</h4>
              <p>
                Cursor のチャット入力は「Agent」「Ask」「Plan」「Debug」の4モードを持ち、
                <code>Shift+Tab</code> またはモードピッカーで切り替える。
                <strong>モードを切り替えると新しいコンテキストウィンドウで開始される</strong>
                ため、タスクが変わったら新しいチャットを始めるのが安全である。
              </p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>モード</th>
                      <th>用途</th>
                      <th>向いているタスク</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Agent</strong>
                      </td>
                      <td>ほとんどのタスクのデフォルト</td>
                      <td>機能実装・リファクタリング・バグ修正・テスト作成</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Ask</strong>
                      </td>
                      <td>変更を加えずに回答だけ得る</td>
                      <td>コードの理解・設計に関する質問</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Plan</strong>
                      </td>
                      <td>実装前にレビュー可能な計画を作る</td>
                      <td>複数ファイルにまたがる機能・要件が曖昧なタスク</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Debug</strong>
                      </td>
                      <td>再現しにくい／原因不明のバグを扱う</td>
                      <td>競合状態・パフォーマンス劣化・原因不明の回帰</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>Project Rules・User Rules・Team Rules はすべてのモードで適用される。</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepBody}>
              <h4>タスクを投げて差分をレビューする</h4>
              <ol>
                <li>
                  平易な言葉でタスクを記述する（例：「ホームページにメール・パスワード欄付きのログインフォームを追加して」）
                </li>
                <li>
                  <code>Enter</code> を押す。Agent
                  がコードベースを探索し、どのファイルを読み変更するかを自律的に判断する
                </li>
                <li>編集はリアルタイムで差分ビューに反映される。実行中でも確認できる</li>
                <li>
                  意図と違う方向に進み始めたら <strong>Stop ボタン</strong>
                  で即座に止め、指示を修正して再開できる
                </li>
                <li>差分をレビューし、不要な変更は個別に却下できる</li>
              </ol>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepBody}>
              <h4>@メンションで文脈を絞り込む（詳細は第7章）</h4>
              <p>
                どのファイルが関係するか分かっている場合は <code>@ファイル名</code>{" "}
                で明示的に渡すと探索コストを削減できる。不明な場合は指定せず Agent
                自身の検索に任せる方が良い結果になることが多い。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepBody}>
              <h4>（上級）Agent のベストプラクティスを実務に落とし込む</h4>
              <p>
                Cursor 公式ブログ「Best practices for coding with
                agents」で紹介されている実践知は、中〜上級者が特に押さえておくべき内容である。
              </p>
              <ul>
                <li>
                  <strong>すべてのタスクに詳細な計画が必要なわけではない</strong>
                  ：見慣れた小さな変更は Plan を経由せず直接 Agent
                  に投げてよい。計画が有効なのは、複数の妥当なアプローチが存在する複雑な機能や、着手前に承認を得たい設計判断がある場合。
                </li>
                <li>
                  <strong>意図と違う実装になった場合、追加のプロンプトで直そうとしない</strong>
                  ：Plan に戻り、変更を revert
                  して計画をより具体的に書き直し、再実行する方が最終的に速く、結果もクリーンになりやすい。
                </li>
                <li>
                  <strong>アーキテクチャ図の生成をレビューの一部に組み込む</strong>：「OAuth
                  プロバイダ・セッション管理・トークン更新を含む認証システムのデータフローを示す
                  Mermaid
                  図を作成して」のようなプロンプトで、実装前後にドキュメント用の図を生成させると、実装の妥当性をレビューしやすくなる。
                </li>
                <li>
                  <strong>複数モデルによる並列試行（best-of-n）で難しい問題の精度を上げる</strong>
                  ：同じ問題を複数モデルに解かせ、最良の結果を選ぶアプローチは、特に難易度の高いタスクで有効性が確認されている（第15章の{" "}
                  <code>/best-of-n</code> も参照）。
                </li>
                <li>
                  <strong>画像をそのまま文脈として使う</strong>
                  ：デザインモックアップのスクリーンショットを貼り付け、「このレイアウト・色・余白を再現して」と指示できる。Figma
                  MCP サーバーとの併用も可能（第9章）。
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.figure}>
            <p className={styles.figureLead}>
              この図は、モード選択からタスク完了までの意思決定フローを表しています。
            </p>
            <div className={styles.figureCanvas}>
              <MermaidDiagram chart={DIAGRAMS.d04_agent_mode_decision} />
            </div>
          </div>
          <div className={styles.figureLegend}>
            <div className={styles.legendTitle}>各ノードの意味</div>
            <dl>
              <div>
                <dt>見慣れた小規模な変更か</dt>
                <dd>まずタスクの複雑さで最初の入口を分岐する判断点</dd>
              </div>
              <div>
                <dt>意図と一致するか</dt>
                <dd>
                  差分レビュー後の合否判定。不一致の場合、直接投入だったタスクは Plan Mode
                  に戻すのが公式推奨のリカバリー経路
                </dd>
              </div>
            </dl>
          </div>

          <h3>ベストプラクティス早見表</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>状況</th>
                  <th>推奨アクション</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>何を実装すべきか自体が曖昧</td>
                  <td>Plan Mode で要件を先に固める</td>
                </tr>
                <tr>
                  <td>再現できるが原因が分からないバグ</td>
                  <td>Debug Mode でログ計装から始める</td>
                </tr>
                <tr>
                  <td>コードの意味を知りたいだけ</td>
                  <td>Ask モードで変更を防ぐ</td>
                </tr>
                <tr>
                  <td>Agent の実装が意図とずれた</td>
                  <td>追加プロンプトで粘らず Plan に戻って再実行</td>
                </tr>
                <tr>
                  <td>大規模で影響範囲の予測が難しい変更</td>
                  <td>事前にアーキテクチャ図を生成しレビュー材料にする</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.box} ${styles.glossary}`}>
            <div className={styles.boxTitle}>📖 用語ノート</div>
            <dl>
              <div>
                <dt>差分ビュー（diff view）</dt>
                <dd>Agent が加えた変更を追加・削除行として可視化する画面</dd>
              </div>
              <div>
                <dt>best-of-n</dt>
                <dd>同一タスクを複数モデルに並列実行させ、最良の結果を採用する手法</dd>
              </div>
            </dl>
          </div>

          <div className={styles.sectionRefs}>
            <div className={styles.boxTitle}>📎 参照URL</div>
            <ul className={styles.refs}>
              <li>
                <span className={styles.refTag}>01</span>
                <Ext href="https://cursor.com/help/ai-features/agent">
                  cursor.com/help/ai-features/agent
                </Ext>
              </li>
              <li>
                <span className={styles.refTag}>02</span>
                <Ext href="https://cursor.com/docs/agent/overview">
                  cursor.com/docs/agent/overview
                </Ext>
              </li>
              <li>
                <span className={styles.refTag}>03</span>
                <Ext href="https://cursor.com/docs/agent/prompting">
                  cursor.com/docs/agent/prompting
                </Ext>
              </li>
              <li>
                <span className={styles.refTag}>04</span>
                <Ext href="https://cursor.com/blog/agent-best-practices">
                  cursor.com/blog/agent-best-practices
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== Chapter 5 ==================== */}
        <section className={`${styles.chapter} chapter`} id="ch5">
          <div className={styles.chapterEyebrow}>Chapter 05</div>
          <h2>Plan Mode（実装前設計）</h2>

          <div className={styles.introCallout}>
            <span className={styles.icon}>💡</span>
            <div>
              この章では、複雑な機能実装の前段階として計画を作らせる Plan Mode
              の内部フローと、チームでの再利用方法を扱います。
            </div>
          </div>

          <p>
            Plan Mode はコードを書く前に、Agent
            がコードベースを調査し、確認質問を投げかけ、レビュー可能な実装計画を生成するモードである。
            <code>Shift+Tab</code> で切り替えるほか、複雑なタスクを示すキーワードを入力すると Cursor
            側が自動的に提案することもある。
          </p>

          <div className={styles.figure}>
            <p className={styles.figureLead}>
              この図は、Plan Mode が起動してから実装（Build）に至るまでの内部フローを表しています。
            </p>
            <div className={styles.figureCanvas}>
              <MermaidDiagram chart={DIAGRAMS.d05_plan_mode_flow} />
            </div>
          </div>
          <div className={styles.figureLegend}>
            <div className={styles.legendTitle}>各ノードの意味</div>
            <dl>
              <div>
                <dt>確認質問で要件を明確化</dt>
                <dd>Agent が実装前に曖昧な仕様を質問形式で確認するステップ</dd>
              </div>
              <div>
                <dt>Save to workspace</dt>
                <dd>
                  チームでの再利用・ドキュメント化のためにプロジェクト内へ計画を保存するボタン
                </dd>
              </div>
            </dl>
          </div>

          <h3>ステップバイステップ</h3>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepBody}>
              <p>
                <code>Shift+Tab</code> で Plan Mode
                に切り替える（または複雑なタスクを入力すると自動提案される）
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepBody}>
              <p>Agent からの確認質問に答える</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepBody}>
              <p>Agent がコードベースを調査し、包括的な実装計画を作成する</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepBody}>
              <p>
                計画は Markdown
                ファイルとして開かれるため、チャット上またはファイルを直接編集して不要なステップの削除・アプローチの調整・見落とされた文脈の追加を行う
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>5</div>
            <div className={styles.stepBody}>
              <p>
                <strong>
                  「Save to workspace」を押すと <code>.cursor/plans/</code> に保存される
                </strong>
                。これによりチームのドキュメントとして残り、中断した作業の再開や、後続の Agent
                への文脈提供に使える
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>6</div>
            <div className={styles.stepBody}>
              <p>準備ができたら Build をクリックして実装を開始する</p>
            </div>
          </div>

          <h3>Plan Mode を使うべき場面</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>使うべき場面</th>
                  <th>使わなくてよい場面</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>妥当なアプローチが複数存在する複雑な機能</td>
                  <td>何度も経験した小さな変更</td>
                </tr>
                <tr>
                  <td>多数のファイル・システムにまたがるタスク</td>
                  <td>変更範囲が最初から明確なタスク</td>
                </tr>
                <tr>
                  <td>要件が不明確でスコープを事前に把握したい</td>
                  <td>クイックな修正・タイポ修正</td>
                </tr>
                <tr>
                  <td>アーキテクチャ上の意思決定を事前レビューしたい</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>計画からやり直す（Starting over from a plan）</h3>
          <p>
            Agent
            が意図と異なるものを作ってしまった場合、追加の指示で修正を試みるのではなく、計画に立ち返るのが公式に推奨されるリカバリー手順である。
          </p>
          <ol>
            <li>変更を revert する</li>
            <li>計画をより具体的に、必要な内容を明記して修正する</li>
            <li>再度実行する</li>
          </ol>
          <div className={`${styles.box} ${styles.tip}`}>
            <div className={styles.boxTitle}>✓ Best Practice</div>
            <p style={{ marginBottom: 0 }}>
              この手順は、実行中の Agent
              を場当たり的に修正するより高速で、結果もクリーンになりやすい。大規模な変更ほど、精密でスコープの明確な計画作りに時間をかける価値がある。「どんな変更をすべきか」を決める部分こそが難所であり、適切な指示さえあれば実装自体は
              Agent に委任できる。
            </p>
          </div>

          <div className={`${styles.box} ${styles.glossary}`}>
            <div className={styles.boxTitle}>📖 用語ノート</div>
            <dl>
              <div>
                <dt>Plan Mode</dt>
                <dd>実装前に Agent が計画を作成し、レビュー・編集を経てから Build に進むモード</dd>
              </div>
              <div>
                <dt>Save to workspace</dt>
                <dd>
                  生成された計画をプロジェクトの <code>.cursor/plans/</code> に永続化する操作
                </dd>
              </div>
            </dl>
          </div>

          <div className={styles.sectionRefs}>
            <div className={styles.boxTitle}>📎 参照URL</div>
            <ul className={styles.refs}>
              <li>
                <span className={styles.refTag}>01</span>
                <Ext href="https://cursor.com/docs/agent/plan-mode">
                  cursor.com/docs/agent/plan-mode
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== Chapter 6 ==================== */}
        <section className={`${styles.chapter} chapter`} id="ch6">
          <div className={styles.chapterEyebrow}>Chapter 06</div>
          <h2>Debug Mode（根本原因分析）</h2>

          <div className={styles.introCallout}>
            <span className={styles.icon}>💡</span>
            <div>
              この章では、通常の Agent
              対話では解決しにくい「再現できるが原因が分からないバグ」に特化した Debug Mode
              を扱います。
            </div>
          </div>

          <p>
            Debug Mode
            は、いきなりコードを書くのではなく、仮説を立て、ログ計装を挿入し、実行時の情報を基に問題箇所を特定してから的を絞った修正を行うモードである。競合状態やタイミング依存の問題、パフォーマンス劣化・メモリリーク、過去に動いていたものが壊れた回帰バグに強い。
          </p>

          <div className={styles.figure}>
            <p className={styles.figureLead}>
              この図は、Debug Mode が根本原因を特定するまでの6ステップを表しています。
            </p>
            <div className={styles.figureCanvas}>
              <MermaidDiagram chart={DIAGRAMS.d06_debug_mode_flow} />
            </div>
          </div>
          <div className={styles.figureLegend}>
            <div className={styles.legendTitle}>各ノードの意味</div>
            <dl>
              <div>
                <dt>1 探索と仮説立案</dt>
                <dd>関連ファイルを調べ、根本原因についての複数の仮説を立てるステップ</dd>
              </div>
              <div>
                <dt>2 ログ計装の挿入</dt>
                <dd>
                  Cursor
                  拡張機能内で動くローカルのデバッグサーバーへデータを送るログ文を追加するステップ
                </dd>
              </div>
              <div>
                <dt>3 バグの再現をユーザーに依頼</dt>
                <dd>
                  Agent
                  が具体的な再現手順を提示し、実際の実行時挙動を捕捉するためユーザーの操作を求めるステップ
                </dd>
              </div>
              <div>
                <dt>6 検証と計装の除去</dt>
                <dd>修正確認後、挿入したログ計装をすべて取り除くステップ</dd>
              </div>
            </dl>
          </div>

          <h3>Debug Mode を使うべき場面</h3>
          <ul>
            <li>再現はできるが、コードを読むだけでは原因が分からないバグ</li>
            <li>実行順序や非同期処理に依存するタイミング系の不具合</li>
            <li>実行時のプロファイリングが必要なパフォーマンス問題・メモリリーク</li>
            <li>「以前は動いていた」機能の回帰調査（何が変わったかを追跡する必要がある場合）</li>
          </ul>

          <h3>効果を最大化するコツ</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>コツ</th>
                  <th>理由</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>バグの詳細な文脈を渡す</td>
                  <td>
                    エラーメッセージ・スタックトレース・再現手順が具体的なほど、計装の精度が上がる
                  </td>
                </tr>
                <tr>
                  <td>提示された再現手順を正確に実行する</td>
                  <td>Agent が実際のランタイム挙動を確実に捕捉できるようにするため</td>
                </tr>
                <tr>
                  <td>必要なら複数回再現する</td>
                  <td>競合状態のような間欠的な問題の特定に役立つ</td>
                </tr>
                <tr>
                  <td>期待する挙動と実際の挙動を明確に区別して伝える</td>
                  <td>Agent が「何が正しい状態か」を正確に理解できるようにするため</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.box} ${styles.glossary}`}>
            <div className={styles.boxTitle}>📖 用語ノート</div>
            <dl>
              <div>
                <dt>仮説立案</dt>
                <dd>原因候補を複数洗い出し、ログで検証していく調査手法</dd>
              </div>
              <div>
                <dt>計装（instrumentation）</dt>
                <dd>問題箇所を特定するために一時的に挿入するログ出力コード</dd>
              </div>
            </dl>
          </div>

          <div className={styles.sectionRefs}>
            <div className={styles.boxTitle}>📎 参照URL</div>
            <ul className={styles.refs}>
              <li>
                <span className={styles.refTag}>01</span>
                <Ext href="https://cursor.com/docs/agent/debug-mode">
                  cursor.com/docs/agent/debug-mode
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== Chapter 7 ==================== */}
        <section className={`${styles.chapter} chapter`} id="ch7">
          <div className={styles.chapterEyebrow}>Chapter 07</div>
          <h2>コンテキスト管理（@メンション・インデックス・.cursorignore）</h2>

          <div className={styles.introCallout}>
            <span className={styles.icon}>💡</span>
            <div>
              この章では、Agent
              が「何を見て」回答を組み立てているかをコントロールする方法を扱います。中〜上級者ほど、この章の内容を理解しているかどうかで
              Agent の精度に差が出ます。
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepBody}>
              <h4>@メンションで明示的に文脈を渡す</h4>
              <p>
                <code>@</code> を入力すると、Cursor
                は候補を表示する。どのファイルが関連するか分かっている場合に使い、不明な場合は省略して
                Agent 自身の検索に任せる方が良い結果になることが多い。
              </p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>メンション</th>
                      <th>対象</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>@ファイル名</code>（例：<code>@auth.ts</code>）
                      </td>
                      <td>特定のファイルを含める</td>
                    </tr>
                    <tr>
                      <td>
                        <code>@フォルダ名</code>（例：<code>@src/components/</code>）
                      </td>
                      <td>フォルダ全体を含める</td>
                    </tr>
                    <tr>
                      <td>
                        <code>@関数名・クラス名</code>（例：<code>@getUserById</code>）
                      </td>
                      <td>特定のコードシンボルを参照する</td>
                    </tr>
                    <tr>
                      <td>
                        <code>@Docs</code>
                      </td>
                      <td>
                        インデックス済みのドキュメントを検索させる（自分のドキュメントも{" "}
                        <code>@Docs &gt; Add new doc</code> で追加可能）
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>@web</code>
                      </td>
                      <td>Web 検索をさせる</td>
                    </tr>
                    <tr>
                      <td>
                        <code>@codebase</code>
                      </td>
                      <td>プロジェクト全体をセマンティック検索する</td>
                    </tr>
                    <tr>
                      <td>
                        <code>@Past Chats</code>
                      </td>
                      <td>過去の会話を文脈として参照する</td>
                    </tr>
                    <tr>
                      <td>
                        <code>@Terminals</code>
                      </td>
                      <td>ターミナル出力を文脈に含める</td>
                    </tr>
                    <tr>
                      <td>
                        <code>@Commit</code> / <code>@Branch</code>
                      </td>
                      <td>Git 差分を文脈に含める（作業中の差分／メインとの差分）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>@Browser</code>
                      </td>
                      <td>組み込みブラウザの状態を文脈に含める</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                <code>@</code> は複数回使って複数ファイルを同時に添付できる。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepBody}>
              <h4>コンテキストウィンドウの消費を可視化する</h4>
              <p>
                チャット入力欄の横にある「コンテキストリング」をクリックすると、トークン使用量の内訳がカテゴリ別に表示される。
              </p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>カテゴリ</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>System prompt</td>
                      <td>Cursor 組み込みのモデル指示</td>
                    </tr>
                    <tr>
                      <td>Tools</td>
                      <td>Agent が使えるツールの定義</td>
                    </tr>
                    <tr>
                      <td>Rules</td>
                      <td>適用中のプロジェクト・ユーザールール</td>
                    </tr>
                    <tr>
                      <td>Skills</td>
                      <td>注入されたスキルの説明</td>
                    </tr>
                    <tr>
                      <td>MCP</td>
                      <td>接続中の MCP サーバーの指示・カタログ</td>
                    </tr>
                    <tr>
                      <td>Subagents</td>
                      <td>Agent が起動できるサブエージェントのドキュメント</td>
                    </tr>
                    <tr>
                      <td>Summarized conversation</td>
                      <td>圧縮された過去の会話要約</td>
                    </tr>
                    <tr>
                      <td>Conversation</td>
                      <td>実際のやり取り本文</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={`${styles.box} ${styles.warn}`}>
                <div className={styles.boxTitle}>⚠ 注意</div>
                <p style={{ marginBottom: 0 }}>
                  コンテキストウィンドウが埋まってくると、Cursor
                  は古い会話部分を自動で要約に圧縮し、新しい会話のための余地を確保する。
                  <strong>
                    Rules・Skills・MCP
                    を無秩序に増やしすぎると、この内訳が肥大化し、肝心のタスク遂行に使える余地が減る
                  </strong>
                  という点は、中〜上級者ほど意識すべきポイントである。
                </p>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepBody}>
              <h4>コードベースインデックスの状態を把握する</h4>
              <p>
                Cursor
                はプロジェクトを開くと自動でスキャンし、セマンティック検索用のインデックスを構築する。インデックスはおよそ5分ごとに同期され、変更を反映する。
              </p>
              <ul>
                <li>
                  <strong>状態確認</strong>
                  ：エディタ下部のステータスバーでスキャンの進捗を確認できる
                </li>
                <li>
                  <strong>再インデックス</strong>：コマンドパレット（<code>Cmd/Ctrl+Shift+P</code>
                  ）で「Reindex」を検索して実行
                </li>
                <li>
                  <strong>大規模リポジトリの高速化</strong>：<code>node_modules</code>・
                  <code>dist</code> などのビルド成果物は <code>.gitignore</code>{" "}
                  に含まれていればデフォルトで無視される。それ以外の巨大な生成ファイルは{" "}
                  <code>.cursorignore</code> に追記する
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepBody}>
              <h4>
                <code>.cursorignore</code> で機密情報とノイズを遮断する
              </h4>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>.cursorignore</span>
                </div>
                <pre>
                  <code className="language-plaintext">{`node_modules/
dist/
*.min.js
.env*`}</code>
                </pre>
              </div>
              <p>
                <code>.env</code> ファイル・<code>.git/</code>
                ・ロックファイルはデフォルトで無視される。<code>.gitignore</code>{" "}
                のパターンも自動的に尊重されるため、<code>.cursorignore</code> は「Git 管理外だが AI
                には見せたくない」追加分の除外に使う。
              </p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>除外すべき理由</th>
                      <th>対象例</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>インデックス速度の低下を防ぐ</td>
                      <td>大きな生成ファイル</td>
                    </tr>
                    <tr>
                      <td>機密情報の漏洩を防ぐ</td>
                      <td>シークレット・認証情報</td>
                    </tr>
                    <tr>
                      <td>ノイズを減らす</td>
                      <td>バイナリファイル・アセット</td>
                    </tr>
                    <tr>
                      <td>無駄な文脈消費を防ぐ</td>
                      <td>
                        <code>node_modules</code> などのサードパーティコード
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={`${styles.box} ${styles.warn}`}>
                <div className={styles.boxTitle}>⚠ 注意</div>
                <p style={{ marginBottom: 0 }}>
                  <strong>
                    ターミナルコマンドや MCP ツールは Cursor
                    のファイルアクセス制御の外で動作するため、無視設定をしていても読み取れてしまう可能性がある
                  </strong>
                  点には注意が必要である。真に機密性の高い情報はそもそもリポジトリに置かない設計が前提になる。
                </p>
              </div>
            </div>
          </div>

          <div className={styles.figure}>
            <p className={styles.figureLead}>
              This diagram illustrates the context sources synthesized by the agent.
            </p>
            <div className={styles.figureCanvas}>
              <MermaidDiagram chart={DIAGRAMS.d07_context_sources} />
            </div>
          </div>
          <div className={styles.figureLegend}>
            <div className={styles.legendTitle}>各ノードの意味</div>
            <dl>
              <div>
                <dt>文脈の合成</dt>
                <dd>
                  明示的な指定（Rules・@メンション）と暗黙的な検索（インデックス・MCP・Skills）が1つの入力にまとめられる箇所
                </dd>
              </div>
            </dl>
          </div>

          <div className={`${styles.box} ${styles.glossary}`}>
            <div className={styles.boxTitle}>📖 用語ノート</div>
            <dl>
              <div>
                <dt>セマンティック検索</dt>
                <dd>キーワード一致ではなく意味の近さでコードを検索する仕組み</dd>
              </div>
              <div>
                <dt>コンテキストリング</dt>
                <dd>現在のトークン使用量を視覚的に示すUI要素</dd>
              </div>
            </dl>
          </div>

          <div className={styles.sectionRefs}>
            <div className={styles.boxTitle}>📎 参照URL</div>
            <ul className={styles.refs}>
              <li>
                <span className={styles.refTag}>01</span>
                <Ext href="https://cursor.com/docs/agent/prompting">
                  cursor.com/docs/agent/prompting
                </Ext>
              </li>
              <li>
                <span className={styles.refTag}>02</span>
                <Ext href="https://cursor.com/help/customization/context">
                  cursor.com/help/customization/context
                </Ext>
              </li>
              <li>
                <span className={styles.refTag}>03</span>
                <Ext href="https://cursor.com/help/customization/indexing">
                  cursor.com/help/customization/indexing
                </Ext>
              </li>
              <li>
                <span className={styles.refTag}>04</span>
                <Ext href="https://cursor.com/help/customization/ignore-files">
                  cursor.com/help/customization/ignore-files
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== Chapter 8 ==================== */}
        <section className={`${styles.chapter} chapter`} id="ch8">
          <div className={styles.chapterEyebrow}>Chapter 08</div>
          <h2>Rules（ルールによる恒久指示）</h2>

          <div className={styles.introCallout}>
            <span className={styles.icon}>💡</span>
            <div>
              この章では、LLM がリクエスト間で記憶を持たないという前提を踏まえ、Cursor
              がどのように「恒久的な指示」をコンテキストへ埋め込んでいるかを扱います。Rules
              の設計品質が、チーム全体の Agent の再現性を左右します。
            </div>
          </div>

          <p>
            大規模言語モデルは呼び出し（completion）間で記憶を保持しない。Rules
            はプロンプトレベルで永続的かつ再利用可能な文脈を提供する仕組みであり、適用されるとルールの内容がモデルコンテキストの先頭に含まれ、コード生成・編集の解釈・ワークフロー支援に一貫したガイダンスを与える。
          </p>

          <p>Cursor は4種類のルールをサポートする。</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>種類</th>
                  <th>保存場所</th>
                  <th>スコープ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Project Rules</strong>
                  </td>
                  <td>
                    <code>.cursor/rules</code>（バージョン管理対象）
                  </td>
                  <td>プロジェクト単位</td>
                </tr>
                <tr>
                  <td>
                    <strong>User Rules</strong>
                  </td>
                  <td>Cursor 設定内（グローバル）</td>
                  <td>ユーザー環境全体（Agent Chat のみ）</td>
                </tr>
                <tr>
                  <td>
                    <strong>Team Rules</strong>
                  </td>
                  <td>ダッシュボード管理</td>
                  <td>チーム全体（Team / Enterprise プラン）</td>
                </tr>
                <tr>
                  <td>
                    <strong>AGENTS.md</strong>
                  </td>
                  <td>プロジェクトルート／サブディレクトリ</td>
                  <td>
                    <code>.cursor/rules</code> のシンプルな代替
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepBody}>
              <h4>Project Rules の構造を理解する</h4>
              <p>
                ルールは <code>.cursor/rules</code> 以下に配置する Markdown ファイル（
                <code>.md</code> または <code>.mdc</code>
                ）で、任意のファイル名を付けられる。フロントマターで <code>description</code> と{" "}
                <code>globs</code> を細かく制御したい場合は <code>.mdc</code> を使う。
              </p>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>.cursor/rules/ 構成例</span>
                </div>
                <pre>
                  <code className="language-plaintext">{`.cursor/rules/
  react-patterns.mdc       # フロントマター付き（description, globs）
  api-guidelines.md        # シンプルな Markdown ルール
  frontend/                # フォルダで整理も可能
    components.md`}</code>
                </pre>
              </div>
              <p>
                適用タイプは4種類あり、フロントマターの <code>description</code> /{" "}
                <code>globs</code> / <code>alwaysApply</code> の組み合わせで決まる。
              </p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>適用タイプ</th>
                      <th>説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Always Apply</strong>
                      </td>
                      <td>すべてのチャットセッションに適用</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Apply Intelligently</strong>
                      </td>
                      <td>
                        Agent が <code>description</code> を見て関連性があると判断した場合に適用
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Apply to Specific Files</strong>
                      </td>
                      <td>ファイルパスが指定パターンに一致した場合に適用</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Apply Manually</strong>
                      </td>
                      <td>
                        チャットで <code>@ルール名</code> と明示的にメンションした場合のみ適用
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>service-rule.mdc</span>
                </div>
                <pre>
                  <code className="language-markdown">{`---
globs:
alwaysApply: false
---

- サービス定義には社内 RPC パターンを使うこと
- サービス名は必ず snake_case にすること

@service-template.ts`}</code>
                </pre>
              </div>
              <p>グロブパターンの例：</p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>パターン</th>
                      <th>マッチ対象</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>*</code>
                      </td>
                      <td>任意の単一ファイル名セグメント</td>
                    </tr>
                    <tr>
                      <td>
                        <code>**</code>
                      </td>
                      <td>任意階層のディレクトリ（再帰）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>*.ts</code>
                      </td>
                      <td>
                        ルート直下の全 <code>.ts</code> ファイル
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"**/*.ts"}</code>
                      </td>
                      <td>
                        任意のディレクトリ配下の全 <code>.ts</code> ファイル
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"src/**"}</code>
                      </td>
                      <td>
                        <code>src/</code> 配下すべて
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"src/**/*.tsx"}</code>
                      </td>
                      <td>
                        <code>src/</code> 配下の任意階層の <code>.tsx</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"docs/**/*.md, docs/**/*.mdx"}</code>
                      </td>
                      <td>
                        <code>docs/</code> 配下の <code>.md</code> と <code>.mdx</code>
                        （カンマ区切り）
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>tailwind.config.*</code>
                      </td>
                      <td>
                        拡張子を問わない <code>tailwind.config</code>
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
              <h4>ルールを作成する</h4>
              <ul>
                <li>
                  <strong>チャットから</strong>：<code>/create-rule</code>{" "}
                  と入力し内容を説明すると、Agent が適切なフロントマター付きのルールファイルを生成し{" "}
                  <code>.cursor/rules</code> に保存する
                </li>
                <li>
                  <strong>設定画面から</strong>：<code>Cursor Settings &gt; Rules, Commands</code>{" "}
                  で <code>+ Add Rule</code> をクリックする。すべてのルールとその状態を一覧できる
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepBody}>
              <h4>（最重要）ベストプラクティスを守る</h4>
              <p>
                良いルールは<strong>焦点が絞られ、実行可能で、スコープが明確</strong>である。
              </p>
              <div className={`${styles.box} ${styles.tip}`}>
                <div className={styles.boxTitle}>✓ Best Practice</div>
                <ul style={{ marginBottom: 0 }}>
                  <li>ルールは 500 行未満に収める</li>
                  <li>大きなルールは複数の合成可能なルールに分割する</li>
                  <li>具体例か参照ファイルを添える</li>
                  <li>曖昧な指示を避け、社内ドキュメントのように明確に書く</li>
                  <li>同じプロンプトをチャットで繰り返し打っているならルール化する</li>
                  <li>
                    ファイルの内容をそのままコピーせず <code>@ファイル名</code>{" "}
                    で参照する（内容が古くならず、ルールも短く保てる）
                  </li>
                </ul>
              </div>
              <p>
                <strong>避けるべきこと</strong>：
              </p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>アンチパターン</th>
                      <th>理由・代替策</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>スタイルガイドを丸ごとコピーする</td>
                      <td>リンターに任せる。Agent は一般的な規約をすでに理解している</td>
                    </tr>
                    <tr>
                      <td>すべてのコマンドを網羅的に記載する</td>
                      <td>npm・git・pytest のような一般的なツールは Agent が既に知っている</td>
                    </tr>
                    <tr>
                      <td>稀にしか起きないエッジケースの指示を大量に書く</td>
                      <td>頻繁に使うパターンだけに絞る</td>
                    </tr>
                    <tr>
                      <td>コードベースの内容をルールに重複させる</td>
                      <td>正規の実装例をコピーせず参照する</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                まずはシンプルに始め、
                <strong>Agent が同じミスを繰り返した時にだけルールを追加する</strong>
                。過剰最適化する前にまず自分たちのパターンを理解することが優先される。ルールは Git
                にコミットしてチーム全体で恩恵を受けられるようにし、ミスに気づいたらルールを更新する。GitHub
                の Issue や PR で <code>@cursor</code> にタグ付けしてルール更新自体を Agent
                に任せることもできる。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepBody}>
              <h4>AGENTS.md というシンプルな代替</h4>
              <p>
                <code>AGENTS.md</code> はフロントマターや複雑な設定を持たないプレーンな Markdown
                で、シンプルな用途に向く。プロジェクトルートおよびサブディレクトリの両方に配置できる。
              </p>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>AGENTS.md</span>
                </div>
                <pre>
                  <code className="language-markdown">{`# Project Instructions

## Code Style
- 新規ファイルはすべて TypeScript を使う
- React は関数コンポーネントを優先する
- DB カラム名は snake_case にする

## Architecture
- リポジトリパターンに従う
- ビジネスロジックはサービス層に置く`}</code>
                </pre>
              </div>
              <p>
                ネストした <code>AGENTS.md</code>{" "}
                もサポートされており、より具体的な階層の指示が優先されつつ親ディレクトリの指示とマージされる。
              </p>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>ディレクトリ構成例</span>
                </div>
                <pre>
                  <code className="language-plaintext">{`project/
  AGENTS.md              # 全体指示
  frontend/
    AGENTS.md            # フロントエンド向け指示
    components/
      AGENTS.md          # コンポーネント向け指示
  backend/
    AGENTS.md            # バックエンド向け指示`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>5</div>
            <div className={styles.stepBody}>
              <h4>Team Rules と適用優先順位を理解する</h4>
              <p>
                Team / Enterprise
                プランでは、管理者がダッシュボードから組織全体にルールを強制できる。
              </p>
              <ul>
                <li>
                  <strong>Enable this rule immediately</strong>
                  ：チェックすると作成直後から有効化。未チェックの場合はドラフトとして保存され、後で有効化するまで適用されない
                </li>
                <li>
                  <strong>Enforce this rule</strong>
                  ：有効にするとチームメンバー全員に必須となり、個人設定で無効化できなくなる。無効の場合、非強制の
                  Team Rule はメンバーが <code>Cursor Settings → Rules</code> の Team Rules
                  セクションでオフにできる
                </li>
              </ul>
              <div className={`${styles.box} ${styles.warn}`}>
                <div className={styles.boxTitle}>⚠ 注意</div>
                <p style={{ marginBottom: 0 }}>
                  <strong>適用順序</strong>：<code>Team Rules → Project Rules → User Rules</code>{" "}
                  の順に適用され、すべて合成される。指示が競合した場合は
                  <strong>先に適用されたソースが優先</strong>
                  される。強制ルールをコンプライアンス運用の一部として使うことは可能だが、AI
                  によるガイダンスだけをセキュリティ上の唯一の統制にすべきではない。
                </p>
              </div>
            </div>
          </div>

          <div className={styles.figure}>
            <p className={styles.figureLead}>
              This diagram shows rule synthesis and priority ordering.
            </p>
            <div className={styles.figureCanvas}>
              <MermaidDiagram chart={DIAGRAMS.d08_rules_priority} />
            </div>
          </div>
          <div className={styles.figureLegend}>
            <div className={styles.legendTitle}>各ノードの意味</div>
            <dl>
              <div>
                <dt>コンテキストへの合成</dt>
                <dd>適用条件を満たすすべてのルールが1つのコンテキストにまとめられる箇所</dd>
              </div>
              <div>
                <dt>先勝ち</dt>
                <dd>Team Rules → Project Rules → User Rules の順で優先度が決まる原則</dd>
              </div>
            </dl>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>6</div>
            <div className={styles.stepBody}>
              <h4>外部リポジトリからルールをインポートする</h4>
              <ol>
                <li>
                  <code>Cursor Settings → Rules, Commands</code> を開く
                </li>
                <li>
                  <code>Project Rules</code> の <code>+ Add Rule</code> から{" "}
                  <code>Remote Rule (Github)</code> を選択
                </li>
                <li>
                  ルールを含む GitHub リポジトリの URL を貼り付ける（Cursor が <code>.mdc</code>{" "}
                  ファイルをすべてスキャンする）
                </li>
                <li>
                  <code>.cursor/rules/imported/&lt;repoName&gt;</code>{" "}
                  にルールが同期される（相対パスも保持される）
                </li>
              </ol>
            </div>
          </div>

          <h3>FAQ（つまずきやすいポイント）</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>疑問</th>
                  <th>回答</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ルールが適用されない</td>
                  <td>
                    <code>Apply Intelligently</code> は <code>description</code> が必須。
                    <code>Apply to Specific Files</code> は参照ファイルがグロブに一致しているか確認
                  </td>
                </tr>
                <tr>
                  <td>ルールは他ファイルを参照できるか</td>
                  <td>
                    <code>@filename.ts</code> で可能。ルールもチャットから <code>@ルール名</code>{" "}
                    で手動適用できる
                  </td>
                </tr>
                <tr>
                  <td>ルールは Tab に影響するか</td>
                  <td>影響しない。Tab や他の AI 機能には適用されない</td>
                </tr>
                <tr>
                  <td>User Rules は Inline Edit（Cmd+K）に効くか</td>
                  <td>効かない。User Rules は Agent（Chat）専用</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.box} ${styles.glossary}`}>
            <div className={styles.boxTitle}>📖 用語ノート</div>
            <dl>
              <div>
                <dt>フロントマター（frontmatter）</dt>
                <dd>Markdown ファイル冒頭に YAML 形式で書くメタデータ</dd>
              </div>
              <div>
                <dt>グロブパターン</dt>
                <dd>ファイルパスの一致条件を記述するワイルドカード構文</dd>
              </div>
            </dl>
          </div>

          <div className={styles.sectionRefs}>
            <div className={styles.boxTitle}>📎 参照URL</div>
            <ul className={styles.refs}>
              <li>
                <span className={styles.refTag}>01</span>
                <Ext href="https://cursor.com/docs/rules">cursor.com/docs/rules</Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== Chapter 9 ==================== */}
        <section className={`${styles.chapter} chapter`} id="ch9">
          <div className={styles.chapterEyebrow}>Chapter 09</div>
          <h2>MCP（Model Context Protocol）</h2>

          <div className={styles.introCallout}>
            <span className={styles.icon}>💡</span>
            <div>
              この章では、Cursor を外部ツール・データソースに接続するオープンプロトコルである MCP
              の仕組みと、設定・認証・セキュリティのベストプラクティスを扱います。
            </div>
          </div>

          <p>
            MCP（Model Context Protocol）は Cursor
            を外部のツールやデータソースに接続するための仕組みである。プロジェクト構造を毎回説明する代わりに、ツールと直接統合できる。MCP
            サーバーは <code>stdout</code> に出力するか HTTP
            エンドポイントを提供できる言語であれば何でも実装可能（Python・JavaScript・Go
            など）。公式プラグインは Cursor Marketplace で、コミュニティ製は{" "}
            <code>cursor.directory</code> で探せる。
          </p>

          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepBody}>
              <h4>3つのトランスポート方式を理解する</h4>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>トランスポート</th>
                      <th>実行環境</th>
                      <th>デプロイ</th>
                      <th>利用者</th>
                      <th>入力形式</th>
                      <th>認証</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>stdio</strong>
                      </td>
                      <td>ローカル</td>
                      <td>Cursor が管理</td>
                      <td>単一ユーザー</td>
                      <td>シェルコマンド</td>
                      <td>手動</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>SSE</strong>
                      </td>
                      <td>ローカル／リモート</td>
                      <td>サーバーとしてデプロイ</td>
                      <td>複数ユーザー</td>
                      <td>SSE エンドポイント URL</td>
                      <td>OAuth</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Streamable HTTP</strong>
                      </td>
                      <td>ローカル／リモート</td>
                      <td>サーバーとしてデプロイ</td>
                      <td>複数ユーザー</td>
                      <td>HTTP エンドポイント URL</td>
                      <td>OAuth</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Cursor がサポートするプロトコル機能：<strong>Tools</strong>（AI
                モデルが実行する関数）・<strong>Prompts</strong>
                （テンプレート化されたワークフロー）・<strong>Resources</strong>（構造化データ）・
                <strong>Roots</strong>（サーバー起点の URI／ファイルシステム境界の照会）・
                <strong>Elicitation</strong>（サーバーからユーザーへの追加情報要求）・
                <strong>Apps</strong>（拡張、ツールが返すインタラクティブ UI）。MCP Apps
                はプログレッシブエンハンスメント設計であり、ホスト側が UI
                表示に非対応でも通常のツール応答として機能する。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepBody}>
              <h4>MCP サーバーをインストールする</h4>
              <ol>
                <li>
                  <strong>ワンクリックインストール</strong>：Cursor Marketplace
                  から公式プラグインを「Add to Cursor」でインストールし OAuth 認証する
                </li>
                <li>
                  <strong>
                    <code>mcp.json</code> による手動設定
                  </strong>
                  ：
                </li>
              </ol>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>ローカルサーバー（Node.js）</span>
                </div>
                <pre>
                  <code className="language-json">{`{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "mcp-server"],
      "env": { "API_KEY": "value" }
    }
  }
}`}</code>
                </pre>
              </div>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>リモートサーバー</span>
                </div>
                <pre>
                  <code className="language-json">{`{
  "mcpServers": {
    "server-name": {
      "url": "http://localhost:3000/mcp",
      "headers": { "API_KEY": "value" }
    }
  }
}`}</code>
                </pre>
              </div>
              <p>
                <strong>設定ファイルの配置場所</strong>：プロジェクト固有は{" "}
                <code>.cursor/mcp.json</code>、全プロジェクト共通は <code>~/.cursor/mcp.json</code>
                。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepBody}>
              <h4>STDIO サーバーの設定フィールドを押さえる</h4>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>フィールド</th>
                      <th>必須</th>
                      <th>説明</th>
                      <th>例</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>type</code>
                      </td>
                      <td>✅</td>
                      <td>接続種別</td>
                      <td>
                        <code>"stdio"</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>command</code>
                      </td>
                      <td>✅</td>
                      <td>サーバー実行コマンド（PATH 上、または絶対パス）</td>
                      <td>
                        <code>"npx"</code>, <code>"node"</code>, <code>"python"</code>,{" "}
                        <code>"docker"</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>args</code>
                      </td>
                      <td>–</td>
                      <td>コマンドへの引数配列</td>
                      <td>
                        <code>["server.py", "--port", "3000"]</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>env</code>
                      </td>
                      <td>–</td>
                      <td>サーバーの環境変数</td>
                      <td>
                        <code>{`{"API_KEY": "\\\${env:api-key}"}`}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>envFile</code>
                      </td>
                      <td>–</td>
                      <td>
                        追加で読み込む環境変数ファイルパス（<strong>stdio のみ対応</strong>）
                      </td>
                      <td>
                        <code>".env"</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepBody}>
              <h4>設定の変数展開（interpolation）を使う</h4>
              <p>
                <code>command</code>・<code>args</code>・<code>env</code>・<code>url</code>・
                <code>headers</code> の値で以下の変数が解決される。
              </p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>構文</th>
                      <th>意味</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>{"$" + "{env:NAME}"}</code>
                      </td>
                      <td>環境変数</td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"$" + "{userHome}"}</code>
                      </td>
                      <td>ホームディレクトリのパス</td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"$" + "{workspaceFolder}"}</code>
                      </td>
                      <td>
                        <code>.cursor/mcp.json</code> を含むプロジェクトルート
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"$" + "{workspaceFolderBasename}"}</code>
                      </td>
                      <td>プロジェクトルートのフォルダ名</td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"$" + "{pathSeparator}"}</code> / <code>{"$" + "{/}"}</code>
                      </td>
                      <td>OS のパス区切り文字</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>変数展開の例</span>
                </div>
                <pre>
                  <code className="language-json">{`{
  "mcpServers": {
    "remote-server": {
      "url": "https://api.example.com/mcp",
      "headers": { "Authorization": "Bearer \${env:MY_SERVICE_TOKEN}" }
    }
  }
}`}</code>
                </pre>
              </div>
              <p>APIキーやトークンはハードコードせず、環境変数経由で渡すのが原則である。</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>5</div>
            <div className={styles.stepBody}>
              <h4>OAuth 認証が必要なリモートサーバーの静的認証情報</h4>
              <p>
                Dynamic Client Registration に非対応で、固定 of Client ID とリダイレクト URL
                のホワイトリスト登録が必要なプロバイダ（Figma・Linear など）向けに、
                <code>auth</code> オブジェクトを指定できる。
              </p>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>静的 OAuth</span>
                </div>
                <pre>
                  <code className="language-json">{`{
  "mcpServers": {
    "oauth-server": {
      "url": "https://api.example.com/mcp",
      "auth": {
        "CLIENT_ID": "your-oauth-client-id",
        "CLIENT_SECRET": "your-client-secret",
        "scopes": ["read", "write"]
      }
    }
  }
}`}</code>
                </pre>
              </div>
              <p>
                Cursor は全 MCP サーバーに共通の固定リダイレクト URL{" "}
                <code>cursor://anysphere.cursor-mcp/oauth/callback</code> を使用する。サーバー識別は
                OAuth の <code>state</code> パラメータで行われるため、1つのリダイレクト URL
                で全サーバーに対応できる。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>6</div>
            <div className={styles.stepBody}>
              <h4>ツール承認と Run Mode</h4>
              <p>
                Cursor はデフォルトで MCP
                ツール使用前に承認を求める。ツール名の横の矢印をクリックすると引数を確認できる。
              </p>
              <ul>
                <li>
                  <strong>Run Mode（Auto-review、Cursor 3.6 以降のデフォルト）</strong>
                  ：許可リスト登録済みの MCP
                  ツールは即座に実行され、それ以外は安全性分類器を経由する
                </li>
                <li>
                  <strong>事前承認の設定</strong>：<code>permissions.json</code>{" "}
                  に承認済みツールを追加、または <code>autoRun</code>{" "}
                  指示でサーバー・ツール単位に分類器の挙動を調整できる
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>7</div>
            <div className={styles.stepBody}>
              <h4>画像を文脈として受け取る</h4>
              <p>
                MCP サーバーはスクリーンショットや図などの画像を base64
                エンコード文字列として返せる。
              </p>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>画像を返すツールの例</span>
                </div>
                <pre>
                  <code className="language-javascript">{`server.tool("generate_image", async (params) => {
  return {
    content: [
      { type: "image", data: RED_CIRCLE_BASE64, mimeType: "image/jpeg" }
    ]
  };
});`}</code>
                </pre>
              </div>
              <p>
                モデルが画像入力に対応していれば、返された画像はチャットに添付され解析対象になる。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>8</div>
            <div className={styles.stepBody}>
              <h4>（重要）セキュリティを常に意識する</h4>
              <p>
                MCP
                サーバーは外部サービスへアクセスし、ユーザーに代わってコードを実行できる。以下を必ず守る。
              </p>
              <div className={`${styles.box} ${styles.warn}`}>
                <div className={styles.boxTitle}>⚠ セキュリティ</div>
                <ul style={{ marginBottom: 0 }}>
                  <li>
                    <strong>出所を検証する</strong>
                    ：信頼できる開発者・リポジトリのサーバーのみをインストールする
                  </li>
                  <li>
                    <strong>権限を確認する</strong>：サーバーがどのデータ・API
                    にアクセスするかを把握する
                  </li>
                  <li>
                    <strong>APIキーを制限する</strong>：必要最小限の権限に絞った制限付きキーを使う
                  </li>
                  <li>
                    <strong>重要な統合ではコードを監査する</strong>
                    ：クリティカルな連携ではソースコードをレビューする
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.figure}>
            <p className={styles.figureLead}>This diagram shows MCP client-server topology.</p>
            <div className={styles.figureCanvas}>
              <MermaidDiagram chart={DIAGRAMS.d09_mcp_architecture} />
            </div>
          </div>
          <div className={styles.figureLegend}>
            <div className={styles.legendTitle}>各ノードの意味</div>
            <dl>
              <div>
                <dt>MCP Client 内蔵</dt>
                <dd>Cursor 内部でツール呼び出しを仲介するコンポーネント</dd>
              </div>
              <div>
                <dt>Agent 実行ループへ合流</dt>
                <dd>ツール結果が Agent のコンテキストに戻り、次の判断材料になる箇所</dd>
              </div>
            </dl>
          </div>

          <h3>トラブルシューティング早見表</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>症状</th>
                  <th>確認手順</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>サーバーの挙動がおかしい</td>
                  <td>
                    <code>Output</code> パネル（<code>Cmd/Ctrl+Shift+U</code>）→{" "}
                    <code>MCP Logs</code> で接続エラー・認証エラー・クラッシュを確認
                  </td>
                </tr>
                <tr>
                  <td>一時的に切りたい</td>
                  <td>
                    <code>Settings &gt; Features &gt; Model Context Protocol</code>{" "}
                    でトグルをオフ（設定は保持される）
                  </td>
                </tr>
                <tr>
                  <td>サーバーがクラッシュ／タイムアウトした</td>
                  <td>
                    チャットにエラー表示、該当ツール呼び出しは失敗扱い。他のサーバーには影響しない設計
                  </td>
                </tr>
                <tr>
                  <td>npm 製サーバーを更新したい</td>
                  <td>
                    設定から一度削除 → <code>npm cache clean --force</code> → 再追加で最新版取得
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.box} ${styles.glossary}`}>
            <div className={styles.boxTitle}>📖 用語ノート</div>
            <dl>
              <div>
                <dt>MCP（Model Context Protocol）</dt>
                <dd>AI アプリケーションと外部ツール・データソースを繋ぐオープンな標準規格</dd>
              </div>
              <div>
                <dt>Elicitation</dt>
                <dd>MCP サーバーがユーザーへ追加情報を能動的に要求する機能</dd>
              </div>
              <div>
                <dt>Dynamic Client Registration</dt>
                <dd>OAuth クライアントを動的に自動登録する仕組み</dd>
              </div>
            </dl>
          </div>

          <div className={styles.sectionRefs}>
            <div className={styles.boxTitle}>📎 参照URL</div>
            <ul className={styles.refs}>
              <li>
                <span className={styles.refTag}>01</span>
                <Ext href="https://cursor.com/docs/mcp">cursor.com/docs/mcp</Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== Chapter 10 ==================== */}
        <section className={`${styles.chapter} chapter`} id="ch10">
          <div className={styles.chapterEyebrow}>Chapter 10</div>
          <h2>Agent Skills</h2>

          <div className={styles.introCallout}>
            <span className={styles.icon}>💡</span>
            <div>
              この章では、Agent
              に特定タスク遂行のための専門知識をパッケージ化して渡す「Skills」の設計方法を扱います。Rules
              との違いを理解することが、コンテキストを無駄なく保つ鍵になります。
            </div>
          </div>

          <p>
            Skill
            は、エージェントにドメイン固有のタスク遂行方法を教える、ポータブルでバージョン管理可能なパッケージである。スクリプト・テンプレート・参照資料を同梱でき、必要になったときだけ段階的にロードされる（プログレッシブ）ため、コンテキスト消費を抑えられる。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>特性</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>ポータブル</strong>
                  </td>
                  <td>
                    Agent Skills 標準に対応するどのエージェントでも動作する（Cursor / Claude / Codex
                    間で互換性あり）
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>バージョン管理可能</strong>
                  </td>
                  <td>
                    ファイルとして保存されリポジトリで追跡、または GitHub リンクからインストール可能
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>アクション可能</strong>
                  </td>
                  <td>
                    エージェントがツールを使って実行できるスクリプト・テンプレート・参照資料を含められる
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>プログレッシブ</strong>
                  </td>
                  <td>リソースをオンデマンドで読み込み、コンテキスト使用を効率化する</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepBody}>
              <h4>Skill が発見される仕組みを理解する</h4>
              <p>
                Cursor 起動時に以下のディレクトリからスキルを自動検出し、Agent
                が利用可能な状態にする。関連性の判断は Agent 自身が行うほか、チャットで{" "}
                <code>/</code> を入力してスキル名を検索し手動起動もできる。
              </p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>配置場所</th>
                      <th>スコープ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>.agents/skills/</code>
                      </td>
                      <td>プロジェクト単位</td>
                    </tr>
                    <tr>
                      <td>
                        <code>.cursor/skills/</code>
                      </td>
                      <td>プロジェクト単位</td>
                    </tr>
                    <tr>
                      <td>
                        <code>~/.agents/skills/</code>
                      </td>
                      <td>ユーザー単位（グローバル）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>~/.cursor/skills/</code>
                      </td>
                      <td>ユーザー単位（グローバル）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                互換性のため <code>.claude/skills/</code>・<code>.codex/skills/</code>
                （およびそれぞれの <code>~/</code> 版）も読み込まれる。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepBody}>
              <h4>SKILL.md を書く</h4>
              <p>
                各スキルは <code>SKILL.md</code> を含むフォルダで構成する。
              </p>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>ディレクトリ構成</span>
                </div>
                <pre>
                  <code className="language-plaintext">{`.agents/
└── skills/
    └── deploy-app/
        ├── SKILL.md
        ├── scripts/
        │   ├── deploy.sh
        │   └── validate.py
        ├── references/
        │   └── REFERENCE.md
        └── assets/
            └── config-template.json`}</code>
                </pre>
              </div>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>SKILL.md</span>
                </div>
                <pre>
                  <code className="language-markdown">{`---
name: my-skill
description: このスキルが何をするか、いつ使うべきかの説明
---

# My Skill

エージェント向けの詳細な指示。

## When to Use
- こういうときに使う
- こういう場面で役立つ

## Instructions
- 手順を段階的に記述する
- ドメイン固有の規約を記述する`}</code>
                </pre>
              </div>
              <p>フロントマターの各フィールド：</p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>フィールド</th>
                      <th>必須</th>
                      <th>説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>name</code>
                      </td>
                      <td>✅</td>
                      <td>
                        スキル識別子。小文字・数字・ハイフンのみ。親フォルダ名と一致させる必要がある
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>description</code>
                      </td>
                      <td>✅</td>
                      <td>何をするか・いつ使うかの説明。Agent がこれを見て関連性を判断する</td>
                    </tr>
                    <tr>
                      <td>
                        <code>paths</code>
                      </td>
                      <td>–</td>
                      <td>
                        スキルを特定ファイルに絞るグロブパターン（カンマ区切り文字列 or 配列）
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>disable-model-invocation</code>
                      </td>
                      <td>–</td>
                      <td>
                        <code>true</code> にすると <code>/skill-name</code>{" "}
                        での明示呼び出し専用になる（自動判断されない）
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>metadata</code>
                      </td>
                      <td>–</td>
                      <td>任意のキーバリューメタデータ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepBody}>
              <h4>
                <code>paths</code> でスキルをファイル種別に絞る
              </h4>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>paths フィールドの例</span>
                </div>
                <pre>
                  <code className="language-markdown">{`---
name: react-component-patterns
description: このコードベースにおける React コンポーネントの規約
paths:
  - "**/*.tsx"
  - "packages/ui/**/*.ts"
---`}</code>
                </pre>
              </div>
              <p>
                <code>paths</code> を設定すると、Agent
                が一致するファイルを読み書きしている時だけスキルが提示される。無関係な作業でファイル固有のガイダンスがコンテキストに混ざるのを防げる。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepBody}>
              <h4>ネストしたスキルディレクトリでモノレポを整理する</h4>
              <p>
                Cursor
                はスキルルートを再帰的に走査するため、カテゴリ別・チーム別にサブディレクトリでスキルを整理できる。
              </p>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>カテゴリ別の整理例</span>
                </div>
                <pre>
                  <code className="language-plaintext">{`.cursor/
└── skills/
    ├── shipping/
    │   ├── land-it/SKILL.md
    │   └── careful-merge-conflicts/SKILL.md
    ├── debugging/
    │   └── using-datadog-mcp/SKILL.md
    └── workflow/
        └── tdd/SKILL.md`}</code>
                </pre>
              </div>
              <p>
                さらに、モノレポ内のネストしたプロジェクトサブディレクトリに置かれた{" "}
                <code>.cursor/skills/</code>（または <code>.agents/skills/</code>
                ）も自動検出される。この場合、そのスキルは配置先ディレクトリ配下のファイルにのみ自動的にスコープされる（
                <code>paths</code> を明示的に設定しなくてよい）。
              </p>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>モノレポでの自動スコープ例</span>
                </div>
                <pre>
                  <code className="language-plaintext">{`my-monorepo/
├── .cursor/skills/         # リポジトリ全体で使えるスキル
│   └── land-it/SKILL.md
└── apps/
    └── web/
        └── .cursor/skills/  # web アプリ専用スキル
            └── deploy-web/SKILL.md`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>5</div>
            <div className={styles.stepBody}>
              <h4>Rules・スラッシュコマンドから Skills へ移行する</h4>
              <p>
                Cursor 2.4 以降には組み込みの <code>/migrate-to-skills</code>{" "}
                スキルがあり、既存の動的ルール（<code>alwaysApply: false</code> かつ{" "}
                <code>globs</code> 未指定＝「Apply
                Intelligently」設定のルール）とスラッシュコマンドをスキルへ変換できる。
                <code>alwaysApply: true</code> や特定の <code>globs</code>{" "}
                を持つルールは、明示的な発火条件を持つため移行対象にならない。
              </p>
              <ol>
                <li>
                  チャットで <code>/migrate-to-skills</code> と入力する
                </li>
                <li>Agent が移行対象のルール・コマンドを特定し変換する</li>
                <li>
                  <code>.cursor/skills/</code> に生成されたスキルをレビューする
                </li>
              </ol>
            </div>
          </div>

          <div className={styles.figure}>
            <p className={styles.figureLead}>
              This decision tree helps decide when to use Rules, Skills, Subagents, or Hooks.
            </p>
            <div className={styles.figureCanvas}>
              <MermaidDiagram chart={DIAGRAMS.d10_skills_decision} />
            </div>
          </div>
          <div className={styles.figureLegend}>
            <div className={styles.legendTitle}>各ノードの意味</div>
            <dl>
              <div>
                <dt>常に守らせたい規約か</dt>
                <dd>Rules を選ぶかどうかの一次判断</dd>
              </div>
              <div>
                <dt>独立した文脈での長時間作業か</dt>
                <dd>
                  コンテキスト分離が必要ならSubagents、そうでなく実行時の許可・拒否制御ならHooksを選ぶ分岐
                </dd>
              </div>
            </dl>
          </div>

          <div className={`${styles.box} ${styles.glossary}`}>
            <div className={styles.boxTitle}>📖 用語ノート</div>
            <dl>
              <div>
                <dt>プログレッシブ（progressive）ロード</dt>
                <dd>必要になった時点でのみリソースを読み込む設計</dd>
              </div>
              <div>
                <dt>SKILL.md</dt>
                <dd>スキルの振る舞いを定義するフロントマター付き Markdown ファイル</dd>
              </div>
            </dl>
          </div>

          <div className={styles.sectionRefs}>
            <div className={styles.boxTitle}>📎 参照URL</div>
            <ul className={styles.refs}>
              <li>
                <span className={styles.refTag}>01</span>
                <Ext href="https://cursor.com/docs/skills">cursor.com/docs/skills</Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== Chapter 11 ==================== */}
        <section className={`${styles.chapter} chapter`} id="ch11">
          <div className={styles.chapterEyebrow}>Chapter 11</div>
          <h2>Subagents（サブエージェント）</h2>

          <div className={styles.introCallout}>
            <span className={styles.icon}>💡</span>
            <div>
              この章では、複雑なタスクを分割し、独立したコンテキストウィンドウで並列に処理させる
              Subagents の設計と、乱用を避けるためのアンチパターンを扱います。
            </div>
          </div>

          <p>
            Subagent は Agent
            がタスクを委任できる専門アシスタントである。それぞれが独自のコンテキストウィンドウで動作し、特定の作業を処理し、結果を親エージェントに返す。複雑なタスクの分解・並列作業・メイン会話のコンテキスト温存に使う。エディタ・CLI・Cloud
            Agents のいずれでも利用できる。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>利点</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>コンテキスト分離</strong>
                  </td>
                  <td>長時間の調査・探索タスクがメイン会話の容量を消費しない</td>
                </tr>
                <tr>
                  <td>
                    <strong>並列実行</strong>
                  </td>
                  <td>
                    複数の Subagent を同時起動し、コードベースの別部分を待ち時間なく処理できる
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>専門特化</strong>
                  </td>
                  <td>カスタムプロンプト・ツールアクセス・モデルをドメイン別に設定できる</td>
                </tr>
                <tr>
                  <td>
                    <strong>再利用性</strong>
                  </td>
                  <td>カスタム Subagent を定義してプロジェクト横断で使い回せる</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepBody}>
              <h4>フォアグラウンドとバックグラウンドを使い分ける</h4>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>モード</th>
                      <th>挙動</th>
                      <th>向いている場面</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Foreground</strong>
                      </td>
                      <td>Subagent の完了までブロックし、結果を即座に返す</td>
                      <td>結果が必要な逐次タスク</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Background</strong>
                      </td>
                      <td>即座に制御を返し、Subagent は独立して作業を続ける</td>
                      <td>長時間タスク・並列ワークストリーム</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepBody}>
              <h4>組み込み Subagent の役割を理解する</h4>
              <p>
                Cursor
                には、コンテキストウィンドウ限界に達しやすい会話パターンの分析に基づいて設計された3つの組み込み
                Subagent がある。設定不要で、必要に応じて Agent が自動的に使う。
              </p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>Subagent</th>
                      <th>役割</th>
                      <th>Subagent 化されている理由</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Explore</strong>
                      </td>
                      <td>コードベースの検索・分析</td>
                      <td>
                        探索は大量の中間出力を生むためメインの文脈を圧迫する。より高速なモデルで多数の並列検索を実行する
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Bash</strong>
                      </td>
                      <td>一連のシェルコマンド実行</td>
                      <td>
                        コマンド出力は冗長になりがちで、隔離することで親エージェントはログではなく判断に集中できる
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Browser</strong>
                      </td>
                      <td>MCP ツール経由のブラウザ操作</td>
                      <td>
                        ブラウザ操作はノイズの多い DOM
                        スナップショットやスクリーンショットを生成するため、結果を絞り込む必要がある
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                これら3種が共通して持つ特性は「ノイズの多い中間出力を生む」「専門プロンプト・ツールアクセスの恩恵を受ける」「大量のコンテキストを消費しうる」の3点であり、Subagent
                化によりコンテキスト分離・モデル柔軟性（探索用途では高速なモデルをデフォルト使用）・コスト効率が得られる。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepBody}>
              <h4>カスタム Subagent を作成する</h4>
              <p>Agent に直接作成を依頼するのが最も簡単な方法である。</p>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>チャットでの依頼例</span>
                </div>
                <pre>
                  <code className="language-plaintext">{`.cursor/agents/verifier.md にYAMLフロントマター（name, description）付きの
サブエージェントファイルを作成してください。verifier サブエージェントは、
完了した作業を検証し、実装が実際に機能しているかを確認し、テストを実行し、
何が合格して何が未完了かを報告するものにしてください。`}</code>
                </pre>
              </div>
              <p>
                より細かく制御したい場合は、プロジェクトまたはユーザーディレクトリに手動でファイルを作成する。
              </p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>種類</th>
                      <th>配置場所</th>
                      <th>スコープ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>プロジェクト Subagent</strong>
                      </td>
                      <td>
                        <code>.cursor/agents/</code>（<code>.claude/agents/</code>・
                        <code>.codex/agents/</code> も互換）
                      </td>
                      <td>現在のプロジェクトのみ</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>ユーザー Subagent</strong>
                      </td>
                      <td>
                        <code>~/.cursor/agents/</code>（<code>~/.claude/agents/</code>・
                        <code>~/.codex/agents/</code> も互換）
                      </td>
                      <td>現在のユーザーの全プロジェクト</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                名前が衝突する場合はプロジェクト Subagent
                が優先され、複数の互換ディレクトリが存在する場合は <code>.cursor/</code> が{" "}
                <code>.claude/</code> や <code>.codex/</code> より優先される。
              </p>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>.cursor/agents/security-auditor.md</span>
                </div>
                <pre>
                  <code className="language-markdown">{`---
name: security-auditor
description: セキュリティ専門家。認証・決済・機密データの実装時に使用する。
model: inherit
readonly: true
---

あなたは脆弱性を監査するセキュリティ専門家です。

呼び出されたら：
1. セキュリティに関わるコードパスを特定する
2. 一般的な脆弱性（インジェクション、XSS、認証バイパス）を確認する
3. シークレットがハードコードされていないか検証する
4. 入力値検証・サニタイズをレビューする

深刻度別に報告する：
- Critical（デプロイ前に必ず修正）
- High（早急に修正）
- Medium（可能なら対応）`}</code>
                </pre>
              </div>
              <p>フロントマターの各フィールド：</p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>フィールド</th>
                      <th>型</th>
                      <th>必須</th>
                      <th>デフォルト</th>
                      <th>説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>name</code>
                      </td>
                      <td>string</td>
                      <td>–</td>
                      <td>ファイル名から自動導出</td>
                      <td>表示名・識別子。小文字とハイフンのみ</td>
                    </tr>
                    <tr>
                      <td>
                        <code>description</code>
                      </td>
                      <td>string</td>
                      <td>–</td>
                      <td>–</td>
                      <td>
                        Task ツールのヒントに表示される短い説明。Agent はこれを読んで委任判断する
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>model</code>
                      </td>
                      <td>string</td>
                      <td>–</td>
                      <td>
                        <code>inherit</code>
                      </td>
                      <td>
                        使用モデル。<code>inherit</code> または具体的なモデルID
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>readonly</code>
                      </td>
                      <td>boolean</td>
                      <td>–</td>
                      <td>
                        <code>false</code>
                      </td>
                      <td>
                        <code>true</code>{" "}
                        の場合、書き込み権限が制限される（ファイル編集・状態変更コマンド不可）
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>is_background</code>
                      </td>
                      <td>boolean</td>
                      <td>–</td>
                      <td>
                        <code>false</code>
                      </td>
                      <td>
                        <code>true</code> の場合、親をブロックせずバックグラウンドで動作する
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={`${styles.box} ${styles.warn}`}>
                <div className={styles.boxTitle}>⚠ 注意</div>
                <p style={{ marginBottom: 0 }}>
                  <code>model</code>{" "}
                  に具体的なモデルIDを指定していても、以下の場合はフォールバックが発生する：
                  <strong>チーム管理者による当該モデルのブロック</strong>、
                  <strong>Max Mode が必要だが有効化されていない</strong>、
                  <strong>現在のプランでそのモデルが利用不可</strong>。
                </p>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepBody}>
              <h4>Subagent を呼び出す</h4>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>呼び出し例</span>
                </div>
                <pre>
                  <code className="language-plaintext">{`> /verifier auth フローが完成しているか確認して
> Use the verifier subagent to confirm the auth flow is complete
> API の変更をレビューしつつ、並行してドキュメントも更新して`}</code>
                </pre>
              </div>
              <p>
                明示的な <code>/名前</code>{" "}
                構文、自然言語での言及、複数タスクの並列実行のいずれもサポートされる。並列実行時は、Agent
                が1つのメッセージ内で複数の Task ツール呼び出しを送信し、Subagent が同時に走る。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>5</div>
            <div className={styles.stepBody}>
              <h4>長時間タスクを再開する</h4>
              <p>
                各 Subagent 実行は Agent ID
                を返す。このIDを渡すことで、文脈を保持したまま再開できる（
                <code>Resume agent abc123 and analyze the remaining test failures</code>{" "}
                のように指示する）。バックグラウンド Subagent
                は実行中の状態をディスクに書き出すため、完了後も会話を継続できる。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>6</div>
            <div className={styles.stepBody}>
              <h4>頻出パターンを押さえる</h4>
              <ul>
                <li>
                  <strong>検証エージェント（Verification agent）</strong>
                  ：完了したと申告された作業が実際に機能するかを、懐疑的な視点で独立検証させるパターン。テストが実際にパスしているか（テストファイルが存在するだけでないか）の確認や、部分的にしか実装されていない機能の検出に有効
                </li>
                <li>
                  <strong>オーケストレーターパターン</strong>：Planner（要件分析・技術計画）→
                  Implementer（計画に基づく実装）→
                  Verifier（要件との一致確認）の3段階を親エージェントが調整する。各引き継ぎで構造化された出力を渡すことで、次のエージェントが明確な文脈を持てるようにする
                </li>
              </ul>
            </div>
          </div>

          <h3>ベストプラクティスとアンチパターン</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ベストプラクティス</th>
                  <th>理由</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>焦点を絞った Subagent を書く</td>
                  <td>「なんでも屋」の汎用ヘルパーは効果が薄い</td>
                </tr>
                <tr>
                  <td>
                    <code>description</code> に投資する
                  </td>
                  <td>Agent が委任するかどうかの判断材料になるため、テストしながら磨き込む</td>
                </tr>
                <tr>
                  <td>プロンプトは簡潔に保つ</td>
                  <td>冗長なプロンプトは焦点をぼかす</td>
                </tr>
                <tr>
                  <td>
                    <code>.cursor/agents/</code> をバージョン管理する
                  </td>
                  <td>チーム全体が恩恵を受けられる</td>
                </tr>
                <tr>
                  <td>Agent 生成→カスタマイズの順で始める</td>
                  <td>ゼロから書くより初期構成が速い</td>
                </tr>
                <tr>
                  <td>構造化出力が必要なら Hooks を使う</td>
                  <td>Subagent の結果を一貫した形式で処理・保存できる</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>アンチパターン</th>
                  <th>何が問題か</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>「コーディングを助ける」のような曖昧な汎用 Subagent を50個作る</td>
                  <td>Agent がいつ使うべきか判断できず、維持コストだけがかかる</td>
                </tr>
                <tr>
                  <td>
                    曖昧な <code>description</code>（例：「一般的なタスクに使う」）
                  </td>
                  <td>
                    委任のシグナルにならない。「OAuth
                    プロバイダによる認証フロー実装時に使う」のように具体化する
                  </td>
                </tr>
                <tr>
                  <td>2,000語の長大なプロンプト</td>
                  <td>賢くはならず、遅く保守しづらくなるだけ</td>
                </tr>
                <tr>
                  <td>コンテキスト分離が不要な単発タスクを Subagent化する</td>
                  <td>スラッシュコマンドの重複。第10章の Skills を使うべき</td>
                </tr>
                <tr>
                  <td>明確に異なるユースケースがないまま Subagent を増やす</td>
                  <td>2〜3個の焦点を絞った Subagent から始め、必要になった時だけ追加する</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.figure}>
            <p className={styles.figureLead}>
              This diagram shows how exploring directly vs via Subagent affects main context size.
            </p>
            <div className={styles.figureCanvas}>
              <MermaidDiagram chart={DIAGRAMS.d11_subagent_isolation} />
            </div>
          </div>
          <div className={styles.figureLegend}>
            <div className={styles.legendTitle}>各ノードの意味</div>
            <dl>
              <div>
                <dt>大量の中間出力がメイン文脈に蓄積</dt>
                <dd>直接検索した場合に発生するコンテキスト圧迫の問題点</dd>
              </div>
              <div>
                <dt>要約のみが親へ返却</dt>
                <dd>Subagent 化によって得られるコンテキスト分離のメリット</dd>
              </div>
            </dl>
          </div>

          <h3>コストとパフォーマンスのトレードオフ</h3>
          <p>
            Subagent は各自が独立したコンテキストウィンドウとトークン使用量を持つ。5つの Subagent
            を並列実行すると、単一エージェントのおよそ5倍 of
            トークンを消費する。単純作業ではメインエージェントの方が速いことも多く、Subagent
            の利点は速度ではなくコンテキスト分離にある。複雑・長時間・並列的な作業でこそ真価を発揮する。
          </p>

          <div className={`${styles.box} ${styles.glossary}`}>
            <div className={styles.boxTitle}>📖 用語ノート</div>
            <dl>
              <div>
                <dt>Task ツール</dt>
                <dd>親エージェントが Subagent を起動するために内部的に呼び出すツール</dd>
              </div>
              <div>
                <dt>オーケストレーターパターン</dt>
                <dd>複数の専門 Subagent を段階的に連携させる設計パターン</dd>
              </div>
            </dl>
          </div>

          <div className={styles.sectionRefs}>
            <div className={styles.boxTitle}>📎 参照URL</div>
            <ul className={styles.refs}>
              <li>
                <span className={styles.refTag}>01</span>
                <Ext href="https://cursor.com/docs/subagents">cursor.com/docs/subagents</Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== Chapter 12 ==================== */}
        <section className={`${styles.chapter} chapter`} id="ch12">
          <div className={styles.chapterEyebrow}>Chapter 12</div>
          <h2>Hooks（フック）</h2>

          <div className={styles.introCallout}>
            <span className={styles.icon}>💡</span>
            <div>
              この章では、Agent 実行ループの各段階に介入し、承認・拒否・追加情報の注入を行う Hooks
              の設計方法を扱います。セキュリティ・監査・フォーマット自動化など、チーム運用で最も差が出る機能です。
            </div>
          </div>

          <p>
            Hooks は、カスタムスクリプトを使って Agent
            ループを観測・制御・拡張する仕組みである。Hooks は標準入出力（stdio）経由で双方向に JSON
            をやり取りするプロセスとして起動され、Agent
            ループの定義済みステージの前後で実行され、挙動を観測・ブロック・変更できる。
          </p>
          <p>
            <strong>主な用途</strong>
            ：編集後のフォーマッタ実行／イベントの分析データ収集／PII・シークレットのスキャン／SQL書き込みなどリスクの高い操作のゲーティング／Subagent（Task
            ツール）実行の制御／セッション開始時のコンテキスト注入。
          </p>

          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepBody}>
              <h4>3つのフックカテゴリを理解する</h4>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>カテゴリ</th>
                      <th>発火タイミング</th>
                      <th>主なフック</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Agent hooks</strong>
                      </td>
                      <td>Cmd+K / Agent Chat のセッション中</td>
                      <td>
                        <code>sessionStart</code>/<code>sessionEnd</code>、<code>preToolUse</code>/
                        <code>postToolUse</code>/<code>postToolUseFailure</code>、
                        <code>subagentStart</code>/<code>subagentStop</code>、
                        <code>beforeShellExecution</code>/<code>afterShellExecution</code>、
                        <code>beforeMCPExecution</code>/<code>afterMCPExecution</code>、
                        <code>beforeReadFile</code>/<code>afterFileEdit</code>、
                        <code>beforeSubmitPrompt</code>、<code>preCompact</code>、<code>stop</code>
                        、<code>afterAgentResponse</code>/<code>afterAgentThought</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Tab hooks</strong>
                      </td>
                      <td>自律的な Tab（インライン補完）操作時</td>
                      <td>
                        <code>beforeTabFileRead</code>、<code>afterTabFileEdit</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>App lifecycle hooks</strong>
                      </td>
                      <td>エージェントセッション外</td>
                      <td>
                        <code>workspaceOpen</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                この分離により、自律的な Tab 操作・ユーザー主導の Agent
                操作・ワークスペース起動時に、それぞれ異なるポリシーを適用できる。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepBody}>
              <h4>クイックスタート（フォーマッタ自動実行の例）</h4>
              <p>
                <code>hooks.json</code> はプロジェクトルート（
                <code>&lt;project&gt;/.cursor/hooks.json</code>）またはホームディレクトリ（
                <code>~/.cursor/hooks.json</code>
                ）に置く。プロジェクトレベルは該当プロジェクトのみ、ホームディレクトリレベルは全プロジェクト共通で適用される。
              </p>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>~/.cursor/hooks.json</span>
                </div>
                <pre>
                  <code className="language-json">{`{
  "version": 1,
  "hooks": {
    "afterFileEdit": [{ "command": "./hooks/format.sh" }]
  }
}`}</code>
                </pre>
              </div>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>hooks/format.sh</span>
                </div>
                <pre>
                  <code className="language-bash">{`#!/bin/bash
# 標準入力を受け取り、何かを行い、exit 0 する
cat > /dev/null
exit 0`}</code>
                </pre>
              </div>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>実行権限の付与</span>
                </div>
                <pre>
                  <code className="language-bash">{`chmod +x ~/.cursor/hooks/format.sh`}</code>
                </pre>
              </div>
              <p>
                プロジェクト用に配置する場合は、プロジェクトルートから実行される点に注意し、パスを{" "}
                <code>.cursor/hooks/format.sh</code> のように書く（<code>./hooks/format.sh</code>{" "}
                ではプロジェクト直下の <code>hooks/</code> を探してしまう）。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepBody}>
              <h4>コマンド型フックとプロンプト型フックを使い分ける</h4>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>種類</th>
                      <th>説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>コマンド型（デフォルト）</strong>
                      </td>
                      <td>シェルスクリプトが標準入力で JSON を受け取り、標準出力で JSON を返す</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>プロンプト型</strong>
                      </td>
                      <td>
                        自然言語の条件を LLM
                        で評価する。カスタムスクリプトを書かずにポリシー適用ができる
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>コマンド型</span>
                </div>
                <pre>
                  <code className="language-json">{`{
  "hooks": {
    "beforeShellExecution": [
      { "command": "./scripts/approve-network.sh", "timeout": 30, "matcher": "curl|wget|nc" }
    ]
  }
}`}</code>
                </pre>
              </div>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>プロンプト型</span>
                </div>
                <pre>
                  <code className="language-json">{`{
  "hooks": {
    "beforeShellExecution": [
      {
        "type": "prompt",
        "prompt": "このコマンドは安全に見えますか？読み取り専用の操作のみ許可してください。",
        "timeout": 10
      }
    ]
  }
}`}</code>
                </pre>
              </div>
              <p>
                <strong>終了コードの意味</strong>：<code>0</code>＝成功（JSON出力を使用）、
                <code>2</code>＝アクションをブロック（<code>permission: deny</code>{" "}
                と同義）、それ以外＝フック失敗（デフォルトはフェイルオープンでアクション続行）。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepBody}>
              <h4>フックの設定ソースと優先順位</h4>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>ソース</th>
                      <th>配置場所</th>
                      <th>特徴</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Enterprise</strong>（MDM管理・全社）
                      </td>
                      <td>
                        macOS: <code>/Library/Application Support/Cursor/hooks.json</code> など
                      </td>
                      <td>組織全体で強制</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Team</strong>（クラウド配布・Enterprise限定）
                      </td>
                      <td>ダッシュボードで設定</td>
                      <td>全チームメンバーへ自動同期</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Project</strong>（プロジェクト固有）
                      </td>
                      <td>
                        <code>&lt;project-root&gt;/.cursor/hooks.json</code>
                      </td>
                      <td>信頼されたワークスペースで実行、バージョン管理対象</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>User</strong>（ユーザー固有）
                      </td>
                      <td>
                        <code>~/.cursor/hooks.json</code>
                      </td>
                      <td>信頼されたワークスペースの外、または全プロジェクトに適用</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={`${styles.box} ${styles.warn}`}>
                <div className={styles.boxTitle}>⚠ 注意</div>
                <p style={{ marginBottom: 0 }}>
                  <strong>優先順位（高い順）</strong>：
                  <code>Enterprise → Team → Project → User</code>
                  。一致するすべてのソースのフックが実行され、応答が競合する場合は優先度の高いソースがマージ時に勝つ。
                </p>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>5</div>
            <div className={styles.stepBody}>
              <h4>Cloud Agents でのフック対応状況</h4>
              <p>
                Cloud Agent はリポジトリの <code>.cursor/hooks.json</code>{" "}
                にあるコマンド型フックを実行する。Enterprise
                プランでは、チームフック・エンタープライズ管理フックも実行される。
              </p>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>フック</th>
                      <th>Cloud Agent 対応</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>beforeShellExecution</code> / <code>afterShellExecution</code>
                      </td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>
                        <code>beforeReadFile</code> / <code>afterFileEdit</code>
                      </td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>
                        <code>preToolUse</code> / <code>postToolUse</code> /{" "}
                        <code>postToolUseFailure</code>
                      </td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>
                        <code>subagentStart</code> / <code>subagentStop</code>
                      </td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>
                        <code>preCompact</code>
                      </td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>
                        <code>sessionStart</code> / <code>sessionEnd</code>
                      </td>
                      <td>❌（VMはタスク送信後に起動するため対応する発火点がない）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>beforeSubmitPrompt</code>
                      </td>
                      <td>❌（VM作成前にプロンプトが送信されるため）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>beforeTabFileRead</code> / <code>afterTabFileEdit</code>
                      </td>
                      <td>❌（TabはIDE専用機能）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>workspaceOpen</code>
                      </td>
                      <td>❌（IDEのライフサイクルフックのため）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>beforeMCPExecution</code> / <code>afterMCPExecution</code>
                      </td>
                      <td>❌（未配線）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>afterAgentResponse</code> / <code>afterAgentThought</code>
                      </td>
                      <td>❌（未配線）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>stop</code>
                      </td>
                      <td>❌（未配線）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={`${styles.box} ${styles.warn}`}>
                <div className={styles.boxTitle}>⚠ 注意</div>
                <p style={{ marginBottom: 0 }}>
                  <strong>
                    ユーザーレベルフック（<code>~/.cursor/hooks.json</code>）は Cloud Agent
                    では利用不可
                  </strong>
                  （VMはローカルのホームディレクトリ設定にアクセスできないため）。
                </p>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>6</div>
            <div className={styles.stepBody}>
              <h4>マッチャーでフックの発火条件を絞る</h4>
              <div className={styles.codeBlock}>
                <div className={styles.codeBlockHead}>
                  <span>matcher の指定例</span>
                </div>
                <pre>
                  <code className="language-json">{`{
  "hooks": {
    "preToolUse": [
      { "command": "./validate-shell.sh", "matcher": "Shell" }
    ],
    "beforeShellExecution": [
      { "command": "./approve-network.sh", "matcher": "curl|wget|nc " }
    ]
  }
}`}</code>
                </pre>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>フック</th>
                      <th>マッチャーの対象</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>preToolUse</code> / <code>postToolUse</code> /{" "}
                        <code>postToolUseFailure</code>
                      </td>
                      <td>
                        ツール種別（<code>Shell</code>, <code>Read</code>, <code>Write</code>,{" "}
                        <code>Grep</code>, <code>Delete</code>, <code>Task</code>, MCP は{" "}
                        <code>MCP:&lt;tool_name&gt;</code>）
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>subagentStart</code> / <code>subagentStop</code>
                      </td>
                      <td>
                        Subagent 種別（<code>generalPurpose</code>, <code>explore</code>,{" "}
                        <code>shell</code> など）
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>beforeShellExecution</code> / <code>afterShellExecution</code>
                      </td>
                      <td>コマンド文字列全体への正規表現的マッチ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <h3>実践例：git コマンドをブロックし gh CLI へ誘導する</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHead}>
              <span>block-git.sh</span>
            </div>
            <pre>
              <code className="language-bash">{`#!/bin/bash
input=$(cat)
command=$(echo "$input" | jq -r '.command // empty')

if [[ "$command" =~ git[[:space:]] ]] || [[ "$command" == "git" ]]; then
    cat << EOF
{
  "continue": true,
  "permission": "deny",
  "user_message": "git コマンドはブロックされました。GitHub CLI (gh) を使ってください。",
  "agent_message": "'$command' はフックによりブロックされました。git clone の代わりに gh repo clone を、git push の代わりに gh の同等コマンドを使用してください。"
}
EOF
else
    echo '{"continue": true, "permission": "allow"}'
fi`}</code>
            </pre>
          </div>
          <p>
            このように <code>beforeShellExecution</code> フックは{" "}
            <code>permission: allow / deny / ask</code>{" "}
            を返すことで、危険な操作をブロックしたり、より安全なコマンドへの誘導メッセージを Agent
            に返したりできる。
          </p>

          <div className={styles.figure}>
            <p className={styles.figureLead}>
              This diagram shows Hook execution order for a shell command.
            </p>
            <div className={styles.figureCanvas}>
              <MermaidDiagram chart={DIAGRAMS.d12_hooks_sequence} />
            </div>
          </div>
          <div className={styles.figureLegend}>
            <div className={styles.legendTitle}>各ノードの意味</div>
            <dl>
              <div>
                <dt>preToolUse</dt>
                <dd>あらゆるツール種別に共通する実行前フック。マッチャーで対象を絞り込める</dd>
              </div>
              <div>
                <dt>beforeShellExecution</dt>
                <dd>
                  シェルコマンドに特化した実行前フック。危険なコマンドのブロックに使われることが多い
                </dd>
              </div>
              <div>
                <dt>afterShellExecution / postToolUse</dt>
                <dd>実行後の監査・追加コンテキスト注入に使う2種類のフック</dd>
              </div>
            </dl>
          </div>

          <h3>パートナー統合（実務で参照する価値がある領域）</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>分野</th>
                  <th>提供パートナー</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>MCP ガバナンス・可視化</td>
                  <td>MintMCP, Oasis Security, Runlayer</td>
                </tr>
                <tr>
                  <td>コードセキュリティ</td>
                  <td>Corridor, Semgrep</td>
                </tr>
                <tr>
                  <td>依存関係セキュリティ</td>
                  <td>Endor Labs</td>
                </tr>
                <tr>
                  <td>エージェントセキュリティ</td>
                  <td>Snyk</td>
                </tr>
                <tr>
                  <td>シークレット管理</td>
                  <td>1Password</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.box} ${styles.glossary}`}>
            <div className={styles.boxTitle}>📖 用語ノート</div>
            <dl>
              <div>
                <dt>フェイルオープン（fail-open）</dt>
                <dd>
                  フック自体が失敗した場合にアクションを通過させるデフォルト挙動（
                  <code>failClosed: true</code> で逆にできる）
                </dd>
              </div>
              <div>
                <dt>マッチャー（matcher）</dt>
                <dd>フックがどの条件で発火するかを絞り込む正規表現的フィルタ</dd>
              </div>
            </dl>
          </div>

          <div className={styles.sectionRefs}>
            <div className={styles.boxTitle}>📎 参照URL</div>
            <ul className={styles.refs}>
              <li>
                <span className={styles.refTag}>01</span>
                <Ext href="https://cursor.com/docs/hooks">cursor.com/docs/hooks</Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== Placeholders for Chapters 13-21 ==================== */}
        {TOC_ITEMS.slice(12).map((item) => (
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
