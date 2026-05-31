# テストカバレッジ進捗トラッカー

> このファイルは `docs/coverage-dashboard.html` のデータソース（信頼源）です。
> テストを追加・削除したときは必ずこのファイルを先に更新し、
> その後 `/update-coverage-dashboard` スキルで HTML を同期してください。

## メタデータ

| 項目 | 値 |
|---|---|
| 最終スキャン日 | 2026-05-31 |
| フロントエンドテストランナー | Vitest 4.1 (jsdom 29 + @testing-library/react 16) |
| バックエンドテストランナー | pytest 9.0 (unittest 互換) |
| web-next テストファイル数 | 48 |
| web-next テストケース数 | 635 |
| scraper テストファイル数 | 5 |
| scraper テストケース数 | 38 |
| 総合カバレッジスコア (weighted) | 44.2% |

スコア計算方法: 8 カテゴリー × 8 ドメイン = 64 セルのうち N/A を除く **43 セル** を
`done=1.0` `partial=0.5` `missing=0.0` で重み付き集計（lcov/ライン計測値なし）。

---

## カバレッジマトリクス

ステータス凡例: `done` = ✅ 実装済 / `partial` = ⚠️ 部分的 / `missing` = ❌ 未実装 / `na` = — N/A

| カテゴリー | app/ | components/ | site/ | lib/ | types/ | providers/ | tools/ | core |
|---|---|---|---|---|---|---|---|---|
| Unit | done | done | done | done | done | done | done | done |
| Integration | missing | done | missing | na | na | missing | missing | missing |
| E2E | partial | partial | partial | na | na | missing | missing | missing |
| Visual | missing | missing | missing | na | na | na | na | na |
| Accessibility | done | done | done | na | na | na | na | na |
| Performance | missing | missing | missing | na | na | missing | missing | missing |
| API / Contract | na | na | na | done | done | missing | missing | partial |
| Security | partial | partial | na | partial | na | partial | partial | partial |

---

## セル詳細

各セルの実測データ。`files` フィールドは実在テストファイル名（+ ケース数）。

---

### Unit / app

```
status: done
count: 113
files:
  - app/claude/agent/page.test.tsx (8)
  - app/claude/skill/page.test.tsx (8)
  - app/claude/skill-guide/page.test.tsx (7)
  - app/claude/skill-guide-intermediate/page.test.tsx (7)
  - app/claude/cowork-guide/page.test.tsx (7)
  - app/codex/agent/page.test.tsx (8)
  - app/codex/skill/page.test.tsx (8)
  - app/codex/openai-codex-guide/page.test.tsx (6)
  - app/copilot/agent/page.test.tsx (8)
  - app/copilot/skill/page.test.tsx (8)
  - app/copilot/github-copilot/page.test.tsx (16)
  - app/copilot/markdown-file-guide/page.test.tsx (6)
  - app/gemini/agent/page.test.tsx (8)
  - app/gemini/skill/page.test.tsx (8)
  - app/gemini/skill-guide/page.test.tsx (7)
  - app/gemini/skill-guide-intermediate/page.test.tsx (6)
  - app/gemini/antigravity-guide/page.test.tsx (6)
  - app/git-worktree/page.test.tsx (5)
note: 全 18 page.tsx ルートが契約テスト付き（タイトル・セクション数・rel 属性）
```

### Unit / components

```
status: done
count: 144
files:
  - components/ApiTable.test.tsx (25)
  - components/SubTable.test.tsx (21)
  - components/ScenarioSelector.test.tsx (23)
  - components/HomePage.test.tsx (16)
  - components/Hero.test.tsx (12)
  - components/MathSection.test.tsx (11)
  - components/DualCell.test.tsx (10)
  - components/RefLinks.test.tsx (18)
  - components/LanguageToggle.test.tsx (8)
note: 電卓 UI 9/9 コンポーネント網羅
```

### Unit / site

```
status: done
count: 25
files:
  - components/site/SiteHeader.test.tsx (12)
  - components/site/SiteHeaderClient.test.tsx (7)
  - components/site/DisclaimerBanner.test.tsx (6)
note: 共通ヘッダー/バナー 3/3 網羅
```

### Unit / lib

```
status: done
count: 93
files:
  - lib/cost.test.ts (49)
  - lib/pricing.test.ts (23)
  - lib/i18n.test.ts (7)
  - lib/i18n.rich.test.tsx (10)
  - lib/site-url.test.ts (4)
note: 6 lib モジュール中 5 件カバー（metadata.ts / fonts.ts のみ未）
```

### Unit / types

```
status: done
count: 23
files:
  - types/pricing.test.ts (23)
  - lib/pricing.ts → _AssertParity (compile-time)
note: 型↔Zodスキーマのランタイム parity + negative test（型強制拒否・必須欠落・positive制約・日付フォーマット境界）
```

### Unit / providers

```
status: done
count: 13
files:
  - scraper/tests/test_providers.py (12)
  - scraper/tests/smoke/test_smoke.py::test_providers (1)
note: 6 プロバイダーの価格抽出を success（fixture→期待値一致）/ fallback（非マッチ→全モデル fallback 値）両パスで検証
```

### Unit / tools

```
status: done
count: 17
files:
  - scraper/tests/test_tools.py (16)
  - scraper/tests/smoke/test_smoke.py::test_tools (1)
note: 8 ツールの価格抽出を success（fixture→monthly一致）/ fallback（非マッチ→全プラン fallback 値）両パスで検証
```

### Unit / core

```
status: done
count: 8
files:
  - scraper/tests/test_imports.py (全モジュール import)
  - scraper/tests/smoke/test_smoke.py::test_main
  - scraper/tests/smoke/test_smoke.py::test_fetch_jpy_rate
  - scraper/tests/test_browser.py (5)
note: main.py / exchange.py / browser.py 全コアモジュールのテスト網羅
```

---

### Integration / app

```
status: missing
count: 0
files: []
note: ルート間遷移・SSG ビルド成果物の結合テストなし
```

### Integration / components

```
status: done
count: 19
files:
  - components/HomePage.integration.test.tsx (19)
note: ScenarioSelector × ApiTable × SubTable のデータフロー検証
```

### Integration / site

```
status: missing
count: 0
files: []
note: SiteHeader × layout の結合なし（個別ユニットのみ）
```

### Integration / providers

```
status: missing
count: 0
files: []
note: live HTTP → models.py の結合検証なし
```

### Integration / tools

```
status: missing
count: 0
files: []
note: 同上
```

### Integration / core

```
status: missing
count: 0
files: []
note: main → _scrape_all → _write_output の end-to-end なし
```

---

### E2E / app

```
status: partial
count: 5
files:
  - web-next/e2e/smoke.e2e.ts (1)
  - web-next/e2e/calculator.e2e.ts (4)
note: Playwright による画面ロードおよびインタラクティブ動作（言語・通貨切り替え、プリセット変更）のE2E検証
```

### E2E / components

```
status: partial
count: 5
files:
  - web-next/e2e/smoke.e2e.ts (1)
  - web-next/e2e/calculator.e2e.ts (4)
note: Playwright による電卓UIプリセットの適用および通貨切り替え時の描画更新のE2E検証
```

### E2E / site

```
status: partial
count: 5
files:
  - web-next/e2e/smoke.e2e.ts (1)
  - web-next/e2e/calculator.e2e.ts (4)
note: Playwright による共通ヘッダー・バナーおよび言語切り替え時のヘッダー表示のE2E検証
```

### E2E / providers

```
status: missing
count: 0
files: []
note: ライブスクレイプ smoke は CI 対象外
```

### E2E / tools

```
status: missing
count: 0
files: []
note: ""
```

### E2E / core

```
status: missing
count: 0
files: []
note: update.sh の end-to-end 検証なし
```

---

### Visual / app

```
status: missing
count: 0
files: []
note: スナップショット・visual diff 未導入
```

### Visual / components

```
status: missing
count: 0
files: []
note: ""
```

### Visual / site

```
status: missing
count: 0
files: []
note: ""
```

---

### Accessibility / app

```
status: done
count: null
files:
  - web-next/tests/a11y.test.tsx
note: vitest-axe による主要ガイドページ（Antigravity, Harness, Agent Harnessなど）のアクセシビリティ自動テスト（wcag違反自動チェック）
```

### Accessibility / components

```
status: done
count: null
files:
  - web-next/tests/a11y.test.tsx
note: vitest-axe による主要コンポーネント（HomePageなど）のアクセシビリティ自動テスト
```

### Accessibility / site

```
status: done
count: null
files:
  - web-next/tests/a11y.test.tsx
note: vitest-axe による共通ヘッダー・共通バナーのアクセシビリティ自動テスト
```

---

### Performance / app

```
status: missing
count: 0
files: []
note: Lighthouse CI / web-vitals 計測なし
```

### Performance / components

```
status: missing
count: 0
files: []
note: ""
```

### Performance / site

```
status: missing
count: 0
files: []
note: ""
```

### Performance / providers

```
status: missing
count: 0
files: []
note: スクレイプ所要時間の閾値テストなし
```

### Performance / tools

```
status: missing
count: 0
files: []
note: ""
```

### Performance / core

```
status: missing
count: 0
files: []
note: ""
```

---

### API-Contract / lib

```
status: done
count: 23
files:
  - lib/pricing.test.ts (23) — PricingDataSchema (Zod)
note: runtime スキーマ検証 + pricing.json パース
```

### API-Contract / types

```
status: done
count: 0
files:
  - lib/pricing.ts → _AssertParity (compile-time)
note: Pydantic models.py との compile-time パリティアサート
```

### API-Contract / providers

```
status: missing
count: 0
files: []
note: HTML フィクスチャ → ApiModel の契約テストなし
```

### API-Contract / tools

```
status: missing
count: 0
files: []
note: HTML フィクスチャ → SubTool の契約テストなし
```

### API-Contract / core

```
status: partial
count: 0
files:
  - scraper/src/scraper/models.py (Pydantic 自動バリデーション)
note: Pydantic がランタイム強制。negative test は未整備
```

---

### Security / app

```
status: partial
count: null
files:
  - 全 page.tsx で raw HTML 挿入 API 不使用ポリシー
note: tRich パターンによる XSS 回避が暗黙の契約
```

### Security / components

```
status: partial
count: 10
files:
  - lib/i18n.rich.test.tsx (10) — XSS-resistance
note: raw HTML 文字列を React 要素へ変換することを静的に検査
```

### Security / lib

```
status: partial
count: 10
files:
  - lib/i18n.rich.test.tsx (10)
note: 上記と同じファイルで lib/i18n.tsx もカバー
```

### Security / providers

```
status: partial
count: 0
files:
  - Makefile (make audit)
  - .github/workflows/test.yaml (bun audit)
note: GitHub Actions CI に bun audit による自動脆弱性監査ゲートを組み込み
```

### Security / tools

```
status: partial
count: 0
files:
  - Makefile (make audit)
  - .github/workflows/test.yaml (bun audit)
note: 同上
```

### Security / core

```
status: partial
count: 0
files:
  - Makefile (make audit)
  - .github/workflows/test.yaml (bun audit)
note: 同上（JS依存関係の監査ゲート）
```

---

## 更新履歴

| 日付 | 変更内容 | スコア |
|---|---|---|
| 2026-05-31 | Unit/types（型スキーマのランタイム negative test）・Unit/providers・Unit/tools（価格抽出 success/fallback 両パス）を追加し partial→done に昇格 | 44.2% |
| 2026-05-30 | a11yガイドページ自動テスト追加、Playwright電卓インタラクションテスト、およびCI脆弱性自動監査ゲートの導入 | 40.7% |
| 2026-05-26 | アクセシビリティ自動テスト、Playwright E2E骨格、依存関係脆弱性監査ゲート、およびスクレイパーbrowserテストを追加 | 40.7% |
| 2026-05-20 | 初回作成（静的スキャン） | 31.4% |
