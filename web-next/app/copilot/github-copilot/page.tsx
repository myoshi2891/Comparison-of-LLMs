import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "GitHub Copilot 完全ガイド 2026 | ベストプラクティス",
  description:
    "2026年3月最新版 — 初学者からエキスパートまで対応したステップバイステップのAIコーディングアシスタント活用法",
};

type Source = {
  icon: string;
  title: string;
  href: string;
  url: string;
  badge: string;
};

const TOC_ITEMS = [
  { id: "s01", label: "01 GitHub Copilotとは？" },
  { id: "s02", label: "02 プラン比較・選び方" },
  { id: "s03", label: "03 インストール手順" },
  { id: "s04", label: "04 効果的なプロンプト" },
  { id: "s05", label: "05 2026年の主要機能" },
  { id: "s06", label: "06 10のベストプラクティス" },
  { id: "s07", label: "07 セキュリティ注意点" },
  { id: "s08", label: "08 AIモデル選択ガイド" },
  { id: "s09", label: "09 導入チェックリスト" },
  { id: "sources", label: "10 参考ソース一覧" },
] as const;

const SOURCES: Source[] = [
  {
    icon: "📘",
    title: "GitHub Copilot 公式ドキュメント",
    href: "https://docs.github.com/en/copilot",
    url: "docs.github.com/en/copilot",
    badge: "GitHub Docs",
  },
  {
    icon: "🤖",
    title: "GitHub Copilot の使い方 — クイックスタート",
    href: "https://docs.github.com/en/copilot/quickstart",
    url: "docs.github.com/en/copilot/quickstart",
    badge: "GitHub Docs",
  },
  {
    icon: "✍️",
    title: "Copilot へのプロンプト エンジニアリング",
    href: "https://docs.github.com/en/copilot/using-github-copilot/prompt-engineering-for-github-copilot",
    url: "docs.github.com/en/copilot/using-github-copilot/prompt-engineering-for-github-copilot",
    badge: "GitHub Docs",
  },
  {
    icon: "🔧",
    title: "カスタム指示の設定（copilot-instructions.md）",
    href: "https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot",
    url: "docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions",
    badge: "GitHub Docs",
  },
  {
    icon: "💡",
    title: "Copilot エージェントモード（GitHub Blog）",
    href: "https://github.blog/ai-and-ml/github-copilot/github-copilot-agent-mode-activated/",
    url: "github.blog/ai-and-ml/github-copilot/github-copilot-agent-mode-activated",
    badge: "GitHub Blog",
  },
  {
    icon: "🌐",
    title: "GitHub Copilot と Bing 検索連携",
    href: "https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-for-pull-requests/using-copilot-to-help-you-work-on-a-pull-request",
    url: "docs.github.com/en/copilot/using-github-copilot",
    badge: "GitHub Docs",
  },
  {
    icon: "🔒",
    title: "GitHub Copilot のセキュリティとデータ保護",
    href: "https://docs.github.com/en/site-policy/privacy-policies/github-copilot-business-privacy-statement",
    url: "docs.github.com/en/site-policy/privacy-policies/github-copilot-business-privacy-statement",
    badge: "GitHub Docs",
  },
  {
    icon: "🧠",
    title: "Copilot が使用する AIモデルの選択",
    href: "https://docs.github.com/en/copilot/using-github-copilot/ai-models/changing-the-ai-model-for-copilot-chat",
    url: "docs.github.com/en/copilot/using-github-copilot/ai-models/changing-the-ai-model-for-copilot-chat",
    badge: "GitHub Docs",
  },
  {
    icon: "🗺️",
    title: "GitHub Copilot のロードマップ",
    href: "https://github.com/orgs/github/projects/4247",
    url: "github.com/orgs/github/projects/4247",
    badge: "GitHub",
  },
  {
    icon: "📊",
    title: "GitHub Copilot のプランと料金",
    href: "https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot",
    url: "docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot",
    badge: "GitHub Docs",
  },
  {
    icon: "🏢",
    title: "組織・Enterprise向けCopilot課金の詳細（公式）",
    href: "https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises",
    url: "docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises",
    badge: "GitHub Docs",
  },
];

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function GithubCopilotPage() {
  return (
    <div className={styles.wrapper}>
      {/* ─── Hero ─── */}
      <header className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.badgeDot} />
          Updated: March 2026
        </div>
        <h1 className={styles.heroTitle}>
          <span className={styles.dim}>{"// "}</span>
          <span className={styles.accent}>GitHub Copilot</span>
          <br />
          完全ベストプラクティスガイド
        </h1>
        <p className={styles.heroSub}>
          2026年3月最新版 — 初学者からエキスパートまで対応した
          <br />
          ステップバイステップのAIコーディングアシスタント活用法
        </p>
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>55%</span>
            <span className={styles.statLabel}>コーディング生産性向上</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>5</span>
            <span className={styles.statLabel}>プランバリエーション</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>10+</span>
            <span className={styles.statLabel}>対応IDE数</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>75%</span>
            <span className={styles.statLabel}>開発者満足度向上</span>
          </div>
        </div>
      </header>

      {/* ─── Nav ─── */}
      <nav className={styles.topNav} aria-label="セクションナビゲーション">
        {TOC_ITEMS.map((item) => (
          <a key={item.id} href={`#${item.id}`} className={styles.navItem}>
            {item.label}
          </a>
        ))}
      </nav>

      <main>
        {/* ─── TOC ─── */}
        <nav className={styles.toc} aria-label="目次">
          <div className={styles.tocTitle}>{"// 目次 — Table of Contents"}</div>
          <div className={styles.tocGrid}>
            {TOC_ITEMS.map((item) => (
              <a key={item.id} href={`#${item.id}`} className={styles.tocLink}>
                <span className={styles.tocNum}>{item.label.slice(0, 2)}</span>
                {item.label.slice(3)}
              </a>
            ))}
          </div>
        </nav>

        {/* ─── s01: overview ─── */}
        <section id="s01" className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={styles.secNum}>01</span>
            <div>
              <h2 className={styles.secTitle}>GitHub Copilotとは？</h2>
              <p className={styles.secDesc}>
                AIを活用したコーディングアシスタントの全体像を理解しましょう
              </p>
            </div>
          </div>
          <div className={styles.cardGrid} style={{ marginBottom: "32px" }}>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🤖</span>
              <div className={styles.cardTitle}>AIペアプログラマー</div>
              <div className={styles.cardDesc}>
                GitHub
                Copilotは、コードを書く際にリアルタイムで提案を行うAIアシスタントです。行全体や関数全体の補完、コードの説明、バグ修正まで幅広くサポートします。
              </div>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>⚡</span>
              <div className={styles.cardTitle}>55%の生産性向上</div>
              <div className={styles.cardDesc}>
                GitHub社の調査では、Copilot利用者はコード作成速度が最大55%向上し、開発者満足度が75%向上したと報告されています。
              </div>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🌐</span>
              <div className={styles.cardTitle}>あらゆる環境で利用可能</div>
              <div className={styles.cardDesc}>
                VS Code、JetBrains、Xcode、Neovim、Visual Studio、Eclipse、Azure Data
                Studio、さらにターミナル（CLI）まで対応しています。
              </div>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🔗</span>
              <div className={styles.cardTitle}>GitHub完全統合（2026年）</div>
              <div className={styles.cardDesc}>
                2026年時点では、コードレビューエージェント、MCPサポート、Copilot
                Spaces、エージェントモードなど強力な機能が追加されています。
              </div>
            </div>
          </div>

          <div className={styles.secSubHead} style={{ marginBottom: "20px", marginTop: "40px" }}>
            <h3 className={styles.secSubTitle}>{"// 進化の歴史"}</h3>
          </div>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>2022年6月</div>
              <div className={styles.timelineDesc}>
                GitHub Copilot正式リリース。インラインコード補完に特化した革命的なツールとして登場
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>2023年</div>
              <div className={styles.timelineDesc}>
                Copilot Chat追加。コードの質問・説明がチャット形式でできるようになった
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>2024年</div>
              <div className={styles.timelineDesc}>
                Copilot Workspace（Issue→PR自動化）、Enterpriseティア登場
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>2025年</div>
              <div className={styles.timelineDesc}>
                マルチモデルサポート（GPT、Claude、Gemini選択可）、エージェントモード追加
              </div>
            </div>
            <div className={`${styles.timelineItem} ${styles.timelineItemLast}`}>
              <div className={styles.timelineYear}>2026年 — 現在</div>
              <div className={styles.timelineDesc}>
                コードレビューエージェント、MCPサポート、Extensionsエコシステム、Copilot
                CLI強化版（GPT-4.1対応）
              </div>
            </div>
          </div>
        </section>

        {/* ─── s02: plans ─── */}
        <section id="s02" className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={styles.secNum}>02</span>
            <div>
              <h2 className={styles.secTitle}>プラン比較＆選び方</h2>
              <p className={styles.secDesc}>あなたに最適なプランを選ぶための比較ガイド</p>
            </div>
          </div>
          {/* s02 content — faithful migration pending */}
        </section>

        {/* ─── s03: setup ─── */}
        <section id="s03" className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={styles.secNum}>03</span>
            <div>
              <h2 className={styles.secTitle}>ステップバイステップセットアップ</h2>
              <p className={styles.secDesc}>インストールから最初のコード補完まで</p>
            </div>
          </div>
          {/* s03 content — faithful migration pending */}
        </section>

        {/* ─── s04: prompting ─── */}
        <section id="s04" className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={styles.secNum}>04</span>
            <div>
              <h2 className={styles.secTitle}>効果的なプロンプト技術</h2>
              <p className={styles.secDesc}>Copilotから最高の提案を引き出すテクニック</p>
            </div>
          </div>
          {/* s04 content — faithful migration pending */}
        </section>

        {/* ─── s05: features ─── */}
        <section id="s05" className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={styles.secNum}>05</span>
            <div>
              <h2 className={styles.secTitle}>2026年の主要機能</h2>
              <p className={styles.secDesc}>最新アップデートで追加された強力な機能群</p>
            </div>
          </div>
          {/* s05 content — faithful migration pending */}
        </section>

        {/* ─── s06: tips ─── */}
        <section id="s06" className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={styles.secNum}>06</span>
            <div>
              <h2 className={styles.secTitle}>10のベストプラクティス</h2>
              <p className={styles.secDesc}>Copilotを最大限に活用するための実践的なヒント</p>
            </div>
          </div>
          {/* s06 content — faithful migration pending */}
        </section>

        {/* ─── s07: security ─── */}
        <section id="s07" className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={styles.secNum}>07</span>
            <div>
              <h2 className={styles.secTitle}>セキュリティと注意事項</h2>
              <p className={styles.secDesc}>安全にCopilotを使用するための重要な注意点</p>
            </div>
          </div>
          {/* s07 content — faithful migration pending */}
        </section>

        {/* ─── s08: models ─── */}
        <section id="s08" className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={styles.secNum}>08</span>
            <div>
              <h2 className={styles.secTitle}>AIモデル選択ガイド</h2>
              <p className={styles.secDesc}>タスクに最適なAIモデルの選び方</p>
            </div>
          </div>
          {/* s08 content — faithful migration pending */}
        </section>

        {/* ─── s09: checklist ─── */}
        <section id="s09" className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={styles.secNum}>09</span>
            <div>
              <h2 className={styles.secTitle}>導入チェックリスト</h2>
              <p className={styles.secDesc}>スムーズな導入のための完全チェックリスト</p>
            </div>
          </div>
          {/* s09 content — faithful migration pending */}
        </section>

        {/* ─── sources ─── */}
        <section id="sources" className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={styles.secNum}>10</span>
            <div>
              <h2 className={styles.secTitle}>参考ソース一覧</h2>
              <p className={styles.secDesc}>本ガイド作成に使用した公式ドキュメントと参考資料</p>
            </div>
          </div>
          <div className={styles.sourceList}>
            {SOURCES.map((s) => (
              <Ext key={s.href} href={s.href}>
                <span className={styles.sourceIcon}>{s.icon}</span>
                <div className={styles.sourceInfo}>
                  <span className={styles.sourceTitle}>{s.title}</span>
                  <span className={styles.sourceUrl}>{s.url}</span>
                </div>
                <span className={styles.sourceBadge}>{s.badge}</span>
              </Ext>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>{"// GitHub Copilot 完全ベストプラクティスガイド"}</p>
        <p style={{ marginTop: "8px", color: "var(--text-muted)" }}>
          {"Last updated: "}
          <span style={{ color: "var(--accent-cyan)" }}>March 2026</span>
          {"  |  "}
          {"Sources: "}
          <Ext href="https://docs.github.com/en/copilot">GitHub Docs</Ext>
          {" & "}
          <Ext href="https://github.blog/ai-and-ml/github-copilot/">GitHub Blog</Ext>
        </p>
        <p style={{ marginTop: "12px", fontSize: "0.7rem", color: "var(--text-muted)" }}>
          ※ 本ガイドの情報は2026年3月時点のものです。最新情報は公式ドキュメントをご確認ください。
        </p>
      </footer>
    </div>
  );
}
