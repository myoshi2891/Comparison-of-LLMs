import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Claude Code AI仕様駆動開発 — マークダウンファイル完全ガイド",
  description:
    "CLAUDE.md / spec.md / requirements.md / design.md / tasks.md / MEMORY.md / SKILL.md など、Claude Code の仕様駆動開発 (SDD) を支えるマークダウンファイル群の役割・構造・ベストプラクティスを公式根拠付きで解説。",
};

// 外部ソース (sources セクション) の定義。Phase F で redirect 一覧を作る際にも参照する。
type Source = { num: string; href: string; title: string; desc: string };

const SOURCES: Source[] = [
  {
    num: "[1]",
    href: "https://alexop.dev/posts/spec-driven-development-claude-code-in-action/",
    title: "Spec-Driven Development with Claude Code in Action — alexop.dev (2026)",
    desc: "サブエージェントを使ったSDD実践例、task tool活用パターン",
  },
  {
    num: "[2]",
    href: "https://medium.com/@universe3523/spec-driven-development-with-claude-code-206bf56955d0",
    title: "Spec Driven Development with Claude Code — Medium (Jan 2026)",
    desc: "Requirements Agent / Design Agent / Implementation Agentの役割分担",
  },
  {
    num: "[3]",
    href: "https://agentfactory.panaversity.org/docs/General-Agents-Foundations/spec-driven-development",
    title: "Chapter 5: Spec-Driven Development with Claude Code — Agent Factory",
    desc: "CLAUDE.md, Subagents, Tasks, HooksのネイティブClaude Code機能によるSDD",
  },
  {
    num: "[4]",
    href: "https://github.com/Pimzino/claude-code-spec-workflow",
    title: "claude-code-spec-workflow — GitHub (Pimzino)",
    desc: "Requirements→Design→Tasks→Implementation の自動化ワークフロー、ディレクトリ構成",
  },
  {
    num: "[5]",
    href: "https://docs.anthropic.com/en/docs/claude-code/best-practices",
    title: "Best Practices for Claude Code — 公式ドキュメント",
    desc: "CLAUDE.mdの過剰記述アンチパターン、Hooks vs CLAUDE.md、SKILL.md活用法",
  },
  {
    num: "[6]",
    href: "https://tessl.io/blog/spec-driven-dev-with-claude-code/",
    title: "Unlocking Claude Code: Spec-Driven Development — tessl.io (Jun 2025)",
    desc: "spec.mdの作成方法、継続的更新の重要性",
  },
  {
    num: "[7]",
    href: "https://docs.anthropic.com/en/docs/claude-code/memory",
    title: "Manage Claude's Memory — 公式ドキュメント",
    desc: "CLAUDE.md階層構造、MEMORY.md仕様、@import構文、CLAUDE.local.md",
  },
  {
    num: "[8]",
    href: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    title: "Effective Context Engineering for AI Agents — Anthropic Engineering",
    desc: "ハイブリッドメモリ戦略、コンテキスト管理の設計思想",
  },
  {
    num: "[9]",
    href: "https://brianchambers.substack.com/p/chamber-of-tech-secrets-54-spec-driven",
    title: "Spec-driven Development — Chamber of Tech Secrets #54 (Jul 2025)",
    desc: "architecture.md共同編集パターン、コンテキスト管理の実践的tips",
  },
  {
    num: "[10]",
    href: "https://github.com/gotalab/cc-sdd",
    title: "cc-sdd — GitHub (gotalab)",
    desc: "Kiro式SDD、steering→spec-init→design→tasks→impl ワークフロー",
  },
  {
    num: "[11]",
    href: "https://medium.com/@porter.nicholas/teaching-claude-to-remember-part-2-remember-everything-memory-system-1b496d1f0022",
    title: "Teaching Claude To Remember Part 2 — Medium (Dec 2025)",
    desc: "project-context.md / known-gotchas.md の具体的設計パターン",
  },
  {
    num: "[12]",
    href: "https://www.anthropic.com/engineering/claude-code-best-practices",
    title: "Claude Code: Best Practices for Agentic Coding — Anthropic Engineering",
    desc: "Anthropic公式のClaude Codeベストプラクティス",
  },
  {
    num: "[13]",
    href: "https://docs.anthropic.com/en/docs/claude-code/hooks",
    title: "Claude Code Hooks — 公式ドキュメント (2026)",
    desc: "InstructionsLoadedフック、PostToolUseフック、フックイベント全種類の説明",
  },
  {
    num: "[14]",
    href: "https://docs.anthropic.com/en/docs/claude-code/skills",
    title: "Claude Code Skills — 公式ドキュメント (2026)",
    desc: "SKILL.mdフロントマター全オプション、invocation: explicit、allowed-tools、versionフィールド",
  },
  {
    num: "[15]",
    href: "https://github.com/anthropics/claude-code/releases",
    title: "Claude Code Releases — GitHub (2026)",
    desc: "v2.1.x系リリースノート: Agent Teams、.claude/rules/、.claude/agents/、autoMemoryDirectory対応",
  },
];

// コードブロック 3 ドット (macOS ウィンドウ風の赤・橙・緑)。
function CodeDots() {
  return (
    <span className={styles.codeDots}>
      <span className={styles.codeDot} style={{ background: "#f74f4f" }} />
      <span className={styles.codeDot} style={{ background: "#f7914f" }} />
      <span className={styles.codeDot} style={{ background: "#2ec9a0" }} />
    </span>
  );
}

export default function ClaudeSkillPage() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>Claude Code × Spec-Driven Development</div>
        <h1 className={styles.title}>
          AI仕様駆動開発における
          <br />
          <span>マークダウンファイル</span> 完全ガイド
        </h1>
        <p className={styles.sub}>
          各ファイルの役割・構造・ベストプラクティスをステップバイステップで解説。根拠ソース付き。
        </p>
        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${styles.badgeBlue}`}>Claude Code v2.1.76</span>
          <span className={`${styles.badge} ${styles.badgePurple}`}>Spec-Driven Development</span>
          <span className={`${styles.badge} ${styles.badgeGreen}`}>March 2026 最新版</span>
          <span className={`${styles.badge} ${styles.badgeOrange}`}>Opus 4.6 対応</span>
        </div>
      </header>

      <main className={styles.main}>
        {/* TOC */}
        <nav className={styles.toc} aria-label="目次">
          <h2>目次</h2>
          <ol>
            <li>
              <a href="#overview">AI仕様駆動開発の全体像とファイル構成</a>
            </li>
            <li>
              <a href="#claude-md">CLAUDE.md — プロジェクト永続メモリ</a>
            </li>
            <li>
              <a href="#spec-md">spec.md / spec-init — 仕様書の起点</a>
            </li>
            <li>
              <a href="#requirements-md">requirements.md — 要求定義</a>
            </li>
            <li>
              <a href="#design-md">design.md — 技術設計書</a>
            </li>
            <li>
              <a href="#tasks-md">tasks.md — タスク分解と追跡</a>
            </li>
            <li>
              <a href="#memory-md">MEMORY.md — 自動メモリシステム</a>
            </li>
            <li>
              <a href="#steering">Steering Files — チーム横断コンテキスト</a>
            </li>
            <li>
              <a href="#skill-md">SKILL.md — 再利用ナレッジ（2026年大幅強化）</a>
            </li>
            <li>
              <a href="#new-2026">2026年3月 新機能まとめ</a>
            </li>
            <li>
              <a href="#best-practices">横断ベストプラクティス10則</a>
            </li>
            <li>
              <a href="#sources">参考ソース一覧</a>
            </li>
          </ol>
        </nav>

        {/* SECTION 1 */}
        <section id="overview" className={styles.section}>
          <div className={styles.sectionLabel}>Section 01</div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>01.</span>AI仕様駆動開発の全体像とファイル構成
          </h2>

          <p>
            AI仕様駆動開発（SDD: Spec-Driven Development）では、
            <strong className={styles.strongBright}>「コードは仕様から生成される成果物」</strong>
            という考え方のもと、人間が主導して仕様書群を整備し、AIがその仕様に忠実に実装します。行き当たりばったりの「バイブコーディング」と決別し、再現性・品質・チーム共有を実現するアーキテクチャです。
          </p>

          <div className={styles.flowDiagram}>
            <div className={styles.flowTitle}>▸ SDD 4フェーズ ワークフロー</div>
            <div className={styles.flowSteps}>
              <div className={styles.flowStep}>
                <div className={`${styles.stepBox} ${styles.stepBlue}`}>
                  Phase 1<br />
                  要求定義
                </div>
                <div className={styles.stepFile}>
                  spec.md
                  <br />
                  requirements.md
                </div>
              </div>
              <div className={styles.flowArrow}>→</div>
              <div className={styles.flowStep}>
                <div className={`${styles.stepBox} ${styles.stepPurple}`}>
                  Phase 2<br />
                  技術設計
                </div>
                <div className={styles.stepFile}>
                  design.md
                  <br />
                  architecture.md
                </div>
              </div>
              <div className={styles.flowArrow}>→</div>
              <div className={styles.flowStep}>
                <div className={`${styles.stepBox} ${styles.stepGreen}`}>
                  Phase 3<br />
                  タスク分解
                </div>
                <div className={styles.stepFile}>tasks.md</div>
              </div>
              <div className={styles.flowArrow}>→</div>
              <div className={styles.flowStep}>
                <div className={`${styles.stepBox} ${styles.stepOrange}`}>
                  Phase 4<br />
                  実装・検証
                </div>
                <div className={styles.stepFile}>
                  review.md
                  <br />
                  コード
                </div>
              </div>
            </div>
          </div>

          <h3>推奨ディレクトリ構成</h3>
          <div className={styles.hierarchy}>
            <div className={styles.hItem}>
              <span className={styles.hFolder}>📁</span>
              <span>your-project/</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent1}`}>
              <span className={styles.hFileBlue}>📄</span>
              <span className={styles.hFileBlue}>CLAUDE.md</span>
              <span className={styles.hDesc}>— Claude用プロジェクト永続メモリ（必須）</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent1}`}>
              <span className={styles.hFileBlue}>📄</span>
              <span className={styles.hFileBlue}>CLAUDE.local.md</span>
              <span className={styles.hDesc}>— 個人用設定（.gitignore自動追加）</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent1}`}>
              <span className={styles.hFolder}>📁</span>
              <span>.claude/</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent2}`}>
              <span className={styles.hFolder}>📁</span>
              <span>commands/</span>
              <span className={styles.hDesc}>
                — カスタムスラッシュコマンド（legacy: skills/推奨）
              </span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent2}`}>
              <span className={styles.hFolder}>📁</span>
              <span>rules/</span>
              <span className={styles.hDesc}>
                — 条件付きルールファイル（paths: フロントマターで制御）
                <span className={styles.accentOrange}>★2026</span>
              </span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent3}`}>
              <span className={styles.hFilePurple}>📄</span>
              <span className={styles.hFilePurple}>api-rules.md</span>
              <span className={styles.hDesc}>— APIディレクトリ専用ルール</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent2}`}>
              <span className={styles.hFolder}>📁</span>
              <span>steering/</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent3}`}>
              <span className={styles.hFilePurple}>📄</span>
              <span className={styles.hFilePurple}>product.md</span>
              <span className={styles.hDesc}>— プロダクトビジョン</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent3}`}>
              <span className={styles.hFilePurple}>📄</span>
              <span className={styles.hFilePurple}>tech.md</span>
              <span className={styles.hDesc}>— 技術スタック制約</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent3}`}>
              <span className={styles.hFilePurple}>📄</span>
              <span className={styles.hFilePurple}>structure.md</span>
              <span className={styles.hDesc}>— コード構造規約</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent2}`}>
              <span className={styles.hFolder}>📁</span>
              <span>skills/</span>
              <span className={styles.hDesc}>
                — 再利用ナレッジ（推奨）<span className={styles.accentOrange}>★2026</span>
              </span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent3}`}>
              <span className={styles.hFileGreen}>📄</span>
              <span className={styles.hFileGreen}>deploy/SKILL.md</span>
              <span className={styles.hDesc}>— デプロイ手順スキル</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent2}`}>
              <span className={styles.hFolder}>📁</span>
              <span>agents/</span>
              <span className={styles.hDesc}>
                — サブエージェント定義<span className={styles.accentOrange}>★2026</span>
              </span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent3}`}>
              <span className={styles.hFileGreen}>📄</span>
              <span className={styles.hFileGreen}>review-agent.md</span>
              <span className={styles.hDesc}>— コードレビュー専用エージェント</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent1}`}>
              <span className={styles.hFolder}>📁</span>
              <span>docs/</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent2}`}>
              <span className={styles.hFileBlue}>📄</span>
              <span className={styles.hFileBlue}>spec.md</span>
              <span className={styles.hDesc}>— 仕様の起点（概要）</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent2}`}>
              <span className={styles.hFilePurple}>📄</span>
              <span className={styles.hFilePurple}>requirements.md</span>
              <span className={styles.hDesc}>— 機能/非機能要件</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent2}`}>
              <span className={styles.hFilePurple}>📄</span>
              <span className={styles.hFilePurple}>design.md</span>
              <span className={styles.hDesc}>— 技術設計書</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent2}`}>
              <span className={styles.hFileGreen}>📄</span>
              <span className={styles.hFileGreen}>tasks.md</span>
              <span className={styles.hDesc}>— タスクチェックリスト</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent1}`}>
              <span className={styles.hFolder}>📁</span>
              <span>~/.claude/projects/&lt;project&gt;/memory/</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent2}`}>
              <span className={styles.hFileGray}>📄</span>
              <span className={styles.hFileGray}>MEMORY.md</span>
              <span className={styles.hDesc}>— Claude自動生成メモリ（インデックス）</span>
            </div>
            <div className={`${styles.hItem} ${styles.hIndent2}`}>
              <span className={styles.hFileGray}>📄</span>
              <span className={styles.hFileGray}>debugging.md, api-conventions.md ...</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: CLAUDE.MD */}
        <section id="claude-md" className={styles.section}>
          <div className={styles.sectionLabel}>Section 02</div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>02.</span>CLAUDE.md — プロジェクト永続メモリ
          </h2>

          <p>
            Claude Codeが
            <strong className={styles.strongBright}>起動時に自動読み込みする最重要ファイル</strong>
            。プロジェクトの「永続的な脳」として機能し、セッションをまたいでコンテキストを維持します。ディレクトリ階層に応じた読み込み優先度があります。
          </p>

          <div className={styles.fileCard}>
            <div className={styles.fileCardHeader}>
              <div className={`${styles.fileIcon} ${styles.fileIconBlue}`}>📋</div>
              <div>
                <div className={styles.fileName}>CLAUDE.md</div>
                <div className={styles.fileRole}>
                  プロジェクト永続メモリ / 最優先読み込みファイル
                </div>
              </div>
            </div>
            <div className={styles.fileCardBody}>
              <h3>読み込み優先度（下 → 上が優先）</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>パス</th>
                    <th>スコープ</th>
                    <th>用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>~/.claude/CLAUDE.md</td>
                    <td>グローバル</td>
                    <td>個人の全プロジェクト横断設定</td>
                  </tr>
                  <tr>
                    <td>/project-root/CLAUDE.md</td>
                    <td>プロジェクト</td>
                    <td>チーム共有のプロジェクト規約（最重要）</td>
                  </tr>
                  <tr>
                    <td>CLAUDE.local.md</td>
                    <td>個人/プロジェクト</td>
                    <td>個人設定（.gitignore自動追加）</td>
                  </tr>
                  <tr>
                    <td>src/CLAUDE.md</td>
                    <td>サブディレクトリ</td>
                    <td>モジュール別補足（オンデマンド読み込み）</td>
                  </tr>
                </tbody>
              </table>

              <h3>ベストプラクティス構成テンプレート</h3>
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <CodeDots />
                  <span>CLAUDE.md</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}># Project: [プロジェクト名]</span>
                  {"\n\n"}
                  <span className={styles.hd}>## 🎯 Project Overview</span>
                  {"\n"}
                  <span className={styles.cmt}>
                    # 1〜2文でプロダクトの目的を記述。Claudeが全判断の基準にする。
                  </span>
                  {"\n"}
                  ECサイトのバックエンドAPI。Go製マイクロサービス構成。
                  {"\n\n"}
                  <span className={styles.hd}>## 🛠 Build & Test Commands</span>
                  {"\n"}
                  <span className={styles.cmt}>
                    # 最重要: Claudeが即座に実行できるコマンドを列挙
                  </span>
                  {"\n"}- Build: `go build ./...`
                  {"\n"}- Test: `go test ./... -race`
                  {"\n"}- Lint: `golangci-lint run`
                  {"\n"}- Dev: `docker-compose up -d`
                  {"\n\n"}
                  <span className={styles.hd}>## 📐 Code Style</span>
                  {"\n"}
                  <span className={styles.cmt}># Claudeが守るべきコーディング規約を明記</span>
                  {"\n"}- Go modules使用。CommonJSは使わない
                  {"\n"}- エラーハンドリング: errors.Wrap()を必ず使用
                  {"\n"}- テスト: table-driven testsを標準とする
                  {"\n"}- コメント: 英語で書く
                  {"\n\n"}
                  <span className={styles.hd}>## 🏗 Architecture</span>
                  {"\n"}
                  <span className={styles.cmt}># 主要ファイル・パターンをポインタで示す</span>
                  {"\n"}- 状態管理: internal/store/ 参照
                  {"\n"}- APIルーティング: cmd/server/main.go
                  {"\n"}- DB: PostgreSQL (マイグレーション: migrations/)
                  {"\n\n"}
                  <span className={styles.hd}>## 🔗 Imports</span>
                  {"\n"}
                  <span className={styles.cmt}># @import構文で詳細ドキュメントを参照させる</span>
                  {"\n"}@docs/design.md
                  {"\n"}@docs/api-conventions.md
                  {"\n\n"}
                  <span className={styles.hd}>## ⚠️ Constraints</span>
                  {"\n"}
                  <span className={styles.cmt}># 絶対に破ってはいけないルール</span>
                  {"\n"}- DBのmigrations/フォルダへの直接書き込み禁止
                  {"\n"}- secrets/配下ファイルは読み取りのみ
                </pre>
              </div>

              <div className={`${styles.infoBox} ${styles.infoWarn}`}>
                <span className={styles.infoIcon}>⚠️</span>
                <div>
                  <strong>アンチパターン：過剰記述</strong>
                  <br />
                  CLAUDE.mdが長すぎると、重要なルールが「ノイズ」に埋もれてClaudeが無視します。公式ドキュメントは「Claudeがすでに正しくできることは書かない。Hooksで強制できるなら削除する」と推奨しています。目安は
                  <strong>500行以内</strong>。
                </div>
              </div>

              <div className={`${styles.infoBox} ${styles.infoTip}`}>
                <span className={styles.infoIcon}>💡</span>
                <div>
                  <strong>@import構文</strong>でファイルを参照可能。
                  <code>@docs/git-instructions.md</code>
                  のように書くと、その内容がコンテキストに注入されます。相対パスは「そのファイルからの相対」になります。
                </div>
              </div>

              <div className={`${styles.infoBox} ${styles.infoNote}`}>
                <span className={styles.infoIcon}>🆕</span>
                <div>
                  <strong>2026年3月 更新：HTMLコメント非表示化</strong>
                  <br />
                  CLAUDE.mdの <code>&lt;!-- ... --&gt;</code>{" "}
                  HTMLコメントは、自動注入時にClaudeに見えなくなりました。ただし <code>Read</code>{" "}
                  ツールで読み取ると引き続き可視です。コメントを整理情報として活用できます。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SPEC.MD */}
        <section id="spec-md" className={styles.section}>
          <div className={styles.sectionLabel}>Section 03</div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>03.</span>spec.md — 仕様書の起点
          </h2>

          <p>
            SDDの出発点となるファイル。アプリケーションの
            <strong className={styles.strongBright}>
              「何を作るか」を人間とClaudeが合意するための設計図
            </strong>
            。ここが明確であるほど、後続のrequirements.md・design.md・tasks.mdの品質が高まります。
          </p>

          <div className={styles.fileCard}>
            <div className={styles.fileCardHeader}>
              <div className={`${styles.fileIcon} ${styles.fileIconPurple}`}>📝</div>
              <div>
                <div className={styles.fileName}>spec.md</div>
                <div className={styles.fileRole}>仕様書の起点 / プロダクト概要</div>
              </div>
            </div>
            <div className={styles.fileCardBody}>
              <h3>2つのアプローチ</h3>
              <div className={styles.grid2}>
                <div className={styles.miniCard}>
                  <h4>🤖 AI生成 → 人間レビュー</h4>
                  <p>
                    「TODOアプリ（優先度・日付・タグ機能付き）のspecを作成して」と依頼し、Claudeが草案を作成。人間が仮定の修正・エッジケースの追加を行う。速度重視。
                  </p>
                </div>
                <div className={styles.miniCard}>
                  <h4>✍️ 手動作成 → AI補完</h4>
                  <p>
                    自分でspec.mdを書き込み、Claudeに「このspecの抜け漏れを指摘して」と依頼。品質重視。複雑なドメイン知識を持つ場合に適する。
                  </p>
                </div>
              </div>

              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <CodeDots />
                  <span>docs/spec.md — テンプレート</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}># [機能名] 仕様書</span>
                  {"\n\n"}
                  <span className={styles.hd}>## 概要</span>
                  {"\n"}
                  <span className={styles.cmt}># 何を・なぜ・誰のために作るかを2〜4文で記述</span>
                  {"\n"}
                  ユーザーが商品を事前予約できるプリオーダーシステム。
                  {"\n"}
                  在庫切れ状態でも購入確定できることでCVRを向上させる。
                  {"\n\n"}
                  <span className={styles.hd}>## 主要機能</span>
                  {"\n"}
                  <span className={styles.cmt}># ユーザー視点で「何ができるか」を箇条書き</span>
                  {"\n"}- 商品詳細ページ: 画像・名称・説明・数量選択
                  {"\n"}- チェックアウト: ログイン→配送選択→決済
                  {"\n"}- マイページ: 注文履歴・ステータス確認
                  {"\n\n"}
                  <span className={styles.hd}>## 非機能要件（制約）</span>
                  {"\n"}
                  <span className={styles.cmt}>
                    # パフォーマンス・セキュリティ・技術スタック制約
                  </span>
                  {"\n"}- 同時接続1,000件対応（Redis在庫予約使用）
                  {"\n"}- 決済はStripe APIを使用
                  {"\n"}- レスポンスタイム p99 &lt; 500ms
                  {"\n\n"}
                  <span className={styles.hd}>## 依存ライブラリ・外部サービス</span>
                  {"\n"}
                  <span className={styles.cmt}>
                    # Claudeが「なぜこれを使うか」を知るためのメモ付き
                  </span>
                  {"\n"}- Stripe: 決済処理（SCA対応）
                  {"\n"}- Redis: 在庫ロック（原子的操作）
                  {"\n"}- PostgreSQL: 永続ストレージ
                  {"\n\n"}
                  <span className={styles.hd}>## 「完了」の定義</span>
                  {"\n"}
                  <span className={styles.cmt}># Acceptance Criteria — テスト可能な形で記述</span>
                  {"\n"}- [ ] プリオーダー完了後、確認メールが届く
                  {"\n"}- [ ] 在庫0状態でもカートに追加できる
                  {"\n"}- [ ] 管理画面で注文一覧が確認できる
                </pre>
              </div>

              <div className={`${styles.infoBox} ${styles.infoNote}`}>
                <span className={styles.infoIcon}>ℹ️</span>
                <div>
                  <strong>重要:</strong> spec.mdは実装中も
                  <strong>継続的に更新</strong>
                  します。「コードが変わったらspecも変える」という規律がプロジェクトの健全性を保ちます。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: REQUIREMENTS.MD */}
        <section id="requirements-md" className={styles.section}>
          <div className={styles.sectionLabel}>Section 04</div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>04.</span>requirements.md — 要求定義
          </h2>

          <p>
            spec.mdをClaudeが解析し、
            <strong className={styles.strongBright}>
              機能要件・非機能要件・システムスコープに分解した詳細ドキュメント
            </strong>
            。ステークホルダーと実装チームの「契約書」として機能します。
          </p>

          <div className={styles.fileCard}>
            <div className={styles.fileCardHeader}>
              <div className={`${styles.fileIcon} ${styles.fileIconOrange}`}>📋</div>
              <div>
                <div className={styles.fileName}>requirements.md</div>
                <div className={styles.fileRole}>機能要件 / 非機能要件 / 受け入れ基準</div>
              </div>
            </div>
            <div className={styles.fileCardBody}>
              <h3>生成プロンプト例</h3>
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <span>Claude Codeへの指示</span>
                </div>
                <pre className={styles.pre}>
                  claude -p &quot;docs/spec.md を解析し、機能要件と非機能要件に分解した{"\n"}
                  requirements.md を生成してください。{"\n"}
                  各要件にはID(REQ-001形式)と受け入れ基準を付与してください。&quot;
                </pre>
              </div>

              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <CodeDots />
                  <span>docs/requirements.md — テンプレート</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}># 要求定義書</span>
                  {"\n\n"}
                  <span className={styles.hd}>## 機能要件（Functional Requirements）</span>
                  {"\n\n"}
                  <span className={styles.kw}>### FR-001: プリオーダー登録</span>
                  {"\n"}
                  **概要**: 在庫切れ商品をカートに追加できる{"\n"}
                  **優先度**: P0 (Must Have){"\n"}
                  **受け入れ基準**:{"\n"}- 在庫0の商品でも「予約する」ボタンが表示される
                  {"\n"}- カート追加後、確認画面で&quot;予約注文&quot;と表示される
                  {"\n"}- ユーザー未ログイン時はログイン画面にリダイレクト
                  {"\n\n"}
                  <span className={styles.kw}>### FR-002: 決済処理</span>
                  {"\n"}
                  **概要**: Stripe経由でクレジットカード決済を実行
                  {"\n"}
                  ...{"\n\n"}
                  <span className={styles.hd}>## 非機能要件（Non-Functional Requirements）</span>
                  {"\n\n"}
                  <span className={styles.kw}>### NFR-001: パフォーマンス</span>
                  {"\n"}- 商品ページ読み込み: p99 &lt; 500ms
                  {"\n"}- 在庫ロック処理: &lt; 100ms（Redis使用）
                  {"\n\n"}
                  <span className={styles.kw}>### NFR-002: セキュリティ</span>
                  {"\n"}- 決済情報はサーバー側で保持しない（Stripe Token使用）
                  {"\n"}- CSRF対策必須
                  {"\n\n"}
                  <span className={styles.hd}>## スコープ外（Out of Scope）</span>
                  {"\n"}- モバイルアプリ対応（今フェーズはWeb only）
                  {"\n"}- 複数通貨対応
                </pre>
              </div>

              <div className={`${styles.infoBox} ${styles.infoTip}`}>
                <span className={styles.infoIcon}>💡</span>
                <div>
                  要件に<strong>優先度（P0/P1/P2）</strong>と<strong>ID（FR-001形式）</strong>
                  を付けることで、tasks.mdでのトレーサビリティを確保できます。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: DESIGN.MD */}
        <section id="design-md" className={styles.section}>
          <div className={styles.sectionLabel}>Section 05</div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>05.</span>design.md / architecture.md — 技術設計書
          </h2>

          <p>
            requirements.mdをもとにClaudeが生成する
            <strong className={styles.strongBright}>
              システムアーキテクチャ・API設計・データモデルの詳細設計書
            </strong>
            。Mermaid記法のシーケンス図やER図を含めることで視覚的な理解を促します。
          </p>

          <div className={styles.fileCard}>
            <div className={styles.fileCardHeader}>
              <div className={`${styles.fileIcon} ${styles.fileIconGreen}`}>🏛</div>
              <div>
                <div className={styles.fileName}>design.md / architecture.md</div>
                <div className={styles.fileRole}>システム設計 / API / データモデル</div>
              </div>
            </div>
            <div className={styles.fileCardBody}>
              <h3>設計書生成プロンプト例</h3>
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <span>Claude Codeへの指示</span>
                </div>
                <pre className={styles.pre}>
                  claude -p &quot;requirements.md に基づいてdesign.mdを作成してください。{"\n"}
                  マイクロサービスアーキテクチャを提案し、{"\n"}
                  各サービスのAPIエンドポイント、データモデル（DDL）、{"\n"}
                  チェックアウトフローのシーケンス図（Mermaid形式）を含めてください。&quot;
                </pre>
              </div>

              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <CodeDots />
                  <span>docs/design.md — テンプレート</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}># 技術設計書</span>
                  {"\n\n"}
                  <span className={styles.hd}>## アーキテクチャ概要</span>
                  {"\n"}
                  マイクロサービス構成。API Gateway → User Service / Order Service / Inventory
                  Service
                  {"\n\n"}
                  <span className={styles.hd}>## サービス一覧</span>
                  {"\n\n"}
                  <span className={styles.kw}>### Order Service</span>
                  {"\n"}
                  **責務**: 注文の作成・ステータス管理{"\n"}
                  **API Endpoints**:{"\n"}- POST /orders — 注文作成
                  {"\n"}- GET /orders/{"{id}"} — 注文詳細
                  {"\n"}- PUT /orders/{"{id}"}/confirm — 在庫確保後の確定
                  {"\n\n"}
                  <span className={styles.hd}>## データモデル（DDL）</span>
                  {"\n"}```sql{"\n"}
                  CREATE TABLE orders ({"\n"}
                  {"  "}id UUID PRIMARY KEY DEFAULT gen_random_uuid(),{"\n"}
                  {"  "}user_id UUID NOT NULL REFERENCES users(id),{"\n"}
                  {"  "}status VARCHAR(20) CHECK (status IN
                  (&apos;pending&apos;,&apos;confirmed&apos;,&apos;cancelled&apos;)),{"\n"}
                  {"  "}created_at TIMESTAMPTZ DEFAULT NOW(){"\n"});{"\n"}```{"\n\n"}
                  <span className={styles.hd}>## シーケンス図（チェックアウト）</span>
                  {"\n"}```mermaid{"\n"}sequenceDiagram{"\n"}
                  {"  "}Client-&gt;&gt;API Gateway: POST /checkout
                  {"\n"}
                  {"  "}API Gateway-&gt;&gt;Inventory Service: ロック在庫
                  {"\n"}
                  {"  "}Inventory Service--&gt;&gt;API Gateway: OK
                  {"\n"}
                  {"  "}API Gateway-&gt;&gt;Payment Service: Stripe課金
                  {"\n"}
                  {"  "}Payment Service--&gt;&gt;API Gateway: 決済完了
                  {"\n"}
                  {"  "}API Gateway-&gt;&gt;Order Service: 注文確定
                  {"\n"}
                  {"  "}Order Service--&gt;&gt;Client: 201 Created{"\n"}```{"\n\n"}
                  <span className={styles.hd}>## 技術スタック</span>
                  {"\n"}| レイヤー | 技術 | 選定理由 |{"\n"}|---------|------|---------|{"\n"}| API
                  | Go + chi | 軽量・高速 |{"\n"}| DB | PostgreSQL | ACID準拠 |{"\n"}| Cache | Redis
                  | 原子的在庫ロック |
                </pre>
              </div>

              <div className={`${styles.infoBox} ${styles.infoNote}`}>
                <span className={styles.infoIcon}>ℹ️</span>
                <div>
                  architecture.mdは実装を進めながら
                  <strong>人間とClaudeが共同編集</strong>
                  します。「3〜4タスク完了後にClaudeにコードレビューとarchitecture.md更新を依頼する」サイクルが効果的です（[9]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: TASKS.MD */}
        <section id="tasks-md" className={styles.section}>
          <div className={styles.sectionLabel}>Section 06</div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>06.</span>tasks.md — タスク分解と追跡
          </h2>

          <p>
            design.mdからClaudeが生成する
            <strong className={styles.strongBright}>実装の「道路地図」</strong>
            。各タスクは独立してテスト可能な粒度に分解され、チェックボックスで進捗を追跡します。セッション間でClaudeの「記憶喪失」を防ぐ最重要ファイルです。
          </p>

          <div className={styles.fileCard}>
            <div className={styles.fileCardHeader}>
              <div className={`${styles.fileIcon} ${styles.fileIconGreen}`}>✅</div>
              <div>
                <div className={styles.fileName}>tasks.md</div>
                <div className={styles.fileRole}>実装タスクチェックリスト / 進捗追跡</div>
              </div>
            </div>
            <div className={styles.fileCardBody}>
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <CodeDots />
                  <span>docs/tasks.md</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}># 実装タスクリスト</span>
                  {"\n"}
                  <span className={styles.cmt}># 各タスクは単独でテスト可能な粒度にする</span>
                  {"\n\n"}
                  <span className={styles.hd}>## Phase 1: 基盤構築</span>
                  {"\n"}- [x] Task 1: User Serviceの/users/registerエンドポイント作成 + 単体テスト
                  {"\n"}- [x] Task 2: JWTミドルウェア実装
                  {"\n"}- [ ] Task 3: PostgreSQLマイグレーション（orders, inventory テーブル）
                  {"\n\n"}
                  <span className={styles.hd}>## Phase 2: コアロジック</span>
                  {"\n"}- [ ] Task 4: Inventory Serviceの在庫ロック（Redis SETNX）
                  {"\n  "}**依存**: Task 3完了が前提
                  {"\n  "}**Ref**: FR-001, NFR-001
                  {"\n"}- [ ] Task 5: Order Service — 注文作成エンドポイント
                  {"\n"}- [ ] Task 6: Stripe決済フロー統合
                  {"\n\n"}
                  <span className={styles.hd}>## Phase 3: 検証</span>
                  {"\n"}- [ ] Task 7: E2Eテスト（チェックアウトフロー全体）
                  {"\n"}- [ ] Task 8: 負荷テスト（k6, 1,000同時接続）
                  {"\n\n"}
                  <span className={styles.hd}>## ブロッカー</span>
                  {"\n"}
                  <span className={styles.cmt}>
                    # Claudeが詰まった問題を記録。後続セッションへの引き継ぎ情報
                  </span>
                  {"\n"}- Task 4: Redis Luaスクリプトのタイムアウト処理要調査
                </pre>
              </div>

              <h3>Claudeへのタスク実行指示パターン</h3>
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <span>Claude Codeへの指示</span>
                </div>
                <pre className={styles.pre}>
                  design.md のアーキテクチャを把握してください。{"\n"}
                  tasks.md のTask 3を実行: 「PostgreSQLマイグレーション作成」{"\n"}
                  Goで実装し、単体テストも作成してください。テストはすべてパスさせること。{"\n"}
                  完了後にgit commitしてください。
                </pre>
              </div>

              <div className={`${styles.infoBox} ${styles.infoTip}`}>
                <span className={styles.infoIcon}>💡</span>
                <div>
                  <strong>サブエージェント活用</strong>:{" "}
                  <code>
                    implement @docs/tasks.md - use the task tool, each task should only be done by a
                    subagent, do a commit before continuing
                  </code>
                  と指示することで、各タスクを独立したコンテキストウィンドウで処理し、コンテキスト汚染を防げます（[1]）。
                </div>
              </div>

              <div className={`${styles.infoBox} ${styles.infoWarn}`}>
                <span className={styles.infoIcon}>⚠️</span>
                <div>
                  <strong>コンテキスト管理</strong>:
                  tasks.mdとarchitecture.mdに重要事項が記載されていれば、
                  <strong>コンテキストクリア（/clear）しても大丈夫</strong>
                  。セッションをまたぐ情報はこれらのファイルに書き出しておきます（[9]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: MEMORY.MD */}
        <section id="memory-md" className={styles.section}>
          <div className={styles.sectionLabel}>Section 07</div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>07.</span>MEMORY.md — 自動メモリシステム
          </h2>

          <p>
            Claude Codeが
            <strong className={styles.strongBright}>自動的に書き込む</strong>
            メモリファイル。人間が書くCLAUDE.mdとは異なり、Claudeが作業中に発見したパターン・学習・洞察を記録します（2026年現在
            GA・デフォルト有効）。
          </p>

          <div className={styles.fileCard}>
            <div className={styles.fileCardHeader}>
              <div className={`${styles.fileIcon} ${styles.fileIconPurple}`}>🧠</div>
              <div>
                <div className={styles.fileName}>MEMORY.md</div>
                <div className={styles.fileRole}>Claude自動生成メモリ / インデックスファイル</div>
              </div>
            </div>
            <div className={styles.fileCardBody}>
              <div className={styles.grid2}>
                <div className={styles.miniCard}>
                  <h4>📍 保存場所</h4>
                  <p>
                    <code>~/.claude/projects/&lt;project&gt;/memory/MEMORY.md</code>
                    <br />
                    gitリポジトリルートで一意のディレクトリが決定される。
                  </p>
                </div>
                <div className={styles.miniCard}>
                  <h4>⚡ 読み込み仕様</h4>
                  <p>
                    MEMORY.mdの<strong>先頭200行</strong>
                    のみが毎セッション自動注入。200行超の詳細はトピックファイルに分割。
                  </p>
                </div>
                <div className={styles.miniCard}>
                  <h4>📁 トピックファイル</h4>
                  <p>
                    <code>debugging.md</code>, <code>api-conventions.md</code>{" "}
                    等のファイルはオンデマンド読み込み。indexとして参照される。
                  </p>
                </div>
                <div className={styles.miniCard}>
                  <h4>✏️ 手動編集 &amp; トグル</h4>
                  <p>
                    <code>/memory</code> コマンドでファイルセレクター &amp; auto memory
                    トグルが開く。<code>settings.json</code> の <code>autoMemoryEnabled</code>{" "}
                    でプロジェクト単位のオン/オフも可能。
                  </p>
                </div>
                <div className={styles.miniCard}>
                  <h4>🆕 autoMemoryDirectory</h4>
                  <p>
                    <code>autoMemoryDirectory</code>
                    設定でメモリ保存先ディレクトリをカスタマイズ可能（2026年3月〜）。チームでメモリ先を統一したい場合に活用。
                  </p>
                </div>
                <div className={styles.miniCard}>
                  <h4>🕐 最終更新タイムスタンプ</h4>
                  <p>
                    メモリファイルに最終更新日時が自動付与されるようになりました。Claudeが「どの記憶が新鮮か」を判断できます（2026年3月〜）。
                  </p>
                </div>
              </div>

              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <CodeDots />
                  <span>~/.claude/projects/myapp/memory/MEMORY.md — 構造例</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.hd}># Project Memory Index</span>
                  {"\n"}
                  <span className={styles.cmt}># このファイルは先頭200行のみ毎回読み込まれる</span>
                  {"\n\n"}
                  <span className={styles.hd}>## Current State</span>
                  {"\n"}- バージョン: v1.2.0（2025-12-01リリース）
                  {"\n"}- 直近の変更: RedisキャッシュをValkey 8に移行済み
                  {"\n"}- 進行中: GraphQL APIのスキーマ更新（design.md参照）
                  {"\n\n"}
                  <span className={styles.hd}>## Tech Stack（Quick Reference）</span>
                  {"\n"}- Runtime: Go 1.23
                  {"\n"}- DB: PostgreSQL 16（接続: DATABASE_URL環境変数）
                  {"\n"}- Cache: Valkey 8（Redis互換）
                  {"\n"}- CI: GitHub Actions
                  {"\n\n"}
                  <span className={styles.hd}>## Topic Files</span>
                  {"\n"}
                  <span className={styles.cmt}>
                    # 詳細はオンデマンドで読み込まれるトピックファイルを参照
                  </span>
                  {"\n"}- ./debugging.md — 既知のバグパターンと回避策
                  {"\n"}- ./api-conventions.md — REST API設計規約
                  {"\n"}- ./known-gotchas.md — 落とし穴とアンチパターン
                  {"\n\n"}
                  <span className={styles.hd}>## User Preferences</span>
                  {"\n"}- コードレビュー: Quality &gt; Speed
                  {"\n"}- テスト: TDD必須（まずテストを書く）
                </pre>
              </div>

              <div className={`${styles.infoBox} ${styles.infoNote}`}>
                <span className={styles.infoIcon}>ℹ️</span>
                <div>
                  known-gotchas.mdへの追記は{" "}
                  <code># Add to known-gotchas: サーバーレス関数はメモリを共有しない</code> のように
                  <code>#</code>ショートカットで即座に行えます。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: STEERING */}
        <section id="steering" className={styles.section}>
          <div className={styles.sectionLabel}>Section 08</div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>08.</span>Steering Files &amp; Rules —
            チーム横断コンテキスト
          </h2>

          <p>
            <code>.claude/steering/</code>配下に置く
            <strong className={styles.strongBright}>
              チーム全体で共有する長期的コンテキストファイル群
            </strong>
            。product.md・tech.md・structure.mdの3ファイルが基本セットです。2026年から{" "}
            <code>.claude/rules/</code> ディレクトリによる
            <strong className={styles.accentOrange}>条件付きルール</strong>
            も利用可能になりました。
          </p>

          <div className={styles.grid2}>
            <div className={styles.fileCard}>
              <div className={styles.fileCardHeader}>
                <div className={`${styles.fileIcon} ${styles.fileIconRed}`}>🎯</div>
                <div>
                  <div className={styles.fileName}>product.md</div>
                  <div className={styles.fileRole}>プロダクトビジョン・ペルソナ</div>
                </div>
              </div>
              <div className={styles.fileCardBody}>
                <div className={styles.codeBlock}>
                  <div className={styles.codeHeader}>
                    <span>.claude/steering/product.md</span>
                  </div>
                  <pre className={styles.pre}>
                    <span className={styles.hd}># Product Vision</span>
                    {"\n"}中小EC向けの在庫管理SaaS。{"\n"}ペルソナ: IT非専門の店舗オーナー{"\n"}
                    KPI: 在庫ミス率を90%削減{"\n"}競合優位: セットアップ10分以内
                  </pre>
                </div>
              </div>
            </div>
            <div className={styles.fileCard}>
              <div className={styles.fileCardHeader}>
                <div className={`${styles.fileIcon} ${styles.fileIconGreen}`}>⚙️</div>
                <div>
                  <div className={styles.fileName}>tech.md</div>
                  <div className={styles.fileRole}>技術スタック制約・禁止事項</div>
                </div>
              </div>
              <div className={styles.fileCardBody}>
                <div className={styles.codeBlock}>
                  <div className={styles.codeHeader}>
                    <span>.claude/steering/tech.md</span>
                  </div>
                  <pre className={styles.pre}>
                    <span className={styles.hd}># Tech Constraints</span>
                    {"\n"}必須: Go 1.23, PostgreSQL 16{"\n"}禁止: ORM使用（raw SQLのみ）{"\n"}禁止:
                    グローバル変数{"\n"}テスト: 最低カバレッジ80%
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.fileCard} style={{ marginTop: "1.5rem" }}>
            <div className={styles.fileCardHeader}>
              <div className={`${styles.fileIcon} ${styles.fileIconOrange}`}>📐</div>
              <div>
                <div className={styles.fileName}>
                  .claude/rules/*.md
                  <span className={styles.newMark}>★ 2026年新機能</span>
                </div>
                <div className={styles.fileRole}>
                  条件付きルールファイル — パス・状況に応じて自動適用
                </div>
              </div>
            </div>
            <div className={styles.fileCardBody}>
              <p style={{ fontSize: "0.88rem" }}>
                CLAUDE.mdの全セッション適用と異なり、<code>paths:</code> フロントマターで
                <strong className={styles.strongBright}>
                  特定ディレクトリ・ファイルに対してのみ適用されるルール
                </strong>
                を定義できます。巨大モノレポでのモジュール別ルール管理に最適です。
              </p>
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <CodeDots />
                  <span>.claude/rules/api-rules.md — 条件付きルール例</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.cmt}>---</span>
                  {"\n"}
                  <span className={styles.cmt}>description: API層のコーディングルール</span>
                  {"\n"}
                  <span className={styles.cmt}>paths:</span>
                  {"\n"}
                  <span className={styles.cmt}>{"  "}- &quot;src/api/**&quot;</span>
                  {"\n"}
                  <span className={styles.cmt}>{"  "}- &quot;src/handlers/**&quot;</span>
                  {"\n"}
                  <span className={styles.cmt}>---</span>
                  {"\n\n"}
                  <span className={styles.hd}># API Layer Rules</span>
                  {"\n\n"}
                  <span className={styles.hd}>## 必須事項</span>
                  {"\n"}- すべてのエンドポイントにOpenAPI形式のコメントを付ける
                  {"\n"}- 入力バリデーションは必ずhandler層で行う
                  {"\n"}- エラーレスポンスは統一フォーマット: {"{error, code, message}"}
                  {"\n\n"}
                  <span className={styles.hd}>## 禁止事項</span>
                  {"\n"}- ビジネスロジックをhandler層に書かない（service層に委譲）
                  {"\n"}- 直接DBアクセス（repositoryを経由すること）
                </pre>
              </div>
              <div className={`${styles.infoBox} ${styles.infoTip}`}>
                <span className={styles.infoIcon}>💡</span>
                <div>
                  <code>paths:</code>{" "}
                  に一致するファイルにClaudeが触れるとき、このルールが自動注入されます。
                  <strong>InstructionsLoadedフック</strong>
                  でルールの読み込みをフック処理することも可能です。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: SKILL.MD */}
        <section id="skill-md" className={styles.section}>
          <div className={styles.sectionLabel}>Section 09</div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>09.</span>SKILL.md — 再利用ナレッジ
            <span className={styles.subSmall}>2026年大幅強化</span>
          </h2>

          <p>
            <code>.claude/skills/</code>配下に置く
            <strong className={styles.strongBright}>
              ドメイン知識・繰り返しワークフローのカプセル化ファイル
            </strong>
            。チームの「ベストプラクティスのライブラリ」として機能します。
            <strong className={styles.accentOrange}>2026年2月より全プランで無料利用可能</strong>
            になり、フロントマターオプションも大幅に強化されました。
          </p>

          <h3>
            フロントマター全オプション一覧
            <span className={styles.subSmall}>2026年3月時点</span>
          </h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>キー</th>
                <th>型</th>
                <th>説明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>name</td>
                <td>string</td>
                <td>
                  スキルの識別名（スラッシュコマンド <code>/name</code> で呼び出し可能）
                </td>
              </tr>
              <tr>
                <td>description</td>
                <td>string</td>
                <td>自動トリガー条件を記述。Claudeがこのテキストで関連性を判断する（最重要）</td>
              </tr>
              <tr>
                <td>invocation</td>
                <td>
                  <code>explicit</code>
                </td>
                <td>自動適用を無効化し、明示的な呼び出しのみに限定する</td>
              </tr>
              <tr>
                <td>allowed-tools</td>
                <td>string[]</td>
                <td>このスキル内でClaudeが使用できるツールを制限する（セキュリティ強化）</td>
              </tr>
              <tr>
                <td>version</td>
                <td>string</td>
                <td>スキルのバージョン管理。チームでの変更追跡に活用（2026年2月〜）</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.fileCard}>
            <div className={styles.fileCardHeader}>
              <div className={`${styles.fileIcon} ${styles.fileIconBlue}`}>🎓</div>
              <div>
                <div className={styles.fileName}>SKILL.md</div>
                <div className={styles.fileRole}>
                  再利用ナレッジ / チームノウハウ — フロントマター完全版
                </div>
              </div>
            </div>
            <div className={styles.fileCardBody}>
              <h3>① 自動トリガー型スキル（基本パターン）</h3>
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <CodeDots />
                  <span>.claude/skills/database-migration/SKILL.md</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.cmt}>---</span>
                  {"\n"}
                  <span className={styles.cmt}>name: database-migration</span>
                  {"\n"}
                  <span className={styles.cmt}>description: &gt;</span>
                  {"\n"}
                  <span className={styles.cmt}>
                    {"  "}DBスキーマ変更を伴う実装タスクで呼び出す。
                  </span>
                  {"\n"}
                  <span className={styles.cmt}>
                    {"  "}「マイグレーション作成」「テーブル追加」「カラム変更」
                  </span>
                  {"\n"}
                  <span className={styles.cmt}>
                    {"  "}「スキーマ更新」と言われたときに使用する。
                  </span>
                  {"\n"}
                  <span className={styles.cmt}>allowed-tools:</span>
                  {"\n"}
                  <span className={styles.cmt}>{"  "}- Read</span>
                  {"\n"}
                  <span className={styles.cmt}>{"  "}- Write</span>
                  {"\n"}
                  <span className={styles.cmt}>{"  "}- Bash</span>
                  {"\n"}
                  <span className={styles.cmt}>---</span>
                  {"\n\n"}
                  <span className={styles.hd}># Database Migration Skill</span>
                  {"\n\n"}
                  <span className={styles.hd}>## 手順</span>
                  {"\n"}1. `migrations/`配下に `YYYYMMDD_description.up.sql` を作成{"\n"}2.
                  ロールバック用 `.down.sql` も必ず作成{"\n"}3. `make migrate-test`
                  でステージング適用確認{"\n"}4. PRにマイグレーション内容を記載
                  {"\n\n"}
                  <span className={styles.hd}>## 禁止事項</span>
                  {"\n"}- 既存マイグレーションファイルの編集
                  {"\n"}- NULL制約の後付け（データがある場合）
                </pre>
              </div>

              <h3>
                ② 明示呼び出し専用スキル（<code>invocation: explicit</code>）
              </h3>
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <CodeDots />
                  <span>.claude/skills/pre-commit-check/SKILL.md</span>
                </div>
                <pre className={styles.pre}>
                  <span className={styles.cmt}>---</span>
                  {"\n"}
                  <span className={styles.cmt}>name: pre-commit-check</span>
                  {"\n"}
                  <span className={styles.cmt}>description: &gt;</span>
                  {"\n"}
                  <span className={styles.cmt}>{"  "}コミット前に全テスト・ビルドを実行する。</span>
                  {"\n"}
                  <span className={styles.cmt}>
                    {"  "}/pre-commit-check コマンドでのみ呼び出す。
                  </span>
                  {"\n"}
                  <span className={styles.cmt}>invocation: explicit</span>
                  {"\n"}
                  <span className={styles.cmt}>allowed-tools:</span>
                  {"\n"}
                  <span className={styles.cmt}>{"  "}- Bash</span>
                  {"\n"}
                  <span className={styles.cmt}>{"  "}- Read</span>
                  {"\n"}
                  <span className={styles.cmt}>{"  "}- Grep</span>
                  {"\n"}
                  <span className={styles.cmt}>---</span>
                  {"\n\n"}
                  <span className={styles.hd}># コミット前チェック</span>
                  {"\n\n"}
                  <span className={styles.hd}>## 実行手順</span>
                  {"\n\n"}
                  <span className={styles.kw}>### Step 1: フロントエンドビルド</span>
                  {"\n"}`cd web &amp;&amp; bun run build`{"\n\n"}
                  <span className={styles.kw}>### Step 2: フロントエンドテスト</span>
                  {"\n"}`cd web &amp;&amp; bun test`{"\n\n"}
                  <span className={styles.kw}>### Step 3: バックエンドテスト</span>
                  {"\n"}`cd scraper &amp;&amp; uv run pytest`{"\n\n"}
                  <span className={styles.hd}>## 判定基準</span>
                  {"\n"}全ステップ成功 → 「コミット OK」と報告{"\n"}
                  いずれか失敗 → 停止してエラー内容を報告
                </pre>
              </div>

              <div className={`${styles.infoBox} ${styles.infoTip}`}>
                <span className={styles.infoIcon}>💡</span>
                <div>
                  <strong>配置場所は 3 種類（2026年2月〜）：</strong>
                  <br />• <strong>プロジェクト</strong>:{" "}
                  <code>.claude/skills/&lt;name&gt;/SKILL.md</code>（リポジトリ内、チーム共有）
                  <br />• <strong>個人</strong>: <code>~/.claude/skills/&lt;name&gt;/SKILL.md</code>
                  （全プロジェクト横断）
                  <br />• <strong>追加ディレクトリ</strong>: <code>--add-dir /path/to/dir</code>{" "}
                  で指定したディレクトリ内の <code>.claude/skills/</code> も自動ロード
                  <br />
                  <code>invocation: explicit</code> のスキルは <code>/skill-name</code>{" "}
                  での手動呼び出しのみ有効になります。
                </div>
              </div>

              <div className={`${styles.infoBox} ${styles.infoWarn}`}>
                <span className={styles.infoIcon}>⚠️</span>
                <div>
                  <strong>description は「トリガー文書」として書く</strong>
                  <br />
                  Claudeは <code>description</code>{" "}
                  フィールドを読んで「このスキルを今呼ぶべきか」を判断します。単なる説明文ではなく、
                  <strong>どんな状況・キーワードで使うか</strong>
                  を具体的に列挙するのがベストプラクティスです。このファイルのSKILL.mdが実例として参考になります。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: NEW 2026 */}
        <section id="new-2026" className={styles.section}>
          <div className={styles.sectionLabel}>Section 10</div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>10.</span>2026年3月 新機能まとめ
          </h2>

          <p>
            Claude Code は
            2026年に入り急速に進化しています。SDD実践に影響する主要な新機能を整理します。
          </p>

          <div className={styles.principles}>
            <div className={`${styles.principle} ${styles.pOrange}`}>
              <div className={styles.principleNum}>NEW</div>
              <h4>🤝 Agent Teams（マルチエージェント）</h4>
              <p>
                複数のClaudeインスタンスが並列で協調作業。<code>claude --team</code>
                で起動。tasks.mdのタスクを各エージェントに割り当て可能。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pBlue}`}>
              <div className={styles.principleNum}>NEW</div>
              <h4>📐 .claude/rules/ — 条件付きルール</h4>
              <p>
                <code>paths:</code>
                フロントマターで特定ディレクトリのみに適用されるルールを定義。モノレポの部分適用に最適。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pPurple}`}>
              <div className={styles.principleNum}>NEW</div>
              <h4>🪝 InstructionsLoaded フック</h4>
              <p>
                CLAUDE.md・SKILL.md読み込み完了後に任意のスクリプトを実行できる新フックイベント。環境変数の動的注入などに活用。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pGreen}`}>
              <div className={styles.principleNum}>UPD</div>
              <h4>🧠 MEMORY.md — autoMemoryDirectory</h4>
              <p>
                メモリ保存先をカスタムディレクトリに変更可能に。最終更新タイムスタンプが自動付与されるようになった。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pRed}`}>
              <div className={styles.principleNum}>UPD</div>
              <h4>🎓 SKILL.md — version フィールド追加</h4>
              <p>
                フロントマターに <code>version: &quot;1.2.0&quot;</code>{" "}
                を記載可能。チームでのスキル変更追跡・互換性管理に活用できる。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pBlue}`}>
              <div className={styles.principleNum}>UPD</div>
              <h4>🔦 CLAUDE.md — HTMLコメント非表示</h4>
              <p>
                自動注入時に <code>&lt;!-- --&gt;</code>{" "}
                コメントがClaudeに見えなくなった。コメントを整理用メモとして自由に記述できる。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pPurple}`}>
              <div className={styles.principleNum}>NEW</div>
              <h4>🤖 .claude/agents/ — サブエージェント定義</h4>
              <p>
                特定用途のサブエージェント（コードレビュー専用・テスト専用など）を事前定義し、
                <code>/agent-name</code> で呼び出し可能。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pOrange}`}>
              <div className={styles.principleNum}>NEW</div>
              <h4>🌐 Web Fetch ツール（組み込み）</h4>
              <p>
                外部ドキュメント・APIリファレンスをセッション内で直接取得・参照できるWeb
                Fetchが標準ツールとして追加。
              </p>
            </div>
          </div>

          <div className={`${styles.infoBox} ${styles.infoNote}`} style={{ marginTop: "1.5rem" }}>
            <span className={styles.infoIcon}>📅</span>
            <div>
              上記は <strong>2026年3月21日</strong> 時点の情報です。Claude
              Codeは活発に開発が進んでいるため、最新情報は{" "}
              <a
                href="https://docs.anthropic.com/en/docs/claude-code"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sourceLink}
              >
                公式ドキュメント
              </a>{" "}
              および{" "}
              <a
                href="https://github.com/anthropics/claude-code/releases"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sourceLink}
              >
                GitHubリリースノート
              </a>{" "}
              を参照してください。
            </div>
          </div>
        </section>

        {/* SECTION 11: BEST PRACTICES */}
        <section id="best-practices" className={styles.section}>
          <div className={styles.sectionLabel}>Section 11</div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>11.</span>横断ベストプラクティス 10則
          </h2>

          <div className={styles.principles}>
            <div className={`${styles.principle} ${styles.pBlue}`}>
              <div className={styles.principleNum}>01</div>
              <h4>CLAUDE.mdは500行以内に</h4>
              <p>
                重要ルールが埋もれないよう厳選。Hooksで強制できるルールはCLAUDE.mdから削除する。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pPurple}`}>
              <div className={styles.principleNum}>02</div>
              <h4>Spec First, Code Second</h4>
              <p>コードを一行も書く前にspec.md→requirements.md→design.md→tasks.mdを準備。</p>
            </div>
            <div className={`${styles.principle} ${styles.pGreen}`}>
              <div className={styles.principleNum}>03</div>
              <h4>specを生きたドキュメントに</h4>
              <p>
                コードが変わったらspec/design.mdも更新。「コードとspecの乖離」がプロジェクト腐敗の原因。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pOrange}`}>
              <div className={styles.principleNum}>04</div>
              <h4>タスクは独立・テスト可能に</h4>
              <p>tasks.mdの各タスクはそれ単体でテストできる粒度に。依存関係は明示する。</p>
            </div>
            <div className={`${styles.principle} ${styles.pRed}`}>
              <div className={styles.principleNum}>05</div>
              <h4>コンテキストを意識して管理</h4>
              <p>
                重要情報はファイルに書き出しておく。/clearしてもtasks.md+design.mdで再現可能にする。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pBlue}`}>
              <div className={styles.principleNum}>06</div>
              <h4>@import構文を活用</h4>
              <p>CLAUDE.mdで@docs/design.mdなど参照。大きな情報はCLAUDE.mdに直書きせず参照する。</p>
            </div>
            <div className={`${styles.principle} ${styles.pPurple}`}>
              <div className={styles.principleNum}>07</div>
              <h4>サブエージェントでコンテキスト分離</h4>
              <p>
                各タスクを独立したコンテキストで処理。メインセッションのノイズを防ぐ。真の並列実行が必要な場合は{" "}
                <strong>Agent Teams</strong>（experimental, 2026年2月〜）も選択肢。
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pGreen}`}>
              <div className={styles.principleNum}>08</div>
              <h4>コードレビューを3〜4タスクごとに</h4>
              <p>
                「design.mdに基づいてTask 1〜3のコードをレビューし、必要ならdesign.mdを更新して」
              </p>
            </div>
            <div className={`${styles.principle} ${styles.pOrange}`}>
              <div className={styles.principleNum}>09</div>
              <h4>CLAUDE.local.mdで個人設定を分離</h4>
              <p>チームに見せたくない個人設定はCLAUDE.local.mdへ。.gitignoreに自動追加される。</p>
            </div>
            <div className={`${styles.principle} ${styles.pRed}`}>
              <div className={styles.principleNum}>10</div>
              <h4>Hooksで強制・CLAUDE.mdは指針</h4>
              <p>「必ずやること」はHooksで確実化。CLAUDE.mdは「指針」、Hooksは「強制」。</p>
            </div>
          </div>
        </section>

        {/* SECTION 12: SOURCES */}
        <section id="sources" className={styles.section}>
          <div className={styles.sources}>
            <h3>📚 参考ソース一覧（公式・二次情報を含む）</h3>
            {SOURCES.map((src) => (
              <div key={src.num} className={styles.sourceItem}>
                <span className={styles.sourceNum}>{src.num}</span>
                <div>
                  <a href={src.href} target="_blank" rel="noopener noreferrer">
                    {src.title}
                  </a>
                  <div className={styles.sourceDesc}>{src.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
