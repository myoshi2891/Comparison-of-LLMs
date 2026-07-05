import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import PageComponent, { metadata as rawMetadata } from "@/app/agent/loop-engineering/page";

beforeAll(() => {
  global.IntersectionObserver = class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as unknown as typeof IntersectionObserver;
});

const Page = PageComponent as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

// MermaidDiagram は useEffect 内で mermaid を動的 import するためモック
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

describe("/agent/loop-engineering - metadata", () => {
  it("exports a metadata object with title containing 'Loop Engineering'", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/Loop Engineering/);
  });

  it("exports a metadata object with non-empty description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/agent/loop-engineering - page structure", () => {
  it("renders an <h1> containing 'Loop Engineering'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(/Loop Engineering/);
  });

  it("renders s1 and s2 sections", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("#s1")).not.toBeNull();
    expect(container.querySelector("#s2")).not.toBeNull();
  });

  it("renders s3 and s4 sections", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("#s3")).not.toBeNull();
    expect(container.querySelector("#s4")).not.toBeNull();
  });

  it("renders s5 and s6 sections", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("#s5")).not.toBeNull();
    expect(container.querySelector("#s6")).not.toBeNull();
  });

  it("renders s7 and s8 sections", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("#s7")).not.toBeNull();
    expect(container.querySelector("#s8")).not.toBeNull();
  });

  it("renders diagrams diag-1 and diag-2", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("#diag-1")).not.toBeNull();
    expect(container.querySelector("#diag-2")).not.toBeNull();
  });

  it("renders diagrams diag-3 and diag-4", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("#diag-3")).not.toBeNull();
    expect(container.querySelector("#diag-4")).not.toBeNull();
  });

  it("renders diagrams diag-5 and diag-6", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("#diag-5")).not.toBeNull();
    expect(container.querySelector("#diag-6")).not.toBeNull();
  });

  it("renders diagrams diag-7 and diag-8", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("#diag-7")).not.toBeNull();
    expect(container.querySelector("#diag-8")).not.toBeNull();
  });

  it("renders the terminology hierarchy table", () => {
    const { container } = render(<Page />);
    const table = container.querySelector("table");
    expect(table).not.toBeNull();
    expect(table?.textContent).toContain("Prompt Engineering");
    expect(table?.textContent).toContain("Loop Engineering");
  });

  it("renders comparison and loops tables", () => {
    const { container } = render(<Page />);
    const tables = container.querySelectorAll("table");
    // We expect at least 7 tables now (table1 in s2, table2 in s3, table3 in s4, table4 in s5, table5 in s6, table6 in s7, table7 in s8)
    expect(tables.length).toBeGreaterThanOrEqual(7);
    const content = Array.from(tables)
      .map((t) => t.textContent)
      .join(" ");
    expect(content).toContain("繰り返しの主体");
    expect(content).toContain("エージェンティック・コーディングループ");
    expect(content).toContain("Discovery（発見）");
    expect(content).toContain("Worktrees（作業木）");
    expect(content).toContain("Verifierの種類");
    expect(content).toContain("1ループ1タスク");
  });
});

describe("/agent/loop-engineering - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
