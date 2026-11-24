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

/** Mermaid ソースからノードのラベルと全辺を抽出する（連鎖リンクを含め、未対応リンク構文は失敗させる）。 */
function parseMermaid(source: string) {
  const labels = new Map<string, string>();
  for (const m of source.matchAll(/\b([A-Z][A-Z0-9_]*)(?:\["([^"]*)"\]|\{"([^"]*)"\})/g))
    labels.set(m[1], m[2] ?? m[3]);
  const edges: Array<{ from: string; label: string; to: string }> = [];
  const nodeShape = String.raw`([A-Z][A-Z0-9_]*)(?:\["[^"]*"\]|\{"[^"]*"\}|\("[^"]*"\))?`;
  const startRe = new RegExp(`^\\s*${nodeShape}`);
  const linkRe = new RegExp(`^\\s*--(?: "([^"]*)" --)?>\\s*${nodeShape}`);
  for (const line of source.split("\n")) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      /^(?:%%|flowchart\b|graph\b|classDef\b|class\b|subgraph\b|end\b|style\b|linkStyle\b|direction\b)/.test(
        trimmed
      )
    ) {
      continue;
    }
    const hasLinkSyntax = /(?:-->|-.->|==>|---|--\s)/.test(trimmed);
    if (!hasLinkSyntax) continue;
    const start = startRe.exec(trimmed);
    if (!start) throw new Error(`Unparseable Mermaid link statement: ${trimmed}`);
    let from = start[1];
    let rest = trimmed.slice(start[0].length);
    let count = 0;
    while (rest.length > 0) {
      if (/^\s*;?\s*$/.test(rest)) break;
      const link = linkRe.exec(rest);
      if (!link) throw new Error(`Unparseable Mermaid link statement: ${trimmed}`);
      edges.push({ from, label: link[1] ?? "", to: link[2] });
      from = link[2];
      rest = rest.slice(link[0].length);
      count++;
    }
    if (count === 0) throw new Error(`Unparseable Mermaid link statement: ${trimmed}`);
  }
  return { source, labels, edges };
}

/** 図タイトルから Mermaid ソースを引き、ノードのラベルと辺へ分解する。 */
function diagram(title: string, root?: HTMLElement) {
  const container = root ?? render(<Page />).container;
  const card = Array.from(container.querySelectorAll("[data-testid='mermaid']")).find((e) =>
    text(e.parentElement?.parentElement?.firstElementChild).startsWith(title)
  );
  return parseMermaid(card?.textContent ?? "");
}

function assertEvalGate(source: string) {
  const { labels, edges } = parseMermaid(source);
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
  const canReach = (start: string, target: string, activeEdges = edges) => {
    const visited = new Set<string>();
    const queue = [start];
    while (queue.length > 0) {
      const curr = queue.shift() as string;
      if (curr === target) return true;
      if (visited.has(curr)) continue;
      visited.add(curr);
      for (const e of activeEdges) if (e.from === curr) queue.push(e.to);
    }
    return false;
  };
  const withoutEvalPassAndRestart = edges.filter(
    (e) =>
      !(e.from === gate && e.label === "はい" && e.to === "DONE") &&
      !(e.from === "RETRY" && e.to === "Q1")
  );
  expect(canReach("FABLE", "DONE", withoutEvalPassAndRestart)).toBe(false);
  expect(canReach("HYBRID", "DONE", withoutEvalPassAndRestart)).toBe(false);
  expect(canReach("START", "DONE", withoutEvalPassAndRestart)).toBe(true);
  const failed = edges.find((e) => e.from === gate && e.label === "いいえ");
  expect(failed?.to).toBeTruthy();
  expect(failed?.to).not.toBe("DONE");
  // 不合格は Q1 へ到達できる選定・再試行の経路へ戻る（Q1 自身や RETRY 経由を許容し、行き止まりを禁止）。
  expect(canReach(failed?.to as string, "Q1")).toBe(true);
}

it("図2: Fable の構成は evals に合格した場合だけ「そのまま運用」へ進み、不合格は見直しへ戻る", () => {
  const { source } = diagram("図2");
  assertEvalGate(source);
  // 連鎖リンクによるバイパス（FABLE --> BYPASS --> DONE）を抽出・検知できること。
  expect(() => assertEvalGate(`${source}\n    FABLE --> BYPASS --> DONE`)).toThrow();
  // 未対応リンク構文を見逃さず失敗させること。
  expect(() => parseMermaid("flowchart TD\n    FABLE -.-> DONE")).toThrow();
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

it("図3: low が品質基準を満たしたときは1段下げ確認を経由せず直接 FIX へ進み、再訪した effort で循環しない", () => {
  const { labels, edges } = diagram("図3");
  const fromF = edges.find((e) => e.from === "F" && e.label === "満たす");
  expect(fromF?.to).toBe("G0");
  expect(labels.get("G0")).toMatch(/low/);
  expect(edges.some((e) => e.from === "G0" && e.label === "はい" && e.to === "FIX")).toBe(true);
  expect(edges.some((e) => e.from === "G0" && e.label === "いいえ" && e.to === "G")).toBe(true);
  expect(edges.some((e) => e.from === "G" && e.label === "いいえ" && e.to === "FIX")).toBe(true);
  // 1段下げて基準未達だった場合は、上げる前の元の effort で確定して終了し、DOWN → E → UP → E で循環しない。
  const fromDown = edges.find((e) => e.from === "G" && e.label === "はい")?.to;
  expect(fromDown).toBe("DOWN");
  expect(edges.some((e) => e.from === "DOWN" && e.to === "E")).toBe(false);
  expect(edges.some((e) => e.from === "DOWN" && e.label === "満たす" && e.to === "G0")).toBe(true);
  expect(edges.some((e) => e.from === "DOWN" && e.label === "満たさない" && e.to === "FIX")).toBe(
    true
  );
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
  const metricsWrap = container.querySelector("#s13-2")?.nextElementSibling;
  expect(metricsWrap?.getAttribute("tabindex")).toBe("0");
  expect(metricsWrap?.getAttribute("role")).toBe("region");
  expect(metricsWrap?.getAttribute("aria-label")).toBe("記録する指標の表");
});

it("6.3 CMEK・6.5 進捗例・9.1 fast mode・4.1 セットアップ手順が最新仕様を反映する", () => {
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
  // 4.1 セットアップ手順: データ保持要件の確認が API 疎通確認より先にあり、合意前は合成データ限定。
  const setupRows = Array.from(container.querySelectorAll("#s4-1 + div tr")).slice(1);
  const retentionIdx = setupRows.findIndex((r) => text(r).includes("データ保持の要件"));
  const smokeIdx = setupRows.findIndex((r) =>
    text(r).includes("モデル ID を claude-fable-5-2 にする")
  );
  expect(retentionIdx).toBeGreaterThanOrEqual(0);
  expect(smokeIdx).toBeGreaterThan(retentionIdx);
  expect(text(setupRows[smokeIdx])).toMatch(/合成データのみ/);
});

it("6.4 標準ループ・予算注記・11.4 予算ガード・図3 注記が最新仕様を反映する", () => {
  const { container } = render(<Page />);
  const fig3Note = container.querySelector("#s5-3")?.nextElementSibling?.nextElementSibling;
  expect(text(fig3Note)).toMatch(/単調性/);
  expect(text(fig3Note)).toMatch(/5\.4節のスイープ/);
  const agentCode = Array.from(
    container.querySelectorAll("pre code"),
    (e) => e.textContent ?? ""
  ).find((c) => c.includes("def agent_loop("));
  expect(agentCode).toMatch(/container_id を保持/);
  expect(agentCode).toMatch(/期限切れ/);
  const budgetNote = container.querySelector("#s6-4-budget-note");
  expect(text(budgetNote)).toMatch(/max_turns.*ターン数のみ/);
  expect(text(budgetNote)).toMatch(/上限金額.*強制しません/);
  expect(text(budgetNote)).toMatch(/各 API リクエストの送信前に別途予算チェック/);
  const budgetItem1 = container.querySelector("#s11-4 + ol > li");
  expect(budgetItem1?.querySelector('a[href="#s6-4-budget-note"]')).toBeTruthy();
  const budgetItem = Array.from(container.querySelectorAll("#s11 li")).find((li) =>
    text(li).includes("estimate_usd")
  );
  expect(text(budgetItem)).toMatch(/推論リージョン倍率/);
  expect(text(budgetItem)).toMatch(/非課金と確認された事前拒否は 0/);
  expect(text(budgetItem)).toMatch(/単一試行 Fable 応答/);
  expect(text(budgetItem)).toMatch(/usage\.iterations/);
});

it("図4 プレフィックス比較と図9 コンテキスト超過分岐が最新仕様を反映する", () => {
  const { container } = render(<Page />);
  const { labels, edges } = diagram("図9", container);
  expect(
    edges.some(
      (e) => e.from === "C" && e.label === "model_context_window_exceeded" && e.to === "R6C"
    )
  ).toBe(true);
  expect(labels.get("R6C")).toMatch(/compaction/);
  expect(labels.get("R6B")).toMatch(/コンテキストに余裕がある場合/);
  // 図4: 各思考ブロックを生成時のプレフィックスと比較し、今回 system 未変更でも過去別プレフィックスは不一致。
  const fig4 = diagram("図4", container);
  expect(fig4.labels.get("B")).toMatch(/生成時のプレフィックス/);
  expect(fig4.edges.some((e) => e.from === "B" && /今回未変更でも不一致/.test(e.label))).toBe(true);
});
