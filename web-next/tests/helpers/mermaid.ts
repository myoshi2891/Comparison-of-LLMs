/**
 * Mermaid ソース比較用の共通正規化ヘルパー。
 *
 * `.claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs` の
 * `normalizeMermaidSource` と同一の規則で、改行コード・外側の空行・共通インデント
 * のみを揃える（インデントは Mermaid の構文上意味を持つため相対関係は保つ）。
 *
 * 期待値側もこのヘルパーで正規化してから比較すること。テンプレートリテラルの
 * 字下げ量はテストファイルの整形で変わりうるため、片側だけ正規化すると
 * 「実装は正しいのに整形で落ちる」テストになる。
 */
export function normalizeMermaidSource(raw: string): string {
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  while (lines.length > 0 && lines[0].trim() === "") lines.shift();
  while (lines.length > 0 && lines.at(-1)?.trim() === "") lines.pop();
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const commonIndent = indents.length > 0 ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(commonIndent).trimEnd()).join("\n");
}
