/**
 * DualCell 契約テスト。
 *
 * - 2通貨セル（USD 上段 / JPY 下段）の表示と色クラス付与が契約
 * - lib/cost の colorIndex / fmtUSD / fmtJPY と同一結果になること
 * - annualNote が null/undefined のときは要素を描画しないこと
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DualCell } from "@/components/DualCell";

describe("DualCell - root structure", () => {
  it("wraps output in .cost-wrap", () => {
    const { container } = render(<DualCell usd={0.5} jpyRate={150} />);
    expect(container.querySelector(".cost-wrap")).not.toBeNull();
  });
});

describe("DualCell - USD display", () => {
  it("formats USD with fmtUSD() and applies cost-usd + color index class", () => {
    render(<DualCell usd={1.23} jpyRate={150} />);
    // colorIndex(1.23) -> 3 (1 <= v < 5)
    const usd = screen.getByText("$1.23");
    expect(usd.className).toContain("cost-usd");
    expect(usd.className).toContain("cc-3");
  });

  it("uses cc-0 for zero usd", () => {
    render(<DualCell usd={0} jpyRate={150} />);
    const usd = screen.getByText("$0.00");
    expect(usd.className).toContain("cc-0");
  });

  it("uses <$0.01 sentinel for sub-cent values", () => {
    render(<DualCell usd={0.004} jpyRate={150} />);
    expect(screen.getByText("<$0.01")).toBeInTheDocument();
  });
});

describe("DualCell - JPY display", () => {
  it("formats JPY with fmtJPY() and applies jpy- color class matching USD", () => {
    render(<DualCell usd={1} jpyRate={150} />);
    // colorIndex(1) -> 3 (1 <= v < 5)
    const jpy = screen.getByText("¥150");
    expect(jpy.className).toContain("cost-jpy");
    expect(jpy.className).toContain("jpy-3");
  });

  it("returns ¥— sentinel when jpyRate is 0 (rate unknown)", () => {
    render(<DualCell usd={10} jpyRate={0} />);
    expect(screen.getByText("¥—")).toBeInTheDocument();
  });

  it("returns ¥— sentinel when jpyRate is NaN", () => {
    render(<DualCell usd={10} jpyRate={Number.NaN} />);
    expect(screen.getByText("¥—")).toBeInTheDocument();
  });
});

describe("DualCell - annualNote prop", () => {
  it("does not render .sub-flat when annualNote is omitted", () => {
    const { container } = render(<DualCell usd={1} jpyRate={150} />);
    expect(container.querySelector(".sub-flat")).toBeNull();
  });

  it("does not render .sub-flat when annualNote is null", () => {
    const { container } = render(<DualCell usd={1} jpyRate={150} annualNote={null} />);
    expect(container.querySelector(".sub-flat")).toBeNull();
  });

  it("renders annualNote text inside .sub-flat when provided", () => {
    render(<DualCell usd={1} jpyRate={150} annualNote="年払 $199" />);
    const note = screen.getByText("年払 $199");
    expect(note.className).toContain("sub-flat");
  });
});
