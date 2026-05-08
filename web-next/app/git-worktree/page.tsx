import type { Metadata } from "next";
import styles from "./page.module.css";

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
          {/* faithful content — s00 移植時に実装 */}
        </section>

        {/* ══════════ STEP 01 ══════════ */}
        <section className={styles.step} id="s01">
          <div className={styles.stepHdr}>
            <div className={styles.stepN}>01</div>
            <div>
              <div className={styles.stepTitle}>リポジトリ初期設定とブランチ戦略</div>
              <div className={styles.stepDesc}>
                メインリポジトリのクローンと、4プラットフォーム用ブランチの設計方針。
              </div>
            </div>
          </div>
          {/* faithful content — s01 移植時に実装 */}
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
                git worktree add コマンドで4つのブランチを同時チェックアウトする手順。
              </div>
            </div>
          </div>
          {/* faithful content — s02 移植時に実装 */}
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
