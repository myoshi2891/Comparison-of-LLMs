# 原本照合監査（Source Parity Audit）— 移行漏れの機械検知

(最終更新日: 2026-08-13)

**目的**: ガイドページ移植で最も多い不具合である**移行漏れ（セクション・リスト項目・
参考リンクの脱落）を、目視ではなくスクリプトとテストで検知する**。

移行漏れは「読めば分かる」類のバグに見えるが、原本が 1,000 行を超えるガイドでは
人間も AI も確実に見落とす。だから**照合は必ず機械にやらせる**。

---

## 0. 前提：原本はすべて `archive/` にある

移行元の HTML / Markdown は削除禁止で、`archive/html/<ベンダー>/` と
`archive/md/<ベンダー>/` に退避保存されている（Git 追跡下）。

```bash
ls archive/html/Anthropic/     # HTML 原本
ls archive/md/Anthropic/       # Markdown 原本
```

> **どちらを正とするか**: そのページを移植した際に使った側が正。両方ある場合、
> HTML 原本が「最終形」であることが多い（Markdown は下書きで内容が古いことがある）。
> 両方に対して監査を回し、差分の理由を説明できない場合はユーザーに確認する。
>
> **不一致が数十件以上出たら、まず原本の取り違えを疑う。**
> ファイル名が似ている原本が複数あり（例: `Mcp-best-practices.html` と
> `Mcp-best-practices-guide.html`）、初級版・中級版のページと交差して対応していることがある。
> 実測例では、取り違えると不一致 114 件、正しく対応させると 1 件（h1 の追加のみ）になった。
> **候補となる原本を総当たりで監査し、最も一致する組み合わせを正とする**のが確実である。

---

## 1. 監査スクリプトの実行

```bash
# リポジトリルートから実行する
bun .claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
  archive/html/Anthropic/claude-managed-agents-guide.html \
  web-next/app/claude/managed-agents/page.tsx
```

出力例（合格）:

```text
要素              原本    page.tsx  （参考値。判定は下の照合結果で行う）
listItems             0         0
codeBlocks           11        11
tableRows            41        41
paragraphs           27        27
headings             17        17
externalLinks        16        16
mermaidSources       11        11

判定: ✅ 漏れなし — Green 判定に進んでよい。
```

出力例（不合格）:

```text
❌ page.tsx に存在しない原本の見出し (3 件):
  h3: 権限ポリシーの設定
  h3: Webhookでの非同期処理
  h3: カスタムスキルの作成

❌ page.tsx に存在しない原本の外部リンク (2 件):
  https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices

❌ page.tsx 本文に見当たらない原本のリスト項目 (4 件):
  - ファイル読み書き
  - bashコマンド実行

判定: ❌ 移行漏れあり — Green コミット禁止。漏れを転写してから再実行すること。
```

**終了コード**: `0` = 漏れなし / `1` = 漏れあり / `2` = 引数エラー。

### 判定ゲート（ブロッキング）と参考値の区別

| 項目 | 判定 | 理由 |
|---|---|---|
| 見出しの欠落（h2 / h3） | **ブロッキング** | セクション丸ごと脱落の直接証拠 |
| 外部リンク URL の欠落 | **ブロッキング** | 参考文献セクションの脱落を確実に捉える |
| リスト項目テキストの欠落 | **ブロッキング** | 本文平坦化テキストへの包含判定なのでマークアップ非依存 |
| コードブロック内容の欠落 | **ブロッキング** | タグを除去した正規化内容を出現回数込みで比較する |
| 表行内容の欠落 | **ブロッキング** | セルのマークアップを除去した正規化内容を出現回数込みで比較する |
| 通常段落内容の欠落 | **ブロッキング** | HTML / Markdown / JSX の段落を正規化し、出現回数込みで比較する |
| Mermaid ソースの差分 | **ブロッキング** | 正規化済みソースを順序・内容・出現回数込みで完全一致比較する |
| `listItems` / `codeBlocks` / `tableRows` / `paragraphs` の件数 | **参考値のみ** | ブロッキング判定は件数そのものではなく、上記の正規化内容で行う |

> 生のタグ件数を判定に使わないのは意図的な設計である。`<li>` 件数でゲートすると
> 「原本 18 / ページ 0」のような正当なカード移植で常時 Red になる。コードブロックと表行は
> タグ件数ではなく、マークアップ非依存の正規化内容を照合する。

### 既知の正当な差分（不合格でも移行漏れではないケース）

| 症状 | 判断 |
|---|---|
| 原本の `h2: 目次` がページに無い | **正当**。ページはサイドバー TOC + `TocObserver` で代替する |
| 原本の `h2: <ページタイトル>` がページに無い | **正当**。スクリプトはページ側 `h1` も照合集合に含めるため通常は検出されない。検出された場合は h1 のテキストが原本と乖離している |
| `⚠️ 原本に存在しない page.tsx の見出し` | **要確認**。多くは h1 の追加か見出しの言い換え。**言い換えは 100% 完全移植ルール違反**なので原本の文言へ戻す |
| 長大な `<li>`（コード例や複数段落を含む項目）が「見当たらない」と出る | **要確認**。リスト項目は先頭 40 文字で照合するため、ページ側で項目を「見出し + コードブロック」に分解すると先頭文言が繋がらず検出される。**内容が全て存在するかを人が確認して判断する**（分解自体は原本の構造を保っていれば許容される） |
| 原本 Markdown 側だけ大量に不一致 | Markdown が古い下書きの可能性。HTML 原本で再監査する |

**「正当な差分」と判断した場合は、その理由を Green コミットのメッセージ本文か
`docs/PROGRESS.md` に必ず書き残すこと。** 無言で見逃すと次回の監査でも同じ判断を繰り返す。

---

## 2. 契約テスト S-1 用の期待値を生成する

監査スクリプトは、テストに貼り付ける見出し配列を出力できる。

```bash
bun .claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
  archive/html/Anthropic/claude-managed-agents-guide.html \
  web-next/app/claude/managed-agents/page.tsx \
  --emit-headings
```

```ts
const EXPECTED_H2 = [
  "Managed Agents とは何か",
  "Messages API との違い",
  // ...
] as const;

const EXPECTED_H3 = [
  "ステップ 0: 前提条件を確認する",
  // ...
] as const;
```

これを `page.test.tsx` に貼り、**Red フェーズのテストとして先にコミットする**。
実装前なので当然失敗する。これが正しい Red である。

> **なぜテスト内で `archive/` を直接読まないのか**
> テストが `web-next/` の外のファイルへ依存すると、`web-next` 単体でテストが完結しなくなり、
> クロスディレクトリ依存の禁止（`CLAUDE.md` §インポート安全性）にも抵触する。
> **期待値はスクリプトで機械生成して literal 配列としてテストに固定する**のが本プロジェクトの方針。

---

## 3. `page.test.tsx` に書く原本照合契約（S-1〜S-4）

```tsx
// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import Page from "./page";

// --emit-headings の出力をそのまま貼る（順序も原本どおり）
const EXPECTED_H2 = [/* ... */] as const;
const EXPECTED_H3 = [/* ... */] as const;

// 原本の「参考文献 / 外部リンク」セクションの URL を全件列挙する
const EXPECTED_EXTERNAL_LINKS = [
  "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices",
  // ...
] as const;

beforeAll(() => {
  global.IntersectionObserver = class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as unknown as typeof IntersectionObserver;
});

/** 見出しの表示テキストを比較用に正規化する（空白のゆれのみ吸収する） */
function headingText(el: Element): string {
  return (el.textContent ?? "").replace(/\s+/g, " ").trim();
}

describe("/claude/managed-agents — 原本照合契約", () => {
  it("S-1: h2 の見出しが原本と完全一致する（順序込み）", () => {
    const { container } = render(<Page />);
    const actual = Array.from(container.querySelectorAll("h2")).map(headingText);
    expect(actual).toEqual([...EXPECTED_H2]);
  });

  it("S-2: h3 の見出しが原本と完全一致する（順序込み）", () => {
    const { container } = render(<Page />);
    const actual = Array.from(container.querySelectorAll("h3")).map(headingText);
    expect(actual).toEqual([...EXPECTED_H3]);
  });

  it("S-3: 原本の外部リンクがすべて存在する", () => {
    const { container } = render(<Page />);
    const hrefs = new Set(
      Array.from(container.querySelectorAll('a[href^="http"]')).map((a) =>
        (a.getAttribute("href") ?? "").replace(/\/+$/, "")
      )
    );
    for (const url of EXPECTED_EXTERNAL_LINKS) {
      expect(hrefs.has(url.replace(/\/+$/, ""))).toBe(true);
    }
  });

  it("S-4: 全 h2 / h3 が一意なアンカー id を持ち TOC から到達できる", () => {
    const { container } = render(<Page />);
    const headings = Array.from(container.querySelectorAll("h2, h3"));
    const ids = headings.map((h) => h.getAttribute("id"));
    // 全見出しに id がある
    expect(ids.every((id) => Boolean(id))).toBe(true);
    // id が重複しない
    expect(new Set(ids).size).toBe(ids.length);
    // TOC のリンク先がすべて実在する見出しを指す
    const tocHrefs = Array.from(container.querySelectorAll('a[href^="#"]')).map((a) =>
      (a.getAttribute("href") ?? "").slice(1)
    );
    for (const href of tocHrefs) {
      expect(ids).toContain(href);
    }
  });
});
```

### `toEqual` で完全一致させる理由

`toHaveLength(11)` のような**件数だけの検証は移行漏れを検知できない**。
セクションを 1 つ落として別の 1 つを重複させれば件数は保たれる。
**配列の完全一致（順序込み）だけが「原本と同じものが同じ順で並んでいる」ことを保証する。**

同じ理由で、以下は契約テストとして**不十分**であり、単独では受け入れない:

```tsx
// ❌ 弱すぎる — 何を落としても通ってしまう
expect(container.querySelectorAll("h2")).toHaveLength(11);
expect(container.querySelectorAll("pre, code").length).toBeGreaterThan(0);
```

---

## 4. 既存ページを保守するときの使い方

既存ページに加筆・修正した場合も、**変更後に必ず監査スクリプトを再実行する**。
「加筆したつもりが別のセクションを消していた」という事故を検出できる。

```bash
# 変更したページだけを監査する
bun .claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
  archive/html/<ベンダー>/<原本>.html \
  web-next/app/<provider>/<slug>/page.tsx
```

原本そのものを更新した場合（月次更新で新情報を追記した等）は、
**原本 → page.tsx の順に反映し、最後に監査を回して両者が揃っていることを確認する**。

---

## 5. 監査で漏れが出たときの手順

1. **修正を急がない**。まず漏れの全件リストを取得する（`--json` で機械可読出力）。
2. 漏れごとに「移行漏れ」か「正当な差分」かを分類する（§1 の表を使う）。
3. 移行漏れは**原本の文言のまま**転写する。要約・言い換えは規約違反。
4. 再度スクリプトを実行し、終了コード `0` を確認する。
5. `page.test.tsx` の `EXPECTED_H2` / `EXPECTED_H3` を `--emit-headings` で再生成して更新する。
6. `(cd web-next && bun run test)` を実行して Green を確認する。

```bash
# 機械可読出力（漏れ一覧を JSON で得る）
bun .claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
  archive/html/X.html web-next/app/a/b/page.tsx --json
```

---

## 関連

- `.claude/skills/nextjs-page-migration/SKILL.md` — 移行手順の本体（本監査は Step 1 / Step 3 に組み込まれている）
- `.claude/skills/nextjs-page-migration/references/design-contract-tests.md` — デザイン契約テスト（D-1〜D-4）
- `.claude/rules/tdd-mandatory-cycle.md` — Red / Green / Refactor / Docs のコミット分割と、本監査の必須化
