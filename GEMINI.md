# GEMINI.md

GEMINI.md は Gemini CLI / Gemini Code Assist 向けの入り口。
本リポジトリでは **CLAUDE.md が正本** とし、GEMINI.md はその委譲 pointer として機能する。

## 必読（順序固定、作業開始前に 2 点読むこと）

1. [`CLAUDE.md`](CLAUDE.md) — リポジトリ全体の AI 編集ルール・アーキテクチャ・禁止事項
2. [`MIGRATION_PROGRESS.md`](MIGRATION_PROGRESS.md) — 最新の移行完了状況・AI 作業ルール R1〜R4

> **Phase A–F は全完了**。計画書は [`docs/archive/NEXTJS_PHASE_A_F_PLAN.md`](docs/archive/NEXTJS_PHASE_A_F_PLAN.md) に保存済み。

@./CLAUDE.md
@./MIGRATION_PROGRESS.md

## 絶対に守るべきルール（CLAUDE.md と MIGRATION_PROGRESS.md のサマリ）

- **R1（Biome scope）**: `bun run lint:fix` / `bunx biome check --write`（パス引数なし）は **禁止**。必ずファイル単位でパス指定
- **legacy/ 配下の編集禁止**（移行完了・凍結済み）
- **ファイル全体の書き直し禁止**（明示指示がない限り）
- **依存関係のアップグレード禁止**
- **設定ファイル（next.config.ts / tsconfig.json / biome.json 等）の勝手な変更禁止**

## 検証コマンド

```bash
cd web-next && bun run test        # 542 pass（全 Green）
cd web-next && bun run typecheck   # OK
cd web-next && bun run build       # 全ルートが ○ (Static)
cd web-next && bun run lint        # 0 件（全解消 ✅）
cd scraper && uv run pytest        # 5/5
```

## 次セッション再開プロンプト

MIGRATION_PROGRESS.md §「次回セッションでの再開プロンプト（任意の LLM 用、ツール非依存）」
を参照。そのプロンプトをコピーすれば任意の Agent で作業再開可能。
