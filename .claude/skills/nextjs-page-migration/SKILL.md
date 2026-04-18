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

1. **`MIGRATION_PROGRESS.md`** — 現在地（直近は Phase B-3: `legacy/codex/skill.html` → `/codex/skill`）と残タスク、既知の留保事項
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

#### Phase B で確立した 3 つの移植パターン（B-3 / B-4 でも踏襲）

Phase B-1（`/claude/skill`）と B-2（`/gemini/skill`）で共通化された方針。B-3（`/codex/skill`）・B-4（`/copilot/skill`）でも
そのまま適用できる：

1. **Legacy `<style>` → `page.module.css` に逐語転写**
   - legacy の `<style>` ブロック（数百行規模）を CSS Modules 1 ファイルへ 1:1 移植する
   - ファイル冒頭にコメントで「元 HTML の行範囲」を記す（例: `legacy/claude/skill.html の <style> ブロック (行 7-630) を CSS Modules に転写`）
   - クラス名の命名は legacy をそのまま継承（Biome の camelCase 規則は CSS Modules の export で吸収される）

2. **ブランドカラートークンを `.root` スコープ内に閉じる**
   - ページ固有の色変数（`--bg` / `--accent` / `--surface` 等）は `.root { ... }` の中で `--*` 定義
   - `globals.css` の既存トークンを **絶対に上書きしない**（他ページへの影響を避けるため）
   - `page.module.css` 冒頭コメントに「globals.css の値を上書きしない」旨を明記する運用
   - 子要素は `.root *` または `.root .className` を経由するのでスコープが自然に閉じる

3. **外部出典は `SOURCES: Source[]` 配列として先頭で構造化**
   - `page.tsx` の先頭で `type Source = { num, href, title, desc }` を定義し、`const SOURCES: Source[] = [...]` として集約
   - 末尾の sources セクションは `{SOURCES.map((s) => (...))}` でレンダリング（逐語 HTML を JSX で繰り返さない）
   - Phase F の redirect 一覧作成時も同じ配列を機械的に走査できる（URL 一覧のシングルソース化）
   - legacy HTML の `<a href="..." target="_blank" rel="noopener noreferrer">` 属性は **SOURCES 描画部で付与**

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
