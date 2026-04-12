/**
 * Phase 10 - app/page.tsx 静的契約テスト。
 *
 * Server Component であるため render() テストは行わず、
 * readFileSync でソース内容を検査する。
 *
 * カバレッジ:
 * - "use client" が無いこと (Server Component)
 * - parsePricingData を import していること (Zod 検証接続)
 * - HomePage を import していること (Client Component 委譲)
 * - pricing.json を import していること (データソース接続)
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(join(__dirname, "../app/page.tsx"), "utf8");

describe("Phase 10 - page.tsx static contract", () => {
  it("does not declare 'use client' (Server Component)", () => {
    const head = pageSource.slice(0, 200);
    expect(head).not.toMatch(/["']use client["']/);
  });

  it("imports parsePricingData for Zod validation", () => {
    expect(pageSource).toContain("parsePricingData");
  });

  it("imports HomePage client component", () => {
    expect(pageSource).toContain("HomePage");
  });

  it("imports pricing.json as data source", () => {
    expect(pageSource).toMatch(/pricing\.json/);
  });
});
