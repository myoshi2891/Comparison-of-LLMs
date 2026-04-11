/**
 * LanguageToggle 契約テスト。
 *
 * - JA/EN の 2 ボタンを描画
 * - アクティブ側に "active" クラスが付く
 * - onToggle は選択された lang を引数に呼ばれる
 * - Client Component 用途（useState を持つ親からコールバック受領）
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LanguageToggle } from "@/components/LanguageToggle";

describe("LanguageToggle - rendering", () => {
  it("renders JA and EN buttons with the .lang-btn base class", () => {
    render(<LanguageToggle lang="ja" onToggle={vi.fn()} />);
    const ja = screen.getByRole("button", { name: "JA" });
    const en = screen.getByRole("button", { name: "EN" });
    expect(ja.className).toContain("lang-btn");
    expect(en.className).toContain("lang-btn");
  });

  it("wraps buttons in .lang-toggle container", () => {
    const { container } = render(<LanguageToggle lang="ja" onToggle={vi.fn()} />);
    expect(container.querySelector(".lang-toggle")).not.toBeNull();
  });
});

describe("LanguageToggle - active state", () => {
  it("marks JA button active when lang=ja", () => {
    render(<LanguageToggle lang="ja" onToggle={vi.fn()} />);
    const ja = screen.getByRole("button", { name: "JA" });
    const en = screen.getByRole("button", { name: "EN" });
    expect(ja.className).toContain("active");
    expect(en.className).not.toContain("active");
  });

  it("marks EN button active when lang=en", () => {
    render(<LanguageToggle lang="en" onToggle={vi.fn()} />);
    const ja = screen.getByRole("button", { name: "JA" });
    const en = screen.getByRole("button", { name: "EN" });
    expect(en.className).toContain("active");
    expect(ja.className).not.toContain("active");
  });

  it("keeps JA button's stable .ja identifier class", () => {
    render(<LanguageToggle lang="en" onToggle={vi.fn()} />);
    const ja = screen.getByRole("button", { name: "JA" });
    expect(ja.className).toContain("ja");
  });

  it("keeps EN button's stable .en identifier class", () => {
    render(<LanguageToggle lang="ja" onToggle={vi.fn()} />);
    const en = screen.getByRole("button", { name: "EN" });
    expect(en.className).toContain("en");
  });
});

describe("LanguageToggle - callback", () => {
  it("calls onToggle('ja') when JA clicked", () => {
    const onToggle = vi.fn();
    render(<LanguageToggle lang="en" onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button", { name: "JA" }));
    expect(onToggle).toHaveBeenCalledWith("ja");
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("calls onToggle('en') when EN clicked", () => {
    const onToggle = vi.fn();
    render(<LanguageToggle lang="ja" onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(onToggle).toHaveBeenCalledWith("en");
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
