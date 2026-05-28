import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import HarnessEngineeringPage, {
  metadata as rawMetadata,
} from "@/app/gemini/harness-engineering/page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

const Page = HarnessEngineeringPage as unknown as () => ReactElement;
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

describe("/gemini/harness-engineering - metadata", () => {
  it("exports a metadata object with title", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/ハーネスエンジニアリング/);
  });

  it("exports a metadata object with description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/gemini/harness-engineering - page structure", () => {
  it("renders an <h1> containing 'ハーネスエンジニアリング'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(/ハーネスエンジニアリング/);
  });

  it("renders all 11 expected section ids", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders s1 content correctly (crash test, table, vocabulary)", () => {
    const { container } = render(<Page />);
    const s1 = container.querySelector("#s1");
    expect(s1).not.toBeNull();
    expect(s1?.textContent).toMatch(/クラッシュテスト/);
    expect(s1?.textContent).toMatch(/SUT/);
    expect(s1?.querySelector("table")).not.toBeNull();
  });

  it("renders s2 content correctly (pyramid, sizes table, warnings, vocabulary)", () => {
    const { container } = render(<Page />);
    const s2 = container.querySelector("#s2");
    expect(s2).not.toBeNull();
    expect(s2?.textContent).toMatch(/テストピラミッド/);
    expect(s2?.textContent).toMatch(/逆ピラミッド/);
    expect(s2?.querySelector("table")).not.toBeNull();
    expect(s2?.textContent).toMatch(/localhostのみ/);
  });

  it("renders s3 content correctly (5 components cards, comparison table)", () => {
    const { container } = render(<Page />);
    const s3 = container.querySelector("#s3");
    expect(s3).not.toBeNull();
    expect(s3?.textContent).toMatch(/テストランナー/);
    expect(s3?.textContent).toMatch(/フィクスチャ/);
    expect(s3?.textContent).toMatch(/アサーション/);
    expect(s3?.querySelector("table")).not.toBeNull();
    expect(s3?.textContent).toMatch(/JUnit5 \+ Google Truth/);
  });

  it("renders s4 content correctly (doubles table, code blocks, flowchart, vocabulary)", () => {
    const { container } = render(<Page />);
    const s4 = container.querySelector("#s4");
    expect(s4).not.toBeNull();
    expect(s4?.textContent).toMatch(/スタントマン/);
    expect(s4?.querySelector("table")).not.toBeNull();
    expect(s4?.textContent).toMatch(/StubWeatherApi/);
    expect(s4?.textContent).toMatch(/MagicMock/);
    expect(s4?.textContent).toMatch(/FakeUserRepository/);
  });

  it("renders s5 content correctly (3 principles table, anti-pattern diagram, vocabulary)", () => {
    const { container } = render(<Page />);
    const s5 = container.querySelector("#s5");
    expect(s5).not.toBeNull();
    expect(s5?.textContent).toMatch(/宇宙服/);
    expect(s5?.querySelector("table")).not.toBeNull();
    expect(s5?.textContent).toMatch(/孤立性/);
    expect(s5?.textContent).toMatch(/冪等性/);
    expect(s5?.textContent).toMatch(/freezegun/);
  });

  it("renders s6 content correctly (comparison grid, pytest and gtest code samples, vocabulary)", () => {
    const { container } = render(<Page />);
    const s6 = container.querySelector("#s6");
    expect(s6).not.toBeNull();
    expect(s6?.textContent).toMatch(/依存性注入/);
    expect(s6?.querySelector('.cmp-ok, [class*="cmp-ok"]')).toBeDefined();
    expect(s6?.textContent).toMatch(/conftest.py/);
    expect(s6?.textContent).toMatch(/test_user_service.py/);
    expect(s6?.textContent).toMatch(/user_service_test.cc/);
    expect(s6?.textContent).toMatch(/GMock/);
  });

  it("renders s7 content correctly (flaky table, detection flowchart, vocabulary)", () => {
    const { container } = render(<Page />);
    const s7 = container.querySelector("#s7");
    expect(s7).not.toBeNull();
    expect(s7?.textContent).toMatch(/天気予報/);
    expect(s7?.querySelector("table")).not.toBeNull();
    expect(s7?.textContent).toMatch(/時刻依存/);
    expect(s7?.textContent).toMatch(/並行性/);
    expect(s7?.textContent).toMatch(/隔離/);
  });

  it("renders s8 content correctly (YAML pipelines, optimization table)", () => {
    const { container } = render(<Page />);
    const s8 = container.querySelector("#s8");
    expect(s8).not.toBeNull();
    expect(s8?.textContent).toMatch(/Google Cloud Build/);
    expect(s8?.textContent).toMatch(/cloudbuild.yaml/);
    expect(s8?.textContent).toMatch(/Harness Test Pipeline/);
    expect(s8?.querySelector("table")).not.toBeNull();
    expect(s8?.textContent).toMatch(/変更影響テスト/);
  });

  it("renders s9 content correctly (comparison table, Mermaid diag-7, LLM-as-Judge code, vocabulary)", () => {
    const { container } = render(<Page />);
    const s9 = container.querySelector("#s9");
    expect(s9).not.toBeNull();
    expect(s9?.textContent).toMatch(/AIエージェント評価ハーネス/);
    expect(s9?.textContent).toMatch(/決定論的/);
    expect(s9?.querySelector("table")).not.toBeNull();
    expect(s9?.textContent).toMatch(/LLM-as-Judge/);
    expect(s9?.textContent).toMatch(/evaluate_response/);
    expect(s9?.textContent).toMatch(/ADK Eval/);
  });

  it("renders s10 content correctly (10 best practices cards, DAMP/DRY comparison, coverage target table)", () => {
    const { container } = render(<Page />);
    const s10 = container.querySelector("#s10");
    expect(s10).not.toBeNull();
    expect(s10?.textContent).toMatch(/ベストプラクティス10則/);
    expect(s10?.textContent).toMatch(/テストはDAMP/);
    expect(s10?.textContent).toMatch(/1テスト1アサーション/);
    expect(s10?.querySelector('[class*="cmp"]')).not.toBeNull();
    expect(s10?.textContent).toMatch(/_make_user/);
    expect(s10?.textContent).toMatch(/FakeUserRepository/);
    expect(s10?.querySelector("table")).not.toBeNull();
    expect(s10?.textContent).toMatch(/推奨カバレッジ/);
    expect(s10?.textContent).toMatch(/ビジネスロジック層/);
  });

  it("renders s11 content correctly (12 source cards, footer)", () => {
    const { container } = render(<Page />);
    const s11 = container.querySelector("#s11");
    expect(s11).not.toBeNull();
    expect(s11?.textContent).toMatch(/参考ソース一覧/);
    expect(s11?.textContent).toMatch(/Googleが公式に公開しているソース/);
    expect(s11?.querySelectorAll('[class*="srcCard"]').length).toBe(12);
    expect(s11?.textContent).toMatch(/Software Engineering at Google — O'Reilly/);
    expect(s11?.textContent).toMatch(/The Practical Test Pyramid — Martin Fowler/);
    expect(s11?.textContent).toMatch(/Google ADK Evaluation Guide/);
    expect(s11?.textContent).toMatch(/SRE Book/);

    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();
    expect(footer?.textContent).toMatch(/HARNESS ENGINEERING/);
    expect(footer?.textContent).toMatch(
      /Google Testing Blog \/ Software Engineering at Google 準拠/
    );
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

describe("/gemini/harness-engineering - external link safety", () => {
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

describe("/gemini/harness-engineering - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
