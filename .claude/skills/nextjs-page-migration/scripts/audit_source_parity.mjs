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
function decodeEntities(raw, { preserveNbsp = false } = {}) {
  return raw
    .replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (match, hex, decimal) => {
      const point = Number.parseInt(hex ?? decimal, hex === undefined ? 10 : 16);
      return point <= 0x10ffff ? String.fromCodePoint(point) : match;
    })
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, preserveNbsp ? "\u00a0" : " ")
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
 * @param {boolean} [jsx=true] - Whether the fragment is JSX rather than HTML.
 * @param {boolean} [literalBreaks=false] - Whether `<br>` in JSX strings is displayed code text.
 * @returns {string} The decoded display text: tags and identifier expressions are removed, while
 *   the literal text of string expressions is kept.
 */
function stripMarkup(fragment, jsx = true, literalBreaks = false) {
  // JSX 文字列式の中身は「そのまま表示されるテキスト」であり、HTML に見える断片も本文の一部。
  // タグ除去より前にプレースホルダへ退避しないと、原本側の &lt;style&gt; は（エンティティ復号が
  // 最後なので）生き残るのに page 側の {"<style>"} だけが消え、一致している内容が漏れとして
  // 誤検出される。復元はタグ除去の後・エンティティ復号の前に行い、両側の見え方を揃える。
  //
  // 例外は <br>。図解ラベルの改行指示として頻出し、原本側でも除去されるため、
  // 文字どおりのテキストではなく空白として扱う（比較キーは空白を落とすので原本と一致する）。
  // ただしコードブロックの <br> は表示される文字列そのものなので literalBreaks で保持する。
  const preserved = [];
  const stash = (text) =>
    `\u0000JSXSTR${preserved.push(literalBreaks ? text : text.replace(/<br\s*\/?>/gi, " ")) - 1}\u0000`;
  const placeholderRe = /\u0000JSXSTR(\d+)\u0000/g;

  let text = fragment;
  if (jsx) {
    text = text
      // 文字列式と JSX コメントは同じ走査で左から消費する。コメント除去を先に別走査すると、
      // 文字列として表示される `{/* … */}` まで消える。
      // 式内のブロックコメント（`{"http://…" /* NOSONAR */}` 等）は表示されないため読み飛ばす。
      .replace(/\{\s*(?:\/\*[\s\S]*?\*\/\s*)*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)\s*(?:\/\*[\s\S]*?\*\/\s*)*\}|\{\/\*[\s\S]*?\*\/\}/g,
        (_match, double, single, template) => {
          const literal = double ?? single ?? template;
          return literal === undefined ? "" : stash(decodeQuotedEntryEscapes(literal));
        })
      .replace(/\{\s*(?:styles\.[A-Za-z0-9_-]+|[A-Za-z_$][\w$]*)\s*\}/g, "");
  }
  // 引用値は 1 単位で消費する。`[^>]*` だと title="a>b" の `>` でタグが閉じたと誤認し、
  // 残りの属性（`b" id="demo">`）が本文として混入する。
  text = text.replace(/<(?:[^>"']|"[^"]*"|'[^']*')*>/g, "");
  // エンティティ復号は JSX 文字列の復元より前に行う。React は {"&lt;"} を復号せず文字どおり表示するため、
  // 復元後に復号すると text/plain 由来の原本（textContent でそのまま表示）と食い違う。
  text = decodeEntities(text);

  // 退避は入れ子になりうる（テンプレートリテラル式の中に "..." 式がある等）。
  // String.replace は差し込んだ文字列を再走査しないため、1 回では内側のプレースホルダが
  // 生テキストとして残り、その区間の本文が丸ごと欠落する。解けなくなるまで繰り返す。
  // 内側は必ず先に採番されるので添字は単調減少し、ループは必ず停止する。
  while (placeholderRe.test(text)) {
    placeholderRe.lastIndex = 0;
    text = text.replace(placeholderRe, (_match, index) => preserved[Number(index)]);
  }

  return text;
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
 * @param {boolean} [jsx=true] - Whether the content is JSX rather than HTML.
 * @param {boolean} [literalBreaks=false] - Whether `<br>` in JSX strings is displayed code text.
 * @returns {string} Text with markup and JSX whitespace expressions removed.
 */
function normalizeElementContent(raw, jsx = true, literalBreaks = false) {
  return normalize(stripMarkup(raw, jsx, literalBreaks));
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

/** JS の文字列リテラル。\x60 はバッククォートで、テンプレートの `${…}` も文字列本体として読み飛ばす。 */
const JS_STRING_LITERAL = String.raw`"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\x60(?:[^\x60\\]|\\.)*\x60`;

/** JSX 式。文字列内の `}` で閉じたと誤認しないよう文字列を 1 単位で消費し、波括弧の入れ子は 1 段まで許容する。 */
const JSX_EXPRESSION = String.raw`\{(?:[^{}"'\x60]|${JS_STRING_LITERAL}|\{(?:[^{}"'\x60]|${JS_STRING_LITERAL})*\})*\}`;

/** 開始タグの属性 1 組（名前なしの `{...props}` を含む）。値の種類ごとに捕捉する。 */
const TAG_ATTRIBUTE_RE = new RegExp(
  String.raw`${JSX_EXPRESSION}|([^\s"'<>/={}]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(${JSX_EXPRESSION})|([^\s"'=<>\x60{}]+)))?`,
  "g"
);

/** good トークンを variant 指定として扱う属性名（小文字）。 */
const VARIANT_ATTRIBUTE_NAMES = new Set(["class", "classname", "variant", "data-variant", "data-testid"]);

/** A `textContent` or `text` template-literal key after blankNonCodeText (body blanked, length kept). */
const TEMPLATE_TEXT_CONTENT_KEY = String.raw`\x60 *\x60`;

/**
 * Confirms that a write matched in masked source names textContent or text in the raw source.
 * Masking keeps offsets, so a blanked template key is checked at the same position.
 * @param {RegExpMatchArray} write - A match against the masked source.
 * @param {string} rawSource - The unmasked source with identical offsets.
 * @return {boolean} False only for a blanked template key that is not `textContent` or `text`.
 */
function isTextContentKey(write, rawSource) {
  // Comments between tokens are not code: validate syntax with them blanked; keys come from the raw text.
  const raw = rawSource.slice(write.index, write.index + write[0].length).replace(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g, " ");
  if (/(?:^|[^\]])\.\s*(?:textContent|text)\b\s*(?:(?:[-+*/%&|^]|\*\*|<<|>>>?|&&|\|\||\?\?)?=|\+\+|--)?$/.test(raw)) {
    return true;
  }
  const key = /\[\s*(?:'((?:[^'\\\r\n]|\\[\s\S])*)'|"((?:[^"\\\r\n]|\\[\s\S])*)"|\x60((?:[^\x60\\$]|\\[\s\S]|\$(?!\{))*)\x60)\s*\]\s*(?:(?:[-+*/%&|^]|\*\*|<<|>>>?|&&|\|\||\?\?)?=|\+\+|--)?$/.exec(raw);
  if (!key) return false;
  const rawKey = key[1] ?? key[2] ?? key[3] ?? "";
  const decoded = rawKey.replace(/\\(?:u\{([0-9a-fA-F]+)\}|u([0-9a-fA-F]{4})|x([0-9a-fA-F]{2})|(?:\r\n?|\n|\u2028|\u2029)|([\s\S]))/g, (_all, braced, unicode, hex, simple) => {
    if (braced !== undefined || unicode !== undefined || hex !== undefined) {
      const code = Number.parseInt(braced ?? unicode ?? hex, 16);
      return code <= 0x10ffff ? String.fromCodePoint(code) : "";
    }
    if (simple === undefined) return "";
    return ({ n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", v: "\v", 0: "\0" })[simple] ?? simple;
  });
  return decoded === "textContent" || decoded === "text";
}

/**
 * Tests whether a scheduler handle is cancelled by the matching cancel API.
 * @param {string} executable - Comment- and string-masked script source.
 * @param {string} handle - The identifier holding the scheduler return value.
 * @param {string} scheduler - The scheduling function name.
 * @return {boolean} True only for a cancel call that pairs with the scheduler; microtasks are never cancellable.
 */
function cancelsSchedulerHandle(executable, handle, scheduler) {
  const cancel = { setTimeout: "clearTimeout|clearInterval", setInterval: "clearInterval|clearTimeout", requestAnimationFrame: "cancelAnimationFrame" }[scheduler];
  if (!cancel || handle === undefined) return false;
  return new RegExp(String.raw`(?<![\w$])(?:${cancel})\s*\(\s*${handle.replace(/\$/g, "\\$")}\s*\)`).test(executable);
}

/**
 * Removes generated materialized chart elements using a quote-aware tag scan, so markup that
 * merely appears inside another tag's attribute value is preserved with its surrounding prose.
 * @param {string} html - Markup that may contain generated chart elements.
 * @return {string} The markup without the generated chart elements.
 */
function removeMaterializedCharts(html) {
  const tag = /<[A-Za-z][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>/g;
  const chartOpen = /^<div\s+class="mermaid"\s+data-audit-materialized="1"\s*>$/i;
  let out = "";
  let last = 0;
  let match;
  while ((match = tag.exec(html)) !== null) {
    if (!chartOpen.test(match[0])) continue;
    const closeAt = html.slice(tag.lastIndex).search(/<\/div>/i);
    if (closeAt < 0) continue;
    out += html.slice(last, match.index);
    last = tag.lastIndex + closeAt + "</div>".length;
    tag.lastIndex = last;
  }
  return out + html.slice(last);
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
  for (const marker of markerSource.matchAll(/(?:callout|alert|warning|warn|note|info|tip|success)/gi)) {
    const value = marker[0].toLowerCase();
    markers.add(value === "warning" ? "warn" : value === "note" ? "info" : value);
  }
  // good は "good-practices" 等の id にも含まれやすいため、variant 系属性の完全一致トークンに限って tip とみなす。
  // 属性は左から 1 組ずつ消費してから名前を比較する。名前の検索だと title='x class="good"' の
  // 引用値内にも一致し、他の属性の説明文から tip が付いてしまう。
  for (const attribute of openingTag.matchAll(TAG_ATTRIBUTE_RE)) {
    if (!VARIANT_ATTRIBUTE_NAMES.has(attribute[1]?.toLowerCase())) continue;
    const value = attribute[2] ?? attribute[3] ?? attribute[4] ?? attribute[5] ?? "";
    if (value.split(/[^\w-]+/).some((token) => token.toLowerCase() === "good")) markers.add("tip");
  }
  if (!["warn", "info", "tip", "success"].some((variant) => markers.has(variant))) {
    markers.add("info");
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

// アイコンフォントのクラス（ti-alert-triangle、fa-warning、icon-alert 等）。<i> の callout 判定から除く。
const ICON_CLASS_TOKEN_RE = /(^|[\s"'{])(?:ti|fa[a-z]?|bi|mdi|icon)-[\w-]*/gi;

/**
 * Collects callout and alert elements from markup source.
 * @param {string} src - The markup source to inspect.
 * @returns {Array} The normalized callout and alert elements found in the source.
 */
function collectMarkupCalloutElements(src, htmlMode = false) {
  // <i> はアイコン用途が多いため、ti-alert-triangle 等のアイコンクラスのトークンだけを除いて判定・正規化する。
  // 明示的な callout／alert クラスや variant 属性を持つ <i> は棚卸し対象に残し、その marker は保持する。
  const withoutIconTokens = (openingTag) =>
    /^<i\b/i.test(openingTag) ? openingTag.replace(ICON_CLASS_TOKEN_RE, "$1") : openingTag;
  return extractElementContents(
    src,
    (openingTag) =>
      /<(?:Callout|Alert)\b|(?:class|className)\s*=\s*(?:["'][^"']*(?:callout|alert)|\{[^}]*styles\.(?:callout|alert))|data-(?:testid|variant)\s*=\s*["'](?:callout|alert|warn|warning|info|note|good|success|tip)/i.test(
        withoutIconTokens(openingTag)
      ),
    false,
    false,
    null,
    htmlMode
  ).map(({ openingTag, content }) => normalizeCalloutElement(withoutIconTokens(openingTag), content));
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
  const re = new RegExp(`<${tag}\\b(?:[^>"']|"[^"]*"|'[^']*')*>([\\s\\S]*?)<\\/${tag}>`, "gi");
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
 * @param {boolean} includeNested - Also visit descendants of a matching element.
 * @returns {Array<{index: number, end: number, openingTag: string, content: string}>} Elements and their source positions.
 */
const HTML_VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

function isSelfClosingTag(openingTag) {
  const match = /^<[A-Za-z][\w.-]*\b([\s\S]*)>$/.exec(openingTag);
  if (!match) return false;
  let rest = match[1];
  while (rest.length > 0) {
    rest = rest.replace(/^\s+/, "");
    if (!rest) return false;
    if (rest === "/") return true;
    const attr = rest.startsWith("{")
      ? /^\{[^}]*\}/.exec(rest)
      : /^[^\s"'=<>`/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^\s"'=<>`]+))?/.exec(rest);
    if (!attr) return false;
    rest = rest.slice(attr[0].length);
  }
  return false;
}

const HTML_P_AUTO_CLOSE_TAGS = new Set([
  "address", "article", "aside", "blockquote", "details", "div", "dl", "fieldset",
  "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6",
  "header", "hgroup", "hr", "main", "menu", "nav", "ol", "p", "pre", "search",
  "section", "table", "ul",
]);
const HTML_LIST_CONTAINER_TAGS = new Set(["ul", "ol", "menu"]);

const HTML_FOREIGN_CONTAINERS = new Set(["svg", "math"]);

function computeForeignRanges(src) {
  const ranges = [];
  const stack = [];
  const tagRe = /<!--[\s\S]*?-->|<(\/?)([A-Za-z][\w.-]*)\b(?:[^>"']|"[^"]*"|'[^']*')*>/g;
  let match = tagRe.exec(src);
  while (match !== null) {
    const tag = match[2]?.toLowerCase();
    if (tag && HTML_FOREIGN_CONTAINERS.has(tag)) {
      if (match[1] === "/") {
        for (let i = stack.length - 1; i >= 0; i -= 1) {
          if (stack[i].tag === tag) {
            const opened = stack.splice(i, 1)[0];
            if (stack.length === 0) {
              ranges.push({ start: opened.openEnd, end: match.index });
            }
            break;
          }
        }
      } else if (!isSelfClosingTag(match[0])) {
        stack.push({ tag, openEnd: tagRe.lastIndex });
      }
    }
    match = tagRe.exec(src);
  }
  if (stack.length > 0) {
    ranges.push({ start: stack[0].openEnd, end: src.length });
  }
  return ranges;
}

function extractElementContents(src, predicate, includeNested = false, includeVoid = false, unsupportedBoundaries = null, htmlMode = false) {
  const results = [];
  const foreignRanges = htmlMode ? computeForeignRanges(src) : [];
  const inForeign = (pos) => foreignRanges.some((r) => pos >= r.start && pos < r.end);
  const isSelfClosingInContext = (tagStr, tagName, pos) =>
    HTML_VOID_ELEMENTS.has(tagName) || ((!htmlMode || inForeign(pos)) && isSelfClosingTag(tagStr));
  const openingRe = /<([A-Za-z][\w.-]*)\b(?:[^>"']|"[^"]*"|'[^']*')*>/g;
  let opening = openingRe.exec(src);
  while (opening !== null) {
    const openingTag = opening[0];
    const tag = opening[1].toLowerCase();
    const isVoid = isSelfClosingInContext(openingTag, tag, opening.index);
    if (isVoid) {
      if (includeVoid && predicate(openingTag)) {
        results.push({
          index: opening.index,
          openingTag,
          content: "",
          end: openingRe.lastIndex,
        });
      }
    } else if (predicate(openingTag)) {
      const nestedRe = /<!--[\s\S]*?-->|<(\/?)([A-Za-z][\w.-]*)\b(?:[^>"']|"[^"]*"|'[^']*')*>/g;
      nestedRe.lastIndex = openingRe.lastIndex;
      let depth = 1;
      let listDepth = 0;
      let closed = false;
      let boundaryEnd = src.length;
      let nested = nestedRe.exec(src);
      while (nested !== null) {
        const nestedTag = nested[2]?.toLowerCase();
        if (!nestedTag) {
          nested = nestedRe.exec(src);
          continue;
        }
        if (unsupportedBoundaries) {
          if (tag === "li") {
            if (HTML_LIST_CONTAINER_TAGS.has(nestedTag)) {
              if (nested[1] === "/") {
                if (listDepth === 0) {
                  boundaryEnd = nested.index;
                  break;
                }
                listDepth -= 1;
              } else if (!isSelfClosingInContext(nested[0], nestedTag, nested.index)) {
                listDepth += 1;
              }
              nested = nestedRe.exec(src);
              continue;
            }
            if (nestedTag === "li" && listDepth === 0) {
              if (nested[1] === "/") {
                depth = 0;
                closed = true;
                results.push({
                  index: opening.index,
                  openingTag,
                  content: src.slice(openingRe.lastIndex, nested.index),
                  end: nestedRe.lastIndex,
                });
                if (!includeNested) openingRe.lastIndex = nestedRe.lastIndex;
                break;
              }
              // An opening <li> at listDepth 0 implicitly closes the current <li> (omitted </li>).
              boundaryEnd = nested.index;
              break;
            }
            nested = nestedRe.exec(src);
            continue;
          }
          if (tag === "p" && nested[1] !== "/" && HTML_P_AUTO_CLOSE_TAGS.has(nestedTag)) {
            boundaryEnd = nested.index;
            break;
          }
        }
        if (nestedTag !== tag) {
          nested = nestedRe.exec(src);
          continue;
        }
        if (nested[1] === "/") depth -= 1;
        else if (!isSelfClosingInContext(nested[0], nestedTag, nested.index)) depth += 1;
        if (depth === 0) {
          closed = true;
          results.push({
            index: opening.index,
            openingTag,
            content: src.slice(openingRe.lastIndex, nested.index),
            end: nestedRe.lastIndex,
          });
          if (!includeNested) openingRe.lastIndex = nestedRe.lastIndex;
          break;
        }
        nested = nestedRe.exec(src);
      }
      if (!closed && unsupportedBoundaries) {
        unsupportedBoundaries.push({
          index: opening.index,
          openingTag,
          content: src.slice(openingRe.lastIndex, boundaryEnd),
          end: boundaryEnd,
        });
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
    /\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*(String\.raw\s*)?(?:`([\s\S]*?)`|"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')\s*;/g;
  let constant = constantRe.exec(src);
  while (constant !== null) {
    const value = constant[3] ?? constant[4] ?? constant[5] ?? "";
    // 復号を抑止するのは接頭辞として String.raw を持つ場合だけ。値の中の "String.raw" という
    // テキストで判定すると、通常の文字列定数のエスケープまで生のまま残る。
    constants.set(constant[1], constant[3] !== undefined || constant[2] !== undefined ? value : decodeQuotedEntryEscapes(value));
    constant = constantRe.exec(src);
  }
  return constants;
}

/**
 * Resolves simple string constant references embedded in JSX content.
 * @param {string} content - The JSX element content.
 * @param {Map<string, string>} constants - The string constants available for resolution.
 * @param {boolean} [asStringExpression=false] - Whether to keep values as JSX string expressions.
 * @returns {string} The content with recognized constant references replaced by their values.
 */
function resolveStringConstants(content, constants, asStringExpression = false) {
  return content.replace(/\{\s*([A-Za-z_$][\w$]*)\s*\}/g, (expression, name) => {
    if (!constants.has(name)) return expression;
    const value = constants.get(name);
    // コード本文の定数は表示テキストなので、タグとして除去されないよう文字列式のまま渡す。
    return asStringExpression ? `{${JSON.stringify(value)}}` : value;
  });
}

/**
 * Decodes `\n`, `\r`, `\'`, `\"`, `` \` ``, `\$`, and `\\` escape sequences in a single left-to-right pass.
 *
 * A sequential chain of independent `.replace()` calls (one per escape) can re-interpret
 * a decoded backslash produced by an earlier step as part of a later escape — an escaped
 * backslash immediately followed by a literal `n` (source text `\\n`) would otherwise
 * decode to a newline instead of a literal backslash + "n". Consuming each escape exactly
 * once avoids that.
 * @param {string} raw - Quoted or template-literal string content with escape sequences still literal.
 * @param {boolean} strict - Reject escapes whose runtime value is not supported.
 * @returns {string|undefined} The decoded text, or an unresolved strict literal.
 */
function decodeQuotedEntryEscapes(raw, strict = false) {
  let out = "";
  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    if (char === "\\" && index + 1 < raw.length) {
      const next = raw[index + 1];
      if (next === "x" || next === "u") {
        const braced = next === "u" && raw[index + 2] === "{";
        const pattern = braced ? /^u\{([0-9a-fA-F]+)\}/ : next === "x" ? /^x([0-9a-fA-F]{2})/ : /^u([0-9a-fA-F]{4})/;
        const escape = pattern.exec(raw.slice(index + 1));
        const value = escape && Number.parseInt(escape[1], 16);
        if (!escape || value > 0x10ffff) {
          if (strict) return undefined;
          out += char + next;
        } else {
          out += braced ? String.fromCodePoint(value) : String.fromCharCode(value);
          index += escape[0].length;
          continue;
        }
      } else if (next === "n") {
        out += "\n";
      } else if (next === "r") {
        out += "\r";
      } else if (next === "t") {
        out += "\t";
      } else if (next === "b" || next === "f" || next === "v" || (next === "0" && !/\d/.test(raw[index + 2] ?? ""))) {
        out += { b: "\b", f: "\f", v: "\v", 0: "\0" }[next];
      } else if (next === "'" || next === '"' || next === "`" || next === "\\" || next === "$") {
        out += next;
      } else {
        if (strict) return undefined;
        out += char + next;
      }
      index += 1;
      continue;
    }
    out += char;
  }
  return out;
}

/**
 * Decodes HTML character references in an attribute value in a single pass, including numeric references.
 *
 * Each reference is decoded exactly once, so `&amp;#9;` becomes the literal text `&#9;` rather than a tab.
 * @param {string} raw - The raw attribute value.
 * @returns {string} The decoded attribute value.
 */
function decodeAttributeValue(raw) {
  return raw.replace(/&(?:#(\d+)|#[xX]([0-9A-Fa-f]+)|[A-Za-z]+);/g, (match, decimal, hex) => {
    if (decimal === undefined && hex === undefined) return decodeEntities(match, { preserveNbsp: true });
    const codePoint = decimal === undefined ? Number.parseInt(hex, 16) : Number(decimal);
    return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
  });
}

/**
 * Determines whether a class attribute value contains the `mermaid` token after decoding it as a browser would.
 * @param {string} rawClass - The raw class attribute value.
 * @returns {boolean} True when one of the whitespace-separated class tokens is `mermaid`.
 */
function hasMermaidClassToken(rawClass) {
  return decodeAttributeValue(rawClass)
    .split(/[\t\n\f\r ]+/)
    .some((token) => token.toLowerCase() === "mermaid");
}

/**
 * Extracts Mermaid diagram declarations from HTML in document order.
 * @param {string} src - The complete HTML source.
 * @returns {string[]} Normalized Mermaid diagram sources found in supported HTML containers, scripts, and definitions.
 */
function collectHtmlMermaidSources(src) {
  const sources = [];
  // class の直前は空白を要求する。`\b` だと `data-class=` の `-` 直後でも一致し、
  // 後続の本物の class="mermaid" を見落とす。
  const divRe =
    /<(?:div|pre)\b([^>]*?\sclass=(["'])([^"']*)\2[^>]*)>([\s\S]*?)<\/(?:div|pre)\s*>/gi;
  let div = divRe.exec(src);
  while (div !== null) {
    if (hasMermaidClassToken(div[3])) {
      sources.push({ index: div.index, source: normalizeMermaidSource(div[4]) });
    } else {
      // 非 Mermaid の要素で本文ごと読み飛ばすと、入れ子の Mermaid 図解を見落とす。
      divRe.lastIndex = div.index + 1;
    }
    div = divRe.exec(src);
  }

  const scriptRe =
    /<script\b[^>]*\b(?:class=["'][^"']*\bmermaid-source\b[^"']*["']|id=["']src-diagram-\d+["'])[^>]*>([\s\S]*?)<\/script\s*>/gi;
  let script = scriptRe.exec(src);
  while (script !== null) {
    sources.push({ index: script.index, source: normalizeMermaidSource(script[1]) });
    script = scriptRe.exec(src);
  }

  // 非クォートキーは Unicode 識別子（"図解: `...`" 等）も許容する。CJK 見出しをキーに
  // 使う DIAGRAMS オブジェクトが実在し、ASCII 限定だと該当エントリが監査から漏れる。
  // テンプレートリテラル分岐は非貪欲な `` `([\s\S]*?)` `` だと、値の中の Mermaid ノード
  // ラベルがバッククォートを含む場合（例: `A["\`code\`"]`）、エスケープされた
  // バッククォートで閉じたと誤認し、以降の本文が丸ごと欠落する。他の分岐と同様に
  // エスケープシーケンスを読み飛ばしてから閉じバッククォートを探す。
  const diagramEntryRe =
    /(?:["'][^"']+["']|[\p{L}_$][\p{L}\p{N}_$]*)\s*:\s*(?:dedent\s*\(\s*)?(?:`((?:[^`\\]|\\.)*)`|'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"\s*\)?)/gu;
  let entry = diagramEntryRe.exec(src);
  while (entry !== null) {
    const raw = decodeQuotedEntryEscapes(entry[1] ?? entry[2] ?? entry[3] ?? "");
    sources.push({ index: entry.index, source: normalizeMermaidSource(raw) });
    entry = diagramEntryRe.exec(src);
  }

  // Plain string arrays are used by standalone guides; parse strings without executing source JS.
  // 要素間の `// …` / `/* … */` コメントも許容する。抽出は文字列を先に照合するため、
  // 文字列内の `//` や `/*`（URL を含むノードラベル等）はコメントと誤認しない。
  const arrayRe = /\b(?:const|let|var)\s+DIAGRAMS\s*=\s*\[((?:\s*(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\/\/[^\n]*|\/\*[\s\S]*?\*\/)\s*,?)+)\s*\]\s*;?/g;
  for (const array of src.matchAll(arrayRe)) {
    const tokenRe = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`|\/\/[^\n]*|\/\*[\s\S]*?\*\//g;
    for (const value of array[1].matchAll(tokenRe)) {
      const raw = value[1] ?? value[2] ?? value[3];
      if (raw === undefined) continue;
      sources.push({ index: array.index + value.index, source: normalizeMermaidSource(decodeQuotedEntryEscapes(raw)) });
    }
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
 * Masks comments, regex literals and template text, preserving executable interpolations.
 * @param {string} src - The module source text.
 * @param {boolean} preserveQuotedStrings - Keep single/double-quoted contents for literal extraction.
 * @param {{uncertain?: boolean, interpolation?: boolean}} resolution - Records unresolved code.
 * @param {boolean} stopAtClosingBrace - Stop at the end of a recursive interpolation scan.
 * @return {string} The source with non-code contents replaced by spaces, preserving offsets.
 */
function blankNonCodeText(src, preserveQuotedStrings = true, resolution = {}, stopAtClosingBrace = false, initialAsync = null, initialGenerator = false) {
  const blank = (text) => text.replace(/[^\n]/g, " ");
  let out = "";
  let index = 0;
  let canStartRegex = true;
  let lastToken = "";
  const controlParens = [];
  const braces = [];
  // Track whether `await` is a keyword (true: async function or ES module top-level),
  // an ordinary identifier (false: classic top-level or non-async function), or unknown (null).
  const asyncStack = [initialAsync === true ? true : initialAsync === false ? false : null];
  let pendingAsync = false;
  let pendingFnAsync = null;
  const parenAsyncStack = [];
  let lastParenAsync = null;
  // Track whether `yield` is inside an established generator function (`function*`).
  const generatorStack = [initialGenerator === true];
  let pendingFnGenerator = null;
  const parenGeneratorStack = [];
  let lastParenGenerator = null;
  // Consume whole Unicode identifiers (incl. \u escapes) so `πreturn` is never split into `return`.
  const wordRe = /(?:[\p{ID_Start}$_]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})(?:[\p{ID_Continue}$\u200C\u200D]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})*/uy;
  while (index < src.length) {
    const char = src[index];
    const next = src[index + 1];
    if (stopAtClosingBrace && char === "}" && braces.length === 0) break;
    if (char === "/" && next === "/") {
      // JavaScript line terminators: LF, CR, LS (U+2028) and PS (U+2029). Code after any
      // of them is executable and must stay visible (e.g. a following mermaid.render call).
      const lineEnd = src.slice(index).search(/[\n\r\u2028\u2029]/);
      const stop = lineEnd === -1 ? src.length : index + lineEnd;
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
    if (char === "/" && canStartRegex === null) resolution.uncertain = true;
    if (char === "/" && canStartRegex === true) {
      let cursor = index + 1;
      let inClass = false;
      while (cursor < src.length && src[cursor] !== "\n" && src[cursor] !== "\r") {
        if (src[cursor] === "\\") { cursor += 2; continue; }
        if (src[cursor] === "[") inClass = true;
        else if (src[cursor] === "]") inClass = false;
        else if (src[cursor] === "/" && !inClass) break;
        cursor++;
      }
      if (src[cursor] === "/") {
        cursor++;
        while (/[A-Za-z]/.test(src[cursor] ?? "")) cursor++;
        out += blank(src.slice(index, cursor));
        index = cursor;
        canStartRegex = false;
        lastToken = "regex";
        continue;
      }
    }
    if (char === "`" || char === '"' || char === "'") {
      let cursor = index + 1;
      let maskedBody = "";
      while (cursor < src.length) {
        if (src[cursor] === "\\") {
          maskedBody += blank(src.slice(cursor, cursor + 2));
          cursor += 2;
          continue;
        }
        if (src[cursor] === char) break;
        if (char !== "`" && src[cursor] === "\n") break;
        if (char === "`" && src[cursor] === "$" && src[cursor + 1] === "{") {
          // Interpolations execute code. Keep it offset-aligned for discovery,
          // including nested templates, while declining to evaluate its effects.
          resolution.interpolation = true;
          const expression = blankNonCodeText(src.slice(cursor + 2), preserveQuotedStrings, resolution, true, asyncStack.at(-1) ?? null, generatorStack.at(-1) ?? false);
          (resolution.interpolations ??= []).push(expression);
          maskedBody += "${" + expression;
          cursor += 2 + expression.length;
          if (src[cursor] === "}") { maskedBody += "}"; cursor++; }
          else resolution.uncertain = true;
          continue;
        }
        maskedBody += blank(src[cursor]);
        cursor += 1;
      }
      const body = src.slice(index + 1, Math.min(cursor, src.length));
      out += char + (char === "`" ? maskedBody : !preserveQuotedStrings ? blank(body) : body) + (src[cursor] === char ? char : "");
      index = Math.min(cursor + (src[cursor] === char ? 1 : 0), src.length);
      canStartRegex = false;
      lastToken = "string";
      continue;
    }
    wordRe.lastIndex = index;
    const word = wordRe.exec(src)?.[0];
    if (word) {
      // An escaped spelling (\u0073rc) names the same binding as its decoded form, which the
      // textual binding analysis cannot match without shifting offsets: leave it unresolved.
      if (word.includes("\\")) resolution.uncertain = true;
      out += word;
      index += word.length;
      if (lastToken !== "." && word === "async") {
        pendingAsync = true;
      } else if (lastToken !== "." && word === "function") {
        pendingFnAsync = pendingAsync;
        pendingAsync = false;
        pendingFnGenerator = false;
      } else if (lastToken !== "function") {
        // Keep pendingAsync only across `async` followed by `function`, `*`, `(`, or a single-param arrow identifier.
        if (lastToken !== "async") pendingAsync = false;
      }
      if (lastToken === ".") {
        canStartRegex = false;
      } else if (word === "await") {
        // `await` is only a unary operator keyword in async functions or ES module top-level;
        // in non-async contexts (or declaration heads) it is an identifier, so `/` is division.
        const declHead = /^(?:var|let|const|function|class)$/.test(lastToken);
        const asyncCtx = asyncStack.at(-1) ?? null;
        canStartRegex = declHead ? false : asyncCtx === true ? true : asyncCtx === false ? false : null;
      } else if (word === "yield") {
        // `yield` is only a unary operator keyword when generator context is established;
        // otherwise it may be an identifier, so leave `/` unresolved rather than masking code.
        const declHead = /^(?:var|let|const|function|class)$/.test(lastToken);
        canStartRegex = declHead ? false : generatorStack.at(-1) === true ? true : null;
      } else {
        canStartRegex = /^(?:return|throw|case|delete|void|typeof|instanceof|in|else|do)$/.test(word)
          // `of` is an ordinary identifier outside a for head; leave its slash unresolved.
          || (word === "of" ? null : false);
      }
      // A member name (obj.if) is a property, never a control keyword or statement head.
      lastToken = lastToken === "." ? "member" : word;
      continue;
    }
    if ((char === "+" || char === "-") && next === char) {
      out += char + next;
      index += 2;
      canStartRegex = false;
      lastToken = char + next;
      continue;
    }
    if (char === "=" && next === ">") {
      out += "=>";
      index += 2;
      canStartRegex = true;
      pendingFnAsync = lastParenAsync !== null ? lastParenAsync : pendingAsync;
      pendingAsync = false;
      lastParenAsync = null;
      pendingFnGenerator = false;
      lastParenGenerator = null;
      lastToken = "=>";
      continue;
    }
    if (!/\s/.test(char)) {
      if (char === "*" && lastToken === "function") {
        pendingFnGenerator = true;
      }
      if (char === "(") {
        const isControl = /^(?:if|while|for|with|switch|catch)$/.test(lastToken);
        controlParens.push(isControl);
        parenAsyncStack.push(pendingFnAsync !== null ? pendingFnAsync : pendingAsync ? true : null);
        pendingAsync = false;
        pendingFnAsync = null;
        parenGeneratorStack.push(pendingFnGenerator);
        pendingFnGenerator = null;
      }
      if (char === "{") {
        // Object expressions end an operand; statement blocks permit a new regex.
        // A colon may end a label or case (statement block) or a property/ternary
        // (object expression), so it stays ambiguous like callable bodies.
        braces.push(/^(?:=|\(|\[|,|return|yield)$/.test(lastToken) ? false
          : /^(?:;|\{|else|try|finally|do|control-end)$/.test(lastToken) || lastToken === "" ? true : null);
        if (pendingFnAsync !== null) {
          asyncStack.push(pendingFnAsync);
          pendingFnAsync = null;
        } else if (lastToken === ")" && lastParenAsync !== null) {
          asyncStack.push(lastParenAsync);
        } else {
          asyncStack.push(asyncStack.at(-1) ?? null);
        }
        lastParenAsync = null;
        pendingAsync = false;
        if (pendingFnGenerator !== null) {
          generatorStack.push(pendingFnGenerator);
          pendingFnGenerator = null;
        } else if (lastToken === ")" && lastParenGenerator !== null) {
          generatorStack.push(lastParenGenerator);
        } else {
          generatorStack.push(generatorStack.at(-1) ?? false);
        }
        lastParenGenerator = null;
      }
      if (char === "}") {
        if (asyncStack.length > 1) asyncStack.pop();
        lastParenAsync = null;
        pendingAsync = false;
        pendingFnAsync = null;
        if (generatorStack.length > 1) generatorStack.pop();
        lastParenGenerator = null;
        pendingFnGenerator = null;
      }
      const controlEnd = char === ")" && (controlParens.pop() ?? false);
      if (char === ")") {
        lastParenAsync = parenAsyncStack.pop() ?? null;
        lastParenGenerator = parenGeneratorStack.pop() ?? null;
      } else if (char === ";") {
        pendingAsync = false;
        pendingFnAsync = null;
        lastParenAsync = null;
        pendingFnGenerator = null;
        lastParenGenerator = null;
      }
      canStartRegex = char === "}" ? (braces.pop() ?? null)
        : char === ")" ? controlEnd : /[=(:,\[!&|?{;+\-*/%~^<>]/.test(char);
      lastToken = controlEnd ? "control-end" : char;
    }
    out += char;
    index += 1;
  }
  return out;
}

/** 読み飛ばしてよいトップレベル宣言の開始キーワード。これ以外に出会ったら走査を止める。 */
const DECLARATION_HEAD_RE = /(?:export|const|let|var|type|interface|declare|enum)\b/y;

/** 実行される本体を持たない宣言（型エイリアス・interface・ambient 宣言）の先頭。 */
const TYPE_ONLY_HEAD_RE = /^\s*(?:export\s+(?:default\s+)?)?(?:declare\b|(?:declare\s+)?(?:type|interface)\b)/;

/**
 * Skips the quoted string that starts at the given position.
 * @param {string} code - The module source with comments and template literal bodies blanked.
 * @param {number} start - The index of the opening quote.
 * @returns {number} The index of the closing quote, or the end of the source when unterminated.
 */
function skipQuoted(code, start) {
  const quote = code[start];
  let index = start + 1;
  while (index < code.length) {
    if (code[index] === "\\") {
      index += 2;
      continue;
    }
    if (code[index] === quote) return index;
    if (quote !== "`" && code[index] === "\n") return index - 1;
    index += 1;
  }
  return code.length;
}

/**
 * Removes insignificant whitespace from code while keeping string, template and regex literals intact.
 *
 * Whitespace between two identifier characters collapses to one space. Returns `undefined` when the
 * text cannot be compared safely (unterminated literal, comment), so callers must treat it as unresolved.
 *
 * @param {string} text - Source text to compact.
 * @returns {string | undefined} Compacted text, or undefined when literals cannot be delimited.
 */
function compactCodePreservingLiterals(text) {
  let out = "";
  let prev = "";
  let pendingSpace = false;
  let pendingLine = false;
  let ahead = "";
  const emit = chunk => {
    // A line terminator only changes automatic semicolon insertion inside restricted
    // productions: after return/throw/break/continue/yield/async, or before postfix
    // ++/--. Keep it distinguishable there; elsewhere it is ordinary whitespace.
    if (pendingLine && (/(?:^|[^\w$])(?:return|throw|break|continue|yield|async)$/.test(out) || /^(?:\+\+|--)/.test(ahead))) out += "\n";
    else if (pendingSpace && /[\w$]/.test(out.at(-1) ?? "") && /[\w$]/.test(chunk[0])) out += " ";
    pendingSpace = false;
    pendingLine = false;
    out += chunk;
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    ahead = text.slice(i, i + 2);
    if (c === "'" || c === '"' || c === "`") {
      const end = skipQuoted(text, i);
      if (text[end] !== c) return undefined;
      emit(text.slice(i, end + 1));
      i = end;
      prev = c;
      continue;
    }
    if (c === "/") {
      if (text[i + 1] === "/" || text[i + 1] === "*") return undefined;
      if (!prev || "(,=:[!&|?{};".includes(prev)) {
        let j = i + 1;
        let inClass = false;
        while (j < text.length && (inClass || text[j] !== "/")) {
          if (text[j] === "\n") return undefined;
          if (text[j] === "\\") j++;
          else if (text[j] === "[") inClass = true;
          else if (text[j] === "]") inClass = false;
          j++;
        }
        if (j >= text.length) return undefined;
        while (/[a-z]/i.test(text[j + 1] ?? "")) j++;
        emit(text.slice(i, j + 1));
        i = j;
        prev = "/";
        continue;
      }
    }
    if (/\s/.test(c)) {
      pendingSpace = true;
      if (/[\n\r\u2028\u2029]/.test(c)) pendingLine = true;
      continue;
    }
    emit(c);
    prev = c;
  }
  return out;
}

/**
 * Masks balanced type-parameter and type-argument lists while preserving source offsets.
 *
 * Arrow operators inside these lists are ignored so function-type syntax does not close the list.
 * @param {string} head - The declaration head to mask.
 * @return {string} The head with each balanced angle-bracket list replaced by spaces.
 */
function maskTypeArguments(head) {
  const chars = [...head];
  const opens = [];
  for (let index = 0; index < chars.length; index += 1) {
    if (chars[index] === "=" && chars[index + 1] === ">") {
      index += 1;
      continue;
    }
    if (chars[index] === "<") opens.push(index);
    else if (chars[index] === ">" && opens.length > 0) {
      for (let cursor = opens.pop(); cursor <= index; cursor += 1) chars[cursor] = " ";
    }
  }
  return chars.join("");
}

/**
 * Finds the `=` that opens a declaration's initializer.
 *
 * Everything before it is a type annotation, where an arrow is just part of a function type.
 * Arrows and comparison operators contain an `=` of their own, so they are stepped over rather
 * than mistaken for the boundary.
 * @param {string} head - The declaration head with its type-argument lists already masked.
 * @returns {number} The index of the initializer `=`, or -1 when the declaration has no initializer.
 */
function initializerBoundary(head) {
  for (let index = 0; index < head.length; index += 1) {
    if (head[index] !== "=") continue;
    // `=>` / `==` / `===` / `!=` / `<=` / `>=` はいずれも初期化子の開始ではない。
    if (head[index + 1] === ">" || head[index + 1] === "=") continue;
    if (index > 0 && "=!<>".includes(head[index - 1])) continue;
    return index;
  }
  return -1;
}

/**
 * Advances past a top-level declaration when it can be safely skipped during import scanning.
 * @param {string} code - Module source with comments and template literal bodies blanked.
 * @param {number} start - Position at the beginning of the declaration.
 * @returns {number} The position after the declaration, or `-1` if scanning must stop.
 */
function skipTopLevelDeclaration(code, start) {
  DECLARATION_HEAD_RE.lastIndex = start;
  if (!DECLARATION_HEAD_RE.test(code)) return -1;
  const headEnd = code.slice(start).search(/[{;\n]/);
  const head = headEnd === -1 ? code.slice(start) : code.slice(start, start + headEnd);
  // 型引数リストを伏せてから境界を探す。伏せないと `<T = string>` の `=` を初期化子の開始と
  // 誤認し、`new Map<string, () => void>()` の型引数内のアローを実行本体の開始と誤認する。
  // どちらも走査を止め、後続の実 import 配下の本文が監査対象から丸ごと外れる。
  const maskedHead = maskTypeArguments(head);
  const boundary = initializerBoundary(maskedHead);
  const initializer = boundary === -1 ? "" : maskedHead.slice(boundary + 1);
  if (!TYPE_ONLY_HEAD_RE.test(head) && (/\b(?:function|class)\b/.test(head) || /=>/.test(initializer)))
    return -1;

  let depth = 0;
  let index = start;
  while (index < code.length) {
    const char = code[index];
    if (char === '"' || char === "'" || char === "`") {
      index = skipQuoted(code, index) + 1;
      continue;
    }
    if (char === "(" || char === "[" || char === "{") depth += 1;
    else if (char === ")" || char === "]" || char === "}") {
      depth -= 1;
      if (depth < 0) return -1;
      // ブロックで閉じる宣言（`interface X { … }` 等）はセミコロンを伴わないことがある。
      if (depth === 0 && char === "}" && !/^\s*;/.test(code.slice(index + 1))) return index + 1;
    } else if (char === ";" && depth === 0) return index + 1;
    index += 1;
  }
  return -1;
}

/**
 * Collects relative module specifiers from import declarations in a module's prelude.
 *
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
    if (declaration === null) {
      // import 群の途中に挟まったトップレベル宣言（`export const revalidate = false;` 等）で
      // 走査を止めると、後続の実 import 配下の本文が丸ごと監査対象から外れる。
      const resumed = skipTopLevelDeclaration(code, cursor);
      if (resumed === -1) break;
      cursor = resumed;
      continue;
    }
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
 * @param {string} src - The HTML source to inspect.
 * @return {Object} The inventory of headings, lists, code blocks, table rows, paragraphs, Mermaid sources, SVG elements, callouts, and external links.
 */
function readHtmlAttribute(attributes, name) {
  // 属性を左から順に「名前＋値」の 1 組ずつ消費してから名前を比較する。名前の検索だと
  // title="x id=other" の引用値内の id= に一致し、data-id= の id にも一致しうる。
  const attributeRe = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  const wanted = name.toLowerCase();
  for (const match of attributes.matchAll(attributeRe)) {
    // 値はブラウザと同じく文字参照を復号してから返す。data-for="a&amp;b" と id="a&#38;b" は
    // どちらも "a&b" を指すため、生の値で比較すると対応するコード本文が監査から外れる。
    if (match[1].toLowerCase() === wanted) return decodeAttributeValue(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return undefined;
}

const htmlAttributesPattern = String.raw`((?:[^>"']|"[^"]*"|'[^']*')*)`;

/** Prove ordinary initialization and all enclosing callable activations precede rendering. */
/** Braced function bodies in source order: { start, body (open brace), end (after close), name, nameIndex }. */
function functionBodies(executable) {
  return Array.from(executable.matchAll(/\bfunction(?:\s*\*)?(?:\s+([A-Za-z_$][\w$]*))?\s*\([^(){}]*\)\s*\{|(?:\([^(){}]*\)|[A-Za-z_$][\w$]*)\s*=>\s*\{/g), head => {
    const body = head.index + head[0].length - 1;
    let depth = 1;
    let end = body + 1;
    while (end < executable.length && depth > 0) {
      if (executable[end] === "{") depth++;
      else if (executable[end] === "}") depth--;
      end++;
    }
    return { start: head.index, body, end, name: head[1], nameIndex: head[1] ? head.index + head[0].indexOf(head[1], 8) : -1 };
  });
}

/** Loop extents (keyword through body close) for braced for/while/do loops. */
function loopExtents(executable) {
  const close = (open, pair) => {
    let depth = 0;
    for (let k = open; k < executable.length; k++) {
      if (executable[k] === pair[0]) depth++;
      else if (executable[k] === pair[1] && --depth === 0) return k;
    }
    return -1;
  };
  const loops = [];
  for (const head of executable.matchAll(/(?<![\w$.])(?:(for|while)\s*\(|do\s*\{)/g)) {
    let open = head.index + head[0].length - 1;
    if (head[1]) {
      const paren = close(open, "()");
      if (paren < 0) continue;
      open = paren + 1 + (/^\s*/.exec(executable.slice(paren + 1))[0].length);
      if (executable[open] !== "{") continue;
    }
    const end = close(open, "{}");
    if (end > 0) loops.push({ start: head.index, open, end });
  }
  return loops;
}

function initializerRunsBefore(executable, declarationIndex, initializedAt, declarationPath, positions, segments = []) {
  // An unbraced conditional/loop may skip the initializer. Require an ordinary
  // statement boundary rather than treating a lexical declaration as dominance.
  const previous = executable.slice(0, declarationIndex).trimEnd().at(-1);
  if (previous !== undefined && !";{}".includes(previous)) return false;
  // Source order inside a hoisted function is not execution order. Trace all
  // references to enclosing named functions (including aliases and callers),
  // rejecting any activation whose order relative to initialization is unknown.
  const functions = functionBodies(executable);
  // Unsupported callable syntax needs a parser to prove activation order.
  if (/=>\s*(?!\s*\{)/.test(executable) || /\bclass\b/.test(executable) ||
      Array.from(executable.matchAll(/\bfunction\b/g)).some(head => !functions.some(fn => fn.start === head.index))) return false;
  const segmentOf = index => segments.findIndex(segment => segment.start <= index && index <= segment.end);
  const checked = new Set();
  const active = new Set();
  const followsInitialization = position => {
    if (position < initializedAt) return false;
    for (const fn of functions.filter(fn => fn.body < position && position < fn.end && !declarationPath.includes(fn.body))) {
      if (checked.has(fn)) continue;
      if (active.has(fn) || fn.start < initializedAt) return false;
      active.add(fn);
      if (fn.name) {
        const fnSegment = segmentOf(fn.start);
        const references = executable.matchAll(new RegExp(`(?<![\\w$])${fn.name.replace(/\$/g, "\\$")}(?![\\w$])`, "g"));
        let hasReference = false;
        for (const reference of references) {
          if (reference.index === fn.nameIndex) continue;
          // A reference in an earlier classic script cannot activate a function declared in a later script.
          const refSegment = segmentOf(reference.index);
          if (fnSegment >= 0 && refSegment >= 0 && refSegment < fnSegment) continue;
          hasReference = true;
          if (!followsInitialization(reference.index)) return false;
        }
        if (!hasReference) return false;
      }
      active.delete(fn);
      checked.add(fn);
    }
    return true;
  };
  return positions.every(followsInitialization);
}

/** Resolve the runtime Mermaid source in this scope: undefined = unused, null = unresolved, string = evaluated. */
function rendererSuffix(literalSource, rawSource, payload, dedentedPayload, cardTag, selectedScript, foreignDomWrite = false) {
  const resolution = {};
  const executable = blankNonCodeText(rawSource, false, resolution, false, !selectedScript.classic);
  if (resolution.uncertain || resolution.interpolation) return null;
  /**
   * Collect every write to a binding anywhere in the scope: assignments, updates,
   * for-of/in heads and destructuring targets. Callbacks may run after later
   * statements, so source order before a render never proves the value.
   */
  const writeIndexes = name => {
    const id = name.replace(/\$/g, "\\$");
    const found = new Set();
    const hasEnclosingOpenParens = (index, closeCount) => {
      if (closeCount === 0) return true;
      let i = index - 1, opens = 0;
      while (i >= 0 && opens < closeCount) {
        if (/\s/.test(executable[i])) { i--; continue; }
        if (executable[i] === "(") { opens++; i--; continue; }
        return false;
      }
      return opens === closeCount;
    };
    const countClosingParens = text => (text.match(/\)/g) ?? []).length;
    const countOpeningParens = text => (text.match(/\(/g) ?? []).length;
    for (const m of executable.matchAll(new RegExp(`(?<![\\w$.])${id}((?:\\s*\\))*)\\s*(?:=(?!=|>)|(?:\\*\\*|&&|\\|\\||\\?\\?|<<|>>>?|[+\\-*/%&|^])=|\\+\\+|--)`, "g"))) {
      if (hasEnclosingOpenParens(m.index, countClosingParens(m[1]))) found.add(m.index);
    }
    for (const m of executable.matchAll(new RegExp(`(?:\\+\\+|--)\\s*((?:\\(\\s*)*)${id}((?:\\s*\\))*)(?![\\w$])`, "g"))) {
      if (countOpeningParens(m[1]) === countClosingParens(m[2])) found.add(m.index + m[0].length - m[2].length - name.length);
    }
    for (const m of executable.matchAll(new RegExp(`\\bfor\\s*\\(\\s*(?:(?:var|let|const)\\s+)?((?:\\(\\s*)*)${id}((?:\\s*\\))*)\\s+(?:of|in)\\b`, "g"))) {
      if (countOpeningParens(m[1]) === countClosingParens(m[2])) found.add(m.index + m[0].lastIndexOf(name));
    }
    if (selectedScript.classic) {
      // Classic scripts expose top-level global bindings as properties on the global object;
      // module-local bindings are not aliased on window/globalThis/self.
      const globalPrefix = "(?<![\\w$.])(?:window|globalThis|self)\\s*\\.\\s*";
      for (const m of executable.matchAll(new RegExp(`${globalPrefix}${id}((?:\\s*\\))*)\\s*(?:=(?!=|>)|(?:\\*\\*|&&|\\|\\||\\?\\?|<<|>>>?|[+\\-*/%&|^])=|\\+\\+|--)`, "g"))) {
        if (hasEnclosingOpenParens(m.index, countClosingParens(m[1]))) found.add(m.index);
      }
      for (const m of executable.matchAll(new RegExp(`(?:\\+\\+|--)\\s*((?:\\(\\s*)*)${globalPrefix}${id}((?:\\s*\\))*)(?![\\w$])`, "g"))) {
        if (countOpeningParens(m[1]) === countClosingParens(m[2])) found.add(m.index + m[0].length - m[2].length - name.length);
      }
      for (const m of executable.matchAll(new RegExp(`\\bfor\\s*\\(\\s*((?:\\(\\s*)*)${globalPrefix}${id}((?:\\s*\\))*)\\s+(?:of|in)\\b`, "g"))) {
        if (countOpeningParens(m[1]) === countClosingParens(m[2])) found.add(m.index + m[0].lastIndexOf(name));
      }
      for (const m of literalSource.matchAll(new RegExp(`(?<![\\w$.])(?:window|globalThis|self)\\s*\\[\\s*(['"])${id}\\1\\s*\\]\\s*(?:=(?!=|>)|(?:\\*\\*|&&|\\|\\||\\?\\?|<<|>>>?|[+\\-*/%&|^])=|\\+\\+|--)`, "g"))) {
        if (executable[m.index] === literalSource[m.index]) found.add(m.index);
      }
      for (const m of literalSource.matchAll(new RegExp(`(?:\\+\\+|--)\\s*(?:window|globalThis|self)\\s*\\[\\s*(['"])${id}\\1\\s*\\]`, "g"))) {
        if (executable[m.index] === literalSource[m.index]) found.add(m.index);
      }
    }
    const destructuringPattern = selectedScript.classic
      ? new RegExp(`(?<![\\w$.])(?:(?:window|globalThis|self)\\s*\\.\\s*)?${id}(?![\\w$])`, "g")
      : new RegExp(`(?<![\\w$.])${id}(?![\\w$])`, "g");
    for (const m of executable.matchAll(destructuringPattern)) {
      // An object key names a property, not this binding.
      if (/^\s*:/.test(executable.slice(m.index + m[0].length))) continue;
      let depth = 0;
      for (let i = m.index - 1; i >= 0; i--) {
        const char = executable[i];
        if (")]}".includes(char)) { depth++; continue; }
        if (!"([{".includes(char)) continue;
        if (depth) { depth--; continue; }
        // Grouping parens around a bare target (e.g. `[(src)] = x`) do not end the pattern;
        // call parens or expressions inside parens do.
        if (char === "(") {
          if (/^\s*$/.test(executable.slice(i + 1, m.index)) && !/[\w$)\]]\s*$/.test(executable.slice(0, i))) continue;
          break;
        }
        // obj[key] = value writes a member.
        if (char === "[" && /[\w$)\]]\s*$/.test(executable.slice(0, i))) break;
        let close = i + 1;
        for (let level = 1; close < executable.length; close++) {
          if ("([{".includes(executable[close])) level++;
          else if (")]}".includes(executable[close]) && --level === 0) break;
        }
        if (/^\s*(?:=(?!=|>)|(?:of|in)\b)/.test(executable.slice(close + 1))) { found.add(m.index); break; }
      }
    }
    return found;
  };
  const declarationNames = name => new Set(Array.from(executable.matchAll(new RegExp(`\\b(?:const|let|var)\\s+${name}\\s*=`, "g")),
    declaration => declaration.index + declaration[0].lastIndexOf(name)));
  const srcWasRewritten = () => {
    const initializers = declarationNames("src");
    return Array.from(writeIndexes("src")).some(write => !initializers.has(write));
  };
  const srcIsPayload = before => {
    // A parameter, catch binding or destructuring can hide the card source.
    if (/\b(?:function\b[^()]*|catch)\s*\([^)]*\bsrc\b|\([^)]*\bsrc\b[^)]*\)\s*=>|\bsrc\s*=>|\b(?:const|let|var)\s*[{[][^;]*\bsrc\b/.test(executable)) return false;
    const pathAt = position => {
      const path = [];
      for (let i = 0; i < position; i++) {
        if (executable[i] === "{") path.push(i);
        else if (executable[i] === "}") path.pop();
      }
      return path;
    };
    const functions = functionBodies(executable);
    const loops = loopExtents(executable);
    const editCanPrecedeTarget = (editIndex, targetAt) => {
      if (editIndex <= targetAt) return true;
      if (functions.some(fn => fn.body < targetAt && targetAt < fn.end)) return true;
      if (functions.some(fn => fn.body < editIndex && editIndex < fn.end)) return true;
      if (loops.some(loop => loop.start < targetAt && targetAt < loop.end)) return true;
      return false;
    };
    const hasForeignDomWriteAt = (at, captureAt = at) => {
      if (foreignDomWrite === true) return true;
      if (!foreignDomWrite) return false;
      const isDeferred = functions.some(fn => fn.body < at && at < fn.end);
      const isDeferredCapture = functions.some(fn => fn.body < captureAt && captureAt < fn.end);
      if (typeof foreignDomWrite === "function") return foreignDomWrite(at, isDeferred, captureAt, isDeferredCapture);
      return foreignDomWrite === "deferred" && isDeferred;
    };
    // A `var` declared in a loop is one binding shared by every iteration. A read from a
    // callback created outside its declaring function sees whatever value the loop left
    // there when the callback runs (the final card), so the per-iteration capture is unproven.
    const sharedAcrossDeferredRead = (declarationIndex, at) => functions.some(fn =>
      fn.body < at && at < fn.end && !(fn.body < declarationIndex && declarationIndex < fn.end) &&
      loops.some(loop => loop.start <= declarationIndex && declarationIndex < loop.end));
    // Resolve the binding visible at `at`, with the position its initializer runs.
    // References inside that initializer resolve there, not at the later use.
    const bindingAt = (name, at = before) => {
      const callPath = pathAt(at);
      const hidden = new RegExp(`\\b(?:function\\b[^()]*|catch)\\s*\\([^)]*\\b${name}\\b|\\([^)]*\\b${name}\\b[^)]*\\)\\s*=>|\\b${name}\\s*=>`);
      if (hidden.test(executable) || /\bclass\b/.test(executable)) return undefined;
      // Every declaration in an enclosing block is visible across that whole block, even one
      // placed after `at`: a later inner let/const shadows the outer binding (TDZ before it).
      const declarations = Array.from(executable.matchAll(new RegExp(`\\b(?:const|let|var)\\s+${name}(?![\\w$])`, "g")))
        .filter(d => pathAt(d.index).every((block, i) => callPath[i] === block));
      declarations.sort((a, b) => pathAt(b.index).length - pathAt(a.index).length);
      // A later declarator in a const/let/var list (`var a = 1, src;`) also declares a binding, so a
      // visible list that may declare `name` can shadow the outer one; leave it unresolved.
      const declaratorNames = start => {
        const names = [];
        let depth = 0, atStart = true, quote = "";
        for (let i = start; i < executable.length; i++) {
          const char = executable[i];
          if (atStart) {
            const word = /^\s*([\w$]+)/.exec(executable.slice(i));
            if (/^\s*[{[]/.test(executable.slice(i))) {
              // Destructuring: every identifier inside the pattern may declare a binding.
              let end = i + executable.slice(i).search(/[{[]/), nest = 0;
              for (; end < executable.length; end++) {
                if ("{[".includes(executable[end])) nest++;
                else if ("}]".includes(executable[end]) && --nest === 0) break;
              }
              for (const m of executable.slice(i, end + 1).matchAll(/[\w$]+/g)) names.push(m[0]);
              i = end;
            } else if (word) {
              names.push(word[1]);
              i += word[0].length - 1;
            }
            atStart = false;
            continue;
          }
          if (quote) { if (char === "\\") i++; else if (char === quote) quote = ""; continue; }
          if (char === "'" || char === '"' || char === "`") { quote = char; continue; }
          if ("([{".includes(char)) depth++;
          else if (")]}".includes(char)) { if (depth === 0) break; depth--; }
          else if (char === ";" && depth === 0) break;
          else if (char === "," && depth === 0) atStart = true;
          else if (char === "\n" && depth === 0 && !/^\s*[,=+\-*/?:|&.]/.test(executable.slice(i + 1)) && !/[,=+\-*/?:|&.]\s*$/.test(executable.slice(start, i))) break;
        }
        return names;
      };
      const listDeclaresName = Array.from(executable.matchAll(/\b(?:const|let|var)\s+/g)).some(decl =>
        pathAt(decl.index).every((block, i) => callPath[i] === block) &&
        declaratorNames(decl.index + decl[0].length).slice(1).includes(name));
      if (listDeclaresName) return undefined;
      if (!declarations.length) return undefined;
      const d = declarations[0];
      // The visible binding is declared after the read: uninitialized there, never the outer one.
      if (d.index >= at) return undefined;
      if (declarations.slice(1).some(other => pathAt(other.index).length === pathAt(d.index).length)) return undefined;
      if (/^var\b/.test(d[0]) && sharedAcrossDeferredRead(d.index, at)) return undefined;
      // A redeclaration in this block, or a nested `var` (function-scoped), can
      // write this binding before a deferred use. Nested let/const only shadow it.
      const declarationPath = pathAt(d.index);
      if (Array.from(executable.matchAll(new RegExp(`\\b(const|let|var)\\s+${name}(?![\\w$])`, "g"))).some(other => {
        if (other.index === d.index) return false;
        const otherPath = pathAt(other.index);
        if (!declarationPath.every((block, i) => otherPath[i] === block)) return false;
        return otherPath.length === declarationPath.length || other[1] === "var";
      })) return undefined;
      const initializers = declarationNames(name);
      if (Array.from(writeIndexes(name)).some(write => !initializers.has(write))) return undefined;
      // The visible binding has no initializer: unresolved, never an outer declaration.
      const equals = /^\s*=(?![=>])/.exec(executable.slice(d.index + d[0].length));
      if (!equals) return undefined;
      const start = d.index + d[0].length + equals[0].length;
      const end = executable.indexOf(";", start);
      if (end < 0 || end > at) return undefined;
      if (!initializerRunsBefore(executable, d.index, end, pathAt(d.index), [at])) return undefined;
      return { value: rawSource.slice(start, end).trim(), at: start };
    };
    const binding = (name, at = before) => bindingAt(name, at)?.value;
    const initialBinding = bindingAt("src");
    const initial = initialBinding?.value;
    if (initial === undefined || srcWasRewritten()) return false;
    if (/^['"`]/.test(initial)) {
      if (skipQuoted(initial, 0) !== initial.length - 1) return false;
      const value = decodeQuotedEntryEscapes(initial.slice(1, -1), true);
      return value !== undefined && normalizeMermaidSource(value) === normalizeMermaidSource(payload)
        ? { base: value }
        : false;
    }
    // Only follow a selected card's text/plain script, optionally through an alias.
    const query = /^(\w+)\.querySelector\(\s*(['"])(.*?)\2\s*\)$/;
    /** The index of the bracket that opens the group closed at `closeIndex` (or -1). */
    const openerOf = closeIndex => {
      const pairs = { ")": "(", "]": "[", "}": "{" };
      let depth = 0;
      for (let k = closeIndex; k >= 0; k--) {
        if (pairs[executable[k]]) depth++;
        else if ("([{".includes(executable[k]) && --depth === 0) return k;
      }
      return -1;
    };
    /** Statement text from its start up to `position` (blocks, `;` and loop body bound it). */
    const statementBefore = (position, floor) => {
      let k = position - 1;
      for (; k > floor; k--) {
        const char = executable[k];
        if (char === ";" || char === "{" || char === "}") break;
        if (char === ")" || char === "]") { k = openerOf(k); if (k <= floor) return null; }
      }
      return executable.slice(k + 1, position);
    };
    /** Split a condition at top-level occurrences of `operator` (&& or ||). */
    const splitTop = (condition, operator) => {
      const parts = [];
      let depth = 0, from = 0;
      for (let k = 0; k < condition.length; k++) {
        if ("([{".includes(condition[k])) depth++;
        else if (")]}".includes(condition[k])) depth--;
        else if (depth === 0 && condition.startsWith(operator, k)) { parts.push(condition.slice(from, k)); from = k + 2; k++; }
      }
      parts.push(condition.slice(from));
      return parts.map(part => part.trim());
    };
    /**
     * Whether `position` executes on every iteration of the card loop body (open..close).
     * Enclosing try/finally and bare blocks, timer callbacks, and `if` blocks whose condition
     * holds for every selected card are transparent. `continue` guards before the position
     * may only test values shared by all iterations or elements proven present in the card.
     */
    const runsEveryIteration = (position, open, close, indexName, selected, ownerAt) => {
      if (!(position > open && position < close)) return false;
      // Same for every card: no index, no per-iteration binding or write, no call or assignment.
      const uniform = condition => {
        // Member/index reads (state.ready, flags[0]) can change without a write to the binding.
        if (/[()=.[\]]|\+\+|--/.test(condition.replace(/[!=]==?|[<>]=/g, " "))) return false;
        return Array.from(condition.matchAll(/(?<![\w$.])[A-Za-z_$][\w$]*/g)).every(name => {
          const id = name[0];
          if (/^(?:true|false|null|typeof|void|in|instanceof)$/.test(id)) return true;
          if (id === indexName) return false;
          if (Array.from(executable.matchAll(new RegExp(`\\b(?:var|let|const)\\s+${id.replace(/\$/g, "\\$")}(?![\\w$])`, "g")))
            .some(declaration => declaration.index > open && declaration.index < close)) return false;
          // A write inside any function may run from the loop body through a call.
          return !Array.from(writeIndexes(id)).some(write => (write > open && write < close) ||
            functions.some(fn => fn.body < write && write < fn.end && !(fn.body < open && close < fn.end)));
        });
      };
      // An element binding that the selected card is proven to contain, so `!name` is false.
      const hostMayBeRemoved = (hostName, hostSelector, cardName, at) => {
        if (hasForeignDomWriteAt(at)) return true;
        if (/(?<!\bclassList)\.\s*(?:remove\s*\(\s*\)|(?:replaceWith|removeChild|replaceChild|replaceChildren)\s*\(|outerHTML\s*=(?!=))/.test(executable)) return true;
        const cardEsc = cardName.replace(/\$/g, "\\$");
        if (new RegExp(`(?<![\\w$.])(?:${cardEsc}|document\\s*\\.\\s*(?:body|documentElement))\\s*\\.\\s*(?:innerHTML|textContent|innerText)\\s*=(?!=)`).test(executable)) return true;
        const wantedClass = hostSelector.startsWith(".") ? hostSelector.slice(1) : "";
        if (wantedClass) {
          for (const m of literalSource.matchAll(/\.\s*classList\s*\.\s*(remove|replace|toggle)\s*\(/g)) {
            const start = m.index + m[0].length;
            let depth = 1, end = -1;
            for (let k = start; k < executable.length; k++) {
              if (executable[k] === "(") depth++;
              else if (executable[k] === ")" && --depth === 0) { end = k; break; }
            }
            if (end < 0) return true;
            const args = literalSource.slice(start, end).split(",").map(s => s.trim()).filter(Boolean);
            if (args.length === 0) {
              if (m[1] !== "remove") return true;
              continue;
            }
            const checkedArgs = m[1] === "remove" ? args : args.slice(0, 1);
            const matchesWanted = checkedArgs.some(arg => {
              const lit = /^(['"])((?:[^'"\\\n]|\\.)*)\1$/.exec(arg);
              if (!lit) return true;
              const decoded = decodeQuotedEntryEscapes(lit[2], true);
              return decoded === undefined || decoded === wantedClass;
            });
            if (matchesWanted) return true;
          }
          const hostEsc = hostName.replace(/\$/g, "\\$");
          const selEsc = hostSelector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const hostAttrRe = new RegExp(
            `(?<![\\w$.])(?:${hostEsc}|${cardEsc}|\\w+\\s*\\.\\s*querySelector\\s*\\(\\s*(['"])${selEsc}\\1\\s*\\))\\s*\\.\\s*(?:className\\s*=(?!=)|(?:setAttribute|removeAttribute)\\s*\\(\\s*(?!(['"])(?!class\\2)[^'"\\n]*\\2))`,
            "i"
          );
          if (hostAttrRe.test(literalSource)) return true;
        }
        return false;
      };
      const present = (name, at) => {
        if (!/^[A-Za-z_$][\w$]*$/.test(name)) return false;
        const hostBinding = bindingAt(name, at);
        const value = hostBinding?.value;
        const element = value && query.exec(value);
        if (!element) return false;
        const cardBinding = bindingAt(element[1], hostBinding.at);
        if (!cardBinding || cardBinding.at !== ownerAt) return false;
        if (element[3] === selected[3]) return true;
        if (selectedScript.cardHas?.(element[3], at) !== true) return false;
        return !hostMayBeRemoved(name, element[3], element[1], at);
      };
      const loopPath = pathAt(open);
      const unwrapParens = expr => {
        let s = expr.trim();
        while (s.startsWith("(") && s.endsWith(")")) {
          let depth = 0, wrapsAll = true;
          for (let k = 0; k < s.length - 1; k++) {
            if (s[k] === "(") depth++;
            else if (s[k] === ")" && --depth === 0) { wrapsAll = false; break; }
          }
          if (!wrapsAll) break;
          s = s.slice(1, -1).trim();
        }
        return s;
      };
      const provenUniformBool = id => {
        if (!uniform(id)) return null;
        const escaped = id.replace(/\$/g, "\\$");
        const hidden = new RegExp(`\\b(?:function\\b[^()]*|catch)\\s*\\([^)]*\\b${escaped}\\b|\\([^)]*\\b${escaped}\\b[^)]*\\)\\s*=>|\\b${escaped}\\s*=>|\\b(?:const|let|var)\\s*[{[][^;]*\\b${escaped}\\b`);
        if (hidden.test(executable)) return null;
        const lexicalDecls = Array.from(executable.matchAll(new RegExp(`\\b(?:let|const)\\s+${escaped}(?![\\w$])`, "g")))
          .map(d => ({ index: d.index, path: pathAt(d.index) }));
        const writes = Array.from(writeIndexes(id)).sort((a, b) => a - b);
        const assignRe = new RegExp(`(?:\\b(var|let|const)\\s+|(?<![\\w$.]))${escaped}\\s*=\\s*(true|false)(?![\\w$])`, "g");
        let lastProven = null;
        for (const match of executable.matchAll(assignRe)) {
          const afterAssign = executable.slice(match.index + match[0].length);
          // Require a complete boolean literal initializer; reject compound expressions like `true && flag`.
          if (!/^[ \t]*(?:;|,|\}|$|[\r\n](?!\s*(?:[([`.+\-*/%<>=!&|^?:,\\]|\b(?:in|instanceof)\b)))/.test(afterAssign)) continue;
          const namePos = match.index + match[0].indexOf(id);
          if (namePos >= open) continue;
          // Must not be overwritten after this assignment before or outside the loop.
          if (writes.some(w => w > namePos)) continue;
          const assignPath = pathAt(namePos);
          // Every block enclosing the assignment that does not also enclose the loop must be
          // a plain block (not `try`, where an earlier throw can skip the assignment before reaching the loop).
          const extraBlocks = assignPath.filter(b => !loopPath.includes(b));
          // A block-scoped `let`/`const` declaration in a nested block is not visible at the guard.
          if ((match[1] === "let" || match[1] === "const") && extraBlocks.length > 0) continue;
          // Reject writes to a binding shadowed by a nested `let`/`const` in `extraBlocks`,
          // or writes to an outer binding that is shadowed by a closer `let`/`const` at the guard.
          const shadowedInExtra = extraBlocks.length > 0 && lexicalDecls.some(d =>
            d.path.length > 0 && extraBlocks.includes(d.path.at(-1)) && d.path.every((b, idx) => assignPath[idx] === b)
          );
          if (shadowedInExtra) continue;
          const shadowedAtGuard = lexicalDecls.some(d =>
            d.path.every((b, idx) => loopPath[idx] === b) &&
            d.path.length > assignPath.length &&
            d.index !== match.index
          );
          if (shadowedAtGuard) continue;
          const inNormalPath = extraBlocks.every(b => {
            const head = executable.slice(0, b).replace(/\s+$/, "");
            return head === "" || /[;{}]$/.test(head);
          });
          if (!inNormalPath) continue;
          const enclosingStart = assignPath.at(-1) ?? -1;
          const stmt = statementBefore(match.index, enclosingStart);
          if (stmt === null || /^\s*(?:if|else|while|for|do|switch|with|catch)(?![\w$])/.test(stmt) || /&&|\|\||\?/.test(stmt)) continue;
          lastProven = match[2] === "true";
        }
        return lastProven;
      };
      const isUndefinedShadowed = () =>
        /\b(?:var|let|const|function|class)\s+undefined(?![\w$])|\b(?:function\b[^()]*|catch)\s*\([^)]*\bundefined(?![\w$])|\([^)]*\bundefined(?![\w$])[^)]*\)\s*=>|\bundefined\s*=>|\b(?:const|let|var)\s+[^;\n{}]*[,{[]\s*undefined(?![\w$])|\bimport\b[^;\n]*\bundefined(?![\w$])/.test(executable);
      const provenBool = (condition, at) => {
        const s = unwrapParens(condition);
        if (s === "true") return true;
        if (/^(?:false|null|0)$/.test(s)) return false;
        if (s === "undefined") return isUndefinedShadowed() ? null : false;
        if (s.startsWith("!")) {
          const inner = provenBool(s.slice(1), at);
          return inner === null ? null : !inner;
        }
        if (/^[A-Za-z_$][\w$]*$/.test(s)) {
          if (present(s, at)) return true;
          return provenUniformBool(s);
        }
        return null;
      };
      const hasTopLevelConditionalOrComma = condition => {
        let depth = 0;
        for (let k = 0; k < condition.length; k++) {
          const ch = condition[k];
          if ("([{".includes(ch)) depth++;
          else if (")]}".includes(ch)) depth--;
          else if (depth === 0) {
            if (ch === ",") return true;
            if (ch === "?") {
              const isNullish = condition[k + 1] === "?" || condition[k - 1] === "?";
              const isOptionalChain = condition[k + 1] === "." && !/\d/.test(condition[k + 2] ?? "");
              if (!isNullish && !isOptionalChain) return true;
            }
          }
        }
        return false;
      };
      const neverTrue = (condition, at) => {
        const s = unwrapParens(condition);
        if (hasTopLevelConditionalOrComma(s)) return false;
        if (provenBool(s, at) === false) return true;
        const orParts = splitTop(s, "||");
        if (orParts.length > 1) return orParts.every(part => neverTrue(part, at));
        const andParts = splitTop(s, "&&");
        if (andParts.length > 1) {
          for (const part of andParts) {
            if (neverTrue(part, at)) return true;
            if (!alwaysTrue(part, at)) return false;
          }
          return false;
        }
        return false;
      };
      const alwaysTrue = (condition, at) => {
        const s = unwrapParens(condition);
        if (hasTopLevelConditionalOrComma(s)) return false;
        if (provenBool(s, at) === true) return true;
        const orParts = splitTop(s, "||");
        if (orParts.length > 1) {
          // Operands run left to right: a true operand counts only when every earlier one is
          // proven to evaluate false (and so completes normally) before it is reached.
          for (const part of orParts) {
            if (alwaysTrue(part, at)) return true;
            if (!neverTrue(part, at)) return false;
          }
          return false;
        }
        const andParts = splitTop(s, "&&");
        if (andParts.length > 1) return andParts.every(part => alwaysTrue(part, at));
        return false;
      };
      /** Condition text of a `(...)` group closed at `closeParen` when it follows `if` (not `else if`). */
      const ifCondition = closeParen => {
        const opener = openerOf(closeParen);
        const head = executable.slice(0, opener);
        if (opener < 0 || !/(?<![\w$.])if\s*$/.test(head) || /(?<![\w$.])else\s+if\s*$/.test(head)) return undefined;
        return executable.slice(opener + 1, closeParen);
      };
      /** Blocks between the loop body and `index`, innermost last. */
      const blocksAround = index => {
        const stack = [];
        for (let k = open + 1; k < index; k++) {
          if (executable[k] === "{") stack.push(k);
          else if (executable[k] === "}") stack.pop();
        }
        return stack;
      };
      for (const block of blocksAround(position)) {
        const head = executable.slice(open + 1, block).replace(/\s+$/, "");
        // A statement before the render inside `try` may throw into `catch` first.
        if (/(?<![\w$.])try$/.test(head) && executable.slice(block + 1, position).trim() !== "") return false;
        if (/(?<![\w$.])(?:try|finally)$/.test(head) || /[;{}]$/.test(head) || head === "") continue;
        const callable = /(?:function\s*\([^()]*\)|(?:\([^()]*\)|[A-Za-z_$][\w$]*)\s*=>)$/.exec(head);
        // A timer callback runs once for this iteration; other callbacks may never run.
        // Only certify when the scheduler binding is proven unshadowed in this scope.
        const timerCall = callable && /(?<![\w$.])(setTimeout|requestAnimationFrame|queueMicrotask)\s*\(\s*$/.exec(head.slice(0, callable.index));
        const isUnshadowedScheduler = name => {
          const esc = name.replace(/\$/g, "\\$");
          const shadowRe = new RegExp(
            String.raw`\b(?:var|let|const|function|class)\s+${esc}(?![\w$])|\b(?:function\b[^()]*|catch)\s*\([^)]*\b${esc}(?![\w$])|\([^)]*\b${esc}(?![\w$])[^)]*\)\s*=>|\b${esc}\s*=>|\b(?:const|let|var)\s+[^;\n{}]*[,{[]\s*${esc}(?![\w$])|\bimport\b[^;\n]*\b${esc}(?![\w$])`
          );
          if (shadowRe.test(executable) || writeIndexes(name).size > 0) return false;
          const globalAssignRe = new RegExp(
            String.raw`\b(?:window|globalThis|self)\s*(?:\.\s*${esc}(?![\w$])|\[\s*(['"])${esc}\1\s*\])\s*=(?!=)`,
            "g"
          );
          for (const m of literalSource.matchAll(globalAssignRe)) {
            if (executable[m.index] === literalSource[m.index]) return false;
          }
          return true;
        };
        if (timerCall && isUnshadowedScheduler(timerCall[1])) {
          // The statement registering the timer callback must itself run on every iteration.
          const regStatement = statementBefore(open + 1 + timerCall.index, open);
          if (regStatement === null || /^\s*(?:if|else|while|for|do|switch|with)(?![\w$])/.test(regStatement) || /&&|\|\||\?|=>/.test(regStatement)) return false;
          // A timer whose handle is cancelled in the scope may never run for this iteration.
          const handle = /([A-Za-z_$][\w$]*)\s*=\s*(?:window\s*\.\s*)?$/.exec(head.slice(0, timerCall.index))?.[1];
          const cancelled = cancelsSchedulerHandle(executable, handle, timerCall[1]);
          if (!cancelled) {
            // A return/throw in the callback (at any brace depth, outside nested functions)
            // before the read or render can end the callback early.
            const base = block + 1;
            const earlyExit = Array.from(executable.slice(base, position).matchAll(/(?<![\w$.])(?:return|throw)(?![\w$])/g))
              .some(exit => !functions.some(fn => fn.body > block && fn.body < base + exit.index && base + exit.index < fn.end));
            if (earlyExit) return false;
            continue;
          }
        }
        if (head.endsWith(")")) {
          const condition = ifCondition(open + 1 + head.length - 1);
          if (condition !== undefined && alwaysTrue(condition, block)) continue;
        }
        return false;
      }
      // An unbraced `if`/loop statement or a short-circuit/ternary before the position is conditional.
      const statement = statementBefore(position, open);
      if (statement === null || /^\s*(?:if|else|while|for|do|switch|with)(?![\w$])/.test(statement) || /&&|\|\||\?/.test(statement)) return false;
      // `continue` before the position skips the rest of this iteration.
      const nested = functions.filter(fn => fn.body > open && fn.end <= close + 1);
      const innerLoops = loops.filter(loop => loop.start > open && loop.end <= close + 1);
      for (const exit of executable.slice(open, position).matchAll(/(?<![\w$.])continue(?![\w$])/g)) {
        const index = open + exit.index;
        if (nested.some(fn => fn.body < index && index < fn.end)) continue;
        // A labeled continue may target an outer loop; an inner loop's own continue does not skip this one.
        if (/^[ \t]*[A-Za-z_$]/.test(executable.slice(index + 8))) return false;
        if (innerLoops.some(loop => loop.start < index && index < loop.end)) continue;
        const guard = statementBefore(index, open);
        if (guard === null) return false;
        const braceless = /^\s*if\s*\(/.exec(guard);
        let condition;
        if (braceless) {
          // The `if (...)` group must end right before this `continue`.
          const closeParen = executable.slice(0, index).trimEnd().length - 1;
          if (executable[closeParen] !== ")" || openerOf(closeParen) !== index - guard.length + braceless[0].length - 1) return false;
          condition = executable.slice(openerOf(closeParen) + 1, closeParen);
        } else {
          if (guard.trim() !== "") return false;
          const block = blocksAround(index).at(-1);
          const head = block === undefined ? "" : executable.slice(open + 1, block).replace(/\s+$/, "");
          condition = head.endsWith(")") ? ifCondition(open + head.length) : undefined;
        }
        if (condition === undefined || !neverTrue(condition, index)) return false;
      }
      return true;
    };
    // Bindings whose subtree a script query searches; edits to them can change the selection.
    const cardOwners = new Set();
    // An assigned value that is exactly one string literal; concatenations never match.
    const soleStringRe = /^\s*(['"])((?:(?!\1)[^\\\r\n]|\\.)*)\1\s*(?:;|$|[\r\n](?!\s*[-+*\/%.,?:&|^=<>([`]))/;
    let certifiedLoopOpen;
    let captureAt = initialBinding.at;
    let usesTypedScriptQuery = false;
    let scriptQueryAt = initialBinding.at;
    const scriptElement = (value, at = before, recordSelection = false) => {
      const selected = query.exec(value);
      // An unquoted text/plain is an invalid selector (querySelector throws); quotes must match.
      if (!selected || !/^script(?:\[type=(['"])text\/plain\1\])?$/.test(selected[3])) return false;
      cardOwners.add(selected[1]);
      if (!(selected[3] === "script" ? selectedScript.any : selectedScript.plain)) return false;
      // A classic script that runs before the payload is parsed reads nothing: unresolved.
      if (!selectedScript.availableAt(at)) return false;
      const ownerBinding = bindingAt(selected[1], at);
      const owner = ownerBinding?.value;
      const editCanPrecede = editCanPrecedeTarget;
      // Same-scope class/id changes that can run before the query can alter which
      // elements match the card selector; changes provably after the query leave
      // an already-captured element or static NodeList intact.
      const selectorValidAt = (selector, queryAt) => {
        const selectorClasses = Array.from(selector.matchAll(/\.([\w-]+)/g), m => m[1]);
        if (selectorClasses.length > 0) {
          const classChangeRe = /(?:([A-Za-z_$][\w$]*)\s*)?\.\s*(?:className\s*(?:=(?!=)|\+=)|(?:setAttribute|removeAttribute|toggleAttribute)\s*\(\s*(?!(['"])(?!class\2)[^'"\n]*\2)|(?:setAttributeNS|removeAttributeNS|setAttributeNode(?:NS)?|removeAttributeNode)\s*\(|classList\s*\.\s*(?:add|remove|toggle|replace)\s*\()/gi;
          // Class matching follows the document mode: exact in standards mode, ASCII case-insensitive
          // in quirks mode; a case-only match in unknown mode is blocked as unresolved.
          const asciiLowerToken = value => value.replace(/[A-Z]/g, c => c.toLowerCase());
          const hitsSelectorClass = token => selectorClasses.some(wanted =>
            wanted === token || (selectedScript.docMode !== "standards" && asciiLowerToken(wanted) === asciiLowerToken(token)));
          const changesSelectorClass = match => {
            // Restrict the fresh-node exemption to plain `className = ...` assignment.
            // `className += ...` can combine with prior classes to form a selector match.
            if (/\bclassName\s*=$/.test(match[0])) {
              const targetName = match[1];
              const bound = targetName && bindingAt(targetName, match.index);
              const rhs = soleStringRe.exec(literalSource.slice(match.index + match[0].length));
              if (bound && /^document\.createElement\(\s*(['"])[A-Za-z][\w-]*\1\s*\)$/.test(bound.value) && rhs) {
                const decoded = decodeQuotedEntryEscapes(rhs[2], true);
                return decoded === undefined || classTokens(decoded).some(hitsSelectorClass);
              }
              return true;
            }
            if (!/\bclassList\s*\.\s*(?:add|remove|toggle|replace)\s*\($/i.test(match[0])) return true;
            const start = match.index + match[0].length;
            let depth = 1, end = -1;
            for (let k = start; k < executable.length; k++) {
              if (executable[k] === "(") depth++;
              else if (executable[k] === ")" && --depth === 0) { end = k; break; }
            }
            if (end < 0) return true;
            const args = literalSource.slice(start, end).split(",").map(s => s.trim()).filter(Boolean);
            if (args.length === 0) return true;
            const tokenArgs = /\btoggle\s*\($/i.test(match[0]) ? args.slice(0, 1) : args;
            return tokenArgs.some(arg => {
              const lit = /^(['"])((?:[^\\]|\\.)*)\1$/.exec(arg);
              const decoded = lit ? decodeQuotedEntryEscapes(lit[2], true) : undefined;
              return decoded === undefined || hitsSelectorClass(decoded);
            });
          };
          // Only matches that start in executable code count; quoted examples do not block.
          if (Array.from(literalSource.matchAll(classChangeRe))
            .some(edit => executable[edit.index] === literalSource[edit.index] &&
              editCanPrecede(edit.index, queryAt) && changesSelectorClass(edit))) return false;
        }
        const selectorIds = Array.from(selector.matchAll(/#([\w-]+)/g), m => m[1]);
        if (selectorIds.length > 0) {
          const idChangeRe = /\.\s*(?:id\s*(?:=(?!=)|\+=)|(?:setAttribute|removeAttribute|toggleAttribute)\s*\(\s*(?!(['"])(?!id\1)[^'"\n]*\1)|(?:setAttributeNS|removeAttributeNS|setAttributeNode(?:NS)?|removeAttributeNode)\s*\()/gi;
          if (Array.from(literalSource.matchAll(idChangeRe))
            .some(edit => executable[edit.index] === literalSource[edit.index] && editCanPrecede(edit.index, queryAt))) return false;
        }
        return true;
      };
      // Same-scope DOM reorder edits before querySelectorAll can move a matching element
      // (e.g. a broken card) ahead of this card, invalidating document-order traversal.
      const orderValidAt = (selector, queryAt) => {
        const reorderRe = /\.\s*(prepend|append|appendChild|insertBefore|moveBefore|before|after|replaceWith|replaceChildren|insertAdjacent(?:Element|HTML|Text))\s*\(/g;
        const selectorClasses = Array.from(selector.matchAll(/\.([\w-]+)/g), m => m[1]);
        const selectorIds = Array.from(selector.matchAll(/#([\w-]+)/g), m => m[1]);
        const selectorTag = /^([A-Za-z][\w-]*)/.exec(selector)?.[1]?.toLowerCase();
        const isFreshNonMatchingElement = (arg, atIndex, queryIndex) => {
          if (!/^[A-Za-z_$][\w$]*$/.test(arg)) return false;
          const bound = bindingAt(arg, atIndex);
          const created = bound && /^document\.createElement\(\s*(['"])([A-Za-z][\w-]*)\1\s*\)$/.exec(bound.value);
          if (!created) return false;
          if (selectorTag && selectorClasses.length === 0 && selectorIds.length === 0 && created[2].toLowerCase() === selectorTag) return false;
          // Resolve aliases by binding identity (`bound.at`) so edits made through aliases
          // (e.g. `const alias = wrap; alias.innerHTML = ...` or `alias.appendChild(...)`) are audited,
          // and leave the wrapper unresolved if it escapes to an untracked binding, call, or container.
          const resolveToBound = (name, pos, seen = new Set()) => {
            if (seen.has(name)) return false;
            const b = bindingAt(name, pos);
            if (!b) return false;
            if (b.at === bound.at) return true;
            if (/^[A-Za-z_$][\w$]*$/.test(b.value)) {
              const next = new Set(seen);
              next.add(name);
              return resolveToBound(b.value, b.at, next);
            }
            return false;
          };
          const aliasNames = new Set([arg]);
          const aliasDeclTargets = new Set();
          let discovered = true;
          while (discovered) {
            discovered = false;
            for (const decl of executable.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*)\s*;/g)) {
              const [, lhs, rhs] = decl;
              if (!aliasNames.has(rhs)) continue;
              const rhsPos = decl.index + decl[0].lastIndexOf(rhs);
              if (!resolveToBound(rhs, rhsPos)) continue;
              const lhsBound = bindingAt(lhs, decl.index + decl[0].length);
              if (!lhsBound) return false;
              aliasDeclTargets.add(rhsPos);
              if (!aliasNames.has(lhs)) {
                aliasNames.add(lhs);
                discovered = true;
              }
            }
          }
          // Find the parenthesized argument span of the DOM insertion call at `atIndex`.
          const callOpen = executable.indexOf("(", atIndex);
          let callClose = -1;
          if (callOpen >= 0) {
            let d = 1;
            for (let k = callOpen + 1; k < executable.length; k++) {
              if (executable[k] === "(") d++;
              else if (executable[k] === ")" && --d === 0) { callClose = k; break; }
            }
          }
          const safePropAccessRe = /^\s*\.\s*(?:innerHTML|className|id|textContent|innerText|classList|setAttribute|removeAttribute|toggleAttribute|dataset|style|prepend|append|appendChild|insertBefore|moveBefore|replaceChildren|insertAdjacent(?:Element|HTML|Text))\b/;
          for (const alias of aliasNames) {
            const aliasEsc = alias.replace(/\$/g, "\\$");
            const refRe = new RegExp(`(?<![\\w$.])${aliasEsc}(?![\\w$])`, "g");
            for (const ref of executable.matchAll(refRe)) {
              const idx = ref.index;
              const beforeRef = executable.slice(0, idx);
              const afterRef = executable.slice(idx + alias.length);
              // Declaration head for this binding (`const alias = ...`): skip.
              if (/\b(?:const|let|var)\s+$/.test(beforeRef) && /^\s*=/.test(afterRef)) continue;
              if (!resolveToBound(alias, idx)) continue;
              // Simple alias initializer (`const other = alias;`): tracked in aliasNames.
              if (aliasDeclTargets.has(idx)) continue;
              // The DOM insertion call argument itself.
              if (callOpen >= 0 && callClose >= 0 && idx > callOpen && idx < callClose) continue;
              // Direct property access handled by childMoveRe / innerHtmlRe / selectorValidAt.
              if (safePropAccessRe.test(afterRef)) continue;
              // Any other use (passing to a function, assigning to an untracked variable/property/array/object)
              // may alias and mutate the wrapper outside our checks.
              return false;
            }
            const childMoveRe = new RegExp(`(?<![\\w$.])${aliasEsc}\\s*\\.\\s*(?:prepend|append|appendChild|insertBefore|moveBefore|replaceChildren|insertAdjacent(?:Element|HTML))\\s*\\(`, "g");
            if (Array.from(executable.matchAll(childMoveRe)).some(m => resolveToBound(alias, m.index) && editCanPrecede(m.index, atIndex))) return false;
            const innerHtmlRe = new RegExp(`(?<![\\w$.])${aliasEsc}\\s*\\.\\s*innerHTML\\s*(?:=(?!=)|\\+=)`, "g");
            for (const assign of executable.matchAll(innerHtmlRe)) {
              if (!resolveToBound(alias, assign.index)) continue;
              // Writes that can run before the collection query matter; later writes cannot change the captured list.
              if (!editCanPrecede(assign.index, queryIndex)) continue;
              const rhs = soleStringRe.exec(literalSource.slice(assign.index + assign[0].length));
              if (!rhs) return false;
              const html = decodeQuotedEntryEscapes(rhs[2], true);
              if (html === undefined) return false;
              // Only unambiguous tags are read; any markup left over is not provably safe.
              const tagRe = /<\/?[A-Za-z][\w-]*(?:\s+[^\s"'<>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*\s*\/?>/g;
              if (html.replace(tagRe, "").includes("<")) return false;
              for (const [tag] of html.matchAll(tagRe)) {
                if (tag.startsWith("</")) continue;
                // A character reference the decoder leaves in place may still spell a selector token.
                if ([readHtmlAttribute(tag, "class"), readHtmlAttribute(tag, "id")].some(value => value?.includes("&"))) return false;
                if (matchesCardSelector(tag, selector, selectedScript.docMode) !== false) return false;
              }
            }
          }
          return true;
        };
        for (const edit of executable.matchAll(reorderRe)) {
          if (!editCanPrecede(edit.index, queryAt)) continue;
          const method = edit[1];
          // Text-only insertion adds no elements, so it cannot change selector matches or their order.
          if (method === "insertAdjacentText") continue;
          if (method === "replaceWith" || method === "replaceChildren" || method === "insertAdjacentHTML") return false;
          const openParen = edit.index + edit[0].length;
          let depth = 1, closeParen = -1;
          for (let k = openParen; k < executable.length; k++) {
            if (executable[k] === "(") depth++;
            else if (executable[k] === ")" && --depth === 0) { closeParen = k; break; }
          }
          if (closeParen < 0) return false;
          const args = executable.slice(openParen, closeParen).split(",").map(s => s.trim()).filter(Boolean);
          if (args.length === 0) return false;
          const movedArgs = (method === "insertBefore" || method === "moveBefore") ? args.slice(0, 1)
            : method === "insertAdjacentElement" ? args.slice(1, 2)
            : args;
          if (movedArgs.length === 0 || !movedArgs.every(arg => isFreshNonMatchingElement(arg, edit.index, queryAt))) return false;
        }
        return true;
      };
      // A removal or replacement before document.querySelector can detach the element
      // matched by the selector; detachment after lookup leaves the captured card intact.
      const notDetachedAt = queryAt => {
        const detachRe = /(?<!\bclassList)\.\s*(?:remove\s*\(\s*\)|(?:replaceWith|removeChild|replaceChild|replaceChildren)\s*\(|outerHTML\s*=(?!=))/g;
        return !Array.from(executable.matchAll(detachRe)).some(edit => editCanPrecede(edit.index, queryAt));
      };
      const isUnshadowedDocument = () => {
        const shadowRe = /\b(?:var|let|const|function|class)\s+document(?![\w$])|\b(?:function\b[^()]*|catch)\s*\([^)]*\bdocument(?![\w$])|\([^)]*\bdocument(?![\w$])[^)]*\)\s*=>|\bdocument\s*=>|\b(?:const|let|var)\s+[^;\n{}]*[,{[]\s*document(?![\w$])|\bimport\b[^;\n]*\bdocument(?![\w$])/;
        if (shadowRe.test(executable) || writeIndexes("document").size > 0) return false;
        const globalAssignRe = /\b(?:window|globalThis|self)\s*(?:\.\s*document(?![\w$])|\[\s*(['"])document\1\s*\])\s*=(?!=)/g;
        for (const m of literalSource.matchAll(globalAssignRe)) {
          if (executable[m.index] === literalSource[m.index]) return false;
        }
        return true;
      };
      const direct = owner && /^document\.querySelector\(\s*(['"])(.*?)\1\s*\)$/.exec(owner);
      // The query runs where its initializer runs; before the card is parsed it returns null.
      if (direct) {
        if (!isUnshadowedDocument() || !selectedScript.cardAvailableAt(ownerBinding.at) || !selectedScript.unique(direct[2]) || !selectorValidAt(direct[2], ownerBinding.at) || !notDetachedAt(ownerBinding.at)) return false;
        captureAt = ownerBinding.at;
        if (recordSelection) {
          usesTypedScriptQuery = selected[3] !== "script";
          scriptQueryAt = at;
        }
        return true;
      }
      const indexed = owner && /^(\w+)\[(\w+)\]$/.exec(owner);
      const collectionBinding = indexed && bindingAt(indexed[1], ownerBinding.at);
      const collection = collectionBinding?.value;
      const all = collection && /^document\.querySelectorAll\(\s*(['"])(.*?)\1\s*\)$/.exec(collection);
      // The supported indexed traversal visits the selected cards in order.
      if (!all || !isUnshadowedDocument() || matchesCardSelector(cardTag, all[2], selectedScript.docMode) !== true) return false;
      // Every selector match preceding this card must also be able to complete the loop's
      // script lookup; otherwise a null.textContent TypeError aborts the loop before this card.
      if (selectedScript.priorMatchesComplete && !selectedScript.priorMatchesComplete(all[2], selected[3] === "script")) return false;
      // querySelectorAll returns a static list of the elements parsed when its initializer ran.
      // A card that a classic initializer may precede is not provably in the traversed list.
      if (!selectedScript.cardAvailableAt(collectionBinding.at)) return false;
      if (!selectorValidAt(all[2], collectionBinding.at)) return false;
      if (!orderValidAt(all[2], collectionBinding.at)) return false;
      // The card initializer and this read must both run inside the body of the same loop;
      // a matching loop elsewhere in the scope proves nothing about this payload.
      const loopHeader = new RegExp(`for\\s*\\(\\s*var\\s+${indexed[2]}\\s*=\\s*0\\s*;\\s*${indexed[2]}\\s*<\\s*${indexed[1]}\\.length\\s*;\\s*${indexed[2]}\\+\\+\\s*\\)\\s*\\{`, "g");
      return Array.from(executable.matchAll(loopHeader)).some(loop => {
        const loopCollectionAt = loop.index + loop[0].indexOf(indexed[1], loop[0].indexOf(";"));
        const loopCollectionBinding = bindingAt(indexed[1], loopCollectionAt);
        if (!loopCollectionBinding || loopCollectionBinding.at !== collectionBinding.at) return false;
        const open = loop.index + loop[0].length - 1;
        let depth = 0, close = -1;
        for (let k = open; k < executable.length; k++) {
          if (executable[k] === "{") depth++;
          else if (executable[k] === "}" && --depth === 0) { close = k; break; }
        }
        if (close <= open || ![ownerBinding.at, at].every(position => position > open && position < close)) return false;
        // The index is a loop-header `var`; reading it from a callback sees its final value.
        if (sharedAcrossDeferredRead(loop.index + loop[0].indexOf("var"), ownerBinding.at)) return false;
        // A closer let/const/catch/parameter declaration of the index name shadows the header
        // binding, so `cards[index]` no longer reads the loop index: unresolved.
        const indexName = indexed[2];
        const shadowDeclaration = new RegExp(`(?<![\\w$.])(?:let|const)\\s+${indexName}(?![\\w$])|catch\\s*\\(\\s*${indexName}\\s*\\)`);
        if (shadowDeclaration.test(executable.slice(open, close))) return false;
        const parameterShadow = new RegExp(`(?<![\\w$.])${indexName}(?![\\w$])`);
        if (functions.some(fn => fn.body < ownerBinding.at && ownerBinding.at < fn.end && fn.start > loop.index &&
          parameterShadow.test(executable.slice(fn.start, fn.body).replace(/^function\s+[\w$]+/, "function")))) return false;
        if (functions.some(fn => fn.body < at && at < fn.end && fn.start > loop.index &&
          parameterShadow.test(executable.slice(fn.start, fn.body).replace(/^function\s+[\w$]+/, "function")))) return false;
        // break/return/throw outside nested callbacks end the traversal early and may leave
        // later selected cards unvisited. `continue` still advances to the next card.
        const nested = functions.filter(fn => fn.body > open && fn.end <= close + 1);
        if (Array.from(executable.slice(open, close).matchAll(/(?<![\w$.])(?:break|return|throw)(?![\w$])/g))
          .some(exit => !nested.some(fn => fn.body < open + exit.index && open + exit.index < fn.end))) return false;
        // Any other write to the index inside the body, or inside a function in the same
        // lexical scope that may be called during traversal (even if defined outside the loop),
        // skips or repeats cards, so the in-order card-to-payload mapping is no longer proven.
        const headerStart = loop.index;
        const enclosingFn = functions.filter(fn => fn.body < open && close < fn.end).at(-1);
        const indexScopeStart = enclosingFn ? enclosingFn.body : 0;
        const indexScopeEnd = enclosingFn ? enclosingFn.end : executable.length;
        if (Array.from(writeIndexes(indexed[2])).some(write =>
          (write > open && write < close) ||
          (!(write >= headerStart && write < open) &&
            write > indexScopeStart && write < indexScopeEnd &&
            functions.some(fn => fn.body < write && write < fn.end &&
              fn.body > indexScopeStart && fn.end <= indexScopeEnd &&
              !(fn.body < open && close < fn.end)))
        )) return false;
        // The loop statement itself must be guaranteed to execute (not nested under a
        // conditional/branch/short-circuit such as `if (cond) for (...)` or `if (cond) { for (...) }`).
        const loopPath = pathAt(loop.index);
        const loopFloor = loopPath.at(-1) ?? -1;
        const loopStmt = statementBefore(loop.index, loopFloor);
        if (loopStmt === null || /^\s*(?:if|else|while|for|do|switch|with|catch)(?![\w$])/.test(loopStmt) || /&&|\|\||\?/.test(loopStmt)) return false;
        if (loopPath.some(block => {
          const head = executable.slice(0, block).replace(/\s+$/, "");
          if (head === "" || /[;{}]$/.test(head) || /(?<![\w$.])(?:try|finally)$/.test(head)) return false;
          return !/(?:\bfunction\b[^{}]*\)|=>)$/.test(head);
        })) return false;
        // The card binding, the payload read and mermaid.render must run on every selected
        // iteration. A condition such as `i === 0` would certify cards it never renders.
        if ([ownerBinding.at, at, initialBinding.at, before].every(position => runsEveryIteration(position, open, close, indexed[2], selected, ownerBinding.at))) {
          certifiedLoopOpen = open;
          captureAt = collectionBinding.at;
          if (recordSelection) {
            usesTypedScriptQuery = selected[3] !== "script";
            scriptQueryAt = at;
          }
          return true;
        }
        return false;
      });
    };
    let value = initial;
    let usesValidatedDedent = false;
    if (value.startsWith("dedent(")) {
      if (!value.endsWith(")")) return false;
      // Recognize the archived renderer's exact, whitespace-only normalization.
      const head = /\bfunction\s+dedent\(text\)\s*\{/.exec(executable);
      if (!head) return false;
      // The call must bind this one declaration: no second (hoisted) declaration,
      // parameter, variable or assignment may shadow or replace it, and its
      // block must enclose every call.
      const headPath = pathAt(head.index);
      const references = Array.from(executable.matchAll(/(?<![\w$.])dedent(?![\w$])/g));
      const declarationAt = head.index + head[0].indexOf("dedent");
      if (references.some(reference => reference.index !== declarationAt &&
        (!/^\s*\(/.test(executable.slice(reference.index + 6)) || /\bfunction\s+$/.test(executable.slice(0, reference.index)) ||
          !headPath.every((block, i) => pathAt(reference.index)[i] === block)))) return false;
      let end = head.index + head[0].length, depth = 1;
      while (end < executable.length && depth) {
        if (executable[end] === "{") depth++;
        if (executable[end] === "}") depth--;
        end++;
      }
      const canonical = String.raw`function dedent(text) {
        var lines = text.replace(/^\n+/, '').replace(/\s+$/, '').split('\n');
        var min = Infinity;
        lines.forEach(function (l) { if (!l.trim()) return; var m = l.match(/^[ \t]*/)[0].length; if (m < min) min = m; });
        if (!isFinite(min) || min === 0) return lines.join('\n');
        return lines.map(function (l) { return l.slice(min); }).join('\n');
      }`;
      // Whitespace inside string and regex literals is significant (e.g. a join delimiter), so
      // compare token-aware; an uncomparable helper stays unresolved.
      const actualCompact = compactCodePreservingLiterals(rawSource.slice(head.index, end));
      const canonicalCompact = compactCodePreservingLiterals(canonical);
      if (actualCompact === undefined || actualCompact !== canonicalCompact) return false;
      // The helper reads isFinite and Infinity as free names. Any other occurrence may
      // declare, assign or bind (as a parameter) a shadowing name, so it stays unresolved.
      if (Array.from(executable.matchAll(/(?<![\w$.])(?:isFinite|Infinity)(?![\w$])/g))
        .some(reference => reference.index < head.index || reference.index >= end)) return false;
      value = value.slice(7, -1).trim();
      usesValidatedDedent = true;
    }
    if (!value.endsWith(".textContent")) return false;
    const element = value.slice(0, -12).trim();
    const isSelectedScript = (reference, at = before, seen = new Set(), recordSelection = false) => {
      if (scriptElement(reference, at, recordSelection)) return true;
      if (!/^\w+$/.test(reference) || seen.has(reference)) return false;
      seen.add(reference);
      const alias = bindingAt(reference, at);
      return isSelectedScript(alias?.value ?? "", alias?.at ?? at, seen, recordSelection);
    };
    // The src initializer evaluates `element` where it runs, not at the render call.
    if (!isSelectedScript(element, initialBinding.at, new Set(), true)) return false;
    // A textContent write in another scope (even one without a renderer) may replace this
    // DOM-backed payload before the read, while ID-only writers affect the capture lookup.
    // A deferred module writer runs after parsing, so only a classic read/capture that completes
    // synchronously while parsing (not in a callback or after an await) precedes it.
    if (hasForeignDomWriteAt(initialBinding.at, captureAt)) return false;
    const mayBeSelectedScript = (reference, at, seen = new Set()) => {
      if (isSelectedScript(reference, at)) return true;
      if (!/^\w+$/.test(reference) || seen.has(reference)) return false;
      const next = new Set(seen).add(reference);
      // Reassigned/conditional aliases can still have pointed to this script.
      // Any observed copy is enough to make a later write unresolved.
      const copies = new RegExp(`\\b${reference}\\s*=\\s*([^;]+);`, "g");
      return Array.from(literalSource.matchAll(copies))
        .some(copy => mayBeSelectedScript(copy[1].trim(), copy.index, next));
    };
    // Reading an element binding does not establish its current textContent.
    // Unresolved writes through the element, a DOM query or a known alias block certification
    // whenever the write can precede the read that captures `src` (writes provably after a
    // top-level synchronous capture do not alter the already-captured string).
    // Static computed access (script["textContent"]) writes the same property as dot access.
    // Template keys are blanked in literalSource; match their length and confirm them in rawSource.
    const writeCanPrecedeRead = writeIndex => editCanPrecedeTarget(writeIndex, initialBinding.at);
    const target = String.raw`(\w+(?:\.querySelector\(\s*(['"])(.*?)\2\s*\))?)(?:\s*\.\s*(?:textContent|text)\b|\s*\[\s*(?:'(?:[^'\\\r\n]|\\[\s\S])*'|"(?:[^"\\\r\n]|\\[\s\S])*"|${TEMPLATE_TEXT_CONTENT_KEY})\s*\])`;
    const writes = new RegExp(`${target}\\s*(?:=(?!=|>)|(?:\\*\\*|&&|\\|\\||\\?\\?|[+\\-*/%&|^])=|\\+\\+|--)`, "g");
    const prefixWrites = new RegExp(`(?:\\+\\+|--)\\s*${target}`, "g");
    if ([...literalSource.matchAll(writes), ...literalSource.matchAll(prefixWrites)]
      .some(write => writeCanPrecedeRead(write.index) && isTextContentKey(write, rawSource) && mayBeSelectedScript(write[1], write.index))) return false;
    // Structural edits can change which script the card query returns (for example removing
    // the first matching script), so the read no longer proves this payload. Edits elsewhere,
    // such as replacing a separate diagram host's markup or appending after the script, keep it.
    const mayBeCardOwner = (name, seen = new Set()) => {
      if (cardOwners.has(name)) return true;
      if (seen.has(name)) return false;
      const next = new Set(seen).add(name);
      return Array.from(literalSource.matchAll(new RegExp(`(?<![\\w$.])${name}\\s*=\\s*(\\w+)\\s*;`, "g")))
        .some(copy => mayBeCardOwner(copy[1], next));
    };
    const mayBeScriptContainer = (reference, at, onlyContaining = false, seen = new Set()) => {
      if (mayBeCardOwner(reference)) return true;
      const q = query.exec(reference);
      if (q && mayBeCardOwner(q[1])) return selectedScript.mayContainScript?.(q[3], onlyContaining) ?? true;
      if (!/^\w+$/.test(reference) || seen.has(reference)) return false;
      const next = new Set(seen).add(reference);
      const bound = bindingAt(reference, at);
      if (bound && mayBeScriptContainer(bound.value, bound.at, onlyContaining, next)) return true;
      const copies = new RegExp(`\\b${reference}\\s*=\\s*([^;]+);`, "g");
      return Array.from(literalSource.matchAll(copies))
        .some(copy => mayBeScriptContainer(copy[1].trim(), copy.index, onlyContaining, next));
    };
    const mayBeCardScript = (reference, at, seen = new Set()) => {
      if (mayBeSelectedScript(reference, at)) return true;
      const q = query.exec(reference);
      if (q && /^script(?![\w-])/i.test(q[3]) && mayBeCardOwner(q[1])) return true;
      if (!/^\w+$/.test(reference) || seen.has(reference)) return false;
      const next = new Set(seen).add(reference);
      const bound = bindingAt(reference, at);
      if (bound && mayBeCardScript(bound.value, bound.at, next)) return true;
      const copies = new RegExp(`\\b${reference}\\s*=\\s*([^;]+);`, "g");
      return Array.from(literalSource.matchAll(copies))
        .some(copy => mayBeCardScript(copy[1].trim(), copy.index, next));
    };
    // The selector stays inside one quoted literal so a match cannot span two queries.
    const receiver = String.raw`(\w+(?:\.querySelector\(\s*(?:'([^'\r\n]*)'|"([^"\r\n]*)")\s*\))?)\s*\.\s*`;
    const scriptEdits = new RegExp(`${receiver}(?:(?:remove|replaceWith|before|after|insertAdjacent(?:HTML|Element|Text))\\s*\\(|outerHTML\\s*=(?!=))`, "g");
    const ownerEdits = new RegExp(`${receiver}(?:(?:removeChild|replaceChild|insertBefore|prepend|replaceChildren|insertAdjacent(?:HTML|Element|Text))\\s*\\(|(?:innerHTML|outerHTML|textContent|innerText)\\s*=(?!=))`, "g");
    const wrapperAppendEdits = new RegExp(`${receiver}(?:append|appendChild)\\s*\\(`, "g");
    const isSvgOnlyEdit = edit => {
      if (!/\binnerHTML\s*=\s*$/.test(edit[0])) return false;
      const rhs = /^\s*(['"])((?:[^\\\r\n]|\\.)*)\1\s*(?:;|$|[\r\n](?!\s*(?:[([`.+\-*/%<>=!&|^?:,\\]|\b(?:in|instanceof)\b)))/.exec(rawSource.slice(edit.index + edit[0].length));
      if (!rhs) return false;
      const html = decodeQuotedEntryEscapes(rhs[2], true);
      return html !== undefined && /^\s*<svg\b[\s\S]*<\/svg>\s*$/i.test(html) && !/<script\b/i.test(html);
    };
    const extractCallArgs = edit => {
      const start = edit.index + edit[0].length;
      let depth = 1, end = -1;
      for (let k = start; k < executable.length; k++) {
        if (executable[k] === "(") depth++;
        else if (executable[k] === ")" && --depth === 0) { end = k; break; }
      }
      if (end < 0) return null;
      const args = [];
      let argStart = start, paren = 0, bracket = 0, brace = 0;
      for (let k = start; k < end; k++) {
        const ch = executable[k];
        if (ch === "(") paren++;
        else if (ch === ")") paren--;
        else if (ch === "[") bracket++;
        else if (ch === "]") bracket--;
        else if (ch === "{") brace++;
        else if (ch === "}") brace--;
        else if (ch === "," && paren === 0 && bracket === 0 && brace === 0) {
          args.push(literalSource.slice(argStart, k).trim());
          argStart = k + 1;
        }
      }
      args.push(literalSource.slice(argStart, end).trim());
      if (args.length === 0 || args.some(a => a === "")) return null;
      return args;
    };
    // Match receivers and methods on `executable` so string literals never trigger edits,
    // while reading selector arguments from the offset-aligned `literalSource`.
    const matchExecutableEdits = re =>
      Array.from(executable.matchAll(re), edit =>
        Object.assign(edit, { 1: literalSource.slice(edit.index, edit.index + edit[1].length) })
      );
    const allOwnerEdits = matchExecutableEdits(ownerEdits);
    const allWrapperAppendEdits = matchExecutableEdits(wrapperAppendEdits);
    const isFreshNonScriptNode = (expr, at, seen = new Set()) => {
      const createEl = /^document\.createElement\(\s*(['"])([A-Za-z][\w-]*)\1\s*\)$/.exec(expr);
      if (createEl) return createEl[2].toLowerCase() !== "script";
      if (/^document\.createTextNode\(\s*(['"])(?:[^\\]|\\.)*\1\s*\)$/.test(expr)) return true;
      if (/^(['"])(?:[^\\]|\\.)*\1$/.test(expr)) return true;
      if (/^\w+$/.test(expr) && !seen.has(expr)) {
        const bound = bindingAt(expr, at);
        if (!bound) return false;
        const nextSeen = new Set(seen).add(expr);
        if (!isFreshNonScriptNode(bound.value, bound.at, nextSeen)) return false;
        // A detached wrapper that receives non-fresh children or HTML edits (e.g. a moved
        // card script or injected markup) is no longer provably an empty fresh node.
        if (allOwnerEdits.some(e => e[1] === expr && !isSvgOnlyEdit(e))) return false;
        if (allWrapperAppendEdits.some(e => e[1] === expr && !isSafeFreshAppend(e, nextSeen))) return false;
        return true;
      }
      return false;
    };
    const isSafeFreshAppend = (edit, seen = new Set()) => {
      const args = extractCallArgs(edit);
      if (!args) return false;
      return args.every(arg => isFreshNonScriptNode(arg, edit.index, seen));
    };
    // Changing a script's type can move a typed query (script[type="text/plain"]) to another script.
    // Attribute writes with a literal non-type name keep the selection; computed names stay unresolved.
    const typeEdits = new RegExp(`${receiver}(?:type\\s*=(?!=)|(?:setAttribute|removeAttribute|toggleAttribute|setAttributeNS|removeAttributeNS|setAttributeNode(?:NS)?|removeAttributeNode)\\s*\\()`, "gi");
    const isNonTypeLiteralAttrEdit = edit =>
      /\b(?:setAttribute|removeAttribute|toggleAttribute)\s*\($/i.test(edit[0]) &&
      /^\s*(['"])(?!type\1)[^'"\n]*\1/i.test(literalSource.slice(edit.index + edit[0].length));
    if (matchExecutableEdits(scriptEdits).some(edit =>
      mayBeScriptContainer(edit[1], edit.index) ||
      (writeCanPrecedeRead(edit.index) && mayBeSelectedScript(edit[1], edit.index))
    ) ||
      (usesTypedScriptQuery && matchExecutableEdits(typeEdits).some(edit => editCanPrecedeTarget(edit.index, scriptQueryAt) && !isNonTypeLiteralAttrEdit(edit) && mayBeCardScript(edit[1], edit.index))) ||
      allOwnerEdits.some(edit =>
        mayBeScriptContainer(edit[1], edit.index, isSvgOnlyEdit(edit)) ||
        (writeCanPrecedeRead(edit.index) && mayBeSelectedScript(edit[1], edit.index))
      ) ||
      allWrapperAppendEdits.some(edit =>
        mayBeCardOwner(edit[1])
          ? !isSafeFreshAppend(edit)
          : mayBeScriptContainer(edit[1], edit.index) || (extractCallArgs(edit) ?? []).some(arg => mayBeCardScript(arg, edit.index))
      )) return false;
    return { base: usesValidatedDedent ? dedentedPayload : payload, certifiedLoopOpen };
  };
  // Verify that `mermaid` resolves to the page's global renderer rather than a locally
  // declared, assigned, shadowed, or foreign-object property binding.
  const isUnshadowedGlobalBinding = name => {
    const esc = name.replace(/\$/g, "\\$");
    const shadowRe = new RegExp(
      String.raw`\b(?:var|let|const|function|class)\s+${esc}(?![\w$])|\b(?:function\b[^()]*|catch)\s*\([^)]*\b${esc}(?![\w$])|\([^)]*\b${esc}(?![\w$])[^)]*\)\s*=>|\b${esc}\s*=>|\b(?:const|let|var)\s+[^;\n{}]*[,{[]\s*${esc}(?![\w$])|\bimport\b[^;\n]*\b${esc}(?![\w$])`
    );
    if (shadowRe.test(executable) || writeIndexes(name).size > 0) return false;
    const globalAssignRe = new RegExp(
      String.raw`\b(?:window|globalThis|self)\s*(?:\.\s*${esc}(?![\w$])|\[\s*(['"])${esc}\1\s*\])\s*=(?!=)`,
      "g"
    );
    for (const m of literalSource.matchAll(globalAssignRe)) {
      if (executable[m.index] === literalSource[m.index]) return false;
    }
    return true;
  };
  // Strings/comments are already masked. Balance parentheses so later ASI
  // statements cannot supply a suffix that this render call never receives.
  const renderUses = [];
  const suffixFreeCalls = [];
  for (const call of executable.matchAll(/\bmermaid\s*\.\s*render\s*\(/g)) {
    const beforeCall = executable.slice(0, call.index);
    const memberAccess = /\.\s*$/.test(beforeCall);
    if (memberAccess) {
      const globalOwner = /(?<![\w$.])(window|globalThis|self)\s*\.\s*$/.exec(beforeCall);
      if (!globalOwner || !isUnshadowedGlobalBinding(globalOwner[1]) || !isUnshadowedGlobalBinding("mermaid")) return null;
    } else if (!isUnshadowedGlobalBinding("mermaid")) {
      return null;
    }
    const start = call.index + call[0].length;
    const arguments_ = [];
    const stack = ["("];
    let argumentStart = start;
    let complete = false;
    for (let end = start; end < executable.length; end++) {
      const char = executable[end];
      if ("([{".includes(char)) stack.push(char);
      else if (")]}".includes(char)) {
        if (stack.pop() !== { ")": "(", "]": "[", "}": "{" }[char]) return null;
        if (stack.length === 0) {
          arguments_.push({ start: argumentStart, end });
          complete = true;
          break;
        }
      } else if (char === "," && stack.length === 1) {
        arguments_.push({ start: argumentStart, end });
        argumentStart = end + 1;
      }
    }
    if (!complete || arguments_.length < 2) return null;
    // A spread among the first two arguments can shift which value reaches the source parameter.
    if (arguments_.slice(0, 2).some(argument => /^\s*\.\.\./.test(executable.slice(argument.start, argument.end)))) return null;
    const source = arguments_[1];
    const expression = executable.slice(source.start, source.end);
    // Template bodies are masked in both analysis views. Inspect their original,
    // offset-aligned text so interpolated suffixes cannot certify the base chart.
    // Evaluating these expressions is beyond this literal-only resolver.
    for (const template of expression.matchAll(/`[^`]*`/g)) {
      const start = source.start + template.index;
      if (/(?:^|[^\\])(?:\\\\)*\$\{/.test(rawSource.slice(start, start + template[0].length))) return null;
    }
    const names = Array.from(expression.matchAll(/\bCLASSDEFS\b/g));
    if (names.length === 0) {
      // A source alias (including a rewritten src) may already carry CLASSDEFS.
      // Only the base src and literal-only arguments are known suffix-free here;
      // resolving arbitrary assignments/calls needs data-flow analysis.
      const base = expression.trim();
      if (base !== "src" && !/^(?:"[^"\r\n]*"|'[^'\r\n]*'|`[^`]*`)$/.test(base)) return null;
      let resolvedSrc;
      if (base === "src") {
        resolvedSrc = srcIsPayload(call.index);
        if (!resolvedSrc) return null;
      } else {
        const leading = expression.indexOf(base);
        const literalStart = source.start + leading;
        const literal = rawSource.slice(literalStart, literalStart + base.length);
        const value = decodeQuotedEntryEscapes(literal.slice(1, -1), true);
        if (value === undefined || normalizeMermaidSource(value) !== normalizeMermaidSource(payload)) return null;
      }
      suffixFreeCalls.push({ call: call.index, certifiedLoopOpen: resolvedSrc?.certifiedLoopOpen });
      continue;
    }
    const unwrap = value => {
      value = value.trim();
      while (value.startsWith("(")) {
        let depth = 0;
        let closing = -1;
        for (let i = 0; i < value.length; i++) {
          if (value[i] === "(") depth++;
          if (value[i] === ")" && --depth === 0) { closing = i; break; }
        }
        if (closing !== value.length - 1) break;
        value = value.slice(1, -1).trim();
      }
      return value;
    };
    const value = unwrap(expression);
    let depth = 0;
    const plus = [];
    for (let i = 0; i < value.length; i++) {
      if (value[i] === "(") depth++;
      else if (value[i] === ")") depth--;
      else if (value[i] === "+" && depth === 0) plus.push(i);
    }
    if (plus.length !== 1 || unwrap(value.slice(0, plus[0])) !== "src" || unwrap(value.slice(plus[0] + 1)) !== "CLASSDEFS") return null;
    const resolvedSrc = srcIsPayload(call.index);
    if (!resolvedSrc) return null;
    renderUses.push({ index: source.start + names[0].index, call: call.index, base: resolvedSrc.base, certifiedLoopOpen: resolvedSrc.certifiedLoopOpen });
  }
  // Unproven loops (for/while) may execute zero times; only function bodies and
  // loops whose entry/iteration is already proven (certifiedLoopOpen) are transparent.
  const functionHead = /(?:\bfunction\b[^{}]*\)|=>)\s*$/;
  const exitKeyword = /(?:return|throw|break|continue)(?![\w$])/y;
  const isUnbracedOrShortCircuited = (callIndex, callPath) => {
    const blockStart = callPath.length > 0 ? callPath[callPath.length - 1] + 1 : 0;
    let stmtStart = blockStart;
    let paren = 0, bracket = 0, brace = 0;
    for (let i = blockStart; i < callIndex; i++) {
      const ch = executable[i];
      if (ch === "(") paren++;
      else if (ch === ")") paren--;
      else if (ch === "[") bracket++;
      else if (ch === "]") bracket--;
      else if (ch === "{") brace++;
      else if (ch === "}") {
        brace--;
        if (paren === 0 && bracket === 0 && brace === 0) stmtStart = i + 1;
      } else if (ch === ";" && paren === 0 && bracket === 0 && brace === 0) {
        stmtStart = i + 1;
      }
    }
    const stmtPrefix = executable.slice(stmtStart, callIndex);
    return /^\s*(?:if|else|while|for|do|switch|with)(?![\w$])/.test(stmtPrefix) || /&&|\|\||\?/.test(stmtPrefix);
  };
  const functions = functionBodies(executable);
  const loops = loopExtents(executable);
  const blockPathAt = idx => {
    const path = [];
    for (let k = 0; k < idx; k++) {
      if (executable[k] === "{") path.push(k);
      else if (executable[k] === "}") path.pop();
    }
    return path;
  };
  const isPathPrefix = (prefix, full) =>
    prefix.length <= full.length && prefix.every((block, i) => full[i] === block);
  const hasPriorExit = (start, target) => {
    const nestedFns = functions.filter(fn => fn.body >= start && fn.body < target);
    const closedLoops = loops.filter(loop => loop.open >= start && loop.end < target);
    const re = /(?<![\w$.])(return|throw|break|continue)(?![\w$])/g;
    re.lastIndex = start;
    let m;
    while ((m = re.exec(executable)) !== null && m.index < target) {
      const idx = m.index;
      if (nestedFns.some(fn => fn.body < idx && idx < fn.end)) continue;
      if ((m[1] === "break" || m[1] === "continue") &&
          closedLoops.some(loop => loop.open < idx && idx < loop.end)) continue;
      return true;
    }
    return false;
  };
  const isUnwrittenDocumentAddEventListener = () => {
    const re = /(?<![\w$.])(?:(?:window|globalThis|self)\s*\.\s*)?document\s*(?:\.\s*addEventListener(?![\w$])|\[\s*(['"])addEventListener\1\s*\])\s*(?:(?:\*\*|&&|\|\||\?\?|<<|>>>?|[-+*/%&|^])?=(?!=)|\+\+|--)/g;
    for (const m of literalSource.matchAll(re)) {
      if (executable[m.index] === literalSource[m.index]) return false;
    }
    return true;
  };
  const findLifecycleActivationSite = (beforeExec, beforeLit) => {
    const match = /(?<![\w$.])(?:(?:(window|globalThis|self)\s*\.\s*)?(document)\s*\.\s*|(window|globalThis|self)\s*\.\s*)?(addEventListener)\s*\(\s*(['"])(DOMContentLoaded|load)\5\s*,\s*$/.exec(beforeLit);
    if (!match) return -1;
    if (beforeExec[match.index] !== beforeLit[match.index]) return -1;
    const [, docOwner, docName, winOwner, methodName, , eventName] = match;
    // `load` fires on window/globalThis/self (or bare global addEventListener), not `document`.
    if (eventName === "load" && docName) return -1;
    if (docOwner && !isUnshadowedGlobalBinding(docOwner)) return -1;
    if (docName) {
      if (!isUnshadowedGlobalBinding(docName) || !isUnwrittenDocumentAddEventListener()) return -1;
    } else {
      if (winOwner && !isUnshadowedGlobalBinding(winOwner)) return -1;
      if (!isUnshadowedGlobalBinding(methodName)) return -1;
    }
    return match.index;
  };
  const segmentOf = idx => selectedScript.segments.findIndex(seg => seg.start <= idx && idx <= seg.end);
  // Verify enclosing functions (named or anonymous) are actually activated via a reachable call,
  // IIFE, timer callback, or DOMContentLoaded/load listener.
  const hasReachableActivation = (pos, certifiedLoopOpen, active = new Set(), seen = new Set()) => {
    // A callable-looking block missing from the function inventory cannot be proven activated.
    if (blockPathAt(pos).some(block => functionHead.test(executable.slice(0, block)) && !functions.some(fn => fn.body === block))) return false;
    const isReachableSite = siteIndex => {
      const sitePath = blockPathAt(siteIndex);
      if (sitePath.some(block => !functionHead.test(executable.slice(0, block)) || !functions.some(fn => fn.body === block))) return false;
      if (isUnbracedOrShortCircuited(siteIndex, sitePath)) return false;
      const enclosingStart = sitePath.length > 0 ? sitePath[sitePath.length - 1] + 1 : 0;
      if (hasPriorExit(enclosingStart, siteIndex)) return false;
      return hasReachableActivation(siteIndex, certifiedLoopOpen, active, seen);
    };
    const findTimerActivationSite = before => {
      const timerMatch = /(?<![\w$.])(?:(window|globalThis|self)\s*\.\s*)?(setTimeout|requestAnimationFrame|queueMicrotask)\s*\(\s*$/.exec(before);
      if (!timerMatch) return -1;
      if (timerMatch[1] && !isUnshadowedGlobalBinding(timerMatch[1])) return -1;
      if (!isUnshadowedGlobalBinding(timerMatch[2])) return -1;
      const handle = /([A-Za-z_$][\w$]*)\s*=\s*$/.exec(before.slice(0, timerMatch.index))?.[1];
      const cancelled = cancelsSchedulerHandle(executable, handle, timerMatch[2]);
      return cancelled ? -1 : timerMatch.index;
    };
    // DOMContentLoaded only reaches a listener registered before dispatch: every enclosing
    // function of the registration must run synchronously (IIFE); deferred or unproven
    // registrations (timers, later calls, other listeners) are not certified.
    const isLifecycleOrderProven = siteIndex => {
      const eventName = /^(?:[\w$]+\s*\.\s*)*addEventListener\s*\(\s*(['"])(DOMContentLoaded|load)\1/.exec(literalSource.slice(siteIndex))?.[2];
      if (eventName !== "load" && eventName !== "DOMContentLoaded") return false;
      return functions.filter(f => f.body < siteIndex && siteIndex < f.end).every(f => isDirectOrCallbackActivation(f, true));
    };
    const isDirectOrCallbackActivation = (fn, iifeOnly = false) => {
      const rawBefore = executable.slice(0, fn.start);
      const beforeFn = rawBefore.replace(/\basync\s*$/, "");
      const beforeFnLit = literalSource.slice(0, fn.start).replace(/\basync\s*$/, "");
      const afterFn = executable.slice(fn.end);
      // Immediately invoked function expression: (fn)(), (fn()), !fn(), void fn(), etc.
      // Only parentheses that group an expression count; call-argument parentheses
      // such as `discard(() => {})()` belong to the outer call, not an IIFE wrapper.
      const isGroupingParen = openPos => {
        const beforeOpen = beforeFn.slice(0, openPos).trimEnd();
        if (beforeOpen === "") return true;
        if (/[;:,=+\-*/%&|^!~<>?{[(]$/.test(beforeOpen)) return true;
        return /(?<![\w$.])(?:return|throw|yield|await|typeof|void|delete|in|instanceof|of|new|case|else|do)$/.test(beforeOpen);
      };
      let left = beforeFn.length;
      while (left > 0 && /\s/.test(beforeFn[left - 1])) left--;
      const groupingOpens = [];
      let scan = left;
      while (scan > 0 && beforeFn[scan - 1] === "(") {
        const openPos = scan - 1;
        if (!isGroupingParen(openPos)) break;
        groupingOpens.push(openPos);
        scan = openPos;
        while (scan > 0 && /\s/.test(beforeFn[scan - 1])) scan--;
      }
      let right = 0;
      let closeParens = 0;
      while (closeParens < groupingOpens.length) {
        const ws = /^\s*\)/.exec(afterFn.slice(right));
        if (!ws) break;
        right += ws[0].length;
        closeParens++;
      }
      const isArrowFn = /=>/.test(executable.slice(fn.start, fn.body));
      const isGroupedIife = groupingOpens.length > 0 &&
        (closeParens > 0 || !isArrowFn) &&
        /^\s*\(/.test(afterFn.slice(right));
      const iifeStart = groupingOpens[Math.max(0, closeParens - 1)] ?? fn.start;
      const unaryIife = /(?:[!~+-]|\bvoid)\s*$/.exec(beforeFn);
      const isUnaryIife = unaryIife !== null && !isArrowFn && /^\s*\(/.test(afterFn);
      if (isGroupedIife && isReachableSite(iifeStart)) return true;
      if (isUnaryIife && isReachableSite(unaryIife.index)) return true;
      if (iifeOnly) return false;
      // Timer callback: setTimeout/requestAnimationFrame/queueMicrotask with unshadowed scheduler.
      const endsAtArgument = /^\s*[,)]/.test(afterFn);
      const timerSite = endsAtArgument ? findTimerActivationSite(beforeFn) : -1;
      if (timerSite >= 0 && isReachableSite(timerSite)) return true;
      // Document/window load lifecycle callback on a supported, unshadowed receiver.
      const lifecycleSite = endsAtArgument ? findLifecycleActivationSite(beforeFn, beforeFnLit) : -1;
      if (lifecycleSite >= 0 && isReachableSite(lifecycleSite) && isLifecycleOrderProven(lifecycleSite)) {
        return true;
      }
      return false;
    };
    const resolvesToCallableBinding = (fn, callableName, callableNameIndex, boundDecl, refIndex) => {
      const refPath = blockPathAt(refIndex);
      const esc = callableName.replace(/\$/g, "\\$");
      let declPath;
      if (fn.name) {
        const beforeDecl = executable.slice(0, fn.start).replace(/\basync\s*$/, "").trimEnd();
        const isFnDecl = beforeDecl === "" || /[;{}]$/.test(beforeDecl) || /(?<![\w$.])export(?:\s+default)?$/.test(beforeDecl);
        if (!isFnDecl) return false;
        declPath = blockPathAt(fn.start);
        if (!isPathPrefix(declPath, refPath)) return false;
        // Reassignment to the function declaration binding makes the resolved target unproven.
        if (Array.from(writeIndexes(callableName)).some(w => isPathPrefix(declPath, blockPathAt(w)))) return false;
      } else {
        const declKind = boundDecl[1].trim();
        const rawDeclPath = blockPathAt(boundDecl.index);
        if (declKind === "var") {
          const enclosingFn = functions.filter(f => f.body < boundDecl.index && boundDecl.index < f.end).at(-1);
          declPath = enclosingFn ? rawDeclPath.slice(0, rawDeclPath.indexOf(enclosingFn.body) + 1) : [];
        } else {
          declPath = rawDeclPath;
        }
        if (!isPathPrefix(declPath, refPath)) return false;
      }
      // Reject declaration/method names that happen to be followed by `(`.
      if (/(?:\bfunction(?:\s*\*)?|\b(?:var|let|const|class|import|get|set))\s+$/.test(executable.slice(0, refIndex))) return false;
      // Reject if any enclosing function narrower than declPath shadows callableName via parameter or name.
      const nameRe = new RegExp(`(?<![\\w$.])${esc}(?![\\w$])`);
      for (const enc of functions) {
        if (enc.body < refIndex && refIndex < enc.end && !declPath.includes(enc.body)) {
          if (nameRe.test(executable.slice(enc.start, enc.body))) return false;
        }
      }
      // Reject if any enclosing catch or for-header block narrower than declPath shadows callableName.
      const catchShadowRe = new RegExp(String.raw`\bcatch\s*\([^()]*\b${esc}(?![\w$])[^()]*\)\s*$`);
      const forShadowRe = new RegExp(String.raw`\bfor\s*\(\s*(?:var|let|const)\b[^)]*\b${esc}(?![\w$])[^)]*\)\s*$`);
      for (const block of refPath.slice(declPath.length)) {
        const beforeBlock = executable.slice(0, block);
        if (catchShadowRe.test(beforeBlock) || forShadowRe.test(beforeBlock)) return false;
      }
      // Reject if any other declaration (var/let/const/function/class/import, including destructuring)
      // in declPath or a narrower enclosing scope shadows or redeclares callableName.
      const declKeywords = /\b(var|let|const|function(?:\s*\*)?|class|import)\b/g;
      for (const kw of executable.matchAll(declKeywords)) {
        const kind = kw[1];
        const afterKw = kw.index + kw[0].length;
        if (kind.startsWith("function") || kind === "class") {
          const idMatch = /^\s+([A-Za-z_$][\w$]*)/.exec(executable.slice(afterKw));
          if (!idMatch || idMatch[1] !== callableName) continue;
          const namePos = afterKw + idMatch[0].length - callableName.length;
          if (namePos === callableNameIndex) continue;
          const shadowScopePath = blockPathAt(kw.index);
          if (shadowScopePath.length >= declPath.length && isPathPrefix(shadowScopePath, refPath)) return false;
          continue;
        }
        if (kind === "import") {
          const semi = executable.indexOf(";", afterKw);
          const nl = executable.indexOf("\n", afterKw);
          const endPos = Math.min(semi < 0 ? executable.length : semi, nl < 0 ? executable.length : nl);
          if (!nameRe.test(executable.slice(afterKw, endPos))) continue;
          const shadowScopePath = blockPathAt(kw.index);
          if (shadowScopePath.length >= declPath.length && isPathPrefix(shadowScopePath, refPath)) return false;
          continue;
        }
        let depth = 0;
        let inInit = false;
        let k = afterKw;
        while (k < executable.length) {
          const ch = executable[k];
          if (depth === 0 && (ch === ";" || ch === "\n" || ch === "}")) break;
          if ("([{".includes(ch)) {
            depth++;
          } else if (")]}".includes(ch)) {
            if (depth === 0) break;
            depth--;
          } else if (depth === 0 && ch === "=" && executable[k + 1] !== "=" && executable[k + 1] !== ">") {
            inInit = true;
          } else if (depth === 0 && ch === ",") {
            inInit = false;
          } else if (!inInit && /[A-Za-z_$]/.test(ch) && !/[\w$.]/.test(executable[k - 1] ?? "")) {
            const idm = /^[A-Za-z_$][\w$]*/.exec(executable.slice(k));
            const ident = idm[0];
            const afterIdent = k + ident.length;
            const isPropKey = depth > 0 && /^\s*:/.test(executable.slice(afterIdent));
            if (ident === callableName && !isPropKey && k !== callableNameIndex) {
              const rawShadowPath = blockPathAt(kw.index);
              let shadowScopePath = rawShadowPath;
              if (kind === "var") {
                const encFn = functions.filter(f => f.body < kw.index && kw.index < f.end).at(-1);
                shadowScopePath = encFn ? rawShadowPath.slice(0, rawShadowPath.indexOf(encFn.body) + 1) : [];
              }
              if (shadowScopePath.length >= declPath.length && isPathPrefix(shadowScopePath, refPath)) return false;
            }
            k = afterIdent;
            continue;
          }
          k++;
        }
      }
      return true;
    };
    for (const fn of functions.filter(fn => fn.body < pos && pos < fn.end)) {
      if (hasPriorExit(fn.body + 1, pos)) return false;
      if (certifiedLoopOpen !== undefined && fn.body > certifiedLoopOpen) continue;
      if (seen.has(fn)) continue;
      if (active.has(fn)) return false;
      active.add(fn);
      const isGenerator = /^function\s*\*/.test(executable.slice(fn.start, fn.body));
      let invoked = !isGenerator && isDirectOrCallbackActivation(fn);
      const rawBeforeFn = executable.slice(0, fn.start).replace(/\basync\s*$/, "");
      const boundDecl = !fn.name ? /\b((?:const|let|var)\s+)([A-Za-z_$][\w$]*)\s*=\s*$/.exec(rawBeforeFn) : null;
      const boundName = boundDecl?.[2];
      const boundNameIndex = boundDecl ? boundDecl.index + boundDecl[1].length : -1;
      const callableName = fn.name ?? (boundName && Array.from(writeIndexes(boundName)).every(w => w === boundNameIndex) ? boundName : undefined);
      const callableNameIndex = fn.name ? fn.nameIndex : boundNameIndex;
      if (!invoked && !isGenerator && callableName) {
        const fnSegment = segmentOf(fn.start);
        const refs = executable.matchAll(new RegExp(`(?<![\\w$]|\\.\\s*)${callableName.replace(/\$/g, "\\$")}(?![\\w$])`, "g"));
        for (const ref of refs) {
          if (ref.index === callableNameIndex) continue;
          if (!fn.name && ref.index < fn.end) continue;
          const refSegment = segmentOf(ref.index);
          if (fnSegment >= 0 && refSegment >= 0 && refSegment < fnSegment) continue;
          const afterRef = executable.slice(ref.index + ref[0].length);
          const isConstructed = /(?<![\w$.])new\s*$/.test(executable.slice(0, ref.index));
          const nonConstructible = isGenerator || /=>/.test(executable.slice(fn.start, fn.body));
          const isCall = /^\s*\(/.test(afterRef) && !(isConstructed && nonConstructible);
          const lifecycleSite = /^\s*[,)]/.test(afterRef)
            ? findLifecycleActivationSite(executable.slice(0, ref.index), literalSource.slice(0, ref.index))
            : -1;
          const timerSite = /^\s*[,)]/.test(afterRef) ? findTimerActivationSite(executable.slice(0, ref.index)) : -1;
          if (!isCall && lifecycleSite < 0 && timerSite < 0) continue;
          if (!resolvesToCallableBinding(fn, callableName, callableNameIndex, boundDecl, ref.index)) continue;
          const siteIndex = isCall ? ref.index : (lifecycleSite >= 0 ? lifecycleSite : timerSite);
          if (isReachableSite(siteIndex) && (isCall || lifecycleSite < 0 || isLifecycleOrderProven(lifecycleSite))) {
            invoked = true;
            break;
          }
        }
      }
      active.delete(fn);
      if (!invoked) return false;
      seen.add(fn);
    }
    return true;
  };
  if (renderUses.length === 0) {
    if (suffixFreeCalls.length === 0) return undefined;
    const targets = new Set(suffixFreeCalls.map(entry => entry.call));
    const paths = new Map();
    const blocks = [];
    for (let index = 0; index < executable.length; index++) {
      if (targets.has(index)) paths.set(index, [...blocks]);
      if (executable[index] === "{") blocks.push(index);
      else if (executable[index] === "}") {
        if (blocks.length === 0) return null;
        blocks.pop();
      }
    }
    if (blocks.length > 0) return null;
    for (const { call: callIndex, certifiedLoopOpen } of suffixFreeCalls) {
      const callPath = paths.get(callIndex);
      const uncertifiedBlocks = certifiedLoopOpen === undefined
        ? callPath
        : callPath.filter(block => block < certifiedLoopOpen);
      if (uncertifiedBlocks.some(block => !functionHead.test(executable.slice(0, block)))) return null;
      if (!hasReachableActivation(callIndex, certifiedLoopOpen)) return null;
      let depth = 0;
      for (let i = 0; i < callIndex; i++) {
        if (executable[i] === "{") depth++;
        else if (executable[i] === "}") depth--;
        else if (depth === 0 && !/[\w$]/.test(executable[i - 1] ?? "")) {
          exitKeyword.lastIndex = i;
          if (exitKeyword.test(executable)) return null;
        }
      }
      if (certifiedLoopOpen === undefined && isUnbracedOrShortCircuited(callIndex, callPath)) return null;
    }
    return undefined;
  }
  // Selector collection is scope-wide: it cannot associate mixed calls with
  // individual cards. Preserve the ambiguity instead of applying one suffix to all.
  if (suffixFreeCalls.length > 0 || renderUses.some(use => use.base !== renderUses[0].base)) return null;
  // Locate the declaration in code, then read its literal from the offset-aligned view.
  const declaration = /\b(?:var|let|const)\s+CLASSDEFS\s*=/.exec(executable);
  if (!declaration) return null;
  const declarationName = declaration.index + declaration[0].indexOf("CLASSDEFS");
  const allowedNames = new Set([declarationName, ...renderUses.map(use => use.index)]);
  // Parameters, destructuring, catch bindings and other references require
  // lexical analysis beyond this literal-only evaluator. Never guess an outer binding.
  if (Array.from(executable.matchAll(/\bCLASSDEFS\b/g)).some(name => !allowedNames.has(name.index))) return null;
  const targets = new Set([declaration.index, ...renderUses.map(use => use.call)]);
  const paths = new Map();
  const blocks = [];
  for (let index = 0; index < executable.length; index++) {
    if (targets.has(index)) paths.set(index, [...blocks]);
    if (executable[index] === "{") blocks.push(index);
    else if (executable[index] === "}") {
      if (blocks.length === 0) return null;
      blocks.pop();
    }
  }
  if (blocks.length > 0) return null;
  const declarationPath = paths.get(declaration.index);
  if (renderUses.some(use => declaration.index > use.call || !declarationPath.every((block, index) => paths.get(use.call)?.[index] === block))) return null;
  if (declaration) {
    const initialWrite = declaration.index + declaration[0].indexOf("CLASSDEFS");
    // Additional writes (including global object property writes in classic scripts) may run
    // under control flow or in callbacks. Do not certify an initializer without establishing
    // the value at render time.
    if (Array.from(writeIndexes("CLASSDEFS")).some(write => write !== initialWrite)) return null;
  }
  const initializerSource = declaration && literalSource.slice(declaration.index);
  const initializer = initializerSource && /^(?:var|let|const)\s+CLASSDEFS\s*=\s*((?:'(?:[^'\\\r\n]|\\.)*'|"(?:[^"\\\r\n]|\\.)*")(?:\s*\+\s*(?:'(?:[^'\\\r\n]|\\.)*'|"(?:[^"\\\r\n]|\\.)*"))*)/.exec(initializerSource);
  // Check the remainder separately so a failed terminator cannot backtrack to a
  // partial concatenation. A newline permits ASI only without an expression continuation.
  const complete = initializer && /^[ \t]*(?:;|$|[\r\n](?!\s*(?:[([`.+\-*/%<>=!&|^?:,\\]|\b(?:in|instanceof)\b)))/.test(initializerSource.slice(initializer[0].length));
  const literal = complete && initializer[1];
  if (!literal) return null;
  const initializedAt = declaration.index + initializer[0].length;
  // Textual order is not reachability. Certify CLASSDEFS only when each render call is
  // established as reachable: no unconditional exit at the declaration's block level before
  // the call, and every uncertified block entered beyond the declaration is a function body
  // (if/else/switch/try and unproven loops may skip the call). Anything else stays unresolved.
  for (const use of renderUses) {
    const callPath = paths.get(use.call);
    const uncertifiedBlocks = use.certifiedLoopOpen === undefined
      ? callPath.slice(declarationPath.length)
      : callPath.slice(declarationPath.length).filter(block => block < use.certifiedLoopOpen);
    if (uncertifiedBlocks.some(block => !functionHead.test(executable.slice(0, block)))) return null;
    if (!hasReachableActivation(use.call, use.certifiedLoopOpen)) return null;
    let depth = 0;
    for (let i = initializedAt; i < use.call; i++) {
      if (executable[i] === "{") depth++;
      else if (executable[i] === "}") depth--;
      else if (depth === 0 && !/[\w$]/.test(executable[i - 1] ?? "")) {
        exitKeyword.lastIndex = i;
        if (exitKeyword.test(executable)) return null;
      }
    }
    if (use.certifiedLoopOpen === undefined && isUnbracedOrShortCircuited(use.call, callPath)) return null;
  }
  if (!initializerRunsBefore(executable, declaration.index, initializedAt, declarationPath, renderUses.map(use => use.call), selectedScript.segments)) return null;
  const parts = Array.from(literal.matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g), m => decodeQuotedEntryEscapes(m[1] ?? m[2], true));
  return parts.some(part => part === undefined) ? null : renderUses[0].base + parts.join("");
}

/** HTML class tokens are separated by ASCII whitespace only (not NBSP or other Unicode spaces). */
function classTokens(value) {
  return (value ?? "").split(/[ \t\n\r\f]+/).filter(Boolean);
}

/**
 * Determine the HTML document's compatibility mode from its leading DOCTYPE:
 * - "standards" for standards/almost-standards DOCTYPEs (exact-case ID/class matching)
 * - "quirks" for full HTML documents without a DOCTYPE or known quirks DOCTYPEs (ASCII case-insensitive)
 * - "unknown" for fragments or unrecognized DOCTYPEs whose mode cannot be proven
 */
function detectDocumentMode(src) {
  const leading = src.replace(/^\uFEFF/, "").replace(/^(?:[ \t\n\r\f]|<!--[\s\S]*?-->)*/g, "");
  const doctype = /^<!DOCTYPE\s+([^>]*)>/i.exec(leading);
  if (!doctype) {
    return /^<(?:html|head|body)(?=[\s/>])/i.test(leading) ? "quirks" : "unknown";
  }
  const body = doctype[1].trim();
  if (/^html(?:\s+SYSTEM\s+(?:"about:legacy-compat"|'about:legacy-compat'))?$/i.test(body)) {
    return "standards";
  }
  if (/^html\s+PUBLIC\s+["']-\/\/W3C\/\/DTD\s+(?:HTML\s+4\.01(?:\s+Strict)?|XHTML\s+1\.[01])\/\/EN["'](?:\s+["'][^"']+["'])?$/i.test(body)) {
    return "standards";
  }
  if (/^html\s+PUBLIC\s+["']-\/\/W3C\/\/DTD\s+HTML\s+4\.01\s+(?:Transitional|Frameset)\/\/EN["']\s+["'][^"']+["']$/i.test(body)) {
    return "standards";
  }
  if (/^html\s+PUBLIC\s+["']-\/\/(?:W3C|IETF)\/\/DTD\s+HTML\s+(?:4\.0(?:1)?\s+(?:Transitional|Frameset)|3\.2|2\.0)/i.test(body)) {
    return "quirks";
  }
  if (!/^html(?:\s|$)/i.test(body)) return "quirks";
  return "unknown";
}

/** Match static card selectors; returns true, false, or "ambiguous" when mode-dependent case folding is unproven. */
function matchesCardSelector(tag, selector, docMode = "unknown") {
  if (!/^(?:[A-Za-z][\w-]*)?(?:[.#]-?[A-Za-z_][\w-]*)*$/.test(selector) || !selector) return false;
  const element = /^([A-Za-z][\w-]*)/.exec(selector)?.[1];
  if (element && /^<([\w-]+)/.exec(tag)?.[1].toLowerCase() !== element.toLowerCase()) return false;
  const idAttr = readHtmlAttribute(tag, "id");
  const classes = classTokens(readHtmlAttribute(tag, "class"));
  const asciiLower = s => s.replace(/[A-Z]/g, c => c.toLowerCase());
  let ambiguous = false;
  for (const [, kind, value] of selector.matchAll(/([.#])([\w-]+)/g)) {
    const exact = kind === "#" ? idAttr === value : classes.includes(value);
    if (exact) continue;
    if (docMode === "standards") return false;
    const ci = kind === "#"
      ? idAttr !== undefined && asciiLower(idAttr) === asciiLower(value)
      : classes.some(c => asciiLower(c) === asciiLower(value));
    if (!ci) return false;
    if (docMode !== "quirks") ambiguous = true;
  }
  return ambiguous ? "ambiguous" : true;
}

/**
 * Materialize display-only payloads scoped to their owning code/diagram card.
 * Scripts and comments are opaque while finding nested div boundaries; no source JS is executed.
 * @param {string} src - Original HTML.
 * @returns {{html: string, unresolvedMermaidSources: string[]}} Restored HTML and blocking unresolved contributions.
 */
function materializePlainTextCards(src) {
  const docMode = detectDocumentMode(src);
  const scripts = [];
  const opaqueElements = [];
  const documentElements = [];
  const unresolvedMermaidSources = [];
  // <template> content is inert until a script instantiates it; its scripts never run in place.
  let templateDepth = 0;
  const stashed = src.replace(/<!--[\s\S]*?-->|<(style|xmp|iframe|noembed|noframes|noscript|textarea|title)(?=[\s/>])((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)(?:<\/\1\s*>|$)|<script(?=[\s/>])((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>|<\/?[A-Za-z](?:[^>"']|"[^"]*"|'[^']*')*>/gi,
    (full, opaqueTag, opaqueAttrs, opaqueContent, attributes, payload) => {
      if (opaqueTag !== undefined) {
        if (templateDepth === 0) documentElements.push(`<${opaqueTag}${opaqueAttrs}>`);
        // Retain the opaque element's tag identity and document position while hiding its
        // raw-text contents so selector scans see the element without parsing its inner text.
        const content = /^(?:textarea|title)$/i.test(opaqueTag) ? opaqueContent : opaqueContent.replace(/&/g, "&amp;");
        opaqueElements.push(content.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        return `<${opaqueTag}${opaqueAttrs}>\u0000AUDITOPAQUE${opaqueElements.length - 1}\u0000</${opaqueTag}>`;
      }
      if (attributes === undefined) {
        // Template content is a separate fragment: keep the <template> element itself but do not
        // count its descendants as document elements for selector uniqueness.
        if (/^<[A-Za-z]/.test(full) && templateDepth === 0) documentElements.push(full);
        const template = /^<(\/?)template(?![\w:-])/i.exec(full);
        if (template) templateDepth = template[1] ? Math.max(0, templateDepth - 1) : templateDepth + 1;
        return full.startsWith("<!--") ? "" : full;
      }
      if (templateDepth === 0) documentElements.push(`<script${attributes}>`);
      scripts.push({ full, attributes, payload: payload.replace(/\r\n?/g, "\n"), index: scripts.length, inTemplate: templateDepth > 0 });
      return `<script data-audit-payload="${scripts.length - 1}"></script>`;
    });
  const executableScripts = scripts.filter(script => {
    // Scripts inside uninstantiated template content are not renderers for document cards.
    if (script.inTemplate) return false;
    const rawType = readHtmlAttribute(script.attributes, "type");
    // HTML spec: "module" is matched ASCII case-insensitively without trimming whitespace.
    script.isModule = rawType?.toLowerCase() === "module";
    // nomodule only suppresses classic scripts; module scripts run regardless.
    if (readHtmlAttribute(script.attributes, "nomodule") !== undefined && !script.isModule) return false;
    // The HTML standard's JavaScript MIME type essences (ASCII-whitespace-trimmed; text/plain payloads stay excluded).
    const isJsMime = mime => /^(?:(?:text|application)\/(?:x-)?(?:java|ecma)script|text\/javascript1\.[0-5]|text\/(?:jscript|livescript))$/.test(mime);
    const mimeType = rawType?.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "").toLowerCase();
    const rawLang = readHtmlAttribute(script.attributes, "language");
    // HTML spec: an empty type is classic JavaScript; language ("text/" + language, so VBScript
    // does not execute) is consulted only when type is absent.
    const isExecutableType = script.isModule ||
      (rawType === undefined
        ? (rawLang === undefined || rawLang === "" || isJsMime(`text/${rawLang.toLowerCase()}`))
        : rawType === "" || isJsMime(mimeType));
    if (!isExecutableType) return false;
    // A script with src ignores its child text; external renderer code is not inspectable here.
    if (readHtmlAttribute(script.attributes, "src") !== undefined) {
      const src = readHtmlAttribute(script.attributes, "src").trim();
      if (!/^(?:https?:)?\/\//i.test(src) && src !== "" && !unresolvedMermaidSources.includes(`external-script:${src}`)) {
        unresolvedMermaidSources.push(`external-script:${src}`);
      }
      return false;
    }
    return true;
  });
  // Classic scripts share the global scope; each module has its own CLASSDEFS.
  const allScopes = [
    executableScripts.filter(script => !script.isModule),
    ...executableScripts.filter(script => script.isModule).map(script => [script]),
  ].map(group => {
    const rawSource = group.map(script => script.payload).join("\n;\n");
    // Classic scripts run while the parser reaches them; module scripts run after parsing.
    const classic = group.every(script => !script.isModule);
    // Each classic script's span in the joined source and its document position, so the
    // script that performs a given read can be found from the read's offset.
    let offset = 0;
    const segments = group.map(script => {
      const segment = { start: offset, end: offset + script.payload.length,
        documentPosition: stashed.indexOf(`<script data-audit-payload="${script.index}"></script>`) };
      offset = segment.end + "\n;\n".length;
      return segment;
    });
    const resolution = {};
    const executable = blankNonCodeText(rawSource, false, resolution, false, !classic);
    const literalSource = group.map(script => blankNonCodeText(script.payload, true, {}, false, script.isModule)).join("\n;\n");
    const selectors = [];
    let hasDynamicSelection = false;
    const selectionCalls = Array.from(executable.matchAll(/\bdocument\.querySelector(?:All)?\s*\(/g));
    for (const call of selectionCalls) {
      const argument = /^\s*(['"])((?:[^\\]|\\.)*?)\1\s*\)/.exec(literalSource.slice(call.index + call[0].length));
      const decoded = argument ? decodeQuotedEntryEscapes(argument[2]) : undefined;
      if (decoded !== undefined) selectors.push(decoded);
      else hasDynamicSelection = true;
    }
    // An uncertain slash may have masked a renderer as a string/regex. Keep the
    // scope so rendererSuffix reports it unresolved instead of dropping it.
    const maskedRenderer = resolution.uncertain && /\bmermaid(?:\s|\/\*[\s\S]*?\*\/|\/\/[^\n\r\u2028\u2029]*)*\.(?:\s|\/\*[\s\S]*?\*\/|\/\/[^\n\r\u2028\u2029]*)*render\b/.test(rawSource);
    // Computed member calls (mermaid['render'](…), mermaid[name](…), mermaid?.render) and
    // aliased/bound references (const r = mermaid.render; mermaid.render.bind(mermaid);
    // const { render } = mermaid; const m = mermaid) are not traced by rendererSuffix;
    // keep them as an unresolved renderer instead of certifying the base.
    const aliasedRenderer = /\bmermaid\s*\.\s*render\b(?!\s*\()|\{\s*[^}]*\brender\b[^}]*\}\s*=\s*mermaid\b|(?<![!=])=\s*(?:window\s*\.\s*)?mermaid\s*(?:[;,)\r\n]|$)/.test(executable);
    // Identifier names may use unicode escapes (mermaid.\u0072ender(...)); string contents are already
    // blanked, so any escape left in `executable` belongs to an identifier. The resolver only reads
    // plain spellings, so an extra decoded call is kept as an unresolved renderer.
    const decodedExecutable = executable.replace(/\\u(?:\{([0-9a-fA-F]{1,6})\}|([0-9a-fA-F]{4}))/g,
      (whole, long, short) => { try { return String.fromCodePoint(parseInt(long ?? short, 16)); } catch { return whole; } });
    const renderCall = /\bmermaid\s*\.\s*render\s*\(/g;
    const escapedRenderer = decodedExecutable !== executable &&
      (decodedExecutable.match(renderCall) ?? []).length > (executable.match(renderCall) ?? []).length;
    const computedRenderer = /\bmermaid\s*(?:\?\.\s*)?\[|\bmermaid\s*\?\.\s*render\b/.test(executable) || aliasedRenderer || escapedRenderer;
    // Writes to any element's textContent/text (static or computed key) or structural/attribute
    // edits that can alter script selection or remove a queried host across scopes.
    const writesTextContent = /\.\s*(?:textContent|text)\s*(?:[-+*/%&|^]|\*\*|<<|>>>?|&&|\|\||\?\?)?=(?!=)/.test(executable) ||
      Array.from(literalSource.matchAll(new RegExp(String.raw`\[\s*(?:'(?:[^'\\\r\n]|\\[\s\S])*'|"(?:[^"\\\r\n]|\\[\s\S])*"|${TEMPLATE_TEXT_CONTENT_KEY})\s*\]\s*(?:[-+*/%&|^]|\*\*|<<|>>>?|&&|\|\||\?\?)?=(?!=)`, "g")))
        .some(write => executable[write.index] === "[" && isTextContentKey(write, rawSource));
    const editsDomStructure = /\.\s*(?:(?:remove|replaceWith|before|after|insertAdjacent(?:HTML|Element|Text)|removeChild|replaceChild|insertBefore|prepend|append|appendChild|replaceChildren|setAttribute(?:NS|Node|NodeNS)?|removeAttribute(?:NS|Node)?|toggleAttribute)\s*\(|(?:outerHTML|innerHTML|innerText|type|className)\s*=(?!=)|classList\s*\.\s*(?:add|remove|replace|toggle)\s*\()/.test(executable);
    const writesId = /\.\s*id\s*(?:[-+*/%&|^]|\*\*|<<|>>>?|&&|\|\||\?\?)?=(?!=)/.test(executable) ||
      Array.from(literalSource.matchAll(/\[\s*(['"])id\1\s*\]\s*(?:[-+*/%&|^]|\*\*|<<|>>>?|&&|\|\||\?\?)?=(?!=)/g))
        .some(write => executable[write.index] === "[");
    const writesDom = writesTextContent || editsDomStructure;
    // Inline module scripts without async run after the document is parsed.
    const deferredModule = !classic && group.every(script => readHtmlAttribute(script.attributes, "async") === undefined);
    // Inspect interpolation content so inert expressions (e.g. constant-only templates) do not
    // classify unrelated scripts as renderers, while calls/mermaid references remain unresolved.
    const executableInterpolation = (resolution.interpolations ?? []).some(expr =>
      /\bmermaid\b|(?:[\w$)\]]|\?\.)\s*\(|[\w$)\]]\s*`|\bnew\b/.test(expr)
    );
    return { literalSource, rawSource, selectors, hasDynamicSelection, computedRenderer, classic, deferredModule, segments, writesDom, writesId, hasSelection: selectionCalls.length > 0,
      hasRenderer: /\bmermaid\s*\.\s*render\s*\(/.test(executable) || executableInterpolation || maskedRenderer || computedRenderer };
  });
  const scopes = allScopes.filter(scope => scope.hasRenderer);
  const escape = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const templateRanges = extractElementContents(stashed, tag => /^<template(?![\w:-])/i.test(tag), true, false, null, true)
    .map(template => ({ start: template.index, end: template.end }));
  const unsupportedCardBoundaries = [];
  const cards = extractElementContents(stashed, tag => {
    return classTokens(readHtmlAttribute(tag, "class")).some(c => c === "code-block" || c === "diagram-card");
  }, true, false, unsupportedCardBoundaries, true);
  for (const unclosed of unsupportedCardBoundaries) {
    if (templateRanges.some(range => range.start < unclosed.index && unclosed.index < range.end)) continue;
    const payloadMarker = Array.from(unclosed.content.matchAll(/<script data-audit-payload="(\d+)"><\/script>/g)).find(match => {
      const script = scripts[Number(match[1])];
      return !script.inTemplate && readHtmlAttribute(script.attributes, "type")?.toLowerCase() === "text/plain" && readHtmlAttribute(script.attributes, "data-for") === undefined;
    });
    if (payloadMarker) {
      const cardId = readHtmlAttribute(unclosed.openingTag, "id") ?? `card-${payloadMarker[1]}`;
      unresolvedMermaidSources.push(`boundary:${cardId}`);
    }
  }
  const edits = [];
  for (const card of cards.reverse()) {
    const start = card.index + card.openingTag.length;
    let ownedContent = card.content;
    // Hide descendants without shifting offsets. Each payload belongs only to
    // its nearest card, even when a matching wrapper also contains child cards.
    for (const child of cards.filter(child => child.index >= start && child.end <= card.end)) {
      const from = child.index - start;
      const to = child.end - start;
      ownedContent = ownedContent.slice(0, from) + ownedContent.slice(from, to).replace(/[^\n]/g, " ") + ownedContent.slice(to);
    }
    const marker = Array.from(ownedContent.matchAll(/<script data-audit-payload="(\d+)"><\/script>/g)).find(match => {
      const script = scripts[Number(match[1])];
      // Template content is an inert fragment: it is neither shown nor reachable by querySelector.
      return !script.inTemplate && readHtmlAttribute(script.attributes, "type")?.toLowerCase() === "text/plain" && readHtmlAttribute(script.attributes, "data-for") === undefined;
    });
    if (!marker) continue;
    const script = scripts[Number(marker[1])];
    const rawLines = script.payload.replace(/^\n+/, "").replace(/\s+$/, "").split("\n");
    const indent = Math.min(...rawLines.filter(l => l.trim()).map(l => l.match(/^[ \t]*/)[0].length));
    const payload = rawLines.map(l => l.slice(Number.isFinite(indent) ? indent : 0)).join("\n");
    if (classTokens(readHtmlAttribute(card.openingTag, "class")).includes("code-block")) {
      // Consume every opening tag as a unit before looking for empty code,
      // so a span's quoted title cannot supply a fake <code></code> target,
      // and skip inert <template> contents just like script selection.
      const emptyCodeOrTag = new RegExp(String.raw`<code\b${htmlAttributesPattern}>\s*<\/code\s*>|<!--[\s\S]*?-->|<\/?[A-Za-z](?:[^>"']|"[^"]*"|'[^']*')*>`, "gi");
      let codeTemplateDepth = 0;
      let code;
      for (const match of ownedContent.matchAll(emptyCodeOrTag)) {
        if (match[1] !== undefined) {
          if (codeTemplateDepth === 0) { code = match; break; }
          continue;
        }
        const template = /^<(\/?)template(?![\w:-])/i.exec(match[0]);
        if (template) codeTemplateDepth = template[1] ? Math.max(0, codeTemplateDepth - 1) : codeTemplateDepth + 1;
      }
      if (code) {
        // Code blocks are inventoried by <pre>. A card that shows its code without a
        // <pre> still displays a block, so wrap it once; cards already using <pre> are not wrapped.
        const before = ownedContent.slice(0, code.index);
        // Count real pre tags only: comments and whole tags (with quoted attributes) are
        // consumed as units, so tag-like text in attribute values cannot change the depth.
        let preDepth = 0;
        for (const tag of before.matchAll(/<!--[\s\S]*?-->|<(\/?)([A-Za-z][\w:-]*)(?:[^>"']|"[^"]*"|'[^']*')*>/g)) {
          if (tag[2]?.toLowerCase() !== "pre") continue;
          preDepth = tag[1] ? Math.max(0, preDepth - 1) : preDepth + 1;
        }
        const insidePre = /^<pre\b/i.test(card.openingTag) || preDepth > 0;
        const filled = `<code${code[1]}>${escape(payload)}</code>`;
        edits.push({ index: start + code.index, length: code[0].length, value: insidePre ? filled : `<pre>${filled}</pre>` });
        // A selected data-code script must not be materialized again by inventoryHtml.
        edits.push({ index: start + marker.index, length: marker[0].length, value: "" });
      }
    } else {
      const matching = scopes.filter(scope =>
        scope.hasDynamicSelection || scope.selectors.some(selector => matchesCardSelector(card.openingTag, selector, docMode) !== false)
      );
      const renderer = matching.length === 1 && !matching[0].hasDynamicSelection ? matching[0]
        : (matching.length === 0 && scopes.length === 1 && !scopes[0].hasSelection ? scopes[0] : undefined);
      const cardId = readHtmlAttribute(card.openingTag, "id") ?? `card-${marker[1]}`;
      if (!renderer && scopes.length > 0) unresolvedMermaidSources.push(`renderer:${cardId}`);
      // querySelector searches all descendants; ownership masking is only for payload selection.
      // Scripts inside <template> content are not descendants that querySelector can return.
      const queryableScripts = Array.from(card.content.matchAll(/<script data-audit-payload="(\d+)"><\/script>/g))
        .filter(match => !scripts[Number(match[1])].inTemplate);
      const firstScript = queryableScripts[0];
      const firstPlain = queryableScripts
        .find(match => readHtmlAttribute(scripts[Number(match[1])].attributes, "type")?.toLowerCase() === "text/plain");
      // Cross-scope DOM/text writes only invalidate DOM-backed (payload-reading) sources.
      // An `.id = ...` mutation only affects another scope when that scope queries by `#id`
      // (or uses a dynamic selector whose target cannot be ruled out).
      const usesIdSelector = renderer ? renderer.selectors.some(selector => selector.includes("#")) || (renderer.hasSelection && renderer.selectors.length === 0) : false;
      const foreignWriters = renderer ? allScopes.filter(scope => scope !== renderer && (scope.writesDom || (usesIdSelector && scope.writesId))) : [];
      // Deferred module writers run after parsing, and async modules after a classic
      // capture's script tag have not been parsed yet; only an earlier async module
      // can race a proven synchronous classic capture.
      const foreignWrite = foreignWriters.length === 0 ? false
        : renderer.classic ? (at, isDeferredRead, captureAt = at, isDeferredCapture = isDeferredRead) => {
          if (isDeferredRead) return true;
          const readSegment = renderer.segments.find(seg => seg.start <= at && at <= seg.end);
          if (!readSegment) return true;
          const captureSegment = !isDeferredCapture
            ? renderer.segments.find(seg => seg.start <= captureAt && captureAt <= seg.end)
            : undefined;
          return foreignWriters.some(scope => {
            if (scope.writesDom) {
              return !scope.deferredModule &&
                scope.segments.some(writerSeg => writerSeg.documentPosition < readSegment.documentPosition);
            }
            if (isDeferredCapture || !captureSegment) return true;
            return !scope.deferredModule &&
              scope.segments.some(writerSeg => writerSeg.documentPosition < captureSegment.documentPosition);
          });
        } : true;
      const resolvedSource = renderer && (renderer.computedRenderer ? null : rendererSuffix(renderer.literalSource, renderer.rawSource, script.payload, payload, card.openingTag,
        { any: firstScript?.[1] === marker[1], plain: firstPlain?.[1] === marker[1],
          classic: renderer.classic,
          docMode,
          segments: renderer.segments,
          // Non-async module scripts run after the document is parsed; classic scripts and
          // async modules must follow this payload in document order to prove availability.
          availableAt: at => renderer.deferredModule || renderer.segments.some(segment =>
            segment.start <= at && at <= segment.end && segment.documentPosition > start + marker.index),
          cardAvailableAt: at => renderer.deferredModule || renderer.segments.some(segment =>
            segment.start <= at && at <= segment.end && segment.documentPosition >= start),
          priorMatchesComplete: (selector, anyScript) => {
            const matches = extractElementContents(stashed, tag => matchesCardSelector(tag, selector, docMode) !== false, true, true, null, true);
            for (const el of matches) {
              if (el.index === card.index) continue;
              if (templateRanges.some(range => range.start < el.index && el.index < range.end)) continue;
              const elTag = /^<([A-Za-z][\w.-]*)/.exec(el.openingTag)?.[1].toLowerCase() ?? "";
              const isVoidElement = HTML_VOID_ELEMENTS.has(elTag);
              // A void element after the captured card cannot contain a script descendant to render.
              if (el.index > card.index && isVoidElement) continue;
              // Any selected element outside the chart inventory (prior or trailing)
              // may render a diagram the audit never compares: unresolved.
              if (!cards.some(inventoried => inventoried.index === el.index)) return false;
              const elScripts = Array.from(el.content.matchAll(/<script data-audit-payload="(\d+)"><\/script>/g))
                .filter(m => !scripts[Number(m[1])].inTemplate);
              const found = anyScript
                ? elScripts[0]
                : elScripts.find(m => readHtmlAttribute(scripts[Number(m[1])].attributes, "type")?.toLowerCase() === "text/plain");
              if (el.index < card.index) {
                if (!found) return false;
              } else if (found) {
                const foundScript = scripts[Number(found[1])];
                const isInventoriedPayload =
                  readHtmlAttribute(foundScript.attributes, "type")?.toLowerCase() === "text/plain" &&
                  readHtmlAttribute(foundScript.attributes, "data-for") === undefined;
                if (!isInventoriedPayload) return false;
              }
            }
            return true;
          },
          unique: selector => matchesCardSelector(card.openingTag, selector, docMode) === true && documentElements.filter(tag => matchesCardSelector(tag, selector, docMode) !== false).length === 1,
          // Whether an element matched by `selector` inside the card can contain the selected
          // script or precede it (so an edit could insert a matching script before it).
          mayContainScript: (selector, onlyContaining = false) => {
            if (!/^(?:[A-Za-z][\w-]*)?(?:[.#]-?[A-Za-z_][\w-]*)*$/.test(selector) || !selector) return true;
            const matches = extractElementContents(card.content, tag => matchesCardSelector(tag, selector, docMode) !== false, true, true, null, true);
            return matches.some(el =>
              /<script data-audit-payload="\d+"><\/script>/.test(el.content) ||
              (!onlyContaining && el.index < marker.index)
            );
          },
          // Whether the card contains an element for a single-class selector outside inert
          // <template> contents, so a per-card query for it is never null (`!host` cannot skip).
          cardHas: (selector, at) => {
            const wanted = /^\.([A-Za-z_-][\w-]*)$/.exec(selector);
            if (!wanted) return false;
            let depth = 0;
            for (const tag of card.content.matchAll(new RegExp(`<(\\/?)([A-Za-z][\\w:-]*)${htmlAttributesPattern}>`, "g"))) {
              const isTemplate = tag[2].toLowerCase() === "template";
              if (tag[1]) {
                if (isTemplate) depth = Math.max(0, depth - 1);
                continue;
              }
              if (depth === 0 && matchesCardSelector(tag[0], selector, docMode) === true) {
                // A classic script only sees hosts parsed before it; a later host leaves `!host` reachable.
                if (at === undefined || renderer.deferredModule || renderer.segments.some(segment =>
                  segment.start <= at && at <= segment.end && segment.documentPosition > start + tag.index)) return true;
              }
              if (isTemplate) depth += 1;
            }
            return false;
          } },
        foreignWrite));
      if (resolvedSource === null) unresolvedMermaidSources.push(`CLASSDEFS:${cardId}`);
      // Serialize the entity-decoded chart: inventory decodes the HTML escape layer once, so the
      // result equals normalizeMermaidSource's decoding of the raw chart, as for TSX charts.
      edits.push({ index: start + marker.index, length: marker[0].length, value: `<div class="mermaid" data-audit-materialized="1">${escape(decodeEntities(resolvedSource ?? script.payload))}</div>` });
    }
  }
  let result = stashed;
  for (const edit of edits.sort((a, b) => b.index - a.index)) result = result.slice(0, edit.index) + edit.value + result.slice(edit.index + edit.length);
  return {
    html: result.replace(/<script data-audit-payload="(\d+)"><\/script>/g, (_full, index) => scripts[Number(index)].full)
      .replace(/\u0000AUDITOPAQUE(\d+)\u0000/g, (_full, index) => opaqueElements[Number(index)]),
    unresolvedMermaidSources: unresolvedMermaidSources.reverse(),
  };
}

function inventoryHtml(src) {
  const materialized = materializePlainTextCards(src);
  src = materialized.html;
  // Detached text/plain payloads are displayed via code.textContent, not HTML parsing.
  // Resolve by data-for/id rather than script order and escape literal markup before inventorying.
  // 開始タグの属性部は引用値を 1 単位で消費する。`[^>]*` だと title="a>b" の `>` で
  // タグが閉じたと誤認し、後続の data-for / id を読めず本文が監査から外れる。
  const attrs = htmlAttributesPattern;
  // payload の収集と差し込みは同じ走査を使う。別々に走査すると、コメントアウトされた script を
  // 実 script として拾い、後勝ちの Map で本物の payload を上書きしてしまう。
  // script 要素は先頭の分岐で丸ごと消費する。payload 内の未閉じ <code> から一致が始まると、
  // 後続の表示ブロックの </code> まで食ってそのブロックへの差し込みを取りこぼす。
  // それ以外のタグ・コメントも末尾の分岐で 1 単位として消費する。走査が title="<code>x" のような
  // 引用値の内側へ進むと、そこから一致が始まって表示ブロックの開始タグを本文として食ってしまう。
  const scriptOrCodeRe = new RegExp(
    String.raw`<script(?=[\s/>])${attrs}>([\s\S]*?)<\/script\s*>|<code(?=[\s/>])${attrs}>([\s\S]*?)<\/code\s*>|<!--[\s\S]*?-->|<\/?[A-Za-z](?:[^>"']|"[^"]*"|'[^']*')*>`,
    "gi"
  );
  const detachedCode = new Map();
  let detachedTemplateDepth = 0;
  for (const [whole, scriptAttrs, payload] of src.matchAll(scriptOrCodeRe)) {
    if (scriptAttrs === undefined) {
      // Template content is inert: its text/plain scripts never supply a card payload.
      const template = /^<(\/?)template(?![\w:-])/i.exec(whole);
      if (template) detachedTemplateDepth = template[1] ? Math.max(0, detachedTemplateDepth - 1) : detachedTemplateDepth + 1;
      continue;
    }
    if (detachedTemplateDepth > 0) continue;
    if (readHtmlAttribute(scriptAttrs ?? "", "type")?.toLowerCase() !== "text/plain") continue;
    const target = readHtmlAttribute(scriptAttrs, "data-for");
    if (target) detachedCode.set(target, payload);
  }
  src = src.replace(scriptOrCodeRe, (full, _scriptAttrs, _payload, codeAttrs) => {
    if (codeAttrs === undefined) return full;
    const id = readHtmlAttribute(codeAttrs, "id");
    if (!detachedCode.has(id)) return full;
    const value = detachedCode.get(id).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<code${codeAttrs}>${value}</code>`;
  });
  // data-code スクリプトの中身は「表示されるコードブロック」なので保存する。
  // ただし中身自体が <style> 等を含みうるため、いったん不透明なプレースホルダへ退避し、
  // script/style/link の除去が終わってから <code> として復元する。
  const preservedCode = [];
  const stashed = src.replace(
    /<script(?=[\s/>])[^>]*\bdata-code\b[^>]*>([\s\S]*?)<\/script\s*>/gi,
    (_match, content) => {
      preservedCode.push(content);
      return `\u0000DATACODE${preservedCode.length - 1}\u0000`;
    }
  );
  const body = stashed
    .replace(/<head(?=[\s/>])[\s\S]*?<\/head\s*>/gi, "")
    .replace(/<(script|style)(?=[\s/>])[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<link(?=[\s/>])[^>]*\/?>/gi, "")
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
    headings.push({ level: Number(match[1]), text: normalize(stripMarkup(match[2], false)) });
    match = headingRe.exec(body);
  }

  const listTexts = [];
  const liRe = /<li\b(?:[^>"']|"[^"]*"|'[^']*')*>([\s\S]*?)<\/li>/gi;
  let li = liRe.exec(body);
  while (li !== null) {
    const liContent = removeMaterializedCharts(li[1]);
    const text = normalize(stripMarkup(liContent, false));
    if (text) listTexts.push(text);
    li = liRe.exec(body);
  }

  const codeBlockTexts = extractElementContents(body, (openingTag) =>
    /^<pre\b/i.test(openingTag) && !/\bclass=["'][^"']*\bmermaid\b/i.test(openingTag),
    false,
    false,
    null,
    true
  ).map(({ content }) => normalizeElementContent(content, false));
  const tableRowTexts = extractTagContents(body, "tr").map(({ content }) =>
    normalizeElementContent(content, false)
  );
  const paragraphTexts = extractTagContents(body, "p")
    .map(({ content }) =>
      normalizeElementContent(
        removeMaterializedCharts(content),
        false
      )
    )
    .filter(Boolean);

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
    unresolvedMermaidSources: materialized.unresolvedMermaidSources,
    svgElements: collectSvgElements(body),
    calloutElements: collectMarkupCalloutElements(body, true),
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
    .map(({ content }) => normalizeElementContent(resolveStringConstants(content, constants, true), true, true));
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
    externalLinks: collectUrls(`${src}\n${stripMarkup(src.replace(/>\s+</g, "><").replace(/\}\s*(?=<|\{)/g, "}").replace(/>\s*(?=\{)/g, ">"))}`),
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
  const unresolvedMermaidSources = source.unresolvedMermaidSources ?? [];

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
    unresolvedMermaidSources.length > 0 ||
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
    unresolvedMermaidSources,
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
try {
  sourceText = readFileSync(sourcePath, "utf8");
} catch (error) {
  console.error(`読み込み失敗: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 2;
}

// process.exit() は stdout/stderr がパイプ先の場合に非同期フラッシュを打ち切ることがある。
// 以降の処理は exitCode 未設定（＝上の読み込みに成功した）場合のみ続行し、
// 自然終了に委ねることでバッファを確実にフラッシュする。
if (process.exitCode === undefined) {
  const sourceInventory = /\.(?:md|markdown)$/i.test(sourcePath)
    ? inventoryMarkdown(sourceText)
    : inventoryHtml(sourceText);

  if (flags.has("--emit-headings")) {
    // 契約テスト S-1 に貼り付ける期待値配列を出力する。
    // page.tsx がまだ存在しない Phase 1（見出し抽出）でも動くよう、
    // page 側の読み込みより前に判定して抜ける。
    for (let level = 1; level <= 6; level += 1) {
      const headings = sourceInventory.headings.filter((h) => h.level === level).map((h) => h.text);
      console.log(`const EXPECTED_H${level} = [`);
      for (const text of headings) console.log(`  ${JSON.stringify(text)},`);
      console.log(`] as const;${level < 6 ? "\n" : ""}`);
    }
    process.exitCode = 0;
  } else {
    let pageText;
    try {
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
      process.exitCode = 2;
    }

    // 上の読み込みが失敗した場合（exitCode 設定済み）は後続の照合処理を行わず、
    // 自然終了に委ねて stderr のフラッシュを保証する（トップレベルと同じ理由）。
    if (process.exitCode === undefined) {
      const pageInventory = inventoryTsx(pageText);
      const result = compare(sourceInventory, pageInventory);

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
        process.exitCode = result.blocking ? 1 : 0;
      } else {
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
        // 未解決は原本の描画スクリプト（mermaid.render 周辺）を静的に追えないことを表し、内容の欠落ではない。
        // ただし図の件数自体が不一致であれば、未解決の解析と併せて件数不一致も報告する。
        const otherMissing = [
          result.missingHeadings, result.missingLinks, result.missingListItems, result.missingCodeBlocks,
          result.missingTableRows, result.missingParagraphs, result.missingSvgElements, result.missingCalloutElements,
        ].some(list => list.length > 0);
        const mermaidCountMismatch = result.counts.mermaidSources.source !== result.counts.mermaidSources.page;
        const unresolvedOnly = result.unresolvedMermaidSources.length > 0 && !otherMissing && !mermaidCountMismatch;
        const unresolvedWithCountMismatch = result.unresolvedMermaidSources.length > 0 && !otherMissing && mermaidCountMismatch;
        const mermaidCountMismatchOnly = !otherMissing && result.unresolvedMermaidSources.length === 0 && mermaidCountMismatch && !result.mermaidSourcesMatch;
        const mermaidMismatchOnly = !otherMissing && result.unresolvedMermaidSources.length === 0 && !mermaidCountMismatch && !result.mermaidSourcesMatch;
        const boundaryMarkers = result.unresolvedMermaidSources.filter(marker => marker.startsWith("boundary:"));
        const rendererMarkers = result.unresolvedMermaidSources.filter(marker => !marker.startsWith("boundary:"));
        if (boundaryMarkers.length > 0) {
          console.log(`\n❌ 図カードのマークアップ境界が未解決: ${boundaryMarkers.join(", ")}`);
          console.log("  対象カードのマークアップ（.diagram-card 周辺の閉じタグ・入れ子構造）を確認すること。");
        }
        if (rendererMarkers.length > 0) {
          console.log(`\n❌ 描画スクリプトの静的解析が未解決（描画スクリプトの特定・図ソース・CLASSDEFS）: ${rendererMarkers.join(", ")}`);
          console.log("  図の内容を転写するのではなく、原本の描画スクリプト（mermaid.render の呼び出しと図ソースの読み取り）を確認すること。");
        }
        if (result.unresolvedMermaidSources.length > 0 && !result.mermaidSourcesMatch) {
          console.log("  下記の Mermaid 不一致は、未解決の図が実行時の補完なしで比較されたことによる可能性がある。");
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
          !result.blocking
            ? "\n判定: ✅ 漏れなし — Green 判定に進んでよい。"
            : unresolvedOnly
              ? "\n判定: ❌ 描画スクリプトの静的解析が未解決 — Green コミット禁止。描画スクリプトを確認してから再実行すること。"
              : unresolvedWithCountMismatch
                ? "\n判定: ❌ 描画スクリプトの静的解析が未解決かつ Mermaid 図の件数が不一致 — Green コミット禁止。描画スクリプトと図の過不足を確認してから再実行すること。"
                : mermaidCountMismatchOnly
                  ? "\n判定: ❌ Mermaid 図の件数不一致 — Green コミット禁止。Mermaid 図の過不足・内容を確認してから再実行すること。"
                  : mermaidMismatchOnly
                    ? "\n判定: ❌ Mermaid ソース不一致 — Green コミット禁止。Mermaid 図の順序・内容を確認してから再実行すること。"
                    : otherMissing && result.unresolvedMermaidSources.length > 0
                      ? "\n判定: ❌ 移行漏れがあり、描画スクリプトの静的解析も未解決 — Green コミット禁止。漏れを転写し、あわせて描画スクリプトを確認してから再実行すること。"
                      : "\n判定: ❌ 移行漏れあり — Green コミット禁止。漏れを転写してから再実行すること。"
        );
        process.exitCode = result.blocking ? 1 : 0;
      }
    }
  }
}
