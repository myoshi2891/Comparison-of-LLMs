import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import InteractiveChecklist from "@/app/claude/self-hosted-sandboxes/InteractiveChecklist";

describe("InteractiveChecklist", () => {
  it("renders checklist items and allows toggling", () => {
    const items = ["Item 1", "Item 2", "Item 3"];
    render(<InteractiveChecklist items={items} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
    expect(checkboxes[0].getAttribute("aria-checked")).toBe("false");
    expect(checkboxes[1].getAttribute("aria-checked")).toBe("false");

    // Click to toggle
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0].getAttribute("aria-checked")).toBe("true");

    // Click again to toggle back
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0].getAttribute("aria-checked")).toBe("false");
  });

  it("reinitializes checkedStates when items prop changes", () => {
    function TestWrapper() {
      const [list, setList] = useState(["A", "B"]);
      return (
        <div>
          <InteractiveChecklist items={list} />
          <button type="button" onClick={() => setList(["C", "D", "E"])}>
            Change Items
          </button>
        </div>
      );
    }

    render(<TestWrapper />);

    const checkboxesBefore = screen.getAllByRole("checkbox");
    expect(checkboxesBefore).toHaveLength(2);

    // Toggle the first checkbox
    fireEvent.click(checkboxesBefore[0]);
    expect(checkboxesBefore[0].getAttribute("aria-checked")).toBe("true");

    // Click button to change items
    const changeBtn = screen.getByRole("button", { name: "Change Items" });
    fireEvent.click(changeBtn);

    // After updating, length should be 3 and all values should be false
    const checkboxesAfter = screen.getAllByRole("checkbox");
    expect(checkboxesAfter).toHaveLength(3);
    expect(checkboxesAfter[0].getAttribute("aria-checked")).toBe("false");
    expect(checkboxesAfter[1].getAttribute("aria-checked")).toBe("false");
    expect(checkboxesAfter[2].getAttribute("aria-checked")).toBe("false");
  });
});
