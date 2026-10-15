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
