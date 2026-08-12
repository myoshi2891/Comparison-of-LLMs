---
name: nextjs-page-migration
description: >
  Migrate static HTML guide pages from legacy/ to web-next/ App Router page.tsx using TDD.
  Phase A–F is fully complete. Use this skill for new guide pages or maintenance of
  existing migrated pages.
  TRIGGER when the user says any of the following (Japanese or English):
  - "新規ガイドページを追加" / "ガイドページを移行" / "ページを保守"
  - "add new guide page" / "migrate guide page" / "nextjs page migration"
  - guide-page layout/centering maintenance: "図解が左寄せ" / "図解を中央寄せ" /
    "コンテンツが左寄り" / "本文の幅がバランス悪い" / "diagram not centered" /
    "content column width" (both Mermaid and hand-coded flex/HTML diagrams)
  - design mismatch: "デザイン違う" / "スタイルがおかしい" / "テーブルヘッダーの色が" /
    "calloutの色が" / "stepTagが" / "voiceのスタイルが" / "コードブロックの色" /
    "図解の色が違う" / "ハイライトが効いていない"
  Applies project-specific patterns: SiteHeader, DisclaimerBanner, nav-links.ts,
  CSS Modules, shiki/token build-time highlighting, Mermaid lazy loading, diagram
  centering (Mermaid + hand-coded), and the 1440px content-width policy.
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

(最終更新日: 2026-08-11)

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

## ⚠️ テスト実行コマンド（最重要・必読）

```bash
# ✅ 正しい（vitest 経由 — jsdom 環境が適用される）
cd web-next && bun run test

# ❌ 禁止（Bun ネイティブランナー — jsdom なし → document is not defined で全滅）
bun test app/some/page.test.tsx
```

**`bun test` と `bun run test` は全く別コマンド。**
`bun test` は `vitest.config.ts` を無視するため、`environment: "jsdom"` が効かず
`document is not defined` エラーが発生し metadata テスト以外が全失敗する。
**必ず `bun run test` を使うこと。**

---

## TDD 必須サイクルの適用（最重要）

常に TDD サイクル（**Red → Green → Refactor → Docs**）を**最優先**で適用する。

1. **task.md 作成時**: 各コミットを「Red」「Green」「Refactor」「Docs Sync」単位に構造化する
2. **実装前（Red）**: `page.tsx` を実装する**前**に失敗するユニットテストを作成してコミットする
3. **一括コミット禁止**: テスト・実装・カバレッジ更新・ドキュメント更新を 1 コミットにまとめない

---

## 新規ページ追加の標準手順

### Step 1: [Red] 契約テストの作成

`app/<provider>/<slug>/page.test.tsx` を作成。
ファイル先頭に `// @vitest-environment jsdom` を記述し、環境を明示する。

最低限以下の **8 + 4 契約（回帰防止テスト + デザイン契約テスト）** を書く:

**コンテンツ契約テスト（8件）**:

1. `render(<Page />)` でタイトル（`<h1>`）のテキスト完全一致
2. 主要セクション数（`<h2>` の count）および各セクションタイトル・アンカー ID 存在検証
3. サブセクション/レイヤー見出し（`<h3>`）の存在検証
4. クイックナビゲーション（TOC リンク）の件数・アンカー指向（`href="#..."`）検証
5. サイドバー TOC の初期アクティブ状態（`styles.active`）の存在検証
6. `TocObserver.test.tsx` で `fireEvent.scroll` を使い、スクロール時にアクティブクラスが正しく切り替わることを単体検証
7. 外部リンクに `target="_blank"` と `rel="noopener noreferrer"` が両方付与されていること
8. 全 Mermaid 図解が専用ラッパーに包まれて配置されていること

**デザイン契約テスト（4件）— 必須追加**:
9. `callout` が `data-variant="info"/"warn"/"good"` で区別され、各 variant が存在すること
10. `callout.warn` が `data-variant="warn"` を持ち、`callout-label` 子要素があること
11. `stepTag` が `data-testid="step-tag"` を持ち全セクション数と一致すること
12. `voice/blockquote` が `data-testid="voice"` を持ち `voice-who` 子要素があること

> 詳細実装: `references/design-contract-tests.md`
> 参考実装: `web-next/app/codex/openai-codex-guide/page.test.tsx`
> TocObserver 参考実装: `web-next/app/codex/openai-codex-guide/TocObserver.test.tsx`

### Step 2: [Green] page.tsx の実装

> [!CAUTION]
> **100% 完全移植ルール（絶対ルール）**:
> ソース HTML / Markdown の **要約・省略・縮約・部分抽出・代表例のみの記述は重大な規約違反** である。
> 元ファイルの全セクション、全サブセクション、全リード文・本文段落、全リスト項目、全コードブロック、全 SVG、全 callout/alert、全 table、全参考文献/外部リンクを、何一つ落とさずに **100% 漏れなく JSX へ完全転写** すること。

- **Server Component デフォルト**。`"use client"` は `useState` が必要な場合のみ
- **ファイルレイアウト**: `app/<provider>/<slug>/` 配下に `page.tsx` / `page.module.css` / `page.test.tsx` / `TocObserver.tsx` の 4 点セット

#### 🎨 スタイリング・コンポーネント防犯原則（過去の手戻りを全網羅）

| 対象 | 原本 HTML（正） | よくある誤り（絶対禁止） | 対策 |
|---|---|---|---|
| **インライン `code`** | 淡青背景＋濃青文字 (`var(--accent-soft)`) | 単色・文字のみ・ダーク背景 | `.layout :global(code)` に `background`/`color` 設定 |
| **コードブロック構文ハイライト** | 鮮やかなマルチカラー (紫/青/緑/黄/赤/グレー) | 単色プレーンテキスト放置 | JSX 内で `.ck`, `.cv`, `.cs`, `.cw`, `.cc`, `.cm` の `<span>` トークン化 |
| **コードブロック行改行** | `<div className={styles.codeLine}>` で1行毎ラッパー | 生テキスト直接配置 (`\n` 崩れ) | `.codeLine` (`white-space: pre`) で完全に囲む |
| **Mermaid 図解テーマ** | 原本の `theme: 'base'` (白/青/金ライトテーマ) | デフォルトの `dark` (真っ黒) | `MermaidDiagram` に `theme="base"` と `themeVariables` を明示渡し |
| **運用チェックリスト** | 原本 HTML のリスト／カード／表構造 | 原本と異なる構造への変換 | `openai-codex-guide` の縦1列リストを含め、原本の構造と CSS をそのまま転写 |
| **callout.warn** | 赤系背景 (`var(--danger-soft)`) | 黄色/金系 (`gold-soft`) | `danger-soft` (#fbebe6) を正しく適用 |
| **thead th** | 青系背景 (`var(--accent-soft)`) | ベージュ背景 (`var(--bg)`) | `thead th` に `var(--accent-soft)` を上書き定義 |

#### ⚠️ CSS Module 地雷チェックリスト

**① CSS変数は必ず `page.module.css` の最上位セレクタ内に定義する**
`globals.css` に存在しない変数は必ず `.layout` / `.root` スコープに転写する。

**② 全列左寄せアライメント原則**

```css
.tableScroll :global(th), .tableScroll :global(td),
.tableWrap :global(th), .tableWrap :global(td) { text-align: left !important; }
```

**③ scroll-margin-top の設定**

```css
h2, h3 { scroll-margin-top: calc(var(--header-height, 60px) + 80px); }
```

### Step 3: コードブロックと構文ハイライト

**コードハイライト用クラス早見表**（`styles.` を前置して使用）:

| クラス | 原本カラー | 用途 |
|---|---|---|
| `ck` | 紫 `#d89be0` | キーワード (codex, function, class) |
| `cv` | 青 `#8fb2ff` | 変数 / 属性名 (model, command, exec) |
| `cs` | 緑 `#b7d99a` | 文字列 (ダブルクォート / 単一引数) |
| `cw` | 黄 `#e8b168` | 数値 / フラグ (`--last`, `true`, `42`) |
| `cc` | グレー `#6b6f87` | コメント (斜体 `# comment`) |
| `cm` | 金 `#f2c572` | セクション / ディレクトリ (`[features]`, `my-skill/`) |

### Step 4: 図解の中央寄せ・カラー統一（Mermaid・手書き両方）

#### (a) Mermaid 図解

- `components/docs/MermaidDiagram.tsx` を使用
- 原本がライト基調の場合は `theme="base"` + `themeVariables={THEME_VARS_CONST}` を渡す
- 記述は **左端揃え必須**（インデント混入は構文エラー）
- **レイアウトはコンポーネントが自己完結**。ページ側で `:global(.mermaid)` に `width`/`flex` を上書きしない

#### (b) 手書き（非 Mermaid）の図解

- 1行横並び: `width: fit-content; margin-inline: auto`
- 折り返し: `justify-content: center`

### Step 5: [Refactor] 共通化判断 / Step 6: ローカル検証

```bash
cd web-next
bun run lint        # Biome（変更ファイル単位でパス指定）
bun run typecheck   # tsc --noEmit
bun run test        # vitest（必ず bun run test）
```

---

## Constraints（禁止事項）

- **コードブロック内の構文ハイライト・改行を怠らない** — 単色プレーンテキストで放置禁止。必ず `<span>` トークン化と `styles.codeLine` で囲む
- **Mermaid のテーマを勝手に `dark` に固定しない** — 原本がライトテーマなら `theme="base"` と `themeVariables` を必ず渡す
- **インライン `code` の背景・文字色を省略しない** — `.layout :global(code)` で `accent-soft` 背景を定義する
- **チェックリストを原本と異なる構造へ変換しない** — 1列リスト、カードグリッド、表など、原本の要素構造と装飾をそのまま守る
- **`bun test` で vitest テストを実行しない** — 必ず `bun run test` を使う
- **`<SiteHeader>` / `<DisclaimerBanner>` をページ側で再インクルードしない**
- **Antigravity 環境で `bun run build` を実行しない** — CI / 他の許可環境でのみ実行可
