import type { Metadata } from "next";
import GuideContent from "./GuideContent";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "OpenAI GPT-5.6 完全ガイド | LLM-Studies",
  description:
    "OpenAI GPT-5.6 Sol / Terra / Luna のモデル選定、Reasoning、PTC、プロンプト設計、移行とコスト最適化を解説する実践ガイド。",
};

export default function Gpt56BestPracticesPage() {
  return (
    <div className={styles.root}>
      <TocObserver />
      <GuideContent />
    </div>
  );
}
