/**
 * shared RSS utility module
 */

/** フィードに載せる最大件数（新着 20 件）。 */
export const MAX_ITEMS = 20;

/**
 * Escapes XML-reserved characters in text.
 *
 * @param value - Raw text that may contain XML-reserved characters
 * @returns The text with `&`, `<`, `>`, `"`, and `'` replaced by their XML entity references
 */
export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
