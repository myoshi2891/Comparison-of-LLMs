/**
 * サブスクリプションプラン比較テーブル。
 *
 * Server Component: state / ハンドラを持たず props は全て serializable。
 * レガシー web/src/components/SubTable.tsx から verbatim 移植し、
 * 以下のみ next 側向けに差し替える:
 *   - i18n アクセスを T[key][lang] から t(key, lang) に統一
 *   - array-index key の biome ignore コメントを追加
 *
 * 依存:
 *   - PERIODS / calcSubCost / fmtUSD / fmtJPY  @/lib/cost
 *   - DualCell                                  @/components/DualCell
 *   - SubTool                                   @/types/pricing
 *   - t / Lang                                  @/lib/i18n
 */

import { DualCell } from "@/components/DualCell";
import { calcSubCost, fmtJPY, fmtUSD, PERIODS } from "@/lib/cost";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { SubTool } from "@/types/pricing";

const GROUP_COLORS: Record<string, string> = {
  "GitHub Copilot": "#238636",
  Cursor: "#7c3aed",
  "Claude Code": "#c084fc",
  Windsurf: "#0ea5e9",
  "OpenAI Codex": "#10b981",
  "JetBrains AI": "#f472b6",
  "Junie (JetBrains)": "#ec4899",
  "Google One AI": "#4285f4",
  Antigravity: "#818cf8",
};

interface Props {
  lang: Lang;
  tools: SubTool[];
  jpyRate: number;
}

export function SubTable({ lang, tools, jpyRate }: Props) {
  let lastGroup = "";

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t("colTool", lang)}</th>
            {(["col1h", "col8h", "col24h", "col7d", "col30d", "col4mo", "col12mo"] as const).map(
              (key) => (
                <th key={key}>{t(key, lang)}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {tools.map((tool, idx) => {
            const isNewGroup = tool.group !== lastGroup;
            lastGroup = tool.group;
            const color = GROUP_COLORS[tool.group] ?? "#aaa";
            const note = lang === "ja" ? tool.note_ja : tool.note_en;

            const mJPY = Math.round(tool.monthly * jpyRate).toLocaleString("ja-JP");
            const mStr =
              tool.monthly === 0 ? t("free", lang) : `${fmtUSD(tool.monthly)}/mo (¥${mJPY})`;
            const aStr =
              tool.annual != null
                ? ` | ${t("annualLabel", lang)} ${fmtUSD(tool.annual)}/mo (¥${Math.round(
                    tool.annual * jpyRate
                  ).toLocaleString("ja-JP")})`
                : "";

            return [
              isNewGroup && (
                // biome-ignore lint/suspicious/noArrayIndexKey: tools は描画順のまま key に使用 (レガシー互換)
                <tr key={`grp-${idx}`} className="group-header">
                  <td
                    colSpan={8}
                    style={{ color, borderLeft: `3px solid ${color}`, paddingLeft: "11px" }}
                  >
                    ● {tool.group}
                  </td>
                </tr>
              ),
              // biome-ignore lint/suspicious/noArrayIndexKey: tools 配列の順序を描画順に保持するため idx を安定キーとして使用
              <tr key={`row-${idx}`}>
                <td>
                  <div className="model-cell">
                    <span className="model-name">
                      {tool.group} — {tool.name}
                    </span>
                    <span className="model-sub">
                      {mStr}
                      {aStr}
                    </span>
                    <span className={`model-tag ${tool.cls}`}>{tool.tag}</span>
                    <span style={{ fontSize: "10px", color: "var(--txt3)" }}>{note}</span>
                  </div>
                </td>
                {PERIODS.map((p) => {
                  const usd = calcSubCost(tool.monthly, tool.annual, p.hours);
                  const annualNote =
                    p.hours >= 8760 && tool.annual != null && tool.annual < tool.monthly * 12
                      ? `${t("annualLabel", lang)} ${fmtUSD(tool.annual)}/yr (¥${fmtJPY(
                          tool.annual,
                          jpyRate
                        ).replace("¥", "")})`
                      : null;
                  return (
                    <td key={p.key}>
                      <DualCell usd={usd} jpyRate={jpyRate} annualNote={annualNote} />
                    </td>
                  );
                })}
              </tr>,
            ];
          })}
        </tbody>
      </table>
    </div>
  );
}
