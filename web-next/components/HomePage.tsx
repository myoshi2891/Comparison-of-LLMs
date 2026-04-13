"use client";

/**
 * アプリケーションのトップレベル Client Component。
 *
 * app/page.tsx (Server Component) が Zod 検証済みの PricingData を渡し、
 * 本コンポーネントが全 UI 状態と子コンポーネントの合成を担う。
 *
 * レガシー web/src/App.tsx からの主な差分:
 * - 生 HTML 注入を tRich() で React ノード合成に置換 (Phase 5 投資回収)
 * - T.key[lang] → t("key", lang) / tRich("key", lang)
 * - pricing.json の直接 import → Server Component 経由で props 受け取り
 */

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t, tRich } from "@/lib/i18n";
import type { PricingData } from "@/types/pricing";
import { ApiTable } from "./ApiTable";
import { Hero } from "./Hero";
import { LanguageToggle } from "./LanguageToggle";
import { MathSection } from "./MathSection";
import { RefLinks } from "./RefLinks";
import { SCENARIOS, type ScenarioKey, ScenarioSelector } from "./ScenarioSelector";
import { SubTable } from "./SubTable";

type TabKey = "api" | "sub";

interface Props {
  data: PricingData;
}

export function HomePage({ data }: Props) {
  const [lang, setLang] = useState<Lang>("ja");
  const [tab, setTab] = useState<TabKey>("api");
  const [scenario, setScenario] = useState<ScenarioKey>("standard");
  const [inputTokens, setInputTokens] = useState(SCENARIOS.standard.input);
  const [outputTokens, setOutputTokens] = useState(SCENARIOS.standard.output);

  const handleScenarioChange = (key: ScenarioKey, input: number, output: number) => {
    setScenario(key);
    setInputTokens(input);
    setOutputTokens(output);
  };

  const { jpy_rate, api_models, sub_tools } = data;
  const apiCount = api_models.length;
  const toolCount = sub_tools.length;

  return (
    <>
      <LanguageToggle lang={lang} onToggle={setLang} />

      <Hero lang={lang} data={data} apiCount={apiCount} toolCount={toolCount} />

      <div className="container">
        <ScenarioSelector
          lang={lang}
          currentInput={inputTokens}
          currentOutput={outputTokens}
          scenario={scenario}
          onScenarioChange={handleScenarioChange}
        />

        <div className="section section-tabs">
          {/* 時間帯バッジ */}
          <div className="time-badges">
            <span className="time-badge tb-s">1h</span>
            <span className="time-badge tb-s">8h</span>
            <span className="time-badge tb-s">24h</span>
            <span className="time-badge tb-m">7d</span>
            <span className="time-badge tb-m">30d</span>
            <span className="time-badge tb-l">4mo</span>
            <span className="time-badge tb-l">12mo</span>
            <span className="cell-note-label">{t("cellNote", lang)}</span>
          </div>

          {/* タブ切り替え */}
          <div className="tabs">
            <button
              type="button"
              className={`tab-btn${tab === "api" ? " active" : ""}`}
              onClick={() => setTab("api")}
            >
              {t("tabApi", lang)}
            </button>
            <button
              type="button"
              className={`tab-btn${tab === "sub" ? " active" : ""}`}
              onClick={() => setTab("sub")}
            >
              {t("tabSub", lang)}
            </button>
          </div>

          {/* API テーブル */}
          {tab === "api" && (
            <>
              <ApiTable
                lang={lang}
                models={api_models}
                inputTokens={inputTokens}
                outputTokens={outputTokens}
                jpyRate={jpy_rate}
              />
              <div className="note-box">{tRich("apiNote", lang)}</div>
            </>
          )}

          {/* サブスク テーブル */}
          {tab === "sub" && (
            <>
              <SubTable lang={lang} tools={sub_tools} jpyRate={jpy_rate} />
              <div className="note-box info">{tRich("subNote", lang)}</div>
            </>
          )}
        </div>

        <MathSection lang={lang} jpyRate={jpy_rate} />

        <RefLinks lang={lang} />

        {/* 免責事項 */}
        <div className="disclaimer-box">{tRich("disclaimer", lang)}</div>
      </div>

      <footer>
        <span>
          {t("footerSummary", lang)
            .replace("{date}", data.generated_at.slice(0, 10))
            .replace("{jpy}", jpy_rate.toFixed(0))}
        </span>
        <span>{t("footerFormula", lang)}</span>
      </footer>
    </>
  );
}
