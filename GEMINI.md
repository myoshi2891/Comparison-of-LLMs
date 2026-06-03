# GEMINI.md

Updated 2026-06-03

GEMINI.md は Gemini CLI / Gemini Code Assist 向けの入り口。
本リポジトリでは **CLAUDE.md が正本** とし、GEMINI.md はその委譲 pointer として機能する。

## 必読（順序固定、作業開始前に 2 点を読むこと）

1. [`CLAUDE.md`](CLAUDE.md) — リポジトリ全体の AI 編集ルール・アーキテクチャ・禁止事項
2. [`docs/PROGRESS.md`](docs/PROGRESS.md) — 最新の進捗状況・テスト実行・ネクストアクションと再開プロンプト（移行時の詳細は [`docs/archive/MIGRATION_PROGRESS.md`](docs/archive/MIGRATION_PROGRESS.md)）

> **Phase A–F は全完了**。計画書は [`docs/archive/NEXTJS_PHASE_A_F_PLAN.md`](docs/archive/NEXTJS_PHASE_A_F_PLAN.md) に保存済み。

@./CLAUDE.md
@docs/PROGRESS.md

## 絶対に守るべきルール（CLAUDE.md と docs/PROGRESS.md のサマリ）

- **R1（Biome scope）**: `bun run lint:fix` / `bunx biome check --write`（パス引数なし）は **禁止**。必ずファイル単位でパス指定
- **legacy/ 配下の編集禁止**（移行完了・凍結済み）
- **ファイル全体の書き直し禁止**（明示指示がない限り）
- **依存関係のアップグレード禁止**
- **設定ファイル（next.config.ts / tsconfig.json / biome.json 等）の勝手な変更禁止**
- **PII等（個人情報やローカル固有の絶対パス）のコミット禁止**：コミット前に `git diff --cached` や新規追加ファイルに `file:///Users/` やローカルユーザー名などの情報が含まれていないことを確認

## 検証コマンド

```bash
cd web-next && bun run test        # 670 pass（全 Green ✅）
cd web-next && bun run typecheck   # OK
cd web-next && bun run build       # 全ルートが ○ (Static)
cd web-next && bun run lint        # 0 件（全解消 ✅）
cd scraper && uv run pytest        # 38/38 pass（全 Green ✅）
```

## 次セッション再開プロンプト

docs/PROGRESS.md §「次回セッションでの再開・実行依頼プロンプト」
を参照。そのプロンプトをコピーすれば任意の Agent で作業再開可能。
