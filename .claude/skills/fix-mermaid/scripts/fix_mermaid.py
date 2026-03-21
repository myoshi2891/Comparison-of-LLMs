"""
Mermaid v10 インデント修正スクリプト

HTML ファイルのすべての <div class="mermaid"> ブロックを一括検査・修正する。
mindmap は内部インデントを保持 (階層構造が構文上の意味を持つため)。

使い方:
    python3 fix_mermaid.py path/to/your-file.html
"""

import re
import sys

# 新しい Mermaid ステートメントの開始パターン (モジュールロード時に1度だけコンパイル)
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


def fix_mermaid_blocks(html: str) -> tuple[str, list[str]]:
    """
    Normalize and fix indentation and wrapped-line formatting inside Mermaid `<div class="mermaid">` blocks found in an HTML string.
    
    Processes each `<div>` whose `class` attribute contains the `mermaid` token: normalizes line endings, preserves indentation for `mindmap*` diagrams, removes unintended leading indentation for other diagram types, and merges lines that are continuations of a previous statement (e.g., sequence diagram fragments where a previous line ends with `:` or is an incomplete fragment). Tracks per-block modification counts and returns both the updated HTML and a report of changes.
    
    Parameters:
        html (str): The input HTML content to scan and fix.
    
    Returns:
        tuple[str, list[str]]: A pair where the first element is the possibly modified HTML string and the second is a list of report lines (one per modified Mermaid block) describing the diagram type and number of lines changed; the report list is empty if no changes were made.
    """
    report: list[str] = []

    def fix_block(m: re.Match[str]) -> str:
        """
        Process a matched Mermaid <div> block and return a reconstructed block with normalized and fixed inner lines.
        
        The function normalizes line endings for the block's inner content, determines the diagram type from the first non-empty, non-`%%` line, and repairs broken line indentation/wrapping inside the Mermaid source:
        - For diagram types whose first line starts with `mindmap` (case-insensitive), inner line indentation is preserved.
        - For other diagrams, leading indentation is removed from wrapped lines and lines that are continuation fragments (e.g., when the previous logical line ends with `:` or is an incomplete sequence fragment) are joined into the previous line, while avoiding joins that would start a new Mermaid statement.
        If any lines are changed, a report entry describing the diagram type and number of modified lines is appended to the module-level `report` list.
        
        Parameters:
            m (re.Match[str]): A regex match with three capture groups: the opening `<div ...>` tag, the inner content of the div, and the closing `</div>` tag.
        
        Returns:
            str: The reconstructed full `<div>` block (opening tag + fixed inner content + closing tag).
        """
        open_tag = m.group(1)
        inner = m.group(2)
        close_tag = m.group(3)
        raw_lines = inner.replace("\r\n", "\n").replace("\r", "\n").split("\n")

        # 最初の非空・非ディレクティブ行でダイアグラム種別を判定
        # %%{init...}%% 等のディレクティブ/コメント行はスキップ
        diagram_type = next(
            (line.strip() for line in raw_lines
             if line.strip() and not line.strip().startswith("%%")),
            "",
        )
        is_mindmap = diagram_type.lower().startswith("mindmap")

        fixed: list[str] = []
        fixed_count = 0

        for ln in raw_lines:
            stripped = ln.lstrip()
            leading = len(ln) - len(stripped)
            if leading > 0 and stripped:
                # HTML フォーマッターによる行分割の検出・結合
                prev = fixed[-1].rstrip() if fixed else ""
                # _seq_frag_re は「未完了」のフラグメントのみ対象
                # 例: "Note over A,B:" (未完了) vs "Note over A,B: msg" (完了)
                frag_match = _seq_frag_re.match(prev)
                is_incomplete_frag = bool(
                    frag_match and not re.search(r':\s*\S', prev)
                )
                is_cont = (
                    prev.endswith(':')
                    or is_incomplete_frag
                ) and not _new_stmt_re.match(stripped)

                changed = False
                if is_cont and fixed:
                    fixed[-1] = prev + ' ' + stripped
                    changed = True
                elif is_mindmap:
                    # mindmap: インデントは Mermaid 構文なので保持
                    fixed.append(ln)
                else:
                    fixed.append(stripped)
                    changed = True
                if changed:
                    fixed_count += 1
            else:
                fixed.append(ln)

        if fixed_count > 0:
            report.append(
                f"[{diagram_type}]: {fixed_count} line(s) modified"
            )

        return open_tag + "\n".join(fixed) + close_tag

    # class 属性に "mermaid" トークンを含む <div> を柔軟にマッチ
    # (属性順序・引用符の違い・追加クラスに対応)
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
    try:
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
            print("✅ No Mermaid formatting issues found.")
    except (OSError, UnicodeError) as e:
        print(f"❌ Error processing {path}: {e}", file=sys.stderr)
        sys.exit(1)
