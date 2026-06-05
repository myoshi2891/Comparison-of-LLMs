/**
 * Code Review ツール料金比較ページの単一データソース (SSoT)。
 *
 * ── 月次価格レビュー手順 ────────────────────────────────────────────
 * 価格は変動するため、毎月以下の手順で見直すこと:
 *   1. 各エントリの `sourceUrl`（公式 pricing ページ）を開く
 *   2. `plans` の monthlyUsd / annualMonthlyUsd に差分があれば書き換える
 *   3. 更新したエントリの `priceCheckedAt` を当月 "YYYY-MM" に更新
 *   4. ページ全体の最終確認月 `PRICE_CHECKED_AT` を当月に更新
 * 価格に関わる可変データはすべてこのファイルに集約しているため、
 * 表示用 JSX (page.tsx) を変更せずにデータだけ差し替えられる。
 * ────────────────────────────────────────────────────────────────
 */

/** ツールの分類。erasableSyntaxOnly 準拠のため enum ではなく union 型で表現する。 */
export type ToolCategory = "AIレビュー" | "AIエージェント" | "静的解析";

/** 1 プラン/エディションの料金。USD 基準で保持し、表示時に円換算する。 */
export interface PricingPlan {
  /** プラン名（例: "Free", "Pro", "Business", "Enterprise"） */
  name: string;
  /** 月額 USD（1ユーザー/シート/月）。固定額がなければ null */
  monthlyUsd: number | null;
  /** 年額請求時の月額換算 USD（割引あり）。なければ 12ヶ月 = monthlyUsd × 12 */
  annualMonthlyUsd?: number;
  /** monthlyUsd=null 時の表記（"従量課金" / "要問合せ" / "LOC依存（年額）"） */
  priceNote?: string;
  /** 補足（"1ユーザー/月" / "最低5シート" / "+ トークン従量"） */
  unitNote?: string;
}

/** 1 ツール分の比較データ。価格根拠の出典 URL を必須項目として持つ。 */
export interface ToolEntry {
  /** ツール名 */
  name: string;
  /** 分類 */
  category: ToolCategory;
  /** 主用途 */
  use: string;
  /** 簡易説明（主要機能の一行サマリ） */
  summary: string;
  /** メリット */
  pros: string;
  /** デメリット */
  cons: string;
  /** プラン別料金リスト */
  plans: readonly PricingPlan[];
  /** 公式サイト URL */
  href: string;
  /** 価格根拠の出典 URL（公式 pricing ページ等） */
  sourceUrl: string;
  /** 出典の表示名 */
  sourceLabel: string;
  /** 価格最終確認年月 "YYYY-MM"（月次更新で書き換える） */
  priceCheckedAt: string;
}

/** ページ全体の価格最終確認年月（Hero / 凡例に表示）。 */
export const PRICE_CHECKED_AT = "2026-06";

/**
 * カテゴリの表示順。マトリクス・カードのグループ表示はこの順序に従う。
 */
export const CATEGORY_ORDER: readonly ToolCategory[] = ["AIレビュー", "AIエージェント", "静的解析"];

/**
 * Compute representative USD amounts for 1, 3, and 12 months and whether an annual discount applies.
 *
 * If `p.monthlyUsd` is `null`, all amount fields are `null` and `discounted` is `false`.
 *
 * @param p - The pricing plan to evaluate
 * @returns An object with:
 *  - `m1`: monthly USD amount or `null`
 *  - `m3`: three-month USD total or `null`
 *  - `m12`: twelve-month USD total using `annualMonthlyUsd` when provided otherwise `monthlyUsd`, or `null`
 *  - `discounted`: `true` if `annualMonthlyUsd` is present, `false` otherwise
 */
export function planAmounts(p: PricingPlan): {
  m1: number | null;
  m3: number | null;
  m12: number | null;
  discounted: boolean;
} {
  if (p.monthlyUsd === null) {
    return { m1: null, m3: null, m12: null, discounted: false };
  }
  const m1 = p.monthlyUsd;
  const annualMo = p.annualMonthlyUsd ?? p.monthlyUsd;
  return {
    m1,
    m3: m1 * 3,
    m12: annualMo * 12,
    discounted: p.annualMonthlyUsd != null,
  };
}

/**
 * Produce a representative lowest-price label for a set of pricing plans for display in a comparison matrix.
 *
 * @param plans - The pricing plans to evaluate
 * @returns `'無料'` if only free plans exist, `'無料〜'` if a free plan exists alongside paid plans, `'$<min>〜'` when one or more numeric `monthlyUsd` values exist (using the minimum), or the first plan's `priceNote` (or `"—"`) when all `monthlyUsd` values are `null`.
 */
export function representativePrice(plans: readonly PricingPlan[]): string {
  const hasFree = plans.some((p) => p.monthlyUsd === 0);
  if (hasFree) {
    const hasMore = plans.some((p) => p.monthlyUsd !== null && p.monthlyUsd > 0);
    return hasMore ? "無料〜" : "無料";
  }
  const amounts = plans.map((p) => p.monthlyUsd).filter((v): v is number => v !== null);
  if (amounts.length > 0) {
    const min = Math.min(...amounts);
    return `$${min}〜`;
  }
  return plans[0]?.priceNote ?? "—";
}

/**
 * 比較対象ツール一覧。出典は 2026-06 時点で各公式 pricing ページを確認済み。
 * Gemini Code Assist: Standard $22.80/月・年額$19、Enterprise $54/月・年額$45（Google Cloud 公式確認済）
 * Google Jules: Google AI Pro $19.99/月、Google AI Ultra $200/月（jules.google 公式確認済）
 */
export const TOOLS: readonly ToolEntry[] = [
  {
    name: "GitHub Copilot Code Review",
    category: "AIレビュー",
    use: "PRレビュー",
    summary: "GitHub に統合された AI が PR へ自動でレビューコメントと修正提案を付与する。",
    pros: "GitHub 標準で導入が容易",
    cons: "深い設計レビューは弱め",
    plans: [
      { name: "Free", monthlyUsd: 0 },
      {
        name: "Pro",
        monthlyUsd: 10,
        annualMonthlyUsd: 8.33,
        unitNote: "+ AI Credits（2026-06 従量制）",
      },
      { name: "Business", monthlyUsd: 19, unitNote: "+ AI Credits（2026-06 従量制）" },
      { name: "Enterprise", monthlyUsd: 39, unitNote: "+ AI Credits（2026-06 従量制）" },
    ],
    href: "https://github.com/features/copilot",
    sourceUrl: "https://github.com/features/copilot/plans",
    sourceLabel: "GitHub Copilot 料金",
    priceCheckedAt: "2026-06",
  },
  {
    name: "OpenAI Codex",
    category: "AIレビュー",
    use: "PRレビュー・修正提案",
    summary: "リポジトリ全体を理解し、レビューから修正実装までこなすコーディングエージェント。",
    pros: "リポジトリ全体を理解し修正実装まで可能",
    cons: "比較的新しく実績が浅い",
    plans: [
      { name: "ChatGPT Plus", monthlyUsd: 20, unitNote: "+ トークン従量" },
      { name: "ChatGPT Pro", monthlyUsd: 200, unitNote: "+ トークン従量" },
      {
        name: "ChatGPT Team",
        monthlyUsd: 30,
        annualMonthlyUsd: 25,
        unitNote: "+ トークン従量・最低2シート",
      },
    ],
    href: "https://openai.com/codex/",
    sourceUrl: "https://openai.com/chatgpt/pricing/",
    sourceLabel: "OpenAI ChatGPT 料金",
    priceCheckedAt: "2026-06",
  },
  {
    name: "Claude Code Review",
    category: "AIレビュー",
    use: "大規模レビュー",
    summary: "強力な文脈理解で大規模な差分や設計意図まで踏み込んだレビューを行う。",
    pros: "文脈理解が非常に強い",
    cons: "コストは高め",
    plans: [
      { name: "Pro", monthlyUsd: 20 },
      { name: "Max 5x", monthlyUsd: 100 },
      {
        name: "Team Premium",
        monthlyUsd: 125,
        annualMonthlyUsd: 100,
        unitNote: "最低5シート・Claude Code 同梱",
      },
      { name: "Enterprise", monthlyUsd: null, priceNote: "要問合せ" },
    ],
    href: "https://claude.com/product/claude-code",
    sourceUrl: "https://claude.com/pricing",
    sourceLabel: "Claude 料金",
    priceCheckedAt: "2026-06",
  },
  {
    name: "CodeRabbit",
    category: "AIレビュー",
    use: "自動PRレビュー",
    summary: "GitHub / GitLab に密に統合し、PR ごとに要約とレビューを自動生成する。",
    pros: "GitHub 統合が優秀",
    cons: "実装の修正提案は弱い",
    plans: [
      { name: "Free", monthlyUsd: 0 },
      { name: "Lite", monthlyUsd: 12 },
      { name: "Pro", monthlyUsd: 30, annualMonthlyUsd: 24 },
      { name: "Enterprise", monthlyUsd: null, priceNote: "要問合せ" },
    ],
    href: "https://www.coderabbit.ai/",
    sourceUrl: "https://www.coderabbit.ai/pricing",
    sourceLabel: "CodeRabbit 料金",
    priceCheckedAt: "2026-06",
  },
  {
    name: "Gemini Code Assist",
    category: "AIレビュー",
    use: "IDEレビュー",
    summary: "VS Code / JetBrains と連携し、IDE 内でコード補完・生成・レビューを支援する。",
    pros: "VS Code 連携が強力",
    cons: "PR レビューは弱め",
    plans: [
      { name: "Free（個人）", monthlyUsd: 0 },
      {
        name: "Standard",
        monthlyUsd: 22.8,
        annualMonthlyUsd: 19,
        unitNote: "1ユーザー/月（月払い$22.80・年払い$19）",
      },
      {
        name: "Enterprise",
        monthlyUsd: 54,
        annualMonthlyUsd: 45,
        unitNote: "1ユーザー/月（月払い$54・年払い$45）",
      },
    ],
    href: "https://codeassist.google/",
    sourceUrl: "https://cloud.google.com/products/gemini/pricing",
    sourceLabel: "Gemini for Google Cloud 料金",
    priceCheckedAt: "2026-06",
  },
  {
    name: "Google Jules",
    category: "AIエージェント",
    use: "Issue→PR作成",
    summary: "Issue を起点に非同期でコードを実装し PR を自動作成する自律コーディングエージェント。",
    pros: "実装の自動化に強い",
    cons: "レビュー用途ではない",
    plans: [
      { name: "Free", monthlyUsd: 0 },
      { name: "Google AI Pro", monthlyUsd: 19.99 },
      { name: "Google AI Ultra", monthlyUsd: 200 },
    ],
    href: "https://jules.google/",
    sourceUrl: "https://jules.google/docs/usage-limits/",
    sourceLabel: "Jules Limits & Plans",
    priceCheckedAt: "2026-06",
  },
  {
    name: "AWS CodeGuru Reviewer",
    category: "AIレビュー",
    use: "AWS最適化",
    summary: "機械学習でコードの欠陥や AWS ベストプラクティス逸脱を検出する。",
    pros: "AWS 知識が豊富",
    cons: "AWS 以外では効果が減る",
    plans: [
      {
        name: "従量課金",
        monthlyUsd: null,
        priceNote: "従量課金",
        unitNote: "LOC 依存・フルスキャン $10/10万LOC・90日無料枠",
      },
    ],
    href: "https://aws.amazon.com/codeguru/",
    sourceUrl: "https://aws.amazon.com/codeguru/reviewer/pricing/",
    sourceLabel: "Amazon CodeGuru Reviewer 料金",
    priceCheckedAt: "2026-06",
  },
  {
    name: "SonarQube Community Build",
    category: "静的解析",
    use: "品質・脆弱性分析",
    summary: "無料で使える静的解析。コード品質とセキュリティ脆弱性を継続的に検査する。",
    pros: "無料で強力",
    cons: "PR 分析は有料版が必要",
    plans: [{ name: "Community Build", monthlyUsd: 0, unitNote: "セルフホスト" }],
    href: "https://www.sonarsource.com/products/sonarqube/",
    sourceUrl: "https://www.sonarsource.com/plans-and-pricing/",
    sourceLabel: "Sonar Plans & Pricing",
    priceCheckedAt: "2026-06",
  },
  {
    name: "SonarQube Developer Edition",
    category: "静的解析",
    use: "PR分析",
    summary: "ブランチ分析と PR デコレーションに対応した有償の静的解析エディション。",
    pros: "ブランチ分析に対応",
    cons: "高価",
    plans: [
      {
        name: "Developer Edition",
        monthlyUsd: null,
        priceNote: "LOC依存（年額）",
        unitNote: "インスタンス/年・LOC 規模で変動・要見積",
      },
    ],
    href: "https://www.sonarsource.com/products/sonarqube/",
    sourceUrl: "https://www.sonarsource.com/plans-and-pricing/sonarqube/",
    sourceLabel: "SonarQube Server 料金",
    priceCheckedAt: "2026-06",
  },
];
