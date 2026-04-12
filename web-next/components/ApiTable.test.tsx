/**
 * ApiTable 契約テスト。
 *
 * Client Component: "use client" + useState × 2 で列ソート状態を管理。
 *
 * カバレッジ:
 * - .table-wrap > table > thead/tbody 構造
 * - thead 8 列 (colModel + 7 期間)
 * - 初期状態でソート表示なし
 * - ヘッダクリックで ▲ 表示（昇順）
 * - 同列再クリックで ▼ 表示（降順反転）
 * - 別列クリックで sortDir=1 リセット
 * - 昇順ソートで行順序が変わる
 * - グループヘッダ (.group-header) 挿入
 * - model-cell 構造 (.model-name / .model-sub / .model-tag)
 * - model-sub フォーマット: "$X in / $Y out /1M | ¥A / ¥B"
 * - sub_ja / sub_en 表示
 * - 最安行判定 (.cheapest-row + .cheapest-badge)
 * - DualCell 配線 (.cost-wrap × 7 per row)
 * - ヘッダの title 属性 (a11y)
 * - 静的検査: ソース先頭に "use client" がある (Client Component)
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ApiTable } from "@/components/ApiTable";
import type { ApiModel } from "@/types/pricing";

// --- テストデータ ---
// modelA: 安い (price_in=1, price_out=2) → 30日コストが最小
// modelB: 高い (price_in=10, price_out=20) → 30日コストが最大
// modelC: 中間 (price_in=5, price_out=10) + 別 provider → グループヘッダ検証用
const sampleModels: ApiModel[] = [
  {
    provider: "OpenAI",
    name: "GPT-4o",
    tag: "FLAGSHIP",
    cls: "flag",
    price_in: 1,
    price_out: 2,
    sub_ja: "最新フラッグシップ",
    sub_en: "Latest flagship",
    scrape_status: "success",
  },
  {
    provider: "OpenAI",
    name: "GPT-4o mini",
    tag: "LITE",
    cls: "lite",
    price_in: 10,
    price_out: 20,
    sub_ja: "軽量版",
    sub_en: "Lightweight",
    scrape_status: "success",
  },
  {
    provider: "Anthropic",
    name: "Claude Sonnet",
    tag: "STD",
    cls: "std",
    price_in: 5,
    price_out: 10,
    sub_ja: "標準モデル",
    sub_en: "Standard model",
    scrape_status: "success",
  },
];

// 共通 props
const INPUT_TOKENS = 1000;
const OUTPUT_TOKENS = 1000;
const JPY_RATE = 150;

describe("ApiTable - root structure", () => {
  it("renders .table-wrap > table with thead and tbody", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    expect(container.querySelector(".table-wrap")).not.toBeNull();
    expect(container.querySelector(".table-wrap table")).not.toBeNull();
    expect(container.querySelector("thead")).not.toBeNull();
    expect(container.querySelector("tbody")).not.toBeNull();
  });

  it("renders thead with 8 columns (colModel + 7 periods)", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const headerCells = container.querySelectorAll("thead th");
    expect(headerCells.length).toBe(8);
  });

  it("first thead column is colModel (Japanese)", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const firstTh = container.querySelector("thead th");
    expect(firstTh?.textContent).toContain("モデル");
  });

  it("first thead column is colModel (English)", () => {
    const { container } = render(
      <ApiTable
        lang="en"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const firstTh = container.querySelector("thead th");
    expect(firstTh?.textContent).toContain("Model");
  });
});

describe("ApiTable - sort indicators", () => {
  it("no sort indicator in initial state", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const headerText = container.querySelector("thead")?.textContent ?? "";
    expect(headerText).not.toContain("▲");
    expect(headerText).not.toContain("▼");
  });

  it("shows ▲ on clicked column header (ascending)", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const headers = container.querySelectorAll("thead th");
    // 2 番目のヘッダ (col1h) をクリック
    fireEvent.click(headers[1]);
    expect(headers[1].textContent).toContain("▲");
  });

  it("shows ▼ on same column re-click (descending flip)", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const headers = container.querySelectorAll("thead th");
    fireEvent.click(headers[1]);
    fireEvent.click(headers[1]);
    expect(headers[1].textContent).toContain("▼");
  });

  it("resets to ▲ when clicking a different column", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const headers = container.querySelectorAll("thead th");
    // col1h をクリック → ▲
    fireEvent.click(headers[1]);
    // col8h をクリック → col1h の ▲ 消える、col8h に ▲
    fireEvent.click(headers[2]);
    expect(headers[1].textContent).not.toContain("▲");
    expect(headers[1].textContent).not.toContain("▼");
    expect(headers[2].textContent).toContain("▲");
  });

  it("ascending sort reorders rows by cost", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const headers = container.querySelectorAll("thead th");
    // col1h (index 1) をクリックして昇順ソート
    fireEvent.click(headers[1]);
    const dataRows = Array.from(container.querySelectorAll("tbody tr")).filter(
      (r) => !r.classList.contains("group-header"),
    );
    const names = dataRows.map((r) => r.querySelector(".model-name")?.textContent ?? "");
    // price_in=1/out=2 の GPT-4o が最安 → 先頭
    expect(names[0]).toContain("GPT-4o");
    // price_in=10/out=20 の GPT-4o mini が最高 → 末尾
    expect(names[names.length - 1]).toContain("GPT-4o mini");
  });
});

describe("ApiTable - group header rows", () => {
  it("inserts a .group-header row when provider changes", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const groupHeaders = container.querySelectorAll("tr.group-header");
    // OpenAI と Anthropic の 2 グループ
    expect(groupHeaders.length).toBe(2);
  });

  it("group-header displays provider name with leading bullet", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const groupHeaders = container.querySelectorAll("tr.group-header td");
    expect(groupHeaders[0]?.textContent).toContain("●");
    expect(groupHeaders[0]?.textContent).toContain("OpenAI");
    expect(groupHeaders[1]?.textContent).toContain("Anthropic");
  });

  it("does NOT insert duplicate group-header for same provider", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    // OpenAI は 2 モデルあるが group-header は 1 つだけ
    const openaiHeaders = Array.from(container.querySelectorAll("tr.group-header td")).filter(
      (el) => el.textContent?.includes("OpenAI"),
    );
    expect(openaiHeaders.length).toBe(1);
  });
});

describe("ApiTable - model cell", () => {
  it("displays model name in .model-name", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const names = container.querySelectorAll(".model-name");
    expect(names.length).toBe(3);
    expect(names[0]?.textContent).toContain("GPT-4o");
  });

  it("model-sub shows '$X in / $Y out /1M | ¥A / ¥B' format", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const rows = Array.from(container.querySelectorAll("tbody tr")).filter(
      (r) => !r.classList.contains("group-header"),
    );
    // GPT-4o: price_in=1, price_out=2, jpyRate=150
    const sub = rows[0]?.querySelector(".model-sub")?.textContent ?? "";
    expect(sub).toContain("$1 in");
    expect(sub).toContain("$2 out");
    expect(sub).toContain("/1M");
    expect(sub).toContain("¥150");
    expect(sub).toContain("¥300");
  });

  it("displays .model-tag with cls class", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const tags = container.querySelectorAll(".model-tag");
    expect(tags.length).toBe(3);
    expect(tags[0]?.textContent).toContain("FLAGSHIP");
    expect(tags[0]?.className).toContain("flag");
  });

  it("displays sub_ja in ja mode", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    expect(container.textContent).toContain("最新フラッグシップ");
    expect(container.textContent).toContain("軽量版");
  });

  it("displays sub_en in en mode", () => {
    const { container } = render(
      <ApiTable
        lang="en"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    expect(container.textContent).toContain("Latest flagship");
    expect(container.textContent).toContain("Lightweight");
  });
});

describe("ApiTable - cheapest row", () => {
  it("applies .cheapest-row class to the row with lowest 30-day cost", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const cheapestRows = container.querySelectorAll("tr.cheapest-row");
    expect(cheapestRows.length).toBeGreaterThanOrEqual(1);
    // GPT-4o (price_in=1, price_out=2) が最安
    const cheapestName = cheapestRows[0]?.querySelector(".model-name")?.textContent ?? "";
    expect(cheapestName).toContain("GPT-4o");
    // "GPT-4o mini" ではないことを確認
    expect(cheapestName).not.toContain("mini");
  });

  it("shows .cheapest-badge with cheapestBadge text on cheapest row", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const badge = container.querySelector(".cheapest-badge");
    expect(badge).not.toBeNull();
    expect(badge?.textContent).toContain("最安");
  });

  it("does NOT show .cheapest-badge on non-cheapest rows", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const dataRows = Array.from(container.querySelectorAll("tbody tr")).filter(
      (r) => !r.classList.contains("group-header") && !r.classList.contains("cheapest-row"),
    );
    for (const row of dataRows) {
      expect(row.querySelector(".cheapest-badge")).toBeNull();
    }
  });
});

describe("ApiTable - DualCell period cells", () => {
  it("renders DualCell (.cost-wrap) in each of 7 period columns per data row", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    // 3 data rows × 7 period cells = 21 DualCell instances
    const cells = container.querySelectorAll("tbody tr:not(.group-header) .cost-wrap");
    expect(cells.length).toBe(21);
  });

  it("each data row has exactly 7 .cost-wrap cells", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const dataRows = Array.from(container.querySelectorAll("tbody tr")).filter(
      (r) => !r.classList.contains("group-header"),
    );
    for (const row of dataRows) {
      expect(row.querySelectorAll(".cost-wrap").length).toBe(7);
    }
  });
});

describe("ApiTable - sort title a11y", () => {
  it("period headers have sort title attribute (Japanese)", () => {
    const { container } = render(
      <ApiTable
        lang="ja"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const headers = container.querySelectorAll("thead th");
    // 期間ヘッダ (index 1-7) に title がある
    expect(headers[1]?.getAttribute("title")).toContain("クリックでソート");
  });

  it("period headers have sort title attribute (English)", () => {
    const { container } = render(
      <ApiTable
        lang="en"
        models={sampleModels}
        inputTokens={INPUT_TOKENS}
        outputTokens={OUTPUT_TOKENS}
        jpyRate={JPY_RATE}
      />,
    );
    const headers = container.querySelectorAll("thead th");
    expect(headers[1]?.getAttribute("title")).toContain("Click to sort");
  });
});

describe("ApiTable - static source safety", () => {
  it("source declares 'use client' (Client Component)", () => {
    const source = readFileSync(join(__dirname, "ApiTable.tsx"), "utf8");
    const head = source.slice(0, 200);
    expect(head).toMatch(/["']use client["']/);
  });
});
