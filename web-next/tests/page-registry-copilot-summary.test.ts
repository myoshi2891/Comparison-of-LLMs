import { describe, expect, it } from "vitest";
import { findBySlug } from "@/lib/page-registry";

describe("page-registry - Copilot 要約の鮮度表記", () => {
  it("/copilot/agent は 2026年6月の内容を当時の更新として区別する", () => {
    expect(findBySlug("/copilot/agent")?.summary).toBe(
      "GitHub Copilot .agent.md の完全ベストプラクティスガイド。フロントマター全仕様・ステップバイステップ作成・Handoffs（エージェント連鎖）・Subagents（サブエージェント）・MCP統合・マルチエージェント設計パターン・トラブルシューティングを 2026年7月31日時点の公式ドキュメント準拠で解説。2026年6月時点の更新（Cloud agent GA・組織/エンタープライズエージェント（JetBrains）・Copilot code review の AGENTS.md 対応）は当時の情報として収録。"
    );
  });

  it("/copilot/skill は 2026年7月の Agent Skills GA を反映し 6月の内容を当時の更新として区別する", () => {
    expect(findBySlug("/copilot/skill")?.summary).toBe(
      "GitHub Copilot Coding Agent / VS Code Agent Mode / Copilot CLI 対応の SKILL.md ガイド。フロントマター完全仕様・Progressive Disclosure 3段階ローディング・ステップバイステップ作成・実践テンプレート集・トラブルシューティングを公式ドキュメント根拠付きで徹底解説。2026-07-29 に Copilot code review での Agent Skills / MCP 対応が GA。2026年6月時点の更新（Copilot code review の AGENTS.md 対応（2026-06-18）、Cloud agent GA）は当時の情報として収録。"
    );
  });
});
