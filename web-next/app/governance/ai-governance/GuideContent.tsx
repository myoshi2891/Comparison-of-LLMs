import { readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "cheerio";
import { createElement, type ReactNode } from "react";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import { DIAGRAMS, MERMAID_THEME } from "./diagrams";

type HtmlNode = {
  attribs?: Record<string, string>;
  children?: HtmlNode[];
  data?: string;
  name?: string;
  type?: string;
};

const SOURCE_PATH = join(process.cwd(), "..", "archive", "Ai-governance-guide.html");
const sourceHtml = readFileSync(SOURCE_PATH, "utf8");
const $ = load(sourceHtml);
const layout = $(".layout").first().get(0) as unknown as HtmlNode;

const VOID_ELEMENTS = new Set(["br", "hr", "img", "input", "meta", "link"]);
const TABLE_CONTENT_ELEMENTS = new Set(["table", "thead", "tbody", "tfoot", "tr"]);

const ICON_TEXT: Record<string, string> = {
  "ti ti-alert-triangle": "⚠",
  "ti ti-checklist": "☑",
  "ti ti-flag": "⚑",
  "ti ti-flag-3": "⚑",
  "ti ti-info-circle": "ⓘ",
  "ti ti-link": "↗",
  "ti ti-list-numbers": "☷",
  "ti ti-shield-check": "🛡",
  "ti ti-square": "□",
  "ti ti-users": "◉",
  "ti ti-world": "◎",
};

function propsFor(node: HtmlNode): Record<string, string> {
  const props: Record<string, string> = {};
  for (const [name, value] of Object.entries(node.attribs ?? {})) {
    if (name === "class") {
      props.className = value;
    } else if (name === "for") {
      props.htmlFor = value;
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
    if (TABLE_CONTENT_ELEMENTS.has(parentName ?? "") && !node.data?.trim()) return null;
    return node.data;
  }
  if (node.type !== "tag" || !node.name) return null;
  if (["script", "style"].includes(node.name)) return null;

  const className = node.attribs?.class ?? "";
  const diagramId = node.attribs?.["data-mermaid-id"];
  if (node.name === "div" && diagramId && DIAGRAMS[diagramId]) {
    return <MermaidDiagram chart={DIAGRAMS[diagramId]} key={key} theme={MERMAID_THEME} />;
  }
  if (node.name === "i") {
    return (
      <span aria-hidden="true" className={className} key={key}>
        {ICON_TEXT[className] ?? "•"}
      </span>
    );
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
  return <div className="aiGovernanceGuide">{renderNode(layout, "layout")}</div>;
}
