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
        <section id="s01" className={styles.sec} />
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
