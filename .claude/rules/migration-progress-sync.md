---
paths:
  - "web-next/app/**/*.tsx"
  - "web-next/app/**/*.test.tsx"
  - "web-next/app/**/*.module.css"
  - "MIGRATION_PROGRESS.md"
---

# MIGRATION_PROGRESS.md セッション終了前同期ルール

Phase A–F の移行作業セッションでは、**セッションをコンパクトする必要が出てくる前に**
必ず以下を実行してセッションを終えること。

## 実行タイミング

### 必須（毎セクション・例外なし）

**1セクションの `git commit` 完了直後、次セクションの HTML を `Read` する前に即実施する。**
これは任意の「区切り」ではなく、次セクション読み込みのための**ゲート条件**。
MIGRATION_PROGRESS.md が未コミットの状態で次セクション HTML を読み始めることは禁止。

### 追加トリガー（上記に加えて）

- コンテキスト消費が大きくなってきた（ユーザーが新セッション開始を示唆）
- ユーザーが「セッション終了」「仕様書更新して」と言った

## 手順

### 1. `## 現在地` セクションを更新

```bash
git rev-parse --short HEAD                    # 最新 HEAD を取得
cd web-next && bun run build                  # ビルド成功を確認
cd web-next && bun run typecheck              # 型エラーゼロを確認
cd web-next && bun run test                   # pass 件数を確認
cd web-next && bun run lint                   # 既知 6 件のみか確認
cd scraper && uv run pytest                   # Python テスト 5/5 を確認
```

更新対象フィールド:

| フィールド | 更新内容 |
|---|---|
| `最新 HEAD` | `git rev-parse --short HEAD` の実値 + コミットメッセージ要約 |
| `次の作業` | 次セッションで **最初に** 取り掛かるセクション（例: `C-4 s02 faithful 移植`） |
| `テスト数` | `bun run test` の pass 件数 |
| `ビルド` | `bun run build` / `bun run typecheck` / `uv run pytest` の最新状態 |

### 2. `## 次回セッションでの再開プロンプト` を同期

`現在地` の値と一致するように再開プロンプト内の以下を書き換える:

- `最新 HEAD: <hash>` の値
- `次の作業:` の説明（セクション粒度で具体的に）
- 未完了セクションの行範囲（移植が進んで変わった場合のみ）

### 3. コミット

```bash
git add MIGRATION_PROGRESS.md
git commit -m "chore(docs): update MIGRATION_PROGRESS.md — <作業内容の1行要約>"
```

## 禁止

- HEAD 値をコミットせず新セッションに引き継ぐ（ズレが発生する）
- 再開プロンプトと `現在地` が食い違ったままコミットする
- このファイル更新のために `bun run lint:fix` や全体 Biome write を実行する（R1 違反）
