"use client";

/**
 * API モデル比較テーブル。列ヘッダクリックで昇降ソート切替。
 *
 * Client Component: useState × 2 で sortCol / sortDir を管理。
 * - sortCol: ソート対象の列インデックス (null = 未ソート)
 * - sortDir: 1 = 昇順、-1 = 降順
 *
 * 最安行判定: 30 日列 (PERIODS から動的に導出) の最小値を持つ行に
 * .cheapest-row クラスと .cheapest-badge を付与。
 */

import { useState } from "react";
import { calcApiCost, fmtJPY, PERIODS } from "@/lib/cost";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { ApiModel } from "@/types/pricing";
import { DualCell } from "./DualCell";

/** 30 日列のインデックス — PERIODS 配列順の変更に追従 */
const IDX_30D = PERIODS.findIndex((p) => p.key === "30d");

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "#10b981",
  Anthropic: "#c084fc",
  "Google AI": "#3b82f6",
  "Vertex AI": "#7dd3fc",
  xAI: "#94a3b8",
  DeepSeek: "#22d3ee",
  AWS: "#facc15",
};

interface Props {
  lang: Lang;
  models: ApiModel[];
  inputTokens: number;
  outputTokens: number;
  jpyRate: number;
}

type ColKey = "col1h" | "col8h" | "col24h" | "col7d" | "col30d" | "col4mo" | "col12mo";

const COL_KEYS: readonly ColKey[] = [
  "col1h",
  "col8h",
  "col24h",
  "col7d",
  "col30d",
  "col4mo",
  "col12mo",
] as const;

/**
 * Renders an API pricing comparison table with sortable period columns, provider grouping, and cheapest-row highlighting.
 *
 * The table displays per-model computed costs for configured periods, allows ascending/descending sorting by column, inserts a provider header row when the provider changes, and marks model(s) with the lowest 30-day cost with a cheapest badge and row styling.
 *
 * @returns A JSX element containing the rendered pricing comparison table
 */
export function ApiTable({ lang, models, inputTokens, outputTokens, jpyRate }: Props) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState(1);

  const rows = models.map((m) => ({
    ...m,
    costs: PERIODS.map((p) =>
      calcApiCost(m.price_in, m.price_out, inputTokens, outputTokens, p.hours)
    ),
  }));

  if (sortCol !== null) {
    rows.sort((a, b) => sortDir * (a.costs[sortCol] - b.costs[sortCol]));
  }

  const min30 = Math.min(...rows.map((r) => r.costs[IDX_30D]));

  const toggleSort = (colIdx: number) => {
    if (sortCol === colIdx) {
      setSortDir((d) => d * -1);
    } else {
      setSortCol(colIdx);
      setSortDir(1);
    }
  };

  let lastProvider = "";

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t("colModel", lang)}</th>
            {COL_KEYS.map((key, i) => (
              <th
                key={key}
                aria-sort={sortCol === i ? (sortDir > 0 ? "ascending" : "descending") : "none"}
              >
                <button
                  type="button"
                  onClick={() => toggleSort(i)}
                  style={{ cursor: "pointer" }}
                  title={lang === "ja" ? "クリックでソート" : "Click to sort"}
                >
                  {t(key, lang)}
                  {sortCol === i ? (sortDir > 0 ? " ▲" : " ▼") : ""}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((m, idx) => {
            const isNewProvider = m.provider !== lastProvider;
            lastProvider = m.provider;
            const isCheap = m.costs[IDX_30D] === min30;
            const sub = lang === "ja" ? m.sub_ja : m.sub_en;
            const color = PROVIDER_COLORS[m.provider] ?? "#aaa";

            return [
              isNewProvider && (
                // biome-ignore lint/suspicious/noArrayIndexKey: models 配列の描画順を保持するため idx を安定キーとして使用 (レガシー互換)
                <tr key={`grp-${idx}`} className="group-header">
                  <td
                    colSpan={8}
                    style={{
                      color,
                      borderLeft: `3px solid ${color}`,
                      paddingLeft: "11px",
                    }}
                  >
                    ● {m.provider}
                  </td>
                </tr>
              ),
              // biome-ignore lint/suspicious/noArrayIndexKey: models 配列の順序でソート状態を反映するため idx を使用
              <tr key={`row-${idx}`} className={isCheap ? "cheapest-row" : ""}>
                <td>
                  <div className="model-cell">
                    <span className="model-name">
                      {m.name}
                      {isCheap && (
                        <span className="cheapest-badge">{t("cheapestBadge", lang)}</span>
                      )}
                    </span>
                    <span className="model-sub">
                      ${m.price_in} in / ${m.price_out} out /1M &nbsp;|&nbsp;{" "}
                      {fmtJPY(m.price_in, jpyRate)} / {fmtJPY(m.price_out, jpyRate)}
                    </span>
                    <span className={`model-tag ${m.cls}`}>{m.tag}</span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--txt3)",
                      }}
                    >
                      {sub}
                    </span>
                  </div>
                </td>
                {m.costs.map((cost, ci) => (
                  <td key={PERIODS[ci].key}>
                    <DualCell usd={cost} jpyRate={jpyRate} />
                  </td>
                ))}
              </tr>,
            ];
          })}
        </tbody>
      </table>
    </div>
  );
}
