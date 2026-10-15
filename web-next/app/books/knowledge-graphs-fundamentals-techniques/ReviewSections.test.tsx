// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { fireEvent, render } from "@testing-library/react";
import { parse } from "postcss";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";
import review from "./review-contract.json";
import source from "./source-contract.json";

vi.mock("./TocObserver", () => ({ default: () => null }));
vi.mock("@/components/docs/MermaidDiagram", () => ({ default: () => null }));
const nodes = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll(selector));
const text = (e: Element) => e.textContent?.replace(/\s+/g, " ").trim();
const original = (e: Element) => {
  const copy = e.cloneNode(true) as Element;
  nodes(copy, "[data-study-addition]").forEach((e) => {
    e.remove();
  });
  return text(copy);
};
function mount() {
  const { container } = render(<Page />);
  return container.querySelector("#sec-19") as HTMLElement;
}
const css = readFileSync(
  "app/books/knowledge-graphs-fundamentals-techniques/page.module.css",
  "utf8"
);
function declarations(selector: string) {
  const out: Record<string, string> = {};
  parse(css).walkRules((r) => {
    if (r.selector === selector)
      r.walkDecls((d) => {
        out[d.prop] = d.value;
      });
  });
  return out;
}

describe("19.2 and 19.3 learning review", () => {
  it("keeps all eight original questions and answers verbatim and in order", () => {
    const root = mount();
    const lists = nodes(root, "ol[data-review-list]");
    expect(lists.map((l) => Array.from(l.children).map(original))).toEqual(
      source.lists
        .filter((l) => l.items[0].startsWith("KG の事実は") || l.items[0].startsWith("主語・述語"))
        .map((l) => l.items)
    );
  });
  it("adds each question topic, category and learning goal in the same order", () => {
    const root = mount();
    expect(
      nodes(root, '[data-review-list="questions"] > li').map((li) => ({
        number: li.getAttribute("data-review-number"),
        topic: text(li.querySelector("[data-review-topic]") as Element),
        category: text(li.querySelector("[data-review-category]") as Element),
        goal: text(li.querySelector("[data-review-goal]") as Element),
      }))
    ).toEqual(
      review.map((r) => ({
        number: String(r.number),
        topic: r.topic,
        category: r.category,
        goal: r.goal,
      }))
    );
  });
  it("provides one initially closed native disclosure for every numbered answer", () => {
    const root = mount();
    expect(
      nodes(root, '[data-review-list="answers"] > li').map((li) => ({
        number: li.getAttribute("data-review-number"),
        children: Array.from(li.children).map((e) => e.tagName),
        open: li.querySelector("details")?.hasAttribute("open"),
        first: li.querySelector("details")?.firstElementChild?.tagName,
        summary: text(li.querySelector("summary") as Element),
      }))
    ).toEqual(
      review.map((r) => ({
        number: String(r.number),
        children: ["DETAILS"],
        open: false,
        first: "SUMMARY",
        summary: `問題${r.number}｜${r.topic} — 解答・解説`,
      }))
    );
  });
  it("includes every worked example, explanation, pitfall and valid review link", () => {
    const root = mount();
    expect(
      nodes(root, '[data-review-list="answers"] > li').map((li) => ({
        example: text(li.querySelector("[data-review-example]") as Element),
        explanation: text(li.querySelector("[data-review-explanation]") as Element),
        pitfall: text(li.querySelector("[data-review-pitfall]") as Element),
        href: li.querySelector("[data-review-reference]")?.getAttribute("href"),
        reference: text(li.querySelector("[data-review-reference]") as Element),
      }))
    ).toEqual(
      review.map(({ example, explanation, pitfall, href, reference }) => ({
        example,
        explanation,
        pitfall,
        href,
        reference,
      }))
    );
    expect(review.map((r) => document.querySelector(r.href)?.tagName)).toEqual(
      review.map(() => "H3")
    );
  });
  it("opens and closes each answer independently through native summary activation", () => {
    const root = mount();
    const disclosures = nodes(root, "details");
    expect(disclosures.map((e) => e.hasAttribute("open"))).toEqual(review.map(() => false));
    disclosures.forEach((details, i) => {
      fireEvent.click(details.querySelector("summary") as Element);
      expect(disclosures.map((e) => e.hasAttribute("open"))).toEqual(review.map((_, j) => j === i));
      fireEvent.click(details.querySelector("summary") as Element);
      expect(disclosures.map((e) => e.hasAttribute("open"))).toEqual(review.map(() => false));
    });
  });
  it("separates study guidance from the original content without adding empty controls", () => {
    const root = mount();
    expect(nodes(root, "[data-review-instructions]").map(text)).toEqual([
      "まずは解答を開かず、8問に自分の言葉で答えてみましょう。各問の「確認すること」を説明できるかが目安です。",
      "答え合わせは1問ずつ開いて行えます。元の解答に加え、具体例・考え方・つまずきやすい点を確認し、迷ったら復習先へ戻りましょう。",
    ]);
    expect(nodes(root, "summary").map((e) => e.getAttribute("aria-expanded"))).toEqual(
      review.map(() => null)
    );
  });
  it("keeps native decimal numbering and adds readable scoped question cards", () => {
    expect(declarations(".layout :global(ol[data-review-list])")).toMatchObject({
      "list-style-type": "decimal",
      "padding-left": "30px",
      display: "grid",
      gap: "12px",
    });
    expect(declarations(".layout :global([data-review-list] > li)")).toMatchObject({
      "min-width": "0",
      "overflow-wrap": "anywhere",
      background: "var(--color-background-secondary)",
      border: "1px solid var(--color-border-secondary)",
    });
    expect(declarations(".layout :global([data-review-list] > li)::marker")).toMatchObject({
      color: "var(--accent)",
      "font-weight": "700",
    });
  });
  it("keeps disclosure markers, keyboard focus and open state visible", () => {
    expect(declarations(".layout :global([data-review-list] summary)")).toMatchObject({
      display: "list-item",
      "list-style-type": "disclosure-closed",
      cursor: "pointer",
    });
    expect(
      declarations(".layout :global([data-review-list] details[open] > summary)")
    ).toMatchObject({
      "list-style-type": "disclosure-open",
      "border-bottom": "1px solid var(--color-border-secondary)",
    });
    expect(declarations(".layout :global([data-review-list] summary:focus-visible)")).toMatchObject(
      { outline: "2px solid var(--accent)", "outline-offset": "4px" }
    );
  });
});
