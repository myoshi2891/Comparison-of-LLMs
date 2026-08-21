import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ChecklistCard } from "./ChecklistCard";
import styles from "./page.module.css";

afterEach(() => {
  cleanup();
});

/**
 * 原本 archive/html/Microsoft/Github-copilot-best-practices.html の
 * 「16. ベストプラクティスチェックリスト」の label 文言（出現順）。
 * 件数だけを見る契約では文言の改変・入れ替えを検出できないため全文で固定する。
 */
const EXPECTED_CHECKLIST_LABELS = [
  "タスクの性質に応じてAsk / Edit / Agentモードを使い分けている",
  ".github/copilot-instructions.md を用意し、ビルド・テスト・コーディング規約を簡潔に明記している",
  "エージェント的タスク向けに AGENTS.md を用意している(必要な場合)",
  "繰り返すプロンプトは .prompt.md 化している",
  "チームのナレッジベースをCopilot Spacesとして整理している",
  "複雑な機能追加では「プロトタイプ→計画→Autopilot実装→人間レビュー→Rubber Duckレビュー」の流れを踏んでいる",
  "YOLOモード(Allow All)は必ずサンドボックス環境内でのみ使用している",
  "Coding AgentへのIssueアサインでは、スコープと受け入れ条件を明確に記述している",
  "Copilot Code ReviewのMCP/Agent Skills設定を、チームの内部標準に合わせて整えている",
  "MCPで取得した外部情報を「信頼できない入力」として扱っている",
  "タスクの難易度に応じてモデルを選び、作業単位内ではモデル・推論レベルを変えていない",
  "AIが生成したコードは必ず自分でテスト・レビューしてからマージしている",
  "チームのAI Credits使用状況を定期的に可視化・レビューしている",
] as const;

/** 原本 HTML の折り返しと JSX の <code> 前後の空白差を吸収して比較する。 */
function normalizeLabel(raw: string | null): string {
  return (raw ?? "").replace(/\s+/g, "");
}

describe("GitHub Copilot ChecklistCard", () => {
  it("renders all 13 checklist items unchecked by default", () => {
    render(<ChecklistCard />);
    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes).toHaveLength(EXPECTED_CHECKLIST_LABELS.length);
    expect(checkboxes.every((checkbox) => !(checkbox as HTMLInputElement).checked)).toBe(true);
  });

  it("renders every checklist label exactly as the source document, in order", () => {
    const { container } = render(<ChecklistCard />);
    const labels = Array.from(container.querySelectorAll("li")).map((item) =>
      normalizeLabel(item.textContent)
    );

    expect(labels).toEqual(EXPECTED_CHECKLIST_LABELS.map(normalizeLabel));
  });

  it("checks and unchecks an item while toggling checked styles", () => {
    render(<ChecklistCard />);
    const checkbox = screen.getAllByRole("checkbox")[0];
    const row = checkbox.closest("li") as HTMLElement;

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(row).toHaveClass(styles.checkedItem);

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(row).not.toHaveClass(styles.checkedItem);
  });
});
