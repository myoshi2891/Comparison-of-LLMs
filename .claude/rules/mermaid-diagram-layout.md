# Mermaid 図解レイアウトの不変条件（中央寄せ・全幅・横スクロール）

(制定: 2026-07-23)

サイト全体の Mermaid 図解は **共有コンポーネント `web-next/components/docs/MermaidDiagram.tsx`
がレイアウトの唯一の真実の源（SSoT）** である。約50ページが本コンポーネントを共有するため、
ページ側でレイアウトを再実装すると挙動が分裂する（過去に「引き伸ばし／縮小／左寄せ」の三分裂が発生した）。

## 不変条件

1. **描画モデルは2層**:
   - 外側 `div`: `width:100%; overflow-x:auto`（フレーム全幅・横スクロール担当）
   - 内側 `.mermaid`: `width:fit-content; margin:0 auto`（自然サイズを中央寄せ。`max-width` を付けない）
2. **`mermaid.initialize` の `useMaxWidth` は `false`**（flowchart / sequence / mindmap すべて）。SVG を自然サイズで描く。
3. **図 < 列幅 → 中央寄せ、図 > 列幅 → 横スクロール**（縮小させない）。

## 禁止事項（ページ側 `page.module.css`）

- `:global(.mermaid) { width: 100% }` / `display:flex; justify-content:center` などの**幅・配置の強制**。
- `:global(svg) { width: 100% }`（**引き伸ばし**）。
- `:global(svg) { max-width: 100% }`（広い図が**縮小しスクロールしない**）。
- 上記の `!important` 版（inline style を上書きしてしまうため特に有害）。

## 許可（ページ側）

- 図解フレームの**装飾のみ**: `border` / `border-radius` / `background` / `padding` / `margin` / キャプション。
- 保険としての `overflow-x: auto`（コンポーネントと二重でも可。必須ではない）。
- `globals.css` の Mermaid **配色補正**（`.mermaid text` の `fill` 等。レイアウトではない）。

## なぜ inline style で足りるか

コンポーネントの inline style（`width:fit-content` / `margin:0 auto` / `overflow-x:auto`）は
**非 `!important` の per-page クラスルールより詳細度が高い**。したがってページ側で幅を書かなければ
中央寄せ・スクロールは自動的に成立する。`!important` を付けたページルールだけが例外的に上書きするため禁止。

## 関連

- スキル: `.claude/skills/fix-mermaid/SKILL.md`（Part 4）、`.claude/skills/nextjs-page-migration/SKILL.md`（Step 4）
- CSS キャッシュ: `globals.css`/`page.module.css` 変更後は `.claude/rules/css-cache-reset.md` に従い `web-next/.next` を削除して再起動。
