import type { Metadata } from "next";
import GuideContent from "./GuideContent";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "AIガバナンス実践ガイド | LLM-Studies",
  description:
    "AIガバナンスの基礎、NIST AI RMF・EU AI Act・ISO/IEC 42001などの国際フレームワーク、組織での構築手順を初学者向けに解説する実践ガイド。",
};

export default function AiGovernancePage() {
  return (
    <div className={styles.root}>
      <TocObserver />
      <GuideContent />
    </div>
  );
}
