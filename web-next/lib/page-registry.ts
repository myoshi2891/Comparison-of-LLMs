/**
 * ページレジストリ — 全ページのメタデータの Single Source of Truth。
 *
 * plans/006-platform-roadmap-v2.md §2.3 (F-1) に基づく。鮮度表示 (PageFreshness)・
 * What's New・sitemap・**ナビゲーション** はすべて本ファイルから導出し、属性の複製先を増やさない。
 *
 * 設計判断:
 * - nav-links.ts の Zod 検証パターンを踏襲し、モジュール評価時に parse して
 *   不正データをビルド時に落とす（実行時に壊れたページを配信しない）。
 * - `lastReviewed` は「人間が内容を確認した日」。初期値は各 page.tsx の最終コミット日を
 *   機械採取した値で、以降は monthly-update スキルの月次確認が当日日付へ書き戻す。
 * - `group` / `category` はナビの 1 段目 / 2 段目。F-4'（plans/008）以降、
 *   nav-links.ts はこれらから **導出** される（手書きのナビデータは廃止）。
 *   グループの並び順と「どのグループをネストするか」は lib/nav-taxonomy.ts が持つ。
 * - `addedAt` は git の初回追加日（`--diff-filter=A --follow`）。What's New の「新着」順、
 *   およびナビのリーフ並び順（古い順）に使う。
 *
 * 新規ページを追加したら必ず本レジストリにも登録すること。登録すればナビにも自動的に載る。
 * tests/page-registry-coverage.test.ts が登録漏れを機械検知する。
 */

import { z } from "zod";
import { isNestedGroup, NAV_GROUPS } from "./nav-taxonomy";

/** YYYY-MM-DD 形式のみ許可（localeCompare による日付比較が成立する前提を守る） */
const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");

const slugSchema = z
  .string()
  .min(1)
  .refine((s) => s.startsWith("/"), "slug must start with /");

export const PageEntrySchema = z
  .object({
    /** ルートパス。Home は "/"。末尾スラッシュなし。 */
    slug: slugSchema,
    /** ナビ表示名 */
    title: z.string().min(1),
    /** SEO用 description */
    description: z.string().min(1).optional(),
    /** ナビのトップレベル分類。順序は lib/nav-taxonomy.ts の NAV_GROUPS が持つ。 */
    group: z.enum(NAV_GROUPS),
    /** ナビ 2 段目の表示ラベル。2 段ネストするグループ（= Providers）でのみ必須。 */
    category: z.string().min(1).optional(),
    /** プロバイダー系ページのみ。識別子であり表示ラベルではない（表示は category）。 */
    provider: z.enum(["claude", "google", "codex", "copilot", "moonshot", "deepseek", "xai"]).optional(),
    /** 横断検索・関連リンク (F-5 / F-7) 用のトピックタグ */
    topics: z.array(z.string()),
    /** 一覧・What's New に出す 1〜2 文の要約 */
    summary: z.string().min(1),
    /** 公開日（git の初回追加日） */
    addedAt: isoDateSchema,
    /** 最終確認日（人間が内容を確認した日） */
    lastReviewed: isoDateSchema,
  })
  .refine((e) => !isNestedGroup(e.group) || Boolean(e.category), {
    message: "2 段ネストするグループのエントリには category が必須",
    path: ["category"],
  });

export type PageEntry = z.infer<typeof PageEntrySchema>;

const entries: PageEntry[] = [
  {
    slug: "/",
    title: "Home",
    group: "Home",
    topics: [],
    summary:
      "AI モデルの API 料金とコーディングツールのサブスク料金を時間別に比較するコスト計算機。",
    addedAt: "2026-04-11",
    lastReviewed: "2026-04-13",
  },
  {
    slug: "/agent/context-engineering-best-practices",
    title: "Context Engineering",
    group: "Agent 開発",
    topics: ["agent", "context-engineering"],
    summary:
      "プロンプト単体の最適化ではなく、システムプロンプト、ツール定義、履歴、外部データ、メモリ等を含むコンテキスト全体を設計・キュレーションするコンテキストエンジニアリングの実践ガイド。",
    addedAt: "2026-07-11",
    lastReviewed: "2026-07-12",
  },
  {
    slug: "/agent/hermes-agent-advanced-guide",
    title: "Advanced Guide",
    group: "Agent 開発",
    topics: ["agent", "guide"],
    summary: "内部アーキテクチャ / 7層セキュリティ / 本番デプロイメントベストプラクティス",
    addedAt: "2026-06-04",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/agent/loop-engineering",
    title: "Loop Engineering Guide",
    group: "Agent 開発",
    topics: ["agent", "loop"],
    summary:
      "Boris Cherny氏（Claude Code開発者）、Peter Steinberger氏（OpenClaw開発者）、Andrew Ng氏らの発言をもとに、AIエージェントを自律的に反復させる「Loop Engineering」を初学者向けにステップバイステップで解説します。",
    addedAt: "2026-07-05",
    lastReviewed: "2026-07-05",
  },
  {
    slug: "/agent/openclaw-advanced-agent-security-guide",
    title: "OpenClaw Security Guide",
    group: "Agent 開発",
    topics: ["agent", "security", "guide"],
    summary:
      "OpenClaw Agent の内部構造からサブエージェント、プラグインフック、MITRE ATLAS脅威モデル、サンドボックス設定、セキュリティ監査、インシデントレスポンスまで、本番運用を見据えた高度な活用法を解説する詳細ガイド。",
    addedAt: "2026-06-05",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/agent/skills",
    title: "Agent Skills Guide",
    group: "Agent 開発",
    topics: ["skill", "agent"],
    summary:
      "Agent Skillsの仕組みと使い方を、Kaggle Whitepaperとagentskills.io、Anthropic公式ドキュメントをもとに初学者向けにステップバイステップで解説するガイドです。",
    addedAt: "2026-07-05",
    lastReviewed: "2026-07-05",
  },
  {
    slug: "/ci-cd/ai-cicd-automation-best-practices",
    title: "AI CI/CD Automation",
    group: "開発プロセス",
    topics: ["ci-cd"],
    summary:
      "機械学習(MLOps)・生成AI(LLMOps)・AIエージェントを活用した、AIシステムのCI/CD自動化プロセスを学ぶ初学者のためのステップバイステップ実践入門。",
    addedAt: "2026-07-11",
    lastReviewed: "2026-07-12",
  },
  {
    slug: "/claude/agent",
    title: "Agent",
    group: "Providers",
    category: "Claude",
    provider: "claude",
    topics: ["agent"],
    summary:
      "サブエージェント & Agent Teams 開発における CLAUDE.md・エージェント定義・MEMORY.md・README.md の役割と書き方を体系化したベストプラクティスガイド。",
    addedAt: "2026-04-19",
    lastReviewed: "2026-07-26",
  },
  {
    slug: "/claude/code-slash-commands",
    title: "Code Slash Commands",
    group: "Providers",
    category: "Claude",
    provider: "claude",
    topics: ["claude"],
    summary:
      "Claude Code セッションを制御するためのショートカット（スラッシュコマンド）を網羅した完全ガイド。セッション管理からモデル設定、実践ワークフローまでを解説。",
    addedAt: "2026-05-31",
    lastReviewed: "2026-05-31",
  },
  {
    slug: "/claude/cowork-guide",
    title: "Claude Cowork 実践ガイド",
    group: "Providers",
    category: "Claude",
    provider: "claude",
    topics: ["guide"],
    summary:
      "初学者がClaude Coworkを使いこなすためのステップバイステップ・ベストプラクティス。基礎から高度な運用、Scheduled Tasks、Dispatch、10の自衛対策まで完全解説。",
    addedAt: "2026-05-03",
    lastReviewed: "2026-07-29",
  },
  {
    slug: "/claude/fable-5-best-practices",
    title: "Fable 5 Best Practices",
    group: "Providers",
    category: "Claude",
    provider: "claude",
    topics: ["claude"],
    summary:
      "Claude Codeエンジニアのための中級〜上級者向けベストプラクティス。「指示を積み上げる」から「ゴールと検証基準を渡して任せる」へ ― Fable 5に最適化された思考法をステップバイステップで解説します。",
    addedAt: "2026-07-05",
    lastReviewed: "2026-07-26",
  },
  {
    slug: "/claude/harness-engineering",
    title: "Harness Engineering",
    group: "Providers",
    category: "Claude",
    provider: "claude",
    topics: ["harness"],
    summary: "AIエージェントが安定して動作するための「環境設計（ハーネス）」完全ガイド。",
    addedAt: "2026-05-28",
    lastReviewed: "2026-06-30",
  },
  {
    slug: "/claude/managed-agents",
    title: "Managed Agents",
    group: "Providers",
    category: "Claude",
    provider: "claude",
    topics: ["agent"],
    summary:
      "初学者でもわかるステップバイステップ解説。エージェントの作成から本番運用まで、ベストプラクティスを網羅します。",
    addedAt: "2026-05-31",
    lastReviewed: "2026-06-30",
  },
  {
    slug: "/claude/self-hosted-sandboxes",
    title: "Self-hosted Sandboxes",
    group: "Providers",
    category: "Claude",
    provider: "claude",
    topics: ["sandbox"],
    summary:
      "AIエージェントのツール実行環境を自社インフラに移動する方法を、初学者から実務者まで使えるようにステップバイステップで解説します。",
    addedAt: "2026-06-11",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/claude/skill",
    title: "Skill",
    group: "Providers",
    category: "Claude",
    provider: "claude",
    topics: ["skill"],
    summary:
      "CLAUDE.md / spec.md / requirements.md / design.md / tasks.md / MEMORY.md / SKILL.md など、Claude Code の仕様駆動開発 (SDD) を支えるマークダウンファイル群の役割・構造・ベストプラクティスを公式根拠付きで解説。",
    addedAt: "2026-04-18",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/claude/skill-guide",
    title: "Skill Guide",
    group: "Providers",
    category: "Claude",
    provider: "claude",
    topics: ["skill", "guide"],
    summary:
      "Claude Code に「専門的なスキル」を追加するための設定ファイル SKILL.md の概念・構造・活用方法を理解するための初学者向け完全ガイドです。",
    addedAt: "2026-05-01",
    lastReviewed: "2026-06-30",
  },
  {
    slug: "/claude/skill-guide-intermediate",
    title: "SKILL.md 実践ガイド",
    group: "Providers",
    category: "Claude",
    provider: "claude",
    topics: ["skill", "guide", "best-practices"],
    summary:
      "Claude Code を業務で使い込んでいる中級者〜上級者向けに、SKILL.md の設計思想・書き方・Claude Code固有のフロントマター・評価運用フローまでをステップバイステップで解説する実践ガイドです。",
    addedAt: "2026-05-02",
    lastReviewed: "2026-07-29",
  },
  {
    slug: "/claude/skills-sh",
    title: "skills.sh Guide",
    group: "Agent 開発",
    provider: "claude",
    topics: ["skill"],
    summary:
      "skills.shの仕組み、CLIの使い方、主要スキルの利用方法を初学者向けにステップバイステップで解説する技術ガイド",
    addedAt: "2026-07-05",
    lastReviewed: "2026-07-05",
  },
  {
    slug: "/code-review/coderabbit-guide",
    title: "CodeRabbit Guide",
    group: "開発プロセス",
    topics: ["code-review", "review", "guide"],
    summary: "AI コードレビューツール CodeRabbit の導入・設定・運用を解説する実践ガイド。",
    addedAt: "2026-06-01",
    lastReviewed: "2026-06-30",
  },
  {
    slug: "/code-review/copilot-code-review",
    title: "Copilot Code Review",
    group: "開発プロセス",
    topics: ["code-review", "review"],
    summary:
      "AI駆動のコードレビューをチーム開発に深く組み込む——概念・設定・運用まで中〜上級者向けにステップバイステップで解説",
    addedAt: "2026-06-01",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/code-review/sonar-qube",
    title: "SonarQube Guide",
    group: "開発プロセス",
    topics: ["code-review", "review"],
    summary:
      "SonarQube による静的解析とコード品質ゲートの実践ガイド。CI 連携とカバレッジ計測を解説。",
    addedAt: "2026-06-01",
    lastReviewed: "2026-06-30",
  },
  {
    slug: "/code-review/tool-pricing",
    title: "Tool Pricing",
    group: "開発プロセス",
    topics: ["code-review", "pricing", "review"],
    summary:
      "GitHub Copilot・Codex・Claude・CodeRabbit・SonarQube など Code Review 系 AI ツール 9 種の料金目安・主用途・メリット/デメリットを、価格の出典付きで横断比較。",
    addedAt: "2026-06-03",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/codex/agent",
    title: "OpenAI Codex サブエージェント開発ガイド",
    group: "Providers",
    category: "Codex",
    provider: "codex",
    topics: ["agent", "codex", "multiagent"],
    summary:
      "AGENTS.md・AGENTS.override.md・SKILL.md・config.toml・requirements.toml で構築するマルチエージェントワークフローの完全ガイド。",
    addedAt: "2026-04-26",
    lastReviewed: "2026-07-30",
  },
  {
    slug: "/codex/harness-engineering",
    title: "Harness Engineering",
    group: "Providers",
    category: "Codex",
    provider: "codex",
    topics: ["harness"],
    summary:
      "OpenAI Codex のハーネスエンジニアリング完全ガイド。エージェント実行環境の設計と運用。",
    addedAt: "2026-05-29",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/codex/openai-codex-guide",
    title: "Codex Guide",
    group: "Providers",
    category: "Codex",
    provider: "codex",
    topics: ["guide"],
    summary:
      "2026-06-29 最新版 (v0.142.4)。初学者から中級者まで、GPT-5.5 / GPT-5-Codex を搭載した AI コーディングエージェントを最大限に活かすベストプラクティスをステップバイステップで解説します（Codex Remote GA 対応）。",
    addedAt: "2026-05-08",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/codex/skill",
    title: "Skill",
    group: "Providers",
    category: "Codex",
    provider: "codex",
    topics: ["skill"],
    summary:
      "AGENTS.md / SKILL.md / .prompt.md / REQUIREMENTS.md / AGENT_TASKS.md — OpenAI Codex 最新 (2026年最新版) の AI 仕様駆動開発を支える全マークダウンファイルの役割・構造・ベストプラクティスを公式根拠付きで解説 (v0.142.4, GPT-5.5 / GPT-5-Codex 対応、Codex Remote GA)。",
    addedAt: "2026-04-18",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/copilot/agent",
    title: "Agent",
    group: "Providers",
    category: "Copilot",
    provider: "copilot",
    topics: ["agent"],
    summary:
      "GitHub Copilot .agent.md の完全ベストプラクティスガイド。フロントマター全仕様・ステップバイステップ作成・Handoffs（エージェント連鎖）・Subagents（サブエージェント）・MCP統合・マルチエージェント設計パターン・トラブルシューティングを 2026年6月最新版の公式ドキュメント準拠で解説。Cloud agent GA・組織/エンタープライズエージェント（JetBrains）・Copilot code review の AGENTS.md 対応に対応。",
    addedAt: "2026-04-27",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/copilot/github-copilot",
    title: "GitHub Copilot",
    group: "Providers",
    category: "Copilot",
    provider: "copilot",
    topics: ["copilot"],
    summary:
      "2026年6月最新版 — 初学者からエキスパートまで対応したステップバイステップのAIコーディングアシスタント活用法。Cloud agent GA・従量課金（AI Credits）・Copilot code review の AGENTS.md 対応を反映。",
    addedAt: "2026-05-08",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/copilot/markdown-file-guide",
    title: "Markdown Guide",
    group: "Providers",
    category: "Copilot",
    provider: "copilot",
    topics: ["guide"],
    summary:
      "copilot-instructions.md / .instructions.md / .prompt.md / .chatmode.md / .agent.md / AGENTS.md / SKILL.md / MCP / Plan Mode — Copilotの全カスタマイズファイル・新機能を根拠ソース付きで徹底解説。Copilot code review の AGENTS.md 対応（2026-06-18）・Cloud agent GA を反映。",
    addedAt: "2026-05-08",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/copilot/skill",
    title: "Skill",
    group: "Providers",
    category: "Copilot",
    provider: "copilot",
    topics: ["skill"],
    summary:
      "GitHub Copilot Coding Agent / VS Code Agent Mode / Copilot CLI 対応の SKILL.md ガイド。フロントマター完全仕様・Progressive Disclosure 3段階ローディング・ステップバイステップ作成・実践テンプレート集・トラブルシューティングを 2026年6月最新版の公式ドキュメント根拠付きで徹底解説。Copilot code review は AGENTS.md 対応（2026-06-18）、Cloud agent は GA。",
    addedAt: "2026-04-18",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/cursor/complete-guide",
    title: "Cursor Guide",
    group: "開発プロセス",
    topics: ["cursor", "guide"],
    summary:
      "初学者のためのCursor完全ガイド。AIオートコンプリート(Tab補完)、自律Agentモード、コンテキスト管理(@ Symbols)、カスタムルール/サブエージェント設定、MCP連携等の使い方とベストプラクティスを解説。",
    addedAt: "2026-07-04",
    lastReviewed: "2026-07-04",
  },
  {
    slug: "/cursor/complete-guide-intermediate",
    title: "Cursor Guide (中級)",
    group: "開発プロセス",
    topics: ["cursor", "guide"],
    summary:
      "中〜上級者のためのCursor実践ガイド。アーキテクチャ全体像、Tab補完、インライン編集、Plan Mode、Debug Mode、MCP、Agent Skills、Subagents、Hooks等の各機能の仕組みとベストプラクティスを解説。",
    addedAt: "2026-07-05",
    lastReviewed: "2026-07-05",
  },
  {
    slug: "/git-worktree",
    title: "Git Worktree",
    group: "開発プロセス",
    topics: ["worktree"],
    summary:
      "Claude / Gemini / Codex / GitHub Copilot — 4プラットフォームのドキュメントをAIツールとWebSearchで並列更新するための完全ガイド。git worktreeのセットアップから日常ワークフロー・GitHub Actions統合まで。",
    addedAt: "2026-05-08",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/sdd/ai-spec-driven-development-guide",
    title: "AI Spec-Driven Development",
    group: "開発プロセス",
    topics: ["sdd", "spec-driven-development", "agent", "guide"],
    summary:
      "初学者のためのステップバイステップ・ベストプラクティス。GitHub Spec Kit、AWS Kiro、Claude Codeなど2026年最新のSDD手法・ツール・EARS記法を網羅解説。",
    addedAt: "2026-07-26",
    lastReviewed: "2026-07-26",
  },
  {
    slug: "/sdd/spec-driven-development-guide",
    title: "Spec-Driven Development (中級・上級)",
    group: "開発プロセス",
    topics: ["sdd", "spec-driven-development", "ears", "architecture", "multi-agent"],
    summary:
      "バイブコーディング脱却からマルチエージェント検証、EARS記法、GitHub Spec Kit・AWS Kiro・BMAD実践まで網羅した、中級・上級エンジニア向け仕様駆動開発の実践ガイド。",
    addedAt: "2026-07-26",
    lastReviewed: "2026-07-26",
  },
  {
    slug: "/google/adk-best-practices",
    title: "ADK Best Practices",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["google"],
    summary:
      "Google Agent Development Kit (ADK) を用いた、マルチエージェント設計、状態管理、コンテキスト最適化、コールバック、評価、可観測性、デプロイメントのステップバイステップ実践ガイド。",
    addedAt: "2026-07-11",
    lastReviewed: "2026-07-13",
  },
  {
    slug: "/google/enterprise-agent-platform",
    title: "Gemini Enterprise Agent Platform",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["google", "agent", "platform"],
    summary:
      "Google Cloud の Gemini Enterprise Agent Platform の全体像を理解し、エージェント構築からマルチエージェント設計、セキュリティ、本番運用までを網羅した初学者向け実践ガイド。",
    addedAt: "2026-07-19",
    lastReviewed: "2026-07-19",
  },
  {
    slug: "/google/agent",
    title: "Antigravity AI仕様駆動開発",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["antigravity", "spec-driven-development", "markdown", "agent"],
    summary:
      "AIエージェントIDE「Google Antigravity」が扱う4種類のMarkdownファイル（Rules / Skills / Workflows / Artifacts）の役割・置き場所・書き方・ベストプラクティスを体系化した完全ガイド。",
    addedAt: "2026-04-24",
    lastReviewed: "2026-07-29",
  },
  {
    slug: "/google/agent-harness-engineering",
    title: "Agent Harness Engineering",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["agent", "harness"],
    summary:
      "Google ADKとGeminiを組み合わせたAIエージェント評価ハーネスの設計思想、実装パターン、テストダブル、LLM-as-Judge、CI統合のベストプラクティスを解説する完全ガイドです。",
    addedAt: "2026-05-30",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/google/antigravity-guide",
    title: "Antigravity CLI 完全ガイド",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["guide", "cli"],
    summary:
      "Antigravity CLI (agy) の全スラッシュコマンド、キーバインド、設定ファイル (settings.json)、自動化・CI/CD連携、セキュリティモデルを包括的に解説した完全ガイド。",
    addedAt: "2026-05-08",
    lastReviewed: "2026-07-28",
  },
  {
    slug: "/google/antigravity-slash-commands-guide",
    title: "Antigravity Slash Commands",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["guide"],
    summary:
      "Gemini CLI / Antigravity CLI の全コマンドをステップバイステップで解説。初学者がゼロから実践できるベストプラクティス付き。",
    addedAt: "2026-06-02",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/google/harness-engineering",
    title: "Harness Engineering",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["harness"],
    summary:
      "Googleが実践するテストハーネス設計の技術とベストプラクティスを解説する完全ガイドです。",
    addedAt: "2026-05-28",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/google/notebook-lm",
    title: "NotebookLM Guide",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["google"],
    summary:
      "Google NotebookLM を実務や研究で使いこなすための中〜上級者向け完全ガイド。アーキテクチャの理解からソース設計、カスタムインストラクション、Studio活用、Gemini連携、セキュリティ・Enterprise導入、トラブルシューティングまで網羅。",
    addedAt: "2026-07-10",
    lastReviewed: "2026-07-11",
  },
  {
    slug: "/google/sandbox-best-practices",
    title: "Google Sandbox",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["sandbox"],
    summary:
      "AIエージェント・API・コンテナ・C/C++・ブラウザ、それぞれの領域で Google が推奨する安全なサンドボックス技術（実行の箱）を、初学者でも理解できるよう図解とステップで解説します。",
    addedAt: "2026-06-12",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/google/skill",
    title: "Agent Skills 実践ガイド",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["skill", "antigravity", "guide"],
    summary:
      "Antigravity IDE における SKILL.md の設計思想・アーキテクチャ・実装パターン・運用を中級〜上級エンジニア向けにステップバイステップで解説する実践ガイド。",
    addedAt: "2026-04-18",
    lastReviewed: "2026-07-29",
  },
  {
    slug: "/google/skill-guide",
    title: "Skill Guide",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["skill", "guide"],
    summary:
      "AIエージェントに「専門知識の教科書」を渡す仕組み — SKILL.md の構造・書き方・インストール手順を Gemini CLI v0.43.0 (最終版) & Antigravity v2.0.1 対応版で完全解説。Google I/O 2026 発表内容対応。Gemini CLI は 2026-06-18 に AI Pro/Ultra/無料 Code Assist 向けサンセット済（→ Antigravity CLI へ移行）。",
    addedAt: "2026-05-07",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/google/antigravity-best-practices",
    title: "Antigravity ベストプラクティス",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["antigravity", "best-practices", "agent"],
    summary:
      "Google Antigravity IDE・CLI の設計思想、アーキテクチャ、Rules (GEMINI.md)、Skills (SKILL.md)、Workflows、Artifacts、Permissions、Claude Code との比較・共存戦略まで、仕様駆動開発を支えるエコシステム全容を網羅。",
    addedAt: "2026-05-07",
    lastReviewed: "2026-07-29",
  },
  {
    slug: "/google/stitch-guide",
    title: "Stitch Guide",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["guide"],
    summary:
      "Google Labsが提供する無料のAIデザインツール「Google Stitch」の実践ガイド。Vibe Design、無限キャンバス、DESIGN.mdによるデザインシステム管理、MCP・SDK統合、プロンプト設計などのベストプラクティスを解説。",
    addedAt: "2026-07-12",
    lastReviewed: "2026-07-12",
  },
  {
    slug: "/governance/ai-governance",
    title: "AI Governance Guide",
    group: "運用・品質",
    topics: ["ai-governance", "risk-management", "compliance", "security"],
    summary:
      "AIガバナンスの基礎、国際フレームワーク、組織での構築手順、RACIマトリクスを初学者向けに解説する実践ガイド。",
    addedAt: "2026-07-17",
    lastReviewed: "2026-07-17",
  },
  {
    slug: "/infra/amazon-bedrock-best-practices-2026-intermediate",
    title: "Amazon Bedrock 完全ガイド",
    group: "運用・品質",
    topics: ["bedrock", "aws", "infra", "rag", "agent", "guardrails"],
    summary:
      "Amazon Bedrockのアーキテクチャ、モデル選定、Prompt Management、RAG、エージェント、Guardrails、コスト最適化、セキュリティ、可観測性を網羅した実践ガイド。",
    addedAt: "2026-07-22",
    lastReviewed: "2026-07-22",
  },
  {
    slug: "/infra/amazon-bedrock-best-practices-guide",
    title: "Amazon Bedrock 活用ガイド",
    description:
      "Amazon Bedrockを使ったジェネレーティブAIアプリケーション構築のベストプラクティスを初学者から実務者まで段階的に学べる完全ガイド。",
    group: "運用・品質",
    topics: ["bedrock", "aws", "infra", "rag", "agent", "guardrails"],
    summary:
      "Amazon Bedrockを使ったジェネレーティブAIアプリケーション構築のベストプラクティスを初学者から実務者まで段階的に学べる完全ガイド。",
    addedAt: "2026-07-22",
    lastReviewed: "2026-07-22",
  },
  {
    slug: "/llm-ops/evaluation-observability",
    title: "Evaluation & Observability",
    group: "運用・品質",
    topics: ["llm-ops"],
    summary:
      "LLMアプリケーションの品質評価(Evaluation)、公開ベンチマーク(Benchmarking)の読み方、そして本番環境でのオブザーバビリティ(Observability)を体系的に学びたいエンジニア向けのベストプラクティスガイド。",
    addedAt: "2026-07-12",
    lastReviewed: "2026-07-12",
  },
  {
    slug: "/local-llm/best-practices",
    title: "Self-hosting Best Practices",
    group: "モデル・データ",
    topics: ["local-llm"],
    summary:
      "モデル選定から量子化、推論エンジン、ハードウェア設計、セキュリティ、RAG、ファインチューニング、可観測性、デプロイ運用まで——中級〜上級エンジニアが自前のLLM基盤を安全かつ継続可能な形で運用するための、一気通貫の実践リファレンス。",
    addedAt: "2026-07-11",
    lastReviewed: "2026-07-12",
  },
  {
    slug: "/local-llm/finetuning-best-practices",
    title: "LLMファインチューニング ベストプラクティスガイド",
    group: "モデル・データ",
    topics: ["local-llm", "fine-tuning"],
    summary:
      "LLMファインチューニングの目的設定、モデル・手法・データの選定、学習、評価、破局的忘却対策、RLHF/DPO、デプロイまでを体系的に解説する実践ガイド。",
    addedAt: "2026-07-16",
    lastReviewed: "2026-07-16",
  },
  {
    slug: "/local-llm/self-hosting",
    title: "Self-hosting Guide",
    group: "モデル・データ",
    topics: ["local-llm"],
    summary:
      "クラウドAPIを使わず、自分のPCやサーバーでLLMを動かすための実践ガイド。ハードウェア選定、モデル選定、推論エンジン(Ollama/vLLM)、Web UI、RAG構築、本番運用、セキュリティ対策までステップバイステップで解説します。",
    addedAt: "2026-07-10",
    lastReviewed: "2026-07-11",
  },
  {
    slug: "/mcp/mcp-best-practices",
    title: "MCP Best Practices",
    group: "Agent 開発",
    topics: ["mcp"],
    summary:
      "Model Context Protocol (MCP) のアーキテクチャ基礎からツール設計、セキュリティ、本番運用まで、一次情報に基づいて解説する初学者向けステップバイステップ・ベストプラクティスガイド。",
    addedAt: "2026-07-12",
    lastReviewed: "2026-07-13",
  },
  {
    slug: "/mcp/mcp-best-practices-intermediate",
    title: "MCP Best Practices (中級)",
    group: "Agent 開発",
    topics: ["mcp"],
    summary:
      "Model Context Protocol (MCP) の詳細なアーキテクチャ、バージョン管理、トランスポート、セキュリティ、認証・認可から運用プラクティスまで網羅的に解説するベストプラクティスガイド。",
    addedAt: "2026-07-12",
    lastReviewed: "2026-07-13",
  },
  {
    slug: "/model-data/gpt-5-6-best-practices",
    title: "GPT-5.6 Best Practices",
    group: "Providers",
    category: "Codex",
    provider: "codex",
    topics: ["openai", "gpt-5-6", "best-practices"],
    summary:
      "OpenAI GPT-5.6 Sol / Terra / Luna のモデル選定、Reasoning、Programmatic Tool Calling、移行、コスト最適化を体系的に解説する実践ガイド。",
    addedAt: "2026-07-16",
    lastReviewed: "2026-07-16",
  },
  {
    slug: "/multimodal/generation-best-practices",
    title: "Generation Best Practices",
    group: "モデル・データ",
    topics: ["multimodal"],
    summary:
      "これから画像・音声生成AIを学ぶ初学者を対象に、再現可能な手順、モデル横断の普遍原則とモデル固有のコツ、安全性と法令遵守を解説するベストプラクティスガイド。",
    addedAt: "2026-07-12",
    lastReviewed: "2026-07-13",
  },
  {
    slug: "/multimodal/image-audio-best-practices-2026",
    title: "Image & Audio (2026)",
    group: "モデル・データ",
    topics: ["multimodal"],
    summary:
      "拡散モデルの内部構造からモデル選定、プロンプト設計、ControlNet/LoRAによる制御、リアルタイム音声対話エージェント、コンテンツ来歴・法規制、プロダクション運用まで。中級〜上級のAIエンジニア向けに、意思決定に使える粒度でステップバイステップに解説します。",
    addedAt: "2026-07-12",
    lastReviewed: "2026-07-12",
  },
  {
    slug: "/rag/embeddings-best-practices",
    title: "RAG & Embeddings",
    group: "モデル・データ",
    topics: ["rag"],
    summary:
      "RAG (検索拡張生成) と Embedding (埋め込み) についてゼロから実務レベルまで理解できるように、チャンキング、モデル選定、ベクトルDB、検索最適化、本番運用、評価方法などを体系的に解説する完全ガイド。",
    addedAt: "2026-07-12",
    lastReviewed: "2026-07-12",
  },
  {
    slug: "/search",
    title: "検索",
    group: "検索",
    // topics を空にするのは意図的。検索ページ自身が検索結果や関連リンクに出ると導線が濁る。
    topics: [],
    summary:
      "全ガイドをキーワードとトピックタグで横断検索するページ。検索インデックスはページレジストリからビルド時に生成する。",
    addedAt: "2026-07-14",
    lastReviewed: "2026-07-14",
  },
  {
    slug: "/security/ai-security-best-practices",
    title: "AI Security Best Practices",
    group: "運用・品質",
    topics: ["security"],
    summary:
      "初学者のためのステップバイステップ解説。OWASP・MITRE ATLAS・NIST・Google SAIF・EU AI Actなど業界標準フレームワークに基づき、LLMアプリケーションとAIエージェントのセキュリティを体系的に解説します。",
    addedAt: "2026-07-09",
    lastReviewed: "2026-07-11",
  },
  {
    slug: "/security/ai-security-best-practices-intermediate",
    title: "AI Security Best Practices (中級)",
    group: "運用・品質",
    topics: ["security"],
    summary:
      "LLM・RAG基盤・AIエージェント・MCP(Model Context Protocol)連携システムを設計/実装/運用するエンジニアのための、2026年7月時点の最新フレームワークと実践的な多層防御の設計指針。",
    addedAt: "2026-07-11",
    lastReviewed: "2026-07-12",
  },
  {
    slug: "/whats-new",
    title: "What's New",
    group: "What's New",
    topics: [],
    summary:
      "新しく公開したガイドと、直近で内容を確認したガイドの一覧。ページレジストリから静的生成。",
    addedAt: "2026-07-13",
    lastReviewed: "2026-07-13",
  },
  {
    slug: "/vercel/sandbox",
    title: "Vercel Sandbox",
    group: "Agent 開発",
    topics: ["sandbox"],
    summary:
      "信頼できないコードをミリ秒単位で安全に実行できる Linux マイクロVM。初学者でもわかるステップバイステップ解説＋ベストプラクティス付き。",
    addedAt: "2026-06-16",
    lastReviewed: "2026-07-01",
  },
  {
    slug: "/claude/tag-best-practices",
    title: "Claude Tag 活用ガイド ― 中級者〜上級者向けベストプラクティス",
    description:
      "Slack上でチームがClaudeをタグ付けして仕事を委任できる新機能「Claude Tag」について、公式ドキュメントやコミュニティ発信をもとにまとめた中級者〜上級者向け実践ガイド。",
    group: "Providers",
    category: "Claude",
    provider: "claude",
    topics: ["claude", "slack", "agent"],
    summary:
      "Slack上でチームがClaudeをタグ付けして仕事を委任できる新機能「Claude Tag」について、公式ドキュメントやコミュニティ発信をもとにまとめた中級者〜上級者向け実践ガイド。",
    addedAt: "2026-07-19",
    lastReviewed: "2026-07-19",
  },
  {
    slug: "/google/enterprise-agent-platform-intermediate",
    title: "Gemini Enterprise Agent Platform (中級)",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["google", "agent", "platform", "best-practices"],
    summary:
      "Gemini Enterprise Agent Platform を実務レベルで使いこなすため、ADK・Agent Runtime・Memory Bank・A2A/MCP・ガバナンス機能などの設計指針を解説する中級〜上級者向け実践ガイド。",
    addedAt: "2026-07-19",
    lastReviewed: "2026-07-19",
  },
  {
    slug: "/google/gemma-best-practices-guide",
    title: "Gemma Best Practices Guide",
    description:
      "2026年4月に登場した新世代Gemma 4の制御トークン体系、Thinkingモード、Function Calling、量子化(QAT)戦略、ファインチューニング、デプロイ、安全性まで一次情報に基づいて網羅した実践ガイド。",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["google", "gemma", "best-practices"],
    summary:
      "2026年4月に登場した新世代Gemma 4の制御トークン体系、Thinkingモード、Function Calling、量子化(QAT)戦略、ファインチューニング、デプロイ、安全性まで一次情報に基づいて網羅した実践ガイド。",
    addedAt: "2026-07-22",
    lastReviewed: "2026-07-22",
  },
  {
    slug: "/moonshot/kimi-llm-best-practices",
    title: "Kimi LLM 徹底ガイド",
    description:
      "Moonshot AI が開発する Kimi K1.5 / K2 / K3 の超長文文脈（Long Context）処理、思考モード（Kimi Thinking）、Function Calling、マルチモーダル等の活用方法とベストプラクティスを解説する完全ガイド。",
    group: "Providers",
    category: "Moonshot",
    provider: "moonshot",
    topics: ["moonshot", "kimi", "llm", "best-practices"],
    summary:
      "Moonshot AI が開発する Kimi K1.5 / K2 / K3 の超長文文脈（Long Context）処理、思考モード（Kimi Thinking）、Function Calling、マルチモーダル等の活用方法とベストプラクティスを解説する完全ガイド。",
    addedAt: "2026-07-22",
    lastReviewed: "2026-07-22",
  },
  {
    slug: "/deepseek/llm-best-practices",
    title: "DeepSeek LLM ガイド",
    description:
      "DeepSeek-V3 / R1 / V4 などのモデル選定、Thinking Mode（思考モード）、Context Caching、Function Calling、Anthropic API互換連携までの初学者向け実践ベストプラクティスガイド。",
    group: "Providers",
    category: "DeepSeek",
    provider: "deepseek",
    topics: ["deepseek", "llm", "best-practices", "api", "thinking-mode"],
    summary:
      "DeepSeek-V3 / R1 / V4 などのモデル選定、Thinking Mode（思考モード）、Context Caching、Function Calling、Anthropic API互換連携までの初学者向け実践ベストプラクティスガイド。",
    addedAt: "2026-07-30",
    lastReviewed: "2026-07-30",
  },
  {
    slug: "/xai/grok-best-practices",
    title: "xAI Grok ガイド",
    description:
      "xAI API（Grok モデル群）をこれから使い始めるエンジニア・QAエンジニア向けに、モデル選定からセキュリティ運用まで、ステップバイステップで解説します。",
    group: "Providers",
    category: "xAI",
    provider: "xai",
    topics: ["xai", "grok", "best-practices", "api", "reasoning"],
    summary:
      "xAI API（Grok モデル群）をこれから使い始めるエンジニア・QAエンジニア向けに、モデル選定からセキュリティ運用まで、ステップバイステップで解説します。",
    addedAt: "2026-07-30",
    lastReviewed: "2026-07-30",
  },
];

/** ビルド時検証: 不正なエントリはここで例外になり、壊れたデータのまま配信されない。 */
export const pageRegistry: readonly PageEntry[] = entries.map((e) => PageEntrySchema.parse(e));

const bySlug = new Map(pageRegistry.map((e) => [e.slug, e]));

/**
 * Finds a page entry by its slug, ignoring trailing slashes.
 *
 * @param slug - The slug to search for, such as `/claude/skill`
 * @returns The matching page entry, or `undefined` if none is registered
 */
export function findBySlug(slug: string): PageEntry | undefined {
  let normalized = slug;
  while (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return bySlug.get(normalized);
}

/**
 * Lists page entries from newest to oldest by addition date.
 *
 * @param limit - Maximum number of entries to return; when omitted, returns all entries.
 * @returns Page entries ordered by descending `addedAt` date.
 */
export function byAddedAtDesc(limit?: number): PageEntry[] {
  const sorted = [...pageRegistry].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  return limit === undefined ? sorted : sorted.slice(0, limit);
}

/**
 * Lists pages ordered by most recent review date.
 *
 * @param limit - Maximum number of pages to return; returns all pages when omitted.
 * @returns Pages sorted by `lastReviewed` in descending order.
 */
export function byLastReviewedDesc(limit?: number): PageEntry[] {
  const sorted = [...pageRegistry].sort((a, b) => b.lastReviewed.localeCompare(a.lastReviewed));
  return limit === undefined ? sorted : sorted.slice(0, limit);
}
