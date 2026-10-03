---
name: full-update
description: |
  Run a full data refresh: scrape pricing data, update exchange rates, and build the frontend.
  TRIGGER when the user says any of the following (Japanese or English):
  - "データをフル更新して" / "全体をビルドして" / "最新の価格を取得して"
  - "full update" / "rebuild all" / "refresh pricing data"
  Executes update.sh (full scrape + build) or update.sh --no-scrape (exchange rate only).
---

# 全体フル更新・ビルドスキル

## 手順

1. **全体フル更新**
   - ルートディレクトリで `bash update.sh` を実行する。
   - これにより、Pythonスクレイパーの実行（`pricing.json`の生成）と、Next.js（`web-next/`）によるフロントエンドのビルドが走る。

2. **為替レートのみの更新（ユーザーから指定があった場合）**
   - 「スクレイピングはスキップして」「為替だけ更新して」と言われた場合は `bash update.sh --no-scrape` を実行する。

3. **Home の公開日・最終確認日を更新（必須）**
   - 価格データを更新したら、`web-next/lib/page-registry.ts` の `slug: "/"`（Home）エントリの
     `addedAt`（公開日）と `lastReviewed`（最終確認日）を**両方とも更新当日の日付（YYYY-MM-DD）**へ書き換える。
   - Home はデータ更新そのものが公開であるため、`addedAt` を据え置く他ページのルールの例外とする（2026-10-03 ユーザー指示）。

4. **結果の確認**
   - コマンドの終了コードを確認し、エラーが発生した場合はエラーログをユーザーに報告する。
   - 成功した場合は「更新とビルドが正常に完了しました」と短く回答する。
