/**
 * HomePage 統合テスト（Phase 12）。
 *
 * 設計書: docs/NEXTJS_INTEGRATION_TEST_DESIGN.md
 *
 * 観点: 単体の契約（HomePage.test.tsx が担当）ではなく、
 *       ユーザー操作に応じた複数コンポーネント間の state 連鎖を検証する。
 *       目的は機能パリティ保証（Phase 11 の視覚パリティと相補的）。
 *
 * インタラクションは既存テストと統一するため fireEvent を採用（依存追加なし）。
 * 期待値は lib/cost の純粋関数を再利用して独立算出し、DOM 出力と突合する。
 */

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "@/components/HomePage";
import { SCENARIOS } from "@/components/ScenarioSelector";
import { calcApiCost, fmtJPY, fmtUSD, PERIODS } from "@/lib/cost";
import { edgePricing, fullPricing, minimalPricing } from "@/tests/fixtures/pricing";

/** 1h 列のインデックス（PERIODS 配列順に依存） */
const IDX_1H = PERIODS.findIndex((p) => p.key === "1h");
/** 30d 列のインデックス（最安行判定列） */
const IDX_30D = PERIODS.findIndex((p) => p.key === "30d");

// ---------------------------------------------------------------------------
// 1. 言語切替
// ---------------------------------------------------------------------------

describe("HomePage integration - language switching", () => {
  it("clicking EN toggle → tab buttons switch to English labels", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);
    // 初期状態: JA
    const tabsBefore = container.querySelectorAll(".tab-btn");
    expect(tabsBefore[0]?.textContent).toContain("API モデル");
    expect(tabsBefore[1]?.textContent).toContain("コーディングツール");

    // EN クリック
    const enBtn = container.querySelector(".lang-btn.en");
    expect(enBtn).not.toBeNull();
    fireEvent.click(enBtn as Element);

    const tabsAfter = container.querySelectorAll(".tab-btn");
    expect(tabsAfter[0]?.textContent).toContain("API Models");
    expect(tabsAfter[1]?.textContent).toContain("Coding Tools");
  });

  it("clicking EN toggle → ApiTable column header switches to English", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);
    const panel = container.querySelector("#tabpanel-api");
    expect(panel?.textContent).toContain("モデル"); // colModel JA
    expect(panel?.textContent).toContain("1 時間"); // col1h JA

    fireEvent.click(container.querySelector(".lang-btn.en") as Element);

    const panelEn = container.querySelector("#tabpanel-api");
    expect(panelEn?.textContent).toContain("Model");
    expect(panelEn?.textContent).toContain("1 Hour");
    // JA ラベルが消えていること（"モデル" は "Model" に置換されただけではなく痕跡が残らない）
    expect(panelEn?.textContent).not.toContain("1 時間");
  });

  it("clicking EN toggle → footer switches JPY suffix (円 → JPY)", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);
    expect(container.querySelector("footer")?.textContent).toContain("円");

    fireEvent.click(container.querySelector(".lang-btn.en") as Element);

    const footer = container.querySelector("footer");
    expect(footer?.textContent).not.toContain("円");
    expect(footer?.textContent).toContain("JPY");
  });

  it("toggle JA → EN → JA restores original tab label", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);
    fireEvent.click(container.querySelector(".lang-btn.en") as Element);
    fireEvent.click(container.querySelector(".lang-btn.ja") as Element);

    const tabs = container.querySelectorAll(".tab-btn");
    expect(tabs[0]?.textContent).toContain("API モデル");
    expect(tabs[1]?.textContent).toContain("コーディングツール");
  });

  it("active lang button reflects current state", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);
    expect(container.querySelector(".lang-btn.ja")?.className).toContain("active");
    expect(container.querySelector(".lang-btn.en")?.className).not.toContain("active");

    fireEvent.click(container.querySelector(".lang-btn.en") as Element);
    expect(container.querySelector(".lang-btn.en")?.className).toContain("active");
    expect(container.querySelector(".lang-btn.ja")?.className).not.toContain("active");
  });
});

// ---------------------------------------------------------------------------
// 2. タブ切替（API ↔ Sub）
// ---------------------------------------------------------------------------

describe("HomePage integration - tab switching", () => {
  it("clicking Sub tab → ApiTable unmounts and SubTable mounts", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);
    expect(container.querySelector("#tabpanel-api")).not.toBeNull();
    expect(container.querySelector("#tabpanel-sub")).toBeNull();

    const subTab = container.querySelectorAll(".tab-btn")[1];
    fireEvent.click(subTab);

    expect(container.querySelector("#tabpanel-api")).toBeNull();
    expect(container.querySelector("#tabpanel-sub")).not.toBeNull();
    // Sub タブ特有の note-box (.info modifier) が表示される
    expect(container.querySelector("#tabpanel-sub .note-box.info")).not.toBeNull();
  });

  it("API → Sub → API remounts ApiTable", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);
    const [apiTab, subTab] = Array.from(container.querySelectorAll(".tab-btn"));
    fireEvent.click(subTab);
    fireEvent.click(apiTab);

    const panel = container.querySelector("#tabpanel-api");
    expect(panel).not.toBeNull();
    // フィクスチャの API モデル名が再描画されている
    expect(panel?.textContent).toContain("GPT-4o");
  });

  it("SubTable displays fixture sub tools after switching to Sub tab", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);
    fireEvent.click(container.querySelectorAll(".tab-btn")[1]);

    const panel = container.querySelector("#tabpanel-sub");
    expect(panel?.textContent).toContain("Cursor");
    expect(panel?.textContent).toContain("GitHub Copilot");
  });
});

// ---------------------------------------------------------------------------
// 3. シナリオ選択（state が ApiTable まで伝播）
// ---------------------------------------------------------------------------

describe("HomePage integration - scenario selection", () => {
  it("clicking sc_light → ApiTable 1h cell reflects light scenario cost", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);

    // シナリオボタンは .scenarios 内の nano/light/standard/heavy/agentic/custom
    const scBtns = container.querySelectorAll(".scenarios .scenario-btn");
    const lightBtn = scBtns[1]; // SCENARIO_ORDER: nano, light, ...
    expect(lightBtn?.textContent).toContain("Light");
    fireEvent.click(lightBtn);

    // GPT-4o（1 行目モデル）の 1h セルを取得
    // 行構造: group-header, model row, group-header, model row, model row
    // providers ordered by fixture: OpenAI, Anthropic, Anthropic
    const panel = container.querySelector("#tabpanel-api");
    expect(panel).not.toBeNull();
    const rows = panel?.querySelectorAll("tbody tr") ?? [];
    // 1 行目は group-header, 2 行目が GPT-4o 本体行
    const gpt4oRow = rows[1];
    expect(gpt4oRow?.textContent).toContain("GPT-4o");

    // 期待 USD = calcApiCost(2.5, 10, 50000, 15000, 1)
    const expectedUsd = calcApiCost(
      2.5,
      10,
      SCENARIOS.light.input,
      SCENARIOS.light.output,
      PERIODS[IDX_1H].hours
    );
    const usdText = fmtUSD(expectedUsd);
    // 1h セル = model セル直後の td
    const cells = gpt4oRow?.querySelectorAll("td") ?? [];
    const cell1h = cells[1];
    expect(cell1h?.textContent).toContain(usdText);
  });

  it("active scenario button reflects current state", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);
    const scBtns = container.querySelectorAll(".scenarios .scenario-btn");
    // 初期は standard (3 番目、index 2) が active
    expect(scBtns[2]?.className).toContain("active");
    expect(scBtns[1]?.className).not.toContain("active");

    fireEvent.click(scBtns[1]); // light
    expect(scBtns[1]?.className).toContain("active");
    expect(scBtns[2]?.className).not.toContain("active");
  });

  it("selecting custom scenario exposes number input and recompute happens on change", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);
    const scBtns = container.querySelectorAll(".scenarios .scenario-btn");
    const customBtn = scBtns[5];
    fireEvent.click(customBtn);

    // カスタム入力パネルが表示される
    const customPanel = container.querySelector(".custom-panel");
    expect(customPanel).not.toBeNull();

    // type="number" の input（最初の 1 つ = input tokens）
    const numberInputs = container.querySelectorAll(".custom-panel input[type='number']");
    expect(numberInputs.length).toBe(2);

    // 入力トークン数を 100,000 に変更（SCENARIOS.custom.input=150000 から変化させる）
    const newInput = 100_000;
    fireEvent.change(numberInputs[0], { target: { value: String(newInput) } });

    // ApiTable の GPT-4o 行 1h 列が再計算されている
    const expectedUsd = calcApiCost(
      2.5,
      10,
      newInput,
      SCENARIOS.custom.output,
      PERIODS[IDX_1H].hours
    );
    const rows = container.querySelectorAll("#tabpanel-api tbody tr");
    const cells = rows[1]?.querySelectorAll("td") ?? [];
    expect(cells[1]?.textContent).toContain(fmtUSD(expectedUsd));
  });
});

// ---------------------------------------------------------------------------
// 4. 言語 × タブ / ソート × 言語 の独立性
// ---------------------------------------------------------------------------

describe("HomePage integration - cross-state independence", () => {
  it("switching to EN then Sub tab → Sub column headers are English", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);
    fireEvent.click(container.querySelector(".lang-btn.en") as Element);
    fireEvent.click(container.querySelectorAll(".tab-btn")[1]);

    const panel = container.querySelector("#tabpanel-sub");
    expect(panel?.textContent).toContain("Tool / Plan"); // colTool EN
    expect(panel?.textContent).toContain("30 Days"); // col30d EN
    // JA ラベル "ツール / プラン" は残っていない
    expect(panel?.textContent).not.toContain("ツール / プラン");
  });

  it("sorting ApiTable, then switching language preserves sort state", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);
    // 1h 列のソートボタン（thead の 2 番目の th 内のボタン = col1h）
    const sortButtons = container.querySelectorAll("#tabpanel-api thead th button");
    expect(sortButtons.length).toBe(PERIODS.length);
    fireEvent.click(sortButtons[0]); // col1h asc

    const thsBefore = container.querySelectorAll("#tabpanel-api thead th");
    // 1 番目は model 列（非ソート）、2 番目以降が PERIODS 列
    expect(thsBefore[1]?.getAttribute("aria-sort")).toBe("ascending");

    // 言語切替（ApiTable は再マウントされないため state は保持される想定）
    fireEvent.click(container.querySelector(".lang-btn.en") as Element);

    const thsAfter = container.querySelectorAll("#tabpanel-api thead th");
    expect(thsAfter[1]?.getAttribute("aria-sort")).toBe("ascending");
  });

  it("tab round-trip resets ApiTable sort state (remount clears useState)", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);
    const sortButtons = container.querySelectorAll("#tabpanel-api thead th button");
    fireEvent.click(sortButtons[0]); // col1h asc
    expect(container.querySelectorAll("#tabpanel-api thead th")[1]?.getAttribute("aria-sort")).toBe(
      "ascending"
    );

    // Sub → API（ApiTable アンマウント → 再マウント）
    const [apiTab, subTab] = Array.from(container.querySelectorAll(".tab-btn"));
    fireEvent.click(subTab);
    fireEvent.click(apiTab);

    expect(container.querySelectorAll("#tabpanel-api thead th")[1]?.getAttribute("aria-sort")).toBe(
      "none"
    );
  });
});

// ---------------------------------------------------------------------------
// 5. データ耐性（実データ・エッジケース）
// ---------------------------------------------------------------------------

describe("HomePage integration - data handling", () => {
  it("full pricing.json → HomePage renders without throwing and produces rows", () => {
    const data = fullPricing();
    expect(data.api_models.length).toBeGreaterThan(0);
    expect(data.sub_tools.length).toBeGreaterThan(0);

    const { container } = render(<HomePage data={data} />);
    // API タブにモデル行が描画されている（件数は実データ依存なので > 0 のみ検証）
    const apiRows = container.querySelectorAll("#tabpanel-api tbody tr");
    expect(apiRows.length).toBeGreaterThan(0);

    // Sub タブに切替しても描画可能
    fireEvent.click(container.querySelectorAll(".tab-btn")[1]);
    const subRows = container.querySelectorAll("#tabpanel-sub tbody tr");
    expect(subRows.length).toBeGreaterThan(0);
  });

  it("edgePricing (jpy_rate=0) → DualCell shows ¥— and footer shows — 円", () => {
    const { container } = render(<HomePage data={edgePricing()} />);
    // 少なくとも 1 つの .cost-jpy が ¥— を表示する
    const jpySpans = container.querySelectorAll("#tabpanel-api .cost-jpy");
    expect(jpySpans.length).toBeGreaterThan(0);
    for (const span of jpySpans) {
      expect(span.textContent).toBe("¥—");
    }

    // footer: "1 USD = — 円" のプレースホルダ置換を確認
    const footer = container.querySelector("footer");
    expect(footer?.textContent).toContain("— 円");
  });

  it("edgePricing (price=0) → USD cell shows $0.00 without crashing", () => {
    const { container } = render(<HomePage data={edgePricing()} />);
    const usdSpan = container.querySelector("#tabpanel-api .cost-usd");
    expect(usdSpan?.textContent).toBe("$0.00");
  });

  it("minimalPricing → cheapest 30d API row receives .cheapest-row class", () => {
    const { container } = render(<HomePage data={minimalPricing()} />);

    // 独立算出: フィクスチャ 3 モデルの 30d コストを計算し最小を特定
    const models = minimalPricing().api_models;
    const scn = SCENARIOS.standard;
    const cost30d = models.map((m) =>
      calcApiCost(m.price_in, m.price_out, scn.input, scn.output, PERIODS[IDX_30D].hours)
    );
    const minIdx = cost30d.indexOf(Math.min(...cost30d));
    const expectedCheapName = models[minIdx].name;

    const cheapestRow = container.querySelector("#tabpanel-api tr.cheapest-row");
    expect(cheapestRow).not.toBeNull();
    expect(cheapestRow?.textContent).toContain(expectedCheapName);
    expect(cheapestRow?.querySelector(".cheapest-badge")).not.toBeNull();
  });

  it("SubTable row content includes monthly cost formatted via fmtUSD/fmtJPY", () => {
    const data = minimalPricing();
    const { container } = render(<HomePage data={data} />);
    fireEvent.click(container.querySelectorAll(".tab-btn")[1]);

    // Cursor Pro の月額 = $20/mo、jpy_rate=150 → ¥3,000
    const panel = container.querySelector("#tabpanel-sub");
    expect(panel?.textContent).toContain(fmtUSD(20));
    expect(panel?.textContent).toContain(fmtJPY(20, data.jpy_rate));
  });
});
