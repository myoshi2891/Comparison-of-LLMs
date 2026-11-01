import { expect, it } from "vitest";
import { findBySlug } from "@/lib/page-registry";

it("移行確認日を登録し本文の情報基準日と区別する", () => {
  const entry = findBySlug("/claude/models-best-practices");
  expect([entry?.addedAt, entry?.lastReviewed]).toEqual(["2026-11-01", "2026-11-01"]);
});
