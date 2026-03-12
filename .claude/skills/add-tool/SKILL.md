---
name: add-tool
description: >
  pricing.json に新しいコーディングツール（サブスクリプション型）のスクレイパーを追加する。
  「ツール追加」「新しいコーディングツールを追加」「○○ の料金を追加して」
  「IDE の料金を取得したい」「サブスクツールを増やして」と言われたときに使用する。
  tools/ ディレクトリに新しいモジュールを作成し、main.py に登録する手順を提供する。
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# 新規コーディングツール追加スキル

## 前提知識

コーディングツールは API プロバイダーと異なり、`SubTool` モデルを使用する。
サブスクリプション型の月額/年額料金を管理する。

## 手順

### Step 1: テンプレートを確認する

既存ツールの実装を参照する:

```text
scraper/src/scraper/tools/cursor.py  ← 推奨テンプレート
```

必要な要素:

- `_URL`: スクレイピング対象の料金ページ URL
- `_FALLBACKS`: `list[tuple[str, str, float, float | None, str, str, str, str]]`
  - 順序: (group, name, monthly, annual, tag, cls, note_ja, note_en)
- `scrape(existing)` 関数: `list[SubTool]` を返す
- `_build_fallback()` ヘルパー: フォールバックリストから SubTool リストを構築

### Step 2: ツールファイルを作成する

`scraper/src/scraper/tools/<name>.py` を作成する。

```python
"""<Tool名> 料金スクレイパー。

対象: <URL>
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text, extract_price, sanity_check
from scraper.models import SubTool

logger = logging.getLogger(__name__)

_URL = "<料金ページURL>"

_FALLBACKS: list[tuple[str, str, float, float | None, str, str, str, str]] = [
    ("<Group>", "<Plan名>", <月額>, <年額 or None>, "<tag>", "<cls>",
     "<日本語メモ>", "<英語メモ>"),
]


def scrape(existing: list[SubTool] | None = None) -> list[SubTool]:
    """<Tool名> の料金をスクレイピングして SubTool リストを返す。"""
    # 1. ページ取得（失敗時はフォールバック返却）
    # 2. プランごとに正規表現で価格抽出 + sanity_check
    # 3. SubTool リスト構築
    ...


def _build_fallback() -> list[SubTool]:
    """フォールバック値から SubTool リストを構築する。"""
    return [
        SubTool(
            group=g, name=n, monthly=m, annual=a,
            tag=t, cls=c, note_ja=nj, note_en=ne,
            scrape_status="fallback",
        )
        for g, n, m, a, t, c, nj, ne in _FALLBACKS
    ]
```

### Step 3: `__init__.py` にインポートを追加する

`scraper/src/scraper/tools/__init__.py` に追加:

```python
from scraper.tools.<name> import scrape as scrape_<name>
```

### Step 4: `main.py` にエントリを追加する

`scraper/src/scraper/main.py` の `_scrape_all()` 関数内、`sub_tools` セクションに追加:

```python
(lambda: scrape_<name>(existing_tools), "<Tool名>"),
```

トップレベルの import にも追加:

```python
from scraper.tools import scrape_<name>
```

### Step 5: 型を確認する

`scraper/src/scraper/models.py` の `SubTool` に新しいフィールドが必要か確認する。
通常は既存フィールドで十分。フィールドを追加した場合は `sync-types` スキルで TypeScript 側も同期すること。

### Step 6: テストを実行する

```bash
cd scraper && uv run pytest
```

## SubTool の必須フィールド

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `group` | `str` | グループ名（例: "Cursor"） |
| `name` | `str` | プラン名（例: "Pro"） |
| `monthly` | `float` | 月額料金 (USD) |
| `annual` | `float \| None` | 年払い月換算 (USD)。None = 年払いなし |
| `tag` | `str` | UIタグテキスト（例: "Individual"） |
| `cls` | `str` | CSS クラス（例: "tag-bal"） |
| `note_ja` | `str` | 日本語メモ |
| `note_en` | `str` | 英語メモ |
| `scrape_status` | `ScrapeStatus` | "success" / "fallback" / "manual" |

## tag/cls の使い分け

| cls | 意味 | 使用例 |
| --- | --- | --- |
| `tag-mini` | 無料/最小プラン | Free, Hobby |
| `tag-bal` | 標準プラン | Pro, Individual |
| `tag-flag` | 最上位プラン | Ultra, Enterprise |

## 注意事項

- `note_ja` / `note_en` は必ず日英ペアで設定する（i18n 対応）
- 年払い価格は**月換算**で記録する（例: $192/年 → $16/月）
- 無料プランは `monthly: 0`, `annual: 0` とする
