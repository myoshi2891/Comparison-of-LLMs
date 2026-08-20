# デザイン契約テスト — 実装パターン

(最終更新日: 2026-08-19)

**用途**: SKILL.md §「デザイン契約」のうち、D-1〜D-8 のデザイン契約テストで
自動検知するテストパターンを詳述する。CSS Modules ではクラス名が変換されるため、
DOM 上の `data-testid` / `data-variant` 属性でデザイン意図を表現してテストする。

---

## 背景と原則

Vitest では CSS Modules の `styles.someClass` から変換後のクラス名を取得できるため、
DOM 上のクラス存在は検証できる。一方、JSDOM では CSS Modules の実 CSS 値が適用されないため、
「背景色が赤か否か」のような見た目は検証できない。

**代替戦略**:

1. **`data-variant` 属性** でセマンティクスを DOM に明示 → テストで variant の存在を検証
2. **`data-testid` 属性** でコンポーネントの役割を表現 → querySelector で選択
3. **元 HTML の CSS を page.module.css に 100% 転写** → 目視確認でデザインを担保

---

## 必須 data-testid 属性一覧（ガイドページ共通）

| 要素 | data-testid | data-variant | 補足 |
|---|---|---|---|
| セクションタグ（stepTag相当） | `step-tag` | — | 全セクション分必須 |
| callout/alert ボックス | `callout` | `info` / `warn` / `good` | variant で色区別 |
| callout 内ラベル | `callout-label` | — | uppercase monoラベル |
| 引用ブロック（voice/blockquote） | `voice` | — | |
| 引用者名 | `voice-who` | — | |
| Mermaid ラッパー | — | — | `[data-testid="mermaid-diagram"]` はモック側で付与 |

---

## 正しい page.tsx の書き方

```tsx
{/* ✅ stepTag — data-testid="step-tag" を全セクション分付与 */}
<span className={styles.stepTag} data-testid="step-tag">Step 01</span>

{/* ✅ callout.info */}
<div className={`${styles.callout} ${styles.info}`}
     data-testid="callout"
     data-variant="info">
  <p>
    <span className={styles.label} data-testid="callout-label">注意</span>
    本文テキスト
  </p>
</div>

{/* ✅ callout.warn — danger(赤)セマンティクス */}
<div className={`${styles.callout} ${styles.warn}`}
     data-testid="callout"
     data-variant="warn">
  <p>
    <span className={styles.label} data-testid="callout-label">警告</span>
    本文テキスト
  </p>
</div>

{/* ✅ voice/blockquote */}
<blockquote className={styles.voice} data-testid="voice">
  <span className={styles.who} data-testid="voice-who">著者名</span>
  <p>引用テキスト</p>
</blockquote>
```

---

## デザイン契約テストの書き方

```tsx
// page.test.tsx — デザイン契約テスト追加例

it("callout.warn が data-variant='warn' を持ち danger セマンティクスで区別される", () => {
  const { container } = render(<Page />);
  const warnCallouts = container.querySelectorAll(
    "[data-testid='callout'][data-variant='warn']"
  );
  expect(warnCallouts.length).toBeGreaterThan(0);
  for (const callout of Array.from(warnCallouts)) {
    const label = callout.querySelector("[data-testid='callout-label']");
    expect(label).not.toBeNull();
  }
});

it("stepTag が各セクションに存在し data-testid='step-tag' を持つ", () => {
  const { container } = render(<Page />);
  const stepTags = container.querySelectorAll("[data-testid='step-tag']");
  // セクション数（16なら16）
  expect(stepTags.length).toBe(16);
  const texts = Array.from(stepTags).map((el) => el.textContent);
  expect(texts).toContain("Overview");
  expect(texts).toContain("Step 01");
  expect(texts).toContain("Appendix");
});

it("blockquote.voice が data-testid='voice' を持ち voice-who 子要素がある", () => {
  const { container } = render(<Page />);
  const voiceBlocks = container.querySelectorAll("[data-testid='voice']");
  expect(voiceBlocks.length).toBeGreaterThan(0);
  for (const block of Array.from(voiceBlocks)) {
    const who = block.querySelector("[data-testid='voice-who']");
    expect(who).not.toBeNull();
  }
});

it("callout.label が data-testid='callout-label' を持つ", () => {
  const { container } = render(<Page />);
  const labels = container.querySelectorAll("[data-testid='callout-label']");
  expect(labels.length).toBeGreaterThan(0);
});
```

---

## D-5〜D-8: CSS/スタイリング契約テスト（2026-08-19 追加）

D-1〜D-4 はコンテンツ構造（callout / stepTag / voice）の契約だが、
D-5〜D-8 は **CSS/スタイリングの移行漏れを防止する**契約テストである。

### 追加の data-testid / data-* 属性一覧

| 要素 | data-testid | 補足 |
|---|---|---|
| サイドバーナビゲーション | `sidebar-nav` | サイドバー全体の `<ul>` に付与 |
| サイドバーナビリンク | `sidebar-nav-link` | 各 `<a>` に付与 |
| コードブロックラッパー | `code-block` | `<pre>` または `.codeWrap` に付与 |
| レイアウトルート | `layout-root` | `.layout` 最外殻の `<div>` に付与 |

### 正しい page.tsx の書き方

```tsx
{/* ✅ layout-root */}
<div className={styles.layout} data-testid="layout-root">

{/* ✅ sidebar-nav */}
<ul className={styles.sidebarNav} data-testid="sidebar-nav">
  <li>
    <a href="#overview" className={styles.tocLink}
       data-testid="sidebar-nav-link">
      <i className="ti ti-layout-dashboard" />
      全体像
    </a>
  </li>
</ul>

{/* ✅ code-block */}
<pre data-testid="code-block">
  <code>...</code>
</pre>
```

### テスト実装パターン

```tsx
// 原本から機械抽出した期待値。適用有無もここで宣言する
// （--emit-headings と同様、原本を読んで一度だけ書き出す）。
const EXPECTED_SIDEBAR_HREFS = [
  "#overview",
  "#step-01",
  "#appendix",
] as const;
const EXPECTED_CODE_BLOCK_COUNT = 7;
const EXPECTED_STYLESHEET_HREFS = [
  "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css",
] as const;

// D-5: サイドバーナビが原本の TOC と順序込みで一致する（原本にサイドバーがある場合のみ）
it("サイドバーナビのリンクが原本の TOC と順序込みで完全一致する", () => {
  const { container } = render(<Page />);
  const sidebarNav = container.querySelector("[data-testid='sidebar-nav']");
  expect(sidebarNav).not.toBeNull();

  const navLinks = Array.from(
    container.querySelectorAll("[data-testid='sidebar-nav-link']")
  );
  // ❌ length > 0 では 1 本でも通る。href 配列を丸ごと比較する
  expect(navLinks.map((link) => link.getAttribute("href"))).toEqual([
    ...EXPECTED_SIDEBAR_HREFS,
  ]);
  // アンカーが実在する見出しを指すこと
  for (const href of EXPECTED_SIDEBAR_HREFS) {
    expect(container.querySelector(`[id='${href.slice(1)}']`)).not.toBeNull();
  }
});

// D-6: コードブロックが原本と同数あり、すべて code 子要素を持つ（原本にコードブロックがある場合のみ）
it("コードブロックが原本と同数存在し、各ブロックが <code> を持つ", () => {
  const { container } = render(<Page />);
  const codeBlocks = Array.from(
    container.querySelectorAll("[data-testid='code-block']")
  );
  // ❌ if (codeBlocks.length > 0) で囲むと 0 件でも通ってしまう。無条件に件数を要求する
  expect(codeBlocks).toHaveLength(EXPECTED_CODE_BLOCK_COUNT);
  for (const block of codeBlocks) {
    expect(block.querySelector("code")).not.toBeNull();
  }
});

// D-6b: pre code のリセットが page.module.css に存在する（JSDOM では実 CSS が効かないため原文を検査）
it("page.module.css が pre code のスタイルリセットを持つ", () => {
  const css = readFileSync(new URL("./page.module.css", import.meta.url), "utf8");
  const preCodeRule = /:global\(pre code\)\s*\{([^}]*)\}/.exec(css);
  expect(preCodeRule).not.toBeNull();
  expect(preCodeRule?.[1]).toMatch(/background:\s*none/);
  expect(preCodeRule?.[1]).toMatch(/border:\s*none/);
  expect(preCodeRule?.[1]).toMatch(/color:\s*inherit/);
});

// D-7: 原本 <head> の外部 CDN リンクが全件挿入されている（原本に CDN がある場合のみ）
it("原本の外部 CDN スタイルシートが全件・完全一致で挿入されている", () => {
  const { container } = render(<Page />);
  const hrefs = Array.from(
    container.querySelectorAll("link[rel='stylesheet']")
  ).map((link) => link.getAttribute("href"));
  // ❌ some(h => h?.includes("tabler")) はバージョン差異や重複を見逃す
  expect(hrefs).toEqual([...EXPECTED_STYLESHEET_HREFS]);
});

// D-8: layout-root が .layout 最外殻であり全幅で展開する（全ページ無条件）
it("layout-root が .layout 最外殻であり width: 100% を持つ", () => {
  const { container } = render(<Page />);
  const layoutRoot = container.querySelector("[data-testid='layout-root']");
  expect(layoutRoot).not.toBeNull();
  // 最外殻であること — container の直下に居る
  expect(layoutRoot?.parentElement).toBe(container);
  // .layout クラスそのものであること（別要素へ付け替えられていないこと）
  expect(layoutRoot?.classList.contains(styles.layout)).toBe(true);

  // JSDOM は CSS Modules の実値を解決しないため、CSS 原文で全幅を検証する
  const css = readFileSync(new URL("./page.module.css", import.meta.url), "utf8");
  const layoutRule = /^\.layout\s*\{([^}]*)\}/m.exec(css);
  expect(layoutRule).not.toBeNull();
  expect(layoutRule?.[1]).toMatch(/width:\s*100%/);
});
```

> **適用条件**: **D-8 は原本の内容に依存せず全ページで必須**である
> （`.layout` は移植先が必ず持つ最外殻であり、全幅レイアウト崩れは原本の要素構成と無関係に起こる）。
> **D-5〜D-7 は条件付き**で、原本にサイドバー / コードブロック / CDN リンクがある場合のみ適用する。
> 原本にない要素の契約テストを書くのは faithful 移植に反する。
>
> **弱い契約にしないための原則**: 期待値は**ページごとの配列・件数**として宣言し、
> `toEqual` で順序込みに比較する。`length > 0` / `some(...)` / `if (…) { expect(…) }` は
> 「要素を全部落としても通る」ため契約として認めない。

---

## CSS — 原本 HTML を 100% 転写する原則

原本 HTML の `<style>` ブロック（または `.css`）をそのまま `page.module.css` に転写する。
以下は **よくある移行バグ（デザイン差異の典型例）**:

| 要素 | 原本 HTML（正） | よくある誤り |
|---|---|---|
| `thead th` 背景 | `var(--accent-soft)` 青系 | `var(--bg)` ベージュ |
| `callout.warn` 背景 | `var(--danger-soft)` 赤系 | `var(--gold-soft)` 黄系 |
| `callout.label` | mono・uppercase・`var(--ink-faint)` | 太字・通常色 |
| `voice/blockquote` | `gold-soft` 背景・`gold` border | `surface` 背景・`accent` border |
| `stepTag` | border-less mono goldラベル | badge 背景あり |
| `section` 区切り | `border-bottom: 1px solid var(--border)` | なし |
| `tbody` ストライプ | `tr:nth-child(even)` `#fbfaf7` | なし |
| **インライン `code`** | 淡青背景＋濃青文字 (`var(--accent-soft)`) | 単色・文字のみ・ダーク背景 |
| **コードブロック構文ハイライト** | 鮮やかなマルチカラー (紫/青/緑/黄/赤/グレー) | 単色プレーンテキスト放置 |
| **コードブロック行改行** | `<div className={styles.codeLine}>` で1行毎ラッパー | 生テキスト直接配置 (`\n` 崩れ) |
| **`pre code` リセット** | `background: none; border: none; color: inherit;` | インラインコードスタイルがブロック内に漏れる |
| **Mermaid 図解テーマ** | 原本の `theme: 'base'` (白/青/金ライトテーマ) | デフォルトの `dark` (真っ黒) |
| **運用チェックリスト** | 原本 HTML のリスト／カード／表構造 | 原本と異なる構造への変換 |
| **サイドバーナビ文字色** | `color: var(--color-text-secondary)` | globals.css デフォルト色のまま |
| **サイドバーアイコン色** | `color: var(--color-text-tertiary)` / active 時 `var(--accent)` | 色指定なし |
| **`p` / `li` の文字色** | `color: var(--color-text-secondary)` | globals.css デフォルト（白/グレー）|
| **リスト要素の型** | 原本が `<ol>` なら `<ol>`、`<ul>` なら `<ul>` | `<ol>` を `<ul>` に変えてしまう |
| **全幅レイアウト** | `width: 100%` / `max-width: none` | `max-width: 1440px` 等の制約 |
| **CDN リンク** | `<link>` で Tabler Icons 等を読み込み | リンクタグ挿入忘れ |

チェックリストの正しいレイアウトは原本依存である。たとえば `openai-codex-guide` は縦1列リストだが、
原本がカードグリッドならカードグリッドを、表なら表を維持し、別の構造へ置き換えない。

**確認方法**: 原本 HTML を静的サーバーで表示し、Next.js 版と並べてスクリーンショット比較する。

---

## テスト実行コマンド（重要: `bun run test` を使う）

```bash
# ✅ 正しいコマンド（vitest 経由 — jsdom 環境が適用される）
cd web-next && bun run test

# ❌ 誤ったコマンド（Bun のネイティブランナー — jsdom なしで全テスト失敗する）
bun test app/codex/openai-codex-guide/page.test.tsx
```

**理由**: `bun test` は Bun のビルトインランナーで動作し、
`vitest.config.ts` の `environment: "jsdom"` 設定が一切適用されない。
`document is not defined` エラーが全テストで発生し、1テスト（metadata）以外が全滅する。
**必ず `bun run test`（= `vitest run`）を使うこと。**

---

## 参考実装

- `web-next/app/codex/openai-codex-guide/page.test.tsx` — デザイン契約テストの最新実装
- `web-next/app/codex/openai-codex-guide/page.tsx` — `data-testid` / `data-variant` 付与例
- `web-next/app/codex/openai-codex-guide/page.module.css` — 原本 HTML CSS 100% 転写例
