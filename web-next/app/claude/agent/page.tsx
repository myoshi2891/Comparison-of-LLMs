import type { Metadata } from "next";
import Ext from "@/components/docs/Ext";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import SidebarToggle from "./SidebarToggle";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title:
    "サブエージェント & Agent Teams 開発における Markdown ファイル ベストプラクティス | LLM コスト計算機",
  description:
    "CLAUDE.md・サブエージェント定義・Agent Teams の全拡張レイヤーにおける Markdown ファイル（.md）の設計原則、パラメータ仕様、ユースケース別使い分けを体系的に解説する実戦ガイド。",
};

const DIAGRAM_OVERVIEW = `flowchart TD
    A["CLAUDE.md<br/>常時ロードされる記憶"] --> M["メインセッション"]
    S["SKILL.md<br/>必要な時だけ本文ロード"] -.->|"description一致時に呼び出し"| M
    M -->|"一方向に委譲・要約が返る"| SA["サブエージェント<br/>.claude/agents 配下のMarkdown"]
    M -->|"チームを編成"| TL["Team Lead<br/>メインセッション自身"]
    TL -->|"タスク割当"| T1["Teammate 1"]
    TL -->|"タスク割当"| T2["Teammate 2"]
    T1 -->|"メールボックスで会話"| T2
    T2 -->|"メールボックスで会話"| T1
    T1 -.->|"サブエージェント定義を役割として再利用"| SA`;

const DIAGRAM_DELEGATION = `sequenceDiagram
    participant U as ユーザー
    participant M as メインセッション
    participant SA as サブエージェント(独立コンテキスト)
    U->>M: コードレビューして
    M->>M: descriptionと一致するか判断
    M->>SA: タスクを要約して委譲、新規コンテキスト起動
    activate SA
    SA->>SA: git diff / Read / Grep 等を実行
    SA-->>M: レビュー結果の要約のみ返却
    deactivate SA
    M-->>U: 要約結果を提示、詳細ログはメインに残らない`;

const DIAGRAM_TEAMS = `flowchart TB
    subgraph Team["Agent Team 1セッション内"]
        L["Team Lead<br/>メインセッション"]
        TL["共有タスクリスト<br/>pending/in progress/completed"]
        T1["Teammate: security-reviewer"]
        T2["Teammate: perf-reviewer"]
        T3["Teammate: test-coverage"]
    end
    L -->|タスク登録/割当| TL
    T1 -->|タスクをclaim/完了| TL
    T2 -->|タスクをclaim/完了| TL
    T3 -->|タスクをclaim/完了| TL
    T1 -->|mailboxで会話| T2
    T2 -->|mailboxで会話| T1
    T2 -->|mailboxで会話| T3
    T3 -->|mailboxで会話| T2
    T1 -->|完了通知| L
    T2 -->|完了通知| L
    T3 -->|完了通知| L`;

const DIAGRAM_DECISION = `flowchart TD
    Start(["新しいルール・振る舞いを追加したい"]) --> Q1{"毎セッション<br/>常に有効にしたいか?"}
    Q1 -- Yes --> CM["CLAUDE.md に書く"]
    Q1 -- No --> Q2{"メインの会話の中で<br/>再利用したい手順・知識か?"}
    Q2 -- Yes --> SK["SKILL.md を作る"]
    Q2 -- No --> Q3{"一方向に委譲して<br/>結果の要約だけ欲しいか?"}
    Q3 -- Yes --> SA[".claude/agents 配下に<br/>サブエージェントを作る"]
    Q3 -- No --> Q4{"複数の作業者が<br/>直接会話・相互検証すべきか?"}
    Q4 -- Yes --> AT["Agent Teams を有効化し<br/>サブエージェント定義を役割として使う"]
    Q4 -- No --> Single["単一セッションのまま<br/>メインで対応する"]`;

/**
 * Mermaid themeVariables — archive HTML配色を正とする（theme: 'base'）
 * primaryColor    : アクセント薄紫（ノード塗り）
 * secondaryColor  : ティール薄緑（サブグラフ背景等）
 * tertiaryColor   : アンバー薄黄（三次ノード）
 * primaryTextColor: インク黒（文字）
 * primaryBorderColor: アクセント紫（ボーダー）
 * lineColor       : エッジ色
 */
const AGENT_THEME_VARS: Record<string, string> = {
  // --- flowchart ノード ---
  primaryColor: "#edeaff",
  primaryTextColor: "#12141c",
  primaryBorderColor: "#5b4eff",
  lineColor: "#7a8093",
  secondaryColor: "#e2f6f0",
  tertiaryColor: "#fbf1de",
  fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
  // --- sequenceDiagram アクター ---
  actorBkg: "#edeaff",
  actorBorder: "#5b4eff",
  actorTextColor: "#12141c",
  actorLineColor: "#7a8093",
  activationBkgColor: "#e2f6f0",
  activationBorderColor: "#5b4eff",
  labelBoxBkgColor: "#fbf1de",
  labelTextColor: "#12141c",
  noteBkgColor: "#fbf1de",
  noteTextColor: "#12141c",
  signalColor: "#3f34cc",
  signalTextColor: "#12141c",
};

/**
 * Renders a documentation guide for Claude Code Markdown configuration and agent collaboration.
 */
export default function ClaudeAgentPage() {
  return (
    <SidebarToggle>
      <TocObserver />
      <aside id="claude-agent-sidebar" className={styles.sidebar}>
        <div className={styles.sidebarBrand}>.claude/ — ガイド目次</div>
        <nav className={styles.fileTree}>
          <div className={styles.dir}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              role="img"
              aria-label="フォルダアイコン"
            >
              <title>フォルダ</title>
              <path
                d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
            guide/
          </div>
          <ul>
            <li>
              <a href="#overview">01. 全体像</a>
            </li>
            <li>
              <a href="#claude-md">02. CLAUDE.md</a>
            </li>
            <li>
              <a href="#subagents">03. サブエージェント</a>
            </li>
            <li>
              <a href="#agent-teams">04. Agent Teams</a>
            </li>
            <li>
              <a href="#writing-principles">05. 横断的な書き方原則</a>
            </li>
            <li>
              <a href="#decision-flow">06. 意思決定フロー</a>
            </li>
            <li>
              <a href="#checklist">07. チェックリスト</a>
            </li>
            <li>
              <a href="#summary">08. まとめ</a>
            </li>
            <li>
              <a href="#sources">
                09. 参考ソース<span className={styles.tag}>URL</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>
          <header className={styles.hero}>
            <p className={styles.kicker}>Claude Code / Markdown 設定ファイル実践ガイド</p>
            <h1>
              サブエージェント &amp; Agent Teams 開発における
              <br />
              Markdown ファイル ベストプラクティス
            </h1>
            <p className={styles.sub}>
              CLAUDE.md・サブエージェント定義・Agent Teams はすべて「YAML frontmatter +
              Markdown本文」という共通フォーマットの上に成り立っています。この4層の構造を初学者にも分かる順番で解説します。
            </p>
            <div className={styles.metaRow}>
              <span className={styles.pill}>対象: Claude Code v2.1系</span>
              <span className={styles.pill}>更新: 2026年7月25日時点</span>
              <span className={styles.pill}>Agent Teams: experimental</span>
            </div>

            <div className={styles.stack}>
              <div className={`${styles.layer} ${styles.l1}`}>
                <span className={styles.idx}>1</span>
                <span className={styles.name}>CLAUDE.md</span>
                <span className={styles.desc}>常時ロードされる長期記憶</span>
              </div>
              <div className={styles.connector} />
              <div className={`${styles.layer} ${styles.l2}`}>
                <span className={styles.idx}>2</span>
                <span className={styles.name}>SKILL.md</span>
                <span className={styles.desc}>必要な時だけ読み込む手順書</span>
              </div>
              <div className={styles.connector} />
              <div className={`${styles.layer} ${styles.l3}`}>
                <span className={styles.idx}>3</span>
                <span className={styles.name}>.claude/agents/*.md</span>
                <span className={styles.desc}>一方向委譲するサブエージェント</span>
              </div>
              <div className={styles.connector} />
              <div className={`${styles.layer} ${styles.l4}`}>
                <span className={styles.idx}>4</span>
                <span className={styles.name}>Agent Teams</span>
                <span className={styles.desc}>相互に会話する複数セッション</span>
              </div>
            </div>
          </header>

          {/* 01 */}
          <section id="overview" className={styles.section}>
            <p className={styles.eyebrow}>Step 00 · Overview</p>
            <h2>全体像:4つの拡張レイヤーとMarkdownの役割</h2>
            <p className={styles.lede}>
              どのレイヤーも「Markdownで振る舞いを定義する」という共通点を持ちますが、
              <strong>ロードされるタイミングと目的</strong>
              が異なります。まずは地図を頭に入れましょう。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>レイヤー</th>
                    <th>ファイル</th>
                    <th>主な置き場所</th>
                    <th>ロードのタイミング</th>
                    <th>主な用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>プロジェクト記憶</td>
                    <td>
                      <code>CLAUDE.md</code>
                    </td>
                    <td>
                      プロジェクトルート / <code>~/.claude/</code>
                    </td>
                    <td>セッション開始時に常時</td>
                    <td>常に守ってほしい規約・コマンド集</td>
                  </tr>
                  <tr>
                    <td>再利用可能な手順</td>
                    <td>
                      <code>SKILL.md</code>
                    </td>
                    <td>
                      <code>.claude/skills/&lt;name&gt;/</code>
                    </td>
                    <td>
                      <code>description</code>一致時のみ本文ロード
                    </td>
                    <td>ドメイン知識・繰り返す作業手順</td>
                  </tr>
                  <tr>
                    <td>サブエージェント</td>
                    <td>
                      <code>.claude/agents/*.md</code>
                    </td>
                    <td>project / user / plugin / 管理設定</td>
                    <td>委譲された瞬間に独立起動</td>
                    <td>一方向委譲・調査/レビューの隔離</td>
                  </tr>
                  <tr>
                    <td>Agent Teams</td>
                    <td>サブエージェント定義を再利用</td>
                    <td>専用ファイルなし</td>
                    <td>
                      <code>CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</code>時
                    </td>
                    <td>複数セッションが対話しながら協調</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.mermaidCard}>
              <MermaidDiagram
                chart={DIAGRAM_OVERVIEW}
                theme="base"
                themeVariables={AGENT_THEME_VARS}
              />
              <p className={styles.cap}>Fig.1 — 4層の関係図</p>
            </div>

            <div className={`${styles.callout} ${styles.calloutNote}`}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                role="img"
                aria-label="ノートアイコン"
              >
                <title>ノート</title>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M12 8v.01M12 11v5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <p>
                <strong>ポイント:</strong>
                <code>SKILL.md</code>
                は「同じ会話の中で読み込む知識」、<code>.claude/agents/*.md</code>
                は「別の独立したコンテキストに投げる仕事」です。この違いを押さえておくと以降が理解しやすくなります。
              </p>
            </div>
          </section>

          {/* 02 */}
          <section id="claude-md" className={styles.section}>
            <p className={styles.eyebrow}>Step 01 · CLAUDE.md</p>
            <h2>CLAUDE.md を書く — プロジェクトの「長期記憶」</h2>
            <p className={styles.lede}>
              複数の場所に置くことができ、Claude Codeはそれらをマージして読み込みます。
            </p>

            <h3>置き場所と階層</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>置き場所</th>
                    <th>スコープ</th>
                    <th>用途の例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>~/.claude/CLAUDE.md</code>
                    </td>
                    <td>全プロジェクト共通(個人)</td>
                    <td>自分だけのコーディング流儀</td>
                  </tr>
                  <tr>
                    <td>
                      <code>&lt;repo&gt;/CLAUDE.md</code>
                    </td>
                    <td>プロジェクト全体</td>
                    <td>チーム共通の規約・コマンド集</td>
                  </tr>
                  <tr>
                    <td>
                      <code>&lt;repo&gt;/&lt;subdir&gt;/CLAUDE.md</code>
                    </td>
                    <td>サブディレクトリ配下</td>
                    <td>モノレポの各パッケージ固有ルール</td>
                  </tr>
                  <tr>
                    <td>
                      <code>CLAUDE.local.md</code>
                    </td>
                    <td>個人用(通常gitignore対象)</td>
                    <td>ローカル環境固有のメモ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>書くべき内容</h3>
            <ul>
              <li>よく使う bash コマンド(テスト・ビルド・lint など)</li>
              <li>中核ファイル・ユーティリティ関数の場所</li>
              <li>コードスタイル・命名規則</li>
              <li>テストの実行方法と合格基準</li>
              <li>リポジトリの作法(ブランチ命名、rebase か merge か等)</li>
              <li>開発環境のセットアップ手順</li>
            </ul>

            <h3>ベストプラクティス</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>実践</th>
                    <th>理由</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>短く・箇条書き中心で書く</td>
                    <td>毎セッション必ずロードされ、肥大化はコンテキストとレイテンシを圧迫する</td>
                  </tr>
                  <tr>
                    <td>
                      必ず守ってほしいルールは <code>IMPORTANT</code> / <code>YOU MUST</code> で強調
                    </td>
                    <td>通常の説明文より強く遵守されやすい</td>
                  </tr>
                  <tr>
                    <td>
                      肥大化したら <code>@path/to/file.md</code> でインポート分割
                    </td>
                    <td>1ファイル詰め込みを避け、モジュール化できる</td>
                  </tr>
                  <tr>
                    <td>
                      恒久ルールは <code>.claude/rules/*.md</code> へ分離を検討
                    </td>
                    <td>条件付き読み込みにでき、本体を軽量に保てる</td>
                  </tr>
                  <tr>
                    <td>変更はコードの変更と一緒にコミット</td>
                    <td>チーム全体の一貫性を保てる</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4>サンプル</h4>
            <div className={styles.codeCard}>
              <div className={styles.bar}>
                <span className={`${styles.dot} ${styles.dotDotR}`} />
                <span className={`${styles.dot} ${styles.dotDotA}`} />
                <span className={`${styles.dot} ${styles.dotDotG}`} />
                <span className={styles.filename}>CLAUDE.md</span>
              </div>
              <pre>
                <code>
                  <span className={styles.tokComment}># CLAUDE.md</span>
                  {"\n\n"}
                  <span className={styles.tokTitle}>## プロジェクト概要</span>
                  {"\n"}
                  {"Node.js + TypeScript のモノレポ。パッケージマネージャは pnpm。\n\n"}
                  <span className={styles.tokTitle}>## よく使うコマンド</span>
                  {"\n"}
                  {"- "}
                  <span className={styles.tokStr}>`pnpm test`</span>
                  {" — 全パッケージのユニットテスト実行\n- "}
                  <span className={styles.tokStr}>`pnpm lint --fix`</span>
                  {" — ESLint 自動修正\n- "}
                  <span className={styles.tokStr}>`pnpm build`</span>
                  {" — 全パッケージのビルド\n\n"}
                  <span className={styles.tokTitle}>## コーディング規約</span>
                  {"\n"}
                  {"- IMPORTANT: 新規コードに "}
                  <span className={styles.tokStr}>`any`</span>
                  {" 型を使用しない\n- 関数は原則 30 行以内に収める\n\n"}
                  <span className={styles.tokTitle}>## 追加ルール</span>
                  {"\n"}
                  <span className={styles.tokKey}>@docs/git-instructions.md</span>
                  {"\n"}
                  <span className={styles.tokKey}>@docs/api-conventions.md</span>
                </code>
              </pre>
            </div>
          </section>

          {/* 03 */}
          <section id="subagents" className={styles.section}>
            <p className={styles.eyebrow}>Step 02 · Subagents</p>
            <h2>サブエージェント定義ファイル(.claude/agents/*.md)</h2>
            <p className={styles.lede}>
              「YAML frontmatter + Markdown本文(システムプロンプト)」という1ファイルで完結します。
            </p>

            <h3>基本構造</h3>
            <div className={styles.codeCard}>
              <div className={styles.bar}>
                <span className={`${styles.dot} ${styles.dotDotR}`} />
                <span className={`${styles.dot} ${styles.dotDotA}`} />
                <span className={`${styles.dot} ${styles.dotDotG}`} />
                <span className={styles.filename}>.claude/agents/code-reviewer.md</span>
              </div>
              <pre>
                <code>
                  {"---\n"}
                  <span className={styles.tokKey}>name:</span> code-reviewer{"\n"}
                  <span className={styles.tokKey}>description:</span>{" "}
                  <span className={styles.tokStr}>
                    コード品質・セキュリティのレビューに使用する。コード変更後は積極的に使うこと。
                  </span>
                  {"\n"}
                  <span className={styles.tokKey}>tools:</span> Read, Grep, Glob, Bash{"\n"}
                  <span className={styles.tokKey}>model:</span> sonnet{"\n"}
                  {"---\n\n"}
                  {"あなたはシニアコードレビュアーです。呼び出されたら:\n"}
                  {"1. "}
                  <span className={styles.tokStr}>`git diff`</span>
                  {" で直近の変更を確認する\n"}
                  {"2. 変更されたファイルに焦点を当てる\n"}
                  {"3. ただちにレビューを開始する\n\n"}
                  {"優先度別(Critical / Warning / Suggestion)にフィードバックを整理してください。"}
                </code>
              </pre>
            </div>

            <h3>frontmatter フィールド一覧</h3>
            <p>
              必須なのは <code>name</code> と <code>description</code> のみです。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>フィールド</th>
                    <th>必須</th>
                    <th>役割</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>name</code>
                    </td>
                    <td>✅</td>
                    <td>一意な識別子(小文字とハイフン)</td>
                  </tr>
                  <tr>
                    <td>
                      <code>description</code>
                    </td>
                    <td>✅</td>
                    <td>Claudeが「いつ委譲するか」を判断する最重要情報</td>
                  </tr>
                  <tr>
                    <td>
                      <code>tools</code>
                    </td>
                    <td>–</td>
                    <td>許可するツールの一覧(省略時は継承)</td>
                  </tr>
                  <tr>
                    <td>
                      <code>disallowedTools</code>
                    </td>
                    <td>–</td>
                    <td>継承したツールから明示的に除外</td>
                  </tr>
                  <tr>
                    <td>
                      <code>model</code>
                    </td>
                    <td>–</td>
                    <td>
                      <code>sonnet</code> / <code>opus</code> / <code>haiku</code> /{" "}
                      <code>fable</code> / <code>inherit</code>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>permissionMode</code>
                    </td>
                    <td>–</td>
                    <td>
                      <code>default</code> / <code>acceptEdits</code> / <code>plan</code> /{" "}
                      <code>bypassPermissions</code> など
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>maxTurns</code>
                    </td>
                    <td>–</td>
                    <td>停止するまでの最大ターン数</td>
                  </tr>
                  <tr>
                    <td>
                      <code>skills</code>
                    </td>
                    <td>–</td>
                    <td>起動時にプリロードするスキル名</td>
                  </tr>
                  <tr>
                    <td>
                      <code>mcpServers</code>
                    </td>
                    <td>–</td>
                    <td>このサブエージェント専用のMCPサーバー定義</td>
                  </tr>
                  <tr>
                    <td>
                      <code>hooks</code>
                    </td>
                    <td>–</td>
                    <td>このサブエージェント専用のライフサイクルフック</td>
                  </tr>
                  <tr>
                    <td>
                      <code>memory</code>
                    </td>
                    <td>–</td>
                    <td>
                      <code>user</code> / <code>project</code> / <code>local</code> の永続メモリ
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>background</code>
                    </td>
                    <td>–</td>
                    <td>常にバックグラウンド実行にするか</td>
                  </tr>
                  <tr>
                    <td>
                      <code>isolation</code>
                    </td>
                    <td>–</td>
                    <td>
                      <code>worktree</code>で独立したgit worktree実行
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>color</code>
                    </td>
                    <td>–</td>
                    <td>タスク一覧・トランスクリプト上の表示色</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>スコープと優先順位</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>優先度</th>
                    <th>置き場所</th>
                    <th>スコープ</th>
                    <th>用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1(最高)</td>
                    <td>管理設定(managed settings)</td>
                    <td>組織全体</td>
                    <td>組織のガバナンス強制</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <code>--agents</code> CLIフラグ
                    </td>
                    <td>そのセッションのみ</td>
                    <td>一時的テスト・自動化</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <code>.claude/agents/</code>(project)
                    </td>
                    <td>プロジェクト全体</td>
                    <td>チーム共有・バージョン管理</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>
                      <code>~/.claude/agents/</code>(user)
                    </td>
                    <td>全プロジェクト共通</td>
                    <td>個人の持ち歩き用ヘルパー</td>
                  </tr>
                  <tr>
                    <td>5(最低)</td>
                    <td>
                      プラグインの<code>agents/</code>
                    </td>
                    <td>プラグイン有効化先</td>
                    <td>配布・共有用</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.callout} ${styles.calloutTip}`}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                role="img"
                aria-label="チェックマークアイコン"
              >
                <title>チェックマーク</title>
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <p>
                <strong>初学者への推奨:</strong>
                まずは<strong>プロジェクトスコープ</strong>(<code>.claude/agents/</code>
                )から始め、Gitにコミットしてチームで育てていくのが安全です。
              </p>
            </div>

            <h3>description の書き方が最も重要</h3>
            <p>
              Claudeは会話中のタスクと各サブエージェントの<code>description</code>
              を照合して自動委譲するかを判断します。曖昧な説明は誤発火・不発火の原因になります。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>悪い例</th>
                    <th>良い例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>コードを見る</td>
                    <td>
                      コード変更後にセキュリティ・品質・保守性の観点でレビューする専門家。書き終えた直後に積極的に(proactively)使うこと。
                    </td>
                  </tr>
                  <tr>
                    <td>ヘルパー</td>
                    <td>
                      読み取り専用でSELECTクエリのみを実行しレポートを作成する。データ分析やレポート依頼で使用する。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>委譲のフロー</h3>
            <div className={styles.mermaidCard}>
              <MermaidDiagram
                chart={DIAGRAM_DELEGATION}
                theme="base"
                themeVariables={AGENT_THEME_VARS}
              />
              <p className={styles.cap}>Fig.2 — サブエージェントへの委譲フロー</p>
            </div>

            <div className={`${styles.callout} ${styles.calloutWarn}`}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                role="img"
                aria-label="警告アイコン"
              >
                <title>警告</title>
                <path
                  d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              <p>
                <strong>最小権限の原則:</strong>
                読み取り専用のレビュー系には書き込み系ツールを含めない。危険操作は
                <code>hooks</code> の<code>PreToolUse</code>{" "}
                でコマンド内容を検証すると、より堅牢になります。
              </p>
            </div>
          </section>

          {/* 04 */}
          <section id="agent-teams" className={styles.section}>
            <p className={styles.eyebrow}>Step 03 · Agent Teams</p>
            <h2>Agent Teams — 複数セッションの協調開発</h2>
            <p className={styles.lede}>
              「サブエージェントの延長」ではなく、<strong>別のコーディネーションモデル</strong>
              です。
            </p>

            <h3>サブエージェントとの違い</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>サブエージェント</th>
                    <th>Agent Teams</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>コンテキスト</td>
                    <td>独自だが結果は呼び出し元に返るのみ</td>
                    <td>各メンバーが完全に独立</td>
                  </tr>
                  <tr>
                    <td>コミュニケーション</td>
                    <td>メインにのみ結果を報告</td>
                    <td>メンバー同士が直接メッセージ</td>
                  </tr>
                  <tr>
                    <td>調整方法</td>
                    <td>メインエージェントが全管理</td>
                    <td>共有タスクリストで自己調整</td>
                  </tr>
                  <tr>
                    <td>向いている作業</td>
                    <td>結果だけが重要な焦点化タスク</td>
                    <td>議論・協調・相互検証が必要な作業</td>
                  </tr>
                  <tr>
                    <td>トークンコスト</td>
                    <td>低い(要約のみ返る)</td>
                    <td>高い(全員が独立インスタンス)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.callout} ${styles.calloutNote}`}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                role="img"
                aria-label="ノートアイコン"
              >
                <title>ノート</title>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M12 8v.01M12 11v5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <p>
                <strong>判断の目安:</strong>
                「作業者同士が会話・議論・相互検証する必要があるか?」がYesならAgent
                Teams、Noなら通常のサブエージェントで十分です。
              </p>
            </div>

            <h3>有効化方法</h3>
            <div className={styles.codeCard}>
              <div className={styles.bar}>
                <span className={`${styles.dot} ${styles.dotDotR}`} />
                <span className={`${styles.dot} ${styles.dotDotA}`} />
                <span className={`${styles.dot} ${styles.dotDotG}`} />
                <span className={styles.filename}>settings.json</span>
              </div>
              <pre>
                <code>
                  {"{\n  "}
                  <span className={styles.tokKey}>"env"</span>
                  {": {\n    "}
                  <span className={styles.tokKey}>"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS"</span>
                  {": "}
                  <span className={styles.tokStr}>"1"</span>
                  {"\n  }\n}"}
                </code>
              </pre>
            </div>
            <p>
              有効化後は特別なファイルを作る必要はなく、自然言語で依頼するだけでチームが編成されます。
            </p>

            <h3>アーキテクチャ</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>コンポーネント</th>
                    <th>役割</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Team Lead</td>
                    <td>メインセッション自身。チームメイトを立ち上げ、作業を調整し、結果を統合</td>
                  </tr>
                  <tr>
                    <td>Teammates</td>
                    <td>それぞれ独立したClaude Codeインスタンス。担当タスクを持つ</td>
                  </tr>
                  <tr>
                    <td>Task List</td>
                    <td>
                      共有タスク一覧。pending / in progress / completed の3状態と依存関係を持つ
                    </td>
                  </tr>
                  <tr>
                    <td>Mailbox</td>
                    <td>チームメイト間の直接メッセージングの仕組み</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.mermaidCard}>
              <MermaidDiagram
                chart={DIAGRAM_TEAMS}
                theme="base"
                themeVariables={AGENT_THEME_VARS}
              />
              <p className={styles.cap}>Fig.3 — Agent Teams アーキテクチャ</p>
            </div>

            <h3>サブエージェント定義をteammateとして再利用する</h3>
            <p>
              <code>.claude/agents/</code>
              に定義済みのサブエージェントは、そのままチームメイトの役割として再利用できます。定義ファイルの
              <code>tools</code>と<code>model</code>
              がそのまま使われ、Markdown本文はチームメイトのシステムプロンプトに追加指示として連結されます。
            </p>
            <div className={`${styles.callout} ${styles.calloutWarn}`}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                role="img"
                aria-label="警告アイコン"
              >
                <title>警告</title>
                <path
                  d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              <p>
                <code>skills</code> と <code>mcpServers</code>{" "}
                フィールドはこの経路では適用されません。チームメイトはプロジェクト/ユーザー設定から通常どおりスキルとMCPをロードします。
              </p>
            </div>

            <h3>チームサイズとタスク粒度</h3>
            <ul>
              <li>
                まずは<strong>3〜5人</strong>のチームメイトから始める
              </li>
              <li>
                1人あたり<strong>5〜6個</strong>のタスクを持たせると手待ちが減る
              </li>
              <li>
                タスクの粒度は「関数1つ・テストファイル1つ・レビュー1件」のように明確な成果物単位に揃える
              </li>
            </ul>

            <h3>よくある落とし穴</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>症状</th>
                    <th>主な原因</th>
                    <th>対処</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>チームメイトが表示されない</td>
                    <td>タスクが単純すぎる</td>
                    <td>明示的に「Agent Teamを使って」と依頼する</td>
                  </tr>
                  <tr>
                    <td>権限プロンプトが多すぎる</td>
                    <td>許可要求がLeadに集約される</td>
                    <td>よく使う操作を事前に許可設定しておく</td>
                  </tr>
                  <tr>
                    <td>タスクが完了マークされない</td>
                    <td>メンバーが更新を忘れる</td>
                    <td>定期的に進捗を確認・手動更新</td>
                  </tr>
                  <tr>
                    <td>同じファイルを複数人が編集</td>
                    <td>担当ファイルの分割が曖昧</td>
                    <td>メンバーごとに担当ファイルを明確化</td>
                  </tr>
                  <tr>
                    <td>Leadが作業完了前に終了</td>
                    <td>完了判定が早すぎる</td>
                    <td>「メンバーの完了を待って」と明示的に指示</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 05 */}
          <section id="writing-principles" className={styles.section}>
            <p className={styles.eyebrow}>Step 04 · Cross-cutting principles</p>
            <h2>Markdownファイル自体の書き方 — 横断的なベストプラクティス</h2>
            <p className={styles.lede}>
              <code>CLAUDE.md</code> / <code>.claude/agents/*.md</code> / <code>SKILL.md</code>{" "}
              に共通する原則です。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>原則</th>
                    <th>具体例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>単一責任:1ファイル1目的</td>
                    <td>レビュー専用・デバッグ専用のように細分化し「何でも屋」を避ける</td>
                  </tr>
                  <tr>
                    <td>descriptionは動詞+条件で書く</td>
                    <td>「〜する専門家。〜の時に使用/積極的に使用すること」の形式を徹底</td>
                  </tr>
                  <tr>
                    <td>本文は役割→手順→出力形式の順</td>
                    <td>「あなたは〇〇です」→「呼び出されたら1.2.3…」→「出力は優先度別に整理」</td>
                  </tr>
                  <tr>
                    <td>権限は最小限から始める</td>
                    <td>まず読み取り専用にし、動作確認後に書き込み権限を足す</td>
                  </tr>
                  <tr>
                    <td>バージョン管理する</td>
                    <td>プロジェクトスコープはGitにコミットしレビューを通す</td>
                  </tr>
                  <tr>
                    <td>肥大化したら分割する</td>
                    <td>
                      <code>@import</code> や <code>.claude/rules/</code>
                      、Skillなら<code>references/</code>へ切り出す
                    </td>
                  </tr>
                  <tr>
                    <td>命名は一意にする</td>
                    <td>
                      <code>name</code>は木構造全体で一意に保つ(重複は事故の元)
                    </td>
                  </tr>
                  <tr>
                    <td>強調構文を使い分ける</td>
                    <td>
                      必ず守ってほしい規則には <code>IMPORTANT</code>/<code>MUST</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 06 */}
          <section id="decision-flow" className={styles.section}>
            <p className={styles.eyebrow}>Step 05 · Decision</p>
            <h2>意思決定フローチャート:どのMarkdownファイルを使うべきか</h2>
            <div className={styles.chipRow}>
              <span className={styles.chip}>常時有効?</span>
              <span className={styles.chip}>再利用手順?</span>
              <span className={styles.chip}>一方向委譲?</span>
              <span className={styles.chip}>相互会話?</span>
            </div>
            <div className={styles.mermaidCard}>
              <MermaidDiagram
                chart={DIAGRAM_DECISION}
                theme="base"
                themeVariables={AGENT_THEME_VARS}
              />
              <p className={styles.cap}>Fig.4 — レイヤー選択の判断フロー</p>
            </div>
          </section>

          {/* 07 */}
          <section id="checklist" className={styles.section}>
            <p className={styles.eyebrow}>Step 06 · Review</p>
            <h2>コミット前チェックリスト</h2>
            <ul className={styles.checklist}>
              <li>
                <label>
                  <input type="checkbox" />
                  <span>
                    <span className={styles.t}>nameは一意か</span>
                    <span className={styles.d}>同じディレクトリツリー内で重複していないか</span>
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />
                  <span>
                    <span className={styles.t}>descriptionは具体的か</span>
                    <span className={styles.d}>「いつ使うか」が第三者にも明確か</span>
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />
                  <span>
                    <span className={styles.t}>ツール権限は最小か</span>
                    <span className={styles.d}>書き込み不要ならRead/Grep/Globのみか</span>
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />
                  <span>
                    <span className={styles.t}>CLAUDE.mdは肥大化していないか</span>
                    <span className={styles.d}>数百行を超えたら分割を検討したか</span>
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />
                  <span>
                    <span className={styles.t}>危険な操作にhooksを設定したか</span>
                    <span className={styles.d}>破壊的コマンドをPreToolUseで検証しているか</span>
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />
                  <span>
                    <span className={styles.t}>Agent Teamsのタスク粒度は適切か</span>
                    <span className={styles.d}>1人5〜6タスク程度に収まっているか</span>
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />
                  <span>
                    <span className={styles.t}>ファイル担当の重複はないか</span>
                    <span className={styles.d}>チームメイト間でファイル競合が起きない設計か</span>
                  </span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />
                  <span>
                    <span className={styles.t}>Gitにコミットしたか</span>
                    <span className={styles.d}>
                      チームで共有すべき定義がバージョン管理されているか
                    </span>
                  </span>
                </label>
              </li>
            </ul>
          </section>

          {/* 08 */}
          <section id="summary" className={styles.section}>
            <p className={styles.eyebrow}>Step 07 · Summary</p>
            <h2>まとめ</h2>
            <ul>
              <li>
                <strong>CLAUDE.md</strong>
                はプロジェクトの長期記憶。短く・強調構文を使い・分割しながら育てる。
              </li>
              <li>
                <strong>サブエージェント</strong>は「YAML frontmatter + システムプロンプト」で、
                <code>description</code>
                の質が委譲精度を決める。最小権限のツール設計が安全性の鍵。
              </li>
              <li>
                <strong>Agent Teams</strong>
                はサブエージェントの延長ではなく、共有タスクリストとメールボックスによる協調モデル。3〜5人・5〜6タスク/人からスモールスタートする。
              </li>
              <li>
                どのレイヤーも「1ファイル1目的・最小権限・バージョン管理・肥大化したら分割」という共通原則で運用するとメンテナンスしやすくなる。
              </li>
            </ul>
          </section>

          {/* 09 */}
          <section id="sources" className={styles.section}>
            <p className={styles.eyebrow}>Step 08 · Sources</p>
            <h2>参考ソース</h2>
            <p className={styles.lede}>
              本ガイドの作成にあたり、以下の一次情報・著名な開発者/企業ブログを参照しました(2026年7月時点)。
            </p>
            <ul className={styles.sources}>
              <li>
                <span className={styles.srcTitle}>
                  Anthropic公式ドキュメント「Create custom subagents」
                </span>
                <Ext href="https://code.claude.com/docs/en/sub-agents">
                  https://code.claude.com/docs/en/sub-agents
                </Ext>
              </li>
              <li>
                <span className={styles.srcTitle}>
                  Anthropic公式ドキュメント「Orchestrate teams of Claude Code sessions(Agent
                  Teams)」
                </span>
                <Ext href="https://code.claude.com/docs/en/agent-teams">
                  https://code.claude.com/docs/en/agent-teams
                </Ext>
              </li>
              <li>
                <span className={styles.srcTitle}>
                  Anthropic公式ドキュメント「Extend Claude with skills(SKILL.md)」
                </span>
                <Ext href="https://code.claude.com/docs/en/skills">
                  https://code.claude.com/docs/en/skills
                </Ext>
              </li>
              <li>
                <span className={styles.srcTitle}>
                  Anthropic公式ドキュメント「How Claude remembers your project(Memory / CLAUDE.md)」
                </span>
                <Ext href="https://code.claude.com/docs/en/memory">
                  https://code.claude.com/docs/en/memory
                </Ext>
              </li>
              <li>
                <span className={styles.srcTitle}>
                  Anthropic Engineering公式ブログ「Claude Code: Best practices for agentic
                  coding」(Boris Cherny 他)
                </span>
                <Ext href="https://www.anthropic.com/engineering/claude-code-best-practices">
                  https://www.anthropic.com/engineering/claude-code-best-practices
                </Ext>
              </li>
              <li>
                <span className={styles.srcTitle}>
                  Anthropic公式ニュース「Claude Opus 4.6」(Agent Teams research preview発表)
                </span>
                <Ext href="https://www.anthropic.com/news/claude-opus-4-6">
                  https://www.anthropic.com/news/claude-opus-4-6
                </Ext>
              </li>
              <li>
                <span className={styles.srcTitle}>
                  Anthropic Engineering公式ブログ「Building a C compiler with a team of parallel
                  Claudes」
                </span>
                <Ext href="https://www.anthropic.com/engineering/building-c-compiler">
                  https://www.anthropic.com/engineering/building-c-compiler
                </Ext>
              </li>
              <li>
                <span className={styles.srcTitle}>
                  Anthropic公式ブログ「Lessons from Anthropic on building effective human-agent
                  teams」
                </span>
                <Ext href="https://claude.com/blog/building-effective-human-agent-teams">
                  https://claude.com/blog/building-effective-human-agent-teams
                </Ext>
              </li>
              <li>
                <span className={styles.srcTitle}>
                  Simon Willison氏の知見に言及する解説記事(Skills/Subagentsの位置づけ)
                </span>
                <Ext href="https://alexop.dev/posts/understanding-claude-code-full-stack/">
                  https://alexop.dev/posts/understanding-claude-code-full-stack/
                </Ext>
              </li>
              <li>
                <span className={styles.srcTitle}>
                  Boris Cherny氏(Claude Code開発者)の設計思想に関する解説記事
                </span>
                <Ext href="https://mcp.directory/blog/claude-code-best-practices">
                  https://mcp.directory/blog/claude-code-best-practices
                </Ext>
              </li>
              <li>
                <span className={styles.srcTitle}>
                  GitHub anthropics/claude-code 公式リポジトリ内 Skill開発ガイド
                </span>
                <Ext href="https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/skill-development/SKILL.md">
                  https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/skill-development/SKILL.md
                </Ext>
              </li>
              <li>
                <span className={styles.srcTitle}>
                  GitHub anthropics/skills 公式Skillsリポジトリ
                </span>
                <Ext href="https://github.com/anthropics/skills">
                  https://github.com/anthropics/skills
                </Ext>
              </li>
            </ul>
            <div className={styles.disclaimer}>
              <strong>注意:</strong> Agent Teams は「experimental / research
              preview」機能として提供されており、コマンド名・環境変数・挙動は今後変更される可能性があります。実装前に必ず公式ドキュメントで最新仕様を確認してください。
            </div>
          </section>

          <footer className={styles.pageFooter}>
            claude-code-subagents-agentteams-markdown-guide.html · 2026-07-25
          </footer>
        </div>
      </main>
    </SidebarToggle>
  );
}
