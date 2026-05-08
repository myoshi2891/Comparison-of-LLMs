#!/usr/bin/env bash
# Stop hook: migration sync checker + token estimator (v2)
#
# 発火タイミング: 各 Claude 応答後（Stop イベント）
# 目的: /compact 前に MIGRATION_PROGRESS.md の更新が漏れないよう警告する
#
# トークン推定ロジック (v2):
#   - JSONL の最後の assistant メッセージから usage フィールドを読む
#     total_input = input_tokens + cache_creation_input_tokens + cache_read_input_tokens
#   - transcript_path が空/ファイル不在の場合、プロジェクトディレクトリの最新 JSONL にフォールバック
#   - v1 の "wc -c / 4" は JSON overhead 97.7% を無視しており最大44倍の誤差があった

# set -e を使わず個別エラーハンドリング（サイレント終了防止）
REPO="$(git rev-parse --show-toplevel 2>/dev/null)"
[ -z "$REPO" ] && exit 0

CONTEXT_LIMIT=200000
WARN_THRESHOLD=110000     # 55% — 早めに警告（更新作業後もバッファが十分残るよう）
CRITICAL_THRESHOLD=150000 # 75%
UPDATE_COST=8000           # MIGRATION_PROGRESS.md 更新作業の推定トークンコスト

# ── 1. transcript_path を stdin JSON から取得 ─────────────────────────
INPUT=$(cat 2>/dev/null || echo "")
TRANSCRIPT_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    print(json.load(sys.stdin).get('transcript_path', ''))
except Exception:
    print('')
" 2>/dev/null || echo "")

# フォールバック: transcript_path が空/不在の場合、assistant usage を含む最新 JSONL を検索
# サブエージェント/fork が生成するメタデータ専用 JSONL (assistant メッセージなし) を除外する
CLAUDE_PROJECT_DIR="$HOME/.claude/projects/$(echo "$REPO" | sed 's|/|-|g')"
if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
    TRANSCRIPT_PATH=$(python3 - "$CLAUDE_PROJECT_DIR" <<'PYEOF' 2>/dev/null || echo ""
import json, os, glob, sys
proj = sys.argv[1]
files = sorted(glob.glob(f'{proj}/*.jsonl'), key=os.path.getmtime, reverse=True)
for f in files:
    try:
        with open(f) as fh:
            for line in fh:
                try:
                    obj = json.loads(line)
                    msg = obj.get('message', {})
                    if msg.get('role') == 'assistant' and msg.get('usage'):
                        print(f)
                        sys.exit(0)
                except Exception:
                    pass
    except Exception:
        pass
PYEOF
)
fi

# ── 2. 実際の API トークン数を JSONL usage フィールドから取得 ─────────
ESTIMATED_TOKENS=0
if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
    ESTIMATED_TOKENS=$(python3 -c "
import json, sys
last_input = 0
try:
    with open(sys.argv[1]) as f:
        for line in f:
            try:
                obj = json.loads(line)
                msg = obj.get('message', {})
                if msg.get('role') == 'assistant':
                    usage = msg.get('usage', {})
                    if usage:
                        total = (usage.get('input_tokens', 0) +
                                 usage.get('cache_creation_input_tokens', 0) +
                                 usage.get('cache_read_input_tokens', 0))
                        if total > 0:
                            last_input = total
            except Exception:
                pass
except Exception:
    pass
print(last_input)
" "$TRANSCRIPT_PATH" 2>/dev/null || echo "0")
fi
REMAINING=$(( CONTEXT_LIMIT - ESTIMATED_TOKENS ))

# ── 3. 移行ブランチ以外はスキップ ────────────────────────────────────
cd "$REPO" 2>/dev/null || exit 0
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
if [[ "$BRANCH" != *"nextjs-migration"* ]]; then
    exit 0
fi

# ── 4. git ベースの同期状態チェック ─────────────────────────────────
LAST_CHANGED=$(git diff-tree --no-commit-id -r --name-only HEAD 2>/dev/null || echo "")
MIGRATION_IN_LAST=$(echo "$LAST_CHANGED" | grep -cE "^web-next/app/.+\.(tsx|css)$" 2>/dev/null || true)
PROGRESS_IN_LAST=$(echo "$LAST_CHANGED" | grep -c "MIGRATION_PROGRESS.md" 2>/dev/null || true)

# 未コミット移行ファイルの有無
DIRTY_MIGRATION=$(git status --porcelain 2>/dev/null | grep -cE "web-next/app/.+\.(tsx|css)$" 2>/dev/null || true)

NEEDS_SYNC=false
SYNC_DETAIL=""
if [ "${MIGRATION_IN_LAST:-0}" -gt 0 ]; then
    if [ "${PROGRESS_IN_LAST:-0}" -eq 0 ]; then
        NEEDS_SYNC=true
        SYNC_DETAIL="最終コミット: 移行ファイルあり / MIGRATION_PROGRESS.md 未更新"
    else
        PROGRESS_DIFF=$(git diff HEAD^ HEAD -- "$REPO/MIGRATION_PROGRESS.md" 2>/dev/null || \
                        git show HEAD -- "$REPO/MIGRATION_PROGRESS.md" 2>/dev/null || echo "")
        REQUIRED_FIELDS_UPDATED=0
        for marker in "最新 HEAD" "次の作業" "テスト数" "ビルド"; do
            if echo "$PROGRESS_DIFF" | grep -qE "^\+.*${marker}"; then
                REQUIRED_FIELDS_UPDATED=$(( REQUIRED_FIELDS_UPDATED + 1 ))
            fi
        done
        if [ "$REQUIRED_FIELDS_UPDATED" -eq 0 ]; then
            NEEDS_SYNC=true
            SYNC_DETAIL="最終コミット: MIGRATION_PROGRESS.md に必須フィールド（最新 HEAD / 次の作業 / テスト数 / ビルド）の更新なし"
        fi
    fi
fi
if [ "${DIRTY_MIGRATION:-0}" -gt 0 ]; then
    NEEDS_SYNC=true
    SYNC_DETAIL="${SYNC_DETAIL:+$SYNC_DETAIL | }未コミット移行ファイル: ${DIRTY_MIGRATION} 件"
fi

# ── 5. アラートレベルの判定 ──────────────────────────────────────────
if [ "$NEEDS_SYNC" = true ] && [ "$ESTIMATED_TOKENS" -gt "$WARN_THRESHOLD" ]; then
    LEVEL="CRITICAL"   # 同期未完了 + tokens高 → 即時対応必須
elif [ "$NEEDS_SYNC" = true ] && [ "$ESTIMATED_TOKENS" -gt 60000 ]; then
    LEVEL="WARNING"
elif [ "$NEEDS_SYNC" = true ]; then
    LEVEL="INFO"
elif [ "$ESTIMATED_TOKENS" -gt "$CRITICAL_THRESHOLD" ]; then
    LEVEL="TOKEN_HIGH_CRITICAL"
elif [ "$ESTIMATED_TOKENS" -gt "$WARN_THRESHOLD" ]; then
    LEVEL="TOKEN_HIGH_WARNING"
elif [ "$ESTIMATED_TOKENS" -gt 80000 ]; then
    LEVEL="TOKEN_MEDIUM"  # 同期済み + 80K超 — 早期通知
else
    exit 0
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
    TOKEN_HIGH_CRITICAL)
        echo ""
        echo "🔴 TOKEN ALERT ─────────────────────────────────────────────────────"
        echo "   コンテキスト使用量が上限に近づいています（MIGRATION_PROGRESS.md は同期済み）"
        if [ -n "$TOKEN_LINE" ]; then
            echo "   ${TOKEN_LINE}"
        fi
        echo "   新セッションへの移行を検討してください（更新作業は不要）"
        echo "────────────────────────────────────────────────────────────────────"
        ;;
    TOKEN_HIGH_WARNING)
        echo ""
        echo "🟡 TOKEN WARNING ───────────────────────────────────────────────────"
        echo "   コンテキスト使用量が増加しています（MIGRATION_PROGRESS.md は同期済み）"
        if [ -n "$TOKEN_LINE" ]; then
            echo "   ${TOKEN_LINE}"
        fi
        echo "────────────────────────────────────────────────────────────────────"
        ;;
    TOKEN_MEDIUM)
        echo ""
        echo "💭 TOKEN NOTICE ─ ${TOKEN_LINE}"
        ;;
esac

exit 0
