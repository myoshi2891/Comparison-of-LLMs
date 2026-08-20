#!/usr/bin/env bash
# page.module.css が参照する CSS カスタムプロパティのうち、
# ローカル (.layout 等) にも globals.css にも定義されていないものを列挙する。
#
# 未定義変数は `bun run build` を通過してしまうが、実行時に空文字へ解決されて
# 配色が全崩壊する無音バグになる。Green コミット前に必ず通すこと。
#
# 使い方:
#   bash .claude/skills/nextjs-page-migration/references/check-css-vars.sh \
#     web-next/app/<provider>/<slug>/page.module.css
#
# 終了コード: 0 = 未定義なし / 1 = 未定義あり / 2 = 引数エラー
set -euo pipefail

css_file=${1:-}
if [ -z "$css_file" ] || [ ! -f "$css_file" ]; then
  echo "Usage: $0 <path-to-page.module.css>" >&2
  exit 2
fi

repo_root=$(git rev-parse --show-toplevel)
globals_css="$repo_root/web-next/app/globals.css"
fonts_ts="$repo_root/web-next/lib/fonts.ts"
if [ ! -f "$globals_css" ]; then
  echo "globals.css が見つかりません: $globals_css" >&2
  exit 2
fi

# next/font が html 要素へ注ぐフォント変数 (--font-mono / --font-display 等) は
# globals.css には現れないため、lib/fonts.ts の variable 宣言も定義済みとして扱う。
font_vars=""
if [ -f "$fonts_ts" ]; then
  # grep はマッチ 0 件で exit 1 を返す。pipefail 下では代入自体が失敗し
  # set -e でスクリプトが無言終了するため、|| true で握らずに空文字へ落とす。
  font_vars=$( { grep -oE 'variable:[[:space:]]*"--[a-zA-Z0-9_-]+"' "$fonts_ts" || true; } \
    | sed -E 's/.*"(--[a-zA-Z0-9_-]+)"/\1/' | sort -u)
fi

# page.module.css 内で定義されているローカル変数を抽出
# ローカル変数が 1 件も無い page.module.css でも grep の exit 1 で止まらないようにする。
local_vars=$( { grep -oE '^[[:space:]]*--[a-zA-Z0-9_-]+[[:space:]]*:' "$css_file" || true; } \
  | sed -E 's/^[[:space:]]*(--[a-zA-Z0-9_-]+)[[:space:]]*:/\1/' | sort -u)

# `var(--x, fallback)` は未定義でも fallback に解決されるため安全。
# フォールバックを持たない参照だけを検査対象にする。
undefined=0
for var in $( { grep -oE 'var\([[:space:]]*--[a-zA-Z0-9_-]+[[:space:]]*\)' "$css_file" || true; } \
  | sed -E 's/var\([[:space:]]*(--[a-zA-Z0-9_-]+)[[:space:]]*\)/\1/' | sort -u); do
  if printf '%s\n' "$local_vars" | grep -qxF -- "$var"; then continue; fi
  if printf '%s\n' "$font_vars" | grep -qxF -- "$var"; then continue; fi
  if grep -qE -- "${var}[[:space:]]*:" "$globals_css"; then continue; fi
  echo "未定義の変数: $var"
  undefined=1
done

if [ "$undefined" -eq 0 ]; then
  echo "✅ 未定義の CSS 変数はありません: $css_file"
fi
exit "$undefined"
