# GIT_WORKTREE.md — git worktree 並列開発 運用ガイド

> **目的**: 本プロジェクトで git worktree を使い、4プラットフォーム（Claude / Gemini / Codex / Copilot）の HTML ドキュメントを並列編集するための運用手順とルールを定義する。
> **詳細ガイド**: `/git_worktree.html`（~2200行、Mermaid ダイアグラム付き）
> **最終更新**: 2026-03-08

---

## 1. 概要

`git worktree` を使うと、同一リポジトリの複数ブランチを別々のディレクトリに同時チェックアウトできる。clone × 4 に比べて .git オブジェクトを共有するため、ディスク使用量が大幅に少ない。

### 対象ファイル

| プラットフォーム | ブランチ | ワークツリー | 編集対象 |
| --- | --- | --- | --- |
| Claude | `feat/claude-docs` | `worktrees/claude/` | `claude/skill.html`, `claude/agent.html` |
| Gemini | `feat/gemini-docs` | `worktrees/gemini/` | `gemini/skill.html`, `gemini/agent.html` |
| Codex | `feat/codex-docs` | `worktrees/codex/` | `codex/skill.html`, `codex/agent.html` |
| Copilot | `feat/copilot-docs` | `worktrees/copilot/` | `copilot/skill.html`, `copilot/agent.html` |

---

## 2. セットアップ

### 2.1 前提条件

- git 2.5+ (`git worktree` サポート)
- `.gitignore` に `worktrees/` が含まれていること（必須）

### 2.2 ブランチ作成

```bash
# dev ブランチから 4 ブランチを作成
git checkout dev
git branch feat/claude-docs
git branch feat/gemini-docs
git branch feat/codex-docs
git branch feat/copilot-docs
```

### 2.3 ワークツリー追加

```bash
# git worktree add <チェックアウト先パス> <ブランチ名>
git worktree add worktrees/claude   feat/claude-docs
git worktree add worktrees/gemini   feat/gemini-docs
git worktree add worktrees/codex    feat/codex-docs
git worktree add worktrees/copilot  feat/copilot-docs

# 確認
git worktree list
```

### 2.4 AI エージェントの起動

各 WT のルートから起動する（メインルートから起動しないこと）:

```bash
cd worktrees/claude  && claude .        # Claude Code
cd worktrees/gemini  && antigravity .   # Google Antigravity
cd worktrees/codex   && codex           # OpenAI Codex
cd worktrees/copilot && code .          # VS Code + Copilot
```

---

## 3. 共通リソースの変更フロー

`common-header.js` / `common-header.css` などの共通リソースは **dev ブランチ経由でのみ変更** する。

```text
1. dev ブランチで共通リソースを編集・commit
2. sync-all.sh で全 WT に反映（dev を各ブランチに merge）
3. 各 WT で作業を継続
```

### sync-all.sh

```bash
#!/bin/bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
WORKTREES=(claude gemini codex copilot)

for WT in "${WORKTREES[@]}"; do
  echo "--- Syncing: $WT ---"
  cd "$ROOT/worktrees/$WT"

  if [ -n "$(git status --porcelain)" ]; then
    git stash push -u -m "auto: $WT before sync"
    STASHED=true
  else
    STASHED=false
  fi

  if git merge dev --no-edit; then
    echo "  $WT: synced"
    if [ "$STASHED" = true ]; then
      if git stash apply; then
        git stash drop
      else
        echo "  $WT: STASH APPLY FAILED - 手動解決が必要"
      fi
    fi
  else
    echo "  $WT: CONFLICT - 手動解決が必要"
  fi
done

cd "$ROOT" && git worktree list
```

---

## 4. 7 つのルール

| # | ルール | 理由 |
| --- | --- | --- |
| 1 | **同一ブランチを複数 WT にチェックアウトしない** | `--force` は .git の整合性を破壊する |
| 2 | **WT の削除は `git worktree remove` を使う** | `rm -rf` だけではメタデータが残存する |
| 3 | **shared/ (common-header) の変更は dev 経由のみ** | 各 WT から直接変更すると merge コンフリクト多発 |
| 4 | **`git stash` メッセージに WT 名を含める** | stash は全 WT 共通の .git に保存されるため混在する |
| 5 | **pre-commit hook は全 WT 共有を前提に設計** | hooks/ は共有される。WT 固有の除外は `$GIT_DIR` で判定 |
| 6 | **AI エージェントは WT ルートから起動する** | メインルートから起動すると全 WT を横断変更するリスク |
| 7 | **定期的に `git worktree prune` を実行する** | 削除済み WT のメタデータ蓄積を防止 |

---

## 5. よくあるエラーと対処

| エラー | 原因 | 対処 |
| --- | --- | --- |
| `fatal: already checked out` | 同ブランチを別 WT で checkout しようとした | `git worktree list` で確認し別ブランチを使う |
| `fatal: already exists` | 対象ディレクトリが既に存在する | `rm -rf worktrees/xxx && git worktree prune` 後に再実行 |
| `error: worktree locked` | 別プロセスが使用中 | `git worktree unlock worktrees/xxx` または再起動 |
| `CONFLICT in shared/` | 複数 WT が同じ共通ファイルを変更 | CODEOWNERS + 保護ブランチで dev 経由のみに制限 |

---

## 6. クリーンアップ

```bash
# 個別削除（未コミット変更がない場合）
git worktree remove worktrees/claude

# 強制削除（未コミット変更も破棄）
git worktree remove --force worktrees/claude

# 全 WT 一括削除
for WT in claude gemini codex copilot; do
  git worktree remove --force "worktrees/$WT" 2>/dev/null || true
done && git worktree prune

# メタデータ掃除（確認 → 実行）
git worktree prune --dry-run
git worktree prune
```

---

## 7. 参考

- `git_worktree.html` — 本ガイドの詳細版（Mermaid ダイアグラム、CI 統合例、ディレクトリ構造 SVG 付き）
- [git-worktree 公式ドキュメント](https://git-scm.com/docs/git-worktree)
