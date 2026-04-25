# Next.js 移行 Phase 12 — 統合テスト設計書

> `feat/nextjs-migration` ブランチ Phase 12（統合テスト）の設計書。
> 移行計画本体は [`NEXTJS_MIGRATION_PLAN.md`](NEXTJS_MIGRATION_PLAN.md)、進捗は [`../MIGRATION_PROGRESS.md`](../MIGRATION_PROGRESS.md) を参照。

## Context

Next.js 移行プロジェクト `feat/nextjs-migration` ブランチの Phase 11 までで、`web-next/` は 329 件の契約テストが green の状態にある（コンポーネント別の contract test 中心）。

ただし既存テストは「コンポーネント単体が指定 props で期待 DOM を出力するか」を検証するもので、**ユーザー操作に応じて複数コンポーネント間で state が連動するシナリオ** は `HomePage.test.tsx` の API↔Sub タブ切替 1 本しかカバーされていない。

Phase 12 ではこのギャップを埋めるため、`HomePage` を起点とする統合テストを追加する。目的は視覚パリティではなく **機能パリティの保証** であり、Phase 11（視覚パリティ）と相補的な位置付けとなる。

## 目標と非目標

### 目標（In Scope）

1. JA/EN 切替が全子コンポーネントのテキストに連鎖反映されることを検証
2. API/Sub タブ切替でテーブル種別と note-box が切り替わることを検証
3. シナリオ変更が `inputTokens` / `outputTokens` を経由して `ApiTable` のコスト計算に反映されることを検証
4. ApiTable 内の列ソートが言語切替・タブ往復後も保持／リセットされる挙動を契約として固定
5. `data/pricing.json` 実データ（API 35 + Sub 33 モデル）を投入した状態で HomePage が完走することを検証
6. エッジケース（`jpy_rate=0`・`annual=null`・`price_in/out=0`）で UI がクラッシュしないことを検証

### 非目標（Out of Scope）

- 視覚パリティ（Phase 11 で検証済み）
- ピクセル単位のレイアウト検証（jsdom に CSS が乗らないため不可能）
- ブラウザ E2E（Playwright は本プロジェクトで不使用）
- スナップショットテスト（CLAUDE.md 禁止事項）
- ネットワーク／スクレイパー結合テスト（CLAUDE.md 禁止事項）

## テストマトリクス

| # | シナリオ | 起点操作 | 期待される連鎖 | 検証対象クラス／要素 |
|---|---------|---------|--------------|-------------------|
| 1 | 言語切替（JA→EN） | `.lang-toggle` クリック | Hero / ScenarioSelector / tab ボタン / ApiTable 列見出し / footer が英語化 | `.hero h1`, `.tab-btn`, `.col-model`, `footer` |
| 2 | 言語切替の可逆性 | JA→EN→JA | 初期状態と同一テキストに戻る | 任意の代表キー |
| 3 | タブ切替（API→Sub） | `.tab-btn[1]` クリック | `SubTable` 描画、`ApiTable` アンマウント、`subNote` 表示 | `.table-wrap`, `.note-box.info` |
| 4 | タブ切替の可逆性 | API→Sub→API | ApiTable が再描画される | `.api-table` |
| 5 | シナリオ変更（light） | ScenarioSelector の `sc_light` ボタン | `inputTokens` / `outputTokens` が SCENARIOS.light 値に更新→ApiTable 内セルの表示値が変化 | DualCell の `.price-cell` |
| 6 | カスタムシナリオ入力 | `input[type=number]` に値入力 | scenario=custom の状態で ApiTable が再計算 | DualCell |
| 7 | 言語 × タブの独立性 | EN にしてから Sub タブへ | Sub タブも英語化（column headers, notes） | `.sub-table thead`, `.note-box.info` |
| 8 | ソート × 言語 | ApiTable 列ヘッダクリック→言語切替 | ソート状態（`sort-desc` class）が維持される | `th.sort-desc`, `th.sort-asc` |
| 9 | 実データ完走 | pricing.json 全件投入 | クラッシュせず、期待件数の行が描画される | `.sub-row`, `.api-table tbody tr` |
| 10 | jpy_rate=0 エッジ | 異常データ投入 | フォーマッタが `¥—` を返す、UI は描画継続 | footer, DualCell |
| 11 | 最安行ハイライト | minimalPricing で API タブ表示 | 30d 列で最安の行に `.cheapest-row` が付く | `tr.cheapest-row`, `.cheapest-badge` |

全 11 シナリオ × 各 1〜3 assertion = **想定 25〜35 テストケース**。

## ファイル構成

```
web-next/
├── components/
│   └── HomePage.integration.test.tsx   # 新規：統合テスト本体
├── tests/
│   └── fixtures/
│       └── pricing.ts                   # 新規：テスト用 PricingData ファクトリ
```

- 既存 `components/HomePage.test.tsx`（契約テスト 16 件）は **削除・改変せず残す**。統合テストは別ファイルに切り出す。
- フィクスチャは `tests/fixtures/pricing.ts` で「最小データ」「実データ（pricing.json を import）」「エッジケース」の 3 種を関数として用意。

## 参照する既存実装

| 役割 | ファイル | 補足 |
|------|---------|------|
| 対象 Client Component | `web-next/components/HomePage.tsx` | useState × 5 の state ハブ |
| 既存契約テスト（継承元） | `web-next/components/HomePage.test.tsx` | `fireEvent` + `container.querySelector` パターン |
| データ型 | `web-next/types/pricing.ts` | `PricingData` / `ApiModel` / `SubTool` |
| 実データ | `web-next/data/pricing.json` | 直接 import 可能（既存 `app/page.tsx` と同じ方法） |
| Zod 検証 | `web-next/lib/pricing.ts` の `parsePricingData` | フィクスチャの正当性チェックに使用 |
| シナリオ定義 | `web-next/components/ScenarioSelector.tsx` の `SCENARIOS` | 期待値算出に再利用 |
| コスト計算 | `web-next/lib/cost.ts` の `calcApiCost` / `PERIODS` | 期待値の独立算出に使用（重複実装禁止） |
| テストセットアップ | `web-next/tests/setup.ts` | `afterEach(cleanup)` を継承 |

## 命名規則

- ファイル: `HomePage.integration.test.tsx`（既存 `HomePage.test.tsx` と命名空間を分離）
- `describe` ブロック: `HomePage integration - <観点>` 例: `HomePage integration - language switching`
- `it` ブロック: `<起点> → <期待結果>` 例: `clicking lang toggle → footer text becomes English`
- 既存テストの命名規則（`describe("HomePage - <観点>")`）と同型。`integration` prefix で区別。

## インタラクション実装方針

- **`fireEvent` を継続採用**（既存と統一）。`userEvent` への全面移行は Phase 12 では行わない（スコープ外）。
- **非同期待機（`await waitFor`）は不要** — HomePage の全 state 更新が同期的であることを確認済み（useEffect 内での非同期処理なし）。
- **props ドリリング経路の検証** — `LanguageToggle` の `onToggle` → HomePage `setLang` → 子コンポーネント `lang` prop の伝播を「子テキストの変化」で間接検証する。
- **期待値の独立算出** — ApiTable のコスト数値は `calcApiCost(model, inputTokens, outputTokens, PERIODS[i].hours)` を直接呼び、レンダリング結果と突合する。

## フィクスチャ設計（`tests/fixtures/pricing.ts`）

```ts
// 意図: 最小・実・エッジの 3 種を提供して用途別に呼び分ける
export function minimalPricing(): PricingData { /* 1 API + 1 Sub */ }
export function fullPricing(): PricingData { /* import pricing.json */ }
export function edgePricing(): PricingData { /* jpy_rate=0, annual=null, price=0 */ }
```

- 関数で返すのは vitest の mutation 耐性のため。
- `minimalPricing` / `fullPricing` は `parsePricingData` で Zod 検証を通過したデータのみ返す（契約違反データの混入防止）。
- **`edgePricing` のみ意図的に Zod をバイパス**。`PricingDataSchema` が `jpy_rate` を `positive()` で拘束するため、`jpy_rate=0` の「毒データ」を UI に投入して耐性検証するには `parsePricingData` を経由せず直接 `PricingData` 型で構築する必要がある。fixture 内のコメントで明記し、他用途への流用を防ぐ。

## TDD ステップ

Phase 12 内でも TDD を維持する：

1. **[Red] 統合テスト追加**
   - コミット: `test(web-next): add HomePage integration tests for Phase 12`
   - ファイル: `components/HomePage.integration.test.tsx`, `tests/fixtures/pricing.ts`
   - 確認: テストが失敗することを確認（実装不足ではなく「未検証だった挙動の失敗」を確認）

2. **[Green] 最小修正（必要な場合のみ）**
   - 既存コードが全シナリオで動くことが期待されるが、発見した不具合があれば **最小差分** で修正。
   - 修正不要なら Green ステップをスキップし、そのまま Refactor に進む。
   - コミット（必要時）: `fix(web-next): <具体的なバグ内容>`

3. **[Refactor] 重複除去**
   - テスト内のヘルパー共通化、fixture の整理のみ。本体コードのリファクタリングは行わない。
   - コミット: `refactor(web-next): extract shared test helpers for integration suite`

## 追加パッケージ判断

- `@testing-library/user-event` の導入は**見送る**。既存 `fireEvent` で全シナリオ実装可能、依存追加は CLAUDE.md の「依存関係のアップグレード禁止」に抵触する懸念あり。
- 追加パッケージなしで Phase 12 を完了する。

## 検証手順

実装完了後に以下を順に実行：

```bash
cd web-next
bun run lint        # Biome: 違反 0 件
bun run typecheck   # tsc: エラー 0 件
bun run test        # vitest: 既存 329 件 + 新規 ~30 件 = ~360 件 green
bun run build       # Next.js build: 成功
```

追加検証：

- 統合テストファイル単体実行: `bun run test components/HomePage.integration.test.tsx`
- 実データフィクスチャのパース確認: `parsePricingData(fullPricingRaw)` が throw しないこと

## 想定所要ステップ数と成果物

- コミット 2〜3 本（Red / 必要なら Green / Refactor）
- 追加ファイル 2 本（fixture + integration test）
- `MIGRATION_PROGRESS.md` の Phase 12 行を「完了」に更新

## 実行結果（Phase 12 完了時追記）

- 実装したテストケース数: **19 件**（設計書の 11 観点を 19 ケースに展開）
- Red phase 実行結果: **19 件すべて初回で green**。Phase 11 までの実装が機能パリティを満たしていたことを示す
- Green / Refactor phase: 実質スキップ（修正不要と判断）
- 全体テスト数: 361 件中 360 passed（失敗 1 件は Phase 12 スコープ外の `lib/i18n.test.ts` の key count ハードコード）
- Phase 12 新規ファイル 2 本の lint / typecheck: clean

## リスクと緩和策

| リスク | 緩和策 |
|--------|--------|
| 実データ pricing.json が将来変更され assertion が壊れる | `minimalPricing()` ベースの構造テスト（件数非依存）を主とし、`fullPricing()` は「クラッシュしない」「件数が > 0」のスモーク扱いに限定 |
| fireEvent で拾いきれないユーザー体験 | Phase 12 のスコープ外と明記。Phase 15 以降で Playwright 導入を検討するマイルストーンを残す（今回は着手しない） |
| Biome lint の `noArrayIndexKey` がテストで引っかかる | テスト内の map にはキー不要。assertion はクエリで行う |

## Appendix A: 既存 HomePage.test.tsx とのカバレッジ差分

| 観点 | 既存（契約） | Phase 12（統合） |
|------|-----------|---------------|
| "use client" 静的検査 | ✅ | — |
| 子コンポーネント配線 | ✅（粗粒度） | — |
| タブ切替 | ✅（1 方向） | ✅（往復 + 可逆性） |
| JA/EN 切替 | ❌ | ✅（連鎖検証） |
| シナリオ変更 | ❌ | ✅（数値連鎖） |
| ソート保持 | ❌ | ✅ |
| 実データ完走 | ❌（最小 fixture のみ） | ✅ |
| エッジケース | ❌ | ✅（jpy_rate=0 等） |
