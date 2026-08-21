/**
 * Mermaid 図解の宣言行を判定するための型一覧。
 *
 * NOTE: `.claude/skills/fix-mermaid/scripts/mermaid-diagram-types.mjs` と同じ値を持つ。
 * `web-next/` から `.claude/` 配下を import すると CLAUDE.md の
 * 「インポート安全性」（`web-next/` → `web-next/` のみ）に反するため、
 * web-next 側のテストはこのモジュールを参照する。
 * 片方を変更したら必ずもう片方も更新すること
 * （`.claude/skills/nextjs-page-migration/scripts/audit_source_parity.test.mjs` が
 * 両者の差分を機械検知する）。
 */
export const MERMAID_DIAGRAM_TYPES = [
  "graph",
  "flowchart",
  "sequenceDiagram",
  "mindmap",
  "stateDiagram-v2",
  "gitGraph",
  "erDiagram",
  "classDiagram",
  "journey",
  "timeline",
  "pie",
] as const;

export const MERMAID_DIAGRAM_DECLARATION = new RegExp(`^(?:${MERMAID_DIAGRAM_TYPES.join("|")})\\b`);
