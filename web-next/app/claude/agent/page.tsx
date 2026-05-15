import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Claude Code サブエージェント Markdown ベストプラクティス | LLM コスト計算機",
  description:
    "Claude Code v2.1.142 のサブエージェント / Agent Teams 開発で必要な CLAUDE.md・エージェント定義・MEMORY.md・README.md の役割と書き方を体系化したガイド。",
};

type Source = { num: string; href: string; title: string; desc: string };

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function TemplateBlock({
  title,
  lang,
  body,
}: {
  title: string;
  lang: string;
  body: React.ReactNode;
}) {
  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span>{title}</span>
        <span className={styles.codeLang}>{lang}</span>
      </div>
      <div className={styles.codeBody}>
        <pre>
          <code>{body}</code>
        </pre>
      </div>
    </div>
  );
}

// ── named template constants ────────────────────────────────────────

const CLAUDE_MD_TEMPLATE = (
  <>
    <span className={styles.hlHead}># PROJECT: my-saas-app</span>
    {"\n\n"}
    <span className={styles.hlCmt}>## Overview</span>
    {"\n"}
    {"Next.js 15 + Supabase + Stripe。マルチテナント SaaS。\n"}
    {"本番環境は Vercel、DBは Supabase (PostgreSQL)。\n\n"}
    <span className={styles.hlCmt}>## Tech Stack</span>
    {"\n"}
    {"- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS\n"}
    {"- Backend: Supabase Edge Functions (Deno)\n"}
    {"- Auth: Supabase Auth + Row Level Security\n"}
    {"- Payment: Stripe Checkout / Webhooks\n\n"}
    <span className={styles.hlCmt}>## Build & Test</span>
    {"\n"}
    {"- Build:   `pnpm build`\n"}
    {"- Test:    `pnpm test` (Vitest)\n"}
    {"- Lint:    `pnpm lint` (ESLint + Prettier — **linterに任せること**)\n"}
    {"- DB型生成: `pnpm supabase gen types`\n\n"}
    <span className={styles.hlCmt}>## Sub-Agent Routing Rules</span>
    {"\n"}
    <span className={styles.hlWarn}>{"**Parallel dispatch** (全条件を満たす場合のみ):\n"}</span>
    {"- タスクが 3件以上で互いに独立\n"}
    {"- 共有ファイルなし・状態が独立\n"}
    {"- ドメイン境界が明確 (frontend / backend / db)\n\n"}
    <span className={styles.hlWarn}>{"**Sequential dispatch** (いずれかの条件で):\n"}</span>
    {"- タスクに依存関係がある (B は A の出力が必要)\n"}
    {"- 共有ファイル / 共有状態がある\n"}
    {"- スコープが不明確な場合\n\n"}
    <span className={styles.hlCmt}>## Domain Boundaries</span>
    {"\n"}
    {"- **frontend-agent** → app/, components/, styles/ のみ\n"}
    {"- **backend-agent**  → supabase/functions/, lib/server/ のみ\n"}
    {"- **db-agent**       → supabase/migrations/, schema.sql のみ\n\n"}
    <span className={styles.hlCmt}>## Forbidden Operations</span>
    {"\n"}
    {"- `supabase db reset` は絶対に実行しない (本番データ消去)\n"}
    {"- `--force` フラグは使わない; 代わりに `--dry-run` で確認\n"}
    {"- .env.production は読み書き禁止\n\n"}
    <span className={styles.hlCmt}>## Key Docs</span>
    {"\n"}
    {"- 詳細設計: docs/architecture.md\n"}
    {"- DB スキーマ: supabase/schema.sql\n"}
    {"- API仕様: docs/api-spec.md"}
  </>
);

const CODE_REVIEWER_TEMPLATE = (
  <>
    <span className={styles.hlStr}>{"---"}</span>
    {"\n"}
    <span className={styles.hlKey}>name</span>
    {": "}
    <span className={styles.hlVal}>code-reviewer</span>
    {"\n"}
    <span className={styles.hlKey}>description</span>
    {": "}
    <span className={styles.hlVal}>
      {
        '"コードレビューを実施する。PR作成後・コード変更後に自動で呼び出される。\n  セキュリティ・パフォーマンス・型安全性・ベストプラクティスをチェックする。"'
      }
    </span>
    {"\n"}
    <span className={styles.hlKey}>tools</span>
    {": "}
    <span className={styles.hlVal}>Read, Glob, Grep</span>
    {"   "}
    <span className={styles.hlCmt}># Read-only: 書き込みは行わない</span>
    {"\n"}
    <span className={styles.hlKey}>model</span>
    {": "}
    <span className={styles.hlVal}>sonnet</span>
    {"            "}
    <span className={styles.hlCmt}># コスト効率重視</span>
    {"\n"}
    <span className={styles.hlKey}>memory</span>
    {": "}
    <span className={styles.hlVal}>project</span>
    {"          "}
    <span className={styles.hlCmt}># プロジェクト固有のパターンを記憶</span>
    {"\n"}
    <span className={styles.hlStr}>{"---"}</span>
    {"\n\n"}
    <span className={styles.hlHead}>## Role</span>
    {
      "\nあなたはシニアエンジニアのコードレビュアーです。\nコードの品質・セキュリティ・パフォーマンスを厳しくチェックします。\n\n"
    }
    <span className={styles.hlHead}>## Review Checklist</span>
    {"\nレビュー開始前に **必ず MEMORY.md を確認** し、過去のパターンを参照してください。\n\n"}
    <span className={styles.hlSub}>### Security</span>
    {"\n"}
    {"- [ ] SQL インジェクション / XSS リスクがないか\n"}
    {"- [ ] 認証・認可が適切に実装されているか\n"}
    {"- [ ] 秘密情報がハードコードされていないか\n\n"}
    <span className={styles.hlSub}>### Performance</span>
    {"\n"}
    {"- [ ] N+1 クエリが発生していないか\n"}
    {"- [ ] 不要な再レンダリングがないか (React)\n"}
    {"- [ ] 重い処理が非同期化されているか\n\n"}
    <span className={styles.hlSub}>### Code Quality</span>
    {"\n"}
    {"- [ ] 型定義が適切か (TypeScript)\n"}
    {"- [ ] エラーハンドリングが漏れていないか\n"}
    {"- [ ] テストが書かれているか\n\n"}
    <span className={styles.hlHead}>## Output Format</span>
    {
      "\n以下の形式でレポートを出力してください：\n```\n## Code Review Report\n### 🔴 Critical (要対応)\n### 🟡 Warning (推奨対応)  \n### 🟢 Good (良い点)\n```\n\n"
    }
    <span className={styles.hlHead}>## Memory Management</span>
    {
      "\nレビュー完了後、新しいパターンや繰り返し発生する問題を MEMORY.md に追記してください。\nMEMORY.md が 200行を超えた場合は要約・整理してください。"
    }
  </>
);

const MEMORY_MD_TEMPLATE = (
  <>
    <span className={styles.hlHead}># Code Reviewer Memory</span>
    {"\n"}
    <span className={styles.hlCmt}>
      {
        "<!-- このファイルは code-reviewer エージェントが自動更新します。200行を超えたら要約してください -->"
      }
    </span>
    {"\n"}
    <span className={styles.hlCmt}>{"<!-- Last updated: 2026-10-15 | Lines: 47 -->"}</span>
    {"\n\n"}
    <span className={styles.hlSub}>## Recurring Patterns (繰り返し発生する問題)</span>
    {"\n\n"}
    <span className={styles.hlHead}>### Security</span>
    {"\n"}
    {
      "- [2026-10-10] `src/lib/db.ts`: ユーザー入力を直接SQLに結合していた → Prepared Statement を使うよう修正済\n"
    }
    {
      "- [2026-10-12] `app/api/**/*.ts`: 認証チェックが middleware でのみ行われ、handler内で再検証なし → 二重チェック必須\n\n"
    }
    <span className={styles.hlHead}>### Performance</span>
    {"\n"}
    {
      "- [2026-10-08] Supabase の `.select('*')` が多用されている → 必要カラムのみ指定する慣習を徹底\n"
    }
    {
      "- [2026-10-14] React Server Component で useClient が不必要に使われている → 'use client' は最小化\n\n"
    }
    <span className={styles.hlHead}>### Code Conventions (このプロジェクト固有)</span>
    {"\n"}
    {"- エラーは必ず `Result<T, E>` 型でラップする (throw 禁止)\n"}
    {"- API route は `zod` でリクエストバリデーションが必須\n"}
    {"- Server Action の命名は `action` プレフィックス (例: `actionCreateUser`)\n\n"}
    <span className={styles.hlSub}>## Known Good Patterns</span>
    {"\n"}
    {"- `src/lib/auth.ts` の `withAuth()` HOF: 認証パターンの模範例\n"}
    {"- `supabase/functions/stripe-webhook/`: エラーハンドリングの模範例"}
  </>
);

const README_MD_TEMPLATE = (
  <>
    <span className={styles.hlHead}># Agent Architecture</span>
    {"\n\n"}
    <span className={styles.hlSub}>## パイプライン概要</span>
    {"\n```\npm-spec → architect-review → implementer → code-reviewer\n```\n\n"}
    <span className={styles.hlSub}>## エージェント一覧</span>
    {"\n\n| Agent | Model | Tools | いつ使う |\n|-------|-------|-------|---------|"}
    {"\n| pm-spec | sonnet | Read/Write | 新機能の仕様作成時 |"}
    {"\n| architect-review | opus | Read/Write/Bash | 設計レビュー・ADR作成時 |"}
    {"\n| implementer | sonnet | All | コード実装時 |"}
    {"\n| code-reviewer | sonnet | Read のみ | PR・コード変更後 |\n\n"}
    <span className={styles.hlSub}>## ステータスフロー</span>
    {"\n`DRAFT` → `READY_FOR_ARCH` → `READY_FOR_BUILD` → `REVIEW` → `DONE`\n\n"}
    <span className={styles.hlSub}>## 使い方</span>
    {
      '\n```bash\n# 自動ルーティング（Claude が適切なエージェントを選択）\n"新しい決済機能の仕様を作成して"\n\n# 明示的に指定\n"code-reviewer エージェントで src/payment/ をレビューして"\n```'
    }
  </>
);

const AGENT_TEAMS_CLAUDE_MD_TEMPLATE = (
  <>
    <span className={styles.hlHead}># PROJECT: my-saas-app</span>
    {"\n"}
    <span className={styles.hlCmt}>## Overview ... (既存セクション省略)</span>
    {"\n\n"}
    <span className={styles.hlCmt}>
      {"## ─── Agent Teams Configuration ────────────────────────────────────"}
    </span>
    {"\n"}
    <span className={styles.hlHead}>## Agent Teams — File Ownership Rules</span>
    {"\n"}
    <span className={styles.hlWarn}>
      {"競合防止のため、テイムメイトは以下の境界を厳守すること:\n"}
    </span>
    {"\n| Teammate Role | 書き込み可能なパス | 読み取り |\n"}
    {"|---|---|---|\n"}
    {"| frontend-teammate | app/, components/, styles/ | 全体 |\n"}
    {"| backend-teammate  | supabase/functions/, lib/server/ | 全体 |\n"}
    {"| db-teammate       | supabase/migrations/ | 全体 |\n"}
    {"| test-teammate     | tests/, **/*.test.ts | 全体 |\n\n"}
    <span className={styles.hlWarn}>{"同一ファイルへの同時書き込みは絶対に行わないこと。\n"}</span>
    {"担当外ファイルを変更したい場合はリードに報告し指示を仰ぐこと。\n\n"}
    <span className={styles.hlHead}>## Agent Teams — Task &quot;Done&quot; Definition</span>
    {"\nテイムメイトがタスクを "}
    <span className={styles.hlStr}>&quot;completed&quot;</span>
    {" にマークする前に"}
    <strong>{"必ず確認すること"}</strong>
    {":\n- [ ] "}
    <span className={styles.hlStr}>{"`pnpm test`"}</span>
    {" がすべて PASS している\n- [ ] "}
    <span className={styles.hlStr}>{"`pnpm lint`"}</span>
    {
      " にエラーがない\n- [ ] 担当ファイルのみが変更されている\n- [ ] リードへの完了レポートに変更ファイル一覧・テスト結果を含める\n\n"
    }
    <span className={styles.hlHead}>## Agent Teams — Communication Protocol</span>
    {"\n- リードへの報告形式:\n  "}
    <span className={styles.hlStr}>
      &quot;DONE: [タスクID] [変更ファイル一覧] [テスト結果]&quot;
    </span>
    {"\n- 他テイムメイトへのブロック報告:\n  "}
    <span className={styles.hlStr}>&quot;BLOCKED: [依存タスクID] を待機中&quot;</span>
    {"\n- 型定義など共有 API が変わった場合は関係テイムメイトに SendMessage\n\n"}
    <span className={styles.hlHead}>## Agent Teams — Forbidden</span>
    {"\n- チームクリーンアップをテイムメイトから実行することは"}
    <span className={styles.hlBad}>{"禁止"}</span>
    {"（必ずリードから）\n- 担当外ディレクトリへの書き込み"}
    <span className={styles.hlBad}>{"禁止"}</span>
    {"\n- "}
    <span className={styles.hlStr}>{"`supabase db reset`"}</span>
    {" の実行"}
    <span className={styles.hlBad}>{"禁止"}</span>
  </>
);

const TASK_JSON_TEMPLATE = (
  <>
    {"{\n"}
    {"  "}
    <span className={styles.hlKey}>&quot;id&quot;</span>
    {": "}
    <span className={styles.hlStr}>&quot;1&quot;</span>
    {",\n  "}
    <span className={styles.hlKey}>&quot;subject&quot;</span>
    {": "}
    <span className={styles.hlStr}>&quot;JWT 処理を src/auth/jwt.ts に分離&quot;</span>
    {",\n  "}
    <span className={styles.hlKey}>&quot;description&quot;</span>
    {": "}
    <span className={styles.hlStr}>
      {`"
    ## タスク概要
    monolithic な src/auth.ts から JWT 署名・検証ロジックを分離し、
    src/auth/jwt.ts に独立モジュールとして実装する。

    ## 担当ファイル（書き込み可能）
    - src/auth/jwt.ts（新規作成）
    - src/auth/index.ts（export 更新のみ）

    ## 実装仕様
    - JWT_SECRET は process.env から読み取る（ハードコード禁止）
    - 関数: signToken(payload) / verifyToken(token)
    - エラーは Result<T, JwtError> 型で返す（throw 禁止）

    ## 完了条件
    - pnpm test auth が PASS
    - 型エラーなし (tsc --noEmit)
    - src/auth.ts の既存テストが引き続き PASS

    ## 依存関係
    - このタスクが完了後に T2（session-teammate）がアンブロック
    - 完了時に session-teammate に SendMessage で型定義変更を通知
  "`}
    </span>
    {",\n  "}
    <span className={styles.hlKey}>&quot;status&quot;</span>
    {": "}
    <span className={styles.hlStr}>&quot;pending&quot;</span>
    {",\n  "}
    <span className={styles.hlKey}>&quot;owner&quot;</span>
    {": "}
    <span className={styles.hlVal}>null</span>
    {",\n  "}
    <span className={styles.hlKey}>&quot;dependencies&quot;</span>
    {": [],\n  "}
    <span className={styles.hlKey}>&quot;blockedBy&quot;</span>
    {": []\n}"}
  </>
);

// ── SOURCES ────────────────────────────────────────────────────────

const SOURCES: Source[] = [
  {
    num: "01",
    href: "https://docs.anthropic.com/en/docs/claude-code/sub-agents",
    title: "🔵 Anthropic 公式: Sub-agents ドキュメント",
    desc: "YAML frontmatter・ツール設定・memory scope の公式仕様",
  },
  {
    num: "02",
    href: "https://www.humanlayer.dev/blog/writing-a-good-claude-md",
    title: "🟠 HumanLayer: Writing a good CLAUDE.md",
    desc: "コンテキスト汚染・150〜200命令上限・linterへの委譲理論",
  },
  {
    num: "03",
    href: "https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/",
    title: "🟣 PubNub: Best practices for Claude Code subagents",
    desc: "pm-spec→architect→implementerパイプライン・ADR生成パターン",
  },
  {
    num: "04",
    href: "https://claudefa.st/blog/guide/agents/sub-agent-best-practices",
    title: "🟢 ClaudeFast: Sub-Agent Routing Best Practices",
    desc: "並列/直列ルーティング決定ロジック・CLAUDE.mdへの記述例",
  },
  {
    num: "05",
    href: "https://claudelog.com/mechanics/sub-agents/",
    title: "🔴 ClaudeLog: Sub-agents 解説",
    desc: "Built-in エージェント(Explore/Plan)・v2.0.28の新機能",
  },
  {
    num: "06",
    href: "https://alexop.dev/posts/claude-code-customization-guide-claudemd-skills-subagents/",
    title: "⚪ alexop.dev: Claude Code カスタマイズ全体像",
    desc: "CLAUDE.md・スラッシュコマンド・スキル・サブエージェントの比較",
  },
  {
    num: "07",
    href: "https://github.com/VoltAgent/awesome-claude-code-subagents",
    title: "🟡 GitHub: awesome-claude-code-subagents",
    desc: "100件以上のサブエージェント定義テンプレート集",
  },
  {
    num: "08",
    href: "https://rosmur.github.io/claudecode-best-practices/",
    title: "🔵 rosmur: Claude Code Best Practices (総合)",
    desc: "コミュニティ知見の集大成。優先度付きプラクティス一覧",
  },
  {
    num: "09",
    href: "https://docs.anthropic.com/en/docs/claude-code/agent-teams",
    title: "🟢 Anthropic 公式: Agent Teams ドキュメント",
    desc: "Agent Teams 公式仕様：リード/テイムメイト・共有タスクリスト・TeammateIdle/TaskCompleted フック・CLAUDE.md の自動ロード・クリーンアップ手順",
  },
  {
    num: "10",
    href: "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md",
    title: "🟢 Anthropic 公式 CHANGELOG: Agent Teams リリースノート",
    desc: "v2.1.33 TeammateIdle/TaskCompleted フックイベント・v2.1.32 Agent Teams 実装・Task(agent_type) 構文・memory frontmatter の公式リリースノート",
  },
  {
    num: "11",
    href: "https://addyosmani.com/blog/claude-code-agent-teams/",
    title: "🟢 Addy Osmani: Claude Code Swarms（Agent Teams 詳解）",
    desc: "なぜコンテキスト分散が有効か・タスクサイジングとファイルオーナーシップの重要性・Engineering Manager スキルとの類比・コスト試算（3〜4倍）",
  },
  {
    num: "12",
    href: "https://alexop.dev/posts/from-tasks-to-swarms-agent-teams-in-claude-code/",
    title: "🟢 alexop.dev: From Tasks to Swarms（Agent Teams 実装解説）",
    desc: "7つの Agent Teams ツール（TeamCreate/TaskCreate/TaskUpdate 等）の実コール・Plan→Team 2ステップパターン・QA スウォーム実践例（3分完了）",
  },
  {
    num: "13",
    href: "https://claudefa.st/blog/guide/agents/agent-teams-controls",
    title: "🟢 claudefa.st: Agent Teams Controls（Delegate Mode・Hooks 詳解）",
    desc: "Delegate Mode の効果・TaskCompleted フックでテスト強制・CLAUDE.md の品質とトークン効率・テイムメイト数ガイドライン（5〜6タスク/テイムメイト）",
  },
  {
    num: "14",
    href: "https://claudefa.st/blog/guide/agents/agent-teams",
    title: "🟢 claudefa.st: Agent Teams 完全ガイド 2026",
    desc: "サブエージェント vs Agent Teams の決定的違い・Opus 4.6 同時リリース経緯・ネイティブ統合の優位性・コミュニティ実装（OpenClaw/oh-my-claudecode）との比較",
  },
  {
    num: "15",
    href: "https://www.sitepoint.com/anthropic-claude-code-agent-teams/",
    title: "🟢 SitePoint: Claude Code Agent Teams — Architecture 解説",
    desc: "リード/テイムメイトモデルの技術アーキテクチャ・依存関係オーダリング・開発者ロールが「コード執筆」から「エージェント指揮」へシフトする予測",
  },
  {
    num: "16",
    href: "https://jeongil.dev/en/blog/trends/claude-code-agent-teams/",
    title: "🟢 jeongil.dev: Claude Code コミュニティ進化史（oh-my-claudecode → Agent Teams）",
    desc: "TeammateTool の発見経緯・oh-my-claudecode（32エージェント・7実行モード）との比較・モデル混在設計（Opus for Lead / Sonnet for Teammates）",
  },
  {
    num: "17",
    href: "https://medium.com/@haberlah/configure-claude-code-to-power-your-agent-team-90c8d3bca392",
    title: "🟢 Medium (Haberlah): Configure Claude Code to Power Your Agent Team",
    desc: "14フックイベント全一覧・settings.local.json でのMCPサーバー設定・PreToolUse による機密ファイル保護・200K トークンウィンドウ管理の設計論",
  },
  {
    num: "18",
    href: "https://github.com/yuvalsuede/claude-teams-language-protocol",
    title: "🟢 GitHub: AgentSpeak — Agent Teams トークン効率化プロトコル",
    desc: "テイムメイト間メッセージを60〜70%削減する圧縮プロトコル・T# タスク参照・ファイルロック短縮表記・TaskCompleted/TeammateIdle フックとの統合",
  },
  {
    num: "19",
    href: "https://code.claude.com/docs/en/changelog",
    title: "🔵 Anthropic CHANGELOG: v2.1.76〜v2.1.142 (2026年3〜5月)",
    desc: "公式 changelog: /effort・PostCompact hook・MCP elicitation・1M context・HTTP hooks・ultrathink・/goal・/ultrareview・xhigh effort・agent view・continueOnBlock・Plugin skills など3〜5月アップデート全体",
  },
  {
    num: "20",
    href: "https://techcrunch.com/2026/03/03/claude-code-rolls-out-a-voice-mode-capability/",
    title: "🔵 TechCrunch: Claude Code Voice Mode 解説",
    desc: "2026年3月3日リリースの Voice mode 詳報。push-to-talk 方式・段階的ロールアウト（初日5%）・Claude Code の run-rate 収益 $2.5B 突破などビジネス動向",
  },
  {
    num: "21",
    href: "https://pasqualepillitteri.it/en/news/381/claude-code-march-2026-updates",
    title: "🔵 pasqualepillitteri.it: Claude Code March 2026 Complete Guide",
    desc: "v2.1.63〜v2.1.76 全アップデート総まとめ。/voice・/loop・/effort・ultrathink・1M context・HTTP hooks・PostCompact hook・/color・/branch などの詳細解説",
  },
  {
    num: "22",
    href: "https://claudefa.st/blog/guide/changelog",
    title: "🔵 claudefa.st: Claude Code Changelog (Community)",
    desc: "コミュニティによる詳細な version history。Sonnet 4.6 1M context・auto-memory・Agent Teams Bedrock/Vertex 修正・スパース worktree など技術詳細",
  },
  // additional source to reach 23
  {
    num: "23",
    href: "https://docs.anthropic.com/en/docs/claude-code/agent-teams#settings-and-hooks",
    title: "🟢 Anthropic 公式: Agent Teams — Settings & Hooks リファレンス",
    desc: "settings.json の CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS 設定・TeammateIdle/TaskCompleted フックの exit code 仕様・クリーンアップ手順の詳細",
  },
  {
    num: "24",
    href: "https://claudelog.com/claude-code-changelog/",
    title: "🔵 ClaudeLog: Claude Code Changelog (v2.1.76〜v2.1.142)",
    desc: "v2.1.108 /recap・v2.1.111 /ultrareview / xhigh effort・v2.1.128 1M context 完全対応・v2.1.139 /goal / agent view / continueOnBlock・v2.1.141 /loop Esc キャンセル・v2.1.142 Plugin skills など2026年4〜5月の全アップデート",
  },
];

// ── SECTIONS data ───────────────────────────────────────────────────

const SECTION_IDS = [
  "s01",
  "s02",
  "s03",
  "s04",
  "s05",
  "s06",
  "s07",
  "s08",
  "s09",
  "s10",
  "s11",
  "s12",
  "s13",
  "s14",
  "s15",
  "s16",
  "s17",
] as const;

type TupleStr<T extends readonly unknown[]> = { [K in keyof T]: string };

const SECTION_TITLES: TupleStr<typeof SECTION_IDS> = [
  "全体アーキテクチャと各 Markdown の位置づけ",
  "CLAUDE.md — メインエージェントのグローバル設定",
  "サブエージェント定義 .claude/agents/*.md",
  "MEMORY.md — エージェントの学習・記憶ファイル",
  "サブエージェント ルーティング設計の意思決定ツリー",
  "コスト最適なモデル選択戦略",
  "絶対に避けるべき Anti-Patterns",
  "2026年3〜5月 新機能・コマンド (v2.1.63〜v2.1.142)",
  ".claude/README.md — エージェント構成ドキュメント",
  "まとめ：各 Markdown の役割と設計原則",
  "Agent Teams とは — サブエージェントとの根本的な違い",
  "Agent Teams の有効化と settings.json 設定",
  "Agent Teams 向け CLAUDE.md 設計 — 最重要ポイント",
  "タスクリストファイル設計 — ~/.claude/tasks/{team}/*.json",
  "Agent Teams Hooks 設計 — 品質ゲートの自動化",
  "Agent Teams のユースケース別プロンプトパターン",
  "まとめ：全 Markdown + 設定ファイルの役割（Agent Teams 追記版）",
] as const;

/**
 * Renders the Claude Code guide page covering sub-agents and Agent Teams best practices (v2.1.142, May 2026).
 *
 * The page is a static Next.js React component that displays a full, versioned guide including:
 * - TOC and 17 content sections (CLAUDE.md, sub-agent definitions, MEMORY.md, routing, models, new commands, Agent Teams, hooks, task JSON patterns, and sources)
 * - Embedded template blocks and example snippets (CLAUDE.md, .claude/agents templates, MEMORY.md, .claude/README.md, task JSON)
 * - Reference source list and actionable tips/anti-patterns for designing agent-related Markdown files
 *
 * @returns The page's JSX element for rendering the guide.
 */
export default function ClaudeAgentPage() {
  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        {/* HERO */}
        <div className={styles.hero}>
          <div className={styles.heroBadge}>
            🤖 Claude Code 完全ガイド — 2026年5月 v2.1.142 最新対応版
          </div>
          <h1 className={styles.heroTitle}>
            サブエージェント + Agent Teams 開発における
            <br />
            Markdownファイル ベストプラクティス
          </h1>
          <p className={styles.heroDesc}>
            CLAUDE.md・エージェント定義 .md・MEMORY.md・README.md ──
            それぞれの役割と書き方を体系的に解説します。
            <strong>v2.1.142 最新アップデート（2026年5月）</strong>
            （Voice mode・/loop・/effort・/goal・/ultrareview・xhigh effort・ultrathink・1M
            コンテキスト・HTTP hooks・MCP elicitation・Agent Teams
            安定化）に完全対応した最新版です。
          </p>
        </div>

        {/* TOC */}
        <nav className={styles.toc}>
          <div className={styles.tocTitle}>目次</div>
          <ol>
            {SECTION_IDS.map((id, i) => (
              <li key={id}>
                <a href={`#${id}`}>
                  {i + 1}. {SECTION_TITLES[i]}
                </a>
              </li>
            ))}
            <li>
              <a href="#sources">📚 参考ソース</a>
            </li>
          </ol>
        </nav>

        {/* s01: 全体アーキテクチャ */}
        <section id="s01" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.num}>1</span>
            全体アーキテクチャと各 Markdown の位置づけ
          </div>
          <div className={styles.card}>
            <p>
              Claude Code におけるサブエージェント開発では、以下の 4
              種類のMarkdownファイルが重要な役割を担います。
            </p>
          </div>
          <div className={styles.archDiagram}>
            <div
              style={{
                textAlign: "center",
                marginBottom: 20,
                color: "#8b949e",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: ".1em",
              }}
            >
              FILE HIERARCHY &amp; DATA FLOW
            </div>
            <div className={styles.archRow}>
              <div className={`${styles.archBox} ${styles.boxFile}`}>
                CLAUDE.md
                <br />
                <small style={{ color: "#8b949e", fontWeight: 400 }}>プロジェクトルート</small>
              </div>
              <div className={styles.archArrow}>→</div>
              <div className={`${styles.archBox} ${styles.boxMain}`}>
                Main Agent
                <br />
                (Claude Code)
              </div>
              <div className={styles.archArrow}>→</div>
              <div className={`${styles.archBox} ${styles.boxFile}`}>
                .claude/agents/
                <br />
                <small style={{ color: "#8b949e", fontWeight: 400 }}>*.md</small>
              </div>
            </div>
            <div style={{ textAlign: "center", color: "#30363d", fontSize: 22, margin: "4px 0" }}>
              ↓
            </div>
            <div className={styles.archRow}>
              <div className={`${styles.archBox} ${styles.boxAgent}`}>
                pm-spec
                <br />
                <small>Agent</small>
              </div>
              <div className={styles.archArrow}>→</div>
              <div className={`${styles.archBox} ${styles.boxAgent}`}>
                architect
                <br />
                <small>Agent</small>
              </div>
              <div className={styles.archArrow}>→</div>
              <div className={`${styles.archBox} ${styles.boxAgent}`}>
                implementer
                <br />
                <small>Agent</small>
              </div>
              <div className={styles.archArrow}>→</div>
              <div className={`${styles.archBox} ${styles.boxAgent}`}>
                reviewer
                <br />
                <small>Agent</small>
              </div>
            </div>
            <div style={{ textAlign: "center", color: "#30363d", fontSize: 22, margin: "4px 0" }}>
              ↓ ↓ ↓ ↓
            </div>
            <div className={styles.archRow}>
              <div className={`${styles.archBox} ${styles.boxFile}`}>MEMORY.md</div>
              <div className={`${styles.archBox} ${styles.boxFile}`}>MEMORY.md</div>
              <div className={`${styles.archBox} ${styles.boxFile}`}>MEMORY.md</div>
              <div className={`${styles.archBox} ${styles.boxFile}`}>MEMORY.md</div>
            </div>
            <div className={styles.archLabel}>
              各サブエージェントが独立したコンテキストウィンドウと MEMORY.md を持つ
            </div>
          </div>
        </section>

        {/* s02: CLAUDE.md */}
        <section id="s02" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.num}>2</span>
            <code className={styles.mono}>CLAUDE.md</code> — メインエージェントのグローバル設定
          </div>
          <div className={`${styles.tip} ${styles.tipWarn}`}>
            <span className={styles.tipIcon}>⚠️</span>
            <div className={styles.tipContent}>
              <strong>コンテキスト汚染の罠</strong>
              CLAUDE.md
              はすべてのセッションで毎回ロードされます。不要な情報（コードスタイル、過去の修正履歴など）を詰め込みすぎると、LLMが従える指示数（フロンティアモデルで約150〜200件）を超え、
              <b>パフォーマンスが急激に低下</b>します。
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>📋 CLAUDE.md に書くべきこと / 書かないべきこと</div>
            <div className={styles.patternGrid}>
              <div className={`${styles.pat} ${styles.patGood}`}>
                <div className={styles.patTitle}>✅ 書くべき内容</div>
                <ul>
                  <li>プロジェクト概要（1〜3文）</li>
                  <li>技術スタック・主要ライブラリ</li>
                  <li>サブエージェントのルーティングルール</li>
                  <li>禁止コマンド・危険な操作の明示</li>
                  <li>ビルド・テスト・デプロイコマンド</li>
                  <li>エラー時の問い合わせ先・Docs URL</li>
                  <li>モノレポ構造の説明</li>
                </ul>
              </div>
              <div className={`${styles.pat} ${styles.patBad}`}>
                <div className={styles.patTitle}>✗ 書かないべき内容</div>
                <ul>
                  <li>コードスタイル・フォーマットルール (linter に委ねる)</li>
                  <li>特定タスクにしか使わない詳細手順</li>
                  <li>長大なコードスニペット</li>
                  <li>@ファイル参照（毎回全体が埋め込まれる）</li>
                  <li>「〜しないで」の禁止形のみの指示</li>
                  <li>修正履歴・変更ログ</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              📄 実践的な CLAUDE.md テンプレート（サブエージェント活用版）
            </div>
            <TemplateBlock title="CLAUDE.md" lang="Markdown" body={CLAUDE_MD_TEMPLATE} />
          </div>
          <div className={`${styles.tip} ${styles.tipInfo}`}>
            <span className={styles.tipIcon}>💡</span>
            <div className={styles.tipContent}>
              <strong>サブディレクトリ CLAUDE.md の活用</strong>
              <code>frontend/CLAUDE.md</code> や <code>backend/CLAUDE.md</code>{" "}
              に分割すると、そのディレクトリで作業する際だけ追加コンテキストが読み込まれます。グローバル
              CLAUDE.md は薄く、局所設定は局所ファイルへ。
            </div>
          </div>
          <div className={`${styles.tip} ${styles.tipWarn}`}>
            <span className={styles.tipIcon}>⚠️</span>
            <div className={styles.tipContent}>
              <strong>v2.1.75+ 変更: HTML コメントは Claude に見えない</strong>
              <code>CLAUDE.md</code> 内の <code>{"<!-- ... -->"}</code> HTML
              コメントは、自動インジェクト時に Claude
              のコンテキストから除外されるようになりました（v2.1.75+）。<code>Read</code>{" "}
              ツールで明示的に読んだ場合は表示されます。コメントとして残したいメモは引き続き使えますが、Claude
              に読んでほしい指示は通常のMarkdown形式で書くことを強く推奨します。
            </div>
          </div>
        </section>

        {/* s03: サブエージェント定義 */}
        <section id="s03" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.num}>3</span>
            サブエージェント定義 <code className={styles.mono}>.claude/agents/*.md</code>
          </div>
          <div className={styles.card}>
            <p>
              サブエージェントは <b>YAML フロントマター + システムプロンプト本文</b>{" "}
              で構成されます。メインエージェントの system prompt は<b>継承されません</b>
              。フロントマターで定義できるフィールドは以下の通りです。
            </p>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>フィールド</th>
                  <th>必須</th>
                  <th>値の例</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>name</code>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeOrange}`}>必須</span>
                  </td>
                  <td>
                    <code>code-reviewer</code>
                  </td>
                  <td>エージェント識別子（ハイフン区切り推奨）</td>
                </tr>
                <tr>
                  <td>
                    <code>description</code>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeOrange}`}>必須</span>
                  </td>
                  <td>&quot;PRのコードレビューを実施する&quot;</td>
                  <td>Claude がどのタスクでこのエージェントを呼ぶかの判断基準</td>
                </tr>
                <tr>
                  <td>
                    <code>tools</code>
                  </td>
                  <td>任意</td>
                  <td>
                    <code>Read, Glob, Grep</code>
                  </td>
                  <td>許可ツール allowlist。省略すると全ツールが有効になる</td>
                </tr>
                <tr>
                  <td>
                    <code>disallowedTools</code>
                  </td>
                  <td>任意</td>
                  <td>
                    <code>Bash, Write</code>
                  </td>
                  <td>禁止ツール denylist</td>
                </tr>
                <tr>
                  <td>
                    <code>model</code>
                  </td>
                  <td>任意</td>
                  <td>
                    <code>sonnet</code> / <code>haiku</code> / <code>opus</code> /{" "}
                    <code>inherit</code>
                  </td>
                  <td>
                    使用モデル。<code>inherit</code> は親セッションと同じモデルを使用
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>permissionMode</code>
                  </td>
                  <td>任意</td>
                  <td>
                    <code>default</code> / <code>acceptEdits</code>
                  </td>
                  <td>ツール権限の確認モード</td>
                </tr>
                <tr>
                  <td>
                    <code>mcpServers</code>
                  </td>
                  <td>任意</td>
                  <td>
                    <code>[{'{name: "github"}'}]</code>
                  </td>
                  <td>このサブエージェント専用の MCP サーバーを指定</td>
                </tr>
                <tr>
                  <td>
                    <code>maxTurns</code>
                  </td>
                  <td>任意</td>
                  <td>
                    <code>10</code>
                  </td>
                  <td>サブエージェントの最大ターン数。無限ループ防止</td>
                </tr>
                <tr>
                  <td>
                    <code>memory</code>
                  </td>
                  <td>任意</td>
                  <td>
                    <code>user</code> / <code>project</code> / <code>local</code>
                  </td>
                  <td>MEMORY.md のスコープ</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>📄 実践的なサブエージェント定義テンプレート</div>
            <TemplateBlock
              title=".claude/agents/code-reviewer.md"
              lang="Markdown + YAML"
              body={CODE_REVIEWER_TEMPLATE}
            />
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              📄 並列パイプライン例: PM Spec → Architect → Implementer
            </div>
            <TemplateBlock
              title=".claude/agents/pm-spec.md"
              lang="YAML frontmatter"
              body={
                <>
                  <span className={styles.hlStr}>{"---"}</span>
                  {"\n"}
                  <span className={styles.hlKey}>name</span>
                  {": "}
                  <span className={styles.hlVal}>pm-spec</span>
                  {"\n"}
                  <span className={styles.hlKey}>description</span>
                  {": "}
                  <span className={styles.hlVal}>
                    &quot;新機能の要求仕様書を作成する。機能要件・非機能要件・受け入れ条件を定義し
                    {"\n"} ステータスを READY_FOR_ARCH に設定する。&quot;
                  </span>
                  {"\n"}
                  <span className={styles.hlKey}>tools</span>
                  {": "}
                  <span className={styles.hlVal}>Read, Write, Edit</span>
                  {"\n"}
                  <span className={styles.hlKey}>model</span>
                  {": "}
                  <span className={styles.hlVal}>sonnet</span>
                  {"\n"}
                  <span className={styles.hlStr}>{"---"}</span>
                  {"\n"}
                  <span className={styles.hlCmt}># PM Spec Agent のシステムプロンプト ...</span>
                </>
              }
            />
            <TemplateBlock
              title=".claude/agents/architect-review.md"
              lang="YAML frontmatter"
              body={
                <>
                  <span className={styles.hlStr}>{"---"}</span>
                  {"\n"}
                  <span className={styles.hlKey}>name</span>
                  {": "}
                  <span className={styles.hlVal}>architect-review</span>
                  {"\n"}
                  <span className={styles.hlKey}>description</span>
                  {": "}
                  <span className={styles.hlVal}>
                    &quot;pm-spec が READY_FOR_ARCH になった後に呼び出す。{"\n"}{" "}
                    プラットフォーム制約・コスト・パフォーマンスを考慮した設計を行い ADR
                    を作成する。&quot;
                  </span>
                  {"\n"}
                  <span className={styles.hlKey}>tools</span>
                  {": "}
                  <span className={styles.hlVal}>Read, Write, Edit, Bash</span>
                  {"\n"}
                  <span className={styles.hlKey}>model</span>
                  {": "}
                  <span className={styles.hlVal}>opus</span>
                  {"   "}
                  <span className={styles.hlCmt}># 複雑な設計判断はOpusを使用</span>
                  {"\n"}
                  <span className={styles.hlStr}>{"---"}</span>
                </>
              }
            />
          </div>
          <div className={`${styles.tip} ${styles.tipDanger}`}>
            <span className={styles.tipIcon}>🚨</span>
            <div className={styles.tipContent}>
              <strong>サブエージェントのツール権限は最小化せよ</strong>
              サブエージェントはメインエージェントのsystem promptを継承しません。<code>tools</code>
              フィールドで明示的に権限を絞らないと、デフォルトで全ツールが有効になります。Read-onlyでよいエージェントには必ず{" "}
              <code>tools: Read, Glob, Grep</code> のみを指定してください。
            </div>
          </div>
        </section>

        {/* s04: MEMORY.md */}
        <section id="s04" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.num}>4</span>
            <code className={styles.mono}>MEMORY.md</code> — エージェントの学習・記憶ファイル
          </div>
          <div className={styles.card}>
            <p>
              MEMORY.md はサブエージェントが「経験から学んだパターン」を蓄積するファイルです。
              <b>200行を上限</b>
              とし、それを超えたら要約・整理を行う設計が公式推奨です。LLMはステートレスなため、これが唯一の「記憶」となります。
            </p>
          </div>
          <TemplateBlock
            title=".claude/memory/code-reviewer/MEMORY.md"
            lang="Markdown"
            body={MEMORY_MD_TEMPLATE}
          />
          <div className={`${styles.tip} ${styles.tipSuccess}`}>
            <span className={styles.tipIcon}>✅</span>
            <div className={styles.tipContent}>
              <strong>
                MEMORY.md の管理ルール（エージェントのシステムプロンプトに必ず記述する）
              </strong>
              「タスク開始前に MEMORY.md
              を参照せよ」「新パターン発見時に追記せよ」「200行超過時は要約せよ」の3つをサブエージェントの
              system prompt 内に必ず明示してください。
            </div>
          </div>
        </section>

        {/* s05: ルーティング設計 */}
        <section id="s05" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.num}>5</span>
            サブエージェント ルーティング設計の意思決定ツリー
          </div>
          <div className={styles.decisionTree}>
            <div
              style={{
                textAlign: "center",
                color: "#8b949e",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: ".1em",
                marginBottom: 20,
              }}
            >
              ROUTING DECISION TREE (CLAUDE.md に記述する)
            </div>
            <div className={styles.dtRow}>
              <div className={`${styles.dtNode} ${styles.dtQ}`}>タスクが 3件以上ある？</div>
              <div className={styles.dtLine}>→ NO →</div>
              <div className={`${styles.dtNode} ${styles.dtNo}`}>メインエージェントで処理</div>
            </div>
            <div style={{ color: "#30363d", fontSize: 20, paddingLeft: 20 }}>↓ YES</div>
            <div className={styles.dtRow}>
              <div className={`${styles.dtNode} ${styles.dtQ}`}>
                タスク間に依存関係がある？
                <br />
                <small style={{ fontWeight: 400 }}>(Bの処理にAの出力が必要)</small>
              </div>
              <div className={styles.dtLine}>→ YES →</div>
              <div className={`${styles.dtNode} ${styles.dtNo}`}>
                Sequential dispatch
                <br />
                <small>直列: A→B→C</small>
              </div>
            </div>
            <div style={{ color: "#30363d", fontSize: 20, paddingLeft: 20 }}>↓ NO</div>
            <div className={styles.dtRow}>
              <div className={`${styles.dtNode} ${styles.dtQ}`}>共有ファイル・状態がある？</div>
              <div className={styles.dtLine}>→ YES →</div>
              <div className={`${styles.dtNode} ${styles.dtNo}`}>
                Sequential dispatch
                <br />
                <small>マージ競合リスクあり</small>
              </div>
            </div>
            <div style={{ color: "#30363d", fontSize: 20, paddingLeft: 20 }}>↓ NO</div>
            <div className={styles.dtRow}>
              <div className={`${styles.dtNode} ${styles.dtQ}`}>
                ドメイン境界が明確？
                <br />
                <small style={{ fontWeight: 400 }}>(frontend / backend / db)</small>
              </div>
              <div className={styles.dtLine}>→ NO →</div>
              <div className={`${styles.dtNode} ${styles.dtNo}`}>スコープ明確化を先に行う</div>
            </div>
            <div style={{ color: "#30363d", fontSize: 20, paddingLeft: 20 }}>↓ YES</div>
            <div className={styles.dtRow}>
              <div className={`${styles.dtNode} ${styles.dtYes}`}>
                ✅ Parallel dispatch
                <br />
                <small>並列: A &#x7C;&#x7C; B &#x7C;&#x7C; C</small>
              </div>
              <div style={{ marginLeft: 20, color: "#8b949e", fontSize: 12 }}>
                例: frontend/backend/db エージェントを同時起動
              </div>
            </div>
          </div>
        </section>

        {/* s06: モデル選択 */}
        <section id="s06" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.num}>6</span>
            コスト最適なモデル選択戦略
          </div>
          <div className={`${styles.tip} ${styles.tipDanger}`}>
            <span className={styles.tipIcon}>🚨</span>
            <div className={styles.tipContent}>
              <strong>Opus 4 / Opus 4.1 廃止済み（2026年3月）</strong>
              Claude Code v2.1.68 以降、<code>claude-opus-4</code> と <code>claude-opus-4.1</code>{" "}
              はファーストパーティ API から削除されました。<code>model: opus</code> または{" "}
              <code>model: inherit</code> の設定があった場合は自動的に <code>Opus 4.6</code>{" "}
              へ移行されています。
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>model</th>
                  <th>用途</th>
                  <th>サブエージェント例</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>haiku</code>
                  </td>
                  <td>高速・低コスト</td>
                  <td>コードベース探索、ファイル検索</td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>最速</span>{" "}
                    探索タスク向け
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>sonnet</code> (4.6)
                  </td>
                  <td>バランス重視</td>
                  <td>コードレビュー、テスト生成、実装</td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeBlue}`}>推奨デフォルト</span> 1M
                    トークンコンテキスト (beta)
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>opus</code> (4.6)
                  </td>
                  <td>複雑な判断</td>
                  <td>アーキテクチャ設計、セキュリティ監査</td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgePurple}`}>高精度</span>{" "}
                    デフォルトは <strong>medium effort</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>⚡ Effort Level 設計（v2.1.68+）</div>
            <p>
              Opus 4.6 の thinking 深度は <strong>/effort コマンド</strong>
              で制御できます。デフォルトは <code>medium</code> です（Max・Team プランのみ）。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Effort Level</th>
                    <th>コマンド</th>
                    <th>用途</th>
                    <th>コスト</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>low</code>
                    </td>
                    <td>
                      <code>/effort low</code>
                    </td>
                    <td>単純な質問・リネーム・フォーマット</td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeGreen}`}>最安</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>medium</code>
                    </td>
                    <td>
                      <code>/effort medium</code> / デフォルト
                    </td>
                    <td>コードレビュー・テスト生成・通常実装</td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeBlue}`}>推奨</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>high</code>
                    </td>
                    <td>
                      <code>/effort high</code> または <code>ultrathink</code>
                    </td>
                    <td>アーキテクチャ設計・複雑なデバッグ</td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgePurple}`}>高コスト</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={`${styles.tip} ${styles.tipInfo}`} style={{ marginTop: 12 }}>
              <span className={styles.tipIcon}>💡</span>
              <div className={styles.tipContent}>
                <strong>ultrathink キーワード（v2.1.68 で再導入）</strong>
                プロンプトに <code>ultrathink</code> を含めると、<strong>次のターンのみ</strong>{" "}
                high effort（最大 31,999 トークン thinking budget）が有効になります。例:{" "}
                <code>&quot;この認証フローを設計して ultrathink&quot;</code>
              </div>
            </div>
          </div>
          <div className={`${styles.tip} ${styles.tipInfo}`}>
            <span className={styles.tipIcon}>💡</span>
            <div className={styles.tipContent}>
              <strong>Built-in サブエージェント (v2.0.17+)</strong>
              Claude Code v2.0.17 以降、Explore
              サブエージェント（Haiku搭載）がコードベース探索を自動担当します。v2.0.28 では Plan
              サブエージェントが追加され、計画フェーズが独立した専用エージェントで処理されるようになりました。
            </div>
          </div>
        </section>

        {/* s07: Anti-Patterns */}
        <section id="s07" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.num}>7</span>
            絶対に避けるべき Anti-Patterns
          </div>
          <div className={styles.patternGrid}>
            <div className={`${styles.pat} ${styles.patBad}`}>
              <div className={styles.patTitle}>✗ CLAUDE.md の Anti-Patterns</div>
              <ul>
                <li>コードスタイル規約を書く（linterに委ねよ）</li>
                <li>@ファイルで長大なドキュメントを埋め込む</li>
                <li>20件を超えるスラッシュコマンドを定義</li>
                <li>「〜しないこと」だけの禁止形指示（代替手段を示す）</li>
                <li>MCP サーバーのトークンを 20k 超で使用</li>
                <li>修正履歴・変更ログの記録</li>
              </ul>
            </div>
            <div className={`${styles.pat} ${styles.patBad}`}>
              <div className={styles.patTitle}>✗ サブエージェント定義の Anti-Patterns</div>
              <ul>
                <li>description が曖昧で呼び出し条件が不明確</li>
                <li>tools フィールドを省略（全権限を継承してしまう）</li>
                <li>10件以上の並列エージェントを同時起動</li>
                <li>共有ファイルを触るエージェントを並列実行</li>
                <li>MEMORY.md の上限管理をしない（肥大化）</li>
                <li>全エージェントに opus を使う（コスト爆発）</li>
              </ul>
            </div>
          </div>
        </section>

        {/* s08: 2026年3月 新機能 */}
        <section id="s08" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.num}>8</span>
            2026年3〜5月 新機能・コマンド (v2.1.63〜v2.1.142)
          </div>
          <div
            className={styles.atBanner}
            style={{
              background: "linear-gradient(135deg, #0a1929 0%, #0d1117 50%, #0a1929 100%)",
              borderColor: "rgba(96,165,250,0.4)",
            }}
          >
            <div
              className={styles.atBadge}
              style={{
                background: "rgba(96,165,250,0.15)",
                borderColor: "rgba(96,165,250,0.4)",
                color: "#60a5fa",
              }}
            >
              🚀 v2.1.142 · 2026年5月 最新アップデート
            </div>
            <h3 style={{ color: "#fff" }}>
              Voice mode・/loop・/effort・/goal・/ultrareview・1M コンテキスト・HTTP hooks
              など多数リリース
            </h3>
            <p>
              2026年3〜5月は Claude Code
              にとって大規模な連続アップデート期間でした。音声入力・定期タスク・努力レベル制御・100万トークンコンテキスト・新しい
              hooks
              システム・完了条件付き自律タスク（/goal）・クラウドコードレビュー（/ultrareview）が統合されました。
            </p>
          </div>
          <div className={styles.usecaseGrid}>
            {[
              {
                icon: "🎙️",
                title: "Voice Mode（音声入力） — v2.1.63",
                desc: "push-to-talk 方式の音声入力。/voice で有効化、スペースキーを押しながら話して離すと送信。",
                prompt: "/voice        ← トグルで有効化\nスペースキー押下 → 話す → 離す",
              },
              {
                icon: "🔁",
                title: "/loop — 定期繰り返しタスク — v2.1.105",
                desc: "cron ジョブのように定期実行するタスクをスケジュール。定期ビルドチェック・テスト実行・モニタリングの自動化に。/proactive エイリアスも追加 (v2.1.105)。Esc で pending wakeup をキャンセル可能 (v2.1.141)。",
                prompt:
                  '/loop 30m "pnpm test を実行して結果をレポートして"\n/proactive 1h "依存関係の脆弱性チェック"',
              },
              {
                icon: "⚡",
                title: "/effort — Effort Level 制御 — v2.1.111",
                desc: "Opus 4.7 の思考深度をリアルタイムで変更。デフォルトは medium。v2.1.111 で xhigh tier と対話式スライダーが追加。$CLAUDE_EFFORT 環境変数でフック/Bash からも参照可能。",
                prompt:
                  "/effort low     ← 高速・低コスト\n/effort medium  ← デフォルト\n/effort high    ← 深い分析\n/effort xhigh   ← 最深（v2.1.111+）\n/effort auto    ← リセット",
              },
              {
                icon: "🧠",
                title: "1M トークン コンテキスト — v2.1.128",
                desc: "v2.1.128 で Opus モデルへの完全 1M コンテキスト対応が完了。autocompact の動作も改善し、1M コンテキストモデルでの「Prompt is too long」誤ブロックが修正されました。",
                prompt:
                  "最大出力: Opus 4.7 → 64k tokens (デフォルト)\n上限: Opus / Sonnet → 128k tokens\nコンテキスト上限: 1,000,000 tokens",
              },
              {
                icon: "🌐",
                title: "HTTP Hooks — v2.1.63",
                desc: 'hooks でシェルコマンドの代わりに URL へ JSON を POST できます。CI/CD・Slack 通知・外部 Webhook との連携がローカルスクリプト不要で実現。v2.1.118 で type: "mcp_tool" フックが追加。v2.1.139 の continueOnBlock で拒否理由を Claude にフィードバック可能。',
                prompt:
                  '"type": "http",\n"url": "https://hooks.example.com/claude",\n"method": "POST"\n// type: "mcp_tool" も指定可能 (v2.1.118+)',
              },
              {
                icon: "🗜️",
                title: "PostCompact Hook + MCP Elicitation",
                desc: "PostCompact: 会話圧縮後に発火する新フック。MCP Elicitation: MCP サーバーが構造化入力を要求できる機能。",
                prompt:
                  '"PostCompact": [{ "hooks": [{ "type": "command",\n  "command": "bash -c \'validate_context.sh\'" }]}]',
              },
              {
                icon: "🎯",
                title: "/goal — 完了条件付き自律タスク — v2.1.139",
                desc: "完了条件を自然言語で指定し、Claude が複数ターンをまたいで自律実行。インタラクティブ・-p・Remote Control の各モードで動作。経過時間・ターン数・トークン使用量をオーバーレイ表示。",
                prompt: '/goal "全テストが PASS するまでバグを修正して"',
              },
              {
                icon: "🔍",
                title: "/ultrareview — クラウドコードレビュー — v2.1.111",
                desc: "現在ブランチの差分をクラウドのマルチエージェントでレビュー。PR 番号指定も可能。ローカル Agent とは独立したコンテキストで包括的チェックを実行。",
                prompt:
                  "/ultrareview           ← 現在ブランチ\n/ultrareview 123       ← GitHub PR#123",
              },
            ].map((uc) => (
              <div key={uc.title} className={styles.uc}>
                <div className={styles.ucIcon}>{uc.icon}</div>
                <div className={styles.ucTitle}>{uc.title}</div>
                <div className={styles.ucDesc}>{uc.desc}</div>
                <div className={styles.ucPrompt}>{uc.prompt}</div>
              </div>
            ))}
          </div>
          <div className={styles.card} style={{ marginTop: 16 }}>
            <div className={styles.cardTitle}>🆕 その他の新コマンド・設定（2026年3〜5月）</div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>コマンド / 設定</th>
                    <th>バージョン</th>
                    <th>説明</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      cmd: "/color",
                      ver: "v2.1.75",
                      desc: "現在のセッションのプロンプトバーに色を設定。並列セッション実行時に視覚的に区別できる",
                    },
                    {
                      cmd: "/simplify",
                      ver: "v2.1.63",
                      desc: "選択コードをシンプル化するバンドルコマンド",
                    },
                    { cmd: "/batch", ver: "v2.1.63", desc: "複数ファイルへの一括操作" },
                    { cmd: "/branch", ver: "v2.1.76", desc: "git ブランチ操作の簡易コマンド" },
                    {
                      cmd: "/context",
                      ver: "v2.1.74",
                      desc: "コンテキスト状況の確認 + 最適化の提案（メモリ肥大・重いツールの検出）",
                    },
                    {
                      cmd: 'claude -n "name"',
                      ver: "v2.1.75",
                      desc: "起動時にセッション名を設定（-n / --name フラグ）",
                    },
                    {
                      cmd: "autoMemoryDirectory",
                      ver: "v2.1.74",
                      desc: "自動メモリ保存先ディレクトリをカスタマイズ（settings.json）",
                    },
                    {
                      cmd: "worktree.sparsePaths",
                      ver: "v2.1.75",
                      desc: "大規模モノレポで必要なディレクトリだけ sparse-checkout する設定",
                    },
                    {
                      cmd: "effort frontmatter",
                      ver: "v2.1.76",
                      desc: "スキルおよびスラッシュコマンドに effort レベルを frontmatter で指定可能",
                    },
                    {
                      cmd: "/proactive",
                      ver: "v2.1.105",
                      desc: "/loop のエイリアス。より意図が伝わる名称で同じ定期実行機能を呼び出せる",
                    },
                    {
                      cmd: "/recap",
                      ver: "v2.1.108",
                      desc: "セッションに戻ったとき、経緯を要約して再共有するコマンド。長いセッションの文脈回復に",
                    },
                    {
                      cmd: "/less-permission-prompts",
                      ver: "v2.1.111",
                      desc: "過去トランスクリプトをスキャンし、読み取り専用 Bash/MCP ツールの allowlist を自動提案",
                    },
                    {
                      cmd: "claude agents",
                      ver: "v2.1.139",
                      desc: "Agent view (Research Preview) でバックグラウンドエージェントの一覧・状態管理",
                    },
                  ].map((r) => (
                    <tr key={r.cmd}>
                      <td>
                        <code>{r.cmd}</code>
                      </td>
                      <td>{r.ver}</td>
                      <td>{r.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* s09: .claude/README.md */}
        <section id="s09" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.num}>9</span>
            <code className={styles.mono}>.claude/README.md</code> — エージェント構成ドキュメント
          </div>
          <div className={styles.card}>
            <p>
              チームメンバーが「どのエージェントが何をするか」を把握できる人間向けドキュメントです。エージェントが増えてきたら必ず作成しましょう。
            </p>
            <TemplateBlock title=".claude/README.md" lang="Markdown" body={README_MD_TEMPLATE} />
          </div>
        </section>

        {/* s10: まとめ */}
        <section id="s10" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.num}>10</span>
            まとめ：各 Markdown の役割と設計原則
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ファイル</th>
                  <th>読者</th>
                  <th>設計原則</th>
                  <th>アンチパターン</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>CLAUDE.md</code>
                    <br />
                    <small>(root)</small>
                  </td>
                  <td>
                    メインAgent
                    <br />
                    常時ロード
                  </td>
                  <td>薄く・普遍的に。150〜200指示以内に収める</td>
                  <td>コードスタイル・@ファイル埋め込み・修正履歴</td>
                </tr>
                <tr>
                  <td>
                    <code>CLAUDE.md</code>
                    <br />
                    <small>(subdir)</small>
                  </td>
                  <td>
                    メインAgent
                    <br />
                    そのディレクトリ作業時のみ
                  </td>
                  <td>そのドメイン固有の補足だけ。root と重複させない</td>
                  <td>rootと同じ内容の重複記述</td>
                </tr>
                <tr>
                  <td>
                    <code>.claude/agents/*.md</code>
                  </td>
                  <td>
                    各サブAgent
                    <br />
                    (独立コンテキスト)
                  </td>
                  <td>YAML frontmatter + 明確なロール定義 + チェックリスト</td>
                  <td>tools省略・曖昧なdescription</td>
                </tr>
                <tr>
                  <td>
                    <code>MEMORY.md</code>
                  </td>
                  <td>
                    各サブAgent
                    <br />
                    (自己更新)
                  </td>
                  <td>200行上限・日付付きパターン記録・定期要約</td>
                  <td>上限なし肥大化・管理指示の省略</td>
                </tr>
                <tr>
                  <td>
                    <code>.claude/README.md</code>
                  </td>
                  <td>
                    人間
                    <br />
                    (チームメンバー)
                  </td>
                  <td>エージェント一覧・パイプライン・ステータスフロー</td>
                  <td>エージェント数が多いのに作成しない</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr className={styles.hr} />

        {/* s11: Agent Teams 概要 */}
        <section id="s11" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.numTeam}>11</span>
            Agent Teams とは — サブエージェントとの根本的な違い
          </div>
          <div className={styles.atBanner}>
            <div className={styles.atBadge}>
              🧪 Research Preview · 2026年2月 Opus 4.6 同時リリース → 2026年3月 安定化
            </div>
            <h3>Agent Teams：複数の Claude Code セッションがチームとして協調する</h3>
            <p>
              Agent Teams は、複数の Claude Code インスタンスが
              <strong>独立したコンテキストウィンドウ</strong>を持ちながら、
              <strong>共有タスクリスト・ダイレクトメッセージ</strong>で連携する実験的機能です。
              デフォルト無効（フィーチャーフラグ）。
            </p>
          </div>
          <div className={styles.compareGrid}>
            <div className={`${styles.cmp} ${styles.cmpSub}`}>
              <div className={styles.cmpTitle}>🔹 Sub-Agents（既存）</div>
              <ul>
                <li>単一セッション内で動作</li>
                <li>親エージェントにのみ結果を報告</li>
                <li>テイムメイト間の直接通信なし</li>
                <li>親が仲介しないと情報共有不可</li>
                <li>タスク完了後は存在しない</li>
                <li>コスト: 通常セッションと同等</li>
                <li>
                  <strong>適用:</strong> 独立タスクの並列実行、ファイル検索、コードレビューなど
                </li>
              </ul>
            </div>
            <div className={`${styles.cmp} ${styles.cmpTeam}`}>
              <div className={styles.cmpTitle}>🟢 Agent Teams（新機能）</div>
              <ul>
                <li>各テイムメイトが独立したセッション</li>
                <li>テイムメイト間で直接メッセージ可能</li>
                <li>共有タスクリストからタスクを自律クレーム</li>
                <li>リードなしに相互調整できる</li>
                <li>ユーザーが個別テイムメイトに直接話せる</li>
                <li>コスト: 通常の 3〜4倍（テイムメイト数 × コンテキスト）</li>
                <li>
                  <strong>適用:</strong> 競合仮説デバッグ、クロスレイヤー実装、並列リサーチ
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* s12: Agent Teams 有効化 */}
        <section id="s12" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.numTeam}>12</span>
            Agent Teams の有効化と <code className={styles.mono}>settings.json</code> 設定
          </div>
          <div className={`${styles.tip} ${styles.tipWarn}`}>
            <span className={styles.tipIcon}>⚠️</span>
            <div className={styles.tipContent}>
              <strong>デフォルト無効・Research Preview</strong>
              Agent Teams はデフォルトで無効。有効にするには <code>settings.json</code>{" "}
              または環境変数で <code>CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</code> を設定します。
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              ⚙️ <code className={styles.mono}>~/.claude/settings.json</code> — Agent Teams 設定
            </div>
            <TemplateBlock
              title="~/.claude/settings.json"
              lang="JSON"
              body={
                <>
                  {"{\n  "}
                  <span className={styles.hlKey}>&quot;env&quot;</span>
                  {": {\n    "}
                  <span className={styles.hlKey}>
                    &quot;CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS&quot;
                  </span>
                  {": "}
                  <span className={styles.hlStr}>&quot;1&quot;</span>
                  {"\n  },\n\n  "}
                  <span className={styles.hlKey}>&quot;hooks&quot;</span>
                  {": {\n    "}
                  <span className={styles.hlKey}>&quot;TeammateIdle&quot;</span>
                  {": [{\n      "}
                  <span className={styles.hlKey}>&quot;hooks&quot;</span>
                  {": [{\n        "}
                  <span className={styles.hlKey}>&quot;type&quot;</span>
                  {": "}
                  <span className={styles.hlStr}>&quot;command&quot;</span>
                  {",\n        "}
                  <span className={styles.hlKey}>&quot;command&quot;</span>
                  {": "}
                  <span className={styles.hlStr}>
                    &quot;bash -c 'if [ -f ./dist/output.js ]; then echo OK; else echo \"Build
                    artifact missing\" &gt;&amp;2; exit 2; fi'&quot;
                  </span>
                  {"\n      }]\n    }],\n    "}
                  <span className={styles.hlKey}>&quot;TaskCompleted&quot;</span>
                  {": [{\n      "}
                  <span className={styles.hlKey}>&quot;hooks&quot;</span>
                  {": [{\n        "}
                  <span className={styles.hlKey}>&quot;type&quot;</span>
                  {": "}
                  <span className={styles.hlStr}>&quot;command&quot;</span>
                  {",\n        "}
                  <span className={styles.hlKey}>&quot;command&quot;</span>
                  {": "}
                  <span className={styles.hlStr}>
                    &quot;bash -c 'if ! pnpm test 2&gt;&amp;1; then echo \"Tests failing — fix
                    before closing task\" &gt;&amp;2; exit 2; fi'&quot;
                  </span>
                  {"\n      }]\n    }]\n  }\n}"}
                </>
              }
            />
          </div>
          <div className={`${styles.tip} ${styles.tipInfo}`}>
            <span className={styles.tipIcon}>💡</span>
            <div className={styles.tipContent}>
              <strong>ショートカットキー（In-process モード）</strong>
              <code>Shift+↓</code> でテイムメイトを切り替え、<code>Enter</code> で選択、
              <code>Esc</code> で中断、<code>Ctrl+T</code> でタスクリストを表示。
              <code>Shift+Tab</code> で Delegate Mode ON/OFF を切り替えられます。
            </div>
          </div>
        </section>

        {/* s13: Agent Teams 向け CLAUDE.md */}
        <section id="s13" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.numTeam}>13</span>
            Agent Teams 向け <code className={styles.mono}>CLAUDE.md</code> 設計 — 最重要ポイント
          </div>
          <div className={`${styles.tip} ${styles.tipSuccess}`}>
            <span className={styles.tipIcon}>✅</span>
            <div className={styles.tipContent}>
              <strong>テイムメイト全員が CLAUDE.md を自動ロードする</strong>
              各テイムメイトは起動時に CLAUDE.md・MCP サーバー・Skills
              を自動読込します。リードの会話履歴は継承されません。
              <strong>CLAUDE.md の品質がそのままチーム全体のパフォーマンスを決定します。</strong>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              📄 Agent Teams 向け CLAUDE.md テンプレート（追記部分）
            </div>
            <TemplateBlock
              title="CLAUDE.md — Agent Teams セクション追加版"
              lang="Markdown"
              body={AGENT_TEAMS_CLAUDE_MD_TEMPLATE}
            />
          </div>
          <div className={`${styles.tip} ${styles.tipWarn}`}>
            <span className={styles.tipIcon}>⚠️</span>
            <div className={styles.tipContent}>
              <strong>コンテキスト効率化 — スポーンプロンプトに詳細を含める</strong>
              テイムメイトはリードの会話履歴を持ちません。タスク固有の詳細情報はスポーンプロンプト（TaskCreate
              の description フィールド）に含めてください。
            </div>
          </div>
        </section>

        {/* s14: タスクリスト設計 */}
        <section id="s14" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.numTeam}>14</span>
            タスクリストファイル設計 —{" "}
            <code className={styles.mono}>~/.claude/tasks/&#123;team&#125;/*.json</code>
          </div>
          <div className={styles.card}>
            <p>
              Agent Teams のタスクは <code>~/.claude/tasks/{"{team-name}/"}</code> 配下の JSON
              ファイルとして管理されます。タスクは{" "}
              <strong>pending → in_progress → completed</strong>{" "}
              の3状態を遷移し、ファイルロックによる競合防止が組み込まれています。
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              📋 タスクファイル設計パターン（ベストプラクティス）
            </div>
            <TemplateBlock
              title="~/.claude/tasks/auth-team/1.json（タスク定義例）"
              lang="JSON"
              body={TASK_JSON_TEMPLATE}
            />
          </div>
          <div className={styles.patternGrid}>
            <div className={`${styles.pat} ${styles.patGood}`}>
              <div className={styles.patTitle}>✅ タスク設計 ベストプラクティス</div>
              <ul>
                <li>1タスク = 1テイムメイトが担当できる単位</li>
                <li>description に「担当ファイル」「完了条件」「依存関係」を記載</li>
                <li>1テイムメイトあたり 5〜6タスクが最適</li>
                <li>依存関係を dependencies フィールドで明示</li>
                <li>完了時の通知先テイムメイトを記述</li>
                <li>タスクサイズは「明確な成果物」が出せる粒度に</li>
              </ul>
            </div>
            <div className={`${styles.pat} ${styles.patBad}`}>
              <div className={styles.patTitle}>✗ タスク設計 Anti-Patterns</div>
              <ul>
                <li>description が短すぎる（テイムメイトが再探索し無駄にトークン消費）</li>
                <li>担当ファイルを明示しない（別テイムメイトと衝突する）</li>
                <li>完了条件を書かない（テイムメイトが勝手に判断）</li>
                <li>粒度が大きすぎる（1タスクで全機能実装など）</li>
                <li>同一ファイルを複数タスクで書き込み対象にする</li>
              </ul>
            </div>
          </div>
        </section>

        {/* s15: Hooks 設計 */}
        <section id="s15" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.numTeam}>15</span>
            Agent Teams Hooks 設計 — 品質ゲートの自動化
          </div>
          <div className={styles.card}>
            <p>
              Claude Code は Agent Teams 向けに <code>TeammateIdle</code>・
              <code>TaskCompleted</code> の2つのフックイベントを提供します（v2.1.33+）。 フックは
              <strong>命令的（Imperative）</strong>
              であり、シェルコマンドを実行してその結果（終了コード）で Claude の動作を制御します。
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>🪝 全 Agent Teams 対応フック一覧</div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>フックイベント</th>
                    <th>発火タイミング</th>
                    <th>exit 0</th>
                    <th>exit 2</th>
                    <th>主な用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>TeammateIdle</code>
                    </td>
                    <td>テイムメイトがアイドル直前</td>
                    <td>アイドルに移行</td>
                    <td>フィードバックして継続</td>
                    <td>ビルド成果物チェック・次タスクの自動アサイン</td>
                  </tr>
                  <tr>
                    <td>
                      <code>TaskCompleted</code>
                    </td>
                    <td>タスク完了マーク直前</td>
                    <td>completed に遷移</td>
                    <td>完了ブロック＋フィードバック</td>
                    <td>テスト必須・Lint チェック・受け入れ条件検証</td>
                  </tr>
                  <tr>
                    <td>
                      <code>SubagentStart</code>
                    </td>
                    <td>サブエージェント起動時</td>
                    <td>起動継続</td>
                    <td>起動キャンセル</td>
                    <td>不正なエージェントタイプのブロック</td>
                  </tr>
                  <tr>
                    <td>
                      <code>SubagentStop</code>
                    </td>
                    <td>サブエージェント終了時</td>
                    <td>終了継続</td>
                    <td>フィードバック送信</td>
                    <td>成果物の確認・クリーンアップ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* s16: ユースケース */}
        <section id="s16" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.numTeam}>16</span>
            Agent Teams のユースケース別プロンプトパターン
          </div>
          <div className={styles.usecaseGrid}>
            {[
              {
                icon: "🔍",
                title: "競合仮説デバッグ（最強のユースケース）",
                desc: "複数テイムメイトが独立して異なる仮説を検証し、互いに反論し合うことで最速で根本原因を特定。",
                prompt: `"アプリが1メッセージ後に終了するバグがある。\n5人のテイムメイトを起動して異なる仮説を調査させ、\n互いに理論を反証し合うよう指示して。\nfindings.md に共同コンセンサスをまとめて。"`,
              },
              {
                icon: "🏗️",
                title: "クロスレイヤー実装",
                desc: "フロントエンド・バックエンド・DBマイグレーション・テストを担当テイムメイトが並列実装。",
                prompt: `"認証機能を実装して。\nFrontend / Backend / DB-migration / Test の\n4テイムメイトを起動。Sonnet を各テイムメイトに使用。"`,
              },
              {
                icon: "🔬",
                title: "並列 QA スウォーム",
                desc: "複数テイムメイトが同時にアプリの異なる側面（パフォーマンス・セキュリティ・アクセシビリティ・E2E）を検証。",
                prompt: `"localhost:3000 で動くアプリの QA をして。\n3テイムメイトを起動: セキュリティ / パフォーマンス / アクセシビリティ。"`,
              },
              {
                icon: "📐",
                title: "Plan → Team の2ステップパターン（推奨）",
                desc: "まず Plan モードで計画を立て、レビュー後に Agent Teams を起動。計画をチェックポイントにしてトークン無駄遣いを防ぐのが鉄則。",
                prompt: `Step 1: "auth.ts のリファクタリング計画を立てて。\n（実装はしないこと）"\n\nStep 2（計画確認後）:\n"この計画を Agent Teams で並列実装して。"`,
              },
            ].map((uc) => (
              <div key={uc.title} className={styles.uc}>
                <div className={styles.ucIcon}>{uc.icon}</div>
                <div className={styles.ucTitle}>{uc.title}</div>
                <div className={styles.ucDesc}>{uc.desc}</div>
                <div className={styles.ucPrompt}>{uc.prompt}</div>
              </div>
            ))}
          </div>
          <div className={`${styles.tip} ${styles.tipDanger}`}>
            <span className={styles.tipIcon}>🚨</span>
            <div className={styles.tipContent}>
              <strong>Agent Teams Anti-Patterns（コスト・品質両面）</strong>
              <br />
              <strong>いきなり大タスクで起動</strong>：Plan モードで計画を確認してから Team
              を起動すること。
              <strong>同一ファイルを複数テイムメイトが編集</strong>：必ずファイルオーナーシップを
              CLAUDE.md に明記。
              <strong>全テイムメイトに Opus を使う</strong>：リードに Opus、テイムメイトに Sonnet
              でコスト最適化。
            </div>
          </div>
        </section>

        {/* s17: まとめ（Agent Teams 追記版） */}
        <section id="s17" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.numTeam}>17</span>
            まとめ：全 Markdown + 設定ファイルの役割（Agent Teams 追記版）
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ファイル / 設定</th>
                  <th>読者</th>
                  <th>Agent Teams での役割</th>
                  <th>設計原則（Agent Teams 対応）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>CLAUDE.md</code>
                    <br />
                    <small>(root)</small>
                  </td>
                  <td>
                    全テイムメイト
                    <br />
                    起動時に自動ロード
                  </td>
                  <td>全テイムメイトの共通コンテキスト。CLAUDE.md の品質 = チームパフォーマンス</td>
                  <td>ファイルオーナーシップ・完了条件・通信プロトコル・禁止操作を明記</td>
                </tr>
                <tr>
                  <td>
                    <code>.claude/agents/*.md</code>
                  </td>
                  <td>各サブエージェント</td>
                  <td>Agent Teams でも有効。Task(agent_type) でエージェントタイプを指定可</td>
                  <td>tools フィールドで権限を最小化。description でルーティング条件を明確に</td>
                </tr>
                <tr>
                  <td>
                    <code>MEMORY.md</code>
                  </td>
                  <td>
                    各サブエージェント
                    <br />
                    （自己更新）
                  </td>
                  <td>
                    テイムメイトは独立コンテキストのため、共有 MEMORY.md
                    への書き込みは競合リスクあり
                  </td>
                  <td>
                    Agent Teams では MEMORY.md をテイムメイトに使わせず、タスクファイルで情報共有
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>settings.json</code>
                  </td>
                  <td>Claude Code ランタイム</td>
                  <td>Agent Teams の有効化・フック（TeammateIdle / TaskCompleted）を定義</td>
                  <td>hooks に品質ゲートを設定。全テイムメイトに共通ポリシーを強制できる</td>
                </tr>
                <tr>
                  <td>
                    <code>~/.claude/tasks/{"{team}"}/*.json</code>
                  </td>
                  <td>
                    テイムメイト全員
                    <br />
                    （自律的にクレーム）
                  </td>
                  <td>Agent Teams のコア。pending→in_progress→completed の状態管理</td>
                  <td>description に「担当ファイル・完了条件・依存関係」を詳細記述</td>
                </tr>
                <tr>
                  <td>
                    <code>.claude/README.md</code>
                  </td>
                  <td>
                    人間
                    <br />
                    （チームメンバー）
                  </td>
                  <td>エージェント一覧・Agent Teams 有効化手順・ユースケース例を追記する</td>
                  <td>Agent Teams のコスト感（3〜4倍トークン）・推奨ユースケースを明記</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr className={styles.hr} />

        {/* sources */}
        <section id="sources" className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.numSrc}>📚</span>
            参考ソース（サブエージェント + Agent Teams + March 2026 Update）
          </div>
          <div className={styles.sourceGrid}>
            {SOURCES.map((s) => (
              <div key={s.num} className={styles.sourceCard}>
                <div className={styles.sourceTitle}>{s.title}</div>
                <div className={styles.sourceUrl}>
                  <Ext href={s.href}>{s.href}</Ext>
                </div>
                <div className={styles.sourceDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
