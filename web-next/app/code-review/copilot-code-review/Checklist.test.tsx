// @vitest-environment jsdom
import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Page from "./page";
// TocObserver がチェック状態を localStorage へ永続化するため、
// 前のテストが残した状態で初期カウンタが 0 / 12 からずれないようにする。
// キーは実装側の定数をそのまま使う（二重管理すると片方の変更で掃除が効かなくなる）。
import { CHECKLIST_STORAGE_KEY } from "./TocObserver";

describe("/code-review/copilot-code-review — Checklist", () => {
  beforeEach(() => {
    localStorage.removeItem(CHECKLIST_STORAGE_KEY);
  });

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
  it("localStorage の保存状態を復元し、カウンターへ反映する", () => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify({ "chk-01": true, "chk-03": true }));

    const { container } = render(<Page />);
    const checkboxes = container.querySelectorAll<HTMLInputElement>(
      '#checklistList input[type="checkbox"]'
    );

    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[0].closest(".check-item")?.classList.contains("done")).toBe(true);
    expect(checkboxes[1].checked).toBe(false);
    expect(checkboxes[2].checked).toBe(true);
    expect(container.querySelector("#checklistProgress")?.textContent?.trim()).toBe("2 / 12 完了");
  });

  it("保存値が壊れていても初期状態で描画する", () => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, "{ not json");

    const { container } = render(<Page />);

    expect(container.querySelector("#checklistProgress")?.textContent?.trim()).toBe("0 / 12 完了");
  });

  it("チェックを外すと done クラスが外れ、localStorage も更新される", () => {
    const { container } = render(<Page />);
    const checkbox = container.querySelector<HTMLInputElement>(
      '#checklistList input[type="checkbox"]'
    ) as HTMLInputElement;

    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(false);
    expect(checkbox.closest(".check-item")?.classList.contains("done")).toBe(false);
    expect(container.querySelector("#checklistProgress")?.textContent?.trim()).toBe("0 / 12 完了");

    const saved = JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY) ?? "{}");
    expect(saved["chk-01"]).toBe(false);
  });

  it("チェックリスト以外の change イベントでは状態を書き換えない", () => {
    const { container } = render(<Page />);
    const list = container.querySelector("#checklistList") as HTMLElement;
    const stray = document.createElement("input");
    stray.type = "checkbox";
    list.appendChild(stray);

    fireEvent.click(stray);

    expect(container.querySelector("#checklistProgress")?.textContent?.trim()).toBe("0 / 12 完了");
    expect(localStorage.getItem(CHECKLIST_STORAGE_KEY)).toBeNull();
  });
});
