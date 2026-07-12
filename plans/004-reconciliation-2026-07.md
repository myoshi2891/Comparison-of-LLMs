# Plan 004: 照合ドキュメント — 001〜003 と現状の突合（Reconciliation 2026-07）

> **本ドキュメントの性格**: `.agent/skills/improve/SKILL.md` の `reconcile` バリアントに基づき、
> [001（現状分析）](001-current-state-analysis.md) / [002（ギャップ分析）](002-category-gap-analysis.md) /
> [003（拡張ロードマップ）](003-platform-expansion-roadmap.md)（いずれも commit `3915136`, 2026-07-06 作成）と
> 現状との差分を検証・記録する。**実装手順は含まない**。
> [005（ギャップ分析 v2）](005-category-gap-analysis-v2.md) と [006（ロードマップ v2）](006-platform-roadmap-v2.md) の前提資料。

## Status

- **Priority**: P1（005 / 006 の依存元）
- **Effort**: —（照合のみ、実装なし）
- **Risk**: —
- **Depends on**: [001](001-current-state-analysis.md), [002](002-category-gap-analysis.md), [003](003-platform-expansion-roadmap.md)
- **Category**: reconcile
- **Planned at**: commit `45940fd`, 2026-07-12

## Why this matters

001〜003 の作成（`3915136`）から本照合（`45940fd`）まで **154 コミット**が積まれ、
ルート数は 41 → **56** に増加した。003 §6 の STOP 条件
「nav-links.ts / 契約テストの期待値が commit `3915136` から乖離していた場合は 001 の再棚卸しから始める」
に該当するため、個別プラン起票の前に本照合で差分を確定し、001〜003 を STALE として保存する。

## 1. 実測サマリ（2026-07-12, commit `45940fd`）

| 指標 | 001〜003 作成時 | 現在 | 検証方法 |
|---|---|---|---|
| app/ ルート数 | 41 | **56** | `find web-next/app -name page.tsx \| wc -l` |
| ナビトップレベル項目 | 10 | **16** | `web-next/components/site/nav-links.ts:33-169` |
| vitest テスト数 | 803 | **931** | `AGENTS.md` / `CLAUDE.md` 記載（commit `8a5fc61` で同期済み） |
| sitemap / robots | なし | **あり** | `web-next/app/sitemap.ts`, `web-next/app/robots.ts` |
| ページレジストリ | なし | **なし（変わらず）** | `web-next/lib/page-registry.ts` 不在 |

## 2. コンテンツ拡張の照合（002 / 003 の C 項目）

以下は全て 2026-07-12 に `web-next/app/<route>/page.test.tsx` の存在を実測確認済み。
全 12 新規ページが契約テスト付きで TDD サイクル（test → feat → refactor → docs のコミット分割）により追加されている
（`git log --oneline 3915136..45940fd` で確認）。

| 計画項目 | 計画時の判断 | 現状 | 実装ルート |
|---|---|---|---|
| C-1 MCP（GAP-01, High） | 2〜3 ページ新設 | ✅ **DONE** | `/mcp/mcp-best-practices`, `/mcp/mcp-best-practices-intermediate` + ナビ「MCP」新設 |
| C-2 Context Engineering（GAP-02, High） | 2 ページ + harness 統合 | ⚠️ **部分達成** | `/agent/context-engineering-best-practices` 1 ページのみ。ナビは Agent 配下。harness-engineering 4 ページのトピック統合は未実施 |
| C-3 AI Security（GAP-03, High） | 1〜2 新規 + 既存再配置 | ⚠️ **部分達成** | `/security/ai-security-best-practices`（+中級）+ ナビ「Security」新設。**既存 openclaw / sandbox 群の紐付け・再配置は未実施** |
| C-4 Evals & Observability（GAP-05, Mid） | Agent 配下 → 需要次第 | ✅ **DONE（独立カテゴリで実装）** | `/llm-ops/evaluation-observability` + ナビ「LLMOps」新設 |
| C-5 AI CI/CD（GAP-06, Mid） | Code Review 配下 → 需要次第 | ✅ **DONE（独立カテゴリで実装）** | `/ci-cd/ai-cicd-automation-best-practices` + ナビ「CI/CD」新設 |
| GAP-07 Local LLM（Low〜Mid） | 1 ページ | ✅ **DONE（計画超過）** | `/local-llm/self-hosting`, `/local-llm/best-practices` + ナビ「Local LLM」新設 |

その他の追加（001〜003 に計画がなかったもの）: `/google/notebook-lm`, `/google/adk-best-practices`,
`/google/stitch-guide`（プロバイダー軸の深化。Google ドロップダウンは 12 リンクに増加）。

## 3. 決定変更の記録（rejected → 採用）

002 / 003 で「不採用」と記録した 2 カテゴリが、その後のユーザー判断により**採用・実装済み**となった。
README の「検討済み・不採用」リストから削除する（本セクションが削除根拠）。

### [REC-01] GAP-08 RAG: 不採用（C-2 内セクション吸収）→ 独立カテゴリとして採用

- **Evidence**: `/rag/embeddings-best-practices`（`page.test.tsx` あり）、ナビ「RAG」新設（`nav-links.ts:147-150`）
- コミット系列 `8672e9b`（test）→ `50d3137`（feat）→ `12e91fa`（refactor）→ `a8db213`（docs）

### [REC-02] GAP-09 マルチモーダル: スコープ外 → 独立カテゴリとして採用（2 ページ）

- **Evidence**: `/multimodal/generation-best-practices`, `/multimodal/image-audio-best-practices-2026`、ナビ「Multimodal」新設（`nav-links.ts:151-163`）
- 002 の不採用根拠は「読者ペルソナ（AI 駆動開発者）と不一致」だったが、採用済みの現状を優先事実とする。
  005 ではペルソナ定義自体を「AI 駆動開発者」から「AI 活用実務者（開発中心）」へ広げて再解釈する

## 4. 機能拡張（F 項目）の照合 — Phase 1 が未着手のままコンテンツが先行

| ID | 機能 | 計画時 | 現状 | 備考 |
|---|---|---|---|---|
| F-1 | ページレジストリ + 最終確認日表示 | Phase 1 最優先 | ❌ **未着手** | `web-next/lib/page-registry.ts` 不在。対象が 40 → 55 ページに増え初期値投入コストは M → **L** へ上方修正 |
| F-2 | What's New ページ | Phase 1 | ❌ 未着手 | `docs/PROGRESS.md`（開発者向け）のみ更新継続中 |
| F-3 | RSS / sitemap 強化 | Phase 1 | ⚠️ **部分達成** | `app/sitemap.ts` + `app/robots.ts` は追加済み。RSS フィードなし |
| F-4 | ナビ二軸化 | Phase 2 | ❌ 未着手（悪化） | 二軸「設計」なしにトピックカテゴリが 5 → 11 に自然増殖。§5 参照 |
| F-5 | タグ・横断検索 | Phase 3 | ❌ 未着手 | 56 ルートに到達し 003 の「50 ページ超で必須化」ラインを超過 |
| F-6 | EN 展開 | Phase 4（ユーザー判断） | ❌ 未着手 | 判断変更なし |

**構図**: 003 §5 が警告した「F-1 を飛ばして拡張するとページ属性がナビ・フィード・タグに複製され
STATE-01 と同型の歪みを再生産する」がそのまま現実化した。ただし複製先がまだ nav-links.ts 1 箇所に
留まっている今が、レジストリ導入の最後の低コストタイミングである。

## 5. 新たに顕在化した課題（001 の STATE 系に追加）

### [STATE-06] ナビトップレベルの過密（16 項目）

- **Evidence**: `nav-links.ts:33-169` — Home + プロバイダー 4 + トピック 10 + Git Worktree の 16 項目。
  うち 1 リンクのみのカテゴリが 3 つ（Sandbox / CI/CD / RAG）、2 リンクが 5 つ（MCP / Local LLM / IDE / Security / Multimodal）
- **Impact**: 001 STATE-03 の「ドロップダウン破綻」がトップレベル自体で発生。モバイル開閉トグルの一覧性も限界
- **Confidence**: HIGH（実測）

### [STATE-07] 同一トピックのカテゴリ分散が拡大

- **Evidence**:
  - Sandbox: ナビ「Sandbox」は 1 リンク（`/vercel/sandbox`）だが、`/claude/self-hosted-sandboxes` は Claude 配下、`/google/sandbox-best-practices` は Google 配下（`nav-links.ts:45,53,124`）
  - Harness Engineering: 4 ページが Claude / Google ×2 / Codex に分散（001 STATE-01 から未解消）
  - Security: ナビ「Security」新設後も `/agent/openclaw-advanced-agent-security-guide` は Agent 配下のまま
- **Impact**: カテゴリを新設するほど「どこに入れるか」の判断がページごとにブレる。レジストリの topics 多対多付けでしか解消しない
- **Confidence**: HIGH（実測）

### [STATE-08] 鮮度表示の欠如が 56 ページ規模に拡大（STATE-02 の深刻化）

- **Evidence**: 各 page.tsx に最終確認日フィールドなし（変わらず）。monthly-update スキルの 2026-06 実績は
  14/35 完了で停止しており、残 21 ページ + 新規 21 ページの鮮度が読者からもメンテナーからも見えない
- **Confidence**: HIGH

## 6. 001〜003 の処遇

- **001**: ルート数・ナビ構成・テスト数が失効 → **STALE**（本ドキュメント §1〜§2 が差分）。§4 の共有インフラ資産・§6 の STATE-01〜05 の枠組みは引き続き有効
- **002**: カバレッジマップとギャップ判定が失効（GAP-01/03/05/06/07 実装済み、GAP-08/09 決定変更）→ **STALE**。[005](005-category-gap-analysis-v2.md) が置換
- **003**: Phase 構成の前提（41 ルート・コンテンツより基盤先行）が失効 → **STALE**。[006](006-platform-roadmap-v2.md) が置換。ただし「C 案（URL 不変・ナビとメタデータの二軸化）」「F-1 が依存の要」という設計判断は 006 でも維持

## 7. 次のドキュメントへの接続

- **[005 ギャップ分析 v2](005-category-gap-analysis-v2.md)**: §2〜3 の実装済みカテゴリを新カバレッジマップの基準とし、残ギャップ（GAP-04 モデルトラッキング等）と新候補を判定する
- **[006 ロードマップ v2](006-platform-roadmap-v2.md)**: §4〜5 の未達 F 項目と STATE-06〜08 を入力に、Phase を再編する
