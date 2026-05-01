import type { Metadata } from "next";
import type { ReactNode } from "react";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "GitHub Copilot コーディングエージェント開発ガイド | LLM コスト計算機",
  description:
    "GitHub Copilot .agent.md の完全ベストプラクティスガイド。フロントマター全仕様・ステップバイステップ作成・Handoffs（エージェント連鎖）・Subagents（サブエージェント）・MCP統合・マルチエージェント設計パターン・トラブルシューティングを 2026年版の公式ドキュメント準拠で解説。",
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
  { id: "s13", label: "4-9. トラブルシューティング / 4-10. Good & Anti Patterns" },
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
          <div className={styles.heroBadge}>🐙 GitHub Copilot 完全ガイド 2026年版</div>
          <h1>
            GitHub Copilot <em>.agent.md</em> 完全
            <br />
            ベストプラクティスガイド
          </h1>
          <p>
            フロントマター全仕様 / ステップバイステップ作成 / Handoffs（エージェント連鎖） /
            Subagents（サブエージェント） / MCP統合 / マルチエージェント設計パターン /
            トラブルシューティング ——
            2026年版の公式ドキュメント準拠で初学者から上級者まで対応した決定版ガイド。
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
        <section id="s02" className={styles.sec}>
          <div className={styles.secHead}>
            <span className={styles.secNum}>2</span>
            <h2>
              <span className={styles.mono}>.github/copilot-instructions.md</span>
              {" — 常時ロード型グローバル指示"}
            </h2>
          </div>
          <div className={`${styles.alert} ${styles.ai}`}>
            <span className={styles.alertIcon}>ℹ️</span>
            <div className={styles.alertBody}>
              <strong>
                必ず <code>.github/</code> 直下に配置する
              </strong>
              <code>copilot-instructions.md</code> はワークスペースルートの <code>.github/</code>{" "}
              フォルダ内に置く必要があります。他の場所に置いても読み込まれません。この1ファイルが
              Chat・Agent Mode・Code Review・Copilot Coding Agent のすべてで常時ロードされます。
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              📋 copilot-instructions.md に書くべきこと / 書かないべきこと
            </div>
            <div className={styles.patGrid}>
              <div className={`${styles.pat} ${styles.patOk}`}>
                <div className={styles.patLabel}>✅ 書くべき内容</div>
                <ul>
                  <li>プロジェクト概要・目的（2〜3文）</li>
                  <li>技術スタック・主要バージョン</li>
                  <li>ビルド・テスト・Lint コマンド</li>
                  <li>コーディング規約（コンパクトに）</li>
                  <li>PR メッセージのフォーマット</li>
                  <li>サブエージェント委譲ルール</li>
                  <li>禁止操作・危険コマンドの明示</li>
                  <li>ペルソナの定義（「新人開発者向けに」等）</li>
                </ul>
              </div>
              <div className={`${styles.pat} ${styles.patNg}`}>
                <div className={styles.patLabel}>✗ 書かないべき内容</div>
                <ul>
                  <li>特定パスにしか使わない詳細ルール（*.instructions.md に分離）</li>
                  <li>専門的な手順（SKILL.md に分離）</li>
                  <li>長大なコードスニペット（コンテキスト浪費）</li>
                  <li>機密情報・API キー</li>
                  <li>修正履歴・変更ログ</li>
                  <li>ツール設定（MCP は別ファイルへ）</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>.github/copilot-instructions.md</span>
              <span className={styles.codeLang}>Markdown</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.ch}># PROJECT: my-saas-app</span>
              {"\n\n"}
              <span className={styles.cm}>## Overview</span>
              {"\n"}
              {"Next.js 15 App Router + Supabase + Stripe のマルチテナント SaaS。\n"}
              {"本番: Vercel Edge Runtime / DB: Supabase (PostgreSQL) / AI: GitHub Models。\n\n"}
              <span className={styles.cm}>## Tech Stack</span>
              {"\n"}
              {"- Frontend: Next.js 15 (App Router), TypeScript 5.x, Tailwind CSS\n"}
              {"- Backend:  Supabase Edge Functions (Deno 2.x)\n"}
              {"- Auth:     Supabase Auth + RLS (Row Level Security)\n"}
              {"- Payment:  Stripe Checkout / Webhooks\n"}
              {"- Testing:  Vitest (unit) + Playwright (E2E)\n\n"}
              <span className={styles.cm}>## Persona</span>
              {"\n"}
              {"シニアフルスタックエンジニアとして振る舞うこと。\n"}
              {"コードを変更する前に必ず計画を要約すること。\n\n"}
              <span className={styles.cm}>## Build & Test (CRITICAL: run after every change)</span>
              {"\n"}
              {"- Build:    "}
              <span className={styles.cs}>{"`pnpm build`"}</span>
              {"\n- Test:     "}
              <span className={styles.cs}>{"`pnpm test`"}</span>
              {"  — "}
              <span className={styles.cw}>変更後は必ず実行すること</span>
              {"\n- E2E:      "}
              <span className={styles.cs}>{"`pnpm test:e2e`"}</span>
              {" (Playwright)\n- Lint:     "}
              <span className={styles.cs}>{"`pnpm lint`"}</span>
              {"    — "}
              <span className={styles.cw}>PR前に必ず実行すること</span>
              {"\n\n"}
              <span className={styles.cm}>## Coding Standards</span>
              {"\n"}
              {"- TypeScript strict モード必須\n"}
              {"- エラーは Result<T,E> 型でラップ（throw 禁止）\n"}
              {"- Supabase クエリは必要カラムのみ .select('col1, col2')\n"}
              {"- React Server Components を優先し 'use client' を最小化\n\n"}
              <span className={styles.cm}>## Sub-Agent Dispatch (for Copilot Coding Agent)</span>
              {"\n"}
              <span className={styles.cw}>@test-agent</span>
              {"  → テスト作成・実行・失敗分析\n"}
              <span className={styles.cw}>@docs-agent</span>
              {"  → ドキュメント生成・更新 (docs/ のみ)\n"}
              <span className={styles.cw}>@security-agent</span>
              {" → セキュリティ監査（コード変更なし）\n\n"}
              <span className={styles.cm}>## PR Message Format</span>
              {"\n"}
              <span className={styles.cs}>
                {
                  "```\n## Summary\n[2〜3文の概要]\n\n## Changes\n- [変更点]\n\n## Tests\n- [テスト内容]\n```"
                }
              </span>
              {"\n\n"}
              <span className={styles.cm}>## Forbidden Operations</span>
              {"\n"}
              {"- "}
              <span className={styles.cw}>{"`supabase db reset`"}</span>
              {" は絶対に実行しない\n"}
              {"- "}
              <span className={styles.cw}>{"`.env.production`"}</span>
              {" の読み書き禁止"}
            </div>
          </div>
        </section>
        <section id="s03" className={styles.sec}>
          <div className={styles.secHead}>
            <span className={styles.secNum}>3</span>
            <h2>
              <span className={styles.mono}>.github/instructions/*.instructions.md</span>
              {" — パスマッチ型指示"}
            </h2>
            <span className={styles.note}>2025年7月〜 GA</span>
          </div>
          <div className={styles.card}>
            <p>
              <code>*.instructions.md</code> は YAML フロントマターの <code>applyTo</code>{" "}
              でパスグロブを指定することで、
              <strong>特定のファイル・ディレクトリを操作しているときのみ自動適用</strong>
              されます。さらに <code>excludeAgent</code>{" "}
              プロパティで特定のエージェント（coding-agent・code-review）から除外できます。
            </p>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>.github/instructions/frontend.instructions.md</span>
              <span className={styles.codeLang}>Markdown + YAML</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>applyTo</span>
              {": "}
              <span className={styles.cv}>{'"src/components/**,src/app/**"'}</span>
              {"\n"}
              <span className={styles.cc}>
                {"# この指示は src/components/ と src/app/ への変更時のみ適用される"}
              </span>
              {"\n"}
              <span className={styles.cc}>
                {'# excludeAgent: "code-review"  # コードレビューから除外する場合'}
              </span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              <span className={styles.ch}>{"## Frontend Development Rules"}</span>
              {"\n\n"}
              <span className={styles.cm}>{"### Component Structure"}</span>
              {"\n"}
              {"- React Server Components (RSC) を優先し、'use client' は最小限に\n"}
              {"- コンポーネントは 150行以下に収める\n"}
              {"- Props は明示的な TypeScript インターフェースを定義する\n"}
              {"- CSS は Tailwind ユーティリティクラスのみ（インラインスタイル禁止）\n\n"}
              <span className={styles.cm}>{"### Naming Conventions"}</span>
              {"\n"}
              {"- コンポーネントファイル: PascalCase.tsx (例: UserCard.tsx)\n"}
              {"- ページファイル: page.tsx (Next.js App Router 規約)\n"}
              {"- フック: use プレフィックス (例: useUserProfile)\n\n"}
              <span className={styles.cm}>{"### DO THIS / NOT THIS"}</span>
              {"\n"}
              {"✅ 良い例:\n"}
              <span className={styles.cs}>
                {
                  "```tsx\n// Server Component（デフォルト）\nexport default async function UserList() {\n  const users = await getUsers()\n  return <ul>{users.map(u => <UserItem key={u.id} user={u} />)}</ul>\n}\n```"
                }
              </span>
              {"\n\n"}
              {"❌ 悪い例:\n"}
              <span className={styles.cs}>
                {
                  "```tsx\n// 不要な 'use client' の使用\n'use client'\nexport default function UserList() { ... } // fetchをuseEffectで行っている\n```"
                }
              </span>
            </div>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>.github/instructions/testing.instructions.md</span>
              <span className={styles.codeLang}>Markdown + YAML</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>applyTo</span>
              {": "}
              <span className={styles.cv}>
                {'"**/*.test.ts,**/*.test.tsx,**/*.spec.ts,tests/**"'}
              </span>
              {"\n"}
              <span className={styles.cm}>excludeAgent</span>
              {": "}
              <span className={styles.cv}>{'"code-review"'}</span>
              {"\n"}
              <span className={styles.cc}>
                {"# Copilot code review はこの指示を読まない（テスト専用ルールを汚染しない）"}
              </span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              <span className={styles.ch}>{"## Testing Standards"}</span>
              {"\n\n"}
              <span className={styles.cm}>{"### Unit Tests (Vitest)"}</span>
              {"\n"}
              {"- テストは AAA (Arrange / Act / Assert) 形式で記述\n"}
              {"- モックは vi.mock() を使用、過剰なモックは避ける\n"}
              {"- テスト名は「[条件] [状態] [期待結果]」形式\n\n"}
              <span className={styles.cm}>{"### E2E Tests (Playwright)"}</span>
              {"\n"}
              {"- ページオブジェクトパターンを使用 (tests/pages/ に配置)\n"}
              {"- data-testid 属性でセレクタを指定（クラス名ベースは禁止）\n"}
              {"- 各テストは独立して実行できること（beforeEach で状態をリセット）"}
            </div>
          </div>
          <div className={`${styles.alert} ${styles.ag}`}>
            <span className={styles.alertIcon}>💡</span>
            <div className={styles.alertBody}>
              <strong>excludeAgent で指示の適用先をコントロールする（2025年11月〜）</strong>
              <code>{'excludeAgent: "code-review"'}</code>
              {" を設定するとコードレビューに、"}
              <code>{'excludeAgent: "coding-agent"'}</code>
              {
                " を設定すると Copilot Coding Agent に指示が適用されなくなります。レビュー専用・実装専用の指示を分離するのに有効です。"
              }
            </div>
          </div>
        </section>
        <section id="s04" className={styles.sec}>
          <div className={styles.secHead}>
            <span className={styles.secNum}>4</span>
            <h2>
              <span className={styles.mono}>.github/agents/*.agent.md</span>
              {" — カスタムエージェント完全ガイド"}
            </h2>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              🤖 .agent.md とは — 「専門チームメイト」を定義するファイル
            </div>
            <p>
              <code>*.agent.md</code>
              {"は"}
              <strong>特定のペルソナ・ツールセット・指示・ハンドオフを持つ専門エージェント</strong>
              {"を定義するMarkdownファイルです。定義したエージェントは "}
              <code>@エージェント名</code>
              {
                " で呼び出せ、GitHub.com（Coding Agent）・VS Code・JetBrains・Eclipse・Xcodeのすべてで動作します。"
              }
            </p>
            <p>
              {"エージェントは「常に同じ指示とコンテキストを繰り返し与える」必要をなくし、"}
              <strong>セキュリティレビュー専門・テスト専門・ドキュメント専門</strong>
              {"など、役割ごとに特化した振る舞いを一度定義するだけで再利用できます。"}
            </p>
          </div>
        </section>
        <section id="s05" className={styles.sec}>
          <div
            className={styles.secHead}
            style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px solid var(--border2)" }}
          >
            <h2 style={{ fontSize: "1.1rem" }}>
              {"4-1. 配置場所（スコープ別） "}
              <span className={styles.newB}>2026 更新</span>
            </h2>
          </div>
          <div className={styles.scopeGrid}>
            <div className={styles.scopeCard}>
              <div className={styles.scopeCardIcon}>📁</div>
              <div className={styles.scopeCardTtl}>リポジトリレベル（推奨）</div>
              <div className={styles.scopeCardBody}>
                <code>.github/agents/AGENT-NAME.agent.md</code>
                <br />
                {"そのリポジトリのすべてのコラボレーターが利用可能。git管理でチーム共有。"}
              </div>
              <div style={{ marginTop: "8px" }}>
                <span className={`${styles.tag} ${styles.tagG}`}>全プラン</span>
              </div>
            </div>
            <div className={styles.scopeCard}>
              <div className={styles.scopeCardIcon}>👤</div>
              <div className={styles.scopeCardTtl}>ユーザーレベル（個人）</div>
              <div className={styles.scopeCardBody}>
                {"VS Code設定の「ユーザー」選択で作成。全ワークスペースで利用可能。"}
                <code>chat.agentFilesLocations</code>
                {"でカスタムパスも指定可。"}
              </div>
              <div style={{ marginTop: "8px" }}>
                <span className={`${styles.tag} ${styles.tagB}`}>VS Code</span>
              </div>
            </div>
            <div className={styles.scopeCard}>
              <div className={styles.scopeCardIcon}>🏢</div>
              <div className={styles.scopeCardTtl}>組織・Enterpriseレベル</div>
              <div className={styles.scopeCardBody}>
                <code>.github-private</code>
                {"リポジトリの "}
                <code>agents/</code>
                {" に配置。組織全体・Enterprise全体に展開可能。"}
              </div>
              <div style={{ marginTop: "8px" }}>
                <span className={`${styles.tag} ${styles.tagP}`}>Business/Enterprise</span>
              </div>
            </div>
          </div>
          <div className={`${styles.alert} ${styles.aw}`}>
            <span className={styles.alertIcon}>⚠️</span>
            <div className={styles.alertBody}>
              <strong>ファイル名の制約：</strong>
              {"ファイル名に使用できる文字は "}
              <code>. - _ a-z A-Z 0-9</code>
              {" のみ。スペース・日本語・記号（"}
              <code>@</code>
              {"等）は使用不可。エージェントの呼び出し名はファイル名（"}
              <code>.agent.md</code>
              {"除く）になります。例："}
              <code>test-agent.agent.md</code>
              {" → "}
              <code>@test-agent</code>
            </div>
          </div>
        </section>
        <section id="s06" className={styles.sec}>
          <div
            className={styles.secHead}
            style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px solid var(--border2)" }}
          >
            <h2 style={{ fontSize: "1.1rem" }}>
              {"4-2. フロントマター完全仕様（全フィールド） "}
              <span className={styles.newB}>NEW</span>
            </h2>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>.github/agents/my-agent.agent.md — 全フィールド仕様</span>
              <span className={styles.codeLang}>YAML + Markdown</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>name</span>
              {": "}
              <span className={styles.cv}>{"'My Agent'"}</span>
              {"            "}
              <span className={styles.cc}>{"# 任意: 表示名（省略時はファイル名ベース）"}</span>
              {"\n"}
              {"                              "}
              <span className={styles.cc}>{"# 単一引用符推奨（awesome-copilot規約）"}</span>
              {"\n\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cv}>{"'エージェントの役割と能力の説明（必須）'"}</span>
              {"\n"}
              {"  "}
              <span className={styles.cc}>{"# ★★★ 最重要フィールド ★★★"}</span>
              {"\n"}
              {"  "}
              <span className={styles.cc}>
                {"# エージェントが自動・手動選択される唯一の判断材料"}
              </span>
              {"\n"}
              {"  "}
              <span className={styles.cc}>
                {"# 「いつ使う / いつ使わない」を50〜150文字で明確に"}
              </span>
              {"\n"}
              {"  "}
              <span className={styles.cc}>
                {"# GitHub.com（Coding Agent）でのIssue割り当て時に参照される"}
              </span>
              {"\n\n"}
              <span className={styles.cm}>target</span>
              {": "}
              <span className={styles.cv}>{"'github-copilot'"}</span>
              {"  "}
              <span className={styles.cc}>{"# 必須: github-copilot | vscode"}</span>
              {"\n"}
              {"                              "}
              <span className={styles.cc}>{"# mcp-servers は github-copilot 専用"}</span>
              {"\n\n"}
              <span className={styles.cm}>model</span>
              {": "}
              <span className={styles.cv}>{"'claude-sonnet-4-6'"}</span>
              {"   "}
              <span className={styles.cc}>{"# 任意: 使用AIモデルを指定"}</span>
              {"\n"}
              {"                              "}
              <span className={styles.cc}>{"# 配列で優先順位付きフォールバック指定も可:"}</span>
              {"\n"}
              {"  "}
              <span className={styles.cc}>
                {"# model: ['Claude Opus 4.5', 'GPT-5.2 (copilot)']"}
              </span>
              {"\n"}
              {"  "}
              <span className={styles.cc}>
                {"# IDEカスタムエージェント専用（GitHub.comでは無視）"}
              </span>
              {"\n\n"}
              <span className={styles.cm}>tools</span>
              {":                       "}
              <span className={styles.cc}>{"# 任意: 利用可能ツールのホワイトリスト"}</span>
              {"\n"}
              {"  - "}
              <span className={styles.cv}>read_file</span>
              {"               "}
              <span className={styles.cc}>{"# 省略すると全ツール（組み込み＋MCP）が使用可"}</span>
              {"\n"}
              {"  - "}
              <span className={styles.cv}>edit_file</span>
              {"               "}
              <span className={styles.cc}>{"# ★ 最小権限の原則: 必要なツールのみ許可"}</span>
              {"\n"}
              {"  - "}
              <span className={styles.cv}>run_terminal_command</span>
              {"    "}
              <span className={styles.cc}>{'# MCP ツールは "サーバー名/ツール名" 形式'}</span>
              {"\n"}
              {"  - "}
              <span className={styles.cv}>grep_search</span>
              {"             "}
              <span className={styles.cc}>{'# 例: "sentry/get_issue_details"'}</span>
              {"\n"}
              {"  - "}
              <span className={styles.cv}>agent</span>
              {"                   "}
              <span className={styles.cc}>{"# ★ サブエージェントを使う場合は必須"}</span>
              {"\n\n"}
              <span className={styles.cm}>agents</span>
              {":                     "}
              <span className={styles.cc}>{"# 任意: 使用できるサブエージェントを制限"}</span>
              {"\n"}
              {"  - "}
              <span className={styles.cv}>implementer</span>
              {"             "}
              <span className={styles.cc}>
                {"# 省略時: disable-model-invocation:false の全エージェントが対象"}
              </span>
              {"\n"}
              {"  - "}
              <span className={styles.cv}>code-reviewer</span>
              {"          "}
              <span className={styles.cc}>{"# 明示することで予期しない呼び出しを防ぐ"}</span>
              {"\n\n"}
              <span className={styles.cm}>handoffs</span>
              {":                   "}
              <span className={styles.cc}>
                {"# 任意: 次のエージェントへの誘導ボタン（IDE専用）"}
              </span>
              {"\n"}
              {"  - "}
              <span className={styles.cv}>label</span>
              {": "}
              <span className={styles.cv}>{"'Start Implementation'"}</span>
              {"   "}
              <span className={styles.cc}>{"# ボタンラベル"}</span>
              {"\n"}
              {"    "}
              <span className={styles.cv}>agent</span>
              {": "}
              <span className={styles.cv}>implementer</span>
              {"              "}
              <span className={styles.cc}>{"# 遷移先エージェント名（ファイル名ベース）"}</span>
              {"\n"}
              {"    "}
              <span className={styles.cv}>prompt</span>
              {": "}
              <span className={styles.cv}>{"'Now implement the plan.'"}</span>{" "}
              <span className={styles.cc}>{"# 遷移後の入力欄に事前入力されるテキスト"}</span>
              {"\n"}
              {"    "}
              <span className={styles.cv}>send</span>
              {": "}
              <span className={styles.cv}>false</span>
              {"                      "}
              <span className={styles.cc}>{"# false=手動送信, true=自動送信"}</span>
              {"\n"}
              {"  - "}
              <span className={styles.cv}>label</span>
              {": "}
              <span className={styles.cv}>{"'Code Review'"}</span>
              {"\n"}
              {"    "}
              <span className={styles.cv}>agent</span>
              {": "}
              <span className={styles.cv}>code-reviewer</span>
              {"\n"}
              {"    "}
              <span className={styles.cv}>prompt</span>
              {": "}
              <span className={styles.cv}>{"'Review this implementation.'"}</span>
              {"\n"}
              {"    "}
              <span className={styles.cv}>send</span>
              {": "}
              <span className={styles.cv}>false</span>
              {"\n\n"}
              <span className={styles.cm}>user-invocable</span>
              {": "}
              <span className={styles.cv}>true</span>
              {"        "}
              <span className={styles.cc}>{"# 任意（default: true）"}</span>
              {"\n"}
              {"                              "}
              <span className={styles.cc}>
                {"# false: @メニューに表示されないが、サブエージェントとしては使用可"}
              </span>
              {"\n"}
              {"                              "}
              <span className={styles.cc}>{"# 内部ワーカーエージェントに設定"}</span>
              {"\n\n"}
              <span className={styles.cm}>disable-model-invocation</span>
              {": "}
              <span className={styles.cv}>false</span>
              {"  "}
              <span className={styles.cc}>{"# 任意（default: false）"}</span>
              {"\n"}
              {"                              "}
              <span className={styles.cc}>{"# true: モデルによる自動選択を完全無効化"}</span>
              {"\n"}
              {"                              "}
              <span className={styles.cc}>{"# ※ agents[] に明示すれば上書き可能"}</span>
              {"\n\n"}
              <span className={styles.cm}>mcp-servers</span>
              {":               "}
              <span className={styles.cc}>{"# 任意: このエージェント専用MCPサーバー設定"}</span>
              {"\n"}
              {"  "}
              <span className={styles.cv}>sentry</span>
              {":\n    "}
              <span className={styles.cv}>type</span>
              {": "}
              <span className={styles.cv}>{"'local'"}</span>
              {"            "}
              <span className={styles.cc}>{"# local（stdio互換）/ http / sse"}</span>
              {"\n"}
              {"    "}
              <span className={styles.cv}>command</span>
              {": "}
              <span className={styles.cv}>{"'npx'"}</span>
              {"\n    "}
              <span className={styles.cv}>args</span>
              {": ["}
              <span className={styles.cv}>{"'@sentry/mcp-server@latest'"}</span>
              {"]\n    "}
              <span className={styles.cv}>tools</span>
              {": ["}
              <span className={styles.cv}>{"'get_issue_details'"}</span>
              {", "}
              <span className={styles.cv}>{"'get_issue_summary'"}</span>
              {"]  "}
              <span className={styles.cc}>{"# ホワイトリスト"}</span>
              {"\n"}
              {"    "}
              <span className={styles.cv}>env</span>
              {":\n      "}
              <span className={styles.cv}>SENTRY_ACCESS_TOKEN</span>
              {": "}
              <span className={styles.cv}>{"'${{ secrets.COPILOT_MCP_SENTRY_TOKEN }}'"}</span>
              {"\n"}
              {"      "}
              <span className={styles.cc}>
                {'# シークレットはリポジトリの "copilot" 環境から取得'}
              </span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              <span className={styles.cc}>{"# ↓ ここからMarkdown本文（最大30,000文字）"}</span>
              {"\n"}
              <span className={styles.ch}>{"## Role（役割）"}</span>
              {"\n"}
              {"エージェントの役割・専門性・振る舞いを自然言語で記述...\n\n"}
              <span className={styles.cm}>{"## Instructions（手順）"}</span>
              {"\n"}
              {"具体的な作業手順・判断基準...\n\n"}
              <span className={styles.cm}>{"## Constraints（制約）"}</span>
              {"\n"}
              {"絶対に行わないこと・アクセス制限...\n\n"}
              <span className={styles.cm}>{"## Output Format（出力形式）"}</span>
              {"\n"}
              {"レポートや成果物のフォーマット..."}
            </div>
          </div>
          <div className={styles.tblWrap}>
            <table className={styles.fmTable}>
              <thead>
                <tr>
                  <th>フィールド</th>
                  <th>必須</th>
                  <th>対応環境</th>
                  <th>説明・ポイント</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>description</td>
                  <td>
                    <span className={`${styles.badge} ${styles.bRed}`}>必須</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tagG}`}>全環境</span>
                  </td>
                  <td>50〜150文字。「いつ使う/使わない」を明記。自動選択の唯一の判断材料</td>
                </tr>
                <tr>
                  <td>target</td>
                  <td>
                    <span className={`${styles.badge} ${styles.bRed}`}>必須</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tagG}`}>全環境</span>
                  </td>
                  <td>
                    {"実行環境指定: "}
                    <code>github-copilot</code>
                    {" または "}
                    <code>vscode</code>
                    {"。mcp-serversは github-copilot 専用"}
                  </td>
                </tr>
                <tr>
                  <td>name</td>
                  <td>
                    <span className={`${styles.badge} ${styles.bBlue}`}>任意</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tagG}`}>全環境</span>
                  </td>
                  <td>{"表示名。省略時はファイル名（test-agent.agent.md → test-agent）"}</td>
                </tr>
                <tr>
                  <td>model</td>
                  <td>
                    <span className={`${styles.badge} ${styles.bBlue}`}>任意</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tagB}`}>IDE専用</span>
                  </td>
                  <td>AIモデル指定。配列でフォールバック順を設定可。GitHub.comでは無視</td>
                </tr>
                <tr>
                  <td>tools</td>
                  <td>
                    <span className={`${styles.badge} ${styles.bBlue}`}>任意</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tagG}`}>全環境</span>
                  </td>
                  <td>
                    {"省略=全ツール許可。最小権限の原則を適用。サブエージェント使用は "}
                    <code>agent</code>
                    {" ツールが必須"}
                  </td>
                </tr>
                <tr>
                  <td>agents</td>
                  <td>
                    <span className={`${styles.badge} ${styles.bBlue}`}>任意</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tagB}`}>IDE専用</span>
                  </td>
                  <td>使用できるサブエージェントのホワイトリスト。省略=全エージェント対象</td>
                </tr>
                <tr>
                  <td>handoffs</td>
                  <td>
                    <span className={`${styles.badge} ${styles.bBlue}`}>任意</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tagB}`}>IDE専用</span>
                  </td>
                  <td>{"label・agent・prompt・send の4プロパティ。GitHub.comでは無視される"}</td>
                </tr>
                <tr>
                  <td>user-invocable</td>
                  <td>
                    <span className={`${styles.badge} ${styles.bBlue}`}>任意</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tagG}`}>全環境</span>
                  </td>
                  <td>{"false で @メニューから非表示（サブエージェントとしては動作）"}</td>
                </tr>
                <tr>
                  <td>disable-model-invocation</td>
                  <td>
                    <span className={`${styles.badge} ${styles.bBlue}`}>任意</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tagG}`}>全環境</span>
                  </td>
                  <td>{"true で自動選択を完全無効化。agents[]で明示すれば上書き可"}</td>
                </tr>
                <tr>
                  <td>mcp-servers</td>
                  <td>
                    <span className={`${styles.badge} ${styles.bBlue}`}>任意</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tagB}`}>Copilot専用</span>
                  </td>
                  <td>
                    {
                      "エージェント固有のMCPサーバー設定（YAML形式）。target: github-copilot 時のみ有効。シークレットは copilot 環境から取得"
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section id="s07" className={styles.sec}>
          <div
            className={styles.secHead}
            style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px solid var(--border2)" }}
          >
            <h2 style={{ fontSize: "1.1rem" }}>
              {"4-3. ステップバイステップ作成ガイド（7ステップ） "}
              <span className={styles.newB}>NEW</span>
            </h2>
          </div>
          <div className={styles.stepList}>
            <div className={styles.stepRow}>
              <div className={`${styles.stepCircle} ${styles.scG}`}>01</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTtl}>エージェントの「単一責任」を決める</div>
                <div className={styles.stepBody}>
                  {"まず「このエージェントが"}
                  <strong>{"何をするか / 何をしないか"}</strong>
                  {
                    "」を1文で言えるか確認します。「テスト生成 + コードレビュー + ドキュメント作成」を1エージェントにまとめるのはアンチパターン。"
                  }
                  <strong>{"1エージェント = 1専門領域"}</strong>
                  {"に分割してください。"}
                  <br />
                  <br />
                  {"✅ 良い例:「テストカバレッジを向上させる。本番コードは変更しない」"}
                  <br />
                  {"❌ 悪い例:「開発全般をサポートする」"}
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={`${styles.stepCircle} ${styles.scB}`}>02</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTtl}>ファイルを作成する</div>
                <div className={styles.stepBody}>
                  {
                    "VS Codeでは Copilot Chat の「エージェント選択ドロップダウン → Configure Custom Agents... → Create new custom agent」から作成。または手動でファイルを作成してください。"
                  }
                  <div className={styles.codeWrap} style={{ marginTop: "10px" }}>
                    <div className={styles.codeBar}>
                      <span>TERMINAL</span>
                    </div>
                    <div className={styles.codeBody}>
                      <span className={styles.cc}>
                        {"# プロジェクト（リポジトリ）レベルのエージェント"}
                      </span>
                      {
                        "\nmkdir -p .github/agents\ntouch .github/agents/security-reviewer.agent.md\n\n"
                      }
                      <span className={styles.cc}>{"# 個人レベル（VS Code設定から作成推奨）"}</span>
                      {"\n"}
                      <span className={styles.cc}>
                        {'# Create new custom agent → "User" を選択'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={`${styles.stepCircle} ${styles.scP}`}>03</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTtl}>{"description を丁寧に書く（最重要）"}</div>
                <div className={styles.stepBody}>
                  <code>description</code>
                  {" はエージェントが自動選択・手動選択される唯一の判断材料です。"}
                  <strong>{"「Focuses on X without doing Y」パターン"}</strong>
                  {
                    "が最も効果的です。2,500以上のリポジトリ分析から、descriptionが曖昧なエージェントほど誤呼び出しが多いことが判明しています。"
                  }
                  <div className={styles.codeWrap} style={{ marginTop: "10px" }}>
                    <div className={styles.codeBar}>
                      <span>{"description のベストプラクティス"}</span>
                      <span className={styles.codeLang}>YAML</span>
                    </div>
                    <div className={styles.codeBody}>
                      <span className={styles.cc}>{"✅ 明確な description（推奨）"}</span>
                      {"\n"}
                      <span className={styles.cm}>description</span>
                      {": "}
                      <span className={styles.cv}>
                        {"'Security reviewer focused on OWASP Top 10 vulnerabilities."}
                      </span>
                      {"\n  "}
                      <span className={styles.cv}>
                        {"Reads code and generates audit reports. Does NOT modify any files.'"}
                      </span>
                      {"\n\n"}
                      <span className={styles.cc}>{"❌ 曖昧な description（アンチパターン）"}</span>
                      {"\n"}
                      <span className={styles.cm}>description</span>
                      {": "}
                      <span className={styles.cv}>{"'コードを分析するエージェント'"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={`${styles.stepCircle} ${styles.scA}`}>04</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTtl}>ツールを最小権限で設定する</div>
                <div className={styles.stepBody}>
                  <code>tools</code>
                  {" フィールドを省略すると全ツールが使用可能になります（便利だが危険）。"}
                  <strong>{"必要最小限のツールのみ許可"}</strong>
                  {"してください。特に本番DBや本番環境へのアクセスツールは慎重に扱います。"}
                  <div className={styles.codeWrap} style={{ marginTop: "10px" }}>
                    <div className={styles.codeBar}>
                      <span>{"ツール設定パターン"}</span>
                      <span className={styles.codeLang}>YAML</span>
                    </div>
                    <div className={styles.codeBody}>
                      <span className={styles.cc}>
                        {"# Read-Only エージェント（セキュリティ審査・レビュー用）"}
                      </span>
                      {"\n"}
                      <span className={styles.cm}>tools</span>
                      {": ["}
                      <span className={styles.cv}>read_file</span>
                      {", "}
                      <span className={styles.cv}>grep_search</span>
                      {", "}
                      <span className={styles.cv}>list_directory</span>
                      {"]\n\n"}
                      <span className={styles.cc}>
                        {"# Write限定エージェント（docs/のみ書き込み可）"}
                      </span>
                      {"\n"}
                      <span className={styles.cm}>tools</span>
                      {": ["}
                      <span className={styles.cv}>read_file</span>
                      {", "}
                      <span className={styles.cv}>create_file</span>
                      {", "}
                      <span className={styles.cv}>edit_file</span>
                      {"]\n"}
                      <span className={styles.cc}>
                        {
                          "# → 本文で \"Write: /docs/ のみ\" と明示的に制約を追加\n\n# サブエージェントを呼び出す場合は 'agent' ツールが必須"
                        }
                      </span>
                      {"\n"}
                      <span className={styles.cm}>tools</span>
                      {": ["}
                      <span className={styles.cv}>read_file</span>
                      {", "}
                      <span className={styles.cv}>search</span>
                      {", "}
                      <span className={styles.cv}>agent</span>
                      {"]\n\n"}
                      <span className={styles.cc}>
                        {"# MCPサーバーのツールを個別許可（完全なツール名はサーバー名/ツール名）"}
                      </span>
                      {"\n"}
                      <span className={styles.cm}>tools</span>
                      {": ["}
                      <span className={styles.cv}>read_file</span>
                      {", "}
                      <span className={styles.cv}>{"sentry/get_issue_details"}</span>
                      {", "}
                      <span className={styles.cv}>{"sentry/get_issue_summary"}</span>
                      {"]"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={`${styles.stepCircle} ${styles.scT}`}>05</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTtl}>{"本文（プロンプト）を構造化して書く"}</div>
                <div className={styles.stepBody}>
                  {"本文は最大"}
                  <strong>{"30,000文字"}</strong>
                  {"のMarkdownです。"}
                  <strong>{"Role → Instructions → Constraints → Output Format"}</strong>
                  {" の4セクション構成が推奨されます。"}
                  <div className={styles.codeWrap} style={{ marginTop: "10px" }}>
                    <div className={styles.codeBar}>
                      <span>{"本文の推奨構成"}</span>
                      <span className={styles.codeLang}>Markdown</span>
                    </div>
                    <div className={styles.codeBody}>
                      <span className={styles.ch}>{"## Role"}</span>
                      {
                        "\nあなたは経験豊富なセキュリティエンジニアです。\nOWASP Top 10を基準にコードを監査します。\n\n"
                      }
                      <span className={styles.ch}>{"## Instructions"}</span>
                      {
                        "\n1. コードベースを読み取って脆弱性を特定する\n2. 各問題をCritical/High/Medium/Lowで分類する\n3. CWE番号を付与する\n4. 修正コード例を提示する\n\n"
                      }
                      <span className={styles.ch}>{"## Constraints（絶対に守ること）"}</span>
                      {"\n- "}
                      <span className={styles.cw}>{"コードを一切変更しない（Read-Only）"}</span>
                      {"\n- "}
                      <span className={styles.cw}>{"レポート出力のみ行う"}</span>
                      {"\n- 確認していない脆弱性を断定しない\n\n"}
                      <span className={styles.ch}>{"## Output Format"}</span>
                      {"\n報告書は以下の形式:\n"}
                      <span className={styles.cs}>
                        {
                          "## Security Audit Report\n| 重大度 | 問題 | CWE | 該当箇所 | 修正案 |\n|-------|-----|-----|---------|-------|"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={`${styles.stepCircle} ${styles.scG}`}>06</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTtl}>{"動作確認 — エージェントを認識させる"}</div>
                <div className={styles.stepBody}>
                  {"ファイルをコミット・プッシュ後、以下で確認します。"}
                  <div className={styles.codeWrap} style={{ marginTop: "10px" }}>
                    <div className={styles.codeBar}>
                      <span>{"確認方法（VS Code）"}</span>
                    </div>
                    <div className={styles.codeBody}>
                      <span className={styles.cc}>{"# Copilot Chat を開く"}</span>
                      {"\n"}
                      <span className={styles.cc}>
                        {"# エージェント選択ドロップダウンを開く → エージェントが表示されるか確認"}
                      </span>
                      {"\n"}
                      <span className={styles.cc}>
                        {"# または @security-reviewer と入力して候補が出るか確認"}
                      </span>
                      {"\n\n"}
                      <span className={styles.cc}>{"# GitHub.com（Copilot Coding Agent）"}</span>
                      {"\n"}
                      <span className={styles.cc}>
                        {'# Issue を作成 → Assignees の "Assign to Copilot" をクリック'}
                      </span>
                      {"\n"}
                      <span className={styles.cc}>
                        {"# → Agents パネルにエージェントが表示されるか確認"}
                      </span>
                      {"\n\n"}
                      <span className={styles.cc}>{"# ★ 認識されない場合の確認事項:"}</span>
                      {"\n"}
                      <span className={styles.cc}>
                        {"# 1. .github/agents/ 以下に配置されているか"}
                      </span>
                      {"\n"}
                      <span className={styles.cc}>{"# 2. ファイル名が *.agent.md 形式か"}</span>
                      {"\n"}
                      <span className={styles.cc}>{"# 3. description フィールドが存在するか"}</span>
                      {"\n"}
                      <span className={styles.cc}>
                        {"# 4. デフォルトブランチにコミットされているか（GitHub.com）"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={`${styles.stepCircle} ${styles.scB}`}>07</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTtl}>
                  {"Handoffs（ハンドオフ）を設定する（IDEのみ）"}
                </div>
                <div className={styles.stepBody}>
                  {"複数エージェントを連鎖させる場合は "}
                  <code>handoffs</code>
                  {
                    " プロパティで「次のエージェントへの誘導ボタン」を設定します。チャットレスポンスの下部にボタンが表示され、ユーザーが選択すると次のエージェントにコンテキストごと移行します。"
                  }
                  <div className={styles.codeWrap} style={{ marginTop: "10px" }}>
                    <div className={styles.codeBar}>
                      <span>{"handoffs 設定例"}</span>
                      <span className={styles.codeLang}>YAML</span>
                    </div>
                    <div className={styles.codeBody}>
                      <span className={styles.cm}>handoffs</span>
                      {":\n  - "}
                      <span className={styles.cm}>label</span>
                      {": "}
                      <span className={styles.cv}>{"'実装を開始'"}</span>
                      {"         "}
                      <span className={styles.cc}>{"# ボタンに表示されるテキスト"}</span>
                      {"\n    "}
                      <span className={styles.cm}>agent</span>
                      {": "}
                      <span className={styles.cv}>implementer</span>
                      {"        "}
                      <span className={styles.cc}>
                        {"# 遷移先: .github/agents/implementer.agent.md"}
                      </span>
                      {"\n    "}
                      <span className={styles.cm}>prompt</span>
                      {": "}
                      <span className={styles.cv}>{"'上記の計画に従って実装してください。'"}</span>
                      {"\n    "}
                      <span className={styles.cm}>send</span>
                      {": "}
                      <span className={styles.cv}>{"false"}</span>
                      {"              "}
                      <span className={styles.cc}>
                        {"# false: ユーザーが確認後に手動送信（推奨）"}
                      </span>
                      {"\n                               "}
                      <span className={styles.cc}>
                        {"# true:  自動送信（完全自動化ワークフロー）"}
                      </span>
                      {"\n  - "}
                      <span className={styles.cm}>label</span>
                      {": "}
                      <span className={styles.cv}>{"'コードレビューへ'"}</span>
                      {"\n    "}
                      <span className={styles.cm}>agent</span>
                      {": "}
                      <span className={styles.cv}>{"code-reviewer"}</span>
                      {"\n    "}
                      <span className={styles.cm}>prompt</span>
                      {": "}
                      <span className={styles.cv}>
                        {"'実装内容のセキュリティとコード品質をレビューしてください。'"}
                      </span>
                      {"\n    "}
                      <span className={styles.cm}>send</span>
                      {": "}
                      <span className={styles.cv}>{"false"}</span>
                    </div>
                  </div>
                  <div className={`${styles.alert} ${styles.aw}`} style={{ marginTop: "10px" }}>
                    <span className={styles.alertIcon}>⚠️</span>
                    <div className={styles.alertBody}>
                      <strong>{"handoffs は GitHub.com では無視されます。"}</strong>
                      {
                        " VS Code・JetBrains・Eclipse・Xcodeのみ有効です。GitHub.com（Copilot Coding Agent）のIssue処理フローでは使用できません。"
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="s08" className={styles.sec}>
          <div
            className={styles.secHead}
            style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px solid var(--border2)" }}
          >
            <h2 style={{ fontSize: "1.1rem" }}>
              {"4-4. Handoffs — マルチエージェントワークフロー設計 "}
              <span className={styles.newB}>NEW</span>
            </h2>
          </div>
          <div className={styles.card}>
            <p>
              {"Handoffsは"}
              <strong>{"エージェント間を決定論的に遷移させるUIメカニズム"}</strong>
              {"です。LLMの非決定性（「次に何をすべきか」の判断）に依存せず、"}
              <strong>{"ユーザーが各ステップで承認・確認できる"}</strong>
              {"制御された連鎖が実現します。"}
            </p>
          </div>
          <div style={{ margin: "16px 0" }}>
            <div
              style={{
                fontSize: "11px",
                textAlign: "center",
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: ".12em",
                marginBottom: "16px",
                fontWeight: 600,
              }}
            >
              {"典型パターン 1 — 計画 → 実装 → レビュー（手動承認型）"}
            </div>
            <div className={styles.hfFlow}>
              <div className={`${styles.hfAgent} ${styles.hfA}`}>
                {"📐 planner"}
                <br />
                <small>{".agent.md"}</small>
                <div className={styles.hfBtn}>{"実装を開始 →"}</div>
              </div>
              <div className={styles.hfArrow}>→</div>
              <div className={`${styles.hfAgent} ${styles.hfB}`}>
                {"⚙️ implementer"}
                <br />
                <small>{".agent.md"}</small>
                <div className={styles.hfBtn}>{"レビューへ →"}</div>
              </div>
              <div className={styles.hfArrow}>→</div>
              <div className={`${styles.hfAgent} ${styles.hfC}`}>
                {"🔒 code-reviewer"}
                <br />
                <small>{".agent.md"}</small>
                <div className={styles.hfBtn}>完了</div>
              </div>
            </div>
            <div
              style={{
                fontSize: "11px",
                textAlign: "center",
                color: "var(--text3)",
                marginTop: "8px",
              }}
            >
              {"各ボタンは send:false（手動送信）— ユーザーが内容を確認してから次のステップへ"}
            </div>
          </div>
          <div style={{ margin: "16px 0" }}>
            <div
              style={{
                fontSize: "11px",
                textAlign: "center",
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: ".12em",
                marginBottom: "16px",
                fontWeight: 600,
              }}
            >
              {"典型パターン 2 — TDD（テスト先行）自動連鎖"}
            </div>
            <div className={styles.hfFlow}>
              <div className={`${styles.hfAgent} ${styles.hfA}`}>
                {"🔴 red-agent"}
                <br />
                <small>{"失敗テスト生成"}</small>
                <div className={`${styles.hfBtn} ${styles.auto}`}>{"自動→"}</div>
              </div>
              <div className={styles.hfArrow}>→</div>
              <div className={`${styles.hfAgent} ${styles.hfB}`}>
                {"🟢 green-agent"}
                <br />
                <small>{"テストをパスする実装"}</small>
                <div className={styles.hfBtn}>{"リファクタへ →"}</div>
              </div>
              <div className={styles.hfArrow}>→</div>
              <div className={`${styles.hfAgent} ${styles.hfD}`}>
                {"🔵 refactor-agent"}
                <br />
                <small>{"コード品質改善"}</small>
                <div className={styles.hfBtn}>完了</div>
              </div>
            </div>
            <div
              style={{
                fontSize: "11px",
                textAlign: "center",
                color: "var(--text3)",
                marginTop: "8px",
              }}
            >
              {
                "Red→Green は send:true（自動）/ Green→Refactor は send:false（手動確認）の混合パターン"
              }
            </div>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>{".github/agents/planner.agent.md — Handoffsを使った計画エージェント"}</span>
              <span className={styles.codeLang}>{"Markdown + YAML"}</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>name</span>
              {": "}
              <span className={styles.cv}>{"'Planner'"}</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cv}>
                {
                  "'Generates implementation plans for new features or refactoring.\n  Does NOT write code. Use for: planning, architecture, design, spec.'"
                }
              </span>
              {"\n"}
              <span className={styles.cm}>target</span>
              {": "}
              <span className={styles.cv}>{"'github-copilot'"}</span>
              {"  "}
              <span className={styles.cc}>{"# 必須: github-copilot | vscode"}</span>
              {"\n"}
              <span className={styles.cm}>model</span>
              {": ["}
              <span className={styles.cv}>{"'Claude Opus 4.5'"}</span>
              {", "}
              <span className={styles.cv}>{"'GPT-5.2 (copilot)'"}</span>
              {"]   "}
              <span className={styles.cc}>{"# フォールバック順"}</span>
              {"\n"}
              <span className={styles.cm}>tools</span>
              {": ["}
              <span className={styles.cv}>{"'search/codebase'"}</span>
              {", "}
              <span className={styles.cv}>{"'web/fetch'"}</span>
              {", "}
              <span className={styles.cv}>{"'read_file'"}</span>
              {"]  "}
              <span className={styles.cc}>{"# 読み取り専用"}</span>
              {"\n"}
              <span className={styles.cm}>handoffs</span>
              {":\n  - "}
              <span className={styles.cm}>label</span>
              {": "}
              <span className={styles.cv}>{"'Implement Plan'"}</span>
              {"\n    "}
              <span className={styles.cm}>agent</span>
              {": "}
              <span className={styles.cv}>implementer</span>
              {"\n    "}
              <span className={styles.cm}>prompt</span>
              {": "}
              <span className={styles.cv}>
                {"'Implement the plan outlined above. Follow the steps in order.'"}
              </span>
              {"\n    "}
              <span className={styles.cm}>send</span>
              {": "}
              <span className={styles.cv}>{"false"}</span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              <span className={styles.ch}>{"## Role"}</span>
              {
                "\nあなたはシニアソフトウェアアーキテクトです。\nコードを書かず、実装計画の作成に専念します。\n\n"
              }
              <span className={styles.ch}>{"## Instructions"}</span>
              {"\n1. コードベース全体（"}
              <span className={styles.cw}>@workspace</span>
              {
                "）を分析して現状を把握する\n2. 要件と既存アーキテクチャの適合性を評価する\n3. 実装計画を以下の形式で作成する:\n\n"
              }
              <span className={styles.cs}>
                {
                  "```markdown\n## Implementation Plan: [機能名]\n\n### Overview\n[2〜3文の概要]\n\n### Requirements\n- [要件1]\n- [要件2]\n\n### Implementation Steps\n1. [Step 1: ファイル名と変更内容]\n2. [Step 2: ...]\n\n### Testing Strategy\n- [テスト方針]\n\n### Risk Assessment\n- [リスク要因と対策]\n```"
                }
              </span>
              {"\n\n"}
              <span className={styles.ch}>{"## Constraints"}</span>
              {"\n- "}
              <span className={styles.cw}>{"コードを書かない（計画のみ）"}</span>
              {
                "\n- 既存のアーキテクチャパターンに従う\n- 新規依存パッケージの追加は事前に確認を求める"
              }
            </div>
          </div>
        </section>
        <section id="s09" className={styles.sec}>
          <div
            className={styles.secHead}
            style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px solid var(--border2)" }}
          >
            <h2 style={{ fontSize: "1.1rem" }}>
              {"4-5. Subagents（サブエージェント）— 並列・分離実行 "}
              <span className={styles.newB}>NEW</span>
            </h2>
          </div>
          <div className={styles.card}>
            <p>
              {"Subagentsはメインエージェントから"}
              <strong>{"独立したコンテキストで実行される子エージェント"}</strong>
              {"です。Handoffsが「ユーザーが操作する順次遷移」であるのに対し、Subagentsは"}
              <strong>{"「エージェントが自律的に委任する並列実行」"}</strong>
              {"です。"}
            </p>
          </div>
          <div className={styles.g2}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>{"🔄 Handoffs vs Subagents — 使い分け"}</div>
              <div className={styles.tblWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>観点</th>
                      <th>Handoffs</th>
                      <th>Subagents</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>制御</td>
                      <td>{"ユーザーが各ステップを承認"}</td>
                      <td>{"エージェントが自律委任"}</td>
                    </tr>
                    <tr>
                      <td>実行</td>
                      <td>{"順次（ユーザー操作後）"}</td>
                      <td>{"並列実行可能"}</td>
                    </tr>
                    <tr>
                      <td>コンテキスト</td>
                      <td>{"前のセッションを引き継ぐ"}</td>
                      <td>{"完全に独立・隔離"}</td>
                    </tr>
                    <tr>
                      <td>{"適した場面"}</td>
                      <td>{"人間の承認が必要な作業"}</td>
                      <td>{"調査・分析の並列実行"}</td>
                    </tr>
                    <tr>
                      <td>{"必要ツール"}</td>
                      <td>{"不要（UIメカニズム）"}</td>
                      <td>
                        <code>{"tools: [agent]"}</code>
                        {"が必須"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className={`${styles.alert} ${styles.ai}`}>
                <span className={styles.alertIcon}>ℹ️</span>
                <div className={styles.alertBody}>
                  <strong>{"Subagentsの主なユースケース"}</strong>
                  <ul style={{ marginTop: "8px", paddingLeft: "16px", fontSize: "13px" }}>
                    <li>
                      {"コードレビューを"}
                      <strong>
                        {"複数の視点（セキュリティ・パフォーマンス・可読性）で並列実行"}
                      </strong>
                    </li>
                    <li>
                      {"実装前の"}
                      <strong>{"技術調査"}</strong>
                      {"（複数ライブラリの比較など）"}
                    </li>
                    <li>
                      {"大規模コードベースの"}
                      <strong>{"並列分析"}</strong>
                      {"（デッドコード・重複コード等）"}
                    </li>
                    <li>
                      <strong>{"コンテキスト節約"}</strong>
                      {
                        "：サブエージェントは結果のみを返すため、メインエージェントのコンテキストが汚染されない"
                      }
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>
                {".github/agents/thorough-reviewer.agent.md — 並列Subagentでコードレビュー"}
              </span>
              <span className={styles.codeLang}>{"Markdown + YAML"}</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>name</span>
              {": "}
              <span className={styles.cv}>{"'Thorough Reviewer'"}</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cv}>
                {
                  "'Comprehensive code review using multiple parallel perspectives.\n  Use for: code review, PR review, quality check.'"
                }
              </span>
              {"\n"}
              <span className={styles.cm}>target</span>
              {": "}
              <span className={styles.cv}>{"'github-copilot'"}</span>
              {"  "}
              <span className={styles.cc}>{"# 必須: github-copilot | vscode"}</span>
              {"\n"}
              <span className={styles.cm}>tools</span>
              {": ["}
              <span className={styles.cv}>{"'read_file'"}</span>
              {", "}
              <span className={styles.cv}>{"'search'"}</span>
              {", "}
              <span className={styles.cv}>{"'agent'"}</span>
              {"]   "}
              <span className={styles.cc}>{"# 'agent' が必須"}</span>
              {"\n"}
              <span className={styles.cm}>agents</span>
              {":                "}
              <span className={styles.cc}>{"# 使用できるサブエージェントを制限"}</span>
              {"\n  - "}
              <span className={styles.cv}>correctness-reviewer</span>
              {"\n  - "}
              <span className={styles.cv}>security-reviewer</span>
              {"\n  - "}
              <span className={styles.cv}>performance-reviewer</span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              <span className={styles.ch}>{"## Role"}</span>
              {"\nあなたは包括的なコードレビュアーです。\n複数の視点を"}
              <strong>{"並列サブエージェント"}</strong>
              {"として実行し、結果を統合します。\n\n"}
              <span className={styles.ch}>{"## Instructions"}</span>
              {"\nコードレビューを依頼されたら、以下の3つを"}
              <strong>{"同時並列"}</strong>
              {
                "で実行する:\n\n1. correctness-reviewer サブエージェント:\n   「ロジックエラー・エッジケース・型の問題を分析してください」\n   \n2. security-reviewer サブエージェント:\n   「OWASP Top 10 に基づいてセキュリティ問題を特定してください」\n   \n3. performance-reviewer サブエージェント:\n   「パフォーマンスボトルネック・不要な再レンダリングを特定してください」\n\n各サブエージェントの結果を受け取ったら、統合レポートを作成する。\n\n"
              }
              <span className={styles.ch}>{"## Output Format"}</span>
              {"\n"}
              <span className={styles.cs}>
                {
                  "```markdown\n## Code Review Summary\n\n### Critical Issues\n[セキュリティ・バグ]\n\n### Improvements\n[パフォーマンス・品質]\n\n### Positive Observations\n[良かった点]\n```"
                }
              </span>
            </div>
          </div>
        </section>
        <section id="s10" className={styles.sec}>
          <div
            className={styles.secHead}
            style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px solid var(--border2)" }}
          >
            <h2 style={{ fontSize: "1.1rem" }}>
              {"4-6. MCP統合 — エージェント専用MCPサーバー設定 "}
              <span className={styles.newB}>NEW</span>
            </h2>
          </div>
          <div className={styles.card}>
            <p>
              <code>mcp-servers</code>
              {" フィールドで"}
              <strong>{"このエージェント専用のMCPサーバー"}</strong>
              {
                "を設定できます。GitHub Copilot Coding Agent（GitHub.com）はMCPサーバーのtoolsのみサポート（resources・promptsは非対応）。リモートMCPのOAuth認証は現在未対応です。"
              }
            </p>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>{".github/agents/sentry-debugger.agent.md — Sentry MCP連携エージェント"}</span>
              <span className={styles.codeLang}>{"Markdown + YAML"}</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>name</span>
              {": "}
              <span className={styles.cv}>{"'Sentry Debugger'"}</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cv}>
                {
                  "'Analyzes Sentry errors and links them to code issues.\n  Use for: Sentry, error tracking, production bugs, exception analysis.'"
                }
              </span>
              {"\n"}
              <span className={styles.cm}>target</span>
              {": "}
              <span className={styles.cv}>{"'github-copilot'"}</span>
              {"  "}
              <span className={styles.cc}>{"# 必須: github-copilot | vscode"}</span>
              {"\n"}
              <span className={styles.cm}>tools</span>
              {": ["}
              <span className={styles.cv}>{"'read_file'"}</span>
              {", "}
              <span className={styles.cv}>{"'search'"}</span>
              {", "}
              <span className={styles.cv}>{"'sentry/get_issue_details'"}</span>
              {", "}
              <span className={styles.cv}>{"'sentry/get_issue_summary'"}</span>
              {"]\n"}
              <span className={styles.cm}>{"mcp-servers"}</span>
              {":\n  "}
              <span className={styles.cv}>sentry</span>
              {":\n    "}
              <span className={styles.cv}>type</span>
              {": "}
              <span className={styles.cv}>{"'local'"}</span>
              {"           "}
              <span className={styles.cc}>{"# 'local'=stdio互換, 'http', 'sse'"}</span>
              {"\n    "}
              <span className={styles.cv}>command</span>
              {": "}
              <span className={styles.cv}>{"'npx'"}</span>
              {"\n    "}
              <span className={styles.cv}>args</span>
              {": ["}
              <span className={styles.cv}>{"'@sentry/mcp-server@latest'"}</span>
              {", "}
              <span className={styles.cv}>{"'--host=$SENTRY_HOST'"}</span>
              {"]\n    "}
              <span className={styles.cv}>tools</span>
              {": ["}
              <span className={styles.cv}>{"'get_issue_details'"}</span>
              {", "}
              <span className={styles.cv}>{"'get_issue_summary'"}</span>
              {"]   "}
              <span className={styles.cc}>{"# ホワイトリスト推奨"}</span>
              {"\n    "}
              <span className={styles.cv}>env</span>
              {":\n      "}
              <span className={styles.cv}>SENTRY_HOST</span>
              {": "}
              <span className={styles.cv}>{"'https://yourcompany.sentry.io'"}</span>
              {"\n      "}
              <span className={styles.cv}>SENTRY_ACCESS_TOKEN</span>
              {": "}
              <span className={styles.cv}>{"'${{ secrets.COPILOT_MCP_SENTRY_TOKEN }}'"}</span>
              {"\n      "}
              <span className={styles.cc}>
                {'# ↑ リポジトリSettings → Copilot → Coding Agent → "copilot" 環境に設定'}
              </span>
              {"\n      "}
              <span className={styles.cc}>
                {"# GitHub Actions構文: ${{ secrets.* }} / ${{ vars.* }}"}
              </span>
              {"\n      "}
              <span className={styles.cc}>
                {"# Claude Code構文: ${VAR} / ${VAR:-default} も使用可"}
              </span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              <span className={styles.ch}>{"## Role"}</span>
              {
                "\nあなたは本番エラー調査の専門家です。Sentryのエラーを分析し、\nコードベースと照合して根本原因を特定します。\n\n"
              }
              <span className={styles.ch}>{"## Instructions"}</span>
              {"\n1. "}
              <span className={styles.cw}>get_issue_summary</span>
              {
                " でSentryイシューの概要を取得（ログ全量は取得しない）\n2. 問題のスタックトレースから関連ファイルを特定\n3. コードベースで該当箇所を読み取る\n4. 根本原因と修正案を提示する\n\n"
              }
              <span className={styles.ch}>{"## Constraints"}</span>
              {"\n- "}
              <span className={styles.cw}>{"コードを変更しない（調査・レポートのみ）"}</span>
              {"\n- 完全なログが必要な場合のみ "}
              <span className={styles.cw}>get_issue_details</span>
              {" を使用\n- センシティブなデータ（PII等）をレポートに含めない"}
            </div>
          </div>
          <div className={`${styles.alert} ${styles.ai}`}>
            <span className={styles.alertIcon}>💡</span>
            <div className={styles.alertBody}>
              <strong>{"ビルトインMCPサーバー（追加設定不要）"}</strong>
              {" Copilot Coding Agentには以下のMCPサーバーがビルトインで利用可能です（"}
              <code>mcp-servers</code>
              {"設定不要）："}
              <code>github</code>
              {"（Issue・PR・コード操作）・"}
              <code>azure</code>
              {"（Azure DevOps連携）・"}
              <code>cloudflare</code>
              {"。これらは "}
              <code>tools</code>
              {" フィールドに直接 "}
              <code>{'"github/create_issue"'}</code>
              {" のように指定するだけで使用できます。"}
            </div>
          </div>
        </section>
        <section id="s11" className={styles.sec}>
          <div
            className={styles.secHead}
            style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px solid var(--border2)" }}
          >
            <h2 style={{ fontSize: "1.1rem" }}>
              {"4-7. 実践テンプレート集（5種） "}
              <span className={styles.newB}>NEW</span>
            </h2>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>{"① security-reviewer.agent.md — セキュリティ監査専門（Read-Only）"}</span>
              <span className={styles.codeLang}>{"YAML + MD"}</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>name</span>
              {": "}
              <span className={styles.cv}>{"'Security Reviewer'"}</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cv}>
                {
                  "'OWASP Top 10 security audit. Reads code, generates reports only.\n  Use for: security review, vulnerability, OWASP, audit, sec check.\n  Does NOT modify any files.'"
                }
              </span>
              {"\n"}
              <span className={styles.cm}>target</span>
              {": "}
              <span className={styles.cv}>{"'github-copilot'"}</span>
              {"  "}
              <span className={styles.cc}>{"# 必須: github-copilot | vscode"}</span>
              {"\n"}
              <span className={styles.cm}>tools</span>
              {": ["}
              <span className={styles.cv}>{"'read_file'"}</span>
              {", "}
              <span className={styles.cv}>{"'grep_search'"}</span>
              {", "}
              <span className={styles.cv}>{"'list_directory'"}</span>
              {"]  "}
              <span className={styles.cc}>{"# Read-Only"}</span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              <span className={styles.ch}>{"## Role"}</span>
              {
                "\nOWASP Top 10 を基準にコードを監査するセキュリティエンジニア。\nコードを変更せずレポートのみ出力する。\n\n"
              }
              <span className={styles.ch}>{"## Checklist"}</span>
              {
                "\n- A01: アクセス制御の欠陥（IDOR・権限バイパス）\n- A02: 暗号化の失敗（平文保存・弱暗号）\n- A03: インジェクション（SQLi・XSS・コマンドインジェクション）\n- A04: 安全でない設計（ビジネスロジックの欠陥）\n- A07: 認証の失敗（弱パスワード・ブルートフォース対策なし）\n\n"
              }
              <span className={styles.ch}>{"## Constraints"}</span>
              {"\n- "}
              <span className={styles.cw}>{"コードを一切変更しない"}</span>
              {"\n- 確認していない脆弱性を断定しない\n- CWE番号を付与して報告する"}
            </div>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>{"② docs-agent.agent.md — ドキュメント生成専門（docs/のみ書き込み）"}</span>
              <span className={styles.codeLang}>{"YAML + MD"}</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>name</span>
              {": "}
              <span className={styles.cv}>{"'Docs Agent'"}</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cv}>
                {
                  "'Creates and updates technical documentation in docs/ folder.\n  Use for: docs, README, changelog, API docs, documentation update.\n  Does NOT modify source code.'"
                }
              </span>
              {"\n"}
              <span className={styles.cm}>target</span>
              {": "}
              <span className={styles.cv}>{"'github-copilot'"}</span>
              {"  "}
              <span className={styles.cc}>{"# 必須: github-copilot | vscode"}</span>
              {"\n"}
              <span className={styles.cm}>tools</span>
              {": ["}
              <span className={styles.cv}>{"'read_file'"}</span>
              {", "}
              <span className={styles.cv}>{"'create_file'"}</span>
              {", "}
              <span className={styles.cv}>{"'edit_file'"}</span>
              {"]\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              <span className={styles.ch}>{"## Role"}</span>
              {"\n技術文書作成の専門家。"}
              <span className={styles.cw}>{"docs/ ディレクトリのみ"}</span>
              {"書き込み可能。\n\n"}
              <span className={styles.ch}>{"## File Boundaries"}</span>
              {"\n- 書き込み: "}
              <span className={styles.cw}>{"/docs/ のみ"}</span>
              {
                "（README.md・CHANGELOG.md を含む）\n- 読み取り: プロジェクト全体（src/ 等も読める）\n- "
              }
              <span className={styles.cw}>{"ソースコードの変更は絶対にしない"}</span>
            </div>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>
                {
                  "③ implementer.agent.md — 実装専任（user-invocable: false でサブエージェント専用）"
                }
              </span>
              <span className={styles.codeLang}>{"YAML + MD"}</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>name</span>
              {": "}
              <span className={styles.cv}>{"'Implementer'"}</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cv}>
                {
                  "'Implements features based on provided plan. Worker agent, not for direct invocation.'"
                }
              </span>
              {"\n"}
              <span className={styles.cm}>target</span>
              {": "}
              <span className={styles.cv}>{"'github-copilot'"}</span>
              {"  "}
              <span className={styles.cc}>{"# 必須: github-copilot | vscode"}</span>
              {"\n"}
              <span className={styles.cm}>model</span>
              {": ["}
              <span className={styles.cv}>{"'Claude Haiku 4.5 (copilot)'"}</span>
              {", "}
              <span className={styles.cv}>{"'Gemini 3 Flash (Preview) (copilot)'"}</span>
              {"]\n"}
              <span className={styles.cm}>tools</span>
              {": ["}
              <span className={styles.cv}>{"'read_file'"}</span>
              {", "}
              <span className={styles.cv}>{"'edit_file'"}</span>
              {", "}
              <span className={styles.cv}>{"'create_file'"}</span>
              {", "}
              <span className={styles.cv}>{"'run_terminal_command'"}</span>
              {"]\n"}
              <span className={styles.cm}>{"user-invocable"}</span>
              {": "}
              <span className={styles.cv}>{"false"}</span>
              {"   "}
              <span className={styles.cc}>{"# @メニューに表示しない"}</span>
              {"\n"}
              <span className={styles.cm}>handoffs</span>
              {":\n  - "}
              <span className={styles.cm}>label</span>
              {": "}
              <span className={styles.cv}>{"'Review Changes'"}</span>
              {"\n    "}
              <span className={styles.cm}>agent</span>
              {": "}
              <span className={styles.cv}>{"security-reviewer"}</span>
              {"\n    "}
              <span className={styles.cm}>prompt</span>
              {": "}
              <span className={styles.cv}>
                {"'Implemented changes for security vulnerabilities.'"}
              </span>
              {"\n    "}
              <span className={styles.cm}>send</span>
              {": "}
              <span className={styles.cv}>{"false"}</span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              <span className={styles.ch}>{"## Role"}</span>
              {
                "\nplannerエージェントから渡された計画を実装するワーカー。\n計画に従って実装し、逸脱しない。\n\n"
              }
              <span className={styles.ch}>{"## Constraints"}</span>
              {
                "\n- 計画にない変更を加えない\n- テストが失敗したら実装を止めて報告する\n- 新規依存パッケージは人間確認なしに追加しない"
              }
            </div>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>{"④ triage-agent.agent.md — Issueトリアージ（GitHub MCPビルトイン活用）"}</span>
              <span className={styles.codeLang}>{"YAML + MD"}</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>name</span>
              {": "}
              <span className={styles.cv}>{"'Issue Triage Agent'"}</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cv}>
                {
                  "'Triages GitHub Issues: adds labels, assigns priority, links to related PRs.\n  Use for: issue triage, label, priority, backlog management.'"
                }
              </span>
              {"\n"}
              <span className={styles.cm}>target</span>
              {": "}
              <span className={styles.cv}>{"'github-copilot'"}</span>
              {"  "}
              <span className={styles.cc}>{"# 必須: github-copilot | vscode"}</span>
              {"\n"}
              <span className={styles.cm}>tools</span>
              {": ["}
              <span className={styles.cv}>{"'github/list_issues'"}</span>
              {", "}
              <span className={styles.cv}>{"'github/update_issue'"}</span>
              {", "}
              <span className={styles.cv}>{"'github/add_labels'"}</span>
              {", "}
              <span className={styles.cv}>{"'read_file'"}</span>
              {"]\n"}
              <span className={styles.cc}>
                {"# 'github/*' はビルトインMCPサーバー（追加設定不要）"}
              </span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              <span className={styles.ch}>{"## Role"}</span>
              {"\nGitHubのIssueを体系的にトリアージする。\n\n"}
              <span className={styles.ch}>{"## Triage Process"}</span>
              {"\n1. 未ラベルのIssueを取得する\n2. 内容を分析して以下のラベルを付与:\n   - "}
              <span className={styles.cs}>bug</span>
              {" / "}
              <span className={styles.cs}>enhancement</span>
              {" / "}
              <span className={styles.cs}>documentation</span>
              {" / "}
              <span className={styles.cs}>question</span>
              {"\n   - 優先度: "}
              <span className={styles.cs}>P0-critical</span>
              {" / "}
              <span className={styles.cs}>P1-high</span>
              {" / "}
              <span className={styles.cs}>P2-medium</span>
              {" / "}
              <span className={styles.cs}>P3-low</span>
              {"\n3. 関連するPRや既存Issueがあればリンクを追加\n\n"}
              <span className={styles.ch}>{"## Constraints"}</span>
              {"\n- "}
              <span className={styles.cw}>{"コードを変更しない"}</span>
              {"\n- Issueのクローズは行わない（人間が最終判断）"}
            </div>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>{"⑤ readme-creator.agent.md — README作成（GitHub Docs公式テンプレート）"}</span>
              <span className={styles.codeLang}>{"YAML + MD"}</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>name</span>
              {": "}
              <span className={styles.cv}>{"'README Creator'"}</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cv}>
                {
                  "'Creates and improves README files. Scope limited to README and docs only.\n  Use for: README, documentation, getting started, badges.'"
                }
              </span>
              {"\n"}
              <span className={styles.cm}>target</span>
              {": "}
              <span className={styles.cv}>{"'github-copilot'"}</span>
              {"  "}
              <span className={styles.cc}>{"# 必須: github-copilot | vscode"}</span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cc}>
                {"# ↑ tools 省略 = 全ツール使用可（最もシンプルな構成）"}
              </span>
              {"\n"}
              <span className={styles.cc}>
                {"# GitHub Docs の公式テンプレートをベースにカスタマイズ"}
              </span>
              {"\n\n"}
              <span className={styles.ch}>{"## Role"}</span>
              {
                "\nREADMEとドキュメントファイルの作成・改善に特化する。\nコードファイル・設定ファイルは変更しない。\n\n"
              }
              <span className={styles.ch}>{"## README Structure"}</span>
              {
                "\n- Overview（概要・目的）\n- Installation（インストール手順）\n- Usage（使い方・サンプル）\n- Contributing（コントリビューション方法）\n- License\n\n"
              }
              <span className={styles.ch}>{"## Rules"}</span>
              {
                "\n- 相対リンクを使用する（絶対URLは避ける）\n- バッジは必要最小限\n- コードサンプルにはシンタックスハイライトを使用"
              }
            </div>
          </div>
        </section>
        <section id="s12" className={styles.sec}>
          <div
            className={styles.secHead}
            style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px solid var(--border2)" }}
          >
            <h2 style={{ fontSize: "1.1rem" }}>
              {"4-8. .agent.md ベストプラクティス 12則 "}
              <span className={styles.newB}>NEW</span>
            </h2>
          </div>
          <div className={styles.bpGrid}>
            <div className={`${styles.bpCard} ${styles.bpG}`}>
              <div className={styles.bpNum}>01</div>
              <h4>{"descriptionは「Focuses on X, does NOT do Y」形式で"}</h4>
              <p>
                {
                  "2,500リポジトリの分析から、明確なdescriptionを持つエージェントほど誤呼び出しが少ない。50〜150文字で「使う場面」と「使わない場面」を両方書く。"
                }
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpB}`}>
              <div className={styles.bpNum}>02</div>
              <h4>{"ツールは最小権限の原則を徹底する"}</h4>
              <p>
                {
                  "tools省略=全ツール許可は危険。セキュリティ審査エージェントは read_file+grep のみ。本番DB操作ツールは原則許可しない。必要に応じて人間確認ステップを本文に組み込む。"
                }
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpP}`}>
              <div className={styles.bpNum}>03</div>
              <h4>{"本文Constraintsセクションで「絶対に行わないこと」を明記"}</h4>
              <p>
                {
                  "「ソースコードを変更しない」「本番DBには書き込まない」「テストを削除しない」などをConstraintsセクションに明示。LLMの非決定性に対する安全網として機能する。"
                }
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpA}`}>
              <div className={styles.bpNum}>04</div>
              <h4>{"handoffsはsend:false（手動承認）を原則にする"}</h4>
              <p>
                {
                  "send:trueの自動送信は完全自動化できるが、予期しない変更につながるリスクがある。重要な処理の前は send:false でユーザー確認を挟む設計が安全。CI/CD用途のみsend:true。"
                }
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpT}`}>
              <div className={styles.bpNum}>05</div>
              <h4>{"サブエージェント専用は user-invocable: false にする"}</h4>
              <p>
                {
                  "plannerから呼び出されるimplementerなど、直接呼び出し不要なエージェントは @メニューに表示しない。coordinatorがagents[]で明示すれば上書き可能。エコシステムをクリーンに保てる。"
                }
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpG}`}>
              <div className={styles.bpNum}>06</div>
              <h4>{"File Boundariesを本文に必ず書く"}</h4>
              <p>
                {
                  "「書き込みは /tests/ のみ」「/docs/ 以外は読み取り専用」のように書き込み範囲を明示する。toolsでの制限に加え、本文でも自然言語で制約を再確認するダブルチェック体制が重要。"
                }
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpB}`}>
              <div className={styles.bpNum}>07</div>
              <h4>{"MCPシークレットはcopilot環境から取得する"}</h4>
              <p>
                {
                  "mcp-servers の env に直接トークンを書かない。リポジトリ Settings → Copilot → Coding Agent の「copilot」環境に登録し、$"
                }
                {"{{ secrets.COPILOT_MCP_* }}"}
                {" で参照する。gitにシークレットを含めない。"}
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpR}`}>
              <div className={styles.bpNum}>08</div>
              <h4>{"handoffsはGitHub.com Coding Agentでは動作しない"}</h4>
              <p>
                {
                  "handoffsとargument-hintはIDE専用機能（VS Code・JetBrains・Eclipse・Xcode）。GitHub.com上でIssueに割り当てる「Copilot Coding Agent」では無視される。プラットフォーム別の設計が必要。"
                }
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpP}`}>
              <div className={styles.bpNum}>09</div>
              <h4>{"modelはIDEで使用、GitHub.comでは無視"}</h4>
              <p>
                {
                  "model指定はVS Code等のIDEカスタムエージェント専用。GitHub.comのCopilot Coding AgentはOrg/Repoの設定に従う。配列指定でフォールバックも設定可能: ['Claude Opus', 'GPT-5']"
                }
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpA}`}>
              <div className={styles.bpNum}>10</div>
              <h4>{"agentsでサブエージェントホワイトリストを制限する"}</h4>
              <p>
                {
                  "agents[]を省略するとdisable-model-invocation:falseの全エージェントがサブエージェント対象になる。予期しない呼び出しを防ぐため、coordinatorエージェントは使用するサブエージェントを明示的に列挙する。"
                }
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpT}`}>
              <div className={styles.bpNum}>11</div>
              <h4>{"エージェントはgit管理してデフォルトブランチに置く"}</h4>
              <p>
                {
                  "GitHub.com Copilot Coding AgentはデフォルトブランチのエージェントのみIssueトリアージUIに表示する。PR中のエージェントはIDE経由では使えるが、GitHub.comのAgentsパネルには表示されない。"
                }
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpG}`}>
              <div className={styles.bpNum}>12</div>
              <h4>{"Output Formatセクションで出力を標準化する"}</h4>
              <p>
                {
                  "「テスト完了後は作成ファイル一覧・Pass/Fail数・カバレッジ変化を報告する」のように出力形式を明示する。チームメンバーがエージェントの成果物を予測・評価できるようになる。"
                }
              </p>
            </div>
          </div>
        </section>
        <section id="s13" className={styles.sec}>
          <div
            className={styles.secHead}
            style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px solid var(--border2)" }}
          >
            <h2 style={{ fontSize: "1.1rem" }}>
              {"4-9. トラブルシューティング — よくある問題と解決策 "}
              <span className={styles.newB}>NEW</span>
            </h2>
          </div>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>症状</th>
                  <th>原因</th>
                  <th>解決策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>@エージェント名</code>
                    {"がメニューに表示されない"}
                  </td>
                  <td>
                    {
                      "descriptionフィールドがない / ファイル名に不正文字 / デフォルトブランチ未コミット"
                    }
                  </td>
                  <td>
                    {
                      "descriptionを追加、ファイル名を英数字・ハイフン・アンダースコアのみに変更、デフォルトブランチにpush"
                    }
                  </td>
                </tr>
                <tr>
                  <td>{"エージェントが意図しないファイルを変更する"}</td>
                  <td>{"toolsが無制限 / 本文にConstraintsがない"}</td>
                  <td>
                    {
                      "toolsに必要なツールのみ明示。本文Constraintsセクションに「○○以外を変更しない」と明記"
                    }
                  </td>
                </tr>
                <tr>
                  <td>{"handoffsボタンが表示されない"}</td>
                  <td>{"GitHub.com（Coding Agent）で使用している / IDE未対応"}</td>
                  <td>
                    {
                      "handoffsはIDE専用（VS Code・JetBrains等）。GitHub.comでは使用不可。IDE上で使用するか、AGENTS.md記述に変更"
                    }
                  </td>
                </tr>
                <tr>
                  <td>{"MCPサーバーへの接続が失敗する"}</td>
                  <td>{"シークレットが設定されていない / typeが間違っている"}</td>
                  <td>
                    {
                      "リポジトリSettings → Copilot → Coding Agent → copilot環境にシークレットを登録。GitHub.comはlocalタイプ（stdioと互換）を使用"
                    }
                  </td>
                </tr>
                <tr>
                  <td>{"サブエージェントが予期しないエージェントを呼び出す"}</td>
                  <td>{"agents[]が未設定で全エージェントが対象になっている"}</td>
                  <td>
                    {"coordinatorエージェントのfrontmatterに "}
                    <code>{"agents: [worker1, worker2]"}</code>
                    {" を追加して使用エージェントを制限"}
                  </td>
                </tr>
                <tr>
                  <td>{"モデル指定が効かない"}</td>
                  <td>{"GitHub.com Copilot Coding Agentで使用している"}</td>
                  <td>
                    {
                      "model指定はIDEカスタムエージェント専用。GitHub.comではOrg/Repo設定のモデルが使用される"
                    }
                  </td>
                </tr>
                <tr>
                  <td>{"エージェントが同じ指示を毎回繰り返す"}</td>
                  <td>{"copilot-instructions.mdと内容が重複している"}</td>
                  <td>
                    {
                      "エージェント固有の専門指示のみをagent.mdに書き、汎用ルールはcopilot-instructions.mdに集約して重複を避ける"
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.card} style={{ marginTop: "20px" }}>
            <div className={styles.cardTitle}>{"📊 Good vs Anti Pattern — .agent.md 設計比較"}</div>
            <div className={styles.patGrid}>
              <div className={`${styles.pat} ${styles.patOk}`}>
                <div className={styles.patLabel}>{"✅ ベストプラクティス"}</div>
                <ul>
                  <li>{"1エージェント = 1専門領域（単一責任）"}</li>
                  <li>{"descriptionに「Use for: ... / Does NOT:...」両方記載"}</li>
                  <li>{"toolsを最小権限で明示"}</li>
                  <li>{"本文にConstraints・File Boundaries・Output Format"}</li>
                  <li>{"handoffs は send:false（手動承認）を原則"}</li>
                  <li>{"サブエージェント専用は user-invocable: false"}</li>
                  <li>{"MCPシークレットはcopilot環境変数で管理"}</li>
                  <li>{"エージェントをgit管理・デフォルトブランチに配置"}</li>
                </ul>
              </div>
              <div className={`${styles.pat} ${styles.patNg}`}>
                <div className={styles.patLabel}>{"✗ アンチパターン"}</div>
                <ul>
                  <li>{"description が曖昧・短すぎる（1行）"}</li>
                  <li>{"tools 省略（全ツール許可のまま）"}</li>
                  <li>{"本番DBアクセスツールを制限なく許可"}</li>
                  <li>{"「何でもやる汎用エージェント」を1つ作る"}</li>
                  <li>{"handoffs を send:true にして確認なく自動実行"}</li>
                  <li>{"MCPシークレットをYAMLに直書きしてgitにコミット"}</li>
                  <li>{"copilot-instructions.mdと全く同じ内容を重複記述"}</li>
                  <li>{"ファイル名に日本語・スペースを使用"}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={`${styles.alert} ${styles.ag}`}>
            <span className={styles.alertIcon}>💡</span>
            <div className={styles.alertBody}>
              <strong>{"copilot-instructions.mdとの位置関係："}</strong>
              {" エージェントのプロンプトはシステムプロンプト内で "}
              <code>copilot-instructions.md</code>
              {" の"}
              <strong>{"下"}</strong>
              {
                "に配置されます。つまり全体のルールは常に尊重されつつ、エージェントがその振る舞いを拡張・上書きできます。エージェント固有のルールを "
              }
              <code>copilot-instructions.md</code>
              {" に書く必要はありません（重複・コンテキスト汚染の原因になります）。"}
            </div>
          </div>
        </section>
        <hr />
        <section id="s14" className={styles.sec}>
          <div className={styles.secHead}>
            <span className={styles.secNum}>5</span>
            <h2>
              <span className={styles.mono}>.github/skills/*/SKILL.md</span>
              {" — 遅延ロード型スキル（Open Standard）"}
            </h2>
            <span className={styles.note}>
              2025年12月〜 · VS Code + Copilot CLI + Coding Agent 対応
            </span>
          </div>
          <div className={styles.card}>
            <p>
              {"Agent Skills は "}
              <strong>プロンプトに関連する場合のみ自動ロードされる「専門知識パッケージ」</strong>
              {"です。"}
              <code>copilot-instructions.md</code>
              {
                " が常時ロードされるのに対して、SKILL.md はタスクマッチ時のみロードされます（プログレッシブ・ディスクロージャー）。"
              }
              <strong>Anthropic の Claude Code と同じフォーマット</strong>
              {"のオープンスタンダードであり、"}
              <code>anthropics/skills</code>
              {" リポジトリのスキルをそのまま使えます。"}
            </p>
          </div>
          <div className={`${styles.alert} ${styles.ag}`}>
            <span className={styles.alertIcon}>✅</span>
            <div className={styles.alertBody}>
              <strong>Claude Code の .claude/skills/ と互換性あり</strong>
              <code>.claude/skills/</code>
              {
                " に配置したスキルは GitHub Copilot が自動的に認識します。スキルはクロスツールで動作するオープンスタンダードです。"
              }
              <code>github/awesome-copilot</code>
              {" や "}
              <code>anthropics/skills</code>
              {" リポジトリのコミュニティスキルも利用できます。"}
            </div>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>.github/skills/playwright-testing/SKILL.md</span>
              <span className={styles.codeLang}>Markdown + YAML frontmatter</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>name</span>
              {": "}
              <span className={styles.cv}>playwright-testing</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cv}>
                {
                  "|\n  Playwright を使った E2E テストを作成・実行するスキル。\n  以下の場合にトリガーする:\n  - ブラウザベースのテストを作成してほしい\n  - E2E テストを実行・デバッグしてほしい\n  - Playwright の設定・セットアップが必要\n  \n  以下の場合はトリガーしない:\n  - ユニットテスト（Vitest）の作成\n  - API テスト（supabase functions test）"
                }
              </span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              <span className={styles.ch}># Playwright E2E Testing</span>
              {"\n\n"}
              <span className={styles.cm}>## Setup</span>
              {"\nインストール: "}
              <span className={styles.cs}>{"`pnpm add -D @playwright/test`"}</span>
              {"\n設定: playwright.config.ts（プロジェクトルート）\nブラウザインストール: "}
              <span className={styles.cs}>{"`pnpm playwright install chromium`"}</span>
              {"\n\n"}
              <span className={styles.cm}>## Page Object Pattern</span>
              {"\nすべての E2E テストはページオブジェクトパターンを使用する:\n\n"}
              <span className={styles.cs}>
                {
                  "```typescript\n// tests/pages/LoginPage.ts\nexport class LoginPage {\n  constructor(private page: Page) {}\n  \n  async login(email: string, password: string) {\n    await this.page.getByTestId('email').fill(email)\n    await this.page.getByTestId('password').fill(password)\n    await this.page.getByTestId('submit').click()\n  }\n}\n```"
                }
              </span>
              {"\n\n"}
              <span className={styles.cm}>## Commands</span>
              {"\n- 全 E2E 実行: "}
              <span className={styles.cs}>{"`pnpm playwright test`"}</span>
              {"\n- UI モード:   "}
              <span className={styles.cs}>{"`pnpm playwright test --ui`"}</span>
              {"\n- トレース記録: "}
              <span className={styles.cs}>{"`pnpm playwright test --trace on`"}</span>
              {"\n\n"}
              <span className={styles.cm}>## Test Structure Rules</span>
              {"\n- "}
              <span className={styles.cs}>data-testid</span>
              {" 属性でセレクタを指定（クラス名は変わりやすいため禁止）\n- "}
              <span className={styles.cs}>beforeEach</span>
              {
                " でテスト状態をリセット\n- 各テストは独立して実行可能なこと（テスト間の依存禁止）\n\n"
              }
              <span className={styles.cc}>
                {"# スキルディレクトリには追加リソースも含められる"}
              </span>
              {"\n"}
              <span className={styles.cc}>
                {"# ./test-template.ts  — テストテンプレート（参照可能）"}
              </span>
              {"\n"}
              <span className={styles.cc}>{"# ./setup-guide.md    — 詳細セットアップガイド"}</span>
            </div>
          </div>
        </section>
        <section id="s15" className={styles.sec}>
          <div className={styles.secHead}>
            <span className={styles.secNum}>6</span>
            <h2>
              <span className={styles.mono}>*.prompt.md</span>
              {" / "}
              <span className={styles.mono}>*.chatmode.md</span>
              {" — 再利用プロンプトとチャットモード"}
            </h2>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>.github/prompts/my-pull-requests.prompt.md</span>
              <span className={styles.codeLang}>Markdown + YAML（再利用プロンプト）</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>mode</span>
              {": "}
              <span className={styles.cv}>agent</span>
              {"\n"}
              <span className={styles.cm}>tools</span>
              {": ["}
              <span className={styles.cs}>{"'githubRepo'"}</span>
              {", "}
              <span className={styles.cs}>{"'list_pull_requests'"}</span>
              {", "}
              <span className={styles.cs}>{"'get_pull_request'"}</span>
              {", "}
              <span className={styles.cs}>{"'request_copilot_review'"}</span>
              {"]"}
              {"\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cv}>
                {'"現在のリポジトリの自分のPR一覧を取得して状態を確認する"'}
              </span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              {"現在のリポジトリ（"}
              <span className={styles.cw}>#githubRepo</span>
              {" でリポジトリ情報を取得）で、\n自分にアサインされた PR を "}
              <span className={styles.cw}>#list_pull_requests</span>
              {
                " で取得してください。\n\n各 PR について以下を報告:\n- PR の目的・変更内容の概要\n- レビュー待ちの場合はそれを強調\n- CI チェックが失敗している場合は原因と修正案\n- Copilot レビューが未実施の場合は "
              }
              <span className={styles.cw}>#request_copilot_review</span>
              {" を提案\n\n"}
              <span className={styles.cc}>{"# 使い方: /my-pull-requests コマンドで実行"}</span>
            </div>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>.github/chatmodes/databaseadmin.chatmode.md</span>
              <span className={styles.codeLang}>Markdown + YAML（カスタムチャットモード）</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>---</span>
              {"\n"}
              <span className={styles.cm}>name</span>
              {": "}
              <span className={styles.cv}>Database Admin</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cv}>
                PostgreSQL DBA の専門家としてデータベース管理を支援する
              </span>
              {"\n"}
              <span className={styles.cm}>tools</span>
              {": ["}
              <span className={styles.cs}>{"'pgsql_connect'"}</span>
              {", "}
              <span className={styles.cs}>{"'pgsql_query'"}</span>
              {", "}
              <span className={styles.cs}>{"'read_file'"}</span>
              {"]"}
              {"\n"}
              <span className={styles.cm}>icon</span>
              {": "}
              <span className={styles.cv}>database</span>
              {"\n"}
              <span className={styles.cs}>---</span>
              {"\n\n"}
              {"あなたは経験豊富な PostgreSQL DBA です。\n\n"}
              <span className={styles.ch}>## Your Expertise</span>
              {
                "\n- クエリの最適化（EXPLAIN ANALYZE の読み方・インデックス設計）\n- スキーマ設計（正規化・非正規化の判断）\n- Supabase Row Level Security (RLS) ポリシー\n- マイグレーション計画（ゼロダウンタイム移行）\n\n"
              }
              <span className={styles.ch}>## Tools Available</span>
              {"\n- "}
              <span className={styles.cw}>pgsql_connect</span>
              {": データベースへの接続\n- "}
              <span className={styles.cw}>pgsql_query</span>
              {":   SQL クエリの実行・確認\n\n"}
              <span className={styles.ch}>## Safety Rules</span>
              {"\n- "}
              <span className={styles.cw}>DROP / TRUNCATE は必ず確認してから実行</span>
              {"\n- 本番 DB への書き込みは提案するが自動実行しない\n- "}
              <span className={styles.cw}>
                すべてのマイグレーションは --dry-run で確認してから適用
              </span>
            </div>
          </div>
          <div className={styles.tblWrap}>
            <table>
              <thead>
                <tr>
                  <th>ファイル種別</th>
                  <th>配置場所</th>
                  <th>呼び出し方</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>*.prompt.md</code>
                  </td>
                  <td>
                    <code>.github/prompts/</code>
                  </td>
                  <td>
                    <code>/コマンド名</code>
                  </td>
                  <td>繰り返し使うタスクを再利用プロンプトとして定義</td>
                </tr>
                <tr>
                  <td>
                    <code>*.chatmode.md</code>
                  </td>
                  <td>
                    <code>.github/chatmodes/</code>
                  </td>
                  <td>モード切替 UI</td>
                  <td>特定の DBA・セキュリティ等のペルソナモード定義</td>
                </tr>
                <tr>
                  <td>
                    <code>*.agent.md</code>
                  </td>
                  <td>
                    <code>.github/agents/</code>
                  </td>
                  <td>
                    <code>@エージェント名</code>
                  </td>
                  <td>ツール・MCP・指示を持つ専門エージェント定義</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section id="s16" className={styles.sec}>
          <div className={styles.secHead}>
            <span className={styles.secNum}>7</span>
            <h2>
              <span className={styles.mono}>AGENTS.md</span>
              {" — クロスツール互換戦略"}
            </h2>
          </div>
          <div className={styles.card}>
            <p>
              {"Copilot Coding Agent は 2025年8月から "}
              <code>AGENTS.md</code>
              {" をサポートし、さらに "}
              <strong>CLAUDE.md・GEMINI.md</strong>
              {" も自動認識します。チームで複数のAIツールを使う場合、"}
              <code>AGENTS.md</code>
              {
                " を共通エントリポイントにして、ツール固有の設定は別ファイルに分離する戦略が推奨されています。"
              }
            </p>
          </div>
          <div className={styles.compatGrid}>
            <div className={styles.compatCard}>
              <div className={styles.compatIcon}>🐙</div>
              <div className={styles.compatName}>Copilot Coding Agent</div>
              <div className={styles.compatFile}>copilot-instructions.md</div>
              <div className={styles.compatFile}>AGENTS.md</div>
              <div className={styles.compatFile}>CLAUDE.md</div>
              <div className={styles.compatFile}>GEMINI.md</div>
            </div>
            <div className={styles.compatCard}>
              <div className={styles.compatIcon}>🤖</div>
              <div className={styles.compatName}>Claude Code</div>
              <div className={styles.compatFile}>CLAUDE.md</div>
              <div className={styles.compatFile}>AGENTS.md</div>
            </div>
            <div className={styles.compatCard}>
              <div className={styles.compatIcon}>♊</div>
              <div className={styles.compatName}>Gemini CLI</div>
              <div className={styles.compatFile}>GEMINI.md</div>
              <div className={styles.compatFile}>AGENTS.md</div>
            </div>
            <div className={styles.compatCard}>
              <div className={styles.compatIcon}>⚙️</div>
              <div className={styles.compatName}>Codex CLI</div>
              <div className={styles.compatFile}>AGENTS.md</div>
            </div>
            <div className={styles.compatCard}>
              <div className={styles.compatIcon}>⚡</div>
              <div className={styles.compatName}>
                {"Copilot CLI "}
                <small style={{ fontSize: "10px", opacity: 0.7 }}>(GA Feb 2026)</small>
              </div>
              <div className={styles.compatFile}>copilot-instructions.md</div>
              <div className={styles.compatFile}>AGENTS.md</div>
              <div className={styles.compatFile}>CLAUDE.md</div>
              <div className={styles.compatFile}>GEMINI.md</div>
            </div>
          </div>
          <div className={`${styles.alert} ${styles.ai}`}>
            <span className={styles.alertIcon}>💡</span>
            <div className={styles.alertBody}>
              <strong>Agentic Workflows（GitHub Actions 統合）</strong>
              {
                "AGENTS.md を使った GitHub Actions のマルチエージェントワークフロー（コードトリアージ・ドキュメント自動更新・品質チェック）が段階的に展開中です（2026年 Technical Preview）。Issues のラベル付けを "
              }
              <code>@triage-agent</code>
              {" に、PR のドキュメント更新を "}
              <code>@docs-agent</code>
              {" に自動委譲する構成が可能になります。"}
            </div>
          </div>
        </section>
        <section id="s17" className={styles.sec}>
          <div className={styles.secHead}>
            <span className={styles.secNum}>8</span>
            <h2>ファイル選択の意思決定ツリー</h2>
          </div>
          <div className={styles.dflow}>
            <div className={styles.dflowTitle}>どのMarkdownファイルを使うべきか — 決定フロー</div>
            <div className={styles.dflowRow}>
              <div className={styles.dnQ}>
                すべてのファイル・コンテキストに
                <br />
                常時適用したい指示？
              </div>
              <div className={styles.dnArr}>→ YES →</div>
              <div className={styles.dnY}>
                copilot-instructions.md
                <br />
                <small>.github/ 直下に配置</small>
              </div>
            </div>
            <div className={styles.dnIn} style={{ marginTop: "12px" }}>
              <div className={styles.dflowRow}>
                <span style={{ color: "var(--text3)", fontSize: "13px" }}>↓ NO</span>
              </div>
              <div className={styles.dflowRow}>
                <div className={styles.dnQ}>
                  特定のパス・ファイル種別にのみ
                  <br />
                  適用したい？（例: src/components/）
                </div>
                <div className={styles.dnArr}>→ YES →</div>
                <div className={styles.dnY}>
                  *.instructions.md
                  <br />
                  <small>applyTo + excludeAgent</small>
                </div>
              </div>
              <div className={styles.dnIn} style={{ marginTop: "12px" }}>
                <div className={styles.dflowRow}>
                  <span style={{ color: "var(--text3)", fontSize: "13px" }}>↓ NO</span>
                </div>
                <div className={styles.dflowRow}>
                  <div className={styles.dnQ}>
                    専門的なペルソナ・ツールセット
                    <br />
                    を持つエージェントを定義したい？
                  </div>
                  <div className={styles.dnArr}>→ YES →</div>
                  <div className={styles.dnY}>
                    *.agent.md
                    <br />
                    <small>@エージェント名で呼び出し</small>
                  </div>
                </div>
                <div className={styles.dnIn} style={{ marginTop: "12px" }}>
                  <div className={styles.dflowRow}>
                    <span style={{ color: "var(--text3)", fontSize: "13px" }}>↓ NO</span>
                  </div>
                  <div className={styles.dflowRow}>
                    <div className={styles.dnQ}>
                      マッチ時のみロードされる
                      <br />
                      専門知識（手順・コマンド等）？
                    </div>
                    <div className={styles.dnArr}>→ YES →</div>
                    <div className={styles.dnY}>
                      SKILL.md
                      <br />
                      <small>.github/skills/*/SKILL.md</small>
                    </div>
                  </div>
                  <div className={styles.dnIn} style={{ marginTop: "12px" }}>
                    <div className={styles.dflowRow}>
                      <span style={{ color: "var(--text3)", fontSize: "13px" }}>↓ NO</span>
                    </div>
                    <div className={styles.dflowRow}>
                      <div className={styles.dnQ}>
                        繰り返し実行するタスク
                        <br />を /コマンドで呼びたい？
                      </div>
                      <div className={styles.dnArr}>→ YES →</div>
                      <div className={styles.dnY}>
                        *.prompt.md
                        <br />
                        <small>.github/prompts/</small>
                      </div>
                    </div>
                    <div className={styles.dnIn} style={{ marginTop: "12px" }}>
                      <div className={styles.dflowRow}>
                        <span style={{ color: "var(--text3)", fontSize: "13px" }}>↓ NO</span>
                      </div>
                      <div className={styles.dflowRow}>
                        <div className={styles.dnY}>
                          *.chatmode.md
                          <br />
                          <small>カスタムペルソナモード</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="s18" className={styles.sec}>
          <div className={styles.secHead}>
            <h2>9. 絶対に避けるべき Anti-Patterns</h2>
          </div>
          <p style={{ color: "var(--text2)", fontStyle: "italic" }}>移行中</p>
        </section>
        <section id="s19" className={styles.sec}>
          <div className={styles.secHead}>
            <h2>10. まとめ</h2>
          </div>
          <p style={{ color: "var(--text2)", fontStyle: "italic" }}>移行中</p>
        </section>
        <hr />

        {/* Sources */}
        <section id="sources" className={styles.sec}>
          <div className={styles.secHead}>
            <span className={styles.secNum}>📚</span>
            <h2>参考ソース（公式・一次情報優先）— 2026年版</h2>
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
