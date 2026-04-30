import type { Metadata } from "next";
import type { ReactNode } from "react";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "GitHub Copilot コーディングエージェント開発ガイド | LLM コスト計算機",
  description:
    "GitHub Copilot .agent.md の完全ベストプラクティスガイド。フロントマター全仕様・ステップバイステップ作成・Handoffs（エージェント連鎖）・Subagents（サブエージェント）・MCP統合・マルチエージェント設計パターン・トラブルシューティングを 2026年3月最新の公式ドキュメント準拠で解説。",
};

type Source = {
  icon: string;
  title: string;
  href: string;
  url: string;
  desc: string;
};

const TOC_ITEMS = [
  { id: "s01", label: "1. 全体アーキテクチャと各ファイルの位置づけ" },
  { id: "s02", label: "2. .github/copilot-instructions.md" },
  { id: "s03", label: "3. .github/instructions/*.instructions.md" },
  { id: "s04", label: "4. .github/agents/*.agent.md" },
  { id: "s05", label: "4-1. 配置場所（スコープ別）" },
  { id: "s06", label: "4-2. フロントマター完全仕様" },
  { id: "s07", label: "4-3. ステップバイステップ作成ガイド" },
  { id: "s08", label: "4-4. Handoffs" },
  { id: "s09", label: "4-5. Subagents" },
  { id: "s10", label: "4-6. MCP統合" },
  { id: "s11", label: "4-7. 実践テンプレート集" },
  { id: "s12", label: "4-8. .agent.md ベストプラクティス 12則" },
  { id: "s13", label: "4-9. トラブルシューティング / 4-10. Good/Anti patGrid" },
  { id: "s14", label: "5. .github/skills/*/SKILL.md" },
  { id: "s15", label: "6. *.prompt.md / *.chatmode.md" },
  { id: "s16", label: "7. AGENTS.md" },
  { id: "s17", label: "8. ファイル選択の意思決定ツリー" },
  { id: "s18", label: "9. 絶対に避けるべき Anti-Patterns" },
  { id: "s19", label: "10. まとめ" },
  { id: "sources", label: "📚 参考ソース" },
] as const;

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const SOURCES: Source[] = [
  {
    icon: "🐙",
    title: "GitHub Docs: About custom agents（概念・スコープ）",
    href: "https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-custom-agents",
    url: "docs.github.com/en/copilot/concepts/agents/coding-agent/about-custom-agents",
    desc: "カスタムエージェントの概念・リポジトリ/ユーザー/組織レベル配置・対応IDE（VS Code・JetBrains・Eclipse・Xcode）",
  },
  {
    icon: "🛠️",
    title: "GitHub Docs: Creating custom agents（作成手順・IDE別）",
    href: "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents",
    url: "docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents",
    desc: "VS Code・JetBrains・Eclipse・Xcodeでの作成手順。Customize Agentボタン・handoffs設定・プロンプト最大30,000文字",
  },
  {
    icon: "📋",
    title: "GitHub Docs: Custom agents configuration（フロントマター完全仕様）",
    href: "https://docs.github.com/en/copilot/reference/custom-agents-configuration",
    url: "docs.github.com/en/copilot/reference/custom-agents-configuration",
    desc: `全YAMLフィールド仕様。mcp-serversのtype（local/http/sse）。シークレット構文（\${{secrets.*}} / \${VAR:-default}）。handoffs非対応（GitHub.com）の明記`,
  },
  {
    icon: "💻",
    title: "VS Code Docs: Custom agents in VS Code（handoffs・subagents）",
    href: "https://code.visualstudio.com/docs/copilot/customization/custom-agents",
    url: "code.visualstudio.com/docs/copilot/customization/custom-agents",
    desc: "handoffsの全プロパティ（label/agent/prompt/send）。model配列フォールバック。agents[]ホワイトリスト。chat.agentFilesLocations設定。2026年3月6日更新",
  },
  {
    icon: "🔀",
    title: "VS Code Docs: Subagents in VS Code（並列実行・コンテキスト分離）",
    href: "https://code.visualstudio.com/docs/copilot/agents/subagents",
    url: "code.visualstudio.com/docs/copilot/agents/subagents",
    desc: "Subagentsの概念（独立コンテキスト・並列実行）。tools:['agent']の必須設定。agents[]によるホワイトリスト制限。並列コードレビューパターン例",
  },
  {
    icon: "🔌",
    title: "GitHub Docs: Extend coding agent with MCP（mcp-servers設定）",
    href: "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp",
    url: "docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp",
    desc: "MCPサーバー設定JSON/YAML仕様。ビルトインサーバー（github/azure/cloudflare）。シークレット管理（copilot環境）。OAuth認証未対応の明記",
  },
  {
    icon: "📝",
    title: "GitHub Blog: How to write great agents.md（2,500リポジトリ分析）",
    href: "https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/",
    url: "github.blog/…/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/",
    desc: "2,500リポジトリ分析。descriptionの明確さと誤呼び出し率の相関。ベストプラクティステンプレート集",
  },
  {
    icon: "⭐",
    title: "awesome-copilot: agents.instructions.md（handoffs仕様・テンプレート集）",
    href: "https://github.com/github/awesome-copilot/blob/main/instructions/agents.instructions.md",
    url: "github.com/github/awesome-copilot/blob/main/instructions/agents.instructions.md",
    desc: "handoffs全フィールド（label/agent/prompt/send）詳細。コンテキスト保持の仕組み。手動vs自動送信の使い分け。Planning→Implementation→Review連鎖例",
  },
  {
    icon: "📖",
    title: "VS Code Docs: Using agents overview（Local/CLI/Cloud/Third-party）",
    href: "https://code.visualstudio.com/docs/copilot/agents/overview",
    url: "code.visualstudio.com/docs/copilot/agents/overview",
    desc: "エージェントの4カテゴリ（Local/CLI/Cloud/Third-party）。エージェント間ハンドオフ（セッション引き継ぎ）。/delegateコマンド。hooks統合",
  },
  {
    icon: "🎓",
    title: "Microsoft Learn: Configure Copilot & Create Custom Agents（ハンズオン）",
    href: "https://learn.microsoft.com/en-us/training/modules/configure-customize-github-copilot-visual-studio-code/",
    url: "learn.microsoft.com/en-us/training/modules/configure-customize-github-copilot-visual-studio-code/",
    desc: "Copilot設定・カスタムエージェント作成・handoffsでのマルチエージェントワークフロー実装のハンズオントレーニング",
  },
  {
    icon: "🏗️",
    title: "Utkarsh Shigihalli: Mastering Copilot Customisation（実践ガイド）",
    href: "https://onlyutkarsh.com/posts/2026/github-copilot-customization/",
    url: "onlyutkarsh.com/posts/2026/github-copilot-customization/",
    desc: "model配列フォールバック。Planning→Development連鎖の実装例。Instructions・Prompts・Agents・Skillsの使い分け実践解説（2026年1月）",
  },
  {
    icon: "🔍",
    title: "DeepWiki: awesome-copilot Agent Architecture（検証パイプライン）",
    href: "https://deepwiki.com/github/awesome-copilot/2.1-agent-architecture-and-definition",
    url: "deepwiki.com/github/awesome-copilot/2.1-agent-architecture-and-definition",
    desc: "agent.mdのパース・バリデーション仕様。必須フィールド（description 1-500文字）。MCP設定パターン（http/local/sse）。ネーミング規約",
  },
  {
    icon: "🎯",
    title: "DEV Community: Copilot Instructions vs Agents vs Skills（比較ガイド）",
    href: "https://dev.to/pwd9000/github-copilot-instructions-vs-prompts-vs-custom-agents-vs-skills-vs-x-vs-why-339l",
    url: "dev.to/pwd9000/github-copilot-instructions-vs-prompts-vs-custom-agents-vs-skills-vs-x-vs-why-339l",
    desc: "Instructions/Prompts/Agents/Skills/MCP/Hooksの選択フローチャート。Handoffsとサブエージェントの実践使い分け。組織レベル共有の解説（2026年3月）",
  },
  {
    icon: "🔔",
    title: "GitHub Changelog: Copilot CLI GA（Feb 2026）",
    href: "https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/",
    url: "github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/",
    desc: "Copilot CLI GA・Skills / Custom Agents / Hooks / /diffコマンドの正式リリース。カスタムエージェントのCLI対応が確定",
  },
  {
    icon: "🏢",
    title: "Microsoft Learn: Visual Studio Custom Agents（Visual Studio 2026）",
    href: "https://learn.microsoft.com/en-us/visualstudio/ide/copilot-specialized-agents?view=visualstudio",
    url: "learn.microsoft.com/en-us/visualstudio/ide/copilot-specialized-agents",
    desc: "Visual Studio 2026 v18.4+でのカスタムエージェント設定。@debugger/@profiler/@testなどビルトインエージェント。MCP連携でext knowledge source接続",
  },
];

export default function CopilotAgentPage() {
  return (
    <div className={styles.root}>
      <div className={styles.wrap}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroBadge}>🐙 GitHub Copilot 完全ガイド 2026年3月版</div>
          <h1>
            GitHub Copilot <em>.agent.md</em> 完全
            <br />
            ベストプラクティスガイド
          </h1>
          <p>
            フロントマター全仕様 / ステップバイステップ作成 / Handoffs（エージェント連鎖） /
            Subagents（サブエージェント） / MCP統合 / マルチエージェント設計パターン /
            トラブルシューティング ——
            2026年3月最新の公式ドキュメント準拠で初学者から上級者まで対応した決定版ガイド。
          </p>
          <div className={styles.heroChips}>
            <span className={styles.heroChip}>フロントマター完全仕様</span>
            <span className={styles.heroChip}>Handoffs（ハンドオフ）</span>
            <span className={styles.heroChip}>Subagents（サブエージェント）</span>
            <span className={styles.heroChip}>MCP mcp-servers設定</span>
            <span className={styles.heroChip}>マルチエージェントパターン</span>
            <span className={styles.heroChip}>7ステップ作成ガイド</span>
            <span className={styles.heroChip}>ベストプラクティス12則</span>
            <span className={styles.heroChip}>トラブルシューティング</span>
          </div>
        </div>

        {/* TOC（合成 — legacy HTML に存在しないため移行時に追加）*/}
        <nav className={styles.toc}>
          <div className={styles.tocTitle}>目次</div>
          {TOC_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Sections — faithful content filled in per-section commits */}
        <section id="s01" className={styles.sec}>
          <div className={styles.secHead}>
            <span className={styles.secNum}>1</span>
            <h2>全体アーキテクチャと各ファイルの位置づけ</h2>
          </div>
          <div className={styles.card}>
            <p>
              GitHub Copilot は他のツールと比較して
              <strong>最も多様なMarkdownファイル体系</strong>
              を持ちます。「常時ロード型」「パスマッチ型」「オンデマンド型」「エージェント定義型」の4カテゴリが存在し、それぞれ役割が明確に分かれています。さらに{" "}
              <strong>AGENTS.md</strong> によって Claude Code・Gemini CLI・Codex
              とのクロスツール互換性も確保されています。
            </p>
          </div>
          <div className={styles.matrix}>
            <div className={styles.matrixTitle}>
              カスタム指示の読み込み優先度 — 組織 → リポジトリ → パス → スキル（後が優先）
            </div>
            <div className={styles.matrixRow}>
              <div className={`${styles.mxBox} ${styles.mxOrg}`}>
                🏢 Organization
                <br />
                <small>org-level instructions</small>
              </div>
              <span className={styles.mxArrow}>→</span>
              <div className={`${styles.mxBox} ${styles.mxRepo}`}>
                📁 Repository
                <br />
                <small>
                  copilot-instructions.md
                  <br />
                  AGENTS.md
                </small>
              </div>
              <span className={styles.mxArrow}>→</span>
              <div className={`${styles.mxBox} ${styles.mxPath}`}>
                📂 Path-specific
                <br />
                <small>
                  *.instructions.md
                  <br />
                  (applyTo)
                </small>
              </div>
              <span className={styles.mxArrow}>→</span>
              <div className={`${styles.mxBox} ${styles.mxSkill}`}>
                ⚡ On-demand
                <br />
                <small>
                  SKILL.md
                  <br />
                  （遅延ロード）
                </small>
              </div>
            </div>
            <div className={styles.matrixNote}>
              Coding Agent の優先度: <strong>リポジトリ指示 → 組織指示</strong>
              （リポジトリが最優先）
              <br />
              <code>excludeAgent</code>{" "}
              プロパティで指示ファイルを特定エージェントから除外可能（2025年11月〜）
            </div>
          </div>
          <div className={styles.filetreeOuter}>
            <div className={styles.filetreeBar}>
              <span className={styles.fbDot} style={{ background: "#ff6057" }} />
              <span className={styles.fbDot} style={{ background: "#ffbd2e" }} />
              <span className={styles.fbDot} style={{ background: "#27c93f" }} />
              <span
                style={{
                  marginLeft: "10px",
                  color: "#8b949e",
                  fontSize: "12px",
                  fontFamily: "'Cascadia Code','Consolas',monospace",
                }}
              >
                project-root/ — GitHub Copilot エコシステム ファイル構造
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1000 880"
              width="100%"
              style={{ display: "block" }}
              fontFamily="'Cascadia Code','Consolas',monospace"
              role="img"
              aria-label="GitHub Copilot エコシステム ファイル構造ツリー図"
            >
              <title>GitHub Copilot エコシステム ファイル構造ツリー図</title>
              <defs>
                <linearGradient id="gh1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#1f883d" }} />
                  <stop offset="100%" style={{ stopColor: "#3fb950" }} />
                </linearGradient>
                <linearGradient id="gh2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#0969da" }} />
                  <stop offset="100%" style={{ stopColor: "#58a6ff" }} />
                </linearGradient>
                <linearGradient id="gh3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#8250df" }} />
                  <stop offset="100%" style={{ stopColor: "#bc8cff" }} />
                </linearGradient>
                <linearGradient id="gh4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#bf8700" }} />
                  <stop offset="100%" style={{ stopColor: "#d29922" }} />
                </linearGradient>
                <linearGradient id="gh5" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#cf222e" }} />
                  <stop offset="100%" style={{ stopColor: "#f85149" }} />
                </linearGradient>
                <linearGradient id="gh6" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#0a7a5c" }} />
                  <stop offset="100%" style={{ stopColor: "#2da672" }} />
                </linearGradient>
                <linearGradient id="gh7" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#0078d4" }} />
                  <stop offset="100%" style={{ stopColor: "#58a6ff" }} />
                </linearGradient>
              </defs>
              <rect width="1000" height="880" fill="#0d1117" />
              <rect
                x="668"
                y="16"
                width="316"
                height="304"
                rx="10"
                fill="#161b22"
                stroke="#21262d"
                strokeWidth="1"
              />
              <text
                x="826"
                y="38"
                textAnchor="middle"
                fill="#484f58"
                fontSize="11"
                letterSpacing="1.5"
              >
                LEGEND
              </text>
              <rect x="684" y="50" width="22" height="22" rx="5" fill="url(#gh1)" />
              <text x="695" y="65" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ①
              </text>
              <text x="714" y="65" fontSize="12" fill="#c9d1d9">
                copilot-instructions.md（常時ロード）
              </text>
              <rect x="684" y="82" width="22" height="22" rx="5" fill="url(#gh2)" />
              <text x="695" y="97" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ②
              </text>
              <text x="714" y="97" fontSize="12" fill="#c9d1d9">
                *.instructions.md（パスマッチ型）
              </text>
              <rect x="684" y="114" width="22" height="22" rx="5" fill="url(#gh3)" />
              <text x="695" y="129" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ③
              </text>
              <text x="714" y="129" fontSize="12" fill="#c9d1d9">
                *.agent.md（エージェント定義）
              </text>
              <rect x="684" y="146" width="22" height="22" rx="5" fill="url(#gh4)" />
              <text x="695" y="161" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ④
              </text>
              <text x="714" y="161" fontSize="12" fill="#c9d1d9">
                SKILL.md（遅延ロード型スキル）
              </text>
              <rect x="684" y="178" width="22" height="22" rx="5" fill="url(#gh5)" />
              <text x="695" y="193" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑤
              </text>
              <text x="714" y="193" fontSize="12" fill="#c9d1d9">
                *.prompt.md（再利用可能プロンプト）
              </text>
              <rect x="684" y="210" width="22" height="22" rx="5" fill="url(#gh6)" />
              <text x="695" y="225" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑥
              </text>
              <text x="714" y="225" fontSize="12" fill="#c9d1d9">
                *.chatmode.md（カスタムチャットモード）
              </text>
              <rect x="684" y="242" width="22" height="22" rx="5" fill="url(#gh7)" />
              <text x="695" y="257" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑦
              </text>
              <text x="714" y="257" fontSize="12" fill="#c9d1d9">
                AGENTS.md（クロスツール共通）
              </text>
              <rect x="684" y="274" width="52" height="22" rx="5" fill="#1c2128" />
              <text
                x="710"
                y="289"
                textAnchor="middle"
                fill="#6e7681"
                fontSize="11"
                fontWeight="700"
              >
                📁 DIR
              </text>
              <text x="744" y="289" fontSize="12" fill="#484f58">
                ディレクトリ
              </text>
              <line x1="44" y1="50" x2="44" y2="846" stroke="#21262d" strokeWidth="1.5" />
              <line x1="44" y1="52" x2="70" y2="52" stroke="#21262d" strokeWidth="1.5" />
              <line x1="44" y1="100" x2="70" y2="100" stroke="#21262d" strokeWidth="1.5" />
              <line x1="86" y1="100" x2="86" y2="670" stroke="#21262d" strokeWidth="1.5" />
              <line x1="86" y1="132" x2="112" y2="132" stroke="#21262d" strokeWidth="1.5" />
              <line x1="86" y1="170" x2="112" y2="170" stroke="#21262d" strokeWidth="1.5" />
              <line x1="128" y1="170" x2="128" y2="238" stroke="#21262d" strokeWidth="1.5" />
              <line x1="128" y1="202" x2="154" y2="202" stroke="#21262d" strokeWidth="1.5" />
              <line x1="128" y1="236" x2="154" y2="236" stroke="#21262d" strokeWidth="1.5" />
              <line x1="86" y1="278" x2="112" y2="278" stroke="#21262d" strokeWidth="1.5" />
              <line x1="128" y1="278" x2="128" y2="384" stroke="#21262d" strokeWidth="1.5" />
              <line x1="128" y1="310" x2="154" y2="310" stroke="#21262d" strokeWidth="1.5" />
              <line x1="128" y1="348" x2="154" y2="348" stroke="#21262d" strokeWidth="1.5" />
              <line x1="128" y1="386" x2="154" y2="386" stroke="#21262d" strokeWidth="1.5" />
              <line x1="86" y1="428" x2="112" y2="428" stroke="#21262d" strokeWidth="1.5" />
              <line x1="128" y1="428" x2="128" y2="502" stroke="#21262d" strokeWidth="1.5" />
              <line x1="128" y1="460" x2="154" y2="460" stroke="#21262d" strokeWidth="1.5" />
              <line x1="170" y1="460" x2="170" y2="500" stroke="#21262d" strokeWidth="1.5" />
              <line x1="170" y1="498" x2="196" y2="498" stroke="#21262d" strokeWidth="1.5" />
              <line x1="86" y1="548" x2="112" y2="548" stroke="#21262d" strokeWidth="1.5" />
              <line x1="128" y1="548" x2="128" y2="584" stroke="#21262d" strokeWidth="1.5" />
              <line x1="128" y1="582" x2="154" y2="582" stroke="#21262d" strokeWidth="1.5" />
              <line x1="86" y1="626" x2="112" y2="626" stroke="#21262d" strokeWidth="1.5" />
              <line x1="128" y1="626" x2="128" y2="660" stroke="#21262d" strokeWidth="1.5" />
              <line x1="128" y1="658" x2="154" y2="658" stroke="#21262d" strokeWidth="1.5" />
              <line x1="44" y1="718" x2="70" y2="718" stroke="#21262d" strokeWidth="1.5" />
              <line x1="44" y1="846" x2="70" y2="846" stroke="#21262d" strokeWidth="1.5" />
              <text x="20" y="30" fontSize="16" fill="#3fb950">
                📁
              </text>
              <text x="42" y="30" fontSize="14" fontWeight="700" fill="#3fb950">
                {"  project-root/"}
              </text>
              <text x="78" y="58" fontSize="14" fill="#7ee787">
                📄
              </text>
              <text x="98" y="58" fontSize="13.5" fontWeight="700" fill="#7ee787">
                AGENTS.md
              </text>
              <rect x="198" y="43" width="22" height="22" rx="5" fill="url(#gh7)" />
              <text x="209" y="58" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑦
              </text>
              <text x="228" y="58" fontSize="12" fill="#6e7681">
                クロスツール共通指示（Claude / Gemini / Codex と共有）
              </text>
              <text x="228" y="74" fontSize="11" fill="#2d3a4a">
                {"  ※ Coding Agent が CLAUDE.md / GEMINI.md も自動認識"}
              </text>
              <text x="78" y="106" fontSize="14" fill="#58a6ff">
                📁
              </text>
              <text x="98" y="106" fontSize="14" fontWeight="700" fill="#58a6ff">
                .github/
              </text>
              <text x="120" y="138" fontSize="14" fill="#7ee787">
                📄
              </text>
              <text x="140" y="138" fontSize="13.5" fontWeight="700" fill="#7ee787">
                copilot-instructions.md
              </text>
              <rect x="334" y="123" width="22" height="22" rx="5" fill="url(#gh1)" />
              <text x="345" y="138" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ①
              </text>
              <text x="364" y="138" fontSize="12" fill="#6e7681">
                常時ロード：プロジェクト全体の共通指示
              </text>
              <text x="120" y="176" fontSize="14" fill="#58a6ff">
                📂
              </text>
              <text x="140" y="176" fontSize="13.5" fontWeight="700" fill="#58a6ff">
                instructions/
              </text>
              <text x="162" y="208" fontSize="13" fill="#79c0ff">
                📄
              </text>
              <text x="182" y="208" fontSize="13" fill="#79c0ff">
                frontend.instructions.md
              </text>
              <rect x="370" y="193" width="22" height="22" rx="5" fill="url(#gh2)" />
              <text x="381" y="208" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ②
              </text>
              <text x="400" y="208" fontSize="12" fill="#6e7681">
                {'applyTo: "src/components/**" でパスマッチ'}
              </text>
              <text x="162" y="242" fontSize="13" fill="#79c0ff">
                📄
              </text>
              <text x="182" y="242" fontSize="13" fill="#79c0ff">
                testing.instructions.md
              </text>
              <rect x="356" y="227" width="22" height="22" rx="5" fill="url(#gh2)" opacity="0.8" />
              <text x="367" y="242" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ②
              </text>
              <text x="386" y="242" fontSize="12" fill="#6e7681">
                {'applyTo: "**/*.test.*" / excludeAgent: "code-review"'}
              </text>
              <text x="120" y="284" fontSize="14" fill="#58a6ff">
                📂
              </text>
              <text x="140" y="284" fontSize="13.5" fontWeight="700" fill="#58a6ff">
                agents/
              </text>
              <text x="162" y="316" fontSize="13" fill="#bc8cff">
                📝
              </text>
              <text x="182" y="316" fontSize="13" fill="#bc8cff">
                test-agent.agent.md
              </text>
              <rect x="348" y="301" width="22" height="22" rx="5" fill="url(#gh3)" />
              <text x="359" y="316" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ③
              </text>
              <text x="378" y="316" fontSize="12" fill="#6e7681">
                @test-agent として呼び出せるQAエージェント
              </text>
              <text x="162" y="354" fontSize="13" fill="#bc8cff">
                📝
              </text>
              <text x="182" y="354" fontSize="13" fill="#bc8cff">
                docs-agent.agent.md
              </text>
              <rect x="348" y="339" width="22" height="22" rx="5" fill="url(#gh3)" opacity="0.8" />
              <text x="359" y="354" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ③
              </text>
              <text x="378" y="354" fontSize="12" fill="#6e7681">
                @docs-agent：ドキュメント生成専門
              </text>
              <text x="162" y="392" fontSize="13" fill="#bc8cff">
                📝
              </text>
              <text x="182" y="392" fontSize="13" fill="#bc8cff">
                security-agent.agent.md
              </text>
              <rect x="360" y="377" width="22" height="22" rx="5" fill="url(#gh3)" opacity="0.7" />
              <text x="371" y="392" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ③
              </text>
              <text x="390" y="392" fontSize="12" fill="#6e7681">
                @security-agent：セキュリティ監査専門
              </text>
              <text x="120" y="434" fontSize="14" fill="#58a6ff">
                📂
              </text>
              <text x="140" y="434" fontSize="13.5" fontWeight="700" fill="#58a6ff">
                skills/
              </text>
              <text x="220" y="434" fontSize="12" fill="#2d3a4a">
                {"  ← anthropics/skills と共通フォーマット"}
              </text>
              <text x="162" y="466" fontSize="13" fill="#58a6ff">
                📂
              </text>
              <text x="182" y="466" fontSize="13" fontWeight="700" fill="#58a6ff">
                webapp-testing/
              </text>
              <text x="204" y="504" fontSize="13" fill="#d29922">
                📝
              </text>
              <text x="224" y="504" fontSize="13" fill="#d29922">
                SKILL.md
              </text>
              <rect x="304" y="489" width="22" height="22" rx="5" fill="url(#gh4)" />
              <text x="315" y="504" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ④
              </text>
              <text x="334" y="504" fontSize="12" fill="#6e7681">
                遅延ロード：Playwright テストスキル（マッチ時のみ）
              </text>
              <text x="120" y="554" fontSize="14" fill="#58a6ff">
                📂
              </text>
              <text x="140" y="554" fontSize="13.5" fontWeight="700" fill="#58a6ff">
                prompts/
              </text>
              <text x="162" y="588" fontSize="13" fill="#f85149">
                📄
              </text>
              <text x="182" y="588" fontSize="13" fill="#f85149">
                my-pull-requests.prompt.md
              </text>
              <rect x="390" y="573" width="22" height="22" rx="5" fill="url(#gh5)" />
              <text x="401" y="588" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑤
              </text>
              <text x="420" y="588" fontSize="12" fill="#6e7681">
                再利用プロンプト（/my-pull-requests で実行）
              </text>
              <text x="120" y="632" fontSize="14" fill="#58a6ff">
                📂
              </text>
              <text x="140" y="632" fontSize="13.5" fontWeight="700" fill="#58a6ff">
                chatmodes/
              </text>
              <text x="162" y="664" fontSize="13" fill="#2da672">
                📄
              </text>
              <text x="182" y="664" fontSize="13" fill="#2da672">
                databaseadmin.chatmode.md
              </text>
              <rect x="386" y="649" width="22" height="22" rx="5" fill="url(#gh6)" />
              <text x="397" y="664" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑥
              </text>
              <text x="416" y="664" fontSize="12" fill="#6e7681">
                DBA ペルソナ（ツール + 指示セット）
              </text>
              <text x="78" y="724" fontSize="14" fill="#7ee787">
                📄
              </text>
              <text x="98" y="724" fontSize="13.5" fontWeight="700" fill="#58a6ff">
                .github/copilot-instructions.md
              </text>
              <rect x="302" y="709" width="22" height="22" rx="5" fill="url(#gh1)" opacity="0.75" />
              <text x="313" y="724" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ①
              </text>
              <text x="332" y="724" fontSize="12" fill="#6e7681">
                （ルートの .github/ 内に配置）
              </text>
              <line x1="44" y1="760" x2="70" y2="760" stroke="#21262d" strokeWidth="1.5" />
              <text x="78" y="766" fontSize="14" fill="#58a6ff">
                📁
              </text>
              <text x="98" y="766" fontSize="14" fontWeight="700" fill="#58a6ff">
                src/
              </text>
              <line x1="86" y1="766" x2="86" y2="802" stroke="#21262d" strokeWidth="1.5" />
              <line x1="86" y1="800" x2="112" y2="800" stroke="#21262d" strokeWidth="1.5" />
              <text x="120" y="806" fontSize="13" fill="#58a6ff">
                📂
              </text>
              <text x="140" y="806" fontSize="13" fontWeight="700" fill="#58a6ff">
                components/
              </text>
              <text x="240" y="806" fontSize="12" fill="#2d3a4a">
                {"  ← frontend.instructions.md の applyTo 対象"}
              </text>
              <text x="78" y="852" fontSize="14" fill="#58a6ff">
                📘
              </text>
              <text x="98" y="852" fontSize="14" fontWeight="700" fill="#2da672">
                README.md
              </text>
              <rect x="204" y="837" width="22" height="22" rx="5" fill="url(#gh6)" />
              <text x="215" y="852" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                ⑥
              </text>
              <text x="234" y="852" fontSize="12" fill="#6e7681">
                人間向け：エージェント構成・セットアップ手順
              </text>
            </svg>
          </div>
        </section>
        <section id="s02" className={styles.sec} />
        <section id="s03" className={styles.sec} />
        <section id="s04" className={styles.sec} />
        <section id="s05" className={styles.sec} />
        <section id="s06" className={styles.sec} />
        <section id="s07" className={styles.sec} />
        <section id="s08" className={styles.sec} />
        <section id="s09" className={styles.sec} />
        <section id="s10" className={styles.sec} />
        <section id="s11" className={styles.sec} />
        <section id="s12" className={styles.sec} />
        <section id="s13" className={styles.sec} />
        <hr />
        <section id="s14" className={styles.sec} />
        <section id="s15" className={styles.sec} />
        <section id="s16" className={styles.sec} />
        <section id="s17" className={styles.sec} />
        <section id="s18" className={styles.sec} />
        <section id="s19" className={styles.sec} />
        <hr />

        {/* Sources */}
        <section id="sources" className={styles.sec}>
          <div className={styles.secHead}>
            <span className={styles.secNum}>📚</span>
            <h2>参考ソース（公式・一次情報優先）— 2026年3月更新版</h2>
          </div>
          <div className={styles.srcGrid}>
            {SOURCES.map((src) => (
              <div key={src.href} className={styles.srcCard}>
                <div className={styles.srcIcon}>{src.icon}</div>
                <div className={styles.srcTitle}>{src.title}</div>
                <div className={styles.srcUrl}>
                  <Ext href={src.href}>{src.url}</Ext>
                </div>
                <div className={styles.srcDesc}>{src.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
