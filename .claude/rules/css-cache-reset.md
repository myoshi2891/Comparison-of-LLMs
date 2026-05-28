# globals.css 変更後のキャッシュリセットルール

## 問題

`web-next/app/globals.css`（特に `@theme` ブロックや `@layer base`）を変更した後、`web-next/.next` に古い CSS チャンクが残ると、CSS カスタムプロパティ（`--color-bg` 等）が空文字に解決されてページのダークモードが消える。

**症状チェック**（ブラウザコンソールで確認）:

```js
getComputedStyle(document.documentElement).getPropertyValue('--color-bg')
// "" が返る → キャッシュ汚染
// "#05080f" が返る → 正常
```

## ルール

### 必須トリガー

以下のファイルを編集した後は **必ず** `web-next/.next` を削除して dev サーバーを再起動する:

- `web-next/app/globals.css`
- `web-next/app/**/*.css`（ページ固有スタイル）
- `web-next/tailwind.config.*`（Tailwind v4 の場合は主に globals.css の設定）

### 手順（ローカル環境）

```bash
# 1. キャッシュ削除
rm -rf web-next/.next

# 2. dev サーバー再起動（必要に応じてポート 3000 のプロセスを停止）
# 開発サーバーが立ち上がっているターミナルで Ctrl+C で停止してから、再度起動する。
cd web-next && bun run dev
```

### 手順（Docker 環境）

```bash
# Docker コンテナの停止とキャッシュクリアを含むクリーン起動
make down
rm -rf web-next/.next
make dev
```

## 背景

Next.js + Tailwind v4 の CSS コンパイルはチャンク単位でキャッシュされる。HMR は JS の変更には追従するが、`@theme` ブロックの変数定義変更はキャッシュ無効化が不完全なことがある。

## 本番ビルド（Docker）でも同じ症状が出る場合

dev サーバーでは正常でも Docker の本番ビルドで CSS 変数が空になるケースがある。

**原因**: Next.js 本番ビルドは CSS をルート単位でチャンク分割する。Tailwind v4 の `@theme` 出力が別チャンクに分離され、特定ページで読み込まれないことがある。

**恒久対策**: `globals.css` の `:root {}` ブロックに `@theme` と同じ変数を直接定義する（実施済み）。こうすることで変数定義が常にメインチャンクに含まれる。

**Docker リビルド手順**（`globals.css` 変更後）:

```bash
make down && make build-images && make dev
```
