// @vitest-environment jsdom
import { spawnSync } from "node:child_process";
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Page from "./page";

vi.mock("@/components/docs/MermaidDiagram", () => ({ default: () => null }));
vi.mock("./TocObserver", () => ({ default: () => null }));
afterEach(cleanup);

function examples() {
  const { container } = render(<Page />);
  return Array.from(container.querySelectorAll("pre code"), (e) => e.textContent ?? "");
}
function python(program: string, input: unknown) {
  // -E: PYTHON* 環境変数（PYTHONOPTIMIZE 等）を無視し、assert を常に有効にする。
  const result = spawnSync("python3", ["-E", "-c", program], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  expect(result.error).toBeUndefined();
  expect(result.stderr).toBe("");
  expect(result.status).toBe(0);
}

it("表示した費用関数がTTL別に課金し、未定義モードのキャッシュ使用量を拒否する", () => {
  python(
    `
import ast, json, math, sys
codes = json.load(sys.stdin)
scope = {}
for code in codes:
    if "def usd(" not in code and "def estimate_usd(" not in code:
        continue
    nodes = [n for n in ast.parse(code).body if
        isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id in ("PRICE", "RATES") for t in n.targets)
        or isinstance(n, ast.FunctionDef) and n.name in ("usd", "estimate_usd")]
    exec(compile(ast.Module(body=nodes, type_ignores=[]), "example", "exec"), scope)
usage = {"input_tokens": 50000, "output_tokens": 30000, "cache_read_input_tokens": 150000,
    "cache_creation_input_tokens": 30000,
    "cache_creation": {"ephemeral_5m_input_tokens": 10000, "ephemeral_1h_input_tokens": 20000}}
for name in ("usd", "estimate_usd"):
    assert math.isclose(scope[name](usage), 2.05), name
    assert scope[name]({}) == 0
    for ttl, price in (("5m", 10), ("1h", 16)):
        assert scope[name]({"cache_creation_input_tokens": 1000000,
            "cache_creation": {"ephemeral_" + ttl + "_input_tokens": 1000000}}) == price
    # 集計値のみ・内訳が一部のみの場合も、残りを既定の5分書き込み単価で課金する
    assert scope[name]({"cache_creation_input_tokens": 1000000}) == 10
    assert math.isclose(scope[name]({"cache_creation_input_tokens": 1000000, "cache_creation": {
        "ephemeral_5m_input_tokens": 200000, "ephemeral_1h_input_tokens": 300000}}), 11.8)
    assert math.isclose(scope[name]({"cache_creation_input_tokens": 100000, "cache_creation": {
        "ephemeral_5m_input_tokens": 200000, "ephemeral_1h_input_tokens": 300000}}), 6.8)
# batch・fast も公式の倍率(5分書込 1.25x・1時間書込 2x・読取 0.025x)を各モードの入力単価へ重ねて課金する。
for mode, price, read, w5, w1 in (("batch", 24, 0.10, 5, 8), ("fast", 96, 0.40, 20, 32)):
    assert scope["estimate_usd"]({"input_tokens": 1000000, "output_tokens": 1000000}, mode) == price
    assert math.isclose(scope["estimate_usd"]({"cache_read_input_tokens": 1000000}, mode), read), mode
    for ttl, rate in (("5m", w5), ("1h", w1)):
        assert math.isclose(scope["estimate_usd"]({"cache_creation_input_tokens": 1000000,
            "cache_creation": {"ephemeral_" + ttl + "_input_tokens": 1000000}}, mode), rate), (mode, ttl)
    assert math.isclose(scope["estimate_usd"]({"cache_creation_input_tokens": 1000000}, mode), w5), mode
# キャッシュ単価を設定していないモードは、キャッシュ使用量を推測で課金せず拒否する。
scope["RATES"]["unconfigured"] = {"in": 1.0, "out": 2.0}
assert scope["estimate_usd"]({"input_tokens": 1000000}, "unconfigured") == 1
for cached in ({"cache_read_input_tokens": 1}, {"cache_creation_input_tokens": 1},
    {"cache_creation": {"ephemeral_5m_input_tokens": 1}}, {"cache_creation": {"ephemeral_1h_input_tokens": 1}}):
    try:
        scope["estimate_usd"](cached, "unconfigured")
    except ValueError:
        pass
    else:
        raise AssertionError(cached)
for usage, price in (
    ({"cache_creation_input_tokens": 1000000}, 10),
    ({"cache_creation_input_tokens": 1000000, "cache_creation": {}}, 10),
    ({"cache_creation_input_tokens": 1000000, "cache_creation": {
        "ephemeral_5m_input_tokens": 200000, "ephemeral_1h_input_tokens": 300000}}, 11.8),
    ({"cache_creation_input_tokens": 100000, "cache_creation": {
        "ephemeral_5m_input_tokens": 200000, "ephemeral_1h_input_tokens": 300000}}, 6.8),
    ({"cache_creation": {"ephemeral_5m_input_tokens": 200000,
        "ephemeral_1h_input_tokens": 300000}, "cache_read_input_tokens": 1000000}, 7),
):
    assert math.isclose(scope["estimate_usd"](usage), price), (usage, price)
`,
    examples()
  );
});

it("agent_loopはpause_turnの履歴をそのまま再送し、他の終了理由は返す", () => {
  python(
    `
import ast, copy, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
for reason in ("end_turn", "refusal", "max_tokens"):
    requests = []
    paused = {"stop_reason": "pause_turn", "content": [{"type": "server_tool_use", "id": "s1", "name": "search", "input": {}}, {"type": "thinking", "signature": "kept"}]}
    done = {"stop_reason": reason, "content": [{"type": "text", "text": "done"}]}
    def call(body):
        requests.append(copy.deepcopy(body))
        return paused if len(requests) == 1 else done
    def run_tool(*args):
        raise AssertionError("pause_turn must not execute client tools")
    scope = {"call": call, "copy": __import__("copy")}
    exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
    assert scope["agent_loop"]("task", [], run_tool, max_turns=2) is done
    assert requests[1]["messages"] == [{"role": "user", "content": "task"}, {"role": "assistant", "content": paused["content"]}]
`,
    examples()
  );
});

it("agent_loopはpause_turnを次のAPI失敗前に保存し、同じ履歴で再開する", () => {
  python(
    `
import ast, copy, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
paused = {"stop_reason": "pause_turn", "content": [{"type": "thinking", "signature": "kept"}]}
done = {"stop_reason": "end_turn", "content": []}
checkpoint, requests = {}, []
def call(body):
    requests.append(copy.deepcopy(body))
    if len(requests) == 1:
        return paused
    if len(requests) == 2:
        assert checkpoint["messages"] == body["messages"]
        raise RuntimeError("API failed")
    return done
scope = {"call": call, "copy": __import__("copy")}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
try:
    scope["agent_loop"]("task", [], None, max_turns=2, checkpoint=checkpoint)
except RuntimeError as error:
    assert str(error) == "API failed"
else:
    raise AssertionError("expected API failure")
assert checkpoint["messages"] == [{"role": "user", "content": "task"}, {"role": "assistant", "content": paused["content"]}]
assert checkpoint["messages"][-1]["content"] is paused["content"]
assert scope["agent_loop"]("task", [], None, max_turns=1, checkpoint=checkpoint) is done
assert requests[1]["messages"] == requests[2]["messages"]
`,
    examples()
  );
});

it("agent_loopの各リクエストがトップレベルのキャッシュを有効にする", () => {
  python(
    `
import ast, copy, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
requests = []
def call(body):
    requests.append(copy.deepcopy(body))
    return {"stop_reason": "end_turn", "content": []}
scope = {"call": call, "copy": copy}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
scope["agent_loop"]("task", [], None)
assert len(requests) == 1
assert requests[0]["cache_control"] == {"type": "ephemeral"}
assert requests[0]["max_tokens"] == 32_000
assert "container" not in requests[0]
`,
    examples()
  );
});

it("agent_loopは上限時にtool_result込みの履歴を保存し、重複実行せず再開できる", () => {
  python(
    `
import ast, copy, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
requests, executed = [], []
tool = {"type": "tool_use", "id": "tool-1", "name": "read", "input": {"path": "a.py"}}
thinking = {"type": "thinking", "thinking": "", "signature": "kept"}
reply = {"stop_reason": "tool_use", "content": [thinking, tool]}
done = {"stop_reason": "end_turn", "content": [{"type": "text", "text": "done"}]}
def call(body):
    requests.append(copy.deepcopy(body))
    return reply if len(requests) == 1 else done
def run_tool(name, args):
    executed.append((name, args))
    return "file content"
scope = {"call": call, "copy": __import__("copy")}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
checkpoint = {}
try:
    scope["agent_loop"]("task", [], run_tool, max_turns=1, checkpoint=checkpoint)
except RuntimeError as error:
    assert str(error) == "max_turns に到達しました"
else:
    raise AssertionError("turn limit must raise")
expected = [{"role": "user", "content": "task"},
    {"role": "assistant", "content": [thinking, tool]},
    {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "tool-1", "content": "file content"}]}]
assert checkpoint["messages"] == expected
assert len(requests) == 1
assert scope["agent_loop"]("task", [], run_tool, max_turns=1, checkpoint=checkpoint) == done
assert requests[1]["messages"] == expected
assert executed == [("read", {"path": "a.py"})]
zero = {}
try:
    scope["agent_loop"]("zero", [], run_tool, max_turns=0, checkpoint=zero)
except RuntimeError:
    pass
else:
    raise AssertionError("zero turn limit must raise")
assert zero == {"messages": [{"role": "user", "content": "zero"}]}
assert len(requests) == 2
`,
    examples()
  );
});

it("agent_loopはツールへ入力の独立したコピーを渡し、保存するassistant内容を変更させない", () => {
  python(
    `
import ast, copy, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
tool = {"type": "tool_use", "id": "tool-1", "name": "read", "input": {"path": "a.py", "opts": {"lines": [1]}}}
reply = {"stop_reason": "tool_use", "content": [tool]}
done = {"stop_reason": "end_turn", "content": [{"type": "text", "text": "done"}]}
requests = []
def call(body):
    requests.append(copy.deepcopy(body))
    return reply if len(requests) == 1 else done
received = []
def run_tool(name, args):
    received.append(args)
    args["path"] = "changed.py"          # コールバックが入力を書き換えても
    args["opts"]["lines"].append(99)     # 入れ子まで含めて履歴へ波及しない
    return "ok"
scope = {"call": call, "copy": __import__("copy")}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
checkpoint = {}
assert scope["agent_loop"]("task", [], run_tool, max_turns=2, checkpoint=checkpoint) == done
assistant = checkpoint["messages"][1]["content"][0]
assert assistant["input"] == {"path": "a.py", "opts": {"lines": [1]}}
assert requests[1]["messages"][1]["content"][0]["input"] == {"path": "a.py", "opts": {"lines": [1]}}
assert received[0] is not tool["input"]
`,
    examples()
  );
});

it("agent_loopはツール結果を独立したコピーで保存し、後の呼び出しで前の結果を変更させない", () => {
  python(
    `
import ast, copy, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
def tool(n):
    return {"type": "tool_use", "id": "tool-" + str(n), "name": "read", "input": {"n": n}}
replies = [{"stop_reason": "tool_use", "content": [tool(1), tool(2), tool(3)]},
    {"stop_reason": "end_turn", "content": [{"type": "text", "text": "done"}]}]
requests = []
def call(body):
    requests.append(copy.deepcopy(body))
    return replies[len(requests) - 1]
shared = [{"type": "text", "text": "v1"}]
text = "plain text result"
def run_tool(name, args):
    if args["n"] == 3:
        return text
    shared[0]["text"] = "v" + str(args["n"])   # 共有オブジェクトを返し、次の呼び出しで書き換える
    return shared
scope = {"call": call, "copy": __import__("copy")}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
checkpoint = {}
assert scope["agent_loop"]("task", [], run_tool, max_turns=2, checkpoint=checkpoint) == replies[1]
results = checkpoint["messages"][2]["content"]
assert [r["content"] for r in results] == [[{"type": "text", "text": "v1"}], [{"type": "text", "text": "v2"}], text]
assert results[0]["content"] is not results[1]["content"]
assert results[2]["content"] is text
shared[0]["text"] = "mutated later"
assert results[0]["content"] == [{"type": "text", "text": "v1"}]
assert requests[1]["messages"][2]["content"][0]["content"] == [{"type": "text", "text": "v1"}]
`,
    examples()
  );
});

it("agent_loopはツールセットの結果にtoolset_nameを返し、失敗後の後続のコンピュータ操作を実行しない", () => {
  python(
    `
import ast, copy, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
def computer(n):
    return {"type": "tool_use", "id": "c" + str(n), "name": "click", "toolset_name": "computer", "input": {"n": n}}
custom = {"type": "tool_use", "id": "u1", "name": "read", "input": {"n": 0}}
replies = [{"stop_reason": "tool_use", "content": [computer(1), computer(2), custom, computer(3)]},
    {"stop_reason": "tool_use", "content": [computer(4), computer(5)]},
    {"stop_reason": "end_turn", "content": [{"type": "text", "text": "done"}]}]
requests, executed, names = [], [], []
def call(body):
    requests.append(copy.deepcopy(body))
    return replies[len(requests) - 1]
def run_tool(name, args):
    names.append(name)
    executed.append(args["n"])
    if args["n"] == 2:
        raise RuntimeError("click failed")
    return "ok " + str(args["n"])
scope = {"call": call, "copy": __import__("copy")}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
checkpoint = {}
assert scope["agent_loop"]("task", [], run_tool, max_turns=3, checkpoint=checkpoint) == replies[2]
# 失敗した操作より後のコンピュータ操作(3)は実行しないが、独立したカスタムツール(0)は実行する
assert executed == [1, 2, 0, 4, 5]
# ツールセットのメンバーは (toolset_name, name) で、通常のカスタムツールは name だけで振り分ける
assert names == [("computer", "click"), ("computer", "click"), "read", ("computer", "click"), ("computer", "click")]
first = checkpoint["messages"][2]["content"]
assert [r["tool_use_id"] for r in first] == ["c1", "c2", "u1", "c3"]
assert [r.get("toolset_name") for r in first] == ["computer", "computer", None, "computer"]
assert "toolset_name" not in first[2]
assert first[0] == {"type": "tool_result", "tool_use_id": "c1", "toolset_name": "computer", "content": "ok 1"}
assert first[1]["is_error"] is True and first[2] == {"type": "tool_result", "tool_use_id": "u1", "content": "ok 0"}
assert first[3] == {"type": "tool_result", "tool_use_id": "c3", "toolset_name": "computer", "is_error": True,
    "content": "Not executed: an earlier computer action in this turn failed"}
# 失敗は次のターンへ持ち越さず、成功したバッチはすべて実行して結果を返す
second = checkpoint["messages"][4]["content"]
assert [(r["content"], r.get("is_error")) for r in second] == [("ok 4", None), ("ok 5", None)]
assert all(r["toolset_name"] == "computer" for r in second)
`,
    examples()
  );
});

it("agent_loopは同名のツールをtoolset_nameで区別して振り分ける", () => {
  python(
    `
import ast, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
blocks = [{"type": "tool_use", "id": "b1", "name": "screenshot", "toolset_name": "browser", "input": {}},
    {"type": "tool_use", "id": "c1", "name": "screenshot", "toolset_name": "computer", "input": {}},
    {"type": "tool_use", "id": "u1", "name": "screenshot", "input": {}}]
replies = [{"stop_reason": "tool_use", "content": blocks}, {"stop_reason": "end_turn", "content": []}]
seen = []
def call(body):
    seen.append(len(seen))
    return replies[len(seen) - 1]
executors = {("browser", "screenshot"): lambda a: "browser", ("computer", "screenshot"): lambda a: "computer",
    "screenshot": lambda a: "custom"}
def run_tool(name, args):
    return executors[name](args)
scope = {"call": call, "copy": __import__("copy")}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
checkpoint = {}
scope["agent_loop"]("task", [], run_tool, max_turns=2, checkpoint=checkpoint)
results = checkpoint["messages"][2]["content"]
assert [(r["content"], r.get("toolset_name")) for r in results] == [("browser", "browser"), ("computer", "computer"), ("custom", None)]
`,
    examples()
  );
});

it("agent_loopは次のAPI呼び出しが失敗しても完了済みtool_resultを保存する", () => {
  python(
    `
import ast, copy, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
checkpoint, requests, executed = {}, [], []
tool = {"type": "tool_use", "id": "read-1", "name": "read", "input": {"path": "a.py"}}
reply = {"stop_reason": "tool_use", "content": [tool]}
expected = [{"role": "user", "content": "task"},
    {"role": "assistant", "content": [tool]},
    {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "read-1", "content": "file content"}]}]
done = {"stop_reason": "end_turn", "content": [{"type": "text", "text": "done"}]}
def call(body):
    requests.append(copy.deepcopy(body))
    if len(requests) == 1:
        return reply
    if len(requests) == 2:
        assert checkpoint == {"messages": expected}, checkpoint
        raise OSError("network unavailable")
    return done
def run_tool(name, args):
    executed.append((name, args))
    return "file content"
scope = {"call": call, "copy": __import__("copy")}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
try:
    scope["agent_loop"]("task", [], run_tool, max_turns=3, checkpoint=checkpoint)
except OSError as error:
    assert str(error) == "network unavailable"
else:
    raise AssertionError("failed API call must propagate")
assert checkpoint == {"messages": expected}
assert scope["agent_loop"]("task", [], run_tool, max_turns=1, checkpoint=checkpoint) == done
assert requests[2]["messages"] == expected
assert executed == [("read", {"path": "a.py"})]
`,
    examples()
  );
});

it("agent_loopは成功後のツール例外も対応する結果へ変換し、完全なバッチで再開する", () => {
  python(
    `
import ast, copy, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
checkpoint, requests, executed = {}, [], []
def tool(n):
    return {"type": "tool_use", "id": "tool-" + str(n), "name": "read", "input": {"n": n}}
replies = [{"stop_reason": "tool_use", "content": [tool(1)]},
    {"stop_reason": "tool_use", "content": [tool(2), tool(3), tool(4)]},
    {"stop_reason": "end_turn", "content": [{"type": "text", "text": "done"}]}]
def call(body):
    requests.append(copy.deepcopy(body))
    return replies[len(requests) - 1]
def run_tool(name, args):
    executed.append(args["n"])
    if args["n"] == 3:
        raise OSError("read unavailable")
    return "result-" + str(args["n"])
scope = {"call": call, "copy": __import__("copy")}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
try:
    scope["agent_loop"]("task", [], run_tool, max_turns=2, checkpoint=checkpoint)
except RuntimeError as error:
    assert str(error) == "max_turns に到達しました"
else:
    raise AssertionError("turn limit must raise after saving the batch")
history = copy.deepcopy(checkpoint["messages"])
assert len(history) == 5
assert history[2]["content"] == [{"type": "tool_result", "tool_use_id": "tool-1", "content": "result-1"}]
assert history[4]["content"] == [
    {"type": "tool_result", "tool_use_id": "tool-2", "content": "result-2"},
    {"type": "tool_result", "tool_use_id": "tool-3", "content": "OSError: read unavailable", "is_error": True},
    {"type": "tool_result", "tool_use_id": "tool-4", "content": "result-4"}]
for assistant, user in zip(history[1::2], history[2::2]):
    assert [b["id"] for b in assistant["content"]] == [b["tool_use_id"] for b in user["content"]]
assert scope["agent_loop"]("task", [], run_tool, max_turns=1, checkpoint=checkpoint) == replies[2]
assert requests[2]["messages"] == history
assert executed == [1, 2, 3, 4]
`,
    examples()
  );
});

it("PostToolUseはローカル導入済みのPrettierのみを呼び、未導入時は診断を出してスキップする", () => {
  const code = examples().find((c) => c.includes('"PostToolUse"'));
  python(
    `
import json, os, pathlib, subprocess, sys, tempfile
settings = json.loads(json.load(sys.stdin))
command = settings["hooks"]["PostToolUse"][0]["hooks"][0]["command"]
assert "npx" not in command
with tempfile.TemporaryDirectory() as directory:
    root = pathlib.Path(directory)
    # 1. ローカルの prettier が無い場合は失敗せず、診断を stderr に出してスキップする
    npx_stub = root / "npx"
    npx_stub.write_text('#!/bin/sh\\ntouch "$ROOT/NPX_CALLED"\\n')
    npx_stub.chmod(0o755)
    env = {**os.environ, "PATH": directory + os.pathsep + os.environ["PATH"], "ROOT": directory}
    missing = subprocess.run(command, shell=True, input=json.dumps({"tool_input": {"file_path": "a.ts"}}),
        text=True, cwd=directory, env=env, capture_output=True, check=True)
    assert "prettier not installed locally" in missing.stderr
    assert not (root / "NPX_CALLED").exists()

    # 2. ./node_modules/.bin/prettier がある場合は引用符・改行・シェル構文を含むパスをそのまま渡す
    bin_dir = root / "node_modules" / ".bin"
    bin_dir.mkdir(parents=True)
    stub = bin_dir / "prettier"
    stub.write_text('#!/bin/sh\\nprintf "%s\\\\0" "$@" >> "$CAPTURE"\\n')
    stub.chmod(0o755)
    capture = root / "args"
    env["CAPTURE"] = str(capture)
    paths = ["space name.ts", "quote'\\"$(touch PWNED).tsx", "line\\nbreak.js", "--option.ts", "ignored.py"]
    for path in paths:
        subprocess.run(command, shell=True, input=json.dumps({"tool_input": {"file_path": path}}),
            text=True, cwd=directory, env=env, check=True)
    actual = capture.read_bytes().split(b"\\0")[:-1]
    expected = [arg.encode() for path in paths[:-1] for arg in ("--write", "--", path)]
    assert actual == expected, actual
    assert not (root / "PWNED").exists()
    assert not (root / "NPX_CALLED").exists()
`,
    code
  );
});

it("表示した費用関数はキャッシュ件数の明示的なnullを0として扱う", () => {
  python(
    `
import ast, json, math, sys
scope = {}
for code in json.load(sys.stdin):
    if "def usd(" not in code and "def estimate_usd(" not in code:
        continue
    nodes = [n for n in ast.parse(code).body if
        isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id in ("PRICE", "RATES") for t in n.targets)
        or isinstance(n, ast.FunctionDef) and n.name in ("usd", "estimate_usd")]
    exec(compile(ast.Module(body=nodes, type_ignores=[]), "example", "exec"), scope)
usage = {"input_tokens": 1000000, "output_tokens": 0, "cache_read_input_tokens": None,
    "cache_creation_input_tokens": None,
    "cache_creation": {"ephemeral_5m_input_tokens": None, "ephemeral_1h_input_tokens": None}}
for name in ("usd", "estimate_usd"):
    assert scope[name](usage) == 8, name
    assert math.isclose(scope[name]({"cache_creation_input_tokens": 1000000,
        "cache_creation": {"ephemeral_5m_input_tokens": None, "ephemeral_1h_input_tokens": 1000000}}), 16), name
for mode in ("batch", "fast"):
    assert scope["estimate_usd"](usage, mode) > 0
`,
    examples()
  );
});

it("sweepは正常終了し判定関数が受理した応答だけを合格にする", () => {
  python(
    `
import ast, json, sys
code = next(c for c in json.load(sys.stdin) if "def sweep(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "sweep")
results = {"low": "max_tokens", "high": "end_turn"}
def run_once(prompt, effort):
    return {"effort": effort, "sec": 1.5, "usd": 0.25, "out_tokens": 9, "stop_reason": results[effort], "text": "ok"}
scope = {"run_once": run_once}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
rows = scope["sweep"]([{"id": "t", "prompt": "p", "check": lambda text: text == "ok"}], levels=("low", "high"))
assert [(r["effort"], r["passed"]) for r in rows] == [("low", False), ("high", True)]
assert all((r["sec"], r["usd"]) == (1.5, 0.25) for r in rows)
`,
    examples()
  );
});

it("agent_loopはmax_tokensで切れた応答を履歴へ追加せず、完了済みバッチのcheckpointを保つ", () => {
  python(
    `
import ast, copy, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
tool = {"type": "tool_use", "id": "t1", "name": "read", "input": {}}
partial = {"type": "tool_use", "id": "t2", "name": "read", "input": {}}
replies = [{"stop_reason": "tool_use", "content": [tool]}, {"stop_reason": "max_tokens", "content": [partial]}]
requests = []
def call(body):
    requests.append(copy.deepcopy(body))
    return replies[len(requests) - 1]
scope = {"call": call, "copy": __import__("copy")}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
checkpoint = {}
assert scope["agent_loop"]("task", [], lambda name, args: "ok", max_turns=3, checkpoint=checkpoint) is replies[1]
assert checkpoint["messages"] == [{"role": "user", "content": "task"}, {"role": "assistant", "content": [tool]},
    {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "t1", "content": "ok"}]}]
`,
    examples()
  );
});

it("agent_loopはブラウザ操作の失敗をコンピュータ操作と別に追跡し、後続のブラウザ操作だけを止める", () => {
  python(
    `
import ast, copy, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
def use(toolset, n):
    block = {"type": "tool_use", "id": toolset[0] + str(n), "name": "act", "input": {"n": n}}
    if toolset != "custom":
        block["toolset_name"] = toolset
    return block
blocks = [use("browser", 1), use("browser", 2), use("computer", 3), use("custom", 4), use("browser", 5)]
replies = [{"stop_reason": "tool_use", "content": blocks}, {"stop_reason": "end_turn", "content": []}]
executed = []
def call(body):
    executed.append("call")
    return replies[executed.count("call") - 1]
def run_tool(name, args):
    executed.append(args["n"])
    if args["n"] == 1:
        raise RuntimeError("navigation failed")
    return "ok"
scope = {"call": call, "copy": __import__("copy")}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
checkpoint = {}
scope["agent_loop"]("task", [], run_tool, max_turns=2, checkpoint=checkpoint)
assert [e for e in executed if e != "call"] == [1, 3, 4]
results = checkpoint["messages"][2]["content"]
assert [r.get("is_error") for r in results] == [True, True, None, None, True]
assert results[1]["content"] == "Not executed: an earlier browser action in this turn failed"
assert results[4]["content"] == "Not executed: an earlier browser action in this turn failed"
assert all(r["toolset_name"] == "browser" for r in (results[0], results[1], results[4]))
`,
    examples()
  );
});

it("handle_responseは拒否を既定とし、カテゴリだけでは別モデルへ再試行しない", () => {
  python(
    `
import ast, json, sys
code = next(c for c in json.load(sys.stdin) if "def handle_response(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "handle_response")
scope = {}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
handle = scope["handle_response"]
calls = []
def retry(target):
    calls.append(target)
    return {"retried": target}
for category in ("cyber", "bio", "other", None):
    data = {"stop_reason": "refusal", "stop_details": {"category": category}}
    try:
        handle(data, retry)
    except RuntimeError:
        pass
    else:
        raise AssertionError(category)
assert calls == []
ok = {"stop_reason": "end_turn"}
assert handle(ok, retry) is ok
# ハンドラーの外で適格性を判断し、承認済みの移行先を明示した場合だけ再試行する
assert handle({"stop_reason": "refusal", "stop_details": {"category": "cyber"}}, retry, approved_fallback="claude-opus-4-8") == {"retried": "claude-opus-4-8"}
try:
    handle({"stop_reason": "refusal", "stop_details": {"category": "cyber"}}, retry, approved_fallback="claude-opus-5")
except RuntimeError:
    pass
else:
    raise AssertionError("mismatched approval must stay refused")
assert calls == ["claude-opus-4-8"]
`,
    examples()
  );
});

it("agent_loopはmax_tokens引数・model_context_window_exceeded・refusal非汚染・container ID引き継ぎを扱う", () => {
  python(
    `
import ast, copy, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")

# 1. model_context_window_exceeded と refusal は messages と checkpoint を変更せずに返す
for reason in ("max_tokens", "model_context_window_exceeded", "refusal"):
    checkpoint = {"messages": [{"role": "user", "content": "saved"}]}
    snapshot = copy.deepcopy(checkpoint)
    seen = []
    def call(body):
        seen.append(copy.deepcopy(body))
        return {"stop_reason": reason, "content": [{"type": "text", "text": "partial"}], "container": {"id": "ctr_bad"}}
    scope = {"call": call, "copy": copy}
    exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
    res = scope["agent_loop"]("task", [], None, max_turns=2, checkpoint=checkpoint, max_tokens=64_000)
    assert res["stop_reason"] == reason
    assert seen[0]["max_tokens"] == 64_000
    assert checkpoint == snapshot, (reason, checkpoint)

# 2. container ID を checkpoint に保存し、pause_turn・API失敗・ターン上限後の再開に含める
checkpoint, requests = {}, []
def call_container(body):
    requests.append(copy.deepcopy(body))
    if len(requests) == 1:
        return {"stop_reason": "pause_turn", "content": [{"type": "thinking", "signature": "s1"}], "container": {"id": "ctr_123"}}
    if len(requests) == 2:
        raise RuntimeError("transient")
    return {"stop_reason": "end_turn", "content": [{"type": "text", "text": "ok"}]}
scope = {"call": call_container, "copy": copy}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
try:
    scope["agent_loop"]("task", [], None, max_turns=3, checkpoint=checkpoint)
except RuntimeError:
    pass
assert checkpoint["container_id"] == "ctr_123"
assert "container" not in requests[0]
assert requests[1]["container"] == "ctr_123"
scope["agent_loop"]("task", [], None, max_turns=2, checkpoint=checkpoint)
assert requests[2]["container"] == "ctr_123"
`,
    examples()
  );
});

it("usdは非課金確認済みのrefusalのみ0を返し、sweepはリクエスト失敗時も完了済み結果を保持する", () => {
  python(
    `
import ast, json, sys, types
code = next(c for c in json.load(sys.stdin) if "def sweep(" in c)
nodes = [n for n in ast.parse(code).body if
    isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id in ("API", "PRICE") for t in n.targets)
    or isinstance(n, ast.FunctionDef) and n.name in ("usd", "run_once", "sweep")]
calls = []
class FakeResp:
    def __init__(self, data):
        self._data = data
    def raise_for_status(self):
        pass
    def json(self):
        return self._data
def fake_post(url, headers=None, json=None, timeout=None):
    calls.append(json["output_config"]["effort"])
    if len(calls) == 1:
        return FakeResp({"stop_reason": "end_turn", "content": [{"type": "text", "text": "ok"}],
            "usage": {"input_tokens": 100000, "output_tokens": 10000}})
    if len(calls) == 2:
        raise RuntimeError("network timeout")
    if len(calls) == 3:
        return FakeResp({"stop_reason": "refusal", "stop_details": {"category": "cyber", "billed": False},
            "content": [], "usage": {"input_tokens": 100000, "output_tokens": 10000}})
    return FakeResp({"stop_reason": "refusal", "stop_details": {"category": "cyber"},
        "content": [], "usage": {"input_tokens": 100000, "output_tokens": 10000}})
scope = {"HEADERS": {}, "time": __import__("time"), "httpx": types.SimpleNamespace(post=fake_post)}
exec(compile(ast.Module(body=nodes, type_ignores=[]), "example", "exec"), scope)

usage = {"input_tokens": 100000, "output_tokens": 10000}
pre_output_usage = {"input_tokens": 100000, "output_tokens": 0}
assert scope["usd"](usage, {"stop_reason": "refusal", "stop_details": {"billed": False}}) == 0.0
# stop_details.billed が無い公式レスポンス形式では、出力トークン 0 の事前拒否(pre-output refusal)を非課金(0.0)とする
assert scope["usd"](pre_output_usage, {"stop_reason": "refusal", "stop_details": {"type": "refusal", "category": "cyber"}}) == 0.0
assert scope["usd"](pre_output_usage, {"stop_reason": "refusal"}) == 0.0
# 出力トークンが発生した拒否や billed=True の拒否、通常応答は従来どおり課金する
assert scope["usd"](usage, {"stop_reason": "refusal", "stop_details": {"type": "refusal", "category": "cyber"}}) > 0
assert scope["usd"](pre_output_usage, {"stop_reason": "refusal", "stop_details": {"billed": True}}) > 0
assert scope["usd"](usage, {"stop_reason": "end_turn", "stop_details": {"billed": False}}) > 0

rows = scope["sweep"]([{"id": "t1", "prompt": "p", "check": lambda t: t == "ok"}], levels=("low", "medium", "high", "xhigh"))
assert len(rows) == 4
assert rows[0]["status"] == "ok" and rows[0]["passed"] is True and rows[0]["usd"] > 0
assert rows[1]["status"] == "request_error" and rows[1]["passed"] is None and "RuntimeError" in rows[1]["error"]
assert rows[2]["status"] == "ok" and rows[2]["usd"] == 0.0 and rows[2]["passed"] is False
assert rows[3]["status"] == "ok" and rows[3]["usd"] > 0 and rows[3]["passed"] is False

# 採点関数 task["check"] が例外を送出しても、応答計測(時間・費用等)を保持し request_error とは区別して次へ進む
calls.clear()
def flaky_check(text):
    if text == "ok":
        raise ValueError("grader crashed")
    return True
check_rows = scope["sweep"]([{"id": "t2", "prompt": "p", "check": flaky_check}], levels=("low", "medium", "high", "xhigh"))
assert len(check_rows) == 4
assert check_rows[0]["status"] == "check_error"
assert check_rows[0]["passed"] is None
assert check_rows[0]["usd"] > 0 and check_rows[0]["sec"] >= 0
assert "ValueError: grader crashed" in check_rows[0]["error"]
assert check_rows[1]["status"] == "request_error"
`,
    examples()
  );
});

it("agent_loopはcheckpointと作業用messagesを分離し、完了済み再開を拒否しつつpause_turn経由のテキストを順序どおり通知する", () => {
  python(
    `
import ast, copy, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
paused_1 = {"stop_reason": "pause_turn", "content": [{"type": "text", "text": "step 1. "}, {"type": "thinking", "signature": "s1"}]}
paused_2 = {"stop_reason": "pause_turn", "content": [{"type": "text", "text": "step 2. "}]}
done = {"stop_reason": "end_turn", "content": [{"type": "text", "text": "final."}]}
replies = [paused_1, paused_2, done]
requests = []
def call(body):
    requests.append(copy.deepcopy(body))
    return replies[len(requests) - 1]
scope = {"call": call, "copy": copy}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
checkpoint = {}
visible = []
result = scope["agent_loop"]("task", [], None, max_turns=5, checkpoint=checkpoint, on_text=visible.append)
# 生のAPI応答は変更せず、pause_turnから最終応答までの可視テキストを順序どおり取得できる
assert result is done
assert visible == ["step 1. ", "step 2. ", "final."]
# 完了ターンのassistant応答はcheckpoint["messages"]を汚染せず、checkpointは完了済みとしてマークされる
assert checkpoint["completed"] is True
assert len(checkpoint["messages"]) == 3
assert checkpoint["messages"][-1]["content"] == paused_2["content"]
# 完了済みcheckpointを再開しようとするとエラーになる
try:
    scope["agent_loop"]("task", [], None, max_turns=2, checkpoint=checkpoint)
except ValueError:
    pass
else:
    raise AssertionError("completed checkpoint must not be resumed")
`,
    examples()
  );
});
