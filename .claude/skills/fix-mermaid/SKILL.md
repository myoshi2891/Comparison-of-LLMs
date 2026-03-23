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

## 実地検証済み：ブラウザレンダラー固有の問題（2026年3月）

静的パーサー `@mermaid-js/parser` ではエラーにならないが、ブラウザの Mermaid v10.9.5 レンダラーで `Syntax error in text` が発生するパターン。

### IDEフォーマッター（Prettier）による破壊が根本原因

`<div class="mermaid">` に Mermaid ソースを直接書くと、VSCode/Prettier が保存のたびにインデントを付加して構文を壊す。**恒久対策は JS テンプレートリテラルへの移管**。

```html
<!-- ❌ Prettierが保存時にインデントを付加して破壊する -->
<div class="mermaid">
graph LR
A --> B
</div>

<!-- ✅ JSテンプレートリテラル方式（IDEが一切触れない） -->
<div id="diag-0"></div>
<script>
const DIAGRAMS = {
  'diag-0': `graph LR
A --> B`,
};
mermaid.initialize({ startOnLoad: false });
(async () => {
  for (const [id, src] of Object.entries(DIAGRAMS)) {
    const { svg } = await mermaid.render('svg-' + id, src);
    document.getElementById(id).innerHTML = svg;
  }
})();
</script>
```

この方式では `-->` を `--&gt;` にエスケープする必要もなくなる。

### ブラウザレンダラーで Syntax Error を起こす文字・構文

| 箇所 | 問題のある記述 | 対処 |
| ------ | --------------- | ------ |
| `subgraph` ラベル | 丸括弧 `()` を含む | 削除または別表現に置換 |
| `subgraph` ラベル | 絵文字（`🌐` `🖥️` 等） | 削除 |
| `participant ... as` | 絵文字（`👤` `⚡` 等） | 削除 |
| エッジラベル `\|...\|` | 先頭スラッシュ `\|/command\|` | スラッシュを除去 |
| ノードラベル `["..."]` | 全角波ダッシュ `〜` | `から` 等の日本語に置換 |
| ノードラベル `["..."]` | スラッシュ `path/to` | `-` またはスペースに置換 |
| 菱形ノード `{}` | クォートなし日本語 `{新しいファイル}` | `{"新しいファイル"}` とクォートする |

### SVG サイズ制御

Mermaid v10 は SVG 要素に絶対ピクセル値の `width`/`height` 属性を付与する。`mermaid.render()` 後に必ず除去する。

```js
svgEl.removeAttribute('width');
svgEl.removeAttribute('height');
svgEl.style.width    = 'auto';     // 'auto' 必須。'100%' は NG（拡大されて縦長になる）
svgEl.style.maxWidth = '100%';
svgEl.style.height   = 'auto';
```

CSS にもフォールバックを追加する：

```css
.mermaid-wrap svg {
  width: auto !important;
  max-width: 100% !important;
  height: auto !important;
}
```

### Mermaid を諦めて HTML/CSS に置き換えるべきケース

以下は CSS では対処不能なため、**純粋な HTML/CSS ウィジェットに置き換える**：

- `flowchart TD` で 5〜6 ノードを直列チェーン → 縦長 900px 超
- 接続されていない複数のサブグラフ（ノード数が非対称なためアスペクト比が崩れる）

判断基準：「ノード増減に関わらず、他の図と同じ高さに収まる保証がない場合」
