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

test("does not infer a good variant from text inside another attribute's value", () => {
 const page='<div className={styles.callout}><p>Original guidance text.</p></div>';
 for (const attribute of [`title='see class="good"'`,`title="see data-variant='good'"`]) {
  assert.equal(audit(`<div class="callout" ${attribute}><p>Original guidance text.</p></div>`,page).status,0,attribute);
 }
 const source='<div class="callout"><p>Original guidance text.</p></div>';
 for (const attribute of [`title={"see className='good'"}`,`title={"a}b className='good'"}`,`{...{ title: "see className='good'" }}`]) {
  assert.equal(audit(source,page.replace('styles.callout}',`styles.callout} ${attribute}`)).status,0,attribute);
 }
});

test("still reads a good variant declared after other attributes", () => {
 const source='<div class="callout tip"><p>Keep the complete explanation.</p></div>';
 const page='<div className={styles.callout}><p>Keep the complete explanation.</p></div>';
 for (const attributes of [`title="plain" data-variant="good"`,`title={"a}b"} data-variant='good'`,`{...rest} class=good`]) {
  assert.equal(audit(source,page.replace('styles.callout}',`styles.callout} ${attributes}`)).status,0,attributes);
 }
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

test("keeps JSX comment syntax that is displayed text inside string expressions", () => {
	const source = "<pre><code>{/* keep */}</code></pre>";
	const viaConstant = 'const CODE = "{/* keep */}";\n<pre>{CODE}</pre>';
	const viaExpression = '<pre>{"{/* keep */}"}</pre>';
	assert.equal(audit(source, viaConstant).status, 0);
	assert.equal(audit(source, viaExpression).status, 0);
	// 文字列を守っても、本物の JSX コメントは従来どおり表示されない。
	assert.equal(audit("<pre><code>a</code></pre>", '<pre>{/* hide */}{"a"}</pre>').status, 0);
	assert.equal(audit(source, '<pre>{/* {"{/* keep */}"}</pre>').status, 1);
	assert.equal(audit(source, 'const CODE = "";\n<pre>{CODE}</pre>').status, 1);
});

test("keeps literal entities in JSX strings equal to detached textContent payloads", () => {
 const source='<pre><code id="e"></code></pre><script type="text/plain" data-for="e">a &lt; b &amp;&amp; c</script>';
 const page='<pre><code>{"a &lt; b &amp;&amp; c"}</code></pre>';
 assert.equal(audit(source,page).status,0);
 assert.equal(audit(source,'<pre><code>{"a < b && c"}</code></pre>').status,1);
});

test("resolves data-for on a script whose earlier quoted attribute value contains >", () => {
 const source='<pre><code id="demo"></code></pre><script data-note="x>y" title=\'a>b\' type="text/plain" data-for="demo">print("payload")</script>';
 const page='<pre><code>{"print(\\"payload\\")"}</code></pre>';
 assert.equal(audit(source,page).status,0);
 assert.equal(audit(source,page.replace('payload','other')).status,1);
});

test("resolves a code id after an earlier quoted attribute value containing >", () => {
 const source='<pre><code title="a>b" id="demo"></code></pre><script type="text/plain" data-for="demo">print("payload")</script>';
 // id 解決に加え、本文抽出のタグ除去も引用値内の > で開始タグを打ち切らないこと。
 assert.deepEqual(audit(source,"").data.missingCodeBlocks,['print("payload")']);
});

test("reads the real id attribute, not id=… text inside another attribute's quoted value", () => {
 const source='<pre><code title="x id=other" id="demo"></code></pre><script type="text/plain" data-for="demo">print("payload")</script>';
 assert.deepEqual(audit(source,"").data.missingCodeBlocks,['print("payload")']);
 const decoy='<pre><code title="x id=demo">kept text</code></pre><script type="text/plain" data-for="demo">replaced</script>';
 assert.equal(audit(decoy,'<pre><code>kept text</code></pre>').status,0);
});

test("matches data-for and id after decoding differently encoded character references", () => {
 // data-for="a&amp;b" と id="a&#38;b" はどちらもブラウザ上で "a&b" に復号され、同じ要素を指す。
 const source='<pre><code id="a&#38;b"></code></pre><script type="text/plain" data-for="a&amp;b">print("payload")</script>';
 assert.deepEqual(audit(source,"").data.missingCodeBlocks,['print("payload")']);
 const page='<pre><code>{"print(\\"payload\\")"}</code></pre>';
 assert.equal(audit(source,page).status,0);
 assert.equal(audit(source,page.replace('payload','other')).status,1);
 const hex='<pre><code id="a&#x26;b"></code></pre><script type="text/plain" data-for="a&amp;b">print("payload")</script>';
 assert.deepEqual(audit(hex,"").data.missingCodeBlocks,['print("payload")']);
});

test("does not let an unclosed <code> inside a detached script payload consume a later displayed block", () => {
 // 置換の一致が script 内の "<code>" から始まると、後続の表示ブロックの </code> まで食い、
 // そのブロックへ payload が差し込まれず空のまま残る。空ページとの照合が通ってしまう。
 const source='<script type="text/plain" data-for="demo">Use <code>x to start</script><pre><code id="demo"></code></pre>';
 assert.deepEqual(audit(source,"").data.missingCodeBlocks,["Use <code>x to start"]);
 assert.equal(audit(source,"").status,1);
 assert.equal(audit(source,'<pre><code></code></pre>').status,1);
 assert.equal(audit(source,'<pre><code>{"Use <code>x to start"}</code></pre>').status,0);
});

test("ignores <code> text inside a quoted attribute when inserting a detached payload into the displayed block", () => {
 // 引用属性値の中の "<code>" から一致が始まると、後続の表示ブロックの開始タグを本文として食い、
 // そのブロックへ payload が差し込まれず空のまま残る。
 const source='<span title="<code>x">intro</span><pre><code id="demo"></code></pre><script type="text/plain" data-for="demo">print("payload")</script>';
 assert.deepEqual(audit(source,"").data.missingCodeBlocks,['print("payload")']);
 assert.equal(audit(source,'<pre><code></code></pre>').status,1);
 assert.equal(audit(source,'<pre><code>{"print(\\"payload\\")"}</code></pre>').status,0);
});

test("keeps a literal <br> in detached and page-side code blocks", () => {
	// コード本文の <br> は改行指示ではなく表示される文字列。消すと同一ブロックが不一致になる。
	const code = 'const html = "a<br>b<br/>c";';
	const detached = `<pre><code id="demo"></code></pre><script type="text/plain" data-for="demo">${code}</script>`;
	const page = `<pre><code>{${JSON.stringify(code)}}</code></pre>`;
	const match = audit(detached, page);
	assert.deepEqual(match.data.missingCodeBlocks, []);
	assert.equal(match.status, 0);

	const inline = '<pre><code>a&lt;br&gt;b</code></pre>';
	assert.equal(audit(inline, '<pre><code>{"a<br>b"}</code></pre>').status, 0);
});

test("detects a literal <br> dropped from a page-side code block", () => {
	const source = '<pre><code>a&lt;br&gt;b</code></pre>';
	for (const page of ['<pre><code>{"ab"}</code></pre>', '<pre><code>{"a b"}</code></pre>']) {
		const result = audit(source, page);
		assert.equal(result.status, 1);
		assert.equal(result.data.missingCodeBlocks.length, 1);
	}
});

test("keeps replacing <br> in non-code diagram labels", () => {
	const result = audit("<p>Step9 cost</p>", '<p>{"Step9<br/>cost"}</p>');
	assert.deepEqual(result.data.missingParagraphs, []);
	assert.equal(result.status, 0);
});

test("ignores a commented-out detached script that follows the real one", () => {
	const source = '<pre><code id="demo"></code></pre><script type="text/plain" data-for="demo">real payload</script><!-- <script type="text/plain" data-for="demo">stale payload</script> -->';
	const match = audit(source, '<pre><code>{"real payload"}</code></pre>');
	assert.deepEqual(match.data.missingCodeBlocks, []);
	assert.equal(match.status, 0);
	assert.equal(audit(source, '<pre><code>{"stale payload"}</code></pre>').status, 1);
});

test("does not inject a detached script that exists only in a comment", () => {
	const source = '<pre><code id="demo">kept text</code></pre><!-- <script type="text/plain" data-for="demo">stale payload</script> -->';
	assert.equal(audit(source, '<pre><code>{"kept text"}</code></pre>').status, 0);
	assert.equal(audit(source, '<pre><code>{"stale payload"}</code></pre>').status, 1);
});

test("finds a real detached script after a comment holding an unclosed script tag", () => {
	const source = '<pre><code id="demo"></code></pre><!-- <script> --><script type="text/plain" data-for="demo">real payload</script>';
	const match = audit(source, '<pre><code>{"real payload"}</code></pre>');
	assert.deepEqual(match.data.missingCodeBlocks, []);
	assert.equal(match.status, 0);
});

test("keeps literal markup in code blocks rendered from a string constant", () => {
	const source = '<pre><code id="demo"></code></pre><script type="text/plain" data-for="demo">a<br>b <div>c</div></script>';
	const page = 'const CODE = "a<br>b <div>c</div>";\n<pre><code>{CODE}</code></pre>';
	const match = audit(source, page);
	assert.deepEqual(match.data.missingCodeBlocks, []);
	assert.equal(match.status, 0);
	assert.equal(audit(source, 'const CODE = "ab c";\n<pre><code>{CODE}</code></pre>').status, 1);
});

test("materializes sibling text/plain code payloads without parsing literal markup", () => {
 const value = 'print("<schema>{value}</schema> &lt;")\n  nested()';
 const source = `<div class="code-block"><div>python</div><pre><code></code></pre><script type="text/plain">\n    ${value.replace(/\n/g,'\n    ')}\n </script></div>`;
 const page = `<div>python<pre><code>{${JSON.stringify(value)}}</code></pre></div>`;
 assert.equal(audit(source,page).status,0);
 assert.equal(audit(source,page.replace('nested()','omitted()')).status,1);
 assert.equal(audit(source,'').status,1);
});

test("collects sibling diagram payloads and concatenated runtime CLASSDEFS in document order", () => {
 const charts=['flowchart LR\nA --> B','flowchart TD\nB --> C','flowchart LR\nA --> B'];
 const suffix='\nclassDef hub fill:#fff;\nclassDef box color:#000;';
 const source=charts.map(s=>`<div class="diagram-card"><div class="diagram-wrap"></div><script type="text/plain">${s}</script></div>`).join('')+`<script>var CLASSDEFS = '\\nclassDef hub fill:#fff;' + '\\nclassDef box color:#000;'; mermaid.render('x', src + CLASSDEFS);</script>`;
 const page=charts.map((s,i)=>`const D${i} = ${JSON.stringify(s+suffix)};`).join('\n')+charts.map((_,i)=>`<MermaidDiagram chart={D${i}} />`).join('');
 const result=audit(source,page);
 assert.equal(result.status,0);
 assert.deepEqual(result.data.counts.mermaidSources,{source:3,page:3});
 assert.equal(audit(source,page.replace('<MermaidDiagram chart={D1} />','')).status,1);
 assert.equal(audit(source,page.replace('chart={D0}','chart={D1}')).status,1);
});

test("ignores commented cards and does not apply unrelated CLASSDEFS to diagrams", () => {
 const chart='flowchart LR\nA --> B';
 const source=`<!-- <div class="diagram-card"><script type="text/plain">flowchart TD\nWRONG --> WRONG</script></div> --><div class="diagram-card"><div class="diagram-wrap"></div><script type="text/plain">${chart}</script></div><script>var CLASSDEFS = 'unused'; mermaid.render('id',src);</script>`;
 const page=`const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 assert.equal(audit(source,page).status,0);
 assert.equal(audit(source,'').status,1);
});

test("keeps literal dollar replacement sequences in diagram payloads and suffixes", () => {
 const chart = 'flowchart LR\nA["$$x$$ $& $` $\u0027"] --> B';
 const suffix = '\nclassDef box fill:#fff; %% $$suffix$$ $& $` $\u0027';
 const source = `<div class="diagram-card"><script type="text/plain">${chart}</script></div><script>const CLASSDEFS = ${JSON.stringify(suffix)}; mermaid.render('id', src + CLASSDEFS);</script>`;
 const page = `const D = ${JSON.stringify(chart + suffix)}; <MermaidDiagram chart={D} />`;
 assert.equal(audit(source, page).status, 0);
 assert.equal(audit(source, page.replace('$$x$$', '$x$')).status, 1);
});

test("does not classify alert icon names as callout content",()=>{
 const result=audit('<i class="ti ti-alert-triangle"></i><div class="callout">Keep warning</div>','<i className={styles.icon}></i><div className={styles.callout}>Keep warning</div>');
 assert.equal(result.status,0);
 assert.deepEqual(result.data.counts.calloutElements,{source:1,page:1});
 assert.equal(audit('<div class="callout">Keep warning</div>','<div>Keep warning</div>').status,1);
});

test("restores CLASSDEFS only from uncommented executable scripts", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const declaration = "const CLASSDEFS = '\\nclassDef box fill:#fff;';";
 const render = "mermaid.render('id', src + CLASSDEFS);";
 const page = value => `const D = ${JSON.stringify(value)}; <MermaidDiagram chart={D} />`;
 for (const example of [
  `<!-- <script>${render}</script> -->`,
  `<script>/* ${render} */</script>`,
  `<script>// ${render}\n</script>`,
  `<script type="text/plain">${render}</script>`,
 ]) {
  const source = `${card}<script>${declaration}</script>${example}`;
  assert.equal(audit(source, page(chart)).status, 0);
  assert.equal(audit(source, page(chart + '\nclassDef box fill:#fff;')).status, 1);
 }
 for (const decoy of [
  "<!-- <script>const CLASSDEFS = 'wrong';</script> -->",
  "<script>/* const CLASSDEFS = 'wrong'; */</script>",
  "<script>// const CLASSDEFS = 'wrong';\n</script>",
  `<script type="text/plain">const CLASSDEFS = 'wrong';</script>`,
 ]) {
  const source = `${card}${decoy}<script type="module">${declaration}${render}</script>`;
  assert.equal(audit(source, page(chart + '\nclassDef box fill:#fff;')).status, 0);
  assert.equal(audit(source, page(chart)).status, 1);
 }
});

test("selects the first qualifying payload after unrelated scripts in each card", () => {
 for (const kind of ['code-block', 'diagram-card']) {
  const value = kind === 'code-block' ? 'print("kept")' : 'flowchart LR\nA --> B';
  const display = kind === 'code-block' ? '<pre><code></code></pre>' : '';
  const page = kind === 'code-block'
   ? `<pre><code>{${JSON.stringify(value)}}</code></pre>`
   : `const D = ${JSON.stringify(value)}; <MermaidDiagram chart={D} />`;
  const source = `<div class="${kind}">${display}<script>setup();</script><script type="text/plain" data-for="elsewhere">wrong</script><script type="text/plain" data-for="">also wrong</script><script type="text/plain">${value}</script><script type="text/plain">last payload</script></div>`;
  assert.equal(audit(source, page).status, 0);
  assert.equal(audit(source, '').status, 1);
  assert.equal(audit(source, page.replace('kept', 'lost').replace('A --> B', 'A --> C')).status, 1);
 }
});
