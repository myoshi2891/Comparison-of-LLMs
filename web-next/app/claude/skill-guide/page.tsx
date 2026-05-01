import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "SKILL.md 完全解説ガイド — Claude Code",
};

export default function Page() {
  return (
    <div className={styles.pageWrap}>
      <div className={styles.layout}>
        <aside className={styles.sidebar} />
        <main className={styles.main}>
          <section className={styles.hero}>
            <h1>
              SKILL.md
              <br />
              完全解説ガイド
            </h1>
          </section>
        </main>
      </div>
    </div>
  );
}
