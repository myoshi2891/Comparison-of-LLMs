import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import GoogleSandboxBestPracticesPage, {
  metadata as rawMetadata,
} from "@/app/google/sandbox-best-practices/page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

const Page = GoogleSandboxBestPracticesPage as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "1-はじめになぜサンドボックスが必要なのか",
  "2-全体マップgoogleの5つのサンドボックス領域",
  "3-領域①-aiエージェントのサンドボックス",
  "4-領域②-apiのサンドボックス",
  "5-領域③-コンテナのサンドボックス",
  "6-領域④-ccのサンドボックス",
  "7-領域⑤-ブラウザのサンドボックス",
  "8-意思決定フロー自分のケースにはどのサンドボックス技術を選ぶべきか",
  "9-横断ベストプラクティス早見表",
  "10-参考文献出典url",
] as const;

describe("/google/sandbox-best-practices - metadata", () => {
  it("exports a metadata object with title", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toBe("Google サンドボックス技術 完全ガイド ― AIエージェント・API・コンテナ・C/C++・ブラウザ");
  });

  it("exports a metadata object with description", () => {
    expect(typeof metadata.description).toBe("string");
    expect(metadata.description).toMatch(/サンドボックス/);
  });
});

describe("/google/sandbox-best-practices - page structure", () => {
  it("renders an <h1> containing correct title", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain("Google サンドボックス技術 完全ガイド");
  });

  it("renders all expected section ids", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders intro content correctly", () => {
    const { container } = render(<Page />);
    const h2 = container.querySelector("#\\1-はじめになぜサンドボックスが必要なのか, [id*='1-はじめになぜサンドボックスが必要なのか']");
    expect(h2).not.toBeNull();
  });
});

describe("/google/sandbox-best-practices - external link safety", () => {
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
});

describe("/google/sandbox-best-practices - clean internal links", () => {
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

describe("/google/sandbox-best-practices - language classes on code blocks", () => {
  it("all pre elements for code samples have language-* classes", () => {
    const { container } = render(<Page />);
    const codeBlocks = Array.from(container.querySelectorAll("pre"));
    const actualBlocks = codeBlocks.filter((pre) => pre.getAttribute("data-testid") !== "mermaid");
    expect(actualBlocks.length).toBeGreaterThan(0);
    for (const pre of actualBlocks) {
      const className = pre.className || "";
      expect(className).toMatch(/language-\w+/);
    }
  });
});

describe("/google/sandbox-best-practices - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
