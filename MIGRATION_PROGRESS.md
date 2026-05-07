# Next.js 移行 進捗トラッカー

> 本ファイルは `feat/nextjs-migration` ブランチでの移行作業の状況を記録する。
> 移行計画:
> - Phase 1–14（ホームページ）: [`docs/NEXTJS_MIGRATION_PLAN.md`](docs/NEXTJS_MIGRATION_PLAN.md)（凍結扱い）
> - Phase A–F（18 ガイドページ + 共通インフラ）: [`docs/NEXTJS_PHASE_A_F_PLAN.md`](docs/NEXTJS_PHASE_A_F_PLAN.md)
> - プロジェクト固有スキル: [`.claude/skills/nextjs-page-migration/SKILL.md`](.claude/skills/nextjs-page-migration/SKILL.md)

## 現在地

- **ブランチ**: `feat/nextjs-migration`
- **最新 HEAD**: `b6e8cc6`（**feat(web-next): D-4 s07 — faithful migration of /gemini/skill-guide #install**）
- **未コミット作業**: なし（working tree クリーン）
- **次の作業**: **D-4 s08 — `/gemini/skill-guide` #examples (lines 935–944 + React ExamplesApp lines 1624–1970) faithful 移植**
- **テスト数**: `bun run test` **497 passed / 497 total（全 Green）**  — マージ前必須条件: `bun run build` / `bun run typecheck` / `bun run test`（全件 pass）/ `bun run lint`（新規違反ゼロ）/ `cd scraper && uv run pytest`（5/5）すべて成功していること
- **ビルド**: `bun run build` 未再確認（D-4 s07 追加後）・`bun run typecheck` 未再確認・`uv run pytest` 5/5 passed
- **lint 既知違反**: 7 件

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
| D | Long-form guides × 9（全ページ HTML → JSX 直接移植。MDX 不採用） | **D-1・D-2・D-3 完了、D-4 移植中（s02〜s07 完了）**（D-1: 全 15 セクション完了・D-2: 全 9 セクション完了・D-3: 全 11 セクション完了）| Red: `af1e9e7` / D-1 全: `be2aef0` / D-2 Red: `d491da8` / D-2 全: `a62ceec` / D-3 Red: `11d9e79` / D-3 s01: `4f29f56` / s02: `10dca55` / s03: `7a2d136` / s04: `8bbfacb` / s05: `f496ac2` / s06: `998cb6d` / s07: `9a1f485` / s08: `6b8fb8c` / s09: `405c899` / s10: `8a919aa` / s11: `b32b162` / D-4 Red: `5b3ab9c` / D-4 s02: `5d29999` / D-4 s03: `e113515` / D-4 s04: `f32c2e8` / D-4 s05: `6e1f145` / D-4 s06: `b368263` / D-4 s07: `b6e8cc6` |
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
└── app/claude/claude-cowork-guide/      # Phase D-3（faithful 移植完了）
```

**テスト数**: **497 passed / 497 total（全 Green）** — マージ前必須条件: `bun run build` / `bun run typecheck` / `bun run test`（全件 pass）/ `bun run lint`（新規違反ゼロ）/ `cd scraper && uv run pytest`（5/5）すべて成功していること

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

## 次回セッションでの再開プロンプト（Phase D 用）

次のプロンプトをコピーして任意の Coding Agent（Claude Code / Codex / Cursor / Gemini CLI / Cline 等）に渡せば、コンテキストが復元される:

```
Next.js 移行プロジェクトの作業を再開してください。

- リポジトリ: LLM-Studies（Phase A–F の Next.js 移行作業中）
- 現在のブランチ: feat/nextjs-migration
- 最新 HEAD: b6e8cc6（feat(web-next): D-4 s07 — faithful migration of /gemini/skill-guide #install）
- 移行計画: docs/NEXTJS_PHASE_A_F_PLAN.md（Phase A–F）§Phase D を参照
- 進捗トラッカー: MIGRATION_PROGRESS.md（**作業開始前に必読**: §「AI 作業ルール」R1〜R4）
- プロジェクト固有スキル: .claude/skills/nextjs-page-migration/SKILL.md
- リポジトリ規約: CLAUDE.md（AGENTS.md / GEMINI.md からも参照される。AI 共通の編集ルール）

次の作業: **D-4 s08 — `/gemini/skill-guide` #examples (lines 935–944 + React ExamplesApp lines 1624–1970) faithful 移植**。D-4 scaffold+s02〜s07 完了済み（b6e8cc6 時点）。
Phase D の対象は長文ガイド 9 ページ（すべて `.html` → JSX 直接移植。**MDX・`.md` SSoT 方式は不採用**）:
- Claude: skill-guide-for-claude ✅ / skill-guide-of-claude-for-intermediate ✅ / claude-cowork-guide ✅
- Gemini: skill-guide-for-gemini / skill-guide-of-gemini-for-intermediate / antigravity-guide
- Codex: openai-codex-guide
- Copilot: markdown-file-guide / github-copilot
D-4 進行中: `legacy/gemini/skill-guide-for-gemini.html` (2036行) → `web-next/app/gemini/skill-guide/page.tsx`
完了: scaffold(Red) / s02(#overview 252-511) / s03(#why 514-589) / s04(#structure 592-721) / s05(#howto 724-798) / s06(#steps 801-808+StepsApp.tsx 1327-1622) / s07(#install 811-932)
次: s08(#examples 935-944+React 1624-1970) → s09(#checklist 947-1064+React) → s10(#whatsnew 1067-1305) → s11(footer 1308-1319)
- lint 既知違反: 7 件

作業手順:
- **最初に `/nextjs-page-migration` スキルを呼び出す**（Claude Code の場合は Skill ツール経由）
- `docs/NEXTJS_PHASE_A_F_PLAN.md` §Phase D でスコープを確認してから着手（MDX 採用判断は不採用確定）
- scaffold（Red コミット）→ 1 セクション単位 faithful 移植（Green コミット群）の順で進める
- 1 セクション完了ごとに以下を順に実行 → 全部 OK なら 1 コミット → 次のセクションへ:
  1. (cd web-next && bun run test app/<provider>/<slug>/page.test.tsx)
  2. (cd web-next && bunx biome check --write app/<provider>/<slug>/page.tsx)  # ← R1: 必ずパス指定
  3. (cd web-next && bunx biome check app/<provider>/<slug>/page.tsx app/<provider>/<slug>/page.module.css app/<provider>/<slug>/page.test.tsx)
  4. (cd web-next && bun run test)       # 全件が pass することを確認
  5. git add web-next/app/<provider>/<slug>/ && git commit -m "feat(web-next): faithful migration of /<provider>/<slug> <section-id> (...)"
  6. **MIGRATION_PROGRESS.md を更新 → git commit**（HEAD・次の作業・テスト数・ビルドを同期）← **次セクション HTML を Read する前の必須ゲート**

絶対禁止:
- bun run lint:fix / bunx biome check --write （パス引数なし） — リポジトリ全体を書き換えるため（R1 違反）
- legacy HTML の内容を要約・省略 — Phase C-2 で R2 として明文化（要約版は差し戻し対象）
- legacy/ 配下の編集（CLAUDE.md「Phase A–F 中は legacy/ 凍結」）
- 既存ファイル（pricing.json / scraper / lib/cost.ts 等）への副作用的な変更

検証コマンド早見表:
  (cd web-next && bun run test)          # 全件 pass が期待値（現在 497 件 全 pass）
  (cd web-next && bun run typecheck)     # OK
  (cd web-next && bun run build)         # 全ルートが ○ (Static)
  (cd web-next && bun run lint)          # 既知 7 件のみ（新規違反ゼロが必須）
  (cd scraper && uv run pytest)          # 5/5 passed

既知の持越し（別 Issue で対応、本作業では触らない）:
- lib/i18n.test.ts:18 の key count ハードコード
- 一部既存ファイルの Biome printWidth 違反 6 件（R1 により全体 lint:fix 禁止）
```

### LLM 別の補足

- **Claude Code**: `/nextjs-page-migration` skill が使える（MDX・`.md` SSoT 方式は不採用。全ページ HTML → JSX 直接移植）
- **Gemini CLI**: GEMINI.md が `@CLAUDE.md` を import する形にしてあるため、CLAUDE.md ルールが自動継承される
- **Codex / Cursor**: AGENTS.md（CLAUDE.md と同等内容）を読み込ませる
- **任意の Agent**: 上記プロンプトと CLAUDE.md・MIGRATION_PROGRESS.md・docs/NEXTJS_PHASE_A_F_PLAN.md §Phase D の 3 つを冒頭で読み込ませれば自走可能

## Phase C 完了記録（参照用アーカイブ）

Phase C-1〜C-4 はすべて faithful 移植完了。確立したパターンは SKILL.md §「Phase C 確立パターン」に転記済み。
詳細な設計事実は `docs/NEXTJS_PHASE_C_DETAILED_DESIGN.md` を参照。
