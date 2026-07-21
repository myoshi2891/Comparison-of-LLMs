import type { Metadata } from "next";
import Ext from "@/components/docs/Ext";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import TocObserver from "@/components/docs/TocObserver";
import { findBySlug } from "@/lib/page-registry";
import styles from "./page.module.css";

const pageEntry = findBySlug("/claude/tag-best-practices");

export const metadata: Metadata = {
  title: `${pageEntry?.title ?? "Claude Tag 活用ガイド"} ― 中級者〜上級者向けベストプラクティス`,
  description:
    pageEntry?.summary ||
    "Slack上でチームがClaudeをタグ付けして仕事を委任できる新機能「Claude Tag」について、公式ドキュメントやコミュニティ発信をもとにまとめた中級者〜上級者向け実践ガイド。",
};

// Mermaidチャートの定義（カラム0配置厳守）
const DIAGRAM_ARCHITECTURE = `flowchart TB
A["Slackチャンネルで @Claude をタスク付きでメンション"] --> B["Claude Tag がスレッドを検知しセッション開始"]
B --> C["使い捨てサンドボックスを起動<br/>Anthropicがホスト・会話が途絶えると破棄"]
C --> D["Agent Proxy経由でのみ外部通信が可能"]
D --> E["許可済みの接続先にアクセス<br/>GitHub / Drive / Datadog / データウェアハウス等"]
E --> F["チェックリストをスレッドに逐次更新しながら作業"]
F --> G["結果をスレッドに投稿<br/>返信・PR作成・チケット起票・ダッシュボード更新など"]
G --> H["チャンネル参加者全員が結果を閲覧し追加指示や修正が可能"]`;

const DIAGRAM_IDENTITY = `flowchart TB
subgraph ORG["組織全体レベル"]
O1["組織共通の認証情報・リポジトリアクセス"]
end
subgraph WS["ワークスペースレベル 公開チャンネル共通"]
W1["組織設定を継承"]
W2["ワークスペース共有メモリを保持"]
end
subgraph PC["プライベートチャンネルレベル"]
P1["ワークスペース設定を継承した上で追加の認証情報を付与可能"]
P2["そのチャンネル専用のメモリを保持"]
end
ORG --> WS
WS --> PC`;

const DIAGRAM_MEMORY = `flowchart TB
A["公開チャンネルでの学習内容<br/>決定事項・訂正・好み"] --> B["ワークスペース共有メモリに保存"]
B --> C["同じワークスペースの別の公開チャンネルからも参照可能"]
D["プライベートチャンネルでの学習内容"] --> E["そのチャンネル専用ストアにのみ保存"]
E --> F["ワークスペース全体には共有されない<br/>ただし作業中はワークスペース記憶を読み取り可能"]
G["DMでのやり取り"] --> H["送信者個人のClaudeアカウント上で完結"]
H --> I["チームのメモリ・権限とは完全に分離"]`;

const DIAGRAM_SETUP = `flowchart TB
S1["Step 1: Slackワークスペースをペアリング<br/>Slackアプリをインストールし @Claude connect でペアリングコードを発行"] --> S2["Step 2: Claudeが最初にアクセスするツールを選択"]
S2 --> S3["Step 3: GitHub連携<br/>Claude GitHub Appをインストール、または既存連携にリポジトリを追加"]
S3 --> S4["Step 4: その他ツール用のアカウントを作成し認証情報を接続"]
S4 --> S5["支出上限(組織全体・チャンネル別)を設定"]
S5 --> S6["非公開チャンネルでテストし動作を確認してから展開"]`;

const DIAGRAM_LIFECYCLE = `flowchart TB
T1["Step 1: タスクを選ぶ<br/>到達可能な入力・明確なゴール・検証可能な結果があるか"] --> T2["Step 2: リクエストを書く<br/>目的・重要性・参照先(ドキュメント名/スレッド/期間)を伝える"]
T2 --> T3["Step 3: Claudeに作業させる<br/>チェックリストがスレッドに逐次更新される"]
T3 --> T4["Step 4: 結果をレビューする<br/>影響度に応じて精査の深さを変える"]
T4 -->|"修正が必要"| T5["具体的に何が違うかを伝えて再依頼"]
T5 --> T3
T4 -->|"問題なし"| T6["チャンネルメモリとして学習を蓄積し次回はより的確に"]`;

const DIAGRAM_LADDER = `flowchart TB
L1["レベル1: メンション時のみ応答<br/>まずはここから始める"] --> L2["レベル2: プロアクティブ応答を許可<br/>忙しいフィードバックチャンネルでは全質問に自動回答"]
L2 --> L3["レベル3: 定期タスクをスケジュール化<br/>毎週月曜9時にダイジェスト投稿 など"]
L3 --> L4["レベル4: 自発的フォローアップ<br/>停滞スレッドの検知・完了時の自動報告"]
L4 --> L5["レベル5: 責務そのものを委譲<br/>領域のオーナーとして日々の判断を任せる"]`;

/**
 * Renders the Claude Tag best-practices guide with chapter navigation and reference content.
 */
export default function Page() {
  return (
    <>
      <TocObserver
        navLinkClassName={styles.tocLink}
        activeClassName={styles.tocLinkActive}
        toggleId="navToggle"
        sidebarId="sidebar"
        sidebarOpenClassName={styles.sidebarOpen}
      />
      <button type="button" className={styles.sidebarToggle} id="navToggle" aria-label="目次を開く">
        ☰ 目次
      </button>

      <div className={styles.layout}>
        <aside className={styles.sidebar} id="sidebar">
          <div className={styles.brand}>CLAUDE TAG GUIDE</div>
          <div className={styles.brandTitle}>
            中級者〜上級者向け
            <br />
            ベストプラクティス
          </div>
          <nav>
            <ol className={styles.tocOl}>
              <li>
                <a href="#overview" className={styles.tocLink}>
                  1. Claude Tagとは何か
                </a>
              </li>
              <li>
                <a href="#vs-cowork-code" className={styles.tocLink}>
                  2. Claude Code / Cowork との違い
                </a>
              </li>
              <li>
                <a href="#architecture" className={styles.tocLink}>
                  3. 全体アーキテクチャ
                </a>
              </li>
              <li>
                <a href="#identity-access" className={styles.tocLink}>
                  4. Identity と Access モデル
                </a>
              </li>
              <li>
                <a href="#memory-model" className={styles.tocLink}>
                  5. メモリモデル
                </a>
              </li>
              <li>
                <a href="#admin-setup" className={styles.tocLink}>
                  6. 管理者向けセットアップ
                </a>
              </li>
              <li>
                <a href="#getting-started" className={styles.tocLink}>
                  7. 使い始めのステップ
                </a>
              </li>
              <li>
                <a href="#task-lifecycle" className={styles.tocLink}>
                  8. タスク委任の4ステップ
                </a>
              </li>
              <li>
                <a href="#proactivity-ladder" className={styles.tocLink}>
                  9. 自律性を段階的に引き上げる
                </a>
              </li>
              <li>
                <a href="#advanced-tips" className={styles.tocLink}>
                  10. 上級者向けTips
                </a>
              </li>
              <li>
                <a href="#security" className={styles.tocLink}>
                  11. セキュリティとガバナンス
                </a>
              </li>
              <li>
                <a href="#known-issues" className={styles.tocLink}>
                  12. 既知の課題・注意点
                </a>
              </li>
              <li>
                <a href="#vs-other-products" className={styles.tocLink}>
                  13. 他製品との比較
                </a>
              </li>
              <li>
                <a href="#checklist" className={styles.tocLink}>
                  14. 導入前チェックリスト
                </a>
              </li>
              <li>
                <a href="#references" className={styles.tocLink}>
                  15. 参考文献・出典
                </a>
              </li>
            </ol>
          </nav>
        </aside>

        <main className={styles.main}>
          <div className={styles.hero}>
            <div className={styles.badgeRow}>
              <span className={`${styles.badge} ${styles.badgeBlue}`}>Public Beta</span>
              <span className={styles.badge}>Claude Team / Enterprise 限定</span>
              <span className={styles.badge}>情報基準日: 2026年7月17日</span>
            </div>
            <h1>
              Claude Tag 活用ガイド
              <br />
              中級者〜上級者向けベストプラクティス
            </h1>
            <p className={styles.subtitle}>
              Slack上でチームがClaudeをタグ付けして仕事を委任できる新機能「Claude
              Tag」について、公式ドキュメント・公式チュートリアル、そして著名な開発者やコミュニティの発信をもとにまとめた実践ガイドです。
            </p>
            <div className={styles.callout}>
              <strong>本ガイドについて</strong> ― Claude Tag
              は現在パブリックベータであり、UIや仕様は今後変更される可能性があります。最新情報は必ず公式ドキュメント(
              <Ext href="https://claude.com/docs/claude-tag/overview">
                claude.com/docs/claude-tag
              </Ext>
              )を確認してください。出典は各セクションおよび第15章「参考文献・出典」に記載しています。
            </div>
          </div>

          {/* 1 */}
          <section id="overview" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>01</span> Claude Tagとは何か
            </h2>
            <div className={styles.prose}>
              <p>
                Claude Tag
                は、2026年6月23日にAnthropicが発表した、Slack上でClaudeをチームメンバーとして参加させる新しい機能です。管理者が特定のチャンネルにClaudeへのアクセス権を付与すると、そのチャンネルにいる誰もが{" "}
                <code>@Claude</code> とタグ付けするだけでタスクを委任できるようになります。
              </p>
              <p>
                Anthropicはこれを「Claude
                Codeの延長線上にある進化」と位置づけており、社内では製品チームのコードの65%がClaude
                Tagの内部版によって生成されているとされています。
              </p>
              <blockquote className={styles.blockquote}>
                「LLMのUI/UXにおける3度目の大きな再設計」
                <cite>― Andrej Karpathy氏(著名AI研究者、Tesla・OpenAIでの経験で知られる)</cite>
              </blockquote>
              <p>
                チャットボックス型の対話から、「作業がすでに行われている場所にAIが常駐する」形への転換点として注目されています。
              </p>
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
                    <td>提供状況</td>
                    <td>パブリックベータ</td>
                  </tr>
                  <tr>
                    <td>対応プラン</td>
                    <td>
                      Claude Team / Claude Enterprise のみ(Free・Pro・Maxの個人プランは対象外)
                    </td>
                  </tr>
                  <tr>
                    <td>稼働モデル</td>
                    <td>Claude Opus 4.8</td>
                  </tr>
                  <tr>
                    <td>提供チャネル</td>
                    <td>まずSlack。今後他のワークプレイスツールへの拡張を予告</td>
                  </tr>
                  <tr>
                    <td>旧製品との関係</td>
                    <td>
                      旧「Claude in
                      Slack」アプリを置き換え。既存ユーザーは30日以内に移行選択可能で、
                      <strong>2026年8月3日に自動移行</strong>が予定されている
                    </td>
                  </tr>
                  <tr>
                    <td>課金モデル</td>
                    <td>座席課金なし。組織の「利用残高(usage balance)」からの従量課金</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 2 */}
          <section id="vs-cowork-code" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>02</span> Claude Code / Cowork との違い
            </h2>
            <div className={styles.prose}>
              <p>
                Claude Tag・Claude Cowork・Claude
                Codeはいずれも「Claudeにタスクを委任する」という点で似ていますが、想定シーンが異なります。公式ドキュメントは「チームで共有チャンネルの仕事をするならClaude
                Tag、個人のファイルで作業するならCoworkかClaude Code」と整理しています。
              </p>
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>Claude Tag</th>
                    <th>Claude Cowork</th>
                    <th>Claude Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>主な利用場所</td>
                    <td>Slackチャンネル・スレッド・DM</td>
                    <td>デスクトップアプリ(個人のワークスペース)</td>
                    <td>ターミナル・IDE・デスクトップアプリ</td>
                  </tr>
                  <tr>
                    <td>誰と共有するか</td>
                    <td>チャンネル参加者全員が同じClaudeとやり取り(マルチプレイヤー)</td>
                    <td>基本的に個人利用</td>
                    <td>基本的に個人利用</td>
                  </tr>
                  <tr>
                    <td>コンテキストの蓄積</td>
                    <td>チャンネル履歴・ワークスペース横断の記憶を自動蓄積</td>
                    <td>セッション・プロジェクト単位</td>
                    <td>リポジトリ単位(CLAUDE.md等)</td>
                  </tr>
                  <tr>
                    <td>実行環境</td>
                    <td>Anthropicホストの使い捨てサンドボックス</td>
                    <td>ローカル/クラウドの作業環境</td>
                    <td>
                      ローカル環境、または<code>--sandbox</code>によるOSレベルの分離
                    </td>
                  </tr>
                  <tr>
                    <td>自発的な行動</td>
                    <td>アンビエント(能動)モードで停滞スレッドの検知・定期実行が可能</td>
                    <td>スケジュールタスクの委任が可能</td>
                    <td>基本は同期的なセッション実行</td>
                  </tr>
                  <tr>
                    <td>課金主体</td>
                    <td>組織(チャンネル作業)/個人(DM)</td>
                    <td>個人・組織</td>
                    <td>個人・組織</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3 */}
          <section id="architecture" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>03</span> 全体アーキテクチャを理解する
            </h2>
            <div className={styles.prose}>
              <p>
                <code>@Claude</code>{" "}
                がタグ付けされてから結果がスレッドに返ってくるまでの流れは、次のようになっています。Claudeはユーザーのローカルマシンやネットワーク内では動作せず、Anthropicがホストする使い捨てサンドボックス上でセッションごとに起動します。
              </p>
            </div>

            <div className={styles.diagramCard}>
              <div className={styles.diagramLabel}>Diagram 01 ― タスク実行の全体フロー</div>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAM_ARCHITECTURE} />
              </div>
            </div>

            <div className={styles.prose}>
              <p>ポイントは次の3つです。</p>
              <ul>
                <li>
                  <strong>セッションはスレッド単位</strong>:
                  新しいトップレベルメッセージは新しいタスクとして扱われるため、続きの作業をしたい場合は同じスレッド内で返信する必要があります。
                </li>
                <li>
                  <strong>既存メッセージの編集は無効</strong>:
                  送信済みメッセージを編集してもClaudeには反映されません。新しい返信を送る必要があります。
                </li>
                <li>
                  <strong>サンドボックスは使い捨て</strong>:
                  インストールした依存関係や未コミットのファイルはセッション終了時に失われるため、保持すべき変更は必ずコミット・プッシュする必要があります。
                </li>
              </ul>
            </div>
          </section>

          {/* 4 */}
          <section id="identity-access" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>04</span> Identity(身元)と Access(権限)モデル
            </h2>
            <div className={styles.prose}>
              <p>
                Claude Tagの安全性を支えているのが「Agent
                Identity(エージェント身元)」というモデルです。Claudeはタグ付けしたユーザー個人の権限を借りるのではなく、
                <strong>Claude自身の専用アカウント</strong>でSlackに投稿し、GitHub App
                としてPRを開き、データウェアハウスには管理者が発行したサービスアカウントで接続します。これにより、共有チャンネルが誰かの個人ドキュメントへの抜け道になることはありません。
              </p>
              <p>アクセス権は次の3階層で管理され、上位階層の設定を下位が継承します。</p>
            </div>

            <div className={styles.diagramCard}>
              <div className={styles.diagramLabel}>Diagram 02 ― Identity / Access 階層モデル</div>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAM_IDENTITY} />
              </div>
            </div>

            <div className={styles.prose}>
              <ul>
                <li>
                  <strong>組織全体</strong>:
                  どこにインストールされていても適用される共通の認証情報・リポジトリ。
                </li>
                <li>
                  <strong>ワークスペース</strong>:
                  あるSlackワークスペース内のすべての公開チャンネルに適用され、組織設定を継承する。
                </li>
                <li>
                  <strong>プライベートチャンネル</strong>:
                  ワークスペース設定に加えて、そのチャンネルだけの追加権限(例:法務チャンネルだけにCRMアクセスを許可)を持たせられる。プライベートチャンネルごとに個別のIdentityが作成され、公開チャンネルはワークスペース単位のIdentityを共有する。
                </li>
              </ul>
              <p>
                Enterprise
                プランでは、ロールベースアクセス制御(RBAC)により「誰がClaudeを呼び出せるか」自体も制御できます。つまり1つのチャンネルが「Claudeが何にアクセスできるか」と「誰がそれを依頼できるか」の両方を規定する単位になります。
              </p>
            </div>
          </section>

          {/* 5 */}
          <section id="memory-model" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>05</span> メモリモデル ― チャンネル・ワークスペース・DM
            </h2>
            <div className={styles.prose}>
              <p>
                Claude
                Tagは「必要な作業のためにコンテキストを構築する」ことを前提に設計されており、タスク終了ごとに記憶を破棄するのではなく、チャンネル・ワークスペース単位でメモリを保持し続けます。管理者はこの記憶を閲覧・編集・削除できます。
              </p>
            </div>

            <div className={styles.diagramCard}>
              <div className={styles.diagramLabel}>Diagram 03 ― メモリのスコープ</div>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAM_MEMORY} />
              </div>
            </div>

            <div className={styles.prose}>
              <p>重要な運用ポイント:</p>
              <ul>
                <li>
                  <code>#launch-week</code> のような公開チャンネルで記録された決定事項は、後から{" "}
                  <code>#gtm-west</code>{" "}
                  のような別チャンネルで尋ねたときにも参照される。Claudeがあるチャンネルの情報を引用した場合、それは「ワークスペース記憶を読んでいる」だけであり、個人についての記録ではない。
                </li>
                <li>
                  チャンネル内で「<code>@Claude このチャンネルについて何を覚えている?</code>
                  」と尋ねると、蓄積された記憶を確認できる。誤った記憶は誰でも訂正・削除を依頼できる。
                </li>
                <li>
                  Slack上でのやり取りは、通常のclaude.aiでの会話履歴とは別管理であり、互いに表示されない。
                </li>
              </ul>
            </div>
          </section>

          {/* 6 */}
          <section id="admin-setup" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>06</span> 管理者向け:セットアップ手順ステップバイステップ
            </h2>
            <div className={styles.prose}>
              <p>
                Claude Tagのセットアップは <code>claude.ai/admin-settings/claude-tag</code>{" "}
                から行い、組織のPrimary
                OwnerまたはOwner権限が必要です(Admin権限では実行不可)。設定は一度行えば、対象チャンネルの全員がすぐに利用を開始できます。
              </p>
            </div>

            <div className={styles.diagramCard}>
              <div className={styles.diagramLabel}>Diagram 04 ― 管理者向けセットアップフロー</div>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAM_SETUP} />
              </div>
            </div>

            <div className={styles.prose}>
              <p>
                <strong>注意点:</strong>
              </p>
              <ul>
                <li>
                  Slackワークスペースのペアリングコマンドは、スレッド内の返信としてではなく、新規のトップレベルメッセージとして送信する必要があります(スレッド内では通常のリクエストとして処理されてしまいます)。
                </li>
                <li>ペアリングコードの有効期限は15分。</li>
                <li>
                  ペアリング自体はSlackワークスペースの管理者権限があれば誰でも実行可能ですが、それ以降のIdentity・接続先・チャンネルごとのアクセス権設定はClaude組織のOwner権限が必要です。
                </li>
                <li>
                  「Access
                  bundle(アクセスバンドル)」という単位で、認証情報とリポジトリのセットをまとめて管理し、それをどのワークスペース・チャンネルに適用するか指定します。
                </li>
              </ul>
            </div>
          </section>

          {/* 7 */}
          <section id="getting-started" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>07</span> エンドユーザー向け:使い始めのステップ
            </h2>
            <div className={styles.prose}>
              <p>
                チャンネルにClaude
                Tagが既に導入されている場合、エンドユーザー側で追加のセットアップは不要です。
              </p>
            </div>

            <div className={styles.stepGrid}>
              <div className={styles.stepCard}>
                <div className={styles.stepNo}>1</div>
                <h4>アクセス範囲を確認する</h4>
                <p>
                  作業を依頼する前に「<code>@Claude このチャンネルから何にアクセスできる?</code>
                  」と尋ねる、またはClaudeの返信フッターにある「Configure」をクリックして接続状況を確認する。
                </p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNo}>2</div>
                <h4>公開チャンネルで作業する</h4>
                <p>
                  DMよりも公開チャンネルでの作業を優先することで、Claudeがチャンネルの履歴全体を文脈として活用でき、チームメイトも成果を再利用できる。
                </p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNo}>3</div>
                <h4>DMは個人の領域</h4>
                <p>
                  DMでは自分のclaude.aiアカウントに紐づく個人の接続(カレンダー・メール等)が使え、チームの権限やメモリとは分離される。管理者はDM自体を組織全体で無効化することもできる。
                </p>
              </div>
            </div>
          </section>

          {/* 8 */}
          <section id="task-lifecycle" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>08</span> ベストプラクティス:タスク委任の4ステップ
            </h2>
            <div className={styles.prose}>
              <p>
                公式チュートリアル「Best practices for using
                @Claude」は、良いタスクの条件を「Claudeが到達可能な入力」「明確に述べられたゴール」「誰かが検証できる結果」の3つとしています。この考え方をもとにした委任のライフサイクルが次の図です。
              </p>
            </div>

            <div className={styles.diagramCard}>
              <div className={styles.diagramLabel}>Diagram 05 ― タスク委任のライフサイクル</div>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAM_LIFECYCLE} />
              </div>
            </div>

            <div className={styles.prose}>
              <p>
                <strong>各ステップの実践ポイント:</strong>
              </p>
              <ul>
                <li>
                  <strong>Step 1(タスクを選ぶ)</strong>:
                  初めての依頼には、すでにチャンネル内にある情報だけで完結するタスク(例:月曜日以降の要約、未対応スレッドの棚卸し)を選ぶと、結果をすぐ自分で検証できる。
                </li>
                <li>
                  <strong>Step 2(リクエストを書く)</strong>:
                  優秀な新人に説明するように、ゴール・背景・参照先を伝える。手順そのものはClaudeに任せてよい。出典を明示するよう依頼すると検証しやすくなる。
                </li>
                <li>
                  <strong>Step 3(作業させる)</strong>:
                  Claudeは着手した旨を短く報告し、チェックリストを更新し続ける。チャンネル内の誰でも途中で文脈を追加したり方向修正したりできる。
                </li>
                <li>
                  <strong>Step 4(レビューする)</strong>:
                  リスクに比例した精査を行う。顧客向けやシステム変更を伴う成果物は入念に確認し、分析系のタスクには「自分の一次回答の誤りを探すセカンドパスをして」と依頼するのも有効。同じ間違いが繰り返される場合は、セッションの実行内容を開いて確認し、訂正内容を伝える。訂正はチャンネルの記憶として蓄積される。
                </li>
              </ul>
            </div>
          </section>

          {/* 9 */}
          <section id="proactivity-ladder" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>09</span> プロアクティブ性と自律性を段階的に引き上げる
            </h2>
            <div className={styles.prose}>
              <p>
                Claude
                Tagは既定では「タグ付けされた時だけ応答する」設定になっています。信頼できると分かった範囲から、段階的に自律性を引き上げていくのが推奨される進め方です。
              </p>
            </div>

            <div className={styles.diagramCard}>
              <div className={styles.diagramLabel}>Diagram 06 ― 自律性のエスカレーションラダー</div>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAGRAM_LADDER} />
              </div>
            </div>

            <div className={styles.prose}>
              <ul>
                <li>
                  <strong>レベル2の切り替え方</strong>:
                  「このチャンネルではタグ付けされた時だけ返信して」「ここでは答えられる質問には全部答えて」など、平易な言葉で指示するだけで挙動が変わる。誤答よりも無回答の方が困る忙しいチャンネルではプロアクティブ設定が有効。プロアクティブ応答自体を有効化できるかは管理者側の設定に依存する。
                </li>
                <li>
                  <strong>レベル3のスケジューリング</strong>:
                  毎週同じ内容を依頼していることに気づいたら、「これを定期実行にして」と伝えるだけでスケジュールタスク化できる。
                </li>
                <li>
                  <strong>レベル4の自発的フォロー</strong>:
                  「3日後に修正が定着しているか確認して」「このスレッドが停滞したら教えて」といった依頼も可能。
                </li>
                <li>
                  <strong>レベル5の権限委譲</strong>:
                  「月曜にダイジェストを投稿して」ではなく「このチャンネルの未解決の質問に責任を持って。毎日確認し、答えられるものは答え、適切な人にタグ付けして」という形で、判断そのものを委ねる。加えて、1日の終わりにチャンネルの振り返りをさせて改善点を書き出させる、複数チャンネルを横断して「繰り返し提起されているのに誰も答えていない話題」を洗い出させる、といった使い方も紹介されています。
                </li>
              </ul>
            </div>
          </section>

          {/* 10 */}
          <section id="advanced-tips" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>10</span> 上級者向けTips ― コミュニティ発の運用ノウハウ
            </h2>
            <div className={styles.prose}>
              <p>
                ここからは公式ドキュメントに加えて、Anthropic社員や著名な開発者がSNS上で共有した運用ノウハウをまとめます(出典は各項目末尾および第15章を参照)。
              </p>
            </div>

            <h3>10.1 Thariq Shihipar氏(Anthropic Claude Codeチーム)による実践Tips</h3>
            <div className={styles.prose}>
              <p>
                AnthropicのClaude Codeチームに所属するThariq Shihipar氏(X: <code>@trq212</code>
                )が公開直後に投稿したベストプラクティス・スレッドは、Slackの公式アカウントから「ステートフルなエージェントワークフローの構築法についての実例」と評されました。要点は次の通りです。
              </p>
              <ul>
                <li>
                  <strong>チャンネルごとにClaudeの個性が異なる前提で「自己紹介」する</strong>:
                  新しいチャンネルに導入したら、ピン留めメッセージでペルソナ・応答方針・記憶してほしい前提を伝える。これはリポジトリの{" "}
                  <code>CLAUDE.md</code> に相当する役割を果たす。
                </li>
                <li>
                  <strong>個人用チャンネルを作る</strong>: <code>#自分の名前-claude</code>{" "}
                  のような専用チャンネルを作り、自分向けのタスクや好みの指示をそこに集約する。バグ報告などを転送しておけば、自分の好みに沿った形で処理させられる。
                </li>
                <li>
                  <strong>ピン留めのステータスメッセージを維持させる</strong>:
                  「常に最新化されたステータスをピン留めメッセージに反映して」と指示しておくと、スレッドの海に埋もれずに全体像を把握できる。
                </li>
                <li>
                  <strong>絵文字リアクションで状態を可視化する</strong>: トップレベルのスレッドに
                  ⏳(進行中)✅(完了)❓(要確認)🛑(停止)のような絵文字でリアクションさせることで、一目で状態が分かるようにする。
                </li>
                <li>
                  <strong>用途特化チャンネルで独創的に使う</strong>:
                  例えば「予定調整」専用チャンネルを作り、参加者がClaudeにタグ付けするだけでカレンダーの空き時間を探させる、といった使い方も紹介されている。
                </li>
              </ul>
            </div>

            <h3>10.2 Cat Wu氏(Anthropic プロダクトマネージャー)によるIdentity/権限の解説</h3>
            <div className={styles.prose}>
              <p>
                Anthropicのプロダクトマネージャーであるcatwu氏(X: <code>@_catwu</code>)は、Agent
                Identityと権限設定の考え方について解説するスレッドを公開しています。要旨は本ガイド第4章の内容と一致しており、「アクセス権は多めに与えてから組織のポリシーに応じて絞り込む方が、実運用では機能しやすい」という知見が共有されています。
              </p>
            </div>

            <h3>10.3 Jason Zhou氏・Matt Pocock氏による「ループエンジニアリング」の視点</h3>
            <div className={styles.prose}>
              <p>
                AI活用のコンテンツで知られるJason Zhou氏(<code>@jasonzhou1993</code>)は、Claude
                Tagの登場を「委任すべき定型業務をエージェントの常設ループに任せ、共有ナレッジ層・ログ・検証を組み合わせる」という、いわゆる
                <strong>ループエンジニアリング(loop engineering)</strong>
                の潮流の一部として位置づけたテンプレートを公開しました。TypeScript教育者として著名なMatt
                Pocock氏(<code>@mattpocockuk</code>
                )も同時期に、「委任できそうな業務を見つけ出す」ための <code>/loop-me</code>{" "}
                スキルを公開しており、Claude
                Tagのような常設エージェントをどう業務に組み込むかという設計思想の広がりを示しています。
              </p>
            </div>

            <h3>10.4 社内活用パターン(Anthropic自身の事例)</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ユースケース</th>
                    <th>動き方</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>インシデント対応</td>
                    <td>
                      インシデントスレッドでタグ付けすると、グラフ取得・デプロイ差分の確認まで行い、原因と担当者候補を提示。承認後は修正の実装・反映・メトリクス回復の確認・クローズまで一気通貫で対応
                    </td>
                  </tr>
                  <tr>
                    <td>バグトリアージ</td>
                    <td>
                      フィードバックチャンネルに常駐し、報告を自動的に拾って該当コードを特定・再現・
                      <code>git blame</code>
                      ・修正実装・担当者へのタグ付けまで実施。残る作業はコードレビューのみ
                    </td>
                  </tr>
                  <tr>
                    <td>依存タスクの待機</td>
                    <td>
                      「バックエンドが完成したらフロントエンドを配線して」のように、前提条件待ちのタスクを渡しておくと、完了を検知してから数日後にPRを提示
                    </td>
                  </tr>
                  <tr>
                    <td>バックグラウンド監視</td>
                    <td>
                      ダッシュボードの代わりに閾値を渡す(例:「CIが赤のまま長く続いたら教えて」)。閾値を超えたときだけ、原因コミットとともに報告
                    </td>
                  </tr>
                  <tr>
                    <td>リリース・指標監視</td>
                    <td>
                      A/Bテストの指標とガードレールを渡しておくと、ガードレール逸脱時に警告、有意差が出たタイミングでロールアウト用PRとともに報告
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 11 */}
          <section id="security" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>11</span> セキュリティとガバナンス
            </h2>
            <div className={styles.prose}>
              <p>
                Claude
                Tagにチームの実務を任せられる根拠となっているのが、以下のセキュリティ設計です。
              </p>
              <ul>
                <li>
                  <strong>サンドボックス分離</strong>:
                  すべてのリクエスト(人が入力したものもスケジュール起動のものも)は、Anthropicがホストする隔離済みサンドボックスの中で実行される。既定では外向き通信がすべてブロックされている。
                </li>
                <li>
                  <strong>Agent Proxy経由の通信のみ許可</strong>: サンドボックスは「Agent
                  Proxy」を経由してのみ外部と通信でき、許可リストにないホストへのデータ送出はブロックされる。どのホストを許可するかは接続ごと・アクセスバンドルごとに管理者が設定する。
                </li>
                <li>
                  <strong>サービスアカウントによる分離</strong>:
                  チャンネル内でのClaudeの行動は、タグ付けした個人のアカウントではなく、管理者が発行した専用のサービスアカウント(Slackアプリ・GitHub
                  App・各種サービスアカウント)で行われる。これにより、個人の認証情報が意図せずチャンネルに流出することを防いでいる。
                </li>
                <li>
                  <strong>監査ログ</strong>: 管理画面の「Organization settings &gt; Claude Tag &gt;
                  Audit」から、スケジュール・単発タスクを問わずすべてのタスクと、Agent
                  Identityによるすべてのネットワーク呼び出しを確認できる。GitHubのコミット・PRにはClaude
                  GitHub Appが作者として記録され、起点となったSlackスレッドへのリンクも付与される。
                </li>
                <li>
                  <strong>支出上限</strong>:
                  組織全体の上限とチャンネル単位の上限の両方を設定でき、利用状況は管理画面の使用量ページでチャンネル別に確認できる。DMでの利用は組織の上限を消費せず、依頼した本人のアカウントの利用枠が使われる。
                </li>
              </ul>
            </div>
          </section>

          {/* 12 */}
          <section id="known-issues" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>12</span> 既知の課題・注意点
            </h2>
            <div className={styles.prose}>
              <p>
                コミュニティやHacker
                Newsでの議論、第三者メディアの分析からは、導入前に把握しておくべき論点がいくつか指摘されています。
              </p>
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>論点</th>
                    <th>内容</th>
                    <th>想定される対処</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>セッションの競合</td>
                    <td>
                      同じチャンネルの複数人が同時に別方向の指示を出すと、進行中のタスクが混乱する可能性がある
                    </td>
                    <td>用途別にチャンネルを分ける、専用のスレッドで作業を継続する</td>
                  </tr>
                  <tr>
                    <td>共有コンテキストのプライバシー</td>
                    <td>チャンネル共有のエージェントに情報を渡すことへの懸念</td>
                    <td>
                      チャンネルごとのアクセス権設定・プライベートチャンネル単位のメモリ分離を活用する
                    </td>
                  </tr>
                  <tr>
                    <td>機械アイデンティティの帰属</td>
                    <td>
                      GitHub連携などが単一のアプリIdentityで動くため、監査ログ上でどのチャンネルのClaudeが操作したかの区別が難しい場合がある
                    </td>
                    <td>監査ログとSlackスレッドへのリンクを併用して追跡する</td>
                  </tr>
                  <tr>
                    <td>「ただのSlack Bot」という懐疑論</td>
                    <td>
                      Anthropicの矢継ぎ早な製品発表を踏まえ、「タグ付けにブランド名を付けただけ」という懐疑的な見方も存在する
                    </td>
                    <td>
                      実際のマルチプレイヤー性・記憶の持続性・自律実行を試した上で評価するのが妥当
                    </td>
                  </tr>
                  <tr>
                    <td>規制業界でのデータ取り扱い</td>
                    <td>
                      医療・金融・法務など機微データを扱う業界では、データ処理契約の確認や、機微チャンネルを対象外にする判断が必要
                    </td>
                    <td>
                      低感度なチャンネル(社内広報・マーケティング等)から段階的に展開し、評価してから拡大する
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={`${styles.callout} ${styles.calloutWarn}`}>
              なお、旧「Claude in Slack」アプリは<strong>2026年8月3日</strong>に自動的にClaude
              Tagへ移行される予定であるため、既存導入企業はそれまでに設定内容(権限・チャンネル・利用ポリシー)を確認しておくことが推奨されます。
            </div>
          </section>

          {/* 13 */}
          <section id="vs-other-products" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>13</span> 他製品との比較
            </h2>
            <div className={styles.prose}>
              <p>
                Claude
                Tagは「Slackネイティブのチーム協働エージェント」という立ち位置で語られることが多く、Microsoft
                365 Copilot(強みは配布力・Identity・コンプライアンスの統合)やChatGPT Workspace
                Agents(OpenAIのクラウド上で動くチーム中心の自動化)との比較がしばしば話題になります。
              </p>
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>Claude Tag</th>
                    <th>ChatGPT Workspace Agents</th>
                    <th>Microsoft 365 Copilot</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>主戦場</td>
                    <td>Slack</td>
                    <td>主にOpenAIのクラウド上のワークスペース</td>
                    <td>Microsoft 365全体(Teams・Office・SharePoint等)</td>
                  </tr>
                  <tr>
                    <td>権限設定の粒度</td>
                    <td>チャンネル単位でIdentity・接続先を細かく設定</td>
                    <td>ワークスペース中心の設定</td>
                    <td>Microsoft 365のID基盤・コンプライアンス機能と統合</td>
                  </tr>
                  <tr>
                    <td>強み</td>
                    <td>共有チャンネルでのマルチプレイヤー協働、コード関連タスクとの親和性</td>
                    <td>チーム中心の自動化ワークフロー</td>
                    <td>配布力・Microsoftエコシステムとの深い統合</td>
                  </tr>
                  <tr>
                    <td>監査・ガバナンス</td>
                    <td>Slack内監査ログ+接続先ごとの許可リスト</td>
                    <td>Compliance APIによるワークスペース単位の監査</td>
                    <td>Microsoft 365のコンプライアンス基盤</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.prose}>
              <p>
                複数のAIエージェント基盤を横断して統一的なガバナンス(ロールベースアクセス制御・ポリシー適用・監査ログの一元化)が必要になる場合は、MCP対応の第三者ガバナンスレイヤーを組み合わせて運用するアプローチも紹介されています。
              </p>
            </div>
          </section>

          {/* 14 */}
          <section id="checklist" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>14</span> 導入前チェックリスト
            </h2>
            <ul className={styles.checklist}>
              <li>
                <input
                  type="checkbox"
                  id="checklist-1"
                  disabled
                  className={styles.checklistCheckbox}
                />
                <label htmlFor="checklist-1">
                  対象プランがClaude TeamまたはEnterpriseであることを確認した
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="checklist-2"
                  disabled
                  className={styles.checklistCheckbox}
                />
                <label htmlFor="checklist-2">
                  Primary OwnerまたはOwner権限を持つ担当者がセットアップを行う体制になっている
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="checklist-3"
                  disabled
                  className={styles.checklistCheckbox}
                />
                <label htmlFor="checklist-3">
                  最初に接続するチャンネルとツールの範囲を「低感度な範囲」から決めた
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="checklist-4"
                  disabled
                  className={styles.checklistCheckbox}
                />
                <label htmlFor="checklist-4">
                  組織全体および主要チャンネルの支出上限を設定した
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="checklist-5"
                  disabled
                  className={styles.checklistCheckbox}
                />
                <label htmlFor="checklist-5">監査ログの確認担当者・確認頻度を決めた</label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="checklist-6"
                  disabled
                  className={styles.checklistCheckbox}
                />
                <label htmlFor="checklist-6">
                  各チャンネルの応答ポリシー(メンション時のみ/プロアクティブ)を用途に応じて設定した
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="checklist-7"
                  disabled
                  className={styles.checklistCheckbox}
                />
                <label htmlFor="checklist-7">
                  重要なチャンネルには「自己紹介」ピン留めメッセージでペルソナ・応答方針を伝えた
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="checklist-8"
                  disabled
                  className={styles.checklistCheckbox}
                />
                <label htmlFor="checklist-8">
                  レビュー体制(誰が・どの重要度の成果物を・どこまで精査するか)を決めた
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="checklist-9"
                  disabled
                  className={styles.checklistCheckbox}
                />
                <label htmlFor="checklist-9">
                  旧「Claude in Slack」利用企業は、2026年8月3日の自動移行前に設定を棚卸しした
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="checklist-10"
                  disabled
                  className={styles.checklistCheckbox}
                />
                <label htmlFor="checklist-10">
                  機微データを扱うチャンネルについて、データ処理契約・保持設定を確認した
                </label>
              </li>
            </ul>
          </section>

          {/* 15 */}
          <section id="references" className={`${styles.section} chapter`}>
            <h2>
              <span className={styles.num}>15</span> 参考文献・出典
            </h2>

            <h3>公式ドキュメント・公式発信(Anthropic / Claude)</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ソース</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>公式アナウンス「Introducing Claude Tag」</td>
                    <td>
                      <Ext href="https://www.anthropic.com/news/introducing-claude-tag">
                        anthropic.com/news/introducing-claude-tag
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>公式ドキュメント トップ</td>
                    <td>
                      <Ext href="https://claude.com/docs/claude-tag/overview">
                        claude.com/docs/claude-tag/overview
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>How Claude Tag works(アーキテクチャ・メモリ・Identity解説)</td>
                    <td>
                      <Ext href="https://claude.com/docs/claude-tag/concepts/how-it-works">
                        claude.com/docs/claude-tag/concepts/how-it-works
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Security and data handling(セキュリティ・サンドボックス解説)</td>
                    <td>
                      <Ext href="https://claude.com/docs/claude-tag/concepts/security-and-data">
                        claude.com/docs/claude-tag/concepts/security-and-data
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Set up Claude Tag(管理者向けセットアップ手順)</td>
                    <td>
                      <Ext href="https://claude.com/docs/claude-tag/admins/setup-overview">
                        claude.com/docs/claude-tag/admins/setup-overview
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Agent identity: a new access model(Identity/権限モデル解説ブログ)</td>
                    <td>
                      <Ext href="https://claude.com/blog/agent-identity-access-model">
                        claude.com/blog/agent-identity-access-model
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Best practices for using @Claude(公式チュートリアル)</td>
                    <td>
                      <Ext href="https://claude.com/resources/tutorials/best-practices-using-claude-tag">
                        claude.com/resources/tutorials/best-practices-using-claude-tag
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Tasks to try with @Claude(ユースケース集)</td>
                    <td>
                      <Ext href="https://claude.com/resources/tutorials/tasks-to-try-with-claude-tag-in-your-workspace">
                        claude.com/resources/tutorials/tasks-to-try...
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>What is Claude Tag?(ヘルプセンター、プラン・課金・移行日程)</td>
                    <td>
                      <Ext href="https://support.claude.com/en/articles/15594475-what-is-claude-tag">
                        support.claude.com/.../what-is-claude-tag
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>著名な開発者・Anthropic社員によるコミュニティ発信</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>発信者</th>
                    <th>内容</th>
                    <th>ソース</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Andrej Karpathy氏(著名AI研究者、Tesla・OpenAI在籍歴)</td>
                    <td>Claude Tagを「LLMのUI/UXにおける3度目の大きな再設計」と評価</td>
                    <td>
                      <Ext href="https://www.therundown.ai/p/meet-your-new-slack-coworker-claude">
                        therundown.ai記事
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Thariq Shihipar氏(Anthropic Claude Codeチーム)</td>
                    <td>チャンネル導入・個人チャンネル・ピン留めステータス等の実践Tips</td>
                    <td>
                      <Ext href="https://x.com/trq212/status/2069474335656694003">x.com/trq212</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Cat Wu氏(Anthropic プロダクトマネージャー)</td>
                    <td>Agent Identity・権限設計の考え方</td>
                    <td>
                      <Ext href="https://x.com/_catwu/status/2069484330938998993">x.com/_catwu</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>ClaudeDevs(Anthropic公式開発者アカウント)</td>
                    <td>社内利用事例スレッド</td>
                    <td>
                      <Ext href="https://x.com/ClaudeDevs/status/2069468900216234010">
                        x.com/ClaudeDevs
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Jason Zhou氏</td>
                    <td>「ループエンジニアリング」テンプレート</td>
                    <td>
                      <Ext href="https://x.com/jasonzhou1993/status/2069002271216787464">
                        x.com/jasonzhou1993
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Matt Pocock氏(著名TypeScript/AI教育者)</td>
                    <td>
                      委任機会発見用の <code>/loop-me</code> スキル
                    </td>
                    <td>
                      <Ext href="https://x.com/mattpocockuk/status/2069729160600203595">
                        x.com/mattpocockuk
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>議論・分析(コミュニティ・第三者メディア)</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ソース</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Hacker News上の議論(マルチプレイヤー性への評価・懸念点)</td>
                    <td>
                      <Ext href="https://news.ycombinator.com/item?id=48648039">
                        news.ycombinator.com/item?id=48648039
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Sébastien Dubois氏によるまとめノート(コミュニティ発信・懸念点の整理)</td>
                    <td>
                      <Ext href="https://www.dsebastien.net/claude-tag/">
                        dsebastien.net/claude-tag
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>TechCrunch記事</td>
                    <td>
                      <Ext href="https://techcrunch.com/2026/06/23/anthropics-claude-tag-is-learning-your-company-one-slack-message-at-a-time/">
                        techcrunch.com記事
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>DataCamp分析記事(移行スケジュール・監査ログ詳細)</td>
                    <td>
                      <Ext href="https://www.datacamp.com/blog/claude-tag">
                        datacamp.com/blog/claude-tag
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>TechTimesディープダイブ記事(プロアクティブ性・非同期実行の分析)</td>
                    <td>
                      <Ext href="https://www.techtimes.com/articles/319668/20260703/claude-tag-deep-dive-proactive-triggers-async-execution-are-what-make-it-agent-not-chatbot.htm">
                        techtimes.com記事
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className={styles.pageFooter}>
            本ガイドはパブリックベータ時点の情報に基づいています。仕様は今後変更される可能性があるため、実装前には必ず公式ドキュメントの最新版をご確認ください。
          </div>
        </main>
      </div>
    </>
  );
}
