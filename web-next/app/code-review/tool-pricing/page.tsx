import type { Metadata } from "next";
import pricingJson from "@/data/pricing.json";
import { fmtJPY, fmtUSD } from "@/lib/cost";
import { parsePricingData } from "@/lib/pricing";
import {
  CATEGORY_ORDER,
  PRICE_CHECKED_AT,
  planAmounts,
  representativePrice,
  TOOLS,
  type ToolCategory,
} from "./constants";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "AI Code Review ツール料金比較 — Tool Pricing",
  description:
    "GitHub Copilot・Codex・Claude・CodeRabbit・SonarQube など Code Review 系 AI ツール 9 種の料金目安・主用途・メリット/デメリットを、価格の出典付きで横断比較。",
};

const pricing = parsePricingData(pricingJson);

/**
 * Render an anchor element that always opens in a new tab with safe `rel` attributes.
 *
 * Forces `target="_blank"` and `rel="noopener noreferrer"`, while forwarding all other anchor props (including `data-*` attributes) to the rendered `<a>`.
 */
function Ext({ href, className, children, ...rest }: React.ComponentProps<"a">) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

/** カテゴリ → アクセント色クラス（--cat 変数を供給）。 */
const CAT_CLASS: Record<ToolCategory, string> = {
  AIレビュー: styles.catReview,
  AIエージェント: styles.catAgent,
  静的解析: styles.catStatic,
};

/** カテゴリ → セクションアンカー slug。 */
const CAT_SLUG: Record<ToolCategory, string> = {
  AIレビュー: "ai-review",
  AIエージェント: "ai-agent",
  静的解析: "static-analysis",
};

/** TOOLS 配列内の通し番号（01 始まり）。マトリクス・カードで共有。 */
const toolNo = (name: string) =>
  String(TOOLS.findIndex((t) => t.name === name) + 1).padStart(2, "0");

/**
 * Render the AI Code Review Tools pricing comparison page.
 *
 * Renders a hero with stats and page navigation, a comparison matrix of all tools, category-specific tool cards showing summaries, pros/cons, source links, and plan-by-plan pricing displayed in USD with approximate JPY conversions, plus an about/disclaimer section.
 *
 * @returns The React element for the tool pricing page.
 */
export default function ToolPricingPage() {
  const jpyRate = pricing.jpy_rate;
  const generatedAt = pricing.generated_at;

  return (
    <div className={styles.page}>
      {/* 装飾レイヤー */}
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <main className={styles.shell}>
        {/* ─── Hero ─── */}
        <header className={styles.hero}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            PRICING DOSSIER · 最終確認 {PRICE_CHECKED_AT}
          </p>
          <h1 className={styles.title}>AI Code Review Tools 料金比較</h1>
          <p className={styles.lede}>
            PR レビューから静的解析まで、コードレビューを担う AI ツール 9 種を横断比較。
            価格は変動するため、各ツールに<strong>公式の価格出典リンク</strong>を併記しています。
          </p>
          <p className={styles.rateNote}>
            ※ 円は USD からの概算。更新時レート 1 USD = ¥{jpyRate.toLocaleString("ja-JP")}（
            {generatedAt} 時点）
          </p>

          <dl className={styles.stats}>
            <div className={styles.stat}>
              <dt>ツール</dt>
              <dd>{TOOLS.length}</dd>
            </div>
            <div className={styles.stat}>
              <dt>カテゴリ</dt>
              <dd>{CATEGORY_ORDER.length}</dd>
            </div>
            <div className={styles.stat}>
              <dt>最終確認</dt>
              <dd className={styles.statSm}>{PRICE_CHECKED_AT}</dd>
            </div>
          </dl>

          <nav className={styles.anchors} aria-label="ページ内ナビゲーション">
            <a href="#matrix">比較マトリクス</a>
            {CATEGORY_ORDER.map((cat) => (
              <a key={cat} href={`#${CAT_SLUG[cat]}`} className={CAT_CLASS[cat]}>
                {cat}
              </a>
            ))}
            <a href="#about">価格について</a>
          </nav>
        </header>

        {/* ─── 比較マトリクス ─── */}
        <section id="matrix" className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>
              <span className={styles.h2No}>00</span>比較マトリクス
            </h2>
            <p className={styles.sectionNote}>全 {TOOLS.length} ツールを一覧</p>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.matrix}>
              <thead>
                <tr>
                  <th scope="col">ツール</th>
                  <th scope="col">カテゴリ</th>
                  <th scope="col">主用途</th>
                  <th scope="col">価格目安（from）</th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map((tool) => (
                  <tr key={tool.name} className={CAT_CLASS[tool.category]}>
                    <th scope="row" className={styles.matrixName}>
                      <span className={styles.matrixNo}>{toolNo(tool.name)}</span>
                      {tool.name}
                    </th>
                    <td>
                      <span className={styles.catTag}>
                        <span className={styles.catDot} aria-hidden="true" />
                        {tool.category}
                      </span>
                    </td>
                    <td className={styles.matrixUse}>{tool.use}</td>
                    <td>
                      <span className={styles.priceChip}>{representativePrice(tool.plans)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── カテゴリ別 詳細カード ─── */}
        {CATEGORY_ORDER.map((cat, ci) => {
          const tools = TOOLS.filter((t) => t.category === cat);
          return (
            <section key={cat} id={CAT_SLUG[cat]} className={`${styles.section} ${CAT_CLASS[cat]}`}>
              <div className={styles.sectionHead}>
                <h2 className={styles.h2}>
                  <span className={styles.h2No}>{String(ci + 1).padStart(2, "0")}</span>
                  {cat}
                </h2>
                <p className={styles.sectionNote}>{tools.length} ツール</p>
              </div>

              <div className={styles.cardGrid}>
                {tools.map((tool) => (
                  <article key={tool.name} data-tool-card className={styles.card}>
                    <span className={styles.cardGhostNo} aria-hidden="true">
                      {toolNo(tool.name)}
                    </span>

                    {/* 左: ツール情報 */}
                    <div className={styles.cardInfo}>
                      <header className={styles.cardHead}>
                        <span className={styles.catTag}>
                          <span className={styles.catDot} aria-hidden="true" />
                          {tool.category}
                        </span>
                        <h3 className={styles.cardName}>
                          <Ext href={tool.href} className={styles.cardNameLink}>
                            {tool.name}
                          </Ext>
                        </h3>
                        <p className={styles.cardUse}>主用途: {tool.use}</p>
                      </header>

                      <p className={styles.cardSummary}>{tool.summary}</p>

                      <div className={styles.prosCons}>
                        <div className={`${styles.pcPanel} ${styles.pros}`}>
                          <span className={styles.pcLabel}>メリット</span>
                          <p>{tool.pros}</p>
                        </div>
                        <div className={`${styles.pcPanel} ${styles.cons}`}>
                          <span className={styles.pcLabel}>デメリット</span>
                          <p>{tool.cons}</p>
                        </div>
                      </div>

                      <footer className={styles.cardFoot}>
                        <Ext href={tool.sourceUrl} className={styles.sourceLink} data-source-link>
                          <span className={styles.sourceLabel}>出典</span>
                          {tool.sourceLabel}
                          <span className={styles.sourceArrow} aria-hidden="true">
                            ↗
                          </span>
                        </Ext>
                        <span className={styles.checkedAt}>確認 {tool.priceCheckedAt}</span>
                      </footer>
                    </div>

                    {/* 右: プラン別料金表 */}
                    <div className={styles.planWrap}>
                      <table className={styles.planTable}>
                        <thead>
                          <tr data-plan-header>
                            <th scope="col">プラン</th>
                            <th scope="col">1ヶ月</th>
                            <th scope="col">3ヶ月</th>
                            <th scope="col">12ヶ月</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tool.plans.map((plan) => {
                            const { m1, discounted } = planAmounts(plan);
                            return (
                              <tr key={plan.name} data-plan-row>
                                <td className={styles.planName}>
                                  {plan.name}
                                  {plan.unitNote && (
                                    <small className={styles.unitNote}>{plan.unitNote}</small>
                                  )}
                                </td>
                                {m1 === null ? (
                                  <td colSpan={3} className={styles.planNote}>
                                    {plan.priceNote}
                                  </td>
                                ) : (
                                  <>
                                    <td className={styles.amtCell}>
                                      <span className={styles.amtUsd}>{fmtUSD(m1)}</span>
                                      <span className={styles.amtJpy}>{fmtJPY(m1, jpyRate)}</span>
                                    </td>
                                    <td className={styles.amtCell}>
                                      <span className={styles.amtUsd}>{fmtUSD(m1 * 3)}</span>
                                      <span className={styles.amtJpy}>
                                        {fmtJPY(m1 * 3, jpyRate)}
                                      </span>
                                    </td>
                                    <td className={styles.amtCell}>
                                      <span className={styles.amtUsd}>
                                        {fmtUSD((plan.annualMonthlyUsd ?? m1) * 12)}
                                      </span>
                                      {discounted && (
                                        <span className={styles.discountBadge}>年額割引</span>
                                      )}
                                      <span className={styles.amtJpy}>
                                        {fmtJPY((plan.annualMonthlyUsd ?? m1) * 12, jpyRate)}
                                      </span>
                                    </td>
                                  </>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        {/* ─── 価格について / 免責 ─── */}
        <section id="about" className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>
              <span className={styles.h2No}>04</span>価格について
            </h2>
          </div>
          <div className={styles.disclaimer}>
            <p>
              掲載の価格は <strong>{PRICE_CHECKED_AT} 時点</strong>
              の目安です。プラン体系・通貨・従量課金の単価は頻繁に変わるため、契約前に必ず各ツールの公式ページ（各カードの
              <strong>「出典」リンク</strong>）で最新の料金を確認してください。
            </p>
            <p className={styles.disclaimerSub}>
              本ページは月次で価格を見直します。出典は各社公式の pricing ページを参照しています。
            </p>
            <p className={styles.disclaimerSub}>
              ※ 円は USD からの概算換算です。更新時レート 1 USD = ¥{jpyRate.toLocaleString("ja-JP")}
              （{generatedAt}{" "}
              時点）。為替レートは日々変動するため、実際の金額は異なる場合があります。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
