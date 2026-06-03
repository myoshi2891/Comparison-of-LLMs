/**
 * Code Review ツール料金比較ページの単一データソース (SSoT)。
 *
 * ── 月次価格レビュー手順 ────────────────────────────────────────────
 * 価格は変動するため、毎月以下の手順で見直すこと:
 *   1. 各エントリの `sourceUrl`（公式 pricing ページ）を開く
 *   2. `price` に差分があれば書き換える
 *   3. 更新したエントリの `priceCheckedAt` を当月 "YYYY-MM" に更新
 *   4. ページ全体の最終確認月 `PRICE_CHECKED_AT` を当月に更新
 * 価格に関わる可変データはすべてこのファイルに集約しているため、
 * 表示用 JSX (page.tsx) を変更せずにデータだけ差し替えられる。
 * ────────────────────────────────────────────────────────────────
 */

/** ツールの分類。erasableSyntaxOnly 準拠のため enum ではなく union 型で表現する。 */
export type ToolCategory = "AIレビュー" | "AIエージェント" | "静的解析";

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
  /** 価格目安（定性的表記） */
  price: string;
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
 * 比較対象ツール一覧。出典は 2026-06 時点で各公式 pricing ページを確認済み。
 */
export const TOOLS: readonly ToolEntry[] = [
  {
    name: "GitHub Copilot Code Review",
    category: "AIレビュー",
    use: "PRレビュー",
    summary: "GitHub に統合された AI が PR へ自動でレビューコメントと修正提案を付与する。",
    pros: "GitHub 標準で導入が容易",
    cons: "深い設計レビューは弱め",
    price: "Copilot 契約内",
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
    price: "ChatGPT Plus 〜",
    href: "https://openai.com/codex/",
    sourceUrl: "https://developers.openai.com/codex/pricing",
    sourceLabel: "OpenAI Codex 料金",
    priceCheckedAt: "2026-06",
  },
  {
    name: "Claude Code Review",
    category: "AIレビュー",
    use: "大規模レビュー",
    summary: "強力な文脈理解で大規模な差分や設計意図まで踏み込んだレビューを行う。",
    pros: "文脈理解が非常に強い",
    cons: "コストは高め",
    price: "Team / Enterprise",
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
    price: "Free 〜 有料",
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
    price: "無料枠あり",
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
    price: "無料枠あり",
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
    price: "従量課金",
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
    price: "無料",
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
    price: "有料",
    href: "https://www.sonarsource.com/products/sonarqube/",
    sourceUrl: "https://www.sonarsource.com/plans-and-pricing/sonarqube/",
    sourceLabel: "SonarQube Server 料金",
    priceCheckedAt: "2026-06",
  },
];
