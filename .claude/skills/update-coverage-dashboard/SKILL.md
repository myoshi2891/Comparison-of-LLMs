---
name: update-coverage-dashboard
description: >
  Synchronize the test coverage progress tracker and regenerate the visual dashboard.
  TRIGGER when the user says any of the following (Japanese or English):
  - "カバレッジダッシュボードを更新" / "update coverage dashboard"
  - "テストを追加した" / "added a test" / "added tests"
  - "テストファイルを追加した" / "added test file"
  - "カバレッジ進捗を同期" / "sync coverage progress"
  - "カバレッジを更新して" / "refresh the coverage"
  - "ダッシュボードを再生成" / "regenerate dashboard"
  - "/update-coverage-dashboard"
  The skill performs a real file scan (no guessing), updates
  docs/TEST_COVERAGE_PROGRESS.md as the source of truth, then
  reflects all changes into the CELLS data block inside
  docs/coverage-dashboard.html.
allowed-tools:
  - Bash
  - Read
  - Edit
---

# テストカバレッジダッシュボード更新スキル

## 概要

このスキルはテスト追加・削除のたびに以下の 2 ファイルを同期します。

| ファイル | 役割 |
|---|---|
| `docs/TEST_COVERAGE_PROGRESS.md` | 信頼源（source of truth）。手動でも更新可能 |
| `docs/coverage-dashboard.html` | 可視化 HTML。JS の `var CELLS` ブロックを更新 |

**禁止**: 推測・補完によるデータ入力。スキャンで確認できた事実のみ記録する。

---

## Step 1: テストファイルの実測スキャン

### 1-1. web-next のファイルとケース数を取得

```bash
cd web-next
find . -name "*.test.*" -not -path "*/node_modules/*" | sort
```

続いて各ファイルのケース数を集計する（`it(` / `test(` の行数カウント）:

```bash
for f in $(find . -name "*.test.*" -not -path "*/node_modules/*" | sort); do
  count=$(grep -cE "^\s*(it|test)\(" "$f" 2>/dev/null || echo 0)
  echo "$count $f"
done | sort -rn
```

### 1-2. scraper のファイルとケース数を取得

```bash
cd scraper
find tests -name "*.py" -not -name "__init__.py" | sort
for f in $(find tests -name "*.py" -not -name "__init__.py"); do
  count=$(grep -cE "^    def test_" "$f" 2>/dev/null || echo 0)
  echo "$count $f"
done
```

---

## Step 2: 変更の検出と TEST_COVERAGE_PROGRESS.md の更新

1. `docs/TEST_COVERAGE_PROGRESS.md` の各セル詳細セクション（`### Category / Domain`）を確認する
2. Step 1 の実測値と比較して、変化したセルを特定する
3. **変化があったセルのみ** Edit ツールで更新する

### 更新対象フィールド

各セクションの `files:` リスト（ファイル名とケース数）と `count:` 値、`status:` を更新する。

#### ステータス判定基準（変更がある場合のみ再判定する）

| 状況 | status |
|---|---|
| 対象ドメインの全ファイルに実ケースが存在し CI で実行される | `done` |
| テストはあるが網羅が不十分（mock のみ・スキップあり・部分的） | `partial` |
| テストファイルが 1 件も存在しない | `missing` |
| テスト対象の概念がないドメイン | `na` |

### メタデータも更新する

ファイル数・ケース数・最終スキャン日・スコアが変わった場合:

```markdown
## メタデータ の該当行を更新
| 最終スキャン日 | YYYY-MM-DD |
| web-next テストファイル数 | N |
| web-next テストケース数 | ≈ N |
...
| 総合カバレッジスコア (weighted) | XX.X% |
```

### スコア再計算式

対象セル数（N/A 除く）を分母とし、`done=1.0` `partial=0.5` `missing=0.0` で合計 ÷ 対象セル数 × 100%。

現行のセル構成（8 × 8 = 64 セル）からの N/A 数は `TEST_COVERAGE_PROGRESS.md` のマトリクス表で確認する。

### 更新履歴に追記する

```markdown
## 更新履歴

| 日付 | 変更内容 | スコア |
|---|---|---|
| YYYY-MM-DD | <追加したテストの概要> | XX.X% |
```

---

## Step 3: coverage-dashboard.html の CELLS ブロックを更新

`docs/coverage-dashboard.html` 内の `var CELLS = { ... }` ブロックを確認し、
TEST_COVERAGE_PROGRESS.md と食い違っているセルのみ Edit で更新する。

### セルの特定方法

HTML 内の CELLS は `unit:`, `integration:`, ... などカテゴリーキーで始まるオブジェクト。
各カテゴリー内のドメインキー（`app:`, `components:`, ...）を以下のパターンで探す:

- `status: done` → `s:"done"`
- `status: partial` → `s:"partial"`
- `status: missing` → `s:"missing"`
- `count` 値（`count: N` → `count:N`）
- `files` リスト（配列内の文字列）
- `note` 文字列

### CELLS エントリのフォーマット（参考）

```javascript
    app: { s:"done", count:113, files:["ファイル名 (N)", ...], note:"説明テキスト" },
```

### メタデータカード（Hero セクション）の更新

以下の 4 つの `.stat-val` 要素の `textContent` 相当値を更新する（実測値が変わった場合のみ）:

| 対象 | HTML 内の識別箇所 |
|---|---|
| web-next テストファイル数 | `41` のある `.stat-val` → 実測値に変更 |
| web-next テストケース数 | `≈ 491` → `≈ N` |
| scraper ファイル/ケース | `2 / 5` → `N / N` |

### スコアバー（`score-number`）の更新

`<span id="scoreVal">31</span>` の整数部分と `<sup>.4 %</sup>` の小数部分を更新する。
`style="--missing-w: 53.5; --partial-w: 15.1;"` のプロポーションも再計算する:

```
missing-w = (missing セル数 / 対象セル数) × 100
partial-w = (partial セル数 / 対象セル数) × 100
(done 部分は 残り = 100 - missing-w - partial-w)
```

---

## Step 4: 最終確認

更新後に以下を口頭で報告する（ファイルを再読み込みしない）:

1. スキャンで変化を検出したセルの一覧（カテゴリー/ドメイン）
2. 更新後のスコア（前回 → 今回）
3. `docs/TEST_COVERAGE_PROGRESS.md` と `docs/coverage-dashboard.html` の更新完了宣言

---

## 注意事項

- **スキャン結果のみを記録する**。テストが存在しないのに `done` にしない
- **N/A セルは変更しない**（テスト対象の概念がないドメインは N/A のまま）
- **ケース数 `null`** は「件数計測が意味をなさないセル」（a11y 等）。実ケース数が出ても `null` のまま維 持する
- HTML の JS ブロック内は **`var` 宣言の `CELLS` オブジェクト** のみ対象。CSS・HTML 構造・`ROWS`・`COLS` 定数は変更しない
- 複数セルが変わった場合でも、**1 セルずつ順番に Edit** する（一括置換は重複文字列衝突リスクがある）
- `docs/TEST_COVERAGE_PROGRESS.md` の `## 更新履歴` テーブルへの追記を忘れない
