# Plan 005: AI 情報収集カテゴリのギャップ分析 v2（Category Gap Analysis v2）

> **本ドキュメントの性格**: [004（照合）](004-reconciliation-2026-07.md) で確定した現状（56 ルート、commit `45940fd`）を
> 基準に、「AI に関する情報収集・AI 駆動開発のための情報プラットフォーム」として残っている不足カテゴリを、
> リポジトリ内 evidence と 2026-07 時点の外部トレンドの両面から特定する分析ドキュメント。実装手順は含まない。
> [002（ギャップ分析 v1）](002-category-gap-analysis.md) を置換する（002 は STALE — 004 §6 参照）。

## Status

- **Priority**: P1
- **Effort**: —（分析のみ）
- **Risk**: —
- **Depends on**: [004-reconciliation-2026-07.md](004-reconciliation-2026-07.md)
- **Category**: direction
- **Planned at**: commit `45940fd`, 2026-07-12

## Why this matters

002 のギャップ 9 件のうち 7 件が 1 週間で実装され（004 §2〜3）、プラットフォームは「コーディング
エージェントの使い方」偏重から大きく広がった。一方で 002 が最も効果的だった予測手法 —
**「多数のページが断片的に言及しているのに主題ページがないトピック」の検出**（MCP は 26 ページ言及で
主題 0 だった）— を 56 ルート時点で再実行すると、次の波が既に見えている。

なお読者ペルソナは、Multimodal / NotebookLM / Stitch の採用実績（004 REC-02）を踏まえ、
002 の「AI 駆動開発者」から「**AI 活用実務者（開発中心）**」へ広げて解釈する。

## 1. 現状カバレッジマップ v2（56 ルート）

| 情報カテゴリ | カバー状況 | 該当ページ数・備考 |
|---|---|---|
| コスト計算・料金比較 | ✅ 厚い（自動更新付き） | 電卓ホーム + `/code-review/tool-pricing` |
| コーディングエージェントの使い方 | ✅ 最も厚い | Claude 10 / Google 12 / Codex 4 / Copilot 4（プロバイダー軸 30） |
| AI コードレビュー | ✅ | 4 |
| エージェント設計・運用 | ✅ | Agent 6（context-engineering 含む）+ harness-engineering 4（プロバイダー分散） |
| MCP | ✅ | 2（入門・中級） |
| AI セキュリティ | ✅ | 2 + openclaw 1（Agent 配下に分散 — 004 STATE-07） |
| サンドボックス | ✅ | 3（3 カテゴリに分散 — 004 STATE-07） |
| 評価・オブザーバビリティ（LLMOps） | ✅ | 1 |
| AI CI/CD | ✅ | 1 |
| ローカル LLM | ✅ | 2 |
| RAG・埋め込み | ✅ | 1 |
| マルチモーダル生成 | ✅ | 2 |
| IDE | △ 薄い | 2（Cursor のみ） |
| Git ワークフロー | △ 単発 | 1 |
| **マルチエージェントオーケストレーション** | ❌ **主題ページなし** | §3 GAP-10 |
| **仕様駆動開発（SDD）** | ❌ **主題ページなし** | §3 GAP-11 |
| **モデルリリース・トラッキング** | ❌（機能としても未実装） | §3 GAP-04'（002 から継続） |
| AI ガバナンス・コンプライアンス | △ | security-intermediate 内で EU AI Act に言及のみ |

## 2. 外部トレンド検証（2026-07-12 時点、WebSearch 実施済み）

- **マルチエージェントオーケストレーション**: 導入は前年比 1,445% 増、組織の 57% が本番でマルチステップ
  エージェントワークフローを運用。fan-out / pipeline / debate / supervisor / swarm の 5 パターンが
  本番システムの定石として確立。コーディングセッションは平均 4 分 → 23 分に伸び、78% がマルチファイル編集
- **仕様駆動開発（SDD）**: 2026 年時点で主要 AI コーディングツール（GitHub Spec Kit, AWS Kiro,
  Claude Code, Cursor, OpenSpec, Google Antigravity 等）がすべて SDD ワークフローを搭載。
  Spec Kit は v0.11.0（2026-06）で 30+ エージェント対応。早期導入報告では非自明タスクの
  first-pass 成功率が約 3〜10 倍

参照元（確認日 2026-07-12）:
[Firecrawl: Top 13 Agentic AI Trends 2026](https://www.firecrawl.dev/blog/agentic-ai-trends) /
[Digital Applied: Multi-Agent Orchestration 5 Patterns](https://www.digitalapplied.com/blog/multi-agent-orchestration-5-patterns-that-work) /
[Codebridge: Mastering Multi-Agent Orchestration](https://www.codebridge.tech/articles/mastering-multi-agent-orchestration-coordination-is-the-new-scale-frontier) /
[GitHub Blog: Spec-driven development with AI](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) /
[BCMS: Spec-Driven Development 2026 Guide](https://thebcms.com/blog/spec-driven-development) /
[github/spec-kit](https://github.com/github/spec-kit)

## 3. ギャップ候補（優先度順）

各候補の repo 内言及数は 2026-07-12 に `grep -rl <keyword> --include='page.tsx' web-next/app` で実測。
番号は 002 の GAP-01〜09 から継続する。

### [GAP-10] マルチエージェントオーケストレーション — 優先度 High

- **Evidence（repo）**: 「サブエージェント/エージェントチーム」言及 **27 ページ**、「マルチエージェント」14 ページ、
  「オーケストレーション」9 ページ — **主題ページは 0**。002 で MCP をカテゴリ化する根拠となった
  「26 ページ言及・主題 0」と同規模のシグナル
- **Evidence（外部）**: §2 — 導入 1,445% 増、5 パターンの定石化
- **既存カテゴリとの関係**: Agent 配下が自然（`/agent/loop-engineering` や harness-engineering 群の上位概念）。
  A2A / Agent2Agent プロトコル（言及 2 ページ）はこの中の 1 セクションで扱う
- **Confidence**: HIGH ／ **想定ページ数**: 2（設計パターン編・運用編）

### [GAP-11] 仕様駆動開発（Spec-Driven Development） — 優先度 High

- **Evidence（repo）**: 「仕様駆動」5 ページ + 「spec-driven / Spec Kit」6 ページが断片言及 — 主題ページ 0。
  このリポジトリ自体が requirements/design/tasks 構造のスキル
  （`.agent/skills/ai-driven-development-guidelines`）を運用しており「自分で実践しているのに解説がない」
  状態（002 GAP-06 で AI CI/CD をカテゴリ化したのと同じシグナル）
- **Evidence（外部）**: §2 — 主要全ツールが SDD 搭載、業界標準化が進行
- **既存カテゴリとの関係**: 特定プロバイダーに属さない開発プロセス論。新トピックまたは Agent 配下
- **Confidence**: HIGH ／ **想定ページ数**: 1〜2（概念 + Spec Kit 等ツール比較）

### [GAP-04'] モデルリリース・アップデートトラッキング — 優先度 High（002 から継続）

- **Evidence（repo）**: 「モデルリリース/リリースノート」言及 13 ページ。scraper + monthly-update という
  鮮度維持の仕組みは価格のみ対象のまま（004 §4 F-1/F-2 未着手）。002 時点から**唯一実装されなかった High**
- **性格**: ページ群ではなく**プラットフォーム機能**（What's New / 鮮度表示）。[006](006-platform-roadmap-v2.md) Phase 1 で扱う
- **Confidence**: HIGH

### [GAP-12] AI ガバナンス・コンプライアンス — 優先度 Mid

- **Evidence（repo）**: 「ガバナンス」言及 10 ページ、「EU AI Act」5 ページ。
  `/security/ai-security-best-practices-intermediate` が EU AI Act に触れており、「1 ページ（の一部）だけある」
  カテゴリ化直前シグナル（002 GAP-03 で Security を予測したパターンの再来）
- **判断**: 独立カテゴリではなく **Security カテゴリの深化**（§4 の判断基準 D-1 適用）。
  規制動向は変化が速く monthly-update の負担になるため、原則論（AI 利用ポリシー設計・監査ログ・データ取扱）中心で 1 ページ
- **Confidence**: MED ／ **想定ページ数**: 1（Security 配下）

### [GAP-13] ファインチューニング / モデルカスタマイズ — 優先度 Low〜Mid

- **Evidence（repo）**: 言及 10 ページ。`/local-llm/` 2 ページが隣接（セルフホストの次の実務ステップ）
- **判断**: 独立カテゴリにせず **Local LLM カテゴリの深化**として 1 ページ。クラウド API のファインチューニング
  はコスト観点で電卓との相性も良い
- **Confidence**: LOW（ペルソナ適合は要観察）／ **想定ページ数**: 1（Local LLM 配下）

### [GAP-14] 音声・リアルタイムエージェント — 採否判断: Multimodal へ吸収を推奨

- **Evidence（repo）**: 「音声」9 ページ、「リアルタイム」22 ページ（ただし大半はリアルタイム処理一般の文脈）。
  `/multimodal/image-audio-best-practices-2026` が音声生成を既にカバー
- **判断**: 新カテゴリ・新ページとも起こさず、既存 Multimodal 2 ページの次回 monthly-update で
  リアルタイム音声エージェント（Realtime API 系）のセクション追記に留める
- **Confidence**: MED（吸収判断について）

## 4. カテゴリ「深化 vs 新設」の判断基準

004 STATE-06 のとおりナビトップレベルは 16 項目で飽和しており、1〜2 リンクのカテゴリが 8 つある。
今後は以下を満たす場合のみ新カテゴリを起こす（すべて AND）:

- **D-1**: 既存カテゴリのどの切り口とも重ならない主題である（重なるなら既存カテゴリの深化）
- **D-2**: 初回から 2 ページ以上を計画できる（1 ページなら既存カテゴリ配下に置き、増えた時点で昇格）
- **D-3**: [006](006-platform-roadmap-v2.md) の IA 再編後の大分類に収まる場所が特定できる

本分析への適用結果: GAP-10（Agent 配下で開始 → 需要次第で昇格）、GAP-11（新設候補だが 1 ページ開始なら
Agent 配下）、GAP-12（Security 深化）、GAP-13（Local LLM 深化）、GAP-14（Multimodal 追記のみ）。

## 5. 推奨カテゴリ体系 v2（006 への入力）

```text
コンテンツ追加（High）:  マルチエージェントオーケストレーション（GAP-10, Agent 配下 2 ページ）
                        仕様駆動開発 SDD（GAP-11, 1〜2 ページ）
機能として追加（High）:  モデルリリース・トラッキング（GAP-04' → 006 Phase 1: registry + What's New）
深化（Mid〜Low）:        AI ガバナンス（GAP-12, Security 配下 1）/ ファインチューニング（GAP-13, Local LLM 配下 1）
吸収（新ページなし）:     音声・リアルタイム（GAP-14 → Multimodal 既存ページへ追記）
```

新規ページの実装は既存の確立パターン（`.claude/skills/nextjs-page-migration/` の TDD 手順、契約テスト、
CSS Modules、`components/docs/` 共有コンポーネント、`.claude/rules/tdd-mandatory-cycle.md` のコミット分割）に
完全準拠する。ナビ配置は 006 の IA 再編（トピック大分類）を前提とする。
