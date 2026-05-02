import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("/claude/skill-guide-intermediate 契約テスト", () => {
  it("h1 に SKILL.md が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("SKILL.md");
  });

  it("h1 に 中級者完全攻略ガイド が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("中級者完全攻略ガイド");
  });

  it("h2 が 9 本（セクション数と一致）", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("h2").length).toBe(9);
  });

  it("外部リンクに target=_blank と rel=noopener noreferrer が付与されている", () => {
    const { container } = render(<Page />);
    const external = Array.from(container.querySelectorAll('a[target="_blank"]'));
    for (const a of external) {
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("内部リンク（/ 始まり）に .html 拡張子がない", () => {
    const { container } = render(<Page />);
    const internal = Array.from(container.querySelectorAll("a[href]")).filter((a) =>
      (a.getAttribute("href") ?? "").startsWith("/")
    );
    for (const a of internal) {
      expect(a.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });
});
