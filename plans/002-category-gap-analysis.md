# Plan 002: AI 情報収集カテゴリのギャップ分析（Category Gap Analysis）

> **本ドキュメントの性格**: [001（現状分析）](001-current-state-analysis.md) のインベントリを基準に、
> 「AI に関する情報収集・AI 駆動開発のための情報プラットフォーム」として不足しているカテゴリを、
> リポジトリ内の evidence と 2026 年時点の外部トレンドの両面から特定する分析ドキュメント。実装手順は含まない。

## Status

- **Priority**: P1
- **Effort**: —（分析のみ）
- **Risk**: —
- **Depends on**: [001-current-state-analysis.md](001-current-state-analysis.md)
- **Category**: direction
- **Planned at**: commit `3915136`, 2026-07-06

## Why this matters

現行 40 ガイドは「コーディングエージェントの使い方」（プロバイダー別 Skill / Agent / Harness）に
強く偏っている。AI 駆動開発の実務は 2026 年時点で「エージェントへの移行・MCP 標準化・
コンテキストエンジニアリング・評価と観測」へ広がっており、このギャップを放置すると
プラットフォームの網羅性が読者の実務ニーズから乖離する。

## 1. 現状カバレッジマップ

001 §3 のインベントリを情報カテゴリとして再集計したもの:

| 情報カテゴリ | カバー状況 | 該当ページ |
|---|---|---|
| コスト計算・料金比較 | ✅ 厚い | 電卓ホーム, `/code-review/tool-pricing`（自動更新パイプラインあり） |
| コーディングエージェントの使い方 | ✅ 最も厚い | Claude/Google/Codex/Copilot の skill・agent・guide 群（27 ページ） |
| AI コードレビュー | ✅ あり | code-review 4 ページ |
| エージェント設計・運用 | ✅ あり | agent 4 ページ + harness-engineering 4 ページ（プロバイダー分散） |
| サンドボックス・実行環境 | ✅ あり | vercel/sandbox, claude/self-hosted-sandboxes, google/sandbox-best-practices |
| IDE | △ 薄い | cursor 2 ページのみ |
| Git ワークフロー | △ 単発 | git-worktree 1 ページ |

## 2. 外部トレンド検証（2026-07 時点、WebSearch 実施済み）

ギャップ候補の裏付けとして確認した 2026 年時点の外部シグナル:

- **エージェントへの移行**: 開発者の役割が「AI オーケストレーター」へ移行。コパイロット型からエージェント型が標準に
- **MCP の標準化**: MCP サーバーは 2025-08〜2026-02 の 6 ヶ月で 232% 増。エージェントスタックの共通言語として定着
- **コンテキストエンジニアリング**: エージェント精度向上の中核規律として確立
- **評価と観測**: エージェントのオブザーバビリティ導入 89% に対し evals 導入は 52% — 実務ギャップが大きく情報需要が高い
- **品質と信頼**: 開発者の 96% が AI 出力を無条件には信頼せず、品質が本番導入の最大障壁（32%）

参照元（確認日 2026-07-06）:
[The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/the-impact-of-ai-on-software-engineers-2026) /
[Anthropic 2026 Agentic Coding Trends Report](https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf) /
[The New Stack: MCP roadmap 2026](https://thenewstack.io/model-context-protocol-roadmap-2026/) /
[LangChain: State of Agent Engineering](https://www.langchain.com/state-of-agent-engineering) /
[Anthropic: Demystifying evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

## 3. ギャップ候補（優先度順）

各候補の repo 内言及数は 2026-07-06 に `grep -rl <keyword> --include='page.tsx' web-next/app` で実測。

### [GAP-01] MCP（Model Context Protocol）専用カテゴリ — 優先度 High

- **Evidence（repo）**: 40 ガイド中 **26 ページが MCP に言及**しているが、MCP を主題とするページ・カテゴリは 0。断片的な言及が最多のトピック
- **Evidence（外部）**: §2 — 6 ヶ月で 232% 増、エージェントスタックの標準
- **既存カテゴリとの関係**: Agent カテゴリの下位ではなく独立カテゴリが妥当（サーバー構築・セキュリティ・クライアント設定と切り口が多い）
- **Confidence**: HIGH ／ **想定ページ数**: 2〜3（入門・サーバー構築・セキュリティ）

### [GAP-02] コンテキストエンジニアリング / プロンプト設計 — 優先度 High

- **Evidence（repo）**: 「コンテキストエンジニアリング」への言及 **0 ページ**。一方で harness-engineering 4 ページ・skill-guide 群という隣接資産が既に厚く、「エージェントに何を読ませるか」の体系的解説だけが欠けている
- **Evidence（外部）**: §2 — 2026 年の中核規律として確立
- **既存カテゴリとの関係**: harness-engineering 群（現状 3 プロバイダーに分散 — 001 STATE-01）をトピック軸で統合する受け皿になり得る
- **Confidence**: HIGH ／ **想定ページ数**: 2（原則編・実践編）

### [GAP-03] AI セキュリティ — 優先度 High

- **Evidence（repo）**: プロンプトインジェクション言及 6 ページ、`/agent/openclaw-advanced-agent-security-guide` という深掘りページが既に 1 枚存在 — 「1 ページだけある」のはカテゴリ化直前の典型シグナル
- **既存カテゴリとの関係**: openclaw ガイド + sandbox 3 ページを「AI Security」カテゴリへ横断整理し、一般論（インジェクション分類・権限設計・サンドボックス境界）を追加
- **Confidence**: HIGH ／ **想定ページ数**: 1〜2 新規 + 既存 1〜4 の再配置

### [GAP-04] モデルリリース・アップデートトラッキング — 優先度 High

- **Evidence（repo）**: `scraper/` + `update.sh` + monthly-update スキルという**鮮度維持の仕組みが既に存在**するが、対象が価格のみ。001 STATE-02/05 のとおり読者向けの鮮度・更新情報の表示がない。「adjacent possible」（既存アーキテクチャが安価にする拡張）の典型
- **既存カテゴリとの関係**: 新規ページ群ではなく**プラットフォーム機能**（What's New / モデル一覧の鮮度表示）として 003 で扱う
- **Confidence**: HIGH ／ **想定規模**: 003 の Phase 1 参照

### [GAP-05] 評価・ベンチマーク / オブザーバビリティ — 優先度 Mid

- **Evidence（repo）**: ベンチマーク言及 7 ページ、オブザーバビリティ言及 1 ページ。主題ページ 0
- **Evidence（外部）**: §2 — evals 導入 52% vs 観測 89% のギャップ = 学習需要
- **Confidence**: MED（外部需要は明確だが、本サイト読者層との適合は要観察）／ **想定ページ数**: 1〜2

### [GAP-06] AI CI/CD 自動化 — 優先度 Mid

- **Evidence（repo）**: このリポジトリ自体が SonarQube CI・auto-fix ワークフロー・Git フックを運用しており（`.github/workflows/`、`.githooks/`）、「自分で実践しているのに解説がない」状態。code-review カテゴリの自然な拡張
- **Confidence**: MED ／ **想定ページ数**: 1〜2（AI × GitHub Actions、自動修正パイプライン）

### [GAP-07] ローカル LLM / セルフホスティング — 優先度 Low〜Mid

- **Evidence（repo）**: Ollama 言及 **0 ページ**。`claude/self-hosted-sandboxes` が隣接するが、モデル自体のセルフホストは完全に空白
- **Confidence**: LOW（本サイトの主軸＝クラウドエージェント＋コスト計算との整合を要検討。コスト比較の切り口なら電卓と相性が良い）／ **想定ページ数**: 1

### [GAP-08] RAG・埋め込み — 優先度 Low

- **Evidence（repo）**: 言及 3 ページのみ。コーディングエージェント文脈では MCP・コンテキストエンジニアリング（GAP-01/02）に吸収されつつあるのが 2026 年の実態
- **Confidence**: LOW ／ **判断**: 独立カテゴリにせず、GAP-02 の中の 1 セクションで扱うことを推奨

### [GAP-09] マルチモーダル / 画像・音声生成 — 採否判断: スコープ外を推奨

- **Evidence（repo）**: 言及ほぼなし。本サイトの一貫した主題は「AI **駆動開発**」であり、生成メディアはペルソナが異なる
- **判断**: 追加しない（rejected として記録）。追加するとナビとメンテナンス（monthly-update）の負担が読者価値に見合わない

## 4. 推奨カテゴリ体系（003 への入力）

ギャップ分析の結論として、トピック軸カテゴリを次の形で拡張することを推奨:

```text
既存トピック軸:  Code Review / Agent / Sandbox / IDE / Git Worktree
追加（High）:    MCP / Context Engineering / AI Security
機能として追加:  Updates（What's New + 鮮度表示 — GAP-04）
追加（Mid、需要確認後）: Evals & Observability / AI CI/CD
不採用:          マルチモーダル（GAP-09）、RAG 単独カテゴリ（GAP-08）
```

プロバイダー軸（Claude/Google/Codex/Copilot）は入口として維持しつつ、新規コンテンツは
原則トピック軸に配置する。この二軸構成の詳細設計は [003](003-platform-expansion-roadmap.md) で行う。
