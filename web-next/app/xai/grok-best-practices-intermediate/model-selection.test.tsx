import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GrokBestPracticesIntermediatePage from "./page";

// 図解の定義文字列を DOM から検証できるよう MermaidDiagram をモックする
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart }: { chart: string }) => <pre data-testid="mermaid">{chart}</pre>,
}));

const normalize = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

describe("GrokBestPracticesIntermediatePage - モデル選定の一貫性", () => {
  it("1.3 フローチャートは汎用テキスト/コード生成に grok-4.7 を推奨する", () => {
    const { getAllByTestId } = render(<GrokBestPracticesIntermediatePage />);
    const lines = (getAllByTestId("mermaid")[0].textContent ?? "").split("\n").map((l) => l.trim());
    expect(lines).toEqual([
      "flowchart TD",
      'A["タスクの性質は?"] --> B{"テキスト/コード生成か?"}',
      'B -- はい --> C{"深いリサーチ・複数視点の統合が必要か?"}',
      'C -- はい --> D["grok-4.20-multi-agent (4 or 16 エージェント)"]',
      'C -- いいえ --> E["grok-4.7<br/>(既存の挙動を維持するなら grok-4.5)"]',
      'B -- いいえ --> F{"モダリティは?"}',
      'F -- 画像生成/編集 --> G["Grok Imagine: image / image-quality"]',
      'F -- 動画生成/編集 --> H["Grok Imagine: video / video-1.5"]',
      'F -- 音声 --> I["Grok Voice API"]',
    ]);
  });

  it("「迷ったら」の callout は grok-4.7 を推奨し grok-4.5 を使う場面を区別する", () => {
    const { container } = render(<GrokBestPracticesIntermediatePage />);
    const callout = Array.from(container.querySelectorAll("div")).find((d) =>
      d.textContent?.startsWith("ベストプラクティス: 迷ったら")
    );
    expect(normalize(callout?.textContent)).toBe(
      "ベストプラクティス: 迷ったら grok-4.7（2026年10月時点の旗艦モデル）を使用。既存システムで挙動を変えたくない場合は grok-4.5 を継続でき、grok-4.5-latest は最新版に自動追従し、grok-4.5-<日付> は特定バージョンに固定されます。本番環境で挙動の一貫性を優先するなら日付固定版、最新機能を優先するなら -latest を使い分けてください。"
    );
  });
});
