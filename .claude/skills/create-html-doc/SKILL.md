---
name: create-html-doc
description: >
  [DEPRECATED — Phase A–F 移行期間中は使用しない]
  Creates static HTML guide pages under legacy/, which is now frozen per the Phase A–F
  migration policy (.gitignore + edit ban in CLAUDE.md). New guide pages must be written
  as Next.js page.tsx under web-next/app/. Use /nextjs-page-migration for migration work,
  or write a new page.tsx directly using DocLayout/CodeBlock/MermaidDiagram when adding
  fresh content. This skill will be re-evaluated (or removed) after Phase F cutover.
deprecated: true
invocation: explicit
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

> ⚠️ **DEPRECATED (Phase A 以降)**: 本スキルは `legacy/` 配下への新規 HTML 作成を前提としていた。
> Phase A–F 計画（`docs/NEXTJS_PHASE_A_F_PLAN.md`）により `legacy/` は凍結・編集禁止となり、
> 新規ガイドページは `web-next/app/<provider>/<slug>/page.tsx` として作成する。
>
> - 新規ページ（Next.js 側）: `/nextjs-page-migration` スキルを参照
> - Mermaid の構文ルールのみ再利用したい場合: `/fix-mermaid` または
>   `web-next/components/docs/MermaidDiagram.tsx`（Phase E で追加予定）を参照
> - 本スキルは Phase F カットオーバー後に削除または再定義する
>
> 以下の手順は **Phase F 完了までは実行しない**（参照用に保持）。

# 静的 HTML ドキュメント作成スキル

## 既存テンプレート

新規ドキュメント作成時は既存ファイルを参照する:

| ドキュメント種別 | テンプレート |
| --- | --- |
| スキルガイド | `claude/skill.html` |
| エージェントガイド | `claude/agent.html` |
| スキルガイド（詳細版） | `claude/skill-guide-for-claude.html` |

## 必須要素

### 1. 共通ヘッダー

```html
<link rel="stylesheet" href="../common-header.css">
<script src="../common-header.js"></script>
```

共通ヘッダーはドロップダウンナビゲーションを提供する。
配置パスはドキュメントの階層に応じて調整すること（`../` or `./`）。

### 2. Mermaid v10

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    themeVariables: {
      background: '#0d1117',
      primaryColor: '#1c2333',
      primaryTextColor: '#e6edf3',
      primaryBorderColor: '#30363d',
      lineColor: '#8b949e',
      secondaryColor: '#161b22',
      tertiaryColor: '#0d1117',
      fontFamily: "'Noto Sans JP', sans-serif",
      fontSize: '16px',
    },
    flowchart: { useMaxWidth: true, htmlLabels: true },
    sequence: { useMaxWidth: true },
  });
</script>
```

### 3. レスポンシブ CSS

テンプレートから `.layout`, `.sidebar`, `.main-content` の CSS 構造をコピーする。

## Mermaid v10 構文ルール（重要）

### 基本ルール

1. **`<div class="mermaid">` 内のコンテンツはカラム0配置**（HTML インデントを混ぜない）
2. **各ステートメントは改行で分離**（1行に複数ステートメントを書かない）

```html
<!-- ✅ 正しい -->
<div class="mermaid">
graph LR
A[Start] --> B[End]
style A fill:#cce5ff
</div>

<!-- ❌ 間違い（HTML インデントが混入） -->
<div class="mermaid">
    graph LR
    A[Start] --> B[End]
    style A fill:#cce5ff
</div>
```

### 例外: mindmap

mindmap はインデントがツリー階層を表現する構文の一部。
HTML インデントは除去するが、Mermaid 構文としてのインデントは必要:

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

### quadrantChart の日本語制限

Mermaid v10 の `quadrantChart` は日本語データポイントラベルを**パースできない**。
日本語を使う場合は `graph LR` + `subgraph` で代替する:

```html
<div class="mermaid">
graph LR
subgraph A["領域A のタイトル"]
A1["日本語ラベル1"]
A2["日本語ラベル2"]
end
subgraph B["領域B のタイトル"]
B1["日本語ラベル3"]
end
</div>
```

### gitGraph の注意点

`gitGraph` は `LR:` の後に必ず改行する:

```html
<div class="mermaid">
gitGraph LR:
commit id: "initial"
branch feature
commit id: "add feature"
</div>
```

## CSS for Mermaid

```css
.mermaid-wrap {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 2rem 1rem;
  margin: 1.5rem 0;
  overflow-x: auto;
  text-align: center;
}

.mermaid {
  width: 100%;
}

.mermaid svg {
  max-width: 100% !important;
}
```

## SVG ガイドライン

手書き SVG を含む場合:

- `viewBox` の高さとコンテンツ座標の整合性を確認
- `<marker>` の色は対応する `<line>` の `stroke` 色と一致させる

## 検証

Playwright MCP は使用しない。ユーザーがブラウザで手動確認する。
