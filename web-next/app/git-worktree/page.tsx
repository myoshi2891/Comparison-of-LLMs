import type { Metadata } from "next";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const MermaidDiagram = dynamic(() => import("@/components/docs/MermaidDiagram"), { ssr: false });

export const metadata: Metadata = {
  title: "git worktree × 4プラットフォーム ドキュメント並列開発ガイド",
  description:
    "Claude / Gemini / Codex / GitHub Copilot — 4プラットフォームのドキュメントをAIツールとWebSearchで並列更新するための完全ガイド。git worktreeのセットアップから日常ワークフロー・GitHub Actions統合まで。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function GitWorktreePage() {
  return (
    <div className={styles.page}>
      {/* ═══ HEADER ═══ */}
      <header className={styles.header}>
        <div className={styles.hdrBar}>
          <div className={styles.hdrBarL}>
            <span>
              <span className={styles.dot} />
              SYSTEM: READY
            </span>
            <span>BRANCH: feature/docs-update</span>
            <span>WORKTREES: 4</span>
          </div>
          <span>git worktree × 4-Platform Guide</span>
        </div>
        <div className={styles.hdrHero}>
          <div>
            <h1>
              <span className={styles.accent}>git worktree</span>
              <br />
              ドキュメント並列開発ガイド
            </h1>
            <p className={styles.hdrSub}>
              Claude / Gemini / Codex / GitHub Copilot ——
              <br />
              4プラットフォームのドキュメント（agent.html / skill.html 計8ファイル）を
              <br />
              AI ツールと WebSearch で並列更新するための完全ガイド。
            </p>
          </div>
          <div className={styles.badges}>
            <div className={`${styles.badge} ${styles.bCl}`}>Claude Code</div>
            <div className={`${styles.badge} ${styles.bGe}`}>Google Antigravity</div>
            <div className={`${styles.badge} ${styles.bCo}`}>OpenAI Codex</div>
            <div className={`${styles.badge} ${styles.bCp}`}>GitHub Copilot</div>
          </div>
        </div>
      </header>

      <div className={styles.wrap}>
        {/* ══════════ STEP 00 ══════════ */}
        <section className={styles.step} id="s00">
          <div className={styles.stepHdr}>
            <div className={styles.stepN}>00</div>
            <div>
              <div className={styles.stepTitle}>git worktree とは何か — なぜ並列開発に有効か</div>
              <div className={styles.stepDesc}>
                通常の git clone
                との根本的な違いと、4プラットフォームのドキュメント並列更新における優位性を理解する。
              </div>
            </div>
          </div>

          <p>
            <strong>git worktree</strong>
            は、1つのリポジトリ（<code>.git</code>）を共有しながら、
            <strong>複数のディレクトリで別々のブランチを同時チェックアウトできる</strong>
            Git 標準機能です。Git
            2.5（2015年）から搭載されており、追加インストール不要で利用できます。
          </p>

          {/* ── SVG: 構造比較図 ── */}
          <div className={styles.svgBox}>
            <div className={styles.svgLbl}>
              ▸ 構造比較 — clone × 4（アンチパターン） vs worktree × 4（推奨）
            </div>
            <svg
              viewBox="0 0 860 390"
              xmlns="http://www.w3.org/2000/svg"
              fontFamily="IBM Plex Mono, Courier New, monospace"
              role="img"
              aria-label="clone × 4（アンチパターン）と worktree × 4（推奨）の構造比較図"
            >
              <title>clone × 4 vs worktree × 4 構造比較</title>
              <defs>
                <marker id="arr-g" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0,8 3,0 6" fill="#56d364" />
                </marker>
                <marker id="arr-r" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0,8 3,0 6" fill="#ff7b72" />
                </marker>
                <marker
                  id="arr-cl"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0,8 3,0 6" fill="#ff9f6a" />
                </marker>
                <marker
                  id="arr-ge"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0,8 3,0 6" fill="#79b8ff" />
                </marker>
                <marker
                  id="arr-cp"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0,8 3,0 6" fill="#e2a8ff" />
                </marker>
              </defs>

              {/* ▌LEFT PANEL: clone × 4 ▐ */}
              <rect
                x="4"
                y="4"
                width="400"
                height="382"
                rx="8"
                fill="#1c0f0f"
                stroke="#ff7b72"
                strokeWidth="1.5"
              />
              <text
                x="204"
                y="32"
                textAnchor="middle"
                fill="#ff7b72"
                fontSize="14"
                fontWeight="700"
              >
                ❌ clone × 4（アンチパターン）
              </text>
              <text x="204" y="50" textAnchor="middle" fill="#cdd9e5" fontSize="11">
                .git が 4 つ独立 — 共通変更を毎回 4 箇所に手動コピー
              </text>

              {/* repo: claude */}
              <rect
                x="20"
                y="64"
                width="172"
                height="130"
                rx="5"
                fill="#241510"
                stroke="#ff9f6a"
                strokeWidth="1.5"
              />
              <text
                x="106"
                y="86"
                textAnchor="middle"
                fill="#ff9f6a"
                fontSize="13"
                fontWeight="700"
              >
                docs-claude/
              </text>
              <rect
                x="33"
                y="93"
                width="146"
                height="22"
                rx="3"
                fill="#3a1f10"
                stroke="#ff7b72"
                strokeWidth="1"
              />
              <text x="106" y="108" textAnchor="middle" fill="#ff7b72" fontSize="12">
                .git（独立コピー）
              </text>
              <text x="106" y="130" textAnchor="middle" fill="#ffffff" fontSize="11">
                履歴 A
              </text>
              <text x="106" y="148" textAnchor="middle" fill="#e3b341" fontSize="10">
                毎回手動で共通変更を反映
              </text>
              <text x="106" y="183" textAnchor="middle" fill="#ff7b72" fontSize="10">
                ↑ 4 つ全部に繰り返す必要あり
              </text>

              {/* repo: gemini */}
              <rect
                x="208"
                y="64"
                width="172"
                height="130"
                rx="5"
                fill="#10101e"
                stroke="#79b8ff"
                strokeWidth="1.5"
              />
              <text
                x="294"
                y="86"
                textAnchor="middle"
                fill="#79b8ff"
                fontSize="13"
                fontWeight="700"
              >
                docs-gemini/
              </text>
              <rect
                x="221"
                y="93"
                width="146"
                height="22"
                rx="3"
                fill="#18182a"
                stroke="#79b8ff"
                strokeWidth="1"
              />
              <text x="294" y="108" textAnchor="middle" fill="#ff7b72" fontSize="12">
                .git（独立コピー）
              </text>
              <text x="294" y="130" textAnchor="middle" fill="#ffffff" fontSize="11">
                履歴 B（clone後に乖離）
              </text>
              <text x="294" y="150" textAnchor="middle" fill="#cdd9e5" fontSize="10">
                履歴が diverged
              </text>

              {/* repo: codex */}
              <rect
                x="20"
                y="210"
                width="172"
                height="130"
                rx="5"
                fill="#0f1e10"
                stroke="#56d364"
                strokeWidth="1.5"
              />
              <text
                x="106"
                y="232"
                textAnchor="middle"
                fill="#56d364"
                fontSize="13"
                fontWeight="700"
              >
                docs-codex/
              </text>
              <rect
                x="33"
                y="239"
                width="146"
                height="22"
                rx="3"
                fill="#152015"
                stroke="#56d364"
                strokeWidth="1"
              />
              <text x="106" y="254" textAnchor="middle" fill="#ff7b72" fontSize="12">
                .git（独立コピー）
              </text>
              <text x="106" y="276" textAnchor="middle" fill="#ffffff" fontSize="11">
                履歴 C（diverged）
              </text>

              {/* repo: copilot */}
              <rect
                x="208"
                y="210"
                width="172"
                height="130"
                rx="5"
                fill="#160f1c"
                stroke="#e2a8ff"
                strokeWidth="1.5"
              />
              <text
                x="294"
                y="232"
                textAnchor="middle"
                fill="#e2a8ff"
                fontSize="13"
                fontWeight="700"
              >
                docs-copilot/
              </text>
              <rect
                x="221"
                y="239"
                width="146"
                height="22"
                rx="3"
                fill="#20152a"
                stroke="#e2a8ff"
                strokeWidth="1"
              />
              <text x="294" y="254" textAnchor="middle" fill="#ff7b72" fontSize="12">
                .git（独立コピー）
              </text>
              <text x="294" y="276" textAnchor="middle" fill="#ffffff" fontSize="11">
                履歴 D（diverged）
              </text>

              {/* 痛みの矢印 */}
              <path
                d="M192 128 Q204 155 208 128"
                fill="none"
                stroke="#ff7b72"
                strokeWidth="1.5"
                strokeDasharray="4,3"
                markerEnd="url(#arr-r)"
              />
              <path
                d="M106 194 Q204 210 294 210"
                fill="none"
                stroke="#ff7b72"
                strokeWidth="1.5"
                strokeDasharray="4,3"
                markerEnd="url(#arr-r)"
              />
              <text
                x="204"
                y="362"
                textAnchor="middle"
                fill="#ff7b72"
                fontSize="13"
                fontWeight="700"
              >
                😵 同期が地獄 — ディスク 4 倍消費
              </text>

              {/* ▌RIGHT PANEL: worktree × 4 ▐ */}
              <rect
                x="436"
                y="4"
                width="420"
                height="382"
                rx="8"
                fill="#0a160e"
                stroke="#56d364"
                strokeWidth="1.5"
              />
              <text
                x="646"
                y="32"
                textAnchor="middle"
                fill="#56d364"
                fontSize="14"
                fontWeight="700"
              >
                ✅ worktree × 4（推奨）
              </text>
              <text x="646" y="50" textAnchor="middle" fill="#cdd9e5" fontSize="11">
                .git は 1 つ共有 — 全ワークツリーが同じ履歴を参照
              </text>

              {/* 唯一の .git */}
              <rect
                x="454"
                y="62"
                width="384"
                height="48"
                rx="6"
                fill="#0d2a14"
                stroke="#56d364"
                strokeWidth="2.5"
              />
              <text
                x="646"
                y="83"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="14"
                fontWeight="700"
              >
                ai-docs/ ← .git（唯一・共有）
              </text>
              <text x="646" y="100" textAnchor="middle" fill="#56d364" fontSize="11">
                全 WT が同じコミット履歴を参照する
              </text>

              {/* shared/ */}
              <rect
                x="556"
                y="126"
                width="180"
                height="36"
                rx="4"
                fill="#202010"
                stroke="#e3b341"
                strokeWidth="1.5"
              />
              <text
                x="646"
                y="144"
                textAnchor="middle"
                fill="#e3b341"
                fontSize="13"
                fontWeight="700"
              >
                shared/
              </text>
              <text x="646" y="157" textAnchor="middle" fill="#ffffff" fontSize="10">
                共通リソース: common-header.js / .css（全 WT から参照）
              </text>

              {/* worktrees label */}
              <text x="646" y="184" textAnchor="middle" fill="#cdd9e5" fontSize="11">
                worktrees/ ← .gitignore 対象
              </text>

              {/* 4 cards */}
              <rect
                x="454"
                y="194"
                width="188"
                height="78"
                rx="5"
                fill="#241510"
                stroke="#ff9f6a"
                strokeWidth="2"
              />
              <text
                x="548"
                y="218"
                textAnchor="middle"
                fill="#ff9f6a"
                fontSize="13"
                fontWeight="700"
              >
                claude/
              </text>
              <text x="548" y="237" textAnchor="middle" fill="#ffffff" fontSize="11">
                feat/claude-docs
              </text>
              <text x="548" y="256" textAnchor="middle" fill="#ff9f6a" fontSize="10">
                ランチャー起動中 ▶
              </text>

              <rect
                x="650"
                y="194"
                width="188"
                height="78"
                rx="5"
                fill="#10101e"
                stroke="#79b8ff"
                strokeWidth="2"
              />
              <text
                x="744"
                y="218"
                textAnchor="middle"
                fill="#79b8ff"
                fontSize="13"
                fontWeight="700"
              >
                gemini/
              </text>
              <text x="744" y="237" textAnchor="middle" fill="#ffffff" fontSize="11">
                feat/gemini-docs
              </text>
              <text x="744" y="256" textAnchor="middle" fill="#79b8ff" fontSize="10">
                ランチャー起動中 ▶
              </text>

              <rect
                x="454"
                y="284"
                width="188"
                height="78"
                rx="5"
                fill="#0f1e10"
                stroke="#56d364"
                strokeWidth="2"
              />
              <text
                x="548"
                y="308"
                textAnchor="middle"
                fill="#56d364"
                fontSize="13"
                fontWeight="700"
              >
                codex/
              </text>
              <text x="548" y="327" textAnchor="middle" fill="#ffffff" fontSize="11">
                feat/codex-docs
              </text>
              <text x="548" y="346" textAnchor="middle" fill="#56d364" fontSize="10">
                ランチャー起動中 ▶
              </text>

              <rect
                x="650"
                y="284"
                width="188"
                height="78"
                rx="5"
                fill="#160f1c"
                stroke="#e2a8ff"
                strokeWidth="2"
              />
              <text
                x="744"
                y="308"
                textAnchor="middle"
                fill="#e2a8ff"
                fontSize="13"
                fontWeight="700"
              >
                copilot/
              </text>
              <text x="744" y="327" textAnchor="middle" fill="#ffffff" fontSize="11">
                feat/copilot-docs
              </text>
              <text x="744" y="346" textAnchor="middle" fill="#e2a8ff" fontSize="10">
                ランチャー起動中 ▶
              </text>

              {/* 接続線 */}
              <line
                x1="646"
                y1="110"
                x2="646"
                y2="126"
                stroke="#56d364"
                strokeWidth="2"
                markerEnd="url(#arr-g)"
              />
              <line
                x1="646"
                y1="162"
                x2="646"
                y2="183"
                stroke="#cdd9e5"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <line
                x1="646"
                y1="183"
                x2="548"
                y2="194"
                stroke="#ff9f6a"
                strokeWidth="1.5"
                markerEnd="url(#arr-cl)"
              />
              <line
                x1="646"
                y1="183"
                x2="744"
                y2="194"
                stroke="#79b8ff"
                strokeWidth="1.5"
                markerEnd="url(#arr-ge)"
              />
              <line
                x1="548"
                y1="183"
                x2="548"
                y2="284"
                stroke="#56d364"
                strokeWidth="1.5"
                markerEnd="url(#arr-g)"
              />
              <line
                x1="744"
                y1="183"
                x2="744"
                y2="284"
                stroke="#e2a8ff"
                strokeWidth="1.5"
                markerEnd="url(#arr-cp)"
              />
              <text
                x="646"
                y="380"
                textAnchor="middle"
                fill="#56d364"
                fontSize="13"
                fontWeight="700"
              >
                🚀 並列作業 · 履歴一元化 · ディスク節約
              </text>
            </svg>
          </div>

          <h3>clone × 4 との決定的な違い</h3>
          <table className={styles.tbl}>
            <thead>
              <tr>
                <th>観点</th>
                <th>git clone × 4</th>
                <th>git worktree × 4</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>.git の数</td>
                <td>4 つ（独立・完全コピー）</td>
                <td>
                  <strong>1 つ（共有）</strong>
                </td>
              </tr>
              <tr>
                <td>ディスク使用量</td>
                <td>全体の 4× 相当</td>
                <td>
                  <strong>追加分のみ（〜10% 増）</strong>
                </td>
              </tr>
              <tr>
                <td>共通変更の反映</td>
                <td>4 箇所に手動コピー必須</td>
                <td>
                  <strong>merge/rebase で即時反映</strong>
                </td>
              </tr>
              <tr>
                <td>ブランチ切替コスト</td>
                <td>不要（独立）</td>
                <td>
                  <strong>ゼロ（常時並列チェックアウト）</strong>
                </td>
              </tr>
              <tr>
                <td>stash 共有</td>
                <td>不可</td>
                <td>
                  <strong>可能（.git が共通）</strong>
                </td>
              </tr>
              <tr>
                <td>AI エージェント活用</td>
                <td>各ツールが別リポジトリ認識</td>
                <td>
                  <strong>全ツールが同一履歴を参照</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ══════════ STEP 01 ══════════ */}
        <section className={styles.step} id="s01">
          <div className={styles.stepHdr}>
            <div className={styles.stepN}>01</div>
            <div>
              <div className={styles.stepTitle}>リポジトリ初期設定とブランチ戦略</div>
              <div className={styles.stepDesc}>
                メインリポジトリの作成から 4 プラットフォーム用ブランチの設計まで。
              </div>
            </div>
          </div>

          <h3>ブランチ戦略（Git グラフ）</h3>
          <div className={styles.mmdBox}>
            <div className={styles.mmdLbl}>
              ▸ dev を源流として 4 プラットフォームのドキュメントブランチへ派生 — 共通リソース変更は
              merge で全 WT に同期
            </div>
            <MermaidDiagram
              chart={`%%{init: {'logLevel': 'error', 'gitGraph': {'rotateCommitLabel': false, 'mainBranchName': 'dev'}}}%%
gitGraph LR:
commit id: "chore: init"
commit id: "feat: shared/"
branch feat/claude-docs
checkout feat/claude-docs
commit id: "agent.html v1"
commit id: "skill.html v1"
checkout dev
branch feat/gemini-docs
checkout feat/gemini-docs
commit id: "agent.html v1"
commit id: "skill.html v1"
checkout dev
branch feat/codex-docs
checkout feat/codex-docs
commit id: "agent.html v1"
commit id: "skill.html v1"
checkout dev
branch feat/copilot-docs
checkout feat/copilot-docs
commit id: "agent.html v1"
checkout dev
commit id: "fix(shared): header"
checkout feat/claude-docs
merge dev id: "sync header"
checkout feat/gemini-docs
merge dev id: "sync header "`}
            />
          </div>

          <div className={styles.cb}>
            <div className={styles.cbHdr}>
              <span>Terminal — リポジトリ初期化</span>
              <span className={styles.cbTag}>bash</span>
            </div>
            <div className={styles.cbBody}>
              <span className={styles.syCm}>
                # ── リポジトリ作成 ────────────────────────────────────────────────
              </span>
              {"\n"}
              {"mkdir ai-docs && cd ai-docs\n"}
              {"git init\n"}
              {"git commit --allow-empty -m "}
              <span className={styles.sySt}>"chore: initial commit"</span>
              {"\n\n"}
              <span className={styles.syCm}>
                # ── 共通ディレクトリを dev に作成 ───────────────────────────────
              </span>
              {"\n"}
              {"mkdir -p shared/{components,styles,utils} docs scripts .github/workflows\n"}
              {"git add . && git commit -m "}
              <span className={styles.sySt}>"feat: add shared structure"</span>
              {"\n\n"}
              <span className={styles.syCm}>
                # ── 4 プラットフォーム用ブランチを作成 ──────────────────────────
              </span>
              {"\n"}
              {"git branch "}
              <span className={styles.syCl}>feat/claude-docs</span>
              {"\n"}
              {"git branch "}
              <span className={styles.syGe}>feat/gemini-docs</span>
              {"\n"}
              {"git branch "}
              <span className={styles.syCo}>feat/codex-docs</span>
              {"\n"}
              {"git branch "}
              <span className={styles.syCp}>feat/copilot-docs</span>
              {"\n\n"}
              {"git branch -a   "}
              <span className={styles.syCm}># 確認</span>
            </div>
          </div>

          <div className={styles.cb}>
            <div className={styles.cbHdr}>
              <span>.gitignore — 必須設定</span>
              <span className={styles.cbTag}>config</span>
            </div>
            <div className={styles.cbBody}>
              <span className={styles.syCm}>
                # git worktree のチェックアウト先を追跡対象から除外（必須）
              </span>
              {"\n"}
              <span className={styles.sySt}>{"worktrees/"}</span>
              {"\n"}
              <span className={styles.sySt}>{"node_modules/"}</span>
              {"\n"}
              <span className={styles.sySt}>{"*.log"}</span>
              {"\n"}
              <span className={styles.sySt}>{".DS_Store"}</span>
            </div>
          </div>

          <div className={`${styles.ib} ${styles.ibWarn}`}>
            <span>⚠️</span>
            <div>
              <strong>必須：</strong> <code>worktrees/</code> を<code>.gitignore</code>{" "}
              に追加しないと、git がワークツリー内の
              <code>.git</code> ファイルを「入れ子リポジトリ」として誤認識しエラーになります。
            </div>
          </div>
        </section>

        {/* ══════════ STEP 02 ══════════ */}
        <section className={styles.step} id="s02">
          <div className={styles.stepHdr}>
            <div className={styles.stepN}>02</div>
            <div>
              <div className={styles.stepTitle}>
                worktree の追加 — 4 プラットフォームを一括セットアップ
              </div>
              <div className={styles.stepDesc}>
                git worktree add コマンドでディレクトリを作成し各ブランチをチェックアウトする。
              </div>
            </div>
          </div>

          {/* Mermaid: セットアップフロー */}
          <div className={styles.mmdBox}>
            <div className={styles.mmdLbl}>▸ worktree セットアップフロー — コマンド実行順序</div>
            <MermaidDiagram
              chart={`flowchart TD
A([git init\\n空コミット]) --> B[shared/ 作成\\ngit commit]
B --> C{git branch × 4\\n4ブランチ作成}
C -->|claude| D1[git worktree add\\nworktrees/claude\\nfeat/claude-docs]
C -->|gemini| D2[git worktree add\\nworktrees/gemini\\nfeat/gemini-docs]
C -->|codex| D3[git worktree add\\nworktrees/codex\\nfeat/codex-docs]
C -->|copilot| D4[git worktree add\\nworktrees/copilot\\nfeat/copilot-docs]
D1 --> E1[cd worktrees/claude\\nclaude .]
D2 --> E2[cd worktrees/gemini\\nclaude .]
D3 --> E3[cd worktrees/codex\\nclaude .]
D4 --> E4[cd worktrees/copilot\\nclaude .]
style A fill:#21262d,stroke:#56d364,color:#ffffff
style B fill:#21262d,stroke:#444c56,color:#ffffff
style C fill:#1f2d14,stroke:#56d364,color:#ffffff
style D1 fill:#2a1a10,stroke:#ff9f6a,color:#ffffff
style D2 fill:#101828,stroke:#79b8ff,color:#ffffff
style D3 fill:#101e12,stroke:#56d364,color:#ffffff
style D4 fill:#1c1028,stroke:#e2a8ff,color:#ffffff
style E1 fill:#2a1a10,stroke:#ff9f6a,color:#ffffff
style E2 fill:#101828,stroke:#79b8ff,color:#ffffff
style E3 fill:#101e12,stroke:#56d364,color:#ffffff
style E4 fill:#1c1028,stroke:#e2a8ff,color:#ffffff`}
            />
          </div>

          <div className={styles.cb}>
            <div className={styles.cbHdr}>
              <span>Terminal</span>
              <span className={styles.cbTag}>bash</span>
            </div>
            <div className={styles.cbBody}>
              <span className={styles.syCm}>
                # シグネチャ: git worktree add &lt;チェックアウト先パス&gt; &lt;ブランチ名&gt;
              </span>
              {"\n"}
              {"git worktree add worktrees/"}
              <span className={styles.syCl}>claude</span>
              {"   "}
              <span className={styles.syCl}>feat/claude-docs</span>
              {"\n"}
              {"git worktree add worktrees/"}
              <span className={styles.syGe}>gemini</span>
              {"   "}
              <span className={styles.syGe}>feat/gemini-docs</span>
              {"\n"}
              {"git worktree add worktrees/"}
              <span className={styles.syCo}>codex</span>
              {"    "}
              <span className={styles.syCo}>feat/codex-docs</span>
              {"\n"}
              {"git worktree add worktrees/"}
              <span className={styles.syCp}>copilot</span>
              {"  "}
              <span className={styles.syCp}>feat/copilot-docs</span>
              {"\n\n"}
              <span className={styles.syCm}># 確認</span>
              {"\n"}
              {"git worktree list\n"}
              <span className={styles.syCm}>
                {
                  "# /home/user/ai-docs                    abc1234 [dev]\n# /home/user/ai-docs/worktrees/claude   def5678 [feat/claude-docs]\n# /home/user/ai-docs/worktrees/gemini   ghi9012 [feat/gemini-docs]\n# /home/user/ai-docs/worktrees/codex    jkl3456 [feat/codex-docs]\n# /home/user/ai-docs/worktrees/copilot  mno7890 [feat/copilot-docs]"
                }
              </span>
            </div>
          </div>

          <h3>セットアップ後のディレクトリ構造</h3>
          <div className={styles.svgBox}>
            <div className={styles.svgLbl}>
              ▸ ai-docs/ 全体のファイルツリー（セットアップ完了後）
            </div>
            <svg
              viewBox="0 0 780 440"
              xmlns="http://www.w3.org/2000/svg"
              fontFamily="IBM Plex Mono, Courier New, monospace"
              role="img"
              aria-label="ai-docs/ 全体のファイルツリー（セットアップ完了後）"
            >
              <title>ai-docs/ ディレクトリ構造</title>
              {/* root box */}
              <rect
                x="8"
                y="8"
                width="180"
                height="30"
                rx="5"
                fill="#0d2a14"
                stroke="#56d364"
                strokeWidth="2"
              />
              <text x="98" y="28" textAnchor="middle" fill="#56d364" fontSize="14" fontWeight="700">
                ai-docs/
              </text>
              <text x="198" y="28" fill="#cdd9e5" fontSize="11">
                ← dev ブランチ（メイン WT）
              </text>

              {/* vertical stem */}
              <line x1="36" y1="38" x2="36" y2="430" stroke="#444c56" strokeWidth="1.5" />

              {/* .git */}
              <line x1="36" y1="68" x2="66" y2="68" stroke="#444c56" strokeWidth="1.3" />
              <rect
                x="66"
                y="55"
                width="155"
                height="26"
                rx="4"
                fill="#0d2a14"
                stroke="#56d364"
                strokeWidth="2"
              />
              <text
                x="143"
                y="72"
                textAnchor="middle"
                fill="#56d364"
                fontSize="13"
                fontWeight="700"
              >
                .git/（共有・唯一）
              </text>
              <text x="230" y="72" fill="#ffffff" fontSize="11">
                ← 全 WT が参照
              </text>

              {/* .gitignore */}
              <line x1="36" y1="105" x2="66" y2="105" stroke="#444c56" strokeWidth="1.3" />
              <text x="70" y="109" fill="#ffffff" fontSize="13">
                .gitignore
              </text>
              <text x="195" y="109" fill="#e3b341" fontSize="11">
                ← worktrees/ を除外（必須）
              </text>

              {/* shared/ */}
              <line x1="36" y1="142" x2="66" y2="142" stroke="#444c56" strokeWidth="1.3" />
              <rect
                x="66"
                y="129"
                width="110"
                height="26"
                rx="4"
                fill="#202010"
                stroke="#e3b341"
                strokeWidth="1.5"
              />
              <text
                x="121"
                y="146"
                textAnchor="middle"
                fill="#e3b341"
                fontSize="13"
                fontWeight="700"
              >
                shared/
              </text>
              <text x="185" y="146" fill="#ffffff" fontSize="11">
                ← 共通リソース: common-header.js / .css（全 WT が参照）
              </text>

              {/* scripts/ */}
              <line x1="36" y1="180" x2="66" y2="180" stroke="#444c56" strokeWidth="1.3" />
              <text x="70" y="184" fill="#ffffff" fontSize="13">
                scripts/
              </text>
              <line x1="84" y1="189" x2="84" y2="210" stroke="#444c56" strokeWidth="1.1" />
              <line x1="84" y1="200" x2="110" y2="200" stroke="#444c56" strokeWidth="1.1" />
              <text x="114" y="204" fill="#56d364" fontSize="12">
                setup-worktrees.sh
              </text>
              <line x1="84" y1="210" x2="110" y2="213" stroke="#444c56" strokeWidth="1.1" />
              <text x="114" y="217" fill="#56d364" fontSize="12">
                sync-all.sh
              </text>

              {/* worktrees/ label */}
              <line x1="36" y1="250" x2="66" y2="250" stroke="#444c56" strokeWidth="1.3" />
              <rect
                x="66"
                y="237"
                width="120"
                height="26"
                rx="4"
                fill="#1c2230"
                stroke="#444c56"
                strokeWidth="1"
              />
              <text x="126" y="254" textAnchor="middle" fill="#cdd9e5" fontSize="12">
                worktrees/
              </text>
              <text x="196" y="254" fill="#cdd9e5" fontSize="11">
                ← .gitignore 対象
              </text>

              {/* sub-stem for worktrees */}
              <line x1="84" y1="263" x2="84" y2="420" stroke="#444c56" strokeWidth="1.1" />

              {/* claude/ */}
              <line x1="84" y1="284" x2="114" y2="284" stroke="#444c56" strokeWidth="1" />
              <rect
                x="114"
                y="273"
                width="90"
                height="22"
                rx="3"
                fill="#241510"
                stroke="#ff9f6a"
                strokeWidth="1.8"
              />
              <text
                x="159"
                y="288"
                textAnchor="middle"
                fill="#ff9f6a"
                fontSize="12"
                fontWeight="700"
              >
                claude/
              </text>
              <text x="213" y="288" fill="#ffffff" fontSize="11">
                feat/claude-docs / CLAUDE.md
              </text>

              {/* gemini/ */}
              <line x1="84" y1="322" x2="114" y2="322" stroke="#444c56" strokeWidth="1" />
              <rect
                x="114"
                y="311"
                width="90"
                height="22"
                rx="3"
                fill="#10101e"
                stroke="#79b8ff"
                strokeWidth="1.8"
              />
              <text
                x="159"
                y="326"
                textAnchor="middle"
                fill="#79b8ff"
                fontSize="12"
                fontWeight="700"
              >
                gemini/
              </text>
              <text x="213" y="326" fill="#ffffff" fontSize="11">
                feat/gemini-docs / GEMINI.md
              </text>

              {/* codex/ */}
              <line x1="84" y1="360" x2="114" y2="360" stroke="#444c56" strokeWidth="1" />
              <rect
                x="114"
                y="349"
                width="90"
                height="22"
                rx="3"
                fill="#0f1e10"
                stroke="#56d364"
                strokeWidth="1.8"
              />
              <text
                x="159"
                y="364"
                textAnchor="middle"
                fill="#56d364"
                fontSize="12"
                fontWeight="700"
              >
                codex/
              </text>
              <text x="213" y="364" fill="#ffffff" fontSize="11">
                feat/codex-docs / AGENTS.md
              </text>

              {/* copilot/ */}
              <line x1="84" y1="398" x2="114" y2="398" stroke="#444c56" strokeWidth="1" />
              <rect
                x="114"
                y="387"
                width="90"
                height="22"
                rx="3"
                fill="#160f1c"
                stroke="#e2a8ff"
                strokeWidth="1.8"
              />
              <text
                x="159"
                y="402"
                textAnchor="middle"
                fill="#e2a8ff"
                fontSize="12"
                fontWeight="700"
              >
                copilot/
              </text>
              <text x="213" y="402" fill="#ffffff" fontSize="11">
                feat/copilot-docs / .github/copilot-instructions.md
              </text>
            </svg>
          </div>

          <div className={styles.cb}>
            <div className={styles.cbHdr}>
              <span>scripts/setup-worktrees.sh — 一括セットアップ</span>
              <span className={styles.cbTag}>bash</span>
            </div>
            <div className={styles.cbBody}>
              <span className={styles.syKw}>#!/bin/bash</span>
              {"\n"}
              {"set -euo pipefail\n\n"}
              {"PLATFORMS_KEYS=("}
              <span className={styles.syCl}>claude</span>{" "}
              <span className={styles.syGe}>gemini</span> <span className={styles.syCo}>codex</span>{" "}
              <span className={styles.syCp}>copilot</span>
              {")\n"}
              {"PLATFORMS_VALUES=("}
              <span className={styles.syCl}>feat/claude-docs</span>{" "}
              <span className={styles.syGe}>feat/gemini-docs</span>{" "}
              <span className={styles.syCo}>feat/codex-docs</span>{" "}
              <span className={styles.syCp}>feat/copilot-docs</span>
              {")\n\n"}
              {"mkdir -p worktrees\n\n"}
              {
                // biome-ignore lint/suspicious/noTemplateCurlyInString: bash associative array syntax
                'for i in "${!PLATFORMS_KEYS[@]}"; do\n'
              }
              {
                // biome-ignore lint/suspicious/noTemplateCurlyInString: bash array variable syntax
                '  PLATFORM="${PLATFORMS_KEYS[$i]}"\n'
              }
              {
                // biome-ignore lint/suspicious/noTemplateCurlyInString: bash array variable syntax
                '  BRANCH="${PLATFORMS_VALUES[$i]}"\n'
              }
              {'  TARGET="worktrees/$PLATFORM"\n\n'}
              {'  [ -d "$TARGET" ] && { echo "⏭  $PLATFORM: skip"; continue; }\n\n'}
              {'  git show-ref --verify --quiet "refs/heads/$BRANCH" ||\\\n'}
              {'    git branch "$BRANCH" dev\n\n'}
              {'  git worktree add "$TARGET" "$BRANCH"\n'}
              {'  echo "'}
              <span className={styles.syOk}>✓</span>
              {'  $PLATFORM → $TARGET ($BRANCH)"\n'}
              {"done\n\n"}
              {"git worktree list"}
            </div>
          </div>

          <h3>ドキュメント構造とファイル配置</h3>
          <div className={styles.plg}>
            <div className={styles.plc}>
              <div className={styles.plh}>
                <div className={styles.pld} style={{ background: "var(--cl)" }} />
                Claude / worktrees/claude/
              </div>
              <div className={styles.pli}>
                <code>claude/agent.html</code> — エージェント最適化ガイド
              </div>
              <div className={styles.pli}>
                <code>claude/skill.html</code> — スキル展開ガイド
              </div>
              <div className={styles.pli}>
                共通: <code>../shared/common-header.js</code>
              </div>
              <div className={styles.pli}>
                共通: <code>../shared/common-header.css</code>
              </div>
            </div>
            <div className={styles.plc}>
              <div className={styles.plh}>
                <div className={styles.pld} style={{ background: "var(--ge)" }} />
                Gemini / worktrees/gemini/
              </div>
              <div className={styles.pli}>
                <code>gemini/agent.html</code> — エージェント最適化ガイド
              </div>
              <div className={styles.pli}>
                <code>gemini/skill.html</code> — スキル展開ガイド
              </div>
              <div className={styles.pli}>
                共通: <code>../shared/common-header.js</code>
              </div>
              <div className={styles.pli}>
                共通: <code>../shared/common-header.css</code>
              </div>
            </div>
            <div className={styles.plc}>
              <div className={styles.plh}>
                <div className={styles.pld} style={{ background: "var(--co)" }} />
                Codex / worktrees/codex/
              </div>
              <div className={styles.pli}>
                <code>codex/agent.html</code> — エージェント最適化ガイド
              </div>
              <div className={styles.pli}>
                <code>codex/skill.html</code> — スキル展開ガイド
              </div>
              <div className={styles.pli}>
                共通: <code>../shared/common-header.js</code>
              </div>
              <div className={styles.pli}>
                共通: <code>../shared/common-header.css</code>
              </div>
            </div>
            <div className={styles.plc}>
              <div className={styles.plh}>
                <div className={styles.pld} style={{ background: "var(--cp)" }} />
                Copilot / worktrees/copilot/
              </div>
              <div className={styles.pli}>
                <code>copilot/agent.html</code> — エージェント最適化ガイド
              </div>
              <div className={styles.pli}>
                <code>copilot/skill.html</code> — スキル展開ガイド
              </div>
              <div className={styles.pli}>
                共通: <code>../shared/common-header.js</code>
              </div>
              <div className={styles.pli}>
                共通: <code>../shared/common-header.css</code>
              </div>
            </div>
          </div>

          <div className={`${styles.ib} ${styles.ibOk}`}>
            <span>✅</span>
            <div>
              <strong>WebSearch 活用:</strong> 各 WT で AI ツールを起動し、
              <code>WebSearch</code> で最新情報（API
              変更、新機能、ベストプラクティス等）を調査しながら agent.html と skill.html
              を更新します。Claude Code は <code>/search</code> コマンド、 Antigravity
              は組み込み検索でそれぞれ最新情報を取得できます。
            </div>
          </div>
        </section>

        {/* ══════════ STEP 03 ══════════ */}
        <section className={styles.step} id="s03">
          <div className={styles.stepHdr}>
            <div className={styles.stepN}>03</div>
            <div>
              <div className={styles.stepTitle}>日常の並列開発ワークフロー</div>
              <div className={styles.stepDesc}>
                4つのworktreeを使ったドキュメント更新の実践的な手順。
              </div>
            </div>
          </div>
          {/* faithful content — s03 移植時に実装 */}
        </section>

        {/* ══════════ STEP 04 ══════════ */}
        <section className={styles.step} id="s04">
          <div className={styles.stepHdr}>
            <div className={styles.stepN}>04</div>
            <div>
              <div className={styles.stepTitle}>メリット・デメリット — 導入判断の材料</div>
              <div className={styles.stepDesc}>
                git worktree を採用する前に知っておくべき利点と制約。
              </div>
            </div>
          </div>
          {/* faithful content — s04 移植時に実装 */}
        </section>

        {/* ══════════ STEP 05 ══════════ */}
        <section className={styles.step} id="s05">
          <div className={styles.stepHdr}>
            <div className={styles.stepN}>05</div>
            <div>
              <div className={styles.stepTitle}>導入時の注意点 — 絶対に守る 7 つのルール</div>
              <div className={styles.stepDesc}>
                worktree 運用で失敗しないための必須ルールと落とし穴。
              </div>
            </div>
          </div>
          {/* faithful content — s05 移植時に実装 */}
        </section>

        {/* ══════════ STEP 06 ══════════ */}
        <section className={styles.step} id="s06">
          <div className={styles.stepHdr}>
            <div className={styles.stepN}>06</div>
            <div>
              <div className={styles.stepTitle}>
                GitHub Actions との統合 — 4 プラットフォームの並列 CI
              </div>
              <div className={styles.stepDesc}>
                matrix strategy を使って4プラットフォームのCIを並列実行する設定。
              </div>
            </div>
          </div>
          {/* faithful content — s06 移植時に実装 */}
        </section>

        {/* ══════════ REFERENCES ══════════ */}
        <section className={styles.step} id="ref">
          <div className={styles.stepHdr}>
            <div className={styles.stepN}>参考</div>
            <div>
              <div className={styles.stepTitle}>参考リンク集</div>
              <div className={styles.stepDesc}>
                各ステップで使用する公式ドキュメントと関連リソース。
              </div>
            </div>
          </div>
          <div className={`${styles.ib} ${styles.ibInfo}`}>
            <span>ℹ️</span>
            <div>
              <strong>方針:</strong> 各ベンダー公式ドキュメントを最上位に記載し、 補足情報は「公式
              GitHub リポジトリ」または「公式ブログ」のみを採用。
              非公式サイト・コミュニティサイトは除外。
            </div>
          </div>
          <h3>STEP 00: git worktree とは何か</h3>
          <div className={styles.stepSubsection}>
            <h4>Git 公式（最優先）</h4>
            <ul>
              <li>
                <Ext href="https://git-scm.com/docs/git-worktree">
                  git-worktree — Git 公式リファレンス
                </Ext>
              </li>
            </ul>
          </div>
          {/* faithful content（残りのリンク） — ref 移植時に実装 */}
        </section>
      </div>
    </div>
  );
}
