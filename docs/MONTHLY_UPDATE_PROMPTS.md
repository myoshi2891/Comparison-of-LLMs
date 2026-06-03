# 月次更新プロンプト集

> **用途**: 毎月最低 1 回、各画面の情報を最新状態に保つためのプロンプトテンプレート集。  
> **最終更新**: 2026-05-24  
> **次回予定**: 2026-06-01 以降

---

## 使い方

1. 更新したい画面のセクションを開く
2. `## 事前確認` の WebSearch プロンプトで最新情報を取得する
3. `## 更新プロンプト` をそのまま（または差分を追記して）Claude Code に投入する
4. 更新後は `## 検証チェックリスト` を確認してコミットする

**共通制約（全画面共通）**:
- ファイル全体の書き直し禁止。外科的パッチのみ
- `bun run build && bun run typecheck && bun run test && bun run lint` が全て通ること
- `metadata.title` / `metadata.description` のバージョン年号も同時に更新すること
- 外部リンクは `rel="noopener noreferrer"` を維持すること

---

## 画面一覧

| # | URL | ページタイトル（概要） | 更新日 |
|---|-----|----------------------|--------|
| 1 | `/` | AIモデル 時間別コスト 計算機（ホーム） | 2026-05-09 |
| 2 | `/claude/skill` | Claude Code AI仕様駆動開発 — マークダウンファイル完全ガイド | 2026-05-15 |
| 3 | `/claude/skill-guide` | SKILL.md 完全解説ガイド — Claude Code | 2026-05-15 |
| 4 | `/claude/skill-guide-intermediate` | SKILL.md 中級者完全攻略ガイド — Claude Code | 2026-05-15 |
| 5 | `/claude/agent` | Claude Code サブエージェント Markdown ベストプラクティス | 2026-05-15 |
| 6 | `/claude/cowork-guide` | Claude Cowork 完全入門ガイド | 2026-05-08 |
| 7 | `/gemini/skill` | Google Antigravity × Gemini — マークダウンファイル完全ガイド | 2026-05-23 |
| 8 | `/gemini/skill-guide` | SKILL.md 完全解剖ガイド（Gemini CLI 中級者以上向け） | 2026-05-24 |
| 9 | `/gemini/skill-guide-intermediate` | SKILL.md 完全ガイド — Gemini CLI & Antigravity | 2026-05-23 |
| 10 | `/gemini/agent` | Gemini マルチエージェント開発（ADK / A2A） | 2026-05-23 |
| 11 | `/gemini/antigravity-guide` | Google Antigravity — AI仕様駆動開発 ベストプラクティス完全ガイド | 2026-05-22 |
| 12 | `/codex/skill` | OpenAI Codex — AI仕様駆動開発 マークダウンファイル完全ガイド | 2026-05-24 |
| 13 | `/codex/agent` | OpenAI Codex エージェント開発ガイド | 2026-05-23 |
| 14 | `/codex/openai-codex-guide` | OpenAI Codex 完全ガイド 2026 | 2026-05-23 |
| 15 | `/copilot/skill` | GitHub Copilot SKILL.md 完全ベストプラクティスガイド | 2026-05-24 |
| 16 | `/copilot/agent` | GitHub Copilot コーディングエージェント開発ガイド | 2026-05-24 |
| 17 | `/copilot/github-copilot` | GitHub Copilot 完全ガイド 2026 | 2026-05-24 |
| 18 | `/copilot/markdown-file-guide` | GitHub Copilot — AI仕様駆動開発 マークダウンファイル完全ガイド | 2026-05-08 |
| 19 | `/git-worktree` | git worktree × 4プラットフォーム ドキュメント並列開発ガイド | 2026-05-08 |
| 20 | `/code-review/tool-pricing` | Code Review ツール料金比較ページ | 2026-06-03 |
| 21 | `/code-review/sonar-qube` | SonarQube Code Review 実践ガイド | 2026-06-03 |
| 22 | `/code-review/copilot-code-review` | GitHub Copilot Code Review 完全活用ガイド | 2026-06-03 |
| 23 | `/code-review/coderabbit-guide` | CodeRabbit 完全活用ガイド | 2026-06-03 |
| 24 | `/claude/code-slash-commands` | Claude Code スラッシュコマンド完全ガイド 2026 | 2026-06-03 |
| 25 | `/claude/harness-engineering` | ハーネスエンジニアリング完全ガイド 2026 | 2026-06-03 |
| 26 | `/claude/managed-agents` | Claude Managed Agents 完全ガイド | 2026-06-03 |
| 27 | `/gemini/agent-harness-engineering` | Gemini Agent Harness Engineering 完全ガイド 2026 | 2026-06-03 |
| 28 | `/gemini/antigravity-slash-commands-guide` | Antigravity スラッシュコマンド完全ガイド | 2026-06-03 |
| 29 | `/gemini/harness-engineering` | ハーネスエンジニアリング完全ガイド 2026 (Gemini CLI & Antigravity) | 2026-06-03 |
| 30 | `/codex/harness-engineering` | OpenAI Codex ハーネスエンジニアリング完全ガイド | 2026-06-03 |

---

## 画面 1 — ホーム（コスト計算機）

**ファイル**: `web-next/app/page.tsx` / `web-next/components/HomePage.tsx`  
**URL**: `/`  
**更新頻度**: 毎月（新モデルリリース時は随時）

### 事前確認

```
WebSearch で以下を確認してからプロンプトを実行する:
- Anthropic / OpenAI / Google / AWS / DeepSeek / xAI の最新 API 価格変更
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

## 画面 7 — `/gemini/skill`（Google Antigravity × Gemini マークダウンファイル完全ガイド）

**ファイル**: `web-next/app/gemini/skill/page.tsx`  
**URL**: `/gemini/skill`  
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
web-next/app/gemini/skill/page.tsx を読んでください。

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

- [ ] `bun run test web-next/app/gemini/skill` (gemini/skill の契約テスト) がパスする
- [ ] `bun run build` が成功する
- [ ] ローカルホスト (`http://localhost:3000/gemini/skill`) を開き、マークダウンファイルの仕様解説表示や外部リンクが壊れていないか目視確認

---

## 画面 8 — `/gemini/skill-guide`（SKILL.md 完全解剖ガイド — Gemini CLI 中級者）

**ファイル**: `web-next/app/gemini/skill-guide/page.tsx`  
**URL**: `/gemini/skill-guide`  
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
web-next/app/gemini/skill-guide/page.tsx を読んでください。

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

## 画面 9 — `/gemini/skill-guide-intermediate`（SKILL.md 完全ガイド — Gemini CLI 入門）

**ファイル**: `web-next/app/gemini/skill-guide-intermediate/page.tsx`  
**URL**: `/gemini/skill-guide-intermediate`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- Gemini CLI 最新バージョンとインストールコマンドの変更
- SKILL.md のインストール手順（gemini skills install 等）の変更
- 公式サンプルスキルの更新
```

### 更新プロンプト

```
web-next/app/gemini/skill-guide-intermediate/page.tsx を読んでください。

以下を更新してください:

1. metadata のバージョン・年月を更新する

2. インストール手順コードブロック内のコマンド:
   - `gemini` CLI のバージョン指定やコマンド名が変わっていれば修正する
   - npm / brew / pipx 等インストール方法の変更があれば修正する

3. SOURCES のリンク切れ修正

変更は metadata・コードブロック内コマンド・SOURCES のみ。
```

### 検証チェックリスト

- [ ] `bun run test` パス
- [ ] `bun run build` 成功

---

## 画面 10 — `/gemini/agent`（Gemini マルチエージェント開発）

**ファイル**: `web-next/app/gemini/agent/page.tsx`  
**URL**: `/gemini/agent`  
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
web-next/app/gemini/agent/page.tsx を読んでください。

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

- [ ] `bun run test web-next/app/gemini/agent` (agent ページの契約テスト) がパスする
- [ ] `bun run build` が成功する
- [ ] ローカルホスト (`http://localhost:3000/gemini/agent`) を開き、エージェント定義コードブロックや参考文献リンクが壊れていないか目視確認

---

## 画面 11 — `/gemini/antigravity-guide`（Google Antigravity ベストプラクティス完全ガイド）

**ファイル**: `web-next/app/gemini/antigravity-guide/page.tsx`  
**URL**: `/gemini/antigravity-guide`  
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
web-next/app/gemini/antigravity-guide/page.tsx を読んでください。

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

2. SKILL.md フロントマターフィールド（description / triggers / steps 等）の
   説明で GitHub Copilot 固有の最新仕様に合わせて修正する

3. SOURCES の "2026年3月" 等の日付表記を最新化し、リンク切れを修正する

変更は metadata・フィールド説明・SOURCES のみ。
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

## 画面 27 — `/gemini/agent-harness-engineering`（Gemini Agent Harness Engineering 完全ガイド 2026）

**ファイル**: `web-next/app/gemini/agent-harness-engineering/page.tsx`  
**URL**: `/gemini/agent-harness-engineering`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- Google Antigravity / Gemini CLI における「エージェントハーネス（環境設計）」の最新ベストプラクティス
- 状態管理用の progress.txt やタスク進捗チェックの仕様変更
```

### 更新プロンプト

```
web-next/app/gemini/agent-harness-engineering/page.tsx を読んでください。

以下の作業を行ってください:
1. ヒーローセクションのバージョン情報・年月を最新版に更新する。
2. SOURCES 配列のリンク切れをチェック・修正する。
3. Gemini 環境下での 2段階エージェントモデルや、CLAUDE.md に相当する GEMINI.md の記述指針に更新があれば外科的に修正する。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/gemini/agent-harness-engineering` がパスする
- [ ] `bun run build` が成功する

---

## 画面 28 — `/gemini/antigravity-slash-commands-guide`（Antigravity スラッシュコマンド完全ガイド）

**ファイル**: `web-next/app/gemini/antigravity-slash-commands-guide/page.tsx`  
**URL**: `/gemini/antigravity-slash-commands-guide`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- Gemini CLI から Antigravity CLI への移行に伴う、最新のスラッシュコマンド体系（/memory, /restore, /compress 等）
- 設定ファイル（.gemini/settings.json）の新設定項目
```

### 更新プロンプト

```
web-next/app/gemini/antigravity-slash-commands-guide/page.tsx を読んでください。

以下の作業を行ってください:
1. metadata.title のバージョン（例: "v0.44.1"）およびヒーロー内のバージョン・更新年月を最新のものにする。
2. SOURCES のリンク切れを修正する。
3. コマンド体系（例: `/rewind` が `/restore` へ統合など）の挙動変更に応じて、説明テーブルやステップリストの記述を外科的に修正する。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/gemini/antigravity-slash-commands-guide` がパスする
- [ ] `bun run build` が成功する
- [ ] プレビュー画面で移行案内アラートなどが正しく表示されているか確認する

---

## 画面 29 — `/gemini/harness-engineering`（ハーネスエンジニアリング完全ガイド 2026 - Gemini CLI & Antigravity）

**ファイル**: `web-next/app/gemini/harness-engineering/page.tsx`  
**URL**: `/gemini/harness-engineering`  
**更新頻度**: 毎月

### 事前確認

```
以下を WebSearch で確認する:
- Gemini CLI / Antigravity 環境下でのハーネス設計の最新情報
- GEMINI.md や `.geminiignore` の仕様変更
```

### 更新プロンプト

```
web-next/app/gemini/harness-engineering/page.tsx を読んでください。

以下の作業を行ってください:
1. ヒーローセクションのバージョン情報・更新年月を最新版にする。
2. SOURCES のリンク切れをチェック・修正する。
3. ハーネス構造やサンプルスクリプト（init.sh 等）に Gemini/Antigravity 固有の仕様変更があれば、外科的に修正する。
```

### 検証チェックリスト

- [ ] `bun run test web-next/app/gemini/harness-engineering` がパスする
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

## 全画面一括更新フロー（月次メンテナンス）

月次更新を効率よく行うための推奨フロー:

```
1. [情報収集] 各プロバイダーの changelog を確認（約 30 分）
   - Anthropic: https://docs.anthropic.com/changelog
   - Google AI: https://developers.googleblog.com/
   - OpenAI: https://platform.openai.com/docs/changelog
   - GitHub: https://github.blog/changelog/

2. [優先度判定] 変更が大きい画面から着手する
   高優先: バージョン番号が古い・リンク切れが多い画面
   低優先: 変更のない画面（スキップ可）

3. [実行] 各画面のプロンプトを Claude Code に投入する
   推奨: 1セッションで 2〜3 画面まで（コンテキスト肥大化防止）

4. [検証] 全画面更新後に一括チェック
   cd web-next && bun run build && bun run test && bun run typecheck && bun run lint

5. [コミット] /commit-commands:commit-push-pr スキルを使用
   コミットメッセージ例: "docs(guide): monthly update YYYY-MM"
```

---

*最終更新: 2026-05-24 — 初版作成*
