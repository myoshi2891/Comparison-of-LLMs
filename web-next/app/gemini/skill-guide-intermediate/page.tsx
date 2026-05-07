import MermaidDiagram from "@/components/docs/MermaidDiagram";
import PatternsApp from "./PatternsApp";
import styles from "./page.module.css";

export const metadata = {
  title: "SKILL.md 完全解剖ガイド | Gemini CLI v0.34.0 & Antigravity v1.20.3 中級者以上向け",
  description:
    "Google Gemini CLI・Antigravity IDE における SKILL.md の設計思想、アーキテクチャ、実装パターン、運用まで。エージェント駆動開発を次のレベルに引き上げるすべての知識を網羅する。",
};

const MERMAID_STRUCTURE = `graph TD
ROOT["my-skill/"]
ROOT --> SKILL_MD["SKILL.md — REQUIRED<br />Brain of the skill<br />YAML frontmatter + Markdown body"]
ROOT --> SCRIPTS["scripts/ — OPTIONAL<br />Python / Bash / Node scripts<br />Executed deterministically"]
ROOT --> REFS["references/ — OPTIONAL<br />API docs, guidelines, specs<br />Read on demand only"]
ROOT --> ASSETS["assets/ — OPTIONAL<br />Templates, images<br />Static files"]
style SKILL_MD fill:#0d2330,stroke:#00d4aa,color:#00d4aa
style ROOT fill:#1c2230,stroke:#2d3748,color:#e2e8f0
style SCRIPTS fill:#1a1a10,stroke:#f97316,color:#fdba74
style REFS fill:#0d1e2a,stroke:#3b82f6,color:#93c5fd
style ASSETS fill:#1a1030,stroke:#a855f7,color:#c4b5fd`;

const MERMAID_PROGRESSIVE = `graph LR
L1["Level 1 — Always Loaded<br />name + description only<br />~100 tokens per skill<br />Stays in context always"]
L2["Level 2 — On Demand<br />SKILL.md full body<br />Max 500 lines recommended<br />Loaded only when activated"]
L3["Level 3 — Dynamic<br />references/ and scripts/<br />Read or executed on demand<br />Source code NOT in context"]
L1 -->|"Agent matches prompt<br />activate_skill called"| L2
L2 -->|"SKILL.md references<br />external files"| L3
style L1 fill:#1a2a1a,stroke:#22c55e,color:#86efac
style L2 fill:#0d1e2a,stroke:#3b82f6,color:#93c5fd
style L3 fill:#1a1030,stroke:#a855f7,color:#c4b5fd`;

const MERMAID_ECOSYSTEM = `graph TB
subgraph GeminiModel["Google Gemini Model Layer (2026-03)"]
GM["gemini-3.1-pro-preview / gemini-3-flash-preview (default)<br />gemini-2.5-flash / gemini-2.5-pro"]
end
subgraph GCLI["Gemini CLI v0.34.0 — Terminal Native"]
GC[Terminal Agent]
GCC["skill-creator / /plan / /rewind / SDK"]
end
subgraph AG["Antigravity v1.20.3 — Agent-First IDE"]
AGC[IDE Agent]
AGM["Agent Manager + AGENTS.md support"]
end
GM --> GC
GM --> AGC
SKILL["SKILL.md — Shared Open Standard"] --> GC
SKILL --> AGC
style SKILL fill:#0d2330,stroke:#00d4aa,color:#00d4aa
style GM fill:#1a1030,stroke:#a855f7,color:#c4b5fd`;

const MERMAID_WHY = `graph LR
subgraph Without["Without SKILL.md"]
A1[User] -->|Prompt| B1[AI Agent]
B1 --> C1[Load ALL docs]
C1 --> D1[High token cost<br />Low precision]
end
subgraph With["With SKILL.md"]
A2[User] -->|Prompt| B2[AI Agent]
B2 -->|Search relevant skills| C2[Load only SKILL.md]
C2 --> D2[Low token cost<br />High precision]
end
style D1 fill:#3d1515,stroke:#ef4444,color:#fca5a5
style D2 fill:#0d2e1a,stroke:#22c55e,color:#86efac
style C2 fill:#0d2330,stroke:#3b82f6,color:#93c5fd`;

const MERMAID_LIFECYCLE = `sequenceDiagram
participant User as Developer
participant IDE as CLI or IDE Interface
participant Agent as Agent Core
participant FS as Local File System
Note over Agent,FS: Phase 1 — Discovery
Agent->>FS: Scan .agents/skills/ hierarchy
FS-->>Agent: Extract name + description from each SKILL.md
Agent->>Agent: Inject metadata into system prompt static
User->>IDE: "Review this code for performance issues"
IDE->>Agent: Forward prompt
Note over Agent: Phase 2 — Activation Logic
Agent->>Agent: Semantically match prompt vs all skill descriptions
Agent->>Agent: Identify best skill and call activate_skill tool
Note over Agent,User: Phase 3 — Consent and Security
Agent->>IDE: Request tool execution with skill details
IDE->>User: Show approval prompt with skill name and directory path
User->>IDE: Approve execution
IDE-->>Agent: Approval signal received
Note over Agent,FS: Phase 4 — Context Injection
Agent->>FS: Obtain read permission for skill directory
FS-->>Agent: Return SKILL.md body and referenced assets
Agent->>Agent: Expand detailed instructions into context window
Note over Agent,User: Phase 5 — Execution
Agent->>Agent: Follow Step-by-Step from SKILL.md
Agent->>FS: Execute scripts if needed via bash
FS-->>Agent: Return execution results only not source code
Agent->>IDE: Generate artifacts and analysis results
IDE->>User: Report task completion`;

const MERMAID_SCOPE = `graph TB
subgraph GlobalScope["Global Scope — All Projects"]
G1["~/.gemini/skills/ (Gemini CLI)"]
G2["~/.gemini/antigravity/skills/ (Antigravity)"]
end
subgraph WorkspaceScope["Workspace Scope — This Project Only"]
W1[".gemini/skills/ (Gemini CLI)"]
W2[".agent/skills/ (Antigravity)"]
W3["AGENTS.md — Cross-tool shared (v1.20.3+)"]
end
WorkspaceScope -->|"Higher priority<br />Overrides global"| OVERRIDE["Override"]
GlobalScope --> OVERRIDE
OVERRIDE --> USE["Active Skill"]
style OVERRIDE fill:#1a1a10,stroke:#f97316,color:#fdba74
style USE fill:#0d2330,stroke:#00d4aa,color:#00d4aa
style W3 fill:#1a1a10,stroke:#f97316,color:#fdba74`;

export default function SkillGuideIntermediatePage() {
  return (
    <div className={styles.page}>
      {/* Page-internal nav */}
      <nav className={styles.pageNav}>
        <div className={styles.navInner}>
          <div className={styles.navLogo}>SKILL.md</div>
          <a href="#sec-why" className={styles.navLink}>
            なぜ必要か
          </a>
          <a href="#sec-tools" className={styles.navLink}>
            3ツール比較
          </a>
          <a href="#sec-progressive" className={styles.navLink}>
            段階的読込
          </a>
          <a href="#sec-structure" className={styles.navLink}>
            構造解剖
          </a>
          <a href="#sec-syntax" className={styles.navLink}>
            書き方
          </a>
          <a href="#sec-patterns" className={styles.navLink}>
            パターン
          </a>
          <a href="#sec-install" className={styles.navLink}>
            インストール
          </a>
          <a href="#sec-scope" className={styles.navLink}>
            スコープ
          </a>
          <a href="#sec-lifecycle" className={styles.navLink}>
            実行ライフサイクル
          </a>
          <a href="#sec-mcp" className={styles.navLink}>
            MCP連携
          </a>
          <a href="#sec-best" className={styles.navLink}>
            ベストプラクティス
          </a>
          <a href="#sec-whatsnew" className={`${styles.navLink} ${styles.navNew}`}>
            🆕 最新情報
          </a>
        </div>
      </nav>

      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroBadge}>
            SKILL.md DEEP DIVE — 中級者以上向け ｜ CLI v0.34.0 / Antigravity v1.20.3 対応
          </div>
          <h1 className={styles.heroH1}>
            <span className={styles.accentCyan}>Agent Skills</span>
            {" の"}
            <br />
            <span className={styles.accentOrange}>完全解剖</span>
            {"ガイド"}
          </h1>
          <p className={styles.heroSub}>
            Google Gemini CLI・Antigravity IDE における{" "}
            <code className={styles.inlineCode}>SKILL.md</code>{" "}
            の設計思想、アーキテクチャ、実装パターン、運用まで。エージェント駆動開発を次のレベルに引き上げるすべての知識を網羅する。
          </p>
          <div className={styles.heroMeta}>
            <div className={styles.heroChip}>
              <div className={styles.dot} style={{ background: "var(--cyan)" }} />
              Gemini CLI v0.34.0
            </div>
            <div className={styles.heroChip}>
              <div className={styles.dot} style={{ background: "var(--orange)" }} />
              Antigravity v1.20.3
            </div>
            <div className={styles.heroChip}>
              <div className={styles.dot} style={{ background: "var(--blue)" }} />
              Agent Skills Standard
            </div>
            <div className={styles.heroChip}>
              <div className={styles.dot} style={{ background: "var(--purple)" }} />
              MCP Integration
            </div>
          </div>
          <div className={styles.versionBadges}>
            <span className={`${styles.vbadge} ${styles.vbC}`}>
              Gemini CLI v0.34.0 (2026-03-18)
            </span>
            <span className={`${styles.vbadge} ${styles.vbO}`}>
              Antigravity v1.20.3 (2026-03-05)
            </span>
            <span className={`${styles.vbadge} ${styles.vbB}`}>Gemini 3.1 Pro Preview</span>
            <span className={`${styles.vbadge} ${styles.vbP}`}>
              Plan Mode / /rewind / skill-creator
            </span>
            <span className={`${styles.vbadge} ${styles.vbO}`}>最終更新 2026-03-21</span>
          </div>
        </div>
      </div>

      {/* S1: WHY */}
      <section id="sec-why" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionBadge} ${styles.badgeCyan}`}>01 / BACKGROUND</span>
            <div>
              <h2 className={styles.sectionTitle}>
                なぜ <span className={styles.sectionTitleSpan}>SKILL.md</span> が必要か
              </h2>
              <p className={styles.sectionDesc}>
                コンテキストウィンドウが大容量になっても、なぜ「すべてを読ませる」アプローチは破綻するのか。コンテキスト飽和問題と解決策を理解する。
              </p>
            </div>
          </div>
          <div className={styles.cardGrid} style={{ marginBottom: "32px" }}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🔥</div>
              <h3>コンテキスト飽和（Context Saturation）</h3>
              <p>
                ドキュメント・コーディング規約・設計書をすべてエージェントに与えると、Attention
                Mechanismが分散し重要な情報を見落とす。トークン消費が爆発し推論精度が低下する。
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>⚡</div>
              <h3>オンデマンド専門知識</h3>
              <p>
                SKILL.md は必要なタイミングでのみコンテキストに展開される。セッション中は
                <strong style={{ color: "var(--text)" }}>名前と説明（約100トークン）</strong>
                のみが常駐し、発動時に本文を読み込む設計。
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🔄</div>
              <h3>再利用可能なナレッジ</h3>
              <p>
                一度書けば複数プロジェクト・複数ツール（Gemini CLI / Antigravity / Claude Code /
                GitHub Copilot）で共通利用できるオープンスタンダード。
              </p>
            </div>
          </div>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>WITHOUT vs WITH SKILL.md</div>
            <MermaidDiagram chart={MERMAID_WHY} />
          </div>
          <div className={styles.callout}>
            <strong>核心的な洞察:</strong>{" "}
            モデルのコンテキストウィンドウが100万トークンになっても、「何もかもを与える」ことは解決策にならない。
            <span className={styles.inlineEm}>注意機構の分散</span>
            という本質的な問題は変わらないからだ。SKILL.md
            は「何をいつ与えるか」を制御するアーキテクチャである。
          </div>
        </div>
      </section>
      {/* S2: TOOLS */}
      <section id="sec-tools" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionBadge} ${styles.badgeOrange}`}>02 / ECOSYSTEM</span>
            <div>
              <h2 className={styles.sectionTitle}>
                3ツールの
                <span className={styles.sectionTitleSpan}>アーキテクチャ</span>
                比較
              </h2>
              <p className={styles.sectionDesc}>
                Gemini CLI と Antigravity IDE
                はどう違い、どう共通するのか。2026年3月時点の最新バージョン情報と新機能を含む完全比較。
              </p>
            </div>
          </div>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>ECOSYSTEM OVERVIEW — 2026年3月</div>
            <MermaidDiagram chart={MERMAID_ECOSYSTEM} />
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>比較項目</th>
                  <th>Gemini CLI</th>
                  <th>Antigravity IDE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong style={{ color: "var(--text)" }}>バージョン</strong>
                  </td>
                  <td>
                    <code className={styles.inlineCode}>v0.34.0</code> (2026-03-18)
                  </td>
                  <td>
                    <code className={styles.inlineCode}>v1.20.3</code> (2026-03-05)
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong style={{ color: "var(--text)" }}>形態</strong>
                  </td>
                  <td>ターミナルアプリ</td>
                  <td>IDEエディタ（VSCode fork）</td>
                </tr>
                <tr>
                  <td>
                    <strong style={{ color: "var(--text)" }}>グローバルスキルパス</strong>
                  </td>
                  <td>
                    <code className={styles.inlineCode}>~/.gemini/skills/</code>
                  </td>
                  <td>
                    <code className={styles.inlineCode}>~/.gemini/antigravity/skills/</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong style={{ color: "var(--text)" }}>ワークスペーススキルパス</strong>
                  </td>
                  <td>
                    <code className={styles.inlineCode}>.gemini/skills/</code>
                  </td>
                  <td>
                    <code className={styles.inlineCode}>.agent/skills/</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong style={{ color: "var(--text)" }}>デフォルトモデル</strong>
                  </td>
                  <td>
                    <code className={styles.inlineCode}>gemini-3-flash-preview</code> (v0.29.0〜)
                  </td>
                  <td>
                    <code className={styles.inlineCode}>gemini-3-flash-preview</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong style={{ color: "var(--text)" }}>最高精度モデル</strong>
                  </td>
                  <td>
                    <code className={styles.inlineCode}>gemini-3.1-pro-preview</code> (v0.31.0〜)
                  </td>
                  <td>
                    <code className={styles.inlineCode}>gemini-3.1-pro-preview</code>
                  </td>
                </tr>
                <tr className={styles.rowNew}>
                  <td>
                    <strong style={{ color: "var(--text)" }}>Plan Mode</strong>
                    <span className={styles.newBadge}>NEW</span>
                  </td>
                  <td>
                    <code className={styles.inlineCode}>/plan</code> コマンド (v0.29.0〜)
                    <br />
                    <small style={{ color: "var(--text-muted)" }}>
                      v0.33.0〜リサーチサブエージェント内蔵
                    </small>
                  </td>
                  <td>✅ あり</td>
                </tr>
                <tr className={styles.rowNew}>
                  <td>
                    <strong style={{ color: "var(--text)" }}>skill-creator</strong>
                    <span className={styles.newBadge}>NEW</span>
                  </td>
                  <td>標準搭載 (v0.26.0〜)</td>
                  <td>✅ あり</td>
                </tr>
                <tr className={styles.rowNew}>
                  <td>
                    <strong style={{ color: "var(--text)" }}>/rewind コマンド</strong>
                    <span className={styles.newBadge}>NEW</span>
                  </td>
                  <td>(v0.27.0〜)</td>
                  <td>—</td>
                </tr>
                <tr className={styles.rowNew}>
                  <td>
                    <strong style={{ color: "var(--text)" }}>AGENTS.md 対応</strong>
                    <span className={styles.newBadge}>NEW</span>
                  </td>
                  <td>✅ あり</td>
                  <td>✅ (v1.20.3〜)</td>
                </tr>
                <tr>
                  <td>
                    <strong style={{ color: "var(--text)" }}>対応モデル（他社）</strong>
                  </td>
                  <td>—</td>
                  <td>
                    <code className={styles.inlineCode}>claude-sonnet-4-6</code> /{" "}
                    <code className={styles.inlineCode}>claude-opus-4-6</code> /{" "}
                    <code className={styles.inlineCode}>gpt-oss-120b</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong style={{ color: "var(--text)" }}>学習機能</strong>
                  </td>
                  <td>セッション内のみ</td>
                  <td>ナレッジベースへの永続的な蓄積と再利用</td>
                </tr>
                <tr>
                  <td>
                    <strong style={{ color: "var(--text)" }}>SKILL.md サポート</strong>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tagG}`}>✓ FULL</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tagG}`}>✓ FULL</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.callout}>
            <strong>ポータビリティの保証:</strong> SKILL.md はプレーンなMarkdown + YAML
            フォーマット。Gemini CLI、Antigravity、Claude Code、GitHub
            Copilot、Cursor等で共通利用できるオープンスタンダード。
            <span className={styles.inlineEm}>v1.20.3〜はAGENTS.mdによるクロスツール共有</span>
            も正式サポートされた。
          </div>
        </div>
      </section>
      {/* S3: PROGRESSIVE */}
      <section id="sec-progressive" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionBadge} ${styles.badgeBlue}`}>03 / ARCHITECTURE</span>
            <div>
              <h2 className={styles.sectionTitle}>
                プログレッシブ・
                <span className={styles.sectionTitleSpan}>ディスクロージャー</span>
              </h2>
              <p className={styles.sectionDesc}>
                SKILL.md
                の最重要設計原理。3段階の段階的読み込みによって、コンテキスト消費を最小化しながら、必要な時に必要な情報だけを提供する仕組み。
              </p>
            </div>
          </div>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>3-LEVEL PROGRESSIVE DISCLOSURE</div>
            <MermaidDiagram chart={MERMAID_PROGRESSIVE} />
          </div>
          <div className={styles.cardGrid}>
            <div className={styles.card} style={{ borderLeft: "3px solid var(--green)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: "var(--green)",
                    fontWeight: 600,
                  }}
                >
                  LEVEL 1
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  常時コンテキスト常駐
                </div>
              </div>
              <h3>メタデータのロード</h3>
              <p>
                セッション開始時に全スキルの <code className={styles.inlineCode}>name</code> と{" "}
                <code className={styles.inlineCode}>description</code>
                のみがシステムプロンプトに注入される。スキル100個あっても約10,000トークン程度の軽量な状態。エージェントはこの情報でスキル一覧を「知っている」。
              </p>
            </div>
            <div className={styles.card} style={{ borderLeft: "3px solid var(--blue)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: "var(--blue)",
                    fontWeight: 600,
                  }}
                >
                  LEVEL 2
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  アクティベーション時のみ
                </div>
              </div>
              <h3>SKILL.md 本文の展開</h3>
              <p>
                ユーザーのプロンプトとスキルの description
                を意味論的に照合し最も関連するスキルを特定。
                <code className={styles.inlineCode}>activate_skill</code>
                ツールが呼ばれて初めて SKILL.md
                の本文（5,000トークン未満推奨）がコンテキストに展開される。
              </p>
            </div>
            <div className={styles.card} style={{ borderLeft: "3px solid var(--purple)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: "var(--purple)",
                    fontWeight: 600,
                  }}
                >
                  LEVEL 3
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>動的アクセス</div>
              </div>
              <h3>リソースの動的実行</h3>
              <p>
                references/ 内のドキュメントはBashでの読み取り時のみ消費。scripts/
                内のスクリプトはソースコードではなく
                <strong style={{ color: "var(--text)" }}>実行結果のみ</strong>
                がコンテキストに入る。実質的に無制限の処理能力を「軽量に」実現。
              </p>
            </div>
          </div>
          <div className={`${styles.callout} ${styles.calloutWarn}`} style={{ marginTop: "24px" }}>
            <strong>決定論的ツールの統合:</strong> LLMは本質的に確率論的（非決定論的）。scripts/
            にPython/Bashスクリプトを同梱し SKILL.md から呼び出すことで、
            <span style={{ color: "var(--orange)" }}>検証処理を決定論的</span>
            にし、出力の一貫性と精度を飛躍的に高めることができる。
          </div>
        </div>
      </section>
      {/* S4: STRUCTURE */}
      <section id="sec-structure" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionBadge} ${styles.badgePurple}`}>04 / ANATOMY</span>
            <div>
              <h2 className={styles.sectionTitle}>
                ディレクトリ
                <span className={styles.sectionTitleSpan}>構造</span>の解剖
              </h2>
              <p className={styles.sectionDesc}>
                一つのAgent
                Skillは単一ファイルではなく、自己完結型のディレクトリとして構成される。各要素の役割と設計意図を理解する。
              </p>
            </div>
          </div>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>SKILL DIRECTORY STRUCTURE</div>
            <MermaidDiagram chart={MERMAID_STRUCTURE} />
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <div className={styles.macDots}>
                <div className={`${styles.macDot} ${styles.dotRed}`} />
                <div className={`${styles.macDot} ${styles.dotYellow}`} />
                <div className={`${styles.macDot} ${styles.dotGreen}`} />
              </div>
              <span className={styles.codeLang}>shell — Directory Layout</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cComment}># 典型的なスキルのディレクトリ構成</span>
              {"\n"}
              <span className={styles.cVal}>my-skill/</span>
              {"\n"}
              {"├── "}
              <span className={styles.cKey}>SKILL.md</span>
              {"     "}
              <span className={styles.cComment}># 【必須】エージェントへの指示・メタデータ</span>
              {"\n"}
              {"├── "}
              <span className={styles.cOp}>scripts/</span>
              {"     "}
              <span className={styles.cComment}># 【任意】決定論的な検証・自動化スクリプト</span>
              {"\n"}
              {"│   ├── "}
              <span className={styles.cCmd}>run.py</span>
              {"\n"}
              {"│   └── "}
              <span className={styles.cCmd}>validate.sh</span>
              {"\n"}
              {"├── "}
              <span className={styles.cOp}>references/</span>
              {"  "}
              <span className={styles.cComment}># 【任意】オンデマンド参照ドキュメント</span>
              {"\n"}
              {"│   ├── "}
              <span className={styles.cCmd}>api-spec.md</span>
              {"\n"}
              {"│   └── "}
              <span className={styles.cCmd}>best-practices.md</span>
              {"\n"}
              {"└── "}
              <span className={styles.cOp}>assets/</span>
              {"      "}
              <span className={styles.cComment}># 【任意】出力テンプレート・静的ファイル</span>
              {"\n"}
              {"    └── "}
              <span className={styles.cCmd}>template.tsx</span>
            </div>
          </div>
        </div>
      </section>
      {/* S5: SYNTAX */}
      <section id="sec-syntax" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionBadge} ${styles.badgeCyan}`}>05 / SYNTAX</span>
            <div>
              <h2 className={styles.sectionTitle}>
                SKILL.md の<span className={styles.sectionTitleSpan}>書き方</span>
                完全ガイド
              </h2>
              <p className={styles.sectionDesc}>
                YAMLフロントマターの設計から、エージェントを確実に動かすマークダウン本文の構造まで。中級者が陥りやすいミスも解説する。
              </p>
            </div>
          </div>
          <h4 className={styles.h4}>1. YAMLフロントマター（メタデータ定義）</h4>
          <p style={{ color: "var(--text-subtle)", fontSize: "15px", marginBottom: "16px" }}>
            ファイル最上部に配置し、トリプルダッシュ（
            <code className={styles.inlineCode}>---</code>
            ）で囲む。エージェントがスキルを「見つける」ためのルーティング情報。
          </p>
          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <div className={styles.macDots}>
                <div className={`${styles.macDot} ${styles.dotRed}`} />
                <div className={`${styles.macDot} ${styles.dotYellow}`} />
                <div className={`${styles.macDot} ${styles.dotGreen}`} />
              </div>
              <span className={styles.codeLang}>yaml — SKILL.md Frontmatter</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cComment}>---</span>
              {"\n"}
              <span className={styles.cKey}>name</span>
              {": "}
              <span className={styles.cVal}>frontend-reviewer</span>
              {"  "}
              <span className={styles.cComment}># 必須: ケバブケース・英語小文字・64文字以内</span>
              {"\n\n"}
              <span className={styles.cKey}>description</span>
              {": |\n"}
              {"  "}
              <span className={styles.cComment}># 必須: エージェントのトリガー条件（最重要）</span>
              {"\n  "}
              <span className={styles.cVal}>ReactおよびTypeScriptプロジェクトの</span>
              {"\n  "}
              <span className={styles.cVal}>フロントエンドコードをレビューし、</span>
              {"\n  "}
              <span className={styles.cVal}>コードレビュー、PR確認、品質チェック、</span>
              {"\n  "}
              <span className={styles.cVal}>という言葉が出たら必ずこのスキルを使うこと。</span>
              {"\n\n"}
              <span className={styles.cKey}>disable-model-invocation</span>
              {": "}
              <span className={styles.cVal}>false</span>
              {"\n"}
              <span className={styles.cComment}>
                # trueにすると自動発動を無効化（危険操作スキルに）
              </span>
              {"\n"}
              <span className={styles.cKey}>category</span>
              {": "}
              <span className={styles.cVal}>code-quality</span>
              {"\n"}
              <span className={styles.cComment}>---</span>
            </div>
          </div>
          <div className={styles.divider} />
          <h4 className={styles.h4}>2. description フィールドの設計が成否を決める</h4>
          <div className={styles.compareGrid}>
            <div className={`${styles.compareCard} ${styles.compareCardBad}`}>
              <div className={`${styles.compareTitle} ${styles.compareTitleNg}`}>
                ❌ アンダートリガー（呼ばれない）
              </div>
              <pre>{`name: security-auditor
description: |
  セキュリティ監査を行うスキル。`}</pre>
            </div>
            <div className={`${styles.compareCard} ${styles.compareCardGood}`}>
              <div className={`${styles.compareTitle} ${styles.compareTitleOk}`}>
                ✅ 正しいトリガー設計
              </div>
              <pre>{`name: security-auditor
description: |
  コードのセキュリティ監査を実施する。
  脆弱性チェック、OWASP Top 10の検証、
  セキュリティ、認証、XSS、SQLi、
  という言葉が出たら必ず使うこと。`}</pre>
            </div>
          </div>
          <div className={styles.divider} />
          <h4 className={styles.h4}>3. マークダウン本文の推奨スキーマ</h4>
          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <div className={styles.macDots}>
                <div className={`${styles.macDot} ${styles.dotRed}`} />
                <div className={`${styles.macDot} ${styles.dotYellow}`} />
                <div className={`${styles.macDot} ${styles.dotGreen}`} />
              </div>
              <span className={styles.codeLang}>markdown — SKILL.md Body Template</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cHead}># スキル名</span>
              {"\n\n"}
              <span className={styles.cHead}>## Overview</span>
              {"\n"}
              <span className={styles.cVal}>このスキルが達成する目的を1〜2文で。</span>
              {"\n\n"}
              <span className={styles.cHead}>## Before Starting（前提条件）</span>
              {"\n"}
              <span className={styles.cVal}>- ユーザーから提供されるべき入力情報</span>
              {"\n\n"}
              <span className={styles.cHead}>## Step-by-Step Guide（実行手順）</span>
              {"\n"}
              <span className={styles.cComment}># 抽象的な思考でなく具体的なアクションを定義</span>
              {"\n"}
              <span className={styles.cVal}>
                1. **ファイルの解析**: 対象ファイルと依存モジュールを読み込む
              </span>
              {"\n"}
              <span className={styles.cVal}>
                2. **静的解析**: 型安全性とReact依存配列の完全性を検証
              </span>
              {"\n"}
              <span className={styles.cVal}>
                3. **アーティファクト生成**: 修正後のコードスニペットと共に提示
              </span>
              {"\n\n"}
              <span className={styles.cHead}>## Examples（Few-shot 使用例）</span>
              {"\n"}
              <span className={styles.cComment}># LLMはここを見て期待される振る舞いを模倣する</span>
              {"\n"}
              <span className={styles.cVal}>**Input**: `UserProfile.tsx`をレビューして</span>
              {"\n"}
              <span className={styles.cVal}>
                **Output Structure**: 1.ボトルネック 2.修正案 3.影響範囲
              </span>
              {"\n\n"}
              <span className={styles.cHead}>## Rules（制約事項）</span>
              {"\n"}
              <span className={styles.cVal}>- ❌ ビジネスロジックを推測で変更しないこと</span>
              {"\n"}
              <span className={styles.cVal}>- ✅ 修正根拠として公式ドキュメントを引用すること</span>
              {"\n"}
              <span className={styles.cVal}>- ✅ 破壊的変更の前には必ず確認を求めること</span>
            </div>
          </div>
        </div>
      </section>
      {/* S6: PATTERNS */}
      <section id="sec-patterns" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionBadge} ${styles.badgeOrange}`}>06 / PATTERNS</span>
            <div>
              <h2 className={styles.sectionTitle}>
                実装<span className={styles.sectionTitleSpan}>パターン</span>4選
              </h2>
              <p className={styles.sectionDesc}>
                シンプルなプロンプト型から、スクリプト統合・ドキュメント参照を組み合わせた高度なパターンまで。
              </p>
            </div>
          </div>
          <PatternsApp />
        </div>
      </section>
      {/* S7: INSTALLATION */}
      <section id="sec-install" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionBadge} ${styles.badgeBlue}`}>07 / INSTALLATION</span>
            <div>
              <h2 className={styles.sectionTitle}>
                スキルの<span className={styles.sectionTitleSpan}>インストール</span>方法
              </h2>
              <p className={styles.sectionDesc}>
                Git リポジトリ、ローカルディレクトリ、統合CLIツール。v0.26.0〜の新コマンド（
                <code className={styles.inlineCode}>/plan</code>・
                <code className={styles.inlineCode}>/rewind</code>
                ・skill-creator）を含む完全ガイド。
              </p>
            </div>
          </div>
          <div className={styles.steps}>
            {/* Step 01 */}
            <div className={styles.step}>
              <div className={styles.stepNum}>01</div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>
                  Gemini CLI — コマンドでインストール
                  <span className={styles.newBadge} style={{ fontSize: "11px" }}>
                    v0.34.0
                  </span>
                </div>
                <p className={styles.stepDesc}>
                  最もスタンダードな方法。v0.26.0〜の新コマンドも含む完全リファレンス。
                </p>
                <div className={styles.codeWrap} style={{ marginTop: "16px" }}>
                  <div className={styles.codeHeader}>
                    <div className={styles.macDots}>
                      <div className={`${styles.macDot} ${styles.dotRed}`} />
                      <div className={`${styles.macDot} ${styles.dotYellow}`} />
                      <div className={`${styles.macDot} ${styles.dotGreen}`} />
                    </div>
                    <span className={styles.codeLang}>shell — Gemini CLI Commands (v0.34.0)</span>
                  </div>
                  <div className={styles.codeBody}>
                    <span className={styles.cComment}>
                      # スキルを Git リポジトリからインストール
                    </span>
                    {"\n"}
                    <span className={styles.cCmd}>gemini skills install</span>{" "}
                    <span className={styles.cVal}>https://github.com/example/my-skills.git</span>
                    {"\n\n"}
                    <span className={styles.cComment}># サブパスを指定してインストール</span>
                    {"\n"}
                    <span className={styles.cCmd}>gemini skills install</span>{" "}
                    <span className={styles.cVal}>https://github.com/example/skills.git</span>{" "}
                    <span className={styles.cKey}>--path</span>
                    {" skills/firebase\n\n"}
                    <span className={styles.cComment}># ローカルディレクトリからインストール</span>
                    {"\n"}
                    <span className={styles.cCmd}>gemini skills install</span>{" "}
                    <span className={styles.cVal}>./my-local-skill/</span>
                    {"\n\n"}
                    <span className={styles.cComment}># インストール済みスキルを一覧表示</span>
                    {"\n"}
                    <span className={styles.cCmd}>gemini skills list</span>
                    {"\n\n"}
                    <span className={styles.cComment}># セッション中にスキルを一時無効化</span>
                    {"\n"}
                    <span className={styles.cCmd}>/skills disable</span>{" "}
                    <span className={styles.cVal}>{"<スキル番号>"}</span>
                    {"\n\n"}
                    <span className={styles.cComment}># スキルを最新版に更新</span>
                    {"\n"}
                    <span className={styles.cCmd}>gemini skills update</span>
                    {"\n\n"}
                    <span className={styles.cNew}>
                      {"──────────────────────────────────────────────────────────────"}
                    </span>
                    {"\n"}
                    <span className={styles.cNew}>
                      {"# 🆕 v0.26.0〜 skill-creator（スキル対話的自動生成）"}
                    </span>
                    {"\n"}
                    <span className={styles.cComment}>
                      {"# チャットで「新しいスキルを作成したい」と入力→自動起動"}
                    </span>
                    {"\n\n"}
                    <span className={styles.cNew}>
                      {"# 🆕 v0.27.0〜 /rewind（セッション履歴を遡る・ロールバック）"}
                    </span>
                    {"\n"}
                    <span className={styles.cCmd}>/rewind</span>
                    {"\n\n"}
                    <span className={styles.cNew}>
                      {"# 🆕 v0.29.0〜 /plan（Plan Mode: read-only で安全に変更計画立案）"}
                    </span>
                    {"\n"}
                    <span className={styles.cCmd}>/plan</span>
                    {"\n"}
                    <span className={styles.cComment}>
                      {"# v0.33.0〜: リサーチサブエージェント・アノテーション機能を内蔵"}
                    </span>
                    {"\n\n"}
                    <span className={styles.cNew}>
                      {"# 🆕 v0.30.0〜 Gemini CLI SDK（プログラムによるスキル生成）"}
                    </span>
                    {"\n"}
                    <span className={styles.cComment}>
                      {"# npm install @google/gemini-cli-sdk"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Step 02 */}
            <div className={styles.step}>
              <div className={styles.stepNum}>02</div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>
                  Antigravity — ファイルコピーで配置
                  <span className={styles.newBadge} style={{ fontSize: "11px" }}>
                    v1.20.3
                  </span>
                </div>
                <p className={styles.stepDesc}>
                  Antigravity IDE
                  ではGUIまたはファイルコピーでスキルを配置。v1.20.3〜はAGENTS.mdでクロスツール共有も可能。
                </p>
                <div className={styles.codeWrap} style={{ marginTop: "16px" }}>
                  <div className={styles.codeHeader}>
                    <div className={styles.macDots}>
                      <div className={`${styles.macDot} ${styles.dotRed}`} />
                      <div className={`${styles.macDot} ${styles.dotYellow}`} />
                      <div className={`${styles.macDot} ${styles.dotGreen}`} />
                    </div>
                    <span className={styles.codeLang}>shell — Antigravity Placement (v1.20.3)</span>
                  </div>
                  <div className={styles.codeBody}>
                    <span className={styles.cComment}>
                      {"# グローバルインストール（全プロジェクトで使えるようにする）"}
                    </span>
                    {"\n"}
                    <span className={styles.cCmd}>cp -r</span>
                    {" my-skill/ "}
                    <span className={styles.cVal}>{"~/.gemini/antigravity/skills/"}</span>
                    {"\n\n"}
                    <span className={styles.cComment}>
                      {"# ワークスペースインストール（このプロジェクトのみ）"}
                    </span>
                    {"\n"}
                    <span className={styles.cCmd}>cp -r</span>
                    {" my-skill/ "}
                    <span className={styles.cVal}>{".agent/skills/"}</span>
                    {"\n\n"}
                    <span className={styles.cNew}>
                      {"# 🆕 v1.20.3〜 AGENTS.md でクロスツール共有"}
                    </span>
                    {"\n"}
                    <span className={styles.cComment}>
                      {"# プロジェクトルートに AGENTS.md を置くだけで"}
                    </span>
                    {"\n"}
                    <span className={styles.cComment}>
                      {"# Antigravity / Claude Code / Codex など複数ツールで共有可能"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Step 03 */}
            <div className={styles.step}>
              <div className={styles.stepNum}>03</div>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>skills CLI — 統合管理ツール（最も便利）</div>
                <p className={styles.stepDesc}>
                  Gemini CLI と Antigravity 両方に同時にスキルを追加できる。コミュニティの 1,500+
                  スキルを一括インストール可能。
                </p>
                <div className={styles.codeWrap} style={{ marginTop: "16px" }}>
                  <div className={styles.codeHeader}>
                    <div className={styles.macDots}>
                      <div className={`${styles.macDot} ${styles.dotRed}`} />
                      <div className={`${styles.macDot} ${styles.dotYellow}`} />
                      <div className={`${styles.macDot} ${styles.dotGreen}`} />
                    </div>
                    <span className={styles.codeLang}>shell — skills CLI (npx)</span>
                  </div>
                  <div className={styles.codeBody}>
                    <span className={styles.cComment}># Firebase スキルを両ツールに同時追加</span>
                    {"\n"}
                    <span className={styles.cCmd}>npx skills add</span>{" "}
                    <span className={styles.cVal}>firebase/agent-skills</span>{" "}
                    <span className={styles.cKey}>-a</span>
                    {" gemini-cli "}
                    <span className={styles.cKey}>-a</span>
                    {" antigravity\n\n"}
                    <span className={styles.cComment}># スキルを検索</span>
                    {"\n"}
                    <span className={styles.cCmd}>npx skills find</span>{" "}
                    <span className={styles.cVal}>flutter</span>
                    {"\n\n"}
                    <span className={styles.cComment}># インストール済みスキル一覧</span>
                    {"\n"}
                    <span className={styles.cCmd}>npx skills list</span>
                    {"\n\n"}
                    <span className={styles.cComment}>
                      {
                        "# コミュニティの awesome-skills バンドルを一括インストール（1,500+ スキル）"
                      }
                    </span>
                    {"\n"}
                    <span className={styles.cCmd}>npx antigravity-awesome-skills</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* S9: LIFECYCLE */}
      <section id="sec-lifecycle" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionBadge} ${styles.badgeCyan}`}>09 / LIFECYCLE</span>
            <div>
              <h2 className={styles.sectionTitle}>
                実行<span className={styles.sectionTitleSpan}>ライフサイクル</span>の全貌
              </h2>
              <p className={styles.sectionDesc}>
                Discovery → Activation → Consent → Injection → Execution の5フェーズを理解する。
              </p>
            </div>
          </div>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>EXECUTION LIFECYCLE — SEQUENCE DIAGRAM</div>
            <MermaidDiagram chart={MERMAID_LIFECYCLE} />
          </div>
          <div className={styles.cardGrid} style={{ marginTop: "24px" }}>
            <div className={styles.card} style={{ borderTop: "2px solid var(--green)" }}>
              <h3
                style={{
                  color: "var(--green)",
                  fontSize: "14px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                Phase 3: Consent
              </h3>
              <p>
                スキルがアクティブになる際、UIにスキル名・目的・アクセスするディレクトリパスが明示され承認を求める。悪意あるスクリプトの意図しない実行を防ぐセキュリティモデル。
              </p>
            </div>
            <div className={styles.card} style={{ borderTop: "2px solid var(--blue)" }}>
              <h3
                style={{
                  color: "var(--blue)",
                  fontSize: "14px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                Phase 4: Context Injection
              </h3>
              <p>
                スクリプトはソースコードではなく
                <strong style={{ color: "var(--text)" }}>実行結果のみ</strong>
                がコンテキストに入る。これによりレベル3（scripts/）は実質的にコンテキスト無制限で複雑な処理を実現できる。
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* S8: SCOPE */}
      <section id="sec-scope" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionBadge} ${styles.badgePurple}`}>08 / SCOPE</span>
            <div>
              <h2 className={styles.sectionTitle}>
                スコープと<span className={styles.sectionTitleSpan}>配置場所</span>の設計
              </h2>
              <p className={styles.sectionDesc}>
                グローバルスコープとワークスペーススコープの使い分けと、v1.20.3で追加されたAGENTS.mdによるクロスツール共有を理解する。
              </p>
            </div>
          </div>
          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>SCOPE HIERARCHY — OVERRIDE RULES (v1.20.3)</div>
            <MermaidDiagram chart={MERMAID_SCOPE} />
          </div>
          <div className={styles.scopeGrid}>
            <div className={`${styles.scopeCard} ${styles.scopeCardGlobal}`}>
              <div className={`${styles.scopeLabel} ${styles.scopeLabelC}`}>GLOBAL SCOPE</div>
              <h3>グローバルスキル</h3>
              <p style={{ fontSize: "14px", color: "var(--text-subtle)" }}>
                すべてのプロジェクトで利用可能な汎用スキル。
              </p>
              <div className={styles.pathBox}>
                {"~/.gemini/skills/"}
                <br />
                {"~/.gemini/antigravity/skills/"}
              </div>
              <ul>
                <li>Gitコミット規約フォーマッター</li>
                <li>コードレビュー標準チェック</li>
                <li>JSON/YAML フォーマッター</li>
                <li>テスト生成の標準化</li>
              </ul>
            </div>
            <div className={`${styles.scopeCard} ${styles.scopeCardWorkspace}`}>
              <div className={`${styles.scopeLabel} ${styles.scopeLabelO}`}>WORKSPACE SCOPE</div>
              <h3>ワークスペーススキル</h3>
              <p style={{ fontSize: "14px", color: "var(--text-subtle)" }}>
                特定プロジェクトのみで有効。
                <strong style={{ color: "var(--orange)" }}>
                  v1.20.3〜 AGENTS.md でクロスツール共有も可能
                </strong>
              </p>
              <div className={styles.pathBox}>
                {".gemini/skills/"}
                <br />
                {".agent/skills/"}
                <br />
                {"AGENTS.md（クロスツール共有）"}
              </div>
              <ul>
                <li>このアプリのデプロイ手順</li>
                <li>プロジェクト固有のAPI仕様</li>
                <li>チーム独自のコーディング規約</li>
                <li>内部DBのマイグレーション</li>
              </ul>
            </div>
          </div>
          <div className={styles.callout} style={{ marginTop: "24px" }}>
            <strong>オーバーライドルール:</strong> 同名のスキルが複数スコープに存在する場合、
            <span className={styles.inlineEm}>ワークスペース（上位）が優先</span>
            される。v1.20.3〜ではAGENTS.mdも優先度ルールに組み込まれた。
          </div>
        </div>
      </section>
    </div>
  );
}
