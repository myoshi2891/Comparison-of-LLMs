/**
 * JA/EN 翻訳定義 (React 要素ファクトリ対応版)。
 *
 * XSS 対策方針:
 * - 翻訳は React ノードを直接返すファクトリ関数で合成する。
 * - 生の HTML 文字列を DOM に流し込む unsafe 注入 API は一切使わない
 *   (本ファイルのソースに登場しないことを i18n.rich.test.tsx で
 *    静的検査している)。
 *
 * API:
 * - t(key, lang): プレーン文字列版。HTML タグを剥がしたテキストを返す。
 *   aria-label / meta タグ / alt 属性向け。
 * - tRich(key, lang): React ノード版。<em> / <strong> 等を JSX で合成。
 *   レンダリング先に使う。プレーンキーは文字列そのまま返す。
 *
 * プレースホルダ ({n}/{m}/{date}) の補完は呼び出し側責務 (契約)。
 */

import type { ReactNode } from "react";

export type Lang = "ja" | "en";

type PlainEntry = {
  readonly ja: string;
  readonly en: string;
};

type RichEntry = {
  readonly text: { readonly ja: string; readonly en: string };
  readonly render: (lang: Lang) => ReactNode;
};

type Entry = PlainEntry | RichEntry;

/**
 * Determines whether a translation entry provides a JSX render factory.
 *
 * @param entry - The translation entry to inspect
 * @returns `true` if `entry` is a `RichEntry` (has a `render` function), `false` otherwise
 */
function isRichEntry(entry: Entry): entry is RichEntry {
  return "render" in entry;
}

// ---------- Rich entry factories ----------
// 各ファクトリは text (プレーン) と render (ReactNode) を同時提供する。
// text は現行 HTML 文字列からタグだけ剥いた内容と等価にする。

const heroTitle: RichEntry = {
  text: {
    ja: "AIモデル 時間別コスト 計算機",
    en: "AI Model Hourly Cost Calculator",
  },
  render: (lang) =>
    lang === "ja" ? (
      <>
        AIモデル <em>時間別コスト</em> 計算機
      </>
    ) : (
      <>
        AI Model <em>Hourly Cost</em> Calculator
      </>
    ),
};

const heroDesc: RichEntry = {
  text: {
    ja: "使用トークン量を設定し、1時間・8時間・24時間・7日・30日・4ヶ月・12ヶ月の累積コストをリアルタイムに算出。各セルに USD ($) と 日本円 (¥) を同時表示。",
    en: "Set your token usage and instantly calculate cumulative costs for 1h · 8h · 24h · 7d · 30d · 4mo · 12mo. Each cell shows both USD ($) and JPY (¥).",
  },
  render: (lang) =>
    lang === "ja" ? (
      <>
        使用トークン量を設定し、
        <strong>1時間・8時間・24時間・7日・30日・4ヶ月・12ヶ月</strong>
        の累積コストをリアルタイムに算出。各セルに <strong>USD ($)</strong> と{" "}
        <strong>日本円 (¥)</strong> を同時表示。
      </>
    ) : (
      <>
        Set your token usage and instantly calculate cumulative costs for{" "}
        <strong>1h · 8h · 24h · 7d · 30d · 4mo · 12mo</strong>. Each cell shows both{" "}
        <strong>USD ($)</strong> and <strong>JPY (¥)</strong>.
      </>
    ),
};

const apiNote: RichEntry = {
  text: {
    ja: "📌 計算前提: 上記コストは24時間365日連続使用した場合の累積API費用です。各セルの上段は USD ($)、下段は 日本円 (¥)。キャッシュ割引・Batch API割引は未適用。ヘッダークリックでソート可能。",
    en: "📌 Assumptions: Costs assume 24/7 continuous usage. Upper = USD ($), Lower = JPY (¥). Cache/Batch discounts not applied. Click headers to sort.",
  },
  render: (lang) =>
    lang === "ja" ? (
      <>
        <strong>📌 計算前提:</strong> 上記コストは
        <strong>24時間365日連続使用</strong>
        した場合の累積API費用です。各セルの上段は <strong>USD ($)</strong>、下段は{" "}
        <strong>日本円 (¥)</strong>。キャッシュ割引・Batch API割引は未適用。
        ヘッダークリックでソート可能。
      </>
    ) : (
      <>
        <strong>📌 Assumptions:</strong> Costs assume <strong>24/7 continuous usage</strong>. Upper
        = <strong>USD ($)</strong>, Lower = <strong>JPY (¥)</strong>. Cache/Batch discounts not
        applied. Click headers to sort.
      </>
    ),
};

const subNote: RichEntry = {
  text: {
    ja: "ℹ️ サブスクリプションの計算: 月額固定費を時間按分。1h = 月額÷720、30d = 月額1ヶ月分、12mo = 年額優先。各セル上段 USD、下段 JPY。",
    en: "ℹ️ Subscription Calculation: Fixed monthly cost prorated. 1h = monthly÷720, 30d = 1 month, 12mo = annual price (preferred). Upper: USD, Lower: JPY.",
  },
  render: (lang) =>
    lang === "ja" ? (
      <>
        <strong>ℹ️ サブスクリプションの計算:</strong> 月額固定費を時間按分。1h = 月額÷720、30d =
        月額1ヶ月分、12mo = 年額優先。各セル上段 <strong>USD</strong>、下段 <strong>JPY</strong>。
      </>
    ) : (
      <>
        <strong>ℹ️ Subscription Calculation:</strong> Fixed monthly cost prorated. 1h = monthly÷720,
        30d = 1 month, 12mo = annual price (preferred). Upper: <strong>USD</strong>, Lower:{" "}
        <strong>JPY</strong>.
      </>
    ),
};

const refNote: RichEntry = {
  text: {
    ja: "📚 価格・為替の正確性について: 本ツールの価格は定期スクリプトで自動更新されます。Vertex AIはGCPコミット割引が適用されると実質単価が下がります。JetBrainsのAll Products PackにはAI Proが内包されるため、複数IDE利用者は追加コストが実質ゼロになる場合があります。本番環境の予算策定は必ず各公式リンクで最新情報を確認してください。",
    en: "📚 About Accuracy: Pricing is updated automatically by a scheduled script. Vertex AI committed use discounts can significantly lower unit costs. JetBrains All Products Pack includes AI Pro, so multi-IDE users may effectively pay nothing extra. Always verify current pricing via official links before production budgeting.",
  },
  render: (lang) =>
    lang === "ja" ? (
      <>
        <strong style={{ color: "#a5b4fc" }}>📚 価格・為替の正確性について:</strong>{" "}
        本ツールの価格は定期スクリプトで自動更新されます。
        <strong style={{ color: "#7dd3fc" }}>Vertex AI</strong>
        はGCPコミット割引が適用されると実質単価が下がります。
        <strong style={{ color: "#f472b6" }}>JetBrains</strong>
        のAll Products PackにはAI Proが内包されるため、
        複数IDE利用者は追加コストが実質ゼロになる場合があります。
        <strong>本番環境の予算策定は必ず各公式リンクで最新情報を確認してください。</strong>
      </>
    ) : (
      <>
        <strong style={{ color: "#a5b4fc" }}>📚 About Accuracy:</strong> Pricing is updated
        automatically by a scheduled script. <strong style={{ color: "#7dd3fc" }}>Vertex AI</strong>{" "}
        committed use discounts can significantly lower unit costs.{" "}
        <strong style={{ color: "#f472b6" }}>JetBrains</strong> All Products Pack includes AI Pro,
        so multi-IDE users may effectively pay nothing extra.{" "}
        <strong>
          Always verify current pricing via official links before production budgeting.
        </strong>
      </>
    ),
};

const disclaimer: RichEntry = {
  text: {
    ja: "⚠️ 免責事項: 本ツールの計算結果は連続使用を仮定した理論値です。実際のコストはキャッシュ割引・Batch API・レート制限・稼働率によって大きく異なります。日本円換算は参考値であり、実際の請求はカード会社・銀行のレートによって異なります。本番環境での予算策定には必ず各社公式ドキュメントを参照してください。",
    en: "⚠️ Disclaimer: All values are theoretical estimates assuming continuous 24/7 usage. Actual costs vary significantly based on cache discounts, Batch API, rate limits, and utilization. JPY figures are for reference only and actual billing rates depend on your card/bank. Always consult official documentation for production budgeting.",
  },
  render: (lang) =>
    lang === "ja" ? (
      <>
        <strong style={{ color: "#ef4444" }}>⚠️ 免責事項:</strong> 本ツールの計算結果は
        <strong>連続使用を仮定した理論値</strong>
        です。実際のコストはキャッシュ割引・Batch API・レート制限・稼働率によって
        大きく異なります。日本円換算は参考値であり、
        実際の請求はカード会社・銀行のレートによって異なります。
        <strong>本番環境での予算策定には必ず各社公式ドキュメントを参照してください。</strong>
      </>
    ) : (
      <>
        <strong style={{ color: "#ef4444" }}>⚠️ Disclaimer:</strong> All values are{" "}
        <strong>theoretical estimates assuming continuous 24/7 usage</strong>. Actual costs vary
        significantly based on cache discounts, Batch API, rate limits, and utilization. JPY figures
        are for reference only and actual billing rates depend on your card/bank.{" "}
        <strong>Always consult official documentation for production budgeting.</strong>
      </>
    ),
};

// ---------- T object ----------

export const T = {
  eyebrow: {
    ja: "AI Cost Simulator · v5 USD + JPY · EN/JA",
    en: "AI Cost Simulator · v5 USD + JPY · EN/JA",
  },
  heroTitle,
  heroDesc,
  metaModels: {
    ja: "APIモデル {n}種 + コーディングツール {m}プラン",
    en: "{n} API models + {m} coding tool plans",
  },
  rateLabel: { ja: "換算レート:", en: "Exchange Rate:" },
  rateDate: { ja: "{date} 実勢レート", en: "Market rate as of {date}" },
  step1Title: {
    ja: "Step 1 — 使用シナリオ選択 (トークン/時間)",
    en: "Step 1 — Select Usage Scenario (tokens/hour)",
  },
  sc_nano: { ja: "🔬 Nano — 超軽量", en: "🔬 Nano — Ultra Light" },
  sc_light: { ja: "💡 Light — 軽量", en: "💡 Light — Lightweight" },
  sc_standard: { ja: "⚙️ Standard — 標準", en: "⚙️ Standard — Normal" },
  sc_heavy: { ja: "🔥 Heavy — 重量", en: "🔥 Heavy — High Load" },
  sc_agentic: { ja: "🤖 Agentic — 自律AI", en: "🤖 Agentic — Autonomous AI" },
  sc_custom: { ja: "⚡ Custom — カスタム", en: "⚡ Custom" },
  inputLabel: { ja: "INPUT TOKENS / 時間", en: "INPUT TOKENS / hour" },
  outputLabel: { ja: "OUTPUT TOKENS / 時間", en: "OUTPUT TOKENS / hour" },
  ab_scenario: { ja: "現在のシナリオ:", en: "Scenario:" },
  ab_ratio: { ja: "I:O 比率:", en: "I:O Ratio:" },
  ab_formula: { ja: "計算式:", en: "Formula:" },
  costPerH: {
    ja: "(IN/1M × $price_in + OUT/1M × $price_out) × h",
    en: "(IN/1M × $price_in + OUT/1M × $price_out) × h",
  },
  tokenPerHourUnit: { ja: "tok/h", en: "tok/h" },
  cellNote: {
    ja: "← 連続使用時の累積コスト · 上段 USD / 下段 JPY",
    en: "← Cumulative cost (continuous use) · Upper: USD / Lower: JPY",
  },
  tabApi: { ja: "🔌 API モデル", en: "🔌 API Models" },
  tabSub: { ja: "💳 コーディングツール", en: "💳 Coding Tools" },
  colModel: { ja: "モデル", en: "Model" },
  colTool: { ja: "ツール / プラン", en: "Tool / Plan" },
  col1h: { ja: "1 時間", en: "1 Hour" },
  col8h: { ja: "8 時間", en: "8 Hours" },
  col24h: { ja: "24 時間", en: "24 Hours" },
  col7d: { ja: "7 日間", en: "7 Days" },
  col30d: { ja: "30 日間", en: "30 Days" },
  col4mo: { ja: "4 ヶ月", en: "4 Months" },
  col12mo: { ja: "12 ヶ月", en: "12 Months" },
  mathTitle: { ja: "計算式と前提条件の解説", en: "Formulas & Assumptions" },
  refTitle: {
    ja: "参考リンク集 — 公式料金ページ",
    en: "Reference Links — Official Pricing Pages",
  },
  cheapestBadge: { ja: "最安", en: "Cheapest" },
  annualLabel: { ja: "年払", en: "Annual" },
  free: { ja: "FREE", en: "FREE" },
  apiNote,
  subNote,
  refNote,
  disclaimer,
  step1: { ja: "Step 1: 使用シナリオを選択", en: "Step 1: Select a usage scenario" },
  step2: { ja: "Step 2: 必要に応じてカスタム設定", en: "Step 2: Customize if needed" },
  step3: { ja: "Step 3: 時間別コスト表を確認", en: "Step 3: Review the cost table" },
  updatedAt: { ja: "価格更新:", en: "Prices updated:" },
  footerSummary: {
    ja: "AI Cost Calculator v5 — {date} | USD + JPY (1 USD = {jpy} 円)",
    en: "AI Cost Calculator v5 — {date} | USD + JPY (1 USD = {jpy} JPY)",
  },
  footerFormula: {
    ja: "cost = (IN/1M × price_in + OUT/1M × price_out) × hours × JPY_rate",
    en: "cost = (IN/1M × price_in + OUT/1M × price_out) × hours × JPY_rate",
  },
} as const satisfies Record<string, Entry>;

export type TranslationKey = keyof typeof T;

/**
 * プレーン文字列としての翻訳を返す。
 * RichEntry の場合は text[lang] (HTML タグ剥がし済みテキスト) を返す。
 * aria-label / meta / alt / title 属性向け。
 */
export function t(key: TranslationKey, lang: Lang): string {
  const entry: Entry = T[key];
  return isRichEntry(entry) ? entry.text[lang] : entry[lang];
}

/**
 * Produce a translation as a React node for the given key and language.
 *
 * For plain entries this returns the raw string; for rich entries this returns the JSX produced by the entry's `render` function.
 *
 * @param key - The translation key to look up
 * @param lang - Language code (`"ja"` or `"en"`)
 * @returns A `ReactNode` containing the translation: a string for plain entries or rendered JSX for rich entries
 */
export function tRich(key: TranslationKey, lang: Lang): ReactNode {
  const entry: Entry = T[key];
  return isRichEntry(entry) ? entry.render(lang) : entry[lang];
}
