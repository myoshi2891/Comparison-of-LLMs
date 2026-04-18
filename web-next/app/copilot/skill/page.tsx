import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "GitHub Copilot — SKILL.md 完全ベストプラクティスガイド",
  description:
    "GitHub Copilot Coding Agent / VS Code Agent Mode / Copilot CLI 対応の SKILL.md ガイド。フロントマター完全仕様・Progressive Disclosure 3段階ローディング・ステップバイステップ作成・実践テンプレート集・トラブルシューティングを 2026年3月時点の公式ドキュメント根拠付きで徹底解説。",
};

type Source = { num: string; href: string; title: string; desc: string };

// SKILL.md 専用の新規追加ソース（[A]〜[L] の 12 件）。
const SOURCES_SKILL: Source[] = [
  {
    num: "[A]",
    href: "https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/",
    title: "GitHub Copilot now supports Agent Skills — GitHub Changelog (Dec 2025)【公式】",
    desc: "Agent Skills 正式サポート発表。.github/skills/ / ~/.copilot/skills/ パス仕様。.claude/skills/ 自動ピックアップ。3ツール（Coding Agent・CLI・VS Code Insiders）での動作確認",
  },
  {
    num: "[B]",
    href: "https://code.visualstudio.com/docs/copilot/customization/agent-skills",
    title: "Use Agent Skills in VS Code — VS Code 公式ドキュメント（2026年3月最新）【公式】",
    desc: "3段階 Progressive Disclosure の完全解説。全フロントマターフィールド（user-invokable・disable-model-invocation・argument-hint）。ディレクトリ構造。chat.agentSkillsLocations 設定",
  },
  {
    num: "[C]",
    href: "https://smartscope.blog/en/blog/agent-skills-guide/",
    title: "Agent Skills: Why SKILL.md Won't Load + Fix Guide — SmartScope (Feb 2026)",
    desc: "スキルが読み込まれない原因と fix。description のキーワード不足。name / ディレクトリ名不一致。CLI の metadata 最終フィールドバグの詳細と回避策",
  },
  {
    num: "[D]",
    href: "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills",
    title: "Creating agent skills for GitHub Copilot — GitHub Docs【公式】",
    desc: "SKILL.md 作成の公式ガイド。フロントマター必須・任意フィールドの完全仕様。scripts/・references/ 等のリソースファイル参照方法。プロジェクト/個人スキルの配置場所",
  },
  {
    num: "[E]",
    href: "https://github.com/github/copilot-cli/issues/951",
    title:
      "Skills with metadata as last frontmatter field are not discovered — GitHub Issues (Jan 2026)",
    desc: "CLI の metadata 最終フィールドバグ報告。回避策: metadata の後に license など追加。VS Code では発生しない。agentskills.io 仕様との矛盾を指摘",
  },
  {
    num: "[F]",
    href: "https://agentskills.io/specification",
    title: "Agent Skills 公式仕様 — agentskills.io（Anthropic 考案・オープン標準）",
    desc: "オープン標準仕様書。SKILL.md 500行/5,000トークン制限。3サブディレクトリ（scripts/references/assets/）。name フィールド正規表現。skills-ref 公式バリデーター CLI",
  },
  {
    num: "[G]",
    href: "https://atalupadhyay.wordpress.com/2026/03/16/agent-skills-in-claude-github-copilot/",
    title: "Agent Skills in Claude & GitHub Copilot — Atal Upadhyay (Mar 2026)",
    desc: "本文構成ベストプラクティス（Goal/When to use/Instructions/Constraints）。スキルをルーティングドキュメントとして使う設計パターン。Level 2・3 のリアルタイム観察例",
  },
  {
    num: "[H]",
    href: "https://medium.com/ai-in-quality-assurance/github-copilot-agent-skills-teaching-ai-your-repository-patterns-01168b6d7a25",
    title: "GitHub Copilot Agent Skills: Teaching AI Your Repository Patterns — Medium (Dec 2025)",
    desc: "インデックス化 5〜10分問題。IDE 再起動による解決。実際のプロジェクトでの適用例（Selenium→Playwright パターン移行事例）",
  },
  {
    num: "[I]",
    href: "https://github.com/github/awesome-copilot/blob/main/docs/README.skills.md",
    title: "awesome-copilot — Skills README — GitHub（コミュニティリポジトリ）",
    desc: "コミュニティスキル集。create-skill（スキル生成メタスキル）・Playwright・Jira 等の実践スキル。Copilot CLI からプラグインとして直接インストール可能",
  },
  {
    num: "[J]",
    href: "https://docs.github.com/en/copilot/concepts/agents/about-agent-skills",
    title: "About agent skills — GitHub Docs【公式】",
    desc: "Agent Skills の概念・対応プラン（Pro/Pro+/Business/Enterprise）。プロジェクト/個人スキルの違い。将来予定（Organization・Enterprise レベルスキル）",
  },
  {
    num: "[K]",
    href: "https://smartscope.blog/en/generative-ai/github-copilot/github-copilot-skills-guide/",
    title: "GitHub Copilot Agent Skills Guide [Latest Feb 2026] — SmartScope",
    desc: "2026年2月時点の対応状況まとめ。完全フロントマター仕様（argument-hint 含む）。カスタムインストラクションとの使い分け比較。Coding Agent の自動スキル参照動作実証",
  },
  {
    num: "[L]",
    href: "https://github.com/skillmatic-ai/awesome-agent-skills",
    title: "skillmatic-ai/awesome-agent-skills — GitHub（Agent Skills リソース集）",
    desc: "SkillsBench（86 タスクベンチマーク）。セキュリティ分析（プロンプトインジェクションリスク）。対応ツール一覧（Claude・Copilot・Cursor・Amp・OpenCode・Goose 等）",
  },
];

// 元ファイルの既存ソース抜粋（[1][4][9][15] の 4 件）。
const SOURCES_EXISTING: Source[] = [
  {
    num: "[1]",
    href: "https://developer.microsoft.com/blog/spec-driven-development-spec-kit",
    title:
      "Diving Into Spec-Driven Development With GitHub Spec Kit — Microsoft for Developers (Sep 2025)",
    desc: "Spec Kit 公式解説。constitution.md・.specify/・.github/prompts/ の SDD 構造。specify→plan→tasks→implement フロー",
  },
  {
    num: "[4]",
    href: "https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot",
    title: "Adding repository custom instructions for GitHub Copilot — GitHub Docs (公式)",
    desc: "copilot-instructions.md・.instructions.md の公式仕様。applyTo の glob 構文・excludeAgent・短文自己完結の原則。SKILL.md との使い分けの判断基準",
  },
  {
    num: "[9]",
    href: "https://www.nathannellans.com/post/all-about-github-copilot-custom-instructions",
    title: "All About GitHub Copilot Custom Instructions — Nathan Nellans (Nov 2025)",
    desc: "SKILL.md の 4 スコープ詳細。AGENTS.md/CLAUDE.md/GEMINI.md 対応全詳細。.claude/skills/ パスの確認",
  },
  {
    num: "[15]",
    href: "https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/",
    title: "GitHub Copilot now supports Agent Skills — GitHub Changelog (Dec 2025)",
    desc: "Agent Skills 正式サポート。全配置パス。.claude/skills/ 自動ピックアップ。全ツール対応状況",
  },
];

// 外部リンクを安全属性付きで開く小物コンポーネント (DRY)。
function Ext({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export default function CopilotSkillPage() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.hdrMesh} />
        <div className={styles.eyebrow}>Microsoft × GitHub × VS Code — 2026年3月最新版</div>
        <h1>
          <span className={styles.msText}>GitHub Copilot</span>
          <br />
          <span className={styles.ghText}>SKILL.md</span> 完全ベストプラクティスガイド
          <br />
          <span className={styles.hdrSubStrong}>
            Agent Skills — Progressive Disclosure 徹底解説
          </span>
        </h1>
        <p className={styles.hdrLead}>
          フロントマター完全仕様 / 3段階ローディング / ステップバイステップ作成 / 実践テンプレート集
          / トラブルシューティング——
          <br />
          2026年3月時点の公式ドキュメントと最新情報を元に、初学者から上級者まで対応した決定版ガイド
        </p>
        <div className={styles.badgeStrip}>
          <span className={`${styles.badge} ${styles.bm}`}>GitHub Copilot</span>
          <span className={`${styles.badge} ${styles.bg}`}>agentskills.io オープン標準</span>
          <span className={`${styles.badge} ${styles.bc}`}>Progressive Disclosure</span>
          <span className={`${styles.badge} ${styles.bv}`}>4ツール共通フォーマット</span>
          <span className={`${styles.badge} ${styles.bt}`}>Mar 2026 最新</span>
        </div>
      </header>

      <main className={styles.main}>
        {/* TOC */}
        <nav className={styles.toc} aria-label="目次">
          <div className={styles.tocTtl}>目次 — SKILL.md 完全ガイド 2026年3月版</div>
          <ol>
            <li>
              <a href="#skill-concept">SKILL.mdとは — 概念・位置づけ・他ファイルとの違い</a>
            </li>
            <li>
              <a href="#skill-3level">3段階ローディング（Progressive Disclosure）の仕組み</a>
            </li>
            <li>
              <a href="#skill-spec">フロントマター完全仕様（全フィールド解説）</a>
            </li>
            <li>
              <a href="#skill-paths">配置パス・ディレクトリ構造・名前規則</a>
            </li>
            <li>
              <a href="#skill-stepbystep">ステップバイステップ — SKILL.md作成ガイド</a>
            </li>
            <li>
              <a href="#skill-templates">実践テンプレート集（6ジャンル）</a>
            </li>
            <li>
              <a href="#skill-vs-instructions">カスタムインストラクションとの使い分け</a>
            </li>
            <li>
              <a href="#skill-advanced">高度な活用パターン（リソースファイル・MCP連携）</a>
            </li>
            <li>
              <a href="#skill-troubleshoot">トラブルシューティング — よくある問題と解決策</a>
            </li>
            <li>
              <a href="#skill-bestpractices">SKILL.md専用ベストプラクティス 10則</a>
            </li>
            <li>
              <a href="#skill-community">コミュニティリソース・公式スキルカタログ</a>
            </li>
            <li>
              <a href="#sources">参考ソース一覧</a>
            </li>
          </ol>
        </nav>

        {/* SECTION 1: CONCEPT */}
        <section id="skill-concept">
          <div className={styles.slabel}>Section 01 — SKILL.md 完全ガイド</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>01.</span>SKILL.mdとは — 概念・位置づけ・他ファイルとの違い
          </h2>

          <p>
            <strong>Agent Skills</strong>
            は、AIエージェントに
            <strong>
              専門的な手順・スクリプト・リソースをオンデマンドで提供する再利用可能な知識パッケージ
            </strong>
            です。 <code>SKILL.md</code>
            はそのコアファイルで、YAMLフロントマターに「いつ・なぜ使うか」を定義し、本文に「どうやるか」の手順を記述します。
            GitHub Copilot Coding Agent・VS Code Agent Mode・Copilot CLI・Claude Code・OpenAI Codex
            の<strong>4ツール以上で共通動作するオープン標準</strong>（
            <Ext href="https://agentskills.io/specification" className={styles.inlineLink}>
              agentskills.io
            </Ext>
            ）です（[A]）。
          </p>

          <div className={styles.skBanner}>
            <div className={styles.skIcon}>🎓</div>
            <div>
              <div className={styles.skTtl}>
                SKILL.mdを一言で表すと「再利用可能な手順書パッケージ」
              </div>
              <div className={styles.skDesc}>
                通常のカスタム指示が「常に適用されるルール」であるのに対し、SKILL.mdは
                <strong>「特定のタスクが発生したときだけ読み込まれる専門手順書」</strong>
                です。
                コンテキストウィンドウを消費しながら常時注入されるのではなく、エージェントが意図を検知したときに初めてロードされます。
                これにより、数十〜数百のスキルをインストールしてもコンテキスト効率を保てます（[1],
                [A]）。
              </div>
            </div>
          </div>

          <h3>SKILL.md vs カスタム指示ファイル — 根本的な違い</h3>
          <div className={styles.cmpWrap}>
            <table>
              <tbody>
                <tr>
                  <th>観点</th>
                  <th>copilot-instructions.md / .instructions.md</th>
                  <th>SKILL.md</th>
                </tr>
                <tr>
                  <td>ロードのタイミング</td>
                  <td>全リクエストに常時注入</td>
                  <td>
                    <strong>関連するときのみ</strong>オンデマンド読み込み
                  </td>
                </tr>
                <tr>
                  <td>適した内容</td>
                  <td>コーディング規約・命名規則・言語設定など常時必要なルール</td>
                  <td>
                    <strong>
                      DBマイグレーション・テスト生成・Terraformレビューなど特定タスク手順
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>コンテキスト消費</td>
                  <td>常に消費（文字数が多いと非効率）</td>
                  <td>タスク時のみ消費（多数インストール可能）</td>
                </tr>
                <tr>
                  <td>付属リソース</td>
                  <td>単体テキストのみ</td>
                  <td>
                    <strong>スクリプト・テンプレート・参照ドキュメントを同梱可能</strong>
                  </td>
                </tr>
                <tr>
                  <td>ツール間移植性</td>
                  <td>Copilot固有</td>
                  <td>
                    <strong>Copilot・Claude Code・Codex・Cursor等で共通利用可能</strong>
                  </td>
                </tr>
                <tr>
                  <td>手動呼び出し</td>
                  <td>不可</td>
                  <td>
                    <strong>/スキル名 でスラッシュコマンドとして呼び出せる</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>どのツールで使えるか（2026年3月時点）</h3>
          <div className={styles.skcat}>
            <div className={styles.skcatItem}>
              <div className={styles.skcatIcon}>🤖</div>
              <div className={styles.skcatName}>Copilot Coding Agent</div>
              <div className={styles.skcatDesc}>
                GitHub.com上でIssueから自律実行。<code>.github/skills/</code>を自動参照。
                <span className={`${styles.pill} ${styles.pillG}`}>GA</span>
              </div>
            </div>
            <div className={styles.skcatItem}>
              <div className={styles.skcatIcon}>💻</div>
              <div className={styles.skcatName}>VS Code Agent Mode</div>
              <div className={styles.skcatDesc}>
                VS Code Insiders（安定版は近日GA予定）。<code>/スキル名</code>で手動呼出可。
                <span className={`${styles.pill} ${styles.pillC}`}>Insiders</span>
              </div>
            </div>
            <div className={styles.skcatItem}>
              <div className={styles.skcatIcon}>⌨️</div>
              <div className={styles.skcatName}>Copilot CLI</div>
              <div className={styles.skcatDesc}>
                ターミナルネイティブ。2025年12月18日〜対応。<code>~/.copilot/skills/</code>も有効。
                <span className={`${styles.pill} ${styles.pillG}`}>GA</span>
              </div>
            </div>
            <div className={styles.skcatItem}>
              <div className={styles.skcatIcon}>🐱</div>
              <div className={styles.skcatName}>Claude Code</div>
              <div className={styles.skcatDesc}>
                <code>.claude/skills/</code>を使用。CopilotがこのパスをAuto-pickup。
                <span className={`${styles.pill} ${styles.pillG}`}>対応済</span>
              </div>
            </div>
            <div className={styles.skcatItem}>
              <div className={styles.skcatIcon}>🧠</div>
              <div className={styles.skcatName}>OpenAI Codex</div>
              <div className={styles.skcatDesc}>
                agentskills.io仕様に準拠。同じSKILL.mdが動作。
                <span className={`${styles.pill} ${styles.pillG}`}>対応済</span>
              </div>
            </div>
            <div className={styles.skcatItem}>
              <div className={styles.skcatIcon}>🔮</div>
              <div className={styles.skcatName}>Cursor / Amp / 他</div>
              <div className={styles.skcatDesc}>
                Cursor・Amp・OpenCode・Goose等も対応拡大中。
                <span className={`${styles.pill} ${styles.pillV}`}>拡大中</span>
              </div>
            </div>
          </div>
          <div className={`${styles.ib} ${styles.im}`}>
            <span className={styles.ii}>ℹ️</span>
            <div>
              <strong>プランの注意事項：</strong>
              Copilot Coding AgentはPro・Pro+・Business・EnterpriseプランでGA。VS CodeのAgent
              ModeはInsiders版で利用可（安定版は近日提供予定）。Copilot
              CLIは全プランで利用可（ただしOrg管理者のポリシー有効化が必要な場合あり）（[J]）。
            </div>
          </div>
        </section>

        {/* SECTION 2: 3-LEVEL LOADING */}
        <section id="skill-3level">
          <div className={styles.slabel}>Section 02</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>02.</span>3段階ローディング（Progressive
            Disclosure）の仕組み
          </h2>

          <p>
            SKILL.mdの最大の特徴は
            <strong>Progressive Disclosure（段階的開示）</strong>という3レベルの読み込み機構です。
            エージェントはスキルのすべてを最初から読み込むのではなく、
            <strong>必要に応じて段階的にコンテキストに追加</strong>
            していきます。
            これにより数十・数百のスキルを登録しても、コンテキストウィンドウを圧迫しません（[A],
            [B]）。
          </p>

          <div className={styles.pdLevels}>
            <div className={styles.pdLevel}>
              <div className={`${styles.pdNum} ${styles.pdTokenGh}`}>Level 1 — Discovery</div>
              <div className={styles.pdIcon}>🔍</div>
              <div className={styles.pdTitle}>発見フェーズ</div>
              <div className={styles.pdBody}>
                エージェントはYAMLフロントマターの<code>name</code>と<code>description</code>
                だけを読む。 ユーザーの質問とdescriptionを照合し、このスキルが関連するかを判断する。
              </div>
              <div className={`${styles.pdToken} ${styles.pdTokenGh}`}>約100トークン消費</div>
            </div>
            <div className={styles.pdLevel}>
              <div className={`${styles.pdNum} ${styles.pdTokenMs}`}>Level 2 — Instructions</div>
              <div className={styles.pdIcon}>📋</div>
              <div className={styles.pdTitle}>指示ロードフェーズ</div>
              <div className={styles.pdBody}>
                スキルが関連すると判断されたとき、SKILL.md本文全体をコンテキストに注入。
                手順・ガイドライン・制約が全部読み込まれ、エージェントが従う。
              </div>
              <div className={`${styles.pdToken} ${styles.pdTokenMs}`}>
                本文全体（〜5,000トークン推奨）
              </div>
            </div>
            <div className={styles.pdLevel}>
              <div className={`${styles.pdNum} ${styles.pdTokenCop}`}>Level 3 — Resources</div>
              <div className={styles.pdIcon}>📦</div>
              <div className={styles.pdTitle}>リソースアクセスフェーズ</div>
              <div className={styles.pdBody}>
                指示の中でスクリプト・テンプレート・参照ドキュメントを参照した場合に限り、
                そのファイルをスキルディレクトリから読み込む。
              </div>
              <div className={`${styles.pdToken} ${styles.pdTokenCop}`}>参照時のみ追加取得</div>
            </div>
          </div>

          <div className={styles.cb}>
            <div className={styles.cbHdr}>
              <div className={styles.dots}>
                <div className={`${styles.dot} ${styles.dotR}`} />
                <div className={`${styles.dot} ${styles.dotY}`} />
                <div className={`${styles.dot} ${styles.dotG}`} />
              </div>
              <span>Progressive Disclosure — 動作フロー例（webapp-testingスキル）</span>
            </div>
            <pre>
              <span className={styles.cCm}>
                ── ユーザーが「ログインページのテストを書いて」と入力 ──
              </span>
              {"\n\n"}
              <span className={styles.cGh}>Level 1: Discovery</span>
              {
                "\n  エージェントが全スキルのfrontmatterをスキャン\n  webapp-testing の description: "
              }
              <span className={styles.cSt}>
                &quot;Guide for testing web apps using Playwright.{"\n    "}Use when asked to create
                or run browser-based tests.&quot;
              </span>
              {"\n  → "}
              <span className={styles.cLi}>&quot;テスト&quot; にマッチ → スキルを選択</span>
              {"\n\n"}
              <span className={styles.cHd}>Level 2: Instructions Loading</span>
              {
                "\n  SKILL.md本文をコンテキストに注入:\n  - ## When to use this skill\n  - ## Creating tests（手順1〜5）\n  - ## Project conventions（命名規則・AAAパターン）\n  → "
              }
              <span className={styles.cLi}>エージェントが手順に従いPlaywrightコードを生成</span>
              {"\n\n"}
              <span className={styles.cCo}>Level 3: Resource Access</span>
              {"\n  指示の中で "}
              <span className={styles.cSt}>./test-template.js</span>
              {" を参照\n  → "}
              <span className={styles.cLi}>
                そのファイルのみをオンデマンドで取得してテンプレートを適用
              </span>
              {"\n\n"}
              <span className={styles.cCm}>
                ── /webapp-testing とコマンドで直接呼び出すことも可能（Level 2から開始）──
              </span>
            </pre>
          </div>

          <div className={`${styles.ib} ${styles.ic}`}>
            <span className={styles.ii}>⚠️</span>
            <div>
              <strong>descriptionが曖昧だとLevel 1で止まる：</strong>
              エージェントはdescriptionに含まれるキーワードでスキルを選択します。
              「テスト」「E2E」「Playwright」など
              <strong>ユーザーが実際に入力するであろうキーワードを明示的に含める</strong>
              ことが不可欠です。
              「すごく便利なツール」のような抽象的な説明では自動発動しません（[C]）。
            </div>
          </div>
        </section>

        {/* SECTION 3: FRONTMATTER SPEC */}
        <section id="skill-spec">
          <div className={styles.slabel}>Section 03</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>03.</span>フロントマター完全仕様（全フィールド解説）
          </h2>

          <p>
            SKILL.mdは<strong>YAMLフロントマター + Markdown本文</strong>の2部構成です。
            フロントマターはスキルのメタデータを定義し、エージェントの「スキル選択」を制御する最重要部分です（[B],
            [D]）。
          </p>

          <div className={styles.fc}>
            <div className={styles.fcHdr}>
              <div className={`${styles.fci} ${styles.fciG}`}>📋</div>
              <div>
                <div className={styles.fcName}>
                  SKILL.md フロントマター — 全フィールド完全リファレンス
                </div>
                <div className={styles.fcPath}>agentskills.io/specification 準拠（2026年3月）</div>
                <div className={styles.fcTags}>
                  <span className={`${styles.fct} ${styles.pillR}`}>name: 必須</span>
                  <span className={`${styles.fct} ${styles.pillR}`}>description: 必須</span>
                  <span className={`${styles.fct} ${styles.fctG}`}>その他: 任意</span>
                </div>
              </div>
            </div>
            <div className={styles.fcBody}>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <div className={styles.dots}>
                    <div className={`${styles.dot} ${styles.dotR}`} />
                    <div className={`${styles.dot} ${styles.dotY}`} />
                    <div className={`${styles.dot} ${styles.dotG}`} />
                  </div>
                  <span>完全フロントマター仕様（全フィールド）</span>
                </div>
                <pre>
                  <span className={styles.cKy}>---</span>
                  {"\n"}
                  <span className={styles.cGh}>name</span>
                  {": "}
                  <span className={styles.cSt}>webapp-testing</span>
                  {"\n"}
                  <span className={styles.cCm}>
                    {
                      "  # 必須 | 小文字英数字・ハイフンのみ | 最大64文字\n  # ディレクトリ名と一致させること（不一致だと読み込まれない！[E]）\n  # 有効例: pdf-processing / code-review / terraform-plan\n  # 無効例: PDF-Processing / -pdf / pdf--processing"
                    }
                  </span>
                  {"\n\n"}
                  <span className={styles.cGh}>description</span>
                  {": "}
                  <span className={styles.cSt}>&gt;-</span>
                  {"\n  "}
                  <span className={styles.cSt}>
                    {
                      "Assists with web application test strategies and automated test\n  creation using Playwright. Use for: testing, test, E2E, browser\n  test, integration test, Playwright, test automation."
                    }
                  </span>
                  {"\n  "}
                  <span className={styles.cCm}>
                    {
                      '# 必須 | 最大1024文字\n  # Level 1の自動発動トリガー。"Use for X, Y, Z" を必ず含める\n  # ユーザーが実際に入力する単語（日本語も可）を列挙'
                    }
                  </span>
                  {"\n\n"}
                  <span className={styles.cGh}>argument-hint</span>
                  {": "}
                  <span className={styles.cSt}>
                    &quot;テスト対象のファイルパスまたはモジュール名&quot;
                  </span>
                  {"\n  "}
                  <span className={styles.cCm}>
                    {
                      '# 任意 | スラッシュコマンド呼出時にChat入力欄に表示されるヒント\n  # 例: "[test file] [options]"'
                    }
                  </span>
                  {"\n\n"}
                  <span className={styles.cGh}>user-invokable</span>
                  {": "}
                  <span className={styles.cKy}>true</span>
                  {"\n  "}
                  <span className={styles.cCm}>
                    {
                      "# 任意 | default: true\n  # false: /メニューに表示されないが自動発動は有効\n  # 内部使用スキルや補助スキルに設定"
                    }
                  </span>
                  {"\n\n"}
                  <span className={styles.cGh}>disable-model-invocation</span>
                  {": "}
                  <span className={styles.cKy}>false</span>
                  {"\n  "}
                  <span className={styles.cCm}>
                    {
                      "# 任意 | default: false\n  # true: エージェントによる自動発動を無効化（手動 /コマンドのみ）\n  # 誤トリガーを防ぎたいデリケートな操作スキルに使用"
                    }
                  </span>
                  {"\n\n"}
                  <span className={styles.cGh}>license</span>
                  {": "}
                  <span className={styles.cSt}>MIT</span>
                  {"\n  "}
                  <span className={styles.cCm}>
                    {"# 任意 | SPDX識別子推奨 (MIT / Apache-2.0 / Proprietary)"}
                  </span>
                  {"\n\n"}
                  <span className={styles.cGh}>metadata</span>
                  {":\n  "}
                  <span className={styles.cGh}>author</span>
                  {": "}
                  <span className={styles.cSt}>platform-team</span>
                  {"\n  "}
                  <span className={styles.cGh}>version</span>
                  {": "}
                  <span className={styles.cSt}>&quot;1.2&quot;</span>
                  {"\n  "}
                  <span className={styles.cGh}>tags</span>
                  {": "}
                  <span className={styles.cSt}>[testing, playwright, e2e]</span>
                  {"\n  "}
                  <span className={styles.cCm}>
                    {
                      "# 任意 | author・version・tags等のカスタムキーバリューペア\n  # ⚠️ CLIのバグ: metadataが最後フィールドだとCLIで発見されないことがある\n  # 回避策: metadataの後に license: MIT など1行追加する（[E]）"
                    }
                  </span>
                  {"\n\n"}
                  <span className={styles.cGh}>compatibility</span>
                  {": "}
                  <span className={styles.cSt}>Requires Node.js 20+, Playwright 1.40+</span>
                  {"\n  "}
                  <span className={styles.cCm}>
                    {"# 任意 | 最大500文字 | 動作に必要な環境・前提条件を記述"}
                  </span>
                  {"\n"}
                  <span className={styles.cKy}>---</span>
                </pre>
              </div>

              <h3>フィールド制約まとめ（クイックリファレンス）</h3>
              <table>
                <tbody>
                  <tr>
                    <th>フィールド</th>
                    <th>必須</th>
                    <th>制約</th>
                    <th>重要ポイント</th>
                  </tr>
                  <tr>
                    <td>name</td>
                    <td>
                      <span className={`${styles.pill} ${styles.pillR}`}>必須</span>
                    </td>
                    <td>小文字・ハイフン・最大64文字</td>
                    <td>ディレクトリ名と完全一致必須（不一致は読み込み不可）</td>
                  </tr>
                  <tr>
                    <td>description</td>
                    <td>
                      <span className={`${styles.pill} ${styles.pillR}`}>必須</span>
                    </td>
                    <td>最大1024文字</td>
                    <td>自動発動トリガー。Use for: キーワード列挙が必須</td>
                  </tr>
                  <tr>
                    <td>argument-hint</td>
                    <td>
                      <span className={`${styles.pill} ${styles.pillG}`}>任意</span>
                    </td>
                    <td>文字列</td>
                    <td>スラッシュコマンドのプレースホルダーテキスト</td>
                  </tr>
                  <tr>
                    <td>user-invokable</td>
                    <td>
                      <span className={`${styles.pill} ${styles.pillG}`}>任意</span>
                    </td>
                    <td>boolean（default: true）</td>
                    <td>falseで/メニューから非表示（自動発動は維持）</td>
                  </tr>
                  <tr>
                    <td>disable-model-invocation</td>
                    <td>
                      <span className={`${styles.pill} ${styles.pillG}`}>任意</span>
                    </td>
                    <td>boolean（default: false）</td>
                    <td>trueで自動発動を完全無効化（手動のみ）</td>
                  </tr>
                  <tr>
                    <td>license</td>
                    <td>
                      <span className={`${styles.pill} ${styles.pillG}`}>任意</span>
                    </td>
                    <td>SPDX識別子</td>
                    <td>スキル共有・公開時に設定推奨</td>
                  </tr>
                  <tr>
                    <td>metadata</td>
                    <td>
                      <span className={`${styles.pill} ${styles.pillG}`}>任意</span>
                    </td>
                    <td>キーバリュー</td>
                    <td>CLIバグあり: 最後尾に置かない</td>
                  </tr>
                  <tr>
                    <td>compatibility</td>
                    <td>
                      <span className={`${styles.pill} ${styles.pillG}`}>任意</span>
                    </td>
                    <td>最大500文字</td>
                    <td>実行環境・前提条件の明記</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 4: PATHS */}
        <section id="skill-paths">
          <div className={styles.slabel}>Section 04</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>04.</span>配置パス・ディレクトリ構造・名前規則
          </h2>

          <h3>有効な配置パス（優先度順）</h3>
          <div className={styles.g3}>
            <div className={styles.mc}>
              <div className={`${styles.mcTag} ${styles.pdTokenGh}`}>① .github/skills/（推奨）</div>
              <p>
                プロジェクト固有スキル。git 管理でチーム共有。Copilot・VS Code
                が最優先で参照（[B]）。
              </p>
            </div>
            <div className={styles.mc}>
              <div className={`${styles.mcTag} ${styles.pdTokenMs}`}>
                ② .claude/skills/（自動ピックアップ）
              </div>
              <p>
                Claude Code 用パス。Copilot はこのパスも Auto-pickup。既存 Claude Code
                スキルをそのまま流用可（[A], [C]）。
              </p>
            </div>
            <div className={styles.mc}>
              <div className={`${styles.mcTag} ${styles.pdTokenCop}`}>
                ③ ~/.copilot/skills/（個人スキル）
              </div>
              <p>
                ホームディレクトリに配置。全プロジェクトで再利用可。Coding Agent・CLI のみ対応（VS
                Code 非対応）（[J]）。
              </p>
            </div>
            <div className={styles.mc}>
              <div className={styles.mcTag} style={{ color: "var(--violet)" }}>
                ④ ~/.claude/skills/（個人・Claude 用）
              </div>
              <p>Claude Code 用個人スキル。Copilot も CLI・Coding Agent で自動認識（[A]）。</p>
            </div>
            <div className={styles.mc}>
              <div className={styles.mcTag} style={{ color: "var(--teal)" }}>
                ⑤ chat.agentSkillsLocations（カスタム）
              </div>
              <p>
                VS Code 設定でカスタムパスを追加可能。モノレポや中央管理リポジトリに便利（[B]）。
              </p>
            </div>
            <div className={styles.mc}>
              <div className={styles.mcTag} style={{ color: "var(--lime)" }}>
                ⑥ 組織・Enterprise（近日提供）
              </div>
              <p>Organization・Enterprise レベルのスキル管理は近日対応予定（[J]）。</p>
            </div>
          </div>

          <h3>公式推奨ディレクトリ構造（agentskills.io 仕様）</h3>
          <div className={styles.dirTree}>
            <span className={styles.tf}>📁</span>{" "}
            <span style={{ color: "var(--text-hi)" }}>.github/skills/</span>
            <br />
            <span className={styles.t1}>
              <span className={styles.tf}>📁</span>{" "}
              <span className={styles.tg}>webapp-testing/</span>{" "}
              <span className={styles.tdi}>
                ← ディレクトリ名 = frontmatter の name（完全一致必須）
              </span>
            </span>
            <br />
            <span className={styles.t2}>
              <span className={styles.tm}>📄</span> <span className={styles.tm}>SKILL.md</span>{" "}
              <span className={styles.tdi}>← 必須: フロントマター + 手順</span>
            </span>
            <br />
            <span className={styles.t2}>
              <span className={styles.tf}>📁</span> <span className={styles.tf}>scripts/</span>{" "}
              <span className={styles.tdi}>← 任意: 実行可能スクリプト (.py/.sh/.js)</span>
            </span>
            <br />
            <span className={styles.t3}>
              <span style={{ color: "var(--lime)" }}>📄 run-tests.sh</span>
            </span>
            <br />
            <span className={styles.t2}>
              <span className={styles.tf}>📁</span> <span className={styles.tf}>references/</span>{" "}
              <span className={styles.tdi}>← 任意: 詳細ドキュメント・参照資料</span>
            </span>
            <br />
            <span className={styles.t3}>
              <span className={styles.tv}>📄 playwright-cheatsheet.md</span>
            </span>
            <br />
            <span className={styles.t2}>
              <span className={styles.tf}>📁</span> <span className={styles.tf}>assets/</span>{" "}
              <span className={styles.tdi}>← 任意: テンプレート・静的ファイル</span>
            </span>
            <br />
            <span className={styles.t3}>
              <span className={styles.tt}>📄 test-template.ts</span>
            </span>
            <br />
            <span className={styles.t1}>
              <span className={styles.tf}>📁</span> <span className={styles.tg}>db-migration/</span>{" "}
              <span className={styles.tdi}>← 別スキル例</span>
            </span>
            <br />
            <span className={styles.t2}>
              <span className={styles.tm}>📄 SKILL.md</span>
            </span>
            <br />
            <span className={styles.t2}>
              <span className={styles.tf}>📁 scripts/</span>
            </span>
            <br />
            <span className={styles.t3}>
              <span style={{ color: "var(--lime)" }}>📄 run_migration.py</span>
            </span>
          </div>

          <div className={styles.g2}>
            <div className={`${styles.ib} ${styles.ig}`}>
              <span className={styles.ii}>📏</span>
              <div>
                <strong>サイズ制限（agentskills.io 仕様）：</strong>
                <br />• SKILL.md 本文: <strong>500 行以内・約 5,000 トークン以内</strong>
                <br />• 超過すると発見・ロードが不安定になる
                <br />• 大規模な手順は <code>references/</code> に分割してリンク参照
                <br />• スキルディレクトリ内のサブディレクトリは scripts・references・assets の 3
                種のみ（[F]）
              </div>
            </div>
            <div className={`${styles.ib} ${styles.ic}`}>
              <span className={styles.ii}>⚠️</span>
              <div>
                <strong>name とディレクトリ名の一致は絶対条件：</strong>
                <br />
                <code>.github/skills/my-skill/</code> なら、
                <br />
                SKILL.md の name フィールドは必ず <code>my-skill</code>
                <br />
                不一致だとスキルが<strong>一切読み込まれません</strong>（[B]）
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: STEP BY STEP */}
        <section id="skill-stepbystep">
          <div className={styles.slabel}>Section 05</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>05.</span>ステップバイステップ — SKILL.md作成ガイド
          </h2>

          <p>
            初めて SKILL.md
            を作成する方向けに、ゼロから実際に動くスキルを作るまでの全手順を解説します。
          </p>

          <div className={styles.steps}>
            <div className={styles.stepItem}>
              <div className={`${styles.stepNum} ${styles.snG}`}>01</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  スキルのスコープを決める — 「1 スキル = 1 タスク」の原則
                </div>
                <div className={styles.stepBody}>
                  まずそのスキルが
                  <strong>何をするか・何をしないか</strong>を 1 文で言えるか確認します。 「DB
                  スキーマ変更 + API エンドポイント実装 + テスト生成」を 1
                  スキルにまとめると曖昧になり自動発動しません。
                  <strong>「DB マイグレーション実行専用」「テスト生成専用」に分割</strong>
                  するのが正解です。
                  <br />
                  <br />✅ 良い例: 「Postgres のスキーママイグレーションを安全に実行する」
                  <br />❌ 悪い例: 「バックエンド開発を全般的にサポートする」
                </div>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={`${styles.stepNum} ${styles.snM}`}>02</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>ディレクトリを作成する</div>
                <div className={styles.stepBody}>
                  <code>.github/skills/</code>
                  ディレクトリ（なければ作成）の下に、スキル名のサブディレクトリを作成します。
                  名前は<strong>小文字・ハイフン区切り・英数字のみ</strong>。
                  <div className={styles.cb} style={{ marginTop: "0.7rem" }}>
                    <div className={styles.cbHdr}>
                      <span>TERMINAL</span>
                    </div>
                    <pre>
                      <span className={styles.cCm}># プロジェクトスキル用ディレクトリ作成</span>
                      {
                        "\nmkdir -p .github/skills/db-migration/scripts\nmkdir -p .github/skills/db-migration/references\ntouch .github/skills/db-migration/SKILL.md\n\n"
                      }
                      <span className={styles.cCm}># 個人スキル（全プロジェクト共有）</span>
                      {
                        "\nmkdir -p ~/.copilot/skills/my-personal-skill\ntouch ~/.copilot/skills/my-personal-skill/SKILL.md"
                      }
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={`${styles.stepNum} ${styles.snC}`}>03</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  フロントマターを書く — description のキーワードが命
                </div>
                <div className={styles.stepBody}>
                  フロントマターはスキルの「名刺」です。特に<code>description</code>は Level 1
                  自動発動の唯一の判断材料です。
                  <strong>
                    「Use when...」「Use for: キーワード 1, キーワード
                    2」のパターンを必ず含めてください
                  </strong>
                  。
                  <div className={styles.cb} style={{ marginTop: "0.7rem" }}>
                    <div className={styles.cbHdr}>
                      <span>SKILL.md — フロントマター記述例</span>
                    </div>
                    <pre>
                      <span className={styles.cKy}>---</span>
                      {"\n"}
                      <span className={styles.cGh}>name</span>
                      {": "}
                      <span className={styles.cSt}>db-migration</span>
                      {"\n"}
                      <span className={styles.cCm}>
                        {"  # ↑ ディレクトリ名と完全一致させること"}
                      </span>
                      {"\n"}
                      <span className={styles.cGh}>description</span>
                      {": "}
                      <span className={styles.cSt}>&gt;-</span>
                      {"\n  "}
                      <span className={styles.cSt}>
                        {
                          "PostgreSQLのスキーママイグレーションを安全に実行する。\n  Use when: DBスキーマ変更, テーブル追加, カラム追加, インデックス追加,\n  migration, migrate, schema change, ALTER TABLE, ADD COLUMN.\n  Do NOT use for: シードデータの投入, アプリケーションレベルのデータ変換."
                        }
                      </span>
                      {"\n"}
                      <span className={styles.cGh}>license</span>
                      {": "}
                      <span className={styles.cSt}>Proprietary</span>
                      {"\n"}
                      <span className={styles.cGh}>metadata</span>
                      {":\n  "}
                      <span className={styles.cGh}>author</span>
                      {": "}
                      <span className={styles.cSt}>backend-team</span>
                      {"\n  "}
                      <span className={styles.cGh}>version</span>
                      {": "}
                      <span className={styles.cSt}>&quot;1.0&quot;</span>
                      {"\n"}
                      <span className={styles.cKy}>---</span>
                      {"\n"}
                      <span className={styles.cCm}>
                        {"# ↑ metadataの後にlicenseを置くことでCLIバグを回避（[E]）"}
                      </span>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={`${styles.stepNum} ${styles.snV}`}>04</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  本文を書く — 「何を・なぜ・どうやって」を構造化する
                </div>
                <div className={styles.stepBody}>
                  本文は Markdown 形式で記述します。効果的な構成パターンは以下の通りです（[G]）：
                  <div className={styles.cb} style={{ marginTop: "0.7rem" }}>
                    <div className={styles.cbHdr}>
                      <span>SKILL.md — 本文の推奨構成</span>
                    </div>
                    <pre>
                      <span className={styles.cHd}># スキル名</span>
                      {"\n"}
                      <span className={styles.cCm}>## 目的（Goal）</span>
                      {"\nこのスキルが解決する問題を 1〜2 文で説明。\n\n"}
                      <span className={styles.cCm}>## このスキルを使う状況（When to use）</span>
                      {
                        "\n- DBスキーマに変更が必要な場合\n- 新しいテーブル・カラム・インデックスを追加する場合\n\n"
                      }
                      <span className={styles.cCm}>## 手順（Instructions）</span>
                      {"\n"}
                      <span className={styles.cCm}>
                        {"# 番号付きステップ形式。コマンドは具体的に記述"}
                      </span>
                      {
                        "\n1. `migrations/` に `YYYYMMDD_HHMMSS_説明.up.sql` を作成\n2. ロールバック用 `.down.sql` を同時作成\n3. 整合性チェック: `python scripts/run_migration.py --check`\n4. 人間レビュー後に適用: `--apply`\n\n"
                      }
                      <span className={styles.cCm}>## 制約（Constraints）</span>
                      {
                        "\n- 既存マイグレーションファイルを絶対に編集しない\n- `DROP TABLE` は人間確認なしに禁止\n\n"
                      }
                      <span className={styles.cCm}>## 参照リソース</span>
                      {"\n"}
                      <span className={styles.cCm}>
                        {"# スキルディレクトリ内のファイルを相対パスで参照"}
                      </span>
                      {
                        "\n詳細な命名規則: [./references/naming-conventions.md](./references/naming-conventions.md)\nマイグレーションテンプレート: [./assets/migration-template.sql](./assets/migration-template.sql)"
                      }
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={`${styles.stepNum} ${styles.snT}`}>05</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>付属リソースファイルを配置する（必要な場合）</div>
                <div className={styles.stepBody}>
                  SKILL.md
                  からリンクするスクリプト・テンプレート・参照ドキュメントをスキルディレクトリに配置します。
                  参照時のみロードされるため、コンテキスト効率に影響しません。
                  <div className={styles.cb} style={{ marginTop: "0.7rem" }}>
                    <div className={styles.cbHdr}>
                      <span>スクリプト配置例</span>
                    </div>
                    <pre>
                      <span className={styles.cCm}>
                        {"# scripts/run_migration.py — SKILL.mdから参照"}
                      </span>
                      {"\n"}
                      <span className={styles.cKy}>import</span>
                      {" subprocess, sys\n\n"}
                      <span className={styles.cKy}>def</span>{" "}
                      <span className={styles.cVi}>run</span>
                      {"(mode: str):\n    cmd = ["}
                      <span className={styles.cSt}>&quot;python&quot;</span>
                      {", "}
                      <span className={styles.cSt}>&quot;-m&quot;</span>
                      {", "}
                      <span className={styles.cSt}>&quot;alembic&quot;</span>
                      {"]\n    "}
                      <span className={styles.cKy}>if</span>
                      {" mode == "}
                      <span className={styles.cSt}>&quot;--check&quot;</span>
                      {":\n        cmd.append("}
                      <span className={styles.cSt}>&quot;check&quot;</span>
                      {")\n    "}
                      <span className={styles.cKy}>elif</span>
                      {" mode == "}
                      <span className={styles.cSt}>&quot;--apply&quot;</span>
                      {":\n        cmd.append("}
                      <span className={styles.cSt}>&quot;upgrade head&quot;</span>
                      {")\n    subprocess.run(cmd, check="}
                      <span className={styles.cKy}>True</span>
                      {")"}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={`${styles.stepNum} ${styles.snG}`}>06</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>動作確認 — スキルが認識されているか確認する</div>
                <div className={styles.stepBody}>
                  スキルを配置したら、以下の方法で認識されているか確認します。
                  <div className={styles.cb} style={{ marginTop: "0.7rem" }}>
                    <div className={styles.cbHdr}>
                      <span>確認方法</span>
                    </div>
                    <pre>
                      <span className={styles.cCm}>── VS Code の場合 ──</span>
                      {"\n1. Copilot Chatを開く\n2. 入力欄に "}
                      <span className={styles.cSt}>/</span>
                      {" と入力 → スキル名がメニューに表示されるか確認\n3. または "}
                      <span className={styles.cSt}>/skills</span>
                      {
                        " と入力 → Configure Skills メニューが開く\n4. スキル一覧に db-migration が表示されていれば OK\n\n"
                      }
                      <span className={styles.cCm}>── Copilot CLI の場合 ──</span>
                      {"\n/mcp show          "}
                      <span className={styles.cCm}># スキル一覧確認</span>
                      {"\n"}
                      <span className={styles.cCm}># または</span>
                      {"\n/skills            "}
                      <span className={styles.cCm}># スキル管理メニュー</span>
                      {"\n\n"}
                      <span className={styles.cCm}>── テスト実行 ──</span>
                      {"\n"}
                      <span className={styles.cSt}>
                        &quot;DB に users テーブルを追加するマイグレーションを作成して&quot;
                      </span>
                      {"\n"}
                      <span className={styles.cCm}>
                        {"# → db-migration スキルが自動ロードされれば Level 1 成功"}
                      </span>
                      {"\n"}
                      <span className={styles.cCm}>
                        {"# → Response の References パネルに SKILL.md が表示されれば Level 2 成功"}
                      </span>
                    </pre>
                  </div>
                  <div className={`${styles.ib} ${styles.im}`} style={{ marginTop: "0.7rem" }}>
                    <span className={styles.ii}>💡</span>
                    <div>
                      新ファイルのインデックス化には
                      <strong>5〜10 分かかる</strong>場合があります。認識されない場合は IDE
                      の再起動を試してください（[H]）。
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={`${styles.stepNum} ${styles.snM}`}>07</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>バリデーターで仕様適合を確認する（推奨）</div>
                <div className={styles.stepBody}>
                  公式バリデーター CLI
                  でフロントマターの仕様適合・トークン予算・行数制限を自動チェックできます（[F]）。
                  <div className={styles.cb} style={{ marginTop: "0.7rem" }}>
                    <div className={styles.cbHdr}>
                      <span>skills-ref — 公式バリデーター CLI</span>
                    </div>
                    <pre>
                      <span className={styles.cCm}>{"# インストール (uv/uvx経由が推奨)"}</span>
                      {"\nuvx skills-ref\n\n"}
                      <span className={styles.cCm}>{"# バリデーション実行"}</span>
                      {"\nskills-ref validate .github/skills/db-migration/SKILL.md\n"}
                      <span className={styles.cCm}>
                        {"# → name一致チェック・token budget・行数制限を確認"}
                      </span>
                      {"\n\n"}
                      <span className={styles.cCm}>{"# プロパティ確認"}</span>
                      {"\nskills-ref read-properties .github/skills/db-migration/SKILL.md\n\n"}
                      <span className={styles.cCm}>{"# プロンプト変換（テスト用）"}</span>
                      {"\nskills-ref to-prompt .github/skills/db-migration/SKILL.md"}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: TEMPLATES */}
        <section id="skill-templates">
          <div className={styles.slabel}>Section 06</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>06.</span>実践テンプレート集（6 ジャンル）
          </h2>

          <p>実際の現場で使える 6 種類の SKILL.md テンプレートです。コピーして使えます。</p>

          <h3>① DB マイグレーション（PostgreSQL）</h3>
          <TemplateBlock
            title=".github/skills/db-migration/SKILL.md"
            body={DB_MIGRATION_TEMPLATE}
          />

          <h3>② Web アプリテスト（Playwright + TypeScript）</h3>
          <TemplateBlock
            title=".github/skills/webapp-testing/SKILL.md"
            body={WEBAPP_TESTING_TEMPLATE}
          />

          <h3>③ Terraform インフラレビュー（IaC）</h3>
          <TemplateBlock
            title=".github/skills/terraform-plan-review/SKILL.md"
            body={TERRAFORM_TEMPLATE}
          />

          <h3>④ GitHub Actions デバッグ（MCP 連携）</h3>
          <TemplateBlock
            title=".github/skills/github-actions-failure-debugging/SKILL.md"
            body={ACTIONS_DEBUG_TEMPLATE}
          />

          <h3>⑤ コードレビュー（セキュリティ特化）</h3>
          <TemplateBlock title=".github/skills/security-review/SKILL.md" body={SECURITY_TEMPLATE} />

          <h3>⑥ スキル自動生成（メタスキル）</h3>
          <TemplateBlock
            title=".github/skills/create-skill/SKILL.md（github/awesome-copilot より）"
            body={CREATE_SKILL_TEMPLATE}
          />
        </section>

        {/* SECTION 7: VS INSTRUCTIONS */}
        <section id="skill-vs-instructions">
          <div className={styles.slabel}>Section 07</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>07.</span>カスタムインストラクションとの使い分け
          </h2>

          <p>
            SKILL.md とカスタム指示ファイル（<code>copilot-instructions.md</code>・
            <code>.instructions.md</code>）は<strong>補完関係</strong>にあります。
            両方を適切に使い分けることで、コンテキスト効率と指示精度の両立が実現します（[1], [4]）。
          </p>

          <div className={styles.skBanner}>
            <div className={styles.skIcon}>🎯</div>
            <div>
              <div className={styles.skTtl}>判断基準：「常に必要か」「特定タスク時だけか」</div>
              <div className={styles.skDesc}>
                コーディング規約・命名規則・禁止パターン →{" "}
                <strong>常に必要 → copilot-instructions.md / .instructions.md</strong>
                <br />
                DB マイグレーション・テスト生成・Terraform レビュー →{" "}
                <strong>特定タスク時のみ → SKILL.md</strong>
              </div>
            </div>
          </div>

          <div className={styles.g2}>
            <div>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <span>copilot-instructions.md に書くべき内容</span>
                </div>
                <pre>
                  <span className={styles.cHd}>## Code Standards（常時必要）</span>
                  {
                    '\n- TypeScript strict mode 使用\n- `any` 型禁止\n- 関数コンポーネントのみ（クラス禁止）\n- エラー: `fmt.Errorf("context: %w", err)` 形式\n\n'
                  }
                  <span className={styles.cHd}>## Build & Test（常時必要）</span>
                  {
                    "\n- Build: `npm run build`\n- Test:  `npm run test`\n- Lint:  `npm run lint:fix`\n\n"
                  }
                  <span className={styles.cCm}>
                    {
                      "# ↑ これらはすべてのリクエストで必要な短いルール\n# SKILL.mdへの参照を書いても機能しないので注意"
                    }
                  </span>
                </pre>
              </div>
            </div>
            <div>
              <div className={styles.cb}>
                <div className={styles.cbHdr}>
                  <span>SKILL.md に書くべき内容</span>
                </div>
                <pre>
                  <span className={styles.cCm}>{"# .github/skills/db-migration/SKILL.md"}</span>
                  {"\n"}
                  <span className={styles.cHd}>## Instructions（特定タスクの詳細手順）</span>
                  {
                    "\n1. migrations/にSQLファイルを作成...（詳細10ステップ）\n2. チェックスクリプト実行: `python ...`\n3. ロールバック手順: ...\n\n"
                  }
                  <span className={styles.cCm}>
                    {
                      "# ↑ DBマイグレーション時だけ必要な詳細手順\n# 常時注入すると毎リクエストで数百トークン消費する\n# → SKILL.mdにして必要時のみロードが正解"
                    }
                  </span>
                </pre>
              </div>
            </div>
          </div>

          <div className={`${styles.ib} ${styles.ig}`}>
            <span className={styles.ii}>💡</span>
            <div>
              <strong>ルール of thumb（経験則）：</strong> copilot-instructions.md に書くルールが 1
              項目 200 文字を超え始めたら、そのルールは SKILL.md に切り出すサインです。
              <code>copilot-instructions.md</code>の<strong>「2 ページ以内」の鉄則</strong>
              を守りつつ、詳細な手順は SKILL.md に委譲します（[4]）。
            </div>
          </div>
        </section>

        {/* SECTION 8: ADVANCED */}
        <section id="skill-advanced">
          <div className={styles.slabel}>Section 08</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>08.</span>高度な活用パターン（リソースファイル・MCP 連携）
          </h2>

          <h3>パターン 1 — リソースファイルで「実行可能スキル」を作る</h3>
          <p>
            SKILL.md はテキスト手順だけでなく、
            <strong>実行可能なスクリプトをスキルディレクトリに同梱</strong>できます。
            エージェントは指示に従ってスクリプトを実行し、その結果を踏まえて次のステップを進められます（[B],
            [D]）。
          </p>
          <TemplateBlock title="リソースファイル連携パターン" body={ADVANCED_RESOURCE_PATTERN} />

          <h3>パターン 2 — MCP 連携スキルでリアルタイムデータを活用する</h3>
          <p>
            SKILL.md の手順に MCP サーバーのツール呼び出しを組み込むことで、
            <strong>外部データをリアルタイムに取得しながら処理を進める</strong>
            スキルが作れます（[D]、GitHub Actions Debugging スキルが参考例）。
          </p>
          <TemplateBlock title="MCP 連携スキル例（Jira 連携）" body={ADVANCED_MCP_PATTERN} />

          <h3>パターン 3 — モノレポ対応（chat.agentSkillsLocations の活用）</h3>
          <div className={styles.cb}>
            <div className={styles.cbHdr}>
              <div className={styles.dots}>
                <div className={`${styles.dot} ${styles.dotR}`} />
                <div className={`${styles.dot} ${styles.dotY}`} />
                <div className={`${styles.dot} ${styles.dotG}`} />
              </div>
              <span>.vscode/settings.json — カスタムスキルパス設定</span>
            </div>
            <pre>
              {"{\n  "}
              <span className={styles.cGh}>&quot;chat.agentSkillsLocations&quot;</span>
              {": [\n    "}
              <span className={styles.cSt}>&quot;../../shared-skills&quot;</span>
              {",\n    "}
              <span className={styles.cCm}>
                {"// ↑ モノレポの親ディレクトリにある共有スキルを参照"}
              </span>
              {"\n    "}
              <span className={styles.cSt}>&quot;/opt/company-skills&quot;</span>
              {"\n    "}
              <span className={styles.cCm}>{"// ↑ 中央管理された企業スキルディレクトリ"}</span>
              {"\n  ],\n  "}
              <span className={styles.cGh}>
                &quot;chat.useCustomizationsInParentRepositories&quot;
              </span>
              {": "}
              <span className={styles.cKy}>true</span>
              {"\n  "}
              <span className={styles.cCm}>{"// ↑ モノレポで親リポジトリのスキルを検出する"}</span>
              {"\n}"}
            </pre>
          </div>
        </section>

        {/* SECTION 9: TROUBLESHOOT */}
        <section id="skill-troubleshoot">
          <div className={styles.slabel}>Section 09</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>09.</span>トラブルシューティング — よくある問題と解決策
          </h2>

          <p>SKILL.md が正しく動作しない場合の原因と解決策を体系的にまとめました（[C], [E]）。</p>

          <table className={styles.tblTs}>
            <tbody>
              <tr>
                <th>症状</th>
                <th>原因</th>
                <th>解決策</th>
              </tr>
              <tr>
                <td>スキルが /メニューに表示されない</td>
                <td>name とディレクトリ名が不一致 / frontmatter の YAML 構文エラー</td>
                <td>
                  <code>skills-ref validate</code> でチェック。name をディレクトリ名に一致させる
                </td>
              </tr>
              <tr>
                <td>スキルが自動発動しない</td>
                <td>description にキーワードが不足している</td>
                <td>「Use for: X, Y, Z」形式でユーザーが入力するキーワードを追加</td>
              </tr>
              <tr>
                <td>意図しないスキルが発動する</td>
                <td>複数スキルの description が重複している</td>
                <td>「Do NOT use for:」で境界を明確化。重複するなら統合を検討</td>
              </tr>
              <tr>
                <td>CLI でスキルが認識されない</td>
                <td>metadata フィールドが frontmatter の最後にある（CLI バグ）</td>
                <td>
                  metadata の後に<code>license: MIT</code>などを 1 行追加する（[E]）
                </td>
              </tr>
              <tr>
                <td>スクリプトが実行されない</td>
                <td>相対パスの書き方が間違っている</td>
                <td>
                  <code>[./scripts/run.sh](./scripts/run.sh)</code> 形式で Markdown リンク記述
                </td>
              </tr>
              <tr>
                <td>新しく作ったスキルが認識されない</td>
                <td>インデックス化に時間がかかっている</td>
                <td>5〜10 分待つか IDE を再起動する（[H]）</td>
              </tr>
              <tr>
                <td>本文が長くて応答が遅い</td>
                <td>SKILL.md が 500 行 / 5,000 トークンを超えている</td>
                <td>
                  詳細は<code>references/</code>に移してリンク参照に変更
                </td>
              </tr>
              <tr>
                <td>Coding Agent がスキルを使わない</td>
                <td>Issue の記述が description のキーワードとずれている</td>
                <td>Issue にスキルのキーワードを WRAP フレームワークで明記する</td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.ib} ${styles.ig}`}>
            <span className={styles.ii}>🔍</span>
            <div>
              <strong>References パネルで動作確認を習慣化：</strong>
              VS Code Copilot Chat のレスポンスには References パネルがあり、どの SKILL.md
              が読み込まれたかを確認できます。 リストに SKILL.md
              が表示されない場合は発動していません（Level 2 未到達）。 スキルの description
              を見直してください（[4]）。
            </div>
          </div>
        </section>

        {/* SECTION 10: BEST PRACTICES */}
        <section id="skill-bestpractices">
          <div className={styles.slabel}>Section 10</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>10.</span>SKILL.md 専用ベストプラクティス 10 則
          </h2>

          <div className={styles.bps}>
            <BpCard
              n="01"
              variant="G"
              title="description は「Use for: キーワード列挙」を必ず含める"
              body={
                <>
                  自動発動の唯一の判断材料。日本語・英語の両方を含めると精度が上がる。「Use for:
                  migration, マイグレーション, ALTER TABLE」のように具体的に。曖昧な表現は Level 1
                  で止まる（[C]）。
                </>
              }
            />
            <BpCard
              n="02"
              variant="M"
              title="name とディレクトリ名を完全一致させる"
              body={
                <>
                  これが最も多い初心者ミス。<code>.github/skills/db-migration/</code>なら
                  <code>name: db-migration</code>
                  。大文字・アンダースコア・スペースは使用不可。一致しないとスキルが一切読み込まれない（[B]）。
                </>
              }
            />
            <BpCard
              n="03"
              variant="C"
              title="本文は 500 行・5,000 トークン以内に収める"
              body={
                <>
                  超えると発見・ロードが不安定になる。詳細な資料は<code>references/</code>
                  に移してリンク参照にする。Progressive Disclosure を活かし、Level 2
                  の手順はシンプルに、詳細は Level 3 リソースへ（[F]）。
                </>
              }
            />
            <BpCard
              n="04"
              variant="V"
              title="1 スキル = 1 タスクの単一責任原則"
              body={
                <>
                  「DB マイグレーション + API エンドポイント実装 + テスト」を 1
                  スキルにしない。スコープが広すぎると自動発動が不正確になる。タスクが複数なら複数スキルに分割（[F]）。
                </>
              }
            />
            <BpCard
              n="05"
              variant="T"
              title="metadata が最後フィールドにならないよう注意"
              body={
                <>
                  Copilot CLI のバグ（2026年1月報告）。metadata が最終フィールドだと CLI
                  でスキルが発見されない。metadata の後に<code>license: MIT</code>など 1
                  フィールド追加して回避（[E]）。
                </>
              }
            />
            <BpCard
              n="06"
              variant="R"
              title="スクリプトは scripts/ に、テンプレートは assets/ に"
              body={
                <>
                  公式仕様（agentskills.io）で定義された 3 つのサブディレクトリを活用。
                  <code>scripts/</code>（実行可能）・<code>references/</code>（ドキュメント）・
                  <code>assets/</code>（テンプレート）で役割を分ける（[F]）。
                </>
              }
            />
            <BpCard
              n="07"
              variant="G"
              title="デリケートな操作は disable-model-invocation: true に"
              body={
                <>
                  本番 DB の直接操作・本番デプロイ・Secrets
                  変更など、誤トリガーが危険な操作は自動発動を無効化。手動で
                  <code>/スキル名</code>として呼び出した場合のみ動作させる（[B]）。
                </>
              }
            />
            <BpCard
              n="08"
              variant="M"
              title="スキルは git 管理してチームで共有・バージョン管理する"
              body={
                <>
                  SKILL.md はコードと同様に git 管理。metadata に version
                  を記録し、変更履歴を追う。チームで改善サイクルを回す。コミュニティスキル（awesome-copilot）を活用する前に必ずレビューする（[I]）。
                </>
              }
            />
            <BpCard
              n="09"
              variant="C"
              title="skills-ref バリデーターで CI/CD に品質チェックを組み込む"
              body={
                <>
                  公式バリデーター<code>uvx skills-ref validate</code>を CI パイプラインに追加。PR
                  で SKILL.md が更新されたら自動チェック。仕様違反・トークン超過・name
                  不一致を事前に検出（[F]）。
                </>
              }
            />
            <BpCard
              n="10"
              variant="V"
              title="Claude Code の SKILL.md を Copilot で再利用する"
              body={
                <>
                  Copilot は<code>.claude/skills/</code>を自動ピックアップ。Claude Code で作成した
                  SKILL.md をコピー不要でそのまま利用できる。4
                  ツール共通のオープン標準なのでツール切り替え時の書き直しが不要（[A]）。
                </>
              }
            />
          </div>
        </section>

        {/* SECTION 11: COMMUNITY */}
        <section id="skill-community">
          <div className={styles.slabel}>Section 11</div>
          <h2 className={styles.stitle}>
            <span className={styles.num}>11.</span>コミュニティリソース・公式スキルカタログ
          </h2>

          <p>自分でゼロから書く前に、公式・コミュニティのスキルを参考にしましょう。</p>

          <div className={styles.g2}>
            <div className={styles.mc}>
              <div className={`${styles.mcTag} ${styles.pdTokenGh}`}>github/awesome-copilot</div>
              <p>
                GitHub コミュニティが作成・維持するスキル集。<code>skills/</code>
                ディレクトリに実践的なスキルが多数。Copilot CLI
                からプラグインとして直接インストール可能（[I]）。
              </p>
            </div>
            <div className={styles.mc}>
              <div className={styles.mcTag} style={{ color: "var(--teal)" }}>
                anthropics/skills
              </div>
              <p>
                Anthropic 公式スキルリポジトリ。Claude Code・Copilot
                で共通利用できる参照スキル集（[15]）。
              </p>
            </div>
            <div className={styles.mc}>
              <div className={`${styles.mcTag} ${styles.pdTokenMs}`}>Microsoft 公式スキル</div>
              <p>
                Azure SDK・Microsoft AI Foundry のためのスキルパッケージを Microsoft が公開。Azure
                関連タスクに最適化（[9]）。
              </p>
            </div>
            <div className={styles.mc}>
              <div className={`${styles.mcTag} ${styles.pdTokenCop}`}>
                agentskills.io マーケットプレイス
              </div>
              <p>
                コミュニティによるスキル公開・共有プラットフォーム。<code>skills-ref validate</code>
                で検証済みのスキルが掲載（[F]）。
              </p>
            </div>
            <div className={styles.mc}>
              <div className={styles.mcTag} style={{ color: "var(--violet)" }}>
                skillmatic-ai/awesome-agent-skills
              </div>
              <p>
                Agent Skills
                の包括的リソース集。仕様書・比較・ベンチマーク（SkillsBench）・セキュリティ分析を含む（[L]）。
              </p>
            </div>
            <div className={styles.mc}>
              <div className={styles.mcTag} style={{ color: "var(--lime)" }}>
                Google Workspace・Vercel スキル
              </div>
              <p>
                企業公式スキルが続々公開中。Vercel（Web ベストプラクティス）・Google
                Workspace（ドキュメント操作）など（[9]）。
              </p>
            </div>
          </div>

          <div className={`${styles.ib} ${styles.ir}`}>
            <span className={styles.ii}>🛡️</span>
            <div>
              <strong>共有スキルのセキュリティ注意事項：</strong>
              外部から取得した SKILL.md は<strong>必ず中身をレビューしてから使用</strong>
              してください。
              スキルファイルには任意のシェルコマンドが記述できるため、悪意あるスクリプトが含まれている可能性があります。
              Agent Skills
              仕様のセキュリティ分析（2025）によりプロンプトインジェクションのリスクも報告されています。
              VS Code の AutoApprove
              設定・ターミナルツールのアクセス制御を適切に設定してください（[L]）。
            </div>
          </div>
        </section>

        {/* SECTION 12: SOURCES */}
        <section id="sources">
          <div className={styles.slabel}>Section 12 — 参考ソース</div>
          <div className={styles.sources}>
            <div className={styles.srcTtl}>
              📚 参考ソース一覧 — SKILL.md 完全ガイド 2026年3月版（[A]〜[L] が SKILL.md
              専用新規追加）
            </div>

            <div className={`${styles.src} ${styles.srcDivMain}`}>
              <span className={`${styles.sn} ${styles.snMs}`}>[主]</span>
              <div className={`${styles.srcDivLbl} ${styles.snMs}`}>
                ── SKILL.md 専用メインソース（新規追加）──
              </div>
            </div>

            {SOURCES_SKILL.map((s) => (
              <div key={s.num} className={styles.src}>
                <span className={styles.sn}>{s.num}</span>
                <div>
                  <Ext href={s.href}>{s.title}</Ext>
                  <span className={styles.sd}>{s.desc}</span>
                </div>
              </div>
            ))}

            <div className={`${styles.src} ${styles.srcDivExisting}`}>
              <span className={`${styles.sn} ${styles.snDim}`}>[既]</span>
              <div className={`${styles.srcDivLbl} ${styles.snDim}`}>
                ── 元ファイルの既存ソース（一部抜粋）──
              </div>
            </div>

            {SOURCES_EXISTING.map((s) => (
              <div key={s.num} className={styles.src}>
                <span className={styles.sn}>{s.num}</span>
                <div>
                  <Ext href={s.href}>{s.title}</Ext>
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

// Section 06 / 08 で繰り返し使うコードブロック枠の小物コンポーネント。
function TemplateBlock({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className={styles.cb}>
      <div className={styles.cbHdr}>
        <div className={styles.dots}>
          <div className={`${styles.dot} ${styles.dotR}`} />
          <div className={`${styles.dot} ${styles.dotY}`} />
          <div className={`${styles.dot} ${styles.dotG}`} />
        </div>
        <span>{title}</span>
      </div>
      <pre>{body}</pre>
    </div>
  );
}

// Section 10 のベストプラクティスカードの小物コンポーネント。
function BpCard({
  n,
  variant,
  title,
  body,
}: {
  n: string;
  variant: "G" | "M" | "C" | "V" | "T" | "R";
  title: string;
  body: React.ReactNode;
}) {
  const variantCls: Record<typeof variant, string> = {
    G: styles.bpG,
    M: styles.bpM,
    C: styles.bpC,
    V: styles.bpV,
    T: styles.bpT,
    R: styles.bpR,
  };
  return (
    <div className={`${styles.bp} ${variantCls[variant]}`}>
      <div className={styles.bpN}>{n}</div>
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  );
}

// ── Section 06 templates (各ジャンルの SKILL.md 逐語コピー本文) ──
const DB_MIGRATION_TEMPLATE = (
  <>
    <span className={styles.cKy}>---</span>
    {"\n"}
    <span className={styles.cGh}>name</span>
    {": "}
    <span className={styles.cSt}>db-migration</span>
    {"\n"}
    <span className={styles.cGh}>description</span>
    {": "}
    <span className={styles.cSt}>&gt;-</span>
    {"\n  "}
    <span className={styles.cSt}>
      {
        "PostgreSQLスキーママイグレーションの安全な実行手順。\n  Use for: DBスキーマ変更, migration, migrate, テーブル追加,\n  カラム追加, インデックス追加, ALTER TABLE, ADD COLUMN, schema change.\n  Do NOT use for: シードデータ投入, データ変換スクリプト."
      }
    </span>
    {"\n"}
    <span className={styles.cGh}>license</span>
    {": "}
    <span className={styles.cSt}>Proprietary</span>
    {"\n"}
    <span className={styles.cGh}>metadata</span>
    {":\n  "}
    <span className={styles.cGh}>author</span>
    {": "}
    <span className={styles.cSt}>backend-team</span>
    {"\n  "}
    <span className={styles.cGh}>version</span>
    {": "}
    <span className={styles.cSt}>&quot;1.0&quot;</span>
    {"\n"}
    <span className={styles.cKy}>---</span>
    {"\n\n"}
    <span className={styles.cHd}># Database Migration Skill</span>
    {"\n\n"}
    <span className={styles.cHd}>## Goal</span>
    {"\nPostgreSQLスキーマ変更を安全かつ一貫した手順で実行する。\n\n"}
    <span className={styles.cHd}>## Instructions</span>
    {
      "\n1. `migrations/` に `YYYYMMDD_HHMMSS_description.up.sql` を作成\n2. ロールバック用 `.down.sql` を必ず同時作成\n3. 整合性チェック: `python scripts/run_migration.py --check`\n4. **人間レビュー後**に適用: `--apply`\n5. `features/.../tasks.md` の対象タスクをチェック済みに更新\n\n"
    }
    <span className={styles.cHd}>## Constraints</span>
    {
      "\n- 既存マイグレーションファイルを絶対に編集しない\n- `DROP TABLE / DROP COLUMN` は人間確認なしに禁止\n- NULL制約の後付けはデータ移行計画なしに行わない\n- ファイル名は必ずタイムスタンプ付き（YYYYMMDD_HHMMSS）"
    }
  </>
);

const WEBAPP_TESTING_TEMPLATE = (
  <>
    <span className={styles.cKy}>---</span>
    {"\n"}
    <span className={styles.cGh}>name</span>
    {": "}
    <span className={styles.cSt}>webapp-testing</span>
    {"\n"}
    <span className={styles.cGh}>description</span>
    {": "}
    <span className={styles.cSt}>&gt;-</span>
    {"\n  "}
    <span className={styles.cSt}>
      {
        "PlaywrightによるWebアプリのE2Eテスト生成・実行手順。\n  Use for: テスト作成, E2E test, Playwright, ブラウザテスト,\n  integration test, 自動テスト, test automation, login test."
      }
    </span>
    {"\n"}
    <span className={styles.cGh}>argument-hint</span>
    {": "}
    <span className={styles.cSt}>&quot;テスト対象のページURLまたはコンポーネント名&quot;</span>
    {"\n"}
    <span className={styles.cGh}>license</span>
    {": "}
    <span className={styles.cSt}>MIT</span>
    {"\n"}
    <span className={styles.cGh}>metadata</span>
    {":\n  "}
    <span className={styles.cGh}>author</span>
    {": "}
    <span className={styles.cSt}>qa-team</span>
    {"\n  "}
    <span className={styles.cGh}>version</span>
    {": "}
    <span className={styles.cSt}>&quot;2.1&quot;</span>
    {"\n  "}
    <span className={styles.cGh}>compatibility</span>
    {": "}
    <span className={styles.cSt}>Requires Node.js 20+, @playwright/test 1.40+</span>
    {"\n"}
    <span className={styles.cKy}>---</span>
    {"\n\n"}
    <span className={styles.cHd}># Web Application Testing Skill</span>
    {"\n\n"}
    <span className={styles.cHd}>## When to use this skill</span>
    {
      "\n- Playwright E2Eテストを新規作成する場合\n- 失敗しているブラウザテストをデバッグする場合\n- 新機能のテストスイートを構築する場合\n\n"
    }
    <span className={styles.cHd}>## テストファイル規約</span>
    {
      "\n- ファイル名: `*.test.ts`（例: `login.test.ts`）\n- describe/it 形式（Jestスタイル）\n- AAA パターン（Arrange / Act / Assert）を厳守\n\n"
    }
    <span className={styles.cHd}>## テスト作成手順</span>
    {
      "\n1. `[./assets/test-template.ts](./assets/test-template.ts)` をベースに作成\n2. `data-testid` 属性でセレクタを定義（XPath禁止）\n3. 境界値テストを優先的に含める\n4. 外部依存（API）はすべてモック\n\n"
    }
    <span className={styles.cHd}>## Constraints</span>
    {
      "\n- `page.waitForTimeout()` 使用禁止（`waitForSelector` を使う）\n- ハードコードURL禁止（`process.env.BASE_URL` を使う）"
    }
  </>
);

const TERRAFORM_TEMPLATE = (
  <>
    <span className={styles.cKy}>---</span>
    {"\n"}
    <span className={styles.cGh}>name</span>
    {": "}
    <span className={styles.cSt}>terraform-plan-review</span>
    {"\n"}
    <span className={styles.cGh}>description</span>
    {": "}
    <span className={styles.cSt}>&gt;-</span>
    {"\n  "}
    <span className={styles.cSt}>
      {
        "Terraformプランのdiffレビューを標準化。破壊的変更・権限変更・\n  ネットワーク変更・コスト影響を分類して優先的に検査する。\n  Use for: Terraform, plan, diff, infra review, IAM, network, cost,\n  infrastructure, IaC review, tf plan."
      }
    </span>
    {"\n"}
    <span className={styles.cGh}>disable-model-invocation</span>
    {": "}
    <span className={styles.cKy}>false</span>
    {"\n"}
    <span className={styles.cGh}>license</span>
    {": "}
    <span className={styles.cSt}>Proprietary</span>
    {"\n"}
    <span className={styles.cGh}>metadata</span>
    {":\n  "}
    <span className={styles.cGh}>author</span>
    {": "}
    <span className={styles.cSt}>platform-team</span>
    {"\n  "}
    <span className={styles.cGh}>version</span>
    {": "}
    <span className={styles.cSt}>&quot;0.3&quot;</span>
    {"\n"}
    <span className={styles.cKy}>---</span>
    {"\n\n"}
    <span className={styles.cHd}># Terraform Plan Review Skill</span>
    {"\n\n"}
    <span className={styles.cHd}>## Goal</span>
    {"\nTerraform planのdiffを体系的にレビューし、リスクを可視化する。\n\n"}
    <span className={styles.cHd}>## Review Priority（高 → 低）</span>
    {
      "\n1. **🔴 破壊的変更** — `destroy`, `force-replace` を含む変更\n2. **🟠 権限変更** — IAMポリシー・ロール・信頼関係の変更\n3. **🟡 ネットワーク変更** — SGルール・VPC・NACL変更\n4. **🟢 コスト影響** — インスタンスタイプ・ストレージ・NAT Gateway変更\n\n"
    }
    <span className={styles.cHd}>## レビューレポート形式</span>
    {
      "\n各変更に対して以下を記載:\n- 変更内容（リソース名・変更の種類）\n- リスクレベル（Critical/High/Medium/Low）\n- 推奨アクション（承認可 / 人間確認要 / ブロック推奨）"
    }
  </>
);

const ACTIONS_DEBUG_TEMPLATE = (
  <>
    <span className={styles.cKy}>---</span>
    {"\n"}
    <span className={styles.cGh}>name</span>
    {": "}
    <span className={styles.cSt}>github-actions-failure-debugging</span>
    {"\n"}
    <span className={styles.cGh}>description</span>
    {": "}
    <span className={styles.cSt}>&gt;-</span>
    {"\n  "}
    <span className={styles.cSt}>
      {
        "失敗したGitHub Actionsワークフローのデバッグ手順。\n  Use for: GitHub Actions, CI失敗, workflow失敗, CI/CD debug,\n  actions failure, pipeline error, ワークフローデバッグ."
      }
    </span>
    {"\n"}
    <span className={styles.cGh}>license</span>
    {": "}
    <span className={styles.cSt}>MIT</span>
    {"\n"}
    <span className={styles.cGh}>metadata</span>
    {":\n  "}
    <span className={styles.cGh}>author</span>
    {": "}
    <span className={styles.cSt}>github-official</span>
    {"\n"}
    <span className={styles.cKy}>---</span>
    {"\n\n"}
    <span className={styles.cHd}># GitHub Actions Failure Debugging</span>
    {"\n\n"}
    <span className={styles.cHd}>## Instructions</span>
    {"\n"}
    <span className={styles.cCm}>
      {"# GitHub MCP Serverのツールを活用してコンテキスト効率を高める"}
    </span>
    {
      "\n1. `list_workflow_runs` ツールでPRの最近のワークフロー実行と\n   ステータスを取得する\n2. `summarize_job_log_failures` ツールで失敗ジョブのログサマリを取得。\n   コンテキストを消費せずに問題を把握できる\n3. 詳細確認が必要な場合のみ `get_job_logs` または\n   `get_workflow_run_logs` で完全ログを取得\n\n"
    }
    <span className={styles.cHd}>## 分析フレームワーク</span>
    {
      "\n- ネットワーク/タイムアウト系 → flaky test か外部依存問題\n- 依存インストール失敗 → キャッシュの問題またはバージョン不整合\n- テスト失敗 → 実装バグかテスト環境の問題を切り分ける"
    }
  </>
);

const SECURITY_TEMPLATE = (
  <>
    <span className={styles.cKy}>---</span>
    {"\n"}
    <span className={styles.cGh}>name</span>
    {": "}
    <span className={styles.cSt}>security-review</span>
    {"\n"}
    <span className={styles.cGh}>description</span>
    {": "}
    <span className={styles.cSt}>&gt;-</span>
    {"\n  "}
    <span className={styles.cSt}>
      {
        "OWASP Top 10を基準としたセキュリティコードレビュー。\n  Use for: security review, セキュリティ確認, 脆弱性チェック,\n  OWASP, SQL injection, XSS, authentication review, 認証実装確認."
      }
    </span>
    {"\n"}
    <span className={styles.cGh}>user-invokable</span>
    {": "}
    <span className={styles.cKy}>true</span>
    {"\n"}
    <span className={styles.cGh}>license</span>
    {": "}
    <span className={styles.cSt}>Proprietary</span>
    {"\n"}
    <span className={styles.cGh}>metadata</span>
    {":\n  "}
    <span className={styles.cGh}>version</span>
    {": "}
    <span className={styles.cSt}>&quot;1.0&quot;</span>
    {"\n"}
    <span className={styles.cKy}>---</span>
    {"\n\n"}
    <span className={styles.cHd}># Security Code Review Skill</span>
    {"\n\n"}
    <span className={styles.cHd}>## チェックリスト（OWASP Top 10準拠）</span>
    {
      "\n各項目を確認し、問題をCritical/High/Medium/Lowで分類する:\n\n1. **A01 Broken Access Control** — 認可チェックの漏れ・IDOR\n2. **A02 Cryptographic Failures** — 平文保存・弱暗号化・HTTPS強制\n3. **A03 Injection** — SQLi・NoSQLi・コマンドインジェクション\n4. **A04 Insecure Design** — ビジネスロジックの欠陥\n5. **A07 Auth Failures** — 弱パスワード・ブルートフォース対策なし\n\n"
    }
    <span className={styles.cHd}>## レポート形式</span>
    {
      "\n各問題について記載:\n- **CWE番号**（例: CWE-89 SQL Injection）\n- **重大度**（Critical/High/Medium/Low）\n- **問題箇所**（ファイル名・行番号）\n- **修正コード例**"
    }
  </>
);

const CREATE_SKILL_TEMPLATE = (
  <>
    <span className={styles.cKy}>---</span>
    {"\n"}
    <span className={styles.cGh}>name</span>
    {": "}
    <span className={styles.cSt}>create-skill</span>
    {"\n"}
    <span className={styles.cGh}>description</span>
    {": "}
    <span className={styles.cSt}>&gt;-</span>
    {"\n  "}
    <span className={styles.cSt}>
      {
        '新しいAgent Skillを作成またはテンプレートから複製する。\n  Use when: "スキルを作って", "新しいスキルを作成", "scaffold a skill",\n  "create a skill", SKILL.mdを作りたい, スキル雛形.'
      }
    </span>
    {"\n"}
    <span className={styles.cGh}>license</span>
    {": "}
    <span className={styles.cSt}>MIT</span>
    {"\n"}
    <span className={styles.cGh}>metadata</span>
    {":\n  "}
    <span className={styles.cGh}>author</span>
    {": "}
    <span className={styles.cSt}>github-community</span>
    {"\n"}
    <span className={styles.cKy}>---</span>
    {"\n\n"}
    <span className={styles.cHd}># Create Skill — Skill作成メタスキル</span>
    {"\n\n"}
    <span className={styles.cHd}>## Instructions</span>
    {
      '\n1. ユーザーにスキルの目的・対象ツール・キーワードを確認する\n2. `.github/skills/{スキル名}/` ディレクトリを作成\n3. フロントマターを生成:\n   - name: ディレクトリ名と一致させる\n   - description: "Use for: キーワード1, 2, 3" を含める\n4. 本文に Goal・Instructions・Constraints を記述\n5. 必要なら scripts/ assets/ references/ も作成\n\n'
    }
    <span className={styles.cHd}>## 品質チェック</span>
    {
      "\n- [ ] nameがディレクトリ名と一致している\n- [ ] descriptionにUse forキーワードがある\n- [ ] 本文が500行以内\n- [ ] metadataが最後フィールドでない（CLIバグ回避）"
    }
  </>
);

// Section 08 (advanced) のコードブロック本文
const ADVANCED_RESOURCE_PATTERN = (
  <>
    <span className={styles.cCm}>{"# SKILL.md の Instructions 内でスクリプトを相対パス参照"}</span>
    {"\n"}
    <span className={styles.cHd}>## Instructions</span>
    {"\n1. 対象コードの複雑度チェック:\n   "}
    <span className={styles.cCm}>
      {"# [./scripts/check-complexity.sh](./scripts/check-complexity.sh) を実行"}
    </span>
    {
      '\n   `bash .github/skills/refactoring/scripts/check-complexity.sh {ファイルパス}`\n\n2. 出力が "HIGH" の場合は分割リファクタリングを推奨\n   '
    }
    <span className={styles.cCm}>
      {"# 詳細基準: [./references/refactoring-guide.md](./references/refactoring-guide.md)"}
    </span>
    {"\n\n3. テンプレートを使って新しい関数を生成:\n   "}
    <span className={styles.cCm}>
      {"# [./assets/function-template.ts](./assets/function-template.ts) を参照"}
    </span>
    {"\n\n"}
    <span className={styles.cCm}>{"─────── scripts/check-complexity.sh ───────"}</span>
    {"\n"}
    <span className={styles.cKy}>#!/bin/bash</span>
    {"\n"}
    <span className={styles.cCo}>FILE=$1</span>
    {"\n"}
    <span className={styles.cCm}>{"# 行数が100行を超えたら HIGH を返す"}</span>
    {'\nLINES=$(wc -l < "$FILE")\n[ "$LINES" -gt 100 ] && echo "HIGH" || echo "LOW"'}
  </>
);

const ADVANCED_MCP_PATTERN = (
  <>
    <span className={styles.cKy}>---</span>
    {"\n"}
    <span className={styles.cGh}>name</span>
    {": "}
    <span className={styles.cSt}>jira-to-spec</span>
    {"\n"}
    <span className={styles.cGh}>description</span>
    {": "}
    <span className={styles.cSt}>&gt;-</span>
    {"\n  "}
    <span className={styles.cSt}>
      {
        "Jira EpicからSpec Kitのspec.mdを自動生成する。\n  Use for: Jira Epic, チケットから仕様書作成, spec自動生成, issue to spec."
      }
    </span>
    {"\n"}
    <span className={styles.cGh}>metadata</span>
    {":\n  "}
    <span className={styles.cGh}>version</span>
    {": "}
    <span className={styles.cSt}>&quot;1.0&quot;</span>
    {"\n"}
    <span className={styles.cKy}>---</span>
    {"\n\n"}
    <span className={styles.cHd}># Jira → spec.md 自動生成スキル</span>
    {"\n\n"}
    <span className={styles.cHd}>## Instructions</span>
    {"\n"}
    <span className={styles.cCm}>
      {"# GitHub MCP ServerはCopilot CLIにビルトイン（追加設定不要）"}
    </span>
    {"\n"}
    <span className={styles.cCm}>{"# JiraはMCPサーバーをmcp.jsonで事前設定が必要"}</span>
    {
      "\n\n1. Jira EpicのIDを確認する（例: PROJ-123）\n2. Jira MCPサーバーの `get_issue` ツールでEpic詳細を取得\n3. 以下の情報を抽出:\n   - User Stories（ユーザーゴール）\n   - Acceptance Criteria（受け入れ条件）\n   - Out of Scope（スコープ外）\n4. `.specify/templates/spec-template.md` に従ってspec.mdを生成\n5. `features/{epic-id}/spec.md` として保存\n\n"
    }
    <span className={styles.cHd}>## Constraints</span>
    {
      "\n- Epicの内容に存在しない機能を追加しない\n- 技術的な実装詳細は含めない（spec.mdはWHAT、plan.mdがHOW）"
    }
  </>
);
