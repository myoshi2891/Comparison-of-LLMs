# GEMINI.md

GEMINI.md は Gemini CLI / Gemini Code Assist 向けの入り口。
本リポジトリでは **CLAUDE.md が正本** とし、GEMINI.md はその委譲 pointer として機能する。

## 必読（順序固定、作業開始前に 3 点すべて読むこと）

1. [`CLAUDE.md`](CLAUDE.md) — リポジトリ全体の AI 編集ルール・アーキテクチャ・禁止事項
2. [`MIGRATION_PROGRESS.md`](MIGRATION_PROGRESS.md) — 現在地（Phase A–F）・AI 作業ルール R1/R2・次の作業・再開プロンプト
3. [`docs/NEXTJS_PHASE_A_F_PLAN.md`](docs/NEXTJS_PHASE_A_F_PLAN.md) — Phase A–F の全体計画。Phase C 以降は [`docs/NEXTJS_PHASE_C_DETAILED_DESIGN.md`](docs/NEXTJS_PHASE_C_DETAILED_DESIGN.md) も併読

@./CLAUDE.md
@./MIGRATION_PROGRESS.md

## 絶対に守るべきルール（CLAUDE.md と MIGRATION_PROGRESS.md のサマリ）

- **R1（Biome scope）**: `bun run lint:fix` / `bunx biome check --write`（パス引数なし）は **禁止**。必ずファイル単位でパス指定
- **R2（faithful 必須）**: legacy HTML の移植では **要約・省略・縮約禁止**。全リスト項目・全コードブロック・全 SVG・全 alert・全 table を JSX に転写
- **R3（スキル優先）**: 新規ガイドページ移行を始める前に `.claude/skills/nextjs-page-migration/SKILL.md` を必ず読む
- **legacy/ 配下の編集禁止**（Phase A–F 中は凍結）
- **ファイル全体の書き直し禁止**（明示指示がない限り）
- **依存関係のアップグレード禁止**
- **設定ファイル（next.config.ts / tsconfig.json / biome.json 等）の勝手な変更禁止**

## 検証コマンド

```bash
cd web-next && bun run test        # 461 pass が期待値（C-4 Red scaffold 込み）
cd web-next && bun run typecheck   # OK
cd web-next && bun run build       # /gemini/agent 等が Static プリレンダリング
cd web-next && bun run lint        # 既知 6 件のみ（新規違反ゼロが必須）
cd scraper && uv run pytest        # 5/5
```

## 次セッション再開プロンプト

MIGRATION_PROGRESS.md §「次回セッションでの再開プロンプト（任意の LLM 用、ツール非依存）」
を参照。そのプロンプトをコピーすれば任意の Agent で作業再開可能。
