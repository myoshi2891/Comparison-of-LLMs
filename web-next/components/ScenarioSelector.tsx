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

import { useId, useState } from "react";
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

export function ScenarioSelector({
  lang,
  currentInput,
  currentOutput,
  scenario,
  onScenarioChange,
}: Props) {
  const [customInput, setCustomInput] = useState(150_000);
  const [customOutput, setCustomOutput] = useState(50_000);
  const inputFieldId = useId();
  const outputFieldId = useId();

  const selectScenario = (key: ScenarioKey) => {
    if (key === "custom") {
      onScenarioChange("custom", customInput, customOutput);
    } else {
      const s = SCENARIOS[key];
      onScenarioChange(key, s.input, s.output);
    }
  };

  const updateCustomInput = (val: number) => {
    setCustomInput(val);
    if (scenario === "custom") onScenarioChange("custom", val, customOutput);
  };

  const updateCustomOutput = (val: number) => {
    setCustomOutput(val);
    if (scenario === "custom") onScenarioChange("custom", customInput, val);
  };

  const ratio = currentOutput > 0 ? `${(currentInput / currentOutput).toFixed(1)}:1` : "–";
  const costPerH = "(IN/1M × $price_in + OUT/1M × $price_out) × h";
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
                  min={1000}
                  max={2_000_000}
                  step={1000}
                  value={customInput}
                  onChange={(e) => updateCustomInput(Number(e.target.value))}
                />
                <input
                  id={inputFieldId}
                  type="number"
                  min={0}
                  max={10_000_000}
                  step={1000}
                  value={customInput}
                  onChange={(e) => updateCustomInput(Number(e.target.value))}
                />
                <span className="unit">tok/h</span>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor={outputFieldId}>{t("outputLabel", lang)}</label>
              <div className="input-row">
                <input
                  type="range"
                  min={1000}
                  max={1_000_000}
                  step={1000}
                  value={customOutput}
                  onChange={(e) => updateCustomOutput(Number(e.target.value))}
                />
                <input
                  id={outputFieldId}
                  type="number"
                  min={0}
                  max={5_000_000}
                  step={1000}
                  value={customOutput}
                  onChange={(e) => updateCustomOutput(Number(e.target.value))}
                />
                <span className="unit">tok/h</span>
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
          {costPerH}
        </span>
      </div>
    </div>
  );
}
