"use client";
import { useRef, useState } from "react";
import styles from "./page.module.css";

const PATTERNS = [
  { id: "p1", label: "Pattern 1: Basic" },
  { id: "p2", label: "Pattern 2: Reference" },
  { id: "p3", label: "Pattern 3: Tool Use" },
  { id: "p4", label: "Pattern 4: All-in-One" },
] as const;

type PatternId = (typeof PATTERNS)[number]["id"];

/**
 * Renders a tabbed UI demonstrating four predefined skill-guide patterns (p1–p4).
 *
 * Each tab is keyboard- and ARIA-friendly and selects one of four panels that describe
 * different project patterns (Basic, Reference, Tool Use, All-in-One). The component
 * manages internal selection state, defaulting to pattern "p1".
 *
 * @returns A React element containing the tablist and four accessible tab panels for patterns `p1`–`p4`.
 */
export default function PatternsApp() {
  const [active, setActive] = useState<PatternId>("p1");
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div className={styles.tabs}>
      <div role="tablist" aria-label="Pattern tabs" className={styles.tabList}>
        {PATTERNS.map((p, index) => (
          <button
            key={p.id}
            id={`tab-${p.id}`}
            type="button"
            role="tab"
            aria-selected={active === p.id}
            aria-controls={`panel-${p.id}`}
            tabIndex={active === p.id ? 0 : -1}
            className={`${styles.tabBtn}${active === p.id ? ` ${styles.tabBtnActive}` : ""}`}
            onClick={() => setActive(p.id)}
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            onKeyDown={(e) => {
              let next = index;
              if (e.key === "ArrowRight") next = (index + 1) % PATTERNS.length;
              else if (e.key === "ArrowLeft")
                next = (index - 1 + PATTERNS.length) % PATTERNS.length;
              else return;
              e.preventDefault();
              setActive(PATTERNS[next].id);
              tabsRef.current[next]?.focus();
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Panel p1 */}
      <div
        id="panel-p1"
        role="tabpanel"
        aria-labelledby="tab-p1"
        className={active === "p1" ? styles.tabPanelActive : styles.tabPanel}
        hidden={active !== "p1"}
      >
        <div className={styles.callout}>
          <strong>Pattern 1 — Basic（SKILL.md のみ）</strong>
          <br />
          最もシンプルな構成。プロンプトエンジニアリングだけで完結するスキル。
        </div>
        <div className={styles.codeWrap}>
          <div className={styles.codeHeader}>
            <div className={styles.macDots}>
              <div className={`${styles.macDot} ${styles.dotRed}`} />
              <div className={`${styles.macDot} ${styles.dotYellow}`} />
              <div className={`${styles.macDot} ${styles.dotGreen}`} />
            </div>
            <span className={styles.codeLang}>git-commit-formatter/SKILL.md</span>
          </div>
          <div className={styles.codeBody}>
            <span className={styles.cComment}>---</span>
            {"\n"}
            <span className={styles.cKey}>name</span>
            {": "}
            <span className={styles.cVal}>git-commit-formatter</span>
            {"\n"}
            <span className={styles.cKey}>description</span>
            {": |\n  "}
            <span className={styles.cVal}>
              Gitコミットメッセージを Conventional Commits 仕様に従って整形する。
            </span>
            {"\n  "}
            <span className={styles.cVal}>
              コミット、git commit、コミットメッセージという言葉が出たら必ず使うこと。
            </span>
            {"\n"}
            <span className={styles.cComment}>---</span>
            {"\n"}
            <span className={styles.cHead}>## ルール</span>
            {"\n"}
            <span className={styles.cVal}>{"形式: `<type>(<scope>): <subject>`"}</span>
            {"\n"}
            <span className={styles.cHead}>## Examples</span>
            {"\n"}
            <span className={styles.cVal}>feat(auth): ログイン機能を追加</span>
            {"\n"}
            <span className={styles.cVal}>fix(api): レート制限のバグを修正</span>
          </div>
        </div>
        <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <span className={`${styles.tag} ${styles.tagG}`}>軽量</span>
          <span className={`${styles.tag} ${styles.tagG}`}>即効性あり</span>
          <span className={`${styles.tag} ${styles.tagG}`}>初心者にも適用可</span>
        </div>
      </div>

      {/* Panel p2 */}
      <div
        id="panel-p2"
        role="tabpanel"
        aria-labelledby="tab-p2"
        className={active === "p2" ? styles.tabPanelActive : styles.tabPanel}
        hidden={active !== "p2"}
      >
        <div className={styles.callout}>
          <strong>Pattern 2 — Reference（SKILL.md + /references）</strong>
          <br />
          仕様書やAPIドキュメントを参照しながら動作するスキル。コンテキストを汚染せずに豊富な知識を提供できる。
        </div>
        <div className={styles.pathBox}>
          {"api-integrator/\n"}
          {"├── SKILL.md\n"}
          {"└── references/\n"}
          {"    └── api-spec.md ← オンデマンド参照"}
        </div>
        <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <span className={`${styles.tag} ${styles.tagG}`}>仕様書との整合性</span>
          <span className={`${styles.tag} ${styles.tagG}`}>コンテキスト節約</span>
          <span className={`${styles.tag} ${styles.tagG}`}>大規模ドキュメントに有効</span>
        </div>
      </div>

      {/* Panel p3 */}
      <div
        id="panel-p3"
        role="tabpanel"
        aria-labelledby="tab-p3"
        className={active === "p3" ? styles.tabPanelActive : styles.tabPanel}
        hidden={active !== "p3"}
      >
        <div className={styles.callout}>
          <strong>Pattern 3 — Tool Use（SKILL.md + /scripts）</strong>
          <br />
          スクリプトを実行するスキル。決定論的な検証処理を実現。危険な操作には{" "}
          <code className={styles.inlineCode}>disable-model-invocation: true</code> 必須。
        </div>
        <div className={styles.pathBox}>
          {"db-migrator/\n"}
          {"├── SKILL.md\n"}
          {"└── scripts/\n"}
          {"    └── migrate.py ← 実際に実行されるスクリプト"}
        </div>
        <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <span className={`${styles.tag} ${styles.tagG}`}>決定論的</span>
          <span className={`${styles.tag} ${styles.tagG}`}>自動化に最強</span>
          <span className={`${styles.tag} ${styles.tagR}`}>
            危険操作はdisable-model-invocation必須
          </span>
        </div>
      </div>

      {/* Panel p4 */}
      <div
        id="panel-p4"
        role="tabpanel"
        aria-labelledby="tab-p4"
        className={active === "p4" ? styles.tabPanelActive : styles.tabPanel}
        hidden={active !== "p4"}
      >
        <div className={styles.callout}>
          <strong>Pattern 4 — All-in-One（全要素の組み合わせ）</strong>
          <br />
          SKILL.md + scripts/ + references/ + assets/ を全て活用する最高度のパターン。
        </div>
        <div className={styles.pathBox}>
          {"full-stack-generator/\n"}
          {"├── SKILL.md ← 統合指示書\n"}
          {"├── scripts/\n"}
          {"│   └── scaffold.py\n"}
          {"├── references/\n"}
          {"│   └── best-practices.md\n"}
          {"└── assets/\n"}
          {"    └── template.tsx"}
        </div>
        <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <span className={`${styles.tag} ${styles.tagG}`}>最大の能力</span>
          <span className={`${styles.tag} ${styles.tagG}`}>エンタープライズ向け</span>
          <span className={`${styles.tag} ${styles.tagR}`}>設計コストが高い</span>
        </div>
      </div>
    </div>
  );
}
