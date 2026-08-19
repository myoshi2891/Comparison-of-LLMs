import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "GitHub Copilot Code Review 実践ガイド ― 中級〜上級エンジニアのためのベストプラクティス",
  description:
    "AI駆動のコードレビューをチーム開発に深く組み込む——概念・設定・運用まで中〜上級者向けにステップバイステップで解説",
};

const MERMAID_1 = `flowchart TB
    A["入力処理<br/>PR差分 + タイトル/本文 + カスタム指示を統合"] --> B["言語モデル解析<br/>GPT系 / Claude Opus系 / Gemini系 等を使い分け"]
    B --> C["応答生成<br/>指摘 + severity + 修正提案(自然言語/コード)"]
    C --> D["出力整形<br/>PRのインライン差分コメントとして投稿"]`;
const MERMAID_2 = `flowchart TB
    Start["自動化のレベルを決める"] --> Triage{"どの範囲で有効化する?"}
    Triage -->|"自分のPRだけ"| P["個人設定<br/>Your Copilot > Automatic code review"]
    Triage -->|"1つのリポジトリ"| R["リポジトリRuleset<br/>Automatically request Copilot code review"]
    Triage -->|"組織全体"| O["組織Ruleset<br/>Repository Rulesetsを一括適用"]
    P --> Merge["PR作成/更新時にCopilotが自動レビュー"]
    R --> Merge
    O --> Merge
    Merge --> End["レビューコメントがPRに投稿される"]`;
const MERMAID_3 = `flowchart TB
    A["PR作成 (Draftも可)"] --> B["Copilot code reviewを起動<br/>(自動設定 または 手動Request)"]
    B --> C["レビューコメント生成<br/>severity: High / Medium / Low"]
    C --> D{"開発者が内容を確認"}
    D -->|"妥当な指摘"| E["提案を適用 または 手動修正"]
    D -->|"誤検知/対象外"| F["コメントをResolve"]
    E --> G["人間レビュアーが最終レビュー"]
    F --> G
    G --> H{"Approve?"}
    H -->|"Yes"| I["マージ"]
    H -->|"No / 追加修正"| B`;
const MERMAID_4 = `flowchart TB
    L1["レイヤー1: Content Exclusion<br/>機密ファイルをレビュー対象から除外"] --> L2["レイヤー2: Firewall<br/>Copilotのネットワークアクセスを制御"]
    L2 --> L3["レイヤー3: MCP read-only制約<br/>ツール呼び出しを読み取り専用に限定"]
    L3 --> L4["レイヤー4: CODEOWNERS<br/>設定ファイル自体の変更を承認制に"]`;
const MERMAID_5 = `flowchart TB
    P1["フェーズ1: 個人トライアル<br/>数名が手動リクエストで試用"] --> P2["フェーズ2: リポジトリ導入<br/>copilot-instructions.md整備 + 自動レビュー有効化"]
    P2 --> P3["フェーズ3: 組織展開<br/>組織Ruleset・Agent Skills・MCPの標準化"]
    P3 --> P4["フェーズ4: 計測と改善<br/>採用率とfalse positive率をモニタリングし指示を継続改善"]`;

export default function Page() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
      />
      <TocObserver />

      <button type="button" className="sidebar-toggle" id="sidebarToggle" aria-label="目次を開閉">
        ☰
      </button>
      <div className="sidebar-backdrop" id="sidebarBackdrop"></div>

      <div className={styles.layout} data-testid="layout-root">
        <aside className="sidebar" id="copilotCodeReviewSidebar">
          <div className="brand">
            <div className="brand-mark">🧭</div>
            <div className="brand-text">
              <strong>Copilot Code Review</strong>実践ガイド
            </div>
          </div>
          <nav className="toc" aria-label="目次">
            <div className="nav-group-label">はじめに</div>
            <ul>
              <li>
                <a href="#intro" className={styles.active}>
                  <span className="n">00</span>本ガイドについて
                </a>
              </li>
              <li>
                <a href="#overview">
                  <span className="n">01</span>Code Reviewとは何か
                </a>
              </li>
            </ul>
            <div className="nav-group-label">ステップバイステップ</div>
            <ul>
              <li>
                <a href="#step1">
                  <span className="n">02</span>レビューを起動する
                </a>
              </li>
              <li>
                <a href="#step2">
                  <span className="n">03</span>カスタムインストラクション
                </a>
              </li>
              <li>
                <a href="#step3">
                  <span className="n">04</span>Agent SkillsとMCP
                </a>
              </li>
              <li>
                <a href="#step4">
                  <span className="n">05</span>コメントを運用する
                </a>
              </li>
              <li>
                <a href="#step5">
                  <span className="n">06</span>限界と人間レビュー
                </a>
              </li>
              <li>
                <a href="#step6">
                  <span className="n">07</span>セキュリティとガバナンス
                </a>
              </li>
            </ul>
            <div className="nav-group-label">導入・比較</div>
            <ul>
              <li>
                <a href="#comparison">
                  <span className="n">08</span>他ツールとの位置づけ
                </a>
              </li>
              <li>
                <a href="#roadmap">
                  <span className="n">09</span>チーム導入ロードマップ
                </a>
              </li>
              <li>
                <a href="#checklist">
                  <span className="n">10</span>チェックリスト
                </a>
              </li>
              <li>
                <a href="#summary">
                  <span className="n">11</span>まとめ
                </a>
              </li>
            </ul>
            <div className="nav-group-label">出典</div>
            <ul>
              <li>
                <a href="#references">
                  <span className="n">12</span>参考文献・出典
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="main">
          <div className="hero">
            <span className="eyebrow">GitHub Copilot &middot; Code Review</span>
            <h1>
              GitHub Copilot Code Review 実践ガイド
              <br />
              中級〜上級エンジニアのためのベストプラクティス
            </h1>
            <p className="lede prose">
              Pull
              Requestの一次レビューをAIに任せるための、設定・カスタムインストラクション・セキュリティ・チーム運用までをステップバイステップで解説します。
            </p>
            <div className="hero-meta">
              <span>
                <strong>情報基準日:</strong>&nbsp;2026年8月1日
              </span>
              <span>
                <strong>対象読者:</strong>&nbsp;GitHub
                Copilotの基本操作を経験した中級〜上級エンジニア
              </span>
              <span>
                <strong>出典数:</strong>&nbsp;26件(公式ドキュメント・Changelog・実務者記事)
              </span>
            </div>
            <div className="callout">
              本ガイドは2026年8月1日時点の公開情報をもとに作成しています。GitHub Copilot Code
              Reviewは更新頻度が高い機能のため、実際に導入する際は必ず
              <a
                href="https://github.blog/changelog/label/copilot/"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Changelog
              </a>
              で最新の挙動を確認してください。
            </div>
          </div>

          {/* ============ はじめに ============ */}
          <section className="section prose" id="intro">
            <h2 id="intro">はじめに</h2>
            <p>
              GitHub Copilot Code Review(以下Copilot Code Review)は、Pull
              Request(PR)の差分に対してAIが自動でインラインコメントを付ける機能です。2025年前半に一般提供が始まって以降、2026年に入ってからはエージェント的なアーキテクチャへの刷新、Agent
              SkillsやMCP(Model Context
              Protocol)サーバーとの連携、severity(重大度)表示、ネットワークアクセス制御(Firewall)など、短期間で多くの機能が追加されています。
            </p>
            <p>
              本ガイドは、すでにGitHub
              Copilotの基本機能(補完・Chat)を使ったことがある中級〜上級者を対象に、Copilot Code
              Reviewを<strong>チームの開発フローに安全かつ効果的に組み込む</strong>
              ための考え方と手順をステップバイステップで解説します。個々のボタン操作の解説よりも、「何を」「なぜ」設定するのかという設計判断に重点を置いています。
            </p>
          </section>

          {/* ============ Overview ============ */}
          <section className="section prose" id="overview">
            <h2 id="overview">GitHub Copilot Code Reviewとは何か</h2>

            <h3 id="sec-h3-1">何をしてくれるのか</h3>
            <p>
              Copilot Code
              ReviewはPRの差分・タイトル・本文・リポジトリのカスタム指示などをまとめてコンテキストとして与えられたLLMが解析し、行単位のインラインコメントとしてPRに投稿する機能です。解析は静的なものであり、実際にコードを実行したりテストを走らせたりはしません。バグや論理エラー、セキュリティ上の懸念、パフォーマンスの問題、言語・フレームワークのベストプラクティス違反などを検出範囲としています
              <sup className="cite">
                <a href="#ref-1">[1]</a>
              </sup>
              <sup className="cite">
                <a href="#ref-7">[7]</a>
              </sup>
              。
            </p>
            <p>
              レビューを担当するモデルは固定ではなく、GPT系・Claude
              Opus系・Gemini系など複数のモデルを組み合わせて使う設計になっており、レビューごとに使用されるモデルが変わり得る点も押さえておく必要があります
              <sup className="cite">
                <a href="#ref-17">[17]</a>
              </sup>
              。
            </p>
            <p>
              Copilotのレビューは常に「Comment」種別で投稿され、「Approve」や「Request
              changes」にはなりません。したがって、必須レビュー(Required
              reviewers)としてはカウントされず、マージ判定をブロックすることもありません。最終的な承認権限は常に人間のレビュアーに残ります
              <sup className="cite">
                <a href="#ref-2">[2]</a>
              </sup>
              。
            </p>

            <h3 id="sec-h3-2">処理の流れ(アーキテクチャ)</h3>
            <div className="diagram">
              <div className="mermaid-wrapper">
                <MermaidDiagram chart={MERMAID_1} theme="base" />
              </div>
              <p className="diagram-caption">図1. Copilot Code Reviewの内部処理フロー</p>
            </div>

            <p>
              2026年6月には、Copilot
              CLI/SDKに組み込まれているファイル探索ツールをレビュー処理そのものにも使うよう内部実装が刷新され、レビュー品質を維持したままコストが約20%削減されたと報告されています。この変更に合わせて「Medium
              analysis depth」という解析の深さを選べるパブリックプレビューも展開されています
              <sup className="cite">
                <a href="#ref-11">[11]</a>
              </sup>
              。
            </p>

            <h3 id="sec-h3-3">利用できる環境</h3>
            <p>
              Copilot Code ReviewはGitHub.com上のPR画面のほか、Visual Studio(17.14以降)やVS
              Code、CLIなど複数の環境から呼び出せます。GitHub.com上では、PRの「Reviewers」からCopilotを選んで「Request」をクリックするだけで、通常30秒以内にレビューが投稿されます
              <sup className="cite">
                <a href="#ref-2">[2]</a>
              </sup>
              。組織のCopilotライセンスを持たないメンバーでも、管理者が許可していればレビューを受け取れる場合があります
              <sup className="cite">
                <a href="#ref-2">[2]</a>
              </sup>
              。
            </p>
          </section>

          {/* ============ Step 1 ============ */}
          <section className="section prose" id="step1">
            <span className="step-badge">STEP 1</span>
            <h2 id="step1">レビューを起動する</h2>
            <p>
              Copilotにレビューを依頼する方法は「都度手動でリクエストする」か「自動化する」かの二択です。チームで運用するなら、早い段階で自動化の範囲を決めておくことをおすすめします。
            </p>

            <div className="diagram">
              <div className="mermaid-wrapper">
                <MermaidDiagram chart={MERMAID_2} theme="base" />
              </div>
              <p className="diagram-caption">図2. 自動レビューを有効化するまでの意思決定フロー</p>
            </div>

            <ul>
              <li>
                <strong>個人設定</strong>: プロフィールの「Your Copilot」から「Automatic code
                review」を有効化すると、自分が開いたすべてのPRが自動レビュー対象になります。この設定はCopilot
                Pro / Pro+ / Maxプランでのみ利用できます
                <sup className="cite">
                  <a href="#ref-5">[5]</a>
                </sup>
                。
              </li>
              <li>
                <strong>リポジトリRuleset</strong>: リポジトリのSettings &gt; Rules &gt;
                Rulesetsで「Automatically request Copilot code review」を有効化します。「Review new
                pushes」を有効にすると新しいコミットのたびに再レビューされ、「Review draft pull
                requests」を有効にするとドラフトPRの段階からフィードバックを得られます
                <sup className="cite">
                  <a href="#ref-5">[5]</a>
                </sup>
                。2025年9月からは、この自動レビュー設定が「Require a pull request before
                merging」の付随設定ではなく、独立したルールとして設定できるようになったため、マージ保護(ブランチ保護)を強制せずに自動レビューだけを導入することも可能です
                <sup className="cite">
                  <a href="#ref-14">[14]</a>
                </sup>
                。
              </li>
              <li>
                <strong>組織/Enterpriseレベル</strong>: Enterprise管理者は「AI controls」からCopilot
                Code Reviewを「Enabled everywhere」または「Let organizations
                decide」として一括制御でき、組織Rulesetsを使えば多数のリポジトリに同じ自動レビュー方針を適用できます
                <sup className="cite">
                  <a href="#ref-6">[6]</a>
                </sup>
                。ただし、Push毎・ドラフト時のレビューを有効にするほど開発者への通知は増えるため、ノイズとのバランスを意識する必要があります
                <sup className="cite">
                  <a href="#ref-6">[6]</a>
                </sup>
                。
              </li>
            </ul>

            <div className="callout">
              <strong>実務Tips:</strong>
              いきなり組織全体に自動レビューを強制するのではなく、まず1〜2個のリポジトリでPR作成時のみの自動レビューから始め、チームの反応(コメントの採用率・却下率)を見てからPush毎レビューやドラフトレビューを追加する、という段階導入が推奨されます
              <sup className="cite">
                <a href="#ref-3">[3]</a>
              </sup>
              <sup className="cite">
                <a href="#ref-19">[19]</a>
              </sup>
              。
            </div>
          </section>

          {/* ============ Step 2 ============ */}
          <section className="section prose" id="step2">
            <span className="step-badge">STEP 2</span>
            <h2 id="step2">カスタムインストラクションを設計する</h2>
            <p>
              Copilot Code
              Reviewは、そのままでも一般的なコーディング標準に基づいてレビューしますが、真価を発揮するのはリポジトリ固有の文脈(意図的な設計判断、重点的に見てほしい箇所、テストや実装に関するチームの基準など)を教えたときです
              <sup className="cite">
                <a href="#ref-25">[25]</a>
              </sup>
              。
            </p>

            <h3 id="sec-h3-4">3種類の指示ファイル</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ファイル</th>
                    <th>適用範囲</th>
                    <th>主な用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="mono">.github/copilot-instructions.md</td>
                    <td>リポジトリ全体</td>
                    <td>
                      コーディング規約・レビュー観点・組織横断の期待値など、常に考慮してほしい内容
                    </td>
                  </tr>
                  <tr>
                    <td className="mono">
                      .github/instructions/*.instructions.md
                      <br />(<code>applyTo</code>フロントマター付き)
                    </td>
                    <td>指定したパス/言語のみ</td>
                    <td>
                      特定言語・特定ディレクトリだけに適用したいルール(例:
                      フロントエンドのアクセシビリティ、Pythonの型ヒント等)
                    </td>
                  </tr>
                  <tr>
                    <td className="mono">AGENTS.md</td>
                    <td>リポジトリ全体</td>
                    <td>
                      プロジェクトの構造や「意図的にこうなっている」文脈など、レビュー品質を上げるための背景情報
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              さらに、2026年に入ってからは<code>REVIEW.md</code>・<code>GEMINI.md</code>・
              <code>CLAUDE.md</code>
              といった他のAIツール向けの指示ファイルも自動的に読み込まれるようになり、チームがどこにガイドラインを書いていても一貫して反映されるようになりました
              <sup className="cite">
                <a href="#ref-10">[10]</a>
              </sup>
              。以前はCopilot Enterprise向けに「Coding
              guidelines」というUIベースの別機能がプライベートプレビューで提供されていましたが、この
              <code>*.instructions.md</code>ベースの仕組みに統合される形で段階的に廃止されています
              <sup className="cite">
                <a href="#ref-15">[15]</a>
              </sup>
              。
            </p>

            <h4 id="sec-h4-1">
              <code>*.instructions.md</code>ファイルの例
            </h4>
            <div className="code-block">
              <div className="code-label">
                <span>.github/instructions/frontend.instructions.md</span>
                <span>yaml + markdown</span>
              </div>
              <pre>
                <code
                  data-testid="code-block"
                  className="language-yaml"
                  id="code-instructions"
                ></code>
              </pre>
            </div>

            <p>
              特定のファイルをCopilot code reviewだけ、あるいはCopilot cloud
              agentだけに読ませたくない場合は、フロントマターに
              <code>excludeAgent: code-review</code>または<code>excludeAgent: cloud-agent</code>
              を指定することで、そのファイルを対象エージェントから除外できます
              <sup className="cite">
                <a href="#ref-31">[31]</a>
              </sup>
              。
            </p>

            <h3 id="sec-h3-5">指示ファイルをどこに書くか判断する</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>目的</th>
                    <th>使うファイル</th>
                    <th>備考</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>リポジトリ全体で常に守ってほしい規約を書きたい</td>
                    <td className="mono">copilot-instructions.md</td>
                    <td>最初に書くべき基本ファイル</td>
                  </tr>
                  <tr>
                    <td>特定言語・特定ディレクトリだけにルールを絞りたい</td>
                    <td className="mono">*.instructions.md + applyTo</td>
                    <td>言語ごとのルールを copilot-instructions.md から移すと精度が上がる</td>
                  </tr>
                  <tr>
                    <td>Copilot code reviewとcloud agentで挙動を変えたい</td>
                    <td className="mono">excludeAgent フロントマター</td>
                    <td>片方のエージェントにだけ読ませたい指示に使う</td>
                  </tr>
                  <tr>
                    <td>チーム独自のツールや社内標準を反映したい</td>
                    <td className="mono">.github/skills/配下のSKILL.md</td>
                    <td>
                      レビュー専用にするなら code-review のようなレビュー用途とわかる名前にする
                    </td>
                  </tr>
                  <tr>
                    <td>外部システム(課題管理・ドキュメント等)の情報を参照したい</td>
                    <td>リポジトリのMCPサーバー設定</td>
                    <td>ツール呼び出しは読み取り専用に限定される</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 id="sec-h3-6">効果的な書き方</h3>
            <p>
              GitHub自身が公開しているガイドによれば、Copilot Code
              Reviewの指示ファイルは非決定的(non-deterministic)であり、すべての指示に毎回100%従うわけではありません。そのため、以下のような書き方が推奨されています
              <sup className="cite">
                <a href="#ref-3">[3]</a>
              </sup>
              <sup className="cite">
                <a href="#ref-16">[16]</a>
              </sup>
              。
            </p>
            <ul>
              <li>最小限の指示から始め、実際のレビュー結果を見ながら段階的に追加する。</li>
              <li>見出しと箇条書きで構造化し、長い説明文ではなく短い命令形の指示にする。</li>
              <li>
                1つの指示ファイルはおよそ1,000行を超えないようにする。それ以上長くなると、指示の遵守精度が落ちる傾向がある
                <sup className="cite">
                  <a href="#ref-3">[3]</a>
                </sup>
                。
              </li>
              <li>
                抽象的な指示より、具体例を添えた指示のほうが伝わりやすい(例:「良いコードを書いて」ではなく「この関数のように早期returnでネストを浅くして」)。
              </li>
              <li>
                どうしても100%守らせたいルール(セキュリティの必須要件など)は、Copilotへの指示だけに頼らず、Linterや静的解析ツールなど決定的な仕組みでも担保する
                <sup className="cite">
                  <a href="#ref-19">[19]</a>
                </sup>
                。
              </li>
            </ul>
            <p>
              2026年6月には、<code>copilot-instructions.md</code>・<code>*.instructions.md</code>
              の合計文字数に課されていた4,000文字の上限が撤廃され、より柔軟にカスタマイズできるようになりました
              <sup className="cite">
                <a href="#ref-13">[13]</a>
              </sup>
              。また、組織レベルの指示もCopilot Code Reviewが考慮するようになっています
              <sup className="cite">
                <a href="#ref-15">[15]</a>
              </sup>
              。
            </p>
          </section>

          {/* ============ Step 3 ============ */}
          <section className="section prose" id="step3">
            <span className="step-badge">STEP 3</span>
            <h2 id="step3">Agent SkillsとMCPで文脈を拡張する</h2>
            <p>
              2026年7月29日、Copilot Code ReviewにおけるAgent SkillsとMCPサーバー連携が、Copilot
              Pro・Pro+・Business・Enterpriseの全有償プランで一般提供(GA)になりました
              <sup className="cite">
                <a href="#ref-9">[9]</a>
              </sup>
              。これはMCPの2026-07-28版仕様が正式リリースされた翌日というタイミングでもあり、MCP対応が「アーリーアダプター向けの機能」から「プラン選定時のチェック項目」へと位置づけを変えた出来事として注目されています
              <sup className="cite">
                <a href="#ref-14">[14]</a>
              </sup>
              。
            </p>

            <div className="grid">
              <div className="card">
                <span className="tag">Agent Skills</span>
                <h4 id="sec-h4-2">.github/skills/配下のSKILL.md</h4>
                <p>
                  社内ツールやコーディング標準に関する文脈をレビュー時に注入。レビュー用途であることが伝わるよう、ディレクトリ名は
                  <code>code-review</code> のようにレビュー指向の名前にすることが推奨されています
                  <sup className="cite">
                    <a href="#ref-12">[12]</a>
                  </sup>
                  。
                </p>
              </div>
              <div className="card">
                <span className="tag">MCPサーバー</span>
                <h4 id="sec-h4-3">読み取り専用の外部連携</h4>
                <p>
                  課題管理・ドキュメント・サービスカタログ等の情報をレビューに取り込む。GitHub
                  MCPサーバーとPlaywright
                  MCPサーバーはデフォルトで有効。全ツール呼び出しは読み取り専用に制限
                  <sup className="cite">
                    <a href="#ref-9">[9]</a>
                  </sup>
                  <sup className="cite">
                    <a href="#ref-12">[12]</a>
                  </sup>
                  。
                </p>
              </div>
              <div className="card">
                <span className="tag">可視化</span>
                <h4 id="sec-h4-4">アトリビューション表示</h4>
                <p>
                  Agent
                  SkillsやMCPの文脈を使って生成されたコメントには利用元が明示され、セッションログからどのツールが呼ばれたか確認できます
                  <sup className="cite">
                    <a href="#ref-9">[9]</a>
                  </sup>
                  <sup className="cite">
                    <a href="#ref-12">[12]</a>
                  </sup>
                  。
                </p>
              </div>
            </div>

            <p>
              PR本文に課題番号やインシデントIDなどMCP経由で参照できる識別子を明記すると、Copilotがその文脈をより積極的に利用する傾向があります
              <sup className="cite">
                <a href="#ref-12">[12]</a>
              </sup>
              。対応言語の壁を越えたい場合、Web検索ツールを備えたMCPサーバーやPlaywright経由で最新のセキュリティ勧告・イディオムを調べさせる
              <code>.agent.md</code>
              レビュアーを自作し、根拠となる情報源を引用させるという応用例も紹介されています
              <sup className="cite">
                <a href="#ref-18">[18]</a>
              </sup>
              。
            </p>
          </section>

          {/* ============ Step 4 ============ */}
          <section className="section prose" id="step4">
            <span className="step-badge">STEP 4</span>
            <h2 id="step4">レビューコメントを運用する</h2>

            <h3 id="sec-h3-7">コメントの構造</h3>
            <p>
              Copilotのレビューコメントは通常、問題点の説明・重大度・(可能な場合は)ワンクリックで適用できる修正提案という構成になっています
              <sup className="cite">
                <a href="#ref-6">[6]</a>
              </sup>
              。2026年5月には、似た指摘をまとめてグループ化する機能と、severity(重大度)ラベルがコメントの右上に表示される機能が追加され、大規模PRでもどこから対応すべきか判断しやすくなりました
              <sup className="cite">
                <a href="#ref-7">[7]</a>
              </sup>
              。
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th>目安</th>
                    <th>推奨対応</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="badge high">High</span>
                    </td>
                    <td>
                      バグ・セキュリティ上の懸念など、放置するとインシデントにつながりうる指摘
                    </td>
                    <td>マージ前に必ず精査し、対応または明示的な却下理由を残す</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="badge medium">Medium</span>
                    </td>
                    <td>保守性・パフォーマンスなど、後々の負債になりうる指摘</td>
                    <td>可能な範囲で対応し、対応しない場合はコメントで理由を残す</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="badge low">Low</span>
                    </td>
                    <td>スタイルや軽微な改善提案</td>
                    <td>チームの余力に応じて対応。無理に全件消化しようとしない</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 id="sec-h3-8">コメントへの対応フロー</h3>
            <div className="diagram">
              <div className="mermaid-wrapper">
                <MermaidDiagram chart={MERMAID_3} theme="base" />
              </div>
              <p className="diagram-caption">図3. レビューコメントへの標準的な対応フロー</p>
            </div>

            <p>
              Copilotの提案は1件ずつ、あるいは複数まとめて1つのコミットとして適用できます。自分で修正するのではなく、提案の実装ごとCopilot
              cloud agentに任せることも可能です
              <sup className="cite">
                <a href="#ref-6">[6]</a>
              </sup>
              。Copilotのレビューコメントは人間のレビューコメントと同様に、リアクションを付けたり返信したり、Resolve/Hideしたりできますが、Copilotへの返信コメントはCopilot自身には見えず、Copilotから返信が来ることもない点は覚えておく必要があります
              <sup className="cite">
                <a href="#ref-2">[2]</a>
              </sup>
              。
            </p>
          </section>

          {/* ============ Step 5 ============ */}
          <section className="section prose" id="step5">
            <span className="step-badge">STEP 5</span>
            <h2 id="step5">限界を理解し、人間レビューと組み合わせる</h2>
            <p>
              GitHub自身の「Responsible use」ドキュメントは、Copilot Code
              Reviewの既知の弱点として、見逃し(false negative)・誤検知(false
              positive)・不正確な修正提案・学習データに起因するバイアスを明記しており、セキュリティ上のすべての問題を検出できるわけではなく、脆弱性を含むコードを提案する可能性もあるため過信すべきではないとしています
              <sup className="cite">
                <a href="#ref-7">[7]</a>
              </sup>
              。
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>限界</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>誤検知(false positive)</td>
                    <td>
                      実務者の報告では、Copilotのレビューコメントのうちおおよそ15〜25%が誤りか、的外れか、曖昧すぎて役に立たないケースだとされています
                      <sup className="cite">
                        <a href="#ref-17">[17]</a>
                      </sup>
                      。
                    </td>
                  </tr>
                  <tr>
                    <td>見逃し(false negative)</td>
                    <td>
                      権限昇格や設計レベルのセキュリティ上の欠陥など、ファイルをまたぐ文脈が必要な問題を見逃す傾向が指摘されています
                      <sup className="cite">
                        <a href="#ref-18">[18]</a>
                      </sup>
                      。
                    </td>
                  </tr>
                  <tr>
                    <td>対応言語</td>
                    <td>
                      公式にサポートされる出力言語は英語のみです
                      <sup className="cite">
                        <a href="#ref-7">[7]</a>
                      </sup>
                      。日本語での応答は copilot-instructions.md
                      等で明示的に指示できますが、公式サポート対象外である点に注意してください。
                    </td>
                  </tr>
                  <tr>
                    <td>学習しない</td>
                    <td>
                      特定のレビューコメントを繰り返し却下しても、Copilotがその傾向を学習して次回から抑制することはありません。同種の指摘を出し続ける前提でチーム運用を設計する必要があります
                      <sup className="cite">
                        <a href="#ref-17">[17]</a>
                      </sup>
                      。
                    </td>
                  </tr>
                  <tr>
                    <td>静的解析のみ</td>
                    <td>
                      コードを実際に実行したりテストを走らせたりはしないため、実行時にしか顕在化しない問題は検出対象外です
                      <sup className="cite">
                        <a href="#ref-1">[1]</a>
                      </sup>
                      。
                    </td>
                  </tr>
                  <tr>
                    <td>マージをブロックしない</td>
                    <td>
                      「Comment」レビューのみのため、必須承認としてカウントされず、マージの可否は人間の判断に委ねられます
                      <sup className="cite">
                        <a href="#ref-2">[2]</a>
                      </sup>
                      。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              ある分析記事によれば、Copilot Code
              Reviewが実際にフィードバックを返すのはPRレビューの約71%で、フィードバックがある場合の平均コメント数はおよそ5.1件、残り約29%では「特に指摘なし」として静かに終わるとされています。指摘があれば何でも出す方針ではなく、価値がないと判断すればコメントしない設計は、開発者がコメントを読み続けてくれるための工夫だと分析されています
              <sup className="cite">
                <a href="#ref-23">[23]</a>
              </sup>
              。
            </p>

            <h3 id="sec-h3-9">チーム運用上の推奨事項</h3>
            <ul>
              <li>
                <strong>却下してよい文化をつくる:</strong>
                誤検知が一定割合発生する前提に立ち、「Copilotのコメントを却下するのは普通のこと」という規範をチームで共有します
                <sup className="cite">
                  <a href="#ref-17">[17]</a>
                </sup>
                。
              </li>
              <li>
                <strong>PRは小さく保つ:</strong>
                2,000行規模のPRをレビューで救ってくれることは期待せず、人間にとってもAIにとっても妥当な粒度までPRを分割することが、そもそもの前提として推奨されています
                <sup className="cite">
                  <a href="#ref-22">[22]</a>
                </sup>
                。
              </li>
              <li>
                <strong>必須要件はLinter/静的解析で担保する:</strong>
                セキュリティ上絶対に守らせたいルールは、Copilotへの指示だけでなく決定的なツール(SAST、Linter、Secret
                Scanning等)でも二重に担保します
                <sup className="cite">
                  <a href="#ref-17">[17]</a>
                </sup>
                <sup className="cite">
                  <a href="#ref-19">[19]</a>
                </sup>
                。
              </li>
              <li>
                <strong>人間レビューを省略しない:</strong>
                Copilotのレビューは「一次スクリーニング」であり、最終承認・アーキテクチャ判断・ドメイン知識が必要な判断は引き続き人間が担います
                <sup className="cite">
                  <a href="#ref-3">[3]</a>
                </sup>
                <sup className="cite">
                  <a href="#ref-19">[19]</a>
                </sup>
                。
              </li>
            </ul>
          </section>

          {/* ============ Step 6 ============ */}
          <section className="section prose" id="step6">
            <span className="step-badge">STEP 6</span>
            <h2 id="step6">セキュリティとガバナンスを固める</h2>

            <h3 id="sec-h3-10">Content Exclusion(コンテンツ除外)の適用範囲を正しく理解する</h3>
            <p>
              リポジトリ管理者はContent
              Exclusion機能を使って、機密ファイル(認証情報、課金データ、独自アルゴリズム等)をCopilotの補完・Chat・Code
              Reviewの対象から除外できます。除外されたファイルはCopilot Code
              Reviewでもレビュー対象になりません
              <sup className="cite">
                <a href="#ref-8">[8]</a>
              </sup>
              <sup className="cite">
                <a href="#ref-58">[58]</a>
              </sup>
              。
            </p>

            <div className="callout warn">
              <strong>重要な注意点:</strong>
              GitHub公式ドキュメントおよびGitHub社員による解説記事の双方が指摘しているとおり、Content
              ExclusionはCopilot CLI、Copilot cloud agent、およびIDEのAgentモードには適用されません
              <sup className="cite">
                <a href="#ref-8">[8]</a>
              </sup>
              <sup className="cite">
                <a href="#ref-20">[20]</a>
              </sup>
              。これらのエージェント的な機能はツール呼び出しでファイルを直接読み書きできるため、リポジトリレベルの除外設定をすり抜けて除外対象ファイルの内容にアクセスできてしまう可能性があります。Code
              Reviewだけを使っている分には保護されますが、同じリポジトリでCLIやcloud
              agentも使っているチームは、この境界を正しく認識しておく必要があります
              <sup className="cite">
                <a href="#ref-20">[20]</a>
              </sup>
              。
            </div>

            <h3 id="sec-h3-11">Copilot Code Review自体のセキュリティ制御</h3>
            <div className="diagram">
              <div className="mermaid-wrapper">
                <MermaidDiagram chart={MERMAID_4} theme="base" />
              </div>
              <p className="diagram-caption">図4. Copilot Code Reviewにおける多層防御</p>
            </div>

            <ul>
              <li>
                <strong>Firewall:</strong> 2026年7月17日のアップデートで、Copilot Code
                Review用のネットワークアクセス制御(Firewall)がCopilot cloud
                agentとは独立して設定できるようになりました。デフォルトで全リポジトリに対して有効です。セルフホストランナーでは現時点でFirewallがサポートされていない点に注意してください
                <sup className="cite">
                  <a href="#ref-10">[10]</a>
                </sup>
                。
              </li>
              <li>
                <strong>MCP read-only制約:</strong> 前述のとおり、Code
                ReviewからのMCPツール呼び出しは読み取り専用に限定されています
                <sup className="cite">
                  <a href="#ref-9">[9]</a>
                </sup>
                。
              </li>
              <li>
                <strong>CODEOWNERS:</strong>
                <code>copilot-instructions.md</code>・<code>*.instructions.md</code>・
                <code>.github/skills/</code>
                ・MCP設定など、レビューの挙動を左右する設定ファイル自体を誰が変更できるかも重要なガバナンス項目です。これらのパスにCODEOWNERSを設定し、変更に承認を必須にすることを推奨します(GitHub社員のブログで紹介されているエージェント一般向けの多層防御の考え方を、Code
                Review用の設定ファイル保護にも応用したものです)
                <sup className="cite">
                  <a href="#ref-20">[20]</a>
                </sup>
                。
              </li>
              <li>
                <strong>カスタム実行環境:</strong>
                <code>.github/workflows/copilot-code-review.yml</code>
                を使うと、依存関係のインストールやツールのセットアップなど、Copilot Code
                Reviewの実行環境自体をリポジトリ単位で設定できます。ランナーの種類も組織のCopilot設定から独立して構成可能です
                <sup className="cite">
                  <a href="#ref-10">[10]</a>
                </sup>
                <sup className="cite">
                  <a href="#ref-9">[9]</a>
                </sup>
                。
              </li>
            </ul>

            <h3 id="sec-h3-12">エンタープライズでの一括ガバナンス</h3>
            <p>
              Enterprise管理者は「AI controls」からCopilot Code
              Reviewを機能単位で有効/無効化でき、自動レビューを組織横断で強制することも、各組織の裁量に委ねることもできます。標準を一貫させたい場合は自動レビューポリシーを有効にしますが、Push毎・ドラフト時のレビューを増やすほど開発者に届く通知も増える点はトレードオフとして意識してください
              <sup className="cite">
                <a href="#ref-6">[6]</a>
              </sup>
              。
            </p>
          </section>

          {/* ============ Comparison ============ */}
          <section className="section prose" id="comparison">
            <h2 id="comparison">他のAIコードレビューツールとの位置づけ</h2>
            <p>
              Copilot Code
              Reviewは「GitHubエコシステムに完全統合されたゼロフリクションな選択肢」として評価される一方、専業のAIコードレビューツールと比較すると精度や機能面で見劣りするという評価も複数の比較記事で共通しています。
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>GitHub Copilot Code Review</th>
                    <th>専業レビューツール(CodeRabbit等)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>導入のしやすさ</td>
                    <td>
                      Copilotを契約していればレビュー機能も含まれており追加費用なしで開始可能
                      <sup className="cite">
                        <a href="#ref-21">[21]</a>
                      </sup>
                    </td>
                    <td>別途契約・別料金が必要</td>
                  </tr>
                  <tr>
                    <td>対応プラットフォーム</td>
                    <td>
                      GitHubのみ
                      <sup className="cite">
                        <a href="#ref-21">[21]</a>
                      </sup>
                    </td>
                    <td>
                      GitLab・Bitbucket・Azure DevOps等、複数プラットフォームに対応する製品もある
                      <sup className="cite">
                        <a href="#ref-21">[21]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>精度傾向</td>
                    <td>
                      ある独立ベンチマークでは適合率(precision)がやや高く、再現率(recall)は低めと報告(検出は少ないが誤りも少ない)
                      <sup className="cite">
                        <a href="#ref-21">[21]</a>
                      </sup>
                    </td>
                    <td>
                      同ベンチマークでは再現率が高めで、より多くの問題を検出する一方、誤検知もやや増える傾向
                      <sup className="cite">
                        <a href="#ref-21">[21]</a>
                      </sup>
                    </td>
                  </tr>
                  <tr>
                    <td>カスタマイズ性</td>
                    <td>copilot-instructions.md 等による指示のカスタマイズが可能</td>
                    <td>
                      学習型のフィルタリングなど、より高度なノイズ抑制機構を持つ製品もある
                      <sup className="cite">
                        <a href="#ref-24">[24]</a>
                      </sup>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              2026年2月には、DeepMind・Anthropic・Metaの研究者が設立した研究機関Martianが、レビューツールを販売する立場にない独立機関として初めてAIコードレビューエージェントのベンチマークを公開し、ベンダー自身が「自社が勝つベンチマーク」を発表し合う状況に一石を投じたと報じられています
              <sup className="cite">
                <a href="#ref-21">[21]</a>
              </sup>
              。
            </p>

            <div className="callout">
              <strong>実務上の指針:</strong>
              すでにGitHubとCopilotのエコシステムにいるチームは、まずCopilot Code
              Reviewを標準の一次レビューとして導入し、自分たちのコードベースで十分な検出力があるかを評価したうえで、ギャップが許容できない場合に専業ツールを追加するという段階的なアプローチが多くの比較記事で共通して推奨されています
              <sup className="cite">
                <a href="#ref-1">[1]</a>
              </sup>
              <sup className="cite">
                <a href="#ref-21">[21]</a>
              </sup>
              。
            </div>
          </section>

          {/* ============ Roadmap ============ */}
          <section className="section prose" id="roadmap">
            <h2 id="roadmap">チーム導入ロードマップ</h2>

            <div className="diagram">
              <div className="mermaid-wrapper">
                <MermaidDiagram chart={MERMAID_5} theme="base" />
              </div>
              <p className="diagram-caption">図5. 段階的な導入ロードマップ</p>
            </div>

            <div className="grid">
              <div className="card">
                <span className="tag">Phase 1</span>
                <h4 id="sec-h4-5">個人トライアル</h4>
                <p>
                  数名の開発者が手動でレビューをリクエストし、指摘の質・自分たちのコードベースとの相性を確認します。
                </p>
              </div>
              <div className="card">
                <span className="tag">Phase 2</span>
                <h4 id="sec-h4-6">リポジトリ導入</h4>
                <p>
                  <code>copilot-instructions.md</code>
                  を最小構成で用意し、PR作成時のみの自動レビューを有効化します。過剰な指示を書かず、実際のレビュー結果を見ながら反復的に育てます
                  <sup className="cite">
                    <a href="#ref-3">[3]</a>
                  </sup>
                  。
                </p>
              </div>
              <div className="card">
                <span className="tag">Phase 3</span>
                <h4 id="sec-h4-7">組織展開</h4>
                <p>
                  複数リポジトリに展開する段階で、Agent SkillsやMCPサーバー、Firewall・Content
                  Exclusion・CODEOWNERSといったガバナンス設定を標準化します。
                </p>
              </div>
              <div className="card">
                <span className="tag">Phase 4</span>
                <h4 id="sec-h4-8">計測と改善</h4>
                <p>
                  コメントの採用率・却下率、レビューにかかる時間、誤検知の傾向などを定期的にモニタリングし、指示ファイルを継続的にチューニングします
                  <sup className="cite">
                    <a href="#ref-3">[3]</a>
                  </sup>
                  <sup className="cite">
                    <a href="#ref-19">[19]</a>
                  </sup>
                  。
                </p>
              </div>
            </div>
          </section>

          {/* ============ Checklist ============ */}
          <section className="section prose" id="checklist">
            <div className="checklist-header">
              <h2 id="checklist">納品前・運用開始前チェックリスト</h2>
              <div className="checklist-controls">
                <span className="checklist-progress" id="checklistProgress">
                  0 / 12 完了
                </span>
                <button type="button" className="checklist-reset" id="checklistReset">
                  リセット
                </button>
              </div>
            </div>
            <p className="checklist-hint">
              チェック状態はこのブラウザに自動保存されます(他の人には共有されません)。
            </p>
            <ul className="checklist" id="checklistList">
              <li className="check-item">
                <label>
                  <span className="check-box-wrap">
                    <input type="checkbox" className="check-input" data-key="chk-01" />
                    <span className="check-box" aria-hidden="true"></span>
                  </span>
                  <span className="check-text">
                    <code>copilot-instructions.md</code>
                    はリポジトリ全体の規約に絞り、言語・パス固有のルールは
                    <code>*.instructions.md</code>へ分離した
                  </span>
                </label>
              </li>
              <li className="check-item">
                <label>
                  <span className="check-box-wrap">
                    <input type="checkbox" className="check-input" data-key="chk-02" />
                    <span className="check-box" aria-hidden="true"></span>
                  </span>
                  <span className="check-text">
                    各指示ファイルはおよそ1,000行以内に収まっている
                  </span>
                </label>
              </li>
              <li className="check-item">
                <label>
                  <span className="check-box-wrap">
                    <input type="checkbox" className="check-input" data-key="chk-03" />
                    <span className="check-box" aria-hidden="true"></span>
                  </span>
                  <span className="check-text">
                    レビュー専用のAgent Skillには<code>code-review</code>
                    のようなレビュー用途とわかる名前を付けた
                  </span>
                </label>
              </li>
              <li className="check-item">
                <label>
                  <span className="check-box-wrap">
                    <input type="checkbox" className="check-input" data-key="chk-04" />
                    <span className="check-box" aria-hidden="true"></span>
                  </span>
                  <span className="check-text">
                    MCPサーバー連携が必要な場合、「Allow Copilot to use MCP tools when reviewing
                    pull requests」の設定を確認した
                  </span>
                </label>
              </li>
              <li className="check-item">
                <label>
                  <span className="check-box-wrap">
                    <input type="checkbox" className="check-input" data-key="chk-05" />
                    <span className="check-box" aria-hidden="true"></span>
                  </span>
                  <span className="check-text">
                    自動レビューの範囲(個人/リポジトリ/組織)と、Push毎・ドラフト時レビューの要否を決定した
                  </span>
                </label>
              </li>
              <li className="check-item">
                <label>
                  <span className="check-box-wrap">
                    <input type="checkbox" className="check-input" data-key="chk-06" />
                    <span className="check-box" aria-hidden="true"></span>
                  </span>
                  <span className="check-text">
                    機密ファイルにContent Exclusionを設定し、かつそれがCLI/cloud
                    agent/Agentモードには適用されないことをチームに周知した
                  </span>
                </label>
              </li>
              <li className="check-item">
                <label>
                  <span className="check-box-wrap">
                    <input type="checkbox" className="check-input" data-key="chk-07" />
                    <span className="check-box" aria-hidden="true"></span>
                  </span>
                  <span className="check-text">
                    Firewall(ネットワークアクセス制御)が意図した設定になっていることを確認した
                  </span>
                </label>
              </li>
              <li className="check-item">
                <label>
                  <span className="check-box-wrap">
                    <input type="checkbox" className="check-input" data-key="chk-08" />
                    <span className="check-box" aria-hidden="true"></span>
                  </span>
                  <span className="check-text">
                    <code>copilot-instructions.md</code>・<code>.github/skills/</code>
                    ・MCP設定にCODEOWNERSを設定し、無断変更を防いだ
                  </span>
                </label>
              </li>
              <li className="check-item">
                <label>
                  <span className="check-box-wrap">
                    <input type="checkbox" className="check-input" data-key="chk-09" />
                    <span className="check-box" aria-hidden="true"></span>
                  </span>
                  <span className="check-text">
                    「Copilotのコメントを却下してよい」というチーム規範を共有した
                  </span>
                </label>
              </li>
              <li className="check-item">
                <label>
                  <span className="check-box-wrap">
                    <input type="checkbox" className="check-input" data-key="chk-10" />
                    <span className="check-box" aria-hidden="true"></span>
                  </span>
                  <span className="check-text">
                    セキュリティ上の必須要件はLinter/SAST等の決定的なツールでも別途担保した
                  </span>
                </label>
              </li>
              <li className="check-item">
                <label>
                  <span className="check-box-wrap">
                    <input type="checkbox" className="check-input" data-key="chk-11" />
                    <span className="check-box" aria-hidden="true"></span>
                  </span>
                  <span className="check-text">
                    Copilotのレビューは「Comment」のみでマージをブロックしないことをチームに周知した
                  </span>
                </label>
              </li>
              <li className="check-item">
                <label>
                  <span className="check-box-wrap">
                    <input type="checkbox" className="check-input" data-key="chk-12" />
                    <span className="check-box" aria-hidden="true"></span>
                  </span>
                  <span className="check-text">
                    導入後の効果測定(採用率・却下率・レビュー時間)の方法を決めた
                  </span>
                </label>
              </li>
            </ul>
          </section>

          {/* ============ Summary ============ */}
          <section className="section prose" id="summary">
            <h2 id="summary">まとめ</h2>
            <p>
              GitHub Copilot Code
              Reviewは、GitHubのPRワークフローに深く統合された「一次レビュアー」として、明白なミスの早期発見や人間レビュアーの負荷軽減に貢献するツールです。ただし、誤検知や見逃しが一定割合存在すること、学習しないこと、静的解析にとどまることなど、既知の限界を理解したうえで、カスタムインストラクション・Agent
              Skills・MCP・セキュリティ設定を丁寧に設計し、人間レビューと役割分担することが、実務で成果を出すための鍵になります。
            </p>
          </section>

          {/* ============ References ============ */}
          <section className="section prose" id="references">
            <h2 id="references">参考文献・出典</h2>

            <div className="ref-group">
              <div className="ref-group-head">
                <h3 id="sec-h3-13">公式ドキュメント(GitHub Docs)</h3>
                <span className="ref-group-count">9件</span>
              </div>
              <div className="ref-grid">
                <a
                  href="https://docs.github.com/en/copilot/get-started/best-practices"
                  className="ref-card"
                  id="ref-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">01</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">Best practices for using GitHub Copilot</span>
                    <span className="ref-card-url">
                      docs.github.com/en/copilot/get-started/best-practices
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review"
                  className="ref-card"
                  id="ref-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">02</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">Using GitHub Copilot code review</span>
                    <span className="ref-card-url">
                      docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://docs.github.com/en/copilot/tutorials/customize-code-review"
                  className="ref-card"
                  id="ref-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">03</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Using custom instructions to unlock the power of Copilot code review
                    </span>
                    <span className="ref-card-url">
                      docs.github.com/en/copilot/tutorials/customize-code-review
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-automatic-review"
                  className="ref-card"
                  id="ref-5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">05</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Configuring automatic code review by GitHub Copilot
                    </span>
                    <span className="ref-card-url">
                      docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-automatic-review
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-code-review"
                  className="ref-card"
                  id="ref-6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">06</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Enabling GitHub Copilot code review in your enterprise
                    </span>
                    <span className="ref-card-url">
                      docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-code-review
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://docs.github.com/copilot/responsible-use-of-github-copilot-features/responsible-use-of-github-copilot-code-review"
                  className="ref-card"
                  id="ref-7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">07</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Responsible use of GitHub Copilot code review
                    </span>
                    <span className="ref-card-url">
                      docs.github.com/copilot/responsible-use-of-github-copilot-features/responsible-use-of-github-copilot-code-review
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot"
                  className="ref-card"
                  id="ref-8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">08</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">Excluding content from GitHub Copilot</span>
                    <span className="ref-card-url">
                      docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions"
                  className="ref-card"
                  id="ref-31"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">31</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Adding custom instructions for GitHub Copilot CLI(excludeAgent)
                    </span>
                    <span className="ref-card-url">
                      docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://docs.github.com/zh/enterprise-cloud@latest/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-github-copilot-features-in-your-organization/testing-changes-to-content-exclusions-in-your-ide"
                  className="ref-card"
                  id="ref-58"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">58</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      About content exclusion for Copilot(コードレビューへの適用範囲)
                    </span>
                    <span className="ref-card-url">
                      docs.github.com/.../testing-changes-to-content-exclusions-in-your-ide
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
              </div>
            </div>

            <div className="ref-group">
              <div className="ref-group-head">
                <h3 id="sec-h3-14">公式ブログ・Changelog(GitHub Blog)</h3>
                <span className="ref-group-count">8件</span>
              </div>
              <div className="ref-grid">
                <a
                  href="https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/"
                  className="ref-card"
                  id="ref-9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">09</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Copilot code review: Agent skills and MCP now generally available
                    </span>
                    <span className="ref-card-date">2026年7月29日</span>
                    <span className="ref-card-url">
                      github.blog/changelog/.../agent-skills-and-mcp-now-generally-available
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://github.blog/changelog/2026-07-17-copilot-code-review-customization-and-configurability-improvements/"
                  className="ref-card"
                  id="ref-10"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">10</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Copilot code review: Customization and configurability improvements
                    </span>
                    <span className="ref-card-date">2026年7月17日</span>
                    <span className="ref-card-url">
                      github.blog/changelog/.../customization-and-configurability-improvements
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://github.blog/changelog/2026-06-25-copilot-code-review-analysis-depth-and-efficiency-updates/"
                  className="ref-card"
                  id="ref-11"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">11</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Copilot code review: Analysis depth and efficiency updates
                    </span>
                    <span className="ref-card-date">2026年6月25日</span>
                    <span className="ref-card-url">
                      github.blog/changelog/.../analysis-depth-and-efficiency-updates
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review"
                  className="ref-card"
                  id="ref-12"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">12</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Using GitHub Copilot code review(Agent Skills / MCP設定詳細)
                    </span>
                    <span className="ref-card-url">
                      docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://github.blog/changelog/2026-06-12-copilot-code-review-new-configurations-and-controls/"
                  className="ref-card"
                  id="ref-13"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">13</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Copilot code review: New configurations and controls
                    </span>
                    <span className="ref-card-date">2026年6月12日</span>
                    <span className="ref-card-url">
                      github.blog/changelog/.../new-configurations-and-controls
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://www.digitalapplied.com/blog/mcp-adoption-week-copilot-code-review-ga"
                  className="ref-card"
                  id="ref-14"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">14</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      MCP Adoption Week: Copilot Code Review Goes GA
                    </span>
                    <span className="ref-card-date">2026年7月</span>
                    <span className="ref-card-url">
                      digitalapplied.com/blog/mcp-adoption-week-copilot-code-review-ga
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://github.blog/changelog/2025-09-03-copilot-code-review-path-scoped-custom-instruction-file-support/"
                  className="ref-card"
                  id="ref-15"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">15</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Copilot code review: Path-scoped custom instruction file support
                    </span>
                    <span className="ref-card-date">2025年9月3日</span>
                    <span className="ref-card-url">
                      github.blog/changelog/.../path-scoped-custom-instruction-file-support
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://github.blog/ai-and-ml/github-copilot/unlocking-the-full-power-of-copilot-code-review-master-your-instructions-files/"
                  className="ref-card"
                  id="ref-16"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">16</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Unlocking the full power of Copilot code review: Master your instructions
                      files
                    </span>
                    <span className="ref-card-date">2026年4月17日</span>
                    <span className="ref-card-url">
                      github.blog/ai-and-ml/.../master-your-instructions-files
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
              </div>
            </div>

            <div className="ref-group">
              <div className="ref-group-head">
                <h3 id="sec-h3-15">コミュニティ・実務者による記事</h3>
                <span className="ref-group-count">9件</span>
              </div>
              <p
                className="prose"
                style={{
                  margin: "-0.2rem 0 0.2rem",
                  color: "var(--text-faint)",
                  fontSize: "0.85rem",
                }}
              >
                著名/国際的な開発者・実務者による分析記事
              </p>
              <div className="ref-grid">
                <a
                  href="https://dev.to/rahulxsingh/github-copilot-code-review-complete-guide-2026-255h"
                  className="ref-card"
                  id="ref-17"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">17</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Rahul Singh, "GitHub Copilot Code Review: Complete Guide (2026)", DEV
                      Community
                    </span>
                    <span className="ref-card-date">2026年4月2日</span>
                    <span className="ref-card-url">
                      dev.to/rahulxsingh/github-copilot-code-review-complete-guide-2026-255h
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://dev.to/pwd9000/mastering-code-reviews-with-github-copilot-the-definitive-guide-3nfp"
                  className="ref-card"
                  id="ref-18"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">18</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      pwd9000, "Mastering Code Reviews with GitHub Copilot: The Definitive Guide",
                      DEV Community
                    </span>
                    <span className="ref-card-date">2026年5月27日</span>
                    <span className="ref-card-url">
                      dev.to/pwd9000/mastering-code-reviews-with-github-copilot-the-definitive-guide-3nfp
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://blog.mrinalmaheshwari.com/github-copilot-code-review-guidelines-best-practices-and-how-to-integrate-it-into-your-pr-b4518073b4c9"
                  className="ref-card"
                  id="ref-19"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">19</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Mrinal Maheshwari, "GitHub Copilot Code Review: Guidelines, Best Practices,
                      and How to Integrate It into Your PR Workflow"
                    </span>
                    <span className="ref-card-date">2026年1月12日</span>
                    <span className="ref-card-url">
                      blog.mrinalmaheshwari.com/.../how-to-integrate-it-into-your-pr
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://blog.cloud-eng.nl/2026/03/13/copilot-content-exclusions-four-layers/"
                  className="ref-card"
                  id="ref-20"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">20</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Anton Sizikov(GitHub社員), "Copilot Content Exclusions: Four Layers of
                      Defense"
                    </span>
                    <span className="ref-card-date">2026年3月13日</span>
                    <span className="ref-card-url">
                      blog.cloud-eng.nl/2026/03/13/copilot-content-exclusions-four-layers
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://codeant.ai/blogs/best-ai-code-review-tools"
                  className="ref-card"
                  id="ref-21"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">21</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      "10 Best AI Code Review Tools in 2026 (Ranked by Independent Benchmark)",
                      CodeAnt AI
                    </span>
                    <span className="ref-card-url">
                      codeant.ai/blogs/best-ai-code-review-tools<span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://refacto.ai/blog/github-copilot-code-review-in-2026-what-it-does-well-and-where-it-falls-short/"
                  className="ref-card"
                  id="ref-22"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">22</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      "GitHub Copilot Code Review in 2026: What It Does and Misses"
                    </span>
                    <span className="ref-card-date">2026年4月10日</span>
                    <span className="ref-card-url">
                      refacto.ai/blog/.../what-it-does-well-and-where-it-falls-short
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://refacto.ai/blog/github-copilot-code-review-in-2026-what-it-does-well-and-where-it-falls-short/"
                  className="ref-card"
                  id="ref-23"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">23</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      同上(GitHubのレビュー実施率・平均コメント数に関する分析部分)
                    </span>
                    <span className="ref-card-url">
                      refacto.ai/blog/.../what-it-does-well-and-where-it-falls-short
                      <span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://www.morphllm.com/comparisons/coderabbit-vs-copilot"
                  className="ref-card"
                  id="ref-24"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">24</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      "CodeRabbit vs GitHub Copilot Code Review (2026): Benchmarks, Pricing,
                      Features"
                    </span>
                    <span className="ref-card-date">2026年3月14日</span>
                    <span className="ref-card-url">
                      morphllm.com/comparisons/coderabbit-vs-copilot<span className="go">↗</span>
                    </span>
                  </span>
                </a>
                <a
                  href="https://simonwillison.net/tags/github-copilot/"
                  className="ref-card"
                  id="ref-25"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ref-card-index">25</span>
                  <span className="ref-card-body">
                    <span className="ref-card-title">
                      Simon Willison, Posts tagged "github-copilot"
                    </span>
                    <span className="ref-card-url">
                      simonwillison.net/tags/github-copilot<span className="go">↗</span>
                    </span>
                  </span>
                </a>
              </div>
            </div>

            <div className="callout">
              <strong>注:</strong>
              上記のうち14・17・18・19・20・21・22・23・24は第三者(比較サイト・個人ブログ)による分析記事であり、数値や評価は執筆時点のものです。導入判断の際は必ず一次情報である公式ドキュメント(1〜13、16、31、58)と最新の
              <a
                href="https://github.blog/changelog/label/copilot/"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Changelog
              </a>
              を優先して確認してください。
            </div>
          </section>

          <footer className="page-footer">
            <p>
              本ページはMermaid.js(バージョン固定CDN配信)とhighlight.jsを用いて描画しています。オフライン環境や社内ネットワークでCDNへのアクセスが制限されている場合、図表・シンタックスハイライトが正しく表示されないことがあります。
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
