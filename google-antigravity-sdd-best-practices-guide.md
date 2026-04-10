# Google Antigravity — AI仕様駆動開発 ベストプラクティス完全ガイド

> **対象読者**: 初学者〜中級者  
> **バージョン**: Google Antigravity v1.20.3 / Gemini CLI v0.34.0  
> **最終更新**: 2026年4月9日  
> **前回資料からの差分**: 本ドキュメントは 2026-03-22 作成の HTML ガイドをベースに、AP2・A2UI・AG-UI プロトコル追加（2026-03-18）、ADK Python 2.0 Alpha 公開、ADK TypeScript GA 等の最新アップデートを反映した改訂版です。

---

## 目次

1. [Google Antigravity とは](#1-google-antigravity-とは)
2. [前回資料からの主な更新点](#2-前回資料からの主な更新点)
3. [推奨ディレクトリ構成](#3-推奨ディレクトリ構成)
4. [Step 1 — GEMINI.md を書く](#4-step-1--geminimd-を書く)
5. [Step 2 — SKILL.md を書く（最重要）](#5-step-2--skillmd-を書く最重要)
6. [Step 3 — Rules で制約を定義する](#6-step-3--rules-で制約を定義する)
7. [Step 4 — Workflows で繰り返し作業を自動化する](#7-step-4--workflows-で繰り返し作業を自動化する)
8. [Step 5 — Artifacts を活用する](#8-step-5--artifacts-を活用する)
9. [Step 6 — マルチエージェント設計（A2A / AP2 / A2UI）](#9-step-6--マルチエージェント設計a2a--ap2--a2ui)
10. [Step 7 — ADK TypeScript / Python 2.0 Alpha の活用](#10-step-7--adk-typescript--python-20-alpha-の活用)
11. [対応モデルと料金](#11-対応モデルと料金)
12. [横断ベストプラクティス 12則](#12-横断ベストプラクティス-12則)
13. [運用前チェックリスト](#13-運用前チェックリスト)
14. [参考ソース一覧](#14-参考ソース一覧)

---

## 1. Google Antigravity とは

Google Antigravity は **2025年11月18日に Gemini 3 と同時発表** されたエージェントファースト型 IDE です。  
Visual Studio Code のフォークをベースに構築されており、「AI エージェントが主役、人間がアーキテクトとして指揮する」という新しいパラダイムを実現しています。

### 従来 IDE との根本的な違い

| 観点 | 従来の IDE | Google Antigravity |
|------|-----------|-------------------|
| 主役 | 人間がコードを書く | AI エージェントが自律実行 |
| AI の役割 | 補完・提案のみ | 計画・実行・検証まで担う |
| 証拠 | なし | Artifacts で可視化 |
| 記憶 | セッション内のみ | Knowledge Base に永続蓄積 |
| ナレッジ | 都度プロンプトに書く | SKILL.md でオンデマンド展開 |

### Antigravity vs Claude Code — 比較表

| 特性 | Google Antigravity | Claude Code |
|------|-------------------|-------------|
| 種別 | Agent-First IDE（VSCode fork） | CLI / ターミナルエージェント |
| 主要 AI | Gemini 3.1 Pro / 3 Flash + Claude Sonnet 4.6 / Opus 4.6 / GPT-OSS 120B | Claude Opus / Sonnet / Haiku |
| 永続記憶 | GEMINI.md + Knowledge Base + Rules | CLAUDE.md + MEMORY.md |
| ナレッジ拡張 | SKILL.md（進歩的開示） | SKILL.md（同一規格） |
| 手順自動化 | Workflows (.md) | Custom Commands (.md) |
| ブラウザ自動化 | Browser Subagent（ネイティブ） | なし（MCP 経由） |
| エビデンス生成 | Artifacts（自動） | なし（手動） |
| 新プロトコル | AP2 / A2UI / AG-UI（2026-03-18〜） | — |
| 価格 | 無料（Public Preview 中） / Pro $19.99/月 | Anthropic プランに依存 |

> **SKILL.md は共通規格**。Antigravity と Claude Code は同一の SKILL.md 形式を採用しており、ファイルを両プラットフォーム間でほぼそのまま移植できます。  
> v1.20.3（2026-03-05）以降は **AGENTS.md にも対応**し、Cursor・Codex 等との共有が可能になりました。

---

## 2. 前回資料からの主な更新点

2026-03-22 の HTML ガイド作成以降、以下の重要な変更・追加がありました。

### 2-1. AP2 / A2UI / AG-UI プロトコル（2026-03-18 発表）

3 つの新プロトコルが追加されました。

| プロトコル | 役割 | 利用場面 |
|-----------|------|---------|
| **AP2** | エージェント間の決済・認証フロー標準化 | 購入フロー・サブスク決済をエージェントが自律処理 |
| **A2UI** | エージェント → UI コンポーネント生成 | React 等フロントエンドとのストリーミング連携 |
| **AG-UI** | A2UI のストリーミング UI プロトコル | リアルタイムで UI を動的更新 |

```python
# ADK での AgentUITransport 統合例（A2UI）
from google.adk.transport import AgentUITransport

transport = AgentUITransport()
# フロントエンドへ UI イベントをストリーミング配信
await transport.send_ui_event({"type": "button", "label": "確認", "action": "confirm"})
```

> **参考**: [Google Developers Blog — New Agent Protocols: AP2, A2UI, AG-UI (2026-03-18)](https://developers.googleblog.com/en/new-agent-protocols-ap2-a2ui-ag-ui/)

### 2-2. ADK TypeScript 1.0 GA（2026-03 時点）

Python に加えて **TypeScript / JavaScript でも ADK が正式対応**。`@google/adk` パッケージで同等の機能が利用可能になりました。

```bash
npm install @google/adk
```

```typescript
import { LlmAgent, SequentialAgent } from '@google/adk';

const reviewAgent = new LlmAgent({
  name: 'code-reviewer',
  model: 'gemini-3-flash-preview',
  description: 'コードレビューを行う専門エージェント',
  instruction: '...',
});
```

> **参考**: [ADK TypeScript GitHub](https://github.com/google/adk-typescript)

### 2-3. ADK Python 2.0 Alpha — グラフベースワークフロー

ADK Python 2.0 Alpha では **GraphAgent API** が追加され、DAG（有向非巡回グラフ）形式でエージェントフローを宣言的に記述できるようになりました。

```python
from google.adk.agents.graph import GraphAgent, GraphNode

graph = GraphAgent(
    name='ci-pipeline',
    nodes=[
        GraphNode(name='lint',   agent=lint_agent),
        GraphNode(name='test',   agent=test_agent,   depends_on=['lint']),
        GraphNode(name='build',  agent=build_agent,  depends_on=['test']),
        GraphNode(name='deploy', agent=deploy_agent, depends_on=['build']),
    ]
)
```

> ⚠️ **2.0 Alpha は本番環境での使用は非推奨**。安定版の ADK Python 1.x を本番に使うこと。

> **参考**: [ADK Graph Workflow 公式ドキュメント](https://google.github.io/adk-docs/agents/workflow-agents/graph/)

### 2-4. Gemini CLI v0.34.0（2026-03-18）の変更点まとめ

| バージョン | 主な変更 |
|----------|---------|
| v0.26.0 | `skill-creator` メタスキル標準搭載、ジェネラリストエージェント追加 |
| v0.27.0 | `/rewind` コマンド追加（セッション履歴のロールバック） |
| v0.29.0 | `/plan`（Plan Mode）追加、`gemini-3-flash-preview` がデフォルトモデルに |
| v0.30.0 | `@google/gemini-cli-sdk` 公開 |
| v0.31.0 | `gemini-3.1-pro-preview` サポート追加（段階的ロールアウト） |
| v0.33.0 | `/plan` にリサーチサブエージェント・アノテーション機能を統合 |
| v0.34.0 | Plan Mode デフォルト有効化、サンドボックス化・セキュリティ強化 |

### 2-5. Antigravity v1.20.3（2026-03-05）の変更点

- **AGENTS.md サポート正式追加** — Claude Code / Codex / Cursor 等と共通ルールを共有可能
- トークン計算バグ修正
- **Auto-continue のデフォルト有効化**

---

## 3. 推奨ディレクトリ構成

```
your-project/
├── .agent/                           ← Antigravity ワークスペース設定（最重要）
│   ├── rules/
│   │   ├── always-on.md             ← activation: always（常時適用）
│   │   └── typescript.md            ← activation: fileMatch *.ts（条件適用）
│   ├── skills/
│   │   └── db-migration/
│   │       ├── SKILL.md             ← 必須: スキルの脳
│   │       ├── scripts/             ← 任意: 決定論的スクリプト
│   │       └── references/          ← 任意: 参照ドキュメント
│   └── workflows/
│       ├── deploy.md                ← /deploy コマンド
│       └── review.md                ← /review コマンド
│
├── .context/                         ← Knowledge Base（自動学習・蓄積）
│   ├── architecture.md
│   └── gotchas.md                   ← 発見した落とし穴を記録
│
├── docs/                             ← SDD 仕様書群
│   ├── spec.md                      ← 何を・なぜ（プロダクト仕様）
│   ├── design.md                    ← 技術設計・アーキテクチャ判断
│   └── tasks.md                     ← タスク管理・依存関係・並列情報
│
├── GEMINI.md                         ← プロジェクト共通メモリ（常時ロード）
└── AGENTS.md                         ← クロスツール共有ルール（v1.20.3〜）
```

### ファイルの色分けガイド

| 色 | 種別 | 説明 |
|----|-----|------|
| 🔵 青 | ディレクトリ | 構造的なフォルダ |
| 🟢 緑 | 必須ファイル | SKILL.md・GEMINI.md |
| 🔴 赤 | Rules ファイル | 禁止事項・制約 |
| 🟡 黄 | Workflows ファイル | /slash コマンド |
| 🩵 シアン | Knowledge Base | 自動学習コンテキスト |
| ⚪ グレー | 任意ファイル | scripts・references |

---

## 4. Step 1 — GEMINI.md を書く

`GEMINI.md` は Antigravity の「プロジェクト指示書」です。すべてのエージェントセッションに自動注入されます。

### 配置場所と優先度

| ファイル | スコープ | 優先度 |
|---------|---------|-------|
| `~/.gemini/GEMINI.md` | グローバル（全プロジェクト共通） | 低 |
| `./GEMINI.md` | プロジェクトルート | 中 |
| `src/GEMINI.md` | サブディレクトリ（Auto-scan） | 高 |
| `AGENTS.md` | クロスツール共有（v1.20.3〜） | 中〜高 |

### ✅ ベストプラクティス例

```markdown
# PROJECT: my-saas-app

## プロジェクト概要（2〜4文で）
Next.js 15 + Supabase のマルチテナント SaaS。
本番: Vercel / DB: PostgreSQL (pgvector付き)

## 技術スタック
- Frontend: Next.js 15 App Router, TypeScript
- Backend: Supabase Edge Functions
- Auth: Supabase Auth + Row Level Security
- AI: Gemini 3.1 Pro (via ADK), pgvector for embeddings

## ビルド・テストコマンド
- ビルド: `pnpm build`
- テスト: `pnpm test`
- Lint: `pnpm lint`
- ADK dev: `adk web`（Agent Dev UI on :8000）

## ⚠️ 禁止操作（絶対厳守）
- `supabase db reset` は絶対に実行しない（本番データ消去）
- `.env.production` の読み書き禁止
- `--force` フラグは使わない

## エージェント委譲ルール
- タスクが 3 件以上かつ独立している → 並列実行
- タスクに依存関係がある → 順次実行
- 不確実な場合は実装前に確認すること

## @import（モジュール分割）
@./docs/architecture.md
@./docs/api-conventions.md
```

### ❌ アンチパターン

```markdown
# My Project

# ❌ コードスニペットを大量に貼り付ける（トークン浪費）
function myUtil() { ...300行のコード... }

# ❌ APIキーを直接記載
SUPABASE_KEY=eyJhbGci...

# ❌ 変更履歴を蓄積（Git で管理すること）
2026-01-15: ○○を修正した

# ❌ プロジェクト固有情報をグローバル GEMINI.md に書く
本番DBのIP: 192.168.1.100
```

> **ポイント**: GEMINI.md は「薄く・分割して」が鉄則。`@./docs/guide.md` のように `@import` でファイルを分割参照し、1 ファイルに全部詰め込まないことがコンテキスト節約の鍵。

---

## 5. Step 2 — SKILL.md を書く（最重要）

SKILL.md は Antigravity 最大の特徴である **Progressive Disclosure（段階的開示）** を実現するナレッジファイルです。

### Progressive Disclosure の 3 段階

```
Level 1 — 常時常駐（~100 tokens/スキル）
  └── name + description のみ常駐
      └── セッション開始時に全スキルのメタデータをロード

Level 2 — オンデマンド（5,000 tokens 以内推奨）
  └── 意図が合致したとき SKILL.md 本文を展開
      └── activate_skill ツールが呼ばれて初めてロード

Level 3 — 動的参照（実質無制限）
  └── references/ のドキュメントを動的読み取り
  └── scripts/ のスクリプトは「実行結果のみ」がコンテキストに入る
```

### SKILL.md の完全テンプレート

```yaml
---
name: db-migration           # ← ハイフン区切り英語小文字・ディレクトリ名と一致させる

description: |               # ← 【最重要】AIのトリガー条件
  PostgreSQLのスキーマ変更（マイグレーション）を実行する。
  「テーブルを追加」「カラムを追加」「インデックスを作成」
  「DBのスキーマを変更して」という指示が出たら必ずこのスキルを使うこと。
---

# DB Migration Skill

## Goal（このスキルの目的）
PostgreSQL スキーマ変更をプロジェクト標準の手順で安全に実行する。

## Before Starting（前提条件）
- 変更対象のテーブル名・カラム名・データ型をユーザーから確認すること

## Step-by-Step Guide（具体的な手順）
1. `migrations/` 配下に `YYYYMMDD_HHMMSS_description.up.sql` を作成
2. ロールバック用 `.down.sql` を必ず同時に作成
3. 整合性チェックを実行: `python scripts/check.py`
4. レビュー後に適用: `python scripts/migrate.py --apply`
5. 完了後に tasks.md の該当タスクをチェック済みにする

## Examples（Few-shot：具体的な入出力例）
**Input**: "usersテーブルにlast_login_atカラムを追加して"
**Output**: migrations/20260101_add_last_login_at.up.sql を生成

## Rules（制約事項）
❌ 既存マイグレーションファイルを絶対に編集しない
❌ 本番環境への直接適用は人間確認なしに禁止
✅ ロールバックファイルは必ずセットで作成する
✅ NULL 制約の後付けはデータ移行計画なしに行わない
```

### description の書き方 — 良い例 vs 悪い例

```yaml
# ❌ アンダートリガー（呼ばれない）
description: セキュリティ監査を行うスキル。

# ✅ 正しいトリガー設計
description: |
  コードのセキュリティ監査を実施する。
  脆弱性チェック、OWASP Top 10 の検証、
  セキュリティ、認証、XSS、SQLi、
  という言葉が出たら必ず使うこと。
```

### 5 つのスキルパターン

| パターン | 構成 | 適した用途 |
|---------|------|-----------|
| **01 Basic Router** | SKILL.md のみ | シンプルな指示・フォーマット変換 |
| **02 Reference Pattern** | SKILL.md + references/ | API 仕様書・ドキュメント参照が必要なタスク |
| **03 Few-shot Pattern** | SKILL.md + examples/ | 入出力例が豊富にある繰り返しタスク |
| **04 Tool Use Pattern** | SKILL.md + scripts/ | バリデーション・自動化・DB 操作 |
| **05 All-in-One Pattern** | SKILL.md + all dirs | 複雑な業務ロジック・チーム全体での知識共有 |

### スキルのスコープ設計

| スコープ | パス | 向いているスキル例 |
|---------|-----|-----------------|
| **グローバル** | `~/.gemini/antigravity/skills/` | Gitコミット規約・コードレビュー標準・JSON整形 |
| **ワークスペース** | `.agent/skills/` | デプロイ手順・プロジェクト固有API仕様・内部DBマイグレーション |

> **参考**: [Authoring Google Antigravity Skills — Google Codelabs](https://codelabs.developers.google.com/getting-started-with-antigravity-skills)

---

## 6. Step 3 — Rules で制約を定義する

Rules は「常にバックグラウンドで動作するシステムプロンプト」です。

### Rules vs SKILL.md — 使い分け表

| 観点 | Rules | SKILL.md |
|------|-------|---------|
| 起動タイミング | 常時 or 条件一致 | 意図が合致したときのみ |
| コンテキスト消費 | 高（毎回注入） | 低（オンデマンド） |
| 用途 | 「〜してはいけない」ルール | 「〜する方法」の手順 |
| 書くべき内容 | 禁止事項・コーディング規約 | 専門ワークフロー・知識 |

### always-on.md — 常時適用ルール

```yaml
---
activation: always
---

# Project Core Rules

## Architecture
- このプロジェクトはマイクロサービス構成（Go + gRPC）
- サービス間通信は gRPC のみ（REST 禁止）

## Forbidden Actions
- ORM 使用禁止（raw SQL のみ）← なぜ: パフォーマンス測定で 20x 遅延を確認した
- グローバル変数の新規追加禁止
- panic() の使用禁止（エラーを返せ）
```

### typescript.md — 言語別ルール（fileMatch 使用）

```yaml
---
activation: fileMatch
pattern: "**/*.ts"    # ← TypeScript ファイル編集時のみ適用
---

# TypeScript Coding Standards

- strict: true を必ず有効にする
- enum / namespace は使用禁止（erasableSyntaxOnly）
- エラーは throw ではなく Result<T,E> 型で返す
```

> **ベストプラクティス**: `activation: fileMatch` を活用して言語別ルールを分離。全言語に共通ルールを書かないことでコンテキスト節約になります。

---

## 7. Step 4 — Workflows で繰り返し作業を自動化する

Workflows は Rules の「受動的制約」とは対照的な「能動的手順書」です。チャットで `/workflow-name` と入力するだけで起動します。

### deploy.md — /deploy コマンド

```markdown
# Deploy Workflow
# トリガー: `/deploy staging` と入力するとエージェントがこの手順を実行

## 引数
- `$ENV`: ターゲット環境 (staging | production)

## 手順
1. `git status` でコミット漏れがないことを確認する
2. テストを全件実行: `go test ./... -race`
3. テストが失敗した場合は即座に停止してユーザーに報告する
4. Docker イメージをビルド: `docker build -t app:$(git rev-parse --short HEAD) .`
5. $ENV 環境にデプロイ:
   - staging: `kubectl apply -f k8s/staging.yaml`
   - production: **ユーザーに確認を求めてから実行すること**
6. ヘルスチェック: `curl https://$ENV.myapp.com/health`
7. Artifacts（デプロイサマリー）を生成してユーザーに提示する
```

### review.md — /review コマンド

```markdown
# Code Review Workflow

## 手順
1. `git diff main` で変更差分を取得する
2. 以下の観点でコードレビューを実施:
   - セキュリティ: SQLインジェクション・XSS・認証漏れ
   - パフォーマンス: N+1クエリ・不要なアロケーション
   - 設計: SRP の遵守・依存方向
   - テスト: エッジケースのカバレッジ
3. 問題があれば重大度 (P0/P1/P2) 付きでリストアップ
4. `docs/tasks.md` に未対応課題として追記する
5. Implementation Artifact としてレビュー結果を出力
```

> **チェーン化**: ワークフロー内から別のワークフローを呼び出せます。例えば "Ship Feature" ワークフローの中で `/review` を呼び出し、通過したら `/deploy staging` を実行する構成が可能です。

> **参考**: [Advanced Tips for Mastering Google Antigravity — Amulya Bhatia (Jan 2026)](https://iamulya.one/posts/advanced-tips-for-mastering-google-antigravity/)

---

## 8. Step 5 — Artifacts を活用する

Artifacts はエージェントが自律作業する際の「信頼の証拠」として機能します。

| Artifact 種別 | 内容 | 生成タイミング |
|-------------|------|-------------|
| **Task List** | 構造化された実行計画（Research → Implementation → Verification） | コーディング開始前 |
| **Implementation Plan** | どのファイルをなぜ変更するかの技術設計書 | 実装前のレビューゲート |
| **Walkthrough** | 変更ファイル一覧・設計判断の理由・テスト結果 | 実装完了後 |
| **Screenshots** | Browser Subagent が撮影した UI 証拠 | フロントエンド変更後 |
| **Browser Recordings** | E2E フロー操作のビデオ録画 | 検証完了後 |

> ⚠️ **SDD 最重要原則**: Task List や Implementation Plan は「なんとなく承認」しないこと。ここが最重要レビューポイントです。「コードは後で直せる。設計の誤りは高くつく」

> **参考**: [How Google Antigravity is changing spec-driven development — Google Cloud Medium](https://medium.com/google-cloud/benefits-and-challenges-of-spec-driven-development-and-how-antigravity-is-changing-the-game-3343a6942330)

---

## 9. Step 6 — マルチエージェント設計（A2A / AP2 / A2UI）

### 9-1. ローカル サブエージェント vs リモート A2A

| 比較項目 | ローカルサブエージェント | リモート A2A |
|---------|------------------|------------|
| 実行環境 | 同一プロセス内 | 異なるサービス・マシン |
| セッション | 親と共有 | 独立したコンテキスト |
| 定義方法 | `sub_agents` パラメータ | `RemoteA2aAgent` + Agent Card URL |
| 通信 | 直接呼び出し | HTTPS + JSON-RPC 2.0 |
| 適用場面 | 同一サービス内・低レイテンシ | クロスチーム・ベンダー横断 |

### 9-2. SequentialAgent / ParallelAgent / LoopAgent 使い分け

```
タスクが 3 件以上？
  └── YES → 依存関係あり？
             └── YES → SequentialAgent（順次実行）
             └── NO  → 繰り返し精緻化が必要？
                        └── YES → LoopAgent（条件達成まで反復）
                        └── NO  → ParallelAgent（並列実行）
```

### 9-3. agent.py — Orchestrator 実装例

```python
from google.adk.agents import LlmAgent, SequentialAgent
from google.adk.agents.remote_a2a_agent import RemoteA2aAgent

# リモートエージェント（A2A 経由）
code_review_remote = RemoteA2aAgent(
    name='code-review-agent',
    description="""
    コードレビューを実施するリモート専門エージェント。
    【呼び出す場合】: PR 作成前のセキュリティ・品質チェック
    【呼び出さない場合】: コードの実装・修正
    """,
    agent_card_url='https://review.internal.example.com/.well-known/agent.json',
)

# ローカルサブエージェント
spec_writer = LlmAgent(
    name='spec-writer',
    model='gemini-2.5-flash',   # コスト最適化
    description='新機能の仕様書を docs/specs/ に作成する。',
    instruction='...',
    output_key='spec_document',  # ← 一意なキーを必ず設定
)

# Orchestrator（Sequential: 仕様 → 実装 → レビュー）
root_agent = SequentialAgent(
    name='dev-orchestrator',
    sub_agents=[spec_writer, code_review_remote],
)
```

> ⚠️ **ParallelAgent の罠**: 複数エージェントが同じ `output_key` に書き込むとレースコンディションが発生します。各エージェントには必ず一意な `output_key` を設定してください。

### 9-4. agent.json — Agent Card のベストプラクティス

```json
{
  "name": "code-review-agent",
  "version": "2.1.0",
  "description": "コードレビューを実施する専門エージェント。\n【呼び出す場合】: PR 作成前のセキュリティ・品質チェック\n【呼び出さない場合】: コードの実装・修正",
  "url": "https://code-review.internal.example.com",
  "skills": [
    {
      "id": "security-review",
      "name": "Security Review",
      "description": "SQLインジェクション・XSS・SSRF・認証バイパスを自動検出する",
      "tags": ["security", "vulnerability", "owasp"]
    }
  ],
  "securitySchemes": {
    "bearerAuth": {
      "type": "http",
      "scheme": "bearer",
      "bearerFormat": "JWT"
    }
  },
  "security": [{ "bearerAuth": [] }]
}
```

> **Agent Card の最重要フィールドは `description`**。Orchestrator はここだけを見てルーティングを決定します。「いつ使う・いつ使わない」を両方明記してください。

### 9-5. 新プロトコル AP2 / A2UI の活用（2026-03-18〜）

**AP2 — 決済・認証フロープロトコル**

```python
# 決済フローをエージェントが自律処理する例
from google.adk.protocols.ap2 import PaymentAuthFlow

payment_flow = PaymentAuthFlow(
    provider='stripe',
    amount=1000,
    currency='jpy',
)
result = await payment_flow.execute()
```

**A2UI / AG-UI — UI ストリーミング生成**

```python
from google.adk.transport import AgentUITransport

transport = AgentUITransport()
# React コンポーネントをリアルタイムで生成・更新
await transport.stream_component({
    "type": "form",
    "fields": [{"name": "email", "type": "email"}]
})
```

> **参考**: [Google Developers Blog — New Agent Protocols (2026-03-18)](https://developers.googleblog.com/en/new-agent-protocols-ap2-a2ui-ag-ui/)

---

## 10. Step 7 — ADK TypeScript / Python 2.0 Alpha の活用

### 10-1. ADK TypeScript — フロントエンド開発者向け

TypeScript/JavaScript プロジェクトで ADK が GA になったことで、フロントエンド開発者もエージェントを直接組み込めるようになりました。

```typescript
import { LlmAgent, SequentialAgent, ParallelAgent } from '@google/adk';

// フロントエンド専用エージェント
const uiAgent = new LlmAgent({
  name: 'ui-component-generator',
  model: 'gemini-3-flash-preview',
  description: `
    React コンポーネントを生成する。
    「コンポーネントを作って」「UI を実装して」という言葉が出たら使うこと。
  `,
  instruction: `
    TypeScript strict モードで React コンポーネントを生成する。
    shadcn/ui コンポーネントを優先して使用すること。
    アクセシビリティ属性（aria-*）を必ず付与すること。
  `,
  outputKey: 'ui_component',
});

// SKILL.md と同じ考え方で instruction を設計する
const orchestrator = new SequentialAgent({
  name: 'frontend-orchestrator',
  subAgents: [uiAgent],
});
```

### 10-2. ADK Python 2.0 Alpha — GraphAgent

```python
from google.adk.agents.graph import GraphAgent, GraphNode, ConditionalEdge

# CI/CD パイプラインを DAG で表現
pipeline = GraphAgent(
    name='ci-pipeline',
    nodes=[
        GraphNode(name='lint',     agent=lint_agent),
        GraphNode(name='test',     agent=test_agent,   depends_on=['lint']),
        GraphNode(name='build',    agent=build_agent,  depends_on=['test']),
        GraphNode(name='security', agent=sec_agent,    depends_on=['build']),
        GraphNode(name='deploy',   agent=deploy_agent, depends_on=['security'],
                  condition=lambda ctx: ctx.get('env') == 'staging'),
    ]
)
```

> ⚠️ **GraphAgent は Alpha 版**。条件分岐 API は変更される可能性があります。本番環境には SequentialAgent / ParallelAgent を使ってください。

> **参考**: [ADK Python 2.0 Alpha — Graph Workflow](https://google.github.io/adk-docs/agents/workflow-agents/graph/)

---

## 11. 対応モデルと料金

### 現行モデル一覧（2026年4月時点）

| モデル ID | 推奨用途 | ステータス |
|----------|---------|---------|
| `gemini-3-flash-preview` | 実装・レビュー・日常タスク・オーケストレーター | ✅ デフォルト推奨 |
| `gemini-3.1-pro-preview` | アーキテクチャ設計・セキュリティ監査（ARC-AGI-2: 77.1%） | ⭐ 新世代最高精度 |
| `gemini-2.5-flash` | 安定運用・コスパ重視 | ✅ 安定版 |
| `gemini-2.0-flash` | （廃止予定） | ⚠️ 2026-06-01 廃止予定 |
| `claude-sonnet-4-6` | Anthropic モデル | Antigravity 対応 |
| `claude-opus-4-6` | Anthropic 最高精度 | Antigravity 対応 |
| `gpt-oss-120b` | OpenAI モデル | Antigravity 対応 |

### コスト最適化のモデル選択戦略

```python
# ❌ 全エージェントに最高精度モデルを使う（コスト爆発）
all_agents_pro = LlmAgent(model='gemini-3.1-pro-preview', ...)

# ✅ 役割に応じてモデルを使い分ける
orchestrator = LlmAgent(model='gemini-3-flash-preview', ...)  # 軽量でルーティング
implementer  = LlmAgent(model='gemini-3-flash-preview', ...)  # 実装はバランス型
architect    = LlmAgent(model='gemini-3.1-pro-preview', ...)  # 設計だけ高精度モデル
```

### プラン・料金

| プラン | 料金 | 特徴 |
|-------|-----|------|
| Free | $0 | Public Preview 中。利用可（待機あり） |
| Google AI Pro | $19.99/月 | 優先アクセス枠・レートリミット緩和 |
| Google AI Ultra | $250/月 | 最優先アクセス・Gemini 3.1 Pro 利用可 |

> ※ 2026年4月現在、Pro 加入者でも最大7日間のレートリミットロックが報告されています

> **廃止スケジュール参考**: [Gemini API Deprecations](https://ai.google.dev/gemini-api/docs/deprecations)

---

## 12. 横断ベストプラクティス 12則

前回の 10 則に A2A / AP2 関連の 2 則を追加しました。

### 01. description が SKILL.md の命
「何を・いつ・なぜ」を具体的なキーワードで書く。曖昧な description はスキルが呼ばれない最大の原因。

### 02. Rules ≠ SKILL.md — 用途を厳守
「常に守るルール」は Rules、「特定タスクの知識」は SKILL.md。混在するとコンテキスト汚染が発生する。

### 03. Artifact レビューを省略しない
Task List と Implementation Plan は必ずレビュー。ここで設計ミスを検出することがバグコスト最小化の鍵。

### 04. fileMatch で言語別ルールを分離
`activation: fileMatch` を使い、言語別にルールを切り替え。全言語に共通ルールを書かない。

### 05. スキルは 10〜15 個以内に絞る
アクティブなスキルが増えすぎると AI が混乱し精度が低下する。使わないスキルは `/skills disable` で無効化。

### 06. .context/ でナレッジを蓄積する
Known Gotchas を Knowledge Base に記録。エージェントが同じ過ちを繰り返さず、ドキュメントが自動進化する。

### 07. Workflows で繰り返し作業を撲滅
毎回同じ手順を口頭で指示するものは Workflow に書く。`/deploy`・`/review`・`/release-notes` を整備する。

### 08. GEMINI.md は「薄く・分割して」
`@./docs/guide.md` のように `@import` でファイルを分割参照。1 ファイルに全部詰め込まないことがコンテキスト節約の鍵。

### 09. Rules には「Why（なぜ禁止か）」を書く
「ORM 禁止」だけでなく「なぜ禁止か（20x 遅延を確認）」を書くとエージェントの判断精度が向上する。

### 10. tasks.md に並列情報を明示する
「Agent A 担当」「Agent B 担当（並列可）」を記述することで Agent Manager が最適にタスクを分配できる。

### 11. 【NEW】ParallelAgent では output_key を必ず一意に設定する
同じキーへの複数エージェント書き込みはレースコンディションを引き起こす最大の地雷。必ず一意なキーを割り当てる。

### 12. 【NEW】Agent Card の description に「いつ使わないか」も明記する
A2A のルーティング精度は Agent Card の description で決まる。「呼び出す場合」と「呼び出さない場合」の両方を記述することで誤ルーティングを防ぐ。

---

## 13. 運用前チェックリスト

### SKILL.md チェックリスト

- [ ] `name` はハイフン区切りの英語小文字か（64文字以内）
- [ ] `name` とディレクトリ名が完全一致しているか
- [ ] `description` に具体的なトリガーキーワードが含まれているか
- [ ] SKILL.md 本文は 500 行以内か（参照資料は `references/` に分離済みか）
- [ ] スクリプトはハードコードされた値ではなく引数で動作変更できるか
- [ ] 危険な操作のスキルに `disable-model-invocation: true` が設定されているか
- [ ] Few-shot の Examples セクションが含まれているか
- [ ] Rules セクションで ❌ 禁止事項と ✅ 推奨行動が明確に定義されているか
- [ ] アクティブなスキルの合計数が 15 個以内に収まっているか
- [ ] `gemini skills list` でスキルが認識されているか確認したか
- [ ] `/plan`（Plan Mode）でスキルが安全に動作することを確認したか（v0.29.0〜）
- [ ] `skill-creator` メタスキルで品質チェックを受けたか（v0.26.0〜）

### Agent Card（A2A）チェックリスト

- [ ] `description` に「いつ使う・いつ使わない」が両方記述されているか
- [ ] `skills` フィールドで機能が細かく定義されているか（タグ・examples 付き）
- [ ] `securitySchemes` が設定されているか（認証なし公開は危険）
- [ ] `version` を semantic versioning で管理しているか
- [ ] Agent Card URL（`/.well-known/agent.json`）でアクセスできるか確認したか
- [ ] `description` と `agent.py` の `instruction` が乖離していないか

### マルチエージェント設計チェックリスト

- [ ] ParallelAgent の各サブエージェントに一意な `output_key` が設定されているか
- [ ] LoopAgent に `max_iterations` または終了条件が設定されているか
- [ ] ファイル所有権（どのエージェントがどのパスを書き込めるか）が定義されているか
- [ ] A2A タイムアウト・フォールバック戦略が GEMINI.md に記載されているか
- [ ] リモートエンドポイント URL が `docs/agent-endpoints.md` に一元管理されているか

---

## 14. 参考ソース一覧

| # | ソース | URL |
|---|-------|-----|
| 1 | Google Developers Blog — Antigravity 公式発表 (Nov 2025) | https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/ |
| 2 | Google Cloud Medium — SDD × Antigravity (Jan 2026) | https://medium.com/google-cloud/benefits-and-challenges-of-spec-driven-development-and-how-antigravity-is-changing-the-game-3343a6942330 |
| 3 | Google Codelabs — Getting Started with Antigravity | https://codelabs.developers.google.com/getting-started-google-antigravity |
| 4 | Google Codelabs — Authoring Antigravity Skills | https://codelabs.developers.google.com/getting-started-with-antigravity-skills |
| 5 | Google Cloud Medium — Skills Tutorial (Jan 2026) | https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d |
| 6 | Advanced Tips — Amulya Bhatia (Jan 2026) | https://iamulya.one/posts/advanced-tips-for-mastering-google-antigravity/ |
| 7 | antigravity-awesome-skills — GitHub | https://github.com/sickn33/antigravity-awesome-skills |
| 8 | Gemini 3.1 Pro — Google Blog (Feb 2026) | https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/ |
| 9 | Gemini API Deprecations | https://ai.google.dev/gemini-api/docs/deprecations |
| 10 | AI Tool Analysis — Antigravity Review v1.20.3 (Mar 2026) | https://aitoolanalysis.com/google-antigravity-review/ |
| 11 | **【NEW】** Google Developers Blog — AP2 / A2UI / AG-UI (Mar 2026) | https://developers.googleblog.com/en/new-agent-protocols-ap2-a2ui-ag-ui/ |
| 12 | **【NEW】** ADK TypeScript GitHub — GA | https://github.com/google/adk-typescript |
| 13 | **【NEW】** ADK Python 2.0 Alpha — Graph Workflow | https://google.github.io/adk-docs/agents/workflow-agents/graph/ |
| 14 | **【NEW】** ADK 公式 — A2A Protocol 入門 | https://google.github.io/adk-docs/a2a/intro/ |
| 15 | **【NEW】** ADK 公式 — A2A Quickstart (Exposing) | https://google.github.io/adk-docs/a2a/quickstart-exposing/ |
| 16 | **【NEW】** Google Blog — A2A Protocol 発表 | https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/ |
| 17 | **【NEW】** Google Codelabs — A2A Purchasing Concierge | https://codelabs.developers.google.com/intro-a2a-purchasing-concierge |
| 18 | Gemini CLI Changelog | https://geminicli.com/docs/changelogs/ |
| 19 | Gemini API Models — 現行モデル一覧 | https://ai.google.dev/gemini-api/docs/models |
| 20 | DEV Community — Skills + Hooks + Plan Mode | https://dev.to/googleai/unlocking-gemini-cli-with-skills-hooks-plan-mode-2bgf |

---

> **最終更新**: 2026年4月9日  
> **前回資料**: 2026-03-22 作成の HTML ガイドからの差分を網羅  
> **変更概要**: AP2 / A2UI / AG-UI プロトコル追加、ADK TypeScript GA、ADK Python 2.0 Alpha GraphAgent、ベストプラクティス 12 則（+2 則）、マルチエージェント設計チェックリスト追加
