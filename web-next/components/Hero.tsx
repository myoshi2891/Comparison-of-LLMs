/**
 * ページ先頭のヒーローセクション。
 *
 * Phase 5 からの重要変更:
 * - heroTitle / heroDesc は tRich(key, lang) で React ノードとして合成する
 *   ことで、生 HTML 文字列の DOM 注入 API を一切使わない XSS-safe 描画に
 *   切り替え。
 * - プレースホルダ {n}/{m}/{date} は呼び出し側で置換する契約 (i18n.tsx JSDoc 参照)。
 *
 * Server Component: props はプレーンデータのみで interactive 要素なし。
 */

import type { Lang } from "@/lib/i18n";
import { t, tRich } from "@/lib/i18n";
import type { PricingData } from "@/types/pricing";

interface Props {
  lang: Lang;
  data: PricingData;
  apiCount: number;
  toolCount: number;
}

export function Hero({ lang, data, apiCount, toolCount }: Props) {
  const metaModels = t("metaModels", lang)
    .replace("{n}", String(apiCount))
    .replace("{m}", String(toolCount));

  const rateDateStr = t("rateDate", lang).replace(
    "{date}",
    data.jpy_rate_date === "fallback" ? "–" : data.jpy_rate_date
  );

  const updatedDate = data.generated_at.slice(0, 10);

  return (
    <div className="hero">
      <div className="hero-inner">
        <div className="hero-eyebrow">{t("eyebrow", lang)}</div>
        <h1>{tRich("heroTitle", lang)}</h1>
        <p className="hero-desc">{tRich("heroDesc", lang)}</p>
        <div className="hero-meta">
          <span>{t("step1", lang)}</span>
          <span>{t("step2", lang)}</span>
          <span>{t("step3", lang)}</span>
          <span>{metaModels}</span>
        </div>
        <div className="rate-badge">
          <span>{t("rateLabel", lang)}</span>
          <strong>1 USD = {data.jpy_rate.toFixed(2)} JPY</strong>
          <span style={{ opacity: 0.7, fontSize: "10px" }}>{rateDateStr}</span>
        </div>
        <div
          style={{
            marginTop: "8px",
            fontSize: "11px",
            color: "var(--txt3)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {t("updatedAt", lang)} {updatedDate}
        </div>
      </div>
    </div>
  );
}
