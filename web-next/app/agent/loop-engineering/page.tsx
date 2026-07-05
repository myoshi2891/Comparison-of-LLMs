import styles from "./page.module.css";

export const metadata = {
  title: "Loop Engineering 完全ガイド ― プロンプトを書く人からループを設計する人へ",
  description:
    "Boris Cherny氏（Claude Code開発者）、Peter Steinberger氏（OpenClaw開発者）、Andrew Ng氏らの発言をもとに、AIエージェントを自律的に反復させる「Loop Engineering」を初学者向けにステップバイステップで解説します。",
};

export default function Page() {
  return (
    <div className={styles.pageWrap}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>
            <span className={styles.dot} />
            Beginner Guide · 2026年7月時点
          </span>
          <h1 className={styles.title}>
            Loop Engineering
            <br />
            完全ガイド ―
            <br />
            <span className={styles.accent}>プロンプトを書く人</span>から
            <br />
            <span className={styles.accent}>ループを設計する人</span>へ
          </h1>
        </div>
      </header>
    </div>
  );
}
