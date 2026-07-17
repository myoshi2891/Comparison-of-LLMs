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

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function inline(text: string): React.ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|https?:\/\/[^\s|]+)/g).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("http")) return <Ext key={index} href={part}>{part}</Ext>;
    return part;
  });
}

function MarkdownBody() {
  const lines = GUIDE.split("\n");
  const blocks: React.ReactNode[] = [];
  let line = 0;
  let section = -1;
  let diagram = 0;

  while (line < lines.length) {
    const current = lines[line];
    if (current === "---" || current.trim() === "") { line += 1; continue; }
    if (current.startsWith("## ")) {
      section += 1;
      if (section === 0) { line += 1; continue; }
      const index = section - 1;
      blocks.push(<section data-guide-section id={SECTION_IDS[index]} className={styles.section} key={`s-${index}`}><h2><span>{String(index + 1).padStart(2, "0")}</span>{current.slice(3)}</h2></section>);
      line += 1;
      continue;
    }
    if (current.startsWith("### ")) {
      blocks.push(<h3 key={`h3-${line}`}>{current.slice(4)}</h3>); line += 1; continue;
    }
    if (current.startsWith("```")) {
      const language = current.slice(3);
      const code: string[] = [];
      line += 1;
      while (line < lines.length && !lines[line].startsWith("```")) code.push(lines[line++]);
      line += 1;
      if (language === "mermaid") {
        diagram += 1;
        blocks.push(<div className={styles.mermaidWrap} key={`mermaid-${diagram}`}><MermaidDiagram chart={code.join("\n")} theme="dark" /></div>);
      } else {
        blocks.push(<pre className={styles.codeBlock} key={`code-${line}`}><code className={`language-${language}`}>{code.join("\n")}</code></pre>);
      }
      continue;
    }
    if (current.startsWith("|")) {
      const rows: string[][] = [];
      while (line < lines.length && lines[line].startsWith("|")) {
        if (!/^\|[- :|]+\|$/.test(lines[line])) rows.push(lines[line].split("|").slice(1, -1).map((cell) => cell.trim()));
        line += 1;
      }
      const [head, ...body] = rows;
      if (SECTION_IDS[section - 1] === "cost") {
        blocks.push(<ul key={`checklist-${line}`}>{body.map((row, rowIndex) => <li key={rowIndex}><strong>{inline(row[0])}</strong> — {inline(row[1])}</li>)}</ul>);
        continue;
      }
      blocks.push(<div className={styles.tableWrap} key={`table-${line}`}><table><thead><tr>{head.map((cell, i) => <th key={i}>{inline(cell)}</th>)}</tr></thead><tbody>{body.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>);
      continue;
    }
    if (/^[-*] /.test(current) || /^\d+\. /.test(current)) {
      const ordered = /^\d+\. /.test(current);
      const items: string[] = [];
      while (line < lines.length && (ordered ? /^\d+\. /.test(lines[line]) : /^[-*] /.test(lines[line]))) items.push(lines[line++].replace(ordered ? /^\d+\. / : /^[-*] /, ""));
      const List = ordered ? "ol" : "ul";
      blocks.push(<List key={`list-${line}`}>{items.map((item, i) => <li key={i}>{inline(item)}</li>)}</List>);
      continue;
    }
    if (current.startsWith("> ")) { blocks.push(<blockquote key={`quote-${line}`}>{inline(current.slice(2))}</blockquote>); line += 1; continue; }
    const paragraph: string[] = [current];
    line += 1;
    while (line < lines.length && lines[line].trim() && !/^(## |### |```|\||[-*] |\d+\. |> )/.test(lines[line])) paragraph.push(lines[line++]);
    blocks.push(<p key={`p-${line}`}>{inline(paragraph.join(" "))}</p>);
  }
  return <>{blocks}</>;
}

export default function GuideContent() {
  return <div className={styles.guide}><aside className={styles.sidebar}><a className={styles.brand} href="#top">OpenAI <small>GPT-5.6 GUIDE</small></a><nav>{TOC.map((label, i) => <a className={styles.tocLink} href={`#${SECTION_IDS[i]}`} key={SECTION_IDS[i]}><span>{String(i + 1).padStart(2, "0")}</span>{label}</a>)}</nav></aside><main className={styles.main}><header id="top"><p className={styles.eyebrow}>OPENAI · MODEL PLAYBOOK</p><h1>OpenAI GPT-5.6 完全ガイド</h1><p className={styles.subtitle}>Sol / Terra / Luna 実践ベストプラクティス。対象読者：中級〜上級のAIエンジニア・ソフトウェアエンジニア。最終更新の前提日：2026年7月16日。</p></header><MarkdownBody /><footer>本ページは2026年7月16日時点の情報をもとにしています。運用前にOpenAI公式ドキュメントで最新情報を確認してください。</footer></main></div>;
}
