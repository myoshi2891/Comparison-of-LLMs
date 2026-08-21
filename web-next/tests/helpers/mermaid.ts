/**
 * Mermaid ソースを比較用に正規化する。
 *
 * 改行コードを LF に統一し、外側の空行と各行末の空白を削除する。
 * 共通インデントを除去し、行間の相対的なインデントは保持する。
 *
 * @param raw - 正規化する Mermaid ソース
 * @returns 正規化された Mermaid ソース
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
