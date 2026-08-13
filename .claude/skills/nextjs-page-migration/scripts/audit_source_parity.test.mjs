import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const auditScript = new URL("./audit_source_parity.mjs", import.meta.url);

function audit(source, page) {
  const fixtureDir = mkdtempSync(join(tmpdir(), "source-parity-"));
  const sourcePath = join(fixtureDir, "source.html");
  const pagePath = join(fixtureDir, "page.tsx");
  writeFileSync(sourcePath, source);
  writeFileSync(pagePath, page);

  const result = spawnSync(process.execPath, [auditScript.pathname, sourcePath, pagePath, "--json"], {
    encoding: "utf8",
  });
  rmSync(fixtureDir, { recursive: true, force: true });

  return {
    status: result.status,
    json: JSON.parse(result.stdout),
  };
}

test("compares heading level and occurrence count while allowing source h2 to become page h1", () => {
  const result = audit(
    "<h2>Overview</h2><h2>Repeated</h2><h2>Repeated</h2><h3>Details</h3>",
    "<h1>Overview</h1><h2>Repeated</h2><h2>Details</h2>"
  );

  assert.equal(result.status, 1);
  assert.deepEqual(result.json.missingHeadings, [
    { level: 2, text: "Repeated" },
    { level: 3, text: "Details" },
  ]);
  assert.deepEqual(result.json.extraHeadings, [{ level: 2, text: "Details" }]);
});

test("treats normalized code blocks and table rows as blocking parity elements", () => {
  const matching = audit(
    `<pre><code><span>npm</span> test</code></pre>
     <table><tr><th>Name</th><th>Value</th></tr></table>`,
    `<pre><span>npm</span>{" "}test</pre>
     <table><tbody><tr><th>Name</th><th>Value</th></tr></tbody></table>`
  );
  assert.equal(matching.status, 0);
  assert.deepEqual(matching.json.missingCodeBlocks, []);
  assert.deepEqual(matching.json.missingTableRows, []);

  const missing = audit(
    `<pre>npm test</pre><pre>npm test</pre>
     <table><tr><td>A</td></tr><tr><td>A</td></tr></table>`,
    `<pre>npm test</pre><table><tr><td>A</td></tr></table>`
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
