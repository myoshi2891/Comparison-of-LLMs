---
name: nextjs-page-migration
description: >
  Migrate static HTML/Markdown guide pages from archive/ to web-next/ App Router page.tsx using
  TDD, and maintain already-migrated pages. Enforces a mechanical source-parity audit that blocks
  content omission (the most common defect in this repo).
  TRIGGER when the user says any of the following (Japanese or English):
  - "新規ガイドページを追加" / "ガイドページを移行" / "ページを保守" / "移行漏れ" / "転写漏れ"
  - "add new guide page" / "migrate guide page" / "nextjs page migration" / "missing sections"
  - guide-page layout/centering maintenance: "図解が左寄せ" / "図解を中央寄せ" /
    "コンテンツが左寄り" / "本文の幅がバランス悪い" / "diagram not centered" /
    "content column width" (both Mermaid and hand-coded flex/HTML diagrams)
  - design mismatch: "デザイン違う" / "スタイルがおかしい" / "テーブルヘッダーの色が" /
    "calloutの色が" / "stepTagが" / "voiceのスタイルが" / "コードブロックの色" /
    "図解の色が違う" / "ハイライトが効いていない"
  Applies project-specific patterns: source-parity audit script, SiteHeader, DisclaimerBanner,
  page-registry registration, CSS Modules, span-token code highlighting, Mermaid lazy loading,
  diagram centering, and the content-width policy.
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

(最終更新日: 2026-08-14)

## 0. このスキルが解決する問題

Phase A–F で 18 枚のガイドページが `web-next/` App Router に全移行完了し、以降も
新規ページが追加され続けている。**この作業で繰り返し発生している最大の不具合は
「移行漏れ」＝原本のセクション・リスト項目・参考リンクの脱落**である。

原本が 1,000 行を超えるガイドでは、人間も AI も目視では確実に見落とす。
したがって本スキルは **照合を機械にやらせる**ことを中核に据える。

> **本スキルは Claude / Gemini / Codex いずれのエージェントでも同じ手順で実行できるように書かれている。**
> エージェント固有の機能には依存しない。必要なのは `bun` と `git` と本リポジトリだけである。

---

## 1. 作業開始前に必ず読むファイル（順序固定）

1. **`CLAUDE.md`**（リポジトリルート）— 全体の編集ルール・禁止事項・アーキテクチャ
2. **`docs/PROGRESS.md`** — 現在のフェーズ・テスト数・ネクストアクション
3. **このファイル** — 標準手順と実装パターン
4. **`.claude/rules/tdd-mandatory-cycle.md`** — TDD 必須サイクル & コミット分割ルール
5. **`.claude/skills/nextjs-page-migration/references/source-parity-audit.md`** — 原本照合監査（必読）

---

## 2. 現行スタックの仕様（2026-08-13 時点の実測値）

推測で書かず、以下の実値に従うこと。バージョンは `web-next/package.json` が正。

| 項目 | 値 | 移行作業への影響 |
|---|---|---|
| Next.js | **16.2.11** | App Router のみ。Turbopack が dev / build の既定。`next lint` は廃止済（本リポジトリは Biome を使う） |
| React | **19.2.4** | Server Component が既定。`"use client"` は明示が必要 |
| TypeScript | 5.x（`strict` + `noUnusedLocals` + `noUnusedParameters` + `erasableSyntaxOnly`） | **enum / namespace は使用禁止**。未使用の import / 引数はビルドエラー |
| ビルド出力 | `output: "export"`（`web-next/next.config.ts`） | pure SSG。サーバー実行時 API（`cookies()` / `headers()` / dynamic route handler 等）は使えない |
| 画像 | `images.unoptimized: true` | `next/image` の最適化は無効。通常の `<img>` と同等に扱う |
| テスト | Vitest 4.1.4 + jsdom 29 + Testing Library | 実行は必ず `bun run test`（後述） |
| Lint / Format | Biome 2.4.x | `bun run lint:fix`（パス引数なし）は**禁止**。必ずファイル単位で指定する |
| Mermaid | 10.9.8 | `components/docs/MermaidDiagram.tsx` 経由でのみ使う |
| パッケージマネージャ | **bun** | `npm` / `npx` / `node` でのスクリプト実行は禁止 |

### Next.js 16 で特に踏みやすい落とし穴

1. **`"use client"` なファイルは `export const metadata` を持てない。**
   `page.tsx` は Server Component に保ち、スクロール監視などは `TocObserver.tsx` 等の
   クライアント子コンポーネントへ切り出す。
   （既に全体が `"use client"` になっている `/code-review/coderabbit-guide` と
   `/code-review/sonar-qube` のみ、ルート単位の `layout.tsx` から metadata を供給する例外）
2. **Client Component は Server Component から直接 import してよい。**
   `MermaidDiagram` は `"use client"` 付きなので、`page.tsx` からそのまま import する。
   `next/dynamic` の `ssr: false` を Server Component で使ってはならない（Next 15 以降エラー）。
3. **`output: "export"` 下では動的サーバー機能が使えない。** ガイドページは静的なので通常問題にならないが、
   フォームや検索の実装で `searchParams` を使う場合はクライアント側（`useSearchParams`）で処理する。
4. **Turbopack が既定になったため、`web-next/.next` の古いキャッシュが CSS 変数を壊すことがある。**
   `globals.css` / `page.module.css` を触ったら `.claude/rules/css-cache-reset.md` に従い
   `rm -rf web-next/.next` してから dev を再起動する。

---

## 3. ⚠️ テスト実行コマンド（最重要・必読）

```bash
# ✅ 正しい（vitest 経由 — jsdom 環境が適用される）
(cd web-next && bun run test)

# ✅ 単一ファイルだけ流す（開発中の高速ループ）
(cd web-next && bun run test app/claude/managed-agents/page.test.tsx)

# ❌ 禁止（Bun ネイティブランナー — jsdom なし → document is not defined で全滅）
bun test app/claude/managed-agents/page.test.tsx
```

**`bun test` と `bun run test` は全く別コマンド。**
`bun test` は `vitest.config.ts` を無視するため `environment: "jsdom"` が効かず、
`document is not defined` で metadata テスト以外が全滅する。**必ず `bun run test` を使う。**

現状のベースライン（2026-08-14 に `npm test` で実測）: **164 files / 1467 tests pass**。
テスト数が減っていたら何かを壊している。**収集失敗（collect error）もブロッキング失敗として扱う。**

---

## 4. TDD 必須サイクル

常に **Red → Green → Refactor → Docs** の順で進め、**1 コミット 1 フェーズ**とする。
詳細は `.claude/rules/tdd-mandatory-cycle.md`。要点のみ:

| フェーズ | 内容 | コミットメッセージ |
|---|---|---|
| Red | 失敗する契約テストを先に書く | `test(<scope>): add failing spec for <page>` |
| Green | 原本照合監査を通してから実装 | `feat(<scope>): <実装内容>` |
| Refactor | lint / typecheck / build を通す | `refactor(<scope>): <整理内容>` |
| Docs | `docs/PROGRESS.md` 等の同期 | `chore(docs): update docs/PROGRESS.md — <page>` |

**テスト・実装・ドキュメントを 1 コミットにまとめることは重大な規約違反。**

---

## 5. 新規ページ追加の標準手順

### Step 0: 原本を特定し、インベントリを取る

```bash
# 原本の所在（Git 追跡下。削除禁止）
ls archive/html/<ベンダー>/
ls archive/md/<ベンダー>/

# 原本の規模と構成を機械的に把握する
bun .claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
  archive/html/<ベンダー>/<原本>.html \
  web-next/app/<provider>/<slug>/page.tsx --emit-headings
```

`--emit-headings` が出力する `EXPECTED_H2` / `EXPECTED_H3` を Step 1 のテストに貼る。
（page.tsx がまだ無い段階では、監査対象として空ファイルか既存の近いページを指定してよい。
見出し配列の生成には原本しか使わない。）

### Step 1: [Red] 契約テストの作成

`web-next/app/<provider>/<slug>/page.test.tsx` を作成する。
ファイル先頭に `// @vitest-environment jsdom` を書いて環境を明示する。

原本の要素種別に依存しない **最低 12 契約**（S-1〜S-4 / C-1〜C-5 / Q-1〜Q-3）を書く。
C-6 と D-1〜D-4 は下記の適用条件に該当する場合のみ追加する。
**件数だけを見る弱いテストは契約として認めない。**

#### S. 原本照合契約（4 件・必須）

| ID | 内容 | 検証手段 |
|---|---|---|
| S-1 | `h2` の見出しが**原本と完全一致**（順序込み） | `expect(actual).toEqual([...EXPECTED_H2])` |
| S-2 | `h3` の見出しが**原本と完全一致**（順序込み） | `expect(actual).toEqual([...EXPECTED_H3])` |
| S-3 | 原本の外部リンク URL が**全件存在** | URL 集合の包含検証 |
| S-4 | 全 `h2`/`h3` が**一意な id** を持ち、TOC のアンカーが全て実在する見出しを指す | id 重複検査 + アンカー解決検査 |

> 実装例とゲートの考え方: `references/source-parity-audit.md`

#### C. コンテンツ契約（5 件必須 + 1 件条件付き）

| ID | 内容 |
|---|---|
| C-1 | `h1` のテキストが完全一致する |
| C-2 | クイックナビ（TOC リンク）の件数と `href="#..."` 形式 |
| C-3 | サイドバー TOC の初期アクティブ状態（`styles.active`）が存在する |
| C-4 | 外部リンク全件に `target="_blank"` **かつ** `rel="noopener noreferrer"` |
| C-5 | 内部リンクに `.html` 拡張子が含まれない |
| C-6 | **原本に Mermaid 図解がある場合のみ必須**。全図解が専用ラッパーに包まれ、原本から抽出した正規化済み Mermaid ソースと `MermaidDiagram` の全 `chart` 値が**順序・内容・出現回数込みで完全一致**する |

#### D. デザイン契約（原本に対応要素がある場合のみ必須）

| ID | 適用条件 | 内容 |
|---|---|---|
| D-1 | 原本に callout / alert がある | `callout` が `data-variant="info"/"warn"/"good"` で区別され、原本にある variant がすべて存在する |
| D-2 | 原本に warn callout がある | `callout[data-variant="warn"]` が `callout-label` 子要素を持つ |
| D-3 | 原本に step / stepTag がある | `stepTag` が `data-testid="step-tag"` を持ち、件数が**原本の step 数**と一致する |
| D-4 | 原本に voice / blockquote がある | `voice`/`blockquote` が `data-testid="voice"` と `voice-who` 子要素を持つ |

原本に warn callout・step・voice / blockquote 等が存在しない場合、対応する D 契約は要求しない。
不在要素を作成して契約数を満たすことは faithful 移植ではない。

> 実装例: `references/design-contract-tests.md`

#### Q. 品質契約（3 件・必須）

| ID | 内容 |
|---|---|
| Q-1 | `TocObserver.test.tsx` で `fireEvent.scroll` により**アクティブ見出しが正しく遷移する**ことを単体検証 |
| Q-2 | `export const metadata` の `title` / `description` が空でなく、`title` が h1 と整合する |
| Q-3 | 見出し階層が飛ばない（`h1 → h3` のようなスキップが無い）ことを検証 |

#### 禁止するテストの書き方（弱い契約）

```tsx
// ❌ 件数だけ — セクションを 1 つ落として別を重複させれば通ってしまう
expect(container.querySelectorAll("h2")).toHaveLength(11);

// ❌ 存在するかだけ — 1 個でも通る
expect(container.querySelectorAll("pre, code").length).toBeGreaterThan(0);

// ❌ 部分一致 — 本文が半分消えても通る
expect(container.textContent).toContain("Managed Agents");
```

```tsx
// ✅ 完全一致（順序込み）で「原本と同じものが同じ順に並ぶ」ことを保証する
expect(Array.from(container.querySelectorAll("h2")).map(headingText))
  .toEqual([...EXPECTED_H2]);
```

**Red の確認**: `(cd web-next && bun run test app/<provider>/<slug>/page.test.tsx)` を実行し、
**テストが失敗することを目で確認してからコミットする**。
「まだ page.tsx が無いので import エラー」も正当な Red である。

### Step 2: [Green] page.tsx の実装

> [!CAUTION]
> **100% 完全移植ルール（絶対ルール）**
> ソース HTML / Markdown の **要約・省略・縮約・部分抽出・代表例のみの記述は重大な規約違反**である。
> 元ファイルの全セクション、全サブセクション、全リード文・本文段落、全リスト項目、全コードブロック、
> 全 SVG、全 callout/alert、全 table、全参考文献/外部リンクを、何一つ落とさずに
> **100% 漏れなく JSX へ完全転写**すること。**見出しの言い換えも違反**（原本の文言のまま使う）。

- **Server Component デフォルト**。`"use client"` は `useState` / `useEffect` が必要な場合のみ
- **ファイル 4 点セット**: `app/<provider>/<slug>/` 配下に
  `page.tsx` / `page.module.css` / `page.test.tsx` / `TocObserver.tsx`
- **`SiteHeader` / `DisclaimerBanner` は `app/layout.tsx` にマウント済み。ページ側で再インクルードしない**

#### 🎨 スタイリング防犯原則（過去の手戻りを全網羅）

| 対象 | 原本 HTML（正） | よくある誤り（絶対禁止） | 対策 |
|---|---|---|---|
| **インライン `code`** | 淡青背景＋濃青文字 (`var(--accent-soft)`) | 単色・文字のみ・ダーク背景 | `.layout :global(code)` に `background`/`color` 設定 |
| **コードブロック構文ハイライト** | 鮮やかなマルチカラー | 単色プレーンテキスト放置 | JSX 内で `.ck`, `.cv`, `.cs`, `.cw`, `.cc`, `.cm` の `<span>` トークン化 |
| **コードブロック行改行** | `<div className={styles.codeLine}>` で 1 行毎ラッパー | 生テキスト直接配置（`\n` 崩れ） | `.codeLine`（`white-space: pre`）で完全に囲む |
| **コードブロックのインデント** | Python / YAML の先頭空白 | Biome / JSX の空白圧縮で消失 | 先頭ノードに `{"  "}` / `{"    "}` を明示的に埋め込む |
| **Mermaid 図解テーマ** | 原本の `theme: 'base'`（白/青/金ライト） | デフォルトの `dark`（真っ黒） | `MermaidDiagram` に `theme="base"` と `themeVariables` を明示渡し |
| **チェックリスト構造** | 原本のリスト／カード／表構造 | 別構造への変換 | 原本の要素構造と CSS をそのまま転写 |
| **callout.warn** | 赤系背景 (`var(--danger-soft)`) | 黄色/金系 (`gold-soft`) | `danger-soft` (#fbebe6) を正しく適用 |
| **thead th** | 青系背景 (`var(--accent-soft)`) | ベージュ背景 (`var(--bg)`) | `thead th` に `var(--accent-soft)` を上書き定義 |

#### ⚠️ CSS Module 地雷チェックリスト

**① `globals.css` に存在しない CSS 変数を `var()` で参照しない**
参照すると `bun run build` は通るのに**実行時に配色が全崩壊**する。
ページ固有変数は必ず `.layout` / `.root` スコープ内に自己定義してから使う。

```css
/* ❌ NG */
.card { background: var(--bg-card); }

/* ✅ OK */
.layout { --bg-card: #0f2038; }
.card { background: var(--bg-card); }
```

**② 表の全列左寄せを強制する**
`globals.css` の `thead th:not(:first-child) { text-align: right }` を打ち消す必要がある。

```css
.tableScroll :global(th), .tableScroll :global(td),
.tableWrap :global(th), .tableWrap :global(td),
.tableScroll :global(thead th:not(:first-child)) { text-align: left !important; }
```

**③ アンカーめり込み防止**

```css
h2, h3 { scroll-margin-top: calc(var(--header-height, 60px) + 80px); }
```

**④ 本文カラム幅の方針（レイアウト別）**

- **サイドバー付きページ**（大半）: `.main` は `min-width: 0` + `width: 100%` の流動幅。固定 `max-width` を付けない
- **単一カラムページ**: 中央寄せコンテナに `max-width: 1440px` + `margin: 0 auto`（サイトの `.container` と同値）

### Step 3: [Green の前提] 原本照合監査を通す

**実装が終わったら、コミット前に必ず監査スクリプトを実行する。終了コード 0 が Green の前提条件。**

```bash
bun .claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
  archive/html/<ベンダー>/<原本>.html \
  web-next/app/<provider>/<slug>/page.tsx
echo "exit=$?"   # 0 でなければ移行漏れがある
```

漏れが出た場合の分類と対処は `references/source-parity-audit.md` §1 / §5 に従う。
「正当な差分」と判断した項目は**理由をコミットメッセージか `docs/PROGRESS.md` に書き残す**。

### Step 4: [Green の前提] page-registry への登録

**新規ページは `web-next/lib/page-registry.ts` へ登録して初めて Green とする。**
レジストリは鮮度表示・What's New・sitemap・**ナビゲーション**・RSS・検索・関連リンクの導出元であり、
未登録のページはどこからも辿れない。

```ts
{
  slug: "/claude/managed-agents",
  title: "Managed Agents",
  group: "Providers",          // lib/nav-taxonomy.ts の NAV_GROUPS から選ぶ
  category: "Claude",          // Providers グループでは必須
  provider: "claude",
  topics: ["agent", "claude"],
  summary: "…1〜2 文の要約…",
  addedAt: "2026-08-13",       // YYYY-MM-DD
  lastReviewed: "2026-08-13",
},
```

`tests/page-registry-coverage.test.ts` と `tests/nav-derivation.test.ts` が
登録漏れ・幽霊エントリを機械検知する。**ナビ（`components/site/nav-links.ts`）への直書きは禁止。**

### Step 5: 図解の中央寄せ・カラー統一

#### (a) Mermaid 図解

- `components/docs/MermaidDiagram.tsx` を使用する（`"use client"` 付きなので Server Component から直接 import 可）
- 原本がライト基調なら `theme="base"` + `themeVariables={THEME_VARS_CONST}`（**モジュールレベル定数**）を渡す
- Mermaid 記述は**左端揃え必須**（インデント混入は構文エラー）
- **レイアウトはコンポーネントが自己完結**。ページ側で `:global(.mermaid)` / `:global(svg)` に
  `width` / `max-width` / `display:flex` を書かない（`.claude/rules/mermaid-diagram-layout.md`）
- 詳細は `.claude/skills/fix-mermaid/SKILL.md` Part 4

#### (b) 手書き（非 Mermaid）の図解

- 1 行横並び: `width: fit-content; margin-inline: auto`
- 折り返しあり: `justify-content: center`

### Step 6: コードハイライト用クラス早見表

`styles.` を前置して使用する。

| クラス | 原本カラー | 用途 |
|---|---|---|
| `ck` | 紫 `#d89be0` | キーワード (`codex`, `function`, `class`) |
| `cv` | 青 `#8fb2ff` | 変数 / 属性名 (`model`, `command`, `exec`) |
| `cs` | 緑 `#b7d99a` | 文字列 |
| `cw` | 黄 `#e8b168` | 数値 / フラグ (`--last`, `true`, `42`) |
| `cc` | グレー `#6b6f87` | コメント（斜体 `# comment`） |
| `cm` | 金 `#f2c572` | セクション / ディレクトリ (`[features]`, `my-skill/`) |

### Step 7: [Refactor] ローカル検証

```bash
(cd web-next && bun run lint app/<provider>/<slug>)   # Biome。パス指定必須
(cd web-next && bun run typecheck)                    # tsc --noEmit
(cd web-next && bun run test)                         # 全件。164 files / 1467 tests 以上
(cd web-next && bun run build)                        # Antigravity 環境では実行禁止
```

### Step 8: [Docs] 同期とコミット前チェック

```bash
# PII / ローカル絶対パスの混入チェック（.claude/rules/no-absolute-paths.md）
git diff --cached | grep -E '^\+[^+]' | grep -E '(/Users/|/home/|C:\\Users\\)' | grep -vE 'johndoe'
```

`docs/PROGRESS.md` を更新する。構造変更（registry / nav / 共有スキーマ）を伴う場合は
`plans/README.md` / `CLAUDE.md` / `GEMINI.md` も同期する（`.claude/rules/tdd-mandatory-cycle.md` §4）。

---

## 6. 既存ページを保守するときの手順

1. 変更前に監査スクリプトを実行し、**現状のベースライン**を記録する
2. 変更を加える
3. 監査スクリプトを再実行し、**新たな漏れが発生していない**ことを確認する
4. `EXPECTED_H2` / `EXPECTED_H3` を `--emit-headings` で再生成してテストを更新する
5. `(cd web-next && bun run test)` で全件 Green を確認する

原本そのものを更新した場合（月次更新で新情報を追記した等）は、
**原本 → page.tsx の順に反映し、最後に監査で両者が揃っていることを確認する**。

---

## 7. Constraints（禁止事項）

### 内容に関する禁止

- **原本の要約・省略・縮約・代表抽出**（絶対ルール違反）
- **見出しの言い換え** — 原本の文言をそのまま使う
- **監査スクリプトが exit 1 の状態で Green コミットすること**
- **`archive/` の原本を削除・改変すること**（移行元は保存が必須）
- **`legacy/` 配下の編集**（凍結済み）

### テストに関する禁止

- **件数のみ / 存在のみ / 部分一致のみの弱い契約テスト**（§5 Step 1 の「禁止するテストの書き方」）
- **スナップショットテスト・ブラウザ自動化テスト・ネットワークテスト**（`CLAUDE.md` テストポリシー）
- **`bun test` での vitest テスト実行**（必ず `bun run test`）
- **テストが失敗するのを確認せずに Red コミットすること**
- **テストを通すために期待値を実装に合わせて書き換えること**（原本が正）

### 実装に関する禁止

- **`<SiteHeader>` / `<DisclaimerBanner>` のページ側再インクルード**
- **`page.tsx` を `"use client"` にすること**（metadata が定義できなくなる）
- **`next/dynamic` の `ssr: false` を Server Component で使うこと**
- **`globals.css` に無い CSS 変数の `var()` 参照**
- **ページ側 CSS での Mermaid レイアウト再実装**（`:global(.mermaid)` / `:global(svg)` の幅・配置指定）
- **`nav-links.ts` へのナビ直書き**（registry から導出される）
- **`bun run lint:fix`（パス引数なし）の実行**
- **Antigravity サンドボックス環境での `bun run build`**
- **設定ファイル（`next.config.ts` / `tsconfig.json` / `biome.json` / `vitest.config.ts`）の変更**
- **依存関係の追加・アップグレード**

---

## 8. 関連ファイル

| ファイル | 役割 |
|---|---|
| `scripts/audit_source_parity.mjs` | 原本照合監査スクリプト（移行漏れの機械検知） |
| `references/source-parity-audit.md` | 監査の運用手順・S-1〜S-4 契約テストの実装例 |
| `references/design-contract-tests.md` | D-1〜D-4 デザイン契約テストの実装例と `data-testid` 一覧 |
| `references/implementation-reference.md` | page.tsx / CSS の実装リファレンス |
| `.claude/rules/tdd-mandatory-cycle.md` | TDD サイクルとコミット分割の強制ルール |
| `.claude/rules/mermaid-diagram-layout.md` | Mermaid レイアウトの不変条件（SSoT） |
| `.claude/rules/css-cache-reset.md` | CSS 変更後のキャッシュリセット手順 |
| `.claude/rules/no-absolute-paths.md` | コミット前の PII / 絶対パス検証 |
| `.claude/skills/fix-mermaid/SKILL.md` | Mermaid の構文・配色・サイズ問題の対処 |
