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

1. **クラスの実装**
   - `scraper/src/scraper/providers/` に小文字のプロバイダー名のPythonファイル（例: `anthropic.py`）を作成する。
   - `models.py` の `ProviderBase` を継承したクラスを実装する。
   - 戻り値の型ヒントには必ず `list[ApiModel]` を使用し、`models.py` に準拠する。

2. **モジュールのエクスポート**
   - `scraper/src/scraper/providers/__init__.py` を読み込み、作成したモジュールとクラスを `__all__` に追加する。

3. **メインロジックへの組み込み**
   - `scraper/src/scraper/main.py` を読み込む。
   - `PROVIDERS` リストまたはファクトリーマッピングに、作成したプロバイダークラスを登録する。

4. **テストの実行**
   - 特定のスクレイパーだけをテスト起動して動作を確認する。
   - コマンド: `cd scraper && uv run python -m scraper.main --provider <プロバイダー名>` (または該当する検証コマンド)

## 注意事項

- 必ず `from __future__ import annotations` をファイル先頭に付与すること。
- スクレイピングライブラリは、既存の依存関係（`httpx`, `Playwright` など）の範囲内で実装すること。
