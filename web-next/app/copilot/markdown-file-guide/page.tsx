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

          <p>
            <code>.github/copilot-instructions.md</code>はCopilotが
            <strong>全リクエストに自動添付するリポジトリレベルの永続メモリ</strong>です。VS
            Code・Visual Studio・JetBrains IDEs・Neovim・GitHub.com・GitHub Mobile・GitHub CLIの
            <strong>全プラットフォームで共通動作</strong>します（[2]）。2025年1月にPublic
            Preview、同年中に正式GA。
          </p>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div
                className={styles.fci}
                style={{
                  background: "rgba(35, 134, 54, 0.12)",
                  border: "1px solid rgba(35, 134, 54, 0.3)",
                }}
              >
                📋
              </div>
              <div>
                <div className={styles.fcName}>copilot-instructions.md</div>
                <div className={styles.fcPath}>
                  .github/copilot-instructions.md — git管理・チーム共有
                </div>
                <div className={styles.fcTags}>
                  <span className={`${styles.fct} ${styles.fctG}`}>全IDE共通</span>
                  <span className={`${styles.fct} ${styles.fctM}`}>全リクエスト自動注入</span>
                  <span className={`${styles.fct} ${styles.fctC}`}>
                    コードレビュー対応（2025年）
                  </span>
                  <span className={`${styles.fct} ${styles.fctV}`}>Coding Agent対応</span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <h3>コンテキストに含まれる優先度順（後者が上書き）</h3>
              <div className={styles.pstack}>
                <div className={`${styles.prow} ${styles.pr1}`}>
                  <div className={styles.prowRank}>① 基底</div>
                  <div>
                    <div className={styles.prowFile}>
                      {"~/.config/github-copilot/*.instructions.md"}
                    </div>
                    <div className={styles.prowDesc}>
                      IDE設定のユーザーレベル指示（存在する場合）
                    </div>
                  </div>
                </div>
                <div className={styles.parrow}>↓ リポジトリへ</div>
                <div className={`${styles.prow} ${styles.pr2}`}>
                  <div className={styles.prowRank}>②</div>
                  <div>
                    <div className={styles.prowFile}>.github/copilot-instructions.md</div>
                    <div className={styles.prowDesc}>
                      チーム共有のリポジトリルール（全IDE）— <strong>最重要ファイル</strong>
                    </div>
                  </div>
                </div>
                <div className={styles.parrow}>↓ 追加</div>
                <div className={`${styles.prow} ${styles.pr3}`}>
                  <div className={styles.prowRank}>③</div>
                  <div>
                    <div className={styles.prowFile}>
                      {".github/instructions/*.instructions.md"}
                    </div>
                    <div className={styles.prowDesc}>
                      applyToパターンに一致した場合のみ追加注入（後述）
                    </div>
                  </div>
                </div>
                <div className={styles.parrow}>↓ 追加</div>
                <div className={`${styles.prow} ${styles.pr4}`}>
                  <div className={styles.prowRank}>④</div>
                  <div>
                    <div className={styles.prowFile}>
                      アクティブな .prompt.md / ユーザーのチャットテキスト
                    </div>
                    <div className={styles.prowDesc}>
                      手動添付のプロンプトファイル + ユーザー入力
                    </div>
                  </div>
                </div>
                <div className={styles.parrow}>↓ 全部マージして</div>
                <div className={`${styles.prow} ${styles.pr5}`}>
                  <div className={styles.prowRank}>⑤ 最終</div>
                  <div>
                    <div className={styles.prowFile}>モデルのコンテキストウィンドウに圧縮注入</div>
                    <div className={styles.prowDesc}>
                      Copilotが上記すべてを統合しレスポンス生成（[10]）
                    </div>
                  </div>
                </div>
              </div>

              <h3>ベストプラクティス完全テンプレート</h3>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.dots}>
                    <div className={styles.dot} style={{ background: "#f25c7a" }} />
                    <div className={styles.dot} style={{ background: "#f0883e" }} />
                    <div className={styles.dot} style={{ background: "#238636" }} />
                  </div>
                  <span>.github/copilot-instructions.md</span>
                </div>
                <pre>
                  <span className={styles.cHd}>{"# Copilot Instructions"}</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    {"# このファイルはCopilotへの全リクエストに自動添付される。"}
                  </span>
                  {"\n"}
                  <span className={styles.cCm}>
                    {'# "2ページ以内・簡潔に"が鉄則（公式推奨）。'}
                  </span>
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Project Overview"}</span>
                  {
                    "\nECサイトのバックエンドAPI（Go + gRPC マイクロサービス）。\nプリオーダー・決済・在庫管理の3サービスで構成。\n\n"
                  }
                  <span className={styles.cHd}>{"## Repository Structure"}</span>
                  {
                    "\n- `cmd/`        — サービスエントリーポイント\n- `internal/`   — ビジネスロジック（外部公開不可）\n- `migrations/` — DBマイグレーション（直接編集禁止）\n- `docs/`       — 仕様書群（features/{name}/spec|plan|tasks.md）\n\n"
                  }
                  <span className={styles.cHd}>{"## Build & Test"}</span>
                  {"\n"}
                  <span className={styles.cCm}>{"# Coding Agentが実行するコマンドを明示する"}</span>
                  {
                    "\n- Build:    `go build ./...`\n- Test all: `go test ./... -race -timeout 120s`\n- Lint:     `golangci-lint run`\n- Dev:      `docker compose up -d`\n\n"
                  }
                  <span className={styles.cHd}>{"## Code Standards"}</span>
                  {
                    '\n- Go 1.23。CGO_ENABLED=0\n- エラー: `fmt.Errorf("context: %w", err)` 形式\n- テスト: table-driven tests 必須\n- ORM使用禁止（pgx v5 raw SQLのみ）\n- サービス間通信: gRPCのみ（REST禁止）\n\n'
                  }
                  <span className={styles.cHd}>{"## PR Instructions"}</span>
                  {"\n"}
                  <span className={styles.cCm}>{"# Coding AgentがPRを作成する際の形式"}</span>
                  {
                    "\nタイトル: `[feat/fix/refactor] 短い説明（英語）`\n必須セクション: Summary / Testing Done / Breaking Changes\n\n"
                  }
                  <span className={styles.cHd}>{"## Forbidden"}</span>
                  {
                    "\n- `migrations/` への直接書き込み（SKILL.md db-migration を使用）\n- `.env` の作成・変更\n- APIキーのハードコード\n- `panic()` の使用（エラーを返す）"
                  }
                </pre>
              </div>

              <div className={`${styles.ib} ${styles.ic}`}>
                <span className={styles.ii}>⚠️</span>
                <div>
                  <strong>「2ページ以内」の鉄則</strong>
                  <br />
                  公式ドキュメントは「短く自己完結した記述（short, self-contained
                  statements）にすること」を強調しています。外部ファイルへの参照リクエストや長大な指示は機能しません。詳細なルールは
                  <code>.instructions.md</code>・SKILL.mdへ分離してください（[4]）。
                </div>
              </div>

              <div className={`${styles.ib} ${styles.im}`}>
                <span className={styles.ii}>💡</span>
                <div>
                  <strong>Copilotに自動生成させる</strong>
                  <br />
                  初回PR作成時にCopilotがinstructionsファイル生成リンクをコメントします。また
                  <code>
                    @workspace Generate custom instructions for this repository based on the current
                    codebase
                  </code>
                  とCopilot Chatで依頼すれば即座に草案が生成されます（[3]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── s04: INSTRUCTIONS-MD ── */}
        <section id="s04">
          <div className={styles.slabel}>Section 04</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>04.</span>
            <code>.instructions.md</code> — パス特化型ルール（最重要追加機能）
          </h2>

          <p>
            2025年7月にリリースされた<strong>パス特化型カスタム指示</strong>。YAMLフロントマターの
            <code>applyTo</code>プロパティでglobパターンを指定し、
            <strong>対象ファイルを編集するときのみ自動注入</strong>
            されます。テスト・スタイル・インフラ・DBなど領域ごとにルールを分離でき、コンテキスト汚染を防げます（[5]）。
          </p>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div
                className={styles.fci}
                style={{
                  background: "rgba(0, 120, 212, 0.12)",
                  border: "1px solid rgba(0, 120, 212, 0.3)",
                }}
              >
                📐
              </div>
              <div>
                <div className={styles.fcName}>.instructions.md</div>
                <div className={styles.fcPath}>
                  .github/instructions/*.instructions.md — パスマッチで自動注入
                </div>
                <div className={styles.fcTags}>
                  <span className={`${styles.fct} ${styles.fctM}`}>applyTo: glob</span>
                  <span className={`${styles.fct} ${styles.fctG}`}>July 2025 GA</span>
                  <span className={`${styles.fct} ${styles.fctC}`}>excludeAgent対応</span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <h3>フロントマター仕様</h3>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <span>フロントマター全プロパティ</span>
                </div>
                <pre>
                  <span className={styles.cKy}>{"---"}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"applyTo"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"glob-pattern"'}</span>
                  {"          "}
                  <span className={styles.cCm}>{"# 必須: どのファイルに適用するか"}</span>
                  {"\n                                     "}
                  <span className={styles.cCm}>{"# 複数パターンはカンマ区切り"}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"description"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"Brief description"'}</span>
                  {"  "}
                  <span className={styles.cCm}>{"# 任意: 何のルールかの説明"}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"excludeAgent"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"code-review"'}</span>
                  {"       "}
                  <span className={styles.cCm}>{'# 任意: "code-review" or "coding-agent"'}</span>
                  {"\n                                     "}
                  <span className={styles.cCm}>{"# 指定したエージェントには非適用"}</span>
                  {"\n"}
                  <span className={styles.cKy}>{"---"}</span>
                </pre>
              </div>

              <h3>4つの実践テンプレート（領域別分割パターン）</h3>
              <div className={styles.g2}>
                <div>
                  <div className={styles.cb}>
                    <div className={styles.cbHdr}>
                      <div className={styles.dots}>
                        <div className={styles.dot} style={{ background: "#f25c7a" }} />
                        <div className={styles.dot} style={{ background: "#f0883e" }} />
                        <div className={styles.dot} style={{ background: "#238636" }} />
                      </div>
                      <span>frontend.instructions.md</span>
                    </div>
                    <pre>
                      <span className={styles.cKy}>{"---"}</span>
                      {"\n"}
                      <span className={styles.cGh}>{"applyTo"}</span>
                      {": "}
                      <span className={styles.cSt}>{'"src/**/*.tsx, src/**/*.ts"'}</span>
                      {"\n"}
                      <span className={styles.cGh}>{"description"}</span>
                      {": "}
                      <span className={styles.cSt}>{'"React/TypeScript規約"'}</span>
                      {"\n"}
                      <span className={styles.cKy}>{"---"}</span>
                      {"\n\n"}
                      <span className={styles.cHd}>{"## Frontend Standards"}</span>
                      {
                        "\n- コンポーネント: 関数型のみ（クラス禁止）\n- スタイル: Tailwind CSS優先。\n  CSS Modulesは動的スタイルのみ\n- インライン `style={}` 禁止\n- `any` 型の使用禁止\n- props型定義に `interface` を使用"
                      }
                    </pre>
                  </div>
                </div>
                <div>
                  <div className={styles.cb}>
                    <div className={styles.cbHdr}>
                      <div className={styles.dots}>
                        <div className={styles.dot} style={{ background: "#f25c7a" }} />
                        <div className={styles.dot} style={{ background: "#f0883e" }} />
                        <div className={styles.dot} style={{ background: "#238636" }} />
                      </div>
                      <span>testing.instructions.md</span>
                    </div>
                    <pre>
                      <span className={styles.cKy}>{"---"}</span>
                      {"\n"}
                      <span className={styles.cGh}>{"applyTo"}</span>
                      {": "}
                      <span className={styles.cSt}>{'"**/*.test.ts,**/*.spec.ts"'}</span>
                      {"\n"}
                      <span className={styles.cGh}>{"description"}</span>
                      {": "}
                      <span className={styles.cSt}>{'"テスト規約"'}</span>
                      {"\n"}
                      <span className={styles.cKy}>{"---"}</span>
                      {"\n\n"}
                      <span className={styles.cHd}>{"## Testing Standards"}</span>
                      {
                        "\n- RTL使用（enzyme系API禁止）\n- `data-testid` でセレクタを定義\n- 外部依存はすべてモック\n- ユーザー視点の振る舞いをテスト\n- 実装詳細をテストしない"
                      }
                    </pre>
                  </div>
                </div>
                <div>
                  <div className={styles.cb}>
                    <div className={styles.cbHdr}>
                      <div className={styles.dots}>
                        <div className={styles.dot} style={{ background: "#f25c7a" }} />
                        <div className={styles.dot} style={{ background: "#f0883e" }} />
                        <div className={styles.dot} style={{ background: "#238636" }} />
                      </div>
                      <span>infra.instructions.md</span>
                    </div>
                    <pre>
                      <span className={styles.cKy}>{"---"}</span>
                      {"\n"}
                      <span className={styles.cGh}>{"applyTo"}</span>
                      {": "}
                      <span className={styles.cSt}>{'"infra/**/*.tf"'}</span>
                      {"\n"}
                      <span className={styles.cGh}>{"description"}</span>
                      {": "}
                      <span className={styles.cSt}>{'"Terraform規約"'}</span>
                      {"\n"}
                      <span className={styles.cKy}>{"---"}</span>
                      {"\n\n"}
                      <span className={styles.cHd}>{"## Terraform Standards"}</span>
                      {
                        "\n- リソース命名: `{env}-{service}-{type}`\n- 全リソースに `Environment` タグ必須\n- `terraform fmt` 実行後にコミット\n- シークレットは AWS SSM / Vault参照\n- ハードコードIP禁止"
                      }
                    </pre>
                  </div>
                </div>
                <div>
                  <div className={styles.cb}>
                    <div className={styles.cbHdr}>
                      <div className={styles.dots}>
                        <div className={styles.dot} style={{ background: "#f25c7a" }} />
                        <div className={styles.dot} style={{ background: "#f0883e" }} />
                        <div className={styles.dot} style={{ background: "#238636" }} />
                      </div>
                      <span>migrations.instructions.md</span>
                    </div>
                    <pre>
                      <span className={styles.cKy}>{"---"}</span>
                      {"\n"}
                      <span className={styles.cGh}>{"applyTo"}</span>
                      {": "}
                      <span className={styles.cSt}>{'"migrations/**/*.sql"'}</span>
                      {"\n"}
                      <span className={styles.cGh}>{"excludeAgent"}</span>
                      {": "}
                      <span className={styles.cSt}>{'"coding-agent"'}</span>
                      {"\n"}
                      <span className={styles.cKy}>{"---"}</span>
                      {"\n\n"}
                      <span className={styles.cHd}>{"## Migration Standards"}</span>
                      {
                        "\n- ファイル名: YYYYMMDD_description.sql\n- `.up.sql` と `.down.sql` を必ず両方作成\n- `DROP TABLE` は人間確認なしに禁止\n- NULL制約後付けは移行計画を先に書く"
                      }
                    </pre>
                  </div>
                </div>
              </div>

              <div className={`${styles.ib} ${styles.ig}`}>
                <span className={styles.ii}>💡</span>
                <div>
                  <strong>excludeAgent の活用法</strong>
                  <br />
                  <code>excludeAgent: "coding-agent"</code>を設定すると、Copilot Coding
                  AgentにはそのルールファイルがPRとして届かず、Copilot
                  Chatでの手作業支援にのみ適用できます。逆に<code>excludeAgent: "code-review"</code>
                  で自動コードレビューには除外することもできます（[5]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── s05: PROMPT-MD ── */}
        <section id="s05">
          <div className={styles.slabel}>Section 05</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>05.</span>
            <code>.prompt.md</code> — 再利用タスクプロンプト
          </h2>

          <p>
            <code>.github/prompts/*.prompt.md</code>は
            <strong>繰り返し使うタスクをコマンド化した再利用テンプレート</strong>です。VS Code
            Copilot Chatで<code>/コマンド名</code>
            として呼び出せ、フロントマターでAIモデル・ツール・実行モードを細かく制御できます（[6]）。
          </p>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div
                className={styles.fci}
                style={{
                  background: "rgba(240, 136, 62, 0.12)",
                  border: "1px solid rgba(240, 136, 62, 0.3)",
                }}
              >
                ⚡
              </div>
              <div>
                <div className={styles.fcName}>.prompt.md</div>
                <div className={styles.fcPath}>
                  .github/prompts/*.prompt.md — /コマンドとして呼出
                </div>
                <div className={styles.fcTags}>
                  <span className={`${styles.fct} ${styles.fctC}`}>モデル指定可</span>
                  <span className={`${styles.fct} ${styles.fctM}`}>ask/edit/agentモード</span>
                  <span className={`${styles.fct} ${styles.fctG}`}>ツール制御</span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <h3>フロントマター全プロパティ</h3>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <span>フロントマター仕様（VS Code 1.10+）</span>
                </div>
                <pre>
                  <span className={styles.cKy}>{"---"}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"mode"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"ask"'}</span>
                  {" | "}
                  <span className={styles.cSt}>{'"edit"'}</span>
                  {" | "}
                  <span className={styles.cSt}>{'"agent"'}</span>
                  {"  "}
                  <span className={styles.cCm}>{'# 実行モード（default: "agent"）'}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"model"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"gpt-4.1"'}</span>
                  {" | "}
                  <span className={styles.cSt}>{'"claude-opus-4-6"'}</span>
                  {" | "}
                  <span className={styles.cSt}>{'"gemini-3-pro"'}</span>
                  {"\n"}
                  {"                                          "}
                  <span className={styles.cCm}>{"# タスク特化モデルを選択"}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"tools"}</span>
                  {": ["}
                  <span className={styles.cSt}>{'"search/codebase"'}</span>
                  {", "}
                  <span className={styles.cSt}>{'"edit/editFiles"'}</span>
                  {", "}
                  <span className={styles.cSt}>{'"read/problems"'}</span>
                  {"]"}
                  {"\n"}
                  <span className={styles.cGh}>{"description"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"プロンプトの説明"'}</span>
                  {"      "}
                  <span className={styles.cCm}>{"# /コマンド選択画面に表示"}</span>
                  {"\n"}
                  <span className={styles.cKy}>{"---"}</span>
                </pre>
              </div>

              <h3>GitHub Spec Kitの3コアプロンプト</h3>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.dots}>
                    <div className={styles.dot} style={{ background: "#f25c7a" }} />
                    <div className={styles.dot} style={{ background: "#f0883e" }} />
                    <div className={styles.dot} style={{ background: "#238636" }} />
                  </div>
                  <span>.github/prompts/specify.prompt.md — /speckit.specify</span>
                </div>
                <pre>
                  <span className={styles.cKy}>{"---"}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"mode"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"agent"'}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"model"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"claude-opus-4-6"'}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"tools"}</span>
                  {": ["}
                  <span className={styles.cSt}>{'"search/codebase"'}</span>
                  {", "}
                  <span className={styles.cSt}>{'"read/problems"'}</span>
                  {", "}
                  <span className={styles.cSt}>{'"edit/editFiles"'}</span>
                  {"]"}
                  {"\n"}
                  <span className={styles.cGh}>{"description"}</span>
                  {": "}
                  <span className={styles.cSt}>
                    {'"Build a spec: user goals, scenarios, acceptance criteria"'}
                  </span>
                  {"\n"}
                  <span className={styles.cKy}>{"---"}</span>
                  {"\n\n"}
                  <span className={styles.cHd}>{"# Spec Generation Prompt"}</span>
                  {"\n\n"}
                  {
                    "`.specify/memory/constitution.md` を読み、プロジェクトの原則を理解してください。"
                  }
                  {"\n\n"}
                  {"ユーザーが説明した機能について、以下の構造で仕様書を生成してください："}
                  {"\n\n"}
                  {"1. **明確化が必要な点を質問する**（過小仕様を防ぐ）"}
                  {"\n"}
                  {"2. 回答をもとに `.specify/templates/spec-template.md` に従って仕様書を作成"}
                  {"\n"}
                  {"3. 以下を必ず含める:"}
                  {"\n"}
                  {"   - ユーザー目標・シナリオ（実装詳細は含めない）"}
                  {"\n"}
                  {"   - 受け入れ基準（テスト可能な形式）"}
                  {"\n"}
                  {"   - スコープ外の明記"}
                  {"\n"}
                  {"4. `features/{feature-name}/spec.md` として保存"}
                </pre>
              </div>

              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.dots}>
                    <div className={styles.dot} style={{ background: "#f25c7a" }} />
                    <div className={styles.dot} style={{ background: "#f0883e" }} />
                    <div className={styles.dot} style={{ background: "#238636" }} />
                  </div>
                  <span>.github/prompts/plan.prompt.md — /speckit.plan</span>
                </div>
                <pre>
                  <span className={styles.cKy}>{"---"}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"mode"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"agent"'}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"tools"}</span>
                  {": ["}
                  <span className={styles.cSt}>{'"search/codebase"'}</span>
                  {", "}
                  <span className={styles.cSt}>{'"read/problems"'}</span>
                  {", "}
                  <span className={styles.cSt}>{'"edit/editFiles"'}</span>
                  {"]"}
                  {"\n"}
                  <span className={styles.cGh}>{"description"}</span>
                  {": "}
                  <span className={styles.cSt}>
                    {'"Technical plan from spec. No new deps without justification."'}
                  </span>
                  {"\n"}
                  <span className={styles.cKy}>{"---"}</span>
                  {"\n\n"}
                  <span className={styles.cHd}>{"# Technical Planning Prompt"}</span>
                  {"\n\n"}
                  {
                    "`features/{feature-name}/spec.md` と `.specify/memory/constitution.md` を参照してください。"
                  }
                  {"\n\n"}
                  {"既存のスタックとパターンを使い、最小依存で技術計画を策定します："}
                  {"\n\n"}
                  {"1. `.specify/templates/plan-template.md` に従って設計書を作成"}
                  {"\n"}
                  {"2. 必ず含める:"}
                  {"\n"}
                  {"   - アーキテクチャの決定と根拠"}
                  {"\n"}
                  {"   - 変更が必要なファイル一覧"}
                  {"\n"}
                  {"   - APIエンドポイント・データモデル"}
                  {"\n"}
                  {"   - セキュリティ・パフォーマンス考慮事項"}
                  {"\n"}
                  {"3. `features/{feature-name}/plan.md` として保存"}
                </pre>
              </div>

              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.dots}>
                    <div className={styles.dot} style={{ background: "#f25c7a" }} />
                    <div className={styles.dot} style={{ background: "#f0883e" }} />
                    <div className={styles.dot} style={{ background: "#238636" }} />
                  </div>
                  <span>.github/prompts/tasks.prompt.md — /speckit.tasks</span>
                </div>
                <pre>
                  <span className={styles.cKy}>{"---"}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"mode"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"agent"'}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"description"}</span>
                  {": "}
                  <span className={styles.cSt}>
                    {'"Break plan into implementable chunks. Check spec/plan/tasks consistency."'}
                  </span>
                  {"\n"}
                  <span className={styles.cKy}>{"---"}</span>
                  {"\n\n"}
                  <span className={styles.cHd}>{"# Task Breakdown Prompt"}</span>
                  {"\n\n"}
                  {"`features/{feature-name}/spec.md` と `plan.md` を読んでください。"}
                  {"\n\n"}
                  {"1. `.specify/templates/tasks-template.md` に従ってタスクリストを作成"}
                  {"\n"}
                  {"2. 各タスクは単独でテスト可能な粒度にする"}
                  {"\n"}
                  {"3. 依存関係を明示する（並列可能なタスクを識別）"}
                  {"\n"}
                  {"4. constitution.md・spec.md・plan.mdとの一貫性チェックを実施"}
                  {"\n"}
                  {"   - ディレクトリの食い違い、ページネーション前提の不一致、未要件の検出"}
                  {"\n"}
                  {"5. `features/{feature-name}/tasks.md` として保存"}
                </pre>
              </div>

              <div className={`${styles.ib} ${styles.im}`}>
                <span className={styles.ii}>💡</span>
                <div>
                  <strong>モデルをタスクごとに使い分ける</strong>
                  <br />
                  <code>{'model: "claude-opus-4-6"'}</code>
                  （深い推論が必要な設計フェーズ）、
                  <code>{'model: "gpt-4.1"'}</code>
                  （高速なコード生成フェーズ）のようにプロンプトごとに最適モデルを選べます。これはGitHub
                  Copilot独自の強力な機能です（[8]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── s06: CHATMODE-MD ── */}
        <section id="s06">
          <div className={styles.slabel}>Section 06</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>06.</span>
            <code>.chatmode.md</code> — カスタムAIペルソナ（Copilot独自）
          </h2>

          <p>
            <code>.github/chatmodes/*.chatmode.md</code>はGitHub Copilot
            <strong>独自の機能</strong>
            です。Copilotに「ソフトウェアアーキテクト」「セキュリティ専門家」「教師」などの
            <strong>特定のペルソナを付与</strong>
            し、その役割に特化した応答スタイルで会話できます。利用ツール・レスポンス形式・制限事項をフロントマターで細かく制御できます（[7]）。
          </p>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div
                className={styles.fci}
                style={{
                  background: "rgba(155, 109, 255, 0.12)",
                  border: "1px solid rgba(155, 109, 255, 0.3)",
                }}
              >
                🎭
              </div>
              <div>
                <div className={styles.fcName}>.chatmode.md</div>
                <div className={styles.fcPath}>
                  .github/chatmodes/*.chatmode.md — Chat Modeとして選択
                </div>
                <div className={styles.fcTags}>
                  <span className={`${styles.fct} ${styles.fctV}`}>Copilot独自機能</span>
                  <span className={`${styles.fct} ${styles.fctM}`}>ツール制御</span>
                  <span className={`${styles.fct} ${styles.fctG}`}>レスポンス形式制御</span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <div className={styles.g2}>
                <div className={styles.cb}>
                  <div className={styles.cbHdr}>
                    <div className={styles.dots}>
                      <div className={styles.dot} style={{ background: "#f25c7a" }} />
                      <div className={styles.dot} style={{ background: "#f0883e" }} />
                      <div className={styles.dot} style={{ background: "#238636" }} />
                    </div>
                    <span>.github/chatmodes/architect.chatmode.md</span>
                  </div>
                  <pre>
                    <span className={styles.cKy}>{"---"}</span>
                    {"\n"}
                    <span className={styles.cGh}>{"description"}</span>
                    {": "}
                    <span className={styles.cSt}>
                      {'"ソフトウェアアーキテクトとして\n  設計・計画・ドキュメントに特化"'}
                    </span>
                    {"\n"}
                    <span className={styles.cGh}>{"tools"}</span>
                    {": ["}
                    <span className={styles.cSt}>{'"search/codebase"'}</span>
                    {", "}
                    <span className={styles.cSt}>{'"read/problems"'}</span>
                    {"]"}
                    {"\n"}
                    <span className={styles.cCm}>{"# edit系ツールを除外→コード書かない"}</span>
                    {"\n"}
                    <span className={styles.cKy}>{"---"}</span>
                    {"\n\n"}
                    <span className={styles.cHd}>{"# Software Architect Mode"}</span>
                    {"\n\n"}
                    {"あなたはシニアソフトウェアアーキテクト。"}
                    {"\n"}
                    {"設計・計画・ドキュメントに集中し、"}
                    {"\n"}
                    {"コードは書かない。Markdownのみで回答。"}
                    {"\n\n"}
                    <span className={styles.cHd}>{"## Response Style"}</span>
                    {"\n"}
                    {"- トレードオフを明示する"}
                    {"\n"}
                    {"- 代替案を2〜3案提示する"}
                    {"\n"}
                    {"- 決定の根拠を「なぜ」で説明する"}
                    {"\n"}
                    {"- 過剰なエンジニアリングを警告する"}
                  </pre>
                </div>
                <div className={styles.cb}>
                  <div className={styles.cbHdr}>
                    <div className={styles.dots}>
                      <div className={styles.dot} style={{ background: "#f25c7a" }} />
                      <div className={styles.dot} style={{ background: "#f0883e" }} />
                      <div className={styles.dot} style={{ background: "#238636" }} />
                    </div>
                    <span>.github/chatmodes/security.chatmode.md</span>
                  </div>
                  <pre>
                    <span className={styles.cKy}>{"---"}</span>
                    {"\n"}
                    <span className={styles.cGh}>{"description"}</span>
                    {": "}
                    <span className={styles.cSt}>
                      {'"セキュリティエンジニアとして\n  脆弱性・OWASP Top 10を中心にレビュー"'}
                    </span>
                    {"\n"}
                    <span className={styles.cGh}>{"tools"}</span>
                    {": ["}
                    <span className={styles.cSt}>{'"search/codebase"'}</span>
                    {"]"}
                    {"\n"}
                    <span className={styles.cKy}>{"---"}</span>
                    {"\n\n"}
                    <span className={styles.cHd}>{"# Security Review Mode"}</span>
                    {"\n\n"}
                    {"OWASP Top 10を基準にコードをレビュー。"}
                    {"\n"}
                    {"問題を重大度(Critical/High/Medium/Low)"}
                    {"\n"}
                    {"で分類し、修正手順を提示する。"}
                    {"\n\n"}
                    <span className={styles.cHd}>{"## Rules"}</span>
                    {"\n"}
                    {"- 未確認の脆弱性を断定しない"}
                    {"\n"}
                    {"- CWE番号を付与する"}
                    {"\n"}
                    {"- 修正コード例を提示する"}
                  </pre>
                </div>
              </div>

              <div className={`${styles.ib} ${styles.iv}`}>
                <span className={styles.ii}>🎭</span>
                <div>
                  <strong>.chatmode.md vs .agent.md の使い分け</strong>
                  <br />
                  <code>.chatmode.md</code>は<strong>会話スタイルの変更</strong>
                  （「アーキテクト目線で話す」）。<code>.agent.md</code>は
                  <strong>実際にファイルを操作・変更するタスク実行</strong>
                  （「設計フェーズを担当し完了後に開発エージェントにハンドオフ」）。ペルソナ付与か実行委任かで選びます（[8]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── s07: AGENT-MD ── */}
        <section id="s07">
          <div className={styles.slabel}>Section 07</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>07.</span>
            <code>.agent.md</code> — カスタムエージェント&amp;ハンドオフ
          </h2>

          <p>
            <code>.github/agents/*.agent.md</code>はCopilot Coding Agent と VS Code Agent
            Modeが使用する<strong>カスタムエージェント定義</strong>
            です。複数エージェント間のハンドオフを設定でき、「計画エージェント →
            開発エージェント」のようなSDD特化パイプラインを構築できます（[8]）。
          </p>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div
                className={styles.fci}
                style={{
                  background: "rgba(31, 184, 205, 0.12)",
                  border: "1px solid rgba(31, 184, 205, 0.3)",
                }}
              >
                🤖
              </div>
              <div>
                <div className={styles.fcName}>.agent.md</div>
                <div className={styles.fcPath}>
                  .github/agents/*.agent.md — Coding Agent / Agent Mode
                </div>
                <div className={styles.fcTags}>
                  <span className={`${styles.fct} ${styles.fctT}`}>ハンドオフ対応</span>
                  <span className={`${styles.fct} ${styles.fctM}`}>MCP Server連携</span>
                  <span className={`${styles.fct} ${styles.fctV}`}>モデル指定可</span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <div className={styles.g2}>
                <div className={styles.cb}>
                  <div className={styles.cbHdr}>
                    <div className={styles.dots}>
                      <div className={styles.dot} style={{ background: "#f25c7a" }} />
                      <div className={styles.dot} style={{ background: "#f0883e" }} />
                      <div className={styles.dot} style={{ background: "#238636" }} />
                    </div>
                    <span>.github/agents/planning.agent.md</span>
                  </div>
                  <pre>
                    <span className={styles.cKy}>{"---"}</span>
                    {"\n"}
                    <span className={styles.cGh}>{"name"}</span>
                    {": "}
                    <span className={styles.cSt}>{'"Planning Agent"'}</span>
                    {"\n"}
                    <span className={styles.cGh}>{"description"}</span>
                    {": "}
                    <span className={styles.cSt}>
                      {
                        '"設計・計画専任エージェント。\n  spec.mdとplan.mdを生成してDev Agentへハンドオフ"'
                      }
                    </span>
                    {"\n"}
                    <span className={styles.cGh}>{"model"}</span>
                    {": "}
                    <span className={styles.cSt}>{'"claude-opus-4-6"'}</span>
                    {"\n"}
                    <span className={styles.cGh}>{"tools"}</span>
                    {": ["}
                    <span className={styles.cSt}>{'"search/codebase"'}</span>
                    {", "}
                    <span className={styles.cSt}>{'"edit/editFiles"'}</span>
                    {",\n         "}
                    <span className={styles.cSt}>{'"read/problems"'}</span>
                    {"]"}
                    {"\n"}
                    <span className={styles.cKy}>{"---"}</span>
                    {"\n\n"}
                    <span className={styles.cHd}>{"# Planning Agent"}</span>
                    {"\n\n"}
                    {"あなたはシニアアーキテクト。機能の設計に特化。"}
                    {"\n"}
                    {"constitution.md を必ず先に読む。"}
                    {"\n\n"}
                    <span className={styles.cHd}>{"## Completion Criteria"}</span>
                    {"\n"}
                    {"- features/{name}/spec.md 作成済み"}
                    {"\n"}
                    {"- features/{name}/plan.md 作成済み"}
                    {"\n"}
                    {"- 既存テストが全件パス"}
                    {"\n"}
                    {"→ 完了後は Developer Agent にハンドオフ"}
                  </pre>
                </div>
                <div className={styles.cb}>
                  <div className={styles.cbHdr}>
                    <div className={styles.dots}>
                      <div className={styles.dot} style={{ background: "#f25c7a" }} />
                      <div className={styles.dot} style={{ background: "#f0883e" }} />
                      <div className={styles.dot} style={{ background: "#238636" }} />
                    </div>
                    <span>.github/agents/developer.agent.md</span>
                  </div>
                  <pre>
                    <span className={styles.cKy}>{"---"}</span>
                    {"\n"}
                    <span className={styles.cGh}>{"name"}</span>
                    {": "}
                    <span className={styles.cSt}>{'"Developer Agent"'}</span>
                    {"\n"}
                    <span className={styles.cGh}>{"description"}</span>
                    {": "}
                    <span className={styles.cSt}>
                      {'"実装専任エージェント。\n  plan.mdとtasks.mdに従ってコードを書く"'}
                    </span>
                    {"\n"}
                    <span className={styles.cGh}>{"model"}</span>
                    {": "}
                    <span className={styles.cSt}>{'"claude-sonnet-4-6"'}</span>
                    {"\n"}
                    <span className={styles.cGh}>{"tools"}</span>
                    {": ["}
                    <span className={styles.cSt}>{'"edit/editFiles"'}</span>
                    {", "}
                    <span className={styles.cSt}>{'"search/codebase"'}</span>
                    {",\n         "}
                    <span className={styles.cSt}>{'"terminal/runInTerminal"'}</span>
                    {"]"}
                    {"\n"}
                    <span className={styles.cKy}>{"---"}</span>
                    {"\n\n"}
                    <span className={styles.cHd}>{"# Developer Agent"}</span>
                    {"\n\n"}
                    {"plan.md に従って実装する。"}
                    {"\n"}
                    {"仕様の逸脱は Planning Agent に差し戻す。"}
                    {"\n\n"}
                    <span className={styles.cHd}>{"## Rules"}</span>
                    {"\n"}
                    {"- tasks.md の各タスクを1つずつ実行"}
                    {"\n"}
                    {"- テストが失敗したら実装を止めて報告"}
                    {"\n"}
                    {"- 追加の依存パッケージ追加は人間確認"}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── s08: SKILL-MD ── */}
        <section id="s08">
          <div className={styles.slabel}>Section 08</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>08.</span>
            <code>SKILL.md</code> — Progressive Disclosure ナレッジ
          </h2>

          <p>
            <code>{".github/skills/<name>/SKILL.md"}</code>はClaude Code・Antigravity・OpenAI
            Codexと<strong>完全に同一のオープン規格</strong>
            を採用しています（元はAnthropicが考案）。Copilot Coding Agent・VS Code Agent Mode・
            <strong>Copilot CLI</strong>
            （2025年12月18日〜、[15]）で動作し、エージェントが意図を検知したときのみオンデマンドでロードされます（[9]）。個人スキルは
            <code>{"~/.copilot/skills/<name>/SKILL.md"}</code>
            に配置するとプロジェクトをまたいで利用できます。
          </p>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div
                className={styles.fci}
                style={{
                  background: "rgba(35, 134, 54, 0.12)",
                  border: "1px solid rgba(35, 134, 54, 0.3)",
                }}
              >
                🎓
              </div>
              <div>
                <div className={styles.fcName}>SKILL.md</div>
                <div className={styles.fcPath}>{".github/skills/<skill-name>/SKILL.md"}</div>
                <div className={styles.fcTags}>
                  <span className={`${styles.fct} ${styles.fctG}`}>4ツール共通オープン規格</span>
                  <span className={`${styles.fct} ${styles.fctM}`}>Coding Agent対応</span>
                  <span className={`${styles.fct} ${styles.fctV}`}>Progressive Disclosure</span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.dots}>
                    <div className={styles.dot} style={{ background: "#f25c7a" }} />
                    <div className={styles.dot} style={{ background: "#f0883e" }} />
                    <div className={styles.dot} style={{ background: "#238636" }} />
                  </div>
                  <span>.github/skills/db-migration/SKILL.md — 完全テンプレート</span>
                </div>
                <pre>
                  <span className={styles.cKy}>{"---"}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"name"}</span>
                  {": "}
                  <span className={styles.cSt}>{"db-migration"}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"description"}</span>
                  {": "}
                  <span className={styles.cSt}>{">"}</span>
                  {"\n"}
                  {"  "}
                  <span className={styles.cSt}>
                    {"Executes PostgreSQL schema migrations using the project's"}
                  </span>
                  {"\n"}
                  {"  "}
                  <span className={styles.cSt}>
                    {"standard migration protocol. Use when the user asks to add"}
                  </span>
                  {"\n"}
                  {"  "}
                  <span className={styles.cSt}>
                    {"tables, columns, indexes, or modify the DB schema."}
                  </span>
                  {"\n"}
                  {"  "}
                  <span className={styles.cSt}>
                    {"Do NOT use for seed data or application-level transforms."}
                  </span>
                  {"\n"}
                  <span className={styles.cCm}>
                    {'# ↑ 意味的トリガー。"Use when / Do NOT use when" を明記'}
                  </span>
                  {"\n"}
                  <span className={styles.cKy}>{"---"}</span>
                  {"\n\n"}
                  <span className={styles.cHd}>{"# Database Migration Skill"}</span>
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Instructions"}</span>
                  {"\n"}
                  {"1. `migrations/` に `YYYYMMDD_HHMMSS_description.up.sql` を作成"}
                  {"\n"}
                  {"2. ロールバック用 `.down.sql` を必ず同時作成"}
                  {"\n"}
                  {"3. 整合性チェック: `python scripts/run_migration.py --check`"}
                  {"\n"}
                  {"4. 人間レビュー後に適用: `--apply`"}
                  {"\n"}
                  {"5. `features/.../tasks.md` の対象タスクをチェック済みに"}
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Constraints"}</span>
                  {"\n"}
                  {"- 既存マイグレーションファイルを絶対に編集しない"}
                  {"\n"}
                  {"- `DROP TABLE` は人間確認なしに禁止"}
                  {"\n"}
                  {"- NULL制約後付けはデータ移行計画なしに行わない"}
                </pre>
              </div>

              <div className={`${styles.ib} ${styles.ig}`}>
                <span className={styles.ii}>💡</span>
                <div>
                  <strong>SKILL.mdはClaude Codeとパスを共有できる（コピー不要）</strong>
                  <br />
                  Copilotは<code>.claude/skills/</code>を<strong>自動ピックアップ</strong>
                  するため、Claude
                  Codeで作成したSKILL.mdをコピーなしにそのまま利用できます（[15]）。
                  <code>.github/skills/</code>
                  への配置も引き続き有効。4プラットフォーム間で完全に同一規格なので、ツール切り替え時の書き直しが不要です（[9]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── s09: AGENTS-MD ── */}
        <section id="s09">
          <div className={styles.slabel}>Section 09</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>09.</span>AGENTS.md — オープン標準統合レイヤー
          </h2>

          <p>
            GitHub CopilotはLinux Foundation傘下のAAIF（Agentic AI Foundation）が管理する
            <strong>AGENTS.mdオープン標準をネイティブサポート</strong>
            しています。プロジェクトルートの<code>AGENTS.md</code>を
            <code>copilot-instructions.md</code>
            と並行して自動読み込みします（[3], [16]）。
            <code>CLAUDE.md</code>・<code>GEMINI.md</code>も
            <strong>Copilot Coding Agentがネイティブかつ自動で読み込む</strong>
            ことが公式確認されています（[16]）。追加設定不要でマルチツール環境に対応します。
          </p>

          <div className={styles.skBanner}>
            <div className={styles.skIcon}>🌐</div>
            <div>
              <div className={styles.skTtl}>マルチ標準戦略：1プロジェクトで全ツール対応</div>
              <div className={styles.skDesc}>
                <strong>推奨構成：</strong>
                <code>AGENTS.md</code>
                を「唯一の真実のソース」として全ツール共通の基盤ルールを記述し、
                <code>copilot-instructions.md</code>
                にはCopilot固有の設定（PR形式・IDE設定等）のみを追記します。これにより、Claude
                Code・Codex・Antigravity・Copilotの4ツールを切り替えても書き直し不要の理想的なリポジトリ構造が実現します（[3]）。
              </div>
            </div>
          </div>

          <div className={styles.cb}>
            <div className={styles.cbHdr}>
              <span>AGENTS.md + copilot-instructions.md の役割分担</span>
            </div>
            <pre>
              <span className={styles.cCm}>{"# AGENTS.md（全ツール共通）"}</span>
              {"\n"}
              <span className={styles.cHd}>{"## Build & Test"}</span>
              {"        "}
              <span className={styles.cCm}>{"← 全ツール共通のコマンド"}</span>
              {"\n"}
              <span className={styles.cHd}>{"## Code Standards"}</span>
              {"      "}
              <span className={styles.cCm}>{"← 全ツール共通のコーディング規約"}</span>
              {"\n"}
              <span className={styles.cHd}>{"## Architecture"}</span>
              {"        "}
              <span className={styles.cCm}>{"← 全ツール共通のアーキテクチャ制約"}</span>
              {"\n"}
              <span className={styles.cHd}>{"## Forbidden"}</span>
              {"           "}
              <span className={styles.cCm}>{"← 全ツール共通の禁止事項"}</span>
              {"\n\n"}
              <span className={styles.cCm}>
                {"# .github/copilot-instructions.md（Copilot専用）"}
              </span>
              {"\n"}
              <span className={styles.cCm}>
                {"# AGENTS.md は Coding Agent が自動読込（明示的インポート構文は不要）"}
              </span>
              {"\n"}
              <span className={styles.cHd}>{"## PR Instructions"}</span>
              {"     "}
              <span className={styles.cCm}>{"← Copilot Coding Agent専用のPR形式"}</span>
              {"\n"}
              <span className={styles.cHd}>{"## VS Code Settings"}</span>
              {"    "}
              <span className={styles.cCm}>{"← IDE固有の補足情報"}</span>
            </pre>
          </div>
        </section>

        {/* ── s10: SPECKIT ── */}
        <section id="s10">
          <div className={styles.slabel}>Section 10</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>10.</span>GitHub Spec Kit — 公式SDD統合フレームワーク
          </h2>

          <p>
            GitHub Spec KitはMicrosoftが公式で提供する
            <strong>SDD（仕様駆動開発）統合フレームワーク</strong>です。
            <code>specify init</code>
            コマンドで必要なマークダウンファイル群・テンプレート・スクリプトを一括生成し、Copilotのプロンプトファイルと連動してspecify→plan→tasks→implementのフローを体系化します（[1],
            [6]）。
          </p>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div
                className={styles.fci}
                style={{
                  background: "rgba(240, 136, 62, 0.12)",
                  border: "1px solid rgba(240, 136, 62, 0.3)",
                }}
              >
                📐
              </div>
              <div>
                <div className={styles.fcName}>GitHub Spec Kit</div>
                <div className={styles.fcPath}>
                  pip install speckit &amp;&amp; specify init — Microsoft公式SDD FW
                </div>
                <div className={styles.fcTags}>
                  <span className={`${styles.fct} ${styles.fctC}`}>Microsoft公式</span>
                  <span className={`${styles.fct} ${styles.fctG}`}>
                    Cross-platform（Bash/PowerShell）
                  </span>
                  <span className={`${styles.fct} ${styles.fctM}`}>Copilot統合</span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <h3>constitution.md — プロジェクト憲法（最重要）</h3>
              <p>
                Spec Kitが生成する<code>.specify/memory/constitution.md</code>は
                <strong>プロジェクトの不変原則を定義する「憲法」</strong>
                です。Copilotが全仕様生成・計画策定・実装の際に必ず参照する最上位ドキュメントです。
              </p>

              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.dots}>
                    <div className={styles.dot} style={{ background: "#f25c7a" }} />
                    <div className={styles.dot} style={{ background: "#f0883e" }} />
                    <div className={styles.dot} style={{ background: "#238636" }} />
                  </div>
                  <span>.specify/memory/constitution.md — プロジェクト憲法</span>
                </div>
                <pre>
                  <span className={styles.cHd}>{"# Project Constitution"}</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    {"# この文書はCopilotが全判断の基準とする。変更は慎重に。"}
                  </span>
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Product Vision"}</span>
                  {"\n"}
                  {"中小EC向けの在庫管理SaaS。"}
                  {"\n"}
                  {"ペルソナ: IT非専門の店舗オーナー"}
                  {"\n"}
                  {"KPI: 在庫ミス率90%削減・セットアップ10分以内"}
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Technology Stack（変更禁止）"}</span>
                  {"\n"}
                  {"- Backend: Go 1.23 + gRPC"}
                  {"\n"}
                  {"- Frontend: Next.js 15 (App Router)"}
                  {"\n"}
                  {"- DB: PostgreSQL 16（ORM禁止・raw SQLのみ）"}
                  {"\n"}
                  {"- Cache: Redis 8（Valkey互換）"}
                  {"\n"}
                  {"- Test: Go testing + Vitest"}
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Architecture Principles"}</span>
                  {"\n"}
                  {"1. **Simple over Clever**: 読みやすさ > 賢さ"}
                  {"\n"}
                  {"2. **Test-First**: テストを先に書く"}
                  {"\n"}
                  {"3. **No Magic Dependencies**: 新規依存は事前承認必須"}
                  {"\n"}
                  {"4. **Fail Loud**: サイレントな失敗は絶対禁止"}
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Non-Negotiable Constraints"}</span>
                  {"\n"}
                  {"- サービス間通信: gRPCのみ（REST禁止）"}
                  {"\n"}
                  {"- 本番DBへのDELETE/DROPは人間確認"}
                  {"\n"}
                  {"- シークレットのハードコード絶対禁止"}
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Definition of Done"}</span>
                  {"\n"}
                  {"- ユニットテスト: カバレッジ80%以上"}
                  {"\n"}
                  {"- インテグレーションテスト: ハッピーパス必須"}
                  {"\n"}
                  {"- ドキュメント: spec.md・plan.md・tasks.md更新済み"}
                </pre>
              </div>

              <h3>Spec Kit SDD ワークフロー</h3>
              <div className={styles.flowWrap}>
                <div className={styles.flowLbl}>▸ GitHub Spec Kit — 5フェーズSDDワークフロー</div>
                <div className={styles.flow}>
                  <div className={styles.fst}>
                    <div className={`${styles.fbox} ${styles.fR}`}>
                      INIT
                      <br />
                      セットアップ
                    </div>
                    <div className={styles.ffile}>
                      constitution.md
                      <br />
                      テンプレート生成
                    </div>
                  </div>
                  <div className={styles.farr}>→</div>
                  <div className={styles.fst}>
                    <div className={`${styles.fbox} ${styles.fG}`}>
                      /speckit
                      <br />
                      .specify
                    </div>
                    <div className={styles.ffile}>
                      spec.md
                      <br />
                      （仕様書）
                    </div>
                  </div>
                  <div className={styles.farr}>→</div>
                  <div className={styles.fst}>
                    <div className={`${styles.fbox} ${styles.fM}`}>
                      /speckit
                      <br />
                      .plan
                    </div>
                    <div className={styles.ffile}>
                      plan.md
                      <br />
                      （技術設計）
                    </div>
                  </div>
                  <div className={styles.farr}>→</div>
                  <div className={styles.fst}>
                    <div className={`${styles.fbox} ${styles.fC}`}>
                      /speckit
                      <br />
                      .tasks
                    </div>
                    <div className={styles.ffile}>
                      tasks.md
                      <br />
                      （タスク分解）
                    </div>
                  </div>
                  <div className={styles.farr}>→</div>
                  <div className={styles.fst}>
                    <div className={`${styles.fbox} ${styles.fV}`}>
                      実装
                      <br />
                      （Copilot）
                    </div>
                    <div className={styles.ffile}>
                      コード生成
                      <br />
                      PR作成
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── s11: SDD-DOCS ── */}
        <section id="s11">
          <div className={styles.slabel}>Section 11</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>11.</span>SDD仕様書群 — spec / plan / tasks（Spec
            Kit生成物）
          </h2>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div
                className={styles.fci}
                style={{
                  background: "rgba(0, 120, 212, 0.12)",
                  border: "1px solid rgba(0, 120, 212, 0.3)",
                }}
              >
                📚
              </div>
              <div>
                <div className={styles.fcName}>SDD仕様書群</div>
                <div className={styles.fcPath}>
                  {"features/{feature-name}/spec.md · plan.md · tasks.md"}
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.dots}>
                    <div className={styles.dot} style={{ background: "#f25c7a" }} />
                    <div className={styles.dot} style={{ background: "#f0883e" }} />
                    <div className={styles.dot} style={{ background: "#238636" }} />
                  </div>
                  <span>features/preorder/spec.md — /speckit.specifyが生成</span>
                </div>
                <pre>
                  <span className={styles.cHd}>{"# Pre-Order Feature Spec"}</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    {"# Copilotが/speckit.specifyで生成。人間がレビューして確定。"}
                  </span>
                  {"\n\n"}
                  <span className={styles.cHd}>{"## User Goals"}</span>
                  {"\n"}
                  {"- 在庫切れ商品を予約購入できる（CVR向上）"}
                  {"\n"}
                  {"- 予約状況をマイページで確認できる"}
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Key Scenarios"}</span>
                  {"\n"}
                  {"1. ユーザーが在庫0商品の詳細ページを訪問し「予約する」を押す"}
                  {"\n"}
                  {"2. ログイン未完了の場合、認証後にカートへリダイレクト"}
                  {"\n"}
                  {"3. チェックアウト完了後、確認メールが届く"}
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Acceptance Criteria"}</span>
                  {"\n"}
                  {"- [ ] 在庫0でも「予約する」ボタンが表示される"}
                  {"\n"}
                  {"- [ ] 同時100アクセスで在庫の二重予約が発生しない"}
                  {"\n"}
                  {"- [ ] 注文完了メールが60秒以内に届く"}
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Out of Scope"}</span>
                  {"\n"}
                  {"- モバイルアプリ対応（今フェーズはWeb only）"}
                </pre>
              </div>

              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.dots}>
                    <div className={styles.dot} style={{ background: "#f25c7a" }} />
                    <div className={styles.dot} style={{ background: "#f0883e" }} />
                    <div className={styles.dot} style={{ background: "#238636" }} />
                  </div>
                  <span>features/preorder/tasks.md — /speckit.tasksが生成</span>
                </div>
                <pre>
                  <span className={styles.cHd}>{"# Pre-Order Tasks"}</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    {"# constitution.md・spec.md・plan.mdの整合性チェック済み"}
                  </span>
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Phase 1: DB・モデル"}</span>
                  {"\n"}
                  {
                    "- [ ] Task 1.1: ordersテーブルにis_preorderカラム追加（db-migration SKILL使用）"
                  }
                  {"\n"}
                  {"- [ ] Task 1.2: Inventory Serviceの在庫ロックロジック（Redis SETNX）"}
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Phase 2: APIエンドポイント"}</span>
                  {"\n"}
                  {"- [ ] Task 2.1: POST /api/orders（プリオーダー対応）— "}
                  <span className={styles.cCo}>{"依存: Task 1.2"}</span>
                  {"\n"}
                  {"- [ ] Task 2.2: GET  /api/orders/{id} ステータス確認"}
                  {"\n"}
                  {"- [ ] Task 2.3: Stripe Webhook受信処理"}
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Phase 3: フロントエンド"}</span>
                  {"\n"}
                  {"- [ ] Task 3.1: 「予約する」ボタンコンポーネント — "}
                  <span className={styles.cCo}>{"並列可"}</span>
                  {"\n"}
                  {"- [ ] Task 3.2: マイページ注文履歴表示 — "}
                  <span className={styles.cCo}>{"並列可"}</span>
                  {"\n\n"}
                  <span className={styles.cHd}>{"## Phase 4: 検証"}</span>
                  {"\n"}
                  {"- [ ] Task 4.1: E2Eテスト（Playwright）— "}
                  <span className={styles.cCo}>{"依存: Phase 2+3完了"}</span>
                  {"\n"}
                  {"- [ ] Task 4.2: 負荷テスト（k6, 1,000同時接続）"}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* ── s12: SYSTEM-PROMPT ── */}
        <section id="s12">
          <div className={styles.slabel}>Section 12</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>12.</span>コンテキスト合成の仕組み — 全ファイルの優先順位
          </h2>

          <p>
            Copilotが1回のリクエストで複数のファイルを合成してコンテキストウィンドウに注入する仕組みを理解することが、最適な設計の前提です（[10]）。
          </p>

          <div className={styles.cb}>
            <div className={styles.cbHdr}>
              <span>
                Copilotのコンテキスト合成順序（最終的なシステムプロンプトへの注入）— 2026年3月版
              </span>
            </div>
            <pre>
              <span className={styles.cCm}>
                {"╔══════════════════════════════════════════════════════════════╗"}
              </span>
              {"\n"}
              <span className={styles.cCm}>
                {"║  Copilot システムプロンプト（最終合成物）                      ║"}
              </span>
              {"\n"}
              <span className={styles.cCm}>
                {"╠══════════════════════════════════════════════════════════════╣"}
              </span>
              {"\n"}
              <span className={styles.cHd}>{"║  [1] copilot-instructions.md"}</span>
              {"          ← 全リクエストに常時注入"}
              {"\n"}
              <span className={styles.cHd}>{"║  [2] AGENTS.md"}</span>
              {"                        ← オープン標準（常時）"}
              {"\n"}
              <span className={styles.cHd}>{"║  [3] .instructions.md（applyToマッチ）"}</span>
              {"  ← パス一致時のみ追加"}
              {"\n"}
              <span className={styles.cHd}>{"║  [4] .agent.md or .chatmode.md"}</span>
              {"        ← アクティブな場合"}
              {"\n"}
              <span className={styles.cHd}>{"║  [5] SKILL.md（意味的マッチ）"}</span>
              {"           ← オンデマンド"}
              {"\n"}
              <span className={styles.cHd}>{"║  [6] .prompt.md（手動実行）"}</span>
              {"            ← /コマンドで呼出時"}
              {"\n"}
              <span className={styles.cHd}>{"║  [7] MCPサーバーのツール定義"}</span>
              {"           ← 🆕 Agent Mode時に自動注入"}
              {"\n"}
              <span className={styles.cHd}>{"║  [8] プランモード計画（承認済み）"}</span>
              {"       ← 🆕 Plan Mode使用時に追加"}
              {"\n"}
              <span className={styles.cHd}>{"║  [9] ユーザーのチャットテキスト"}</span>
              {"\n"}
              <span className={styles.cCm}>
                {"╠══════════════════════════════════════════════════════════════╣"}
              </span>
              {"\n"}
              <span className={styles.cCm}>
                {"║  → 全部マージして圧縮 → モデルのコンテキストウィンドウへ        ║"}
              </span>
              {"\n"}
              <span className={styles.cCm}>
                {"╚══════════════════════════════════════════════════════════════╝"}
              </span>
              {"\n\n"}
              <span className={styles.cCm}>
                {"# 重要: 下に書かれたものほど「後に読まれ」前のものを上書きする"}
              </span>
              {"\n"}
              <span className={styles.cCm}>
                {"# Copilot Chat の References パネルでどのファイルが使われたか確認可能"}
              </span>
              {"\n"}
              <span className={styles.cCm}>
                {"# 🆕 /context コマンド（CLI）でトークン使用量を可視化できる（[20]）"}
              </span>
            </pre>
          </div>
        </section>

        {/* ── s13: MCP-SUPPORT ── */}
        <section id="s13">
          <div className={styles.slabel}>Section 13 🆕 NEW 2026</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>13.</span>MCPサポート — .vscode/mcp.json 完全ガイド
          </h2>

          <p>
            Model Context Protocol（MCP）は
            <strong>AIモデルと外部ツール・サービスを標準プロトコルで接続するオープン標準</strong>
            です（Anthropic考案 → Linux Foundation傘下）。2026年にGitHub CopilotがVS
            Code・JetBrains・Visual Studio・Copilot
            CLIで正式サポートし、データベース・API・ブラウザ・Figma・Jira・Slackなど100以上のMCPサーバーをCopilot
            Agent Modeから直接操作できるようになりました。GitHub MCP ServerはCopilot CLIに
            <strong>ビルトインで組み込み済み</strong>
            （追加設定不要）です（[18]）。
          </p>

          <div className={`${styles.ib} ${styles.ic}`}>
            <span className={styles.ii}>⚠️</span>
            <div>
              <strong>Business / Enterprise プランの注意事項：</strong>
              <br />
              組織・企業のCopilot Business/Enterpriseメンバーが利用するには、
              <strong>Organization管理者が「MCP servers in Copilot」ポリシーを有効化</strong>
              する必要があります（デフォルト無効）。個人プラン（Free・Pro・Pro+）ではそのまま利用可能です（[18]）。
            </div>
          </div>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div
                className={styles.fci}
                style={{
                  background: "rgba(31, 184, 205, 0.12)",
                  border: "1px solid rgba(31, 184, 205, 0.3)",
                }}
              >
                🔌
              </div>
              <div>
                <div className={styles.fcName}>.vscode/mcp.json</div>
                <div className={styles.fcPath}>
                  .vscode/mcp.json — VS Code ワークスペース共有MCP設定
                </div>
                <div className={styles.fcTags}>
                  <span className={`${styles.fct} ${styles.fctT}`}>Agent Mode専用</span>
                  <span className={`${styles.fct} ${styles.fctM}`}>リモート/ローカル対応</span>
                  <span className={`${styles.fct} ${styles.fctG}`}>git管理でチーム共有可</span>
                  <span className={`${styles.fct} ${styles.fctV}`}>IntelliSense対応</span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <h3>公式推奨構成 — GitHub MCP Server（リモート） + Playwright（ローカル）</h3>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.dots}>
                    <div className={styles.dot} style={{ background: "#f25c7a" }} />
                    <div className={styles.dot} style={{ background: "#f0883e" }} />
                    <div className={styles.dot} style={{ background: "#238636" }} />
                  </div>
                  <span>.vscode/mcp.json — リモート + ローカル構成例（公式ドキュメント準拠）</span>
                </div>
                <pre>
                  {"{"}
                  {"\n"}
                  {"  "}
                  <span className={styles.cGh}>{'"servers"'}</span>
                  {": {"}
                  {"\n"}
                  {"    "}
                  <span className={styles.cCm}>
                    {"// リモートMCPサーバー（GitHub公式 — 推奨）"}
                  </span>
                  {"\n"}
                  {"    "}
                  <span className={styles.cGh}>{'"github"'}</span>
                  {": {"}
                  {"\n"}
                  {"      "}
                  <span className={styles.cHd}>{'"type"'}</span>
                  {": "}
                  <span className={styles.cSt}>{'"http"'}</span>
                  {","}
                  {"\n"}
                  {"      "}
                  <span className={styles.cHd}>{'"url"'}</span>
                  {": "}
                  <span className={styles.cSt}>{'"https://api.githubcopilot.com/mcp"'}</span>
                  {"\n"}
                  {"      "}
                  <span className={styles.cCm}>
                    {"// OAuth認証 — VS CodeがCodeLensで「Auth」ボタンを表示"}
                  </span>
                  {"\n"}
                  {"    },"}
                  {"\n"}
                  {"    "}
                  <span className={styles.cCm}>
                    {"// ローカルMCPサーバー（ブラウザ自動化 — Playwright）"}
                  </span>
                  {"\n"}
                  {"    "}
                  <span className={styles.cGh}>{'"playwright"'}</span>
                  {": {"}
                  {"\n"}
                  {"      "}
                  <span className={styles.cHd}>{'"command"'}</span>
                  {": "}
                  <span className={styles.cSt}>{'"npx"'}</span>
                  {","}
                  {"\n"}
                  {"      "}
                  <span className={styles.cHd}>{'"args"'}</span>
                  {": ["}
                  <span className={styles.cSt}>{'"-y"'}</span>
                  {", "}
                  <span className={styles.cSt}>{'"@microsoft/mcp-server-playwright"'}</span>
                  {"]"}
                  {"\n"}
                  {"    },"}
                  {"\n"}
                  {"    "}
                  <span className={styles.cCm}>
                    {"// ローカルMCPサーバー（Jira連携）— API Key必要"}
                  </span>
                  {"\n"}
                  {"    "}
                  <span className={styles.cGh}>{'"jira"'}</span>
                  {": {"}
                  {"\n"}
                  {"      "}
                  <span className={styles.cHd}>{'"command"'}</span>
                  {": "}
                  <span className={styles.cSt}>{'"npx"'}</span>
                  {","}
                  {"\n"}
                  {"      "}
                  <span className={styles.cHd}>{'"args"'}</span>
                  {": ["}
                  <span className={styles.cSt}>{'"-y"'}</span>
                  {", "}
                  <span className={styles.cSt}>{'"@atlassian/mcp-server-jira"'}</span>
                  {"],"}
                  {"\n"}
                  {"      "}
                  <span className={styles.cHd}>{'"env"'}</span>
                  {": {"}
                  {"\n"}
                  {"        "}
                  <span className={styles.cHd}>{'"JIRA_API_TOKEN"'}</span>
                  {": "}
                  <span className={styles.cSt}>
                    {'"$'}
                    {'{input:jiraToken}"'}
                  </span>
                  {","}
                  {"\n"}
                  {"        "}
                  <span className={styles.cCm}>
                    {"// $"}
                    {"{input:*} = VS CodeがSecrets保管庫から安全取得"}
                  </span>
                  {"\n"}
                  {"        "}
                  <span className={styles.cHd}>{'"JIRA_BASE_URL"'}</span>
                  {": "}
                  <span className={styles.cSt}>{'"https://yourcompany.atlassian.net"'}</span>
                  {"\n"}
                  {"      }"}
                  {"\n"}
                  {"    }"}
                  {"\n"}
                  {"  }"}
                  {"\n"}
                  {"}"}
                </pre>
              </div>

              <div className={`${styles.ib} ${styles.ig}`}>
                <span className={styles.ii}>💡</span>
                <div>
                  <strong>Claude Desktopの設定を流用する</strong>
                  <br />
                  既にClaude Desktopで<code>claude_desktop_config.json</code>
                  にMCPサーバーを設定している場合、<code>settings.json</code>に
                  <code>{'"chat.mcp.discovery.enabled": true'}</code>
                  を追記するだけで、VS CopilotがClaude
                  Desktopの設定を自動検出して流用できます（[19]）。設定を二重管理する必要がありません。
                </div>
              </div>

              <h3>MCPサーバーを有効化する手順（VS Code）</h3>
              <div className={styles.g4}>
                <div className={styles.mc}>
                  <div className={styles.mcTag} style={{ color: "var(--ms)" }}>
                    Step 1
                  </div>
                  <p>
                    VS Code拡張機能パネル（Ctrl+Shift+X）でMCP
                    Marketplaceを開き、サーバーを検索・インストール。またはmcp.jsonに手動記述。
                  </p>
                </div>
                <div className={styles.mc}>
                  <div className={styles.mcTag} style={{ color: "var(--ms)" }}>
                    Step 2
                  </div>
                  <p>
                    mcp.jsonファイル上部に表示される<strong>「Start」</strong>
                    CodeLensボタンをクリックしてサーバーを起動。
                  </p>
                </div>
                <div className={styles.mc}>
                  <div className={styles.mcTag} style={{ color: "var(--ms)" }}>
                    Step 3
                  </div>
                  <p>
                    Copilot Chatを開き、<strong>Agent</strong>
                    モードを選択（Chatモード右上のドロップダウン）。
                  </p>
                </div>
                <div className={styles.mc}>
                  <div className={styles.mcTag} style={{ color: "var(--ms)" }}>
                    Step 4
                  </div>
                  <p>
                    ツールアイコンをクリックして「MCP Server:
                    GitHub」などの利用可能ツール一覧を確認して完了。
                  </p>
                </div>
              </div>

              <h3>Copilot CLI — MCPサーバー管理コマンド</h3>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.dots}>
                    <div className={styles.dot} style={{ background: "#f25c7a" }} />
                    <div className={styles.dot} style={{ background: "#f0883e" }} />
                    <div className={styles.dot} style={{ background: "#238636" }} />
                  </div>
                  <span>Copilot CLI — /mcp サブコマンド一覧</span>
                </div>
                <pre>
                  <span className={styles.cCm}>{"# インタラクティブに追加（最も簡単）"}</span>
                  {"\n"}
                  {"/mcp add"}
                  {"\n\n"}
                  <span className={styles.cCm}>{"# 設定確認（全サーバーの状態とツール一覧）"}</span>
                  {"\n"}
                  {"/mcp show"}
                  {"\n"}
                  {"/mcp show github        "}
                  <span className={styles.cCm}>{"# 特定サーバーの詳細"}</span>
                  {"\n\n"}
                  <span className={styles.cCm}>{"# 管理コマンド"}</span>
                  {"\n"}
                  {"/mcp edit   github      "}
                  <span className={styles.cCm}>{"# 設定変更"}</span>
                  {"\n"}
                  {"/mcp disable playwright "}
                  <span className={styles.cCm}>{"# 一時無効化（設定は保持）"}</span>
                  {"\n"}
                  {"/mcp enable  playwright "}
                  <span className={styles.cCm}>{"# 再有効化"}</span>
                  {"\n"}
                  {"/mcp delete  jira       "}
                  <span className={styles.cCm}>{"# 削除"}</span>
                  {"\n\n"}
                  <span className={styles.cCm}>
                    {"# GitHub MCP Serverはビルトイン（追加不要）"}
                  </span>
                  {"\n"}
                  <span className={styles.cCm}>
                    {"# Issue作成・PR管理・コードサーチが追加設定なしで利用可能"}
                  </span>
                </pre>
              </div>

              <h3>MCPサーバーとSDD（仕様駆動開発）の組み合わせパターン</h3>
              <div className={styles.g3}>
                <div className={styles.mc}>
                  <div className={styles.mcTag} style={{ color: "var(--teal)" }}>
                    パターン1: Jira→spec.md自動生成
                  </div>
                  <p>
                    「Jira Epic
                    PROJ-123の詳細からspec.mdを生成して」と指示するだけで、JiraのMCPサーバーからチケット内容を取得しspec.mdを自動生成。コピペ作業が不要になる。
                  </p>
                </div>
                <div className={styles.mc}>
                  <div className={styles.mcTag} style={{ color: "var(--teal)" }}>
                    パターン2: DB→スキーマ自動参照
                  </div>
                  <p>
                    PostgreSQLやMySQLのMCPサーバーを接続し、「現在のDBスキーマに基づいてマイグレーションを提案して」と指示。データベースの現状を直接把握した上でコードを生成。
                  </p>
                </div>
                <div className={styles.mc}>
                  <div className={styles.mcTag} style={{ color: "var(--teal)" }}>
                    パターン3: Playwright→E2Eテスト
                  </div>
                  <p>
                    Playwright
                    MCPサーバーでブラウザを操作し、「このURLのUIをスクリーンショット撮影してバグを報告して」→自動でスクリーンショット取得・Issueに添付するエンドツーエンドフロー。
                  </p>
                </div>
              </div>

              <div className={`${styles.ib} ${styles.im}`}>
                <span className={styles.ii}>🔒</span>
                <div>
                  <strong>MCPセキュリティのベストプラクティス</strong>
                  <br />
                  {"APIキーは"}
                  <code>
                    {"$"}
                    {"{input:変数名}"}
                  </code>
                  {"を使いVS"}
                  Codeのシークレットストレージに安全保管（JSONに平文記載しない）。mcp.jsonはgitにコミットしても安全なように、シークレット部分を環境変数参照にします。サードパーティMCPサーバーはプライバシーポリシーを必ず確認してください。Business/Enterprise管理者はOrg設定からドメイン制限が可能です（[19]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── s14: PLAN-MODE ── */}
        <section id="s14">
          <div className={styles.slabel}>Section 14 🆕 NEW 2026</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>14.</span>プランモード &amp; エージェントフック —
            2026年の新機能
          </h2>

          <p>
            2026年初頭に追加されたプランモードと、JetBrainsで先行してPublic
            Previewとなったエージェントフックは、
            <strong>AIエージェントを「計画してから実行」へシフトさせる革新的な機能</strong>
            です。複雑なタスクを実装前に対話的に計画・承認できるため、手戻りを大幅に削減します（[20],
            [21]）。さらに2026年3月のVS Code 1.112では<strong>MCPサーバーのサンドボックス化</strong>
            （macOS/Linux）とエージェント自律性の拡張が追加されています（[22]）。
          </p>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div
                className={styles.fci}
                style={{
                  background: "rgba(240, 136, 62, 0.12)",
                  border: "1px solid rgba(240, 136, 62, 0.3)",
                }}
              >
                🗺️
              </div>
              <div>
                <div className={styles.fcName}>プランモード（Plan Mode）</div>
                <div className={styles.fcPath}>
                  Shift + Tab でトグル切替 — CLI / JetBrains GA / VS Code近日GA
                </div>
                <div className={styles.fcTags}>
                  <span className={`${styles.fct} ${styles.fctC}`}>CLI: GA（Jan 2026）</span>
                  <span className={`${styles.fct} ${styles.fctM}`}>JetBrains: GA（Mar 2026）</span>
                  <span className={`${styles.fct} ${styles.fctV}`}>VS Code: GA予定</span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <h3>プランモードとは — 「計画してから実装」</h3>
              <p>
                通常のAgent Modeでは指示を受けた瞬間に実装を開始しますが、プランモードでは
                <strong>まず実装計画を作成し、開発者が承認してから実装を開始</strong>
                します。Copilot CLIでは<code>Shift+Tab</code>でモード切替できます（[20]）。
              </p>

              <div className={styles.flowWrap}>
                <div className={styles.flowLbl}>
                  ▸ プランモード — 会話型計画フロー（Copilot CLI）
                </div>
                <div className={styles.flow}>
                  <div className={styles.fst}>
                    <div className={`${styles.fbox} ${styles.fC}`}>
                      Shift+Tab
                      <br />
                      プランモード起動
                    </div>
                    <div className={styles.ffile}>
                      モードインジケータが
                      <br />
                      切り替わる
                    </div>
                  </div>
                  <div className={styles.farr}>→</div>
                  <div className={styles.fst}>
                    <div className={`${styles.fbox} ${styles.fM}`}>
                      Copilotが
                      <br />
                      要件を質問
                    </div>
                    <div className={styles.ffile}>
                      ask_user ツールで
                      <br />
                      スコープ・制約を確認
                    </div>
                  </div>
                  <div className={styles.farr}>→</div>
                  <div className={styles.fst}>
                    <div className={`${styles.fbox} ${styles.fG}`}>
                      実装計画を
                      <br />
                      パネルに表示
                    </div>
                    <div className={styles.ffile}>
                      ファイル変更一覧
                      <br />
                      実装ステップ
                    </div>
                  </div>
                  <div className={styles.farr}>→</div>
                  <div className={styles.fst}>
                    <div className={`${styles.fbox} ${styles.fV}`}>
                      人間が計画を
                      <br />
                      レビュー・修正
                    </div>
                    <div className={styles.ffile}>
                      Ctrl+Y で編集
                      <br />
                      コメントで調整
                    </div>
                  </div>
                  <div className={styles.farr}>→</div>
                  <div className={styles.fst}>
                    <div className={`${styles.fbox} ${styles.fT}`}>
                      承認後に
                      <br />
                      実装開始
                    </div>
                    <div className={styles.ffile}>
                      Agent Modeで
                      <br />
                      自律実行
                    </div>
                  </div>
                </div>
              </div>

              <h3>Spec KitとプランモードのSDD統合ワークフロー（2026年推奨）</h3>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.dots}>
                    <div className={styles.dot} style={{ background: "#f25c7a" }} />
                    <div className={styles.dot} style={{ background: "#f0883e" }} />
                    <div className={styles.dot} style={{ background: "#238636" }} />
                  </div>
                  <span>Copilot CLI — プランモード × SDD 実践パターン</span>
                </div>
                <pre>
                  <span className={styles.cCm}>{"# ── ステップ 1: プランモードに切り替え ──"}</span>
                  {"\n"}
                  <span className={styles.cCm}>{"# Shift + Tab でプランモードをオン"}</span>
                  {"\n"}
                  <span className={styles.cHd}>{"プランモード"}</span>
                  {": 有効\n\n"}
                  <span className={styles.cCm}>{"# ── ステップ 2: 高レベルな要求を入力 ──"}</span>
                  {"\n"}
                  <span className={styles.cSt}>
                    {
                      "features/preorder/spec.mdとplan.mdに従ってプリオーダーAPIを実装して。\nconstitution.mdのアーキテクチャ原則（gRPCのみ・ORM禁止）に従うこと。"
                    }
                  </span>
                  {"\n\n"}
                  <span className={styles.cCm}>
                    {"# ── ステップ 3: Copilotが質問してくる（ask_userツール） ──"}
                  </span>
                  {"\n"}
                  <span className={styles.cGh}>{"Copilot:"}</span>
                  {
                    " 実装の優先順位を確認させてください：\n  1. 在庫ロック（Redis SETNX）を先に実装しますか？\n  2. それとも gRPCエンドポイントから始めますか？\n  3. spec.mdのAC（同時100接続）に対応したレート制限は含めますか？\n\n"
                  }
                  <span className={styles.cCm}>
                    {"# ── ステップ 4: 実装計画がパネルに表示される ──"}
                  </span>
                  {"\n"}
                  <span className={styles.cHd}>{"実装計画:"}</span>
                  {
                    "\n  Phase 1: internal/inventory/lock.go — Redisロックロジック\n  Phase 2: proto/preorder/v1/preorder.proto — gRPC定義\n  Phase 3: internal/preorder/service.go — ビジネスロジック\n  Phase 4: internal/preorder/service_test.go — table-drivenテスト\n  変更ファイル: 7 | 新規ファイル: 3 | 削除: 0\n\n"
                  }
                  <span className={styles.cCm}>
                    {"# ── ステップ 5: レビュー後に承認 → 実装開始 ──"}
                  </span>
                  {"\n"}
                  <span className={styles.cSt}>
                    {"承認。Phase 1から始めて。テストを先に書くこと（TDD）。"}
                  </span>
                </pre>
              </div>

              <div className={`${styles.ib} ${styles.ig}`}>
                <span className={styles.ii}>📊</span>
                <div>
                  <strong>
                    プランモードのパフォーマンスデータ（Visual Studio向け内部テスト）：
                  </strong>
                  <br />
                  Microsoftの内部ベンチマーク（SWE-bench）では、プランニング機能を使用した場合、GPT-5とClaude
                  Sonnet 4が<strong>成功率約15%向上</strong>、<strong>タスク完了数約20%増加</strong>
                  という結果が報告されています（[22]）。複雑なマルチファイルタスクほど効果が顕著です。
                </div>
              </div>
            </div>
          </div>

          <div className={styles.fc} style={{ marginTop: "2rem" }}>
            <div className={styles.fcHdr}>
              <div
                className={styles.fci}
                style={{
                  background: "rgba(155, 109, 255, 0.12)",
                  border: "1px solid rgba(155, 109, 255, 0.3)",
                }}
              >
                🪝
              </div>
              <div>
                <div className={styles.fcName}>エージェントフック（Agent Hooks）</div>
                <div className={styles.fcPath}>
                  .github/agent-hooks/ — JetBrains Public Preview（Mar 2026）
                </div>
                <div className={styles.fcTags}>
                  <span className={`${styles.fct} ${styles.fctV}`}>JetBrains: Preview</span>
                  <span className={`${styles.fct} ${styles.fctC}`}>VS Code: 近日対応予定</span>
                  <span className={`${styles.fct} ${styles.fctM}`}>
                    Lint / セキュリティ / CI自動化
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <p>
                エージェントフックは
                <strong>エージェントセッションの主要タイミングでカスタムコマンドを自動実行</strong>
                する機能です。実装前のLint、コミット前のセキュリティスキャン、PR作成前のテスト実行など、チームのポリシーをエージェントワークフローに自動組み込みできます（[21]）。
              </p>

              <div className={styles.g3}>
                <div className={styles.mc}>
                  <div className={styles.mcTag} style={{ color: "var(--violet)" }}>
                    pre_tool_call フック
                  </div>
                  <p>
                    ツール呼び出し前に実行。ファイル変更前のバリデーション、特定ファイルへの書き込み禁止チェック、コーディング規約の事前確認に使用。
                  </p>
                </div>
                <div className={styles.mc}>
                  <div className={styles.mcTag} style={{ color: "var(--violet)" }}>
                    post_tool_call フック
                  </div>
                  <p>
                    ツール呼び出し後に実行。変更ファイルに対する自動Lint・フォーマット適用、テスト実行トリガー、変更ログ自動更新に使用。
                  </p>
                </div>
                <div className={styles.mc}>
                  <div className={styles.mcTag} style={{ color: "var(--violet)" }}>
                    session_end フック
                  </div>
                  <p>
                    エージェントセッション終了時に実行。セキュリティスキャン（SAST）の実行、テストカバレッジ確認、PR作成前の最終検証チェックリストに使用。
                  </p>
                </div>
              </div>

              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.dots}>
                    <div className={styles.dot} style={{ background: "#f25c7a" }} />
                    <div className={styles.dot} style={{ background: "#f0883e" }} />
                    <div className={styles.dot} style={{ background: "#238636" }} />
                  </div>
                  <span>エージェントフック設定例（JetBrains / VS Code Preview）</span>
                </div>
                <pre>
                  <span className={styles.cCm}>{"# .github/agent-hooks/post-edit.yaml"}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"name"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"Post-Edit Quality Gate"'}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"trigger"}</span>
                  {": "}
                  <span className={styles.cSt}>{"post_tool_call"}</span>
                  {"\n"}
                  <span className={styles.cGh}>{"conditions"}</span>
                  {":\n  - "}
                  <span className={styles.cHd}>{"tool"}</span>
                  {": "}
                  <span className={styles.cSt}>{"edit/editFiles"}</span>
                  {"\n    "}
                  <span className={styles.cHd}>{"file_pattern"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"**/*.go"'}</span>
                  {"\n\n"}
                  <span className={styles.cGh}>{"steps"}</span>
                  {":\n  - "}
                  <span className={styles.cHd}>{"name"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"Lint"'}</span>
                  {"\n    "}
                  <span className={styles.cHd}>{"run"}</span>
                  {": "}
                  <span className={styles.cSt}>
                    {'"golangci-lint run $'}
                    {'{changed_files}"'}
                  </span>
                  {"\n  - "}
                  <span className={styles.cHd}>{"name"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"Test"'}</span>
                  {"\n    "}
                  <span className={styles.cHd}>{"run"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"go test ./... -run TestUnit"'}</span>
                  {"\n    "}
                  <span className={styles.cHd}>{"on_failure"}</span>
                  {": "}
                  <span className={styles.cSt}>{'"pause_agent"'}</span>
                  {"  "}
                  <span className={styles.cCm}>{"# 失敗時はエージェントを一時停止"}</span>
                  {"\n\n"}
                  <span className={styles.cCm}>
                    {"# → テストが失敗するとエージェントが停止してエラーを報告"}
                  </span>
                  {"\n"}
                  <span className={styles.cCm}>{"# → 人間が確認後に「続けて」と指示できる"}</span>
                </pre>
              </div>
            </div>
          </div>

          <div className={styles.fc} style={{ marginTop: "2rem" }}>
            <div className={styles.fcHdr}>
              <div
                className={styles.fci}
                style={{
                  background: "rgba(35, 134, 54, 0.12)",
                  border: "1px solid rgba(35, 134, 54, 0.3)",
                }}
              >
                🧠
              </div>
              <div>
                <div className={styles.fcName}>エージェントメモリ（Agentic Memory）</div>
                <div className={styles.fcPath}>
                  自動学習 — Copilot Coding Agent / Code Review が利用（2026年）
                </div>
                <div className={styles.fcTags}>
                  <span className={`${styles.fct} ${styles.fctG}`}>Coding Agent対応</span>
                  <span className={`${styles.fct} ${styles.fctM}`}>Code Review対応</span>
                  <span className={`${styles.fct} ${styles.fctV}`}>リポジトリ固有の知識蓄積</span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <p>
                GitHub Copilotが<strong>リポジトリに関する有用な情報を自動推論・記憶</strong>
                し、Copilot Coding AgentとCopilot Code
                Reviewがその知識を利用して品質を向上させる新機能です。Copilot
                Spacesと連携することで、よりプロジェクト固有の知識に基づいた提案が得られます（[23]）。
              </p>

              <div className={styles.g2}>
                <div className={`${styles.ib} ${styles.ig}`}>
                  <span className={styles.ii}>🧠</span>
                  <div>
                    <strong>エージェントメモリが記憶する情報例：</strong>
                    <br />• コードベースのパターン（よく使われる関数・ユーティリティ）
                    <br />• アーキテクチャ上の決定と理由
                    <br />• バグの傾向（この部分は過去にXのバグが多い）
                    <br />• テストパターン（このサービスのテスト手法の特徴）
                  </div>
                </div>
                <div className={`${styles.ib} ${styles.im}`}>
                  <span className={styles.ii}>🏗️</span>
                  <div>
                    <strong>Copilot Spacesとの連携：</strong>
                    <br />
                    コード・仕様書・ドキュメント・spec.mdなどを「Space」にまとめることで、Copilotの回答がプロジェクト固有のコンテキストに基づくものになります。Coding
                    AgentとCode Reviewの両方で活用されます（[23]）。
                  </div>
                </div>
              </div>
            </div>
          </div>
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
