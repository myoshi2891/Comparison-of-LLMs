# Plan 001: web-next プラットフォーム現状分析（Current State Analysis）

> **本ドキュメントの性格**: `.agent/skills/improve/SKILL.md`（direction バリアント）に基づく
> **読み取り専用の分析ドキュメント**。実装手順は含まない。
> [002（ギャップ分析）](002-category-gap-analysis.md) と [003（拡張ロードマップ）](003-platform-expansion-roadmap.md) の前提資料であり、
> 将来の実装エージェントが本セッションのコンテキストなしで現状を再構築できることを目的とする。

## Status

- **Priority**: P1（002 / 003 の依存元）
- **Effort**: —（分析のみ、実装なし）
- **Risk**: —
- **Depends on**: none
- **Category**: direction（分析基盤）
- **Planned at**: commit `3915136`, 2026-07-06

## Why this matters

本リポジトリは「AI モデルの時間別コスト計算機 + AI ツール導入ガイド群」として成長してきたが、
ガイドページが 40 枚に達し、ナビゲーション構造（プロバイダー軸）と実際のコンテンツ（トピック横断）の間に
歪みが生まれ始めている。「今後の AI 関連最新情報をキャッチアップできるプラットフォーム」へ拡張するには、
まず現状の資産と構造的課題を正確に棚卸しする必要がある。

## 1. プラットフォーム概要（データフロー）

```text
scraper/ (Python 3.12+, uv, Playwright)
  └─ pricing.json 生成（3層フォールバック: scrape → 既存値 → ハードコード）
       └─ update.sh が web-next/data/ と web-next/public/ へコピー
            └─ web-next/ (Next.js 16 App Router, output: 'export', bun)
                 └─ Netlify CDN（pure SSG、サーバーランタイムなし）
```

- ビルド時に `web-next/data/pricing.json` を static import し Zod で検証（`web-next/lib/pricing.ts`）
- **SSG 制約**: サーバー API なし。動的機能はすべて「ビルド時生成 + クライアント JS」で実現する必要がある（003 の機能検討における最重要制約）

## 2. web-next ディレクトリ構成（2026-07-06 時点）

```text
web-next/
├── app/                 41 ルート（電卓ホーム 1 + ガイドページ 40）
│   ├── page.tsx         コスト計算機ホーム（Server Component + Zod 検証）
│   ├── layout.tsx       ルートレイアウト（SiteHeader / DisclaimerBanner マウント）
│   ├── globals.css      Tailwind v4 + legacy デザイントークン
│   └── <provider|topic>/<slug>/
│       ├── page.tsx           各ガイド本体
│       ├── page.module.css    CSS Modules（ページ単位スコープ）
│       └── page.test.tsx      契約テスト（タイトル・セクション数・rel・metadata）
├── components/
│   ├── （電卓 UI 9 種: ApiTable / SubTable / Hero / HomePage / LanguageToggle 等）
│   ├── docs/            ガイド共通: CodeCopyButton.tsx / MermaidDiagram.tsx
│   └── site/            共通: SiteHeader / SiteHeaderClient / DisclaimerBanner / nav-links.ts
├── lib/
│   ├── cost.ts          純粋関数（calcApiCost / calcSubCost / fmtUSD / fmtJPY）
│   ├── pricing.ts       Zod スキーマ + Pydantic とのコンパイル時パリティ検証
│   ├── i18n.tsx         JA/EN バイリンガル（電卓のみ。ガイドは JA 固定）
│   ├── useTocObserver.ts  TOC スクロール追従（Intersection Observer）
│   ├── metadata.ts / fonts.ts / site-url.ts
│   └── index.ts
├── types/pricing.ts     Pydantic models.py の手動ミラー
├── data/ + public/      pricing.json（2 箇所配信）
└── tests/               vitest（803 件全 Green — 2026-07-06 実測。docs/PROGRESS.md 記載は 801）
```

### app/ ルート内訳（41 ルート）

| 第1セグメント | ルート数 | 内容 |
|---|---|---|
| `/`（ルート） | 1 | コスト計算機ホーム |
| `claude/` | 11 | skill, agent, skill-guide ×2, cowork-guide, harness-engineering, managed-agents, self-hosted-sandboxes, code-slash-commands, fable-5-best-practices, skills-sh |
| `google/` | 9 | skill, agent, skill-guide ×2, sandbox-best-practices, antigravity-guide, antigravity-slash-commands-guide, harness-engineering, agent-harness-engineering |
| `codex/` | 4 | skill, agent, openai-codex-guide, harness-engineering |
| `copilot/` | 4 | skill, agent, markdown-file-guide, github-copilot |
| `agent/` | 4 | hermes-agent-advanced-guide, openclaw-advanced-agent-security-guide, loop-engineering, skills |
| `code-review/` | 4 | tool-pricing, coderabbit-guide, copilot-code-review, sonar-qube |
| `cursor/` | 2 | complete-guide, complete-guide-intermediate |
| `vercel/` | 1 | sandbox |
| `git-worktree` | 1 | git-worktree |

## 3. ナビゲーションカテゴリのインベントリ

`web-next/components/site/nav-links.ts:33-113` で定義。Zod スキーマ（同 :7-27）で
href の安全性（`/` 始まり・`javascript:` 拒否）をコンパイル時ではなく実行時に検証する構造。

| ナビカテゴリ | 型 | リンク数 | 軸の種類 |
|---|---|---|---|
| Home | leaf | 1 | 機能（電卓） |
| Claude | dropdown | 10 | プロバイダー |
| Google | dropdown | 9 | プロバイダー |
| Codex | dropdown | 4 | プロバイダー |
| Copilot | dropdown | 4 | プロバイダー |
| Code Review | dropdown | 4 | **トピック** |
| Agent | dropdown | 5 | **トピック** |
| Sandbox | dropdown | 1 | **トピック** |
| IDE | dropdown | 2 | **トピック** |
| Git Worktree | leaf | 1 | **トピック** |

- 全 41 ルートはナビから到達可能（孤立ページなし。2026-07-06 に nav-links.ts と app/ の突合で確認）
- プロバイダー軸 4 カテゴリ（27 リンク）とトピック軸 5 カテゴリ（13 リンク）が**同一階層に混在**

## 4. 共有インフラ資産（拡張時に再利用すべきもの）

| 資産 | 場所 | 役割 |
|---|---|---|
| nav-links + Zod | `components/site/nav-links.ts` | ナビ SSoT。カテゴリ追加はここ 1 箇所 |
| 契約テストパターン | 各 `page.test.tsx` | タイトル・セクション数・外部リンク rel・metadata の 4 点検証。新ページ追加時の雛形 |
| SiteHeader / DisclaimerBanner | `components/site/` | 全ページ共通シェル（layout.tsx でマウント） |
| CodeCopyButton | `components/docs/CodeCopyButton.tsx` | コピー付きコードブロック |
| MermaidDiagram | `components/docs/MermaidDiagram.tsx` | `next/dynamic({ ssr: false })` 遅延ロード |
| useTocObserver | `lib/useTocObserver.ts` | TOC スクロールハイライト追従 |
| i18n 基盤 | `lib/i18n.tsx` | T オブジェクト + `t()` / `tRich()`。現状は電卓のみ利用 |
| pricing パイプライン | `scraper/` + `update.sh` | 価格データの自動収集・3層フォールバック・`scrape_status` による出自追跡 |
| monthly-update スキル | `.claude/skills/monthly-update/` | 全ページの価格・バージョン・リンクの月次同期プロセス（2026-06 実績: 14/35 完了の運用実績あり） |
| nextjs-page-migration スキル | `.claude/skills/nextjs-page-migration/` | 新規ガイドページ追加の TDD 手順 |

## 5. 強み

1. **ページ追加コストが低い**: 契約テスト + CSS Modules + nav-links 追加の定型パターンが確立済み（直近の Loop Engineering / skills.sh 移行で実証。`docs/PROGRESS.md` 参照）
2. **品質ゲートが機械化済み**: 803 テスト Green（2026-07-06 実測） + typecheck + Biome + SonarQube CI
3. **価格データの自動更新基盤**: scraper + 3層フォールバックは「情報鮮度の自動維持」という
   プラットフォーム化の核になる仕組みを既に持っている（現状は価格のみ）
4. **XSS 対策の一貫性**: 生 HTML 挿入 API 不使用を静的検査テストで CI 担保

## 6. 構造的課題（evidence 付き）

### [STATE-01] プロバイダー軸とトピック軸の混在によるカテゴリ歪み

- **Evidence**: `components/site/nav-links.ts:98` — 「skills.sh Guide」は Agent（トピック）配下だが href は `/claude/skills-sh`（プロバイダー URL）。逆に `components/site/nav-links.ts:43,60-61` と `codex/harness-engineering` — 「Harness Engineering」という同一トピックが 3 プロバイダーのドロップダウンに分散
- **Impact**: 「エージェント設計を学びたい」読者はどのドロップダウンを開くべきか判断できない。トピックが増えるたびに歪みが拡大する
- **Confidence**: HIGH（コード確認済み）

### [STATE-02] コンテンツの鮮度メタデータが表示されない

- **Evidence**: 各 `page.tsx` に「最終確認日」の構造化フィールドがない。鮮度管理は `.claude/skills/monthly-update/` の運用プロセスと `docs/PROGRESS.md` の記述に依存し、**読者からは見えない**
- **Impact**: 「最新情報キャッチアップ・プラットフォーム」を標榜する上で、読者が情報の鮮度を判定できないのは致命的な信頼性欠陥になる
- **Confidence**: HIGH

### [STATE-03] 横断ナビゲーション手段の不在

- **Evidence**: 40 ガイドに対し検索・タグ・関連ページリンクが存在しない（`components/site/` にはヘッダーとバナーのみ）。ナビはドロップダウン 2 階層が唯一の導線
- **Impact**: ページ数が 50〜60 枚に達するとドロップダウンが破綻する（Claude 配下は既に 10 リンク）
- **Confidence**: HIGH

### [STATE-04] i18n 資産がガイドで未活用

- **Evidence**: `lib/i18n.tsx` は電卓 UI のみで使用。ガイド 40 枚は JA 固定（`CLAUDE.md` の設計判断として記録済み — 課題ではなく決定事項だが、EN 展開時の前提として記録）
- **Impact**: 英語圏リーチなし。ただし EN 展開はコンテンツ翻訳コストが支配的で、インフラは既存
- **Confidence**: HIGH（ADR 相当の決定として CLAUDE.md に記録あり — 003 では「選択肢」として扱う）

### [STATE-05] 更新履歴が開発者向けドキュメントにしか存在しない

- **Evidence**: 新ページ・機能の追加履歴は `docs/PROGRESS.md`（開発者向け・リポジトリ内）のみ。サイト上に What's New に相当するページがない
- **Impact**: リピーター読者が「前回訪問以降に何が増えたか」を知る手段がない
- **Confidence**: HIGH

## 7. 次のドキュメントへの接続

- **[002 ギャップ分析](002-category-gap-analysis.md)**: 上記インベントリ（§3）を基準に、AI 駆動開発の情報収集として不足しているカテゴリを特定する
- **[003 拡張ロードマップ](003-platform-expansion-roadmap.md)**: STATE-01〜05 の構造課題への対処と新カテゴリ受け入れの順序を設計する
