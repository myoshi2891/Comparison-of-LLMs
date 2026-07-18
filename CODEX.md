# Codex 作業規約

Updated 2026-07-16

このファイルは Codex が `.claude/` 配下の既存ルールとスキルを見落とさずに適用するための
ルーティング層である。実装上の正本は `CLAUDE.md`、作業状況の正本は
`docs/PROGRESS.md`、作業手順の正本は該当する `.claude/skills/*/SKILL.md` と
`.claude/rules/*.md` である。本ファイルはそれらを要約・置換しない。

## 開始時の必須手順

1. ルートの `AGENTS.md`、本ファイル、`CLAUDE.md`、`docs/PROGRESS.md`、
   `docs/archive/NEXTJS_PHASE_A_F_PLAN.md` をこの順で読む。ページ移行・その保守では
   `docs/archive/NEXTJS_PHASE_C_DETAILED_DESIGN.md` も読む。
2. 下の「作業別ルーティング」で該当するスキルとルールを、変更・調査を始める**前**に
   完全に読む。複数該当時はすべて適用する。
3. `web-next/` を変更する場合は、そのディレクトリの `AGENTS.md` も読む。Next.js の
   API・規約に関わる実装前には `web-next/node_modules/next/dist/docs/` の該当資料を確認する。
4. 指示が競合した場合は、ユーザー指示、実行環境のシステム指示、`CLAUDE.md`、本ファイル、
   個別スキルの順に優先する。より安全な制約は維持する。

## 常に守る制約

- `legacy/` は読み取り専用。移行元の HTML / Markdown を削除せず、必要なら `archive/` へ退避する。
- 明示指示なしにファイル全体を書き換えない。最小差分を優先する。
- 依存関係、ビルド設定、CI 構造、環境変数、Netlify 設定を勝手に変更しない。
- `bun run lint:fix` と `bunx biome check --write` は、必ず対象ファイルのパスを指定する。
  リポジトリ全体への自動整形は禁止。
- `web-next/` では生 HTML 注入を使わない。Python と TypeScript の pricing 型を変更する場合は
  両方を同期する。
- コミット前は設定変更の意図、検証結果、ステージ済み差分の PII / 絶対パス混入を確認する。

## 作業別ルーティング

| 作業・トリガー | 必ず読むスキル / ルール | 実行上の要点 |
| --- | --- | --- |
| `web-next/` の機能追加・バグ修正・改善 | `.claude/rules/tdd-mandatory-cycle.md` | 実装前に Red テストを作成・失敗確認・コミットし、Green / Refactor / Docs を分ける。純粋なリファクタリングは既存テストの成功確認から始める。 |
| 新規ガイドページ、HTML からの移行、既存ガイドの保守 | `.claude/skills/nextjs-page-migration/SKILL.md`、`.claude/rules/tdd-mandatory-cycle.md`、`.claude/rules/migration-progress-sync.md` | faithful 移植、3 点セット、ページレジストリ登録、TDD、進捗同期を守る。`nav-links.ts` は手書き変更しない。 |
| テスト・ページ・ナビ・レジストリ・共有仕様の変更、セッション終了 | `.claude/skills/docs-sync/SKILL.md` | 変更種別に対応する仕様書と日付を同期し、実測値で確認する。 |
| Markdown の新規作成・編集 | `.claude/skills/markdown-formatter/SKILL.md` | `bun scripts/format-markdown.mjs <file>` と `bun x markdownlint-cli <file>` を実行し、差分を確認する。 |
| `globals.css` またはページ CSS の変更 | `.claude/rules/css-cache-reset.md` | `.next` キャッシュを削除し、必要なら開発サーバーを再起動する。 |
| モデル価格 API プロバイダーの追加 | `.claude/skills/add-provider/SKILL.md` | 3 層フォールバック、登録、テスト、必要時の型同期を行う。 |
| サブスクリプション型コーディングツールの追加 | `.claude/skills/add-tool/SKILL.md` | `SubTool`、年額の月換算、登録、テスト、必要時の型同期を行う。 |
| Pydantic / TypeScript の pricing スキーマ変更 | `.claude/skills/sync-types/SKILL.md` | `models.py` を正本として `pricing.ts` を同期し、パリティを確認する。 |
| 月次の価格・ガイド・リリース情報更新 | `.claude/skills/monthly-update/SKILL.md` | 一次情報を確認し、対象ページの `lastReviewed` のみを当日に更新する。 |
| 価格データの全更新、または為替のみ更新 | `.claude/skills/full-update/SKILL.md` | ユーザー指定に応じて `update.sh` または `update.sh --no-scrape` を使う。 |
| Mermaid の追加・修正・表示不具合 | `.claude/skills/fix-mermaid/SKILL.md` | Mermaid 本文を左端揃えにし、必要な参照資料とスクリプトを使う。 |
| CDN の Mermaid SRI 不整合 | `.claude/skills/cdn-sri-mermaid-fix/SKILL.md` | スキルの指定手順に限定して修正する。 |
| テスト追加後のカバレッジ進捗更新 | `.claude/skills/update-coverage-dashboard/SKILL.md` | 実測スキャンの結果だけを `docs/TEST_COVERAGE_PROGRESS.md` とダッシュボードに反映する。 |
| コミット前チェック、CI 相当の検証 | `.claude/skills/pre-commit-check/SKILL.md`、`.claude/rules/no-absolute-paths.md` | 失敗時は停止して報告する。ステージ済み差分に PII / 絶対パスがないことを機械確認する。 |
| 仕様書の同期漏れ監査だけ | `.claude/skills/check-docs-sync/SKILL.md`、`.claude/skills/docs-sync/SKILL.md` | 現行コードと文書を実測で突合し、推測で数値を更新しない。 |

## 完了前の確認

- 変更対象に応じた上表の検証を実行し、失敗を隠さず報告する。
- Markdown を変更した場合は整形と markdownlint を実行する。
- ステージングまたはコミットを行う場合は、`.claude/rules/no-absolute-paths.md` の PII 検査を実行する。
- ユーザーが明示的にコミットを依頼していない限り、変更はコミットしない。
