# デザイン契約テスト — 実装パターン

**用途**: SKILL.md §「8つの必須契約テスト」のうち、デザイン（見た目）の破壊を
自動検知するテストパターンを詳述する。CSS Modules ではクラス名が変換されるため、
DOM 上の `data-testid` / `data-variant` 属性でデザイン意図を表現してテストする。

---

## 背景と原則

CSS Modules のクラス名はビルド時にハッシュ化され、テスト環境では
`styles.someClass` → `undefined` になる（CSS は適用されない）。
そのため「背景色が赤か否か」は JSDOM ではテストできない。

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
| **Mermaid 図解テーマ** | 原本の `theme: 'base'` (白/青/金ライトテーマ) | デフォルトの `dark` (真っ黒) |
| **運用チェックリスト** | 縦1列リスト＋破線＋`hover`/`checked` 装飾 | 勝手に 2 列カードグリッド化 |


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
