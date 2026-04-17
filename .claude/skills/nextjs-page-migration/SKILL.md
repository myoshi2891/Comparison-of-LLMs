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

関連ドキュメント:

- `docs/NEXTJS_PHASE_A_F_PLAN.md` — Phase A–F 全体計画（設計判断・スコープ・工数）
- `MIGRATION_PROGRESS.md` — 現在地と直近の留保事項
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

Phase B 以降に着手する前に以下を確認する:

- [ ] `web-next/components/site/SiteHeader.tsx` が存在し、`app/layout.tsx` にマウントされている
- [ ] `web-next/components/site/DisclaimerBanner.tsx` が `<body>` 冒頭に描画される
- [ ] `web-next/components/site/nav-links.ts` に移行先 URL（clean URL 形式）が登録済み
- [ ] `components/site/SiteHeader.test.tsx` 他 Phase A の契約テストがすべて Green

未達の項目がある場合は Phase A の Green フェーズに戻って完了させる。

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

- Server Component デフォルト。`"use client"` は動的 UI が必要な場合のみ
- スタイル優先順位: Tailwind ユーティリティ → CSS Modules（`page.module.css`） → global CSS（避ける）
- 外部リンクは `<a href="..." target="_blank" rel="noopener noreferrer">` を厳守

### Step 5: コードブロック（shiki）

build-time ハイライトとして `shiki` を採用する。

- RSC 内で `async` ページコンポーネントから `shiki` の highlighter を取得し、Markdown/source を事前 HTML 化する
- 得た HTML を React 要素として埋め込む際の **安全な流し込み API** の使い方は
  既存の `web-next/components/CodeBlock.tsx`（Phase A Green で導入予定）を参照すること。
  本 SKILL.md 内には該当 API のリテラル記述を置かない（XSS 監査の false positive 防止のため）
- 入力はビルド時に確定する値（リポジトリ内ファイル）のみを許容し、ユーザー入力はハイライト対象に含めない

### Step 6: Mermaid ダイアグラム（Phase E）

- `components/docs/MermaidDiagram.tsx`（Phase E Green で導入）が `next/dynamic` で `ssr: false` の
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
  削除せず参照用として保持する（Phase F で物理削除を検討）
- 新規ガイドページを `legacy/` 配下に書かない（web-next 側のみに作成）

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

## 注意事項

- このスキルは `invocation: explicit` — `/nextjs-page-migration` での手動呼び出しのみ
- Phase A–F を飛ばして並列着手しない（SiteHeader が未完成の状態で Phase B を進めると大量の手戻りが発生する）
- Playwright MCP は使用しない（プロジェクトルールに従う）。視覚確認はユーザーがブラウザで手動実施
