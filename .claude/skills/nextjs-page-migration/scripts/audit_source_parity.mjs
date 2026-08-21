#!/usr/bin/env bun
/**
 * 原本（archive/html/*.html または archive/md/*.md）と移植先 page.tsx の
 * 要素インベントリを機械照合し、移行漏れを検出する監査スクリプト。
 *
 * 依存パッケージなし。bun / node どちらでも動く（ESM）。
 *
 * 使い方:
 *   bun .claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
 *     archive/md/Anthropic/claude-managed-agents-guide.md \
 *     web-next/app/claude/managed-agents/page.tsx
 *
 *   # 契約テストへ貼り付ける見出し配列を生成する
 *   ... --emit-headings
 *
 *   # CI / スクリプトから使う
 *   ... --json
 *
 * 終了コード:
 *   0 = 漏れなし（Green 判定に進んでよい）
 *   1 = 漏れあり（見出し・SVG・callout/alert・本文要素のいずれかが不足または改変）
 *   2 = 引数エラー / ファイル未検出
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { MERMAID_DIAGRAM_DECLARATION } from "../../fix-mermaid/scripts/mermaid-diagram-types.mjs";

/** リスト項目の照合に使う先頭文字数。長大な項目の全文一致を求めないための上限。 */
const LIST_ITEM_PROBE = 40;

// --------------------------------------------------------------------------
// テキスト正規化
// --------------------------------------------------------------------------

/**
 * Normalize text for comparison across source and JSX content.
 * @param {string} raw - The text to normalize.
 * @returns {string} The normalized comparison key.
 */
function normalize(raw) {
  return raw
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .replace(/[`*_~]/g, "")
    .trim();
}

/**
 * Creates a comparison key that ignores whitespace, leading numbering, punctuation, and letter case.
 * @param {string} raw - The display text to normalize for comparison.
 * @returns {string} The normalized comparison key.
 */
function matchKey(raw) {
  return (
    normalize(raw)
      // ① 先に空白を全除去する。「4 つの」と「4つの」を同一視するため、
      //    採番除去より前に行わないと数字の扱いが原本側とページ側で食い違う。
      .replace(/\s+/g, "")
      // ② 区切り記号を伴う先頭の採番だけを落とす（"3." / "2)" / "1：" ）。
      //    区切りのない "4つのコアコンセプト" の先頭数字は本文の一部なので残す。
      .replace(/^\d+(?:[.–-]\d+)*[.)：:]/, "")
      // ③ 句読点・括弧・記号の表記ゆれを吸収する。
      .replace(/[.,、。：:；;！!？?"'“”‘’（）()［］[\]{}／/\\|・･–—-]/g, "")
      .toLowerCase()
  );
}

/**
 * Decodes common HTML character references in a string.
 * @param {string} raw - The string containing HTML character references.
 * @returns {string} The decoded string.
 */
function decodeEntities(raw) {
  return raw
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rdquo;/g, "”")
    .replace(/&ldquo;/g, "“")
    .replace(/&amp;/g, "&");
}

/**
 * Extracts display text from an HTML or JSX fragment.
 * @param {string} fragment - The markup fragment containing tags or JSX expressions.
 * @returns {string} The decoded display text: tags and identifier expressions are removed, while
 *   the literal text of string expressions is kept.
 */
function stripMarkup(fragment) {
  // JSX 文字列式の中身は「そのまま表示されるテキスト」であり、HTML に見える断片も本文の一部。
  // タグ除去より前にプレースホルダへ退避しないと、原本側の &lt;style&gt; は（エンティティ復号が
  // 最後なので）生き残るのに page 側の {"<style>"} だけが消え、一致している内容が漏れとして
  // 誤検出される。復元はタグ除去の後・エンティティ復号の前に行い、両側の見え方を揃える。
  //
  // 例外は <br>。図解ラベルの改行指示として頻出し、原本側でも除去されるため、
  // 文字どおりのテキストではなく空白として扱う（比較キーは空白を落とすので原本と一致する）。
  const preserved = [];
  const stash = (text) =>
    `\u0000JSXSTR${preserved.push(text.replace(/<br\s*\/?>/gi, " ")) - 1}\u0000`;
  const placeholderRe = /\u0000JSXSTR(\d+)\u0000/g;

  let text = fragment
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\{\s*"\\n"\s*\}|\{\s*'\\n'\s*\}|\{\s*`\\n`\s*\}/g, "\n")
    .replace(/\{\s*"([^"]*)"\s*\}/g, (_match, value) => stash(value))
    .replace(/\{\s*'([^']*)'\s*\}/g, (_match, value) => stash(value))
    .replace(/\{\s*`([^`]*)`\s*\}/g, (_match, value) => stash(value))
    .replace(/\{\s*(?:styles\.[A-Za-z0-9_-]+|[A-Za-z_$][\w$]*)\s*\}/g, "")
    .replace(/<[^>]*>/g, "");

  // 退避は入れ子になりうる（テンプレートリテラル式の中に "..." 式がある等）。
  // String.replace は差し込んだ文字列を再走査しないため、1 回では内側のプレースホルダが
  // 生テキストとして残り、その区間の本文が丸ごと欠落する。解けなくなるまで繰り返す。
  // 内側は必ず先に採番されるので添字は単調減少し、ループは必ず停止する。
  while (placeholderRe.test(text)) {
    placeholderRe.lastIndex = 0;
    text = text.replace(placeholderRe, (_match, index) => preserved[Number(index)]);
  }

  return decodeEntities(text);
}

/**
 * Removes Markdown links, images, and HTML tags from an inline fragment.
 * @param {string} raw - The raw Markdown inline fragment.
 * @returns {string} The fragment with links, images, and HTML tags removed.
 */
function stripMarkdownInline(raw) {
  return raw
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "");
}

/**
 * Normalize code block or table row content for markup-independent comparison.
 * @param {string} raw - Element content that may contain HTML or JSX markup.
 * @returns {string} Text with markup and JSX whitespace expressions removed.
 */
function normalizeElementContent(raw) {
  return normalize(stripMarkup(raw));
}

/**
 * Creates a normalized comparison signature for an SVG fragment.
 * @param {string} raw - The raw SVG markup to normalize.
 * @returns {string} A JSON-encoded signature containing normalized tags, attributes, and text.
 */
function normalizeSvgElement(raw) {
  const tags = [];
  const tagRe = /<([A-Za-z][\w:.-]*)\b([^>]*)\/?\s*>/g;
  let tag = tagRe.exec(raw);
  while (tag !== null) {
    const attributes = [];
    const attributeRe =
      /([:@A-Za-z_][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*(?:"([^"]*)"|'([^']*)'|([^{}]+))\s*\})/g;
    let attribute = attributeRe.exec(tag[2]);
    while (attribute !== null) {
      const name = attribute[1].replace(/-/g, "").toLowerCase();
      if (name !== "class" && name !== "classname") {
        attributes.push([
          name,
          normalize(decodeEntities(attribute[2] ?? attribute[3] ?? attribute[4] ?? attribute[5] ?? attribute[6] ?? "")),
        ]);
      }
      attribute = attributeRe.exec(tag[2]);
    }
    attributes.sort(([left], [right]) => left.localeCompare(right));
    tags.push([tag[1].toLowerCase(), attributes]);
    tag = tagRe.exec(raw);
  }
  return JSON.stringify({ tags, text: normalize(stripMarkup(raw)) });
}

/**
 * Creates a markup-independent comparison key for a callout or alert element.
 * @param {string} openingTag - The element's opening tag, including its type markers.
 * @param {string} content - The element's body content.
 * @returns {string} A normalized key containing the callout types and content.
 */
function normalizeCalloutElement(openingTag, content) {
  const markers = new Set();
  const markerSource = `${openingTag} ${openingTag.match(/styles\.([\w-]+)/g)?.join(" ") ?? ""}`;
  for (const marker of markerSource.matchAll(/(?:callout|alert|warning|warn|note|info|tip|success|good)/gi)) {
    const value = marker[0].toLowerCase();
    markers.add(value === "warning" ? "warn" : value === "note" ? "info" : value);
  }
  return `${[...markers].sort().join("|")}::${matchKey(stripMarkup(content))}`;
}

/**
 * Extracts and normalizes SVG elements from source text.
 * @param {string} src - The source text to inspect.
 * @return {string[]} The normalized SVG elements found in the source text.
 */
function collectSvgElements(src) {
  return (src.match(/<svg\b[\s\S]*?<\/svg>/gi) ?? []).map(normalizeSvgElement);
}

/**
 * Collects callout and alert elements from markup source.
 * @param {string} src - The markup source to inspect.
 * @returns {Array} The normalized callout and alert elements found in the source.
 */
function collectMarkupCalloutElements(src) {
  return extractElementContents(src, (openingTag) =>
    /<(?:Callout|Alert)\b|(?:class|className)\s*=\s*(?:["'][^"']*(?:callout|alert)|\{[^}]*styles\.(?:callout|alert))|data-(?:testid|variant)\s*=\s*["'](?:callout|alert|warn|warning|info|note|good|success|tip)/i.test(
      openingTag
    )
  ).map(({ openingTag, content }) => normalizeCalloutElement(openingTag, content));
}

/**
 * Extract supported Markdown callouts and classify them by variant.
 * @param {string} src - Markdown source containing callout blocks.
 * @return {string[]} Callout keys in the form `warn::key`, `info::key`, or `tip::key`, based on the callout type and normalized body.
 */
function collectMarkdownCalloutElements(src) {
  const callouts = [];
  const lines = src.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const marker = /^\s*>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/i.exec(lines[index]);
    if (!marker) continue;
    const body = [];
    while (index + 1 < lines.length) {
      const quoted = /^\s*>\s?(.*)$/.exec(lines[index + 1]);
      if (!quoted) break;
      body.push(quoted[1]);
      index += 1;
    }
    const variant = /WARNING|CAUTION/i.test(marker[1])
      ? "warn"
      : /NOTE|IMPORTANT/i.test(marker[1])
        ? "info"
        : "tip";
    callouts.push(`${variant}::${matchKey(stripMarkdownInline(body.join(" ")))}`);
  }
  return callouts;
}

/**
 * Removes fenced code block markers and their contents from Markdown text.
 * @param {string} src - The Markdown text to process.
 * @return {string} The text with fenced code blocks removed.
 */
function stripMarkdownFences(src) {
  let inFence = false;
  return src
    .split(/\r?\n/)
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return "";
      }
      return inFence ? "" : line;
    })
    .join("\n");
}

/**
 * Normalizes Mermaid source while preserving indentation that carries syntactic meaning.
 * @param {string} raw - The Mermaid source to normalize.
 * @returns {string} The normalized source for content and order comparisons.
 */
function normalizeMermaidSource(raw) {
  const lines = decodeEntities(raw).replace(/\r\n?/g, "\n").split("\n");
  while (lines.length > 0 && lines[0].trim() === "") lines.shift();
  while (lines.length > 0 && lines.at(-1)?.trim() === "") lines.pop();
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const commonIndent = indents.length > 0 ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(commonIndent).trimEnd()).join("\n");
}

/**
 * Extracts the contents and source positions of matching non-nested HTML or JSX tags.
 * @param {string} src - The source markup to scan.
 * @param {string} tag - The tag name to match.
 * @return {{index: number, content: string}[]} The matched contents and their starting positions.
 */
function extractTagContents(src, tag) {
  const results = [];
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  let match = re.exec(src);
  while (match !== null) {
    results.push({ index: match.index, content: match[1] });
    match = re.exec(src);
  }
  return results;
}

/**
 * Extracts JSX elements whose opening tags satisfy a predicate, including their nested content.
 * @param {string} src - The source text to scan.
 * @param {function(string): boolean} predicate - Determines whether an opening tag should be extracted.
 * @returns {Array<{index: number, openingTag: string, content: string}>} The extracted elements and their source positions.
 */
function extractElementContents(src, predicate) {
  const results = [];
  const openingRe = /<([A-Za-z][\w.-]*)\b[^>]*>/g;
  let opening = openingRe.exec(src);
  while (opening !== null) {
    const openingTag = opening[0];
    if (!openingTag.endsWith("/>") && predicate(openingTag)) {
      const tag = opening[1];
      const nestedRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, "g");
      nestedRe.lastIndex = openingRe.lastIndex;
      let depth = 1;
      let nested = nestedRe.exec(src);
      while (nested !== null) {
        if (nested[0].startsWith(`</${tag}`)) depth -= 1;
        else if (!nested[0].endsWith("/>")) depth += 1;
        if (depth === 0) {
          results.push({
            index: opening.index,
            openingTag,
            content: src.slice(openingRe.lastIndex, nested.index),
          });
          openingRe.lastIndex = nestedRe.lastIndex;
          break;
        }
        nested = nestedRe.exec(src);
      }
    }
    opening = openingRe.exec(src);
  }
  return results;
}

/**
 * Extracts string constant declarations from TSX source.
 * @param {string} src - The complete TSX source text.
 * @return {Map<string, string>} A map from constant names to string values.
 */
function collectStringConstants(src) {
  const constants = new Map();
  const constantRe =
    /\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*(?:String\.raw\s*)?(`([\s\S]*?)`|"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')\s*;/g;
  let constant = constantRe.exec(src);
  while (constant !== null) {
    constants.set(constant[1], constant[3] ?? constant[4] ?? constant[5] ?? "");
    constant = constantRe.exec(src);
  }
  return constants;
}

/**
 * Resolves simple string constant references embedded in JSX content.
 * @param {string} content - The JSX element content.
 * @param {Map<string, string>} constants - The string constants available for resolution.
 * @returns {string} The content with recognized constant references replaced by their values.
 */
function resolveStringConstants(content, constants) {
  return content.replace(/\{\s*([A-Za-z_$][\w$]*)\s*\}/g, (expression, name) =>
    constants.has(name) ? constants.get(name) : expression
  );
}

/**
 * Collects Mermaid diagram sources from HTML in document order.
 * @param {string} src - The complete HTML source.
 * @returns {string[]} The normalized Mermaid sources found in Mermaid blocks and diagram definitions.
 */
function collectHtmlMermaidSources(src) {
  const sources = [];
  const divRe = /<(?:div|pre)\b([^>]*\bclass=["'][^"']*\bmermaid\b[^"']*["'][^>]*)>([\s\S]*?)<\/(?:div|pre)\s*>/gi;
  let div = divRe.exec(src);
  while (div !== null) {
    sources.push({ index: div.index, source: normalizeMermaidSource(div[2]) });
    div = divRe.exec(src);
  }

  const scriptRe =
    /<script\b[^>]*\b(?:class=["'][^"']*\bmermaid-source\b[^"']*["']|id=["']src-diagram-\d+["'])[^>]*>([\s\S]*?)<\/script\s*>/gi;
  let script = scriptRe.exec(src);
  while (script !== null) {
    sources.push({ index: script.index, source: normalizeMermaidSource(script[1]) });
    script = scriptRe.exec(src);
  }

  const diagramEntryRe = /["'][^"']+["']\s*:\s*`([\s\S]*?)`/g;
  let entry = diagramEntryRe.exec(src);
  while (entry !== null) {
    sources.push({ index: entry.index, source: normalizeMermaidSource(entry[1]) });
    entry = diagramEntryRe.exec(src);
  }

  return sources
    .sort((a, b) => a.index - b.index)
    .map(({ source }) => source)
    .filter((source) => MERMAID_DIAGRAM_DECLARATION.test(source));
}

/**
 * Collect normalized Mermaid chart sources from `MermaidDiagram` components in occurrence order.
 * @param {string} src - The complete contents of `page.tsx`.
 * @returns {string[]} The normalized Mermaid sources, or unresolved-reference markers for constants that cannot be resolved.
 */
function collectTsxMermaidSources(src) {
  const constants = collectStringConstants(src);

  const sources = [];
  const componentRe = /<MermaidDiagram\b[^>]*\bchart\s*=\s*(?:\{\s*([A-Za-z_$][\w$]*)\s*\}|\{\s*`([\s\S]*?)`\s*\}|["']([^"']*)["'])[^>]*\/?>/g;
  let component = componentRe.exec(src);
  while (component !== null) {
    const raw = component[2] ?? component[3] ?? constants.get(component[1]);
    sources.push(raw === undefined ? `__UNRESOLVED__:${component[1]}` : normalizeMermaidSource(raw));
    component = componentRe.exec(src);
  }
  return sources;
}

/**
 * Normalizes a URL for comparison.
 * @param {string} url - The raw URL string.
 * @return {string} The URL without its query, fragment, or trailing slashes, converted to lowercase.
 */
function normalizeUrl(url) {
  return url
    .trim()
    .replace(/[#?].*$/, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

/**
 * Blanks comment and template-literal text so import declarations can be tokenized from code only.
 *
 * Quoted string contents are preserved because import specifiers live inside them.
 * The scan runs from the top of the file, where real import declarations sit, so the
 * state machine is always clean by the time it reaches them.
 * @param {string} src - The module source text.
 * @returns {string} The source with comment and template-literal text replaced by spaces.
 */
function blankNonCodeText(src) {
  const blank = (text) => text.replace(/[^\n]/g, " ");
  let out = "";
  let index = 0;
  while (index < src.length) {
    const char = src[index];
    const next = src[index + 1];
    if (char === "/" && next === "/") {
      const lineEnd = src.indexOf("\n", index);
      const stop = lineEnd === -1 ? src.length : lineEnd;
      out += blank(src.slice(index, stop));
      index = stop;
      continue;
    }
    if (char === "/" && next === "*") {
      const commentEnd = src.indexOf("*/", index + 2);
      const stop = commentEnd === -1 ? src.length : commentEnd + 2;
      out += blank(src.slice(index, stop));
      index = stop;
      continue;
    }
    if (char === "`" || char === '"' || char === "'") {
      let cursor = index + 1;
      while (cursor < src.length) {
        if (src[cursor] === "\\") {
          cursor += 2;
          continue;
        }
        if (src[cursor] === char) break;
        if (char !== "`" && src[cursor] === "\n") break;
        cursor += 1;
      }
      const body = src.slice(index + 1, Math.min(cursor, src.length));
      out += char + (char === "`" ? blank(body) : body) + (src[cursor] === char ? char : "");
      index = Math.min(cursor + 1, src.length);
      continue;
    }
    out += char;
    index += 1;
  }
  return out;
}

/**
 * Collects relative import specifiers from a module's import prelude.
 *
 * The scan walks a cursor from the top of the module through directives, blanked
 * comments, and import declarations, and stops at the first token that is not one
 * of those. Import declarations are hoisted and always sit in that prelude, so
 * anything the cursor never reaches — JSX text, `<pre>` code examples, strings —
 * cannot be mistaken for a declaration regardless of its indentation.
 * @param {string} src - The module source text.
 * @returns {string[]} The relative specifiers of the module's import declarations.
 */
function collectLocalImportSpecifiers(src) {
  const code = blankNonCodeText(src);
  // 空白（＝空白化済みコメントを含む）と "use client" 等のディレクティブは読み飛ばす。
  const skipRe = /(?:\s+|["'][^"'\n]*["']\s*;?)/y;
  // 名前付き / default / namespace / type とその組み合わせ。取りこぼすとそのモジュール配下の
  // 本文が監査対象から丸ごと外れる。
  const importRe =
    /import\s+(?:type\s+)?(?:[\w$]+\s*,\s*)?(?:\{[^}]*\}|\*\s+as\s+[\w$]+|[\w$]+)\s+from\s*(["'])([^"']+)\1(?:\s*(?:with|assert)\s*\{[^}]*\})?\s*;?/y;
  // 副作用 import（`import "./styles.css";`）。辿る対象ではないが、prelude の途中で
  // 走査が止まって後続の実 import を見落とさないよう、ここで消費する。
  const sideEffectRe = /import\s*(["'])([^"']+)\1(?:\s*(?:with|assert)\s*\{[^}]*\})?\s*;?/y;

  const specifiers = [];
  let cursor = 0;
  while (cursor < code.length) {
    skipRe.lastIndex = cursor;
    const skipped = skipRe.exec(code);
    if (skipped !== null) {
      cursor = skipRe.lastIndex;
      continue;
    }
    importRe.lastIndex = cursor;
    sideEffectRe.lastIndex = cursor;
    const declaration = importRe.exec(code) ?? sideEffectRe.exec(code);
    if (declaration === null) break;
    if (declaration[2].startsWith(".")) specifiers.push(declaration[2]);
    cursor += declaration[0].length;
  }
  return specifiers;
}

// --------------------------------------------------------------------------
// インベントリ抽出
// --------------------------------------------------------------------------

/**
 * Extracts structural elements and external links from Markdown source.
 *
 * @param {string} src - The complete Markdown source to inspect.
 * @return {Object} An inventory containing headings, list items, code blocks, table rows, paragraphs, Mermaid sources, SVG elements, callouts, and external links with occurrence counts where applicable.
 */
function inventoryMarkdown(src) {
  const lines = src.split(/\r?\n/);
  const proseSource = stripMarkdownFences(src);
  const headings = [];
  const listTexts = [];
  let listItems = 0;
  let codeBlocks = 0;
  let tableRows = 0;
  let inFence = false;
  let fenceLanguage = "";
  let fenceLines = [];
  const codeBlockTexts = [];
  const tableRowTexts = [];
  const mermaidSources = [];
  const paragraphTexts = [];
  let paragraphLines = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    paragraphTexts.push(normalize(stripMarkdownInline(paragraphLines.join(" "))));
    paragraphLines = [];
  };

  for (const line of lines) {
    const fence = /^\s*(```|~~~)\s*([^\s]*)/.exec(line);
    if (fence) {
      flushParagraph();
      if (!inFence) {
        codeBlocks += 1;
        fenceLanguage = fence[2].toLowerCase();
        fenceLines = [];
      } else {
        const rawBlock = fenceLines.join("\n");
        if (fenceLanguage === "mermaid") {
          mermaidSources.push(normalizeMermaidSource(rawBlock));
        } else {
          codeBlockTexts.push(normalize(rawBlock));
        }
      }
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      fenceLines.push(line);
      continue;
    }

    const heading = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
    if (heading) {
      flushParagraph();
      headings.push({
        level: heading[1].length,
        text: normalize(stripMarkdownInline(heading[2])),
      });
      continue;
    }
    const listItem = /^\s*(?:[-*+]|\d+\.)\s+(\S.*)$/.exec(line);
    if (listItem) {
      flushParagraph();
      listItems += 1;
      listTexts.push(normalize(stripMarkdownInline(listItem[1])));
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(line) && !/^\s*\|?\s*:?-{3,}/.test(line)) {
      flushParagraph();
      tableRows += 1;
      tableRowTexts.push(normalize(stripMarkdownInline(line.replace(/^\s*\||\|\s*$/g, ""))));
      continue;
    }
    if (
      line.trim() === "" ||
      /^\s*(?:---+|___+|\*\*\*+)\s*$/.test(line) ||
      /^\s*(?:>|<[^>]+>)/.test(line) ||
      /^\s*\|?\s*:?-{3,}/.test(line)
    ) {
      flushParagraph();
      continue;
    }
    paragraphLines.push(line.trim());
  }
  flushParagraph();

  return {
    headings,
    listTexts,
    listItems,
    codeBlocks,
    tableRows,
    codeBlockTexts,
    tableRowTexts,
    paragraphTexts,
    mermaidSources,
    svgElements: collectSvgElements(proseSource),
    calloutElements: collectMarkdownCalloutElements(proseSource),
    externalLinks: collectUrls(src),
  };
}

/**
 * Builds an inventory of headings and content elements found in an HTML document.
 * @param {string} src - The complete HTML source.
 * @return {Object} The extracted headings, element counts, normalized content, Mermaid sources, SVG elements, callouts, and external links.
 */
function inventoryHtml(src) {
  // data-code スクリプトの中身は「表示されるコードブロック」なので保存する。
  // ただし中身自体が <style> 等を含みうるため、いったん不透明なプレースホルダへ退避し、
  // script/style/link の除去が終わってから <code> として復元する。
  const preservedCode = [];
  const stashed = src.replace(
    /<script\b[^>]*\bdata-code\b[^>]*>([\s\S]*?)<\/script\s*>/gi,
    (_match, content) => {
      preservedCode.push(content);
      return `\u0000DATACODE${preservedCode.length - 1}\u0000`;
    }
  );
  const body = stashed
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<link\b[^>]*\/?>/gi, "")
    .replace(
      /\u0000DATACODE(\d+)\u0000/g,
      // 中身のタグは「表示されるコード」なので < > をエンティティ化して除去から守る。
      // page 側の {"<style>…"} が復元されるのに合わせ、復号後に同じ文字列へ落ちる。
      // & は触らない（原本が既に持つ &lt; を二重符号化しないため）。
      (_match, index) =>
        `<code>${preservedCode[Number(index)].replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>`
    );
  const headings = [];
  const headingRe = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match = headingRe.exec(body);
  while (match !== null) {
    headings.push({ level: Number(match[1]), text: normalize(stripMarkup(match[2])) });
    match = headingRe.exec(body);
  }

  const listTexts = [];
  const liRe = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
  let li = liRe.exec(body);
  while (li !== null) {
    listTexts.push(normalize(stripMarkup(li[1])));
    li = liRe.exec(body);
  }

  const codeBlockTexts = extractElementContents(body, (openingTag) =>
    /^<pre\b/i.test(openingTag) && !/\bclass=["'][^"']*\bmermaid\b/i.test(openingTag)
  ).map(({ content }) => normalizeElementContent(content));
  const tableRowTexts = extractTagContents(body, "tr").map(({ content }) =>
    normalizeElementContent(content)
  );
  const paragraphTexts = extractTagContents(body, "p").map(({ content }) =>
    normalizeElementContent(content)
  );

  return {
    headings,
    listTexts,
    listItems: countMatches(body, /<li\b/gi),
    codeBlocks: codeBlockTexts.length,
    tableRows: tableRowTexts.length,
    codeBlockTexts,
    tableRowTexts,
    paragraphTexts,
    mermaidSources: collectHtmlMermaidSources(src),
    svgElements: collectSvgElements(body),
    calloutElements: collectMarkupCalloutElements(body),
    externalLinks: collectUrls(body),
  };
}

/**
 * Builds a normalized content inventory from TSX source for migration comparison.
 * @param {string} src - The complete contents of the `page.tsx` file.
 * @returns {Object} The inventory of headings, lists, code blocks, table rows, paragraphs, Mermaid sources, SVGs, callouts, and external links.
 */
function inventoryTsx(src) {
  const headings = [];
  // h1 も採取する。原本の h2 タイトルがページの h1 になるのは正当な移植であり、
  // h2/h3 だけを見ると偽陽性になるため。
  const headingRe = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g;
  let match = headingRe.exec(src);
  while (match !== null) {
    headings.push({ level: Number(match[1]), text: normalize(stripMarkup(match[2])) });
    match = headingRe.exec(src);
  }

  const constants = collectStringConstants(src);
  const preBlocks = extractTagContents(src, "pre");
  const styledBlocks = extractElementContents(src, (openingTag) =>
    /className=\{\s*styles\.code(?:Block|Wrap|Card)\s*\}/.test(openingTag)
  ).filter(
    ({ content }) =>
      !/<pre\b/.test(content) &&
      !/className=\{\s*styles\.code(?:Block|Wrap|Card)\s*\}/.test(content)
  );
  const codeBlockTexts = [...preBlocks, ...styledBlocks]
    .sort((a, b) => a.index - b.index)
    .map(({ content }) => normalizeElementContent(resolveStringConstants(content, constants)));
  const tableRowTexts = extractTagContents(src, "tr").map(({ content }) =>
    normalizeElementContent(content)
  );
  const paragraphTexts = extractTagContents(src, "p").map(({ content }) =>
    normalizeElementContent(resolveStringConstants(content, constants))
  );

  return {
    headings,
    // ページ側は <li> を使わずカード / div で組むことがあるため、
    // 本文全体の平坦化テキストを照合対象にする（マークアップ非依存の漏れ検知）。
    flatText: matchKey(stripMarkup(src)),
    listItems: countMatches(src, /<li\b/g),
    codeBlocks: codeBlockTexts.length,
    tableRows: tableRowTexts.length,
    codeBlockTexts,
    tableRowTexts,
    paragraphTexts,
    mermaidSources: collectTsxMermaidSources(src),
    svgElements: collectSvgElements(src),
    calloutElements: collectMarkupCalloutElements(src),
    externalLinks: collectUrls(src),
  };
}

/**
 * Counts the matches found by a regular expression in a string.
 * @param {string} src - The string to search.
 * @param {RegExp} re - The regular expression used for matching.
 * @returns {number} The number of matches.
 */
function countMatches(src, re) {
  return (src.match(re) ?? []).length;
}

/**
 * Collects unique external URLs from text.
 *
 * @param {string} src - The text to scan.
 * @returns {Set<string>} The normalized URLs found in the text.
 */
function collectUrls(src) {
  const decoded = decodeEntities(src);
  const urls = new Set();
  const re = /https?:\/\/[^\s"'`)<>\]}\\]+/g;
  let match = re.exec(decoded);
  while (match !== null) {
    urls.add(normalizeUrl(match[0]));
    match = re.exec(decoded);
  }
  return urls;
}

/**
 * Identifies source values that occur more often than their corresponding page values.
 *
 * @param {Array} sourceValues - Source values in occurrence order.
 * @param {Array} pageValues - Values found in the destination page.
 * @param {Function} [key=(value) => value] - Function that derives the comparison key for each value.
 * @return {Array} Source values missing from the destination, preserving duplicate occurrences and source order.
 */
function missingOccurrences(sourceValues, pageValues, key = (value) => value) {
  const remaining = new Map();
  for (const value of pageValues) {
    const valueKey = key(value);
    remaining.set(valueKey, (remaining.get(valueKey) ?? 0) + 1);
  }
  return sourceValues.filter((value) => {
    const valueKey = key(value);
    const count = remaining.get(valueKey) ?? 0;
    if (count === 0) return true;
    remaining.set(valueKey, count - 1);
    return false;
  });
}

// --------------------------------------------------------------------------
// 照合
// --------------------------------------------------------------------------

/**
 * Compares source and migrated-page inventories and reports migration discrepancies.
 *
 * @param {object} source - Inventory extracted from the source document.
 * @param {object} page - Inventory extracted from the migrated page.
 * @returns {object} Comparison results, including missing elements, extra headings, count differences, Mermaid matches, and the blocking status.
 */
function compare(source, page) {
  const consumedPageHeadings = new Set();
  const missingHeadings = source.headings.filter((sourceHeading) => {
    const key = matchKey(sourceHeading.text);
    let pageIndex = page.headings.findIndex(
      (pageHeading, index) =>
        !consumedPageHeadings.has(index) &&
        pageHeading.level === sourceHeading.level &&
        matchKey(pageHeading.text) === key
    );
    // 原本の h2 ページタイトルを移植先の h1 に昇格するケースだけを許可する。
    if (pageIndex === -1 && sourceHeading.level === 2) {
      pageIndex = page.headings.findIndex(
        (pageHeading, index) =>
          !consumedPageHeadings.has(index) && pageHeading.level === 1 && matchKey(pageHeading.text) === key
      );
    }
    if (pageIndex === -1) return true;
    consumedPageHeadings.add(pageIndex);
    return false;
  });
  const extraHeadings = page.headings.filter((_, index) => !consumedPageHeadings.has(index));

  const missingLinks = [...source.externalLinks].filter((u) => !page.externalLinks.has(u));

  // リスト項目は平坦化テキストへの包含で判定する（ページ側が <li> でなくカードでもよい）。
  //  - 8 文字未満の項目は偶然一致しやすいため照合対象から外す。
  //  - 長大な <li>（コード例や複数段落を含む項目）は全文一致を求めると必ず外れるため、
  //    先頭 LIST_ITEM_PROBE 文字だけを照合する。項目の存在確認にはこれで十分に特異である。
  const missingListItems = source.listTexts.filter((text) => {
    const key = matchKey(text);
    if (key.length < 8) return false;
    return !page.flatText.includes(key.slice(0, LIST_ITEM_PROBE));
  });
  const missingCodeBlocks = missingOccurrences(source.codeBlockTexts, page.codeBlockTexts, matchKey);
  const missingTableRows = missingOccurrences(source.tableRowTexts, page.tableRowTexts, matchKey);
  const missingParagraphs = missingOccurrences(source.paragraphTexts, page.paragraphTexts, matchKey);
  const missingSvgElements = missingOccurrences(source.svgElements, page.svgElements);
  const missingCalloutElements = missingOccurrences(source.calloutElements, page.calloutElements);
  const mermaidSourcesMatch =
    source.mermaidSources.length === page.mermaidSources.length &&
    source.mermaidSources.every((value, index) => value === page.mermaidSources[index]);

  const counts = {
    listItems: { source: source.listItems, page: page.listItems },
    codeBlocks: { source: source.codeBlocks, page: page.codeBlocks },
    tableRows: { source: source.tableRows, page: page.tableRows },
    paragraphs: { source: source.paragraphTexts.length, page: page.paragraphTexts.length },
    headings: { source: source.headings.length, page: page.headings.length },
    externalLinks: { source: source.externalLinks.size, page: page.externalLinks.size },
    mermaidSources: { source: source.mermaidSources.length, page: page.mermaidSources.length },
    svgElements: { source: source.svgElements.length, page: page.svgElements.length },
    calloutElements: { source: source.calloutElements.length, page: page.calloutElements.length },
  };

  const blocking =
    missingHeadings.length > 0 ||
    missingLinks.length > 0 ||
    missingListItems.length > 0 ||
    missingCodeBlocks.length > 0 ||
    missingTableRows.length > 0 ||
    missingParagraphs.length > 0 ||
    missingSvgElements.length > 0 ||
    missingCalloutElements.length > 0 ||
    !mermaidSourcesMatch;

  return {
    missingHeadings,
    extraHeadings,
    missingLinks,
    missingListItems,
    missingCodeBlocks,
    missingTableRows,
    missingParagraphs,
    missingSvgElements,
    missingCalloutElements,
    mermaidSourcesMatch,
    sourceMermaidSources: source.mermaidSources,
    pageMermaidSources: page.mermaidSources,
    counts,
    blocking,
  };
}

// --------------------------------------------------------------------------
// エントリポイント
// --------------------------------------------------------------------------

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const positional = args.filter((a) => !a.startsWith("--"));

if (positional.length < 2) {
  console.error(
    "usage: audit_source_parity.mjs <source.(md|html)> <page.tsx> [--json] [--emit-headings]"
  );
  process.exit(2);
}

const [sourcePath, pagePath] = positional;

let sourceText;
let pageText;
try {
  sourceText = readFileSync(sourcePath, "utf8");
  const pageModulePath = resolve(pagePath);
  // 相対 import はモジュールごとのディレクトリを基準に解決する。
  // page.tsx の dir を使い回すとネストした相対 import を取り違え、
  // 同一文字列を再走査すると循環 import で無限ループになるため、
  // 解決済みパスの visited Set を持つワークキューで辿る。
  const visited = new Set([pageModulePath]);
  const queue = [pageModulePath];
  const collected = [];
  // 実 import の収集は collectLocalImportSpecifiers が担う（module の prelude だけを走査する）。
  // ガイドページはコード例として import 文そのものを描画するため、描画テキストを実 import と
  // 取り違えると未転写の本文が page 側の照合材料に混ざり「漏れなし」と誤判定する。
  while (queue.length > 0) {
    const modulePath = queue.shift();
    const moduleText = readFileSync(modulePath, "utf8");
    collected.push(moduleText);

    const moduleDir = dirname(modulePath);
    for (const relPath of collectLocalImportSpecifiers(moduleText)) {
      const candidatePaths = [
        resolve(moduleDir, `${relPath}.tsx`),
        resolve(moduleDir, `${relPath}.ts`),
        resolve(moduleDir, `${relPath}/index.tsx`),
        resolve(moduleDir, `${relPath}/index.ts`),
      ];
      for (const cp of candidatePaths) {
        if (!existsSync(cp)) continue;
        if (!visited.has(cp)) {
          visited.add(cp);
          queue.push(cp);
        }
        break;
      }
    }
  }
  pageText = collected.join("\n");
} catch (error) {
  console.error(`読み込み失敗: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(2);
}

const sourceInventory = /\.(?:md|markdown)$/i.test(sourcePath)
  ? inventoryMarkdown(sourceText)
  : inventoryHtml(sourceText);
const pageInventory = inventoryTsx(pageText);
const result = compare(sourceInventory, pageInventory);

if (flags.has("--emit-headings")) {
  // 契約テスト S-1 に貼り付ける期待値配列を出力する
  for (let level = 1; level <= 6; level += 1) {
    const headings = sourceInventory.headings.filter((h) => h.level === level).map((h) => h.text);
    console.log(`const EXPECTED_H${level} = [`);
    for (const text of headings) console.log(`  ${JSON.stringify(text)},`);
    console.log(`] as const;${level < 6 ? "\n" : ""}`);
  }
  process.exit(0);
}

if (flags.has("--json")) {
  console.log(
    JSON.stringify(
      {
        source: sourcePath,
        page: pagePath,
        ...result,
        missingHeadings: result.missingHeadings,
        extraHeadings: result.extraHeadings,
      },
      null,
      2
    )
  );
  process.exit(result.blocking ? 1 : 0);
}

console.log(`source: ${sourcePath}`);
console.log(`page  : ${pagePath}\n`);
console.log("要素              原本    page.tsx  （参考値。判定は下の照合結果で行う）");
for (const [key, value] of Object.entries(result.counts)) {
  console.log(
    `${key.padEnd(16)}  ${String(value.source).padStart(5)}  ${String(value.page).padStart(8)}`
  );
}

if (result.missingHeadings.length > 0) {
  console.log(`\n❌ page.tsx に存在しない原本の見出し (${result.missingHeadings.length} 件):`);
  for (const h of result.missingHeadings) console.log(`  h${h.level}: ${h.text}`);
}
if (result.missingLinks.length > 0) {
  console.log(`\n❌ page.tsx に存在しない原本の外部リンク (${result.missingLinks.length} 件):`);
  for (const u of result.missingLinks) console.log(`  ${u}`);
}
if (result.missingListItems.length > 0) {
  console.log(`\n❌ page.tsx 本文に見当たらない原本のリスト項目 (${result.missingListItems.length} 件):`);
  for (const t of result.missingListItems) console.log(`  - ${t}`);
}
if (result.missingCodeBlocks.length > 0) {
  console.log(`\n❌ page.tsx に存在しない原本のコードブロック (${result.missingCodeBlocks.length} 件):`);
  for (const text of result.missingCodeBlocks) console.log(`  ${JSON.stringify(text)}`);
}
if (result.missingTableRows.length > 0) {
  console.log(`\n❌ page.tsx に存在しない原本の表行 (${result.missingTableRows.length} 件):`);
  for (const text of result.missingTableRows) console.log(`  ${JSON.stringify(text)}`);
}
if (result.missingParagraphs.length > 0) {
  console.log(`\n❌ page.tsx に存在しない原本の段落 (${result.missingParagraphs.length} 件):`);
  for (const text of result.missingParagraphs) console.log(`  ${JSON.stringify(text)}`);
}
if (result.missingSvgElements.length > 0) {
  console.log(`\n❌ page.tsx に存在しないか改変された原本の SVG (${result.missingSvgElements.length} 件)`);
}
if (result.missingCalloutElements.length > 0) {
  console.log(
    `\n❌ page.tsx に存在しないか改変された原本の callout/alert (${result.missingCalloutElements.length} 件)`
  );
}
if (!result.mermaidSourcesMatch) {
  console.log("\n❌ Mermaid ソースが原本と順序・出現回数込みで一致しません:");
  console.log(`  原本: ${JSON.stringify(result.sourceMermaidSources)}`);
  console.log(`  page: ${JSON.stringify(result.pageMermaidSources)}`);
}
if (result.extraHeadings.length > 0) {
  console.log(`\n⚠️ 原本に存在しない page.tsx の見出し (${result.extraHeadings.length} 件、要確認):`);
  for (const h of result.extraHeadings) console.log(`  h${h.level}: ${h.text}`);
}

console.log(
  result.blocking
    ? "\n判定: ❌ 移行漏れあり — Green コミット禁止。漏れを転写してから再実行すること。"
    : "\n判定: ✅ 漏れなし — Green 判定に進んでよい。"
);
process.exit(result.blocking ? 1 : 0);
