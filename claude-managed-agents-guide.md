# Claude Managed Agents 完全ガイド

> **対象読者:** AIエージェント開発初学者  
> **最終更新:** 2026-05-30  
> **ベータヘッダー:** `managed-agents-2026-04-01`

---

## 目次

1. [Managed Agentsとは何か](#1-managed-agentsとは何か)
2. [Messages API との違い](#2-messages-api-との違い)
3. [4つのコアコンセプト](#3-4つのコアコンセプト)
4. [全体アーキテクチャ](#4-全体アーキテクチャ)
5. [Step-by-Step セットアップガイド](#5-step-by-step-セットアップガイド)
6. [組み込みツール一覧](#6-組み込みツール一覧)
7. [環境設定のベストプラクティス](#7-環境設定のベストプラクティス)
8. [セッション管理とイベントストリーム](#8-セッション管理とイベントストリーム)
9. [マルチエージェント設計パターン](#9-マルチエージェント設計パターン)
10. [Agent Skills の活用](#10-agent-skills-の活用)
11. [よくあるミスと対策](#11-よくあるミスと対策)
12. [参考ソース](#12-参考ソース)

---

## 1. Managed Agentsとは何か

Claude Managed Agentsは、Anthropicが提供する**フルマネージド型AIエージェント実行基盤**です。

開発者が自前でエージェントループ、ツール実行環境、ランタイムを構築する必要がなく、以下がすぐに使えます。

- ファイル読み書き
- bashコマンド実行
- Webブラウジング
- コード実行

ハーネスはビルトインのプロンプトキャッシング、コンテキスト圧縮（compaction）、その他のパフォーマンス最適化を内包しており、高品質で効率的なエージェント出力を実現します。

**向いているワークロード:**

| ユースケース | 説明 |
|---|---|
| 長時間実行タスク | 数分〜数時間かかる多ステップ処理 |
| クラウドインフラ活用 | 事前構成済みパッケージ・ネットワーク付きセキュアサンドボックス |
| セルフホスト実行 | コンプライアンス・データ居住要件への対応 |
| インフラ最小化 | エージェントループ・サンドボックス不要 |
| ステートフルセッション | 複数インタラクションにまたがる永続ファイルシステムと会話履歴 |

---

## 2. Messages API との違い

```mermaid
flowchart LR
    A[開発者] --> B{何を作りたいか?}
    B -->|細かい制御が必要| C[Messages API]
    B -->|長時間・自律タスク| D[Managed Agents]

    C --> C1[自前でエージェントループを実装]
    C --> C2[ツール実行を自分でハンドル]
    C --> C3[ランタイム管理が必要]

    D --> D1[エージェントループはAnthropicが管理]
    D --> D2[ツールはサンドボックス内で自動実行]
    D --> D3[インフラ不要ですぐ動く]

    style C fill:#1e293b,stroke:#64748b,color:#e2e8f0
    style D fill:#1e1b4b,stroke:#818cf8,color:#e2e8f0
```

| 比較項目 | Messages API | Claude Managed Agents |
|---|---|---|
| **概要** | モデルへの直接プロンプトアクセス | 事前構成済みエージェントハーネス（マネージドインフラ上で動作） |
| **向いている用途** | カスタムエージェントループ・細粒度制御 | 長時間タスク・非同期ワーク |
| **インフラ** | 自前構築が必要 | Anthropicが管理 |
| **ツール実行** | 開発者がハンドル | サンドボックス内で自動実行 |

---

## 3. 4つのコアコンセプト

```mermaid
flowchart LR
    A["Agent\n─────────────\nモデル設定\nシステムプロンプト\nツール / スキル"]
    B["Environment\n─────────────\nクラウドサンドボックス\nor セルフホスト\n実行インフラ"]
    C["Session\n─────────────\n実行中のエージェント\nインスタンス\n特定タスクを実行"]
    D["Events\n─────────────\nユーザーターン\nツール結果\nステータス更新"]

    A -->|使用する| B
    B -->|起動する| C
    C -->|やりとりする| D
    D -->|フィードバック| C

    style A fill:#1e1b4b,stroke:#818cf8,color:#e2e8f0
    style B fill:#052e16,stroke:#34d399,color:#d1fae5
    style C fill:#1c0a00,stroke:#fb923c,color:#fed7aa
    style D fill:#1a0533,stroke:#c084fc,color:#e9d5ff
```

| コンセプト | 説明 | 例 |
|---|---|---|
| **Agent** | モデル・システムプロンプト・ツール・MCPサーバー・スキルの定義体 | `Coding Assistant` |
| **Environment** | エージェントが動くコンテナ設定（クラウドまたはセルフホスト） | `cloud` / `self-hosted` |
| **Session** | 環境内で特定タスクを実行する実行中エージェントインスタンス | 1タスク = 1セッション |
| **Events** | アプリとエージェント間でやりとりするメッセージ群 | ユーザーターン・ツール結果 |

---

## 4. 全体アーキテクチャ

```mermaid
flowchart TD
    Dev[開発者 / アプリケーション] -->|1. エージェント作成| API[Managed Agents API]
    Dev -->|2. 環境作成| API
    Dev -->|3. セッション開始 + タスク送信| API

    API --> AgentDef[(Agent定義\nモデル / プロンプト / ツール)]
    API --> EnvDef[(Environment定義\nクラウドサンドボックス)]

    API -->|セッション起動| Session[Session]
    Session --> Sandbox[セキュアサンドボックス]

    Sandbox --> Tool1[bash実行]
    Sandbox --> Tool2[ファイル操作]
    Sandbox --> Tool3[Webサーチ]
    Sandbox --> Tool4[コード実行]

    Session -->|4. イベントストリーム返却| Dev

    style Dev fill:#1e293b,stroke:#64748b,color:#f1f5f9
    style API fill:#1e1b4b,stroke:#818cf8,color:#e2e8f0
    style Session fill:#1c0a00,stroke:#fb923c,color:#fed7aa
    style Sandbox fill:#052e16,stroke:#34d399,color:#d1fae5
    style AgentDef fill:#0f172a,stroke:#475569,color:#94a3b8
    style EnvDef fill:#0f172a,stroke:#475569,color:#94a3b8
```

---

## 5. Step-by-Step セットアップガイド

### ステップ 0: 前提条件を確認する

```mermaid
flowchart LR
    A[開始] --> B{Anthropic\nConsoleアカウント}
    B -->|なし| C[アカウント作成\nplatform.claude.com]
    B -->|あり| D{APIキー}
    C --> D
    D -->|なし| E[APIキー発行\nSettings > Keys]
    D -->|あり| F[セットアップ開始]
    E --> F

    style A fill:#1e1b4b,stroke:#818cf8,color:#e2e8f0
    style F fill:#052e16,stroke:#34d399,color:#d1fae5
```

必要なもの:
- Anthropic Console アカウント（`platform.claude.com`）
- APIキー（`Settings > Keys`から発行）

---

### ステップ 1: CLIとSDKをインストールする

**CLI（`ant`コマンド）のインストール:**

```bash
# macOS (Homebrew)
brew install anthropic/tap/ant

# Linux / WSL (curl)
curl -fsSL https://cli.anthropic.com/install.sh | sh

# インストール確認
ant --version
```

**SDKのインストール（Pythonの例）:**

```bash
pip install anthropic
```

**APIキーの設定:**

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

> **ベストプラクティス:** APIキーは`.env`ファイルで管理し、`.gitignore`に追加すること。ハードコードは厳禁。

---

### ステップ 2: エージェントを作成する

エージェントは**一度作成してIDを保存**し、複数セッションで使い回します。

```bash
# CLIで作成
ant beta:agents create \
  --name "Coding Assistant" \
  --model '{id: claude-opus-4-7}' \
  --system "You are a helpful coding assistant. Write clean, well-documented code." \
  --tool '{type: agent_toolset_20260401}'
```

**Pythonで作成する場合:**

```python
import anthropic

client = anthropic.Anthropic()

agent = client.beta.agents.create(
    name="Coding Assistant",
    model={"id": "claude-opus-4-7"},
    system="You are a helpful coding assistant. Write clean, well-documented code.",
    tools=[{"type": "agent_toolset_20260401"}],
    betas=["managed-agents-2026-04-01"],
)

print(f"Agent ID: {agent.id}")  # このIDを保存する
```

> **`agent_toolset_20260401`とは?**  
> bash・ファイル操作・Webサーチ・コード実行などのビルトインツールセット全体を有効にするショートカットです。個別ツールを指定することも可能です。

---

### ステップ 3: 環境（Environment）を作成する

```bash
# クラウド環境を作成
ant beta:environments create \
  --name "quickstart-env" \
  --config '{type: cloud, network: {internet_access: true}}'
```

```python
# Pythonで作成
env = client.beta.environments.create(
    name="quickstart-env",
    config={
        "type": "cloud",
        "network": {"internet_access": True}
    },
    betas=["managed-agents-2026-04-01"],
)
print(f"Environment ID: {env.id}")
```

**環境タイプの選び方:**

```mermaid
flowchart TD
    Q[環境タイプを選ぶ] --> A{データ居住要件や\nコンプライアンス制約}
    A -->|あり| B[セルフホストサンドボックス\n自社インフラ上で実行]
    A -->|なし| C{インターネット\nアクセスが必要?}
    C -->|必要| D[cloud + internet_access: true]
    C -->|不要| E[cloud + internet_access: false\n最小権限の原則]

    style B fill:#1c0a00,stroke:#fb923c,color:#fed7aa
    style D fill:#052e16,stroke:#34d399,color:#d1fae5
    style E fill:#1e1b4b,stroke:#818cf8,color:#e2e8f0
```

---

### ステップ 4: セッションを開始してタスクを送信する

```python
import anthropic

client = anthropic.Anthropic()

AGENT_ID = "agent_xxxxxxxxxxxxxxxx"   # ステップ2で取得
ENV_ID   = "env_xxxxxxxxxxxxxxxx"     # ステップ3で取得

# セッション作成 + タスク送信（ストリーミング）
with client.beta.sessions.stream(
    agent_id=AGENT_ID,
    environment_id=ENV_ID,
    user_event={
        "type": "user",
        "content": "フィボナッチ数列の最初の20個をfibonacci.txtに書き出してください"
    },
    betas=["managed-agents-2026-04-01"],
) as stream:
    for event in stream:
        print(event)
```

---

### ステップ 5: イベントを受信して処理する

```mermaid
flowchart TD
    A[セッション開始] --> B[session_start イベント]
    B --> C{エージェントの処理}
    C -->|テキスト生成| D[message_delta イベント]
    C -->|ツール使用| E[tool_use イベント]
    E --> F[tool_result イベント]
    F --> C
    C -->|完了| G[session_end イベント]
    G --> H[結果取得]

    style A fill:#1e1b4b,stroke:#818cf8,color:#e2e8f0
    style G fill:#052e16,stroke:#34d399,color:#d1fae5
    style H fill:#052e16,stroke:#34d399,color:#d1fae5
```

---

## 6. 組み込みツール一覧

```mermaid
flowchart LR
    T["agent_toolset\n_20260401"]

    T --> bash["bash\nbashコマンド実行"]
    T --> read["read_file\nファイル読み取り"]
    T --> write["write_file\nファイル書き込み"]
    T --> list["list_files\nディレクトリ一覧"]
    T --> search["web_search\nWeb検索"]
    T --> fetch["web_fetch\nURL取得"]
    T --> code["code_execution\nコード実行"]
    T --> editor["text_editor\nテキスト編集"]

    style T fill:#052e16,stroke:#34d399,color:#d1fae5
    style bash fill:#1e293b,stroke:#64748b,color:#e2e8f0
    style read fill:#1e293b,stroke:#64748b,color:#e2e8f0
    style write fill:#1e293b,stroke:#64748b,color:#e2e8f0
    style list fill:#1e293b,stroke:#64748b,color:#e2e8f0
    style search fill:#1e293b,stroke:#64748b,color:#e2e8f0
    style fetch fill:#1e293b,stroke:#64748b,color:#e2e8f0
    style code fill:#1e293b,stroke:#64748b,color:#e2e8f0
    style editor fill:#1e293b,stroke:#64748b,color:#e2e8f0
```

`agent_toolset_20260401`を指定すると以下のツールが**デフォルトで全て有効**になります。

| ツール名 | 説明 | 注意点 |
|---|---|---|
| `bash` | bashコマンドをシェルで実行 | 本番では権限ポリシーを必ず設定 |
| `read_file` | ファイルコンテンツ読み取り | バイナリも対応 |
| `write_file` | ファイル書き込み | 上書き注意 |
| `list_files` | ディレクトリ内のファイル一覧 | |
| `web_search` | Web検索 | `internet_access: true`が必要 |
| `web_fetch` | 指定URLのコンテンツ取得 | `internet_access: true`が必要 |
| `code_execution` | コードをサンドボックスで実行 | |
| `text_editor` | テキストファイルの精密編集 | diff形式で変更を管理 |

> **ベストプラクティス:** 最小権限の原則に従い、タスクに不要なツールは無効化する。`default_config.permission_policy`で制御可能。

---

## 7. 環境設定のベストプラクティス

### 権限ポリシーの設定

```python
# ツールの権限を細かく制御する例
agent = client.beta.agents.create(
    name="Safe Agent",
    model={"id": "claude-opus-4-7"},
    system="...",
    tools=[{
        "type": "agent_toolset_20260401",
        "default_config": {
            "permission_policy": {
                "type": "always_allow"  # or "always_deny", "ask_human"
            }
        }
    }],
    betas=["managed-agents-2026-04-01"],
)
```

### 権限ポリシーの選び方

```mermaid
flowchart TD
    Q[ツール実行の許可方式] --> A{信頼レベル}
    A -->|高い - 自動化パイプライン| B[always_allow\n常に自動許可]
    A -->|中程度 - 人間の監視あり| C[ask_human\n実行前に確認]
    A -->|低い - 安全優先| D[always_deny\n常に拒否]

    style B fill:#052e16,stroke:#34d399,color:#d1fae5
    style C fill:#1c0a00,stroke:#fb923c,color:#fed7aa
    style D fill:#1e1b4b,stroke:#818cf8,color:#e2e8f0
```

---

## 8. セッション管理とイベントストリーム

### ミッドセッション介入（Mid-session interruption）

タスク実行中にエージェントの方向を変えることができます。

```python
# 追加のユーザーイベントを送信して方向を変える
session.send_event({
    "type": "user",
    "content": "計画を変更してください。テストも追加で書いてください"
})
```

### Webhookでの非同期処理

長時間タスクはWebhookで結果を受け取るのがベストプラクティスです。

```mermaid
flowchart LR
    A[アプリ] -->|セッション開始| B[Managed Agents]
    B -->|即時レスポンス\nsession_id返却| A
    B -->|タスク実行中...| C[サンドボックス]
    C -->|完了| B
    B -->|Webhook通知\nsession_end| D[アプリのWebhookエンドポイント]

    style A fill:#1e293b,stroke:#64748b,color:#f1f5f9
    style B fill:#1e1b4b,stroke:#818cf8,color:#e2e8f0
    style D fill:#052e16,stroke:#34d399,color:#d1fae5
```

```python
# Webhook付きセッション作成
session = client.beta.sessions.create(
    agent_id=AGENT_ID,
    environment_id=ENV_ID,
    webhook={"url": "https://your-app.example.com/webhook/session"},
    betas=["managed-agents-2026-04-01"],
)
```

---

## 9. マルチエージェント設計パターン

複数のエージェントが協調して複雑なタスクをこなせます。全エージェントは**同じサンドボックスとファイルシステムを共有**しますが、**それぞれ独立したコンテキスト（会話履歴）**を持ちます。

### パターン1: 並列化（Parallelization）

```mermaid
flowchart TD
    Coord[コーディネーター\nエージェント] -->|独立タスクA| A1[検索エージェント1\nソース1を調査]
    Coord -->|独立タスクB| A2[検索エージェント2\nソース2を調査]
    Coord -->|独立タスクC| A3[検索エージェント3\nソース3を調査]
    A1 -->|結果| Coord
    A2 -->|結果| Coord
    A3 -->|結果| Coord
    Coord -->|統合・合成| Result[最終レポート]

    style Coord fill:#1e1b4b,stroke:#818cf8,color:#e2e8f0
    style Result fill:#052e16,stroke:#34d399,color:#d1fae5
```

### パターン2: 専門化（Specialization）

```mermaid
flowchart LR
    Lead[エンジニアリング\nリード] -->|コードレビュー依頼| Rev[レビュー\nエージェント]
    Lead -->|テスト作成依頼| Test[テスト\nエージェント]
    Lead -->|ドキュメント作成依頼| Doc[ドキュメント\nエージェント]
    Rev -->|レビュー結果| Lead
    Test -->|テスト結果| Lead
    Doc -->|ドキュメント| Lead

    style Lead fill:#1e1b4b,stroke:#818cf8,color:#e2e8f0
    style Rev fill:#1c0a00,stroke:#fb923c,color:#fed7aa
    style Test fill:#052e16,stroke:#34d399,color:#d1fae5
    style Doc fill:#1a0533,stroke:#c084fc,color:#e9d5ff
```

### マルチエージェントの設定コード

```python
# コーディネーターエージェントの作成
coordinator = client.beta.agents.create(
    name="Engineering Lead",
    model={"id": "claude-opus-4-7"},
    system="You coordinate engineering work. Delegate to specialist agents.",
    tools=[{"type": "agent_toolset_20260401"}],
    multiagent={
        "type": "coordinator",
        "agents": [
            {"type": "agent", "id": REVIEWER_AGENT_ID},
            {"type": "agent", "id": TEST_WRITER_AGENT_ID},
        ]
    },
    betas=["managed-agents-2026-04-01"],
)
```

**マルチエージェントの制約:**

| 制約 | 内容 |
|---|---|
| 深さ制限 | コーディネーターからサブエージェントへの委譲は1階層のみ |
| エージェント上限 | `multiagent.agents`に指定できるユニークエージェントは最大20個 |
| スキル上限 | セッション全体で最大20スキル（全エージェント合算） |
| コンテキスト | 各エージェントは独立したコンテキストを持つ（共有しない） |

---

## 10. Agent Skills の活用

Agent Skillsは、Claudeの機能を拡張する**モジュール型の追加能力**です。

```mermaid
flowchart LR
    Agent[エージェント] --> S1[claude-api スキル\nAPI参照・ベストプラクティス]
    Agent --> S2[カスタムスキル\n自社ドメイン知識]
    Agent --> S3[Anthropic\nプレビルドスキル]

    style Agent fill:#1e1b4b,stroke:#818cf8,color:#e2e8f0
    style S1 fill:#1c0a00,stroke:#fb923c,color:#fed7aa
    style S2 fill:#052e16,stroke:#34d399,color:#d1fae5
    style S3 fill:#1a0533,stroke:#c084fc,color:#e9d5ff
```

### スキルのアタッチ

```python
agent = client.beta.agents.create(
    name="API Builder",
    model={"id": "claude-opus-4-7"},
    system="You help developers build applications.",
    tools=[{"type": "agent_toolset_20260401"}],
    skills=[
        {
            "type": "skill_version",
            "skill_version_id": "SKILL_VERSION_ID"
        }
    ],
    betas=["managed-agents-2026-04-01"],
)
```

### カスタムスキルの作成

スキルはMarkdown + YAMLフロントマターで定義します。

```markdown
---
name: financial-analyzer
description: >
  財務データを分析するスキル。
  売上・コスト・利益率の計算と可視化を行う。
  財務レポートの作成時に使用する。
---

# Financial Analyzer

## Instructions

1. まずデータのフォーマットを確認する
2. 欠損値を処理する
3. 主要指標（売上・利益率・前年比）を計算する
4. 結果をレポートとして整形する

## Examples

- "Q3の売上データを分析して" → データ読み込み → 指標計算 → レポート出力
```

---

## 11. よくあるミスと対策

| よくあるミス | 問題 | 正しい対処法 |
|---|---|---|
| ベータヘッダーを忘れる | `managed-agents-2026-04-01`を付け忘れてAPIエラー | SDK使用時は自動付与される。curl使用時はヘッダーを明示的に追加する |
| Agent IDを保存しない | 毎回エージェントを作成してコストと時間を無駄にする | IDを環境変数やDBに保存する。エージェントは一度作れば使い回せる |
| 全ツールを常に有効にする | 不要なツールがセキュリティリスクになる | 最小権限の原則を適用し、タスクに必要なツールのみを有効化する |
| 長時間タスクを同期で待つ | 接続タイムアウトで失敗する | Webhookを使った非同期処理に切り替える |
| システムプロンプトが曖昧 | エージェントが意図と異なる動作をする | 役割・制約・出力形式を具体的に明記する |
| 環境タイプを深く考えずに選ぶ | コンプライアンス違反やデータ漏洩リスク | データ居住要件がある場合はセルフホストを選ぶ |

### セットアップチェックリスト

```markdown
## 初回セットアップ
- [ ] Anthropic Consoleアカウントを作成した
- [ ] APIキーを発行し、環境変数に設定した
- [ ] `ant` CLIをインストールし、バージョン確認した
- [ ] SDKをインストールした（pip / npm）

## エージェント作成時
- [ ] モデルIDを明示的に指定した
- [ ] システムプロンプトでエージェントの役割を明確に定義した
- [ ] 必要なツールのみを有効化した
- [ ] agent.idを安全な場所に保存した

## 環境設定時
- [ ] クラウド vs セルフホストを要件に基づいて選んだ
- [ ] インターネットアクセスの必要性を確認した
- [ ] environment.idを保存した

## 本番運用前
- [ ] 権限ポリシーを適切に設定した
- [ ] Webhookエンドポイントを設定した（長時間タスク）
- [ ] エラーハンドリングを実装した
- [ ] コスト管理のためのレート制限を設定した
```

---

## 12. 参考ソース

公式ドキュメントを参照することを強く推奨します。本ガイドの内容は以下のソースに基づいています。

| ドキュメント | URL |
|---|---|
| Managed Agents 概要 | https://platform.claude.com/docs/en/managed-agents/overview |
| クイックスタート | https://platform.claude.com/docs/en/managed-agents/quickstart |
| エージェント設定 | https://platform.claude.com/docs/en/managed-agents/agent-setup |
| ツール一覧 | https://platform.claude.com/docs/en/managed-agents/tools |
| 環境設定 | https://platform.claude.com/docs/en/managed-agents/environments |
| セッション管理 | https://platform.claude.com/docs/en/managed-agents/sessions |
| イベントストリーム | https://platform.claude.com/docs/en/managed-agents/events-and-streaming |
| Webhooks | https://platform.claude.com/docs/en/managed-agents/webhooks |
| マルチエージェント | https://platform.claude.com/docs/en/managed-agents/multi-agent |
| Agent Skills 概要 | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview |
| Agent Skills ベストプラクティス | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices |
| 権限ポリシー | https://platform.claude.com/docs/en/managed-agents/permission-policies |
| Anthropic Engineering Blog | https://www.anthropic.com/engineering/managed-agents |
| claude-api スキル | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/claude-api-skill |

---

> **インタラクティブなチュートリアルを試したい場合:**  
> Claude Codeで以下を実行すると、対話形式でManaged Agentsのセットアップをガイドしてもらえます。
>
> ```
> /claude-api managed-agents-onboard
> ```
