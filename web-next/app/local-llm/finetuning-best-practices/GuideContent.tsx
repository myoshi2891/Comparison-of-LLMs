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

/**
 * Classifies a source token for syntax highlighting.
 *
 * @param token - The source token to classify
 * @param language - The language associated with the token
 * @returns The syntax category assigned to the token
 */
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

/**
 * Creates a global regular expression for matching syntax tokens in source code.
 *
 * @param language - The source language used to select token patterns.
 * @returns A regular expression for matching tokens in the specified language.
 */
function tokenPattern(language: string): RegExp {
  if (language === "json") {
    return /"(?:\\.|[^"\\])*"\s*:|"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
  }
  if (language === "bash") {
    return /#[^\n]*|--[\w-]+|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:pip|install)\b|\b\d+(?:\.\d+)?\b/g;
  }
  return /#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:from|import|as|for|in|if|else|return|True|False|None)\b|\b\d+(?:\.\d+)?\b/g;
}

/**
 * Highlights source code by wrapping recognized tokens in syntax-marked spans.
 *
 * @param source - The source code to highlight
 * @param language - The language used to classify and match tokens
 * @returns React nodes containing plain text and syntax-highlighted token spans
 */
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

/**
 * Determines whether an HTML node represents a Mermaid diagram.
 *
 * @param node - The HTML node to inspect
 * @param className - The node's class name string
 * @returns `true` if the node is a Mermaid diagram container, `false` otherwise
 */
function isMermaidNode(node: HtmlNode, className: string): boolean {
  return (
    (node.name === "pre" && className.includes("mermaid-source")) ||
    (node.name === "div" && className.split(" ").includes("mermaid"))
  );
}

/**
 * Extracts the text content from an HTML node and its descendants.
 *
 * @param node - The HTML node whose text content to extract
 * @returns The node's text data or the concatenated text content of its descendants
 */
function textContent(node: HtmlNode): string {
  if (node.type === "text") return node.data ?? "";
  return (node.children ?? []).map(textContent).join("");
}

/**
 * Converts HTML attributes into React props.
 *
 * @param node - The HTML node whose attributes are converted
 * @returns React props with remapped attribute names and external-link attributes
 */
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

/**
 * Converts a parsed HTML node into a React element or text node.
 *
 * @param parentName - The parent tag name used for context-sensitive rendering.
 * @returns The rendered React node, or `null` for unsupported, filtered, or whitespace-only nodes.
 */
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

/**
 * Scopes CSS selectors by adding a prefix and remapping document-level selectors.
 *
 * @param selector - The CSS selector or comma-separated selector list to scope
 * @param prefix - The selector prefix to apply
 * @returns The scoped selector list
 */
function scopeSelector(selector: string, prefix: string): string {
  return selector
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return "";
      if (trimmed === ":root") return prefix;
      if (trimmed === "html" || trimmed === "body" || trimmed === "html, body") return prefix;

      let result = trimmed;
      if (result.startsWith("html ")) {
        result = result.replace(/^html /, `${prefix} `);
      } else if (result.startsWith("body ")) {
        result = result.replace(/^body /, `${prefix} `);
      } else if (result.startsWith(":root ")) {
        result = result.replace(/^:root /, `${prefix} `);
      } else {
        result = `${prefix} ${result}`;
      }
      return result;
    })
    .join(", ");
}

/**
 * Scopes CSS selectors with the specified prefix while preserving at-rule structure.
 *
 * @param css - The CSS source to scope
 * @param prefix - The selector prefix to apply
 * @returns The CSS with selectors prefixed and block comments removed
 */
function scopeCss(css: string, prefix: string): string {
  const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const result: string[] = [];
  let buffer = "";
  let depth = 0;
  let currentAtRule = false;

  for (let i = 0; i < cleanCss.length; i++) {
    const char = cleanCss[i];
    if (char === "{") {
      depth++;
      if (depth === 1) {
        const selector = buffer.trim();
        if (selector.startsWith("@")) {
          result.push(`${selector} {`);
          currentAtRule = true;
        } else {
          result.push(`${scopeSelector(selector, prefix)} {`);
        }
        buffer = "";
      } else {
        if (currentAtRule && depth === 2) {
          const selector = buffer.trim();
          result.push(`${scopeSelector(selector, prefix)} {`);
          buffer = "";
        } else {
          buffer += char;
        }
      }
    } else if (char === "}") {
      depth--;
      if (depth === 0) {
        result.push(`${buffer.trim()}\n}`);
        buffer = "";
        currentAtRule = false;
      } else if (depth === 1 && currentAtRule) {
        result.push(`${buffer.trim()}\n}`);
        buffer = "";
      } else {
        buffer += char;
      }
    } else {
      buffer += char;
    }
  }

  return result.join(" ");
}

/**
 * Renders the finetuning best practices guide with scoped styles.
 *
 * Displays a fallback message when the guide content cannot be loaded.
 */
export default function GuideContent() {
  let layout: HtmlNode | null = null;
  let sourceCss = "";

  try {
    const SOURCE_PATH = join(
      process.cwd(),
      "..",
      "archive",
      "Finetuning-best-practices-guide.html"
    );
    const sourceHtml = readFileSync(SOURCE_PATH, "utf8");
    const $ = load(sourceHtml);
    layout = $(".layout").first().get(0) as unknown as HtmlNode;
    sourceCss = $("style").first().html() || "";
  } catch (error) {
    console.error("Failed to load guide content:", error);
  }

  if (!layout) {
    return <div className="fineTuningGuide">Guide content not found.</div>;
  }

  return (
    <div className="fineTuningGuide">
      <style>{scopeCss(sourceCss, ".fineTuningGuide")}</style>
      {renderNode(layout, "layout")}
    </div>
  );
}
