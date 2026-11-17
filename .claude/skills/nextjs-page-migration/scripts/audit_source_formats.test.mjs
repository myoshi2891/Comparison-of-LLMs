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
 const source=charts.map(s=>`<div class="diagram-card"><div class="diagram-wrap"></div><script type="text/plain">${s}</script></div>`).join('')+`<script>var CLASSDEFS = '\\nclassDef hub fill:#fff;' + '\\nclassDef box color:#000;'; var cards = document.querySelectorAll('.diagram-card'); for (var i = 0; i < cards.length; i++) { var card = cards[i]; var src = card.querySelector('script').textContent; mermaid.render('x', src + CLASSDEFS); }</script>`;
 const page=charts.map((s,i)=>`const D${i} = ${JSON.stringify(s+suffix)};`).join('\n')+charts.map((_,i)=>`<MermaidDiagram chart={D${i}} />`).join('');
 const result=audit(source,page);
 assert.equal(result.status,0);
 assert.deepEqual(result.data.counts.mermaidSources,{source:3,page:3});
 assert.equal(audit(source,page.replace('<MermaidDiagram chart={D1} />','')).status,1);
 assert.equal(audit(source,page.replace('chart={D0}','chart={D1}')).status,1);
});

test("ignores commented cards and does not apply unrelated CLASSDEFS to diagrams", () => {
 const chart='flowchart LR\nA --> B';
 const source=`<!-- <div class="diagram-card"><script type="text/plain">flowchart TD\nWRONG --> WRONG</script></div> --><div class="diagram-card"><div class="diagram-wrap"></div><script type="text/plain">${chart}</script></div><script>const src = ${JSON.stringify(chart)}; var CLASSDEFS = 'unused'; mermaid.render('id',src);</script>`;
 const page=`const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 assert.equal(audit(source,page).status,0);
 assert.equal(audit(source,'').status,1);
});

test("keeps literal dollar replacement sequences in diagram payloads and suffixes", () => {
 const chart = 'flowchart LR\nA["$$x$$ $& $` $\u0027"] --> B';
 const suffix = '\nclassDef box fill:#fff; %% $$suffix$$ $& $` $\u0027';
 const source = `<div class="diagram-card"><script type="text/plain">${chart}</script></div><script>const src = ${JSON.stringify(chart)}; const CLASSDEFS = ${JSON.stringify(suffix)}; mermaid.render('id', src + CLASSDEFS);</script>`;
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
 const render = `const src = ${JSON.stringify(chart)}; mermaid.render('id', src + CLASSDEFS);`;
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

test("ignores quoted render examples and quoted CLASSDEFS declarations", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = '\nclassDef box fill:#fff;';
 const card = `<div class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const declaration = `const CLASSDEFS = ${JSON.stringify(suffix)};`;
 const render = `const src = ${JSON.stringify(chart)}; mermaid.render('id', src + CLASSDEFS);`;
 const page = value => `const D = ${JSON.stringify(value)}; <MermaidDiagram chart={D} />`;
 for (const example of [JSON.stringify(render), "'mermaid.render(id, src + CLASSDEFS)'", '`mermaid.render(id, src + CLASSDEFS)`']) {
  const source = `${card}<script>${declaration}${example};</script>`;
  assert.equal(audit(source, page(chart)).status, 0, example);
  assert.equal(audit(source, page(chart + suffix)).status, 1, example);
 }
 const source = `${card}<script>const example = "const CLASSDEFS = 'wrong';"; ${declaration}${render}</script>`;
 assert.equal(audit(source, page(chart + suffix)).status, 0);
 assert.equal(audit(source, page(chart + 'wrong')).status, 1);
});

test("materializes a card's data-code payload exactly once and keeps other code blocks", () => {
 const value = 'print("<schema> &lt;")';
 for (const attribute of ['data-code', 'data-code-src="1"']) {
  const source = `<div class="code-block"><pre><code></code><script type="text/plain" ${attribute}>${value}</script></pre></div><pre><code>other block</code></pre>`;
  const page = `<pre><code>{${JSON.stringify(value)}}</code></pre><pre><code>other block</code></pre>`;
  const result = audit(source, page);
  assert.equal(result.status, 0, attribute);
  assert.deepEqual(result.data.counts.codeBlocks, {source: 2, page: 2});
  assert.equal(audit(source, page.replace('other block', 'omitted')).status, 1);
  assert.equal(audit(source, page.replace('schema', 'omitted')).status, 1);
 }
});


test("accepts complete CLASSDEFS literals terminated by semicolons or ASI", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = '\nclassDef box fill:#fff;';
 const card = `<div class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = value => `const D = ${JSON.stringify(value)}; <MermaidDiagram chart={D} />`;
 for (const initializer of [JSON.stringify(suffix), `'\\nclassDef box ' +\n'fill:#fff;'`]) {
  for (const end of [';', '\n', ' // ASI\n']) {
   const source = `${card}<script>const src = ${JSON.stringify(chart)}; const CLASSDEFS = ${initializer}${end}mermaid.render('id', src + CLASSDEFS);</script>`;
   assert.equal(audit(source, page(chart + suffix)).status, 0, initializer + end);
   assert.equal(audit(source, page(chart)).status, 1, initializer + end);
  }
 }
 for (const tail of [' + dynamic;', '\n+ dynamic;', '\n.trim();', '\n[0];', '\n`tagged`;', '\n? "yes" : "no";', '\ninstanceof String;']) {
  const source = `${card}<script>const src = ${JSON.stringify(chart)}; const CLASSDEFS = ${JSON.stringify(suffix)}${tail}mermaid.render('id', src + CLASSDEFS);</script>`;
  const result = audit(source, page(chart));
  assert.equal(result.status, 1, tail);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:card-0']);
  assert.equal(audit(source, page(chart + suffix)).status, 1, tail);
 }
});

test("distinguishes an empty CLASSDEFS literal from an unresolved runtime initializer", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 assert.equal(audit(`${card}<script>const src = ${JSON.stringify(chart)}; const CLASSDEFS = ''; mermaid.render('id', src + CLASSDEFS);</script>`, page).status, 0);
 for (const declaration of ['', 'const CLASSDEFS = dynamic;', 'const CLASSDEFS = buildStyles();', 'const CLASSDEFS = `dynamic ${value}`;']) {
  const result = audit(`${card}<script>const src = ${JSON.stringify(chart)}; ${declaration} mermaid.render('id', src + CLASSDEFS);</script>`, page);
  assert.equal(result.status, 1, declaration);
  assert.equal(result.data.blocking, true);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
});

test("masks regex literals before their quotes can hide CLASSDEFS or render calls", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = '\nclassDef box fill:#fff;';
 const card = `<div class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = value => `const D = ${JSON.stringify(value)}; <MermaidDiagram chart={D} />`;
 for (const prefix of ['const quote = /"/;', "const quote = /'/;", 'const quote = /["/]/g;', String.raw`const quote = /\/'/;`, 'const ratio = total / count; const quote = /"/;', 'const ratio = {} / total / count; const quote = /"/;', 'if (ready) {} /"/.test(text);', 'const quote = /mermaid.render(id, src + CLASSDEFS)/;']) {
  const source = `${card}<script>const src = ${JSON.stringify(chart)}; ${prefix} const CLASSDEFS = ${JSON.stringify(suffix)}; mermaid.render('id', src + CLASSDEFS);</script>`;
  assert.equal(audit(source, page(chart + suffix)).status, 0, prefix);
  assert.equal(audit(source, page(chart)).status, 1, prefix);
 }
 const decoy = `${card}<script>const src = ${JSON.stringify(chart)}; const CLASSDEFS = ${JSON.stringify(suffix)}; const example = /mermaid.render(id, src + CLASSDEFS)/;</script>`;
 assert.equal(audit(decoy, page(chart)).status, 0);
 for (const expression of ['{} / (CLASSDEFS = "changed") / 2', 'function () {} / (CLASSDEFS = "changed") / 2']) {
  const source = `${card}<script>const src = ${JSON.stringify(chart)}; let CLASSDEFS = ''; const ratio = ${expression}; mermaid.render('id', src + CLASSDEFS);</script>`;
  const result = audit(source, page(chart));
  assert.equal(result.status, 1, expression);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:card-0']);
 }
});

test("materializes selected card payloads through quoted angle brackets in empty code attributes", () => {
 const value = 'print("<kept> &lt;")';
 for (const attributes of ['title="a>b"', "title='a>b'", 'title="<code>x>y"']) {
  const source = `<div class="code-block"><pre><code ${attributes}></code></pre><script type="text/plain" data-for="elsewhere">wrong</script><script type="text/plain">${value}</script><script type="text/plain">last payload</script></div>`;
  const page = `<pre><code>{${JSON.stringify(value)}}</code></pre>`;
  assert.equal(audit(source, page).status, 0, attributes);
  assert.deepEqual(audit(source, '').data.missingCodeBlocks, [value]);
  assert.equal(audit(source, page.replace('kept', 'lost')).status, 1, attributes);
 }
});


test("does not infer CLASSDEFS from code after a semicolon-free render call", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 const source = `${card}<script>const src = ${JSON.stringify(chart)}; const CLASSDEFS = '\\nclassDef box fill:#fff;'; mermaid.render('id', src)\nconsume(src + CLASSDEFS)</script>`;
 assert.equal(audit(source, page).status, 0);
 assert.equal(audit(source, '').status, 1);
});

test("ignores script-like text inside ordinary quoted tag attributes", () => {
 for (const quote of ['"', "'"]) {
  const source = `<div class="code-block"><span title=${quote}<script type=text/plain>wrong</script>${quote}></span><pre><code></code></pre><script type="text/plain">real payload</script></div>`;
  assert.equal(audit(source, '<pre><code>real payload</code></pre>').status, 0);
  assert.equal(audit(source, '<pre><code>wrong</code></pre>').status, 1);
 }
});

test("discovers owning cards through quoted greater-than attributes", () => {
 for (const quote of ['"', "'"]) {
  for (const kind of ['code-block', 'diagram-card']) {
   const value = kind === 'code-block' ? 'kept payload' : 'flowchart LR\nA --> B';
   const display = kind === 'code-block' ? '<pre><code></code></pre>' : '';
   const source = `<div title=${quote}a>b${quote} class="${kind}">${display}<script type="text/plain">${value}</script></div>`;
   const page = kind === 'code-block' ? '<pre><code>kept payload</code></pre>' : `const D = ${JSON.stringify(value)}; <MermaidDiagram chart={D} />`;
   assert.equal(audit(source, page).status, 0);
   assert.equal(audit(source, '').status, 1);
   if (kind === 'code-block') assert.deepEqual(audit(source, '').data.missingCodeBlocks, [value]);
  }
 }
});

test("resolves CLASSDEFS separately for renderer modules targeting different cards", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffixes = ['\nclassDef box fill:#fff;', '\nclassDef box fill:#000;'];
 const cards = [0, 1].map(i => `<div id="card-${i}" class="diagram-card"><script type="text/plain">${chart}</script></div>`).join('');
 const modules = suffixes.map((suffix, i) => `<script type="module">const CLASSDEFS = ${JSON.stringify(suffix)}; const card = document.querySelector('#card-${i}'); const src = card.querySelector('script').textContent; mermaid.render('id', src + CLASSDEFS);</script>`).join('');
 const page = values => values.map((value, i) => `const D${i} = ${JSON.stringify(chart + value)}; <MermaidDiagram chart={D${i}} />`).join('\n');
 assert.equal(audit(cards + modules, page(suffixes)).status, 0);
 assert.equal(audit(cards + modules, page([suffixes[0], suffixes[0]])).status, 1);
 assert.equal(audit(cards + modules, page([...suffixes].reverse())).status, 1);
});

test("blocks unestablished renderer associations including unsupported card selectors", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card" data-chart><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 for (const selector of ["'.diagram-card[data-chart]'", 'selector']) {
  const source = `${card}<script>const src = ${JSON.stringify(chart)}; const CLASSDEFS = '\\nclassDef box fill:#fff;'; document.querySelectorAll(${selector}); mermaid.render('id', src + CLASSDEFS);</script>`;
  const result = audit(source, page);
  assert.equal(result.status, 1);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['renderer:chart']);
 }
 const noSuffix = `${card}<script>const src = ${JSON.stringify(chart)}; document.querySelector('#chart'); mermaid.render('id', src);</script>`;
 assert.equal(audit(noSuffix, page).status, 0);
});

test("inserts card payload only into a real empty code element after a span title", () => {
 for (const quote of ['"', "'"]) {
  const source = `<div class="code-block"><span title=${quote}<code></code>${quote}></span><pre><code></code></pre><script type="text/plain">kept payload</script></div>`;
  const result = audit(source, '<pre><code>kept payload</code></pre>');
  assert.equal(result.status, 0);
  assert.deepEqual(audit(source, '').data.missingCodeBlocks, ['kept payload']);
 }
});

test("does not certify the initializer when CLASSDEFS is later reassigned", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = '\nclassDef box fill:#fff;';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart + suffix)}; <MermaidDiagram chart={D} />`;
 for (const assignment of ["CLASSDEFS = 'different';", 'CLASSDEFS = dynamic;', "CLASSDEFS += 'extra';"]) {
  const source = `${card}<script>const src = ${JSON.stringify(chart)}; let CLASSDEFS = ${JSON.stringify(suffix)}; ${assignment} mermaid.render('id', src + CLASSDEFS);</script>`;
  const result = audit(source, page);
  assert.equal(result.status, 1, assignment);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
});

test("inventories both child cards inside a matching wrapper with nearest payload ownership", () => {
 for (const kind of ['code-block', 'diagram-card']) {
  const values = kind === 'code-block' ? ['first payload', 'second payload'] : ['flowchart LR\nA --> B', 'flowchart LR\nC --> D'];
  const child = value => `<div class="${kind}">${kind === 'code-block' ? '<pre><code></code></pre>' : ''}<script type="text/plain">${value}</script></div>`;
  const source = `<div class="${kind}">${values.map(child).join('')}</div>`;
  const page = kind === 'code-block' ? values.map(v => `<pre><code>${v}</code></pre>`).join('') : values.map((v,i) => `const D${i} = ${JSON.stringify(v)}; <MermaidDiagram chart={D${i}} />`).join('\n');
  assert.equal(audit(source, page).status, 0, kind);
  assert.equal(audit(source, page.replace('second payload', 'omitted').replace('C --> D', 'C --> E')).status, 1, kind);
  if (kind === 'code-block') assert.deepEqual(audit(source, '').data.missingCodeBlocks, values);
  const parent = kind === 'code-block' ? 'parent payload' : 'flowchart LR\nE --> F';
  const parentSource = `<div class="${kind}">${kind === 'code-block' ? '<pre><code></code></pre>' : ''}${values.map(child).join('')}<script type="text/plain">${parent}</script></div>`;
  const parentPage = kind === 'code-block' ? `<pre><code>${parent}</code></pre>${page}` : `${page}\nconst P = ${JSON.stringify(parent)}; <MermaidDiagram chart={P} />`;
  assert.equal(audit(parentSource, parentPage).status, 0, `nearest owner: ${kind}`);
 }
});

test("decodes hexadecimal and Unicode CLASSDEFS escapes to runtime characters", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = value => `const D = ${JSON.stringify(value)}; <MermaidDiagram chart={D} />`;
 for (const [raw, suffix] of [
  [String.raw`\nclassDef box fill:\x23fff;`, '\nclassDef box fill:#fff;'],
  [String.raw`\nclassDef \u0062ox fill:#fff;`, '\nclassDef box fill:#fff;'],
  [String.raw`\nclassDef \u{62}ox fill:#fff;`, '\nclassDef box fill:#fff;'],
  [String.raw`\nclassDef box fill:#fff; %% \uD83D\uDE80`, '\nclassDef box fill:#fff; %% 🚀'],
 ]) {
  const source = `${card}<script>const src = ${JSON.stringify(chart)}; const CLASSDEFS = '${raw}'; mermaid.render('id', src + CLASSDEFS);</script>`;
  assert.equal(audit(source, page(chart + suffix)).status, 0, raw);
  assert.equal(audit(source, page(chart + raw)).status, 1, raw);
 }
 for (const raw of [String.raw`\xG1`, String.raw`\uZZZZ`, String.raw`\u{110000}`, String.raw`\1`]) {
  const source = `${card}<script>const src = ${JSON.stringify(chart)}; const CLASSDEFS = '${raw}'; mermaid.render('id', src + CLASSDEFS);</script>`;
  const result = audit(source, page(chart + raw));
  assert.equal(result.status, 1, raw);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
});

test("ignores tag-like attribute text while locating a card's sibling payload", () => {
 for (const quote of ['"', "'"]) {
  for (const text of ['</div>', '<div>']) {
   const source = `<div class="code-block"><span title=${quote}${text}${quote}></span><pre><code></code></pre><script type="text/plain">kept example</script></div>`;
   assert.equal(audit(source, '<pre><code>kept example</code></pre>').status, 0);
   assert.deepEqual(audit(source, '').data.missingCodeBlocks, ['kept example']);
  }
 }
});

test("does not certify an outer CLASSDEFS when a render binding is shadowed or out of scope", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = '\nclassDef box fill:#fff;';
 const declaration = `const CLASSDEFS = ${JSON.stringify(suffix)};`;
 const render = `const src = ${JSON.stringify(chart)}; mermaid.render('id', src + CLASSDEFS);`;
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart + suffix)}; <MermaidDiagram chart={D} />`;
 for (const body of [
  `${declaration} function draw(CLASSDEFS) { ${render} }`,
  `${declaration} const draw = CLASSDEFS => { ${render} };`,
  `${declaration} try { run(); } catch (CLASSDEFS) { ${render} }`,
  `function unrelated() { ${declaration} } ${render}`,
 ]) {
  const result = audit(`${card}<script>${body}</script>`, page);
  assert.equal(result.status, 1, body);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
 assert.equal(audit(`${card}<script>${declaration} function draw() { ${render} }</script>`, page).status, 0);
});

test("keeps separately parsed scripts apart before a following IIFE", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = '\nclassDef box fill:#fff;';
 const card = `<div class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const declaration = `const src = ${JSON.stringify(chart)}; const CLASSDEFS = ${JSON.stringify(suffix)}`;
 const iife = "(() => { mermaid.render('id', src + CLASSDEFS); })();";
 const page = `const D = ${JSON.stringify(chart + suffix)}; <MermaidDiagram chart={D} />`;
 assert.equal(audit(`${card}<script>${declaration}</script><script>${iife}</script>`, page).status, 0);
 assert.equal(audit(`${card}<script>${declaration}\n${iife}</script>`, page).status, 1);
});

test("only the diagram-source argument can contribute CLASSDEFS", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = '\nclassDef box fill:#fff;';
 const card = `<div class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const source = `${card}<script>const src = ${JSON.stringify(chart)}; const CLASSDEFS = ${JSON.stringify(suffix)}; mermaid.render(src + CLASSDEFS, src);</script>`;
 const page = value => `const D = ${JSON.stringify(value)}; <MermaidDiagram chart={D} />`;
 assert.equal(audit(source, page(chart)).status, 0);
 assert.equal(audit(source, page(chart + suffix)).status, 1);
});

test("handles parenthesized source contributions and blocks unsupported CLASSDEFS expressions", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = '\nclassDef box fill:#fff;';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const source = expression => `${card}<script>const src = ${JSON.stringify(chart)}; const CLASSDEFS = ${JSON.stringify(suffix)}; mermaid.render(makeId('a', 'b'), ${expression});</script>`;
 const page = value => `const D = ${JSON.stringify(value)}; <MermaidDiagram chart={D} />`;
 for (const expression of ['src + (CLASSDEFS)', '((src) + ((CLASSDEFS)))']) {
  assert.equal(audit(source(expression), page(chart + suffix)).status, 0);
  assert.equal(audit(source(expression), page(chart)).status, 1);
 }
 for (const expression of ['src.concat(CLASSDEFS)', 'src + transform(CLASSDEFS)']) {
  const result = audit(source(expression), page(chart));
  assert.equal(result.status, 1);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
});

test("does not certify CLASSDEFS before an invocation initializes it", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = '\nclassDef box fill:#fff;';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const declaration = `var CLASSDEFS = ${JSON.stringify(suffix)};`;
 const render = `const src = ${JSON.stringify(chart)}; mermaid.render('id', src + CLASSDEFS);`;
 const page = `const D = ${JSON.stringify(chart + suffix)}; <MermaidDiagram chart={D} />`;
 for (const body of [
  `draw(); ${declaration} function draw() { ${render} }`,
  `const early = draw; early(); ${declaration} function draw() { ${render} }`,
  `start(); ${declaration} function draw() { ${render} } function start() { draw(); }`,
  `start(); ${declaration} function start() { const draw = () => ${render} draw(); }`,
  `if (enabled) ${declaration} ${render}`,
  `function draw() { ${declaration} ${render} } draw();`,
 ]) {
  // The last case initializes within draw before rendering and is established.
  const result = audit(`${card}<script>${body}</script>`, page);
  assert.equal(result.status, body.startsWith('function draw') ? 0 : 1, body);
  assert.deepEqual(result.data.unresolvedMermaidSources, body.startsWith('function draw') ? [] : ['CLASSDEFS:chart']);
 }
});

test("rejects omitted runtime suffixes passed through source aliases", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = '\nclassDef box fill:#fff;';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 for (const body of [
  'const chart = src + CLASSDEFS; mermaid.render("id", chart);',
  'const first = src + CLASSDEFS; const chart = first; mermaid.render("id", chart);',
  'src += CLASSDEFS; mermaid.render("id", src);',
  'src += "changed"; mermaid.render("id", src + CLASSDEFS);',
  'let src = base; src = other; mermaid.render("id", src + CLASSDEFS);',
  '++src; mermaid.render("id", src + CLASSDEFS);',
  'const src = base + CLASSDEFS; mermaid.render("id", src);',
  'mermaid.render("id", buildChart());',
 ]) {
  const source = `${card}<script>const CLASSDEFS = ${JSON.stringify(suffix)}; ${body}</script>`;
  const result = audit(source, `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`);
  assert.equal(result.status, 1, body);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
});

test("keeps raw-text and RCDATA decoy scripts and cards opaque", () => {
 for (const tag of ['textarea', 'title', 'style', 'xmp', 'iframe', 'noembed', 'noframes', 'noscript']) {
  for (const decoy of [
   '<script type="text/plain">wrong</script>',
   '</div><div class="code-block"><pre><code></code></pre><script type="text/plain">wrong</script>',
   '<code></code><script type="text/plain" data-for="real">wrong</script>',
  ]) {
   const source = `<div class="code-block"><${tag}>${decoy}</${tag}><pre><code id="real"></code></pre><script type="text/plain">real payload</script></div>`;
   const result = audit(source, '<pre><code>real payload</code></pre>');
   assert.equal(result.status, 0, tag + decoy);
   assert.deepEqual(result.data.counts.codeBlocks, {source: 1, page: 1});
   assert.deepEqual(audit(source, '').data.missingCodeBlocks, ['real payload']);
   assert.equal(audit(source, '<pre><code>wrong</code></pre>').status, 1);
  }
 }
});

test("discovers mixed-case HTML card boundaries and inventories the payload", () => {
 const source = '<DiV class="code-block"><pre><code></code></PRE><script type="text/plain">mixed case example</script></dIv>';
 assert.equal(audit(source, '<pre><code>mixed case example</code></pre>').status, 0);
 assert.deepEqual(audit(source, '').data.missingCodeBlocks, ['mixed case example']);
});

test("rejects the base chart when a render template interpolates nonempty CLASSDEFS", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = '\nclassDef box fill:#fff;';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 for (const expression of ['`${src}${CLASSDEFS}`', 'src + `${CLASSDEFS}`', '`${src}${(CLASSDEFS)}`']) {
  const source = `${card}<script>const CLASSDEFS = ${JSON.stringify(suffix)}; mermaid.render('id', ${expression});</script>`;
  for (const value of [chart, chart + suffix]) {
   const result = audit(source, `const D = ${JSON.stringify(value)}; <MermaidDiagram chart={D} />`);
   assert.equal(result.status, 1, expression);
   assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
  }
 }
});

test("materializes empty code with whitespace before the closing tag delimiter", () => {
 for (const closing of ['</code >', '</CODE\t>', '</code\n>']) {
  const source = `<div class="code-block"><pre><code>${closing}</pre><script type="text/plain">print("kept")</script></div>`;
  const empty = audit(source, '<pre><code></code></pre>');
  assert.equal(empty.status, 1);
  assert.deepEqual(empty.data.missingCodeBlocks, ['print("kept")']);
  assert.equal(audit(source, '<pre><code>{\'print("kept")\'}</code></pre>').status, 0);
 }
});

test("verifies render literals against the owning card payload", () => {
 const chart = 'flowchart LR\nA --> B';
 const other = 'flowchart LR\nX --> Y';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 const unrelated = audit(`${card}<script>const src = ${JSON.stringify(chart)}; mermaid.render('id', 'src + CLASSDEFS');</script>`, page);
 assert.equal(unrelated.status, 1);
 assert.deepEqual(unrelated.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 for (const quote of ['"', "'", '`']) {
  const literal = value => quote + value.replace(/\n/g, '\\n') + quote;
  assert.equal(audit(`${card}<script>mermaid.render('id', ${literal(chart)});</script>`, page).status, 0);
  const result = audit(`${card}<script>mermaid.render('id', ${literal(other)});</script>`, page);
  assert.equal(result.status, 1);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
});

test("does not apply a suffixed call to suffix-free calls in the same scope", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = '\nclassDef box fill:#fff;';
 const cards = ['one', 'two'].map(id => `<div id="${id}" class="diagram-card"><script type="text/plain">${chart}</script></div>`).join('');
 for (const calls of [
  'mermaid.render("a", src); mermaid.render("b", src + CLASSDEFS);',
  'mermaid.render("b", src + CLASSDEFS); mermaid.render("a", src);',
 ]) {
  const source = `${cards}<script>const CLASSDEFS = ${JSON.stringify(suffix)}; const src = ${JSON.stringify(chart)}; document.querySelector('#one'); document.querySelector('#two'); ${calls}</script>`;
  const page = ['D1', 'D2'].map(id => `const ${id} = ${JSON.stringify(chart + suffix)}; <MermaidDiagram chart={${id}} />`).join('');
  const result = audit(source, page);
  assert.equal(result.status, 1);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:one', 'CLASSDEFS:two']);
 }
});

test("keeps executable template interpolations unresolved through scope discovery", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 for (const expression of [
  '`text ${mermaid.render("id", src + CLASSDEFS)}`',
  '`text ${`nested ${mermaid.render("id", src + CLASSDEFS)}`}`',
  '`text ${renderChart()}`',
  '`text ${({ key: "}" }, mermaid.render("id", src + CLASSDEFS))}`',
 ]) {
  const result = audit(`${card}<script>const CLASSDEFS = '\\nclassDef box fill:#fff;'; const result = ${expression};</script>`, page);
  assert.equal(result.status, 1, expression);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
 const literal = `${card}<script>const src = ${JSON.stringify(chart)}; const example = \`literal mermaid.render("id", src + CLASSDEFS)\`;</script>`;
 assert.equal(audit(literal, page).status, 0);
});

test("rejects comment-only migrated code instead of accepting an undisplayed card payload", () => {
 const payload = 'print("kept")';
 for (const comment of ['<!-- placeholder -->', '<!-- <code></code> -->', '<!-- first -->\n<!-- second -->']) {
  const source = `<div class="code-block"><pre><code>${comment}</code></pre><script type="text/plain">${payload}</script></div>`;
  const result = audit(source, `<pre><code>${comment}</code></pre>`);
  assert.equal(result.status, 1, comment);
  assert.deepEqual(result.data.missingCodeBlocks, [payload]);
  assert.equal(audit(source, `<pre><code>{${JSON.stringify(payload)}}</code></pre>`).status, 0);
 }
});

test("rejects shadowed or unestablished src bindings and accepts the selected script initializer", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = '\nclassDef box fill:#fff;';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 for (const addition of ['', ' + CLASSDEFS']) {
  const page = `const D = ${JSON.stringify(chart + (addition ? suffix : ''))}; <MermaidDiagram chart={D} />`;
  for (const body of [
   `mermaid.render('id', src${addition});`,
   `function draw(src) { mermaid.render('id', src${addition}); } draw('other');`,
   `const draw = (src) => { mermaid.render('id', src${addition}); }; draw('other');`,
   `const draw = src => { mermaid.render('id', src${addition}); }; draw('other');`,
   `const src = 'other'; mermaid.render('id', src${addition});`,
   `const src = readUnknown(); mermaid.render('id', src${addition});`,
   `const src = ${JSON.stringify(chart)}; function draw(src) { mermaid.render('id', src${addition}); }`,
   `function unrelated() { const src = ${JSON.stringify(chart)}; } mermaid.render('id', src${addition});`,
   `const card = document.querySelector('#other'); const src = card.querySelector('script').textContent; mermaid.render('id', src${addition});`,
   `const card = document.querySelector('#chart'); function draw(card) { const src = card.querySelector('script').textContent; mermaid.render('id', src${addition}); }`,
   `const card = document.querySelector('#chart'); card = other; const src = card.querySelector('script').textContent; mermaid.render('id', src${addition});`,
  ]) {
   const result = audit(`${card}<script>const CLASSDEFS = ${JSON.stringify(suffix)}; ${body}</script>`, page);
   assert.equal(result.status, 1, body);
   assert.deepEqual(result.data.unresolvedMermaidSources, [body.includes("querySelector('#other')") ? 'renderer:chart' : 'CLASSDEFS:chart']);
  }
  const source = `${card}<script>const CLASSDEFS = ${JSON.stringify(suffix)}; const card = document.querySelector('#chart'); const src = card.querySelector('script[type="text/plain"]').textContent; mermaid.render('id', src${addition});</script>`;
  assert.equal(audit(source, page).status, 0, addition);
  const wrongScript = source.replace('<script type="text/plain">', '<script type="text/plain" data-for="other">flowchart LR\nX --> Y</script><script type="text/plain">');
  const result = audit(wrongScript, page);
  assert.equal(result.status, 1);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
});

test("requires src initialization to execute before rendering", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const init = `var src = ${JSON.stringify(chart)};`;
 for (const suffix of ['', ' + CLASSDEFS']) {
  const render = `mermaid.render('id', src${suffix});`;
  const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
  for (const body of [
   `if (enabled) ${init} ${render}`,
   `while (enabled) ${init} ${render}`,
   `draw(); ${init} function draw() { ${render} }`,
   `const early = draw; early(); ${init} function draw() { ${render} }`,
  ]) {
   const result = audit(`${card}<script>const CLASSDEFS = ''; ${body}</script>`, page);
   assert.equal(result.status, 1, body);
   assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
  }
  for (const body of [
   `${init} ${render}`,
   `function draw() { ${init} ${render} } draw();`,
   `${init} function draw() { ${render} } draw();`,
   `if (enabled) { ${init} ${render} }`,
  ]) assert.equal(audit(`${card}<script>const CLASSDEFS = ''; ${body}</script>`, page).status, 0, body);
 }
});

test("uses descendant script order for runtime selection while retaining nearest-card ownership", () => {
 const parent = 'flowchart LR\nP --> Q';
 const child = 'flowchart LR\nA --> B';
 const page = [child, parent].map((s,i) => `const D${i} = ${JSON.stringify(s)}; <MermaidDiagram chart={D${i}} />`).join('');
 for (const selector of ['script', 'script[type="text/plain"]']) {
  const runtime = `<script>const card = document.querySelector('#parent'); const src = card.querySelector('${selector}').textContent; mermaid.render('id', src);</script>`;
  const nested = `<div id="child" class="diagram-card"><script type="text/plain">${child}</script></div>`;
  const own = `<script type="text/plain">${parent}</script>`;
  const result = audit(`<div id="parent" class="diagram-card">${nested}${own}</div>${runtime}`, page);
  assert.equal(result.status, 1, selector);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:parent', 'renderer:child']);
  const ownFirst = audit(`<div id="parent" class="diagram-card">${own}${nested}</div>${runtime}`, page);
  assert.deepEqual(ownFirst.data.unresolvedMermaidSources, ['renderer:child']);
 }
});

test("requires document-wide uniqueness for selected card elements", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 for (const selector of ['#chart', '.diagram-card']) {
  const runtime = `<script>const card = document.querySelector('${selector}'); const src = card.querySelector('script').textContent; mermaid.render('id', src);</script>`;
  for (const decoy of [
   '<section id="chart" class="diagram-card-other"></section>',
   '<aside id="chart" class="diagram-card"></aside>',
   '<textarea id="chart" class="diagram-card">text</textarea>',
   '<script id="chart" class="diagram-card" type="text/plain">other</script>',
  ]) {
   if (selector === '.diagram-card' && decoy.includes('diagram-card-other')) continue;
   const result = audit(decoy + card + runtime, page);
   assert.equal(result.status, 1, selector + decoy);
   assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
  }
  assert.equal(audit(card + runtime, page).status, 0);
 }
});

test("does not certify stale script textContent after observed writes", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 for (const write of [
  'script.textContent = "flowchart LR\\nX --> Y";',
  'script.textContent += "changed";',
  'const alias = script; alias.textContent = other;',
  'let alias = script; if (enabled) alias = other; alias.textContent = other;',
  'let alias; alias = script; alias.textContent = other;',
  'card.querySelector("script").textContent = other;',
  'if (enabled) { script.textContent = other; }',
  'if (enabled) { const alias = script; alias.textContent = other; }',
 ]) {
  const source = `${card}<script>const card = document.querySelector('#chart'); const script = card.querySelector('script'); ${write} const src = script.textContent; mermaid.render('id', src);</script>`;
  const result = audit(source, page);
  assert.equal(result.status, 1, write);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
 const source = `${card}<script>const card = document.querySelector('#chart'); const script = card.querySelector('script'); const src = script.textContent; mermaid.render('id', src);</script>`;
 assert.equal(audit(source, page).status, 0);
});

test("keeps computed mermaid render calls unresolved instead of certifying the base payload", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 const head = "const CLASSDEFS = '\\nclassDef hub fill:#fff;'; const card = document.querySelector('#chart'); const src = card.querySelector('script').textContent;";
 for (const call of ["mermaid['render']('id', src + CLASSDEFS);", 'mermaid["render"]("id", src + CLASSDEFS);', 'mermaid[name]("id", src + CLASSDEFS);']) {
  const result = audit(`${card}<script>${head} ${call}</script>`, page);
  assert.equal(result.status, 1, call);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart'], call);
 }
});

test("checks payload textContent writes across separate module scopes", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 const renderer = "const card = document.querySelector('#chart'); const src = card.querySelector('script').textContent; mermaid.render('id', src);";
 const writer = "document.querySelector('#chart script').textContent = 'flowchart LR\\nX --> Y';";
 for (const [writerType, rendererType] of [['module', 'module'], ['module', ''], ['', 'module']]) {
  const tag = type => (type ? `<script type="${type}">` : '<script>');
  // 書き込み側にレンダラーがなくても、別スコープの読み取りに影響し得る。
  const source = `${card}${tag(writerType)}${writer}</script>${tag(rendererType)}${renderer}</script>`;
  const result = audit(source, page);
  assert.equal(result.status, 1, source);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart'], source);
 }
 // textContent を書き込まない別モジュールは認定を妨げない。
 assert.equal(audit(`${card}<script type="module">console.log('ready');</script><script type="module">${renderer}</script>`, page).status, 0);
});

const canonicalDedent = `function dedent(text) {
        var lines = text.replace(/^\\n+/, '').replace(/\\s+$/, '').split('\\n');
        var min = Infinity;
        lines.forEach(function (l) { if (!l.trim()) return; var m = l.match(/^[ \\t]*/)[0].length; if (m < min) min = m; });
        if (!isFinite(min) || min === 0) return lines.join('\\n');
        return lines.map(function (l) { return l.slice(min); }).join('\\n');
      }`;

test("treats destructuring and later writes to src or its sources as unresolved", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 const init = `let src = ${JSON.stringify(chart)};`;
 const select = `const card = document.querySelector('#chart'); const script = card.querySelector('script');`;
 for (const body of [
  // 分割代入・for...of は初期化子の値を書き換える。
  `${init} [src] = ['flowchart LR\\nX --> Y']; mermaid.render('id', src);`,
  `${init} [[src]] = [[other]]; mermaid.render('id', src);`,
  `${init} ({ src } = other); mermaid.render('id', src);`,
  `${init} ({ key: src } = other); mermaid.render('id', src);`,
  `${init} for (src of others) {} mermaid.render('id', src);`,
  // 遅延実行の render より前に、文書上は後ろの書き込みが走りうる。
  `${init} function draw() { mermaid.render('id', src); } src = other; draw();`,
  `${init} button.addEventListener('click', function () { mermaid.render('id', src); }); src = other;`,
  `${select} const src = script.textContent; function draw() { mermaid.render('id', src); } script.textContent = other; draw();`,
  `${select} function draw() { const src = script.textContent; mermaid.render('id', src); } script.textContent = other; draw();`,
  `const card = document.querySelector('#chart'); function draw() { const src = card.querySelector('script').textContent; mermaid.render('id', src); } card = other; draw();`,
  // 別ブロックの var 再宣言は関数スコープの同じ変数へ書き込む。
  `var src = ${JSON.stringify(chart)}; function draw() { mermaid.render('id', src); } if (enabled) { var src = other; } draw();`,
 ]) {
  const result = audit(`${card}<script>${body}</script>`, page);
  assert.equal(result.status, 1, body);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
 for (const body of [
  `${init} mermaid.render('id', src);`,
  `${init} items[0] = src; mermaid.render('id', src);`,
  `${select} function draw() { const src = script.textContent; mermaid.render('id', src); } button.textContent = 'copy'; draw();`,
 ]) assert.equal(audit(`${card}<script>${body}</script>`, page).status, 0, body);
});

test("requires the dedent call to bind the canonical helper", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 const select = `const card = document.querySelector('#chart'); const script = card.querySelector('script');`;
 const use = `${select} const src = dedent(script.textContent); mermaid.render('id', src);`;
 for (const body of [
  `${canonicalDedent} ${use} function dedent(t) { return 'x'; }`,
  `${canonicalDedent} dedent = function (t) { return 'x'; }; ${use}`,
  `${canonicalDedent} [dedent] = [other]; ${use}`,
  `${canonicalDedent} function draw(dedent) { ${use} } draw(other);`,
  `${canonicalDedent} function draw() { var dedent = other; ${use} } draw();`,
  `function wrap() { ${canonicalDedent} } ${use}`,
 ]) {
  const result = audit(`${card}<script>${body}</script>`, page);
  assert.equal(result.status, 1, body);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
 assert.equal(audit(`${card}<script>${canonicalDedent} ${use}</script>`, page).status, 0);
});

test("does not accept helper variants that change whitespace inside literals", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 const select = `const card = document.querySelector('#chart'); const script = card.querySelector('script');`;
 const use = `${select} const src = dedent(script.textContent); mermaid.render('id', src);`;
 for (const variant of [
  // 結合区切り・分割区切りに空白を足す、正規表現リテラル内の空白を変える。
  canonicalDedent.replaceAll(".join('", ".join(' "),
  canonicalDedent.replace("split('", "split(' "),
  canonicalDedent.replace("[ ", "[  "),
 ]) {
  assert.notEqual(variant, canonicalDedent);
  const result = audit(`${card}<script>${variant} ${use}</script>`, page);
  assert.equal(result.status, 1, variant);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
 assert.equal(audit(`${card}<script>${canonicalDedent.replace(/ {2,}/g, '  ')} ${use}</script>`, page).status, 0);
});

test("requires the indexed card read to run inside the matching loop", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 const cls = "";
 const loop = 'for (var i = 0; i < cards.length; i++) {';
 const pick = "var card = cards[i]; var src = card.querySelector('script').textContent; mermaid.render('x', src);";
 const cards = "var cards = document.querySelectorAll('.diagram-card');";
 assert.equal(audit(`${card}<script>${cls} ${cards} ${loop} ${pick} }</script>`, page).status, 0);
 for (const body of [
  // 一致するループが別の場所にあるだけで、読み取りはループの外。
  `${cls} ${cards} var i = 0; ${pick} ${loop} }`,
  `${cls} ${cards} ${loop} } var i = 0; ${pick}`,
  // ループ本体が一部だけを含む場合も、読み取りが本体の外なら認めない。
  `${cls} ${cards} ${loop} var card = cards[i]; } var src = card.querySelector('script').textContent; mermaid.render('x', src);`,
 ]) {
  const result = audit(`${card}<script>${body}</script>`, page);
  assert.equal(result.status, 1, body);
 }
});

test("rejects traversal index writes inside the card loop body", () => {
 const charts = ['flowchart LR\nA --> B', 'flowchart TD\nC --> D'];
 const source = charts.map(s => `<div class="diagram-card"><script type="text/plain">${s}</script></div>`).join('');
 const page = charts.map((s, i) => `const D${i} = ${JSON.stringify(s)};`).join('\n') + charts.map((_, i) => `<MermaidDiagram chart={D${i}} />`).join('');
 const cards = "var cards = document.querySelectorAll('.diagram-card');";
 const loop = 'for (var i = 0; i < cards.length; i++) {';
 const render = "var src = card.querySelector('script').textContent; mermaid.render('x', src);";
 assert.equal(audit(`${source}<script>${cards} ${loop} var card = cards[i]; ${render} }</script>`, page).status, 0);
 for (const body of [
  // 本体内の増分で2枚目のカードを読み飛ばす。
  `${cards} ${loop} var card = cards[i]; i++; ${render} }`,
  `${cards} ${loop} var card = cards[i]; i += 1; ${render} }`,
  `${cards} ${loop} var card = cards[i]; ${render} i = cards.length; }`,
 ]) {
  const result = audit(`${source}<script>${body}</script>`, page);
  assert.equal(result.status, 1, body);
 }
});

test("rejects deferred reads of shared var card bindings inside the card loop", () => {
 const charts = ['flowchart LR\nA --> B', 'flowchart TD\nC --> D'];
 const source = charts.map(s => `<div class="diagram-card"><script type="text/plain">${s}</script></div>`).join('');
 const page = charts.map((s, i) => `const D${i} = ${JSON.stringify(s)};`).join('\n') + charts.map((_, i) => `<MermaidDiagram chart={D${i}} />`).join('');
 const cards = "var cards = document.querySelectorAll('.diagram-card');";
 const loop = 'for (var i = 0; i < cards.length; i++) {';
 const read = "card.querySelector('script').textContent";
 // let は反復ごとに束縛されるため、遅延コールバックでも各カードを読む。
 assert.equal(audit(`${source}<script>${cards} ${loop} let card = cards[i]; setTimeout(function () { var src = ${read}; mermaid.render('x', src); }); }</script>`, page).status, 0);
 for (const body of [
  // 共有の var はコールバック実行時に最後のカードを指し、両図を最後のpayloadとして認定しかねない。
  `${cards} ${loop} var card = cards[i]; setTimeout(function () { var src = ${read}; mermaid.render('x', src); }); }`,
  `${cards} ${loop} var card = cards[i]; var src = ${read}; setTimeout(function () { mermaid.render('x', src); }); }`,
  // コールバック内でインデックス（var）を読む場合も反復固有ではない。
  `${cards} ${loop} setTimeout(function () { let card = cards[i]; let src = ${read}; mermaid.render('x', src); }); }`,
 ]) {
  const result = audit(`${source}<script>${body}</script>`, page);
  assert.equal(result.status, 1, body);
 }
});

test("rejects early exits from the card loop body", () => {
 const charts = ['flowchart LR\nA --> B', 'flowchart TD\nC --> D'];
 const source = charts.map(s => `<div class="diagram-card"><script type="text/plain">${s}</script></div>`).join('');
 const page = charts.map((s, i) => `const D${i} = ${JSON.stringify(s)};`).join('\n') + charts.map((_, i) => `<MermaidDiagram chart={D${i}} />`).join('');
 const cards = "var cards = document.querySelectorAll('.diagram-card');";
 const loop = 'for (var i = 0; i < cards.length; i++) {';
 const render = "var card = cards[i]; var src = card.querySelector('script').textContent; mermaid.render('x', src);";
 for (const body of [
  // 1枚目の描画後に抜け、2枚目を訪問しない。
  `${cards} ${loop} ${render} break; }`,
  `${cards} function draw() { ${loop} ${render} return; } } draw();`,
  `${cards} ${loop} ${render} throw new Error('stop'); }`,
 ]) {
  const result = audit(`${source}<script>${body}</script>`, page);
  assert.equal(result.status, 1, body);
 }
 // continue は次の添字へ進むため、全カードの訪問は維持される（Fable原本のガード節）。
 assert.equal(audit(`${source}<script>${cards} ${loop} var card = cards[i]; var srcEl = card.querySelector('script'); if (!srcEl) continue; var src = srcEl.textContent; mermaid.render('x', src); }</script>`, page).status, 0);
});

test("keeps ASI-relevant line terminators in the dedent helper comparison", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 const select = `const card = document.querySelector('#chart'); const script = card.querySelector('script');`;
 const use = `${select} const src = dedent(script.textContent); mermaid.render('id', src);`;
 // return の直後の改行は自動セミコロン挿入で undefined を返す別関数になる。
 const variant = canonicalDedent.replace("min === 0) return lines.join", "min === 0) return\n          lines.join");
 assert.notEqual(variant, canonicalDedent);
 const result = audit(`${card}<script>${variant} ${use}</script>`, page);
 assert.equal(result.status, 1);
 assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 assert.equal(audit(`${card}<script>${canonicalDedent} ${use}</script>`, page).status, 0);
 // メソッドチェーン前の改行はASIに影響しないため、正規の別レイアウトとして認める。
 const chained = canonicalDedent.replace("return lines.map(", "return lines\n          .map(");
 assert.notEqual(chained, canonicalDedent);
 assert.equal(audit(`${card}<script>${chained} ${use}</script>`, page).status, 0);
});

test("keeps scopes whose renderer may be hidden by an uncertain slash", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 const pre = `const CLASSDEFS = '\\nclassDef box fill:#fff;'; const src = ${JSON.stringify(chart)};`;
 // 関数宣言後の正規表現を除算と見なすと、引用符が文字列として render を隠す。
 for (const body of [
  `function f() {}\n/'/.test(s); mermaid.render('id', src + CLASSDEFS);`,
  `function f() {} /'/.test(s); mermaid.render('id', src + CLASSDEFS);`,
  `function f() {}\n/"/.test(s); mermaid.render("id", src + CLASSDEFS);`,
 ]) {
  const result = audit(`${card}<script>${pre} ${body}</script>`, page);
  assert.equal(result.status, 1, body);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
});

test("resolves aliases at their initializer instead of the later reference", () => {
 const chart = 'flowchart LR\nA --> B';
 const other = 'flowchart LR\nX --> Y';
 const cards = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div><div id="other" class="diagram-card"><script type="text/plain">${other}</script></div>`;
 const page = [chart, other].map((s, i) => `const D${i} = ${JSON.stringify(s)}; <MermaidDiagram chart={D${i}} />`).join('');
 const draw = (inner) => `function draw() { const card = document.querySelector('${inner}'); const src = script.textContent; mermaid.render('id', src); } draw();`;
 // script は外側の card（#other）で初期化され、内側の card は参照しない。
 const result = audit(`${cards}<script>const card = document.querySelector('#other'); const script = card.querySelector('script'); ${draw('#chart')}</script>`, page);
 assert.equal(result.status, 1);
 assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 const mirrored = audit(`${cards}<script>const card = document.querySelector('#chart'); const script = card.querySelector('script'); ${draw('#other')}</script>`, page);
 assert.equal(mirrored.status, 1);
 assert.deepEqual(mirrored.data.unresolvedMermaidSources, ['CLASSDEFS:other']);
 for (const uninitialized of [
  `const src = ${JSON.stringify(chart)}; function draw() { let src; mermaid.render('id', src); } draw();`,
  `const card = document.querySelector('#chart'); const script = card.querySelector('script'); function draw() { let script; const src = script.textContent; mermaid.render('id', src); } draw();`,
 ]) {
  const shadowed = audit(`<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div><script>${uninitialized}</script>`, `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`);
  assert.equal(shadowed.status, 1, uninitialized);
  assert.deepEqual(shadowed.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
 }
});

test("does not treat division after an ordinary of identifier as a regex literal", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 const source = `${card}<script>let src = ${JSON.stringify(chart)}; const x = of / 2 + (src = other) / 2; mermaid.render('id', src);</script>`;
 const result = audit(source, page);
 assert.equal(result.status, 1);
 assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
});

test("does not split a Unicode identifier into a keyword before a division", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 // πreturn は1つの識別子。return と誤認すると後続の除算が正規表現として src の書き込みを隠す。
 for (const name of ['πreturn', 'élse', 'ℵtypeof']) {
  const source = `${card}<script>let src = ${JSON.stringify(chart)}; const x = ${name} / 2 + (src = other) / 2; mermaid.render('id', src);</script>`;
  const result = audit(source, page);
  assert.equal(result.status, 1, name);
  assert.deepEqual(result.data.unresolvedMermaidSources, ['CLASSDEFS:chart'], name);
 }
});

test("keeps literal sources certifiable despite textContent writes in other scopes", () => {
 const chart = 'flowchart LR\nA --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const page = `const D = ${JSON.stringify(chart)}; <MermaidDiagram chart={D} />`;
 const writer = "<script type=\"module\">document.querySelector('#chart script').textContent = 'flowchart LR\\nX --> Y';</script>";
 // リテラルのソースは DOM 書き込みの影響を受けないため認定できる。
 for (const renderer of [
  `const src = ${JSON.stringify(chart)}; mermaid.render('id', src);`,
  `mermaid.render('id', ${JSON.stringify(chart)});`,
 ]) {
  const result = audit(`${card}${writer}<script type="module">${renderer}</script>`, page);
  assert.equal(result.status, 0, renderer);
  assert.deepEqual(result.data.unresolvedMermaidSources, [], renderer);
 }
 // payload を読むソースは引き続き未解決とする。
 const domRead = "const card = document.querySelector('#chart'); const src = card.querySelector('script').textContent; mermaid.render('id', src);";
 const blocked = audit(`${card}${writer}<script type="module">${domRead}</script>`, page);
 assert.equal(blocked.status, 1);
 assert.deepEqual(blocked.data.unresolvedMermaidSources, ['CLASSDEFS:chart']);
});

test("decodes entity-bearing text/plain payloads through the same path as TSX charts", () => {
 const chart = 'flowchart LR\nA["x &amp; y &lt;b&gt;"] --> B';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}</script></div>`;
 const renderer = "<script>const card = document.querySelector('#chart'); const src = card.querySelector('script').textContent; mermaid.render('id', src);</script>";
 const page = value => `const D = ${JSON.stringify(value)}; <MermaidDiagram chart={D} />`;
 assert.equal(audit(`${card}${renderer}`, page(chart)).status, 0);
 assert.equal(audit(`${card}${renderer}`, page(chart.replace("y", "z"))).status, 1);
 assert.equal(audit(`${card}${renderer}`, page(chart.replace("&lt;b&gt;", "&lt;i&gt;"))).status, 1);
});

test("preserves payload trailing newline before CLASSDEFS unless using the validated dedent helper", () => {
 const chart = 'flowchart LR\nA --> B';
 const suffix = 'classDef box fill:#fff;';
 const card = `<div id="chart" class="diagram-card"><script type="text/plain">${chart}\n</script></div>`;
 const select = `const card = document.querySelector('#chart'); const script = card.querySelector('script'); const CLASSDEFS = ${JSON.stringify(suffix)};`;
 const rawSource = `${card}<script>${canonicalDedent} ${select} const src = script.textContent; mermaid.render('id', src + CLASSDEFS);</script>`;
 const separateLines = `const D = ${JSON.stringify(`${chart}\n${suffix}`)}; <MermaidDiagram chart={D} />`;
 const joinedLine = `const D = ${JSON.stringify(`${chart}${suffix}`)}; <MermaidDiagram chart={D} />`;
 assert.equal(audit(rawSource, separateLines).status, 0);
 assert.equal(audit(rawSource, joinedLine).status, 1);
 const dedentedSource = `${card}<script>${canonicalDedent} ${select} const src = dedent(script.textContent); mermaid.render('id', src + CLASSDEFS);</script>`;
 assert.equal(audit(dedentedSource, joinedLine).status, 0);
 assert.equal(audit(dedentedSource, separateLines).status, 1);
});
