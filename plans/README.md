# Plans — プラットフォーム拡張検討ドキュメント

`.agent/skills/improve/SKILL.md`（direction バリアント）により 2026-07-06 に生成。
対象は web-next（Next.js 16 SSG）の「AI 最新情報キャッチアップ・プラットフォーム」化。
001〜003 は**分析・方向性ドキュメント**であり、そのまま実装するものではない。
実装着手時は 003 §6 の指針に従い、項目ごとに個別プラン（`plans/NNN-*.md`）を起票する。

基準コミット（drift 検出用）: `3915136`

## 実行順・ステータス

| Plan | タイトル | 種別 | Depends on | Status |
|------|---------|------|------------|--------|
| [001](001-current-state-analysis.md) | web-next プラットフォーム現状分析 | 分析 | — | DONE（分析完了） |
| [002](002-category-gap-analysis.md) | AI 情報収集カテゴリのギャップ分析 | 分析 | 001 | DONE（分析完了） |
| [003](003-platform-expansion-roadmap.md) | プラットフォーム拡張ロードマップ | direction | 001, 002 | DONE（方向性定義完了・実装は個別プラン起票待ち） |

Status 値: TODO / IN PROGRESS / DONE / BLOCKED（理由 1 行） / REJECTED（理由 1 行）

## 依存関係

- 002 は 001 のカテゴリインベントリ（§3）を基準にギャップを判定している
- 003 は 001 の構造課題（STATE-01〜05）と 002 の結論（GAP-01〜09）を入力とする
- 実装フェーズの依存の要は **F-1 ページレジストリ**（003 §5）— これが他の全機能の前提

## 次のアクション（実装起票の推奨順）

1. `plan F-1 ページレジストリと最終確認日表示の導入`（Phase 1 の起点）
2. `plan F-2 What's New ページの静的生成`
3. `plan C-1 MCP カテゴリ新設（入門ページ + ナビ二軸化 F-4）`

## 検討済み・不採用（re-audit 防止）

- **マルチモーダル / 画像・音声生成カテゴリ**: 読者ペルソナ（AI 駆動開発者）と不一致（002 GAP-09）
- **RAG 独立カテゴリ**: Context Engineering の 1 セクションへ吸収（002 GAP-08）
- **URL 全面再編（トピック軸 URL への移動）**: リダイレクトが netlify.toml 変更を要し AI 変更ルールに抵触。ナビ二軸化（C 案）で代替（003 §2）
- **CMS / DB 導入**: pure SSG + Git 管理の強みを放棄する理由がない（003 §7）

## 制約メモ（全プラン共通）

- コード実装時は `.claude/rules/tdd-mandatory-cycle.md`（Red → Green → Refactor → Docs Sync）を厳守
- netlify.toml・外部依存追加・EN 展開はユーザー明示承認が必要（003 §6）
- コミット前 PII チェック（`.claude/rules/no-absolute-paths.md`）を全コミットで実施
