import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Checklist from "@/app/google/agent-harness-engineering/Checklist";
import BestPracticesChecklist from "@/app/google/antigravity-guide/BestPracticesChecklist";
import GeminiMdTabs from "@/app/google/antigravity-guide/GeminiMdTabs";

describe("Checklist", () => {
  it("renders checklist items and allows toggling via click and keydown", () => {
    render(<Checklist />);
    const items = screen.getAllByRole("checkbox");
    expect(items[0].getAttribute("aria-checked")).toBe("false");

    // click to toggle
    fireEvent.click(items[0]);
    expect(items[0].getAttribute("aria-checked")).toBe("true");

    // press Enter to toggle
    fireEvent.keyDown(items[0], { key: "Enter" });
    expect(items[0].getAttribute("aria-checked")).toBe("false");

    // press Space to toggle
    fireEvent.keyDown(items[0], { key: " " });
    expect(items[0].getAttribute("aria-checked")).toBe("true");

    // other key should not toggle
    fireEvent.keyDown(items[0], { key: "Escape" });
    expect(items[0].getAttribute("aria-checked")).toBe("true");
  });
});

describe("GeminiMdTabs", () => {
  it("renders and toggles tabs via click and keyboard", () => {
    render(<GeminiMdTabs />);
    const tabG1 = screen.getByRole("tab", { name: /ベストプラクティス/ });
    const tabG2 = screen.getByRole("tab", { name: /アンチパターン/ });

    expect(tabG1.getAttribute("aria-selected")).toBe("true");

    fireEvent.click(tabG2);
    expect(tabG2.getAttribute("aria-selected")).toBe("true");

    // keydown ArrowLeft on G2 to move to G1
    fireEvent.keyDown(tabG2, { key: "ArrowLeft" });
    expect(tabG1.getAttribute("aria-selected")).toBe("true");

    // keydown ArrowRight on G1 to move to G2
    fireEvent.keyDown(tabG1, { key: "ArrowRight" });
    expect(tabG2.getAttribute("aria-selected")).toBe("true");

    // other key should not toggle
    fireEvent.keyDown(tabG2, { key: "Enter" });
    expect(tabG2.getAttribute("aria-selected")).toBe("true");
  });
});

describe("BestPracticesChecklist", () => {
  it("toggles checklist items on click", () => {
    render(<BestPracticesChecklist />);
    const buttons = screen.getAllByRole("button");

    expect(buttons[0].getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(buttons[0]);
    expect(buttons[0].getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(buttons[0]);
    expect(buttons[0].getAttribute("aria-pressed")).toBe("false");
  });
});
