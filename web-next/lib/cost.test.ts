import { describe, expect, it } from "vitest";
import { calcApiCost, calcSubCost, colorIndex, fmtJPY, fmtUSD, PERIODS } from "@/lib/cost";

describe("PERIODS", () => {
  it("exports seven time periods from 1h to 12mo", () => {
    expect(PERIODS).toHaveLength(7);
    expect(PERIODS[0]).toEqual({ key: "1h", hours: 1 });
    expect(PERIODS.at(-1)).toEqual({ key: "12mo", hours: 8760 });
  });

  it("has monotonically increasing hours", () => {
    for (let i = 1; i < PERIODS.length; i++) {
      expect(PERIODS[i].hours).toBeGreaterThan(PERIODS[i - 1].hours);
    }
  });
});

describe("calcApiCost", () => {
  it("returns 0 for zero tokens on both sides", () => {
    expect(calcApiCost(5, 25, 0, 0, 1)).toBe(0);
  });

  it("returns 0 for zero hours", () => {
    expect(calcApiCost(5, 25, 1_000_000, 1_000_000, 0)).toBe(0);
  });

  it("computes simple 1M-token-per-hour example", () => {
    // 1M input @ $5 + 1M output @ $25 = $30/hour
    expect(calcApiCost(5, 25, 1_000_000, 1_000_000, 1)).toBeCloseTo(30, 10);
  });

  it("scales linearly with hours", () => {
    const one = calcApiCost(3, 15, 500_000, 500_000, 1);
    const ten = calcApiCost(3, 15, 500_000, 500_000, 10);
    expect(ten).toBeCloseTo(one * 10, 10);
  });

  it("handles free-tier pricing (both prices zero)", () => {
    expect(calcApiCost(0, 0, 10_000_000, 10_000_000, 24)).toBe(0);
  });

  it("handles input-only usage", () => {
    // 2M input @ $3 = $6
    expect(calcApiCost(3, 15, 2_000_000, 0, 1)).toBeCloseTo(6, 10);
  });

  it("handles large-scale annual usage without precision loss", () => {
    // 1B tokens each over 8760h (full year)
    const result = calcApiCost(5, 25, 1_000_000_000, 1_000_000_000, 8760);
    // (1000 * 5 + 1000 * 25) * 8760 = 30000 * 8760 = 262_800_000
    expect(result).toBeCloseTo(262_800_000, 0);
  });
});

describe("calcSubCost", () => {
  it("returns 0 when both monthly and annual are zero", () => {
    expect(calcSubCost(0, 0, 720)).toBe(0);
  });

  it("returns 0 when monthly is zero and annual is null", () => {
    expect(calcSubCost(0, null, 720)).toBe(0);
  });

  it("prorates monthly across 30-day window", () => {
    // $20/mo, 360h = half month → $10
    expect(calcSubCost(20, null, 360)).toBeCloseTo(10, 10);
  });

  it("returns monthly at exactly 720h boundary", () => {
    expect(calcSubCost(20, null, 720)).toBe(20);
  });

  it("returns 0 at zero hours with paid plan", () => {
    expect(calcSubCost(20, 15, 0)).toBe(0);
  });

  it("extrapolates monthly beyond 720h when annual is unavailable", () => {
    // 721h falls to the else branch (> 720 and < 8760, annual null)
    expect(calcSubCost(20, null, 721)).toBeCloseTo(20 * (721 / 720), 10);
  });

  it("uses annual price at exactly 8760h when available", () => {
    expect(calcSubCost(20, 192, 8760)).toBe(192);
  });

  it("falls back to monthly extrapolation at 8760h when annual is null", () => {
    // 20 * (8760 / 720) ≈ 243.33
    expect(calcSubCost(20, null, 8760)).toBeCloseTo(20 * (8760 / 720), 10);
  });

  it("does not apply annual price below 8760h", () => {
    // At 4mo (2920h), must use monthly extrapolation, not annual
    const monthlyExtrapolated = 20 * (2920 / 720);
    expect(calcSubCost(20, 192, 2920)).toBeCloseTo(monthlyExtrapolated, 10);
  });
});

describe("colorIndex", () => {
  it("returns 0 for zero and negatives", () => {
    expect(colorIndex(0)).toBe(0);
    expect(colorIndex(-0.01)).toBe(0);
    expect(colorIndex(-1000)).toBe(0);
  });

  it("returns 0 for micro amounts (0 < v < 0.01)", () => {
    // v < thresholds[0] (0.01) → returns i=0 immediately
    expect(colorIndex(0.001)).toBe(0);
    expect(colorIndex(0.009)).toBe(0);
  });

  it("boundary: 0.01 moves up to index 1", () => {
    // v < 0.01 is false, v < 0.1 is true → returns i=1
    expect(colorIndex(0.01)).toBe(1);
  });

  it("boundary: 1 moves up to index 3", () => {
    // v < 0.01, 0.1, 1 all false; v < 5 true → returns i=3
    expect(colorIndex(1)).toBe(3);
  });

  it("progressive thresholds map to their index", () => {
    expect(colorIndex(5)).toBe(4); // 5 < 20
    expect(colorIndex(20)).toBe(5); // 20 < 100
    expect(colorIndex(100)).toBe(6); // 100 < 500
    expect(colorIndex(500)).toBe(7); // 500 < 2000
    expect(colorIndex(2000)).toBe(8); // 2000 < 10000
    expect(colorIndex(10_000)).toBe(9); // 10000 < 50000
  });

  it("caps at 10 for v ≥ 50000", () => {
    expect(colorIndex(50_000)).toBe(10);
    expect(colorIndex(1_000_000)).toBe(10);
  });

  it("just-below 50000 maps to 9", () => {
    expect(colorIndex(49_999.99)).toBe(9);
  });
});

describe("fmtUSD", () => {
  it("returns $0.00 for zero", () => {
    expect(fmtUSD(0)).toBe("$0.00");
  });

  it("returns $0.00 for negatives", () => {
    expect(fmtUSD(-1)).toBe("$0.00");
  });

  it("returns <$0.01 for sub-cent positives", () => {
    expect(fmtUSD(0.001)).toBe("<$0.01");
    expect(fmtUSD(0.004999)).toBe("<$0.01");
  });

  it("rounds 0.005 up to $0.01 via toFixed", () => {
    // toFixed rounds half-to-even in modern JS; 0.005 → "0.01" typically
    expect(fmtUSD(0.005)).toBe("$0.01");
  });

  it("formats simple two-decimal numbers", () => {
    expect(fmtUSD(1.5)).toBe("$1.50");
    expect(fmtUSD(99.99)).toBe("$99.99");
  });

  it("adds thousands separators", () => {
    expect(fmtUSD(1234.56)).toBe("$1,234.56");
    expect(fmtUSD(1_234_567.89)).toBe("$1,234,567.89");
  });

  describe("non-finite guard", () => {
    it("returns $0.00 for NaN", () => {
      expect(fmtUSD(Number.NaN)).toBe("$0.00");
    });

    it("returns $0.00 for Infinity", () => {
      expect(fmtUSD(Number.POSITIVE_INFINITY)).toBe("$0.00");
    });

    it("returns $0.00 for -Infinity", () => {
      expect(fmtUSD(Number.NEGATIVE_INFINITY)).toBe("$0.00");
    });
  });
});

describe("fmtJPY", () => {
  it("returns ¥0 when v is zero", () => {
    expect(fmtJPY(0, 150)).toBe("¥0");
  });

  it("returns ¥0 when v is negative", () => {
    expect(fmtJPY(-1, 150)).toBe("¥0");
  });

  it("returns <¥1 for sub-yen amounts", () => {
    // 0.001 * 150 = 0.15 yen
    expect(fmtJPY(0.001, 150)).toBe("<¥1");
  });

  it("rounds to integer yen with ja-JP grouping", () => {
    expect(fmtJPY(1, 150)).toBe("¥150");
    // 10 * 157.92 = 1579.2 → round → 1579
    expect(fmtJPY(10, 157.92)).toBe("¥1,579");
  });

  it("formats large values with proper grouping", () => {
    // 1000 * 150 = 150000 → ¥150,000
    expect(fmtJPY(1000, 150)).toBe("¥150,000");
  });

  describe("jpyRate guard (Phase 4 refactor)", () => {
    it("returns ¥— when jpyRate is 0 (rate fetch failed)", () => {
      // Previously this silently returned '¥0', masking a broken rate
      expect(fmtJPY(100, 0)).toBe("¥—");
    });

    it("returns ¥— when jpyRate is negative", () => {
      expect(fmtJPY(100, -1)).toBe("¥—");
    });

    it("returns ¥— when jpyRate is NaN", () => {
      expect(fmtJPY(100, Number.NaN)).toBe("¥—");
    });

    it("returns ¥— when jpyRate is Infinity", () => {
      expect(fmtJPY(100, Number.POSITIVE_INFINITY)).toBe("¥—");
    });

    it("invalid rate takes precedence over zero v", () => {
      // Even if v is 0 (would normally be '¥0'), an invalid rate
      // signals we can't make any JPY claim at all.
      expect(fmtJPY(0, 0)).toBe("¥—");
    });
  });

  describe("non-finite v guard", () => {
    it("returns ¥— when v is NaN", () => {
      expect(fmtJPY(Number.NaN, 150)).toBe("¥—");
    });

    it("returns ¥— when v is Infinity", () => {
      expect(fmtJPY(Number.POSITIVE_INFINITY, 150)).toBe("¥—");
    });

    it("returns ¥— when v is -Infinity", () => {
      expect(fmtJPY(Number.NEGATIVE_INFINITY, 150)).toBe("¥—");
    });
  });
});
