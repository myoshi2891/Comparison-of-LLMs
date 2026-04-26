/**
 * 参考リンク集セクション。
 *
 * Phase 5 からの重要変更:
 * - レガシーは refNote を生 HTML 文字列として DOM に注入していたが、
 *   本バージョンでは tRich("refNote", lang) により React ノードとして
 *   合成する。React unsafe HTML 注入プロパティは一切使用しない。
 *
 * Server Component: props はプレーンデータのみで interactive 要素なし。
 * 16 件の reference card (15 プロバイダー + 為替レート情報) を描画する。
 */

import type { Lang } from "@/lib/i18n";
import { t, tRich } from "@/lib/i18n";

interface Props {
  lang: Lang;
}

interface RefEntry {
  readonly href: string;
  readonly label: string;
  readonly desc_ja: string;
  readonly desc_en: string;
}

interface RefCard {
  readonly title: string;
  readonly links: readonly RefEntry[];
  /** true のとき title を言語別に動的生成する (為替レートカード) */
  readonly isFx?: true;
}

const CARDS: readonly RefCard[] = [
  {
    title: "🔌 OpenAI",
    links: [
      {
        href: "https://openai.com/api/pricing/",
        label: "openai.com/api/pricing",
        desc_ja: "API全モデル料金 (GPT-5, o3, o4-mini etc.)",
        desc_en: "All models pricing (GPT-5, o3, o4-mini etc.)",
      },
      {
        href: "https://platform.openai.com/docs/models",
        label: "platform.openai.com/docs/models",
        desc_ja: "モデル一覧・コンテキスト長",
        desc_en: "Model list & context lengths",
      },
    ],
  },
  {
    title: "🟣 Anthropic",
    links: [
      {
        href: "https://www.anthropic.com/pricing",
        label: "anthropic.com/pricing",
        desc_ja: "Claude API全モデル料金",
        desc_en: "Claude API pricing",
      },
      {
        href: "https://docs.anthropic.com/en/docs/about-claude/models",
        label: "docs.anthropic.com/about-claude/models",
        desc_ja: "最新モデル一覧・コンテキスト長",
        desc_en: "Latest models & context lengths",
      },
    ],
  },
  {
    title: "🔵 Google AI Studio",
    links: [
      {
        href: "https://ai.google.dev/pricing",
        label: "ai.google.dev/pricing",
        desc_ja: "Gemini API料金 (2.5 Pro / Flash / Flash-Lite)",
        desc_en: "Gemini API pricing (2.5 Pro / Flash / Flash-Lite)",
      },
      {
        href: "https://ai.google.dev/gemini-api/docs/models/gemini",
        label: "ai.google.dev/gemini-api/docs/models",
        desc_ja: "Geminiモデル一覧・コンテキスト長",
        desc_en: "Gemini model list & context lengths",
      },
    ],
  },
  {
    title: "🔷 Vertex AI (GCP)",
    links: [
      {
        href: "https://cloud.google.com/vertex-ai/generative-ai/pricing",
        label: "cloud.google.com/vertex-ai/generative-ai/pricing",
        desc_ja: "Vertex AI Gemini API料金 (GCP課金)",
        desc_en: "Vertex AI Gemini API pricing (GCP billing)",
      },
      {
        href: "https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference",
        label: "cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference",
        desc_ja: "Model Garden全モデル・機能比較",
        desc_en: "Model Garden reference & comparison",
      },
    ],
  },
  {
    title: "⚡ xAI (Grok)",
    links: [
      {
        href: "https://x.ai/api",
        label: "x.ai/api",
        desc_ja: "Grok API料金・最新モデル一覧",
        desc_en: "Grok API pricing & latest models",
      },
      {
        href: "https://docs.x.ai/docs/models",
        label: "docs.x.ai/docs/models",
        desc_ja: "モデル一覧・コンテキスト長",
        desc_en: "Model list & context lengths",
      },
    ],
  },
  {
    title: "🌊 DeepSeek",
    links: [
      {
        href: "https://platform.deepseek.com/api-docs/pricing",
        label: "platform.deepseek.com/api-docs/pricing",
        desc_ja: "DeepSeek API料金・最新モデル",
        desc_en: "DeepSeek API pricing & latest models",
      },
      {
        href: "https://github.com/deepseek-ai/DeepSeek-V3",
        label: "github.com/deepseek-ai/DeepSeek-V3",
        desc_ja: "OSS MITライセンス",
        desc_en: "OSS MIT license",
      },
    ],
  },
  {
    title: "🟠 AWS (Bedrock)",
    links: [
      {
        href: "https://aws.amazon.com/bedrock/pricing/",
        label: "aws.amazon.com/bedrock/pricing",
        desc_ja: "Nova Pro / Nova Micro 等全モデル料金",
        desc_en: "All models pricing (Nova Pro, Nova Micro etc.)",
      },
      {
        href: "https://docs.aws.amazon.com/bedrock/latest/userguide/foundation-models-reference.html",
        label: "docs.aws.amazon.com/bedrock/foundation-models-reference",
        desc_ja: "対応モデル一覧",
        desc_en: "Supported model reference",
      },
    ],
  },
  {
    title: "🐙 GitHub Copilot",
    links: [
      {
        href: "https://github.com/features/copilot#pricing",
        label: "github.com/features/copilot#pricing",
        desc_ja: "Free / Pro / Pro+ / Business / Enterprise",
        desc_en: "Free / Pro / Pro+ / Business / Enterprise",
      },
      {
        href: "https://docs.github.com/en/copilot/get-started/plans",
        label: "docs.github.com/copilot/get-started/plans",
        desc_ja: "各プラン詳細・上限数",
        desc_en: "Plan details & limits",
      },
    ],
  },
  {
    title: "🟣 Cursor",
    links: [
      {
        href: "https://www.cursor.com/pricing",
        label: "cursor.com/pricing",
        desc_ja: "Hobby / Pro / Ultra / Teams プラン",
        desc_en: "Hobby / Pro / Ultra / Teams plans",
      },
      {
        href: "https://docs.cursor.com/account/plans-and-usage",
        label: "docs.cursor.com/account/plans-and-usage",
        desc_ja: "クレジット換算・上限詳細",
        desc_en: "Credit system & usage limits",
      },
    ],
  },
  {
    title: "🌊 Windsurf",
    links: [
      {
        href: "https://windsurf.com/pricing",
        label: "windsurf.com/pricing",
        desc_ja: "Free / Pro / Teams プラン",
        desc_en: "Free / Pro / Teams plans",
      },
      {
        href: "https://docs.windsurf.com/windsurf/credits-and-billing",
        label: "docs.windsurf.com/credits-and-billing",
        desc_ja: "クレジット仕様・SWE-1.5詳細",
        desc_en: "Credit system & SWE-1.5 details",
      },
    ],
  },
  {
    title: "🟣 Claude Code",
    links: [
      {
        href: "https://www.anthropic.com/claude-code",
        label: "anthropic.com/claude-code",
        desc_ja: "Claude Code 概要・特徴",
        desc_en: "Claude Code overview & features",
      },
      {
        href: "https://docs.anthropic.com/en/docs/claude-code/pricing",
        label: "docs.anthropic.com/claude-code/pricing",
        desc_ja: "Pro / Max 5x / Max 20x / Team 料金",
        desc_en: "Pro / Max 5x / Max 20x / Team pricing",
      },
    ],
  },
  {
    title: "🧠 JetBrains AI",
    links: [
      {
        href: "https://www.jetbrains.com/ai/",
        label: "jetbrains.com/ai",
        desc_ja: "JetBrains AI Assistant 公式ページ",
        desc_en: "JetBrains AI Assistant official page",
      },
      {
        href: "https://www.jetbrains.com/store/#personal",
        label: "jetbrains.com/store/#personal",
        desc_ja: "個人・チーム・Enterprise 価格一覧",
        desc_en: "Personal / Team / Enterprise pricing",
      },
    ],
  },
  {
    title: "🤖 Junie (JetBrains)",
    links: [
      {
        href: "https://www.jetbrains.com/junie/",
        label: "jetbrains.com/junie",
        desc_ja: "Junie 自律コーディングエージェント公式",
        desc_en: "Junie autonomous coding agent",
      },
      {
        href: "https://www.jetbrains.com/junie/faq/",
        label: "jetbrains.com/junie/faq",
        desc_ja: "利用条件・AI Pro内包の詳細",
        desc_en: "Requirements & AI Pro inclusion details",
      },
    ],
  },
  {
    title: "🚀 Antigravity (Google)",
    links: [
      {
        href: "https://antigravity.google/pricing",
        label: "antigravity.google/pricing",
        desc_ja: "Google 傘下 / Free / Pro / Team プラン (⚠ 要確認)",
        desc_en: "Google-owned / Free / Pro / Team (⚠ verify)",
      },
      {
        href: "https://antigravity.google",
        label: "antigravity.google",
        desc_ja: "antigravity.google/pricing で最新料金確認",
        desc_en: "Check latest pricing at antigravity.google/pricing",
      },
    ],
  },
  {
    title: "🔵 Google One AI Plans",
    links: [
      {
        href: "https://one.google.com/about/google-ai-plans/",
        label: "one.google.com/about/google-ai-plans",
        desc_ja: "Google AI Plus / Pro / Ultra — Google One 統合プラン",
        desc_en: "Google AI Plus / Pro / Ultra — integrated Google One plans",
      },
      {
        href: "https://one.google.com/about/google-ai-plans/",
        label: "one.google.com/about/google-ai-plans",
        desc_ja: "最新 Gemini モデル・コーディング機能を含む",
        desc_en: "Latest Gemini models & coding features included",
      },
    ],
  },
  {
    isFx: true,
    title: "💱 ",
    links: [
      {
        href: "https://fred.stlouisfed.org/series/DEXJPUS",
        label: "fred.stlouisfed.org — DEXJPUS",
        desc_ja: "FRB FRED — USD/JPY 日次データ",
        desc_en: "FRB FRED — USD/JPY daily data",
      },
      {
        href: "https://tradingeconomics.com/japan/currency",
        label: "tradingeconomics.com/japan/currency",
        desc_ja: "直近レート推移・チャート",
        desc_en: "Recent rate history & charts",
      },
    ],
  },
];

/**
 * Renders a localized "reference links" section containing provider cards and an FX rate card.
 *
 * Renders 16 reference cards (15 provider cards plus one FX rate card). Each card displays a title
 * and two external links with language-specific descriptions; the FX card title is localized based
 * on `lang`. The section also includes a localized rich-text note produced by `tRich("refNote", lang)`.
 *
 * @param lang - Language code used to select localized titles and descriptions
 * @returns A React element containing the complete reference links section
 */
export function RefLinks({ lang }: Props) {
  return (
    <div className="ref-section section" style={{ marginTop: "32px" }}>
      <div className="ref-title">{t("refTitle", lang)}</div>
      <div className="ref-grid">
        {CARDS.map((card, ci) => {
          const title = card.isFx
            ? `💱 ${lang === "ja" ? "為替レート参考" : "FX Rate Reference"}`
            : card.title;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: CARDS は不変配列で index がそのまま安定キー
            <div key={ci} className="ref-card">
              <h5>{title}</h5>
              <div className="ref-link">
                {card.links.map((l, li) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: links も不変配列
                  <span key={li}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                    <span className="ref-label">{lang === "ja" ? l.desc_ja : l.desc_en}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="note-box"
        style={{
          marginTop: "16px",
          background: "rgba(99,102,241,.05)",
          borderColor: "rgba(99,102,241,.2)",
        }}
      >
        {tRich("refNote", lang)}
      </div>
    </div>
  );
}
