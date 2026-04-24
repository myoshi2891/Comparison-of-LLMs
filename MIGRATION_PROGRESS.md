# Next.js 移行 進捗トラッカー

> 本ファイルは `feat/nextjs-migration` ブランチでの移行作業の状況を記録する。
> 移行計画:
> - Phase 1–14（ホームページ）: [`docs/NEXTJS_MIGRATION_PLAN.md`](docs/NEXTJS_MIGRATION_PLAN.md)（凍結扱い）
> - Phase A–F（18 ガイドページ + 共通インフラ）: [`docs/NEXTJS_PHASE_A_F_PLAN.md`](docs/NEXTJS_PHASE_A_F_PLAN.md)
> - プロジェクト固有スキル: [`.claude/skills/nextjs-page-migration/SKILL.md`](.claude/skills/nextjs-page-migration/SKILL.md)

## 現在地

- **ブランチ**: `feat/nextjs-migration`
- **最新 HEAD**: `90b163e`（C-2 Green 完了 + faithful 移植 hero/s01/s02 まで）。**C-2 faithful 移植継続中**（s03〜s17 + sources 残 → 下記「Phase C-2 faithful 移植継続ポイント」参照）
- **未コミット作業**: なし（`git status` clean。`MIGRATION_PROGRESS.md` の本更新を除く）
- **コミット済み（C-2 関連、新しい順）**:
  - `90b163e` feat(web-next): faithful migration of /gemini/agent s02 (+135/-15)
  - `e9e9547` feat(web-next): faithful migration of /gemini/agent s01 (+472/-19)
  - `aa9c2ee` feat(web-next): migrate legacy/gemini/agent.html to /gemini/agent (Green)
  - `cb62441` 準備コミット（page.test.tsx + page.module.css）
- **次の作業**: `s03` 以降を 1 セクションずつ legacy HTML から faithful JSX 化 → 各セクション完了ごとに test + lint + commit
- **検証状態（Phase 1–14）**: `bun run build` 成功、`bun run test` **361 件中 360 passed**（失敗 1 件は既知の `lib/i18n.test.ts` key count — 別 Issue）、`uv run pytest` 5/5 passed
- **検証状態（Phase A Green）**: `bun run test` **405 件中 404 passed**（失敗 1 件は既知の i18n key count、Phase A Red 由来の 38 ケースはすべて green 化）。`bun run build` / `bun run typecheck` / Phase A 新規ファイルの Biome すべて通過。既知の 6 printWidth エラーは別 Issue
- **検証状態（Phase B-1）**: `bun run test` **413 件中 413 passed**（i18n key count ドリフト `b984f16` で同期修正済、Phase B-1 Red 由来 8 ケースは Green 化）。`bun run build` で `/claude/skill` が静的プリレンダリング成功、`bun run typecheck` / Phase B-1 新規ファイルの Biome すべて通過
- **検証状態（Phase B-2）**: `bun run test` **421 件中 421 passed**（Phase B-2 Red 由来 8 ケースは Green 化）。`bun run build` で `/gemini/skill` が静的プリレンダリング成功、`bun run typecheck` / Phase B-2 新規ファイルの Biome すべて通過
- **検証状態（Phase B-3）**: `bun run test` **429 件中 429 passed**（Phase B-3 Red 由来 8 ケースは Green 化）。`bun run build` で `/codex/skill` が静的プリレンダリング成功、`bun run typecheck` / Phase B-3 新規ファイルの Biome すべて通過
- **検証状態（Phase B-4）**: `bun run test` **437 件中 437 passed**（Phase B-4 Red 由来 8 ケースは Green 化）。`bun run build` で `/copilot/skill` が静的プリレンダリング成功、`bun run typecheck` / Phase B-4 新規ファイルの Biome すべて通過、`uv run pytest` 5/5 passed
- **検証状態（Phase C-1）**: `bun run test` **445 件中 445 passed**（Phase C-1 Red 由来 8 ケースは Green 化）。`bun run build` で `/claude/agent` が静的プリレンダリング成功、`bun run typecheck` / Phase C-1 新規ファイルの Biome すべて通過。C-2 Red（`9dfa184`）は 8 件 fail の状態でコミット済み（意図的）

## AI 作業ルール（Phase A–F 共通、**必読**）

以下は Phase A–F 遂行中に判明した問題を受けて確定したルール。新規セッションは作業開始前に必ず目を通すこと。CLAUDE.md の「AI 変更ルール」を補完する。

### R1. Biome フォーマット・lint の適用スコープ（Phase B-4 で判明）

- **禁止**: リポジトリ全体を対象にする Biome `--write` 実行。具体的には以下のいずれも実行しない:
  - `bun run lint:fix`（= `biome check . --write`）
  - `bunx biome check --write`（パス引数なし、カレント全体）
  - `bunx biome format --write`（同上）
- **理由**: CLAUDE.md「リポジトリ全体の自動フォーマット禁止」ルール違反。このリポジトリには既存の printWidth / organizeImports 違反 6 件が残存しており（別 Issue 対応中）、全体 `--write` はそれらを含む無関係ファイルを意図せず書き換えてしまう
- **実例**: Phase B-4 Green で `bun run lint:fix` を実行した結果、`components/ApiTable.tsx` / `ApiTable.test.tsx` / `HomePage.tsx` / `MathSection.tsx` / `ScenarioSelector.tsx` / `tests/phase7.metadata.test.ts` の 6 ファイルが fix 対象となり `git checkout --` で revert が必要になった
- **正しい手順**:
  1. `bun run lint` でまず全違反を一覧し、自分の作業範囲起点のものと pre-existing 6 件を切り分ける
  2. 自分の作業範囲のみを明示的にパス指定して fix: 例 `bunx biome check --write app/<provider>/<slug>/page.tsx app/<provider>/<slug>/page.module.css app/<provider>/<slug>/page.test.tsx`
  3. 再度 `bun run lint` を実行し、新規違反がゼロで pre-existing 6 件のみが残っていることを確認
- **コミット前チェックとの関係**: CLAUDE.md の「既知の 6 件 printWidth 違反は別 Issue、新規違反がないこと」は「新規違反ゼロ」だけを担保すればよいという意味であり、全体 `--write` を意図していない

### R2. faithful 移植の必須化（Phase C-2 で判明）

- **禁止**: legacy HTML の内容を要約・省略・縮約した JSX を生成すること（理由なし）。「契約テストが通る最小骨格」だけでコミットを終わらせない
- **必須**: legacy HTML の **全セクション・全リスト項目・全コードブロック・全 SVG・全 alert・全 table** を JSX に変換し、テキスト内容を 1 つも欠落させない
- **理由**: 本リポジトリの Phase A–F は「legacy HTML を Next.js page.tsx に置き換える」移植プロジェクトであり、コンテンツの省略は移行ではなく書き換えになる。Phase C-2 の Green コミット（`aa9c2ee`）では `legacy/gemini/agent.html` の 3,723 行に対し約 888 行の縮約版を提出してユーザーから差し戻された
- **正しい手順**:
  1. legacy の対象セクションの HTML を **すべて読む**（`Read` tool で行範囲指定）
  2. 1 セクション単位で JSX 化（hero / s01 / s02 / ... / sources の単位）
  3. 各セクション完了ごとに `bun run test app/<provider>/<slug>/page.test.tsx` と `bunx biome check --write app/<provider>/<slug>/page.tsx` を実行（R1 遵守）
  4. 全テスト・lint 通過を確認 → そのセクションだけで 1 commit
  5. 次のセクションへ
- **許容される正規化**:
  - HTML formatter 由来のインデント崩れ（`code-body` 内の 14 スペース連続インデント等）は、CSS `white-space: pre` 配下で意図された見た目に合わせて正規化してよい（Phase C-1 `claude/agent` の前例に倣う）
  - SVG 属性の kebab-case → camelCase 変換（`text-anchor` → `textAnchor` 等）
  - SVG `style="..."` → `style={{ ... }}` (JS object) 変換
  - SVG に `role="img"` + `aria-label` + `<title>` を付与（biome `noSvgWithoutTitle` 対応）
- **禁止の具体例**: 「リスト項目を 8 件 → 5 件にまとめる」「テンプレート文字列を「...」で省略」「SVG を簡略化」「table 行を抜粋」

### 今後のルール追加方針

Phase A–F 作業中に AI エージェントの実装ミスや仕様齟齬が判明した場合、本セクションに **判明した時点で** `R2`, `R3`, ... として追記する。追記は以下のテンプレに従う:

```
### Rn. <ルール要約>（<判明したフェーズ>で判明）

- **禁止 / 必須**: <何をしてはいけない / しなければならないか>
- **理由**: <なぜこのルールが必要か。CLAUDE.md ルールや過去のインシデントとの関連>
- **実例**: <実際に起こった問題の具体例>
- **正しい手順**: <代わりに行うべき具体的手順>
```

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
| 12 | 統合テスト | 完了 | `46fb653` |
| 13 | Deployment (netlify.toml) | 完了 | `1e99e3f` |
| 14 | カットオーバー (web/ → legacy/) | **完了** | `6372fe4`, `a5f2332` |
| A | Common Infrastructure (SiteHeader / DisclaimerBanner / nav-links) | **完了** | Red: `cf36235`, `646bdcb`, `af8cb2a`, `3eadda9`, `c55a21f`, `441b0cb` / Green: `4cc8068`, `7ee1a49`, `83cda74`, `e43b389`, `a619f6c`, `db67dd0` |
| B | Provider skill.html × 4 (`claude` / `gemini` / `codex` / `copilot`) | **完了** | B-1: Red `d4735b4` / Green `8515ec3` / chore `b984f16` ／ B-2: Red `d0038d0` / Green `037f45f` ／ B-3: Red `c0ee480` / Green `1dd1501` ／ B-4: Red `9d59aa0` / Green (本コミット) |
| C | Provider agent.html × 4 | **C-1 完了 / C-2 faithful 移植中（s03〜s17+sources 残）** | C-1: Red `2b7a0fa`, `2e6f993` / Green `5394d9d` ／ C-2: Red `9dfa184` / 準備 `cb62441` / Green `aa9c2ee` / faithful s01 `e9e9547` / faithful s02 `90b163e` |
| D | Long-form guides × 9（MDX 検討含む） | 未着手 | — |
| E | git_worktree.html（Mermaid + SVG） | 未着手 | — |
| F | Cutover (redirects / sitemap / legacy cleanup) | 未着手 | — |

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

## Phase 12 の成果（統合テスト）

### 成果物

- **設計書**: `docs/NEXTJS_INTEGRATION_TEST_DESIGN.md`（承認フロー: plan → docs 配置 → 実装）
- **統合テスト本体**: `web-next/components/HomePage.integration.test.tsx`（19 テストケース）
- **テストフィクスチャ**: `web-next/tests/fixtures/pricing.ts`（`minimalPricing` / `fullPricing` / `edgePricing` の 3 ファクトリ）

### カバレッジ（設計書のテストマトリクス 11 観点 → 19 ケースに展開）

| 観点カテゴリ | ケース数 | 代表的な検証 |
|------|-----|-----|
| 言語切替 | 5 | JA↔EN でタブ・列見出し・footer（円 ↔ JPY）の同時切替、active class 更新、可逆性 |
| タブ切替 | 3 | `#tabpanel-api` ↔ `#tabpanel-sub` のアンマウント/再マウント、`.note-box.info` 表示 |
| シナリオ選択 | 3 | sc_light → `SCENARIOS.light` 値で ApiTable 再計算、custom 入力で ApiTable 再計算 |
| 状態独立性 | 3 | EN+Sub の独立性、ソート+言語切替で `aria-sort` 維持、タブ往復でソートリセット |
| データ耐性 | 5 | 実データ `pricing.json` の完走、`jpy_rate=0` で `¥—`、`price=0` で `$0.00`、`.cheapest-row` 判定、SubTable の月額フォーマット |

### キー設計判断

1. **既存契約テストと別ファイルに分離**: `HomePage.test.tsx`（契約 16 件）は不変、`HomePage.integration.test.tsx` を新設。構造の回帰と機能の回帰を別々に検出できるようにする
2. **`fireEvent` 継続採用**: 既存 329 件と統一。`@testing-library/user-event` の依存追加を回避（CLAUDE.md「依存アップグレード禁止」準拠）
3. **期待値の独立算出**: ApiTable のコスト数値は `calcApiCost` を再呼び出しして期待値を導出し DOM と突合。DOM 側の文字列をそのまま正解にしない
4. **`edgePricing()` のみ Zod バイパス**: `jpy_rate=0` を `PricingDataSchema` が `positive()` で弾くため、毒データで UI 耐性を検証する fixture だけ `parsePricingData` を通さず直接構築（コメントで意図を明記）
5. **Red phase の結果ゼロ不具合**: 19 件のテストが一発全 green。Phase 11 までのコード実装が機能パリティを既に満たしていることを示す（Green/Refactor ステップを実質スキップ）

### テスト数推移

- Phase 11 完了時: 329 件
- Phase 12 追加分: 19 件（統合テスト）
- その他に Phase 11 以降の `main` マージで追加された i18n 関連テスト等: 13 件
- 現在: **361 件中 360 passed**（失敗 1 件は Phase 12 スコープ外の `lib/i18n.test.ts` の key count ハードコード）

### コミット履歴

Phase 12 全成果物は `46fb653` (feat(web-next): implement Phase 12 integration tests and update progress) に集約済。

## Phase 13 の成果（Deployment）

### 実装内容

- `web-next/next.config.ts`: `output: "export"` + `images.unoptimized: true` を追加
- `netlify.toml`: `base = "web-next"` / `command = "bun install && bun run build"` / `publish = "out"` / `NODE_VERSION = "20"` を設定

### 設計判断

1. **Pure static export (`output: "export"`) を採用**: `web-next/` は完全 SSG（動的ルート / Server Actions / cookies / headers / ISR すべてなし）。静的成果物を Netlify CDN から直接配信する
2. **`@netlify/plugin-nextjs` は導入しない**: プラグインの価値は SSR/ISR を Netlify Functions で動かすことだが、本プロジェクトにその需要がないため、関数コールドスタート・ビルド依存・デプロイフットプリント増を回避する。将来 SSR 必要時は `output` 行を外してプラグイン追加する 2 行差分で切替可能
3. **設計判断 8 を棚上げ**: `docs/NEXTJS_MIGRATION_PLAN.md` の当初判断 8（plugin 採用）と判断 9（static export）は冗長だった。判断 9 を採択し、判断 8 は「将来 SSR 導入時のオプション」として位置付け直す（docs 反映は Phase 14 にまとめて実施）
4. **ブランチスコープでのデプロイ切替**: `netlify.toml` は `feat/nextjs-migration` ブランチでのみ差し替わるため、`main` の本番配信は `web/` Vite ビルドを維持したまま deploy preview だけが `web-next/` 配信になる — これが「並行運用」の実質

### ローカル検証結果（コミット `1e99e3f` 時点）

| 項目 | 結果 |
|------|------|
| `bun run build` | ✅ 2.5s（Turbopack、4 静的ページ生成） |
| `out/index.html` | ✅ 91,736 bytes |
| `out/404.html` | ✅ 12,556 bytes |
| `out/_next/static/chunks/*` | ✅ 662KB（最大 227KB、次いで 57KB） |
| pricing.json 埋め込み | ✅ `price_in` 151 件 / Claude Opus 10 / GPT-5 37 / Gemini 67 を HTML 内に検出 |
| `bun run typecheck` | ✅ green |
| `bun run test` | 360/361（失敗 1 件は既知の `lib/i18n.test.ts` — Phase 13 外） |
| `bunx biome check next.config.ts` | ✅ green（変更ファイルは clean） |
| `bun run lint` 全体 | ⚠ 6 件（全て Phase 12 外の既存 printWidth/organizeImports 違反） |
| git diff | ✅ `netlify.toml` + `web-next/next.config.ts` の 2 ファイルのみ |

### Phase 14 で対応済みの持ち越し項目

1. ~~ルート `/pricing.json` URL 消失~~ → `web-next/public/pricing.json` 配置で解決 (`6372fe4`)
2. ~~ルート `/index.html` URL 消失~~ → 設計判断 9 により単一 HTML 廃止済。`/` は SSG で正常動作
3. ~~追加 favicon / PNG の外部参照確認~~ → `web-next/public/` に apple-touch-icon + sized favicons 配置 (`6372fe4`)
4. ~~`update.sh` の web-next 主系列化~~ → 2 ステップ構成に書換 (`a5f2332`)
5. ~~`web/` → `legacy/web/` 移動~~ → `git mv` 完了 (`a5f2332`)
6. ~~`docs/NEXTJS_MIGRATION_PLAN.md` 設計判断 8 の「棚上げ」注記~~ → 注記追加済み

### 別 Issue で対応（Phase 14 スコープ外）

7. `lib/i18n.test.ts:18` の key count ハードコード修正（47 vs 45）
8. 既存ファイル 5 本の Biome printWidth 違反修正

### Netlify Deploy Preview 検証（完了）

Deploy Preview にて以下を確認済み:

- [x] `/` が 200 でコスト比較ページを描画
- [x] JA/EN トグル / API/Sub タブ / 列ソート / シナリオ選択 / カスタム入力
- [x] 最安行ハイライト + バッジ
- [x] Netlify build 正常

## Phase 14 の成果（カットオーバー）

### 実装内容

1. **`web-next/public/` クリーンアップ**: create-next-app のスキャフォールド SVG 5 本を削除、`pricing.json` + favicon 3 本を配置
2. **`web/` → `legacy/web/`**: `git mv` で旧 Vite フロントエンドを退避（参照用に保持）
3. **`update.sh` 書換**: 3 ステップ（scrape→build→copy）→ 2 ステップ（scrape→copy）に簡素化。ローカルビルドを廃止し、Netlify 側でのビルドに一本化
4. **`netlify.toml`**: ブランチスコープ注記を削除
5. **設計判断 8 棚上げ**: `docs/NEXTJS_MIGRATION_PLAN.md` に注記追加

### データフロー（新）

```
update.sh (--no-scrape 対応)
  ├── 1/2 scraper → web-next/data/pricing.json (build-time import)
  └── 2/2 copy → web-next/public/pricing.json (/pricing.json URL 維持)
             └── pricing.json (root, convenience copy)
```

### コミット表

| # | コミット | 内容 |
|---|---------|------|
| 1 | `6372fe4` | public/ クリーンアップ + pricing.json + favicons |
| 2 | `a5f2332` | web/ → legacy/web/ + update.sh 書換 + netlify.toml 更新 |
| 3 | (本コミット) | ドキュメント更新（設計判断 8 棚上げ + 進捗記録） |

### 検証結果

| 項目 | 結果 |
|------|------|
| `bash update.sh --no-scrape` | ✅ 3 箇所に pricing.json 配信 |
| `bun run build` | ✅ `out/pricing.json` 存在、scaffold SVG なし |
| `bun run test` | 360/361（既知の 1 件は別 Issue） |
| `uv run pytest` | ✅ 5/5 |
| `legacy/web/` 存在 | ✅ |
| `web/` 不在 | ✅ |

## Phase A の設計方針（Red 着手中）

### スコープ

**含む（本 PR）**:

- Phase A Red テスト 5 本（~38 ケース、意図的に fail 状態で commit）
- `.gitignore` への `legacy/` 追加（`git rm --cached` は実施せず、HEAD 履歴は保全）
- `docs/NEXTJS_PHASE_A_F_PLAN.md`（Phase A–F 全体計画）
- `CLAUDE.md` の web-next 主系列化と Phase A–F 向け AI 変更ルール追加
- `.claude/skills/nextjs-page-migration/SKILL.md`（プロジェクト固有スキル）

**含まない（Phase A Green / 別 PR）**:

- `components/site/SiteHeader.tsx` / `SiteHeaderClient.tsx` / `DisclaimerBanner.tsx` の実装本体
- `app/layout.tsx` への `<SiteHeader />` + `<DisclaimerBanner />` 挿入
- Phase B–F の 18 ページ移行本体と Phase F の redirect 設定
- `legacy/` の物理削除（`.gitignore` 運用を継続）

### Red テスト 5 本

| # | パス | 戦略 | ケース数目安 | 固定する契約 |
|---|------|------|-----|-----|
| 1 | `web-next/tests/phaseA.nav-links.test.ts` | 直接 import + Zod 検証 | ~8 | `navLinks` + `NavLinkSchema` のエクスポート、Home + 4 dropdown + Git Worktree の 6 エントリ構成、clean URL、href バリデーション |
| 2 | `web-next/tests/phaseA.layout.test.ts` | `readFileSync` 文字列契約 | ~4 | `SiteHeader` / `DisclaimerBanner` の import、`{children}` より前に描画、`className="has-common-header"` |
| 3 | `web-next/components/site/SiteHeader.test.tsx` | `render()` + `querySelector` | ~12 | `nav#common-header[aria-label="Main Navigation"]` 構造、`ch-brand` リンク、dropdown 階層、`ch-active` + `aria-current="page"` 付与、GitHub 外部リンクの `rel="noopener noreferrer"`、XSS 静的検査 |
| 4 | `web-next/components/site/SiteHeaderClient.test.tsx` | `render()` + `vi.fn()` + `fireEvent` | ~8 | `"use client"` 先頭、ハンバーガー click で `ch-open` 切替、dropdown `aria-expanded` 切替、Escape/外側 click で閉じる |
| 5 | `web-next/components/site/DisclaimerBanner.test.tsx` | `render()` + `vi.mock('ResizeObserver')` | ~6 | `div.ch-disclaimer[lang="ja"]`、line1/line2 テキスト完全一致、`--ch-disclaimer-height` CSS 変数同期 |

**合計 ~38 tests**（現在 361 → 実装後 399 見込み）

### 留保事項（次セッションで確認）

1. **nav-links の URL 形式**: Phase A では clean URL（`/claude/skill` 等）を前提。`.html` サフィックス維持の方針変更が出たら、`nav-links.ts` と `SiteHeader.test.tsx` のアサート値を差し替える必要あり
2. **`git rm --cached -r legacy/`**: 今回は実施せず、`.gitignore` 追加のみで保守的運用。remote からも `legacy/` を消したい場合は別 PR で対応可能
3. **Green フェーズ着手タイミング**: 本 Red PR マージ後、ユーザー明示指示を待って Green に進む
4. **既存 `docs/NEXTJS_MIGRATION_PLAN.md`**: Phase 1–14 で凍結扱いとし、Phase A–F は新規 `docs/NEXTJS_PHASE_A_F_PLAN.md` で継続。双方の冒頭に相互リンクを追加済

## 残フェーズの俯瞰（Phase B–F）

詳細は [`docs/NEXTJS_PHASE_A_F_PLAN.md`](docs/NEXTJS_PHASE_A_F_PLAN.md) を参照。

| Phase | 目的 | 対象枚数 | 工数目安 |
|---|---|---|---|
| **B** | Provider `skill.html` × 4（`DocLayout` / `CodeBlock` テンプレ確立） | 4 | 2 日 |
| **C** | Provider `agent.html` × 4（テンプレ再利用） | 4 | 1.5 日 |
| **D** | 長文ガイド × 9（`.md` SSoT のページは MDX 化検討） | 9 | 3 日 |
| **E** | `git_worktree.html`（Mermaid `next/dynamic` + SVG JSX 化 + `shiki`） | 1 | 2 日 |
| **F** | カットオーバー（`netlify.toml [[redirects]]` 18 本 + sitemap.ts + robots.ts） | — | 0.5 日 |

**累積工数目安: 10 営業日**（Phase A 含む）。プロバイダー別 worktree で並列化すれば半減可能。

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

## 次回セッションでの再開プロンプト（任意の LLM 用、ツール非依存）

次のプロンプトをコピーして任意の Coding Agent（Claude Code / Codex / Cursor / Gemini CLI / Cline 等）に渡せば、コンテキストが復元される:

```
Next.js 移行プロジェクトの作業を再開してください。

- リポジトリ: LLM-Studies（Phase A–F の Next.js 移行作業中）
- 現在のブランチ: feat/nextjs-migration
- 最新 HEAD: 90b163e（C-2 Green 完了 + faithful 移植 hero/s01/s02 まで。git status は clean）
- 移行計画: docs/NEXTJS_PHASE_A_F_PLAN.md（Phase A–F）
- 進捗トラッカー: MIGRATION_PROGRESS.md（**作業開始前に必読**: §「AI 作業ルール」R1（Biome scope）/ R2（faithful 必須）/「Phase C-2 faithful 移植継続ポイント」）
- Phase C 詳細設計: docs/NEXTJS_PHASE_C_DETAILED_DESIGN.md（§5.2 C-2）
- プロジェクト固有スキル: .claude/skills/nextjs-page-migration/SKILL.md
- リポジトリ規約: CLAUDE.md（AGENTS.md / GEMINI.md からも参照される。AI 共通の編集ルール）

次の作業: web-next/app/gemini/agent/page.tsx の **s03 セクション以降を legacy HTML から省略なしで JSX 化**（s03〜s17 + sources、合計 16 セクション残）

絶対遵守ルール（R2、Phase C-2 で確定）:
- legacy/gemini/agent.html の対象セクションを Read で行範囲指定して全部読む
- 全リスト項目・全コードブロック・全 SVG・全 alert・全 table を JSX に転写。要約・省略・縮約は禁止
- 1 セクション完了ごとに以下を順に実行 → 全部 OK なら 1 コミット → 次のセクションへ:
  1. cd web-next && bun run test app/gemini/agent/page.test.tsx
  2. cd web-next && bunx biome check --write app/gemini/agent/page.tsx       # ← R1: 必ずパス指定
  3. cd web-next && bunx biome check app/gemini/agent/page.tsx app/gemini/agent/page.module.css app/gemini/agent/page.test.tsx
  4. cd web-next && bun run test       # 全 453 件が pass することを確認
  5. git add web-next/app/gemini/agent/page.tsx && git commit -m "feat(web-next): faithful migration of /gemini/agent <section-id> (...)"

絶対禁止:
- bun run lint:fix / bunx biome check --write （パス引数なし） — リポジトリ全体を書き換えるため（R1 違反）
- legacy HTML の内容を要約・省略 — Phase C-2 で R2 として明文化（要約版は差し戻し対象）
- legacy/ 配下の編集（CLAUDE.md「Phase A–F 中は legacy/ 凍結」）
- 既存ファイル（pricing.json / scraper / lib/cost.ts 等）への副作用的な変更

セクション別 legacy 行範囲（次セッションが Read で指定する範囲）:
| Section | legacy/gemini/agent.html 行範囲 | 特記事項 |
|---|---|---|
| s03 | 1792-1888 | AGENTS.md interop |
| s04 | 1889-2035 | ADK agent.py パターン |
| s05 | 2036-2121 | .geminiignore / settings.json |
| s06 | 2122-2189 | ルーティング決定ツリー（flow-wrap）|
| s07 | 2190-2263 | コスト最適モデル選択（table）|
| s08 | 2264-2298 | Anti-Patterns |
| s09 | 2299-2390 | まとめ table |
| s10 | 2391-2643 | ma-section 開始、ADK×A2A×MCP 4層構造（layer-stack）|
| s11 | 2644-2777 | agent.json (Agent Card)、code block 含む |
| s12 | 2778-2873 | マルチエージェント GEMINI.md |
| s13 | 2874-3033 | Orchestrator + RemoteA2aAgent code block |
| s14 | 3034-3123 | AgentEngine デプロイ |
| s15 | 3124-3196 | uc-grid (ユースケース) |
| s16 | 3197-3231 | マルチエージェント Anti-Patterns |
| s17 | 3232-3333 | 全ファイル役割まとめ table |
| sources | 3334-3722 | 25 件の src-card / src-card-new |

参考: Phase C-1 の faithful 移植成果物 web-next/app/claude/agent/page.tsx（1907 行）が正本テンプレート。
SVG・code block・table のパターンはそこを参照すること。

検証コマンド早見表:
  cd web-next && bun run test          # 453/453 passed が期待値
  cd web-next && bun run typecheck     # OK
  cd web-next && bun run build         # /gemini/agent を含む 10 ルートが ○ (Static)
  cd web-next && bun run lint          # 既知 6 件のみ（新規違反ゼロが必須）
  cd scraper && uv run pytest          # 5/5 passed

既知の持越し（別 Issue で対応、本作業では触らない）:
- lib/i18n.test.ts:18 の key count ハードコード
- 一部既存ファイルの Biome printWidth 違反 6 件（R1 により全体 lint:fix 禁止）
```

### LLM 別の補足

- **Claude Code**: `/nextjs-page-migration` skill が使える
- **Gemini CLI**: GEMINI.md が `@CLAUDE.md` を import する形にしてあるため、CLAUDE.md ルールが自動継承される
- **Codex / Cursor**: AGENTS.md（CLAUDE.md と同等内容）を読み込ませる
- **任意の Agent**: 上記プロンプトと CLAUDE.md・MIGRATION_PROGRESS.md・docs/NEXTJS_PHASE_C_DETAILED_DESIGN.md の 3 つを冒頭で読み込ませれば自走可能

## Phase C-2 faithful 移植継続ポイント — セッション継続

### 現時点の状態（HEAD: `90b163e`、`git status` clean）

| ファイル | 状態 | 内容 |
|---|---|---|
| `web-next/app/gemini/agent/page.test.tsx` | **コミット済み**（`cb62441`） | `>= 25` に訂正済み。8 件の契約テスト |
| `web-next/app/gemini/agent/page.module.css` | **コミット済み**（`cb62441`） | 1,329 行（legacy `<style>` 行 7–1,148 を CSS Modules 転写） |
| `web-next/app/gemini/agent/page.tsx` | **作成済み・faithful 移植中**（`aa9c2ee` → `e9e9547` → `90b163e`） | hero / s01 / s02 は legacy HTML から省略なし JSX 化完了。s03〜s17 + sources は **縮約版のまま残存**（次セッションで section ごとに置き換える）|

### faithful 移植の進捗チェックリスト

- [x] hero（heroEyebrow, h1 with "Gemini", chips 8 件）— Green コミット `aa9c2ee` で完了
- [x] s01: 全体アーキテクチャ（hier diagram + filetree SVG 380 行）— `e9e9547`
- [x] s02: GEMINI.md / AGENT.md（pat-grid + GEMINI.md テンプレ + 2 alert）— `90b163e`
- [ ] s03: AGENTS.md interop（legacy 1792-1888）
- [ ] s04: ADK agent.py パターン（legacy 1889-2035）
- [ ] s05: .geminiignore / settings.json（legacy 2036-2121）
- [ ] s06: ルーティング決定ツリー（legacy 2122-2189、`flowWrap` クラス使用）
- [ ] s07: コスト最適モデル選択（legacy 2190-2263、`tblWrap`）
- [ ] s08: Anti-Patterns（legacy 2264-2298）
- [ ] s09: まとめ（legacy 2299-2390、`tblWrap`）
- [ ] s10: ADK×A2A×MCP 4層構造（legacy 2391-2643、`maBanner` + `layerStack`）
- [ ] s11: agent.json (Agent Card)（legacy 2644-2777、code-wrap 含む）
- [ ] s12: マルチエージェント GEMINI.md（legacy 2778-2873）
- [ ] s13: Orchestrator + RemoteA2aAgent（legacy 2874-3033、code-wrap 含む）
- [ ] s14: AgentEngine（legacy 3034-3123）
- [ ] s15: ユースケース（legacy 3124-3196、`ucGrid`）
- [ ] s16: マルチエージェント Anti-Patterns（legacy 3197-3231）
- [ ] s17: 全ファイル役割まとめ（legacy 3232-3333、`tblWrap`）
- [ ] sources: 25 件 src-card（legacy 3334-3722、SOURCES 配列は既に完全。レンダリング側のみ確認）

### 次セッションのワークフロー（厳守）

各セクションごとに以下を 1 サイクルとして繰り返す:

1. `Read legacy/gemini/agent.html` を行範囲指定で実行（上記チェックリストの行範囲）
2. `web-next/app/gemini/agent/page.tsx` の対応する縮約版セクション（`{/* sNN: ... */}` コメント付き）を `Edit` で完全 faithful 版に置き換え
3. `cd web-next && bun run test app/gemini/agent/page.test.tsx`（8/8 pass）
4. `cd web-next && bunx biome check --write app/gemini/agent/page.tsx`（**R1 厳守**: パス必須）
5. `cd web-next && bunx biome check app/gemini/agent/page.tsx app/gemini/agent/page.module.css app/gemini/agent/page.test.tsx`（違反 0）
6. `cd web-next && bun run test`（453/453 pass）
7. `git add web-next/app/gemini/agent/page.tsx && git commit -m "feat(web-next): faithful migration of /gemini/agent <sNN> (...)"`
8. 次のセクションへ（チェックリストにチェックを入れて MIGRATION_PROGRESS.md を 1 行更新するのは任意）

### 今セッションで確立した C-2 設計事実

#### ソース数の訂正（設計書 §5.2 の `28 件` は誤りだった）

- 設計書 `docs/NEXTJS_PHASE_C_DETAILED_DESIGN.md` §5.2「SOURCES 件数: 28」は **誤り**
- `legacy/gemini/agent.html` の実際の構成:
  - `class="src-card"` のみ（既存）: **12 件**
  - `class="src-card src-card-new"` のみ（新規 A2A 系）: **13 件**
  - 合計: **25 件**（grep で 3 通りの方法で確認済み）
- `page.test.tsx` の `>= 28` を `>= 25` に訂正済み（未コミット）

#### Section ID 戦略（確定）

- legacy HTML の `<div class="section">` には id 属性が **ゼロ件**（synthetic id 方式を採用）
- Section IDs: `s01` 〜 `s17`（17 件）+ `sources` = **18 件**
- セクション 10〜17 はマルチエージェント扱いで `className={`${styles.section} ${styles.sectionMa}`}` を使用

#### CSS Module の確定クラス名（kebab → camelCase 変換済み）

主要クラス（完全一覧は `page.module.css` 参照）:
- レイアウト: `.root`, `.wrapper`, `.hero`, `.toc`, `.tocTitle`, `.section`, `.sectionMa`, `.sectionHead`, `.sectionNum`
- コード: `.codeWrap`, `.codeBar`, `.codeBody`, `.lang`、構文強調: `.ck`, `.cs`, `.cv`, `.cc`, `.ch`, `.cm`, `.cw`, `.ce`
- 階層図: `.hierWrap`, `.hierTitle`, `.hierCol`, `.hierBox`, `.hbGlobal`, `.hbProject`, `.hbSub`, `.hbAuto`, `.hierArrowDown`, `.hierConnector`, `.hierConnectorArrow`, `.hierLabel`, `.hierPriority`
- ファイルツリー: `.filetreeWrap`, `.filetreeHeader`, `.ftDot`
- カード/アラート: `.card`, `.cardTitle`, `.alert`, `.alertIcon`, `.alertInfo`, `.alertWarn`, `.alertDanger`, `.alertSuccess`, `.alertContent`
- パターングリッド: `.patGrid`, `.pat`, `.patOk`, `.patNg`, `.patLabel`
- フロー図: `.flowWrap`, `.flowTitle`, `.flowRow`, `.fnQ`, `.fnY`, `.fnN`, `.fnArr`, `.fnLabel`, `.fnIndent`
- テーブル: `.tblWrap`（`table`/`thead th`/`tbody td`/`td code` は `.root` スコープで自動適用）
- エージェントグリッド: `.agentGrid`, `.agentCard`, `.agentCardIcon`, `.agentCardTitle`, `.agentCardDesc`, `.agentCardEx`
- チップ: `.chip`, `.chipBlue`, `.chipGreen`, `.chipYellow`, `.chipRed`, `.chipPurple`, `.chipTeal`
- マルチエージェント: `.maBanner`, `.maEyebrow`, `.layerStack`, `.layerRow`, `.lrAdk`, `.lrA2a`, `.lrMcp`, `.layerBadge`, `.lbAdk`, `.lbA2a`, `.lbMcp`, `.layerTitle`, `.layerBody`, `.layerDesc`, `.layerFile`
- 比較グリッド: `.cmp2Grid`, `.cmp2`, `.cmp2Sub`, `.cmp2Mult`, `.cmp2Label`
- A2A アーキテクチャ: `.a2aArch`, `.a2aArchTitle`, `.a2aRow`, `.a2aLabel`, `.a2aBox`, `.abOrch`, `.abLocal`, `.abRemote`, `.abCard`, `.abEngine`, `.a2aArrow`
- ユースケース: `.ucGrid`, `.uc`, `.ucIcon`, `.ucTitle`, `.ucDesc`, `.ucCode`
- 決定フロー: `.dflow`, `.dflowTitle`, `.dflowRow`, `.dnQ`, `.dnY`, `.dnN`, `.dnArr`, `.dnInd`
- ソース: `.srcGrid`, `.srcCard`, `.srcCardNew`, `.srcSeparator`, `.srcIcon`, `.srcTitle`, `.srcUrl`, `.srcDesc`
- ヒーロー: `.heroEyebrow`, `.heroChips`, `.heroChip`、その他: `.mono`

#### page.tsx 実装ガイド（次セッション用）

**Source 型**:

```ts
type Source = { icon: string; title: string; href: string; url: string; desc: string };
```

**`Ext` ヘルパ**（全外部リンクをラップ）:

```tsx
function Ext({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}
```

**セクション構造テンプレート**:
- `s01`〜`s09`: `<section id="s01" className={styles.section}>` ... `</section>`
- `s09` と `s10` の間に `<hr />`
- `s10`〜`s17`: `<section id="s10" className={`${styles.section} ${styles.sectionMa}`}>` ... `</section>`
- `s17` と `sources` の間に `<hr />`
- `<section id="sources" className={styles.section}>` ... `</section>`

**コードブロックレンダリング方針**:
- React の生 HTML 注入 prop（needle: `["danger","ously","Set","Inner","HTML"].join("")`）は使用禁止（static test で CI fail）
- `<div className={styles.codeBody}>{templateLiteralString}</div>` パターンを使用
- CSS の `white-space: pre` が改行を保持するため、文字列渡しで OK
- シンタックスハイライト span（`.ck`, `.cm` 等）は省略可（テストが検査しない）

**外部リンクの所在**:
- ソースセクション（`id="sources"`）のみに外部リンクが存在
- セクション本文内（コードブロック文字列・テーブルセル等）に `<a>` 要素は不要

**SOURCES 配列**（12 + 13 = 25 件、詳細は MIGRATION_PROGRESS.md 本セクションの以下の表）:

既存 12 件（`class="src-card"`）:
1. 🔵 Gemini CLI 公式: GEMINI.md ドキュメント — `https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html`
2. 🟢 Google Developers: Gemini Code Assist agent mode — `https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer`
3. 🟡 Google Cloud Docs: Gemini Code Assist agent mode — `https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer`
4. 🔴 Android Developers: AGENTS.md ファイル — `https://developer.android.com/studio/gemini/agent-files`
5. 🟣 ADK 公式: Multi-agent systems — `https://google.github.io/adk-docs/agents/multi-agents/`
6. 🟠 Google Cloud Blog: Multi-agent patterns in ADK — `https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/`
7. ⚪ Google Cloud Blog: Building Collaborative AI (ADK) — `https://cloud.google.com/blog/topics/developers-practitioners/building-collaborative-ai-a-developers-guide-to-multi-agent-systems-with-adk`
8. 🔵 Addy Osmani: Gemini CLI Tips & Tricks — `https://addyosmani.com/blog/gemini-cli/`
9. 🟢 Google Cloud Medium: GEMINI.md hierarchy Part 1 — `https://medium.com/google-cloud/practical-gemini-cli-instruction-following-gemini-md-hierarchy-part-1-3ba241ac5496`
10. 🟡 GitHub: AGENTS.md 標準化ディスカッション — `https://github.com/google-gemini/gemini-cli/discussions/1471`
11. ⚫ Phil Schmid: Gemini CLI Cheatsheet — `https://www.philschmid.de/gemini-cli-cheatsheet`
12. 🔴 Google Codelabs: Build Multi-Agent Systems with ADK — `https://codelabs.developers.google.com/codelabs/production-ready-ai-with-gc/3-developing-agents/build-a-multi-agent-system-with-adk`

新規 13 件（`class="src-card src-card-new"`）:
1. 🌐 ADK 公式: A2A Protocol 入門 — `https://google.github.io/adk-docs/a2a/intro/`
2. 🟢 ADK 公式: A2A Quickstart（Exposing） — `https://google.github.io/adk-docs/a2a/quickstart-exposing/`
3. 🔵 Google Blog: Agent2Agent (A2A) Protocol 発表 — `https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/`
4. 🟡 Google Cloud Blog: ADK エージェントを A2A に変換する — `https://cloud.google.com/blog/products/ai-machine-learning/unlock-ai-agent-collaboration-convert-adk-agents-for-a2a`
5. 🟣 Google Developers Blog: ADK + Interactions API — `https://developers.googleblog.com/building-agents-with-the-adk-and-the-new-interactions-api/`
6. 🟠 Google Codelabs: A2A Purchasing Concierge — `https://codelabs.developers.google.com/intro-a2a-purchasing-concierge`
7. ⚫ Harris Solangi: Building Connected AI Agents — `https://harrissolangi.medium.com/building-connected-ai-agents-googles-adk-and-the-a2a-protocol-704ce3347cfc`
8. 🔴 GitGuardian Blog: Multi-Agent Security Pipeline with A2A — `https://blog.gitguardian.com/building-a-multi-agent-security-pipeline-with-googles-a2a-protocol-and-gitguardian/`
9. 🟥 Gemini モデル一覧（Gemini API 公式） — `https://ai.google.dev/gemini-api/docs/models`
10. ⛔ Gemini deprecations（廃止スケジュール） — `https://ai.google.dev/gemini-api/docs/deprecations`
11. 🟦 ADK TypeScript / JavaScript SDK — `https://github.com/google/adk-typescript`
12. 🟧 Google Developers Blog: AP2 / A2UI / AG-UI 新プロトコル — `https://developers.googleblog.com/en/new-agent-protocols-ap2-a2ui-ag-ui/`
13. 🟩 ADK Python 2.0 Alpha（グラフベース） — `https://google.github.io/adk-docs/agents/workflow-agents/graph/`

**17 セクション見出し**（順序固定）:
1. 全体アーキテクチャと各ファイルの位置づけ
2. GEMINI.md / AGENT.md — コンテキストファイルの設計
3. AGENTS.md — クロスツール互換戦略
4. ADK agent.py — サブエージェント定義のベストプラクティス
5. .geminiignore と settings.json — 制御ファイル設計
6. サブエージェント ルーティング設計の意思決定ツリー
7. コスト最適なモデル選択戦略
8. 絶対に避けるべき Anti-Patterns
9. まとめ：各ファイルの役割と設計原則
10. サブエージェント vs マルチエージェント — ADK × A2A × MCP × AP2/A2UI の4層構造
11. A2A の核心：agent.json（Agent Card）— リモートエージェントの「能力書」
12. マルチエージェント向け GEMINI.md — Orchestrator の「作戦指令書」
13. マルチエージェント agent.py — Orchestrator + RemoteA2aAgent 実装パターン
14. AgentEngine（Vertex AI）本番デプロイと GEMINI.md 連携
15. マルチエージェント ユースケース別 設計パターン
16. マルチエージェント固有の Anti-Patterns — 設計・運用両面
17. 全ファイル役割まとめ（マルチエージェント + A2A 対応版）

**SVG 変換規則**（section 1 のファイルツリー SVG、約 380 行）:
- `style="..."` → `style={{ ... }}`（JS オブジェクト形式）
- `font-family` → `fontFamily`, `font-size` → `fontSize`, `font-weight` → `fontWeight`
- `text-anchor` → `textAnchor`, `stroke-width` → `strokeWidth`, `letter-spacing` → `letterSpacing`
- `stop-color: #...` → `style={{ stopColor: "#..." }}`

### コミット予定順序（`cb62441` 以降）

1. ~~`page.test.tsx` + `page.module.css` を一緒にコミット~~ → **済み（`cb62441`）**
2. `page.tsx` 作成 → `bun run test`（453 件 pass 確認）→ コミット（Green）: `feat(web-next): migrate legacy/gemini/agent.html to /gemini/agent (Green)`
3. `MIGRATION_PROGRESS.md` 更新 → コミット: `chore: update migration progress for Phase C-2 completion`

---

## Phase C-1 完了 / C-2 Red コミット済み — セッション区切り

ここで新セッションへ切替え可能。次の作業は Phase C-2（`/gemini/agent`）の Green 実装。

### 今回のコミット履歴（feat/nextjs-migration、Phase C 範囲）

```
9dfa184  test(web-next): add Phase C-2 /gemini/agent contract test (Red)
5394d9d  feat(web-next): migrate legacy/claude/agent.html to /claude/agent (Green)
2e6f993  test(web-next): fix Phase C-1 /claude/agent contract test — 18 sections (Red)
2b7a0fa  test(web-next): add Phase C-1 /claude/agent contract test (Red)
```

### 検証結果（Phase C-1 Green 時点）

| 項目 | 結果 |
|------|------|
| `bun run test` | 445 / 445 passed（Phase C-1 契約 8 件含む） |
| `bun run typecheck` | OK |
| `bun run build` | `/claude/agent` 静的プリレンダリング成功 |
| `bun run lint`（Phase C-1 新規ファイル） | 違反 0（既知 6 件は pre-existing） |

### キー設計判断（Phase C-1 で判明した事項）

- **H2 ゼロページへの対応**: `legacy/claude/agent.html` は `<div class="section">` + `<span class="num">N</span>` 構造で id 属性が無い。synthetic id（`s01`〜`sNN`）を移植時に付与する方針を採用（詳細は `docs/NEXTJS_PHASE_C_DETAILED_DESIGN.md` §5.1）
- **Phase C-1 の section 数は 18**: Red コミット後に grep で確認し `page.test.tsx` を修正（`2b7a0fa` → `2e6f993` の 2 commit に分かれた経緯）

### 次セッションへの申し送り

- **最重要**: C-2 の Red test (`9dfa184`) は現在 fail 状態。Green 実装で 8 件全て pass にしてから C-3 へ進む
- 開始時読むファイル（順序固定）:
  1. `MIGRATION_PROGRESS.md`（現在地確認）
  2. `docs/NEXTJS_PHASE_C_DETAILED_DESIGN.md`（§5.2 C-2 の仕様）
  3. `.claude/skills/nextjs-page-migration/SKILL.md`（9 ステップ手順）
  4. B-4 参考実装: `web-next/app/copilot/skill/page.tsx`（正本テンプレート）
- Phase B / C-1 で確立した方針（Server Component + CSS Modules に legacy `<style>` をポート + SOURCES 配列 + ブランドカラートークンを `.root` スコープ + 大量テンプレートは named constants へ退避）は C-2〜C-4 でも踏襲

## Phase B-4 完了 — セッション区切り（アーカイブ）

Phase B（skill.html × 4）は完了済み。以下は参考アーカイブ。

### Phase B-4 コミット履歴

```
(Phase B-4 Green) feat(web-next): migrate legacy/copilot/skill.html to /copilot/skill (Green)
9d59aa0           test(web-next): add Phase B-4 /copilot/skill contract test (Red)
```

### Phase B-4 検証結果

| 項目 | 結果 |
|------|------|
| `bun run test` | 437 / 437 passed |
| `bun run build` | `/copilot/skill` 静的プリレンダリング成功 |
| `uv run pytest` | 5 / 5 passed |

### Phase B で確立した主要設計判断

- **Server Component**: 状態を持たないため `"use client"` 不要。各 `/*/skill` を `○ (Static)` として SSG プリレンダリング
- **CSS Modules `.root` スコープ**: ブランドカラートークンをページ間で衝突させない
- **SOURCES 配列の分割パターン**: 視覚セパレータがあれば `SOURCES_NEW` + `SOURCES_EXISTING` の 2 分割
- **`<pre>` 内の文字列リテラル子要素**: React 生 HTML 注入 API（`["danger","ously","Set","Inner","HTML"].join("")` で CI 検査）を使わず、`{"..."}` + `<span>` の組み合わせで構築
- **テンプレート定数への切出し**: 3 行以上の長文スニペットは named constants に退避して page.tsx の縦長を抑制
