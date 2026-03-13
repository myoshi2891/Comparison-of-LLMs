---
name: add-provider
description: |
  新しいAIモデルのプロバイダー（スクレイパー）を追加するスキル。
  「新しいプロバイダーを追加して」「〇〇のスクレイパーを作って」という指示が出たら使用すること。
  プロジェクトの命名規則、クラス設計、登録手順を自動化する。
---

# 新規プロバイダー追加スキル

## 手順

新しいAI企業・プロバイダーのスクレイピングロジックを追加する場合は、以下の手順を厳守すること。

1. **関数の実装**
   - `scraper/src/scraper/providers/` に小文字のプロバイダー名のPythonファイル（例: `anthropic.py`）を作成する。
   - クラス継承は使用せず、モジュール内に `_URL`, `_FALLBACKS: dict[str, tuple[...]]` 等の定数を定義する。
   - スクレイピングのメイン処理として `def scrape(existing: list[ApiModel] | None = None) -> list[ApiModel]:` 関数を実装する。
   - ロギングを適切に仕込み、戻り値は `scraper.models.ApiModel` に準拠したリストを返すこと。

2. **モジュールのエクスポート**
   - `scraper/src/scraper/providers/__init__.py` を読み込む。
   - 各プロバイダーの `scrape` 関数をエイリアス付きでインポートする。（例: `from scraper.providers.anthropic import scrape as scrape_anthropic`）
   - インポートしたエイリアス名（例: `"scrape_anthropic"`）を `__all__` のリストに追加し、外部から利用可能にする。

3. **メインロジックへの組み込み**
   - `scraper/src/scraper/main.py` を読み込む。
   - `_scrape_all()` 関数内にあるスクレイパー関数のリスト（タプルのリスト）に、新しく追加したプロバイダーを登録する。
   - 例: `(lambda: scrape_anthropic(existing_api), "Anthropic")` のように関数をラップしてリストに追加する。これにより、既存の `_run_scraper()` のループ内で自動的に実行されるようになる。

4. **テストの実行**
   - 特定のスクレイパーだけをテスト起動して動作を確認する。
   - コマンド: `cd scraper && uv run python -m scraper.main --provider <プロバイダー名>` (または該当する検証コマンド)

## 注意事項

- 必ず `from __future__ import annotations` をファイル先頭に付与すること。
- スクレイピングライブラリは、既存の依存関係（`httpx`, `Playwright` など）の範囲内で実装すること。
