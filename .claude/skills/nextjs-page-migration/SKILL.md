---
name: nextjs-page-migration
description: >
  Migrate static HTML guide pages from legacy/ to web-next/ App Router page.tsx using TDD.
  Phase A–F is fully complete. Use this skill for new guide pages or maintenance of
  existing migrated pages.
  TRIGGER when the user says any of the following (Japanese or English):
  - "新規ガイドページを追加" / "ガイドページを移行" / "ページを保守"
  - "add new guide page" / "migrate guide page" / "nextjs page migration"
  Applies project-specific patterns: SiteHeader, DisclaimerBanner, nav-links.ts,
  CSS Modules, shiki build-time highlighting, Mermaid lazy loading.
invocation: explicit
allowed-tools:
  - Read
  - Grep
  - Glob
  - Edit
  - Write
  - Bash
---

# Next.js ガイドページ追加・保守スキル

## 概要

Phase A–F で 18 枚のガイドページが `web-next/` App Router に**全移行完了**。
本スキルは **新規ガイドページの追加**または**既存ページの保守・改善**を TDD で標準化する。

**前提**: `SiteHeader` / `DisclaimerBanner` は `app/layout.tsx` にマウント済み。
ページ側で再インクルードしない。新ページは `nav-links.ts` に追記して登録する。

## セッション開始時に必ず読むファイル（順序固定）

1. **`docs/PROGRESS.md`** — 現在の保守フェーズのステータス・テスト数・ネクストアクション
2. **このファイル** — 標準手順と実装パターン
3. **`.claude/rules/tdd-mandatory-cycle.md`** — TDD 必須サイクル & コミット分割ルール

---

## TDD 必須サイクルの適用（最重要）

常に TDD サイクル（**Red → Green → Refactor → Docs**）を**最優先**で適用する。

1. **task.md 作成時**: 各コミットを「Red」「Green」「Refactor」「Docs Sync」単位に構造化する
2. **実装前（Red）**: `page.tsx` を実装する**前**に失敗するユニットテストを作成してコミットする
3. **一括コミット禁止**: テスト・実装・カバレッジ更新・ドキュメント更新を 1 コミットにまとめない

---

## 新規ページ追加の標準手順

### Step 1: [Red] 契約テストの作成

`app/<provider>/<slug>/page.test.tsx` を作成。最低限以下の 5 契約を書く:

1. `render(<Page />)` でタイトル（`<h1>`）のテキスト完全一致
2. 主要セクション数（`<h2>` の count）
3. 外部リンクに `target="_blank"` と `rel="noopener noreferrer"` が両方付与されている
4. 内部リンクが clean URL（`.html` なし）である
5. コードブロックに `language-*` クラスが付与されている（shiki 適用の前段確認）

参考実装: `web-next/components/Hero.test.tsx` の `render() + querySelector` パターン。

### Step 2: [Green] page.tsx の実装

> **faithful 必須**: ソース HTML の **全リスト項目・全コードブロック・全 SVG・全 alert・全 table** を
> JSX に転写すること。要約・省略・縮約は禁止。

- **Server Component デフォルト**。`"use client"` は `useState` が必要な場合のみ
- スタイル優先順位: Tailwind ユーティリティ → CSS Modules（`page.module.css`） → global CSS（避ける）
- **ファイルレイアウト**: `app/<provider>/<slug>/` 配下に `page.tsx` / `page.module.css` / `page.test.tsx` の 3 点セットをコロケーション配置
- 新たに i18n キーを追加した場合、`lib/i18n.test.ts` の `expect(Object.keys(T).length).toBe(N)` を同じコミット内で更新する

#### JSX 変換 Pitfalls チェックリスト

| 問題 | NG 例 | OK 例 |
|------|-------|-------|
| `class` 属性 | `class="foo"` | `className="foo"` |
| `for` 属性 | `for="id"` | `htmlFor="id"` |
| void 要素の閉じ | `<br>` `<img>` | `<br />` `<img />` |
| HTML コメント | `<!-- comment -->` | `{/* comment */}` |
| インラインスタイル | `style="font-family: var(--f)"` | `style={{ fontFamily: 'var(--f)' }}` |
| `{"\n"}` 改行 | `<span>A</span>{"\n"}<span>B</span>` | `<div className={styles.codeLine}>…</div>` でラップ |
| デシジョンテーブルのスペース揃え | スペースで列幅を合わせる | `<table>` 要素へ変換 |
| `<main>` ラッパー追加 | `<main>…</main>` | 不要（`layout.tsx` が管理） |
| 生 HTML 注入 | `dangerouslySetInnerHTML` | ネストした JSX `<span>` で表現（下記参照） |
| SVG に title/aria なし | `<svg>…</svg>` | `<svg role="img" aria-label="…"><title>…</title>…</svg>` |

#### コードブロック内の行区切りパターン

`.code-block` のデフォルト `white-space` は `normal` のため `{"\n"}` はスペースに正規化される。
各行を `<div className={styles.codeLine}>` でラップすること（`.codeLine` には `white-space: pre` が定義済み）。

```tsx
{/* ❌ NG */}
<div className={styles.codeBody}>
  <span className={styles.ck}>const</span>{"\n"}
  <span className={styles.cv}>value</span>
</div>

{/* ✅ OK */}
<div className={styles.codeBody}>
  <div className={styles.codeLine}><span className={styles.ck}>const</span><span className={styles.cv}> value</span></div>
  <div className={styles.codeLine}><span className={styles.cv}>= 42</span></div>
</div>
```

#### SVG 属性変換規則

| HTML 属性 | JSX 属性 | HTML 属性 | JSX 属性 |
|---|---|---|---|
| `text-anchor` | `textAnchor` | `stroke-width` | `strokeWidth` |
| `font-family` | `fontFamily` | `fill-opacity` | `fillOpacity` |
| `font-size` | `fontSize` | `pointer-events` | `pointerEvents` |
| `font-weight` | `fontWeight` | `stop-color` in `style=` | `style={{ stopColor: '...' }}` |
| `letter-spacing` | `letterSpacing` | `style="display:block;"` | `style={{ display: 'block' }}` |

SVG には必ず `role="img"` + `aria-label` + `<title>` を付与（Biome `noSvgWithoutTitle` 対応）。

### Step 3: コードブロック（shiki）

build-time ハイライトとして `shiki` を採用する。

- RSC 内の `async` ページコンポーネントから `shiki` highlighter を取得し事前 HTML 化する
- 安全な流し込み API の使い方は既存の `web-next/components/CodeBlock.tsx` を参照すること
  （SKILL.md 内にリテラル記述しない — XSS 監査の false positive 防止）
- 入力はビルド時に確定する値のみ（ユーザー入力はハイライト対象に含めない）

**コードハイライト用クラス早見表**（`styles.` を前置して使用）:

| クラス | 色 | 用途 | クラス | 色 | 用途 |
|---|---|---|---|---|---|
| `ck` | 赤 `#ff7b72` | キーワード | `cm` | 緑太字 `#7ee787` | マーカー・セクション |
| `cs` | 薄青 `#a5d6ff` | 文字列・区切り | `cw` | 黄 `#d29922` | 警告・重要語 |
| `cv` | 青 `#79c0ff` | 値 | `ce` | 紫 `#bc8cff` | 列挙・特殊 |
| `cc` | グレー斜体 `#3b4750` | コメント | `cg` | 明緑 `#3fb950` | 成功・肯定 |
| `ch` | オレンジ太字 `#f0883e` | 見出し | | | |

### Step 4: Mermaid ダイアグラム

- `components/docs/MermaidDiagram.tsx` を直接インポートして通常通り使用する（内部で動的インポート済み）
- テーマは **`theme: "dark"`** を設定する
- 記述は **左端揃え必須**（インデントが混じると構文エラー）
- `globals.css` に Mermaid 補正 CSS 適用済み。新規図解で読みにくい場合のみ追記する

### Step 5: [Refactor] 共通化判断

- **3 ページ以上**で重複する UI パターン → `components/docs/` への抽出を検討
- 2 ページ以下 → ページ固有で残す

### Step 6: ローカル検証

```bash
cd web-next
bun run lint        # Biome（変更ファイル単位でパス指定）
bun run typecheck   # tsc --noEmit
bun run test        # vitest
bun run build       # Next.js production build
```

**全通過** が必須。部分 pass でコミットしない。

### Step 7: nav-links.ts / ドキュメント同期

**nav-links.ts への登録**（必須）:

```typescript
// web-next/components/site/nav-links.ts
{ href: '/<provider>/<slug>', label: 'ページ表示名', category: '<category>' },
```

**CLAUDE.md / GEMINI.md への追記**（必須）:

```markdown
- `app/<provider>/<slug>/page.tsx` — ページの説明
```

---

## 再利用パターン集

### Ext ヘルパー（外部リンク）

```tsx
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
```

### コードブロック構造

```tsx
<div className={styles.codeWrap}>
  <div className={styles.codeBar}>
    <span>ファイル名.md</span>
    <span className={styles.codeLang}>YAML</span>
  </div>
  <div className={styles.codeBody}>
    <div className={styles.codeLine}><span className={styles.cs}>---</span></div>
    <div className={styles.codeLine}>
      <span className={styles.cm}>name</span>
      <span>{": "}</span>
      <span className={styles.cv}>{'My Agent'}</span>
    </div>
  </div>
</div>
```

### TOC nav

```tsx
<nav className={styles.toc}>
  <div className={styles.tocTitle}>目次</div>
  {TOC_ITEMS.map((item) => (
    <a key={item.id} href={`#${item.id}`}>{item.label}</a>
  ))}
</nav>
```

### CSS Module 複合クラス

```tsx
<span className={`${styles.navPill} ${styles.green}`}>Agent Mode</span>
```

---

## WAI-ARIA パターン（インタラクティブ UI）

使い分け早見表:

| UI パターン | 正しい ARIA | 誤りやすい代替 |
|---|---|---|
| チェックボタン (on/off) | `aria-pressed={bool}` | `aria-checked`, `aria-selected` |
| タブ切り替え | `role="tab"` + `aria-selected` | `aria-pressed`, `aria-current` |
| ステップ現在地 | `aria-current="step"` | `aria-selected`, `aria-pressed` |

**タブ UI（Roving tabindex パターン）**:

```tsx
<div role="tablist">
  {TABS.map((t) => (
    <button
      key={t.id}
      id={`tab-${t.id}`}
      role="tab"
      aria-selected={active === t.id}
      aria-controls={`panel-${t.id}`}
      tabIndex={active === t.id ? 0 : -1}
      onClick={() => setActive(t.id)}
    >
      {t.label}
    </button>
  ))}
</div>
<div id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`}>
  ...
</div>
```

**ステップ現在地**: `aria-current={isActive ? "step" : undefined}` — `undefined` で属性自体を消す（`false` だと `aria-current="false"` が出力される）。

---

## セッション終了前の仕様書同期（必須）

<ai_agent_directive>
**AI エージェントへの厳格な指示**: 以下のプロセスは**ゲート条件（Gate Condition）**です。タスクの報告を行う前に、ユーザーの許可を待たずに**自律的かつ自動的に、ステップバイステップでコミットまで完了させてください**。ルールに反してコミットを後回しにすることは禁止されています。
</ai_agent_directive>

1 ページの `git commit` 完了後、次の作業を始める前に必ず実施する:

```bash
cd web-next && bun run build && bun run lint && bun run test
```

全通過後、`docs/PROGRESS.md` のテスト数・次の作業・再開プロンプトを更新してコミットする。
詳細は `.claude/rules/migration-progress-sync.md` を参照。

---

## 判定基準

| 結果 | アクション |
| --- | --- |
| 全ステップ成功 + テスト全通過 | コミット OK と報告し、次ページに進む |
| 単体テスト失敗 | テストの意図を確認し、実装かテストかどちらが誤りか判断 |
| ビルド失敗 | 停止。import / 型エラーを最小差分で修正 |
| lint エラー | 変更ファイル単位でパス指定して修正（`bun run lint:fix` 引数なし禁止） |
| 設定ファイルの意図しない変更 | 停止してユーザー確認 |

---

## Constraints（禁止事項）

- **`<SiteHeader>` / `<DisclaimerBanner>` をページ側で再インクルードしない** — `layout.tsx` が提供
- **`"use client"` を不必要に使わない** — Server Component デフォルト
- **生 HTML 注入 prop を使わない** — JSX `<span>` でシンタックスハイライトを表現
- **`{"\n"}` を `.code-block` 内の改行に使わない** — `<div className={styles.codeLine}>` でラップ
- **スペース揃えで tabular data を表現しない** — `<table>` 要素へ変換
- **`bun run lint:fix`（引数なし）を実行しない** — 変更ファイル単位でパス指定（R1 ルール）
- **外部フォントを `<link>` タグで読み込まない** — `next/font/google` のみ（`layout.tsx`）
- **`@layer components` を page-specific styles に使わない** — plain CSS で specificity を確保
- **`@keyframes` にキャメルケースを使わない** — kebab-case 必須（`fadeUp` → `fade-up`）
- **z-index を CSS と Tailwind クラスの両方で指定しない** — 単一ソース原則
- **SVG に `role="img"` + `aria-label` + `<title>` を省略しない** — Biome `noSvgWithoutTitle` 違反
- **Playwright MCP ツールを使わない** — 視覚確認はユーザーが手動で実施
- **新規ガイドページを `legacy/` 配下に作成しない** — `web-next/app/` 側のみに作成する
