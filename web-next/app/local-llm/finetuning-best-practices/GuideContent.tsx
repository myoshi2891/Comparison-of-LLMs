import { readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "cheerio";
import { createElement, type ReactNode } from "react";
import MermaidDiagram from "@/components/docs/MermaidDiagram";

type HtmlNode = {
  attribs?: Record<string, string>;
  children?: HtmlNode[];
  data?: string;
  name?: string;
  type?: string;
};

const SOURCE_PATH = join(process.cwd(), "..", "archive", "Finetuning-best-practices-guide.html");
const sourceHtml = readFileSync(SOURCE_PATH, "utf8");
const $ = load(sourceHtml);
const layout = $(".layout").first().get(0) as unknown as HtmlNode;
const sourceCss = $("style").first().text().replaceAll(":root", ".fineTuningGuide");
const VOID_ELEMENTS = new Set(["br", "hr", "img", "input", "meta", "link"]);

function textContent(node: HtmlNode): string {
  if (node.type === "text") return node.data ?? "";
  return (node.children ?? []).map(textContent).join("");
}

function propsFor(node: HtmlNode): Record<string, string> {
  const props: Record<string, string> = {};
  for (const [name, value] of Object.entries(node.attribs ?? {})) {
    if (name === "class") {
      props.className = value;
    } else if (name === "for") {
      props.htmlFor = value;
    } else if (name === "tabindex") {
      props.tabIndex = value;
    } else if (name !== "style") {
      props[name] = value;
    }
  }
  if (/^https?:\/\//.test(props.href ?? "")) {
    props.target = "_blank";
    props.rel = "noopener noreferrer";
  }
  return props;
}

function renderNode(node: HtmlNode, key: string, parentName?: string): ReactNode {
  if (node.type === "text") {
    if (
      ["table", "thead", "tbody", "tfoot", "tr"].includes(parentName ?? "") &&
      !node.data?.trim()
    ) {
      return null;
    }
    return node.data;
  }
  if (node.type !== "tag" || !node.name) return null;
  if (["script", "style"].includes(node.name)) return null;

  const className = node.attribs?.class ?? "";
  if (
    (node.name === "pre" && className.includes("mermaid-source")) ||
    (node.name === "div" && className.split(" ").includes("mermaid"))
  ) {
    return <MermaidDiagram chart={textContent(node).trim()} key={key} theme="dark" />;
  }

  const props = { ...propsFor(node), key };
  if (VOID_ELEMENTS.has(node.name)) return createElement(node.name, props);
  return createElement(
    node.name,
    props,
    ...(node.children ?? []).map((child, index) => renderNode(child, `${key}-${index}`, node.name))
  );
}

export default function GuideContent() {
  return (
    <div className="fineTuningGuide">
      <style>{`@scope (.fineTuningGuide) {${sourceCss}}`}</style>
      {renderNode(layout, "layout")}
    </div>
  );
}
