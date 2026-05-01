# Next.js 移行 Phase A–F 計画書

> Phase 1–14 でコスト計算機ホームページのみ Next.js 化が完了した。本ドキュメントは残る **18 枚の静的 HTML ガイドページ + 共通インフラ** を `web-next/` App Router 配下へ TDD で移植するための計画を定義する。
>
> - 前提ドキュメント: [`docs/NEXTJS_MIGRATION_PLAN.md`](NEXTJS_MIGRATION_PLAN.md)（アーキテクト初期プロンプト — Phase 1–14 完了時点で凍結扱い）
> - 進捗トラッカー: [`../MIGRATION_PROGRESS.md`](../MIGRATION_PROGRESS.md)
> - Phase A Red 先行プラン: `~/.claude/plans/legacy-pr-gitignore-phase-a-sharded-glade.md`
> - プロジェクト固有スキル: [`.claude/skills/nextjs-page-migration/SKILL.md`](../.claude/skills/nextjs-page-migration/SKILL.md)

---

## 1. 目的

`legacy/` 配下の **18 HTML ページ** と **共通ヘッダー／ディスクレイマーバナー** を `web-next/` へ機能パリティ + 視覚パリティを維持しつつ移植する。Phase 1–14 で確立した **[Red] → [Green] → [Refactor]** のアトミックコミット・TDD 規律を継承する。

本計画の終了条件:

1. `legacy/` 配下の全 18 HTML が `web-next/app/` 配下の Next.js page に置換されている
2. `legacy/shared/common-header.{js,css}` が `components/site/SiteHeader.tsx` 系に置換されている
3. 旧 `.html` URL → 新クリーン URL の 301 リダイレクトが `netlify.toml` に登録されている
4. `legacy/` は `.gitignore` 済で remote には含まれない（ローカル参照は保持）
5. `bun run lint && bun run test && bun run typecheck && bun run build` が全通過

---

## 2. 前提の再確認（`NEXTJS_MIGRATION_PLAN.md` ステップ 0 からの継承）

| # | 設計判断 | 本計画での扱い |
|---|---------|----------------|
| 1 | ディレクトリ `web-next/` 並行運用 | Phase 14 でカットオーバー済 → `legacy/` に退避 |
| 2 | Markdown 3 層運用（L1/L2/L3） | Phase D で `.md` が SSoT のページは MDX 化検討 |
| 3 | 型同期（Pydantic → Zod） | 不変。Phase A–F は `pricing.json` に触れない |
| 4 | XSS 対策（unsafe HTML 注入 API 禁止） | Phase A–F の各コンポーネントでも継続。静的検査テストで証明 |
| 5 | i18n（`next-intl` 不採用、既存 `T`/`tRich` 継続） | 不変。ガイドページは **JA 固定**（EN 対応は別スコープ） |
| 6 | ビジネスロジック `lib/cost.ts` | 不変 |
| 7 | データ取得 SSG（Zod 検証） | 不変 |
| 8 | デプロイ（棚上げ） | 不変（判断 9 を採択、`@netlify/plugin-nextjs` 不要） |
| 9 | 単一 HTML 廃止（`output: 'export'`） | 不変 |
| 10 | `next/font/google` self-host | 不変。新ページも `--font-sans` / `--font-mono` / `--font-display` を再利用 |
| 11 | 静的 `export const metadata` | 不変。各ページで `metadata` を静的エクスポート |

---

## 3. スコープ

### 3.1 移行対象（`legacy/` 配下）

| カテゴリ | 枚数 | 合計行数 | パス |
|---|---|---|---|
| Claude ガイド系 | 5 | ~10,966 | `legacy/claude/skill.html`, `agent.html`, `skill-guide-for-claude.html`, `skill-guide-of-claude-for-intermediate.html`, `claude-cowork-guide.html` |
| Gemini ガイド系 | 5 | ~13,560 | `legacy/gemini/skill.html`, `agent.html`, `skill-guide-for-gemini.html`, `skill-guide-of-gemini-for-intermediate.html`, `antigravity-guide.html` |
| Codex ガイド系 | 3 | ~7,999 | `legacy/codex/skill.html`, `agent.html`, `openai-codex-guide.html` |
| Copilot ガイド系 | 4 | ~12,217 | `legacy/copilot/skill.html`, `agent.html`, `markdown-file-guide.html`, `github-copilot.html` |
| Worktree | 1 | 2,979 | `legacy/git_worktree.html`（Mermaid v10 + 手書き SVG） |
| 共通 | — | — | `legacy/shared/common-header.{js,css}` + ディスクレイマーバナー + nav-links |
| **合計** | **18** | **~47,721** | — |

### 3.2 スコープ外

- `web-next/app/page.tsx`（コスト計算機ホーム）と周辺コンポーネント群（Phase 14 完了）
- `scraper/` 配下
- `pricing.json` のスキーマ変更

---

## 4. 提案ディレクトリ構造（`web-next/` 目標形）

```text
web-next/
├── app/
│   ├── layout.tsx                          # SiteHeader + DisclaimerBanner を常設
│   ├── page.tsx                            # 既存: コスト計算機（不変）
│   ├── claude/
│   │   ├── skill/page.tsx
│   │   ├── agent/page.tsx
│   │   ├── skill-guide/page.tsx            # 旧 skill-guide-for-claude
│   │   ├── skill-guide-intermediate/page.tsx
│   │   └── cowork-guide/page.tsx
│   ├── gemini/
│   │   ├── skill/page.tsx
│   │   ├── agent/page.tsx
│   │   ├── skill-guide/page.tsx
│   │   ├── skill-guide-intermediate/page.tsx
│   │   └── antigravity-guide/page.tsx
│   ├── codex/
│   │   ├── skill/page.tsx
│   │   ├── agent/page.tsx
│   │   └── guide/page.tsx                  # 旧 openai-codex-guide
│   ├── copilot/
│   │   ├── skill/page.tsx
│   │   ├── agent/page.tsx
│   │   ├── markdown-guide/page.tsx
│   │   └── github-copilot/page.tsx
│   └── git-worktree/page.tsx
│
├── components/
│   ├── site/
│   │   ├── SiteHeader.tsx                  # Server Component
│   │   ├── SiteHeaderClient.tsx            # Client: ハンバーガー + dropdown
│   │   ├── DisclaimerBanner.tsx            # Client: ResizeObserver
│   │   └── nav-links.ts                    # 型付き静的データ + Zod スキーマ
│   └── docs/
│       ├── DocLayout.tsx                   # ガイド系共通レイアウト
│       ├── CodeBlock.tsx                   # shiki build-time ハイライト
│       └── MermaidDiagram.tsx              # next/dynamic + ssr:false
│
├── app/layout.tsx（更新）
├── netlify.toml（更新: [[redirects]] 18 本）
└── legacy/（.gitignore 済、ローカル参照用）
```

---

## 5. 段階分け

### Phase A — 共通インフラ（SiteHeader / DisclaimerBanner / nav-links）

**目的**: 全ガイドページが依存する共通土台を先に確立する。

**含むファイル**:
- `components/site/nav-links.ts`（新規、型付きデータ + Zod）
- `components/site/SiteHeader.tsx`（新規、Server Component）
- `components/site/SiteHeaderClient.tsx`（新規、Client）
- `components/site/DisclaimerBanner.tsx`（新規、Client）
- `app/layout.tsx`（更新）

**Red**:
- `tests/phaseA.nav-links.test.ts`（~8 tests, Zod 契約）
- `tests/phaseA.layout.test.ts`（~4 tests, readFileSync）
- `components/site/SiteHeader.test.tsx`（~12 tests, Server Component）
- `components/site/SiteHeaderClient.test.tsx`（~8 tests, Client ハンドラ）
- `components/site/DisclaimerBanner.test.tsx`（~6 tests, 2 行テキスト + ResizeObserver）

**Green**:
- 上記 4 コンポーネント + nav-links の実装
- `app/layout.tsx` で `<SiteHeader />` + `<DisclaimerBanner />` を `{children}` の前に挿入
- `body.className="has-common-header"` を維持

**Refactor**:
- CSS: `globals.css` に legacy `common-header.css` を移植、Tailwind v4 `@theme inline` トークンに寄せる候補を検討
- Phase B 以降で再利用する `DocLayout.tsx` の雛形を先出しできるなら出す

**工数目安**: 1 日

### Phase B — Provider `skill.html` × 4

**目的**: 共通の「ガイド文書テンプレート」（`DocLayout` + `CodeBlock`）を 1 ページ目で確立し、残 3 ページで再適用する。

**順序**:
1. `/claude/skill` — テンプレ確立
2. `/gemini/skill` — 再適用
3. `/codex/skill` — 再適用
4. `/copilot/skill` — 再適用

**Red / Green / Refactor**:
- 各ページで `app/<provider>/skill/page.test.tsx` に **タイトル / セクション数 / 外部リンク rel / metadata** の契約テスト（5–8 件）を書く
- 実装は `html-to-nextjs-migration` スキルを利用して最初のドラフトを生成、その後 TDD で green 化
- Refactor 段階で `DocLayout.tsx` / `CodeBlock.tsx` に共通化

**工数目安**: 2 日（初回テンプレ確立 1 日 + 残 3 枚を 1 日）

### Phase C — Provider `agent.html` × 4 ✅ 完了

**目的**: Phase B で確立した `DocLayout` を再利用して 4 枚を高速移植。

**順序（完了済み）**:
1. `/claude/agent` — 完了（`2b7a0fa`/`5394d9d`）
2. `/gemini/agent` — 完了（`9dfa184`/`aa9c2ee`〜`448368a`）
3. `/codex/agent` — 完了（`0758a35`〜`22d8951`）
4. `/copilot/agent` — 完了（`b920471`〜`c849377`、全 20 セクション）

**テスト数**: 469（全件 pass）

### Phase D — 長文ガイド × 9

**対象**（すべて `.html` → JSX 直接移植）:
- Claude: `skill-guide-for-claude`, `skill-guide-of-claude-for-intermediate`, `claude-cowork-guide`
- Gemini: `skill-guide-for-gemini`, `skill-guide-of-gemini-for-intermediate`, `antigravity-guide`
- Codex: `openai-codex-guide`
- Copilot: `markdown-file-guide`, `github-copilot`

**MDX 採用判断**:
- **MDX 不採用**（確定）。`.md` ファイルは移行対象外。
- すべてのページは対応する `.html` を `nextjs-page-migration` スキルで faithful 移植する。
- `.md` と `.html` の両方が存在するページは `.html` のみを使用し `.md` は無視する。

**工数目安**: 3 日

### Phase E — `git_worktree.html`（Mermaid + 手書き SVG）

**特殊対応**:
- Mermaid v10 ダイアグラム → `components/docs/MermaidDiagram.tsx`（`next/dynamic(() => import(...), { ssr: false })`）で遅延ロード
- 手書き SVG → JSX 化（`viewBox` / `marker` / `stroke` 色整合は `CLAUDE.md` 注意事項を踏襲）
- Prism.js 相当のシンタックスハイライト → build-time `shiki` に置換
- ~2,979 行を 1 枚で扱うため、**ページ内を複数のサーバーコンポーネントに分割** する設計を推奨（`sections/` 配下に section 単位で配置）

**工数目安**: 2 日

### Phase F — カットオーバー & 後片付け

**含むファイル**:
1. `netlify.toml` に **18 本の 301 リダイレクト**（`/claude/skill.html → /claude/skill` 等）
2. `app/sitemap.ts` / `app/robots.ts` 新規作成（19 URL）
3. 旧 `pricing.json` 等のリンクを全ページで検索 → Next.js ルーティングに置換
4. `update.sh` コメント更新（`legacy/` 参照消滅を反映）
5. `CLAUDE.md` の「静的 HTML ドキュメント」表を最終形に更新

**注意**: `legacy/` 配下は **物理削除せず `.gitignore` のまま**。ローカル参照用に保持する（本計画では「削除 PR」は含まない）。

**Phase F redirect 一覧**（移行完了ページを順次追記）:

| 旧 URL | 新 URL | 移行 Phase |
|---|---|---|
| `/claude/skill.html` | `/claude/skill` | B-1 |
| `/gemini/skill.html` | `/gemini/skill` | B-2 |
| `/codex/skill.html` | `/codex/skill` | B-3 |
| `/copilot/skill.html` | `/copilot/skill` | B-4 |
| `/claude/agent.html` | `/claude/agent` | C-1 |
| `/gemini/agent.html` | `/gemini/agent` | C-2 |
| `/codex/agent.html` | `/codex/agent` | C-3 |
| `/copilot/agent.html` | `/copilot/agent` | C-4 |

**工数目安**: 0.5 日

---

## 6. 横断的な設計判断

| # | 項目 | 推奨 | 代替案 | 判断根拠 |
|---|---|---|---|---|
| 1 | スタイリング | **CSS Modules** + Tailwind v4 変数参照 | 全 Tailwind 化 / 全 inline CSS | 既存 HTML の `<style>` を 1:1 で移植しやすく、既存 `globals.css` トークンと直結 |
| 2 | コードブロック | **`shiki`（build-time）** | Prism runtime | SSG + RSC 親和性、初期 JS バンドル増加ゼロ |
| 3 | Mermaid | **`next/dynamic` + `ssr: false`** | 事前 SVG 変換 | 図数が多く、静的化の手作業コストが過大 |
| 4 | i18n | **Phase E まで JA 固定** | 全ページ JA/EN 対応 | 既存 `.html` が JA 主軸。EN 化は別スコープ |
| 5 | URL 互換 | **301 リダイレクト（Phase F）** | 旧 URL ルート残置 | 拡張子なし URL が Next.js 慣例。SEO 資産は 301 で引継ぎ |
| 6 | nav データ | **TS モジュール昇格** | `/nav-links.json` を `public/` 維持 | SSG 初期 HTML への焼き込み + 型安全 + `fetch` 不要 |
| 7 | TDD 粒度 | **ページ毎に「構造契約」+ 共通部品 unit test** | 視覚回帰 only | Phase 1–14 と整合。Playwright 禁止ルール準拠 |

---

## 7. リスクとトレードオフ

1. **Biome `lint` エラー量**: `legacy/` HTML 埋め込み `<style>` を JSX 化すると page.tsx が数千行化。`printWidth` / `noArrayIndexKey` が大量発火する恐れ → **CSS Modules 分離で行数を 1/3 以下に圧縮**
2. **テスト数のスケール**: 現在 361 件。18 ページ × 10–20 件で +200 件見込み。`vitest` 実行時間が 2× になる可能性 → 構造検査は `readFileSync` + 正規表現で軽量化
3. **ビルド時間**: 静的ルートが 1 → 19 に増加。Turbopack 並列化で大きな劣化は想定しないが、Phase F で実測を記録
4. **`.md` / `.html` 二重管理**: Phase D で `.md` ファイルが存在するページも **MDX 不採用**（確定）。対応する `.html` のみを faithful 移植し、`.md` ファイルは移行対象外とする。
5. **Next.js 16 の bleeding-edge 性**: `web-next/AGENTS.md` の「訓練データと挙動が異なる可能性あり」を遵守し、`node_modules/next/dist/docs/` を都度参照する

---

## 8. Phase A 先行計画への参照

Phase A の Red フェーズ（契約テスト 5 本先行）は **独立 PR** として扱う。詳細は以下:

- プランファイル: `~/.claude/plans/legacy-pr-gitignore-phase-a-sharded-glade.md`
- 進捗記録: `MIGRATION_PROGRESS.md` 「Phase A の設計方針」節
- Red → Green 着手は **Red PR マージ後** に別セッションで実施

---

## 9. 想定スケジュール

| Phase | 工数 | 累積 | 備考 |
|---|---|---|---|
| A | 1 日 | 1 日 | ✅ 完了 |
| B | 2 日 | 3 日 | ✅ 完了 |
| C | 1.5 日 | 4.5 日 | ✅ 完了 |
| D | 3 日 | 7.5 日 | HTML → JSX 直接移植（MDX 不採用） |
| E | 2 日 | 9.5 日 | Mermaid + SVG |
| F | 0.5 日 | 10 日 | redirects + cleanup |

**合計目安: 10 営業日**。並列 worktree 運用（プロバイダー別）で Phase B–D を 1/2 工数に短縮可能。

---

## 10. 改訂履歴

| 日付 | 内容 |
|------|------|
| 2026-04-17 | 初版作成（Phase 14 完了、Phase A Red 着手と同時にドキュメント整備） |
| 2026-05-01 | Phase C 完了（C-1〜C-4 全 4 ページ faithful 移植完了、469 tests pass）。Phase D §MDX 採用判断を「不採用確定」に更新 |
