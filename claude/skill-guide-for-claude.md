# 🧠 Claude Code の SKILL.md 完全解説ガイド

> **対象読者**: Claude Code を使い始めたばかりの初学者  
> **目標**: SKILL.md の概念・構造・活用方法をゼロから理解する

---

## 📌 目次

1. [SKILL.md とは何か？](#1-skillmd-とは何か)
2. [Claude Code の全体構造を理解する](#2-claude-code-の全体構造を理解する)
3. [SKILL.md の基本構造](#3-skillmd-の基本構造)
4. [ディレクトリ構造と優先順位](#4-ディレクトリ構造と優先順位)
5. [スキルが呼び出される仕組み](#5-スキルが呼び出される仕組み)
6. [CLAUDE.md との違い](#6-claudemd-との違い)
7. [ステップバイステップ: 最初のスキルを作る](#7-ステップバイステップ-最初のスキルを作る)
8. [応用: リソースファイルのバンドル](#8-応用-リソースファイルのバンドル)
9. [YAML フロントマター 全フィールド解説](#9-yaml-フロントマター-全フィールド解説)
10. [ベストプラクティス](#10-ベストプラクティス)
11. [よくあるミスと対処法](#11-よくあるミスと対処法)
12. [参考リンク](#12-参考リンク)

---

## 1. SKILL.md とは何か？

**SKILL.md** は、Claude Code に「専門的なスキル（能力）」を追加するための設定ファイルです。

ひとことで言うと：

> 🎯 **「Claudeに特定のタスクのプロの手順書を渡す仕組み」**

### なぜ必要なのか？

Claude Code はセッションをまたいで記憶を保持しません。毎回「このプロジェクトでは PDF はこう作る」「コードレビューはこの観点でやる」と説明し直すのは非効率です。

SKILL.md を使うと：

- ✅ 一度書けば何度でも再利用できる
- ✅ Claude が状況に応じて自動的にスキルを読み込む
- ✅ スクリプトやテンプレートをバンドルできる
- ✅ チームで共有できる（オープンスタンダード対応）

```mermaid
flowchart LR
    A[😤 毎回説明する<br>従来の方法] -->|非効率| B[💬 Claude]
    C[📄 SKILL.md<br>に手順を書く] -->|自動読み込み| B
    B --> D[✅ 高品質な出力]
    style A fill:#ffcccc,stroke:#ff6666
    style C fill:#ccffcc,stroke:#66bb66
    style D fill:#cce5ff,stroke:#66aaff
```

---

## 2. Claude Code の全体構造を理解する

SKILL.md を理解するには、まず Claude Code の「記憶・拡張システム」全体像を把握しましょう。

```mermaid
graph TD
    subgraph 記憶システム["💾 記憶システム（Memory）"]
        A["📄 CLAUDE.md<br>常時読み込まれる<br>プロジェクト設定・規約"]
        B["🤖 Auto Memory<br>~/.claude/projects/.../MEMORY.md<br>Claudeが自動で学習・記録"]
    end

    subgraph 拡張システム["🔧 拡張システム（Extensions）"]
        C["⚡ Skills (.claude/skills/)<br>SKILL.md<br>専門スキル・手順書"]
        D["🔤 Slash Commands (.claude/commands/)<br>manual command.md<br>手動呼び出しコマンド"]
        E["🤖 Agents (.claude/agents/)<br>agent.md<br>サブエージェント"]
        F["🔌 MCP Servers<br>外部ツール連携"]
    end

    subgraph 実行["🚀 セッション開始時"]
        G["Claude Code 起動"]
        G -->|自動読み込み| A
        G -->|自動読み込み| B
        G -->|必要時に動的読み込み| C
        G -->|ユーザー手動で| D
        G -->|タスク実行時| E
    end

    style 記憶システム fill:#fff9e6,stroke:#f0c040
    style 拡張システム fill:#e6f0ff,stroke:#4080c0
    style 実行 fill:#e6ffe6,stroke:#40c040
```

### 各要素の役割比較

| 機能 | ファイル | 誰が呼び出す | 用途 |
| ------ | --------- | ------------ | ------ |
| **CLAUDE.md** | `CLAUDE.md` | 自動（常時） | プロジェクト規約・コーディングスタイル |
| **SKILL.md** | `skills/xxx/SKILL.md` | Claude が自動 or `/コマンド` | 専門タスクの手順書 |
| **Command** | `commands/xxx.md` | ユーザーが `/コマンド` で手動 | 決まった処理の呼び出し |
| **Agent** | `agents/xxx.md` | タスク実行時 | サブエージェントの役割定義 |

---

## 3. SKILL.md の基本構造

SKILL.md は **2つのパート** で構成されます。

```mermaid
block-beta
  columns 1
  A["--- (YAML フロントマター) ---<br>name: my-skill<br>description: このスキルをいつ使うか<br>allowed-tools: [Read, Write, Bash]<br>---"]
  B["# スキルの本文 (Markdown)<br>Claudeへの指示・手順書<br>## Step 1: ...<br>## Step 2: ..."]
  style A fill:#fff3cd,stroke:#ffc107
  style B fill:#d1ecf1,stroke:#17a2b8
```

### 実際のファイル例

```yaml
---
name: code-review
description: >
  コードのセキュリティ・バグ・パフォーマンス・スタイルを
  レビューする。ユーザーが「レビューして」「確認して」
  「チェックして」と言ったときに使用する。
allowed-tools: [Read, Grep, Glob]
---

# コードレビュースキル

## レビュー観点

1. **セキュリティ**: SQLインジェクション、XSS、認証漏れをチェック
2. **バグ**: NULL参照、境界値、例外処理を確認
3. **パフォーマンス**: N+1クエリ、不要なループを検出
4. **スタイル**: プロジェクトの命名規則に従っているか確認

## 出力フォーマット

問題を見つけた場合は以下の形式で報告する：
- 🔴 重大: すぐに修正が必要
- 🟡 警告: できれば修正を推奨
- 🟢 提案: コード品質向上のヒント
```

---

## 4. ディレクトリ構造と優先順位

### スキルを置く場所は3種類

```mermaid
graph TD
    subgraph Enterprise["🏢 Enterprise レベル (最高優先度)"]
        E1["管理者が設定する組織共通スキル<br>(Managed Policy)"]
    end

    subgraph Personal["👤 Personal レベル"]
        P1["~/.claude/skills/<br>すべてのプロジェクトで使える<br>個人のスキル集"]
    end

    subgraph Project["📁 Project レベル"]
        PR1[".claude/skills/<br>このプロジェクト専用のスキル<br>Gitで共有可能"]
    end

    subgraph Override["⚠️ 優先順位"]
        Enterprise -->|上書き| Personal
        Personal -->|上書き| Project
    end

    style Enterprise fill:#ffe6e6,stroke:#cc0000
    style Personal fill:#e6f0ff,stroke:#0066cc
    style Project fill:#e6ffe6,stroke:#006600
```

### 実際のフォルダ構造

```text
~/.claude/                      ← ホームディレクトリ（個人用）
├── CLAUDE.md                   ← 全プロジェクト共通設定
└── skills/                     ← 個人スキル
    ├── code-review/
    │   ├── SKILL.md            ← ← これが主役！
    │   ├── checklist.md        ← 補助ファイル
    │   └── scripts/
    │       └── lint.sh         ← バンドルされたスクリプト
    └── deploy/
        └── SKILL.md

your-project/                   ← プロジェクトルート
├── CLAUDE.md                   ← プロジェクト設定
└── .claude/
    ├── skills/                 ← プロジェクト専用スキル
    │   └── api-docs/
    │       └── SKILL.md
    └── commands/               ← 旧形式（後方互換）
        └── old-command.md
```

---

## 5. スキルが呼び出される仕組み

```mermaid
sequenceDiagram
    participant U as 👤 ユーザー
    participant CC as ⚡ Claude Code
    participant SK as 📚 Skills一覧
    participant SM as 📄 SKILL.md

    U->>CC: 「このコードをレビューして」
    CC->>SK: 利用可能なスキルを確認
    SK-->>CC: [code-review, deploy, api-docs, ...]
    Note over CC: descriptionと<br/>ユーザーの意図を照合
    CC->>SM: code-review/SKILL.md を読み込む
    SM-->>CC: レビュー手順・観点・出力形式
    CC->>U: 手順に従ったコードレビュー結果
```

### 2つの呼び出し方

#### 方法①: Claude が自動判断（推奨）

```text
ユーザー: 「このPDFを解析して要約してくれ」
Claude:   (自動でpdfスキルを検出・実行)
```

#### 方法②: スラッシュコマンドで手動呼び出し

```text
ユーザー: /code-review src/auth/login.ts
Claude:   (code-reviewスキルを直接実行)
```

#### invocation フィールドで制御する

```yaml
---
name: deploy
invocation: explicit        # ユーザーが /deploy と入力したときのみ実行
---
```

```yaml
---
name: code-analyzer
invocation: automatic       # Claude が自動判断で実行（デフォルト）
---
```

---

## 6. CLAUDE.md との違い

初学者が最も混乱するのがこの違いです。

```mermaid
quadrantChart
    title "CLAUDE.md vs SKILL.md の使い分け"
    x-axis "常時適用" --> "必要な時だけ"
    y-axis "ルール・制約" --> "手順・プロセス"
    quadrant-1 "SKILL.md の領域"
    quadrant-2 "ルールブック系"
    quadrant-3 "シンプルなメモ"
    quadrant-4 "CLAUDE.md の領域"
    "コーディングスタイル": [0.2, 0.3]
    "命名規則": [0.15, 0.25]
    "コミットメッセージ形式": [0.25, 0.4]
    "PDFを作る手順": [0.8, 0.75]
    "コードレビュー観点": [0.75, 0.7]
    "APIドキュメント生成": [0.85, 0.8]
    "デプロイ手順": [0.9, 0.85]
```

| 観点 | CLAUDE.md | SKILL.md |
| ------ | ----------- | ---------- |
| **読み込みタイミング** | セッション開始時・常時 | 必要なときだけ（オンデマンド） |
| **内容** | 常に守るべきルール・制約・コンテキスト | 特定タスクの詳細な手順書 |
| **コンテキスト消費** | 毎回消費する | 必要時のみ消費（効率的） |
| **スクリプト同梱** | ❌ できない | ✅ できる |
| **推奨行数** | 20〜200行 | 手順書として必要な分だけ |

### 黄金ルール

```text
「常に守るルール」→ CLAUDE.md
「特定のタスクの詳しい手順」→ SKILL.md
```

---

## 7. ステップバイステップ: 最初のスキルを作る

「コードを分かりやすく説明する」スキルを作ってみましょう。

### Step 1: ディレクトリを作成する

```bash
# 個人スキルとして作成（全プロジェクトで使える）
mkdir -p ~/.claude/skills/explain-code
```

### Step 2: SKILL.md を作成する

```bash
# ファイルを作成
touch ~/.claude/skills/explain-code/SKILL.md
```

### Step 3: フロントマターを書く

```yaml
---
name: explain-code
description: >
  コードの動作をビジュアル図解と例えを使って説明する。
  「どうやって動いてる？」「わかりやすく説明して」
  「教えて」と言われたときに使用する。
---
```

### Step 4: 本文（指示書）を書く

```markdown
# コード説明スキル

コードを説明するとき、必ず以下を含める：

## 1. アナロジー（例え話）で始める
日常生活の何かに例えてから説明する。
例：「このコードは郵便局のようなもので...」

## 2. 図を描く（ASCII アート）
コードの流れ・構造・関係性を視覚化する：
```

入力データ → [処理A] → [処理B] → 出力

```text

## 3. ステップバイステップで解説する
コードを上から順に、何が起きているか説明する。

## 4. 「落とし穴」を1つ挙げる
よくある誤解や注意すべき点を1つ教える。

説明は会話的なトーンで行う。難しい概念は複数の例えを使う。
```

### Step 5: 動作確認する

```bash
# Claude Code を起動
claude

# 自動呼び出しをテスト
> 「このコードはどうやって動いているの？」

# または直接呼び出し
> /explain-code src/utils/parser.ts
```

### Step 6: 完成したディレクトリ構造

```text
~/.claude/skills/explain-code/
└── SKILL.md     ✅ 完成！
```

---

## 8. 応用: リソースファイルのバンドル

スキルには、指示書（SKILL.md）だけでなく、スクリプトや参考資料もまとめられます。

```mermaid
graph LR
    subgraph skill_dir["📁 pdf-processor/ スキルディレクトリ"]
        A["📄 SKILL.md<br>(メインの指示書)"]
        B["🐍 scripts/extract.py<br>(Claudeが実行するスクリプト)"]
        C["📋 references/format.md<br>(参考資料・テンプレート)"]
        D["🗂️ assets/template.html<br>(出力テンプレート)"]
    end

    A -->|指示する| B
    A -->|参照する| C
    A -->|使用する| D

    style skill_dir fill:#f0f8ff,stroke:#4169e1
```

### 実践例: PDF処理スキル

```text
~/.claude/skills/pdf-processor/
├── SKILL.md              ← 指示書
├── scripts/
│   ├── extract_text.py   ← テキスト抽出スクリプト
│   └── summarize.py      ← 要約スクリプト
├── references/
│   └── output_format.md  ← 出力形式の仕様書
└── assets/
    └── report_template.html  ← レポートテンプレート
```

### SKILL.md でスクリプトを参照する書き方

```yaml
---
name: pdf-processor
description: PDFファイルを処理して要約・抽出を行う。
allowed-tools: [Bash, Read, Write]
---

# PDF処理スキル

## 処理手順

1. `scripts/extract_text.py` を実行してテキストを抽出する
2. `references/output_format.md` の形式に従って結果を整理する
3. `assets/report_template.html` を使ってレポートを生成する

## 重要な注意事項

- 大きなPDFは分割して処理する（1回あたり最大50ページ）
- 画像が含まれる場合は OCR の精度について言及する
```

---

## 9. YAML フロントマター 全フィールド解説

```mermaid
graph TD
    FM["--- YAML フロントマター ---"]
    FM --> N["name: スキル名<br>→ /slash-command の名前になる<br>例: name: code-review"]
    FM --> D["description: 説明文<br>→ Claudeがいつ使うか判断する<br>長くて具体的なほど精度UP"]
    FM --> AT["allowed-tools: ツールリスト<br>→ このスキルで使えるツールを制限<br>例: [Read, Write, Bash, Grep]"]
    FM --> INV["invocation: 呼び出し方<br>→ automatic: Claude自動判断（デフォルト）<br>→ explicit: /コマンドのみ"]
    FM --> CTX["context: fork / inherit<br>→ fork: 独立したコンテキストで実行<br>→ inherit: メイン会話のコンテキストを引き継ぐ"]
    FM --> AG["agent: エージェント指定<br>→ general-purpose（デフォルト）<br>→ Explore, Plan, カスタム"]

    style FM fill:#fff3cd,stroke:#ffc107
```

### フロントマター記述例

```yaml
---
name: security-audit               # /security-audit コマンドになる
description: >
  コードのセキュリティ監査を行う。
  「セキュリティをチェックして」「脆弱性を探して」
  「セキュリティ監査して」と言われたときに使用する。
  OWASP Top 10 の観点でレビューする。
allowed-tools:                     # 使えるツールを制限（セキュリティ上推奨）
  - Read
  - Grep
  - Glob
invocation: automatic              # Claude が自動判断
context: fork                      # メインのコンテキストを汚染しない
agent: general-purpose             # デフォルトのエージェントを使用
---
```

---

## 10. ベストプラクティス

### ✅ description の書き方が最重要

Claude がスキルを自動的に選択するかどうかは、`description` の質で決まります。

```yaml
# ❌ 悪い例（曖昧すぎる）
description: コードに関する作業をする

# ✅ 良い例（具体的なトリガーワードを含む）
description: >
  コードのセキュリティ・パフォーマンス・バグを包括的にレビューする。
  「レビューして」「確認して」「チェックして」「監査して」
  「問題点を探して」という言葉をトリガーに使用する。
  Pull Request のレビューにも使用する。
```

### ✅ SKILL.md の適切なサイズ

```mermaid
graph LR
    A["短すぎる<br>< 10行"] -->|不十分| B["❌ Claudeが<br>何をすべきか不明"]
    C["適切<br>50〜500行"] -->|最適| D["✅ 明確な指示で<br>一貫した出力"]
    E["長すぎる<br>> 5000行"] -->|コンテキスト肥大| F["❌ 重要な指示が<br>埋もれる"]
    style B fill:#ffcccc
    style D fill:#ccffcc
    style F fill:#ffcccc
```

### ✅ 構造化された指示を書く

```markdown
# スキル名

## いつ使うか（Claudeへの呼び出し条件）
...

## 手順
1. まず〇〇をする
2. 次に〇〇をする
3. 最後に〇〇をする

## 出力フォーマット
...

## 注意事項
...
```

### ✅ チェックリスト

| 確認項目 | 説明 |
| --------- | ------ |
| `description` は具体的か | トリガーとなる言葉・状況を含める |
| 手順は番号付きリストか | 箇条書きより番号付きリストが指示に従いやすい |
| 出力形式は明示されているか | 何を出力すべきか明確にする |
| `allowed-tools` は必要最小限か | 不要な権限は与えない（セキュリティ） |
| 150行以内に収まっているか | 冗長な説明は別ファイルに分ける |

---

## 11. よくあるミスと対処法

### ミス① スキルが自動で呼ばれない

```mermaid
flowchart TD
    A[スキルが呼ばれない] --> B{原因を特定}
    B -->|descriptionが曖昧| C["✏️ トリガーワードを<br>具体的に追記する"]
    B -->|ファイル構造が間違い| D["📁 SKILL.md が skills/スキル名/<br>の中にあるか確認"]
    B -->|スキルが無効化| E["⚙️ Claude Code の<br>Settings > Skills を確認"]
    B -->|手動で試す| F["/スキル名 で直接呼び出してみる"]
    style A fill:#ffcccc
    style C fill:#ccffcc
    style D fill:#ccffcc
    style E fill:#ccffcc
    style F fill:#ccffcc
```

### ミス② 同名スキルの競合

```text
~/.claude/skills/deploy/SKILL.md     ← 個人スキル
.claude/skills/deploy/SKILL.md       ← プロジェクトスキル（こちらが優先）
```

**解決策**: 優先順位は `enterprise > personal > project`。  
意図的に上書きしたい場合は問題ないが、意図しない場合は名前を変更する。

### ミス③ コンテキストを使いすぎる

```yaml
# ❌ 毎回ロードされて重くなる
# CLAUDE.md に詳細な手順書を書いてしまっている...

# ✅ 手順書は SKILL.md に移動する
# CLAUDE.md には短い参照だけ書く
# 詳細は skills/my-procedure/SKILL.md に書く
```

---

## 12. 参考リンク

以下の公式・コミュニティリソースを参照してこのガイドを作成しました。

### 📚 公式ドキュメント

| リソース | URL |
| --------- | ----- |
| Claude Code Skills 公式ドキュメント | <https://code.claude.com/docs/en/skills> |
| Agent Skills 概要（Claude API） | <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview> |
| Claude Code Memory システム | <https://code.claude.com/docs/en/memory> |
| Claude Code Skills ヘルプ（claude.ai） | <https://support.claude.com/en/articles/12512180-use-skills-in-claude> |

### 🌐 コミュニティリソース

| リソース | URL |
| --------- | ----- |
| Claude Code Skills の内部構造解析 | <https://mikhail.io/2025/10/claude-code-skills/> |
| Skills vs Workflows vs Agents の使い分け | <https://danielmiessler.com/blog/when-to-use-skills-vs-commands-vs-agents> |
| Claude Code カスタマイズ完全ガイド | <https://alexop.dev/posts/claude-code-customization-guide-claudemd-skills-subagents/> |
| Claude Code メモリシステム詳解 | <https://joseparreogarcia.substack.com/p/claude-code-memory-explained> |
| CLAUDE.md メモリ階層（DeepWiki） | <https://deepwiki.com/FlorianBruniaux/claude-code-ultimate-guide/4.1-claude.md-files-and-memory-hierarchy> |
| Agent Skills ディープダイブ | <https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/> |
| Claude Code ベストプラクティス集（GitHub） | <https://github.com/shanraisshan/claude-code-best-practice> |
| Claude Code ガイド（自動更新・GitHub） | <https://github.com/Cranot/claude-code-guide> |
| Skills マーケットプレイス | <https://skillsmp.com> |
| SFEIR Institute CLAUDE.md チュートリアル | <https://institute.sfeir.com/en/claude-code/claude-code-memory-system-claude-md/tutorial/> |

---

## 📎 まとめ

```mermaid
mindmap
  root((SKILL.md))
    何のため？
      専門タスクの手順書
      一度書いて何度でも再利用
      チームで共有可能
    どこに置く？
      個人: ~/.claude/skills/スキル名/
      プロジェクト: .claude/skills/スキル名/
      エンタープライズ: 管理者が設定
    何を書く？
      YAMLフロントマター
        name: スキル名
        description: いつ使うか
        allowed-tools: 使えるツール
      Markdown本文
        手順・プロセス
        出力フォーマット
        注意事項
    CLAUDE.mdとの違い
      CLAUDE.mdは常時読み込み
      SKILL.mdは必要時のみ
      SKILL.mdはスクリプト同梱可
```

> 💡 **最重要ポイント**:  
> `description` を丁寧に書くことが、スキルが自動で正しく呼び出されるかどうかを左右する最重要事項です。  
> 「どんな言葉・状況でこのスキルを使うべきか」を具体的に書きましょう。

---


## 詳細ガイド

さらに詳しい技術的解説は以下のドキュメントをご覧ください：

- **[Claude Code SKILL.md 詳細ガイド（deep-dive）](./skill-guide-deep-dive.md)**  
  プログレッシブ・ディスクロージャーのアーキテクチャ、トークン経済、動的コンテキスト注入、`context: fork`、エンタープライズプロビジョニング、エコシステムとの統合など、SKILL.md の高度な設計思想と実装パターンを網羅的に解説しています。

---
