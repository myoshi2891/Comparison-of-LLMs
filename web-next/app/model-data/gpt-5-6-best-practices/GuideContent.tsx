import { readFileSync } from "node:fs";
import { join } from "node:path";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

const SOURCE_PATH = join(process.cwd(), "..", "Gpt-5.6-best-practices-guide.md");
const GUIDE = readFileSync(SOURCE_PATH, "utf8").trim();

const SECTION_IDS = [
  "overview", "lineup", "selection-flow", "effort-mode", "persisted-reasoning", "ptc",
  "multi-agent", "prompt-caching", "prompt-design", "verbosity", "autonomy", "safety",
  "migration", "code", "availability", "cost", "summary", "sources",
] as const;

const TOC = [
  "GPT-5.6とは何か", "モデルラインナップ", "モデル選定フロー", "Reasoning Effort と Mode",
  "Persisted Reasoning", "Programmatic Tool Calling", "Multi-agent", "Prompt Caching",
  "プロンプト設計", "応答の長さとスタイル", "自律性と承認境界", "セーフガード",
  "GPT-5.6への移行", "コード実践例", "利用可能性", "コスト最適化", "まとめ", "参考ソース",
];

/**
 * Renders content as a link that opens in a new tab.
 *
 * @param href - The link destination
 * @param children - The content displayed inside the link
 */
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

/**
 * Converts inline Markdown syntax and URLs into React nodes.
 *
 * @param text - The text containing inline code, bold text, or URLs
 * @returns React nodes representing the formatted text
 */
function inline(text: string): React.ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|https?:\/\/[^\s|]+)/g).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("http")) return <Ext key={index} href={part}>{part}</Ext>;
    return part;
  });
}

/**
 * Highlights syntax tokens in a code string.
 *
 * @param code - The code to highlight
 * @returns React nodes containing styled syntax tokens and preserved line breaks
 */
function highlightCode(code: string) {
  const tokenPattern = /(#.*$|\/\/.*$|"[^"\n]*"|'[^'\n]*'|\b(?:from|import|print|client|response|model|reasoning|input|curl|python|bash|const|let|true|false|null)\b|\b\d+(?:\.\d+)?\b)/gm;
  return code.split("\n").flatMap((line, lineIndex) => {
    const tokens: React.ReactNode[] = [];
    let cursor = 0;
    for (const match of line.matchAll(tokenPattern)) {
      const token = match[0];
      const start = match.index ?? 0;
      if (start > cursor) tokens.push(line.slice(cursor, start));
      const className = token.startsWith("#") || token.startsWith("//")
        ? styles.codeComment
        : token.startsWith('"') || token.startsWith("'")
          ? styles.codeString
          : /^\d/.test(token)
            ? styles.codeNumber
            : styles.codeKeyword;
      tokens.push(<span className={className} key={`${lineIndex}-${start}`}>{token}</span>);
      cursor = start + token.length;
    }
    if (cursor < line.length) tokens.push(line.slice(cursor));
    return [...tokens, ...(lineIndex < code.split("\n").length - 1 ? ["\n"] : [])];
  });
}

interface ParseState {
  lines: string[];
  line: number;
  section: number;
  diagram: number;
}

/**
 * Creates a section element for the current level-two Markdown heading and advances the parser.
 *
 * @param state - The mutable Markdown parsing state.
 * @returns The rendered section, or `null` for the initial heading.
 */
function parseHeading2(state: ParseState): React.ReactNode {
  const current = state.lines[state.line];
  state.section += 1;
  if (state.section === 0) {
    state.line += 1;
    return null;
  }
  const index = state.section - 1;
  const node = (
    <section data-guide-section id={SECTION_IDS[index]} className={styles.section} key={`s-${index}`}>
      <h2>
        <span>{String(index + 1).padStart(2, "0")}</span>
        {current.slice(3)}
      </h2>
    </section>
  );
  state.line += 1;
  return node;
}

/**
 * Converts the current Markdown level-three heading into an `h3` element.
 *
 * @param state - The parser state containing the heading line and current position.
 * @returns The rendered heading element.
 */
function parseHeading3(state: ParseState): React.ReactNode {
  const current = state.lines[state.line];
  const node = <h3 key={`h3-${state.line}`}>{current.slice(4)}</h3>;
  state.line += 1;
  return node;
}

/**
 * Converts a fenced Markdown code block into a syntax-highlighted code block or Mermaid diagram.
 *
 * @param state - The parser state containing the current fenced code block and parsing position
 * @returns The rendered code block or Mermaid diagram
 */
function parseCodeBlock(state: ParseState): React.ReactNode {
  const current = state.lines[state.line];
  const language = current.slice(3);
  const code: string[] = [];
  state.line += 1;
  while (state.line < state.lines.length && !state.lines[state.line].startsWith("```")) {
    code.push(state.lines[state.line++]);
  }
  state.line += 1;
  if (language === "mermaid") {
    state.diagram += 1;
    return (
      <div className={styles.mermaidWrap} key={`mermaid-${state.diagram}`}>
        <MermaidDiagram chart={code.join("\n")} theme="dark" />
      </div>
    );
  }
  return (
    <pre className={styles.codeBlock} key={`code-${state.line}`}>
      <code className={`language-${language}`}>{highlightCode(code.join("\n"))}</code>
    </pre>
  );
}

/**
 * Converts consecutive Markdown table rows into a rendered table or cost checklist.
 *
 * @param state - The parser state containing the current line and Markdown lines; advances the current line past the table.
 * @returns A table element for standard tables or an unordered checklist for the cost section.
 */
function parseTable(state: ParseState): React.ReactNode {
  const rows: string[][] = [];
  while (state.line < state.lines.length && state.lines[state.line].startsWith("|")) {
    if (!/^\|[- :|]+\|$/.test(state.lines[state.line])) {
      rows.push(state.lines[state.line].split("|").slice(1, -1).map((cell) => cell.trim()));
    }
    state.line += 1;
  }
  const [head, ...body] = rows;
  if (SECTION_IDS[state.section - 1] === "cost") {
    return (
      <ul key={`checklist-${state.line}`}>
        {body.map((row, rowIndex) => (
          <li key={rowIndex}>
            <strong>{inline(row[0])}</strong> — {inline(row[1])}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className={styles.tableWrap} key={`table-${state.line}`}>
      <table>
        <thead>
          <tr>
            {head.map((cell, i) => (
              <th key={i}>{inline(cell)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{inline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Converts consecutive ordered or unordered Markdown list items into a list element.
 *
 * @param state - The parser state containing the current list position and source lines
 * @returns An ordered or unordered list containing the parsed items
 */
function parseList(state: ParseState): React.ReactNode {
  const current = state.lines[state.line];
  const ordered = /^\d+\. /.test(current);
  const items: string[] = [];
  while (
    state.line < state.lines.length &&
    (ordered ? /^\d+\. /.test(state.lines[state.line]) : /^[-*] /.test(state.lines[state.line]))
  ) {
    items.push(state.lines[state.line++].replace(ordered ? /^\d+\. / : /^[-*] /, ""));
  }
  const List = ordered ? "ol" : "ul";
  return (
    <List key={`list-${state.line}`}>
      {items.map((item, i) => (
        <li key={i}>{inline(item)}</li>
      ))}
    </List>
  );
}

/**
 * Parses a blockquote line into a blockquote element.
 *
 * @param state - The current Markdown parsing state.
 * @returns The rendered blockquote element.
 */
function parseQuote(state: ParseState): React.ReactNode {
  const current = state.lines[state.line];
  const node = <blockquote key={`quote-${state.line}`}>{inline(current.slice(2))}</blockquote>;
  state.line += 1;
  return node;
}

/**
 * Parses consecutive Markdown lines into a paragraph element.
 *
 * @param state - The current Markdown parsing state.
 * @returns A paragraph containing the combined inline-formatted text.
 */
function parseParagraph(state: ParseState): React.ReactNode {
  const current = state.lines[state.line];
  const paragraph: string[] = [current];
  state.line += 1;
  while (
    state.line < state.lines.length &&
    state.lines[state.line].trim() &&
    !/^(## |### |```|\||[-*] |\d+\. |> )/.test(state.lines[state.line])
  ) {
    paragraph.push(state.lines[state.line++]);
  }
  return <p key={`p-${state.line}`}>{inline(paragraph.join(" "))}</p>;
}

/**
 * Converts the guide Markdown into rendered React content blocks.
 *
 * @returns The parsed guide content as React nodes.
 */
function MarkdownBody() {
  const lines = GUIDE.split("\n");
  const blocks: React.ReactNode[] = [];
  const state: ParseState = {
    lines,
    line: 0,
    section: -1,
    diagram: 0,
  };

  while (state.line < state.lines.length) {
    const current = state.lines[state.line];
    if (current === "---" || current.trim() === "") {
      state.line += 1;
      continue;
    }
    if (current.startsWith("## ")) {
      const node = parseHeading2(state);
      if (node) blocks.push(node);
      continue;
    }
    if (current.startsWith("### ")) {
      blocks.push(parseHeading3(state));
      continue;
    }
    if (current.startsWith("```")) {
      blocks.push(parseCodeBlock(state));
      continue;
    }
    if (current.startsWith("|")) {
      blocks.push(parseTable(state));
      continue;
    }
    if (/^[-*] /.test(current) || /^\d+\. /.test(current)) {
      blocks.push(parseList(state));
      continue;
    }
    if (current.startsWith("> ")) {
      blocks.push(parseQuote(state));
      continue;
    }
    blocks.push(parseParagraph(state));
  }
  return <>{blocks}</>;
}

/**
 * Renders the GPT-5.6 best-practices guide with a table of contents, guide content, and update notice.
 */
export default function GuideContent() {
  return <div className={styles.guide}><aside className={styles.sidebar}><a className={styles.brand} href="#top">OpenAI <small>GPT-5.6 GUIDE</small></a><nav>{TOC.map((label, i) => <a className={styles.tocLink} href={`#${SECTION_IDS[i]}`} key={SECTION_IDS[i]}><span>{String(i + 1).padStart(2, "0")}</span>{label}</a>)}</nav></aside><main className={styles.main}><header id="top"><p className={styles.eyebrow}>OPENAI · MODEL PLAYBOOK</p><h1>OpenAI GPT-5.6 完全ガイド</h1><p className={styles.subtitle}>Sol / Terra / Luna 実践ベストプラクティス。対象読者：中級〜上級のAIエンジニア・ソフトウェアエンジニア。最終更新の前提日：2026年7月16日。</p></header><MarkdownBody /><footer>本ページは2026年7月16日時点の情報をもとにしています。運用前にOpenAI公式ドキュメントで最新情報を確認してください。</footer></main></div>;
}
