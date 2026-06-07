---
name: cdn-sri-mermaid-fix
description: >
  Use this skill to apply Subresource Integrity (SRI) integrity hashes and crossorigin attributes to external CDN assets (Prism, Tabler Icons, Mermaid), or to fix diagram rendering issues caused by Mermaid v10+ ESM migration vs v9 UMD API compatibility problems.
  Trigger when the user mentions: "SRI", "integrity", "crossorigin", "改ざん対策", "セキュリティ強化", "CDN", "Prism", "Tabler Icons", "mermaid", "mermaid 描画", "undefined" in diagrams, or refers to CDN vulnerability/hashes.
---

# CDN 資産への SRI 属性の適用 & Mermaid UMD の API 互換性エラーの回避

このスキルは、静的 HTML ガイド等において外部 CDN 資産を SRI (Subresource Integrity) 属性付きで安全にロードする手順と、Mermaid v9/v10+ の仕様変更に伴う描画エラーを最小限のトークンで回避するための手順を定義します。

## 1. 外部 CDN 資産の SRI ハッシュ値の特定（オフライン制限環境）

開発環境のサンドボックス制限（ローカルでの DNS 解決ブロック等）により、シェル上の `curl` や `wget` または直接の `node` ネットワークリクエストは失敗します。この制約下で正確なハッシュ値を特定・検証する手順は以下の通りです。

### ハッシュ特定手順

1. **`read_url_content` を用いた個別取得**:
   エージェントがプロキシ経由で外部の JS/CSS ファイルを個別に取得します。

```json
{
  "name": "read_url_content",
  "args": {
    "Url": "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js"
  }
}
```

2. **生コードの抽出と Workspace 内への書き出し**:
   `read_url_content` でキャッシュされた markdown ファイル（`.system_generated/steps/{step_index}/content.md`）の9行目付近に、生コードが1行で書き込まれているので、これを `view_file` で読み取り、Workspace 内の一時ファイル（例: `temp_ts.js`）へ `write_to_file` で書き出します。
3. **ローカル Node でのハッシュ計算**:
   Workspace 内に以下のハッシュ計算スクリプト `hash_calc.js` を作成し、実行します。これによって正確なハッシュ（SHA-384 / SHA-512）が得られます。

```javascript
const fs = require('fs');
const crypto = require('crypto');

const content = fs.readFileSync('temp_ts.js');
const sha384 = crypto.createHash('sha384').update(content).digest('base64');
const sha512 = crypto.createHash('sha512').update(content).digest('base64');

console.log(`sha384-${sha384}`);
console.log(`sha512-${sha512}`);
```

4. **ハッシュ計算後の一時ファイルの削除**:
   不要な一時ファイルは必ず削除し、Workspace をクリーンに保ちます。

   **削除コマンド例 (Bash / macOS / Linux):**
   ```bash
   rm -f temp_ts.js hash_calc.js
   ```
   *Note: `-f` フラグを使用することで、ファイルが存在しない場合のエラー出力を防ぎ、安全に削除できます。Windows (PowerShell) 環境では `Remove-Item -ErrorAction SilentlyContinue temp_ts.js, hash_calc.js` などの代替コマンドが利用可能です。*

---

## 2. Mermaid UMD 読み込みの適用と API 互換性の確保

### 背景
* **Mermaid v10+ は ESM のみ**:
  Mermaid v10 以降は UMD/IIFE ビルドが標準で廃止され、`window.mermaid` を公開するグローバル読み込み用の `mermaid.min.js` が存在しません。
* **リポジトリの肥大化対策**:
  Mermaid の dist 資産をローカルに vendoring して相対インポートを行うと、**約24MB** のフォルダが Git に追加され、リポジトリが大幅に肥大化します。
* **解決策**:
  改ざん防止（SRI属性）を適用しつつ、リポジトリを肥大化させずに `window.mermaid` を使って安全に読み込むためには、**Mermaid v9.4.3** の UMD ビルドを使用します。

### API の戻り値仕様 of mermaid.render（重要）
Mermaid のバージョンによって、`mermaid.render` API の戻り値が異なります。

* **v10 以降 (ESM)**:
  `mermaid.render` は非同期関数であり、**`{ svg }` オブジェクト**を返します。
  `const { svg } = await mermaid.render('id', code);`
* **v9 以前 (UMD)**:
  `mermaid.render` は、コールバックを省略した場合、**生成された SVG の HTML文字列**を直接返します。
  `const result = await mermaid.render('id', code);`

#### 堅牢な描画の実装パターン
v9 (文字列) と v10/v11 (オブジェクト) の両方で `undefined` 表示を回避するためのコードは以下の通りです。

```javascript
const result = await mermaid.render('svg-' + id, src);
// 戻り値が文字列ならそのまま、オブジェクトなら .svg プロパティを抽出
const svg = typeof result === 'string' ? result : result.svg;

const target = document.getElementById(id);
if (target) {
  target.innerHTML = svg;
}
```

---

## 3. 既知の安全な SRI ハッシュ値 (SSoT)

以下のハッシュ値は既に検証済みの正確な値です。次回以降はこれらの値を直接利用してタグを適用してください。

### Prism CSS/JS (v1.29.0)
* **prism-tomorrow.min.css**:
  `integrity="sha512-vswe+cgvic/XBoF1OcM/TeJ2FW0OofqAVdCZiEYkd6dwGXthvkSFWOoGGJgS2CW70VK5dQM5Oh+7ne47s74VTg==" crossorigin="anonymous"`
* **prism.min.js**:
  `integrity="sha512-7Z9J3l1+EYfeaPKcGXu3MS/7T+w19WtKQY/n+xzmw4hZhJ9tyYmcUS+4QqAlzhicE5LAfMQSF3iFTK9bQdTxXg==" crossorigin="anonymous"`
* **components/prism-typescript.min.js**:
  `integrity="sha512-zumBX4EW77OyXJKaFkuLzEE/CGm/eFFlE9StXGe8RbhrYvU014ica5eqqKI7Gy4uqeOcdufcKDdSYYuMTkEa4w==" crossorigin="anonymous"`
* **components/prism-bash.min.js**:
  `integrity="sha512-whYhDwtTmlC/NpZlCr6PSsAaLOrfjVg/iXAnC4H/dtiHawpShhT2SlIMbpIhT/IL/NrpdMm+Hq2C13+VKpHTYw==" crossorigin="anonymous"`
* **components/prism-json.min.js**:
  `integrity="sha512-QXFMVAusM85vUYDaNgcYeU3rzSlc+bTV4JvkfJhjxSHlQEo+ig53BtnGkvFTiNJh8D+wv6uWAQ2vJaVmxe8d3w==" crossorigin="anonymous"`
* **components/prism-nginx.min.js**:
  `integrity="sha512-FiVqlerxsba+BjEKw8+ZL01f8XUZScGKfJpZYz9ptAdBSc787nTjepF7ie14lyUJ6/OMVp3FDJ5efvtvsqFXCw==" crossorigin="anonymous"`

### Tabler Icons (v3.19.0)
* **tabler-icons.min.css**:
  `integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous"`

### Mermaid JS (v9.4.3)
* **mermaid.min.js**:
  `integrity="sha512-lr1gBg9uLeq7cCfTulxEDXATlfDzLRLMMY0T0GxHv27+XsKytKuJwIQvSZRNw2C4fZWSMf9C+SPnT10ArLI8Cw==" crossorigin="anonymous"`
