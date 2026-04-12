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

/** API モデルの時間別コスト (USD) を計算 */
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
 * サブスクリプション按分コスト (USD) を計算。
 * - 720h (30日) 以下は月額を時間換算
 * - 8760h (1年) は年払い優先（annual が null でなければ）
 * - それ以外は月額 × 月数
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

/** コスト値を色クラスインデックス (0-10) に変換 */
export function colorIndex(v: number): number {
  if (!Number.isFinite(v)) return 0;
  if (v <= 0) return 0;
  const thresholds = [0.01, 0.1, 1, 5, 20, 100, 500, 2000, 10000, 50000];
  for (let i = 0; i < thresholds.length; i++) {
    if (v < thresholds[i]) return i;
  }
  return 10;
}

/** USD 金額をフォーマット */
export function fmtUSD(v: number): string {
  if (!Number.isFinite(v)) return "$0.00";
  if (v <= 0) return "$0.00";
  if (v < 0.005) return "<$0.01";
  return `$${v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/**
 * JPY 金額をフォーマット
 *
 * `jpyRate <= 0` は「為替レート取得失敗」を示す無効値として扱い、
 * `¥—` を返す。これがないと `v > 0` でも `v * 0 = 0` で `¥0` を返してしまい、
 * 「価格がゼロ」と「レート不明」が区別不能になる（defense in depth）。
 * `v` が非有限値 (NaN / Infinity) の場合も同様に `¥—` を返す。
 */
export function fmtJPY(v: number, jpyRate: number): string {
  if (!Number.isFinite(v)) return "¥—";
  if (!Number.isFinite(jpyRate) || jpyRate <= 0) return "¥—";
  const j = v * jpyRate;
  if (j <= 0) return "¥0";
  if (j < 1) return "<¥1";
  return `¥${Math.round(j).toLocaleString("ja-JP")}`;
}
