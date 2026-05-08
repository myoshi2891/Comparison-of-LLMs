import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "OpenAI Codex 完全ガイド 2026",
  description:
    "初学者から中級者まで。AIコーディングエージェントを最大限に活かすベストプラクティスをステップバイステップで解説します。",
};

export default function Page() {
  return (
    <main className={styles.wrap}>
      <h1>
        <span>OpenAI Codex</span>
        <span>完全ガイド</span>
      </h1>

      <section id="what">
        <h2>OpenAI Codex とは何か？</h2>
        <p>（実装予定）</p>
      </section>

      <section id="setup">
        <h2>セットアップ</h2>
        <p>（実装予定）</p>
      </section>

      <section id="models">
        <h2>モデル選択</h2>
        <p>（実装予定）</p>
      </section>

      <section id="prompt">
        <h2>プロンプト設計のベストプラクティス</h2>
        <p>（実装予定）</p>
      </section>

      <section id="agents-md">
        <h2>AGENTS.md の活用</h2>
        <p>（実装予定）</p>
      </section>

      <section id="workflow">
        <h2>実践ワークフロー</h2>
        <p>（実装予定）</p>
      </section>

      <section id="advanced">
        <h2>上級テクニック</h2>
        <p>（実装予定）</p>
      </section>

      <section id="dodont">
        <h2>やること・やってはいけないこと</h2>
        <p>（実装予定）</p>
      </section>

      <section id="sources">
        <h2>参考文献・ソース</h2>
        <pre>
          <code>placeholder</code>
        </pre>
        <a href="https://openai.com/codex" target="_blank" rel="noopener noreferrer">
          OpenAI Codex
        </a>
      </section>
    </main>
  );
}
