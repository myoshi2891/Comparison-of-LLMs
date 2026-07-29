import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Google Antigravity 完全ガイド:仕様駆動開発を支えるエコシステムのベストプラクティス | AI Model Cost Calculator",
  description:
    "Google Antigravity IDE・CLI の設計思想、アーキテクチャ、Rules (GEMINI.md)、Skills (SKILL.md)、Workflows、Artifacts、Permissions、Claude Code との比較まで全解説。",
};

const MERMAID_ECOSYSTEM = `graph TD
    User["👤 開発者"] --> IDE["💻 Antigravity IDE / CLI"]
    subgraph Antigravity Engine
        IDE --> Rules["📜 Rules (GEMINI.md)<br/>常時適用される規約"]
        IDE --> Skills["📦 Skills (SKILL.md)<br/>オンデマンド知識"]
        IDE --> Workflows["🔄 Workflows<br/>自動化スクリプト"]
        IDE --> Artifacts["📄 Artifacts<br/>永続化成果物"]
    end
    Rules --> Execution["⚡ エージェント実行エンジン"]
    Skills --> Execution
    Workflows --> Execution
    Artifacts --> Execution
    Execution --> Output["🚀 コード生成・テスト実行・デプロイ"]`;

const MERMAID_PROGRESSIVE = `graph LR
    Level1["🏷️ Level 1: メタデータ<br/>name + description<br/>常時常駐 (～100 tokens)"] -->|"トリガー条件一致"| Level2["📄 Level 2: SKILL.md 本文<br/>オンデマンド読み込み (<5,000 tokens)"]
    Level2 -->|"参照指示あり"| Level3["📚 Level 3: 付属リソース<br/>scripts / references (オンデマンド)"]`;

const MERMAID_LOOP = `graph TD
    Plan["📋 Plan (計画作成)<br/>implementation_plan.md"] --> UserReview{"👤 ユーザーレビュー"}
    UserReview -->|"承認"| Execute["⚙️ Execute (実装実行)<br/>コード変更・コマンド実行"]
    UserReview -->|"修正指示"| Plan
    Execute --> Verify["✅ Verify (検証)<br/>walkthrough.md / テスト実行"]
    Verify --> Done["🎉 完了"]`;

export default function AntigravityBestPracticesPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div>
            <div className={styles.sidebarBrandTitle}>Google Antigravity 完全ガイド</div>
            <div className={styles.sidebarBrandSub}>仕様駆動開発・エコシステム</div>
          </div>
        </div>

        <div className={styles.navGroupLabel}>目次</div>
        <a href="#sec-scope" className={styles.navLink} data-toc-link>
          対象範囲
        </a>
        <a href="#sec-0" className={styles.navLink} data-toc-link>
          0. 用語集
        </a>
        <a href="#sec-1" className={styles.navLink} data-toc-link>
          1. Antigravity とは
        </a>
        <a href="#sec-2" className={styles.navLink} data-toc-link>
          2. エコシステム全体像
        </a>
        <a href="#sec-3" className={styles.navLink} data-toc-link>
          3. 開発の始め方
        </a>
        <a href="#sec-4" className={styles.navLink} data-toc-link>
          4. Rules (GEMINI.md)
        </a>
        <a href="#sec-5" className={styles.navLink} data-toc-link>
          5. Skills (SKILL.md)
        </a>
        <a href="#sec-6" className={styles.navLink} data-toc-link>
          6. Workflows
        </a>
        <a href="#sec-7" className={styles.navLink} data-toc-link>
          7. Artifacts & Subagents
        </a>
        <a href="#sec-8" className={styles.navLink} data-toc-link>
          8. Permissions
        </a>
        <a href="#sec-9" className={styles.navLink} data-toc-link>
          9. Claude Code 比較
        </a>
        <a href="#sec-10" className={styles.navLink} data-toc-link>
          10. アンチパターン 10選
        </a>
        <a href="#sec-11" className={styles.navLink} data-toc-link>
          11. ベストプラクティス
        </a>
        <a href="#sec-12" className={styles.navLink} data-toc-link>
          12. まとめ
        </a>
        <a href="#sec-13" className={styles.navLink} data-toc-link>
          13. 参考文献・出典
        </a>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerBadge}>Google Antigravity エコシステム</div>
          <h1 className={styles.title}>
            Google Antigravity 完全ガイド:仕様駆動開発を支えるエコシステムのベストプラクティス
          </h1>
          <p className={styles.subtitle}>
            Gemini 3 系列搭載エージェントファースト IDE & CLI の全貌・設計思想・構成要素・実践運用
          </p>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}>🗺️</div>
              <div className={styles.statCardValue}>15</div>
              <div className={styles.statCardLabel}>主要セクション</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}>📊</div>
              <div className={styles.statCardValue}>3図</div>
              <div className={styles.statCardLabel}>Mermaidアーキテクチャ図</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}>⚠️</div>
              <div className={styles.statCardValue}>10選</div>
              <div className={styles.statCardLabel}>アンチパターン解説</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}>🔗</div>
              <div className={styles.statCardValue}>15+</div>
              <div className={styles.statCardLabel}>公式参照ソース</div>
            </div>
          </div>
        </header>

        <section id="sec-scope" className={styles.section}>
          <h2>この記事で扱う範囲</h2>
          <p>
            本ガイドでは、Google Antigravity の概要からエコシステムを構成するコア要素（Rules, Skills, Workflows, Artifacts, Permissions）、ターミナルサンドボックス、Claude Code との比較・共存戦略まで、開発者が押さえるべき全知識を体系的に網羅します。
          </p>
        </section>

        <section id="sec-0" className={styles.section}>
          <h2>0. 用語集(はじめにここだけ読めばOK)</h2>
          <p>
            Antigravity の世界観を短時間で把握するための主要コンセプト用語集です。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>用語</th>
                  <th>概要・役割</th>
                  <th>配置場所・設定ファイル</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Rules</strong></td>
                  <td>プロジェクト全体で常時遵守すべき開発規約・スタイルガイド。</td>
                  <td><code>GEMINI.md</code> / <code>AGENTS.md</code> / <code>~/.gemini/config/AGENTS.md</code></td>
                </tr>
                <tr>
                  <td><strong>Skills</strong></td>
                  <td>特定の作業手順やドメイン知識をまとめたオンデマンドパッケージ。</td>
                  <td><code>.agents/skills/&lt;name&gt;/SKILL.md</code> / <code>~/.gemini/config/skills/</code></td>
                </tr>
                <tr>
                  <td><strong>Workflows</strong></td>
                  <td>特定タスクを自動実行・共有するためのスラッシュコマンドスクリプト。</td>
                  <td><code>.agents/workflows/*.md</code></td>
                </tr>
                <tr>
                  <td><strong>Artifacts</strong></td>
                  <td>エージェントが作成・更新する設計書や計画書などの永続化成果物。</td>
                  <td><code>implementation_plan.md</code>, <code>walkthrough.md</code> 等</td>
                </tr>
                <tr>
                  <td><strong>Permissions</strong></td>
                  <td>ファイル読み書きやターミナルコマンド実行に対するアクセス権限設定。</td>
                  <td><code>Settings → Security → Permissions</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="sec-1" className={styles.section}>
          <h2>1. Google Antigravity とは何か</h2>
          <h3>1.1 誕生の背景</h3>
          <p>
            Google Antigravity は、Gemini 3 系列の高度な推論能力を最大限に引き出し、開発者がAIエージェントと対当にペアプログラミングを行える環境として開発されたエージェントファースト開発プラットフォームです。
          </p>

          <h3>1.2 3つのサーフェス</h3>
          <p>
            Antigravity は以下の3つのインターフェース（サーフェス）を提供します。
          </p>
          <ul>
            <li><strong>Antigravity IDE (VS Code Fork)</strong>: エージェント操作パネルとコードエディタが統合されたビジュアル環境。</li>
            <li><strong>Antigravity CLI</strong>: ターミナルから直接自律型エージェントを実行するコマンドラインツール。</li>
            <li><strong>Browser Subagent</strong>: Webアプリケーションの動作検証や自動UIテストを行うブラウザ操作サブエージェント。</li>
          </ul>

          <h3>1.3 製品ラインナップ</h3>
          <p>
            Google Cloud / Gemini Ecosystem の一環として、個人開発者からエンタープライズ規模までシームレスに拡張可能なライセンスおよびセキュリティモデルを備えています。
          </p>

          <h3>1.4 従来のIDEとの発想の違い</h3>
          <p>
            従来の「人間がコードを書き、AIが補完する」スタイルから、「人間が仕様と制約を与え、エージェントが自律的に計画・実装・検証を実行する」仕様駆動開発（Spec-Driven Development）への根本的なパラダイムシフトを実現しています。
          </p>
        </section>

        <section id="sec-2" className={styles.section}>
          <h2>2. エコシステム全体像</h2>
          <p>
            Antigravity を構成する4大コンポーネント（Rules, Skills, Workflows, Artifacts）と実行エンジンの関係性を図示します。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_ECOSYSTEM} />
          </div>

          <h3>2.1 4コンポーネントの役割比較</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>コンポーネント</th>
                  <th>トリガー</th>
                  <th>トークン消費</th>
                  <th>更新頻度</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Rules</strong></td>
                  <td>常時自動読み込み</td>
                  <td>常駐（中程度）</td>
                  <td>低（リポジトリ固定）</td>
                  <td>プロジェクト共通の命名規約・禁止事項・絶対ルール</td>
                </tr>
                <tr>
                  <td><strong>Skills</strong></td>
                  <td>キーワードマッチ時オンデマンド</td>
                  <td>必要な時のみ（高効率）</td>
                  <td>中（機能追加時）</td>
                  <td>特定フレームワークの移行手順・API構築パターン</td>
                </tr>
                <tr>
                  <td><strong>Workflows</strong></td>
                  <td>スラッシュコマンド呼び出し</td>
                  <td>実行時のみ</td>
                  <td>中（自動化追加時）</td>
                  <td>リファクタリング手順・リリース前チェックリスト</td>
                </tr>
                <tr>
                  <td><strong>Artifacts</strong></td>
                  <td>エージェントの思考プロセス中</td>
                  <td>作成・参照時のみ</td>
                  <td>高（タスク毎）</td>
                  <td>実装計画（Plan）、変更サマリ（Walkthrough）</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="sec-3" className={styles.section}>
          <h2>3. 開発の始め方</h2>
          <h3>3.1 動作環境</h3>
          <p>
            macOS, Linux, Windows (WSL2) 上で動作し、Node.js 18+ や Bun、Python 3.10+ 環境に対応しています。
          </p>

          <h3>3.2 プロジェクト作成の手順</h3>
          <p>
            既存リポジトリのルートに <code>.agents/</code> ディレクトリを作成し、<code>AGENTS.md</code> または <code>GEMINI.md</code> を配置するだけで即座にエージェント対応プロジェクトとなります。
          </p>

          <h3>3.3 エージェント起動モード</h3>
          <ul>
            <li><strong>Planning Mode</strong>: 計画作成・リサーチ専用。コード編集を行わずに <code>implementation_plan.md</code> を生成。</li>
            <li><strong>Execution Mode</strong>: 承認された計画に基づき、コード修正・コマンド実行・テスト検証を実行。</li>
          </ul>

          <h3>3.4 覚えておきたいスラッシュコマンド</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>コマンド</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>/plan</code></td>
                  <td>新しいタスクの実装計画（implementation_plan.md）を作成</td>
                </tr>
                <tr>
                  <td><code>/execute</code></td>
                  <td>承認された実装計画に従ってコード編集を開始</td>
                </tr>
                <tr>
                  <td><code>/clear</code></td>
                  <td>コンテキストウィンドウをリセットしてクリアな状態で会話を開始</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="sec-4" className={styles.section}>
          <h2>4. Rules (GEMINI.md)</h2>
          <h3>4.1 Rules の2階層</h3>
          <p>
            Rules はグローバル設定（<code>~/.gemini/config/AGENTS.md</code>）とプロジェクトローカル設定（<code>.agents/AGENTS.md</code> または <code>GEMINI.md</code>）の2階層で評価されます。
          </p>

          <h3>4.2 Ruleのアクティベーションモード</h3>
          <p>
            ファイルパスパターン指定（glob）やプロンプト条件指定により、特定ファイル編集中にのみルールを発動させることができます。
          </p>

          <h3>4.3 <code>@</code> メンションによるファイル参照</h3>
          <p>
            ルールファイル内で <code>@/path/to/doc.md</code> のように記述することで、関連仕様書を動的にリンク・委譲できます。
          </p>

          <h3>4.4 GEMINI.md サンプル</h3>
          <div className={styles.codeLabel}>GEMINI.md</div>
          <pre className={styles.codeBlock}><code>{`# GEMINI.md - Project Rules

- 常に日本語で応答してください。
- ファイル変更を行った後は必ず \`bun run test\` でテストを実行してください。
- 生の HTML 注入（dangerouslySetInnerHTML）は禁止です。
- リポジトリ全域への自動整形コマンド（例: \`bun run lint:fix\` 引数なし）は禁止です。`}</code></pre>

          <h3>4.5 GEMINI.md ベストプラクティス</h3>
          <p>
            ルールは簡潔かつ明確に記述し、相反する制約を入れないように注意します。
          </p>
        </section>

        <section id="sec-5" className={styles.section}>
          <h2>5. Skills (SKILL.md)</h2>
          <h3>5.1 Skills とは何か</h3>
          <p>
            特定の技術スタックや専門タスク（例: Next.js ページ移行、Mermaid 修正）のノウハウをまとめたオンデマンド読込可能なフォルダ構造です。
          </p>

          <h3>5.2 保存場所</h3>
          <ul>
            <li>プロジェクト固有: <code>.agents/skills/&lt;skill-name&gt;/SKILL.md</code></li>
            <li>グローバル: <code>~/.gemini/config/skills/&lt;skill-name&gt;/SKILL.md</code></li>
          </ul>

          <h3>5.3 SKILL.md の作り方</h3>
          <p>
            <code>SKILL.md</code> に YAML frontmatter（<code>name</code> と <code>description</code>）を記述し、本文に具体的な手順を記述します。
          </p>

          <h3>5.4 フロントマターの必須・任意フィールド</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>フィールド</th>
                  <th>必須/任意</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>name</code></td>
                  <td>任意（Antigravity）/ 必須（Claude）</td>
                  <td>スキル識別子。64文字以内の小文字ハイフンケース。</td>
                </tr>
                <tr>
                  <td><code>description</code></td>
                  <td>必須</td>
                  <td>スキルの概要と発動条件。トリガーキーワードを含める。</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>5.5 Skillフォルダの構造</h3>
          <p>
            <code>SKILL.md</code> の他、<code>scripts/</code>（実行用スクリプト）、<code>references/</code>（詳細リファレンス）を同梱可能です。
          </p>

          <h3>5.6 エージェントの利用フロー(Progressive Disclosure)</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_PROGRESSIVE} />
          </div>

          <h3>5.7 Skills ベストプラクティス</h3>
          <p>
            <code>description</code> は三人称で具体的に書くことが発見精度向上の最重要ポイントです。
          </p>
        </section>

        <section id="sec-6" className={styles.section}>
          <h2>6. Workflows (.agents/workflows/)</h2>
          <h3>6.1 RulesとWorkflowsの違い</h3>
          <p>
            Rules は常時監視される開発制約であり、Workflows は開発者が明示的に起動する定型自動化フローです。
          </p>

          <h3>6.2 作成手順</h3>
          <p>
            <code>.agents/workflows/refactor.md</code> のようにマークダウンファイルを作成します。
          </p>

          <h3>6.3 呼び出し方とチェイン</h3>
          <p>
            チャットパネルで <code>/refactor</code> のようにスラッシュコマンドとして呼び出します。
          </p>

          <h3>6.4 Agentにワークフローを生成させる</h3>
          <p>
            反復的に行う定型作業を発見したら、エージェント自身に Workflow マークダウンを生成させることができます。
          </p>

          <h3>6.5 Workflows ベストプラクティス</h3>
          <p>
            各ステップで実行すべき検証コマンドを明確に記載します。
          </p>
        </section>

        <section id="sec-7" className={styles.section}>
          <h2>7. Artifacts と Subagents</h2>
          <h3>7.1 Artifactsとは何か</h3>
          <p>
            エージェントの思考プロセスや修正結果を視覚的にユーザーへ提示・永続化する専用マークダウン成果物です。
          </p>

          <h3>7.2 Artifactsの4種類</h3>
          <ul>
            <li><code>implementation_plan.md</code>: 実装計画書</li>
            <li><code>walkthrough.md</code>: 完了作業の検証・結果報告</li>
            <li><code>research_notes.md</code>: 調査・分析ノート</li>
            <li><code>scratch/</code>: 一時的デバッグスクリプトやログ</li>
          </ul>

          <h3>7.3 Plan → Execute → Verify のループ</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_LOOP} />
          </div>

          <h3>7.4 Review Policy(レビューポリシー)</h3>
          <p>
            計画書を作成した後は必ずユーザーの明示的承認を得てからコード編集を開始します。
          </p>

          <h3>7.5 ブラウザSubagentとAllowlist</h3>
          <p>
            ブラウザ操作 subagent を用いて、ローカルサーバーの UI 描画やレポジトリの表示崩れを自律検証します。
          </p>

          <h3>7.6 Artifacts ベストプラクティス</h3>
          <p>
            計画書と成果物レポートは常に最新状態に同期させます。
          </p>
        </section>

        <section id="sec-8" className={styles.section}>
          <h2>8. Permissions</h2>
          <h3>8.1 permission resourceの基本構造</h3>
          <p>
            セキュリティのため、エージェントのコマンド実行やファイル書き込みは権限ポリシーツールによって制御されます。
          </p>

          <h3>8.2 サポートされているアクション</h3>
          <ul>
            <li><code>read_file</code> / <code>write_file</code></li>
            <li><code>command</code> / <code>unsandboxed</code></li>
            <li><code>read_url</code> / <code>execute_url</code></li>
          </ul>

          <h3>8.3 暗黙のルール</h3>
          <p>
            権限エラーが発生した場合は狭いスコープで `ask_permission` ツールを申請します。
          </p>

          <h3>8.4 設定例</h3>
          <p>
            特定の危険なシェルコマンドや絶対パス書き込みはブロックされます。
          </p>

          <h3>8.5 Terminal Sandboxing(プレビュー機能)</h3>
          <p>
            安全な分離環境内でコマンドを実行するサンドボックス保護機能が提供されています。
          </p>

          <h3>8.6 Permissions ベストプラクティス</h3>
          <p>
            必要最小限のワイルドカードにとどめ、安全性を担保します。
          </p>
        </section>

        <section id="sec-9" className={styles.section}>
          <h2>9. Claude Code との比較(共通点・差異・共存戦略)</h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>Claude Code (Anthropic)</th>
                  <th>Google Antigravity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>設定ファイル</strong></td>
                  <td><code>CLAUDE.md</code> / <code>.claude/skills/</code></td>
                  <td><code>GEMINI.md</code> / <code>AGENTS.md</code> / <code>.agents/skills/</code></td>
                </tr>
                <tr>
                  <td><strong>フォーマット標準</strong></td>
                  <td>Agent Skills 原案策定</td>
                  <td>agentskills.io オープンスタンダード互換</td>
                </tr>
                <tr>
                  <td><strong>推奨実行モデル</strong></td>
                  <td>Claude 3.7 / 3.5 系列</td>
                  <td>Gemini 3 系列 (モデルフリー設計)</td>
                </tr>
                <tr>
                  <td><strong>共存方法</strong></td>
                  <td colSpan={2}>
                    <code>AGENTS.md</code> を共通ポインタとし、双方の規約ファイルへ委譲することで完全共存が可能。
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="sec-10" className={styles.section}>
          <h2>10. アンチパターン 10 選</h2>
          <ul className={styles.antiList}>
            <li><span>❌</span><span><strong>1. 全自動整形コマンド（`bun run lint:fix`）の無引数実行</strong>: 予期せぬリポジトリ全体の変更を引き起こす</span></li>
            <li><span>❌</span><span><strong>2. 省略・要約移植</strong>: 元ドキュメントの一部を間引いて移植する（100% faithful 違反）</span></li>
            <li><span>❌</span><span><strong>3. Red テスト無しのコード実装</strong>: テスト失敗を確認せずに Green コードを書く（TDD 違反）</span></li>
            <li><span>❌</span><span><strong>4. 不必要な `use client` 化</strong>: SSR メタデータエクスポートを破壊する</span></li>
            <li><span>❌</span><span><strong>5. 曖昧な Skill description</strong>: エージェントの発見精度を大幅に低下させる</span></li>
            <li><span>❌</span><span><strong>6. 多段（3階層以上）の参照リンク</strong>: エージェントの読み込み漏れを招く</span></li>
            <li><span>❌</span><span><strong>7. PII / ローカル絶対パスのコミット</strong>: 個人情報や環境依存パスの混入</span></li>
            <li><span>❌</span><span><strong>8. 無認可での依存ライブラリ追加</strong>: プロジェクトの依存関係を勝手に変更する</span></li>
            <li><span>❌</span><span><strong>9. コールバック・非同期エラーの握りつぶし</strong>: try-catch での黙殺</span></li>
            <li><span>❌</span><span><strong>10. `globals.css` 未定義変数の参照</strong>: 画面全体の配色崩壊を引き起こす</span></li>
          </ul>
        </section>

        <section id="sec-11" className={styles.section}>
          <h2>11. ベストプラクティス総まとめ</h2>
          <ul className={styles.checklist}>
            <li><span>🔲</span><span>仕様書・規約ファイルは常に単一の真実の源（SSoT）として同期・維持する</span></li>
            <li><span>🔲</span><span>すべての新機能・修正には 100% Pass するユニットテストを作成する</span></li>
            <li><span>🔲</span><span>TDD サイクル（Red → Green → Refactor → Docs）をステップバイステップでコミットする</span></li>
            <li><span>🔲</span><span>Mermaid ダイアグラムおよび手書き図解はすべて中央寄せ・全幅レスポンシブにする</span></li>
            <li><span>🔲</span><span>メインコンテンツ幅は画面いっぱいに設定し良好な視認性を確保する</span></li>
          </ul>
        </section>

        <section id="sec-12" className={styles.section}>
          <h2>12. まとめ</h2>
          <p>
            Google Antigravity は、仕様駆動開発を実現するための包括的なエコシステムを備えています。Rules, Skills, Workflows, Artifacts, Permissions の5つの概念を正しく理解し運用することで、AIエージェントの能力を安全かつ最大限に活用できます。
          </p>
        </section>

        <section id="sec-13" className={styles.section}>
          <h2>13. 参考文献・出典(Sources)</h2>
          <p>
            本ガイドは以下の公式ドキュメントおよび技術一次情報を基に構築されています。
          </p>

          <div className={styles.sourceGroupTitle}>公式ドキュメント</div>
          <ul className={styles.sourceList}>
            <li>
              <span className={styles.sourceTitle}>Google Antigravity Docs — Overview</span>
              <a className={styles.sourceUrl} href="https://antigravity.google/docs" target="_blank" rel="noopener noreferrer">
                https://antigravity.google/docs
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>Google Antigravity Docs — Skills Specification</span>
              <a className={styles.sourceUrl} href="https://antigravity.google/docs/ide/skills" target="_blank" rel="noopener noreferrer">
                https://antigravity.google/docs/ide/skills
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>Agent Skills Specification Official Site</span>
              <a className={styles.sourceUrl} href="https://agentskills.io/home" target="_blank" rel="noopener noreferrer">
                https://agentskills.io/home
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>Anthropic Claude Docs — Agent Skills</span>
              <a className={styles.sourceUrl} href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview" target="_blank" rel="noopener noreferrer">
                https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>Google Codelabs — Antigravity Hands-on</span>
              <a className={styles.sourceUrl} href="https://codelabs.developers.google.com/getting-started-google-antigravity" target="_blank" rel="noopener noreferrer">
                https://codelabs.developers.google.com/getting-started-google-antigravity
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>Simon Willison's Weblog — Agent Skills</span>
              <a className={styles.sourceUrl} href="https://simonwillison.net/tags/skills/" target="_blank" rel="noopener noreferrer">
                https://simonwillison.net/tags/skills/
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>GitHub — anthropics/skills</span>
              <a className={styles.sourceUrl} href="https://github.com/anthropics/skills" target="_blank" rel="noopener noreferrer">
                https://github.com/anthropics/skills
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>GitHub — obra/superpowers</span>
              <a className={styles.sourceUrl} href="https://github.com/obra/superpowers" target="_blank" rel="noopener noreferrer">
                https://github.com/obra/superpowers
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>Google Cloud Community — Antigravity Tutorial</span>
              <a className={styles.sourceUrl} href="https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d" target="_blank" rel="noopener noreferrer">
                https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>GitHub — rmyndharis/antigravity-skills</span>
              <a className={styles.sourceUrl} href="https://github.com/rmyndharis/antigravity-skills" target="_blank" rel="noopener noreferrer">
                https://github.com/rmyndharis/antigravity-skills
              </a>
            </li>
          </ul>
        </section>

        <footer className={styles.footer}>
          <p>Google Antigravity 完全ガイド — 2026年7月時点の仕様に基づき作成</p>
        </footer>
      </main>
    </div>
  );
}
