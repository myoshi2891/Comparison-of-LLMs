# Plan 009: Phase 3 横断導線 — F-3' RSS / F-7 関連ページリンク / F-5 タグ・横断検索

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat fdc5229..HEAD -- web-next/lib web-next/app web-next/components/site web-next/tests`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S (F-3') + S (F-7) + L (F-5)
- **Risk**: LOW (F-3'/F-7) / MED (F-5 — ナビ・契約テストの期待値変更を伴う)
- **Depends on**: plans/006-platform-roadmap-v2.md §3 Phase 3、plans/008-nav-regrouping-f4.md（F-4' 完了が前提）
- **Category**: migration（プラットフォーム基盤）
- **Planned at**: commit `fdc5229`, 2026-07-14

## Why this matters

003 §1 の目標像「プロバイダー横断のトピック軸から最新情報をキャッチアップできるプラットフォーム」
の 3 差分のうち、「横断導線がない」だけが未解消（004 照合済み）。56 ルートは 003 の
「50 ページ超で検索必須化」ラインを超過しており、読者は目的のガイドへナビのドロップダウン
経由でしか到達できない。RSS（更新の購読）・関連リンク（回遊）・検索（直接到達）の 3 導線を
page-registry からの導出で追加し、コンテンツ増加が導線の破綻を生まない構造にする。

## ユーザー承認済みの設計判断（2026-07-14）

1. **3 項目すべて実施**。順序は F-3' → F-7 → F-5（Effort 小 → 大）
2. **F-5 検索は自前実装**（Fuse.js 等の外部ライブラリを追加しない）。57 ページの
   title/summary/topics はデータ量数十 KB であり、クライアント側の部分一致で十分。
   006 §5 の design/spike 論点（ライブラリ要否）はこの承認で解消済み
3. **タグ導線は `/search` 1 ページに集約**。`/tags/[tag]` の静的ページ群は作らない
   （1〜2 ページしか持たないタグで薄いページが量産されるため）。URL クエリ
   `?q=` / `?tag=` で検索状態を共有可能にする
4. ナビには「検索」をフラットリンクとして追加（`NAV_GROUPS` の "What's New" の直前）

## Current state

- `web-next/lib/page-registry.ts` — 57 エントリの SSoT。`topics: string[]` 実装済み
  （F-5/F-7 用と明記済み）。`findBySlug` / `byAddedAtDesc` / `byLastReviewedDesc` を export
- `web-next/lib/nav-taxonomy.ts` — `NAV_GROUPS`（7 グループ・配列順 = 表示順）、
  `FLAT_GROUPS = ["Home", "What's New"]`、`NESTED_GROUPS = ["Providers"]`
- `web-next/app/sitemap.ts` — registry 駆動の先例（`resolveSiteUrl` + `force-static`）
- `web-next/components/site/PageFreshness.tsx` — 「layout.tsx に 1 箇所マウントし
  `usePathname()` + `findBySlug()` で全ページ対応」パターンの先例（F-7 が踏襲する）
- `web-next/app/layout.tsx` — `<SiteHeader /><DisclaimerBanner /><PageFreshness />{children}`
- `web-next/tests/nav-derivation.test.ts` — 「トップレベルは 7 グループ」「What's New は末尾」
  「Home / What's New 以外はドロップダウン」を固定（F-5 で期待値更新が必要 = Red の一部）
- `web-next/lib/metadata.ts` — 静的 `Metadata`。`alternates.canonical` 等を定義済み
- Route Handler（GET + `force-static`）が `output: 'export'` で静的ファイルを生成できることは
  `web-next/node_modules/next/dist/docs/01-app/02-guides/static-exports.md` で確認済み
- topics 語彙の頻度: guide 15 / claude 14 / agent 11 / skill 10 / review 4 / harness 4 /
  security 3 / sandbox 3 … 重なりが十分で F-7 の近接導出が機能する

## Commands you will need

| Purpose   | Command                              | Expected on success |
|-----------|--------------------------------------|---------------------|
| Tests     | `cd web-next && bun run test`        | 全件パス（起票時 1064 件） |
| Typecheck | `cd web-next && bun run typecheck`   | exit 0              |
| Lint      | `cd web-next && bun run lint`        | 新規違反なし        |
| Build     | `cd web-next && bun run build`       | exit 0、`out/rss.xml` 生成 |

## Scope

**In scope**:

- `web-next/app/rss.xml/route.ts`（新規）/ `web-next/tests/rss.test.ts`（新規）
- `web-next/lib/metadata.ts`（RSS 自動発見リンク追記のみ）
- `web-next/lib/related-pages.ts`（新規）/ `web-next/components/site/RelatedPages.tsx` + `.module.css`（新規）
- `web-next/tests/related-pages.test.tsx`（新規）/ `web-next/app/layout.tsx`（1 行マウント追加）
- `web-next/lib/search.ts`（新規）/ `web-next/app/search/`（page.tsx / SearchClient.tsx / page.module.css / page.test.tsx 新規）
- `web-next/lib/nav-taxonomy.ts` / `web-next/lib/page-registry.ts`（「検索」グループ + `/search` エントリ追加）
- `web-next/tests/nav-derivation.test.ts` / `web-next/tests/phaseA.nav-links.test.ts`（期待値更新）
- `docs/PROGRESS.md` / `plans/README.md` / `CLAUDE.md`（Docs Sync）

**Out of scope**（触らない）:

- `netlify.toml` / `next.config.ts` / `package.json`（外部依存追加なし・設定変更なし）
- `legacy/` 配下（凍結）
- 既存 55 ガイドページの `page.tsx`（F-7 は layout マウントで全ページ対応するため未編集）
- URL 構造の変更（006 §2.1 C 案 — URL 不変）

## Git workflow

- ブランチ: `dev`（現行作業ブランチ）
- TDD ルール（`.claude/rules/tdd-mandatory-cycle.md`）に従い、サイクルごとに
  test → feat → refactor（変更があれば）でコミット分割。Docs Sync は (b) 構造変更として
  3 サイクル完了後に 1 回実施
- 各コミット前に PII チェック（`.claude/rules/no-absolute-paths.md` の grep）を実行

## Steps

### サイクル 1: F-3' RSS フィード

1. **Red**: `web-next/tests/rss.test.ts` を作成。`GET()` が `application/rss+xml` を返す /
   `<rss version="2.0">` を含む / 最新 addedAt の slug が含まれる / item は最大 20 件 /
   `escapeXml("a & b")` → `"a &amp; b"` を検証。
   **Verify**: `bun run test` → rss.test.ts のみ失敗（モジュール不在）
   **Commit**: `test(rss): add failing spec for F-3' RSS feed`
2. **Green**: `web-next/app/rss.xml/route.ts` を実装（`force-static` + registry を addedAt
   降順 20 件で RSS 2.0 XML 生成、`escapeXml` を export）。`lib/metadata.ts` の `alternates` に
   `types: { "application/rss+xml": "/rss.xml" }` を追記。
   **Verify**: `bun run test` → 全件パス
   **Commit**: `feat(rss): generate /rss.xml from page registry`
3. **Refactor**: `bun run build && bun run lint && bun run typecheck`。`out/rss.xml` 生成を確認。
   変更が生じた場合のみ `refactor(rss): ...` でコミット

### サイクル 2: F-7 関連ページリンク

1. **Red**: `web-next/tests/related-pages.test.tsx` を作成。`relatedEntries()` の
   スコアリング（共有 topics 数降順 → 同一 group 優先 → addedAt 降順 → slug 昇順）/
   自分自身の除外 / 共有 0 件は空配列 / limit 遵守 / `<RelatedPages />` のレンダリングを検証。
   **Commit**: `test(related): add failing spec for F-7 related pages`
2. **Green**: `web-next/lib/related-pages.ts`（純粋関数）と
   `web-next/components/site/RelatedPages.tsx` + `.module.css`（PageFreshness パターン）を実装。
   `app/layout.tsx` の `{children}` 直後にマウント。
   **Commit**: `feat(related): derive related page links from registry topics`
3. **Refactor**: build / lint / typecheck 確認。変更があればコミット

### サイクル 3: F-5 タグ・横断検索

1. **Red**: `web-next/lib/search.ts` 用テスト（`web-next/app/search/page.test.tsx` に集約）:
   `searchEntries` の大文字小文字無視 / NFKC 正規化 / 複数トークン AND / topics 一致 /
   タグ絞り込み / タグ+クエリ併用 / 空クエリ全件、`allTopics` の頻度降順の決定論性、
   ページ契約（h1 / metadata / タグチップ）。既存 `tests/nav-derivation.test.ts` の期待値を
   7 → 8 グループ・フラットリンク例外に「検索」を追加する形に更新（この時点で Red）。
   **Commit**: `test(search): add failing spec for F-5 cross-search`
2. **Green**: `lib/search.ts` / `app/search/page.tsx`（Server Component + Suspense）/
   `app/search/SearchClient.tsx`（`"use client"`、`useSearchParams` で `?q=` / `?tag=` 復元、
   `router.replace` で URL 同期）/ `page.module.css` を実装。`nav-taxonomy.ts` の
   `NAV_GROUPS` に「検索」を "What's New" の直前へ挿入・`FLAT_GROUPS` に追加。
   `page-registry.ts` に `/search` エントリ（group: "検索", topics: []）を追加。
   **Commit**: `feat(search): add /search with build-time index from registry`
3. **Refactor**: build / lint / typecheck 確認。変更があればコミット

### Docs Sync（(b) 構造変更）

`docs/PROGRESS.md`（テスト数・HEAD）+ `plans/README.md`（009 を DONE、Phase 3 実装結果を追記）+
`CLAUDE.md`（アーキテクチャ図に /search・rss.xml、設計判断 1 項追加）。
**Commit**: `chore(docs): sync spec files — Phase 3 横断導線 (F-3'/F-5/F-7)`

## Test plan

- 新規: `tests/rss.test.ts`（XML 構造・件数・エスケープ）、`tests/related-pages.test.tsx`
  （スコアリング決定論・コンポーネント）、`app/search/page.test.tsx`（検索純粋関数 + ページ契約）
- 更新: `tests/nav-derivation.test.ts` / `tests/phaseA.nav-links.test.ts`（8 グループ化）
- 構造パターン: 契約テストは `app/whats-new/page.test.tsx` を、純粋関数テストは
  `lib/cost.ts` 系の既存テストをモデルにする
- 禁止テスト種別（スナップショット・ブラウザ自動化・ネットワーク）は使わない

## Done criteria

- [ ] `bun run test` exit 0（1064 件 + 新規テスト全パス）
- [ ] `bun run typecheck` / `bun run lint` exit 0（新規違反なし）
- [ ] `bun run build` exit 0、`out/rss.xml` と `out/search/index.html`（または `out/search.html`）が存在
- [ ] registry ⇔ ナビ全単射テストが 58 エントリで Green
- [ ] `plans/README.md` の 009 行が DONE
- [ ] 全コミットが TDD コミット分割（test → feat → [refactor] → docs）に従っている

## STOP conditions

- `nav-derivation.test.ts` の期待値更新以外で既存テストが落ちた場合（想定外の副作用）
- Route Handler の静的出力が `out/rss.xml` に生成されない場合（Next.js 16 の挙動が
  同梱ドキュメントと異なる — `node_modules/next/dist/docs/` を再確認して報告）
- `useSearchParams` が静的エクスポートでビルドエラーを出し、Suspense 境界でも解消しない場合
- 外部依存の追加が必要に見えた場合（承認済みスコープ外）

## Maintenance notes

- 新規ページ追加時は registry 登録だけで RSS / 検索 / 関連リンクすべてに自動反映される
  （追加作業なし）。topics を空にすると検索のタグ絞り込みと関連リンクの対象外になる点だけ注意
- topics の語彙は自由文字列。表記ゆれ（例: `code-review` と `review` の併存）が増えたら
  Zod enum 化を検討する（本プランでは既存語彙を変更しない）
- F-6（EN 展開）が採用された場合、RSS の `<language>` と検索 UI 文言の i18n 化が必要
