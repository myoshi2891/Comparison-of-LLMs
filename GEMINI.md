# GEMINI.md

Updated 2026-10-14

GEMINI.md は Gemini CLI / Gemini Code Assist 向けの入り口。
本リポジトリでは **CLAUDE.md が正本** とし、GEMINI.md はその委譲 pointer として機能する。

## 必読（順序固定、作業開始前に 4 点すべてを読むこと）

1. [`CODEX.md`](CODEX.md) — 作業種別に対応する `.claude` スキル・ルールの必読表
2. [`CLAUDE.md`](CLAUDE.md) — リポジトリ全体の AI 編集ルール・アーキテクチャ・禁止事項
3. [`docs/PROGRESS.md`](docs/PROGRESS.md) — 最新の進捗状況・テスト実行・ネクストアクションと再開プロンプト（移行時の詳細は [`docs/archive/MIGRATION_PROGRESS.md`](docs/archive/MIGRATION_PROGRESS.md)）
4. [`docs/archive/NEXTJS_PHASE_A_F_PLAN.md`](docs/archive/NEXTJS_PHASE_A_F_PLAN.md) — Phase A–F の全体計画書（全完了済み）

@./CLAUDE.md
@docs/PROGRESS.md

2026-10-14 に `/books/hands-on-large-language-models` を推薦書籍へ追加。指定HTMLの本文・構造・
27図解・7表64行・17チェック項目・24参考文献カード（24リンク）を固定期待値で照合する。
22契約と12操作契約を追加し、HTML監査exit 0、全体Vitest **197 files／1970 tests**、
typecheck・lint（545 files／0 diagnostics）が成功。原本2形式は内容無変更で保存。
書籍情報カード（O'Reilly公式リンク、著者Jay Alammar & Maarten Grootendorst）、Hero kicker、
メタ情報タグ4件、全27箇所の Mermaid 図解に淡色パレット（theme='base'）を適用。
ヒーローセクション内に日付を黒文字で統合し、グローバル黒帯鮮度バー非表示でディスクレイマー下の余白を解消。
関連ページフッターの重なり解消（340pxオフセット、980px以下全幅）も完了。
表の全列左寄せ、アンカー移動の見出しめり込み防止を徹底。
registryの追加日は2026-10-14。npm・ビルドは未実行、目視確認はユーザー担当。

2026-10-14 に `/rag/enterprise-guide` をモデル・データへ追加。指定HTMLの本文・構造・
6図解・4コードブロック・11表67行・18外部リンク（15参考ソースカード含む）を固定期待値で照合する。
19契約を追加し、HTML監査exit 0、全体Vitest **195 files／1936 tests**、
typecheck・lint（539 files／0 diagnostics）が成功。原本HTMLは移行完了後に `archive/html/rag/` へ退避。
背景色（#eef1f4）の統一、グローバル黒帯鮮度バー非表示でディスクレイマー下の余白を解消。
関連ページフッターの重なり解消（308pxオフセット）、全6箇所の Mermaid 図解に淡色パレット（theme='base'）を適用。
表の全列左寄せ、コードブロックのインデント、アンカー移動の見出しめり込み防止を徹底。
registryの追加日は2026-10-14。npm・ビルドは未実行、目視確認はユーザー担当。

2026-10-14 に `/books/adversarial-robustness` を推薦書籍へ追加。指定HTMLの本文・構造・
12図解・1数式・7表66行・22参考文献カード（23リンク）を固定期待値で照合する。
20契約を追加し、HTML監査exit 0、全体Vitest **194 files／1917 tests**、
typecheck・lint（535 files／0 diagnostics）が成功。原本2形式は内容無変更で保存。
書籍情報カード（Plum callout、Elsevier公式リンク）、Hero kicker（AI Security 初学者ガイド）、
メタ情報タグ4件、全12箇所の Mermaid 図解に淡色パレット（theme='base'）を適用。
ヒーローセクション内に日付を黒文字で統合し、グローバル黒帯鮮度バー非表示でディスクレイマー下の余白を解消。
関連ページフッターの重なり解消とメインコンテンツ背景色（#f6f1e3）およびカード配色（#fffdf7）への完全同期も完了。
表の全列左寄せ、コードブロックのインデント、アンカー移動の見出しめり込み防止を徹底。
registryの追加日は2026-10-14。npm・ビルドは未実行、目視確認はユーザー担当。

2026-10-14 に `/books/llm-engineers-handbook` を推薦書籍へ追加。指定HTMLの本文・構造・
8図解・2コード例・55表行・15参考文献リンクを固定期待値で照合する。
21契約を追加し、HTML監査exit 0、全体Vitest **193 files／1897 tests**、
typecheck・lint（531 files／0 diagnostics）が成功。原本2形式は内容無変更で保存。
ヒーローセクション内に日付を黒文字で統合し、グローバル黒帯鮮度バー非表示でディスクレイマー下の余白を解消。
関連ページフッターの重なり解消とMermaid baseテーマ適用も完了。
表の全列左寄せ、コードブロックのインデント、アンカー移動の見出しめり込み防止を徹底。
registryの追加日は2026-10-14。npm・ビルドは未実行、目視確認はユーザー担当。

2026-10-11 に `/books/generative-ai-with-langchain` を推薦書籍へ追加。指定HTMLの本文・構造・
76 CSS規則・12コード例・8図解・22参考文献カードを固定期待値で照合する。
32ページ契約と16操作契約を追加し、HTML監査exit 0、全体Vitest **192 files／1876 tests**、
整理後の48契約・typecheck・lint（527 files／0 diagnostics）が成功。原本2形式は内容無変更で保存。
900px以下の通常フロー目次、暗色ネイティブスクロールバー、見出し／リストの既定余白を保持。
日付バーの背景と関連ページの重なり補正は本ページ限定。図解の代替説明はSVG成功時のみ隠す。
本文の情報基準日2026-09-23を維持し、依存・設定ファイルは変更しない。
npm・ビルド・スクレイパー・ブラウザ自動確認は未実行。CSSキャッシュ更新とdev再起動後の目視はユーザー担当。

2026-10-11 に `/books/generative-ai-on-aws` を推薦書籍へ追加。指定HTMLから本文・構造・
109 CSS規則・9図解・13チェック項目・23参考文献カードを固定期待値で照合する。
28ページ契約と15操作契約を追加し、HTML監査exit 0、共通クローム修正後のVitest **189 files／1828 tests**、
typecheck・lint（519 files／0 diagnostics）が成功。原本2形式は内容無変更で退避済み。
npm・ビルドは未実行、スクレイパー検証はユーザー指定で対象外。目視はユーザー担当。

同ページのスクロールバーは共通のダーク設定をページ限定の `color-scheme: light` で補正する。
共通日付バーとbodyは本文の紙色へ統一。共通関連ページは固定サイドバー幅300pxを避け、
980px以下では全幅に戻す。4件のCSS回帰契約を追加し、共通部品と原本オラクルは変更しない。

2026-10-04 に `/books/effective-ml-teams` を推薦書籍へ追加。原本の本文・CSS・11図解・12チェック項目を
固定期待値で照合し、registry から全導線を導出する。44契約と原本監査exit 0、
Vitest 185 files／1779 tests、typecheck・lint・pytest 104件が成功。復旧履歴と目視の再開手順は
`docs/PROGRESS.md` を参照。npm・ビルドは未実行、目視確認はユーザー担当。

2026-10-03 に `/books/ai-powered-developer` を推薦書籍へ追加。本文・CSS・図解・チェックリストを
原本照合し、registry から全導線を自動導出する。移行原本の保存先・検証証跡・次の作業は
`CLAUDE.md` と `docs/PROGRESS.md` を参照。今回のビルドは未実行、目視確認はユーザー担当。

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
(cd web-next && NODE_OPTIONS=--no-experimental-webstorage bun run test -- --maxWorkers=1 --testTimeout=30000) # Node 24 / 197 files / 1970 tests pass（2026-10-14 実測）
(cd web-next && bun run typecheck)   # OK（2026-10-14 実測）
# ビルドは今回ユーザー指定で未実行（過去: 2026-09-18 に89静的ページ生成）
(cd web-next && bun run lint)        # OK（545 files / 0 diagnostics。2026-10-14 実測）
(cd scraper && uv run pytest)        # 今回対象外。過去の成功は104件（2026-10-04）
```

## 次セッション再開プロンプト

docs/PROGRESS.md §「次回セッションでの再開・実行依頼プロンプト」
を参照。そのプロンプトをコピーすれば任意の Agent で作業再開可能。
