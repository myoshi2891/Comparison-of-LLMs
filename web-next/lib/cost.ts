/**
 * コスト計算ユーティリティ（純粋関数のみ）。
 *
 * 配置ルール:
 * - React / Next.js への依存を持たない（Server Component と Client Component の
 *   双方から import 可能にする）
 * - 副作用を持たない（テスト容易性と決定論的出力のため）
 * - ロケール依存は `fmtJPY` の `ja-JP` グルーピングのみ
 *
 * ポート元: web/src/lib/cost.ts（verbatim 移植）。
 */

export const PERIODS = [
  { key: "1h", hours: 1 },
  { key: "8h", hours: 8 },
  { key: "24h", hours: 24 },
  { key: "7d", hours: 168 },
  { key: "30d", hours: 720 },
  { key: "4mo", hours: 2920 },
  { key: "12mo", hours: 8760 },
] as const;

/**
 * Compute the USD cost for API token usage over a time window.
 *
 * @param priceIn - Price in USD per 1,000,000 input tokens
 * @param priceOut - Price in USD per 1,000,000 output tokens
 * @param inputTokens - Total number of input tokens
 * @param outputTokens - Total number of output tokens
 * @param hours - Hours multiplier used to scale the calculated token cost
 * @returns The total cost in USD
 */
export function calcApiCost(
  priceIn: number,
  priceOut: number,
  inputTokens: number,
  outputTokens: number,
  hours: number
): number {
  return ((inputTokens / 1e6) * priceIn + (outputTokens / 1e6) * priceOut) * hours;
}

/**
 * Calculate the prorated subscription cost in USD for a given time window.
 *
 * Uses these rules:
 * - If both `monthly` is 0 and `annual` is null or 0, returns 0.
 * - For periods >= 8760 hours, returns `annual` when it is provided.
 * - For periods <= 720 hours, prorates `monthly` by hours; if `monthly` is 0 and `annual` is provided, prorates `annual` by hours.
 * - Otherwise prorates `monthly` by (hours / 720).
 *
 * @param monthly - Monthly subscription price in USD
 * @param annual - Annual subscription price in USD, or `null` if not available
 * @param hours - Time window in hours used to prorate the subscription
 * @returns The subscription cost in USD for the specified `hours`
 */
export function calcSubCost(monthly: number, annual: number | null, hours: number): number {
  if (monthly === 0 && (!annual || annual === 0)) return 0;
  if (hours >= 8760 && annual != null) return annual;
  if (hours <= 720) {
    if (monthly > 0) return (monthly * hours) / 720;
    // monthly === 0 && annual > 0: 年額を時間按分
    if (annual != null) return (annual * hours) / 8760;
  }
  return monthly * (hours / 720);
}

/**
 * Map a numeric cost to a discrete color-class index from 0 to 10.
 *
 * @param v - The cost value to bucket (expected in USD or same unit).
 * @returns `0` for non-finite or non-positive values; otherwise the smallest index `i` (0–9)
 * where `v` is less than the ascending thresholds [0.01, 0.1, 1, 5, 20, 100, 500, 2000, 10000, 50000];
 * returns `10` if `v` is greater than or equal to the highest threshold.
 */
export function colorIndex(v: number): number {
  if (!Number.isFinite(v)) return 0;
  if (v <= 0) return 0;
  const thresholds = [0.01, 0.1, 1, 5, 20, 100, 500, 2000, 10000, 50000];
  for (let i = 0; i < thresholds.length; i++) {
    if (v < thresholds[i]) return i;
  }
  return 10;
}

/**
 * Formats a USD monetary value into a user-facing string with a dollar sign and thousands separators.
 *
 * @param v - The USD amount to format
 * @returns The formatted USD string: `"$0.00"` for non-finite or non-positive values, `"<$0.01"` for values less than `0.005`, otherwise a dollar-prefixed string with two decimals and comma thousands separators
 */
export function fmtUSD(v: number): string {
  if (!Number.isFinite(v)) return "$0.00";
  if (v <= 0) return "$0.00";
  if (v < 0.005) return "<$0.01";
  return `$${v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/**
 * Format a numeric value as a JPY currency string using the provided exchange rate.
 *
 * @param v - The monetary amount to convert (base currency units)
 * @param jpyRate - The JPY exchange rate to apply; treated as invalid when not finite or <= 0
 * @returns `¥—` when `v` or `jpyRate` is invalid; `¥0` when the converted JPY is <= 0; `"<¥1"` when the converted JPY is greater than 0 but less than 1; otherwise the converted JPY rounded to the nearest integer and formatted with Japanese thousands separators, prefixed with `¥`
 */
export function fmtJPY(v: number, jpyRate: number): string {
  if (!Number.isFinite(v)) return "¥—";
  if (!Number.isFinite(jpyRate) || jpyRate <= 0) return "¥—";
  const j = v * jpyRate;
  if (j <= 0) return "¥0";
  if (j < 1) return "<¥1";
  return `¥${Math.round(j).toLocaleString("ja-JP")}`;
}
