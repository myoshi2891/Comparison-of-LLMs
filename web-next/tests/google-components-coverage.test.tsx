import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ExamplesApp from "@/app/google/skill-guide/ExamplesApp";
import Checklist from "@/app/google/agent-harness-engineering/Checklist";
import GeminiMdTabs from "@/app/google/antigravity-guide/GeminiMdTabs";
import ChecklistAppIntermediate from "@/app/google/skill-guide-intermediate/ChecklistApp";
import PatternsApp from "@/app/google/skill-guide-intermediate/PatternsApp";
import StepsApp from "@/app/google/skill-guide/StepsApp";
import BestPracticesChecklist from "@/app/google/antigravity-guide/BestPracticesChecklist";
import ChecklistAppSkillGuide from "@/app/google/skill-guide/ChecklistApp";

describe("ExamplesApp", () => {
  it("renders correctly and allows tab navigation via click and keydown", () => {
    render(<ExamplesApp />);
    const tabBasic = screen.getByRole("tab", { name: /Basic/i });
    const tabRef = screen.getByRole("tab", { name: /Reference/i });

    expect(tabBasic.getAttribute("aria-selected")).toBe("true");
    expect(tabRef.getAttribute("aria-selected")).toBe("false");

    // Click tab
    fireEvent.click(tabRef);
    expect(tabRef.getAttribute("aria-selected")).toBe("true");
    expect(tabBasic.getAttribute("aria-selected")).toBe("false");

    // Keydown tests
    fireEvent.keyDown(tabRef, { key: "ArrowRight" }); // should move to next (Tool Use)
    const tabTool = screen.getByRole("tab", { name: /Tool/i });
    expect(tabTool.getAttribute("aria-selected")).toBe("true");

    fireEvent.keyDown(tabTool, { key: "ArrowLeft" }); // should move back to Reference
    expect(tabRef.getAttribute("aria-selected")).toBe("true");

    fireEvent.keyDown(tabRef, { key: "Home" }); // should move to Basic
    expect(tabBasic.getAttribute("aria-selected")).toBe("true");

    fireEvent.keyDown(tabBasic, { key: "End" }); // should move to All-in-One
    const tabAll = screen.getByRole("tab", { name: /All-in-One/i });
    expect(tabAll.getAttribute("aria-selected")).toBe("true");

    // Other unhandled key
    fireEvent.keyDown(tabAll, { key: "Enter" });
    expect(tabAll.getAttribute("aria-selected")).toBe("true");
  });
});

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

describe("ChecklistAppIntermediate", () => {
  it("toggles checklist items on click", () => {
    render(<ChecklistAppIntermediate />);
    const buttons = screen.getAllByRole("button");
    
    expect(buttons[0].getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(buttons[0]);
    expect(buttons[0].getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(buttons[0]);
    expect(buttons[0].getAttribute("aria-pressed")).toBe("false");
  });
});

describe("PatternsApp", () => {
  it("navigates pattern tabs via click and arrow keys", () => {
    render(<PatternsApp />);
    const tabP1 = screen.getByRole("tab", { name: /Pattern 1/ });
    const tabP2 = screen.getByRole("tab", { name: /Pattern 2/ });

    expect(tabP1.getAttribute("aria-selected")).toBe("true");

    fireEvent.click(tabP2);
    expect(tabP2.getAttribute("aria-selected")).toBe("true");

    // keydown ArrowLeft on P2 to P1
    fireEvent.keyDown(tabP2, { key: "ArrowLeft" });
    expect(tabP1.getAttribute("aria-selected")).toBe("true");

    // keydown ArrowRight on P1 to P2
    fireEvent.keyDown(tabP1, { key: "ArrowRight" });
    expect(tabP2.getAttribute("aria-selected")).toBe("true");

    // other key should not toggle
    fireEvent.keyDown(tabP2, { key: "Enter" });
    expect(tabP2.getAttribute("aria-selected")).toBe("true");
  });
});

describe("StepsApp", () => {
  it("supports step navigation and play/reset controls", () => {
    vi.useFakeTimers();
    render(<StepsApp />);

    const step1Btn = screen.getByRole("button", { name: /1/ });
    const step2Btn = screen.getByRole("button", { name: /2/ });

    expect(step1Btn.getAttribute("aria-current")).toBe("step");

    // Click step 2
    act(() => {
      fireEvent.click(step2Btn);
    });
    expect(step2Btn.getAttribute("aria-current")).toBe("step");

    // Play/Next/Prev/Reset buttons
    const playBtn = screen.getByRole("button", { name: /Play/i });
    const prevBtn = screen.getByRole("button", { name: /Prev/i });
    const nextBtn = screen.getByRole("button", { name: /Next/i });
    const resetBtn = screen.getByRole("button", { name: /Reset/i });

    // step 2 is active, click prev -> should be step 1
    act(() => {
      fireEvent.click(prevBtn);
    });
    expect(step1Btn.getAttribute("aria-current")).toBe("step");

    // click next -> should be step 2
    act(() => {
      fireEvent.click(nextBtn);
    });
    expect(step2Btn.getAttribute("aria-current")).toBe("step");

    // click reset -> should be step 1
    act(() => {
      fireEvent.click(resetBtn);
    });
    expect(step1Btn.getAttribute("aria-current")).toBe("step");

    // Play autoplay simulation
    act(() => {
      fireEvent.click(playBtn);
    });
    // wait 2 seconds (simulate autoplay timer)
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    // should be step 2 now
    expect(step2Btn.getAttribute("aria-current")).toBe("step");

    // advance timers multiple times to reach end and stop playing
    act(() => {
      vi.advanceTimersByTime(2000); // step 3
    });
    act(() => {
      vi.advanceTimersByTime(2000); // step 4
    });
    act(() => {
      vi.advanceTimersByTime(2000); // step 5
    });
    act(() => {
      vi.advanceTimersByTime(2000); // reset to step 1
    });
    expect(step1Btn.getAttribute("aria-current")).toBe("step");

    vi.useRealTimers();
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

describe("ChecklistAppSkillGuide", () => {
  it("toggles and updates completion rate", () => {
    render(<ChecklistAppSkillGuide />);
    const buttons = screen.getAllByRole("button");
    
    // initially 0%
    expect(screen.getByText("0%")).toBeDefined();

    // Toggle first button
    fireEvent.click(buttons[0]);
    expect(screen.queryByText("0%")).toBeNull();

    // Toggle all to 100%
    buttons.forEach((btn) => {
      if (btn.getAttribute("aria-pressed") === "false") {
        fireEvent.click(btn);
      }
    });

    expect(screen.getByText("100%")).toBeDefined();
    expect(screen.getByText(/すべてのチェックが完了しました/)).toBeDefined();
  });
});
