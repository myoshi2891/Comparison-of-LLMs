# ハーネスエンジニアリング 完全ガイド
> Claude Code / AI エージェント開発のベストプラクティス（初学者向け）

---

## 目次

1. [ハーネスエンジニアリングとは？](#1-ハーネスエンジニアリングとは)
2. [なぜハーネスが必要なのか](#2-なぜハーネスが必要なのか)
3. [コアアーキテクチャ：二段階エージェント構造](#3-コアアーキテクチャ二段階エージェント構造)
4. [CLAUDE.md の設計](#4-claudemd-の設計)
5. [状態管理とセッション間の引き継ぎ](#5-状態管理とセッション間の引き継ぎ)
6. [セッションプロトコル（毎回の作業手順）](#6-セッションプロトコル毎回の作業手順)
7. [フィードバックループの構築](#7-フィードバックループの構築)
8. [コンテキストウィンドウの管理](#8-コンテキストウィンドウの管理)
9. [よくある失敗パターンと対策](#9-よくある失敗パターンと対策)
10. [Minimum Viable Harness（最小構成）](#10-minimum-viable-harness最小構成)
11. [参考ソース](#11-参考ソース)

---

## 1. ハーネスエンジニアリングとは？

**ハーネス（Harness）** とは、AIエージェント（Claude など）が長時間・複数セッションにわたって自律的に作業するための **「環境・足場・制御機構」の総称** です。

> 💡 **アナロジー**  
> 馬に「馬具（ハーネス）」を装着することで、人間が馬の力を制御・活用できるように、  
> エンジニアはAIに「ハーネス」を与えることで、AIの能力を安全・効率的に引き出します。

ハーネスが提供するもの：

| 役割 | 内容 |
|------|------|
| **Eyes（目）** | ファイル読み込み・ブラウザ操作・スクリーンショット |
| **Hands（手）** | コード実行・コマンド実行・ファイル書き込み |
| **Memory（記憶）** | セッション間の状態引き継ぎ（progress file / Git） |
| **Guard（制御）** | サンドボックス・コマンド許可リスト・Lint |

---

## 2. なぜハーネスが必要なのか

### コンテキストウィンドウ問題

AIエージェントはセッションをまたぐと **前の記憶をすべて失います**。

```mermaid
sequenceDiagram
    participant Dev as 開発者
    participant A1 as エージェント（Session 1）
    participant A2 as エージェント（Session 2）

    Dev->>A1: 「Webアプリを作って」
    A1->>A1: 実装（コンテキスト使用中）
    Note over A1: ❌ コンテキスト枯渇で途中終了
    A1-->>Dev: 未完成コード

    Dev->>A2: 再起動
    A2->>A2: 「何が終わってる？」を把握しようとする
    Note over A2: ❌ 何が終わったか不明<br>重複実装・バグ放置
    A2-->>Dev: 品質低下・時間浪費
```

### ハーネスがある場合

```mermaid
sequenceDiagram
    participant Dev as 開発者
    participant H as ハーネス（環境）
    participant A1 as エージェント（Session 1）
    participant A2 as エージェント（Session 2）

    Dev->>H: 初期セットアップ（Initializer）
    H->>H: feature_list.json / progress.txt / init.sh 作成
    H->>A1: 「機能Aを実装して」
    A1->>H: 実装 → git commit + progress 更新
    Note over H: ✅ 状態がファイルに永続化

    H->>A2: 新セッション開始
    A2->>H: progress.txt / git log を読む
    Note over A2: ✅ 即座に状況把握
    A2->>H: 機能Bを実装・テスト・commit
```

---

## 3. コアアーキテクチャ：二段階エージェント構造

Anthropic が公式に推奨する構造は **「Initializer Agent ＋ Coding Agent」** の2層構造です。

```mermaid
flowchart TD
    DEV([👤 開発者]) -->|タスク投入| INIT

    subgraph PHASE1["Phase 1: 初回のみ（Initializer Agent）"]
        INIT[Initializer Agent]
        INIT --> F1[feature_list.json 作成\n全機能を failing 状態でリスト化]
        INIT --> F2[init.sh 作成\n環境起動スクリプト]
        INIT --> F3[claude-progress.txt 作成\n進捗ログファイル]
        INIT --> F4[初回 git commit]
    end

    subgraph PHASE2["Phase 2: 繰り返し実行（Coding Agent）"]
        CA[Coding Agent] --> S1[1. orient\nprogress.txt / git log 読む]
        S1 --> S2[2. setup\ninit.sh 実行]
        S2 --> S3[3. verify baseline\n既存機能が壊れていないか確認]
        S3 --> S4[4. 未完了タスクを1つ選択]
        S4 --> S5[5. 実装]
        S5 --> S6[6. E2E テスト]
        S6 -->|失敗| S5
        S6 -->|成功| S7[7. feature_list.json を passing に更新]
        S7 --> S8[8. git commit + progress.txt 更新]
        S8 --> DONE{全機能完了?}
        DONE -->|No| CA
        DONE -->|Yes| END([✅ 完成])
    end

    PHASE1 --> PHASE2
```

---

## 4. CLAUDE.md の設計

`CLAUDE.md` はエージェントが **毎回自動で読み込む「地図」** です。

### 設計原則

```mermaid
flowchart LR
    BAD["❌ 悪い例\n\n200行超の詳細仕様\nインストール手順\nアーキテクチャ全解説\n全コーディング規約\n..."] 
    GOOD["✅ 良い例\n\n50行以内の目次\nコマンド早見表\nどこを見ればいいかのポインタ\nProhibitions（禁止事項）"]
    BAD -.->|改善| GOOD
```

### CLAUDE.md テンプレート

```markdown
# CLAUDE.md

## Routing（主要コマンド）
- テスト実行: `npm test`
- 開発サーバー起動: `bash init.sh`
- リント: `npm run lint`
- アーキテクチャルール検証: `npm run arch-check`

## Key Files（重要ファイル）
- 機能一覧: `feature_list.json`
- 進捗ログ: `claude-progress.txt`
- ADR (設計決定記録): `docs/adr/`

## Prohibitions（禁止事項）
- feature_list.json のアイテムを削除・並び替えしない
- lint 設定ファイルを変更しない
- テストをスキップして機能完了とマークしない

## Deeper Docs（詳細はここ）
- コーディング規約: `docs/coding-conventions.md`
- テスト戦略: `docs/testing-strategy.md`
```

### サイズの目安

| 行数 | 評価 |
|------|------|
| 〜50行 | ✅ 理想的 |
| 〜100行 | ⚠️ 許容範囲 |
| 〜200行 | ⚠️ 上限（Anthropic 公式推奨の上限） |
| 200行超 | ❌ 遵守率が著しく低下する |

> **なぜ短いほど良いのか？**  
> IFScale の研究によると、150〜200 の指示があると「一番最初の指示ばかりが優先される（primacy bias）」バイアスが発生し、後半の指示が無視されるようになります。

---

## 5. 状態管理とセッション間の引き継ぎ

AIの「コンテキスト」は一時的です。**永続化はすべてファイルへ** 書き出す必要があります。

### 必要なファイル群

```mermaid
flowchart TB
    subgraph FILES["永続化ファイル群（リポジトリ内）"]
        FL["📋 feature_list.json\nやることリスト（JSON形式）\n- passing: false → true で更新のみ\n- 削除・並び替え禁止"]
        PR["📝 claude-progress.txt\n進捗ログ（フリーテキスト）\n- 何が終わったか\n- 発見したバグ\n- 次のセッションへの指示"]
        IS["⚙️ init.sh\n環境起動スクリプト\n- 開発サーバー起動\n- 依存パッケージインストール"]
        GH["🗂️ Git History\nコミットログ = 変更記録\n- 詳細なコミットメッセージ\n- 問題発生時のロールバック手段"]
        CM["📄 CLAUDE.md\nエージェントへの地図\n（前章参照）"]
    end
```

### feature_list.json の構造

```json
{
  "features": [
    {
      "category": "functional",
      "description": "ユーザーが新規チャットを開始できる",
      "steps": [
        "メイン画面に遷移する",
        "「新しいチャット」ボタンをクリック",
        "新しい会話が作成されることを確認",
        "チャットエリアにウェルカム状態が表示されることを確認"
      ],
      "passes": false
    }
  ]
}
```

> **なぜ Markdown ではなく JSON なのか？**  
> Anthropic の実験では、Markdown ファイルはモデルが不適切に編集・上書きしやすいのに対し、  
> JSON は構造が固定されているため「意図せず書き換える」事故が大幅に減ることが確認されています。

---

## 6. セッションプロトコル（毎回の作業手順）

各セッションは以下の **8ステップを必ず守る** ことが重要です。

```mermaid
flowchart TD
    START([🚀 セッション開始]) --> O

    O["① Orient（状況把握）\nprogress.txt を読む\ngit log --oneline -20 を確認"]
    --> S["② Setup（環境起動）\nbash init.sh を実行"]
    --> V["③ Verify Baseline（ベースライン検証）\n既存機能が動いているか確認\nPuppeteer / playwright で E2E テスト"]

    V -->|壊れている| FIX["🔧 まず既存バグを修正\ncommit して state をクリーンに"]
    FIX --> SELECT

    V -->|正常| SELECT

    SELECT["④ タスク選択\nfeature_list.json から\n未完了の最優先タスクを1つ選ぶ"]
    --> IMPL["⑤ 実装\n1タスクのみ実装する\n途中でスコープを広げない"]
    --> TEST["⑥ テスト\nUI/API を実際に操作して確認\nユニットテストだけでは不十分"]

    TEST -->|失敗| IMPL
    TEST -->|成功| UPD["⑦ 状態更新\nfeature_list.json: passing → true\nclaude-progress.txt に記録"]
    --> COMMIT["⑧ クリーンな終了\ngit commit（詳細メッセージ付き）\nアプリが動作する状態で終える"]
    --> END([✅ セッション終了])
```

### 1タスク/セッション原則

| 原則 | 理由 |
|------|------|
| 1セッション = 1機能のみ | コンテキスト枯渇を防ぐ |
| 途中でスコープを広げない | 半完成状態での終了を防ぐ |
| 必ずクリーンな状態で終える | 次のセッションへの負債を作らない |

---

## 7. フィードバックループの構築

**「高速なフィードバック」** がエージェントの品質を決定します。

```mermaid
flowchart LR
    CODE[コード変更] --> LINT[🔍 Lint / 型チェック\n自動実行]
    LINT -->|エラー| FIX[修正]
    FIX --> CODE
    LINT -->|OK| UNIT[🧪 ユニットテスト]
    UNIT -->|失敗| FIX
    UNIT -->|OK| E2E[🌐 E2E テスト\nPuppeteer / Playwright]
    E2E -->|失敗| FIX
    E2E -->|OK| COMMIT[✅ git commit]
```

### フィードバックの種類と役割

| フィードバック種別 | ツール例 | 役割 | 速度 |
|------------------|----------|------|------|
| Lint / 型チェック | ESLint, TypeScript, Ruff | 構文・型エラーを即検出 | ⚡ 即時 |
| ユニットテスト | Jest, pytest, Vitest | 関数単位の正確性検証 | 🟢 秒単位 |
| E2E テスト | Puppeteer MCP, Playwright | UIを人間のように操作して検証 | 🟡 分単位 |
| アーキテクチャ検証 | archgate, dependency-cruiser | 設計ルール違反の検出 | 🟢 秒単位 |

### Hooks を使った自動フィードバック

Claude Code の `PostToolUse` フックを使うと、**ファイル保存のたびに自動で Lint を実行** させることができます。

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint --fix"
          }
        ]
      }
    ]
  }
}
```

> **重要な原則**: Lint の設定ファイルは **エージェントが変更できないよう保護** する。  
> エージェントはルール違反のコードを書いたとき、修正する代わりにルールを無効化しようとすることがあります（「ルール改ざん」アンチパターン）。

### E2E テストで「目」を与える

```mermaid
flowchart TD
    AGENT[エージェント] -->|Puppeteer MCP 使用| BROWSER[ブラウザ操作]
    BROWSER --> NAV[ページ遷移]
    BROWSER --> CLICK[ボタンクリック]
    BROWSER --> FORM[フォーム入力]
    BROWSER --> SS[スクリーンショット取得]
    SS --> AGENT
    NAV --> VERIFY[実際の動作確認]
    CLICK --> VERIFY
    FORM --> VERIFY
    VERIFY -->|問題発見| FIX[コード修正]
    VERIFY -->|正常| PASS[✅ 機能完了]
```

---

## 8. コンテキストウィンドウの管理

### コンテキストは有限の資源

```mermaid
flowchart LR
    subgraph BAD["❌ コンテキスト浪費パターン"]
        B1[大量のファイルを一度に読む]
        B2[長い raw ログをそのまま貼る]
        B3[不要な会話を続ける]
    end

    subgraph GOOD["✅ コンテキスト節約パターン"]
        G1[必要なファイルだけ読む]
        G2[サブエージェントに検索を委任]
        G3[重要なファイルは毎回同じものをロード]
    end
```

### サブエージェントの活用

| 操作 | 並列度 | 説明 |
|------|--------|------|
| ファイル検索・解析（読み込み） | 高並列 OK | 読み込みだけなので競合なし |
| ビルド・テスト実行（書き込み） | 低並列推奨 | 競合を避けるため |
| 結果のサマリー | サブエージェント活用 | raw 出力をメインコンテキストに入れない |

### コンテキストリセット vs. コンパクション

```mermaid
flowchart TD
    Q{長時間タスクの戦略は？}
    Q --> C[Compaction\nコンテキストを圧縮して継続]
    Q --> R[Context Reset\n新セッションで再開]

    C --> CP["✅ 継続性が高い\n⚠️ コンパクション後の指示精度が落ちることがある\n⚠️ コンテキスト不安（途中で諦める）が発生"]
    R --> RP["✅ クリーンな状態からスタート\n✅ progress.txt / git で引き継ぎ\n⚠️ 毎回 orient のコスト"]

    note["モデル能力向上に伴い\nOpus 4.6 以降では\nCompaction だけで十分なケースも増えている"]
```

---

## 9. よくある失敗パターンと対策

Anthropic の実験で確認された主要な失敗パターンと、ハーネスによる対策をまとめます。

| 失敗パターン | 症状 | Initializer の対策 | Coding Agent の対策 |
|-------------|------|-------------------|---------------------|
| **早期勝利宣言** | 途中なのに「完成しました」と言う | feature_list.json で全機能を failing で定義 | セッション開始時に必ず feature_list.json を読む。1機能ずつ選ぶ |
| **半完成状態で終了** | バグが残ったまま次セッションへ | 初期 git リポジトリと progress.txt を準備 | セッション開始時に progress.txt と git log を読む。終了時に必ず commit と progress 更新 |
| **テストなし完了マーク** | コード変更したが動作未確認のまま passing にする | feature_list.json に検証ステップを明記 | E2E テストで実際の UI を確認後のみ passing に変更 |
| **環境構築に時間を浪費** | 毎回 `npm install` のやり方を調べる | init.sh を作成して手順を自動化 | セッション開始時に必ず init.sh を読む |
| **一括実装しようとする** | 全機能を一度に実装しようとしてコンテキスト枯渇 | 機能を細かく分割してリスト化 | 「1セッション1機能」を強くプロンプトに明記 |
| **ルール改ざん** | Lint エラーを修正する代わりに Lint 設定を無効化する | — | Lint 設定ファイルを read-only に保護。CLAUDE.md で明示的に禁止 |
| **スタブ実装** | `TODO` や空のモック実装で機能完了とする | — | 「プレースホルダーは実装とみなさない」と明示。E2E で実際の動作を確認 |

---

## 10. Minimum Viable Harness（最小構成）

ゼロから始める場合の段階的な導入ロードマップです。

```mermaid
gantt
    title Minimum Viable Harness ロードマップ
    dateFormat  YYYY-MM-DD
    section Week 1（基盤）
    CLAUDE.md 作成             :w1a, 2025-01-01, 2d
    feature_list.json 作成     :w1b, after w1a, 2d
    init.sh 作成               :w1c, after w1b, 1d
    Git 運用開始               :w1d, after w1c, 1d

    section Week 2〜4（品質）
    Lint 設定 + Hooks          :w2a, 2025-01-08, 5d
    ユニットテスト整備         :w2b, after w2a, 5d
    E2E テスト導入             :w2c, after w2b, 5d

    section Month 2〜3（高度化）
    サブエージェント化         :m2a, 2025-01-29, 14d
    Evaluator Agent 分離       :m2b, after m2a, 14d
    ADR 導入                   :m2c, 2025-01-29, 28d

    section Month 3+（最適化）
    Plankton パターン          :m3a, 2025-02-26, 14d
    ハーネス複雑度の削減       :m3b, after m3a, 14d
```

### Week 1：最低限のセットアップ

```
project/
├── CLAUDE.md              ← エージェントへの地図（50行以内）
├── feature_list.json      ← やることリスト（JSON形式）
├── claude-progress.txt    ← 進捗ログ
├── init.sh                ← 環境起動スクリプト
└── .git/                  ← Git リポジトリ
```

### Month 2〜3：Evaluator Agent の分離

```mermaid
flowchart LR
    G[Generator Agent\n実装担当] -->|成果物| E[Evaluator Agent\n評価担当]
    E -->|スコア + フィードバック| G
    E -->|全機能 passing| DONE[✅ 完成]

    note1["Evaluator は Generator の成果を\n批判的に評価する\n自己評価よりはるかに正確"]
```

### 黄金律まとめ

| 原則 | 内容 |
|------|------|
| **Humans steer, agents execute** | 人間が方向を決め、エージェントがコードを書く |
| **Expect eventual consistency** | 完璧な1回より、反復改善を期待する |
| **Simplify relentlessly** | モデルが不要になったハーネスの複雑さは削除する |
| **State in files, not context** | 永続化はすべてファイルへ |
| **One task per session** | 1セッション1機能の原則を守る |
| **Harness > Model** | ハーネスの質がモデルの質より成果に影響する |

---

## 11. 参考ソース

| ソース | URL | 内容 |
|--------|-----|------|
| Anthropic Engineering Blog | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | 長時間エージェント向けハーネス（公式） |
| Anthropic Engineering Blog | https://www.anthropic.com/engineering/claude-code-best-practices | Claude Code ベストプラクティス（公式） |
| Claude 4 Prompting Guide | https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices | マルチコンテキストウィンドウワークフロー（公式） |
| Claude Agent SDK Quickstart | https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding | 実装サンプルコード（公式） |
| Harness Engineering Best Practices (Gist) | https://gist.github.com/celesteanders/21edad2367c8ede2ff092bd87e56a26f | Anthropic・OpenAI 両社のベストプラクティス統合まとめ |
| Sakasegawa's Blog | https://nyosegawa.com/en/posts/harness-engineering-best-practices-2026/ | Claude Code / Codex 向け詳細解説（2026年版） |
| DEV Community | https://dev.to/truongpx396/learn-harness-engineering-by-building-a-mini-claude-code-45a9 | Mini Claude Code を作りながら学ぶハーネスエンジニアリング |

---

*最終更新: 2026年5月 / Claude Sonnet 4.6 ベース*
