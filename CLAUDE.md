# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

AIモデルの時間別コスト計算機 + AI ツール導入ガイド群。Python スクレイパーが各社料金ページから価格を自動取得し `pricing.json` を生成、**Next.js 16 App Router（SSG / `output: 'export'`）** がそれを読み込んで Netlify CDN へ配信する。Phase 1–14 でコスト計算機ページが Next.js 化済み。残る 18 枚のガイドページ（旧 `legacy/` 配下）は Phase A–F で順次移行中（[`docs/NEXTJS_PHASE_A_F_PLAN.md`](docs/NEXTJS_PHASE_A_F_PLAN.md)）。

## アーキテクチャ

```text
update.sh  ← オーケストレーター (scrape → copy)
├── scraper/            Python 3.12+ (uv, Pydantic v2, Playwright, httpx)
│   └── src/scraper/
│       ├── main.py              CLI エントリポイント
│       ├── models.py            PricingData / ApiModel / SubTool スキーマ
│       ├── exchange.py          USD/JPY レート取得 (Frankfurter API)
│       ├── browser.py           Playwright 共通ユーティリティ
│       ├── providers/           API プロバイダー別スクレイパー (anthropic, openai, google, aws, deepseek, xai)
│       └── tools/               コーディングツール別スクレイパー (cursor, github_copilot, windsurf, claude_code, jetbrains, openai_codex, google_one, antigravity)
├── web-next/           Next.js 16 + React 19 + TypeScript + Tailwind v4 (bun)
│   ├── app/
│   │   ├── layout.tsx           ルートレイアウト (SiteHeader/DisclaimerBanner マウント済み)
│   │   ├── page.tsx             コスト計算機ホーム (Server Component + Zod 検証 → HomePage へ委譲)
│   │   ├── globals.css          Tailwind v4 + legacy design tokens (227 行)
│   │   └── {claude,gemini,codex,copilot}/{skill,agent}/   Phase B–C 移行済みルート（詳細は MIGRATION_PROGRESS.md）
│   ├── components/
│   │   ├── HomePage.tsx         Client Component (Phase 10)
│   │   ├── ApiTable.tsx / SubTable.tsx / Hero.tsx / ...   (Phase 8-10 成果物)
│   │   └── site/                Phase A 共通インフラ（追加済み） (SiteHeader, DisclaimerBanner, nav-links)
│   ├── lib/
│   │   ├── cost.ts              純粋関数 (calcApiCost / calcSubCost / colorIndex / fmtUSD / fmtJPY)
│   │   ├── pricing.ts           Zod スキーマ + コンパイル時パリティアサート
│   │   ├── i18n.tsx             T オブジェクト + t() + tRich() (React 要素ファクトリ)
│   │   ├── fonts.ts             next/font/google (Noto Sans JP / JetBrains Mono / Syne)
│   │   └── metadata.ts          静的 Metadata / Viewport
│   ├── types/pricing.ts         Pydantic 同期型定義
│   ├── data/pricing.json        ビルド時 static import 用 (update.sh がコピー)
│   ├── public/pricing.json      /pricing.json URL 配信用 (update.sh がコピー)
│   ├── tests/                   vitest (最新のテスト結果や既知の Issue については CI または進捗ドキュメントを参照)
│   ├── next.config.ts           output: 'export' + images.unoptimized
│   ├── biome.json               Biome lint/format
│   └── vitest.config.ts         jsdom + @ alias
├── netlify.toml        Netlify デプロイ設定 (base=web-next, publish=out, Next.js SSG)
├── .githooks/          共有 Git フック (post-merge: ソース変更時にドキュメント更新漏れを警告)
├── legacy/             旧 Vite/HTML 資産 (.gitignore 済、ローカル参照専用)
│   ├── web/                     旧 Vite フロントエンド (Phase 14 でカットオーバー)
│   ├── index.html               旧ホーム (単一ファイル)
│   ├── shared/common-header.*   共通ヘッダー (Phase A で SiteHeader に置換済み)
│   ├── claude/ gemini/ codex/ copilot/   18 HTML ガイド (Phase B–E で page.tsx 化へ移行中)
│   └── git_worktree.html        Mermaid v10 + 手書き SVG (Phase E は移行中)
└── docs/
    ├── NEXTJS_MIGRATION_PLAN.md      アーキテクト初期プロンプト (Phase 1–14 完了で凍結)
    └── NEXTJS_PHASE_A_F_PLAN.md      Phase A–F 計画
```

## データフロー

1. `scraper/` が各社ページをスクレイプ → `pricing.json` を生成
2. スクレイパーは既存 `pricing.json` をフォールバック値として使用（3層: スクレイプ成功 → 既存値 → ハードコード値）
3. `update.sh` が生成結果を **`web-next/data/pricing.json`（ビルド時 static import 用）** と **`web-next/public/pricing.json`（`/pricing.json` URL 配信用）** の 2 箇所へコピー
4. `web-next/` がビルド時に `data/pricing.json` を `import` し Zod で検証 → Server Component 内で型安全に参照
5. Next.js が `output: 'export'` で静的 HTML を `out/` へ生成 → Netlify CDN から配信（pure SSG、`@netlify/plugin-nextjs` 不要）

**注意**: `vite-plugin-singlefile` による単一 HTML 配布は廃止済（設計判断 9）。ルート `/pricing.json` URL は `public/` 経由で維持する。

## コマンド

### セットアップ

```bash
# スクレイパー
cd scraper && uv sync && uv run playwright install chromium

# フロントエンド
cd web-next && bun install

# Git フック（クローン後に一度だけ実行）
git config core.hooksPath .githooks
```

### 全体更新（scrape → copy）

```bash
bash update.sh              # フルパイプライン (Netlify 側でビルド)
bash update.sh --no-scrape  # 為替レートのみ更新、既存価格データ保持
```

### スクレイパー単体

```bash
cd scraper
uv run python -m scraper.main --output ../pricing.json
uv run python -m scraper.main --no-scrape  # 為替レートのみ
uv run scraper                              # pyproject.toml の scripts 経由でも起動可能
```

### フロントエンド

```bash
cd web-next
bun run dev         # Next.js 開発サーバー (http://localhost:3000)
bun run build       # Next.js ビルド → out/ に静的エクスポート
bun run lint        # Biome check
bun run lint:fix    # Biome check --write
bun run typecheck   # tsc --noEmit
bun run format      # Biome format --write
```

### テスト

```bash
cd web-next && bun run test   # フロントエンド (vitest, 最新のテスト結果や既知の Issue は CI 等を参照)
cd scraper && uv run pytest   # バックエンド (pytest, テスト結果は CI 等を参照)
```

## 重要な設計判断

- **Next.js 16 App Router + SSG**: `output: 'export'` で pure 静的エクスポート → Netlify CDN 配信。`@netlify/plugin-nextjs` 不要。Phase 1–14 で Phase 1 のホームページが移行済、Phase A–F で残 18 ページを移行（[`docs/NEXTJS_PHASE_A_F_PLAN.md`](docs/NEXTJS_PHASE_A_F_PLAN.md)、[`docs/NEXTJS_MIGRATION_PLAN.md`](docs/NEXTJS_MIGRATION_PLAN.md)）
- **3層フォールバック**: スクレイパーは「スクレイプ成功 → 既存 JSON の値 → ハードコードフォールバック」の順で価格を決定。`scrape_status` フィールド (`success` | `fallback` | `manual`) で出自を追跡
- **型の同期**: `scraper/src/scraper/models.py` (Pydantic) が SSoT、`web-next/types/pricing.ts` (TypeScript) が手動ミラー、`web-next/lib/pricing.ts` の `_AssertParity` でコンパイル時検証。**片方を変更したら必ずもう片方も更新すること**
- **JA/EN バイリンガル**: `web-next/lib/i18n.tsx` で全テキストを管理（`T` オブジェクト + `t()` / `tRich()` の React 要素ファクトリ）。各スクレイパーも `sub_ja` / `sub_en` や `note_ja` / `note_en` のペアで日英テキストを持つ。ガイドページ（Phase B–E）は当面 JA 固定
- **XSS 対策**: 生 HTML 文字列挿入 API は `web-next/` 内で一切使わない。`tRich()` で React 要素として合成し、静的検査テストで CI 毎に確認
- **Netlify デプロイ**: `netlify.toml` で `base = "web-next"` / `command = "bun install && bun run build"` / `publish = "out"` を設定。ビルドのみ実行（スクレイパーは走らない）。リポジトリ内の既存 `pricing.json` をそのまま使用

## TypeScript 制約

- `strict: true` + `noUnusedLocals` + `noUnusedParameters`
- `erasableSyntaxOnly: true` — **enum と namespace は使用禁止**（TypeScript 5.5+ の制約）
- Biome: `web-next/biome.json` で space 2 / 100 col / `noExplicitAny` / `noDoubleEquals` 他を適用
- `web-next/AGENTS.md` の注意書き遵守: Next.js 16 は訓練データと挙動が異なる可能性があるため、`web-next/node_modules/next/dist/docs/` を都度参照

## 新しいプロバイダー/ツールの追加パターン

1. `scraper/src/scraper/providers/<name>.py` (API) または `tools/<name>.py` (ツール) を作成
2. `_FALLBACKS` 辞書にハードコードフォールバック値を定義
3. `scrape(existing)` 関数を実装 → `list[ApiModel]` または `list[SubTool]` を返す
4. `providers/__init__.py` または `tools/__init__.py` にインポート追加
5. `main.py` の `_scrape_all()` にエントリ追加
6. フロント型は `web-next/types/pricing.ts` を手動で同期（Pydantic と一致）。`web-next/lib/pricing.ts` の `_AssertParity` が型不整合をコンパイル時に検出する

## ランタイム要件

- Python 3.12+, uv (パッケージマネージャー)
- Playwright ブラウザ (`uv run playwright install chromium`)
- Bun (フロントエンドビルド)

## AI 変更ルール

このリポジトリは AI アシスト対象。全 AI エージェント (Jules, Claude, Copilot 等) は以下を厳守すること。

### 禁止事項

- ファイル全体の書き直し（明示的な指示がない限り）
- 依存関係のアップグレード
- CI ワークフロー構造の変更（明示的な指示がない限り。ただしユーザー指示による追加・修正は許容される。例: `.github/workflows/auto-fix.yml`）
- ビルドツール設定の変更 (next, bun, biome, pytest, tsconfig)
- ディレクトリのリネーム・ファイルの `web-next/` ↔ `scraper/` 間移動
- リポジトリ全体の自動フォーマット
- 新しいフレームワークの導入
- 環境変数・Netlify 設定の変更
- スタイル目的のリライト
- **`legacy/` 配下の編集**（Phase A–F 遂行中は凍結。`.gitignore` により事故的な push は防止されているが、編集自体を避ける）

### 許可される変更

- テスト追加（既存テストファイルがある場合、またはユーザー指示）
- import 修正
- CI 修正
- 小規模な型修正

### テストポリシー

許可: import スモークテスト、純粋関数テスト、決定論的コンポーネントレンダリングテスト

禁止: スナップショットテスト、ブラウザ自動化テスト、ネットワークテスト、重い結合テスト

### インポート安全性

モジュールの動的クロスディレクトリインポート禁止。`scraper/` → `scraper/` のみ、`web-next/` → `web-next/` のみ。

### CI 定義

```text
Frontend:  cd web-next && bun run test
Backend:   cd scraper && uv run pytest
Typecheck: cd web-next && bun run typecheck
Lint:      cd web-next && bun run lint
Build:     cd web-next && bun run build
```

### コミット前チェック

以下を全て確認してからコミットすること：

1. `cd web-next && bun run build` が成功
2. `cd web-next && bun run test` が成功
3. `cd web-next && bun run typecheck` が成功
4. `cd web-next && bun run lint` が成功（既知の違反件数は CI または進捗ドキュメントを参照、新規違反がないこと）
5. `cd scraper && uv run pytest` が成功
6. import が有効
7. 設定ファイルが意図せず変更されていない

いずれか失敗 → **停止してユーザーに確認**。

### CI 失敗時の対応

1. 失敗しているエラーのみ修正
2. リファクタリング禁止
3. 依存関係変更禁止
4. テスト書き直しは壊れている場合のみ

### パッチ戦略

small diff > medium diff > large diff — 常に最小の差分を選択。

### Phase A–F ガイドページ移行ルール

Phase A–F 遂行中、新規ガイドページ (`claude/`, `gemini/`, `codex/`, `copilot/`, `git-worktree`) は以下に従う:

- 配置先: `web-next/app/<provider>/<slug>/page.tsx`（`.html` 拡張子は URL に含めない）
- 旧 legacy URL (`.html` 付き) からの 301 リダイレクトは **Phase F で一括設定**（`netlify.toml [[redirects]]`）
- 各ページは CSS Modules (`page.module.css`) + 契約テスト (`page.test.tsx`) で実装。`DocLayout.tsx` / `CodeBlock.tsx` は Phase D 以降で共通化を検討（現在未作成）。Mermaid は Phase E で `next/dynamic({ ssr: false })` の遅延ロードを導入
- 契約テスト（タイトル・セクション数・外部リンク rel・metadata）を `page.test.tsx` に配置
- プロジェクト固有スキル `/nextjs-page-migration` で 1 ページ移行手順を自動化可能

### 静的 HTML ドキュメント（legacy/ 配下、移行対象）

`legacy/` 配下の **18 HTML** は `.gitignore` により remote から隔離済で、Phase A–F で `web-next/app/*` の page.tsx へ順次置換中。
ファイル別の行数・注意点・移行 Phase 割当は **[`docs/NEXTJS_PHASE_A_F_PLAN.md`](docs/NEXTJS_PHASE_A_F_PLAN.md) §3.1** を参照。
進捗は **[`MIGRATION_PROGRESS.md`](MIGRATION_PROGRESS.md)** を参照（頻繁に更新されるため CLAUDE.md にインラインしない — プロンプトキャッシュ安定性のため）。

#### AI モデルバージョンの扱い

ドキュメント・プロンプト・WebSearch クエリに AI モデルのバージョン番号を記載する際は慎重に判断する。

- **背景**: AI の知識カットオフと実際の日付の間にギャップがあるため、自身が把握しているバージョンが最新とは限らない。特に「最新情報を取得するための WebSearch クエリ」にバージョンを固定すると、新バージョンリリース時点でクエリが機能しなくなる逆説が生じる
- **バージョン不要なケース（目安）**: WebSearch クエリ、一般的な機能紹介、ベストプラクティス文書 → `latest` / `newest` + 年号を優先
- **バージョン明記が適切なケース（目安）**: バージョン間の破壊的変更の説明、特定バージョンの既知バグ、ユーザーが明示的にバージョンを指定した場合
- **判断が難しい場合はユーザーに確認する**（例: 「現在お使いのバージョンを教えていただけますか？」）

#### HTML ドキュメント編集時の注意

- Mermaid v10 の `<div class="mermaid">` 内コンテンツは**左端揃え（インデントなしのカラム0配置）必須**。HTML インデントが混ざると構文エラーの原因になる。
- Mermaid 各ステートメントは必ず**改行で分離**すること。（例: `gitGraph LR:` の後に改行。1行に連結するとエラーになる）
- SVG の `viewBox` 高さとコンテンツ座標の整合性を常に確認
- SVG `<marker>` の色は対応する `<line>` の `stroke` 色と一致させる
- Playwright MCP ツールはこのプロジェクトでは使用しない（トークン大量消費のため）。HTML の目視確認はユーザーが手動で行う

### トークン効率ガイドライン

- 単一ファイルの修正には Task エージェントを使わず直接 Read → Edit する
- Playwright MCP ツールを使用しない（検証はユーザーが手動で行う）
- 同一ファイルの重複読み込みを避ける（エージェントに読ませたら再度読まない）
