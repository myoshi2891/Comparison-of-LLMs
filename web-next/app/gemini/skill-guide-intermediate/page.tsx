import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

export const metadata = {
  title: "SKILL.md 完全解剖ガイド | Gemini CLI v0.34.0 & Antigravity v1.20.3 中級者以上向け",
  description:
    "Google Gemini CLI・Antigravity IDE における SKILL.md の設計思想、アーキテクチャ、実装パターン、運用まで。エージェント駆動開発を次のレベルに引き上げるすべての知識を網羅する。",
};

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
    </div>
  );
}
