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
          <p>
            YAMLフロントマターは、エージェントのスキル選択ロジック全体の
            <strong>唯一の手がかり</strong>
            となる。各フィールドの仕様と制約を正確に理解することが、信頼性の高いスキル構築の前提となる。
          </p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <div className={styles.codeDots}>
                <div className={styles.codeDot} />
                <div className={styles.codeDot} />
                <div className={styles.codeDot} />
              </div>
              <span className={styles.codeLang}>YAML — フロントマター完全例</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cc}>---</span>
              {"\n"}
              <span className={styles.cm}>name</span>
              {": "}
              <span className={styles.cs}>security-audit</span>
              {"               "}
              <span className={styles.cc}># ⚠️ 最大64文字。小文字英数字とハイフンのみ</span>
              {"\n"}
              <span className={styles.cm}>description</span>
              {": "}
              <span className={styles.cs}>{">"}</span>
              {"                          "}
              <span className={styles.cc}># ⚠️ 最大1024文字。三人称視点で記述</span>
              {"\n"}
              {"  "}
              <span className={styles.cs}>プロジェクト全体のセキュリティ監査を行う。</span>
              {"\n"}
              {"  "}
              <span className={styles.cs}>「セキュリティをチェックして」「脆弱性を探して」</span>
              {"\n"}
              {"  "}
              <span className={styles.cs}>「OWASP Top 10 で確認して」といった発話で使用する。</span>
              {"\n"}
              {"  "}
              <span className={styles.cs}>Pull Request のレビュー前にも自動で使用すること。</span>
              {"\n"}
              <span className={styles.cm}>allowed-tools</span>
              {":                       "}
              <span className={styles.cc}># 使用可能ツールをホワイトリスト制限</span>
              {"\n"}
              {"  - "}
              <span className={styles.cs}>Read</span>
              {"\n"}
              {"  - "}
              <span className={styles.cs}>Grep</span>
              {"\n"}
              {"  - "}
              <span className={styles.cs}>Glob</span>
              {"\n"}
              <span className={styles.cm}>invocation</span>
              {": "}
              <span className={styles.cs}>automatic</span>
              {"                "}
              <span className={styles.cc}># automatic(デフォルト) | explicit</span>
              {"\n"}
              <span className={styles.cm}>disable-model-invocation</span>
              {": "}
              <span className={styles.cv}>false</span>
              {"      "}
              <span className={styles.cc}># true にすると /コマンドのみ実行可</span>
              {"\n"}
              <span className={styles.cm}>context</span>
              {": "}
              <span className={styles.cs}>fork</span>
              {"                        "}
              <span className={styles.cc}># fork | inherit（省略でinherit）</span>
              {"\n"}
              <span className={styles.cm}>agent</span>
              {": "}
              <span className={styles.cs}>Explore</span>
              {"                       "}
              <span className={styles.cc}># general-purpose | Explore | Plan</span>
              {"\n"}
              <span className={styles.cm}>dependencies</span>
              {":                        "}
              <span className={styles.cc}># 必要パッケージ（オプション）</span>
              {"\n"}
              {"  - "}
              <span className={styles.cs}>{"python>=3.8"}</span>
              {"\n"}
              <span className={styles.cc}>---</span>
            </div>
          </div>
          <h3>フィールド仕様一覧</h3>
          <div className={styles.fieldCard}>
            <div className={styles.fieldName}>
              <code>name</code> <span className={styles.fieldRequired}>必須</span>
            </div>
            <div className={styles.fieldConstraint}>
              最大64文字 | 文字種: [a-z0-9-] | 予約語禁止: anthropic, claude
            </div>
            <div className={styles.fieldDesc}>
              スラッシュコマンドの名前になる（<code>/security-audit</code>）。命名規則は
              <strong>動名詞パターン</strong>（<code>processing-pdfs</code>,{" "}
              <code>reviewing-code</code>）が公式推奨。
            </div>
          </div>
          <div className={styles.fieldCard}>
            <div className={styles.fieldName}>
              <code>description</code> <span className={styles.fieldRequired}>必須</span>
            </div>
            <div className={styles.fieldConstraint}>
              最大1024文字 | XMLタグ禁止 | 三人称視点で記述
            </div>
            <div className={styles.fieldDesc}>
              エージェントが「いつこのスキルを起動すべきか」を判断する<strong>唯一の情報源</strong>
              。実行する内容だけでなく、具体的なトリガーキーワードや状況を詳細に含めること。エージェントは「やや起動したがらない」傾向があるため、やや強引に書くことが推奨される。
            </div>
          </div>
          <div className={styles.fieldCard}>
            <div className={styles.fieldName}>
              <code>allowed-tools</code> <span className={styles.fieldOptional}>任意</span>
            </div>
            <div className={styles.fieldConstraint}>配列形式 | 省略すると全ツールが使用可</div>
            <div className={styles.fieldDesc}>
              スキル実行中にエージェントがアクセスできるツールを制限するホワイトリスト。読み取り専用スキルには
              <code>[Read, Grep, Glob]</code> のみ許可するセーフモードが推奨される。
            </div>
          </div>
          <div className={styles.fieldCard}>
            <div className={styles.fieldName}>
              <code>disable-model-invocation</code>{" "}
              <span className={styles.fieldOptional}>任意</span>
            </div>
            <div className={styles.fieldConstraint}>boolean | デフォルト: false</div>
            <div className={styles.fieldDesc}>
              <code>true</code> にすると Claude の自動判断による起動を完全に無効化し、ユーザーが{" "}
              <code>/スキル名</code>
              と明示的に入力した場合のみ実行される。本番デプロイ等の<strong>破壊的操作</strong>
              を持つスキルに必須。
            </div>
          </div>
          <div className={styles.fieldCard}>
            <div className={styles.fieldName}>
              <code>context</code> <span className={styles.fieldOptional}>任意</span>
            </div>
            <div className={styles.fieldConstraint}>inherit（デフォルト） | fork</div>
            <div className={styles.fieldDesc}>
              <code>fork</code>
              にすると、メインの会話コンテキストとは独立した環境でタスクを実行。詳細は Section 05
              で解説。
            </div>
          </div>
          <div className={styles.fieldCard}>
            <div className={styles.fieldName}>
              <code>agent</code> <span className={styles.fieldOptional}>任意</span>
            </div>
            <div className={styles.fieldConstraint}>general-purpose | Explore | Plan</div>
            <div className={styles.fieldDesc}>
              <code>context: fork</code>
              使用時に、起動するサブエージェントの種類を指定。コードベース探索には{" "}
              <code>Explore</code>
              、計画策定には <code>Plan</code>、汎用タスクには <code>general-purpose</code>。
            </div>
          </div>
          <div className={styles.fieldCard}>
            <div className={styles.fieldName}>
              <code>dependencies</code> <span className={styles.fieldOptional}>任意</span>
            </div>
            <div className={styles.fieldConstraint}>配列形式 | semver対応</div>
            <div className={styles.fieldDesc}>
              スキルの実行に必要なソフトウェアパッケージを明示する。エンタープライズ展開時の依存関係管理に活用できる。
            </div>
          </div>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={`graph LR
A["invocation: automatic<br>Claudeが自動判断"] --> C{"実行判定"}
B["disable-model-invocation: true<br>手動コマンドのみ"] --> C
C --> D["context: inherit<br>メイン会話に統合"]
C --> E["context: fork<br>独立したサブコンテキスト"]
E --> F["agent: general-purpose"]
E --> G["agent: Explore<br>コードベース探索特化"]
E --> H["agent: Plan<br>計画策定特化"]
style A fill:#1a4040,stroke:#4fd1c5,color:#ffffff
style B fill:#4a1a1a,stroke:#fc8181,color:#ffffff
style D fill:#1a3a5c,stroke:#63b3ed,color:#ffffff
style E fill:#2d1f4a,stroke:#b794f4,color:#ffffff`}
            />
          </div>
        </div>

        {/* ── Section 03: instruction ── */}
        <div className={styles.sec} id="instruction">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 03</div>
            <h2>インストラクション設計 — 自由度のコントロール</h2>
            <div className={styles.secLine} />
          </div>
          <p>
            インストラクション本文の設計において最も重要な原則は、タスクの特性に応じて
            <strong>エージェントへの裁量の幅（自由度）</strong>を適切にコントロールすることだ。
          </p>
          <div className={styles.quadrantWrap}>
            <div
              className={styles.chartTitle}
              style={{ textAlign: "center", marginBottom: "16px" }}
            >
              エージェント自由度 vs タスクの破壊性（リスク）
            </div>
            <div className={styles.quadrantContainer}>
              <div className={`${styles.quadBg} ${styles.quadTl}`}>
                <span>
                  推奨: 厳密手順
                  <br />+ ガードレール
                </span>
              </div>
              <div className={`${styles.quadBg} ${styles.quadTr}`}>
                <span>
                  ⚠️ 危険ゾーン
                  <br />
                  （避けるべき）
                </span>
              </div>
              <div className={`${styles.quadBg} ${styles.quadBl}`}>
                <span>
                  ✅ OK
                  <br />
                  ガイドラインで十分
                </span>
              </div>
              <div className={`${styles.quadBg} ${styles.quadBr}`}>
                <span>
                  ✅ 最適
                  <br />
                  高い自由度を活用
                </span>
              </div>
              <div className={styles.quadAxisXLeft}>← 低い自由度（厳密手順）</div>
              <div className={styles.quadAxisXRight}>高い自由度（ガイドライン）→</div>
              <div className={styles.quadAxisYTop}>高リスク ↑</div>
              <div className={styles.quadAxisYBottom}>↓ 低リスク</div>
              <div
                className={styles.quadDot}
                role="img"
                aria-label="DBマイグレーション"
                style={{ left: "15%", top: "10%", background: "var(--red)", color: "var(--red)" }}
                data-label="DBマイグレーション"
                data-color="var(--accent-red)"
              />
              <div
                className={styles.quadDot}
                role="img"
                aria-label="本番デプロイ"
                style={{ left: "15%", top: "18%", background: "var(--red)", color: "var(--red)" }}
                data-label="本番デプロイ"
                data-color="var(--accent-red)"
              />
              <div
                className={styles.quadDot}
                role="img"
                aria-label="セキュリティスキャン"
                style={{
                  left: "50%",
                  top: "43%",
                  background: "var(--orange)",
                  color: "var(--orange)",
                }}
                data-label="セキュリティスキャン"
                data-color="var(--accent-orange)"
              />
              <div
                className={styles.quadDot}
                role="img"
                aria-label="コードレビュー"
                style={{ left: "70%", top: "72%", background: "var(--cyan)", color: "var(--cyan)" }}
                data-label="コードレビュー"
                data-color="var(--accent-cyan)"
              />
              <div
                className={styles.quadDot}
                role="img"
                aria-label="テキスト要約"
                style={{
                  left: "85%",
                  top: "78%",
                  background: "var(--green)",
                  color: "var(--green)",
                }}
                data-label="テキスト要約"
                data-color="var(--accent-green)"
              />
              <div
                className={styles.quadDot}
                role="img"
                aria-label="READMEアップデート"
                style={{
                  left: "78%",
                  top: "75%",
                  background: "var(--green)",
                  color: "var(--green)",
                }}
                data-label="READMEアップデート"
                data-color="var(--accent-green)"
              />
            </div>
            <div className={styles.quadLegend}>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "var(--red)" }} />
                Low Freedom 必須
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "var(--orange)" }} />
                Medium Freedom
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "var(--cyan)" }} />
                High Freedom 推奨
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: "var(--green)" }} />
                High Freedom 最適
              </span>
            </div>
          </div>
          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span className={`${styles.tag} ${styles.tagGreen}`}>High Freedom</span>
              </div>
              <p style={{ fontSize: "13px" }}>
                テキスト要約・コードレビューなど、複数のアプローチが許容されるタスク。
                <strong>高レベルなガイドライン</strong>
                を与え、エージェントの推論能力を最大活用。
              </p>
              <div style={{ fontSize: "12px", color: "var(--text3)" }}>
                → 「〇〇の観点でレビューせよ」
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span className={`${styles.tag} ${styles.tagOrange}`}>Medium Freedom</span>
              </div>
              <p style={{ fontSize: "13px" }}>
                定型レポート生成など、好ましいフォーマットが存在するタスク。
                <strong>テンプレートやパラメータ化された擬似コード</strong>を提供。
              </p>
              <div style={{ fontSize: "12px", color: "var(--text3)" }}>
                → 出力テンプレートを明示する
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span className={`${styles.tag} ${styles.tagRed}`}>Low Freedom</span>
              </div>
              <p style={{ fontSize: "13px" }}>
                DBマイグレーション・本番デプロイなど、わずかなミスが致命的なタスク。
                <strong>判断の余地を一切与えず</strong>、厳密な手順書と検証ガードレールのみ。
              </p>
              <div style={{ fontSize: "12px", color: "var(--text3)" }}>
                → スクリプトと検証ステップを明示
              </div>
            </div>
          </div>
          <h3>ファイル参照の設計ルール</h3>
          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <span className={styles.calloutIcon}>⚠️</span>
            <strong>重要：</strong>外部ファイル参照は必ず「1階層（One level deep）」に留めること。
            <code>SKILL.md → A.md → B.md</code>
            のような深いネスト構造は、エージェントのプレビュー読み込み時に情報が不完全になるリスクを生む。
          </div>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={`graph TD
S["SKILL.md<br>本文 500行未満"] --> R1["references/api-spec.md<br>詳細なAPI仕様"]
S --> R2["references/style-guide.md<br>コーディング規約"]
S --> SC["scripts/validate.sh<br>検証スクリプト"]
R1 -. NG ネスト禁止 .-> R3["references/detail/deep.md"]
R2 -. NG ネスト禁止 .-> R4["references/sub/more.md"]
style S fill:#1a4040,stroke:#4fd1c5,color:#ffffff
style R1 fill:#1a3a5c,stroke:#63b3ed,color:#ffffff
style R2 fill:#1a3a5c,stroke:#63b3ed,color:#ffffff
style SC fill:#2d1f4a,stroke:#b794f4,color:#ffffff
style R3 fill:#4a1a1a,stroke:#fc8181,color:#ffffff
style R4 fill:#4a1a1a,stroke:#fc8181,color:#ffffff`}
            />
          </div>
          <h3>推奨ファイル構造（完全形）</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <div className={styles.codeDots}>
                <div className={styles.codeDot} />
                <div className={styles.codeDot} />
                <div className={styles.codeDot} />
              </div>
              <span className={styles.codeLang}>Directory Structure</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cs}>{"~/.claude/skills/security-audit/"}</span>
              {"\n"}
              <span className={styles.cc}>{"├── SKILL.md              ← 本体（500行未満）"}</span>
              {"\n"}
              <span className={styles.cc}>{"├── references/"}</span>
              {"\n"}
              <span className={styles.cc}>{"│   ├── owasp-top10.md    ← 参照資料（TOC必須）"}</span>
              {"\n"}
              <span className={styles.cc}>{"│   └── severity-matrix.md"}</span>
              {"\n"}
              <span className={styles.cc}>{"└── scripts/"}</span>
              {"\n"}
              <span className={styles.cc}>
                {"    ├── scan.sh           ← Claudeが実行するスクリプト"}
              </span>
              {"\n"}
              <span className={styles.cc}>{"    └── report.py         ← レポート生成"}</span>
            </div>
          </div>
          <div className={`${styles.callout} ${styles.calloutTip}`}>
            <span className={styles.calloutIcon}>✅</span>
            100行を超える参照ファイルには、ファイル冒頭に<strong>目次（TOC）</strong>
            を設置すること。エージェントがファイル全体のスコープを正確に把握できるようになる。
          </div>
        </div>

        {/* ── Section 04: args ── */}
        <div className={styles.sec} id="args">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 04</div>
            <h2>動的コンテキスト注入 &amp; 引数処理メカニズム</h2>
            <div className={styles.secLine} />
          </div>
          <p>
            SKILL.md
            は静的なドキュメントではない。ユーザーからの引数を受け取り、実行前にシステムの最新状態をシェルスクリプトで取得する
            <strong>動的な実行基盤</strong>として機能する。
          </p>
          <h3>引数処理の3パターン</h3>
          <div className={styles.steps}>
            <div className={styles.step} data-n="1">
              <div className={styles.stepTitle}>$ARGUMENTS — 全引数を一括受け取り</div>
              <p>
                ユーザーが <code>/skill-name src/main.py</code> と入力した際、
                <code>src/main.py</code> の文字列が <code>$ARGUMENTS</code> として展開される。
              </p>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <div className={styles.codeDots}>
                    <div className={styles.codeDot} />
                    <div className={styles.codeDot} />
                    <div className={styles.codeDot} />
                  </div>
                  <span className={styles.codeLang}>SKILL.md — $ARGUMENTS 使用例</span>
                </div>
                <div className={styles.codeBody}>
                  <span className={styles.ch}>{"## 解析対象ファイル"}</span>
                  {"\n\n"}
                  {"ユーザーが指定したファイルを解析せよ: "}
                  <span className={styles.cTag}>{"$ARGUMENTS"}</span>
                  {"\n\n"}
                  {"指定がない場合は現在のディレクトリ全体を対象とする。"}
                </div>
              </div>
            </div>
            <div className={styles.step} data-n="2">
              <div className={styles.stepTitle}>$1, $2, $3 — 位置パラメータで個別受け取り</div>
              <p>複数の引数を個別に処理したい場合に使用。シェルスクリプトと同様の記法。</p>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <div className={styles.codeDots}>
                    <div className={styles.codeDot} />
                    <div className={styles.codeDot} />
                    <div className={styles.codeDot} />
                  </div>
                  <span className={styles.codeLang}>SKILL.md — 位置パラメータ使用例</span>
                </div>
                <div className={styles.codeBody}>
                  <span className={styles.cc}>{"# 呼び出し例: /deploy production v2.1.3"}</span>
                  {"\n\n"}
                  <span className={styles.ch}>{"## デプロイ設定"}</span>
                  {"\n\n"}
                  {"- 対象環境: "}
                  <span className={styles.cTag}>{"$1"}</span>
                  {"       "}
                  <span className={styles.cc}>{"# production"}</span>
                  {"\n"}
                  {"- バージョン: "}
                  <span className={styles.cTag}>{"$2"}</span>
                  {"      "}
                  <span className={styles.cc}>{"# v2.1.3"}</span>
                  {"\n"}
                  {"- 追加オプション: "}
                  <span className={styles.cTag}>{"$3"}</span>
                  {"   "}
                  <span className={styles.cc}>{"# （未指定の場合は空）"}</span>
                </div>
              </div>
            </div>
            <div className={styles.step} data-n="3">
              <div className={styles.stepTitle}>
                {"! `command` — 動的コンテキスト事前注入（最強）"}
              </div>
              <p>
                これが最も強力なメカニズム。感嘆符 +
                バッククォート構文を使うと、エージェントが本文を認識する
                <strong>前</strong>
                のプリプロセッシング段階でシェルコマンドが実行され、その結果が本文にレンダリングされる。
              </p>
              <div className={`${styles.callout} ${styles.calloutTip}`}>
                <span className={styles.calloutIcon}>⚡</span>
                エージェントへの「コマンドを実行して調べてください」という指示と、それに伴う推論ステップ・ツール呼び出しのレイテンシを
                <strong>完全に排除</strong>できる。
              </div>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <div className={styles.codeDots}>
                    <div className={styles.codeDot} />
                    <div className={styles.codeDot} />
                    <div className={styles.codeDot} />
                  </div>
                  <span className={styles.codeLang}>SKILL.md — 動的コンテキスト注入の完全例</span>
                </div>
                <div className={styles.codeBody}>
                  <span className={styles.ch}>
                    {"## 実行コンテキスト（プリプロセッシングで自動入力済み）"}
                  </span>
                  {"\n\n"}
                  <span className={styles.cc}>
                    {"# ↓ エージェントが読み込む前に実際のシステム情報に置換される"}
                  </span>
                  {"\n"}
                  {"現在のOS情報:\n"}
                  <span className={styles.cTag}>{"! `uname -a`"}</span>
                  {"\n\n"}
                  {"最新のGitコミット:\n"}
                  <span className={styles.cTag}>{"! `git log -1 --oneline`"}</span>
                  {"\n\n"}
                  {"現在のブランチ:\n"}
                  <span className={styles.cTag}>{"! `git branch --show-current`"}</span>
                  {"\n\n"}
                  {"解析対象: "}
                  <span className={styles.cTag}>{"$1"}</span>
                  {"\n\n"}
                  <span className={styles.cc}>
                    {"# ↑ エージェントはこの確定データに基づいて分析を開始する"}
                  </span>
                  {"\n"}
                  <span className={styles.cc}>
                    {"# 自らコマンドを実行して確認するステップが不要になる"}
                  </span>
                  {"\n\n"}
                  <span className={styles.ch}>{"## 指示"}</span>
                  {"\n\n"}
                  {"上記の確定したコンテキストを前提として、以下の分析を実施せよ..."}
                </div>
              </div>
            </div>
          </div>
          <h3>3パターンの比較</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={`graph LR
subgraph P1["ARGUMENTS - 全引数を一括受け取り"]
A1["ユーザー入力テキスト全体<br>シンプルな用途に最適"]
end
subgraph P2["位置引数 1 2 3 - 個別受け取り"]
A2["複数引数を個別に処理<br>順序が決まっている場合"]
end
subgraph P3["事前注入 - バッククォート構文"]
A3["システム状態を事前確定<br>推論ステップを省略<br>最高精度 最低レイテンシ"]
end
P1 -- 基本 --> P2
P2 -- 高度 --> P3
style P1 fill:#1a3a5c,stroke:#63b3ed,color:#ffffff
style P2 fill:#1a4040,stroke:#4fd1c5,color:#ffffff
style P3 fill:#2d1f4a,stroke:#b794f4,color:#ffffff`}
            />
          </div>
        </div>

        {/* ── Section 05: fork ── */}
        <div className={styles.sec} id="fork">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 05</div>
            <h2>{"context:fork vs カスタムSubagents — 境界線を引く"}</h2>
            <div className={styles.secLine} />
          </div>
          <p>
            「コンテキストを分離してタスクを実行する」という目的は共通だが、
            <strong>設計思想・予測可能性・デバッグ難易度</strong>
            が根本的に異なる。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={`sequenceDiagram
participant User as ユーザー
participant Main as メインコンテキスト
participant Fork as フォークコンテキスト

Note over User,Fork: context:fork パターン
User->>Main: /security-audit 実行
Main->>Fork: 現在のコンテキストをスナップショット
Note over Fork: SKILL.md の手順を実行
Fork-->>Main: 最終結果のみを返却
Note over Main: 途中経過は破棄 メインは汚染されない
Main-->>User: クリーンな監査レポート`}
            />
          </div>

          <h3>詳細比較表</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>比較項目</th>
                <th>context: fork を用いたスキル</th>
                <th>カスタムSubagents (.claude/agents/*.md)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>設計思想</td>
                <td>定義済みワークフローを安全に一時分離実行</td>
                <td>自律性の高いワークフローをゼロから定義・オーケストレーション</td>
              </tr>
              <tr>
                <td>タスク定義</td>
                <td>SKILL.md がそのまま指示書として機能</td>
                <td>メインがその都度「委譲メッセージ」を動的生成</td>
              </tr>
              <tr>
                <td>コンテキスト引き継ぎ</td>
                <td>親のスナップショットをそのまま引き継ぐ</td>
                <td>完全にクリーンな初期状態から開始</td>
              </tr>
              <tr>
                <td>予測可能性</td>
                <td>
                  <span className={styles.tagGreen}>高い</span>
                  {" — 入力・指示が固定"}
                </td>
                <td>
                  <span className={styles.tagOrange}>低い</span>
                  {" — 委譲メッセージが変化"}
                </td>
              </tr>
              <tr>
                <td>デバッグ難易度</td>
                <td>
                  <span className={styles.tagGreen}>容易</span>
                  {" — 原因究明が直線的"}
                </td>
                <td>
                  <span className={styles.tagRed}>困難</span>
                  {" — 挙動に揺らぎが出やすい"}
                </td>
              </tr>
              <tr>
                <td>柔軟性・自律性</td>
                <td>
                  <span className={styles.tagOrange}>低い</span>
                  {" — バッチ処理的"}
                </td>
                <td>
                  <span className={styles.tagGreen}>高い</span>
                  {" — 実行経路を動的に構築"}
                </td>
              </tr>
              <tr>
                <td>推奨ユースケース</td>
                <td>セキュリティ監査、ドキュメント生成、静的解析</td>
                <td>複雑な意思決定が必要な多段階タスク</td>
              </tr>
            </tbody>
          </table>

          <h3>使い分けのフローチャート</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={`flowchart TD
A["タスクの性質を評価"] --> B{"手順は固定されているか？"}
B -- Yes --> C{"メインのコンテキストを<br>汚染したくないか？"}
B -- No --> D{"複雑な自律判断が<br>必要か？"}
C -- Yes --> E["context: fork スキル<br>推奨 監査 分析 生成"]
C -- No --> F["context: inherit スキル<br>通常のインライン実行"]
D -- Yes --> G["カスタムSubagent<br>推奨 多段階タスク"]
D -- No --> H["通常のスキルで十分"]
style E fill:#1a4040,stroke:#4fd1c5,color:#ffffff
style G fill:#2d1f4a,stroke:#b794f4,color:#ffffff`}
            />
          </div>

          <h3>context:fork の実装例</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <div className={styles.codeDots}>
                <div className={styles.codeDot} />
                <div className={styles.codeDot} />
                <div className={styles.codeDot} />
              </div>
              <div className={styles.codeLang}>YAML — context:fork 設定</div>
            </div>
            <div className={styles.codeContent}>
              <pre>
                <span className={styles.cs}>{"---"}</span>
                {"\n"}
                <span className={styles.cm}>name</span>
                {": "}
                <span className={styles.cv}>security-audit</span>
                {"\n"}
                <span className={styles.cm}>description</span>
                {": "}
                <span className={styles.cv}>
                  プロジェクト全体のセキュリティ監査をバックグラウンドで実行する
                </span>
                {"\n"}
                <span className={styles.cm}>context</span>
                {": "}
                <span className={styles.cv}>fork</span>
                {"           "}
                <span className={styles.cc}>{"# ← メインコンテキストをスナップショット"}</span>
                {"\n"}
                <span className={styles.cm}>agent</span>
                {": "}
                <span className={styles.cv}>Explore</span>
                {"          "}
                <span className={styles.cc}>
                  {"# ← コードベース探索に特化したサブエージェント"}
                </span>
                {"\n"}
                <span className={styles.cm}>disable-model-invocation</span>
                {": "}
                <span className={styles.cs}>true</span>
                {"  "}
                <span className={styles.cc}>{"# ← 意図しない自動起動を防止"}</span>
                {"\n"}
                <span className={styles.cs}>{"---"}</span>
                {"\n\n"}
                <span className={styles.ch}>{"# セキュリティ監査プロセス"}</span>
                {"\n\n"}
                <span className={styles.cc}>
                  {"# このスキルは fork されたコンテキストで実行される"}
                </span>
                {"\n"}
                <span className={styles.cc}>
                  {"# すべての調査ログはメインに返さず、最終結果のみを返却する"}
                </span>
                {"\n\n"}
                {"現在のシステム情報: "}
                <span className={styles.ck}>{'! `git log --since="1 week ago" --oneline`'}</span>
                {"\n\n"}
                <span className={styles.ch}>{"## 監査手順"}</span>
                {"\n\n"}
                {"1. OWASP Top 10 の各カテゴリに従ってコードをスキャン"}
                {"\n"}
                {"2. `references/severity-matrix.md` に基づいて重大度を評価"}
                {"\n"}
                {"3. 検証スクリプトを実行: "}
                <span className={styles.ck}>{"! `scripts/scan.sh`"}</span>
                {"\n"}
                {"4. 結果を Markdown テーブル形式で返却する"}
              </pre>
            </div>
          </div>
        </div>

        {/* ── Section 06: trigger ── */}
        <div className={styles.sec} id="trigger">
          <div className={styles.secHeader}>
            <div className={styles.secNum}>SECTION 06</div>
            <h2>トリガーチューニング戦略</h2>
            <div className={styles.secLine} />
          </div>
          <p>
            スキルが期待通りにトリガーされないケースは大きく2種類に分類できる。それぞれに対して異なるアプローチが必要だ。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram
              chart={`graph TD
A["スキルのトリガー問題"] --> B["アンダートリガー<br>発動すべき状況で不発"]
A --> C["オーバートリガー<br>無関係な文脈で誤発動"]
B --> B1["原因: description が曖昧<br>語彙的な乖離"]
B --> B2["解決: トリガーキーワードを追加<br>同義語 専門用語を列挙"]
C --> C1["原因: description が広範すぎる<br>一般的すぎる単語"]
C --> C2["解決: 条件を絞り込む<br>ネガティブトリガーを追加"]
style B fill:#4a1a1a,stroke:#fc8181,color:#ffffff
style C fill:#3a2a00,stroke:#f6ad55,color:#ffffff
style B2 fill:#1a4040,stroke:#4fd1c5,color:#ffffff
style C2 fill:#1a4040,stroke:#4fd1c5,color:#ffffff`}
            />
          </div>

          <div className={styles.triggerGrid}>
            <div className={`${styles.triggerBox} ${styles.under}`}>
              <div className={styles.triggerType}>❌ アンダートリガー（不発）</div>
              <p style={{ fontSize: "13px" }}>
                本来スキルで処理すべき要求に対して、通常の推論のみで対処しようとし失敗する。ユーザーが手動で
                <code>/skill-name</code>
                を入力しなければならない状態。
              </p>
              <div className={`${styles.compareBox} ${styles.bad}`} style={{ marginTop: "10px" }}>
                <div className={styles.compareLabel}>❌ 悪い description</div>
                <p style={{ fontSize: "12px" }}>「デプロイメントのチェックリストを生成する」</p>
              </div>
              <div className={`${styles.compareBox} ${styles.good}`} style={{ marginTop: "10px" }}>
                <div className={styles.compareLabel}>✅ 改善後</div>
                <p style={{ fontSize: "12px" }}>
                  「デプロイメントのチェックリストを生成する。ユーザーが
                  <strong>
                    『デプロイ』『ローンチ』『本番環境へ反映』『リリースの準備ができたか』
                  </strong>
                  などに言及した場合、明示的にチェックリストを要求されていなくても、必ずこのスキルを自動で使用して検証プロセスを開始すること」
                </p>
              </div>
            </div>
            <div className={`${styles.triggerBox} ${styles.over}`}>
              <div className={styles.triggerType}>⚠️ オーバートリガー（誤発動）</div>
              <p style={{ fontSize: "13px" }}>
                全く関係のない質問に対して意図せずスキルが起動し、会話の文脈が破壊される。ユーザーがスキル自体を無効化してしまう原因になる。
              </p>
              <div className={`${styles.compareBox} ${styles.bad}`} style={{ marginTop: "10px" }}>
                <div className={styles.compareLabel}>❌ 悪い description</div>
                <p style={{ fontSize: "12px" }}>「コードに関することなら何でも使用する」</p>
              </div>
              <div className={`${styles.compareBox} ${styles.good}`} style={{ marginTop: "10px" }}>
                <div className={styles.compareLabel}>✅ 改善後（ネガティブトリガー追加）</div>
                <p style={{ fontSize: "12px" }}>
                  「...コードの
                  <strong>セキュリティ脆弱性</strong>
                  を調査するときに使用する。機能の説明や一般的なコーディング質問の場合は
                  <strong>使用しないこと</strong>」
                </p>
              </div>
            </div>
          </div>

          <h3>Description チューニングのベストプラクティス</h3>
          <div className={styles.card}>
            <ol style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              <li style={{ marginBottom: "10px" }}>
                実行する内容だけでなく、
                <strong>具体的なトリガーキーワード</strong>
                （ユーザーが自然言語で入力しそうな言葉）を列挙する
              </li>
              <li style={{ marginBottom: "10px" }}>
                関連する
                <strong>技術的専門用語の同義語</strong>
                を複数含める（例：「デプロイ」「ローンチ」「リリース」「本番反映」）
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>明示的に要求されなくても起動すべき状況</strong>
                を記述する（「〜に言及した場合は〜すること」）
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>ネガティブトリガー</strong>
                で誤発動を防ぐ（「〜の場合は使用しないこと」）
              </li>
              <li>
                エージェントはやや起動したがらない傾向のため、
                <strong>「やや強引」</strong>
                に記述することが推奨されている
              </li>
            </ol>
          </div>
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
