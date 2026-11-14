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
  const result = spawnSync("python3", ["-c", program], {
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
for mode, price in (("batch", 24), ("fast", 96)):
    assert scope["estimate_usd"]({"input_tokens": 1000000, "output_tokens": 1000000}, mode) == price
    for cached in ({"cache_read_input_tokens": 1}, {"cache_creation_input_tokens": 1},
        {"cache_creation": {"ephemeral_5m_input_tokens": 1}}, {"cache_creation": {"ephemeral_1h_input_tokens": 1}}):
        try:
            scope["estimate_usd"](cached, mode)
        except ValueError:
            pass
        else:
            raise AssertionError((mode, cached))
`,
    examples()
  );
});

it("agent_loopの各リクエストがトップレベルのキャッシュを有効にする", () => {
  python(
    `
import ast, json, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
requests = [n.args[0] for n in ast.walk(fn) if isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == "call"]
assert len(requests) == 1
body = requests[0]
cache = next(v for k, v in zip(body.keys, body.values) if ast.literal_eval(k) == "cache_control")
assert ast.literal_eval(cache) == {"type": "ephemeral"}
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
scope = {"call": call}
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
scope = {"call": call}
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

it("PostToolUseは引用符・改行・シェル構文を含むパスをそのままPrettierへ渡す", () => {
  const code = examples().find((c) => c.includes('"PostToolUse"'));
  python(
    `
import json, os, pathlib, subprocess, sys, tempfile
settings = json.loads(json.load(sys.stdin))
command = settings["hooks"]["PostToolUse"][0]["hooks"][0]["command"]
with tempfile.TemporaryDirectory() as directory:
    root = pathlib.Path(directory)
    stub = root / "npx"
    stub.write_text('#!/bin/sh\\nprintf "%s\\\\0" "$@" >> "$CAPTURE"\\n')
    stub.chmod(0o755)
    capture = root / "args"
    env = {**os.environ, "PATH": directory + os.pathsep + os.environ["PATH"], "CAPTURE": str(capture)}
    paths = ["space name.ts", "quote'\\"$(touch PWNED).tsx", "line\\nbreak.js", "--option.ts", "ignored.py"]
    for path in paths:
        subprocess.run(command, shell=True, input=json.dumps({"tool_input": {"file_path": path}}),
            text=True, cwd=directory, env=env, check=True)
    actual = capture.read_bytes().split(b"\\0")[:-1]
    expected = [arg.encode() for path in paths[:-1] for arg in ("prettier", "--write", "--", path)]
    assert actual == expected, actual
    assert not (root / "PWNED").exists()
`,
    code
  );
});
