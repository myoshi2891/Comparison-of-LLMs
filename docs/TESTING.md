# Testing

Updated 2026-09-18

> テスト戦略・実行方法・テスト追加ガイドライン。数値は本更新日に `bun run test` / `uv run pytest` を実際に実行して確認した実測値。

## 現状のテスト体制

| 領域 | フレームワーク | 状態（実測 2026-09-18） | コマンド |
| ------ | --------------- | ------ | ---------- |
| フロントエンド (web-next/) | Vitest + @testing-library/react | **177 files / 1639 tests** 全 Green | `cd web-next && bun run test` |
| スクレイパー (scraper/) | pytest | **100 tests（5 ファイル）** 全 Green | `cd scraper && uv run pytest` |
| E2E (web-next/e2e/) | Playwright | 実装済みだが **CI 未組込・一部が現行 DOM と不整合**（詳細は後述） | `cd web-next && bun run test:e2e` |

## テスト実行

### フロントエンド

```bash
cd web-next
bun run test           # vitest 実行（単発、デフォルトで `vitest run`）
bun run test:watch     # watch モード
bun run test:coverage  # カバレッジ付き実行（lcov.info 生成、CI/make sonar 用）
```

**設定ファイル:**

- テストランナー: `vitest`（`web-next/vitest.config.ts`）
- DOM 環境: `jsdom`
- tsconfig: `web-next/tsconfig.json` の `strict: true` + `erasableSyntaxOnly: true`

**実際のテストファイル配置（123 files の内訳）:**

| 配置場所 | ファイル数 | 内容 |
| --- | --- | --- |
| `web-next/app/**/page.test.tsx` | 82 | 各ページの contract テスト（タイトル・セクション数・外部リンク rel・metadata 等） |
| `web-next/components/**/*.test.tsx` | 18 | 共有コンポーネント（`SiteHeader` / `PageFreshness` / `ScenarioSelector` 等）のレンダリングテスト |
| `web-next/tests/*.test.ts` | 15 | 横断的な契約テスト（`page-registry-coverage.test.ts` / `nav-derivation.test.ts` / `rss.test.ts` / `netlify-redirects.test.ts` / `fonts-selfhost.test.ts` 等） |
| `web-next/lib/*.test.ts` | 7 | 純粋関数のユニットテスト（`cost.test.ts` / `pricing.test.ts` / `i18n.test.ts` 等。**ソースファイルと同一ディレクトリに配置**） |
| `web-next/types/pricing.test.ts` | 1 | 型スキーマのバリデーションテスト |

> **旧版との差分**: 以前の版では `cost.test.ts` / `pricing.test.ts` / `i18n.test.ts` を `web-next/tests/` 配下と記載していたが、実際は `web-next/lib/` にソースファイルと同居している。ユニットテストはソース隣接配置、横断的な契約テストのみ `web-next/tests/` に集約する運用。

### スクレイパー

```bash
cd scraper
uv run pytest              # 全テスト実行
uv run pytest -v           # 詳細出力
uv run pytest -k "test_"   # パターンマッチ
```

**実際のテストファイル構成（100 tests の内訳）:**

```text
scraper/tests/
  smoke/test_smoke.py    - 4 tests   CLI 全体のスモークテスト
  test_browser.py        - 8 tests   価格抽出ロジック（extract_price / sanity_check 等）
  test_imports.py        - 1 test    全モジュールのインポート検証
  test_providers.py      - 62 tests  API プロバイダー別スクレイパー（anthropic/openai/google/aws/deepseek/xai/moonshot/zhipu）
  test_tools.py          - 25 tests  コーディングツール別スクレイパー（cursor/github_copilot/windsurf 等）
```

> **旧版との差分**: 以前の版では `test_models.py` / `test_exchange.py` / `test_main.py` という構成を記載していたが、これらのファイルは現在のリポジトリに存在しない。上記が実際の構成。

## CI での実行

GitHub Actions に 3 つのワークフローが存在する。

```text
.github/workflows/test.yaml       # プッシュ / PR ごとに実行。パスフィルタで変更領域のみテスト
  ├── web-next/** 変更時   → bun install --frozen-lockfile → bun audit → bun run test
  └── scraper/** 変更時    → uv sync --frozen → uv run pytest

.github/workflows/sonarqube.yml   # push:main,dev および PR。カバレッジ生成 → SonarQube Cloud 解析
  ├── bun run test:coverage（web-next）
  ├── uv run pytest --cov --cov-report=xml（scraper）
  └── SONAR_TOKEN 未設定時はスキャン自体をスキップ（フォーク PR でも同様にスキップ）

.github/workflows/auto-fix.yml    # test.yaml の失敗を検知して GitHub Issue を自動作成
  └── 既存の "CI Failure — Auto Fix Needed" Issue が無い場合のみ新規作成
```

**重要な注意点**: `bun run typecheck` / `bun run lint` / `bun run build` は **GitHub Actions のいずれのワークフローにも含まれていない**。これらは `CLAUDE.md` の「コミット前チェック」に定義されたローカル/エージェント向けの手動チェック項目であり、リモート CI では強制されていない。CI で自動検証されるのは `bun run test`（+ `bun audit`）と `uv run pytest` のみ。

## E2E テスト（`web-next/e2e/`）の位置づけ

`package.json` には `test:e2e`（`playwright test`）スクリプトと `web-next/e2e/calculator.e2e.ts` / `web-next/e2e/smoke.e2e.ts` の 2 ファイルが存在するが、以下の点に注意すること。

- **CI 未組込**: `.github/workflows/` のいずれからも `test:e2e` は呼び出されない。手動実行専用。
- **`smoke.e2e.ts`** はホームページの `.hero`（`components/Hero.tsx`）・`nav#common-header`（`components/site/SiteHeader.tsx`）等、現行の DOM 構造と一致するセレクタを使用しており、実行できる可能性が高い（未実測）。
- **`calculator.e2e.ts` の `should load calculator UI elements` は現行コードと不整合**: `#scenario-selector` と `#api-pricing-table` という ID をアサートしているが、この 2 つの ID は `web-next/` 配下のソースコード全体（`e2e/calculator.e2e.ts` 自身を除く）のどこにも定義されていない（`grep -rn` で確認済み、2026-09-18）。実行すれば失敗する可能性が高い。旧 Vite 版フロントエンド（`legacy/`）由来のテストが Next.js 移行時に更新されないまま残存したものと推測される。
- `docs/TESTING.md` の旧版および現行の方針（後述）は「ブラウザ自動化テストは書かない」としているが、これらのファイル自体は削除されずリポジトリに残っている。**削除するか現行 DOM に合わせて修正するかは、このドキュメント更新の時点では未決定**（本ドキュメントは事実の記録に留め、方針変更は行わない）。

## テスト追加ガイドライン

### フロントエンド (`web-next/`)

#### ファイル命名規則

```text
web-next/lib/<name>.test.ts                    # lib/ 配下の純粋関数テスト（ソースと同居）
web-next/components/<name>.test.tsx             # コンポーネントテスト（ソースと同居）
web-next/tests/<name>.test.ts                   # 横断的な契約テスト（page-registry / nav / rss 等）
web-next/app/<provider>/<slug>/page.test.tsx     # ガイドページ contract テスト
```

#### 推奨テストパターン

**1. コスト計算ロジック (`lib/cost.ts`)** — 最優先

```typescript
// web-next/lib/cost.test.ts
import { calcApiCost, calcSubCost, colorIndex, fmtUSD, fmtJPY } from './cost'

describe('calcApiCost', () => {
  it('1時間のコストを正しく計算する', () => {
    // Arrange
    const priceIn = 3.0   // $3/1M input tokens
    const priceOut = 15.0  // $15/1M output tokens
    const input = 50_000
    const output = 5_000

    // Act
    const cost = calcApiCost(priceIn, priceOut, input, output, 1)

    // Assert: (50000/1M * 3 + 5000/1M * 15) * 1 = 0.225
    expect(cost).toBeCloseTo(0.225)
  })

  it('0時間は0を返す', () => {
    expect(calcApiCost(3.0, 15.0, 50000, 5000, 0)).toBe(0)
  })
})

describe('calcSubCost', () => {
  it('30日以下は時間按分', () => {
    expect(calcSubCost(20, 16, 720)).toBe(20)      // 30日 = 月額そのまま
    expect(calcSubCost(20, 16, 360)).toBeCloseTo(10) // 15日 = 半額
  })

  it('12ヶ月は年払い優先', () => {
    expect(calcSubCost(20, 16, 8760)).toBe(16) // annual が使われる
  })

  it('annual=null の場合は月額換算', () => {
    expect(calcSubCost(20, null, 8760)).toBeCloseTo(20 * 12.166, 0)
  })

  it('無料プランは常に0', () => {
    expect(calcSubCost(0, null, 8760)).toBe(0)
  })
})

describe('fmtUSD', () => {
  it('通常のフォーマット', () => {
    expect(fmtUSD(1234.56)).toBe('$1,234.56')
  })

  it('極小値は <$0.01', () => {
    expect(fmtUSD(0.001)).toBe('<$0.01')
  })

  it('0は $0.00', () => {
    expect(fmtUSD(0)).toBe('$0.00')
  })
})
```

**2. コンポーネントテスト**

```typescript
// web-next/components/ScenarioSelector.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ScenarioSelector } from './ScenarioSelector'

describe('ScenarioSelector', () => {
  it('シナリオ変更でコールバックが呼ばれる', () => {
    const onChange = vi.fn()
    render(
      <ScenarioSelector
        lang="ja"
        scenario="standard"
        currentInput={50000}
        currentOutput={5000}
        onScenarioChange={onChange}
      />
    )
    // シナリオボタンをクリックしてコールバック検証
  })
})
```

### vitest の注意点

- `vi.fn()` でモック関数を作成（jest.fn() ではない）
- `vi.mock()` でモジュールモック
- `@testing-library/jest-dom` のマッチャー (`toBeInTheDocument` 等) は自動読み込み

### スクレイパー (`scraper/`)

#### ファイル配置

```text
scraper/tests/
├── __init__.py
├── test_browser.py      # 価格抽出ロジック（extract_price / sanity_check）
├── test_imports.py      # 全モジュールのインポート検証
├── test_providers.py    # API プロバイダー別スクレイパーのテスト
├── test_tools.py        # コーディングツール別スクレイパーのテスト
└── smoke/
    └── test_smoke.py    # CLI 全体のスモークテスト
```

新規プロバイダー/ツールを追加した場合は、既存の `test_providers.py` / `test_tools.py` に対応するテストケースを追記する（新規ファイルを作る必要はない。詳細は `.claude/skills/add-provider/` / `.claude/skills/add-tool/`）。

#### 推奨テストパターン

**1. 価格抽出ロジック (外部通信なし)** — 最優先

```python
# scraper/tests/test_browser.py
from scraper.browser import extract_price, sanity_check

class TestExtractPrice:
    def test_dollar_pattern(self):
        """$X.XX パターンから価格を抽出"""
        html = '<span>Input: $3.00 per 1M tokens</span>'
        result = extract_price(html, [r"\$\s*([\d.]+)\s*per"])
        assert result == 3.0

    def test_no_match_returns_none(self):
        """マッチしない場合は None"""
        result = extract_price("no price here", [r"\$\s*([\d.]+)"])
        assert result is None

class TestSanityCheck:
    def test_valid_value(self):
        value, status = sanity_check(3.0, "test", 5.0)
        assert value == 3.0
        assert status == "success"

    def test_none_falls_back(self):
        value, status = sanity_check(None, "test", 5.0)
        assert value == 5.0
        assert status == "fallback"
```

**2. プロバイダー/ツールのスクレイプ関数テスト（既存 HTML フィクスチャに対する抽出検証）**

```python
# scraper/tests/test_providers.py の既存パターンに追記する形で実装する
# 実際のネットワーク呼び出しは行わず、HTML 文字列や既存 JSON をそのまま関数に渡して検証する
```

### スクレイパーテストの原則

- **外部通信はモック必須**: Playwright や httpx の実際のネットワーク呼び出しはテストしない
- **ロジック部分をテスト**: `extract_price`, `sanity_check`, 各プロバイダー/ツールの抽出関数
- **E2E スクレイプテストは書かない**: 外部サイトの HTML 構造変更で壊れるため

## AAA パターン

全テストは **Arrange-Act-Assert** パターンに従う:

```text
Arrange: テストデータ・モック・前提条件を準備
Act:     テスト対象の関数/コンポーネントを実行
Assert:  期待結果を検証
```

## テストで避けるべきこと

- スナップショットテスト（HTML 構造変更で容易に壊れる）
- 外部 API への実際のリクエスト
- `pricing.json` のハードコードされた値への依存（価格は頻繁に変わる）
- 実装の内部詳細への依存（プライベート関数のテスト等）
- タイマーやタイムアウトに依存するテスト
- 件数のみ・存在のみ・部分一致のみのアサーション（移行漏れ等を素通しする。詳細は `.claude/rules/tdd-mandatory-cycle.md` の「テスト強度の下限」）

> ブラウザ自動化テスト（Playwright 等）は本ドキュメントの方針としては新規に書かないこととしているが、`web-next/e2e/` に既存の実装が残っている。上記「E2E テストの位置づけ」を参照。
