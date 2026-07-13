# Plans — プラットフォーム拡張検討ドキュメント

`.agent/skills/improve/SKILL.md` により生成・維持している方向性ドキュメント群。
対象は web-next（Next.js 16 SSG）の「AI 最新情報キャッチアップ・プラットフォーム」化。
001〜006 は**分析・方向性ドキュメント**であり、そのまま実装するものではない。
実装着手時は 006 §5 の指針に従い、項目ごとに個別プラン（`plans/NNN-*.md`）を起票する。

- 初回生成: 2026-07-06（001〜003, commit `3915136`）
- 照合 v2: 2026-07-12（004〜006, commit `45940fd`）— 154 コミットのドリフトを 004 で照合済み

基準コミット（drift 検出用）: `45940fd`

## 実行順・ステータス

| Plan | タイトル | 種別 | Depends on | Status |
|------|---------|------|------------|--------|
| [001](001-current-state-analysis.md) | web-next プラットフォーム現状分析 | 分析 | — | **STALE**（004 §1〜2 が差分。STATE-01〜05 の枠組みは有効） |
| [002](002-category-gap-analysis.md) | AI 情報収集カテゴリのギャップ分析 | 分析 | 001 | **STALE**（005 が置換） |
| [003](003-platform-expansion-roadmap.md) | プラットフォーム拡張ロードマップ | direction | 001, 002 | **STALE**（006 が置換。C 案・F-1 最優先の判断は継承） |
| [004](004-reconciliation-2026-07.md) | 照合 — 001〜003 と現状の突合 | reconcile | 001–003 | DONE（照合完了） |
| [005](005-category-gap-analysis-v2.md) | カテゴリギャップ分析 v2（56 ルート） | direction | 004 | DONE（分析完了） |
| [006](006-platform-roadmap-v2.md) | プラットフォーム拡張ロードマップ v2 | direction | 004, 005 | DONE（方向性定義完了） |
| 007 | Phase 1 鮮度基盤（F-1 ページレジストリ + F-2 What's New） | build | 006 | **DONE**（2026-07-13 実装完了。下記「Phase 1 実装結果」参照） |
| [008](008-nav-regrouping-f4.md) | Phase 2 F-4' ナビ再グルーピング（18 → 7 項目・registry からの導出） | build | 006, 007 | **DONE**（2026-07-14 実装完了。下記「Phase 2 実装結果」参照） |

Status 値: TODO / IN PROGRESS / DONE / BLOCKED（理由 1 行） / REJECTED（理由 1 行） / STALE（置換先を明記）

## Phase 1 実装結果（2026-07-13）

006 §3 の Phase 1（F-1 / F-2 / F-2'）を実装済み。

- `web-next/lib/page-registry.ts` — 57 エントリ（Home + 55 ガイド + What's New）の SSoT。Zod 検証付き
- `web-next/components/site/PageFreshness.tsx` — `app/layout.tsx` に 1 箇所マウントし全ページに
  「最終確認日 / 公開日」を表示（55 個の page.tsx は未編集）
- `web-next/app/whats-new/page.tsx` — 新着 / 最近更新を registry から静的生成
- `web-next/app/sitemap.ts` — registry 駆動へ置換（24 → 57 ルート。欠落 33 ルートを解消）
- `.claude/skills/monthly-update/SKILL.md` §4.5 — F-2'：月次確認で `lastReviewed` を書き戻す運用を確立
- テスト 1040 件 全 Green（契約テスト 44 件追加）

## Phase 2 実装結果（2026-07-14）

006 §3 の Phase 2（F-4'）を [008](008-nav-regrouping-f4.md) として実装済み。**ナビのトップレベルを 18 → 7 項目へ集約**し、
`nav-links.ts` の 170 行の手書きデータを廃止して page-registry からの導出に置き換えた。

- `web-next/lib/nav-taxonomy.ts`（新規）— グループの並び順とネスト対象の SSoT
- `web-next/lib/page-registry.ts` — `category`（ナビ 2 段目ラベル）を追加、`group` を Zod enum 化。
  **`group` の値そのものは 1 件も変更していない**（Phase 1 の投入時点で正しかった）
- `web-next/components/site/nav-links.ts` — `buildNavLinks(pageRegistry)` による導出。
  未知 group / category 欠落は silent drop せず throw（ページがナビから消えるのを防ぐ）
- `SiteHeader` / `SiteHeaderClient` / `globals.css` — Providers のみ 2 段ネスト
  （デスクトップは右フライアウト、モバイルはアコーディオン）
- **registry ⇔ ナビの全単射を契約テストで固定**（`tests/nav-derivation.test.ts`）。
  以後、ページを追加したのにナビへ載せ忘れる事故が機械検知される
- URL は不変（006 §2.1 の C 案）。`app/**/page.tsx` と `netlify.toml` は未編集
- テスト 1064 件 全 Green

**次は Phase 3（横断導線: F-3' RSS / F-5 タグ・横断検索 / F-7 関連ページリンク）**、
または Phase 4 コンテンツ（C-10 オーケストレーション / C-11 SDD）。

## 依存関係

- 004 は 001〜003 の記述と commit `45940fd` 時点の実装を突合した照合結果（STALE 判定の根拠）
- 005 は 004 §2〜3 の実装済みカテゴリを新カバレッジマップの基準とする
- 006 は 004 の未達 F 項目・STATE-06〜08 と 005 の GAP-10〜14 を入力とする
- 実装フェーズの依存の要は引き続き **F-1 ページレジストリ**（006 §2.3）— 他の全機能の前提

## 次のアクション（実装起票の推奨順 — 006 §3 準拠）

1. ~~`plan F-1 ページレジストリと最終確認日表示の導入`~~ → **DONE**（2026-07-13）
2. ~~`plan F-2 What's New ページの静的生成 + monthly-update との lastReviewed 接続`~~ → **DONE**（2026-07-13）
3. ~~`plan F-4' ナビ再グルーピング`~~ → **DONE**（2026-07-14 / [008](008-nav-regrouping-f4.md)。実測 18 → 7 項目）
4. `plan F-3' RSS フィード（registry から生成）` — Phase 3。Effort S / Risk LOW で着手しやすい
5. `plan F-7 関連ページリンク（registry の topics 近接から導出）` — Phase 3。openclaw のような横断的ページの発見性はここで解決する
6. Phase 4 コンテンツ（C-10 オーケストレーション / C-11 SDD）は Phase 1 完了済みのため着手可能

## 検討済み・不採用（re-audit 防止）

- **URL 全面再編（トピック軸 URL への移動）**: リダイレクトが netlify.toml 変更を要し AI 変更ルールに抵触。ナビ再編（006 §2.2）で代替
- **CMS / DB 導入**: pure SSG + Git 管理の強みを放棄する理由がない（006 §6）
- **音声・リアルタイムエージェントの新カテゴリ**: Multimodal 既存ページへの追記で対応（005 GAP-14）
- **1 ページ規模の新カテゴリ新設**: 005 §4 の判断基準 D-1〜D-3 を満たす場合のみ許可
- **openclaw を Security（運用・品質）へ移設**（006 §2.2 の案）: **不採用**（2026-07-14, 008 設計判断 3）。エージェントを安全に「作る」ためのガイドであり読者は Agent 開発から探す。横断性は `topics: ["agent","security","guide"]` が既に表現しており、その活用は F-5 / F-7 の担当
- **全グループの 2 段ネスト化**: **不採用**（2026-07-14, 008 設計判断 2）。CI/CD・Git Worktree・RAG など 1 ページのカテゴリで 3 段ホバーが生じ、STATE-06 の「1 リンクのみのカテゴリ」問題が階層を変えて再発する。2 段ネストは Providers（30 リンク）のみ
- ~~マルチモーダル / RAG 独立カテゴリの不採用~~ → **2026-07-08 前後のユーザー判断で採用・実装済みへ決定変更**（004 §3）

## 制約メモ（全プラン共通）

- コード実装時は `.claude/rules/tdd-mandatory-cycle.md`（Red → Green → Refactor → Docs Sync）を厳守
- netlify.toml・外部依存追加・EN 展開・ナビ大規模変更はユーザー明示承認が必要（006 §5）
- コミット前 PII チェック（`.claude/rules/no-absolute-paths.md`）を全コミットで実施
- plans/ は 2026-07-12 に Git 追跡へ復帰済み（`.gitignore` の `/plans/` をコメントアウト）。ドキュメント更新もコミット対象
