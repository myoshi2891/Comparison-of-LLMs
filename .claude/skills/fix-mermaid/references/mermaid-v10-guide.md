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

## 修正方法
各 `<div class="mermaid">` ブロックについて:
1. 先頭の HTML インデントをすべて除去する（mindmap は例外）
2. 各ステートメントを1行1つに分離する
3. HTML 折り返しで分断されたラベルを1行に結合する
4. `<div>` タグ自体のインデントは変更しない（タグ内のコンテンツのみ対象）

## 修正対象ファイル
[ファイルパスまたはコードを貼り付け]
```

---

## ポイント解説

| 要素 | なぜ必要か |
| ------ | ----------- |
| カラム0ルールの明示 | LLM はデフォルトで「HTML インデントに合わせて揃える」と誤判断しがちなため、明示的に禁止する必要がある |
| ノードラベルは1行 | HTML フォーマッタによる折り返し結合が最も見落とされやすい箇所 |
| タグ自体は変えない | `<div>` 等の HTML 構造を壊さないための制約。コンテンツのみが対象であることを明示する |
| mindmap の例外明示 | mindmap はインデントが構文上の意味（階層構造）を持つため、一律「インデント除去」すると逆に壊れる |
| sequenceDiagram の注意 | `Note over C,L1:` のようなコロン付きメッセージ構文は1ステートメント1行の原則が特に重要 |

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
    子ノード2
      孫ノード2-1
</div>
```

### block-beta（使用禁止）

Mermaid v10.9.5 では `block-beta` の `style` 指令と角括弧ラベルの組み合わせが未キャッチ例外を発生させ、**同一ページの全ダイアグラムを連鎖クラッシュ**させる。`graph TD` で代替すること。

### htmlLabels: true 環境での `<` `>` 文字

`mermaid.initialize({ flowchart: { htmlLabels: true } })` 環境では、ノードラベル内の `<` と `>` が HTML タグとして解釈される。HTML エンティティに変換すること。

| 文字 | 変換後 |
| ------ | -------- |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `>=` | `&gt;=` |

---

## JSテンプレートリテラル完全実装例（SKILL.md Part 3 詳細）

`<div class="mermaid">` に直接書くと VSCode/Prettier が保存のたびにインデントを付加して構文を壊す。
**恒久対策は JS テンプレートリテラルへの移管**。

```html
<!-- ✅ JSテンプレートリテラル方式（IDEが一切触れない） -->
<div id="diag-0"></div>
<div id="diag-1"></div>
<script>
const DIAGRAMS = {
  'diag-0': `graph LR
A --> B`,
  'diag-1': `sequenceDiagram
participant U as ユーザー
U->>C: リクエスト`,
};
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  flowchart: { useMaxWidth: false, htmlLabels: true },
  sequence: { useMaxWidth: false, mirrorActors: true, noteMargin: 10 },
  mindmap:  { useMaxWidth: false },
});
(async () => {
  if (document.fonts) await document.fonts.ready; // ← 必須: フォントロード完了を待つ
  for (const [id, src] of Object.entries(DIAGRAMS)) {
    const { svg } = await mermaid.render('svg-' + id, src);
    document.getElementById(id).innerHTML = svg;
    const svgEl = document.getElementById(id).querySelector('svg');
    if (svgEl) {
      svgEl.removeAttribute('width');
      svgEl.removeAttribute('height');
      svgEl.style.display  = 'block';
      svgEl.style.width    = 'auto';
      svgEl.style.maxWidth = '100%';
      svgEl.style.height   = 'auto';
      svgEl.style.margin   = '0 auto';
      svgEl.style.overflow = 'visible';
    }
  }
})();
</script>
```

この方式では `-->` を `--&gt;` にエスケープする必要もなくなる。

---

## applyMindmapStyle 関数（SKILL.md Part 2-4 完全実装）

マインドマップのダークモード配色は CSS だけでは対処不能。以下の JS 関数でレンダリング後に直接 DOM を操作する。

```js
function applyMindmapStyle(svgEl) {
  // ノード背景形状のinline fillをJSで直接上書き
  const shapes = svgEl.querySelectorAll(
    'g.mindmap-node > rect, g.mindmap-node > circle, '
    + 'g.mindmap-node > ellipse, g.mindmap-node > polygon, g.mindmap-node > path'
  );
  shapes.forEach(shape => {
    shape.style.setProperty('fill', '#1e293b', 'important');
    shape.style.setProperty('stroke', '#475569', 'important');
    shape.style.setProperty('stroke-width', '1.5px', 'important');
  });

  // ルートノード（最初の circle/ellipse）を青グローで強調
  const rootShape = svgEl.querySelector('g.mindmap-node > circle, g.mindmap-node > ellipse');
  if (rootShape) {
    rootShape.style.setProperty('fill', 'rgba(0,112,243,0.2)', 'important');
    rootShape.style.setProperty('stroke', '#0070f3', 'important');
    rootShape.style.setProperty('stroke-width', '2.5px', 'important');
    rootShape.style.setProperty('filter', 'drop-shadow(0 0 10px rgba(0,112,243,0.5))', 'important');
  }

  // SVG text要素
  svgEl.querySelectorAll('g.mindmap-node text').forEach(t => {
    t.style.setProperty('fill', '#e2e8f0', 'important');
  });

  // foreignObject内のHTML要素（headのCSSが届かない場合の保険）
  svgEl.querySelectorAll('g.mindmap-node foreignObject').forEach(fo => {
    try {
      fo.querySelectorAll('*').forEach(child => {
        child.style.setProperty('color', '#e2e8f0', 'important');
      });
    } catch (e) { /* ignore */ }
  });

  // エッジ色
  svgEl.querySelectorAll('path').forEach(p => {
    if (p.getAttribute('fill') === 'none'
        || p.classList.contains('mindmap-edge')
        || p.classList.contains('edge')) {
      p.style.setProperty('stroke', '#4b5563', 'important');
    }
  });

  // requestAnimationFrame後に再適用（Mermaidが非同期でスタイル上書きする場合の保険）
  requestAnimationFrame(() => {
    svgEl.querySelectorAll('g.mindmap-node foreignObject').forEach(fo => {
      try {
        fo.querySelectorAll('*').forEach(child => {
          child.style.setProperty('color', '#e2e8f0', 'important');
        });
      } catch (e) { /* ignore */ }
    });
  });
}

// 呼び出し方（render loop内で）
const MINDMAP_IDS = ['diag-cli', 'diag-best-practices'];
if (MINDMAP_IDS.includes(id)) {
  applyMindmapStyle(svgEl);
}
```

---

## stateDiagram-v2 個別制限 CSS（SKILL.md Part 4 詳細）

`stateDiagram-v2` はノード数が少ない（3〜5 状態程度）場合、Mermaid が広い `viewBox` を生成するため
SVG を自然サイズで表示すると文字が巨大化する。**グローバルな `max-height` で全 SVG を一律制限してはならない**。
問題のある図解 ID だけをピンポイントで制限する。

```css
/*
 * ✅ 正解: 問題のある図解 ID だけを個別制限する
 * stateDiagram-v2 でノード数が少ない図解だけに適用。
 */
:global(#diag-3 svg) {
  max-height: 260px !important;
  height: auto !important;
  width: auto !important;
  display: block;
  margin: 0 auto;
}

:global(#diag-5 svg) {
  max-height: 300px !important;
  height: auto !important;
  width: auto !important;
  display: block;
  margin: 0 auto;
}
```

> **手順**: 全図解をブラウザで目視確認し、巨大化している図の ID（`id` prop）を特定 →
> その ID だけに `:global(#diag-N svg)` で `max-height` を設定 →
> 高さが適切になるまで数値を微調整する。

---

## 関連ドキュメント

- Mermaid 公式ドキュメント: <https://mermaid.js.org/intro/>
- Mermaid v10 Release Notes: <https://github.com/mermaid-js/mermaid/releases/tag/v10.0.0>
- このプロジェクトの静的 HTML ドキュメント: `claude/`, `gemini/`, `codex/`, `copilot/` 各ディレクトリ
