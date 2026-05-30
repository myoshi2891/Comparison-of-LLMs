import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import AgentHarnessEngineeringPage, {
  metadata as rawMetadata,
} from "@/app/gemini/agent-harness-engineering/page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

const Page = AgentHarnessEngineeringPage as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
  "s10",
  "s11",
] as const;

describe("/gemini/agent-harness-engineering - metadata", () => {
  it("exports a metadata object with title", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toBe("Google Gemini AIエージェント ハーネスエンジニアリング 完全ガイド");
  });

  it("exports a metadata object with description", () => {
    expect(typeof metadata.description).toBe("string");
    expect(metadata.description).toMatch(/評価ハーネス/);
  });
});

describe("/gemini/agent-harness-engineering - page structure", () => {
  it("renders an <h1> containing correct title", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(/Google Gemini/);
    expect(h1?.textContent).toMatch(/AIエージェント/);
  });

  it("renders all 11 expected section ids", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders s1 content correctly (probability, comparison table)", () => {
    const { container } = render(<Page />);
    const s1 = container.querySelector("#s1");
    expect(s1).not.toBeNull();
    expect(s1?.textContent).toMatch(/確率的/);
    expect(s1?.textContent).toMatch(/決定論的/);
    expect(s1?.querySelector("table")).not.toBeNull();
  });

  it("renders s2 content correctly (architecture, levels)", () => {
    const { container } = render(<Page />);
    const s2 = container.querySelector("#s2");
    expect(s2).not.toBeNull();
    expect(s2?.textContent).toMatch(/アーキテクチャ/);
    expect(s2?.querySelector("table")).not.toBeNull();
    expect(s2?.textContent).toMatch(/フェイクLLM/);
  });

  it("renders s3 content correctly (eval set JSON)", () => {
    const { container } = render(<Page />);
    const s3 = container.querySelector("#s3");
    expect(s3).not.toBeNull();
    expect(s3?.textContent).toMatch(/deploy_staging_query/);
    expect(s3?.textContent).toMatch(/expected_tool_calls/);
  });

  it("renders s4 content correctly (fake_llm.py, fake_tools.py)", () => {
    const { container } = render(<Page />);
    const s4 = container.querySelector("#s4");
    expect(s4).not.toBeNull();
    expect(s4?.textContent).toMatch(/fake_llm.py/);
    expect(s4?.textContent).toMatch(/fake_tools.py/);
    expect(s4?.querySelector("table")).not.toBeNull();
  });

  it("renders s5 content correctly (ADK Eval, scorers)", () => {
    const { container } = render(<Page />);
    const s5 = container.querySelector("#s5");
    expect(s5).not.toBeNull();
    expect(s5?.textContent).toMatch(/google-adk/);
    expect(s5?.querySelector("table")).not.toBeNull();
  });

  it("renders s6 content correctly (LLM-as-Judge, judge_response)", () => {
    const { container } = render(<Page />);
    const s6 = container.querySelector("#s6");
    expect(s6).not.toBeNull();
    expect(s6?.textContent).toMatch(/LLM-as-Judge/);
    expect(s6?.textContent).toMatch(/judge_response/);
  });

  it("renders s7 content correctly (multi-agent, routing)", () => {
    const { container } = render(<Page />);
    const s7 = container.querySelector("#s7");
    expect(s7).not.toBeNull();
    expect(s7?.textContent).toMatch(/マルチエージェント/);
    expect(s7?.querySelector("table")).not.toBeNull();
  });

  it("renders s8 content correctly (flaky tests, stable_evaluate)", () => {
    const { container } = render(<Page />);
    const s8 = container.querySelector("#s8");
    expect(s8).not.toBeNull();
    expect(s8?.textContent).toMatch(/フレイキー/);
    expect(s8?.querySelector("table")).not.toBeNull();
  });

  it("renders s9 content correctly (CI pipeline, GitHub Actions)", () => {
    const { container } = render(<Page />);
    const s9 = container.querySelector("#s9");
    expect(s9).not.toBeNull();
    expect(s9?.textContent).toMatch(/GitHub Actions/);
    expect(s9?.textContent).toMatch(/agent-eval.yaml/);
  });

  it("renders s10 content correctly (10 best practices, checklist)", () => {
    const { container } = render(<Page />);
    const s10 = container.querySelector("#s10");
    expect(s10).not.toBeNull();
    expect(s10?.textContent).toMatch(/ベストプラクティス/);
    expect(s10?.querySelector('[role="checkbox"]')).not.toBeNull();
  });

  it("renders s11 content correctly (sources, footer)", () => {
    const { container } = render(<Page />);
    const s11 = container.querySelector("#s11");
    expect(s11).not.toBeNull();
    expect(s11?.textContent).toMatch(/参考ソース一覧/);
    expect(s11?.querySelector("a")?.getAttribute("href")).toMatch(/google.github.io\/adk-docs/);

    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();
    expect(footer?.textContent).toMatch(/Gemini Harness Engineering/);
  });

  it("renders 11 TOC links pointing to section anchors", () => {
    const { container } = render(<Page />);
    const tocAnchors = container.querySelectorAll('nav a[href^="#"]');
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    for (const id of EXPECTED_SECTION_IDS) {
      expect(tocHrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });
});

describe("/gemini/agent-harness-engineering - external link safety", () => {
  it("all external http(s) links have target='_blank' and rel='noopener noreferrer'", () => {
    const { container } = render(<Page />);
    const externals = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href") ?? "";
      return /^https?:\/\//.test(href);
    });
    expect(externals.length).toBeGreaterThan(0);
    for (const a of externals) {
      expect(a.getAttribute("target")).toBe("_blank");
      const rel = a.getAttribute("rel") ?? "";
      expect(rel).toMatch(/noopener/);
      expect(rel).toMatch(/noreferrer/);
    }
  });

  it("s11 (sources) section contains at least 3 external links", () => {
    const { container } = render(<Page />);
    const sources = container.querySelector("#s11");
    expect(sources).not.toBeNull();
    const externals =
      sources?.querySelectorAll('a[href^="http"]') ??
      ([] as unknown as NodeListOf<HTMLAnchorElement>);
    expect(externals.length).toBeGreaterThanOrEqual(3);
  });
});

describe("/gemini/agent-harness-engineering - clean internal links", () => {
  it("all internal links do not contain .html extension", () => {
    const { container } = render(<Page />);
    const anchors = Array.from(container.querySelectorAll("a"));
    for (const a of anchors) {
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("/") || href.startsWith("#")) {
        expect(href.includes(".html")).toBe(false);
      }
    }
  });
});

describe("/gemini/agent-harness-engineering - language classes on code blocks", () => {
  it("all pre or code elements for code samples have language-* classes", () => {
    const { container } = render(<Page />);
    const codeBlocks = Array.from(container.querySelectorAll("pre"));
    // TOC などのダミーの MermaidDiagram (pre data-testid="mermaid") は除外
    const actualBlocks = codeBlocks.filter((pre) => pre.getAttribute("data-testid") !== "mermaid");
    expect(actualBlocks.length).toBeGreaterThan(0);
    for (const pre of actualBlocks) {
      const className = pre.className || "";
      expect(className).toMatch(/language-\w+/);
    }
  });
});

describe("/gemini/agent-harness-engineering - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
