/**
 * shared RSS utility module
 */

/** フィードに載せる最大件数（新着 20 件）。 */
export const MAX_ITEMS = 20;

/**
 * Escapes the five characters reserved in XML.
 *
 * `&` must be replaced first, otherwise the ampersands introduced by the other
 * replacements would be escaped twice.
 *
 * @param value - Raw text that may contain XML-reserved characters
 * @returns The text with `& < > " '` replaced by their entity references
 */
export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
