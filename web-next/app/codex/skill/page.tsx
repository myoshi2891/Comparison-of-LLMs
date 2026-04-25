import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "OpenAI Codex — AI仕様駆動開発 マークダウンファイル完全ガイド",
  description:
    "AGENTS.md / SKILL.md / .prompt.md / REQUIREMENTS.md / AGENT_TASKS.md — OpenAI Codex の AI 仕様駆動開発を支える全マークダウンファイルの役割・構造・ベストプラクティスを公式根拠付きで解説。",
};

// 外部ソース (sources セクション) の定義。Phase F で redirect 一覧を作る際にも参照する。
type Source = { num: string; href: string; title: string; desc: string };

const SOURCES: Source[] = [
  {
    num: "[1]",
    href: "https://developers.openai.com/codex/guides/agents-md/",
    title: "Custom instructions with AGENTS.md — OpenAI Developer Documentation (公式)",
    desc: "AGENTS.md読み込み優先度チェーン・32KiB上限・project_doc_fallback_filenames・AGENTS.override.mdの完全仕様",
  },
  {
    num: "[2]",
    href: "https://openai.com/index/introducing-codex/",
    title: "Introducing Codex — OpenAI Blog (May 2025)",
    desc: "codex-1（o3ベース）の初期仕様・AGENTS.md公式サポート発表・SWE-Bench 72.1%スコアはいずれも2025年5月時点での報告。codex-1システムメッセージ公開。",
  },
  {
    num: "[3]",
    href: "https://developers.openai.com/codex/skills/",
    title: "Agent Skills — OpenAI Developer Documentation (公式)",
    desc: "SKILL.md完全仕様・Progressive Disclosure設計思想・スキルスコープ4段階・agents/openai.yaml・$skill-installerの使い方",
  },
  {
    num: "[4]",
    href: "https://developers.openai.com/codex/changelog/",
    title: "Codex Changelog — OpenAI Developer Documentation (公式)",
    desc: "Skills正式リリース詳細・スキルディレクトリ構造（SKILL.md/scripts/references/assets）・マルチエージェントconfig",
  },
  {
    num: "[5]",
    href: "https://developers.openai.com/codex/guides/agents-sdk/",
    title: "Use Codex with the Agents SDK — OpenAI Developer Documentation (公式)",
    desc: "マルチエージェントSDDパターン・REQUIREMENTS.md/AGENT_TASKS.md/TEST.mdの生成順序・ゲート条件付きハンドオフ・Codex MCP統合",
  },
  {
    num: "[6]",
    href: "https://developers.openai.com/codex/cloud",
    title: "Codex Cloud — OpenAI Developer Documentation (公式)",
    desc: "Cloud Codex（ChatGPT統合）の機能・GitHub連携・並列タスク実行・PR自動生成",
  },
  {
    num: "[7]",
    href: "https://developers.openai.com/cookbook/examples/skills_in_api",
    title: "Skills in OpenAI API — OpenAI Cookbook (Feb 2026)",
    desc: "SKILL.mdフロントマター仕様・バージョン管理・Instruction-only/Tool Use/All-in-Oneパターン・ルーティング精度改善tips",
  },
  {
    num: "[8]",
    href: "https://agents.md/",
    title: "AGENTS.md Open Standard — agents.md (Agentic AI Foundation)",
    desc: "Linux Foundation傘下のAGENTS.mdオープン標準化・Codex/Cursor/Jules/Amp/Factory採用・40,000+プロジェクト利用",
  },
  {
    num: "[9]",
    href: "https://developers.openai.com/blog/openai-for-developers-2025/",
    title: "OpenAI for Developers in 2025 — OpenAI Developer Blog",
    desc: "AGENTS.mdオープン標準化の経緯・Agents SDK・AgentKit・2025年の主要な変遷・GPT-5.2-Codex（初期Cloud Codexモデル）",
  },
  {
    num: "[10]",
    href: "https://layer5.io/blog/ai/agentsmd-one-file-to-guide-them-all/",
    title: "AGENTS.md: One File to Guide Them All — Layer5 Blog",
    desc: "AGENTS.md vs .prompt.md の使い分け・Claude CodeへのAGENTS.mdインポート方法・ツール乗り換え問題の解決策",
  },
  {
    num: "[11]",
    href: "https://www.datacamp.com/tutorial/openai-codex",
    title: "OpenAI's Codex: A Guide With 3 Practical Examples — DataCamp (May 2025)",
    desc: "AGENTS.md実践サンプル（Code Style/Testing/PR Instructions）・Cloud Codexセットアップ手順",
  },
  {
    num: "[12]",
    href: "https://github.com/openai/skills",
    title: "openai/skills — GitHub (公式スキルカタログ)",
    desc: "公式スキルカタログ・create-plan/git/linear等のサンプルスキル・$skill-installerによるインストール手順",
  },
  {
    num: "[13]",
    href: "https://community.openai.com/t/agents-md-file-optimization/1369152",
    title: "AGENTS.md File Optimization — OpenAI Developer Community (Dec 2025)",
    desc: "コミュニティのAGENTS.md最適化事例・シンプルさの重要性・実際のファイル例",
  },
  {
    num: "[14]",
    href: "https://community.openai.com/t/skills-for-codex-experimental-support-starting-today/1369367",
    title:
      "Skills for Codex: Experimental support starting today — OpenAI Developer Community (Dec 2025)",
    desc: "Codexスキル機能の実験的リリース発表・コミュニティ実装例",
  },
  {
    num: "[15]",
    href: "https://agentsmd.net/",
    title: "Agents.md Guide for OpenAI Codex — agentsmd.net",
    desc: "AGENTS.mdのコードスタイル・テスト・PR手順・プロジェクト構造の記述ベストプラクティス",
  },
  {
    num: "[16]",
    href: "https://blog.fsck.com/2025/10/27/skills-for-openai-codex/",
    title: "Porting Skills (and Superpowers) to OpenAI Codex — blog.fsck.com (Oct 2025)",
    desc: "SKILL.mdのオープン規格（Claude Code/Antigravity/Codex共通）・スキルを「フランチャイズのバインダー」と比喩した設計思想",
  },
  {
    num: "[17]",
    href: "https://openai.com/index/introducing-gpt-5-3-codex/",
    title: "Introducing GPT-5.3-Codex — OpenAI Blog (2026)",
    desc: "GPT-5.3-Codexの仕様（GPT-5.2-Codex比25%高速・SWE-Bench Pro SoTA）・GPT-5.3-Codex-Spark（1000+ tokens/sec）・GPT-5.4との統合経緯",
  },
];

// Section 05 拡充にあたり参照した追加文献 ([18]〜[23])。
// legacy HTML では [17] と [18] の間に区切り行を挿入していた構造を再現する。
const SOURCES_SKILL_ADDITIONAL: Source[] = [
  {
    num: "[18]",
    href: "https://developers.openai.com/codex/skills/",
    title: "Agent Skills — OpenAI Developer Documentation (公式・最新)",
    desc: "SKILL.md フロントマター仕様（name/description フィールド）・Progressive Disclosure 設計思想・スキルスコープ4段階（system/user/repository/admin）・$skill-installer の使い方・openai.yaml UIメタデータの完全仕様",
  },
  {
    num: "[19]",
    href: "https://developers.openai.com/cookbook/examples/skills_in_api",
    title: "Skills in OpenAI API — OpenAI Cookbook (Feb 2026)",
    desc: "SKILL.md フロントマター仕様の詳細・バージョン管理・Instruction-only / Tool Use / All-in-One パターンの実装例・ルーティング精度改善tips・「Use when / Do NOT use when」の必要性",
  },
  {
    num: "[20]",
    href: "https://developers.openai.com/codex/changelog/",
    title: "Codex Changelog — OpenAI Developer Documentation (公式)",
    desc: "Skills 正式リリース詳細・スキルディレクトリ構造（SKILL.md/scripts/references/assets）の変遷・マルチエージェント config との統合",
  },
  {
    num: "[21]",
    href: "https://github.com/openai/skills",
    title: "openai/skills — GitHub 公式スキルカタログ（詳細）",
    desc: "create-plan / git / linear / add-tests 等の実践的サンプルスキル全文・SKILL.md の実際の書き方・$skill-installer コマンドリファレンス・コミュニティへの貢献方法",
  },
  {
    num: "[22]",
    href: "https://community.openai.com/t/skills-for-codex-experimental-support-starting-today/1369367",
    title:
      "Skills for Codex: Experimental support starting today — OpenAI Developer Community (Dec 2025)",
    desc: "Codex スキル機能の実験的リリース発表・暗黙的・明示的呼び出しの挙動・$ショートカット名の使い方・コミュニティ実装例と開発者フィードバック",
  },
  {
    num: "[23]",
    href: "https://blog.fsck.com/2025/10/27/skills-for-openai-codex/",
    title: "Porting Skills (and Superpowers) to OpenAI Codex — blog.fsck.com (Oct 2025)",
    desc: "SKILL.md のオープン規格（Claude Code/Antigravity/Codex 共通）・スキルを「フランチャイズのバインダー」と比喩した設計思想・3プラットフォーム間の移植方法・Few-shot examples の効果",
  },
];

export default function CodexSkillPage() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.hdrBg} />
        <div className={styles.hdrEyebrow}>OpenAI Codex × codex-1 (o3-based)</div>
        <h1>
          AI仕様駆動開発における
          <br />
          <span className={styles.oaiText}>マークダウンファイル</span>
          <br />
          完全ガイド
        </h1>
        <p className={styles.hdrSub}>
          AGENTS.md / SKILL.md / .prompt.md / REQUIREMENTS.md / AGENT_TASKS.md ——
          <br />
          Codexの全マークダウンファイルの役割・構造・ベストプラクティスを根拠ソース付きで徹底解説
        </p>
        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${styles.bOai}`}>OpenAI Codex</span>
          <span className={`${styles.badge} ${styles.bBlue}`}>codex-1 (o3)</span>
          <span className={`${styles.badge} ${styles.bPurple}`}>AGENTS.md オープン標準</span>
          <span className={`${styles.badge} ${styles.bAmber}`}>SKILL.md 共通規格</span>
          <span className={`${styles.badge} ${styles.bRose}`}>Agents SDK Multi-Agent</span>
        </div>
      </header>

      <main className={styles.main}>
        {/* TOC */}
        <nav className={styles.toc} aria-label="目次">
          <div className={styles.tocLbl}>目次</div>
          <ol>
            <li>
              <a href="#overview">OpenAI Codexとは — Cloud版 vs CLI版 vs Agents SDK</a>
            </li>
            <li>
              <a href="#directory">全体ファイル構成とディレクトリ</a>
            </li>
            <li>
              <a href="#agents-md">AGENTS.md — プロジェクト永続メモリ（オープン標準）</a>
            </li>
            <li>
              <a href="#agents-override">AGENTS.override.md — 一時的スコープ上書き</a>
            </li>
            <li>
              <a href="#skill-md">SKILL.md — Progressive Disclosure ナレッジ</a>
            </li>
            <li>
              <a href="#prompt-md">.prompt.md — 再利用タスクプロンプト</a>
            </li>
            <li>
              <a href="#sdd-files">SDD仕様書群 (REQUIREMENTS / AGENT_TASKS / TEST / design_spec)</a>
            </li>
            <li>
              <a href="#config">config.toml — Codex設定ファイル</a>
            </li>
            <li>
              <a href="#openai-yaml">agents/openai.yaml — スキルUIメタデータ</a>
            </li>
            <li>
              <a href="#multi-agent">Multi-Agent SDD パターン（Agents SDK）</a>
            </li>
            <li>
              <a href="#best-practices">横断ベストプラクティス10則</a>
            </li>
            <li>
              <a href="#sources">参考ソース一覧</a>
            </li>
          </ol>
        </nav>

        {/* SECTION 1: OVERVIEW */}
        <section id="overview" className={styles.section}>
          <div className={styles.secLabel}>Section 01</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>01.</span>OpenAI Codexとは — Cloud版 vs CLI版 vs Agents SDK
          </h2>

          <p>
            OpenAI Codexは2025年5月にリリースされた
            <strong className={styles.strongBright}>
              クラウドベースのソフトウェアエンジニアリングエージェント
            </strong>
            です。かつての「コード補完モデル」とは全く別物で、2026年2月に
            <code>GPT-5.3-Codex</code>
            （GPT-5.2-Codex比25%高速、SWE-Bench ProでSoTA）が導入され、現行の推奨モデルは
            <code>GPT-5.4</code>
            です。GitHubリポジトリを自律的に操作・PR提案まで行います。
          </p>

          <div className={styles.g3}>
            <div className={styles.mc}>
              <div className={`${styles.mcTag} ${styles.mcTagOai}`}>☁️ Cloud Codex</div>
              <p>
                専用<strong>Codex App</strong>
                （Web・デスクトップ、2026年3月Windows版リリース）から利用。クラウドサンドボックスでタスクを並列実行。GitHub連携でPRを自動作成。ChatGPTサイドバーからも引き続き利用可。
              </p>
            </div>
            <div className={styles.mc}>
              <div className={`${styles.mcTag} ${styles.mcTagBlue}`}>💻 Codex CLI</div>
              <p>
                ターミナルで動作するオープンソースエージェント（
                <code>npm install @openai/codex</code>
                ）。ローカルリポジトリを直接操作。TUI（テキストUI）とHeadlessモードを持つ。デフォルトの
                <code>service_tier</code> は <code>flex</code>（標準モード）。
                <strong>Fast modeはオプトイン</strong>で、セッション内の <code>/fast</code>
                コマンドで明示的に有効化する（GPT-5.4で利用可能、約1.5倍速だがクレジット消費約2倍）。音声入力（スペースキー長押しで録音・文字起こし）対応。
              </p>
            </div>
            <div className={styles.mc}>
              <div className={`${styles.mcTag} ${styles.mcTagPurple}`}>🤖 Agents SDK</div>
              <p>
                Python/TypeScriptでマルチエージェントパイプラインを構築するSDK。Codex MCP経由でCodex
                CLIをサブエージェントとして呼び出す。並列SDD実装を実現。
              </p>
            </div>
          </div>

          <table className={styles.table}>
            <tbody>
              <tr>
                <th>特性</th>
                <th>OpenAI Codex</th>
                <th>Claude Code</th>
                <th>Google Antigravity</th>
              </tr>
              <tr>
                <td>永続メモリ</td>
                <td>AGENTS.md（オープン標準）</td>
                <td>CLAUDE.md（独自）</td>
                <td>GEMINI.md + Rules</td>
              </tr>
              <tr>
                <td>ナレッジ拡張</td>
                <td>SKILL.md（共通規格）</td>
                <td>SKILL.md（共通規格）</td>
                <td>SKILL.md（共通規格）</td>
              </tr>
              <tr>
                <td>タスクプロンプト</td>
                <td>.prompt.md</td>
                <td>Custom Commands (.md)</td>
                <td>Workflows (.md)</td>
              </tr>
              <tr>
                <td>SDD専用ファイル</td>
                <td>REQUIREMENTS.md / AGENT_TASKS.md / TEST.md</td>
                <td>tasks.md（慣習）</td>
                <td>tasks.md + Artifacts</td>
              </tr>
              <tr>
                <td>設定ファイル</td>
                <td>~/.codex/config.toml</td>
                <td>なし</td>
                <td>.agent/rules/ + TOML</td>
              </tr>
              <tr>
                <td>エコシステム</td>
                <td>AAIF（Linux Foundation）</td>
                <td>Anthropic独自</td>
                <td>Google独自</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.stdBanner}>
            <div className={styles.stdIcon}>🌐</div>
            <div>
              <div className={styles.stdTitle}>
                AGENTS.md は Linux Foundation 傘下のオープン標準
              </div>
              <div className={styles.stdDesc}>
                AGENTS.mdはOpenAIが発案し、2025年にAgentic AI Foundation（AAIF）がLinux
                Foundationの傘下で管理する
                <strong>業界横断オープン標準</strong>
                となりました。Codex・Cursor・Google Jules・Amp・Factoryなどが採用し、
                <strong>40,000以上のオープンソースプロジェクト</strong>
                で使用されています。「ツール固有のCLAUDE.mdやGEMINI.mdを書き分ける」問題を解消し、1ファイルで全エージェントに対応します。
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: DIRECTORY */}
        <section id="directory" className={styles.section}>
          <div className={styles.secLabel}>Section 02</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>02.</span>全体ファイル構成とディレクトリ
          </h2>

          <div className={styles.flowWrap}>
            <div className={styles.flowLbl}>▸ Codex SDD 5フェーズフロー</div>
            <div className={styles.flow}>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fOai}`}>
                  Phase 1<br />
                  仕様策定
                </div>
                <div className={styles.ffile}>
                  REQUIREMENTS.md
                  <br />
                  design_spec.md
                </div>
              </div>
              <div className={styles.farr}>→</div>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fBlue}`}>
                  Phase 2<br />
                  タスク分解
                </div>
                <div className={styles.ffile}>
                  AGENT_TASKS.md
                  <br />
                  TEST.md
                </div>
              </div>
              <div className={styles.farr}>→</div>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fPurp}`}>
                  Phase 3<br />
                  Codex実行
                </div>
                <div className={styles.ffile}>
                  AGENTS.md
                  <br />
                  SKILL.md
                </div>
              </div>
              <div className={styles.farr}>→</div>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fAmb}`}>
                  Phase 4<br />
                  検証
                </div>
                <div className={styles.ffile}>
                  TEST_PLAN.md
                  <br />
                  test.sh
                </div>
              </div>
              <div className={styles.farr}>→</div>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fRose}`}>
                  Phase 5<br />
                  PR生成
                </div>
                <div className={styles.ffile}>
                  AGENTS.md
                  <br />
                  (PR instructions)
                </div>
              </div>
            </div>
          </div>

          <h3>推奨ディレクトリ構成（全体）</h3>
          <div className={styles.tree}>
            <div className={styles.t0}>
              <span className={styles.tf}>📁</span> <span>your-project/</span>
            </div>

            <div className={`${styles.t0} ${styles.t1}`}>
              <span className={styles.tb}>📄</span> <span className={styles.tb}>AGENTS.md</span>
              <span className={styles.td}>— プロジェクト永続メモリ（最重要・git管理）</span>
            </div>
            <div className={`${styles.t0} ${styles.t1}`}>
              <span className={styles.tp}>📄</span>{" "}
              <span className={styles.tp}>AGENTS.override.md</span>
              <span className={styles.td}>— 一時的グローバル上書き（gitignore推奨）</span>
            </div>

            <div className={`${styles.t0} ${styles.t1}`}>
              <span className={styles.tf}>📁</span> <span>.agents/</span>
              <span className={styles.td}>— Codex スキルルート</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tf}>📁</span> <span>skills/</span>
            </div>
            <div className={`${styles.t0} ${styles.t3}`}>
              <span className={styles.tf}>📁</span> <span>db-migration/</span>
            </div>
            <div className={`${styles.t0} ${styles.t4}`}>
              <span className={styles.tg}>📄</span> <span className={styles.tg}>SKILL.md</span>
              <span className={styles.td}>— スキル定義（必須）</span>
            </div>
            <div className={`${styles.t0} ${styles.t4}`}>
              <span className={styles.tf}>📁</span> <span>scripts/</span>
              <span className={styles.td}>— 実行スクリプト（任意）</span>
            </div>
            <div className={`${styles.t0} ${styles.t4}`}>
              <span className={styles.tf}>📁</span> <span>references/</span>
              <span className={styles.td}>— 参考ドキュメント（任意）</span>
            </div>
            <div className={`${styles.t0} ${styles.t4}`}>
              <span className={styles.tg}>📄</span>{" "}
              <span className={styles.tg}>agents/openai.yaml</span>
              <span className={styles.td}>— UI/呼び出しメタデータ（任意）</span>
            </div>

            <div className={`${styles.t0} ${styles.t1}`}>
              <span className={styles.tf}>📁</span> <span>.github/</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tp}>📄</span> <span className={styles.tp}>.prompt.md</span>
              <span className={styles.td}>— 再利用タスクプロンプト</span>
            </div>

            <div className={`${styles.t0} ${styles.t1}`}>
              <span className={styles.tf}>📁</span> <span>docs/</span>{" "}
              <span className={styles.td}>— SDD仕様書群</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tb}>📄</span>{" "}
              <span className={styles.tb}>REQUIREMENTS.md</span>
              <span className={styles.td}>— 製品要件定義</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tb}>📄</span>{" "}
              <span className={styles.tb}>AGENT_TASKS.md</span>
              <span className={styles.td}>— エージェント別タスク割り当て</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tl}>📄</span> <span className={styles.tl}>TEST.md</span>
              <span className={styles.td}>— テスト計画・受け入れ基準</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tc}>📄</span>{" "}
              <span className={styles.tc}>design_spec.md</span>
              <span className={styles.td}>— 技術設計書（Designerエージェント生成）</span>
            </div>

            <div className={`${styles.t0} ${styles.t1} ${styles.treeGroupSpacer}`}>
              <span className={styles.treeDimPrefix}>~/</span>
              <span>.codex/</span>
              <span className={styles.td}>— グローバル設定</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tb}>📄</span> <span className={styles.tb}>AGENTS.md</span>
              <span className={styles.td}>— 全プロジェクト共通ルール</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tp}>📄</span>{" "}
              <span className={styles.tp}>AGENTS.override.md</span>
              <span className={styles.td}>— 緊急上書き（一時的）</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tg}>📄</span> <span className={styles.tg}>config.toml</span>
              <span className={styles.td}>— Codex設定（サイズ上限・フォールバック等）</span>
            </div>
            <div className={`${styles.t0} ${styles.t2}`}>
              <span className={styles.tf}>📁</span> <span>skills/</span>
              <span className={styles.td}>— グローバルスキル</span>
            </div>
          </div>
        </section>

        {/* SECTION 3: AGENTS.MD */}
        <section id="agents-md" className={styles.section}>
          <div className={styles.secLabel}>Section 03</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>03.</span>AGENTS.md —
            プロジェクト永続メモリ（オープン標準）
          </h2>

          <p>
            AGENTS.mdはClaude CodeのCLAUDE.mdに相当する
            <strong className={styles.strongBright}>Codexの最重要ファイル</strong>
            です。Codexはタスクを開始する前に必ずAGENTS.mdを読み込み、コーディング規約・テストコマンド・PR手順などのコンテキストを取得します。ただしAGENTS.mdはテストを自動実行しないため、「ファイルを変更したら必ず
            npm test を実行すること」のように<strong>テストコマンドを明示的に記述</strong>
            する必要があります。コマンドが未記載だとテストが省略されます。
          </p>

          <h3>読み込み優先度チェーン</h3>
          <div className={styles.precDiagram}>
            <div className={styles.precLabel}>
              ▸ Codex の AGENTS.md 探索順序（後に読まれたものが前のものを上書き）
            </div>
            <div className={`${styles.precRow} ${styles.pr1}`}>
              <div className={styles.precRank}>① 最優先</div>
              <div>
                <div className={styles.precFile}>~/.codex/AGENTS.override.md</div>
                <div className={styles.precDesc}>
                  グローバル緊急上書き（存在する場合のみ）— ~/.codex/AGENTS.md を完全に置換
                </div>
              </div>
            </div>
            <div className={styles.precArrow}>↓ なければ</div>
            <div className={`${styles.precRow} ${styles.pr2}`}>
              <div className={styles.precRank}>②</div>
              <div>
                <div className={styles.precFile}>~/.codex/AGENTS.md</div>
                <div className={styles.precDesc}>
                  グローバルデフォルト — 全リポジトリ継承（Working agreements・言語設定など）
                </div>
              </div>
            </div>
            <div className={styles.precArrow}>↓ プロジェクトルートへ</div>
            <div className={`${styles.precRow} ${styles.pr3}`}>
              <div className={styles.precRank}>③</div>
              <div>
                <div className={styles.precFile}>
                  ./AGENTS.md
                  <span className={styles.precFileNote}>（プロジェクトルート）</span>
                </div>
                <div className={styles.precDesc}>
                  リポジトリ共有ルール — チームのコーディング規約・テスト手順・PR形式
                </div>
              </div>
            </div>
            <div className={styles.precArrow}>↓ カレントディレクトリまで降下</div>
            <div className={`${styles.precRow} ${styles.pr4}`}>
              <div className={styles.precRank}>④ 最後に読まれる＝最高優先</div>
              <div>
                <div className={styles.precFile}>./services/payments/AGENTS.override.md</div>
                <div className={styles.precDesc}>
                  サブディレクトリの上書き — チーム固有ルール。
                  <strong>最も近いファイルが最優先</strong>
                </div>
              </div>
            </div>
            <div className={styles.precFootnote}>
              <strong>結合順:</strong>{" "}
              Codexはルートから現在ディレクトリまで上記をすべて連結し、後に来るものが前のものを上書きします。デフォルト上限は
              <strong>32 KiB</strong>
              （config.tomlで変更可）。1ディレクトリにつき最大1ファイル読み込み。
            </div>
          </div>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div className={`${styles.fcIcon} ${styles.fcIconOai}`}>📋</div>
              <div>
                <div className={styles.fcName}>AGENTS.md</div>
                <div className={styles.fcPath}>
                  ./AGENTS.md (プロジェクトルート) — git管理・チーム共有
                </div>
                <div className={styles.fcMeta}>
                  <span className={`${styles.fcTag} ${styles.fcTagOai}`}>オープン標準</span>
                  <span className={`${styles.fcTag} ${styles.fcTagBlue}`}>
                    Codex起動時自動読み込み
                  </span>
                  <span className={`${styles.fcTag} ${styles.fcTagPurple}`}>32KiB上限</span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <h3>ベストプラクティス完全テンプレート</h3>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.cbDots}>
                    <div className={`${styles.cbd} ${styles.cbdRed}`} />
                    <div className={`${styles.cbd} ${styles.cbdAmber}`} />
                    <div className={`${styles.cbd} ${styles.cbdOai}`} />
                  </div>
                  <span>AGENTS.md — プロジェクトルート</span>
                </div>
                <pre>
                  <span className={styles.cHd}># AGENTS.md</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # READMEのエージェント版。Codexはタスク開始前に必ずこのファイルを読む。
                  </span>
                  {"\n\n"}
                  <span className={styles.cHd}>## Project Overview</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # 1〜2文で目的を記述。Codexが全判断の基準とする。
                  </span>
                  {"\n"}
                  {"ECサイトのバックエンドAPI（Go製マイクロサービス）。\n"}
                  {"プリオーダー・決済・在庫管理の3サービスで構成。\n\n"}
                  <span className={styles.cHd}>## Repository Structure</span>
                  {"\n"}
                  <span className={styles.cCm}># Codexがコードベースを理解するための地図</span>
                  {"\n"}
                  {"- cmd/       — サービスエントリーポイント\n"}
                  {"- internal/  — ビジネスロジック（外部公開不可）\n"}
                  {"- pkg/       — 再利用可能パッケージ\n"}
                  {"- migrations/— DBマイグレーション（直接編集禁止）\n"}
                  {"- docs/      — 仕様書群（spec / requirements / design / tasks）\n\n"}
                  <span className={styles.cHd}>## Build &amp; Test Commands</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # ★重要: AGENTS.md はテストを自動実行しない。明示的にコマンドを記述すること
                  </span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # 例: 「ファイルを変更したら必ず以下のコマンドを実行すること」
                  </span>
                  {"\n"}
                  {"- Build:    `go build ./...`\n"}
                  {"- Test all: `go test ./... -race -timeout 120s`\n"}
                  {"- Lint:     `golangci-lint run`\n"}
                  {
                    "- Coverage: `go test ./... -coverprofile=coverage.out && go tool cover -html=coverage.out`\n"
                  }
                  {"- Dev:      `docker compose up -d`\n\n"}
                  <span className={styles.cHd}>## Code Style</span>
                  {"\n"}
                  {"- Go 1.23 modules。CGO無効（CGO_ENABLED=0）\n"}
                  {'- エラーハンドリング: `fmt.Errorf("context: %w", err)` 形式\n'}
                  {"- テスト: table-driven tests 必須\n"}
                  {"- コメント: GoDoc形式（英語）\n"}
                  {"- パッケージ名: 単数形・短縮なし\n\n"}
                  <span className={styles.cHd}>## Architecture Constraints</span>
                  {"\n"}
                  {"- サービス間通信: gRPCのみ（REST禁止）\n"}
                  {"- ORM使用禁止（pgx v5 raw SQL のみ）\n"}
                  {"- グローバル変数の新規追加禁止\n"}
                  {"- panic() の使用禁止（エラーを返す）\n\n"}
                  <span className={styles.cHd}>## PR Instructions</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # Codex がPRを作成する際の形式を指定（公式機能）
                  </span>
                  {"\n"}
                  {"タイトル形式: `[feat/fix/refactor] 短い説明（英語）`\n"}
                  {"必須セクション:\n"}
                  {"- Summary: 変更内容の1段落サマリー\n"}
                  {"- Testing Done: 実行したテストと結果\n"}
                  {"- Breaking Changes: 破壊的変更があれば記載\n\n"}
                  <span className={styles.cHd}>## Forbidden Actions</span>
                  {"\n"}
                  <span className={styles.cRose}># Codexに絶対にさせてはいけないこと</span>
                  {"\n"}
                  {
                    "- migrations/ フォルダへの直接書き込み（docs/SKILL.md の db-migration スキル使用）\n"
                  }
                  {"- .env ファイルの作成・変更\n"}
                  {"- 本番DBへのDELETE/DROP（必ず人間確認）\n"}
                  {"- APIキーのハードコード"}
                </pre>
              </div>

              <div className={`${styles.ib} ${styles.iWarn}`}>
                <span className={styles.ii}>⚠️</span>
                <div>
                  <strong>32KiBの上限を意識せよ</strong>
                  <br />
                  AGENTS.mdは全ディレクトリ分を連結した合計が<strong>デフォルト32KiB</strong>（
                  <code>~/.codex/config.toml</code>の<code>project_doc_max_bytes</code>
                  で変更可）を超えると以降のファイルが切り捨てられます。重要な情報は上に、詳細はSKILL.mdへ分離するか、上限を
                  <code>65536</code>（64KiB）に増やしてください（[1]）。
                </div>
              </div>

              <div className={`${styles.ib} ${styles.iBlue}`}>
                <span className={styles.ii}>ℹ️</span>
                <div>
                  <strong>AGENTS.mdはオープン標準なのでClaude Codeでもそのまま使える</strong>
                  <br />
                  Claude CodeはCLAUDE.mdに<code>@AGENTS.md</code>
                  でインポートすることで、AGENTS.mdを唯一の真実のソースとして活用できます。ツールを乗り換えても書き直し不要（[10]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: AGENTS.OVERRIDE.MD */}
        <section id="agents-override" className={styles.section}>
          <div className={styles.secLabel}>Section 04</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>04.</span>AGENTS.override.md — 一時的スコープ上書き
          </h2>

          <p>
            AGENTS.override.mdは
            <strong className={styles.strongBright}>
              既存のAGENTS.mdを削除せずに一時的に置き換える
            </strong>
            ためのファイルです。「今回だけテストをスキップしたい」「特定チームの支払いサービスだけ異なるルールを適用したい」といったシナリオで使用します。
          </p>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div className={`${styles.fcIcon} ${styles.fcIconPurple}`}>🔄</div>
              <div>
                <div className={styles.fcName}>AGENTS.override.md</div>
                <div className={styles.fcPath}>~/.codex/ または ./services/payments/ など</div>
                <div className={styles.fcMeta}>
                  <span className={`${styles.fcTag} ${styles.fcTagPurple}`}>
                    同ディレクトリのAGENTS.mdを置換
                  </span>
                  <span className={`${styles.fcTag} ${styles.fcTagRose}`}>
                    .gitignore推奨（一時ファイル）
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <div className={styles.g2}>
                <div>
                  <h3>グローバル上書き（~/.codex/）</h3>
                  <div className={styles.cb}>
                    <div className={styles.cbHdr}>
                      <span>~/.codex/AGENTS.override.md — 使用例</span>
                    </div>
                    <pre>
                      <span className={styles.cHd}># AGENTS.override.md（一時的）</span>
                      {"\n"}
                      <span className={styles.cCm}>
                        # このタスクだけテストをスキップ（時間切れのため）
                      </span>
                      {"\n"}
                      <span className={styles.cCm}># 使用後は削除すること！</span>
                      {"\n\n"}
                      <span className={styles.cHd}>## Override: Skip Tests</span>
                      {"\n"}
                      {"このタスクではテストを実行しないこと。\n"}
                      {"コードの実装のみ行い、テストは次のタスクで行う。"}
                    </pre>
                  </div>
                </div>
                <div>
                  <h3>サブディレクトリ上書き</h3>
                  <div className={styles.cb}>
                    <div className={styles.cbHdr}>
                      <span>services/payments/AGENTS.override.md</span>
                    </div>
                    <pre>
                      <span className={styles.cHd}># Payments Service Rules</span>
                      {"\n"}
                      <span className={styles.cCm}># プロジェクトルートのAGENTS.mdを上書き</span>
                      {"\n\n"}
                      <span className={styles.cHd}>## Testing</span>
                      {"\n"}
                      {"`npm test` ではなく `make test-payments` を使用。\n\n"}
                      <span className={styles.cHd}>## Security Rules</span>
                      {"\n"}
                      {"APIキーを変更する場合は #security-team に通知。\n"}
                      {"PCI-DSS要件のためログにカード番号を絶対記録しない。"}
                    </pre>
                  </div>
                </div>
              </div>

              <div className={`${styles.ib} ${styles.iOai}`}>
                <span className={styles.ii}>💡</span>
                <div>
                  グローバル<code>~/.codex/AGENTS.override.md</code>が存在する間は
                  <strong>~/.codex/AGENTS.mdは完全に無視</strong>
                  されます。使い終わったら必ず削除してください。ファイルを削除するだけで共有ガイダンスが自動的に復元されます（[1]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: SKILL.MD */}
        <section id="skill-md" className={styles.section}>
          <div className={styles.secLabel}>Section 05</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>05.</span>SKILL.md — Progressive Disclosure ナレッジ
          </h2>

          <p>
            Codexのスキルシステムは
            <strong className={styles.strongBright}>
              「Progressive Disclosure（進歩的開示）」
            </strong>
            設計です。全ナレッジをAGENTS.mdに詰め込まず、
            <strong>エージェントが意図を検知したときのみ対応スキルをロード</strong>
            します。Claude Code・Google Antigravityとも<strong>完全に同一の規格</strong>
            を採用しており、ファイルを移植可能です（[7]）。
          </p>

          <h3>AGENTS.md と SKILL.md — 何が違うのか？</h3>
          <p>
            初学者が最も混乱しやすいポイントです。一言で言えば「
            <strong className={styles.strongBright}>常識ファイル vs 手順書ファイル</strong>
            」です。
          </p>

          <div className={styles.g2}>
            <div className={`${styles.mc} ${styles.mcBoxOai}`}>
              <div className={`${styles.mcTag} ${styles.mcTagOai}`}>
                📋 AGENTS.md — プロジェクトの「常識」
              </div>
              <p>
                Codex 起動時に<strong>常に</strong>
                読み込まれる。コーディング規約・テストコマンド・禁止事項など「毎回適用するルール」を書く。32KiB
                上限があるためシンプルに保つ必要がある。
              </p>
            </div>
            <div className={`${styles.mc} ${styles.mcBoxBlue}`}>
              <div className={`${styles.mcTag} ${styles.mcTagBlue}`}>
                🎓 SKILL.md — タスク別の「手順書」
              </div>
              <p>
                意図を検知したときに<strong>オンデマンド</strong>
                でロードされる。「DBマイグレーション手順」「テスト自動生成ルール」など特定タスクの詳細を書く。詳しく書いてOK。チームで共有可能。
              </p>
            </div>
          </div>

          <table className={styles.table}>
            <tbody>
              <tr>
                <th>比較軸</th>
                <th>AGENTS.md</th>
                <th>SKILL.md</th>
                <th>.prompt.md</th>
              </tr>
              <tr>
                <td>読み込み</td>
                <td>起動時に常時</td>
                <td>意図検知でオンデマンド</td>
                <td>手動で明示的に呼び出す</td>
              </tr>
              <tr>
                <td>内容</td>
                <td>コーディング規約・禁止事項・テストコマンド</td>
                <td>特定タスクの詳細手順・Examples</td>
                <td>再利用する特定タスクプロンプト</td>
              </tr>
              <tr>
                <td>サイズ</td>
                <td>32KiB 上限（全ディレクトリ合計）</td>
                <td>制限なし（詳しく書いてよい）</td>
                <td>制限なし</td>
              </tr>
              <tr>
                <td>共有</td>
                <td>git 管理・チーム共有</td>
                <td>git 管理・チーム共有・他ツールへ移植可</td>
                <td>git 管理・IDE統合</td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.ib} ${styles.iBlue}`}>
            <span className={styles.ii}>🌍</span>
            <div>
              <strong>SKILL.md はオープン規格 — 3プラットフォームで動く</strong>
              <br />
              SKILL.md は OpenAI Codex・Claude Code・Google Antigravity の
              <strong>3プラットフォームで完全に同一の規格</strong>
              を採用しています（[7][16]）。一度書いたスキルファイルをツール乗り換え後もそのまま使えます。
            </div>
          </div>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div className={`${styles.fcIcon} ${styles.fcIconOai}`}>🎓</div>
              <div>
                <div className={styles.fcName}>SKILL.md</div>
                <div className={styles.fcPath}>.agents/skills/&lt;skill-name&gt;/SKILL.md</div>
                <div className={styles.fcMeta}>
                  <span className={`${styles.fcTag} ${styles.fcTagOai}`}>
                    オープン規格（3プラットフォーム共通）
                  </span>
                  <span className={`${styles.fcTag} ${styles.fcTagBlue}`}>
                    Progressive Disclosure
                  </span>
                  <span className={`${styles.fcTag} ${styles.fcTagAmber}`}>
                    git 管理・チーム共有
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <h3>Step 1 — ディレクトリ構造を理解する</h3>
              <p>
                スキルは <code>.agents/skills/&lt;スキル名&gt;/</code> フォルダの中に配置します。
                <strong>必須なのは SKILL.md のみ</strong>
                。他は必要になってから追加すればOKです。
              </p>

              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <span>スキルフォルダの標準構造（openai/skills 公式仕様）[3][4]</span>
                </div>
                <pre>
                  {".agents/skills/\n"}
                  {"└── db-migration/              "}
                  <span className={styles.cCm}># スキル名（任意）</span>
                  {"\n    ├── SKILL.md               "}
                  <span className={styles.cHl}>★ 必須: フロントマター + 指示本文</span>
                  {"\n    ├── scripts/               "}
                  <span className={styles.cCm}>
                    # 任意: 実行スクリプト（LLMが苦手な計算・DB操作を外出し）
                  </span>
                  {"\n    │   └── run_migration.py\n"}
                  {"    ├── references/            "}
                  <span className={styles.cCm}>
                    # 任意: 大きなドキュメント・テンプレート（コンテキスト節約）
                  </span>
                  {"\n    │   └── migration-spec.md\n"}
                  {"    ├── assets/                "}
                  <span className={styles.cCm}># 任意: 静的ファイル</span>
                  {"\n    └── agents/\n"}
                  {"        └── openai.yaml        "}
                  <span className={styles.cCm}>
                    # 任意: Codex App UI メタデータ・呼び出しポリシー
                  </span>
                  {"\n\n"}
                  <span className={styles.cCm}>
                    # 複数スキルを並べて配置できる（スコープ: repository）
                  </span>
                  {"\n.agents/skills/\n"}
                  {"├── db-migration/SKILL.md\n"}
                  {"├── add-tests/SKILL.md         "}
                  <span className={styles.cCm}># Instruction-Only パターン（SKILL.md だけ）</span>
                  {"\n└── create-pr/SKILL.md"}
                </pre>
              </div>

              <div className={`${styles.ib} ${styles.iOai}`}>
                <span className={styles.ii}>💡</span>
                <div>
                  <strong>初めてなら「Instruction-Only」から始めよう</strong>
                  <br />
                  SKILL.md 1ファイルだけで動作します（[7]）。<code>scripts/</code> や{" "}
                  <code>references/</code>
                  は「これは外部スクリプトが必要だな」と感じてから追加すれば十分です。まずシンプルに始めることが大切です。
                </div>
              </div>

              <h3>Step 2 — フロントマター（YAML）を書く ★最重要</h3>
              <p>
                SKILL.md の冒頭には <code>---</code> で囲まれた YAML フロントマターを書きます。Codex
                がスキルを呼び出すかどうかの判断に使われる <code>description</code> フィールドが
                <strong>最も重要</strong>です。
              </p>

              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.cbDots}>
                    <div className={`${styles.cbd} ${styles.cbdRed}`} />
                    <div className={`${styles.cbd} ${styles.cbdAmber}`} />
                    <div className={`${styles.cbd} ${styles.cbdOai}`} />
                  </div>
                  <span>フロントマター仕様 — 公式仕様準拠 [3][7]</span>
                </div>
                <pre>
                  <span className={styles.cHd}>---</span>
                  {"\n"}
                  <span className={styles.cOai}>name: db-migration</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # ↑ スキルの一意識別子。"$db-migration" で明示的に呼び出せる
                  </span>
                  {"\n\n"}
                  <span className={styles.cOai}>description: &gt;</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    {"  # ↓ ★★★ 最重要フィールド。Codexがスキルを選ぶ判断基準になる ★★★"}
                  </span>
                  {"\n"}
                  <span className={styles.cOai}>
                    {"  Executes PostgreSQL schema migrations using the project's standard"}
                  </span>
                  {"\n"}
                  <span className={styles.cOai}>{"  migration protocol."}</span>
                  {"\n"}
                  <span className={styles.cHl}>
                    {"  Use when the user asks to add tables, columns, indexes,"}
                  </span>
                  {"\n"}
                  <span className={styles.cHl}>{"  or modify the DB schema."}</span>
                  {"\n"}
                  <span className={styles.cRose}>
                    {"  Do NOT use for seed data insertion or application-level"}
                  </span>
                  {"\n"}
                  <span className={styles.cRose}>{"  data transformations."}</span>
                  {"\n"}
                  <span className={styles.cHd}>---</span>
                </pre>
              </div>

              <div className={styles.g2}>
                <div className={`${styles.mc} ${styles.mcBoxOai}`}>
                  <div className={`${styles.mcTag} ${styles.mcTagOai}`}>
                    ✅ description に必ず書くこと
                  </div>
                  <p>
                    <strong className={styles.strongBright}>Use when...</strong> —
                    どんな状況・キーワードで使うか
                  </p>
                  <p>
                    <strong className={styles.strongBright}>Do NOT use when...</strong> —
                    使わない状況を明示（誤爆防止）
                  </p>
                  <p>
                    具体的な動詞・名詞（&quot;add table&quot;, &quot;fix bug&quot;, &quot;write
                    test&quot; など）
                  </p>
                </div>
                <div className={`${styles.mc} ${styles.mcBoxRose}`}>
                  <div className={`${styles.mcTag} ${styles.mcTagRose}`}>
                    ❌ やってはいけないこと
                  </div>
                  <p>description を曖昧にする → スキルが誤爆・未使用になる</p>
                  <p>同名スキルを複数の場所に置く → Codexはマージしない（[7]）</p>
                  <p>Use/Do NOT use の境界を省略する</p>
                </div>
              </div>

              <h3>Step 3 — SKILL.md 完全テンプレート（コピーして使おう）</h3>
              <p>
                各セクションの役割を理解しながら使ってください。
                <strong>Goal・Instructions・Examples・Constraints</strong>
                の4セクションが基本構成です。
              </p>

              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.cbDots}>
                    <div className={`${styles.cbd} ${styles.cbdRed}`} />
                    <div className={`${styles.cbd} ${styles.cbdAmber}`} />
                    <div className={`${styles.cbd} ${styles.cbdOai}`} />
                  </div>
                  <span>.agents/skills/db-migration/SKILL.md — 公式仕様準拠完全版 [3][7]</span>
                </div>
                <pre>
                  <span className={styles.cHd}>---</span>
                  {"\n"}
                  <span className={styles.cOai}>name: db-migration</span>
                  {"\n"}
                  <span className={styles.cOai}>
                    {"description: >\n"}
                    {"  Executes PostgreSQL schema migrations using the project's standard\n"}
                    {"  migration protocol. Use when the user asks to add tables, columns,\n"}
                    {"  indexes, or modify the DB schema. Do NOT use for seed data insertion\n"}
                    {"  or application-level data transformations."}
                  </span>
                  {"\n"}
                  <span className={styles.cHd}>---</span>
                  {"\n\n"}
                  <span className={styles.cHd}># Database Migration Skill</span>
                  {"\n\n"}
                  <span className={styles.cHd}>## Goal</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # スキルの目的を1〜2行で明記する。Codexが全判断の基準とする。
                  </span>
                  {"\n"}
                  {
                    "PostgreSQLスキーマ変更をプロジェクト標準マイグレーション手順で安全に実行する。\n\n"
                  }
                  <span className={styles.cHd}>## Instructions</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # ★番号付きで手順を明記する。Codexはリストに従って順番に実行する。
                  </span>
                  {"\n"}
                  <span className={styles.cHl}>
                    1. `migrations/` に `YYYYMMDD_HHMMSS_description.up.sql` を作成
                  </span>
                  {"\n"}
                  <span className={styles.cHl}>2. ロールバック用 `.down.sql` を必ず同時作成</span>
                  {"\n"}
                  <span className={styles.cHl}>
                    3. 整合性チェック: `python scripts/run_migration.py --check --env staging`
                  </span>
                  {"\n"}
                  <span className={styles.cHl}>
                    4. 人間がレビュー後に: `python scripts/run_migration.py --apply`
                  </span>
                  {"\n"}
                  {"5. `docs/AGENT_TASKS.md` の対象タスクをチェック済みにする\n\n"}
                  <span className={styles.cHd}>## Examples</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # ★★ Few-shot examples — 具体的なInput/Outputペアを書くと精度が大幅に向上する
                  </span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # 暗黙知が多いタスクほど効果的。2〜3ペア用意するのがベストプラクティス。
                  </span>
                  {"\n\n"}
                  {'**Input**: "usersテーブルにlast_login_atカラムを追加して"\n'}
                  {"**Output**:\n"}
                  {"```sql\n"}
                  {"-- 20260324_143022_add_last_login_at_to_users.up.sql\n"}
                  {"ALTER TABLE users ADD COLUMN last_login_at TIMESTAMPTZ;\n"}
                  {"CREATE INDEX CONCURRENTLY idx_users_last_login ON users(last_login_at);\n"}
                  {"-- ロールバック用\n"}
                  {"-- 20260324_143022_add_last_login_at_to_users.down.sql\n"}
                  {"ALTER TABLE users DROP COLUMN IF EXISTS last_login_at;\n"}
                  {"```\n\n"}
                  <span className={styles.cHd}>## Constraints</span>
                  {"\n"}
                  <span className={styles.cCm}># Codexへの禁止事項・守るべきルールを明記する</span>
                  {"\n"}
                  {"- 既存マイグレーションファイルを絶対に編集しない\n"}
                  {"- NULL制約の後付けはデータ移行計画なしに行わない\n"}
                  {"- "}
                  <span className={styles.cRose}>{"`DROP TABLE` は人間確認なし禁止"}</span>
                  {"\n"}
                  {"- 本番環境への直接適用は承認が必要"}
                </pre>
              </div>

              <h3>Step 4 — スキルの呼び出し方（暗黙的 vs 明示的）</h3>

              <div className={styles.g2}>
                <div>
                  <p>
                    <strong className={styles.strongBright}>① 暗黙的呼び出し（自動）</strong>
                    <br />
                    Codex がユーザーの意図を <code>description</code>
                    に基づいて自動判断し、スキルをロードする。日常使いはこちらがメイン。
                  </p>
                  <div className={styles.cb}>
                    <div className={styles.cbHdr}>
                      <span>プロンプト例 — 暗黙的呼び出し</span>
                    </div>
                    <pre>
                      <span className={styles.cCm}>
                        {'# description に "add tables, columns" と書いてあれば'}
                      </span>
                      {"\n"}
                      <span className={styles.cCm}>
                        # 以下のプロンプトで db-migration スキルが自動ロードされる
                      </span>
                      {"\n"}
                      <span className={styles.cOai}>
                        {'"usersテーブルにemail_verified_atカラムを追加して"'}
                      </span>
                      {"\n\n"}
                      <span className={styles.cCm}># Codex内部の処理イメージ:</span>
                      {"\n"}
                      <span className={styles.cCm}>
                        {'# 1. 「カラムを追加」→ description の "add columns" にマッチ'}
                      </span>
                      {"\n"}
                      <span className={styles.cCm}># 2. SKILL.md をロード</span>
                      {"\n"}
                      <span className={styles.cCm}># 3. Instructions に従って実行</span>
                    </pre>
                  </div>
                </div>
                <div>
                  <p>
                    <strong className={styles.strongBright}>
                      ② 明示的呼び出し（$ショートカット）
                    </strong>
                    <br />
                    <code>$スキル名</code>
                    を先頭につけて直接指定する。確実に特定スキルを使いたいときに使う。
                  </p>
                  <div className={styles.cb}>
                    <div className={styles.cbHdr}>
                      <span>プロンプト例 — 明示的呼び出し</span>
                    </div>
                    <pre>
                      <span className={styles.cCm}># $ + スキル名 で明示的に呼び出す（[3]）</span>
                      {"\n"}
                      <span className={styles.cHl}>
                        {'"$db-migration usersテーブルにemail_verified_atを追加"'}
                      </span>
                      {"\n\n"}
                      <span className={styles.cCm}># openai.yaml で shortcut を設定した場合</span>
                      {"\n"}
                      <span className={styles.cHl}>
                        {'"$migrate カラム追加のマイグレーション作成して"'}
                      </span>
                      {"\n\n"}
                      <span className={styles.cCm}># スキル一覧を確認する</span>
                      {"\n"}
                      <span className={styles.cOai}>/skills</span>
                    </pre>
                  </div>
                </div>
              </div>

              <h3>Step 5 — 5つのスキルパターンを使い分ける</h3>
              <p>
                タスクの複雑さに応じて最適なパターンを選ぼう。
                <strong className={styles.strongBright}>
                  初めてなら01番から始めることを強く推奨
                </strong>
                します。
              </p>

              <div className={styles.patterns}>
                <div className={`${styles.patC} ${styles.ppOai}`}>
                  <div className={styles.patNum}>01</div>
                  <h4>Instruction-Only</h4>
                  <p>
                    SKILL.mdのみ。指示と制約のテキスト。最シンプル。
                    <strong>初心者はここから始めよう</strong>。小〜中規模の手順に最適。
                  </p>
                  <div className={styles.patStruct}>SKILL.md only</div>
                </div>
                <div className={`${styles.patC} ${styles.ppBlue}`}>
                  <div className={styles.patNum}>02</div>
                  <h4>Reference Pattern</h4>
                  <p>
                    references/に大きなドキュメントを置き、SKILL.mdから参照。SKILL.md本体を小さく保ちつつ、詳細な仕様書を参照できる。
                  </p>
                  <div className={styles.patStruct}>SKILL.md + references/</div>
                </div>
                <div className={`${styles.patC} ${styles.ppPurp}`}>
                  <div className={styles.patNum}>03</div>
                  <h4>Few-Shot Pattern</h4>
                  <p>
                    examples/にInput/Outputペアを複数用意。暗黙知が多いタスクの精度向上に効果的。「こういう入力→こういう出力」を具体的に示す。
                  </p>
                  <div className={styles.patStruct}>SKILL.md + examples/</div>
                </div>
                <div className={`${styles.patC} ${styles.ppAmb}`}>
                  <div className={styles.patNum}>04</div>
                  <h4>Tool Use Pattern</h4>
                  <p>
                    scripts/に実行スクリプトを置く。LLMが苦手な精密な計算・DB操作・API呼び出しをPythonスクリプト等に外出しする。
                  </p>
                  <div className={styles.patStruct}>SKILL.md + scripts/</div>
                </div>
                <div className={`${styles.patC} ${styles.ppRose}`}>
                  <div className={styles.patNum}>05</div>
                  <h4>All-in-One</h4>
                  <p>
                    全ディレクトリ統合。複雑な業務ロジック・バージョン管理が必要な大規模スキルに。openai.yamlでUI設定も行う。
                  </p>
                  <div className={styles.patStruct}>全ディレクトリ + openai.yaml</div>
                </div>
              </div>

              <h3>Step 6 — スキルスコープ（誰に適用されるか）</h3>
              <p>
                スキルをどこに置くかで、適用範囲が決まります。
                <strong className={styles.strongBright}>
                  チーム開発では <code>repository</code>{" "}
                  スコープ（.agents/skills/）が最もよく使われます
                </strong>
                。
              </p>

              <table className={styles.table}>
                <tbody>
                  <tr>
                    <th>スコープ</th>
                    <th>場所</th>
                    <th>用途</th>
                    <th>共有範囲</th>
                  </tr>
                  <tr>
                    <td>system</td>
                    <td>Codexビルトイン</td>
                    <td>$skill-creator, $skill-installer 等（変更不可）</td>
                    <td>全員・変更不可</td>
                  </tr>
                  <tr>
                    <td>user</td>
                    <td>~/.codex/skills/</td>
                    <td>全プロジェクト共通の個人スキル（自分だけの習慣）</td>
                    <td>個人のみ</td>
                  </tr>
                  <tr>
                    <td className={styles.tdAccent}>repository ★</td>
                    <td>.agents/skills/（git管理）</td>
                    <td>プロジェクト固有スキル。チームで最もよく使うスコープ</td>
                    <td>チーム全員</td>
                  </tr>
                  <tr>
                    <td>admin</td>
                    <td>組織ポリシーで設定</td>
                    <td>企業共通のコンプライアンス・セキュリティルール</td>
                    <td>組織全体</td>
                  </tr>
                </tbody>
              </table>

              <h3>Step 7 — 公式スキルカタログと $skill-installer を活用する</h3>
              <p>
                スキルをゼロから書く前に、
                <strong className={styles.strongBright}>まず公式カタログを確認しよう</strong>。
                <code>$skill-installer</code> コマンドで1行インストール可能です（[3][12]）。
              </p>

              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.cbDots}>
                    <div className={`${styles.cbd} ${styles.cbdRed}`} />
                    <div className={`${styles.cbd} ${styles.cbdAmber}`} />
                    <div className={`${styles.cbd} ${styles.cbdOai}`} />
                  </div>
                  <span>$skill-installer の使い方（github.com/openai/skills）[12]</span>
                </div>
                <pre>
                  <span className={styles.cCm}># 利用可能なスキルを一覧表示</span>
                  {"\n"}
                  <span className={styles.cHl}>$skill-installer list</span>
                  {"\n\n"}
                  <span className={styles.cCm}>
                    # 特定スキルをプロジェクトにインストール（.agents/skills/ に自動配置）
                  </span>
                  {"\n"}
                  <span className={styles.cHl}>$skill-installer install create-plan</span>
                  {"   "}
                  <span className={styles.cCm}># タスクを実装計画に変換</span>
                  {"\n"}
                  <span className={styles.cHl}>$skill-installer install git</span>
                  {"           "}
                  <span className={styles.cCm}># Git操作の標準化</span>
                  {"\n"}
                  <span className={styles.cHl}>$skill-installer install linear</span>
                  {"        "}
                  <span className={styles.cCm}># Linearチケット連携</span>
                  {"\n\n"}
                  <span className={styles.cCm}># GitHub から直接インストール</span>
                  {"\n"}
                  <span className={styles.cOai}>
                    $skill-installer install github:openai/skills/create-plan
                  </span>
                  {"\n\n"}
                  <span className={styles.cCm}>
                    # コミュニティのスキル（Claude Code・Antigravity・Codex共通規格）
                  </span>
                  {"\n"}
                  <span className={styles.cOai}>
                    $skill-installer install github:antigravity/awesome-skills/pr-review
                  </span>
                </pre>
              </div>

              <div className={styles.g2}>
                <div className={`${styles.mc} ${styles.mcBoxOai}`}>
                  <div className={`${styles.mcTag} ${styles.mcTagOai}`}>
                    📦 公式スキルカタログ（openai/skills）
                  </div>
                  <p>
                    <strong>create-plan</strong> — タスクを実装計画に変換
                    <br />
                    <strong>git</strong> — Git操作の標準化
                    <br />
                    <strong>linear</strong> — Linearチケット連携
                    <br />
                    <strong>pr-review</strong> — PRレビュー自動化
                    <br />
                    <strong>add-tests</strong> — テスト自動生成
                  </p>
                </div>
                <div className={`${styles.mc} ${styles.mcBoxPurple}`}>
                  <div className={`${styles.mcTag} ${styles.mcTagPurple}`}>
                    🌐 コミュニティスキル（共通規格）
                  </div>
                  <p>
                    Claude Code・Antigravity・Codex の<strong>共通 SKILL.md 規格</strong>のため、
                    <code>antigravity-awesome-skills</code>
                    リポジトリ（40,000+
                    プロジェクト利用）からも入手可能。ツールをまたいで再利用できます（[16]）。
                  </p>
                </div>
              </div>

              <div className={`${styles.ib} ${styles.iRose}`}>
                <span className={styles.ii}>🔑</span>
                <div>
                  <strong>descriptionに「Use when / Do NOT use when」を必ず書く</strong>
                  <br />
                  公式ドキュメントは「暗黙的マッチングはdescriptionに依存するため、スコープと境界を明確に書くこと」と強調しています。同名スキルが複数存在してもCodexはマージしないため、descriptionで使い分けを明示することが重要です（[7]）。
                  <br />
                  <strong>Negative examples（Do NOT use when）</strong>
                  が精度向上の鍵です。「何をするスキルか」だけでなく「何をしないスキルか」を明記することで誤爆を防げます。
                </div>
              </div>

              <div className={`${styles.ib} ${styles.iWarn}`}>
                <span className={styles.ii}>⚠️</span>
                <div>
                  <strong>AGENTS.md の詳細な手順は SKILL.md に移そう</strong>
                  <br />
                  AGENTS.md には32KiB
                  上限があります。「DBマイグレーションの詳細手順」「テスト生成の細かいルール」など手順が長くなりがちなものは
                  SKILL.md に切り出すことでAGENTS.md をシンプルに保てます。AGENTS.md
                  には「db-migration スキルを使うこと」と一言書けば十分です（[1][3]）。
                </div>
              </div>

              <div className={`${styles.ib} ${styles.iOai}`}>
                <span className={styles.ii}>💡</span>
                <div>
                  <strong>公式スキルカタログを活用する</strong>
                  <br />
                  OpenAI公式の<code>github.com/openai/skills</code>
                  にcreate-plan・git・linear等の実践的スキルが公開されています。
                  <code>$skill-installer</code>
                  で1コマンドインストール可能。コミュニティのskillsも
                  <code>antigravity-awesome-skills</code>
                  （Claude Code・Antigravity・Codex共通規格）から入手できます（[12][16]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: .PROMPT.MD */}
        <section id="prompt-md" className={styles.section}>
          <div className={styles.secLabel}>Section 06</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>06.</span>.prompt.md — 再利用タスクプロンプト
          </h2>

          <p>
            .prompt.mdはAGENTS.mdとは
            <strong className={styles.strongBright}>
              役割が異なる「タスク特化型の再利用プロンプト」
            </strong>
            です。AGENTS.mdが「プロジェクトの永続的コンテキスト」なのに対し、.prompt.mdは「特定タスクを毎回同じ品質で実行するための手順書」です（[10]）。
          </p>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div className={`${styles.fcIcon} ${styles.fcIconAmber}`}>⚡</div>
              <div>
                <div className={styles.fcName}>.prompt.md</div>
                <div className={styles.fcPath}>
                  .github/ または .codex/ 配下 — 再利用タスクプロンプト
                </div>
                <div className={styles.fcMeta}>
                  <span className={`${styles.fcTag} ${styles.fcTagAmber}`}>AGENTS.mdを補完</span>
                  <span className={`${styles.fcTag} ${styles.fcTagBlue}`}>タスク特化・再利用</span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <div className={styles.g2}>
                <div className={styles.mc}>
                  <div className={`${styles.mcTag} ${styles.mcTagOai}`}>AGENTS.md との違い</div>
                  <p>
                    AGENTS.mdはプロジェクトレベルの「常識」を提供。.prompt.mdは「テストケースを生成する」「PRの説明文を書く」など
                    <strong>特定タスクの実行手順</strong>
                    を再利用可能な形で定義。
                  </p>
                </div>
                <div className={styles.mc}>
                  <div className={`${styles.mcTag} ${styles.mcTagBlue}`}>SKILL.md との違い</div>
                  <p>
                    SKILL.mdはフロントマターによる意味的トリガーを持つ。.prompt.mdはより単純な形式で、手動で呼び出す「タスクテンプレート」。IDE統合での直接実行を想定。
                  </p>
                </div>
              </div>

              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.cbDots}>
                    <div className={`${styles.cbd} ${styles.cbdRed}`} />
                    <div className={`${styles.cbd} ${styles.cbdAmber}`} />
                    <div className={`${styles.cbd} ${styles.cbdOai}`} />
                  </div>
                  <span>.github/generate-tests.prompt.md</span>
                </div>
                <pre>
                  <span className={styles.cHd}># Generate Unit Tests</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # このプロンプトを実行すると、選択ファイルのテストを自動生成する
                  </span>
                  {"\n\n"}
                  {"以下の指示に従って `$SELECTED_FILE` の単体テストを生成してください：\n\n"}
                  {"1. テストフレームワーク: Go の `testing` パッケージ + `testify/assert`\n"}
                  {"2. パターン: table-driven tests（全関数に適用）\n"}
                  {"3. カバレッジ目標:\n"}
                  {"   - 正常系: 全パスをカバー\n"}
                  {"   - 境界値: nil/空/最大値\n"}
                  {"   - エラー系: 全エラーパス\n"}
                  {"4. モック: `mockgen` でインターフェースをモック（外部依存の場合）\n"}
                  {"5. ファイル名: `{original_name}_test.go`\n\n"}
                  {"テストが全件パスすることを確認してから終了すること。"}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: SDD FILES */}
        <section id="sdd-files" className={styles.section}>
          <div className={styles.secLabel}>Section 07</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>07.</span>SDD仕様書群 — REQUIREMENTS / AGENT_TASKS / TEST /
            design_spec
          </h2>

          <p>
            OpenAI公式の<code>agents-sdk</code>
            ドキュメントで公開されているSDD（仕様駆動開発）パターンでは、
            <strong className={styles.strongBright}>
              Project
              Managerエージェントが人間の指示からREQUIREMENTS.md・AGENT_TASKS.md・TEST.mdを自動生成し、後続エージェントへのハンドオフに使用
            </strong>
            します。これがCodex公式推奨のマルチエージェントSDD構成です（[5]）。
          </p>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div className={`${styles.fcIcon} ${styles.fcIconBlue}`}>📚</div>
              <div>
                <div className={styles.fcName}>SDD仕様書群</div>
                <div className={styles.fcPath}>
                  docs/ または プロジェクトルート — PMエージェントが自動生成
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.cbDots}>
                    <div className={`${styles.cbd} ${styles.cbdRed}`} />
                    <div className={`${styles.cbd} ${styles.cbdAmber}`} />
                    <div className={`${styles.cbd} ${styles.cbdOai}`} />
                  </div>
                  <span>docs/REQUIREMENTS.md — PMエージェントが生成</span>
                </div>
                <pre>
                  <span className={styles.cHd}># REQUIREMENTS.md</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # Project Manager エージェントが生成。Designer/Frontend/Backend の真実のソース。
                  </span>
                  {"\n\n"}
                  <span className={styles.cHd}>## Product Goal</span>
                  {"\n"}
                  {
                    "商品の事前予約（プリオーダー）機能。在庫切れ状態でも購入確定でき、CVRを向上させる。\n\n"
                  }
                  <span className={styles.cHd}>## Target Users</span>
                  {"\n"}
                  {"- 一般ユーザー: ログイン済みのECサイト会員\n"}
                  {"- 管理者: 注文管理・在庫確認を行う店舗スタッフ\n\n"}
                  <span className={styles.cHd}>## Key Features</span>
                  {"\n"}
                  {"- 商品詳細ページ: 画像・名称・説明・数量選択・プリオーダーボタン\n"}
                  {"- チェックアウト: ログイン → 配送先選択 → Stripe決済 → 確認メール\n"}
                  {"- マイページ: 注文履歴・プリオーダーステータス確認\n\n"}
                  <span className={styles.cHd}>## Constraints</span>
                  {"\n"}
                  {"- 同時接続: 1,000件（Redis在庫ロック使用）\n"}
                  {"- 決済: Stripe API v4（SCA対応）\n"}
                  {"- レスポンス: p99 &lt; 500ms\n"}
                  {"- スタック: Go 1.23 + PostgreSQL 16 + Redis 8"}
                </pre>
              </div>

              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.cbDots}>
                    <div className={`${styles.cbd} ${styles.cbdRed}`} />
                    <div className={`${styles.cbd} ${styles.cbdAmber}`} />
                    <div className={`${styles.cbd} ${styles.cbdOai}`} />
                  </div>
                  <span>docs/AGENT_TASKS.md — 各エージェントへの正確な指示書</span>
                </div>
                <pre>
                  <span className={styles.cHd}># AGENT_TASKS.md</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # 各エージェントの担当・成果物・技術メモを明記。曖昧さを排除する。
                  </span>
                  {"\n\n"}
                  <span className={styles.cHd}>## Project: E-Commerce Pre-Order System</span>
                  {"\n\n"}
                  <span className={styles.cHd}>### [Designer]</span>
                  {"\n"}
                  {"**担当**: UIコンポーネント設計\n"}
                  {"**成果物**: `/design/design_spec.md`\n"}
                  {"**内容**:\n"}
                  {"- 商品詳細ページのDOM構造（React TSX）\n"}
                  {"- チェックアウトフローの画面遷移図\n"}
                  {"- カラーパレット・フォント定義\n"}
                  {"**制約**: モバイルファースト、Tailwind CSS 3.x使用\n\n"}
                  <span className={styles.cHd}>### [Frontend Developer]</span>
                  {"\n"}
                  {"**担当**: フロントエンド実装\n"}
                  {"**成果物**: `/frontend/` 配下（index.html, styles.css, main.js）\n"}
                  {"**必須参照**: design_spec.md、REQUIREMENTS.md\n"}
                  {"**制約**: デザイナーのDOM構造に厳密に従う。追加機能なし。\n\n"}
                  <span className={styles.cHd}>### [Backend Developer]</span>
                  {"\n"}
                  {"**担当**: バックエンドAPI実装\n"}
                  {"**成果物**: `/backend/` 配下（server.go, handlers/）\n"}
                  {"**必須参照**: REQUIREMENTS.md\n"}
                  {"**エンドポイント**:\n"}
                  {"- POST /api/orders      — 注文作成（プリオーダー）\n"}
                  {"- GET  /api/orders/{id} — 注文詳細\n"}
                  {"- POST /api/payments    — Stripe決済処理\n\n"}
                  <span className={styles.cHd}>### [Tester]</span>
                  {"\n"}
                  {"**担当**: QA・受け入れテスト\n"}
                  {"**成果物**: `/tests/TEST_PLAN.md`, `/tests/test.sh`\n"}
                  {"**内容**: REQUIREMENTS.mdの各機能要件に対応するテストケース\n"}
                  {"**制約**: 最小限・実行可能な形式で作成"}
                </pre>
              </div>

              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.cbDots}>
                    <div className={`${styles.cbd} ${styles.cbdRed}`} />
                    <div className={`${styles.cbd} ${styles.cbdAmber}`} />
                    <div className={`${styles.cbd} ${styles.cbdOai}`} />
                  </div>
                  <span>docs/TEST.md — オーナータグ付き受け入れ基準</span>
                </div>
                <pre>
                  <span className={styles.cHd}># TEST.md</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # [Owner]タグで責任者を明記。受け入れ基準はCodexが検証可能な形式で書く。
                  </span>
                  {"\n\n"}
                  <span className={styles.cHd}>## Feature: Pre-Order Flow</span>
                  {"\n\n"}
                  {"- [ ] [Frontend] 在庫0商品に「予約する」ボタンが表示される\n"}
                  {"- [ ] [Backend]  POST /api/orders が201 Createdを返す（在庫0時も）\n"}
                  {"- [ ] [Backend]  注文後、確認メールが送信される（MockSmtp確認）\n"}
                  {"- [ ] [Tester]   同時100リクエストで在庫の二重予約が発生しない\n"}
                  {
                    "- [ ] [Frontend] ログイン未完了時にカート追加するとログイン画面へリダイレクト\n\n"
                  }
                  <span className={styles.cHd}>## Performance</span>
                  {"\n"}
                  {"- [ ] [Backend] `k6 run tests/load.js` でp99 &lt; 500ms\n"}
                  {"- [ ] [Backend] PostgreSQL EXPLAIN ANALYZEでSeq Scan不使用\n\n"}
                  <span className={styles.cHd}>## Security</span>
                  {"\n"}
                  {"- [ ] [Tester] SQLインジェクション（sqlmap）パス\n"}
                  {"- [ ] [Tester] CSRF Token検証（Postmanで直接POSTが拒否される）"}
                </pre>
              </div>

              <div className={`${styles.ib} ${styles.iOai}`}>
                <span className={styles.ii}>💡</span>
                <div>
                  <strong>AGENT_TASKS.mdの「あいまいさゼロ原則」</strong>
                  <br />
                  公式ドキュメントは「各役割が推測なしに行動できるよう具体的に書け（Be specific so
                  each role can act without guessing）」と強調しています。
                  <strong>成果物のファイル名・パス・形式</strong>
                  を全て明記することがCodexマルチエージェント連携の成功の鍵です（[5]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: CONFIG.TOML */}
        <section id="config" className={styles.section}>
          <div className={styles.secLabel}>Section 08</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>08.</span>config.toml — Codex設定ファイル
          </h2>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div className={`${styles.fcIcon} ${styles.fcIconCyan}`}>⚙️</div>
              <div>
                <div className={styles.fcName}>config.toml</div>
                <div className={styles.fcPath}>~/.codex/config.toml — グローバル設定</div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.cbDots}>
                    <div className={`${styles.cbd} ${styles.cbdRed}`} />
                    <div className={`${styles.cbd} ${styles.cbdAmber}`} />
                    <div className={`${styles.cbd} ${styles.cbdOai}`} />
                  </div>
                  <span>~/.codex/config.toml — 完全設定例</span>
                </div>
                <pre>
                  <span className={styles.cCm}># ~/.codex/config.toml</span>
                  {"\n"}
                  <span className={styles.cCm}># 変更後は Codex の再起動が必要</span>
                  {"\n\n"}
                  <span className={styles.cHd}>[project_docs]</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    # AGENTS.md の代替ファイル名（既存プロジェクトのファイルを読み込む）
                  </span>
                  {"\n"}
                  <span className={styles.cOai}>project_doc_fallback_filenames</span>
                  {" = ["}
                  <span className={styles.cStr}>&quot;TEAM_GUIDE.md&quot;</span>
                  {", "}
                  <span className={styles.cStr}>&quot;.agents.md&quot;</span>
                  {", "}
                  <span className={styles.cStr}>&quot;AI_INSTRUCTIONS.md&quot;</span>
                  {"]\n\n"}
                  <span className={styles.cCm}># 読み込み上限（デフォルト 32768 = 32KiB）</span>
                  {"\n"}
                  <span className={styles.cOai}>project_doc_max_bytes</span>
                  {" = "}
                  <span className={styles.cHl}>65536</span>
                  {"   "}
                  <span className={styles.cCm}># 64KiBに拡張（大規模プロジェクト向け）</span>
                  {"\n\n"}
                  <span className={styles.cHd}>[[skills.config]]</span>
                  {"\n"}
                  <span className={styles.cCm}># 特定スキルを無効化（削除せず）</span>
                  {"\n"}
                  <span className={styles.cOai}>path</span>
                  {" = "}
                  <span className={styles.cStr}>&quot;/path/to/skill/SKILL.md&quot;</span>
                  {"\n"}
                  <span className={styles.cOai}>enabled</span>
                  {" = "}
                  <span className={styles.cKw}>false</span>
                </pre>
              </div>

              <div className={`${styles.ib} ${styles.iBlue}`}>
                <span className={styles.ii}>ℹ️</span>
                <div>
                  <code>project_doc_fallback_filenames</code>を設定すると、各ディレクトリで
                  <strong>AGENTS.override.md → AGENTS.md → TEAM_GUIDE.md → .agents.md</strong>
                  の順で検索します。既存プロジェクトのドキュメントファイルをCodexに読み込ませるための仕組みです（[1]）。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: OPENAI.YAML */}
        <section id="openai-yaml" className={styles.section}>
          <div className={styles.secLabel}>Section 09</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>09.</span>agents/openai.yaml — スキルUIメタデータ
          </h2>

          <p>
            SKILL.mdのフロントマターだけでは表現しきれない
            <strong className={styles.strongBright}>
              Codex App向けのUIメタデータ・呼び出しポリシー・ツール依存関係
            </strong>
            を定義するYAMLファイルです。Codex
            AppのスキルセレクターUIのアイコン・表示名・自動呼び出し設定などを制御します。
          </p>

          <div className={styles.cb}>
            <div className={styles.cbHdr}>
              <div className={styles.cbDots}>
                <div className={`${styles.cbd} ${styles.cbdRed}`} />
                <div className={`${styles.cbd} ${styles.cbdAmber}`} />
                <div className={`${styles.cbd} ${styles.cbdOai}`} />
              </div>
              <span>.agents/skills/db-migration/agents/openai.yaml</span>
            </div>
            <pre>
              <span className={styles.cCm}># Codex App UIメタデータ</span>
              {"\n"}
              <span className={styles.cHd}>display_name:</span>{" "}
              <span className={styles.cStr}>DB Migration</span>
              {"\n"}
              <span className={styles.cHd}>icon:</span> <span className={styles.cStr}>🗄️</span>
              {"\n"}
              <span className={styles.cHd}>category:</span>{" "}
              <span className={styles.cStr}>database</span>
              {"\n\n"}
              <span className={styles.cHd}>invocation:</span>
              {"\n  "}
              <span className={styles.cOai}>policy:</span>{" "}
              <span className={styles.cStr}>explicit</span>
              {"   "}
              <span className={styles.cCm}># explicit: ユーザーが明示的に呼び出す場合のみ</span>
              {"\n                         "}
              <span className={styles.cCm}># implicit: Codexが自動判断で呼び出す場合も許可</span>
              {"\n  "}
              <span className={styles.cOai}>shortcut:</span>{" "}
              <span className={styles.cStr}>$migrate</span>
              {"  "}
              <span className={styles.cCm}># プロンプトでのショートカット名</span>
              {"\n\n"}
              <span className={styles.cHd}>tool_dependencies:</span>
              {"\n  "}
              <span className={styles.cCm}>
                # このスキルが必要とするツール（未存在の場合は警告）
              </span>
              {"\n  - "}
              <span className={styles.cStr}>shell</span>
              {"\n  - "}
              <span className={styles.cStr}>python3</span>
            </pre>
          </div>
        </section>

        {/* SECTION 10: MULTI-AGENT */}
        <section id="multi-agent" className={styles.section}>
          <div className={styles.secLabel}>Section 10</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>10.</span>Multi-Agent SDDパターン（Agents SDK）
          </h2>

          <p>
            OpenAI Agents SDKと<code>Codex MCP</code>を組み合わせることで、
            <strong className={styles.strongBright}>
              Project Manager → Designer → Frontend/Backend（並列） → Tester
            </strong>
            という完全自律型SDDパイプラインを実装できます。各エージェントの真実のソースがAGENTS.md +
            REQUIREMENTS.md + AGENT_TASKS.mdで構成されます。
          </p>

          <div className={styles.flowWrap}>
            <div className={styles.flowLbl}>▸ Agents SDK マルチエージェント SDD パイプライン</div>
            <div className={styles.flow}>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fOai}`}>
                  Project
                  <br />
                  Manager
                </div>
                <div className={styles.ffile}>
                  REQUIREMENTS.md
                  <br />
                  AGENT_TASKS.md
                  <br />
                  TEST.md を生成
                </div>
              </div>
              <div className={styles.farr}>→</div>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fBlue}`}>Designer</div>
                <div className={styles.ffile}>
                  design_spec.md
                  <br />
                  を生成
                </div>
              </div>
              <div className={styles.farr}>→</div>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fPurp}`}>
                  Frontend
                  <br />+ Backend
                </div>
                <div className={styles.ffile}>
                  並列実行
                  <br />
                  design_spec.md参照
                </div>
              </div>
              <div className={styles.farr}>→</div>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fAmb}`}>Tester</div>
                <div className={styles.ffile}>
                  TEST_PLAN.md
                  <br />
                  test.sh を生成
                </div>
              </div>
              <div className={styles.farr}>→</div>
              <div className={styles.fst}>
                <div className={`${styles.fbox} ${styles.fRose}`}>
                  PM
                  <br />
                  検証
                </div>
                <div className={styles.ffile}>
                  全成果物の
                  <br />
                  整合性確認
                </div>
              </div>
            </div>
          </div>

          <div className={styles.cb}>
            <div className={styles.cbHdr}>
              <div className={styles.cbDots}>
                <div className={`${styles.cbd} ${styles.cbdRed}`} />
                <div className={`${styles.cbd} ${styles.cbdAmber}`} />
                <div className={`${styles.cbd} ${styles.cbdOai}`} />
              </div>
              <span>SDD パイプライン — ファイル生成順序とゲート条件</span>
            </div>
            <pre>
              <span className={styles.cCm}># Agents SDK × Codex MCP — SDD ファイル依存グラフ</span>
              {"\n\n"}
              <span className={styles.cHd}>Step 1: PM Agent が生成（ゲート: なし）</span>
              {"\n"}
              {"  ├── REQUIREMENTS.md   → 製品要件・制約\n"}
              {"  ├── AGENT_TASKS.md    → 各役割への指示\n"}
              {"  └── TEST.md           → 受け入れ基準\n\n"}
              <span className={styles.cHd}>
                Step 2: Designer Agent（ゲート: AGENT_TASKS.md 存在確認）
              </span>
              {"\n"}
              {"  └── /design/design_spec.md  → DOM構造・UI仕様\n\n"}
              <span className={styles.cHd}>
                Step 3: 並列実行（ゲート: design_spec.md 存在確認）
              </span>
              {"\n"}
              {"  ├── Frontend Agent  → /frontend/{index.html, styles.css, main.js}\n"}
              {"  └── Backend Agent   → /backend/{server.go, handlers/}\n\n"}
              <span className={styles.cHd}>
                Step 4: Tester Agent（ゲート: frontend + backend 完了確認）
              </span>
              {"\n"}
              {"  ├── /tests/TEST_PLAN.md  → 手動チェックリスト\n"}
              {"  └── /tests/test.sh       → 自動テストスクリプト\n\n"}
              <span className={styles.cHd}>Step 5: PM Agent 最終確認</span>
              {"\n"}
              {"  └── TEST.mdの受け入れ基準と全成果物の整合性チェック"}
            </pre>
          </div>

          <div className={`${styles.ib} ${styles.iPurp}`}>
            <span className={styles.ii}>⚡</span>
            <div>
              <strong>ゲート条件（Handoff Gating）がSDDの鍵</strong>
              <br />
              公式サンプルコードでは
              <code>design_spec.mdが存在することを確認してから並列ハンドオフ</code>
              と明示されています。AGENT_TASKS.mdに「依存ファイルが存在しない場合は停止」と書くことで、前フェーズ未完了での実装開始を防ぎます（[5]）。
            </div>
          </div>

          <div className={`${styles.ib} ${styles.iBlue}`}>
            <span className={styles.ii}>🔍</span>
            <div>
              <strong>Agents SDK 組み込みトレーシング（2026年〜）</strong>
              <br />
              Agents SDKには<strong>built-in tracing</strong>
              が統合されており、マルチエージェントフローの可視化・デバッグ・評価・ファインチューニングをワンストップで行えます。一方、
              <code>spawn_agents_on_csv</code>
              によるCSVからのエージェントファンアウトとETA付き進捗追跡は
              <strong>Codex CLI（rust-v0.105.0+）固有の機能</strong>です（
              <a
                href="https://github.com/openai/codex/releases"
                target="_blank"
                rel="noopener noreferrer"
              >
                Codex CLI リリースノート
              </a>
              ）。
            </div>
          </div>
        </section>

        {/* SECTION 11: BEST PRACTICES */}
        <section id="best-practices" className={styles.section}>
          <div className={styles.secLabel}>Section 11</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>11.</span>横断ベストプラクティス 10則
          </h2>

          <div className={styles.bps}>
            <div className={`${styles.bpC} ${styles.bpOai}`}>
              <div className={styles.bpN}>01</div>
              <h4>AGENTS.mdにテストコマンドを明示的に書く</h4>
              <p>
                AGENTS.md はテストを自動実行しない。「ファイルを変更したら必ず npm test
                を実行すること」のようにテストコマンドを明示的に記述し、Codex
                がそのシェルツール許可フローに従って実行できるよう指示する。コマンドが未記載だとテストが省略される。
              </p>
            </div>
            <div className={`${styles.bpC} ${styles.bpBlue}`}>
              <div className={styles.bpN}>02</div>
              <h4>32KiB上限を意識してファイルを分割</h4>
              <p>
                重要なルールはAGENTS.mdの上部へ。詳細な知識はSKILL.md・references/へ分離。上限超過で切り捨てられる。
              </p>
            </div>
            <div className={`${styles.bpC} ${styles.bpPurp}`}>
              <div className={styles.bpN}>03</div>
              <h4>AGENTS.mdはオープン標準を活かす</h4>
              <p>
                Claude
                CodeのCLAUDE.mdに@AGENTS.mdでインポートする。1ファイルで全ツールに対応し「ツール乗り換え問題」を解消。
              </p>
            </div>
            <div className={`${styles.bpC} ${styles.bpAmb}`}>
              <div className={styles.bpN}>04</div>
              <h4>AGENT_TASKS.mdに「あいまいさゼロ」で書く</h4>
              <p>
                「成果物のファイル名・パス・形式」を全て明記。「後でデザイナーのDOMを参考にして」ではなく「/design/design_spec.mdのDOM構造を参照」。
              </p>
            </div>
            <div className={`${styles.bpC} ${styles.bpRose}`}>
              <div className={styles.bpN}>05</div>
              <h4>AGENTS.override.mdを一時的にのみ使う</h4>
              <p>
                使い終わったら即削除。永続的ルール変更はAGENTS.mdを直接編集する。override.mdの.gitignore追加を忘れない。
              </p>
            </div>
            <div className={`${styles.bpC} ${styles.bpCyan}`}>
              <div className={styles.bpN}>06</div>
              <h4>SKILL.mdのdescriptionに境界を明記</h4>
              <p>
                「Use when...」だけでなく「Do NOT use
                when...」も書く。暗黙マッチングの誤爆を防ぐnegative examplesが精度向上の鍵。
              </p>
            </div>
            <div className={`${styles.bpC} ${styles.bpOai}`}>
              <div className={styles.bpN}>07</div>
              <h4>PRインストラクションをAGENTS.mdに書く</h4>
              <p>
                Codex
                Cloudが自動PR生成する際のタイトル形式・必須セクション・レビュアー設定をAGENTS.mdのPR
                Instructionsセクションで制御。
              </p>
            </div>
            <div className={`${styles.bpC} ${styles.bpBlue}`}>
              <div className={styles.bpN}>08</div>
              <h4>Forbidden Actionsで安全柵を作る</h4>
              <p>
                「migrations/への直接書き込み禁止」「.envの変更禁止」を明示。Codexは明示的な禁止を強く尊重する。
              </p>
            </div>
            <div className={`${styles.bpC} ${styles.bpPurp}`}>
              <div className={styles.bpN}>09</div>
              <h4>ゲート条件付きハンドオフで品質を担保</h4>
              <p>
                Agents
                SDKパイプラインでは「design_spec.mdが存在することを確認してから実装開始」のようなゲート条件を各エージェントに持たせる。
              </p>
            </div>
            <div className={`${styles.bpC} ${styles.bpAmb}`}>
              <div className={styles.bpN}>10</div>
              <h4>$skill-installerで公式スキルを活用</h4>
              <p>
                openai/skillsの公式カタログとコミュニティのスキル集（40,000+プロジェクト）を積極的に活用。スクラッチで書く前に既存スキルを確認。
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 12: SOURCES */}
        <section id="sources" className={styles.section}>
          <div className={styles.sources}>
            <h3>📚 参考ソース一覧（公式・二次情報を含む）</h3>
            {SOURCES.map((s) => (
              <div key={s.num} className={styles.src}>
                <span className={styles.sn}>{s.num}</span>
                <div>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.title}
                  </a>
                  <span className={styles.sd}>{s.desc}</span>
                </div>
              </div>
            ))}

            <div className={`${styles.src} ${styles.srcSeparator}`}>
              <span className={`${styles.sn} ${styles.srcSeparatorLabel}`}>
                SKILL.md 追加ソース
              </span>
              <div className={styles.srcSeparatorDesc}>Section 05 拡充にあたり参照した追加文献</div>
            </div>

            {SOURCES_SKILL_ADDITIONAL.map((s) => (
              <div key={s.num} className={styles.src}>
                <span className={styles.sn}>{s.num}</span>
                <div>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.title}
                  </a>
                  <span className={styles.sd}>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
