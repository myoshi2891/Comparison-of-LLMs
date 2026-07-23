# Mermaid 図解レイアウトの不変条件（中央寄せ・全幅・横スクロール）

(制定: 2026-07-23)

サイト全体の Mermaid 図解は **共有コンポーネント `web-next/components/docs/MermaidDiagram.tsx`
がレイアウトの唯一の真実の源（SSoT）** である。約50ページが本コンポーネントを共有するため、
ページ側でレイアウトを再実装すると挙動が分裂する（過去に「引き伸ばし／縮小／左寄せ」の三分裂が発生した）。

## 不変条件

1. **描画モデルは2層 + svg 後処理**:
   - 外側 `div`: `width:100%`（フレーム＝列幅を占める）
   - 内側 `.mermaid`: `display:flex; justify-content:center`（中央寄せ担当）
   - 生成された `svg`: `mermaid.run` 後に JS で `style.maxWidth="100%"; style.height="auto"` を付与（列幅に収める）
2. **`mermaid.initialize` の `useMaxWidth` は `false`**（flowchart / sequence / mindmap すべて）。自然サイズを起点にする。
3. **図 < 列幅 → 自然サイズで中央寄せ、図 > 列幅 → 列幅まで縮小して中央寄せ**（切れ・左寄り・横スクロールを起こさない）。

## 禁止事項（ページ側 `page.module.css`）

- `:global(.mermaid) { width: 100% }` / `display:flex; justify-content:center` などの**幅・配置の再指定**（コンポーネントが担当済み）。
- `:global(svg) { width: 100% }`（**引き伸ばし**）。
- `:global(svg) { max-width: ... }` / `height: ...`（コンポーネントの svg 後処理と競合する。サイズ調整はコンポーネントに任せる）。
- 上記の `!important` 版（特に有害）。

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
