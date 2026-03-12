---
name: add-provider
description: >
  pricing.json に新しい API プロバイダー（LLM ベンダー）のスクレイパーを追加する。
  「プロバイダー追加」「新しい LLM を追加」「○○ のスクレイパーを作って」
  「○○ の料金を取得したい」「API プロバイダーを増やして」と言われたときに使用する。
  providers/ ディレクトリに新しいモジュールを作成し、main.py に登録する手順を提供する。
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# 新規 API プロバイダー追加スキル

## 前提知識

このプロジェクトのスクレイパーは 3層フォールバック構造を持つ:

1. **スクレイプ成功** → 実際の価格を使用
2. **既存 JSON の値** → 前回の成功値を引き継ぎ
3. **ハードコードフォールバック** → `_FALLBACKS` 辞書の値

## 手順

### Step 1: テンプレートを確認する

既存プロバイダーの実装を参照する:

```text
scraper/src/scraper/providers/anthropic.py  ← 推奨テンプレート
```

必要な要素:

- `_URL`: スクレイピング対象の料金ページ URL
- `_FALLBACKS`: `dict[str, tuple[float, float]]` — モデル名 → (input価格, output価格)
- `scrape(existing)` 関数: `list[ApiModel]` を返す
- `_build_models()` ヘルパー: フォールバック辞書から ApiModel リストを構築

### Step 2: プロバイダーファイルを作成する

`scraper/src/scraper/providers/<name>.py` を作成する。

```python
"""<Provider名> 公式料金ページスクレイパー。

対象: <URL>
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text, extract_price, sanity_check
from scraper.models import ApiModel

logger = logging.getLogger(__name__)

_URL = "<料金ページURL>"

_FALLBACKS: dict[str, tuple[float, float]] = {
    "<モデル名>": (<input_price>, <output_price>),
}


def scrape(existing: list[ApiModel] | None = None) -> list[ApiModel]:
    """<Provider名> の価格をスクレイピングして ApiModel リストを返す。"""
    # 1. 既存値をフォールバックマップに統合
    # 2. ページ取得（失敗時はフォールバック返却）
    # 3. 正規表現で価格抽出 + sanity_check
    # 4. ApiModel リスト構築
    ...
```

### Step 3: `__init__.py` にインポートを追加する

`scraper/src/scraper/providers/__init__.py` に追加:

```python
from scraper.providers.<name> import scrape as scrape_<name>
```

### Step 4: `main.py` にエントリを追加する

`scraper/src/scraper/main.py` の `_scrape_all()` 関数内、`api_models` セクションに追加:

```python
(lambda: scrape_<name>(existing_api), "<Provider名>"),
```

トップレベルの import にも追加:

```python
from scraper.providers import scrape_<name>
```

### Step 5: 型を確認する

`scraper/src/scraper/models.py` の `ApiModel` に新しいフィールドが必要か確認する。
通常は既存フィールドで十分。フィールドを追加した場合は `sync-types` スキルで TypeScript 側も同期すること。

### Step 6: テストを実行する

```bash
cd scraper && uv run pytest
```

## ApiModel の必須フィールド

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `provider` | `str` | プロバイダー名（例: "Anthropic"） |
| `name` | `str` | モデル名（例: "Claude Opus 4.6"） |
| `tag` | `str` | UIタグテキスト（例: "Flagship"） |
| `cls` | `str` | CSS クラス（例: "tag-flag"） |
| `price_in` | `float` | USD/1M input tokens |
| `price_out` | `float` | USD/1M output tokens |
| `sub_ja` | `str` | 日本語サブテキスト |
| `sub_en` | `str` | 英語サブテキスト |
| `scrape_status` | `ScrapeStatus` | "success" / "fallback" / "manual" |

## 注意事項

- 正規表現パターンは料金ページの HTML 構造に依存するため、定期的に壊れる可能性がある
- `sanity_check()` で価格の妥当性を検証し、異常値の場合はフォールバックに切り替える
- `sub_ja` / `sub_en` は必ず日英ペアで設定する（i18n 対応）
