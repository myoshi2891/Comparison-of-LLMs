---
name: nextjs-page-migration
description: >
  legacy/ 配下の静的 HTML ガイドページ（claude/, gemini/, codex/, copilot/, git_worktree.html）
  を web-next/ App Router の page.tsx へ TDD で移植する。
  「Phase A を進めて」「claude/skill を Next.js に移行」「legacy HTML を web-next へ」
  「共通ヘッダーを web-next に移植」と言われたときに使用する。
  共通ヘッダー（SiteHeader）／ディスクレイマー／ナビデータ（nav-links.ts）／CSS Modules 分離／
  shiki ビルド時ハイライト／Mermaid クライアント遅延ロード／netlify.toml 301 リダイレクトを
  プロジェクト固有パターンとして適用する。
invocation: explicit
allowed-tools:
  - Read
  - Grep
  - Glob
  - Edit
  - Write
  - Bash
---

# Next.js ページ移行スキル（Phase A–F）

## 概要

Phase 1–14 でコスト計算機ホームページは `web-next/` に移行済み。
本スキルは **残り 18 枚のガイドページ** と **共通インフラ**（ヘッダー・ディスクレイマー）を
`web-next/` App Router 配下へ TDD で移植する作業を標準化する。

## セッション開始時に必ず読むファイル（順序固定）

1. **`MIGRATION_PROGRESS.md`** — 現在地・残タスク・既知の留保事項
2. **このファイル（`.claude/skills/nextjs-page-migration/SKILL.md`）** — 9 ステップの移行手順と Phase 固有ルール

この 2 ファイルを読めば、`docs/NEXTJS_PHASE_A_F_PLAN.md` 本体は参照不要な粒度で着手できる。計画全体や設計判断の経緯を追う必要がある場合のみ Plan を開く。

関連ドキュメント（必要時のみ参照）:

- `docs/NEXTJS_PHASE_A_F_PLAN.md` — Phase A–F 全体計画（設計判断・スコープ・工数）
- `docs/NEXTJS_MIGRATION_PLAN.md` — Phase 1–14 アーキテクト初期プロンプト（凍結）

## Phase と入出力の対応

| Phase | 入力（legacy/ 側） | 出力（web-next/ 側） |
|-------|-------------------|----------------------|
| A | `legacy/shared/common-header.js`, `common-header.css`, `nav-links.json` | `components/site/SiteHeader.tsx` + `SiteHeaderClient.tsx` + `DisclaimerBanner.tsx` + `nav-links.ts`, `app/layout.tsx` 統合 |
| B | `legacy/{claude,gemini,codex,copilot}/skill.html` × 4 | `app/{claude,gemini,codex,copilot}/skill/page.tsx` × 4 |
| C | `legacy/{claude,gemini,codex,copilot}/agent.html` × 4 | `app/{claude,gemini,codex,copilot}/agent/page.tsx` × 4 |
| D | `legacy/claude/skill-guide-for-claude.html` 他 9 枚 | `app/claude/skill-guide/page.tsx` 他 9 枚（clean URL） |
| E | `legacy/git_worktree.html` | `app/git-worktree/page.tsx`（Mermaid 遅延ロード付き） |
| F | — | `netlify.toml [[redirects]]` 一括追加 + sitemap 更新 |

## URL 命名規約

- `.html` 拡張子は URL に含めない（clean URL）
- `-for-claude` / `-for-gemini` などの冗長サフィックスは drop（ディレクトリで分離済みのため）
- 例:
  - `legacy/claude/skill-guide-for-claude.html` → `/claude/skill-guide`
  - `legacy/claude/skill-guide-for-claude-intermediate.html` → `/claude/skill-guide-intermediate`
  - `legacy/git_worktree.html` → `/git-worktree`
- 旧 URL からの 301 リダイレクトは **Phase F で一括**登録する（個別ページ作業中には追加しない）

## Phase A の前提チェックリスト（Phase B 以降着手時）

Phase A は **完了済み**（Green 最終 commit `db67dd0`）。以下はすべて `web-next/` にマウント済みのため、
Phase B 以降のページは `<SiteHeader />` / `<DisclaimerBanner />` を **ページ側で再インクルードしない**:

- [x] `web-next/components/site/SiteHeader.tsx` + `SiteHeaderClient.tsx` — `app/layout.tsx` にマウント済
- [x] `web-next/components/site/DisclaimerBanner.tsx` — `<body>` 冒頭に描画済
- [x] `web-next/components/site/nav-links.ts` — 既存移行先 URL を Zod `NavLinkSchema[]` で保持

新規ページを `nav-links.ts` へ追加するときは **同ファイルを編集**（親ディレクトリ単位でのドロップダウンに追記）。
`legacy/shared/common-header.js` は編集しない（`.gitignore` 済・凍結）。

## 1 ページ移行の標準手順

### Step 1: 対象 legacy HTML の構造把握

```bash
# 対象ファイルの全体像
wc -l legacy/<provider>/<file>.html
```

`Read` で冒頭 100 行と末尾 50 行を確認。`<section>` / `<h2>` / `<pre><code>` / `<mermaid>` の数と配置を把握する。

### Step 2: ルーティング戦略の決定

- 単発ページ → `app/<provider>/<slug>/page.tsx`
- 関連ページ群（例: skill-guide の基礎編と中級編） → 共通レイアウトに `app/<provider>/skill-guide/layout.tsx` を検討
- `components/docs/DocLayout.tsx` が既にある場合は再利用、ない場合は Phase D 着手時に新設

### Step 3: [Red] 契約テストの作成

`app/<provider>/<slug>/page.test.tsx` を作成。最低限以下の 5 契約を書く:

1. `render(<Page />)` でタイトル（`<h1>`）のテキスト完全一致
2. 主要セクション数（`<h2>` の count）
3. 外部リンクに `target="_blank"` と `rel="noopener noreferrer"` が両方付与されている
4. 内部リンクが clean URL（`.html` なし）である
5. コードブロックに `language-*` クラスが付与されている（shiki 適用の前段確認）

参考実装: `web-next/components/Hero.test.tsx` の `render() + querySelector` パターン。

### Step 4: [Green] page.tsx の実装

> **R2（faithful 必須、Phase C-2 で確定）**: legacy HTML の **全リスト項目・全コードブロック・全 SVG・全 alert・全 table** を
> JSX に転写すること。要約・省略・縮約は禁止。「契約テストが通る最小骨格」だけで Green を終わらせず、必ず legacy 全文を
> 移植する。詳細は `MIGRATION_PROGRESS.md` §「AI 作業ルール R2」を参照。

- **Server Component デフォルト**。Phase B（skill.html）では動的 UI が不要なため `"use client"` を一切使わない構成が
  `/claude/skill`（`8515ec3`）と `/gemini/skill`（`037f45f`）で成立している。Phase C の agent.html 移植で
  `useState` が必要になった場合のみ Client 分離を検討する
- スタイル優先順位: Tailwind ユーティリティ → CSS Modules（`page.module.css`） → global CSS（避ける）
- 外部リンクは `<a href="..." target="_blank" rel="noopener noreferrer">` を厳守
- **ファイルレイアウト規約（B-1/B-2 で確立）**: `app/<provider>/<slug>/` 配下に
  `page.tsx` / `page.module.css` / `page.test.tsx` の 3 点セットを **コロケーション**配置する
  （独立ディレクトリにすることで `page.module.css` のクラス名衝突を自然に分離できる）
- 新たに i18n キーを追加した場合、`lib/i18n.test.ts` の `expect(Object.keys(T).length).toBe(N)` を
  **同じコミット内で N+k に更新**すること（B-1 で key count ドリフトが発生、別 commit `b984f16` で後追い同期した）

### Step 5: コードブロック（shiki）

build-time ハイライトとして `shiki` を採用する。

- RSC 内で `async` ページコンポーネントから `shiki` の highlighter を取得し、Markdown/source を事前 HTML 化する
- 得た HTML を React 要素として埋め込む際の **安全な流し込み API** の使い方は
  既存の `web-next/components/CodeBlock.tsx`（Phase A Green で導入済み）を参照すること。
  本 SKILL.md 内には該当 API のリテラル記述を置かない（XSS 監査の false positive 防止のため）
- 入力はビルド時に確定する値（リポジトリ内ファイル）のみを許容し、ユーザー入力はハイライト対象に含めない

### Step 6: Mermaid ダイアグラム（Phase E）

- `components/docs/MermaidDiagram.tsx`（導入予定：Phase E）が `next/dynamic` で `ssr: false` の
  クライアント遅延ロードを提供する
- Mermaid 記述は **左端揃え必須**（HTML インデントが混じると構文エラー）— legacy/ から
  貼り直す際はインデント除去を機械的に行う
- `<marker>` 色は対応 `<line>` の `stroke` 色と一致させる（SVG 部分）

### Step 7: [Refactor] 共通化判断

以下に該当するなら `components/docs/` への抽出を検討:

- 3 ページ以上で重複する UI パターン（例: 警告バナー、TOC、コピー可能コード）
- マーケティング向けではなく「ガイドの構造要素」として再利用されるもの

2 ページ以下の場合は抽出せず、ページ固有で残す。

### Step 8: ローカル検証

```bash
cd web-next
bun run lint        # Biome
bun run typecheck   # tsc --noEmit
bun run test        # vitest
bun run build       # Next.js production build (out/ 生成)
```

**全通過** が必須。部分 pass でコミットしない。

### Step 9: Phase F の redirect 記録

移行完了ページは `docs/NEXTJS_PHASE_A_F_PLAN.md` の「Phase F redirect 一覧」セクションに
`[旧URL] → [新URL]` を追記する。redirect の netlify.toml への実反映は Phase F 一括で行う。

## Phase A 特有のルール

- `SiteHeader` は **Server Component**（構造の RSC）と **SiteHeaderClient**（ハンドラ専用 Client）に分離
- 分離理由: `pathname` による active 判定は RSC で解決でき、Client には **hamburger / dropdown のトグルとキーボード処理だけ**を閉じ込める
- `navLinks` は Zod `NavLinkSchema[]` で parse 成功する必要がある（XSS ガードを型レベルで担保）
- GitHub 外部リンクは `navLinks` に含めず、`app/layout.tsx` から直接注入する（責務分離）

## 回帰防止ルール

- `legacy/` は `.gitignore` 済み。ローカルで編集しても push されない
- `.gitignore` より先に commit 済みの legacy/ ファイルは HEAD に残存しているため、Phase F までは
  削除せず参照用として保持する（Phase F でも物理削除は行わない）
- 新規ガイドページを `legacy/` 配下に書かない（web-next 側のみに作成）

## セッション終了前の仕様書同期

1セクション移植コミットが完了したタイミング、またはコンテキスト逼迫を感じたタイミングで
**必ず** `MIGRATION_PROGRESS.md` を更新してコミットする。

手順の詳細は `.claude/rules/migration-progress-sync.md` を参照。
更新対象: `現在地`（HEAD・次の作業・テスト数）+ `次回セッションでの再開プロンプト`。

## pre-commit-check スキルとの連携

各ページ完了時に `/pre-commit-check` で以下を確認する:

- `cd web-next && bun run build` 成功
- `cd web-next && bun run test` 全通過
- `cd scraper && uv run pytest` 全通過（pricing.json への影響がない変更でも回帰確認）

いずれか失敗 → **停止してユーザーに確認**。自動修正しない。

## 判定基準

| 結果 | アクション |
| --- | --- |
| 全ステップ成功 + pre-commit-check pass | コミット OK と報告し、次ページに進む |
| 単体テスト失敗 | テストの意図を確認し、実装かテストかどちらが誤りか判断 |
| ビルド失敗 | 停止。import / 型エラーを最小差分で修正 |
| lint エラー | Biome の指示通りに修正（`bun run lint:fix` は使わず手動）|
| 設定ファイルの意図しない変更 | 停止してユーザー確認 |

## Phase C 確立パターン（C-3 完成物から抽出・再読不要）

> **目的**: `web-next/app/codex/agent/page.tsx`（C-3 完成物）を毎セッション Read するコストを省く。
> 以下のパターンをそのまま使えば C-3 を参照する必要はない。

### 型定義・定数

```tsx
type Source = {
  icon: string;
  title: string;
  href: string;
  url: string;
  desc: string;
};

// TOC items は移行対象ページのセクション構造に合わせて作成
const TOC_ITEMS = [
  { id: "s01", label: "1. ..." },
  // ... セクション数分
  { id: "sources", label: "📚 参考ソース" },
] as const;
```

### Ext ヘルパー（外部リンク、毎ページ必須）

```tsx
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
```

### コードブロック（React の生 HTML 注入 prop 禁止）

生 HTML 注入 prop（`["danger","ously","Set","Inner","HTML"].join("")` で CI が検査）は使用禁止。
コードブロック内のシンタックスハイライトはすべてネストした JSX `<span>` で表現する:

```tsx
<div className={styles.codeWrap}>
  <div className={styles.codeBar}>
    <span>ファイル名.md</span>
    <span className={styles.codeLang}>YAML</span>
  </div>
  <div className={styles.codeBody}>
    <span className={styles.cs}>---</span>
    {"\n"}
    <span className={styles.cm}>name</span>
    {": "}
    <span className={styles.cv}>'My Agent'</span>
    {"  "}
    <span className={styles.cc}># コメント</span>
    {"\n"}
    <span className={styles.cs}>---</span>
    {"\n\n"}
    {"本文テキスト"}
  </div>
</div>
```

**コードハイライト用クラス早見表**（`styles.` を前置して使用）:

| クラス | 色 | 用途 |
|---|---|---|
| `ck` | 赤 `#ff7b72` | キーワード |
| `cs` | 薄青 `#a5d6ff` | 文字列・区切り |
| `cv` | 青 `#79c0ff` | 値 |
| `cc` | グレー斜体 `#3b4750` | コメント |
| `ch` | オレンジ太字 `#f0883e` | 見出し |
| `cm` | 緑太字 `#7ee787` | マーカー・セクション |
| `cw` | 黄 `#d29922` | 警告・重要語 |
| `ce` | 紫 `#bc8cff` | 列挙・特殊 |
| `cg` | 明緑 `#3fb950` | 成功・肯定 |

### TOC nav（合成 — legacy HTML に存在しないため追加）

```tsx
<nav className={styles.toc}>
  <div className={styles.tocTitle}>目次</div>
  {TOC_ITEMS.map((item) => (
    <a key={item.id} href={`#${item.id}`}>
      {item.label}
    </a>
  ))}
</nav>
```

### ネスト sec の展開規則

legacy HTML で 1 つの `<div class="sec">` 内に複数のサブ見出し `<div class="sec-head" style="...">` が含まれる場合（C-4 の s04〜s13 相当）:

```tsx
{/* 外側 sec の冒頭コンテンツ → s04 */}
<section id="s04" className={styles.sec}>
  <div className={styles.secHead}>{/* 外側 sec の h2 */}</div>
  {/* 概念カード等 */}
</section>

{/* サブ見出し 1 つ目 → s05（外側 sec とは独立した flat section）*/}
<section id="s05" className={styles.sec}>
  <div
    className={styles.secHead}
    style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px solid var(--border2)" }}
  >
    <h2 style={{ fontSize: "1.1rem" }}>4-1. ...</h2>
  </div>
  {/* コンテンツ */}
</section>
```

### SVG 属性変換規則

| HTML 属性 | JSX 属性 |
|---|---|
| `text-anchor` | `textAnchor` |
| `font-family` | `fontFamily` |
| `font-size` | `fontSize` |
| `font-weight` | `fontWeight` |
| `letter-spacing` | `letterSpacing` |
| `stroke-width` | `strokeWidth` |
| `fill-opacity` | `fillOpacity` |
| `stop-color` in `style=` | `style={{ stopColor: '...' }}` |
| `pointer-events` | `pointerEvents` |
| `style="display:block;"` | `style={{ display: 'block' }}` |

SVG には必ず `role="img"` + `aria-label` + `<title>` を付与（Biome `noSvgWithoutTitle` 対応）。

### CSS Module 複合クラス（chained selector）の適用方法

```tsx
{/* .navPill.green → */}
<span className={`${styles.navPill} ${styles.green}`}>Agent Mode</span>

{/* .hfBtn.auto → */}
<div className={`${styles.hfBtn} ${styles.auto}`}>自動→</div>
```

## 注意事項

- このスキルは `invocation: explicit` — `/nextjs-page-migration` での手動呼び出しのみ
- Phase A–F を飛ばして並列着手しない（SiteHeader が未完成の状態で Phase B を進めると大量の手戻りが発生する）
- Playwright MCP は使用しない（プロジェクトルールに従う）。視覚確認はユーザーがブラウザで手動実施
