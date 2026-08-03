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
  default: function DummyMermaidDiagram({ chart, id }: { chart: string; id?: string }) {
    return (
      <pre id={id} data-testid="mermaid">
        {chart}
      </pre>
    );
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

  it("renders s9 and s10 sections", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("#s9")).not.toBeNull();
    expect(container.querySelector("#s10")).not.toBeNull();
  });

  it("renders s11 and s12 sections", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("#s11")).not.toBeNull();
    expect(container.querySelector("#s12")).not.toBeNull();
  });

  it("renders s13, s14, s15, references, and footer with correct headings", () => {
    const { container } = render(<Page />);
    const s13 = container.querySelector("#s13");
    const s14 = container.querySelector("#s14");
    const s15 = container.querySelector("#s15");
    expect(s13).not.toBeNull();
    expect(s14).not.toBeNull();
    expect(s15).not.toBeNull();

    expect(s13?.querySelector("h2")?.textContent).toBe("成熟度モデルと健全性チェック");
    const h3Elements = s13?.querySelectorAll("h3");
    expect(h3Elements?.[0]?.textContent).toBe("13.1　Loop Engineering成熟度モデル");
    expect(h3Elements?.[1]?.textContent).toBe("13.2　健全性チェックフロー");

    expect(s14?.querySelector("h2")?.textContent).toBe("まとめ");
    expect(s15?.querySelector("h2")?.textContent).toBe("参考文献・出典一覧");
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

  it("renders diagrams diag-9, diag-10, diag-11, diag-12", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("#diag-9")).not.toBeNull();
    expect(container.querySelector("#diag-10")).not.toBeNull();
    expect(container.querySelector("#diag-11")).not.toBeNull();
    expect(container.querySelector("#diag-12")).not.toBeNull();
  });

  it("renders diagram diag-13", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("#diag-13")).not.toBeNull();
  });

  it("renders diagrams diag-14 and diag-15", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("#diag-14")).not.toBeNull();
    expect(container.querySelector("#diag-15")).not.toBeNull();
  });

  it("renders every Mermaid diagram id exactly once", () => {
    const { container } = render(<Page />);

    for (let diagramNumber = 1; diagramNumber <= 15; diagramNumber += 1) {
      expect(container.querySelectorAll(`#diag-${diagramNumber}`)).toHaveLength(1);
    }
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
    // We expect at least 14 tables now (table1 in s2, table2 in s3, table3 in s4, table4 in s5, table5 in s6, table6 in s7, table7 in s8, table8-11 in s9, table12-13 in s11, table14 in s12)
    expect(tables.length).toBeGreaterThanOrEqual(14);
    const content = Array.from(tables)
      .map((t) => t.textContent)
      .join(" ");
    expect(content).toContain("繰り返しの主体");
    expect(content).toContain("エージェンティック・コーディングループ");
    expect(content).toContain("Discovery（発見）");
    expect(content).toContain("Worktrees（作業木）");
    expect(content).toContain("Verifierの種類");
    expect(content).toContain("1ループ1タスク");
    expect(content).toContain("ループ向きなタスク");
    expect(content).toContain("上限条件（回数）");
    expect(content).toContain("外部記憶");
    expect(content).toContain("ローカルのcronジョブ");
    expect(content).toContain("Claude Codeでの対応機能");
    expect(content).toContain("認知的な明け渡し");
  });

  it("renders the practice steps list", () => {
    const { container } = render(<Page />);
    const list = container.querySelector("ol[class*='stepList']");
    expect(list).not.toBeNull();
    expect(list?.textContent).toContain("小さなリポジトリを1つ用意する");
    expect(list?.textContent).toContain("上限を必ず設定して観察する");
  });

  it("renders external links with safe rel attributes", () => {
    const { container } = render(<Page />);
    const externalLinks = container.querySelectorAll('a[target="_blank"]');
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      const rel = link.getAttribute("rel") ?? "";
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
      expect(rel).toContain("external");
    }
  });
});

describe("/agent/loop-engineering - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });

  it("delegates Mermaid SVG sizing and centering to the shared component", () => {
    const css = readFileSync(join(__dirname, "page.module.css"), "utf8");

    expect(css).not.toMatch(/\.mermaidContainer\s+svg\s*\{/);
    expect(css).not.toMatch(
      /\.mermaidContainer\s*\{[^}]*\b(?:display|justify-content|width|max-width)\s*:/s
    );
  });

  it("does not override Mermaid node text colors with a page-wide important rule", () => {
    const css = readFileSync(join(__dirname, "page.module.css"), "utf8");

    expect(css).not.toMatch(/:global\(\.label\)[^{]*\{[^}]*fill:\s*var\(--ink\)\s*!important/);
  });

  it("uses sufficiently dark fills whenever Mermaid diagram nodes use white text", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const lowContrastFills = [
      "#95a5a6",
      "#3498db",
      "#e67e22",
      "#e74c3c",
      "#27ae60",
      "#f39c12",
      "#8e44ad",
      "#1abc9c",
    ];

    // Mermaid は `fill:#xxx,color:#fff` の区切り・大文字小文字・宣言順を緩く受け付けるため、
    // 表記ゆれを含めて低コントラストの組み合わせを検出する。
    for (const fill of lowContrastFills) {
      const white = "#(?:fff|ffffff)";
      expect(source).not.toMatch(
        new RegExp(`fill\\s*:\\s*${fill}[,\\s]+color\\s*:\\s*${white}\\b`, "i")
      );
      expect(source).not.toMatch(
        new RegExp(`color\\s*:\\s*${white}[,\\s]+fill\\s*:\\s*${fill}\\b`, "i")
      );
    }
  });
});
