import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Google Antigravity — AI仕様駆動開発 ベストプラクティス完全ガイド",
  description:
    "GEMINI.md から SKILL.md・Rules・Workflows・Artifacts まで、Google Antigravity エコシステムの全体を根拠ソース付きで徹底解説。初学者でもステップバイステップで理解できるベストプラクティス完全ガイド。",
};

export default function Page() {
  return (
    <>
      {/* HERO */}
      <header className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroTag}>Google Antigravity × Gemini 3.1 Pro</div>
        <h1 className={styles.heroH1}>
          AI仕様駆動開発における
          <br />
          <span className={styles.rainbow}>Google Antigravity</span>
          <br />
          ベストプラクティス完全ガイド
        </h1>
        <p className={styles.heroSub}>
          初学者でもステップバイステップで理解できる — GEMINI.md から
          SKILL.md・Rules・Workflows・Artifacts まで、
          Antigravityエコシステムの全体を根拠ソース付きで徹底解説
        </p>
        <div className={styles.heroChips}>
          <span className={`${styles.chip} ${styles.cb}`}>Google Antigravity</span>
          <span className={`${styles.chip} ${styles.cg}`}>Gemini 3.1 Pro</span>
          <span className={`${styles.chip} ${styles.cy}`}>Agent-First IDE</span>
          <span className={`${styles.chip} ${styles.cr}`}>Spec-Driven Dev</span>
          <span className={`${styles.chip} ${styles.cp}`}>v1.20.3 対応</span>
        </div>
      </header>

      {/* MAIN */}
      <main className={styles.wrap}>
        {/* TOC */}
        <nav className={styles.toc}>
          <div className={styles.tocLabel}>目次</div>
          <ol>
            <li>
              <a href="#overview">Google Antigravity とは — 従来IDEとの比較</a>
            </li>
            <li>
              <a href="#directory">全体ファイル構成と推奨ディレクトリ</a>
            </li>
            <li>
              <a href="#gemini-md">GEMINI.md — グローバル永続メモリ</a>
            </li>
            <li>
              <a href="#skills">SKILL.md — 進歩的開示ナレッジ（最重要）</a>
            </li>
            <li>
              <a href="#rules">Rules — 受動的制約・バックグラウンドシステムプロンプト</a>
            </li>
            <li>
              <a href="#workflows">Workflows — 能動的手順書</a>
            </li>
            <li>
              <a href="#artifacts">Artifacts — エージェント自動生成の証拠</a>
            </li>
            <li>
              <a href="#models">対応モデルと料金</a>
            </li>
            <li>
              <a href="#best-practices">横断ベストプラクティス 10則</a>
            </li>
            <li>
              <a href="#sources">参考ソース一覧</a>
            </li>
          </ol>
        </nav>

        {/* SECTION 01: OVERVIEW — TODO: faithful migration */}
        <section id="overview" className={styles.sec}>
          <div className={styles.secLabel}>Section 01</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>01.</span>Google Antigravity とは — 従来IDEとの比較
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 02: DIRECTORY — TODO: faithful migration */}
        <section id="directory" className={styles.sec}>
          <div className={styles.secLabel}>Section 02</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>02.</span>全体ファイル構成と推奨ディレクトリ
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 03: GEMINI.md — TODO: faithful migration */}
        <section id="gemini-md" className={styles.sec}>
          <div className={styles.secLabel}>Section 03</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>03.</span>GEMINI.md — グローバル永続メモリ
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 04: SKILLS — TODO: faithful migration */}
        <section id="skills" className={styles.sec}>
          <div className={styles.secLabel}>Section 04</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>04.</span>SKILL.md — 進歩的開示ナレッジ（最重要）
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 05: RULES — TODO: faithful migration */}
        <section id="rules" className={styles.sec}>
          <div className={styles.secLabel}>Section 05</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>05.</span>Rules (.agent/rules/) — 受動的制約
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 06: WORKFLOWS — TODO: faithful migration */}
        <section id="workflows" className={styles.sec}>
          <div className={styles.secLabel}>Section 06</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>06.</span>Workflows — 能動的手順書
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 07: ARTIFACTS — TODO: faithful migration */}
        <section id="artifacts" className={styles.sec}>
          <div className={styles.secLabel}>Section 07</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>07.</span>Artifacts — エージェント自動生成の証拠
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 08: MODELS — TODO: faithful migration */}
        <section id="models" className={styles.sec}>
          <div className={styles.secLabel}>Section 08</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>08.</span>対応モデルと料金（2026年3月現在）
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 09: BEST-PRACTICES — TODO: faithful migration */}
        <section id="best-practices" className={styles.sec}>
          <div className={styles.secLabel}>Section 09</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>09.</span>横断ベストプラクティス 10則
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 10: SOURCES — TODO: faithful migration */}
        <section id="sources" className={styles.sec}>
          <div className={styles.secLabel}>Section 10</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>10.</span>参考ソース一覧（公式・一次情報優先）
          </h2>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>sources.placeholder</span>
              <span className={styles.codeLang}>PLACEHOLDER</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cc}>{"/* 実装予定 */"}</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
