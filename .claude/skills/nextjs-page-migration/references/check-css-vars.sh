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

# CSS コメント (/* ... */) を空白へ潰す。複数行コメントも跨いで除去する。
# strip_css_comments removes CSS comments from the specified file and writes the resulting content to standard output.
strip_css_comments() {
  awk '
    {
      line = $0
      out = ""
      while (length(line) > 0) {
        if (incomment) {
          p = index(line, "*/")
          if (p == 0) { line = "" }
          else { incomment = 0; line = substr(line, p + 2) }
        } else {
          p = index(line, "/*")
          if (p == 0) { out = out line; line = "" }
          else { out = out substr(line, 1, p - 1) " "; line = substr(line, p + 2); incomment = 1 }
        }
      }
      print out
    }
  ' "$1"
}

# カスタムプロパティの「定義」だけを抽出する。
# 行頭アンカーだけだと `.layout { --x: 1px; }` のような同一行宣言を取りこぼすため、
# 宣言境界 ({ } ;) で改行へ割ってから宣言の先頭として現れる --name: を拾う。
# extract_var_declarations extracts unique CSS custom-property names declared in a CSS file and writes them to stdout.
extract_var_declarations() {
  strip_css_comments "$1" | tr '{};' '\n\n\n' \
    | { grep -oE '^[[:space:]]*--[a-zA-Z0-9_-]+[[:space:]]*:' || true; } \
    | sed -E 's/^[[:space:]]*(--[a-zA-Z0-9_-]+)[[:space:]]*:/\1/' | sort -u
}

# page.module.css 内で定義されているローカル変数を抽出
# ローカル変数が 1 件も無い page.module.css でも grep の exit 1 で止まらないようにする。
local_vars=$(extract_var_declarations "$css_file")

# globals.css 側も同じ抽出器に通す。生の grep だとコメント内の記述まで拾ってしまう。
globals_vars=$(extract_var_declarations "$globals_css")

# `var(--x, fallback)` は未定義でも fallback に解決されるため安全。
# フォールバックを持たない参照だけを検査対象にする。
undefined=0
for var in $( { grep -oE 'var\([[:space:]]*--[a-zA-Z0-9_-]+[[:space:]]*\)' "$css_file" || true; } \
  | sed -E 's/var\([[:space:]]*(--[a-zA-Z0-9_-]+)[[:space:]]*\)/\1/' | sort -u); do
  if printf '%s\n' "$local_vars" | grep -qxF -- "$var"; then continue; fi
  if printf '%s\n' "$font_vars" | grep -qxF -- "$var"; then continue; fi
  if printf '%s\n' "$globals_vars" | grep -qxF -- "$var"; then continue; fi
  echo "未定義の変数: $var"
  undefined=1
done

if [ "$undefined" -eq 0 ]; then
  echo "✅ 未定義の CSS 変数はありません: $css_file"
fi
exit "$undefined"
