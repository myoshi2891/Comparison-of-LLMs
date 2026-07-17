# Plan 006: AI 最新情報キャッチアップ・プラットフォーム拡張ロードマップ v2

> **本ドキュメントの性格**: [004（照合）](004-reconciliation-2026-07.md) の未達項目・新課題 STATE-06〜08 と
> [005（ギャップ分析 v2）](005-category-gap-analysis-v2.md) の GAP-10〜14 を入力に、
> プラットフォームの目指す構成・実施順序・トレードオフを再定義する方向性ドキュメント。
> [003（ロードマップ v1）](003-platform-expansion-roadmap.md) を置換する（003 は STALE — 004 §6 参照）。
> **本ドキュメント自体は実装しない**。各項目は着手時に improve スキルの `plan <description>` で
> 個別の実行プラン（`plans/NNN-*.md`）へ分割する。

## Status

- **Priority**: P1（方向性の合意が全プランの前提）
- **Effort**: 項目別に記載（direction のため概算 — 精緻化は個別プラン時）
- **Risk**: 項目別に記載
- **Depends on**: [004](004-reconciliation-2026-07.md), [005](005-category-gap-analysis-v2.md)
- **Category**: direction
- **Planned at**: commit `45940fd`, 2026-07-12

## 1. 目標像の再確認と現在地

003 §1 の目標像は変更しない:

> 「AI 駆動開発の実務者が、**信頼できる鮮度表示付き**で、プロバイダー横断のトピック軸から
> 最新のツール・プロトコル・手法をキャッチアップできる日本語プラットフォーム」

003 が挙げた 3 差分の現在地（004 で照合済み）:

| 差分 | 003 時点 | 現在（56 ルート） |
|---|---|---|
| 1. 鮮度が見えない | 未解消 | **未解消のまま対象が 41 → 55 ページに拡大**（STATE-08）。最大の負債 |
| 2. トピック軸が弱い | 未解消 | **カテゴリ数としては解消**（トピック 11 カテゴリ）。ただし設計なき増殖でトップレベル過密（STATE-06）と分散（STATE-07）が発生 |
| 3. 横断導線がない | 未解消 | 未解消。sitemap.ts は追加されたが読者向け導線（検索・タグ・関連リンク）はゼロ |

**v2 の基本認識**: コンテンツの量と幅は既に「プラットフォーム」水準に達した。ボトルネックは
コンテンツではなく**構造（鮮度・ナビ・横断導線）**に完全に移った。よって v2 では
「基盤 → コンテンツ」の順序を v1 以上に強く強制する。

## 2. 情報アーキテクチャ（IA）再設計

### 2.1 原則の維持

003 §2 の **C 案（URL 不変・ナビとメタデータのみ二軸化）** を維持する。理由も同一:
既存 56 URL は外部参照されており、`output: 'export'` + Netlify 構成でのリダイレクトは
netlify.toml 変更（AI 変更ルールで原則禁止・要ユーザー承認）を伴うため。

### 2.2 ナビトップレベルの再グルーピング（STATE-06 対応）

> **実装済み（2026-07-14 / [008](008-nav-regrouping-f4.md)）。以下は実装で確定した内容へ訂正済み。**
> 起票時の記述（「現行 16 項目を 8 項目へ」「openclaw 移設」「topics から導出」）は
> 実測・実装と食い違っていたため、下記のとおり修正した。

現行 **18 項目**を **7 項目**へ集約する（リンク数は 2026-07-12 実測 / 全 57 ページ）:

```text
Home（電卓）
Providers ▾        … Claude 10 / Google 12 / Codex 4 / Copilot 4 の 2 段ネスト（計 30）
Agent 開発 ▾       … Agent 6（openclaw 含む） + MCP 2 + Vercel Sandbox 1（分散解消）= 9
                     ＋ オーケストレーション / SDD（GAP-10/11 の受け皿）
開発プロセス ▾     … Code Review 4 + IDE 2 + CI/CD 1 + Git Worktree 1 = 8
運用・品質 ▾       … Security 2 + LLMOps 1 = 3 ＋ ガバナンス（GAP-12 の受け皿）
モデル・データ ▾   … Local LLM 2 + RAG 1 + Multimodal 2 = 5 ＋ ファインチューニング（GAP-13 の受け皿）
What's New         … Phase 1 の F-2（新設）
```

- 2 段ネスト（グループ → カテゴリ → ページ）は旧 `DropdownSchema`（当時の `nav-links.ts:22-25`）が
  1 段しか表現できなかったため、スキーマを `children: (Leaf | SubGroup)[]` の union へ拡張した
- **2 段ネストは Providers のみ**に適用する。全グループを 2 段にすると CI/CD・Git Worktree・RAG のような
  1 ページのカテゴリで 3 段ホバーが生まれ、STATE-06 が指摘した「1 リンクのみのカテゴリ」問題が
  階層を変えて再発するため（008 設計判断 2）
- グルーピングは**レジストリの `group` / `category` から導出**する（起票時は「topics から導出」と
  書いたが、topics は多対多かつ表記ゆれがありメニューの並び順を決められない）。
  `nav-links.ts` への直書きは **008 で全廃**した
- **openclaw の Security への移設は不採用**（008 設計判断 3）。エージェントを安全に「作る」ための
  ガイドであり読者は Agent 開発から探す。横断性は `topics: ["agent","security","guide"]` が既に
  表現しており、その活用は F-5 / F-7（横断検索・関連リンク）の担当

### 2.3 メタデータ SSoT: ページレジストリ（F-1、v1 から変更なし・最優先を再宣言）

```text
web-next/lib/page-registry.ts（新設・概念形）
  { slug, title, provider?, topics[], group, addedAt, lastReviewed, summary }
```

- `nav-links.ts` の Zod 検証パターンを踏襲。ナビ・What's New・鮮度表示・タグ・RSS すべてを
  registry から導出する
- 契約テストで「全 page.tsx が registry に登録済み」を機械検証（既存テストパターンで実現可能）
- **コスト上方修正**: 対象 55 ページ（v1 時点 40）。`addedAt` は `git log --follow --diff-filter=A` で、
  `lastReviewed` は monthly-update の 2026-06 実績（14/35）と `docs/PROGRESS.md` から初期値を機械的に採取する
- **これ以上遅らせるほど初期値投入コストが増える**。004 §4 のとおり、属性の複製先がまだ
  nav-links.ts 1 箇所である今が最後の低コストタイミング

## 3. フェーズ再編（v2）

```text
Phase 1: 鮮度基盤（最優先・他のすべての前提）
  F-1  ページレジストリ + 各ページの最終確認日表示     Impact High / Effort L / Risk LOW
  F-2  What's New ページ（registry から静的生成）       Impact High / Effort S〜M / Risk LOW
  F-2' monthly-update スキルとの接続 — 確認結果を lastReviewed へ書き戻す運用の確立
       （2026-06 実績 14/35 の残 21 ページ + 新規 21 ページの棚卸しを初回データ投入と兼ねる）

Phase 2: IA 再編（STATE-06/07 対応）  ← 実装済み（2026-07-14 / plans/008）
  F-4' ナビ再グルーピング（§2.2）+ スキーマ 2 段ネスト化   Impact High / Effort M / Risk MED
       ナビを page-registry からの導出に変更し、トップレベル 18 → 7 項目へ集約。
       2 段ネストは Providers のみ。URL は不変（§2.1 C 案）。
       registry ⇔ ナビの全単射を契約テストで固定し、ページ追加時のナビ登録漏れを機械検知

Phase 3: 横断導線
  F-3' RSS フィード（registry から生成。sitemap.ts は既存）  Impact Mid / Effort S / Risk LOW
  F-5  タグ・横断検索（ビルド時インデックス）               Impact High / Effort L / Risk MED
       （検索ライブラリ追加は外部依存 — 要ユーザー承認。自前実装で回避可なら回避）
  F-7  関連ページリンク（registry の topics 近接から導出）   Impact Mid / Effort S / Risk LOW（新規）

Phase 4: コンテンツ拡張（005 の採用分 — Phase 1 完了後に着手）
  C-10 マルチエージェントオーケストレーション 2 ページ（GAP-10, High）
  C-11 仕様駆動開発 SDD 1〜2 ページ（GAP-11, High）
  C-12 AI ガバナンス 1 ページ — Security 深化（GAP-12, Mid） **DONE**（2026-07-17、`/governance/ai-governance`）
  C-13 ファインチューニング 1 ページ — Local LLM 深化（GAP-13, Low〜Mid） **DONE**（2026-07-16、`/local-llm/finetuning-best-practices`）
  （GAP-14 音声・リアルタイムは新ページなし — Multimodal 既存ページへの追記で対応）

Phase 5（任意・ユーザー判断待ち）:
  F-6  EN 展開（JA 固定は CLAUDE.md 記載の設計判断 — 変更はユーザー判断事項）
```

- **依存の要は引き続き F-1**。F-2 / F-3' / F-4' / F-5 / F-7 はすべて registry から導出する
- **Phase 4 を Phase 1 の後に置くのが v2 の核心**: 004 で確認したとおり、v1 では
  コンテンツが基盤より先行して STATE-06〜08 を生んだ。新規ページは「registry 登録 + 鮮度表示付き」で
  生まれる状態になってから追加する
- 例外: 緊急性の高い時事コンテンツ（新モデル・新ツールのリリース対応）は Phase 1 完了を待たずに
  追加してよいが、その場合も nav-links 追加時に registry 移行対象であることをコミットメッセージに残す

## 4. 運用との接続（monthly-update / docs-sync）

- F-1 の `lastReviewed` は `.claude/skills/monthly-update/` の確認プロセスと一体化する:
  月次確認の完了 = registry の該当エントリ更新 = サイト上の鮮度表示更新、が 1 コミットで閉じる
- `docs/PROGRESS.md`（開発者向け）と What's New（読者向け）の二重管理を避けるため、
  F-2 実装時に「What's New は registry の `addedAt` から自動導出、PROGRESS.md は開発詳細のみ」と
  役割を分離する
- 週次〜月次で `.agent/skills/improve/SKILL.md` の `reconcile` を回し、本ドキュメントと実装の
  ドリフトを README のステータス表へ反映する（今回 004 が初回実施）

## 5. 個別プラン化の指針（実装着手時）

1. 各項目は improve スキルの `plan <description>` で `plans/NNN-*.md` として起票する
   （例: `plan F-1 ページレジストリと最終確認日表示の導入`）。F-4'（スキーマ変更を伴う）と
   F-5 は build プランではなく **design/spike プラン**から始める
2. 個別プランは `.agent/skills/improve/references/plan-template.md` に準拠し、
   TDD ルール（`.claude/rules/tdd-mandatory-cycle.md`: Red → Green → Refactor → Docs Sync の
   コミット分割）を Steps に織り込む
3. **ユーザー確認が必須の項目**: URL 移動・リダイレクト（netlify.toml）、検索ライブラリ等の
   外部依存追加（F-5）、EN 展開（F-6）、ナビ大規模変更（F-4' — 全ページの見え方が変わるため
   着手前に §2.2 のグルーピング案の承認を得る）
4. **STOP 条件の共通形**: nav-links.ts / ルート数 / 契約テストの期待値が本ドキュメント作成時
   （commit `45940fd`, 56 ルート・ナビ 16 項目・テスト 931 件）から乖離していた場合は、
   improve `reconcile` による再照合（004 の更新または 007 起票）から始める

## 6. 本ロードマップで扱わないこと（rejected）

- **URL 全面再編（トピック軸 URL への移動）**: v1 から継続して不採用。C 案（§2.1）で目的を達成できる限り実施しない
- **CMS / DB の導入**: pure SSG + Git 管理の強みを放棄する理由がない（v1 から継続）
- **音声・リアルタイムエージェントの新カテゴリ／新ページ**: 005 GAP-14 のとおり Multimodal 既存ページへの追記で対応
- **1 ページ規模の新カテゴリ乱立**: 005 §4 の判断基準 D-1〜D-3 を満たさない限りカテゴリを新設しない

（v1 で rejected だった RAG 独立カテゴリ・マルチモーダルは 004 §3 のとおり採用済みへ決定変更 —
本リストからは削除）
