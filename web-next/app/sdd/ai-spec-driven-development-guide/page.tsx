import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import Sidebar from "./Sidebar";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "AI仕様駆動開発（Spec-Driven Development）実践ガイド",
  description:
    "初学者のためのステップバイステップ・ベストプラクティス。GitHub Spec Kit、AWS Kiro、Claude Codeなど2026年最新のSDD手法・ツール・EARS記法を網羅解説。",
};

function ExternalIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <path d="M15 3h6v6"></path>
      <path d="M10 14 21 3"></path>
    </svg>
  );
}

/**
 * Renders a beginner-friendly guide to AI spec-driven development, including its concepts, workflows, tools, best practices, limitations, and references.
 */
export default function SpecDrivenDevelopmentGuidePage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <Sidebar />

      <main className={styles.main}>
        <header className={styles.hero} id="top">
          <p className={styles.kicker}>Beginner-friendly step-by-step guide</p>
          <h1>AI仕様駆動開発（Spec-Driven Development）実践ガイド</h1>
          <p className={styles.subtitle}>初学者のためのステップバイステップ・ベストプラクティス</p>
          <div className={styles.notice}>
            本ガイドは<strong>2026年7月25日</strong>
            時点で公開されている情報（GitHub、AWS、Anthropic等の一次情報、および Addy
            Osmani、Birgitta Böckeler（Thoughtworks / Martin Fowler）、Sean
            Grove（OpenAI）ら国際的に著名な開発者・専門家の発信内容）に基づいて作成しています。各章に根拠となる出典番号を付し、巻末の参考文献一覧にURLをまとめています。SDDは急速に変化している分野のため、最新情報は各リンク先で随時ご確認ください。
          </div>
        </header>

        <section id="ch1" className={styles.chapter}>
          <h2>
            <span className={styles.num}>1</span>なぜ今、仕様駆動開発なのか
          </h2>
          <p>
            2025年以降、AIコーディングエージェントは急速に普及しましたが、同時に「動くコードは出てくるが、意図した通りには動かない」という問題が顕在化しました。Stack
            Overflowの2025年開発者調査では、84%の開発者がAIツールを利用済み、あるいは利用予定と回答した一方、その出力精度を信頼していると答えたのはわずか33%にとどまり、AIツールへの肯定的な感情は2023〜2024年の70%超から2025年には60%まで低下したと報告されています。
            <a className={styles.cite} href="#ref1">
              [1]
            </a>
          </p>
          <p>
            この背景には、Andrej Karpathyが2025年2月に提唱した「vibe
            coding（バイブコーディング）」——AIに自然文で指示し、出てきたコードをそのまま受け入れる開発スタイル——の限界があります。プロトタイピングには有効な一方、保守が必要な本番システムには不向きであることが繰り返し指摘されています。
            <a className={styles.cite} href="#ref2">
              [2]
            </a>
            <a className={styles.cite} href="#ref3">
              [3]
            </a>
          </p>
          <p>さらに、AI生成コードの品質に関する実証研究も蓄積されています。</p>
          <div className={styles.tableWrapper}>
            <table>
              <caption>表1-1. AI生成コードの品質に関する実証研究</caption>
              <thead>
                <tr>
                  <th>調査</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Yan et al. (2025)</td>
                  <td>AI生成コードの脆弱性混入率はベンチマークによって9.8%〜42.1%</td>
                </tr>
                <tr>
                  <td>Fu et al., ACM TOSEM (2025)</td>
                  <td>3つのAIコード生成ツールで43種類のCWE（脆弱性分類）を確認</td>
                </tr>
                <tr>
                  <td>2026年2月の大規模実証研究（arXiv）</td>
                  <td>本番リポジトリに残存するAI由来の不具合が11万件超に達したと報告</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.footnote} style={{ textAlign: "left", margin: "-8px 0 20px" }}>
            出典：
            <a className={styles.cite} href="#ref4">
              [4]
            </a>
          </p>
          <p>
            こうした課題への対応として、「コードではなく仕様（スペック）を最初に書き、それを実行可能な契約（contract）としてAIエージェントに与える」という仕様駆動開発（Spec-Driven
            Development, SDD）が2025〜2026年にかけて主流の実践として定着しました。
            <a className={styles.cite} href="#ref2">
              [2]
            </a>
            <a className={styles.cite} href="#ref5">
              [5]
            </a>
          </p>
        </section>

        <section id="ch2" className={styles.chapter}>
          <h2>
            <span className={styles.num}>2</span>仕様駆動開発（SDD）とは何か
          </h2>
          <p>
            SDDとは、バージョン管理された詳細な仕様書を「唯一の真実源（single source of
            truth）」とし、人間もしくはAIエージェントがまずその仕様を書き、そこから設計・タスク分解を経て初めてコードを生成するという開発手法です。要件が変わった場合はコードを直接編集するのではなく仕様を編集し、関連コードを再生成します。
            <a className={styles.cite} href="#ref5">
              [5]
            </a>
          </p>

          <h3>2.1 思想的な起点：Sean Grove「The New Code」</h3>
          <p>
            この考え方が広く知られるきっかけとなったのが、OpenAIでアライメント研究に携わっていたSean
            Groveが2025年のAI Engineer World's Fair（サンフランシスコ）で行った講演「The New
            Code」です。
            <a className={styles.cite} href="#ref1">
              [1]
            </a>
            <a className={styles.cite} href="#ref6">
              [6]
            </a>
          </p>
          <p>
            Groveは、開発者がAIにプロンプトを与えてコードだけを残しプロンプト自体を捨てる従来のやり方を、ソースコードを捨ててバイナリだけをバージョン管理することに例え、コードはプログラマーの価値のごく一部に過ぎず、より大きな価値は意図を構造化して伝達することにあると論じました。
            <a className={styles.cite} href="#ref6">
              [6]
            </a>
          </p>
          <p>
            Groveが例に挙げたのがOpenAI自身の「Model
            Spec」——各項目に一意のIDと具体例（テストとして機能する）を持つ、バージョン管理されたMarkdown文書として公開されているモデルの振る舞い仕様です。
            <a className={styles.cite} href="#ref1">
              [1]
            </a>
            <a className={styles.cite} href="#ref6">
              [6]
            </a>
          </p>

          <h3>2.2 パラダイムシフト：「コードが真実」から「意図が真実」へ</h3>
          <p>
            GitHubは公式ブログで、この転換を「コードが真実の源である」という前提から「意図（仕様）が真実の源である」という前提への移行だと説明しています。AIによって仕様が実行可能（executable）になったことで、ドキュメントの重要性が増したのではなく、仕様そのものが「何が作られるか」を直接決定するようになった、というのがその要点です。
            <a className={styles.cite} href="#ref7">
              [7]
            </a>
          </p>
          <p className={styles.footnote} style={{ textAlign: "left" }}>
            出典（第2章）：
            <a className={styles.cite} href="#ref1">
              [1]
            </a>{" "}
            <a className={styles.cite} href="#ref2">
              [2]
            </a>{" "}
            <a className={styles.cite} href="#ref6">
              [6]
            </a>{" "}
            <a className={styles.cite} href="#ref7">
              [7]
            </a>
          </p>
        </section>

        <section id="ch3" className={styles.chapter}>
          <h2>
            <span className={styles.num}>3</span>成熟度モデル：Spec-first / Spec-anchored /
            Spec-as-source
          </h2>
          <p>
            SDDという言葉は急速に広まった一方、実践のレベルはツールによって大きく異なります。ThoughtworksのBirgitta
            Böckelerは、Martin
            FowlerのWebサイトに掲載した分析記事の中で、SDDを3段階の成熟度として整理しました。これは2026年のarXiv論文「From
            Code to
            Contract」でもほぼ同じ枠組みが踏襲されており、業界で広く参照されるモデルとなっています。
            <a className={styles.cite} href="#ref8">
              [8]
            </a>
            <a className={styles.cite} href="#ref9">
              [9]
            </a>
            <a className={styles.cite} href="#ref10">
              [10]
            </a>
          </p>

          <div className={styles.mermaidWrapper}>
            <MermaidDiagram
              chart={`flowchart LR
    L1["Spec-first: 使い捨てのSpec"]:::c1 --> L2["Spec-anchored: 生きた文書として保守"]:::c2 --> L3["Spec-as-source: Specのみ人間が編集"]:::c3
    classDef c1 fill:#3b2f6b,stroke:#c9bdf5,color:#e4defa
    classDef c2 fill:#134e4a,stroke:#99f0e3,color:#d1faf3
    classDef c3 fill:#5c2a1f,stroke:#ffb199,color:#ffe3d9`}
            />
          </div>
          <p className={styles.diagramCaption}>図3-1. SDDの3段階成熟度モデル（Böckeler, 2026）</p>

          <div className={styles.tableWrapper}>
            <table>
              <caption>表3-1. 成熟度モデルの各段階</caption>
              <thead>
                <tr>
                  <th>段階</th>
                  <th>概要</th>
                  <th>適したシーン</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Spec-first</td>
                  <td>
                    良く練られた仕様を最初に書き、1回のタスクのAI支援開発に使う。仕様はその後破棄・放置されがち
                  </td>
                  <td>単発の機能追加、小規模な変更</td>
                </tr>
                <tr>
                  <td>Spec-anchored</td>
                  <td>仕様を機能の進化とともに保守し続け、「生きたドキュメント」として扱う</td>
                  <td>チーム開発、継続的なプロダクト開発</td>
                </tr>
                <tr>
                  <td>Spec-as-source</td>
                  <td>
                    仕様が唯一の編集対象となり、人間はコードを直接編集しない（コードは自動生成専用）
                  </td>
                  <td>高い一貫性が求められる大規模システム（まだ発展途上）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.calloutTip}`}>
            <span className={styles.icon}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 16v-5"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </span>
            <p>
              Böckelerは、この3段階を混同しないことが重要だと述べています。GitHub Spec
              KitやKiroの多くの実践は「Spec-first」〜「Spec-anchored」の間にあり、「Spec-as-source」を徹底しているのはTesslのような一部のツールに限られます。
              <a className={styles.cite} href="#ref8">
                [8]
              </a>
            </p>
          </div>
          <p className={styles.footnote} style={{ textAlign: "left" }}>
            出典（第3章）：
            <a className={styles.cite} href="#ref8">
              [8]
            </a>{" "}
            <a className={styles.cite} href="#ref9">
              [9]
            </a>{" "}
            <a className={styles.cite} href="#ref10">
              [10]
            </a>
          </p>
        </section>

        <section id="ch4" className={styles.chapter}>
          <h2>
            <span className={styles.num}>4</span>主要ツールエコシステム（2026年7月時点）
          </h2>
          <p>
            2025年後半から2026年にかけて、主要なAIコーディングツールの多くが独自のSDD実装を発表しました。
            <a className={styles.cite} href="#ref5">
              [5]
            </a>
            <a className={styles.cite} href="#ref11">
              [11]
            </a>
          </p>
          <div className={styles.tableWrapper}>
            <table>
              <caption>表4-1. 主要SDDツールの比較</caption>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>提供元</th>
                  <th>中核ワークフロー</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>GitHub Spec Kit</td>
                  <td>GitHub</td>
                  <td>constitution → specify → plan → tasks → analyze → implement</td>
                  <td>
                    MITライセンスのOSS。30以上のAIコーディングエージェント（Claude
                    Code、Copilot、Gemini CLI等）に対応{" "}
                    <a className={styles.cite} href="#ref12">
                      [12]
                    </a>
                    <a className={styles.cite} href="#ref13">
                      [13]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>AWS Kiro</td>
                  <td>Amazon</td>
                  <td>Requirements（EARS記法）→ Design → Tasks → Execution</td>
                  <td>
                    VS
                    Codeベースの専用IDE。保存時に自動でlint/test/セキュリティスキャンを走らせる「Hooks」機能を搭載{" "}
                    <a className={styles.cite} href="#ref14">
                      [14]
                    </a>
                    <a className={styles.cite} href="#ref15">
                      [15]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Claude Code</td>
                  <td>Anthropic</td>
                  <td>CLAUDE.md（憲法）→ Plan Mode → PLAN.md → Tasks → Subagentレビュー</td>
                  <td>
                    SDDの要素をネイティブ機能として内包。CLAUDE.mdは「advisory（助言的）」、hooksは「deterministic（決定的）」という設計思想{" "}
                    <a className={styles.cite} href="#ref16">
                      [16]
                    </a>
                    <a className={styles.cite} href="#ref17">
                      [17]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Tessl</td>
                  <td>Tessl</td>
                  <td>Spec-as-source徹底</td>
                  <td>
                    1対1のspec-to-codeマッピングを目指す最も急進的な実装。生成コードには編集禁止マーカーを付与（2026年時点でベータ）
                    <a className={styles.cite} href="#ref8">
                      [8]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Google Conductor / Antigravity</td>
                  <td>Google</td>
                  <td>永続的でバージョン管理されたMarkdownによるコンテキスト共有</td>
                  <td>
                    元はGemini CLI拡張機能。2026年7月にプラグイン形式へ進化しAntigravityに対応{" "}
                    <a className={styles.cite} href="#ref18">
                      [18]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>OpenSpec / BMAD-METHOD</td>
                  <td>OSSコミュニティ</td>
                  <td>軽量なSDDフレームワーク</td>
                  <td>
                    ツールによって採用の伸びに大きな差があり、半年で800%超成長したものもあれば緩やかな成長にとどまるものもある{" "}
                    <a className={styles.cite} href="#ref19">
                      [19]
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`${styles.callout} ${styles.calloutTip}`}>
            <span className={styles.icon}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 16v-5"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </span>
            <p>
              <strong>選び方の目安</strong>
              ：ポータビリティ（特定エージェントに縛られない）を重視するならGitHub Spec
              Kit、IDE統合の完成度を重視するならAWS
              Kiro、ターミナル中心の開発でCLAUDE.mdによる規約統合を重視するならClaude
              Codeが出発点として挙げられています。
              <a className={styles.cite} href="#ref11">
                [11]
              </a>
              <a className={styles.cite} href="#ref16">
                [16]
              </a>
            </p>
          </div>
          <p className={styles.footnote} style={{ textAlign: "left" }}>
            出典（第4章）：
            <a className={styles.cite} href="#ref5">
              [5]
            </a>{" "}
            <a className={styles.cite} href="#ref8">
              [8]
            </a>{" "}
            <a className={styles.cite} href="#ref11">
              [11]
            </a>{" "}
            <a className={styles.cite} href="#ref12">
              [12]
            </a>{" "}
            <a className={styles.cite} href="#ref13">
              [13]
            </a>{" "}
            <a className={styles.cite} href="#ref14">
              [14]
            </a>{" "}
            <a className={styles.cite} href="#ref15">
              [15]
            </a>{" "}
            <a className={styles.cite} href="#ref16">
              [16]
            </a>{" "}
            <a className={styles.cite} href="#ref17">
              [17]
            </a>{" "}
            <a className={styles.cite} href="#ref18">
              [18]
            </a>{" "}
            <a className={styles.cite} href="#ref19">
              [19]
            </a>
          </p>
        </section>

        <section id="ch5" className={styles.chapter}>
          <h2>
            <span className={styles.num}>5</span>要件記述の基盤技術：EARS記法
          </h2>
          <p>
            多くのSDDツール（特にAWS Kiro）が要件定義部分に採用しているのが「EARS（Easy Approach to
            Requirements Syntax）」という記法です。
            <a className={styles.cite} href="#ref14">
              [14]
            </a>
            <a className={styles.cite} href="#ref15">
              [15]
            </a>
          </p>

          <h3>5.1 歴史</h3>
          <p>
            EARSは2009年、Rolls-Royce社のAlistair
            Mavinらが、航空機エンジン制御システムの耐空性規則を分析する中で開発し、同年のIEEE
            International Requirements Engineering Conference（RE'09）で発表されました。
            <a className={styles.cite} href="#ref20">
              [20]
            </a>
            <a className={styles.cite} href="#ref21">
              [21]
            </a>
            自然言語で書かれた要件が抱えがちな「曖昧さ・冗長さ・矛盾・実装依存の記述」といった問題を、少数のキーワードと一貫した節の順序によって軽減することを目的としています。
            <a className={styles.cite} href="#ref20">
              [20]
            </a>
            <a className={styles.cite} href="#ref21">
              [21]
            </a>
            Airbus、Bosch、Dyson、Honeywell、Intel、NASA、Siemens等、航空宇宙・自動車業界を中心に長年採用されてきた実績があり、2025年以降はAWS
            KiroをはじめとするAI仕様駆動開発ツールに組み込まれる形で新たな注目を集めています。
            <a className={styles.cite} href="#ref21">
              [21]
            </a>
          </p>

          <h3>5.2 基本構文</h3>
          <pre className={styles.codePre}>
            <code>
              While &lt;事前条件（任意）&gt;, When &lt;トリガー（任意）&gt;, the &lt;システム名&gt;
              shall &lt;システムの応答&gt;
            </code>
          </pre>

          <div className={styles.tableWrapper}>
            <table>
              <caption>表5-1. EARSの要件タイプとパターン例</caption>
              <thead>
                <tr>
                  <th>要件タイプ</th>
                  <th>パターン例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ubiquitous（恒常的）</td>
                  <td>The system shall encrypt all stored passwords.</td>
                </tr>
                <tr>
                  <td>Event-driven（イベント駆動）</td>
                  <td>
                    When the user submits the login form, the system shall validate the credentials
                    within 2 seconds.
                  </td>
                </tr>
                <tr>
                  <td>Unwanted behavior（望ましくない挙動）</td>
                  <td>
                    If the authentication fails 5 times, then the system shall lock the account for
                    15 minutes.
                  </td>
                </tr>
                <tr>
                  <td>State-driven（状態駆動）</td>
                  <td>While the account is locked, the system shall reject all login attempts.</td>
                </tr>
                <tr>
                  <td>Optional feature（オプション機能）</td>
                  <td>
                    Where two-factor authentication is enabled, the system shall require a one-time
                    code after password verification.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            初学者は、まず「Event-driven」と「Unwanted
            behavior」の2パターンだけでも意識して仕様を書くと、曖昧な要件がかなり減ります。
          </p>
          <p className={styles.footnote} style={{ textAlign: "left" }}>
            出典（第5章）：
            <a className={styles.cite} href="#ref14">
              [14]
            </a>{" "}
            <a className={styles.cite} href="#ref15">
              [15]
            </a>{" "}
            <a className={styles.cite} href="#ref20">
              [20]
            </a>{" "}
            <a className={styles.cite} href="#ref21">
              [21]
            </a>
          </p>
        </section>

        <section id="ch6" className={styles.chapter}>
          <h2>
            <span className={styles.num}>6</span>ステップバイステップ・ワークフロー実践
          </h2>

          <h3>6.1 ツールに共通する一般モデル</h3>
          <p>ツールごとに呼び方は異なりますが、根底にある流れはほぼ共通しています。</p>

          <div className={styles.mermaidWrapper}>
            <MermaidDiagram
              chart={`flowchart LR
    A["Constitution（指針）"]:::t --> B["Requirements（要件）"]:::t
    B --> C["Design / Plan（設計）"]:::t
    C --> D["Tasks（タスク分解）"]:::t
    D --> E["Implementation（実装）"]:::t
    E --> F["Verification（検証）"]:::t
    F -->|"仕様変更・差分"| B
    classDef t fill:#134e4a,stroke:#99f0e3,color:#d1faf3`}
            />
          </div>
          <p className={styles.diagramCaption}>図6-1. SDDの一般的なライフサイクル</p>

          <p>
            各フェーズの間には必ず人間によるレビュー（承認ゲート）を挟むことが推奨されています。AWS
            Kiroのドキュメントでも「要件承認後に設計へ、設計承認後にタスクへ」と各段階の間に確認ステップを置く設計になっています。
            <a className={styles.cite} href="#ref14">
              [14]
            </a>
            <a className={styles.cite} href="#ref22">
              [22]
            </a>
          </p>

          <h3>6.2 GitHub Spec Kitの具体的なコマンドフロー</h3>

          <div className={styles.mermaidWrapper}>
            <MermaidDiagram
              chart={`flowchart LR
    C0["/speckit.constitution"]:::p --> C1["/speckit.specify"]:::p --> C2["/speckit.plan"]:::p --> C3["/speckit.tasks"]:::p --> C4["/speckit.analyze"]:::p --> C5["/speckit.implement"]:::p
    classDef p fill:#3b2f6b,stroke:#c9bdf5,color:#e4defa`}
            />
          </div>
          <p className={styles.diagramCaption}>図6-2. GitHub Spec Kitのコマンドフロー</p>

          <p>
            <code className={styles.codeInline}>constitution</code>ファイルは
            <code className={styles.codeInline}>.specify/memory/constitution.md</code>
            に保存され、プロジェクト固有の非交渉的なルール（禁止事項・必須事項）を定義します。この構造は9つの条項（nine-article
            structure）で構成され、プロジェクトごとに内容をカスタマイズできる形になっています。
            <a className={styles.cite} href="#ref23">
              [23]
            </a>
            <a className={styles.cite} href="#ref24">
              [24]
            </a>
          </p>

          <h3>6.3 AWS Kiroの3ドキュメント構成</h3>

          <div className={styles.mermaidWrapper}>
            <MermaidDiagram
              chart={`flowchart LR
    K1["自然言語のプロンプト"]:::k --> K2["requirements.md（EARS記法）"]:::k --> K3["design.md（技術設計）"]:::k --> K4["tasks.md（実装タスク）"]:::k --> K5["実装 + Hooks（lint/test/セキュリティ）"]:::k
    classDef k fill:#5c2a1f,stroke:#ffb199,color:#ffe3d9`}
            />
          </div>
          <p className={styles.diagramCaption}>図6-3. AWS Kiroの3ドキュメント構成</p>

          <p>
            Kiroでは各タスク完了後に自動でテストを実行し、要件を満たしているかを検証する仕組みが組み込まれています。また「Run
            all
            Tasks」機能を使うと、依存関係のないタスクを並行して実行する「Wave」単位の実行が可能です。
            <a className={styles.cite} href="#ref22">
              [22]
            </a>
          </p>
          <p className={styles.footnote} style={{ textAlign: "left" }}>
            出典（第6章）：
            <a className={styles.cite} href="#ref14">
              [14]
            </a>{" "}
            <a className={styles.cite} href="#ref22">
              [22]
            </a>{" "}
            <a className={styles.cite} href="#ref23">
              [23]
            </a>{" "}
            <a className={styles.cite} href="#ref24">
              [24]
            </a>
          </p>
        </section>

        <section id="ch7" className={styles.chapter}>
          <h2>
            <span className={styles.num}>7</span>良い仕様（スペック）の書き方 — 初学者向け5原則
          </h2>
          <p>
            Google Chromeのエンジニアリングリーダーとして知られるAddy Osmaniは、O'Reilly
            Radarに寄稿した記事の中で、GitHub上の2,500件以上のエージェント設定ファイル分析結果を踏まえた「良い仕様を書くための5原則」を提示しています。
            <a className={styles.cite} href="#ref25">
              [25]
            </a>
            <a className={styles.cite} href="#ref26">
              [26]
            </a>
            <a className={styles.cite} href="#ref27">
              [27]
            </a>
          </p>

          <h3>原則1：目標志向で書く（Keep it goal-oriented）</h3>
          <p>
            仕様の冒頭は「何を（What）」「なぜ（Why）」に集中し、実装の「どうやって（How）」は後回しにします。ユーザーストーリーと同じ要領で「誰が」「何を必要としているか」「成功とは何か」を明確にします。
            <a className={styles.cite} href="#ref26">
              [26]
            </a>
          </p>

          <h3>原則2：構造化されたドキュメントとして書く</h3>
          <p>
            思いつきのメモの寄せ集めではなく、PRD（Product Requirements Document）やSRS（Software
            Requirements Specification）のように、明確なセクションを持つ文書として仕様を扱います。
            <a className={styles.cite} href="#ref26">
              [26]
            </a>
          </p>

          <h3>原則3：多く書きすぎない（instruction curseへの注意）</h3>
          <p>
            Stanford発の研究では、プロンプトに指示を詰め込むほどモデルが各指示に従う精度が低下する現象（いわゆる「curse
            of
            instructions」）が確認されています。10個の詳細ルールを並べると、モデルは最初の数個には従っても後半を見落としがちになります。したがって「長い仕様」ではなく「賢く整理された仕様」を目指すべきだとOsmaniは指摘しています。
            <a className={styles.cite} href="#ref27">
              [27]
            </a>
          </p>

          <h3>原則4：3段階の境界線（Always / Ask first / Never）を設ける</h3>
          <p>
            単純な「やってはいけないことリスト」よりも、3段階の境界システムの方がエージェントに明確な行動指針を与えられます。
            <a className={styles.cite} href="#ref26">
              [26]
            </a>
            <a className={styles.cite} href="#ref27">
              [27]
            </a>
          </p>

          <div className={styles.mermaidWrapper}>
            <MermaidDiagram
              chart={`flowchart TD
    Q["エージェントが次のアクションを取ろうとしている"]:::neutral --> A{"影響度は？"}:::neutral
    A -->|"低リスク・定型作業"| G["Always do: 確認なしで実行"]:::ok
    A -->|"中〜高リスクな変更"| H["Ask first: 承認を待つ"]:::warn
    A -->|"破壊的・不可逆な操作"| N["Never do: 常に禁止"]:::bad
    classDef neutral fill:#28303d,stroke:#cbd3de,color:#eef1f5
    classDef ok fill:#0f3d28,stroke:#8be8bd,color:#dbf8e8
    classDef warn fill:#4a3208,stroke:#ffd580,color:#fff2d6
    classDef bad fill:#4a1414,stroke:#ffaaaa,color:#ffe0e0`}
            />
          </div>
          <p className={styles.diagramCaption}>図7-1. 3段階の境界線による判断フロー</p>

          <div className={styles.tableWrapper}>
            <table>
              <caption>表7-1. 3段階境界線の例</caption>
              <thead>
                <tr>
                  <th>区分</th>
                  <th>例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Always do</td>
                  <td>コミット前に必ずテストを実行する／命名規約に従う</td>
                </tr>
                <tr>
                  <td>Ask first</td>
                  <td>データベーススキーマの変更前に確認する／新しい依存関係の追加前に確認する</td>
                </tr>
                <tr>
                  <td>Never do</td>
                  <td>
                    シークレットやAPIキーをコミットしない／node_modulesやvendor配下を編集しない
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>原則5：自己検証を組み込む（self-verification / LLM-as-a-Judge）</h3>
          <p>
            実装後に「仕様の各項目を満たしているか確認し、満たしていない項目を列挙せよ」とエージェント自身に確認させる自己監査のステップを仕様に組み込むと、抜け漏れの検出率が上がります。コードスタイルや可読性のような自動テストで測りにくい観点については、別のエージェント（あるいは別プロンプト）に出力をレビューさせる「LLM-as-a-Judge」パターンも有効とされています。
            <a className={styles.cite} href="#ref26">
              [26]
            </a>
            <a className={styles.cite} href="#ref27">
              [27]
            </a>
          </p>

          <div className={`${styles.callout} ${styles.calloutTip}`}>
            <span className={styles.icon}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 16v-5"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </span>
            <p>
              Osmaniはこれらの原則の裏付けとして、開発者のSimon
              Willisonが、コーディングエージェントから良い結果を引き出す感覚は人間のジュニアエンジニアをマネジメントする感覚に近いと述べていることも紹介しています。
              <a className={styles.cite} href="#ref27">
                [27]
              </a>
            </p>
          </div>
          <p className={styles.footnote} style={{ textAlign: "left" }}>
            出典（第7章）：
            <a className={styles.cite} href="#ref25">
              [25]
            </a>{" "}
            <a className={styles.cite} href="#ref26">
              [26]
            </a>{" "}
            <a className={styles.cite} href="#ref27">
              [27]
            </a>
          </p>
        </section>

        <section id="ch8" className={styles.chapter}>
          <h2>
            <span className={styles.num}>8</span>Claude Codeにおける実践
          </h2>
          <p>
            Anthropic自身が公開している「Claude Code: Best practices for agentic
            coding」では、CLAUDE.mdを活用したコンテキスト管理や、実装前に計画を立てる重要性が解説されています。
            <a className={styles.cite} href="#ref16">
              [16]
            </a>
          </p>

          <h3>8.1 CLAUDE.md ＝ プロジェクトの「憲法」</h3>
          <p>
            CLAUDE.mdはプロジェクトルートに置かれ、セッション開始時に自動的にコンテキストへ読み込まれるMarkdownファイルです。コーディング規約・アーキテクチャ上の決定事項・優先ライブラリ・レビューチェックリストなどを記述します。
            <a className={styles.cite} href="#ref16">
              [16]
            </a>
            <a className={styles.cite} href="#ref28">
              [28]
            </a>
            ただし、CLAUDE.mdの指示は「advisory（助言的）」であり、確率的に従われるものである点に注意が必要です。長すぎるCLAUDE.mdはかえって指示追従の精度を下げるため、「この行を削除するとClaudeがミスをするか」を基準に定期的に刈り込むことが推奨されています。
            <a className={styles.cite} href="#ref17">
              [17]
            </a>
          </p>

          <h3>8.2 Plan ModeとSubagentレビューのループ</h3>

          <div className={styles.mermaidWrapper}>
            <MermaidDiagram
              chart={`flowchart LR
    P1["Explore（Plan Mode）"]:::pk --> P2["Plan（PLAN.md作成）"]:::pk --> P3["Implement"]:::pk --> P4["Subagent Review"]:::pk
    P4 -->|"ギャップを検出"| P3
    P4 -->|"合格・証拠を提示"| P5["Commit"]:::pk
    classDef pk fill:#5c1f44,stroke:#f7b8dd,color:#fde3f2`}
            />
          </div>
          <p className={styles.diagramCaption}>
            図8-1. Claude CodeにおけるPlan Mode〜Subagentレビューのループ
          </p>

          <p>
            Anthropicの実践では、実装が完了したという「主張」をそのまま信じるのではなく、テスト出力・実行コマンドとその結果・スクリーンショットなど「証拠（evidence）」を提示させることが推奨されています。証拠を確認する方が、検証をゼロからやり直すより速いためです。
            <a className={styles.cite} href="#ref17">
              [17]
            </a>
          </p>

          <h3>8.3 Hooksによる決定的な強制</h3>
          <p>
            CLAUDE.mdの指示が確率的（advisory）であるのに対し、Hooksはスクリプトを自動実行する決定的（deterministic）な仕組みであり、アクションを確実に強制できます。CLAUDE.mdによる注意喚起だけでは不十分になった場合、恒久的な対策としてHooksやSkillsへ制御を移すことが推奨されています。
            <a className={styles.cite} href="#ref17">
              [17]
            </a>
          </p>

          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <span className={styles.icon}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 9v4"></path>
                <path d="M10.4 3.9 2.7 17.1a1.7 1.7 0 0 0 1.5 2.6h15.6a1.7 1.7 0 0 0 1.5-2.6L13.6 3.9a1.7 1.7 0 0 0-3.2 0Z"></path>
                <path d="M12 16.2h.01"></path>
              </svg>
            </span>
            <p>
              Anthropicの社内チームの報告によれば、詳細な指示なしでClaude
              Codeが小〜中規模のPRを一発で正しく仕上げる成功率はおよそ3分の1程度にとどまるとされています。1つのタスクに20の意思決定判断が含まれ、各判断の的中率を80%と仮定すると、20個すべてを事前ガイドなしで正しく判断できる確率は0.8の20乗、つまり約1%にまで下がる計算になります。レビュー済みの仕様を用意することは、Claudeが下すべきでない判断そのものを事前に排除する効果があるといえます。
              <a className={styles.cite} href="#ref29">
                [29]
              </a>
            </p>
          </div>
          <p className={styles.footnote} style={{ textAlign: "left" }}>
            出典（第8章）：
            <a className={styles.cite} href="#ref16">
              [16]
            </a>{" "}
            <a className={styles.cite} href="#ref17">
              [17]
            </a>{" "}
            <a className={styles.cite} href="#ref28">
              [28]
            </a>{" "}
            <a className={styles.cite} href="#ref29">
              [29]
            </a>
          </p>
        </section>

        <section id="ch9" className={styles.chapter}>
          <h2>
            <span className={styles.num}>9</span>ベストプラクティス・チェックリスト
          </h2>
          <div className={`${styles.tableWrapper} ${styles.checklistTable}`}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>チェック項目</th>
                  <th>補足</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>プロジェクトの「憲法（Constitution）」を最初に定義したか</td>
                  <td>
                    非交渉的なルール・技術スタック・禁止事項を明文化{" "}
                    <a className={styles.cite} href="#ref23">
                      [23]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>仕様は「What/Why」から始め、「How」は後段に回したか</td>
                  <td>
                    実装詳細を早期に混ぜるとAIの視野が狭まる{" "}
                    <a className={styles.cite} href="#ref26">
                      [26]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>受け入れ基準をEARS記法などの構造化された形式で書いたか</td>
                  <td>
                    曖昧さ・矛盾を減らせる{" "}
                    <a className={styles.cite} href="#ref14">
                      [14]
                    </a>
                    <a className={styles.cite} href="#ref20">
                      [20]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Always / Ask first / Never の3段階境界を設定したか</td>
                  <td>
                    単純な禁止リストより行動指針が明確{" "}
                    <a className={styles.cite} href="#ref26">
                      [26]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>仕様は詰め込みすぎず、モジュール単位に分割したか</td>
                  <td>
                    curse of instructionsを回避{" "}
                    <a className={styles.cite} href="#ref27">
                      [27]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>各フェーズ（要件→設計→タスク→実装）の間に人間の承認ゲートを設けたか</td>
                  <td>
                    Kiro・Spec Kitとも共通の設計原則{" "}
                    <a className={styles.cite} href="#ref14">
                      [14]
                    </a>
                    <a className={styles.cite} href="#ref23">
                      [23]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>実装後、仕様との差分を自己検証させる仕組みを入れたか</td>
                  <td>
                    LLM-as-a-Judgeパターンの活用{" "}
                    <a className={styles.cite} href="#ref26">
                      [26]
                    </a>
                    <a className={styles.cite} href="#ref27">
                      [27]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>「証拠（テスト結果・実行ログ）」の提示を求めているか</td>
                  <td>
                    主張ではなく証拠でレビューする{" "}
                    <a className={styles.cite} href="#ref17">
                      [17]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>
                    重要な強制事項はCLAUDE.md（advisory）ではなくHooks（deterministic）に移したか
                  </td>
                  <td>
                    恒久対策として有効{" "}
                    <a className={styles.cite} href="#ref17">
                      [17]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>プロジェクトの規模・目的に見合ったSDDの成熟度を選んだか</td>
                  <td>
                    オーバーヘッドと得られる制御のバランス{" "}
                    <a className={styles.cite} href="#ref8">
                      [8]
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="ch10" className={styles.chapter}>
          <h2>
            <span className={styles.num}>10</span>批判的視点と限界
          </h2>
          <p>
            SDDは万能薬ではありません。Böckelerは、GitHub Spec Kit、AWS
            Kiro、Tesslの3ツールを実際に評価した記事の中で、以下のような課題を指摘しています。
            <a className={styles.cite} href="#ref8">
              [8]
            </a>
          </p>
          <ul>
            <li>
              <strong>レビュー負荷の増大</strong>：特にSpec
              Kitは、1つの仕様に対して大量の反復的なMarkdownファイルを生成するため、レビューが過大になり、場合によっては通常のコードレビューの方が現実的になることがある。
            </li>
            <li>
              <strong>「制御している」という錯覚</strong>
              ：複雑な指示に対してAIエージェントが一部を無視したり、逆に過剰に適用したりする挙動が観察されており、仕様を書けば完全に制御できるという前提には注意が必要。
            </li>
            <li>
              <strong>小規模タスクへの不適合</strong>
              ：軽微なバグ修正のような小さな作業には、SDDの手続きがオーバーヘッドになりやすい。
            </li>
            <li>
              <strong>モデル駆動開発（MDD）との歴史的な類似</strong>
              ：「Spec-as-source」という野心は、過去に十分な成果を上げられなかったモデル駆動開発の理想と重なる部分があり、LLMの非決定性がMDDの硬直性の問題をむしろ悪化させる可能性がある。
            </li>
            <li>
              <strong>用語の希薄化</strong>
              ：「Spec」という言葉が単なる「詳細なプロンプト」の同義語として使われるケースが増えており、手法が確立する前に意味が拡散しつつある。
            </li>
          </ul>
          <div className={`${styles.callout} ${styles.calloutDanger}`}>
            <span className={styles.icon}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 8v5"></path>
                <path d="M12 16h.01"></path>
              </svg>
            </span>
            <p>
              これらを踏まえると、SDDは「常に必要な儀式」ではなく、
              <strong>
                プロジェクトの複雑さ・チーム規模・保守期間に応じて適用レベルを選ぶための道具
              </strong>
              として捉えるのが実践的です。ソロでの探索的なプロトタイピングであれば軽量なvibe
              codingのままで構わず、本番運用・複数チーム・規制対応が絡む場面でSpec-anchored以上の厳密さを導入する、という使い分けが妥当とされています。
              <a className={styles.cite} href="#ref8">
                [8]
              </a>
              <a className={styles.cite} href="#ref30">
                [30]
              </a>
            </p>
          </div>
          <p className={styles.footnote} style={{ textAlign: "left" }}>
            出典（第10章）：
            <a className={styles.cite} href="#ref8">
              [8]
            </a>{" "}
            <a className={styles.cite} href="#ref30">
              [30]
            </a>
          </p>
        </section>

        <section id="ch11" className={styles.chapter}>
          <h2>
            <span className={styles.num}>11</span>2026年7月時点の最新動向
          </h2>
          <ul>
            <li>
              <strong>Google Conductorのプラグイン化</strong>：2026年7月16日付のGoogle Developers
              Blogによれば、Gemini CLI拡張として始まったConductorが「Conductor
              Plugin」として進化し、Skills・Rules・MCPサーバー・Hooksを1つのパッケージにまとめられるようになりました。あわせて新しいエージェント基盤「Antigravity」への対応も発表されています。
              <a className={styles.cite} href="#ref18">
                [18]
              </a>
            </li>
            <li>
              <strong>AWS Kiroの立ち位置強化</strong>：Amazon Q
              DeveloperがKiroへ統合される形でのサポート終了（新規ユーザー向けは2027年4月30日終了予定）が示されており、AWSは開発者向けAI投資をKiroに集約する方針を明確にしています。
              <a className={styles.cite} href="#ref15">
                [15]
              </a>
            </li>
            <li>
              <strong>教育面での定着</strong>：DeepLearning.AIが2025年後半に、Sandeep
              Dinesh氏を講師とする専門コース「Spec-Driven Development with Coding
              Agents」を開講しており、実験的な手法から主流の実践へと移行したことを示す一つの指標とされています。
              <a className={styles.cite} href="#ref31">
                [31]
              </a>
            </li>
            <li>
              <strong>業界での評価の広がり</strong>：Thoughtworks・Martin
              Fowler・GitHub・Amazonなど複数の独立した情報源が2025〜2026年にかけてSDDを推奨する立場を示しており、ThoughtworksのTechnology
              Radarでも採用を検討すべき技術として取り上げられています。
              <a className={styles.cite} href="#ref31">
                [31]
              </a>
            </li>
            <li>
              <strong>OSSフレームワーク間の採用格差</strong>
              ：OpenSpecやBMAD-METHODなど軽量なOSS実装の間でも、採用の伸び方には大きな差が生じており、半年間で800%を超える成長を見せたものもあれば、緩やかな成長にとどまるものもあると報告されています。
              <a className={styles.cite} href="#ref19">
                [19]
              </a>
            </li>
          </ul>
          <p className={styles.footnote} style={{ textAlign: "left" }}>
            出典（第11章）：
            <a className={styles.cite} href="#ref15">
              [15]
            </a>{" "}
            <a className={styles.cite} href="#ref18">
              [18]
            </a>{" "}
            <a className={styles.cite} href="#ref19">
              [19]
            </a>{" "}
            <a className={styles.cite} href="#ref31">
              [31]
            </a>
          </p>
        </section>

        <section id="ch12" className={styles.chapter}>
          <h2>
            <span className={styles.num}>12</span>まとめ
          </h2>
          <p>
            仕様駆動開発（SDD）は、「AIエージェントがコードを書く時代において、人間が生み出す最も価値の高い成果物は仕様そのものである」という認識のもとに生まれた実践です。GitHub
            Spec Kit・AWS Kiro・Claude
            Codeなど主要ツールはそれぞれ異なるワークフローを持ちますが、根底にある「Constitution／Steering
            → Requirements → Design/Plan → Tasks → Implementation →
            Verification」という流れは共通しています。
          </p>
          <p>初学者がまず身につけるべきは、次の3点に集約されます。</p>
          <ol>
            <li>
              仕様は「What/Why」から書き始め、EARS記法のような構造化された形式で受け入れ基準を明示すること
            </li>
            <li>仕様を詰め込みすぎず、Always/Ask first/Neverの3段階で境界を設けること</li>
            <li>実装は必ず人間のレビュー（承認ゲート）を挟み、「証拠」に基づいて検証すること</li>
          </ol>
          <p>
            一方で、SDDはレビュー負荷の増大や小規模タスクへの不適合といった限界も指摘されています。プロジェクトの規模・重要度に応じて、Spec-first・Spec-anchored・Spec-as-sourceのどの成熟度で実践するかを選ぶことが、実務での成功の鍵となります。
          </p>
        </section>

        <div className={styles.footer}>
          <section id="refs" className={styles.chapter}>
            <h2>
              <span className={styles.num}>13</span>参考文献・出典一覧
            </h2>
            <div className={styles.refsGrid}>
              <div className={styles.refCard} id="ref1">
                <span className={styles.refNum}>1</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Augment Code</p>
                  <p className={styles.refTitle}>
                    6 Best Spec-Driven Development Tools for AI Coding in 2026
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://www.augmentcode.com/tools/best-spec-driven-development-tools"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    augmentcode.com/tools/best-spec-driven-development-tools
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref2">
                <span className={styles.refNum}>2</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>GitHub Blog</p>
                  <p className={styles.refTitle}>
                    Spec-driven development with AI: Get started with a new open source toolkit
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.blog
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref3">
                <span className={styles.refNum}>3</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>DEV Community</p>
                  <p className={styles.refTitle}>
                    Spec-Driven Development in 2026: What It Is, the Tooling, and How Teams Actually
                    Use It
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://dev.to/krlz/spec-driven-development-in-2026-what-it-is-the-tooling-and-how-teams-actually-use-it-2fk2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dev.to/krlz
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref4">
                <span className={styles.refNum}>4</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Augment Code</p>
                  <p className={styles.refTitle}>
                    What Is Spec-Driven Development? A Complete Guide
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://www.augmentcode.com/guides/what-is-spec-driven-development"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    augmentcode.com/guides/what-is-spec-driven-development
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref5">
                <span className={styles.refNum}>5</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>BCMS</p>
                  <p className={styles.refTitle}>
                    Spec-Driven Development (SDD): The Definitive 2026 Guide
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://thebcms.com/blog/spec-driven-development"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    thebcms.com/blog/spec-driven-development
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref6">
                <span className={styles.refNum}>6</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Sean Grove</p>
                  <p className={styles.refTitle}>
                    The New Code（AI Engineer World's Fair, 2025）文字起こし
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://lawwu.github.io/transcripts/8rABwKRsec4.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    lawwu.github.io/transcripts（動画: youtube.com/watch?v=8rABwKRsec4）
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref7">
                <span className={styles.refNum}>7</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>GitHub Blog</p>
                  <p className={styles.refTitle}>
                    上記[2]と同一記事内でのパラダイムシフトに関する記述
                  </p>
                </div>
              </div>
              <div className={styles.refCard} id="ref8">
                <span className={styles.refNum}>8</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Birgitta Böckeler</p>
                  <p className={styles.refTitle}>
                    Understanding Spec-Driven-Development: Kiro, spec-kit, and
                    Tessl（martinfowler.com）
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref9">
                <span className={styles.refNum}>9</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Birgitta Böckeler</p>
                  <p className={styles.refTitle}>Publications</p>
                  <a
                    className={styles.refLink}
                    href="https://birgitta.info/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    birgitta.info
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref10">
                <span className={styles.refNum}>10</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>TrueFoundry</p>
                  <p className={styles.refTitle}>
                    Spec-Driven Development for AI Agents: Governing Specs
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://www.truefoundry.com/blog/spec-driven-development-ai-agents"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    truefoundry.com/blog/spec-driven-development-ai-agents
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref11">
                <span className={styles.refNum}>11</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>codemyspec</p>
                  <p className={styles.refTitle}>
                    Spec-Driven Development in 2026: Guide + Tool Comparison
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://codemyspec.com/blog/spec-driven-development"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    codemyspec.com/blog/spec-driven-development
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref12">
                <span className={styles.refNum}>12</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>GitHub</p>
                  <p className={styles.refTitle}>spec-kit リポジトリ</p>
                  <a
                    className={styles.refLink}
                    href="https://github.com/github/spec-kit"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/github/spec-kit
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref13">
                <span className={styles.refNum}>13</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>MarkTechPost</p>
                  <p className={styles.refTitle}>
                    Meet GitHub Spec-Kit: An Open Source Toolkit for Spec-Driven Development with AI
                    Coding Agents
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://www.marktechpost.com/2026/05/08/meet-github-spec-kit-an-open-source-toolkit-for-spec-driven-development-with-ai-coding-agents/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    marktechpost.com
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref14">
                <span className={styles.refNum}>14</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Carlos Biagolini</p>
                  <p className={styles.refTitle}>
                    What Is Spec-Driven Development and How to Implement It with Kiro（AWS in Plain
                    English）
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://aws.plainenglish.io/what-is-spec-driven-development-and-how-to-implement-it-with-kiro-b5846bd55869"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    aws.plainenglish.io
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref15">
                <span className={styles.refNum}>15</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Developers Digest</p>
                  <p className={styles.refTitle}>
                    AWS Kiro Developer Guide: The Spec-Driven IDE That Replaced Amazon Q
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://www.developersdigest.tech/blog/aws-kiro-developer-guide-2026"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    developersdigest.tech
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref16">
                <span className={styles.refNum}>16</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Anthropic Engineering</p>
                  <p className={styles.refTitle}>Claude Code: Best practices for agentic coding</p>
                  <a
                    className={styles.refLink}
                    href="https://www.anthropic.com/engineering/claude-code-best-practices"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    anthropic.com/engineering/claude-code-best-practices
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref17">
                <span className={styles.refNum}>17</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Augment Code</p>
                  <p className={styles.refTitle}>
                    Claude Code for Spec-Driven Development: Capabilities and Limits
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://www.augmentcode.com/guides/claude-code-spec-driven-development"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    augmentcode.com/guides/claude-code-spec-driven-development
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref18">
                <span className={styles.refNum}>18</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Google Developers Blog</p>
                  <p className={styles.refTitle}>
                    Evolving Spec-Driven Development: Conductor Now Supports
                    Antigravity（2026年7月16日）
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://developers.googleblog.com/evolving-spec-driven-development-conductor-now-supports-antigravity/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    developers.googleblog.com
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref19">
                <span className={styles.refNum}>19</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>YouTube</p>
                  <p className={styles.refTitle}>
                    Spec-Driven Development in 2026: What Actually Changed
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://www.youtube.com/watch?v=b6cbxSaa4U4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    youtube.com/watch?v=b6cbxSaa4U4
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref20">
                <span className={styles.refNum}>20</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Alistair Mavin</p>
                  <p className={styles.refTitle}>
                    EARS: Easy Approach to Requirements Syntax（公式ガイド）
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://alistairmavin.com/ears/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    alistairmavin.com/ears
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref21">
                <span className={styles.refNum}>21</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Wikipedia</p>
                  <p className={styles.refTitle}>Easy Approach to Requirements Syntax</p>
                  <a
                    className={styles.refLink}
                    href="https://en.wikipedia.org/wiki/Easy_Approach_to_Requirements_Syntax"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    en.wikipedia.org/wiki/Easy_Approach_to_Requirements_Syntax
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref22">
                <span className={styles.refNum}>22</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Kiro Docs</p>
                  <p className={styles.refTitle}>Specs</p>
                  <a
                    className={styles.refLink}
                    href="https://kiro.dev/docs/specs/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    kiro.dev/docs/specs
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref23">
                <span className={styles.refNum}>23</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>GitHub</p>
                  <p className={styles.refTitle}>spec-kit/spec-driven.md</p>
                  <a
                    className={styles.refLink}
                    href="https://github.com/github/spec-kit/blob/main/spec-driven.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/github/spec-kit/blob/main/spec-driven.md
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref24">
                <span className={styles.refNum}>24</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Spec Kit Documentation</p>
                  <p className={styles.refTitle}>公式サイト</p>
                  <a
                    className={styles.refLink}
                    href="https://github.github.com/spec-kit/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.github.com/spec-kit
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref25">
                <span className={styles.refNum}>25</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Umesh Malik</p>
                  <p className={styles.refTitle}>
                    The $300K Bug That Was Never the AI's Fault — Inside Addy Osmani's Spec
                    Framework
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://umesh-malik.com/blog/spec-driven-development-ai-agents-addy-osmani"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    umesh-malik.com
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref26">
                <span className={styles.refNum}>26</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Addy Osmani</p>
                  <p className={styles.refTitle}>How to write a good spec for AI agents</p>
                  <a
                    className={styles.refLink}
                    href="https://addyosmani.com/blog/good-spec/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    addyosmani.com/blog/good-spec
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref27">
                <span className={styles.refNum}>27</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Roger Wong</p>
                  <p className={styles.refTitle}>
                    How to Write a Good Spec for AI Agents（Addy OsmaniのO'Reilly Radar寄稿の解説）
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://rogerwong.me/2026/02/how-to-write-a-good-spec-for-ai-agents"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    rogerwong.me（原文: oreilly.com/radar）
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref28">
                <span className={styles.refNum}>28</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>DataCamp</p>
                  <p className={styles.refTitle}>
                    Spec-Driven Development with Claude Code: A Guided Tutorial
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://www.datacamp.com/tutorial/spec-driven-development-with-claude-code"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    datacamp.com/tutorial
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref29">
                <span className={styles.refNum}>29</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Build This Now</p>
                  <p className={styles.refTitle}>Spec-Driven Development with Claude Code</p>
                  <a
                    className={styles.refLink}
                    href="https://www.buildthisnow.com/blog/guide/mechanics/spec-driven-development"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    buildthisnow.com
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref30">
                <span className={styles.refNum}>30</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>Wikipedia</p>
                  <p className={styles.refTitle}>Spec-driven development</p>
                  <a
                    className={styles.refLink}
                    href="https://en.wikipedia.org/wiki/Spec-driven_development"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    en.wikipedia.org/wiki/Spec-driven_development
                    <ExternalIcon />
                  </a>
                </div>
              </div>
              <div className={styles.refCard} id="ref31">
                <span className={styles.refNum}>31</span>
                <div className={styles.refBody}>
                  <p className={styles.refSource}>AlphaSignal</p>
                  <p className={styles.refTitle}>
                    Spec-Driven Development is the New Default for AI Coding
                  </p>
                  <a
                    className={styles.refLink}
                    href="https://alphasignalai.substack.com/p/spec-driven-development-is-the-new"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    alphasignalai.substack.com
                    <ExternalIcon />
                  </a>
                </div>
              </div>
            </div>
          </section>
          <p className={styles.footnote}>
            本ガイドのフローチャートはすべてMermaid記法、比較表はすべてMarkdown由来のHTMLテーブルで作成しています（ASCIIアートは使用していません）。
          </p>
        </div>
      </main>
    </div>
  );
}
