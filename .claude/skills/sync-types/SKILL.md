---
name: sync-types
description: >
  scraper/src/scraper/models.py (Pydantic) と web/src/types/pricing.ts (TypeScript) の
  型定義を同期・検証する。「型を同期」「models.py を変更した」「pricing.ts を更新」
  「スキーマが一致しているか確認」「型チェック」「型の整合性」と言われたときに使用する。
  Python 側が信頼源（Single Source of Truth）であり、TypeScript 側を合わせる。
allowed-tools:
  - Read
  - Edit
  - Grep
---

# Python ↔ TypeScript 型同期スキル

## 信頼源

**Python (`scraper/src/scraper/models.py`)** が Single Source of Truth。
差分がある場合は TypeScript 側を Python に合わせる。

## 対象ファイル

| 役割 | ファイル |
| --- | --- |
| Python スキーマ | `scraper/src/scraper/models.py` |
| TypeScript スキーマ | `web/src/types/pricing.ts` |

## 同期チェックリスト

### 1. ScrapeStatus の一致

```code
Python:     ScrapeStatus = Literal["success", "fallback", "manual"]
TypeScript: type ScrapeStatus = 'success' | 'fallback' | 'manual'
```

値セットが完全一致していることを確認する。

### 2. ApiModel の全フィールド一致

以下の型マッピングに従って一致を確認する:

| Python 型 | TypeScript 型 |
| --- | --- |
| `str` | `string` |
| `float` | `number` |
| `int` | `number` |
| `bool` | `boolean` |
| `X \| None` | `X \| null` |
| `list[X]` | `X[]` |
| `Literal[...]` | ユニオン型 |

フィールド名は Python と TypeScript で**完全一致**すること（snake_case のまま）。

### 3. SubTool の全フィールド一致

ApiModel と同様にチェックする。特に `annual: float | None` → `annual: number | null` の nullable 型に注意。

### 4. PricingData の全フィールド一致

トップレベルの構造体も同期する:

- `generated_at`, `jpy_rate`, `jpy_rate_date`
- `api_models: list[ApiModel]` → `api_models: ApiModel[]`
- `sub_tools: list[SubTool]` → `sub_tools: SubTool[]`

### 5. コメントの日英整合性

TypeScript ファイルのコメントが Python 側のドキュメントと矛盾していないか確認する。

## 手順

1. `scraper/src/scraper/models.py` を読む
2. `web/src/types/pricing.ts` を読む
3. 上記チェックリストに従って差分を検出する
4. 差分があれば TypeScript 側を修正する
5. `cd web && bun run build` でビルドが通ることを確認する

## よくある差分パターン

### フィールド追加忘れ

Python にフィールドを追加した後、TypeScript 側の interface に追加し忘れるケース。

### Optional フィールドのずれ

Python の `field: X | None = None` は TypeScript では `field: X | null` になる。
`field?: X`（undefined許容）ではない点に注意。

### デフォルト値の非対称

Python 側でデフォルト値が設定されていても、TypeScript の interface にはデフォルト値の概念がない。
JSON にはデフォルト値が含まれて出力されるため、TypeScript 側は非 Optional として定義する。

## 注意事項

- フィールド名は snake_case を維持する（camelCase に変換しない）
- `Field(ge=0)` 等の Pydantic バリデータは TypeScript 側では表現しない
- export されている型が他のコンポーネントで使われているため、型名の変更は慎重に行う
