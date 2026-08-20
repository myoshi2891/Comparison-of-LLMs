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
		json: JSON.parse(result.stdout),
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

	return { status: result.status, json: JSON.parse(result.stdout) };
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
