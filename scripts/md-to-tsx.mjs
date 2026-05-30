import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import { marked } from "marked";

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: bun scripts/md-to-tsx.mjs <source.md> <target/page.tsx>");
  process.exit(1);
}

const mdPath = path.resolve(process.cwd(), args[0]);
const tsxPath = path.resolve(process.cwd(), args[1]);

let hasLink = false;
let hasMermaid = false;
const mermaidBlocks = new Map();
const codeBlocks = new Map();

let md;
try {
  fs.mkdirSync(path.dirname(tsxPath), { recursive: true });
} catch (error) {
  console.error(`Error creating directory for tsx file at ${tsxPath}:`, error);
  process.exit(1);
}

try {
  md = fs.readFileSync(mdPath, "utf8");
} catch (error) {
  console.error(`Error reading markdown file at ${mdPath}:`, error);
  process.exit(1);
}

// Parse markdown to HTML synchronously
const html = marked.parse(md, { async: false });

// Load with cheerio to manipulate DOM
const $ = cheerio.load(html, { decodeEntities: false });

// 1. Wrap the first h1 and following until h2 in hero section
const h1 = $("h1").first();
if (h1.length) {
  const heroContent = $('<div className="hero-content"></div>');
  let current = h1.next();

  heroContent.append(h1.clone());

  while (current.length && current[0].tagName !== "h2" && current[0].tagName !== "hr") {
    const next = current.next();
    if (current[0].tagName === "blockquote") {
      const text = current.text();
      if (text.includes("最終更新")) {
        const replacement = $(`<div className="hero-sub">${current.html()}</div>`);
        current.replaceWith(replacement);
        heroContent.append(replacement.clone());
      } else {
        heroContent.append(current.clone());
      }
    } else {
      heroContent.append(current.clone());
    }
    current.remove();
    current = next;
  }
  h1.replaceWith($('<section className="hero" id="top"></section>').append(heroContent));
}

// 2. Manipulate tables
$("table").each((_i, el) => {
  $(el).wrap('<div className="table-wrapper"></div>');
  $(el).find("thead th").attr("scope", "col");
  $(el).find("tbody th").attr("scope", "row");
  if (!$(el).find("caption").length && !$(el).attr("aria-label")) {
    $(el).attr("aria-label", "データテーブル");
  }
});

// Safely escape curly braces in all text nodes so JSX parser does not treat them as JS expressions
$("*")
  .contents()
  .filter(function () {
    return this.type === "text";
  })
  .each(function () {
    this.data = this.data.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");
  });

// 3. Manipulate blockquotes -> callouts
$("blockquote").each((_i, el) => {
  $(el).replaceWith(`<div className="callout callout-info">${$(el).html()}</div>`);
});

// 4. Code blocks
$("pre > code").each((i, codeEl) => {
  // Check for mermaid blocks
  if ($(codeEl).hasClass("language-mermaid")) {
    hasMermaid = true;
    // Revert HTML entities for curly braces added globally by the text content filter
    const rawText = $(codeEl)
      .text()
      .replace(/&#123;/g, "{")
      .replace(/&#125;/g, "}");
    const escapedText = rawText.replace(/`/g, "\\`").replace(/\$/g, "\\$");

    const placeholderId = `MERMAID_PLACEHOLDER_${i}`;
    mermaidBlocks.set(placeholderId, escapedText);
    $(codeEl).parent().replaceWith(placeholderId);
    return; // continue to next each
  }

  // We must wrap the raw text in a JSX string literal so that React preserves newlines.
  // e.g. {"Feature: \n  Background:"} instead of raw text Feature: \n Background:
  const rawText = $(codeEl)
    .text()
    .replace(/&#123;/g, "{")
    .replace(/&#125;/g, "}");

  const ltToken = `__LT_${crypto.randomUUID().replace(/-/g, "")}__`;
  const ampToken = `__AMP_${crypto.randomUUID().replace(/-/g, "")}__`;

  // Instead of hardcoded tokens, we safely stringify to escape, then use JSX braces
  // so we don't accidentally replace raw code tags like `<script>` with __LT_PLACEHOLDER__
  // Note: cheerio .text() gives unescaped text, so < inside code gets read as <.
  // When stringified, it becomes literal <, which is fine inside JSX {"<script>"}.
  // We just need to make sure we don't break JSON stringify.
  const escapedRawText = rawText.replace(/</g, ltToken).replace(/&/g, ampToken);
  // Use JSON.stringify to safely escape quotes, newlines, etc., and wrap it in {} for JSX.
  $(codeEl).text(`{${JSON.stringify(escapedRawText)}}`);

  // We use a Map to track these explicitly so we can revert them later without collisons
  codeBlocks.set(ltToken, "<");
  codeBlocks.set(ampToken, "&");

  // Add classes to the parent <pre>
  $(codeEl)
    .parent()
    .attr(
      "class",
      "code-block text-sm overflow-x-auto p-4 bg-[var(--color-bg-card)] rounded-[var(--radius-DEFAULT)] border border-[var(--color-border)] my-4 text-[var(--color-text-secondary)]"
    );
});

// 5. Replace <hr>
$("hr").each((_i, el) => {
  $(el).replaceWith('<hr className="accent-line" />');
});

// 6. Section Headers (h2, h3)
$("h2")
  .not(".hero h2")
  .each((_i, el) => {
    $(el).attr(
      "class",
      "section-header text-2xl mt-12 mb-6 border-b border-[var(--color-border)] pb-2"
    );
  });
$("h3").each((_i, el) => {
  $(el).attr("class", "text-xl font-bold mt-8 mb-4 text-[var(--color-text-primary)]");
});
$("h4").each((_i, el) => {
  $(el).attr("class", "text-lg font-bold mt-6 mb-3 text-[var(--color-text-primary)]");
});

// 7. Lists
$("ul").each((_i, el) => {
  $(el).attr("class", "list-disc pl-6 my-4 space-y-2 text-[var(--color-text-secondary)]");
});
$("ol").each((_i, el) => {
  $(el).attr("class", "list-decimal pl-6 my-4 space-y-2 text-[var(--color-text-secondary)]");
});

// 8. Empty anchors to headers
$("p > a[id]:only-child").each((_, el) => {
  const p = $(el).parent();
  const next = p.next();
  if (next.length && /^h[1-6]$/i.test(next[0].tagName)) {
    next.attr("id", $(el).attr("id"));
    p.remove();
  }
});

// 9. details and summary wrapper
$("details").each((_i, el) => {
  $(el).attr(
    "class",
    "p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-DEFAULT)] my-4"
  );
});
$("summary").each((_i, el) => {
  $(el).attr("class", "cursor-pointer font-bold text-[var(--color-accent-blue)]");
});

// Transform attributes for React JSX mapping securely via Cheerio
$("*").each((_, el) => {
  const element = $(el);
  if (el.attribs) {
    if ("class" in el.attribs) {
      const val = el.attribs.class;
      element.removeAttr("class");
      element.attr("className", val);
    }
    if ("classname" in el.attribs) {
      const val = el.attribs.classname;
      element.removeAttr("classname");
      element.attr("className", val);
    }
    if ("for" in el.attribs) {
      const val = el.attribs.for;
      element.removeAttr("for");
      element.attr("htmlFor", val);
    }
    if ("colspan" in el.attribs) {
      const val = el.attribs.colspan;
      element.removeAttr("colspan");
      element.attr("colSpan", val);
    }
    if ("rowspan" in el.attribs) {
      const val = el.attribs.rowspan;
      element.removeAttr("rowspan");
      element.attr("rowSpan", val);
    }
  }
});

// Done with JSX brace escaping elsewhere.

// Convert anchors: internal → Link, external → target="_blank"
$("a").each((_i, el) => {
  const href = $(el).attr("href");
  if (!href) return;
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) {
    // External link: add safety attributes
    $(el).attr("target", "_blank");
    $(el).attr("rel", "noopener noreferrer");
  } else if (href.startsWith("#") || href.startsWith("/")) {
    hasLink = true;

    // Change tag name from 'a' to 'Link' safely within Cheerio.
    // Some verions of cheerio use el.tagName, others el.name. We cover both.
    if (el.name) el.name = "Link";
    if (el.tagName) el.tagName = "Link";
  }
});

let outHtml = $("body").html();

// Simple fixes:
outHtml = outHtml.replace(/<br>/g, "<br />"); // self close br
// Using a better regex for <input> that avoids double self-closing
outHtml = outHtml.replace(/<input\b([^>]*?)(?<!\/)>/g, "<input$1 />"); // self close input if not already closed
outHtml = outHtml.replace(/<hr([^>]*)>/g, (match, attrs) => {
  return attrs.includes("/") ? match : `<hr${attrs} />`;
});
// Detect and self-close any img explicitly
outHtml = outHtml.replace(/<img\b([^>]*?)(?<!\/)>/g, "<img$1 />");

// Restore mermaid blocks using a replacement function to avoid '$' pattern interpretation
for (const [id, escapedText] of mermaidBlocks.entries()) {
  outHtml = outHtml.replace(id, () => `<Mermaid chart={\`${escapedText}\`} />`);
}

// Restore < and & placeholders for code blocks uniquely mapped
for (const [id, restoreStr] of codeBlocks.entries()) {
  // using regex with global flag to replace all occurrences if any
  const regex = new RegExp(id, "g");
  outHtml = outHtml.replace(regex, restoreStr);
}

const routeName = path.basename(path.dirname(tsxPath));
const componentName = `${routeName
  .split(/[-_]/)
  .filter(Boolean)
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join("")}Page`;
const pageClass = routeName;

// Compute relative import path from generated file to components directory
const projectRoot = path.resolve(process.cwd());
const projectComponentsDir = path.join(projectRoot, "web-next", "components");
const importPrefix = path.relative(path.dirname(tsxPath), projectComponentsDir).replace(/\\/g, "/");

const finalTSX = `${hasLink ? "import Link from 'next/link';\n" : ""}${hasMermaid ? `import Mermaid from '${importPrefix}/Mermaid';\n` : ""}
export default function ${componentName}() {
    return (
        <main className="${pageClass} container mx-auto px-4 py-8 max-w-5xl">
            ${outHtml}
        </main>
    );
}
`;

try {
  fs.writeFileSync(tsxPath, finalTSX);
  console.log("Successfully created page.tsx");
} catch (error) {
  console.error(`Error writing tsx file at ${tsxPath}:`, error);
  process.exit(1);
}
