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
 *   1 = 漏れあり（見出し・外部リンク・リスト項目・表のいずれかが不足）
 *   2 = 引数エラー / ファイル未検出
 */

import { readFileSync } from "node:fs";

/** リスト項目の照合に使う先頭文字数。長大な項目の全文一致を求めないための上限。 */
const LIST_ITEM_PROBE = 40;

// --------------------------------------------------------------------------
// テキスト正規化
// --------------------------------------------------------------------------

/**
 * 比較用にテキストを正規化する（NFKC + 空白畳み込み + 装飾記号除去）。
 *
 * 原本と JSX で全角/半角・改行位置・記号装飾がずれても同一視できるようにする。
 *
 * @param raw - 正規化前の文字列
 * @returns 比較キーとして使える正規化済み文字列
 */
function normalize(raw) {
  return raw
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .replace(/[`*_~]/g, "")
    .trim();
}

/**
 * 照合専用のキーを作る（表示上の差異を吸収する）。
 *
 * 原本と JSX では ①見出しの採番（`1. ` / `第2章 `）、②日本語と英数字の間の空白、
 * ③記号の装飾が食い違うのが常態であり、これらは移行漏れではない。
 * よって「空白を全除去し、先頭の採番を落とした文字列」を同一性判定キーとする。
 * 文字そのものが欠けていれば依然として不一致になるため、漏れ検知力は落ちない。
 *
 * @param raw - 比較したい表示テキスト
 * @returns 表記ゆれを吸収した照合キー
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
 * HTML の実体参照のうち頻出するものだけを復号する。
 *
 * @param raw - 実体参照を含む文字列
 * @returns 復号済み文字列
 */
function decodeEntities(raw) {
  return raw
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

/**
 * HTML / JSX 断片から表示テキストだけを取り出す。
 *
 * JSX の `{" "}` は空白へ、`{/* ... *\/}` と残りの式は除去する。
 *
 * @param fragment - タグを含むマークアップ断片
 * @returns タグ・式を除去した表示テキスト
 */
function stripMarkup(fragment) {
  return decodeEntities(
    fragment
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      .replace(/\{\s*"([^"]*)"\s*\}/g, "$1")
      .replace(/\{\s*'([^']*)'\s*\}/g, "$1")
      .replace(/\{[^{}]*\}/g, "")
      .replace(/<[^>]*>/g, "")
  );
}

/**
 * Markdown のインライン装飾を落として表示テキストにする。
 *
 * @param raw - Markdown のインライン断片
 * @returns リンク・強調を除去した表示テキスト
 */
function stripMarkdownInline(raw) {
  return raw
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "");
}

/**
 * コードブロック・表行の内容をマークアップ非依存の比較値へ変換する。
 *
 * @param raw - HTML / JSX を含む要素本文
 * @returns タグと JSX 空白表現を除去した正規化テキスト
 */
function normalizeElementContent(raw) {
  return normalize(stripMarkup(raw));
}

/**
 * Mermaid ソースを改行コード・外側の空行・共通インデントだけ正規化する。
 * mindmap 等の相対インデントは構文の一部なので保持する。
 *
 * @param raw - Mermaid ソース
 * @returns 順序比較に使う正規化済みソース
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
 * 指定タグの本文と出現位置を採取する。pre / tr は同名タグをネストしないため、
 * この単純な抽出で HTML と JSX の双方をマークアップ非依存に比較できる。
 *
 * @param src - 走査対象
 * @param tag - タグ名
 * @returns 本文と出現位置
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
 * 開始タグ条件に一致する JSX 要素を、同名タグのネストを考慮して採取する。
 * CSS Modules の codeBlock ラッパーが div を入れ子にするケースで使用する。
 *
 * @param src - 走査対象
 * @param predicate - 開始タグの採取条件
 * @returns 本文と出現位置
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
 * page.tsx 内の文字列定数を採取する。
 *
 * @param src - page.tsx 全文
 * @returns 定数名から文字列値への対応
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
 * JSX 本文中の単純な文字列定数参照を実値へ置換する。
 *
 * @param content - JSX 要素本文
 * @param constants - 文字列定数
 * @returns 定数参照を展開した本文
 */
function resolveStringConstants(content, constants) {
  return content.replace(/\{\s*([A-Za-z_$][\w$]*)\s*\}/g, (expression, name) =>
    constants.has(name) ? constants.get(name) : expression
  );
}

/**
 * HTML の Mermaid 本文（直接ブロックと DIAGRAMS オブジェクト）を出現順に採取する。
 *
 * @param src - HTML 全文
 * @returns 正規化済み Mermaid ソース
 */
function collectHtmlMermaidSources(src) {
  const sources = [];
  const divRe = /<div\b([^>]*\bclass=["'][^"']*\bmermaid\b[^"']*["'][^>]*)>([\s\S]*?)<\/div>/gi;
  let div = divRe.exec(src);
  while (div !== null) {
    sources.push({ index: div.index, source: normalizeMermaidSource(div[2]) });
    div = divRe.exec(src);
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
    .filter((source) =>
      /^(?:graph|flowchart|sequenceDiagram|mindmap|stateDiagram-v2|gitGraph|erDiagram|classDiagram|journey|timeline)\b/.test(
        source
      )
    );
}

/**
 * page.tsx の MermaidDiagram chart 値を定数参照を解決して出現順に採取する。
 *
 * @param src - page.tsx 全文
 * @returns 正規化済み Mermaid ソース
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
 * URL を比較用に正規化する（末尾スラッシュ・アンカー・クエリを除去）。
 *
 * @param url - 生の URL 文字列
 * @returns 比較キーとして使える URL
 */
function normalizeUrl(url) {
  return url
    .trim()
    .replace(/[#?].*$/, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

// --------------------------------------------------------------------------
// インベントリ抽出
// --------------------------------------------------------------------------

/**
 * Markdown 本文から見出し・リスト・コードブロック・表・外部リンクを採取する。
 *
 * フェンス内はコード扱いとし、見出し・リストとして数えない。
 *
 * @param src - Markdown ソース全文
 * @returns インベントリ（見出し配列と各種カウント）
 */
function inventoryMarkdown(src) {
  const lines = src.split(/\r?\n/);
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

  for (const line of lines) {
    const fence = /^\s*(```|~~~)\s*([^\s]*)/.exec(line);
    if (fence) {
      if (!inFence) {
        codeBlocks += 1;
        fenceLanguage = fence[2].toLowerCase();
        fenceLines = [];
      } else {
        const rawBlock = fenceLines.join("\n");
        codeBlockTexts.push(normalize(rawBlock));
        if (fenceLanguage === "mermaid") {
          mermaidSources.push(normalizeMermaidSource(rawBlock));
        }
      }
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      fenceLines.push(line);
      continue;
    }

    const heading = /^(#{2,3})\s+(.*?)\s*#*\s*$/.exec(line);
    if (heading) {
      headings.push({
        level: heading[1].length,
        text: normalize(stripMarkdownInline(heading[2])),
      });
      continue;
    }
    const listItem = /^\s*(?:[-*+]|\d+\.)\s+(\S.*)$/.exec(line);
    if (listItem) {
      listItems += 1;
      listTexts.push(normalize(stripMarkdownInline(listItem[1])));
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(line) && !/^\s*\|?\s*:?-{3,}/.test(line)) {
      tableRows += 1;
      tableRowTexts.push(normalize(stripMarkdownInline(line.replace(/^\s*\||\|\s*$/g, ""))));
    }
  }

  return {
    headings,
    listTexts,
    listItems,
    codeBlocks,
    tableRows,
    codeBlockTexts,
    tableRowTexts,
    mermaidSources,
    externalLinks: collectUrls(src),
  };
}

/**
 * HTML 本文から見出し・リスト・コードブロック・表・外部リンクを採取する。
 *
 * @param src - HTML ソース全文
 * @returns インベントリ（見出し配列と各種カウント）
 */
function inventoryHtml(src) {
  const body = src.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");
  const headings = [];
  const headingRe = /<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
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

  const codeBlockTexts = extractTagContents(body, "pre").map(({ content }) =>
    normalizeElementContent(content)
  );
  const tableRowTexts = extractTagContents(body, "tr").map(({ content }) =>
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
    mermaidSources: collectHtmlMermaidSources(src),
    externalLinks: collectUrls(body),
  };
}

/**
 * page.tsx（JSX）から見出し・リスト・コードブロック・表・外部リンクを採取する。
 *
 * コードブロックは `<pre>` と CSS Modules の `styles.codeBlock` 系ラッパーの
 * 多い方を採用する（本リポジトリは両方の実装パターンが存在するため）。
 *
 * @param src - page.tsx の全文
 * @returns インベントリ（見出し配列と各種カウント）
 */
function inventoryTsx(src) {
  const headings = [];
  // h1 も採取する。原本の h2 タイトルがページの h1 になるのは正当な移植であり、
  // h2/h3 だけを見ると偽陽性になるため。
  const headingRe = /<h([123])\b[^>]*>([\s\S]*?)<\/h\1>/g;
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
    mermaidSources: collectTsxMermaidSources(src),
    externalLinks: collectUrls(src),
  };
}

/**
 * 正規表現に一致した件数を数える。
 *
 * @param src - 走査対象の文字列
 * @param re - グローバルフラグ付きの正規表現
 * @returns 一致件数
 */
function countMatches(src, re) {
  return (src.match(re) ?? []).length;
}

/**
 * 本文中の外部 URL を重複排除して採取する。
 *
 * @param src - 走査対象の文字列
 * @returns 正規化済み URL の集合
 */
function collectUrls(src) {
  const urls = new Set();
  const re = /https?:\/\/[^\s"'`)<>\]}\\]+/g;
  let match = re.exec(src);
  while (match !== null) {
    urls.add(normalizeUrl(match[0]));
    match = re.exec(src);
  }
  return urls;
}

/**
 * 出現回数を保持したまま、移植先に不足する原本要素を返す。
 *
 * @param sourceValues - 原本の値（出現順）
 * @param pageValues - 移植先の値
 * @returns 移植先で不足している値（重複を保持）
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
 * 原本と移植先のインベントリを突き合わせ、不足分を算出する。
 *
 * @param source - 原本のインベントリ
 * @param page - page.tsx のインベントリ
 * @returns 不足見出し・不足リンク・カウント差分を含む照合結果
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
  const mermaidSourcesMatch =
    source.mermaidSources.length === page.mermaidSources.length &&
    source.mermaidSources.every((value, index) => value === page.mermaidSources[index]);

  const counts = {
    listItems: { source: source.listItems, page: page.listItems },
    codeBlocks: { source: source.codeBlocks, page: page.codeBlocks },
    tableRows: { source: source.tableRows, page: page.tableRows },
    headings: { source: source.headings.length, page: page.headings.length },
    externalLinks: { source: source.externalLinks.size, page: page.externalLinks.size },
    mermaidSources: { source: source.mermaidSources.length, page: page.mermaidSources.length },
  };

  const blocking =
    missingHeadings.length > 0 ||
    missingLinks.length > 0 ||
    missingListItems.length > 0 ||
    missingCodeBlocks.length > 0 ||
    missingTableRows.length > 0 ||
    !mermaidSourcesMatch;

  return {
    missingHeadings,
    extraHeadings,
    missingLinks,
    missingListItems,
    missingCodeBlocks,
    missingTableRows,
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
  pageText = readFileSync(pagePath, "utf8");
} catch (error) {
  console.error(`読み込み失敗: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(2);
}

const sourceInventory = sourcePath.endsWith(".md")
  ? inventoryMarkdown(sourceText)
  : inventoryHtml(sourceText);
const pageInventory = inventoryTsx(pageText);
const result = compare(sourceInventory, pageInventory);

if (flags.has("--emit-headings")) {
  // 契約テスト S-1 に貼り付ける期待値配列を出力する
  const h2 = sourceInventory.headings.filter((h) => h.level === 2).map((h) => h.text);
  const h3 = sourceInventory.headings.filter((h) => h.level === 3).map((h) => h.text);
  console.log("const EXPECTED_H2 = [");
  for (const t of h2) console.log(`  ${JSON.stringify(t)},`);
  console.log("] as const;\n");
  console.log("const EXPECTED_H3 = [");
  for (const t of h3) console.log(`  ${JSON.stringify(t)},`);
  console.log("] as const;");
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
