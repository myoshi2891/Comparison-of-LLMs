/**
 * 2通貨コストセル。テーブル内で USD / JPY を 1 セルに重ねて表示する。
 *
 * - Server Component（非 interactive）。props はプレーンデータのみなので
 *   Server→Client 境界を跨いでも serializable。
 * - colorIndex / fmtUSD / fmtJPY は lib/cost の純粋関数を参照 →
 *   Phase 4 の fmtJPY(jpyRate<=0) ¥— 修正が自動で効く。
 */

import { colorIndex, fmtJPY, fmtUSD } from "@/lib/cost";

interface Props {
  usd: number;
  jpyRate: number;
  annualNote?: string | null;
}

export function DualCell({ usd, jpyRate, annualNote }: Props) {
  const n = colorIndex(usd);
  return (
    <div className="cost-wrap">
      <span className={`cost-usd cc-${n}`}>{fmtUSD(usd)}</span>
      <span className={`cost-jpy jpy-${n}`}>{fmtJPY(usd, jpyRate)}</span>
      {annualNote && <span className="sub-flat">{annualNote}</span>}
    </div>
  );
}
