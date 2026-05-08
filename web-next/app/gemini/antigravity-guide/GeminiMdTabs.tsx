"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function GeminiMdTabs() {
  const [active, setActive] = useState<"g1" | "g2">("g1");

  return (
    <div className={styles.tabsWrap}>
      <div className={styles.tabList} role="tablist" aria-label="Gemini.md コードサンプル">
        <button
          type="button"
          id="tab-g1"
          role="tab"
          aria-selected={active === "g1"}
          aria-controls="panel-g1"
          tabIndex={active === "g1" ? 0 : -1}
          className={`${styles.tabBtn}${active === "g1" ? ` ${styles.tabBtnActive}` : ""}`}
          onClick={() => setActive("g1")}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setActive("g2");
              document.getElementById("tab-g2")?.focus();
            }
          }}
        >
          ✅ ベストプラクティス例
        </button>
        <button
          type="button"
          id="tab-g2"
          role="tab"
          aria-selected={active === "g2"}
          aria-controls="panel-g2"
          tabIndex={active === "g2" ? 0 : -1}
          className={`${styles.tabBtn}${active === "g2" ? ` ${styles.tabBtnActive}` : ""}`}
          onClick={() => setActive("g2")}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              setActive("g1");
              document.getElementById("tab-g1")?.focus();
            }
          }}
        >
          ❌ アンチパターン例
        </button>
      </div>

      {/* Panel 1: ベストプラクティス */}
      <div
        id="panel-g1"
        role="tabpanel"
        aria-labelledby="tab-g1"
        className={active === "g1" ? styles.tabPanelActive : styles.tabPanel}
      >
        <div className={styles.codeWrap}>
          <div className={styles.cbHead}>
            <div className={styles.cbDots}>
              <div className={`${styles.cbd} ${styles.cbdRed}`} />
              <div className={`${styles.cbd} ${styles.cbdYellow}`} />
              <div className={`${styles.cbd} ${styles.cbdGreen}`} />
            </div>
            <span>~/.gemini/GEMINI.md — ベストプラクティステンプレート</span>
          </div>
          <pre className={styles.codeBody}>
            <span className={styles.legHd}>{"# PROJECT: my-saas-app"}</span>
            {"\n\n"}
            <span className={styles.legHd}>{"## プロジェクト概要（2〜4文で）"}</span>
            {
              "\nNext.js 15 + Supabase のマルチテナント SaaS。\n本番: Vercel / DB: PostgreSQL (pgvector付き)\n\n"
            }
            <span className={styles.legHd}>{"## 技術スタック"}</span>
            {
              "\n- Frontend: Next.js 15 App Router, TypeScript\n- Backend: Supabase Edge Functions\n- Auth: Supabase Auth + Row Level Security\n\n"
            }
            <span className={styles.legHd}>{"## ビルド・テストコマンド"}</span>
            {"\n- ビルド: "}
            <span className={styles.legStr}>{"`pnpm build`"}</span>
            {"\n- テスト: "}
            <span className={styles.legStr}>{"`pnpm test`"}</span>
            {"\n- Lint: "}
            <span className={styles.legStr}>{"`pnpm lint`"}</span>
            {"\n\n"}
            <span className={styles.legHd}>{"## ⚠️ 禁止操作（絶対厳守）"}</span>
            {"\n"}
            <span
              className={styles.legHl2}
            >{`- \`supabase db reset\` は絶対に実行しない（本番データ消去）`}</span>
            {"\n"}
            <span className={styles.legHl2}>{`- \`.env.production\` の読み書き禁止`}</span>
            {"\n"}
            <span className={styles.legHl2}>{`- \`--force\` フラグは使わない`}</span>
            {"\n\n"}
            <span className={styles.legHd}>{"## エージェント委譲ルール"}</span>
            {
              "\n- タスクが3件以上かつ独立している → 並列実行\n- タスクに依存関係がある → 順次実行\n- 不確実な場合は実装前に確認すること\n\n"
            }
            <span className={styles.legHd}>{"## @import（モジュール分割）"}</span>
            {"\n"}
            <span className={styles.legStr}>{"@./docs/architecture.md"}</span>
            {"\n"}
            <span className={styles.legStr}>{"@./docs/api-conventions.md"}</span>
          </pre>
        </div>
      </div>

      {/* Panel 2: アンチパターン */}
      <div
        id="panel-g2"
        role="tabpanel"
        aria-labelledby="tab-g2"
        className={active === "g2" ? styles.tabPanelActive : styles.tabPanel}
      >
        <div className={`${styles.codeWrap} ${styles.codeWrapWarn}`}>
          <div className={styles.cbHead}>
            <div className={styles.cbDots}>
              <div className={`${styles.cbd} ${styles.cbdRed}`} />
              <div className={`${styles.cbd} ${styles.cbdYellow}`} />
              <div className={`${styles.cbd} ${styles.cbdGreen}`} />
            </div>
            <span>❌ やってはいけない例</span>
          </div>
          <pre className={styles.codeBody}>
            <span className={styles.legHd}>{"# My Project"}</span>
            {"\n\n"}
            <span className={styles.legCmt}>
              {"# ❌ コードスニペットを大量に貼り付ける（トークン浪費）"}
            </span>
            {"\n"}
            <span className={styles.legHl2}>
              {
                "function myUtil() {\n  const data = fetch('/api/data');\n  ... 300行のコード ...\n}"
              }
            </span>
            {"\n\n"}
            <span className={styles.legCmt}>{"# ❌ APIキーや機密情報を直接記載"}</span>
            {"\n"}
            <span className={styles.legHl2}>{"SUPABASE_KEY=eyJhbGci...（シークレット）"}</span>
            {"\n\n"}
            <span className={styles.legCmt}>
              {"# ❌ 変更履歴を蓄積させる（Gitで管理すること）"}
            </span>
            {"\n"}
            <span className={styles.legHl2}>
              {"2026-01-15: ○○を修正した\n2026-01-20: △△を追加した"}
            </span>
            {"\n\n"}
            <span className={styles.legCmt}>
              {"# ❌ プロジェクト固有情報をグローバルGEMINI.mdに書く"}
            </span>
            {"\n"}
            <span className={styles.legHl2}>{"本番DBのIP: 192.168.1.100"}</span>
          </pre>
        </div>
        <div className={`${styles.info} ${styles.iWarn} ${styles.iWarnMt}`}>
          <span className={styles.infoIcon}>⚠️</span>
          <div>
            機密情報は<code>.geminiignore</code>で除外し、変更履歴はGitで管理。大きな資料は
            <code>@./docs/guide.md</code>のように@importで分割参照しましょう。
          </div>
        </div>
      </div>
    </div>
  );
}
