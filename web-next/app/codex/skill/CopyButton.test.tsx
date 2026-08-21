// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CopyButton from "./CopyButton";
import styles from "./page.module.css";

describe("/codex/skill — CopyButton", () => {
  const originalClipboard = navigator.clipboard;

  /** navigator.clipboard は jsdom に無いため、writeText をスタブして注入する。 */
  const installClipboard = (writeText: () => Promise<void>) => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      configurable: true,
    });
  });

  it("クリックでテキストをコピーし 2 秒後に表示が戻る", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    installClipboard(writeText);
    render(<CopyButton text="pnpm install" />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Copy");
    expect(button.getAttribute("aria-label")).toBe("コードをコピー");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(writeText).toHaveBeenCalledWith("pnpm install");
    expect(button).toHaveTextContent("Copied!");
    expect(button.getAttribute("aria-label")).toBe("コピー完了");
    expect(button.classList.contains(styles.copied)).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(button).toHaveTextContent("Copy");
    expect(button.classList.contains(styles.copied)).toBe(false);
  });

  it("連続クリックではタイマーが張り直される", async () => {
    installClipboard(vi.fn().mockResolvedValue(undefined));
    render(<CopyButton text="x" />);
    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });
    await act(async () => {
      vi.advanceTimersByTime(1500);
      fireEvent.click(button);
    });

    // 1 回目のタイマーが生きていると、ここ（初回から 2000ms）で Copy に戻ってしまう。
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(button).toHaveTextContent("Copied!");

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    expect(button).toHaveTextContent("Copy");
  });

  it("クリップボードが失敗しても表示は変わらず例外も出さない", async () => {
    installClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    render(<CopyButton text="x" />);
    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(button).toHaveTextContent("Copy");
    expect(button.getAttribute("aria-label")).toBe("コードをコピー");
  });

  it("アンマウント時に保留中のタイマーを破棄する", async () => {
    installClipboard(vi.fn().mockResolvedValue(undefined));
    const clearSpy = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = render(<CopyButton text="x" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    clearSpy.mockClear();
    unmount();

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
