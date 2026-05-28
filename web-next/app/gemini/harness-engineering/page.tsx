import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Google ハーネスエンジニアリング 完全ガイド",
  description: "Googleが実践するテストハーネス設計の技術とベストプラクティスを解説する完全ガイドです。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const TOC_ITEMS = [
  { id: "s1", label: "01. ハーネスエンジニアリングとは何か" },
  { id: "s2", label: "02. Googleのテスト哲学 — テストピラミッド" },
  { id: "s3", label: "03. テストハーネスを構成する5つの要素" },
  { id: "s4", label: "04. テストダブル — 替え玉の4種類" },
  { id: "s5", label: "05. ハーミティックテスト — 孤立した清潔なテスト" },
  { id: "s6", label: "06. ステップバイステップ実装ガイド" },
  { id: "s7", label: "07. フレイキーテスト対策" },
  { id: "s8", label: "08. CIパイプラインへの組み込み" },
  { id: "s9", label: "09. AIエージェント評価ハーネス" },
  { id: "s10", label: "10. ベストプラクティス10則" },
  { id: "s11", label: "11. 参考ソース一覧" },
] as const;

export default function GeminiHarnessEngineeringPage() {
  return (
    <main className={styles.wrap}>
      <header>
        <h1>Google ハーネスエンジニアリング 完全ガイド</h1>
      </header>

      <nav className={styles.toc} aria-label="目次">
        <div className={styles.tocTitle}>目次</div>
        <ol>
          {TOC_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="s1" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>01.</span>ハーネスエンジニアリングとは何か</h2>
      </section>

      <section id="s2" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>02.</span>Googleのテスト哲学 — テストピラミッド</h2>
      </section>

      <section id="s3" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>03.</span>テストハーネスを構成する5つの要素</h2>
      </section>

      <section id="s4" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>04.</span>テストダブル — 替え玉の4種類</h2>
      </section>

      <section id="s5" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>05.</span>ハーミティックテスト — 孤立した清潔なテスト</h2>
      </section>

      <section id="s6" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>06.</span>ステップバイステップ実装ガイド</h2>
      </section>

      <section id="s7" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>07.</span>フレイキーテスト対策</h2>
      </section>

      <section id="s8" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>08.</span>CIパイプラインへの組み込み</h2>
      </section>

      <section id="s9" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>09.</span>AIエージェント評価ハーネス</h2>
      </section>

      <section id="s10" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>10.</span>ベストプラクティス10則</h2>
      </section>

      <section id="s11" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>11.</span>参考ソース一覧</h2>
        <div>
          <Ext href="https://abseil.io/resources/swe-book">Software Engineering at Google</Ext>
          <Ext href="https://testing.googleblog.com">Google Testing Blog</Ext>
          <Ext href="https://github.com/google/googletest">Google Test</Ext>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Google Testing Blog / Software Engineering at Google 準拠 — 2026年版</p>
      </footer>
    </main>
  );
}
