// @vitest-environment jsdom
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("/code-review/copilot-code-review — Checklist", () => {
  it("チェックボックスをクリックすると checked になり、done クラスが付与されカウンターが更新される", () => {
    const { container } = render(<Page />);
    const checkboxes = container.querySelectorAll<HTMLInputElement>(
      '#checklistList input[type="checkbox"]'
    );
    expect(checkboxes.length).toBe(12);

    const progress = container.querySelector("#checklistProgress");
    expect(progress?.textContent?.trim()).toBe("0 / 12 完了");

    // 1つ目をチェック
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0].checked).toBe(true);
    expect(progress?.textContent?.trim()).toBe("1 / 12 完了");

    const firstItem = checkboxes[0].closest(".check-item");
    expect(firstItem?.classList.contains("done")).toBe(true);

    // リセットボタンをクリック。ボタンが無い場合は if で握りつぶさず落とす
    const resetBtn = container.querySelector("#checklistReset");
    expect(resetBtn).not.toBeNull();
    fireEvent.click(resetBtn as Element);
    expect(checkboxes[0].checked).toBe(false);
    expect(progress?.textContent?.trim()).toBe("0 / 12 完了");
    expect(firstItem?.classList.contains("done")).toBe(false);
  });
});
