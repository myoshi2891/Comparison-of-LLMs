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

const VOID_ELEMENTS = new Set(["br", "hr", "img", "input", "meta", "link"]);
const TABLE_CONTENT_ELEMENTS = new Set(["table", "thead", "tbody", "tfoot", "tr"]);

type SyntaxToken = "comment" | "key" | "keyword" | "number" | "string" | "value";

function tokenType(token: string, language: string): SyntaxToken {
  if (token.startsWith("#")) return "comment";
  if (/^-?\d/.test(token)) return "number";
  if (/^(true|false|null)$/i.test(token)) return "value";
  if (language === "json" && /"\s*:$/.test(token)) return "key";
  if (/^["']/.test(token)) return "string";
  if (/^(from|import|as|for|in|if|else|return|True|False|None|pip|install)$/.test(token)) {
    return "keyword";
  }
  return "key";
}

function tokenPattern(language: string): RegExp {
  if (language === "json") {
    return /"(?:\\.|[^"\\])*"\s*:|"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
  }
  if (language === "bash") {
    return /#[^\n]*|--[\w-]+|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:pip|install)\b|\b\d+(?:\.\d+)?\b/g;
  }
  return /#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:from|import|as|for|in|if|else|return|True|False|None)\b|\b\d+(?:\.\d+)?\b/g;
}

function highlightCode(source: string, language: string): ReactNode[] {
  const pattern = tokenPattern(language);
  const output: ReactNode[] = [];
  let lastIndex = 0;
  let match = pattern.exec(source);

  while (match) {
    if (match.index > lastIndex) output.push(source.slice(lastIndex, match.index));
    output.push(
      <span data-syntax-token={tokenType(match[0], language)} key={`${match.index}-${match[0]}`}>
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
    match = pattern.exec(source);
  }
  if (lastIndex < source.length) output.push(source.slice(lastIndex));
  return output;
}

function isMermaidNode(node: HtmlNode, className: string): boolean {
  return (
    (node.name === "pre" && className.includes("mermaid-source")) ||
    (node.name === "div" && className.split(" ").includes("mermaid"))
  );
}

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
    if (TABLE_CONTENT_ELEMENTS.has(parentName ?? "") && !node.data?.trim()) {
      return null;
    }
    return node.data;
  }
  if (node.type !== "tag" || !node.name) return null;
  if (["script", "style"].includes(node.name)) return null;

  const className = node.attribs?.class ?? "";
  if (isMermaidNode(node, className)) {
    return <MermaidDiagram chart={textContent(node).trim()} key={key} theme="dark" />;
  }

  const props = { ...propsFor(node), key };
  if (VOID_ELEMENTS.has(node.name)) return createElement(node.name, props);
  if (node.name === "code" && parentName === "pre" && className.startsWith("language-")) {
    return createElement(
      node.name,
      props,
      ...highlightCode(textContent(node), className.slice("language-".length))
    );
  }
  return createElement(
    node.name,
    props,
    ...(node.children ?? []).map((child, index) => renderNode(child, `${key}-${index}`, node.name))
  );
}

export default function GuideContent() {
  let layout: HtmlNode | null = null;
  let sourceCss = "";

  try {
    const SOURCE_PATH = join(process.cwd(), "..", "archive", "Finetuning-best-practices-guide.html");
    const sourceHtml = readFileSync(SOURCE_PATH, "utf8");
    const $ = load(sourceHtml);
    layout = $(".layout").first().get(0) as unknown as HtmlNode;
    sourceCss = $("style").first().html() || "";
    // Avoid TS6133 by referencing sourceCss
    if (sourceCss && process.env.NODE_ENV === "development") {
      console.debug("Loaded CSS length:", sourceCss.length);
    }
  } catch (error) {
    console.error("Failed to load guide content:", error);
  }

  if (!layout) {
    return <div className="fineTuningGuide">Guide content not found.</div>;
  }

  return <div className="fineTuningGuide">{renderNode(layout, "layout")}</div>;
}
