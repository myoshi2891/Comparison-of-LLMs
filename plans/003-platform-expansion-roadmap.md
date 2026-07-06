# Plan 003: AI 最新情報キャッチアップ・プラットフォーム拡張ロードマップ

> **本ドキュメントの性格**: [001（現状分析）](001-current-state-analysis.md) の構造課題 STATE-01〜05 と
> [002（ギャップ分析）](002-category-gap-analysis.md) の GAP-01〜09 を入力に、
> プラットフォームの目指す構成・実施順序・トレードオフを定義する方向性ドキュメント。
> **本ドキュメント自体は実装しない**。各項目は着手時に improve スキルの `plan <description>` で
> 個別の実行プラン（`plans/NNN-*.md`）へ分割する。

## Status

- **Priority**: P1（方向性の合意が全プランの前提）
- **Effort**: 項目別に記載（direction のため概算 — 精緻化は個別プラン時）
- **Risk**: 項目別に記載
- **Depends on**: [001](001-current-state-analysis.md), [002](002-category-gap-analysis.md)
- **Category**: direction
- **Planned at**: commit `3915136`, 2026-07-06

## 1. プラットフォームの目標像

> 「AI 駆動開発の実務者が、**信頼できる鮮度表示付き**で、プロバイダー横断のトピック軸から
> 最新のツール・プロトコル・手法をキャッチアップできる日本語プラットフォーム」

現状との差分は 3 点に集約される:

1. **鮮度が見えない**（STATE-02/05）→ 情報プラットフォームとしての信頼性の根幹
2. **トピック軸が弱い**（STATE-01/03、GAP-01〜03）→ 実務者は「Claude のページ」ではなく「MCP のページ」を探す
3. **横断導線がない**（STATE-03）→ 40 ページ超のスケールでドロップダウンが限界

## 2. 情報アーキテクチャ（IA）の再編方針

### 選択肢の比較

| 案 | 内容 | 利点 | 欠点 |
|---|---|---|---|
| A: 現状維持 | プロバイダー軸のまま追加 | 作業ゼロ | STATE-01 の歪みが拡大し続ける |
| B: 完全トピック軸再編 | URL ごと `/topics/mcp/` 等へ移動 | IA が一貫 | 全 URL 変更 + リダイレクト必須。**netlify.toml 変更は AI 変更ルールで原則禁止**（要ユーザー承認）。SEO リスク |
| **C: ハイブリッド（推奨）** | **URL は不変。ナビとメタデータだけ二軸化** | リダイレクト不要・低リスク・段階導入可 | URL とトピックの対応は registry（後述）が担保する間接構造になる |

**推奨は C**。根拠: 既存 41 URL は外部から参照されており、`output: 'export'` + Netlify という
構成上リダイレクトは netlify.toml でしか実現できず、これは AI 変更ルール（CLAUDE.md「環境変数・
Netlify 設定の変更」禁止）に抵触するため、URL 移動はユーザーの明示判断が必要な HIGH リスク作業。
一方ナビの二軸化は `web-next/components/site/nav-links.ts` の編集のみで完結する。

### C 案の骨子: ページレジストリ（メタデータ SSoT）

全機能拡張の共通基盤として、各ページの属性を 1 箇所に集約する:

```text
web-next/lib/page-registry.ts（新設・概念形）
  { slug, title, provider?, topics[], addedAt, lastReviewed, summary }
```

- `nav-links.ts`（Zod 検証パターン）の発展形として同じ流儀で実装し、ナビ・What's New・
  鮮度表示・タグ・RSS がすべてこの registry から導出される構造にする
- 既存の契約テストパターンで「全 page.tsx が registry に登録されていること」を機械検証できる

## 3. 機能拡張候補（impact / effort / risk）

| ID | 機能 | 対応課題 | Impact | Effort | Risk |
|---|---|---|---|---|---|
| F-1 | ページレジストリ + 最終確認日表示 | STATE-02, GAP-04 | **High**（信頼性の根幹） | M（40 ページへの初期値投入が主コスト） | LOW（表示追加のみ、URL 不変） |
| F-2 | What's New ページ（更新情報フィード） | STATE-05, GAP-04 | **High**（リピーター価値） | S〜M（registry から静的生成） | LOW |
| F-3 | RSS フィード / sitemap 強化 | STATE-05 | Mid（キャッチアップ動線） | S（ビルド時生成。既存 sitemap の有無は着手時に要確認） | LOW |
| F-4 | ナビ二軸化（トピックドロップダウン追加） | STATE-01/03 | High | S（nav-links.ts + テスト更新のみ） | LOW〜MED（既存ナビテストの期待値更新が必要） |
| F-5 | タグ・横断検索（ビルド時インデックス） | STATE-03 | Mid〜High（50 ページ超で必須化） | L | MED（検索ライブラリ追加は「外部依存の追加」で要ユーザー確認。自前実装なら回避可） |
| F-6 | EN 展開（ガイドの i18n 化） | STATE-04 | Mid（リーチ拡大） | XL（翻訳コストが支配的。`lib/i18n.tsx` 基盤は既存） | MED（JA 固定は CLAUDE.md 記載の設計判断 — 変更はユーザー判断事項） |

## 4. コンテンツ拡張候補（002 の結論の実施形）

| ID | カテゴリ | 出典 | 新規ページ | ナビ配置（C 案） |
|---|---|---|---|---|
| C-1 | MCP | GAP-01 | 2〜3（入門 / サーバー構築 / セキュリティ） | 新トピック「MCP」 |
| C-2 | Context Engineering | GAP-02 | 2（原則 / 実践） | 新トピック（既存 harness-engineering 4 ページを registry の topics で同カテゴリに紐付け） |
| C-3 | AI Security | GAP-03 | 1〜2 + 既存 openclaw / sandbox 群の紐付け | 新トピック「AI Security」 |
| C-4 | Evals & Observability | GAP-05 | 1〜2 | Agent 配下 → 需要次第で独立 |
| C-5 | AI CI/CD | GAP-06 | 1〜2 | Code Review 配下 → 需要次第で独立 |

新規ページの実装は既存の確立パターン（`.claude/skills/nextjs-page-migration/` の TDD 手順、
契約テスト、CSS Modules、`components/docs/` の共有コンポーネント）に完全準拠する。

## 5. フェーズ分けと依存関係

```text
Phase 1: 情報鮮度基盤（F-1 → F-2 → F-3）
  └─ F-1 の registry が F-2/F-3/F-4/F-5 すべての前提。最優先
Phase 2: カテゴリ拡張（C-1 MCP → C-2 Context Eng → C-3 AI Security）＋ F-4 ナビ二軸化
  └─ F-4 は C-1 の 1 ページ目と同時に入れると新カテゴリの受け皿が最初から存在する
Phase 3: 横断機能（F-5 タグ・検索）
  └─ registry（F-1）と一定のページ数（Phase 2 完了後）が揃ってから
Phase 4（任意・ユーザー判断待ち）: C-4 / C-5 の需要確認後追加、F-6 EN 展開
```

- **依存の要**: F-1（registry）。これを飛ばして F-2 以降を作ると、ページ属性が
  ナビ・フィード・タグに三重複製され STATE-01 と同型の歪みを再生産する
- **monthly-update スキルとの接続**: F-1 導入後は monthly-update の確認結果を
  `lastReviewed` 更新として registry に書き戻すことで、運用プロセスと表示が一体化する

## 6. 個別プラン化の指針（実装着手時）

1. 各項目は improve スキルの `plan <description>` で `plans/NNN-*.md` として起票する
   （例: `plan F-1 ページレジストリと最終確認日表示の導入`）。direction 項目のため、
   F-5 と F-6 は build プランではなく **design/spike プラン**（方式調査 + プロトタイプ + 未解決論点の列挙）から始める
2. 個別プランは `.agent/skills/improve/references/plan-template.md` に準拠し、
   TDD ルール（`.claude/rules/tdd-mandatory-cycle.md`: Red → Green → Refactor → Docs Sync のコミット分割）を Steps に織り込む
3. **ユーザー確認が必須の項目**（AI 変更ルール抵触）: URL 移動・リダイレクト（netlify.toml）、
   検索ライブラリ等の外部依存追加、EN 展開（既存設計判断の変更）
4. **STOP 条件の共通形**: nav-links.ts / 契約テストの期待値が本ドキュメント作成時
   （commit `3915136`）から乖離していた場合は、001 の再棚卸しから始める

## 7. 本ロードマップで扱わないこと（rejected）

- **マルチモーダル / 画像・音声生成カテゴリ**: GAP-09 のとおり読者ペルソナが異なるため不採用
- **RAG 独立カテゴリ**: GAP-08 のとおり C-2（Context Engineering）内の 1 セクションへ吸収
- **URL 全面再編（B 案）**: リダイレクト運用コストと AI 変更ルール抵触のため、C 案で目的を達成できる限り実施しない
- **CMS / DB の導入**: pure SSG + Git 管理という現行アーキテクチャの強み（`docs/` 参照）を放棄する理由がない
