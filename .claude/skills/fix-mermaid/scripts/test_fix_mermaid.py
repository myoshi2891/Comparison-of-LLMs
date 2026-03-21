"""fix_mermaid_blocks の回帰テスト."""

from fix_mermaid import fix_mermaid_blocks


def test_sequence_rejoin():
    """HTML フォーマッターで分割された sequenceDiagram 行が結合される."""
    html = (
        '<div class="mermaid">\n'
        "    sequenceDiagram\n"
        "    participant A\n"
        "    Note over A,B:\n"
        "        some message\n"
        "    A->>B: hello\n"
        "</div>"
    )
    fixed, report = fix_mermaid_blocks(html)

    # continuation-join: "Note over A,B:" + "some message" が1行に結合
    assert "Note over A,B: some message" in fixed
    # 各行のインデントが除去されている
    assert "    sequenceDiagram" not in fixed
    assert "sequenceDiagram" in fixed
    # report に modification エントリが含まれる
    assert len(report) == 1
    assert "modified" in report[0]
    assert "sequenceDiagram" in report[0]


def test_mindmap_indent_preserved():
    """mindmap のインデントが保持され、不正な結合が起きない."""
    html = (
        '<div class="mermaid">\n'
        "    mindmap\n"
        "      root((Title))\n"
        "        Child1\n"
        "          Grandchild1\n"
        "        Child2\n"
        "</div>"
    )
    fixed, report = fix_mermaid_blocks(html)

    # インデントが元のまま保持されている
    assert "      root((Title))" in fixed
    assert "        Child1" in fixed
    assert "          Grandchild1" in fixed
    assert "        Child2" in fixed
    # 子ノードが親に結合されていない
    assert "root((Title))Child1" not in fixed
    assert "Child1Grandchild1" not in fixed
    # mindmap は変更なし → report が空
    assert report == []


def test_div_class_matching():
    """class 属性に追加トークンがあってもブロックが検出・処理される."""
    html = (
        '<div class="foo mermaid bar">\n'
        "    graph TD\n"
        "    A --> B\n"
        "</div>"
    )
    fixed, report = fix_mermaid_blocks(html)

    # ブロックが検出されインデント除去が行われた
    assert "graph TD" in fixed
    assert "    graph TD" not in fixed
    assert "A --> B" in fixed
    assert "    A --> B" not in fixed
    # report にエントリがある
    assert len(report) == 1
    assert "modified" in report[0]