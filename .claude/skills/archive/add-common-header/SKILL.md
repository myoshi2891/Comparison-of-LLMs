---
name: add-common-header
description: >
  [DEPRECATED — Phase A–F 移行期間中は使用しない]
  This skill targets legacy/shared/common-header.{js,css}, which was superseded by
  web-next/components/site/SiteHeader.tsx in Phase A (commit db67dd0). The legacy/
  directory is now frozen (.gitignore) and editing it violates the CLAUDE.md migration
  rules. For Next.js guide page navigation work, use /nextjs-page-migration instead.
  This skill will be re-evaluated (or removed) after Phase F cutover.
deprecated: true
invocation: explicit
allowed-tools:
  - Read
  - Edit
  - Bash
---

> ⚠️ **DEPRECATED (Phase A 以降)**: 本スキルが対象とする `legacy/shared/common-header.{js,css}` は
> Phase A（commit `db67dd0`）で `web-next/components/site/SiteHeader.tsx` + `DisclaimerBanner.tsx` +
> `nav-links.ts` に置換された。`legacy/` は `.gitignore` 済で編集禁止。
>
> - Next.js 側のナビ更新: `web-next/components/site/nav-links.ts` を編集（Zod `NavLinkSchema[]` 準拠）
> - ガイドページ移行: `/nextjs-page-migration` を使用
> - 本スキルは Phase F カットオーバー後に削除または再定義する
>
> 以下の手順は **Phase F 完了までは実行しない**（参照用に保持）。

# 共通ヘッダー・ディスクレイマー追加ガイド

## 背景

このプロジェクトでは、すべてのHTMLファイルに統一されたナビゲーションヘッダーと注意文（ディスクレイマー）を表示するため、`shared/common-header.js` と `shared/common-header.css` を使用しています。

### 仕組み

1. **自動生成**: `shared/common-header.js` がページ読み込み時に以下を自動生成
   - ヘッダーナビゲーション（"LLM Studies" ブランド + ドロップダウンメニュー）
   - ディスクレイマー（黄色い注意文バナー）
   - レスポンシブ対応（デスクトップ: hover、モバイル: ハンバーガーメニュー）

2. **HTMLファイル側の設定**: 2行のコードを追加するだけで自動的に機能

   ```html
   <link rel="stylesheet" href="../shared/common-header.css" />
   <script src="../shared/common-header.js" defer></script>
   ```

3. **ドロップダウンメニュー管理**: `defaultLinks` 配列で各カテゴリのリンクを定義

## 手順

### Step 1: HTMLファイルへの共通ヘッダー追加

対象HTMLファイルの `</head>` タグの位置を特定し、その直前に以下のコードを挿入します。

#### 1-1. `</head>` タグの位置を検索

```bash
grep -n "</head>" <ファイルパス>
```

返された行番号の前後数行を Read ツールで確認します。

#### 1-2. 共通ヘッダーコードを挿入

**サブディレクトリ内のHTMLファイル（claude/, gemini/, copilot/, codex/）の場合:**

```html
    </style>
    <!-- Common Header Assets -->
    <link rel="stylesheet" href="../shared/common-header.css" />
    <script src="../shared/common-header.js" defer></script>
  </head>
```

**ルートディレクトリのHTMLファイルの場合:**

```html
    </style>
    <!-- Common Header Assets -->
    <link rel="stylesheet" href="shared/common-header.css" />
    <script src="shared/common-header.js" defer></script>
  </head>
```

**重要な注意点:**

- `</style>` タグと `</head>` タグの間に挿入
- パスをファイルの位置に応じて調整（`../shared/` または `shared/`）
- `defer` 属性を必ず含める（JavaScriptの読み込みタイミング制御）

### Step 2: ドロップダウンメニューへのリンク追加（必要な場合）

新規HTMLファイルをドロップダウンメニューに追加する場合は、`shared/common-header.js` の `defaultLinks` 配列を編集します。

#### 2-1. 該当カテゴリを特定

`shared/common-header.js` の `defaultLinks` 配列から、追加先カテゴリを検索します:

| カテゴリ | 検索キー | 例 |
| --------- | ----------- | ----- |
| Claude | `name: 'Claude'` | claude-cowork-guide.html |
| Gemini | `name: 'Gemini'` | antigravity-guide.html |
| Codex | `name: 'Codex'` | codex の各ドキュメント |
| Copilot | `name: 'Copilot'` | github-copilot.html |

**検索方法**:

```bash
grep -n "name: 'Claude'" shared/common-header.js
```

返された行番号付近を Read ツールで確認し、`children` 配列を特定します。

#### 2-2. リンクを追加

該当カテゴリの `children` 配列の末尾に新しいリンクオブジェクトを追加します。

**テンプレート:**

```javascript
{
  name: 'カテゴリ名',
  children: [
    { name: 'Skill', href: '/category/skill.html' },
    { name: 'Agent', href: '/category/agent.html' },
    // 既存リンク...
    { name: '新規リンク名', href: '/category/new-file.html' },  // ← 追加
  ],
},
```

**リンク名の命名規則:**

- 英語で統一
- 短くわかりやすい（1-3語）
- 既存パターンに合わせる: "Skill", "Agent", "Skill Guide", "Cowork Guide", "Antigravity" など

**href の形式:**

- 絶対パス（`/` から始まる）
- 例: `/claude/claude-cowork-guide.html`

#### 2-3. 編集例

Claude カテゴリに "Cowork Guide" を追加する場合:

```javascript
{
  name: 'Claude',
  children: [
    { name: 'Skill', href: '/claude/skill.html' },
    { name: 'Agent', href: '/claude/agent.html' },
    { name: 'Skill Guide', href: '/claude/skill-guide-for-claude.html' },
    { name: 'Skill Guide (中級)', href: '/claude/skill-guide-of-claude-for-intermediate.html' },
    { name: 'Cowork Guide', href: '/claude/claude-cowork-guide.html' },  // ← 追加
  ],
},
```

## チェックリスト

- [ ] HTMLファイルに `<link rel="stylesheet" href="../shared/common-header.css" />` を追加
- [ ] HTMLファイルに `<script src="../shared/common-header.js" defer></script>` を追加
- [ ] パスがファイル位置に応じて正しい（`../shared/` または `shared/`）
- [ ] `defer` 属性が含まれている
- [ ] `</style>` と `</head>` の間に挿入されている
- [ ] ドロップダウンメニューに追加する場合、適切なカテゴリに追加している
- [ ] リンク名が既存パターンに合っている
- [ ] `href` が正しい絶対パス（`/` から始まる）
- [ ] `children` 配列の構文が正しい（カンマ、括弧）

## 検証方法

ブラウザで対象HTMLファイルを開いて、以下を確認します:

### 1. ヘッダー部分

- ✓ 黒いナビゲーションバーが上部に固定表示される
- ✓ "LLM Studies" ブランドロゴが左端に表示される
- ✓ ドロップダウンメニュー（Claude▾, Gemini▾, Codex▾, Copilot▾）が表示される
- ✓ "Git Worktree"、"GitHub↗" リンクが表示される

### 2. ディスクレイマー部分

- ✓ 黄色い注意文バナーがヘッダー直下に表示される
- ✓ テキスト内容: "⚠ 本サイトは個人開発の参考用に作成したものです。必ず各社公式ページで最新の料金/仕様をご確認ください。情報の正確性は保証しません。本サイトの利用による損害等について一切の責任を負いません。"

### 3. ドロップダウンメニュー（追加した場合）

**デスクトップ環境:**

- ✓ 該当カテゴリにマウスホバーで新規リンクが表示される
- ✓ リンクをクリックして正しいページに遷移する

**モバイル環境（幅768px以下）:**

- ✓ ハンバーガーメニューアイコン（三本線）が表示される
- ✓ クリックでメニューが展開される
- ✓ ドロップダウンが縦並びアコーディオン形式で表示される

### 4. アクティブページのハイライト

- ✓ 現在のページに対応するナビゲーションリンクが青色（`#58a6ff`）でハイライトされる

## トラブルシューティング

### ヘッダーが表示されない

**原因:**

- パスが間違っている（`../shared/` vs `shared/`）
- `defer` 属性が欠けている
- `</head>` の後に挿入してしまった

**解決策:**

- ファイルの位置を確認してパスを修正
- `defer` 属性を追加
- `</head>` の前に挿入されているか確認

### ドロップダウンにリンクが表示されない

**原因:**

- `defaultLinks` の配列構文が間違っている（カンマ忘れ、括弧の不一致）
- `href` が相対パスになっている
- `children` 配列の外に追加してしまった

**解決策:**

- JavaScript の構文を確認（カンマ、括弧）
- `href` を絶対パス（`/` から始まる）に修正
- `children` 配列内に正しく追加されているか確認

### スタイルが崩れる

**原因:**

- CSS の読み込み順序が間違っている
- パスが間違っている

**解決策:**

- `common-header.css` が `</head>` の直前に読み込まれているか確認
- パスが正しいか確認（開発者ツールのネットワークタブで404エラーを確認）

## 関連ファイル

- `shared/common-header.js` - ヘッダー・ディスクレイマー生成スクリプト（328行）
- `shared/common-header.css` - 共通ヘッダー用スタイル（314行）
- プロジェクト内の既存HTMLファイル - 参考実装例
