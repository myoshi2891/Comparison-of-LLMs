---
name: sync-types
description: |
  Sync and verify type definitions between scraper/src/scraper/models.py (Pydantic)
  and web-next/types/pricing.ts (TypeScript).
  TRIGGER when the user says any of the following (Japanese or English):
  - "型を同期して" / "models.py を変更した" / "pricing.ts を更新して"
  - "スキーマが一致しているか確認して"
  - "sync types" / "type sync" / "check type parity"
  Pydantic models.py is the Single Source of Truth; TypeScript side must match.
---

# Python ↔ TypeScript 型同期スキル

## 概要

バックエンドのPydanticモデルと、フロントエンドのTypeScript型の整合性を保つ。

## 対象ファイル

1. **Python スキーマ (信頼源)**: `scraper/src/scraper/models.py`
2. **TypeScript スキーマ**: `web-next/types/pricing.ts`

## 手順

1. `scraper/src/scraper/models.py` を読み込む。
2. `web-next/types/pricing.ts` を読み込む。
3. 以下の「同期チェックリスト」に従って差分を検出する。
4. 差分があれば TypeScript 側を修正する。
5. コマンド `cd web-next && bun run build` でビルドが通ることを確認する。

## 同期チェックリスト

- **命名規則**: フィールド名は Python と TypeScript で完全一致させる（TypeScript側も `snake_case` を維持し、キャメルケースにしない）。
- **型マッピング**:
  - `str` → `string`
  - `float`, `int` → `number`
  - `bool` → `boolean`
  - `list[X]` → `X[]`
  - `X | None` → `X | null`
- **Optional の扱い**: Python の `field: X | None = None` は TypeScript では `field: X | null` とする。`field?: X`（undefined許容）にはしない。
  - *補足*: JSONのデシリアライズ時に値が `undefined` になる可能性に対処するため、フロントエンド側で入力JSONを正規化して `undefined` を `null` に変換するか、ランタイムの型マッパーで欠損フィールドに `null` をセットする処理を推奨する。
- **デフォルト値**: Python 側でデフォルト値があっても、出力される JSON には含まれるため、TypeScript 側は非 Optional（必須）として定義する。
