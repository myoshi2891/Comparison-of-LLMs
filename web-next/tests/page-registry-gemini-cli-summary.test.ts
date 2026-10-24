import { describe, expect, it } from "vitest";
import { findBySlug } from "@/lib/page-registry";

describe("page-registry - /google/skill-guide の Gemini CLI 記述", () => {
  it("v0.43.0 を最終版と扱わず、個人向け提供終了と継続リリースを区別する", () => {
    expect(findBySlug("/google/skill-guide")?.summary).toBe(
      "AIエージェントに「専門知識の教科書」を渡す仕組み — SKILL.md の構造・書き方・インストール手順を Gemini CLI v0.43.0 & Antigravity v2.0.1 対応版で完全解説。Google I/O 2026 発表内容対応。2026-06-18 に AI Pro/Ultra/無料 Code Assist の個人アカウント向け提供が終了（→ Antigravity CLI へ移行）したが、Gemini CLI 自体のリリースは継続しており、2026-10-20 に安定版 v0.65.0 が公開されている。"
    );
  });
});
