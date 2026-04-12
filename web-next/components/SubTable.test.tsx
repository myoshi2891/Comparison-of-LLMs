/**
 * SubTable 契約テスト。
 *
 * Server Component: 完全に presentational、副作用なし、props は serializable。
 *
 * カバレッジ:
 * - .table-wrap > table > thead/tbody 構造
 * - thead 8 列 (colTool + 7 期間)
 * - グループ変更時の .group-header 行挿入
 * - ツール行の model-cell 構造 (group — name / mStr / tag / note)
 * - monthly === 0 のとき mStr = "FREE"
 * - annual 設定時の "| 年払 $x/mo (¥y)" 表記
 * - 12mo 列の annualNote 判定 (annual < monthly*12)
 * - DualCell が各期間セルに挿入される
 * - JA/EN 切替 (colTool / annualLabel / note)
 * - 静的検査: ソース先頭に "use client" が無い (Server Component)
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SubTable } from "@/components/SubTable";
import type { SubTool } from "@/types/pricing";

const sampleTools: SubTool[] = [
  {
    group: "GitHub Copilot",
    name: "Pro",
    monthly: 10,
    annual: 8,
    tag: "PRO",
    cls: "std",
    note_ja: "月額固定",
    note_en: "Monthly fixed",
    scrape_status: "success",
  },
  {
    group: "GitHub Copilot",
    name: "Free",
    monthly: 0,
    annual: null,
    tag: "FREE",
    cls: "std",
    note_ja: "無料枠あり",
    note_en: "Free tier available",
    scrape_status: "success",
  },
  {
    group: "Cursor",
    name: "Pro",
    monthly: 20,
    annual: null,
    tag: "PRO",
    cls: "std",
    note_ja: "クレジット制",
    note_en: "Credit-based",
    scrape_status: "success",
  },
];

describe("SubTable - root structure", () => {
  it("renders .table-wrap > table with thead and tbody", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    expect(container.querySelector(".table-wrap")).not.toBeNull();
    expect(container.querySelector(".table-wrap table")).not.toBeNull();
    expect(container.querySelector("thead")).not.toBeNull();
    expect(container.querySelector("tbody")).not.toBeNull();
  });

  it("renders thead with 8 columns (tool + 7 periods)", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    const headerCells = container.querySelectorAll("thead th");
    expect(headerCells.length).toBe(8);
  });

  it("first thead column is colTool (Japanese)", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    const firstTh = container.querySelector("thead th");
    expect(firstTh?.textContent).toContain("ツール / プラン");
  });

  it("first thead column is colTool (English)", () => {
    const { container } = render(<SubTable lang="en" tools={sampleTools} jpyRate={150} />);
    const firstTh = container.querySelector("thead th");
    expect(firstTh?.textContent).toContain("Tool / Plan");
  });
});

describe("SubTable - group header rows", () => {
  it("inserts a .group-header row when group changes", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    const groupHeaders = container.querySelectorAll("tr.group-header");
    // GitHub Copilot と Cursor の 2 グループ
    expect(groupHeaders.length).toBe(2);
  });

  it("group-header displays the group name with leading bullet", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    const groupHeaders = container.querySelectorAll("tr.group-header td");
    expect(groupHeaders[0]?.textContent).toContain("GitHub Copilot");
    expect(groupHeaders[0]?.textContent).toContain("●");
    expect(groupHeaders[1]?.textContent).toContain("Cursor");
  });

  it("does NOT insert a group-header when the next tool is in the same group", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    // GitHub Copilot グループは 2 ツールあるが group-header は 1 つだけ
    const copilotHeaders = Array.from(container.querySelectorAll("tr.group-header td")).filter(
      (el) => el.textContent?.includes("GitHub Copilot")
    );
    expect(copilotHeaders.length).toBe(1);
  });
});

describe("SubTable - tool rows", () => {
  it("renders 3 data rows (excluding group headers)", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    const allRows = container.querySelectorAll("tbody tr");
    const dataRows = Array.from(allRows).filter((r) => !r.classList.contains("group-header"));
    expect(dataRows.length).toBe(3);
  });

  it("model-cell shows 'group — name' format", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    const modelNames = container.querySelectorAll(".model-name");
    expect(modelNames[0]?.textContent).toContain("GitHub Copilot — Pro");
    expect(modelNames[1]?.textContent).toContain("GitHub Copilot — Free");
    expect(modelNames[2]?.textContent).toContain("Cursor — Pro");
  });

  it("FREE tool shows 'FREE' in model-sub (monthly === 0)", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    const rows = container.querySelectorAll("tbody tr");
    // 2 番目のデータ行 = Free (index 2: [group, Pro-row, Free-row])
    const freeRow = Array.from(rows).find((r) =>
      r.querySelector(".model-name")?.textContent?.includes("GitHub Copilot — Free")
    );
    expect(freeRow?.querySelector(".model-sub")?.textContent).toContain("FREE");
  });

  it("paid tool shows '$10.00/mo (¥1,500)' format", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    const rows = container.querySelectorAll("tbody tr");
    const proRow = Array.from(rows).find((r) =>
      r.querySelector(".model-name")?.textContent?.includes("GitHub Copilot — Pro")
    );
    expect(proRow?.querySelector(".model-sub")?.textContent).toContain("$10.00/mo");
    expect(proRow?.querySelector(".model-sub")?.textContent).toContain("¥1,500");
  });

  it("paid tool with annual shows '| 年払 $8.00/yr (¥1,200)' in ja", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    const rows = container.querySelectorAll("tbody tr");
    const proRow = Array.from(rows).find((r) =>
      r.querySelector(".model-name")?.textContent?.includes("GitHub Copilot — Pro")
    );
    const subText = proRow?.querySelector(".model-sub")?.textContent ?? "";
    expect(subText).toContain("年払");
    expect(subText).toContain("$8.00/yr");
  });

  it("paid tool with annual shows 'Annual' in en", () => {
    const { container } = render(<SubTable lang="en" tools={sampleTools} jpyRate={150} />);
    const rows = container.querySelectorAll("tbody tr");
    const proRow = Array.from(rows).find((r) =>
      r.querySelector(".model-name")?.textContent?.includes("GitHub Copilot — Pro")
    );
    expect(proRow?.querySelector(".model-sub")?.textContent).toContain("Annual");
  });

  it("displays model-tag with cls class", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    const tags = container.querySelectorAll(".model-tag");
    expect(tags.length).toBeGreaterThanOrEqual(3);
    tags.forEach((t) => {
      expect(t.className).toContain("std");
    });
  });

  it("displays note_ja in ja mode", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    expect(container.textContent).toContain("月額固定");
    expect(container.textContent).toContain("無料枠あり");
  });

  it("displays note_en in en mode", () => {
    const { container } = render(<SubTable lang="en" tools={sampleTools} jpyRate={150} />);
    expect(container.textContent).toContain("Monthly fixed");
    expect(container.textContent).toContain("Credit-based");
  });
});

describe("SubTable - DualCell period cells", () => {
  it("renders DualCell in each of 7 period columns per data row", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    // 3 data rows × 7 period cells = 21 DualCell instances
    const cells = container.querySelectorAll("tbody tr:not(.group-header) .cost-wrap");
    expect(cells.length).toBe(21);
  });

  it("12mo column uses annual price when annual < monthly*12", () => {
    // GitHub Copilot Pro: monthly=10 → 12mo normal = 120
    // annual=8 → annual < 10*12 (120 > 8) → annual wins
    // calcSubCost では annual != null なら annual を返す → 8
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    const rows = container.querySelectorAll("tbody tr");
    const proRow = Array.from(rows).find((r) =>
      r.querySelector(".model-name")?.textContent?.includes("GitHub Copilot — Pro")
    );
    const cells = proRow?.querySelectorAll("td .cost-wrap");
    // 1 番目はモデル列、2-8 番目が期間セル
    // 最後のセル (12mo) が年払い値 $8 のフォーマット
    const lastPeriodCell = cells?.[cells.length - 1];
    expect(lastPeriodCell?.textContent).toContain("$8.00");
  });

  it("shows annual-note string in the 12mo column when annual<monthly*12", () => {
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    // GitHub Copilot Pro の行の 12mo セルに .sub-flat (annualNote) が存在する
    const rows = container.querySelectorAll("tbody tr");
    const proRow = Array.from(rows).find((r) =>
      r.querySelector(".model-name")?.textContent?.includes("GitHub Copilot — Pro")
    );
    const annualNoteEls = proRow?.querySelectorAll(".sub-flat") ?? [];
    // 12mo 列のみ 1 件存在する
    expect(annualNoteEls.length).toBeGreaterThanOrEqual(1);
    expect(annualNoteEls[annualNoteEls.length - 1]?.textContent).toContain("年払");
  });

  it("does NOT show annual-note when annual is null", () => {
    // Cursor Pro は annual=null → annualNote 無し
    const { container } = render(<SubTable lang="ja" tools={sampleTools} jpyRate={150} />);
    const rows = container.querySelectorAll("tbody tr");
    const cursorRow = Array.from(rows).find((r) =>
      r.querySelector(".model-name")?.textContent?.includes("Cursor — Pro")
    );
    const annualNoteEls = cursorRow?.querySelectorAll(".sub-flat") ?? [];
    expect(annualNoteEls.length).toBe(0);
  });
});

describe("SubTable - static source safety", () => {
  it("source does not declare 'use client' (Server Component)", () => {
    const source = readFileSync(join(__dirname, "SubTable.tsx"), "utf8");
    const head = source.slice(0, 200);
    expect(head).not.toMatch(/["']use client["']/);
  });
});
