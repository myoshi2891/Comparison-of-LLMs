---
name: fix-mermaid
description: >
  Use this skill to fix Mermaid diagram syntax errors, rendering issues,
  and dark-mode styling problems inside HTML files.
  Trigger when the user mentions: "mermaid error", "Syntax error in text",
  "mermaid not rendering", "diagram is broken", "all diagrams crashed",
  "文字が読めない", "はみ出している", "図が醜い", "ダークモードで見にくい",
  "シーケンス図が切れている", "マインドマップの色がおかしい",
  or references a Mermaid version error (e.g. "mermaid version 10.9.5").
  Covers: syntax fixes, SVG sizing, dark-mode coloring (mindmap/sequence),
  foreignObject CSS limitations, and font-loading timing.
---

# Mermaid v10 修正・スタイリングスキル

Updated: 2026-07-23

## 対象

- `<div class="mermaid">` ブロック / JS テンプレートリテラル方式の構文エラー
- ダークモードでの配色崩れ（マインドマップ・シーケンス図）
- SVGサイズ・クリッピング問題

---

## Part 1: 構文修正

### Mermaid v10 の必須ルール

1. コンテンツは**カラム0配置**（先頭空白なし）
2. 各ステートメントは**改行で分離**（1行に複数連結しない）
3. ノードラベル `A["text"]` の内容は**1行に収める**
4. `mindmap` のみ例外 — 内部インデントは階層構造を表すため保持する
5. `block-beta` は**使用禁止** — v10.9.5 で全体クラッシュの原因になる。`graph TD` で代替する

### よくある原因（HTMLフォーマッタによる破壊）

- 14スペース等のHTMLインデントがMermaidコンテンツに混入する
- 長いノードラベルが行分断される（`A["テキスト` と `続き"]` に分かれる）
- 複数ステートメントが1行に連結される（`graph TD A["x"] B["y"] A --> B`）

### 修正手順

1. `grep_search` で `<div class="mermaid">` を全検索してブロック数を把握する
2. 各ブロックを `view_file` で確認し、上記ルール違反を特定する
3. `replace_file_content` / `multi_replace_file_content` で各ブロックの内容を修正する
   - `<div>` タグ自体のインデントは変更しない
   - タグ内のMermaidコンテンツのみを置換対象にする

### ダイアグラム別の注意点

| 種別 | 注意点 |
| ------ | -------- |
| `graph` / `flowchart` | 最頻出。カラム0ルールを厳守 |
| `sequenceDiagram` | `Note over A,B:` は1行に収める |
| `mindmap` | 内部インデント保持（唯一の例外） |
| `block-beta` | **使用禁止**（全体クラッシュ） |
| `htmlLabels: true` 環境 | `<` → `&lt;`、`>` → `&gt;` に変換 |

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

---

## Part 2: ダークモード配色・スタイリング（2026年6月追記）

> **重要:** HTMLでMermaidをダークモードで使う場合、マインドマップ・シーケンス図には固有の落とし穴がある。
> CSS セレクタだけで対処しようとすると失敗する。以下の手順に従うこと。

### 2-1: JSテンプレートリテラル方式（必須の前提）

`<div class="mermaid">` に直接書くと IDEフォーマッタが破壊する。**必ずJSテンプレートリテラル方式を使う**。

```html
<!-- ✅ JSテンプレートリテラル方式 -->
<div id="diag-cli"></div>
<script>
const DIAGRAMS = {
  'diag-cli': `mindmap
  root((sandbox CLI))
    サンドボックス管理
      list - ls`,
};
mermaid.initialize({ startOnLoad: false, theme: 'dark', ... });
(async () => {
  if (document.fonts) await document.fonts.ready; // ← フォントロード完了を待つ（重要！）
  for (const [id, src] of Object.entries(DIAGRAMS)) {
    const { svg } = await mermaid.render('svg-' + id, src);
    document.getElementById(id).innerHTML = svg;
    // SVGサイズ・スタイル後処理をここで行う
  }
})();
</script>
```

> **⚠️ フォントロード待ちが必須**: `await document.fonts.ready` を省略すると、
> Webフォント（Inter等）のロード前にMermaidが文字幅を計算するため、
> **ノード幅が狭くなり文字がはみ出す**。必ず追加すること。

### 2-2: mermaid.initialize の themeVariables 設定

ダークモードの基本設定に加え、**マインドマップ専用の `cScale0〜11`** を必ず設定する。
これを省略するとMermaidデフォルトの原色（赤・緑・紫）が使われ、ダークモードで非常に醜くなる。

```js
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  fontFamily: "'Inter', system-ui, sans-serif",
  themeVariables: {
    background: '#0a0a0a',
    primaryColor: '#1e3a5f',
    primaryTextColor: '#93c5fd',
    primaryBorderColor: '#3b82f6',
    lineColor: '#374151',
    actorBkg: '#1e3a5f',
    actorBorder: '#3b82f6',
    actorTextColor: '#93c5fd',
    actorLineColor: '#374151',
    noteBkgColor: '#2d1b4e',
    noteTextColor: '#d8b4fe',
    /* ★ マインドマップ枝カラー: これを設定しないと原色になる */
    cScale0: '#1e3a5f', cScale1: '#111827', cScale2: '#1a1a2e',
    cScale3: '#1e2a3a', cScale4: '#121825', cScale5: '#111111',
    cScale6: '#1a1f2e', cScale7: '#0f1923', cScale8: '#1e3a5f',
    cScale9: '#111827', cScale10: '#1a1a2e', cScale11: '#1e2a3a',
  },
  flowchart: { curve: 'basis', padding: 20 },
  /* ★ シーケンス図: mirrorActors:true で上下両方にアクターボックスを表示 */
  sequence: { mirrorActors: true, noteMargin: 10, useMaxWidth: false },
});
```

### 2-3: SVGサイズ後処理（レンダリング後に必ず実行）

> **☠️☠️ 最大の落とし穴： `useMaxWidth: true` は「図を強制で全幅に引き伸ばす」**
>
> `mermaid.initialize({ flowchart: { useMaxWidth: true } })` は、
> Mermaid が SVG を生成する際に `max-width: 100%` を **inline style** で強制的に割り当てる。
> これが `width: 100%` のコンテナの中に入ると、菱形ノードやシーケンス図が画面全幅に拡大する。
>
> **正解は `useMaxWidth: false` を設定し、分類は CSS 側で行う。**

```js
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  // ✅ すべて false —— Mermaidに SVGサイズを営ませない
  flowchart: { useMaxWidth: false, htmlLabels: true },
  sequence: { useMaxWidth: false, mirrorActors: true, noteMargin: 10 },
  mindmap:  { useMaxWidth: false },
  // ❌ NG: useMaxWidth: true  ← コンテナ全幅に引き伸ばされて巨大化する
});
```

```js
// SVG 後処理：実寸を維持しつつコンテナ幅で上限
const svgEl = el.querySelector('svg');
if (svgEl) {
  svgEl.removeAttribute('width');
  svgEl.removeAttribute('height');
  svgEl.style.display  = 'block';
  svgEl.style.width    = 'auto';    // ✅ 実寸維持
  svgEl.style.maxWidth = '100%';    // ✅ コンテナ幅を超えない
  svgEl.style.height   = 'auto';    // ✅ 縦横比を保つ
  svgEl.style.margin   = '0 auto';  // ✅ 中央寄せ
  svgEl.style.overflow = 'visible'; // ✅ シーケンス図下部切れ防止
}
```

> **⚠️ `max-width: N px` の種別別制限はやらない**
>
> TDフローチャートに `max-width: 560px` を設定すると、
> 横方向にノードが広がる図（多岐分岐フロー等）は逆に小さくなって文字が読めなくなる。
> Mermaidの SVG 実寸はノード内容と横幅に依存し、一恙に制限できない。
> **種別の `max-width` 制限はおこなわない**。コンテナ幅の CSS 上限 (`max-width: 100%`) のみで十分。

CSSにもフォールバックを追加:

```css
.mermaid-wrap .mermaid {
  display: block;
  width: fit-content; /* ✅ SVG実寸に任せる（巨大化しない） */
  max-width: 100%;    /* ✅ コンテナ幅を超えない */
  margin: 0 auto;     /* ✅ 中央寄せ */
  /* ❌ NG: width: 100%  ← 巨大化の原因になる */
}
.mermaid-wrap .mermaid svg {
  display: block;
  width: auto;     /* ✅ */
  max-width: 100%; /* ✅ */
  height: auto;
  overflow: visible;
}
```

### 2-4: マインドマップ ダークモード配色の落とし穴と対処法

**❌ 以下の方法は機能しない（よくある間違い）:**

```css
/* NG: .depth-0 などのクラスはMermaid v10 mindmapでは生成されない */
.mermaid svg .mindmap-node.depth-0 rect { fill: blue !important; }

/* NG: SVG内<style>はforeignObject内のHTMLに cascade しない */
/* SVG内に<style>を注入してもforeignObject内のdiv/spanの色は変わらない */
```

**✅ 正しい対処法（3段構え）:**

#### ① ドキュメントhead CSSでforeignObject内HTMLをターゲット

```css
/* SVG内<style>ではforeignObject内HTMLに届かないため、headのCSSで直接指定する */
#diag-cli foreignObject div,
#diag-cli foreignObject span,
#diag-cli foreignObject p,
#diag-best-practices foreignObject div,
#diag-best-practices foreignObject span,
#diag-best-practices foreignObject p {
  color: #e2e8f0 !important;
  -webkit-text-fill-color: #e2e8f0 !important;
}
```

#### ② JS直接操作でノード背景のインラインstyleを上書き

```js
function applyMindmapStyle(svgEl) {
  // ノード背景形状のinline fillをJSで直接上書き
  const shapes = svgEl.querySelectorAll(
    'g.mindmap-node > rect, g.mindmap-node > circle, '
    + 'g.mindmap-node > ellipse, g.mindmap-node > polygon, g.mindmap-node > path'
  );
  shapes.forEach(shape => {
    shape.style.setProperty('fill', '#1e293b', 'important');   // スレートブルー（視認性良好）
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
```

#### ③ レンダー後に呼び出す

```js
const MINDMAP_IDS = ['diag-cli', 'diag-best-practices'];
// ...render loop内で...
if (MINDMAP_IDS.includes(id)) {
  applyMindmapStyle(svgEl);
}
```

### 2-5: シーケンス図 下部切れ問題

**症状:** 最後のメッセージや Note、アクターボックス（下段）が切れて見えない。

**原因と対処:**

| 原因 | 対処 |
|---|---|
| `mirrorActors: false` でアクターが上段のみ | `mirrorActors: true` に変更 |
| SVGのheight属性を削除した後にviewBoxが存在しない | `overflow: visible` をSVGに設定 |
| `useMaxWidth` のデフォルト制限 | `useMaxWidth: false` を設定 |

```js
// sequence設定
sequence: { mirrorActors: true, noteMargin: 10, useMaxWidth: false }

// SVG後処理でoverflow: visibleを必ず設定
svgEl.style.overflow = 'visible';
```

### 2-6: ノードラベルのはみ出し（文字切れ）対策

ノード内テキストがはみ出す場合、以下を確認:

1. **フォントロード待ち**: `await document.fonts.ready` が実装されているか（最重要）
2. **ラベルにパディング用スペースを追加**: `A["text"]` → `A[" text "]`（前後に半角スペース）
3. **サブグラフタイトルを短縮**: 長いタイトルはノード幅計算に影響する

---

## Part 3: JSテンプレートリテラル方式（恒久対策）

`<div class="mermaid">` に直接書くと、VSCode/Prettier が保存のたびにインデントを付加して構文を壊す。
**恒久対策は JS テンプレートリテラルへの移管**。

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
  if (document.fonts) await document.fonts.ready; // ← 必須
  for (const [id, src] of Object.entries(DIAGRAMS)) {
    const { svg } = await mermaid.render('svg-' + id, src);
    document.getElementById(id).innerHTML = svg;
    const svgEl = document.getElementById(id).querySelector('svg');
    if (svgEl) {
      svgEl.removeAttribute('width');
      svgEl.removeAttribute('height');
      svgEl.style.width = '100%';
      svgEl.style.height = 'auto';
      svgEl.style.overflow = 'visible';
    }
  }
})();
</script>
```

この方式では `-->` を `--&gt;` にエスケープする必要もなくなる。

---

## Part 4: React/Next.js (CSS Modules) 移植時の注意点

### CSS Modules 環境下での中央寄せとサイズ制限（レイアウトはコンポーネントが真実の源）

> **重要な設計変更（2026-07-23）**: 中央寄せ・全幅・横スクロールは **共有コンポーネント
> `components/docs/MermaidDiagram.tsx` が一元的に担当**する。各ページの `page.module.css` で
> `.mermaid` / `svg` の幅・配置を強制してはならない（引き伸ばし・縮小・左寄せの三分裂を招くため）。
> 不変条件の詳細は `.claude/rules/mermaid-diagram-layout.md` を参照。

`MermaidDiagram` は **2層構造**でレイアウトを自己完結させる（実物がこの契約）:

```tsx
// components/docs/MermaidDiagram.tsx（レイアウト部の要点）
return (
  // 外側 = フレーム全幅・横スクロール担当
  <div className={`mermaid-scroll ${className || ""}`} style={{ width: "100%", overflowX: "auto", ...style }}>
    {/* 内側 = 自然サイズを中央寄せ（引き伸ばし・縮小を禁止） */}
    <div id={id} className="mermaid" ref={ref}
      style={{ width: "fit-content", margin: "0 auto", minHeight: "4rem" }} />
  </div>
);
// initialize: flowchart/sequence/mindmap とも useMaxWidth: false（自然サイズ維持）
```

- inline style（`width:fit-content` / `margin:0 auto`）は **非 `!important` の per-page `.mermaid` ルールより優先**されるため、ページ側で幅を指定しなくても中央寄せ・スクロールが成立する。
- ページ側で `svg { width:100% }`（引き伸ばし）や `svg { max-width:100% }`（広い図の縮小）を書くと不変条件が壊れる。**`!important` 付きの svg ルールは inline を上書きしてしまうので特に禁止**。

```tsx
{/* ページ側の使い方: フレームは装飾のみ。中央寄せ/スクロールを再実装しない */}
<div className={styles.mermaidWrap}>
  <MermaidDiagram chart={DIAGRAM_0} />
</div>
```

```css
/* ✅ 正解: フレームは装飾（border / background / padding / margin）だけ */
.mermaidWrap {
  border: 1px solid var(--color-border-primary);
  border-radius: 8px;
  background: var(--color-background-secondary);
  padding: 20px;
  margin: 24px 0;
  /* overflow-x: auto; ← コンポーネントと二重の保険。付けても良いが必須ではない */
}

/* ❌ 禁止: レイアウトの再実装。以下は書かない（コンポーネントの責務） */
/* .mermaidWrap :global(.mermaid) { display:flex; justify-content:center; width:100%; } */
/* .mermaidWrap :global(svg)      { width:100%; }            ← 引き伸ばし */
/* .mermaidWrap :global(svg)      { max-width:100% !important; } ← 広い図が縮小しスクロールしない */
```

> **⚠️ `mermaid.initialize` の `useMaxWidth` も必ず `false` にする**
>
> `useMaxWidth: true`（デフォルト）は Mermaid が生成する SVG に「inline style で `max-width: 100%`」を注入する。
> これが `.mermaid` の `width: fit-content` を無視して全幅化する。
>
> ```js
> // ✅ 必ず false にする
> mermaid.initialize({
>   flowchart: { useMaxWidth: false, htmlLabels: true },
>   sequence:  { useMaxWidth: false },
>   mindmap:   { useMaxWidth: false },
> });
> ```

### ⚠️ CSS変数は `globals.css` に存在しないものを `var()` で参照しない

`globals.css` には `--accent`, `--bg-card`, `--accent-soft`, `--text-dim` 等の
ページ固有変数が**定義されていない**。Mermaid ラッパーや図解カードに色を指定するとき、
これらを `var()` で参照すると `bun run build` は通るが**実行時に透明・崩壊**する。

```css
/* ❌ NG: globals.css に存在しない変数を参照 */
.mermaidCard { background: var(--bg-card); border: 1px solid var(--accent-soft); }

/* ✅ OK: .layout スコープで変数を自己定義してから参照 */
.layout {
  --bg-card: #0f2038;
  --accent-soft: rgba(124, 158, 255, 0.14);
}
.mermaidCard { background: var(--bg-card); border: 1px solid var(--accent-soft); }
```

詳細は `.claude/skills/nextjs-page-migration/SKILL.md` §「CSS Module 地雷チェックリスト」を参照。

### テスト環境（Vitest）でのモック化

```typescript
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));
```

---

## Part 5: Mermaidを諦めてHTML/CSSに置き換えるべきケース

以下は CSS では対処不能なため、**純粋な HTML/CSS ウィジェットに置き換える**：

- `flowchart TD` で 5〜6 ノードを直列チェーン → 縦長 900px 超
- 接続されていない複数のサブグラフ（ノード数が非対称なためアスペクト比が崩れる）

判断基準：「ノード増減に関わらず、他の図と同じ高さに収まる保証がない場合」

---

## クイックリファレンス：問題別対処フロー

| 症状 | まず確認すること | 対処 |
|---|---|---|
| 構文エラー (`Syntax error in text`) | インデント汚染・行連結 | Part 1参照 |
| 文字がノード外にはみ出す | `document.fonts.ready` の有無 | `await document.fonts.ready` を追加 |
| マインドマップが原色（赤・緑・紫） | `cScale0-11` の設定 | Part 2-2参照 |
| マインドマップのテキストが読めない | `foreignObject` CSS非カスケード問題 | Part 2-4の手順に従う |
| シーケンス図の下部が切れる | `mirrorActors`, `overflow` の設定 | Part 2-5参照 |
| CSS `!important` が効かない | inline `style` 属性の優先度 | JS `.style.setProperty(..., 'important')` を使う |
| **SVG全体が巨大化・画面全幅に広がる** | `useMaxWidth: true` かつ `width: 100%` | `useMaxWidth: false` + `width: fit-content`（Part 2-3・Part 4参照） |
| 図は常識的な大きさだが小さな図も全幅に引き伸ばされる | コンテナまたは `.mermaid` に `width: 100%` | `width: fit-content; max-width: 100%` に変更 |
| **SVGが縦長に拡大される・縦横比が崩れる** | SVGに `width` 属性が残ったままに `width: 100%` | `removeAttribute('width')` → `width: auto; max-width: 100%` に変更 |
