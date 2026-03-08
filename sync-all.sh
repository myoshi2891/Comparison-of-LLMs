#!/bin/bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
WORKTREES=(claude gemini codex copilot)

for WT in "${WORKTREES[@]}"; do
  echo "--- Syncing: $WT ---"
  cd "$ROOT/worktrees/$WT"

  STASH_ID=""
  if [ -n "$(git status --porcelain)" ]; then
    git stash push -u -m "auto: $WT before sync"
    STASH_ID=$(git stash list --format='%gd' -1)
    STASHED=true
  else
    STASHED=false
  fi

  if git merge dev --no-edit; then
    echo "  $WT: synced"
    if [ "$STASHED" = true ]; then
      if git stash apply "$STASH_ID"; then
        git stash drop "$STASH_ID"
      else
        echo "  $WT: STASH APPLY FAILED - 手動解決が必要"
      fi
    fi
  else
    echo "  $WT: CONFLICT - 手動解決が必要"
    if [ "$STASHED" = true ]; then
      echo "  $WT: stash saved as $STASH_ID"
    fi
  fi
done

cd "$ROOT" && git worktree list
