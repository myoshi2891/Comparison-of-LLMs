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

    def fix_block(m: re.Match[str]) -> str:
        open_tag = m.group(1)
        inner = m.group(2)
        close_tag = m.group(3)
        raw_lines = inner.split("\n")

        # 最初の非空行でダイアグラム種別を判定
        diagram_type = next((l.strip() for l in raw_lines if l.strip()), "")
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
