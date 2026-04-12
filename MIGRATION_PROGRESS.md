# Next.js 移行 進捗トラッカー

> 本ファイルは `feat/nextjs-migration` ブランチでの移行作業の状況を記録する。
> 移行計画本体は [`docs/NEXTJS_MIGRATION_PLAN.md`](docs/NEXTJS_MIGRATION_PLAN.md) を参照。

## 現在地

- **ブランチ**: `feat/nextjs-migration`
- **最新 HEAD**: `0cb392b` (Phase 10 page.tsx Green 完了)
- **次の作業**: **Phase 11 視覚パリティ — ユーザー手動確認待ち**（コードレベル差異 0 件、`bun run dev` で目視確認を推奨）
- **検証状態**: lint / typecheck / test (329 passed) / build すべて green

## フェーズ進捗

| # | フェーズ | 状態 | コミット |
|---|---------|-----|---------|
| 1 | Scaffolding (Next.js 16 + deps) | 完了 | `b341099`, `b715914` |
| 2 | Tooling & Config (tsconfig / Biome / Vitest) | 完了 | `ace6517`, `ae439bc`, `5fcd9e0` |
| 3 | Types + Data Layer (Zod) | 完了 | `def80c2`, `cb348ac`, `5eba3a1` |
| 4 | Business Logic (`lib/cost.ts`) | 完了 | `f7474f5`, `8cf68b6`, `0eb362c` |
| 5 | i18n + React element refactor | 完了 | `895ad68`, `842c5aa`, `eca48e7` |
| 6 | Global CSS + `next/font` | 完了 | `a1da834`, `f089489`, `f923d85` |
| 7 | Layout + Metadata API | 完了 | `0182d4b`, `02a6fe6`, `c30c4d3` |
| 8 | Atomic UI Components (×6) | 完了 | 下記「Phase 8 コミット表」参照 |
| 9 | Table components (ApiTable / SubTable) | 完了 | 下記「Phase 9 コミット表」参照 |
| 10 | Compose `app/page.tsx` | 完了 | `4ffdc70`, `0cb392b` |
| 11 | 視覚パリティ検証 | **コード検証済み (差異 0)** | — |
| 12 | 統合テスト | 未着手 | — |
| 13 | Deployment (netlify.toml) | 未着手 | — |
| 14 | カットオーバー (web/ → legacy/) | 未着手 | — |

## 完成済み成果物（`web-next/`）

```
web-next/
├── app/
│   ├── layout.tsx           # Phase 7: metadata/viewport を lib/metadata から再エクスポート
│   ├── page.tsx             # Phase 10: Server Component (Zod 検証 → HomePage 委譲)
│   └── globals.css          # Phase 6: legacy 227-line CSS 移植 + @theme inline
├── lib/
│   ├── cost.ts              # 6 純粋関数（calcApiCost / calcSubCost / colorIndex / fmtUSD / fmtJPY / PERIODS）
│   ├── cost.test.ts         # 40 tests
│   ├── pricing.ts           # Zod スキーマ + コンパイル時パリティアサート
│   ├── pricing.test.ts      # 19 tests
│   ├── i18n.tsx             # Phase 5: T オブジェクト + t() + tRich() (React 要素ファクトリ)
│   ├── i18n.test.ts         # 7 tests (プレーン契約)
│   ├── i18n.rich.test.tsx   # 10 tests (JSX レンダリング + XSS 静的検査)
│   ├── fonts.ts             # Phase 6: next/font/google 3 フォント設定
│   ├── metadata.ts          # Phase 7: 静的 Metadata + Viewport (i18n-backed)
│   └── index.ts             # barrel export
├── components/              # Phase 8-9: Atomic UI + Table Components
│   ├── DualCell.tsx         # Server Component（colorIndex + fmtUSD/JPY 合成）
│   ├── DualCell.test.tsx    # 10 tests
│   ├── LanguageToggle.tsx   # Client Component（"use client" + type="button"）
│   ├── LanguageToggle.test.tsx  # 8 tests
│   ├── Hero.tsx             # Server Component（tRich で XSS-safe 描画）
│   ├── Hero.test.tsx        # 12 tests
│   ├── MathSection.tsx      # Server Component（4 枚の数式カード）
│   ├── MathSection.test.tsx # 11 tests
│   ├── RefLinks.tsx         # Server Component（16 カード + tRich("refNote", lang)）
│   ├── RefLinks.test.tsx    # 18 tests
│   ├── ScenarioSelector.tsx # Client Component（useState + useId でラベル紐付け）
│   ├── ScenarioSelector.test.tsx  # 23 tests
│   ├── SubTable.tsx         # Server Component（Phase 9: サブスクプラン比較表）
│   ├── SubTable.test.tsx    # 21 tests
│   ├── ApiTable.tsx         # Client Component（Phase 9: 列ソート付き API モデル比較表）
│   ├── ApiTable.test.tsx    # 25 tests
│   ├── HomePage.tsx         # Client Component（Phase 10: 全 state 管理 + コンポーネント合成）
│   └── HomePage.test.tsx    # 16 tests
├── types/
│   └── pricing.ts           # PricingData / ApiModel / SubTool（Pydantic と同期）
├── tests/
│   ├── setup.ts             # @testing-library/jest-dom + afterEach cleanup
│   ├── smoke.test.tsx       # 環境疎通確認 1 test
│   ├── phase6.css.test.ts   # 81 tests (globals.css / lib/fonts.ts / layout.tsx 契約)
│   ├── phase7.metadata.test.ts  # 23 tests (metadata / viewport / layout 再エクスポート契約)
│   └── phase10.page.test.ts # 4 tests (page.tsx 静的契約: Server Component + Zod + data)
├── data/
│   └── pricing.json         # Phase 10: ビルド時 static import 用 (web/src/data/ からコピー)
├── biome.json               # space 2 / 100 col / noExplicitAny / noDoubleEquals / etc.
├── vitest.config.ts         # jsdom + @ alias
├── tsconfig.json            # strict + noUnusedLocals + erasableSyntaxOnly 他
└── package.json             # scripts: dev / build / test / lint / typecheck
```

**テスト数**: 329
(40 cost + 19 pricing + 1 smoke + 7 i18n plain + 10 i18n rich + 81 phase6 css + 23 phase7 metadata
- 10 DualCell + 8 LanguageToggle + 12 Hero + 11 MathSection + 18 RefLinks + 23 ScenarioSelector
- 21 SubTable + 25 ApiTable + 4 phase10 page + 16 HomePage)

## 確定した設計判断（`docs/NEXTJS_MIGRATION_PLAN.md` ステップ 0）

1. **ディレクトリ**: `web-next/` を `web/` と並行運用（カットオーバーまで `web/` は非破壊）
2. **Markdown 運用フロー**: L1 Primitives / L2 Feature Blocks / L3 Pages の 3 層
3. **型同期**: `scraper/src/scraper/models.py`（Pydantic）が SSoT、`types/pricing.ts` が手動ミラー、`lib/pricing.ts` の `_AssertParity` でコンパイル時検証
4. **XSS 対策**: 生 HTML 文字列挿入 API（React の unsafe HTML 注入プロパティ）は一切使わない → Phase 5 で翻訳を React 要素化済み
5. **i18n**: **next-intl は採用せず、既存 `T` オブジェクト継続**（理由: 39 キー・コンパイル時既知・単一ページ）
6. **ビジネスロジック**: `lib/cost.ts` に純粋関数集約（React 非依存、Server/Client 両対応）
7. **データ取得**: **SSG 採用**（`pricing.json` をビルド時 static import、Zod で検証）
8. **デプロイ**: **Netlify 継続**（`@netlify/plugin-nextjs`、Vercel 移行なし）
9. **単一 HTML 制約**: **廃止**（`output: 'export'` で Netlify CDN 配信）
10. **フォント**: **`next/font/google` で self-host**（Phase 6）。Google CDN への @import を廃止し、`--font-sans` / `--font-mono` / `--font-display` を `<html>` に注入する方式に統一
11. **Metadata**: **`generateMetadata` ではなく静的 `export const metadata`**（Phase 7）。理由: SSG 前提でリクエスト時情報が存在しない＋単一ページ設計で JA/EN が URL で分岐しない

## Phase 4 で修正した既存バグ

- `fmtJPY(v, 0)` がサイレントに `¥0` を返していた問題 → `¥—` sentinel に修正
  - 原因: `j = v * 0 = 0` で「価格ゼロ」と「レート不明」が区別不能だった
  - 修正範囲: `web-next/lib/cost.ts` のみ（`web/src/lib/cost.ts` は非破壊ルールで未変更）

## Phase 5 の成果（i18n + React element refactor）

### 実装内容

- `web/src/i18n.ts` (39 キー) を `web-next/lib/i18n.tsx` に移植
- HTML タグを含む **6 キー** (`heroTitle`, `heroDesc`, `apiNote`, `subNote`, `refNote`, `disclaimer`) を `RichEntry { text, render }` 型に変換し、`<em>` / `<strong>` / `<strong style={{color}}>` を JSX で直接合成
- 新 API: `tRich(key, lang): ReactNode` — PlainEntry は文字列素通し、RichEntry は `render(lang)` 実行
- 既存 API: `t(key, lang): string` — RichEntry では `text[lang]` (HTML タグ剥がし済み) を返し、aria-label / meta / alt 属性向けフォールバックとして利用可能

### XSS 対策

- 生 HTML 文字列を DOM に流し込む unsafe な React 注入プロパティは `i18n.tsx` ソース内で **一切使用しない**
- 静的検査テスト（`i18n.rich.test.tsx`）が `readFileSync` で `i18n.tsx` を読み、API 名と `"<strong..."` 文字列リテラルが混入していないことを CI で毎回確認

### インラインカラーの扱い

- `refNote` / `disclaimer` の `#a5b4fc` / `#7dd3fc` / `#f472b6` / `#ef4444` は `style={{ color: '#...' }}` で完全一致移植（Tailwind 化は Phase 8 以降で判断）

## Phase 6 の成果（Global CSS + next/font）

### 実装内容

- `web/src/index.css` (227 行) を `web-next/app/globals.css` に逐語移植
- `@import url('https://fonts.googleapis.com/...')` を削除し、`lib/fonts.ts` 経由の `next/font/google` に切り替え
- **3 フォント**: Noto Sans JP (`--font-sans`), JetBrains Mono (`--font-mono`), Syne (`--font-display`) — すべて `display: "swap"` で FOIT 回避
- `app/layout.tsx`: Geist scaffold を削除し、`<html lang="ja">` に 3 フォントの `.variable` className を適用

### Tailwind v4 @theme inline 統合

- 20 件の legacy design tokens (`--bg` / `--srf` / `--brd` / `--txt` / `--acc` / `--grn` / `--ylw` / `--red` / `--prp` / `--teal` / `--orng` 系) を `--color-*` にエイリアス
- これで `bg-acc` / `text-txt2` / `border-brd` 等のユーティリティが自動生成される
- font 系は `next/font` が `<html>` に直接注入するため、`@theme inline` にマッピングすると循環参照になる → CSS 側は `var(--font-sans)` で参照する方針

### 契約テスト設計

- `tests/phase6.css.test.ts` (81 tests): `readFileSync` でファイル内容を検証
- vitest の `css: false` 設定と next/font loader の制約により runtime 検証は不可能なため、文字列契約で「移植の事実」を固定する方式を採用

## Phase 7 の成果（Layout + Metadata API）

### 実装内容

- `lib/metadata.ts` を新設し、`Metadata` と `Viewport` を **静的エクスポート** として定義
- `app/layout.tsx` は `export { metadata, viewport } from "@/lib/metadata"` の再エクスポートのみ
- title / description は `t("heroTitle", "ja")` / `t("heroDesc", "ja")` から取得することで **UI と SEO のパリティをコンパイル時に保証**
- `metadataBase`: デフォルト `https://comparison-of-llms.netlify.app`、`NEXT_PUBLIC_SITE_URL` 環境変数で上書き可能（ステージング対応）

### キー設計判断

1. **`generateMetadata` を使わず静的 `export const metadata`** — Next.js 公式ドキュメントが「可能なら静的を優先せよ」と明示。SSG 前提 (`output: 'export'`) でリクエスト時情報が取れないこととも整合
2. **metadata/viewport を別ファイルに分離** — vitest から直接 import 可能にするため（Phase 6 で `next/font` loader が vitest でクラッシュする問題を経験済み）
3. **OpenGraph の locale 記法** — `openGraph.locale` は `ja_JP` (underscore、OG spec)、`alternates.languages` は `ja-JP` (hyphen、BCP 47) と使い分け
4. **viewport 側に themeColor** — Next 14+ でテーマカラーは `metadata` から `viewport` に移動したブレーキングチェンジに対応

### 契約テスト設計

- `tests/phase7.metadata.test.ts` (23 tests): `lib/metadata.ts` を直接 import して `metadata.title.default`, `metadata.openGraph.locale`, `viewport.themeColor` 等をアサート
- i18n パリティテスト: `metadata.title.default === T.heroTitle.text.ja` をコンパイル時契約として固定
- layout 側の再エクスポート存在確認は `readFileSync` で `export { metadata, viewport } from "@/lib/metadata"` の文字列を検出

### コミット履歴

1. **[Red]** `0182d4b` test(web-next): add Phase 7 layout metadata + viewport contract tests
2. **[Green]** `02a6fe6` feat(web-next): introduce lib/metadata with static i18n-backed metadata & viewport
3. **[Refactor]** `c30c4d3` refactor(web-next): make metadataBase env-overridable via NEXT_PUBLIC_SITE_URL

## Phase 8 の進捗（Atomic UI Components）

### コンポーネント依存順

1. **DualCell** (Server) — `lib/cost` の `fmtUSD` / `fmtJPY` / `colorIndex` を結線する最下層 leaf ✅
2. **LanguageToggle** (Client) — `onToggle` コールバック prop を持つため Client Component 必須 ✅
3. **Hero** (Server) — `tRich("heroTitle"/"heroDesc")` で Phase 5 の投資を回収 ✅
4. **MathSection** (Server) — 4 枚の数式カード、JA/EN インライン三項演算子 ✅
5. **RefLinks** (Server) — 16 カード + `tRich("refNote", lang)` で XSS-safe 描画 ✅
6. **ScenarioSelector** (Client) — `useState` × 2 + `useId()` でラベル紐付け ✅

### Phase 8 コミット表

| # | コンポーネント | 種別 | Red | Green | Refactor |
|---|------|------|-----|-------|----------|
| 1 | DualCell | Server | `62b8ad0` | `2963fe6` | — |
| 2 | LanguageToggle | Client | `849afa0` | `c438a4b` | — |
| 3 | Hero | Server | `3c829de` | `a373706` | — |
| 4 | MathSection | Server | `71c022d` | `469e3ae` | — |
| 5 | RefLinks | Server | `97afb86` | `cff65fb` | — |
| 6 | ScenarioSelector | Client | `31644ab` | `98dd312` | — |

### キー設計判断

1. **Server Components を既定**、Client Component は「イベントハンドラ prop がある」「useState/useEffect が必要」場合のみ。結果として 6 個中 2 個のみが Client (LanguageToggle / ScenarioSelector)
2. **`tRich()` で生 HTML 注入を完全撲滅** — Hero と RefLinks は Phase 5 で先行投資した React 要素ファクトリを消費する
3. **LanguageToggle に `type="button"` を追加** — レガシーにはなかった小改善（submit 誤発火防止 + a11y）
4. **Hero の font-family を `var(--font-mono)` に変更** — Phase 6 の `next/font` 変数を活用（レガシーは `'JetBrains Mono', monospace` 直書き）
5. **MathSection の JA/EN 分岐はインライン三項** — レガシーが翻訳辞書にキーを登録せず直書きしていた構成を忠実移植。`const ja = lang === "ja"` シャドーで冗長性削減

### テストパターン

- 契約テスト (`*.test.tsx`) は `render()` → `container.querySelector(".class-name")` → `textContent.toContain("...")` の 3 点セット
- Client Component のハンドラテストは `vi.fn()` を使う（Biome の `noEmptyBlockStatements` により `() => {}` は不可）
- jpyRate=0 / NaN は `¥—` sentinel として出力されることを DualCell テストで検証

### RefLinks（Phase 5 投資の回収）

- レガシーは `refNote` を生 HTML 文字列として DOM に流し込んでいたが、`tRich("refNote", lang)` により React ノードとして合成する構成に刷新
- 静的検査テストが React の unsafe HTML 注入 API 名をソース内に含まないことを `readFileSync` で確認（API 名はリテラルで書かず `["danger","ously","Set","Inner","HTML"].join("")` で組み立てて検索する）
- 16 枚のカード（15 プロバイダー + 為替レート参考）のうち、通貨カード (ci === 15) だけ `💱 {JA|EN}` のタイトルを動的生成する仕様を保持

### ScenarioSelector（Client Component の型安全化）

- レガシーの `T[key as keyof typeof T][lang] as string` 型アサーションを `t(key, lang)` に置き換え
- `` `sc_${ScenarioKey}` `` をテンプレートリテラル型 `` ScLabelKey = `sc_${ScenarioKey}` `` で表現し、`t()` の第一引数を型安全に固定
- `<label>` の Biome `noLabelWithoutControl` に対応するため `useId()` で ID を 2 本発行し、数値 `<input>` と `htmlFor` で紐付け（range は視覚的な隣接で代替）
- `.scenarios` コンテナへスコープしたテキスト検索で、assumption-bar のラベル echo と取り違えるテスト衝突を回避

## Phase 9 の進捗（Table components）

### コンポーネント依存順

1. **SubTable** (Server) — state を持たず純粋に presentational なので先行 ✅
2. **ApiTable** (Client) — 列ソートのため `useState` × 2 必須 ✅

### Phase 9 コミット表

| # | コンポーネント | 種別 | Red | Green | Refactor |
|---|------|------|-----|-------|----------|
| 1 | SubTable | Server | `eadaabc` | `0d281e8` | — |
| 2 | ApiTable | Client | `424b68b` | `6e6c5bd` | — |

### SubTable（Server Component）

- レガシー `web/src/components/SubTable.tsx` から verbatim 移植（92 → 122 行）
- `i18n` は `T.colTool[lang]` から `t("colTool", lang)` に統一
- 期間列のキーは `idx` 番号ではなく `PERIODS` の `p.key` (`"1h"` / `"8h"` ...) を採用し、配列インデックスキー警告を期間列からは撲滅
- `tools.map((tool, idx) =>` の `grp-${idx}` / `row-${idx}` 外側キーは `biome-ignore lint/suspicious/noArrayIndexKey` をトップダウンで付与（レガシー互換維持のため）
- 12mo 列 (`p.hours >= 8760`) かつ `annual != null && annual < monthly * 12` のとき `.sub-flat` で年払 annualNote を表示する挙動を 21 件の契約テストで固定

### ApiTable（Client Component）

- レガシー `web/src/components/ApiTable.tsx` から移植
- `T.colX[lang]` → `t("colX", lang)` に統一（Phase 5 i18n API）
- `COL_KEYS` typed array で列キーを型安全に管理（レガシーの `as const` 配列を置換）
- 期間セルのキーは `PERIODS[ci].key` を使用（SubTable と同一パターン）
- `PROVIDER_COLORS` マップは 7 プロバイダー分のハードコード色を維持
- `biome-ignore lint/suspicious/noArrayIndexKey` を `grp-${idx}` / `row-${idx}` に付与（SubTable と同一パターン）
- 25 件の契約テスト: root 構造 (4) + ソート表示 (5) + グループヘッダ (3) + モデルセル (5) + 最安行 (3) + DualCell 配線 (2) + sort title a11y (2) + 静的検査 (1)

## Phase 10 の成果（Compose app/page.tsx）

### アーキテクチャ

```
app/page.tsx (Server Component)
  └── parsePricingData(pricingJson)  ← Zod ランタイム検証
  └── <HomePage data={pricing} />   ← Client Component へ委譲

components/HomePage.tsx ("use client")
  ├── useState × 5 (lang, tab, scenario, inputTokens, outputTokens)
  ├── <LanguageToggle />
  ├── <Hero />
  ├── <ScenarioSelector />
  ├── time-badges + tabs UI
  ├── <ApiTable /> | <SubTable />
  ├── tRich("apiNote"/"subNote") note-box
  ├── <MathSection />
  ├── <RefLinks />
  ├── tRich("disclaimer") disclaimer-box
  └── <footer>
```

### キー設計判断

1. **Server/Client 2 層分離**: page.tsx (Server) がデータ検証、HomePage (Client) が状態管理。SSG ビルド時に Zod が不正データを検出する Phase 3 の投資を回収
2. **生 HTML 注入の完全撲滅**: レガシーの `apiNote`/`subNote`/`disclaimer` 3 箇所を `tRich()` に置換。Phase 5 先行投資の最大の回収ポイント
3. **pricing.json は web-next/data/ にコピー**: web/ との独立性を維持。update.sh の更新は Phase 13/14 で対応

### Phase 10 コミット表

| ステップ | コミット | 内容 |
|---------|---------|------|
| Red | `4ffdc70` | 20 件の契約テスト (page.tsx 静的 4 + HomePage 16) |
| Green | `0cb392b` | page.tsx + HomePage.tsx 実装 |

## Phase 11 の成果（視覚パリティ検証）

### コードレベル検証（自動）

| 検証項目 | 結果 |
|---------|------|
| CSS クラス名 (全 8 コンポーネント) | 完全一致 |
| JSX 構造 (App.tsx vs HomePage.tsx) | 同一 |
| globals.css (227 行移植) | 等価 (font fallback 追加のみ) |
| tRich HTML 等価性 (apiNote/subNote/refNote/disclaimer) | `<strong>` + inline color 全一致 |
| model-tag cls 値 (9 種) | CSS・データ間で一致 |
| dev サーバー起動 | 正常 (459ms) |
| SSG ビルド | 成功 |

**検出差異: 0 件**。コードレベルでの視覚パリティは保証済み。

### 目視確認（手動 — ユーザー実施待ち）

```bash
# レガシー
cd web && bun run dev         # http://localhost:5173

# 新版
cd web-next && bun run dev    # http://localhost:3000
```

確認ポイント:
- [ ] JA/EN 切替
- [ ] API/Sub タブ切替
- [ ] シナリオ選択 → コスト変動
- [ ] 列ソート (▲/▼)
- [ ] 最安行ハイライト
- [ ] フッター情報
- [ ] レスポンシブ (900px 以下)

## 検証コマンド

```bash
cd web-next
bun run lint        # Biome check
bun run typecheck   # tsc --noEmit
bun run test        # Vitest (329 tests)
bun run build       # Next.js build
bun run dev         # 開発サーバー（Phase 11 視覚パリティ検証で使用）
```

## 次回セッションでの再開プロンプト

次のプロンプトをコピーして Claude Code に渡せば、コンテキストが復元される:

```
Next.js 移行プロジェクトの作業を再開してください。

- 現在のブランチ: feat/nextjs-migration
- 最新 HEAD: (Phase 11 コード検証済み)
- 移行計画: docs/NEXTJS_MIGRATION_PLAN.md
- 進捗トラッカー: MIGRATION_PROGRESS.md

上記 2 ファイルを読んで現在地を把握した上で、Phase 12
(統合テスト) に進んでください。

Phase 12 の目標:
- E2E レベルの統合テスト（vitest + jsdom の範囲内）
- 全コンポーネントが組み合わさった状態での動作検証
- pricing.json のデータが正しく表示されることを検証
- JA/EN 切替・タブ切替・シナリオ変更が連動すること

Phase 11 の目視確認が完了し問題がなければ Phase 12 に進行。
目視で差異が見つかった場合は、修正を先に行う。
```
