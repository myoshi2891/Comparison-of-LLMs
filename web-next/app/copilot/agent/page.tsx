import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "GitHub Copilot コーディングエージェント開発ガイド | LLM コスト計算機",
  description:
    "GitHub Copilot .agent.md の完全ベストプラクティスガイド。フロントマター全仕様・ステップバイステップ作成・Handoffs（エージェント連鎖）・Subagents（サブエージェント）・MCP統合・マルチエージェント設計パターン・トラブルシューティングを 2026年3月最新の公式ドキュメント準拠で解説。",
};

// Red scaffold — sections not yet implemented
export default function CopilotAgentPage() {
  return <div className={styles.root} />;
}
