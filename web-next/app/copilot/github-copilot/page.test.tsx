import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GithubCopilotPage from "./page";

describe("/copilot/github-copilot", () => {
  it("h1 にページタイトルが表示される", () => {
    const { container } = render(<GithubCopilotPage />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toContain("GitHub Copilot");
    expect(h1?.textContent).toContain("完全ベストプラクティスガイド");
  });

  it("h2 が 10 個存在する（s01–s09 + sources）", () => {
    const { container } = render(<GithubCopilotPage />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s.length).toBe(10);
  });

  it("外部リンクに target=_blank と rel=noopener noreferrer が付いている", () => {
    const { container } = render(<GithubCopilotPage />);
    const extLinks = container.querySelectorAll('a[target="_blank"]');
    expect(extLinks.length).toBeGreaterThan(0);
    for (const link of extLinks) {
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("内部リンクが .html なしの clean URL である", () => {
    const { container } = render(<GithubCopilotPage />);
    const internalLinks = Array.from(container.querySelectorAll("a[href]")).filter((a) => {
      const href = a.getAttribute("href") ?? "";
      return href.startsWith("/") && !href.startsWith("//");
    });
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toMatch(/\.html/);
    }
  });

  it("ヒーローの統計数値が表示される", () => {
    const { container } = render(<GithubCopilotPage />);
    const text = container.textContent ?? "";
    expect(text).toContain("55%");
    expect(text).toContain("コーディング生産性向上");
    expect(text).toContain("75%");
    expect(text).toContain("開発者満足度向上");
  });

  it("s01 概要セクションが存在する", () => {
    const { container } = render(<GithubCopilotPage />);
    expect(container.querySelector("#s01")).toBeTruthy();
    expect(container.querySelector("#s01 h2")?.textContent).toContain("GitHub Copilotとは");
  });

  it("s02 プラン比較セクションが存在する", () => {
    const { container } = render(<GithubCopilotPage />);
    expect(container.querySelector("#s02")).toBeTruthy();
    expect(container.querySelector("#s02 h2")?.textContent).toContain("プラン比較");
  });

  it("s03 セットアップセクションが存在する", () => {
    const { container } = render(<GithubCopilotPage />);
    expect(container.querySelector("#s03")).toBeTruthy();
    expect(container.querySelector("#s03 h2")?.textContent).toContain("セットアップ");
  });

  it("s04 プロンプトセクションが存在する", () => {
    const { container } = render(<GithubCopilotPage />);
    expect(container.querySelector("#s04")).toBeTruthy();
    expect(container.querySelector("#s04 h2")?.textContent).toContain("プロンプト");
  });

  it("s05 主要機能セクションが存在する", () => {
    const { container } = render(<GithubCopilotPage />);
    expect(container.querySelector("#s05")).toBeTruthy();
    expect(container.querySelector("#s05 h2")?.textContent).toContain("主要機能");
  });

  it("s06 ベストプラクティスセクションが存在する", () => {
    const { container } = render(<GithubCopilotPage />);
    expect(container.querySelector("#s06")).toBeTruthy();
    expect(container.querySelector("#s06 h2")?.textContent).toContain("ベストプラクティス");
  });

  it("s07 セキュリティセクションが存在する", () => {
    const { container } = render(<GithubCopilotPage />);
    expect(container.querySelector("#s07")).toBeTruthy();
    expect(container.querySelector("#s07 h2")?.textContent).toContain("セキュリティ");
  });

  it("s08 AIモデルセクションが存在する", () => {
    const { container } = render(<GithubCopilotPage />);
    expect(container.querySelector("#s08")).toBeTruthy();
    expect(container.querySelector("#s08 h2")?.textContent).toContain("AIモデル");
  });

  it("s09 チェックリストセクションが存在する", () => {
    const { container } = render(<GithubCopilotPage />);
    expect(container.querySelector("#s09")).toBeTruthy();
    expect(container.querySelector("#s09 h2")?.textContent).toContain("チェックリスト");
  });

  it("sources セクションが存在し参考ソースが並んでいる", () => {
    const { container } = render(<GithubCopilotPage />);
    expect(container.querySelector("#sources")).toBeTruthy();
    const sourceLinks = container.querySelectorAll("#sources a[target='_blank']");
    expect(sourceLinks.length).toBeGreaterThanOrEqual(10);
  });
});
