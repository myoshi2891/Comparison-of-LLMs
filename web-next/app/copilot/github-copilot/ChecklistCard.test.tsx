import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ChecklistCard } from "./ChecklistCard";
import styles from "./page.module.css";

afterEach(() => {
  cleanup();
});

describe("GitHub Copilot ChecklistCard", () => {
  it("renders all 13 checklist items unchecked by default", () => {
    render(<ChecklistCard />);
    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes).toHaveLength(13);
    expect(checkboxes.every((checkbox) => !(checkbox as HTMLInputElement).checked)).toBe(true);
  });

  it("checks and unchecks an item while toggling checked styles", () => {
    render(<ChecklistCard />);
    const checkbox = screen.getAllByRole("checkbox")[0];
    const row = checkbox.closest("li") as HTMLElement;

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(row).toHaveClass(styles.checkedItem);

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(row).not.toHaveClass(styles.checkedItem);
  });
});
