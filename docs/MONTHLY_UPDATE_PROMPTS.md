# 月次更新プロンプト集

> **用途**: 毎月最低 1 回、各画面の情報を最新状態に保つためのプロンプトテンプレート集。  
> **最終更新**: 2026-10-22  
> **次回予定**: 2026-11-01 以降

---

## 使い方

1. 更新したい画面のセクションを開く
2. `## 事前確認` の WebSearch プロンプトで最新情報を取得する
3. `## 更新プロンプト` をそのまま（または差分を追記して）Claude Code に投入する
4. 更新後は `## 検証チェックリスト` を確認してコミットする

**共通制約（全画面共通）**:
- ファイル全体の書き直し禁止。外科的パッチのみ
- `bun run build && bun run typecheck && bun run test && bun run lint` が全て通ること
- **日付・バージョン表記は `metadata` だけでなく本文中の全箇所を更新する**（下記「頻出レビュー指摘」参照）
- 外部リンクは `rel="noopener noreferrer"` を維持すること

---

## 頻出レビュー指摘 & 事前チェック（全画面共通・必読）

過去サイクルで **更新後に別途修正コミットが必要になった典型的な取りこぼし**。着手前・コミット前の両方で確認する。

### 指摘1: 日付/バージョン表記の更新漏れ（最頻出）

「metadata のみ更新」と考えると **本文中に散在する日付表記を見落とす**。日付は最低でも以下 5 系統に分散している:

| 箇所 | 例 |
|---|---|
| `metadata.title` / `metadata.description` | `... 2026` / `2026年X月時点` |
| ヒーロー/ヘッダのバッジ | `<span className={styles.badge}>May 2026 最新</span>` |
| TOC / 目次タイトル | `目次 — SKILL.md 完全ガイド 2026年X月版` |
| SOURCES セクションのラベル | `参考ソース一覧 — 2026年X月更新版` |
| フッター | `Last updated: June 2026` / `最終更新: 2026年X月` |

**事前 grep（対象 page.tsx で必ず実行し、ヒットを全て更新）**:

```bash
cd web-next
grep -nE '(20[0-9]{2}年[0-9]{1,2}月|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* 20[0-9]{2}|Last updated|最終更新|更新版|時点|as of|情報基準日)' app/<path>/page.tsx
```

英語月名（`May`→`June`）と和文（`2026年5月`→`2026年6月`）の**両方**を揃えること。

### 指摘2: JSX の半角スペース消失

テキストと `<strong>` / `<Ext>` などインライン要素が改行で隣接すると、レンダリング時に半角スペースが消える。**要素の直前/直後に明示的に `{" "}` を挿入**する。

```tsx
// NG: 「加え」と<strong>の間の空白が消える
2026-06-18 をもって、無料の Gemini Code Assist（個人）に加え
<strong>Google AI Pro / Ultra 加入者</strong>向けにも

// OK
2026-06-18 をもって、無料の Gemini Code Assist（個人）に加え{" "}
<strong>Google AI Pro / Ultra 加入者</strong>向けにも
```

### 指摘3: 契約テストの完全一致アサート

`page.test.tsx` は `toBe`（完全一致）と `toContain` / `toMatch`（部分一致）が混在する。metadata description やセクション文言を変えると `toBe` が壊れる。**編集前に確認し、同一コミットでテストも同期**する:

```bash
grep -nE 'toBe\(|toContain|toMatch' app/<path>/page.test.tsx
```

### 指摘4: 退役・非推奨になったモデル ID がコード例に残る（2026-10 サイクルで多発）

本文の説明は正しくても、**コード例・config 例・Mermaid のノード名に退役済みのモデル ID が残る**と、読者がコピーした時点で動かない。
着手前に対象ページのモデル ID を洗い出し、各社の公式ライフサイクル表と突き合わせる:

```bash
cd web-next
grep -noE "(gpt-[0-9][a-z0-9.-]*|gemini-[0-9][a-z0-9.-]*|claude-[a-z]+-[0-9-]+|grok-[0-9][a-z0-9.-]*|deepseek-[a-z0-9.-]+|glm-[0-9][a-z0-9.-]*)" app/<path>/*.tsx | sort -u
```

| 参照先（一次情報） | 確認内容 |
|---|---|
| platform.claude.com の Models overview / Model deprecations | 現行・レガシーの Claude モデル ID |
| code.claude.com の Model configuration | `opus` / `sonnet` / `haiku` / `fable` エイリアスの解決先 |
| learn.chatgpt.com の Codex Models | Codex の推奨モデルと退役日 |
| ai.google.dev の Deprecations / Agent Platform の Model versions | Gemini の停止日（**両者で日付が異なる**ためページの文脈に合う方を使う） |
| docs.github.com の Supported AI models | Copilot のモデルピッカーに残っているモデル |
| Microsoft Learn の Model retirement schedule | Foundry の Deprecated（新規顧客不可）/ Retired（410 Gone） |

- コピー用の文字列定数（`CODE_TEXT_*` / `text={...}`）と表示用 JSX の**両方**を置き換える
- 公式が後継を指定していない場合に移行先を書くときは「移行先の例」と表記し、公式指定と区別する

### 指摘5: 「情報基準日」と「最終更新」を混同しない

- **情報基準日・「YYYY年M月時点」**: 原本を書いた時点の記録。原本固定の契約テストやページ移行時の決定（CLAUDE.md）で維持されているため、**月次確認だけでは書き換えない**
- **最終更新・更新日**: 本文を実際に編集したときだけ更新する
- **確認日**: registry の `lastReviewed`（ページ上部の鮮度バッジに表示される）で表す。内容に変更がなくても確認したら更新する
- 期日を過ぎた「予定」は「予定されていた（YYYY年M月時点で期日経過済み）」のように事実ベースへ改める。結果を一次情報で確認できない場合は、完了したと断定しない

### コミット前の最終スイープ

```bash
cd web-next
# 旧月表記が残っていないか（例: 前月が 5 月なら "2026年5月" "May 2026" を検索）
grep -rnE '(2026年5月|May 2026|Mar 2026)' app/<path>/  # 空になるまで潰す
bun run test app/<path> >/tmp/t.log 2>&1; echo "exit=$?"   # tail はexit code を隠すため必ず echo で確認
```

---

## 画面一覧

| # | URL | ページタイトル（概要） | 区分 | 確認日（registry `lastReviewed`） |
|---|-----|----------------------|------|--------|
| 1 | `/` | AIモデル 時間別コスト 計算機（ホーム） | Home | 2026-10-21 |
| 2 | `/claude/skill` | Claude Code AI仕様駆動開発 — マークダウンファイル完全ガイド | Providers / Claude | 2026-10-22 |
| 3 | `/claude/skill-guide` | SKILL.md 完全解説ガイド — Claude Code | Providers / Claude | 2026-10-22 |
| 4 | `/claude/skill-guide-intermediate` | SKILL.md 中級者完全攻略ガイド — Claude Code | Providers / Claude | 2026-10-22 |
| 5 | `/claude/agent` | Claude Code サブエージェント Markdown ベストプラクティス | Providers / Claude | 2026-10-22 |
| 6 | `/claude/cowork-guide` | Claude Cowork 完全入門ガイド | Providers / Claude | 2026-10-22 |
| 7 | `/google/skill` | Google Antigravity × Gemini — マークダウンファイル完全ガイド | Providers / Google | 2026-10-22 |
| 8 | `/google/skill-guide` | SKILL.md 完全解剖ガイド（Gemini CLI 中級者以上向け） | Providers / Google | 2026-10-22 |
| 9 | `/google/antigravity-best-practices` | Google Antigravity ベストプラクティス（旧 `/google/skill-guide-intermediate` の後継） | Providers / Google | 2026-10-22 |
| 10 | `/google/agent` | Gemini マルチエージェント開発（ADK / A2A） | Providers / Google | 2026-10-22 |
| 11 | `/google/antigravity-guide` | Google Antigravity — AI仕様駆動開発 ベストプラクティス完全ガイド | Providers / Google | 2026-10-22 |
| 12 | `/codex/skill` | OpenAI Codex — AI仕様駆動開発 マークダウンファイル完全ガイド | Providers / Codex | 2026-10-22 |
| 13 | `/codex/agent` | OpenAI Codex エージェント開発ガイド | Providers / Codex | 2026-10-22 |
| 14 | `/codex/openai-codex-guide` | OpenAI Codex 完全ガイド 2026 | Providers / Codex | 2026-10-22 |
| 15 | `/copilot/skill` | GitHub Copilot SKILL.md 完全ベストプラクティスガイド | Providers / Microsoft | 2026-10-22 |
| 16 | `/copilot/agent` | GitHub Copilot コーディングエージェント開発ガイド | Providers / Microsoft | 2026-10-22 |
| 17 | `/copilot/github-copilot` | GitHub Copilot 完全ガイド 2026 | Providers / Microsoft | 2026-10-22 |
| 18 | `/copilot/markdown-file-guide` | GitHub Copilot — AI仕様駆動開発 マークダウンファイル完全ガイド | Providers / Microsoft | 2026-10-22 |
| 19 | `/git-worktree` | git worktree × 4プラットフォーム ドキュメント並列開発ガイド | 開発プロセス | 2026-08-07 |
| 20 | `/code-review/tool-pricing` | Code Review ツール料金比較ページ | 開発プロセス | 2026-07-01 |
| 21 | `/code-review/sonar-qube` | SonarQube Code Review 実践ガイド | 開発プロセス | 2026-08-07 |
| 22 | `/code-review/copilot-code-review` | GitHub Copilot Code Review 完全活用ガイド | 開発プロセス | 2026-08-19 |
| 23 | `/code-review/coderabbit-guide` | CodeRabbit 完全活用ガイド | 開発プロセス | 2026-08-07 |
| 24 | `/claude/code-slash-commands` | Claude Code スラッシュコマンド完全ガイド 2026 | Providers / Claude | 2026-05-31（保留） |
| 25 | `/claude/harness-engineering` | ハーネスエンジニアリング完全ガイド 2026 | Providers / Claude | 2026-10-22 |
| 26 | `/claude/managed-agents` | Claude Managed Agents 完全ガイド | Providers / Claude | 2026-10-22 |
| 27 | `/google/agent-harness-engineering` | Gemini Agent Harness Engineering 完全ガイド 2026 | Providers / Google | 2026-10-22 |
| 28 | `/google/antigravity-slash-commands-guide` | Antigravity スラッシュコマンド完全ガイド | Providers / Google | 2026-07-01（保留） |
| 29 | `/google/harness-engineering` | ハーネスエンジニアリング完全ガイド 2026 (Gemini CLI & Antigravity) | Providers / Google | 2026-10-22 |
| 30 | `/codex/harness-engineering` | OpenAI Codex ハーネスエンジニアリング完全ガイド | Providers / Codex | 2026-10-22 |
| 31 | `/google/sandbox-best-practices` | Google AI Sandbox ベストプラクティス完全ガイド 2026 | Providers / Google | 2026-10-22 |
| 32 | `/agent/hermes-agent-advanced-guide` | Hermes Agent 中級・上級者向け完全ガイド | Agent 開発 | 2026-08-10 |
| 33 | `/agent/openclaw-advanced-agent-security-guide` | OpenClaw Agent 高度活用 & セキュリティ完全ガイド | Agent 開発 | 2026-08-01 |
| 34 | `/claude/self-hosted-sandboxes` | Claude セルフホスト型サンドボックス完全ガイド | Providers / Claude | 2026-10-22 |
| 35 | `/vercel/sandbox` | Vercel Sandbox 完全入門ガイド 2026 | Agent 開発 | 2026-07-01 |
| 36 | `/claude/fable-5-best-practices` | Fable 5 Best Practices | Providers / Claude | 2026-10-22 |
| 37 | `/claude/tag-best-practices` | Claude Tag 活用ガイド ― 中級者〜上級者向けベストプラクティス | Providers / Claude | 2026-10-22 |
| 38 | `/google/adk-best-practices` | ADK Best Practices | Providers / Google | 2026-10-22 |
| 39 | `/google/enterprise-agent-platform` | Gemini Enterprise Agent Platform | Providers / Google | 2026-10-22 |
| 40 | `/google/enterprise-agent-platform-intermediate` | Gemini Enterprise Agent Platform (中級) | Providers / Google | 2026-10-22 |
| 41 | `/google/gemma-best-practices-guide` | Gemma Best Practices Guide | Providers / Google | 2026-10-22 |
| 42 | `/google/multi-agent-best-practices` | Gemini マルチエージェント開発 ベストプラクティス完全ガイド | Providers / Google | 2026-10-22 |
| 43 | `/google/notebook-lm` | NotebookLM Guide | Providers / Google | 2026-10-22 |
| 44 | `/google/stitch-guide` | Stitch Guide | Providers / Google | 2026-10-22 |
| 45 | `/model-data/gpt-5-6-best-practices` | GPT-5.6 Best Practices | Providers / Codex | 2026-10-22 |
| 46 | `/infra/microsoft-foundry-best-practices-guide` | Microsoft Foundry 活用ガイド | Providers / Microsoft | 2026-10-22 |
| 47 | `/infra/microsoft-foundry-best-practices-intermediate` | Microsoft Foundry 実践ベストプラクティスガイド | Providers / Microsoft | 2026-10-22 |
| 48 | `/moonshot/kimi-llm-best-practices` | Kimi LLM 徹底ガイド | Providers / Moonshot | 2026-10-22 |
| 49 | `/deepseek/llm-best-practices` | DeepSeek LLM ガイド | Providers / DeepSeek | 2026-10-22 |
| 50 | `/xai/grok-best-practices` | xAI Grok ガイド | Providers / xAI | 2026-10-22 |
| 51 | `/xai/grok-best-practices-intermediate` | xAI Grok API 実践ベストプラクティスガイド | Providers / xAI | 2026-10-22 |
| 52 | `/zhipu/zai-glm-best-practices` | Z.ai (GLM) ベストプラクティス | Providers / Zhipu(GLM) | 2026-10-22 |

Providers ナビ（`group: "Providers"`）の 43 ページのうち 41 ページは 2026-10-22 に月次確認済み。画面 24・28（スラッシュコマンドの 2 ガイド）は**保留**: 基準バージョン（Claude Code v2.1.196 / Gemini CLI v0.44.1）以降のコマンド差分（2026-10 時点の最新は v2.1.306 / v0.65.0）を未検証のため、確認日を据え置いている。なお画面 24 は `/model` のエイリアス解決先（Opus 5.5 等）だけを先行更新しており、ヘッダーの日付バッジ（2026-06-30）・バージョンバッジとの整合はコマンド差分の検証時にあわせて取る。区分・確認日は `web-next/lib/page-registry.ts` から生成した値で、一覧にない registry 登録ページは末尾の「その他の画面」を参照。

---

## 画面 1 — ホーム（コスト計算機）

**ファイル**: `web-next/app/page.tsx` / `web-next/components/HomePage.tsx`  
**URL**: `/`  
**更新頻度**: 毎月（新モデルリリース時は随時）

### 事前確認

```
WebSearch で以下を確認してからプロンプトを実行する:
- Anthropic / OpenAI / Google / AWS / DeepSeek / xAI / Moonshot / Zhipu / Meta / Microsoft の最新 API 価格変更
  （scraper/src/scraper/providers/ の全プロバイダー。google / meta / microsoft は _FALLBACKS 固定のため手動更新）
- 新しく登場した主要 LLM モデル（年を併記）
- USD/JPY レート（自動取得だが大幅変動時は手動確認）
```

### 更新プロンプト

```
web-next/app/page.tsx と web-next/components/HomePage.tsx を読んで現状を把握してください。

以下の作業を行ってください:

1. [スクレイパー実行] scraper/ ディレクトリで `uv run python -m scraper.main --output ../pricing.json` を実行し、
   pricing.json を最新化する

2. [コピー] bash update.sh --no-scrape で web-next/data/pricing.json と
   web-next/public/pricing.json に最新データをコピーする

3. [UI 確認] web-next/components/HomePage.tsx の モデル表示ロジック（ApiTable / SubTable）に
   新規モデル対応漏れがないか確認する
   - 表示名・通貨表記・カラーインデックスが正しいか
   - Zod スキーマ（web-next/lib/pricing.ts）が新フィールドを受け入れるか

4. 型エラーがあれば web-next/types/pricing.ts と web-next/lib/pricing.ts の
   _AssertParity を確認して修正する（Pydantic モデルが SSoT）

変更は最小 diff で。
```

### 検証チェックリスト

- [ ] `bun run build` が成功する
- [ ] `bun run typecheck` がエラーなし
- [ ] `bun run test web-next/components/HomePage` のユニットテスト・統合テストがすべてパスする
- [ ] `bun run test scraper`（スクレイパー側のテスト）がすべてパスする
- [ ] ローカルホスト (`http://localhost:3000/`) で新モデルが UI テーブルに正しく表示されていることを目視確認（通貨表記やカラーインデックスの確認）

---

## 画面 2 — `/claude/skill`（AI仕様駆動開発 マークダウンファイル完全ガイド）

**ファイル**: `web-next/app/claude/skill/page.tsx`  
**URL**: `/claude/skill`  
**更新頻度**: 毎月（Claude Code バージョンアップ時は随時）

### 事前確認

```
以下を WebSearch で確認する:
- Claude Code 最新バージョン番号（例: v2.x.xx）
- CLAUDE.md / MEMORY.md / SKILL.md の仕様変更（Anthropic 公式 changelog）
- 仕様駆動開発（SDD）に関する新しい公式ドキュメントや記事
```

### 更新プロンプト

```
web-next/app/claude/skill/page.tsx を読んでください。

以下を更新してください（外科的 diff のみ）:

1. metadata.title / metadata.description 内のバージョン番号・年月を
   現在の最新版（例: v2.x.xx / 2026年X月）に更新する

2. SOURCES 配列 の各エントリについて:
   - リンク先が生きているか確認（404 になっているものは代替 URL に差し替え）
   - 新しい公式発表・ブログ記事がある場合は SOURCES に追加する（上限: 6件）

3. SDD ワークフロー説明（requirements.md / design.md / tasks.md のフロー）の中で、
   Claude Code 最新版で挙動が変わった箇所があれば更新する

変更は SOURCES 配列と metadata のみに留め、JSX 構造は変えない。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/claude/skill` (claude/skill の契約テスト) がパスする
- [ ] `bun run build` が成功する
- [ ] `bun run lint web-next/app/claude/skill/page.tsx` でリントエラーがないことを確認
- [ ] ローカルホスト (`http://localhost:3000/claude/skill`) を開き、外部リンクに `rel="noopener noreferrer"` が付いていること、および表示崩れがないか目視確認

---

## 画面 3 — `/claude/skill-guide`（SKILL.md 完全解説ガイド）

**ファイル**: `web-next/app/claude/skill-guide/page.tsx`  
**URL**: `/claude/skill-guide`  
**更新頻度**: 毎月（SKILL.md 仕様変更時は随時）

### 事前確認

```
以下を WebSearch で確認する:
- Claude Code の SKILL.md フロントマターフィールド（description / triggers / steps 等）の変更
- 新しいスキルトリガーのパターン（正規表現、自然言語マッチ等）
- 公式サンプル SKILL.md の更新
```

### 更新プロンプト

```
web-next/app/claude/skill-guide/page.tsx を読んでください。

以下を更新してください:

1. metadata のバージョン（Claude Code vX.X.XX）と年月を現在値に更新する

2. SKILL.md のフロントマターフィールド説明:
   - description / triggers / steps / context の説明が最新仕様に合っているか確認
   - 廃止されたフィールドがあれば「非推奨」マークを追加する
   - 新規フィールドがあれば新しいカードとして追加する

3. コードブロック内のサンプル SKILL.md テンプレートが
   最新フロントマター仕様に沿っているか確認・更新する

変更は metadata・フィールド説明テキスト・サンプルコードブロックのみ。
```

### 検証チェックリスト

- [ ] `bun run test` パス
- [ ] `bun run typecheck` エラーなし

---

## 画面 4 — `/claude/skill-guide-intermediate`（SKILL.md 中級者完全攻略ガイド）

**ファイル**: `web-next/app/claude/skill-guide-intermediate/page.tsx`  
**URL**: `/claude/skill-guide-intermediate`  
**更新頻度**: 2〜3 ヶ月ごと（高度な機能の変更時）

### 事前確認

```
以下を WebSearch で確認する:
- Progressive Disclosure / context:fork / Dynamic Context Injection の最新サポート状況
- エンタープライズプロビジョニング（SKILL.md の組織配布）の仕様変更
- トークン経済・キャッシュ最適化に関する最新知見
```

### 更新プロンプト

```
web-next/app/claude/skill-guide-intermediate/page.tsx を読んでください。

以下を更新してください:

1. metadata のバージョン・年月を最新化する

2. 「Progressive Disclosure（3段階ローディング）」セクション:
   - 最新の Claude Code でこのパターンが有効かどうか確認
   - 変更があれば説明テキストを更新する

3. 「context:fork」「Dynamic Context Injection」セクション:
   - 該当機能が現バージョンで動作するか確認
   - 非推奨になった場合は代替パターンを追記する

4. SOURCES のリンク切れ確認・新規文献の追加

変更は metadata・説明テキスト・SOURCES のみ。
```

### 検証チェックリスト

- [ ] `bun run test` パス
- [ ] `bun run build` 成功

---

## 画面 5 — `/claude/agent`（サブエージェント Markdown ベストプラクティス）

**ファイル**: `web-next/app/claude/agent/page.tsx`  
**URL**: `/claude/agent`  
**更新頻度**: 毎月（Claude Code エージェント機能は頻繁に変更あり）

### 事前確認

```
以下を WebSearch で確認する:
- Claude Code 最新 changelog（sub-agents / Agent Teams / hooks 関連）
- 新しいスラッシュコマンド（/effort, /loop 等）の仕様変更
- 1M トークンコンテキストの利用可能モデル変更
- MCP Elicitation / PostCompact Hook の最新サポート状況
- HTTP Hooks の仕様変更
```

### 更新プロンプト

```
web-next/app/claude/agent/page.tsx を読んでください。
ファイルが大きい場合は head -100 で冒頭の SOURCES 定義と
データカード定義 (CARDS 配列や ITEMS 配列) の構造だけ先に把握してください。

以下を更新してください:

1. metadata.title / description のバージョン番号（例: v2.1.76 → v2.X.XX）と
   年月を最新値に更新する

2. 「新機能カード」セクション（/effort, /loop, HTTP Hooks, Voice Mode 等）:
   - バージョン番号タグ（例: "v2.1.75"）を最新版に更新する
   - 廃止・変更された機能は説明テキストを修正する
   - 新機能があれば既存カードと同じ構造で追加する（上限: 現在のカード数 + 2）

3. SOURCES 配列:
   - リンク切れを修正する（代替 URL に差し替え）
   - Anthropic 公式 CHANGELOG の最新バージョンエントリを追加する
   - 古いエントリ（1年以上前）は削除してよい

変更は metadata・バージョンタグ・説明テキスト・SOURCES のみ。
JSX コンポーネント定義（関数・型）は変更しない。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/claude/agent` (agent ページの契約テスト) がパスする
- [ ] `bun run build` が成功する
- [ ] `bun run typecheck` でエラーなし
- [ ] ローカルホスト (`http://localhost:3000/claude/agent`) で、新機能カードが正常にレンダリングされ、レイアウトが崩れていないか確認

---

## 画面 6 — `/claude/cowork-guide`（Claude Cowork 完全入門ガイド）

**ファイル**: `web-next/app/claude/cowork-guide/page.tsx`  
**URL**: `/claude/cowork-guide`  
**更新頻度**: 2〜3 ヶ月ごと（Cowork の正式リリース・機能追加時）

### 事前確認

```
以下を WebSearch で確認する:
- Anthropic "Cowork" の最新リリース状況（ベータ → GA など）
- Cowork の新機能（ファイル操作・タスク自動化・連携ツール）
- 公式ドキュメント URL の変更
```

### 更新プロンプト

```
web-next/app/claude/cowork-guide/page.tsx を読んでください。

以下を更新してください:

1. metadata のバージョン・年月を更新する

2. Cowork の現在のリリースステータス（ベータ / GA）の表記を
   実際のステータスに合わせて修正する

3. 機能説明セクション（ファイル管理・タスク自動化等）で
   現バージョンで挙動が変わった点を修正する

4. SOURCES のリンク切れ修正・新規公式ドキュメント追加

変更は metadata・ステータス表記・機能説明テキスト・SOURCES のみ。
```

### 検証チェックリスト

- [ ] `bun run test` パス
- [ ] `bun run build` 成功

---

## 画面 7 — `/google/skill`（Google Antigravity × Gemini マークダウンファイル完全ガイド）

**ファイル**: `web-next/app/google/skill/page.tsx`  
**URL**: `/google/skill`  
**更新頻度**: 毎月（Antigravity / Gemini CLI バージョンアップ時は随時）

### 事前確認

```
以下を WebSearch で確認する:
- Google Antigravity 最新バージョン（例: v1.xx.x）
- Gemini CLI 最新バージョン（例: v0.xx.x）および最新モデル名（Gemini 3.x Pro 等）
- GEMINI.md / Rules / Workflows / Knowledge Base の仕様変更
- Google AI Studio の新機能でガイドに影響するもの
```

### 更新プロンプト

```
web-next/app/google/skill/page.tsx を読んでください。

以下を更新してください:

1. metadata.title / description 内のバージョン番号
   （例: "Gemini 3.1 Pro"・"v1.20.3" 等）を最新値に更新する

2. SOURCES 配列:
   - Google Antigravity 公式リリースノートの最新版エントリを追加する
   - リンク切れを修正する

3. マークダウンファイル（GEMINI.md / Rules / Workflows 等）の説明で
   最新 Antigravity バージョンで変更された点を修正する

変更は metadata・バージョン番号テキスト・SOURCES のみ。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/google/skill` (google/skill の契約テスト) がパスする
- [ ] `bun run build` が成功する
- [ ] ローカルホスト (`http://localhost:3000/google/skill`) を開き、マークダウンファイルの仕様解説表示や外部リンクが壊れていないか目視確認

---

## 画面 8 — `/google/skill-guide`（SKILL.md 完全解剖ガイド — Gemini CLI 中級者）

**ファイル**: `web-next/app/google/skill-guide/page.tsx`  
**URL**: `/google/skill-guide`  
**更新頻度**: 2〜3 ヶ月ごと

### 事前確認

```
以下を WebSearch で確認する:
- Gemini CLI の SKILL.md フロントマター仕様の変更（v0.34.0 以降）
- Progressive Disclosure・トークン最適化パターンの Gemini 側での変更
- Antigravity IDE の SKILL.md サポート状況の変化
```

### 更新プロンプト

```
web-next/app/google/skill-guide/page.tsx を読んでください。

以下を更新してください:

1. metadata のバージョン番号（"Gemini CLI v0.34.0 & Antigravity v1.20.3"）を
   最新版に更新する

2. フロントマターフィールド説明（description / triggers / steps 等）で
   最新 Gemini CLI に合わせて変更された点を修正する

3. SOURCES のリンク切れ修正・新規文献の追加（上限: 既存数 + 1）

変更は metadata・フィールド説明・SOURCES のみ。
```

### 検証チェックリスト

- [ ] `bun run test` パス
- [ ] `bun run build` 成功

---

## 画面 9 — `/google/antigravity-best-practices`（Google Antigravity ベストプラクティス）

> 旧 `/google/skill-guide-intermediate` は `acc461c0` で本ページに置き換えられ、旧 URL は `netlify.toml` でリダイレクト済み。

**ファイル**: `web-next/app/google/antigravity-best-practices/page.tsx`  
**URL**: `/google/antigravity-best-practices`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- Google Antigravity（IDE / CLI / デスクトップアプリ）の最新版と対応モデル（latest 2026）
- サンドボックス・権限設定の対応 OS とプレビュー状態
```

### 更新プロンプト

```
web-next/app/google/antigravity-best-practices/page.tsx を読んでください。
「YYYY年M月時点」と明記された記述は過去の事実として残し、「最新」「予定」「プレビュー」の主張だけを
一次情報で検証して外科的に更新してください。SOURCES のリンク切れも修正してください。
```

### 検証チェックリスト

- [ ] `bun run test app/google/antigravity-best-practices` がパスする
- [ ] `bun run build` 成功

---

## 画面 10 — `/google/agent`（Gemini マルチエージェント開発）

**ファイル**: `web-next/app/google/agent/page.tsx`  
**URL**: `/google/agent`  
**更新頻度**: 毎月（ADK / A2A プロトコルは頻繁に変更あり）

### 事前確認

```
以下を WebSearch で確認する:
- Google ADK（Agent Development Kit）最新バージョンと破壊的変更
- A2A / AP2 / A2UI プロトコルの最新仕様変更
- AgentEngine（旧 Vertex AI Agent Builder）の新機能
- Gemini CLI の最新エージェント関連コマンド
- GEMINI.md / AGENTS.md / agent.json の最新スキーマ変更
```

### 更新プロンプト

```
web-next/app/google/agent/page.tsx を読んでください。

以下を更新してください:

1. metadata のバージョン（"as of 2026-03" 等の日付表記）を
   "as of 2026-XX" に更新する

2. ADK のバージョン番号・import パス（python / npm）が変わっていれば
   コードブロック内を修正する

3. A2A / AP2 プロトコルで非推奨・変更されたフィールドがあれば修正する

4. SOURCES のリンク切れ修正・ADK CHANGELOG の最新エントリ追加

変更は metadata・バージョン番号テキスト・コードブロック・SOURCES のみ。
JSX 構造（コンポーネント定義）は変更しない。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/google/agent` (agent ページの契約テスト) がパスする
- [ ] `bun run build` が成功する
- [ ] ローカルホスト (`http://localhost:3000/google/agent`) を開き、エージェント定義コードブロックや参考文献リンクが壊れていないか目視確認

---

## 画面 11 — `/google/antigravity-guide`（Google Antigravity ベストプラクティス完全ガイド）

**ファイル**: `web-next/app/google/antigravity-guide/page.tsx`  
**URL**: `/google/antigravity-guide`  
**更新頻度**: 毎月（Antigravity は活発にアップデートされる）

### 事前確認

```
以下を WebSearch で確認する:
- Google Antigravity 最新バージョン（公式リリースノート）
- Antigravity IDE の新機能・廃止機能
- GEMINI.md の新しいセクション（Artifacts / MCP 統合等）
- 公式ドキュメントの URL 変更
```

### 更新プロンプト

```
web-next/app/google/antigravity-guide/page.tsx を読んでください。

以下を更新してください:

1. metadata.title / description のバージョン番号・年月を最新化する

2. 各ファイルタイプ（GEMINI.md / Rules / Workflows / Knowledge Base 等）の
   説明で、最新 Antigravity バージョンで変更された仕様を修正する

3. Antigravity 固有の設定ファイル（settings.json / .geminiignore 等）の
   説明でスキーマ変更があれば修正する

4. SOURCES のリンク切れ修正・公式リリースノート最新エントリ追加

変更は metadata・説明テキスト・SOURCES のみ。
```

### 検証チェックリスト

- [ ] `bun run test` パス
- [ ] `bun run build` 成功

---

## 画面 12 — `/codex/skill`（OpenAI Codex AI仕様駆動開発 マークダウンファイル完全ガイド）

**ファイル**: `web-next/app/codex/skill/page.tsx`  
**URL**: `/codex/skill`  
**更新頻度**: 毎月（AGENTS.md 仕様は活発に変更される）

### 事前確認

```
以下を WebSearch で確認する:
- OpenAI Codex CLI（Rust製）の最新バージョン
- AGENTS.md / AGENTS.override.md のスキーマ変更（OpenAI 公式ドキュメント）
- .prompt.md / REQUIREMENTS.md / AGENT_TASKS.md の仕様変更
- OpenAI Agents SDK の破壊的変更
```

### 更新プロンプト

```
web-next/app/codex/skill/page.tsx を読んでください。

以下を更新してください:

1. metadata のバージョン・年月を更新する

2. SOURCES 配列の各エントリ:
   - OpenAI Developer Documentation の URL が変わっていれば修正する
   - リンク切れを修正する
   - 新しい公式ドキュメント・ブログ記事があれば追加する（上限: 既存数 + 1）

3. AGENTS.md のフィールド説明（system_prompt / tools / handoffs 等）で
   最新仕様に合わせて修正が必要な箇所を更新する

変更は metadata・フィールド説明・SOURCES のみ。
```

### 検証チェックリスト

- [ ] `bun run test` パス
- [ ] `bun run build` 成功

---

## 画面 13 — `/codex/agent`（OpenAI Codex エージェント開発ガイド）

**ファイル**: `web-next/app/codex/agent/page.tsx`  
**URL**: `/codex/agent`  
**更新頻度**: 毎月（Agents SDK は変化が早い）

### 事前確認

```
以下を WebSearch で確認する:
- OpenAI Codex CLI 最新バージョン（Rust製）とインストールコマンド変更
- Agents SDK の最新バージョン（`openai-agents` パッケージ）
- config.toml のスキーマ変更
- サブエージェント連携（handoffs / subagents）の仕様変更
- PM 駆動 SDD パターンに関する新しいベストプラクティス
```

### 更新プロンプト

```
web-next/app/codex/agent/page.tsx を読んでください。

以下を更新してください:

1. metadata.title / description のバージョン年号・バージョン番号を更新する

2. インストールコマンドのコードブロック（cargo install / npm install 等）で
   バージョン番号が変わっていれば修正する

3. Agents SDK の import パスやクラス名が変わっていれば
   コードブロック内を修正する

4. SOURCES のリンク切れ修正・新規エントリ追加（上限: 既存数 + 2）

変更は metadata・コードブロック内コマンド/クラス名・SOURCES のみ。
```

### 検証チェックリスト

- [ ] `bun run test` パス（agent ページの契約テスト含む）
- [ ] `bun run build` 成功
- [ ] `bun run typecheck` エラーなし

---

## 画面 14 — `/codex/openai-codex-guide`（OpenAI Codex 完全ガイド 2026）

**ファイル**: `web-next/app/codex/openai-codex-guide/page.tsx`  
**URL**: `/codex/openai-codex-guide`  
**更新頻度**: 毎月（ガイドの年度表記・最新機能紹介）

### 事前確認

```
以下を WebSearch で確認する:
- OpenAI Codex 最新ガイド・チュートリアルの更新
- Codex の新機能（マルチファイル編集・テスト生成等）
- VS Code / JetBrains 拡張との統合変更
- 公式ドキュメントのベストプラクティス更新
```

### 更新プロンプト

```
web-next/app/codex/openai-codex-guide/page.tsx を読んでください。

以下を更新してください:

1. metadata.title の "2026" を現在の年に、description の年月表記を更新する

2. SOURCES 配列のリンク切れ修正・新規公式ブログ記事の追加（上限: 既存数 + 2）

3. ステップバイステップのガイドセクションで
   最新 Codex バージョンで UI や操作が変わった箇所を修正する

変更は metadata・SOURCES・ガイドテキストのみ。大規模リライト禁止。
```

### 検証チェックリスト

- [ ] `bun run test` パス
- [ ] `bun run build` 成功

---

## 画面 15 — `/copilot/skill`（GitHub Copilot SKILL.md 完全ベストプラクティスガイド）

**ファイル**: `web-next/app/copilot/skill/page.tsx`  
**URL**: `/copilot/skill`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- GitHub Copilot Coding Agent の最新バージョン・機能変更
- VS Code Agent Mode の SKILL.md サポート変更
- Copilot CLI の SKILL.md フロントマター仕様変更
- Progressive Disclosure（3段階ローディング）パターンの動作変更
```

### 更新プロンプト

```
web-next/app/copilot/skill/page.tsx を読んでください。

以下を更新してください:

1. metadata のバージョン・年月を更新する
   （例: "2026年3月時点" → "2026年X月時点"）
   ※ ヒーローバッジ（"May 2026 最新"）・TOC タイトル（"2026年X月版"）・
     SOURCES ラベルの日付も忘れず更新する。冒頭の「頻出レビュー指摘」の grep を先に実行すること

2. SKILL.md フロントマターフィールド（description / triggers / steps 等）の
   説明で GitHub Copilot 固有の最新仕様に合わせて修正する

3. SOURCES の "2026年3月" 等の日付表記を最新化し、リンク切れを修正する

変更は metadata・バッジ/TOC/SOURCES の日付・フィールド説明・SOURCES リンクのみ。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/copilot/skill` (copilot/skill の契約テスト) がパスする
- [ ] `bun run build` が成功する
- [ ] ローカルホスト (`http://localhost:3000/copilot/skill`) を開き、SKILL.md のフロントマターやトリガーの解説が正常にレンダリングされているか目視確認

---

## 画面 16 — `/copilot/agent`（GitHub Copilot コーディングエージェント開発ガイド）

**ファイル**: `web-next/app/copilot/agent/page.tsx`  
**URL**: `/copilot/agent`  
**更新頻度**: 毎月（.agent.md 仕様は活発に変化）

### 事前確認

```
以下を WebSearch で確認する:
- GitHub Copilot .agent.md の最新フロントマター仕様（2026年版）
- Handoffs（エージェント連鎖）の新しいフィールド・変更
- Subagents（サブエージェント）のネスト制限・新機能
- MCP 統合（GitHub Actions / Azure 等）の最新状況
- GitHub Copilot 公式ドキュメントの .agent.md セクション URL 変更
```

### 更新プロンプト

```
web-next/app/copilot/agent/page.tsx を読んでください。

以下を更新してください:

1. metadata のバージョン年号（"2026年版"）を最新化する

2. .agent.md フロントマターフィールド説明:
   - 廃止フィールドに「非推奨」マークを追加する
   - 新規フィールドがあれば説明カードを追加する（既存カードと同じ構造で）

3. Handoffs / Subagents セクションで仕様変更があれば修正する

4. SOURCES のリンク切れ修正・GitHub Copilot CHANGELOG の最新エントリ追加

変更は metadata・フィールド説明テキスト・SOURCES のみ。
```

### 検証チェックリスト

- [ ] `bun run test` パス（agent ページ契約テスト含む）
- [ ] `bun run build` 成功

---

## 画面 17 — `/copilot/github-copilot`（GitHub Copilot 完全ガイド 2026）

**ファイル**: `web-next/app/copilot/github-copilot/page.tsx`  
**URL**: `/copilot/github-copilot`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- GitHub Copilot の最新機能発表（GitHub Blog / GitHub Changelog）
- Copilot Chat / Copilot Edits / Copilot Workspace の新機能
- 料金プラン変更（Individual / Business / Enterprise）
- IDE サポート状況の変化（VS Code / JetBrains / Neovim / Xcode 等）
```

### 更新プロンプト

```
web-next/app/copilot/github-copilot/page.tsx を読んでください。

以下を更新してください:

1. metadata.title の年号（"2026"）・description の "最新版" 年月を更新する

2. 料金プランセクションがある場合:
   - 月額料金の変更があれば更新する
   - 新プランが追加されていれば追記する

3. SOURCES（SourceGroup 配列）のリンク切れ修正・新規公式エントリ追加

4. 「最新機能」セクションで Copilot の新機能追加・廃止があれば修正する

変更は metadata・料金テキスト・SOURCES・新機能説明のみ。大規模リライト禁止。
```

### 検証チェックリスト

- [ ] `bun run test` パス
- [ ] `bun run build` 成功
- [ ] `bun run typecheck` エラーなし

---

## 画面 18 — `/copilot/markdown-file-guide`（GitHub Copilot AI仕様駆動開発 マークダウンファイル完全ガイド）

**ファイル**: `web-next/app/copilot/markdown-file-guide/page.tsx`  
**URL**: `/copilot/markdown-file-guide`  
**更新頻度**: 毎月（カスタマイズファイル仕様は頻繁に変更）

### 事前確認

```
以下を WebSearch で確認する:
- copilot-instructions.md の最新仕様（GitHub 公式）
- .instructions.md / .prompt.md / .chatmode.md / .agent.md の最新フロントマター
- MCP 設定ファイル（.mcp.json）の変更
- Plan Mode の最新機能・設定方法の変更
- GitHub Copilot 拡張機能バージョン番号
```

### 更新プロンプト

```
web-next/app/copilot/markdown-file-guide/page.tsx を読んでください。

以下を更新してください:

1. metadata のバージョン（"2026年3月版"）を現在の年月に更新する

2. 各ファイルタイプ（copilot-instructions.md / .instructions.md / .prompt.md /
   .chatmode.md / .agent.md）の説明で仕様変更があれば修正する:
   - フロントマターフィールドの追加・削除・変更
   - ファイル配置場所（.github/ / .vscode/ 等）の変更

3. MCP 設定（.mcp.json）のスキーマ変更があれば修正する

4. Plan Mode の設定方法が変わっていれば修正する

5. SOURCES のリンク切れ修正・公式ドキュメント最新版への差し替え

変更は metadata・ファイルタイプ説明・SOURCES のみ。
```

### 検証チェックリスト

- [ ] `bun run test` パス
- [ ] `bun run build` 成功

---

## 画面 19 — `/git-worktree`（git worktree × 4プラットフォーム 並列開発ガイド）

**ファイル**: `web-next/app/git-worktree/page.tsx`  
**URL**: `/git-worktree`  
**更新頻度**: 3〜4 ヶ月ごと（git 自体の変更は少ない）

### 事前確認

```
以下を WebSearch で確認する:
- git worktree の最新バージョン（git 2.x.x）での新機能・変更
- Claude / Gemini / Codex / Copilot のワークツリー対応状況の変化
- GitHub Actions の worktree 利用パターンの変化
- Mermaid ダイアグラム（v10）のシンタックス変更（バージョン上がった場合）
```

### 更新プロンプト

```
web-next/app/git-worktree/page.tsx を読んでください。
（Mermaid ダイアグラムを含む大きいファイルの可能性あり。
 冒頭の metadata と SOURCES 定義だけ先に head -60 で確認する）

以下を更新してください:

1. metadata のバージョン・年月を更新する

2. git コマンドのコードブロック:
   - `git worktree add` / `git worktree list` 等のオプションに変更があれば修正する

3. 4プラットフォーム（Claude / Gemini / Codex / Copilot）セクション:
   - 各ツールの worktree 連携コマンド・ワークフローに変更があれば修正する

4. GitHub Actions の YAML コードブロックで非推奨アクションがあれば更新する

5. MermaidDiagram コンポーネントのダイアグラム定義は、
   シンタックスエラーが発生していなければ変更しない

変更は metadata・コードブロック・SOURCES のみ。
Mermaid ダイアグラム定義は変更禁止（インデント汚染でエラーになるリスクあり）。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/git-worktree` (git-worktree 契約テスト) がパスする
- [ ] `bun run build` が成功する
- [ ] ローカルホスト (`http://localhost:3000/git-worktree`) を開き、Mermaid ダイアグラムが正常表示されること、および表示崩れがないか目視確認

---

## 画面 20 — `/code-review/tool-pricing`（料金比較ページ）

**ファイル**: `web-next/app/code-review/tool-pricing/constants.ts` (SSoT) / `web-next/app/code-review/tool-pricing/page.tsx`  
**URL**: `/code-review/tool-pricing`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- 対象となる 9 種類のツール（GitHub Copilot, Codex, Claude Code, CodeRabbit, Gemini Code Assist, Google Jules, AWS CodeGuru, SonarQube Community/Developer）の公式 Pricing ページ
- USD/JPY の最新為替レート（大幅変動がないか確認）
```

### 更新プロンプト

```
web-next/app/code-review/tool-pricing/constants.ts を読んでください。価格に関する可変データはこのファイルが SSoT となっています。

以下の作業を行ってください:
1. WebSearch で各ツールの公式 Pricing にアクセスし、プラン料金や仕様変更がないか確認する。
2. 変更があった場合、constants.ts の TOOLS 配列内該当エントリの plans (monthlyUsd, annualMonthlyUsd, unitNote 等) を修正し、priceCheckedAt を当月「YYYY-MM」に更新する。
3. constants.ts の PRICE_CHECKED_AT 定数を当月「YYYY-MM」に更新する。
4. web-next/app/code-review/tool-pricing/page.tsx で利用されているコンポーネントに影響がないか確認する。

JSX構造や計算用純粋関数（planAmounts / representativePrice）は変更せず、constants.ts のデータ差し替えのみに留めてください。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/code-review/tool-pricing` がすべてパスする
- [ ] `bun run build` が成功する
- [ ] ローカル (`http://localhost:3000/code-review/tool-pricing`) で表示を確認し、USDと円の二段表示、割引バッジ、更新レートが正しく出力されていることを目視確認する

---

## 画面 21 — `/code-review/sonar-qube`（SonarQube Code Review 実践ガイド）

**ファイル**: `web-next/app/code-review/sonar-qube/page.tsx`  
**URL**: `/code-review/sonar-qube`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- SonarQube Server（旧 SonarQube）の最新バージョン番号（例: 2026.2 以降）
- SonarSource 公式ドキュメント（docs.sonarsource.com）での Clean as You Code (CaYC)、MQR (Multi-Quality Rule)、Quality Gates の最新仕様
```

### 更新プロンプト

```
web-next/app/code-review/sonar-qube/page.tsx を読んでください。

以下の作業を行ってください:
1. ヒーローセクションのバージョン（例: "SonarQube Server 2026.2"）と更新年月を最新のものに更新する。
2. SOURCES 配列のリンク切れをチェックし、最新のドキュメント URL に置き換える。
3. Quality Gate のメトリクス、MQR モードでの評価基準等に変更があれば、該当セクションの解説文を外科的に修正する。

※Mermaidダイアグラム定義は、シンタックスエラーを避けるため原則として変更しないでください。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/code-review/sonar-qube` がパスする
- [ ] `bun run build` が成功する
- [ ] プレビュー画面 (`http://localhost:3000/code-review/sonar-qube`) で Mermaid ダイアグラムが正常に描画され、スタイル崩れがないことを確認する

---

## 画面 22 — `/code-review/copilot-code-review`（GitHub Copilot Code Review 完全活用ガイド）

**ファイル**: `web-next/app/code-review/copilot-code-review/page.tsx`  
**URL**: `/code-review/copilot-code-review`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- GitHub Copilot Code Review / Copilot Edits の最新機能（GitHub Changelog）
- PR レビュー自動化、Custom Instructions の適用範囲などの最新仕様
```

### 更新プロンプト

```
web-next/app/code-review/copilot-code-review/page.tsx を読んでください。

以下の作業を行ってください:
1. ヒーロー内のバージョン情報や更新日付を最新版に更新する。
2. SOURCES のリンク切れを修正し、最新ブログやドキュメント（github.blog）があれば追加する。
3. Copilot による PR レビュー機能の変更（UIやコマンドなど）があれば、該当箇所の説明文を外科的に修正する。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/code-review/copilot-code-review` がパスする
- [ ] `bun run build` が成功する
- [ ] プレビュー画面で外部リンクに `rel="noopener noreferrer"` が正しく付与されていることを確認する

---

## 画面 23 — `/code-review/coderabbit-guide`（CodeRabbit 完全活用ガイド）

**ファイル**: `web-next/app/code-review/coderabbit-guide/page.tsx`  
**URL**: `/code-review/coderabbit-guide`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- CodeRabbit（AI PR レビューツール）の最新アップデート内容（公式 changelog）
- 設定ファイル（.coderabbit.yaml）の新オプションや、MCP 連携などの最新情報
```

### 更新プロンプト

```
web-next/app/code-review/coderabbit-guide/page.tsx を読んでください。

以下の作業を行ってください:
1. ヒーローセクションのバージョン情報・年月を最新版に更新する。
2. SOURCES のリンク切れを確認・修正し、新しい公式ドキュメントを追加する。
3. `.coderabbit.yaml` のコードブロック内にある設定項目に変更があれば修正し、新機能の解説があれば外科的に追加する。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/code-review/coderabbit-guide` がパスする
- [ ] `bun run build` が成功する

---

## 画面 24 — `/claude/code-slash-commands`（Claude Code スラッシュコマンド完全ガイド 2026）

**ファイル**: `web-next/app/claude/code-slash-commands/SlashCommandsGuideClient.tsx` (および `page.tsx`)  
**URL**: `/claude/code-slash-commands`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- Claude Code 最新版（例: v2.x.xx）のスラッシュコマンド（/search, /write 等）の変更・追加
- /effort オプションの指定方法や /loop 等の最新の実行時フラグ
```

### 更新プロンプト

```
web-next/app/claude/code-slash-commands/SlashCommandsGuideClient.tsx を読んでください。

以下の作業を行ってください:
1. `web-next/app/claude/code-slash-commands/page.tsx` 内の metadata タイトルと説明のバージョン年月を更新する。
2. SlashCommandsGuideClient.tsx 内の `SOURCES` リンク切れを確認・修正する。
3. 追加・廃止されたスラッシュコマンドやオプションがあれば、コマンド説明テーブルや実践例のコードブロックを外科的に修正する。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/claude/code-slash-commands` がパスする
- [ ] `bun run build` が成功する

---

## 画面 25 — `/claude/harness-engineering`（ハーネスエンジニアリング完全ガイド 2026）

**ファイル**: `web-next/app/claude/harness-engineering/page.tsx`  
**URL**: `/claude/harness-engineering`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- Anthropic Engineering Blog にて紹介されている「Harness Engineering（ハーネス設計）」の最新ベストプラクティス
- Initializer Agent / Coding Agent 2段階構造に関する公式の更新情報
```

### 更新プロンプト

```
web-next/app/claude/harness-engineering/page.tsx を読んでください。

以下の作業を行ってください:
1. ヒーローセクションのバージョン情報・年月を最新版に更新する。
2. SOURCES のリンク切れを修正し、最新ドキュメントを追加する。
3. セッションプロトコル（8ステップ）や feature_list.json / progress.txt の設計指針に変更があれば説明文を外科的に修正する。

※Mermaid ダイアグラム定義は、シンタックスエラーを避けるため原則として変更しないでください。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/claude/harness-engineering` がパスする
- [ ] `bun run build` が成功する

---

## 画面 26 — `/claude/managed-agents`（Claude Managed Agents 完全ガイド）

**ファイル**: `web-next/app/claude/managed-agents/page.tsx`  
**URL**: `/claude/managed-agents`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- Anthropic "Managed Agents" (フルマネージド型エージェント基盤) の最新リリースステータス（ベータからGAなど）
- CLI (`ant` ツール) や SDK (`@anthropic-ai/sdk`) の最新バージョンとコマンド変更
```

### 更新プロンプト

```
web-next/app/claude/managed-agents/page.tsx を読んでください。

以下の作業を行ってください:
1. ヒーローセクションのバージョン（例: "Beta 2026-04-01" など）と更新年月を最新のものにする。
2. SOURCES のリンク切れを確認・修正する。
3. `ant beta:agents` などのインストール/実行コードブロック内の CLI コマンドやオプション指定に変更があれば修正する。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/claude/managed-agents` がパスする
- [ ] `bun run build` が成功する

---

## 画面 27 — `/google/agent-harness-engineering`（Gemini Agent Harness Engineering 完全ガイド 2026）

**ファイル**: `web-next/app/google/agent-harness-engineering/page.tsx`  
**URL**: `/google/agent-harness-engineering`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- Google Antigravity / Gemini CLI における「エージェントハーネス（環境設計）」の最新ベストプラクティス
- 状態管理用の progress.txt やタスク進捗チェックの仕様変更
```

### 更新プロンプト

```
web-next/app/google/agent-harness-engineering/page.tsx を読んでください。

以下の作業を行ってください:
1. ヒーローセクションのバージョン情報・年月を最新版に更新する。
2. SOURCES 配列のリンク切れをチェック・修正する。
3. Gemini 環境下での 2段階エージェントモデルや、CLAUDE.md に相当する GEMINI.md の記述指針に更新があれば外科的に修正する。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/google/agent-harness-engineering` がパスする
- [ ] `bun run build` が成功する

---

## 画面 28 — `/google/antigravity-slash-commands-guide`（Antigravity スラッシュコマンド完全ガイド）

**ファイル**: `web-next/app/google/antigravity-slash-commands-guide/page.tsx`  
**URL**: `/google/antigravity-slash-commands-guide`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- Gemini CLI から Antigravity CLI への移行に伴う、最新のスラッシュコマンド体系（/memory, /restore, /compress 等）
- 設定ファイル（.gemini/settings.json）の新設定項目
```

### 更新プロンプト

```
web-next/app/google/antigravity-slash-commands-guide/page.tsx を読んでください。

以下の作業を行ってください:
1. metadata.title のバージョン（例: "v0.44.1"）およびヒーロー内のバージョン・更新年月を最新のものにする。
2. SOURCES のリンク切れを修正する。
3. コマンド体系（例: `/rewind` が `/restore` へ統合など）の挙動変更に応じて、説明テーブルやステップリストの記述を外科的に修正する。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/google/antigravity-slash-commands-guide` がパスする
- [ ] `bun run build` が成功する
- [ ] プレビュー画面で移行案内アラートなどが正しく表示されているか確認する

---

## 画面 29 — `/google/harness-engineering`（ハーネスエンジニアリング完全ガイド 2026 - Gemini CLI & Antigravity）

**ファイル**: `web-next/app/google/harness-engineering/page.tsx`  
**URL**: `/google/harness-engineering`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- Gemini CLI / Antigravity 環境下でのハーネス設計の最新情報
- GEMINI.md や `.geminiignore` の仕様変更
```

### 更新プロンプト

```
web-next/app/google/harness-engineering/page.tsx を読んでください。

以下の作業を行ってください:
1. ヒーローセクションのバージョン情報・更新年月を最新版にする。
2. SOURCES のリンク切れをチェック・修正する。
3. ハーネス構造やサンプルスクリプト（init.sh 等）に Gemini/Antigravity 固有の仕様変更があれば、外科的に修正する。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/google/harness-engineering` がパスする
- [ ] `bun run build` が成功する

---

## 画面 30 — `/codex/harness-engineering`（OpenAI Codex ハーネスエンジニアリング完全ガイド）

**ファイル**: `web-next/app/codex/harness-engineering/page.tsx`  
**URL**: `/codex/harness-engineering`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- OpenAI Evals (openai/evals) フレームワークの最新リリース、インストール手順
- AGENTS.md / TEST.md / config.toml とハーネスの統合に関する OpenAI 公式の最新設計
```

### 更新プロンプト

```
web-next/app/codex/harness-engineering/page.tsx を読んでください。

以下の作業を行ってください:
1. ヒーローセクションのバージョン・更新年月を最新版に更新する。
2. SOURCES 配列のリンク切れを修正し、最新ドキュメントがあれば追加する。
3. openai/evals のセットアップ手順や oaieval CLI コマンド仕様に変更があれば、コードブロックを外科的に修正する。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/codex/harness-engineering` がパスする
- [ ] `bun run build` が成功する

---

## 画面 31 — `/google/sandbox-best-practices`（Google AI Sandbox ベストプラクティス完全ガイド 2026）

**ファイル**: `web-next/app/google/sandbox-best-practices/page.tsx`  
**URL**: `/google/sandbox-best-practices`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- GKE Agent Sandbox / Gemini Code Execution / gVisor / Sandbox2 / V8 Sandbox / Privacy Sandbox の最新情報
- Google のサンドボックスセキュリティ・実行環境に関する最新設計や推奨プラクティス
```

### 更新プロンプト

```
web-next/app/google/sandbox-best-practices/page.tsx を読んでください。

以下の作業を行ってください:
1. ヒーローセクションのバージョン情報・更新年月を最新版にする。
2. SOURCES のリンク切れをチェック・修正する。
3. 各サンドボックス技術（gVisor, Sandbox2, V8 Sandbox 等）の説明や比較マトリクスに最新仕様変更があれば、外科的に修正する。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/google/sandbox-best-practices` がパスする
- [ ] `bun run build` が成功する

---

## 画面 32 — `/agent/hermes-agent-advanced-guide`（Hermes Agent 中級・上級者向け完全ガイド）

**ファイル**: `web-next/app/agent/hermes-agent-advanced-guide/page.tsx`  
**URL**: `/agent/hermes-agent-advanced-guide`  
**更新頻度**: 2〜3 ヶ月ごと（アーキテクチャ・セキュリティ設計の変更時）

### 事前確認

```
以下を WebSearch で確認する:
- Hermes Agent の最新リリース・内部アーキテクチャ変更
- 7 層セキュリティモデル・本番デプロイメントのベストプラクティス更新
```

### 更新プロンプト

```
web-next/app/agent/hermes-agent-advanced-guide/page.tsx を読んでください。
ヘッダの「更新 YYYY年M月D日」表記・SOURCES のリンク切れ・セキュリティ/デプロイ節の仕様変更のみを外科的に更新してください。
セクション数（契約テストの EXPECTED_SECTION_IDS）は変更しないこと。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/agent/hermes-agent-advanced-guide` がパスする
- [ ] `bun run build` が成功する

---

## 画面 33 — `/agent/openclaw-advanced-agent-security-guide`（OpenClaw Agent 高度活用 & セキュリティ完全ガイド）

**ファイル**: `web-next/app/agent/openclaw-advanced-agent-security-guide/page.tsx`  
**URL**: `/agent/openclaw-advanced-agent-security-guide`  
**更新頻度**: 毎月（stable channel の情報基準日を更新）

### 事前確認

```
以下を WebSearch で確認する:
- OpenClaw stable channel の最新バージョン・セキュリティ勧告
- `openclaw --version` の最新値・設定スキーマ変更
```

### 更新プロンプト

```
web-next/app/agent/openclaw-advanced-agent-security-guide/page.tsx を読んでください。
「情報基準日: YYYY-MM-DD」表記（ヘッダバッジ・カレンダーチップ・フッター）を当月末に更新し、
SOURCES のリンク切れ・セキュリティ節の仕様変更のみを外科的に修正してください。
セクション数（契約テストは 13 セクション固定）は変更しないこと。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/agent/openclaw-advanced-agent-security-guide` がパスする
- [ ] `bun run build` が成功する

---

## 画面 34 — `/claude/self-hosted-sandboxes`（Claude セルフホスト型サンドボックス完全ガイド）

**ファイル**: `web-next/app/claude/self-hosted-sandboxes/page.tsx`  
**URL**: `/claude/self-hosted-sandboxes`  
**更新頻度**: 毎月（Anthropic のサンドボックス/エージェント実行環境の変更時）

### 事前確認

```
以下を WebSearch で確認する:
- Anthropic のセルフホスト型サンドボックス / エージェント実行環境の最新ガイダンス
- Claude Code / Agent SDK のサンドボックス関連設定の変更
```

### 更新プロンプト

```
web-next/app/claude/self-hosted-sandboxes/page.tsx を読んでください。
metadata・ヒーローのバージョン/年月・SOURCES のリンク切れ・設定コードブロックのみを外科的に更新してください。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/claude/self-hosted-sandboxes` がパスする
- [ ] `bun run build` が成功する

---

## 画面 35 — `/vercel/sandbox`（Vercel Sandbox 完全入門ガイド 2026）

**ファイル**: `web-next/app/vercel/sandbox/page.tsx`  
**URL**: `/vercel/sandbox`  
**更新頻度**: 毎月（Vercel Sandbox の GA 後機能追加・CLI/SDK 変更時）

### 事前確認

```
以下を WebSearch で確認する:
- Vercel Sandbox（Linux マイクロVM）の最新機能・CLI/SDK 仕様変更
- 料金・リージョン・タグ機能などの変更
```

### 更新プロンプト

```
web-next/app/vercel/sandbox/page.tsx を読んでください。
ヒーローの「GA · YYYY年M月」・フッターの「最終更新: YYYY年M月」・SOURCES のリンク切れ・
CLI コマンド例のみを外科的に更新してください。
h2 セクション数（契約テストは 15 見出し固定）は変更しないこと。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/vercel/sandbox` がパスする
- [ ] `bun run build` が成功する

---

## 画面 36 — `/claude/fable-5-best-practices`（Claude Fable 5 実践活用ガイド）

**ファイル**: `web-next/app/claude/fable-5-best-practices/page.tsx` / `Sidebar.tsx`  
**URL**: `/claude/fable-5-best-practices`  
**更新頻度**: 毎月（Fable 系の後継モデル・価格・提供形態の変更時は随時）

### 事前確認

```
以下を WebSearch / 公式ドキュメント（platform.claude.com の Models overview）で確認する:
- Claude Fable の最新モデル（latest 2026）と API ID・価格・コンテキスト長
- Fable / Mythos の提供形態（使用クレジット・限定提供）の変更
- レガシー化したモデルと退役予定日（Model deprecations）
```

### 更新プロンプト

```
web-next/app/claude/fable-5-best-practices/page.tsx と Sidebar.tsx を読んでください。
本文は Fable 5 時点の記述を残し、後継モデル・価格・提供形態の変化は
「YYYY年M月追記」の段落として該当 callout 内に追加してください。
ヒーローの「改訂」欄は原文の日付を残したまま「（YYYY年M月D日追記）」を併記し、
Sidebar の「最終更新」を更新日に揃えてください。
page.test.tsx は Sidebar の最終更新日と registry の lastReviewed を toContain / toBe で固定しているため、
同じ変更でテストの期待値も同期してください。
```

### 検証チェックリスト

- [ ] `bun run test app/claude/fable-5-best-practices` がパスする
- [ ] 追記段落のモデル ID・価格が公式 Models overview と一致している

---

## 画面 37 — `/claude/tag-best-practices`（Claude Tag 活用ガイド）

**ファイル**: `web-next/app/claude/tag-best-practices/page.tsx`  
**URL**: `/claude/tag-best-practices`  
**更新頻度**: 毎月（パブリックベータ中のため仕様変更が多い）

### 事前確認

```
以下を WebSearch / support.claude.com のリリースノートで確認する:
- Claude Tag（Slack 連携）の最新仕様・対応プラン・稼働モデル（latest 2026）
- 旧「Claude in Slack」からの移行状況と期日
- Slack 以外のワークプレイスツールへの拡張
```

### 更新プロンプト

```
web-next/app/claude/tag-best-practices/page.tsx を読んでください。
期日を過ぎた「予定」表記（移行日など）は「予定されていた（YYYY年M月時点で期日経過済み）」の形に改め、
チェックリストの文言も期日後の行動に合わせてください。
稼働モデル名は公式で確認できた場合のみ更新し、確認できない場合は据え置いて報告してください。
h2 数（契約テストは 15 固定）と metadata（registry の title / description と toBe で一致）は変更しないこと。
```

### 検証チェックリスト

- [ ] `bun run test app/claude/tag-best-practices` がパスする
- [ ] 期日を過ぎた「予定」表記が残っていない

---

## 画面 38 — `/google/adk-best-practices`（ADK ベストプラクティス）

**ファイル**: `web-next/app/google/adk-best-practices/page.tsx`  
**URL**: `/google/adk-best-practices`  
**更新頻度**: 毎月（ADK の各言語版リリース時）

### 事前確認

```
以下を WebSearch / PyPI（google-adk）/ GitHub releases で確認する:
- Google Agent Development Kit の最新版（Python / TypeScript / Go / Java / Kotlin。latest 2026）
- 破壊的変更・非推奨 API・評価（ADK Eval）機能の変更
```

### 更新プロンプト

```
web-next/app/google/adk-best-practices/page.tsx を読んでください。
本ページは原本固定の契約テスト（archive/ 参照）を持つため、本文の言い換えは行わず、
コード例のモデル ID・API 名が退役/非推奨になっていないかだけを確認して外科的に修正してください。
SOURCES のリンク切れがあれば修正してください。
```

### 検証チェックリスト

- [ ] `bun run test app/google/adk-best-practices` がパスする
- [ ] コード例に退役済みのモデル ID が残っていない

---

## 画面 39 — `/google/enterprise-agent-platform`（Gemini Enterprise Agent Platform）

**ファイル**: `web-next/app/google/enterprise-agent-platform/page.tsx`  
**URL**: `/google/enterprise-agent-platform`  
**更新頻度**: 毎月

### 事前確認

```
以下を Google Cloud の公式ドキュメントで確認する:
- Gemini Enterprise Agent Platform のリリースノート（latest 2026）
- Model versions and lifecycle ページの退役日・推奨後継モデル
  （Agent Platform と Gemini API では退役日が異なるため、ページの文脈に合う方を参照する）
```

### 更新プロンプト

```
web-next/app/google/enterprise-agent-platform/page.tsx を読んでください。
コード例の model= に退役済みの Gemini モデル ID があれば、公式ライフサイクル表の推奨後継へ置き換えてください。
本文の機能説明は、リリースノートで変更が確認できたものだけを外科的に更新してください。
```

### 検証チェックリスト

- [ ] `bun run test app/google/enterprise-agent-platform` がパスする
- [ ] `grep -nE 'gemini-[0-9]' app/google/enterprise-agent-platform/page.tsx` の全 ID が提供中である

---

## 画面 40 — `/google/enterprise-agent-platform-intermediate`（Gemini Enterprise Agent Platform 中級）

**ファイル**: `web-next/app/google/enterprise-agent-platform-intermediate/page.tsx`  
**URL**: `/google/enterprise-agent-platform-intermediate`  
**更新頻度**: 毎月

### 事前確認

```
画面 39 と同じ確認に加え、以下を確認する:
- 最新の Gemini フロンティアモデル（latest 2026）の GA 状況
- Memory Bank などエージェント基盤機能の既定モデルの変更
```

### 更新プロンプト

```
web-next/app/google/enterprise-agent-platform-intermediate/page.tsx を読んでください。
モデル選定表から退役済みモデルを外すか退役日を併記し、新たに GA となったモデルがあれば行を追加してください。
「YYYY年M月時点」と明記された過去の事実（既定モデルの変更履歴など）は書き換えないこと。
```

### 検証チェックリスト

- [ ] `bun run test app/google/enterprise-agent-platform-intermediate` がパスする

---

## 画面 41 — `/google/gemma-best-practices-guide`（Gemma ベストプラクティスガイド）

**ファイル**: `web-next/app/google/gemma-best-practices-guide/page.tsx`  
**URL**: `/google/gemma-best-practices-guide`  
**更新頻度**: 毎月（Gemma の新世代・新サイズ追加時）

### 事前確認

```
以下を WebSearch / Google の公式ブログで確認する:
- Gemma の最新世代とモデルサイズ（latest open model 2026）
- ライセンス・対応ランタイム（Ollama / vLLM / LiteRT 等）の変更
```

### 更新プロンプト

```
web-next/app/google/gemma-best-practices-guide/page.tsx を読んでください。
新しい世代またはサイズが追加されていれば、ヒーローの「ベース」表記とサイズ比較表を外科的に更新してください。
変更がなければ編集せず、registry の lastReviewed のみ更新してください。
```

### 検証チェックリスト

- [ ] `bun run test app/google/gemma-best-practices-guide` がパスする

---

## 画面 42 — `/google/multi-agent-best-practices`（Gemini マルチエージェント開発 ベストプラクティス）

**ファイル**: `web-next/app/google/multi-agent-best-practices/page.tsx`  
**URL**: `/google/multi-agent-best-practices`  
**更新頻度**: 毎月

### 事前確認

```
以下を確認する:
- ADK / A2A の最新仕様（latest 2026）
- Gemini API の Deprecations ページで、コード例のモデル ID の停止日と後継
```

### 更新プロンプト

```
web-next/app/google/multi-agent-best-practices/page.tsx を読んでください。
本ページはコードを文字列定数（CODE_TEXT_*）と JSX の両方に持つため、モデル ID を置き換えるときは
両方を同時に更新してください（ファイル全体に対する置換で漏れを防ぐ）。
原本固定の契約テストがあるため、本文の言い換えは行わないこと。
```

### 検証チェックリスト

- [ ] `bun run test app/google/multi-agent-best-practices` がパスする
- [ ] コピー用文字列と表示用 JSX のモデル ID が一致している

---

## 画面 43 — `/google/notebook-lm`（NotebookLM ガイド）

**ファイル**: `web-next/app/google/notebook-lm/page.tsx`  
**URL**: `/google/notebook-lm`  
**更新頻度**: 毎月

### 事前確認

```
以下を Google の公式ブログ（blog.google の NotebookLM カテゴリ）で確認する:
- NotebookLM の新機能・提供プラン・基盤モデル（latest 2026）
- 名称やブランドの変更（第三者報道だけで判断せず、公式発表で確認する）
```

### 更新プロンプト

```
web-next/app/google/notebook-lm/page.tsx を読んでください。
公式発表で確認できた新機能だけを外科的に追記し、日付付きの過去の記述は残してください。
第三者報道のみの情報は反映しないこと。
```

### 検証チェックリスト

- [ ] `bun run test app/google/notebook-lm` がパスする

---

## 画面 44 — `/google/stitch-guide`（Google Stitch ガイド）

**ファイル**: `web-next/app/google/stitch-guide/page.tsx`  
**URL**: `/google/stitch-guide`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch / Google Labs の公式情報で確認する:
- Stitch の最新機能・利用上限（クレジット制）・基盤モデル（latest 2026）
```

### 更新プロンプト

```
web-next/app/google/stitch-guide/page.tsx を読んでください。
利用上限の表は「報告時期」ごとの行で構成されているため、既存行は書き換えず、新しい報告があれば行を追加してください。
原本固定の契約テストがあるため、セクション ID・本文の言い換えは行わないこと。
```

### 検証チェックリスト

- [ ] `bun run test app/google/stitch-guide` がパスする

---

## 画面 45 — `/model-data/gpt-5-6-best-practices`（OpenAI GPT-5.6 完全ガイド）

**ファイル**: `web-next/app/model-data/gpt-5-6-best-practices/page.tsx`  
**URL**: `/model-data/gpt-5-6-best-practices`  
**更新頻度**: 毎月（OpenAI の後継モデル登場時は随時）

### 事前確認

```
以下を Codex / OpenAI の公式モデルページで確認する:
- 最新の推奨モデル（latest 2026）と GPT-5.6 系の提供状況・退役予定
```

### 更新プロンプト

```
web-next/app/model-data/gpt-5-6-best-practices/page.tsx を読んでください。
本ページは GPT-5.6 の解説として残し、後継モデルの登場や退役予定はヒーロー説明文の
「（YYYY年M月追記: ...）」として追記してください。「最新」という語が GPT-5.6 を指して残っていないか確認すること。
metadata.title（toBe で固定）は変更しないこと。
```

### 検証チェックリスト

- [ ] `bun run test app/model-data/gpt-5-6-best-practices` がパスする

---

## 画面 46 — `/infra/microsoft-foundry-best-practices-guide`（Microsoft Foundry 活用ガイド）

**ファイル**: `web-next/app/infra/microsoft-foundry-best-practices-guide/page.tsx`  
**URL**: `/infra/microsoft-foundry-best-practices-guide`  
**更新頻度**: 毎月

### 事前確認

```
以下を Microsoft Learn で確認する:
- Foundry の Model retirement schedule（Deprecated = 新規顧客はデプロイ不可、Retired = 410 Gone）
- What's new in Microsoft Foundry（latest 2026）
```

### 更新プロンプト

```
web-next/app/infra/microsoft-foundry-best-practices-guide/page.tsx を読んでください。
モデル表の行は差し替えず、Deprecated / Retired になったモデルには備考で状態と日付を追記してください。
公式の Replacement 欄が空のモデルについて移行先を書く場合は「移行先の例」と表記し、公式の後継指定と区別すること。
```

### 検証チェックリスト

- [ ] `bun run test app/infra/microsoft-foundry-best-practices-guide` がパスする

---

## 画面 47 — `/infra/microsoft-foundry-best-practices-intermediate`（Microsoft Foundry 実践ベストプラクティス）

**ファイル**: `web-next/app/infra/microsoft-foundry-best-practices-intermediate/page.tsx`  
**URL**: `/infra/microsoft-foundry-best-practices-intermediate`  
**更新頻度**: 毎月

### 事前確認

```
画面 46 と同じ確認に加え、Foundry Agent Service の新機能（Routines・Tool Search・ネットワーク出口制御など）を確認する。
```

### 更新プロンプト

```
web-next/app/infra/microsoft-foundry-best-practices-intermediate/page.tsx を読んでください。
画面 46 と同じ方針でモデル表に状態を追記し、Agent Service の GA / プレビュー状態の変化があれば該当箇所のみ更新してください。
```

### 検証チェックリスト

- [ ] `bun run test app/infra/microsoft-foundry-best-practices-intermediate` がパスする

---

## 画面 48 — `/moonshot/kimi-llm-best-practices`（Kimi LLM 徹底ガイド）

**ファイル**: `web-next/app/moonshot/kimi-llm-best-practices/page.tsx`  
**URL**: `/moonshot/kimi-llm-best-practices`  
**更新頻度**: 毎月

### 事前確認

```
以下を Moonshot AI の公式プラットフォーム（platform.moonshot.ai）で確認する:
- Kimi の最新フラッグシップ（latest 2026）とモデル ID・価格
```

### 更新プロンプト

```
web-next/app/moonshot/kimi-llm-best-practices/page.tsx を読んでください。
後継モデルが出ていれば「YYYY年M月時点の最新」表記の直後に後継の情報を追記してください。変更がなければ編集しないこと。
```

### 検証チェックリスト

- [ ] `bun run test app/moonshot/kimi-llm-best-practices` がパスする

---

## 画面 49 — `/deepseek/llm-best-practices`（DeepSeek LLM ガイド）

**ファイル**: `web-next/app/deepseek/llm-best-practices/page.tsx`  
**URL**: `/deepseek/llm-best-practices`  
**更新頻度**: 毎月（DeepSeek はモデル ID の付け替えが多いため要注意）

### 事前確認

```
以下を DeepSeek API の Change Log（api-docs.deepseek.com/updates）で確認する:
- 最新モデルと API のモデル名（latest 2026）
- 退役したモデル名と、暫定的に転送されている旧モデル名
```

### 更新プロンプト

```
web-next/app/deepseek/llm-best-practices/page.tsx を読んでください。
「現行モデル比較表（YYYY年M月D日時点）」は時点付きの表として残し、
その直前に「YYYY年M月追記」の段落で新モデル・モデル名の変更・退役を追記してください。
```

### 検証チェックリスト

- [ ] `bun run test app/deepseek/llm-best-practices` がパスする

---

## 画面 50 — `/xai/grok-best-practices`（xAI Grok ガイド）

**ファイル**: `web-next/app/xai/grok-best-practices/page.tsx`  
**URL**: `/xai/grok-best-practices`  
**更新頻度**: 毎月

### 事前確認

```
以下を docs.x.ai の Models ページで確認する:
- 最新のフラッグシップモデル（latest 2026）とコンテキスト長・価格
- 非推奨（Deprecated）表示のあるモデル
```

### 更新プロンプト

```
web-next/app/xai/grok-best-practices/page.tsx を読んでください。
モデル表で「最新」「フラッグシップ」と書かれたモデルが現行の最新でなければ、
「YYYY年M月時点のフラッグシップ。YYYY年M月時点の最新は <ID>」の形に改めてください。
```

### 検証チェックリスト

- [ ] `bun run test app/xai/grok-best-practices` がパスする

---

## 画面 51 — `/xai/grok-best-practices-intermediate`（xAI Grok API 実践ベストプラクティス）

**ファイル**: `web-next/app/xai/grok-best-practices-intermediate/page.tsx`  
**URL**: `/xai/grok-best-practices-intermediate`  
**更新頻度**: 毎月

### 事前確認

```
画面 50 と同じ確認を行う。
```

### 更新プロンプト

```
web-next/app/xai/grok-best-practices-intermediate/page.tsx を読んでください。
「YYYY年M月時点で、…旗艦モデルは」の段落の末尾に後継モデルの情報を追記してください。
コード例のモデル ID は、旧モデルが提供中であれば変更しないこと。
```

### 検証チェックリスト

- [ ] `bun run test app/xai/grok-best-practices-intermediate` がパスする

---

## 画面 52 — `/zhipu/zai-glm-best-practices`（Z.ai GLM ベストプラクティス）

**ファイル**: `web-next/app/zhipu/zai-glm-best-practices/page.tsx`  
**URL**: `/zhipu/zai-glm-best-practices`  
**更新頻度**: 毎月

### 事前確認

```
以下を docs.z.ai の Pricing ページで確認する（第三者の価格まとめサイトは旧価格を流用していることがあるため使わない）:
- GLM の最新モデル（latest 2026）と価格・軽量版
```

### 更新プロンプト

```
web-next/app/zhipu/zai-glm-best-practices/page.tsx を読んでください。
「YYYY年M月時点の旗艦モデル」段落の末尾と、モデル表の「最新の旗艦モデル」セルに後継モデルを追記してください。
```

### 検証チェックリスト

- [ ] `bun run test app/zhipu/zai-glm-best-practices` がパスする

---

## その他の画面（Providers 以外の registry 登録ページ）

推薦書籍・資格試験・Agent 開発・運用・品質など、上記一覧にない registry 登録ページは画面別プロンプトを持たない。
月次確認の対象にする場合は、以下の汎用テンプレートを使う。確認日は registry の `lastReviewed` が正となる。

```
web-next/app/<path>/page.tsx を読んでください。
1. 「頻出レビュー指摘」の grep で時点表記を洗い出し、時点付きの過去の事実は残す
2. 「最新」「現時点」「予定」と書かれた主張だけを一次情報で検証し、古くなったものを外科的に更新する
3. 推薦書籍など原本固定の契約テストを持つページは本文を変えず、変更が必要な場合はユーザーに確認する
4. 確認を終えたら web-next/lib/page-registry.ts の lastReviewed を当日に更新する
```

---

## 全画面一括更新フロー（月次メンテナンス）

月次更新を効率よく行うための推奨フロー:

```
1. [情報収集] 各プロバイダーの changelog を確認（約 30 分）
   - Anthropic: https://platform.claude.com/docs/en/release-notes/overview
     / https://code.claude.com/docs/en/changelog / https://support.claude.com/en/articles/12138966-release-notes
   - Google AI: https://ai.google.dev/gemini-api/docs/changelog
     / https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes
   - OpenAI: https://learn.chatgpt.com/docs/models（Codex のモデルと退役日）
   - GitHub: https://github.blog/changelog/
   - Microsoft Foundry: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirement-schedule
   - DeepSeek / xAI / Z.ai: https://api-docs.deepseek.com/updates/ / https://docs.x.ai/docs/models
     / https://docs.z.ai/guides/overview/pricing

2. [優先度判定] 変更が大きい画面から着手する
   推奨: プロバイダー単位で一次情報を一度だけ調べ、同じプロバイダーの画面をまとめて更新する
   高優先: バージョン番号が古い・リンク切れが多い画面
   低優先: 変更のない画面（スキップ可）

3. [実行] 各画面のプロンプトを Claude Code に投入する
   推奨: 1セッションで 2〜3 画面まで（コンテキスト肥大化防止）

4. [検証] 全画面更新後に一括チェック
   cd web-next && bun run build && bun run test && bun run typecheck && bun run lint
   ※ 各ページ着手時に「頻出レビュー指摘」の grep（日付表記の全箇所洗い出し・モデル ID の洗い出し）を必ず実行する
   ※ 確認を終えたページは web-next/lib/page-registry.ts の lastReviewed を当日に更新する

5. [コミット] /commit-commands:commit-push-pr スキルを使用
   コミットメッセージ例: "docs(guide): monthly update YYYY-MM"
```

---

*最終更新: 2026-10-22 — 画面一覧を registry から再生成（52 画面。Providers 全 43 ページを網羅し、うち 41 ページを確認済み・2 ページ保留）。旧画面 9 を `/google/antigravity-best-practices` に差し替え、画面 36〜52 と「その他の画面」の汎用テンプレートを追加。頻出レビュー指摘に「退役モデル ID」「情報基準日と最終更新の区別」を追記し、一括フローの一次情報 URL を現行のものへ更新。*

*2026-07-01 — 「頻出レビュー指摘 & 事前チェック」節を追加（日付表記の全箇所洗い出し grep / JSX 空白 `{" "}` / 契約テスト toBe 同期）。2026-06 サイクルで別途修正コミット（`5846931`）が必要になった取りこぼしを再発防止するための追記。*
