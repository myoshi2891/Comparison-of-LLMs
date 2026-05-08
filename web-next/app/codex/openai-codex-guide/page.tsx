import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "OpenAI Codex 完全ガイド 2026",
  description:
    "初学者から中級者まで。AIコーディングエージェントを最大限に活かすベストプラクティスをステップバイステップで解説します。",
};

export default function Page() {
  return (
    <div className={styles.wrap}>
      {/* PAGE HEADER */}
      <header className={styles.pageHeader}>
        <div className={styles.badge}>2026年3月 最新情報対応</div>
        <h1 className={styles.h1}>
          <span className={styles.h1Line1}>OpenAI Codex</span>
          <span className={styles.h1Line2}>完全ガイド</span>
        </h1>
        <p className={styles.subtitle}>
          初学者から中級者まで。AIコーディングエージェントを最大限に活かすベストプラクティスをステップバイステップで解説します。
        </p>
        <div className={styles.headerStats}>
          <div className={styles.stat}>
            <div className={styles.statVal}>30+</div>
            <div className={styles.statLabel}>対応言語</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statVal}>GPT-5.4</div>
            <div className={styles.statLabel}>最新モデル</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statVal}>1,050,000</div>
            <div className={styles.statLabel}>最大コンテキスト (tokens)</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statVal}>7</div>
            <div className={styles.statLabel}>学習ステップ</div>
          </div>
        </div>
      </header>

      <main>
        {/* SECTION 01: WHAT */}
        <section id="what" className={styles.sec}>
          <div className={styles.secHeader}>
            <div className={styles.stepNum}>0</div>
            <div>
              <h2 className={styles.secTitle}>OpenAI Codex とは何か？</h2>
              <p className={styles.secDesc}>まず全体像を把握しよう</p>
            </div>
          </div>

          <div className={styles.card}>
            <p style={{ color: "#94a3b8", fontSize: "15px", marginBottom: "20px" }}>
              OpenAI Codex は、
              <strong style={{ color: "#e2e8f0" }}>
                ソフトウェア開発に特化したAIコーディングエージェント
              </strong>
              です。2025年5月にクラウドエージェントとして登場し、2026年3月現在ではGPT-5.4を搭載した本番利用可能な開発インフラへと進化しています。単なるコード補完ではなく、
              <em style={{ color: "#00d4ff" }}>リポジトリ全体を理解・操作できるエージェント</em>
              です。
            </p>

            <div className={styles.cardGrid}>
              <div className={styles.innerCard}>
                <div className={styles.innerCardTitle} style={{ color: "#00d4ff" }}>
                  ✦ できること
                </div>
                <ul className={styles.checklist}>
                  <li>
                    <div className={styles.checkIcon}>✓</div>
                    機能追加・コード生成
                  </li>
                  <li>
                    <div className={styles.checkIcon}>✓</div>
                    バグ検出・修正
                  </li>
                  <li>
                    <div className={styles.checkIcon}>✓</div>
                    コードレビュー・説明
                  </li>
                  <li>
                    <div className={styles.checkIcon}>✓</div>
                    リファクタリング・テスト生成
                  </li>
                  <li>
                    <div className={styles.checkIcon}>✓</div>
                    PRの自動提案
                  </li>
                  <li>
                    <div className={styles.checkIcon}>✓</div>
                    大規模なコードベース探索
                  </li>
                </ul>
              </div>
              <div className={styles.innerCard}>
                <div className={styles.innerCardTitle} style={{ color: "#7c3aed" }}>
                  ✦ 利用方法 (3経路)
                </div>
                <div style={{ margin: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>🌐</span>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                          fontSize: "13px",
                          color: "#e2e8f0",
                        }}
                      >
                        Codex App (Web/Cloud)
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                        ブラウザから並列タスク実行
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>💻</span>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                          fontSize: "13px",
                          color: "#e2e8f0",
                        }}
                      >
                        Codex CLI (Terminal)
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                        ローカル環境でエージェント実行
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ fontSize: "20px" }}>🔧</span>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                          fontSize: "13px",
                          color: "#e2e8f0",
                        }}
                      >
                        IDE Extension
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>VS Code等に統合</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <div className={styles.calloutIcon}>💡</div>
              <div>
                <strong>プラン確認：</strong>
                <ul style={{ marginTop: "8px", marginLeft: "20px", fontSize: "13px" }}>
                  <li>
                    <strong>Plus:</strong> 週間リミットあり（例: 10〜25コードレビュー）
                  </li>
                  <li>
                    <strong>Pro:</strong> 週間リミットあり（例: 100〜250）
                  </li>
                  <li>
                    <strong>Business:</strong> プランに含まれるが、上限超過時はクレジット購入が必要
                  </li>
                  <li>
                    <strong>Enterprise:</strong> クレジットベースの利用（無制限利用の保証なし）
                  </li>
                </ul>
                <div style={{ marginTop: "8px", fontSize: "13px" }}>
                  ※ 上限超過時のAPI利用は、OpenAI APIレートやクレジット課金に従います。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: SETUP */}
        <section id="setup" className={styles.sec}>
          <div className={styles.secHeader}>
            <div className={styles.stepNum}>1</div>
            <div>
              <h2 className={styles.secTitle}>セットアップ</h2>
              <p className={styles.secDesc}>Codex CLI を5分でインストールする</p>
            </div>
          </div>

          <div className={styles.flow}>
            <div className={styles.flowItem}>
              <div className={styles.flowLine}>
                <div className={styles.flowDot}>1</div>
                <div className={styles.flowConnector} />
              </div>
              <div className={styles.flowContent}>
                <div className={styles.flowTitle}>Node.js のインストール確認</div>
                <div className={styles.flowDesc}>
                  Codex CLI は npm 経由でインストールします。まず Node.js が入っているか確認。
                </div>
                <div className={styles.codeWrap} style={{ marginTop: "12px" }}>
                  <div className={styles.codeHeader}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.codeDotR}`} />
                      <div className={`${styles.codeDot} ${styles.codeDotY}`} />
                      <div className={`${styles.codeDot} ${styles.codeDotG}`} />
                    </div>
                    <div className={styles.codeLang}>bash</div>
                  </div>
                  <pre className={styles.codeBody}>
                    <span className={styles.cm}># バージョン確認 (v18以上推奨)</span>
                    {"\n"}node --version{"\n"}npm --version
                  </pre>
                </div>
              </div>
            </div>

            <div className={styles.flowItem}>
              <div className={styles.flowLine}>
                <div className={styles.flowDot}>2</div>
                <div className={styles.flowConnector} />
              </div>
              <div className={styles.flowContent}>
                <div className={styles.flowTitle}>Codex CLI のインストール</div>
                <div className={styles.flowDesc}>
                  npm でグローバルインストールします。macOS/Linux で動作。Windows は WSL 推奨。
                </div>
                <div className={styles.codeWrap} style={{ marginTop: "12px" }}>
                  <div className={styles.codeHeader}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.codeDotR}`} />
                      <div className={`${styles.codeDot} ${styles.codeDotY}`} />
                      <div className={`${styles.codeDot} ${styles.codeDotG}`} />
                    </div>
                    <div className={styles.codeLang}>bash</div>
                  </div>
                  <pre className={styles.codeBody}>
                    <span className={styles.cm}># グローバルインストール</span>
                    {"\n"}
                    <span className={styles.fn}>npm</span> install{" "}
                    <span className={styles.op}>-g</span> @openai/codex{"\n\n"}
                    <span className={styles.cm}># または npx で直接実行 (インストール不要)</span>
                    {"\n"}
                    <span className={styles.fn}>npx</span> @openai/codex
                  </pre>
                </div>
              </div>
            </div>

            <div className={styles.flowItem}>
              <div className={styles.flowLine}>
                <div className={styles.flowDot}>3</div>
                <div className={styles.flowConnector} />
              </div>
              <div className={styles.flowContent}>
                <div className={styles.flowTitle}>認証 (初回サインイン)</div>
                <div className={styles.flowDesc}>
                  初回起動時に ChatGPT アカウントまたは API キーで認証します。
                </div>
                <div className={styles.codeWrap} style={{ marginTop: "12px" }}>
                  <div className={styles.codeHeader}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.codeDotR}`} />
                      <div className={`${styles.codeDot} ${styles.codeDotY}`} />
                      <div className={`${styles.codeDot} ${styles.codeDotG}`} />
                    </div>
                    <div className={styles.codeLang}>bash</div>
                  </div>
                  <pre className={styles.codeBody}>
                    <span className={styles.cm}>
                      # ターミナルを開いて実行 → ブラウザでサインインを促される
                    </span>
                    {"\n"}
                    <span className={styles.fn}>codex</span>
                    {"\n\n"}
                    <span className={styles.cm}># API キーで使う場合</span>
                    {"\n"}
                    <span className={styles.kw}>export</span>{" "}
                    <span className={styles.op}>OPENAI_API_KEY</span>=
                    <span className={styles.str}>&quot;sk-...&quot;</span>
                    {"\n"}
                    <span className={styles.fn}>codex</span>
                  </pre>
                </div>
              </div>
            </div>

            <div className={styles.flowItem}>
              <div className={styles.flowLine}>
                <div className={styles.flowDot}>4</div>
              </div>
              <div className={styles.flowContent}>
                <div className={styles.flowTitle}>バージョンアップデート</div>
                <div className={styles.flowDesc}>
                  定期的にリリースがあるので最新版を保つことが重要です。
                </div>
                <div className={styles.codeWrap} style={{ marginTop: "12px" }}>
                  <div className={styles.codeHeader}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.codeDotR}`} />
                      <div className={`${styles.codeDot} ${styles.codeDotY}`} />
                      <div className={`${styles.codeDot} ${styles.codeDotG}`} />
                    </div>
                    <div className={styles.codeLang}>bash</div>
                  </div>
                  <pre className={styles.codeBody}>
                    <span className={styles.cm}># 最新版に更新</span>
                    {"\n"}
                    <span className={styles.fn}>npm</span> update{" "}
                    <span className={styles.op}>-g</span> @openai/codex
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <div className={styles.calloutIcon}>⚠️</div>
            <div>
              <strong>Windows ユーザーへ：</strong>Windows
              のネイティブサポートは実験的段階です。最良の体験のためには
              <code
                style={{
                  fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                  background: "rgba(255,255,255,0.1)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                WSL (Windows Subsystem for Linux)
              </code>
              ワークスペースでの使用を強く推奨します。
            </div>
          </div>
        </section>

        {/* SECTION 03: MODELS */}
        <section id="models" className={styles.sec}>
          <div className={styles.secHeader}>
            <div className={styles.stepNum}>2</div>
            <div>
              <h2 className={styles.secTitle}>モデル選択</h2>
              <p className={styles.secDesc}>タスクに応じて最適なモデルを使い分ける</p>
            </div>
          </div>

          <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>
            2026年3月現在、代表的な推奨モデルは以下です。適切なモデル選択がコスト効率と品質に直結します。注:
            表示は主要な推奨モデルの例であり、他の利用可能なモデルも存在します。
          </p>

          <div className={styles.modelGrid}>
            <div className={`${styles.modelCard} ${styles.modelCardRecommended}`}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "6px",
                }}
              >
                <div className={styles.modelName}>gpt-5.4</div>
                <div className={`${styles.modelBadge} ${styles.modelBadgeNew}`}>★ 推奨</div>
              </div>
              <div className={styles.modelDesc}>
                コーディング・推論・エージェントワークフローを統合したフラッグシップモデル。GPT-5.3-Codexの業界最高のコード生成能力を内包。ほとんどのタスクはこちらから始めよう。
              </div>
            </div>
            <div className={styles.modelCard}>
              <div className={styles.modelName}>gpt-5.4-mini</div>
              <div className={styles.modelDesc}>
                軽量・高速版。CRUD操作、コード探索、大ファイルレビューなど軽めのタスク向け。gpt-5.4の30%のリソース消費なので長時間作業に最適。
              </div>
              <div className={`${styles.modelBadge} ${styles.modelBadgeNew}`}>2x速い・低コスト</div>
            </div>
            <div className={styles.modelCard}>
              <div className={styles.modelName}>gpt-5.3-codex-spark</div>
              <div className={styles.modelDesc}>
                リアルタイムコーディングに最適化した研究プレビューモデル。ほぼ即時のコードイテレーションが可能。ChatGPT
                Pro ユーザー向け。
              </div>
              <div className={`${styles.modelBadge} ${styles.modelBadgePro}`}>Pro限定</div>
            </div>
            <div className={styles.modelCard}>
              <div className={styles.modelName}>gpt-5.3-codex</div>
              <div className={styles.modelDesc}>
                コーディング特化モデルの前世代フラッグシップ。Responses API
                でも利用可能。GPT-5.4に後継されたが現在も有効。
              </div>
            </div>
          </div>

          <div className={styles.card} style={{ marginTop: "16px" }}>
            <div
              style={{
                fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                fontSize: "13px",
                color: "#00d4ff",
                marginBottom: "12px",
              }}
            >
              モデルの切り替え方法
            </div>
            <div className={styles.codeWrap}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <div className={`${styles.codeDot} ${styles.codeDotR}`} />
                  <div className={`${styles.codeDot} ${styles.codeDotY}`} />
                  <div className={`${styles.codeDot} ${styles.codeDotG}`} />
                </div>
                <div className={styles.codeLang}>bash / config</div>
              </div>
              <pre className={styles.codeBody}>
                <span className={styles.cm}># CLI起動時にモデル指定</span>
                {"\n"}
                <span className={styles.fn}>codex</span> <span className={styles.op}>-m</span>{" "}
                gpt-5.4{"\n\n"}
                <span className={styles.cm}># 実行中に /model コマンドで切り替え</span>
                {"\n"}
                <span className={styles.op}>/model</span> gpt-5.4-mini{"\n\n"}
                <span className={styles.cm}># config.toml で永続設定 (~/.codex/config.toml)</span>
                {"\n"}
                <span className={styles.fn}>model</span> ={" "}
                <span className={styles.str}>&quot;gpt-5.4&quot;</span>
                {"\n"}
                <span className={styles.cm}># オプション: レビュー専用モデル</span>
                {"\n"}
                <span className={styles.fn}>review_model</span> ={" "}
                <span className={styles.str}>&quot;gpt-5.4-mini&quot;</span>
              </pre>
            </div>
          </div>

          <div className={`${styles.callout} ${styles.calloutTip}`}>
            <div className={styles.calloutIcon}>💚</div>
            <div>
              <strong>使い分けの鉄則：</strong>複雑な設計・アーキテクチャ判断・最終レビューには
              <code style={{ fontFamily: "var(--font-mono,'JetBrains Mono',monospace)" }}>
                gpt-5.4
              </code>
              、コードベース探索・大量ファイルのレビュー・サブエージェントには
              <code style={{ fontFamily: "var(--font-mono,'JetBrains Mono',monospace)" }}>
                gpt-5.4-mini
              </code>
              を使うことでリソースを節約できます。
            </div>
          </div>
        </section>

        {/* SECTION 04: PROMPT */}
        <section id="prompt" className={styles.sec}>
          <div className={styles.secHeader}>
            <div className={styles.stepNum}>3</div>
            <div>
              <h2 className={styles.secTitle}>プロンプト設計のベストプラクティス</h2>
              <p className={styles.secDesc}>「何をしたいか」を正確に伝える4つの要素</p>
            </div>
          </div>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <div className={styles.calloutIcon}>ℹ️</div>
            <div>
              Codex は完璧なプロンプトがなくても動作しますが、
              <strong>明確なプロンプト = より信頼性の高い結果</strong>
              につながります。特に大規模コードベースでは効果絶大です。
            </div>
          </div>

          <div className={styles.card} style={{ marginTop: "16px" }}>
            <div
              style={{
                fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                fontSize: "13px",
                color: "#00d4ff",
                marginBottom: "16px",
              }}
            >
              ✦ 良いプロンプトの4要素（公式ガイドより）
            </div>
            <div className={styles.cardGrid}>
              <div className={styles.guideCard}>
                <div className={styles.guideIcon}>🎯</div>
                <div className={styles.guideTitle} style={{ color: "#00d4ff" }}>
                  1. コンテキスト (Context)
                </div>
                <div className={styles.guideBody}>
                  関連するファイル・フォルダ・ドキュメント・エラー情報を伝える。
                  <code className={styles.guideCode}>@filename</code>
                  でファイルをメンション可能。
                </div>
              </div>
              <div className={styles.guideCard}>
                <div className={styles.guideIcon}>📋</div>
                <div className={styles.guideTitle} style={{ color: "#7c3aed" }}>
                  2. タスク (Task)
                </div>
                <div className={styles.guideBody}>
                  何を実装・修正・説明してほしいかを具体的に書く。「なんとなく直して」より「〇〇という理由でXXを修正して」が効果的。
                </div>
              </div>
              <div className={styles.guideCard}>
                <div className={styles.guideIcon}>✅</div>
                <div className={styles.guideTitle} style={{ color: "#10b981" }}>
                  3. 完了条件 (Done criteria)
                </div>
                <div className={styles.guideBody}>
                  「何をもって成功とするか」を定義する。テストが通るか、特定の出力が得られるかなど。
                </div>
              </div>
              <div className={styles.guideCard}>
                <div className={styles.guideIcon}>🚧</div>
                <div className={styles.guideTitle} style={{ color: "#f59e0b" }}>
                  4. 制約 (Constraints)
                </div>
                <div className={styles.guideBody}>
                  やってほしくないこと・守るべきルールを明示。「既存のAPIを変更しない」「依存関係を増やさない」など。
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div
              style={{
                fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                fontSize: "13px",
                color: "#00d4ff",
                marginBottom: "12px",
              }}
            >
              ✦ 悪い例 vs 良い例
            </div>
            <div className={styles.tableWrap}>
              <table>
                <tbody>
                  <tr>
                    <th>❌ 悪い例</th>
                    <th>✅ 良い例</th>
                  </tr>
                  <tr>
                    <td style={{ color: "#ef4444" }}>「バグを直して」</td>
                    <td>
                      「
                      <code style={{ fontFamily: "var(--font-mono,'JetBrains Mono',monospace)" }}>
                        @src/auth.ts
                      </code>
                      の JWT
                      検証で、トークン期限切れ時に500エラーが返る問題を修正して。401を返すようにすること。既存のミドルウェア構造は変えないで。」
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "#ef4444" }}>「テスト書いて」</td>
                    <td>
                      「
                      <code style={{ fontFamily: "var(--font-mono,'JetBrains Mono',monospace)" }}>
                        @src/utils/parser.ts
                      </code>
                      のすべての公開関数にJestのユニットテストを追加して。境界値とエラーケースをカバーすること。既存のテストパターン
                      (
                      <code style={{ fontFamily: "var(--font-mono,'JetBrains Mono',monospace)" }}>
                        @tests/
                      </code>
                      ) に合わせて。」
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "#ef4444" }}>「レスポンシブにして」</td>
                    <td>
                      「
                      <code style={{ fontFamily: "var(--font-mono,'JetBrains Mono',monospace)" }}>
                        @components/Dashboard.tsx
                      </code>
                      をモバイル対応に。ブレークポイントは 768px。Tailwind
                      のみ使用。既存のデザインシステムのクラス名を変えないこと。」
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotR}`} />
                <div className={`${styles.codeDot} ${styles.codeDotY}`} />
                <div className={`${styles.codeDot} ${styles.codeDotG}`} />
              </div>
              <div className={styles.codeLang}>実践例：プロンプトテンプレート</div>
            </div>
            <pre className={styles.codeBody}>
              <span className={styles.cm}># コンテキスト</span>
              {"\n"}
              <span className={styles.str}>@src/api/users.ts</span> と{" "}
              <span className={styles.str}>@src/types/user.ts</span> を参照してください。{"\n"}
              {"Node.js + Express + TypeScript プロジェクトです。\n\n"}
              <span className={styles.cm}># タスク</span>
              {"\n"}
              {
                "ユーザー作成エンドポイント (POST /api/users) に\nメールアドレスの重複チェックを追加してください。\n\n"
              }
              <span className={styles.cm}># 完了条件</span>
              {"\n"}
              {"- 重複時は 409 Conflict を返す\n- "}
              <span className={styles.fn}>npm test</span>
              {" が通ること\n\n"}
              <span className={styles.cm}># 制約</span>
              {"\n"}
              {"- データベーススキーマは変更しない\n- 新しい依存パッケージを追加しない"}
            </pre>
          </div>
        </section>

        {/* SECTION 05: AGENTS-MD */}
        <section id="agents-md" className={styles.sec}>
          <div className={styles.secHeader}>
            <div className={styles.stepNum}>4</div>
            <div>
              <h2 className={styles.secTitle}>AGENTS.md の活用</h2>
              <p className={styles.secDesc}>
                Codexにプロジェクトのルールを「記憶」させる最強の方法
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "20px" }}>
              <strong style={{ color: "#e2e8f0" }}>AGENTS.md</strong> は README.md
              のようなテキストファイルです。リポジトリのルートや特定ディレクトリに配置することで、Codex
              がタスク開始前に自動的に読み込みます。「毎回プロンプトに書くルール」を一度定義すれば、以後すべてのタスクに適用されます。
            </p>

            <div
              style={{
                background: "#131c35",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid rgba(0,212,255,0.15)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "8px",
                }}
              >
                読み込み優先順位（高 → 低）
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                      fontSize: "12px",
                      color: "#00d4ff",
                      minWidth: "200px",
                    }}
                  >
                    ~/.codex/AGENTS.override.md
                    <br />
                    または ~/.codex/AGENTS.md
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    グローバル設定（override 優先）
                  </span>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                      fontSize: "12px",
                      color: "#10b981",
                      minWidth: "200px",
                    }}
                  >
                    /repo-root/AGENTS.md
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>プロジェクト共通設定</span>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                      fontSize: "12px",
                      color: "#f59e0b",
                      minWidth: "200px",
                    }}
                  >
                    /subdir/AGENTS.override.md
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    サブディレクトリ固有ルール
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotR}`} />
                <div className={`${styles.codeDot} ${styles.codeDotY}`} />
                <div className={`${styles.codeDot} ${styles.codeDotG}`} />
              </div>
              <div className={styles.codeLang}>AGENTS.md テンプレート（コピーして使おう）</div>
            </div>
            <pre className={styles.codeBody}>
              <span className={styles.cm}># AGENTS.md</span>
              {"\n\n"}
              <span className={styles.cm}>## プロジェクト概要</span>
              {"\n"}
              {"- Node.js + Express + TypeScript の REST API\n"}
              {"- データベース: PostgreSQL (Prisma ORM)\n"}
              {"- テストフレームワーク: Jest\n\n"}
              <span className={styles.cm}>## コーディング規約</span>
              {"\n"}
              {"- コメントは日本語で記述すること\n"}
              {"- 関数の引数が3つ以上の場合はオブジェクト型を使う\n"}
              <span className={styles.hl}>- any 型は使用禁止。unknown を使うこと</span>
              {"\n"}
              {"- エラーハンドリングは必ず Result 型でラップする\n\n"}
              <span className={styles.cm}>## テスト・ビルドコマンド</span>
              {"\n"}
              {"- テスト実行: "}
              <span className={styles.str}>{"`npm test`"}</span>
              {"\n"}
              {"- Lint チェック: "}
              <span className={styles.str}>{"`npm run lint`"}</span>
              {"\n"}
              {"- ビルド: "}
              <span className={styles.str}>{"`npm run build`"}</span>
              {"\n"}
              {"- ⚠️ PRを開く前に必ず lint を実行すること\n\n"}
              <span className={styles.cm}>## 禁止事項</span>
              {"\n"}
              {"- package.json への新規依存追加は確認を取ること\n"}
              {"- データベースのスキーマ変更は migration ファイルを作成すること\n"}
              {"- console.log のコミットは禁止（logger を使うこと）"}
            </pre>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotR}`} />
                <div className={`${styles.codeDot} ${styles.codeDotY}`} />
                <div className={`${styles.codeDot} ${styles.codeDotG}`} />
              </div>
              <div className={styles.codeLang}>サブディレクトリへのオーバーライド例</div>
            </div>
            <pre className={styles.codeBody}>
              <span className={styles.cm}># services/payments/AGENTS.override.md</span>
              {"\n"}
              <span className={styles.cm}>## Payments サービス固有ルール</span>
              {"\n"}
              {"- テストコマンド: "}
              <span className={styles.str}>{"`make test-payments`"}</span>
              {" (npm test ではなく)\n"}
              {"- API キーのローテーション時は必ずセキュリティチャンネルに通知\n"}
              {"- PCI-DSS 準拠のため、カード情報はログに出力しないこと"}
            </pre>
          </div>

          <div className={`${styles.callout} ${styles.calloutTip}`}>
            <div className={styles.calloutIcon}>💚</div>
            <div>
              <strong>プロのヒント：</strong>AGENTS.md
              にテストコマンドを明記することが最も重要です。Codex
              は「何をもって完了か」を知るためにテストを実行します。テスト方法が分からないとコードを書いて終わりになってしまいます。
            </div>
          </div>
        </section>

        {/* SECTION 06: WORKFLOW — TODO: faithful migration */}
        <section id="workflow" className={styles.sec}>
          <div className={styles.secHeader}>
            <div className={styles.stepNum}>5</div>
            <div>
              <h2 className={styles.secTitle}>実践ワークフロー</h2>
              <p className={styles.secDesc}>1日の開発ルーティンに Codex を組み込む</p>
            </div>
          </div>

          <div className={styles.card}>
            <div
              style={{
                fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                fontSize: "13px",
                color: "#00d4ff",
                marginBottom: "16px",
              }}
            >
              ✦ プロが実践するモーニングルーティン
            </div>
            <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "16px" }}>
              WorkOS のエンジニアチームが実践する方法：朝のコーヒーを飲む前に、3〜5個のタスクを
              Codex に並列実行させる。コーヒーを飲み終わる頃にはレビュー待ちのPRが積まれている。
            </p>
            <div className={styles.codeWrap}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <div className={`${styles.codeDot} ${styles.codeDotR}`} />
                  <div className={`${styles.codeDot} ${styles.codeDotY}`} />
                  <div className={`${styles.codeDot} ${styles.codeDotG}`} />
                </div>
                <div className={styles.codeLang}>bash — 朝のバッチタスク例</div>
              </div>
              <pre className={styles.codeBody}>
                <span className={styles.cm}># タスク1: TypeScript エラー修正</span>
                {"\n"}
                <span className={styles.fn}>codex</span>{" "}
                <span className={styles.str}>
                  &quot;@src/onboarding/validator.ts の TypeScript
                  エラーをすべて修正して。型安全性を保つこと&quot;
                </span>{" "}
                &amp;{"\n\n"}
                <span className={styles.cm}># タスク2: スキーマ更新対応</span>
                {"\n"}
                <span className={styles.fn}>codex</span>{" "}
                <span className={styles.str}>
                  &quot;@api/webhooks.ts を新しいイベントスキーマに対応させて。@docs/schema-v2.md
                  を参照&quot;
                </span>{" "}
                &amp;{"\n\n"}
                <span className={styles.cm}># タスク3: テストカバレッジ向上</span>
                {"\n"}
                <span className={styles.fn}>codex</span>{" "}
                <span className={styles.str}>
                  &quot;@src/components/AdminDashboard.tsx のエラーバウンダリを改善して&quot;
                </span>{" "}
                &amp;{"\n\n"}
                <span className={styles.cm}>
                  # ↑ 全てのバックグラウンドプロセスの完了を待機する
                </span>
                {"\n"}wait
              </pre>
            </div>
          </div>

          <div className={styles.card}>
            <div
              style={{
                fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                fontSize: "13px",
                color: "#00d4ff",
                marginBottom: "12px",
              }}
            >
              ✦ Approval モード（安全設定）の理解
            </div>
            <div className={styles.tableWrap}>
              <table>
                <tbody>
                  <tr>
                    <th>モード</th>
                    <th>コマンド</th>
                    <th>動作</th>
                    <th>推奨場面</th>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.tag} ${styles.tagPlan}`}>untrusted</span>
                    </td>
                    <td>
                      <code style={{ fontFamily: "var(--font-mono,'JetBrains Mono',monospace)" }}>
                        --ask-for-approval untrusted
                      </code>
                      <br />
                      <code style={{ fontFamily: "var(--font-mono,'JetBrains Mono',monospace)" }}>
                        --sandbox read-only
                      </code>{" "}
                      (推奨)
                    </td>
                    <td style={{ color: "#94a3b8" }}>
                      すべての操作を毎回確認（既知の安全な読み取り操作を除く）。適切な sandbox
                      と組み合わせて使用。
                    </td>
                    <td>初めてのリポジトリ・重要な変更</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.tag} ${styles.tagTip}`}>on-request</span>
                    </td>
                    <td>
                      <code style={{ fontFamily: "var(--font-mono,'JetBrains Mono',monospace)" }}>
                        --ask-for-approval on-request
                      </code>
                      <br />
                      <code style={{ fontFamily: "var(--font-mono,'JetBrains Mono',monospace)" }}>
                        --sandbox workspace-write
                      </code>{" "}
                      (推奨)
                      <br />
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        ※ --full-auto の実態
                      </span>
                    </td>
                    <td style={{ color: "#94a3b8" }}>
                      ワークスペース内書き込みは許可、外部操作・ネットワークは確認。
                    </td>
                    <td>日常的な開発作業</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.tag} ${styles.tagNew}`}>never</span>
                    </td>
                    <td>
                      <code style={{ fontFamily: "var(--font-mono,'JetBrains Mono',monospace)" }}>
                        --ask-for-approval never
                      </code>
                      <br />
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        ※ 任意の sandbox と併用可能
                      </span>
                    </td>
                    <td style={{ color: "#94a3b8" }}>
                      承認プロンプトをスキップ。完全なバイパスには別途{" "}
                      <code style={{ fontSize: "11px" }}>--sandbox danger-full-access</code>{" "}
                      が必要。
                    </td>
                    <td>CI/CD・信頼済みワークフロー</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.card}>
            <div
              style={{
                fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                fontSize: "13px",
                color: "#00d4ff",
                marginBottom: "12px",
              }}
            >
              ✦ コードレビューを Codex に任せる
            </div>
            <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "16px" }}>
              コードレビューは対話モード（スラッシュコマンド）で行う方法と、ワンショットの CLI
              コマンド（自動化向け）で行う方法があります。
            </p>
            <div className={styles.codeWrap}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <div className={`${styles.codeDot} ${styles.codeDotR}`} />
                  <div className={`${styles.codeDot} ${styles.codeDotY}`} />
                  <div className={`${styles.codeDot} ${styles.codeDotG}`} />
                </div>
                <div className={styles.codeLang}>対話モード（codex 起動後に実行）</div>
              </div>
              <pre className={styles.codeBody}>
                <span className={styles.cm}># インタラクティブセッション内で実行</span>
                {"\n"}
                <span className={styles.op}>/review</span>
              </pre>
            </div>
            <div className={styles.codeWrap} style={{ marginTop: "16px" }}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <div className={`${styles.codeDot} ${styles.codeDotR}`} />
                  <div className={`${styles.codeDot} ${styles.codeDotY}`} />
                  <div className={`${styles.codeDot} ${styles.codeDotG}`} />
                </div>
                <div className={styles.codeLang}>bash — 自動化（ワンショット実行）</div>
              </div>
              <pre className={styles.codeBody}>
                <span className={styles.cm}># CIやスクリプトで一括実行</span>
                {"\n"}
                <span className={styles.fn}>codex</span> exec{" "}
                <span className={styles.str}>
                  &quot;git diff HEAD~1
                  をレビューして、潜在的なバグとセキュリティ問題を報告して&quot;
                </span>
              </pre>
            </div>
          </div>
        </section>

        {/* SECTION 07: ADVANCED */}
        <section id="advanced" className={styles.sec}>
          <div className={styles.secHeader}>
            <div className={styles.stepNum}>6</div>
            <div>
              <h2 className={styles.secTitle}>上級テクニック</h2>
              <p className={styles.secDesc}>MCP・Skills・Automations・画像入力</p>
            </div>
          </div>

          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}
              >
                <span style={{ fontSize: "24px" }}>🔌</span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                      fontSize: "14px",
                      color: "#00d4ff",
                    }}
                  >
                    MCP連携
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>Model Context Protocol</div>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "12px" }}>
                外部ツール（GitHub, Slack, Jira
                など）をCodexに接続。コードと外部サービスをシームレスに連携できます。
              </p>
              <div className={styles.codeWrap}>
                <pre className={styles.codeBody} style={{ fontSize: "12px" }}>
                  <span className={styles.cm}># config.toml でMCPサーバーを設定</span>
                  {"\n"}
                  <span className={styles.pn}>[</span>
                  <span className={styles.kw}>mcp_servers.github</span>
                  <span className={styles.pn}>]</span>
                  {"\n"}
                  <span className={styles.fn}>command</span> ={" "}
                  <span className={styles.str}>&quot;npx&quot;</span>
                  {"\n"}
                  <span className={styles.fn}>args</span> = <span className={styles.pn}>[</span>
                  <span className={styles.str}>&quot;-y&quot;</span>,{" "}
                  <span className={styles.str}>
                    &quot;@modelcontextprotocol/server-github&quot;
                  </span>
                  <span className={styles.pn}>]</span>
                </pre>
              </div>
            </div>

            <div className={styles.card}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}
              >
                <span style={{ fontSize: "24px" }}>⚡</span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                      fontSize: "14px",
                      color: "#7c3aed",
                    }}
                  >
                    Skills（スキル）
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    繰り返しワークフローを定義
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "12px" }}>
                繰り返し実行するワークフローをスキルとして定義。チームで共有することでオンボーディングも効率化。
              </p>
              <div className={styles.codeWrap}>
                <pre className={styles.codeBody} style={{ fontSize: "12px" }}>
                  <span className={styles.cm}># ~/.agents/skills/add-tests/SKILL.md</span>
                  {"\n"}
                  {
                    "---\nname: add-tests\ndescription: 指定ファイルのユニットテストを追加する\n---\n"
                  }
                  <span className={styles.kw}>## 手順</span>
                  {"\n"}
                  {
                    "1. 既存テストのパターンを確認\n2. 境界値・エラーケースを網羅\n3. npm test で確認"
                  }
                </pre>
              </div>
            </div>

            <div className={styles.card}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}
              >
                <span style={{ fontSize: "24px" }}>🤖</span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                      fontSize: "14px",
                      color: "#10b981",
                    }}
                  >
                    Automations
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    定期実行・スケジューリング
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "12px" }}>
                Codex
                Appの「Automations」タブで定期実行を設定。CHANGELOG更新・依存関係チェックなどを自動化できます。
              </p>
              <div
                className={`${styles.callout} ${styles.calloutTip}`}
                style={{ margin: 0, padding: "12px" }}
              >
                <div className={styles.calloutIcon}>💡</div>
                <div style={{ fontSize: "12px" }}>
                  Skills = 方法を定義、Automations = スケジュールを定義、という分担が最適です。
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}
              >
                <span style={{ fontSize: "24px" }}>🖼️</span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                      fontSize: "14px",
                      color: "#f59e0b",
                    }}
                  >
                    画像入力
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    スクリーンショット・デザインから実装
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "12px" }}>
                UI
                のスクリーンショットやデザインモックを入力として渡すと、それをベースにコードを生成できます。
              </p>
              <div className={styles.codeWrap}>
                <pre className={styles.codeBody} style={{ fontSize: "12px" }}>
                  <span className={styles.cm}># 画像を添付してプロンプト実行</span>
                  {"\n"}
                  <span className={styles.fn}>codex</span>{" "}
                  <span className={styles.str}>&quot;このデザインを実装して&quot;</span> \{"\n"}
                  {"  "}
                  <span className={styles.op}>-i</span> ./mockup.png
                </pre>
              </div>
            </div>
          </div>

          <div className={styles.card} style={{ marginTop: "0" }}>
            <div
              style={{
                fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                fontSize: "13px",
                color: "#00d4ff",
                marginBottom: "12px",
              }}
            >
              ✦ CI/CD での自動化例（GitHub Actions）
            </div>
            <div className={styles.codeWrap}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <div className={`${styles.codeDot} ${styles.codeDotR}`} />
                  <div className={`${styles.codeDot} ${styles.codeDotY}`} />
                  <div className={`${styles.codeDot} ${styles.codeDotG}`} />
                </div>
                <div className={styles.codeLang}>yaml — .github/workflows/codex-changelog.yml</div>
              </div>
              <pre className={styles.codeBody}>
                <span className={styles.fn}>jobs</span>
                <span className={styles.pn}>:</span>
                {"\n  "}
                <span className={styles.fn}>update_changelog</span>
                <span className={styles.pn}>:</span>
                {"\n    "}
                <span className={styles.fn}>runs-on</span>
                <span className={styles.pn}>:</span>{" "}
                <span className={styles.str}>ubuntu-latest</span>
                {"\n    "}
                <span className={styles.fn}>steps</span>
                <span className={styles.pn}>:</span>
                {"\n      "}
                <span className={styles.pn}>-</span> <span className={styles.fn}>uses</span>
                <span className={styles.pn}>:</span>{" "}
                <span className={styles.str}>actions/checkout@v4</span>
                {"\n      "}
                <span className={styles.pn}>-</span> <span className={styles.fn}>name</span>
                <span className={styles.pn}>:</span>{" "}
                <span className={styles.str}>Update CHANGELOG via Codex</span>
                {"\n        "}
                <span className={styles.fn}>run</span>
                <span className={styles.pn}>:</span> <span className={styles.pn}>|</span>
                {"\n          "}
                <span className={styles.fn}>npm</span> install <span className={styles.op}>-g</span>{" "}
                @openai/codex{"\n          "}
                <span className={styles.kw}>export</span>{" "}
                <span className={styles.op}>OPENAI_API_KEY</span>=
                <span className={styles.str}>
                  &quot;{"$"}
                  {"{{ secrets.OPENAI_API_KEY }}"}&quot;
                </span>
                {"\n          "}
                <span className={styles.fn}>codex</span> exec{" "}
                <span className={styles.str}>
                  &quot;前回タグからのコミットをもとに CHANGELOG を更新して&quot;
                </span>
              </pre>
            </div>
          </div>
        </section>

        {/* SECTION 08: DODONT — TODO: faithful migration */}
        <section id="dodont" className={styles.sec}>
          <div className={styles.secHeader}>
            <div className={styles.stepNum}>7</div>
            <div>
              <h2 className={styles.secTitle}>やること・やってはいけないこと</h2>
            </div>
          </div>
          <p style={{ color: "#94a3b8" }}>（実装予定）</p>
        </section>

        {/* SECTION 09: SOURCES — TODO: faithful migration */}
        <section id="sources" className={styles.sec}>
          <div className={styles.secHeader}>
            <div className={styles.stepNum}>8</div>
            <div>
              <h2 className={styles.secTitle}>参考文献・ソース</h2>
            </div>
          </div>
          <div className={styles.sourcesList}>
            <div className={styles.srcItem}>
              <div className={styles.srcNum}>[1]</div>
              <a
                href="https://openai.com/codex"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.srcLink}
              >
                OpenAI Codex
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
