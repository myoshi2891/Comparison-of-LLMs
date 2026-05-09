# Next.js 移行 進捗トラッカー

> 本ファイルは `feat/nextjs-migration` ブランチでの移行作業の状況を記録する。
> 移行計画:
> - Phase 1–14（ホームページ）: [`docs/NEXTJS_MIGRATION_PLAN.md`](docs/NEXTJS_MIGRATION_PLAN.md)（凍結扱い）
> - Phase A–F（18 ガイドページ + 共通インフラ）: [`docs/NEXTJS_PHASE_A_F_PLAN.md`](docs/NEXTJS_PHASE_A_F_PLAN.md)
> - プロジェクト固有スキル: [`.claude/skills/nextjs-page-migration/SKILL.md`](.claude/skills/nextjs-page-migration/SKILL.md)

## 現在地

- **ブランチ**: `feat/nextjs-migration`
- 最新 HEAD: 5510c4e（feat(web-next): Phase F — add 301 redirects, sitemap.xml, robots.txt）
- 未コミット作業: なし（working tree クリーン）
- 次の作業: **Phase A–F 全完了 → main へのマージ PR 作成**
- テスト数: `bun run test` **542 passed / 542 total（全 Green ✅）**  — マージ前必須条件: `bun run build` / `bun run typecheck` / `bun run test`（全件 pass）/ `bun run lint`（新規違反ゼロ）/ `cd scraper && uv run pytest`（5/5）すべて成功していること
- ビルド: `bun run build` ✅（5510c4e 時点）・`bun run typecheck` ✅・`uv run pytest` 5/5 passed
- **lint 既知違反**: なし（全解消 ✅）

## AI 作業ルール（Phase A–F 共通、**必読**）

以下は Phase A–F 遂行中に判明した問題を受けて確定したルール。新規セッションは作業開始前に必ず目を通すこと。CLAUDE.md の「AI 変更ルール」を補完する。

### R1. Biome フォーマット・lint の適用スコープ（Phase B-4 で判明）

- **禁止**: リポジトリ全体を対象にする Biome `--write` 実行。具体的には以下のいずれも実行しない:
  - `bun run lint:fix`（= `biome check . --write`）
  - `bunx biome check --write`（パス引数なし、カレント全体）
  - `bunx biome format --write`（同上）
- **理由**: CLAUDE.md「リポジトリ全体の自動フォーマット禁止」ルール違反。このリポジトリには既存の printWidth / organizeImports 違反 6 件が残存しており（別 Issue 対応中）、全体 `--write` はそれらを含む無関係ファイルを意図せず書き換えてしまう
- **正しい手順**:
  1. `bun run lint` でまず全違反を一覧し、自分の作業範囲起点のものと pre-existing 6 件を切り分ける
  2. 自分の作業範囲のみを明示的にパス指定して fix: 例 `bunx biome check --write app/<provider>/<slug>/page.tsx app/<provider>/<slug>/page.module.css app/<provider>/<slug>/page.test.tsx`
  3. 再度 `bun run lint` を実行し、新規違反がゼロで pre-existing 6 件のみが残っていることを確認

### R2. faithful 移植の必須化（Phase C-2 で判明）

- **禁止**: legacy HTML の内容を要約・省略・縮約した JSX を生成すること。「契約テストが通る最小骨格」だけでコミットを終わらせない
- **必須**: legacy HTML の **全セクション・全リスト項目・全コードブロック・全 SVG・全 alert・全 table** を JSX に変換し、テキスト内容を 1 つも欠落させない
- **理由**: Phase C-2 の Green コミット（`aa9c2ee`）では `legacy/gemini/agent.html` の 3,723 行に対し約 888 行の縮約版を提出してユーザーから差し戻された
- **正しい手順**:
  1. `MIGRATION_PROGRESS.md` のセクション行範囲テーブルで **今から実装する 1 セクションの行範囲** を確認し、その範囲だけを `Read offset=<start> limit=<lines>` で読む。**ファイル全体・複数セクションの先読みは禁止**（→ R4）
  2. 読んだ 1 セクション分の HTML を JSX に変換する
  3. **自己検証（省略ゼロ確認）**: 変換後、以下の Bash コマンドで legacy と JSX の要素数を比較する。数が一致しない場合は JSX に欠落があるため追加してから次へ進む

     ```bash
     # セクション行範囲を <start>,<end> で指定して該当範囲のみ集計
     # ⚠️ <start> と <end> はシェル変数ではなく数値リテラルのプレースホルダー。
     #    MIGRATION_PROGRESS.md の「セクション行範囲」テーブルを参照して
     #    実際の行番号（例: 2071, 2206）に置き換えてから実行すること。
     #    SECTION_ID / LEGACY_HTML / PAGE_PATH は変数として使用する。
     SECTION_ID="s07"   # 実装中のセクション ID に変更すること
     LEGACY_HTML="legacy/<provider>/<slug>.html"            # 例: legacy/claude/skill-guide-for-claude.html
     PAGE_PATH="web-next/app/<provider>/<slug>/page.tsx"    # 例: web-next/app/claude/skill-guide/page.tsx
     sed -n '<start>,<end>p' "$LEGACY_HTML" | grep -c '<li>'
     sed -n "/id=\"$SECTION_ID\"/,/<\/section>/p" "$PAGE_PATH" | grep -c '<li>'
     sed -n '<start>,<end>p' "$LEGACY_HTML" | grep -c 'code-body'
     sed -n "/id=\"$SECTION_ID\"/,/<\/section>/p" "$PAGE_PATH" | grep -c 'codeBody'
     sed -n '<start>,<end>p' "$LEGACY_HTML" | grep -c '<tr'
     sed -n "/id=\"$SECTION_ID\"/,/<\/section>/p" "$PAGE_PATH" | grep -c '<tr'
     sed -n '<start>,<end>p' "$LEGACY_HTML" | grep -c 'class="alert'
     sed -n "/id=\"$SECTION_ID\"/,/<\/section>/p" "$PAGE_PATH" | grep -c 'styles\.a[iwega]'
     ```

  4. `(cd web-next && bun run test app/<provider>/<slug>/page.test.tsx)` と `(cd web-next && bunx biome check --write app/<provider>/<slug>/page.tsx)` を実行（R1 遵守）
  5. 全テスト・lint 通過を確認 → そのセクションだけで 1 commit
  6. **次のセクションに進む直前に**その行範囲を Read して繰り返す（先読みしない）
- **許容される正規化**:
  - HTML formatter 由来のインデント崩れは、CSS `white-space: pre` 配下で意図された見た目に合わせて正規化してよい
  - SVG 属性の kebab-case → camelCase 変換（`text-anchor` → `textAnchor` 等）
  - SVG `style="..."` → `style={{ ... }}` (JS object) 変換
  - SVG に `role="img"` + `aria-label` + `<title>` を付与（biome `noSvgWithoutTitle` 対応）

### R3. `/nextjs-page-migration` スキルの優先使用（C-4 以降）

- **必須**: 新規ガイドページ移行（scaffold / faithful Green 実装）を行う際は、**作業開始前に `.claude/skills/nextjs-page-migration/SKILL.md` を読み込み、スキルの手順に従って実施すること**
- Claude Code の場合は `/nextjs-page-migration` スキルを明示的に呼び出す（`Skill` ツール経由）
- 他の Coding Agent（Codex / Gemini CLI 等）の場合は SKILL.md を直接 Read してから作業を開始する
- **理由**: スキルには scaffold・CSS Module・contract test・Biome scope・faithful migration の手順が統合されており、セッション間でのプロセス一貫性を保証する

### R4. セクション別遅延読み込み（C-4 以降）

- **禁止**: 実装前に legacy HTML の全セクションを一括先読みすること
- **禁止**: 実装済みページ（C-1〜C-4 等）を「テンプレート確認」目的で Read すること（→ SKILL.md §「Phase C 確立パターン」を代わりに参照）
- **正しい手順**:
  1. `MIGRATION_PROGRESS.md` のセクション行範囲テーブルを参照（行範囲は既に確定済み）
  2. 「今から実装するセクション」の行範囲のみを `Read offset/limit` で読む
  3. 実装 → test → commit 後、次のセクション行範囲だけを Read して繰り返す
- **理由**: 先読みはコンテキストを消費するが実装に直接貢献しない。1 セクション ~100 行 × 20 = 約 2,000 行を最初に積むより、実装時に都度 100 行読む方がトークン効率が大幅に良い

### 今後のルール追加方針

Phase A–F 作業中に AI エージェントの実装ミスや仕様齟齬が判明した場合、本セクションに **判明した時点で** `R3`, `R4`, ... として追記する。

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
| 8 | Atomic UI Components (×6) | 完了 | `62b8ad0`〜`98dd312` |
| 9 | Table components (ApiTable / SubTable) | 完了 | `eadaabc`〜`6e6c5bd` |
| 10 | Compose `app/page.tsx` | 完了 | `4ffdc70`, `0cb392b` |
| 11 | 視覚パリティ検証 | **コード検証済み (差異 0)** | — |
| 12 | 統合テスト | 完了 | `46fb653` |
| 13 | Deployment (netlify.toml) | 完了 | `1e99e3f` |
| 14 | カットオーバー (web/ → legacy/) | **完了** | `6372fe4`, `a5f2332` |
| A | Common Infrastructure (SiteHeader / DisclaimerBanner / nav-links) | **完了** | Red: `cf36235`〜`441b0cb` / Green: `4cc8068`〜`db67dd0` |
| B | Provider skill.html × 4 (`claude` / `gemini` / `codex` / `copilot`) | **完了** | B-1: `d4735b4`/`8515ec3` ／ B-2: `d0038d0`/`037f45f` ／ B-3: `c0ee480`/`1dd1501` ／ B-4: `9d59aa0`/Green |
| C | Provider agent.html × 4 | **完了**（C-1〜C-4 全 4 ページ faithful 移植完了） | C-1: `2b7a0fa`/`5394d9d` ／ C-2: `9dfa184`/`aa9c2ee`〜`448368a` ／ C-3: Red `0758a35` / Green `6223842` / s01 `5a6761c` / s02+s03 `732080e` / s04 `6aa9688` / s05 `06a9df5` / s06 `b881260` / s07 `97798fb` / s08-s11 `22d8951` ／ C-4: Red `b920471` / Green `2c0bc88` / s01 `8843866` / s02 `1a7e7e9` / s03 `e7c5ad8` / s04 `b2ff1df` / s05 `6c7e33a` / s06 `d760289` / s07 `a670a5a` / s08 `addf9e2` / s09 `0f3d780` / s10 `e9d3cee` / s11 `91d2ac0` / s12 `b113f22` / s13 `7397d4d` / s14 `e3405bd` / s15 `48d159d` / s16 `4d4061a` / s17 `f35ea70` / s18 `588a74a` / s19 `c849377` |
| D | Long-form guides × 9（全ページ HTML → JSX 直接移植。MDX 不採用） | **完了**（D-1〜D-9 全 9 ページ faithful 移植完了） | Red: `af1e9e7` / D-1 全: `be2aef0` / D-2 Red: `d491da8` / D-2 全: `a62ceec` / D-3 Red: `11d9e79` / D-3 s01: `4f29f56` / s02: `10dca55` / s03: `7a2d136` / s04: `8bbfacb` / s05: `f496ac2` / s06: `998cb6d` / s07: `9a1f485` / s08: `6b8fb8c` / s09: `405c899` / s10: `8a919aa` / s11: `b32b162` / D-4 Red: `5b3ab9c` / D-4 s02: `5d29999` / D-4 s03: `e113515` / D-4 s04: `f32c2e8` / D-4 s05: `6e1f145` / D-4 s06: `b368263` / D-4 s07: `b6e8cc6` / D-4 s08: `8a3cea6` / D-4 s09: `7e22c66` / D-4 s10: `7a3ed65` / D-4 s11: `b44c895` / D-5 Red: `58f9048` / D-5 s01: `9fdcafc` / D-5 s02: `a2bcfdc` / D-5 s03: `88b44be` / D-5 s04: `befcd8c` / D-5 s05: `5e40e95` / D-5 s06: `123d47e` / D-5 s07: `c3933e3` / D-5 s08: `f8b762d` / D-5 s09: `1910100` / D-5 s10: `aba3223` / D-5 s11: `e8a6ce4` / D-5 s12: `03ab57c` / D-6 Red: `52eb041` / D-6 s01: `53f2f5e` / D-6 s02: `c91f2f9` / D-6 s03: `f5ffa0f` / D-6 s04: `84c116f` / D-6 s05: `80ae4c2` / D-6 s06: `b112c74` / D-6 s07: `5938fd9` / D-6 s08: `e45eaca` / D-6 s09: `a538d29` / D-6 s10: `51e2f66` / D-7 Red: `307ba4e` / D-7 s01+s02: `c95172a` / D-7 s03: `83c4da5` / D-7 s04: `76b8461` / D-7 s05: `f034447` / D-7 s06: `42247e5` / D-7 s07: `4c9a8f4` / D-7 s08+s09: `4673909` / D-8 scaffold: `2d1eab5` / D-8 s01: `21934cf` / D-8 s02: `5c87229` / D-8 s03: `b1394e1` / D-8 s04: `a0c49d0` / D-8 s05: `579c4ec` / D-8 s06: `9b48a20` / D-8 s07: `5f3dc9a` / D-8 s08: `cef5865` / D-8 s09: `4b86c20` / D-8 s10: `c638b5b` / D-8 s11: `4c6975b` / D-8 s12: `7b5450d` / D-8 s13: `49b7b01` / D-8 s14: `4adc011` / D-8 s15: `6995393` / D-8 s16: `ee18287` / D-9 scaffold: `ff8f5f3` / D-9 s01: `a93929b` / D-9 s02: `5779e97` / D-9 s03: `10d6e54` / D-9 s04: `1f82de0` / D-9 s05: `7f185b2` / D-9 s06: `eaf44a4` / D-9 s07: `eb0d146` / D-9 s08: `5ac185c` / D-9 s09: `64f1cb3` / D-9 s10: `37fbc3e` / metadata+a11y fix: `e05009b` |
| E | git_worktree.html（Mermaid + SVG） | **完了**（s00〜ref 全セクション faithful 移植完了） | scaffold: `8fffdb9` / s00: `e598670` / s01: `c11185f` / s02: `9c2510b` / s03: `077f0ae` / s04: `d3a6c75` / s05: `ac71a01` / s06: `34e03ae` / ref: `53b90ad` / import fix: `a2cb93a` |
| F | Cutover (redirects / sitemap / legacy cleanup) | **完了** | `5510c4e` |

## 完成済み成果物（`web-next/`）

```
web-next/
├── app/
│   ├── layout.tsx           # Phase 7: metadata/viewport を lib/metadata から再エクスポート
│   ├── page.tsx             # Phase 10: Server Component (Zod 検証 → HomePage 委譲)
│   └── globals.css          # Phase 6: legacy 227-line CSS 移植 + @theme inline
├── lib/
│   ├── cost.ts              # 6 純粋関数（calcApiCost / calcSubCost / colorIndex / fmtUSD / fmtJPY / PERIODS）
│   ├── pricing.ts           # Zod スキーマ + コンパイル時パリティアサート
│   ├── i18n.tsx             # Phase 5: T オブジェクト + t() + tRich() (React 要素ファクトリ)
│   ├── fonts.ts             # Phase 6: next/font/google 3 フォント設定
│   └── metadata.ts          # Phase 7: 静的 Metadata + Viewport (i18n-backed)
├── components/
│   ├── DualCell.tsx / LanguageToggle.tsx / Hero.tsx / MathSection.tsx / RefLinks.tsx / ScenarioSelector.tsx
│   ├── SubTable.tsx / ApiTable.tsx
│   ├── HomePage.tsx
│   └── site/                # Phase A: SiteHeader / SiteHeaderClient / DisclaimerBanner
├── app/claude/skill/        # Phase B-1
├── app/gemini/skill/        # Phase B-2
├── app/codex/skill/         # Phase B-3
├── app/copilot/skill/       # Phase B-4
├── app/claude/agent/        # Phase C-1（faithful 移植完了）
├── app/gemini/agent/        # Phase C-2（faithful 移植完了）
├── app/codex/agent/         # Phase C-3（faithful 移植完了）
├── app/copilot/agent/       # Phase C-4（faithful 移植完了）
├── app/claude/skill-guide/  # Phase D-1（faithful 移植完了）
├── app/claude/skill-guide-intermediate/ # Phase D-2（faithful 移植完了）
├── app/claude/cowork-guide/             # Phase D-3（faithful 移植完了）
├── app/gemini/skill-guide/              # Phase D-4（faithful 移植完了）
├── app/gemini/skill-guide-intermediate/ # Phase D-5（faithful 移植完了）
├── app/gemini/antigravity-guide/        # Phase D-6（faithful 移植完了）
├── app/codex/openai-codex-guide/        # Phase D-7（faithful 移植完了）
├── app/copilot/markdown-file-guide/     # Phase D-8（faithful 移植完了）
├── app/copilot/github-copilot/          # Phase D-9（faithful 移植完了）
└── app/git-worktree/                    # Phase E（完了）
```

**テスト数**: **542 passed / 542 total（全 Green）** — マージ前必須条件: `bun run build` / `bun run typecheck` / `bun run test`（全件 pass）/ `bun run lint`（新規違反ゼロ）/ `cd scraper && uv run pytest`（5/5）すべて成功していること

## 確定した設計判断（`docs/NEXTJS_MIGRATION_PLAN.md` ステップ 0）

1. **ディレクトリ**: `web-next/` を `legacy/` と並行運用（Phase 14 で旧 `web/` を `legacy/` に退避済み）
2. **Markdown 運用フロー**: L1 Primitives / L2 Feature Blocks / L3 Pages の 3 層
3. **型同期**: `scraper/src/scraper/models.py`（Pydantic）が SSoT、`types/pricing.ts` が手動ミラー、`lib/pricing.ts` の `_AssertParity` でコンパイル時検証
4. **XSS 対策**: 生 HTML 文字列挿入 API（React の unsafe HTML 注入プロパティ）は一切使わない → Phase 5 で翻訳を React 要素化済み
5. **i18n**: **next-intl は採用せず、既存 `T` オブジェクト継続**（理由: 39 キー・コンパイル時既知・単一ページ）
6. **ビジネスロジック**: `lib/cost.ts` に純粋関数集約（React 非依存、Server/Client 両対応）
7. **データ取得**: **SSG 採用**（`pricing.json` をビルド時 static import、Zod で検証）
8. **デプロイ**: **Netlify 継続**（`output: 'export'` による完全 SSG、`@netlify/plugin-nextjs` は不採用。将来 SSR 必要時は `output` 行削除 + プラグイン追加の 2 行差分で切替可能）
9. **単一 HTML 制約**: **廃止**（`output: 'export'` で Netlify CDN 配信）
10. **フォント**: **`next/font/google` で self-host**（Phase 6）。Google CDN への @import を廃止し、`--font-sans` / `--font-mono` / `--font-display` を `<html>` に注入する方式に統一
11. **Metadata**: **`generateMetadata` ではなく静的 `export const metadata`**（Phase 7）。理由: SSG 前提でリクエスト時情報が存在しない＋単一ページ設計で JA/EN が URL で分岐しない

## 次回セッションでの再開プロンプト（Phase F 用）

次のプロンプトをコピーして任意の Coding Agent（Claude Code / Codex / Cursor / Gemini CLI / Cline 等）に渡せば、コンテキストが復元される:

```
Next.js 移行プロジェクトの作業を再開してください。

- リポジトリ: LLM-Studies（Phase A–F の Next.js 移行作業中）
- 現在のブランチ: feat/nextjs-migration
- 最新 HEAD: 5510c4e（feat(web-next): Phase F — add 301 redirects, sitemap.xml, robots.txt）
- 移行計画: docs/NEXTJS_PHASE_A_F_PLAN.md（Phase A–F）— 全 Phase 完了
- 進捗トラッカー: MIGRATION_PROGRESS.md（**作業開始前に必読**: §「AI 作業ルール」R1〜R4）
- プロジェクト固有スキル: .claude/skills/nextjs-page-migration/SKILL.md
- リポジトリ規約: CLAUDE.md（AGENTS.md / GEMINI.md からも参照される。AI 共通の編集ルール）

次の作業: **Phase A–F 全完了 → feat/nextjs-migration を main へマージする PR を作成**

Phase E の確立パターン（MermaidDiagram）:
- `MermaidDiagram.tsx` 自体が `"use client"` + `useEffect` のため `dynamic()` でラップ不要
- 直接 import: `import MermaidDiagram from "@/components/docs/MermaidDiagram"`
- テストモック: `vi.mock("@/components/docs/MermaidDiagram", () => ({ default: () => null }))`
- Mermaid chart 文字列は左端揃え必須（JSX テンプレートリテラル内のインデントに注意）
- bash 配列変数 `${...}` / GitHub Actions `${{ }}` は `// biome-ignore lint/suspicious/noTemplateCurlyInString:` で抑制
- lint 既知違反: なし（全解消 ✅）

作業手順（Phase F: redirects / sitemap）:
- **最初に `docs/NEXTJS_PHASE_A_F_PLAN.md` §Phase F を参照**して対象 URL マッピングを確認
- Phase F は以下の 2 タスクで構成される:
  1. `netlify.toml` に `[[redirects]]` を追加（旧 `.html` URL → 新 Next.js パス、301）
  2. `web-next/public/sitemap.xml`（または `app/sitemap.ts`）を更新して移行済み全ページを列挙
- 各タスク完了ごとに以下を順に実行 → 全部 OK なら 1 コミット:
  1. (cd web-next && bun run build)     # 全ルートが ○ (Static) であること
  2. (cd web-next && bunx biome check --write netlify.toml)  # ← R1: パス指定必須
  3. (cd web-next && bun run test)       # 全件が pass することを確認
  4. git add netlify.toml web-next/public/sitemap.xml && git commit -m "feat(web-next): Phase F — add redirects/sitemap for legacy HTML cutover"
  5. **MIGRATION_PROGRESS.md を更新 → git commit**（HEAD・次の作業・テスト数・ビルドを同期）

絶対禁止:
- bun run lint:fix / bunx biome check --write （パス引数なし） — リポジトリ全体を書き換えるため（R1 違反）
- legacy HTML の内容を要約・省略 — Phase C-2 で R2 として明文化（要約版は差し戻し対象）
- legacy/ 配下の編集（CLAUDE.md「Phase A–F 中は legacy/ 凍結」）
- 既存ファイル（pricing.json / scraper / lib/cost.ts 等）への副作用的な変更

検証コマンド早見表:
  (cd web-next && bun run test)          # 全件 pass が期待値（現在 542 件 全 pass）
  (cd web-next && bun run typecheck)     # OK
  (cd web-next && bun run build)         # 全ルートが ○ (Static)
  (cd web-next && bun run lint)          # 違反 0 件（Green ✅）
  (cd scraper && uv run pytest)          # 5/5 passed

既知の持越し（別 Issue で対応、本作業では触らない）:
- lib/i18n.test.ts:18 の key count ハードコード
- 一部既存ファイルの Biome printWidth 違反 6 件（R1 により全体 lint:fix 禁止）
```

### LLM 別の補足

- **Claude Code**: `/nextjs-page-migration` skill が使える（MDX・`.md` SSoT 方式は不採用。全ページ HTML → JSX 直接移植）
- **Gemini CLI**: GEMINI.md が `@CLAUDE.md` を import する形にしてあるため、CLAUDE.md ルールが自動継承される
- **Codex / Cursor**: AGENTS.md（CLAUDE.md と同等内容）を読み込ませる
- **任意の Agent**: 上記プロンプトと CLAUDE.md・MIGRATION_PROGRESS.md・docs/NEXTJS_PHASE_A_F_PLAN.md §Phase F の 3 つを冒頭で読み込ませれば自走可能

## Phase C 完了記録（参照用アーカイブ）

Phase C-1〜C-4 はすべて faithful 移植完了。確立したパターンは SKILL.md §「Phase C 確立パターン」に転記済み。
詳細な設計事実は `docs/NEXTJS_PHASE_C_DETAILED_DESIGN.md` を参照。
