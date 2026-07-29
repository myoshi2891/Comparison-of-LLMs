import type { Metadata } from "next";
import type { ReactNode } from "react";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

const DIAG_LIFECYCLE = `flowchart TB
A["1. 依頼内容を分析し計画を立てる"] --> B["2. 必要に応じて複数のサブタスクに分解する"]
B --> C["3. Anthropicサーバー上の隔離環境でコードやコマンドを実行する"]
C --> D["4. 複数のサブエージェントが並行して作業する"]
D --> E["5. 完成した成果物をセッションに納品し、プレビュー・ダウンロードできるようにする"]`;

const DIAG_DECISION = `flowchart TB
Start["やりたいことは?"] --> Q1{"数回のやり取りで完結する<br>質問・相談・壁打ちか?"}
Q1 -->|"はい"| Chat["Chat を使う"]
Q1 -->|"いいえ"| Q2{"作業対象はコードやリポジトリか?"}
Q2 -->|"はい"| Code["Claude Code を使う"]
Q2 -->|"いいえ"| Q3{"複数ファイルや複数アプリ<br>を扱い成果物を作る作業か?"}
Q3 -->|"はい"| Cowork["Claude Cowork を使う"]
Q3 -->|"いいえ"| Chat`;

const DIAG_CONTEXT = `flowchart TB
subgraph L1["Global Instructions（全セッション共通）"]
    G["トーン・出力形式・役割など、普遍的なルール"]
end
subgraph L2["Folder Instructions（フォルダ単位）"]
    F["クライアント名・専門用語・成果物フォーマットなど"]
end
subgraph L3["プロンプト（タスク単位）"]
    P["今回だけ伝える具体的な指示"]
end
L1 --> L2 --> L3`;

const DIAG_SETUP = `flowchart TB
S1["Step1: Coworkタブを開く"] --> S2["Step2: 作業対象を渡す（フォルダ・ファイル・コネクタ）"]
S2 --> S3["Step3: 欲しい成果物とゴールを伝える"]
S3 --> S4["Step4: 事前に確認したいことを質問させる"]
S4 --> S5["Step5: 計画を確認してから実行を許可する"]
S5 --> S6["Step6: 成果物を確認し、必要ならフィードバックする"]`;

const DIAG_PERMISSION = `flowchart TB
Task["Claudeが実行しようとするアクション"] --> Mode{"権限モードは?"}
Mode -->|"Manual"| M1["毎回ユーザーが許可か拒否かを選択する"]
Mode -->|"Auto"| M2["Claudeが安全性を自動レビューする"]
Mode -->|"Skip"| M3["確認なしで即座に実行する"]
M1 ~~~ M2 ~~~ M3
M2 --> Check{"安全性チェックの結果は?"}
Check -->|"安全"| Run["そのまま実行する"]
Check -->|"危険と判定"| Block["ブロックして別の手段を探すか、ユーザーに確認する"]`;

const DIAG_PLUGIN = `flowchart TB
Plugin["Plugin（役割ごとのパッケージ）"]
Plugin --> Skills["Skills：作業手順を定義したファイル"]
Plugin --> Connectors["Connectors：外部サービスへの接続設定"]
Plugin --> Commands["Slash Commands：手動実行のショートカット"]
Plugin --> Agents["Sub-agents：専門特化した補助エージェント"]
Skills ~~~ Connectors ~~~ Commands ~~~ Agents`;

const DIAG_DISPATCH = `flowchart TB
Phone["Claude モバイルアプリ"] -->|"タスクを送信する"| Desktop["Claude Desktop app"]
Desktop -->|"ローカルファイル・コネクタ・スキルを使って実行する"| Work["PC上での作業実行"]
Work -->|"結果を同期する"| Phone`;

const DIAG_INJECTION = `flowchart TB
ExtLink["信頼境界の外の情報（メール・Webページ・共有ドキュメントなど）"] --> Read["Claudeが読み取る"]
Read --> Classifier["コンテンツ分類器が不審な指示を検知しフラグを付ける"]
Classifier --> Agent["Claudeは元のユーザーの依頼に立ち返って判断する"]
Agent --> Action{"書き込み系のアクションか?"}
Action -->|"はい"| Perm["権限モードに応じて確認または自動レビューする"]
Action -->|"いいえ（読み取りのみ）"| Continue["そのまま作業を継続する"]`;

function Ext({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export const metadata: Metadata = {
  title: "Claude Cowork 実践ガイド｜初心者のためのステップバイステップ・ベストプラクティス",
  description:
    "Anthropic公式ドキュメント・公式ブログとパワーユーザーの知見をもとに、Claude Coworkの基本概念からセットアップ、安全運用、Scheduled Tasks、Dispatch、10の自衛対策まで完全解説。",
};

export default function Page() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <div className={styles.layoutContainer}>
        <nav className={styles.sidebar} id="sidebar" aria-label="目次ナビゲーション">
          <div className={styles.brand}>
            <div className={styles.brandBadge}>CC</div>
            <div>
              <div className={styles.brandName}>Claude Cowork</div>
              <div className={styles.brandSub}>実践ガイド</div>
            </div>
          </div>

          <div className={styles.navTitle}>目次</div>
          <ul className={styles.navList} id="nav-list">
            <li>
              <a href="#step0">
                <span className={styles.dot} />
                Step0：Coworkとは何か
              </a>
            </li>
            <li>
              <a href="#step1">
                <span className={styles.dot} />
                Step1：使い分け
              </a>
            </li>
            <li>
              <a href="#step2">
                <span className={styles.dot} />
                Step2：環境を準備する
              </a>
            </li>
            <li>
              <a href="#step3">
                <span className={styles.dot} />
                Step3：フォルダとInstructions
              </a>
            </li>
            <li>
              <a href="#step4">
                <span className={styles.dot} />
                Step4：最初のタスク
              </a>
            </li>
            <li>
              <a href="#step5">
                <span className={styles.dot} />
                Step5：権限モード
              </a>
            </li>
            <li>
              <a href="#step6">
                <span className={styles.dot} />
                Step6：Plugins
              </a>
            </li>
            <li>
              <a href="#step7">
                <span className={styles.dot} />
                Step7：Scheduled Tasks
              </a>
            </li>
            <li>
              <a href="#step8">
                <span className={styles.dot} />
                Step8：Dispatch
              </a>
            </li>
            <li>
              <a href="#step9">
                <span className={styles.dot} />
                Step9：安全運用の原則
              </a>
            </li>
            <li>
              <a href="#step10">
                <span className={styles.dot} />
                Step10：コミュニティの知見
              </a>
            </li>
            <li>
              <a href="#step11">
                <span className={styles.dot} />
                Step11：落とし穴と対処
              </a>
            </li>
            <li>
              <a href="#checklist">
                <span className={styles.dot} />
                納品前チェックリスト
              </a>
            </li>
            <li>
              <a href="#references">
                <span className={styles.dot} />
                参考文献・出典
              </a>
            </li>
          </ul>
        </nav>

        <main className={styles.main}>
          <header className={styles.hero}>
            <div className={styles.eyebrow}>BETA FEATURE GUIDE · 2026.07.26 時点</div>
            <h1>
              Claude Cowork 実践ガイド
              <br />
              初心者のためのステップバイステップ・ベストプラクティス
            </h1>
            <p className={styles.lead}>
              Anthropic公式ドキュメント・公式ブログと、著名なパワーユーザーの発信をもとに、Claude
              Coworkの基本概念からセットアップ、安全な運用、応用までを順を追って解説します。
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.metaChip}>最終更新：2026年7月26日</span>
              <span className={styles.metaChip}>対象：初めてClaude Coworkに触れる方</span>
              <span className={styles.metaChip}>形式：全12ステップ + チェックリスト</span>
            </div>
          </header>

          {/* ================= STEP 0 ================= */}
          <section className={styles.section} id="step0">
            <h2>
              <span className={styles.stepNo}>STEP 0</span>Claude Coworkとは何か
            </h2>
            <p>
              Claude Coworkは、Claude
              Codeが持つ「自律的にタスクをこなすエージェント機能」を、ターミナルを使わずに非エンジニアの知識労働（書類作成、リサーチ、データ整理など）向けに開放したものです。ユーザーは「欲しい結果」を説明してその場を離れ、後から完成した成果物（整形済みドキュメント、整理されたファイル、まとめられたリサーチなど）を受け取る、という使い方をします。
            </p>
            <p>
              Coworkのセッションは基本的にAnthropicのサーバー上でリモート実行されるため、作業内容やファイルはユーザーのClaudeアカウントに紐づき、デスクトップ・Web・モバイルのどこからでも続きを確認できます。Chat（通常の会話）とCoworkは同じメッセージ入力欄を共有しており、入力欄で「Cowork」を選ぶだけで切り替えられます。
            </p>

            <h3>Coworkが1つのタスクをこなす流れ</h3>
            <p className={styles.muted}>
              Claudeはタスクを受け取ると、次のような5段階で作業を進めます。
            </p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAG_LIFECYCLE} />
            </div>

            <h3>主な提供環境</h3>
            <p>
              Claude Coworkは有料プラン（Pro / Max / Team /
              Enterprise）で利用でき、macOS・Windows向けのClaude
              Desktopアプリのほか、Web版・モバイル版でもベータ提供が始まっています（Web・モバイルはMaxプランから段階的に展開中）。ローカルファイルへの直接アクセス、ブラウザ操作、コンピュータ操作（computer
              use）を行うには、Claude Desktopアプリを起動しておく必要があります。
            </p>
          </section>

          {/* ================= STEP 1 ================= */}
          <section className={styles.section} id="step1">
            <h2>
              <span className={styles.stepNo}>STEP 1</span>Chat・Cowork・Claude Codeを使い分ける
            </h2>
            <p>
              Anthropicのグロースマーケティング担当者Austin
              Lau氏が公式ブログで示した整理によれば、3つのワークスペースは次のように使い分けるのが基本です。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ワークスペース</th>
                    <th>向いている場面</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Chat</td>
                    <td>数回のやり取りで完結する質問、壁打ち、ブレインストーミング</td>
                  </tr>
                  <tr>
                    <td>Claude Cowork</td>
                    <td>
                      複数ファイル・複数アプリにまたがる作業で、最終的に「誰かに渡す成果物」ができる仕事
                    </td>
                  </tr>
                  <tr>
                    <td>Claude Code</td>
                    <td>ソフトウェア開発。コードやリポジトリが仕事の対象になる場合</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className={styles.muted}>
              同ブログで紹介されている、判断に迷う具体例です（要約・翻訳）。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>依頼の例</th>
                    <th>適した使い方</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>次のビジネスレビューで何を話すべきか</td>
                    <td>Chat</td>
                  </tr>
                  <tr>
                    <td>
                      Google Driveの直近3か月分の議事録を読み、社内テンプレートでQBR資料を作って
                    </td>
                    <td>Cowork</td>
                  </tr>
                  <tr>
                    <td>VLOOKUPの使い方を教えて</td>
                    <td>Chat</td>
                  </tr>
                  <tr>
                    <td>このスプレッドシート群のVLOOKUPを全部INDEX/MATCHに置き換えて</td>
                    <td>Cowork</td>
                  </tr>
                  <tr>
                    <td>このページのタイトルタグ案を1つ考えて</td>
                    <td>Chat</td>
                  </tr>
                  <tr>
                    <td>シートにある30ページ分のタイトルタグをCMSコネクタ経由で一括更新して</td>
                    <td>Cowork</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>判断フロー</h3>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAG_DECISION} />
            </div>

            <h3>Cowork向きタスクの「5つの材料」</h3>
            <p className={styles.muted}>
              すべてを満たす必要はありませんが、当てはまる項目が多いほどCowork向きです。
            </p>
            <ul className={styles.checklist}>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>
                    <strong>入力が複数ある</strong>
                    ：複数ファイル、フォルダ全体、あるいはファイル＋コネクタの組み合わせ
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>
                    <strong>出力がファイルになる</strong>
                    ：共有・添付・再利用できるドキュメント、資料、スプレッドシートなど
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>
                    <strong>繰り返し発生する</strong>
                    ：一回きりでも構わないが、定期的に発生する作業ほど向いている
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>
                    <strong>「良い出来」の基準を自分が知っている</strong>
                    ：出来上がりを見て良し悪しを15秒で判断できる
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>
                    <strong>「中間部分」が単調である</strong>
                    ：考える部分（最初と最後）以外の抽出・突合・整形が中心
                  </span>
                </label>
              </li>
            </ul>
          </section>

          {/* ================= STEP 2 ================= */}
          <section className={styles.section} id="step2">
            <h2>
              <span className={styles.stepNo}>STEP 2</span>利用環境を準備する
            </h2>
            <p>Coworkを使い始めるための前提条件は次のとおりです。</p>
            <ul className={styles.plain}>
              <li>
                <strong>有料のClaudeプラン</strong>（Pro / Max / Team / Enterprise のいずれか）
              </li>
              <li>
                <strong>ローカルファイルアクセス・ブラウザ操作・コンピュータ操作を使うには</strong>
                ：macOSまたはWindows向けのClaude Desktopアプリを起動し、接続しておくこと
              </li>
              <li>
                <strong>安定したインターネット接続</strong>（セッション中は常時必要）
              </li>
            </ul>

            <h3>始め方</h3>
            <ol className={styles.plain}>
              <li>
                Web版（claude.ai）、Claude Desktopアプリ、またはClaude
                モバイルアプリのいずれかでClaudeを開く
              </li>
              <li>メッセージ入力欄で「Cowork」を選択する</li>
              <li>やってほしいタスクを説明する</li>
              <li>Claudeが示す進め方（プラン）を確認し、実行させる</li>
            </ol>

            <div className={styles.callout}>
              <div className={styles.calloutTitle}>POINT</div>
              <p>
                デスクトップアプリを閉じたりPCがスリープしても、リモートセッション自体は継続して動作します。ただし、ローカルファイル・ブラウザ・PC操作を使うタスクでは、Claude
                Desktopアプリを開いたままにしておく必要があります。
              </p>
            </div>
          </section>

          {/* ================= STEP 3 ================= */}
          <section className={styles.section} id="step3">
            <h2>
              <span className={styles.stepNo}>STEP 3</span>作業フォルダとGlobal / Folder
              Instructionsを設定する
            </h2>
            <p>
              多くの実践者が口をそろえるポイントは、「良い出力とそうでない出力の差は、プロンプトの巧さではなく、事前にどれだけ豊かな文脈（コンテキスト）を渡せているかで決まる」という点です。Coworkはこの文脈を2つのレイヤーで永続的に扱えます。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAG_CONTEXT} />
            </div>

            <h3>Global Instructions（全セッション共通の指示）</h3>
            <p>
              すべてのCoworkセッションに適用される「常設の指示」です。好みのトーン、出力フォーマット、自分の役割の背景などをここに記載しておきます。
            </p>
            <ol className={styles.plain}>
              <li>
                <code>Settings &gt; Cowork</code> を開く
              </li>
              <li>「Global instructions」の横にある「Edit」をクリック</li>
              <li>指示文を入力し「Save」をクリック</li>
            </ol>

            <h3>Folder Instructions（フォルダ単位の指示）</h3>
            <p>
              デスクトップ版でローカルフォルダを選択した際に、そのフォルダ固有の文脈を追加できる仕組みです。Claudeがセッション中に自動で更新することもあります。クライアント名や専門用語、成果物フォーマットなど、「そのフォルダの中でだけ」有効にしたいルールを書く場所です。
            </p>

            <h3>作業フォルダの設計例</h3>
            <p>
              Coworkは指定したフォルダの中だけを読み書きできるため、専用フォルダを1つ用意し、その中に用途別のサブフォルダを作る運用が複数の実践者から共有されています。著名なAI活用発信者のRuben
              Hassid氏は、マスターフォルダの下に「About
              me」「Project」「Template」「Outputs」という4つのサブフォルダを作り、そこにCoworkを向ける運用を紹介しています。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>サブフォルダ例</th>
                    <th>役割</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>About me</td>
                    <td>自分の役割、書き方の癖、避けたい表現などをまとめたファイル</td>
                  </tr>
                  <tr>
                    <td>Project</td>
                    <td>進行中の案件に関する資料</td>
                  </tr>
                  <tr>
                    <td>Template</td>
                    <td>過去のベストな成果物（Claudeに再利用させる型）</td>
                  </tr>
                  <tr>
                    <td>Outputs</td>
                    <td>Claudeが生成した成果物の置き場</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className={styles.muted}>
              低リスクなテスト用フォルダから始め、重要なファイルの入った本番フォルダにいきなりアクセスさせないことも、複数の実践者が共通して勧めているポイントです。
            </p>
          </section>

          {/* ================= STEP 4 ================= */}
          <section className={styles.section} id="step4">
            <h2>
              <span className={styles.stepNo}>STEP 4</span>最初のタスクを渡す（はじめの10分）
            </h2>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAG_SETUP} />
            </div>

            <p>Austin Lau氏が紹介している「最初の10分」の進め方は次のとおりです。</p>
            <ol className={styles.plain}>
              <li>
                <strong>何か渡す</strong>
                ：ファイルを数点ドロップする、PC上のフォルダを指定する、よく使うアプリ（Slack、Gmail、Notionなど）を接続する
              </li>
              <li>
                <strong>欲しい結果を伝える</strong>
                ：最終的にどんな成果物が欲しいか、必要な文脈とあわせて説明する
              </li>
              <li>
                <strong>自分がよく知っているタスクから始める</strong>
                ：出来上がりの「良し悪し」を自分で判断できる仕事を選ぶ
              </li>
              <li>
                <strong>事前に質問させる</strong>
                ：プロンプトに一文を添えるだけで精度が大きく変わります。
              </li>
            </ol>

            <div className={styles.quoteExample}>
              「始める前に、私の依頼内容を要約して認識合わせをし、思いつく限りの確認事項を質問してください」
            </div>
            <p className={styles.muted}>
              これにより、期間の範囲や「良い」の基準、Claudeが気づけないエッジケースなど、言い忘れがちな前提が事前に洗い出されます。
            </p>
          </section>

          {/* ================= STEP 5 ================= */}
          <section className={styles.section} id="step5">
            <h2>
              <span className={styles.stepNo}>STEP 5</span>権限モードを選び、安全に運用する
            </h2>
            <p>
              Coworkには、Claudeが行動する前にどこまで確認を求めるかを制御する3つのモードがあります。チャット入力欄のモード切り替えからいつでも変更できます。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>モード</th>
                    <th>概要</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      Manually approve
                      <br />
                      <span style={{ color: "var(--text-faint)", fontSize: "14px" }}>
                        （旧称 Ask before acting）
                      </span>
                    </td>
                    <td>
                      Claudeは行動の一つひとつで一時停止し、許可を求めます。依頼ごとに「許可」か「拒否」を選びます
                    </td>
                  </tr>
                  <tr>
                    <td>Automatically approve</td>
                    <td>
                      Claudeは止まらずに作業を続けますが、各行動を安全性の観点で自動レビューし、危険と判定したものは自動的にブロックします。ブロックされた場合はより安全な代替手段を探すか、直接ユーザーに確認します
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Skip all approvals
                      <br />
                      <span style={{ color: "var(--text-faint)", fontSize: "14px" }}>
                        （旧称 Act without asking）
                      </span>
                    </td>
                    <td>
                      確認も自動チェックも行わず即座に実行します。関わるすべてのファイル・接続先・アプリを完全に信頼できる場合のみ使用が推奨されています
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className={styles.muted}>
              Auto
              モードは、外部からのデータ持ち出し（データ流出）やプロンプトインジェクションのチェックを内部的に行うぶん、他のモードより使用量（usage）を多く消費します。また、どのモードであっても、ファイルの完全削除だけは必ず明示的な許可が求められます。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAG_PERMISSION} />
            </div>

            <div className={styles.callout}>
              <div className={styles.calloutTitle}>補足：Autoモードの背景</div>
              <p>
                Anthropicのエンジニアリングブログによれば、Claude
                Codeにおける許可プロンプトのうち93%はそのまま承認されているという分析結果が、Autoモード導入の背景にあります。安全性は保ちながら「承認疲れ」を減らすことが狙いです。
              </p>
            </div>

            <h3>いつ「Manual」に戻すべきか</h3>
            <p>
              次のような場面では、速度よりも確認を優先し「Manually
              approve」に切り替えることが推奨されています。
            </p>
            <ul className={styles.plain}>
              <li>機密性の高いファイル・アカウント・サイトを扱うとき</li>
              <li>初めて使うツール・プラグイン・サイトを扱うとき</li>
              <li>メッセージ送信や購入など、取り消しが難しい行動を伴うとき</li>
            </ul>
          </section>

          {/* ================= STEP 6 ================= */}
          <section className={styles.section} id="step6">
            <h2>
              <span className={styles.stepNo}>STEP 6</span>
              Plugins・Skills・Connectors・Sub-agentsで専門特化する
            </h2>
            <p>
              Pluginsは、自分の役割・チーム・会社に合わせてClaudeの働き方をカスタマイズする単位です。1つのPluginは、Skills（作業手順）、Connectors（外部サービス接続）、Slash
              Commands（手動実行のショートカット）、Sub-agents（補助エージェント）をひとまとめにパッケージ化したものです。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAG_PLUGIN} />
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>構成要素</th>
                    <th>役割</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Skills</td>
                    <td>
                      Claudeが実行前に読み込む「このタスクの最善のやり方」を定義したファイル群
                    </td>
                  </tr>
                  <tr>
                    <td>Connectors</td>
                    <td>Gmail、Slack、Notion、Salesforceなど外部サービスとの接続設定</td>
                  </tr>
                  <tr>
                    <td>Slash Commands</td>
                    <td>
                      <code>/plugin:send-updates</code> のように、手動で呼び出す定型アクション
                    </td>
                  </tr>
                  <tr>
                    <td>Sub-agents</td>
                    <td>複雑な作業を分担して並行実行する、特定領域に特化した補助エージェント</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Anthropicは2026年1月30日、営業・財務・法務・マーケティング・人事・エンジニアリング・デザイン・オペレーションなど、社内で使っている11種類のPluginをオープンソースとして公開しました。Plugin導入時は「そのPluginがどこまでの権限（読み取り／書き込み）を要求するか」を必ず確認することが、公式の安全ガイドでも強調されています。
            </p>
          </section>

          {/* ================= STEP 7 ================= */}
          <section className={styles.section} id="step7">
            <h2>
              <span className={styles.stepNo}>STEP 7</span>定型業務をScheduled Tasksで自動化する
            </h2>
            <p>
              繰り返し発生するタスクは、<code>/schedule</code>
              コマンドをタスク内で入力するか、左サイドバーの「Scheduled」から作成・管理できます。スケジュールされたタスクはリモートで実行されるため、PCがスリープしていたりデスクトップアプリを開いていなくても動作します。
            </p>

            <p className={styles.muted}>
              スケジュールタスクは目を離していても動く分、次のような慎重な運用が推奨されています。
            </p>
            <ul className={styles.plain}>
              <li>
                <strong>まずは低リスクな作業から始める</strong>
                ：要約作成や情報収集など、影響範囲の小さいものから
              </li>
              <li>
                <strong>機密データや重大な操作を避ける</strong>
                ：機密ファイルへのアクセス、メッセージ送信、購入など取り消しにくい操作は自動化しない
              </li>
              <li>
                <strong>実行結果を毎回確認する</strong>
                ：「Scheduled」ページから過去の実行結果を定期的にチェックする
              </li>
              <li>
                <strong>使わないタスクは一時停止・削除する</strong>：放置せず、不要になったら止める
              </li>
            </ul>
          </section>

          {/* ================= STEP 8 ================= */}
          <section className={styles.section} id="step8">
            <h2>
              <span className={styles.stepNo}>STEP 8</span>Dispatchでどこからでも指示する
            </h2>
            <p>
              Dispatchは、モバイルアプリとClaude
              Desktopアプリの間に「1つの継続した会話」を作る機能です。イメージとしては、PC上で動いているCoworkセッションに向けたトランシーバーのようなものです。
            </p>

            <div className={`${styles.callout} ${styles.amber}`}>
              <div className={styles.calloutTitle}>重要な違い</div>
              <p>
                Dispatch経由のタスクはPC（デスクトップアプリ）上で実行されるため、リモートのクラウドセッションとは異なり、PCが起動していてClaude
                Desktopアプリが開いている必要があります。
              </p>
            </div>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAG_DISPATCH} />
            </div>

            <h3>セットアップの流れ</h3>
            <ol className={styles.plain}>
              <li>Claude DesktopアプリとClaude モバイルアプリを最新版に更新する</li>
              <li>Cowork内の「Dispatch」セクションからメッセージを送り始める</li>
              <li>以後、デスクトップとモバイルの会話が自動的に同期される</li>
            </ol>

            <p className={styles.muted}>
              Dispatchは、ファイル検索・メール要約・データベース照会といった「情報取得」系のタスクで特に安定して動作する一方、ブラウザ自動操作やアプリ間の連携アクションはまだ発展途上とされています。実際に使い込んだ複数のレビューでは、こうした操作の成功率が体感で5割程度にとどまるという報告もあります。外出先からPCの作業を進めたいときの「情報収集・下調べ」用途を中心に試すのが現実的です。
            </p>
          </section>

          {/* ================= STEP 9 ================= */}
          <section className={styles.section} id="step9">
            <h2>
              <span className={styles.stepNo}>STEP 9</span>
              プロンプトインジェクションと安全運用の原則を理解する
            </h2>
            <p>
              Coworkはローカルファイル、ブラウザ、外部アプリへのアクセスという強力な能力を持つ分、固有のリスクも伴います。公式の安全ガイドでは、リスクの大きさは「Claudeが何を読めるか」と「Claudeが何をできるか」の組み合わせで決まると説明されています。
            </p>

            <ul className={styles.plain}>
              <li>
                <strong>Read tools（読み取り系）</strong>
                ：メールの受信箱を読む、画面のスクリーンショットを撮る、など
              </li>
              <li>
                <strong>Write tools（書き込み系）</strong>
                ：カレンダー予定を作る、ファイルを削除する、コマンドを実行する、画面をクリックする、など
              </li>
            </ul>
            <p className={styles.muted}>
              Write
              toolsのほうが本質的にリスクが高いため、重要な場面では人による確認が推奨されています。
            </p>

            <h3>プロンプトインジェクションとは</h3>
            <p>
              信頼できる範囲（自分のファイルや会社のコミュニケーションなど、安全だと考えている情報源）の外側にある情報をClaudeが読み取ると、その中に攻撃者が仕込んだ不正な指示が紛れている可能性があります。これがプロンプトインジェクションです。例えば、メール要約を頼んだ際に、正規のメールに紛れて不正な送金や情報漏えいを促す一文が含まれているケースが想定されます。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAG_INJECTION} />
            </div>

            <h3>自分の身を守るための10のポイント</h3>
            <p className={styles.muted}>
              公式の安全ガイド「Use Claude Cowork safely」がまとめている実践です。
            </p>
            <div className={styles.pointsGrid}>
              <div className={styles.pointCard}>
                <div className={styles.pointNum}>01</div>
                <div className={styles.pointBody}>
                  <strong>ファイルアクセスは選択的に</strong>
                  <span>
                    財務書類や認証情報など機微な情報へのアクセスは避け、専用の作業フォルダを用意しバックアップを取る
                  </span>
                </div>
              </div>
              <div className={styles.pointCard}>
                <div className={styles.pointNum}>02</div>
                <div className={styles.pointBody}>
                  <strong>個々のコマンドではなく「タスク全体」を監視する</strong>
                  <span>
                    想定外のファイルやサイトにアクセスしていないか、作業範囲が広がっていないかを見る
                  </span>
                </div>
              </div>
              <div className={styles.pointCard}>
                <div className={styles.pointNum}>03</div>
                <div className={styles.pointBody}>
                  <strong>スケジュールタスクは慎重に</strong>
                  <span>
                    低リスクな作業から始め、機密データや不可逆な操作は避け、結果を定期的に確認する
                  </span>
                </div>
              </div>
              <div className={styles.pointCard}>
                <div className={styles.pointNum}>04</div>
                <div className={styles.pointBody}>
                  <strong>リスクの大きさに応じて監視レベルを変える</strong>
                  <span>金銭・送信・重要ファイルが絡む場面では「Manually approve」に戻す</span>
                </div>
              </div>
              <div className={styles.pointCard}>
                <div className={styles.pointNum}>05</div>
                <div className={styles.pointBody}>
                  <strong>コンピュータ操作（computer use）には特に注意する</strong>
                  <span>
                    画面操作にはサンドボックスがないため、医療ポータルや銀行、マッチングアプリなど機微なアプリはブロックしておく
                  </span>
                </div>
              </div>
              <div className={styles.pointCard}>
                <div className={styles.pointNum}>06</div>
                <div className={styles.pointBody}>
                  <strong>ブラウザとWebアクセスは信頼できる範囲に限定する</strong>
                  <span>Web上のコンテンツはプロンプトインジェクションの主要な経路になり得る</span>
                </div>
              </div>
              <div className={styles.pointCard}>
                <div className={styles.pointNum}>07</div>
                <div className={styles.pointBody}>
                  <strong>不慣れなMCP・Pluginには特に注意する</strong>
                  <span>検証済みのディレクトリから入手し、要求される権限を事前に確認する</span>
                </div>
              </div>
              <div className={styles.pointCard}>
                <div className={styles.pointNum}>08</div>
                <div className={styles.pointBody}>
                  <strong>アプリ間のデータ連携を意識する</strong>
                  <span>
                    Claude for ExcelとClaude for
                    PowerPointの併用時など、データが意図せず別アプリへ流れる場合がある
                  </span>
                </div>
              </div>
              <div className={styles.pointCard}>
                <div className={styles.pointNum}>09</div>
                <div className={styles.pointBody}>
                  <strong>リモートセッションが何に到達できるかを理解する</strong>
                  <span>
                    Web・モバイルからのリモートセッションは、Claude
                    Desktopアプリが起動していて接続済みのフォルダにのみ到達できる
                  </span>
                </div>
              </div>
              <div className={styles.pointCard}>
                <div className={styles.pointNum}>10</div>
                <div className={styles.pointBody}>
                  <strong>不審な挙動はすぐに報告する</strong>
                  <span>
                    無関係な話題を始めた、予期しないリソースへのアクセスを試みた、などの兆候があればタスクを止めて報告する
                  </span>
                </div>
              </div>
            </div>
            <p className={styles.muted}>
              Claudeが行った送信・購入・データ変更・スケジュールタスクの結果については、最終的にすべてユーザー自身の責任となる点も明記されています。
            </p>
          </section>

          {/* ================= STEP 10 ================= */}
          <section className={styles.section} id="step10">
            <h2>
              <span className={styles.stepNo}>STEP 10</span>コミュニティのベストプラクティスに学ぶ
            </h2>
            <div className={`${styles.callout} ${styles.amber}`}>
              <div className={styles.calloutTitle}>注目の投稿</div>
              <p>
                Claude
                Coworkのローンチ日（2026年1月12日）から400セッション以上を検証したという発信者Nav
                Toor氏（@heynavtoor）は、「17 Best Practices That Make Claude Cowork 100x More
                Powerful」という投稿で大きな反響を呼びました。この投稿は複数の二次解説やGitHub上のまとめでも取り上げられています。
              </p>
            </div>

            <h3>中心的な主張</h3>
            <div className={styles.principleGrid}>
              <div className={styles.principleCard}>
                <div className={styles.principleTag}>01</div>
                <strong>プロンプトを磨くより、システムを作る</strong>
                <p>
                  ChatGPT世代は「プロンプトエンジニアリング」が報われましたが、CoworkやClaude
                  Codeの世代では「システムエンジニアリング」——事前にどれだけ文脈・構造・制約を用意できたか——が出力の質を決める、という考え方です
                </p>
              </div>
              <div className={styles.principleCard}>
                <div className={styles.principleTag}>02</div>
                <strong>出力が気に入らない時の自己診断</strong>
                <p>
                  Claudeの出力が期待外れだったとき、「これはプロンプトの問題か、それとも文脈（コンテキスト）の問題か」を自問し、多くの場合は文脈側に原因があると捉える考え方です。原因が文脈にあるとわかれば、指示ファイルに一行加えるだけで恒久的に直せます
                </p>
              </div>
              <div className={styles.principleCard}>
                <div className={styles.principleTag}>03</div>
                <strong>コンテキストは資産として蓄積する</strong>
                <p>
                  Global InstructionsやFolder
                  Instructionsに書いたファイルは、時間とともに価値が積み上がっていくため、定期的（例えば週次）に見直して更新することが勧められています
                </p>
              </div>
              <div className={styles.principleCard}>
                <div className={styles.principleTag}>04</div>
                <strong>レイヤーを分けて管理する</strong>
                <p>
                  Global Instructionsは「あらゆる場面に共通する振る舞い」、Folder
                  Instructionsは「そのプロジェクト固有の文脈」、個々のプロンプトは「今回だけのタスク」という役割分担を明確にする考え方です
                </p>
              </div>
            </div>

            <h3>常設の指示ファイルという型</h3>
            <p className={styles.muted}>
              複数の実践者がまとめている「常設の指示ファイル」の型としては、次の3種類が繰り返し紹介されています。
            </p>
            <div className={styles.fileGrid}>
              <div className={styles.fileCard}>
                <div className={styles.fileTag}>identity</div>
                <p>自分が何者で、何に取り組んでいるか</p>
              </div>
              <div className={styles.fileCard}>
                <div className={styles.fileTag}>voice</div>
                <p>自分の文体・トーン・使ってほしくない言い回し</p>
              </div>
              <div className={styles.fileCard}>
                <div className={styles.fileTag}>rules</div>
                <p>「まず尋ねる」「計画を見せる」「承認なしに削除しない」といった行動規範</p>
              </div>
            </div>
            <p>
              これらをGlobal
              Instructionsに読み込ませておくことで、モデルを切り替えるよりも大きな出力品質の改善につながる、という指摘もあります。あわせて、Global
              Instructionsの分量そのものが増えるほどCoworkが保持すべき前提も増えるため、役割固有・プロジェクト固有のルールはFolder
              Instructions側に逃がし、Global
              Instructionsは要点だけに絞るという運用も共有されています。
            </p>
          </section>

          {/* ================= STEP 11 ================= */}
          <section className={styles.section} id="step11">
            <h2>
              <span className={styles.stepNo}>STEP 11</span>よくある落とし穴とトラブルシューティング
            </h2>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>症状</th>
                    <th>主な原因と対処</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>セッションが進むにつれ出力の質が落ちる</td>
                    <td>
                      コンテキストウィンドウが埋まってきているサイン。新しいセッションに切り替えるほうが、同じセッションを続けるより良い結果になりやすい
                    </td>
                  </tr>
                  <tr>
                    <td>Coworkでの記憶が引き継がれない</td>
                    <td>
                      Chatでの記憶は現時点でCoworkセッションに引き継がれません。Cowork内で記憶が使えるのはProjects機能を使った場合のみです
                    </td>
                  </tr>
                  <tr>
                    <td>使用量（usage）の上限にすぐ達する</td>
                    <td>
                      Coworkは通常のChatより使用量を多く消費します。関連作業をまとめて1セッションで行う、単純な作業はChatに戻す、などの対策が案内されています
                    </td>
                  </tr>
                  <tr>
                    <td>期待した場所にファイルが出力されない</td>
                    <td>
                      付与したファイルアクセス権限を確認し、Claudeが完了時に示した出力先を再確認する
                    </td>
                  </tr>
                  <tr>
                    <td>タスクが途中で止まった</td>
                    <td>
                      ローカルセッションではDesktopアプリが常に開いていたか、PCがスリープしなかったかを確認する。リモートセッションはバックグラウンドで継続しているため、別の画面からセッションを開いて進捗を確認する
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ================= CHECKLIST ================= */}
          <section className={styles.section} id="checklist">
            <h2>納品前チェックリスト</h2>
            <p className={styles.muted}>
              Coworkにタスクを渡す前後で、以下を確認する運用がおすすめです。
            </p>
            <ul className={styles.checklist}>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>
                    タスクは「Chatで済む質問」ではなく、本当に複数ファイル／複数アプリにまたがる成果物作成か
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>
                    Global Instructionsに、トーン・役割・出力形式などの普遍的なルールを設定済みか
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>
                    対象フォルダにFolder
                    Instructions（クライアント名・専門用語・フォーマット）を設定したか
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>初回のタスクでは、実行前にClaudeへ確認質問をさせたか</span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>機密情報を含むファイルやアプリを、必要以上にアクセス許可していないか</span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>
                    金銭・送信・削除など不可逆な操作を伴うタスクは「Manually
                    approve」で運用しているか
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>
                    スケジュールタスクは低リスクな内容から始め、定期的に実行結果を確認しているか
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>導入するPlugin・MCPの権限範囲を事前に確認したか</span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" disabled />
                  <span>
                    不審な挙動（無関係な話題、想定外のアクセス）がないか、作業中も目を配っているか
                  </span>
                </label>
              </li>
            </ul>
          </section>

          {/* ================= REFERENCES ================= */}
          <section className={styles.footer} id="references">
            <h2 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "8px" }}>
              参考文献・出典
            </h2>
            <p className={styles.muted}>
              本記事は以下の一次情報・著名な開発者やパワーユーザーの発信を根拠に作成しました。すべて2026年7月26日時点でアクセス可能であることを確認しています。
            </p>

            <div className={styles.refGroupTitle}>Anthropic公式</div>
            <div className={styles.refGrid}>
              <Ext
                className={styles.refCard}
                href="https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork"
              >
                <span className={styles.refBadge}>公式</span>
                <span className={styles.refBody}>
                  <strong>Get started with Claude Cowork</strong>
                  <span className={styles.refSource}>
                    Claude Help Center ・
                    support.claude.com/en/articles/13345190-get-started-with-claude-cowork
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://support.claude.com/en/articles/13364135-use-claude-cowork-safely"
              >
                <span className={styles.refBadge}>公式</span>
                <span className={styles.refBody}>
                  <strong>Use Claude Cowork safely</strong>
                  <span className={styles.refSource}>
                    Claude Help Center ・
                    support.claude.com/en/articles/13364135-use-claude-cowork-safely
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://claude.com/blog/best-practices-for-getting-started-with-claude-cowork"
              >
                <span className={styles.refBadge}>公式</span>
                <span className={styles.refBody}>
                  <strong>Best practices for getting started with Claude Cowork</strong>
                  <span className={styles.refSource}>
                    Austin Lau（Anthropic Growth Team）・ Claude Blog ・
                    claude.com/blog/best-practices-for-getting-started-with-claude-cowork
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://support.claude.com/en/articles/13947068-assign-tasks-from-anywhere-in-claude-cowork"
              >
                <span className={styles.refBadge}>公式</span>
                <span className={styles.refBody}>
                  <strong>Assign tasks from anywhere in Claude Cowork</strong>
                  <span className={styles.refSource}>
                    Claude Help Center ・
                    support.claude.com/en/articles/13947068-assign-tasks-from-anywhere-in-claude-cowork
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://www.anthropic.com/engineering/claude-code-auto-mode"
              >
                <span className={styles.refBadge}>公式</span>
                <span className={styles.refBody}>
                  <strong>
                    How we built Claude Code auto mode: a safer way to skip permissions
                  </strong>
                  <span className={styles.refSource}>
                    Anthropic Engineering ・ anthropic.com/engineering/claude-code-auto-mode
                  </span>
                </span>
              </Ext>
              <Ext className={styles.refCard} href="https://anthropic.com/news/claude-code-plugins">
                <span className={styles.refBadge}>公式</span>
                <span className={styles.refBody}>
                  <strong>Customize Claude Code with plugins</strong>
                  <span className={styles.refSource}>
                    Anthropic News ・ anthropic.com/news/claude-code-plugins
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://www.techcrunch.com/2026/01/30/anthropic-brings-agentic-plugins-to-cowork/"
              >
                <span className={styles.refBadge}>公式</span>
                <span className={styles.refBody}>
                  <strong>Anthropic brings agentic plug-ins to Cowork</strong>
                  <span className={styles.refSource}>
                    TechCrunch（Anthropicの発表を報道）・
                    techcrunch.com/2026/01/30/anthropic-brings-agentic-plugins-to-cowork
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://support.claude.com/en/articles/12902446-claude-in-chrome-permissions-guide"
              >
                <span className={styles.refBadge}>公式</span>
                <span className={styles.refBody}>
                  <strong>Claude in Chrome permissions guide</strong>
                  <span className={styles.refSource}>
                    Claude Help Center（権限モードの解説）・
                    support.claude.com/en/articles/12902446-claude-in-chrome-permissions-guide
                  </span>
                </span>
              </Ext>
            </div>

            <div className={styles.refGroupTitle}>著名な開発者・パワーユーザーの発信</div>
            <div className={styles.refGrid}>
              <Ext
                className={styles.refCard}
                href="https://note.com/_kihonushi/n/nd726246d467f?hl=en-US"
              >
                <span className={`${styles.refBadge} ${styles.community}`}>コミュニティ</span>
                <span className={styles.refBody}>
                  <strong>Nav Toor氏の「17 Best Practices」を取り上げた解説記事</strong>
                  <span className={styles.refSource}>
                    KiKi ・ note ・ note.com/_kihonushi/n/nd726246d467f
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://x.com/heynavtoor/status/2028148844891152554"
              >
                <span className={`${styles.refBadge} ${styles.community}`}>コミュニティ</span>
                <span className={styles.refBody}>
                  <strong>17 Best Practices That Make Claude Cowork 100x More Powerful</strong>
                  <span className={styles.refSource}>
                    Nav Toor（@heynavtoor）・ X ・ x.com/heynavtoor/status/2028148844891152554
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://x.com/heynavtoor/status/2026717574776631556"
              >
                <span className={`${styles.refBadge} ${styles.community}`}>コミュニティ</span>
                <span className={styles.refBody}>
                  <strong>Claude Cowork導入ガイドの投稿</strong>
                  <span className={styles.refSource}>
                    Nav Toor（@heynavtoor）・ X ・ x.com/heynavtoor/status/2026717574776631556
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://www.linkedin.com/posts/ruben-hassid_this-is-the-only-claude-cowork-guide-you-activity-7435202560703008792-WQm6"
              >
                <span className={`${styles.refBadge} ${styles.community}`}>コミュニティ</span>
                <span className={styles.refBody}>
                  <strong>This is the only Claude Cowork guide you need</strong>
                  <span className={styles.refSource}>
                    Ruben Hassid ・ LinkedIn ・ linkedin.com/posts/ruben-hassid
                  </span>
                </span>
              </Ext>
              <Ext className={styles.refCard} href="https://ruben.substack.com/p/claude-cowork-20">
                <span className={`${styles.refBadge} ${styles.community}`}>コミュニティ</span>
                <span className={styles.refBody}>
                  <strong>Cowork.</strong>
                  <span className={styles.refSource}>
                    Ruben Hassid ・ How to AI (Substack) ・ ruben.substack.com/p/claude-cowork-20
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://claudecowork.im/blog/customize-panel-guide"
              >
                <span className={`${styles.refBadge} ${styles.community}`}>コミュニティ</span>
                <span className={styles.refBody}>
                  <strong>
                    Claude Cowork Customize: Global Instructions, Folder Rules, and the New Settings
                    Panel
                  </strong>
                  <span className={styles.refSource}>
                    Claude Cowork Blog ・ claudecowork.im/blog/customize-panel-guide
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://github.com/TheCraigHewitt/cowork-starter-pack/blob/main/global-instructions.md"
              >
                <span className={`${styles.refBadge} ${styles.community}`}>コミュニティ</span>
                <span className={styles.refBody}>
                  <strong>cowork-starter-pack（global-instructions.md）</strong>
                  <span className={styles.refSource}>
                    TheCraigHewitt ・ GitHub ・ github.com/TheCraigHewitt/cowork-starter-pack
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://www.the-ai-corner.com/p/claude-best-practices-power-user-guide-2026"
              >
                <span className={`${styles.refBadge} ${styles.community}`}>コミュニティ</span>
                <span className={styles.refBody}>
                  <strong>Claude best practices 2026: the complete power user guide</strong>
                  <span className={styles.refSource}>
                    The AI Corner ・ the-ai-corner.com/p/claude-best-practices-power-user-guide-2026
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://thesignal.substack.com/p/how-to-run-claude-cowork-from-your"
              >
                <span className={`${styles.refBadge} ${styles.community}`}>コミュニティ</span>
                <span className={styles.refBody}>
                  <strong>How to run Claude Cowork from your phone</strong>
                  <span className={styles.refSource}>
                    Alex Banks ・ The Signal (Substack) ・
                    thesignal.substack.com/p/how-to-run-claude-cowork-from-your
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://www.datacamp.com/tutorial/claude-cowork-dispatch"
              >
                <span className={`${styles.refBadge} ${styles.community}`}>コミュニティ</span>
                <span className={styles.refBody}>
                  <strong>Claude Cowork Dispatch 101: Remote Control for Desktop AI</strong>
                  <span className={styles.refSource}>
                    DataCamp ・ datacamp.com/tutorial/claude-cowork-dispatch
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://www.the-ai-corner.com/p/claude-dispatch-guide"
              >
                <span className={`${styles.refBadge} ${styles.community}`}>コミュニティ</span>
                <span className={styles.refBody}>
                  <strong>Claude Dispatch Guide: The AI That Works While You're Away</strong>
                  <span className={styles.refSource}>
                    The AI Corner ・ the-ai-corner.com/p/claude-dispatch-guide
                  </span>
                </span>
              </Ext>
            </div>

            <div className={styles.refGroupTitle}>補足として参照した記事</div>
            <div className={styles.refGrid}>
              <Ext
                className={styles.refCard}
                href="https://github.com/az9713/claude-cowork-best-practices/blob/main/docs/claude_cowork_best_practices_report.md"
              >
                <span className={`${styles.refBadge} ${styles.supplement}`}>補足</span>
                <span className={styles.refBody}>
                  <strong>claude-cowork-best-practices（Nav Toor実践まとめレポート）</strong>
                  <span className={styles.refSource}>
                    az9713 ・ GitHub ・ github.com/az9713/claude-cowork-best-practices
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://claudiaplusai.substack.com/p/claude-cowork-starter-guide-30-examples"
              >
                <span className={`${styles.refBadge} ${styles.supplement}`}>補足</span>
                <span className={styles.refBody}>
                  <strong>Claude Cowork Starter Guide + 30 examples</strong>
                  <span className={styles.refSource}>
                    Claudia + AI (Substack) ・
                    claudiaplusai.substack.com/p/claude-cowork-starter-guide-30-examples
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://tooltechsavvy.com/claude-cowork-how-to-choose-folders-wisely-and-use-instructions-for-consistent-results/"
              >
                <span className={`${styles.refBadge} ${styles.supplement}`}>補足</span>
                <span className={styles.refBody}>
                  <strong>Claude Cowork: Smart Folders & Instructions Guide</strong>
                  <span className={styles.refSource}>
                    ToolTechSavvy ・ tooltechsavvy.com/claude-cowork-how-to-choose-folders-wisely
                  </span>
                </span>
              </Ext>
              <Ext
                className={styles.refCard}
                href="https://fourhourfreedom.substack.com/p/the-claude-cowork-setup-guide-i-wish"
              >
                <span className={`${styles.refBadge} ${styles.supplement}`}>補足</span>
                <span className={styles.refBody}>
                  <strong>The Claude Cowork Setup Guide I Wish I'd Had</strong>
                  <span className={styles.refSource}>
                    Four Hour Freedom (Substack) ・
                    fourhourfreedom.substack.com/p/the-claude-cowork-setup-guide-i-wish
                  </span>
                </span>
              </Ext>
            </div>

            <div className={styles.noteBox}>
              <strong>注記：</strong>Claude
              Coworkはベータ機能であり、権限モードの名称・Dispatchの提供範囲・使用量の計算方法などは今後変更される可能性があります。実運用の前には、必ず
              <Ext href="https://support.claude.com/en/collections/19667525-claude-cowork">
                support.claude.com のClaude Coworkコレクション
              </Ext>
              で最新記事をご確認ください。
            </div>

            <footer className={styles.pageEnd}>
              Claude Cowork 実践ガイド — 2026年7月26日時点の情報にもとづく
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}
