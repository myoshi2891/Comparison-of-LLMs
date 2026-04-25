# Next.js 移行 Phase C 詳細設計書（agent.html × 4）

> **対象セッション**: Sonnet 実装セッション。本ドキュメントを冒頭で読み込み、Phase C-1 → C-2 → C-3 → C-4 を順次実装する。
> **本ドキュメントの目的**: Phase B-4 までに確立した実装パターンを Phase C 4 ページへ機械的に再適用するための実装ガイド。
>
> 関連:
> - 全体計画: [`NEXTJS_PHASE_A_F_PLAN.md`](NEXTJS_PHASE_A_F_PLAN.md) §Phase C
> - 進捗トラッカー: [`../MIGRATION_PROGRESS.md`](../MIGRATION_PROGRESS.md)
> - プロジェクト固有スキル: [`../.claude/skills/nextjs-page-migration/SKILL.md`](../.claude/skills/nextjs-page-migration/SKILL.md)

---

## 1. Context

### 1.1 現在地

- **Phase B 完了**: `legacy/{claude,gemini,codex,copilot}/skill.html` × 4 を `web-next/app/<provider>/skill/page.tsx` へ移植済（B-1〜B-4）。
- **次の作業**: Phase C — `legacy/{claude,gemini,codex,copilot}/agent.html` × 4 を `web-next/app/<provider>/agent/page.tsx` へ移植する。
- **アプローチ**: Phase B-4（`web-next/app/copilot/skill/`）の実装パターンを **そのまま再適用**。差分は §1.3 の Phase C 固有事情のみ。

### 1.2 セッション開始時に必読のファイル（順序固定）

1. **[`../MIGRATION_PROGRESS.md`](../MIGRATION_PROGRESS.md)** — 「AI 作業ルール」R1（Biome scope）と現在地（Phase B-4 完了 / 437 件 passed）を確認
2. **本ファイル** — Phase C 全体設計
3. **[`../.claude/skills/nextjs-page-migration/SKILL.md`](../.claude/skills/nextjs-page-migration/SKILL.md)** — 9 ステップ手順（Step 3 Red / Step 4 Green は本書 §4・§5 で具体化）
4. **B-4 参考実装の 3 点セット**:
   - [`../web-next/app/copilot/skill/page.tsx`](../web-next/app/copilot/skill/page.tsx) — Source 型 / SOURCES 配列 / TemplateBlock / BpCard ヘルパ
   - [`../web-next/app/copilot/skill/page.module.css`](../web-next/app/copilot/skill/page.module.css) — `.root` スコープでのブランドカラー閉域
   - [`../web-next/app/copilot/skill/page.test.tsx`](../web-next/app/copilot/skill/page.test.tsx) — Red 契約テスト 8 件の定型

### 1.3 Phase B 想定との差分（要注意）

| # | 差分 | 影響 |
|---|------|------|
| D1 | **Mermaid は不要** | SKILL.md §Phase C「Mermaid 含有の可能性あり → MermaidDiagram を先行導入」想定は外れた。4 ファイルすべてで `<mermaid>` / `class="mermaid"` は **0 件**。MermaidDiagram 先行導入は Phase E に持ち越し |
| D2 | **C-1 claude/agent.html は H2 ゼロ** | `<div class="section">` + `<span class="num">N</span>` 構造で、id 属性が無い。Phase B-4 の `EXPECTED_SECTION_IDS` 12 件固定はそのまま使えない → 移植時に **synthetic id** を振る（§5.1 参照） |
| D3 | **C-4 copilot/agent.html は code block 63 件（Phase 最多）** | B-4 の named template constants 抽出戦略を **より徹底** する必要あり |
| D4 | **全 4 ページ Server Component で完結** | interactive JS 無し（`common-header.js` defer のみ）。`"use client"` は不要 |

---

## 2. スコープと対象ファイル

### 2.1 4 ページ概観

| # | legacy パス | 新 URL | 行数 | H2 数 | code block 数 | source 数 | ブランドカラー |
|---|---|---|---|---|---|---|---|
| C-1 | `legacy/claude/agent.html` | `/claude/agent` | 1,678 | 0 | 30 | 23 | `--accent` `--accent2` `--accent3` `--accent4` |
| C-2 | `legacy/gemini/agent.html` | `/gemini/agent` | 3,723 | 18 | 36 | **25**（既存 12 + 新規エージェント連携 13） | Google Material テーマカラー |
| C-3 | `legacy/codex/agent.html` | `/codex/agent` | 3,007 | 12 | 45 | 20 | OpenAI（`--oai` `--oai-dim` `--blue` `--purple` `--amber` `--red`） |
| C-4 | `legacy/copilot/agent.html` | `/copilot/agent` | 2,171 | 20 | 63 | 16 | GitHub/MS（`--gh` `--gh-dark` `--gh-blue` `--gh-purple` `--gh-amber` `--gh-red` `--ms-blue`） |

### 2.2 各ページの新規 3 点セット

```
web-next/app/<provider>/agent/
├── page.tsx          # Server Component（本体）
├── page.module.css   # legacy <style> の逐語移植 + .root スコープ
└── page.test.tsx     # Red 契約テスト 8 件
```

`<provider>` は `claude` / `gemini` / `codex` / `copilot`。

### 2.3 スコープ外

- 旧 URL → 新 URL の 301 リダイレクト（`netlify.toml [[redirects]]`）は **Phase F で一括**
- `lib/i18n` への新規キー追加（ガイドページは JA 固定）
- Mermaid / 共通 `DocLayout.tsx` 抽出（Phase E / Phase D 以降で判断）
- legacy/ ファイルの編集（凍結中・読み取りのみ）

---

## 3. Phase B 確立テンプレ（再利用パターン）

すべて [`../web-next/app/copilot/skill/page.tsx`](../web-next/app/copilot/skill/page.tsx) を **正本** として参照する。本節は要点のみ列挙。

### 3.1 型とヘルパ署名

```ts
// page.tsx の冒頭
import type { Metadata } from "next";
import styles from "./page.module.css";

type Source = { num: string; href: string; title: string; desc: string };

export const metadata: Metadata = {
  title: "<ページ固有タイトル> | LLM コスト計算機",
  description: "<150 文字以内の固有説明>",
};

// 外部リンクラッパ（target/rel を強制）
function Ext({ href, children }: { href: string; children: React.ReactNode }) { ... }

// macOS ウィンドウ装飾付きコードブロック
function TemplateBlock({ title, body }: { title: string; body: React.ReactNode }) { ... }

// 色変種 + タイトル + 説明のカード
function BpCard({ variant, title, desc }: { variant: "violet" | "teal" | ...; title: string; desc: string }) { ... }
```

### 3.2 SOURCES 配列パターン

**判定基準**:
- legacy HTML の sources セクションに `──` などの視覚セパレータ（「新規追加」「既存（一部抜粋）」等の見出し）が **ある** → B-4 に倣い `SOURCES_NEW: Source[]` + `SOURCES_EXISTING: Source[]` の 2 分割 + `<div className={styles.srcSeparator}>` で区切り表示
- セパレータが **無い** → 単一の `const SOURCES: Source[] = [...]` で十分

**実装時の手順**:
1. `legacy/<provider>/agent.html` の末尾 200 行付近を Read し、sources 構造を確認
2. 視覚セパレータを grep（例: `Grep -n -- '──' legacy/<provider>/agent.html`）
3. ヒットあれば 2 分割、なければ単一配列

### 3.3 `<pre>` 内の改行保持と syntax-classified spans

```tsx
<pre>
  <span className={styles.cCm}>// コメント</span>
  {"\n"}
  <span className={styles.cKy}>const</span>{" "}
  <span className={styles.cId}>foo</span>
  {" = "}
  <span className={styles.cSt}>"value"</span>
  {"\n"}
</pre>
```

**禁止**: React の生 HTML 注入 prop（needle 文字列の static check で CI が落ちる）

**`{"\n"}` リテラル injection**: JSX whitespace collapse を防ぐため改行は文字列リテラルで明示。インデントも同様。

### 3.4 page.module.css の `.root` スコープ閉域

```css
/* legacy/<provider>/agent.html の <style> ブロック (行 7–N) を CSS Modules に転写。
   globals.css の値を上書きしない。すべての変数定義と子セレクタは .root 配下に閉じる。 */

.root {
  --bg: #03050a;
  --accent: #f97316;
  /* ... */
}

.root .heroTitle { ... }
.root .codeBlock { ... }
```

**重要**:
- 必ず `.root` セレクタの内側に CSS 変数を定義する（`:root` 直下に置かない → 他ページに漏れる）
- legacy のクラス名は **そのまま継承**（Biome の camelCase 規則は CSS Modules export で吸収される）
- 冒頭コメントに「元 HTML の `<style>` ブロックの行範囲」と「globals.css 不上書き」を明記

### 3.5 メタデータ静的 export

- `export const metadata: Metadata = { title, description }` のみ
- `lib/i18n` には触れない（ガイドページは JA 固定 / EN 化は別スコープ）
- `metadataBase` / OpenGraph は `app/layout.tsx` で既に設定済 → ページ側は title/description のみ上書き

---

## 4. Red 契約テスト（8 件 = B-3/B-4 と同形式）

各ページ `web-next/app/<provider>/agent/page.test.tsx` に以下 8 件を配置する。テンプレは [`../web-next/app/copilot/skill/page.test.tsx`](../web-next/app/copilot/skill/page.test.tsx) を出発点にする。

| # | テスト名（例） | 検証内容 | 備考 |
|---|---|---|---|
| 1 | `exports a metadata object with title containing "<keyword>"` | `metadata.title` が固有キーワードを含む | キーワードは §5 のページ別表で固定 |
| 2 | `exports a metadata object with non-empty description` | `metadata.description` が非空文字列 | — |
| 3 | `renders an <h1> containing "<keyword>"` | `<h1>` テキストに固有キーワード | キーワードは §5 のページ別表で固定 |
| 4 | `renders all N expected section ids` | `EXPECTED_SECTION_IDS` の各 id を持つ `<section>` が存在 | 各ページの id 一覧は §5 |
| 5 | `renders TOC links pointing to all section anchors` | `nav a[href^="#"]` の href が `EXPECTED_SECTION_IDS` と 1:1 対応 | TOC の有無もページ毎に確認 |
| 6 | `all external http(s) links have target="_blank" and rel="noopener noreferrer"` | `a[href^="http"]` 全件で 2 属性 | XSS / SEO 対策 |
| 7 | `sources section contains at least N external links` | sources 節の `a[href^="http"]` 件数が `>= SOURCES.length` | N は §5 のページ別表で固定 |
| 8 | `does not use the React raw-HTML injection prop` | `readFileSync(page.tsx)` で needle（難読化済）を含まない | needle は B-4 と同一: `["danger","ously","Set","Inner","HTML"].join("")` |

**Red commit 時の状態**: 8 件すべて fail（page.tsx 未実装のため import error / DOM が無い）でコミット。Green commit で全 pass にする。

---

## 5. ページ別詳細

### 5.1 C-1 `/claude/agent`

| 項目 | 値 |
|---|---|
| Legacy | `legacy/claude/agent.html`（1,678 行 / `<style>` 行 7–240） |
| 新規 3 点 | `web-next/app/claude/agent/{page.tsx,page.module.css,page.test.tsx}` |
| Hero タイトル | `サブエージェント + Agent Teams 開発における Markdown ファイル ベストプラクティス` |
| Hero バッジ | `🤖 Claude Code 完全ガイド — 2026年3月 v2.1.76 最新対応版` |
| Section 構造 | `<div class="section">` × N + `<span class="num">N</span>` で番号付け（**id 属性なし**） |
| EXPECTED_SECTION_IDS 戦略 | **synthetic id**（`s01` 〜 `sNN`）を移植時に付与。先頭で section 数を grep（`Grep -c 'class="section"' legacy/claude/agent.html`）して N を確定 |
| TOC | legacy にあれば踏襲、なければ §5.1 末尾の手順で新規生成 |
| 著者カラー（`.root` 内に定義） | `--bg: #010409` / `--accent: #f97316` / `--accent2: #a78bfa` / `--accent3: #34d399` / `--accent4: #60a5fa` |
| SOURCES 件数 | 23 件 |
| SOURCES 分割方針 | 実装時に `Grep '──' legacy/claude/agent.html` で判定。なければ単一 `SOURCES`、あれば `SOURCES_NEW` + `SOURCES_EXISTING` の 2 分割 |
| code block 数 | 30 件 |
| named template constants | code block 30 件のうち、3 行を超える長文テンプレート（フロントマター付き .md / 設定 YAML 等）は 5–7 件に絞って `*_TEMPLATE` 定数化。短いインラインスニペット（CLI コマンド 1 行等）は本体に直書きで OK |
| metadata.title | `Claude Code サブエージェント Markdown ベストプラクティス \| LLM コスト計算機` |
| metadata.description | `Claude Code v2.1.76 のサブエージェント / Agent Teams 開発で必要な CLAUDE.md・エージェント定義・MEMORY.md・README.md の役割と書き方を体系化したガイド。` |
| 契約テスト #3 のキーワード | `サブエージェント` |
| 契約テスト #4 の id 数（N） | 実装時に確定（legacy section 数から算出） |

**TOC 生成手順**（C-1 で legacy に TOC が無い場合）:
1. 各 `<div class="section">` の先頭行（`<span class="num">N</span>` の隣の見出し）を抽出
2. `<nav className={styles.toc}>` 配下に `<a href={`#s${nn}`}>{n}. {見出し}</a>` を並べる
3. 対応する `<section id={`s${nn}`}>` で本体を包む

### 5.2 C-2 `/gemini/agent`

| 項目 | 値 |
|---|---|
| Legacy | `legacy/gemini/agent.html`（3,723 行 / `<style>` 行 7–1,148） |
| 新規 3 点 | `web-next/app/gemini/agent/{page.tsx,page.module.css,page.test.tsx}` |
| Hero タイトル | （legacy `<h1>` を確認、Gemini Agent / Gemini Code Assist 系想定） |
| Section 構造 | `<h2>` × 18（id 属性の有無は実装時 grep `id="[^"]*"' legacy/gemini/agent.html` で確認） |
| EXPECTED_SECTION_IDS 戦略 | legacy に既存 id があれば採用、なければ synthetic（`s01` 〜 `s17` と `sources`） |
| 著者カラー | Google Material: `--blue: #1a73e8` / `--green: #1e8e3e` / `--yellow: #f9ab00` / `--red: #d93025` / `--purple: #7c3aed` / `--teal: #00897b` |
| SOURCES 件数 | **25 件**（既存 12 + 新規 A2A 13）。設計書当初の「28 件」は誤りで、grep で確認済み |
| SOURCES 分割方針 | **2 分割確定**（`SOURCES_EXISTING`: 12 件 / `SOURCES_NEW`: 13 件 A2A 系）。CSS: `.srcSeparator` で区切り |
| 契約テスト #7 の閾値 | `>= 25`（当初 `>= 28` から訂正済み、`page.test.tsx` 修正完了・未コミット） |
| EXPECTED_SECTION_IDS | `["s01", ..., "s17", "sources"]`（18 件）。s01〜s17 は synthetic id（legacy HTML に id 属性なし） |
| code block 数 | 36 件 |
| named template constants | 8–10 件目安（中規模）。コードブロック本文は文字列テンプレートリテラルで OK（white-space:pre が改行保持） |
| metadata.title | `Gemini マルチエージェント開発 (ADK / A2A / AgentEngine) ベストプラクティス \| LLM コスト計算機`（実装値） |
| metadata.description | 最新の Gemini CLI (as of 2026-03)・最新の ADK (as of 2026-03)・最新のエージェント連携プロトコル (A2A/AP2/A2UI等) 時代のサブエージェント / マルチエージェント開発で必要な GEMINI.md・AGENTS.md・agent.py・agent.json・.geminiignore・settings.json の役割と書き方を体系化したガイド |
| 契約テスト #3 のキーワード | `Gemini`（legacy `<h1>` には未含のため Hero `<h1>` 先頭に "Gemini" を補填） |
| 契約テスト #4 の id 数（N） | **18**（s01〜s17 の 17 件 + sources の 1 件） |
| CSS Module 状態 | **コミット済み**（`page.module.css`、1,329 行、`cb62441`） |
| page.tsx 状態 | **作成済み・faithful 移植中**（Green `aa9c2ee` → s01 `e9e9547` → s02 `90b163e` → s03 `8b582a3` → s04 `9d1a6bd` → s05 `60cf089` → s06 `1cd285f` → s07 `3a03261` → s08 `7e4aa2f` → s09 `c42542d` → s10 `fb235dc` → s11 `8e49dd4` → s12 `7ede8d7` → s13 `c8ef2b8`、s14〜s17 + sources は縮約版残存）。詳細は MIGRATION_PROGRESS.md §「Phase C-2 faithful 移植継続ポイント」 |
| faithful 移植ルール | **R2 厳守**: legacy HTML の全リスト項目・全コードブロック・全 SVG・全 alert・全 table を JSX に転写。要約・省略・縮約禁止（MIGRATION_PROGRESS.md §「AI 作業ルール R2」参照） |

**セクション 10〜17 の注意**: マルチエージェント系セクションは `sectionMa` クラスを追加（緑アクセント、CSS で定義済み）。`className={\`${styles.section} ${styles.sectionMa}\`}` を使用。

**外部リンクの所在**: ソースセクション（`id="sources"`）のみ。セクション本文内（コードブロック文字列等）に `<a>` 要素は不要。`Ext` ヘルパを sources のレンダリングのみで使用。

### 5.3 C-3 `/codex/agent`

| 項目 | 値 |
|---|---|
| Legacy | `legacy/codex/agent.html`（3,007 行 / `<style>` 行 7–786） |
| 新規 3 点 | `web-next/app/codex/agent/{page.tsx,page.module.css,page.test.tsx}` |
| Hero タイトル | （legacy `<h1>` を確認、OpenAI Codex Agent / Codex CLI 系想定） |
| Section 構造 | `<h2>` × 12 |
| EXPECTED_SECTION_IDS 戦略 | legacy 既存 id 優先、なければ synthetic（`s01` 〜 `s12`） |
| 著者カラー | OpenAI: `--oai: #10a37f` / `--oai-dim: #0d8a6b` / `--blue: #3b82f6` / `--purple: #8b5cf6` / `--amber: #f59e0b` / `--red: #ef4444` |
| SOURCES 件数 | 20 件 |
| SOURCES 分割方針 | 視覚セパレータの有無で判定 |
| code block 数 | 45 件（B-3 codex/skill と同等規模） |
| named template constants | 8–10 件目安。codex 系は CLI 設定・AGENTS.md・テンプレ MD などで 5 行以上のスニペットが多い |
| metadata.title | `OpenAI Codex エージェント開発ガイド \| LLM コスト計算機`（legacy `<title>` 優先） |
| metadata.description | legacy `<meta name="description">` 優先、無ければ要約 |
| 契約テスト #3 のキーワード | `Codex`（legacy `<h1>` で確認） |
| 契約テスト #4 の id 数（N） | 12 |

### 5.4 C-4 `/copilot/agent`

| 項目 | 値 |
|---|---|
| Legacy | `legacy/copilot/agent.html`（2,171 行 / `<style>` 行 7–427） |
| 新規 3 点 | `web-next/app/copilot/agent/{page.tsx,page.module.css,page.test.tsx}` |
| Hero タイトル | （legacy `<h1>` を確認、GitHub Copilot Coding Agent / Copilot Workspace 系想定） |
| Section 構造 | `<h2>` × 20（Phase C 最多） |
| EXPECTED_SECTION_IDS 戦略 | legacy 既存 id 優先、なければ synthetic（`s01` 〜 `s20`） |
| 著者カラー | GitHub/MS: `--gh: #1f883d` / `--gh-dark: #196c2e` / `--gh-blue: #0969da` / `--gh-purple: #8250df` / `--gh-amber: #bf8700` / `--gh-red: #cf222e` / `--ms-blue: #0078d4` |
| SOURCES 件数 | 16 件 |
| SOURCES 分割方針 | legacy に「2026年3月更新版」のような注釈見出しがあれば 2 分割を検討 |
| code block 数 | **63 件（Phase 最多）** |
| named template constants | **12–15 件まで切り出しを徹底**。copilot-instructions.md / agent.md / chatmode 設定など長文テンプレートは必ず定数化。page.tsx 本体の縦長を 2,500 行未満に保つ |
| metadata.title | `GitHub Copilot コーディングエージェント開発ガイド \| LLM コスト計算機`（legacy `<title>` 優先） |
| metadata.description | legacy `<meta name="description">` 優先 |
| 契約テスト #3 のキーワード | `Copilot`（legacy `<h1>` で確認） |
| 契約テスト #4 の id 数（N） | 20 |

---

## 6. 作業順序と TDD サイクル

### 6.1 推奨順序

`C-1 (claude) → C-2 (gemini) → C-3 (codex) → C-4 (copilot)` の **直列実行**。

- 理由: C-1 は H2 ゼロ・1,678 行と最も小さく、synthetic id ルールの確立に適する。C-4 は code block 63 件で named template constants の徹底が必要なため最後に回す
- 並列 worktree（プロバイダー別）でも可能だが、テンプレ確立期は直列推奨

### 6.2 1 ページの TDD サイクル

```
# Red commit
1. legacy HTML の構造を Grep / Read で把握（section 数 / sources 構造 / TOC 有無）
2. EXPECTED_SECTION_IDS / 固有キーワードを §5 のページ別表で確定
3. page.test.tsx を作成（8 件すべて fail 状態）
4. bun run test -- <provider>/agent  → 8 件 fail を確認
5. git add web-next/app/<provider>/agent/page.test.tsx && git commit
   - メッセージ: `test(web-next): add Phase C-N /<provider>/agent contract test (Red)`

# Green commit
6. page.module.css を作成（legacy <style> 逐語移植、.root スコープ）
7. page.tsx を作成（Source 型 / SOURCES / TemplateBlock / BpCard / 本体）
8. bun run test -- <provider>/agent  → 8 件 pass
9. bun run typecheck                  → green
10. bun run build                      → /<provider>/agent が ○ (Static)
11. bunx biome check --write app/<provider>/agent/page.tsx app/<provider>/agent/page.module.css app/<provider>/agent/page.test.tsx
12. bun run lint                       → 新規違反 0、既知 6 件のみ残存
13. git add web-next/app/<provider>/agent/ && git commit
    - メッセージ: `feat(web-next): migrate legacy/<provider>/agent.html to /<provider>/agent (Green)`
```

### 6.3 各ページ完了後の `MIGRATION_PROGRESS.md` 更新

Phase B-4 と同じ形式で以下を追記:

- 「現在地」の最新 HEAD と「次の作業」を更新
- 「検証状態（Phase C-N）」行を追加（テスト件数・build 成功 URL を記載）
- 「フェーズ進捗」表の Phase C 行に `C-N: Red <hash> / Green <hash>` を追記

---

## 7. AI 作業ルール遵守事項（**作業開始前に必読**）

### 7.1 R1: Biome fix のスコープ（`MIGRATION_PROGRESS.md` AI 作業ルール R1）

- **禁止**:
  - `bun run lint:fix`（= `biome check . --write`）
  - `bunx biome check --write`（パス引数なし）
  - `bunx biome format --write`（同上）
- **理由**: 既存 printWidth / organizeImports 違反 6 件が pre-existing で残存しており、全体 `--write` は無関係ファイルを書き換える
- **正しい手順**:
  1. `bun run lint` で全違反を一覧
  2. 自分の作業範囲のみパス指定で fix: `bunx biome check --write app/<provider>/agent/page.tsx app/<provider>/agent/page.module.css app/<provider>/agent/page.test.tsx`
  3. 再度 `bun run lint` で新規違反 0、pre-existing 6 件のみ残存を確認

### 7.2 ランタイム

- フロントエンドコマンドは **bun 必須**。`npm` / `npx` / `node` は使用禁止
- スクレイパーは `uv run python` / `uv run pytest`

### 7.3 legacy/ は凍結

- 読み取りのみ。編集禁止
- `.gitignore` 済（remote には push されない）

### 7.4 lib/i18n には新規キーを追加しない

- ガイドページは JA 固定（EN 対応は別スコープ）
- B-1 で発生した key count ドリフトの再発防止

### 7.5 その他 CLAUDE.md ルール

- `any` 禁止 → `unknown` + 型ガード
- 早期リターンでネスト削減
- 投機的編集禁止 / 外科的パッチ優先
- ビルドツール設定（next.config / biome.json / tsconfig 等）の変更禁止

---

## 8. 検証コマンド（コミット前チェック）

各ページの Green commit 前に以下すべてが pass することを確認:

```bash
cd web-next

# 1. lint（新規違反 0、既知 6 件のみ）
bun run lint

# 2. typecheck
bun run typecheck

# 3. test（B-4 完了時 437 件 → C-N 完了時 437 + 8N 件）
bun run test

# 4. build（/<provider>/agent が ○ (Static) としてプリレンダリング成功）
bun run build

# 5. backend pytest（pricing.json 回帰確認）
cd ../scraper && uv run pytest
```

**1 つでも fail → 停止してユーザーに報告**。自動修正しない。

### 8.1 期待テスト件数

| Phase | 累積テスト件数 |
|---|---|
| B-4 完了時 | 437 |
| C-1 完了時 | 445（+8） |
| C-2 完了時 | 453（+8） |
| C-3 完了時 | 461（+8） |
| C-4 完了時 | 469（+8） |

---

## 9. 完了時の更新対象

### 9.1 各ページ Green commit 直後

- `MIGRATION_PROGRESS.md`:
  - 「現在地」: 最新 HEAD と「次の作業」を更新
  - 「検証状態（Phase C-N）」: B-1〜B-4 と同形式で追加
  - 「フェーズ進捗」表の Phase C 行: per-page で `C-N: Red <hash> / Green <hash>` を追記

### 9.1.5 faithful 移植 commit のたび（C-2 で確立した R2 ルール）

C-2 以降、Green コミットだけでは完了とせず legacy HTML の全コンテンツを JSX に転写すること（要約・省略・縮約禁止）。1 セクションごとにコミットし、その都度:

- `MIGRATION_PROGRESS.md` §「Phase C-N faithful 移植継続ポイント」のチェックリストを 1 行更新
- 全テスト・lint 通過を verify したあとにコミット
- ルール詳細: MIGRATION_PROGRESS.md §「AI 作業ルール R2」

### 9.2 Phase C 4 ページ全完了後

- `MIGRATION_PROGRESS.md`:
  - 「フェーズ進捗」表の Phase C 行を **完了** マーク
  - 「Phase C-4 完了 — セッション区切り」節を追加（B-4 末尾と同形式）
  - 「次セッションへの申し送り」: Phase D（長文ガイド × 9 + MDX 採用判断）への引き継ぎ
- `docs/NEXTJS_PHASE_A_F_PLAN.md` §Phase F redirect 一覧に 4 本追加:

  ```
  /claude/agent.html   → /claude/agent
  /gemini/agent.html   → /gemini/agent
  /codex/agent.html    → /codex/agent
  /copilot/agent.html  → /copilot/agent
  ```

  （実反映は Phase F で `netlify.toml [[redirects]]` に一括登録）

---

## 10. 残留事項（実装時に判定）

| # | 項目 | 判定タイミング | 推奨 |
|---|---|---|---|
| 1 | SOURCES 分割方針（ページ毎） | 各ページ Red 着手時 | `Grep '──\|新規追加\|既存（一部抜粋）' legacy/<provider>/agent.html` で視覚セパレータの有無を確認、あれば 2 分割 |
| 2 | named template constants の粒度 | Green 実装中、page.tsx の縦長を見ながら | C-1: 5–7 / C-2: 8–10 / C-3: 8–10 / C-4: 12–15 件目安。3 行未満のスニペットは本体直書き |
| 3 | EXPECTED_SECTION_IDS の形式 | 各ページ Red 着手時 | C-1 は synthetic 確定。C-2/C-3/C-4 は legacy `id="..."` を grep し、ヒットあれば採用、なければ synthetic |
| 4 | TOC の有無 | 各ページ Red 着手時 | legacy に `<nav>` / `<ul class="toc">` 等があれば踏襲、なければ §5.1 末尾の手順で新規生成 |
| 5 | metadata.title / description | Red 着手時 | legacy の `<title>` / `<meta name="description">` を優先採用、無ければ §5 のページ別表のキーワードから合成（150 字以内） |
| 6 | Hero バッジ・サブタイトル | Green 実装時 | legacy の `<div class="hero-badge">` / `<p>` を可能な限り原文維持。Phase B と同じく「逐語移植」優先 |

---

## 11. 改訂履歴

| 日付 | 内容 |
|------|------|
| 2026-04-19 | 初版作成（Phase B-4 完了を受けて Phase C 詳細設計を Sonnet 実装向けにまとめる） |
