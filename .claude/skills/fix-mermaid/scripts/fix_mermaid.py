"""
Mermaid v10 インデント修正スクリプト

HTML ファイルのすべての <div class="mermaid"> ブロックを一括検査・修正する。
mindmap は内部インデントを保持（階層構造が構文上の意味を持つため）。

使い方:
    python3 fix_mermaid.py path/to/your-file.html
"""

import re
import sys


def fix_mermaid_blocks(html: str) -> tuple[str, list[str]]:
    report: list[str] = []

    # 新しい Mermaid ステートメントの開始パターン
    _new_stmt_re = re.compile(
        r'^(\w+\s*-[->.>]|Note\b|participant\b|actor\b|alt\b|else\b'
        r'|opt\b|loop\b|rect\b|par\b|end\b|%%|activate\b|deactivate\b'
        r'|subgraph\b|style\b|classDef\b|linkStyle\b)',
        re.IGNORECASE,
    )
    # 前行が未完了のシーケンス図フラグメント
    _seq_frag_re = re.compile(
        r'^(Note\s+(over|left\s+of|right\s+of)\b'
        r'|participant\b|actor\b|alt\b|loop\b|rect\b)',
        re.IGNORECASE,
    )

    def fix_block(m: re.Match[str]) -> str:
        open_tag = m.group(1)
        inner = m.group(2)
        close_tag = m.group(3)
        raw_lines = inner.split("\n")

        # 最初の非空行でダイアグラム種別を判定
        diagram_type = next((line.strip() for line in raw_lines if line.strip()), "")
        is_mindmap = diagram_type.startswith("mindmap")

        fixed: list[str] = []
        fixed_count = 0

        for ln in raw_lines:
            stripped = ln.lstrip()
            leading = len(ln) - len(stripped)
            if leading > 0 and stripped:
                if is_mindmap:
                    # mindmap: インデントは Mermaid 構文なので保持
                    fixed.append(ln)
                else:
                    # HTML フォーマッターによる行分割の検出・結合
                    prev = fixed[-1].rstrip() if fixed else ""
                    is_cont = (
                        prev.endswith(':')
                        or _seq_frag_re.match(prev)
                    ) and not _new_stmt_re.match(stripped)

                    if is_cont and fixed:
                        fixed[-1] = prev + ' ' + stripped
                    else:
                        fixed.append(stripped)
                    fixed_count += 1
            else:
                fixed.append(ln)

        if fixed_count > 0:
            report.append(
                f"[{diagram_type}]: {fixed_count} line(s) de-indented"
            )

        return open_tag + "\n".join(fixed) + close_tag

    # class 属性に "mermaid" トークンを含む <div> を柔軟にマッチ
    # （属性順序・引用符の違い・追加クラスに対応）
    fixed_html = re.sub(
        r'(<div\b[^>]*\bclass\s*=\s*'
        r"""(?:"[^"]*\bmermaid\b[^"]*"|'[^']*\bmermaid\b[^']*'"""
        r'|[^\s>]*\bmermaid\b[^\s>]*)'
        r'[^>]*>)(.*?)(</div>)',
        fix_block,
        html,
        flags=re.DOTALL | re.IGNORECASE,
    )
    return fixed_html, report


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 fix_mermaid.py <html-file>")
        sys.exit(1)

    path = sys.argv[1]
    with open(path, encoding="utf-8") as f:
        html = f.read()

    fixed, report = fix_mermaid_blocks(html)

    if report:
        for line in report:
            print(line)
        with open(path, "w", encoding="utf-8") as f:
            f.write(fixed)
        print(f"\n✅ Fixed and saved: {path}")
    else:
        print("✅ No indentation issues found.")
