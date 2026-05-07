"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Pattern = {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  structure: string;
  useCase: string;
  codeNode: React.ReactNode;
};

/**
 * Render the "Basic" SKILL.md example block for the git-commit-formatter pattern.
 *
 * The block includes YAML-like frontmatter (name and description), a markdown
 * title and rules section showing the required commit message format, and an
 * example list of `type` values (`feat`, `fix`, `docs`, `style`, `refactor`).
 *
 * @returns A JSX element containing the styled SKILL.md sample for the Basic pattern.
 */

function CodeBasic() {
  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeBar}>
        <span>{"SKILL.md"}</span>
        <span className={styles.codeLang}>MARKDOWN</span>
      </div>
      <div className={styles.codeBody}>
        <span className={styles.cs}>{"---"}</span>
        {"\n"}
        <span className={styles.cm}>{"name"}</span>
        {": "}
        <span className={styles.cv}>{"git-commit-formatter"}</span>
        {"\n"}
        <span className={styles.cm}>{"description"}</span>
        {": "}
        <span className={styles.cv}>{"|"}</span>
        {"\n"}
        {"  "}
        <span className={styles.cv}>
          {"Gitコミットメッセージを Conventional Commits 仕様に整形する。"}
        </span>
        {"\n"}
        {"  "}
        <span className={styles.cv}>
          {"「コミット」「commit」「コミットメッセージ」などが出たら使用。"}
        </span>
        {"\n"}
        <span className={styles.cs}>{"---"}</span>
        {"\n\n"}
        <span className={styles.ch}>{"# Git コミットフォーマッター"}</span>
        {"\n\n"}
        <span className={styles.ch}>{"## ルール"}</span>
        {"\n"}
        {"コミットメッセージは必ず以下の形式にすること:\n\n"}
        <span className={styles.cs}>{"```"}</span>
        {"\n"}
        {"<type>(<scope>): <subject>\n\n"}
        {"[optional body]\n"}
        {"[optional footer]\n"}
        <span className={styles.cs}>{"```"}</span>
        {"\n\n"}
        <span className={styles.ch}>{"## type の種類"}</span>
        {"\n"}
        {"- "}
        <span className={styles.ck}>{"feat"}</span>
        {": 新機能\n"}
        {"- "}
        <span className={styles.ck}>{"fix"}</span>
        {": バグ修正\n"}
        {"- "}
        <span className={styles.ck}>{"docs"}</span>
        {": ドキュメント変更\n"}
        {"- "}
        <span className={styles.ck}>{"style"}</span>
        {": フォーマット変更\n"}
        {"- "}
        <span className={styles.ck}>{"refactor"}</span>
        {": リファクタリング"}
      </div>
    </div>
  );
}

/**
 * Renders the "Reference" SKILL.md example block illustrating an API-integration workflow and its rules.
 *
 * The returned JSX is a static, render-only code sample that shows frontmatter, step-by-step instructions to read `references/api-spec.md`, guidance for selecting the correct endpoint, and rules that prohibit guessing.
 *
 * @returns The JSX element for the "Reference" SKILL.md sample block.
 */
function CodeReference() {
  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeBar}>
        <span>{"SKILL.md"}</span>
        <span className={styles.codeLang}>MARKDOWN</span>
      </div>
      <div className={styles.codeBody}>
        <span className={styles.cs}>{"---"}</span>
        {"\n"}
        <span className={styles.cm}>{"name"}</span>
        {": "}
        <span className={styles.cv}>{"api-integrator"}</span>
        {"\n"}
        <span className={styles.cm}>{"description"}</span>
        {": "}
        <span className={styles.cv}>{"|"}</span>
        {"\n"}
        {"  "}
        <span className={styles.cv}>{"外部APIとの統合コードを生成する。"}</span>
        {"\n"}
        {"  "}
        <span className={styles.cv}>
          {"「API連携」「HTTP リクエスト」「fetch」などが出たら使用。"}
        </span>
        {"\n"}
        <span className={styles.cs}>{"---"}</span>
        {"\n\n"}
        <span className={styles.ch}>{"# API インテグレーター"}</span>
        {"\n\n"}
        <span className={styles.ch}>{"## 手順"}</span>
        {"\n"}
        {"1. "}
        <span className={styles.cs}>{"`references/api-spec.md`"}</span>
        {" を読み込んでAPIの仕様を確認する\n"}
        {"2. ユーザーが求めるエンドポイントを特定する\n"}
        {"3. 仕様に基づき正確なコードを生成する\n\n"}
        <span className={styles.ch}>{"## Rules"}</span>
        {"\n"}
        <span className={styles.ce}>{"❌ 推測でコードを書かないこと"}</span>
        {"\n"}
        <span className={styles.cg}>{"✅ 必ず参照ファイルを読んでから実装すること"}</span>
      </div>
    </div>
  );
}

/**
 * Render a styled SKILL.md sample demonstrating the Tool Use pattern for database migrations.
 *
 * Renders a static, styled code block that documents a database migration tool: frontmatter (name/description),
 * an execution command example, argument descriptions, and a short step-by-step procedure.
 *
 * @returns A JSX element containing the formatted SKILL.md example for the "db-migrator" tool
 */
function CodeTool() {
  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeBar}>
        <span>{"SKILL.md"}</span>
        <span className={styles.codeLang}>MARKDOWN</span>
      </div>
      <div className={styles.codeBody}>
        <span className={styles.cs}>{"---"}</span>
        {"\n"}
        <span className={styles.cm}>{"name"}</span>
        {": "}
        <span className={styles.cv}>{"db-migrator"}</span>
        {"\n"}
        <span className={styles.cm}>{"description"}</span>
        {": "}
        <span className={styles.cv}>{"|"}</span>
        {"\n"}
        {"  "}
        <span className={styles.cv}>{"データベースマイグレーションを実行する。"}</span>
        {"\n"}
        {"  "}
        <span className={styles.cv}>
          {"「マイグレーション」「DB更新」「スキーマ変更」が出たら使用。"}
        </span>
        {"\n"}
        <span className={styles.cs}>{"---"}</span>
        {"\n\n"}
        <span className={styles.ch}>{"# DB マイグレーター"}</span>
        {"\n\n"}
        <span className={styles.ch}>{"## 実行方法"}</span>
        {"\n"}
        {"以下のスクリプトを使ってマイグレーションを実行する:\n\n"}
        <span className={styles.cs}>{"```bash"}</span>
        {"\n"}
        <span className={styles.ck}>{"python"}</span>
        {" scripts/migrate.py --env <environment> --version <version>\n"}
        <span className={styles.cs}>{"```"}</span>
        {"\n\n"}
        <span className={styles.ch}>{"## 引数"}</span>
        {"\n"}
        {"- --env: 環境（dev / staging / prod）\n"}
        {"- --version: マイグレーションバージョン番号\n\n"}
        <span className={styles.ch}>{"## 手順"}</span>
        {"\n"}
        {"1. ユーザーの指示から env と version を読み取る\n"}
        {"2. スクリプトを実行する前に確認を求める\n"}
        {"3. エラーが出た場合はロールバックコマンドを提示する"}
      </div>
    </div>
  );
}

/**
 * Renders the "All-in-One" SKILL.md example block used in the patterns list.
 *
 * The output is a styled, read-only code-like block that shows a full-stack
 * generator SKILL.md sample including frontmatter, overview, step-by-step guide,
 * and rules.
 *
 * @returns A JSX element containing the formatted SKILL.md sample for the
 * "All-in-One" pattern.
 */
function CodeAllInOne() {
  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeBar}>
        <span>{"SKILL.md"}</span>
        <span className={styles.codeLang}>MARKDOWN</span>
      </div>
      <div className={styles.codeBody}>
        <span className={styles.cs}>{"---"}</span>
        {"\n"}
        <span className={styles.cm}>{"name"}</span>
        {": "}
        <span className={styles.cv}>{"full-stack-generator"}</span>
        {"\n"}
        <span className={styles.cm}>{"description"}</span>
        {": "}
        <span className={styles.cv}>{"|"}</span>
        {"\n"}
        {"  "}
        <span className={styles.cv}>{"React + TypeScript のフルスタックアプリを生成する。"}</span>
        {"\n"}
        {"  "}
        <span className={styles.cv}>
          {"「アプリを作って」「スキャフォールド」「雛形生成」が出たら使用。"}
        </span>
        {"\n"}
        <span className={styles.cs}>{"---"}</span>
        {"\n\n"}
        <span className={styles.ch}>{"# Full Stack Generator"}</span>
        {"\n\n"}
        <span className={styles.ch}>{"## Overview"}</span>
        {"\n"}
        {"ベストプラクティスに基づいたReact+TypeScriptアプリの\n"}
        {"雛形を自動生成する。\n\n"}
        <span className={styles.ch}>{"## Step-by-Step Guide"}</span>
        {"\n"}
        {"1. "}
        <span className={styles.cs}>{"`references/best-practices.md`"}</span>
        {" を読み込む\n"}
        {"2. ユーザーの要件を確認する\n"}
        {"3. "}
        <span className={styles.cs}>{"`python scripts/scaffold.py --name <app-name>`"}</span>
        {" を実行\n"}
        {"4. "}
        <span className={styles.cs}>{"`assets/template.tsx`"}</span>
        {" を参考にコンポーネントを生成\n\n"}
        <span className={styles.ch}>{"## Rules"}</span>
        {"\n"}
        <span className={styles.cg}>{"✅ 必ずスクリプトを使って一貫した構造を生成すること"}</span>
        {"\n"}
        <span className={styles.ce}>{"❌ 手動でファイルを生成しないこと（一貫性が壊れる）"}</span>
      </div>
    </div>
  );
}

const PATTERNS: Pattern[] = [
  {
    id: "basic",
    label: "Basic（SKILL.mdのみ）",
    emoji: "📄",
    desc: "最もシンプルな形。プロンプトエンジニアリングだけで完結するスキル。",
    structure: "my-skill/\n└── 📄 SKILL.md  ← これだけ！",
    useCase: "シンプルな指示・フォーマット変換・テキスト生成",
    codeNode: <CodeBasic />,
  },
  {
    id: "reference",
    label: "Reference（+参照ドキュメント）",
    emoji: "📚",
    desc: "APIドキュメントや仕様書を参照しながら動作するスキル。大きな参照ファイルを分離して、必要なときだけ読み込みます。",
    structure:
      "api-integrator/\n├── 📄 SKILL.md\n└── 📁 references/\n    └── api-spec.md  ← API仕様書",
    useCase: "仕様書・APIドキュメント参照が必要なタスク",
    codeNode: <CodeReference />,
  },
  {
    id: "tool",
    label: "Tool Use（+スクリプト）",
    emoji: "⚙️",
    desc: "PythonやBashスクリプトを実行するスキル。AIの確率論的な推測を排除し、確実に正確な結果を得られます。",
    structure:
      "db-migrator/\n├── 📄 SKILL.md\n└── 📁 scripts/\n    └── migrate.py  ← 実行スクリプト",
    useCase: "バリデーション・テスト実行・繰り返し作業の自動化",
    codeNode: <CodeTool />,
  },
  {
    id: "allinone",
    label: "All-in-One（全要素）",
    emoji: "🚀",
    desc: "最も高度なパターン。スクリプト・参照ドキュメント・アセットを全て組み合わせた本格的なスキル。",
    structure:
      "full-stack-generator/\n├── 📄 SKILL.md\n├── 📁 scripts/\n│   └── scaffold.py\n├── 📁 references/\n│   └── best-practices.md\n└── 📁 assets/\n    └── template.tsx",
    useCase: "複雑なワークフロー・チーム全体での知識共有・プロジェクト固有の高度な自動化",
    codeNode: <CodeAllInOne />,
  },
];

/**
 * Render the examples page with selectable SKILL.md pattern tabs.
 *
 * Displays a tab list of predefined patterns and a tabpanel showing the active
 * pattern's detail card, directory structure, use case, and SKILL.md sample.
 * The UI updates the displayed pattern when a tab is activated and supports
 * keyboard navigation (ArrowRight, ArrowLeft, Home, End) between tabs.
 *
 * @returns The root React element for the examples page containing the tab list, the active tabpanel, and the corresponding SKILL.md sample.
 */
export default function ExamplesApp() {
  const [active, setActive] = useState("basic");
  const current = PATTERNS.find((p) => p.id === active) ?? PATTERNS[0];

  /**
   * Handle keyboard navigation for the tab list, updating the active tab and moving focus.
   *
   * Supports ArrowRight (next, wraps to first), ArrowLeft (previous, wraps to last), Home (first),
   * and End (last). When a key is handled, prevents the default browser action, updates the active
   * tab state, and shifts focus to the associated tab element with id `tab-<id>`.
   *
   * @param e - The keyboard event from the tab list
   */
  function handleTabKeyDown(e: React.KeyboardEvent) {
    const ids = PATTERNS.map((p) => p.id);
    const idx = ids.indexOf(active);
    let next: string | undefined;
    if (e.key === "ArrowRight") {
      next = ids[(idx + 1) % ids.length];
    } else if (e.key === "ArrowLeft") {
      next = ids[(idx - 1 + ids.length) % ids.length];
    } else if (e.key === "Home") {
      next = ids[0];
    } else if (e.key === "End") {
      next = ids[ids.length - 1];
    }
    if (next !== undefined) {
      e.preventDefault();
      setActive(next);
      document.getElementById(`tab-${next}`)?.focus();
    }
  }

  return (
    <div>
      {/* Tab buttons */}
      <div className={styles.patternTabs} role="tablist" onKeyDown={handleTabKeyDown}>
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            id={`tab-${p.id}`}
            type="button"
            role="tab"
            aria-selected={active === p.id}
            aria-controls={`panel-${p.id}`}
            tabIndex={active === p.id ? 0 : -1}
            className={`${styles.patternTab}${active === p.id ? ` ${styles.patternTabActive}` : ""}`}
            onClick={() => setActive(p.id)}
          >
            {p.emoji} {p.label}
          </button>
        ))}
      </div>

      {/* Tabpanel — wraps all content controlled by active tab */}
      <div id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`}>
        {/* Detail card */}
        <div className={styles.patternCard}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{current.emoji}</div>
          <div
            style={{ fontWeight: 700, color: "#0f766e", fontSize: "1rem", marginBottom: "0.25rem" }}
          >
            {current.label}
          </div>
          <p style={{ color: "#475569", fontSize: "0.875rem", margin: 0 }}>{current.desc}</p>
        </div>

        {/* 2-col grid: dir structure + use case */}
        <div className={styles.patternGrid} style={{ marginBottom: "1rem" }}>
          <div>
            <div
              style={{
                fontWeight: 700,
                color: "#334155",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
              }}
            >
              📁 ディレクトリ構成
            </div>
            <div className={styles.dirTree}>{current.structure}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className={styles.useCase} style={{ width: "100%" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{current.emoji}</div>
              <div style={{ fontWeight: 700, color: "#065f46", fontSize: "0.875rem" }}>
                このパターンが向いている場合
              </div>
              <div
                style={{
                  color: "#059669",
                  fontSize: "0.75rem",
                  marginTop: "0.5rem",
                  lineHeight: 1.75,
                }}
              >
                {current.useCase}
              </div>
            </div>
          </div>
        </div>

        {/* Code block */}
        <div
          style={{
            fontWeight: 700,
            color: "#334155",
            fontSize: "0.875rem",
            marginBottom: "0.5rem",
          }}
        >
          📄 SKILL.md サンプル
        </div>
        {current.codeNode}
      </div>
    </div>
  );
}
