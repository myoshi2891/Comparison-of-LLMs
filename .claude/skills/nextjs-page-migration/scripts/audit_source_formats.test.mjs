import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./audit_source_parity.mjs", import.meta.url));
function audit(source, page) {
	const dir = mkdtempSync(join(tmpdir(), "source-formats-"));
	try {
		writeFileSync(join(dir, "source.html"), source);
		writeFileSync(join(dir, "page.tsx"), page);
		const result = spawnSync(
			process.execPath,
			[script, join(dir, "source.html"), join(dir, "page.tsx"), "--json"],
			{ encoding: "utf8" },
		);
		assert.ifError(result.error);
		return { status: result.status, data: JSON.parse(result.stdout) };
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
}

test("compares escaped Mermaid array entries in exact order and occurrence count", () => {
	const charts = [
		'flowchart TD\nA["Start"] --> B["End"]',
		"flowchart LR\nC --> D",
		'flowchart TD\nA["Start"] --> B["End"]',
	];
	const source = `<script>const DIAGRAMS = ${JSON.stringify(charts)};</script>`;
	const page =
		charts
			.map((chart, i) => `const D${i} = ${JSON.stringify(chart)};`)
			.join("\n") +
		charts.map((_, i) => `<MermaidDiagram chart={D${i}} />`).join("");
	const match = audit(source, page);
	assert.equal(match.status, 0);
	assert.deepEqual(match.data.counts.mermaidSources, { source: 3, page: 3 });
	assert.equal(
		audit(source, page.replace("<MermaidDiagram chart={D2} />", "")).status,
		1,
	);
	assert.equal(
		audit(source, page.replace("chart={D0}", "chart={D1}")).status,
		1,
	);
});
test("compares numeric HTML entities and escaped JSX quotes without removing code placeholders", () => {
	const value = `PROMPT = "{schema} says 'hello'"\nprint("a\\nb", {"key": "value"})`;
	const html = value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/'/g, "&#x27;");
	const match = audit(
		`<pre><code>${html}</code></pre>`,
		`<pre><code>{${JSON.stringify(value)}}</code></pre>`,
	);
	assert.equal(match.status, 0);
	assert.deepEqual(match.data.missingCodeBlocks, []);
	assert.equal(
		audit(
			`<pre><code>${html}</code></pre>`,
			`<pre><code>{${JSON.stringify(value.replace("{schema}", ""))}}</code></pre>`,
		).status,
		1,
	);
});
test("finds displayed URLs split by syntax highlighting", () => {
	const url = "https://example.com/graphs-in-action.git";
	const match = audit(
		`<pre>${url}</pre>`,
		'<pre>{"https://example.com/graphs-"}<span>{"in"}</span>{"-action.git"}</pre>',
	);
	assert.equal(match.status, 0);
	assert.equal(
		audit(
			`<pre>${url}</pre>`,
			'<pre>{"https://example.com/graphs-"}<span>{"in"}</span>{"-action"}</pre>',
		).status,
		1,
	);
});
test("preserves literal backslash-n versus actual line breaks", () => {
	const chart = 'flowchart TD\nA["literal \\n"] --> B';
	assert.equal(
		audit(
			`<script>const DIAGRAMS = ${JSON.stringify([chart])};</script>`,
			`const D = ${JSON.stringify(chart)};<MermaidDiagram chart={D}/>`,
		).status,
		0,
	);
});
test("reports a missing diagram when the DIAGRAMS array omits its trailing semicolon", () => {
	const chart = "flowchart TD\nA --> B";
	const source = `<script>const DIAGRAMS = ${JSON.stringify([chart])}\n</script>`;
	const missing = audit(source, "<div></div>");
	assert.equal(missing.status, 1);
	assert.deepEqual(missing.data.counts.mermaidSources, { source: 1, page: 0 });
	assert.equal(
		audit(source, `const D = ${JSON.stringify(chart)};<MermaidDiagram chart={D}/>`).status,
		0,
	);
});
test("reads JSX string expressions that carry an inline block comment", () => {
	const value = "http://purl.obolibrary.org/obo/HP_";
	const source = `<p>prefix <code>${value}</code> suffix</p>`;
	const page = `<p>prefix <code>{\n  ${JSON.stringify(value)} /* NOSONAR: identifier */\n}</code> suffix</p>`;
	assert.equal(audit(source, page).status, 0);
	assert.equal(audit(source, page.replace(value, "http://example.com/other")).status, 1);
});
test("reads every DIAGRAMS entry when comments sit between entries", () => {
	const first = 'flowchart TD\nA["http://example.com/*x*/"] --> B';
	const second = "flowchart LR\nC --> D";
	const source = `<script>const DIAGRAMS = [\n  // 図1 "not a diagram"\n  ${JSON.stringify(first)},\n  /* 図2 */ ${JSON.stringify(second)}, // 末尾\n];</script>`;
	const page = (charts) =>
		charts.map((chart, i) => `const D${i} = ${JSON.stringify(chart)};`).join("\n") +
		charts.map((_, i) => `<MermaidDiagram chart={D${i}} />`).join("");
	const match = audit(source, page([first, second]));
	assert.equal(match.status, 0);
	assert.deepEqual(match.data.counts.mermaidSources, { source: 2, page: 2 });
	assert.equal(audit(source, page([first])).status, 1);
});

test("resolves text/plain data-for scripts into their target code blocks", () => {
 const first = 'if ready:\n    print("<schema>", {"x": 1})';
 const second = 'print("second")';
 const source = `<pre><code id="a"></code></pre><pre><code id="b"></code></pre><script type="text/plain" data-for="b">${second}</script><script data-for="a" type="text/plain">${first}</script>`;
 const page = `<pre><code>{${JSON.stringify(first)}}</code></pre><pre><code>{${JSON.stringify(second)}}</code></pre>`;
 const match = audit(source, page);
 assert.equal(match.status, 0);
 assert.deepEqual(match.data.counts.codeBlocks, {source:2,page:2});
 assert.equal(audit(source, page.replace('schema', 'missing')).status, 1);
 assert.equal(audit(source, page.replace(JSON.stringify(second), '""')).status, 1);
});

test("treats good and tip callout markers as the same semantic variant", () => {
 const source='<div class="callout tip"><p>Keep the complete explanation.</p></div>';
 const page='<div className={styles.callout + styles.tip} data-variant="good"><p>Keep the complete explanation.</p></div>';
 assert.equal(audit(source,page).status,0);
 assert.equal(audit(source,page.replace('complete explanation','summary')).status,1);
 assert.equal(audit(source,page.replace('styles.tip','styles.warn')).status,1);
});

test("detects styles.good inside a template-literal className", () => {
 const source='<div class="callout good"><p>Keep the complete explanation.</p></div>';
 const page='<div className={`${styles.callout} ${styles.good}`}><p>Keep the complete explanation.</p></div>';
 assert.equal(audit(source,page).status,0);
 assert.equal(audit(source,page.replace('styles.good','styles.warn')).status,1);
});

test("plain callouts use the default info variant without accepting missing content", () => {
 const source='<div class="callout"><p>Full original explanation.</p></div>';
 const page='<div className={styles.callout} data-variant="info"><p>Full original explanation.</p></div>';
 assert.equal(audit(source,page).status,0);
 assert.equal(audit(source,page.replace('Full original explanation.','Short.')).status,1);
 assert.equal(audit(source,page.replace('data-variant="info"','data-variant="warn"')).status,1);
});

test("does not infer a good variant from unrelated attributes such as id", () => {
 const source='<div class="callout" id="good-practices"><p>Original guidance text.</p></div>';
 const page='<div className={styles.callout}><p>Original guidance text.</p></div>';
 assert.equal(audit(source,page).status,0);
 assert.equal(audit(source,page.replace('styles.callout}','styles.callout} data-variant="warn"')).status,1);
});

test("resolves text/plain data-for scripts whose attributes are unquoted", () => {
 const source='<pre><code id="demo"></code></pre><script type=text/plain data-for=demo>print("payload")</script>';
 const page='<pre><code>{"print(\\"payload\\")"}</code></pre>';
 assert.equal(audit(source,page).status,0);
 assert.equal(audit(source,page.replace('payload','other')).status,1);
});

test("matches a code id only for the id attribute, not data-id", () => {
 const source='<pre><code data-id="demo">kept text</code></pre><script type="text/plain" data-for="demo">replaced</script>';
 const page='<pre><code>kept text</code></pre>';
 assert.equal(audit(source,page).status,0);
});

test("keeps literal entities in JSX strings equal to detached textContent payloads", () => {
 const source='<pre><code id="e"></code></pre><script type="text/plain" data-for="e">a &lt; b &amp;&amp; c</script>';
 const page='<pre><code>{"a &lt; b &amp;&amp; c"}</code></pre>';
 assert.equal(audit(source,page).status,0);
 assert.equal(audit(source,'<pre><code>{"a < b && c"}</code></pre>').status,1);
});
