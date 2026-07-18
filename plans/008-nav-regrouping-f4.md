# Plan 008: ナビをページレジストリからの導出に変え、トップレベルを 18 → 7 項目へ集約する（F-4'）

> **Executor instructions**: 本プランを上から順に実行し、各ステップの検証コマンドと期待結果を
> 必ず確認してから次へ進むこと。「STOP 条件」に該当したら改善を試みず停止して報告する。
> 完了時に `plans/README.md` の 008 行を更新する。
>
> **Drift check（最初に実行）**:
>
> ```bash
> git diff --stat 29d929d..HEAD -- web-next/components/site/ web-next/lib/page-registry.ts web-next/app/globals.css
> ```
>
> 差分があれば「現状」の抜粋と実コードを突合し、不一致なら STOP 条件として扱う。

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED（全ページのヘッダーに影響。URL は不変）
- **Depends on**: [006](006-platform-roadmap-v2.md)（§2.2 / Phase 2）, 007（F-1 ページレジストリ — DONE）
- **Category**: dx
- **Planned at**: commit `29d929d`, 2026-07-14
- **承認**: 006 §5.3 が要求する「ナビ大規模変更のユーザー明示承認」は 2026-07-14 に取得済み

## Why this matters

サイトヘッダーのトップレベルが **18 項目**あり（STATE-06 / `004-reconciliation-2026-07.md:86-91`）、
うち 4 つ（Sandbox / CI/CD / RAG / LLMOps）は子リンクが 1 件しかないドロップダウン、5 つ（MCP /
Local LLM / IDE / Security / Multimodal）は 2 件のみ。読者は 18 個のラベルを走査させられ、
ページを増やすほど悪化する。

同時に `nav-links.ts` は 170 行の手書きデータで、`page-registry.ts`（F-1 で導入した全ページ
メタデータの SSoT）と**完全な二重管理**になっている。registry には既に目標グルーピングが
`group` フィールドとして投入済みなので、ナビを registry からの**導出**に変えれば、
トップレベルの集約と二重管理の解消が同時に達成でき、以後「ページ追加 = registry 登録」だけで
ナビにも自動的に載る。

## Current state

### 関連ファイル

- `web-next/components/site/nav-links.ts` — 170 行。Zod スキーマ + 手書き `navLinks` データ。**本プランで導出化する**
- `web-next/components/site/SiteHeader.tsx` — `navLinks` を 2 階層前提で描画（Client Component）
- `web-next/components/site/SiteHeaderClient.tsx` — 開閉ハンドラを `addEventListener` で後付け
- `web-next/lib/page-registry.ts` — 691 行 / 57 エントリ。`group` は目標グルーピング済み。**`category` を追加する**
- `web-next/app/globals.css` — ナビ CSS は 1116〜1330 行付近（`.ch-links` / `.ch-dropdown` / `.ch-submenu`）

### スキーマ（`nav-links.ts:17-31`）— 1 段しか表現できない

```ts
const LeafSchema = z.object({
  name: z.string().min(1),
  href: hrefSchema,
});

const DropdownSchema = z.object({
  name: z.string().min(1),
  children: z.array(LeafSchema).min(1),   // ← Leaf のみ。ネスト不可
});

export const NavLinkSchema = z.union([LeafSchema, DropdownSchema]);
```

`hrefSchema`（`nav-links.ts:7-15`）は `javascript:` とプロトコル相対 `//` を拒否する XSS ガード。
**導出後もこれを通すこと**（legacy `common-header.js:94-104` の `isSafeHref` 相当）。

### registry スキーマ（`page-registry.ts:30-47`）

```ts
export const PageEntrySchema = z.object({
  slug: slugSchema,                // "/" 始まり
  title: z.string().min(1),        // ナビ表示名
  group: z.string().min(1),        // 目標グルーピング（投入済み）
  provider: z.enum(["claude", "google", "codex", "copilot"]).optional(),
  topics: z.array(z.string()),
  summary: z.string().min(1),
  addedAt: isoDateSchema,          // YYYY-MM-DD
  lastReviewed: isoDateSchema,
});
```

`group` の実測分布（57 件）: `Providers` 30 / `Agent 開発` 9 / `開発プロセス` 8 /
`モデル・データ` 5 / `運用・品質` 3 / `Home` 1 / `What's New` 1。

**中間層（カテゴリ）を表すフィールドが無い。** `provider` は Providers 系にしか無く、
`topics` は自由文字列の多対多（`guide` が 15 件付くなど）でメニューの並び順を決められない。

### 目標ナビ構造

```text
Home                → /
Providers ▾         → 30（2 段ネスト: Claude 10 / Google 12 / Codex 4 / Copilot 4）
Agent 開発 ▾        →  9
開発プロセス ▾      →  8
運用・品質 ▾        →  3
モデル・データ ▾    →  5
What's New          → /whats-new
```

### 設計判断（本プラン着手時にユーザーと確定）

1. **中間層は registry に `category` フィールドを追加して明示する**（`topics` からの導出は採らない —
   `topics` は多対多かつ表記ゆれがあり、変換表を書くと結局 `nav-taxonomy.ts` と同等の手書き表になる）
2. **2 段ネストは Providers のみ。** 他 4 グループ（最大 9 リンク）は 1 段フラットのまま。
   全グループを 2 段にすると CI/CD・Git Worktree・RAG のような 1 ページのカテゴリで 3 段ホバーが
   発生し、STATE-06 が指摘した「1 リンクのみのカテゴリ」問題が階層を変えて再発する
3. **openclaw（`/agent/openclaw-advanced-agent-security-guide`）は `Agent 開発` に残す。**
   006 §2.2 は Security への移設を書いているが不採用 — エージェントを安全に**作る**ためのガイドであり、
   読者は Agent 開発から探す。横断性は `topics: ["agent","security","guide"]` が既に表現しており、
   その活用は F-5 / F-7（横断検索・関連リンク）の担当であってナビの所属先を動かすことではない
4. **リーフの並び順は `addedAt` 昇順 → 同日は `slug` 昇順**。registry に順序フィールドは追加しない
   （古い順 = 現行の手書き順とほぼ一致し、新規ページは末尾に積まれるので保守が要らない）

### 006 §2.2 の記述の訂正（本プランで反映する）

- 「現行 16 項目」→ **18 項目**（実測）
- 「8 項目へ集約」→ **7 項目**（§2.2 が列挙している行数自体が 7。registry の group も 7 種）
- 「Security 2+1（openclaw 移設）」→ **不採用**（上記 設計判断 3）

## Commands you will need

| Purpose   | Command                            | Expected on success |
|-----------|------------------------------------|---------------------|
| Tests     | `cd web-next && bun run test`       | all pass            |
| Typecheck | `cd web-next && bun run typecheck`  | exit 0              |
| Lint      | `cd web-next && bun run lint`       | exit 0              |
| Build     | `cd web-next && bun run build`      | exit 0（registry の Zod parse はここで落ちる） |
| Backend   | `cd scraper && uv run pytest`        | all pass（本プランでは無変更）|

> `bun` 必須。`npm` / `npx` / `node` は使用禁止。

## Suggested executor toolkit

- `.claude/rules/tdd-mandatory-cycle.md` — Red → Green → Refactor → Docs Sync を厳守（コミット分割必須）
- `.claude/rules/css-cache-reset.md` — **`globals.css` 変更後は `rm -rf web-next/.next` して dev 再起動**
- `.claude/rules/no-absolute-paths.md` — コミット前 PII チェック
- `.claude/skills/docs-sync/SKILL.md` — 最終ステップの仕様書同期
- `.claude/skills/markdown-formatter/SKILL.md` — Markdown 編集時のリント

## Scope

**In scope**:

- `web-next/lib/nav-taxonomy.ts`（新規）
- `web-next/lib/page-registry.ts`（`category` 追加 + `group` の enum 化）
- `web-next/components/site/nav-links.ts`（導出化。export 名は維持）
- `web-next/components/site/SiteHeader.tsx`
- `web-next/components/site/SiteHeaderClient.tsx`
- `web-next/app/globals.css`（ナビ CSS のみ）
- テスト: `web-next/tests/phaseA.nav-links.test.ts`（書き換え）、`web-next/tests/nav-derivation.test.ts`（新規）、
  `web-next/tests/helpers/nav.ts`（新規）、`web-next/components/site/SiteHeader.test.tsx`、
  `web-next/components/site/SiteHeaderClient.test.tsx`、`web-next/tests/page-registry-coverage.test.ts`、
  `web-next/app/claude/skills-sh/page.test.tsx`、`web-next/app/agent/skills/page.test.tsx`、
  `web-next/app/claude/fable-5-best-practices/page.test.tsx`
- 仕様書: `.claude/rules/tdd-mandatory-cycle.md`, `.claude/skills/docs-sync/SKILL.md`,
  `CLAUDE.md`, `GEMINI.md`, `docs/PROGRESS.md`, `plans/006-platform-roadmap-v2.md`, `plans/README.md`

**Out of scope**（関連して見えても触らない）:

- **URL / ルーティング** — 006 §2.1 の C 案（URL 不変）を守る。`app/**/page.tsx` は 1 つも編集しない
- `netlify.toml`（リダイレクト不要 — URL が変わらないため）
- `web-next/app/sitemap.ts` / `app/whats-new/` — registry 駆動で既に正しく、ナビ変更の影響を受けない
- registry の **`group` 値そのもの** — 既に正しい。`category` の追加のみ
- 新規ページの追加、コンテンツの編集
- `scraper/` 配下すべて

## Git workflow

- ブランチ: `dev`（現在のブランチ。新規ブランチは作らない）
- コミット: 下記 Steps の 1 ステップ = 1 コミット（TDD 必須サイクル）。Conventional Commits
  （例: `feat(nav): ...` / `test(nav): ...` / `chore(docs): ...`）
- push / PR は operator の指示があるまで行わない

## Steps

### Step 1: プランの起票（本ファイル）と索引更新

`plans/008-nav-regrouping-f4.md`（本ファイル）を追加し、`plans/README.md` の実行順テーブルに
008 行を追加、「次のアクション」の項目 3（F-4'）を消化済みに更新する。

**Verify**: `git status --short plans/` → `008-nav-regrouping-f4.md` が新規、`README.md` が変更

**Commit**: `docs(plans): add 008 nav regrouping design (F-4')`

---

### Step 2 [Red]: 契約テストを新構造で書き換え、失敗を確認する

既存の契約テストは **18 項目のナビを直書きで固定している**ため、そのままでは新構造を拒否する。

1. `web-next/tests/helpers/nav.ts`（新規）— ナビ木を再帰的に走査するヘルパー:

   ```ts
   /** ナビ木のすべてのリーフ href を出現順に集める（2 段ネスト対応）。 */
   export function collectNavHrefs(links: readonly NavLink[]): string[];
   /** 指定 href のリーフを再帰探索する。 */
   export function findNavLeaf(links: readonly NavLink[], href: string): NavLeaf | undefined;
   ```

2. `web-next/tests/nav-derivation.test.ts`（新規）— 導出の契約:
   - **全単射**: `pageRegistry` の全 slug がナビにちょうど 1 回現れ、逆にナビの全 href が
     registry に存在する（＝ページ追加時のナビ登録漏れを機械検知する。これが本プランの中核価値）
   - トップレベルは `NAV_GROUPS` の順で 7 項目、先頭 Home / 末尾 What's New
   - Providers は 4 サブグループを `CATEGORY_ORDER` の順（Claude → Google → Codex → Copilot）で持つ
   - Providers 以外のドロップダウンは**リーフのみ**を持つ（サブグループを含まない）
   - 各カテゴリ/グループ内のリーフが `addedAt` 昇順 → `slug` 昇順で並ぶ
   - `buildNavLinks()` に未知の `group` を持つエントリを渡すと **throw する**（silent drop 禁止）
   - Providers エントリで `category` を欠くと throw する

3. `web-next/tests/phaseA.nav-links.test.ts`（書き換え）— 以下は**維持**:
   - `navLinks` / `NavLinkSchema` の export 形状
   - Zod 拒否ケース: `javascript:` href / プロトコル相対 `//` href / href も children も無いエントリ
   - 外部 URL（`http` 始まり）がナビに混入しない ← flatten を `collectNavHrefs` に差し替えて再帰化
   - Home 先頭 / What's New 末尾

   以下は**削除**（`nav-derivation.test.ts` が代替する）:
   - `navLinks.length === 18`、15 ドロップダウン名の直書き、Claude/Agent/MCP/IDE/Local LLM/RAG/
     Multimodal の子 href 配列の直書き

4. `web-next/components/site/SiteHeader.test.tsx` — `li.ch-dropdown` の期待値 15 → **5**
   （Providers + 4 グループ）。`li.ch-subdropdown` が **4**（Providers 配下）。
   `pathname="/claude/skill"` で **Providers トグルと Claude サブトグルの両方**に `ch-active` が付き、
   リーフ `a` に `aria-current="page"` が付くこと。

5. `web-next/components/site/SiteHeaderClient.test.tsx` — **サブトグルのクリックが親ドロップダウンを
   閉じない**ことを検証するテストを追加（Step 5 のリグレッション防止）。

6. `web-next/tests/page-registry-coverage.test.ts` — 追加アサーション:
   全エントリの `group` が `NAV_GROUPS` に含まれること、`group === "Providers"` の全件が
   `category` を持つこと。

7. `web-next/app/claude/skills-sh/page.test.tsx:110` / `web-next/app/agent/skills/page.test.tsx:94` /
   `web-next/app/claude/fable-5-best-practices/page.test.tsx:79` — 現在
   `navLinks.find(g => g.name === "Agent" | "Claude").children.find(c => c.href === ...)` と書かれており、
   Claude が Providers 配下へ移るため壊れる。`findNavLeaf(navLinks, "<href>")` に差し替える。

**Verify**: `cd web-next && bun run test` → **失敗する**（`nav-taxonomy.ts` が無く、ナビが未導出のため）。
失敗が「期待した新契約による失敗」であることを確認する（コンパイルエラーも可）。

**Commit**: `test(nav): add failing spec for registry-derived 2-level nav (F-4')`

---

### Step 3 [Green]: 分類定数 → registry 拡張 → ナビ導出 → 描画 の順に実装する

#### 3-1. `web-next/lib/nav-taxonomy.ts`（新規）

グループ/カテゴリの**並び順**と**どのグループをネストするか**だけを持つ。registry では表現できない
（registry のデータは slug 昇順）ため、順序はここが SSoT。

```ts
/** ナビのトップレベル。配列の順序がそのまま表示順になる。 */
export const NAV_GROUPS = [
  "Home",
  "Providers",
  "Agent 開発",
  "開発プロセス",
  "運用・品質",
  "モデル・データ",
  "What's New",
] as const;
export type NavGroup = (typeof NAV_GROUPS)[number];

/** 2 段ネストするグループ。Providers のみ（30 リンクあるため）。 */
export const NESTED_GROUPS = ["Providers"] as const satisfies readonly NavGroup[];

/** ネストするグループの 2 段目の並び順。 */
export const CATEGORY_ORDER: Partial<Record<NavGroup, readonly string[]>> = {
  Providers: ["Claude", "Google", "Codex", "Copilot"],
};

/** ドロップダウンを作らず単独リンクにするグループ（それぞれ 1 ページ）。 */
export const FLAT_GROUPS = ["Home", "What's New"] as const satisfies readonly NavGroup[];
```

#### 3-2. `web-next/lib/page-registry.ts`

- `group` を `z.string().min(1)` → `z.enum(NAV_GROUPS)` に締める（typo をビルド時に落とす）
- `category: z.string().min(1).optional()` を追加し、`.refine()` で
  **`group === "Providers"` なら `category` 必須**にする
- Providers の 30 エントリに `category: "Claude" | "Google" | "Codex" | "Copilot"` を付与
  （値は既存の `provider` と 1:1 だが、`provider` は識別子・`category` は表示ラベルとして分ける）
- **`group` の値は 1 件も変更しない**
- ファイル冒頭のコメント（12-13 行目）の「現時点では表示に影響しない」を、ナビ導出元である旨に更新

#### 3-3. `web-next/components/site/nav-links.ts`

**export 名（`navLinks` / `NavLinkSchema`）を維持したまま**、中身を手書きデータから導出に差し替える
（SiteHeader と 3 件の page.test.tsx の import が壊れないため）。

```ts
const SubGroupSchema = z.object({
  name: z.string().min(1),
  children: z.array(LeafSchema).min(1),
});

const DropdownSchema = z.object({
  name: z.string().min(1),
  // leaf と subgroup の混在を許す（subgroup を含むのは Providers のみ）
  children: z.array(z.union([LeafSchema, SubGroupSchema])).min(1),
});

export const NavLinkSchema = z.union([LeafSchema, DropdownSchema]);

/** 型ガードを export し、呼び出し側の `"children" in link` 散在を無くす。 */
export function isNavLeaf(node: NavNode): node is NavLeaf;
export function isNavSubGroup(node: NavNode): node is NavSubGroup;

/**
 * pageRegistry → ナビ木を組む純粋関数。
 * リーフは addedAt 昇順 → slug 昇順（決定論的）。
 * 未知の group / Providers の category 欠落は throw（silent drop でページがナビから消えるのを防ぐ）。
 */
export function buildNavLinks(entries: readonly PageEntry[] = pageRegistry): NavLink[];

export const navLinks: readonly NavLink[] = buildNavLinks().map((l) => NavLinkSchema.parse(l));
```

`hrefSchema` は既存のものをそのまま流用し、導出結果も `NavLinkSchema.parse` に通す（XSS ガード維持）。

#### 3-4. `web-next/components/site/SiteHeader.tsx`

- `isParentActive` を**再帰化**する。現状は `link.children.some((c) => isActivePath(c.href, ...))`
  （`SiteHeader.tsx:19-22`）で、サブグループには `href` が無いため `/claude/skill` を開いても
  Providers がハイライトされない
- 3 階層目を描画: `li.ch-subdropdown` > `button.ch-subdropdown-toggle` + `ul.ch-subsubmenu`
- **既存の `.ch-dropdown` クラスをサブグループに再利用しないこと**（理由は 3-5）

#### 3-5. `web-next/components/site/SiteHeaderClient.tsx` ⚠️ 最重要

`makeToggleHandler`（`SiteHeaderClient.tsx:58-68`）はクリックのたび `closeAllDropdowns()` を呼び、
`toggle.closest("li.ch-dropdown")` で親を特定する。**サブトグルが `li.ch-dropdown` を共有すると、
サブメニューを開いた瞬間に自分の親ドロップダウンごと閉じてしまう。**

- サブトグル専用のハンドラを追加し、`.ch-subdropdown-toggle` にのみ付ける
- 専用ハンドラは `closeAllDropdowns()` を**呼ばず**、同一 `ul.ch-submenu` 内の
  **兄弟サブドロップダウンだけ**を閉じる
- `closeAllDropdowns()` はサブドロップダウンも閉じるよう拡張する（Escape / 外側クリックで全階層が閉じる）
- クリーンアップ（`removeEventListener`）にサブトグル分を追加する

#### 3-6. `web-next/app/globals.css`

既存の `.ch-submenu`（1169-1215 行付近）に倣う:

- デスクトップ（`@media` の外 / hover 可）: `.ch-subdropdown:hover > .ch-subsubmenu` と
  `.ch-subdropdown-open > .ch-subsubmenu` で**右方向フライアウト**（`left: 100%; top: 0;`）
- モバイル（`.ch-links.ch-open` 側、1255 行以降）: **アコーディオンで字下げ**表示
- 既存の CSS 変数（`--color-*`）のみ使用し、新規カラートークンは追加しない

**Verify**: `cd web-next && bun run test` → **all pass**

**Commit**: `feat(nav): derive navigation from page registry with Providers sub-grouping`

---

### Step 4 [Refactor]: ビルド・型・リントを通す

重複の削除、可読性の改善のみ。振る舞いは変えない。

**Verify**（すべて exit 0）:

```bash
cd web-next && bun run typecheck
cd web-next && bun run lint
cd web-next && bun run build
```

`bun run build` は registry の Zod parse がビルド時に走るため、`category` 欠落や未知 `group` は
ここで必ず落ちる。

**Commit**: `refactor(nav): clean up nav derivation and header rendering`

---

### Step 5 [Docs Sync]: 仕様書を同期する

ソースコードの変更を一切含めないこと（TDD コミット分割ルール）。

1. **`.claude/rules/tdd-mandatory-cycle.md`** — ステップ 4「Docs Sync」が *HTML → Next.js ページ移行
   タスクの場合のみ* に限定されており、本件のような**ナビ / レジストリ / スキーマ変更では
   `docs/PROGRESS.md` 更新が発火しない**。発火区分を 2 つに整理する:
   - (a) ページ移行タスク → `docs/PROGRESS.md`（既存の判定基準は維持）
   - (b) **構造変更タスク**（`lib/page-registry.ts` / `components/site/nav-*` / 共有スキーマ /
     `plans/` の F-* 項目に紐づく作業）→ `docs/PROGRESS.md` + `plans/README.md` の Status 行 + `CLAUDE.md`

   併せて、ステップ 2（Green）に「**新規ページ追加は `page-registry.ts` への登録を含めて初めて Green**」を
   明記し（`page-registry-coverage.test.ts` が Red のまま残るのを防ぐ）、冒頭 `<ai_agent_directive>` に
   「`plans/NNN-*.md` を伴う作業は該当プランの Status 更新までを 1 サイクルに含める」を追記。
   ファイル末尾に `(最終更新日: YYYY-MM-DD)` を付与する（現状このファイルには日付が無く docs-sync の対象から漏れている）。

2. **`.claude/skills/docs-sync/SKILL.md`** — 3 つの穴を塞ぐ:
   - イベント C を「**ナビゲーション / レジストリ変更**」に改名し、更新マトリクスの C 列に
     `docs/PROGRESS.md`（テスト数）と `plans/README.md`（Status）を追加する
     （現状 C 列は CLAUDE.md / GEMINI.md のみ）
   - 「§1 現在のステータス情報の収集」に、ルート数と registry 件数の突合コマンドを追加:

     ```bash
     # E. ルート / レジストリの件数突合
     find web-next/app -type f -name page.tsx | wc -l
     grep -c '^    slug:' web-next/lib/page-registry.ts
     ```

   - 「§2 監査チェックリスト」に **`plans/README.md` 監査**（Status 列が実装実態と一致 /
     「次のアクション」欄が最新）を新設し、「修正とコミット規約」の `git add` 一覧に `plans/` を追加する
     （`plans/` は 2026-07-12 に Git 追跡へ復帰済み）
   - front matter の `description`（英語キーのまま）のトリガー語に `ナビゲーション変更`, `nav`,
     `page-registry`, `plans` を追加

3. **`plans/006-platform-roadmap-v2.md`** — §2.2 の数値を実測へ訂正（16 → 18、8 → 7）、
   「openclaw 移設」を不採用として訂正、§3 の Phase 2（F-4'）を実装済みへ更新、
   `nav-links.ts:22-25` のスキーマ参照を新スキーマに合わせる

4. **`plans/README.md`** — 008 行を DONE に更新

5. **`CLAUDE.md`** — 「重要な設計判断」に *ナビは page-registry からの導出（`nav-links.ts` への
   直書きは禁止）* を追記。`Updated` 日付を更新

6. **`GEMINI.md` / `docs/PROGRESS.md`** — テスト実測数と HEAD を同期

Markdown を編集したら `markdown-formatter` スキルの手順でリントし、エラー 0 件を保証する。

**Verify**:

```bash
# PII チェック（no-absolute-paths.md）— 出力が空であること
git diff --cached | grep -E '^\+[^+]' | grep -E '(/Users/|/home/|C:\\Users\\)'
```

**Commit**: `chore(docs): sync spec files — nav regrouping (F-4') + docs-sync/TDD rule coverage`

## Test plan

| ファイル | 内容 |
|---|---|
| `web-next/tests/nav-derivation.test.ts`（新規） | 全単射（registry ⇔ ナビ）、グループ順、Providers の 4 カテゴリ順、リーフの addedAt 昇順、未知 group で throw、Providers の category 欠落で throw |
| `web-next/tests/phaseA.nav-links.test.ts`（書き換え） | export 形状、Zod 拒否ケース（`javascript:` / `//` / orphan）、外部 URL 非混入（再帰 flatten）、Home 先頭 / What's New 末尾 |
| `web-next/components/site/SiteHeader.test.tsx` | ドロップダウン 5 / サブドロップダウン 4、ネストしたリーフのアクティブ判定（`/claude/skill` で Providers と Claude の両方） |
| `web-next/components/site/SiteHeaderClient.test.tsx` | サブトグルが親を閉じない、Escape / 外側クリックで全階層が閉じる |
| `web-next/tests/page-registry-coverage.test.ts` | `group ∈ NAV_GROUPS`、Providers 全件に `category` |
| `web-next/tests/a11y.test.tsx` | 3 階層メニューの `aria-haspopup` / `aria-expanded` |

構造の手本にするテスト: 既存の `web-next/tests/phaseA.nav-links.test.ts`（describe 単位で契約を分ける書き方）。

**Verification**: `cd web-next && bun run test` → all pass。

## Done criteria

ALL が満たされること:

- [ ] `cd web-next && bun run test` — all pass
- [ ] `cd web-next && bun run typecheck` — exit 0
- [ ] `cd web-next && bun run lint` — exit 0（新規違反ゼロ）
- [ ] `cd web-next && bun run build` — exit 0
- [ ] `cd scraper && uv run pytest` — all pass（無変更の確認）
- [ ] `grep -E -n 'href:\s*"/' web-next/components/site/nav-links.ts` — **マッチ 0 件**
      （手書きの href が全廃され、導出のみになっている）
- [ ] `git diff --name-only 29d929d..HEAD -- 'web-next/app/**/page.tsx'` — **空**（URL / ページ本体は不変）
- [ ] `netlify.toml` が未変更
- [ ] `plans/README.md` の 008 行が DONE
- [ ] 手動確認（下記）をユーザーが完了

### 手動確認（ユーザーが実施。Playwright は使用しない）

`rm -rf web-next/.next && cd web-next && bun run dev` → `http://localhost:3000`:

- トップレベルが 7 項目
- Providers ▾ → Claude / Google / Codex / Copilot の 4 サブメニューが hover で右にフライアウト
- **サブメニューを開いても親メニューが閉じない**（Step 3-5 のリグレッション）
- `/claude/skill` を直接開くと Providers と Claude の両方がハイライトされる
- モバイル幅（< 768px）でハンバーガー → アコーディオンが 3 階層まで開く
- Escape / 外側クリックで全階層が閉じる

## STOP conditions

以下に該当したら改善を試みず停止して報告する:

- Drift check で in-scope ファイルに差分があり、「現状」の抜粋と実コードが一致しない
- registry の `group` を変更しないと目標構造が組めないと判明した（設計の前提が崩れている）
- ナビ全単射テストが「registry に無いページ」または「ナビに出せないページ」を検出した
  （registry 側のデータ不備 — 勝手に registry を書き換えず報告する）
- 検証コマンドが、妥当な修正を 1 回試しても 2 回続けて失敗する
- 修正に out-of-scope のファイル（特に `app/**/page.tsx`, `netlify.toml`）の変更が必要に見える
- **`bun run build` は通るのに dev / 本番でナビの CSS が崩れる** → `.claude/rules/css-cache-reset.md`
  の Docker リビルド手順を先に試す。それでも直らなければ報告

## Maintenance notes

- **今後ページを追加する際**: `page-registry.ts` に登録すれば**ナビにも自動的に載る**。
  `nav-links.ts` を手で編集してはならない。グループを新設する場合のみ `lib/nav-taxonomy.ts` の
  `NAV_GROUPS` に追加する（順序も同時に決まる）
- **レビュアーが注視すべき点**: `SiteHeaderClient.tsx` のサブトグルのハンドラが
  `closeAllDropdowns()` を呼んでいないこと（呼ぶと親が閉じる）
- **本プランから意図的に外した後続作業**:
  - Providers 以外のグループの 2 段ネスト化 — 1 ページのカテゴリで 3 段ホバーが発生するため不採用（設計判断 2）
  - `topics` を使った横断導線（F-5 タグ・横断検索 / F-7 関連ページリンク）— 006 Phase 3 の担当。
    openclaw のような横断的ページの発見性はそちらで解決する

(最終更新日: 2026-07-18)
