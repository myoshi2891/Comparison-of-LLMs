import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "GitHub Copilot — AI仕様駆動開発 マークダウンファイル完全ガイド 2026年3月版",
  description:
    "copilot-instructions.md / .instructions.md / .prompt.md / .chatmode.md / .agent.md / SKILL.md / MCP / Plan Mode — Copilotの全カスタマイズファイル・新機能を根拠ソース付きで徹底解説",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const TOC_ITEMS = [
  { id: "s01", label: "GitHub Copilotの全体アーキテクチャと他ツール比較" },
  { id: "s02", label: "全体ファイル構成とディレクトリ" },
  { id: "s03", label: "copilot-instructions.md — リポジトリ永続メモリ" },
  { id: "s04", label: ".instructions.md — パス特化型ルール" },
  { id: "s05", label: ".prompt.md — 再利用タスクプロンプト" },
  { id: "s06", label: ".chatmode.md — カスタムAIペルソナ" },
  { id: "s07", label: ".agent.md — カスタムエージェント&ハンドオフ" },
  { id: "s08", label: "SKILL.md — Progressive Disclosure ナレッジ" },
  { id: "s09", label: "AGENTS.md — オープン標準統合レイヤー" },
  { id: "s10", label: "GitHub Spec Kit — SDD公式フレームワーク" },
  { id: "s11", label: "SDD仕様書群 (constitution / spec / plan / tasks)" },
  { id: "s12", label: "コンテキスト合成の仕組み" },
  { id: "s13", label: "🆕 MCPサポート — .vscode/mcp.json完全ガイド" },
  { id: "s14", label: "🆕 プランモード & エージェントフック（2026年新機能）" },
  { id: "s15", label: "横断ベストプラクティス 12則（更新版）" },
  { id: "sources", label: "参考ソース一覧（更新版）" },
] as const;

export default function Page() {
  return (
    <div className={styles.page}>
      <header className={styles.hdr}>
        <div className={styles.hdrMesh} />
        <div className={styles.eyebrow}>Microsoft × GitHub × VS Code — 2026年3月 最新版</div>
        <h1>
          <span className={styles.msText}>GitHub Copilot</span>
          <br />
          AI仕様駆動開発における
          <br />
          <span className={styles.ghText}>マークダウンファイル</span> 完全ガイド
        </h1>
        <p className={styles.hdrLead}>
          copilot-instructions.md / .instructions.md / .prompt.md / .chatmode.md / .agent.md /
          SKILL.md / MCP / Plan Mode ——
          <br />
          2026年3月最新情報を反映。Copilotの全カスタマイズファイル・新機能の役割・構造・ベストプラクティスを根拠ソース付きで徹底解説
        </p>
        <div className={styles.badgeStrip}>
          <span className={`${styles.badge} ${styles.bm}`}>GitHub Copilot</span>
          <span className={`${styles.badge} ${styles.bg}`}>GitHub Spec Kit</span>
          <span className={`${styles.badge} ${styles.bc}`}>VS Code 1.112+</span>
          <span className={`${styles.badge} ${styles.bv}`}>AGENTS.md オープン標準</span>
          <span className={`${styles.badge} ${styles.bt}`}>MCP サポート</span>
          <span className={`${styles.badge} ${styles.bg}`}>Plan Mode GA</span>
          <span className={`${styles.badge} ${styles.bm}`}>Mar 2026 最新</span>
        </div>
      </header>

      <main className={styles.main}>
        <nav className={styles.toc}>
          <div className={styles.tocTtl}>目次 — 2026年3月版（MCP・Plan Mode 追加）</div>
          <ol>
            {TOC_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── s01: OVERVIEW ── */}
        <section id="s01">
          <div className={styles.slabel}>Section 01</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>01.</span>GitHub Copilotの全体アーキテクチャと他ツール比較
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s02: DIRECTORY ── */}
        <section id="s02">
          <div className={styles.slabel}>Section 02</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>02.</span>全体ファイル構成とディレクトリ
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s03: COPILOT-INSTRUCTIONS ── */}
        <section id="s03">
          <div className={styles.slabel}>Section 03</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>03.</span>
            <code>.copilot/instructions.md</code> ＆ <code>copilot-instructions.md</code> —
            リポジトリ永続メモリ
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s04: INSTRUCTIONS-MD ── */}
        <section id="s04">
          <div className={styles.slabel}>Section 04</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>04.</span>
            <code>.instructions.md</code> — パス特化型ルール
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s05: PROMPT-MD ── */}
        <section id="s05">
          <div className={styles.slabel}>Section 05</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>05.</span>
            <code>.prompt.md</code> — 再利用タスクプロンプト
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s06: CHATMODE-MD ── */}
        <section id="s06">
          <div className={styles.slabel}>Section 06</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>06.</span>
            <code>.chatmode.md</code> — カスタムAIペルソナ
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s07: AGENT-MD ── */}
        <section id="s07">
          <div className={styles.slabel}>Section 07</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>07.</span>
            <code>.agent.md</code> — カスタムエージェント&amp;ハンドオフ
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s08: SKILL-MD ── */}
        <section id="s08">
          <div className={styles.slabel}>Section 08</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>08.</span>
            <code>SKILL.md</code> — Progressive Disclosure ナレッジ
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s09: AGENTS-MD ── */}
        <section id="s09">
          <div className={styles.slabel}>Section 09</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>09.</span>AGENTS.md — オープン標準統合レイヤー
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s10: SPECKIT ── */}
        <section id="s10">
          <div className={styles.slabel}>Section 10</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>10.</span>GitHub Spec Kit — SDD公式フレームワーク
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s11: SDD-DOCS ── */}
        <section id="s11">
          <div className={styles.slabel}>Section 11</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>11.</span>SDD仕様書群 (constitution / spec / plan / tasks)
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s12: SYSTEM-PROMPT ── */}
        <section id="s12">
          <div className={styles.slabel}>Section 12</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>12.</span>コンテキスト合成の仕組み
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s13: MCP-SUPPORT ── */}
        <section id="s13">
          <div className={styles.slabel}>Section 13</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>13.</span>🆕 MCPサポート — .vscode/mcp.json完全ガイド
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s14: PLAN-MODE ── */}
        <section id="s14">
          <div className={styles.slabel}>Section 14</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>14.</span>🆕 プランモード &amp;
            エージェントフック（2026年新機能）
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── s15: BEST-PRACTICES ── */}
        <section id="s15">
          <div className={styles.slabel}>Section 15</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>15.</span>横断ベストプラクティス 12則（更新版）
          </h2>
          {/* TODO: faithful content */}
        </section>

        {/* ── sources ── */}
        <section id="sources">
          <div className={styles.slabel}>Section 16（2026年3月更新版）</div>
          <div className={styles.sources}>
            <div className={styles.srcTtl}>
              📚 参考ソース一覧（公式・二次情報を含む）— 2026年3月更新版（追加: [18]〜[23]）
            </div>
            {/* TODO: faithful content */}
            <div className={styles.src}>
              <span className={styles.sn}>[1]</span>
              <div>
                <Ext href="https://developer.microsoft.com/blog/spec-driven-development-spec-kit">
                  Diving Into Spec-Driven Development With GitHub Spec Kit — Microsoft for
                  Developers (Sep 2025)
                </Ext>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
