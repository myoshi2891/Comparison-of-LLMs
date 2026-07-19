# CLAUDE.md

Updated 2026-07-19

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

AIモデルの時間別コスト計算機 + AI ツール導入ガイド群。Python スクレイパーが各社料金ページから価格を自動取得し `pricing.json` を生成、**Next.js 16 App Router（SSG / `output: 'export'`）** がそれを読み込んで Netlify CDN へ配信する。Phase 1–14 でコスト計算機ページが Next.js 化済み。18 枚のガイドページ（旧 `legacy/` 配下）は Phase A–F で **全移行完了**（計画書は [`docs/archive/NEXTJS_PHASE_A_F_PLAN.md`](docs/archive/NEXTJS_PHASE_A_F_PLAN.md) に保存）。さらに追加移行ページとして `/claude/managed-agents` や `/code-review/coderabbit-guide` 等を設置。

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
│   │   ├── layout.tsx           ルートレイアウト (SiteHeader/DisclaimerBanner/PageFreshness マウント済み)
│   │   ├── page.tsx             コスト計算機ホーム (Server Component + Zod 検証 → HomePage へ委譲)
│   │   ├── sitemap.ts           page-registry から全ルートを導出 (lastmod = lastReviewed)
│   │   ├── rss.xml/route.ts     RSS 2.0 フィード (F-3'。force-static で out/rss.xml を静的生成)
│   │   ├── search/              横断検索 (F-5。自前実装。?q= / ?tag= で状態共有)
│   │   ├── whats-new/           What's New (新着 / 最近更新を page-registry から静的生成)
│   │   ├── globals.css          Tailwind v4 + legacy design tokens (227 行)
│   │   └── {claude,google,codex,copilot}/{skill,agent}/ および /google/agent-harness-engineering/、/google/notebook-lm/、/google/adk-best-practices/、/google/enterprise-agent-platform/、/google/enterprise-agent-platform-intermediate/、/google/stitch-guide/、/claude/managed-agents/、/claude/self-hosted-sandboxes/、/claude/code-slash-commands/、/claude/fable-5-best-practices/、/claude/skills-sh/、/claude/tag-best-practices/、/mcp/mcp-best-practices/、/mcp/mcp-best-practices-intermediate/、/code-review/coderabbit-guide/、/code-review/copilot-code-review/、/code-review/sonar-qube/、/code-review/tool-pricing/、/agent/hermes-agent-advanced-guide/、/agent/loop-engineering/、/agent/skills/、/vercel/sandbox/、/cursor/complete-guide/、/cursor/complete-guide-intermediate/、/security/ai-security-best-practices/、/security/ai-security-best-practices-intermediate/、/governance/ai-governance/、/local-llm/self-hosting/、/local-llm/best-practices/、/local-llm/finetuning-best-practices/、/ci-cd/ai-cicd-automation-best-practices/、/agent/context-engineering-best-practices/、/rag/embeddings-best-practices/、/multimodal/generation-best-practices/、/multimodal/image-audio-best-practices-2026/、/llm-ops/evaluation-observability/   Phase B–C および追加移行済みルート（詳細は [`docs/archive/MIGRATION_PROGRESS.md`](docs/archive/MIGRATION_PROGRESS.md)）
│   ├── components/
│   │   ├── HomePage.tsx         Client Component (Phase 10)
│   │   ├── ApiTable.tsx / SubTable.tsx / Hero.tsx / ...   (Phase 8-10 成果物)
│   │   └── site/                Phase A 共通インフラ（追加済み） (SiteHeader, DisclaimerBanner, PageFreshness, RelatedPages, nav-links)
│   │       └── nav-links.ts     page-registry からナビ木を導出 (buildNavLinks / 手書き禁止)
│   ├── lib/
│   │   ├── page-registry.ts     全ページのメタデータ SSoT (Zod / 鮮度表示・What's New・sitemap・ナビ・RSS・検索・関連リンク の導出元)
│   │   ├── nav-taxonomy.ts      ナビのグループ順・ネスト対象の SSoT (NAV_GROUPS / CATEGORY_ORDER)
│   │   ├── search.ts            横断検索の純粋関数 (F-5。searchEntries / allTopics)
│   │   ├── related-pages.ts     関連ページの導出 (F-7。topics 共有数 + 決定論的タイブレーク)
│   │   ├── cost.ts              純粋関数 (calcApiCost / calcSubCost / colorIndex / fmtUSD / fmtJPY)
│   │   ├── pricing.ts           Zod スキーマ + コンパイル時パリティアサート
│   │   ├── i18n.tsx             T オブジェクト + t() + tRich() (React 要素ファクトリ)
│   │   ├── fonts.ts             next/font/google (Noto Sans JP / JetBrains Mono / Syne)
│   │   ├── metadata.ts          静的 Metadata / Viewport
│   │   └── site-url.ts          サイト URL 解決ユーティリティ (resolveSiteUrl / NEXT_PUBLIC_SITE_URL)
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
│   ├── claude/ gemini/ codex/ copilot/   18 HTML ガイド (Phase B–E で全 page.tsx 化完了)
│   └── git_worktree.html        Mermaid v10 + 手書き SVG (Phase E 完了)
└── docs/
    ├── README.md                プロジェクト概要・アーキテクチャ
    ├── TESTING.md               テスト戦略・実行方法
    └── archive/                 完了済み計画書 (NEXTJS_MIGRATION_PLAN.md 等)
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

### カバレッジ / SonarQube

カバレッジは既定の `test` には含めず明示コマンドで生成する（`uv run pytest` の出力を不変に保つ）。

```bash
cd web-next && bun run test:coverage   # web-next/coverage/lcov.info を生成
cd scraper && uv run pytest --cov --cov-report=xml   # scraper/coverage.xml を生成

export SONAR_TOKEN=xxxx   # SonarQube Cloud のトークン
make sonar               # カバレッジ生成→パス補正→Docker scanner で Cloud へ送信
```

SonarQube Cloud（public 無料プラン）解析は CI（`.github/workflows/sonarqube.yml`, `push:main,dev` + PR）と
ローカル（`make sonar`）の両方で実行する。設定は `sonar-project.properties`。
**初回のみ手動作業が必要**: ① Cloud でリポジトリ import → Automatic Analysis を OFF、
② 発行された org / projectKey を `sonar-project.properties` に反映、③ GitHub Secrets に `SONAR_TOKEN` を登録。

## Docker 環境

Docker Compose + Makefile でスクレイパーと開発サーバーを管理する。

### 初回セットアップ

```bash
make build-images   # イメージをビルド（初回 or Dockerfile 変更時）
make scrape         # pricing.json を最新化（Playwright 使用）
make dev            # 開発サーバー起動 → http://localhost:3000
```

### よく使うコマンド

| コマンド | 内容 |
|---|---|
| `make help` | 全ターゲット一覧 |
| `make dev` | Next.js 開発サーバー（ホットリロード） |
| `make scrape` | 全プロバイダー価格スクレイプ |
| `make scrape-no-scrape` | 為替レートのみ更新（Playwright スキップ） |
| `make build` | 静的エクスポート（`web-next/out/`） |
| `make test` | 全テスト（vitest + pytest） |
| `make coverage` | 両言語のカバレッジ生成（lcov + coverage.xml） |
| `make sonar` | SonarQube Cloud 解析（要 `SONAR_TOKEN`） |
| `make typecheck` | TypeScript 型チェック |
| `make lint` | Biome リント |
| `make down` | コンテナ停止 |
| `make clean` | 完全リセット |

### ボリューム設計

| ボリューム | マウント先 | 目的 |
|---|---|---|
| `scraper-venv` | `/app/scraper/.venv` | Linux 用 Python `.venv`（macOS バイナリの混入防止） |
| `web-node-modules` | `/app/node_modules` | Linux 用 `node_modules`（macOS バイナリの混入防止） |

Playwright ブラウザバイナリ（`/root/.cache/ms-playwright/`）はバインドマウント外のためイメージ層に保持される。

### 関連ファイル

- `docker/scraper/Dockerfile` — Python 3.13-slim + uv + Playwright Chromium
- `docker/web/Dockerfile` — oven/bun:1-debian マルチステージ（dev / build）
- `docker-compose.yml` — scraper / web サービス定義
- `Makefile` — Docker 管理インターフェース

## 重要な設計判断

- **Next.js 16 App Router + SSG**: `output: 'export'` で pure 静的エクスポート → Netlify CDN 配信。`@netlify/plugin-nextjs` 不要。Phase 1–14 でコスト計算機ホームが移行済、Phase A–F で残 18 ガイドページも全移行完了（計画書は `docs/archive/` に保存）。さらに `/google/agent-harness-engineering` や `/google/adk-best-practices`、`/google/stitch-guide`、`/claude/managed-agents`、`/claude/self-hosted-sandboxes`、`/claude/code-slash-commands`、`/claude/fable-5-best-practices`、`/claude/skills-sh`、`/code-review/coderabbit-guide`、`/code-review/copilot-code-review`、`/code-review/sonar-qube`、`/code-review/tool-pricing`、`/agent/hermes-agent-advanced-guide`、`/agent/skills`、`/security/ai-security-best-practices`、`/local-llm/best-practices`、`/ci-cd/ai-cicd-automation-best-practices`、`/agent/context-engineering-best-practices`、`/multimodal/image-audio-best-practices-2026`、`/llm-ops/evaluation-observability` ページを追加
- **ページレジストリ（`web-next/lib/page-registry.ts`）が全ページメタデータの SSoT**: 鮮度表示（`PageFreshness`）・What's New（`/whats-new`）・`sitemap.ts`・**ナビゲーション**・**RSS（`/rss.xml`）**・**横断検索（`/search`）**・**関連ページリンク（`RelatedPages`）** はすべて registry から導出する。属性を各 page.tsx に複製しない（複製した結果 sitemap が 24/55 ルートで腐った経緯がある）。**新規ページを追加したら registry への登録が必須** — 登録すればナビにも自動的に載る。`web-next/tests/page-registry-coverage.test.ts` が登録漏れ・幽霊エントリを、`web-next/tests/nav-derivation.test.ts` が registry ⇔ ナビの全単射を機械検知する。`lastReviewed`（最終確認日）は月次更新で当日日付へ書き戻す（`.claude/skills/monthly-update/`）
- **ナビは registry からの導出。`nav-links.ts` への直書きは禁止**（F-4' / `plans/008-nav-regrouping-f4.md`, 2026-07-14）: `web-next/components/site/nav-links.ts` は `buildNavLinks(pageRegistry)` の結果であり、手書きのリンクデータを持たない（以前は 170 行の手書きデータで registry と二重管理になっていた）。トップレベルは 8 グループ（Home / Providers / Agent 開発 / 開発プロセス / 運用・品質 / モデル・データ / 検索 / What's New。F-5 で「検索」を追加）で、**2 段ネストするのは Providers のみ**。グループの並び順とネスト対象は `web-next/lib/nav-taxonomy.ts` が持つ（registry のエントリは slug 昇順のため表示順を表現できない）。ドロップダウン内のリーフは `addedAt` 昇順 → `slug` 昇順。未知の `group` や Providers の `category` 欠落はビルド時に throw する（silent drop でページがナビから消えるのを防ぐため）
- **横断導線（RSS / 検索 / 関連リンク）は registry からの導出**（F-3' / F-5 / F-7 / `plans/009-phase3-cross-navigation.md`, 2026-07-14）: ① **検索は自前実装で外部ライブラリを追加しない**（`web-next/lib/search.ts`）。58 ページの title/summary/topics は数十 KB であり全件走査の部分一致で十分。NFKC 正規化 + 空白区切り全トークンの AND 一致。② **タグ導線は `/search` 1 ページに集約**し `/tags/[tag]` の静的ページ群は作らない（1〜2 ページしか持たないタグで薄いページが量産されるため）。状態は `?q=` / `?tag=` の URL クエリで共有する。③ **関連リンクのスコアは決定論的**（`web-next/lib/related-pages.ts`）— 共有 topics 数 降順 → 同一 group 優先 → `addedAt` 降順 → `slug` 昇順。順序が一意でないと無関係なページ追加で全ページの関連リンクが揺れ、SSG 出力が不安定になる。④ RSS は Route Handler + `dynamic = "force-static"` で `output: 'export'` 下でも `out/rss.xml` として静的生成される
- **page.tsx は Server Component に保つ（metadata の前提）**: Next.js の規約により `"use client"` なファイルは `export const metadata` を持てない。スクロール監視等のクライアント処理は `TocObserver.tsx` 等へ切り出し、page.tsx 自体は Server Component に保つこと。已に全体が `"use client"` になっている `/code-review/coderabbit-guide` と `/code-review/sonar-qube` は、例外的にルート単位の `layout.tsx` から metadata を供給している
- **3層フォールバック**: スクレイパーは「スクレイプ成功 → 既存 JSON の値 → ハードコードフォールバック」の順で価格を決定。`scrape_status` フィールド (`success` | `fallback` | `manual`) で出自を追跡
- **型の同期**: `scraper/src/scraper/models.py` (Pydantic) が SSoT、`web-next/types/pricing.ts` (TypeScript) が手動ミラー、`web-next/lib/pricing.ts` の `_AssertParity` でコンパイル時検証。**片方を変更したら必ずもう片方も更新すること**
- **JA/EN バイリンガル**: `web-next/lib/i18n.tsx` で全テキストを管理（`T` オブジェクト + `t()` / `tRich()` の React 要素ファクトリ）。各スクレイパーも `sub_ja` / `sub_en` や `note_ja` / `note_en` のペアで日英テキストを持つ。ガイドページ（Phase B–E）は当面 JA 固定
- **XSS 対策**: 生 HTML 文字列挿入 API は `web-next/` 内で一切使わない。`tRich()` で React 要素として合成し、静的検査テストで CI 毎に確認
- **Netlify デプロイ**: `netlify.toml` で `base = "web-next"` / `command = "bun install && bun run build"` / `publish = "out"` を設定。ビルドのみ実行（スクレイパーは走らない）。リポジトリ内の既存 `pricing.json` をそのまま使用

## TypeScript 制約

- `strict: true` + `noUnusedLocals` + `noUnusedParameters`
- `erasableSyntaxOnly: true` — **enum と namespace は使用禁止**（TypeScript 5.8+ の制約）
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
- **元のHTML/Markdownオリジナルファイルの完全削除は厳禁**: 移行元のファイルは絶対に削除してはならず、必ず `archive/` ディレクトリ配下に移動（`git mv` または `mv`）して退避保存すること

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

1. `cd web-next && bun run build` が成功（※Antigravityサンドボックス環境では実行禁止。他環境やCIでは必須）
2. `cd web-next && bun run test` が成功（実測 1144 件合格を確認）
3. `cd web-next && bun run typecheck` が成功
4. `cd web-next && bun run lint` が成功（既知の違反件数は CI または進捗ドキュメントを参照、新規違反がないこと）
5. `cd scraper && uv run pytest` が成功
6. import が有効
7. 設定ファイルが意図せず変更されていない
8. コミット対象の差分（`git diff --cached`）および新規ファイルに、個人情報（PII）やローカル環境固有の絶対パス（例: `file:///Users/` やローカルユーザー名など）が含まれていないことを確認

いずれか失敗 → **停止してユーザーに確認**。

### CI 失敗時の対応

1. 失敗しているエラーのみ修正
2. リファクタリング禁止
3. 依存関係変更禁止
4. テスト書き直しは壊れている場合のみ

### パッチ戦略

small diff > medium diff > large diff — 常に最小の差分を選択。

### Phase A–F ガイドページ移行ルール

Phase A–F 遂行中、新規ガイドページ (`claude/`, `gemini/`, `codex/`, `copilot/`, `git-worktree`, `code-review/`) は以下に従う:

- 配置先: `web-next/app/<provider>/<slug>/page.tsx`（`.html` 拡張子は URL に含めない）
- 旧 legacy URL (`.html` 付き) からの 301 リダイレクトは **Phase F で一括設定**（`netlify.toml [[redirects]]`）
- 各ページは CSS Modules (`page.module.css`) + 契約テスト (`page.test.tsx`) で実装。`DocLayout.tsx` / `CodeBlock.tsx` は Phase D 以降で共通化を検討（現在未作成）。Mermaid は Phase E で `next/dynamic({ ssr: false })` の遅延ロードを導入
- 契約テスト（タイトル・セクション数・外部リンク rel・metadata）を `page.test.tsx` に配置
- プロジェクト固有スキル `/nextjs-page-migration` で 1 ページ移行手順を自動化可能

### 静的 HTML ドキュメント（legacy/ 配下、移行完了）

`legacy/` 配下の **18 HTML** は `.gitignore` により remote から隔離済。Phase A–F で `web-next/app/*` の page.tsx への置換が**全完了**。
移行計画詳細は **[`docs/archive/NEXTJS_PHASE_A_F_PLAN.md`](docs/archive/NEXTJS_PHASE_A_F_PLAN.md)** を参照（アーカイブ）。
現在の進捗は **[`docs/PROGRESS.md`](docs/PROGRESS.md)** を、過去の移行進捗詳細は **[`docs/archive/MIGRATION_PROGRESS.md`](docs/archive/MIGRATION_PROGRESS.md)** を参照。
- **オリジナルファイルの保存**: 移行元の HTML / Markdown オリジナルファイルは勝手に削除せず、必ず `archive/` ディレクトリ配下に退避させて保存すること。

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
