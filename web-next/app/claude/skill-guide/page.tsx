import type { Metadata } from "next";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

// MermaidDiagram はクライアントサイドでのみ実行する必要があるため ssr: false
const MermaidDiagram = dynamic(() => import("@/components/docs/MermaidDiagram"), { ssr: false });

export const metadata: Metadata = {
  title: "SKILL.md 完全解説ガイド — Claude Code",
  description:
    "Claude Code に「専門的なスキル」を追加するための設定ファイル SKILL.md の概念・構造・活用方法を理解するための初学者向け完全ガイドです。",
};

export default function Page() {
  return (
    <div className={styles.pageWrap}>
      <div className={styles.tocProgress}>
        <div className={styles.tocProgressFill} id="readProgress" />
      </div>

      <div className={styles.layout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLogo}>
            <div className={styles.logoTag}>SKILL.md</div>
            <h2>完全解説ガイド</h2>
            <p>Claude Code v2.1.76 対応</p>
          </div>
          <p className={styles.navSectionLabel}>はじめに</p>
          <a href="#what" className={styles.navItem}>
            <span className={styles.navNum}>01</span>SKILL.md とは何か？
          </a>
          <a href="#arch" className={styles.navItem}>
            <span className={styles.navNum}>02</span>全体アーキテクチャ
          </a>
          <a href="#token" className={styles.navItem}>
            <span className={styles.navNum}>03</span>トークン経済の仕組み
          </a>
          <p className={styles.navSectionLabel}>コア概念</p>
          <a href="#structure" className={styles.navItem}>
            <span className={styles.navNum}>04</span>基本構造
          </a>
          <a href="#directory" className={styles.navItem}>
            <span className={styles.navNum}>05</span>ディレクトリ構造
          </a>
          <a href="#invoke" className={styles.navItem}>
            <span className={styles.navNum}>06</span>呼び出しの仕組み
          </a>
          <a href="#claudemd" className={styles.navItem}>
            <span className={styles.navNum}>07</span>CLAUDE.md との違い
          </a>
          <p className={styles.navSectionLabel}>実践</p>
          <a href="#build" className={styles.navItem}>
            <span className={styles.navNum}>08</span>最初のスキルを作る
          </a>
          <a href="#yaml" className={styles.navItem}>
            <span className={styles.navNum}>09</span>YAMLフロントマター解説
          </a>
          <a href="#args" className={styles.navItem}>
            <span className={styles.navNum}>10</span>引数と動的コンテキスト
          </a>
          <a href="#bundle" className={styles.navItem}>
            <span className={styles.navNum}>11</span>リソースバンドル
          </a>
          <p className={styles.navSectionLabel}>応用</p>
          <a href="#best" className={styles.navItem}>
            <span className={styles.navNum}>12</span>ベストプラクティス
          </a>
          <a href="#debug" className={styles.navItem}>
            <span className={styles.navNum}>13</span>デバッグと最適化
          </a>
          <a href="#mistakes" className={styles.navItem}>
            <span className={styles.navNum}>14</span>よくあるミス
          </a>
          <a href="#enterprise" className={styles.navItem}>
            <span className={styles.navNum}>15</span>エンタープライズ展開
          </a>
        </aside>

        {/* MAIN */}
        <main className={styles.main}>
          {/* HERO */}
          <section className={styles.hero}>
            <div className={styles.heroBadge}>Claude Code Agent Skills · SKILL.md</div>
            <h1>
              SKILL.md
              <br />
              完全解説ガイド
            </h1>
            <p className={styles.heroSub}>
              Claude Code
              に「専門的なスキル」を追加するための設定ファイル。ゼロから概念・構造・活用方法を理解するための初学者向け完全ガイドです。
            </p>
            <div className={styles.heroMeta}>
              <span className={`${styles.heroChip} ${styles.chipGreen}`}>
                ✓ Claude Code v2.1.76 対応
              </span>
              <span className={`${styles.heroChip} ${styles.chipBlue}`}>✓ 初学者向け</span>
              <span className={`${styles.heroChip} ${styles.chipPurple}`}>
                ✓ ステップバイステップ
              </span>
            </div>
          </section>

          {/* 01 WHAT */}
          <section className={styles.sec} id="what">
            <div className={styles.secHeader}>
              <span className={styles.secNum}>01</span>
              <h2>SKILL.md とは何か？</h2>
            </div>
            <p>
              <strong>SKILL.md</strong> は、Claude Code
              に「専門的なスキル（能力）」を追加するための設定ファイルです。一言でいうと —{" "}
              <strong>「Claudeに特定のタスクのプロの手順書を渡す仕組み」</strong>
              です。
            </p>
            <div className={`${styles.callout} ${styles.calloutTip}`}>
              <span className={styles.calloutIcon}>💡</span>
              <p>
                Claude Code
                はセッションをまたいで記憶を保持しません。毎回「このプロジェクトではPDFはこう作る」「コードレビューはこの観点でやる」と説明し直すのは非効率です。
                <br />
                <strong>SKILL.md を使うと一度書けば何度でも再利用できます。</strong>
              </p>
            </div>
            <h3>なぜ SKILL.md が必要なのか？</h3>
            <div className={styles.cardGrid}>
              <div className={styles.card}>
                <div className={styles.cardIcon}>♻️</div>
                <div className={styles.cardTitle}>再利用性</div>
                <div className={styles.cardDesc}>
                  一度書けば何度でも繰り返し使える。毎回同じ説明をする必要がなくなる。
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>🤖</div>
                <div className={styles.cardTitle}>自動読み込み</div>
                <div className={styles.cardDesc}>
                  Claude が状況を判断し、適切なスキルを自動的に読み込んで実行する。
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>📦</div>
                <div className={styles.cardTitle}>バンドル対応</div>
                <div className={styles.cardDesc}>
                  スクリプトやテンプレート、参考資料をスキルにまとめて同梱できる。
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>🌐</div>
                <div className={styles.cardTitle}>オープンスタンダード</div>
                <div className={styles.cardDesc}>
                  チームで共有可能。複数のAIツール間でも互換性があるオープン仕様。
                </div>
              </div>
            </div>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram
                chart={`graph LR
A["😤 毎回説明する\\n従来の方法"]
B["💬 Claude"]
C["📄 SKILL.md\\nに手順を書く"]
D["✅ 高品質な出力"]
A -->|非効率| B
C -->|自動読み込み| B
B --> D
style A fill:#2a1c1c,stroke:#f85149,color:#e6edf3
style C fill:#1c2a1c,stroke:#3fb950,color:#e6edf3
style D fill:#1c2033,stroke:#58a6ff,color:#e6edf3`}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
