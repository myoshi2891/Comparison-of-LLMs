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
let cachedPython: string | undefined;
function resolvePython(): string {
  if (cachedPython) return cachedPython;
  const candidates = [
    process.env.PYTHON,
    "python3",
    "python3.13",
    "python3.12",
    "python3.11",
    "python3.10",
  ].filter((c): c is string => Boolean(c));
  const timeouts: string[] = [];
  for (const cmd of candidates) {
    const probe = spawnSync(
      cmd,
      ["-E", "-c", "import sys; raise SystemExit(0 if sys.version_info >= (3, 10) else 1)"],
      { timeout: 10_000 }
    );
    if (probe.error && (probe.error as NodeJS.ErrnoException).code === "ETIMEDOUT") {
      timeouts.push(
        `Python version probe timed out after 10s (phase: version probe, executable: ${cmd})`
      );
      continue;
    }
    if (!probe.error && probe.status === 0) {
      cachedPython = cmd;
      return cmd;
    }
  }
  if (timeouts.length > 0) {
    throw new Error(timeouts.join("; "));
  }
  throw new Error(
    `Python 3.10 or later is required, and no candidate passed the version probe (candidates: ${candidates.join(", ")})`
  );
}
function python(program: string, input: unknown) {
  // -E: PYTHON* 環境変数（PYTHONOPTIMIZE 等）を無視し、assert を常に有効にする。
  const result = spawnSync(resolvePython(), ["-E", "-c", program], {
    input: JSON.stringify(input),
    encoding: "utf8",
    timeout: 60_000,
  });
  if (result.error) {
    throw new Error(
      `Python example execution failed (phase: example execution, executable: ${resolvePython()}): ${result.error.message}`
    );
  }
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
# 非課金と確認された事前拒否(pre-output refusal)は予算へ 0 として計上し、通常応答・課金対象拒否は通常単価を保つ。
refusal_usage = {"input_tokens": 100000, "output_tokens": 0}
assert scope["estimate_usd"](refusal_usage, "standard", {"stop_reason": "refusal", "stop_details": {"category": "cyber"}}) == 0.0
assert scope["estimate_usd"](refusal_usage, "fast", {"stop_reason": "refusal", "stop_details": {"billed": False}}) == 0.0
assert math.isclose(scope["estimate_usd"](refusal_usage, "standard", {"stop_reason": "refusal", "stop_details": {"category": "bio"}}), 0.8)
assert math.isclose(scope["estimate_usd"]({"input_tokens": 100000, "output_tokens": 100}, "standard", {"stop_reason": "refusal", "stop_details": {"category": "cyber"}}), 0.804)
assert math.isclose(scope["estimate_usd"](refusal_usage, "standard", {"stop_reason": "end_turn"}), 0.8)
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
    expected_history = [{"role": "user", "content": "task"}, {"role": "assistant", "content": copy.deepcopy(paused["content"])}]
    done = {"stop_reason": reason, "content": [{"type": "text", "text": "done"}]}
    def call(body):
        requests.append(copy.deepcopy(body))
        return paused if len(requests) == 1 else done
    def run_tool(*args):
        raise AssertionError("pause_turn must not execute client tools")
    scope = {"call": call, "copy": __import__("copy")}
    exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
    assert scope["agent_loop"]("task", [], run_tool, max_turns=2) is done
    assert requests[1]["messages"] == expected_history
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
        assert checkpoint["pending_messages"] == body["messages"]
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
assert checkpoint["pending_messages"] == [{"role": "user", "content": "task"}, {"role": "assistant", "content": paused["content"]}]
assert checkpoint["pending_messages"][-1]["content"] is paused["content"]
assert checkpoint["messages"] == [{"role": "user", "content": "task"}]
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
    if len(requests) == 1:
        return {"stop_reason": "pause_turn", "content": []}
    return {"stop_reason": "end_turn", "content": []}
scope = {"call": call, "copy": copy}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
scope["agent_loop"]("task", [], None)
assert len(requests) == 2
assert requests[0]["cache_control"] == {"type": "ephemeral"}
assert requests[1]["cache_control"] == {"type": "ephemeral"}
assert requests[0]["max_tokens"] == 32_000
assert "container" not in requests[0]

requests.clear()
scope["agent_loop"]("task", [], None, auto_cache=False)
assert len(requests) == 2
assert "cache_control" not in requests[0]
assert "cache_control" not in requests[1]
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
import ast, copy, json, logging, sys
logging.getLogger().addHandler(logging.NullHandler())
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
    "content": "Not executed: an earlier computer action in this turn failed."}
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
browser_img = [{"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": "AAAA"}}]
computer_img = [{"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": "BBBB"}}]
executors = {("browser", "screenshot"): lambda a: browser_img, ("computer", "screenshot"): lambda a: computer_img,
    "screenshot": lambda a: "custom"}
def run_tool(name, args):
    return executors[name](args)
scope = {"call": call, "copy": __import__("copy")}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
checkpoint = {}
scope["agent_loop"]("task", [], run_tool, max_turns=2, checkpoint=checkpoint)
results = checkpoint["messages"][2]["content"]
assert [(r["content"], r.get("toolset_name")) for r in results] == [(browser_img, "browser"), (computer_img, "computer"), ("custom", None)]
`,
    examples()
  );
});

it("agent_loopは次のAPI呼び出しが失敗しても完了済みtool_resultを保存する", () => {
  python(
    `
import ast, copy, json, logging, sys
logging.getLogger().addHandler(logging.NullHandler())
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
checkpoint, requests, executed = {}, [], []
tool = {"type": "tool_use", "id": "read-1", "name": "read", "input": {"path": "a.py"}}
reply = {"stop_reason": "tool_use", "content": [tool]}
expected = copy.deepcopy([{"role": "user", "content": "task"},
    {"role": "assistant", "content": [tool]},
    {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "read-1", "content": "file content"}]}])
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
import ast, copy, json, logging, sys
logging.getLogger().addHandler(logging.NullHandler())
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
checkpoint, requests, executed = {}, [], []
def tool(n):
    return {"type": "tool_use", "id": "tool-" + str(n), "name": "read", "input": {"n": n}}
replies = [{"stop_reason": "tool_use", "content": [tool(1)]},
    {"stop_reason": "tool_use", "content": [tool(2), tool(3), tool(4)]},
    {"stop_reason": "end_turn", "content": [{"type": "text", "text": "done"}]}]
expected_history = copy.deepcopy([
    {"role": "user", "content": "task"},
    {"role": "assistant", "content": replies[0]["content"]},
    {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "tool-1", "content": "result-1"}]},
    {"role": "assistant", "content": replies[1]["content"]},
    {"role": "user", "content": [
        {"type": "tool_result", "tool_use_id": "tool-2", "content": "result-2"},
        {"type": "tool_result", "tool_use_id": "tool-3", "content": "Tool execution failed. Check the tool arguments or try an alternative approach.", "is_error": True},
        {"type": "tool_result", "tool_use_id": "tool-4", "content": "result-4"}]},
])
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
assert checkpoint["messages"] == expected_history
for assistant, user in zip(expected_history[1::2], expected_history[2::2]):
    assert [b["id"] for b in assistant["content"]] == [b["tool_use_id"] for b in user["content"]]
assert scope["agent_loop"]("task", [], run_tool, max_turns=1, checkpoint=checkpoint) == replies[2]
assert requests[2]["messages"] == expected_history
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
for mode, expected in (("batch", 4.0), ("fast", 16.0)):
    assert math.isclose(scope["estimate_usd"](usage, mode), expected), mode
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
# end_turn でも判定関数が False を返せば不合格（時間・費用は記録する）
rejected = scope["sweep"]([{"id": "t", "prompt": "p", "check": lambda text: False}], levels=("high",))
assert [r["passed"] for r in rejected] == [False]
assert (rejected[0]["sec"], rejected[0]["usd"]) == (1.5, 0.25)
# ワンショットイテラブル(ジェネレータ)を渡しても全タスクで同じ effort 列が適用される
gen_rows = scope["sweep"](
    [
        {"id": "t1", "prompt": "p1", "check": lambda text: text == "ok"},
        {"id": "t2", "prompt": "p2", "check": lambda text: text == "ok"},
    ],
    levels=(lv for lv in ("low", "high")),
)
assert [(r["task"], r["effort"], r["passed"]) for r in gen_rows] == [
    ("t1", "low", False),
    ("t1", "high", True),
    ("t2", "low", False),
    ("t2", "high", True),
]
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
import ast, copy, json, logging, sys
logging.getLogger().addHandler(logging.NullHandler())
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
assert results[1]["content"] == "Not executed: an earlier action in this turn failed"
assert results[4]["content"] == "Not executed: an earlier action in this turn failed"
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

# 1. max_tokens / model_context_window_exceeded は messages を変更せず、container が返ったときだけ container_id を反映する
for reason in ("max_tokens", "model_context_window_exceeded"):
    checkpoint = {"messages": [{"role": "user", "content": "saved"}], "container_id": "ctr_prev"}
    seen = []
    def call_with_ctr(body):
        seen.append(copy.deepcopy(body))
        return {"stop_reason": reason, "content": [{"type": "text", "text": "partial"}], "container": {"id": "ctr_new"}}
    scope = {"call": call_with_ctr, "copy": copy}
    exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
    res = scope["agent_loop"]("task", [], None, max_turns=2, checkpoint=checkpoint, max_tokens=64_000)
    assert res["stop_reason"] == reason
    assert seen[0]["max_tokens"] == 64_000
    assert checkpoint["messages"] == [{"role": "user", "content": "saved"}], (reason, checkpoint)
    assert checkpoint["container_id"] == "ctr_new", (reason, checkpoint)

    # container が無い場合は保存済みの container_id をそのまま保持する
    checkpoint_no_ctr = {"messages": [{"role": "user", "content": "saved"}], "container_id": "ctr_prev"}
    def call_without_ctr(body):
        return {"stop_reason": reason, "content": [{"type": "text", "text": "partial"}]}
    scope2 = {"call": call_without_ctr, "copy": copy}
    exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope2)
    scope2["agent_loop"]("task", [], None, max_turns=2, checkpoint=checkpoint_no_ctr)
    assert checkpoint_no_ctr == {"messages": [{"role": "user", "content": "saved"}], "container_id": "ctr_prev"}

# refusal は messages も container_id も変更せずに返す
refusal_cp = {"messages": [{"role": "user", "content": "saved"}], "container_id": "ctr_prev"}
refusal_snapshot = copy.deepcopy(refusal_cp)
scope_ref = {"call": lambda _b: {"stop_reason": "refusal", "content": [{"type": "text", "text": "no"}], "container": {"id": "ctr_bad"}}, "copy": copy}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope_ref)
assert scope_ref["agent_loop"]("task", [], None, max_turns=2, checkpoint=refusal_cp)["stop_reason"] == "refusal"
assert refusal_cp == refusal_snapshot

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
except RuntimeError as err:
    assert str(err) == "transient"
else:
    raise AssertionError("expected transient RuntimeError")
assert len(requests) == 2
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
one_million_pre_output = {"input_tokens": 1_000_000, "output_tokens": 0}
assert scope["usd"](usage, {"stop_reason": "refusal", "stop_details": {"billed": False}}) == 0.0
# stop_details.billed が無い公式レスポンス形式では、非課金カテゴリの事前拒否(pre-output refusal)は 0.0
assert scope["usd"](pre_output_usage, {"stop_reason": "refusal", "stop_details": {"type": "refusal", "category": "cyber"}}) == 0.0
assert scope["usd"](pre_output_usage, {"stop_reason": "refusal", "stop_details": {"type": "refusal", "category": "general_harms"}}) == 0.0
assert scope["usd"](pre_output_usage, {"stop_reason": "refusal"}) == 0.0
# bio / frontier_llm / reasoning_extraction の事前拒否は billed 未指定時は入力トークンに課金される(1M bio 入力 = $8.0)
for category in ("bio", "frontier_llm", "reasoning_extraction"):
    assert scope["usd"](one_million_pre_output, {"stop_reason": "refusal", "stop_details": {"type": "refusal", "category": category}}) == 8.0, category
    # 明示的に billed=False の場合は非課金を優先する
    assert scope["usd"](one_million_pre_output, {"stop_reason": "refusal", "stop_details": {"type": "refusal", "category": category, "billed": False}}) == 0.0, category
# 出力トークンが発生した拒否や billed=True の拒否、通常応答は従来どおり課金する
import math
assert math.isclose(scope["usd"](usage, {"stop_reason": "refusal", "stop_details": {"type": "refusal", "category": "cyber"}}), 1.20)
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
assert check_rows[2]["passed"] is False
assert check_rows[3]["passed"] is False
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
assert "pending_messages" not in checkpoint
assert checkpoint["messages"] == [{"role": "user", "content": "task"}]
# auto_cache=True(既定)ではトップレベル cache_control が付与され、auto_cache=False では省略される
assert requests[0]["cache_control"] == {"type": "ephemeral"}
requests_no_cache = []
def call_no_cache(body):
    requests_no_cache.append(copy.deepcopy(body))
    return done
scope_no_cache = {"call": call_no_cache, "copy": copy}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope_no_cache)
assert scope_no_cache["agent_loop"]("task", [], None, max_turns=2, auto_cache=False) is done
assert "cache_control" not in requests_no_cache[0]
# 完了済みcheckpointを再開しようとするとエラーになる
try:
    scope["agent_loop"]("task", [], None, max_turns=2, checkpoint=checkpoint)
except ValueError:
    pass
else:
    raise AssertionError("completed checkpoint must not be resumed")
# 最終応答のon_textコールバックが失敗しても、checkpointは完了済みかつfinal_responseを保持しAPI再実行なしで回収できる
requests.clear()
replies[:] = [done]
failing_checkpoint = {}
def fail_on_text(_text):
    raise RuntimeError("sink failed")
try:
    scope["agent_loop"]("task", [], None, max_turns=2, checkpoint=failing_checkpoint, on_text=fail_on_text)
except RuntimeError:
    pass
else:
    raise AssertionError("callback error should propagate")
assert failing_checkpoint["completed"] is True
assert failing_checkpoint["final_response"] is done
# pause_turnは完了済みバッチ境界(checkpoint["messages"])を上書きせず、継続状態をpending_messagesへ別保存する
requests.clear()
tool_first = {"stop_reason": "tool_use", "content": [{"type": "tool_use", "id": "t1", "name": "read", "input": {}}]}
paused_with_ctr = {"stop_reason": "pause_turn", "content": [{"type": "text", "text": "p1"}], "container": {"id": "ctr_pause"}}
replies[:] = [tool_first, paused_with_ctr, done]
pause_cp = {}
try:
    scope["agent_loop"]("task", [], lambda _n, _a: "ok", max_turns=3, checkpoint=pause_cp, on_text=fail_on_text)
except RuntimeError:
    pass
else:
    raise AssertionError("pause_turn callback error should propagate")
completed_boundary = [
    {"role": "user", "content": "task"},
    {"role": "assistant", "content": tool_first["content"]},
    {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "t1", "content": "ok"}]},
]
assert pause_cp["messages"] == completed_boundary
assert pause_cp["pending_messages"] == completed_boundary + [{"role": "assistant", "content": paused_with_ctr["content"]}]
assert pause_cp["container_id"] == "ctr_pause"
resumed = []
assert scope["agent_loop"]("task", [], lambda _n, _a: "ok", max_turns=2, checkpoint=pause_cp, on_text=resumed.append) is done
assert requests[2]["messages"] == completed_boundary + [{"role": "assistant", "content": paused_with_ctr["content"]}]
assert requests[2]["container"] == "ctr_pause"
assert pause_cp["messages"] == completed_boundary
assert "pending_messages" not in pause_cp
assert resumed == ["final."]
# tool_use応答に含まれるtextブロックもon_textへちょうど1回通知される(refusal/max_tokensでは通知しない)
requests.clear()
tool_reply = {"stop_reason": "tool_use", "content": [{"type": "text", "text": "checking..."}, {"type": "tool_use", "id": "t1", "name": "read", "input": {}}]}
replies[:] = [tool_reply, done]
tool_texts = []
assert scope["agent_loop"]("task", [], lambda _n, _a: "ok", max_turns=3, on_text=tool_texts.append) is done
assert tool_texts == ["checking...", "final."]
for early_reason in ("refusal", "max_tokens"):
    requests.clear()
    replies[:] = [{"stop_reason": early_reason, "content": [{"type": "text", "text": "ignored"}]}]
    early_texts = []
    assert scope["agent_loop"]("task", [], None, max_turns=2, on_text=early_texts.append)["stop_reason"] == early_reason
    assert early_texts == []
`,
    examples()
  );
});

it("agent_loopはrun_toolの戻り値をコンテンツブロックスキーマで検証し、例外本文をモデルにもログにも漏らさず例外型のみを記録する", () => {
  python(
    `
import ast, copy, json, logging, sys
code = next(c for c in json.load(sys.stdin) if "def agent_loop(" in c)
fn = next(n for n in ast.parse(code).body if isinstance(n, ast.FunctionDef) and n.name == "agent_loop")
def tool(n, name="op", toolset=None):
    b = {"type": "tool_use", "id": "t" + str(n), "name": name, "input": {"n": n}}
    if toolset is not None:
        b["toolset_name"] = toolset
    return b
replies = [
    {"stop_reason": "tool_use", "content": [
        *[tool(n) for n in range(1, 21)],
        tool(21, name="new_tab", toolset="browser"),
        tool(22, name="click", toolset="browser"),
        tool(23, name="switch_tab", toolset="browser"),
        tool(24, name="list_tabs", toolset="browser"),
        tool(25, name="op"),
        tool(26, name="op"),
        tool(27, name="list_tabs", toolset="browser"),
    ]},
    {"stop_reason": "end_turn", "content": [{"type": "text", "text": "done"}]},
]
requests = []
def call(body):
    requests.append(copy.deepcopy(body))
    return replies[len(requests) - 1]
returns = {
    1: "ok",
    2: [{"type": "text", "text": "block"}],
    3: [{"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": "AAAA"}}],
    4: [{"type": "image", "source": {"type": "url", "url": "https://example.com/a.png"}}],
    5: [{"type": "document", "source": {"type": "url", "url": "https://example.com/doc.pdf"}}],
    6: [{"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": "JVBERi0="}}],
    7: [{"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "hello"}}],
    8: [{"type": "document", "source": {"type": "content", "content": [{"type": "text", "text": "doc"}]}}],
    9: [{"type": "search_result", "source": "https://example.com", "title": "T", "content": [{"type": "text", "text": "snippet"}]}],
    10: None,
    11: 42,
    12: {"type": "text", "text": "dict-not-list"},
    13: [{"text": "missing-type"}],
    14: [{"type": "text"}],
    15: [{"type": "image", "source": {"type": "base64"}}],
    16: [{"type": "unknown_block", "value": "x"}],
    17: [{"type": "document", "source": {"type": "url"}}],
    18: [{"type": "search_result", "source": "s", "title": "t", "content": []}, {"type": "text", "text": "mixed"}],
    19: [{"type": "browser_state", "tabs": []}],
    21: [{"type": "browser_state", "tabs": [{"tab_id": "tab1", "title": "New Tab", "url": "https://example.com", "active": True}], "state_changes": [{"type": "tab_opened", "tab_id": "tab1"}]}],
    22: [{"type": "browser_state", "tabs": [{"tab_id": "tab1", "title": "Example", "url": "https://example.com", "active": True}]}, {"type": "text", "text": "clicked"}],
    23: [{"type": "text", "text": "not-browser-state"}],
    24: [{"type": "browser_state", "tabs": [{"tab_id": "", "title": "Bad", "url": "https://example.com", "active": False}]}],
    25: [{"type": "search_result", "source": "https://example.com", "title": "T", "content": [{"type": "text", "text": ""}]}],
    26: [{"type": "search_result", "source": "https://example.com", "title": "T", "content": [{"type": "image", "source": {"type": "url", "url": "https://example.com/a.png"}}]}],
    27: [{"type": "browser_state", "tabs": []}],
}
def run_tool(_k, a):
    if a["n"] == 20:
        raise RuntimeError("secret api_key=topsecret123 sk-ant-secret999")
    return returns[a["n"]]
records = []
class CaptureHandler(logging.Handler):
    def emit(self, record):
        records.append(self.format(record))
logger = logging.getLogger()
handler = CaptureHandler()
logger.addHandler(handler)
scope = {"call": call, "copy": copy}
exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), scope)
checkpoint = {}
expected_returns = copy.deepcopy(returns)
try:
    assert scope["agent_loop"]("task", [], run_tool, max_turns=2, checkpoint=checkpoint) is replies[1]
    results = checkpoint["messages"][2]["content"]
    assert results[0] == {"type": "tool_result", "tool_use_id": "t1", "content": "ok"}
    assert results[1] == {"type": "tool_result", "tool_use_id": "t2", "content": [{"type": "text", "text": "block"}]}
    assert results[2] == {"type": "tool_result", "tool_use_id": "t3", "content": [{"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": "AAAA"}}]}
    assert results[3] == {"type": "tool_result", "tool_use_id": "t4", "content": [{"type": "image", "source": {"type": "url", "url": "https://example.com/a.png"}}]}
    assert results[4] == {"type": "tool_result", "tool_use_id": "t5", "content": expected_returns[5]}
    assert results[5] == {"type": "tool_result", "tool_use_id": "t6", "content": expected_returns[6]}
    assert results[6] == {"type": "tool_result", "tool_use_id": "t7", "content": expected_returns[7]}
    assert results[7] == {"type": "tool_result", "tool_use_id": "t8", "content": expected_returns[8]}
    assert results[8] == {"type": "tool_result", "tool_use_id": "t9", "content": expected_returns[9]}
    fixed_msg = "Tool execution failed. Check the tool arguments or try an alternative approach."
    for idx in range(9, 20):
        assert results[idx]["is_error"] is True, (idx, results[idx])
        assert results[idx]["content"] == fixed_msg, (idx, results[idx])
        assert "topsecret123" not in results[idx]["content"]
        assert "sk-ant-secret999" not in results[idx]["content"]
    # 実際の送信リクエスト(requests[1])でも t20 の tool_result が固定エラー文言のみで例外詳細を含まないこと
    sent_t20 = next(r for r in requests[1]["messages"][2]["content"] if r.get("tool_use_id") == "t20")
    assert sent_t20["is_error"] is True, sent_t20
    assert sent_t20["content"] == fixed_msg, sent_t20
    assert "RuntimeError" not in sent_t20["content"]
    assert "topsecret123" not in sent_t20["content"]
    assert "sk-ant-secret999" not in sent_t20["content"]
    # browser タブ管理 (new_tab) は単一の browser_state ブロックを正常受理し、他の browser メンバーは text/image 併存も受理する
    assert results[20] == {"type": "tool_result", "tool_use_id": "t21", "toolset_name": "browser", "content": expected_returns[21]}
    assert results[21] == {"type": "tool_result", "tool_use_id": "t22", "toolset_name": "browser", "content": expected_returns[22]}
    # browser タブ管理 (switch_tab) に browser_state 以外が返った場合はエラー結果にし、後続の browser 操作も抑止する
    assert results[22]["is_error"] is True
    assert results[22]["toolset_name"] == "browser"
    assert results[22]["content"] == fixed_msg
    assert results[23]["is_error"] is True
    assert results[23]["toolset_name"] == "browser"
    assert results[23]["content"] == "Not executed: an earlier action in this turn failed"
    # 不正な search_result (空テキスト・非テキスト要素) はエラー結果へ変換される
    for idx in (24, 25):
        assert results[idx]["is_error"] is True, idx
        assert results[idx]["content"] == fixed_msg, idx
    # 例外型のみの失敗診断が記録され、いずれのレコードにも機微情報が含まれないこと
    assert any("RuntimeError" in msg for msg in records), records
    assert all("topsecret123" not in msg and "sk-ant-secret999" not in msg for msg in records), records

    # 不正な browser_state 単体ケース: 固定エラーが返り、拒否された状態は messages / checkpoint へ入らない
    bad_bs_replies = [
        {"stop_reason": "tool_use", "content": [tool(1, name="list_tabs", toolset="browser")]},
        {"stop_reason": "end_turn", "content": [{"type": "text", "text": "done"}]},
    ]
    bad_bs_reqs = []
    def bad_bs_call(body):
        bad_bs_reqs.append(copy.deepcopy(body))
        return bad_bs_replies[len(bad_bs_reqs) - 1]
    bad_bs_scope = {"call": bad_bs_call, "copy": copy}
    exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), bad_bs_scope)
    bad_bs_cp = {}
    bad_state = [{"type": "browser_state", "tabs": [{"tab_id": "", "title": "Bad", "url": "https://example.com", "active": False}]}]
    assert bad_bs_scope["agent_loop"]("task", [], lambda _k, _a: bad_state, max_turns=2, checkpoint=bad_bs_cp) is bad_bs_replies[1]
    bad_bs_res = bad_bs_cp["messages"][2]["content"][0]
    assert bad_bs_res == {"type": "tool_result", "tool_use_id": "t1", "toolset_name": "browser", "content": fixed_msg, "is_error": True}
    assert "Bad" not in json.dumps(bad_bs_cp["messages"])

    # browser.screenshot が文字列("screenshot unavailable")を返した場合はエラー扱いとし、後続 browser 操作を止める
    shot_replies = [
        {"stop_reason": "tool_use", "content": [
            tool(1, name="screenshot", toolset="browser"),
            tool(2, name="click", toolset="browser"),
            tool(3, name="custom_tool"),
        ]},
        {"stop_reason": "end_turn", "content": [{"type": "text", "text": "done"}]},
    ]
    shot_reqs = []
    shot_executed = []
    def shot_call(body):
        shot_reqs.append(copy.deepcopy(body))
        return shot_replies[len(shot_reqs) - 1]
    def shot_run_tool(k, _a):
        shot_executed.append(k)
        if k == ("browser", "screenshot"):
            return "screenshot unavailable"
        return "custom-ok"
    shot_scope = {"call": shot_call, "copy": copy}
    exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), shot_scope)
    shot_cp = {}
    assert shot_scope["agent_loop"]("task", [], shot_run_tool, max_turns=2, checkpoint=shot_cp) is shot_replies[1]
    shot_results = shot_cp["messages"][2]["content"]
    assert shot_results[0] == {"type": "tool_result", "tool_use_id": "t1", "toolset_name": "browser", "content": fixed_msg, "is_error": True}
    assert shot_results[1] == {"type": "tool_result", "tool_use_id": "t2", "toolset_name": "browser", "content": "Not executed: an earlier action in this turn failed", "is_error": True}
    assert shot_results[2] == {"type": "tool_result", "tool_use_id": "t3", "content": "custom-ok"}
    assert shot_executed == [("browser", "screenshot"), "custom_tool"]

    # search_result の citations.enabled 一貫性検証(単一結果・同一ターン・checkpoint 履歴)
    def run_sr_case(replies_seq, tool_fn, cp=None, tools=()):
        reqs = []
        def sr_call(body):
            reqs.append(copy.deepcopy(body))
            return replies_seq[len(reqs) - 1]
        sr_scope = {"call": sr_call, "copy": copy}
        exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), sr_scope)
        target_cp = {} if cp is None else cp
        sr_scope["agent_loop"]("task", list(tools), tool_fn, max_turns=3, checkpoint=target_cp)
        return target_cp

    sr_enabled = {"type": "search_result", "source": "https://a.example", "title": "A", "content": [{"type": "text", "text": "body"}], "citations": {"enabled": True}}
    sr_disabled = {"type": "search_result", "source": "https://b.example", "title": "B", "content": [{"type": "text", "text": "body"}], "citations": {"enabled": False}}
    sr_omitted = {"type": "search_result", "source": "https://c.example", "title": "C", "content": [{"type": "text", "text": "body"}]}
    sr_bad_cit = {"type": "search_result", "source": "https://d.example", "title": "D", "content": [{"type": "text", "text": "body"}], "citations": {"enabled": "yes"}}

    # 均一に enabled=True / 均一に disabled(False と省略) は受理される
    cp_en = run_sr_case(
        [{"stop_reason": "tool_use", "content": [tool(1)]}, {"stop_reason": "end_turn", "content": []}],
        lambda _k, _a: [sr_enabled, copy.deepcopy(sr_enabled)],
    )
    assert cp_en["messages"][2]["content"][0]["content"] == [sr_enabled, sr_enabled]
    cp_dis = run_sr_case(
        [{"stop_reason": "tool_use", "content": [tool(1)]}, {"stop_reason": "end_turn", "content": []}],
        lambda _k, _a: [sr_disabled, sr_omitted],
    )
    assert cp_dis["messages"][2]["content"][0]["content"] == [sr_disabled, sr_omitted]

    # 同一結果内での enabled 混在・不正な citations 型はツールエラーになり保存されない
    for bad_batch in ([sr_enabled, sr_disabled], [sr_enabled, sr_omitted], [sr_bad_cit]):
        cp_bad = run_sr_case(
            [{"stop_reason": "tool_use", "content": [tool(1)]}, {"stop_reason": "end_turn", "content": []}],
            lambda _k, _a, b=bad_batch: b,
        )
        res = cp_bad["messages"][2]["content"][0]
        assert res["is_error"] is True and res["content"] == fixed_msg, (bad_batch, res)

    # 同一ターン内の複数 tool_use でも citations.enabled の不一致を検出し、一致するケースは受理する
    for second_sr, forbidden_url in ((sr_disabled, "https://b.example"), (sr_omitted, "https://c.example")):
        cp_same_bad = run_sr_case(
            [{"stop_reason": "tool_use", "content": [tool(1), tool(2)]}, {"stop_reason": "end_turn", "content": []}],
            lambda _k, a, s2=second_sr: [sr_enabled] if a["n"] == 1 else [s2],
        )
        r1, r2 = cp_same_bad["messages"][2]["content"]
        assert r1 == {"type": "tool_result", "tool_use_id": "t1", "content": [sr_enabled]}
        assert r2["is_error"] is True and r2["content"] == fixed_msg
        assert forbidden_url not in json.dumps(cp_same_bad["messages"])

    cp_same_ok = run_sr_case(
        [{"stop_reason": "tool_use", "content": [tool(1), tool(2)]}, {"stop_reason": "end_turn", "content": []}],
        lambda _k, _a: [copy.deepcopy(sr_enabled)],
    )
    assert cp_same_ok["messages"][2]["content"] == [
        {"type": "tool_result", "tool_use_id": "t1", "content": [sr_enabled]},
        {"type": "tool_result", "tool_use_id": "t2", "content": [sr_enabled]},
    ]

    # computer ツールメンバーの document ブロックは拒否し、カスタムツールの document ブロックは受理する
    doc_block = {"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "secret-doc"}}
    cp_comp_doc = run_sr_case(
        [{"stop_reason": "tool_use", "content": [tool(1, name="screenshot", toolset="computer"), tool(2, name="custom_doc")]}, {"stop_reason": "end_turn", "content": []}],
        lambda _k, _a: [copy.deepcopy(doc_block)],
    )
    comp_res, custom_res = cp_comp_doc["messages"][2]["content"]
    assert comp_res == {"type": "tool_result", "tool_use_id": "t1", "toolset_name": "computer", "content": fixed_msg, "is_error": True}
    assert custom_res == {"type": "tool_result", "tool_use_id": "t2", "content": [doc_block]}

    # checkpoint 履歴に enabled=True がある状態で後続が disabled を返すとエラー、enabled=True なら受理
    cp_hist_mismatch = {"messages": [
        {"role": "user", "content": "task"},
        {"role": "assistant", "content": [tool(0)]},
        {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "t0", "content": [sr_enabled]}]},
    ]}
    run_sr_case(
        [{"stop_reason": "tool_use", "content": [tool(1)]}, {"stop_reason": "end_turn", "content": []}],
        lambda _k, _a: [sr_omitted],
        cp=cp_hist_mismatch,
    )
    res_hm = cp_hist_mismatch["messages"][-1]["content"][0]
    assert res_hm["is_error"] is True and res_hm["content"] == fixed_msg
    assert "https://c.example" not in json.dumps(cp_hist_mismatch["messages"])

    cp_hist_ok = {"messages": [
        {"role": "user", "content": "task"},
        {"role": "assistant", "content": [tool(0)]},
        {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "t0", "content": [sr_enabled]}]},
    ]}
    run_sr_case(
        [{"stop_reason": "tool_use", "content": [tool(1)]}, {"stop_reason": "end_turn", "content": []}],
        lambda _k, _a: [sr_enabled],
        cp=cp_hist_ok,
    )
    assert cp_hist_ok["messages"][-1]["content"][0]["content"] == [sr_enabled]

    # サーバー側 web search が有効なら citations 無効・省略の search_result は保存前にエラー、有効なら受理
    custom_tool = {"name": "web_search_custom", "input_schema": {"type": "object"}}
    for ws_type in ("web_search_20250305", "web_search_20260318"):
        ws_tools = [custom_tool, {"type": ws_type, "name": "web_search"}]
        for batch, ok in (([sr_disabled], False), ([sr_omitted], False), ([sr_enabled], True)):
            cp_ws = run_sr_case(
                [{"stop_reason": "tool_use", "content": [tool(1)]}, {"stop_reason": "end_turn", "content": []}],
                lambda _k, _a, b=batch: b,
                tools=ws_tools,
            )
            res_ws = cp_ws["messages"][2]["content"][0]
            if ok:
                assert res_ws["content"] == batch and "is_error" not in res_ws, res_ws
            else:
                assert res_ws["is_error"] is True and res_ws["content"] == fixed_msg, (ws_type, batch, res_ws)
    # web search がなければ(名前だけ似たカスタムツールも含め)従来どおり受理する
    for no_ws_tools in ([], [custom_tool], [{"type": "web_fetch_20260318", "name": "web_fetch"}]):
        cp_no_ws = run_sr_case(
            [{"stop_reason": "tool_use", "content": [tool(1)]}, {"stop_reason": "end_turn", "content": []}],
            lambda _k, _a: [sr_omitted],
            tools=no_ws_tools,
        )
        assert cp_no_ws["messages"][2]["content"][0]["content"] == [sr_omitted]

    # base64 画像は JPEG/PNG/GIF/WebP のみ受理し、非対応 media_type は保存前にエラーへ変換する
    for media_type, ok in (("image/jpeg", True), ("image/png", True), ("image/gif", True), ("image/webp", True), ("image/svg+xml", False), ("image/bmp", False)):
        img_block = {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": "AAAA"}}
        cp_img = run_sr_case(
            [{"stop_reason": "tool_use", "content": [tool(1)]}, {"stop_reason": "end_turn", "content": []}],
            lambda _k, _a, b=img_block: [copy.deepcopy(b)],
        )
        res_img = cp_img["messages"][2]["content"][0]
        if ok:
            assert res_img["content"] == [img_block] and "is_error" not in res_img, (media_type, res_img)
        else:
            assert res_img["is_error"] is True and res_img["content"] == fixed_msg, (media_type, res_img)
            assert media_type not in json.dumps(cp_img["messages"])

    # Files API ベータ有効時はカスタムツールの file ソース(image / document)を受理し、ベータなし・browser/computer では拒否する
    file_img = {"type": "image", "source": {"type": "file", "file_id": "file_01img"}}
    file_doc = {"type": "document", "source": {"type": "file", "file_id": "file_01doc"}}
    def run_betas_case(replies_seq, tool_fn, betas=None):
        reqs = []
        def b_call(body, betas=None):
            reqs.append((copy.deepcopy(body), betas))
            return replies_seq[len(reqs) - 1]
        b_scope = {"call": b_call, "copy": copy}
        exec(compile(ast.Module(body=[fn], type_ignores=[]), "example", "exec"), b_scope)
        cp = {}
        b_scope["agent_loop"]("task", [], tool_fn, max_turns=2, checkpoint=cp, betas=betas)
        return cp, reqs
    cp_file_ok, reqs_file_ok = run_betas_case(
        [{"stop_reason": "tool_use", "content": [tool(1), tool(2)]}, {"stop_reason": "end_turn", "content": []}],
        lambda _k, a: [copy.deepcopy(file_img)] if a["n"] == 1 else [copy.deepcopy(file_doc)],
        betas=["files-api-2025-04-14"],
    )
    expected_file_ok = [
        {"type": "tool_result", "tool_use_id": "t1", "content": [file_img]},
        {"type": "tool_result", "tool_use_id": "t2", "content": [file_doc]},
    ]
    assert cp_file_ok["messages"][2]["content"] == expected_file_ok
    assert len(reqs_file_ok) == 2
    assert reqs_file_ok[1][1] == ["files-api-2025-04-14"]
    assert reqs_file_ok[1][0]["messages"][2]["content"] == expected_file_ok
    cp_file_no_beta, _ = run_betas_case(
        [{"stop_reason": "tool_use", "content": [tool(1), tool(2)]}, {"stop_reason": "end_turn", "content": []}],
        lambda _k, a: [copy.deepcopy(file_img)] if a["n"] == 1 else [copy.deepcopy(file_doc)],
    )
    assert cp_file_no_beta["messages"][2]["content"] == [
        {"type": "tool_result", "tool_use_id": "t1", "content": fixed_msg, "is_error": True},
        {"type": "tool_result", "tool_use_id": "t2", "content": fixed_msg, "is_error": True},
    ]
    cp_file_toolsets, _ = run_betas_case(
        [{"stop_reason": "tool_use", "content": [tool(1, name="click", toolset="browser"), tool(2, name="click", toolset="computer")]}, {"stop_reason": "end_turn", "content": []}],
        lambda _k, _a: [copy.deepcopy(file_img)],
        betas=["files-api-2025-04-14"],
    )
    assert cp_file_toolsets["messages"][2]["content"] == [
        {"type": "tool_result", "tool_use_id": "t1", "toolset_name": "browser", "content": fixed_msg, "is_error": True},
        {"type": "tool_result", "tool_use_id": "t2", "toolset_name": "computer", "content": fixed_msg, "is_error": True},
    ]

    # text ソースの document は media_type == "text/plain" のみ受理し、base64 ソースの検証は維持する
    for doc_block, ok in (
        ({"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "hello"}}, True),
        ({"type": "document", "source": {"type": "text", "media_type": "text/markdown", "data": "# hi"}}, False),
        ({"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": 123}}, False),
        ({"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": "JVBERi0="}}, True),
    ):
        cp_doc = run_sr_case(
            [{"stop_reason": "tool_use", "content": [tool(1)]}, {"stop_reason": "end_turn", "content": []}],
            lambda _k, _a, b=doc_block: [copy.deepcopy(b)],
        )
        res_doc = cp_doc["messages"][2]["content"][0]
        if ok:
            assert res_doc == {"type": "tool_result", "tool_use_id": "t1", "content": [doc_block]}, (doc_block, res_doc)
        else:
            assert res_doc == {"type": "tool_result", "tool_use_id": "t1", "content": fixed_msg, "is_error": True}, (doc_block, res_doc)

    # browser_state の tab_opened.tab_id は new_tab 以外の browser 結果でも tabs に存在しなければ拒否する
    bad_opened_state = [{"type": "browser_state", "tabs": [{"tab_id": "tab1", "title": "Example", "url": "https://example.com", "active": True}], "state_changes": [{"type": "tab_opened", "tab_id": "tab_missing"}]}]
    cp_bad_opened = run_sr_case(
        [{"stop_reason": "tool_use", "content": [tool(1, name="click", toolset="browser")]}, {"stop_reason": "end_turn", "content": []}],
        lambda _k, _a: copy.deepcopy(bad_opened_state),
    )
    res_bo = cp_bad_opened["messages"][2]["content"][0]
    assert res_bo == {"type": "tool_result", "tool_use_id": "t1", "toolset_name": "browser", "content": fixed_msg, "is_error": True}
    assert "tab_missing" not in json.dumps(cp_bad_opened["messages"])
finally:
    logger.removeHandler(handler)
`,
    examples()
  );
});
