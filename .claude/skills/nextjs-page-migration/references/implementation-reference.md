# Next.js ページ移行 — 詳細実装リファレンス

**用途:** SKILL.md から移動した詳細実装コード・コマンドの完全バージョン。
SKILL.md 内の「→ references/implementation-reference.md 参照」が示す実装はここに収録。

---

## CSS Module 地雷チェック — var() 参照確認コマンド

bun run build は通っても実行時に透明・崩壊する無音バグを防ぐスクリプト。

```bash
css_file=${1:-}
if [ -z "$css_file" ] || [ ! -f "$css_file" ]; then
  echo "Usage: $0 <path-to-page.module.css>" >&2
  exit 1
fi

# page.module.css 内で定義されているローカル変数を抽出
local_vars=$(grep -oE '^\s*--[a-zA-Z0-9_-]+\s*:' "$css_file" \
  | sed -E 's/^\s*(--[a-zA-Z0-9_-]+)\s*:/\1/' | sort -u)

# 未定義変数だけを出力（ローカル定義でも globals.css 定義でもないもの）
for var in $(grep -oE 'var\(\s*--[a-zA-Z0-9_-]+' "$css_file" \
  | sed -E 's/var\(\s*(--[a-zA-Z0-9_-]+)/\1/' | sort -u); do
  echo "$local_vars" | grep -qWx -- "$var" && continue
  grep -q -- "$var:" web-next/app/globals.css || echo "未定義の変数: $var"
done
```

---

## Playwright 実測配信コマンド（Step 6 詳細）

CSS 視覚バグを疑うとき（中央寄せ・はみ出し・カラム幅）は静的ビルドを別ポートで配信し、
Playwright で描画座標を実測する。dev サーバーは負荷でクラッシュしやすいので静的配信を使う。

```bash
# 1) 静的ビルドを配信（クリーンURL を *.html にマップする簡易サーバ）
(cd web-next && bun run build)
(cd web-next && python3 -c "import http.server,os;R=os.path.abspath('out');H=type('H',(http.server.SimpleHTTPRequestHandler,),{'translate_path':lambda s,p:(lambda f:f+'.html' if os.path.isfile(f+'.html') else (os.path.join(f,'index.html') if os.path.isdir(f) else f))(os.path.join(R,p.split('?')[0].strip('/')) or R),'log_message':lambda *a:None});http.server.HTTPServer(('127.0.0.1',8099),H).serve_forever()") &
server_pid=$!
cleanup() {
  kill "$server_pid" 2>/dev/null || true
  wait "$server_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# サーバーが 8099 番ポートで応答するまで待つ
attempt=0
until curl -fsS http://127.0.0.1:8099/ >/dev/null; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 50 ]; then
    echo "静的サーバーが起動しませんでした" >&2
    exit 1
  fi
  sleep 0.2
done

# 2) scraper の Playwright で各要素の bounding box を測る
(cd scraper && uv run python <検証スクリプト>)
```

判定の目安:

- `|leftGap - rightGap| > 16px` → 左右非対称（左寄せ疑い）
- `svg.right > wrapper.right` → SVG が切れている
- `<p> を直接子に持つ最幅要素 > 1520px`（1920 幅時）→ 本文が広すぎ

ヒーローのメタ/バッジ行の左寄せは意図的なので除外する。

---

## TocObserver 完全実装

Intersection Observer で TOC アクティブ項目をハイライトするクライアントコンポーネント。
page.tsx は Server Component のまま保ち metadata 静的エクスポートを維持する設計。

```tsx
// TocObserver.tsx（page.tsx と同一ディレクトリに配置）
"use client";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll("section.chapter");
    const links = Array.from(document.querySelectorAll(`.${styles.tocLink}`));
    const intersecting = new Set<Element>();
    if (links.length > 0) links[0].classList.add(styles.tocLinkActive);

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) intersecting.add(entry.target);
        else intersecting.delete(entry.target);
      }

      const [uppermost] = [...intersecting].sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
      );
      if (!uppermost) return;

      for (const link of links) {
        link.classList.toggle(
          styles.tocLinkActive,
          link.getAttribute("href") === `#${uppermost.id}`
        );
      }
    }, { rootMargin: "-15% 0px -70% 0px", threshold: 0 });

    for (const sec of sections) observer.observe(sec);
    return () => observer.disconnect();
  }, []);
  return null;
}
```

呼び出し方 (page.tsx 側):

```tsx
import TocObserver from "./TocObserver";

export default async function Page() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      {/* ... */}
    </div>
  );
}
```

---

## WAI-ARIA タブ UI 完全実装（Roving tabindex パターン）

```tsx
const AUTOMATIC_ACTIVATION: boolean = false; // false: manual、true: automatic
const [focusedIndex, setFocusedIndex] = useState(() =>
  Math.max(0, TABS.findIndex((tab) => tab.id === active))
);

const focusTab = (index: number) => {
  const nextIndex = (index + TABS.length) % TABS.length;
  const next = TABS[nextIndex];
  setFocusedIndex(nextIndex);
  if (AUTOMATIC_ACTIVATION) setActive(next.id);
  document.getElementById(`tab-${next.id}`)?.focus();
};

const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    focusTab(index + 1);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    focusTab(index - 1);
  } else if (event.key === "Home") {
    event.preventDefault();
    focusTab(0);
  } else if (event.key === "End") {
    event.preventDefault();
    focusTab(TABS.length - 1);
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    setActive(TABS[index].id);
  }
};

<div role="tablist">
  {TABS.map((t, index) => (
    <button
      key={t.id}
      id={`tab-${t.id}`}
      role="tab"
      aria-selected={active === t.id}
      aria-controls={`panel-${t.id}`}
      tabIndex={focusedIndex === index ? 0 : -1}
      onFocus={() => setFocusedIndex(index)}
      onClick={() => {
        setFocusedIndex(index);
        setActive(t.id);
      }}
      onKeyDown={(event) => handleTabKeyDown(event, index)}
    >
      {t.label}
    </button>
  ))}
</div>
<div id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`}>
  ...
</div>
```

ステップ現在地: `aria-current={isActive ? "step" : undefined}` —
undefined で属性自体を消す（false だと aria-current="false" が出力される）。

WAI-ARIA 使い分け早見表:

| UI パターン | 正しい ARIA | 誤りやすい代替 |
|---|---|---|
| チェックボタン (on/off) | `aria-pressed={bool}` | `aria-checked`, `aria-selected` |
| タブ切り替え | `role="tab"` + `aria-selected` | `aria-pressed`, `aria-current` |
| ステップ現在地 | `aria-current="step"` | `aria-selected`, `aria-pressed` |

---

## 手書き図解（非 Mermaid）中央寄せ CSS パターン（Step 4(b) 詳細）

命名がバラバラ（.flow / .flowRow / .hfFlow / .archRow / .decisionTree ...）なので
クラス名で探さない。「色付きボックスが横に並ぶ図」を見つけたら中央寄せする。

```css
/* パターン1: 1行の横並び（min-width:max-content → はみ出し得る）
   収まるとき中央寄せ、はみ出すとき親の overflow-x:auto で横スクロール */
.flow {
  display: flex;
  min-width: max-content;
  width: fit-content;      /* 追加 */
  margin-inline: auto;     /* 追加（中央寄せ） */
}

/* パターン2: 折り返す横並び（flex-wrap:wrap） */
.flowRow {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* 追加 */
}
```

判断基準:

- 左寄せが正しい図解: 縦タイムライン・積層バー・ファイルツリー・箇条書き → 触らない
- ブロックごと中央寄せ（決定木など): `.decisionTree { width: fit-content; max-width: 100%; margin: 0 auto }`

---

## コードブロック構造 完全実装例

```tsx
<div className={styles.codeWrap}>
  <div className={styles.codeBar}>
    <span>ファイル名.md</span>
    <span className={styles.codeLang}>YAML</span>
  </div>
  <div className={styles.codeBody}>
    <div className={styles.codeLine}><span className={styles.cs}>---</span></div>
    <div className={styles.codeLine}>
      <span className={styles.cm}>name</span>
      <span>{": "}</span>
      <span className={styles.cv}>{"My Agent"}</span>
    </div>
  </div>
</div>
```

.codeBar / .codeBody / .codeLine には必ず等幅フォント
（font-family: var(--font-mono), "JetBrains Mono", monospace）を適用。
.codeBody には line-height: 1.65 等を指定する。

---

## フッター CSS 完全実装例

```css
.pageFooter {
  max-width: 100%;
  margin: 0 auto;
  padding: 40px 56px 80px;
  color: var(--txt3);
  font-size: 12.5px;
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  text-align: center;
  border-top: 1px solid var(--border);
  line-height: 1.8;
  background: #050b12;
}
```

---

## 関連ドキュメント

- `.claude/rules/tdd-mandatory-cycle.md` — TDD 必須サイクル & コミット分割ルール
- `.claude/rules/mermaid-diagram-layout.md` — Mermaid レイアウト不変条件
- `.claude/rules/migration-progress-sync.md` — PROGRESS.md 同期ルール
- `.claude/skills/fix-mermaid/SKILL.md` — Mermaid 修正・スタイリング詳細
