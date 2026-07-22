import type { Metadata } from "next";
import { findBySlug } from "@/lib/page-registry";
import GuideContent from "./GuideContent";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

/**
 * Generates metadata for the fine-tuning best practices guide page.
 *
 * @returns Metadata containing the page title and description
 */
export function generateMetadata(): Metadata {
  const entry = findBySlug("/local-llm/finetuning-best-practices");
  return {
    title: entry
      ? `${entry.title} | LLM-Studies`
      : "LLMファインチューニング ベストプラクティスガイド | LLM-Studies",
    description:
      entry?.summary ??
      "LLMファインチューニングの目的設定、モデル・手法・データの選定、学習、評価、破局的忘却対策、RLHF/DPO、デプロイまでを体系的に解説する実践ガイド。",
  };
}

/**
 * Renders the fine-tuning best practices guide page.
 */
export default function FineTuningBestPracticesPage() {
  return (
    <div className={styles.root}>
      <TocObserver />
      <GuideContent />
    </div>
  );
}
