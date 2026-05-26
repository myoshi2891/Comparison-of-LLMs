# AGENTS.md

AGENTS.md は Codex / Cursor / Cline など AGENTS.md 規約を読む AI ツール向けの入り口。
本リポジトリでは **CLAUDE.md が正本** とし、AGENTS.md はその委譲 pointer として機能する。

## 必読（順序固定、作業開始前に 3 点すべて読むこと）

1. [`CLAUDE.md`](CLAUDE.md) — リポジトリ全体の AI 編集ルール・アーキテクチャ・禁止事項
2. [`docs/PROGRESS.md`](docs/PROGRESS.md) — 現在地・テスト実行・ネクストアクションと再開プロンプト（移行時の詳細は [`docs/archive/MIGRATION_PROGRESS.md`](docs/archive/MIGRATION_PROGRESS.md)）
3. [`docs/archive/NEXTJS_PHASE_A_F_PLAN.md`](docs/archive/NEXTJS_PHASE_A_F_PLAN.md) — Phase A–F の全体計画。Phase C 以降は [`docs/archive/NEXTJS_PHASE_C_DETAILED_DESIGN.md`](docs/archive/NEXTJS_PHASE_C_DETAILED_DESIGN.md) も併読

## 絶対に守るべきルール（CLAUDE.md と docs/PROGRESS.md のサマリ）

- **R1（Biome scope）**: `bun run lint:fix` / `bunx biome check --write`（パス引数なし）は **禁止**。必ずファイル単位でパス指定
- **R2（faithful 必須）**: legacy HTML の移植では **要約・省略・縮約禁止**。全リスト項目・全コードブロック・全 SVG・全 alert・全 table を JSX に転写
- **R3（スキル優先）**: 新規ガイドページ移行を始める前に `.claude/skills/nextjs-page-migration/SKILL.md` を必ず読む
- **legacy/ 配下の編集禁止**（Phase A–F 中は凍結）
- **ファイル全体の書き直し禁止**（明示指示がない限り）
- **依存関係のアップグレード禁止**
- **設定ファイル（next.config.ts / tsconfig.json / biome.json 等）の勝手な変更禁止**
- **PII等（個人情報やローカル固有の絶対パス）のコミット禁止**：コミット前に `git diff --cached` や新規追加ファイルに `file:///Users/` やローカルユーザー名などの情報が含まれていないことを確認

## 検証コマンド

```bash
cd web-next && bun run test        # 553 pass（全 Green ✅）
cd web-next && bun run typecheck   # OK
cd web-next && bun run build       # /gemini/agent 等が Static プリレンダリング
cd web-next && bun run lint        # 既知 6 件のみ（新規違反ゼロが必須）
cd scraper && uv run pytest        # 5/5
```

## 次セッション再開プロンプト

docs/PROGRESS.md §「次回セッションでの再開・実行依頼プロンプト」
を参照。そのプロンプトをコピーすれば任意の Agent で作業再開可能。
