#!/usr/bin/env bash
# Stop hook: migration sync checker + token estimator
#
# 発火タイミング: 各 Claude 応答後（Stop イベント）
# 目的: /compact 前に MIGRATION_PROGRESS.md の更新が漏れないよう警告する
#
# 推定ロジック:
#   - transcript_path のファイルサイズ ÷ 4 ≈ 使用トークン数
#   - コンテキスト上限: 200,000 tokens (Sonnet 4.6 / Opus 4.7 共通)
#   - MIGRATION_PROGRESS.md 更新に必要な推定トークン: 8,000 tokens
#     （ファイル読み込み + build/test コマンド出力 + 編集 + コミット）

set -euo pipefail

# リポジトリルートを動的に取得（ハードコードなし → commit 可能）
REPO="$(git rev-parse --show-toplevel 2>/dev/null)"
[ -z "$REPO" ] && exit 0

CONTEXT_LIMIT=200000
WARN_THRESHOLD=140000     # 70%: 警告開始
CRITICAL_THRESHOLD=175000 # 87.5%: 緊急
UPDATE_COST=8000           # 更新作業の推定トークンコスト

# ── 1. transcript_path を stdin JSON から取得 ─────────────────────────
INPUT=$(cat)
TRANSCRIPT_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    print(json.load(sys.stdin).get('transcript_path', ''))
except Exception:
    print('')
" 2>/dev/null || echo "")

# ── 2. トークン使用量の推定（ファイルサイズ ÷ 4）──────────────────────
ESTIMATED_TOKENS=0
if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
    CHAR_COUNT=$(wc -c < "$TRANSCRIPT_PATH" | tr -d ' ')
    ESTIMATED_TOKENS=$(( CHAR_COUNT / 4 ))
fi
REMAINING=$(( CONTEXT_LIMIT - ESTIMATED_TOKENS ))

# ── 3. 移行ブランチ以外はスキップ ────────────────────────────────────
cd "$REPO" 2>/dev/null || exit 0
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
if [[ "$BRANCH" != *"nextjs-migration"* ]]; then
    exit 0
fi

# ── 4. git ベースの同期状態チェック ─────────────────────────────────
# 最終コミット: 移行ファイルあり かつ MIGRATION_PROGRESS.md なし → 未同期
LAST_CHANGED=$(git diff-tree --no-commit-id -r --name-only HEAD 2>/dev/null || echo "")
# grep -c は0件でも "0" を stdout に出力して exit 1 → || echo "0" だと "0\n0" になる
# || true で exit code だけ握りつぶし、stdout は grep の "0" をそのまま使う
MIGRATION_IN_LAST=$(echo "$LAST_CHANGED" | grep -cE "^web-next/app/.+\.(tsx|css)$" 2>/dev/null || true)
PROGRESS_IN_LAST=$(echo "$LAST_CHANGED" | grep -c "MIGRATION_PROGRESS.md" 2>/dev/null || true)

# 未コミット移行ファイルの有無
DIRTY_MIGRATION=$(git status --porcelain 2>/dev/null | grep -cE "web-next/app/.+\.(tsx|css)$" 2>/dev/null || true)

NEEDS_SYNC=false
SYNC_DETAIL=""
if [ "${MIGRATION_IN_LAST:-0}" -gt 0 ] && [ "${PROGRESS_IN_LAST:-0}" -eq 0 ]; then
    NEEDS_SYNC=true
    SYNC_DETAIL="最終コミット: 移行ファイルあり / MIGRATION_PROGRESS.md 未更新"
fi
if [ "${DIRTY_MIGRATION:-0}" -gt 0 ]; then
    NEEDS_SYNC=true
    SYNC_DETAIL="${SYNC_DETAIL:+$SYNC_DETAIL | }未コミット移行ファイル: ${DIRTY_MIGRATION} 件"
fi

# ── 5. アラートレベルの判定 ──────────────────────────────────────────
# CRITICAL: (tokens > 175K) または (未同期 かつ tokens > 140K)
# WARNING:  (tokens > 140K) または (未同期 かつ tokens > 80K)
# INFO:     未同期のみ（tokens 低い）
# NONE:     同期済み かつ tokens 低い → 何も出力しない

if [ "$ESTIMATED_TOKENS" -gt "$CRITICAL_THRESHOLD" ] || \
   { [ "$NEEDS_SYNC" = true ] && [ "$ESTIMATED_TOKENS" -gt "$WARN_THRESHOLD" ]; }; then
    LEVEL="CRITICAL"
elif [ "$ESTIMATED_TOKENS" -gt "$WARN_THRESHOLD" ] || \
     { [ "$NEEDS_SYNC" = true ] && [ "$ESTIMATED_TOKENS" -gt 80000 ]; }; then
    LEVEL="WARNING"
elif [ "$NEEDS_SYNC" = true ]; then
    LEVEL="INFO"
else
    exit 0  # 何も出力しない
fi

# ── 6. 警告メッセージの出力 ──────────────────────────────────────────
TOKEN_LINE=""
if [ "$ESTIMATED_TOKENS" -gt 0 ]; then
    PCT=$(( ESTIMATED_TOKENS * 100 / CONTEXT_LIMIT ))
    TOKEN_LINE="トークン: ~${ESTIMATED_TOKENS} / ${CONTEXT_LIMIT} (${PCT}%)  残り: ~${REMAINING}"
fi

SAFE_REMAINING=$(( REMAINING - UPDATE_COST ))

case "$LEVEL" in
    CRITICAL)
        echo ""
        echo "🔴 MIGRATION ALERT ─────────────────────────────────────────────────"
        echo "   /compact 前に MIGRATION_PROGRESS.md の更新が必須です！"
        if [ -n "$TOKEN_LINE" ]; then
            echo "   ${TOKEN_LINE}"
        fi
        if [ "$SAFE_REMAINING" -lt 0 ]; then
            echo "   ⚡ 更新作業後の残りトークン: ~${SAFE_REMAINING} (マイナス — 即時更新を)"
        else
            echo "   更新後の残り推定: ~${SAFE_REMAINING} tokens"
        fi
        if [ -n "$SYNC_DETAIL" ]; then
            echo "   同期状態: ❌ ${SYNC_DETAIL}"
        fi
        echo "────────────────────────────────────────────────────────────────────"
        ;;
    WARNING)
        echo ""
        echo "🟡 MIGRATION WARNING ───────────────────────────────────────────────"
        echo "   MIGRATION_PROGRESS.md の更新タイミングを検討してください"
        if [ -n "$TOKEN_LINE" ]; then
            echo "   ${TOKEN_LINE}"
        fi
        if [ -n "$SYNC_DETAIL" ]; then
            echo "   同期状態: ❌ ${SYNC_DETAIL}"
        fi
        echo "   更新後の残り推定: ~${SAFE_REMAINING} tokens"
        echo "────────────────────────────────────────────────────────────────────"
        ;;
    INFO)
        echo ""
        echo "⚠️  MIGRATION NOTICE ─ MIGRATION_PROGRESS.md 未同期"
        if [ -n "$SYNC_DETAIL" ]; then
            echo "   ${SYNC_DETAIL}"
        fi
        if [ -n "$TOKEN_LINE" ]; then
            echo "   ${TOKEN_LINE}"
        fi
        ;;
esac

exit 0
