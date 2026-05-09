"use client";

/**
 * 使用シナリオ選択パネル (Step 1)。
 *
 * Client Component 必須の理由:
 * - onScenarioChange 関数 prop は serializable ではなく、
 *   親も Client Component である必要がある
 * - useState でカスタム入力値を保持 (scenario !== 'custom' の間も
 *   下書きとして生存させる)
 * - onClick / onChange イベントハンドラを持つ
 *
 * レガシーからの差分:
 * - 全 button に type="button" を明示追加 (submit 誤発火防止 + a11y)
 * - i18n キー参照を t(key, lang) 経由に統一し、
 *   T[key as keyof typeof T][lang] as string の型アサーションを排除
 */

import { useEffect, useId, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export type ScenarioKey = "nano" | "light" | "standard" | "heavy" | "agentic" | "custom";

export const SCENARIOS: Record<ScenarioKey, { input: number; output: number; color: string }> = {
  nano: { input: 10_000, output: 3_000, color: "#22d3ee" },
  light: { input: 50_000, output: 15_000, color: "#4ade80" },
  standard: { input: 150_000, output: 50_000, color: "#60a5fa" },
  heavy: { input: 400_000, output: 150_000, color: "#f59e0b" },
  agentic: { input: 1_000_000, output: 400_000, color: "#f87171" },
  custom: { input: 150_000, output: 50_000, color: "#a78bfa" },
};

const INPUT_MIN = 1_000;
const INPUT_MAX = 2_000_000;
const OUTPUT_MIN = 1_000;
const OUTPUT_MAX = 1_000_000;

const SCENARIO_ORDER: readonly ScenarioKey[] = [
  "nano",
  "light",
  "standard",
  "heavy",
  "agentic",
  "custom",
];

// `sc_${ScenarioKey}` を union type として表現し、t() の型安全を保つ。
type ScLabelKey = `sc_${ScenarioKey}`;

interface Props {
  lang: Lang;
  currentInput: number;
  currentOutput: number;
  scenario: ScenarioKey;
  onScenarioChange: (key: ScenarioKey, input: number, output: number) => void;
}

/**
 * Render the scenario selection panel with preset scenario buttons and an optional synchronized custom input/output panel.
 *
 * Displays each preset's input/output rates, lets the user choose a scenario, and when `scenario` is `"custom"` provides linked range and numeric controls for input and output that propagate changes via `onScenarioChange`.
 *
 * @param lang - Language code used for i18n lookups
 * @param currentInput - Externally controlled input value (tokens per hour) shown in the UI and used to compute the displayed ratio
 * @param currentOutput - Externally controlled output value (tokens per hour) shown in the UI and used to compute the displayed ratio; if less than or equal to zero the ratio is shown as `"–"`
 * @param scenario - Currently selected scenario key
 * @param onScenarioChange - Callback invoked when the user selects a scenario or updates active custom values; called with `(key, input, output)`
 * @returns The JSX element rendering the scenario selector panel
 */
export function ScenarioSelector({
  lang,
  currentInput,
  currentOutput,
  scenario,
  onScenarioChange,
}: Props) {
  const [customInput, setCustomInput] = useState(SCENARIOS.custom.input);
  const [customOutput, setCustomOutput] = useState(SCENARIOS.custom.output);
  const inputFieldId = useId();
  const outputFieldId = useId();

  // scenario が "custom" のとき、外部 props の値と内部状態を同期する。
  // 親がストレージから復元した値を渡してきた場合に初期状態と乖離しないようにする。
  useEffect(() => {
    if (scenario !== "custom") return;
    if (currentInput !== customInput) setCustomInput(currentInput);
    if (currentOutput !== customOutput) setCustomOutput(currentOutput);
  }, [scenario, currentInput, currentOutput, customInput, customOutput]);

  const selectScenario = (key: ScenarioKey) => {
    if (key === "custom") {
      onScenarioChange("custom", customInput, customOutput);
    } else {
      const s = SCENARIOS[key];
      onScenarioChange(key, s.input, s.output);
    }
  };

  const updateCustomInput = (val: number) => {
    const clamped = Number.isNaN(val) ? INPUT_MIN : Math.min(INPUT_MAX, Math.max(INPUT_MIN, val));
    setCustomInput(clamped);
    if (scenario === "custom") onScenarioChange("custom", clamped, customOutput);
  };

  const updateCustomOutput = (val: number) => {
    const clamped = Number.isNaN(val)
      ? OUTPUT_MIN
      : Math.min(OUTPUT_MAX, Math.max(OUTPUT_MIN, val));
    setCustomOutput(clamped);
    if (scenario === "custom") onScenarioChange("custom", customInput, clamped);
  };

  const ratio = currentOutput > 0 ? `${(currentInput / currentOutput).toFixed(1)}:1` : "–";
  const scenarioLabelKey: ScLabelKey = `sc_${scenario}`;

  return (
    <div className="panel">
      <div className="panel-title">{t("step1Title", lang)}</div>
      <div className="scenarios">
        {SCENARIO_ORDER.map((key) => {
          const s = SCENARIOS[key];
          const labelKey: ScLabelKey = `sc_${key}`;
          const label = t(labelKey, lang);
          const rateText =
            key !== "custom"
              ? `${(s.input / 1000).toFixed(0)}K / ${(s.output / 1000).toFixed(0)}K`
              : `${(customInput / 1000).toFixed(0)}K / ${(customOutput / 1000).toFixed(0)}K`;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={scenario === key}
              className={`scenario-btn${scenario === key ? " active" : ""}`}
              onClick={() => selectScenario(key)}
            >
              <span className="dot" style={{ background: s.color }} />
              {label}
              <span className="rate">{rateText}</span>
            </button>
          );
        })}
      </div>

      {scenario === "custom" && (
        <div className="custom-panel show">
          <div className="custom-grid">
            <div className="input-group">
              <label htmlFor={inputFieldId}>{t("inputLabel", lang)}</label>
              <div className="input-row">
                <input
                  type="range"
                  aria-label={t("inputLabel", lang)}
                  min={INPUT_MIN}
                  max={INPUT_MAX}
                  step={1000}
                  value={customInput}
                  onChange={(e) => updateCustomInput(Number(e.target.value))}
                />
                <input
                  id={inputFieldId}
                  type="number"
                  min={INPUT_MIN}
                  max={INPUT_MAX}
                  step={1000}
                  value={customInput}
                  onChange={(e) => updateCustomInput(Number(e.target.value))}
                />
                <span className="unit">{t("tokenPerHourUnit", lang)}</span>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor={outputFieldId}>{t("outputLabel", lang)}</label>
              <div className="input-row">
                <input
                  type="range"
                  aria-label={t("outputLabel", lang)}
                  min={OUTPUT_MIN}
                  max={OUTPUT_MAX}
                  step={1000}
                  value={customOutput}
                  onChange={(e) => updateCustomOutput(Number(e.target.value))}
                />
                <input
                  id={outputFieldId}
                  type="number"
                  min={OUTPUT_MIN}
                  max={OUTPUT_MAX}
                  step={1000}
                  value={customOutput}
                  onChange={(e) => updateCustomOutput(Number(e.target.value))}
                />
                <span className="unit">{t("tokenPerHourUnit", lang)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="assumption-bar">
        <span className="lbl">{t("ab_scenario", lang)}</span>
        <span className="val">{t(scenarioLabelKey, lang)}</span>
        <span className="sep">·</span>
        <span className="lbl">{t("ab_ratio", lang)}</span>
        <span className="val">{ratio}</span>
        <span className="sep">·</span>
        <span className="lbl">{t("ab_formula", lang)}</span>
        <span className="val" style={{ fontSize: "10px" }}>
          {t("costPerH", lang)}
        </span>
      </div>
    </div>
  );
}
