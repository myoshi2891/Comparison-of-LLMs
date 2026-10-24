import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import PageComponent, {
  metadata as rawMetadata,
} from "@/app/google/enterprise-agent-platform/page";

const Page = PageComponent as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

// Mock the MermaidDiagram component
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

// Stub IntersectionObserver
class IntersectionObserverStub {
  observe() {
    // mock
  }
  unobserve() {
    // mock
  }
  disconnect() {
    // mock
  }
}
global.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;

const EXPECTED_SECTION_IDS = [
  "overview",
  "architecture",
  "components",
  "step0",
  "step1",
  "step2",
  "step3",
  "step4",
  "step5",
  "step6",
  "step7",
  "step8",
  "step9",
  "step10",
  "step11",
  "step12",
  "checklist",
  "antipatterns",
  "trends",
  "references",
] as const;

describe("/google/enterprise-agent-platform - metadata", () => {
  it("exports a metadata object with correct title", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toBe(
      "Gemini Enterprise Agent Platform 完全ガイド | 初学者向けステップバイステップ・ベストプラクティス | LLM コスト計算機"
    );
  });

  it("exports a metadata object with non-empty description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/google/enterprise-agent-platform - page structure", () => {
  it("renders an <h1> containing correct title", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain("Gemini Enterprise Agent Platform 完全ガイド");
  });

  it("renders all 20 expected sections", () => {
    const { container } = render(<Page />);
    // We expect at least the specified section IDs
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders TOC links pointing to all section anchors", () => {
    const { container } = render(<Page />);
    const tocAnchors = container.querySelectorAll("nav a[href^='#']");
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    for (const id of EXPECTED_SECTION_IDS) {
      expect(tocHrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });
});

describe("/google/enterprise-agent-platform - external link safety", () => {
  it("all external http(s) links have correct target and rel attributes", () => {
    const { container } = render(<Page />);
    const externals = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href");
      return href && (href.startsWith("http://") || href.startsWith("https://"));
    });
    for (const a of externals) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("contains clean internal links only (no .html extensions)", () => {
    const { container } = render(<Page />);
    const links = Array.from(container.querySelectorAll("a"));
    for (const a of links) {
      const href = a.getAttribute("href");
      if (href && !href.startsWith("http") && !href.startsWith("#")) {
        expect(href.endsWith(".html")).toBe(false);
      }
    }
  });
});

describe("Gemini Enterprise Agent Platform 日付表示", () => {
  const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

  it("ヒーローは作成日 2026-07-18 と ADK 例のモデル更新日 2026-10-22 を区別する", () => {
    const { container } = render(<Page />);
    const meta = container.querySelector("[class*='hero'] [class*='meta']");
    expect(norm(meta?.textContent)).toBe(
      "作成: 2026年7月18日時点の公開情報に基づく ／ モデル更新: 2026年10月22日（ADK の例を gemini-3.8-flash に変更） ／ 図解はすべて Mermaid で記述（ASCIIアートは不使用）"
    );
  });

  it("フッターは作成日とモデル更新日を区別する", () => {
    const { container } = render(<Page />);
    const footer = container.querySelector("footer[class*='pageFooter']");
    expect(norm(footer?.textContent)).toBe(
      "Gemini Enterprise Agent Platform 完全ガイド ／ 初学者向けステップバイステップ・ベストプラクティス ／ 作成: 2026年7月18日 ／ モデル更新: 2026年10月22日"
    );
  });
});
