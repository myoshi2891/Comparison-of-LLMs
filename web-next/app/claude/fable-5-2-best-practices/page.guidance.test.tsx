// @vitest-environment jsdom
import fs from "node:fs";
import { cleanup, render } from "@testing-library/react";
import postcss from "postcss";
import { afterEach, expect, it, vi } from "vitest";
import Page from "./page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart }: { chart: string }) => <div data-testid="mermaid">{chart}</div>,
}));
vi.mock("./TocObserver", () => ({ default: () => null }));
afterEach(cleanup);

const text = (e: Element | null | undefined) => (e?.textContent ?? "").replace(/\s+/g, " ").trim();

/** 図タイトルから Mermaid ソースを引き、ノードのラベルと辺へ分解する。 */
function diagram(title: string) {
  const { container } = render(<Page />);
  const card = Array.from(container.querySelectorAll("[data-testid='mermaid']")).find((e) =>
    text(e.parentElement?.parentElement?.firstElementChild).startsWith(title)
  );
  const source = card?.textContent ?? "";
  const labels = new Map<string, string>();
  for (const m of source.matchAll(/\b([A-Z][A-Z0-9_]*)(?:\["([^"]*)"\]|\{"([^"]*)"\})/g))
    labels.set(m[1], m[2] ?? m[3]);
  const edges = Array.from(
    source.matchAll(/^\s*([A-Z][A-Z0-9_]*)\b[^\n]*?--(?: "([^"]*)" --)?>\s*([A-Z][A-Z0-9_]*)/gm),
    (m) => ({ from: m[1], label: m[2] ?? "", to: m[3] })
  );
  return { source, labels, edges };
}

it("図2: Fable の構成は evals に合格した場合だけ「そのまま運用」へ進み、不合格は見直しへ戻る", () => {
  const { labels, edges } = diagram("図2");
  expect(edges.length).toBeGreaterThan(0);
  // DONE へ入る辺は、Opus の evals 合格（Q4 いいえ）か、Fable 構成の evals 判定の合格だけ。
  const intoDone = edges.filter((e) => e.to === "DONE");
  for (const e of intoDone) {
    if (e.from === "Q4") expect(e.label).toBe("いいえ");
    else {
      expect(labels.get(e.from)).toMatch(/evals/);
      expect(e.label).toBe("はい");
    }
  }
  const gate = intoDone.find((e) => e.from !== "Q4")?.from as string;
  expect(gate).toBeTruthy();
  // Fable を含む構成（FABLE・HYBRID）は必ずこの判定を経由する。
  expect(edges.filter((e) => e.from === "Q5").map((e) => e.to)).not.toContain("DONE");
  expect(edges.some((e) => e.from === "HYBRID" && e.to === gate)).toBe(true);
  const failed = edges.find((e) => e.from === gate && e.label === "いいえ");
  expect(failed?.to).toBeTruthy();
  expect(failed?.to).not.toBe("DONE");
  // 不合格は選定・再試行の経路へ戻る（行き止まりにしない）。
  expect(edges.some((e) => e.from === failed?.to)).toBe(true);
});

it("図8: 継続したいという希望だけではモデルを切り替えず、明示的な方針がない間は終端にとどまる", () => {
  const { labels, edges } = diagram("図8");
  const fb = edges.find((e) => e.from === "VERIFY")?.to as string;
  expect(labels.get(fb)).toMatch(/方針/);
  expect(labels.get(fb)).not.toMatch(/継続したい/);
  const yes = edges.find((e) => e.from === fb && e.label === "はい");
  expect(labels.get(yes?.to ?? "")).toMatch(/フォールバック/);
  const no = edges.find((e) => e.from === fb && e.label !== "はい");
  expect(no?.label).toMatch(/未決定/);
  // 方針がない分岐は終端（以降の辺がない）で、フォールバックへ進まない。
  expect(edges.filter((e) => e.from === no?.to)).toEqual([]);
  expect(labels.get(no?.to ?? "")).toMatch(/拒否のまま/);
});

it("概要: 拒否が自動でモデルを切り替えるとは読めないよう、フォールバックを有効にした場合に限定する", () => {
  const { container } = render(<Page />);
  const item = Array.from(container.querySelectorAll("li")).find((e) =>
    text(e).includes("cyber は Opus 4.8、bio は Opus 5")
  );
  expect(text(item)).toMatch(/フォールバックを明示的に有効にした場合に限り/);
  expect(text(item)).toMatch(/有効にしなければ拒否のまま返ります/);
});

it("図9・トラブル表: 追記のみは今後の不一致の予防で、既に無効なブロックの復旧は別手段と区別する", () => {
  const { labels } = diagram("図9");
  expect(labels.get("R7")).toMatch(/防ぐ/);
  expect(labels.get("R7")).toMatch(/プレフィックスに戻す/);
  expect(labels.get("R7")).toMatch(/新しい会話/);
  const { container } = render(<Page />);
  const row = Array.from(container.querySelectorAll("tr")).find((r) =>
    text(r).startsWith("400: The block is bound to a different conversation")
  );
  const advice = text(row?.children[2]);
  expect(advice).toMatch(/今後の不一致は履歴を追記のみにして防ぐ/);
  expect(advice).toMatch(/追記では直らない/);
  expect(advice).toMatch(/ブロックを生成したときのプレフィックスに戻す/);
  expect(advice).toMatch(/新しい会話を始める/);
  expect(advice).toMatch(/暫定は drop_block/);
});

it("API の疎通確認は HTTP 200 だけでなく、正常終了と要求したモデルを本文で確かめる", () => {
  const { container } = render(<Page />);
  const row = Array.from(container.querySelectorAll("tr")).find((r) =>
    text(r).includes("モデル ID を claude-fable-5-2 にする")
  );
  const expectation = text(row?.children[2]);
  expect(expectation).toMatch(/200/);
  expect(expectation).toMatch(/認証・通信/);
  expect(expectation).toMatch(/stop_reason が refusal ではなく end_turn/);
  expect(expectation).toMatch(/model が claude-fable-5-2/);
});

it("drop_block の例は既存リクエストへ統合する thinking フィールドだけを示し、messages は既存の配列を保つと明記する", () => {
  const { container } = render(<Page />);
  const heading = container.querySelector("#s7-4");
  const intro = heading?.nextElementSibling;
  const code = intro?.nextElementSibling?.querySelector("pre code");
  const body = JSON.parse(code?.textContent ?? "null");
  expect(Object.keys(body)).toEqual(["thinking"]);
  expect(body.thinking).toEqual({
    type: "adaptive",
    block_binding: { prefix_mismatch_behavior: "drop_block" },
  });
  expect(text(intro)).toMatch(/既存のリクエストへは次の thinking フィールドだけを統合し/);
  expect(text(intro)).toMatch(/messages は手元の有効なメッセージの配列をそのまま送ります/);
});

it("費用の例は Global API 価格であることを示す", () => {
  const { container } = render(<Page />);
  const code = Array.from(container.querySelectorAll("pre code"), (e) => e.textContent ?? "").find(
    (c) => c.includes("def estimate_usd(")
  );
  expect(code).toMatch(/Global API/);
});

it("モバイルの目次ボタンは Tabler のスタイルシートがなくても見えるアイコンをページ内CSSで描く", () => {
  const css = fs.readFileSync("app/claude/fable-5-2-best-practices/page.module.css", "utf8");
  const found: Record<string, string> = {};
  postcss.parse(css).walkRules((r) => {
    if (r.selector === ".root .mobile-bar :global(button) :global(i.ti-menu-2)::before")
      r.walkDecls((d) => {
        found[d.prop] = d.value;
      });
  });
  expect(found.content).toBe('"\\2630"');
  const { getByRole } = render(<Page />);
  const button = getByRole("button", { name: "目次を開く" });
  // アクセシブルな名前と開閉状態は従来どおり。
  expect([button.getAttribute("aria-label"), button.getAttribute("aria-expanded")]).toEqual([
    "目次を開く",
    "false",
  ]);
  expect(button.querySelector("i.ti-menu-2")?.getAttribute("aria-hidden")).toBe("true");
});

it("図3: low が品質基準を満たしたときは1段下げ確認を経由せず直接 FIX へ進む", () => {
  const { labels, edges } = diagram("図3");
  const fromF = edges.find((e) => e.from === "F" && e.label === "満たす");
  expect(fromF?.to).toBe("G0");
  expect(labels.get("G0")).toMatch(/low/);
  expect(edges.some((e) => e.from === "G0" && e.label === "はい" && e.to === "FIX")).toBe(true);
  expect(edges.some((e) => e.from === "G0" && e.label === "いいえ" && e.to === "G")).toBe(true);
  expect(edges.some((e) => e.from === "G" && e.label === "いいえ" && e.to === "FIX")).toBe(true);
});

it("6.5節: omitted を最安と主張せず、ストリーミング表示と応答後確認を区別する", () => {
  const { container } = render(<Page />);
  const omittedRow = Array.from(container.querySelectorAll("tr")).find((r) =>
    text(r).startsWith('"omitted"(既定)')
  );
  expect(text(omittedRow)).not.toMatch(/最安/);
  expect(text(omittedRow)).toMatch(/同額課金/);
  const s65 = container.querySelector("#s6-5");
  const callout = s65?.parentElement?.querySelectorAll("[data-variant='info']");
  const s65Callout = Array.from(callout ?? []).find((c) =>
    text(c).includes("ベータ機能のヘッダ名")
  );
  expect(text(s65Callout)).toMatch(/ストリーミングで進捗イベントを受信/);
  expect(text(s65Callout)).toMatch(/応答完了後の確認例/);
});

it("確度ラベル表・ベンチマーク表・費用式表とセットアップ/費用見積もり pre がキーボードフォーカス可能でアクセシブル名を持つ", () => {
  const { container } = render(<Page />);
  const confidenceWrap = container.querySelector("#s0 [role='region']");
  expect(confidenceWrap?.getAttribute("tabindex")).toBe("0");
  expect(confidenceWrap?.getAttribute("aria-label")).toBeTruthy();
  const benchmarkWrap = container.querySelector("#s1-3")?.nextElementSibling?.nextElementSibling;
  expect(benchmarkWrap?.getAttribute("tabindex")).toBe("0");
  expect(benchmarkWrap?.getAttribute("role")).toBe("region");
  expect(benchmarkWrap?.getAttribute("aria-label")).toBeTruthy();
  const costWrap = container.querySelector("#s11-1")?.nextElementSibling?.nextElementSibling;
  expect(costWrap?.getAttribute("tabindex")).toBe("0");
  expect(costWrap?.getAttribute("role")).toBe("region");
  expect(costWrap?.getAttribute("aria-label")).toBeTruthy();
  const setupPre = Array.from(container.querySelectorAll("pre")).find((p) =>
    text(p).includes("claude --model claude-fable-5-2")
  );
  expect(setupPre?.getAttribute("tabindex")).toBe("0");
  expect(setupPre?.getAttribute("role")).toBe("region");
  expect(setupPre?.getAttribute("aria-label")).toBeTruthy();
  const estimatorPre = Array.from(container.querySelectorAll("pre")).find((p) =>
    text(p).includes("def estimate_usd(")
  );
  expect(estimatorPre?.getAttribute("tabindex")).toBe("0");
  expect(estimatorPre?.getAttribute("role")).toBe("region");
  expect(estimatorPre?.getAttribute("aria-label")).toBeTruthy();
});

it("6.3 CMEK・6.5 進捗例・9.1 fast mode・11.4 予算倍率・図9 コンテキスト超過分岐が最新仕様を反映する", () => {
  const { container } = render(<Page />);
  const cmekRow = Array.from(container.querySelectorAll("tr")).find((r) =>
    text(r).includes("CMEK")
  );
  expect(text(cmekRow)).toMatch(/output_config\.format/);
  expect(text(cmekRow)).toMatch(/strict: true/);
  const progressCode = Array.from(
    container.querySelectorAll("pre code"),
    (e) => e.textContent ?? ""
  ).find((c) => c.includes("thinking-display-updates-2026-08-18"));
  expect(progressCode).toMatch(/"tools": tools/);
  expect(progressCode).toMatch(/stream: true/);
  const fastRow = Array.from(container.querySelectorAll("tr")).find((r) =>
    text(r).includes("非対話 + fast mode")
  );
  expect(text(fastRow)).toMatch(/Google Cloud Agent Platform/);
  expect(text(fastRow)).toMatch(/v2\.1\.322/);
  expect(text(fastRow)).toMatch(/global.*us.*eu/);
  const budgetItem = Array.from(container.querySelectorAll("#s11 li")).find((li) =>
    text(li).includes("estimate_usd")
  );
  expect(text(budgetItem)).toMatch(/推論リージョン倍率/);
  const { labels, edges } = diagram("図9");
  expect(
    edges.some(
      (e) => e.from === "C" && e.label === "model_context_window_exceeded" && e.to === "R6C"
    )
  ).toBe(true);
  expect(labels.get("R6C")).toMatch(/compaction/);
  expect(labels.get("R6B")).toMatch(/コンテキストに余裕がある場合/);
});
