---
name: nextjs-page-migration
description: >
  Migrate static HTML guide pages from legacy/ to web-next/ App Router page.tsx using TDD.
  Phase A–F is fully complete. Use this skill for new guide pages or maintenance of
  existing migrated pages.
  TRIGGER when the user says any of the following (Japanese or English):
  - "新規ガイドページを追加" / "ガイドページを移行" / "ページを保守"
  - "add new guide page" / "migrate guide page" / "nextjs page migration"
  - guide-page layout/centering maintenance: "図解が左寄せ" / "図解を中央寄せ" /
    "コンテンツが左寄り" / "本文の幅がバランス悪い" / "diagram not centered" /
    "content column width" (both Mermaid and hand-coded flex/HTML diagrams)
  Applies project-specific patterns: SiteHeader, DisclaimerBanner, nav-links.ts,
  CSS Modules, shiki build-time highlighting, Mermaid lazy loading, diagram
  centering (Mermaid + hand-coded), and the 1440px content-width policy.
invocation: explicit
allowed-tools:
  - Read
  - Grep
  - Glob
  - Edit
  - Write
  - Bash
---

# Next.js ガイドページ追加・保守スキル

## 概要

Phase A–F で 18 枚のガイドページが `web-next/` App Router に**全移行完了**。
本スキルは **新規ガイドページの追加**または**既存ページの保守・改善**を TDD で標準化する。

**前提**: `SiteHeader` / `DisclaimerBanner` は `app/layout.tsx` にマウント済み。
ページ側で再インクルードしない。新ページは `nav-links.ts` に追記して登録する。

## セッション開始時に必ず読むファイル（順序固定）

1. **`docs/PROGRESS.md`** — 現在の保守フェーズのステータス・テスト数・ネクストアクション
2. **このファイル** — 標準手順と実装パターン
3. **`.claude/rules/tdd-mandatory-cycle.md`** — TDD 必須サイクル & コミット分割ルール

---

## TDD 必須サイクルの適用（最重要）

常に TDD サイクル（**Red → Green → Refactor → Docs**）を**最優先**で適用する。

1. **task.md 作成時**: 各コミットを「Red」「Green」「Refactor」「Docs Sync」単位に構造化する
2. **実装前（Red）**: `page.tsx` を実装する**前**に失敗するユニットテストを作成してコミットする
3. **一括コミット禁止**: テスト・実装・カバレッジ更新・ドキュメント更新を 1 コミットにまとめない

---

## 新規ページ追加の標準手順

### Step 1: [Red] 契約テストの作成

`app/<provider>/<slug>/page.test.tsx` を作成。最低限以下の 5 契約を書く:

1. `render(<Page />)` でタイトル（`<h1>`）のテキスト完全一致
2. 主要セクション数（`<h2>` の count）
3. 外部リンクに `target="_blank"` と `rel="noopener noreferrer"` が両方付与されている
4. 内部リンクが clean URL（`.html` なし）である
5. コードブロックに `language-*` クラスが付与されている（shiki 適用の前段確認）

参考実装: `web-next/components/Hero.test.tsx` の `render() + querySelector` パターン。

### Step 2: [Green] page.tsx の実装

> [!CAUTION]
> **100% 完全移植ルール（絶対ルール）**:
> ソース HTML / Markdown の **要約・省略・縮約・部分抽出・代表例のみの記述は重大な規約違反** である。
> 元ファイルの全セクション、全サブセクション、全リード文・本文段落、全リスト項目、全コードブロック、全 SVG、全 callout/alert、全 table、全参考文献/外部リンクを、何一つ落とさずに **100% 漏れなく JSX へ完全転写** すること。
> 
> **【必須検証プロセス: ラインバイライン全件要素照合監査】**
> 実装時およびコードレビュー時には、必ず以下の **全件要素照合** を自律的に実行すること:
> 1. **監査対象**: 全セクション、全見出しレベル、全段落、全リスト項目、全コードブロック、全 SVG、全 callout/alert、全 table、全参考文献リンクを対象とする。
> 2. **要素数と内容の照合**: 各監査対象の要素数をカウントして JSX 側と完全一致することを確認し、本文、表の全行・全列、箇条書き、スラッシュコマンド、設定キー、キーショートカットを原本と1件ずつ突き合わせる。
> 3. **JSXパースチェック**: テキスト内の `<name>` や `<path>` などの山括弧が `&lt;` `&gt;` にエスケープされているか、生のバッククォートが放置されていないかを `grep_search` 等で静的スキャンする。

- **Server Component デフォルト**。`"use client"` は `useState` が必要な場合のみ
- スタイル優先順位: Tailwind ユーティリティ → CSS Modules（`page.module.css`） → global CSS（避ける）
- **ファイルレイアウト**: `app/<provider>/<slug>/` 配下に `page.tsx` / `page.module.css` / `page.test.tsx` の 3 点セットをコロケーション配置
- 新たに i18n キーを追加した場合、`lib/i18n.test.ts` の `expect(Object.keys(T).length).toBe(N)` を同じコミット内で更新する

#### JSX 変換 Pitfalls チェックリスト

| 問題 | NG 例 | OK 例 |
|------|-------|-------|
| `class` 属性 | `class="foo"` | `className="foo"` |
| `for` 属性 | `for="id"` | `htmlFor="id"` |
| void 要素の閉じ | `<br>` `<img>` | `<br />` `<img />` |
| HTML コメント | `<!-- comment -->` | `{/* comment */}` |
| インラインスタイル | `style="font-family: var(--f)"` | `style={{ fontFamily: 'var(--f)' }}` |
| `{"\n"}` 改行 | `<span>A</span>{"\n"}<span>B</span>` | `<div className={styles.codeLine}>…</div>` でラップ |
| デシジョンテーブルのスペース揃え | スペースで列幅を合わせる | `<table>` 要素へ変換 |
| `<main>` ラッパー追加 | `<main>…</main>` | 不要（`layout.tsx` が管理） |
| 生 HTML 注入 | `dangerouslySetInnerHTML` | ネストした JSX `<span>` で表現（下記参照） |
| SVG に title/aria なし | `<svg>…</svg>` | `<svg role="img" aria-label="…"><title>…</title>…</svg>` |

#### ⚠️ CSS Module 地雷チェックリスト（移行時の頻出バグ）

> [!CAUTION]
> 以下は `bun run build` が通っても **実行時に全配色・レイアウトが崩壊する** 無音バグ。
> `page.module.css` を作成したら必ず全項目を確認すること。

**① CSS変数は必ず `page.module.css` の最上位セレクタ内に定義する**

`globals.css` には以下の変数が**存在しない**（使用すると `unset` / 透明になる）:
`--bg-elevated`, `--bg-card`, `--accent`, `--accent-soft`, `--accent-2`, `--accent-2-soft`,
`--text`, `--text-dim`, `--text-faint`, `--text-tertiary`

元 HTML の `:root { ... }` 定義は必ず `.layout` または `.root` スコープに転写する:

```css
/* ✅ 正しいパターン: .layout スコープに変数を閉じ込める */
.layout {
  --bg: #07111e;
  --bg-elevated: #0d1b2e;
  --bg-card: #0f2038;
  --accent: #7c9eff;
  --accent-soft: rgba(124, 158, 255, 0.14);
  --text: #e6ecf5;
  --text-dim: #9fb0c9;
  --text-faint: #6d7f9c;
  --border: rgba(255, 255, 255, 0.09);

  display: flex;
  background: var(--bg); /* 変数定義と同じセレクタ内ですぐ使える */
  color: var(--text);
}

/* ❌ NG: globals.css に存在しない変数をそのまま参照 */
/* .pageFooter { color: var(--text-tertiary); } → 未定義で透明になる */
```

`globals.css` に実際に存在する変数（共有デザイントークン）:
`--bg`, `--bg2`, `--srf`, `--srf2`, `--brd`, `--brd2`, `--txt`, `--txt2`, `--txt3`,
`--acc`, `--acc2`, `--grn`, `--ylw`, `--red`, `--prp`, `--teal`, `--orng`

**② デスクトップサイドバーの固定には `position: sticky` を使い、モバイルには `position: fixed` を許可する**

```css
/* ✅ デスクトップ用: sticky パターン（SiteHeader を考慮した top と height） */
.sidebar {
  flex-shrink: 0;
  position: sticky;
  top: var(--header-height, 60px); /* SiteHeader の高さを考慮したオフセット */
  height: calc(100vh - var(--header-height, 60px)); /* ヘッダー分を引いた高さ */
  overflow-y: auto;
}

/* ✅ モバイル用: オフキャンバス開閉動作には position: fixed の使用を明示的に許可 */
@media (max-width: 960px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    /* ...モバイル開閉アニメーションなど... */
  }
}
```

**③ サイドバートグルのデフォルト `display: none` を必ず書く**

```css
/* ✅ デスクトップのデフォルトを先に定義 */
.sidebarToggle { display: none; }

@media (max-width: 960px) {
  .sidebarToggle { display: flex; /* ... */ }
}

/* ❌ NG: @media 内にしか書かない → デスクトップでも表示されてしまう */
```

**確認コマンド（var() 参照の棚卸し）**:

> 完全な bash スクリプト（ローカル変数抽出 + globals.css 照合）は
> `references/implementation-reference.md` §「CSS Module 地雷チェック — var() 参照確認コマンド」を参照。

#### コードブロック内の行区切りパターン

`.code-block` のデフォルト `white-space` は `normal` のため `{"\n"}` はスペースに正規化される。
各行を `<div className={styles.codeLine}>` でラップすること（`.codeLine` には `white-space: pre` が定義済み）。

```tsx
{/* ❌ NG */}
<div className={styles.codeBody}>
  <span className={styles.ck}>const</span>{"\n"}
  <span className={styles.cv}>value</span>
</div>

{/* ✅ OK */}
<div className={styles.codeBody}>
  <div className={styles.codeLine}><span className={styles.ck}>const</span><span className={styles.cv}> value</span></div>
  <div className={styles.codeLine}><span className={styles.cv}>= 42</span></div>
</div>
```

#### SVG 属性変換規則

| HTML 属性 | JSX 属性 | HTML 属性 | JSX 属性 |
|---|---|---|---|
| `text-anchor` | `textAnchor` | `stroke-width` | `strokeWidth` |
| `font-family` | `fontFamily` | `fill-opacity` | `fillOpacity` |
| `font-size` | `fontSize` | `pointer-events` | `pointerEvents` |
| `font-weight` | `fontWeight` | `stop-color` in `style=` | `style={{ stopColor: '...' }}` |
| `letter-spacing` | `letterSpacing` | `style="display:block;"` | `style={{ display: 'block' }}` |

SVG には必ず `role="img"` + `aria-label` + `<title>` を付与（Biome `noSvgWithoutTitle` 対応）。

### Step 3: コードブロック（shiki）

build-time ハイライトとして `shiki` を採用する。

- RSC 内の `async` ページコンポーネントから `shiki` highlighter を取得し事前 HTML 化する
- 安全な流し込み API の使い方は既存の `web-next/components/CodeBlock.tsx` を参照すること
  （SKILL.md 内にリテラル記述しない — XSS 監査の false positive 防止）
- 入力はビルド時に確定する値のみ（ユーザー入力はハイライト対象に含めない）

**コードハイライト用クラス早見表**（`styles.` を前置して使用）:

| クラス | 色 | 用途 | クラス | 色 | 用途 |
|---|---|---|---|---|---|
| `ck` | 赤 `#ff7b72` | キーワード | `cm` | 緑太字 `#7ee787` | マーカー・セクション |
| `cs` | 薄青 `#a5d6ff` | 文字列・区切り | `cw` | 黄 `#d29922` | 警告・重要語 |
| `cv` | 青 `#79c0ff` | 値 | `ce` | 紫 `#bc8cff` | 列挙・特殊 |
| `cc` | グレー斜体 `#3b4750` | コメント | `cg` | 明緑 `#3fb950` | 成功・肯定 |
| `ch` | オレンジ太字 `#f0883e` | 見出し | | | |

### Step 4: 図解の中央寄せ（Mermaid・手書き両方）

> **鉄則**: サイト内の**あらゆる図解は中央寄せ**にする。「Mermaid だけ直す」は不十分 —
> 過去に手書き（非 Mermaid）の flex/HTML 図解が左寄せのまま放置され、全面的な手戻りが発生した。
> 図解を含むページを移行・保守したら、**Mermaid と手書き図解の両方**の中央寄せを必ず確認する。

#### (a) Mermaid 図解

- `components/docs/MermaidDiagram.tsx` を直接インポートして通常通り使用する（内部で動的インポート済み）
- テーマは **`theme: "dark"`**。記述は **左端揃え必須**（インデントが混じると構文エラー）
- **レイアウトはコンポーネントが自己完結で担当**（2層構造 + `useMaxWidth:false` + `mermaid.run` 後に svg へ `max-width:100%; height:auto` を付与＝**列幅への縮小フィット中央寄せ**）。ページ側ラッパーは**装飾（border/background/padding）のみ**。`:global(.mermaid)` / `:global(svg)` に `width`/`max-width`/`display:flex` を書いて中央寄せを**再実装しない**（引き伸ばし・縮小・左寄せの三分裂を招く）。不変条件は `.claude/rules/mermaid-diagram-layout.md`、実装詳細は `fix-mermaid/SKILL.md` Part 4。

#### (b) 手書き（非 Mermaid）の図解 — flex/HTML で組んだフロー図・決定木・ステップ図

命名がバラバラ（`.flow` / `.flowRow` / `.hfFlow` / `.archRow` / `.decisionTree` …）なので
**クラス名で探さない**。「色付きボックスが横に並ぶ図」を見つけたら中央寄せする。

- **パターン1（1行横並び）**: `width: fit-content; margin-inline: auto` を追加。親に `overflow-x: auto` があることを確認する。
- **パターン2（折り返し）**: `justify-content: center` を追加。
- **左寄せが正しい**: 縦タイムライン・積層バー・ファイルツリー・箇条書きは触らない。
- **決定木など**: 各行を個別中央寄せするとジグザグになるため、**ブロックごと**に `width: fit-content; max-width: 100%; margin: 0 auto`。

> CSS コードの完全パターン（パターン1/2 の詳細）は
> `references/implementation-reference.md` §「手書き図解（非 Mermaid）中央寄せ CSS パターン」を参照。

#### (c) 本文カラム幅（バランス）

- **単一カラム**ページ: トップレベルの本文コンテナに `max-width: 1440px; margin: 0 auto`（サイトの `.container` と同値。全幅すぎるとワイド画面で行が伸び読みにくい／狭すぎると窮屈）。
- **サイドバー**ページ: 本文カラムは `min-width: 0` でトラックいっぱいに満たす（`.main { max-width: 900px }` のような狭い固定は左寄せ・空白の原因になるので付けない。mcp/local-llm に倣う）。
- 読みやすさ用の狭いキャップ（`.lead` 等のリード文、ヒーローのサブタイトル）は保持してよい。

### Step 5: [Refactor] 共通化判断

- **3 ページ以上**で重複する UI パターン → `components/docs/` への抽出を検討
- 2 ページ以下 → ページ固有で残す

### Step 6: ローカル検証

```bash
cd web-next
bun run lint        # Biome（変更ファイル単位でパス指定）
bun run typecheck   # tsc --noEmit
bun run test        # vitest
bun run build       # Next.js production build
```

**全通過** が必須。部分 pass でコミットしない。

#### レイアウト・中央寄せの実測検証（視覚バグ用・任意だが強く推奨）

中央寄せ・はみ出し・カラム幅は**ユニットテストで検出できない**。CSS 視覚バグを疑うときは
**静的ビルドを別ポートで配信し、Playwright で描画座標を実測**する（`scraper/` に Playwright 導入済み）。
**必ず `bun run build` 後の `out/` を静的配信**する（dev サーバーは負荷でクラッシュしやすいため）。

> 配信コマンド詳細（`python3 -c` 簡易サーバ + scraper Playwright 実行方法）・判定の目安は
> `references/implementation-reference.md` §「Playwright 実測配信コマンド」を参照。

### Step 7: nav-links.ts / ドキュメント同期

**nav-links.ts への登録**（必須）:

```typescript
// web-next/components/site/nav-links.ts
{ href: '/<provider>/<slug>', label: 'ページ表示名', category: '<category>' },
```

**CLAUDE.md / GEMINI.md への追記**（必須）:

```markdown
- `app/<provider>/<slug>/page.tsx` — ページの説明
```

---

## 再利用パターン集

### Ext ヘルパー（外部リンク）

```tsx
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
```

### コードブロック構造 / フッター構造

> [!IMPORTANT]
> `.codeBar`, `.codeBody`, `.codeLine` には必ず等幅フォント
> （`font-family: var(--font-mono), "JetBrains Mono", monospace`）を適用。
> `.codeBody` には `line-height: 1.65` 等を指定して視認性を確保する。

> 完全実装コード（コードブロック JSX 全体・フッター CSS）は
> `references/implementation-reference.md` §「コードブロック構造 完全実装例」「フッター CSS 完全実装例」を参照。

### TOC nav とスクロール自動追従 (Intersection Observer)

スクロールに応じて TOC のアクティブ項目をハイライトする Intersection Observer を導入する場合、
`page.tsx` を `'use client'` 化してはいけない（`metadata` がエクスポートできなくなるため）。

**推奨設計パターン**:
1. 同一ディレクトリ内に `TocObserver.tsx` という軽量クライアントコンポーネントを新規作成する。
2. `TocObserver` 内で `useEffect` + `IntersectionObserver` で各 `.chapter` の交差判定を行い、TOCリンクに `classList.add/remove(styles.tocLinkActive)` を操作する。
3. Server Component の `page.tsx` から `TocObserver` をインポートして配置する（`metadata` 維持と追従機能の両立）。

> 完全実装コード（`TocObserver.tsx` 全体 + page.tsx 呼び出し方）は
> `references/implementation-reference.md` §「TocObserver 完全実装」を参照。

### CSS Module 複合クラス

```tsx
<span className={`${styles.navPill} ${styles.green}`}>Agent Mode</span>
```

---

## WAI-ARIA パターン（インタラクティブ UI）

| UI パターン | 正しい ARIA | 誤りやすい代替 |
|---|---|---|
| チェックボタン (on/off) | `aria-pressed={bool}` | `aria-checked`, `aria-selected` |
| タブ切り替え | `role="tab"` + `aria-selected` | `aria-pressed`, `aria-current` |
| ステップ現在地 | `aria-current="step"` | `aria-selected`, `aria-pressed` |

**ステップ現在地**: `aria-current={isActive ? "step" : undefined}` — `undefined` で属性自体を消す（`false` だと `aria-current="false"` が出力される）。

> タブ UI 完全実装（`role="tablist"` / `role="tab"` / `tabIndex` Roving tabindex パターン）は
> `references/implementation-reference.md` §「WAI-ARIA タブ UI 完全実装」を参照。

---

## セッション終了前の仕様書同期（必須）

<ai_agent_directive>
**AI エージェントへの厳格な指示**: 以下のプロセスは**ゲート条件（Gate Condition）**です。タスクの報告を行う前に、ユーザーの許可を待たずに**自律的かつ自動的に、ステップバイステップでコミットまで完了させてください**。ルールに反してコミットを後回しにすることは禁止されています。
</ai_agent_directive>

1 ページの `git commit` 完了後、次の作業を始める前に必ず実施する:

```bash
cd web-next && bun run build && bun run lint && bun run test
```

全通過後、`docs/PROGRESS.md` のテスト数・次の作業・再開プロンプトを更新してコミットする。
詳細は `.claude/rules/migration-progress-sync.md` を参照。

---

## 判定基準

| 結果 | アクション |
| --- | --- |
| 全ステップ成功 + テスト全通過 | コミット OK と報告し、次ページに進む |
| 単体テスト失敗 | テストの意図を確認し、実装かテストかどちらが誤りか判断 |
| ビルド失敗 | 停止。import / 型エラーを最小差分で修正 |
| lint エラー | 変更ファイル単位でパス指定して修正（`bun run lint:fix` 引数なし禁止） |
| 設定ファイルの意図しない変更 | 停止してユーザー確認 |

---

## Constraints（禁止事項）

- **`<SiteHeader>` / `<DisclaimerBanner>` をページ側で再インクルードしない** — `layout.tsx` が提供
- **`"use client"` を不必要に使わない** — Server Component デフォルト
- **生 HTML 注入 prop を使わない** — JSX `<span>` でシンタックスハイライトを表現
- **`{"\n"}` を `.code-block` 内の改行に使わない** — `<div className={styles.codeLine}>` でラップ
- **スペース揃えで tabular data を表現しない** — `<table>` 要素へ変換。また、表の文字はすべてのヘッダー（`th`）およびセル（`td`）で必ず左寄せ（`text-align: left !important`）にして表示すること。
- **Mermaidの図解レイアウトをページ CSS で再実装しない** — 中央寄せ・全幅・横スクロールは `MermaidDiagram` コンポーネントが担当する。ページ側の `:global(.mermaid)` / `:global(svg)` に `width` / `max-width` / `display:flex` を書かない（`svg{width:100%}`=引き伸ばし、`svg{max-width:100%}`=縮小の原因）。ラッパーは装飾のみ（`.claude/rules/mermaid-diagram-layout.md`）。
- **手書き（非 Mermaid）の横並び図解を左寄せのまま放置しない** — flex/HTML で組んだフロー図・決定木は既定で左寄せになる。横並びのボックス群は必ず中央寄せする（Step 4(b)）。「Mermaid だけ直して手書き図解を見落とす」のが過去の典型的な手戻り。縦タイムライン・ファイルツリー・箇条書きは左寄せのままでよい。
- **サイドバーページの本文カラムに狭い固定 `max-width` を付けない** — `.main { max-width: 900px }` 等はトラックに対して左寄せ・右空白の原因。サイドバーページは `min-width:0` でトラックを満たす。単一カラムページのみ `max-width:1440px; margin:0 auto` で中央寄せ（Step 4(c)）。
- **`bun run lint:fix`（引数なし）を実行しない** — 変更ファイル単位でパス指定（R1 ルール）
- **外部フォントを `<link>` タグで読み込まない** — `next/font/google` のみ（`layout.tsx`）
- **`@layer components` を page-specific styles に使わない** — plain CSS で specificity を確保
- **`@keyframes` にキャメルケースを使わない** — kebab-case 必須（`fadeUp` → `fade-up`）
- **z-index を CSS と Tailwind クラスの両方で指定しない** — 単一ソース原則
- **SVG に `role="img"` + `aria-label` + `<title>` を省略しない** — Biome `noSvgWithoutTitle` 違反
- **Playwright MCP ツールを使わない** — トークン多消費のため。ただしレイアウト・中央寄せの回帰を追う場合に限り、**`scraper/` の Playwright で描画座標を実測**する方式は可（Step 6。スクショの大量取得ではなく bounding box の数値比較。ユーザー許可時のみ）。最終的な見た目確認はユーザーが手動で実施
- **新規ガイドページを `legacy/` 配下に作成しない** — `web-next/app/` 側のみに作成する
- **コードブロックやフッターの monospace フォント指定を省略しない** — `.codeBody`, `.codeLine`, `.codeBar`, `.pageFooter` には必ず等幅フォント（`font-family: var(--font-mono), ...`）を明示的に指定すること。
- **RSC の `page.tsx` を直接クライアントコンポーネント化（'use client'）しない** — Intersection Observer 等が必要な場合は、軽量な `<TocObserver />` などに分割し、`page.tsx` 自体は Server Component のままで `metadata` 静的エクスポートができる状態を維持する。
- **`globals.css` に存在しない CSS 変数を `var()` で参照しない** — 元 HTML の `:root` 定義は `page.module.css` の `.layout` / `.root` スコープ内に転写する（上記 CSS Module 地雷チェックリスト参照）。
- **サイドバーの固定に `position: fixed` を無条件で使わない** — デスクトップでは `SiteHeader` の高さを考慮した `position: sticky; top: var(--header-height, 60px); height: calc(100vh - var(--header-height, 60px)); overflow-y: auto` を使用し、モバイルのオフキャンバス開閉動作に対してのみ `position: fixed` を明示的に許可する。
- **`.sidebarToggle` のデフォルト `display: none` を省略しない** — メディアクエリ外でデフォルト非表示にし、`@media (max-width: 960px)` 内でのみ `display: flex` に上書きする。
