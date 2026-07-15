import type { Metadata } from "next";
import GuideContent from "./GuideContent";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "LLMファインチューニング ベストプラクティスガイド | LLM-Studies",
  description:
    "LLMファインチューニングの目的設定、モデル・手法・データの選定、学習、評価、破局的忘却対策、RLHF/DPO、デプロイまでを体系的に解説する実践ガイド。",
};

export default function FineTuningBestPracticesPage() {
  return (
    <div className={styles.root}>
      <TocObserver />
      <GuideContent />
    </div>
  );
}
