# WORKTREE_SETUP_MANUAL.md — 手動操作ステップガイド

> **対象読者**: このリポジトリで git worktree を使って 4 プラットフォームの HTML を並列編集したい人
> **前提**: git 2.5+、リポジトリは `dev` ブランチにいること
> **詳細リファレンス**: `docs/GIT_WORKTREE.md`

---

## Phase 1: 初回セットアップ

### Step 1 — dev ブランチにいることを確認

```bash
git status
# → On branch dev
# もし違うブランチにいたら:
git checkout dev
git pull origin dev   # リモートと同期
```

### Step 2 — 4 つのフィーチャーブランチを作成

```bash
git branch feat/claude-docs
git branch feat/gemini-docs
git branch feat/codex-docs
git branch feat/copilot-docs

# 確認（4 ブランチが表示されれば OK）
git branch
```

### Step 3 — ワークツリーを追加（4 個）

```bash
git worktree add worktrees/claude   feat/claude-docs
git worktree add worktrees/gemini   feat/gemini-docs
git worktree add worktrees/codex    feat/codex-docs
git worktree add worktrees/copilot  feat/copilot-docs

# 確認（5 行表示されれば OK: メイン + 4 WT）
git worktree list
```

**期待される出力例:**

```text
/path/to/LLM-Studies             xxxx [dev]
/path/to/LLM-Studies/worktrees/claude   yyyy [feat/claude-docs]
/path/to/LLM-Studies/worktrees/gemini   yyyy [feat/gemini-docs]
/path/to/LLM-Studies/worktrees/codex    yyyy [feat/codex-docs]
/path/to/LLM-Studies/worktrees/copilot  yyyy [feat/copilot-docs]
```

---

## Phase 2: 各 WT での作業

### Step 4 — 各 WT から AI エージェントを起動

> **重要**: メインルート (`LLM-Studies/`) からではなく、必ず WT ルートから起動すること。

```bash
# ターミナル 1
cd worktrees/claude  && claude .

# ターミナル 2
cd worktrees/gemini  && claude .

# ターミナル 3
cd worktrees/codex   && claude .

# ターミナル 4
cd worktrees/copilot && claude .
```

それぞれ別のターミナルタブ/ウィンドウで実行すること。

### Step 5 — 各 WT で編集・コミット

各 WT は独立したブランチなので、コミットも独立して行う。

```bash
# 例: claude WT でコミット
cd worktrees/claude
git add claude/skill.html
git commit -m "docs(claude): update skill guide"
```

---

## Phase 3: 共通リソースの変更が必要になったとき

> `common-header.js` / `common-header.css` などの共通ファイルは **dev ブランチでのみ** 変更する。

### Step 6 — dev で共通ファイルを変更してコミット

```bash
# メインリポジトリルートに戻る
cd /path/to/LLM-Studies   # または git worktree list でパスを確認

git checkout dev
# 共通ファイルを編集
git add shared/common-header.js shared/common-header.css
git commit -m "chore: update common-header"
```

### Step 7 — 全 WT に dev の変更を反映 (`sync-all.sh`)

`sync-all.sh` は各 WT で `git merge dev --no-edit` を実行する（ファイルをコピーするわけではない）。

```bash
bash sync-all.sh
```

- **共有ファイルは自動コピーされない**: `shared/common-header.js` 等は dev へのコミット後、merge によって各 WT に反映される。
- **コンフリクト**: 出力に `CONFLICT` が表示された場合は手動解決が必要。各 WT で `git status` を確認し、競合ファイルを編集後 `git merge --continue` を実行すること。
- **推奨ワークフロー**: 共有ファイルを変更した場合は、まず dev で commit し、次に `sync-all.sh` を実行して各 WT に merge する。

---

## Phase 4: PR 作成・マージ

### Step 8 — 各ブランチをリモートに push

```bash
# 各 WT で実行（または メインルートからブランチ指定で push）
cd worktrees/claude
git push -u origin feat/claude-docs

cd worktrees/gemini
git push -u origin feat/gemini-docs

cd worktrees/codex
git push -u origin feat/codex-docs

cd worktrees/copilot
git push -u origin feat/copilot-docs
```

### Step 9 — PR を作成して dev にマージ

```bash
# gh CLI を使う場合（各 WT で実行）
gh pr create --base dev --title "docs(claude): update skill/agent guide" --body "..."
```

GitHub の Web UI から作成しても OK。

---

## Phase 5: クリーンアップ

### Step 10 — 作業完了後に WT を削除

```bash
# 個別削除
git worktree remove worktrees/claude
git worktree remove worktrees/gemini
git worktree remove worktrees/codex
git worktree remove worktrees/copilot

# 一括削除（強制）
for WT in claude gemini codex copilot; do
  git worktree remove --force "worktrees/$WT" 2>/dev/null || true
done

# メタデータ掃除
git worktree prune
git worktree list   # メインのみ残っていれば OK
```

> **注意**: `rm -rf worktrees/` だけではメタデータ (`.git/worktrees/`) が残存する。必ず `git worktree remove` を使うこと。

---

## チェックリスト（コピペ用）

```text
□ Step 1: git status → dev ブランチにいることを確認
□ Step 2: feat/claude-docs, feat/gemini-docs, feat/codex-docs, feat/copilot-docs を作成
□ Step 3: git worktree add × 4 → git worktree list で確認
□ Step 4: 各 WT ルートから AI エージェントを起動（別ターミナル）
□ Step 5: 各 WT で編集・コミット
□ (共通ファイル変更時) Step 6: dev で変更 → Step 7: sync-all.sh で反映
□ Step 8: 各ブランチを push
□ Step 9: PR 作成 → dev にマージ
□ Step 10: WT 削除 → git worktree prune
```

---

## Phase 6: AI エージェント最適化 — HTML 更新プロンプト設計

> **目的**: `claude .` 起動後に与えるプロンプト・コンテキストを最適化し、トークン消費を最小化しながら最新情報を最大限に取得する。

---

### 6.1 WT 専用 CLAUDE.local.md の配置（自動コンテキスト注入）

各 WT ルートに `CLAUDE.local.md` を作成する。`claude .` 起動時に自動読み込みされ、**毎回プロンプトで説明する手間を省く**。

> **重要**: `CLAUDE.local.md` は個人用のローカルファイルであり、**commit してはいけない**（`.gitignore` に追加すること）。共有すべきルールはリポジトリレベルの `CLAUDE.md` に統合し、`CLAUDE.local.md` からは `@path/to/file` 構文で参照する。たとえば `CLAUDE.local.md` に `@CLAUDE.md` と記述するだけで共通ルールを引き継ぎつつ個人設定を上書きできる。commit する対象は `CLAUDE.md` のみ。

以下のテンプレートを `{platform}` を置換してそれぞれの WT ルートに配置する（`.gitignore` への追記も忘れずに）:

````markdown
# CLAUDE.local.md — {platform} WT 専用コンテキスト

## このワークツリーの役割
- **ブランチ**: feat/{platform}-docs
- **編集対象**: `{platform}/skill.html` / `{platform}/agent.html` の 2 ファイルのみ
- **禁止**: 他プラットフォームディレクトリ・共通リソース (common-header.js/.css) の直接変更

## HTML 編集制約（必須）
- Mermaid `<div class="mermaid">` 内コンテンツ: **インデントなし（カラム 0 配置）必須**
- Mermaid 各ステートメントは **改行で分離**（1 行連結は構文エラーになる）
- **全体書き直し禁止** — 必要差分のみを外科的に Edit する
- SVG `viewBox` 高さとコンテンツ座標の整合性を常に確認

## 作業フロー（このセッション）
1. Grep でセクション構造を把握（Read 全体より先に実行）
2. WebSearch で最新情報を取得（下記クエリを参照）
3. 差分を特定 → 必要箇所のみ Edit
4. コミット: `docs({platform}): {変更内容の要約}`

## WebSearch 推奨クエリ（プラットフォームごとに 6.4 節を参照）
````

---

### 6.2 セッション開始プロンプト（`claude .` 後の最初のメッセージ）

> **設計原則**: 「何をするか」より「何をしないか」を先に宣言するとスコープクリープを防止できる。冗長な背景説明は省き、手順・禁止事項・WebSearch 指示の 3 点に絞る。

#### Claude WT 用

```text
作業スコープ: claude/skill.html と claude/agent.html の内容更新のみ。

手順:
1. Grep で <section または <h2 を claude/skill.html から抽出してセクション構造を把握する
2. WebSearch "site:docs.anthropic.com/en/docs/claude-code" で公式最新情報を取得
3. WebSearch "claude code latest features update 2026" で変更点を確認
4. 現状コンテンツと照合し、アウトデートな箇所のみリストアップしてから編集開始

禁止: 他ディレクトリのファイル変更 / common-header の直接変更 / 全体書き直し
```

#### Gemini WT 用

```text
作業スコープ: gemini/skill.html と gemini/agent.html の内容更新のみ。

手順:
1. Grep で <section または <h2 を gemini/skill.html から抽出してセクション構造を把握する
2. WebSearch "site:ai.google.dev/gemini-api/docs" で最新仕様を取得
3. WebSearch "google gemini latest model features 2026" で変更点を確認
4. 差分特定 → 必要箇所のみ Edit

禁止: 他ディレクトリのファイル変更 / common-header の直接変更 / 全体書き直し
```

#### Codex WT 用

```text
作業スコープ: codex/skill.html と codex/agent.html の内容更新のみ。

手順:
1. Grep で <section または <h2 を codex/skill.html から抽出してセクション構造を把握する
2. WebSearch "site:platform.openai.com/docs" で最新 API 仕様を取得
3. WebSearch "openai codex latest features update 2026" で変更点を確認
4. 差分特定 → 必要箇所のみ Edit

禁止: 他ディレクトリのファイル変更 / common-header の直接変更 / 全体書き直し
```

#### Copilot WT 用

```text
作業スコープ: copilot/skill.html と copilot/agent.html の内容更新のみ。

手順:
1. Grep で <section または <h2 を copilot/skill.html から抽出してセクション構造を把握する
2. WebSearch "site:docs.github.com/en/copilot" で最新機能を取得
3. WebSearch "github copilot latest features update 2026" で変更点を確認
4. 差分特定 → 必要箇所のみ Edit

禁止: 他ディレクトリのファイル変更 / common-header の直接変更 / 全体書き直し
```

---

### 6.3 更新タスクプロンプト（実作業用）

セッション開始後、具体的な更新を指示するテンプレート。

#### セクション単位の更新

```text
"{セクション名}" セクションを更新してください。

1. Grep で該当セクションの開始・終了行番号を特定する
2. Read でそのセクションのみ読み込む（ファイル全体を Read しない）
3. 既存の内容を確認してから WebSearch で最新情報を補完する
4. 差分のみ Edit する（周辺の変更不要な箇所は触れない）
```

#### 全体監査 → 承認後に差分更新（安全パターン）

```text
{platform}/skill.html の内容全体を監査して、アウトデートな箇所を特定してください。

手順:
1. Grep で全 <section id= を抽出してセクションリストを作る
2. 各セクションについて WebSearch で現在の公式ドキュメントと照合する
3. アウトデートなセクションを箇条書きで報告する（この段階では編集しない）
4. 承認を得てから差分 Edit を実施する

重要: ファイル全体を一度に Read しない。Grep でセクション単位の行番号を取得してから
      必要なセクションのみ Read(offset=N, limit=M) で部分読み込みする。
```

---

### 6.4 WebSearch クエリ設計

#### 設計原則

| 原則 | 具体例 | 理由 |
| --- | --- | --- |
| `site:` で公式ドメイン限定 | `site:docs.anthropic.com` | ノイズ排除・権威ある一次情報 |
| 年号を含める | `2026` | 古い記事をフィルタ |
| **モデルバージョンは固定しない** | `latest model` / `newest` | バージョン固定するとリリース時点で陳腐化する |
| 英語クエリを優先 | `claude code hooks` | 公式英語ドキュメントへのヒット率が高い |
| 変化点にフォーカス | `update` / `changelog` | 既知の安定機能より新機能を優先取得 |

#### プラットフォーム別クエリ集（コピペ用）

**Claude:**

```text
site:docs.anthropic.com/en/docs/claude-code
claude code latest features update 2026
claude code MCP model context protocol latest
claude code subagent parallel latest
anthropic claude code changelog
```

**Gemini:**

```text
site:ai.google.dev/gemini-api/docs
google gemini latest model features 2026
gemini api newest version release 2026
gemini api function calling grounding latest
google gemini changelog update
```

**Codex:**

```text
site:platform.openai.com/docs
openai codex latest features update 2026
openai responses API agents SDK latest
openai codex changelog
```

**Copilot:**

```text
site:docs.github.com/en/copilot
github copilot latest features update 2026
github copilot agent mode extensions newest
github copilot changelog
```

---

### 6.5 トークン効率化の原則

HTML ドキュメントは 1,000〜1,500 行あるため、**全体 Read は最終手段**とする。

#### 推奨: Grep → セクション単位 Read

```text
悪い例（~15K tokens 消費）:
  Read("claude/skill.html")   ← 1500 行まるごと読む

良い例（~1K tokens 以下）:
  Grep(pattern="<section|<h2", path="claude/skill.html")   ← 構造だけ把握
  → 更新が必要なセクションの行番号を特定
  Read("claude/skill.html", offset=240, limit=80)          ← 必要箇所だけ読む
```

#### 避けるべきアンチパターン

| アンチパターン | トークン影響 | 代替手段 |
| --- | --- | --- |
| セッション冒頭でファイル全体を Read | 〜15K tokens 即時消費 | Grep でセクション構造だけ把握してから部分 Read |
| `git_worktree.html` を Read | 〜22K tokens（2200 行） | このファイルはコンテンツ更新作業では参照不要 |
| 同一ファイルを複数回 Read | 重複消費 | 初回読み込み内容をそのまま参照する |
| WebSearch にモデルバージョンを固定 | リリースで即陳腐化 | `latest` / `newest` / 年号のみ使う |
| WebSearch を汎用すぎるクエリで実行 | 低精度・古い情報 | `site:` + 年号 + 具体的機能名に絞る |
| 複数セクションを一括更新して commit | リバートが困難 | セクション単位で commit を分ける |

---

## よくあるミスと対処

| ミス | 症状 | 対処 |
| --- | --- | --- |
| メインルートから AI 起動 | 全 WT のファイルが変更される | 即座に中断し、各 WT ルートから再起動 |
| `rm -rf` で WT を削除 | `git worktree list` に残骸が残る | `git worktree prune` を実行 |
| 同じブランチを 2 つの WT に追加 | `fatal: already checked out` | `git worktree list` で確認し、別ブランチを使う |
| 共通ファイルを WT から直接変更 | merge コンフリクト多発 | `git checkout dev` で戻して dev から変更 |
