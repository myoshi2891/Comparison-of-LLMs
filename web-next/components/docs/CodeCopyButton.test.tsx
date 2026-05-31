import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CodeCopyButton from "@/components/docs/CodeCopyButton";

describe("CodeCopyButton", () => {
  const writeTextMock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    writeTextMock.mockReset();
    Object.defineProperty(global.navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
      configurable: true,
    });
  });

  it("renders with default copy text and copy icon class", () => {
    render(<CodeCopyButton text="npm run dev" className="my-class" />);
    const button = screen.getByRole("button", { name: "コードをコピー" });
    expect(button.textContent).toBe("コピー");
    expect(button.className).toBe("my-class");
    expect(button.querySelector(".ti-copy")).not.toBeNull();
  });

  it("copies text and updates label on click, then reverts after timeout", async () => {
    writeTextMock.mockResolvedValue(undefined);
    render(<CodeCopyButton text="npm run dev" />);
    const button = screen.getByRole("button", { name: "コードをコピー" });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(writeTextMock).toHaveBeenCalledWith("npm run dev");
    expect(button.textContent).toBe("コピー完了");
    expect(button.querySelector(".ti-check")).not.toBeNull();
    expect(button.getAttribute("aria-label")).toBe("コピーしました");

    // Fast-forward time by 2 seconds
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(button.textContent).toBe("コピー");
    expect(button.querySelector(".ti-copy")).not.toBeNull();
    expect(button.getAttribute("aria-label")).toBe("コードをコピー");
  });

  it("handles clipboard failures gracefully", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {
      /* mock console.error to avoid test output pollution */
    });
    writeTextMock.mockRejectedValue(new Error("Clipboard error"));
    render(<CodeCopyButton text="npm run dev" />);
    const button = screen.getByRole("button", { name: "コードをコピー" });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(writeTextMock).toHaveBeenCalledWith("npm run dev");
    // Should not change to "copied" status since copy failed
    expect(button.textContent).toBe("コピー");
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
