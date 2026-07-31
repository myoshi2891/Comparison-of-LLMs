import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SidebarToggle from "./SidebarToggle";
import styles from "./page.module.css";

describe("SidebarToggle component", () => {
  it("toggles aria-expanded, aria-label, and sidebarOpen class", () => {
    const sidebar = document.createElement("div");
    sidebar.className = styles.sidebar;
    sidebar.id = "foundry-intermediate-sidebar";
    const tocLink = document.createElement("a");
    tocLink.href = "#sec-1";
    sidebar.appendChild(tocLink);
    document.body.appendChild(sidebar);

    render(<SidebarToggle />);
    const button = screen.getByRole("button", { name: "目次を開く" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "foundry-intermediate-sidebar");

    // Click to open
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button.getAttribute("aria-label")).toBe("目次を閉じる");
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(true);

    // Click TOC link to close
    fireEvent.click(tocLink);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(false);

    document.body.removeChild(sidebar);
  });
});
