---
name: fix-mermaid
description: >
  Use this skill to fix Mermaid diagram syntax errors inside HTML files.
  Trigger when the user mentions: "mermaid error", "Syntax error in text",
  "mermaid not rendering", "diagram is broken", "all diagrams crashed",
  or references a Mermaid version error (e.g. "mermaid version 10.9.5").
  Fixes HTML formatter-induced indentation pollution and statement concatenation
  that break Mermaid v10 parsing.
allowed-tools:
  - Read
  - Edit
  - Grep
  - Bash
---

# Mermaid v10 構文修正スキル

## 対象

`<div class="mermaid">` ブロック内の構文エラー。

## Mermaid v10 の必須ルール

1. コンテンツは**カラム0配置**（先頭空白なし）
2. 各ステートメントは**改行で分離**（1行に複数連結しない）
3. ノードラベル `A["text"]` の内容は**1行に収める**
4. `mindmap` のみ例外 — 内部インデントは階層構造を表すため保持する
5. `block-beta` は**使用禁止** — v10.9.5 で全体クラッシュの原因になる。`graph TD` で代替する

## よくある原因

HTMLフォーマッタによる破壊パターン:

- 14スペース等のHTMLインデントがMermaidコンテンツに混入する
- 長いノードラベルが行分断される（`A["テキスト` と `続き"]` に分かれる）
- 複数ステートメントが1行に連結される（`graph TD A["x"] B["y"] A --> B`）

## 修正手順

1. `Grep` で `<div class="mermaid">` を全検索してブロック数を把握する
2. 各ブロックを `Read` で確認し、上記ルール違反を特定する
3. `Edit` で各ブロックの内容を修正する
   - `<div>` タグ自体のインデントは変更しない
   - タグ内のMermaidコンテンツのみを置換対象にする

自動修正が必要な場合は `scripts/fix_mermaid.py` を使用する:

```bash
python3 .claude/skills/fix-mermaid/scripts/fix_mermaid.py path/to/file.html
```

## 変換例

**Before（壊れた状態）:**

```html
<div class="mermaid">
  graph LR A["ノードA"] B["ノードB"] A --> B
  style A fill:#fff
</div>
```

**After（修正後）:**

```html
<div class="mermaid">
graph LR
A["ノードA"]
B["ノードB"]
A --> B
style A fill:#fff
</div>
```

## ダイアグラム別の注意点

詳細は `references/mermaid-v10-guide.md` を参照。要点のみ:

| 種別 | 注意点 |
| ------ | -------- |
| `graph` / `flowchart` | 最頻出。カラム0ルールを厳守 |
| `sequenceDiagram` | `Note over A,B:` は1行に収める |
| `mindmap` | 内部インデント保持（唯一の例外） |
| `block-beta` | **使用禁止**（全体クラッシュ） |
| `htmlLabels: true` 環境 | `<` → `&lt;`、`>` → `&gt;` に変換 |
