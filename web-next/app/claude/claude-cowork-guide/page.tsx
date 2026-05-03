import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

const DIAG_0 = `graph LR
subgraph WEB["Claude.ai Web Mobile"]
W1["テキスト生成・質問回答"]
W2["コード生成・説明"]
W3["ファイルアップロード 単発"]
end
subgraph CW["Cowork Desktop"]
C1["ファイルシステムへの直接アクセス"]
C2["フォルダ監視・自動トリガー"]
C3["Skills による繰り返し自動化"]
C4["ローカルアプリとの連携"]
end
style WEB fill:#1a2530,stroke:#58a6ff,color:#e6edf3
style CW fill:#2a1a0a,stroke:#f97316,color:#e6edf3`;

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export const metadata: Metadata = {
  title: "Claude Cowork 完全入門ガイド",
  description:
    "コードを一行も書かずに自然言語の指示だけでファイル管理・タスク自動化を実現する Anthropic のデスクトップツール「Cowork」を初学者向けにゼロから解説します。",
};

export default function Page() {
  return (
    <div className={styles.pageWrap}>
      {/* ── TOP NAV ── */}
      <nav className={styles.topnav} aria-label="ページナビゲーション">
        <div className={styles.topnavInner}>
          <div className={styles.topnavLogo}>
            <span className={styles.logoPill}>Cowork</span>
            <span className={styles.siteTitle}>完全入門ガイド</span>
          </div>
          <div className={styles.topnavLinks}>
            <div className={styles.topnavGroup}>
              <span className={styles.groupLabel}>基礎</span>
              <a href="#what" className={styles.navLink}>
                <span className={styles.navNum}>01</span>&nbsp;概要
              </a>
              <a href="#products" className={styles.navLink}>
                <span className={styles.navNum}>02</span>&nbsp;製品比較
              </a>
              <a href="#setup" className={styles.navLink}>
                <span className={styles.navNum}>03</span>&nbsp;セットアップ
              </a>
            </div>
            <div className={styles.topnavGroup}>
              <span className={styles.groupLabel}>機能</span>
              <a href="#natural-language" className={styles.navLink}>
                <span className={styles.navNum}>04</span>&nbsp;自然言語操作
              </a>
              <a href="#file-tasks" className={styles.navLink}>
                <span className={styles.navNum}>05</span>&nbsp;タスク自動化
              </a>
              <a href="#skills" className={styles.navLink}>
                <span className={styles.navNum}>06</span>&nbsp;Skills連携
              </a>
            </div>
            <div className={styles.topnavGroup}>
              <span className={styles.groupLabel}>実践</span>
              <a href="#workflow" className={styles.navLink}>
                <span className={styles.navNum}>07</span>&nbsp;ワークフロー
              </a>
              <a href="#skill-writing" className={styles.navLink}>
                <span className={styles.navNum}>08</span>&nbsp;スキルの書き方
              </a>
              <a href="#best-practices" className={styles.navLink}>
                <span className={styles.navNum}>09</span>&nbsp;ベストプラクティス
              </a>
              <a href="#advanced" className={styles.navLink}>
                <span className={styles.navNum}>10</span>&nbsp;応用
              </a>
            </div>
            <div className={styles.topnavGroup}>
              <span className={styles.groupLabel}>参考</span>
              <a href="#sources" className={styles.navLink}>
                <span className={styles.navNum}>11</span>&nbsp;ソース
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.pageContent}>
        {/* ── HERO ── */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            Claude Cowork · 非開発者向けデスクトップ自動化ツール
          </div>
          <h1>
            Claude Cowork
            <br />
            完全入門ガイド
          </h1>
          <p className={styles.heroSub}>
            コードを一行も書かずに、自然言語の指示だけでファイル管理・タスク自動化を実現する
            Anthropic のデスクトップツール「Cowork」を、初学者向けにゼロから解説します。 Skills
            との連携・ベストプラクティス・実践ワークフロー例まで網羅。
          </p>
          <div className={styles.heroMeta}>
            <span className={`${styles.heroChip} ${styles.chipOrange}`}>🖥️ デスクトップアプリ</span>
            <span className={`${styles.heroChip} ${styles.chipBlue}`}>👥 非開発者向け</span>
            <span className={`${styles.heroChip} ${styles.chipGreen}`}>⚡ Skills 対応</span>
            <span className={`${styles.heroChip} ${styles.chipPurple}`}>🤖 Claude AI 搭載</span>
          </div>
        </section>

        {/* ── 01 WHAT IS COWORK ── */}
        <section className={styles.section} id="what">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>01</span>
            <h2>Cowork とは何か？</h2>
          </div>
          <p>
            <strong>Cowork</strong> は Anthropic が提供するデスクトップアプリケーションです。
            <strong>コードを一行も書かずに</strong>、自然言語（日本語・英語）の指示だけで
            ファイル管理やタスク自動化を実現できます。
          </p>
          <div className={`${styles.callout} ${styles.calloutTip}`}>
            <span className={styles.calloutIcon}>💡</span>
            <p>
              <strong>ひとことで言うと:</strong>
              「AI にパソコンの操作権限を与えたもの」です。 Claude に「この 400 件の PDF
              を要約して」「毎週月曜に売上レポートをまとめて」と話しかけるだけで実行してくれます。
            </p>
          </div>
          <h3>Cowork が解決する問題</h3>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>😩</div>
              <div className={styles.cardTitle}>繰り返し作業の疲弊</div>
              <div className={styles.cardDesc}>
                毎週同じ形式でファイルを整理・リネーム・変換する単調作業を自動化。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📄</div>
              <div className={styles.cardTitle}>大量ドキュメント処理</div>
              <div className={styles.cardDesc}>
                PDF・Word・Excel
                を一括で読み取り・要約・変換。手作業では数時間かかる処理が分単位で完了。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🔄</div>
              <div className={styles.cardTitle}>定型ワークフロー</div>
              <div className={styles.cardDesc}>
                「毎朝9時に〇〇をして」「このフォルダにファイルが来たら〇〇して」などを定期実行。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🚫</div>
              <div className={styles.cardTitle}>プログラミング不要</div>
              <div className={styles.cardDesc}>
                Python・bash の知識ゼロでも、複雑な自動化タスクを自然言語で実現できる。
              </div>
            </div>
          </div>
          <h3>Cowork vs Claude.ai の違い</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_0} />
          </div>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <span className={styles.calloutIcon}>ℹ️</span>
            <p>
              <strong>現在の提供状況:</strong> Cowork は Anthropic の Beta
              製品として提供されています。 アクセスには waitlist への登録が必要な場合があります。
              最新の提供状況は <Ext href="https://claude.ai">claude.ai</Ext> で確認してください。
            </p>
          </div>
        </section>

        {/* sections s02–s11 will be added in subsequent Green commits */}
      </div>
    </div>
  );
}
