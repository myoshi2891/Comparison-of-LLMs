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

type SourceGroup = {
  heading: string;
  items: Source[];
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

const SOURCE_GROUPS: SourceGroup[] = [
  {
    heading: "// 公式ドキュメント",
    items: [
      {
        icon: "📖",
        title: "GitHub Copilot ベストプラクティス（公式）",
        href: "https://docs.github.com/en/copilot/get-started/best-practices",
        url: "docs.github.com/en/copilot/get-started/best-practices",
        badge: "GitHub Docs",
      },
      {
        icon: "💳",
        title: "GitHub Copilot プラン一覧（公式）",
        href: "https://docs.github.com/en/copilot/get-started/plans",
        url: "docs.github.com/en/copilot/get-started/plans",
        badge: "GitHub Docs",
      },
      {
        icon: "💻",
        title: "GitHub Copilot CLI ベストプラクティス（公式）",
        href: "https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices",
        url: "docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices",
        badge: "GitHub Docs",
      },
      {
        icon: "🚀",
        title: "GitHub Copilot 公式フィーチャーページ",
        href: "https://github.com/features/copilot",
        url: "github.com/features/copilot",
        badge: "GitHub.com",
      },
      {
        icon: "💰",
        title: "GitHub Copilot 料金プランページ",
        href: "https://github.com/features/copilot/plans",
        url: "github.com/features/copilot/plans",
        badge: "GitHub.com",
      },
      {
        icon: "🆕",
        title: "GitHub Copilot 新機能ページ",
        href: "https://github.com/features/copilot/whats-new",
        url: "github.com/features/copilot/whats-new",
        badge: "GitHub.com",
      },
    ],
  },
  {
    heading: "// GitHub Blog & Changelog",
    items: [
      {
        icon: "📝",
        title: "GitHub Blog — AI & Copilot 技術ガイド",
        href: "https://github.blog/ai-and-ml/github-copilot/",
        url: "github.blog/ai-and-ml/github-copilot/",
        badge: "Blog",
      },
      {
        icon: "📋",
        title: "Copilot CLI 強化: エージェント・コンテキスト管理（2026年1月）",
        href: "https://github.blog/changelog/2026-01-14-github-copilot-cli-enhanced-agents-context-management-and-new-ways-to-install/",
        url: "github.blog/changelog/2026-01-14-...",
        badge: "Changelog",
      },
      {
        icon: "⭐",
        title: "Awesome Copilot — コミュニティ作成の設定集",
        href: "https://github.com/github/awesome-copilot",
        url: "github.com/github/awesome-copilot",
        badge: "GitHub",
      },
    ],
  },
  {
    heading: "// 料金・比較情報",
    items: [
      {
        icon: "📊",
        title: "個人向けCopilot課金の詳細（公式）",
        href: "https://docs.github.com/en/copilot/concepts/billing/billing-for-individuals",
        url: "docs.github.com/en/copilot/concepts/billing/billing-for-individuals",
        badge: "GitHub Docs",
      },
      {
        icon: "🏢",
        title: "組織・Enterprise向けCopilot課金の詳細（公式）",
        href: "https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises",
        url: "docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises",
        badge: "GitHub Docs",
      },
    ],
  },
];

/**
 * Renders an external link that opens the provided URL in a new tab with safe `rel` attributes.
 *
 * @param href - The destination URL for the link.
 * @param children - Content to render inside the link.
 * @returns An anchor element pointing to `href` that opens in a new tab and includes `rel="noopener noreferrer"`.
 */
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/**
 * Render the GitHub Copilot "Complete Best Practices Guide" single-page article (Japanese, March 2026).
 *
 * This component produces a static, fully-structured Next.js page that includes a hero header with stats,
 * a top navigation and table of contents, nine main sections (s01–s09) covering overview, plans, setup,
 * prompting techniques, 2026 features, best practices, security, model selection, and a checklist,
 * followed by a grouped reference sources section and a footer.
 *
 * @returns A React element representing the complete guide page, including TOC links, content sections,
 * sources rendered from `SOURCE_GROUPS`, and layout styles from the local CSS module.
 */
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
                CLI強化版（GPT-5.3-Codex対応）
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
          <div className={styles.plansGrid}>
            <div className={styles.planCard}>
              <div className={styles.planName}>Free</div>
              <div className={styles.planPrice}>
                <span className={styles.planCurrency}>$</span>0
                <span className={styles.planPeriod}>/月</span>
              </div>
              <div className={styles.planTarget}>まず試してみたい方・学習目的</div>
              <ul className={styles.planFeatures}>
                <li>月2,000回のインライン補完</li>
                <li>月50回のプレミアムリクエスト</li>
                <li>基本的なChats機能</li>
              </ul>
              <span
                className={`${styles.tag} ${styles.tagFree}`}
                style={{ marginTop: "12px", display: "inline-block" }}
              >
                FREE
              </span>
            </div>
            <div className={`${styles.planCard} ${styles.planCardFeatured}`}>
              <div className={styles.planName}>Pro</div>
              <div className={styles.planPrice}>
                <span className={styles.planCurrency}>$</span>10
                <span className={styles.planPeriod}>/月</span>
              </div>
              <div className={styles.planTarget}>個人開発者・フリーランス向け</div>
              <ul className={styles.planFeatures}>
                <li>無制限のインライン補完</li>
                <li>月300回のプレミアムリクエスト</li>
                <li>Coding Agent（コーディングエージェント）</li>
                <li>Code Review（コードレビュー）</li>
                <li>30日間無料トライアルあり</li>
              </ul>
              <span
                className={`${styles.tag} ${styles.tagPro}`}
                style={{ marginTop: "12px", display: "inline-block" }}
              >
                RECOMMENDED
              </span>
            </div>
            <div className={styles.planCard}>
              <div className={styles.planName}>Pro+</div>
              <div className={styles.planPrice}>
                <span className={styles.planCurrency}>$</span>39
                <span className={styles.planPeriod}>/月</span>
              </div>
              <div className={styles.planTarget}>ヘビーユーザー・上級者向け</div>
              <ul className={styles.planFeatures}>
                <li>月1,500回のプレミアムリクエスト</li>
                <li>全モデルへのアクセス</li>
                <li>Claude Opus 4.6・o3・GPT-5.4対応</li>
                <li>Copilot CLI（GA版）</li>
                <li>最大限の柔軟性</li>
              </ul>
              <span
                className={`${styles.tag} ${styles.tagBeta}`}
                style={{ marginTop: "12px", display: "inline-block" }}
              >
                POWER
              </span>
            </div>
            <div className={styles.planCard}>
              <div className={styles.planName}>Business</div>
              <div className={styles.planPrice}>
                <span className={styles.planCurrency}>$</span>19
                <span className={styles.planPeriod}>/ユーザー/月</span>
              </div>
              <div className={styles.planTarget}>チーム・中小組織向け</div>
              <ul className={styles.planFeatures}>
                <li>組織全体の一元管理</li>
                <li>ポリシー制御・監査ログ</li>
                <li>IP補償（著作権保護）</li>
                <li>SAML SSO対応</li>
              </ul>
              <span
                className={`${styles.tag} ${styles.tagPro}`}
                style={{ marginTop: "12px", display: "inline-block" }}
              >
                TEAM
              </span>
            </div>
            <div className={styles.planCard}>
              <div className={styles.planName}>Enterprise</div>
              <div className={styles.planPrice}>
                <span className={styles.planCurrency}>$</span>39
                <span className={styles.planPeriod}>/ユーザー/月</span>
              </div>
              <div className={styles.planTarget}>大企業・コンプライアンス重視</div>
              <ul className={styles.planFeatures}>
                <li>ナレッジベース機能</li>
                <li>カスタムモデル訓練</li>
                <li>GitHub.com Chat統合</li>
                <li>Copilot CLI（GA版）</li>
                <li>GitHub Spark統合</li>
                <li>月1,000プレミアムリクエスト</li>
              </ul>
              <span
                className={`${styles.tag} ${styles.tagNew}`}
                style={{ marginTop: "12px", display: "inline-block" }}
              >
                ENTERPRISE
              </span>
            </div>
          </div>

          <div className={styles.alertInfo} style={{ marginTop: "16px", fontSize: "0.875rem" }}>
            <span className={styles.alertIcon}>📅</span>
            <div className={styles.alertContent}>
              <strong>最終更新:</strong> 2026年3月
              <br />
              <strong>参考:</strong>{" "}
              <Ext href="https://github.com/features/copilot/plans">
                GitHub Copilot Plans &amp; Pricing
              </Ext>
              ,{" "}
              <Ext href="https://docs.github.com/en/copilot/get-started/plans">
                Plans for GitHub Copilot - GitHub Docs
              </Ext>
            </div>
          </div>

          <div className={styles.alertWarn} style={{ marginTop: "24px" }}>
            <span className={styles.alertIcon}>⚠️</span>
            <div className={styles.alertContent}>
              <strong>重要：</strong> EnterpriseプランはGitHub Enterprise
              Cloud（$21/ユーザー/月）が前提条件です。合計コストは
              <strong>$60/ユーザー/月</strong>になります。
              <br />
              学生・教師・オープンソースメンテナはProプランが<strong>無料</strong>
              で利用できます。GitHub Student Developer Packを確認してください。
            </div>
          </div>
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
          <div className={styles.stepsList}>
            <div className={styles.step}>
              <div className={styles.stepNum}>01</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>GitHubアカウントの準備</div>
                <div className={styles.stepBody}>
                  <Ext href="https://github.com">github.com</Ext>
                  にアクセスしてアカウントを作成（既存アカウントでも可）。
                  プランを選択します。初めての方は<strong>Copilot Free</strong>
                  からスタートがおすすめです。
                </div>
                <ul className={styles.stepSub}>
                  <li>github.com → Settings → Copilot → 有効化</li>
                  <li>学生の方はGitHub Student Developer Pack（無料Pro）を申請</li>
                  <li>Proプランの30日間無料トライアルも活用可能</li>
                </ul>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNum}>02</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>VS Code拡張機能のインストール</div>
                <div className={styles.stepBody}>
                  VS Codeを開き、拡張機能マーケットプレイスから「GitHub
                  Copilot」を検索してインストールします。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span className={styles.codeLang}>TERMINAL</span>
                    <div className={styles.codeDots}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                  <div className={styles.codeBody}>
                    <span className={styles.cc}>
                      # VS Code コマンドパレットから実行（Ctrl/Cmd + Shift + P）
                    </span>
                    {"\n"}
                    {"ext install GitHub.copilot\next install GitHub.copilot-chat\n\n"}
                    <span className={styles.cc}># または コマンドラインから</span>
                    {"\n"}
                    {
                      "code --install-extension GitHub.copilot\ncode --install-extension GitHub.copilot-chat"
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNum}>03</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>GitHubアカウントでサインイン</div>
                <div className={styles.stepBody}>
                  VS Code左下のアカウントアイコン、またはコマンドパレットから「GitHub Copilot: Sign
                  in to GitHub」を実行。ブラウザでOAuth認証を完了します。
                </div>
                <ul className={styles.stepSub}>
                  <li>Ctrl/Cmd + Shift + P → "GitHub Copilot: Sign in"</li>
                  <li>ブラウザが開くのでGitHubアカウントで承認</li>
                  <li>認証後、エディタに戻ると右下にCopilotアイコンが表示</li>
                </ul>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNum}>04</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>動作確認 — はじめてのコード補完</div>
                <div className={styles.stepBody}>
                  Pythonファイルを作成し、コメントを書いてTabキーを押すと補完が表示されます。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span className={styles.codeLang}>PYTHON — hello_copilot.py</span>
                    <div className={styles.codeDots}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                  <div className={styles.codeBody}>
                    <span className={styles.cc}># フィボナッチ数列を返す関数を作成する</span>
                    {"\n"}
                    <span className={styles.ce}>def</span>{" "}
                    <span className={styles.cv}>fibonacci</span>
                    {"(n: "}
                    <span className={styles.cv}>int</span>
                    {") -> "}
                    <span className={styles.cv}>list</span>
                    {"["}
                    <span className={styles.cv}>int</span>
                    {"]:\n    "}
                    <span className={styles.cc}>
                      # ↑ ここでTabを押すとCopilotが補完してくれます！
                    </span>
                    {"\n    result = ["}
                    <span className={styles.cn}>0</span>
                    {", "}
                    <span className={styles.cn}>1</span>
                    {"]\n    "}
                    <span className={styles.ce}>while</span> <span className={styles.cv}>len</span>
                    {"(result) < n:\n        result.append(result["}
                    <span className={styles.cs}>-</span>
                    <span className={styles.cn}>1</span>
                    {"] + result["}
                    <span className={styles.cs}>-</span>
                    <span className={styles.cn}>2</span>
                    {"])\n    "}
                    <span className={styles.ce}>return</span>
                    {" result[:n]"}
                  </div>
                </div>
                <div className={styles.alertSuccess} style={{ marginTop: "12px" }}>
                  <span className={styles.alertIcon}>✅</span>
                  <div className={styles.alertContent}>
                    補完を<strong>受け入れる</strong>：Tab キー
                    <strong>却下する</strong>：Esc キー
                    <strong>次の候補</strong>：Alt+] / Option+]
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNum}>05</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Copilot Chatを使ってみる</div>
                <div className={styles.stepBody}>
                  サイドバーのCopilotアイコンをクリック、またはCtrl/Cmd+Shift+Iでチャット画面を開きます。
                </div>
                <ul className={styles.stepSub}>
                  <li>
                    <code>/explain</code> — 選択したコードを日本語で説明してもらう
                  </li>
                  <li>
                    <code>/fix</code> — バグを自動修正してもらう
                  </li>
                  <li>
                    <code>/tests</code> — 単体テストを自動生成
                  </li>
                  <li>
                    <code>/doc</code> — ドキュメントコメントを自動生成
                  </li>
                  <li>
                    <code>@workspace</code> — プロジェクト全体を参照して質問
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNum}>06</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>カスタム指示ファイルの設定（推奨）</div>
                <div className={styles.stepBody}>
                  プロジェクトルートに
                  <code>.github/copilot-instructions.md</code>
                  を作成すると、Copilotにプロジェクト固有の指示を与えられます。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span className={styles.codeLang}>.github/copilot-instructions.md</span>
                    <div className={styles.codeDots}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                  <div className={styles.codeBody}>
                    <span className={styles.cm}>## ビルドコマンド</span>
                    {"\n"}
                    <span className={styles.cs}>-</span>
                    {" `npm run build` - プロジェクトをビルド\n"}
                    <span className={styles.cs}>-</span>
                    {" `npm run test` - テストを実行\n"}
                    <span className={styles.cs}>-</span>
                    {" `npm run lint:fix` - Lint自動修正\n\n"}
                    <span className={styles.cm}>## コードスタイル</span>
                    {"\n"}
                    <span className={styles.cs}>-</span>
                    {" TypeScript strict modeを使用\n"}
                    <span className={styles.cs}>-</span>
                    {" 関数コンポーネントをクラスより優先\n"}
                    <span className={styles.cs}>-</span>
                    {" 公開APIには必ずJSDocコメントを付与\n\n"}
                    <span className={styles.cm}>## ワークフロー</span>
                    {"\n"}
                    <span className={styles.cs}>-</span>
                    {" コミットはConventional Commits形式\n"}
                    <span className={styles.cs}>-</span>
                    {" ブランチはmainから作成"}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          <div className={styles.alertInfo} style={{ marginBottom: "28px" }}>
            <span className={styles.alertIcon}>💡</span>
            <div className={styles.alertContent}>
              <strong>プロンプトエンジニアリングの3原則：</strong>
              ①タスクを細分化する　②要件を具体的に書く　③入出力の例を示す
            </div>
          </div>

          <h3
            className={styles.secSubTitle}
            style={{ marginBottom: "16px", letterSpacing: "0.05em", fontSize: "0.9rem" }}
          >
            {"// BAD vs GOOD — プロンプト比較"}
          </h3>

          <div className={styles.promptGrid}>
            <div className={`${styles.promptBox} ${styles.promptBoxBad}`}>
              <div className={`${styles.promptBoxLabel} ${styles.promptBoxBadLabel}`}>
                ❌ BAD — 漠然とした指示
              </div>
              <div className={styles.promptText}>ユーザー認証を作って</div>
            </div>
            <div className={`${styles.promptBox} ${styles.promptBoxGood}`}>
              <div className={`${styles.promptBoxLabel} ${styles.promptBoxGoodLabel}`}>
                ✅ GOOD — 具体的な指示
              </div>
              <div className={styles.promptText}>
                Next.js 14 + TypeScriptで、メールとパスワードによるJWT認証を実装して。 -
                bcryptでパスワードハッシュ化 - accessToken (15分) / refreshToken (7日)
                の2トークン方式 - エラーはカスタムエラークラスで返す - Zodでバリデーション
                型定義とユニットテストも含めて
              </div>
            </div>
          </div>

          <div className={styles.promptGrid} style={{ marginTop: "16px" }}>
            <div className={`${styles.promptBox} ${styles.promptBoxBad}`}>
              <div className={`${styles.promptBoxLabel} ${styles.promptBoxBadLabel}`}>
                ❌ BAD — コンテキスト不足
              </div>
              <div className={styles.promptText}>このコードのバグを直して</div>
            </div>
            <div className={`${styles.promptBox} ${styles.promptBoxGood}`}>
              <div className={`${styles.promptBoxLabel} ${styles.promptBoxGoodLabel}`}>
                ✅ GOOD — コンテキスト付き
              </div>
              <div className={styles.promptText}>
                @workspace の src/api/users.ts、135行目でTypeErrorが発生しています。 「Cannot read
                properties of undefined (reading {"'id'"}）」というエラーです。
                ユーザーが存在しない場合の null チェックが漏れていると思います。
                修正案と、同様のパターンが他にないか確認してください
              </div>
            </div>
          </div>

          <div className={styles.divider} style={{ margin: "32px 0" }} />

          <h3
            className={styles.secSubTitle}
            style={{ marginBottom: "16px", letterSpacing: "0.05em", fontSize: "0.9rem" }}
          >
            {"// スラッシュコマンド チートシート"}
          </h3>

          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <code>/explain</code>
              </div>
              <div className={styles.cardDesc}>
                選択したコードの動作を詳細に説明します。チームへの共有や自分の理解確認に最適。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <code>/fix</code>
              </div>
              <div className={styles.cardDesc}>
                バグや問題を検出して修正案を提示。エラーメッセージと一緒に使うと精度が上がります。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <code>/tests</code>
              </div>
              <div className={styles.cardDesc}>
                Jest・Vitest等でユニットテストを自動生成。エッジケースも考慮したテストコードが得られます。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <code>/doc</code>
              </div>
              <div className={styles.cardDesc}>
                JSDoc・Docstring等のドキュメントコメントを生成。API仕様書の自動化に役立ちます。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <code>@workspace</code>
              </div>
              <div className={styles.cardDesc}>
                プロジェクト全体のファイルを参照して回答。「このプロジェクトで〇〇を実装するには？」という質問に対応。
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <code>@terminal</code>
              </div>
              <div className={styles.cardDesc}>
                ターミナルの出力内容やエラーを参照して助言。シェルコマンドの問題解決に便利です。
              </div>
            </div>
          </div>
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
          <div className={styles.stepsList}>
            <div className={styles.step}>
              <div className={styles.stepNum}>🤖</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  エージェントモード <span className={`${styles.tag} ${styles.tagNew}`}>NEW</span>
                </div>
                <div className={styles.stepBody}>
                  自律的に複数ファイルを横断して編集・テスト実行・バグ修正まで行う高度な自動化機能。
                  「ユーザー認証モジュールを実装して」と指示するだけで、ファイル作成からテストまで一括実行します。
                </div>
                <ul className={styles.stepSub}>
                  <li>複数ファイルの同時編集が可能</li>
                  <li>テスト実行結果を見てコードを自動修正</li>
                  <li>プレミアムリクエストを複数消費する点に注意</li>
                </ul>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNum}>📋</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  プランモード（Plan Mode）{" "}
                  <span className={`${styles.tag} ${styles.tagNew}`}>2026</span>
                </div>
                <div className={styles.stepBody}>
                  コードを書く前に実装計画を作成し、承認後に実装を進める機能。Chat UI で Plan
                  エージェントを選択するか、/plan コマンドで起動。
                  複雑な機能実装前に計画をレビューできるため、手戻りを大幅に削減できます。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span className={styles.codeLang}>COPILOT CHAT — Plan Mode</span>
                    <div className={styles.codeDots}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                  <div className={styles.codeBody}>
                    <span className={styles.cc}>
                      # Chat UI で Plan エージェントを選択、または /plan と入力
                    </span>
                    {"\n"}
                    <span className={styles.cs}>
                      OAuth2認証（Google・GitHubプロバイダー）を実装して
                    </span>
                    {"\n\n"}
                    <span className={styles.cc}>
                      # Copilotが以下のような計画を作成してくれます：
                    </span>
                    {"\n"}
                    <span className={styles.ce}>## 実装計画: OAuth2認証</span>
                    {"\n"}
                    <span className={styles.cs}>-</span>
                    {" [ ] NextAuth.jsのインストールと設定\n"}
                    <span className={styles.cs}>-</span>
                    {" [ ] Google OAuth設定ファイル作成\n"}
                    <span className={styles.cs}>-</span>
                    {" [ ] GitHubプロバイダー設定\n"}
                    <span className={styles.cs}>-</span>
                    {" [ ] コールバックルート実装\n"}
                    <span className={styles.cs}>-</span>
                    {" [ ] セッション管理の設定\n"}
                    <span className={styles.cc}>
                      # → 承認後に実装開始（Chat UI でプランを編集・承認可能）
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNum}>🔍</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  コードレビューエージェント{" "}
                  <span className={`${styles.tag} ${styles.tagNew}`}>2026</span>
                </div>
                <div className={styles.stepBody}>
                  Pull
                  Requestに対して自動でコードレビューを行うエージェント。セキュリティ問題・バグ・コードスタイルの問題を自動検出して指摘します。
                </div>
                <ul className={styles.stepSub}>
                  <li>GitHub PR上で直接レビューコメントを生成</li>
                  <li>GitHub Advanced Securityとの連携でセキュリティスキャン</li>
                  <li>コーディング規約違反の自動検出</li>
                </ul>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNum}>🔌</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  MCPサポート（Model Context Protocol）{" "}
                  <span className={`${styles.tag} ${styles.tagNew}`}>2026</span>
                </div>
                <div className={styles.stepBody}>
                  外部ツール（Asana、Jira、Figma等）とCopilotを直接連携できる新しいプロトコル。
                  Copilot CLIのGitHub MCP serverでは、Copilot Spacesのツールも含まれています。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span className={styles.codeLang}>.vscode/mcp.json — MCP設定例</span>
                    <div className={styles.codeDots}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                  <div className={styles.codeBody}>
                    {"{\n  "}
                    <span className={styles.cs}>"servers"</span>
                    {": {\n    "}
                    <span className={styles.cs}>"github"</span>
                    {": {\n      "}
                    <span className={styles.cs}>"type"</span>
                    {": "}
                    <span className={styles.cs}>"http"</span>
                    {",\n      "}
                    <span className={styles.cs}>"url"</span>
                    {": "}
                    <span className={styles.cs}>"https://api.githubcopilot.com/mcp/"</span>
                    {",\n      "}
                    <span className={styles.cs}>"headers"</span>
                    {": {\n        "}
                    <span className={styles.cs}>"X-MCP-Toolsets"</span>
                    {": "}
                    <span className={styles.cs}>"default,copilot_spaces"</span>
                    {"\n      }\n    }\n  }\n}"}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNum}>💾</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  Copilot Spaces（コンテキスト管理）{" "}
                  <span className={`${styles.tag} ${styles.tagNew}`}>2026</span>
                </div>
                <div className={styles.stepBody}>
                  プロジェクト固有のコンテキストを記憶・参照する機能。コードベースの知識を蓄積し、より的確な提案を生成します。
                </div>
                <ul className={styles.stepSub}>
                  <li>リポジトリを横断した知識ベースの構築</li>
                  <li>クロスエージェントメモリ：CLI・IDE・コードレビュー間で学習を共有</li>
                  <li>Enterpriseプランではカスタムファインチューニングモデルも利用可能</li>
                </ul>
              </div>
            </div>
          </div>
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
          <details className={styles.accordionItem} open>
            <summary className={styles.accordionSummary}>
              <span className={styles.accordionIcon}>📂</span>
              <span>
                <strong>01.</strong> 関連ファイルを開き、不要なファイルを閉じる
              </span>
              <span className={styles.accordionArrow}>▼</span>
            </summary>
            <div className={styles.accordionBody}>
              Copilotは現在エディタで開いているファイルをコンテキストとして利用します。
              <strong>実装対象のファイルと関連する型定義・テストファイルだけを開く</strong>
              ことで、より正確な補完が得られます。
              逆に無関係なファイルが大量に開いているとコンテキストが汚染されます。
              <div className={styles.alertInfo} style={{ marginTop: "12px" }}>
                <span className={styles.alertIcon}>💡</span>
                <div className={styles.alertContent}>
                  VS Codeの「エクスプローラー → タブ管理」で不要なファイルを整理しましょう
                </div>
              </div>
            </div>
          </details>

          <details className={styles.accordionItem}>
            <summary className={styles.accordionSummary}>
              <span className={styles.accordionIcon}>📝</span>
              <span>
                <strong>02.</strong> 具体的なコメントでコンテキストを提供する
              </span>
              <span className={styles.accordionArrow}>▼</span>
            </summary>
            <div className={styles.accordionBody}>
              コードを書く前に、意図を説明するコメントを先に書くと、Copilotの補完精度が劇的に向上します。
              「何をするか」だけでなく「なぜそうするか」「どんな制約があるか」も書くとさらに効果的です。
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span className={styles.codeLang}>EXAMPLE</span>
                  <div className={styles.codeDots}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className={styles.codeBody}>
                  <span className={styles.cc}>
                    {
                      "/**\n * レート制限付きAPIクライアント\n * - 1分間に最大100リクエスト\n * - 指数バックオフで自動リトライ（最大3回）\n * - タイムアウトは10秒\n * - エラー時はカスタムAPIErrorをthrow\n */"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.ce}>class</span>{" "}
                  <span className={styles.cv}>RateLimitedApiClient</span>
                  {" {"}
                </div>
              </div>
            </div>
          </details>

          <details className={styles.accordionItem}>
            <summary className={styles.accordionSummary}>
              <span className={styles.accordionIcon}>🧩</span>
              <span>
                <strong>03.</strong> タスクを小さな単位に分解する
              </span>
              <span className={styles.accordionArrow}>▼</span>
            </summary>
            <div className={styles.accordionBody}>
              「ECサイト全体を作って」ではなく「商品一覧APIを作って」→「カート機能を追加して」→「決済フローを実装して」と
              <strong>小さなステップに分解</strong>
              することでCopilotの精度が大幅に向上します。
              複雑なタスクほどプランモードを活用して計画を立てましょう。
            </div>
          </details>

          <details className={styles.accordionItem}>
            <summary className={styles.accordionSummary}>
              <span className={styles.accordionIcon}>✅</span>
              <span>
                <strong>04.</strong> 提案コードを必ず理解してから採用する
              </span>
              <span className={styles.accordionArrow}>▼</span>
            </summary>
            <div className={styles.accordionBody}>
              Copilotは強力なツールですが<strong>間違いを犯すことがあります</strong>。
              提案されたコードを「なぜこのロジックになっているか」を自分で理解してから採用することが必須です。
              特に、セキュリティに関わる部分（認証・暗号化・SQL）は細心の注意を払いましょう。
              <div className={styles.alertWarn} style={{ marginTop: "12px" }}>
                <span className={styles.alertIcon}>⚠️</span>
                <div className={styles.alertContent}>
                  Copilotは「コパイロット（副操縦士）」です。「オートパイロット（自動操縦）」ではありません。最終判断は常にあなたが行います。
                </div>
              </div>
            </div>
          </details>

          <details className={styles.accordionItem}>
            <summary className={styles.accordionSummary}>
              <span className={styles.accordionIcon}>🎯</span>
              <span>
                <strong>05.</strong> ペルソナを設定してChat品質を上げる
              </span>
              <span className={styles.accordionArrow}>▼</span>
            </summary>
            <div className={styles.accordionBody}>
              Chatに「あなたはコード品質と可読性を重視するシニアTypeScriptエンジニアです」などのペルソナを設定すると、
              より専門的な視点からのレビューや提案が得られます。
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span className={styles.codeLang}>CHAT PROMPT</span>
                  <div className={styles.codeDots}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className={styles.codeBody}>
                  <span className={styles.cs}>
                    {
                      "あなたはGolangのパフォーマンス最適化を専門とする\nシニアバックエンドエンジニアです。\n以下のコードのボトルネックを分析して改善案を提示してください..."
                    }
                  </span>
                </div>
              </div>
            </div>
          </details>

          <details className={styles.accordionItem}>
            <summary className={styles.accordionSummary}>
              <span className={styles.accordionIcon}>🔄</span>
              <span>
                <strong>06.</strong> TDD（テスト駆動開発）と組み合わせる
              </span>
              <span className={styles.accordionArrow}>▼</span>
            </summary>
            <div className={styles.accordionBody}>
              テストを先に書き、Copilotにテストを通す実装を生成させるTDDワークフローは非常に効果的です。
              テストがあることでCopilotが生成したコードの品質を自動検証できます。
              <code>/tests</code>コマンドでテストを先生成し、その後実装を書くアプローチも有効です。
            </div>
          </details>

          <details className={styles.accordionItem}>
            <summary className={styles.accordionSummary}>
              <span className={styles.accordionIcon}>📚</span>
              <span>
                <strong>07.</strong> copilot-instructions.mdを活用する
              </span>
              <span className={styles.accordionArrow}>▼</span>
            </summary>
            <div className={styles.accordionBody}>
              プロジェクト固有のルール（コーディング規約・ライブラリ選定・命名規則）を
              <code>.github/copilot-instructions.md</code>に記述することで、
              チーム全員が一貫した品質のコードをCopilotから得られます。 指示は
              <strong>簡潔・具体的</strong>に書くことが重要です。長すぎると効果が薄れます。
            </div>
          </details>

          <details className={styles.accordionItem}>
            <summary className={styles.accordionSummary}>
              <span className={styles.accordionIcon}>🌐</span>
              <span>
                <strong>08.</strong> コンテキストウィンドウを意識する
              </span>
              <span className={styles.accordionArrow}>▼</span>
            </summary>
            <div className={styles.accordionBody}>
              Copilot CLIではトークン上限の95%に近づくと自動圧縮（Auto-compaction）が発動します。
              長いセッションでは重要な文脈が失われることがあります。 複雑なタスクでは
              <strong>定期的に新しいチャットセッションを始める</strong>か、 重要なコンテキストを
              <code>copilot-instructions.md</code>に記録しておきましょう。
            </div>
          </details>

          <details className={styles.accordionItem}>
            <summary className={styles.accordionSummary}>
              <span className={styles.accordionIcon}>🚀</span>
              <span>
                <strong>09.</strong> WRAPフレームワークで効果的なIssueを書く
              </span>
              <span className={styles.accordionArrow}>▼</span>
            </summary>
            <div className={styles.accordionBody}>
              GitHub Copilotエージェントが最も効果を発揮するのは、明確に記述されたIssueです。
              GitHub公式が推奨する<strong>WRAPフレームワーク</strong>を活用しましょう：
              <div
                className={styles.cardGrid}
                style={{ marginTop: "14px", gridTemplateColumns: "repeat(2, 1fr)" }}
              >
                <div className={styles.card} style={{ padding: "16px" }}>
                  <div className={styles.cardTitle} style={{ color: "var(--accent)" }}>
                    W — What (何を)
                  </div>
                  <div className={styles.cardDesc}>達成したいことを具体的に書く</div>
                </div>
                <div className={styles.card} style={{ padding: "16px" }}>
                  <div className={styles.cardTitle} style={{ color: "var(--accent)" }}>
                    R — Reason (なぜ)
                  </div>
                  <div className={styles.cardDesc}>背景・理由・ユーザーへの影響を書く</div>
                </div>
                <div className={styles.card} style={{ padding: "16px" }}>
                  <div className={styles.cardTitle} style={{ color: "var(--accent)" }}>
                    A — Acceptance (完了条件)
                  </div>
                  <div className={styles.cardDesc}>どうなれば完了か明確にする</div>
                </div>
                <div className={styles.card} style={{ padding: "16px" }}>
                  <div className={styles.cardTitle} style={{ color: "var(--accent)" }}>
                    P — Prior Context (前提)
                  </div>
                  <div className={styles.cardDesc}>関連コード・制約・参考情報を添付</div>
                </div>
              </div>
            </div>
          </details>

          <details className={styles.accordionItem}>
            <summary className={styles.accordionSummary}>
              <span className={styles.accordionIcon}>📊</span>
              <span>
                <strong>10.</strong> プレミアムリクエストの使用量を監視する
              </span>
              <span className={styles.accordionArrow}>▼</span>
            </summary>
            <div className={styles.accordionBody}>
              Chat・エージェントモード・コードレビューはプレミアムリクエストを消費します。
              上限を超えると<strong>$0.04/リクエスト</strong>の追加費用が発生します。
              月ごとのリセットタイミング（1日UTC深夜）を把握し、 Settings → Copilot → Usage
              で使用量を定期確認しましょう。
              <div className={styles.alertInfo} style={{ marginTop: "12px" }}>
                <span className={styles.alertIcon}>💡</span>
                <div className={styles.alertContent}>
                  通常のコード補完（インライン補完）はプレミアムリクエストを消費しません（Freeプランを除く）
                </div>
              </div>
            </div>
          </details>
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
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🔐</span>
              <div className={styles.cardTitle}>脆弱なコードパターンを認識する</div>
              <div className={styles.cardDesc}>
                Copilotはハードコードされた認証情報、SQLインジェクション、パストラバーサルなど一般的な脆弱性をフィルタリングしますが、
                <strong>すべての脆弱性を防げるわけではありません</strong>。
                セキュリティ関連のコードは必ず手動レビューしてください。
              </div>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>📜</span>
              <div className={styles.cardTitle}>著作権・ライセンス確認</div>
              <div className={styles.cardDesc}>
                Copilotはパブリックリポジトリのコードで学習しています。生成されたコードが既存のOSSコードに類似する可能性があります。
                Business/EnterpriseプランのIP補償を活用しつつ、重要なコードは確認しましょう。
              </div>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🏢</span>
              <div className={styles.cardTitle}>機密情報をChatに貼らない</div>
              <div className={styles.cardDesc}>
                APIキー・パスワード・個人情報などの機密データをCopilot
                Chatに直接貼り付けることは避けてください。
                Enterpriseプランではデータ保護協定（DPA）により適切に管理されますが、基本的な慎重さが重要です。
              </div>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🧪</span>
              <div className={styles.cardTitle}>必ずテストを実行する</div>
              <div className={styles.cardDesc}>
                Copilotが生成したコードは、既存のテスト・コードスキャン・セキュリティテストなど
                <strong>通常の品質管理プロセスをすべて通過させてください</strong>。
                AI生成だからといって例外にしないこと。
              </div>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>⚙️</span>
              <div className={styles.cardTitle}>除外ファイルを設定する</div>
              <div className={styles.cardDesc}>
                機密性の高いファイル（<code>.env</code>
                ・設定ファイル・秘密鍵）はCopilotが参照しないよう
                <code>.copilotignore</code>
                またはOrganization設定で除外できます（Business/Enterpriseプラン）。
              </div>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🔄</span>
              <div className={styles.cardTitle}>古いAPIパターンに注意</div>
              <div className={styles.cardDesc}>
                Copilotの学習データには古いAPIやライブラリバージョンが含まれています。
                生成されたコードが使用している外部ライブラリの最新バージョンと互換性があるか必ず確認しましょう。
              </div>
            </div>
          </div>
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
          <div className={styles.alertInfo} style={{ marginBottom: "24px" }}>
            <span className={styles.alertIcon}>ℹ️</span>
            <div className={styles.alertContent}>
              <strong>プレミアムリクエストと通常リクエストの違い：</strong>
              <br />
              高度なモデル（GPT-5.3-Codex, Claude
              Opus等）を使用するChat/エージェントモードは「プレミアムリクエスト」を消費します。
              インラインコード補完は通常消費しません。モデルによって1リクエストあたりの消費量が異なります。
            </div>
          </div>

          <table className={styles.modelTable}>
            <caption className={styles.srOnly}>モデル比較</caption>
            <thead>
              <tr>
                <th>モデル</th>
                <th>特性</th>
                <th>最適な用途</th>
                <th>利用可能プラン</th>
                <th>速度</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className={styles.modelName}>GPT-5.3-Codex</span>
                  <br />
                  <span className={`${styles.tag} ${styles.tagNew}`}>LTS標準</span>
                </td>
                <td>長期サポート（〜2027/2）。コーディング全般に優秀</td>
                <td>日常的なコーディング補助・説明</td>
                <td>
                  <span className={`${styles.tag} ${styles.tagFree}`}>Free〜</span>
                </td>
                <td>
                  <div className={styles.progressBarWrap}>
                    <div className={styles.progressBarInner} style={{ width: "85%" }} />
                  </div>
                  速い
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.modelName}>GPT-4o mini</span>
                  <br />
                  <span className={`${styles.tag} ${styles.tagFree}`}>軽量</span>
                </td>
                <td>軽量・高速。プレミアムリクエスト消費が少ない</td>
                <td>シンプルな質問・繰り返し作業</td>
                <td>
                  <span className={`${styles.tag} ${styles.tagFree}`}>Free〜</span>
                </td>
                <td>
                  <div className={styles.progressBarWrap}>
                    <div className={styles.progressBarInner} style={{ width: "100%" }} />
                  </div>
                  最速
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.modelName}>Claude Haiku 4.5</span>
                  <br />
                  <span className={`${styles.tag} ${styles.tagFree}`}>軽量</span>
                </td>
                <td>軽量・高速。Anthropic製の効率的モデル</td>
                <td>シンプルな質問・繰り返し作業</td>
                <td>
                  <span className={`${styles.tag} ${styles.tagFree}`}>Free〜</span>
                </td>
                <td>
                  <div className={styles.progressBarWrap}>
                    <div className={styles.progressBarInner} style={{ width: "95%" }} />
                  </div>
                  最速
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.modelName}>Claude Sonnet 4.6</span>
                  <br />
                  <span className={`${styles.tag} ${styles.tagPro}`}>中〜上級</span>
                </td>
                <td>コード品質・説明能力が高い。Anthropic製</td>
                <td>コードレビュー・アーキテクチャ設計</td>
                <td>
                  <span className={`${styles.tag} ${styles.tagPro}`}>Pro〜</span>
                </td>
                <td>
                  <div className={styles.progressBarWrap}>
                    <div className={styles.progressBarInner} style={{ width: "75%" }} />
                  </div>
                  普通
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.modelName}>Claude Opus 4.6</span>
                  <br />
                  <span className={`${styles.tag} ${styles.tagBeta}`}>最上級</span>
                </td>
                <td>最高品質の推論・複雑なロジック分析</td>
                <td>難解なバグ解析・複雑な設計判断</td>
                <td>
                  <span className={`${styles.tag} ${styles.tagBeta}`}>Pro+のみ</span>
                </td>
                <td>
                  <div className={styles.progressBarWrap}>
                    <div className={styles.progressBarInner} style={{ width: "40%" }} />
                  </div>
                  遅め
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.modelName}>Gemini 2.5 Pro</span>
                  <br />
                  <span className={`${styles.tag} ${styles.tagNew}`}>GA</span>
                </td>
                <td>最新Gemini。強力な推論・コーディング能力。Google製</td>
                <td>複雑なタスク・数学・科学的処理</td>
                <td>
                  <span className={`${styles.tag} ${styles.tagPro}`}>Pro〜</span>
                </td>
                <td>
                  <div className={styles.progressBarWrap}>
                    <div className={styles.progressBarInner} style={{ width: "60%" }} />
                  </div>
                  普通
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.modelName}>Gemini 3 Pro</span>
                  <br />
                  <span className={`${styles.tag} ${styles.tagBeta}`}>Preview</span>
                </td>
                <td>次世代Gemini（プレビュー版）。Google製</td>
                <td>最先端の推論・コーディング</td>
                <td>
                  <span className={`${styles.tag} ${styles.tagBeta}`}>Pro+〜</span>
                </td>
                <td>
                  <div className={styles.progressBarWrap}>
                    <div className={styles.progressBarInner} style={{ width: "55%" }} />
                  </div>
                  普通〜遅
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.modelName}>Grok Code Fast 1</span>
                  <br />
                  <span className={`${styles.tag} ${styles.tagNew}`}>高速</span>
                </td>
                <td>xAI製。高速コーディング特化。データ保持なし</td>
                <td>迅速なコード生成・反復開発</td>
                <td>
                  <span className={`${styles.tag} ${styles.tagFree}`}>Free〜</span>
                </td>
                <td>
                  <div className={styles.progressBarWrap}>
                    <div className={styles.progressBarInner} style={{ width: "90%" }} />
                  </div>
                  高速
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.modelName}>Raptor mini</span>
                  <br />
                  <span className={`${styles.tag} ${styles.tagBeta}`}>Preview</span>
                </td>
                <td>超軽量プレビューモデル。制限なし使用可</td>
                <td>実験的用途・頻繁な問い合わせ</td>
                <td>
                  <span className={`${styles.tag} ${styles.tagFree}`}>Free〜</span>
                </td>
                <td>
                  <div className={styles.progressBarWrap}>
                    <div className={styles.progressBarInner} style={{ width: "100%" }} />
                  </div>
                  最速
                </td>
              </tr>
            </tbody>
          </table>

          <div className={styles.alertInfo} style={{ marginTop: "16px", fontSize: "0.875rem" }}>
            <span className={styles.alertIcon}>📅</span>
            <div className={styles.alertContent}>
              <strong>最終更新:</strong> 2026年3月
              <br />
              <strong>参考:</strong>{" "}
              <Ext href="https://docs.github.com/en/copilot/reference/ai-models/supported-models">
                Supported AI models - GitHub Docs
              </Ext>
              ,{" "}
              <Ext href="https://github.blog/changelog/2026-03-18-gpt-5-3-codex-long-term-support-in-github-copilot/">
                GPT-5.3-Codex LTS - GitHub Changelog
              </Ext>
            </div>
          </div>

          <div className={styles.alertSuccess} style={{ marginTop: "20px" }}>
            <span className={styles.alertIcon}>💡</span>
            <div className={styles.alertContent}>
              <strong>モデル選択の基本戦略：</strong>
              日常のコーディングはGPT-5.3-Codex、複雑なアーキテクチャ設計はClaude Sonnet 4.6、
              難解なバグや高度な推論が必要な場合のみClaude Opus
              4.6を使用することで、プレミアムリクエストを効率的に使えます。
            </div>
          </div>
        </section>

        {/* ─── s09: checklist ─── */}
        <section id="s09" className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={styles.secNum}>09</span>
            <div>
              <h2 className={styles.secTitle}>導入チェックリスト</h2>
              <p className={styles.secDesc}>
                Copilotを最大限活用するための確認項目。クリックでチェックできます
              </p>
            </div>
          </div>

          <h3 className={styles.checklistHeading}>{"// 初期セットアップ"}</h3>
          <div className={styles.checklistGroup} id="checklist-setup">
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>GitHubアカウントを作成し、Copilotプランを有効化した</span>
            </label>
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>VS Code（またはJetBrains等）にGitHub Copilot拡張機能をインストールした</span>
            </label>
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>Copilot Chat拡張機能もインストールし、動作確認した</span>
            </label>
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>プロジェクトに .github/copilot-instructions.md を作成した</span>
            </label>
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>学生・教師の場合、GitHub Educationの無料プランを申請した</span>
            </label>
          </div>

          <h3 className={styles.checklistHeading} style={{ margin: "24px 0 12px" }}>
            {"// 日常的な活用習慣"}
          </h3>
          <div className={styles.checklistGroup}>
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>コードを書く前に意図を説明するコメントを先に書く習慣を身につけた</span>
            </label>
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>Copilotの提案を採用する前に必ず理解・レビューしている</span>
            </label>
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>/explain, /fix, /tests などのスラッシュコマンドを使いこなしている</span>
            </label>
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>
                複雑な実装ではプランモード（/plan または Plan
                エージェント選択）を使って計画を立てている
              </span>
            </label>
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>月のプレミアムリクエスト使用量を定期的に確認している</span>
            </label>
          </div>

          <h3 className={styles.checklistHeading} style={{ margin: "24px 0 12px" }}>
            {"// セキュリティ・品質"}
          </h3>
          <div className={styles.checklistGroup}>
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>APIキー・パスワード等の機密情報をChatに貼り付けていない</span>
            </label>
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>生成されたコードに対して既存のテスト・Lintを必ず実行している</span>
            </label>
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>セキュリティ関連コード（認証・暗号化・DB操作）は手動レビューしている</span>
            </label>
            <label className={styles.checkItem}>
              <input type="checkbox" />
              <span>必要に応じて .copilotignore で機密ファイルを除外設定した</span>
            </label>
          </div>
        </section>

        {/* ─── sources ─── */}
        <section id="sources" className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={styles.secNum}>10</span>
            <div>
              <h2 className={styles.secTitle}>参考ソース一覧</h2>
              <p className={styles.secDesc}>
                本ガイドの根拠となる公式ドキュメントおよび最新情報ソース（2026年3月時点）
              </p>
            </div>
          </div>
          {SOURCE_GROUPS.map((group, gi) => (
            <div key={group.heading}>
              <h3
                className={styles.checklistHeading}
                style={gi > 0 ? { margin: "24px 0 14px" } : { marginBottom: "14px" }}
              >
                {group.heading}
              </h3>
              <div className={styles.sourceList}>
                {group.items.map((s) => (
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
            </div>
          ))}
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
