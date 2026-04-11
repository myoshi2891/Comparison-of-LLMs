/**
 * JA/EN 翻訳定義。
 *
 * 由来: web/src/i18n.ts からの逐語移植 (Phase 5 Green)。
 * HTML タグ (<em>, <strong>, <strong style="...">) はこの時点では
 * 生の文字列としてそのまま保持している。次の Refactor コミットで
 * React 要素ファクトリへ置き換える (XSS 対策)。
 *
 * プレースホルダ ({n}/{m}/{date}) の補完は呼び出し側 (App/page) 責務。
 * i18n 層は素のまま返す契約 (i18n.test.ts で固定済み)。
 */

export type Lang = "ja" | "en";

export const T = {
  eyebrow: {
    ja: "AI Cost Simulator · v5 USD + JPY · EN/JA",
    en: "AI Cost Simulator · v5 USD + JPY · EN/JA",
  },
  heroTitle: {
    ja: "AIモデル <em>時間別コスト</em> 計算機",
    en: "AI Model <em>Hourly Cost</em> Calculator",
  },
  heroDesc: {
    ja: "使用トークン量を設定し、<strong>1時間・8時間・24時間・7日・30日・4ヶ月・12ヶ月</strong>の累積コストをリアルタイムに算出。各セルに <strong>USD ($)</strong> と <strong>日本円 (¥)</strong> を同時表示。",
    en: "Set your token usage and instantly calculate cumulative costs for <strong>1h · 8h · 24h · 7d · 30d · 4mo · 12mo</strong>. Each cell shows both <strong>USD ($)</strong> and <strong>JPY (¥)</strong>.",
  },
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
  apiNote: {
    ja: "<strong>📌 計算前提:</strong> 上記コストは<strong>24時間365日連続使用</strong>した場合の累積API費用です。各セルの上段は <strong>USD ($)</strong>、下段は <strong>日本円 (¥)</strong>。キャッシュ割引・Batch API割引は未適用。ヘッダークリックでソート可能。",
    en: "<strong>📌 Assumptions:</strong> Costs assume <strong>24/7 continuous usage</strong>. Upper = <strong>USD ($)</strong>, Lower = <strong>JPY (¥)</strong>. Cache/Batch discounts not applied. Click headers to sort.",
  },
  subNote: {
    ja: "<strong>ℹ️ サブスクリプションの計算:</strong> 月額固定費を時間按分。1h = 月額÷720、30d = 月額1ヶ月分、12mo = 年額優先。各セル上段 <strong>USD</strong>、下段 <strong>JPY</strong>。",
    en: "<strong>ℹ️ Subscription Calculation:</strong> Fixed monthly cost prorated. 1h = monthly÷720, 30d = 1 month, 12mo = annual price (preferred). Upper: <strong>USD</strong>, Lower: <strong>JPY</strong>.",
  },
  refNote: {
    ja: '<strong style="color:#a5b4fc">📚 価格・為替の正確性について:</strong> 本ツールの価格は定期スクリプトで自動更新されます。<strong style="color:#7dd3fc">Vertex AI</strong>はGCPコミット割引が適用されると実質単価が下がります。<strong style="color:#f472b6">JetBrains</strong>のAll Products PackにはAI Proが内包されるため、複数IDE利用者は追加コストが実質ゼロになる場合があります。<strong>本番環境の予算策定は必ず各公式リンクで最新情報を確認してください。</strong>',
    en: '<strong style="color:#a5b4fc">📚 About Accuracy:</strong> Pricing is updated automatically by a scheduled script. <strong style="color:#7dd3fc">Vertex AI</strong> committed use discounts can significantly lower unit costs. <strong style="color:#f472b6">JetBrains</strong> All Products Pack includes AI Pro, so multi-IDE users may effectively pay nothing extra. <strong>Always verify current pricing via official links before production budgeting.</strong>',
  },
  disclaimer: {
    ja: '<strong style="color:#ef4444">⚠️ 免責事項:</strong> 本ツールの計算結果は<strong>連続使用を仮定した理論値</strong>です。実際のコストはキャッシュ割引・Batch API・レート制限・稼働率によって大きく異なります。日本円換算は参考値であり、実際の請求はカード会社・銀行のレートによって異なります。<strong>本番環境での予算策定には必ず各社公式ドキュメントを参照してください。</strong>',
    en: '<strong style="color:#ef4444">⚠️ Disclaimer:</strong> All values are <strong>theoretical estimates assuming continuous 24/7 usage</strong>. Actual costs vary significantly based on cache discounts, Batch API, rate limits, and utilization. JPY figures are for reference only and actual billing rates depend on your card/bank. <strong>Always consult official documentation for production budgeting.</strong>',
  },
  updatedAt: { ja: "価格更新:", en: "Prices updated:" },
} as const;

export type TranslationKey = keyof typeof T;

export function t(key: TranslationKey, lang: Lang): string {
  return T[key][lang];
}
