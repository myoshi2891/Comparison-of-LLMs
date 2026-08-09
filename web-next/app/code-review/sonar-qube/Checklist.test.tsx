import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import Checklist from "./Checklist";
import styles from "./page.module.css";

/**
 * SonarQube ガイドの導入チェックリスト。各項目の開閉状態は React state で保持され、
 * 完了数カウンタと全完了スタイルへ反映される。
 */
describe("SonarQube guide Checklist", () => {
  afterEach(() => {
    cleanup();
  });

  test("renders every checklist item unchecked with a zeroed counter", () => {
    const { container } = render(<Checklist />);
    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes).toHaveLength(12);
    expect(checkboxes.every((box) => (box as HTMLInputElement).checked)).toBe(false);
    expect(container.textContent).toContain("0 / 12 完了");
  });

  test("checking an item updates the counter and the list item style", () => {
    const { container } = render(<Checklist />);
    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);

    expect((checkboxes[0] as HTMLInputElement).checked).toBe(true);
    expect(container.textContent).toContain("1 / 12 完了");
    expect((checkboxes[0].closest("li") as HTMLElement).classList.contains(styles.checkedLi)).toBe(
      true
    );
  });

  test("unchecking an item reverts the counter", () => {
    const { container } = render(<Checklist />);
    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[0]);

    expect((checkboxes[0] as HTMLInputElement).checked).toBe(false);
    expect(container.textContent).toContain("0 / 12 完了");
    expect((checkboxes[0].closest("li") as HTMLElement).classList.contains(styles.checkedLi)).toBe(
      false
    );
  });

  test("checking every item applies the all-done counter style", () => {
    const { container } = render(<Checklist />);
    const checkboxes = screen.getAllByRole("checkbox");

    for (const box of checkboxes) {
      fireEvent.click(box);
    }

    const counter = container.querySelector(`.${styles.checklistCounter}`) as HTMLElement;
    expect(container.textContent).toContain("12 / 12 完了");
    expect(counter.classList.contains(styles.allDone)).toBe(true);
  });

  test("counter has no all-done style while items remain", () => {
    const { container } = render(<Checklist />);
    const counter = container.querySelector(`.${styles.checklistCounter}`) as HTMLElement;
    expect(counter.classList.contains(styles.allDone)).toBe(false);
  });
});
