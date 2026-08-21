# CSS 完全転写チェックリスト

(最終更新日: 2026-08-19)

**用途**: 原本 HTML の `<style>` ブロックを `page.module.css` に 100% 転写するための
チェックリスト。SKILL.md §5 Step 2「CSS 完全転写チェックリスト」から参照される。

**背景**: コンテンツ（見出し・リンク・テキスト）の移行漏れは `audit_source_parity.mjs`
が機械検知するが、**CSS/スタイリングの移行漏れは現行監査では検出できない**。
過去の手戻り事例を網羅的に分析し、ここにチェックリストとして集約した。

---

## 使い方

1. 原本 HTML の `<style>` ブロック全体をエディタの片方に開く
2. 作成中の `page.module.css` をもう片方に開く
3. 以下のチェックリストを上から順に照合する
4. **すべての項目に ✅ が付くまで Green コミットしない**

---

## チェックリスト

### 1. CSS 変数定義

原本の `:root` / `body` / `html` に定義された CSS カスタムプロパティ（`--xxx`）を
**漏れなく** `.layout` セレクタ内に転記する。

```css
/* ❌ 原本にあるのに page.module.css にない変数 → 実行時に透明・崩壊 */
.layout {
  /* --color-text-secondary が抜けている！ */
}

/* ✅ 全変数を .layout 内に定義 */
.layout {
  --color-background-primary: #07111e;
  --color-background-secondary: #0d1b2e;
  --color-background-tertiary: #132540;
  --color-background-info: #12233f;
  --color-background-danger: #3a1f22;
  --color-background-success: #16332a;
  --color-background-warning: #3a2e14;

  --color-text-primary: #e9edf5;
  --color-text-secondary: #a9b8cc;
  --color-text-tertiary: #6d7f96;
  --color-text-info: #7fb0ff;
  --color-text-danger: #ff8f8f;
  --color-text-success: #6ee7a0;
  --color-text-warning: #ffcf6b;

  --color-border-primary: #3a5478;
  --color-border-secondary: #2a3f5c;
  --color-border-tertiary: #1c2e46;

  --accent: #7c9eff;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
}
```

**検証コマンド**（`implementation-reference.md` の「var() 参照確認コマンド」を使用）:

```bash
bash .claude/skills/nextjs-page-migration/references/check-css-vars.sh \
  web-next/app/<provider>/<slug>/page.module.css
```

---

### 2. レイアウト構造

| 確認項目 | 原本のよくあるパターン | page.module.css での転写 |
|---|---|---|
| `.layout` の `display` | `display: block` or `display: flex` | 原本通り転記 |
| `.layout` の `width` | 暗黙の `width: auto`（全幅） | `width: 100%; max-width: 100%;` を明示 |
| `.sidebar` の配置 | `position: fixed; width: 272px;` | **原本の positioning を保持するのが既定**。`SiteHeader` と競合する場合のみページ単位でオフセット／`sticky` 化を検討する（下記「サイドバー positioning の判断手順」） |
| `.content` の余白 | `margin-left: 272px; padding: 48px 56px;` | 原本通り。サイドバー幅と揃える |
| ボックスモデル | `box-sizing: border-box` | `.layout` に適用 |

**最頻出バグ**: `.layout` に `max-width: 1440px` 等を付けてしまい、原本の全幅レイアウトを壊す。
サイドバー付きページの `.layout` には **固定 `max-width` を付けない**。

#### サイドバー positioning の判断手順

`position: fixed` → `sticky` への変換は**一律の規則ではない**。
`fixed` のままで正しく動くページも多く、機械的に `sticky` へ変えると
`transform` を持つ祖先による包含ブロックの変化やスクロール境界のずれで
サイドバーが本文と一緒に流れてしまう。**まず原本を確認し、必要な場合だけ変える。**

1. **原本の positioning を読む** — `.sidebar` の `position` / `top` / `height` / `overflow` を控える
2. **`SiteHeader` + `DisclaimerBanner` と重なるかを確認する** —
   固定ヘッダーの高さは `var(--header-height, 60px)`。重ならないなら原本のまま転写する
3. **重なる場合のみ**、そのページに必要なオフセットを決める:
   - `position: fixed` を維持するなら `top: calc(var(--header-height, 60px) + 16px)` と
     `height: calc(100vh - var(--header-height, 60px) - 16px)` を対で指定する
     （`height: 100vh` のままだと下端がビューポート外へはみ出す）
   - `position: sticky` へ変えるなら、祖先に `transform` / `filter` / `overflow: hidden` が
     無いことを確認する（あると包含ブロックかスクロール境界が変わり `sticky` が効かない）
4. **`overflow-y` を転写する** — 原本が `overflow-y: auto` ならスクロール可能高さも合わせて指定する
5. **モバイル挙動を合わせて調整する** — オフキャンバス化するブレークポイントでは
   `position` に依存した `transform: translateX(-100%)` / `visibility: hidden` /
   `pointer-events: none` の三点セットが必要（`CLAUDE.md`「モバイル目次のアクセシビリティ状態を同期する」）

いずれの選択でも**原本の CSS を落とさないこと**が前提であり、
変更した場合は「なぜ原本の positioning を変えたか」を `docs/PROGRESS.md` かコミットメッセージに残す。

---

### 3. タイポグラフィ（テキスト色・サイズ）

**最も見落としやすい項目。** 原本は `p` / `li` / `ul` / `ol` に明示的な `color` を定義している
ことが多い。これを移行し忘れると、`globals.css` のデフォルト色（白/グレー）になり、
原本の `--color-text-secondary` (#a9b8cc) とは異なる見た目になる。

| セレクタ | よくある原本の定義 | 転写必須プロパティ |
|---|---|---|
| `p` | `color: var(--color-text-secondary); margin: 0 0 14px 0;` | `color`, `margin` |
| `p strong`, `li strong` | `color: var(--color-text-primary); font-weight: 500;` | `color`, `font-weight` |
| `ul`, `ol` | `color: var(--color-text-secondary); padding-left: 22px;` | `color`, `padding-left`, `margin` |
| `li` | `margin-bottom: 8px;` | `margin-bottom` |
| `h2` | `font-size: 18px; font-weight: 500; display: flex; align-items: center; gap: 10px;` | 全プロパティ |
| `h3` | `font-size: 16px; font-weight: 500; color: var(--color-text-primary);` | 全プロパティ |
| `a` | `color: var(--accent);` | `color`, `:hover` の `text-decoration` |

**CSS Module での書き方**:

```css
/* ❌ :global() なしで p / li を書くと CSS Module がハッシュ化して効かない */
p { color: var(--color-text-secondary); }

/* ✅ .layout スコープの子孫として :global() で指定 */
.layout :global(p) { color: var(--color-text-secondary); margin: 0 0 14px 0; }
.layout :global(p strong),
.layout :global(li strong) { color: var(--color-text-primary); font-weight: 500; }
.layout :global(ul),
.layout :global(ol) { color: var(--color-text-secondary); padding-left: 22px; margin: 0 0 16px 0; }
.layout :global(li) { margin-bottom: 8px; }
```

---

### 4. コードブロック（最重要・手戻り最多）

コードブロックは **3 層構造** で転写する：

#### 層 1: `pre` 要素のスタイル

```css
.layout :global(pre) {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-md);
  padding: 16px 18px;
  overflow-x: auto;
  margin: 16px 0;
}
```

#### 層 2: `pre code` のリセット（**最も忘れやすい**）

`<pre>` 内の `<code>` は**インラインコードスタイルを打ち消す**必要がある。
これを忘れると、コードブロック内に青い背景＋枠線が表示されて崩壊する。

```css
/* ✅ 必須リセット */
.layout :global(pre code) {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font-size: 13px;
  line-height: 1.6;
}
```

#### 層 3: 構文ハイライト色（原本の配色テーマに合わせる）

原本の `<style>` に構文ハイライト用のクラスが定義されている場合、その色をそのまま使う。
原本に定義がない場合は、コードブロック内の `<span>` のインラインスタイルや
class 名から配色を抽出する。

**原本の配色テーマを特定する手順:**

1. 原本 HTML の `<style>` 内で `.hl-*` / `.token-*` / `.syntax-*` 等のクラスを検索
2. 見つからない場合、コードブロック内の `<span style="color:...">` を検索
3. いずれもない場合、原本がプレーンテキスト（単色）なので構文ハイライトは不要

**配色テーマの転写例（Copilot ガイドの場合）:**

```css
/* 原本固有の配色。原本 HTML の <style> から抽出する */
.ck { color: #c678dd; }    /* キーワード — 原本の色をそのまま使う */
.cv { color: #61afef; }    /* 変数 */
.cs { color: #98c379; }    /* 文字列 */
.cw { color: #d19a66; }    /* 数値/フラグ */
.cc { color: #5c6370; font-style: italic; }  /* コメント */
.cm { color: #e5c07b; }    /* セクション/ディレクトリ */
```

> **注意**: 配色は原本ごとに異なる。SKILL.md §6 の早見表は**一例にすぎず**、
> 必ず原本の実際の色を確認して使うこと。

---

### 5. サイドバー（テキスト色・アイコン色）

サイドバーのテキスト色は `globals.css` のデフォルトとは異なることが多い。
原本のサイドバー関連 CSS を**すべて**転写すること。

| セレクタ | 転写必須プロパティ | よくある漏れ |
|---|---|---|
| `.sidebar` | `background`, `border-right`, `padding` | 背景色の漏れ |
| `.sidebarBrand span` | `color: var(--color-text-secondary)` | ブランド名の色 |
| `.sidebarBrand i` | `color: var(--accent)` | アイコンの色 |
| `.sidebarNav a` | `color: var(--color-text-secondary)` | **ナビリンクの文字色** |
| `.sidebarNav a i` | `color: var(--color-text-tertiary)` | **ナビアイコンの色** |
| `.sidebarNav a:hover` | `background`, `color: var(--color-text-primary)` | ホバー時の色変化 |
| `.sidebarNav a.active` | `background`, `color: var(--color-text-primary)`, `border`, `font-weight` | アクティブ状態の全プロパティ |
| `.sidebarNav a.active i` | `color: var(--accent)` | **アクティブ時のアイコン色** |

---

### 6. テーブル

```css
/* 全列左寄せの強制（globals.css の右寄せを打ち消す） */
.layout :global(th),
.layout :global(td),
.layout :global(thead th:not(:first-child)) {
  text-align: left !important;
}

/* 原本の thead th スタイルを転写 */
.layout :global(thead th) {
  background: var(--color-background-tertiary);
  color: var(--color-text-primary);
  font-weight: 500;
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border-secondary);
}

/* tbody td */
.layout :global(tbody td) {
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border-tertiary);
  color: var(--color-text-secondary);
  vertical-align: top;
}
```

---

### 7. callout / alert

variant ごとの配色を**全パターン**転写する。

| variant | 背景色 | 枠線色 | アイコン色 |
|---|---|---|---|
| `info` | `var(--color-background-info)` | `var(--color-border-secondary)` | `var(--color-text-info)` |
| `warn` / `danger` | `var(--color-background-danger)` | 原本から抽出 | `var(--color-text-danger)` |
| `good` / `success` | `var(--color-background-success)` | 原本から抽出 | `var(--color-text-success)` |
| `warning`（黄色系） | `var(--color-background-warning)` | 原本から抽出 | `var(--color-text-warning)` |

> **注意**: `warn` variant の背景色を黄色系（`--color-background-warning`）にする誤りが
> 頻発している。原本の CSS を確認し、赤系（`--color-background-danger`）か
> 黄色系（`--color-background-warning`）かを正確に判別すること。

---

### 8. 外部リソース（CDN リンク）

原本の `<head>` に外部 CSS/フォントの `<link>` タグがある場合、Next.js ページに挿入する。

**Tabler Icons webfont の例:**

原本:

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css" />
```

page.tsx での挿入（`next/head` は App Router では使えないため、`<link>` を直接 JSX に配置）:

```tsx
export default async function Page() {
  return (
    <div className={styles.layout}>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css"
      />
      {/* ... 残りのコンテンツ ... */}
    </div>
  );
}
```

**確認項目:**

- [ ] 原本 `<head>` 内の全 `<link rel="stylesheet">` タグを列挙
- [ ] 各リンクの CDN URL を page.tsx の JSX に `<link>` として転記
- [ ] アイコンフォントを使う `<i class="ti ti-xxx">` が正しく表示されることを確認

---

### 9. レスポンシブ対応

原本の `@media` クエリを**すべて**転写する。

よくあるブレークポイント:

```css
@media (max-width: 900px) {
  .sidebarToggle { display: block; }
  .sidebar {
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    visibility: hidden;
  }
  /* .sidebar.open → JavaScript で制御 */
  .content {
    margin-left: 0;
    padding: 32px 20px 70px 20px;
  }
}
```

**注意**: モバイルブレークポイントの表示切替は、サイドバーの `position` の選択に依存する
（§2「サイドバー positioning の判断手順」を先に済ませること）。
`position` を原本から変更した場合は、オフキャンバス化の `transform` /
`visibility` / `pointer-events` の指定もそのページ固有に検証し直す。

---

## 照合完了の確認

すべてのチェック項目を通過したら、以下のコマンドで最終確認:

```bash
# 1. 未定義 CSS 変数がないか
bash .claude/skills/nextjs-page-migration/references/check-css-vars.sh \
  web-next/app/<provider>/<slug>/page.module.css

# 2. 原本照合監査
bun .claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
  archive/html/<ベンダー>/<原本>.html \
  web-next/app/<provider>/<slug>/page.tsx

# 3. テスト
(cd web-next && bun run test app/<provider>/<slug>/page.test.tsx)
```

---

## 関連ドキュメント

- `SKILL.md` — メインスキルファイル（§5 Step 2 から本チェックリストを参照）
- `design-contract-tests.md` — デザイン契約テストのパターン集
- `implementation-reference.md` — 実装リファレンス（TocObserver / コードブロック構造等）
- `source-parity-audit.md` — コンテンツ照合監査の運用手順
