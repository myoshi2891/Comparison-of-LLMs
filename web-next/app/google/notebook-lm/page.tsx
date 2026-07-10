import type { Metadata } from "next";
import TocObserver from "./TocObserver";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Google NotebookLM 完全ベストプラクティスガイド | LLM-Studies",
  description: "Google NotebookLM を実務や研究で使いこなすための中〜上級者向け完全ガイド。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function GoogleNotebookLMPage() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />

      <aside className={styles.sidebar}>
        <nav aria-label="目次">
          <ul>
            <li>
              <a href="#ch1" className={styles.tocLink}>
                1. ソースグラウンディングとは
              </a>
            </li>
            <li>
              <a href="#ch2" className={styles.tocLink}>
                2. 2026年のアーキテクチャ変化
              </a>
            </li>
            <li>
              <a href="#ch3" className={styles.tocLink}>
                3. プラン比較と上限
              </a>
            </li>
            <li>
              <a href="#ch4" className={styles.tocLink}>
                4. ノートブック設計
              </a>
            </li>
            <li>
              <a href="#ch5" className={styles.tocLink}>
                5. ソースの追加
              </a>
            </li>
            <li>
              <a href="#ch6" className={styles.tocLink}>
                6. Chatの設定
              </a>
            </li>
            <li>
              <a href="#ch7" className={styles.tocLink}>
                7. プロンプト設計
              </a>
            </li>
            <li>
              <a href="#ch8" className={styles.tocLink}>
                8. Studio 9つの出力形式
              </a>
            </li>
            <li>
              <a href="#ch9" className={styles.tocLink}>
                9. Geminiアプリ連携
              </a>
            </li>
            <li>
              <a href="#ch10" className={styles.tocLink}>
                10. セキュリティ / ガバナンス
              </a>
            </li>
            <li>
              <a href="#ch11" className={styles.tocLink}>
                11. Enterprise 導入ガイド
              </a>
            </li>
            <li>
              <a href="#ch12" className={styles.tocLink}>
                12. モバイルアプリ
              </a>
            </li>
            <li>
              <a href="#ch13" className={styles.tocLink}>
                13. アンチパターン対処
              </a>
            </li>
            <li>
              <a href="#ch14" className={styles.tocLink}>
                14. ワークフロー実例
              </a>
            </li>
            <li>
              <a href="#ch15" className={styles.tocLink}>
                15. 20則チェックリスト
              </a>
            </li>
            <li>
              <a href="#ch16" className={styles.tocLink}>
                16. アップデート年表
              </a>
            </li>
            <li>
              <a href="#ch17" className={styles.tocLink}>
                17. 参考ソースURL一覧
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.content}>
        <header>
          <h1>Google NotebookLM 完全ベストプラクティスガイド</h1>
        </header>

        <section className="chapter" id="ch1">
          <h2>01. NotebookLMとは何か — ソースグラウンディングという設計思想</h2>
        </section>
        <section className="chapter" id="ch2">
          <h2>02. 2026年のアーキテクチャ変化 — エージェント化への転換</h2>
        </section>
        <section className="chapter" id="ch3">
          <h2>03. プラン比較とシステム上限</h2>
        </section>
        <section className="chapter" id="ch4">
          <h2>04. ステップ1: ノートブック設計 — スコープを絞る</h2>
        </section>
        <section className="chapter" id="ch5">
          <h2>05. ステップ2: ソースの追加 — Discover SourcesとDeep Research</h2>
        </section>
        <section className="chapter" id="ch6">
          <h2>06. ステップ3: Chatの設定 — Configure Chatとカスタムインストラクション</h2>
        </section>
        <section className="chapter" id="ch7">
          <h2>07. ステップ4: プロンプト設計のベストプラクティス</h2>
        </section>
        <section className="chapter" id="ch8">
          <h2>08. ステップ5: Studioパネル完全攻略 — 9つの出力形式</h2>
        </section>
        <section className="chapter" id="ch9">
          <h2>09. ステップ6: Gemini アプリとの双方向連携</h2>
        </section>
        <section className="chapter" id="ch10">
          <h2>10. セキュリティとプライバシー — 3層のデータガバナンス</h2>
        </section>
        <section className="chapter" id="ch11">
          <h2>11. NotebookLM Enterprise（Google Cloud）導入ガイド</h2>
        </section>
        <section className="chapter" id="ch12">
          <h2>12. モバイルアプリの活用と制限事項</h2>
        </section>
        <section className="chapter" id="ch13">
          <h2>13. アンチパターンとトラブルシューティング</h2>
        </section>
        <section className="chapter" id="ch14">
          <h2>14. ユースケース別ワークフロー実例</h2>
        </section>
        <section className="chapter" id="ch15">
          <h2>15. ベストプラクティス20則チェックリスト</h2>
        </section>
        <section className="chapter" id="ch16">
          <h2>16. 2023〜2026 アップデート年表</h2>
        </section>
        <section className="chapter" id="ch17">
          <h2>17. 参考ソースURL一覧</h2>
          <p>
            <Ext href="https://support.google.com/notebooklm/">公式ヘルプ</Ext>
          </p>
        </section>

        <div className="end-note">
          <h2>おわりに</h2>
        </div>

        <pre>
          <code className="language-yaml">name: notebooklm</code>
        </pre>
      </main>
    </div>
  );
}
