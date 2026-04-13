/**
 * ルートページ (Server Component)。
 *
 * 責務:
 * 1. pricing.json を static import でビルド時に読み込む
 * 2. parsePricingData() で Zod ランタイム検証 → 型安全な PricingData を生成
 * 3. 検証済みデータを <HomePage> (Client Component) に委譲
 *
 * Server Component である理由:
 * - Zod 検証をビルド時 (SSG) に実行し、不正データを deploy 前に検出
 * - pricing.json は Client バンドルではなく Server 側で解決される
 * - UI 状態 (useState) を持たない → Client 不要
 */

import { HomePage } from "@/components/HomePage";
import pricingJson from "@/data/pricing.json";
import { parsePricingData } from "@/lib/pricing";

const pricing = parsePricingData(pricingJson);

/**
 * Root server page that renders the HomePage with validated pricing data.
 *
 * @returns A JSX element that renders `HomePage` with the validated `pricing` passed as its `data` prop.
 */
export default function Page() {
  return <HomePage data={pricing} />;
}
