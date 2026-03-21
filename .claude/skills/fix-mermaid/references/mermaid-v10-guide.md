# Mermaid v10 構文エラー修正ガイド

**用途:** HTML ファイル内の Mermaid v10 ダイアグラムに構文エラーが発生した際に使用する汎用修正プロンプト。
**対象バージョン:** Mermaid v10.x（特に v10.9.5 で確認済み）

---

## 汎用修正プロンプト（他 LLM への転用テンプレート）

```text
あなたは HTML 内の Mermaid v10 ダイアグラムを修正する専門家です。

## 問題
以下の HTML ファイルで Mermaid の構文エラーが発生しています。

## Mermaid v10 の構文ルール（必須）
1. `<div class="mermaid">` 内のコンテンツは**カラム0（先頭空白なし）**で記述すること
2. 各 Mermaid ステートメントは**改行で分離**すること（1行に複数ステートメントを連結しない）
3. ノードラベル `A["text"]` の内容は**1行に収める**こと（HTML 折り返しで分断しない）
4. mindmap のみ例外: 内部の相対インデントは階層構造を表すため保持する

## よくある原因（HTML フォーマッタによる破壊）
- HTML の自動インデント（14スペース等）が Mermaid コンテンツに混入する
- 長い行が HTML フォーマッタに折り返され、ノードラベルや矢印が行分断される
- 結果として `graph TD subgraph A B end` のように1行に全ステートメントが連結される

## 修正方法
各 `<div class="mermaid">` ブロックについて:
1. 先頭の HTML インデントをすべて除去する（**例外: mindmap** — 最初の非空行が `mindmap` で始まるブロックは、内部のインデントが階層構造を表す Mermaid 構文であるため除去しない）
2. 各ステートメントを1行1つに分離する
3. HTML 折り返しで分断されたラベルを1行に結合する
4. `<div>` タグ自体のインデントは変更しない（タグ内のコンテンツのみ対象）

> **注意**: ステップ 2〜3 は mindmap ブロックにも適用する。除外するのはステップ 1 のインデント除去のみ。

## 修正対象ファイル
[ファイルパスまたはコードを貼り付け]
```

---

## ポイント解説

| 要素 | なぜ必要か |
| ------ | ----------- |
| カラム0ルールの明示 | LLM はデフォルトで「HTML インデントに合わせて揃える」と誤判断しがちなため、明示的に禁止する必要がある |
| ノードラベルは1行 | HTML フォーマッタによる折り返し結合が最も見落とされやすい箇所。分断されるとラベル文字列がステートメントとして誤解析される |
| タグ自体は変えない | `<div>` 等の HTML 構造を壊さないための制約。コンテンツのみが対象であることを明示する |
| mindmap の例外明示 | mindmap はインデントが構文上の意味（階層構造）を持つため、一律「インデント除去」すると逆に壊れる |
| sequenceDiagram の注意 | `Note over C,L1:` のようなコロン付きメッセージ構文は1ステートメント1行の原則が特に重要。行を分断すると別ステートメントとして誤解析される |

---

## ダイアグラム種別ごとの注意事項

### graph / flowchart（最頻出）

```html
<!-- ✅ 正しい -->
<div class="mermaid">
graph TD
A["ラベル"]
B["ラベル2"]
A --> B
style A fill:#1c2a1c,stroke:#3fb950
</div>

<!-- ❌ インデント混入 → Syntax Error -->
<div class="mermaid">
    graph TD
    A["ラベル"]
    A --> B
</div>
```

### sequenceDiagram

`Note over`、`participant`、メッセージ（`->>`、`-->>`）はすべて1行1ステートメント。

```html
<div class="mermaid">
sequenceDiagram
participant U as ユーザー
participant C as Claude
Note over U,C: セッション開始
U->>C: リクエスト
C-->>U: レスポンス
</div>
```

### mindmap（例外: 内部インデントを保持）

`mindmap` キーワード行はカラム0。その後の階層インデントは Mermaid 構文として必須のため除去しない。

```html
<div class="mermaid">
mindmap
  root((タイトル))
    子ノード1
      孫ノード1-1
      孫ノード1-2
    子ノード2
      孫ノード2-1
</div>
```

### block-beta（使用禁止）

Mermaid v10.9.5 では `block-beta` の `style` 指令と角括弧ラベルの組み合わせが未キャッチ例外を発生させ、**同一ページの全ダイアグラムを連鎖クラッシュ**させる。`graph TD` で代替すること。

```html
<!-- ❌ block-beta は Mermaid v10.9.5 で全体クラッシュの原因 -->
<div class="mermaid">
block-beta
  columns 1
  A["ラベル"]
  style A fill:#fff
</div>

<!-- ✅ graph TD で代替 -->
<div class="mermaid">
graph TD
A["ラベル"]
style A fill:#1c2a1c,stroke:#3fb950
</div>
```

### htmlLabels: true 環境での `<` `>` 文字

`mermaid.initialize({ flowchart: { htmlLabels: true } })` 環境では、ノードラベル内の `<` と `>` が HTML タグとして解釈される。HTML エンティティに変換すること。

| 文字 | 変換後 |
| ------ | -------- |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `>=` | `&gt;=` |

```html
<!-- ❌ htmlLabels:true 環境でエラー -->
A["< 10行"]

<!-- ✅ エンティティ化 -->
A["&lt; 10行"]
```

---

## 関連ドキュメント

- Mermaid 公式ドキュメント: <https://mermaid.js.org/intro/>
- Mermaid v10 Release Notes: <https://github.com/mermaid-js/mermaid/releases/tag/v10.0.0>
- このプロジェクトの静的 HTML ドキュメント: `claude/`, `gemini/`, `codex/`, `copilot/` 各ディレクトリ
