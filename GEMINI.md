# GEMINI.md

Updated 2026-08-14

GEMINI.md は Gemini CLI / Gemini Code Assist 向けの入り口。
本リポジトリでは **CLAUDE.md が正本** とし、GEMINI.md はその委譲 pointer として機能する。

## 必読（順序固定、作業開始前に 4 点すべてを読むこと）

1. [`CODEX.md`](CODEX.md) — 作業種別に対応する `.claude` スキル・ルールの必読表
2. [`CLAUDE.md`](CLAUDE.md) — リポジトリ全体の AI 編集ルール・アーキテクチャ・禁止事項
3. [`docs/PROGRESS.md`](docs/PROGRESS.md) — 最新の進捗状況・テスト実行・ネクストアクションと再開プロンプト（移行時の詳細は [`docs/archive/MIGRATION_PROGRESS.md`](docs/archive/MIGRATION_PROGRESS.md)）
4. [`docs/archive/NEXTJS_PHASE_A_F_PLAN.md`](docs/archive/NEXTJS_PHASE_A_F_PLAN.md) — Phase A–F の全体計画書（全完了済み）

@./CLAUDE.md
@docs/PROGRESS.md

## 絶対に守るべきルール（CLAUDE.md と docs/PROGRESS.md のサマリ）

- **R1（Biome scope）**: `bun run lint:fix` / `bunx biome check --write`（パス引数なし）は **禁止**。必ずファイル単位でパス指定
- **R2（100% 完全移植 & スタイリング防犯原則）**: HTML/Markdown からの移植・更新では **要約・省略・縮約・代表抽出を一切禁止（絶対ルール）**。全要素の JSX 転写に加え、①表の全列左寄せ（`:global(th/td)` で `text-align: left !important`）、②コードブロックの明示的先頭インデント（`{"    "}` 形式）、③カードグリッド・ブレットリストの完全再現、④アンカー移動の見出しめり込み防止（`scroll-margin-top: calc(var(--header-height, 60px) + 80px)`）を徹底すること。
- **R3（スキル優先）**: 新規ガイドページ移行・既存ページ保守を始める前に
  [`.gemini/skills/nextjs-page-migration/SKILL.md`](.gemini/skills/nextjs-page-migration/SKILL.md) を必ず読む
  （`.claude/skills/` へのシンボリックリンクであり内容は同一）
- **R4（原本照合監査の必須化）**: ガイドページの移植・保守では、Green コミット前に監査スクリプトを実行し
  **終了コード 0 を確認する**こと。目視照合だけで完了扱いにしてはならない。

  ```bash
  bun .gemini/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
    archive/{html|md}/<ベンダー>/<原本>.{html|md|markdown} web-next/app/<provider>/<slug>/page.tsx
  echo "exit=$?"   # 0 以外は移行漏れ → コミット禁止
  ```

  運用手順と偽陽性の分類は
  [`.gemini/skills/nextjs-page-migration/references/source-parity-audit.md`](.gemini/skills/nextjs-page-migration/references/source-parity-audit.md) を参照。
- **R5（テスト強度の下限）**: 契約テストは件数のみ・存在のみ・部分一致のみの検証を禁止し、
  見出しは `toEqual([...EXPECTED_H2])` の順序込み完全一致で検証する
  （詳細は [`.gemini/rules/tdd-mandatory-cycle.md`](.gemini/rules/tdd-mandatory-cycle.md)）
- **R6（Noto Sans JP の自前ホスト）**: 本文フォントを `next/font/google` へ戻さない。`next/font` は
  `@font-face` を全件ビルド時に取得するため、Noto Sans JP の 496 件が Netlify ビルドを落とす。
  woff2 と `@font-face` CSS は `web-next/public/fonts/` に vendor 済み（生成は
  `cd web-next && bun scripts/vendor-noto-sans-jp.ts`。詳細は CLAUDE.md の設計判断を参照）
- **legacy/ 配下の編集禁止**（移行完了・凍結済み）
- **元のHTML/Markdownオリジナルファイルの完全削除は厳禁**：移行元のファイルは絶対に削除してはならず、必ず `archive/` ディレクトリ配下に移動（`git mv` または `mv`）して退避保存すること
- **ファイル全体の書き直し禁止**（明示指示がない限り）
- **依存関係のアップグレード禁止**
- **設定ファイル（next.config.ts / tsconfig.json / biome.json 等）の勝手な変更禁止**
- **PII等（個人情報やローカル固有 of 絶対パス）のコミット禁止**：コミット前に `git diff --cached` や新規追加ファイルに `file:///Users/` やローカルユーザー名などの情報が含まれていないことを確認

## 検証コマンド

```bash
(cd web-next && bun run test)        # 168 files / 1496 tests pass（2026-08-19 実測。全 Green ✅）
(cd web-next && bun run typecheck)   # OK（2026-08-19 実測）
(cd web-next && bun run build)       # 今回はユーザー指定により未実行。許可環境または CI で確認する
(cd web-next && bun run lint)        # OK（465 files / 0 diagnostics。2026-08-19 実測）
(cd scraper && uv run pytest)        # 43/43 pass（全 Green ✅）
```

## 次セッション再開プロンプト

docs/PROGRESS.md §「次回セッションでの再開・実行依頼プロンプト」
を参照。そのプロンプトをコピーすれば任意の Agent で作業再開可能。
