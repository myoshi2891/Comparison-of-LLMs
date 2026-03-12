---
name: pre-commit-check
description: >
  コミット前に全テスト・ビルドを実行してコード品質を確認する。
  「コミット前チェック」「テスト実行」「ビルドとテスト」「CI 確認」
  「全部テストして」「コミットしていいか確認」と言われたときに使用する。
  フロントエンド（bun test + build）とバックエンド（pytest）の両方を検証する。
invocation: explicit
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
---

# コミット前チェックスキル

## 概要

CLAUDE.md で定義されたコミット前チェックリストを順次実行する。
いずれかのステップが失敗した場合は**即座に停止**してユーザーに報告する。

## 実行手順

### Step 1: フロントエンドビルド

```bash
cd web && bun run build
```

`tsc -b && vite build` が実行される。型エラー・ビルドエラーがないことを確認する。

### Step 2: フロントエンドテスト

```bash
cd web && bun test
```

vitest が実行される。全テスト PASS を確認する。

### Step 3: バックエンドテスト

```bash
cd scraper && uv run pytest
```

pytest が実行される。全テスト PASS を確認する。

### Step 4: 設定ファイルの意図しない変更チェック

以下のファイルが意図せず変更されていないか `git diff` で確認する:

- `web/vite.config.ts`
- `web/vitest.config.ts`
- `web/tsconfig.json`
- `web/tsconfig.app.json`
- `scraper/pyproject.toml`
- `netlify.toml`

変更がある場合はユーザーに報告して確認を求める。

### Step 5: import の有効性

ビルド（Step 1）が成功していれば import は有効と判断できる。
追加の確認は不要。

## 判定基準

| 結果 | アクション |
|---|---|
| 全ステップ成功 | 「コミット OK」と報告 |
| いずれか失敗 | **停止**してエラー内容をユーザーに報告。自動修正しない |

## 注意事項

- このスキルは `invocation: explicit` — `/pre-commit-check` での手動呼び出しのみ
- テストの書き直しや設定ファイルの変更は行わない
- 失敗時は原因の特定と報告のみ行い、修正はユーザーの指示を待つ
