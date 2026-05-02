import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "SKILL.md 中級者完全攻略ガイド — Claude Code",
  description:
    "プログレッシブ・ディスクロージャー、トークン経済、動的コンテキスト注入、context:fork、エンタープライズプロビジョニングまで網羅した実践リファレンスです。",
};

export default function Page() {
  return (
    <div className={styles.pageWrap}>
      <div className={styles.progress} />

      <nav className={styles.pageToc} aria-label="ページ内目次">
        <div className={styles.navInner}>
          <a href="#arch" className={styles.navLogo}>
            SKILL<span>.md</span> — 中級者ガイド
          </a>
          <div className={styles.navLinks}>
            <a href="#arch" className={styles.navLink}>
              01 アーキテクチャ
            </a>
            <a href="#yaml" className={styles.navLink}>
              02 YAML
            </a>
            <a href="#instruction" className={styles.navLink}>
              03 インストラクション設計
            </a>
            <a href="#args" className={styles.navLink}>
              04 引数
            </a>
            <a href="#fork" className={styles.navLink}>
              05 Fork
            </a>
            <a href="#trigger" className={styles.navLink}>
              06 トリガーチューニング
            </a>
            <a href="#debug" className={styles.navLink}>
              07 デバッグ
            </a>
            <a href="#enterprise" className={styles.navLink}>
              08 Enterprise
            </a>
            <a href="#self" className={styles.navLink}>
              09 自己改善型スキル
            </a>
          </div>
        </div>
      </nav>

      <div className={styles.wrapper}>
        {/* ── Hero ── */}
        <div className={styles.hero}>
          <div className={styles.heroBadge}>Claude Code v2.1.x 対応 — 2026年3月最終更新</div>
          <h1>
            SKILL.md
            <br />
            中級者完全攻略ガイド
          </h1>
          <p className={styles.heroSub}>
            プログレッシブ・ディスクロージャー、トークン経済、動的コンテキスト注入、
            <code>context: fork</code>、<br />
            エンタープライズプロビジョニングまで網羅した実践リファレンス
          </p>
          <div className={styles.heroMeta}>
            <div className={styles.heroMetaItem}>
              対象 <span>中級〜上級エンジニア</span>
            </div>
            <div className={styles.heroMetaItem}>
              難易度 <span>★★★☆☆</span>
            </div>
            <div className={styles.heroMetaItem}>
              推定読了 <span>25〜35 分</span>
            </div>
          </div>
        </div>

        {/* ── TOC ── */}
        <div className={styles.toc}>
          <div className={styles.tocTitle}>{"// 目次"}</div>
          <div className={styles.tocGrid}>
            <a href="#arch" className={styles.tocItem}>
              <span className={styles.tocNum}>01</span>
              3層アーキテクチャとトークン経済
            </a>
            <a href="#yaml" className={styles.tocItem}>
              <span className={styles.tocNum}>02</span>
              YAMLフロントマター全フィールド詳解
            </a>
            <a href="#instruction" className={styles.tocItem}>
              <span className={styles.tocNum}>03</span>
              インストラクション設計パターン
            </a>
            <a href="#args" className={styles.tocItem}>
              <span className={styles.tocNum}>04</span>
              動的コンテキスト・引数処理
            </a>
            <a href="#fork" className={styles.tocItem}>
              <span className={styles.tocNum}>05</span>
              {"context:fork vs Subagents"}
            </a>
            <a href="#trigger" className={styles.tocItem}>
              <span className={styles.tocNum}>06</span>
              トリガーチューニング戦略
            </a>
            <a href="#debug" className={styles.tocItem}>
              <span className={styles.tocNum}>07</span>
              デバッグ・CLIフラグ完全表
            </a>
            <a href="#enterprise" className={styles.tocItem}>
              <span className={styles.tocNum}>08</span>
              Enterpriseプロビジョニング
            </a>
            <a href="#self" className={styles.tocItem}>
              <span className={styles.tocNum}>09</span>
              自己改善型スキルパターン
            </a>
          </div>
        </div>

        {/* ── Section 01: arch ── */}
        <div className={styles.sec} id="arch">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 01</div>
            <h2>3層アーキテクチャとトークン経済</h2>
            <div className={styles.secLine} />
          </div>
          <p>
            SKILL.md が単なる「プロンプトの保存場所」と異なる最大の理由は、
            <strong>プログレッシブ・ディスクロージャー（段階的開示）</strong>
            アーキテクチャを採用している点にある。大規模言語モデルはコンテキストウィンドウに詰め込まれた情報全体にアテンションを割り当てるため、不要な情報はノイズとなり推論精度を下げる。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={`graph TB
subgraph L1["Level 1 - 常時ロード 約100 tokens/skill"]
M1["YAMLフロントマター<br>name と description のみ<br>全スキルをインデックス登録"]
end
subgraph L2["Level 2 - トリガー時ロード 約5000 tokens"]
M2["SKILL.md 本文<br>手順 ルール<br>出力フォーマット<br>推奨 500行未満"]
end
subgraph L3["Level 3 - オンデマンドロード<br>無制限"]
M3["外部スクリプト / references<br>実行結果のみコンテキストへ返却"]
end
U(["ユーザーリクエスト"]) --> A{"説明文と照合"}
A -- 一致 --> L2
L2 --> L3
L1 -- 起動時インデックス --> A
style L1 fill:#1a3a5c,stroke:#63b3ed,color:#ffffff
style L2 fill:#1a4040,stroke:#4fd1c5,color:#ffffff
style L3 fill:#2d1f4a,stroke:#b794f4,color:#ffffff`}
            />
          </div>
          <h3>各レベルの定量比較 — スキル数とトークン消費量</h3>
          <div className={styles.chartWrap}>
            <div className={styles.chartTitle}>スキル数とトークン消費量の関係 (単位: K tokens)</div>
            <div className={styles.chartLegend}>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "var(--cyan)" }} />
                Level 1のみ（SKILL.md方式）
              </span>
              <span className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ background: "var(--red)", opacity: 0.7 }}
                />
                従来の一括ロード方式
              </span>
            </div>
            <div className={styles.barChart}>
              <div className={styles.barYLabels}>
                <span>100K</span>
                <span>75K</span>
                <span>50K</span>
                <span>25K</span>
                <span>0</span>
              </div>
              <div className={styles.barArea}>
                <div
                  className={styles.baselineLine}
                  style={{ bottom: "55%" }}
                  title="従来方式: 常に55K以上"
                >
                  <span className={styles.baselineLabel}>従来方式 55K（固定）</span>
                </div>
                <div className={styles.bars}>
                  <div className={styles.barGroup}>
                    <div className={styles.barStack}>
                      <div
                        className={`${styles.barFill} ${styles.barNew}`}
                        style={{ height: "1%" }}
                        title="1K tokens"
                      />
                    </div>
                    <div className={styles.barLabel}>
                      10スキル
                      <br />
                      <span className={styles.barVal}>〜1K</span>
                    </div>
                  </div>
                  <div className={styles.barGroup}>
                    <div className={styles.barStack}>
                      <div
                        className={`${styles.barFill} ${styles.barNew}`}
                        style={{ height: "5%" }}
                        title="5K tokens"
                      />
                    </div>
                    <div className={styles.barLabel}>
                      50スキル
                      <br />
                      <span className={styles.barVal}>〜5K</span>
                    </div>
                  </div>
                  <div className={styles.barGroup}>
                    <div className={styles.barStack}>
                      <div
                        className={`${styles.barFill} ${styles.barNew}`}
                        style={{ height: "10%" }}
                        title="10K tokens"
                      />
                    </div>
                    <div className={styles.barLabel}>
                      100スキル
                      <br />
                      <span className={styles.barVal}>〜10K</span>
                    </div>
                  </div>
                  <div className={styles.barGroup}>
                    <div className={styles.barStack}>
                      <div
                        className={`${styles.barFill} ${styles.barNew}`}
                        style={{ height: "20%" }}
                        title="20K tokens"
                      />
                    </div>
                    <div className={styles.barLabel}>
                      200スキル
                      <br />
                      <span className={styles.barVal}>〜20K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <span className={styles.calloutIcon}>💡</span>
            <strong>ポイント：</strong>Level
            1のみの消費（シアンの棒）は200スキルでも20Kトークン程度。従来方式（赤の破線）では55K以上を
            <strong>常時</strong>消費し続ける。これがスケーラビリティの本質。
          </div>
          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span className={styles.dotBlue}>◆</span> Level 1 — メタデータ
              </div>
              <p style={{ fontSize: "13px" }}>
                セッション開始時に全スキルの <code>name</code> と <code>description</code>{" "}
                のみをインデックスへ登録。<strong>1スキルあたり約100トークン</strong>のみ消費。
              </p>
              <div className={`${styles.tag} ${styles.tagBlue}`}>常時ロード</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span className={styles.dotCyan}>◆</span> Level 2 — インストラクション
              </div>
              <p style={{ fontSize: "13px" }}>
                トリガー判定が通過した瞬間に <code>SKILL.md</code> 本文を展開。公式推奨は
                <strong>500行（約5,000トークン）未満</strong>。
              </p>
              <div className={`${styles.tag} ${styles.tagCyan}`}>トリガー時</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span className={styles.dotPurple}>◆</span> Level 3 — リソース
              </div>
              <p style={{ fontSize: "13px" }}>
                外部スクリプト・参照ドキュメントはエージェントが必要と判断した時のみ読み込み。スクリプトは
                <strong>実行結果のみ</strong>を返却。
              </p>
              <div className={`${styles.tag} ${styles.tagPurple}`}>オンデマンド</div>
            </div>
          </div>
          <h3>実行シーケンス</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={`sequenceDiagram
participant U as ユーザー
participant CC as Claude Code
participant L1 as L1 YAML Meta
participant L2 as L2 SKILL.md
participant L3 as L3 Scripts

Note over CC,L1: セッション初期化フェーズ
CC->>L1: 全スキルをスキャン
L1-->>CC: name+description のみ登録 100tokens/skill
U->>CC: READMEを作成してほしい

Note over CC: 推論フェーズ description と意図を照合
CC->>L2: readme-writer SKILL.md を読み込み
L2-->>CC: 手順書全文をコンテキストへ展開
CC->>L3: references/style.md を要求
L3-->>CC: スタイルガイドラインを返却
CC->>L3: scripts/validate.sh を実行
L3-->>CC: 実行結果のみを返却
CC-->>U: ガイドラインに準拠したREADME`}
            />
          </div>
        </div>

        {/* ── Section 02: yaml ── */}
        <div className={styles.sec} id="yaml">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 02</div>
            <h2>YAMLフロントマター — 全フィールド詳解</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s02 */}
        </div>

        {/* ── Section 03: instruction ── */}
        <div className={styles.sec} id="instruction">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 03</div>
            <h2>インストラクション設計 — 自由度のコントロール</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s03 */}
        </div>

        {/* ── Section 04: args ── */}
        <div className={styles.sec} id="args">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 04</div>
            <h2>動的コンテキスト注入 &amp; 引数処理メカニズム</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s04 */}
        </div>

        {/* ── Section 05: fork ── */}
        <div className={styles.sec} id="fork">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 05</div>
            <h2>{"context:fork vs カスタムSubagents — 境界線を引く"}</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s05 */}
        </div>

        {/* ── Section 06: trigger ── */}
        <div className={styles.sec} id="trigger">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 06</div>
            <h2>トリガーチューニング戦略</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s06 */}
        </div>

        {/* ── Section 07: debug ── */}
        <div className={styles.sec} id="debug">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 07</div>
            <h2>デバッグ技術 — CLI フラグ完全リファレンス</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s07 */}
        </div>

        {/* ── Section 08: enterprise ── */}
        <div className={styles.sec} id="enterprise">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 08</div>
            <h2>Enterpriseプロビジョニング — 組織全体への展開</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s08 */}
        </div>

        {/* ── Section 09: self ── */}
        <div className={styles.sec} id="self">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 09</div>
            <h2>自己改善型スキル — 最先端パターン</h2>
            <div className={styles.secLine} />
          </div>
          {/* faithful content: D-2 Green s09 */}
        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <p>Claude Code SKILL.md 中級者完全攻略ガイド</p>
          <p style={{ marginTop: "6px", fontSize: "12px" }}>
            Claude Code v2.1.x 対応 ｜ 2026年3月更新
          </p>
          <p style={{ marginTop: "12px", fontSize: "11px", color: "var(--text3)" }}>
            参考:{" "}
            <a
              href="https://code.claude.com/docs/en/skills"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--blue)", textDecoration: "none" }}
            >
              code.claude.com/docs/en/skills
            </a>
            {" ｜ "}
            <a
              href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--blue)", textDecoration: "none" }}
            >
              Agent Skills Overview
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
