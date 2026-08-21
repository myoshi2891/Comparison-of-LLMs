import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import {
	MERMAID_DIAGRAM_DECLARATION,
	MERMAID_DIAGRAM_TYPES,
} from "../../fix-mermaid/scripts/mermaid-diagram-types.mjs";

const auditScript = new URL("./audit_source_parity.mjs", import.meta.url);

/**
 * spawnSync の結果を検証してから JSON を解釈する。
 * 起動失敗・タイムアウト・非 JSON 出力を素の JSON.parse に渡すと
 * "Unexpected end of JSON input" だけが残り、stderr の実原因が失われる。
 * @param {import("node:child_process").SpawnSyncReturns<string>} result - 監査プロセスの実行結果。
 * @returns {object} 監査結果の JSON。
 */
function parseAuditResult(result) {
	if (result.error) {
		throw new Error(`監査プロセスの起動に失敗: ${result.error.message}`);
	}
	if (typeof result.stdout !== "string" || result.stdout.trim() === "") {
		throw new Error(
			`監査プロセスが JSON を出力しなかった (status=${result.status}, signal=${result.signal}): ${result.stderr ?? ""}`,
		);
	}
	try {
		return JSON.parse(result.stdout);
	} catch {
		throw new Error(
			`監査出力を JSON として解釈できない: ${result.stdout}\n${result.stderr ?? ""}`,
		);
	}
}

function audit(source, page, sourceExtension = "html") {
	const fixtureDir = mkdtempSync(join(tmpdir(), "source-parity-"));
	const sourcePath = join(fixtureDir, `source.${sourceExtension}`);
	const pagePath = join(fixtureDir, "page.tsx");
	writeFileSync(sourcePath, source);
	writeFileSync(pagePath, page);

	const result = spawnSync(
		process.execPath,
		[auditScript.pathname, sourcePath, pagePath, "--json"],
		{
			encoding: "utf8",
		},
	);
	rmSync(fixtureDir, { recursive: true, force: true });

	return {
		status: result.status,
		json: parseAuditResult(result),
	};
}

test("compares heading level and occurrence count while allowing source h2 to become page h1", () => {
	const result = audit(
		"<h2>Overview</h2><h2>Repeated</h2><h2>Repeated</h2><h3>Details</h3>",
		"<h1>Overview</h1><h2>Repeated</h2><h2>Details</h2>",
	);

	assert.equal(result.status, 1);
	assert.deepEqual(result.json.missingHeadings, [
		{ level: 2, text: "Repeated" },
		{ level: 3, text: "Details" },
	]);
	assert.deepEqual(result.json.extraHeadings, [{ level: 2, text: "Details" }]);
});

test("compares every HTML and Markdown heading level from h1 through h6", () => {
	const html = audit(
		"<h1>Title</h1><h2>Section</h2><h3>Detail</h3><h4>Level four</h4><h5>Level five</h5><h6>Level six</h6>",
		"<h1>Title</h1><h2>Section</h2><h3>Detail</h3><h4>Level four</h4><h5>Changed five</h5>",
	);
	assert.equal(html.status, 1);
	assert.deepEqual(html.json.missingHeadings, [
		{ level: 5, text: "Level five" },
		{ level: 6, text: "Level six" },
	]);

	const markdown = audit(
		"# Title\n\n#### Level four\n\n##### Level five\n\n###### Level six",
		"<h1>Title</h1><h4>Level four</h4><h5>Level five</h5>",
		"md",
	);
	assert.equal(markdown.status, 1);
	assert.deepEqual(markdown.json.missingHeadings, [{ level: 6, text: "Level six" }]);
});

test("treats missing or altered SVG elements as blocking parity failures", () => {
	const source = `<svg viewBox="0 0 20 20"><path d="M0 0 L20 20" stroke-width="2" /></svg>
<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg>`;
	const matching = audit(
		source,
		`<><svg viewBox="0 0 20 20"><path d="M0 0 L20 20" strokeWidth="2" /></svg>
<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg></>`,
	);
	assert.equal(matching.status, 0);
	assert.deepEqual(matching.json.missingSvgElements, []);
	assert.deepEqual(matching.json.counts.svgElements, { source: 2, page: 2 });

	const altered = audit(
		source,
		'<svg viewBox="0 0 20 20"><path d="M0 0 L10 10" strokeWidth="2" /></svg>',
	);
	assert.equal(altered.status, 1);
	assert.equal(altered.json.missingSvgElements.length, 2);
});

test("treats missing or altered callout and alert elements as blocking parity failures", () => {
	const source = `<div class="callout warn"><strong>Warning</strong><p>Keep this exact text.</p></div>
<aside class="alert info"><p>Informational text.</p></aside>`;
	const matching = audit(
		source,
		`<><div className={\`\${styles.callout} \${styles.warn}\`}><strong>Warning</strong><p>Keep this exact text.</p></div>
<aside className={\`\${styles.alert} \${styles.info}\`}><p>Informational text.</p></aside></>`,
	);
	assert.equal(matching.status, 0);
	assert.deepEqual(matching.json.missingCalloutElements, []);
	assert.deepEqual(matching.json.counts.calloutElements, { source: 2, page: 2 });

	const altered = audit(
		source,
		'<div className={styles.callout}><strong>Warning</strong><p>Changed text.</p></div>',
	);
	assert.equal(altered.status, 1);
	assert.equal(altered.json.missingCalloutElements.length, 2);
});

test("extracts Markdown admonitions as callout elements", () => {
	const result = audit(
		"> [!WARNING]\n> Keep this exact text.",
		'<aside data-variant="warn"><p>Changed text.</p></aside>',
		"md",
	);

	assert.equal(result.status, 1);
	assert.deepEqual(result.json.counts.calloutElements, { source: 1, page: 1 });
	assert.equal(result.json.missingCalloutElements.length, 1);
});

test("treats normalized code blocks and table rows as blocking parity elements", () => {
	const matching = audit(
		`<pre><code><span>npm</span> test</code></pre>
     <table><tr><th>Name</th><th>Value</th></tr></table>`,
		`<pre><span>npm</span>{" "}test</pre>
     <table><tbody><tr><th>Name</th><th>Value</th></tr></tbody></table>`,
	);
	assert.equal(matching.status, 0);
	assert.deepEqual(matching.json.missingCodeBlocks, []);
	assert.deepEqual(matching.json.missingTableRows, []);

	const missing = audit(
		`<pre>npm test</pre><pre>npm test</pre>
     <table><tr><td>A</td></tr><tr><td>A</td></tr></table>`,
		`<pre>npm test</pre><table><tr><td>A</td></tr></table>`,
	);
	assert.equal(missing.status, 1);
	assert.deepEqual(missing.json.missingCodeBlocks, ["npm test"]);
	assert.deepEqual(missing.json.missingTableRows, ["A"]);
});

test("requires Mermaid sources to match exactly in order and occurrence count", () => {
	const source = `<div class="mermaid">graph TD
A --&gt; B</div>
<div class="mermaid">sequenceDiagram
A-&gt;&gt;B: ping</div>`;
	const matchingPage = `const FIRST = \`graph TD
A --> B\`;
const SECOND = \`sequenceDiagram
A->>B: ping\`;
export default function Page() {
  return <><MermaidDiagram chart={FIRST} /><MermaidDiagram chart={SECOND} /></>;
}`;
	const matching = audit(source, matchingPage);
	assert.equal(matching.status, 0);
	assert.equal(matching.json.mermaidSourcesMatch, true);

	const reversedPage = `const FIRST = \`graph TD
A --> B\`;
const SECOND = \`sequenceDiagram
A->>B: ping\`;
export default function Page() {
  return <><MermaidDiagram chart={SECOND} /><MermaidDiagram chart={FIRST} /></>;
}`;
	const reversed = audit(source, reversedPage);
	assert.equal(reversed.status, 1);
	assert.equal(reversed.json.mermaidSourcesMatch, false);
	assert.deepEqual(reversed.json.pageMermaidSources, [
		"sequenceDiagram\nA->>B: ping",
		"graph TD\nA --> B",
	]);
});

test("does not treat a Markdown Mermaid fence as a normal code block", () => {
	const source = `Intro paragraph.

\`\`\`mermaid
flowchart TD
  A[Start] --> B[Done]
\`\`\``;
	const page = `const CHART = \`flowchart TD
  A[Start] --> B[Done]\`;
export default function Page() {
  return <><p>Intro paragraph.</p><MermaidDiagram chart={CHART} /></>;
}`;

	const result = audit(source, page, "md");

	assert.equal(result.status, 0);
	assert.deepEqual(result.json.missingCodeBlocks, []);
	assert.equal(result.json.mermaidSourcesMatch, true);
});

test("recognizes every allowed Mermaid diagram declaration including pie", () => {
	const charts = [
		"graph TD\nA --> B",
		"flowchart TD\nA --> B",
		"sequenceDiagram\nA->>B: ping",
		"mindmap\n  root((Root))",
		"stateDiagram-v2\nA --> B",
		"gitGraph\ncommit",
		"erDiagram\nA ||--o{ B : has",
		"classDiagram\nA <|-- B",
		"journey\ntitle Trip",
		"timeline\ntitle History",
		'pie title Share\n"A" : 1',
	];
	const source = charts
		.map((chart) => `<div class="mermaid">${chart}</div>`)
		.join("\n");
	const declarations = charts
		.map((chart, index) => `const CHART_${index} = \`${chart}\`;`)
		.join("\n");
	const diagrams = charts
		.map((_, index) => `<MermaidDiagram chart={CHART_${index}} />`)
		.join("");

	const result = audit(
		source,
		`${declarations}\nexport default function Page() { return <>${diagrams}</>; }`,
	);

	assert.equal(result.status, 0);
	assert.equal(result.json.mermaidSourcesMatch, true);
	assert.equal(result.json.counts.mermaidSources.source, charts.length);
	assert.equal(MERMAID_DIAGRAM_TYPES.length, charts.length);
	for (const chart of charts) assert.match(chart, MERMAID_DIAGRAM_DECLARATION);
	assert.doesNotMatch("block-beta\ncolumns 1", MERMAID_DIAGRAM_DECLARATION);
});

test("treats normalized HTML and Markdown paragraphs as blocking parity elements", () => {
	const matchingHtml = audit(
		"<p>First ordinary paragraph.</p><p>Second ordinary paragraph.</p>",
		"<p>First ordinary paragraph.</p><p>Second ordinary paragraph.</p>",
	);
	assert.equal(matchingHtml.status, 0);
	assert.deepEqual(matchingHtml.json.missingParagraphs, []);

	const missingHtml = audit(
		"<p>First ordinary paragraph.</p><p>Second ordinary paragraph.</p>",
		"<p>First ordinary paragraph.</p>",
	);
	assert.equal(missingHtml.status, 1);
	assert.deepEqual(missingHtml.json.missingParagraphs, [
		"Second ordinary paragraph.",
	]);

	const missingMarkdown = audit(
		`First Markdown paragraph.

Second Markdown paragraph spans
two source lines.`,
		"<p>First Markdown paragraph.</p>",
		"md",
	);
	assert.equal(missingMarkdown.status, 1);
	assert.deepEqual(missingMarkdown.json.missingParagraphs, [
		"Second Markdown paragraph spans two source lines.",
	]);
});

test("accepts .markdown as a Markdown source extension", () => {
	const result = audit(
		"## Markdown heading\n\nOrdinary paragraph.",
		"<><h2>Markdown heading</h2><p>Ordinary paragraph.</p></>",
		"markdown",
	);

	assert.equal(result.status, 0);
	assert.equal(result.json.counts.headings.source, 1);
	assert.equal(result.json.counts.paragraphs.source, 1);
	assert.deepEqual(result.json.missingHeadings, []);
	assert.deepEqual(result.json.missingParagraphs, []);
});

test("web-next 側の Mermaid 図解型一覧がスキル側と一致する", () => {
	// web-next/ から .claude/ を import すると CLAUDE.md の「インポート安全性」に反するため、
	// web-next 側は lib/mermaid-diagram-types.ts に同じ一覧を持つ。差分をここで機械検知する。
	const mirrorPath = new URL(
		"../../../../web-next/lib/mermaid-diagram-types.ts",
		import.meta.url,
	);
	const mirrorSource = readFileSync(mirrorPath, "utf8");
	const listBlock = /MERMAID_DIAGRAM_TYPES\s*=\s*\[([\s\S]*?)\]/.exec(mirrorSource);
	assert.ok(listBlock, "web-next 側に MERMAID_DIAGRAM_TYPES の定義が見つからない");
	const mirrorTypes = [...listBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

	assert.deepEqual(mirrorTypes, MERMAID_DIAGRAM_TYPES);
});

/**
 * page.tsx に加えて任意の同階層モジュールを書き出したうえで監査を実行する。
 * @param {string} source - 原本 HTML。
 * @param {string} page - page.tsx の内容。
 * @param {Record<string, string>} modules - fixture ディレクトリ相対のパス → 内容。
 * @returns {{status: number, json: object}} 監査結果。
 */
function auditWithModules(source, page, modules) {
	const fixtureDir = mkdtempSync(join(tmpdir(), "source-parity-modules-"));
	const sourcePath = join(fixtureDir, "source.html");
	const pagePath = join(fixtureDir, "page.tsx");
	writeFileSync(sourcePath, source);
	writeFileSync(pagePath, page);
	for (const [relPath, content] of Object.entries(modules)) {
		const target = join(fixtureDir, relPath);
		mkdirSync(dirname(target), { recursive: true });
		writeFileSync(target, content);
	}

	const result = spawnSync(
		process.execPath,
		[auditScript.pathname, sourcePath, pagePath, "--json"],
		{ encoding: "utf8", timeout: 20_000 },
	);
	rmSync(fixtureDir, { recursive: true, force: true });

	return { status: result.status, json: parseAuditResult(result) };
}

test("data-code ブロック内の style 要素が除去されずコード全文が残る", () => {
	// <script type="text/plain"> の中身は生の <style> を含みうる。プレースホルダへ退避せずに
	// script/style 除去を掛けると、コード本文ごと消えて原本側が空になる。
	const result = audit(
		[
			"<style>.page{color:red}</style>",
			"<pre>",
			'<script type="text/plain" data-code-src="1">',
			"<style>.hero{color:red}</style>",
			"</script>",
			"</pre>",
		].join("\n"),
		'<><pre><code>{"<style>.hero{color:red}</style>"}</code></pre></>',
	);

	assert.equal(result.json.counts.codeBlocks.source, 1);
	assert.deepEqual(result.json.missingCodeBlocks, []);
	assert.equal(result.status, 0);
});

test("入れ子の相対 import を各モジュールのディレクトリ基準で解決する", () => {
	const result = auditWithModules(
		"<h2>Overview</h2><p>Nested paragraph.</p>",
		'import Section from "./sections/Section";\n<><h2>Overview</h2><Section /></>',
		{
			"sections/Section.tsx":
				'import Body from "./Body";\nexport default function Section() { return <Body />; }',
			"sections/Body.tsx":
				"export default function Body() { return <p>Nested paragraph.</p>; }",
		},
	);

	assert.equal(result.status, 0);
	assert.deepEqual(result.json.missingParagraphs, []);
});

test("default / namespace / type / 複合の相対 import も辿る", () => {
	const forms = {
		"default import": 'import Body from "./Body";\nexport default function Section() { return <Body />; }',
		"namespace import":
			'import * as Body from "./Body";\nexport default function Section() { return <Body.default />; }',
		"default + named import":
			'import Body, { helper } from "./Body";\nexport default function Section() { return <Body value={helper} />; }',
		"default + namespace import":
			'import Body, * as rest from "./Body";\nexport default function Section() { return <Body value={rest} />; }',
		"type import":
			'import type { BodyProps } from "./Body";\nexport default function Section(props: BodyProps) { return <p>{props.text}</p>; }',
	};

	for (const [label, sectionSource] of Object.entries(forms)) {
		const result = auditWithModules(
			"<h2>Overview</h2><p>Nested paragraph.</p>",
			'import Section from "./sections/Section";\n<><h2>Overview</h2><Section /></>',
			{
				"sections/Section.tsx": sectionSource,
				"sections/Body.tsx":
					"export default function Body() { return <p>Nested paragraph.</p>; }",
			},
		);

		assert.deepEqual(result.json.missingParagraphs, [], label);
		assert.equal(result.status, 0, label);
	}
});

test("循環する相対 import があっても監査が完了する", () => {
	const result = auditWithModules(
		"<h2>Overview</h2><p>Cyclic paragraph.</p>",
		'import A from "./A";\n<><h2>Overview</h2><A /></>',
		{
			"A.tsx": 'import B from "./B";\nexport default function A() { return <B />; }',
			"B.tsx":
				'import A from "./A";\nexport default function B() { return <p>Cyclic paragraph.</p>; }',
		},
	);

	assert.equal(result.status, 0);
	assert.deepEqual(result.json.missingParagraphs, []);
});

test("コメント / テンプレートリテラル / 描画コード中の import 風テキストは辿らない", () => {
	// ガイドページは「import 文」そのものをコード例として描画する。これを実 import と
	// 取り違えて隣のモジュールを読み込むと、そのモジュールの本文が page 側の照合材料に
	// 混ざり、実際には転写していない段落を「あり」と誤判定する（監査の意味が消える）。
	const result = auditWithModules(
		"<h2>Overview</h2><p>Only the unrelated module has this paragraph.</p>",
		[
			'import Section from "./sections/Section";',
			'// import Unrelated from "./Unrelated";',
			"const SAMPLE = `",
			'import Unrelated from "./Unrelated";',
			'import { MermaidDiagram } from "./Unrelated";',
			"`;",
			"<><h2>Overview</h2><Section />",
			'  <pre><code>import Unrelated from "./Unrelated";</code></pre>',
			"  <pre><code>{SAMPLE}</code></pre></>",
		].join("\n"),
		{
			"sections/Section.tsx":
				"export default function Section() { return <p>Section paragraph.</p>; }",
			"Unrelated.tsx":
				"export default function Unrelated() { return <p>Only the unrelated module has this paragraph.</p>; }",
		},
	);

	assert.deepEqual(result.json.missingParagraphs, [
		"Only the unrelated module has this paragraph.",
	]);
	assert.equal(result.status, 1);
});

test("列 0 に描画された import 風テキストも辿らない", () => {
	// <pre> の中身は整形時にインデントを保存されるため、コード例の import が列 0 に来る。
	// 実 import の判定を桁位置に頼ると、この描画テキストを実 import と取り違える。
	// ディレクティブ・コメント・副作用 import が先行しても、実 import は辿れること。
	const result = auditWithModules(
		"<h2>Overview</h2><p>Only the unrelated module has this paragraph.</p>",
		[
			'"use client";',
			'// import Commented from "./Unrelated";',
			'import "./page.module.css";',
			'import Section from "./sections/Section";',
			"<><h2>Overview</h2><Section />",
			"  <pre><code>",
			'import Unrelated from "./Unrelated";',
			"  </code></pre></>",
		].join("\n"),
		{
			"sections/Section.tsx":
				"export default function Section() { return <p>Section paragraph.</p>; }",
			"Unrelated.tsx":
				"export default function Unrelated() { return <p>Only the unrelated module has this paragraph.</p>; }",
		},
	);

	// 描画テキストは辿らない → 未転写の段落が漏れとして報告される。
	assert.deepEqual(result.json.missingParagraphs, [
		"Only the unrelated module has this paragraph.",
	]);
	assert.equal(result.status, 1);
	// 実 import は辿れている → Section の段落だけが page 側に数えられている
	// （Unrelated を辿っていればこの段落が漏れとして報告されない）。
	assert.equal(result.json.counts.paragraphs.page, 1);
});

test("JSX 文字列式が保持する HTML 断片を原本のエンティティと同一視する", () => {
	// 原本の &lt;style&gt; はエンティティ復号が最後なのでタグ除去を生き延びる。page 側の
	// {"<style>"} も同じ表示テキストなので、退避せずタグ除去に晒すと片側だけ消えて誤検出になる。
	const matching = audit(
		[
			"<p>Double &lt;style&gt; quoted.</p>",
			"<p>Single &lt;input&gt; quoted.</p>",
			"<p>Template &lt;div&gt; quoted.</p>",
		].join("\n"),
		[
			'<p>Double {"<style>"} quoted.</p>',
			"<p>Single {'<input>'} quoted.</p>",
			"<p>Template {`<div>`} quoted.</p>",
		].join("\n"),
	);

	assert.deepEqual(matching.json.missingParagraphs, []);
	assert.equal(matching.status, 0);

	// 保持した中身の差分は引き続き漏れとして検出できる。
	const altered = audit(
		"<p>Double &lt;style&gt; quoted.</p>",
		'<p>Double {"<script>"} quoted.</p>',
	);
	assert.deepEqual(altered.json.missingParagraphs, ["Double <style> quoted."]);
	assert.equal(altered.status, 1);
});

test("import 属性付き宣言の後続にある相対 import も辿る", () => {
	// `with { type: "json" }` を消費しないと走査がそこで止まり、後続の実 import 配下の
	// 本文が丸ごと監査対象から外れて「漏れなし」と誤判定される。
	const result = auditWithModules(
		"<h2>Overview</h2><p>Nested paragraph.</p>",
		[
			'import data from "./data.json" with { type: "json" };',
			'import Section from "./sections/Section";',
			"<><h2>Overview</h2><Section value={data} /></>",
		].join("\n"),
		{
			"sections/Section.tsx":
				"export default function Section() { return <p>Nested paragraph.</p>; }",
		},
	);

	assert.deepEqual(result.json.missingParagraphs, []);
	assert.equal(result.status, 0);
});

test("文字列式の <br> は文字ではなく改行として扱う", () => {
	// 図解ラベルの {"Step9<br/>コスト最適化"} は「Step9コスト最適化」という表示テキストであり、
	// <br/> という文字列ではない。原本側でも <br> は除去されるため、文字として保持すると
	// 本文の連続性が切れて実在する項目を漏れと誤判定する。
	const result = audit(
		"<p>Step9 コスト最適化</p>",
		'<p>{"Step9<br/>コスト最適化"}</p>',
	);

	assert.deepEqual(result.json.missingParagraphs, []);
	assert.equal(result.status, 0);
});

test("トップレベル宣言を挟んだ後続の相対 import も辿る", () => {
	// `export const metadata = {…};` のような宣言で走査が止まると、その後ろの実 import 配下の
	// 本文が丸ごと監査対象から外れ、転写済みの段落が漏れとして誤報告される。
	const result = auditWithModules(
		"<h2>Overview</h2><p>Nested paragraph.</p>",
		[
			'import type { Metadata } from "next";',
			'export const metadata: Metadata = { title: "Guide; not a terminator" };',
			"export const revalidate = false;",
			'import Section from "./sections/Section";',
			"<><h2>Overview</h2><Section /></>",
		].join("\n"),
		{
			"sections/Section.tsx":
				"export default function Section() { return <p>Nested paragraph.</p>; }",
		},
	);

	assert.deepEqual(result.json.missingParagraphs, []);
	assert.equal(result.status, 0);
});

test("トップレベル宣言の読み飛ばしは描画された import 風テキストまで進まない", () => {
	// 宣言を読み飛ばせるようにしても、JSX 本文に入ってはならない。入ると <pre> のコード例が
	// 実 import として辿られ、未転写の段落が page 側の照合材料に混ざる。
	const result = auditWithModules(
		"<h2>Overview</h2><p>Only the unrelated module has this paragraph.</p>",
		[
			'import Section from "./sections/Section";',
			"export const revalidate = false;",
			"<><h2>Overview</h2><Section />",
			"  <pre><code>",
			'import Unrelated from "./Unrelated";',
			"  </code></pre></>",
		].join("\n"),
		{
			"sections/Section.tsx":
				"export default function Section() { return <p>Section paragraph.</p>; }",
			"Unrelated.tsx":
				"export default function Unrelated() { return <p>Only the unrelated module has this paragraph.</p>; }",
		},
	);

	assert.deepEqual(result.json.missingParagraphs, [
		"Only the unrelated module has this paragraph.",
	]);
	assert.equal(result.status, 1);
	assert.equal(result.json.counts.paragraphs.page, 1);
});

test("関数型の型エイリアスを挟んだ後続の相対 import も辿る", () => {
	// `type Loader = () => …` の `=>` を実行本体の開始と誤認して走査を止めると、
	// その後ろの実 import 配下の本文が監査対象から外れ、転写済みの段落が漏れと誤報告される。
	const result = auditWithModules(
		"<h2>Overview</h2><p>Nested paragraph.</p>",
		[
			'import dynamic from "next/dynamic";',
			"type Loader = () => Promise<void>;",
			"interface Props { load: Loader }",
			'import Section from "./sections/Section";',
			"<><h2>Overview</h2><Section /></>",
		].join("\n"),
		{
			"sections/Section.tsx":
				"export default function Section() { return <p>Nested paragraph.</p>; }",
		},
	);

	assert.deepEqual(result.json.missingParagraphs, []);
	assert.equal(result.status, 0);
});
