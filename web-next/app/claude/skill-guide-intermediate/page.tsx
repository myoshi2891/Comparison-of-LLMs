import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "SKILL.md 中級者完全攻略ガイド — Claude Code",
  description:
    "プログレッシブ・ディスクロージャー、トークン経済、動的コンテキスト注入、context:fork、エンタープライズプロビジョニングまで網羅した実践リファレンスです。",
};

export default function Page() {
  return (
    <div className={styles.pageWrap}>
      <div className={styles.progress} />

      <nav className={styles.pageToc} aria-label="ページ内目次">
        <div className={styles.navInner}>
          <a href="#arch" className={styles.navLogo}>
            SKILL<span>.md</span> — 中級者ガイド
          </a>
          <div className={styles.navLinks}>
            <a href="#arch" className={styles.navLink}>
              01 アーキテクチャ
            </a>
            <a href="#yaml" className={styles.navLink}>
              02 YAML
            </a>
            <a href="#instruction" className={styles.navLink}>
              03 インストラクション設計
            </a>
            <a href="#args" className={styles.navLink}>
              04 引数
            </a>
            <a href="#fork" className={styles.navLink}>
              05 Fork
            </a>
            <a href="#trigger" className={styles.navLink}>
              06 トリガーチューニング
            </a>
            <a href="#debug" className={styles.navLink}>
              07 デバッグ
            </a>
            <a href="#enterprise" className={styles.navLink}>
              08 Enterprise
            </a>
            <a href="#self" className={styles.navLink}>
              09 自己改善型スキル
            </a>
          </div>
        </div>
      </nav>

      <div className={styles.wrapper}>
        {/* ── Hero ── */}
        <div className={styles.hero}>
          <div className={styles.heroBadge}>Claude Code v2.1.x 対応 — 2026年3月最終更新</div>
          <h1>
            SKILL.md
            <br />
            中級者完全攻略ガイド
          </h1>
          <p className={styles.heroSub}>
            プログレッシブ・ディスクロージャー、トークン経済、動的コンテキスト注入、
            <code>context: fork</code>、<br />
            エンタープライズプロビジョニングまで網羅した実践リファレンス
          </p>
          <div className={styles.heroMeta}>
            <div className={styles.heroMetaItem}>
              対象 <span>中級〜上級エンジニア</span>
            </div>
            <div className={styles.heroMetaItem}>
              難易度 <span>★★★☆☆</span>
            </div>
            <div className={styles.heroMetaItem}>
              推定読了 <span>25〜35 分</span>
            </div>
          </div>
        </div>

        {/* ── TOC ── */}
        <div className={styles.toc}>
          <div className={styles.tocTitle}>{"// 目次"}</div>
          <div className={styles.tocGrid}>
            <a href="#arch" className={styles.tocItem}>
              <span className={styles.tocNum}>01</span>
              3層アーキテクチャとトークン経済
            </a>
            <a href="#yaml" className={styles.tocItem}>
              <span className={styles.tocNum}>02</span>
              YAMLフロントマター全フィールド詳解
            </a>
            <a href="#instruction" className={styles.tocItem}>
              <span className={styles.tocNum}>03</span>
              インストラクション設計パターン
            </a>
            <a href="#args" className={styles.tocItem}>
              <span className={styles.tocNum}>04</span>
              動的コンテキスト・引数処理
            </a>
            <a href="#fork" className={styles.tocItem}>
              <span className={styles.tocNum}>05</span>
              {"context:fork vs Subagents"}
            </a>
            <a href="#trigger" className={styles.tocItem}>
              <span className={styles.tocNum}>06</span>
              トリガーチューニング戦略
            </a>
            <a href="#debug" className={styles.tocItem}>
              <span className={styles.tocNum}>07</span>
              デバッグ・CLIフラグ完全表
            </a>
            <a href="#enterprise" className={styles.tocItem}>
              <span className={styles.tocNum}>08</span>
              Enterpriseプロビジョニング
            </a>
            <a href="#self" className={styles.tocItem}>
              <span className={styles.tocNum}>09</span>
              自己改善型スキルパターン
            </a>
          </div>
        </div>

        {/* ── Section 01: arch ── */}
        <div className={styles.sec} id="arch">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 01</div>
            <h2>3層アーキテクチャとトークン経済</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s01 */}
        </div>

        {/* ── Section 02: yaml ── */}
        <div className={styles.sec} id="yaml">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 02</div>
            <h2>YAMLフロントマター — 全フィールド詳解</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s02 */}
        </div>

        {/* ── Section 03: instruction ── */}
        <div className={styles.sec} id="instruction">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 03</div>
            <h2>インストラクション設計 — 自由度のコントロール</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s03 */}
        </div>

        {/* ── Section 04: args ── */}
        <div className={styles.sec} id="args">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 04</div>
            <h2>動的コンテキスト注入 &amp; 引数処理メカニズム</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s04 */}
        </div>

        {/* ── Section 05: fork ── */}
        <div className={styles.sec} id="fork">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 05</div>
            <h2>{"context:fork vs カスタムSubagents — 境界線を引く"}</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s05 */}
        </div>

        {/* ── Section 06: trigger ── */}
        <div className={styles.sec} id="trigger">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 06</div>
            <h2>トリガーチューニング戦略</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s06 */}
        </div>

        {/* ── Section 07: debug ── */}
        <div className={styles.sec} id="debug">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 07</div>
            <h2>デバッグ技術 — CLI フラグ完全リファレンス</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s07 */}
        </div>

        {/* ── Section 08: enterprise ── */}
        <div className={styles.sec} id="enterprise">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 08</div>
            <h2>Enterpriseプロビジョニング — 組織全体への展開</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s08 */}
        </div>

        {/* ── Section 09: self ── */}
        <div className={styles.sec} id="self">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 09</div>
            <h2>自己改善型スキル — 最先端パターン</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s09 */}
        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <p>Claude Code SKILL.md 中級者完全攻略ガイド</p>
          <p style={{ marginTop: "6px", fontSize: "12px" }}>
            Claude Code v2.1.x 対応 ｜ 2026年3月更新
          </p>
          <p style={{ marginTop: "12px", fontSize: "11px", color: "var(--text3)" }}>
            参考:{" "}
            <a
              href="https://code.claude.com/docs/en/skills"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--blue)", textDecoration: "none" }}
            >
              code.claude.com/docs/en/skills
            </a>
            {" ｜ "}
            <a
              href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--blue)", textDecoration: "none" }}
            >
              Agent Skills Overview
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
