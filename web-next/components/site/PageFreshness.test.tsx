/**
 * F-1b 契約テスト: 鮮度バッジ（最終確認日 / 公開日）。
 *
 * SiteHeader と同じく pathname プロップでテストから現在地を上書きできる設計を固定する。
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { findBySlug } from "@/lib/page-registry";
import { PageFreshness } from "./PageFreshness";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("PageFreshness", () => {
  it("registry に存在するパスで最終確認日を描画する", () => {
    const entry = findBySlug("/claude/skill");
    expect(entry).toBeDefined();

    const { container } = render(<PageFreshness pathname="/claude/skill" />);
    expect(container.textContent).toContain(entry?.lastReviewed);
  });

  it("公開日（addedAt）も描画する", () => {
    const entry = findBySlug("/git-worktree");
    const { container } = render(<PageFreshness pathname="/git-worktree" />);
    expect(container.textContent).toContain(entry?.addedAt);
  });

  it("機械可読な <time dateTime> を出力する", () => {
    const entry = findBySlug("/claude/skill");
    const { container } = render(<PageFreshness pathname="/claude/skill" />);
    const times = Array.from(container.querySelectorAll("time"));
    expect(times.length).toBeGreaterThanOrEqual(2);
    const dateTimes = times.map((t) => t.getAttribute("datetime"));
    expect(dateTimes).toContain(entry?.lastReviewed);
    expect(dateTimes).toContain(entry?.addedAt);
  });

  it("registry に無いパスでは何も描画しない", () => {
    const { container } = render(<PageFreshness pathname="/does/not/exist" />);
    expect(container.firstChild).toBeNull();
  });

  it("末尾スラッシュ付きのパスでも解決する", () => {
    const entry = findBySlug("/claude/skill");
    const { container } = render(<PageFreshness pathname="/claude/skill/" />);
    expect(container.textContent).toContain(entry?.lastReviewed);
  });

  it("ラベルに「最終確認」を含む（読者に鮮度の意味が伝わる）", () => {
    const { container } = render(<PageFreshness pathname="/claude/skill" />);
    expect(container.textContent).toContain("最終確認");
  });
});
