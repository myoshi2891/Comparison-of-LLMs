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

          <p>
            GitHub Copilotは2025年に<strong>Copilot Coding Agent</strong>
            （GitHub.com上でIssueを割り当てるとPRを自動作成）と<strong>Agent Mode</strong>（VS
            Code内でマルチファイル編集を自律実行）を正式リリースし、単なるコード補完から
            <strong>フルエージェント開発プラットフォーム</strong>
            へ進化しました。2026年3月現在はさらに：
            <strong>Copilot CLI GA</strong>（Feb 2026）・<strong>MCPサーバー正式サポート</strong>・
            <strong>プランモード</strong>（Shift+Tab、CLI/JetBrains GA）・
            <strong>エージェントフック</strong>（JetBrains Preview）・
            <strong>エージェントメモリ</strong>が追加され、エコシステムは急速に拡張中です。
          </p>

          <table>
            <tr>
              <th>ファイル / 機能</th>
              <th>Claude Code</th>
              <th>Google Antigravity</th>
              <th>OpenAI Codex</th>
              <th>GitHub Copilot</th>
            </tr>
            <tr>
              <td>永続メモリ（必須）</td>
              <td>CLAUDE.md</td>
              <td>GEMINI.md</td>
              <td>AGENTS.md</td>
              <td>
                <strong>copilot-instructions.md</strong>
              </td>
            </tr>
            <tr>
              <td>パス特化指示</td>
              <td>サブdir CLAUDE.md</td>
              <td>fileMatch Rules</td>
              <td>サブdir AGENTS.md</td>
              <td>
                <strong>.instructions.md (applyTo)</strong>
              </td>
            </tr>
            <tr>
              <td>タスクプロンプト</td>
              <td>Custom Commands</td>
              <td>Workflows</td>
              <td>.prompt.md</td>
              <td>
                <strong>.prompt.md</strong>
              </td>
            </tr>
            <tr>
              <td>AIペルソナ定義</td>
              <td>なし</td>
              <td>なし</td>
              <td>なし</td>
              <td>
                <strong>.chatmode.md</strong>（Copilot独自）
              </td>
            </tr>
            <tr>
              <td>カスタムエージェント</td>
              <td>サブエージェント</td>
              <td>Agent Manager</td>
              <td>Agents SDK</td>
              <td>
                <strong>.agent.md</strong>（ハンドオフ対応）
              </td>
            </tr>
            <tr>
              <td>ナレッジ拡張</td>
              <td>SKILL.md</td>
              <td>SKILL.md</td>
              <td>SKILL.md</td>
              <td>
                <strong>SKILL.md（.github/skills/）</strong>
              </td>
            </tr>
            <tr>
              <td>オープン標準</td>
              <td>AGENTS.md対応</td>
              <td>AGENTS.md対応</td>
              <td>AGENTS.md（主導）</td>
              <td>
                <strong>AGENTS.md + CLAUDE.md + GEMINI.md対応</strong>
              </td>
            </tr>
            <tr>
              <td>SDD公式FW</td>
              <td>なし（慣習）</td>
              <td>なし（慣習）</td>
              <td>なし（慣習）</td>
              <td>
                <strong>GitHub Spec Kit（公式）</strong>
              </td>
            </tr>
          </table>

          <div className={`${styles.ib} ${styles.im}`}>
            <span className={styles.ii}>🏆</span>
            <div>
              <strong>Copilotの最大の強み：マルチ標準対応</strong>
              <br />
              GitHub
              CopilotはAGENTS.md（OpenAI）・CLAUDE.md（Anthropic）・GEMINI.md（Google）の3標準をすべて読み込めます。さらにCopilot独自の
              <code>.chatmode.md</code>（ペルソナ）と<code>.agent.md</code>
              （エージェントハンドオフ）を持ち、最も豊富なカスタマイズレイヤーを持つプラットフォームです（[3]）。
            </div>
          </div>
        </section>

        {/* ── s02: DIRECTORY ── */}
        <section id="s02">
          <div className={styles.slabel}>Section 02</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>02.</span>全体ファイル構成とディレクトリ
          </h2>

          <div className={styles.flowWrap}>
            <div className={styles.flowLbl}>▸ GitHub Copilot SDD — コンテキスト注入フロー</div>
            <div className={styles.flow}>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fG}`}>
                  常時注入
                  <br />
                  （全リクエスト）
                </div>
                <div className={styles.ffile}>
                  copilot-instructions.md
                  <br />
                  AGENTS.md
                </div>
              </div>
              <div className={styles.farr}>→</div>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fM}`}>
                  パス特化
                  <br />
                  （自動マッチ）
                </div>
                <div className={styles.ffile}>
                  .instructions.md
                  <br />
                  applyTo: glob
                </div>
              </div>
              <div className={styles.farr}>→</div>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fC}`}>
                  タスク実行
                  <br />
                  （手動呼出）
                </div>
                <div className={styles.ffile}>
                  .prompt.md
                  <br />
                  /コマンド
                </div>
              </div>
              <div className={styles.farr}>→</div>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fV}`}>
                  ペルソナ切替
                  <br />
                  （Chat Mode）
                </div>
                <div className={styles.ffile}>
                  .chatmode.md
                  <br />
                  AIキャラクター
                </div>
              </div>
              <div className={styles.farr}>→</div>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fT}`}>
                  スキル呼出
                  <br />
                  （意味的トリガー）
                </div>
                <div className={styles.ffile}>
                  SKILL.md
                  <br />
                  Progressive開示
                </div>
              </div>
            </div>
          </div>

          <h3>推奨ディレクトリ構成（完全版）</h3>
          <div className={styles.tree}>
            <div className={styles.t0}>
              <span className={styles.tf}>📁</span> <span>your-project/</span>
            </div>

            <div className={`${styles.t0} ${styles.t1}`}>
              <span className={styles.tm}>📄</span> <span className={styles.tm}>AGENTS.md</span>
              <span className={styles.tdi}>
                {" "}
                — オープン標準（Linux Foundation）Copilotが自動読込
              </span>
            </div>

            <div className={`${styles.t0} ${styles.t1}`}>
              <span className={styles.tf}>📁</span> <span>.github/</span>
              <span className={styles.tdi}> — Copilot カスタマイズルート</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tg}>📄</span>{" "}
              <span className={styles.tg}>copilot-instructions.md</span>
              <span className={styles.tdi}> — リポジトリ永続メモリ（最重要・全IDE共通）</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tf}>📁</span> <span>instructions/</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tm}>📄</span>{" "}
              <span className={styles.tm}>frontend.instructions.md</span>
              <span className={styles.tdi}>{' — applyTo: "src/**/*.tsx"'}</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tm}>📄</span>{" "}
              <span className={styles.tm}>testing.instructions.md</span>
              <span className={styles.tdi}>{' — applyTo: "**/*.test.ts"'}</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tm}>📄</span>{" "}
              <span className={styles.tm}>infra.instructions.md</span>
              <span className={styles.tdi}>{' — applyTo: "**/*.tf"'}</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tf}>📁</span> <span>prompts/</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tc}>📄</span>{" "}
              <span className={styles.tc}>specify.prompt.md</span>
              <span className={styles.tdi}> — Spec Kit: 仕様書生成コマンド</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tc}>📄</span>{" "}
              <span className={styles.tc}>plan.prompt.md</span>
              <span className={styles.tdi}> — Spec Kit: 技術計画生成コマンド</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tc}>📄</span>{" "}
              <span className={styles.tc}>tasks.prompt.md</span>
              <span className={styles.tdi}> — Spec Kit: タスク分解コマンド</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tc}>📄</span>{" "}
              <span className={styles.tc}>review.prompt.md</span>
              <span className={styles.tdi}> — カスタム: コードレビュー</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tf}>📁</span> <span>chatmodes/</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tv}>📄</span>{" "}
              <span className={styles.tv}>architect.chatmode.md</span>
              <span className={styles.tdi}> — ソフトウェアアーキテクトペルソナ</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tv}>📄</span>{" "}
              <span className={styles.tv}>security.chatmode.md</span>
              <span className={styles.tdi}> — セキュリティレビュワーペルソナ</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tf}>📁</span> <span>agents/</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tt}>📄</span>{" "}
              <span className={styles.tt}>planning.agent.md</span>
              <span className={styles.tdi}> — 設計フェーズ専用エージェント</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tt}>📄</span>{" "}
              <span className={styles.tt}>developer.agent.md</span>
              <span className={styles.tdi}> — 実装フェーズ専用エージェント</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tf}>📁</span> <span>skills/</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tf}>📁</span> <span>db-migration/</span>
            </div>
            <div className={`${styles.t0} ${styles.t4}`}>
              <span className={styles.tg}>📄</span> <span className={styles.tg}>SKILL.md</span>
              <span className={styles.tdi}> — Progressive Disclosure スキル</span>
            </div>

            <div className={`${styles.t0} ${styles.t1}`}>
              <span className={styles.tf}>📁</span> <span>.vscode/</span>
              <span className={styles.tdi}> — 🆕 VS Code ワークスペース設定</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tt}>📄</span> <span className={styles.tt}>mcp.json</span>
              <span className={styles.tdi}> — 🆕 MCPサーバー設定（リモート/ローカル）</span>
            </div>

            <div className={`${styles.t0} ${styles.t1}`}>
              <span className={styles.tf}>📁</span> <span>.specify/</span>
              <span className={styles.tdi}> — GitHub Spec Kit（SDD専用）</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tf}>📁</span> <span>memory/</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tr}>📄</span>{" "}
              <span className={styles.tr}>constitution.md</span>
              <span className={styles.tdi}> — プロジェクト憲法（不変原則）</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tf}>📁</span> <span>templates/</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tg}>📄</span>{" "}
              <span className={styles.tg}>spec-template.md</span>
              <span className={styles.tdi}> — 仕様書テンプレート</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tg}>📄</span>{" "}
              <span className={styles.tg}>plan-template.md</span>
              <span className={styles.tdi}> — 技術計画テンプレート</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tg}>📄</span>{" "}
              <span className={styles.tg}>tasks-template.md</span>
              <span className={styles.tdi}> — タスクリストテンプレート</span>
            </div>

            <div className={`${styles.t0} ${styles.t1}`}>
              <span className={styles.tf}>📁</span> <span>features/</span>
              <span className={styles.tdi}> — 機能別SDD仕様書群（Spec Kit生成）</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tf}>📁</span> <span>preorder/</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tm}>📄</span> <span className={styles.tm}>spec.md</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tm}>📄</span> <span className={styles.tm}>plan.md</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tm}>📄</span> <span className={styles.tm}>tasks.md</span>
            </div>
          </div>
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
