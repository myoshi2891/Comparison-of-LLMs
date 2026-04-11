import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("test environment smoke", () => {
  it("renders a basic element and applies jest-dom matchers", () => {
    render(<p data-testid="hello">hello, vitest</p>);
    const el = screen.getByTestId("hello");
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("hello, vitest");
  });
});
