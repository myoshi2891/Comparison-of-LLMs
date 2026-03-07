# git worktree × 4プラットフォーム並列開発ガイド — 参考リンク集

# （公式ドキュメント最優先版）

> **方針:** 各ベンダー公式ドキュメントを最上位に記載し、
> 補足情報は「公式 GitHub リポジトリ」または「公式ブログ」のみを採用。
> 非公式サイト・コミュニティサイトは除外。

---

## STEP 00: git worktree とは何か

### Git 公式（最優先）

- [git-worktree — Git 公式リファレンス](https://git-scm.com/docs/git-worktree)
- [gitrepository-layout — linked worktrees の内部構造](https://git-scm.com/docs/gitrepository-layout#Documentation/gitrepository-layout.txt-worktrees)
- [Git 2.5.0 リリースノート（worktree 導入）](https://github.com/git/git/blob/master/Documentation/RelNotes/2.5.0.txt)
- [.gitignore — Git 公式リファレンス](https://git-scm.com/docs/gitignore)

---

## STEP 01: ブランチ戦略設計

### Git 公式

- [git-branch — Git 公式リファレンス](https://git-scm.com/docs/git-branch)

### GitHub 公式

- [GitHub Flow — GitHub Docs](https://docs.github.com/en/get-started/quickstart/github-flow)
- [CODEOWNERS について — GitHub Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

---

## STEP 02: worktree セットアップ

### Git 公式

- [git worktree add](https://git-scm.com/docs/git-worktree#Documentation/git-worktree.txt-addltpathgtltcommit-ishgt)
- [git worktree list](https://git-scm.com/docs/git-worktree#Documentation/git-worktree.txt-list)

---

## STEP 03: 日常ワークフロー / AI 設定ファイル

### ■ Anthropic — Claude Code

| ファイル | 公式ドキュメント |
|---|---|
| `CLAUDE.md` / auto memory | [Memory — Claude Code 公式](https://code.claude.com/docs/en/memory) |
| Claude Code 概要 | [Claude Code Overview — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/overview) |
| カスタムコマンド | [Slash Commands — Claude Code 公式](https://docs.anthropic.com/en/docs/claude-code/slash-commands) |
| Settings / 設定ファイル | [Settings — Claude Code 公式](https://docs.anthropic.com/en/docs/claude-code/settings) |
| SDK（TypeScript / Python） | [Claude Code SDK — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/sdk) |
| GitHub リポジトリ | [anthropics/claude-code — GitHub](https://github.com/anthropics/claude-code) |

---

### ■ OpenAI — Codex CLI

| ファイル | 公式ドキュメント |
|---|---|
| Codex CLI 概要 | [Codex CLI — developers.openai.com](https://developers.openai.com/codex/cli/) |
| `AGENTS.md` 詳細仕様 | [Custom instructions with AGENTS.md — OpenAI 公式](https://developers.openai.com/codex/guides/agents-md/) |
| AGENTS.md オープン形式 | [openai/agents.md — GitHub（OpenAI 公式リポジトリ）](https://github.com/openai/agents.md) |
| `SKILL.md` — Skills | [Agent Skills — developers.openai.com](https://developers.openai.com/codex/skills/) |
| CLI コマンドリファレンス | [Command line options — OpenAI 公式](https://developers.openai.com/codex/cli/reference/) |
| CLI 機能一覧 | [Codex CLI features — OpenAI 公式](https://developers.openai.com/codex/cli/features/) |
| Agents SDK 連携 | [Use Codex with the Agents SDK — OpenAI 公式](https://developers.openai.com/codex/guides/agents-sdk) |
| Codex モデル一覧 | [Codex Models — developers.openai.com](https://developers.openai.com/codex/models/) |
| Codex 紹介ブログ | [Introducing Codex — openai.com](https://openai.com/index/introducing-codex/) |
| GitHub リポジトリ | [openai/codex — GitHub](https://github.com/openai/codex) |

> **補足:** `agents.md/AGENTS.md` の仕様は OpenAI が主導する
> `github.com/openai/agents.md` が一次ソースです。
> 複数のコーディングエージェント（Codex, Amp, Jules, Cursor, Factory など）
> が協働して策定したオープン形式です。

---

### ■ Google — Gemini CLI / Gemini Code Assist

| ファイル | 公式ドキュメント |
|---|---|
| Gemini CLI 概要 | [Gemini CLI — Google Cloud Docs](https://docs.cloud.google.com/gemini/docs/codeassist/gemini-cli) |
| `GEMINI.md` / `AGENT.md` | [Use the Gemini Code Assist agent mode — Google Cloud Docs](https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer) |
| Agent モード概要 | [Agent mode overview — Google Cloud Docs](https://cloud.google.com/gemini/docs/codeassist/agent-mode) |
| Gemini for Google Cloud（ルート） | [Gemini for Google Cloud Docs](https://cloud.google.com/gemini/docs) |
| リリースノート | [Gemini Code Assist release notes — Google Cloud](https://docs.cloud.google.com/gemini/docs/codeassist/release-notes) |
| Gemini CLI 学習コース（公式ブログ） | [Mastering Gemini CLI — Google Cloud Blog](https://cloud.google.com/blog/topics/developers-practitioners/mastering-gemini-cli-your-complete-guide-from-installation-to-advanced-use-cases) |

---

### ■ Microsoft / GitHub — GitHub Copilot

| ファイル | 公式ドキュメント |
|---|---|
| `copilot-instructions.md` | [Adding repository custom instructions — GitHub Docs](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) |
| カスタム指示の設定（全体） | [Configure custom instructions — GitHub Docs](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions) |
| `.instructions.md`（パス指定） | [Your first custom instructions — GitHub Docs](https://docs.github.com/en/copilot/tutorials/customization-library/custom-instructions/your-first-custom-instructions) |
| `.prompt.md`（プロンプトファイル） | [Your first prompt file — GitHub Docs](https://docs.github.com/en/copilot/tutorials/customization-library/prompt-files/your-first-prompt-file) |
| `AGENTS.md`（Copilot CLI 対応） | [Adding custom instructions for GitHub Copilot CLI — GitHub Docs](https://docs.github.com/en/copilot/how-tos/copilot-cli/add-repository-instructions) |
| カスタム指示サポート一覧 | [Support for different types of custom instructions — GitHub Docs](https://docs.github.com/en/copilot/reference/custom-instructions-support) |
| コードレビューでの活用 | [Using custom instructions for Copilot code review — GitHub Docs](https://docs.github.com/en/copilot/tutorials/use-custom-instructions) |
| 組織カスタム指示 | [Adding organization custom instructions — GitHub Docs](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-organization-instructions) |

---

## STEP 04〜05: git worktree 操作・エラー対処

### Git 公式

- [git worktree remove](https://git-scm.com/docs/git-worktree#Documentation/git-worktree.txt-remove)
- [git worktree prune](https://git-scm.com/docs/git-worktree#Documentation/git-worktree.txt-prune)
- [git worktree lock / unlock](https://git-scm.com/docs/git-worktree#Documentation/git-worktree.txt-lock)
- [git stash — Git 公式](https://git-scm.com/docs/git-stash)
- [githooks — Git hooks 公式](https://git-scm.com/docs/githooks)

---

## STEP 06: GitHub Actions 統合

### GitHub 公式

- [matrix strategy — GitHub Actions 公式](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/running-variations-of-jobs-in-a-workflow)
- [fail-fast の制御](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/running-variations-of-jobs-in-a-workflow#handling-failures)
- [actions/checkout@v4（fetch-depth）— GitHub](https://github.com/actions/checkout)

### Vercel 公式

- [Vercel CLI deploy — Vercel 公式](https://vercel.com/docs/cli/deploy)

---

## 全般: ダイアグラム・フォント・アクセシビリティ

- [Mermaid.js 公式ドキュメント](https://mermaid.js.org/)
- [Mermaid — gitGraph 構文](https://mermaid.js.org/syntax/gitgraph.html)
- [Mermaid — flowchart 構文](https://mermaid.js.org/syntax/flowchart.html)
- [Mermaid — sequenceDiagram 構文](https://mermaid.js.org/syntax/sequenceDiagram.html)
- [IBM Plex Mono — Google Fonts](https://fonts.google.com/specimen/IBM+Plex+Mono)
- [WCAG 2.1 コントラスト比ガイドライン — W3C](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

---

## ⚠️ 修正・削除した項目（前バージョンとの差分）

| 旧リンク | 理由 | 代替 |
|---|---|---|
| `agentprotocol.ai` | 非公式サイト（正確な出所が不明） | `github.com/openai/agents.md`（OpenAI 公式） |
| `Atlassian — Git worktree 解説` | 非公式サード パーティ | `git-scm.com/docs/git-worktree`（Git 公式）に統合 |
| `GitHub Spec Kit (pip install speckit)` | 公式リリース確認不可 | 削除 |
| `platform.openai.com/docs/codex/agents-md` | 旧パス・無効 URL | `developers.openai.com/codex/guides/agents-md/` に更新 |
