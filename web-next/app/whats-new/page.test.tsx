/**
 * F-2 契約テスト: What's New ページ（plans/006 §3 Phase 1）。
 *
 * ページの内容は page-registry から静的生成されるため、テストも registry を
 * 参照して「registry の中身がそのまま出ているか」を検証する（ハードコードしない）。
 */
import { render } from "@testing-library/react";
import type { Metadata } from "next";
import { describe, expect, it } from "vitest";
import { byAddedAtDesc, byLastReviewedDesc } from "@/lib/page-registry";
import Page, { metadata } from "./page";

describe("/whats-new page", () => {
  it("h1 に What's New が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("What's New");
  });

  it("新着 / 最近更新の 2 セクションを持つ", () => {
    const { container } = render(<Page />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(2);
    expect(container.textContent).toContain("新着");
    expect(container.textContent).toContain("最近更新");
  });

  it("新着セクションが addedAt 降順の先頭ページを含む", () => {
    const newest = byAddedAtDesc(1)[0];
    const { container } = render(<Page />);
    const links = Array.from(container.querySelectorAll(`a[href="${newest.slug}"]`));
    expect(links.length).toBeGreaterThan(0);
    expect(container.textContent).toContain(newest.title);
    expect(container.textContent).toContain(newest.summary);
  });

  it("最近更新セクションが lastReviewed 降順の先頭ページを含む", () => {
    const freshest = byLastReviewedDesc(1)[0];
    const { container } = render(<Page />);
    expect(container.querySelectorAll(`a[href="${freshest.slug}"]`).length).toBeGreaterThan(0);
  });

  it("日付を機械可読な <time dateTime> で出す", () => {
    const { container } = render(<Page />);
    const times = Array.from(container.querySelectorAll("time"));
    expect(times.length).toBeGreaterThan(0);
    for (const t of times) {
      expect(t.getAttribute("datetime")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("内部リンクが .html を含まない（clean URL）", () => {
    const { container } = render(<Page />);
    for (const link of Array.from(container.querySelectorAll("a[href^='/']"))) {
      expect(link.getAttribute("href")).not.toContain(".html");
    }
  });

  it("外部リンクがあれば rel=noopener noreferrer を持つ", () => {
    const { container } = render(<Page />);
    for (const link of Array.from(container.querySelectorAll("a[target='_blank']"))) {
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("metadata が export されている", () => {
    const meta = metadata as Metadata;
    expect(typeof meta.title).toBe("string");
    expect(meta.title).toContain("What's New");
    expect(typeof meta.description).toBe("string");
  });
});
