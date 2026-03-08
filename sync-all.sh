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
