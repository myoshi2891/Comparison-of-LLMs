# プロジェクト進捗・ステータス (PROGRESS.md)

> 本ファイルは Next.js 移行完了後の保守・改善フェーズにおける開発の進捗（特にテスト関連）および品質チェックのルールを記録する。
> - 最終更新日: **Updated 2026-05-30**
> - 過去の移行進捗・旧ルール: [`docs/archive/MIGRATION_PROGRESS.md`](archive/MIGRATION_PROGRESS.md)
> - 移行計画アーカイブ: [`docs/archive/NEXTJS_PHASE_A_F_PLAN.md`](archive/NEXTJS_PHASE_A_F_PLAN.md)

## 現在のステータス

- **フェーズ**: 保守・機能改善・品質強化フェーズ
- **ブランチ**: `dev`（本番 `main` への Next.js 移行マージ完了 🚀）
- **動作検証**:
  - `bun run build` ✅（`web-next` の全ルートが Static プリレンダリングされる）
  - `bun run typecheck` ✅
  - `bun run lint` ✅（既知の違反なし、0 件維持）
- **テストの実行状況**:
  - **フロントエンド (`web-next/`)**: Vitest 実行で **609 件すべて合格** (全 Green ✅)
  - **バックエンド (`scraper/`)**: pytest 実行で **5 件すべて合格** (全 Green ✅)

## テストカバレッジの進捗状況

総合的なテストカバレッジの詳細は [`docs/TEST_COVERAGE_PROGRESS.md`](TEST_COVERAGE_PROGRESS.md) および [`docs/coverage-dashboard.html`](coverage-dashboard.html) を参照のこと。

### テスト分野別のカバレッジ概要 (2026-05-30 時点)
- **Unit**:
  - `app/` (全 20 ガイドページルート): ✅ 100% 契約テスト（タイトル、セクション数、rel、metadata）
  - `components/` (電卓 UI 9/9 コンポーネント): ✅ 100%
  - `site/` (共通ヘッダー/バナー): ✅ 100%
  - `lib/` (ユーティリティ): ほぼ網羅 (metadata, fonts を除く)
  - `types/`, `providers/`, `tools/`, `core/`: ⚠️ 一部モックテストのみ (ランタイム検証や詳細ロジック未整備)
- **Integration**:
  - `components/` (データフロー連携): ✅ 実装済み (`HomePage.integration.test.tsx`)
  - その他 (`app/`, `site/`, `scraper/` 関連): ❌ 未実装 (missing)
- **E2E / Visual**: ❌ 未実装
- **Accessibility (a11y)**: ⚠️ 部分的 (`LanguageToggle` や `ApiTable` 等の aria 属性確認のみ。axe-core 自動テスト未導入)
- **Performance**: ❌ 未実装 (Lighthouse CI 未整備)
- **API / Contract**:
  - `lib/` (Zod スキーマ): ✅ 実装済み
  - `types/` (TypeScript-Pydantic パリティ): ✅ コンパイル時アサートで同期検証
  - スクレイパー関連: ❌ 未実装
- **Security**:
  - `lib/` / `components/`: ⚠️ `tRich` の HTML 文字列 XSS 耐性テストあり。その他監査ゲート未整備

---

## 開発・品質チェックルール (AI/人間共通)

`CLAUDE.md` の開発ルールを補完する、現在の保守フェーズで厳守すべきルールです。

### R1. Biome フォーマット・lint の適用スコープ
- **禁止**: リポジトリ全体を対象とする自動修正 (`bun run lint:fix` / `biome check . --write` など引数なしの実行)
- **理由**: 作業範囲外のファイルを意図せずフォーマットまたは修正し、差分を汚してしまうのを防ぐため。
- **手順**: 変更したファイルのみを明示的にパス指定して実行すること (例: `bunx biome check --write web-next/app/some-page/page.tsx`)

### R2. 型定義の同期 (SSoT)
- **原則**: スクレイパーの `scraper/src/scraper/models.py` (Pydantic) が Single Source of Truth (SSoT)。
- **手順**: スキーマを変更する際は、必ず `web-next/types/pricing.ts` (TypeScript) を手動で更新し、`web-next/lib/pricing.ts` 内の `_AssertParity` が通ることを確認する。

---

## 保守・開発用 検証コマンド早見表

```bash
# フロントエンドテスト (Vitest)
cd web-next && bun run test

# TypeScript 型チェック
cd web-next && bun run typecheck

# 静的ビルド検証
cd web-next && bun run build

# Biome リント確認
cd web-next && bun run lint

# スクレイパーテスト (pytest)
cd scraper && uv run pytest
```

---

## 移行完了後の継続的課題とネクストアクション

移行（Phase 1–14, Phase A–F）が完了したため、今後は以下の継続的課題と改善に注力する。

### 1. 月次データアップデート（定常運用）
毎月、各プロバイダー（Anthropic, Google, OpenAI など）の最新価格を反映させる。
為替レート更新および `pricing.json` の型定義と `lib/pricing.ts` の `_AssertParity` の一致を確認する。

### 2. テストカバレッジの拡充
[`docs/TEST_COVERAGE_PROGRESS.md`](TEST_COVERAGE_PROGRESS.md) で `missing` または `partial` となっている領域のテストを順次追加する。
特に **E2Eテストの導入**、**アクセシビリティ自動検証テストの追加**、**セキュリティ監査ゲートの整備** に注力する。

### 3. 表示パフォーマンスおよび Core Web Vitals の監視
Netlify 上での SSG (Static Site Generation) 出力物の Lighthouse 計測を行い、LCP (Largest Contentful Paint) や INP (Interaction to Next Paint) が高スコアを維持しているか監視する。

---

## 次回セッションでの再開・実行依頼プロンプト

以下は、任意の Coding Agent（Jules, Claude Code, Gemini CLI, Cline など）に特定の作業を依頼する際の指示プロンプトテンプレートです。

### 1. 月次データアップデート実行依頼

```text
Next.js 移行完了後のリポジトリ `LLM-Studies` にて、最新のAIモデル価格と為替レートへのアップデート作業（月次データアップデート）を実行してください。

- ドキュメント: docs/MONTHLY_UPDATE_PROMPTS.md に定義された手順に従ってください。
- 現在のステータス: docs/PROGRESS.md を参照。

作業ステップ：
1. 為替レートとモデル価格データのスクレイピングおよび更新処理の実行。
2. scraper/src/scraper/models.py (SSoT) の変更がある場合、web-next/types/pricing.ts に型を同期。
3. web-next/lib/pricing.ts の _AssertParity によるコンパイル時整合性チェックが通ることを確認。
4. フロントエンドおよびスクレイパーの全テスト（Vitest / pytest）を実行し、問題ないことを検証。
```

### 2. テスト拡充（E2E / a11y / セキュリティ）実行依頼

```text
Next.js 移行完了後のリポジトリ `LLM-Studies` にて、テストカバレッジ拡充計画に基づき、テストの追加・強化を行ってください。

- ドキュメント: docs/TEST_COVERAGE_PROGRESS.md および docs/TESTING.md を参照。
- 現在のステータス: docs/PROGRESS.md を参照。

作業ステップ：
1. テストが不足しているセル（例: アクセシビリティの axe-core 自動テストの導入、Playwright による E2E テストの骨格作成、または security の audit 関連など）を特定。
2. 計画的にテストコードを追加し、既存テストにデグレード（不合格）が発生していないことを確認。
3. docs/TEST_COVERAGE_PROGRESS.md のカバレッジ進捗を更新し、/update-coverage-dashboard スキル等を用いて docs/coverage-dashboard.html と同期する。
```

### 3. 一般的な保守・改善作業の再開

```text
Next.js 移行完了後のリポジトリ `LLM-Studies` の保守・改善作業を再開してください。

- リポジトリ: LLM-Studies (Next.js 移行プロジェクトは dev/main へ完全マージ済み)
- 現在のステータス: docs/PROGRESS.md を参照。テストは Vitest (609/609 passed) / pytest (5/5 passed) で全 Green
- リポジトリ規約: CLAUDE.md (編集上の絶対ルール)

作業方針：
1. ドキュメントや設定ファイルの更新、パフォーマンスとアクセシビリティの継続的な改善・監視。
2. 検証コマンド:
  (cd web-next && bun run test)
  (cd web-next && bun run typecheck)
  (cd web-next && bun run build)
  (cd web-next && bun run lint)
  (cd scraper && uv run pytest)
```
