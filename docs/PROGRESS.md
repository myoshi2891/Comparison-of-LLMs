# プロジェクト進捗・ステータス (PROGRESS.md)

> 本ファイルは Next.js 移行完了後の保守・改善フェーズにおける開発の進捗（特にテスト関連）および品質チェックのルールを記録する。
> - 最終更新日: **Updated 2026-06-03**
> - 過去の移行進捗・旧ルール: [`docs/archive/MIGRATION_PROGRESS.md`](archive/MIGRATION_PROGRESS.md)
> - 移行計画アーカイブ: [`docs/archive/NEXTJS_PHASE_A_F_PLAN.md`](archive/NEXTJS_PHASE_A_F_PLAN.md)

## 現在のステータス

- **フェーズ**: 保守・機能改善・品質強化フェーズ
- **ブランチ**: `dev`（本番 `main` への Next.js 移行マージ完了 🚀）
- **動作検証**:
  - `bun run build` ✅（`web-next` の全ルートが Static プリレンダリングされる）
  - `bun run typecheck` ✅
  - `bun run lint` ✅（本作業範囲では新規違反 0 件、既知の既存指摘は本件対象外）
- **テストの実行状況**:
  - **フロントエンド (`web-next/`)**: Vitest 実行で **685 件すべて合格** (全 Green ✅)
  - **バックエンド (`scraper/`)**: pytest 実行で **38 件すべて合格** (全 Green ✅)

## 最近の追加内容
- **Code Review Tool Pricing（1/3/12ヶ月プラン別料金表）**: 既存の `/code-review/tool-pricing` ページに**プラン別・USD+円の料金表**を追加 🚀。`ToolEntry.price: string` を `plans: readonly PricingPlan[]` に置き換え、`planAmounts`（1/3/12ヶ月計算・純粋関数）と `representativePrice`（マトリクス用最安値ラベル）を `constants.ts` に追加。pricing.json の `jpy_rate` / `generated_at` を `parsePricingData` で取得し、`fmtUSD` / `fmtJPY` で USD+円を二段表示。年額割引あるプランには「年額割引」バッジを表示。Hero と免責セクションに更新時レートと基準日を明記。テスト 7 件追加（plan-header / plan-row / ¥記号 各ページテスト + planAmounts 純粋関数テスト4件、計684テスト合格）。Gemini Code Assist / Google Jules AI Ultra は公式ページで WebSearch 確認済み（Standard $19〜22.80、Enterprise $45〜54、Jules Ultra $200/月）。確定不能プラン（AWS CodeGuru・SonarQube Developer）は `priceNote` で「従量課金」「LOC依存（年額）」と非推測値で明記。
- **Code Review Tool Pricing（料金比較ページ）**: `/code-review/tool-pricing` を新規追加 🚀。Code Review 系 AI ツール 9 種（GitHub Copilot / Codex / Claude / CodeRabbit / Gemini Code Assist / Jules / AWS CodeGuru / SonarQube ×2）の料金目安・主用途・メリット/デメリットを比較マトリクス＋カテゴリ別カードで横断表示。各価格に**公式 pricing ページの出典リンク**と確認年月を併記し、可変データは `app/code-review/tool-pricing/constants.ts` に SSoT として集約（**月次価格レビュー対象**）。Code Review ナビ先頭に「Tool Pricing」を追加。契約テスト 7 件追加（合計 677 テスト合格）。本ページの lint はクリーン（既存 `sonar-qube` / `antigravity-slash-commands-guide` の既知 lint 指摘は本作業の対象外）。
- **Antigravity スラッシュコマンド完全ガイド (CSS修正)**: Next.js CSS Modules の `:global()` ラッパーを用いて、約400行のスタイルを安全にスコープ化し適用完了。
- **Antigravity スラッシュコマンド完全ガイド**: Next.js App Router への移行完了 🚀（5件の契約テストを追加し、合計670テスト合格）。
- **Antigravity スラッシュコマンド完全ガイド (HTML版)**: Gemini CLI から Antigravity CLI への移行に伴う、スラッシュコマンド、カスタムコマンド（TOML）、Plan Mode 等の解説ガイドをルートに配置。
- **SonarQube Cloud 解析の導入（品質 CI/CD）**: public 無料プランをモノレポ単一プロジェクトで導入。両言語にカバレッジ計測を追加（web-next: `@vitest/coverage-v8`→`lcov.info` / scraper: `pytest-cov`→`coverage.xml`、いずれも dev 依存）。`sonar-project.properties` / `.github/workflows/sonarqube.yml`（`push:main,dev`+PR）/ `make sonar`（Docker scanner CLI）を追加。**モノレポのレポートパス補正**（lcov `SF:`→`web-next/`、coverage.xml `<source>`→`scraper/src/scraper`）でカバレッジ 0% を回避。既定 `uv run pytest` の出力は不変。**初回手動作業**: Cloud import→Automatic Analysis OFF、org/projectKey 反映、GitHub Secrets に `SONAR_TOKEN` 登録。
- **SonarQube Code Review 実践ガイド**: Next.js App Router への移行完了 🚀（5件の契約テストを追加し、合計665テスト合格）。
- **GitHub Copilot Code Review 完全活用ガイド**: Next.js App Router への移行完了 🚀（5件の契約テストを追加し、合計660テスト合格）。
- **CodeRabbit 完全活用ガイド**: Next.js App Router への移行完了 🚀（5件の契約テストを追加し、合計655テスト合格）。
- **Claude Code スラッシュコマンド完全ガイド**: Next.js App Router への移行完了 🚀（5件の契約テストを追加し、合計650テスト合格）。
- **CodeCopyButton コンポーネント**: `web-next/components/docs/` に追加。`managed-agents` ページ等で利用開始。

## テストカバレッジの進捗状況

総合的なテストカバレッジの詳細は [`docs/TEST_COVERAGE_PROGRESS.md`](TEST_COVERAGE_PROGRESS.md) および [`docs/coverage-dashboard.html`](coverage-dashboard.html) を参照のこと。

### テスト分野別のカバレッジ概要 (2026-06-01 時点)
- **Unit**:
  - `app/` (全 23 ガイドページルート): ✅ 100% 契約テスト（タイトル、セクション数、rel、metadata）
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
加えて、**`/code-review/tool-pricing` の料金**（`app/code-review/tool-pricing/constants.ts`）も毎月見直す。
各エントリの `sourceUrl`（公式 pricing ページ）を辿って `price` / `priceCheckedAt` を更新し、ページ全体の `PRICE_CHECKED_AT` を当月へ更新する。

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
- 現在のステータス: docs/PROGRESS.md を参照。テストは Vitest (685/685 passed) / pytest (38/38 passed) で全 Green
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
